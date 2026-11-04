// Further knowledge points for topics of Calculus II, each a skill the topic's own
// points leave out. See `deeperCalculusIIPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** different picks an integer from lo to hi other than the one given. */
const different = (rng: Rng, lo: number, hi: number, other: number) =>
  rng.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((i) => i !== other));

const scaledKnownIntegral: KnowledgePointDef = {
  id: "a-known-integral-with-a-scaled-argument",
  title: t("A known integral with a scaled argument", "自变量伸缩后的已知积分"),
  explanation: t(
    "Substitution works even when $f$ has no formula. With $u = kx$, the integral of $f(kx)$ becomes the integral of $f(u)$ divided by $k$, and the limits are multiplied by $k$. So a known integral of $f$ over the new limits gives the answer directly.",
    "即使 $f$ 没有公式，换元也可以用。令 $u = kx$，$f(kx)$ 的积分变成 $f(u)$ 的积分除以 $k$，积分限都乘以 $k$。所以已知 $f$ 在新积分限上的积分，就能直接得到答案。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const b = rng.int(1, 5);
    const v = nonzero(rng, 12);
    const answer = Q.of(v, k);
    return numberProblem({
      prompt: t(
        `$\\int_0^{${k * b}} f(x)\\,dx = ${v}$. Find $\\int_0^{${b}} f(${k}x)\\,dx$.`,
        `$\\int_0^{${k * b}} f(x)\\,dx = ${v}$。求 $\\int_0^{${b}} f(${k}x)\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(v), Q.of(k * v), Q.of(v, k * b)],
      solution: t(
        `Let $u = ${k}x$, so $dx = \\frac{du}{${k}}$, and the limits become $0$ and $${k * b}$. The integral is $\\frac{1}{${k}} \\cdot ${inParens(v)} = ${answer.toLatex()}$.`,
        `令 $u = ${k}x$，则 $dx = \\frac{du}{${k}}$，积分限变成 $0$ 和 $${k * b}$。积分等于 $\\frac{1}{${k}} \\cdot ${inParens(v)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const partsFromValues: KnowledgePointDef = {
  id: "integration-by-parts-from-given-values",
  title: t("Integration by parts from given values", "由给定的值分部积分"),
  explanation: t(
    "Integration by parts also applies to a function known only through some values. Taking $u = x$ and $dv = f'(x)\\,dx$ gives $\\int_a^b xf'(x)\\,dx = \\big[xf(x)\\big]_a^b - \\int_a^b f(x)\\,dx$. The boundary term needs only the values of $f$ at the ends.",
    "只知道函数的某些值时，也可以分部积分。取 $u = x$，$dv = f'(x)\\,dx$，得 $\\int_a^b xf'(x)\\,dx = \\big[xf(x)\\big]_a^b - \\int_a^b f(x)\\,dx$。边界项只需要 $f$ 在两端的值。",
  ),
  generate(rng) {
    const a = rng.int(0, 3);
    const b = a + rng.int(1, 5);
    const fa = nonzero(rng, 9);
    const fb = nonzero(rng, 9);
    const I = nonzero(rng, 12);
    const boundary = b * fb - a * fa;
    const answer = boundary - I;
    return numberProblem({
      prompt: t(
        `$f(${a}) = ${fa}$, $f(${b}) = ${fb}$ and $\\int_{${a}}^{${b}} f(x)\\,dx = ${I}$. Find $\\int_{${a}}^{${b}} xf'(x)\\,dx$.`,
        `$f(${a}) = ${fa}$，$f(${b}) = ${fb}$，$\\int_{${a}}^{${b}} f(x)\\,dx = ${I}$。求 $\\int_{${a}}^{${b}} xf'(x)\\,dx$。`,
      ),
      answer,
      form: "integer",
      wrong: [boundary + I, boundary, fb - fa - I],
      solution: t(
        `By parts, the integral is $${b}(${fb}) - ${a}(${fa}) - ${inParens(I)} = ${boundary} - ${inParens(I)} = ${answer}$.`,
        `由分部积分，积分等于 $${b}(${fb}) - ${a}(${fa}) - ${inParens(I)} = ${boundary} - ${inParens(I)} = ${answer}$。`,
      ),
    });
  },
};

const coverUp: KnowledgePointDef = {
  id: "the-cover-up-method-with-three-factors",
  title: t("The cover-up method with three factors", "三个因式的掩盖法"),
  explanation: t(
    "To find the coefficient over a distinct linear factor $x - a$, multiply both sides by that factor and set $x = a$. All the other partial fractions vanish. In practice, this means covering the factor and substituting $x = a$ into what remains, with no system of equations to solve.",
    "要求一次因式 $x - a$ 上的系数，两边同乘这个因式，再令 $x = a$，其他分式都变成零。实际做法就是盖住这个因式，把 $x = a$ 代入剩下的部分，不用解方程组。",
  ),
  generate(rng) {
    const a = rng.int(-4, 4);
    const b = different(rng, -4, 4, a);
    const c = rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((x) => x !== a && x !== b));
    const n = rng.int(1, 12);
    const answer = Q.of(n, (a - b) * (a - c));
    const fa = poly([1, "x"], [-a, ""]);
    const fb = poly([1, "x"], [-b, ""]);
    const fc = poly([1, "x"], [-c, ""]);
    return numberProblem({
      prompt: t(
        `In the partial fraction decomposition of $\\frac{${n}}{(${fb})(${fa})(${fc})}$, find the coefficient $A$ of $\\frac{A}{${fa}}$.`,
        `在 $\\frac{${n}}{(${fb})(${fa})(${fc})}$ 的部分分式分解中，求 $\\frac{A}{${fa}}$ 的系数 $A$。`,
      ),
      answer,
      wrong: [Q.of(n), answer.neg(), Q.of(n, (a + b) * (a + c) || 1)],
      solution: t(
        `Cover $${fa}$ and substitute $x = ${a}$ into the rest: $A = \\frac{${n}}{(${a} - ${inParens(b)})(${a} - ${inParens(c)})} = ${answer.toLatex()}$.`,
        `盖住 $${fa}$，把 $x = ${a}$ 代入其余部分：$A = \\frac{${n}}{(${a} - ${inParens(b)})(${a} - ${inParens(c)})} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const exponentFromImproper: KnowledgePointDef = {
  id: "the-exponent-from-the-value-of-an-improper-integral",
  title: t("The exponent from the value of an improper integral", "由反常积分的值求指数"),
  explanation: t(
    "For $p > 1$, $\\int_1^\\infty x^{-p}\\,dx = \\frac{1}{p - 1}$. So the value of the integral shrinks as $p$ grows, and each value belongs to one exponent. Given the value, solve this relation for $p$, after taking out any constant multiple of the integrand.",
    "当 $p > 1$ 时，$\\int_1^\\infty x^{-p}\\,dx = \\frac{1}{p - 1}$。所以 $p$ 越大积分值越小，每个值只对应一个指数。已知积分值时，先提出被积函数的常数倍，再由这个关系解出 $p$。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const p = rng.int(2, 7);
    const v = Q.of(k, p - 1);
    return numberProblem({
      prompt: t(
        `For which $p > 1$ does $\\int_1^\\infty \\frac{${k}}{x^p}\\,dx = ${v.toLatex()}$?`,
        `$p > 1$ 取何值时 $\\int_1^\\infty \\frac{${k}}{x^p}\\,dx = ${v.toLatex()}$？`,
      ),
      answer: p,
      solveFor: "p",
      wrong: [p - 1, p + 1, k],
      solution: t(
        `The integral equals $\\frac{${k}}{p - 1}$. Setting this equal to $${v.toLatex()}$ gives $p - 1 = ${p - 1}$, so $p = ${p}$.`,
        `积分等于 $\\frac{${k}}{p - 1}$。令它等于 $${v.toLatex()}$，得 $p - 1 = ${p - 1}$，所以 $p = ${p}$。`,
      ),
    });
  },
};

const peakAmount: KnowledgePointDef = {
  id: "the-largest-amount-from-a-rate",
  title: t("The largest amount from a rate", "由变化率求最大量"),
  explanation: t(
    "An amount grows while its rate is positive and shrinks once the rate is negative, so it is largest at the moment the rate crosses zero. The size of the peak is the starting amount plus the integral of the rate up to that moment.",
    "变化率为正时量在增加，变化率为负时量在减少，所以在变化率穿过零的时刻量最大。峰值等于初始量加上变化率到那一刻的积分。",
  ),
  generate(rng) {
    const A = rng.int(5, 60);
    const a = rng.int(2, 20);
    const b = rng.int(1, 4);
    const gain = Q.of(a * a, 2 * b);
    const answer = gain.add(Q.of(A));
    const peak = Q.of(a, b);
    return numberProblem({
      prompt: t(
        `A tank holds ${A} L at time $t = 0$, and water enters at $r(t) = ${poly([a, ""], [-b, "t"])}$ L/min, where a negative rate means water is leaving. What is the largest amount of water in the tank, in litres?`,
        `水箱在 $t = 0$ 时有 ${A} L 水，水以 $r(t) = ${poly([a, ""], [-b, "t"])}$ L/min 的速率流入，速率为负表示水在流出。水箱中水量的最大值是多少升？`,
      ),
      answer,
      wrong: [gain, Q.of(a * a, b).add(Q.of(A)), Q.of(A).add(peak)],
      solution: t(
        `The rate is zero at $t = ${peak.toLatex()}$. The water gained by then is $\\int_0^{${peak.toLatex()}} r(t)\\,dt = ${gain.toLatex()}$, so the largest amount is $${A} + ${gain.toLatex()} = ${answer.toLatex()}$.`,
        `变化率在 $t = ${peak.toLatex()}$ 时为零。到那时增加的水量是 $\\int_0^{${peak.toLatex()}} r(t)\\,dt = ${gain.toLatex()}$，所以最大水量是 $${A} + ${gain.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const averageOverAdjacentIntervals: KnowledgePointDef = {
  id: "the-average-value-over-adjacent-intervals",
  title: t("The average value over adjacent intervals", "相邻区间上的平均值"),
  explanation: t(
    "An average value times the length of its interval is the integral over that interval. To combine two adjacent intervals, add these integrals and divide by the total length. This is a weighted average, so the plain average of the two values is correct only when the lengths are equal.",
    "平均值乘以区间长度就是该区间上的积分。要合并两个相邻区间，把这些积分相加，再除以总长度。这是加权平均，所以只有长度相等时，两个值的简单平均才正确。",
  ),
  generate(rng) {
    const a = rng.int(0, 4);
    const b = a + rng.int(1, 5);
    const c = b + rng.int(1, 6);
    const u = nonzero(rng, 9);
    const v = different(rng, -9, 9, u);
    const total = u * (b - a) + v * (c - b);
    const answer = Q.of(total, c - a);
    return numberProblem({
      prompt: t(
        `$f$ has average value $${u}$ on $[${a}, ${b}]$ and average value $${v}$ on $[${b}, ${c}]$. Find its average value on $[${a}, ${c}]$.`,
        `$f$ 在 $[${a}, ${b}]$ 上的平均值是 $${u}$，在 $[${b}, ${c}]$ 上的平均值是 $${v}$。求它在 $[${a}, ${c}]$ 上的平均值。`,
      ),
      answer,
      wrong: [Q.of(u + v, 2), Q.of(total), Q.of(u * (c - b) + v * (b - a), c - a)],
      solution: t(
        `The integrals are $${u} \\cdot ${b - a}$ and $${v} \\cdot ${c - b}$, which add up to $${total}$. Dividing by the total length $${c - a}$ gives $${answer.toLatex()}$.`,
        `两段的积分是 $${u} \\cdot ${b - a}$ 和 $${v} \\cdot ${c - b}$，和为 $${total}$。除以总长度 $${c - a}$ 得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const slopeFromEnclosedArea: KnowledgePointDef = {
  id: "the-slope-of-a-line-from-an-enclosed-area",
  title: t("The slope of a line from an enclosed area", "由围成的面积求直线斜率"),
  explanation: t(
    "A parameter in a curve moves the points of intersection, and therefore the limits of integration. Find the limits in terms of the parameter, integrate the difference of the curves, and set the result equal to the given area. This produces an equation for the parameter.",
    "曲线中的参数会改变交点，也就改变积分限。先用参数表示积分限，再对两条曲线之差积分，令结果等于给定的面积，就得到参数的方程。",
  ),
  generate(rng) {
    const a = rng.int(1, 3);
    const m = rng.int(1, 9);
    const area = Q.of(m * m * m, 6 * a * a);
    const curve = poly([a, "x^2"]);
    const meet = a === 1 ? "m" : `\\frac{m}{${a}}`;
    return numberProblem({
      prompt: t(
        `The line $y = mx$, with $m > 0$, and the parabola $y = ${curve}$ enclose an area of $${area.toLatex()}$. Find $m$.`,
        `直线 $y = mx$（$m > 0$）与抛物线 $y = ${curve}$ 围成的面积是 $${area.toLatex()}$。求 $m$。`,
      ),
      answer: m,
      solveFor: "m",
      wrong: [m * m, m + 1, 2 * m],
      solution: t(
        `The curves meet at $x = 0$ and $x = ${meet}$. Integrating $mx - ${curve}$ between them gives $\\frac{m^3}{${6 * a * a}}$. Setting this equal to the area gives $m^3 = ${m ** 3}$, so $m = ${m}$.`,
        `两曲线交于 $x = 0$ 和 $x = ${meet}$。在二者之间对 $mx - ${curve}$ 积分，得 $\\frac{m^3}{${6 * a * a}}$。令它等于面积，得 $m^3 = ${m ** 3}$，所以 $m = ${m}$。`,
      ),
    });
  },
};

const limitFromVolume: KnowledgePointDef = {
  id: "an-unknown-limit-from-a-volume-of-revolution",
  title: t("An unknown limit from a volume of revolution", "由旋转体体积求未知积分限"),
  explanation: t(
    "The disc method gives a volume as a function of a limit of integration. When the volume is known, set up the same integral with the limit as a letter, evaluate it, and solve the resulting equation. The factor of $\\pi$ appears on both sides and cancels.",
    "圆盘法把体积表示成积分限的函数。已知体积时，用字母表示积分限，列出同样的积分并求值，再解所得的方程。两边都有因子 $\\pi$，可以约去。",
  ),
  generate(rng) {
    const c = rng.int(1, 4);
    const k = rng.int(1, 12);
    const V = Q.of(c * c * k * k, 2);
    const curve = `${c === 1 ? "" : c}\\sqrt{x}`;
    return numberProblem({
      prompt: t(
        `The region under $y = ${curve}$ from $x = 0$ to $x = k$, with $k > 0$, is rotated about the $x$-axis. The volume is $${V.toLatex()}\\pi$. Find $k$.`,
        `$y = ${curve}$ 下方从 $x = 0$ 到 $x = k$（$k > 0$）的区域绕 $x$ 轴旋转，体积是 $${V.toLatex()}\\pi$。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [k * k, 2 * k, k + c],
      solution: t(
        `$V = \\pi\\int_0^k ${c * c}x\\,dx = \\frac{${c * c}}{2}k^2\\pi$. Setting this equal to the given volume gives $k^2 = ${k * k}$, so $k = ${k}$.`,
        `$V = \\pi\\int_0^k ${c * c}x\\,dx = \\frac{${c * c}}{2}k^2\\pi$。令它等于给定的体积，得 $k^2 = ${k * k}$，所以 $k = ${k}$。`,
      ),
    });
  },
};

const shellsAboutAnotherLine: KnowledgePointDef = {
  id: "shells-about-a-line-other-than-the-y-axis",
  title: t("Shells about a line other than the $y$-axis", "绕 $y$ 轴以外的直线的柱壳"),
  explanation: t(
    "The radius of a shell is the distance from the axis of rotation, which is not always $x$. For rotation about the line $x = -h$ of a region to its right, the radius is $x + h$, while the height of the shell stays the same. So the volume is $2\\pi\\int (x + h)f(x)\\,dx$.",
    "柱壳的半径是到旋转轴的距离，不一定是 $x$。区域在直线 $x = -h$ 右侧并绕它旋转时，半径是 $x + h$，柱壳的高不变。所以体积是 $2\\pi\\int (x + h)f(x)\\,dx$。",
  ),
  generate(rng) {
    const b = rng.int(1, 6);
    const h = rng.int(1, 9);
    const base = Q.of(b ** 4, 2);
    const extra = Q.of(2 * h * b ** 3, 3);
    const answer = base.add(extra);
    return numberProblem({
      prompt: t(
        `The region under $y = x^2$ from $x = 0$ to $x = ${b}$ is rotated about the line $x = -${h}$. The volume is $c\\pi$. Find $c$.`,
        `$y = x^2$ 下方从 $x = 0$ 到 $x = ${b}$ 的区域绕直线 $x = -${h}$ 旋转，体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [base, base.sub(extra), Q.of(h * b ** 3, 3).add(base)],
      solution: t(
        `$V = 2\\pi\\int_0^{${b}} (x + ${h})x^2\\,dx = 2\\pi\\left(\\frac{${b ** 4}}{4} + \\frac{${h * b ** 3}}{3}\\right)$, so $c = ${answer.toLatex()}$.`,
        `$V = 2\\pi\\int_0^{${b}} (x + ${h})x^2\\,dx = 2\\pi\\left(\\frac{${b ** 4}}{4} + \\frac{${h * b ** 3}}{3}\\right)$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const averageSpeed: KnowledgePointDef = {
  id: "average-speed-when-the-direction-changes",
  title: t("Average speed when the direction changes", "方向改变时的平均速率"),
  explanation: t(
    "Average velocity is displacement divided by time, while average speed is total distance divided by time. They differ when an object turns around, because backward motion cancels in displacement and adds in distance. To find the distance, integrate the absolute value of the velocity, splitting at the turning point.",
    "平均速度是位移除以时间，平均速率是总路程除以时间。物体掉头时二者不同，因为反向运动在位移中抵消，在路程中却累加。要求路程，就对速度的绝对值积分，并在掉头的时刻分段。",
  ),
  generate(rng) {
    const p = rng.int(1, 5);
    const T = p + rng.int(1, 5);
    const a = rng.int(1, 4);
    const distance = Q.of(a * (p * p + (T - p) ** 2), 2);
    const answer = distance.div(Q.of(T));
    const displacement = Q.of(a * (T * T - 2 * p * T), 2);
    const velocity = displacement.div(Q.of(T));
    return numberProblem({
      prompt: t(
        `A particle has velocity $v(t) = ${poly([a, "t"], [-a * p, ""])}$ m/s. Find its average speed from $t = 0$ to $t = ${T}$, in m/s.`,
        `质点的速度是 $v(t) = ${poly([a, "t"], [-a * p, ""])}$ m/s。求它从 $t = 0$ 到 $t = ${T}$ 的平均速率（m/s）。`,
      ),
      answer,
      wrong: [velocity, distance, Q.of(a * (T - p))],
      solution: t(
        `The particle turns around at $t = ${p}$. It covers $${Q.of(a * p * p, 2).toLatex()}$ m before that and $${Q.of(a * (T - p) ** 2, 2).toLatex()}$ m after, a total of $${distance.toLatex()}$ m. Dividing by $${T}$ s gives $${answer.toLatex()}$.`,
        `质点在 $t = ${p}$ 时掉头。之前走了 $${Q.of(a * p * p, 2).toLatex()}$ m，之后走了 $${Q.of(a * (T - p) ** 2, 2).toLatex()}$ m，共 $${distance.toLatex()}$ m。除以 $${T}$ s 得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const returnTime: KnowledgePointDef = {
  id: "when-a-particle-returns-to-its-start",
  title: t("When a particle returns to its start", "质点何时回到起点"),
  explanation: t(
    "A particle is back at its starting point when its displacement since the start is zero, not when its velocity is zero. Zero velocity marks only the turning point. So integrate the velocity from $0$ to $T$, set the result to zero, and solve for the positive $T$.",
    "质点回到起点的条件是从起点算起的位移为零，而不是速度为零。速度为零只说明它在掉头。所以把速度从 $0$ 积分到 $T$，令结果为零，再解出正的 $T$。",
  ),
  generate(rng) {
    const a = rng.int(1, 20);
    const b = rng.int(1, 6);
    const answer = Q.of(2 * a, b);
    return numberProblem({
      prompt: t(
        `A particle has velocity $v(t) = ${poly([a, ""], [-b, "t"])}$ m/s. At what time $t > 0$, in seconds, is it back at its position at $t = 0$?`,
        `质点的速度是 $v(t) = ${poly([a, ""], [-b, "t"])}$ m/s。在什么时刻 $t > 0$（秒）它回到 $t = 0$ 时的位置？`,
      ),
      answer,
      wrong: [Q.of(a, b), Q.of(a, 2 * b), Q.of(b, a)],
      solution: t(
        `The displacement up to time $T$ is $${poly([a, "T"])} - \\frac{${b}}{2}T^2$. This is zero when $T = ${answer.toLatex()}$, which is twice the time of the turning point.`,
        `到时刻 $T$ 的位移是 $${poly([a, "T"])} - \\frac{${b}}{2}T^2$。当 $T = ${answer.toLatex()}$ 时它为零，这是掉头时刻的两倍。`,
      ),
    });
  },
};

const selfCrossing: KnowledgePointDef = {
  id: "tangents-where-a-parametric-curve-crosses-itself",
  title: t("Tangents where a parametric curve crosses itself", "参数曲线自交处的切线"),
  explanation: t(
    "A parametric curve can pass through the same point at two values of the parameter. Find these by solving $x(t) = x_0$ and $y(t) = y_0$ together. Each value gives its own $\\frac{dy}{dx}$, so a self-crossing has two tangent lines rather than one.",
    "参数曲线可以在两个参数值处经过同一点。联立 $x(t) = x_0$ 和 $y(t) = y_0$ 就能找到它们。每个参数值都有自己的 $\\frac{dy}{dx}$，所以自交点处有两条切线，而不是一条。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const m = rng.int(1, 6);
    const answer = a * m;
    const x = poly([1, "t^2"], [-a * a, ""]);
    const y = poly([m, "t^3"], [-m * a * a, "t"]);
    return numberProblem({
      prompt: t(
        `The curve $x = ${x}$, $y = ${y}$ passes through the origin twice. Find the positive slope among its two tangent lines there.`,
        `曲线 $x = ${x}$，$y = ${y}$ 两次经过原点。求那里两条切线中为正的斜率。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * answer, a, m],
      solution: t(
        `Both coordinates vanish at $t = \\pm ${a}$. The slope is $\\frac{dy}{dx} = \\frac{${poly([3 * m, "t^2"], [-m * a * a, ""])}}{2t}$, which equals $\\pm ${answer}$ at these values. The positive slope is $${answer}$.`,
        `两个坐标都在 $t = \\pm ${a}$ 时为零。斜率 $\\frac{dy}{dx} = \\frac{${poly([3 * m, "t^2"], [-m * a * a, ""])}}{2t}$，在这两个值处等于 $\\pm ${answer}$。为正的斜率是 $${answer}$。`,
      ),
    });
  },
};

const smallestSpeed: KnowledgePointDef = {
  id: "the-smallest-speed-in-the-plane",
  title: t("The smallest speed in the plane", "平面运动的最小速率"),
  explanation: t(
    "Speed is the length of the velocity vector, and it contains a square root. Its smallest value occurs at the same time as the smallest value of its square, which is usually a polynomial. So minimize the squared speed by differentiating, and take the root only if the speed itself is needed.",
    "速率是速度向量的长度，含有平方根。它与自身的平方在同一时刻取最小值，而平方通常是多项式。所以通过求导使速率的平方最小，只有需要速率本身时才开方。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const q = different(rng, 1, 9, p);
    const answer = 2 * (p - q) ** 2;
    const middle = Q.of(p + q, 2);
    return numberProblem({
      prompt: t(
        `A particle moves with $x(t) = ${poly([1, "t^2"], [-2 * p, "t"])}$ and $y(t) = ${poly([1, "t^2"], [-2 * q, "t"])}$. Find the smallest value of the square of its speed.`,
        `质点的运动满足 $x(t) = ${poly([1, "t^2"], [-2 * p, "t"])}$，$y(t) = ${poly([1, "t^2"], [-2 * q, "t"])}$。求其速率平方的最小值。`,
      ),
      answer,
      form: "integer",
      wrong: [(p - q) ** 2, 4 * (p - q) ** 2, Math.abs(p - q)],
      solution: t(
        `The squared speed is $4(t - ${p})^2 + 4(t - ${q})^2$, which is smallest at $t = ${middle.toLatex()}$, midway between $${p}$ and $${q}$. There each square is $\\frac{(${p} - ${q})^2}{4}$, so the value is $2(${p} - ${q})^2 = ${answer}$.`,
        `速率的平方是 $4(t - ${p})^2 + 4(t - ${q})^2$，在 $${p}$ 与 $${q}$ 正中间的 $t = ${middle.toLatex()}$ 处最小。此时每个平方都是 $\\frac{(${p} - ${q})^2}{4}$，所以最小值是 $2(${p} - ${q})^2 = ${answer}$。`,
      ),
    });
  },
};

const rangeOfAProjectile: KnowledgePointDef = {
  id: "the-range-of-a-projectile",
  title: t("The range of a projectile", "抛射体的射程"),
  explanation: t(
    "Integrating the acceleration twice gives each component of the position. The two components share only the time. So find the landing time from the vertical component, by setting the height to zero, and substitute it into the horizontal component to get the range.",
    "把加速度积分两次，得到位置的每个分量。两个分量只共用时间。所以先由竖直分量令高度为零求出落地时间，再代入水平分量，得到射程。",
  ),
  generate(rng) {
    const u = rng.int(1, 30);
    const w = rng.int(1, 30);
    const answer = Q.of(u * w, 5);
    const time = Q.of(w, 5);
    return numberProblem({
      prompt: t(
        `A projectile leaves the ground with velocity $\\langle ${u}, ${w} \\rangle$ m/s and has acceleration $\\langle 0, -10 \\rangle$ m/s². How far from its starting point does it land, in metres?`,
        `抛射体以速度 $\\langle ${u}, ${w} \\rangle$ m/s 离开地面，加速度是 $\\langle 0, -10 \\rangle$ m/s²。它落在离起点多远处（米）？`,
      ),
      answer,
      wrong: [Q.of(u * w, 10), time, Q.of(2 * u * w, 5)],
      solution: t(
        `The height is $${w}t - 5t^2$, which is zero again at $t = ${time.toLatex()}$. The horizontal position is $${u}t$, so the range is $${u} \\cdot ${time.toLatex()} = ${answer.toLatex()}$.`,
        `高度是 $${w}t - 5t^2$，在 $t = ${time.toLatex()}$ 时再次为零。水平位置是 $${u}t$，所以射程是 $${u} \\cdot ${time.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitOfLinearRecursion: KnowledgePointDef = {
  id: "the-limit-of-a-linear-recursive-sequence",
  title: t("The limit of a linear recursive sequence", "线性递推数列的极限"),
  explanation: t(
    "If a recursive sequence converges to $L$, then both $a_n$ and $a_{n+1}$ tend to $L$, so $L$ must satisfy the recursion with both replaced by $L$. Solving this equation gives the limit. The starting value does not appear in the answer when the multiplier is smaller than $1$ in size.",
    "如果递推数列收敛于 $L$，$a_n$ 和 $a_{n+1}$ 都趋于 $L$，所以把递推式中二者都换成 $L$ 后等式仍成立。解这个方程就得到极限。当乘数的绝对值小于 $1$ 时，答案与初始值无关。",
  ),
  generate(rng) {
    const s = rng.int(2, 6);
    const r = rng.int(1, s - 1);
    const q = nonzero(rng, 9);
    const a1 = rng.int(0, 9);
    const answer = Q.of(q * s, s - r);
    const ratio = Q.of(r, s);
    return numberProblem({
      prompt: t(
        `A sequence has $a_1 = ${a1}$ and $a_{n+1} = ${ratio.toLatex()}a_n ${q < 0 ? "-" : "+"} ${Math.abs(q)}$. Find its limit.`,
        `数列满足 $a_1 = ${a1}$，$a_{n+1} = ${ratio.toLatex()}a_n ${q < 0 ? "-" : "+"} ${Math.abs(q)}$。求它的极限。`,
      ),
      answer,
      wrong: [Q.of(q), Q.of(q * s, r), Q.of(q * s, s + r)],
      solution: t(
        `The limit satisfies $L = ${ratio.toLatex()}L + ${inParens(q)}$, so $${Q.of(s - r, s).toLatex()}L = ${q}$ and $L = ${answer.toLatex()}$. The starting value makes no difference.`,
        `极限满足 $L = ${ratio.toLatex()}L + ${inParens(q)}$，所以 $${Q.of(s - r, s).toLatex()}L = ${q}$，$L = ${answer.toLatex()}$。初始值不影响结果。`,
      ),
    });
  },
};

const limitOfNestedRoot: KnowledgePointDef = {
  id: "the-limit-of-a-monotonic-sequence-of-roots",
  title: t("The limit of a monotonic sequence of roots", "单调根式数列的极限"),
  explanation: t(
    "A bounded monotonic sequence converges, and its limit can then be found from the recursion. Replacing every term by $L$ gives an equation, and squaring removes the root. Squaring may add a false solution, so keep the root that fits: the terms here are positive, and so is their limit.",
    "有界单调数列收敛，于是可以由递推式求极限。把每一项都换成 $L$ 得到方程，平方后根号消失。平方可能引入增根，所以要留下合适的根：这里各项都是正的，极限也是正的。",
  ),
  generate(rng) {
    const c = rng.int(1, 5);
    const m = c + rng.int(1, 6);
    const k = m * m - c * m;
    const other = c - m;
    return numberProblem({
      prompt: t(
        `A sequence has $a_1 = 1$ and $a_{n+1} = \\sqrt{${poly([k, ""], [c, "a_n"])}}$. It is monotonic and bounded. Find its limit.`,
        `数列满足 $a_1 = 1$，$a_{n+1} = \\sqrt{${poly([k, ""], [c, "a_n"])}}$。它单调有界。求它的极限。`,
      ),
      answer: m,
      form: "integer",
      wrong: [other, k, m + 1],
      solution: t(
        `The limit satisfies $L^2 = ${poly([k, ""], [c, "L"])}$, whose roots are $${m}$ and $${other}$. All the terms are positive, so the limit is $${m}$.`,
        `极限满足 $L^2 = ${poly([k, ""], [c, "L"])}$，两根是 $${m}$ 和 $${other}$。各项都是正的，所以极限是 $${m}$。`,
      ),
    });
  },
};

const telescopingFromLaterIndex: KnowledgePointDef = {
  id: "a-telescoping-series-from-a-later-index",
  title: t("A telescoping series from a later index", "从较后一项开始的裂项级数"),
  explanation: t(
    "The sum of a telescoping series is what survives at the start. Since $\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$, a series starting at $n = m$ leaves only the piece $\\frac{1}{m}$. The starting index therefore decides the sum, and the sum need not be the value for $n = 1$.",
    "裂项级数的和就是开头留下的部分。由于 $\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$，从 $n = m$ 开始的级数只留下 $\\frac{1}{m}$。所以起始下标决定了和，不一定等于从 $n = 1$ 开始的值。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const c = rng.int(1, 9);
    const answer = Q.of(c, m);
    return numberProblem({
      prompt: t(`Find $\\sum_{n=${m}}^{\\infty} \\frac{${c}}{n(n+1)}$.`, `求 $\\sum_{n=${m}}^{\\infty} \\frac{${c}}{n(n+1)}$。`),
      answer,
      wrong: [Q.of(c), Q.of(c, m + 1), Q.of(1, m)],
      solution: t(
        `Each term is $${c}\\left(\\frac{1}{n} - \\frac{1}{n+1}\\right)$. All pieces cancel except the first, $\\frac{${c}}{${m}}$, so the sum is $${answer.toLatex()}$.`,
        `每一项是 $${c}\\left(\\frac{1}{n} - \\frac{1}{n+1}\\right)$。除第一部分 $\\frac{${c}}{${m}}$ 外全部抵消，所以和是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const productOfSeries: KnowledgePointDef = {
  id: "a-coefficient-from-a-product-of-series",
  title: t("A coefficient from a product of series", "级数之积的系数"),
  explanation: t(
    "Power series multiply like long polynomials. To find one coefficient of a product, there is no need for the whole product: collect the pairs of terms whose powers add up to the wanted power. This is usually far quicker than differentiating the product repeatedly.",
    "幂级数可以像很长的多项式一样相乘。要求乘积的一个系数，不必算出整个乘积，只要收集幂次之和等于所求幂次的各对项。这通常比反复对乘积求导快得多。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = nonzero(rng, 4);
    const half = Q.of(a * a, 2);
    const answer = half.add(Q.of(a * b + b * b));
    const exponent = poly([a, "x"]);
    return numberProblem({
      prompt: t(
        `Find the coefficient of $x^2$ in the Maclaurin series of $\\frac{e^{${exponent}}}{${poly([1, ""], [-b, "x"])}}$.`,
        `求 $\\frac{e^{${exponent}}}{${poly([1, ""], [-b, "x"])}}$ 的麦克劳林级数中 $x^2$ 的系数。`,
      ),
      answer,
      wrong: [half.add(Q.of(b * b)), Q.of(a * a + a * b + b * b), Q.of(a * b)],
      solution: t(
        `The series are $1 + ${a}x + ${half.toLatex()}x^2 + \\cdots$ and $1 + ${inParens(b)}x + ${b * b}x^2 + \\cdots$. The $x^2$ terms come from three pairs: $${b * b} + ${inParens(a * b)} + ${half.toLatex()} = ${answer.toLatex()}$.`,
        `两个级数是 $1 + ${a}x + ${half.toLatex()}x^2 + \\cdots$ 和 $1 + ${inParens(b)}x + ${b * b}x^2 + \\cdots$。$x^2$ 项来自三对：$${b * b} + ${inParens(a * b)} + ${half.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitFromExponentialSeries: KnowledgePointDef = {
  id: "a-limit-from-the-exponential-series",
  title: t("A limit from the exponential series", "由指数级数求极限"),
  explanation: t(
    "A series can replace repeated use of L'Hopital's rule. Write the function by its series around the limit point, and cancel what the numerator subtracts. The first term that survives decides the limit, since every later term has a higher power of $x$ and vanishes after dividing.",
    "级数可以代替反复使用洛必达法则。把函数在极限点附近写成级数，消去分子减掉的部分。留下的第一项决定极限，因为后面的项 $x$ 的幂次更高，相除后都趋于零。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = rng.int(1, 6);
    const answer = Q.of(a * a, 2 * b);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{e^{${poly([a, "x"])}} - 1 ${a < 0 ? "+" : "-"} ${poly([Math.abs(a), "x"])}}{${poly([b, "x^2"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{e^{${poly([a, "x"])}} - 1 ${a < 0 ? "+" : "-"} ${poly([Math.abs(a), "x"])}}{${poly([b, "x^2"])}}$。`,
      ),
      answer,
      wrong: [Q.of(a * a, b), Q.of(a, 2 * b), Q.of(0)],
      solution: t(
        `The series begins $1 + ${inParens(a)}x + \\frac{${a * a}}{2}x^2 + \\cdots$, so the numerator begins with $\\frac{${a * a}}{2}x^2$. Dividing by $${poly([b, "x^2"])}$ gives the limit $${answer.toLatex()}$.`,
        `级数开头是 $1 + ${inParens(a)}x + \\frac{${a * a}}{2}x^2 + \\cdots$，所以分子以 $\\frac{${a * a}}{2}x^2$ 开头。除以 $${poly([b, "x^2"])}$ 得极限 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitFromSineSeries: KnowledgePointDef = {
  id: "a-limit-from-the-sine-series",
  title: t("A limit from the sine series", "由正弦级数求极限"),
  explanation: t(
    "The series of sine begins $u - \\frac{u^3}{6} + \\cdots$, so $\\sin u$ differs from $u$ by about $\\frac{u^3}{6}$ for small $u$. This settles limits in which the first term cancels. Remember that the coefficient of $u^3$ is negative, and that the substitution raises any constant in $u$ to the third power.",
    "正弦的级数开头是 $u - \\frac{u^3}{6} + \\cdots$，所以 $u$ 很小时，$\\sin u$ 与 $u$ 相差约 $\\frac{u^3}{6}$。这可以解决第一项被抵消的极限。注意 $u^3$ 的系数是负的，而且代入后 $u$ 中的常数也要取三次方。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = rng.int(1, 6);
    const answer = Q.of(-(a ** 3), 6 * b);
    const u = poly([a, "x"]);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{\\sin(${u}) - ${u}}{${poly([b, "x^3"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{\\sin(${u}) - ${u}}{${poly([b, "x^3"])}}$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(-(a ** 3), 2 * b), Q.of(0)],
      solution: t(
        `$\\sin(${u}) = ${u} - \\frac{${a ** 3}x^3}{6} + \\cdots$, so the numerator begins with $-\\frac{${a ** 3}}{6}x^3$. Dividing by $${poly([b, "x^3"])}$ gives $${answer.toLatex()}$.`,
        `$\\sin(${u}) = ${u} - \\frac{${a ** 3}x^3}{6} + \\cdots$，所以分子以 $-\\frac{${a ** 3}}{6}x^3$ 开头。除以 $${poly([b, "x^3"])}$ 得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const separableWithSquares: KnowledgePointDef = {
  id: "an-initial-value-problem-with-squares",
  title: t("An initial value problem with squares", "含平方的初值问题"),
  explanation: t(
    "Separating $\\frac{dy}{dx} = \\pm\\frac{x}{y}$ gives $y\\,dy = \\pm x\\,dx$, and integrating gives squares: $y^2 = \\pm x^2 + C$. The initial value fixes $C$. The solution is then a root, and the initial value also shows which sign of the root to take.",
    "分离 $\\frac{dy}{dx} = \\pm\\frac{x}{y}$ 得 $y\\,dy = \\pm x\\,dx$，积分后出现平方：$y^2 = \\pm x^2 + C$。初值确定 $C$。解是一个根式，初值同时说明根式取哪个符号。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
      [15, 8, 17],
      [7, 24, 25],
      [24, 7, 25],
    ] as const);
    const s = rng.int(1, 3);
    const grow = rng.int(0, 1) === 0;
    const x = p * s;
    const start = grow ? q * s : r * s;
    const answer = grow ? r * s : q * s;
    const right = grow ? "\\frac{x}{y}" : "-\\frac{x}{y}";
    const sign = grow ? "+" : "-";
    return numberProblem({
      prompt: t(
        `Solve $\\frac{dy}{dx} = ${right}$ with $y(0) = ${start}$, and find $y(${x})$.`,
        `解 $\\frac{dy}{dx} = ${right}$，$y(0) = ${start}$，并求 $y(${x})$。`,
      ),
      answer,
      form: "integer",
      wrong: [grow ? start + x : start - x, start, x],
      solution: t(
        `Separating and integrating gives $y^2 = ${start * start} ${sign} x^2$, using the initial value. At $x = ${x}$ this is $${answer * answer}$, and since $y(0)$ is positive, $y(${x}) = ${answer}$.`,
        `分离变量并积分，再用初值，得 $y^2 = ${start * start} ${sign} x^2$。在 $x = ${x}$ 处它等于 $${answer * answer}$，由于 $y(0)$ 为正，$y(${x}) = ${answer}$。`,
      ),
    });
  },
};

const coolingWithAHalfTime: KnowledgePointDef = {
  id: "cooling-with-a-fixed-halving-time",
  title: t("Cooling with a fixed halving time", "温差减半时间固定的冷却"),
  explanation: t(
    "Newton's law of cooling, $\\frac{dT}{dt} = -k(T - E)$, says the difference from the surroundings decays exponentially. It is the difference that halves in a fixed time, not the temperature. So halve the difference the right number of times, then add the temperature of the surroundings back.",
    "牛顿冷却定律 $\\frac{dT}{dt} = -k(T - E)$ 说明，与环境的温差按指数衰减。在固定时间内减半的是温差，而不是温度。所以把温差减半相应的次数，再加回环境温度。",
  ),
  generate(rng) {
    const E = rng.int(15, 25);
    const d = rng.int(20, 80);
    const H = rng.pick([5, 6, 8, 10, 12]);
    const n = rng.int(1, 4);
    const left = Q.of(d, 2 ** n);
    const answer = left.add(Q.of(E));
    const T0 = E + d;
    return numberProblem({
      prompt: t(
        `A drink at ${T0} °C cools in a room at ${E} °C according to Newton's law of cooling. Its difference from room temperature halves every ${H} minutes. What is its temperature after ${n * H} minutes, in °C?`,
        `一杯 ${T0} °C 的饮料在 ${E} °C 的房间中按牛顿冷却定律降温。它与室温的温差每 ${H} 分钟减半。${n * H} 分钟后它的温度是多少 °C？`,
      ),
      answer,
      wrong: [left, Q.of(T0, 2 ** n), Q.of(d, 2 * n).add(Q.of(E))],
      solution: t(
        `The difference starts at $${d}$ and halves $${n}$ times, leaving $${left.toLatex()}$. Adding the room temperature gives $${answer.toLatex()}$.`,
        `温差从 $${d}$ 开始，减半 $${n}$ 次，剩下 $${left.toLatex()}$。加上室温得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const stepSizeFromEuler: KnowledgePointDef = {
  id: "the-step-size-from-one-step-of-eulers-method",
  title: t("The step size from one step of Euler's method", "由欧拉法的一步求步长"),
  explanation: t(
    "One step of Euler's method is $y_1 = y_0 + h\\,f(x_0, y_0)$. This relation can be read in any direction: if the two values and the slope are known, the change $y_1 - y_0$ divided by the slope gives the step size $h$.",
    "欧拉法的一步是 $y_1 = y_0 + h\\,f(x_0, y_0)$。这个关系可以朝任何方向读：如果已知两个值和斜率，变化量 $y_1 - y_0$ 除以斜率就是步长 $h$。",
  ),
  generate(rng) {
    const y0 = rng.int(1, 9);
    const k = rng.int(1, 5);
    const s = rng.pick([2, 4, 5, 10]);
    const x0 = rng.int(0, 3);
    const h = Q.of(1, s);
    const y1 = Q.of(y0).add(h.mul(Q.of(k * y0)));
    const change = y1.sub(Q.of(y0));
    return numberProblem({
      prompt: t(
        `One step of Euler's method for $y' = ${poly([k, "y"])}$ with $y(${x0}) = ${y0}$ gives the estimate $${y1.toLatex()}$. What is the step size?`,
        `对 $y' = ${poly([k, "y"])}$，$y(${x0}) = ${y0}$，欧拉法的一步给出估计值 $${y1.toLatex()}$。步长是多少？`,
      ),
      answer: h,
      wrong: [change, Q.of(1, s * k), Q.of(k, s)],
      solution: t(
        `The slope at the start is $${k * y0}$, and the estimate rose by $${change.toLatex()}$. So $h = ${change.toLatex()} \\div ${k * y0} = ${h.toLatex()}$.`,
        `起点的斜率是 $${k * y0}$，估计值上升了 $${change.toLatex()}$。所以 $h = ${change.toLatex()} \\div ${k * y0} = ${h.toLatex()}$。`,
      ),
    });
  },
};

const evenPowerOfSecant: KnowledgePointDef = {
  id: "even-powers-of-secant",
  title: t("Even powers of secant", "正割的偶次幂"),
  explanation: t(
    "An even power of secant can give up one factor of $\\sec^2 x$ to serve as the differential of $\\tan x$. The rest is rewritten with $\\sec^2 x = 1 + \\tan^2 x$. So $\\int \\sec^4 x\\,dx$ becomes $\\int (1 + u^2)\\,du$ with $u = \\tan x$, and it is a polynomial integral.",
    "正割的偶次幂可以拿出一个因子 $\\sec^2 x$ 作为 $\\tan x$ 的微分，其余部分用 $\\sec^2 x = 1 + \\tan^2 x$ 改写。于是令 $u = \\tan x$，$\\int \\sec^4 x\\,dx$ 变成 $\\int (1 + u^2)\\,du$，这是多项式积分。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = nonzero(rng, 9);
    const answer = Q.of(4 * a, 3).add(Q.of(b));
    const integrand = poly([a, "\\sec^4 x"], [b, "\\sec^2 x"]);
    return numberProblem({
      prompt: t(`Find $\\int_0^{\\pi/4} (${integrand})\\,dx$.`, `求 $\\int_0^{\\pi/4} (${integrand})\\,dx$。`),
      answer,
      wrong: [Q.of(a + b), Q.of(a, 3).add(Q.of(b)), Q.of(4 * a + b)],
      solution: t(
        `With $u = \\tan x$, the limits become $0$ and $1$, and $\\int_0^1 (1 + u^2)\\,du = \\frac{4}{3}$. Also $\\int_0^{\\pi/4} \\sec^2 x\\,dx = 1$. So the integral is $${a} \\cdot \\frac{4}{3} + ${inParens(b)} = ${answer.toLatex()}$.`,
        `令 $u = \\tan x$，积分限变成 $0$ 和 $1$，$\\int_0^1 (1 + u^2)\\,du = \\frac{4}{3}$。又 $\\int_0^{\\pi/4} \\sec^2 x\\,dx = 1$。所以积分等于 $${a} \\cdot \\frac{4}{3} + ${inParens(b)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const orthogonalSines: KnowledgePointDef = {
  id: "the-integral-of-a-squared-sum-of-sines",
  title: t("The integral of a squared sum of sines", "正弦之和平方的积分"),
  explanation: t(
    "For different positive integers $m$ and $n$, the integral of $\\sin mx\\sin nx$ over a full period $[0, 2\\pi]$ is zero, by the product-to-sum identities. The square of a sum therefore keeps only its squared terms, and each $\\int_0^{2\\pi} \\sin^2 mx\\,dx$ equals $\\pi$. This is the idea behind Fourier series.",
    "当 $m$、$n$ 是不同的正整数时，由积化和差公式，$\\sin mx\\sin nx$ 在一个完整周期 $[0, 2\\pi]$ 上的积分为零。所以和的平方只留下平方项，而每个 $\\int_0^{2\\pi} \\sin^2 mx\\,dx$ 都等于 $\\pi$。这正是傅里叶级数的思想。",
  ),
  generate(rng) {
    const m = rng.int(1, 6);
    const n = different(rng, 1, 6, m);
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const answer = a * a + b * b;
    const sine = (j: number) => `\\sin ${j === 1 ? "" : j}x`;
    const integrand = poly([a, sine(m)], [b, sine(n)]);
    return numberProblem({
      prompt: t(`$\\int_0^{2\\pi} (${integrand})^2\\,dx = c\\pi$. Find $c$.`, `$\\int_0^{2\\pi} (${integrand})^2\\,dx = c\\pi$。求 $c$。`),
      answer,
      form: "integer",
      wrong: [(a + b) ** 2, 2 * answer, a * a],
      solution: t(
        `The cross term integrates to zero because the frequencies differ. Each squared sine integrates to $\\pi$, so the integral is $(${a * a} + ${b * b})\\pi$ and $c = ${answer}$.`,
        `由于频率不同，交叉项的积分为零。每个正弦的平方积分为 $\\pi$，所以积分等于 $(${a * a} + ${b * b})\\pi$，$c = ${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** coefficientOf writes a positive number before a symbol, leaving out 1. */
const coefficientOf = (n: number) => (n === 1 ? "" : `${n}`);
/** fractionBefore writes a fraction before a symbol, leaving out 1. */
const fractionBefore = (n: number, d: number) => (n === d ? "" : Q.of(n, d).toLatex());
/** factorial multiplies the whole numbers from 1 to n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
/** pythagorean picks the legs and hypotenuse of a right triangle with whole sides. */
const pythagorean = (rng: Rng) => {
  const [a, b, h] = rng.pick([
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [6, 8, 10],
    [7, 24, 25],
    [20, 21, 29],
    [9, 12, 15],
  ]) as [number, number, number];
  return rng.pick([true, false]) ? { a, b, h } : { a: b, b: a, h };
};

const changedLimits: KnowledgePointDef = {
  id: "a-definite-integral-with-changed-limits",
  title: t("A definite integral with changed limits", "换限的定积分"),
  explanation: t(
    "In a definite integral, a substitution changes the limits as well as the integrand. Once the limits are written in terms of $u$, there is no need to return to $x$ at the end. For $\\int x\\sqrt{x^2 + a^2}\\,dx$, take $u = x^2 + a^2$, so that the lower limit $x = 0$ becomes $u = a^2$.",
    "在定积分中，换元既改变被积函数，也改变积分限。积分限一旦写成 $u$ 的值，最后就不必再换回 $x$。对 $\\int x\\sqrt{x^2 + a^2}\\,dx$，取 $u = x^2 + a^2$，于是下限 $x = 0$ 变成 $u = a^2$。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const k = rng.int(1, 6);
    const difference = h ** 3 - a ** 3;
    const answer = Q.of(k * difference, 3);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{${b}} ${coefficientOf(k)}x\\sqrt{x^2 + ${a * a}}\\,dx$.`,
        `计算 $\\int_0^{${b}} ${coefficientOf(k)}x\\sqrt{x^2 + ${a * a}}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * h ** 3, 3), Q.of(2 * k * difference, 3), Q.of(k * (h * h - a * a), 2)],
      solution: t(
        `Let $u = x^2 + ${a * a}$, so $u$ runs from ${a * a} to ${h * h} and $x\\,dx = \\frac{1}{2}du$. The integral is $\\frac{${k}}{3}\\left(${h}^3 - ${a}^3\\right) = ${answer.toLatex()}$.`,
        `令 $u = x^2 + ${a * a}$，则 $u$ 从 ${a * a} 到 ${h * h}，且 $x\\,dx = \\frac{1}{2}du$。积分是 $\\frac{${k}}{3}\\left(${h}^3 - ${a}^3\\right) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitWithLogarithm: KnowledgePointDef = {
  id: "an-exponential-integral-with-a-logarithm-in-the-limit",
  title: t("An exponential integral with a logarithm in the limit", "积分限含对数的指数积分"),
  explanation: t(
    "After the substitution $u = x^2$, the integral of $xe^{x^2}$ is $\\frac{1}{2}e^{x^2}$. Limits are sometimes chosen so that the exponential simplifies. Since $e^{\\ln c} = c$, an upper limit of $\\sqrt{\\ln c}$ makes the antiderivative a plain number, and an answer that looks irrational turns out to be rational.",
    "经过换元 $u = x^2$，$xe^{x^2}$ 的积分是 $\\frac{1}{2}e^{x^2}$。积分限有时是特意选取的，以使指数化简。由于 $e^{\\ln c} = c$，上限取 $\\sqrt{\\ln c}$ 时，原函数的值就是一个普通的数，看起来超越的答案其实是有理数。",
  ),
  generate(rng) {
    const c = rng.int(2, 12);
    const k = rng.int(1, 9);
    const answer = Q.of(k * (c - 1), 2);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{\\sqrt{\\ln ${c}}} ${coefficientOf(k)}xe^{x^2}\\,dx$.`,
        `计算 $\\int_0^{\\sqrt{\\ln ${c}}} ${coefficientOf(k)}xe^{x^2}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * (c - 1)), Q.of(k * c, 2), Q.of(k * (c - 1), 4)],
      solution: t(
        `An antiderivative is $\\frac{${k}}{2}e^{x^2}$. At the upper limit $e^{x^2} = ${c}$ and at 0 it is 1, so the value is $\\frac{${k}}{2}(${c} - 1) = ${answer.toLatex()}$.`,
        `原函数是 $\\frac{${k}}{2}e^{x^2}$。在上限处 $e^{x^2} = ${c}$，在 0 处是 1，所以值是 $\\frac{${k}}{2}(${c} - 1) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const logLimits: KnowledgePointDef = {
  id: "a-definite-integral-of-a-power-of-ln-x-over-x",
  title: t("A definite integral of a power of $\\ln x$ over $x$", "$\\ln x$ 的幂除以 $x$ 的定积分"),
  explanation: t(
    "With $u = \\ln x$, the factor $\\frac{dx}{x}$ becomes $du$, and the limits transform as well: $x = 1$ gives $u = 0$, and $x = e^n$ gives $u = n$. What remains is the integral of a plain power of $u$. Limits that are powers of $e$ are therefore a strong signal to use this substitution.",
    "令 $u = \\ln x$，因子 $\\frac{dx}{x}$ 变成 $du$，积分限也随之变化：$x = 1$ 对应 $u = 0$，$x = e^n$ 对应 $u = n$。剩下的就是 $u$ 的普通幂函数的积分。所以积分限是 $e$ 的幂时，就是使用这个换元的明显信号。",
  ),
  generate(rng) {
    const n = rng.int(2, 5);
    const m = rng.int(1, 4);
    const k = rng.int(1, 6);
    const answer = Q.of(k * n ** (m + 1), m + 1);
    const power = m === 1 ? "\\ln x" : `(\\ln x)^{${m}}`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_1^{e^{${n}}} \\frac{${coefficientOf(k)}${power}}{x}\\,dx$.`,
        `计算 $\\int_1^{e^{${n}}} \\frac{${coefficientOf(k)}${power}}{x}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * n ** m, m), Q.of(k * n ** (m + 1)), Q.of(k * n ** (m + 1), m + 2)],
      solution: t(
        `With $u = \\ln x$, the limits become 0 and ${n}, and the integral is $\\int_0^{${n}} ${coefficientOf(k)}${m === 1 ? "u" : `u^{${m}}`}\\,du = \\frac{${k} \\cdot ${n}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()}$.`,
        `令 $u = \\ln x$，积分限变成 0 和 ${n}，积分是 $\\int_0^{${n}} ${coefficientOf(k)}${m === 1 ? "u" : `u^{${m}}`}\\,du = \\frac{${k} \\cdot ${n}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const powerOverQuarterTurn: KnowledgePointDef = {
  id: "a-power-of-sine-or-cosine-over-a-quarter-turn",
  title: t("A power of sine or cosine over a quarter turn", "正弦或余弦的幂在四分之一周期上的积分"),
  explanation: t(
    "When a single factor of cosine sits beside a power of sine, take $u = \\sin x$, and the cosine is absorbed into $du$. Over $[0, \\frac{\\pi}{2}]$, $u$ runs from 0 to 1 in either version of the integral, whether sine or cosine carries the power. So the answer is simply one over one more than the power.",
    "一个余弦因子紧挨着正弦的幂时，取 $u = \\sin x$，余弦就被吸收进 $du$。在 $[0, \\frac{\\pi}{2}]$ 上，无论幂在正弦还是余弦上，$u$ 都是在 0 与 1 之间变化。所以答案就是幂次加一的倒数。",
  ),
  generate(rng) {
    const n = rng.int(2, 9);
    const k = rng.int(1, 12);
    const answer = Q.of(k, n + 1);
    const integrand = rng.pick([`\\sin^{${n}} x\\cos x`, `\\cos^{${n}} x\\sin x`]);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{\\pi/2} ${coefficientOf(k)}${integrand}\\,dx$.`,
        `计算 $\\int_0^{\\pi/2} ${coefficientOf(k)}${integrand}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k, n), Q.of(k), answer.neg()],
      solution: t(
        `The substitution turns this into $${coefficientOf(k)}\\int_0^1 u^{${n}}\\,du = ${answer.toLatex()}$.`,
        `换元后变成 $${coefficientOf(k)}\\int_0^1 u^{${n}}\\,du = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const sinhCoshLimit: KnowledgePointDef = {
  id: "a-hyperbolic-integral-with-a-logarithm-in-the-limit",
  title: t("A hyperbolic integral with a logarithm in the limit", "积分限含对数的双曲积分"),
  explanation: t(
    "The substitution $u = \\sinh x$ gives $\\int \\sinh x\\cosh x\\,dx = \\frac{1}{2}\\sinh^2 x$. To evaluate at a limit such as $\\ln a$, return to the exponential definition: $\\sinh(\\ln a) = \\frac{1}{2}\\left(a - \\frac{1}{a}\\right)$. The exponentials and logarithm then cancel, so the result is a rational number whenever $a$ is one.",
    "换元 $u = \\sinh x$ 给出 $\\int \\sinh x\\cosh x\\,dx = \\frac{1}{2}\\sinh^2 x$。在 $\\ln a$ 这样的积分限处求值时，要回到指数定义：$\\sinh(\\ln a) = \\frac{1}{2}\\left(a - \\frac{1}{a}\\right)$。指数和对数相互抵消，所以只要 $a$ 是有理数，结果就是有理数。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const k = rng.int(1, 12);
    const top = a * a - 1;
    const answer = Q.of(k * top * top, 8 * a * a);
    const sinhValue = Q.of(top, 2 * a);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{\\ln ${a}} ${coefficientOf(k)}\\sinh x\\cosh x\\,dx$.`,
        `计算 $\\int_0^{\\ln ${a}} ${coefficientOf(k)}\\sinh x\\cosh x\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * top * top, 4 * a * a), Q.of(k * top, 2 * a), Q.of(k * top * top, 2 * a * a)],
      solution: t(
        `Here $\\sinh(\\ln ${a}) = ${sinhValue.toLatex()}$, and the integral is $\\frac{${k}}{2}\\sinh^2(\\ln ${a}) = ${answer.toLatex()}$.`,
        `这里 $\\sinh(\\ln ${a}) = ${sinhValue.toLatex()}$，积分是 $\\frac{${k}}{2}\\sinh^2(\\ln ${a}) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const inverseTrigDefinite: KnowledgePointDef = {
  id: "definite-integrals-giving-a-rational-multiple-of-pi",
  title: t("Definite integrals giving a rational multiple of $\\pi$", "结果为 $\\pi$ 的有理数倍的定积分"),
  explanation: t(
    "Inverse trigonometric antiderivatives evaluate to angles at familiar limits. Since $\\arcsin\\frac{1}{2} = \\frac{\\pi}{6}$ and $\\arctan 1 = \\frac{\\pi}{4}$, integrals with these limits come out as rational multiples of $\\pi$. Remember that the arcsine form carries no extra factor from $a$, whereas the arctangent form has a factor of $\\frac{1}{a}$ in front.",
    "反三角原函数在常见积分限处的值是角度。由于 $\\arcsin\\frac{1}{2} = \\frac{\\pi}{6}$，$\\arctan 1 = \\frac{\\pi}{4}$，这样的定积分结果是 $\\pi$ 的有理数倍。要记住，反正弦形式没有来自 $a$ 的额外因子，而反正切形式前面有因子 $\\frac{1}{a}$。",
  ),
  generate(rng) {
    const k = rng.int(1, 12);
    const half = rng.int(1, 6);
    const a = 2 * half;
    const sine = rng.pick([true, false]);
    const integrand = sine ? `\\frac{${k}}{\\sqrt{${a * a} - x^2}}` : `\\frac{${k}}{x^2 + ${half * half}}`;
    const top = half;
    const answer = sine ? Q.of(k, 6) : Q.of(k, 4 * half);
    return numberProblem({
      prompt: t(
        `The integral $\\int_0^{${top}} ${integrand}\\,dx$ equals $c\\pi$. Find $c$.`,
        `积分 $\\int_0^{${top}} ${integrand}\\,dx$ 等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: sine ? [Q.of(k, 3), Q.of(k, 6 * a), Q.of(k, 4)] : [Q.of(k, 4), Q.of(k, 2 * half), Q.of(k, 6 * half)],
      solution: sine
        ? t(
            `An antiderivative is $${coefficientOf(k)}\\arcsin\\frac{x}{${a}}$, and $\\arcsin\\frac{1}{2} = \\frac{\\pi}{6}$. So $c = ${answer.toLatex()}$.`,
            `原函数是 $${coefficientOf(k)}\\arcsin\\frac{x}{${a}}$，且 $\\arcsin\\frac{1}{2} = \\frac{\\pi}{6}$。所以 $c = ${answer.toLatex()}$。`,
          )
        : t(
            `An antiderivative is $${fractionBefore(k, half)}\\arctan${half === 1 ? " x" : `\\frac{x}{${half}}`}$, and $\\arctan 1 = \\frac{\\pi}{4}$. So $c = ${answer.toLatex()}$.`,
            `原函数是 $${fractionBefore(k, half)}\\arctan${half === 1 ? " x" : `\\frac{x}{${half}}`}$，且 $\\arctan 1 = \\frac{\\pi}{4}$。所以 $c = ${answer.toLatex()}$。`,
          ),
    });
  },
};

const doubleAngleTwice: KnowledgePointDef = {
  id: "applying-a-double-angle-formula-twice",
  title: t("Applying a double angle formula twice", "两次使用二倍角公式"),
  explanation: t(
    "A fourth power of sine or cosine needs the double angle formula twice: square the half-angle form, then reduce the $\\cos^2 2x$ that appears. Over a whole period every oscillating cosine term vanishes, so only the constant term survives. A product $\\sin^2 x\\cos^2 x$ reduces the same way, by way of $\\frac{1}{4}\\sin^2 2x$.",
    "正弦或余弦的四次幂需要两次使用二倍角公式：先把半角形式平方，再化简出现的 $\\cos^2 2x$。在一个完整周期上，每个振荡的余弦项都消失，只有常数项留下。乘积 $\\sin^2 x\\cos^2 x$ 也同样化简，先写成 $\\frac{1}{4}\\sin^2 2x$。",
  ),
  generate(rng) {
    const k = rng.int(1, 40);
    const kind = rng.pick([
      { latex: "\\sin^4 x", value: Q.of(3 * k, 4), constant: "\\frac{3}{8}" },
      { latex: "\\cos^4 x", value: Q.of(3 * k, 4), constant: "\\frac{3}{8}" },
      { latex: "\\sin^2 x\\cos^2 x", value: Q.of(k, 4), constant: "\\frac{1}{8}" },
    ]);
    return numberProblem({
      prompt: t(
        `The integral $\\int_0^{2\\pi} ${coefficientOf(k)}${kind.latex}\\,dx$ equals $c\\pi$. Find $c$.`,
        `积分 $\\int_0^{2\\pi} ${coefficientOf(k)}${kind.latex}\\,dx$ 等于 $c\\pi$。求 $c$。`,
      ),
      answer: kind.value,
      wrong: [Q.of(k, 2), Q.of(3 * k, 8), Q.of(k), Q.of(k, 8)],
      solution: t(
        `After reducing, the constant term of $${kind.latex}$ is $${kind.constant}$, and the cosine terms integrate to zero. So $c = ${k} \\cdot 2 \\cdot ${kind.constant} = ${kind.value.toLatex()}$.`,
        `化简后，$${kind.latex}$ 的常数项是 $${kind.constant}$，余弦项积分为零。所以 $c = ${k} \\cdot 2 \\cdot ${kind.constant} = ${kind.value.toLatex()}$。`,
      ),
    });
  },
};

const cyclicImproper: KnowledgePointDef = {
  id: "a-cyclic-integral-over-an-infinite-interval",
  title: t("A cyclic integral over an infinite interval", "无穷区间上的循环积分"),
  explanation: t(
    "Integrating by parts twice brings the original integral back, which gives an equation to solve. When the exponential decays, the boundary terms at infinity vanish and only those at zero remain. The result is $\\int_0^\\infty e^{-ax}\\sin bx\\,dx = \\frac{b}{a^2 + b^2}$, and the same with a numerator of $a$ when cosine replaces sine.",
    "分部积分两次后原积分又出现，于是得到一个可解的方程。指数衰减时，无穷远处的边界项消失，只留下零处的边界项。结果是 $\\int_0^\\infty e^{-ax}\\sin bx\\,dx = \\frac{b}{a^2 + b^2}$；把正弦换成余弦，分子就变成 $a$。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(2, 9);
    const sum = a * a + b * b;
    const sine = rng.pick([true, false]);
    const answer = Q.of(sine ? b : a, sum);
    const other = Q.of(sine ? a : b, sum);
    const trig = sine ? `\\sin ${b}x` : `\\cos ${b}x`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^\\infty e^{-${coefficientOf(a)}x}${trig}\\,dx$.`,
        `计算 $\\int_0^\\infty e^{-${coefficientOf(a)}x}${trig}\\,dx$。`,
      ),
      answer,
      wrong: [other, Q.of(1, sum), Q.of(sine ? b : a, a + b)],
      solution: t(
        `Two integrations by parts give $I = ${sine ? Q.of(b, a * a).toLatex() : Q.of(1, a).toLatex()} - ${Q.of(b * b, a * a).toLatex()}I$. Solving gives $I = \\frac{${sine ? b : a}}{${sum}} = ${answer.toLatex()}$.`,
        `两次分部积分给出 $I = ${sine ? Q.of(b, a * a).toLatex() : Q.of(1, a).toLatex()} - ${Q.of(b * b, a * a).toLatex()}I$。解得 $I = \\frac{${sine ? b : a}}{${sum}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const tabularValue: KnowledgePointDef = {
  id: "the-polynomial-factor-of-a-tabular-integral",
  title: t("The polynomial factor of a tabular integral", "表格法积分的多项式因子"),
  explanation: t(
    "For $\\int x^ne^x\\,dx$, the tabular method keeps differentiating the power while the exponential stays unchanged, with alternating signs. So the result is $e^x$ times the polynomial $x^n - nx^{n-1} + n(n-1)x^{n-2} - \\dots$, the terms being successive derivatives of $x^n$. A question about one value of this polynomial tests the entire table.",
    "对 $\\int x^ne^x\\,dx$，表格法不断对幂函数求导，指数函数保持不变，符号交替。所以结果是 $e^x$ 乘以多项式 $x^n - nx^{n-1} + n(n-1)x^{n-2} - \\dots$，各项是 $x^n$ 的逐阶导数。问这个多项式的一个值，就是在检验整张表。",
  ),
  generate(rng) {
    const n = rng.int(2, 4);
    const m = nonzero(rng, 6);
    const coefficients = [...Array(n + 1).keys()].map((j) => factorial(n) / factorial(n - j));
    const signedValue = coefficients.reduce((sum, c, j) => sum + (j % 2 === 0 ? c : -c) * m ** (n - j), 0);
    const plainValue = coefficients.reduce((sum, c, j) => sum + c * m ** (n - j), 0);
    const last = (n % 2 === 0 ? 1 : -1) * factorial(n);
    const terms = coefficients.map((c, j): [number, string] => [j % 2 === 0 ? c : -c, n - j === 0 ? "" : n - j === 1 ? "x" : `x^${n - j}`]);
    const P = poly(...terms);
    return numberProblem({
      prompt: t(
        `Write $\\int x^${n}e^x\\,dx = e^xP(x) + C$, where $P$ is a polynomial. Find $P(${m})$.`,
        `写成 $\\int x^${n}e^x\\,dx = e^xP(x) + C$，其中 $P$ 是多项式。求 $P(${m})$。`,
      ),
      answer: signedValue,
      form: "integer",
      wrong: [plainValue, m ** n, signedValue - last],
      solution: t(
        `The table gives $P(x) = ${P}$. Substituting $x = ${m}$ gives $${signedValue}$.`,
        `表格给出 $P(x) = ${P}$。代入 $x = ${m}$，得 $${signedValue}$。`,
      ),
    });
  },
};

const improperPartialFractions: KnowledgePointDef = {
  id: "an-improper-integral-by-partial-fractions",
  title: t("An improper integral by partial fractions", "用部分分式求反常积分"),
  explanation: t(
    "Each partial fraction alone gives a logarithm that diverges at infinity, so they must be combined before taking the limit. Writing the antiderivative as one logarithm of a quotient, $\\ln\\frac{x}{x + a}$, shows that the value at infinity is $\\ln 1 = 0$. Splitting the improper integral into two separate divergent pieces would fail.",
    "每个部分分式单独积分都得到在无穷远处发散的对数，所以必须先合并，再取极限。把原函数写成一个商的对数 $\\ln\\frac{x}{x + a}$，就能看出它在无穷远处的值是 $\\ln 1 = 0$。如果把反常积分拆成两个各自发散的部分，这样做是行不通的。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(1, 9);
    const answer = Q.of(k, a);
    return numberProblem({
      prompt: t(
        `The integral $\\int_1^\\infty \\frac{${k}}{x(x + ${a})}\\,dx$ equals $c\\ln ${a + 1}$. Find $c$.`,
        `积分 $\\int_1^\\infty \\frac{${k}}{x(x + ${a})}\\,dx$ 等于 $c\\ln ${a + 1}$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(k), answer.neg(), Q.of(k, a + 1)],
      solution: t(
        `An antiderivative is $${fractionBefore(k, a)}\\ln\\frac{x}{x + ${a}}$. It is 0 at infinity and $-${fractionBefore(k, a)}\\ln ${a + 1}$ at 1, so $c = ${answer.toLatex()}$.`,
        `原函数是 $${fractionBefore(k, a)}\\ln\\frac{x}{x + ${a}}$。它在无穷远处是 0，在 1 处是 $-${fractionBefore(k, a)}\\ln ${a + 1}$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const overCubedFactor: KnowledgePointDef = {
  id: "a-numerator-over-a-cubed-linear-factor",
  title: t("A numerator over a cubed linear factor", "分母为线性因子立方的积分"),
  explanation: t(
    "A linear factor repeated three times normally gives partial fractions up to the third power. Here the numerator is $x$, and rewriting it as $(x + a) - a$ gives the decomposition immediately, with no equations to solve. Each piece is then a negative power of $x + a$, and these integrate directly with no logarithms at all.",
    "重复三次的线性因子，一般分解出直到三次幂的部分分式。这里分子是 $x$，把它改写成 $(x + a) - a$，就立刻得到分解，不用解方程。每一部分都是 $x + a$ 的负幂，可以直接积分，完全不出现对数。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const k = rng.int(1, 9);
    const answer = Q.of(k, 2 * a);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^\\infty \\frac{${coefficientOf(k)}x}{(x + ${a})^3}\\,dx$.`,
        `计算 $\\int_0^\\infty \\frac{${coefficientOf(k)}x}{(x + ${a})^3}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k, a), Q.of(k, 2 * a * a), Q.of(k, 3 * a)],
      solution: t(
        `Split the fraction as $\\frac{1}{(x + ${a})^2} - \\frac{${a}}{(x + ${a})^3}$. These integrate to $${Q.of(1, a).toLatex()}$ and $\\frac{1}{${2 * a}}$, whose difference is $\\frac{1}{${2 * a}}$. Multiplying by ${k} gives $${answer.toLatex()}$.`,
        `把分式拆成 $\\frac{1}{(x + ${a})^2} - \\frac{${a}}{(x + ${a})^3}$。它们的积分分别是 $${Q.of(1, a).toLatex()}$ 和 $\\frac{1}{${2 * a}}$，差是 $\\frac{1}{${2 * a}}$。乘以 ${k}，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const evenOverRealLine: KnowledgePointDef = {
  id: "doubling-an-even-integrand-over-the-real-line",
  title: t("Doubling an even integrand over the real line", "实轴上偶函数积分加倍"),
  explanation: t(
    "An integral over the whole real line must be split at a finite point, and for an even integrand that split saves work. It equals twice the integral from zero to infinity. This also removes an absolute value, since $|x| = x$ on the positive half, and then a substitution such as $u = ax^2$ finishes the calculation.",
    "实轴上的积分必须在某个有限点分开，而对偶函数，这样分开还能省事。它等于从零到无穷积分的两倍。这也去掉了绝对值，因为在正半轴上 $|x| = x$，然后用 $u = ax^2$ 这样的换元就能算完。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(1, 12);
    const answer = Q.of(k, a);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{-\\infty}^\\infty ${coefficientOf(k)}|x|e^{-${coefficientOf(a)}x^2}\\,dx$.`,
        `计算 $\\int_{-\\infty}^\\infty ${coefficientOf(k)}|x|e^{-${coefficientOf(a)}x^2}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(2 * k, a), Q.of(k, 2 * a), Q.of(0)],
      solution: t(
        `The integrand is even, so this is $2\\int_0^\\infty ${coefficientOf(k)}xe^{-${coefficientOf(a)}x^2}\\,dx = 2 \\cdot \\frac{${k}}{${2 * a}} = ${answer.toLatex()}$.`,
        `被积函数是偶函数，所以它等于 $2\\int_0^\\infty ${coefficientOf(k)}xe^{-${coefficientOf(a)}x^2}\\,dx = 2 \\cdot \\frac{${k}}{${2 * a}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const unboundedAtTop: KnowledgePointDef = {
  id: "an-integrand-unbounded-at-the-upper-limit",
  title: t("An integrand unbounded at the upper limit", "在上限处无界的被积函数"),
  explanation: t(
    "An integrand may blow up at the upper limit rather than the lower one, and then the limit is taken from the left. With $\\frac{x}{\\sqrt{a^2 - x^2}}$, the numerator is exactly what the substitution $u = a^2 - x^2$ needs, and the antiderivative $-\\sqrt{a^2 - x^2}$ stays finite as $x$ approaches $a$, so the integral converges.",
    "被积函数也可能在上限而不是下限处趋于无穷，这时从左侧取极限。对 $\\frac{x}{\\sqrt{a^2 - x^2}}$，分子恰好是换元 $u = a^2 - x^2$ 所需要的，原函数 $-\\sqrt{a^2 - x^2}$ 在 $x$ 趋于 $a$ 时保持有限，所以积分收敛。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const k = rng.int(1, 9);
    const answer = k * a;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{${a}} \\frac{${coefficientOf(k)}x}{\\sqrt{${a * a} - x^2}}\\,dx$.`,
        `计算 $\\int_0^{${a}} \\frac{${coefficientOf(k)}x}{\\sqrt{${a * a} - x^2}}\\,dx$。`,
      ),
      answer,
      form: "integer",
      wrong: [k * a * a, 2 * k * a, k],
      solution: t(
        `An antiderivative is $-${coefficientOf(k)}\\sqrt{${a * a} - x^2}$. It tends to 0 at the upper limit and equals $-${answer}$ at 0, so the value is $${answer}$.`,
        `原函数是 $-${coefficientOf(k)}\\sqrt{${a * a} - x^2}$。它在上限处趋于 0，在 0 处等于 $-${answer}$，所以值是 $${answer}$。`,
      ),
    });
  },
};

const massShare: KnowledgePointDef = {
  id: "the-point-that-cuts-off-a-share-of-the-mass",
  title: t("The point that cuts off a share of the mass", "截取一定比例质量的位置"),
  explanation: t(
    "On a rod with density $kx$, the mass from 0 to $m$ is $\\frac{km^2}{2}$, which grows with the square of the position. So the share of the mass up to $m$ is $\\left(\\frac{m}{L}\\right)^2$, and the constant $k$ cancels. To cut off a given share, take a square root rather than dividing the rod in proportion.",
    "在密度为 $kx$ 的杆上，从 0 到 $m$ 的质量是 $\\frac{km^2}{2}$，随位置的平方增长。所以到 $m$ 为止的质量比例是 $\\left(\\frac{m}{L}\\right)^2$，常数 $k$ 被约去。要截取给定比例，就要开平方，而不是按比例分割杆。",
  ),
  generate(rng) {
    const q = rng.int(2, 5);
    const p = rng.int(1, q - 1);
    const n = rng.int(1, 6);
    const k = rng.int(2, 9);
    const L = q * n;
    const answer = p * n;
    const share = Q.of(p * p, q * q);
    return numberProblem({
      prompt: t(
        `A rod on $[0, ${L}]$ has density $${k}x$. At what position $m$ does $[0, m]$ hold $${share.toLatex()}$ of the rod's mass?`,
        `$[0, ${L}]$ 上的杆，密度是 $${k}x$。在什么位置 $m$，$[0, m]$ 含有杆的质量的 $${share.toLatex()}$？`,
      ),
      answer,
      wrong: [Q.of(L * p * p, q * q), Q.of(L, 2), Q.of(L * p * p, q), Q.of(L * (q * q - p * p), q * q)],
      solution: t(
        `The share up to $m$ is $\\left(\\frac{m}{${L}}\\right)^2$. Setting this to $${share.toLatex()}$ gives $\\frac{m}{${L}} = ${Q.of(p, q).toLatex()}$, so $m = ${answer}$.`,
        `到 $m$ 为止的比例是 $\\left(\\frac{m}{${L}}\\right)^2$。令它等于 $${share.toLatex()}$，得 $\\frac{m}{${L}} = ${Q.of(p, q).toLatex()}$，所以 $m = ${answer}$。`,
      ),
    });
  },
};

const pappusVolume: KnowledgePointDef = {
  id: "the-volume-of-a-torus-from-the-theorem-of-pappus",
  title: t("The volume of a torus from the theorem of Pappus", "用帕普斯定理求环体的体积"),
  explanation: t(
    "The theorem of Pappus says that rotating a region about an outside axis gives a volume equal to the region's area times the distance travelled by its centroid. A disk's centroid is its centre, so a torus has volume $\\pi r^2 \\cdot 2\\pi R$. The washer integral gives the same answer, with considerably more work.",
    "帕普斯定理说，把区域绕区域外的轴旋转，体积等于区域面积乘以形心走过的距离。圆盘的形心就是圆心，所以环体的体积是 $\\pi r^2 \\cdot 2\\pi R$。用垫圈法积分也得到同样的答案，只是要费事得多。",
  ),
  generate(rng) {
    const R = rng.int(2, 12);
    const r = rng.int(1, R - 1);
    const answer = 2 * R * r * r;
    return numberProblem({
      prompt: t(
        `The disk $x^2 + y^2 \\le ${r * r}$ is rotated about the line $x = ${R}$. The volume is $c\\pi^2$. Find $c$.`,
        `圆盘 $x^2 + y^2 \\le ${r * r}$ 绕直线 $x = ${R}$ 旋转。体积是 $c\\pi^2$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [R * r * r, 2 * R * R * r, 2 * R * r],
      solution: t(
        `The centre travels $2\\pi \\cdot ${R}$, and the area is $${r === 1 ? "" : r * r}\\pi$. Their product is $${answer}\\pi^2$.`,
        `圆心走过 $2\\pi \\cdot ${R}$，面积是 $${r === 1 ? "" : r * r}\\pi$。它们的积是 $${answer}\\pi^2$。`,
      ),
    });
  },
};

const distanceGap: KnowledgePointDef = {
  id: "the-gap-between-distance-and-displacement",
  title: t("The gap between distance and displacement", "路程与位移之差"),
  explanation: t(
    "Distance and the size of the displacement agree when a particle never turns around. When it reverses, the shorter of the two legs is walked back, and it counts for the distance but cancels in the displacement. The gap is therefore twice the shorter leg. Comparing the two areas between the velocity graph and the axis shows this.",
    "质点不折返时，路程和位移的大小相同。折返时，较短的那一段走回头路，它计入路程，却在位移中抵消。所以差是较短那段的两倍。比较速度图像与横轴之间的两块面积就能看出这一点。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const T = a + b;
    const shorter = Math.min(a, b);
    const answer = k * shorter * shorter;
    const distance = Q.of(k * (a * a + b * b), 2);
    const displacement = Q.of(k * Math.abs(b * b - a * a), 2);
    return numberProblem({
      prompt: t(
        `A particle has velocity $v(t) = ${poly([k, "t"], [-k * a, ""])}$ for $0 \\le t \\le ${T}$. By how much does its total distance exceed the size of its displacement?`,
        `质点的速度是 $v(t) = ${poly([k, "t"], [-k * a, ""])}$，$0 \\le t \\le ${T}$。它的总路程比位移的大小多多少？`,
      ),
      answer,
      wrong: [distance, displacement, Q.of(2 * answer)],
      solution: t(
        `The two areas are $${Q.of(k * a * a, 2).toLatex()}$ and $${Q.of(k * b * b, 2).toLatex()}$. Distance is their sum $${distance.toLatex()}$, and the displacement has size $${displacement.toLatex()}$. The gap is $${answer}$.`,
        `两块面积是 $${Q.of(k * a * a, 2).toLatex()}$ 和 $${Q.of(k * b * b, 2).toLatex()}$。路程是它们的和 $${distance.toLatex()}$，位移的大小是 $${displacement.toLatex()}$。差是 $${answer}$。`,
      ),
    });
  },
};

const stoppingTime: KnowledgePointDef = {
  id: "the-time-to-stop-after-speeding-up",
  title: t("The time to stop after speeding up", "加速后到停止的时间"),
  explanation: t(
    "When the acceleration is given in stages, integrate one stage at a time, using the final velocity of each stage as the starting velocity of the next. The constant of integration carries that information across. A vehicle that speeds up and then slows down stops at the moment its velocity function returns to zero.",
    "加速度分阶段给出时，要逐段积分，每一段的末速度就是下一段的初速度。积分常数正是把这个信息传递下去。先加速再减速的车辆，在速度函数回到零的时刻停下来。",
  ),
  generate(rng) {
    const d = rng.int(1, 6);
    const m = rng.int(1, 5);
    const up = d * m;
    const t1 = rng.int(1, 12);
    const peak = up * t1;
    const answer = t1 * (1 + m);
    return numberProblem({
      prompt: t(
        `A cart starts from rest with acceleration ${up} for ${t1} ${t1 === 1 ? "second" : "seconds"}, and then has acceleration $-${d}$ until it stops. At what time, in seconds after the start, does it stop?`,
        `小车从静止出发，以加速度 ${up} 运动 ${t1} 秒，然后以加速度 $-${d}$ 运动直到停止。它在出发后多少秒停下？`,
      ),
      answer,
      form: "integer",
      wrong: [t1 * m, peak, t1 + d],
      solution: t(
        `The velocity reaches $${up} \\cdot ${t1} = ${peak}$. It falls to zero in another $${peak} \\div ${d} = ${t1 * m}$ seconds, so the cart stops at $${answer}$.`,
        `速度达到 $${up} \\cdot ${t1} = ${peak}$。再过 $${peak} \\div ${d} = ${t1 * m}$ 秒降到零，所以小车在第 $${answer}$ 秒停下。`,
      ),
    });
  },
};

const astroidLength: KnowledgePointDef = {
  id: "the-length-of-an-astroid",
  title: t("The length of an astroid", "星形线的长度"),
  explanation: t(
    "The astroid $x = a\\cos^3 t$, $y = a\\sin^3 t$ has speed $3a|\\sin t\\cos t|$. The absolute value means that a direct integral over the whole turn would give zero if the bars were dropped. So use symmetry: integrate over a quarter of the curve, where the sine and cosine are both positive, and multiply by four.",
    "星形线 $x = a\\cos^3 t$，$y = a\\sin^3 t$ 的速率是 $3a|\\sin t\\cos t|$。如果去掉绝对值，直接在一整圈上积分会得到零。所以要利用对称性：在四分之一条曲线上积分，这里正弦和余弦都是正的，再乘以四。",
  ),
  generate(rng) {
    const a = rng.int(1, 30);
    const answer = 6 * a;
    return numberProblem({
      prompt: t(
        `Find the length of the curve $x = ${coefficientOf(a)}\\cos^3 t$, $y = ${coefficientOf(a)}\\sin^3 t$, $0 \\le t \\le 2\\pi$.`,
        `求曲线 $x = ${coefficientOf(a)}\\cos^3 t$，$y = ${coefficientOf(a)}\\sin^3 t$（$0 \\le t \\le 2\\pi$）的长度。`,
      ),
      answer,
      form: "integer",
      wrong: [0, 3 * a, 12 * a],
      solution: t(
        `On a quarter of the curve the length is $\\int_0^{\\pi/2} ${3 * a}\\sin t\\cos t\\,dt = ${Q.of(3 * a, 2).toLatex()}$. Four of these give $${answer}$.`,
        `四分之一条曲线的长度是 $\\int_0^{\\pi/2} ${3 * a}\\sin t\\cos t\\,dt = ${Q.of(3 * a, 2).toLatex()}$。四段合计 $${answer}$。`,
      ),
    });
  },
};

const astroidArea: KnowledgePointDef = {
  id: "the-area-inside-an-astroid",
  title: t("The area inside an astroid", "星形线围成的面积"),
  explanation: t(
    "The area inside a closed parametric curve is the integral of $y\\,dx$ with suitable orientation. For the astroid this gives a constant times $\\int \\sin^4 t\\cos^2 t\\,dt$, which reduces by the double angle formulas. Using symmetry, take one quarter of the region, where the integrand has a single sign, and multiply by four.",
    "参数曲线围成的面积，是取合适方向的 $y\\,dx$ 的积分。对星形线，这给出常数乘以 $\\int \\sin^4 t\\cos^2 t\\,dt$，可以用二倍角公式化简。利用对称性，取区域的四分之一，这里被积函数符号不变，再乘以四。",
  ),
  generate(rng) {
    const a = rng.int(1, 30);
    const answer = Q.of(3 * a * a, 8);
    return numberProblem({
      prompt: t(
        `The region enclosed by $x = ${coefficientOf(a)}\\cos^3 t$, $y = ${coefficientOf(a)}\\sin^3 t$ has area $c\\pi$. Find $c$.`,
        `曲线 $x = ${coefficientOf(a)}\\cos^3 t$，$y = ${coefficientOf(a)}\\sin^3 t$ 围成的区域面积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(3 * a * a, 4), Q.of(a * a, 2), Q.of(3 * a * a, 16)],
      solution: t(
        `A quarter of the area is $3 \\cdot ${a * a} \\cdot \\int_0^{\\pi/2} \\sin^4 t\\cos^2 t\\,dt = 3 \\cdot ${a * a} \\cdot \\frac{\\pi}{32}$. Multiplying by four gives $c = ${answer.toLatex()}$.`,
        `四分之一的面积是 $3 \\cdot ${a * a} \\cdot \\int_0^{\\pi/2} \\sin^4 t\\cos^2 t\\,dt = 3 \\cdot ${a * a} \\cdot \\frac{\\pi}{32}$。乘以四，得 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const roseArea: KnowledgePointDef = {
  id: "the-total-area-of-a-rose-curve",
  title: t("The total area of a rose curve", "玫瑰线的总面积"),
  explanation: t(
    "A rose $r = a\\cos n\\theta$ has $n$ petals when $n$ is odd and $2n$ when $n$ is even. When $n$ is odd, the curve is traced twice over $[0, 2\\pi]$, so one must integrate only over $[0, \\pi]$. As a result, the total area is $\\frac{\\pi a^2}{4}$ for odd $n$ and $\\frac{\\pi a^2}{2}$ for even $n$, whatever $n$ is.",
    "玫瑰线 $r = a\\cos n\\theta$ 在 $n$ 为奇数时有 $n$ 片花瓣，为偶数时有 $2n$ 片。$n$ 为奇数时，曲线在 $[0, 2\\pi]$ 上被描了两遍，所以只应在 $[0, \\pi]$ 上积分。因此总面积在 $n$ 为奇数时是 $\\frac{\\pi a^2}{4}$，为偶数时是 $\\frac{\\pi a^2}{2}$，与 $n$ 的具体值无关。",
  ),
  generate(rng) {
    const n = rng.int(2, 7);
    const a = rng.int(1, 9);
    const odd = n % 2 === 1;
    const answer = Q.of(a * a, odd ? 4 : 2);
    const other = Q.of(a * a, odd ? 2 : 4);
    const petals = odd ? n : 2 * n;
    return numberProblem({
      prompt: t(
        `The total area enclosed by all the petals of $r = ${coefficientOf(a)}\\cos ${n}\\theta$ is $c\\pi$. Find $c$.`,
        `$r = ${coefficientOf(a)}\\cos ${n}\\theta$ 所有花瓣围成的总面积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [other, Q.of(a * a), Q.of(n * a * a, 4)],
      solution: t(
        `The rose has ${petals} petals, each of area $\\frac{${a === 1 ? "" : a * a}\\pi}{${4 * n}}$. Their total gives $c = ${answer.toLatex()}$.`,
        `这条玫瑰线有 ${petals} 片花瓣，每片的面积是 $\\frac{${a === 1 ? "" : a * a}\\pi}{${4 * n}}$。它们的总和给出 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const conjugateLimit: KnowledgePointDef = {
  id: "the-limit-of-a-root-minus-n",
  title: t("The limit of a root minus $n$", "根式减 $n$ 的极限"),
  explanation: t(
    "In $\\sqrt{n^2 + an + b} - n$, both terms grow without bound, and comparing their dominant terms alone suggests a limit of zero, which is wrong. Multiplying by the conjugate gives the quotient $\\frac{an + b}{\\sqrt{n^2 + an + b} + n}$. Its dominant terms are $an$ over $2n$, so the limit is $\\frac{a}{2}$, and $b$ plays no part.",
    "在 $\\sqrt{n^2 + an + b} - n$ 中，两项都无限增大，只比较主导项会以为极限是零，这是错的。乘以共轭式得到商 $\\frac{an + b}{\\sqrt{n^2 + an + b} + n}$。它的主导项是 $an$ 比 $2n$，所以极限是 $\\frac{a}{2}$，$b$ 不起作用。",
  ),
  generate(rng) {
    const a = nonzero(rng, 12);
    const b = rng.int(1, 12);
    const answer = Q.of(a, 2);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{n \\to \\infty} \\left(\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} - n\\right)$.`,
        `求 $\\lim_{n \\to \\infty} \\left(\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} - n\\right)$。`,
      ),
      answer,
      wrong: [Q.of(a), Q.of(0), Q.of(b, 2)],
      solution: t(
        `Multiplying by the conjugate gives $\\frac{${poly([a, "n"], [b, ""])}}{\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} + n}$. The dominant terms give $\\frac{${a}}{2} = ${answer.toLatex()}$.`,
        `乘以共轭式得 $\\frac{${poly([a, "n"], [b, ""])}}{\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} + n}$。主导项给出 $\\frac{${a}}{2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const telescopingWithGap: KnowledgePointDef = {
  id: "a-telescoping-series-with-a-gap",
  title: t("A telescoping series with a gap", "有间隔的裂项级数"),
  explanation: t(
    "Partial fractions write $\\frac{1}{n(n + a)}$ as $\\frac{1}{a}\\left(\\frac{1}{n} - \\frac{1}{n + a}\\right)$. In the partial sums, each negative term cancels a positive term $a$ places later. So the first $a$ positive terms survive, while the remaining terms tend to zero. The sum is therefore $\\frac{1}{a}$ times the sum of the reciprocals from 1 to $a$.",
    "部分分式把 $\\frac{1}{n(n + a)}$ 写成 $\\frac{1}{a}\\left(\\frac{1}{n} - \\frac{1}{n + a}\\right)$。在部分和中，每个负项抵消 $a$ 个位置之后的一个正项。所以前 $a$ 个正项留下，其余的项趋于零。因此和是 $\\frac{1}{a}$ 乘以从 1 到 $a$ 的倒数之和。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const k = rng.int(1, 12);
    const reciprocals = [...Array(a).keys()].map((i) => Q.of(1, i + 1));
    const harmonic = reciprocals.reduce((sum, r) => sum.add(r), Q.of(0));
    const answer = Q.of(k, a).mul(harmonic);
    return numberProblem({
      prompt: t(`Find $\\sum_{n=1}^\\infty \\frac{${k}}{n(n + ${a})}$.`, `求 $\\sum_{n=1}^\\infty \\frac{${k}}{n(n + ${a})}$。`),
      answer,
      wrong: [Q.of(k, a), Q.of(k), Q.of(k, a + 1), Q.of(2 * k)],
      solution: t(
        `The terms telescope and leave $${Q.of(k, a).toLatex()}$ times $${reciprocals.map((r) => r.toLatex()).join(" + ")}$, which is $${answer.toLatex()}$.`,
        `各项裂项相消后，留下 $${Q.of(k, a).toLatex()}$ 乘以 $${reciprocals.map((r) => r.toLatex()).join(" + ")}$，即 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const bouncingBall: KnowledgePointDef = {
  id: "the-total-distance-of-a-bouncing-ball",
  title: t("The total distance of a bouncing ball", "弹跳小球的总路程"),
  explanation: t(
    "A ball that loses a fixed share of its height on every bounce travels a geometric total. The first drop happens only once, but each later height is covered twice, going up and coming down. So the total is the initial height plus twice a geometric series that starts from the first rebound, not from the initial drop.",
    "每次弹跳都损失固定比例高度的小球，走过的总路程是一个几何级数。第一次下落只发生一次，但之后的每个高度都走两遍，上去一次，下来一次。所以总路程是初始高度加上两倍的几何级数，这个级数从第一次反弹开始，而不是从初始下落开始。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [2, 5],
      [3, 5],
    ]) as [number, number];
    const h = rng.int(1, 12) * (q - p);
    const answer = Q.of(h * (q + p), q - p);
    const rebound = Q.of(h * p, q - p);
    const ratio = Q.of(p, q);
    return numberProblem({
      prompt: t(
        `A ball is dropped from a height of ${h} metres, and each bounce rises to $${ratio.toLatex()}$ of the previous height. Find the total vertical distance it travels, in metres.`,
        `小球从 ${h} 米高处落下，每次弹起的高度是前一次的 $${ratio.toLatex()}$。求它走过的总竖直路程（单位：米）。`,
      ),
      answer,
      wrong: [Q.of(h * q, q - p), Q.of(2 * h * q, q - p), rebound],
      solution: t(
        `The rebound heights add up to $\\frac{${h} \\cdot ${ratio.toLatex()}}{1 - ${ratio.toLatex()}} = ${rebound.toLatex()}$. Each is travelled twice, so the total is $${h} + 2 \\cdot ${rebound.toLatex()} = ${answer.toLatex()}$.`,
        `各次弹起的高度之和是 $\\frac{${h} \\cdot ${ratio.toLatex()}}{1 - ${ratio.toLatex()}} = ${rebound.toLatex()}$。每段都走两遍，所以总路程是 $${h} + 2 \\cdot ${rebound.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const taylorBySubstitution: KnowledgePointDef = {
  id: "a-taylor-coefficient-by-substitution",
  title: t("A Taylor coefficient by substitution", "用代入法求泰勒系数"),
  explanation: t(
    "Computing many derivatives of $e^{ax^2}$ would be painful, but its series comes straight from that of $e^u$ with $u = ax^2$. Only even powers of $x$ appear, and the term in $x^{2m}$ is the term in $u^m$. So the coefficient is $\\frac{a^m}{m!}$. The factorial belongs to $m$, not to the power $2m$.",
    "计算 $e^{ax^2}$ 的多阶导数很麻烦，但它的级数可以直接由 $e^u$ 的级数令 $u = ax^2$ 得到。只出现 $x$ 的偶次幂，$x^{2m}$ 项就是 $u^m$ 项。所以系数是 $\\frac{a^m}{m!}$。阶乘属于 $m$，而不是幂次 $2m$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const m = rng.int(2, 5);
    const answer = Q.of(a ** m, factorial(m));
    return numberProblem({
      prompt: t(
        `Find the coefficient of $x^{${2 * m}}$ in the Taylor series of $e^{${poly([a, "x^2"])}}$ about 0.`,
        `求 $e^{${poly([a, "x^2"])}}$ 在 0 处的泰勒级数中 $x^{${2 * m}}$ 的系数。`,
      ),
      answer,
      wrong: [Q.of(a ** m, factorial(2 * m)), Q.of(a ** m), Q.of(a, factorial(m))],
      solution: t(
        `With $u = ${poly([a, "x^2"])}$, the term in $x^{${2 * m}}$ comes from $\\frac{u^{${m}}}{${m}!}$. Its coefficient is $\\frac{${a < 0 ? `(${a})` : a}^{${m}}}{${factorial(m)}} = ${answer.toLatex()}$.`,
        `令 $u = ${poly([a, "x^2"])}$，$x^{${2 * m}}$ 项来自 $\\frac{u^{${m}}}{${m}!}$。它的系数是 $\\frac{${a < 0 ? `(${a})` : a}^{${m}}}{${factorial(m)}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const geometricSubstitution: KnowledgePointDef = {
  id: "a-coefficient-of-a-geometric-series-in-x-squared",
  title: t("A coefficient of a geometric series in $x^2$", "关于 $x^2$ 的几何级数的系数"),
  explanation: t(
    "The fraction $\\frac{k}{1 + ax^2}$ is a geometric series with first term $k$ and ratio $-ax^2$. Keep the minus sign with the ratio, because it makes the coefficients alternate. The term in $x^{2m}$ uses the ratio $m$ times, and so its coefficient is $k(-a)^m$. Odd powers of $x$ have coefficient zero.",
    "分式 $\\frac{k}{1 + ax^2}$ 是首项为 $k$、公比为 $-ax^2$ 的几何级数。负号要留在公比里，正是它使系数正负交替。$x^{2m}$ 项用了 $m$ 次公比，所以系数是 $k(-a)^m$。$x$ 的奇次幂系数为零。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const k = rng.int(1, 6);
    const m = rng.int(2, 5);
    const answer = k * (-a) ** m;
    return numberProblem({
      prompt: t(
        `Find the coefficient of $x^{${2 * m}}$ in the power series of $\\frac{${k}}{1 + ${coefficientOf(a)}x^2}$ about 0.`,
        `求 $\\frac{${k}}{1 + ${coefficientOf(a)}x^2}$ 在 0 处的幂级数中 $x^{${2 * m}}$ 的系数。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, k * (-a) ** (2 * m), k * (-a) ** (m + 1), k * a * m],
      solution: t(
        `The ratio is $-${coefficientOf(a)}x^2$, used ${m} times, so the coefficient is $${k} \\cdot (-${a})^{${m}} = ${answer}$.`,
        `公比是 $-${coefficientOf(a)}x^2$，用了 ${m} 次，所以系数是 $${k} \\cdot (-${a})^{${m}} = ${answer}$。`,
      ),
    });
  },
};

const highDerivativeOfProduct: KnowledgePointDef = {
  id: "a-high-derivative-of-a-product-from-its-series",
  title: t("A high derivative of a product from its series", "由级数求乘积的高阶导数"),
  explanation: t(
    "Multiplying a series by $x^2$ shifts every term up by two places. So the coefficient of $x^n$ in $x^2e^{ax}$ is the coefficient of $x^{n-2}$ in $e^{ax}$. The derivative at 0 is then $n!$ times that coefficient. This avoids differentiating a product $n$ times, which would be slow and prone to mistakes.",
    "把级数乘以 $x^2$，每一项都上移两位。所以 $x^2e^{ax}$ 中 $x^n$ 的系数，就是 $e^{ax}$ 中 $x^{n-2}$ 的系数。在 0 处的导数就是 $n!$ 乘以这个系数。这样就不用对乘积求 $n$ 次导，那样既慢又容易出错。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const n = rng.int(4, 8);
    const power = a ** (n - 2);
    const answer = n * (n - 1) * power;
    return numberProblem({
      prompt: t(
        `Let $f(x) = x^2e^{${poly([a, "x"])}}$. Find $f^{(${n})}(0)$.`,
        `设 $f(x) = x^2e^{${poly([a, "x"])}}$。求 $f^{(${n})}(0)$。`,
      ),
      answer,
      form: "integer",
      wrong: [power, n * power, n * (n - 1) * a ** n],
      solution: t(
        `The coefficient of $x^{${n}}$ is $\\frac{${inParens(a)}^{${n - 2}}}{${n - 2}!}$. Multiplying by $${n}!$ gives $${n} \\cdot ${n - 1} \\cdot ${inParens(a)}^{${n - 2}} = ${answer}$.`,
        `$x^{${n}}$ 的系数是 $\\frac{${inParens(a)}^{${n - 2}}}{${n - 2}!}$。乘以 $${n}!$，得 $${n} \\cdot ${n - 1} \\cdot ${inParens(a)}^{${n - 2}} = ${answer}$。`,
      ),
    });
  },
};

const evenPowersRadius: KnowledgePointDef = {
  id: "the-radius-of-a-series-in-even-powers",
  title: t("The radius of a series in even powers", "偶次幂级数的收敛半径"),
  explanation: t(
    "A series with only even powers of $x$ skips terms, so the usual ratio of coefficients does not give the radius directly. Treat it as a geometric series in $x^2$ instead. It converges when the ratio has size less than one, which bounds $x^2$. Then take a square root, and this is the step most easily forgotten.",
    "只含 $x$ 偶次幂的级数跳过了一些项，所以通常的系数之比不能直接给出半径。可以把它看作关于 $x^2$ 的几何级数。公比的大小小于一时收敛，这就限定了 $x^2$。然后要开平方，这是最容易忘记的一步。",
  ),
  generate(rng) {
    const s = rng.int(2, 9);
    const u = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== s));
    const answer = Q.of(s, u);
    const top = u === 1 ? "" : `${u * u}^n`;
    return numberProblem({
      prompt: t(
        `Find the radius of convergence of $\\sum_{n=0}^\\infty \\frac{${top}x^{2n}}{${s * s}^n}$.`,
        `求 $\\sum_{n=0}^\\infty \\frac{${top}x^{2n}}{${s * s}^n}$ 的收敛半径。`,
      ),
      answer,
      wrong: [Q.of(s * s, u * u), Q.of(u, s), Q.of(s * s, u)],
      solution: t(
        `The ratio is $${Q.of(u * u, s * s).toLatex()}x^2$, and it has size below 1 when $x^2 < ${Q.of(s * s, u * u).toLatex()}$. The square root gives $${answer.toLatex()}$.`,
        `公比是 $${Q.of(u * u, s * s).toLatex()}x^2$，当 $x^2 < ${Q.of(s * s, u * u).toLatex()}$ 时它的大小小于 1。开平方得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const circularForce: KnowledgePointDef = {
  id: "the-size-of-the-force-in-circular-motion",
  title: t("The size of the force in circular motion", "圆周运动中力的大小"),
  explanation: t(
    "A particle moving as $\\mathbf{r}(t) = \\langle A\\cos\\omega t, A\\sin\\omega t \\rangle$ has acceleration $-\\omega^2\\mathbf{r}$, which points toward the centre. By Newton's second law, the force has size $mA\\omega^2$ at every moment. The size is constant even though the direction changes, and doubling the angular speed multiplies the force by four.",
    "按 $\\mathbf{r}(t) = \\langle A\\cos\\omega t, A\\sin\\omega t \\rangle$ 运动的质点，加速度是 $-\\omega^2\\mathbf{r}$，指向圆心。由牛顿第二定律，力的大小在每一时刻都是 $mA\\omega^2$。尽管方向变化，大小却不变；角速度加倍，力就变为四倍。",
  ),
  generate(rng) {
    const m = rng.int(1, 9);
    const A = rng.int(1, 9);
    const w = rng.int(2, 5);
    const answer = m * A * w * w;
    return numberProblem({
      prompt: t(
        `A particle of mass ${m} has position $\\mathbf{r}(t) = \\langle ${coefficientOf(A)}\\cos ${w}t, ${coefficientOf(A)}\\sin ${w}t \\rangle$. Find the magnitude of the force on it.`,
        `质量为 ${m} 的质点，位置是 $\\mathbf{r}(t) = \\langle ${coefficientOf(A)}\\cos ${w}t, ${coefficientOf(A)}\\sin ${w}t \\rangle$。求它受到的力的大小。`,
      ),
      answer,
      form: "integer",
      wrong: [m * A * w, A * w * w, m * w * w],
      solution: t(
        `The acceleration has magnitude $${A} \\cdot ${w}^2 = ${A * w * w}$. Multiplying by the mass ${m} gives $${answer}$.`,
        `加速度的大小是 $${A} \\cdot ${w}^2 = ${A * w * w}$。乘以质量 ${m}，得 $${answer}$。`,
      ),
    });
  },
};

const projectileSpeed: KnowledgePointDef = {
  id: "the-speed-of-a-projectile-at-a-given-time",
  title: t("The speed of a projectile at a given time", "抛体在给定时刻的速率"),
  explanation: t(
    "Integrating a constant acceleration $\\langle 0, -g \\rangle$ leaves the horizontal velocity alone and reduces the vertical velocity at a steady rate. So at time $T$ the velocity is $\\langle v_x, v_y - gT \\rangle$. The speed is the magnitude of this vector, and neither the initial speed nor the height is needed to calculate it.",
    "对常加速度 $\\langle 0, -g \\rangle$ 积分，水平速度不变，竖直速度匀速减小。所以在时刻 $T$，速度是 $\\langle v_x, v_y - gT \\rangle$。速率是这个向量的大小，计算时既不需要初速率，也不需要高度。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const sign = rng.pick([1, -1]);
    const g = rng.int(2, 10);
    const T = rng.int(1, 6);
    const vertical = sign * b;
    const start = vertical + g * T;
    return numberProblem({
      prompt: t(
        `A projectile has acceleration $\\langle 0, -${g} \\rangle$ and initial velocity $\\langle ${a}, ${start} \\rangle$. Find its speed at $t = ${T}$.`,
        `抛体的加速度是 $\\langle 0, -${g} \\rangle$，初速度是 $\\langle ${a}, ${start} \\rangle$。求它在 $t = ${T}$ 时的速率。`,
      ),
      answer: h,
      form: "integer",
      wrong: [a + b, g * T, a],
      solution: t(
        `The velocity at $t = ${T}$ is $\\langle ${a}, ${start} - ${g * T} \\rangle = \\langle ${a}, ${vertical} \\rangle$. Its magnitude is $\\sqrt{${a}^2 + ${inParens(vertical)}^2} = ${h}$.`,
        `$t = ${T}$ 时的速度是 $\\langle ${a}, ${start} - ${g * T} \\rangle = \\langle ${a}, ${vertical} \\rangle$。它的大小是 $\\sqrt{${a}^2 + ${inParens(vertical)}^2} = ${h}$。`,
      ),
    });
  },
};

/** deeperCalculusIIPoints gives, by topic id, the knowledge points added after a Calculus II topic's own. */
export const deeperCalculusIIPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "calculating-definite-integrals-using-substitution": [scaledKnownIntegral],
  "introduction-to-integration-by-parts": [partsFromValues],
  "expressing-rational-functions-as-sums-of-partial-fractions": [coverUp],
  "improper-integrals": [exponentFromImproper],
  "integrating-rates-of-change": [peakAmount],
  "the-average-value-of-a-function": [averageOverAdjacentIntervals],
  "the-area-between-curves-expressed-as-functions-of-x": [slopeFromEnclosedArea],
  "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes": [limitFromVolume],
  "the-shell-method-rotation-about-the-y-axis": [shellsAboutAnotherLine],
  "average-position-velocity-and-acceleration": [averageSpeed],
  "calculating-the-displacement-of-a-particle-using-integration": [returnTime],
  "differentiating-parametric-curves": [selfCrossing],
  "calculating-velocity-for-plane-motion-using-differentiation": [smallestSpeed],
  "finding-displacement-vectors-in-two-dimensions-using-integration": [rangeOfAProjectile],
  "limits-of-sequences": [limitOfLinearRecursion],
  "monotonic-sequences": [limitOfNestedRoot],
  "telescoping-series": [telescopingFromLaterIndex],
  "maclaurin-series": [productOfSeries],
  "recognizing-standard-maclaurin-series": [limitFromExponentialSeries],
  "recognizing-standard-maclaurin-series-for-trigonometric-functions": [limitFromSineSeries],
  "solving-first-order-ivps-using-separation-of-variables": [separableWithSquares],
  "further-modeling-with-first-order-odes": [coolingWithAHalfTime],
  "eulers-method-calculating-one-step": [stepSizeFromEuler],
  "integration-using-the-pythagorean-identities": [evenPowerOfSecant],
  "integrating-products-of-trigonometric-functions": [orthogonalSines],
  "integrating-algebraic-functions-using-substitution": [changedLimits],
  "integrating-exponential-functions-using-substitution": [limitWithLogarithm],
  "integrating-logarithmic-functions-using-substitution": [logLimits],
  "integrating-trigonometric-functions-using-substitution": [powerOverQuarterTurn],
  "integrating-hyperbolic-functions-using-substitution": [sinhCoshLimit],
  "integration-by-substitution-with-inverse-trigonometric-functions": [inverseTrigDefinite],
  "integration-using-the-double-angle-formulas": [doubleAngleTwice],
  "integration-by-parts-in-cyclic-cases": [cyclicImproper],
  "the-tabular-method-of-integration-by-parts": [tabularValue],
  "integrating-rational-functions-using-partial-fractions": [improperPartialFractions],
  "integrating-rational-functions-with-repeated-factors": [overCubedFactor],
  "improper-integrals-over-the-real-line": [evenOverRealLine],
  "improper-integrals-of-the-second-kind": [unboundedAtTop],
  "integrating-density-functions": [massShare],
  "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes": [pappusVolume],
  "calculating-the-total-distance-traveled-by-a-particle": [distanceGap],
  "calculating-velocity-using-integration": [stoppingTime],
  "the-arc-length-of-a-parametric-curve": [astroidLength],
  "calculating-areas-bounded-by-parametric-functions": [astroidArea],
  "finding-the-area-of-a-polar-region": [roseArea],
  "further-determining-limits-of-sequences-using-relative-magnitudes": [conjugateLimit],
  "convergent-and-divergent-infinite-series": [telescopingWithGap],
  "finding-the-sum-of-an-infinite-geometric-series": [bouncingBall],
  "taylor-series": [taylorBySubstitution],
  "representing-functions-as-power-series": [geometricSubstitution],
  "higher-degree-taylor-polynomials": [highDerivativeOfProduct],
  "radius-of-convergence-of-power-series-centered-at-the-origin": [evenPowersRadius],
  "applying-newtons-second-law-in-the-plane": [circularForce],
  "finding-velocity-vectors-in-two-dimensions-using-integration": [projectileSpeed],
};
