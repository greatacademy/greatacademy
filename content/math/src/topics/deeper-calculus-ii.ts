// Further knowledge points for topics of Calculus II, each a skill the topic's own
// points leave out. See `deeperCalculusIIPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { numberProblem, steps } from "../problems.ts";

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
  figure: calculusDrawings4["the-shell-method-rotation-about-the-y-axis#shells-about-a-line-other-than-the-y-axis"],
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
    "The substitution $u = \\sinh x$ gives $\\int \\sinh x\\cosh x\\,dx = \\frac{1}{2}\\sinh^2 x$. To evaluate at a limit such as $\\ln a$, return to the exponential definition: $\\sinh(\\ln a) = \\frac{1}{2}\\left(a - \\frac{1}{a}\\right)$. The exponentials and logarithm then cancel, so the result is a rational number whenever $a$ is rational.",
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
  figure: calculusDrawings4["integration-using-the-double-angle-formulas#applying-a-double-angle-formula-twice"],
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
        `Write $\\int x^{${n}}e^x\\,dx = e^xP(x) + C$, where $P$ is a polynomial. Find $P(${m})$.`,
        `写成 $\\int x^{${n}}e^x\\,dx = e^xP(x) + C$，其中 $P$ 是多项式。求 $P(${m})$。`,
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
  figure:
    calculusDrawings4[
      "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes#the-volume-of-a-torus-from-the-theorem-of-pappus"
    ],
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
  figure: calculusDrawings5["calculating-the-total-distance-traveled-by-a-particle#the-gap-between-distance-and-displacement"],
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
  figure: calculusDrawings5["calculating-areas-bounded-by-parametric-functions#the-area-inside-an-astroid"],
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
        `Multiplying by the conjugate gives $\\frac{${poly([a, "n"], [b, ""])}}{\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} + n}$. The dominant terms give $${a % 2 === 0 ? `\\frac{${a}}{2} = ` : ""}${answer.toLatex()}$.`,
        `乘以共轭式得 $\\frac{${poly([a, "n"], [b, ""])}}{\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} + n}$。主导项给出 $${a % 2 === 0 ? `\\frac{${a}}{2} = ` : ""}${answer.toLatex()}$。`,
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
        `Split the term: $\\frac{${k}}{n(n + ${a})} = ${Q.of(k, a).toLatex()}\\left(\\frac{1}{n} - \\frac{1}{n + ${a}}\\right)$. Each negative term cancels a positive term ${a} places later, so only the first ${a} positive terms stay:${steps(`${Q.of(k, a).toLatex()}\\left(${reciprocals.map((r) => r.toLatex()).join(" + ")}\\right) = ${answer.toLatex()}`)}`,
        `把通项拆开：$\\frac{${k}}{n(n + ${a})} = ${Q.of(k, a).toLatex()}\\left(\\frac{1}{n} - \\frac{1}{n + ${a}}\\right)$。每个负项与 ${a} 个位置之后的正项抵消，只留下前 ${a} 个正项：${steps(`${Q.of(k, a).toLatex()}\\left(${reciprocals.map((r) => r.toLatex()).join(" + ")}\\right) = ${answer.toLatex()}`)}`,
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

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** signedCoefficient writes a nonzero number before a symbol, leaving out 1 and keeping the sign of -1. */
const signedCoefficient = (n: number) => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

