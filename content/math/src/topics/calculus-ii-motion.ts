import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { oneOf, type Poly, pAt, pDer, pLatex } from "./calculus-common.ts";
import { antiderivativeLatex } from "./calculus-i-riemann.ts";
import { exactProblem, int, intQ, times } from "./calculus-ii-areas.ts";
import { coef } from "./calculus-ii-substitution.ts";

// Calculus II unit 2: Applications of Integration, module 2.12.

/** tL writes a polynomial in t. */
const tL = (p: Poly) => pLatex(p, "t");

/** plus writes "+ n" or "- n" after another term, or nothing for 0. */
const plus = (n: number) => (n === 0 ? "" : n > 0 ? ` + ${n}` : ` - ${-n}`);

/** bracketT writes the antiderivative of p evaluated from a to b, in t. */
const bracketT = (p: Poly, a: number, b: number) => `\\Big[${antiderivativeLatex(p).replace(/x/g, "t")}\\Big]_{${a}}^{${b}}`;

/** particle introduces a particle moving along a line. */
const particle = t(
  "A particle moves along a horizontal line, with $t$ in seconds and distances in meters.",
  "一个质点沿水平直线运动，$t$ 的单位为秒，距离的单位为米。",
);

/** ask joins the setup of a motion problem with its question. */
const ask = (setup: Text, question: Text) =>
  t(`${particle.en} ${setup.en} ${question.en}`, `${particle["zh-CN"]}${setup["zh-CN"]}${question["zh-CN"]}`);

/** randomCubic chooses a cubic position function with integer coefficients and constant term s0. */
function randomCubic(rng: Rng, s0: number): Poly {
  return [s0, rng.int(-6, 6), rng.nonZero(-4, 4), rng.int(-1, 1)];
}

/** velocityAtATime integrates an acceleration to find the velocity at a given time. */
function velocityAtATime(rng: Rng) {
  const v: Poly = [rng.int(-8, 8), rng.int(-6, 6), rng.nonZero(-3, 3), rng.int(0, 1)];
  const a = pDer(v);
  const T = rng.int(1, 5);
  const v0 = v[0] ?? 0;
  const change = intQ(a, 0, T);
  const answer = pAt(v, T);
  return numberProblem({
    prompt: ask(
      t(
        `Its acceleration is $a(t) = ${tL(a)}$ m/s², and its initial velocity is $v(0) = ${v0}$ m/s.`,
        `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，初速度为 $v(0) = ${v0}$ 米/秒。`,
      ),
      t(`Find its velocity at $t = ${T}$, in m/s.`, `求它在 $t = ${T}$ 时的速度（米/秒）。`),
    ),
    answer,
    unit: "m/s",
    wrong: [change, pAt(a, T), v0 + pAt(a, T) * T],
    solution: t(
      `$v(${T}) = v(0) + ${int(0, T, `(${tL(a)})`, "t")} = ${v0} + ${bracketT(a, 0, T)} = ${v0} + ${change.toLatex()} = ${answer}$ m/s.`,
      `$v(${T}) = v(0) + ${int(0, T, `(${tL(a)})`, "t")} = ${v0} + ${bracketT(a, 0, T)} = ${v0} + ${change.toLatex()} = ${answer}$ 米/秒。`,
    ),
  });
}

