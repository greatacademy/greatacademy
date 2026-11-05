import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
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
        "When acceleration is given in terms of position rather than time, the chain rule rewrites it as velocity times the derivative of velocity with respect to position. By the chain rule, $a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$. For $v(x) = c x^2$, the derivative is $v'(x) = 2cx$, so $a(x) = (cx^2)(2cx) = 2c^2 x^3$.",
        "当加速度用位置而不是时间表示时，链式法则把它改写成速度乘以速度对位置的导数。由链式法则，$a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$。对于 $v(x) = c x^2$，导数为 $v'(x) = 2cx$，故 $a(x) = (cx^2)(2cx) = 2c^2 x^3$。",
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
    {
      id: "acceleration-from-the-square-of-the-speed",
      title: t("Acceleration from the square of the speed", "由速度平方求加速度"),
      explanation: t(
        "Since $\\frac{d}{dx}(v^2) = 2v\\frac{dv}{dx}$, the relation $a = v\\frac{dv}{dx}$ can be written as\n\n$$a = \\frac{1}{2}\\frac{d}{dx}\\left(v^2\\right).$$\n\nThis form is convenient when $v^2$ is given as a function of position, as it is in energy calculations: differentiate $v^2$, halve the result, and there is no square root to deal with.",
        "由于 $\\frac{d}{dx}(v^2) = 2v\\frac{dv}{dx}$，关系 $a = v\\frac{dv}{dx}$ 可写成\n\n$$a = \\frac{1}{2}\\frac{d}{dx}\\left(v^2\\right)。$$\n\n当 $v^2$ 以位置的函数给出时（如能量计算中），这种形式很方便：对 $v^2$ 求导再取一半，无需处理平方根。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-4, 4);
        const q = rng.int(-6, 6);
        const r = rng.int(10, 40);
        const x0 = rng.int(1, 4);
        const ans = Q.of(2 * p * x0 + q, 2);
        return numberProblem({
          prompt: t(
            `A particle moving along the $x$-axis has $v^2 = ${poly([p, "x^2"], [q, "x"], [r, ""])}$ (in m²/s²). Find its acceleration at $x = ${x0}$.`,
            `沿 $x$ 轴运动的质点满足 $v^2 = ${poly([p, "x^2"], [q, "x"], [r, ""])}$（单位 m²/s²）。求它在 $x = ${x0}$ 处的加速度。`,
          ),
          answer: ans,
          wrong: [Q.of(2 * p * x0 + q), Q.of(p * x0 * x0 + q * x0 + r, 2), ans.neg()],
          solution: t(
            `$\\frac{d}{dx}(v^2) = ${poly([2 * p, "x"], [q, ""])}$, so $a = \\frac{1}{2}(${poly([2 * p, "x"], [q, ""])})$, which at $x = ${x0}$ is $${ans.toLatex()}$.`,
            `$\\frac{d}{dx}(v^2) = ${poly([2 * p, "x"], [q, ""])}$，所以 $a = \\frac{1}{2}(${poly([2 * p, "x"], [q, ""])})$，在 $x = ${x0}$ 处为 $${ans.toLatex()}$。`,
          ),
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
    "Integrating the relation $v\\,dv = a(x)\\,dx$ gives $v(x)^2 - v_0^2 = 2\\int a(x)\\,dx$.",
    "对关系式 $v\\,dv = a(x)\\,dx$ 积分得到 $v(x)^2 - v_0^2 = 2\\int a(x)\\,dx$。",
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
        "Separating the variables and integrating gives half the square of the velocity in terms of position, which is an energy equation. From $a(x) = v \\frac{dv}{dx}$, separating variables gives $v\\,dv = a(x)\\,dx$. Integrating from $x = 0$ (starting from rest, $v(0) = 0$) to $x_1$ gives $\\frac{1}{2}v(x_1)^2 = \\int_0^{x_1} a(x)\\,dx$, so $v(x_1)^2 = 2 \\int_0^{x_1} a(x)\\,dx$.",
        "分离变量并积分后得到用位置表示的速度平方的一半，这是一个能量方程。由 $a(x) = v \\frac{dv}{dx}$，分离变量得 $v\\,dv = a(x)\\,dx$。从 $x = 0$（初速为零 $v(0) = 0$）积分到 $x_1$ 可得 $\\frac{1}{2}v(x_1)^2 = \\int_0^{x_1} a(x)\\,dx$，即 $v(x_1)^2 = 2 \\int_0^{x_1} a(x)\\,dx$。",
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
    {
      id: "the-amplitude-of-a-restoring-force-motion",
      title: t("The amplitude of motion under a restoring acceleration", "回复加速度下运动的振幅"),
      explanation: t(
        "For $a(x) = -\\omega^2 x$, separating $v\\,dv = -\\omega^2 x\\,dx$ and integrating from $x = 0$, where the speed is $v_0$, gives\n\n$$v^2 = v_0^2 - \\omega^2 x^2.$$\n\nThe particle stops and turns back where $v = 0$, at $x = \\pm\\frac{v_0}{\\omega}$. So the amplitude of the oscillation is $A = \\frac{v_0}{\\omega}$.",
        "对 $a(x) = -\\omega^2 x$，分离 $v\\,dv = -\\omega^2 x\\,dx$ 并从速率为 $v_0$ 的 $x = 0$ 处积分，得\n\n$$v^2 = v_0^2 - \\omega^2 x^2。$$\n\n质点在 $v = 0$ 处停下并折返，即 $x = \\pm\\frac{v_0}{\\omega}$。所以振动的振幅为 $A = \\frac{v_0}{\\omega}$。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(2, 6);
        const A = rng.int(1, 8);
        const v0 = w * A;
        const ask = rng.int(0, 1) === 0;
        const x1 = rng.int(0, A - 1);
        const ans = ask ? A : v0 * v0 - w * w * x1 * x1;
        return numberProblem({
          prompt: ask
            ? t(
                `A particle has acceleration $a = -${w * w}x$ and passes $x = 0$ with speed $${v0}$ m/s. How far from the origin does it get?`,
                `质点的加速度为 $a = -${w * w}x$，以 $${v0}$ m/s 的速率经过 $x = 0$。它离原点最远多少？`,
              )
            : t(
                `A particle has acceleration $a = -${w * w}x$ and passes $x = 0$ with speed $${v0}$ m/s. Find $v^2$ at $x = ${x1}$.`,
                `质点的加速度为 $a = -${w * w}x$，以 $${v0}$ m/s 的速率经过 $x = 0$。求 $x = ${x1}$ 处的 $v^2$。`,
              ),
          answer: ans,
          wrong: ask ? [Q.of(v0, w * w), v0, w * A * A] : [v0 * v0 + w * w * x1 * x1, v0 * v0 - w * x1 * x1, v0 - w * x1],
          solution: t(
            `$v^2 = ${v0 * v0} - ${w * w}x^2$. ${ask ? `It vanishes at $x = \\frac{${v0}}{${w}} = ${A}$, so the particle reaches $${A}$ m.` : `At $x = ${x1}$ this is $${ans}$.`}`,
            `$v^2 = ${v0 * v0} - ${w * w}x^2$。${ask ? `它在 $x = \\frac{${v0}}{${w}} = ${A}$ 处为零，所以质点最远到达 $${A}$ m。` : `在 $x = ${x1}$ 处为 $${ans}$。`}`,
          ),
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
    "Acceleration splits into orthogonal tangential and normal components: $\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$, where $a_T = v'$ and $a_N = \\kappa v^2$.",
    "加速度可正交分解为切向分量与法向分量：$\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$，其中 $a_T = v'$，$a_N = \\kappa v^2$。",
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
          `A particle traverses the helix $\\mathbf{r}(t) = \\langle ${R} \\cos(${poly([k, "t"])}), ${R} \\sin(${poly([k, "t"])}), ${poly([c, "t"])} \\rangle$. Find the magnitude of the normal component of acceleration $a_N$.`,
          `一质点沿螺旋线 $\\mathbf{r}(t) = \\langle ${R} \\cos(${poly([k, "t"])}), ${R} \\sin(${poly([k, "t"])}), ${poly([c, "t"])} \\rangle$ 运动。求加速度法向分量的模长 $a_N$。`,
        );
        const solution = t(
          steps(
            `Compute velocity: $\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle -${k * R} \\sin(${poly([k, "t"])}), ${k * R} \\cos(${poly([k, "t"])}), ${c} \\rangle$.`,
            `The speed is $v = \\|\\mathbf{v}(t)\\| = \\sqrt{(${k * R})^2 + ${c}^2}$, which is constant, so tangential acceleration $a_T = \\frac{dv}{dt} = 0$.`,
            `Compute acceleration: $\\mathbf{a}(t) = \\mathbf{r}''(t) = \\langle -${k * k * R} \\cos(${poly([k, "t"])}), -${k * k * R} \\sin(${poly([k, "t"])}), 0 \\rangle$.`,
            `Because $a_T = 0$, $a_N = \\|\\mathbf{a}(t)\\| = \\sqrt{(-${k * k * R} \\cos(${poly([k, "t"])}))^2 + (-${k * k * R} \\sin(${poly([k, "t"])}))^2} = ${aN}$.`,
          ),
          steps(
            `计算速度向量：$\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle -${k * R} \\sin(${poly([k, "t"])}), ${k * R} \\cos(${poly([k, "t"])}), ${c} \\rangle$。`,
            `速率为 $v = \\|\\mathbf{v}(t)\\| = \\sqrt{(${k * R})^2 + ${c}^2}$ 为常数，故切向加速度 $a_T = \\frac{dv}{dt} = 0$。`,
            `计算加速度向量：$\\mathbf{a}(t) = \\mathbf{r}''(t) = \\langle -${k * k * R} \\cos(${poly([k, "t"])}), -${k * k * R} \\sin(${poly([k, "t"])}), 0 \\rangle$。`,
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
    {
      id: "tangential-acceleration-from-velocity-and-acceleration-vectors",
      title: t("Tangential acceleration from $\\mathbf{v}$ and $\\mathbf{a}$", "由 $\\mathbf{v}$ 与 $\\mathbf{a}$ 求切向加速度"),
      explanation: t(
        "At any instant the acceleration splits as $\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$. The tangential part is the projection of $\\mathbf{a}$ onto the direction of motion,\n\n$$a_T = \\frac{\\mathbf{v} \\cdot \\mathbf{a}}{\\|\\mathbf{v}\\|},$$\n\nand it equals the rate of change of speed. A positive $a_T$ means the particle is speeding up, a negative one that it is slowing down. The normal part then follows from $a_N = \\sqrt{\\|\\mathbf{a}\\|^2 - a_T^2}$.",
        "任一时刻加速度都可分解为 $\\mathbf{a} = a_T\\mathbf{T} + a_N\\mathbf{N}$。切向部分是 $\\mathbf{a}$ 在运动方向上的投影，\n\n$$a_T = \\frac{\\mathbf{v} \\cdot \\mathbf{a}}{\\|\\mathbf{v}\\|},$$\n\n它等于速率的变化率。$a_T$ 为正表示质点在加速，为负表示在减速。法向部分随后由 $a_N = \\sqrt{\\|\\mathbf{a}\\|^2 - a_T^2}$ 求出。",
      ),
      generate(rng: Rng): Problem {
        const triples: [number[], number][] = [
          [[1, 2, 2], 3],
          [[2, 3, 6], 7],
          [[1, 4, 8], 9],
          [[4, 4, 7], 9],
        ];
        const [p, n] = rng.pick(triples);
        const v = rng.shuffle(p.map((x) => (rng.int(0, 1) === 0 ? x : -x)));
        const a = [rng.int(-4, 4), rng.int(-4, 4), rng.nonZero(-4, 4)];
        const dot = v.reduce((s, x, i) => s + x * a[i]!, 0);
        const ans = Q.of(dot, n);
        return numberProblem({
          prompt: t(
            `At some instant a particle has velocity $\\mathbf{v} = \\langle ${v.join(", ")} \\rangle$ and acceleration $\\mathbf{a} = \\langle ${a.join(", ")} \\rangle$. Find the tangential component $a_T$.`,
            `某一时刻质点的速度为 $\\mathbf{v} = \\langle ${v.join(", ")} \\rangle$，加速度为 $\\mathbf{a} = \\langle ${a.join(", ")} \\rangle$。求切向分量 $a_T$。`,
          ),
          answer: ans,
          wrong: [Q.of(dot), Q.of(dot, n * n), ans.neg()],
          solution: t(
            `$\\mathbf{v} \\cdot \\mathbf{a} = ${dot}$ and $\\|\\mathbf{v}\\| = ${n}$, so $a_T = ${ans.toLatex()}$.`,
            `$\\mathbf{v} \\cdot \\mathbf{a} = ${dot}$，$\\|\\mathbf{v}\\| = ${n}$，所以 $a_T = ${ans.toLatex()}$。`,
          ),
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
    "The line integral of the net force along a path equals the total work done and the change in kinetic energy: $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\Delta K$.",
    "合外力沿路径的线积分等于所做的总功，也等于动能的变化量：$W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\Delta K$。",
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
        "The work done by the net force along a path equals the change in kinetic energy, so you can find one from the other. The work-energy theorem states $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$. For an even mass $m = 2k$, $W = k(v_2^2 - v_1^2)$.",
        "合力沿路径所做的功等于动能的变化，所以可以由其中一个求出另一个。动能定理指出 $W = \\int_C \\mathbf{F} \\cdot d\\mathbf{r} = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2$。对于偶数质量 $m = 2k$，做功为 $W = k(v_2^2 - v_1^2)$。",
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
    {
      id: "final-speed-from-the-work-done",
      title: t("Final speed from the work done", "由所做的功求末速率"),
      explanation: t(
        "The work–energy principle $W = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2$ can be run backwards: if the net work done on the object is known, then\n\n$$v_2 = \\sqrt{v_1^2 + \\frac{2W}{m}}.$$\n\nPositive work raises the speed and negative work lowers it. Only the total work matters, not the shape of the path or how the force varied along it.",
        "功能原理 $W = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2$ 可以反过来用：若已知对物体所做的净功，则\n\n$$v_2 = \\sqrt{v_1^2 + \\frac{2W}{m}}。$$\n\n正功使速率增大，负功使速率减小。只有总功有关，与路径形状或力沿路径如何变化无关。",
      ),
      generate(rng: Rng): Problem {
        const m = 2 * rng.int(1, 5);
        const v1 = rng.int(1, 9);
        let v2 = rng.int(1, 12);
        if (v2 === v1) v2 += 1;
        const W = (m * (v2 * v2 - v1 * v1)) / 2;
        return numberProblem({
          prompt: t(
            `An object of mass $${m}$ kg moving at $${v1}$ m/s has $${W}$ J of net work done on it. Find its final speed in m/s.`,
            `质量为 $${m}$ kg、速率为 $${v1}$ m/s 的物体受到 $${W}$ J 的净功。求它的末速率（m/s）。`,
          ),
          answer: v2,
          wrong: [v1 + Math.round((2 * W) / m), v2 * v2, Math.abs(v2 - v1)],
          solution: t(
            `$v_2^2 = ${v1 * v1} + \\frac{2(${W})}{${m}} = ${v2 * v2}$, so $v_2 = ${v2}$ m/s.`,
            `$v_2^2 = ${v1 * v1} + \\frac{2(${W})}{${m}} = ${v2 * v2}$，所以 $v_2 = ${v2}$ m/s。`,
          ),
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
    "In circular motion with radius $R$ and constant angular speed $\\omega$, the centripetal acceleration points toward the center and has magnitude $a_c = \\omega^2 R$.",
    "在半径为 $R$、角速度 $\\omega$ 恒定的圆周运动中，向心加速度指向圆心，大小为 $a_c = \\omega^2 R$。",
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
    {
      id: "centripetal-acceleration-from-the-period",
      title: t("Centripetal acceleration from the period", "由周期求向心加速度"),
      explanation: t(
        "For uniform motion $\\mathbf{r}(t) = R\\langle \\cos \\omega t, \\sin \\omega t \\rangle$, differentiating twice gives $\\mathbf{a} = -\\omega^2\\mathbf{r}$, which points to the center with size $\\omega^2R$. One revolution takes the period $T = \\frac{2\\pi}{\\omega}$, so\n\n$$\\|\\mathbf{a}\\| = \\omega^2 R = \\frac{4\\pi^2 R}{T^2}.$$\n\nHalving the period quadruples the acceleration, while doubling the radius only doubles it.",
        "对匀速圆周运动 $\\mathbf{r}(t) = R\\langle \\cos \\omega t, \\sin \\omega t \\rangle$，求两次导数得 $\\mathbf{a} = -\\omega^2\\mathbf{r}$，它指向圆心，大小为 $\\omega^2R$。转一圈用时为周期 $T = \\frac{2\\pi}{\\omega}$，所以\n\n$$\\|\\mathbf{a}\\| = \\omega^2 R = \\frac{4\\pi^2 R}{T^2}。$$\n\n周期减半使加速度变为四倍，而半径加倍只使它加倍。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 12);
        const T = rng.int(1, 6);
        const k = Q.of(4 * R, T * T);
        return numberProblem({
          prompt: t(
            `A particle moves uniformly around a circle of radius $${R}$ m, completing one revolution every $${T}$ s. Its centripetal acceleration is $k\\pi^2$ m/s². Find $k$.`,
            `质点沿半径 $${R}$ m 的圆匀速运动，每 $${T}$ s 转一圈。它的向心加速度为 $k\\pi^2$ m/s²。求 $k$。`,
          ),
          answer: k,
          wrong: [Q.of(2 * R, T), Q.of(4 * R, T), Q.of(R, T * T)],
          solution: t(
            `$\\omega = \\frac{2\\pi}{${T}}$, so $\\|\\mathbf{a}\\| = \\omega^2R = \\frac{4\\pi^2 \\cdot ${R}}{${T * T}}$ and $k = ${k.toLatex()}$.`,
            `$\\omega = \\frac{2\\pi}{${T}}$，所以 $\\|\\mathbf{a}\\| = \\omega^2R = \\frac{4\\pi^2 \\cdot ${R}}{${T * T}}$，$k = ${k.toLatex()}$。`,
          ),
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
    "The average value of a continuous function $f(x, y)$ over a plane region $D$ is $f_{\\text{avg}} = \\frac{1}{\\operatorname{Area}(D)} \\iint_D f(x, y)\\,dA$.",
    "连续函数 $f(x, y)$ 在平面区域 $D$ 上的平均值为 $f_{\\text{avg}} = \\frac{1}{\\operatorname{Area}(D)} \\iint_D f(x, y)\\,dA$。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-average-values-over-planar-domains",
      title: t("Calculating average values over planar domains", "计算平面区域上多元函数的平均值"),
      explanation: t(
        "The average value of a function over a region is its integral over the region divided by the area of the region. For $f(x, y) = ax + by$ on a rectangle $[0, W] \\times [0, H]$, the integral is $\\iint_D (ax + by)\\,dA = a \\frac{W^2}{2} H + b W \\frac{H^2}{2}$. Dividing by $\\text{Area}(D) = W H$ yields $f_{\\text{avg}} = a \\frac{W}{2} + b \\frac{H}{2}$.",
        "函数在区域上的平均值等于它在该区域上的积分除以区域的面积。对于定义在矩形 $[0, W] \\times [0, H]$ 上的函数 $f(x, y) = ax + by$，其二重积分为 $\\iint_D (ax + by)\\,dA = a \\frac{W^2}{2} H + b W \\frac{H^2}{2}$。除以底面面积 $\\text{Area}(D) = W H$ 得平均值 $f_{\\text{avg}} = a \\frac{W}{2} + b \\frac{H}{2}$。",
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
    {
      id: "average-value-over-a-disk",
      title: t("The average value over a disk", "圆盘上的平均值"),
      explanation: t(
        "The average of $f$ over a region $D$ is $\\frac{1}{\\operatorname{Area}(D)}\\iint_D f\\,dA$. On a disk of radius $R$ polar coordinates make radial functions easy: $\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi}\\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = \\frac{\\pi R^4}{2}$, and dividing by $\\pi R^2$ gives an average of $\\frac{R^2}{2}$. A constant added to $f$ is added to its average.",
        "$f$ 在区域 $D$ 上的平均值为 $\\frac{1}{\\operatorname{Area}(D)}\\iint_D f\\,dA$。在半径为 $R$ 的圆盘上，极坐标使径向函数容易计算：$\\iint_D (x^2 + y^2)\\,dA = \\int_0^{2\\pi}\\int_0^R r^2 \\cdot r\\,dr\\,d\\theta = \\frac{\\pi R^4}{2}$，除以 $\\pi R^2$ 得平均值 $\\frac{R^2}{2}$。给 $f$ 加一个常数，平均值也加上这个常数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-6, 6);
        const R = rng.int(1, 5);
        const ans = Q.of(a * R * R + 2 * b, 2);
        return numberProblem({
          prompt: t(
            `Find the average value of $f(x, y) = ${poly([a, "(x^2 + y^2)"], [b, ""])}$ over the disk $x^2 + y^2 \\le ${R * R}$.`,
            `求 $f(x, y) = ${poly([a, "(x^2 + y^2)"], [b, ""])}$ 在圆盘 $x^2 + y^2 \\le ${R * R}$ 上的平均值。`,
          ),
          answer: ans,
          wrong: [Q.of(a * R * R + b), Q.of(a * R * R + 3 * b, 3), Q.of(a * R * R * R * R + 2 * b, 2)],
          solution: t(
            `The average of $x^2 + y^2$ over the disk is $\\frac{R^2}{2} = ${Q.of(R * R, 2).toLatex()}$, so the average of $f$ is $${a < 0 ? `(${a})` : a} \\cdot ${Q.of(R * R, 2).toLatex()} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${ans.toLatex()}$.`,
            `$x^2 + y^2$ 在圆盘上的平均值为 $\\frac{R^2}{2} = ${Q.of(R * R, 2).toLatex()}$，所以 $f$ 的平均值为 $${a < 0 ? `(${a})` : a} \\cdot ${Q.of(R * R, 2).toLatex()} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${ans.toLatex()}$。`,
          ),
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
    "The total mass or net charge of a plane lamina with area density $\\rho(x, y)$ is $M = \\iint_D \\rho(x, y)\\,dA$.",
    "面密度为 $\\rho(x, y)$ 的平面薄片的总质量或净电荷为 $M = \\iint_D \\rho(x, y)\\,dA$。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-total-mass-and-charge-from-area-density",
      title: t("Calculating total mass and charge from area density", "由面密度积分计算薄片总质量与总电荷"),
      explanation: t(
        "Density is mass per unit area, so integrating the density over the region adds up the mass of all the small pieces. Given area density $\\rho(x, y) = ax + b$ on $[0, W] \\times [0, H]$, the total mass is $M = \\int_0^H dy \\int_0^W (ax + b)\\,dx = H [a \\frac{W^2}{2} + bW]$.",
        "密度是单位面积的质量，所以把密度在区域上积分，就把所有小块的质量加了起来。对于在矩形 $[0, W] \\times [0, H]$ 上面密度为 $\\rho(x, y) = ax + b$ 的薄片，总质量为 $M = \\int_0^H dy \\int_0^W (ax + b)\\,dx = H [a \\frac{W^2}{2} + bW]$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const halfW = rng.int(1, 5);
        const W = 2 * halfW;
        const H = rng.int(2, 6);
        const mass = H * (a * halfW * W + b * W);

        const prompt = t(
          `Find the total mass $M$ of a planar lamina occupying the rectangle $D = [0, ${W}] \\times [0, ${H}]$ with density function $\\rho(x, y) = ${poly([a, "x"])} + ${b}$.`,
          `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$、面密度为 $\\rho(x, y) = ${poly([a, "x"])} + ${b}$ 的平面薄片的总质量 $M$。`,
        );
        const solution = t(
          steps(
            `Total mass is given by $M = \\iint_D \\rho(x, y)\\,dA = \\int_0^{${H}} dy \\int_0^{${W}} (${poly([a, "x"])} + ${b})\\,dx$.`,
            `Integrate with respect to $x$: $\\left[\\frac{${a}}{2}x^2 + ${poly([b, "x"])}\\right]_0^{${W}} = ${a}\\left(\\frac{${W}^2}{2}\\right) + ${b}(${W}) = ${a * halfW * W} + ${b * W} = ${a * halfW * W + b * W}$.`,
            `Integrate with respect to $y$: multiply by $H = ${H}$: $M = (${a * halfW * W + b * W}) \\times ${H} = ${mass}$.`,
          ),
          steps(
            `总质量公式为 $M = \\iint_D \\rho(x, y)\\,dA = \\int_0^{${H}} dy \\int_0^{${W}} (${poly([a, "x"])} + ${b})\\,dx$。`,
            `对 $x$ 积分：$\\left[\\frac{${a}}{2}x^2 + ${poly([b, "x"])}\\right]_0^{${W}} = ${a * halfW * W + b * W}$。`,
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
    {
      id: "charge-on-a-triangular-plate",
      title: t("Charge on a triangular plate", "三角形板上的电荷"),
      explanation: t(
        "Total charge is the double integral of the charge density, $Q = \\iint_D \\sigma(x, y)\\,dA$, just as mass is the integral of mass density. For the triangle $0 \\le y \\le x \\le L$, integrate $y$ first from $0$ to $x$:\n\n$$\\iint_D \\sigma\\,dA = \\int_0^L \\int_0^x \\sigma(x, y)\\,dy\\,dx.$$\n\nWith $\\sigma = cx$ the inner integral is $cx^2$, and the total is $\\frac{cL^3}{3}$.",
        "总电荷是电荷密度的二重积分 $Q = \\iint_D \\sigma(x, y)\\,dA$，正如质量是质量密度的积分。对三角形 $0 \\le y \\le x \\le L$，先对 $y$ 从 $0$ 积到 $x$：\n\n$$\\iint_D \\sigma\\,dA = \\int_0^L \\int_0^x \\sigma(x, y)\\,dy\\,dx。$$\n\n若 $\\sigma = cx$，内层积分为 $cx^2$，总量为 $\\frac{cL^3}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(1, 6);
        const c = rng.int(1, 6);
        const useY = rng.int(0, 1) === 1;
        // ∫0^L ∫0^x c y dy dx = c L^3 / 6.
        const ans = useY ? Q.of(c * L * L * L, 6) : Q.of(c * L * L * L, 3);
        const sigma = useY ? poly([c, "y"]) : poly([c, "x"]);
        return numberProblem({
          prompt: t(
            `A plate occupies the triangle $0 \\le y \\le x \\le ${L}$ with charge density $\\sigma(x, y) = ${sigma}$ C/m². Find the total charge.`,
            `一块板占据三角形 $0 \\le y \\le x \\le ${L}$，电荷密度为 $\\sigma(x, y) = ${sigma}$ C/m²。求总电荷。`,
          ),
          answer: ans,
          wrong: [Q.of(c * L * L, 2), useY ? Q.of(c * L * L * L, 3) : Q.of(c * L * L * L, 6), Q.of(c * L * L * L, 2)],
          solution: useY
            ? t(
                `$\\int_0^x ${sigma}\\,dy = ${Q.of(c, 2).toLatex()}x^2$, and $\\int_0^{${L}} ${Q.of(c, 2).toLatex()}x^2\\,dx = ${ans.toLatex()}$.`,
                `$\\int_0^x ${sigma}\\,dy = ${Q.of(c, 2).toLatex()}x^2$，$\\int_0^{${L}} ${Q.of(c, 2).toLatex()}x^2\\,dx = ${ans.toLatex()}$。`,
              )
            : t(
                `$\\int_0^x ${sigma}\\,dy = ${poly([c, "x^2"])}$, and $\\int_0^{${L}} ${poly([c, "x^2"])}\\,dx = ${ans.toLatex()}$.`,
                `$\\int_0^x ${sigma}\\,dy = ${poly([c, "x^2"])}$，$\\int_0^{${L}} ${poly([c, "x^2"])}\\,dx = ${ans.toLatex()}$。`,
              ),
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
    "The first moments $M_y = \\iint x\\rho\\,dA$ and $M_x = \\iint y\\rho\\,dA$ locate the center of mass $(\\bar{x}, \\bar{y}) = \\left(\\frac{M_y}{M}, \\frac{M_x}{M}\\right)$.",
    "一阶矩 $M_y = \\iint x\\rho\\,dA$ 与 $M_x = \\iint y\\rho\\,dA$ 确定质心 $(\\bar{x}, \\bar{y}) = \\left(\\frac{M_y}{M}, \\frac{M_x}{M}\\right)$。",
  ),
  prerequisites: ["density-mass-and-charge-of-plane-laminas"],
  encompasses: [{ topic: "density-mass-and-charge-of-plane-laminas", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "defining-moments-and-center-of-mass-coordinates",
      title: t("Defining moments and center of mass coordinates", "一阶矩与质心坐标的定义"),
      explanation: t(
        "A moment weights each piece of mass by its distance from an axis, and dividing the moment by the total mass gives the coordinate of the center of mass. The first moment about the $y$-axis is $M_y = \\iint_D x \\rho(x, y)\\,dA$. For a uniform lamina ($\\rho = 1$) over $[0, W] \\times [0, H]$, $M_y = \\int_0^H dy \\int_0^W x\\,dx = H \\frac{W^2}{2}$.",
        "力矩用每一小块质量到轴的距离对它加权，把力矩除以总质量就得到质心的坐标。薄片对 $y$ 轴的一阶矩为 $M_y = \\iint_D x \\rho(x, y)\\,dA$。对于矩形 $[0, W] \\times [0, H]$ 上的均匀薄片（$\\rho = 1$），$M_y = \\int_0^H dy \\int_0^W x\\,dx = H \\frac{W^2}{2}$。",
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
    {
      id: "center-of-mass-of-point-masses",
      title: t("The center of mass of point masses", "质点组的质心"),
      explanation: t(
        "For point masses $m_i$ at $(x_i, y_i)$, the moments about the axes are $M_y = \\sum m_i x_i$ and $M_x = \\sum m_i y_i$, and the center of mass is\n\n$$\\bar{x} = \\frac{M_y}{m}, \\qquad \\bar{y} = \\frac{M_x}{m}, \\qquad m = \\sum m_i.$$\n\nNote the crossed labels: the moment about the $y$-axis uses the $x$-coordinates, because $x$ is the distance from that axis.",
        "对位于 $(x_i, y_i)$ 的质点 $m_i$，关于两轴的矩为 $M_y = \\sum m_i x_i$ 与 $M_x = \\sum m_i y_i$，质心为\n\n$$\\bar{x} = \\frac{M_y}{m}, \\qquad \\bar{y} = \\frac{M_x}{m}, \\qquad m = \\sum m_i。$$\n\n注意下标是交叉的：关于 $y$ 轴的矩用 $x$ 坐标，因为 $x$ 是到该轴的距离。",
      ),
      generate(rng: Rng): Problem {
        const ms = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
        const xs = rng.sample([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5], 3);
        const pts = ms.map((_, i) => [xs[i]!, rng.int(-4, 5)] as const);
        const askX = rng.int(0, 1) === 0;
        const m = ms[0]! + ms[1]! + ms[2]!;
        const mom = ms.reduce((s, mi, i) => s + mi * pts[i]![askX ? 0 : 1], 0);
        const ans = Q.of(mom, m);
        const list = ms.map((mi, i) => `$${mi}$ kg at $(${pts[i]![0]}, ${pts[i]![1]})$`);
        const listZh = ms.map((mi, i) => `$(${pts[i]![0]}, ${pts[i]![1]})$ 处 $${mi}$ kg`);
        return numberProblem({
          prompt: t(
            `Point masses are placed as follows: ${list.join(", ")}. Find $${askX ? "\\bar{x}" : "\\bar{y}"}$ of the center of mass.`,
            `质点放置如下：${listZh.join("，")}。求质心的 $${askX ? "\\bar{x}" : "\\bar{y}"}$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(
              pts.reduce((s, p) => s + p[askX ? 0 : 1], 0),
              3,
            ),
            Q.of(
              ms.reduce((s, mi, i) => s + mi * pts[i]![askX ? 1 : 0], 0),
              m,
            ),
            Q.of(mom),
          ],
          solution: t(
            `$m = ${m}$ and $${askX ? "M_y" : "M_x"} = ${ms.map((mi, i) => `${mi}(${pts[i]![askX ? 0 : 1]})`).join(" + ")} = ${mom}$, so $${askX ? "\\bar{x}" : "\\bar{y}"} = ${ans.toLatex()}$.`,
            `$m = ${m}$，$${askX ? "M_y" : "M_x"} = ${ms.map((mi, i) => `${mi}(${pts[i]![askX ? 0 : 1]})`).join(" + ")} = ${mom}$，所以 $${askX ? "\\bar{x}" : "\\bar{y}"} = ${ans.toLatex()}$。`,
          ),
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
          `A thin straight rod occupies the interval $[0, ${L}]$ with linear density $\\lambda(x) = ${poly([k, "x"])}$. Find the total mass $m$ of the rod.`,
          `一根细直棒占据区间 $[0, ${L}]$，其线密度为 $\\lambda(x) = ${poly([k, "x"])}$。求该细棒的总质量 $m$。`,
        );
        const solution = t(
          steps(
            `Total mass is obtained by integrating the linear density: $m = \\int_0^{${L}} \\lambda(x)\\,dx = \\int_0^{${L}} ${poly([k, "x"])}\\,dx$.`,
            `Evaluate the integral: $m = \\left[${poly([kappa, "x^2"])}\\right]_0^{${L}} = ${kappa}(${L})^2 = ${kappa}(${L * L}) = ${mass}$.`,
          ),
          steps(
            `总质量由对线密度积分求得：$m = \\int_0^{${L}} \\lambda(x)\\,dx = \\int_0^{${L}} ${poly([k, "x"])}\\,dx$。`,
            `定积分求值：$m = \\left[${poly([kappa, "x^2"])}\\right]_0^{${L}} = ${kappa}(${L})^2 = ${mass}$。`,
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
    {
      id: "center-of-mass-of-a-rod-with-linear-density",
      title: t("The center of mass of a rod with varying density", "变密度细杆的质心"),
      explanation: t(
        "A rod on $[0, L]$ with linear density $\\lambda(x)$ has mass $m = \\int_0^L \\lambda\\,dx$ and moment $M_0 = \\int_0^L x\\lambda\\,dx$ about the origin. Its center of mass is $\\bar{x} = \\frac{M_0}{m}$. When the density increases along the rod, $\\bar{x}$ moves past the midpoint $\\frac{L}{2}$ toward the heavier end.",
        "位于 $[0, L]$、线密度为 $\\lambda(x)$ 的细杆，质量为 $m = \\int_0^L \\lambda\\,dx$，关于原点的矩为 $M_0 = \\int_0^L x\\lambda\\,dx$。质心为 $\\bar{x} = \\frac{M_0}{m}$。当密度沿杆增大时，$\\bar{x}$ 越过中点 $\\frac{L}{2}$ 移向较重的一端。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(1, 6);
        const k = rng.int(1, 4);
        const c = rng.int(1, 5);
        // m = kL^2/2 + cL, M0 = kL^3/3 + cL^2/2.
        const m = Q.of(k * L * L + 2 * c * L, 2);
        const M0 = Q.of(2 * k * L * L * L + 3 * c * L * L, 6);
        const ans = M0.div(m);
        return numberProblem({
          prompt: t(
            `A rod occupies $[0, ${L}]$ with linear density $\\lambda(x) = ${poly([k, "x"], [c, ""])}$ kg/m. Find its center of mass $\\bar{x}$.`,
            `细杆占据 $[0, ${L}]$，线密度为 $\\lambda(x) = ${poly([k, "x"], [c, ""])}$ kg/m。求其质心 $\\bar{x}$。`,
          ),
          answer: ans,
          wrong: [Q.of(L, 2), M0, Q.of(2 * L, 3)],
          solution: t(
            `$m = ${m.toLatex()}$ and $M_0 = \\int_0^{${L}} x(${poly([k, "x"], [c, ""])})\\,dx = ${M0.toLatex()}$, so $\\bar{x} = ${ans.toLatex()}$.`,
            `$m = ${m.toLatex()}$，$M_0 = \\int_0^{${L}} x(${poly([k, "x"], [c, ""])})\\,dx = ${M0.toLatex()}$，所以 $\\bar{x} = ${ans.toLatex()}$。`,
          ),
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
        "When the density increases in one direction, the center of mass shifts toward the denser side, away from the geometric center. For a rectangle $[0, W] \\times [0, H]$ with density $\\rho(x, y) = c x$, the $x$-centroid coordinate is $\\bar{x} = \\frac{\\int_0^W x^2 dx}{\\int_0^W x dx} = \\frac{\\frac{1}{3}W^3}{\\frac{1}{2}W^2} = \\frac{2}{3}W$. When $W = 3w$, $\\bar{x} = 2w$.",
        "当密度沿某个方向增大时，质心会偏离几何中心，向密度较大的一侧移动。对于在矩形 $[0, W] \\times [0, H]$ 上面密度为 $\\rho(x, y) = c x$ 的薄片，质心横坐标为 $\\bar{x} = \\frac{\\int_0^W x^2 dx}{\\int_0^W x dx} = \\frac{\\frac{1}{3}W^3}{\\frac{1}{2}W^2} = \\frac{2}{3}W$。若 $W = 3w$，则 $\\bar{x} = 2w$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const w = rng.int(1, 8);
        const W = 3 * w;
        const H = rng.int(2, 8);
        const xBar = 2 * w;

        const prompt = t(
          `Find the $x$-coordinate of the center of mass $\\bar{x}$ of the planar lamina occupying $D = [0, ${W}] \\times [0, ${H}]$ with density $\\rho(x, y) = ${poly([c, "x"])}$.`,
          `求占据矩形区域 $D = [0, ${W}] \\times [0, ${H}]$、面密度为 $\\rho(x, y) = ${poly([c, "x"])}$ 的平面薄片质心的横坐标 $\\bar{x}$。`,
        );
        const solution = t(
          steps(
            `The total mass is $M = \\iint_D ${poly([c, "x"])}\\,dA = ${c} H \\int_0^{${W}} x\\,dx = ${c} H \\left(\\frac{${W}^2}{2}\\right)$.`,
            `The moment about the $y$-axis is $M_y = \\iint_D x(${poly([c, "x"])})\\,dA = ${c} H \\int_0^{${W}} x^2\\,dx = ${c} H \\left(\\frac{${W}^3}{3}\\right)$.`,
            `Compute $\\bar{x} = \\frac{M_y}{M} = \\frac{\\frac{1}{3}W^3}{\\frac{1}{2}W^2} = \\frac{2}{3}W = \\frac{2}{3}(${W}) = ${xBar}$.`,
          ),
          steps(
            `总质量为 $M = \\iint_D ${poly([c, "x"])}\\,dA = ${c} H \\int_0^{${W}} x\\,dx = ${c} H \\frac{${W}^2}{2}$。`,
            `对 $y$ 轴一阶矩为 $M_y = \\iint_D x(${poly([c, "x"])})\\,dA = ${c} H \\int_0^{${W}} x^2\\,dx = ${c} H \\frac{${W}^3}{3}$。`,
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
    {
      id: "centroid-of-the-region-under-a-parabola",
      title: t("The centroid of the region under a parabola", "抛物线下区域的形心"),
      explanation: t(
        "For a uniform lamina under $y = f(x)$ on $[0, a]$, the area is $A = \\int_0^a f\\,dx$ and the moments come from integrating thin vertical strips:\n\n$$M_y = \\int_0^a x f(x)\\,dx, \\qquad M_x = \\int_0^a \\frac{f(x)^2}{2}\\,dx.$$\n\nThe factor $\\frac{1}{2}$ appears because each strip's own center sits at height $\\frac{f(x)}{2}$. Then $\\bar{x} = \\frac{M_y}{A}$ and $\\bar{y} = \\frac{M_x}{A}$.",
        "对 $[0, a]$ 上 $y = f(x)$ 下方的均匀薄板，面积为 $A = \\int_0^a f\\,dx$，矩由竖直细条积分得到：\n\n$$M_y = \\int_0^a x f(x)\\,dx, \\qquad M_x = \\int_0^a \\frac{f(x)^2}{2}\\,dx。$$\n\n出现因子 $\\frac{1}{2}$ 是因为每个细条自身的中心在高度 $\\frac{f(x)}{2}$ 处。于是 $\\bar{x} = \\frac{M_y}{A}$，$\\bar{y} = \\frac{M_x}{A}$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 5);
        const a = rng.int(1, 6);
        const askX = rng.int(0, 1) === 0;
        // A = c a^3/3, M_y = c a^4/4, M_x = c^2 a^5/10.
        const ans = askX ? Q.of(3 * a, 4) : Q.of(3 * c * a * a, 10);
        const f = poly([c, "x^2"]);
        return numberProblem({
          prompt: t(
            `Find $${askX ? "\\bar{x}" : "\\bar{y}"}$ for the uniform lamina bounded by $y = ${f}$, $y = 0$ and $x = ${a}$.`,
            `求由 $y = ${f}$、$y = 0$ 与 $x = ${a}$ 围成的均匀薄板的 $${askX ? "\\bar{x}" : "\\bar{y}"}$。`,
          ),
          answer: ans,
          wrong: askX
            ? [Q.of(a, 2), Q.of(2 * a, 3), Q.of(3 * a * a, 4)]
            : [Q.of(3 * c * a * a, 5), Q.of(c * a * a, 2), Q.of(3 * c * a * a, 20)],
          solution: askX
            ? t(
                `$A = ${Q.of(c * a * a * a, 3).toLatex()}$ and $M_y = \\int_0^{${a}} ${poly([c, "x^3"])}\\,dx = ${Q.of(c * a ** 4, 4).toLatex()}$, so $\\bar{x} = ${ans.toLatex()}$.`,
                `$A = ${Q.of(c * a * a * a, 3).toLatex()}$，$M_y = \\int_0^{${a}} ${poly([c, "x^3"])}\\,dx = ${Q.of(c * a ** 4, 4).toLatex()}$，所以 $\\bar{x} = ${ans.toLatex()}$。`,
              )
            : t(
                `$A = ${Q.of(c * a * a * a, 3).toLatex()}$ and $M_x = \\int_0^{${a}} \\frac{${c * c}x^4}{2}\\,dx = ${Q.of(c * c * a ** 5, 10).toLatex()}$, so $\\bar{y} = ${ans.toLatex()}$.`,
                `$A = ${Q.of(c * a * a * a, 3).toLatex()}$，$M_x = \\int_0^{${a}} \\frac{${c * c}x^4}{2}\\,dx = ${Q.of(c * c * a ** 5, 10).toLatex()}$，所以 $\\bar{y} = ${ans.toLatex()}$。`,
              ),
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
    "The moments of inertia about the coordinate axes are $I_x = \\iint y^2\\rho\\,dA$ and $I_y = \\iint x^2\\rho\\,dA$.",
    "薄片对坐标轴的转动惯量为 $I_x = \\iint y^2\\rho\\,dA$ 与 $I_y = \\iint x^2\\rho\\,dA$。",
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
        "A moment of inertia weights each piece of mass by the square of its distance from the axis, measuring how hard the object is to rotate. For a uniform rectangular lamina $[0, W] \\times [0, H]$ with $\\rho = 1$, the moment of inertia about the $x$-axis is $I_x = \\int_0^W dx \\int_0^H y^2\\,dy = W \\frac{H^3}{3}$.",
        "转动惯量用每一小块质量到轴的距离的平方对它加权，衡量物体转动的难易程度。对于在 $[0, W] \\times [0, H]$ 上面密度为 $\\rho = 1$ 的均匀矩形薄片，对 $x$ 轴的转动惯量为 $I_x = \\int_0^W dx \\int_0^H y^2\\,dy = W \\frac{H^3}{3}$。",
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
    {
      id: "the-polar-moment-of-inertia",
      title: t("The polar moment of inertia", "极转动惯量"),
      explanation: t(
        "The moment of inertia about the origin, for rotation in the plane of the lamina, is $I_0 = \\iint_D (x^2 + y^2)\\rho\\,dA$. Since $x^2 + y^2$ splits into two pieces, it is the sum of the moments about the two axes:\n\n$$I_0 = I_x + I_y.$$\n\nFor a uniform rectangle $[0, W] \\times [0, H]$ of density $\\rho$, $I_x = \\frac{\\rho WH^3}{3}$ and $I_y = \\frac{\\rho W^3H}{3}$.",
        "关于原点、在薄板所在平面内转动的转动惯量为 $I_0 = \\iint_D (x^2 + y^2)\\rho\\,dA$。由于 $x^2 + y^2$ 分成两部分，它是关于两轴转动惯量之和：\n\n$$I_0 = I_x + I_y。$$\n\n对密度为 $\\rho$ 的均匀矩形 $[0, W] \\times [0, H]$，$I_x = \\frac{\\rho WH^3}{3}$，$I_y = \\frac{\\rho W^3H}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(1, 5);
        let H = rng.int(1, 5);
        if (H === W) H += 1;
        const rho = rng.int(1, 4);
        const Ix = Q.of(rho * W * H ** 3, 3);
        const Iy = Q.of(rho * W ** 3 * H, 3);
        const ans = Ix.add(Iy);
        return numberProblem({
          prompt: t(
            `Find the polar moment of inertia $I_0$ of the rectangle $[0, ${W}] \\times [0, ${H}]$ with constant density $\\rho = ${rho}$.`,
            `求常密度 $\\rho = ${rho}$ 的矩形 $[0, ${W}] \\times [0, ${H}]$ 的极转动惯量 $I_0$。`,
          ),
          answer: ans,
          wrong: [Ix, Iy, Q.of(rho * W * H * (W * W + H * H), 12)],
          solution: t(
            `$I_x = \\frac{${rho} \\cdot ${W} \\cdot ${H}^3}{3} = ${Ix.toLatex()}$ and $I_y = \\frac{${rho} \\cdot ${W}^3 \\cdot ${H}}{3} = ${Iy.toLatex()}$, so $I_0 = ${ans.toLatex()}$.`,
            `$I_x = \\frac{${rho} \\cdot ${W} \\cdot ${H}^3}{3} = ${Ix.toLatex()}$，$I_y = \\frac{${rho} \\cdot ${W}^3 \\cdot ${H}}{3} = ${Iy.toLatex()}$，所以 $I_0 = ${ans.toLatex()}$。`,
          ),
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
    "The moment of inertia about any axis $L$ is $I_L = \\iint d(x, y)^2\\rho\\,dA$, where $d(x, y)$ is the perpendicular distance from $(x, y)$ to $L$.",
    "对任意轴 $L$ 的转动惯量为 $I_L = \\iint d(x, y)^2\\rho\\,dA$，其中 $d(x, y)$ 为点 $(x, y)$ 到 $L$ 的垂直距离。",
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
    {
      id: "moment-of-inertia-about-a-line-outside-the-lamina",
      title: t("Moment of inertia about a line outside the lamina", "关于薄板外直线的转动惯量"),
      explanation: t(
        "The moment of inertia about any line integrates the squared distance to that line. For the horizontal line $y = -d$, a point at height $y$ is at distance $y + d$, so for a uniform rectangle $[0, W] \\times [0, H]$\n\n$$I = \\int_0^W \\int_0^H (y + d)^2\\,dy\\,dx = \\frac{W\\left[(H + d)^3 - d^3\\right]}{3}.$$\n\nThe substitution $u = y + d$ makes the inner integral immediate.",
        "关于任意直线的转动惯量是对到该直线距离的平方积分。对水平线 $y = -d$，高度为 $y$ 的点到它的距离为 $y + d$，所以对均匀矩形 $[0, W] \\times [0, H]$\n\n$$I = \\int_0^W \\int_0^H (y + d)^2\\,dy\\,dx = \\frac{W\\left[(H + d)^3 - d^3\\right]}{3}。$$\n\n代换 $u = y + d$ 使内层积分一步可得。",
      ),
      generate(rng: Rng): Problem {
        const W = rng.int(1, 5);
        const H = rng.int(1, 4);
        const d = rng.int(1, 4);
        const ans = Q.of(W * ((H + d) ** 3 - d ** 3), 3);
        return numberProblem({
          prompt: t(
            `Find the moment of inertia of the uniform lamina $[0, ${W}] \\times [0, ${H}]$ (density $1$) about the line $y = -${d}$.`,
            `求均匀薄板 $[0, ${W}] \\times [0, ${H}]$（密度为 $1$）关于直线 $y = -${d}$ 的转动惯量。`,
          ),
          answer: ans,
          wrong: [Q.of(W * H ** 3, 3), Q.of(W * (H + d) ** 3, 3), Q.of(W * ((H - d) ** 3 + d ** 3), 3)],
          solution: t(
            `$\\int_0^{${H}} (y + ${d})^2\\,dy = \\frac{${H + d}^3 - ${d}^3}{3} = ${Q.of((H + d) ** 3 - d ** 3, 3).toLatex()}$; times the width $${W}$ gives $${ans.toLatex()}$.`,
            `$\\int_0^{${H}} (y + ${d})^2\\,dy = \\frac{${H + d}^3 - ${d}^3}{3} = ${Q.of((H + d) ** 3 - d ** 3, 3).toLatex()}$；乘以宽度 $${W}$ 得 $${ans.toLatex()}$。`,
          ),
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
    "The radius of gyration $\\bar{k}$ is the distance at which the whole mass could be concentrated with the same moment of inertia: $I = M\\bar{k}^2$.",
    "回转半径 $\\bar{k}$ 是把全部质量集中于一点而转动惯量不变时该点的距离：$I = M\\bar{k}^2$。",
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
    {
      id: "radius-of-gyration-of-a-rod-with-power-density",
      title: t("Radius of gyration with a power-law density", "幂律密度下的回转半径"),
      explanation: t(
        "The radius of gyration $k$ is the distance at which the whole mass, concentrated at one point, would give the same moment of inertia: $k^2 = \\frac{I}{m}$. For a rod on $[0, L]$ with density $\\lambda = cx^n$, about the end at the origin,\n\n$$m = \\frac{cL^{n+1}}{n+1}, \\qquad I = \\frac{cL^{n+3}}{n+3}, \\qquad k^2 = \\frac{n+1}{n+3}L^2.$$\n\nThe constant $c$ cancels, and more mass toward the far end makes $k$ closer to $L$.",
        "回转半径 $k$ 是把全部质量集中在一点时、给出相同转动惯量的距离：$k^2 = \\frac{I}{m}$。对 $[0, L]$ 上密度 $\\lambda = cx^n$ 的细杆，关于原点处的端点，\n\n$$m = \\frac{cL^{n+1}}{n+1}, \\qquad I = \\frac{cL^{n+3}}{n+3}, \\qquad k^2 = \\frac{n+1}{n+3}L^2。$$\n\n常数 $c$ 约去，质量越集中在远端，$k$ 越接近 $L$。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(0, 4);
        const L = rng.int(1, 6);
        const c = rng.int(1, 5);
        const ans = Q.of((n + 1) * L * L, n + 3);
        const dens = n === 0 ? `${c}` : `${c === 1 ? "" : c}x${n === 1 ? "" : `^${n}`}`;
        return numberProblem({
          prompt: t(
            `A rod on $[0, ${L}]$ has linear density $\\lambda(x) = ${dens}$. Find the square of its radius of gyration $k^2$ about the end at $x = 0$.`,
            `$[0, ${L}]$ 上的细杆线密度为 $\\lambda(x) = ${dens}$。求它关于 $x = 0$ 处端点的回转半径的平方 $k^2$。`,
          ),
          answer: ans,
          wrong: [Q.of(L * L, 3), Q.of((n + 1) * L * L, n + 2), Q.of(c * (n + 1) * L * L, n + 3)],
          solution: t(
            `$m = \\frac{${c} \\cdot ${L}^{${n + 1}}}{${n + 1}}$ and $I = \\frac{${c} \\cdot ${L}^{${n + 3}}}{${n + 3}}$, so $k^2 = \\frac{I}{m} = \\frac{${n + 1}}{${n + 3}} \\cdot ${L * L} = ${ans.toLatex()}$.`,
            `$m = \\frac{${c} \\cdot ${L}^{${n + 1}}}{${n + 1}}$，$I = \\frac{${c} \\cdot ${L}^{${n + 3}}}{${n + 3}}$，所以 $k^2 = \\frac{I}{m} = \\frac{${n + 1}}{${n + 3}} \\cdot ${L * L} = ${ans.toLatex()}$。`,
          ),
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
    "The parallel axis theorem relates the moment of inertia about any axis to that about the parallel axis through the center of mass: $I = I_{\\text{cm}} + Md^2$.",
    "平行轴定理指出，绕任意轴的转动惯量与绕过质心的平行轴的转动惯量满足 $I = I_{\\text{cm}} + Md^2$。",
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
    {
      id: "moving-between-two-parallel-axes",
      title: t("Moving between two axes that miss the center of mass", "在两条不过质心的平行轴之间换算"),
      explanation: t(
        "The parallel axis theorem $I = I_{\\text{cm}} + Md^2$ always goes through the center of mass. To move from one off-center axis at distance $d_1$ to another at distance $d_2$, first go back to the center of mass and then out again:\n\n$$I_2 = I_1 - Md_1^2 + Md_2^2.$$\n\nAdding $M(d_2 - d_1)^2$ directly is a common mistake; it is only right when $d_1 = 0$.",
        "平行轴定理 $I = I_{\\text{cm}} + Md^2$ 总是经过质心。从距质心 $d_1$ 的一条轴换到距质心 $d_2$ 的另一条轴，要先回到质心再移出去：\n\n$$I_2 = I_1 - Md_1^2 + Md_2^2。$$\n\n直接加上 $M(d_2 - d_1)^2$ 是常见错误，只有当 $d_1 = 0$ 时才对。",
      ),
      generate(rng: Rng): Problem {
        const M = rng.int(1, 6);
        const Icm = rng.int(2, 20);
        const d1 = rng.int(1, 3);
        let d2 = rng.int(1, 5);
        if (d2 === d1) d2 += 1;
        const I1 = Icm + M * d1 * d1;
        const ans = Icm + M * d2 * d2;
        return numberProblem({
          prompt: t(
            `A body of mass $${M}$ kg has moment of inertia $${I1}$ kg·m² about an axis $${d1}$ m from its center of mass. Find its moment of inertia about a parallel axis $${d2}$ m from the center of mass.`,
            `质量为 $${M}$ kg 的物体关于距质心 $${d1}$ m 的轴的转动惯量为 $${I1}$ kg·m²。求它关于距质心 $${d2}$ m 的平行轴的转动惯量。`,
          ),
          answer: ans,
          wrong: [I1 + M * (d2 - d1) ** 2, I1 + M * d2 * d2, Icm],
          solution: t(
            `$I_{\\text{cm}} = ${I1} - ${M}(${d1})^2 = ${Icm}$, so $I_2 = ${Icm} + ${M}(${d2})^2 = ${ans}$ kg·m².`,
            `$I_{\\text{cm}} = ${I1} - ${M}(${d1})^2 = ${Icm}$，所以 $I_2 = ${Icm} + ${M}(${d2})^2 = ${ans}$ kg·m²。`,
          ),
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
    "A joint probability density function $f(x, y)$ satisfies $f(x, y) \\ge 0$ and $\\iint_{\\mathbb{R}^2} f(x, y)\\,dA = 1$.",
    "联合概率密度函数 $f(x, y)$ 满足 $f(x, y) \\ge 0$ 以及 $\\iint_{\\mathbb{R}^2} f(x, y)\\,dA = 1$。",
  ),
  prerequisites: ["double-integrals-over-rectangular-domains"],
  encompasses: [{ topic: "double-integrals-over-rectangular-domains", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "normalizing-multivariable-probability-density-functions",
      title: t("Normalizing multivariable probability density functions", "多元概率密度函数的归一化条件与常数确定"),
      explanation: t(
        "A joint density must have total integral one over its support, so the constant is chosen to make the volume under the density equal to one. For a uniform joint density $f(x, y) = C$ supported on the rectangle $[0, a] \\times [0, b]$, normalization requires $\\iint_D C\\,dA = C(ab) = 1$, so $C = \\frac{1}{ab}$, or $1/C = ab$.",
        "联合密度在其支撑集上的总积分必须为 1，所以要选择常数使密度下方的体积等于 1。对于在矩形 $[0, a] \\times [0, b]$ 上均匀分布的联合概率密度 $f(x, y) = C$，由归一化条件 $\\iint_D C\\,dA = C(ab) = 1$，得 $C = \\frac{1}{ab}$，即常数倒数为 $1/C = ab$。",
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
    {
      id: "normalizing-a-non-uniform-joint-density",
      title: t("Normalizing a non-uniform joint density", "非均匀联合密度的归一化"),
      explanation: t(
        "A joint density must be nonnegative and integrate to $1$ over its domain. When it is given up to a constant, $f(x, y) = C\\,g(x, y)$, compute $\\iint_D g\\,dA$ and set $C = \\frac{1}{\\iint_D g\\,dA}$. For a product such as $g = xy$ on a rectangle the double integral factors: $\\int_0^a\\int_0^b xy\\,dy\\,dx = \\frac{a^2}{2} \\cdot \\frac{b^2}{2}$.",
        "联合密度必须非负，且在定义域上积分为 $1$。若它只给到相差一个常数，$f(x, y) = C\\,g(x, y)$，就计算 $\\iint_D g\\,dA$ 并令 $C = \\frac{1}{\\iint_D g\\,dA}$。对矩形上的乘积 $g = xy$，二重积分可以分解：$\\int_0^a\\int_0^b xy\\,dy\\,dx = \\frac{a^2}{2} \\cdot \\frac{b^2}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const sum = rng.int(0, 1) === 1;
        // ∫∫ (x + y) over [0,a]×[0,b] = (a^2 b + a b^2) / 2.
        const total = sum ? Q.of(a * a * b + a * b * b, 2) : Q.of(a * a * b * b, 4);
        const ans = Q.one.div(total);
        const g = sum ? "(x + y)" : "xy";
        return numberProblem({
          prompt: t(
            `$f(x, y) = C${g}$ is a joint density on $[0, ${a}] \\times [0, ${b}]$. Find $C$.`,
            `$f(x, y) = C${g}$ 是 $[0, ${a}] \\times [0, ${b}]$ 上的联合密度。求 $C$。`,
          ),
          answer: ans,
          wrong: [total, Q.of(1, a * b), sum ? Q.of(1, a * a * b * b) : Q.of(2, a * a * b * b)],
          solution: t(
            `$\\iint ${g}\\,dA = ${total.toLatex()}$, so $C = ${ans.toLatex()}$.`,
            `$\\iint ${g}\\,dA = ${total.toLatex()}$，所以 $C = ${ans.toLatex()}$。`,
          ),
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
    "The probability that $(X, Y)$ falls in a region $R$ is the double integral $P((X, Y) \\in R) = \\iint_R f(x, y)\\,dA$.",
    "$(X, Y)$ 落在区域 $R$ 内的概率由二重积分给出：$P((X, Y) \\in R) = \\iint_R f(x, y)\\,dA$。",
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
        "The probability that a random point lands in a region is the integral of the joint density over that region, which for a uniform density is a ratio of areas. If $(X, Y)$ is uniformly distributed with joint density $f(x, y) = \\frac{1}{W H}$ on $[0, W] \\times [0, H]$, the probability $P(X \\le x_1, Y \\le y_1) = \\frac{x_1 y_1}{W H}$.",
        "随机点落在某个区域内的概率等于联合密度在该区域上的积分，对于均匀密度，这是面积之比。若 $(X, Y)$ 在 $[0, W] \\times [0, H]$ 上均匀分布，联合概率密度为 $f(x, y) = \\frac{1}{W H}$，则概率为 $P(X \\le x_1, Y \\le y_1) = \\frac{x_1 y_1}{W H}$。",
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
    {
      id: "probability-that-a-sum-is-small",
      title: t("The probability that $X + Y$ is small", "$X + Y$ 较小的概率"),
      explanation: t(
        "For a uniform distribution on a region, a probability is the area of the event divided by the total area. If $(X, Y)$ is uniform on the square $[0, L]^2$ and $0 \\le s \\le L$, the event $X + Y \\le s$ is the triangle with legs $s$, so\n\n$$P(X + Y \\le s) = \\frac{s^2/2}{L^2} = \\frac{s^2}{2L^2}.$$\n\nDrawing the line $x + y = s$ first shows which shape the event has; for $s > L$ the region is no longer a triangle.",
        "对区域上的均匀分布，概率是事件的面积除以总面积。若 $(X, Y)$ 在正方形 $[0, L]^2$ 上均匀分布且 $0 \\le s \\le L$，事件 $X + Y \\le s$ 是两直角边为 $s$ 的三角形，所以\n\n$$P(X + Y \\le s) = \\frac{s^2/2}{L^2} = \\frac{s^2}{2L^2}。$$\n\n先画出直线 $x + y = s$ 就能看出事件的形状；当 $s > L$ 时区域不再是三角形。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(2, 8);
        const s = rng.int(1, L);
        const ans = Q.of(s * s, 2 * L * L);
        return numberProblem({
          prompt: t(
            `$(X, Y)$ is uniformly distributed on the square $[0, ${L}] \\times [0, ${L}]$. Find $P(X + Y \\le ${s})$.`,
            `$(X, Y)$ 在正方形 $[0, ${L}] \\times [0, ${L}]$ 上均匀分布。求 $P(X + Y \\le ${s})$。`,
          ),
          answer: ans,
          wrong: [Q.of(s * s, L * L), Q.of(s, 2 * L), Q.of(s, L)],
          solution: t(
            `The event is a triangle of area $\\frac{${s}^2}{2} = ${Q.of(s * s, 2).toLatex()}$ inside a square of area $${L * L}$, so the probability is $${ans.toLatex()}$.`,
            `事件是面积为 $\\frac{${s}^2}{2} = ${Q.of(s * s, 2).toLatex()}$ 的三角形，位于面积为 $${L * L}$ 的正方形内，所以概率为 $${ans.toLatex()}$。`,
          ),
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
        "When the density factors into a function of each variable, the double integral over the quadrant splits into a product of two single improper integrals. For independent exponential decay $f(x, y) = c e^{-ax - by}$ over $x \\ge 0, y \\ge 0$, the improper integral is $\\int_0^\\infty dx \\int_0^\\infty c e^{-ax - by} dy = c \\left(\\frac{1}{a}\\right)\\left(\\frac{1}{b}\\right) = \\frac{c}{ab}$.",
        "当密度可以分解为各变量函数的乘积时，第一象限上的二重积分可以拆成两个一元反常积分的乘积。对于在第一象限 $x \\ge 0, y \\ge 0$ 上的指数衰减函数 $f(x, y) = c e^{-ax - by}$，其反常二重积分为 $\\int_0^\\infty dx \\int_0^\\infty c e^{-ax - by} dy = c \\left(\\frac{1}{a}\\right)\\left(\\frac{1}{b}\\right) = \\frac{c}{ab}$。",
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
    {
      id: "probability-that-one-exponential-variable-is-smaller",
      title: t("The probability that one exponential variable comes first", "一个指数变量先发生的概率"),
      explanation: t(
        "For $f(x, y) = ab\\,e^{-ax - by}$ on $x, y \\ge 0$, the event $X < Y$ is the unbounded region above the line $y = x$. Integrate $y$ from $x$ to $\\infty$ first, which gives $a e^{-(a + b)x}$, and then $x$ from $0$ to $\\infty$:\n\n$$P(X < Y) = \\int_0^\\infty a e^{-(a+b)x}\\,dx = \\frac{a}{a + b}.$$\n\nThe variable with the larger rate tends to happen first.",
        "对 $x, y \\ge 0$ 上的 $f(x, y) = ab\\,e^{-ax - by}$，事件 $X < Y$ 是直线 $y = x$ 上方的无界区域。先把 $y$ 从 $x$ 积到 $\\infty$，得 $a e^{-(a + b)x}$，再把 $x$ 从 $0$ 积到 $\\infty$：\n\n$$P(X < Y) = \\int_0^\\infty a e^{-(a+b)x}\\,dx = \\frac{a}{a + b}。$$\n\n速率较大的变量往往先发生。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        let b = rng.int(1, 6);
        if (b === a) b += 1;
        const askX = rng.int(0, 1) === 0;
        const ans = askX ? Q.of(a, a + b) : Q.of(b, a + b);
        return numberProblem({
          prompt: t(
            `$(X, Y)$ has joint density $f(x, y) = ${a * b}e^{-${a === 1 ? "" : a}x - ${b === 1 ? "" : b}y}$ for $x, y \\ge 0$. Find $P(${askX ? "X < Y" : "Y < X"})$.`,
            `$(X, Y)$ 的联合密度为 $f(x, y) = ${a * b}e^{-${a === 1 ? "" : a}x - ${b === 1 ? "" : b}y}$（$x, y \\ge 0$）。求 $P(${askX ? "X < Y" : "Y < X"})$。`,
          ),
          answer: ans,
          wrong: [askX ? Q.of(b, a + b) : Q.of(a, a + b), Q.of(1, 2), askX ? Q.of(a, b) : Q.of(b, a)],
          solution: t(
            `$P(${askX ? "X < Y" : "Y < X"}) = \\frac{${askX ? a : b}}{${a} + ${b}} = ${ans.toLatex()}$.`,
            `$P(${askX ? "X < Y" : "Y < X"}) = \\frac{${askX ? a : b}}{${a} + ${b}} = ${ans.toLatex()}$。`,
          ),
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
    "For discrete random variables, the joint PMF $p(x_i, y_j)$ sums to $1$, and the marginal distributions are the row and column sums.",
    "对于离散型随机变量，联合分布律 $p(x_i, y_j)$ 之和为 $1$，边际分布由行和与列和给出。",
  ),
  prerequisites: ["double-summations"],
  encompasses: [{ topic: "double-summations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "marginal-probabilities-and-joint-pmf-sums",
      title: t("Marginal probabilities and joint pmf sums", "联合概率分布列的求和与边际概率"),
      explanation: t(
        "To find the probability for one variable alone, add the joint probabilities over every value of the other variable, which is a row or column sum of the table. For a $2 \\times 2$ joint distribution table with probabilities $P(X=x, Y=y)$, the marginal probability is $P(X = x_1) = P(X=x_1, Y=y_1) + P(X=x_1, Y=y_2)$.",
        "要求单个变量的概率，就把另一个变量所有取值下的联合概率加起来，也就是表格中一行或一列的和。对于包含概率 $P(X=x, Y=y)$ 的 $2 \\times 2$ 联合分布列，边际概率为行（或列）之和：$P(X = x_1) = P(X=x_1, Y=y_1) + P(X=x_1, Y=y_2)$。",
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
    {
      id: "conditional-probability-from-a-joint-table",
      title: t("Conditional probability from a joint table", "由联合分布表求条件概率"),
      explanation: t(
        "A conditional probability restricts attention to one row or column of the joint table and rescales it to total $1$:\n\n$$P(X = x \\mid Y = y) = \\frac{P(X = x, Y = y)}{P(Y = y)}.$$\n\nThe denominator is the marginal $P(Y = y)$, found by adding the column for $Y = y$. Dividing by the total of all the entries instead gives the joint probability, not the conditional one.",
        "条件概率只看联合分布表的一行或一列，并把它重新缩放使总和为 $1$：\n\n$$P(X = x \\mid Y = y) = \\frac{P(X = x, Y = y)}{P(Y = y)}。$$\n\n分母是边缘概率 $P(Y = y)$，由 $Y = y$ 那一列相加得到。若除以所有元素之和，得到的是联合概率而不是条件概率。",
      ),
      generate(rng: Rng): Problem {
        const p11 = rng.int(1, 4) * 5;
        const p12 = rng.int(1, 4) * 5;
        const p21 = rng.int(1, 4) * 5;
        const p22 = 100 - p11 - p12 - p21;
        const x = rng.int(1, 2);
        const y = rng.int(1, 2);
        const table = [
          [p11, p12],
          [p21, p22],
        ];
        const num = table[x - 1]![y - 1]!;
        const den = table[0]![y - 1]! + table[1]![y - 1]!;
        const ans = Q.of(num, den);
        return numberProblem({
          prompt: t(
            `$X, Y \\in \\{1, 2\\}$ with $P(1, 1) = ${p11}\\%$, $P(1, 2) = ${p12}\\%$, $P(2, 1) = ${p21}\\%$ and $P(2, 2) = ${p22}\\%$, where $P(i, j) = P(X = i, Y = j)$. Find $P(X = ${x} \\mid Y = ${y})$.`,
            `$X, Y \\in \\{1, 2\\}$，$P(1, 1) = ${p11}\\%$，$P(1, 2) = ${p12}\\%$，$P(2, 1) = ${p21}\\%$，$P(2, 2) = ${p22}\\%$，其中 $P(i, j) = P(X = i, Y = j)$。求 $P(X = ${x} \\mid Y = ${y})$。`,
          ),
          answer: ans,
          wrong: [Q.of(num, 100), Q.of(num, table[x - 1]![0]! + table[x - 1]![1]!), Q.of(den - num, den)],
          solution: t(
            `$P(Y = ${y}) = ${table[0]![y - 1]!}\\% + ${table[1]![y - 1]!}\\% = ${den}\\%$, so $P(X = ${x} \\mid Y = ${y}) = \\frac{${num}}{${den}} = ${ans.toLatex()}$.`,
            `$P(Y = ${y}) = ${table[0]![y - 1]!}\\% + ${table[1]![y - 1]!}\\% = ${den}\\%$，所以 $P(X = ${x} \\mid Y = ${y}) = \\frac{${num}}{${den}} = ${ans.toLatex()}$。`,
          ),
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
    "Marginal density functions are obtained by integrating out the other variable: $f_X(x) = \\int f(x, y)\\,dy$.",
    "对另一个变量积分即得边际密度函数：$f_X(x) = \\int f(x, y)\\,dy$。",
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
        "Integrating out the other variable gives the marginal density, and the variables are independent when the joint density equals the product of the marginals. The marginal probability density function of $X$ is $f_X(x) = \\int_{-\\infty}^\\infty f(x, y)\\,dy$. For $f(x, y) = x + y$ on $[0, 1] \\times [0, 1]$, $f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$.",
        "把另一个变量积分掉就得到边缘密度，当联合密度等于边缘密度之积时，两个变量相互独立。随机变量 $X$ 的边际概率密度函数为 $f_X(x) = \\int_{-\\infty}^\\infty f(x, y)\\,dy$。对于在 $[0, 1] \\times [0, 1]$ 上的联合密度 $f(x, y) = x + y$，$f_X(x) = \\int_0^1 (x + y)\\,dy = x + \\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        // f(x, y) = (2 / (1 + a))(x + a y) has total integral 1 on the unit square.
        const a = rng.int(2, 7);
        const xVal = rng.pick([Q.of(1, 4), Q.of(1, 3), Q.of(1, 2), Q.of(2, 3), Q.of(3, 4)]);
        const c = Q.of(2, 1 + a);
        const ans = c.mul(xVal.add(Q.of(a, 2)));
        const f = `${c.toLatex()}(x + ${a}y)`;
        const marginal = `${c.toLatex()}\\left(x + ${Q.of(a, 2).toLatex()}\\right)`;
        const inner = xVal.add(Q.of(a, 2));

        const prompt = t(
          `A continuous random vector $(X, Y)$ on $[0, 1] \\times [0, 1]$ has joint density $f(x, y) = ${f}$. Evaluate the marginal probability density $f_X(x)$ at $x = ${xVal.toLatex()}$.`,
          `定义在 $[0, 1] \\times [0, 1]$ 上的连续型随机向量 $(X, Y)$ 具有联合密度 $f(x, y) = ${f}$。求边际概率密度 $f_X(x)$ 在 $x = ${xVal.toLatex()}$ 处的值。`,
        );
        const solution = t(
          steps(
            `Integrate out $y$ over its domain $[0, 1]$: $f_X(x) = \\int_0^1 ${f}\\,dy$.`,
            `Here $x$ is constant, and $\\int_0^1 ${a}y\\,dy = ${Q.of(a, 2).toLatex()}$, so $f_X(x) = ${marginal}$.`,
            `Evaluate at $x = ${xVal.toLatex()}$: $f_X\\left(${xVal.toLatex()}\\right) = ${c.toLatex()} \\cdot ${inner.toLatex()} = ${ans.toLatex()}$.`,
          ),
          steps(
            `对 $y$ 在其取值区间 $[0, 1]$ 上积分：$f_X(x) = \\int_0^1 ${f}\\,dy$。`,
            `这里 $x$ 是常数，且 $\\int_0^1 ${a}y\\,dy = ${Q.of(a, 2).toLatex()}$，所以 $f_X(x) = ${marginal}$。`,
            `代入 $x = ${xVal.toLatex()}$：$f_X\\left(${xVal.toLatex()}\\right) = ${c.toLatex()} \\cdot ${inner.toLatex()} = ${ans.toLatex()}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c.mul(xVal), c.mul(xVal.add(Q.of(a, 1))), c.mul(Q.of(a, 2))],
        });
      },
    },
    {
      id: "expected-value-from-a-product-density",
      title: t("An expected value from a joint density", "由联合密度求期望"),
      explanation: t(
        "The expected value of $X$ under a joint density is $E[X] = \\iint x\\,f(x, y)\\,dA$. For the density $f(x, y) = (m + 1)(n + 1)x^my^n$ on the unit square, the $y$-integral contributes a factor $1$, leaving\n\n$$E[X] = (m + 1)\\int_0^1 x^{m+1}\\,dx = \\frac{m + 1}{m + 2},$$\n\nand likewise $E[Y] = \\frac{n + 1}{n + 2}$. A larger exponent pushes the mean toward $1$.",
        "在联合密度下 $X$ 的期望为 $E[X] = \\iint x\\,f(x, y)\\,dA$。对单位正方形上的密度 $f(x, y) = (m + 1)(n + 1)x^my^n$，对 $y$ 的积分给出因子 $1$，剩下\n\n$$E[X] = (m + 1)\\int_0^1 x^{m+1}\\,dx = \\frac{m + 1}{m + 2},$$\n\n同样 $E[Y] = \\frac{n + 1}{n + 2}$。指数越大，均值越靠近 $1$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 5);
        let n = rng.int(1, 5);
        if (n === m) n = (m % 5) + 1;
        const askX = rng.int(0, 1) === 0;
        const e = askX ? m : n;
        const ans = Q.of(e + 1, e + 2);
        const xp = m === 1 ? "x" : `x^${m}`;
        const yp = n === 1 ? "y" : `y^${n}`;
        return numberProblem({
          prompt: t(
            `$(X, Y)$ has joint density $f(x, y) = ${(m + 1) * (n + 1)}${xp}${yp}$ on $[0, 1] \\times [0, 1]$. Find $E[${askX ? "X" : "Y"}]$.`,
            `$(X, Y)$ 在 $[0, 1] \\times [0, 1]$ 上的联合密度为 $f(x, y) = ${(m + 1) * (n + 1)}${xp}${yp}$。求 $E[${askX ? "X" : "Y"}]$。`,
          ),
          answer: ans,
          wrong: [Q.of(askX ? n + 1 : m + 1, askX ? n + 2 : m + 2), Q.of(1, 2), Q.of(e + 1, e + 3)],
          solution: t(
            `The marginal density of ${askX ? "$X$" : "$Y$"} is $${e + 1}${askX ? (m === 1 ? "x" : `x^{${m}}`) : n === 1 ? "y" : `y^{${n}}`}$, so $E[${askX ? "X" : "Y"}] = ${e + 1}\\int_0^1 ${askX ? "x" : "y"}^{${e + 1}}\\,d${askX ? "x" : "y"} = ${ans.toLatex()}$.`,
            `${askX ? "$X$" : "$Y$"} 的边缘密度为 $${e + 1}${askX ? (m === 1 ? "x" : `x^{${m}}`) : n === 1 ? "y" : `y^{${n}}`}$，所以 $E[${askX ? "X" : "Y"}] = ${e + 1}\\int_0^1 ${askX ? "x" : "y"}^{${e + 1}}\\,d${askX ? "x" : "y"} = ${ans.toLatex()}$。`,
          ),
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