const upperLimitFromLogarithm: KnowledgePointDef = {
  id: "the-upper-limit-from-a-logarithmic-value",
  title: t("The upper limit from a logarithmic value", "由对数值求积分上限"),
  explanation: t(
    "The integral of a linear function's derivative over that function is a difference of logarithms, which is the logarithm of a ratio. So when the value is $\\ln m$, the linear function must grow by the factor $m$ between the two limits. That turns the question about an integral into a linear equation for the unknown limit.",
    "线性函数的导数除以该函数，积分是对数之差，也就是比值的对数。所以积分值为 $\\ln m$ 时，线性函数从下限到上限必须增大到 $m$ 倍。这样，积分问题就变成了关于未知积分限的一次方程。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const c = rng.int(2, 9);
    const m = rng.int(2, 6);
    const answer = Q.of(c * (m - 1), a);
    const denominator = poly([a, "x"], [c, ""]);
    return numberProblem({
      prompt: t(
        `For which $b > 0$ is $\\int_0^b \\frac{${a}}{${denominator}}\\,dx = \\ln ${m}$?`,
        `$b > 0$ 取何值时 $\\int_0^b \\frac{${a}}{${denominator}}\\,dx = \\ln ${m}$？`,
      ),
      answer,
      solveFor: "b",
      wrong: [Q.of(c * (m - 1)), Q.of(c * m, a), Q.of(m - 1, a), Q.of(c * (m + 1), a)],
      solution: t(
        `With $u = ${denominator}$ and $du = ${a}\\,dx$, the integral is $\\ln\\frac{${a}b + ${c}}{${c}}$. This equals $\\ln ${m}$ exactly when $${a}b + ${c} = ${c * m}$, so $b = ${answer.toLatex()}$.`,
        `令 $u = ${denominator}$，$du = ${a}\\,dx$，积分等于 $\\ln\\frac{${a}b + ${c}}{${c}}$。它等于 $\\ln ${m}$ 当且仅当 $${a}b + ${c} = ${c * m}$，所以 $b = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const xTimesFOfXSquared: KnowledgePointDef = {
  id: "an-integral-of-x-times-f-of-x-squared",
  title: t("An integral of x times f of x squared", "x 乘以 x 平方的函数的积分"),
  explanation: t(
    "Substitution needs no formula for the outer function, only that the derivative of the inner one is present. In $\\int xf(x^2)\\,dx$, the choice $u = x^2$ gives $du = 2x\\,dx$, so the factor $x\\,dx$ becomes $\\frac{du}{2}$. The limits are squared as well, and a known integral of $f$ then finishes the work, even though $f$ itself stays unknown.",
    "换元不需要外层函数的公式，只要内层函数的导数出现在被积式中。在 $\\int xf(x^2)\\,dx$ 中，取 $u = x^2$，则 $du = 2x\\,dx$，所以 $x\\,dx$ 变成 $\\frac{du}{2}$。积分限也要平方，再用已知的 $f$ 的积分就能得到结果，即使 $f$ 本身仍然未知。",
  ),
  generate(rng) {
    const b = rng.int(2, 7);
    const k = rng.int(1, 6);
    const v = nonzero(rng, 12);
    const answer = Q.of(k * v, 2);
    const half = k === 2 ? "" : `${Q.of(k, 2).toLatex()} \\cdot `;
    return numberProblem({
      prompt: t(
        `$\\int_0^{${b * b}} f(u)\\,du = ${v}$. Find $\\int_0^{${b}} ${coefficientOf(k)}xf(x^2)\\,dx$.`,
        `$\\int_0^{${b * b}} f(u)\\,du = ${v}$。求 $\\int_0^{${b}} ${coefficientOf(k)}xf(x^2)\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * v), Q.of(2 * k * v), Q.of(k * v, b), Q.of(k * v, b * b)],
      solution: t(
        `Let $u = x^2$, so $x\\,dx = \\frac{du}{2}$, and the limits become $0$ and $${b * b}$. The integral is $${half}${inParens(v)} = ${answer.toLatex()}$.`,
        `令 $u = x^2$，则 $x\\,dx = \\frac{du}{2}$，积分限变成 $0$ 和 $${b * b}$。积分等于 $${half}${inParens(v)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const xSquaredInTermsOfU: KnowledgePointDef = {
  id: "rewriting-x-squared-in-terms-of-u",
  title: t("Rewriting x squared in terms of u", "把 x 的平方写成 u 的式子"),
  explanation: t(
    "When $u = x - a$, a factor of $x^2$ outside the power must also be converted. Since $x = u + a$, the square expands into three terms, each a power of $u$ with its own coefficient. Multiplying them by the power of $u$ leaves a polynomial that can be integrated term by term, with the limits changed to values of $u$.",
    "令 $u = x - a$ 时，幂外面的因子 $x^2$ 也必须转换。因为 $x = u + a$，平方展开成三项，每项都是 $u$ 的幂，各有系数。再乘以 $u$ 的幂，就得到可以逐项积分的多项式，积分限也要换成 $u$ 的值。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const n = rng.int(2, 5);
    const inner = poly([1, "x"], [-a, ""]);
    const one = Q.of(1, n + 3);
    const two = Q.of(2 * a, n + 2);
    const three = Q.of(a * a, n + 1);
    const answer = one.add(two).add(three);
    const expanded = poly([1, `u^${n + 2}`], [2 * a, `u^${n + 1}`], [a * a, `u^${n}`]);
    const square = poly([1, "u^2"], [2 * a, "u"], [a * a, ""]);
    const sum = poly([one, ""], [two, ""], [three, ""]);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{${a}}^{${a + 1}} x^2(${inner})^{${n}}\\,dx$.`,
        `计算 $\\int_{${a}}^{${a + 1}} x^2(${inner})^{${n}}\\,dx$。`,
      ),
      answer,
      wrong: [one.add(three), one.add(Q.of(a, n + 2)).add(three), Q.of((a + 1) * (a + 1), n + 1), one],
      solution: t(
        `Let $u = ${inner}$, so $x = ${poly([1, "u"], [a, ""])}$ and the limits become $0$ and $1$. Then $x^2 = ${square}$, so the integrand is $${expanded}$. Integrating term by term and setting $u = 1$ gives $${sum} = ${answer.toLatex()}$.`,
        `令 $u = ${inner}$，则 $x = ${poly([1, "u"], [a, ""])}$，积分限变成 $0$ 和 $1$。于是 $x^2 = ${square}$，被积函数是 $${expanded}$。逐项积分并令 $u = 1$，得 $${sum} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const arsinhAsLogarithm: KnowledgePointDef = {
  id: "an-inverse-hyperbolic-integral-as-a-logarithm",
  title: t("An inverse hyperbolic integral as a logarithm", "把反双曲积分写成对数"),
  explanation: t(
    "An inverse hyperbolic function is a logarithm in disguise, which is how a definite integral producing one gets a closed value. From $\\operatorname{arsinh} z = \\ln\\left(z + \\sqrt{z^2 + 1}\\right)$, the value of the antiderivative at a limit becomes a single logarithm. It is cleanest when the root is rational, as it is for the sides of a right triangle with whole sides.",
    "反双曲函数其实就是对数，所以结果含反双曲函数的定积分可以化成确定的值。由 $\\operatorname{arsinh} z = \\ln\\left(z + \\sqrt{z^2 + 1}\\right)$，原函数在积分限处的值就是一个对数。当根式是有理数时最简洁，比如边长都是整数的直角三角形的情形。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const s = rng.int(1, 3);
    const A = s * a;
    const B = s * b;
    const H = s * h;
    const answer = Q.of(B + H, A);
    const z = Q.of(B, A).toLatex();
    const root = Q.of(H, A).toLatex();
    return numberProblem({
      prompt: t(
        `$\\int_0^{${B}} \\frac{dx}{\\sqrt{x^2 + ${A * A}}} = \\ln c$. Find $c$.`,
        `$\\int_0^{${B}} \\frac{dx}{\\sqrt{x^2 + ${A * A}}} = \\ln c$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(B + H), Q.of(H, A), Q.of(B, A), Q.of(A + H, B)],
      solution: t(
        `An antiderivative is $\\operatorname{arsinh}\\frac{x}{${A}}$, which is $0$ at $x = 0$. At the upper limit $z = ${z}$ and $\\sqrt{z^2 + 1} = ${root}$, so the value is $\\ln\\left(${z} + ${root}\\right)$ and $c = ${answer.toLatex()}$.`,
        `一个原函数是 $\\operatorname{arsinh}\\frac{x}{${A}}$，它在 $x = 0$ 处为 $0$。在上限处 $z = ${z}$，$\\sqrt{z^2 + 1} = ${root}$，所以积分值是 $\\ln\\left(${z} + ${root}\\right)$，$c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const constantRemovingLogarithm: KnowledgePointDef = {
  id: "the-constant-that-removes-the-logarithm",
  title: t("The constant that removes the logarithm", "消去对数项的常数"),
  explanation: t(
    "Dividing a quadratic by $x - a$ leaves a polynomial quotient and a constant remainder $R$. The quotient integrates to a polynomial, and only the fraction $\\frac{R}{x - a}$ produces a logarithm. So an antiderivative free of logarithms means the remainder is zero, and the remainder theorem gives it as the value of the numerator at $x = a$.",
    "二次式除以 $x - a$，得到多项式商和常数余数 $R$。商积分后仍是多项式，只有分式 $\\frac{R}{x - a}$ 才产生对数。所以原函数不含对数就意味着余数为零，而由余数定理，余数就是分子在 $x = a$ 处的值。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => v !== -a));
    const answer = -a * (a + b);
    const denominator = poly([1, "x"], [-a, ""]);
    const numerator = poly([1, "x^2"], [b, "x"]);
    return numberProblem({
      prompt: t(
        `The antiderivative of $\\frac{${numerator} + k}{${denominator}}$ contains no logarithm. Find $k$.`,
        `$\\frac{${numerator} + k}{${denominator}}$ 的原函数不含对数。求 $k$。`,
      ),
      answer,
      form: "integer",
      wrong: [a * (a + b), a * a - a * b, a * b, -(a * a) - b],
      solution: t(
        `Dividing by $${denominator}$ gives the quotient $${poly([1, "x"], [a + b, ""])}$ and the remainder $${a * a} + ${inParens(a * b)} + k$. The logarithm comes only from the remainder, so it must vanish, which gives $k = ${answer}$.`,
        `除以 $${denominator}$，商是 $${poly([1, "x"], [a + b, ""])}$，余数是 $${a * a} + ${inParens(a * b)} + k$。对数只来自余数，所以余数必须为零，得 $k = ${answer}$。`,
      ),
    });
  },
};

const linearOverCompletedSquare: KnowledgePointDef = {
  id: "a-linear-numerator-over-a-completed-square",
  title: t("A linear numerator over a completed square", "配方后分子为一次式的积分"),
  explanation: t(
    "When the numerator contains $x$, split it before completing the square. One part is a multiple of the derivative of the denominator, and it integrates to a logarithm. What remains is a constant over the completed square, and it integrates to an arctangent. The coefficient of the arctangent depends on the constant left over after the split, not on the original constant.",
    "分子含 $x$ 时，先把它拆开，再配方。一部分是分母导数的倍数，积分得到对数。剩下的是常数除以配方后的式子，积分得到反正切。反正切的系数取决于拆分后剩下的常数，而不是原来的常数项。",
  ),
  generate(rng) {
    const m = rng.int(1, 4);
    const p = nonzero(rng, 4);
    const a = rng.int(1, 4);
    const n = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7].filter((v) => v + m * p !== 0));
    const rest = n + m * p;
    const answer = Q.of(rest, a);
    const numerator = poly([m, "x"], [n, ""]);
    const denominator = poly([1, "x^2"], [-2 * p, "x"], [p * p + a * a, ""]);
    const inner = poly([1, "x"], [-p, ""]);
    const arc = a === 1 ? `\\arctan(${inner})` : `\\arctan\\frac{${inner}}{${a}}`;
    const half = fractionBefore(m, 2);
    const form = `${half}\\ln(${denominator}) + K${arc} + C`;
    const split = `${half}(${poly([2, "x"], [-2 * p, ""])}) ${rest < 0 ? "-" : "+"} ${Math.abs(rest)}`;
    return numberProblem({
      prompt: t(
        `An antiderivative of $\\frac{${numerator}}{${denominator}}$ has the form $${form}$. Find $K$.`,
        `$\\frac{${numerator}}{${denominator}}$ 的原函数形如 $${form}$。求 $K$。`,
      ),
      answer,
      wrong: [Q.of(n, a), Q.of(n - m * p, a), Q.of(rest), Q.of(rest, 2 * a), answer.neg()],
      solution: t(
        `The numerator is $${split}$, where the bracket is the derivative of the denominator and gives the logarithm. The denominator is $(${inner})^2 + ${a * a}$, so the constant $${rest}$ gives an arctangent with coefficient $K = ${answer.toLatex()}$.`,
        `分子等于 $${split}$，括号是分母的导数，积分得到对数。分母等于 $(${inner})^2 + ${a * a}$，所以常数 $${rest}$ 积分后得到反正切，系数 $K = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const powerOfCoshAndSinh: KnowledgePointDef = {
  id: "powers-of-cosh-plus-or-minus-sinh",
  title: t("Powers of cosh plus or minus sinh", "cosh 加减 sinh 的幂"),
  explanation: t(
    "Adding and subtracting the definitions of the hyperbolic functions gives two short identities: $\\cosh x + \\sinh x = e^x$ and $\\cosh x - \\sinh x = e^{-x}$. A power of either is therefore a single exponential, with no need to expand the bracket. A logarithm in the limit then cancels the exponential when the result is evaluated.",
    "把双曲函数的定义相加、相减，得到两个简单的恒等式：$\\cosh x + \\sinh x = e^x$，$\\cosh x - \\sinh x = e^{-x}$。所以它们的幂都只是一个指数函数，不必展开括号。求值时，积分限中的对数会与指数相互抵消。",
  ),
  generate(rng) {
    const plus = rng.pick([true, false]);
    const n = rng.int(1, 3);
    const a = rng.int(2, 5);
    const k = rng.int(1, 6);
    const power = a ** n;
    const bracket = `(\\cosh x ${plus ? "+" : "-"} \\sinh x)${n === 1 ? "" : `^{${n}}`}`;
    const up = Q.of(k * (power - 1), n);
    const down = Q.of(k * (power - 1), n * power);
    const answer = plus ? up : down;
    const exponent = `${plus ? "" : "-"}${coefficientOf(n)}x`;
    const work = plus ? `${fractionBefore(k, n)}(${power} - 1)` : `${fractionBefore(k, n)}\\left(1 - ${Q.of(1, power).toLatex()}\\right)`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{\\ln ${a}} ${coefficientOf(k)}${bracket}\\,dx$.`,
        `计算 $\\int_0^{\\ln ${a}} ${coefficientOf(k)}${bracket}\\,dx$。`,
      ),
      answer,
      wrong: plus
        ? [Q.of(k * (power - 1)), Q.of(k * power, n), down, Q.of(k * (power + 1), n)]
        : [Q.of(k * (power - 1), power), Q.of(k, n * power), up, Q.of(k * (power + 1), n * power), down.neg()],
      solution: t(
        `The bracket equals $e^{${plus ? "" : "-"}x}$, so the integrand is $${coefficientOf(k)}e^{${exponent}}$. Evaluating its antiderivative at $x = \\ln ${a}$ and $x = 0$ gives $${work} = ${answer.toLatex()}$.`,
        `括号内等于 $e^{${plus ? "" : "-"}x}$，所以被积函数是 $${coefficientOf(k)}e^{${exponent}}$。原函数在 $x = \\ln ${a}$ 与 $x = 0$ 处求值，得 $${work} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const evenPowerOfSech: KnowledgePointDef = {
  id: "an-even-power-of-sech",
  title: t("An even power of sech", "sech 的偶次幂"),
  explanation: t(
    "The derivative of $\\tanh x$ is $\\operatorname{sech}^2 x$, so one factor of $\\operatorname{sech}^2 x$ can be saved for the differential. The rest is converted by the identity $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$. Note the minus sign, which differs from the identity for ordinary secant. With $u = \\tanh x$, the integrand is then a polynomial in $u$.",
    "$\\tanh x$ 的导数是 $\\operatorname{sech}^2 x$，所以可以留出一个 $\\operatorname{sech}^2 x$ 作微分。其余部分用恒等式 $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$ 转换。注意这里是减号，与普通正割的恒等式不同。令 $u = \\tanh x$，被积函数就成为 $u$ 的多项式。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [3, 5],
      [4, 5],
    ]) as [number, number];
    const k = rng.int(1, 6);
    const T = Q.of(p, q);
    const times = Q.of(k);
    const cubeThird = T.pow(3).div(Q.of(3));
    const answer = T.sub(cubeThird).mul(times);
    return numberProblem({
      prompt: t(
        `$\\tanh b = ${T.toLatex()}$ with $b > 0$. Evaluate $\\int_0^b ${coefficientOf(k)}\\operatorname{sech}^4 x\\,dx$.`,
        `$\\tanh b = ${T.toLatex()}$，$b > 0$。计算 $\\int_0^b ${coefficientOf(k)}\\operatorname{sech}^4 x\\,dx$。`,
      ),
      answer,
      wrong: [T.mul(times), T.add(cubeThird).mul(times), cubeThird.mul(times), T.sub(T.pow(3)).mul(times)],
      solution: t(
        `Write $\\operatorname{sech}^4 x = (1 - \\tanh^2 x)\\operatorname{sech}^2 x$ and let $u = \\tanh x$, so $u$ runs from $0$ to $${T.toLatex()}$. The integral is $${coefficientOf(k)}\\left[u - \\frac{u^3}{3}\\right]_0^{${T.toLatex()}} = ${answer.toLatex()}$.`,
        `写成 $\\operatorname{sech}^4 x = (1 - \\tanh^2 x)\\operatorname{sech}^2 x$，令 $u = \\tanh x$，则 $u$ 从 $0$ 变到 $${T.toLatex()}$。积分等于 $${coefficientOf(k)}\\left[u - \\frac{u^3}{3}\\right]_0^{${T.toLatex()}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const fourthPowerOfHyperbolic: KnowledgePointDef = {
  id: "a-fourth-power-of-sinh-or-cosh",
  title: t("A fourth power of sinh or cosh", "sinh 或 cosh 的四次幂"),
  explanation: t(
    "One double angle formula turns a fourth power into the square of a sum, and that square contains $\\cosh^2 2x$, which needs the formula a second time. Only then is every term a constant or a single hyperbolic cosine, ready to integrate. The sign of the middle term depends on whether the starting function was $\\sinh$ or $\\cosh$.",
    "用一次二倍角公式，四次幂变成一个和的平方，而这个平方中含有 $\\cosh^2 2x$，需要再用一次公式。这样每一项才都是常数或单个双曲余弦，可以积分。中间一项的符号取决于开始时是 $\\sinh$ 还是 $\\cosh$。",
  ),
  generate(rng) {
    const cosh = rng.pick([true, false]);
    const k = nonzero(rng, 8);
    const letter = rng.pick(["A", "B", "D"]);
    const sign = cosh ? 1 : -1;
    const fn = cosh ? "\\cosh" : "\\sinh";
    const answer = letter === "A" ? Q.of(3 * k, 8) : letter === "B" ? Q.of(sign * k, 4) : Q.of(k, 32);
    const wrong =
      letter === "A"
        ? [Q.of(k, 4), Q.of(3 * k, 4), Q.of(k, 8), Q.of(k, 2)]
        : letter === "B"
          ? [Q.of(-sign * k, 4), Q.of(sign * k, 2), Q.of(sign * k, 8), Q.of(k, 32)]
          : [Q.of(k, 8), Q.of(k, 16), Q.of(k, 4), Q.of(3 * k, 8)];
    const lowered = poly([Q.of(3, 8), ""], [Q.of(sign, 2), "\\cosh 2x"], [Q.of(1, 8), "\\cosh 4x"]);
    const integrated = poly([Q.of(3, 8), "x"], [Q.of(sign, 4), "\\sinh 2x"], [Q.of(1, 32), "\\sinh 4x"]);
    const scaled = k === 1 ? "So " : `Multiplying by $${k}$ gives `;
    const scaledZh = k === 1 ? "所以 " : `乘以 $${k}$，得 `;
    return numberProblem({
      prompt: t(
        `$\\int ${signedCoefficient(k)}${fn}^4 x\\,dx = Ax + B\\sinh 2x + D\\sinh 4x + C$. Find $${letter}$.`,
        `$\\int ${signedCoefficient(k)}${fn}^4 x\\,dx = Ax + B\\sinh 2x + D\\sinh 4x + C$。求 $${letter}$。`,
      ),
      answer,
      wrong,
      solution: t(
        `Applying the double angle formula twice gives $${fn}^4 x = ${lowered}$, whose antiderivative is $${integrated}$. ${scaled}$${letter} = ${answer.toLatex()}$.`,
        `用两次二倍角公式，得 $${fn}^4 x = ${lowered}$，其原函数是 $${integrated}$。${scaledZh}$${letter} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const convenientConstantInV: KnowledgePointDef = {
  id: "a-convenient-constant-in-v",
  title: t("A convenient constant in v", "选取 v 中方便的常数"),
  explanation: t(
    "In integration by parts, $v$ can be any antiderivative of $dv$, so a constant may be added to it freely. For $\\int \\ln(ax + b)\\,dx$, the plain choice $v = x$ leaves a quotient that needs division. Choosing the constant so that $v$ is a multiple of $ax + b$ cancels the denominator of $du$, and the remaining integral is immediate.",
    "分部积分时，$v$ 可以是 $dv$ 的任何一个原函数，所以可以随意加一个常数。对 $\\int \\ln(ax + b)\\,dx$，直接取 $v = x$ 会留下需要做除法的分式。选取常数使 $v$ 成为 $ax + b$ 的倍数，就能约去 $du$ 的分母，剩下的积分立刻可得。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(1, 9);
    const answer = Q.of(b, a);
    const inner = poly([a, "x"], [b, ""]);
    return numberProblem({
      prompt: t(
        `$\\int \\ln(${inner})\\,dx = (x + p)\\ln(${inner}) - x + C$. Find $p$.`,
        `$\\int \\ln(${inner})\\,dx = (x + p)\\ln(${inner}) - x + C$。求 $p$。`,
      ),
      answer,
      wrong: [Q.of(b), Q.of(a, b), answer.neg(), Q.of(b, 2 * a)],
      solution: t(
        `Take $u = \\ln(${inner})$, so $du = \\frac{${a}}{${inner}}\\,dx$, and $v = x + p$. Then $v\\,du$ is simply $dx$ exactly when $x + p = \\frac{${inner}}{${a}}$, which leaves $-x$ as the second term and gives $p = ${answer.toLatex()}$.`,
        `取 $u = \\ln(${inner})$，则 $du = \\frac{${a}}{${inner}}\\,dx$，再取 $v = x + p$。当 $x + p = \\frac{${inner}}{${a}}$ 时，$v\\,du$ 正好是 $dx$，于是第二项是 $-x$，得 $p = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const reductionForPowerTimesExponential: KnowledgePointDef = {
  id: "a-reduction-formula-for-a-power-times-an-exponential",
  title: t("A reduction formula for a power times an exponential", "幂乘指数函数的递推公式"),
  explanation: t(
    "Repeating integration by parts on a high power is long, but one step can be done in general. Let $I_n = \\int_0^1 x^ne^x\\,dx$. Parts with $u = x^n$ gives a relation between $I_n$ and $I_{n-1}$, which lowers the power by one each time. Starting from $I_0$, the value climbs step by step to any power needed.",
    "对高次幂反复分部积分很长，但可以一般地做一步。设 $I_n = \\int_0^1 x^ne^x\\,dx$。取 $u = x^n$ 分部积分，得到 $I_n$ 与 $I_{n-1}$ 的关系，每次把幂降低一次。从 $I_0$ 出发，一步一步就能算到需要的幂。",
  ),
  generate(rng) {
    const n = rng.int(3, 6);
    const k = rng.int(1, 5);
    const askA = rng.pick([true, false]);
    let A = 1;
    let B = -1;
    let previousA = 1;
    let previousB = -1;
    const chain: string[] = [];
    for (let i = 1; i <= n; i++) {
      previousA = A;
      previousB = B;
      A = 1 - i * previousA;
      B = -i * previousB;
      chain.push(`I_${i} = ${poly([A, "e"], [B, ""])}`);
    }
    const value = askA ? k * A : k * B;
    const letter = askA ? "A" : "B";
    const last = k === 1 ? "" : `, and multiplying by $${k}$ gives $${letter} = ${value}$`;
    const lastZh = k === 1 ? "" : `，乘以 $${k}$ 得 $${letter} = ${value}$`;
    return numberProblem({
      prompt: t(
        `$\\int_0^1 ${coefficientOf(k)}x^{${n}}e^x\\,dx = Ae + B$ for integers $A$ and $B$. Find $${letter}$.`,
        `$\\int_0^1 ${coefficientOf(k)}x^{${n}}e^x\\,dx = Ae + B$，其中 $A$、$B$ 是整数。求 $${letter}$。`,
      ),
      answer: value,
      form: "integer",
      wrong: askA ? [-k * A, k * B, k * previousA] : [-k * B, k * A, k * previousB, (k * B) / n],
      solution: t(
        `Parts with $u = x^n$ and $dv = e^x\\,dx$ gives $I_n = e - nI_{n-1}$, where $I_0 = e - 1$. So $${chain.join(", \\; ")}$${last}.`,
        `取 $u = x^n$，$dv = e^x\\,dx$ 分部积分，得 $I_n = e - nI_{n-1}$，其中 $I_0 = e - 1$。所以 $${chain.join(", \\; ")}$${lastZh}。`,
      ),
    });
  },
};

const twoRepeatedFactors: KnowledgePointDef = {
  id: "two-repeated-factors-by-differentiating",
  title: t("Two repeated factors by differentiating", "用求导处理两个重因式"),
  explanation: t(
    "Substituting a root only gives the coefficient over the highest power of a factor. For the coefficient over the first power, multiply both sides by the squared factor, so that $B$ stands alone and $A$ is multiplied by the factor once. Differentiating then removes $B$, and setting $x$ to the root removes every other term, leaving $A$ by itself.",
    "代入根只能得到因式最高次幂上的系数。要求一次幂上的系数，先两边同乘这个因式的平方，这时 $B$ 单独成项，而 $A$ 乘着因式的一次幂。求导消去 $B$，再把 $x$ 取为根，其余各项都变成零，只剩下 $A$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => v !== a));
    const p = nonzero(rng, 5);
    let q = nonzero(rng, 9);
    const d = b - a;
    while (q - p * a === 0 || p * d === 2 * (q - p * a)) q += 1;
    const atRoot = q - p * a;
    const first = Q.of(p, d * d);
    const second = Q.of(2 * atRoot, d * d * d);
    const answer = first.sub(second);
    const f1 = poly([1, "x"], [a, ""]);
    const f2 = poly([1, "x"], [b, ""]);
    const numerator = poly([p, "x"], [q, ""]);
    const form = `\\frac{A}{${f1}} + \\frac{B}{(${f1})^2} + \\frac{C}{${f2}} + \\frac{D}{(${f2})^2}`;
    return numberProblem({
      prompt: t(
        `Write $\\frac{${numerator}}{(${f1})^2(${f2})^2}$ in the form $${form}$. Find $A$.`,
        `把 $\\frac{${numerator}}{(${f1})^2(${f2})^2}$ 写成 $${form}$ 的形式，求 $A$。`,
      ),
      answer,
      wrong: [first, first.add(second), Q.of(atRoot, d * d), answer.neg(), second],
      solution: t(
        `Multiplying by $(${f1})^2$ gives $\\frac{${numerator}}{(${f2})^2} = A(${f1}) + B + (${f1})^2(\\cdots)$. Differentiating and setting $x = ${-a}$ leaves $A$ on the right. On the left, $${f2}$ equals $${d}$ and the numerator equals $${atRoot}$ there, so $A = \\frac{${p}}{${inParens(d)}^2} - \\frac{2 \\cdot ${inParens(atRoot)}}{${inParens(d)}^3} = ${answer.toLatex()}$.`,
        `两边同乘 $(${f1})^2$，得 $\\frac{${numerator}}{(${f2})^2} = A(${f1}) + B + (${f1})^2(\\cdots)$。求导并令 $x = ${-a}$，右边只剩 $A$。在左边，此时 $${f2}$ 等于 $${d}$，分子等于 $${atRoot}$，所以 $A = \\frac{${p}}{${inParens(d)}^2} - \\frac{2 \\cdot ${inParens(atRoot)}}{${inParens(d)}^3} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const xSquaredAsOneVariable: KnowledgePointDef = {
  id: "two-quadratic-factors-with-x-squared-as-one-variable",
  title: t("Two quadratic factors with x squared as one variable", "把 x 的平方看作一个变量的两个二次因式"),
  explanation: t(
    "When a fraction contains $x$ only through $x^2$, the general numerators $Bx + C$ are more than it needs, since the linear terms must all vanish. Treat $y = x^2$ as a single variable. The fraction becomes one with two distinct linear factors in $y$, and substituting the root of a factor gives its coefficient at once, without a system of equations.",
    "分式只通过 $x^2$ 含有 $x$ 时，不需要一般的分子 $Bx + C$，因为一次项全都为零。把 $y = x^2$ 看作一个变量，分式就变成含 $y$ 的两个不同一次因式，代入因式的根就能立刻得到系数，不用解方程组。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = different(rng, 1, 9, a);
    const p = nonzero(rng, 6);
    let q = nonzero(rng, 12);
    while (q - p * a === 0 || q - p * b === 0) q += 1;
    const answer = Q.of(q - p * a, b - a);
    const numerator = poly([p, "x^2"], [q, ""]);
    const form = `\\frac{C}{x^2 + ${a}} + \\frac{D}{x^2 + ${b}}`;
    return numberProblem({
      prompt: t(
        `Write $\\frac{${numerator}}{(x^2 + ${a})(x^2 + ${b})}$ in the form $${form}$. Find $C$.`,
        `把 $\\frac{${numerator}}{(x^2 + ${a})(x^2 + ${b})}$ 写成 $${form}$ 的形式，求 $C$。`,
      ),
      answer,
      wrong: [Q.of(q + p * a, b - a), answer.neg(), Q.of(q - p * b, a - b), Q.of(q, b - a)],
      solution: t(
        `With $y = x^2$, the fraction is $\\frac{${poly([p, "y"], [q, ""])}}{(y + ${a})(y + ${b})}$. Covering $y + ${a}$ and setting $y = ${-a}$ makes the numerator $${q - p * a}$ and the other factor $${b - a}$, so $C = ${answer.toLatex()}$.`,
        `令 $y = x^2$，分式变成 $\\frac{${poly([p, "y"], [q, ""])}}{(y + ${a})(y + ${b})}$。盖住 $y + ${a}$，令 $y = ${-a}$，分子变成 $${q - p * a}$，另一个因式变成 $${b - a}$，所以 $C = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const twoQuadraticsOverHalfLine: KnowledgePointDef = {
  id: "two-quadratic-factors-over-an-infinite-interval",
  figure:
    calculusDrawings4["integrating-rational-functions-with-irreducible-quadratic-factors#two-quadratic-factors-over-an-infinite-interval"],
  title: t("Two quadratic factors over an infinite interval", "无穷区间上的两个二次因式"),
  explanation: t(
    "A product of two quadratics splits into a difference of two simple fractions, each with a known arctangent antiderivative. Over an infinite interval, each arctangent reaches a right angle at the far end, so each fraction contributes a multiple of $\\pi$ that depends only on the constant in its quadratic. The fraction in front then scales the difference.",
    "两个二次式的乘积可以拆成两个简单分式之差，每个分式的原函数都是已知的反正切。在无穷区间上，每个反正切在远端都趋于直角，所以每个分式贡献 $\\pi$ 的一个倍数，这个倍数只取决于它的二次式中的常数。再用前面的分数缩放这个差。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = rng.int(a + 1, 6);
    const n = rng.int(1, 12);
    const answer = Q.of(n, 2 * a * b * (a + b));
    const front = fractionBefore(n, b * b - a * a);
    return numberProblem({
      prompt: t(
        `$\\int_0^\\infty \\frac{${n}}{(x^2 + ${a * a})(x^2 + ${b * b})}\\,dx = c\\pi$. Find $c$.`,
        `$\\int_0^\\infty \\frac{${n}}{(x^2 + ${a * a})(x^2 + ${b * b})}\\,dx = c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(n, a * b * (a + b)), Q.of(n, 2 * (b * b - a * a)), Q.of(n, 2 * a * b * (b - a)), Q.of(n, 2 * a * b), Q.of(n, a + b)],
      solution: t(
        `The fraction equals $${front}\\left(\\frac{1}{x^2 + ${a * a}} - \\frac{1}{x^2 + ${b * b}}\\right)$. Since $\\int_0^\\infty \\frac{dx}{x^2 + s^2} = \\frac{\\pi}{2s}$, the integral is $${front}\\left(\\frac{\\pi}{${2 * a}} - \\frac{\\pi}{${2 * b}}\\right)$, so $c = ${answer.toLatex()}$.`,
        `分式等于 $${front}\\left(\\frac{1}{x^2 + ${a * a}} - \\frac{1}{x^2 + ${b * b}}\\right)$。因为 $\\int_0^\\infty \\frac{dx}{x^2 + s^2} = \\frac{\\pi}{2s}$，积分等于 $${front}\\left(\\frac{\\pi}{${2 * a}} - \\frac{\\pi}{${2 * b}}\\right)$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const exponentialFractionImproper: KnowledgePointDef = {
  id: "an-improper-integral-of-an-exponential-fraction",
  title: t("An improper integral of an exponential fraction", "指数分式的反常积分"),
  explanation: t(
    "An integrand need not look like a decaying exponential to converge. Here the numerator is the derivative of the expression inside the square, up to a constant, so the substitution $u = e^{mx} + c$ reduces the integral to a power of $u$. The upper limit moves to infinity with $x$, while the lower limit is the value of $u$ at the start.",
    "被积函数不一定要像衰减的指数函数才收敛。这里分子只差一个常数就是平方内式子的导数，所以换元 $u = e^{mx} + c$ 把积分化成 $u$ 的幂。上限随 $x$ 趋于无穷，下限是 $u$ 在起点的值。",
  ),
  generate(rng) {
    const m = rng.int(1, 4);
    const c = rng.int(1, 9);
    const k = rng.int(1, 9);
    const answer = Q.of(k, m * (1 + c));
    const power = `e^{${coefficientOf(m)}x}`;
    const lead = fractionBefore(k, m);
    const value = `${lead === "" ? "" : `${lead} \\cdot `}\\frac{1}{${1 + c}}`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^\\infty \\frac{${coefficientOf(k)}${power}}{(${power} + ${c})^2}\\,dx$.`,
        `计算 $\\int_0^\\infty \\frac{${coefficientOf(k)}${power}}{(${power} + ${c})^2}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k, 1 + c), Q.of(k, m * c), Q.of(k, m * (1 + c) * (1 + c)), Q.of(k * m, 1 + c), Q.of(k * (1 + c), m)],
      solution: t(
        `Let $u = ${power} + ${c}$, so $du = ${coefficientOf(m)}${power}\\,dx$; $u$ runs from $${1 + c}$ to $\\infty$. The integral is $${lead}\\int_{${1 + c}}^\\infty u^{-2}\\,du = ${value} = ${answer.toLatex()}$, because $u^{-1} \\to 0$.`,
        `令 $u = ${power} + ${c}$，则 $du = ${coefficientOf(m)}${power}\\,dx$，$u$ 从 $${1 + c}$ 变到 $\\infty$。因为 $u^{-1} \\to 0$，积分等于 $${lead}\\int_{${1 + c}}^\\infty u^{-2}\\,du = ${value} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const realLineCompletedSquare: KnowledgePointDef = {
  id: "the-real-line-after-completing-the-square",
  figure: calculusDrawings4["improper-integrals-involving-arctangent#the-real-line-after-completing-the-square"],
  title: t("The real line after completing the square", "配方后在整条实轴上积分"),
  explanation: t(
    "Over the whole real line, shifting the variable does not change the limits. So after completing the square, the center of the quadratic plays no part in the value, and only the constant under the square matters. The arctangent then runs from one horizontal asymptote to the other, a total change of $\\pi$, scaled by the coefficient in front.",
    "在整条实轴上，平移变量不改变积分限。所以配方之后，二次式的中心对积分值没有影响，只有平方外的常数起作用。此时反正切从一条水平渐近线变到另一条，总变化是 $\\pi$，再乘以前面的系数。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const a = rng.int(2, 6);
    const p = nonzero(rng, 6);
    const answer = Q.of(k, a);
    const denominator = poly([1, "x^2"], [-2 * p, "x"], [p * p + a * a, ""]);
    const lead = fractionBefore(k, a);
    return numberProblem({
      prompt: t(
        `$\\int_{-\\infty}^\\infty \\frac{${k}}{${denominator}}\\,dx = c\\pi$. Find $c$.`,
        `$\\int_{-\\infty}^\\infty \\frac{${k}}{${denominator}}\\,dx = c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(k, 2 * a), Q.of(k), Q.of(k, a * a), Q.of(2 * k, a), Q.of(k, 4 * a)],
      solution: t(
        `The denominator is $(${poly([1, "x"], [-p, ""])})^2 + ${a * a}$. With $u = ${poly([1, "x"], [-p, ""])}$, the limits stay $\\pm\\infty$, and the antiderivative $${lead}\\arctan\\frac{u}{${a}}$ changes by $${lead}\\left(\\frac{\\pi}{2} + \\frac{\\pi}{2}\\right)$, so $c = ${answer.toLatex()}$.`,
        `分母等于 $(${poly([1, "x"], [-p, ""])})^2 + ${a * a}$。令 $u = ${poly([1, "x"], [-p, ""])}$，积分限仍是 $\\pm\\infty$，原函数 $${lead}\\arctan\\frac{u}{${a}}$ 的变化量是 $${lead}\\left(\\frac{\\pi}{2} + \\frac{\\pi}{2}\\right)$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const absoluteValueUnderRoot: KnowledgePointDef = {
  id: "an-absolute-value-under-a-root-at-an-interior-point",
  title: t("An absolute value under a root at an interior point", "内点处根号下的绝对值"),
  explanation: t(
    "An integrand with $|x - c|$ under a root blows up at $x = c$, so an interval containing $c$ must be split there into two improper integrals. On each side the absolute value opens differently, which is why the two pieces do not cancel: both contribute positive area. Each piece converges because the power of the distance to $c$ is greater than $-1$.",
    "根号下含 $|x - c|$ 的被积函数在 $x = c$ 处趋于无穷，所以包含 $c$ 的区间必须在那里分成两个反常积分。两侧绝对值的去法不同，所以两部分不会抵消：它们都贡献正的面积。因为到 $c$ 的距离的幂大于 $-1$，每一部分都收敛。",
  ),
  generate(rng) {
    const c = nonzero(rng, 5);
    const a = rng.int(1, 5);
    const b = different(rng, 1, 5, a);
    const k = rng.int(1, 6);
    const answer = 2 * k * (a + b);
    const inner = poly([1, "x"], [-c, ""]);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{${c - a * a}}^{${c + b * b}} \\frac{${k}}{\\sqrt{|${inner}|}}\\,dx$.`,
        `计算 $\\int_{${c - a * a}}^{${c + b * b}} \\frac{${k}}{\\sqrt{|${inner}|}}\\,dx$。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * k * Math.abs(b - a), k * (a + b), 2 * k * (a * a + b * b), 2 * k * b],
      solution: t(
        `The integrand is unbounded at $x = ${c}$, so split there. With $u = |${inner}|$, the left piece has $u$ from $0$ to $${a * a}$ and the right piece has $u$ from $0$ to $${b * b}$. Since $\\int_0^{s^2} u^{-1/2}\\,du = 2s$, the total is $${2 * k * a} + ${2 * k * b} = ${answer}$.`,
        `被积函数在 $x = ${c}$ 处无界，所以在那里分开。令 $u = |${inner}|$，左边一段 $u$ 从 $0$ 到 $${a * a}$，右边一段 $u$ 从 $0$ 到 $${b * b}$。因为 $\\int_0^{s^2} u^{-1/2}\\,du = 2s$，总和是 $${2 * k * a} + ${2 * k * b} = ${answer}$。`,
      ),
    });
  },
};

const lengthOfCatenary: KnowledgePointDef = {
  id: "the-length-of-a-catenary",
  figure: calculusDrawings4["the-arc-length-of-a-planar-curve#the-length-of-a-catenary"],
  title: t("The length of a catenary", "悬链线的长度"),
  explanation: t(
    "A hanging chain follows the curve $y = a\\cosh\\frac{x}{a}$, and its arc length has a simple form. The derivative is a hyperbolic sine, and the identity $1 + \\sinh^2 z = \\cosh^2 z$ removes the root in the length formula. The integrand is then a hyperbolic cosine, and a logarithm in the limit is evaluated through the exponential definition of $\\sinh$.",
    "悬挂的链条沿曲线 $y = a\\cosh\\frac{x}{a}$ 分布，它的弧长形式很简单。导数是双曲正弦，恒等式 $1 + \\sinh^2 z = \\cosh^2 z$ 消去弧长公式中的根号。被积函数于是成为双曲余弦，积分限中的对数则用 $\\sinh$ 的指数定义求值。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const m = rng.int(2, 6);
    const answer = Q.of(a * (m * m - 1), 2 * m);
    return numberProblem({
      prompt: t(
        `Find the arc length of the catenary $y = ${a}\\cosh\\frac{x}{${a}}$ from $x = 0$ to $x = ${a}\\ln ${m}$.`,
        `求悬链线 $y = ${a}\\cosh\\frac{x}{${a}}$ 从 $x = 0$ 到 $x = ${a}\\ln ${m}$ 的弧长。`,
      ),
      answer,
      wrong: [Q.of(a * (m * m + 1), 2 * m), Q.of(m * m - 1, 2 * m), Q.of(a * (m * m - 1), m), Q.of(a * (m - 1))],
      solution: t(
        `$y' = \\sinh\\frac{x}{${a}}$, so $\\sqrt{1 + y'^2} = \\cosh\\frac{x}{${a}}$. The antiderivative $${a}\\sinh\\frac{x}{${a}}$ is $0$ at $x = 0$, so the length is its value at the upper limit, $${a}\\sinh(\\ln ${m}) = ${a} \\cdot \\frac{1}{2}\\left(${m} - \\frac{1}{${m}}\\right) = ${answer.toLatex()}$.`,
        `$y' = \\sinh\\frac{x}{${a}}$，所以 $\\sqrt{1 + y'^2} = \\cosh\\frac{x}{${a}}$。原函数 $${a}\\sinh\\frac{x}{${a}}$ 在 $x = 0$ 处为 $0$，所以弧长是它在上限处的值，即 $${a}\\sinh(\\ln ${m}) = ${a} \\cdot \\frac{1}{2}\\left(${m} - \\frac{1}{${m}}\\right) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const wedgeFromCylinder: KnowledgePointDef = {
  id: "the-wedge-cut-from-a-cylinder",
  figure: calculusDrawings4["volumes-of-solids-with-triangular-cross-sections#the-wedge-cut-from-a-cylinder"],
  title: t("The wedge cut from a cylinder", "从圆柱上切下的楔形"),
  explanation: t(
    "A plane through a diameter of a cylinder's base cuts off a wedge. Sliced perpendicular to that diameter, the wedge shows right triangles whose legs are both proportional to the distance from the diameter to the circle. So the area of a slice is a multiple of $r^2 - x^2$, and the volume is the integral of this across the whole diameter.",
    "过圆柱底面直径的平面切下一个楔形。垂直于这条直径切开，截面是直角三角形，它的两条直角边都与直径到圆周的距离成正比。所以截面积是 $r^2 - x^2$ 的倍数，体积就是它在整条直径上的积分。",
  ),
  generate(rng) {
    const r = rng.int(1, 9);
    const m = rng.int(2, 6);
    const answer = Q.of(2 * m * r ** 3, 3);
    const half = fractionBefore(m, 2);
    return numberProblem({
      prompt: t(
        `The base of a solid is the half disc $x^2 + y^2 \\le ${r * r}$, $y \\ge 0$. Cross sections perpendicular to the $x$-axis are right triangles with one leg in the base and the other leg ${m} times as long. Find the volume.`,
        `一个立体的底面是半圆盘 $x^2 + y^2 \\le ${r * r}$，$y \\ge 0$。垂直于 $x$ 轴的截面是直角三角形，一条直角边在底面内，另一条是它的 ${m} 倍。求体积。`,
      ),
      answer,
      wrong: [Q.of(4 * m * r ** 3, 3), Q.of(m * r ** 3, 3), Q.of(2 * m * r * r, 3), Q.of(m * r ** 3)],
      solution: t(
        `The leg in the base is $y = \\sqrt{${r * r} - x^2}$, so the area of a slice is $\\frac{1}{2} \\cdot y \\cdot ${m}y = ${half}(${r * r} - x^2)$. Integrating from $x = -${r}$ to $x = ${r}$ gives $${half}\\left(\\frac{4 \\cdot ${r ** 3}}{3}\\right) = ${answer.toLatex()}$.`,
        `底面内的直角边是 $y = \\sqrt{${r * r} - x^2}$，所以截面积是 $\\frac{1}{2} \\cdot y \\cdot ${m}y = ${half}(${r * r} - x^2)$。从 $x = -${r}$ 积到 $x = ${r}$，得 $${half}\\left(\\frac{4 \\cdot ${r ** 3}}{3}\\right) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const napkinRing: KnowledgePointDef = {
  id: "the-volume-of-a-napkin-ring",
  figure: calculusDrawings4["volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes#the-volume-of-a-napkin-ring"],
  title: t("The volume of a napkin ring", "餐巾环的体积"),
  explanation: t(
    "Drilling a cylindrical hole through the center of a sphere leaves a ring. With the hole along an axis, each slice perpendicular to it is a washer whose outer radius comes from the sphere and whose inner radius is the hole. The slices stop where the two radii meet, and in the difference of squares the radius of the sphere drops out, leaving only that height.",
    "沿球心钻一个圆柱形的孔，剩下的是一个环。让孔沿坐标轴放置，垂直于轴的每个截面都是垫圈，外半径来自球面，内半径就是孔的半径。截面在两个半径相等处终止；在平方差中，球的半径消去了，只留下这个高度。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const s = rng.int(1, 2);
    const A = s * a;
    const B = s * b;
    const R = s * h;
    const answer = Q.of(4 * B ** 3, 3);
    return numberProblem({
      prompt: t(
        `A cylindrical hole of radius $${A}$ is drilled through the center of a sphere of radius $${R}$. The volume of the solid that remains is $c\\pi$. Find $c$.`,
        `沿半径为 $${R}$ 的球的球心钻一个半径为 $${A}$ 的圆柱形孔。剩下的立体的体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(4 * R ** 3, 3), Q.of(4 * (R ** 3 - A ** 3), 3), Q.of(2 * B ** 3, 3), Q.of(4 * A ** 3, 3)],
      solution: t(
        `Take the hole along the $y$-axis. The washer at height $y$ has outer radius squared $${R * R} - y^2$ and inner radius squared $${A * A}$, so its area is $\\pi(${B * B} - y^2)$. It exists for $|y| \\le ${B}$, and integrating gives $\\frac{4}{3} \\cdot ${B ** 3}\\pi$, so $c = ${answer.toLatex()}$.`,
        `让孔沿 $y$ 轴。高度 $y$ 处的垫圈，外半径的平方是 $${R * R} - y^2$，内半径的平方是 $${A * A}$，所以面积是 $\\pi(${B * B} - y^2)$。它存在于 $|y| \\le ${B}$，积分得 $\\frac{4}{3} \\cdot ${B ** 3}\\pi$，所以 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const squaresOverEllipse: KnowledgePointDef = {
  id: "squares-over-an-elliptical-base",
  figure: calculusDrawings4["volumes-of-solids-with-square-cross-sections#squares-over-an-elliptical-base"],
  title: t("Squares over an elliptical base", "椭圆底面上的正方形截面"),
  explanation: t(
    "On a base bounded by a closed curve, the side of a cross section is the full chord across the region, which is twice the height of the upper half when the base is symmetric. Solving the equation of the ellipse for $y^2$ gives the area of a square directly, with no root left to handle, as a quadratic in $x$ to integrate.",
    "底面由闭曲线围成时，截面的边长是穿过区域的整条弦；底面对称时，它等于上半部分高度的两倍。从椭圆方程解出 $y^2$，就直接得到正方形的面积，不必处理根号，它是 $x$ 的二次式，可以直接积分。",
  ),
  generate(rng) {
    const a = rng.int(2, 7);
    const b = rng.int(2, 7);
    const answer = Q.of(16 * a * b * b, 3);
    return numberProblem({
      prompt: t(
        `The base of a solid is the region inside the ellipse $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$. Cross sections perpendicular to the $x$-axis are squares with one side in the base. Find the volume.`,
        `一个立体的底面是椭圆 $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$ 内部的区域。垂直于 $x$ 轴的截面是正方形，一条边在底面内。求体积。`,
      ),
      answer,
      wrong: [Q.of(16 * a * a * b, 3), Q.of(8 * a * b * b, 3), Q.of(4 * a * b * b, 3), Q.of(32 * a * b * b, 3)],
      solution: t(
        `The side is the chord $2y$, so the area is $4y^2 = ${4 * b * b}\\left(1 - \\frac{x^2}{${a * a}}\\right)$. Integrating from $x = -${a}$ to $x = ${a}$ gives $${4 * b * b}\\left(${2 * a} - ${Q.of(2 * a, 3).toLatex()}\\right) = ${answer.toLatex()}$.`,
        `边长是弦长 $2y$，所以面积是 $4y^2 = ${4 * b * b}\\left(1 - \\frac{x^2}{${a * a}}\\right)$。从 $x = -${a}$ 积到 $x = ${a}$，得 $${4 * b * b}\\left(${2 * a} - ${Q.of(2 * a, 3).toLatex()}\\right) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const parametricConcavityChange: KnowledgePointDef = {
  id: "where-a-parametric-curve-changes-concavity",
  title: t("Where a parametric curve changes concavity", "参数曲线改变凹凸性的位置"),
  explanation: t(
    "For a parametric curve, $\\frac{d^{2}y}{dx^{2}}$ is the $t$-derivative of $\\frac{dy}{dx}$ divided by $\\frac{dx}{dt}$. Concavity changes where this quotient changes sign. Keep the result as a single fraction in $t$ rather than evaluating it at a point: the sign of the denominator is often fixed on the given range of $t$, so only the zeros of the numerator matter.",
    "对参数曲线，$\\frac{d^{2}y}{dx^{2}}$ 等于 $\\frac{dy}{dx}$ 对 $t$ 的导数除以 $\\frac{dx}{dt}$。这个商改变符号的地方，就是凹凸性改变的地方。把结果保留为 $t$ 的一个分式，而不是代入某一点：分母的符号在给定的 $t$ 范围内常常是固定的，所以只需看分子的零点。",
  ),
  generate(rng) {
    const m = rng.int(1, 6);
    const alpha = rng.int(1, 4);
    const beta = nonzero(rng, 3);
    const y = poly([beta, "t^3"], [3 * beta * m * m, "t"]);
    const numerator = 6 * alpha * beta;
    return numberProblem({
      prompt: t(
        `A curve is given by $x = ${coefficientOf(alpha)}t^2, \\; y = ${y}$ for $t > 0$. At which value of $t$ does $\\frac{d^{2}y}{dx^{2}}$ change sign?`,
        `曲线由 $x = ${coefficientOf(alpha)}t^2, \\; y = ${y}$（$t > 0$）给出。$\\frac{d^{2}y}{dx^{2}}$ 在 $t$ 取何值时改变符号？`,
      ),
      answer: m,
      form: "integer",
      wrong: [m * m, 3 * m * m, m + 1, 6 * m * m],
      solution: t(
        `$\\frac{dy}{dx} = \\frac{${poly([3 * beta, "t^2"], [3 * beta * m * m, ""])}}{${2 * alpha}t}$. Differentiating in $t$ and dividing by $${2 * alpha}t$ gives $\\frac{d^{2}y}{dx^{2}} = \\frac{${numerator}(t^2 - ${m * m})}{${8 * alpha ** 3}t^3}$. For $t > 0$ the denominator is positive, so the sign changes only at $t = ${m}$.`,
        `$\\frac{dy}{dx} = \\frac{${poly([3 * beta, "t^2"], [3 * beta * m * m, ""])}}{${2 * alpha}t}$。对 $t$ 求导再除以 $${2 * alpha}t$，得 $\\frac{d^{2}y}{dx^{2}} = \\frac{${numerator}(t^2 - ${m * m})}{${8 * alpha ** 3}t^3}$。$t > 0$ 时分母为正，所以只在 $t = ${m}$ 处改变符号。`,
      ),
    });
  },
};

const whenTwoPointsMeet: KnowledgePointDef = {
  id: "when-two-moving-points-meet",
  title: t("When two moving points meet", "两个运动的点何时相遇"),
  explanation: t(
    "Two vector-valued functions describe points at the same place only when every component agrees at the same value of $t$. Equal second components alone are not enough, since the points may then be separated horizontally. So solve the simplest component equation first, then test the candidates in the other component, and keep only a time that satisfies both.",
    "两个向量值函数表示的点在同一位置，当且仅当在同一个 $t$ 处所有分量都相等。只有第二个分量相等还不够，因为这时两点可能在水平方向上分开。所以先解最简单的分量方程，再把解代入另一个分量检验，只保留同时满足两者的时刻。",
  ),
  generate(rng) {
    const T = rng.int(1, 6);
    const alpha = nonzero(rng, 5);
    const beta = nonzero(rng, 5);
    const m = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== 2 * T));
    const r1 = `\\langle ${poly([1, "t"], [alpha, ""])}, ${poly([1, "t^2"], [beta, ""])} \\rangle`;
    const r2 = `\\langle ${poly([2, "t"], [alpha - T, ""])}, ${poly([m, "t"], [beta + T * T - m * T, ""])} \\rangle`;
    return numberProblem({
      prompt: t(
        `Two points move along $\\mathbf{r}_1(t) = ${r1}$ and $\\mathbf{r}_2(t) = ${r2}$. At which time $t > 0$ are they at the same place?`,
        `两个点分别沿 $\\mathbf{r}_1(t) = ${r1}$ 和 $\\mathbf{r}_2(t) = ${r2}$ 运动。在哪个时刻 $t > 0$ 它们位于同一位置？`,
      ),
      answer: T,
      form: "integer",
      wrong: [m - T, m, T * T, T + 1, T + 3],
      solution: t(
        `The first components agree only when $${poly([1, "t"], [alpha, ""])} = ${poly([2, "t"], [alpha - T, ""])}$, that is at $t = ${T}$. There both second components equal $${T * T + beta}$, so the points meet. The second components also agree at $t = ${m - T}$, but the first components differ there.`,
        `第一个分量只在 $${poly([1, "t"], [alpha, ""])} = ${poly([2, "t"], [alpha - T, ""])}$ 时相等，即 $t = ${T}$。此时两个第二分量都等于 $${T * T + beta}$，所以两点相遇。第二分量在 $t = ${m - T}$ 处也相等，但那里第一分量不同。`,
      ),
    });
  },
};

const lengthOfLogarithmicSpiral: KnowledgePointDef = {
  id: "the-length-of-a-logarithmic-spiral",
  figure: calculusDrawings5["the-arc-length-of-a-polar-curve#the-length-of-a-logarithmic-spiral"],
  title: t("The length of a logarithmic spiral", "对数螺线的长度"),
  explanation: t(
    "On the spiral $r = e^{k\\theta}$, the derivative of $r$ is $k$ times $r$, so $r^2 + \\left(\\frac{dr}{d\\theta}\\right)^2$ has $r^2$ as a factor and the root in the length formula simplifies. Changing variable from $\\theta$ to $r$ then shows that length is proportional to the change in distance from the pole, so the angle never needs to be found.",
    "在螺线 $r = e^{k\\theta}$ 上，$r$ 的导数是 $r$ 的 $k$ 倍，所以 $r^2 + \\left(\\frac{dr}{d\\theta}\\right)^2$ 含有因子 $r^2$，弧长公式中的根号得以化简。再把变量从 $\\theta$ 换成 $r$，可以看到长度与到极点距离的变化量成正比，所以根本不需要求出角度。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const p = rng.int(1, 4);
    const q = rng.int(p + 1, 9);
    const k = Q.of(a, b);
    const factor = Q.of(h, a);
    const answer = factor.mul(Q.of(q - p));
    return numberProblem({
      prompt: t(
        `Find the length of the spiral $r = e^{${k.toLatex()}\\theta}$ from the point where $r = ${p}$ to the point where $r = ${q}$.`,
        `求螺线 $r = e^{${k.toLatex()}\\theta}$ 从 $r = ${p}$ 的点到 $r = ${q}$ 的点的长度。`,
      ),
      answer,
      wrong: [Q.of(h * (q - p), b), Q.of(a * (q - p), h), Q.of(q - p), Q.of(h * (q * q - p * p), 2 * a)],
      solution: t(
        `Here $k = ${k.toLatex()}$ and $\\frac{dr}{d\\theta} = kr$, so $ds = r\\sqrt{1 + k^2}\\,d\\theta$ with $\\sqrt{1 + k^2} = ${Q.of(h, b).toLatex()}$. Since $dr = kr\\,d\\theta$, this is $ds = ${factor.toLatex()}\\,dr$. So the length is $${factor.toLatex()} \\cdot ${q - p} = ${answer.toLatex()}$.`,
        `这里 $k = ${k.toLatex()}$，$\\frac{dr}{d\\theta} = kr$，所以 $ds = r\\sqrt{1 + k^2}\\,d\\theta$，其中 $\\sqrt{1 + k^2} = ${Q.of(h, b).toLatex()}$。因为 $dr = kr\\,d\\theta$，所以 $ds = ${factor.toLatex()}\\,dr$。于是长度是 $${factor.toLatex()} \\cdot ${q - p} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const tailFromPartialSum: KnowledgePointDef = {
  id: "a-tail-sum-from-the-partial-sum-formula",
  title: t("A tail sum from the partial sum formula", "由部分和公式求尾部和"),
  explanation: t(
    "A formula for the partial sums contains everything about a series. Its limit as $n$ grows is the sum of the whole series. The partial sum at a given index is the total of the terms up to that index. So the sum from a later index onward is the limit minus the partial sum that stops just before that index, with no individual terms needed.",
    "部分和公式包含了级数的全部信息。它在 $n$ 增大时的极限就是整个级数的和。某一项处的部分和就是到那一项为止各项的总和。所以从后面某一项开始的和，等于极限减去恰好停在那一项之前的部分和，不需要逐项计算。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = rng.int(1, 6);
    const m = rng.int(3, 8);
    const removed = Q.of(p * (m - 1), m - 1 + q);
    const answer = Q.of(p).sub(removed);
    const shown = removed.sign() < 0 ? `\\left(${removed.toLatex()}\\right)` : removed.toLatex();
    return numberProblem({
      prompt: t(
        `The $n$th partial sum of $\\sum_{n=1}^{\\infty} a_n$ is $S_n = \\frac{${signedCoefficient(p)}n}{n + ${q}}$. Find $\\sum_{n=${m}}^{\\infty} a_n$.`,
        `$\\sum_{n=1}^{\\infty} a_n$ 的第 $n$ 个部分和是 $S_n = \\frac{${signedCoefficient(p)}n}{n + ${q}}$。求 $\\sum_{n=${m}}^{\\infty} a_n$。`,
      ),
      answer,
      wrong: [Q.of(p), removed, Q.of(p * q, m + q), Q.of(p * m, m + q)],
      solution: t(
        `The whole series has sum $\\lim_{n \\to \\infty} S_n = ${p}$. The terms before $n = ${m}$ add up to $S_{${m - 1}} = ${removed.toLatex()}$. So the sum asked for is $${p} - ${shown} = ${answer.toLatex()}$.`,
        `整个级数的和是 $\\lim_{n \\to \\infty} S_n = ${p}$。$n = ${m}$ 之前的各项之和是 $S_{${m - 1}} = ${removed.toLatex()}$。所以所求的和是 $${p} - ${shown} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const widthOfIntegralBounds: KnowledgePointDef = {
  id: "the-width-of-the-integral-test-bounds",
  title: t("The width of the integral test bounds", "积分判别法上下界的宽度"),
  explanation: t(
    "The remainder after $N$ terms lies between two improper integrals: one starting at $N + 1$ and one starting at $N$. Adding $S_N$ traps the true sum between a lower and an upper bound. The partial sum is common to both, so the distance between the bounds depends only on the two integrals, and it can be found without computing $S_N$.",
    "前 $N$ 项之后的余项介于两个反常积分之间：一个从 $N + 1$ 开始，另一个从 $N$ 开始。加上 $S_N$，就把真正的和夹在下界和上界之间。两个界都含部分和，所以它们之间的距离只取决于这两个积分，不必计算 $S_N$ 就能求出。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const p = rng.int(2, 3);
    const N = rng.int(3, 12);
    const tail = (start: number) => Q.of(k, (p - 1) * start ** (p - 1));
    const answer = tail(N).sub(tail(N + 1));
    return numberProblem({
      prompt: t(
        `For $S = \\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${p}}}$, the integral test traps $S$ between a lower and an upper bound that both use $S_{${N}}$. How far apart are the two bounds?`,
        `对 $S = \\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${p}}}$，积分判别法把 $S$ 夹在都用到 $S_{${N}}$ 的下界和上界之间。这两个界相距多远？`,
      ),
      answer,
      wrong: [tail(N), tail(N + 1), tail(N).add(tail(N + 1)), Q.of(k, N ** p)],
      solution: t(
        `The bounds are $S_{${N}} + \\int_{${N + 1}}^\\infty f$ and $S_{${N}} + \\int_{${N}}^\\infty f$, where $f(x) = \\frac{${k}}{x^{${p}}}$. These integrals are $${tail(N + 1).toLatex()}$ and $${tail(N).toLatex()}$. The partial sum cancels, so the distance is $${tail(N).toLatex()} - ${tail(N + 1).toLatex()} = ${answer.toLatex()}$.`,
        `两个界是 $S_{${N}} + \\int_{${N + 1}}^\\infty f$ 和 $S_{${N}} + \\int_{${N}}^\\infty f$，其中 $f(x) = \\frac{${k}}{x^{${p}}}$。这两个积分分别是 $${tail(N + 1).toLatex()}$ 和 $${tail(N).toLatex()}$。部分和相互抵消，所以距离是 $${tail(N).toLatex()} - ${tail(N + 1).toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const degreeForAccuracy: KnowledgePointDef = {
  id: "the-degree-needed-for-an-accuracy",
  title: t("The degree needed for an accuracy", "达到给定精度所需的次数"),
  explanation: t(
    "The Lagrange bound can be read backwards. Every derivative of sine and cosine is at most $1$ in size, so the error of the polynomial of degree $n$ is bounded by a power of $|x|$ over a factorial, both with index $n + 1$. The factorial eventually wins, so try successive values of $n$ until the bound falls below the required accuracy.",
    "拉格朗日界可以反过来用。正弦和余弦的各阶导数的绝对值都不超过 $1$，所以 $n$ 次多项式的误差不超过 $|x|$ 的幂除以阶乘，两者的指标都是 $n + 1$。阶乘最终占优，所以逐个试 $n$，直到这个界小于所要求的精度。",
  ),
  generate(rng) {
    const sine = rng.pick([true, false]);
    const x = rng.pick([Q.of(1, 2), Q.of(1), Q.of(3, 2), Q.of(2), Q.of(3)]);
    const power = rng.int(1, 4);
    const accuracy = Q.of(1, 10 ** power);
    const bound = (n: number) => x.pow(n + 1).div(Q.of(factorial(n + 1)));
    let n = 0;
    while (bound(n).cmp(accuracy) >= 0) n += 1;
    const fn = sine ? "\\sin" : "\\cos";
    return numberProblem({
      prompt: t(
        `Find the smallest degree $n$ for which the Lagrange error bound guarantees that the Taylor polynomial of degree $n$ for $${fn} x$ centered at $0$ has error less than $${accuracy.toLatex()}$ at $x = ${x.toLatex()}$.`,
        `求最小的次数 $n$，使拉格朗日误差界能保证 $${fn} x$ 在 $0$ 处的 $n$ 次泰勒多项式在 $x = ${x.toLatex()}$ 处的误差小于 $${accuracy.toLatex()}$。`,
      ),
      answer: n,
      form: "integer",
      wrong: [n + 1, n - 1, n + 2, n + 3],
      solution: t(
        `Every derivative of $${fn} x$ is at most $1$ in size, so the error is at most $\\frac{|x|^{n+1}}{(n+1)!}$. At degree $${n - 1}$ this is $${bound(n - 1).toLatex()}$, which is not below the accuracy. At degree $${n}$ it is $${bound(n).toLatex()}$, which is. So $n = ${n}$.`,
        `$${fn} x$ 的各阶导数的绝对值都不超过 $1$，所以误差不超过 $\\frac{|x|^{n+1}}{(n+1)!}$。次数为 $${n - 1}$ 时它等于 $${bound(n - 1).toLatex()}$，没有小于所要求的精度。次数为 $${n}$ 时它等于 $${bound(n).toLatex()}$，小于精度。所以 $n = ${n}$。`,
      ),
    });
  },
};

const sumWithNSquared: KnowledgePointDef = {
  id: "a-sum-with-n-squared-by-differentiating-twice",
  title: t("A sum with n squared by differentiating twice", "两次求导求含 n 平方的和"),
  explanation: t(
    "Differentiating a power series and multiplying by $x$ puts one factor of $n$ into each term. Doing this to the geometric series gives the sum of $nx^n$, and doing it once more gives the sum of $n^2x^n$. Each round is a quotient rule on a closed form, and the result holds inside the interval of convergence, so a number can then be substituted.",
    "对幂级数求导再乘以 $x$，每一项就多一个因子 $n$。对等比级数这样做一次，得到 $nx^n$ 的和；再做一次，得到 $n^2x^n$ 的和。每一轮都是对闭式用商法则，结果在收敛区间内成立，所以可以代入具体的数。",
  ),
  generate(rng) {
    const b = rng.int(2, 9);
    const k = rng.int(1, 6);
    const alternating = rng.pick([true, false]);
    const x = Q.of(alternating ? -1 : 1, b);
    const one = Q.of(1);
    const sign = Q.of(alternating ? -k : k);
    const closed = x.mul(one.add(x)).div(one.sub(x).pow(3));
    const answer = sign.mul(closed);
    const signPart = alternating ? "(-1)^{n+1} " : "";
    const note = alternating ? ", and $(-1)^{n+1} = -(-1)^n$ puts a minus sign in front" : "";
    const factor = k === 1 ? "" : `, multiplied by $${k}$`;
    const factorZh = k === 1 ? "" : `，再乘以 $${k}$`;
    const noteZh = alternating ? "，而 $(-1)^{n+1} = -(-1)^n$ 使前面多一个负号" : "";
    return numberProblem({
      prompt: t(
        `Find the sum of $\\sum_{n=1}^{\\infty} \\frac{${signPart}${coefficientOf(k)}n^2}{${b}^n}$.`,
        `求 $\\sum_{n=1}^{\\infty} \\frac{${signPart}${coefficientOf(k)}n^2}{${b}^n}$ 的和。`,
      ),
      answer,
      wrong: [
        sign.mul(x).div(one.sub(x).pow(2)),
        sign.mul(one.add(x)).div(one.sub(x).pow(3)),
        sign.mul(x).div(one.sub(x).pow(3)),
        answer.neg(),
      ],
      solution: t(
        `From $\\sum_{n=1}^{\\infty} nx^n = \\frac{x}{(1 - x)^2}$, differentiating and multiplying by $x$ gives $\\sum_{n=1}^{\\infty} n^2x^n = \\frac{x(1 + x)}{(1 - x)^3}$. Here $x = ${x.toLatex()}$${note}${factor}. The sum is $${answer.toLatex()}$.`,
        `由 $\\sum_{n=1}^{\\infty} nx^n = \\frac{x}{(1 - x)^2}$，求导再乘以 $x$，得 $\\sum_{n=1}^{\\infty} n^2x^n = \\frac{x(1 + x)}{(1 - x)^3}$。这里 $x = ${x.toLatex()}$${noteZh}${factorZh}。和是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const errorOfSeriesIntegral: KnowledgePointDef = {
  id: "the-error-of-a-series-estimate-of-an-integral",
  title: t("The error of a series estimate of an integral", "用级数估计积分的误差"),
  explanation: t(
    "Integrating a Maclaurin series term by term gives a numerical series for the integral. When that series alternates and its terms shrink, the error of stopping early is at most the size of the first term left out. So the accuracy of the estimate can be read from one more term of the series, without knowing the exact value of the integral.",
    "把麦克劳林级数逐项积分，就得到积分值的数项级数。当这个级数交错且各项递减时，提前停止的误差不超过第一个被舍去项的大小。所以只要多算一项，就能知道估计的精度，不必知道积分的精确值。",
  ),
  generate(rng) {
    const [c, a] = rng.pick([
      [1, Q.of(1, 2)],
      [2, Q.of(1, 2)],
      [3, Q.of(1, 2)],
      [1, Q.of(1, 3)],
      [2, Q.of(1, 3)],
      [3, Q.of(1, 3)],
      [4, Q.of(1, 3)],
      [5, Q.of(1, 3)],
      [1, Q.of(1, 4)],
      [2, Q.of(1, 4)],
      [3, Q.of(1, 4)],
      [4, Q.of(1, 4)],
      [5, Q.of(1, 4)],
      [2, Q.of(2, 3)],
      [1, Q.of(3, 4)],
      [1, Q.of(2, 3)],
    ]) as [number, Q];
    const m = rng.int(2, 3);
    const size = (n: number) => Q.of(c ** n, factorial(n) * (2 * n + 1)).mul(a.pow(2 * n + 1));
    const answer = size(m);
    const upper = a.toLatex();
    const growth = c === 1 ? "" : `${c}^n `;
    return numberProblem({
      prompt: t(
        `Use the first ${m} nonzero terms of a Maclaurin series to approximate $\\int_0^{${upper}} e^{-${coefficientOf(c)}t^2}\\,dt$. The series alternates and its terms decrease in size. Find the bound on the error given by the alternating series error bound.`,
        `用麦克劳林级数的前 ${m} 个非零项近似 $\\int_0^{${upper}} e^{-${coefficientOf(c)}t^2}\\,dt$。这个级数交错，各项的大小递减。求交错级数误差界给出的误差上界。`,
      ),
      answer,
      wrong: [
        size(m - 1),
        Q.of(c ** m, factorial(m)).mul(a.pow(2 * m + 1)),
        Q.of(c ** m, 2 * m + 1).mul(a.pow(2 * m + 1)),
        Q.of(c ** m, factorial(m)).mul(a.pow(2 * m)),
      ],
      solution: t(
        `Integrating term by term gives terms of size $\\frac{${growth}\\left(${upper}\\right)^{2n+1}}{n!(2n+1)}$ for $n = 0, 1, 2, \\dots$. The terms kept stop at $n = ${m - 1}$, so the bound is the term with $n = ${m}$, which is $${answer.toLatex()}$.`,
        `逐项积分，各项的大小是 $\\frac{${growth}\\left(${upper}\\right)^{2n+1}}{n!(2n+1)}$，$n = 0, 1, 2, \\dots$。保留的项到 $n = ${m - 1}$ 为止，所以误差界是 $n = ${m}$ 的项，等于 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const xFromSeriesSum: KnowledgePointDef = {
  id: "the-value-of-x-from-the-sum-of-a-series",
  title: t("The value of x from the sum of a series", "由级数的和求 x"),
  explanation: t(
    "A geometric series with ratio containing $x$ has a sum that is a function of $x$, so a given sum is an equation for $x$. Write the closed form with attention to the starting index, which decides the numerator, and solve for the ratio. Then check that the ratio is below $1$ in size, since otherwise the series does not converge to that sum at all.",
    "公比含 $x$ 的等比级数，它的和是 $x$ 的函数，所以已知和就是关于 $x$ 的方程。写出闭式时要注意起始下标，它决定分子，然后解出公比。还要检验公比的绝对值小于 $1$，否则级数根本不收敛到这个和。",
  ),
  generate(rng) {
    const start = rng.int(0, 1);
    const k = rng.int(2, 9);
    const s = rng.int(2, 7);
    const fromZero = Q.of(s - 1, s);
    const fromOne = Q.of(s, s + 1);
    const ratio = start === 0 ? fromZero : fromOne;
    const answer = ratio.mul(Q.of(k));
    return numberProblem({
      prompt: t(
        `Find the value of $x$ for which $\\sum_{n=${start}}^{\\infty} \\left(\\frac{x}{${k}}\\right)^n = ${s}$.`,
        `求使 $\\sum_{n=${start}}^{\\infty} \\left(\\frac{x}{${k}}\\right)^n = ${s}$ 的 $x$ 值。`,
      ),
      answer,
      solveFor: "x",
      wrong:
        start === 0
          ? [fromOne.mul(Q.of(k)), Q.of(k * s), Q.of(k, s), Q.of(k * (s + 1), s)]
          : [fromZero.mul(Q.of(k)), Q.of(k * s), Q.of(k, s + 1), Q.of(k * (s + 1), s)],
      solution: t(
        `With ratio $r = \\frac{x}{${k}}$, the sum is $${start === 0 ? "\\frac{1}{1 - r}" : "\\frac{r}{1 - r}"}$. Setting this equal to $${s}$ gives $r = ${ratio.toLatex()}$, which is below $1$ in size, so the series converges. Then $x = ${k}r = ${answer.toLatex()}$.`,
        `设公比 $r = \\frac{x}{${k}}$，和是 $${start === 0 ? "\\frac{1}{1 - r}" : "\\frac{r}{1 - r}"}$。令它等于 $${s}$，得 $r = ${ratio.toLatex()}$，绝对值小于 $1$，所以级数收敛。于是 $x = ${k}r = ${answer.toLatex()}$。`,
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
  "integrating-linear-rational-functions-using-substitution": [upperLimitFromLogarithm],
  "integration-using-substitution": [xTimesFOfXSquared],
  "further-integration-of-algebraic-functions-using-substitution": [xSquaredInTermsOfU],
  "integration-by-substitution-with-inverse-hyperbolic-functions": [arsinhAsLogarithm],
  "integrating-functions-using-polynomial-division": [constantRemovingLogarithm],
  "integrating-functions-by-completing-the-square": [linearOverCompletedSquare],
  "integration-using-basic-hyperbolic-identities": [powerOfCoshAndSinh],
  "integration-using-the-hyperbolic-pythagorean-identities": [evenPowerOfSech],
  "integration-using-the-hyperbolic-double-angle-formulas": [fourthPowerOfHyperbolic],
  "using-integration-by-parts-to-calculate-integrals-with-logarithms": [convenientConstantInV],
  "applying-the-integration-by-parts-twice": [reductionForPowerTimesExponential],
  "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions": [twoRepeatedFactors],
  "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions": [xSquaredAsOneVariable],
  "integrating-rational-functions-with-irreducible-quadratic-factors": [twoQuadraticsOverHalfLine],
  "improper-integrals-involving-exponential-functions": [exponentialFractionImproper],
  "improper-integrals-involving-arctangent": [realLineCompletedSquare],
  "improper-integrals-of-the-second-kind-discontinuities-at-interior-points": [absoluteValueUnderRoot],
  "the-arc-length-of-a-planar-curve": [lengthOfCatenary],
  "volumes-of-solids-with-triangular-cross-sections": [wedgeFromCylinder],
  "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes": [napkinRing],
  "volumes-of-solids-with-square-cross-sections": [squaresOverEllipse],
  "second-derivatives-of-parametric-equations": [parametricConcavityChange],
  "defining-vector-valued-functions": [whenTwoPointsMeet],
  "the-arc-length-of-a-polar-curve": [lengthOfLogarithmicSpiral],
  "infinite-series-and-partial-sums": [tailFromPartialSum],
  "the-remainder-estimate-for-the-integral-test": [widthOfIntegralBounds],
  "the-lagrange-error-bound": [degreeForAccuracy],
  "differentiating-taylor-series": [sumWithNSquared],
  "approximating-integrals-using-taylor-series": [errorOfSeriesIntegral],
  "convergence-of-geometric-series": [xFromSeriesSum],
};