/** velocityFunction integrates an acceleration and uses a known velocity to find the constant. */
function velocityFunction(rng: Rng) {
  const kind = rng.int(0, 3);
  const k = rng.nonZero(-5, 5);
  const w = rng.int(-6, 6);
  if (kind === 0) {
    const ks = coef(Q.of(k));
    return functionProblem({
      prompt: ask(
        t(
          `Its acceleration is $a(t) = ${ks}\\cos t$ m/s², and $v(0) = ${w}$ m/s.`,
          `它的加速度为 $a(t) = ${ks}\\cos t$ 米/秒²，且 $v(0) = ${w}$ 米/秒。`,
        ),
        t("Find its velocity $v(t)$.", "求它的速度 $v(t)$。"),
      ),
      answer: `${ks}\\sin t${plus(w)}`,
      wrong: [`${ks}\\sin t`, `${coef(Q.of(-k))}\\sin t${plus(w)}`, `${ks}\\sin t${plus(w + k)}`],
      variable: "t",
      solution: t(
        `$v(t) = \\int ${ks}\\cos t \\, dt = ${ks}\\sin t + C$, and $v(0) = C = ${w}$. So $v(t) = ${ks}\\sin t${plus(w)}$.`,
        `$v(t) = \\int ${ks}\\cos t \\, dt = ${ks}\\sin t + C$，而 $v(0) = C = ${w}$。所以 $v(t) = ${ks}\\sin t${plus(w)}$。`,
      ),
    });
  }
  if (kind === 1) {
    const ks = coef(Q.of(k));
    return functionProblem({
      prompt: ask(
        t(
          `Its acceleration is $a(t) = ${ks}e^{t}$ m/s², and $v(0) = ${w}$ m/s.`,
          `它的加速度为 $a(t) = ${ks}e^{t}$ 米/秒²，且 $v(0) = ${w}$ 米/秒。`,
        ),
        t("Find its velocity $v(t)$.", "求它的速度 $v(t)$。"),
      ),
      answer: `${ks}e^{t}${plus(w - k)}`,
      wrong: [`${ks}e^{t}${plus(w)}`, `${ks}e^{t}`, `${ks}e^{t}${plus(w + k)}`],
      variable: "t",
      solution: t(
        `$v(t) = \\int ${ks}e^{t} \\, dt = ${ks}e^{t} + C$, and $v(0) = ${k} + C = ${w}$, so $C = ${w - k}$ and $v(t) = ${ks}e^{t}${plus(w - k)}$.`,
        `$v(t) = \\int ${ks}e^{t} \\, dt = ${ks}e^{t} + C$，而 $v(0) = ${k} + C = ${w}$，所以 $C = ${w - k}$，$v(t) = ${ks}e^{t}${plus(w - k)}$。`,
      ),
    });
  }
  const v: Poly = [rng.int(-8, 8), rng.int(-6, 6), rng.nonZero(-3, 3)];
  const a = pDer(v);
  const t1 = rng.int(1, 3);
  const vt1 = pAt(v, t1);
  const free: Poly = [0, ...v.slice(1)];
  const C = v[0] ?? 0;
  return functionProblem({
    prompt: ask(
      t(
        `Its acceleration is $a(t) = ${tL(a)}$ m/s², and $v(${t1}) = ${vt1}$ m/s.`,
        `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，且 $v(${t1}) = ${vt1}$ 米/秒。`,
      ),
      t("Find its velocity $v(t)$.", "求它的速度 $v(t)$。"),
    ),
    answer: tL(v),
    wrong: [tL(free), tL([vt1, ...v.slice(1)]), tL(pDer(a))],
    variable: "t",
    solution: t(
      `$v(t) = \\int (${tL(a)}) \\, dt = ${tL(free)} + C$. Then $v(${t1}) = ${pAt(free, t1)} + C = ${vt1}$, so $C = ${C}$ and $v(t) = ${tL(v)}$.`,
      `$v(t) = \\int (${tL(a)}) \\, dt = ${tL(free)} + C$。由 $v(${t1}) = ${pAt(free, t1)} + C = ${vt1}$ 得 $C = ${C}$，所以 $v(t) = ${tL(v)}$。`,
    ),
  });
}

/** calculatingVelocityUsingIntegration recovers velocity from acceleration and an initial condition. */
export const calculatingVelocityUsingIntegration: TopicDef = {
  id: "calculating-velocity-using-integration",
  title: t("Calculating Velocity Using Integration", "用积分计算速度"),
  summary: t(
    "Velocity is an antiderivative of acceleration; a known velocity fixes the constant.",
    "速度是加速度的原函数；已知某时刻的速度可确定常数。",
  ),
  prerequisites: ["calculating-acceleration-for-straight-line-motion-using-differentiation", "integrating-rates-of-change"],
  encompasses: [{ topic: "integrating-rates-of-change", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "velocity-at-a-given-time",
      title: t("Velocity at a given time", "求某一时刻的速度"),
      explanation: t(
        "Acceleration is the rate of change of velocity, $a(t) = v'(t)$, so by the net change theorem\n\n$$v(T) = v(0) + \\int_{0}^{T} a(t) \\, dt.$$\n\nFor example, if $a(t) = 6t$ and $v(0) = 2$, then $v(3) = 2 + \\int_{0}^{3} 6t \\, dt = 2 + 27 = 29$ m/s.",
        "加速度是速度的变化率，$a(t) = v'(t)$，由净变化定理\n\n$$v(T) = v(0) + \\int_{0}^{T} a(t) \\, dt。$$\n\n例如 $a(t) = 6t$，$v(0) = 2$，则 $v(3) = 2 + \\int_{0}^{3} 6t \\, dt = 2 + 27 = 29$ 米/秒。",
      ),
      generate: velocityAtATime,
    },
    {
      id: "finding-the-velocity-function",
      title: t("Finding the velocity function", "求速度函数"),
      explanation: t(
        "To find $v(t)$ itself, integrate: $v(t) = \\int a(t) \\, dt$, which includes a constant $C$. A known velocity, such as $v(0)$ or $v(1)$, determines $C$.\n\nFor $a(t) = 2\\cos t$ with $v(0) = 3$: $v(t) = 2\\sin t + C$ and $v(0) = C = 3$, so $v(t) = 2\\sin t + 3$.",
        "要求 $v(t)$ 本身，就对加速度积分：$v(t) = \\int a(t) \\, dt$，其中含常数 $C$。由已知的速度（如 $v(0)$ 或 $v(1)$）确定 $C$。\n\n对 $a(t) = 2\\cos t$、$v(0) = 3$：$v(t) = 2\\sin t + C$，$v(0) = C = 3$，所以 $v(t) = 2\\sin t + 3$。",
      ),
      generate: velocityFunction,
    },
  ],
};

/** restingVelocity is a velocity c(t - p)(t - q) with 0 < p < q, so the particle is first at rest at t = p. */
function restingVelocity(rng: Rng) {
  const p = rng.int(1, 4);
  const q = p + rng.int(1, 4);
  const c = rng.pick([1, 2, 3, -1, -2, -3]);
  const v: Poly = [c * p * q, -c * (p + q), c];
  return { p, q, v, a: pDer(v) };
}

