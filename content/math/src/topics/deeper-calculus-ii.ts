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
};
