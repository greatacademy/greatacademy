// The rest of a first course in Partial Differential Equations: conservation laws, Sturm-Liouville problems,
// transforms, sources, Green's functions, images, higher dimensions, special functions, and numerical stability.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { type Pair, point, same, topic } from "../university-kit.ts";
import { chosen, lesson, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

/** wrap puts a negative number in parentheses, so that it can follow an operation sign. */
const wrap = (n: number): string => (n < 0 ? `(${n})` : `${n}`);

/** pq writes a fraction, in parentheses when it is negative, so that it can follow an operation sign. */
const pq = (q: Q): string => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** piOver writes p pi over q in lowest terms, leaving out a coefficient or a denominator of one. */
const piOver = (p: number, q: number): string => {
  const r = Q.of(p, q);
  const top = r.n === 1n ? "\\pi" : `${r.n}\\pi`;
  return r.d === 1n ? top : `\\frac{${top}}{${r.d}}`;
};

/** settle writes p over q, followed by its value in lowest terms when that reads differently. */
const settle = (p: number, q: number, value: Q): string => {
  const raw = p < 0 ? `-\\frac{${-p}}{${q}}` : `\\frac{${p}}{${q}}`;
  return raw === value.toLatex() ? raw : `${raw} = ${value.toLatex()}`;
};

/** plus writes a signed number as a term that follows another, as in "+ 3" or "- 3". */
const plus = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

const conservationLaws = topic(
  "conservation-laws-and-traffic-flow",
  ["Conservation Laws and Traffic Flow", "守恒律和交通流"],
  ["Write a density equation from a flux, and read wave and shock speeds from it.", "由通量写出密度方程，并从中读出波速和激波速度。"],
  ["nonlinear-transport-and-shocks"],
  [],
  [
    point(
      "the-change-in-total-mass",
      ["The change in total mass", "总质量的变化"],
      [
        "A conservation law $u_t + q_x = 0$ says that the amount in a stretch of road changes only through its ends. So the rate of change of the total is the flux in at the left minus the flux out at the right. For example, a section holding $100$ cars, with $12$ cars a minute entering and $8$ leaving, gains $12 - 8 = 4$ cars a minute, so after $5$ minutes it holds $100 + 4 \\cdot 5 = 120$.\n\nCheck: in $5$ minutes $60$ cars enter and $40$ leave, and $100 + 60 - 40 = 120$.\n\n> **Watch out.** The total changes at the rate in minus out; the cars that leave are subtracted, not added.",
        "守恒律 $u_t + q_x = 0$ 说明一段路上的总量只通过两端变化。所以总量的变化率是左端流入的通量减去右端流出的通量。例如，一段路上有 $100$ 辆车，每分钟进入 $12$ 辆、离开 $8$ 辆，每分钟增加 $12 - 8 = 4$ 辆，所以 $5$ 分钟后有 $100 + 4 \\cdot 5 = 120$ 辆。\n\n检验：$5$ 分钟内进入 $60$ 辆、离开 $40$ 辆，而 $100 + 60 - 40 = 120$。\n\n> **注意。** 总量的变化率是流入减流出；离开的车要减去，而不是加上。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 40);
          const b = rng.int(1, 40);
          const t = rng.int(2, 9);
          const start = rng.int(50, 200);
          if (a === b) return undefined;
          const answer = start + (a - b) * t;
          if (answer < 0) return undefined;
          const misses: Miss[] = [
            [
              start + (b - a) * t,
              "That swaps in and out; the cars that enter add to the total.",
              "那把流入和流出弄反了；进入的车使总量增加。",
            ],
            [start + a * t, "That forgets the cars that leave.", "那忘了离开的车。"],
            [start + (a + b) * t, "That adds the cars that leave; they are subtracted.", "那把离开的车加上了；它们应该减去。"],
            [(a - b) * t, "That is only the change; add the starting number of cars.", "那只是变化量；还要加上原有的车数。"],
          ];
          return worked(
            [
              `A road section holds ${start} cars. Cars enter at the rate ${a} per minute and leave at the rate ${b} per minute. How many cars does it hold after ${t} minutes?`,
              `一段路上有 ${start} 辆车。车以每分钟 ${a} 辆的速率进入，以每分钟 ${b} 辆的速率离开。${t} 分钟后这段路上有多少辆车？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the net rate", "求净变化率"],
                [
                  `The total changes at the rate in minus out, $${a} - ${b} = ${a - b}$ cars per minute.`,
                  `总量的变化率是流入减流出，每分钟 $${a} - ${b} = ${a - b}$ 辆。`,
                ],
              ],
              [
                ["Add the change", "加上变化量"],
                [
                  `After ${t} minutes it holds $${start} + ${wrap(a - b)} \\cdot ${t} = ${answer}$.`,
                  `${t} 分钟后有 $${start} + ${wrap(a - b)} \\cdot ${t} = ${answer}$ 辆。`,
                ],
              ],
            ],
            [
              `In ${t} minutes $${a * t}$ cars enter and $${b * t}$ leave, and $${start} + ${a * t} - ${b * t} = ${answer}$.`,
              `${t} 分钟内进入 $${a * t}$ 辆、离开 $${b * t}$ 辆，而 $${start} + ${a * t} - ${b * t} = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "the-speed-of-a-small-wave",
      ["The speed of a small wave", "小波的速度"],
      [
        "With flux $q(u)$ the equation becomes $u_t + q'(u) u_x = 0$, so density values travel at the speed $q'(u)$. In the traffic model $q = u(1 - u)$, this wave speed is different from the speed of the cars. For example, with $q = 10u(1 - u)$ we get $q'(u) = 10(1 - 2u)$, so at the density $u = \\frac{1}{5}$ the wave speed is $10 \\cdot \\frac{3}{5} = 6$, while the cars move at $\\frac{q}{u} = 10(1 - u) = 8$.\n\nCheck: $q'(u) = 10(1 - u) - 10u$, and $8 - 2 = 6$: the wave is slower than the cars by $10u = 2$.\n\n> **Watch out.** The wave speed is the derivative $q'(u)$, not the car speed $\\frac{q}{u}$ and not the flux $q$ itself.",
        "通量为 $q(u)$ 时方程变成 $u_t + q'(u) u_x = 0$，所以密度值以速度 $q'(u)$ 传播。在交通模型 $q = u(1 - u)$ 中，这个波速与车速不同。例如，$q = 10u(1 - u)$ 时 $q'(u) = 10(1 - 2u)$，所以在密度 $u = \\frac{1}{5}$ 处波速是 $10 \\cdot \\frac{3}{5} = 6$，而车速是 $\\frac{q}{u} = 10(1 - u) = 8$。\n\n检验：$q'(u) = 10(1 - u) - 10u$，而 $8 - 2 = 6$：波比车慢 $10u = 2$。\n\n> **注意。** 波速是导数 $q'(u)$，不是车速 $\\frac{q}{u}$，也不是通量 $q$ 本身。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(3, 20);
          const v = rng.int(2, 25);
          const a = rng.int(1, b - 1);
          const u = Q.of(a, b);
          const answer = Q.of(v * (b - 2 * a), b);
          const car = Q.of(v * (b - a), b);
          const vu = Q.of(v * a, b);
          const misses: Miss[] = [
            [car, "That is the speed of the cars, $v(1 - u)$; the wave moves at $q'(u)$.", "那是车速 $v(1 - u)$；波以 $q'(u)$ 运动。"],
            [Q.of(v * a * (b - a), b * b), "That is the flux $q(u)$ itself, not its derivative.", "那是通量 $q(u)$ 本身，不是它的导数。"],
            [Q.of(b - 2 * a, b), `That drops the factor $${v}$ of the flux.`, `那漏掉了通量的因子 $${v}$。`],
            [answer.neg(), "That has the sign wrong: the factor is $1 - 2u$.", "那把符号弄反了：因子是 $1 - 2u$。"],
          ];
          return worked(
            [
              `With $q(u) = ${v}u(1 - u)$, what is the wave speed at the density $u = ${u.toLatex()}$?`,
              `当 $q(u) = ${v}u(1 - u)$ 时，密度 $u = ${u.toLatex()}$ 处的波速是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Differentiate the flux", "对通量求导"],
                [`$q'(u) = ${v}(1 - 2u)$.`, `$q'(u) = ${v}(1 - 2u)$。`],
              ],
              [
                ["Put in the density", "代入密度"],
                [
                  `$${v}\\left(1 - 2 \\cdot ${u.toLatex()}\\right) = ${v} \\cdot ${pq(Q.of(b - 2 * a, b))} = ${answer.toLatex()}$.`,
                  `$${v}\\left(1 - 2 \\cdot ${u.toLatex()}\\right) = ${v} \\cdot ${pq(Q.of(b - 2 * a, b))} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Split $q'(u) = ${v}(1 - u) - ${v}u$: the cars move at $${car.toLatex()}$, and $${car.toLatex()} - ${vu.toLatex()} = ${answer.toLatex()}$.`,
              `拆成 $q'(u) = ${v}(1 - u) - ${v}u$：车速是 $${car.toLatex()}$，而 $${car.toLatex()} - ${vu.toLatex()} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "the-rankine-hugoniot-speed",
      ["The Rankine-Hugoniot speed", "兰金-于戈尼奥速度"],
      [
        "A shock joining two densities moves at the jump in flux divided by the jump in density. This rule follows from conservation, and for the traffic model it simplifies to a formula using the sum of the two densities. For example, with $q = 4u(1 - u)$, a shock from $u_L = \\frac{1}{4}$ to $u_R = \\frac{1}{2}$ moves at $4\\left(1 - \\frac{1}{4} - \\frac{1}{2}\\right) = 1$.\n\nCheck: $q\\left(\\frac{1}{4}\\right) = \\frac{3}{4}$ and $q\\left(\\frac{1}{2}\\right) = 1$, so the flux jumps by $\\frac{1}{4}$ while the density jumps by $\\frac{1}{4}$, and $\\frac{1}{4} \\div \\frac{1}{4} = 1$.\n\n> **Watch out.** Divide the jump in flux by the jump in density; the wave speed $q'(u)$ on either side is not the shock speed.",
        "连接两个密度的激波以通量的跃变除以密度的跃变的速度运动。这个规则来自守恒，在交通模型中它化简为用两个密度之和表示的公式。例如，$q = 4u(1 - u)$ 时，从 $u_L = \\frac{1}{4}$ 到 $u_R = \\frac{1}{2}$ 的激波以 $4\\left(1 - \\frac{1}{4} - \\frac{1}{2}\\right) = 1$ 运动。\n\n检验：$q\\left(\\frac{1}{4}\\right) = \\frac{3}{4}$，$q\\left(\\frac{1}{2}\\right) = 1$，所以通量跃变 $\\frac{1}{4}$，密度跃变 $\\frac{1}{4}$，而 $\\frac{1}{4} \\div \\frac{1}{4} = 1$。\n\n> **注意。** 要用通量的跃变除以密度的跃变；任一侧的波速 $q'(u)$ 都不是激波速度。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(4, 20);
          const l = rng.int(1, b - 2);
          const r = rng.int(l + 1, b - 1);
          const v = rng.int(2, 12);
          const uL = Q.of(l, b);
          const uR = Q.of(r, b);
          const answer = Q.of(v * (b - l - r), b);
          const qL = Q.of(v * l * (b - l), b * b);
          const qR = Q.of(v * r * (b - r), b * b);
          const misses: Miss[] = [
            [
              Q.of(v * (b - 2 * l), b),
              "That is the wave speed $q'(u_L)$ on the left, not the shock speed.",
              "那是左侧的波速 $q'(u_L)$，不是激波速度。",
            ],
            [
              Q.of(v * (b - 2 * r), b),
              "That is the wave speed $q'(u_R)$ on the right, not the shock speed.",
              "那是右侧的波速 $q'(u_R)$，不是激波速度。",
            ],
            [
              Q.of(v * (r - l), b),
              "That multiplies the jump in density by $v$; divide the jump in flux by it instead.",
              "那用 $v$ 乘密度的跃变；应该用通量的跃变除以它。",
            ],
            [
              Q.of(v * (l + r), b),
              "That leaves out the $1$: the speed is $v(1 - u_L - u_R)$.",
              "那漏掉了 $1$：速度是 $v(1 - u_L - u_R)$。",
            ],
          ];
          return worked(
            [
              `With $q(u) = ${v}u(1 - u)$, a shock joins $u_L = ${uL.toLatex()}$ to $u_R = ${uR.toLatex()}$. What is its speed?`,
              `当 $q(u) = ${v}u(1 - u)$ 时，激波连接 $u_L = ${uL.toLatex()}$ 和 $u_R = ${uR.toLatex()}$。它的速度是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Simplify the jump formula", "化简跃变公式"],
                [
                  `For this flux, $\\frac{q(u_R) - q(u_L)}{u_R - u_L} = ${v}(1 - u_L - u_R)$.`,
                  `对这个通量，$\\frac{q(u_R) - q(u_L)}{u_R - u_L} = ${v}(1 - u_L - u_R)$。`,
                ],
              ],
              [
                ["Put in the densities", "代入密度"],
                [
                  `$${v}\\left(1 - ${uL.toLatex()} - ${uR.toLatex()}\\right) = ${answer.toLatex()}$.`,
                  `$${v}\\left(1 - ${uL.toLatex()} - ${uR.toLatex()}\\right) = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Directly, $q(u_L) = ${qL.toLatex()}$ and $q(u_R) = ${qR.toLatex()}$, and $\\left(${qR.toLatex()} - ${qL.toLatex()}\\right) \\div \\left(${uR.toLatex()} - ${uL.toLatex()}\\right) = ${answer.toLatex()}$.`,
              `直接计算，$q(u_L) = ${qL.toLatex()}$，$q(u_R) = ${qR.toLatex()}$，而 $\\left(${qR.toLatex()} - ${qL.toLatex()}\\right) \\div \\left(${uR.toLatex()} - ${uL.toLatex()}\\right) = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

const burgers = topic(
  "burgers-equation-and-rarefaction-waves",
  ["Burgers' Equation and Rarefaction Waves", "伯格斯方程和稀疏波"],
  ["Tell a shock from a rarefaction, and find when a smooth solution breaks.", "区分激波和稀疏波，并求光滑解何时破裂。"],
  ["conservation-laws-and-traffic-flow"],
  [],
  [
    point(
      "the-breaking-time",
      ["The breaking time", "破裂时间"],
      [
        "Characteristics of $u_t + uu_x = 0$ are straight lines with speed $f(x_0)$. Where $f$ decreases they converge, and the first crossing happens at the time $-\\frac{1}{\\min f'}$, when the solution stops being smooth. For example, $u(x, 0) = 5 - 2x$ has slope $-2$ everywhere, so the solution breaks at $t = -\\frac{1}{-2} = \\frac{1}{2}$.\n\nCheck: the line from $x_0$ is $x = x_0 + (5 - 2x_0)t$, and at $t = \\frac{1}{2}$ this is $\\frac{5}{2}$ for every $x_0$, so all the lines meet at once.\n\n> **Watch out.** The time is $-\\frac{1}{\\min f'}$, which is positive; it is not the slope itself, nor the place where the lines meet.",
        "$u_t + uu_x = 0$ 的特征线是速度为 $f(x_0)$ 的直线。在 $f$ 递减的地方它们会聚，第一次相交发生在时间 $-\\frac{1}{\\min f'}$，这时解不再光滑。例如，$u(x, 0) = 5 - 2x$ 的斜率处处是 $-2$，所以解在 $t = -\\frac{1}{-2} = \\frac{1}{2}$ 破裂。\n\n检验：从 $x_0$ 出发的线是 $x = x_0 + (5 - 2x_0)t$，在 $t = \\frac{1}{2}$ 时对每个 $x_0$ 都等于 $\\frac{5}{2}$，所以所有的线同时相遇。\n\n> **注意。** 时间是 $-\\frac{1}{\\min f'}$，它是正的；它不是斜率本身，也不是线相遇的位置。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 30);
          const b = rng.int(2, 30);
          const answer = Q.of(1, a);
          const misses: Miss[] = [
            [a, "That is the size of the slope; the time is its reciprocal.", "那是斜率的大小；时间是它的倒数。"],
            [Q.of(b, a), "That is where the lines meet, not when.", "那是线相遇的位置，不是时间。"],
            [Q.of(-1, a), "That keeps the wrong sign: $-\\frac{1}{\\min f'}$ is positive.", "那符号错了：$-\\frac{1}{\\min f'}$ 是正的。"],
            [Q.of(1, a + b), "That adds the constant to the slope; only the slope matters.", "那把常数加到了斜率上；只有斜率起作用。"],
          ];
          return worked(
            [
              `For Burgers' equation with $u(x, 0) = ${b} - ${a}x$, when does the solution first break?`,
              `对伯格斯方程，$u(x, 0) = ${b} - ${a}x$，解什么时候第一次破裂？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the smallest slope", "求最小斜率"],
                [
                  `The slope of the data is $-${a}$ everywhere, so $\\min f' = -${a}$.`,
                  `数据的斜率处处是 $-${a}$，所以 $\\min f' = -${a}$。`,
                ],
              ],
              [
                ["Take the time", "求时间"],
                [`$t = -\\frac{1}{-${a}} = ${answer.toLatex()}$.`, `$t = -\\frac{1}{-${a}} = ${answer.toLatex()}$。`],
              ],
            ],
            [
              `The line from $x_0$ is $x = x_0 + (${b} - ${a}x_0)t$, and at $t = ${answer.toLatex()}$ this is $${Q.of(b, a).toLatex()}$ for every $x_0$, so all the lines meet at once.`,
              `从 $x_0$ 出发的线是 $x = x_0 + (${b} - ${a}x_0)t$，在 $t = ${answer.toLatex()}$ 时对每个 $x_0$ 都等于 $${Q.of(b, a).toLatex()}$，所以所有的线同时相遇。`,
            ],
          );
        }),
    ),
    point(
      "shock-or-rarefaction",
      ["Shock or rarefaction", "激波还是稀疏波"],
      [
        "For Burgers' equation a jump from a high value on the left to a low value on the right makes characteristics collide, which forms a shock. The opposite jump makes them spread apart, which leaves a fan called a rarefaction. For example, data $4$ on the left and $2$ on the right give a shock moving at the average $3$, while data $2$ on the left and $4$ on the right give the fan $u = \\frac{x}{t}$ for $2t < x < 4t$.\n\nCheck: the shock speed $3$ lies between $4$ and $2$, so the characteristics on both sides run into the shock, as they must.\n\n> **Watch out.** A shock needs the larger value on the left; with the larger value on the right no shock forms at all.",
        "对伯格斯方程，从左边的高值跳到右边的低值使特征线相撞，形成激波。相反的跳跃使它们散开，留下一个称为稀疏波的扇形。例如，左边 $4$、右边 $2$ 的数据形成以平均值 $3$ 运动的激波；左边 $2$、右边 $4$ 的数据形成扇形 $u = \\frac{x}{t}$，$2t < x < 4t$。\n\n检验：激波速度 $3$ 在 $4$ 和 $2$ 之间，所以两侧的特征线都撞进激波，理应如此。\n\n> **注意。** 激波要求左边的值更大；右边的值更大时根本不形成激波。",
      ],
      (rng) => {
        const a = rng.int(-20, 20);
        const d0 = rng.int(1, 20);
        const d = 2 * a + d0 === 0 ? d0 + 1 : d0;
        const shock = rng.bool();
        const [l, r] = shock ? [a + d, a] : [a, a + d];
        const average = Q.of(l + r, 2).toLatex();
        const s: Pair = [`A shock moving at speed $${average}$`, `以速度 $${average}$ 运动的激波`];
        const fan: Pair = [`A rarefaction fan between speeds ${l} and ${r}`, `速度在 ${l} 和 ${r} 之间的稀疏扇形`];
        const swapped: Pair = [
          `A shock moving at speed $${Q.of(l + r + 2, 2).toLatex()}$`,
          `以速度 $${Q.of(l + r + 2, 2).toLatex()}$ 运动的激波`,
        ];
        const still: Pair = [`A jump that stays at $x = 0$`, `停留在 $x = 0$ 的跳跃`];
        const slips: Slip[] = shock
          ? [
              [
                fan,
                "A fan needs the larger value on the right; here the left is larger, so the lines collide.",
                "扇形要求右边的值更大；这里左边更大，所以特征线相撞。",
              ],
              [
                swapped,
                `That speed is not the average; the shock moves at $\\frac{${l} + ${wrap(r)}}{2}$.`,
                `那个速度不是平均值；激波以 $\\frac{${l} + ${wrap(r)}}{2}$ 运动。`,
              ],
              [
                still,
                "A jump stays put only when the two sides average to $0$; here they do not.",
                "只有两侧的平均值为 $0$ 时跳跃才不动；这里不是。",
              ],
            ]
          : [
              [
                s,
                "A shock forms only when the left value is larger; here the lines spread apart.",
                "只有左边的值更大时才形成激波；这里特征线散开。",
              ],
              [swapped, "No shock forms here at all: the larger value is on the right.", "这里根本不形成激波：较大的值在右边。"],
              [still, "The jump does not stay sharp: the lines spread apart and fill a fan.", "跳跃不会保持：特征线散开，填满一个扇形。"],
            ];
        return chosen(
          rng,
          [
            `For Burgers' equation, the data jumps from ${l} on the left of 0 to ${r} on the right. What forms?`,
            `对伯格斯方程，数据在 0 的左边是 ${l}，右边跳到 ${r}。会形成什么？`,
          ],
          shock ? s : fan,
          slips,
          [
            [
              ["Compare the sides", "比较两侧"],
              shock
                ? [
                    `The left value ${l} is larger than the right value ${r}, so the characteristics collide.`,
                    `左边的值 ${l} 大于右边的值 ${r}，所以特征线相撞。`,
                  ]
                : [
                    `The right value ${r} is larger than the left value ${l}, so the characteristics spread apart.`,
                    `右边的值 ${r} 大于左边的值 ${l}，所以特征线散开。`,
                  ],
            ],
            [
              ["Name what forms", "说出形成什么"],
              shock
                ? [`A shock forms, moving at the average $${average}$.`, `形成激波，以平均值 $${average}$ 运动。`]
                : [
                    `A rarefaction fan $u = \\frac{x}{t}$ fills $${l}t < x < ${r}t$.`,
                    `稀疏扇形 $u = \\frac{x}{t}$ 填满 $${l}t < x < ${r}t$。`,
                  ],
            ],
          ],
          shock
            ? [
                `The speed $${average}$ lies between ${r} and ${l}, so the characteristics on both sides run into the shock.`,
                `速度 $${average}$ 在 ${r} 和 ${l} 之间，所以两侧的特征线都撞进激波。`,
              ]
            : [
                `At the edges of the fan $\\frac{x}{t}$ equals ${l} and ${r}, so the fan joins the two states without a jump.`,
                `在扇形的边缘 $\\frac{x}{t}$ 等于 ${l} 和 ${r}，所以扇形无跳跃地连接两个状态。`,
              ],
        );
      },
    ),
    point(
      "a-value-inside-the-fan",
      ["A value inside the fan", "扇形内的值"],
      [
        "Inside a rarefaction centered at the origin, the solution of Burgers' equation is $u = \\frac{x}{t}$. Each ray from the origin carries its own constant value, and the fan fills the gap between the two states. For example, with data $1$ for $x < 0$ and $5$ for $x > 0$, the fan at $t = 2$ covers $2 < x < 10$, so at $x = 6$ the value is $\\frac{6}{2} = 3$.\n\nCheck: the ray $x = 3t$ from the origin carries the value $3$, and it passes through $x = 6$ at $t = 2$.\n\n> **Watch out.** Outside the fan, where $\\frac{x}{t}$ is below the left state or above the right state, the value is that constant state, not $\\frac{x}{t}$.",
        "在以原点为中心的稀疏波内部，伯格斯方程的解是 $u = \\frac{x}{t}$。从原点出发的每条射线携带自己的常数值，扇形填满两个状态之间的空隙。例如，$x < 0$ 时数据为 $1$，$x > 0$ 时为 $5$，$t = 2$ 时扇形覆盖 $2 < x < 10$，所以 $x = 6$ 处的值是 $\\frac{6}{2} = 3$。\n\n检验：从原点出发的射线 $x = 3t$ 携带值 $3$，它在 $t = 2$ 时经过 $x = 6$。\n\n> **注意。** 在扇形之外，即 $\\frac{x}{t}$ 小于左状态或大于右状态的地方，值是那个常数状态，而不是 $\\frac{x}{t}$。",
      ],
      (rng) =>
        until(() => {
          const l = rng.int(-9, 5);
          const r = l + rng.int(3, 15);
          const t = rng.int(2, 12);
          const x = rng.int(-15, 40);
          const v = Q.of(x, t);
          const left = x < l * t;
          const right = x > r * t;
          const answer = left ? Q.of(l) : right ? Q.of(r) : v;
          const misses: Miss[] = left
            ? [
                [v, "That uses the fan formula outside the fan.", "那在扇形之外用了扇形公式。"],
                [r, "That is the state on the right; the point lies to the left of the fan.", "那是右侧的状态；这个点在扇形左边。"],
                [Q.of(l + r, 2), "That averages the two states.", "那对两个状态取了平均。"],
              ]
            : right
              ? [
                  [v, "That uses the fan formula outside the fan.", "那在扇形之外用了扇形公式。"],
                  [l, "That is the state on the left; the point lies to the right of the fan.", "那是左侧的状态；这个点在扇形右边。"],
                  [Q.of(l + r, 2), "That averages the two states.", "那对两个状态取了平均。"],
                ]
              : [
                  [
                    Q.of(l + r, 2),
                    "That averages the two states; inside the fan $u = \\frac{x}{t}$.",
                    "那对两个状态取了平均；扇形内 $u = \\frac{x}{t}$。",
                  ],
                  [l, "That is the state on the left; the point lies inside the fan.", "那是左侧的状态；这个点在扇形内。"],
                  [r, "That is the state on the right; the point lies inside the fan.", "那是右侧的状态；这个点在扇形内。"],
                  [Q.of(t, x === 0 ? 1 : x), "That divides the wrong way: $u = \\frac{x}{t}$.", "那除反了：$u = \\frac{x}{t}$。"],
                ];
          const x0 = left ? x - l * t : x - r * t;
          const raw = x < 0 ? `-\\frac{${-x}}{${t}}` : `\\frac{${x}}{${t}}`;
          const value = raw === answer.toLatex() ? raw : `${raw} = ${answer.toLatex()}`;
          const ray = answer.isZero()
            ? "x = 0"
            : answer.eq(Q.one)
              ? "x = t"
              : answer.eq(Q.of(-1))
                ? "x = -t"
                : `x = ${answer.toLatex()}\\,t`;
          return worked(
            [
              `For Burgers' equation, the data is ${l} for $x < 0$ and ${r} for $x > 0$. What is $u$ at $x = ${x}$, $t = ${t}$?`,
              `对伯格斯方程，$x < 0$ 时数据是 ${l}，$x > 0$ 时是 ${r}。$u$ 在 $x = ${x}$、$t = ${t}$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Locate the point", "确定点的位置"],
                [
                  `At $t = ${t}$ the fan covers $${l * t} < x < ${r * t}$, and $x = ${x}$ lies ${left ? "to its left" : right ? "to its right" : "inside it"}.`,
                  `$t = ${t}$ 时扇形覆盖 $${l * t} < x < ${r * t}$，而 $x = ${x}$ ${left ? "在它左边" : right ? "在它右边" : "在它里面"}。`,
                ],
              ],
              [
                ["Read the value", "读出值"],
                left || right
                  ? [
                      `So the constant state on that side applies: $u = ${answer.toLatex()}$.`,
                      `所以用那一侧的常数状态：$u = ${answer.toLatex()}$。`,
                    ]
                  : [`So $u = ${value}$.`, `所以 $u = ${value}$。`],
              ],
            ],
            left || right
              ? [
                  `The characteristic through the point started at $x_0 = ${x} - ${wrap(left ? l : r)} \\cdot ${t} = ${x0}$, which is ${left ? "negative" : "positive"}, where the data are ${left ? l : r}.`,
                  `经过这个点的特征线从 $x_0 = ${x} - ${wrap(left ? l : r)} \\cdot ${t} = ${x0}$ 出发，它是${left ? "负" : "正"}的，那里的数据是 ${left ? l : r}。`,
                ]
              : [
                  `The ray from the origin carrying $${answer.toLatex()}$ is $${ray}$, and at $t = ${t}$ it is at $x = ${x}$.`,
                  `从原点出发、携带 $${answer.toLatex()}$ 的射线是 $${ray}$，在 $t = ${t}$ 时位于 $x = ${x}$。`,
                ],
          );
        }),
    ),
  ],
);

const sturmLiouville = topic(
  "sturm-liouville-problems",
  ["Sturm-Liouville Problems", "施图姆-刘维尔问题"],
  [
    "Find eigenvalues for different end conditions, and use the orthogonality of eigenfunctions.",
    "求不同端点条件下的特征值，并使用特征函数的正交性。",
  ],
  ["orthogonal-eigenfunctions-for-pdes"],
  [],
  [
    point(
      "eigenvalues-for-mixed-ends",
      ["Eigenvalues for mixed ends", "混合端点的特征值"],
      [
        "For $y'' + \\lambda y = 0$, the end conditions choose the eigenvalues. Fixed ends give $\\left(\\frac{n\\pi}{L}\\right)^{2}$, while one fixed end and one free end give odd quarter waves, $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$. For example, with $y(0) = 0$ and $y'(2) = 0$ the first eigenvalue is $\\left(\\frac{\\pi}{4}\\right)^{2} = \\frac{\\pi^{2}}{16}$, with the eigenfunction $\\sin\\frac{\\pi x}{4}$.\n\nCheck: $\\sin\\frac{\\pi x}{4}$ vanishes at $x = 0$, and its derivative $\\frac{\\pi}{4}\\cos\\frac{\\pi x}{4}$ vanishes at $x = 2$, since $\\cos\\frac{\\pi}{2} = 0$.\n\n> **Watch out.** With a free end the wave numbers are odd multiples of $\\frac{\\pi}{2L}$, not multiples of $\\frac{\\pi}{L}$; and remember to square.",
        "对 $y'' + \\lambda y = 0$，端点条件决定特征值。两端固定给出 $\\left(\\frac{n\\pi}{L}\\right)^{2}$，一端固定一端自由给出奇数四分之一波，$\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$。例如，$y(0) = 0$，$y'(2) = 0$ 时第一个特征值是 $\\left(\\frac{\\pi}{4}\\right)^{2} = \\frac{\\pi^{2}}{16}$，特征函数是 $\\sin\\frac{\\pi x}{4}$。\n\n检验：$\\sin\\frac{\\pi x}{4}$ 在 $x = 0$ 处为零，它的导数 $\\frac{\\pi}{4}\\cos\\frac{\\pi x}{4}$ 在 $x = 2$ 处为零，因为 $\\cos\\frac{\\pi}{2} = 0$。\n\n> **注意。** 有自由端时波数是 $\\frac{\\pi}{2L}$ 的奇数倍，而不是 $\\frac{\\pi}{L}$ 的倍数；还要记得平方。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(2, 12);
          const n = rng.int(1, 6);
          const mixed = rng.bool();
          const odd = 2 * n - 1;
          const top = mixed ? odd * odd : n * n;
          const bottom = mixed ? 4 * big * big : big * big;
          const answer = Q.of(top, bottom);
          const k = mixed ? piOver(odd, 2 * big) : piOver(n, big);
          const rawK = `\\frac{${odd === 1 ? "" : odd}\\pi}{${2 * big}}`;
          const misses: Miss[] = mixed
            ? [
                [
                  Q.of(n * n, big * big),
                  "That uses the fixed-end formula $\\left(\\frac{n\\pi}{L}\\right)^{2}$; one end here is free.",
                  "那用了两端固定的公式 $\\left(\\frac{n\\pi}{L}\\right)^{2}$；这里有一端是自由的。",
                ],
                [Q.of(odd, 2 * big), "That forgets to square the wave number.", "那忘了把波数平方。"],
                [Q.of(top, 2 * big * big), "That squares $L$ but not the $2$ in $2L$.", "那平方了 $L$，却没有平方 $2L$ 中的 $2$。"],
              ]
            : [
                [
                  Q.of(odd * odd, 4 * big * big),
                  "That uses the formula for a free end; both ends here are fixed.",
                  "那用了有自由端的公式；这里两端都固定。",
                ],
                [Q.of(n, big), "That forgets to square the wave number.", "那忘了把波数平方。"],
                [
                  Q.of(4 * n * n, big * big),
                  "That uses $\\frac{2n\\pi}{L}$; a fixed string fits a half wave, $\\frac{n\\pi}{L}$.",
                  "那用了 $\\frac{2n\\pi}{L}$；固定弦容纳的是半波，$\\frac{n\\pi}{L}$。",
                ],
              ];
          return worked(
            mixed
              ? [
                  `For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'(${big}) = 0$, the eigenvalue number ${n} is $m\\pi^{2}$. What is $m$?`,
                  `对 $y'' + \\lambda y = 0$，$y(0) = 0$，$y'(${big}) = 0$，第 ${n} 个特征值是 $m\\pi^{2}$。$m$ 是多少？`,
                ]
              : [
                  `For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y(${big}) = 0$, the eigenvalue number ${n} is $m\\pi^{2}$. What is $m$?`,
                  `对 $y'' + \\lambda y = 0$，$y(0) = 0$，$y(${big}) = 0$，第 ${n} 个特征值是 $m\\pi^{2}$。$m$ 是多少？`,
                ],
            answer,
            misses,
            [
              [
                ["Choose the formula", "选择公式"],
                mixed
                  ? [
                      `A fixed end and a free end give $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$, so the wave number is $${rawK === k ? k : `${rawK} = ${k}`}$.`,
                      `一端固定一端自由给出 $\\left(\\frac{(2n - 1)\\pi}{2L}\\right)^{2}$，所以波数是 $${rawK === k ? k : `${rawK} = ${k}`}$。`,
                    ]
                  : [
                      `Two fixed ends give $\\left(\\frac{n\\pi}{L}\\right)^{2}$, so the wave number is $${k}$.`,
                      `两端固定给出 $\\left(\\frac{n\\pi}{L}\\right)^{2}$，所以波数是 $${k}$。`,
                    ],
              ],
              [
                ["Square", "平方"],
                [
                  `$\\left(${k}\\right)^{2} = ${answer.toLatex()}\\pi^{2}$, so $m = ${answer.toLatex()}$.`,
                  `$\\left(${k}\\right)^{2} = ${answer.toLatex()}\\pi^{2}$，所以 $m = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            mixed
              ? [
                  `The eigenfunction $\\sin\\left(${k} x\\right)$ vanishes at $0$, and its derivative has the factor $\\cos\\left(${k} \\cdot ${big}\\right) = \\cos\\left(${piOver(odd, 2)}\\right) = 0$.`,
                  `特征函数 $\\sin\\left(${k} x\\right)$ 在 $0$ 处为零，它的导数含因子 $\\cos\\left(${k} \\cdot ${big}\\right) = \\cos\\left(${piOver(odd, 2)}\\right) = 0$。`,
                ]
              : [
                  `The eigenfunction $\\sin\\left(${k} x\\right)$ vanishes at $0$, and at $x = ${big}$ it is $\\sin\\left(${piOver(n, 1)}\\right) = 0$.`,
                  `特征函数 $\\sin\\left(${k} x\\right)$ 在 $0$ 处为零，在 $x = ${big}$ 处是 $\\sin\\left(${piOver(n, 1)}\\right) = 0$。`,
                ],
          );
        }),
    ),
    point(
      "a-rayleigh-quotient",
      ["A Rayleigh quotient", "瑞利商"],
      [
        "The lowest eigenvalue is the smallest possible value of the Rayleigh quotient, the integral of $(y')^{2}$ over the integral of $y^{2}$. So any test function that satisfies the end conditions gives an upper bound. For example, on $[0, 1]$ with fixed ends, $y = x(1 - x)$ has $\\int_0^1 (1 - 2x)^{2} \\, dx = \\frac{1}{3}$ and $\\int_0^1 x^{2}(1 - x)^{2} \\, dx = \\frac{1}{30}$, so the quotient is $10$.\n\nCheck: the true lowest eigenvalue is $\\pi^{2} \\approx 9.87$, just below the bound $10$, as an upper bound must be.\n\n> **Watch out.** The derivative goes on top and the function below; and the quotient bounds the eigenvalue from above, it is not the eigenvalue itself.",
        "最低特征值是瑞利商的最小可能值，瑞利商是 $(y')^{2}$ 的积分除以 $y^{2}$ 的积分。所以满足端点条件的任何试验函数都给出一个上界。例如，在 $[0, 1]$ 上取固定端点，$y = x(1 - x)$ 有 $\\int_0^1 (1 - 2x)^{2} \\, dx = \\frac{1}{3}$ 和 $\\int_0^1 x^{2}(1 - x)^{2} \\, dx = \\frac{1}{30}$，所以瑞利商是 $10$。\n\n检验：真正的最低特征值是 $\\pi^{2} \\approx 9.87$，略低于上界 $10$，上界理应如此。\n\n> **注意。** 导数在分子，函数在分母；瑞利商从上方界定特征值，它不是特征值本身。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(2, 30);
          const answer = Q.of(10, big * big);
          const misses: Miss[] = [
            [
              Q.of(big * big, 10),
              "That divides the other way; the integral of $(y')^{2}$ goes on top.",
              "那除反了；$(y')^{2}$ 的积分在分子。",
            ],
            [Q.of(10, big), "That forgets to square $L$.", "那忘了把 $L$ 平方。"],
            [
              Q.of(30, big * big),
              "That takes $\\int (y')^{2} \\, dx$ as $L^{3}$, without the factor $\\frac{1}{3}$.",
              "那把 $\\int (y')^{2} \\, dx$ 当成 $L^{3}$，漏掉了因子 $\\frac{1}{3}$。",
            ],
          ];
          const exact = (Math.PI ** 2 / (big * big)).toFixed(3);
          const approx = (10 / (big * big)).toFixed(3);
          return worked(
            [
              `Using $y = x(${big} - x)$ on $[0, ${big}]$ with fixed ends, what upper bound does the Rayleigh quotient give for the lowest eigenvalue?`,
              `在 $[0, ${big}]$ 上取固定端点的 $y = x(${big} - x)$，瑞利商给出最低特征值的什么上界？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the two integrals", "求两个积分"],
                [
                  `$\\int_0^{${big}} (${big} - 2x)^{2} \\, dx = ${Q.of(big ** 3, 3).toLatex()}$ and $\\int_0^{${big}} x^{2}(${big} - x)^{2} \\, dx = ${Q.of(big ** 5, 30).toLatex()}$.`,
                  `$\\int_0^{${big}} (${big} - 2x)^{2} \\, dx = ${Q.of(big ** 3, 3).toLatex()}$，$\\int_0^{${big}} x^{2}(${big} - x)^{2} \\, dx = ${Q.of(big ** 5, 30).toLatex()}$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [
                  `The quotient is $\\frac{${big}^{3}}{3} \\div \\frac{${big}^{5}}{30} = \\frac{10}{${big}^{2}} = ${answer.toLatex()}$.`,
                  `瑞利商是 $\\frac{${big}^{3}}{3} \\div \\frac{${big}^{5}}{30} = \\frac{10}{${big}^{2}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The true lowest eigenvalue is $\\frac{\\pi^{2}}{${big * big}} \\approx ${exact}$, just below the bound $${approx}$, as an upper bound must be.`,
              `真正的最低特征值是 $\\frac{\\pi^{2}}{${big * big}} \\approx ${exact}$，略低于上界 $${approx}$，上界理应如此。`,
            ],
          );
        }),
    ),
    point(
      "a-coefficient-with-a-weight",
      ["A coefficient with a weight", "带权的系数"],
      [
        "Eigenfunctions are orthogonal, in general with a weight function. So a series coefficient is the weighted integral of the data against the mode, divided by the weighted integral of the mode squared. For example, if $\\int w f \\phi_2 \\, dx = 12$ and $\\int w \\phi_2^{2} \\, dx = 4$, then $c_2 = \\frac{12}{4} = 3$.\n\nCheck: $c_2 \\int w \\phi_2^{2} \\, dx = 3 \\cdot 4 = 12$, which is the weighted integral of the data, as the formula requires.\n\n> **Watch out.** Both integrals carry the weight $w$; an integral without it plays no part.",
        "特征函数是正交的，一般带权函数。所以级数系数是数据与该模式的加权积分，除以该模式平方的加权积分。例如，若 $\\int w f \\phi_2 \\, dx = 12$，$\\int w \\phi_2^{2} \\, dx = 4$，则 $c_2 = \\frac{12}{4} = 3$。\n\n检验：$c_2 \\int w \\phi_2^{2} \\, dx = 3 \\cdot 4 = 12$，正是数据的加权积分，符合公式。\n\n> **注意。** 两个积分都带权 $w$；不带权的积分不起作用。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(1, 9);
          const norm = rng.int(2, 12);
          const weighted = rng.int(2, 60);
          const plain = weighted + rng.int(1, 9);
          const answer = Q.of(weighted, norm);
          const data = `f = \\sum_{k} c_k \\phi_k`;
          const given = `\\int w f \\phi_{${n}} \\, dx = ${weighted}$, $\\int f \\phi_{${n}} \\, dx = ${plain}$ and $\\int w \\phi_{${n}}^{2} \\, dx = ${norm}`;
          const givenZh = `\\int w f \\phi_{${n}} \\, dx = ${weighted}$，$\\int f \\phi_{${n}} \\, dx = ${plain}$，$\\int w \\phi_{${n}}^{2} \\, dx = ${norm}`;
          const misses: Miss[] = [
            [Q.of(plain, norm), "That uses the integral without the weight.", "那用了不带权的积分。"],
            [Q.of(norm, weighted), "That divides the other way.", "那除反了。"],
            [weighted, "That forgets to divide by the weighted integral of the mode squared.", "那忘了除以模式平方的加权积分。"],
            [
              Q.of(weighted, plain),
              "That divides by the unweighted integral of the data; divide by $\\int w \\phi^{2} \\, dx$.",
              "那除以了数据的不带权积分；应除以 $\\int w \\phi^{2} \\, dx$。",
            ],
          ];
          return worked(
            [
              `The eigenfunctions $\\phi_k$ are orthogonal with the weight $w$, and $${data}$. Given $${given}$, what is $c_{${n}}$?`,
              `特征函数 $\\phi_k$ 关于权 $w$ 正交，且 $${data}$。已知 $${givenZh}$，$c_{${n}}$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Multiply and integrate", "相乘并积分"],
                [
                  `Multiply the series by $w \\phi_{${n}}$ and integrate. Weighted orthogonality removes every other term, leaving $\\int w f \\phi_{${n}} \\, dx = c_{${n}} \\int w \\phi_{${n}}^{2} \\, dx$.`,
                  `把级数乘 $w \\phi_{${n}}$ 再积分。带权正交性去掉其他所有项，剩下 $\\int w f \\phi_{${n}} \\, dx = c_{${n}} \\int w \\phi_{${n}}^{2} \\, dx$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [
                  `$c_{${n}} = ${settle(weighted, norm, answer)}$; the integral without the weight plays no part.`,
                  `$c_{${n}} = ${settle(weighted, norm, answer)}$；不带权的积分不起作用。`,
                ],
              ],
            ],
            [
              `$c_{${n}} \\int w \\phi_{${n}}^{2} \\, dx = ${answer.toLatex()} \\cdot ${norm} = ${weighted}$, the weighted integral of the data.`,
              `$c_{${n}} \\int w \\phi_{${n}}^{2} \\, dx = ${answer.toLatex()} \\cdot ${norm} = ${weighted}$，正是数据的加权积分。`,
            ],
          );
        }),
    ),
  ],
);

const eigenvalues2d = topic(
  "eigenvalues-in-two-dimensions",
  ["Eigenvalues in Two Dimensions", "二维特征值"],
  [
    "Combine one-dimensional modes on a rectangle, and notice when different modes share a frequency.",
    "在矩形上组合一维模式，注意不同模式何时共享频率。",
  ],
  ["sturm-liouville-problems", "the-vibrating-membrane"],
  [],
  [
    {
      ...point(
        "an-eigenvalue-on-a-rectangle",
        ["An eigenvalue on a rectangle", "矩形上的特征值"],
        [
          "On a rectangle with fixed edges, separation gives $\\sin\\frac{m\\pi x}{a}\\sin\\frac{n\\pi y}{b}$. Its eigenvalue is $\\pi^{2}\\left(\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}\\right)$, the sum of the two one-dimensional eigenvalues. For example, in the figure $a = 2$, $b = 4$ and $(m, n) = (1, 2)$, so the eigenvalue is $\\pi^{2}\\left(\\frac{1}{4} + \\frac{4}{16}\\right) = \\frac{\\pi^{2}}{2}$.\n\nCheck: here $\\frac{2\\pi y}{4} = \\frac{\\pi y}{2}$, so both factors have the wave number $\\frac{\\pi}{2}$, and $\\frac{\\pi^{2}}{4} + \\frac{\\pi^{2}}{4} = \\frac{\\pi^{2}}{2}$.\n\n> **Watch out.** Square each mode number and each side before adding; $\\frac{m}{a} + \\frac{n}{b}$ is not the eigenvalue.",
          "在边固定的矩形上，分离变量给出 $\\sin\\frac{m\\pi x}{a}\\sin\\frac{n\\pi y}{b}$。它的特征值是 $\\pi^{2}\\left(\\frac{m^{2}}{a^{2}} + \\frac{n^{2}}{b^{2}}\\right)$，是两个一维特征值之和。例如，图中 $a = 2$，$b = 4$，$(m, n) = (1, 2)$，所以特征值是 $\\pi^{2}\\left(\\frac{1}{4} + \\frac{4}{16}\\right) = \\frac{\\pi^{2}}{2}$。\n\n检验：这里 $\\frac{2\\pi y}{4} = \\frac{\\pi y}{2}$，所以两个因子的波数都是 $\\frac{\\pi}{2}$，而 $\\frac{\\pi^{2}}{4} + \\frac{\\pi^{2}}{4} = \\frac{\\pi^{2}}{2}$。\n\n> **注意。** 相加之前要把每个模式数和每条边都平方；$\\frac{m}{a} + \\frac{n}{b}$ 不是特征值。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(1, 6);
            const b = rng.int(1, 6);
            const m = rng.int(1, 5);
            const n = rng.int(1, 5);
            const x = Q.of(m * m, a * a);
            const y = Q.of(n * n, b * b);
            const answer = x.add(y);
            const misses: Miss[] = [
              [
                Q.of(m * b + n * a, a * b),
                "That adds $\\frac{m}{a} + \\frac{n}{b}$ without squaring.",
                "那把 $\\frac{m}{a} + \\frac{n}{b}$ 相加，没有平方。",
              ],
              [
                Q.of(m * m + n * n, a * a + b * b),
                "That adds the tops and the bottoms separately; add the two fractions.",
                "那把分子和分母分别相加了；应该把两个分数相加。",
              ],
              [
                Q.of(m * m, b * b).add(Q.of(n * n, a * a)),
                "That pairs $m$ with the side $b$; $m$ counts half waves along $a$.",
                "那把 $m$ 和边 $b$ 配在一起了；$m$ 数的是沿 $a$ 的半波。",
              ],
            ];
            return worked(
              [
                `On the rectangle $[0, ${a}] \\times [0, ${b}]$ with fixed edges, the mode $(m, n) = (${m}, ${n})$ has eigenvalue $k\\pi^{2}$. What is $k$?`,
                `在边固定的矩形 $[0, ${a}] \\times [0, ${b}]$ 上，模式 $(m, n) = (${m}, ${n})$ 的特征值是 $k\\pi^{2}$。$k$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Find the two parts", "求两部分"],
                  [
                    `The part from $x$ is $\\frac{${m}^{2}}{${a}^{2}} = ${x.toLatex()}$ and the part from $y$ is $\\frac{${n}^{2}}{${b}^{2}} = ${y.toLatex()}$.`,
                    `来自 $x$ 的部分是 $\\frac{${m}^{2}}{${a}^{2}} = ${x.toLatex()}$，来自 $y$ 的部分是 $\\frac{${n}^{2}}{${b}^{2}} = ${y.toLatex()}$。`,
                  ],
                ],
                [
                  ["Add", "相加"],
                  [
                    `$k = ${x.toLatex()} + ${y.toLatex()} = ${answer.toLatex()}$.`,
                    `$k = ${x.toLatex()} + ${y.toLatex()} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `Clearing denominators, $${pq(answer)} \\cdot ${a * a * b * b} = ${m * m * b * b} + ${n * n * a * a}$, which is $m^{2}b^{2} + n^{2}a^{2}$.`,
                `去分母，$${pq(answer)} \\cdot ${a * a * b * b} = ${m * m * b * b} + ${n * n * a * a}$，正是 $m^{2}b^{2} + n^{2}a^{2}$。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["eigenvalues-in-two-dimensions#an-eigenvalue-on-a-rectangle"],
    },
    point(
      "modes-that-share-a-frequency",
      ["Modes that share a frequency", "共享频率的模式"],
      [
        "On a square, the eigenvalue depends on $m^{2} + n^{2}$, so different modes can share a value. Those modes can be combined with any weights, and this explains the rich Chladni patterns seen on square plates. For example, $50 = 1^{2} + 7^{2} = 5^{2} + 5^{2} = 7^{2} + 1^{2}$, so the modes $(1, 7)$, $(5, 5)$ and $(7, 1)$ share a frequency: three modes.\n\nCheck: swapping $m$ and $n$ maps the list to itself; $(1, 7)$ and $(7, 1)$ form a couple, and $(5, 5)$ is its own partner, so $2 + 1 = 3$.\n\n> **Watch out.** Count ordered pairs: $(1, 7)$ and $(7, 1)$ are different modes, but $(5, 5)$ is counted once; and the mode numbers start at $1$, not $0$.",
        "在正方形上，特征值取决于 $m^{2} + n^{2}$，所以不同的模式可以共享一个值。这些模式可以用任意权重组合，这解释了方板上丰富的克拉德尼图形。例如，$50 = 1^{2} + 7^{2} = 5^{2} + 5^{2} = 7^{2} + 1^{2}$，所以模式 $(1, 7)$、$(5, 5)$ 和 $(7, 1)$ 共享一个频率：三个模式。\n\n检验：交换 $m$ 和 $n$ 把这个列表映到自身；$(1, 7)$ 和 $(7, 1)$ 成对，$(5, 5)$ 与自身配对，所以 $2 + 1 = 3$。\n\n> **注意。** 要数有序对：$(1, 7)$ 和 $(7, 1)$ 是不同的模式，而 $(5, 5)$ 只算一次；模式数从 $1$ 开始，不是 $0$。",
      ],
      (rng) =>
        until(() => {
          const value = rng.pick([
            2, 5, 8, 10, 13, 17, 18, 20, 25, 26, 29, 32, 34, 37, 40, 41, 45, 50, 52, 53, 58, 61, 65, 68, 72, 73, 74, 80, 82, 85, 89, 90, 97,
            98, 100, 101, 104, 106, 109, 113, 116, 117, 122, 125, 130,
          ]);
          const found: string[] = [];
          let diag = 0;
          for (let m = 1; m * m < value; m++) {
            const n = Math.round(Math.sqrt(value - m * m));
            if (n >= 1 && m * m + n * n === value) {
              found.push(`(${m}, ${n})`);
              if (m === n) diag = 1;
            }
          }
          const count = found.length;
          const couples = (count - diag) / 2;
          const root = Math.round(Math.sqrt(value));
          const misses: Miss[] = [
            [
              (count + diag) / 2,
              "That counts $(m, n)$ and $(n, m)$ as one mode; order counts.",
              "那把 $(m, n)$ 和 $(n, m)$ 算成一个模式；顺序要算。",
            ],
            [2 * count, "That counts each ordered pair twice.", "那把每个有序对数了两次。"],
          ];
          if (diag === 1)
            misses.push([
              count + 1,
              "That counts the pair with $m = n$ twice; swapping does not give a new mode.",
              "那把 $m = n$ 的对数了两次；交换不产生新模式。",
            ]);
          if (root * root === value)
            misses.push([
              count + 2,
              "That includes pairs with a zero; the mode numbers start at $1$.",
              "那包括了含零的对；模式数从 $1$ 开始。",
            ]);
          if (count === 1)
            misses.push([
              0,
              `That misses $(${Math.round(Math.sqrt(value / 2))}, ${Math.round(Math.sqrt(value / 2))})$, where $m = n$.`,
              `那漏掉了 $m = n$ 的 $(${Math.round(Math.sqrt(value / 2))}, ${Math.round(Math.sqrt(value / 2))})$。`,
            ]);
          return worked(
            [
              `On a square with fixed edges, how many ordered modes $(m, n)$ with $m, n \\ge 1$ have $m^{2} + n^{2} = ${value}$?`,
              `在边固定的正方形上，有多少个有序模式 $(m, n)$（$m, n \\ge 1$）满足 $m^{2} + n^{2} = ${value}$？`,
            ],
            count,
            misses,
            [
              [
                ["Try each m", "逐个试 m"],
                [
                  `Try $m = 1, 2, \\ldots$ while $m^{2} < ${value}$, and keep each $m$ for which $${value} - m^{2}$ is a square.`,
                  `在 $m^{2} < ${value}$ 范围内试 $m = 1, 2, \\ldots$，保留使 $${value} - m^{2}$ 为平方数的 $m$。`,
                ],
              ],
              [
                ["Count", "计数"],
                [`That gives $${found.join(", ")}$, which makes ${count}.`, `得到 $${found.join(", ")}$，共 ${count} 个。`],
              ],
            ],
            [
              `Swapping $m$ and $n$ maps the list to itself: ${couples} ${couples === 1 ? "couple has" : "couples have"} $m \\ne n$ and ${diag} ${diag === 1 ? "pair has" : "pairs have"} $m = n$, so $${2 * couples} + ${diag} = ${count}$.`,
              `交换 $m$ 和 $n$ 把列表映到自身：$m \\ne n$ 的有 ${couples} 对，$m = n$ 的有 ${diag} 个，所以 $${2 * couples} + ${diag} = ${count}$。`,
            ],
          );
        }),
    ),
    point(
      "how-a-mode-decays",
      ["How a mode decays", "模式如何衰减"],
      [
        "In the two-dimensional heat equation, each mode decays like $e^{-\\alpha\\lambda t}$. So higher modes die away faster, and after a short time the lowest mode shapes the whole temperature profile. For example, for $u_t = 2\\Delta u$ on a square of side $3$, the mode $(1, 2)$ has $\\lambda = \\frac{\\pi^{2}(1 + 4)}{9} = \\frac{5\\pi^{2}}{9}$, so it decays like $e^{-\\frac{10}{9}\\pi^{2} t}$.\n\nCheck: the mode is a product of two one-dimensional modes, decaying with the exponents $2 \\cdot \\frac{1}{9}\\pi^{2}t$ and $2 \\cdot \\frac{4}{9}\\pi^{2}t$, and $\\frac{2}{9} + \\frac{8}{9} = \\frac{10}{9}$.\n\n> **Watch out.** Multiply the eigenvalue by the diffusion coefficient $\\alpha$, and square both the mode numbers and the side.",
        "在二维热方程中，每个模式按 $e^{-\\alpha\\lambda t}$ 衰减。所以高阶模式消失得更快，短时间后最低模式决定整个温度分布。例如，对边长为 $3$ 的正方形上的 $u_t = 2\\Delta u$，模式 $(1, 2)$ 的 $\\lambda = \\frac{\\pi^{2}(1 + 4)}{9} = \\frac{5\\pi^{2}}{9}$，所以它按 $e^{-\\frac{10}{9}\\pi^{2} t}$ 衰减。\n\n检验：这个模式是两个一维模式之积，它们的衰减指数是 $2 \\cdot \\frac{1}{9}\\pi^{2}t$ 和 $2 \\cdot \\frac{4}{9}\\pi^{2}t$，而 $\\frac{2}{9} + \\frac{8}{9} = \\frac{10}{9}$。\n\n> **注意。** 要用扩散系数 $\\alpha$ 乘特征值，模式数和边长都要平方。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(1, 6);
          const n = rng.int(1, 6);
          const big = rng.int(2, 6);
          const alpha = rng.int(2, 9);
          const lambda = Q.of(m * m + n * n, big * big);
          const answer = Q.of(alpha * (m * m + n * n), big * big);
          const misses: Miss[] = [
            [lambda, `That forgets the factor $\\alpha = ${alpha}$.`, `那忘了因子 $\\alpha = ${alpha}$。`],
            [Q.of(alpha * (m + n), big), "That uses $m + n$ and the side without squaring.", "那用了 $m + n$ 和边长，没有平方。"],
            [Q.of(alpha * (m * m + n * n), big), "That forgets to square the side.", "那忘了把边长平方。"],
            [
              Q.of(alpha * (m + n) ** 2, big * big),
              "That squares $m + n$; square each mode number and add.",
              "那把 $m + n$ 平方了；应该把每个模式数平方再相加。",
            ],
          ];
          return worked(
            [
              `For $u_t = ${alpha}\\Delta u$ on a square of side ${big} with fixed edges, mode $(${m}, ${n})$ decays like $e^{-k\\pi^{2} t}$. What is $k$?`,
              `对边长为 ${big}、边固定的正方形上的 $u_t = ${alpha}\\Delta u$，模式 $(${m}, ${n})$ 按 $e^{-k\\pi^{2} t}$ 衰减。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the eigenvalue", "求特征值"],
                [
                  `$\\lambda = \\frac{(${m * m} + ${n * n})\\pi^{2}}{${big * big}} = ${lambda.toLatex()}\\pi^{2}$.`,
                  `$\\lambda = \\frac{(${m * m} + ${n * n})\\pi^{2}}{${big * big}} = ${lambda.toLatex()}\\pi^{2}$。`,
                ],
              ],
              [
                ["Multiply by alpha", "乘 alpha"],
                [
                  `$k = ${alpha} \\cdot ${lambda.toLatex()} = ${answer.toLatex()}$.`,
                  `$k = ${alpha} \\cdot ${lambda.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The two one-dimensional factors decay with $${Q.of(alpha * m * m, big * big).toLatex()}\\pi^{2}t$ and $${Q.of(alpha * n * n, big * big).toLatex()}\\pi^{2}t$, and $${Q.of(alpha * m * m, big * big).toLatex()} + ${Q.of(alpha * n * n, big * big).toLatex()} = ${answer.toLatex()}$.`,
              `两个一维因子的衰减指数是 $${Q.of(alpha * m * m, big * big).toLatex()}\\pi^{2}t$ 和 $${Q.of(alpha * n * n, big * big).toLatex()}\\pi^{2}t$，而 $${Q.of(alpha * m * m, big * big).toLatex()} + ${Q.of(alpha * n * n, big * big).toLatex()} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

const fourierHeat = topic(
  "the-fourier-transform-for-the-heat-equation",
  ["The Fourier Transform for the Heat Equation", "用傅里叶变换解热方程"],
  [
    "Turn the heat equation on the line into an ordinary differential equation for each frequency.",
    "把直线上的热方程变成每个频率的常微分方程。",
  ],
  ["the-heat-kernel"],
  [],
  [
    point(
      "derivatives-become-multiplication",
      ["Derivatives become multiplication", "导数变成乘法"],
      [
        "The Fourier transform turns $\\partial_x$ into multiplication by $ik$, so $u_{xx}$ becomes $-k^{2}\\hat{u}$. This is what turns a partial differential equation into an ordinary one in $t$ for each fixed frequency $k$. For example, at the frequency $k = 5$ the term $3u_{xx}$ becomes $3(5i)^{2}\\hat{u} = -75\\hat{u}$.\n\nCheck: $\\partial_x^{2} e^{5ix} = (5i)^{2} e^{5ix} = -25 e^{5ix}$, and $3 \\cdot (-25) = -75$.\n\n> **Watch out.** The powers of $i$ alternate in sign: $i^{2} = -1$ but $i^{4} = 1$, so a fourth derivative gives $+k^{4}$.",
        "傅里叶变换把 $\\partial_x$ 变成乘 $ik$，所以 $u_{xx}$ 变成 $-k^{2}\\hat{u}$。这就是把偏微分方程变成每个固定频率 $k$ 下关于 $t$ 的常微分方程的原因。例如，在频率 $k = 5$ 处，$3u_{xx}$ 变成 $3(5i)^{2}\\hat{u} = -75\\hat{u}$。\n\n检验：$\\partial_x^{2} e^{5ix} = (5i)^{2} e^{5ix} = -25 e^{5ix}$，而 $3 \\cdot (-25) = -75$。\n\n> **注意。** $i$ 的幂符号交替：$i^{2} = -1$，但 $i^{4} = 1$，所以四阶导数给出 $+k^{4}$。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(2, 15);
          const n = rng.pick([2, 4]);
          const c = rng.int(2, 9);
          const sign = n === 2 ? -1 : 1;
          const answer = c * sign * k ** n;
          const misses: Miss[] = [
            [-answer, `That has the sign wrong: $i^{${n}} = ${sign}$.`, `那符号错了：$i^{${n}} = ${sign}$。`],
            [
              c * k,
              `That multiplies by $k$ once; each of the ${n} derivatives brings a factor $ik$.`,
              `那只乘了一次 $k$；${n} 次求导每次都带来因子 $ik$。`,
            ],
            [sign * k ** n, `That drops the coefficient $${c}$.`, `那漏掉了系数 $${c}$。`],
            [c * n * k, "That multiplies by the order instead of raising $ik$ to it.", "那乘了阶数，而不是把 $ik$ 升到这个幂。"],
          ];
          return worked(
            [
              `Under the Fourier transform, $${c}\\partial_x^{${n}} u$ becomes $m\\hat{u}$ at frequency $k = ${k}$. What is $m$?`,
              `在傅里叶变换下，$${c}\\partial_x^{${n}} u$ 在频率 $k = ${k}$ 处变成 $m\\hat{u}$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Replace each derivative", "替换每次求导"],
                [
                  `Each derivative multiplies by $ik$, so $\\partial_x^{${n}}$ becomes $(${k}i)^{${n}} = i^{${n}} \\cdot ${k ** n} = ${sign * k ** n}$.`,
                  `每次求导乘 $ik$，所以 $\\partial_x^{${n}}$ 变成 $(${k}i)^{${n}} = i^{${n}} \\cdot ${k ** n} = ${sign * k ** n}$。`,
                ],
              ],
              [
                ["Multiply by the coefficient", "乘系数"],
                [`$m = ${c} \\cdot ${wrap(sign * k ** n)} = ${answer}$.`, `$m = ${c} \\cdot ${wrap(sign * k ** n)} = ${answer}$。`],
              ],
            ],
            n === 2
              ? [
                  `Applying $\\partial_x$ to $e^{${k}ix}$ twice gives the factor $(${k}i)(${k}i) = -${k * k}$, and $${c} \\cdot (-${k * k}) = ${answer}$.`,
                  `对 $e^{${k}ix}$ 求导两次得因子 $(${k}i)(${k}i) = -${k * k}$，而 $${c} \\cdot (-${k * k}) = ${answer}$。`,
                ]
              : [
                  `Two second derivatives each give $-${k * k}$, and $(-${k * k})^{2} = ${k ** 4}$, so $${c} \\cdot ${k ** 4} = ${answer}$.`,
                  `两次二阶导数各给出 $-${k * k}$，而 $(-${k * k})^{2} = ${k ** 4}$，所以 $${c} \\cdot ${k ** 4} = ${answer}$。`,
                ],
          );
        }),
    ),
    point(
      "the-decay-of-a-frequency",
      ["The decay of a frequency", "频率的衰减"],
      [
        "For $u_t = \\alpha u_{xx}$, each frequency obeys $\\hat{u}_t = -\\alpha k^{2}\\hat{u}$, so it decays like $e^{-\\alpha k^{2} t}$. Rapid wiggles vanish first, and this is why heat flow smooths out rough data. For example, for $u_t = 3u_{xx}$ the frequency $k = 2$ decays at the rate $3 \\cdot 4 = 12$, so by $t = 5$ it is multiplied by $e^{-60}$.\n\nCheck: doubling the frequency to $k = 4$ would multiply the exponent by $4$, giving $e^{-240}$: high frequencies die much faster.\n\n> **Watch out.** The frequency enters squared; the exponent is $\\alpha k^{2} t$, not $\\alpha k t$.",
        "对 $u_t = \\alpha u_{xx}$，每个频率满足 $\\hat{u}_t = -\\alpha k^{2}\\hat{u}$，所以按 $e^{-\\alpha k^{2} t}$ 衰减。快速的抖动最先消失，这就是热流使粗糙数据变光滑的原因。例如，对 $u_t = 3u_{xx}$，频率 $k = 2$ 以速率 $3 \\cdot 4 = 12$ 衰减，所以到 $t = 5$ 时乘 $e^{-60}$。\n\n检验：频率加倍到 $k = 4$ 会使指数乘 $4$，得 $e^{-240}$：高频消失得快得多。\n\n> **注意。** 频率以平方出现；指数是 $\\alpha k^{2} t$，不是 $\\alpha k t$。",
      ],
      (rng) =>
        until(() => {
          const alpha = rng.int(2, 9);
          const k = rng.int(2, 12);
          const t = rng.int(2, 9);
          const rate = alpha * k * k;
          const answer = rate * t;
          const misses: Miss[] = [
            [alpha * k * t, "That forgets to square $k$.", "那忘了把 $k$ 平方。"],
            [k * k * t, `That drops the coefficient $\\alpha = ${alpha}$.`, `那漏掉了系数 $\\alpha = ${alpha}$。`],
            [rate, "That is the rate; multiply by the time.", "那是衰减率；还要乘时间。"],
            [alpha * 2 * k * t, "That uses $2k$ in place of $k^{2}$.", "那用 $2k$ 代替了 $k^{2}$。"],
          ];
          return worked(
            [
              `For $u_t = ${alpha}u_{xx}$, frequency $k = ${k}$ is multiplied by $e^{-m}$ by the time $t = ${t}$. What is $m$?`,
              `对 $u_t = ${alpha}u_{xx}$，到时间 $t = ${t}$ 时频率 $k = ${k}$ 乘 $e^{-m}$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the rate", "求衰减率"],
                [
                  `$\\hat{u}_t = -\\alpha k^{2}\\hat{u}$ with $\\alpha k^{2} = ${alpha} \\cdot ${k * k} = ${rate}$.`,
                  `$\\hat{u}_t = -\\alpha k^{2}\\hat{u}$，其中 $\\alpha k^{2} = ${alpha} \\cdot ${k * k} = ${rate}$。`,
                ],
              ],
              [
                ["Multiply by the time", "乘时间"],
                [`$m = ${rate} \\cdot ${t} = ${answer}$.`, `$m = ${rate} \\cdot ${t} = ${answer}$。`],
              ],
            ],
            [
              `Dividing back, $${answer} \\div ${t} = ${rate}$ and $${rate} \\div ${alpha} = ${k * k} = ${k}^{2}$.`,
              `反过来除，$${answer} \\div ${t} = ${rate}$，$${rate} \\div ${alpha} = ${k * k} = ${k}^{2}$。`,
            ],
          );
        }),
    ),
    point(
      "how-a-gaussian-spreads",
      ["How a Gaussian spreads", "高斯分布如何扩散"],
      [
        "A Gaussian's transform is again a Gaussian, so a Gaussian stays Gaussian under heat flow. Multiplying transforms adds the variances, which means the variance grows by $2\\alpha t$ as time passes. For example, a Gaussian of variance $3$ under $u_t = 2u_{xx}$ has variance $3 + 2 \\cdot 2 \\cdot 4 = 19$ at $t = 4$.\n\nCheck: the heat kernel at $t = 4$ has variance $2 \\cdot 2 \\cdot 4 = 16$, and convolving two Gaussians adds their variances, $3 + 16 = 19$.\n\n> **Watch out.** The variance grows by $2\\alpha t$, not $\\alpha t$, and it is the variances that add, not the standard deviations.",
        "高斯函数的变换仍是高斯函数，所以高斯分布在热流下保持高斯形状。变换相乘使方差相加，这意味着方差随时间增加 $2\\alpha t$。例如，方差为 $3$ 的高斯分布按 $u_t = 2u_{xx}$ 演化，在 $t = 4$ 时方差是 $3 + 2 \\cdot 2 \\cdot 4 = 19$。\n\n检验：$t = 4$ 时热核的方差是 $2 \\cdot 2 \\cdot 4 = 16$，两个高斯函数卷积时方差相加，$3 + 16 = 19$。\n\n> **注意。** 方差增加 $2\\alpha t$，不是 $\\alpha t$；相加的是方差，不是标准差。",
      ],
      (rng) =>
        until(() => {
          const s = rng.int(1, 30);
          const alpha = rng.int(2, 9);
          const t = rng.int(2, 12);
          const growth = 2 * alpha * t;
          const answer = s + growth;
          const misses: Miss[] = [
            [s + alpha * t, "That adds $\\alpha t$; the variance grows by $2\\alpha t$.", "那加了 $\\alpha t$；方差增加 $2\\alpha t$。"],
            [growth, "That forgets the starting variance.", "那忘了开始的方差。"],
            [s * growth, "That multiplies the variances; they add.", "那把方差相乘了；它们应该相加。"],
            [s + 4 * alpha * t, "That doubles twice; the kernel's variance is $2\\alpha t$.", "那乘了两次 2；热核的方差是 $2\\alpha t$。"],
          ];
          return worked(
            [
              `A Gaussian temperature profile with variance ${s} evolves under $u_t = ${alpha}u_{xx}$. What is its variance at $t = ${t}$?`,
              `方差为 ${s} 的高斯温度分布按 $u_t = ${alpha}u_{xx}$ 演化。在 $t = ${t}$ 时它的方差是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the growth", "求增量"],
                [
                  `The variance grows by $2\\alpha t = 2 \\cdot ${alpha} \\cdot ${t} = ${growth}$.`,
                  `方差增加 $2\\alpha t = 2 \\cdot ${alpha} \\cdot ${t} = ${growth}$。`,
                ],
              ],
              [
                ["Add the start", "加上初始值"],
                [`$${s} + ${growth} = ${answer}$.`, `$${s} + ${growth} = ${answer}$。`],
              ],
            ],
            [
              `The heat kernel at $t = ${t}$ has variance $${growth}$, and convolving two Gaussians adds their variances: $${s} + ${growth} = ${answer}$.`,
              `$t = ${t}$ 时热核的方差是 $${growth}$，两个高斯函数卷积时方差相加：$${s} + ${growth} = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const laplacePde = topic(
  "the-laplace-transform-for-pdes",
  ["The Laplace Transform for PDEs", "用拉普拉斯变换解偏微分方程"],
  ["Transform in time, and solve an ordinary differential equation in space.", "对时间作变换，再解关于空间的常微分方程。"],
  ["the-heat-equation"],
  [],
  [
    point(
      "transforming-the-time-derivative",
      ["Transforming the time derivative", "变换时间导数"],
      [
        "The Laplace transform in time turns $u_t$ into $sU - u(x, 0)$. So the heat equation with initial data becomes an ordinary differential equation in $x$, in which $s$ acts as a parameter. For example, if $U(x, 3) = 4$ and $u(x, 0) = 2$, the transform of $u_t$ at $s = 3$ is $3 \\cdot 4 - 2 = 10$.\n\nCheck: integrating $\\int_0^{\\infty} e^{-st} u_t \\, dt$ by parts gives $-u(x, 0) + s\\int_0^{\\infty} e^{-st} u \\, dt$, which is $sU - u(x, 0)$.\n\n> **Watch out.** Subtract the initial value itself; it is not multiplied by $s$.",
        "对时间作拉普拉斯变换，把 $u_t$ 变成 $sU - u(x, 0)$。所以带初值的热方程变成关于 $x$ 的常微分方程，其中 $s$ 是参数。例如，若 $U(x, 3) = 4$，$u(x, 0) = 2$，则 $u_t$ 在 $s = 3$ 处的变换是 $3 \\cdot 4 - 2 = 10$。\n\n检验：对 $\\int_0^{\\infty} e^{-st} u_t \\, dt$ 分部积分得 $-u(x, 0) + s\\int_0^{\\infty} e^{-st} u \\, dt$，即 $sU - u(x, 0)$。\n\n> **注意。** 减去的是初值本身；它不乘 $s$。",
      ],
      (rng) =>
        until(() => {
          const s = rng.int(2, 12);
          const u = rng.int(-20, 40);
          const big = rng.int(-20, 20);
          if (u === 0 || big === 0) return undefined;
          const answer = s * big - u;
          const misses: Miss[] = [
            [s * big + u, "That adds the initial value; it is subtracted.", "那加上了初值；它应该减去。"],
            [big - u, "That forgets to multiply $U$ by $s$.", "那忘了用 $s$ 乘 $U$。"],
            [s * (big - u), "That multiplies the initial value by $s$ too.", "那把初值也乘了 $s$。"],
            [s * big, "That leaves out the initial value.", "那漏掉了初值。"],
          ];
          return worked(
            [
              `At a point $x$, $U(x, ${s}) = ${big}$ and $u(x, 0) = ${u}$. What is the transform of $u_t$ at $s = ${s}$?`,
              `在某点 $x$ 处，$U(x, ${s}) = ${big}$，$u(x, 0) = ${u}$。$u_t$ 在 $s = ${s}$ 处的变换是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Recall the rule", "回忆法则"],
                [`The transform of $u_t$ is $sU - u(x, 0)$.`, `$u_t$ 的变换是 $sU - u(x, 0)$。`],
              ],
              [
                ["Substitute", "代入"],
                [`$${s} \\cdot ${wrap(big)} ${plus(-u)} = ${answer}$.`, `$${s} \\cdot ${wrap(big)} ${plus(-u)} = ${answer}$。`],
              ],
            ],
            [
              `Adding the initial value back, $${answer} ${plus(u)} = ${s * big}$, which is $${s} \\cdot ${wrap(big)}$.`,
              `把初值加回去，$${answer} ${plus(u)} = ${s * big}$，正是 $${s} \\cdot ${wrap(big)}$。`,
            ],
          );
        }),
    ),
    point(
      "the-decay-rate-in-space",
      ["The decay rate in space", "空间中的衰减率"],
      [
        "With zero initial data, the transformed heat equation is $\\alpha U'' = sU$. On a half line the bounded solution is $e^{-x\\sqrt{s/\\alpha}}$, so the rate of decay in space depends on the transform variable. For example, $2U'' = 18U$ needs $m^{2} = 9$, and the bounded solution is $Ce^{-3x}$.\n\nCheck: $U = Ce^{-3x}$ has $U'' = 9U$, and $2 \\cdot 9 = 18$.\n\n> **Watch out.** Take the positive root $m = \\sqrt{s/\\alpha}$; the other root gives $e^{3x}$, which grows without bound.",
        "初值为零时，变换后的热方程是 $\\alpha U'' = sU$。在半直线上，有界解是 $e^{-x\\sqrt{s/\\alpha}}$，所以空间中的衰减率取决于变换变量。例如，$2U'' = 18U$ 要求 $m^{2} = 9$，有界解是 $Ce^{-3x}$。\n\n检验：$U = Ce^{-3x}$ 满足 $U'' = 9U$，而 $2 \\cdot 9 = 18$。\n\n> **注意。** 要取正根 $m = \\sqrt{s/\\alpha}$；另一个根给出 $e^{3x}$，它无界增长。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 12);
          const r = rng.int(2, 12);
          const s = a * r * r;
          const misses: Miss[] = [
            [r * r, "That is $m^{2}$; take its square root.", "那是 $m^{2}$；要开平方。"],
            [-r, "That root gives a solution that grows without bound.", "那个根给出无界增长的解。"],
            [s, `That forgets to divide by the coefficient $${a}$.`, `那忘了除以系数 $${a}$。`],
            [a * r, "That multiplies by the coefficient; divide by it under the root.", "那乘了系数；应该在根号下除以它。"],
          ];
          return worked(
            [
              `Solving $${a}U'' = ${s}U$ on $x > 0$ with a bounded solution gives $U = Ce^{-mx}$. What is $m$?`,
              `在 $x > 0$ 上解 $${a}U'' = ${s}U$，有界解为 $U = Ce^{-mx}$。$m$ 是多少？`,
            ],
            r,
            misses,
            [
              [
                ["Substitute the exponential", "代入指数函数"],
                [
                  `$U = Ce^{-mx}$ gives $${a}m^{2} = ${s}$, so $m^{2} = ${r * r}$.`,
                  `$U = Ce^{-mx}$ 给出 $${a}m^{2} = ${s}$，所以 $m^{2} = ${r * r}$。`,
                ],
              ],
              [
                ["Choose the root", "选根"],
                [`The bounded solution needs the positive root, $m = ${r}$.`, `有界解需要正根，$m = ${r}$。`],
              ],
            ],
            [
              `$U = Ce^{-${r}x}$ has $U'' = ${r * r}U$, and $${a} \\cdot ${r * r} = ${s}$; it also tends to $0$ as $x \\to \\infty$.`,
              `$U = Ce^{-${r}x}$满足 $U'' = ${r * r}U$，而 $${a} \\cdot ${r * r} = ${s}$；并且 $x \\to \\infty$ 时它趋于 $0$。`,
            ],
          );
        }),
    ),
    point(
      "matching-a-boundary-value",
      ["Matching a boundary value", "匹配边界值"],
      [
        "A constant boundary temperature $T$ has transform $\\frac{T}{s}$. This fixes the constant in the bounded solution, so the transform at a point is known, and inverting it gives the erfc profile at each position. For example, a boundary held at $6$ has $U(0, s) = \\frac{6}{s}$, which is $2$ at $s = 3$.\n\nCheck: $\\int_0^{\\infty} 6 e^{-3t} \\, dt = \\frac{6}{3} = 2$.\n\n> **Watch out.** The transform of a constant is the constant divided by $s$, not the constant itself.",
        "常数边界温度 $T$ 的变换是 $\\frac{T}{s}$。这确定了有界解中的常数，所以一点处的变换是已知的，反演后在每个位置给出 erfc 分布。例如，边界保持在 $6$ 时 $U(0, s) = \\frac{6}{s}$，在 $s = 3$ 处是 $2$。\n\n检验：$\\int_0^{\\infty} 6 e^{-3t} \\, dt = \\frac{6}{3} = 2$。\n\n> **注意。** 常数的变换是常数除以 $s$，而不是常数本身。",
      ],
      (rng) =>
        until(() => {
          const t = rng.int(2, 60);
          const s = rng.int(2, 12);
          const answer = Q.of(t, s);
          const misses: Miss[] = [
            [t, "That is the temperature itself; its transform is divided by $s$.", "那是温度本身；它的变换要除以 $s$。"],
            [Q.of(s, t), "That divides the other way.", "那除反了。"],
            [t * s, "That multiplies by $s$; the transform divides by it.", "那乘了 $s$；变换是除以它。"],
          ];
          return worked(
            [
              `The boundary temperature at $x = 0$ is the constant ${t}. What is $U(0, s)$ at $s = ${s}$?`,
              `$x = 0$ 处的边界温度是常数 ${t}。$U(0, s)$ 在 $s = ${s}$ 处是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Transform the constant", "变换常数"],
                [`The transform of the constant ${t} is $\\frac{${t}}{s}$.`, `常数 ${t} 的变换是 $\\frac{${t}}{s}$。`],
              ],
              [
                ["Evaluate", "求值"],
                [`At $s = ${s}$ this is $${settle(t, s, answer)}$.`, `在 $s = ${s}$ 处是 $${settle(t, s, answer)}$。`],
              ],
            ],
            [
              `Directly, $\\int_0^{\\infty} ${t} e^{-${s}t} \\, dt = ${settle(t, s, answer)}$.`,
              `直接计算，$\\int_0^{\\infty} ${t} e^{-${s}t} \\, dt = ${settle(t, s, answer)}$。`,
            ],
          );
        }),
    ),
  ],
);

const duhamel = topic(
  "duhamels-principle",
  ["Duhamel's Principle", "杜阿梅尔原理"],
  ["Build the response to a source by adding up the responses to its instants.", "把源的响应看成各时刻响应的叠加。"],
  ["nonhomogeneous-heat-problems"],
  [],
  [
    point(
      "a-source-on-a-single-mode",
      ["A source on a single mode", "单一模式上的源"],
      [
        "For a mode with decay rate $\\lambda$ and a steady source $Q$, Duhamel's integral gives $\\frac{Q}{\\lambda}(1 - e^{-\\lambda t})$. The amplitude climbs from zero toward the steady value, where the source balances the decay. For example, $b' = -3b + 12$ with $b(0) = 0$ gives $b = 4(1 - e^{-3t})$, which approaches $\\frac{12}{3} = 4$.\n\nCheck: $b' = 12e^{-3t}$ and $-3b + 12 = -12 + 12e^{-3t} + 12 = 12e^{-3t}$, so the formula solves the equation, and $b(0) = 0$.\n\n> **Watch out.** The limit is the source divided by the decay rate, not the source itself.",
        "对衰减率为 $\\lambda$、稳定源为 $Q$ 的模式，杜阿梅尔积分给出 $\\frac{Q}{\\lambda}(1 - e^{-\\lambda t})$。振幅从零上升到稳定值，在那里源与衰减平衡。例如，$b' = -3b + 12$，$b(0) = 0$ 给出 $b = 4(1 - e^{-3t})$，它趋于 $\\frac{12}{3} = 4$。\n\n检验：$b' = 12e^{-3t}$，而 $-3b + 12 = -12 + 12e^{-3t} + 12 = 12e^{-3t}$，所以这个公式满足方程，且 $b(0) = 0$。\n\n> **注意。** 极限是源除以衰减率，而不是源本身。",
      ],
      (rng) =>
        until(() => {
          const q = rng.int(2, 40);
          const l = rng.int(2, 15);
          const answer = Q.of(q, l);
          const misses: Miss[] = [
            [Q.of(l, q), "That divides the other way.", "那除反了。"],
            [q, "That is the source itself; the decay holds the amplitude down.", "那是源本身；衰减压低了振幅。"],
            [0, "That is the starting value; the source keeps feeding the mode.", "那是初值；源不断给这个模式输入。"],
            [q * l, "That multiplies; at balance the rate times $b$ equals the source.", "那是相乘；平衡时衰减率乘 $b$ 等于源。"],
          ];
          return worked(
            [
              `A mode obeys $b'(t) = -${l}b + ${q}$ with $b(0) = 0$. What value does $b$ approach as $t \\to \\infty$?`,
              `一个模式满足 $b'(t) = -${l}b + ${q}$，$b(0) = 0$。当 $t \\to \\infty$ 时 $b$ 趋于什么值？`,
            ],
            answer,
            misses,
            [
              [
                ["Set the change to zero", "令变化为零"],
                [`The steady state has $b' = 0$, so $${l}b = ${q}$.`, `稳态时 $b' = 0$，所以 $${l}b = ${q}$。`],
              ],
              [
                ["Solve", "求解"],
                [`$b = ${settle(q, l, answer)}$.`, `$b = ${settle(q, l, answer)}$。`],
              ],
            ],
            [
              `Duhamel's formula $b = ${answer.toLatex()}\\left(1 - e^{-${l}t}\\right)$ starts at $0$ and tends to $${answer.toLatex()}$, since $e^{-${l}t} \\to 0$.`,
              `杜阿梅尔公式 $b = ${answer.toLatex()}\\left(1 - e^{-${l}t}\\right)$ 从 $0$ 开始，趋于 $${answer.toLatex()}$，因为 $e^{-${l}t} \\to 0$。`,
            ],
          );
        }),
    ),
    point(
      "the-duhamel-integral",
      ["The Duhamel integral", "杜阿梅尔积分"],
      [
        "With no decay, the Duhamel integral is just the total source received so far. For a source that grows with time, this integral adds up the source from the start to the present moment. For example, $b' = 4t + 3$ with $b(0) = 0$ gives $b(2) = \\int_0^{2} (4\\tau + 3) \\, d\\tau = 8 + 6 = 14$.\n\nCheck: $b(t) = 2t^{2} + 3t$ has $b' = 4t + 3$ and $b(0) = 0$, and $b(2) = 8 + 6 = 14$.\n\n> **Watch out.** Add up the source over the whole time; its value at the final moment is only the current rate.",
        "没有衰减时，杜阿梅尔积分就是到目前为止收到的总源量。对随时间增长的源，这个积分把从开始到现在的源加起来。例如，$b' = 4t + 3$，$b(0) = 0$ 给出 $b(2) = \\int_0^{2} (4\\tau + 3) \\, d\\tau = 8 + 6 = 14$。\n\n检验：$b(t) = 2t^{2} + 3t$ 满足 $b' = 4t + 3$ 和 $b(0) = 0$，且 $b(2) = 8 + 6 = 14$。\n\n> **注意。** 要把整段时间的源加起来；最后时刻的值只是当时的速率。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 12);
          const b = rng.int(1, 9);
          const t = rng.int(2, 9);
          const half = Q.of(a * t * t, 2);
          const answer = Q.of(a * t * t + 2 * b * t, 2);
          const misses: Miss[] = [
            [a * t + b, "That is the source at the final moment; integrate it over time.", "那是最后时刻的源；要对时间积分。"],
            [
              a * t * t + b * t,
              "That integrates $t$ to $t^{2}$; it is $\\frac{t^{2}}{2}$.",
              "那把 $t$ 积分成 $t^{2}$；应该是 $\\frac{t^{2}}{2}$。",
            ],
            [half, "That forgets the constant part of the source.", "那忘了源的常数部分。"],
          ];
          return worked(
            [
              `A mode obeys $b'(t) = ${a}t + ${b}$ with $b(0) = 0$. What is $b(${t})$?`,
              `一个模式满足 $b'(t) = ${a}t + ${b}$，$b(0) = 0$。$b(${t})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Integrate the source", "对源积分"],
                [
                  `$b(${t}) = \\int_0^{${t}} (${a}\\tau + ${b}) \\, d\\tau = \\frac{${a}}{2} \\cdot ${t * t} + ${b} \\cdot ${t}$.`,
                  `$b(${t}) = \\int_0^{${t}} (${a}\\tau + ${b}) \\, d\\tau = \\frac{${a}}{2} \\cdot ${t * t} + ${b} \\cdot ${t}$。`,
                ],
              ],
              [
                ["Add", "相加"],
                [`$${half.toLatex()} + ${b * t} = ${answer.toLatex()}$.`, `$${half.toLatex()} + ${b * t} = ${answer.toLatex()}$。`],
              ],
            ],
            [
              `$b(t) = ${Q.of(a, 2).toLatex()}t^{2} + ${b === 1 ? "" : b}t$ has $b' = ${a}t + ${b}$ and $b(0) = 0$, and at $t = ${t}$ it gives $${answer.toLatex()}$.`,
              `$b(t) = ${Q.of(a, 2).toLatex()}t^{2} + ${b === 1 ? "" : b}t$ 满足 $b' = ${a}t + ${b}$ 和 $b(0) = 0$，在 $t = ${t}$ 时得 $${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "a-short-pulse",
      ["A short pulse", "短脉冲"],
      [
        "A brief pulse of source acts like a new initial condition at the moment it occurs. So the later response is the pulse's strength multiplied by the decay over the time that has passed since it happened. For example, a mode with decay rate $2$ that is hit by a pulse of size $5$ at $t = 1$ has amplitude $5e^{-2 \\cdot 3} = 5e^{-6}$ at $t = 4$.\n\nCheck: at $t = 1$ the formula $5e^{-2(t - 1)}$ gives $5$, the size of the pulse, and it decays at the rate $2$ afterwards.\n\n> **Watch out.** The decay counts only from the moment of the pulse; before it, the amplitude is $0$ and nothing decays.",
        "短暂的源脉冲相当于在它发生的时刻有一个新的初始条件。所以之后的响应是脉冲强度乘从它发生到现在这段时间的衰减。例如，衰减率为 $2$ 的模式在 $t = 1$ 时受到大小为 $5$ 的脉冲，在 $t = 4$ 时振幅是 $5e^{-2 \\cdot 3} = 5e^{-6}$。\n\n检验：在 $t = 1$ 时公式 $5e^{-2(t - 1)}$ 给出 $5$，即脉冲大小，之后以速率 $2$ 衰减。\n\n> **注意。** 衰减只从脉冲时刻开始计算；在此之前振幅为 $0$，没有东西在衰减。",
      ],
      (rng) => {
        const j = rng.int(2, 30);
        const l = rng.int(2, 9);
        const t0 = rng.int(1, 5);
        const t = t0 + rng.int(1, 9);
        const gap = t - t0;
        const slips: Slip[] = [
          [
            same(`${j} e^{-${l * t}}`),
            "That counts the decay from $t = 0$, before the pulse arrived.",
            "那从 $t = 0$ 开始计算衰减，那时脉冲还没到。",
          ],
          [
            same(`${j} e^{-${l * (t + t0)}}`),
            "That adds the two times; the decay lasts for their difference.",
            "那把两个时间相加了；衰减持续的是它们的差。",
          ],
          [same(`${j}`), "That ignores the decay after the pulse.", "那忽略了脉冲之后的衰减。"],
        ];
        return chosen(
          rng,
          [
            `A mode with decay rate ${l} starts at 0, and a pulse of size ${j} hits at $t = ${t0}$. What is the amplitude at $t = ${t}$?`,
            `衰减率为 ${l} 的模式从 0 开始，大小为 ${j} 的脉冲在 $t = ${t0}$ 时到来。$t = ${t}$ 时的振幅是多少？`,
          ],
          same(`${j} e^{-${l * gap}}`),
          slips,
          [
            [
              ["Measure the elapsed time", "求经过的时间"],
              [
                `The pulse has been decaying for $${t} - ${t0} = ${gap}$ time units.`,
                `脉冲已经衰减了 $${t} - ${t0} = ${gap}$ 个时间单位。`,
              ],
            ],
            [
              ["Apply the decay", "应用衰减"],
              [
                `The amplitude is $${j} e^{-${l} \\cdot ${gap}} = ${j} e^{-${l * gap}}$.`,
                `振幅是 $${j} e^{-${l} \\cdot ${gap}} = ${j} e^{-${l * gap}}$。`,
              ],
            ],
          ],
          [
            `At $t = ${t0}$ the formula $${j} e^{-${l}(t - ${t0})}$ gives $${j}$, the size of the pulse, and it solves $b' = -${l}b$ afterwards.`,
            `在 $t = ${t0}$ 时公式 $${j} e^{-${l}(t - ${t0})}$ 给出 $${j}$，即脉冲大小，之后它满足 $b' = -${l}b$。`,
          ],
        );
      },
    ),
  ],
);

const energy = topic(
  "the-energy-method",
  ["The Energy Method", "能量法"],
  ["Prove uniqueness and decay by watching an integral of the solution.", "通过观察解的积分证明唯一性和衰减。"],
  ["the-maximum-principle-for-heat", "well-posed-problems"],
  [],
  [
    point(
      "the-heat-energy-falls",
      ["The heat energy falls", "热能量下降"],
      [
        "For the heat equation with fixed ends, integration by parts gives the rate of change of $\\int u^{2}$ as $-2\\alpha\\int u_x^{2}$. This is never positive, so the energy can only fall as time goes on. For example, for $u_t = 3u_{xx}$ at a moment when $\\int u_x^{2} \\, dx = 5$, the energy changes at the rate $-2 \\cdot 3 \\cdot 5 = -30$.\n\nCheck: $\\frac{d}{dt}\\int u^{2} \\, dx = 2\\int u u_t \\, dx = 6\\int u u_{xx} \\, dx$, and moving one derivative across, with $u = 0$ at the ends, gives $-6\\int u_x^{2} \\, dx = -30$.\n\n> **Watch out.** Keep the factor $2$ from differentiating $u^{2}$, and the minus sign from integrating by parts.",
        "对两端固定的热方程，分部积分给出 $\\int u^{2}$ 的变化率是 $-2\\alpha\\int u_x^{2}$。它永远不为正，所以能量只能随时间下降。例如，对 $u_t = 3u_{xx}$，在 $\\int u_x^{2} \\, dx = 5$ 的时刻，能量的变化率是 $-2 \\cdot 3 \\cdot 5 = -30$。\n\n检验：$\\frac{d}{dt}\\int u^{2} \\, dx = 2\\int u u_t \\, dx = 6\\int u u_{xx} \\, dx$，把一个导数移过去，端点处 $u = 0$，得 $-6\\int u_x^{2} \\, dx = -30$。\n\n> **注意。** 要保留对 $u^{2}$ 求导得到的因子 $2$，以及分部积分产生的负号。",
      ],
      (rng) =>
        until(() => {
          const alpha = rng.int(2, 9);
          const g = rng.int(2, 40);
          const answer = -2 * alpha * g;
          const misses: Miss[] = [
            [
              2 * alpha * g,
              "That has the sign wrong; integrating by parts brings a minus sign, and the energy falls.",
              "那符号错了；分部积分带来负号，能量下降。",
            ],
            [-alpha * g, "That forgets the factor $2$ from differentiating $u^{2}$.", "那忘了对 $u^{2}$ 求导得到的因子 $2$。"],
            [-2 * g, `That drops the coefficient $\\alpha = ${alpha}$.`, `那漏掉了系数 $\\alpha = ${alpha}$。`],
          ];
          return worked(
            [
              `For $u_t = ${alpha}u_{xx}$ with fixed ends, $\\int u_x^{2}\\, dx = ${g}$ at some moment. What is $\\frac{d}{dt}\\int u^{2}\\, dx$ then?`,
              `对两端固定的 $u_t = ${alpha}u_{xx}$，某时刻 $\\int u_x^{2}\\, dx = ${g}$。这时 $\\frac{d}{dt}\\int u^{2}\\, dx$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Recall the rate", "回忆变化率"],
                [
                  `Integration by parts gives $\\frac{d}{dt}\\int u^{2} \\, dx = -2\\alpha\\int u_x^{2} \\, dx$.`,
                  `分部积分给出 $\\frac{d}{dt}\\int u^{2} \\, dx = -2\\alpha\\int u_x^{2} \\, dx$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [`$-2 \\cdot ${alpha} \\cdot ${g} = ${answer}$.`, `$-2 \\cdot ${alpha} \\cdot ${g} = ${answer}$。`],
              ],
            ],
            [
              `The rate $${answer}$ is negative, as it must be: it could be $0$ only if $u_x = 0$ everywhere, and here $\\int u_x^{2} \\, dx = ${g} > 0$.`,
              `变化率 $${answer}$ 是负的，理应如此：只有处处 $u_x = 0$ 时它才可能为 $0$，而这里 $\\int u_x^{2} \\, dx = ${g} > 0$。`,
            ],
          );
        }),
    ),
    point(
      "the-energy-of-a-single-mode",
      ["The energy of a single mode", "单一模式的能量"],
      [
        "For a pure mode the energy can be computed exactly. The integral of $\\sin^{2}\\frac{n\\pi x}{L}$ over the interval is $\\frac{L}{2}$, whatever the value of $n$, so only the amplitude and length matter. For example, $u = 3\\sin\\frac{2\\pi x}{4}$ on $[0, 4]$ has $\\int_0^{4} u^{2} \\, dx = 9 \\cdot \\frac{4}{2} = 18$.\n\nCheck: $\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}$, and the cosine integrates to $0$ over whole periods, which leaves $9 \\cdot \\frac{4}{2} = 18$.\n\n> **Watch out.** Square the amplitude, and do not divide by the mode number: the integral does not depend on $n$.",
        "对纯模式可以精确算出能量。$\\sin^{2}\\frac{n\\pi x}{L}$ 在区间上的积分是 $\\frac{L}{2}$，与 $n$ 的值无关，所以只有振幅和长度起作用。例如，$[0, 4]$ 上的 $u = 3\\sin\\frac{2\\pi x}{4}$ 有 $\\int_0^{4} u^{2} \\, dx = 9 \\cdot \\frac{4}{2} = 18$。\n\n检验：$\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}$，余弦在整周期上的积分为 $0$，剩下 $9 \\cdot \\frac{4}{2} = 18$。\n\n> **注意。** 振幅要平方，也不要除以模式数：积分与 $n$ 无关。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 15);
          const big = rng.int(2, 15);
          const n = rng.int(1, 9);
          const answer = Q.of(a * a * big, 2);
          const arg = `\\frac{${n === 1 ? "" : n}\\pi x}{${big}}`;
          const misses: Miss[] = [
            [
              a * a * big,
              "That forgets the half: the average of $\\sin^{2}$ is $\\frac{1}{2}$.",
              "那忘了一半：$\\sin^{2}$ 的平均值是 $\\frac{1}{2}$。",
            ],
            [Q.of(a * big, 2), "That forgets to square the amplitude.", "那忘了把振幅平方。"],
            [Q.of(a * a, 2), "That forgets the length of the interval.", "那忘了区间的长度。"],
            [
              Q.of(a * a * big, 2 * n),
              "That divides by the mode number; the integral does not depend on $n$.",
              "那除以了模式数；积分与 $n$ 无关。",
            ],
          ];
          return worked(
            [
              `What is $\\int_0^{${big}} u^{2}\\, dx$ for $u = ${a}\\sin\\left(${arg}\\right)$?`,
              `对 $u = ${a}\\sin\\left(${arg}\\right)$，$\\int_0^{${big}} u^{2}\\, dx$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Integrate the squared sine", "积分正弦的平方"],
                [
                  `$\\int_0^{${big}} \\sin^{2}\\left(${arg}\\right) dx = \\frac{${big}}{2}$, whatever $n$ is.`,
                  `$\\int_0^{${big}} \\sin^{2}\\left(${arg}\\right) dx = \\frac{${big}}{2}$，与 $n$ 无关。`,
                ],
              ],
              [
                ["Multiply by the amplitude squared", "乘振幅的平方"],
                [
                  `$${a}^{2} \\cdot \\frac{${big}}{2} = ${answer.toLatex()}$.`,
                  `$${a}^{2} \\cdot \\frac{${big}}{2} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Writing $\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}$, the cosine runs through ${n === 1 ? "one whole period" : `${n} whole periods`} on $[0, ${big}]$ and integrates to $0$, which leaves $${a * a} \\cdot \\frac{${big}}{2} = ${answer.toLatex()}$.`,
              `写成 $\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}$，余弦在 $[0, ${big}]$ 上走过 ${n} 个整周期，积分为 $0$，剩下 $${a * a} \\cdot \\frac{${big}}{2} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "uniqueness-from-energy",
      ["Uniqueness from energy", "由能量得唯一性"],
      [
        "If two solutions share the same data, their difference starts with zero energy. The energy cannot grow, and it is never negative, so the difference must stay zero, which proves the solution is unique. For example, if two solutions of $u_t = 2u_{xx}$ share their initial and boundary data, their difference $w$ has $\\int w^{2} \\, dx = 0$ at $t = 0$, and so also at $t = 5$.\n\nCheck: $w = 0$ itself solves $w_t = 2w_{xx}$ with zero data, and its energy is $0$ at every time, consistent with the argument.\n\n> **Watch out.** Falling energy does not mean it reaches some other value: starting at $0$, it can neither fall below $0$ nor rise above it.",
        "如果两个解有相同的数据，它们的差的能量从零开始。能量不会增长，也不会为负，所以差始终为零，这就证明了解是唯一的。例如，若 $u_t = 2u_{xx}$ 的两个解有相同的初值和边界数据，它们的差 $w$ 在 $t = 0$ 时 $\\int w^{2} \\, dx = 0$，所以在 $t = 5$ 时也是 $0$。\n\n检验：$w = 0$ 本身满足 $w_t = 2w_{xx}$ 和零数据，它的能量在每个时刻都是 $0$，与这个论证一致。\n\n> **注意。** 能量下降并不意味着它会到达别的值：从 $0$ 开始，它既不能降到 $0$ 以下，也不能升到 $0$ 以上。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const t = rng.int(2, 30);
        const slips: Slip[] = [
          [same(`${a}`), "That is the diffusion coefficient, not an energy.", "那是扩散系数，不是能量。"],
          [
            same(`e^{-${a * t}}`),
            "That decays from $1$; the difference starts with energy $0$, not $1$.",
            "那是从 $1$ 开始衰减；差的能量从 $0$ 开始，而不是 $1$。",
          ],
          [same(`${a * t}`), "That lets the energy grow with time; it cannot grow.", "那让能量随时间增长；它不能增长。"],
        ];
        return chosen(
          rng,
          [
            `Two solutions of $u_t = ${a}u_{xx}$ have the same initial and boundary data. What is the energy of their difference at $t = ${t}$?`,
            `$u_t = ${a}u_{xx}$ 的两个解有相同的初值和边界数据。它们的差在 $t = ${t}$ 时的能量是多少？`,
          ],
          same("0"),
          slips,
          [
            [
              ["Start the difference", "看差的起点"],
              [
                `The difference $w$ solves $w_t = ${a}w_{xx}$ with zero data, so its energy is $0$ at $t = 0$.`,
                `差 $w$ 满足 $w_t = ${a}w_{xx}$ 和零数据，所以它在 $t = 0$ 时能量为 $0$。`,
              ],
            ],
            [
              ["Follow the energy", "跟踪能量"],
              [
                `The energy cannot grow and is never negative, so it is still $0$ at $t = ${t}$.`,
                `能量不能增长，也不会为负，所以在 $t = ${t}$ 时仍是 $0$。`,
              ],
            ],
          ],
          [
            `$w = 0$ itself solves $w_t = ${a}w_{xx}$ with zero data, and its energy is $0$ at every time, consistent with the argument.`,
            `$w = 0$ 本身满足 $w_t = ${a}w_{xx}$ 和零数据，它的能量在每个时刻都是 $0$，与这个论证一致。`,
          ],
        );
      },
    ),
  ],
);

const greens1d = topic(
  "greens-functions-on-an-interval",
  ["Green's Functions on an Interval", "区间上的格林函数"],
  ["Write the solution of a boundary value problem as an integral against a unit point source.", "把边值问题的解写成对单位点源的积分。"],
  ["poissons-equation"],
  [],
  [
    point(
      "evaluating-a-greens-function",
      ["Evaluating a Green's function", "计算格林函数"],
      [
        "For $-u'' = f$ with fixed ends on $[0, L]$, a unit source at $\\xi$ gives a tent. So $G(x, \\xi)$ is $\\frac{x(L - \\xi)}{L}$ for $x \\le \\xi$, and $\\frac{\\xi(L - x)}{L}$ for $x \\ge \\xi$. For example, on $[0, 4]$, $G(1, 3) = \\frac{1 \\cdot (4 - 3)}{4} = \\frac{1}{4}$.\n\nCheck: the tent for $\\xi = 3$ peaks at $\\frac{3 \\cdot 1}{4} = \\frac{3}{4}$ above $x = 3$ and rises in a straight line from $0$, so at $x = 1$ it is $\\frac{1}{3} \\cdot \\frac{3}{4} = \\frac{1}{4}$.\n\n> **Watch out.** Multiply the smaller argument by $L$ minus the larger one; swapping them gives a different number.",
        "对 $[0, L]$ 上两端固定的 $-u'' = f$，$\\xi$ 处的单位源给出一个帐篷形。所以 $x \\le \\xi$ 时 $G(x, \\xi)$ 是 $\\frac{x(L - \\xi)}{L}$，$x \\ge \\xi$ 时是 $\\frac{\\xi(L - x)}{L}$。例如，在 $[0, 4]$ 上，$G(1, 3) = \\frac{1 \\cdot (4 - 3)}{4} = \\frac{1}{4}$。\n\n检验：$\\xi = 3$ 的帐篷形在 $x = 3$ 处达到峰值 $\\frac{3 \\cdot 1}{4} = \\frac{3}{4}$，并从 $0$ 沿直线上升，所以在 $x = 1$ 处是 $\\frac{1}{3} \\cdot \\frac{3}{4} = \\frac{1}{4}$。\n\n> **注意。** 要用较小的自变量乘 $L$ 减较大的自变量；把它们交换会得到不同的数。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(4, 20);
          const x = rng.int(1, big - 1);
          const s = rng.int(1, big - 1);
          if (x === s) return undefined;
          const lo = Math.min(x, s);
          const hi = Math.max(x, s);
          const answer = Q.of(lo * (big - hi), big);
          const peak = Q.of(s * (big - s), big);
          const share = x < s ? Q.of(x, s) : Q.of(big - x, big - s);
          const misses: Miss[] = [
            [
              Q.of(hi * (big - lo), big),
              "That multiplies the larger argument by $L$ minus the smaller one.",
              "那用较大的自变量乘 $L$ 减较小的自变量。",
            ],
            [
              Q.of(x * s, big),
              "That multiplies the two arguments; one factor is a distance from the far end.",
              "那把两个自变量相乘了；其中一个因子是到另一端的距离。",
            ],
            [Q.of(big - hi, big), "That forgets the factor given by the smaller argument.", "那忘了较小自变量给出的因子。"],
            [lo * (big - hi), "That forgets to divide by $L$.", "那忘了除以 $L$。"],
          ];
          return worked(
            [
              `For $-u'' = f$ on $[0, ${big}]$ with fixed ends, what is $G(${x}, ${s})$?`,
              `对 $[0, ${big}]$ 上两端固定的 $-u'' = f$，$G(${x}, ${s})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Order the arguments", "排列自变量"],
                [`The smaller argument is ${lo} and the larger is ${hi}.`, `较小的自变量是 ${lo}，较大的是 ${hi}。`],
              ],
              [
                ["Apply the formula", "代入公式"],
                [
                  `$G = \\frac{${lo}(${big} - ${hi})}{${big}} = ${answer.toLatex()}$.`,
                  `$G = \\frac{${lo}(${big} - ${hi})}{${big}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The tent for $\\xi = ${s}$ peaks at $${peak.toLatex()}$ above $x = ${s}$ and is straight on each side, so at $x = ${x}$ it is $${share.toLatex()} \\cdot ${peak.toLatex()} = ${answer.toLatex()}$.`,
              `$\\xi = ${s}$ 的帐篷形在 $x = ${s}$ 处达到峰值 $${peak.toLatex()}$，两侧都是直线，所以在 $x = ${x}$ 处是 $${share.toLatex()} \\cdot ${peak.toLatex()} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "the-deflection-under-a-point-load",
      ["The deflection under a point load", "点载荷下的挠度"],
      [
        "A point source of strength $P$ gives $u(x) = PG(x, \\xi)$. Because the problem is linear, several point loads simply add, and symmetry of $G$ means that swapping the load and the observer gives the same result. For example, on $[0, 4]$ loads of $2$ at $1$ and at $2$ give, at $x = 3$, $2G(3, 1) + 2G(3, 2) = 2 \\cdot \\frac{1}{4} + 2 \\cdot \\frac{2}{4} = \\frac{3}{2}$.\n\nCheck: by symmetry, a single load of $2$ at $x = 3$ would give $2G(1, 3) = \\frac{1}{2}$ at $1$ and $2G(2, 3) = 1$ at $2$, the same two numbers, adding to $\\frac{3}{2}$.\n\n> **Watch out.** Add the responses to both loads, each multiplied by its strength, and divide each $G$ by $L$.",
        "强度为 $P$ 的点源给出 $u(x) = PG(x, \\xi)$。因为问题是线性的，多个点载荷直接相加，而 $G$ 的对称性意味着交换载荷和观察点结果相同。例如，在 $[0, 4]$ 上，位于 $1$ 和 $2$ 的大小为 $2$ 的载荷在 $x = 3$ 处给出 $2G(3, 1) + 2G(3, 2) = 2 \\cdot \\frac{1}{4} + 2 \\cdot \\frac{2}{4} = \\frac{3}{2}$。\n\n检验：由对称性，放在 $x = 3$ 的单个大小为 $2$ 的载荷在 $1$ 处给出 $2G(1, 3) = \\frac{1}{2}$，在 $2$ 处给出 $2G(2, 3) = 1$，是同样的两个数，和为 $\\frac{3}{2}$。\n\n> **注意。** 要把两个载荷的响应都加上，各乘它的强度，并且每个 $G$ 都要除以 $L$。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(4, 16);
          const p = rng.int(2, 15);
          const s1 = rng.int(1, big - 1);
          const s2 = s1 === big - 1 ? s1 - 1 : s1 + 1;
          const x = rng.int(1, big - 1);
          const g = (u: number, v: number) => Math.min(u, v) * (big - Math.max(u, v));
          const g1 = Q.of(g(x, s1), big);
          const g2 = Q.of(g(x, s2), big);
          const total = p * g(x, s1) + p * g(x, s2);
          const answer = Q.of(total, big);
          const misses: Miss[] = [
            [Q.of(p * g(x, s1), big), `That counts only the load at ${s1}; the loads add.`, `那只算了 ${s1} 处的载荷；载荷要相加。`],
            [Q.of(2 * total, big), "That counts each load twice.", "那把每个载荷数了两次。"],
            [total, "That forgets to divide by $L$.", "那忘了除以 $L$。"],
            [g1.add(g2), `That forgets the strength $${p}$ of the loads.`, `那忘了载荷的强度 $${p}$。`],
          ];
          return worked(
            [
              `On $[0, ${big}]$ with fixed ends, equal loads of ${p} sit at ${s1} and ${s2}. What is the solution of $-u'' = f$ at $x = ${x}$?`,
              `在 $[0, ${big}]$ 上两端固定，大小为 ${p} 的相等载荷位于 ${s1} 和 ${s2}。$-u'' = f$ 的解在 $x = ${x}$ 处是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Evaluate the kernel", "计算核"],
                [
                  `$G(${x}, ${s1}) = ${g1.toLatex()}$ and $G(${x}, ${s2}) = ${g2.toLatex()}$.`,
                  `$G(${x}, ${s1}) = ${g1.toLatex()}$，$G(${x}, ${s2}) = ${g2.toLatex()}$。`,
                ],
              ],
              [
                ["Add the loads", "把载荷相加"],
                [
                  `The problem is linear, so $u(${x}) = ${p} \\cdot ${g1.toLatex()} + ${p} \\cdot ${g2.toLatex()} = ${answer.toLatex()}$.`,
                  `问题是线性的，所以 $u(${x}) = ${p} \\cdot ${g1.toLatex()} + ${p} \\cdot ${g2.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `By symmetry $G(${s1}, ${x}) = ${g1.toLatex()}$ and $G(${s2}, ${x}) = ${g2.toLatex()}$ as well, and $${p}\\left(${g1.toLatex()} + ${g2.toLatex()}\\right) = ${answer.toLatex()}$.`,
              `由对称性，$G(${s1}, ${x}) = ${g1.toLatex()}$，$G(${s2}, ${x}) = ${g2.toLatex()}$，而 $${p}\\left(${g1.toLatex()} + ${g2.toLatex()}\\right) = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "integrating-against-the-kernel",
        ["Integrating against the kernel", "对核积分"],
        [
          "For a distributed source, integrating $G$ against $f$ gives the solution. With a constant source $f$, this integral equals the parabola $\\frac{f}{2}x(L - x)$, which agrees with solving the equation directly. For example, in the figure $f = 1$ and $L = 4$: the dashed tents for sources at $1$, $2$ and $3$ add up to $u = \\frac{x(4 - x)}{2}$, whose top is $u(2) = \\frac{2 \\cdot 2}{2} = 2$.\n\nCheck: $u = \\frac{x(4 - x)}{2} = 2x - \\frac{x^{2}}{2}$ has $u'' = -1$, so $-u'' = 1$, and it vanishes at $x = 0$ and $x = 4$.\n\n> **Watch out.** Keep the factor $\\frac{1}{2}$; $f x(L - x)$ is twice the solution.",
          "对分布源，把 $G$ 对 $f$ 积分就得到解。源为常数 $f$ 时，这个积分等于抛物线 $\\frac{f}{2}x(L - x)$，与直接解方程一致。例如，图中 $f = 1$，$L = 4$：源在 $1$、$2$、$3$ 处的虚线帐篷形加起来得 $u = \\frac{x(4 - x)}{2}$，顶点是 $u(2) = \\frac{2 \\cdot 2}{2} = 2$。\n\n检验：$u = \\frac{x(4 - x)}{2} = 2x - \\frac{x^{2}}{2}$ 满足 $u'' = -1$，所以 $-u'' = 1$，且在 $x = 0$ 和 $x = 4$ 处为零。\n\n> **注意。** 要保留因子 $\\frac{1}{2}$；$f x(L - x)$ 是解的两倍。",
        ],
        (rng) =>
          until(() => {
            const big = rng.int(2, 20);
            const x = rng.int(1, big - 1);
            const f = rng.int(1, 15);
            const answer = Q.of(f * x * (big - x), 2);
            const half = Q.of(f, 2);
            const coef = half.eq(Q.one) ? "" : half.toLatex();
            const misses: Miss[] = [
              [f * x * (big - x), "That forgets the factor $\\frac{1}{2}$.", "那忘了因子 $\\frac{1}{2}$。"],
              [
                Q.of(f * x * x, 2),
                "That uses $x^{2}$ in place of $x(L - x)$; the solution must vanish at $x = L$.",
                "那用 $x^{2}$ 代替了 $x(L - x)$；解在 $x = L$ 处必须为零。",
              ],
              [Q.of(x * (big - x), 2), `That forgets the source $f = ${f}$.`, `那忘了源 $f = ${f}$。`],
              [
                Q.of(-f * x * (big - x), 2),
                "That has the sign wrong: a positive source in $-u'' = f$ pushes $u$ up.",
                "那符号错了：$-u'' = f$ 中的正源使 $u$ 上升。",
              ],
            ];
            return worked(
              [
                `Solve $-u'' = ${f}$ on $[0, ${big}]$ with fixed ends, and give $u(${x})$.`,
                `解 $[0, ${big}]$ 上两端固定的 $-u'' = ${f}$，给出 $u(${x})$。`,
              ],
              answer,
              misses,
              [
                [
                  ["Integrate against the kernel", "对核积分"],
                  [
                    `Integrating the constant source against $G$ gives $u(x) = ${coef}x(${big} - x)$.`,
                    `常数源对 $G$ 积分得 $u(x) = ${coef}x(${big} - x)$。`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `$u(${x}) = ${coef === "" ? "" : `${coef} \\cdot `}${x} \\cdot ${big - x} = ${answer.toLatex()}$.`,
                    `$u(${x}) = ${coef === "" ? "" : `${coef} \\cdot `}${x} \\cdot ${big - x} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `$u = ${coef}x(${big} - x)$ has $u'' = -${f}$, so $-u'' = ${f}$, and it vanishes at $x = 0$ and $x = ${big}$.`,
                `$u = ${coef}x(${big} - x)$ 满足 $u'' = -${f}$，所以 $-u'' = ${f}$，且在 $x = 0$ 和 $x = ${big}$ 处为零。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["greens-functions-on-an-interval#integrating-against-the-kernel"],
    },
  ],
);

const images = topic(
  "the-method-of-images",
  ["The Method of Images", "镜像法"],
  ["Meet a boundary condition by adding mirror sources.", "通过增加镜像源满足边界条件。"],
  ["greens-functions-on-an-interval", "reflection-at-a-boundary"],
  [],
  [
    point(
      "where-the-image-goes",
      ["Where the image goes", "镜像在哪里"],
      [
        "A source near a straight wall has an image at the mirror point across the wall. The two together make the boundary condition automatic, and the image lies outside the region so it adds no new source inside. For example, a source at $x = 5$ with a wall at $x = 2$ is $3$ from the wall, so its image is at $2 - 3 = -1$.\n\nCheck: the wall is the midpoint of the source and the image, $\\frac{5 + (-1)}{2} = 2$.\n\n> **Watch out.** Reflect across the wall, not across $x = 0$; the image is as far beyond the wall as the source is in front of it.",
        "直壁附近的源在关于壁的镜像点上有一个镜像。两者合起来自动满足边界条件，而镜像在区域外，所以不增加区域内的新源。例如，源在 $x = 5$，壁在 $x = 2$，源到壁的距离是 $3$，所以镜像在 $2 - 3 = -1$。\n\n检验：壁是源和镜像的中点，$\\frac{5 + (-1)}{2} = 2$。\n\n> **注意。** 要关于壁反射，而不是关于 $x = 0$；镜像在壁另一侧的距离与源在壁前的距离相同。",
      ],
      (rng) =>
        until(() => {
          const w = rng.int(-20, 20);
          const d = rng.int(1, 25);
          const answer = w - d;
          const misses: Miss[] = [
            [w + d, "That is the source itself.", "那是源本身。"],
            [-(w + d), "That reflects across $x = 0$ instead of across the wall.", "那是关于 $x = 0$ 反射，而不是关于壁。"],
            [w, "That is the wall; the image lies beyond it.", "那是壁；镜像在它的另一侧。"],
            [w - 2 * d, "That goes twice as far beyond the wall as the source is in front of it.", "那在壁另一侧走了源到壁距离的两倍。"],
          ];
          return worked(
            [
              `A source sits at $x = ${w + d}$, to the right of a wall at $x = ${w}$. Where is its image?`,
              `一个源位于 $x = ${w + d}$，在 $x = ${w}$ 处的壁的右边。它的镜像在哪里？`,
            ],
            answer,
            misses,
            [
              [
                ["Measure the distance", "量距离"],
                [
                  `The source is $${w + d} - ${wrap(w)} = ${d}$ to the right of the wall.`,
                  `源在壁右边 $${w + d} - ${wrap(w)} = ${d}$ 处。`,
                ],
              ],
              [
                ["Step across", "跨到另一侧"],
                [
                  `The image is ${d} to the left of the wall, at $${w} - ${d} = ${answer}$.`,
                  `镜像在壁左边 ${d} 处，即 $${w} - ${d} = ${answer}$。`,
                ],
              ],
            ],
            [
              `The wall is the midpoint of the source and the image: $\\frac{${w + d} + ${wrap(answer)}}{2} = ${w}$.`,
              `壁是源和镜像的中点：$\\frac{${w + d} + ${wrap(answer)}}{2} = ${w}$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "odd-or-even-reflection",
        ["Odd or even reflection", "奇反射还是偶反射"],
        [
          "A fixed end needs zero value, so the image has the opposite sign and the extension is odd. An insulated end needs zero slope, so the image has the same sign and the extension is even. For example, data with $f(2) = 5$ extend to $-5$ at $x = -2$ for a fixed end, as on the left of the figure, and to $5$ for an insulated end, as on the right.\n\nCheck: the odd extension has $f(-x) = -f(x)$, so at $x = 0$ it gives $f(0) = -f(0)$, that is $f(0) = 0$; the even extension is symmetric, so its slope at $0$ is $0$.\n\n> **Watch out.** Fixed goes with odd and insulated with even; the extended value is the reflected data, not the boundary value $0$.",
          "固定端需要值为零，所以镜像符号相反，延拓是奇的。绝热端需要斜率为零，所以镜像符号相同，延拓是偶的。例如，数据 $f(2) = 5$ 在固定端时延拓到 $x = -2$ 处是 $-5$，如图左；在绝热端时是 $5$，如图右。\n\n检验：奇延拓满足 $f(-x) = -f(x)$，所以在 $x = 0$ 处 $f(0) = -f(0)$，即 $f(0) = 0$；偶延拓是对称的，所以它在 $0$ 处的斜率为 $0$。\n\n> **注意。** 固定端对应奇延拓，绝热端对应偶延拓；延拓的值是反射后的数据，而不是边界值 $0$。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(2, 30);
            const x = rng.int(1, 30);
            const fixed = rng.bool();
            const answer = fixed ? -a : a;
            const misses: Miss[] = [
              [
                -answer,
                fixed
                  ? "That is the even extension; a fixed end needs the odd one."
                  : "That is the odd extension; an insulated end needs the even one.",
                fixed ? "那是偶延拓；固定端需要奇延拓。" : "那是奇延拓；绝热端需要偶延拓。",
              ],
              [0, "That is the value at the boundary, not the extended data at $-x$.", "那是边界上的值，不是 $-x$ 处延拓的数据。"],
              [x, "That is the distance from the end, not a value of the data.", "那是到端点的距离，不是数据的值。"],
            ];
            return worked(
              [
                `Data on $x > 0$ has $f(${x}) = ${a}$. The boundary at 0 is ${fixed ? "fixed at zero" : "insulated"}. What is the extended data at $x = -${x}$?`,
                `$x > 0$ 上的数据有 $f(${x}) = ${a}$。0 处的边界${fixed ? "固定为零" : "绝热"}。延拓后的数据在 $x = -${x}$ 处是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Choose the extension", "选择延拓"],
                  fixed
                    ? ["A fixed end needs $u = 0$ there, so the extension is odd.", "固定端要求那里 $u = 0$，所以延拓是奇的。"]
                    : ["An insulated end needs $u_x = 0$ there, so the extension is even.", "绝热端要求那里 $u_x = 0$，所以延拓是偶的。"],
                ],
                [
                  ["Reflect the value", "反射这个值"],
                  [`$f(-${x}) = ${fixed ? "-" : ""}f(${x}) = ${answer}$.`, `$f(-${x}) = ${fixed ? "-" : ""}f(${x}) = ${answer}$。`],
                ],
              ],
              fixed
                ? [
                    `The source and its image give $${a} + (${-a}) = 0$ when they meet at the end, which is what a fixed end needs.`,
                    `源和它的镜像在端点相遇时给出 $${a} + (${-a}) = 0$，正是固定端所要求的。`,
                  ]
                : [
                    `The extension takes the value $${a}$ at both $${x}$ and $-${x}$, so it is symmetric about $0$ and has slope $0$ there, which is what an insulated end needs.`,
                    `延拓在 $${x}$ 和 $-${x}$ 处都取值 $${a}$，所以关于 $0$ 对称，在那里斜率为 $0$，正是绝热端所要求的。`,
                  ],
            );
          }),
      ),
      figure: pdeDrawings1["the-method-of-images#odd-or-even-reflection"],
    },
    {
      ...point(
        "a-wave-reflected-from-a-fixed-end",
        ["A wave reflected from a fixed end", "从固定端反射的波"],
        [
          "With d'Alembert's formula on a half line, a pulse moves toward the fixed end, and the odd image moves in from the other side. The image emerges as the reflection, flipped upside down, after the original passes the end. For example, in the figure $c = 1$ and the pulse starts at $x = 3$: it reaches the end at $t = 3$, and at $t = 5$ the flipped image has emerged at $x = 2$.\n\nCheck: the image starts at $x = -3$ and moves right at speed $1$, so at $t = 5$ it is at $-3 + 5 = 2$.\n\n> **Watch out.** After the reflection the pulse is upside down, but its position is still measured from the end on the real string.",
          "在半直线上用达朗贝尔公式时，脉冲向固定端运动，奇镜像从另一侧进来。原波经过端点后，镜像就作为反射出现，并且上下翻转。例如，图中 $c = 1$，脉冲从 $x = 3$ 出发：它在 $t = 3$ 时到达端点，在 $t = 5$ 时翻转的镜像出现在 $x = 2$。\n\n检验：镜像从 $x = -3$ 出发，以速度 $1$ 向右运动，所以在 $t = 5$ 时位于 $-3 + 5 = 2$。\n\n> **注意。** 反射后脉冲上下颠倒，但它的位置仍从真实弦上的端点量起。",
        ],
        (rng) =>
          until(() => {
            const c = rng.int(1, 9);
            const k = rng.int(1, 9);
            const x0 = c * k;
            const h = rng.int(2, 30);
            const extra = rng.int(1, 9);
            const t = k + extra;
            const answer = c * extra;
            const misses: Miss[] = [
              [
                -c * extra,
                "That is where the original pulse would be on the unfolded line; on the real string it is the image that is seen.",
                "那是原脉冲在展开直线上的位置；真实弦上看到的是镜像。",
              ],
              [
                x0 - c * extra,
                "That moves the pulse back from its start; it travels to the end first and then returns.",
                "那是从起点往回移；脉冲先走到端点再返回。",
              ],
              [c * t, "That is the total distance travelled, not the position.", "那是走过的总路程，不是位置。"],
            ];
            return worked(
              [
                `A pulse of height ${h} starts at $x = ${x0}$ moving left at speed ${c} toward a fixed end at 0. At $t = ${t}$, where is its center?`,
                `高度为 ${h} 的脉冲从 $x = ${x0}$ 出发，以速度 ${c} 向左朝 0 处的固定端运动。在 $t = ${t}$ 时它的中心在哪里？`,
              ],
              answer,
              misses,
              [
                [
                  ["Reach the end", "到达端点"],
                  [
                    `The pulse reaches the end at $t = ${c === 1 ? "" : `\\frac{${x0}}{${c}} = `}${k}$.`,
                    `脉冲在 $t = ${c === 1 ? "" : `\\frac{${x0}}{${c}} = `}${k}$ 时到达端点。`,
                  ],
                ],
                [
                  ["Come back", "返回"],
                  [
                    `Then it moves right, upside down, for $${t} - ${k} = ${extra}$ more ${extra === 1 ? "time unit" : "time units"}, to $x = ${c === 1 ? "" : `${c} \\cdot `}${extra}${c === 1 ? "" : ` = ${answer}`}$.`,
                    `然后它上下翻转着向右运动 $${t} - ${k} = ${extra}$ 个时间单位，到达 $x = ${c === 1 ? "" : `${c} \\cdot `}${extra}${c === 1 ? "" : ` = ${answer}`}$。`,
                  ],
                ],
              ],
              [
                `The odd image starts at $x = -${x0}$ and moves right at speed ${c}, so at $t = ${t}$ it is at $-${x0} + ${c * t} = ${answer}$, with height $-${h}$.`,
                `奇镜像从 $x = -${x0}$ 出发，以速度 ${c} 向右运动，所以在 $t = ${t}$ 时位于 $-${x0} + ${c * t} = ${answer}$，高度为 $-${h}$。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["the-method-of-images#a-wave-reflected-from-a-fixed-end"],
    },
  ],
);

const forcedWave = topic(
  "the-wave-equation-with-a-source",
  ["The Wave Equation With a Source", "带源的波动方程"],
  ["Add a forcing term to the wave equation, and meet resonance.", "给波动方程加上外力项，并认识共振。"],
  ["dalemberts-formula", "duhamels-principle"],
  [],
  [
    point(
      "a-uniform-force",
      ["A uniform force", "均匀力"],
      [
        "If the force does not depend on $x$ and the data are zero, then the solution does not either, and it obeys $u'' = f$. So the displacement grows like $\\frac{f t^{2}}{2}$, just as for constant acceleration. For example, $u_{tt} = 4u_{xx} + 6$ with zero data gives $u = 3t^{2}$, which is $12$ at $t = 2$.\n\nCheck: $u = 3t^{2}$ has $u_{tt} = 6$ and $u_{xx} = 0$, so $6 = 4 \\cdot 0 + 6$, and $u = u_t = 0$ at $t = 0$.\n\n> **Watch out.** The wave speed plays no part here, and the factor $\\frac{1}{2}$ comes from integrating twice.",
        "如果力与 $x$ 无关且数据为零，那么解也与 $x$ 无关，它满足 $u'' = f$。所以位移按 $\\frac{f t^{2}}{2}$ 增长，就像匀加速运动一样。例如，零数据的 $u_{tt} = 4u_{xx} + 6$ 给出 $u = 3t^{2}$，在 $t = 2$ 时是 $12$。\n\n检验：$u = 3t^{2}$ 满足 $u_{tt} = 6$，$u_{xx} = 0$，所以 $6 = 4 \\cdot 0 + 6$，且 $t = 0$ 时 $u = u_t = 0$。\n\n> **注意。** 这里波速不起作用；因子 $\\frac{1}{2}$ 来自两次积分。",
      ],
      (rng) =>
        until(() => {
          const f = rng.int(2, 25);
          const t = rng.int(1, 12);
          const c = rng.int(2, 9);
          const answer = Q.of(f * t * t, 2);
          const half = Q.of(f, 2);
          const coef = half.eq(Q.one) ? "" : half.toLatex();
          const misses: Miss[] = [
            [f * t * t, "That forgets the factor $\\frac{1}{2}$ from integrating twice.", "那忘了两次积分产生的因子 $\\frac{1}{2}$。"],
            [Q.of(f * t, 2), "That integrates only once in time.", "那只对时间积分了一次。"],
            [
              Q.of(f * t * t, 2 * c),
              "That divides by the wave speed; it plays no part when $u$ does not depend on $x$.",
              "那除以了波速；$u$ 与 $x$ 无关时波速不起作用。",
            ],
            [
              Q.of(c * c * f * t * t, 2),
              "That multiplies by $c^{2}$; the term $c^{2}u_{xx}$ vanishes.",
              "那乘了 $c^{2}$；$c^{2}u_{xx}$ 这一项为零。",
            ],
          ];
          return worked(
            [
              `Solve $u_{tt} = ${c * c}u_{xx} + ${f}$ on the whole line with zero initial data, and give $u$ at $t = ${t}$.`,
              `在整条直线上解 $u_{tt} = ${c * c}u_{xx} + ${f}$，初值为零，给出 $t = ${t}$ 时的 $u$。`,
            ],
            answer,
            misses,
            [
              [
                ["Drop the space dependence", "去掉空间依赖"],
                [
                  `Nothing depends on $x$, so $u_{xx} = 0$ and $u'' = ${f}$ with $u(0) = u'(0) = 0$, which gives $u = ${coef}t^{2}$.`,
                  `没有量依赖 $x$，所以 $u_{xx} = 0$，$u'' = ${f}$，$u(0) = u'(0) = 0$，得 $u = ${coef}t^{2}$。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `At $t = ${t}$, $u = ${coef === "" ? "" : `${coef} \\cdot `}${t * t} = ${answer.toLatex()}$.`,
                  `在 $t = ${t}$ 时，$u = ${coef === "" ? "" : `${coef} \\cdot `}${t * t} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$u = ${coef}t^{2}$ has $u_{tt} = ${f}$ and $u_{xx} = 0$, so $${f} = ${c * c} \\cdot 0 + ${f}$, and $u = u_t = 0$ at $t = 0$.`,
              `$u = ${coef}t^{2}$ 满足 $u_{tt} = ${f}$，$u_{xx} = 0$，所以 $${f} = ${c * c} \\cdot 0 + ${f}$，且 $t = 0$ 时 $u = u_t = 0$。`,
            ],
          );
        }),
    ),
    point(
      "the-natural-frequencies",
      ["The natural frequencies", "固有频率"],
      [
        "A string of length $L$ with fixed ends has natural frequencies $\\omega_n = \\frac{n\\pi c}{L}$. Forcing a string at one of these frequencies pumps energy steadily into that mode, and this phenomenon is called resonance. For example, a string with $c = 3$ and length $2$ has $\\omega_2 = \\frac{2\\pi \\cdot 3}{2} = 3\\pi$.\n\nCheck: the mode $\\sin(\\pi x)\\cos(3\\pi t)$ has $u_{tt} = -9\\pi^{2}u$ and $9u_{xx} = -9\\pi^{2}u$, so it solves $u_{tt} = 9u_{xx}$.\n\n> **Watch out.** The frequency in time is the wave speed times the wave number $\\frac{n\\pi}{L}$; do not leave out $c$.",
        "长度为 $L$、两端固定的弦的固有频率是 $\\omega_n = \\frac{n\\pi c}{L}$。以这些频率之一驱动弦时，能量会持续注入该模式，这种现象叫共振。例如，$c = 3$、长度为 $2$ 的弦有 $\\omega_2 = \\frac{2\\pi \\cdot 3}{2} = 3\\pi$。\n\n检验：模式 $\\sin(\\pi x)\\cos(3\\pi t)$ 满足 $u_{tt} = -9\\pi^{2}u$ 和 $9u_{xx} = -9\\pi^{2}u$，所以它满足 $u_{tt} = 9u_{xx}$。\n\n> **注意。** 时间上的频率是波速乘波数 $\\frac{n\\pi}{L}$；不要漏掉 $c$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(1, 9);
          const c = rng.int(2, 25);
          const big = rng.int(1, 12);
          const answer = Q.of(n * c, big);
          const k = Q.of(n, big);
          const misses: Miss[] = [
            [k, "That is the wave number; multiply by the speed $c$.", "那是波数；还要乘速度 $c$。"],
            [Q.of(c, big), "That is the first frequency; multiply by the mode number.", "那是第一个频率；还要乘模式数。"],
            [
              Q.of(n * c, 2 * big),
              "That fits a quarter wave; a string with two fixed ends fits half waves.",
              "那容纳的是四分之一波；两端固定的弦容纳的是半波。",
            ],
            [n * c, "That forgets to divide by the length.", "那忘了除以长度。"],
          ];
          return worked(
            [
              `A string with $c = ${c}$ and length ${big} has fixed ends. Natural frequency number ${n} is $m\\pi$. What is $m$?`,
              `$c = ${c}$、长度为 ${big} 的弦两端固定。第 ${n} 个固有频率是 $m\\pi$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the wave number", "求波数"],
                [
                  `Mode ${n} has the wave number $\\frac{n\\pi}{L} = ${piOver(n, big)}$.`,
                  `第 ${n} 个模式的波数是 $\\frac{n\\pi}{L} = ${piOver(n, big)}$。`,
                ],
              ],
              [
                ["Multiply by the speed", "乘速度"],
                [
                  `$\\omega_{${n}} = ${c} \\cdot ${piOver(n, big)} = ${piOver(n * c, big)}$, so $m = ${answer.toLatex()}$.`,
                  `$\\omega_{${n}} = ${c} \\cdot ${piOver(n, big)} = ${piOver(n * c, big)}$，所以 $m = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The mode $\\sin\\left(${piOver(n, big)} x\\right)\\cos\\left(${piOver(n * c, big)} t\\right)$ has $\\omega^{2} = ${answer.mul(answer).toLatex()}\\pi^{2}$, which is $c^{2} = ${c * c}$ times $\\left(${piOver(n, big)}\\right)^{2} = ${k.mul(k).toLatex()}\\pi^{2}$.`,
              `模式 $\\sin\\left(${piOver(n, big)} x\\right)\\cos\\left(${piOver(n * c, big)} t\\right)$ 的 $\\omega^{2} = ${answer.mul(answer).toLatex()}\\pi^{2}$，正是 $c^{2} = ${c * c}$ 乘 $\\left(${piOver(n, big)}\\right)^{2} = ${k.mul(k).toLatex()}\\pi^{2}$。`,
            ],
          );
        }),
    ),
    point(
      "growth-at-resonance",
      ["Growth at resonance", "共振时的增长"],
      [
        "A mode forced at its own frequency obeys $b'' + \\omega^{2} b = F\\cos(\\omega t)$. Its solution is $\\frac{F}{2\\omega}t\\sin(\\omega t)$, so the amplitude grows in proportion to time rather than staying bounded. For example, $b'' + 9b = 12\\cos(3t)$ has $\\omega = 3$, so at $t = 4$ the amplitude is $\\frac{12 \\cdot 4}{2 \\cdot 3} = 8$.\n\nCheck: the amplitude grows by $\\frac{12}{6} = 2$ per unit time, and $2 \\cdot 4 = 8$.\n\n> **Watch out.** The equation shows $\\omega^{2}$; take its square root before dividing.",
        "以自身频率驱动的模式满足 $b'' + \\omega^{2} b = F\\cos(\\omega t)$。它的解是 $\\frac{F}{2\\omega}t\\sin(\\omega t)$，所以振幅与时间成正比增长，而不是保持有界。例如，$b'' + 9b = 12\\cos(3t)$ 有 $\\omega = 3$，所以在 $t = 4$ 时振幅是 $\\frac{12 \\cdot 4}{2 \\cdot 3} = 8$。\n\n检验：振幅每单位时间增加 $\\frac{12}{6} = 2$，而 $2 \\cdot 4 = 8$。\n\n> **注意。** 方程中出现的是 $\\omega^{2}$；除之前要先开平方。",
      ],
      (rng) =>
        until(() => {
          const f = rng.int(2, 30);
          const w = rng.int(2, 15);
          const t = rng.int(2, 15);
          const answer = Q.of(f * t, 2 * w);
          const rate = Q.of(f, 2 * w);
          const misses: Miss[] = [
            [rate, "That forgets the factor $t$: the amplitude grows with time.", "那忘了因子 $t$：振幅随时间增长。"],
            [Q.of(f * t, w), "That drops the $2$ in $2\\omega$.", "那漏掉了 $2\\omega$ 中的 $2$。"],
            [
              Q.of(f * t, 2 * w * w),
              `That divides by $\\omega^{2} = ${w * w}$; the formula has $\\omega = ${w}$.`,
              `那除以了 $\\omega^{2} = ${w * w}$；公式里是 $\\omega = ${w}$。`,
            ],
            [
              Q.of(f, w * w),
              "That is the size of a response away from resonance, which does not grow.",
              "那是远离共振时响应的大小，它不增长。",
            ],
          ];
          return worked(
            [
              `For $b'' + ${w * w}b = ${f}\\cos(${w}t)$ with zero start, what is the amplitude $\\frac{Ft}{2\\omega}$ at $t = ${t}$?`,
              `对 $b'' + ${w * w}b = ${f}\\cos(${w}t)$，从零开始，$t = ${t}$ 时的振幅 $\\frac{Ft}{2\\omega}$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Read the values", "读出数值"],
                [
                  `$F = ${f}$, and $\\omega^{2} = ${w * w}$ gives $\\omega = ${w}$.`,
                  `$F = ${f}$，由 $\\omega^{2} = ${w * w}$ 得 $\\omega = ${w}$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `$\\frac{${f} \\cdot ${t}}{2 \\cdot ${w}} = ${answer.toLatex()}$.`,
                  `$\\frac{${f} \\cdot ${t}}{2 \\cdot ${w}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The amplitude grows by $\\frac{F}{2\\omega} = ${rate.toLatex()}$ per unit time, and $${rate.toLatex()} \\cdot ${t} = ${answer.toLatex()}$.`,
              `振幅每单位时间增加 $\\frac{F}{2\\omega} = ${rate.toLatex()}$，而 $${rate.toLatex()} \\cdot ${t} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

const wave3d = topic(
  "waves-in-three-dimensions",
  ["Waves in Three Dimensions", "三维中的波"],
  [
    "See how spherical waves weaken with distance, and why signals in 3D stay sharp.",
    "看球面波如何随距离减弱，以及为什么三维信号保持清晰。",
  ],
  ["domains-of-dependence", "the-vibrating-membrane"],
  [],
  [
    point(
      "the-amplitude-of-a-spherical-wave",
      ["The amplitude of a spherical wave", "球面波的振幅"],
      [
        "Spherically symmetric solutions of the wave equation have the form $\\frac{F(r - ct)}{r}$. The product $ru$ obeys the one-dimensional wave equation, so the amplitude falls in proportion to $\\frac{1}{r}$. For example, a spherical wave with amplitude $6$ at the radius $2$ has amplitude $6 \\cdot \\frac{2}{6} = 2$ at the radius $6$.\n\nCheck: the product of radius and amplitude stays the same, $2 \\cdot 6 = 6 \\cdot 2 = 12$.\n\n> **Watch out.** The amplitude falls like $\\frac{1}{r}$; it is the energy density, the square of the amplitude, that falls like $\\frac{1}{r^{2}}$.",
        "波动方程的球对称解形如 $\\frac{F(r - ct)}{r}$。乘积 $ru$ 满足一维波动方程，所以振幅与 $\\frac{1}{r}$ 成正比下降。例如，球面波在半径 $2$ 处振幅为 $6$，在半径 $6$ 处振幅是 $6 \\cdot \\frac{2}{6} = 2$。\n\n检验：半径与振幅之积不变，$2 \\cdot 6 = 6 \\cdot 2 = 12$。\n\n> **注意。** 振幅按 $\\frac{1}{r}$ 下降；按 $\\frac{1}{r^{2}}$ 下降的是能量密度，即振幅的平方。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 40);
          const r1 = rng.int(1, 12);
          const r2 = r1 * rng.int(2, 6);
          const answer = Q.of(a * r1, r2);
          const misses: Miss[] = [
            [
              Q.of(a * r1 * r1, r2 * r2),
              "That makes the amplitude fall like $\\frac{1}{r^{2}}$; that is the rule for the energy density.",
              "那让振幅按 $\\frac{1}{r^{2}}$ 下降；那是能量密度的规律。",
            ],
            [a, "That keeps the amplitude fixed; it falls as the wave spreads.", "那让振幅不变；波扩散时振幅下降。"],
            [Q.of(a * r2, r1), "That makes the amplitude grow with distance.", "那让振幅随距离增长。"],
          ];
          return worked(
            [
              `A spherical wave has amplitude ${a} at the radius ${r1}. What is its amplitude at the radius ${r2}?`,
              `球面波在半径 ${r1} 处的振幅是 ${a}。它在半径 ${r2} 处的振幅是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Use the rule", "使用规律"],
                [
                  `The amplitude varies as $\\frac{1}{r}$, so it is multiplied by $${Q.of(r1, r2).toLatex()}$.`,
                  `振幅与 $\\frac{1}{r}$ 成正比，所以乘 $${Q.of(r1, r2).toLatex()}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${a} \\cdot ${Q.of(r1, r2).toLatex()} = ${answer.toLatex()}$.`,
                  `$${a} \\cdot ${Q.of(r1, r2).toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The product $ru$ stays the same: $${r1} \\cdot ${a} = ${a * r1}$ and $${r2} \\cdot ${pq(answer)} = ${a * r1}$.`,
              `乘积 $ru$ 不变：$${r1} \\cdot ${a} = ${a * r1}$，$${r2} \\cdot ${pq(answer)} = ${a * r1}$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "when-a-signal-is-heard",
        ["When a signal is heard", "何时听到信号"],
        [
          "Kirchhoff's formula takes averages over a sphere of radius $ct$. So in 3D a brief signal starting in a ball reaches a listener only while the sphere of radius $ct$ crosses that ball, and this is Huygens' principle. For example, in the figure the ball has radius $a = 1$ and the listener is at distance $d = 5$, so the sphere first touches the ball at $ct = 4$ and leaves it at $ct = 6$; with $c = 2$ the listener hears the signal from $t = 2$ to $t = 3$.\n\nCheck: the signal lasts $3 - 2 = 1$, the time $\\frac{2a}{c} = \\frac{2}{2}$ that the sphere takes to cross the ball's diameter.\n\n> **Watch out.** The first sound comes from the near side of the ball, at $ct = d - a$, and the last from the far side, at $ct = d + a$; neither is $\\frac{d}{c}$.",
          "基尔霍夫公式取半径为 $ct$ 的球面上的平均。所以在三维中，从一个球内发出的短暂信号，只在半径为 $ct$ 的球面穿过那个球时才到达听者，这就是惠更斯原理。例如，图中球的半径 $a = 1$，听者距离 $d = 5$，所以球面在 $ct = 4$ 时第一次接触球，在 $ct = 6$ 时离开；$c = 2$ 时听者从 $t = 2$ 到 $t = 3$ 听到信号。\n\n检验：信号持续 $3 - 2 = 1$，正是球面穿过球直径所需的时间 $\\frac{2a}{c} = \\frac{2}{2}$。\n\n> **注意。** 最先的声音来自球的近侧，$ct = d - a$；最后的来自远侧，$ct = d + a$；两者都不是 $\\frac{d}{c}$。",
        ],
        (rng) =>
          until(() => {
            const c = rng.int(2, 9);
            const big = rng.int(1, 9);
            const r = big + rng.int(1, 30);
            const last = rng.bool();
            const near = Q.of(r - big, c);
            const far = Q.of(r + big, c);
            const answer = last ? far : near;
            const misses: Miss[] = [
              [
                last ? near : far,
                last
                  ? "That is when it is first heard; the last sound comes from the far side of the ball."
                  : "That is when it is last heard; the first sound comes from the near side of the ball.",
                last ? "那是第一次听到的时间；最后的声音来自球的远侧。" : "那是最后一次听到的时间；最先的声音来自球的近侧。",
              ],
              [Q.of(r, c), "That measures to the center of the ball, not to its edge.", "那量到了球心，而不是球的边缘。"],
              [Q.of(big, c), "That uses only the radius of the ball.", "那只用了球的半径。"],
              [last ? r + big : r - big, "That is the distance; divide by the speed.", "那是距离；还要除以速度。"],
            ];
            return worked(
              [
                `A signal starts at $t = 0$ inside a ball of radius ${big}, with speed $c = ${c}$. A listener is at distance ${r} from the center. At what time does the listener hear it ${last ? "for the last time" : "first"}?`,
                `信号在 $t = 0$ 时从半径为 ${big} 的球内发出，速度 $c = ${c}$。听者距球心 ${r}。听者${last ? "最后一次" : "第一次"}听到它是在什么时间？`,
              ],
              answer,
              misses,
              [
                [
                  ["Find the radius", "求半径"],
                  [
                    `The sphere of radius $ct$ around the listener ${last ? "last touches" : "first touches"} the ball at $ct = ${r} ${last ? "+" : "-"} ${big} = ${last ? r + big : r - big}$.`,
                    `以听者为中心、半径为 $ct$ 的球面在 $ct = ${r} ${last ? "+" : "-"} ${big} = ${last ? r + big : r - big}$ 时${last ? "最后" : "第一次"}接触这个球。`,
                  ],
                ],
                [
                  ["Divide by the speed", "除以速度"],
                  [`$t = ${settle(last ? r + big : r - big, c, answer)}$.`, `$t = ${settle(last ? r + big : r - big, c, answer)}$。`],
                ],
              ],
              [
                `The listener hears the signal from $t = ${near.toLatex()}$ to $t = ${far.toLatex()}$, for $${Q.of(2 * big, c).toLatex()}$, the time $\\frac{2a}{c}$ that the sphere takes to cross the ball's diameter.`,
                `听者从 $t = ${near.toLatex()}$ 到 $t = ${far.toLatex()}$ 听到信号，持续 $${Q.of(2 * big, c).toLatex()}$，正是球面穿过球直径所需的时间 $\\frac{2a}{c}$。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["waves-in-three-dimensions#when-a-signal-is-heard"],
    },
    point(
      "sharp-signals-in-odd-dimensions",
      ["Sharp signals in odd dimensions", "奇数维的清晰信号"],
      [
        "In three dimensions, a sharp signal stays sharp and passes completely. In two dimensions, the formula integrates over a whole disc, so a sharp signal leaves a lingering tail, like a ripple on a pond. For example, a click with speed $5$ heard at distance $10$ arrives at $t = 2$; in space there is silence again right after, while on a membrane the listener still feels a fading tail at $t = 3$.\n\nCheck: at $t = 3$ the sphere of radius $15$ around the listener misses the source point, so Kirchhoff's formula gets nothing, while the disc of radius $15$ still contains it, so the planar formula still gets a contribution.\n\n> **Watch out.** The lingering tail belongs to two dimensions; in three dimensions Huygens' principle holds and the signal passes cleanly.",
        "在三维中，清晰的信号保持清晰并完全通过。在二维中，公式对整个圆盘积分，所以清晰的信号留下一条拖尾，就像池塘上的涟漪。例如，速度为 $5$ 的咔嗒声在距离 $10$ 处于 $t = 2$ 到达；在空间中随后立即又是寂静，而在膜上听者在 $t = 3$ 时仍感到逐渐减弱的拖尾。\n\n检验：$t = 3$ 时以听者为中心、半径 $15$ 的球面不经过源点，所以基尔霍夫公式什么也得不到；而半径 $15$ 的圆盘仍包含源点，所以平面公式仍有贡献。\n\n> **注意。** 拖尾属于二维；在三维中惠更斯原理成立，信号干净地通过。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const r = rng.int(2, 30);
        const three = rng.bool();
        const after = Q.of(r + 1, c).toLatex();
        const silent: Pair = ["It is exactly zero again", "它又恰好是零"];
        const tail: Pair = ["It is generally not zero: a tail lingers", "它一般不为零：有拖尾"];
        const grows: Pair = ["It grows without bound", "它无限增长"];
        const repeats: Pair = ["It repeats the signal at equal intervals", "它按相等间隔重复信号"];
        const slips: Slip[] = [
          three
            ? [
                tail,
                "A tail lingers in two dimensions; in three only the surface of the sphere counts.",
                "拖尾出现在二维中；在三维中只有球面起作用。",
              ]
            : [
                silent,
                "That is Huygens' principle, which holds in three dimensions; in two the whole disc counts.",
                "那是惠更斯原理，它在三维中成立；在二维中整个圆盘都起作用。",
              ],
          [
            grows,
            "Nothing feeds the wave after the brief signal, so it cannot grow without bound.",
            "短暂信号之后没有东西给波输入能量，所以它不会无限增长。",
          ],
          [repeats, "With no boundary to send echoes back, nothing repeats the signal.", "没有边界把回声送回来，所以不会重复信号。"],
        ];
        return chosen(
          rng,
          [
            `A brief point signal with speed ${c} passes a listener at distance ${r} in ${three ? "three" : "two"} dimensions. What happens at the listener after $t = ${after}$?`,
            `速度为 ${c} 的短暂点信号在${three ? "三" : "二"}维中经过距离为 ${r} 的听者。在 $t = ${after}$ 之后听者处发生什么？`,
          ],
          three ? silent : tail,
          slips,
          [
            [
              ["Name the formula", "说出公式"],
              three
                ? [
                    "In three dimensions Kirchhoff's formula averages over the surface of the sphere of radius $ct$.",
                    "在三维中，基尔霍夫公式在半径为 $ct$ 的球面上取平均。",
                  ]
                : [
                    "In two dimensions Poisson's formula integrates over the whole disc of radius $ct$.",
                    "在二维中，泊松公式在半径为 $ct$ 的整个圆盘上积分。",
                  ],
            ],
            [
              ["Decide", "判断"],
              three
                ? [
                    `After $t = ${after}$ the sphere has passed the source, so the value is exactly zero again.`,
                    `$t = ${after}$ 之后球面已经越过源点，所以值又恰好是零。`,
                  ]
                : [
                    `After $t = ${after}$ the disc still contains the source, so a tail lingers.`,
                    `$t = ${after}$ 之后圆盘仍包含源点，所以有拖尾。`,
                  ],
            ],
          ],
          three
            ? [
                `At $t = ${after}$ the radius is $ct = ${r + 1} > ${r}$, so the sphere around the listener no longer meets the source point.`,
                `在 $t = ${after}$ 时半径 $ct = ${r + 1} > ${r}$，所以以听者为中心的球面不再经过源点。`,
              ]
            : [
                `At $t = ${after}$ the radius is $ct = ${r + 1} > ${r}$, and the disc of that radius around the listener still contains the source point.`,
                `在 $t = ${after}$ 时半径 $ct = ${r + 1} > ${r}$，以听者为中心、这个半径的圆盘仍包含源点。`,
              ],
        );
      },
    ),
  ],
);

const bessel = topic(
  "bessel-functions-and-the-circular-drum",
  ["Bessel Functions and the Circular Drum", "贝塞尔函数和圆鼓"],
  ["Use zeros of Bessel functions to find the sound of a round membrane.", "用贝塞尔函数的零点求圆形膜的声音。"],
  ["the-vibrating-membrane"],
  [],
  [
    point(
      "a-drum-frequency",
      ["A drum frequency", "鼓的频率"],
      [
        "Separating the wave equation in polar coordinates gives Bessel functions in $r$. The rim condition $J_m(kR) = 0$ gives $k = \\frac{j}{R}$, where $j$ is a zero of $J_m$, and the frequency is $\\omega = ck$. For example, a drum of radius $2$ with wave speed $5$, using the zero $j \\approx 2.4$, has $k = 1.2$ and $\\omega = 5 \\cdot 1.2 = 6$.\n\nCheck: $\\frac{\\omega R}{c} = \\frac{6 \\cdot 2}{5} = 2.4$, the Bessel zero we started from.\n\n> **Watch out.** Divide the zero by the radius and multiply by the speed; dividing by the speed gives the wrong units.",
        "在极坐标下分离波动方程，得到关于 $r$ 的贝塞尔函数。边缘条件 $J_m(kR) = 0$ 给出 $k = \\frac{j}{R}$，其中 $j$ 是 $J_m$ 的零点，频率是 $\\omega = ck$。例如，半径为 $2$、波速为 $5$ 的鼓，用零点 $j \\approx 2.4$，有 $k = 1.2$，$\\omega = 5 \\cdot 1.2 = 6$。\n\n检验：$\\frac{\\omega R}{c} = \\frac{6 \\cdot 2}{5} = 2.4$，正是开始用的贝塞尔零点。\n\n> **注意。** 要用零点除以半径再乘速度；除以速度会得到错误的单位。",
      ],
      (rng) =>
        until(() => {
          const j = rng.pick([2.4, 3.8, 5.1, 5.5, 8.7]);
          const c = rng.int(2, 25);
          const r = rng.int(2, 12);
          const tenth = Math.round(j * 10);
          const k = Q.of(tenth, 10 * r);
          const answer = Q.of(tenth * c, 10 * r);
          const misses: Miss[] = [
            [k, "That is the wave number $k$; multiply by the speed.", "那是波数 $k$；还要乘速度。"],
            [Q.of(c, r), "That leaves out the Bessel zero.", "那漏掉了贝塞尔零点。"],
            [
              Q.of(tenth * r, 10 * c),
              "That divides by the speed and multiplies by the radius; it is the other way round.",
              "那除以速度、乘半径；应该反过来。",
            ],
            [Q.of(tenth * c * r, 10), "That multiplies by the radius; divide by it.", "那乘了半径；应该除以它。"],
          ];
          return worked(
            [
              `A drum of radius ${r} has wave speed ${c}, and the relevant Bessel zero is about ${j}. What is the frequency $\\omega$?`,
              `半径为 ${r} 的鼓波速为 ${c}，相关的贝塞尔零点约为 ${j}。频率 $\\omega$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the wave number", "求波数"],
                [`$k = \\frac{j}{R} = \\frac{${j}}{${r}} = ${k.toLatex()}$.`, `$k = \\frac{j}{R} = \\frac{${j}}{${r}} = ${k.toLatex()}$。`],
              ],
              [
                ["Multiply by the speed", "乘速度"],
                [
                  `$\\omega = ck = ${c} \\cdot ${k.toLatex()} = ${answer.toLatex()}$.`,
                  `$\\omega = ck = ${c} \\cdot ${k.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$\\frac{\\omega R}{c} = ${answer.toLatex()} \\cdot ${r} \\div ${c} = ${Q.of(tenth, 10).toLatex()} = ${j}$, the Bessel zero we started from.`,
              `$\\frac{\\omega R}{c} = ${answer.toLatex()} \\cdot ${r} \\div ${c} = ${Q.of(tenth, 10).toLatex()} = ${j}$，正是开始用的贝塞尔零点。`,
            ],
          );
        }),
    ),
    point(
      "changing-the-size-of-the-drum",
      ["Changing the size of the drum", "改变鼓的大小"],
      [
        "All the frequencies scale with $\\frac{c}{R}$. So doubling the radius halves every frequency, which lowers the pitch by an octave, and this is why bigger drums sound deeper. For example, a drum of radius $2$ with a frequency $300$ has the matching frequency $300 \\cdot \\frac{2}{3} = 200$ when the radius is $3$.\n\nCheck: frequency times radius stays the same, $300 \\cdot 2 = 200 \\cdot 3 = 600$.\n\n> **Watch out.** A bigger drum has a lower frequency: multiply by the old radius over the new one, not the other way round.",
        "所有频率都按 $\\frac{c}{R}$ 缩放。所以半径加倍使每个频率减半，音高降低一个八度，这就是大鼓声音更低沉的原因。例如，半径为 $2$、频率为 $300$ 的鼓，半径变为 $3$ 时对应的频率是 $300 \\cdot \\frac{2}{3} = 200$。\n\n检验：频率与半径之积不变，$300 \\cdot 2 = 200 \\cdot 3 = 600$。\n\n> **注意。** 鼓越大频率越低：要乘旧半径比新半径，而不是反过来。",
      ],
      (rng) =>
        until(() => {
          const f = rng.int(20, 400);
          const [a, b] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
          const answer = Q.of(f * a, b);
          const misses: Miss[] = [
            [
              Q.of(f * b, a),
              "That makes the frequency grow with the radius; a bigger drum sounds lower.",
              "那让频率随半径增大；鼓越大声音越低。",
            ],
            [
              Q.of(f * a * a, b * b),
              "That uses the square of the ratio; frequency goes as $\\frac{1}{R}$.",
              "那用了比值的平方；频率按 $\\frac{1}{R}$ 变化。",
            ],
            [f, "That keeps the frequency fixed; it changes with the radius.", "那让频率不变；它随半径变化。"],
          ];
          return worked(
            [
              `A drum of radius ${a} has a frequency ${f}. What is the matching frequency for a drum of radius ${b} with the same wave speed?`,
              `半径为 ${a} 的鼓有频率 ${f}。波速相同、半径为 ${b} 的鼓对应的频率是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Use the scaling", "利用缩放"],
                [
                  `Frequency varies as $\\frac{1}{R}$, so it is multiplied by $${Q.of(a, b).toLatex()}$.`,
                  `频率与 $\\frac{1}{R}$ 成正比，所以乘 $${Q.of(a, b).toLatex()}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${f} \\cdot ${Q.of(a, b).toLatex()} = ${answer.toLatex()}$.`,
                  `$${f} \\cdot ${Q.of(a, b).toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Frequency times radius stays the same: $${f} \\cdot ${a} = ${f * a}$ and $${pq(answer)} \\cdot ${b} = ${f * a}$.`,
              `频率与半径之积不变：$${f} \\cdot ${a} = ${f * a}$，$${pq(answer)} \\cdot ${b} = ${f * a}$。`,
            ],
          );
        }),
    ),
    point(
      "the-series-for-a-bessel-function",
      ["The series for a Bessel function", "贝塞尔函数的级数"],
      [
        "Solving Bessel's equation by power series gives $J_0(x) = \\sum_{k \\ge 0} \\frac{(-1)^{k}}{(k!)^{2}} \\left(\\frac{x}{2}\\right)^{2k}$. The first few terms are good approximations for small $x$. For example, the terms up to $k = 1$ give $J_0(1) \\approx 1 - \\left(\\frac{1}{2}\\right)^{2} = \\frac{3}{4}$.\n\nCheck: the next term is $+\\frac{1}{4}\\left(\\frac{1}{2}\\right)^{4} = \\frac{1}{64}$, so $J_0(1) \\approx 0.766$, close to $\\frac{3}{4}$ and a little above it.\n\n> **Watch out.** Square $\\frac{x}{2}$, not $x$, and keep the minus sign of the $k = 1$ term.",
        "用幂级数解贝塞尔方程得 $J_0(x) = \\sum_{k \\ge 0} \\frac{(-1)^{k}}{(k!)^{2}} \\left(\\frac{x}{2}\\right)^{2k}$。对小的 $x$，前几项是很好的近似。例如，取到 $k = 1$ 的项得 $J_0(1) \\approx 1 - \\left(\\frac{1}{2}\\right)^{2} = \\frac{3}{4}$。\n\n检验：下一项是 $+\\frac{1}{4}\\left(\\frac{1}{2}\\right)^{4} = \\frac{1}{64}$，所以 $J_0(1) \\approx 0.766$，接近 $\\frac{3}{4}$ 并略大于它。\n\n> **注意。** 要平方 $\\frac{x}{2}$，而不是 $x$；还要保留 $k = 1$ 项的负号。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(2, 15);
          const a = rng.int(1, b - 1);
          const v = Q.of(a, b);
          if (v.d !== BigInt(b)) return undefined;
          const answer = Q.of(4 * b * b - a * a, 4 * b * b);
          const term = Q.of(a * a, 4 * b * b);
          const next = Q.of(a ** 4, 64 * b ** 4);
          const misses: Miss[] = [
            [
              Q.of(4 * b * b + a * a, 4 * b * b),
              "That adds the $k = 1$ term; its sign is $(-1)^{1} = -1$.",
              "那加上了 $k = 1$ 项；它的符号是 $(-1)^{1} = -1$。",
            ],
            [
              Q.of(2 * b * b - a * a, 2 * b * b),
              "That uses $\\frac{x^{2}}{2}$, as in the cosine series; the term is $\\left(\\frac{x}{2}\\right)^{2}$.",
              "那用了 $\\frac{x^{2}}{2}$，像余弦级数那样；这一项是 $\\left(\\frac{x}{2}\\right)^{2}$。",
            ],
            [term, "That is only the $k = 1$ term; the series starts with $1$.", "那只是 $k = 1$ 项；级数从 $1$ 开始。"],
            [Q.of(2 * b - a, 2 * b), "That forgets to square $\\frac{x}{2}$.", "那忘了把 $\\frac{x}{2}$ 平方。"],
          ];
          return worked(
            [
              `Use the terms up to $k = 1$ of the series for $J_0(x)$ to approximate $J_0\\left(${v.toLatex()}\\right)$.`,
              `用 $J_0(x)$ 级数中 $k = 1$ 及之前的项，近似 $J_0\\left(${v.toLatex()}\\right)$。`,
            ],
            answer,
            misses,
            [
              [
                ["Write the terms", "写出各项"],
                [
                  `The series starts $J_0(x) = 1 - \\left(\\frac{x}{2}\\right)^{2} + \\cdots$, and $\\frac{x}{2} = ${Q.of(a, 2 * b).toLatex()}$.`,
                  `级数开头是 $J_0(x) = 1 - \\left(\\frac{x}{2}\\right)^{2} + \\cdots$，而 $\\frac{x}{2} = ${Q.of(a, 2 * b).toLatex()}$。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `$1 - \\left(${Q.of(a, 2 * b).toLatex()}\\right)^{2} = 1 - ${term.toLatex()} = ${answer.toLatex()}$.`,
                  `$1 - \\left(${Q.of(a, 2 * b).toLatex()}\\right)^{2} = 1 - ${term.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The next term is $+\\frac{1}{4}\\left(${Q.of(a, 2 * b).toLatex()}\\right)^{4} = ${next.toLatex()}$, ${next.toNumber() < 0.01 ? "small beside" : "smaller than"} the term $${term.toLatex()}$ we kept, so the approximation is a little below the true value.`,
              `下一项是 $+\\frac{1}{4}\\left(${Q.of(a, 2 * b).toLatex()}\\right)^{4} = ${next.toLatex()}$，${next.toNumber() < 0.01 ? "与保留的项相比很小" : "比保留的项小"}（保留的项是 $${term.toLatex()}$），所以近似值略低于真实值。`,
            ],
          );
        }),
    ),
  ],
);

const legendre = topic(
  "legendre-polynomials-and-the-sphere",
  ["Legendre Polynomials and the Sphere", "勒让德多项式和球"],
  ["Solve Laplace's equation in a ball, using Legendre polynomials.", "用勒让德多项式解球内的拉普拉斯方程。"],
  ["laplaces-equation-in-a-rectangle-and-a-disc"],
  [],
  [
    point(
      "evaluating-a-legendre-polynomial",
      ["Evaluating a Legendre polynomial", "计算勒让德多项式"],
      [
        "Separating Laplace's equation in spherical coordinates, with symmetry about the axis, gives Legendre polynomials. The first are $P_0 = 1$, $P_1 = x$, $P_2 = \\frac{3x^{2} - 1}{2}$ and $P_3 = \\frac{5x^{3} - 3x}{2}$. For example, $P_2\\left(\\frac{1}{2}\\right) = \\frac{3 \\cdot \\frac{1}{4} - 1}{2} = -\\frac{1}{8}$.\n\nCheck: the recurrence $2P_2 = 3xP_1 - P_0$ gives $2 \\cdot \\left(-\\frac{1}{8}\\right) = \\frac{3}{4} - 1 = -\\frac{1}{4}$.\n\n> **Watch out.** Keep the subtracted term and the division by $2$; every $P_n$ equals $1$ at $x = 1$, which is a quick test of a formula.",
        "在球坐标下分离拉普拉斯方程，并利用轴对称，得到勒让德多项式。前几个是 $P_0 = 1$，$P_1 = x$，$P_2 = \\frac{3x^{2} - 1}{2}$，$P_3 = \\frac{5x^{3} - 3x}{2}$。例如，$P_2\\left(\\frac{1}{2}\\right) = \\frac{3 \\cdot \\frac{1}{4} - 1}{2} = -\\frac{1}{8}$。\n\n检验：递推式 $2P_2 = 3xP_1 - P_0$ 给出 $2 \\cdot \\left(-\\frac{1}{8}\\right) = \\frac{3}{4} - 1 = -\\frac{1}{4}$。\n\n> **注意。** 要保留减去的项和除以 $2$；每个 $P_n$ 在 $x = 1$ 处都等于 $1$，这是检验公式的快速方法。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(2, 12);
          const a = rng.int(1, b - 1);
          if (Q.of(a, b).d !== BigInt(b)) return undefined;
          const three = rng.bool();
          const xq = Q.of(a, b);
          const x = xq.toLatex();
          const p2 = Q.of(3 * a * a - b * b, 2 * b * b);
          const p3 = Q.of(5 * a * a * a - 3 * a * b * b, 2 * b * b * b);
          const answer = three ? p3 : p2;
          const misses: Miss[] = three
            ? [
                [Q.of(5 * a * a * a + 3 * a * b * b, 2 * b * b * b), "That adds $3x$; it is subtracted.", "那加上了 $3x$；它应该减去。"],
                [Q.of(5 * a * a * a - 3 * a * b * b, b * b * b), "That forgets to divide by $2$.", "那忘了除以 $2$。"],
                [xq, "That is $P_1(x) = x$.", "那是 $P_1(x) = x$。"],
                [p2, "That is $P_2$, not $P_3$.", "那是 $P_2$，不是 $P_3$。"],
              ]
            : [
                [Q.of(3 * a * a + b * b, 2 * b * b), "That adds $1$; it is subtracted.", "那加上了 $1$；它应该减去。"],
                [Q.of(3 * a * a - b * b, b * b), "That forgets to divide by $2$.", "那忘了除以 $2$。"],
                [xq, "That is $P_1(x) = x$.", "那是 $P_1(x) = x$。"],
                [Q.of(3 * a * a, 2 * b * b), "That leaves out the $-1$.", "那漏掉了 $-1$。"],
              ];
          const steps3 = Q.of(5 * a * a * a, b * b * b);
          const steps2 = Q.of(3 * a * a, b * b);
          return worked(
            [`Evaluate $P_{${three ? 3 : 2}}\\left(${x}\\right)$.`, `计算 $P_{${three ? 3 : 2}}\\left(${x}\\right)$。`],
            answer,
            misses,
            [
              [
                ["Compute the terms", "计算各项"],
                three
                  ? [
                      `$5x^{3} = ${steps3.toLatex()}$ and $3x = ${Q.of(3 * a, b).toLatex()}$.`,
                      `$5x^{3} = ${steps3.toLatex()}$，$3x = ${Q.of(3 * a, b).toLatex()}$。`,
                    ]
                  : [`$3x^{2} = ${steps2.toLatex()}$.`, `$3x^{2} = ${steps2.toLatex()}$。`],
              ],
              [
                ["Combine and halve", "合并后除以 2"],
                three
                  ? [
                      `$P_3 = \\frac{1}{2}\\left(${steps3.toLatex()} - ${Q.of(3 * a, b).toLatex()}\\right) = ${answer.toLatex()}$.`,
                      `$P_3 = \\frac{1}{2}\\left(${steps3.toLatex()} - ${Q.of(3 * a, b).toLatex()}\\right) = ${answer.toLatex()}$。`,
                    ]
                  : [
                      `$P_2 = \\frac{1}{2}\\left(${steps2.toLatex()} - 1\\right) = ${answer.toLatex()}$.`,
                      `$P_2 = \\frac{1}{2}\\left(${steps2.toLatex()} - 1\\right) = ${answer.toLatex()}$。`,
                    ],
              ],
            ],
            three
              ? [
                  `The recurrence $3P_3 = 5xP_2 - 2P_1$ gives $5 \\cdot ${x} \\cdot ${pq(p2)} - 2 \\cdot ${x} = ${answer.mul(Q.of(3)).toLatex()}$, which is $3 \\cdot ${pq(answer)}$.`,
                  `递推式 $3P_3 = 5xP_2 - 2P_1$ 给出 $5 \\cdot ${x} \\cdot ${pq(p2)} - 2 \\cdot ${x} = ${answer.mul(Q.of(3)).toLatex()}$，正是 $3 \\cdot ${pq(answer)}$。`,
                ]
              : [
                  `The recurrence $2P_2 = 3xP_1 - P_0$ gives $3 \\cdot \\left(${x}\\right)^{2} - 1 = ${answer.mul(Q.of(2)).toLatex()}$, which is $2 \\cdot ${pq(answer)}$.`,
                  `递推式 $2P_2 = 3xP_1 - P_0$ 给出 $3 \\cdot \\left(${x}\\right)^{2} - 1 = ${answer.mul(Q.of(2)).toLatex()}$，正是 $2 \\cdot ${pq(answer)}$。`,
                ],
          );
        }),
    ),
    point(
      "orthogonality-of-legendre-polynomials",
      ["Orthogonality of Legendre polynomials", "勒让德多项式的正交性"],
      [
        "Legendre polynomials are orthogonal on $[-1, 1]$, with $\\int_{-1}^{1} P_n^{2}\\, dx = \\frac{2}{2n + 1}$. Different ones integrate to zero against each other, so a coefficient can be found by a single integral. For example, $\\int_{-1}^{1} 3P_2^{2} \\, dx = 3 \\cdot \\frac{2}{5} = \\frac{6}{5}$, while $\\int_{-1}^{1} 3P_1P_3 \\, dx = 0$.\n\nCheck: for $n = 0$ the formula gives $\\frac{2}{2 \\cdot 0 + 1} = 2$, the length of the interval $[-1, 1]$, as it must.\n\n> **Watch out.** Only equal indices give a nonzero integral, and the norm has $2n + 1$ in the denominator, not $n + 1$.",
        "勒让德多项式在 $[-1, 1]$ 上正交，$\\int_{-1}^{1} P_n^{2}\\, dx = \\frac{2}{2n + 1}$。不同的多项式相乘积分为零，所以系数可以由单个积分求出。例如，$\\int_{-1}^{1} 3P_2^{2} \\, dx = 3 \\cdot \\frac{2}{5} = \\frac{6}{5}$，而 $\\int_{-1}^{1} 3P_1P_3 \\, dx = 0$。\n\n检验：$n = 0$ 时公式给出 $\\frac{2}{2 \\cdot 0 + 1} = 2$，正是区间 $[-1, 1]$ 的长度，理应如此。\n\n> **注意。** 只有指标相同时积分才不为零，范数的分母是 $2n + 1$，不是 $n + 1$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(0, 12);
          const k = rng.int(2, 12);
          const other = rng.int(1, 5);
          const zero = rng.bool();
          const norm = Q.of(2 * k, 2 * n + 1);
          const answer = zero ? Q.zero : norm;
          const misses: Miss[] = zero
            ? [
                [norm, "That uses the norm of $P_n$; the two polynomials here are different.", "那用了 $P_n$ 的范数；这里两个多项式不同。"],
                [
                  k,
                  "That treats the integral of the product as $1$; different Legendre polynomials are orthogonal.",
                  "那把乘积的积分当成 $1$；不同的勒让德多项式正交。",
                ],
                [
                  2 * k,
                  "That integrates $k$ over the interval; the polynomials do not drop out.",
                  "那是 $k$ 在区间上的积分；多项式并不会消失。",
                ],
              ]
            : [
                [Q.of(k, 2 * n + 1), "That forgets the $2$ in $\\frac{2}{2n + 1}$.", "那忘了 $\\frac{2}{2n + 1}$ 中的 $2$。"],
                [
                  0,
                  "A polynomial is not orthogonal to itself; its square has a positive integral.",
                  "多项式与自身不正交；它的平方积分为正。",
                ],
                [Q.of(2 * k, n + 1), "That uses $n + 1$ in place of $2n + 1$.", "那用 $n + 1$ 代替了 $2n + 1$。"],
              ];
          return worked(
            zero
              ? [
                  `Evaluate $\\int_{-1}^{1} ${k} P_{${n}} P_{${n + other}}\\, dx$.`,
                  `计算 $\\int_{-1}^{1} ${k} P_{${n}} P_{${n + other}}\\, dx$。`,
                ]
              : [`Evaluate $\\int_{-1}^{1} ${k} P_{${n}}^{2}\\, dx$.`, `计算 $\\int_{-1}^{1} ${k} P_{${n}}^{2}\\, dx$。`],
            answer,
            misses,
            zero
              ? [
                  [
                    ["Compare the indices", "比较指标"],
                    [`The indices ${n} and ${n + other} are different.`, `指标 ${n} 和 ${n + other} 不同。`],
                  ],
                  [
                    ["Use orthogonality", "利用正交性"],
                    ["Different Legendre polynomials are orthogonal, so the integral is $0$.", "不同的勒让德多项式正交，所以积分是 $0$。"],
                  ],
                ]
              : [
                  [
                    ["Find the norm", "求范数"],
                    [
                      `$\\int_{-1}^{1} P_{${n}}^{2} \\, dx = \\frac{2}{2 \\cdot ${n} + 1} = ${Q.of(2, 2 * n + 1).toLatex()}$.`,
                      `$\\int_{-1}^{1} P_{${n}}^{2} \\, dx = \\frac{2}{2 \\cdot ${n} + 1} = ${Q.of(2, 2 * n + 1).toLatex()}$。`,
                    ],
                  ],
                  [
                    ["Multiply", "相乘"],
                    [
                      `$${k} \\cdot ${Q.of(2, 2 * n + 1).toLatex()} = ${norm.toLatex()}$.`,
                      `$${k} \\cdot ${Q.of(2, 2 * n + 1).toLatex()} = ${norm.toLatex()}$。`,
                    ],
                  ],
                ],
            zero
              ? [
                  `$P_{${n + other}}$ is orthogonal to every polynomial of lower degree, and $P_{${n}}$ has degree ${n} < ${n + other}, so the integral vanishes whatever the factor ${k}.`,
                  `$P_{${n + other}}$ 与每个次数更低的多项式正交，而 $P_{${n}}$ 的次数 ${n} < ${n + other}，所以无论因子 ${k} 是多少，积分都为零。`,
                ]
              : [
                  `Since $|P_{${n}}| \\le 1$ on $[-1, 1]$, the integral must lie between $0$ and $${k} \\cdot 2 = ${2 * k}$, and $${norm.toLatex()}$ does${n === 0 ? ", reaching the top because $P_0 = 1$" : ""}.`,
                  `因为在 $[-1, 1]$ 上 $|P_{${n}}| \\le 1$，积分必须在 $0$ 与 $${k} \\cdot 2 = ${2 * k}$ 之间，而 $${norm.toLatex()}$ 确实如此${n === 0 ? "，并且因为 $P_0 = 1$ 而达到上界" : ""}。`,
                ],
          );
        }),
    ),
    point(
      "a-solution-in-the-ball",
      ["A solution in the ball", "球内的解"],
      [
        "Inside a ball of radius $R$, the solutions regular at the center are $r^{n}P_n(\\cos\\phi)$. So boundary data $AP_n(\\cos\\phi)$ gives $A\\left(\\frac{r}{R}\\right)^{n}P_n(\\cos\\phi)$, which is easy to evaluate along the axis. For example, in the ball $r < 2$ with $u = 8P_3(\\cos\\phi)$ on the surface, the value on the axis at $r = 1$ is $8 \\cdot \\left(\\frac{1}{2}\\right)^{3} = 1$.\n\nCheck: at $r = 2$ the formula gives $8 \\cdot 1^{3} \\cdot P_3(1) = 8$, the boundary value on the axis.\n\n> **Watch out.** Inside the ball use $\\left(\\frac{r}{R}\\right)^{n}$, which shrinks toward the center; $\\left(\\frac{R}{r}\\right)^{n}$ would blow up there.",
        "在半径为 $R$ 的球内，在中心正则的解是 $r^{n}P_n(\\cos\\phi)$。所以边界数据 $AP_n(\\cos\\phi)$ 给出 $A\\left(\\frac{r}{R}\\right)^{n}P_n(\\cos\\phi)$，沿轴线很容易计算。例如，在球 $r < 2$ 内，球面上 $u = 8P_3(\\cos\\phi)$，轴线上 $r = 1$ 处的值是 $8 \\cdot \\left(\\frac{1}{2}\\right)^{3} = 1$。\n\n检验：$r = 2$ 时公式给出 $8 \\cdot 1^{3} \\cdot P_3(1) = 8$，正是轴线上的边界值。\n\n> **注意。** 球内用 $\\left(\\frac{r}{R}\\right)^{n}$，它向中心缩小；$\\left(\\frac{R}{r}\\right)^{n}$ 在中心会爆炸。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(2, 9);
          const r = rng.int(1, big - 1);
          const n = rng.int(2, 4);
          const a = rng.int(2, 30);
          const ratio = Q.of(r, big);
          const power = ratio.pow(n);
          const answer = Q.of(a * r ** n, big ** n);
          const raised = `\\left(${ratio.toLatex()}\\right)^{${n}}`;
          const misses: Miss[] = [
            [a, "That is the boundary value; the solution shrinks toward the center.", "那是边界值；解向中心缩小。"],
            [Q.of(a * r, big), `That forgets the power $n = ${n}$.`, `那忘了幂 $n = ${n}$。`],
            [
              Q.of(a * big ** n, r ** n),
              "That uses $\\left(\\frac{R}{r}\\right)^{n}$, which belongs outside the ball.",
              "那用了 $\\left(\\frac{R}{r}\\right)^{n}$，它属于球外。",
            ],
            [
              Q.of(a * r ** (n + 1), big ** (n + 1)),
              `That raises the ratio to the power $${n + 1}$; the power is $n = ${n}$.`,
              `那把比值升到 $${n + 1}$ 次幂；幂是 $n = ${n}$。`,
            ],
          ];
          return worked(
            [
              `$u$ is harmonic in the ball $r < ${big}$, with $u = ${a}P_{${n}}(\\cos\\phi)$ on the surface. What is $u$ at $r = ${r}$ on the axis $\\phi = 0$?`,
              `$u$ 在球 $r < ${big}$ 内调和，球面上 $u = ${a}P_{${n}}(\\cos\\phi)$。$u$ 在轴线 $\\phi = 0$ 上 $r = ${r}$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Write the solution", "写出解"],
                [
                  `$u = ${a}\\left(\\frac{r}{${big}}\\right)^{${n}}P_{${n}}(\\cos\\phi)$, and on the axis $P_{${n}}(1) = 1$.`,
                  `$u = ${a}\\left(\\frac{r}{${big}}\\right)^{${n}}P_{${n}}(\\cos\\phi)$，在轴线上 $P_{${n}}(1) = 1$。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `$${a} \\cdot ${raised} = ${a} \\cdot ${power.toLatex()} = ${answer.toLatex()}$.`,
                  `$${a} \\cdot ${raised} = ${a} \\cdot ${power.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `At $r = ${big}$ the factor $\\left(\\frac{r}{${big}}\\right)^{${n}}$ is $1$, so the formula gives $${a}$, the boundary value on the axis; and at the center it gives $0$, finite as required.`,
              `在 $r = ${big}$ 处因子 $\\left(\\frac{r}{${big}}\\right)^{${n}}$ 是 $1$，所以公式给出 $${a}$，正是轴线上的边界值；在中心它给出 $0$，符合有限的要求。`,
            ],
          );
        }),
    ),
  ],
);

const wedge = topic(
  "laplaces-equation-on-wedges-and-annuli",
  ["Laplace's Equation on Wedges and Annuli", "楔形和圆环上的拉普拉斯方程"],
  ["Choose powers of $r$ and logarithms to fit the geometry of a region.", "选择 $r$ 的幂和对数来适应区域的几何。"],
  ["laplaces-equation-in-a-rectangle-and-a-disc"],
  [],
  [
    {
      ...point(
        "the-power-on-a-wedge",
        ["The power on a wedge", "楔形上的幂"],
        [
          "On a wedge of angle $\\beta$ with zero on both edges, the harmonic solutions are $r^{\\nu}\\sin(\\nu\\theta)$ with $\\nu = \\frac{n\\pi}{\\beta}$. So the geometry of the corner fixes which power of $r$ is allowed. For example, in the figure the quarter plane $\\beta = \\frac{\\pi}{2}$ gives $\\nu = 2$ for $n = 1$, and the wide corner $\\beta = \\frac{3\\pi}{2}$ gives $\\nu = \\frac{2}{3}$.\n\nCheck: $\\sin(\\nu\\theta)$ must vanish at $\\theta = \\beta$, and $2 \\cdot \\frac{\\pi}{2} = \\pi$, $\\frac{2}{3} \\cdot \\frac{3\\pi}{2} = \\pi$.\n\n> **Watch out.** Divide $n\\pi$ by the angle; a wider corner gives a smaller power.",
          "在角度为 $\\beta$、两边为零的楔形上，调和解是 $r^{\\nu}\\sin(\\nu\\theta)$，其中 $\\nu = \\frac{n\\pi}{\\beta}$。所以角的几何决定允许 $r$ 的哪个幂。例如，图中四分之一平面 $\\beta = \\frac{\\pi}{2}$ 在 $n = 1$ 时给出 $\\nu = 2$，宽角 $\\beta = \\frac{3\\pi}{2}$ 给出 $\\nu = \\frac{2}{3}$。\n\n检验：$\\sin(\\nu\\theta)$ 必须在 $\\theta = \\beta$ 处为零，而 $2 \\cdot \\frac{\\pi}{2} = \\pi$，$\\frac{2}{3} \\cdot \\frac{3\\pi}{2} = \\pi$。\n\n> **注意。** 要用 $n\\pi$ 除以角度；角越宽，幂越小。",
        ],
        (rng) =>
          until(() => {
            const q0 = rng.int(2, 12);
            const p = rng.int(1, 3);
            const q = p === q0 || q0 % p === 0 ? q0 * p + 1 : q0;
            const n = rng.int(1, 6);
            const beta = `\\frac{${p === 1 ? "" : p}\\pi}{${q}}`;
            const answer = Q.of(n * q, p);
            const quotient = n === 1 ? answer.toLatex() : `${n} \\cdot ${Q.of(q, p).toLatex()} = ${answer.toLatex()}`;
            const misses: Miss[] = [
              [
                Q.of(n * p, q),
                "That multiplies by the angle over $\\pi$; divide $n\\pi$ by the angle.",
                "那乘了角度除以 $\\pi$；应该用 $n\\pi$ 除以角度。",
              ],
              [Q.of(q, p), "That is the power for $n = 1$; multiply by the mode number.", "那是 $n = 1$ 的幂；还要乘模式数。"],
              [
                Q.of(2 * n * q, p),
                "That uses $\\frac{2n\\pi}{\\beta}$, as for a full period; the sine only has to reach $n\\pi$ at the far edge.",
                "那用了 $\\frac{2n\\pi}{\\beta}$，像整个周期那样；正弦只需在另一边达到 $n\\pi$。",
              ],
              [n, "That is the power for a half plane, $\\beta = \\pi$.", "那是半平面 $\\beta = \\pi$ 的幂。"],
            ];
            return worked(
              [
                `On a wedge of angle $${beta}$ with zero on both edges, what is the power $\\nu$ for the mode $n = ${n}$?`,
                `在角度为 $${beta}$、两边为零的楔形上，模式 $n = ${n}$ 的幂 $\\nu$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Use the formula", "使用公式"],
                  [
                    `$\\nu = \\frac{n\\pi}{\\beta} = ${piOver(n, 1)} \\div ${beta}$.`,
                    `$\\nu = \\frac{n\\pi}{\\beta} = ${piOver(n, 1)} \\div ${beta}$。`,
                  ],
                ],
                [
                  ["Divide", "相除"],
                  [`$\\nu = ${quotient}$.`, `$\\nu = ${quotient}$。`],
                ],
              ],
              [
                `$\\sin(\\nu\\theta)$ vanishes at $\\theta = ${beta}$, since $${pq(answer)} \\cdot ${beta} = ${piOver(n, 1)}$.`,
                `$\\sin(\\nu\\theta)$ 在 $\\theta = ${beta}$ 处为零，因为 $${pq(answer)} \\cdot ${beta} = ${piOver(n, 1)}$。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["laplaces-equation-on-wedges-and-annuli#the-power-on-a-wedge"],
    },
    point(
      "a-solution-outside-a-disc",
      ["A solution outside a disc", "圆盘外的解"],
      [
        "Outside a disc, bounded harmonic functions use negative powers. Boundary data $A\\cos(n\\theta)$ on the radius $R$ gives $A\\left(\\frac{R}{r}\\right)^{n}\\cos(n\\theta)$, which falls off as $r$ grows, rather than blowing up. For example, with $u = 9\\cos(2\\theta)$ on $r = 2$, the bounded solution at $r = 6$, $\\theta = 0$ is $9 \\cdot \\left(\\frac{2}{6}\\right)^{2} = 1$.\n\nCheck: at $r = 2$ the formula gives $9 \\cdot 1 \\cdot \\cos 0 = 9$, the boundary value, and it tends to $0$ far away, so it is bounded.\n\n> **Watch out.** Outside the disc use $\\left(\\frac{R}{r}\\right)^{n}$; the power $\\left(\\frac{r}{R}\\right)^{n}$ grows without bound.",
        "在圆盘外，有界调和函数用负幂。半径 $R$ 上的边界数据 $A\\cos(n\\theta)$ 给出 $A\\left(\\frac{R}{r}\\right)^{n}\\cos(n\\theta)$，它随 $r$ 增大而减小，而不是爆炸。例如，$r = 2$ 上 $u = 9\\cos(2\\theta)$ 时，有界解在 $r = 6$、$\\theta = 0$ 处是 $9 \\cdot \\left(\\frac{2}{6}\\right)^{2} = 1$。\n\n检验：$r = 2$ 时公式给出 $9 \\cdot 1 \\cdot \\cos 0 = 9$，正是边界值；远处它趋于 $0$，所以有界。\n\n> **注意。** 圆盘外要用 $\\left(\\frac{R}{r}\\right)^{n}$；幂 $\\left(\\frac{r}{R}\\right)^{n}$ 会无界增长。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(1, 8);
          const r = big + rng.int(1, 12);
          const n = rng.int(2, 4);
          const a = rng.int(2, 30);
          const ratio = Q.of(big, r);
          const answer = Q.of(a * big ** n, r ** n);
          const misses: Miss[] = [
            [
              Q.of(a * r ** n, big ** n),
              "That uses $\\left(\\frac{r}{R}\\right)^{n}$, which grows without bound.",
              "那用了 $\\left(\\frac{r}{R}\\right)^{n}$，它无界增长。",
            ],
            [a, "That is the boundary value; the solution falls off with distance.", "那是边界值；解随距离减小。"],
            [Q.of(a * big, r), `That forgets the power $n = ${n}$.`, `那忘了幂 $n = ${n}$。`],
          ];
          return worked(
            [
              `$u$ is bounded and harmonic on $r > ${big}$, with $u = ${a}\\cos(${n}\\theta)$ on $r = ${big}$. What is $u$ at $r = ${r}$, $\\theta = 0$?`,
              `$u$ 在 $r > ${big}$ 上有界且调和，$r = ${big}$ 上 $u = ${a}\\cos(${n}\\theta)$。$u$ 在 $r = ${r}$、$\\theta = 0$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Write the bounded solution", "写出有界解"],
                [
                  `$u = ${a}\\left(\\frac{${big}}{r}\\right)^{${n}}\\cos(${n}\\theta)$, which shrinks as $r$ grows.`,
                  `$u = ${a}\\left(\\frac{${big}}{r}\\right)^{${n}}\\cos(${n}\\theta)$，它随 $r$ 增大而减小。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `At $\\theta = 0$, $u = ${a} \\cdot \\left(${ratio.toLatex()}\\right)^{${n}} = ${answer.toLatex()}$.`,
                  `在 $\\theta = 0$ 处，$u = ${a} \\cdot \\left(${ratio.toLatex()}\\right)^{${n}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `At $r = ${big}$ the formula gives $${a} \\cdot 1 \\cdot \\cos 0 = ${a}$, the boundary value, and it tends to $0$ as $r \\to \\infty$, so it is bounded.`,
              `在 $r = ${big}$ 处公式给出 $${a} \\cdot 1 \\cdot \\cos 0 = ${a}$，正是边界值；$r \\to \\infty$ 时它趋于 $0$，所以有界。`,
            ],
          );
        }),
    ),
    point(
      "a-radial-solution-on-an-annulus",
      ["A radial solution on an annulus", "圆环上的径向解"],
      [
        "Radially symmetric harmonic functions in the plane have the form $A + B\\ln r$. When the radii are powers of a common base, the logarithms give simple ratios, so the value at an intermediate radius is rational. For example, with $u = 0$ at $r = 1$ and $u = 6$ at $r = 8 = 2^{3}$, the radius $2$ is $\\frac{\\ln 2}{\\ln 8} = \\frac{1}{3}$ of the way across in $\\ln r$, so $u(2) = 0 + \\frac{1}{3} \\cdot 6 = 2$.\n\nCheck: $u(4)$ would be $4$, so the values $0$, $2$, $4$, $6$ at $r = 1, 2, 4, 8$ rise in equal steps while $\\ln r$ rises in equal steps.\n\n> **Watch out.** The value is linear in $\\ln r$, not in $r$; halfway in radius is not halfway in value.",
        "平面上径向对称的调和函数形如 $A + B\\ln r$。当半径是同一底数的幂时，对数给出简单的比，所以中间半径处的值是有理数。例如，$r = 1$ 时 $u = 0$，$r = 8 = 2^{3}$ 时 $u = 6$，半径 $2$ 在 $\\ln r$ 上走过了全程的 $\\frac{\\ln 2}{\\ln 8} = \\frac{1}{3}$，所以 $u(2) = 0 + \\frac{1}{3} \\cdot 6 = 2$。\n\n检验：$u(4)$ 是 $4$，所以 $r = 1, 2, 4, 8$ 处的值 $0$、$2$、$4$、$6$ 随 $\\ln r$ 等步上升而等步上升。\n\n> **注意。** 值关于 $\\ln r$ 是线性的，而不是关于 $r$；半径走到一半不等于值走到一半。",
      ],
      (rng) =>
        until(() => {
          const base = rng.pick([2, 3, 5]);
          const n = rng.int(2, 6);
          const k = rng.int(1, n - 1);
          const a = rng.int(-20, 20);
          const b = a + rng.int(1, 40);
          const share = Q.of(k, n);
          const inner = k === 1 ? `${base}` : `${base ** k} = ${base}^{${k}}`;
          const rise = Q.of((b - a) * k, n);
          const answer = Q.of(a * n + (b - a) * k, n);
          const misses: Miss[] = [
            [
              Q.of(a + b, 2),
              "That takes the average of the two values; the radius is not halfway in $\\ln r$.",
              "那取了两个值的平均；这个半径在 $\\ln r$ 上不在一半处。",
            ],
            [
              Q.of(a * (base ** n - 1) + (b - a) * (base ** k - 1), base ** n - 1),
              "That interpolates linearly in $r$; radial harmonic functions are linear in $\\ln r$.",
              "那按 $r$ 线性插值；径向调和函数关于 $\\ln r$ 是线性的。",
            ],
            [rise, `That forgets the starting value $${a}$.`, `那忘了起始值 $${a}$。`],
            [Q.of(a * n + (b - a) * (n - k), n), "That measures the fraction from the outer radius.", "那从外半径量这个比例。"],
          ];
          return worked(
            [
              `$u$ is radial and harmonic on $1 < r < ${base ** n}$, with $u = ${a}$ at $r = 1$ and $u = ${b}$ at $r = ${base ** n}$. What is $u$ at $r = ${base ** k}$?`,
              `$u$ 在 $1 < r < ${base ** n}$ 上径向且调和，$r = 1$ 时 $u = ${a}$，$r = ${base ** n}$ 时 $u = ${b}$。$u$ 在 $r = ${base ** k}$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the fraction", "求比例"],
                [
                  `In $\\ln r$, the radius $${inner}$ is $\\frac{${k === 1 ? "" : k}\\ln ${base}}{${n}\\ln ${base}} = ${share.toLatex()}$ of the way from $1$ to $${base ** n} = ${base}^{${n}}$.`,
                  `在 $\\ln r$ 上，半径 $${inner}$ 从 $1$ 到 $${base ** n} = ${base}^{${n}}$ 走过了 $\\frac{${k === 1 ? "" : k}\\ln ${base}}{${n}\\ln ${base}} = ${share.toLatex()}$。`,
                ],
              ],
              [
                ["Interpolate", "插值"],
                [
                  `$u = ${a} + ${share.toLatex()} \\cdot ${b - a} = ${answer.toLatex()}$.`,
                  `$u = ${a} + ${share.toLatex()} \\cdot ${b - a} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The rise to $r = ${base ** k}$ is $${rise.toLatex()}$ and the rest is $${Q.of((b - a) * (n - k), n).toLatex()}$; their ratio is $${k} : ${n - k}$, the ratio of $\\ln ${base ** k}$ to $\\ln ${base ** n} - \\ln ${base ** k}$.`,
              `到 $r = ${base ** k}$ 的上升是 $${rise.toLatex()}$，其余是 $${Q.of((b - a) * (n - k), n).toLatex()}$；它们之比是 $${k} : ${n - k}$，正是 $\\ln ${base ** k}$ 与 $\\ln ${base ** n} - \\ln ${base ** k}$ 之比。`,
            ],
          );
        }),
    ),
  ],
);

const harmonicMax = topic(
  "the-maximum-principle-for-harmonic-functions",
  ["The Maximum Principle for Harmonic Functions", "调和函数的最大值原理"],
  ["Locate the extremes of a harmonic function, and solve the Neumann compatibility condition.", "找调和函数的最值，并解诺伊曼相容条件。"],
  ["laplaces-equation", "well-posed-problems"],
  [],
  [
    point(
      "the-center-of-a-ball",
      ["The center of a ball", "球心"],
      [
        "Because a harmonic function at the center of a ball equals its average on the surface, it cannot have a strict maximum inside. In three dimensions, a function such as $x^{2} + y^{2} - 2z^{2}$ illustrates this at any center. For example, its average on any sphere centered at $(1, 2, 1)$ is its center value $1 + 4 - 2 = 3$, whatever the radius.\n\nCheck: $\\Delta u = 2 + 2 - 4 = 0$, so $u$ is harmonic and the mean value property applies.\n\n> **Watch out.** The average of a harmonic function does not depend on the radius; do not add a term in $r^{2}$, which belongs to functions such as $x^{2} + y^{2} + z^{2}$ that are not harmonic.",
        "因为调和函数在球心的值等于它在球面上的平均，它在内部不可能有严格最大值。在三维中，像 $x^{2} + y^{2} - 2z^{2}$ 这样的函数在任何中心都说明了这一点。例如，它在任何以 $(1, 2, 1)$ 为球心的球面上的平均都是中心值 $1 + 4 - 2 = 3$，与半径无关。\n\n检验：$\\Delta u = 2 + 2 - 4 = 0$，所以 $u$ 调和，平均值性质适用。\n\n> **注意。** 调和函数的平均与半径无关；不要加上 $r^{2}$ 的项，那属于 $x^{2} + y^{2} + z^{2}$ 这类不调和的函数。",
      ],
      (rng) =>
        until(() => {
          const [x, y, z] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)];
          const r = rng.int(1, 9);
          const answer = x * x + y * y - 2 * z * z;
          const share = Q.of(r * r, 3).toLatex();
          const misses: Miss[] = [
            [x * x + y * y + 2 * z * z, "That drops the minus sign of $-2z^{2}$.", "那丢掉了 $-2z^{2}$ 的负号。"],
            [
              answer + r * r,
              "That adds $r^{2}$; for a harmonic function the average does not depend on the radius.",
              "那加上了 $r^{2}$；调和函数的平均与半径无关。",
            ],
            [0, "The average of a harmonic function is its center value, not zero.", "调和函数的平均是中心的值，不是零。"],
          ];
          return worked(
            [
              `What is the average of $u = x^{2} + y^{2} - 2z^{2}$ on the sphere of radius ${r} centered at $(${x}, ${y}, ${z})$?`,
              `$u = x^{2} + y^{2} - 2z^{2}$ 在以 $(${x}, ${y}, ${z})$ 为球心、半径为 ${r} 的球面上的平均值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Check that it is harmonic", "检验调和"],
                [
                  "$\\Delta u = 2 + 2 - 4 = 0$, so the average on a sphere is the value at its center.",
                  "$\\Delta u = 2 + 2 - 4 = 0$，所以球面上的平均是球心的值。",
                ],
              ],
              [
                ["Evaluate at the center", "在球心求值"],
                [
                  `$${wrap(x)}^{2} + ${wrap(y)}^{2} - 2 \\cdot ${wrap(z)}^{2} = ${x * x} + ${y * y} - ${2 * z * z} = ${answer}$.`,
                  `$${wrap(x)}^{2} + ${wrap(y)}^{2} - 2 \\cdot ${wrap(z)}^{2} = ${x * x} + ${y * y} - ${2 * z * z} = ${answer}$。`,
                ],
              ],
            ],
            [
              `On a sphere of radius ${r}, the linear terms average $0$ and each squared offset from the center averages $${share}$, so the extra terms give $${share} + ${share} - 2 \\cdot ${share} = 0$, leaving the center value.`,
              `在半径为 ${r} 的球面上，一次项的平均是 $0$，相对中心的每个平方偏移的平均都是 $${share}$，所以附加项给出 $${share} + ${share} - 2 \\cdot ${share} = 0$，只剩中心的值。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "extremes-on-the-boundary",
        ["Extremes on the boundary", "边界上的最值"],
        [
          "The maximum and minimum of a harmonic function on a closed bounded region occur on the boundary. So on a disc, write the function in polar form, and read the largest value from the boundary circle. For example, in the figure $u = x^{2} - y^{2} = r^{2}\\cos(2\\theta)$ on the disc of radius $2$ reaches its maximum $4$ at $(\\pm 2, 0)$ and its minimum $-4$ at $(0, \\pm 2)$, while the center has only $0$.\n\nCheck: at $(2, 0)$, $u = 4 - 0 = 4$, and no interior point does better, since $x^{2} - y^{2} \\le x^{2} + y^{2} < 4$ inside.\n\n> **Watch out.** The center is not the maximum; the extremes of a harmonic function sit on the boundary.",
          "调和函数在闭有界区域上的最大值和最小值都在边界上。所以在圆盘上，把函数写成极坐标形式，再从边界圆上读出最大值。例如，图中半径为 $2$ 的圆盘上 $u = x^{2} - y^{2} = r^{2}\\cos(2\\theta)$ 在 $(\\pm 2, 0)$ 处取最大值 $4$，在 $(0, \\pm 2)$ 处取最小值 $-4$，而中心只有 $0$。\n\n检验：在 $(2, 0)$ 处 $u = 4 - 0 = 4$，而内部没有点更大，因为内部 $x^{2} - y^{2} \\le x^{2} + y^{2} < 4$。\n\n> **注意。** 中心不是最大值；调和函数的最值在边界上。",
        ],
        (rng) =>
          until(() => {
            const r = rng.int(2, 15);
            const a = rng.int(2, 9);
            const c = rng.int(-20, 20);
            const tail = c === 0 ? "" : ` ${plus(c)}`;
            const answer = a * r * r + c;
            const misses: Miss[] = [
              [
                c,
                "That is the value at the center; a harmonic function takes its maximum on the boundary.",
                "那是中心的值；调和函数在边界上取最大值。",
              ],
              [a * r + c, "That forgets to square the radius.", "那忘了把半径平方。"],
              [
                2 * a * r * r + c,
                "That counts both $x^{2}$ and $y^{2}$ as $r^{2}$; on the circle $x^{2} - y^{2} = r^{2}\\cos(2\\theta)$.",
                "那把 $x^{2}$ 和 $y^{2}$ 都当成 $r^{2}$；在圆上 $x^{2} - y^{2} = r^{2}\\cos(2\\theta)$。",
              ],
              [-a * r * r + c, "That is the minimum, reached at $(0, \\pm r)$.", "那是最小值，在 $(0, \\pm r)$ 处取到。"],
            ];
            return worked(
              [
                `What is the maximum of $u = ${a}(x^{2} - y^{2})${tail}$ on the disc $x^{2} + y^{2} \\le ${r * r}$?`,
                `$u = ${a}(x^{2} - y^{2})${tail}$ 在圆盘 $x^{2} + y^{2} \\le ${r * r}$ 上的最大值是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Go to the boundary", "转到边界"],
                  [
                    `By the maximum principle the maximum lies on the circle of radius ${r}, where $x^{2} - y^{2} = ${r * r}\\cos(2\\theta)$, at most $${r * r}$.`,
                    `由最大值原理，最大值在半径为 ${r} 的圆上，那里 $x^{2} - y^{2} = ${r * r}\\cos(2\\theta)$，至多是 $${r * r}$。`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [`$${a} \\cdot ${r * r}${tail} = ${answer}$.`, `$${a} \\cdot ${r * r}${tail} = ${answer}$。`],
                ],
              ],
              [
                `At $(${r}, 0)$, $u = ${a}(${r * r} - 0)${tail} = ${answer}$, while the center gives only $${c}$.`,
                `在 $(${r}, 0)$ 处 $u = ${a}(${r * r} - 0)${tail} = ${answer}$，而中心只有 $${c}$。`,
              ],
            );
          }),
      ),
      figure: pdeDrawings1["the-maximum-principle-for-harmonic-functions#extremes-on-the-boundary"],
    },
    point(
      "the-neumann-compatibility-condition",
      ["The Neumann compatibility condition", "诺伊曼相容条件"],
      [
        "The divergence theorem says a solution of $\\Delta u = f$ with prescribed flux must have the integral of $f$ equal to the total boundary flux. Without this balance, the steady Neumann problem has no solution at all. For example, $\\Delta u = 2$ on a $3$ by $2$ rectangle has source integral $2 \\cdot 6 = 12$, so if $5$ flows out through part of the boundary, the rest must carry $T = 12 - 5 = 7$.\n\nCheck: the total flux out is $5 + 7 = 12$, the integral of the source.\n\n> **Watch out.** Multiply the source by the area, not the perimeter; and $T$ may come out negative, which means flux in.",
        "散度定理说明，$\\Delta u = f$ 在给定通量下有解时，$f$ 的积分必须等于边界总通量。没有这个平衡，稳态诺伊曼问题根本无解。例如，$3$ 乘 $2$ 的矩形上 $\\Delta u = 2$ 的源积分是 $2 \\cdot 6 = 12$，所以若有 $5$ 通过部分边界流出，其余部分必须带走 $T = 12 - 5 = 7$。\n\n检验：向外的总通量是 $5 + 7 = 12$，正是源的积分。\n\n> **注意。** 源要乘面积，而不是周长；$T$ 可能为负，表示向内的通量。",
      ],
      (rng) =>
        until(() => {
          const f = rng.int(1, 12);
          const a = rng.int(1, 9);
          const b = rng.int(1, 9);
          const flux = rng.int(1, 40);
          const total = f * a * b;
          const answer = total - flux;
          const misses: Miss[] = [
            [
              total + flux,
              "That adds the given flux; the two fluxes together must make up the source.",
              "那加上了给定的通量；两部分通量合起来才等于源。",
            ],
            [flux, "That copies the given flux; the source fixes the total.", "那照抄了给定的通量；源决定总量。"],
            [
              2 * f * (a + b) - flux,
              "That multiplies the source by the perimeter; it is integrated over the area.",
              "那用源乘周长；应该在面积上积分。",
            ],
            [
              -answer,
              "That reverses the sign; the outward fluxes add up to the source integral.",
              "那符号反了；向外的通量之和等于源的积分。",
            ],
          ];
          return worked(
            [
              `For $\\Delta u = ${f}$ on a ${a} by ${b} rectangle, the flux out is ${flux} through part of the boundary and a constant total $T$ through the rest. For a solution to exist, what must $T$ be?`,
              `对 ${a} 乘 ${b} 的矩形上的 $\\Delta u = ${f}$，通过部分边界向外的通量是 ${flux}，通过其余边界的总量是常数 $T$。要使解存在，$T$ 必须是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Integrate the source", "对源积分"],
                [
                  `The source integrates to $${f} \\cdot ${a} \\cdot ${b} = ${total}$ over the rectangle.`,
                  `源在矩形上的积分是 $${f} \\cdot ${a} \\cdot ${b} = ${total}$。`,
                ],
              ],
              [
                ["Balance the flux", "平衡通量"],
                [`$${flux} + T = ${total}$, so $T = ${answer}$.`, `$${flux} + T = ${total}$，所以 $T = ${answer}$。`],
              ],
            ],
            [
              `The total flux out is $${flux} ${plus(answer)} = ${total}$, the integral of the source.`,
              `向外的总通量是 $${flux} ${plus(answer)} = ${total}$，正是源的积分。`,
            ],
          );
        }),
    ),
  ],
);

const fdLaplace = topic(
  "finite-differences-for-laplaces-equation",
  ["Finite Differences for Laplace's Equation", "拉普拉斯方程的有限差分"],
  ["Solve Laplace's equation on a grid by repeatedly averaging neighbors.", "在网格上反复平均相邻点来解拉普拉斯方程。"],
  ["laplaces-equation", "finite-differences-for-the-heat-equation"],
  [],
  [
    point(
      "the-five-point-rule",
      ["The five point rule", "五点格式"],
      [
        "Replacing second derivatives by differences on a square grid gives the five point rule. Each interior value of the discrete solution equals the average of its four neighbors, which mirrors the mean value property. For example, a point whose neighbors are $1$, $3$, $5$ and $7$ gets $\\frac{16}{4} = 4$.\n\nCheck: the discrete Laplacian $1 + 3 + 5 + 7 - 4 \\cdot 4$ is $0$.\n\n> **Watch out.** Divide by $4$: the point itself is not one of its neighbors.",
        "在正方形网格上用差分代替二阶导数，得到五点格式。离散解的每个内部值等于它四个相邻点的平均，这对应平均值性质。例如，相邻点为 $1$、$3$、$5$、$7$ 的点得到 $\\frac{16}{4} = 4$。\n\n检验：离散拉普拉斯 $1 + 3 + 5 + 7 - 4 \\cdot 4$ 等于 $0$。\n\n> **注意。** 要除以 $4$：这一点本身不是它的相邻点。",
      ],
      (rng) =>
        until(() => {
          const n = [rng.int(-20, 40), rng.int(-20, 40), rng.int(-20, 40), rng.int(-20, 40)] as const;
          const s = n[0] + n[1] + n[2] + n[3];
          const answer = Q.of(s, 4);
          const sum = `${n[0]} ${plus(n[1])} ${plus(n[2])} ${plus(n[3])}`;
          const misses: Miss[] = [
            [s, "That is the sum; take the average.", "那是和；要取平均。"],
            [Q.of(s, 5), "That divides by $5$, as if the point were its own neighbor.", "那除以 $5$，好像这一点是自己的相邻点。"],
            [Q.of(s, 2), "That divides by $2$; there are four neighbors.", "那除以 $2$；共有四个相邻点。"],
          ];
          return worked(
            [
              `A grid point has neighbors with the values $${n.join(", ")}$. What value does the five point rule give at this point?`,
              `一个网格点的相邻点值为 $${n.join(", ")}$。五点格式给出这一点的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Add the neighbors", "相邻点相加"],
                [`$${sum} = ${s}$.`, `$${sum} = ${s}$。`],
              ],
              [
                ["Average", "取平均"],
                [`$${settle(s, 4, answer)}$.`, `$${settle(s, 4, answer)}$。`],
              ],
            ],
            [
              `The discrete Laplacian vanishes: $${s} - 4 \\cdot ${pq(answer)} = 0$.`,
              `离散拉普拉斯为零：$${s} - 4 \\cdot ${pq(answer)} = 0$。`,
            ],
          );
        }),
    ),
    point(
      "one-jacobi-sweep",
      ["One Jacobi sweep", "一次雅可比迭代"],
      [
        "Jacobi iteration updates every interior point at once from the old values of its neighbors. Repeating this sweep lets the boundary information spread inward, and the iteration settles to the discrete solution. For example, a point with boundary neighbors $10$, $20$, $30$, an interior neighbor whose old value is $0$, and its own old value $50$ becomes $\\frac{10 + 20 + 30 + 0}{4} = 15$.\n\nCheck: $15$ lies between the smallest neighbor $0$ and the largest $30$, as an average must.\n\n> **Watch out.** The point's own old value is not used; only the four neighbors count.",
        "雅可比迭代用相邻点的旧值同时更新每个内部点。重复这一过程使边界信息向内传播，迭代收敛到离散解。例如，边界相邻点为 $10$、$20$、$30$，内部相邻点旧值为 $0$，自身旧值为 $50$ 的点变成 $\\frac{10 + 20 + 30 + 0}{4} = 15$。\n\n检验：$15$ 在最小的相邻值 $0$ 和最大的 $30$ 之间，平均值理应如此。\n\n> **注意。** 不用这一点自己的旧值；只有四个相邻点起作用。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-20, 40) * 4;
          const b = rng.int(-20, 40);
          const c = rng.int(-20, 40);
          const d = rng.int(-20, 40);
          const oldNext = rng.int(-20, 40);
          const s = b + c + d + oldNext;
          const answer = Q.of(s, 4);
          const low = Math.min(b, c, d, oldNext);
          const high = Math.max(b, c, d, oldNext);
          const misses: Miss[] = [
            [
              Q.of(a + b + c + d, 4),
              "That uses the point's own old value in place of its interior neighbor.",
              "那用这一点自己的旧值代替了内部相邻点。",
            ],
            [Q.of(s + a, 5), "That averages five values; the point itself is left out.", "那平均了五个值；这一点本身不算在内。"],
            [Q.of(b + c + d, 3), "That leaves out the interior neighbor.", "那漏掉了内部相邻点。"],
          ];
          return worked(
            [
              `An interior point has three boundary neighbors $${b}$, $${c}$ and $${d}$, and one interior neighbor whose old value is ${oldNext}. Its own old value is ${a}. What is its value after one Jacobi sweep?`,
              `一个内部点有三个边界相邻点 $${b}$、$${c}$ 和 $${d}$，以及一个旧值为 ${oldNext} 的内部相邻点。它自己的旧值是 ${a}。一次雅可比迭代后它的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Add the neighbors", "相邻点相加"],
                [
                  `The own old value ${a} is not used: $${b} ${plus(c)} ${plus(d)} ${plus(oldNext)} = ${s}$.`,
                  `不用自己的旧值 ${a}：$${b} ${plus(c)} ${plus(d)} ${plus(oldNext)} = ${s}$。`,
                ],
              ],
              [
                ["Average", "取平均"],
                [`$${settle(s, 4, answer)}$.`, `$${settle(s, 4, answer)}$。`],
              ],
            ],
            [
              `$${answer.toLatex()}$ lies between the smallest neighbor $${low}$ and the largest $${high}$, as an average must.`,
              `$${answer.toLatex()}$ 在最小的相邻值 $${low}$ 和最大的 $${high}$ 之间，平均值理应如此。`,
            ],
          );
        }),
    ),
    point(
      "a-small-grid-exactly",
      ["A small grid exactly", "精确解小网格"],
      [
        "A grid with a few interior points yields a small linear system. Solving it exactly gives the discrete solution, and symmetric boundary data lets the unknowns be reduced before any arithmetic is done. For example, if the boundary neighbors of $A$ add up to $12$ and those of $B$ to $27$, then $4A = 12 + B$ and $4B = 27 + A$, so $15A = 4 \\cdot 12 + 27 = 75$ and $A = 5$, $B = 8$.\n\nCheck: $4 \\cdot 8 = 32 = 27 + 5$.\n\n> **Watch out.** $A$ and $B$ are neighbors of each other, so each equation contains the other unknown; leaving it out gives the wrong value.",
        "内部点很少的网格给出一个小线性方程组。精确求解它就得到离散解，对称的边界数据可以在计算之前减少未知数。例如，若 $A$ 的边界相邻点之和为 $12$，$B$ 的为 $27$，则 $4A = 12 + B$，$4B = 27 + A$，所以 $15A = 4 \\cdot 12 + 27 = 75$，$A = 5$，$B = 8$。\n\n检验：$4 \\cdot 8 = 32 = 27 + 5$。\n\n> **注意。** $A$ 和 $B$ 互为相邻点，所以每个方程都含另一个未知数；漏掉它会得到错误的值。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(-20, 40);
          const q = rng.int(-20, 40);
          const r = rng.int(-20, 40);
          const s = rng.int(-20, 40);
          const t = rng.int(-20, 40);
          const v = rng.int(-20, 40);
          const left = p + q + r;
          const right = s + t + v;
          if (left === 0) return undefined;
          const answer = Q.of(4 * left + right, 15);
          const other = answer.mul(Q.of(4)).sub(Q.of(left));
          const misses: Miss[] = [
            [
              Q.of(left + right, 8),
              "That averages all six boundary values; each point sees only its own.",
              "那平均了全部六个边界值；每一点只看自己的边界值。",
            ],
            [Q.of(left, 3), "That assumes $A = B$, which holds only for symmetric data.", "那假设 $A = B$，这只在数据对称时成立。"],
            [Q.of(left, 4), "That treats $B$ as $0$; $B$ is a neighbor of $A$.", "那把 $B$ 当成 $0$；$B$ 是 $A$ 的相邻点。"],
          ];
          return worked(
            [
              `Two adjacent interior points $A$ and $B$ each have three boundary neighbors. Those of $A$ are $${p}, ${q}, ${r}$, and those of $B$ are $${s}, ${t}, ${v}$. What is $A$ under the five point rule?`,
              `两个相邻的内部点 $A$ 和 $B$ 各有三个边界相邻点。$A$ 的是 $${p}, ${q}, ${r}$，$B$ 的是 $${s}, ${t}, ${v}$。按五点格式 $A$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Write the equations", "写出方程"],
                [
                  `$4A = ${left} + B$ and $4B = ${right} + A$, since $${p} ${plus(q)} ${plus(r)} = ${left}$ and $${s} ${plus(t)} ${plus(v)} = ${right}$.`,
                  `$4A = ${left} + B$，$4B = ${right} + A$，因为 $${p} ${plus(q)} ${plus(r)} = ${left}$，$${s} ${plus(t)} ${plus(v)} = ${right}$。`,
                ],
              ],
              [
                ["Eliminate $B$", "消去 $B$"],
                [
                  `$B = 4A ${plus(-left)}$, so $16A ${plus(-4 * left)} = ${right} + A$, giving $15A = ${4 * left + right}$ and $A = ${answer.toLatex()}$.`,
                  `$B = 4A ${plus(-left)}$，所以 $16A ${plus(-4 * left)} = ${right} + A$，得 $15A = ${4 * left + right}$，$A = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Then $B = ${other.toLatex()}$, and $4B = ${other.mul(Q.of(4)).toLatex()}$ equals $${right} + A = ${answer.add(Q.of(right)).toLatex()}$.`,
              `于是 $B = ${other.toLatex()}$，而 $4B = ${other.mul(Q.of(4)).toLatex()}$ 等于 $${right} + A = ${answer.add(Q.of(right)).toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

const stability = topic(
  "stability-of-difference-schemes",
  ["Stability of Difference Schemes", "差分格式的稳定性"],
  ["Choose a time step that keeps explicit schemes from blowing up.", "选择使显式格式不爆炸的时间步长。"],
  ["finite-differences-for-the-wave-equation"],
  [],
  [
    point(
      "the-largest-heat-step",
      ["The largest heat step", "最大的热方程步长"],
      [
        "The explicit scheme for the heat equation is stable only when $\\alpha\\frac{\\Delta t}{\\Delta x^{2}} \\le \\frac{1}{2}$. So halving the space step forces a time step four times smaller, which makes fine grids expensive. For example, $u_t = 2u_{xx}$ with $\\Delta x = \\frac{1}{10}$ allows at most $\\Delta t = \\frac{\\Delta x^{2}}{2\\alpha} = \\frac{1}{400}$.\n\nCheck: $2 \\cdot \\frac{1}{400} \\cdot 100 = \\frac{1}{2}$, exactly the limit.\n\n> **Watch out.** $\\Delta x$ is squared, and the bound has the factor $\\frac{1}{2}$; dropping either gives a step that blows up.",
        "热方程的显式格式只有在 $\\alpha\\frac{\\Delta t}{\\Delta x^{2}} \\le \\frac{1}{2}$ 时才稳定。所以空间步长减半迫使时间步长缩小四倍，使细网格代价很高。例如，$u_t = 2u_{xx}$、$\\Delta x = \\frac{1}{10}$ 时最多允许 $\\Delta t = \\frac{\\Delta x^{2}}{2\\alpha} = \\frac{1}{400}$。\n\n检验：$2 \\cdot \\frac{1}{400} \\cdot 100 = \\frac{1}{2}$，恰好是界限。\n\n> **注意。** $\\Delta x$ 要平方，界限中有因子 $\\frac{1}{2}$；漏掉任一个都会得到爆炸的步长。",
      ],
      (rng) =>
        until(() => {
          const alpha = rng.int(1, 12);
          const n = rng.int(2, 25);
          const answer = Q.of(1, 2 * alpha * n * n);
          const misses: Miss[] = [
            [Q.of(1, alpha * n * n), "That forgets the $\\frac{1}{2}$ in the condition.", "那忘了条件中的 $\\frac{1}{2}$。"],
            [Q.of(1, 2 * alpha * n), "That does not square $\\Delta x$.", "那没有把 $\\Delta x$ 平方。"],
            [Q.of(1, 2 * n * n), `That leaves out $\\alpha = ${alpha}$.`, `那漏掉了 $\\alpha = ${alpha}$。`],
          ];
          return worked(
            [
              `For $u_t = ${alpha}u_{xx}$ with $\\Delta x = \\frac{1}{${n}}$, what is the largest stable $\\Delta t$ for the explicit scheme?`,
              `对 $u_t = ${alpha}u_{xx}$，$\\Delta x = \\frac{1}{${n}}$，显式格式最大的稳定 $\\Delta t$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Square the space step", "空间步长平方"],
                [`$\\Delta x^{2} = \\frac{1}{${n * n}}$.`, `$\\Delta x^{2} = \\frac{1}{${n * n}}$。`],
              ],
              [
                ["Use the bound", "使用界限"],
                [
                  `$\\Delta t = \\frac{\\Delta x^{2}}{2\\alpha} = \\frac{1}{${n * n}} \\div ${2 * alpha} = ${answer.toLatex()}$.`,
                  `$\\Delta t = \\frac{\\Delta x^{2}}{2\\alpha} = \\frac{1}{${n * n}} \\div ${2 * alpha} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$${alpha} \\cdot ${answer.toLatex()} \\cdot ${n * n} = \\frac{1}{2}$, exactly the limit.`,
              `$${alpha} \\cdot ${answer.toLatex()} \\cdot ${n * n} = \\frac{1}{2}$，恰好是界限。`,
            ],
          );
        }),
    ),
    point(
      "the-cfl-condition",
      ["The CFL condition", "CFL 条件"],
      [
        "The explicit wave scheme needs $c\\frac{\\Delta t}{\\Delta x} \\le 1$, the Courant-Friedrichs-Lewy condition. The numerical domain of dependence must contain the true one, or information would outrun the grid. For example, with $c = 4$ and $\\Delta x = \\frac{1}{20}$, the largest stable step is $\\Delta t = \\frac{\\Delta x}{c} = \\frac{1}{80}$.\n\nCheck: $4 \\cdot \\frac{1}{80} \\cdot 20 = 1$, exactly the limit.\n\n> **Watch out.** Divide the space step by the speed; and unlike the heat scheme, there is no square and no $\\frac{1}{2}$.",
        "显式波动格式需要 $c\\frac{\\Delta t}{\\Delta x} \\le 1$，即柯朗-弗里德里希斯-列维条件。数值依赖域必须包含真实依赖域，否则信息会跑得比网格快。例如，$c = 4$、$\\Delta x = \\frac{1}{20}$ 时，最大的稳定步长是 $\\Delta t = \\frac{\\Delta x}{c} = \\frac{1}{80}$。\n\n检验：$4 \\cdot \\frac{1}{80} \\cdot 20 = 1$，恰好是界限。\n\n> **注意。** 要用空间步长除以速度；与热方程格式不同，这里没有平方，也没有 $\\frac{1}{2}$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 30);
          const n = rng.int(2, 60);
          const answer = Q.of(1, c * n);
          const misses: Miss[] = [
            [Q.of(c, n), "That multiplies the space step by the speed; divide by it.", "那用空间步长乘速度；应该除以速度。"],
            [Q.of(1, 2 * c * n), "That borrows the $\\frac{1}{2}$ of the heat scheme.", "那借用了热方程格式的 $\\frac{1}{2}$。"],
            [Q.of(1, n), "That leaves out the speed.", "那漏掉了速度。"],
            [Q.of(1, c * n * n), "That squares $\\Delta x$, as for the heat scheme.", "那把 $\\Delta x$ 平方，像热方程格式那样。"],
          ];
          return worked(
            [
              `For the wave equation with $c = ${c}$ and $\\Delta x = \\frac{1}{${n}}$, what is the largest stable $\\Delta t$ for the explicit scheme?`,
              `对 $c = ${c}$、$\\Delta x = \\frac{1}{${n}}$ 的波动方程，显式格式最大的稳定 $\\Delta t$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Solve the condition", "解条件"],
                [
                  "$c\\frac{\\Delta t}{\\Delta x} \\le 1$ gives $\\Delta t \\le \\frac{\\Delta x}{c}$.",
                  "$c\\frac{\\Delta t}{\\Delta x} \\le 1$ 给出 $\\Delta t \\le \\frac{\\Delta x}{c}$。",
                ],
              ],
              [
                ["Divide", "相除"],
                [
                  `$\\Delta t = \\frac{1}{${n}} \\div ${c} = ${answer.toLatex()}$.`,
                  `$\\Delta t = \\frac{1}{${n}} \\div ${c} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$${c} \\cdot ${answer.toLatex()} \\cdot ${n} = 1$, exactly the limit.`,
              `$${c} \\cdot ${answer.toLatex()} \\cdot ${n} = 1$，恰好是界限。`,
            ],
          );
        }),
    ),
    point(
      "the-amplification-factor",
      ["The amplification factor", "放大因子"],
      [
        "Von Neumann analysis puts a single wave into the scheme and asks how much it grows each step. For the explicit heat scheme, the factor is $1 - 4r\\sin^{2}\\frac{\\theta}{2}$, and stability needs its size to be at most 1. For example, at the highest frequency $\\theta = \\pi$ the factor is $1 - 4r$, so $r = \\frac{1}{2}$ gives $-1$, just stable, and $r = \\frac{3}{4}$ gives $-2$, which doubles the wave in size every step.\n\nCheck: $|1 - 4r| \\le 1$ exactly when $0 \\le r \\le \\frac{1}{2}$, the stability condition of the heat scheme.\n\n> **Watch out.** At $\\theta = \\pi$ the sine squared is $\\sin^{2}\\frac{\\pi}{2} = 1$, and the factor is $1 - 4r$, not $1 + 4r$.",
        "冯·诺伊曼分析把单一波放入格式，看它每步增长多少。对显式热方程格式，因子是 $1 - 4r\\sin^{2}\\frac{\\theta}{2}$，稳定性要求它的绝对值不超过 1。例如，在最高频率 $\\theta = \\pi$ 处因子是 $1 - 4r$，所以 $r = \\frac{1}{2}$ 给出 $-1$，恰好稳定；$r = \\frac{3}{4}$ 给出 $-2$，波的大小每步加倍。\n\n检验：$|1 - 4r| \\le 1$ 恰好在 $0 \\le r \\le \\frac{1}{2}$ 时成立，正是热方程格式的稳定条件。\n\n> **注意。** 在 $\\theta = \\pi$ 处正弦平方是 $\\sin^{2}\\frac{\\pi}{2} = 1$，因子是 $1 - 4r$，不是 $1 + 4r$。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(2, 40);
          const a = rng.int(1, 3 * b);
          const r = Q.of(a, b);
          const four = r.mul(Q.of(4));
          const answer = Q.one.sub(four);
          const stable = answer.abs().cmp(Q.one) <= 0;
          const misses: Miss[] = [
            [Q.one.add(four), "That adds $4r$; it is subtracted.", "那加上了 $4r$；它应该减去。"],
            [
              Q.one.sub(r.mul(Q.of(2))),
              "That uses $\\sin^{2}\\frac{\\theta}{2} = \\frac{1}{2}$, the value at $\\theta = \\frac{\\pi}{2}$.",
              "那用了 $\\sin^{2}\\frac{\\theta}{2} = \\frac{1}{2}$，那是 $\\theta = \\frac{\\pi}{2}$ 处的值。",
            ],
            [four, "That leaves out the $1$.", "那漏掉了 $1$。"],
          ];
          return worked(
            [
              `With $r = ${r.toLatex()}$, what is the amplification factor $1 - 4r\\sin^{2}\\frac{\\theta}{2}$ of the highest frequency, $\\theta = \\pi$?`,
              `当 $r = ${r.toLatex()}$ 时，最高频率 $\\theta = \\pi$ 的放大因子 $1 - 4r\\sin^{2}\\frac{\\theta}{2}$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Evaluate the sine", "计算正弦"],
                [
                  "At $\\theta = \\pi$, $\\sin^{2}\\frac{\\pi}{2} = 1$, so the factor is $1 - 4r$.",
                  "在 $\\theta = \\pi$ 处 $\\sin^{2}\\frac{\\pi}{2} = 1$，所以因子是 $1 - 4r$。",
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `$1 - 4 \\cdot ${r.toLatex()} = 1 - ${four.toLatex()} = ${answer.toLatex()}$.`,
                  `$1 - 4 \\cdot ${r.toLatex()} = 1 - ${four.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            stable
              ? [
                  `$|${answer.toLatex()}| \\le 1$, as it must be, since $r = ${r.toLatex()} \\le \\frac{1}{2}$ satisfies the stability condition.`,
                  `$|${answer.toLatex()}| \\le 1$，理应如此，因为 $r = ${r.toLatex()} \\le \\frac{1}{2}$ 满足稳定条件。`,
                ]
              : [
                  `$|${answer.toLatex()}| > 1$, so this wave grows every step, as expected, since $r = ${r.toLatex()} > \\frac{1}{2}$ breaks the stability condition.`,
                  `$|${answer.toLatex()}| > 1$，所以这个波每步增长，与预期相符，因为 $r = ${r.toLatex()} > \\frac{1}{2}$ 违反了稳定条件。`,
                ],
          );
        }),
    ),
  ],
);

const similarity = topic(
  "scaling-and-similarity-solutions",
  ["Scaling and Similarity Solutions", "缩放和相似解"],
  ["Use the symmetries of an equation to reduce the number of variables.", "利用方程的对称性减少变量的个数。"],
  ["the-heat-kernel"],
  [],
  [
    point(
      "rescaling-a-heat-solution",
      ["Rescaling a heat solution", "缩放热方程的解"],
      [
        "If $u(x, t)$ solves the heat equation, then so does $u(\\lambda x, \\lambda^{2} t)$, because each side picks up the same factor. So time scales as the square of length, and doubling a rod quadruples its cooling time. For example, a rod of length $2$ that cools in $10$ minutes has a similar rod of length $6$ cooling in $10 \\cdot 3^{2} = 90$ minutes.\n\nCheck: time over length squared stays the same, $\\frac{10}{4} = \\frac{90}{36} = \\frac{5}{2}$.\n\n> **Watch out.** Time scales with the square of the length ratio, not the ratio itself.",
        "如果 $u(x, t)$ 解热方程，那么 $u(\\lambda x, \\lambda^{2} t)$ 也是解，因为两边得到相同的因子。所以时间按长度的平方缩放，杆长加倍使冷却时间变成四倍。例如，长度为 $2$ 的杆在 $10$ 分钟内冷却，长度为 $6$ 的相似杆需要 $10 \\cdot 3^{2} = 90$ 分钟。\n\n检验：时间除以长度平方不变，$\\frac{10}{4} = \\frac{90}{36} = \\frac{5}{2}$。\n\n> **注意。** 时间按长度比的平方缩放，而不是按比值本身。",
      ],
      (rng) =>
        until(() => {
          const [a, b] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
          const t = rng.int(2, 60);
          const factor = Q.of(b * b, a * a);
          const answer = Q.of(t * b * b, a * a);
          const misses: Miss[] = [
            [
              Q.of(t * b, a),
              "That scales time with the length itself; it scales with the square.",
              "那让时间按长度本身缩放；应按平方缩放。",
            ],
            [Q.of(t * a * a, b * b), "That inverts the ratio; a longer rod takes longer.", "那把比值颠倒了；杆越长用时越长。"],
            [t, "That keeps the time fixed; it changes with the length.", "那让时间不变；它随长度变化。"],
          ];
          return worked(
            [
              `A rod of length ${a} cools to some state in ${t} minutes. How long does a similar rod of length ${b} with the same material take?`,
              `长度为 ${a} 的杆在 ${t} 分钟内冷却到某个状态。材料相同、长度为 ${b} 的相似杆需要多长时间？`,
            ],
            answer,
            misses,
            [
              [
                ["Square the length ratio", "长度比平方"],
                [
                  `Time scales as length squared, so it is multiplied by $\\left(${Q.of(b, a).toLatex()}\\right)^{2} = ${factor.toLatex()}$.`,
                  `时间按长度的平方缩放，所以乘 $\\left(${Q.of(b, a).toLatex()}\\right)^{2} = ${factor.toLatex()}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${t} \\cdot ${factor.toLatex()} = ${answer.toLatex()}$ minutes.`,
                  `$${t} \\cdot ${factor.toLatex()} = ${answer.toLatex()}$ 分钟。`,
                ],
              ],
            ],
            [
              `Time over length squared stays the same: $${settle(t, a * a, Q.of(t, a * a))}$ and $${pq(answer)} \\div ${b * b} = ${Q.of(t, a * a).toLatex()}$.`,
              `时间除以长度平方不变：$${settle(t, a * a, Q.of(t, a * a))}$，而 $${pq(answer)} \\div ${b * b} = ${Q.of(t, a * a).toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "the-similarity-variable",
      ["The similarity variable", "相似变量"],
      [
        "The combination $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ is unchanged by that scaling. So data with no length scale, such as a step, gives a solution depending only on $\\eta$, turning the PDE into an ODE. For example, for $u_t = u_{xx}$ at $x = 6$, $t = 9$, $\\sqrt{4 \\cdot 1 \\cdot 9} = 6$, so $\\eta = 1$.\n\nCheck: doubling $x$ to $12$ and quadrupling $t$ to $36$ gives $\\frac{12}{\\sqrt{144}} = 1$ again.\n\n> **Watch out.** The square root covers all of $4\\alpha t$; divide $x$ by that root, not by $t$.",
        "组合 $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ 在这种缩放下不变。所以没有长度尺度的数据（例如阶跃）给出只依赖 $\\eta$ 的解，把偏微分方程变成常微分方程。例如，对 $u_t = u_{xx}$，在 $x = 6$、$t = 9$ 处 $\\sqrt{4 \\cdot 1 \\cdot 9} = 6$，所以 $\\eta = 1$。\n\n检验：$x$ 加倍为 $12$、$t$ 变为四倍 $36$，得 $\\frac{12}{\\sqrt{144}} = 1$，仍然相同。\n\n> **注意。** 平方根覆盖整个 $4\\alpha t$；要用 $x$ 除以这个根，而不是除以 $t$。",
      ],
      (rng) =>
        until(() => {
          const alpha = rng.pick([1, 2, 3, 5, 6, 7]);
          const m = rng.int(1, 6);
          const t = alpha * m * m;
          const x = rng.int(1, 60);
          const s = 2 * alpha * m;
          const answer = Q.of(x, s);
          const misses: Miss[] = [
            [
              Q.of(x, 2 * s),
              "That divides by $2$ once more; the $4$ under the root already gives the factor $2$.",
              "那又除了一次 $2$；根号下的 $4$ 已经给出因子 $2$。",
            ],
            [Q.of(x, alpha * m), "That forgets the $4$ under the root.", "那忘了根号下的 $4$。"],
            [Q.of(x, t), "That divides by $t$ without the square root.", "那除以 $t$，没有开平方。"],
            [Q.of(x, 4 * alpha * t), "That forgets to take the square root.", "那忘了开平方。"],
          ];
          return worked(
            [
              `For $u_t = ${alpha}u_{xx}$, what is the similarity variable $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ at $x = ${x}$, $t = ${t}$?`,
              `对 $u_t = ${alpha}u_{xx}$，相似变量 $\\eta = \\frac{x}{\\sqrt{4\\alpha t}}$ 在 $x = ${x}$、$t = ${t}$ 处是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Take the root", "开平方"],
                [
                  `$\\sqrt{4 \\cdot ${alpha} \\cdot ${t}} = \\sqrt{${s * s}} = ${s}$.`,
                  `$\\sqrt{4 \\cdot ${alpha} \\cdot ${t}} = \\sqrt{${s * s}} = ${s}$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [`$\\eta = ${settle(x, s, answer)}$.`, `$\\eta = ${settle(x, s, answer)}$。`],
              ],
            ],
            [
              `Doubling $x$ to ${2 * x} and quadrupling $t$ to ${4 * t} gives $\\frac{${2 * x}}{\\sqrt{${4 * s * s}}} = \\frac{${2 * x}}{${2 * s}}$, the same $${answer.toLatex()}$.`,
              `$x$ 加倍为 ${2 * x}、$t$ 变为四倍 ${4 * t}，得 $\\frac{${2 * x}}{\\sqrt{${4 * s * s}}} = \\frac{${2 * x}}{${2 * s}}$，仍是 $${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "how-far-diffusion-reaches",
      ["How far diffusion reaches", "扩散能走多远"],
      [
        "Since the solution depends on $\\frac{x}{\\sqrt{t}}$, any feature of a similarity solution moves like the square root of time. So to go twice as far by diffusion takes four times as long. For example, a feature at $x = 3$ when $t = 5$ is at $x = 3 \\cdot 2 = 6$ when $t = 20$, four times later.\n\nCheck: $\\frac{x^{2}}{t}$ stays the same, $\\frac{9}{5} = \\frac{36}{20}$.\n\n> **Watch out.** The position grows with the square root of the time factor; it does not grow in proportion to time.",
        "因为解依赖于 $\\frac{x}{\\sqrt{t}}$，相似解的任何特征都按时间的平方根移动。所以靠扩散走两倍远需要四倍的时间。例如，$t = 5$ 时位于 $x = 3$ 的特征，在四倍时间 $t = 20$ 时位于 $x = 3 \\cdot 2 = 6$。\n\n检验：$\\frac{x^{2}}{t}$ 不变，$\\frac{9}{5} = \\frac{36}{20}$。\n\n> **注意。** 位置按时间倍数的平方根增长，而不是与时间成正比。",
      ],
      (rng) =>
        until(() => {
          const x = rng.int(2, 15);
          const k = rng.int(2, 9);
          const t = rng.int(2, 30);
          const answer = x * k;
          const misses: Miss[] = [
            [
              x * k * k,
              "That moves the feature in proportion to time; it moves like the square root.",
              "那让特征与时间成正比移动；它按平方根移动。",
            ],
            [x + k, "That adds the factor; positions scale by multiplication.", "那加上了倍数；位置按乘法缩放。"],
            [x, "That keeps the feature in place; it spreads with time.", "那让特征不动；它随时间扩散。"],
          ];
          return worked(
            [
              `A similarity solution has some feature at $x = ${x}$ when $t = ${t}$. Where is that feature when $t = ${t * k * k}$?`,
              `相似解的某个特征在 $t = ${t}$ 时位于 $x = ${x}$。当 $t = ${t * k * k}$ 时这个特征在哪里？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the time factor", "求时间倍数"],
                [
                  `$\\frac{${t * k * k}}{${t}} = ${k * k} = ${k}^{2}$, so the position grows by $\\sqrt{${k * k}} = ${k}$.`,
                  `$\\frac{${t * k * k}}{${t}} = ${k * k} = ${k}^{2}$，所以位置增大 $\\sqrt{${k * k}} = ${k}$ 倍。`,
                ],
              ],
              [
                ["Scale the position", "缩放位置"],
                [`$x = ${x} \\cdot ${k} = ${answer}$.`, `$x = ${x} \\cdot ${k} = ${answer}$。`],
              ],
            ],
            [
              `$\\frac{x^{2}}{t}$ stays the same: $${settle(x * x, t, Q.of(x * x, t))}$ and $\\frac{${answer * answer}}{${t * k * k}} = ${Q.of(x * x, t).toLatex()}$.`,
              `$\\frac{x^{2}}{t}$ 不变：$${settle(x * x, t, Q.of(x * x, t))}$，而 $\\frac{${answer * answer}}{${t * k * k}} = ${Q.of(x * x, t).toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

const schrodinger = topic(
  "the-schrodinger-equation",
  ["The Schrödinger Equation", "薛定谔方程"],
  ["Solve the free equation by separation, and read energies and group speeds.", "用分离变量解自由方程，并读出能量和群速度。"],
  ["dispersion-relations"],
  [],
  [
    point(
      "energies-in-a-box",
      ["Energies in a box", "盒中的能量"],
      [
        "Separating $iu_t = -u_{xx}$ on an interval with fixed ends gives modes $\\sin\\frac{n\\pi x}{L}$ with the energy $E_n = \\left(\\frac{n\\pi}{L}\\right)^{2}$. So the energy levels grow like the square of $n$. For example, on $[0, 2]$ the mode $n = 3$ has $E_3 = \\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9}{4}\\pi^{2}$.\n\nCheck: the lowest energy on $[0, 2]$ is $E_1 = \\frac{1}{4}\\pi^{2}$, and $E_3 = 3^{2} \\cdot E_1 = \\frac{9}{4}\\pi^{2}$.\n\n> **Watch out.** Square the whole wave number $\\frac{n\\pi}{L}$, the length included; this equation has no factor $\\frac{1}{2}$.",
        "在两端固定的区间上分离 $iu_t = -u_{xx}$，得到模式 $\\sin\\frac{n\\pi x}{L}$，能量为 $E_n = \\left(\\frac{n\\pi}{L}\\right)^{2}$。所以能级按 $n$ 的平方增长。例如，在 $[0, 2]$ 上模式 $n = 3$ 有 $E_3 = \\left(\\frac{3\\pi}{2}\\right)^{2} = \\frac{9}{4}\\pi^{2}$。\n\n检验：$[0, 2]$ 上最低能量是 $E_1 = \\frac{1}{4}\\pi^{2}$，而 $E_3 = 3^{2} \\cdot E_1 = \\frac{9}{4}\\pi^{2}$。\n\n> **注意。** 要把整个波数 $\\frac{n\\pi}{L}$ 平方，包括长度；这个方程没有因子 $\\frac{1}{2}$。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(2, 12);
          const n = rng.int(2, 12);
          const answer = Q.of(n * n, big * big);
          const ground = Q.of(1, big * big);
          const times = (q: Q): string => (q.eq(Q.one) ? "\\pi^{2}" : `${q.toLatex()}\\pi^{2}`);
          const misses: Miss[] = [
            [Q.of(n, big), "That forgets to square the wave number.", "那忘了把波数平方。"],
            [Q.of(n * n, big), "That squares $n$ but not the length.", "那只平方了 $n$，没有平方长度。"],
            [
              Q.of(n * n, 2 * big * big),
              "That puts in a factor $\\frac{1}{2}$; this equation has none.",
              "那加了因子 $\\frac{1}{2}$；这个方程没有它。",
            ],
          ];
          return worked(
            [
              `For $iu_t = -u_{xx}$ on $[0, ${big}]$ with fixed ends, the energy of mode ${n} is $m\\pi^{2}$. What is $m$?`,
              `对 $[0, ${big}]$ 上两端固定的 $iu_t = -u_{xx}$，模式 ${n} 的能量是 $m\\pi^{2}$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the wave number", "求波数"],
                [`$\\frac{n\\pi}{L} = ${piOver(n, big)}$.`, `$\\frac{n\\pi}{L} = ${piOver(n, big)}$。`],
              ],
              [
                ["Square it", "平方"],
                [
                  `$E_{${n}} = \\left(${piOver(n, big)}\\right)^{2} = ${times(answer)}$, so $m = ${answer.toLatex()}$.`,
                  `$E_{${n}} = \\left(${piOver(n, big)}\\right)^{2} = ${times(answer)}$，所以 $m = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The lowest energy on $[0, ${big}]$ is $E_1 = ${times(ground)}$, and $E_{${n}} = ${n}^{2} \\cdot E_1 = ${times(answer)}$.`,
              `$[0, ${big}]$ 上最低能量是 $E_1 = ${times(ground)}$，而 $E_{${n}} = ${n}^{2} \\cdot E_1 = ${times(answer)}$。`,
            ],
          );
        }),
    ),
    point(
      "the-probability-stays-still",
      ["The probability stays still", "概率保持不变"],
      [
        "A single mode changes in time only by the phase $e^{-iEt}$, whose size is 1. So its probability density $|u|^{2}$ does not change at all, which is why such a state is called stationary. For example, $u(x_0, t) = 3e^{-5it}$ has $|u(x_0, t)|^{2} = 3^{2} = 9$ at every time.\n\nCheck: $|e^{-5it}|^{2} = \\cos^{2}(5t) + \\sin^{2}(5t) = 1$.\n\n> **Watch out.** Square the size of the amplitude; the phase contributes a factor of size $1$, not $0$ and not $t$.",
        "单一模式随时间只变化相位 $e^{-iEt}$，它的模是 1。所以它的概率密度 $|u|^{2}$ 完全不变，这就是这种状态被称为定态的原因。例如，$u(x_0, t) = 3e^{-5it}$ 在任何时刻都有 $|u(x_0, t)|^{2} = 3^{2} = 9$。\n\n检验：$|e^{-5it}|^{2} = \\cos^{2}(5t) + \\sin^{2}(5t) = 1$。\n\n> **注意。** 要平方振幅的大小；相位贡献大小为 $1$ 的因子，不是 $0$，也不是 $t$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 15);
          const t = rng.int(2, 30);
          const e = rng.int(2, 30);
          const answer = a * a;
          const misses: Miss[] = [
            [a, "That forgets to square the size.", "那忘了把大小平方。"],
            [a * a * t, "That multiplies by the time; the phase has size $1$ at every time.", "那乘了时间；相位在任何时刻大小都是 $1$。"],
            [0, "The phase has size $1$, not $0$.", "相位的大小是 $1$，不是 $0$。"],
          ];
          return worked(
            [
              `A stationary state has $u(x_0, t) = ${a}e^{-${e}it}$ at a point $x_0$. What is $|u(x_0, ${t})|^{2}$?`,
              `定态在点 $x_0$ 处有 $u(x_0, t) = ${a}e^{-${e}it}$。$|u(x_0, ${t})|^{2}$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Take the size of the phase", "求相位的大小"],
                [`$|e^{-${e * t}i}| = 1$ at $t = ${t}$.`, `在 $t = ${t}$ 时 $|e^{-${e * t}i}| = 1$。`],
              ],
              [
                ["Square the amplitude", "振幅平方"],
                [`$|u|^{2} = ${a}^{2} \\cdot 1 = ${answer}$.`, `$|u|^{2} = ${a}^{2} \\cdot 1 = ${answer}$。`],
              ],
            ],
            [
              `$|e^{-${e}it}|^{2} = \\cos^{2}(${e}t) + \\sin^{2}(${e}t) = 1$, so the density is $${answer}$ at every time, not only at $t = ${t}$.`,
              `$|e^{-${e}it}|^{2} = \\cos^{2}(${e}t) + \\sin^{2}(${e}t) = 1$，所以密度在任何时刻都是 $${answer}$，不只在 $t = ${t}$。`,
            ],
          );
        }),
    ),
    point(
      "group-speed-of-a-wave-packet",
      ["Group speed of a wave packet", "波包的群速度"],
      [
        "A plane wave $e^{i(kx - \\omega t)}$ solves $iu_t = -u_{xx}$ when $\\omega = k^{2}$. A packet moves at the group speed $\\frac{d\\omega}{dk} = 2k$, which is twice the speed of its individual crests. For example, at $k = 3$ the frequency is $\\omega = 9$, the crests move at $\\frac{9}{3} = 3$, and a packet moves at $2 \\cdot 3 = 6$.\n\nCheck: $6 = 2 \\cdot 3$, the packet outruns its crests by the factor $2$.\n\n> **Watch out.** The crests move at $\\frac{\\omega}{k}$ and the packet at $\\frac{d\\omega}{dk}$; neither is the frequency $\\omega = k^{2}$ itself.",
        "平面波 $e^{i(kx - \\omega t)}$ 在 $\\omega = k^{2}$ 时解 $iu_t = -u_{xx}$。波包以群速度 $\\frac{d\\omega}{dk} = 2k$ 运动，是单个波峰速度的两倍。例如，$k = 3$ 时频率 $\\omega = 9$，波峰以 $\\frac{9}{3} = 3$ 运动，波包以 $2 \\cdot 3 = 6$ 运动。\n\n检验：$6 = 2 \\cdot 3$，波包比波峰快一倍。\n\n> **注意。** 波峰以 $\\frac{\\omega}{k}$ 运动，波包以 $\\frac{d\\omega}{dk}$ 运动；两者都不是频率 $\\omega = k^{2}$ 本身。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(3, 30);
          const phase = rng.bool();
          const answer = phase ? k : 2 * k;
          const misses: Miss[] = [
            [
              phase ? 2 * k : k,
              phase
                ? "That is the group speed of a packet; the crests move at $\\frac{\\omega}{k}$."
                : "That is the phase speed of the crests; a packet moves at $\\frac{d\\omega}{dk}$.",
              phase ? "那是波包的群速度；波峰以 $\\frac{\\omega}{k}$ 运动。" : "那是波峰的相速度；波包以 $\\frac{d\\omega}{dk}$ 运动。",
            ],
            [k * k, "That is the frequency $\\omega$, not a speed.", "那是频率 $\\omega$，不是速度。"],
          ];
          return worked(
            [
              `For $iu_t = -u_{xx}$ and wave number $k = ${k}$, what is the ${phase ? "phase speed of the crests" : "group speed of a packet"}?`,
              `对 $iu_t = -u_{xx}$ 和波数 $k = ${k}$，${phase ? "波峰的相速度" : "波包的群速度"}是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the frequency", "求频率"],
                [`$\\omega = k^{2} = ${k * k}$.`, `$\\omega = k^{2} = ${k * k}$。`],
              ],
              phase
                ? [
                    ["Divide by the wave number", "除以波数"],
                    [
                      `The phase speed is $\\frac{\\omega}{k} = \\frac{${k * k}}{${k}} = ${k}$.`,
                      `相速度是 $\\frac{\\omega}{k} = \\frac{${k * k}}{${k}} = ${k}$。`,
                    ],
                  ]
                : [
                    ["Differentiate", "求导"],
                    [`The group speed is $\\frac{d\\omega}{dk} = 2k = ${2 * k}$.`, `群速度是 $\\frac{d\\omega}{dk} = 2k = ${2 * k}$。`],
                  ],
            ],
            phase
              ? [
                  `A crest keeps $${k}x - ${k * k}t$ fixed, so $x$ grows by ${k} per unit time; the packet moves at twice that, ${2 * k}.`,
                  `波峰保持 $${k}x - ${k * k}t$ 不变，所以 $x$ 每单位时间增加 ${k}；波包以其两倍 ${2 * k} 运动。`,
                ]
              : [
                  `The group speed ${2 * k} is twice the phase speed $\\frac{${k * k}}{${k}} = ${k}$, as for every wave with $\\omega = k^{2}$.`,
                  `群速度 ${2 * k} 是相速度 $\\frac{${k * k}}{${k}} = ${k}$ 的两倍，对每个 $\\omega = k^{2}$ 的波都如此。`,
                ],
          );
        }),
    ),
  ],
);

export const partialDifferentialEquationsExtraTopics: readonly TopicDef[] = [
  lesson(
    conservationLaws,
    [
      "A road section holds $100$ cars, with $12$ entering and $8$ leaving each minute: the law $u_t + q_x = 0$ says the total changes only through the ends, so after $5$ minutes there are $120$.",
      "一段路上有 $100$ 辆车，每分钟进入 $12$ 辆、离开 $8$ 辆：守恒律 $u_t + q_x = 0$ 说明总量只通过两端变化，所以 $5$ 分钟后有 $120$ 辆。",
    ],
    [
      "$60$ cars enter and $40$ leave in the $5$ minutes, and $100 + 60 - 40 = 120$.",
      "这 $5$ 分钟内进入 $60$ 辆、离开 $40$ 辆，而 $100 + 60 - 40 = 120$。",
    ],
    [
      "track the total through the flux at the ends, find the speed of a small wave from the derivative of the flux, and find the speed of a shock from the jump condition",
      "通过两端的通量跟踪总量，由通量的导数求小波的速度，并由跃变条件求激波的速度",
    ],
  ),
  lesson(
    burgers,
    [
      "In Burgers' equation the data $u(x, 0) = 5 - 2x$ sends faster characteristics from the left into slower ones on the right, and at $t = \\frac{1}{2}$ they all meet.",
      "在伯格斯方程中，数据 $u(x, 0) = 5 - 2x$ 让左边较快的特征线追上右边较慢的特征线，在 $t = \\frac{1}{2}$ 时它们全部相遇。",
    ],
    [
      "the line from $x_0$ is $x = x_0 + (5 - 2x_0)t$, which equals $\\frac{5}{2}$ at $t = \\frac{1}{2}$ whatever $x_0$ is.",
      "从 $x_0$ 出发的线是 $x = x_0 + (5 - 2x_0)t$，在 $t = \\frac{1}{2}$ 时无论 $x_0$ 是多少都等于 $\\frac{5}{2}$。",
    ],
    [
      "find when a smooth solution breaks, tell a shock from a rarefaction by comparing the two sides of a jump, and read a value inside a rarefaction fan",
      "求光滑解何时破裂，通过比较跳跃两侧区分激波和稀疏波，并读出稀疏扇形内的值",
    ],
  ),
  lesson(
    sturmLiouville,
    [
      "A string fixed at $x = 0$ and free at $x = 2$ vibrates in quarter waves: its lowest mode is $\\sin\\frac{\\pi x}{4}$, with eigenvalue $\\frac{\\pi^{2}}{16}$.",
      "在 $x = 0$ 固定、在 $x = 2$ 自由的弦以四分之一波振动：它的最低模式是 $\\sin\\frac{\\pi x}{4}$，特征值是 $\\frac{\\pi^{2}}{16}$。",
    ],
    [
      "the slope $\\frac{\\pi}{4}\\cos\\frac{\\pi x}{4}$ vanishes at $x = 2$, since $\\cos\\frac{\\pi}{2} = 0$, so the free end is satisfied.",
      "斜率 $\\frac{\\pi}{4}\\cos\\frac{\\pi x}{4}$ 在 $x = 2$ 处为零，因为 $\\cos\\frac{\\pi}{2} = 0$，所以自由端条件成立。",
    ],
    [
      "find eigenvalues for fixed and mixed ends, bound the lowest one with a Rayleigh quotient, and find a series coefficient with a weight",
      "求固定端和混合端的特征值，用瑞利商估计最低特征值的上界，并求带权的级数系数",
    ],
  ),
  lesson(
    eigenvalues2d,
    [
      "A rectangular plate of sides $2$ and $4$ vibrating in the mode $(1, 2)$ has the eigenvalue $\\pi^{2}\\left(\\frac{1}{4} + \\frac{4}{16}\\right) = \\frac{\\pi^{2}}{2}$, the sum of one eigenvalue for each direction.",
      "边长为 $2$ 和 $4$ 的矩形板以模式 $(1, 2)$ 振动，特征值是 $\\pi^{2}\\left(\\frac{1}{4} + \\frac{4}{16}\\right) = \\frac{\\pi^{2}}{2}$，即每个方向一个特征值之和。",
    ],
    [
      "both factors $\\sin\\frac{\\pi x}{2}$ and $\\sin\\frac{2\\pi y}{4}$ have the wave number $\\frac{\\pi}{2}$, and $\\frac{\\pi^{2}}{4} + \\frac{\\pi^{2}}{4} = \\frac{\\pi^{2}}{2}$.",
      "两个因子 $\\sin\\frac{\\pi x}{2}$ 和 $\\sin\\frac{2\\pi y}{4}$ 的波数都是 $\\frac{\\pi}{2}$，而 $\\frac{\\pi^{2}}{4} + \\frac{\\pi^{2}}{4} = \\frac{\\pi^{2}}{2}$。",
    ],
    [
      "find the eigenvalue of a mode on a rectangle, count the modes of a square that share a frequency, and find how fast a mode decays under heat flow",
      "求矩形上一个模式的特征值，数出正方形上共享频率的模式，并求模式在热流下衰减的快慢",
    ],
  ),
  lesson(
    fourierHeat,
    [
      "Transforming $u_t = 3u_{xx}$ in $x$ turns it into $\\hat{u}_t = -3k^{2}\\hat{u}$, one ordinary equation for each frequency: the frequency $k = 2$ simply decays like $e^{-12t}$.",
      "对 $u_t = 3u_{xx}$ 关于 $x$ 作变换，得到 $\\hat{u}_t = -3k^{2}\\hat{u}$，每个频率一个常微分方程：频率 $k = 2$ 简单地按 $e^{-12t}$ 衰减。",
    ],
    [
      "$\\partial_x^{2} e^{2ix} = (2i)^{2} e^{2ix} = -4e^{2ix}$, and $3 \\cdot (-4) = -12$.",
      "$\\partial_x^{2} e^{2ix} = (2i)^{2} e^{2ix} = -4e^{2ix}$，而 $3 \\cdot (-4) = -12$。",
    ],
    [
      "turn derivatives into multiplication by $ik$, find how much a frequency has decayed, and find the variance of a spreading Gaussian",
      "把导数变成乘 $ik$，求一个频率衰减了多少，并求扩散中的高斯分布的方差",
    ],
  ),
  lesson(
    laplacePde,
    [
      "A rod with zero initial temperature has its end held at $6$; the Laplace transform in time turns the heat equation into $\\alpha U'' = sU$, with $U(0, s) = \\frac{6}{s}$.",
      "初始温度为零的杆一端保持在 $6$；对时间作拉普拉斯变换，热方程变成 $\\alpha U'' = sU$，且 $U(0, s) = \\frac{6}{s}$。",
    ],
    [
      "$\\int_0^{\\infty} 6e^{-st} \\, dt = \\frac{6}{s}$, which is the transform of the constant boundary value.",
      "$\\int_0^{\\infty} 6e^{-st} \\, dt = \\frac{6}{s}$，正是常数边界值的变换。",
    ],
    [
      "transform the time derivative, find the rate of decay in space of the bounded solution, and match a constant boundary value",
      "变换时间导数，求有界解在空间中的衰减率，并匹配常数边界值",
    ],
  ),
  lesson(
    duhamel,
    [
      "A mode that decays at the rate $3$ and is fed a steady source $12$ climbs from $0$ toward $4$, along $4(1 - e^{-3t})$: Duhamel's principle adds up the response to each instant of the source.",
      "以速率 $3$ 衰减、受到稳定源 $12$ 输入的模式从 $0$ 上升到 $4$，沿 $4(1 - e^{-3t})$：杜阿梅尔原理把源的每一时刻的响应加起来。",
    ],
    ["at balance $3b = 12$, so $b = 4$, the value the formula approaches.", "平衡时 $3b = 12$，所以 $b = 4$，正是公式趋近的值。"],
    [
      "find the steady value of a forced mode, add up a source that changes with time, and follow a short pulse as it decays",
      "求受迫模式的稳定值，把随时间变化的源加起来，并跟踪短脉冲的衰减",
    ],
  ),
  lesson(
    energy,
    [
      "For $u_t = 3u_{xx}$ on a rod with fixed ends, the energy $\\int u^{2} \\, dx$ changes at the rate $-6\\int u_x^{2} \\, dx$, which is never positive: watching this one number proves decay and uniqueness.",
      "对两端固定的杆上的 $u_t = 3u_{xx}$，能量 $\\int u^{2} \\, dx$ 的变化率是 $-6\\int u_x^{2} \\, dx$，它永不为正：只看这一个数就能证明衰减和唯一性。",
    ],
    [
      "$\\frac{d}{dt}\\int u^{2} \\, dx = 2\\int u \\cdot 3u_{xx} \\, dx$, and integrating by parts with $u = 0$ at the ends gives $-6\\int u_x^{2} \\, dx$.",
      "$\\frac{d}{dt}\\int u^{2} \\, dx = 2\\int u \\cdot 3u_{xx} \\, dx$，在端点 $u = 0$ 的条件下分部积分得 $-6\\int u_x^{2} \\, dx$。",
    ],
    [
      "find the rate at which the heat energy falls, compute the energy of a single mode, and use energy to show that a solution is unique",
      "求热能量下降的速率，计算单一模式的能量，并用能量证明解是唯一的",
    ],
  ),
  lesson(
    greens1d,
    [
      "A unit load at $\\xi = 3$ on a string over $[0, 4]$ with fixed ends bends it into a tent of height $\\frac{3}{4}$; the solution for any load is a sum of such tents.",
      "在 $[0, 4]$ 上两端固定的弦，$\\xi = 3$ 处的单位载荷把它压成高 $\\frac{3}{4}$ 的帐篷形；任何载荷下的解都是这种帐篷形之和。",
    ],
    [
      "the tent $G(x, 3) = \\frac{x(4 - 3)}{4}$ for $x \\le 3$ reaches $\\frac{3}{4}$ at $x = 3$, and $\\frac{3(4 - x)}{4}$ falls to $0$ at $x = 4$.",
      "帐篷形 $G(x, 3) = \\frac{x(4 - 3)}{4}$（$x \\le 3$）在 $x = 3$ 处达到 $\\frac{3}{4}$，而 $\\frac{3(4 - x)}{4}$ 在 $x = 4$ 处降到 $0$。",
    ],
    [
      "evaluate the Green's function of an interval, add the responses to point loads, and integrate against the kernel for a constant source",
      "计算区间上的格林函数，把点载荷的响应相加，并对常数源积分核",
    ],
  ),
  lesson(
    images,
    [
      "A source at $x = 5$ in front of a wall at $x = 2$ behaves as if a mirror source sat at $x = -1$: the pair meets the boundary condition at the wall by itself.",
      "壁在 $x = 2$，壁前 $x = 5$ 处的源表现得好像在 $x = -1$ 处有一个镜像源：这对源自动在壁上满足边界条件。",
    ],
    ["the wall is the midpoint of the pair, $\\frac{5 + (-1)}{2} = 2$.", "壁是这对源的中点，$\\frac{5 + (-1)}{2} = 2$。"],
    [
      "place the image across a wall, choose an odd or even reflection for the end condition, and follow a wave as it reflects from a fixed end",
      "关于壁放置镜像，根据端点条件选择奇反射或偶反射，并跟踪波在固定端的反射",
    ],
  ),
  lesson(
    forcedWave,
    [
      "Pushing a whole string with the uniform force $6$ in $u_{tt} = 4u_{xx} + 6$ simply accelerates it: from rest, $u = 3t^{2}$, as for a falling body.",
      "在 $u_{tt} = 4u_{xx} + 6$ 中用均匀力 $6$ 推整根弦，只是让它加速：从静止开始，$u = 3t^{2}$，就像落体一样。",
    ],
    [
      "$u = 3t^{2}$ has $u_{tt} = 6$ and $u_{xx} = 0$, so $6 = 4 \\cdot 0 + 6$.",
      "$u = 3t^{2}$ 满足 $u_{tt} = 6$，$u_{xx} = 0$，所以 $6 = 4 \\cdot 0 + 6$。",
    ],
    [
      "solve for a uniform force, find the natural frequencies of a string, and find how the amplitude grows at resonance",
      "求均匀力下的解，求弦的固有频率，并求共振时振幅如何增长",
    ],
  ),
  lesson(
    wave3d,
    [
      "A firework bursts $340$ metres away and its bang arrives about one second later, then stops: in space a sound wave spreads on a sphere, its amplitude falling like $\\frac{1}{r}$, and it passes cleanly.",
      "烟花在 $340$ 米外爆炸，大约一秒后响声传来，然后停止：在空间中声波在球面上传播，振幅按 $\\frac{1}{r}$ 下降，并干净地通过。",
    ],
    [
      "$u = \\frac{F(r - ct)}{r}$ has $ru = F(r - ct)$, a one-dimensional wave moving outward at speed $c$.",
      "$u = \\frac{F(r - ct)}{r}$ 满足 $ru = F(r - ct)$，这是以速度 $c$ 向外传播的一维波。",
    ],
    [
      "find the amplitude of a spherical wave at a new radius, find when a signal from a ball is first and last heard, and compare sharp signals in three and two dimensions",
      "求球面波在新半径处的振幅，求从球内发出的信号第一次和最后一次被听到的时间，并比较三维和二维中的清晰信号",
    ],
  ),
  lesson(
    bessel,
    [
      "A kettledrum is a round membrane fixed at its rim, and its pitches come from the zeros of Bessel functions rather than from whole numbers as on a string.",
      "定音鼓是边缘固定的圆形膜，它的音高来自贝塞尔函数的零点，而不像弦那样来自整数。",
    ],
    [
      "the first zero of $J_0$ is about $2.4$, so a drum of radius $1$ and speed $1$ has the lowest frequency about $2.4$.",
      "$J_0$ 的第一个零点约为 $2.4$，所以半径为 $1$、速度为 $1$ 的鼓最低频率约为 $2.4$。",
    ],
    [
      "find a drum frequency from a Bessel zero, rescale the frequencies for a new radius, and approximate $J_0$ by its series",
      "由贝塞尔零点求鼓的频率，对新半径重新缩放频率，并用级数近似 $J_0$",
    ],
  ),
  lesson(
    legendre,
    [
      "The temperature inside a ball whose surface is held at a pattern symmetric about the axis is built from Legendre polynomials in $\\cos\\phi$, each multiplied by a power of $r$.",
      "球面上保持关于轴对称的温度分布时，球内的温度由关于 $\\cos\\phi$ 的勒让德多项式构成，每个乘以 $r$ 的一个幂。",
    ],
    [
      "$P_2(1) = \\frac{3 - 1}{2} = 1$, as every Legendre polynomial equals $1$ at $x = 1$.",
      "$P_2(1) = \\frac{3 - 1}{2} = 1$，因为每个勒让德多项式在 $x = 1$ 处都等于 $1$。",
    ],
    [
      "evaluate a Legendre polynomial, use orthogonality to find an integral, and evaluate a solution in the ball on the axis",
      "计算勒让德多项式，用正交性求积分，并计算球内的解在轴线上的值",
    ],
  ),
  lesson(
    wedge,
    [
      "Near the corner of a room or the edge of a pipe, the shape of the region decides which harmonic functions fit: powers of $r$ on a wedge, negative powers outside a disc, and $\\ln r$ between two circles.",
      "在房间的角落或管道的边缘附近，区域的形状决定哪些调和函数适用：楔形上用 $r$ 的幂，圆盘外用负幂，两个圆之间用 $\\ln r$。",
    ],
    [
      "on the quarter plane $\\beta = \\frac{\\pi}{2}$, $r^{2}\\sin(2\\theta) = 2xy$ is harmonic and vanishes on both axes.",
      "在四分之一平面 $\\beta = \\frac{\\pi}{2}$ 上，$r^{2}\\sin(2\\theta) = 2xy$ 是调和的，并在两条坐标轴上为零。",
    ],
    [
      "find the power allowed on a wedge, evaluate a bounded solution outside a disc, and interpolate a radial solution on an annulus",
      "求楔形上允许的幂，计算圆盘外的有界解，并对圆环上的径向解插值",
    ],
  ),
  lesson(
    harmonicMax,
    [
      "A metal plate held at fixed temperatures around its edge settles to a harmonic temperature, and no spot inside is ever hotter than the hottest point of the edge.",
      "边缘保持固定温度的金属板最终达到调和的温度分布，内部任何一点都不会比边缘最热的点更热。",
    ],
    [
      "$u = x^{2} - y^{2}$ has $\\Delta u = 2 - 2 = 0$, and on the disc of radius $1$ it reaches $1$ at $(1, 0)$ but only $0$ at the center.",
      "$u = x^{2} - y^{2}$ 满足 $\\Delta u = 2 - 2 = 0$，在半径为 $1$ 的圆盘上它在 $(1, 0)$ 处达到 $1$，而中心只有 $0$。",
    ],
    [
      "find the average of a harmonic function on a sphere, find its maximum on a disc from the boundary, and balance the fluxes of a Neumann problem",
      "求调和函数在球面上的平均，从边界求它在圆盘上的最大值，并平衡诺伊曼问题的通量",
    ],
  ),
  lesson(
    fdLaplace,
    [
      "To find the steady temperature of a plate by computer, lay a grid over it and make each inner value the average of its four neighbors.",
      "用计算机求板的稳态温度时，在板上铺一张网格，让每个内部值等于它四个相邻值的平均。",
    ],
    [
      "neighbors $2$, $4$, $6$, $8$ give the average $\\frac{20}{4} = 5$, and $20 - 4 \\cdot 5 = 0$.",
      "相邻值 $2$、$4$、$6$、$8$ 给出平均 $\\frac{20}{4} = 5$，而 $20 - 4 \\cdot 5 = 0$。",
    ],
    [
      "apply the five point rule, carry out one Jacobi sweep, and solve a two point grid exactly",
      "应用五点格式，完成一次雅可比迭代，并精确求解两点网格",
    ],
  ),
  lesson(
    stability,
    [
      "A simulation that takes too long a time step can explode into huge, wildly alternating numbers, even though the equation itself is perfectly calm.",
      "时间步长太大的模拟会爆炸成巨大且剧烈交替的数，尽管方程本身完全平稳。",
    ],
    [
      "$u_t = u_{xx}$ with $\\Delta x = \\frac{1}{2}$ allows $\\Delta t = \\frac{1}{8}$, since $1 \\cdot \\frac{1}{8} \\cdot 4 = \\frac{1}{2}$.",
      "$u_t = u_{xx}$、$\\Delta x = \\frac{1}{2}$ 时允许 $\\Delta t = \\frac{1}{8}$，因为 $1 \\cdot \\frac{1}{8} \\cdot 4 = \\frac{1}{2}$。",
    ],
    [
      "find the largest stable heat step, apply the CFL condition to the wave scheme, and compute the amplification factor of the highest frequency",
      "求热方程最大的稳定步长，对波动格式应用 CFL 条件，并计算最高频率的放大因子",
    ],
  ),
  lesson(
    similarity,
    [
      "A turkey twice as wide takes about four times as long to warm through, because heat spreads a distance that grows only like the square root of time.",
      "宽两倍的火鸡大约需要四倍的时间才能热透，因为热传播的距离只按时间的平方根增长。",
    ],
    [
      "$\\eta = \\frac{x}{\\sqrt{4t}}$ for $u_t = u_{xx}$ takes the same value $1$ at $(2, 1)$ and at $(4, 4)$.",
      "对 $u_t = u_{xx}$，$\\eta = \\frac{x}{\\sqrt{4t}}$ 在 $(2, 1)$ 和 $(4, 4)$ 处取同一个值 $1$。",
    ],
    [
      "rescale the time a heat solution takes, compute the similarity variable, and find how far a diffusing feature has moved",
      "缩放热方程解所需的时间，计算相似变量，并求扩散特征移动了多远",
    ],
  ),
  lesson(
    schrodinger,
    [
      "An electron trapped in a thin wire can only take certain energies, and in the free Schrödinger equation $iu_t = -u_{xx}$ these come from the sine modes of the wire.",
      "困在细导线中的电子只能取某些能量，在自由薛定谔方程 $iu_t = -u_{xx}$ 中，这些能量来自导线的正弦模式。",
    ],
    [
      "$u = e^{i(2x - 4t)}$ has $iu_t = 4u$ and $-u_{xx} = 4u$, so $\\omega = 4 = 2^{2}$.",
      "$u = e^{i(2x - 4t)}$ 满足 $iu_t = 4u$，$-u_{xx} = 4u$，所以 $\\omega = 4 = 2^{2}$。",
    ],
    [
      "find the energies of the modes in a box, see why the probability of a single mode stays still, and find phase and group speeds",
      "求盒中各模式的能量，理解单一模式的概率为何不变，并求相速度和群速度",
    ],
  ),
];