/** firstAtRest integrates an acceleration and finds when the velocity is first zero. */
function firstAtRest(rng: Rng) {
  const { p, q, v, a } = restingVelocity(rng);
  const v0 = v[0] ?? 0;
  return numberProblem({
    prompt: ask(
      t(
        `Its acceleration is $a(t) = ${tL(a)}$ m/s², and $v(0) = ${v0}$ m/s.`,
        `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，且 $v(0) = ${v0}$ 米/秒。`,
      ),
      t("At what time $t > 0$ is the particle first at rest?", "质点在 $t > 0$ 时第一次静止是在什么时刻？"),
    ),
    answer: p,
    unit: "s",
    wrong: [q, Q.of(p + q, 2), p * q],
    solution: t(
      `$v(t) = ${v0} + ${int(0, "t", `(${tL(a).replace(/t/g, "u")})`, "u")} = ${tL(v)} = ${coef(Q.of(v[2] ?? 1))}(t - ${p})(t - ${q})$. It is zero at $t = ${p}$ and $t = ${q}$, so the particle first rests at $t = ${p}$ s.`,
      `$v(t) = ${v0} + ${int(0, "t", `(${tL(a).replace(/t/g, "u")})`, "u")} = ${tL(v)} = ${coef(Q.of(v[2] ?? 1))}(t - ${p})(t - ${q})$。它在 $t = ${p}$ 和 $t = ${q}$ 时为零，所以质点在 $t = ${p}$ 秒第一次静止。`,
    ),
  });
}

/** motions are the four combinations of direction and change in speed. */
const motions: readonly Text[] = [
  t("Moving right and speeding up", "向右运动，且速率在增大"),
  t("Moving right and slowing down", "向右运动，且速率在减小"),
  t("Moving left and speeding up", "向左运动，且速率在增大"),
  t("Moving left and slowing down", "向左运动，且速率在减小"),
];

/** directionAndSpeed integrates an acceleration and classifies the motion at a given time. */
function directionAndSpeed(rng: Rng) {
  for (;;) {
    const v: Poly = [rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-3, 3)];
    const a = pDer(v);
    const T = rng.int(1, 5);
    const [vT, aT] = [pAt(v, T), pAt(a, T)];
    if (vT === 0 || aT === 0) continue;
    const right = vT > 0;
    const faster = vT * aT > 0;
    const i = (right ? 0 : 2) + (faster ? 0 : 1);
    const v0 = v[0] ?? 0;
    return oneOf(
      rng,
      ask(
        t(
          `Its acceleration is $a(t) = ${tL(a)}$ m/s², and $v(0) = ${v0}$ m/s.`,
          `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，且 $v(0) = ${v0}$ 米/秒。`,
        ),
        t(`Describe its motion at $t = ${T}$.`, `描述它在 $t = ${T}$ 时的运动。`),
      ),
      motions[i] ?? motions[0]!,
      motions.filter((_, j) => j !== i),
      t(
        `$v(t) = ${v0} + \\int_{0}^{t} a = ${tL(v)}$, so $v(${T}) = ${vT}$ and $a(${T}) = ${aT}$. The particle moves ${right ? "right" : "left"} because $v(${T}) ${right ? ">" : "<"} 0$, and it is ${faster ? "speeding up because $v$ and $a$ have the same sign" : "slowing down because $v$ and $a$ have opposite signs"}.`,
        `$v(t) = ${v0} + \\int_{0}^{t} a = ${tL(v)}$，所以 $v(${T}) = ${vT}$，$a(${T}) = ${aT}$。因为 $v(${T}) ${right ? ">" : "<"} 0$，质点向${right ? "右" : "左"}运动；又因为 $v$ 与 $a$ ${faster ? "同号，速率在增大" : "异号，速率在减小"}。`,
      ),
    );
  }
}

/** determiningCharacteristicsOfMovingObjectsUsingIntegration uses a velocity found by integration to describe the motion. */
export const determiningCharacteristicsOfMovingObjectsUsingIntegration: TopicDef = {
  id: "determining-characteristics-of-moving-objects-using-integration",
  title: t("Determining Characteristics of Moving Objects Using Integration", "用积分确定运动物体的特征"),
  summary: t(
    "Integrate acceleration to get velocity, then find when the object rests, which way it moves and whether it speeds up.",
    "对加速度积分得到速度，再判断物体何时静止、向哪个方向运动、速率是否增大。",
  ),
  prerequisites: ["calculating-velocity-using-integration"],
  encompasses: [{ topic: "calculating-velocity-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-when-a-particle-is-at-rest",
      title: t("Finding when a particle is at rest", "求质点静止的时刻"),
      explanation: t(
        "A particle is at rest when $v(t) = 0$. Given the acceleration, first recover $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$, then solve $v(t) = 0$. Do not confuse this with $a(t) = 0$, which is where the velocity has a turning point.",
        "质点静止当且仅当 $v(t) = 0$。已知加速度时，先求出 $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$，再解 $v(t) = 0$。不要与 $a(t) = 0$ 混淆，后者是速度的极值点。",
      ),
      generate: firstAtRest,
    },
    {
      id: "direction-and-change-in-speed",
      title: t("Direction and change in speed", "运动方向与速率变化"),
      explanation: t(
        "The sign of $v(t)$ gives the direction: positive means right, negative means left. The particle speeds up when $v$ and $a$ have the same sign and slows down when they have opposite signs.\n\nFor $a(t) = 2t - 6$ and $v(0) = 5$: $v(t) = t^{2} - 6t + 5$. At $t = 2$, $v = -3$ and $a = -2$, so it moves left and speeds up.",
        "$v(t)$ 的符号给出方向：为正向右，为负向左。$v$ 与 $a$ 同号时速率增大，异号时速率减小。\n\n对 $a(t) = 2t - 6$、$v(0) = 5$：$v(t) = t^{2} - 6t + 5$。在 $t = 2$ 时 $v = -3$，$a = -2$，所以质点向左运动且速率增大。",
      ),
      generate: directionAndSpeed,
    },
  ],
};

/** positionFunction integrates a velocity and uses a known position to find the constant. */
function positionFunction(rng: Rng) {
  const s = randomCubic(rng, rng.int(-9, 9));
  const v = pDer(s);
  const t1 = rng.int(0, 2);
  const st1 = pAt(s, t1);
  const free: Poly = [0, ...s.slice(1)];
  return functionProblem({
    prompt: ask(
      t(
        `Its velocity is $v(t) = ${tL(v)}$ m/s, and its position at $t = ${t1}$ is $s(${t1}) = ${st1}$.`,
        `它的速度为 $v(t) = ${tL(v)}$ 米/秒，且 $t = ${t1}$ 时的位置为 $s(${t1}) = ${st1}$。`,
      ),
      t("Find its position $s(t)$.", "求它的位置 $s(t)$。"),
    ),
    answer: tL(s),
    wrong: [tL(free), tL([st1, ...s.slice(1)]), tL(pDer(v))],
    variable: "t",
    solution: t(
      `$s(t) = \\int (${tL(v)}) \\, dt = ${tL(free)} + C$. Then $s(${t1}) = ${pAt(free, t1)} + C = ${st1}$, so $C = ${s[0]}$ and $s(t) = ${tL(s)}$.`,
      `$s(t) = \\int (${tL(v)}) \\, dt = ${tL(free)} + C$。由 $s(${t1}) = ${pAt(free, t1)} + C = ${st1}$ 得 $C = ${s[0]}$，所以 $s(t) = ${tL(s)}$。`,
    ),
  });
}

/** positionFromAcceleration integrates twice to find the position at a given time. */
function positionFromAcceleration(rng: Rng) {
  const s = randomCubic(rng, rng.int(-9, 9));
  const v = pDer(s);
  const a = pDer(v);
  const T = rng.int(1, 4);
  const [s0, v0] = [s[0] ?? 0, v[0] ?? 0];
  const answer = pAt(s, T);
  return numberProblem({
    prompt: ask(
      t(
        `Its acceleration is $a(t) = ${tL(a)}$ m/s², with $v(0) = ${v0}$ m/s and $s(0) = ${s0}$ m.`,
        `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，$v(0) = ${v0}$ 米/秒，$s(0) = ${s0}$ 米。`,
      ),
      t(`Find its position at $t = ${T}$, in meters.`, `求它在 $t = ${T}$ 时的位置（米）。`),
    ),
    answer,
    unit: "m",
    wrong: [answer - s0, answer - v0 * T, pAt(v, T)],
    solution: t(
      `$v(t) = ${v0} + \\int_{0}^{t} a = ${tL(v)}$ and $s(t) = ${s0} + \\int_{0}^{t} v = ${tL(s)}$, so $s(${T}) = ${answer}$ m.`,
      `$v(t) = ${v0} + \\int_{0}^{t} a = ${tL(v)}$，$s(t) = ${s0} + \\int_{0}^{t} v = ${tL(s)}$，所以 $s(${T}) = ${answer}$ 米。`,
    ),
  });
}

/** calculatingThePositionFunctionOfAParticleUsingIntegration recovers position from velocity or acceleration. */
export const calculatingThePositionFunctionOfAParticleUsingIntegration: TopicDef = {
  id: "calculating-the-position-function-of-a-particle-using-integration",
  title: t("Calculating the Position Function of a Particle Using Integration", "用积分计算质点的位置函数"),
  summary: t(
    "Position is an antiderivative of velocity; from acceleration, integrate twice using v(0) and s(0).",
    "位置是速度的原函数；已知加速度时，利用 v(0) 和 s(0) 积分两次。",
  ),
  prerequisites: ["calculating-velocity-using-integration"],
  encompasses: [{ topic: "calculating-velocity-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "position-from-velocity",
      title: t("Position from velocity", "由速度求位置"),
      explanation: t(
        "Since $s'(t) = v(t)$, the position is $s(t) = \\int v(t) \\, dt$, and a known position fixes the constant.\n\nFor $v(t) = 3t^{2} - 4$ with $s(1) = 2$: $s(t) = t^{3} - 4t + C$ and $s(1) = -3 + C = 2$, so $s(t) = t^{3} - 4t + 5$.",
        "因为 $s'(t) = v(t)$，位置为 $s(t) = \\int v(t) \\, dt$，由已知位置确定常数。\n\n对 $v(t) = 3t^{2} - 4$、$s(1) = 2$：$s(t) = t^{3} - 4t + C$，$s(1) = -3 + C = 2$，所以 $s(t) = t^{3} - 4t + 5$。",
      ),
      generate: positionFunction,
    },
    {
      id: "position-from-acceleration",
      title: t("Position from acceleration", "由加速度求位置"),
      explanation: t(
        "Given the acceleration, integrate twice: first $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$, then $s(t) = s(0) + \\int_{0}^{t} v(u) \\, du$. Each integration needs its own initial value.",
        "已知加速度时积分两次：先求 $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$，再求 $s(t) = s(0) + \\int_{0}^{t} v(u) \\, du$。每次积分都需要各自的初始值。",
      ),
      generate: positionFromAcceleration,
    },
  ],
};

/** polynomialDisplacement integrates a polynomial velocity over an interval. */
function polynomialDisplacement(rng: Rng) {
  const s = randomCubic(rng, 0);
  const v = pDer(s);
  const a = rng.int(0, 3);
  const b = a + rng.int(1, 3);
  const answer = intQ(v, a, b);
  return numberProblem({
    prompt: ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find its displacement from $t = ${a}$ to $t = ${b}$, in meters.`, `求它从 $t = ${a}$ 到 $t = ${b}$ 的位移（米）。`),
    ),
    answer,
    unit: "m",
    wrong: [pAt(v, b) - pAt(v, a), pAt(s, b), answer.neg()],
    solution: t(
      `The displacement is $${int(a, b, `(${tL(v)})`, "t")} = ${bracketT(v, a, b)} = ${answer.toLatex()}$ m.`,
      `位移为 $${int(a, b, `(${tL(v)})`, "t")} = ${bracketT(v, a, b)} = ${answer.toLatex()}$ 米。`,
    ),
  });
}

/** combine writes n + qσ for an integer n and a multiple q of a symbol σ. */
function combine(n: number, q: Q, symbol: string) {
  if (q.isZero()) return `${n}`;
  if (n === 0) return times(q, symbol);
  return `${n} ${q.sign() > 0 ? "+" : "-"} ${times(q.abs(), symbol)}`;
}

/** exactDisplacement integrates a trigonometric, exponential or reciprocal velocity exactly. */
function exactDisplacement(rng: Rng) {
  const k = rng.nonZero(-5, 5);
  const c = rng.int(-4, 4);
  const ks = coef(Q.of(k));
  const m = rng.int(2, 6);
  const cases = [
    {
      v: `${ks}\\cos t${plus(c)}`,
      b: "\\frac{\\pi}{2}",
      answer: combine(k, Q.of(c, 2), "\\pi"),
      wrong: [combine(-k, Q.of(c, 2), "\\pi"), `${k}`],
      work: `\\Big[${ks}\\sin t${c === 0 ? "" : ` ${c > 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}t`}\\Big]_{0}^{\\frac{\\pi}{2}}`,
    },
    {
      v: `${ks}\\sin t${plus(c)}`,
      b: "\\pi",
      answer: combine(2 * k, Q.of(c), "\\pi"),
      wrong: [combine(0, Q.of(c), "\\pi"), combine(k, Q.of(c), "\\pi")],
      work: `\\Big[${coef(Q.of(-k))}\\cos t${c === 0 ? "" : ` ${c > 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}t`}\\Big]_{0}^{\\pi}`,
    },
    {
      v: `${ks}e^{t}${plus(c)}`,
      b: `\\ln ${m}`,
      answer: combine(k * (m - 1), Q.of(c), `\\ln ${m}`),
      wrong: [combine(k * m, Q.of(c), `\\ln ${m}`), `${k * (m - 1)}`],
      work: `\\Big[${ks}e^{t}${c === 0 ? "" : ` ${c > 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}t`}\\Big]_{0}^{\\ln ${m}}`,
    },
    {
      v: `\\frac{${Math.abs(k)}}{t + 1}`.replace("\\frac", k < 0 ? "-\\frac" : "\\frac"),
      b: `${m - 1}`,
      answer: times(Q.of(k), `\\ln ${m}`),
      wrong: [times(Q.of(k), `\\ln ${m - 1}`), `${k}`],
      work: `\\Big[${ks}\\ln(t + 1)\\Big]_{0}^{${m - 1}}`,
    },
  ];
  const e = rng.pick(cases);
  return exactProblem(
    ask(
      t(`Its velocity is $v(t) = ${e.v}$ m/s.`, `它的速度为 $v(t) = ${e.v}$ 米/秒。`),
      t(
        `Find its displacement from $t = 0$ to $t = ${e.b}$, in meters. Give an exact answer.`,
        `求它从 $t = 0$ 到 $t = ${e.b}$ 的位移（米），给出精确值。`,
      ),
    ),
    e.answer,
    e.wrong,
    `The displacement is $${int(0, e.b, `\\left(${e.v}\\right)`, "t")} = ${e.work} = ${e.answer}$ m.`,
    `位移为 $${int(0, e.b, `\\left(${e.v}\\right)`, "t")} = ${e.work} = ${e.answer}$ 米。`,
  );
}

/** calculatingTheDisplacementOfAParticleUsingIntegration integrates velocity to find the change in position. */
export const calculatingTheDisplacementOfAParticleUsingIntegration: TopicDef = {
  id: "calculating-the-displacement-of-a-particle-using-integration",
  title: t("Calculating the Displacement of a Particle Using Integration", "用积分计算质点的位移"),
  summary: t(
    "The displacement from t = a to t = b is the integral of the velocity over [a, b].",
    "从 t = a 到 t = b 的位移是速度在 [a, b] 上的积分。",
  ),
  prerequisites: [
    "calculating-the-position-function-of-a-particle-using-integration",
    "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
  ],
  encompasses: [{ topic: "calculating-the-position-function-of-a-particle-using-integration", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "displacement-with-a-polynomial-velocity",
      title: t("Displacement with a polynomial velocity", "速度为多项式时的位移"),
      explanation: t(
        "Displacement is the change in position, $s(b) - s(a)$. Since $s' = v$,\n\n$$s(b) - s(a) = \\int_{a}^{b} v(t) \\, dt.$$\n\nA negative displacement means the particle ends to the left of where it started. For $v(t) = 2t - 4$ on $[0, 3]$: $\\int_{0}^{3} (2t - 4) \\, dt = 9 - 12 = -3$ m.",
        "位移是位置的变化量 $s(b) - s(a)$。因为 $s' = v$，\n\n$$s(b) - s(a) = \\int_{a}^{b} v(t) \\, dt。$$\n\n位移为负说明质点最终位于起点左侧。对 $[0, 3]$ 上的 $v(t) = 2t - 4$：$\\int_{0}^{3} (2t - 4) \\, dt = 9 - 12 = -3$ 米。",
      ),
      generate: polynomialDisplacement,
    },
    {
      id: "displacement-with-other-velocities",
      title: t("Displacement with other velocities", "其他速度函数的位移"),
      explanation: t(
        "The same integral works for any velocity. For $v(t) = 3\\cos t + 2$ from $t = 0$ to $t = \\frac{\\pi}{2}$:\n\n$$\\int_{0}^{\\frac{\\pi}{2}} (3\\cos t + 2) \\, dt = \\Big[3\\sin t + 2t\\Big]_{0}^{\\frac{\\pi}{2}} = 3 + \\pi.$$",
        "对任何速度函数都用同样的积分。对 $v(t) = 3\\cos t + 2$，从 $t = 0$ 到 $t = \\frac{\\pi}{2}$：\n\n$$\\int_{0}^{\\frac{\\pi}{2}} (3\\cos t + 2) \\, dt = \\Big[3\\sin t + 2t\\Big]_{0}^{\\frac{\\pi}{2}} = 3 + \\pi。$$",
      ),
      generate: exactDisplacement,
    },
  ],
};

/** distance adds the absolute values of the integrals of v between consecutive breakpoints. */
function distance(v: Poly, points: readonly number[]) {
  let total = Q.zero;
  for (const [i, x] of points.slice(1).entries()) total = total.add(intQ(v, points[i] ?? 0, x).abs());
  return total;
}

/** linearDistance finds the distance traveled when a linear velocity changes sign once. */
function linearDistance(rng: Rng) {
  const m = rng.nonZero(-4, 4);
  const p = rng.int(1, 4);
  const T = p + rng.int(1, 4);
  const v: Poly = [-m * p, m];
  const answer = distance(v, [0, p, T]);
  const net = intQ(v, 0, T);
  return numberProblem({
    prompt: ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find the total distance it travels from $t = 0$ to $t = ${T}$, in meters.`, `求它从 $t = 0$ 到 $t = ${T}$ 运动的总路程（米）。`),
    ),
    answer,
    unit: "m",
    wrong: [net.abs(), net, Q.of(Math.abs(m) * T * T, 2)],
    solution: t(
      `$v(t) = 0$ at $t = ${p}$, where the particle changes direction. The distance is $\\left|${int(0, p, `(${tL(v)})`, "t")}\\right| + \\left|${int(p, T, `(${tL(v)})`, "t")}\\right| = ${intQ(v, 0, p).abs().toLatex()} + ${intQ(v, p, T).abs().toLatex()} = ${answer.toLatex()}$ m.`,
      `$v(t)$ 在 $t = ${p}$ 时为零，质点在此改变方向。总路程为 $\\left|${int(0, p, `(${tL(v)})`, "t")}\\right| + \\left|${int(p, T, `(${tL(v)})`, "t")}\\right| = ${intQ(v, 0, p).abs().toLatex()} + ${intQ(v, p, T).abs().toLatex()} = ${answer.toLatex()}$ 米。`,
    ),
  });
}

/** quadraticDistance finds the distance traveled when a quadratic velocity may change sign twice. */
function quadraticDistance(rng: Rng) {
  const { p, q, v } = restingVelocity(rng);
  const T = rng.int(p + 1, q + 2);
  const points = [0, ...[p, q].filter((r) => r < T), T];
  const answer = distance(v, points);
  const net = intQ(v, 0, T);
  const pieces = points.slice(1).map((x, i) =>
    intQ(v, points[i] ?? 0, x)
      .abs()
      .toLatex(),
  );
  return numberProblem({
    prompt: ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find the total distance it travels from $t = 0$ to $t = ${T}$, in meters.`, `求它从 $t = 0$ 到 $t = ${T}$ 运动的总路程（米）。`),
    ),
    answer,
    unit: "m",
    wrong: [net.abs(), net, intQ(v, 0, p).abs()],
    solution: t(
      `$v(t) = ${coef(Q.of(v[2] ?? 1))}(t - ${p})(t - ${q})$ changes sign at ${points
        .slice(1, -1)
        .map((x) => `$t = ${x}$`)
        .join(" and ")}. Integrating over each piece and adding absolute values gives $${pieces.join(" + ")} = ${answer.toLatex()}$ m.`,
      `$v(t) = ${coef(Q.of(v[2] ?? 1))}(t - ${p})(t - ${q})$ 在 ${points
        .slice(1, -1)
        .map((x) => `$t = ${x}$`)
        .join(" 和 ")} 处变号。在各段上积分并取绝对值相加，得 $${pieces.join(" + ")} = ${answer.toLatex()}$ 米。`,
    ),
  });
}

/** calculatingTheTotalDistanceTraveledByAParticle integrates the speed |v(t)|. */
export const calculatingTheTotalDistanceTraveledByAParticle: TopicDef = {
  id: "calculating-the-total-distance-traveled-by-a-particle",
  title: t("Calculating the Total Distance Traveled by a Particle", "计算质点运动的总路程"),
  summary: t(
    "The total distance is the integral of the speed |v(t)|: split the interval where v changes sign.",
    "总路程是速率 |v(t)| 的积分：在 v 变号处把区间分开。",
  ),
  prerequisites: [
    "calculating-the-displacement-of-a-particle-using-integration",
    "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
  ],
  encompasses: [{ topic: "calculating-the-displacement-of-a-particle-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "distance-with-one-change-of-direction",
      title: t("Distance with one change of direction", "改变一次方向时的路程"),
      explanation: t(
        "Displacement can cancel: moving $4$ m right and then $4$ m left gives displacement $0$ but distance $8$ m. The total distance is $\\int_{a}^{b} |v(t)| \\, dt$. To evaluate it, find where $v(t) = 0$, integrate over each piece, and add the absolute values.\n\nFor $v(t) = 2t - 4$ on $[0, 3]$: $\\left|\\int_{0}^{2} (2t - 4) \\, dt\\right| + \\left|\\int_{2}^{3} (2t - 4) \\, dt\\right| = 4 + 1 = 5$ m.",
        "位移可以相互抵消：先向右 $4$ 米再向左 $4$ 米，位移为 $0$，路程却是 $8$ 米。总路程为 $\\int_{a}^{b} |v(t)| \\, dt$。计算时先找出 $v(t) = 0$ 的点，在各段上积分，再把绝对值相加。\n\n对 $[0, 3]$ 上的 $v(t) = 2t - 4$：$\\left|\\int_{0}^{2} (2t - 4) \\, dt\\right| + \\left|\\int_{2}^{3} (2t - 4) \\, dt\\right| = 4 + 1 = 5$ 米。",
      ),
      generate: linearDistance,
    },
    {
      id: "distance-with-several-changes-of-direction",
      title: t("Distance with several changes of direction", "多次改变方向时的路程"),
      explanation: t(
        "A quadratic velocity can change sign twice. Factor $v(t)$, keep the zeros that lie inside the interval, and split the integral there. Only zeros where $v$ actually changes sign matter.",
        "二次速度函数可能变号两次。把 $v(t)$ 因式分解，保留落在区间内的零点，在这些点处拆分积分。只有使 $v$ 真正变号的零点才需要考虑。",
      ),
      generate: quadraticDistance,
    },
  ],
};

/** averageVelocity divides the displacement by the elapsed time. */
function averageVelocity(rng: Rng) {
  const s = randomCubic(rng, 0);
  const v = pDer(s);
  const a = rng.int(0, 3);
  const b = a + rng.int(1, 4);
  const net = intQ(v, a, b);
  const answer = net.div(Q.of(b - a));
  return numberProblem({
    prompt: ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find its average velocity from $t = ${a}$ to $t = ${b}$, in m/s.`, `求它从 $t = ${a}$ 到 $t = ${b}$ 的平均速度（米/秒）。`),
    ),
    answer,
    unit: "m/s",
    wrong: [net, Q.of(pAt(v, a) + pAt(v, b), 2), Q.of(pAt(v, b) - pAt(v, a), b - a)],
    solution: t(
      `The average velocity is $\\frac{1}{${b} - ${a}}${int(a, b, `(${tL(v)})`, "t")} = \\frac{${net.toLatex()}}{${b - a}} = ${answer.toLatex()}$ m/s.`,
      `平均速度为 $\\frac{1}{${b} - ${a}}${int(a, b, `(${tL(v)})`, "t")} = \\frac{${net.toLatex()}}{${b - a}} = ${answer.toLatex()}$ 米/秒。`,
    ),
  });
}

/** averagePositionOrAcceleration averages a position function, or an acceleration given as the derivative of a velocity. */
function averagePositionOrAcceleration(rng: Rng) {
  const a = rng.int(0, 3);
  const b = a + rng.int(1, 4);
  if (rng.bool()) {
    const s = randomCubic(rng, rng.int(-6, 6));
    const total = intQ(s, a, b);
    const answer = total.div(Q.of(b - a));
    return numberProblem({
      prompt: ask(
        t(`Its position is $s(t) = ${tL(s)}$.`, `它的位置为 $s(t) = ${tL(s)}$。`),
        t(`Find its average position from $t = ${a}$ to $t = ${b}$, in meters.`, `求它从 $t = ${a}$ 到 $t = ${b}$ 的平均位置（米）。`),
      ),
      answer,
      unit: "m",
      wrong: [Q.of(pAt(s, b) - pAt(s, a), b - a), total, Q.of(pAt(s, a) + pAt(s, b), 2)],
      solution: t(
        `The average position is $\\frac{1}{${b - a}}${int(a, b, `(${tL(s)})`, "t")} = \\frac{1}{${b - a}}${bracketT(s, a, b)} = ${answer.toLatex()}$ m.`,
        `平均位置为 $\\frac{1}{${b - a}}${int(a, b, `(${tL(s)})`, "t")} = \\frac{1}{${b - a}}${bracketT(s, a, b)} = ${answer.toLatex()}$ 米。`,
      ),
    });
  }
  const v: Poly = [rng.int(-8, 8), rng.int(-6, 6), rng.nonZero(-3, 3), rng.int(-1, 1)];
  const acc = pDer(v);
  const answer = Q.of(pAt(v, b) - pAt(v, a), b - a);
  return numberProblem({
    prompt: ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(
        `Find its average acceleration from $t = ${a}$ to $t = ${b}$, in m/s².`,
        `求它从 $t = ${a}$ 到 $t = ${b}$ 的平均加速度（米/秒²）。`,
      ),
    ),
    answer,
    unit: "m/s²",
    wrong: [intQ(v, a, b).div(Q.of(b - a)), Q.of(pAt(acc, a) + pAt(acc, b), 2), Q.of(pAt(v, b) - pAt(v, a))],
    solution: t(
      `The average acceleration is $\\frac{1}{${b - a}}${int(a, b, "a(t)", "t")} = \\frac{v(${b}) - v(${a})}{${b - a}} = \\frac{${pAt(v, b)} - ${pAt(v, a) < 0 ? `(${pAt(v, a)})` : pAt(v, a)}}{${b - a}} = ${answer.toLatex()}$ m/s².`,
      `平均加速度为 $\\frac{1}{${b - a}}${int(a, b, "a(t)", "t")} = \\frac{v(${b}) - v(${a})}{${b - a}} = \\frac{${pAt(v, b)} - ${pAt(v, a) < 0 ? `(${pAt(v, a)})` : pAt(v, a)}}{${b - a}} = ${answer.toLatex()}$ 米/秒²。`,
    ),
  });
}

/** averagePositionVelocityAndAcceleration applies the average value of a function to motion. */
export const averagePositionVelocityAndAcceleration: TopicDef = {
  id: "average-position-velocity-and-acceleration",
  title: t("Average Position, Velocity, and Acceleration", "平均位置、平均速度与平均加速度"),
  summary: t(
    "The average of s, v or a over [a, b] is its integral divided by b - a.",
    "s、v 或 a 在 [a, b] 上的平均值是其积分除以 b - a。",
  ),
  prerequisites: ["the-average-value-of-a-function", "calculating-the-displacement-of-a-particle-using-integration"],
  encompasses: [{ topic: "the-average-value-of-a-function", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "average-velocity",
      title: t("Average velocity", "平均速度"),
      explanation: t(
        "The average value of $v$ on $[a, b]$ is\n\n$$\\frac{1}{b - a}\\int_{a}^{b} v(t) \\, dt = \\frac{s(b) - s(a)}{b - a},$$\n\nthe displacement divided by the elapsed time. It is generally not the average of $v(a)$ and $v(b)$.",
        "$v$ 在 $[a, b]$ 上的平均值为\n\n$$\\frac{1}{b - a}\\int_{a}^{b} v(t) \\, dt = \\frac{s(b) - s(a)}{b - a}，$$\n\n即位移除以经过的时间。它一般不等于 $v(a)$ 与 $v(b)$ 的平均。",
      ),
      generate: averageVelocity,
    },
    {
      id: "average-position-and-acceleration",
      title: t("Average position and acceleration", "平均位置与平均加速度"),
      explanation: t(
        "The average position is $\\frac{1}{b - a}\\int_{a}^{b} s(t) \\, dt$, which needs an antiderivative of $s$. The average acceleration is $\\frac{1}{b - a}\\int_{a}^{b} a(t) \\, dt = \\frac{v(b) - v(a)}{b - a}$, because $v$ is an antiderivative of $a$.",
        "平均位置为 $\\frac{1}{b - a}\\int_{a}^{b} s(t) \\, dt$，需要求 $s$ 的原函数。平均加速度为 $\\frac{1}{b - a}\\int_{a}^{b} a(t) \\, dt = \\frac{v(b) - v(a)}{b - a}$，因为 $v$ 是 $a$ 的原函数。",
      ),
      generate: averagePositionOrAcceleration,
    },
  ],
};

/** calculusIIMotionTopics are the topics of Calculus II module 2.12. */
export const calculusIIMotionTopics: readonly TopicDef[] = [
  calculatingVelocityUsingIntegration,
  determiningCharacteristicsOfMovingObjectsUsingIntegration,
  calculatingThePositionFunctionOfAParticleUsingIntegration,
  calculatingTheDisplacementOfAParticleUsingIntegration,
  calculatingTheTotalDistanceTraveledByAParticle,
  averagePositionVelocityAndAcceleration,
];
