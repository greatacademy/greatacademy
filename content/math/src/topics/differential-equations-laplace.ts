import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { numberProblem, verdictChoice, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** signed writes a number as a signed term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** co writes an integer coefficient before a symbol: "" for 1 and "-" for -1. */
const co = (n: number): string => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

/** sco writes an integer coefficient before a symbol as a signed term: "+", "-", "+ 3" or "- 3". */
const sco = (n: number): string => (n === 1 ? "+" : n === -1 ? "-" : signed(n));

/** inP wraps a negative integer in parentheses for use as a factor or after a minus sign. */
const inP = (n: number): string => (n < 0 ? `(${n})` : `${n}`);

/** Mistake is a wrong value with what to say about it. */
type Mistake = { readonly value: number | Q; readonly why: Text };

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly Mistake[]): Mistake[] => {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  return mistakes.filter((m, i, all) => !q(m.value).eq(q(answer)) && all.findIndex((x) => q(x.value).eq(q(m.value))) === i);
};

/** fr writes " = reduced" after \frac{n}{d} when the fraction reduces, and nothing otherwise. */
const fr = (n: number, d: number): string => {
  const q = Q.of(n, d);
  return q.toLatex() === `\\frac{${n}}{${d}}` ? "" : ` = ${q.toLatex()}`;
};

/** parQ wraps a negative rational number in parentheses. */
const parQ = (v: Q): string => (v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex());

/** Topics for Unit 5: Laplace Transforms in Differential Equations. */
export const differentialEquationsLaplaceTopics: TopicDef[] = [
  // 5.18.2 The Unit Step Function
  {
    id: "the-unit-step-function",
    title: t("The Unit Step Function", "单位阶跃函数"),
    summary: t(
      "The Heaviside unit step function u(t - c) equals 0 for t < c and 1 for t >= c, switching signals on at t = c.",
      "赫维赛德单位阶跃函数 u(t - c) 在 t < c 时取 0，在 t >= c 时取 1，用于在时刻 t = c 开启信号。",
    ),
    intro: t(
      "Take $f(t) = 3u(t - 1) + 5u(t - 4)$. At $t = 2$ only the first step has switched on, so $f(2) = 3 \\cdot 1 + 5 \\cdot 0 = 3$; at $t = 6$ both have, so $f(6) = 3 + 5 = 8$.\n\nCheck: just before $t = 4$ the value is $3$ and from $t = 4$ on it is $8$, a jump of $5$, which is the coefficient of $u(t - 4)$.\n\nIn this lesson we evaluate sums of unit steps and write piecewise functions with them.",
      "取 $f(t) = 3u(t - 1) + 5u(t - 4)$。在 $t = 2$ 时只有第一个阶跃接通，所以 $f(2) = 3 \\cdot 1 + 5 \\cdot 0 = 3$；在 $t = 6$ 时两个都接通，所以 $f(6) = 3 + 5 = 8$。\n\n检验：在 $t = 4$ 之前函数值为 $3$，从 $t = 4$ 起为 $8$，跳跃 $5$，正是 $u(t - 4)$ 的系数。\n\n本课我们计算单位阶跃之和的值，并用单位阶跃表示分段函数。",
    ),
    prerequisites: ["the-floor-and-ceiling-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-unit-step-functions",
        title: t("Evaluating linear combinations of unit step functions", "计算单位阶跃函数的线性组合"),
        explanation: t(
          "The unit step function is defined as $u(t - c) = 0$ for $t < c$ and $u(t - c) = 1$ for $t \\ge c$. For $f(t) = a u(t - c_1) + b u(t - c_2)$ with $c_1 < c_2 < t_0$, both step functions are active, so $f(t_0) = a + b$.\n\n> **Watch out.** A step that is on has the value $1$, not $t - c$. For $f(t) = 4u(t - 2)$, $f(5) = 4 \\cdot 1 = 4$, not $4 \\cdot 3 = 12$.",
          "单位阶跃函数定义为：当 $t < c$ 时 $u(t - c) = 0$；当 $t \\ge c$ 时 $u(t - c) = 1$。对于 $f(t) = a u(t - c_1) + b u(t - c_2)$（其中 $c_1 < c_2 < t_0$），在 $t_0$ 处两个阶跃函数均已开启，故 $f(t_0) = a + b$。\n\n> **注意。** 接通的阶跃取值为 $1$，不是 $t - c$。对 $f(t) = 4u(t - 2)$，$f(5) = 4 \\cdot 1 = 4$，不是 $4 \\cdot 3 = 12$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 35);
          const b = rng.int(2, 35);
          const c1 = rng.int(1, 5);
          const c2 = c1 + rng.int(2, 6);
          const t0 = c2 + rng.int(1, 4);
          const ans = a + b;
          return numberProblem({
            prompt: t(
              `Given the signal $f(t) = ${a} u(t - ${c1}) + ${b} u(t - ${c2})$, where $u(t)$ is the unit step function, evaluate $f(${t0})$.`,
              `设信号 $f(t) = ${a} u(t - ${c1}) + ${b} u(t - ${c2})$，其中 $u(t)$ 为单位阶跃函数。求 $f(${t0})$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                a,
                `That keeps only the first step; the second switches on at $t = ${c2}$, which is before $t = ${t0}$.`,
                `这只保留了第一个阶跃；第二个在 $t = ${c2}$ 接通，早于 $t = ${t0}$。`,
              ),
              why(b, "That keeps only the second step; the first one is on as well.", "这只保留了第二个阶跃；第一个也已接通。"),
              why(
                a * (t0 - c1) + b * (t0 - c2),
                "That gives each step the value $t - c$; a step that is on has the value $1$.",
                "这让每个阶跃取值 $t - c$；接通的阶跃取值为 $1$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Check each step", "逐个判断阶跃"],
                  t("A step is $1$ once $t$ has reached its switch-on time.", "$t$ 一旦到达接通时刻，阶跃就取 $1$。"),
                  [`u(${t0} - ${c1}) = u(${t0 - c1}) = 1`, `u(${t0} - ${c2}) = u(${t0 - c2}) = 1`],
                ],
                [["Add the terms", "各项相加"], t("", ""), [`f(${t0}) = ${a} \\cdot 1 + ${b} \\cdot 1 = ${ans}`]],
              ],
              t(
                `Just before $t = ${c2}$ the signal is $${a}$; the jump of $${b}$ at $t = ${c2}$ brings it to $${ans}$, and nothing switches after that.`,
                `在 $t = ${c2}$ 之前信号为 $${a}$；$t = ${c2}$ 处跳跃 $${b}$，使它变为 $${ans}$，此后不再有阶跃接通。`,
              ),
            ),
          });
        },
      },
      {
        id: "writing-a-piecewise-function-with-unit-steps",
        title: t("Writing a piecewise function with unit steps", "用单位阶跃函数表示分段函数"),
        explanation: t(
          "A unit step $u(t - c)$ switches a term on at $t = c$. To build a function that takes the value $a$, then $b$ from $t = c_1$, then $d$ from $t = c_2$, start with $a$ and add each change at the moment it happens:\n\n$$f(t) = a + (b - a)u(t - c_1) + (d - b)u(t - c_2).$$\n\nEach coefficient is the size of the jump, new value minus old value, not the new value itself.\n\n> **Watch out.** For $f = 2$, then $7$ from $t = 1$, then $4$ from $t = 3$: $f = 2 + 5u(t - 1) - 3u(t - 3)$, not $2 + 7u(t - 1) + 4u(t - 3)$, which would reach $13$ after $t = 3$.",
          "单位阶跃 $u(t - c)$ 在 $t = c$ 时接通一项。要构造一个先取值 $a$、从 $t = c_1$ 起取 $b$、从 $t = c_2$ 起取 $d$ 的函数，从 $a$ 开始，在每次变化发生时加上变化量：\n\n$$f(t) = a + (b - a)u(t - c_1) + (d - b)u(t - c_2).$$\n\n每个系数是跳跃的大小，即新值减旧值，而不是新值本身。\n\n> **注意。** 对先取 $2$、从 $t = 1$ 起取 $7$、从 $t = 3$ 起取 $4$ 的函数：$f = 2 + 5u(t - 1) - 3u(t - 3)$，不是 $2 + 7u(t - 1) + 4u(t - 3)$，后者在 $t = 3$ 之后会变成 $13$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-5, 9);
          let b = rng.int(-5, 9);
          if (b === a) b = a + 4;
          let d = rng.int(-5, 9);
          if (d === b) d = b - 3;
          const c1 = rng.int(1, 4);
          const c2 = c1 + rng.int(1, 5);
          const ans = d - b;
          return numberProblem({
            prompt: t(
              `$f(t) = ${a}$ for $0 \\le t < ${c1}$, $f(t) = ${b}$ for $${c1} \\le t < ${c2}$ and $f(t) = ${d}$ for $t \\ge ${c2}$. Writing $f(t) = A + Bu(t - ${c1}) + Cu(t - ${c2})$, find $C$.`,
              `$0 \\le t < ${c1}$ 时 $f(t) = ${a}$，$${c1} \\le t < ${c2}$ 时 $f(t) = ${b}$，$t \\ge ${c2}$ 时 $f(t) = ${d}$。写成 $f(t) = A + Bu(t - ${c1}) + Cu(t - ${c2})$，求 $C$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                d,
                "That is the new value; the coefficient of a step is the jump, new value minus old value.",
                "这是新的函数值；阶跃的系数是跳跃量，即新值减旧值。",
              ),
              why(
                d - a,
                `That measures the change from the first value $${a}$; just before $t = ${c2}$ the function is $${b}$.`,
                `这量的是相对第一个值 $${a}$ 的变化；在 $t = ${c2}$ 之前函数值是 $${b}$。`,
              ),
              why(b - a, `That is $B$, the jump at $t = ${c1}$.`, `这是 $B$，即 $t = ${c1}$ 处的跳跃。`),
            ]),
            solution: walked(
              [
                [
                  ["Start from the first value", "从第一个值出发"],
                  t(
                    `Before $t = ${c1}$ no step is on, so $A$ is the first value; at $t = ${c1}$ the jump is $B$.`,
                    `在 $t = ${c1}$ 之前没有阶跃接通，所以 $A$ 是第一个值；$t = ${c1}$ 处的跳跃是 $B$。`,
                  ),
                  [`A = ${a}`, `B = ${b} - ${inP(a)} = ${b - a}`],
                ],
                [
                  ["Measure the second jump", "量出第二次跳跃"],
                  t(`At $t = ${c2}$ the value goes from $${b}$ to $${d}$.`, `在 $t = ${c2}$ 处函数值从 $${b}$ 变为 $${d}$。`),
                  [`C = ${d} - ${inP(b)} = ${ans}`],
                ],
              ],
              t(
                `For $t \\ge ${c2}$ all three terms are on: $A + B + C = ${a} ${signed(b - a)} ${signed(ans)} = ${d}$, the last value.`,
                `当 $t \\ge ${c2}$ 时三项都接通：$A + B + C = ${a} ${signed(b - a)} ${signed(ans)} = ${d}$，正是最后的函数值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.3 Piecewise Continuity and Piecewise Smoothness
  {
    id: "piecewise-continuity-and-piecewise-smoothness",
    title: t("Piecewise Continuity and Piecewise Smoothness", "分段连续性与分段光滑性"),
    summary: t(
      "A function is piecewise continuous on [0, infinity) if it is continuous except at isolated jump discontinuities where finite one-sided limits exist.",
      "如果在 [0, 无穷) 上除有限个孤立跳跃间断点外连续，且在间断点处单侧极限均存在且有限，则称该函数为分段连续函数。",
    ),
    intro: t(
      "Take $f(t) = 2t + 1$ for $t < 3$ and $f(t) = t^2$ for $t \\ge 3$. From the left $f \\to 7$ and from the right $f \\to 9$, so $f$ has a finite jump of $9 - 7 = 2$ at $t = 3$ and is continuous everywhere else: it is piecewise continuous.\n\nCheck: both one-sided limits at $t = 3$ are finite numbers, which is exactly what a jump needs, and each piece is a polynomial with no breaks of its own.\n\nIn this lesson we measure jumps and decide which functions are piecewise continuous.",
      "取 $t < 3$ 时 $f(t) = 2t + 1$，$t \\ge 3$ 时 $f(t) = t^2$。从左侧 $f \\to 7$，从右侧 $f \\to 9$，所以 $f$ 在 $t = 3$ 处有大小为 $9 - 7 = 2$ 的有限跳跃，其余各处连续：它是分段连续的。\n\n检验：$t = 3$ 处两个单侧极限都是有限数，这正是跳跃所要求的；每一段都是多项式，本身没有断点。\n\n本课我们计算跳跃的大小，并判断哪些函数分段连续。",
    ),
    prerequisites: ["the-unit-step-function"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "jump-discontinuity-magnitude",
        title: t("Calculating the jump magnitude of a piecewise function", "计算分段函数的跳跃幅度"),
        explanation: t(
          "The size of a jump is the difference between the limit from the right and the limit from the left at the point where the function breaks. At a jump discontinuity $t = c$, the jump magnitude is $\\Delta f(c) = f(c^+) - f(c^-) = \\lim_{t \\to c^+} f(t) - \\lim_{t \\to c^-} f(t)$.\n\n> **Watch out.** Subtract in the order right minus left. For $f = t + 4$ on $t < 2$ and $f = 3t^2$ on $t \\ge 2$, the jump is $12 - 6 = 6$, not $6 - 12 = -6$.",
          "跳跃的大小是函数断开处右极限与左极限之差。在跳跃间断点 $t = c$ 处，跳跃幅度定义为右极限减去左极限：$\\Delta f(c) = f(c^+) - f(c^-) = \\lim_{t \\to c^+} f(t) - \\lim_{t \\to c^-} f(t)$。\n\n> **注意。** 要按右减左的顺序相减。对 $t < 2$ 时 $f = t + 4$、$t \\ge 2$ 时 $f = 3t^2$，跳跃为 $12 - 6 = 6$，不是 $6 - 12 = -6$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(2, 6);
          const k = rng.int(2, 8);
          const m = rng.int(1, 10);
          const b = rng.int(1, 15);
          const leftVal = m * c + b;
          const rightVal = k * c * c;
          const ans = rightVal - leftVal;
          return numberProblem({
            prompt: t(
              `Consider the piecewise continuous function $f(t) = \\begin{cases} ${poly([m, "t"])} + ${b}, & 0 \\le t < ${c} \\\\ ${poly([k, "t^2"])}, & t \\ge ${c} \\end{cases}$. Find the jump magnitude $\\Delta f(${c}) = \\lim_{t \\to ${c}^+} f(t) - \\lim_{t \\to ${c}^-} f(t)$.`,
              `考虑分段连续函数 $f(t) = \\begin{cases} ${poly([m, "t"])} + ${b}, & 0 \\le t < ${c} \\\\ ${poly([k, "t^2"])}, & t \\ge ${c} \\end{cases}$。计算在 $t = ${c}$ 处的跳跃量 $\\Delta f(${c}) = \\lim_{t \\to ${c}^+} f(t) - \\lim_{t \\to ${c}^-} f(t)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                leftVal - rightVal,
                "That subtracts in the wrong order; the jump is right limit minus left limit.",
                "这把顺序减反了；跳跃是右极限减左极限。",
              ),
              why(
                rightVal,
                "That is the right-hand limit alone; the left-hand limit still has to be subtracted.",
                "这只是右极限；还要减去左极限。",
              ),
              why(
                k * c - leftVal,
                `That evaluates $${poly([k, "t^2"])}$ as $${k} \\cdot ${c}$; the square makes it $${k} \\cdot ${c}^2$.`,
                `这把 $${poly([k, "t^2"])}$ 算成了 $${k} \\cdot ${c}$；有平方，应是 $${k} \\cdot ${c}^2$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Take the left-hand limit", "求左极限"],
                  t(`Just before $t = ${c}$ the first piece applies.`, `在 $t = ${c}$ 之前用第一段。`),
                  [`\\lim_{t \\to ${c}^-} f(t) = ${m} \\cdot ${c} + ${b} = ${leftVal}`],
                ],
                [
                  ["Take the right-hand limit", "求右极限"],
                  t(`From $t = ${c}$ on the second piece applies.`, `从 $t = ${c}$ 起用第二段。`),
                  [`\\lim_{t \\to ${c}^+} f(t) = ${k} \\cdot ${c}^2 = ${rightVal}`],
                ],
                [["Subtract right minus left", "右极限减左极限"], t("", ""), [`\\Delta f(${c}) = ${rightVal} - ${leftVal} = ${ans}`]],
              ],
              t(
                `Starting from the left value $${leftVal}$ and adding the jump gives $${leftVal} ${signed(ans)} = ${rightVal}$, the right value.`,
                `从左侧的值 $${leftVal}$ 出发加上跳跃，得 $${leftVal} ${signed(ans)} = ${rightVal}$，正是右侧的值。`,
              ),
            ),
          });
        },
      },
      {
        id: "recognizing-piecewise-continuous-functions",
        figure: differentialEquationsDrawings1["piecewise-continuity-and-piecewise-smoothness#recognizing-piecewise-continuous-functions"],
        title: t("Recognizing piecewise continuous functions", "识别分段连续函数"),
        explanation: t(
          "A function is piecewise continuous on $[0, T]$ when it has only finitely many discontinuities there and each one is a finite jump: both one-sided limits exist and are finite. Steps, floor functions and continuous functions qualify. A vertical asymptote such as $\\frac{1}{t - 2}$ does not, because the one-sided limits are infinite; neither does $\\sin\\frac{1}{t}$ near $0$, whose limit does not exist.\n\n> **Watch out.** Being bounded is not enough, and having a jump is allowed. $\\sin\\frac{1}{t}$ stays between $-1$ and $1$ but is not piecewise continuous near $0$, while $\\lfloor t \\rfloor$ jumps at every integer and is.",
          "若函数在 $[0, T]$ 上只有有限个间断点，且每个都是有限跳跃（两侧单侧极限都存在且有限），则它在该区间上分段连续。阶跃函数、取整函数和连续函数都满足。像 $\\frac{1}{t - 2}$ 这样有铅直渐近线的函数不满足，因为单侧极限是无穷；$\\sin\\frac{1}{t}$ 在 $0$ 附近也不满足，因为其极限不存在。\n\n> **注意。** 有界并不够，而有跳跃是允许的。$\\sin\\frac{1}{t}$ 始终在 $-1$ 与 $1$ 之间，但在 $0$ 附近不是分段连续的；$\\lfloor t \\rfloor$ 在每个整数处跳跃，却是分段连续的。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(1, 6);
          const T = c + rng.int(2, 6);
          const k = rng.int(2, 9);
          const cases: [string, boolean, Text, Text, Text][] = [
            [
              `${k}\\lfloor t \\rfloor`,
              true,
              t("it jumps by a finite amount at each integer and nowhere else", "它只在每个整数处有有限跳跃"),
              t(
                `$${k}\\lfloor t \\rfloor$ can break only at the integers $1, 2, \\dots, ${T}$.`,
                `$${k}\\lfloor t \\rfloor$ 只可能在整数 $1, 2, \\dots, ${T}$ 处断开。`,
              ),
              t(
                `At an integer $n$ the left limit is $${k}(n - 1)$ and the right limit is $${k}n$, a finite jump of $${k}$.`,
                `在整数 $n$ 处左极限为 $${k}(n - 1)$，右极限为 $${k}n$，是大小为 $${k}$ 的有限跳跃。`,
              ),
            ],
            [
              `t^{2} + ${k}u(t - ${c})`,
              true,
              t(`its only discontinuity is a jump of $${k}$ at $t = ${c}$`, `它唯一的间断点是 $t = ${c}$ 处大小为 $${k}$ 的跳跃`),
              t(
                `$t^{2}$ is continuous, so $f$ can break only where the step switches on, at $t = ${c}$.`,
                `$t^{2}$ 连续，所以 $f$ 只可能在阶跃接通处 $t = ${c}$ 断开。`,
              ),
              t(
                `There the left limit is $${c * c}$ and the right limit is $${c * c + k}$, a finite jump of $${k}$.`,
                `那里左极限为 $${c * c}$，右极限为 $${c * c + k}$，是大小为 $${k}$ 的有限跳跃。`,
              ),
            ],
            [
              `|t - ${c}|`,
              true,
              t("it is continuous on the whole interval, so it has no discontinuities at all", "它在整个区间上连续，根本没有间断点"),
              t(
                `$|t - ${c}|$ has a corner at $t = ${c}$, the only place worth testing.`,
                `$|t - ${c}|$ 在 $t = ${c}$ 处有一个尖角，这是唯一需要检查的地方。`,
              ),
              t(
                `Both one-sided limits there are $0 = f(${c})$, so the corner is not a break at all.`,
                `那里两个单侧极限都等于 $0 = f(${c})$，所以尖角根本不是断点。`,
              ),
            ],
            [
              `\\frac{${k}}{t - ${c}}`,
              false,
              t(`it tends to infinity at $t = ${c}$`, `它在 $t = ${c}$ 处趋于无穷`),
              t(
                `$\\frac{${k}}{t - ${c}}$ is not defined at $t = ${c}$, inside the interval.`,
                `$\\frac{${k}}{t - ${c}}$ 在区间内的 $t = ${c}$ 处无定义。`,
              ),
              t(
                `As $t \\to ${c}^+$ the values grow without bound, so that one-sided limit is not a finite number.`,
                `当 $t \\to ${c}^+$ 时函数值无限增大，这个单侧极限不是有限数。`,
              ),
            ],
            [
              `\\tan\\frac{\\pi t}{${2 * c}}`,
              false,
              t(`it tends to infinity at $t = ${c}$`, `它在 $t = ${c}$ 处趋于无穷`),
              t(
                `At $t = ${c}$ the angle $\\frac{\\pi t}{${2 * c}}$ equals $\\frac{\\pi}{2}$, where tangent is not defined.`,
                `在 $t = ${c}$ 处角 $\\frac{\\pi t}{${2 * c}}$ 等于 $\\frac{\\pi}{2}$，正切在那里无定义。`,
              ),
              t(
                `As $t \\to ${c}^-$ the tangent grows without bound, so that one-sided limit is not a finite number.`,
                `当 $t \\to ${c}^-$ 时正切值无限增大，这个单侧极限不是有限数。`,
              ),
            ],
            [
              `\\sin\\frac{${k}}{t - ${c}}`,
              false,
              t(`it has no one-sided limits at $t = ${c}$`, `它在 $t = ${c}$ 处没有单侧极限`),
              t(
                `$\\sin\\frac{${k}}{t - ${c}}$ is not defined at $t = ${c}$, inside the interval.`,
                `$\\sin\\frac{${k}}{t - ${c}}$ 在区间内的 $t = ${c}$ 处无定义。`,
              ),
              t(
                `As $t \\to ${c}$ the angle runs off to infinity and the sine swings between $-1$ and $1$ forever, so neither one-sided limit exists.`,
                `当 $t \\to ${c}$ 时角趋于无穷，正弦值在 $-1$ 与 $1$ 之间无休止地摆动，两个单侧极限都不存在。`,
              ),
            ],
          ];
          const [f, ok, reason, where, limits] = rng.pick(cases);
          const generalYes = t("its only discontinuities are finite jumps", "它的间断点都是有限跳跃");
          const generalNo = t(
            "at some point of the interval a one-sided limit is infinite or does not exist",
            "在区间内某点，某个单侧极限为无穷或不存在",
          );
          return verdictChoice(rng, {
            prompt: t(`Is $f(t) = ${f}$ piecewise continuous on $[0, ${T}]$?`, `$f(t) = ${f}$ 在 $[0, ${T}]$ 上分段连续吗？`),
            holds: ok,
            yes: ok ? reason : generalYes,
            no: ok ? generalNo : reason,
            yesWrong: t("it is given by a single formula", "它由一个式子给出"),
            noWrong: t("it has a corner or a jump somewhere on the interval", "它在区间内某处有尖角或跳跃"),
            solution: walked(
              [
                [["Find where it can break", "找出可能断开的地方"], where],
                [["Test the one-sided limits", "检查单侧极限"], limits],
              ],
              ok
                ? t(
                    "Every break is a finite jump and there are finitely many of them, which is all piecewise continuity asks: yes.",
                    "每个断点都是有限跳跃，且个数有限，这正是分段连续的全部要求：是。",
                  )
                : t(
                    "A piecewise continuous function may jump, but only by a finite amount; this break is worse than a jump: no.",
                    "分段连续的函数可以跳跃，但跳跃必须有限；这里的断点比跳跃更糟：不是。",
                  ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.4 Introduction to Laplace Transforms
  {
    id: "introduction-to-laplace-transforms",
    title: t("Introduction to Laplace Transforms", "拉普拉斯变换简介"),
    summary: t(
      "The Laplace transform $\\mathcal{L}\\{f(t)\\}(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt$ turns a function of time into an algebraic function of $s$.",
      "拉普拉斯变换 $\\mathcal{L}\\{f(t)\\}(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt$ 把时间函数变为 $s$ 的代数函数，是求解微分方程的基本工具。",
    ),
    intro: t(
      "Take $f(t) = 6$. By definition $\\mathcal{L}\\{6\\}(s) = \\int_0^\\infty 6e^{-st}\\,dt = \\left[-\\frac{6}{s}e^{-st}\\right]_0^\\infty = \\frac{6}{s}$ for $s > 0$, so at $s = 3$ the transform is $2$.\n\nCheck: an antiderivative of $6e^{-3t}$ is $-2e^{-3t}$, which goes from $-2$ at $t = 0$ up to $0$ as $t \\to \\infty$, a total change of $2$.\n\nIn this lesson we compute Laplace transforms straight from the defining integral.",
      "取 $f(t) = 6$。由定义，$\\mathcal{L}\\{6\\}(s) = \\int_0^\\infty 6e^{-st}\\,dt = \\left[-\\frac{6}{s}e^{-st}\\right]_0^\\infty = \\frac{6}{s}$（$s > 0$），所以在 $s = 3$ 处变换值为 $2$。\n\n检验：$6e^{-3t}$ 的一个原函数是 $-2e^{-3t}$，它从 $t = 0$ 时的 $-2$ 增加到 $t \\to \\infty$ 时的 $0$，总变化为 $2$。\n\n本课我们直接由定义积分计算拉普拉斯变换。",
    ),
    prerequisites: ["piecewise-continuity-and-piecewise-smoothness"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "laplace-transform-integral-definition",
        title: t("Evaluating the Laplace transform integral of a constant", "计算常数函数的拉普拉斯积分"),
        explanation: t(
          "The Laplace transform multiplies the function by a decaying exponential and integrates over all positive times, turning functions of time into functions of a new variable. By definition, $\\mathcal{L}\\{C\\}(s) = \\int_0^\\infty C e^{-st}\\,dt = \\left[ -\\frac{C}{s} e^{-st} \\right]_0^\\infty = \\frac{C}{s}$ for $s > 0$.\n\n> **Watch out.** Integrating $e^{-st}$ divides by $s$; it does not multiply. $\\mathcal{L}\\{12\\}(4) = \\frac{12}{4} = 3$, not $12 \\cdot 4 = 48$.",
          "拉普拉斯变换把函数乘以一个衰减的指数函数，再在所有正时间上积分，把时间的函数变成一个新变量的函数。根据定义，$\\mathcal{L}\\{C\\}(s) = \\int_0^\\infty C e^{-st}\\,dt = \\left[ -\\frac{C}{s} e^{-st} \\right]_0^\\infty = \\frac{C}{s}$（当 $s > 0$ 时）。\n\n> **注意。** 对 $e^{-st}$ 积分是除以 $s$，不是乘以 $s$。$\\mathcal{L}\\{12\\}(4) = \\frac{12}{4} = 3$，不是 $12 \\cdot 4 = 48$。",
        ),
        generate(rng: Rng): Problem {
          const s = rng.int(2, 10);
          const ans = rng.int(2, 35);
          const C = ans * s;
          return numberProblem({
            prompt: t(
              `Evaluate the Laplace transform integral $\\mathcal{L}\\{${C}\\}(${s}) = \\int_0^\\infty ${C} e^{-${s}t}\\,dt$.`,
              `计算拉普拉斯变换积分 $\\mathcal{L}\\{${C}\\}(${s}) = \\int_0^\\infty ${C} e^{-${s}t}\\,dt$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                C,
                `That leaves out the factor $\\frac{1}{${s}}$ that integrating $e^{-${s}t}$ brings in.`,
                `这漏掉了对 $e^{-${s}t}$ 积分带来的因子 $\\frac{1}{${s}}$。`,
              ),
              why(C * s, "That multiplies by $s$; integrating $e^{-st}$ divides by $s$.", "这乘以了 $s$；对 $e^{-st}$ 积分应除以 $s$。"),
              why(
                -ans,
                "That gets the sign wrong at the lower limit: the bracket is $0 - \\left(-\\frac{C}{s}\\right)$, which is positive.",
                "这在下限处符号出错：方括号为 $0 - \\left(-\\frac{C}{s}\\right)$，结果为正。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find an antiderivative", "求原函数"],
                  t("", ""),
                  [`\\int ${C} e^{-${s}t}\\,dt = -\\frac{${C}}{${s}}e^{-${s}t} = -${ans}e^{-${s}t}`],
                ],
                [
                  ["Evaluate between the limits", "代入上下限"],
                  t("As $t \\to \\infty$ the exponential tends to $0$.", "当 $t \\to \\infty$ 时指数趋于 $0$。"),
                  [`\\left[-${ans}e^{-${s}t}\\right]_0^\\infty = 0 - (-${ans}) = ${ans}`],
                ],
              ],
              t(
                `The formula $\\mathcal{L}\\{C\\} = \\frac{C}{s}$ gives $\\frac{${C}}{${s}} = ${ans}$ as well.`,
                `由公式 $\\mathcal{L}\\{C\\} = \\frac{C}{s}$ 也得 $\\frac{${C}}{${s}} = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-transform-of-an-exponential-from-the-definition",
        title: t("The transform of an exponential from the definition", "由定义求指数函数的变换"),
        explanation: t(
          "For $f(t) = ce^{at}$,\n\n$$\\mathcal{L}\\{ce^{at}\\}(s) = \\int_0^\\infty ce^{(a - s)t}\\,dt = \\left[\\frac{ce^{(a - s)t}}{a - s}\\right]_0^\\infty = \\frac{c}{s - a},$$\n\nprovided $s > a$, so that $e^{(a - s)t} \\to 0$. For $s \\le a$ the integral diverges and the transform does not exist at that $s$.\n\n> **Watch out.** The denominator is $s - a$, not $s + a$. For $5e^{2t}$ at $s = 4$: $\\frac{5}{4 - 2} = \\frac{5}{2}$, not $\\frac{5}{6}$.",
          "对 $f(t) = ce^{at}$，\n\n$$\\mathcal{L}\\{ce^{at}\\}(s) = \\int_0^\\infty ce^{(a - s)t}\\,dt = \\left[\\frac{ce^{(a - s)t}}{a - s}\\right]_0^\\infty = \\frac{c}{s - a},$$\n\n前提是 $s > a$，使 $e^{(a - s)t} \\to 0$。当 $s \\le a$ 时积分发散，变换在该 $s$ 处不存在。\n\n> **注意。** 分母是 $s - a$，不是 $s + a$。对 $5e^{2t}$ 在 $s = 4$ 处：$\\frac{5}{4 - 2} = \\frac{5}{2}$，不是 $\\frac{5}{6}$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-6, 6) || 2;
          const s0 = Math.max(a, 0) + rng.int(1, 6);
          const c = rng.int(2, 15);
          const ans = Q.of(c, s0 - a);
          const r = a - s0;
          return numberProblem({
            prompt: t(
              `Evaluate $\\int_0^\\infty ${c}e^{${co(a)}t}e^{-st}\\,dt$ at $s = ${s0}$.`,
              `求 $\\int_0^\\infty ${c}e^{${co(a)}t}e^{-st}\\,dt$ 在 $s = ${s0}$ 处的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              ...(s0 + a === 0
                ? []
                : [
                    why(
                      Q.of(c, s0 + a),
                      "That uses $s + a$; the exponents combine into $(a - s)t$, so the denominator is $s - a$.",
                      "这用了 $s + a$；指数合并为 $(a - s)t$，所以分母是 $s - a$。",
                    ),
                  ]),
              why(
                Q.of(c, s0),
                `That drops $e^{${co(a)}t}$ and transforms the constant $${c}$ instead.`,
                `这丢掉了 $e^{${co(a)}t}$，变换的只是常数 $${c}$。`,
              ),
              why(
                Q.of(-c, s0 - a),
                "That gets the sign wrong at the lower limit: subtracting the value at $t = 0$ makes the result positive.",
                "这在下限处符号出错：减去 $t = 0$ 处的值后结果为正。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Combine the exponentials", "合并指数"],
                  t(
                    `At $s = ${s0}$ the exponent is $(${a} - ${s0})t$, which is negative, so the integrand decays.`,
                    `在 $s = ${s0}$ 处指数为 $(${a} - ${s0})t$，是负的，所以被积函数衰减。`,
                  ),
                  [`${c}e^{${co(a)}t}e^{-${s0}t} = ${c}e^{${co(r)}t}`],
                ],
                [
                  ["Integrate", "积分"],
                  t("", ""),
                  [
                    `\\int_0^\\infty ${c}e^{${co(r)}t}\\,dt = \\left[\\frac{${c}e^{${co(r)}t}}{${r}}\\right]_0^\\infty = 0 - \\frac{${c}}{${r}} = ${ans.toLatex()}`,
                  ],
                ],
              ],
              t(
                `The formula $\\frac{c}{s - a}$ gives $\\frac{${c}}{${s0} - ${inP(a)}} = ${ans.toLatex()}$ as well.`,
                `由公式 $\\frac{c}{s - a}$ 也得 $\\frac{${c}}{${s0} - ${inP(a)}} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.5 Linearity of Laplace Transforms
  {
    id: "linearity-of-laplace-transforms",
    title: t("Linearity of Laplace Transforms", "拉普拉斯变换的线性性质"),
    summary: t(
      "Linearity allows term-by-term transformation: L{c1 f1(t) + c2 f2(t)} = c1 L{f1(t)} + c2 L{f2(t)}.",
      "线性性质允许逐项变换：L{c1 f1(t) + c2 f2(t)} = c1 L{f1(t)} + c2 L{f2(t)}。",
    ),
    intro: t(
      "Take $f(t) = 3t^2 + 4t + 5$. Term by term, $\\mathcal{L}\\{f\\} = 3 \\cdot \\frac{2}{s^3} + 4 \\cdot \\frac{1}{s^2} + 5 \\cdot \\frac{1}{s} = \\frac{6}{s^3} + \\frac{4}{s^2} + \\frac{5}{s}$, which equals $15$ at $s = 1$.\n\nCheck: with $\\int_0^\\infty t^ne^{-t}\\,dt = n!$, the integral $\\int_0^\\infty (3t^2 + 4t + 5)e^{-t}\\,dt$ is $3 \\cdot 2 + 4 \\cdot 1 + 5 \\cdot 1 = 15$.\n\nIn this lesson we transform sums of known functions term by term.",
      "取 $f(t) = 3t^2 + 4t + 5$。逐项变换，$\\mathcal{L}\\{f\\} = 3 \\cdot \\frac{2}{s^3} + 4 \\cdot \\frac{1}{s^2} + 5 \\cdot \\frac{1}{s} = \\frac{6}{s^3} + \\frac{4}{s^2} + \\frac{5}{s}$，在 $s = 1$ 处等于 $15$。\n\n检验：利用 $\\int_0^\\infty t^ne^{-t}\\,dt = n!$，积分 $\\int_0^\\infty (3t^2 + 4t + 5)e^{-t}\\,dt$ 等于 $3 \\cdot 2 + 4 \\cdot 1 + 5 \\cdot 1 = 15$。\n\n本课我们对已知函数之和逐项做变换。",
    ),
    prerequisites: ["introduction-to-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-linear-combinations-of-transforms",
        title: t("Transforming linear combinations of powers of t", "变换 t 的幂的线性组合"),
        explanation: t(
          "The transform is linear, so a combination of powers of time transforms into the same combination of their known transforms. Recall $\\mathcal{L}\\{1\\} = \\frac{1}{s}$, $\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$, and $\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$. The coefficient of $1/s^3$ in $\\mathcal{L}\\{a t^2 + b t + c\\}$ is $2a$.\n\n> **Watch out.** $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n + 1}}$, so the $t^2$ term carries the factor $2! = 2$. For $5t^2 + 3t$, the coefficient of $\\frac{1}{s^3}$ is $10$, not $5$.",
          "这个变换是线性的，所以时间的幂的组合变换为它们已知变换的同样组合。已知 $\\mathcal{L}\\{1\\} = \\frac{1}{s}$，$\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$，$\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$。$\\mathcal{L}\\{a t^2 + b t + c\\}$ 中 $1/s^3$ 项的系数为 $2a$。\n\n> **注意。** $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n + 1}}$，所以 $t^2$ 项带有因子 $2! = 2$。对 $5t^2 + 3t$，$\\frac{1}{s^3}$ 的系数是 $10$，不是 $5$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 35);
          const b = rng.int(2, 20);
          const c = rng.int(1, 20);
          const ans = 2 * a;
          return numberProblem({
            prompt: t(
              `Let $F(s) = \\mathcal{L}\\{${a} t^2 + ${b} t + ${c}\\}$. Find the coefficient of $\\frac{1}{s^3}$ in the partial fraction expansion of $F(s)$.`,
              `设 $F(s) = \\mathcal{L}\\{${a} t^2 + ${b} t + ${c}\\}$。求 $F(s)$ 在部分分式展开中 $\\frac{1}{s^3}$ 项的系数。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                a,
                "That forgets the $2!$ in $\\mathcal{L}\\{t^2\\} = \\frac{2!}{s^3}$.",
                "这忘了 $\\mathcal{L}\\{t^2\\} = \\frac{2!}{s^3}$ 中的 $2!$。",
              ),
              why(
                6 * a,
                "That uses $3! = 6$; for $t^2$ the factor is $2! = 2$, and the $3$ is the power of $s$.",
                "这用了 $3! = 6$；$t^2$ 的因子是 $2! = 2$，$3$ 是 $s$ 的次数。",
              ),
              why(
                2 * b,
                "That doubles the coefficient of $t$, which belongs with $\\frac{1}{s^2}$.",
                "这把 $t$ 的系数加倍了，而它属于 $\\frac{1}{s^2}$ 项。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform term by term", "逐项变换"],
                  t("Linearity lets each power be transformed on its own.", "由线性性，每个幂可以单独变换。"),
                  [
                    `\\mathcal{L}\\{${a}t^2 + ${b}t + ${c}\\} = ${a} \\cdot \\frac{2}{s^3} + ${b} \\cdot \\frac{1}{s^2} + ${c} \\cdot \\frac{1}{s}`,
                  ],
                ],
                [["Read the coefficient", "读出系数"], t("", ""), [`F(s) = \\frac{${ans}}{s^3} + \\frac{${b}}{s^2} + \\frac{${c}}{s}`]],
              ],
              t(
                `Only $t^2$ produces $\\frac{1}{s^3}$, and $\\int_0^\\infty t^2e^{-t}\\,dt = 2$ confirms $\\mathcal{L}\\{t^2\\}(1) = 2$, so $${a}t^2$ contributes $${a} \\cdot 2 = ${ans}$.`,
                `只有 $t^2$ 产生 $\\frac{1}{s^3}$，而 $\\int_0^\\infty t^2e^{-t}\\,dt = 2$ 证实了 $\\mathcal{L}\\{t^2\\}(1) = 2$，所以 $${a}t^2$ 贡献 $${a} \\cdot 2 = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "evaluating-the-transform-of-a-sinusoidal-combination",
        title: t("Evaluating the transform of a sinusoidal combination", "求正弦型组合的变换值"),
        explanation: t(
          "Linearity lets you transform term by term, using $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ and $\\mathcal{L}\\{\\cos bt\\} = \\frac{s}{s^{2} + b^{2}}$:\n\n$$\\mathcal{L}\\{p\\sin bt + q\\cos bt\\} = \\frac{pb + qs}{s^{2} + b^{2}}.$$\n\nNote the sine contributes $b$ in the numerator, and the cosine contributes $s$; swapping them is a common error.\n\n> **Watch out.** For $2\\sin 3t + 5\\cos 3t$ at $s = 1$: $\\frac{2 \\cdot 3 + 5 \\cdot 1}{1 + 9} = \\frac{11}{10}$, not $\\frac{2 \\cdot 1 + 5 \\cdot 3}{10} = \\frac{17}{10}$.",
          "线性性允许逐项变换，利用 $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ 与 $\\mathcal{L}\\{\\cos bt\\} = \\frac{s}{s^{2} + b^{2}}$：\n\n$$\\mathcal{L}\\{p\\sin bt + q\\cos bt\\} = \\frac{pb + qs}{s^{2} + b^{2}}.$$\n\n注意正弦在分子中贡献 $b$，余弦贡献 $s$；把两者弄反是常见错误。\n\n> **注意。** 对 $2\\sin 3t + 5\\cos 3t$ 在 $s = 1$ 处：$\\frac{2 \\cdot 3 + 5 \\cdot 1}{1 + 9} = \\frac{11}{10}$，不是 $\\frac{2 \\cdot 1 + 5 \\cdot 3}{10} = \\frac{17}{10}$。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.int(-6, 9) || 3;
          const q = rng.int(-6, 9) || -2;
          const b = rng.int(1, 5);
          const s0 = rng.int(1, 6);
          const den = s0 * s0 + b * b;
          const ans = Q.of(p * b + q * s0, den);
          const bt = b === 1 ? "t" : `${b}t`;
          return numberProblem({
            prompt: t(
              `Let $F(s) = \\mathcal{L}\\{${co(p)}\\sin ${bt} ${sco(q)}\\cos ${bt}\\}$. Find $F(${s0})$.`,
              `设 $F(s) = \\mathcal{L}\\{${co(p)}\\sin ${bt} ${sco(q)}\\cos ${bt}\\}$。求 $F(${s0})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(p * s0 + q * b, den),
                "That swaps the numerators: sine contributes $b$ and cosine contributes $s$.",
                "这把分子弄反了：正弦贡献 $b$，余弦贡献 $s$。",
              ),
              why(Q.of(p + q, den), "That drops the $b$ and the $s$ from the numerators.", "这丢掉了分子中的 $b$ 和 $s$。"),
              ...(s0 === b
                ? []
                : [
                    why(
                      Q.of(p * b + q * s0, s0 * s0 - b * b),
                      "That uses $s^2 - b^2$ in the denominator; for sine and cosine it is $s^2 + b^2$.",
                      "这在分母中用了 $s^2 - b^2$；正弦与余弦的分母是 $s^2 + b^2$。",
                    ),
                  ]),
            ]),
            solution: walked(
              [
                [
                  ["Transform each term", "逐项变换"],
                  t("", ""),
                  [
                    `\\mathcal{L}\\{${co(p)}\\sin ${bt}\\} = \\frac{${p * b}}{s^2 + ${b * b}}`,
                    `\\mathcal{L}\\{${co(q)}\\cos ${bt}\\} = \\frac{${co(q)}s}{s^2 + ${b * b}}`,
                  ],
                ],
                [
                  ["Evaluate at the point", "代入该点"],
                  t("", ""),
                  [
                    `F(${s0}) = \\frac{${p * b} ${signed(q * s0)}}{${s0}^2 + ${b * b}} = \\frac{${p * b + q * s0}}{${den}} = ${ans.toLatex()}`,
                  ],
                ],
              ],
              t(
                `Both terms share the denominator $${s0}^2 + ${b}^2 = ${den}$; the sine part gives $${p} \\cdot ${b} = ${p * b}$ and the cosine part gives $${q} \\cdot ${s0} = ${q * s0}$, which add to $${p * b + q * s0}$.`,
                `两项的分母都是 $${s0}^2 + ${b}^2 = ${den}$；正弦部分给出 $${p} \\cdot ${b} = ${p * b}$，余弦部分给出 $${q} \\cdot ${s0} = ${q * s0}$，二者之和为 $${p * b + q * s0}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.6 Laplace Transforms of Piecewise Continuous Functions
  {
    id: "laplace-transforms-of-piecewise-continuous-functions",
    title: t("Laplace Transforms of Piecewise Continuous Functions", "分段连续函数的拉普拉斯变换"),
    summary: t(
      "A pulse of height h on [0, c) can be transformed by direct integration or using the unit step expression h[1 - u(t - c)].",
      "区间 [0, c) 上的高度为 h 的矩形脉冲可通过直接积分或改写为 h[1 - u(t - c)] 进行拉普拉斯变换。",
    ),
    intro: t(
      "Take the pulse $f(t) = 4$ on $[0, 3)$ and $f(t) = 0$ afterwards, which is $4 - 4u(t - 3)$. Its transform is $\\frac{4}{s} - \\frac{4e^{-3s}}{s} = \\frac{4\\left(1 - e^{-3s}\\right)}{s}$.\n\nCheck: integrating directly, $\\int_0^3 4e^{-st}\\,dt = \\left[-\\frac{4}{s}e^{-st}\\right]_0^3 = \\frac{4}{s}\\left(1 - e^{-3s}\\right)$, the same.\n\nIn this lesson we transform pulses and other functions defined piece by piece.",
      "取脉冲：在 $[0, 3)$ 上 $f(t) = 4$，此后 $f(t) = 0$，即 $4 - 4u(t - 3)$。它的变换是 $\\frac{4}{s} - \\frac{4e^{-3s}}{s} = \\frac{4\\left(1 - e^{-3s}\\right)}{s}$。\n\n检验：直接积分，$\\int_0^3 4e^{-st}\\,dt = \\left[-\\frac{4}{s}e^{-st}\\right]_0^3 = \\frac{4}{s}\\left(1 - e^{-3s}\\right)$，结果相同。\n\n本课我们对脉冲以及其他分段定义的函数做变换。",
    ),
    prerequisites: ["linearity-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "transform-of-finite-pulse",
        title: t("Zero-frequency limit of a finite pulse transform", "有限脉冲变换的零频极限"),
        explanation: t(
          "As the variable approaches zero the exponential factor approaches one, so the transform approaches the total area under the pulse. For a finite pulse $f(t) = h$ on $[0, c)$ and $0$ for $t \\ge c$, $\\lim_{s \\to 0^+} F(s) = \\int_0^c h\\,dt = hc$, representing the total area under the signal.\n\n> **Watch out.** The limit is the area, height times width, and it is not $0$ even though $1 - e^{-cs} \\to 0$: the $\\frac{1}{s}$ grows at the same rate. A pulse of height $5$ on $[0, 4)$ gives $20$, not $5 + 4 = 9$.",
          "当变量趋于零时，指数因子趋于 1，所以变换趋于脉冲下方的总面积。对于在 $[0, c)$ 上取值 $h$、在 $t \\ge c$ 上取值 $0$ 的脉冲信号，其变换在 $s \\to 0^+$ 时的极限为 $\\lim_{s \\to 0^+} F(s) = \\int_0^c h\\,dt = hc$，代表信号下方的总面积。\n\n> **注意。** 极限是面积，即高乘宽；虽然 $1 - e^{-cs} \\to 0$，极限却不是 $0$，因为 $\\frac{1}{s}$ 以同样的速度增大。高 $5$、位于 $[0, 4)$ 的脉冲给出 $20$，不是 $5 + 4 = 9$。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.int(2, 15);
          const c = rng.int(2, 15);
          const ans = h * c;
          return numberProblem({
            prompt: t(
              `Let $f(t) = \\begin{cases} ${h}, & 0 \\le t < ${c} \\\\ 0, & t \\ge ${c} \\end{cases}$ and let $F(s) = \\mathcal{L}\\{f(t)\\}$. Compute the low-frequency limit $\\lim_{s \\to 0^+} F(s)$.`,
              `设 $f(t) = \\begin{cases} ${h}, & 0 \\le t < ${c} \\\\ 0, & t \\ge ${c} \\end{cases}$，其拉普拉斯变换为 $F(s) = \\mathcal{L}\\{f(t)\\}$。计算低频极限 $\\lim_{s \\to 0^+} F(s)$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                h + c,
                "That adds the height and the width; the limit is the area, their product.",
                "这把高和宽相加了；极限是面积，即二者之积。",
              ),
              why(h, "That is the height of the pulse; the limit is the area under it.", "这是脉冲的高度；极限是它下方的面积。"),
              why(
                0,
                "That sets $s = 0$ in $1 - e^{-cs}$ and forgets the $\\frac{1}{s}$ in front, which makes this a limit of the form $\\frac{0}{0}$.",
                "这在 $1 - e^{-cs}$ 中令 $s = 0$，却忘了前面的 $\\frac{1}{s}$，它使极限成为 $\\frac{0}{0}$ 型。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the transform", "写出变换"],
                  t("The pulse is zero after $t = c$, so the integral stops there.", "脉冲在 $t = c$ 之后为零，所以积分到那里为止。"),
                  [`F(s) = \\int_0^{${c}} ${h}e^{-st}\\,dt = \\frac{${h}\\left(1 - e^{-${c}s}\\right)}{s}`],
                ],
                [
                  ["Let s tend to 0", "令 s 趋于 0"],
                  t(
                    `As $s \\to 0^+$ the factor $e^{-st}$ tends to $1$ for every $t$ in $[0, ${c}]$.`,
                    `当 $s \\to 0^+$ 时，对 $[0, ${c}]$ 中每个 $t$，因子 $e^{-st}$ 趋于 $1$。`,
                  ),
                  [`\\lim_{s \\to 0^+} F(s) = \\int_0^{${c}} ${h}\\,dt = ${h} \\cdot ${c} = ${ans}`],
                ],
              ],
              t(
                `For small $s$, $1 - e^{-${c}s} \\approx ${c}s$, so $F(s) \\approx \\frac{${h} \\cdot ${c}s}{s} = ${ans}$.`,
                `$s$ 很小时 $1 - e^{-${c}s} \\approx ${c}s$，所以 $F(s) \\approx \\frac{${h} \\cdot ${c}s}{s} = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-transform-of-a-truncated-ramp",
        title: t("The transform of a truncated ramp", "截断斜坡的变换"),
        explanation: t(
          "The ramp $kt$ switched off at $t = c$ is $kt - kt\\,u(t - c)$. To use the shift rule, rewrite $t = (t - c) + c$:\n\n$$kt\\,u(t - c) = k(t - c)u(t - c) + kc\\,u(t - c),$$\n\nso $\\mathcal{L}\\{f\\} = \\frac{k}{s^{2}} - e^{-cs}\\left(\\frac{k}{s^{2}} + \\frac{kc}{s}\\right)$. The second term inside the bracket comes from the height $kc$ of the drop at $t = c$.\n\n> **Watch out.** $kt\\,u(t - c)$ is not $k(t - c)u(t - c)$. For $3t$ switched off at $t = 2$: $3t\\,u(t - 2) = 3(t - 2)u(t - 2) + 6u(t - 2)$, and the $6$, the height of the drop, is the part that is easy to lose.",
          "在 $t = c$ 处关断的斜坡 $kt$ 可写为 $kt - kt\\,u(t - c)$。为使用平移法则，把 $t$ 写成 $(t - c) + c$：\n\n$$kt\\,u(t - c) = k(t - c)u(t - c) + kc\\,u(t - c),$$\n\n所以 $\\mathcal{L}\\{f\\} = \\frac{k}{s^{2}} - e^{-cs}\\left(\\frac{k}{s^{2}} + \\frac{kc}{s}\\right)$。括号中第二项来自 $t = c$ 处下降的高度 $kc$。\n\n> **注意。** $kt\\,u(t - c)$ 不等于 $k(t - c)u(t - c)$。对在 $t = 2$ 处关断的 $3t$：$3t\\,u(t - 2) = 3(t - 2)u(t - 2) + 6u(t - 2)$，其中下降高度 $6$ 最容易漏掉。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 9);
          const c = rng.int(2, 7);
          const ans = k * c;
          return numberProblem({
            prompt: t(
              `$f(t) = ${k}t$ for $0 \\le t < ${c}$ and $f(t) = 0$ for $t \\ge ${c}$. Its transform is $\\frac{${k}}{s^{2}} - e^{-${c}s}\\left(\\frac{A}{s^{2}} + \\frac{B}{s}\\right)$. Find $B$.`,
              `$0 \\le t < ${c}$ 时 $f(t) = ${k}t$，$t \\ge ${c}$ 时 $f(t) = 0$。它的变换为 $\\frac{${k}}{s^{2}} - e^{-${c}s}\\left(\\frac{A}{s^{2}} + \\frac{B}{s}\\right)$。求 $B$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                k,
                "That is $A$, the slope of the ramp; $B$ is the height it drops from.",
                "这是 $A$，即斜坡的斜率；$B$ 是它下降前的高度。",
              ),
              why(
                c,
                `That is the switch-off time; the ramp has climbed to $${k}$ times it by then.`,
                `这是关断时刻；那时斜坡已升到它的 $${k}$ 倍。`,
              ),
              why(
                0,
                "That treats $kt\\,u(t - c)$ as $k(t - c)u(t - c)$; writing $t = (t - c) + c$ leaves an extra $kc\\,u(t - c)$.",
                "这把 $kt\\,u(t - c)$ 当成了 $k(t - c)u(t - c)$；写成 $t = (t - c) + c$ 后还多出 $kc\\,u(t - c)$。",
              ),
            ]),
            solution: walked(
              [
                [["Switch the ramp off with a step", "用阶跃关断斜坡"], t("", ""), [`f(t) = ${k}t - ${k}t\\,u(t - ${c})`]],
                [
                  ["Shift the second term", "平移第二项"],
                  t(`Write $t = (t - ${c}) + ${c}$ so that the shift rule applies.`, `把 $t$ 写成 $(t - ${c}) + ${c}$，以便使用平移法则。`),
                  [`${k}t\\,u(t - ${c}) = ${k}(t - ${c})u(t - ${c}) + ${ans}u(t - ${c})`],
                ],
                [
                  ["Transform", "取变换"],
                  t("", ""),
                  [
                    `\\mathcal{L}\\{f\\} = \\frac{${k}}{s^2} - e^{-${c}s}\\left(\\frac{${k}}{s^2} + \\frac{${ans}}{s}\\right), \\qquad B = ${ans}`,
                  ],
                ],
              ],
              t(
                `Just before $t = ${c}$ the ramp stands at $${k} \\cdot ${c} = ${ans}$, and $B\\,u(t - ${c})$ is the term that removes that height, so $B = ${ans}$.`,
                `在 $t = ${c}$ 之前斜坡高 $${k} \\cdot ${c} = ${ans}$，而 $B\\,u(t - ${c})$ 正是去掉这段高度的项，所以 $B = ${ans}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.7 The Smoothness Property of Laplace Transforms
  {
    id: "the-smoothness-property-of-laplace-transforms",
    title: t("The Smoothness Property of Laplace Transforms", "拉普拉斯变换的光滑性质"),
    summary: t(
      "Differentiating F(s) in the frequency domain corresponds to multiplication by -t in the time domain: d/ds F(s) = -L{t f(t)}.",
      "频域中的求导对应于时域中乘以 -t：d/ds F(s) = -L{t f(t)}。这体现了拉普拉斯变换在其收敛域内的无穷阶光滑性。",
    ),
    intro: t(
      "Take $f(t) = te^{2t}$. Since $\\mathcal{L}\\{e^{2t}\\} = \\frac{1}{s - 2}$, multiplying by $t$ gives $-\\frac{d}{ds}\\frac{1}{s - 2} = \\frac{1}{(s - 2)^2}$, which is $\\frac{1}{4}$ at $s = 4$.\n\nCheck: directly, $\\int_0^\\infty te^{2t}e^{-4t}\\,dt = \\int_0^\\infty te^{-2t}\\,dt = \\frac{1}{2^2} = \\frac{1}{4}$, using $\\int_0^\\infty te^{-kt}\\,dt = \\frac{1}{k^2}$.\n\nIn this lesson we find the transforms of functions multiplied by $t$ by differentiating in $s$.",
      "取 $f(t) = te^{2t}$。因为 $\\mathcal{L}\\{e^{2t}\\} = \\frac{1}{s - 2}$，乘以 $t$ 得 $-\\frac{d}{ds}\\frac{1}{s - 2} = \\frac{1}{(s - 2)^2}$，在 $s = 4$ 处为 $\\frac{1}{4}$。\n\n检验：直接计算，$\\int_0^\\infty te^{2t}e^{-4t}\\,dt = \\int_0^\\infty te^{-2t}\\,dt = \\frac{1}{2^2} = \\frac{1}{4}$，这里用到 $\\int_0^\\infty te^{-kt}\\,dt = \\frac{1}{k^2}$。\n\n本课我们通过对 $s$ 求导，求乘以 $t$ 的函数的变换。",
    ),
    prerequisites: ["laplace-transforms-of-piecewise-continuous-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "multiplication-by-t-frequency-differentiation",
        title: t("Frequency differentiation formula for t e^(at)", "t e^(at) 的频域求导公式"),
        explanation: t(
          "Multiplying a function by time corresponds to differentiating its transform and changing the sign, which gives the transforms of such products quickly. Since $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s - a}$, differentiation gives $\\mathcal{L}\\{t e^{at}\\} = -\\frac{d}{ds}\\left(\\frac{1}{s - a}\\right) = \\frac{1}{(s - a)^2}$. For $f(t) = c t e^{at}$, $(s - a)^2 \\mathcal{L}\\{f(t)\\} = c$.\n\n> **Watch out.** The factor $t$ squares the denominator, and the minus sign of $-\\frac{d}{ds}$ cancels the minus from differentiating. For $3te^{t}$ at $s = 3$: $\\frac{3}{(3 - 1)^2} = \\frac{3}{4}$, not $\\frac{3}{2}$ and not $-\\frac{3}{4}$.",
          "把函数乘以时间对应于对它的变换求导并改变符号，这样可以很快得到这类乘积的变换。因为 $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s - a}$，求导可得 $\\mathcal{L}\\{t e^{at}\\} = -\\frac{d}{ds}\\left(\\frac{1}{s - a}\\right) = \\frac{1}{(s - a)^2}$。对于 $f(t) = c t e^{at}$，有 $(s - a)^2 \\mathcal{L}\\{f(t)\\} = c$。\n\n> **注意。** 因子 $t$ 使分母变成平方，而 $-\\frac{d}{ds}$ 的负号抵消了求导产生的负号。对 $3te^{t}$ 在 $s = 3$ 处：$\\frac{3}{(3 - 1)^2} = \\frac{3}{4}$，不是 $\\frac{3}{2}$，也不是 $-\\frac{3}{4}$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 10);
          const c = rng.int(2, 35);
          const k = rng.int(2, 6);
          const s0 = a + k;
          const ans = Q.of(c, k * k);
          return numberProblem({
            prompt: t(
              `Let $f(t) = ${c} t e^{${a}t}$ and let $F(s) = \\mathcal{L}\\{f(t)\\}$. Find $F(${s0})$.`,
              `设 $f(t) = ${c} t e^{${a}t}$，$F(s) = \\mathcal{L}\\{f(t)\\}$。求 $F(${s0})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(c, k),
                "That leaves the denominator unsquared, which is the transform of $ce^{at}$ without the $t$.",
                "这没有把分母平方，那是不带 $t$ 的 $ce^{at}$ 的变换。",
              ),
              why(
                Q.of(-c, k * k),
                "That keeps a minus sign; $\\mathcal{L}\\{tg\\} = -G'(s)$ and $G'$ is negative, so the result is positive.",
                "这多留了一个负号；$\\mathcal{L}\\{tg\\} = -G'(s)$，而 $G'$ 为负，所以结果为正。",
              ),
              why(
                Q.of(c, s0 * s0),
                `That loses the shift: the denominator is $(s - ${a})^2$, not $s^2$.`,
                `这丢了平移：分母是 $(s - ${a})^2$，不是 $s^2$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate the transform", "对变换求导"],
                  t("Multiplying by $t$ is $-\\frac{d}{ds}$ of the transform.", "乘以 $t$ 相当于对变换取 $-\\frac{d}{ds}$。"),
                  [
                    `\\mathcal{L}\\{e^{${a}t}\\} = \\frac{1}{s - ${a}}`,
                    `\\mathcal{L}\\{te^{${a}t}\\} = -\\frac{d}{ds}\\frac{1}{s - ${a}} = \\frac{1}{(s - ${a})^2}`,
                  ],
                ],
                [
                  ["Scale and evaluate", "乘系数并求值"],
                  t("", ""),
                  [`F(${s0}) = \\frac{${c}}{(${s0} - ${a})^2} = \\frac{${c}}{${k * k}}${fr(c, k * k)}`],
                ],
              ],
              t(
                `The shift rule gives the same: $\\mathcal{L}\\{${c}t\\} = \\frac{${c}}{s^2}$, and the factor $e^{${a}t}$ replaces $s$ by $s - ${a}$, so at $s = ${s0}$ the value is $\\frac{${c}}{${k}^2} = ${ans.toLatex()}$.`,
                `用平移法则也得同样结果：$\\mathcal{L}\\{${c}t\\} = \\frac{${c}}{s^2}$，因子 $e^{${a}t}$ 把 $s$ 换成 $s - ${a}$，所以在 $s = ${s0}$ 处值为 $\\frac{${c}}{${k}^2} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "transforms-of-t-times-a-sinusoid",
        title: t("Transforms of $t$ times a sinusoid", "$t$ 乘正弦型函数的变换"),
        explanation: t(
          "Multiplying by $t$ corresponds to $-\\frac{d}{ds}$ of the transform. Differentiating the sine and cosine transforms gives\n\n$$\\mathcal{L}\\{t\\sin bt\\} = \\frac{2bs}{(s^{2} + b^{2})^{2}}, \\qquad \\mathcal{L}\\{t\\cos bt\\} = \\frac{s^{2} - b^{2}}{(s^{2} + b^{2})^{2}}.$$\n\nThe denominator is squared; keeping it unsquared is the usual slip.\n\n> **Watch out.** For $t\\sin 2t$ at $s = 1$: $\\frac{2 \\cdot 2 \\cdot 1}{(1 + 4)^2} = \\frac{4}{25}$, not $\\frac{4}{5}$.",
          "乘以 $t$ 对应于对变换取 $-\\frac{d}{ds}$。对正弦与余弦的变换求导得\n\n$$\\mathcal{L}\\{t\\sin bt\\} = \\frac{2bs}{(s^{2} + b^{2})^{2}}, \\qquad \\mathcal{L}\\{t\\cos bt\\} = \\frac{s^{2} - b^{2}}{(s^{2} + b^{2})^{2}}.$$\n\n分母是平方；忘记平方是常见错误。\n\n> **注意。** 对 $t\\sin 2t$ 在 $s = 1$ 处：$\\frac{2 \\cdot 2 \\cdot 1}{(1 + 4)^2} = \\frac{4}{25}$，不是 $\\frac{4}{5}$。",
        ),
        generate(rng: Rng): Problem {
          const b = rng.int(1, 4);
          let s0 = rng.int(1, 5);
          const isSin = rng.bool(0.5);
          // t cos bt has transform 0 at s = b, which leaves nothing to compute.
          if (!isSin && s0 === b) s0 = b + 1;
          const den = (s0 * s0 + b * b) ** 2;
          const num = isSin ? 2 * b * s0 : s0 * s0 - b * b;
          const ans = Q.of(num, den);
          const bt = b === 1 ? "t" : `${b}t`;
          const fn = isSin ? "\\sin" : "\\cos";
          const base = isSin ? `\\frac{${b}}{s^2 + ${b * b}}` : `\\frac{s}{s^2 + ${b * b}}`;
          const formula = isSin ? `\\frac{${2 * b}s}{(s^2 + ${b * b})^2}` : `\\frac{s^2 - ${b * b}}{(s^2 + ${b * b})^2}`;
          const top = isSin ? `${2 * b} \\cdot ${s0}` : `${s0}^2 - ${b * b}`;
          return numberProblem({
            prompt: t(
              `Find $\\mathcal{L}\\{t${fn} ${bt}\\}$ at $s = ${s0}$.`,
              `求 $\\mathcal{L}\\{t${fn} ${bt}\\}$ 在 $s = ${s0}$ 处的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(num, s0 * s0 + b * b),
                "That leaves the denominator unsquared; differentiating a quotient squares it.",
                "这没有把分母平方；对商求导会使分母平方。",
              ),
              why(
                Q.of(isSin ? s0 * s0 - b * b : 2 * b * s0, den),
                `That uses the numerator of $t${isSin ? "\\cos" : "\\sin"} ${bt}$ instead.`,
                `这用成了 $t${isSin ? "\\cos" : "\\sin"} ${bt}$ 的分子。`,
              ),
              why(Q.of(-num, den), "That drops the minus sign in $-\\frac{d}{ds}$.", "这丢了 $-\\frac{d}{ds}$ 中的负号。"),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate the transform", "对变换求导"],
                  t("Multiplying by $t$ is $-\\frac{d}{ds}$ of the transform.", "乘以 $t$ 相当于对变换取 $-\\frac{d}{ds}$。"),
                  [`\\mathcal{L}\\{${fn} ${bt}\\} = ${base}`, `\\mathcal{L}\\{t${fn} ${bt}\\} = -\\frac{d}{ds}${base} = ${formula}`],
                ],
                [
                  ["Evaluate at the point", "代入该点"],
                  t("", ""),
                  [`\\frac{${top}}{(${s0}^2 + ${b * b})^2} = \\frac{${num}}{${den}}${fr(num, den)}`],
                ],
              ],
              isSin
                ? t(
                    `The quotient rule gives $\\frac{d}{ds}${base} = -\\frac{${2 * b}s}{(s^2 + ${b * b})^2}$; the minus sign of $-\\frac{d}{ds}$ cancels its minus, so the value at $s = ${s0}$ is positive.`,
                    `由商的求导法则，$\\frac{d}{ds}${base} = -\\frac{${2 * b}s}{(s^2 + ${b * b})^2}$；$-\\frac{d}{ds}$ 的负号抵消了它的负号，所以在 $s = ${s0}$ 处的值为正。`,
                  )
                : t(
                    `The quotient rule gives $\\frac{d}{ds}${base} = \\frac{${b * b} - s^2}{(s^2 + ${b * b})^2}$; negating it puts $s^2 - ${b * b}$ on top, which is $${num}$ at $s = ${s0}$.`,
                    `由商的求导法则，$\\frac{d}{ds}${base} = \\frac{${b * b} - s^2}{(s^2 + ${b * b})^2}$；取相反数后分子为 $s^2 - ${b * b}$，在 $s = ${s0}$ 处等于 $${num}$。`,
                  ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.8 Laplace Transforms of Derivatives
  {
    id: "laplace-transforms-of-derivatives",
    title: t("Laplace Transforms of Derivatives", "导数的拉普拉斯变换"),
    summary: t(
      "Transforms of derivatives bring in the initial conditions: $\\mathcal{L}\\{y'\\} = sY(s) - y(0)$ and $\\mathcal{L}\\{y''\\} = s^2 Y(s) - sy(0) - y'(0)$.",
      "导数的拉普拉斯变换自动带入初始条件：$\\mathcal{L}\\{y'\\} = sY(s) - y(0)$，$\\mathcal{L}\\{y''\\} = s^2 Y(s) - sy(0) - y'(0)$。",
    ),
    intro: t(
      "Take $y = e^{3t}$, so $Y(s) = \\frac{1}{s - 3}$ and $y(0) = 1$. The rule $\\mathcal{L}\\{y'\\} = sY(s) - y(0)$ gives $\\frac{s}{s - 3} - 1 = \\frac{3}{s - 3}$.\n\nCheck: $y' = 3e^{3t}$, whose transform is $\\frac{3}{s - 3}$ straight from the table.\n\nIn this lesson we transform derivatives and watch the initial values appear.",
      "取 $y = e^{3t}$，则 $Y(s) = \\frac{1}{s - 3}$，$y(0) = 1$。法则 $\\mathcal{L}\\{y'\\} = sY(s) - y(0)$ 给出 $\\frac{s}{s - 3} - 1 = \\frac{3}{s - 3}$。\n\n检验：$y' = 3e^{3t}$，查表直接得其变换为 $\\frac{3}{s - 3}$。\n\n本课我们对导数做变换，看初始值如何出现。",
    ),
    prerequisites: ["the-smoothness-property-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "second-derivative-initial-value-formula",
        title: t("Initial condition polynomial from second derivative transform", "二阶导数变换中的初值多项式"),
        explanation: t(
          "Transforming a derivative brings in the initial values, so the initial conditions appear as a polynomial in the transformed equation. For an IVP with $y(0) = y_0$ and $y'(0) = y_1$, the Laplace transform satisfies $s^2 Y(s) - \\mathcal{L}\\{y''\\} = y_0 s + y_1$. At $s = 1$, this polynomial equals $y_0 + y_1$.\n\n> **Watch out.** $\\mathcal{L}\\{y''\\}$ subtracts both $sy(0)$ and $y'(0)$, so moving them across gives two plus signs. With $y(0) = 3$ and $y'(0) = 5$, $P(1) = 3 + 5 = 8$, not $3 - 5 = -2$.",
          "对导数做变换会引入初始值，所以初始条件在变换后的方程中以多项式的形式出现。在初值问题 $y(0) = y_0$ 和 $y'(0) = y_1$ 中，导数变换公式为 $\\mathcal{L}\\{y''\\} = s^2 Y(s) - y_0 s - y_1$。因此 $s^2 Y(s) - \\mathcal{L}\\{y''\\} = y_0 s + y_1$，在 $s = 1$ 处该值等于 $y_0 + y_1$。\n\n> **注意。** $\\mathcal{L}\\{y''\\}$ 同时减去 $sy(0)$ 与 $y'(0)$，移项后两项都带加号。当 $y(0) = 3$，$y'(0) = 5$ 时，$P(1) = 3 + 5 = 8$，不是 $3 - 5 = -2$。",
        ),
        generate(rng: Rng): Problem {
          const y0 = rng.int(2, 25);
          const y1 = rng.int(2, 25);
          const ans = y0 + y1;
          return numberProblem({
            prompt: t(
              `Suppose $y(t)$ satisfies initial conditions $y(0) = ${y0}$ and $y'(0) = ${y1}$. Define the polynomial $P(s) = s^2 Y(s) - \\mathcal{L}\\{y''(t)\\}$. Evaluate $P(1)$.`,
              `设函数 $y(t)$ 满足初始条件 $y(0) = ${y0}$ 与 $y'(0) = ${y1}$。定义多项式 $P(s) = s^2 Y(s) - \\mathcal{L}\\{y''(t)\\}$。计算 $P(1)$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                y0 - y1,
                "That gives $y'(0)$ a minus sign; both initial terms move across with a plus sign.",
                "这给 $y'(0)$ 加了负号；两个初值项移项后都带加号。",
              ),
              why(y0, "That keeps only $sy(0)$ and forgets $y'(0)$.", "这只保留了 $sy(0)$，忘了 $y'(0)$。"),
              why(y1, "That keeps only $y'(0)$ and forgets $sy(0)$.", "这只保留了 $y'(0)$，忘了 $sy(0)$。"),
            ]),
            solution: walked(
              [
                [["Transform the second derivative", "变换二阶导数"], t("", ""), [`\\mathcal{L}\\{y''\\} = s^2Y(s) - sy(0) - y'(0)`]],
                [["Rearrange", "移项"], t("", ""), [`P(s) = s^2Y(s) - \\mathcal{L}\\{y''\\} = sy(0) + y'(0) = ${y0}s + ${y1}`]],
                [["Evaluate at s = 1", "代入 s = 1"], t("", ""), [`P(1) = ${y0} + ${y1} = ${ans}`]],
              ],
              t(
                `Try $y = ${y0} + ${y1}t$, which has these initial values: $y'' = 0$, so $\\mathcal{L}\\{y''\\} = 0$, while $s^2Y = s^2\\left(\\frac{${y0}}{s} + \\frac{${y1}}{s^2}\\right) = ${y0}s + ${y1}$, which is $${ans}$ at $s = 1$.`,
                `取具有这些初值的 $y = ${y0} + ${y1}t$：$y'' = 0$，所以 $\\mathcal{L}\\{y''\\} = 0$，而 $s^2Y = s^2\\left(\\frac{${y0}}{s} + \\frac{${y1}}{s^2}\\right) = ${y0}s + ${y1}$，在 $s = 1$ 处为 $${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-transform-of-a-second-derivative-at-a-point",
        title: t("The transform of a second derivative at a point", "二阶导数的变换在某点的值"),
        explanation: t(
          "Applying the derivative rule twice gives\n\n$$\\mathcal{L}\\{y''\\}(s) = s^{2}Y(s) - sy(0) - y'(0).$$\n\nThe initial position is multiplied by $s$, the initial velocity is not. For example, if $Y(2) = 3$, $y(0) = 1$ and $y'(0) = 4$, then $\\mathcal{L}\\{y''\\}(2) = 12 - 2 - 4 = 6$.\n\n> **Watch out.** Multiplying the velocity by $s$ instead of the position is the usual slip. In the example it gives $12 - 1 - 8 = 3$ instead of $6$.",
          "两次应用导数法则得\n\n$$\\mathcal{L}\\{y''\\}(s) = s^{2}Y(s) - sy(0) - y'(0).$$\n\n初始位置乘以 $s$，初始速度不乘。例如，若 $Y(2) = 3$，$y(0) = 1$，$y'(0) = 4$，则 $\\mathcal{L}\\{y''\\}(2) = 12 - 2 - 4 = 6$。\n\n> **注意。** 常见错误是把速度而不是位置乘以 $s$。在上例中这会得到 $12 - 1 - 8 = 3$，而不是 $6$。",
        ),
        generate(rng: Rng): Problem {
          const s0 = rng.int(2, 6);
          const Y = Q.of(rng.int(1, 12), rng.pick([1, 2, 4]));
          const y0 = rng.int(-5, 8) || 3;
          const v0 = rng.int(-5, 8);
          const Ys2 = Y.mul(Q.of(s0 * s0));
          const ans = Ys2.sub(Q.of(s0 * y0 + v0));
          const first = Y.mul(Q.of(s0)).sub(Q.of(y0));
          return numberProblem({
            prompt: t(
              `$Y(s) = \\mathcal{L}\\{y\\}$ satisfies $Y(${s0}) = ${Y.toLatex()}$, and $y(0) = ${y0}$, $y'(0) = ${v0}$. Find $\\mathcal{L}\\{y''\\}(${s0})$.`,
              `$Y(s) = \\mathcal{L}\\{y\\}$ 满足 $Y(${s0}) = ${Y.toLatex()}$，且 $y(0) = ${y0}$，$y'(0) = ${v0}$。求 $\\mathcal{L}\\{y''\\}(${s0})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Ys2.sub(Q.of(y0 + s0 * v0)),
                "That multiplies the initial velocity by $s$; it is the initial position that gets the factor $s$.",
                "这把初速度乘了 $s$；应乘 $s$ 的是初始位置。",
              ),
              why(Ys2.sub(Q.of(y0 + v0)), "That forgets to multiply $y(0)$ by $s$.", "这忘了把 $y(0)$ 乘以 $s$。"),
              why(
                first,
                "That is $\\mathcal{L}\\{y'\\}$; the second derivative needs the rule applied twice.",
                "这是 $\\mathcal{L}\\{y'\\}$；二阶导数要把法则用两次。",
              ),
            ]),
            solution: walked(
              [
                [["Write the rule", "写出法则"], t("", ""), [`\\mathcal{L}\\{y''\\}(s) = s^2Y(s) - sy(0) - y'(0)`]],
                [
                  ["Substitute", "代入"],
                  t("", ""),
                  [
                    `\\mathcal{L}\\{y''\\}(${s0}) = ${s0}^2 \\cdot ${Y.toLatex()} - ${s0} \\cdot ${inP(y0)} - ${inP(v0)} = ${ans.toLatex()}`,
                  ],
                ],
              ],
              t(
                `Apply the first-derivative rule twice: $\\mathcal{L}\\{y'\\}(${s0}) = ${s0} \\cdot ${Y.toLatex()} - ${inP(y0)} = ${first.toLatex()}$, then $\\mathcal{L}\\{y''\\}(${s0}) = ${s0} \\cdot ${parQ(first)} - ${inP(v0)} = ${ans.toLatex()}$.`,
                `把一阶导数法则用两次：$\\mathcal{L}\\{y'\\}(${s0}) = ${s0} \\cdot ${Y.toLatex()} - ${inP(y0)} = ${first.toLatex()}$，再得 $\\mathcal{L}\\{y''\\}(${s0}) = ${s0} \\cdot ${parQ(first)} - ${inP(v0)} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.9 Laplace Transforms of Integrals
  {
    id: "laplace-transforms-of-integrals",
    title: t("Laplace Transforms of Integrals", "积分的拉普拉斯变换"),
    summary: t(
      "Integrating in time corresponds to dividing by $s$: $\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$.",
      "时域中的积分对应于除以 $s$：$\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$。",
    ),
    intro: t(
      "Take $f(t) = e^{2t}$, so $F(s) = \\frac{1}{s - 2}$. Its running integral $\\int_0^t e^{2\\tau}\\,d\\tau$ has transform $\\frac{F(s)}{s} = \\frac{1}{s(s - 2)}$, which is $\\frac{1}{8}$ at $s = 4$.\n\nCheck: the running integral is $\\frac{1}{2}\\left(e^{2t} - 1\\right)$, whose transform at $s = 4$ is $\\frac{1}{2}\\left(\\frac{1}{2} - \\frac{1}{4}\\right) = \\frac{1}{8}$.\n\nIn this lesson we transform integrals by dividing by $s$.",
      "取 $f(t) = e^{2t}$，则 $F(s) = \\frac{1}{s - 2}$。它的累积积分 $\\int_0^t e^{2\\tau}\\,d\\tau$ 的变换为 $\\frac{F(s)}{s} = \\frac{1}{s(s - 2)}$，在 $s = 4$ 处为 $\\frac{1}{8}$。\n\n检验：累积积分等于 $\\frac{1}{2}\\left(e^{2t} - 1\\right)$，它在 $s = 4$ 处的变换为 $\\frac{1}{2}\\left(\\frac{1}{2} - \\frac{1}{4}\\right) = \\frac{1}{8}$。\n\n本课我们通过除以 $s$ 来变换积分。",
    ),
    prerequisites: ["laplace-transforms-of-derivatives"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "transform-of-running-integral",
        title: t("Applying the integral theorem of Laplace transforms", "应用拉普拉斯变换的积分定理"),
        explanation: t(
          "Integrating a function from zero corresponds to dividing its transform by the variable, the reverse of what differentiating does. For $g(t) = \\int_0^t c e^{a\\tau}\\,d\\tau$, the integral theorem states $\\mathcal{L}\\{g(t)\\} = \\frac{1}{s} \\mathcal{L}\\{c e^{at}\\} = \\frac{c}{s(s - a)}$. Thus $s(s - a) \\mathcal{L}\\{g(t)\\} = c$.\n\n> **Watch out.** Integrating divides by $s$; differentiating multiplies. For $\\int_0^t 6e^{\\tau}\\,d\\tau$ at $s = 3$: $\\frac{6}{3 \\cdot 2} = 1$, not $\\frac{6 \\cdot 3}{2} = 9$.",
          "从零开始对函数积分对应于把它的变换除以变量，这与求导的作用正好相反。对于 $g(t) = \\int_0^t c e^{a\\tau}\\,d\\tau$，由积分定理可知 $\\mathcal{L}\\{g(t)\\} = \\frac{1}{s} \\mathcal{L}\\{c e^{at}\\} = \\frac{c}{s(s - a)}$。因此 $s(s - a) \\mathcal{L}\\{g(t)\\} = c$。\n\n> **注意。** 积分是除以 $s$，求导才是乘以 $s$。对 $\\int_0^t 6e^{\\tau}\\,d\\tau$ 在 $s = 3$ 处：$\\frac{6}{3 \\cdot 2} = 1$，不是 $\\frac{6 \\cdot 3}{2} = 9$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 10);
          const c = rng.int(2, 35);
          const k = rng.int(1, 5);
          const s0 = a + k;
          const ans = Q.of(c, s0 * k);
          const invK = k === 1 ? "1" : `\\frac{1}{${k}}`;
          return numberProblem({
            prompt: t(
              `Let $g(t) = \\int_0^t ${c} e^{${a}\\tau}\\,d\\tau$ and let $G(s) = \\mathcal{L}\\{g(t)\\}$. Find $G(${s0})$.`,
              `设 $g(t) = \\int_0^t ${c} e^{${a}\\tau}\\,d\\tau$，$G(s) = \\mathcal{L}\\{g(t)\\}$。求 $G(${s0})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(c, k),
                "That is the transform of the integrand; the integral divides it by $s$.",
                "这是被积函数的变换；积分还要再除以 $s$。",
              ),
              why(
                Q.of(c * s0, k),
                "That multiplies by $s$, which is what differentiating does; integrating divides.",
                "这乘了 $s$，那是求导的做法；积分应除以 $s$。",
              ),
              why(Q.of(c, s0), "That transforms the constant $c$ and drops the exponential.", "这只变换了常数 $c$，丢掉了指数函数。"),
            ]),
            solution: walked(
              [
                [["Transform the integrand", "变换被积函数"], t("", ""), [`\\mathcal{L}\\{${c}e^{${a}t}\\} = \\frac{${c}}{s - ${a}}`]],
                [
                  ["Divide by s", "除以 s"],
                  t("", ""),
                  [`G(s) = \\frac{${c}}{s(s - ${a})}`, `G(${s0}) = \\frac{${c}}{${s0} \\cdot ${k}} = ${ans.toLatex()}`],
                ],
              ],
              t(
                `Integrating first, $g(t) = \\frac{${c}}{${a}}\\left(e^{${a}t} - 1\\right)$, whose transform at $s = ${s0}$ is $\\frac{${c}}{${a}}\\left(${invK} - \\frac{1}{${s0}}\\right) = ${ans.toLatex()}$.`,
                `先积分，$g(t) = \\frac{${c}}{${a}}\\left(e^{${a}t} - 1\\right)$，它在 $s = ${s0}$ 处的变换为 $\\frac{${c}}{${a}}\\left(${invK} - \\frac{1}{${s0}}\\right) = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-transform-of-an-accumulated-integral",
        title: t("The transform of an accumulated integral", "累积积分的变换"),
        explanation: t(
          "Integration from $0$ to $t$ divides the transform by $s$: $\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$. Combined with the shift rule for $\\tau e^{a\\tau}$,\n\n$$\\mathcal{L}\\left\\{\\int_0^t \\tau e^{a\\tau}\\,d\\tau\\right\\} = \\frac{1}{s(s - a)^{2}}.$$\n\nThis avoids integrating by parts before transforming.\n\n> **Watch out.** Divide by $s$ exactly once, and keep the square that the factor $\\tau$ brings. For $\\int_0^t \\tau e^{\\tau}\\,d\\tau$ at $s = 2$: $\\frac{1}{2 \\cdot 1^2} = \\frac{1}{2}$, not $\\frac{1}{1^2} = 1$.",
          "从 $0$ 到 $t$ 的积分使变换除以 $s$：$\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$。结合 $\\tau e^{a\\tau}$ 的平移法则，\n\n$$\\mathcal{L}\\left\\{\\int_0^t \\tau e^{a\\tau}\\,d\\tau\\right\\} = \\frac{1}{s(s - a)^{2}}.$$\n\n这样就不必在变换前先做分部积分。\n\n> **注意。** 恰好除以一次 $s$，并保留因子 $\\tau$ 带来的平方。对 $\\int_0^t \\tau e^{\\tau}\\,d\\tau$ 在 $s = 2$ 处：$\\frac{1}{2 \\cdot 1^2} = \\frac{1}{2}$，不是 $\\frac{1}{1^2} = 1$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-4, 4) || 1;
          const s0 = Math.max(a, 0) + rng.int(1, 4);
          const c = rng.int(1, 9);
          const sq = (s0 - a) ** 2;
          const ans = Q.of(c, s0 * sq);
          const ea = co(a);
          const cc = c === 1 ? "" : `${c}`;
          return numberProblem({
            prompt: t(
              `Find $\\mathcal{L}\\left\\{\\int_0^t ${cc}\\tau e^{${ea}\\tau}\\,d\\tau\\right\\}$ at $s = ${s0}$.`,
              `求 $\\mathcal{L}\\left\\{\\int_0^t ${cc}\\tau e^{${ea}\\tau}\\,d\\tau\\right\\}$ 在 $s = ${s0}$ 处的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(c, sq),
                "That is the transform of the integrand; the integral from $0$ to $t$ divides it by $s$.",
                "这是被积函数的变换；从 $0$ 到 $t$ 的积分还要除以 $s$。",
              ),
              why(
                Q.of(c, s0 * (s0 - a)),
                "That leaves out the square that the factor $\\tau$ brings to $s - a$.",
                "这漏掉了因子 $\\tau$ 给 $s - a$ 带来的平方。",
              ),
              why(
                Q.of(c, s0 * s0 * sq),
                "That divides by $s$ twice; one integral divides by $s$ once.",
                "这除了两次 $s$；一次积分只除以一次 $s$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the integrand", "变换被积函数"],
                  t(
                    `Multiplying by $e^{${ea}\\tau}$ shifts $\\mathcal{L}\\{\\tau\\} = \\frac{1}{s^2}$.`,
                    `乘以 $e^{${ea}\\tau}$ 使 $\\mathcal{L}\\{\\tau\\} = \\frac{1}{s^2}$ 平移。`,
                  ),
                  [`\\mathcal{L}\\{${cc}\\tau e^{${ea}\\tau}\\} = \\frac{${c}}{(s ${signed(-a)})^2}`],
                ],
                [
                  ["Divide by s and evaluate", "除以 s 并求值"],
                  t("", ""),
                  [`\\frac{${c}}{s(s ${signed(-a)})^2} \\text{ at } s = ${s0}: \\quad \\frac{${c}}{${s0} \\cdot ${sq}} = ${ans.toLatex()}`],
                ],
              ],
              t(
                `Swapping the order of integration, $\\int_0^\\infty e^{-st}\\int_0^t g(\\tau)\\,d\\tau\\,dt = \\int_0^\\infty g(\\tau)\\frac{e^{-s\\tau}}{s}\\,d\\tau$, which is $\\frac{1}{s}$ times the transform of $g$: $${Q.of(1, s0).toLatex()} \\cdot ${Q.of(c, sq).toLatex()} = ${ans.toLatex()}$.`,
                `交换积分次序，$\\int_0^\\infty e^{-st}\\int_0^t g(\\tau)\\,d\\tau\\,dt = \\int_0^\\infty g(\\tau)\\frac{e^{-s\\tau}}{s}\\,d\\tau$，即 $g$ 的变换乘以 $\\frac{1}{s}$：$${Q.of(1, s0).toLatex()} \\cdot ${Q.of(c, sq).toLatex()} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.10 The First Shifting Theorem of Laplace Transforms
  {
    id: "the-first-shifting-theorem-of-laplace-transforms",
    title: t("The First Shifting Theorem of Laplace Transforms", "拉普拉斯变换的第一位移定理"),
    summary: t(
      "Multiplying by $e^{at}$ shifts the transform by $a$: $\\mathcal{L}\\{e^{at} f(t)\\} = F(s - a)$.",
      "乘以 $e^{at}$ 使变换平移 $a$：$\\mathcal{L}\\{e^{at} f(t)\\} = F(s - a)$。",
    ),
    intro: t(
      "Take $e^{-2t}\\cos 3t$. Since $\\mathcal{L}\\{\\cos 3t\\} = \\frac{s}{s^2 + 9}$, the factor $e^{-2t}$ replaces $s$ by $s + 2$: $\\mathcal{L}\\{e^{-2t}\\cos 3t\\} = \\frac{s + 2}{(s + 2)^2 + 9}$, which is $\\frac{3}{18} = \\frac{1}{6}$ at $s = 1$.\n\nCheck: at $s = 1$ the integrand is $e^{-3t}\\cos 3t$, and $\\int_0^\\infty e^{-3t}\\cos 3t\\,dt$ is $\\mathcal{L}\\{\\cos 3t\\}$ at $s = 3$, which is $\\frac{3}{9 + 9} = \\frac{1}{6}$.\n\nIn this lesson we use the first shifting theorem to transform and invert products with exponentials.",
      "取 $e^{-2t}\\cos 3t$。因为 $\\mathcal{L}\\{\\cos 3t\\} = \\frac{s}{s^2 + 9}$，因子 $e^{-2t}$ 把 $s$ 换成 $s + 2$：$\\mathcal{L}\\{e^{-2t}\\cos 3t\\} = \\frac{s + 2}{(s + 2)^2 + 9}$，在 $s = 1$ 处为 $\\frac{3}{18} = \\frac{1}{6}$。\n\n检验：在 $s = 1$ 处被积函数为 $e^{-3t}\\cos 3t$，而 $\\int_0^\\infty e^{-3t}\\cos 3t\\,dt$ 就是 $\\mathcal{L}\\{\\cos 3t\\}$ 在 $s = 3$ 处的值 $\\frac{3}{9 + 9} = \\frac{1}{6}$。\n\n本课我们用第一位移定理变换和反演与指数函数的乘积。",
    ),
    prerequisites: ["laplace-transforms-of-integrals"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-shift-rule",
        title: t("Applying the first shifting theorem to damped sine", "对指数衰减正弦应用第一位移定理"),
        explanation: t(
          "Multiplying by an exponential in time shifts the transform, replacing the variable by the variable minus the rate. For $f(t) = e^{at} \\sin(\\omega t)$, $\\mathcal{L}\\{f(t)\\} = \\frac{\\omega}{(s - a)^2 + \\omega^2} = \\frac{\\omega}{s^2 - 2as + (a^2 + \\omega^2)}$. The constant term in the denominator is $a^2 + \\omega^2$.\n\n> **Watch out.** Expanding $(s - a)^2$ adds $a^2$ to the constant term. For $e^{2t}\\sin 3t$ the denominator is $s^2 - 4s + 13$, not $s^2 + 9$.",
          "在时间上乘以一个指数函数会使变换平移，把变量换成变量减去增长率。对于 $f(t) = e^{at} \\sin(\\omega t)$，$\\mathcal{L}\\{f(t)\\} = \\frac{\\omega}{(s - a)^2 + \\omega^2} = \\frac{\\omega}{s^2 - 2as + (a^2 + \\omega^2)}$。分母中的常数项为 $a^2 + \\omega^2$。\n\n> **注意。** 展开 $(s - a)^2$ 会给常数项加上 $a^2$。对 $e^{2t}\\sin 3t$，分母是 $s^2 - 4s + 13$，不是 $s^2 + 9$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 10);
          const omega = rng.int(2, 15);
          const w2 = omega * omega;
          const ans = a * a + w2;
          return numberProblem({
            prompt: t(
              `Let $F(s) = \\mathcal{L}\\{e^{${co(a)}t} \\sin(${omega}t)\\}$. Find the constant term in the denominator polynomial of $F(s)$ when written in standard form $\\frac{N(s)}{s^2 + p s + q}$.`,
              `设 $F(s) = \\mathcal{L}\\{e^{${co(a)}t} \\sin(${omega}t)\\}$。当将其写为标准分式 $\\frac{N(s)}{s^2 + p s + q}$ 时，求分母多项式的常数项 $q$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                w2,
                `That forgets the shift; the factor $e^{${co(a)}t}$ replaces $s$ by $s - ${a}$, which adds $${a}^2$.`,
                `这忘了平移；因子 $e^{${co(a)}t}$ 把 $s$ 换成 $s - ${a}$，常数项因此多出 $${a}^2$。`,
              ),
              why(
                a * a + omega,
                "That adds $\\omega$ instead of $\\omega^2$; the sine transform has $\\omega^2$ in its denominator.",
                "这加的是 $\\omega$ 而不是 $\\omega^2$；正弦变换的分母中是 $\\omega^2$。",
              ),
              why(
                -2 * a,
                "That is $p$, the coefficient of $s$; the question asks for the constant term.",
                "这是 $s$ 的系数 $p$；题目问的是常数项。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Shift the sine transform", "平移正弦变换"],
                  t(`The factor $e^{${co(a)}t}$ replaces $s$ by $s - ${a}$.`, `因子 $e^{${co(a)}t}$ 把 $s$ 换成 $s - ${a}$。`),
                  [`\\mathcal{L}\\{\\sin ${omega}t\\} = \\frac{${omega}}{s^2 + ${w2}}`, `F(s) = \\frac{${omega}}{(s - ${a})^2 + ${w2}}`],
                ],
                [
                  ["Expand the denominator", "展开分母"],
                  t("", ""),
                  [`(s - ${a})^2 + ${w2} = s^2 - ${2 * a}s + ${a * a} + ${w2} = s^2 - ${2 * a}s + ${ans}`],
                ],
              ],
              t(
                `The denominator vanishes at $s = ${a} \\pm ${omega}i$, and the product of these roots, $${a}^2 + ${omega}^2 = ${ans}$, is the constant term.`,
                `分母在 $s = ${a} \\pm ${omega}i$ 处为零，两根之积 $${a}^2 + ${omega}^2 = ${ans}$ 正是常数项。`,
              ),
            ),
          });
        },
      },
      {
        id: "inverting-by-completing-the-square",
        title: t("Inverting by completing the square", "配方后求逆变换"),
        explanation: t(
          "When the denominator $s^{2} + ps + q$ has no real roots, complete the square: $s^{2} + ps + q = (s - a)^{2} + b^{2}$ with $a = -\\frac{p}{2}$ and $b^{2} = q - a^{2}$. The first shifting theorem then gives\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{c}{(s - a)^{2} + b^{2}}\\right\\} = \\frac{c}{b}e^{at}\\sin bt.$$\n\nThe factor $\\frac{1}{b}$ is needed because $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ carries $b$ in its numerator.\n\n> **Watch out.** Divide by $b$, not by $b^2$. For $\\frac{6}{(s + 1)^2 + 9}$ the inverse is $2e^{-t}\\sin 3t$, not $\\frac{2}{3}e^{-t}\\sin 3t$.",
          "当分母 $s^{2} + ps + q$ 没有实根时，先配方：$s^{2} + ps + q = (s - a)^{2} + b^{2}$，其中 $a = -\\frac{p}{2}$，$b^{2} = q - a^{2}$。第一平移定理给出\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{c}{(s - a)^{2} + b^{2}}\\right\\} = \\frac{c}{b}e^{at}\\sin bt.$$\n\n需要因子 $\\frac{1}{b}$，因为 $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ 的分子中带有 $b$。\n\n> **注意。** 要除以 $b$，不是 $b^2$。$\\frac{6}{(s + 1)^2 + 9}$ 的逆变换是 $2e^{-t}\\sin 3t$，不是 $\\frac{2}{3}e^{-t}\\sin 3t$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-4, 4) || -1;
          const b = rng.int(2, 5);
          const c = rng.int(1, 12);
          const p = -2 * a;
          const q = a * a + b * b;
          const ans = Q.of(c, b);
          const ea = co(a);
          const bt = `${b}t`;
          return numberProblem({
            prompt: t(
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s^{2} ${signed(p)}s + ${q}}\\right\\} = Ke^{${ea}t}\\sin ${bt}$. Find $K$.`,
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s^{2} ${signed(p)}s + ${q}}\\right\\} = Ke^{${ea}t}\\sin ${bt}$。求 $K$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                c,
                `That leaves out the $\\frac{1}{${b}}$; the sine pair needs $${b}$ in the numerator.`,
                `这漏掉了 $\\frac{1}{${b}}$；正弦变换对的分子需要 $${b}$。`,
              ),
              why(
                Q.of(c, b * b),
                `That divides by $b^2 = ${b * b}$; the sine pair has $b$ in its numerator, not $b^2$.`,
                `这除以了 $b^2 = ${b * b}$；正弦变换对的分子是 $b$，不是 $b^2$。`,
              ),
              why(c * b, `That multiplies by $${b}$ instead of dividing by it.`, `这乘以了 $${b}$，而应除以它。`),
            ]),
            solution: walked(
              [
                [
                  ["Complete the square", "配方"],
                  t("", ""),
                  [`s^2 ${signed(p)}s + ${q} = (s ${signed(-a)})^2 + ${b * b} = (s ${signed(-a)})^2 + ${b}^2`],
                ],
                [
                  ["Match the shifted sine pair", "凑出平移后的正弦变换对"],
                  t(`Write the numerator as a multiple of $${b}$.`, `把分子写成 $${b}$ 的倍数。`),
                  [
                    `\\frac{${c}}{(s ${signed(-a)})^2 + ${b}^2} = \\frac{${c}}{${b}} \\cdot \\frac{${b}}{(s ${signed(-a)})^2 + ${b}^2}`,
                    `K = \\frac{${c}}{${b}}${fr(c, b)}`,
                  ],
                ],
              ],
              t(
                `Transforming back, $Ke^{${ea}t}\\sin ${bt}$ has transform $K \\cdot \\frac{${b}}{(s ${signed(-a)})^2 + ${b}^2}$, and $${ans.toLatex()} \\cdot ${b} = ${c}$ is the given numerator.`,
                `反过来变换，$Ke^{${ea}t}\\sin ${bt}$ 的变换为 $K \\cdot \\frac{${b}}{(s ${signed(-a)})^2 + ${b}^2}$，而 $${ans.toLatex()} \\cdot ${b} = ${c}$ 正是给定的分子。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.11 The Second Shifting Theorem of Laplace Transforms
  {
    id: "the-second-shifting-theorem-of-laplace-transforms",
    title: t("The Second Shifting Theorem of Laplace Transforms", "拉普拉斯变换的第二位移定理"),
    summary: t(
      "Delaying a signal by $c$ and switching it on with a step function multiplies the transform by $e^{-cs}$: $\\mathcal{L}\\{u(t - c)g(t - c)\\} = e^{-cs}G(s)$.",
      "把信号延迟 $c$ 并乘以阶跃函数，其变换乘以 $e^{-cs}$：$\\mathcal{L}\\{u(t - c)g(t - c)\\} = e^{-cs}G(s)$。",
    ),
    intro: t(
      "Take $f(t) = (t - 2)u(t - 2)$, the ramp $t$ delayed by $2$. Since $\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$, the delay multiplies by $e^{-2s}$: $\\mathcal{L}\\{f\\} = \\frac{e^{-2s}}{s^2}$.\n\nCheck: directly, $\\int_2^\\infty (t - 2)e^{-st}\\,dt$ becomes $e^{-2s}\\int_0^\\infty xe^{-sx}\\,dx = \\frac{e^{-2s}}{s^2}$ after substituting $x = t - 2$.\n\nIn this lesson we transform and invert delayed functions with the second shifting theorem.",
      "取 $f(t) = (t - 2)u(t - 2)$，即延迟 $2$ 的斜坡 $t$。因为 $\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$，延迟使变换乘以 $e^{-2s}$：$\\mathcal{L}\\{f\\} = \\frac{e^{-2s}}{s^2}$。\n\n检验：直接计算，代换 $x = t - 2$ 后 $\\int_2^\\infty (t - 2)e^{-st}\\,dt$ 变为 $e^{-2s}\\int_0^\\infty xe^{-sx}\\,dx = \\frac{e^{-2s}}{s^2}$。\n\n本课我们用第二位移定理变换和反演延迟的函数。",
    ),
    prerequisites: ["the-first-shifting-theorem-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "time-delayed-unit-step-transform",
        title: t("Applying the second shifting theorem to delayed linear ramp", "对延迟线性斜坡应用第二位移定理"),
        explanation: t(
          "Delaying a function by switching it on later multiplies its transform by a decaying exponential that records the delay. For $f(t) = k u(t - c)(t - c)$, the second shifting theorem yields $\\mathcal{L}\\{f(t)\\} = k e^{-cs} \\mathcal{L}\\{t\\} = \\frac{k e^{-cs}}{s^2}$. Thus $s^2 e^{cs} \\mathcal{L}\\{f(t)\\} = k$.\n\n> **Watch out.** The delay only brings in $e^{-cs}$; the rest is the transform of the undelayed function, factorial included. $\\mathcal{L}\\{u(t - 3)(t - 3)^2\\} = \\frac{2e^{-3s}}{s^3}$, so $s^3e^{3s}$ times it is $2$, not $1$.",
          "把函数推迟开启会使它的变换乘以一个记录延迟的衰减指数函数。对于 $f(t) = k u(t - c)(t - c)$，应用第二位移定理得 $\\mathcal{L}\\{f(t)\\} = k e^{-cs} \\mathcal{L}\\{t\\} = \\frac{k e^{-cs}}{s^2}$。因此 $s^2 e^{cs} \\mathcal{L}\\{f(t)\\} = k$。\n\n> **注意。** 延迟只带来 $e^{-cs}$；其余部分是未延迟函数的变换，阶乘也要保留。$\\mathcal{L}\\{u(t - 3)(t - 3)^2\\} = \\frac{2e^{-3s}}{s^3}$，所以乘以 $s^3e^{3s}$ 得 $2$，不是 $1$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(1, 8);
          const k = rng.int(2, 35);
          const ans = 2 * k;
          const cs = `${co(c)}s`;
          return numberProblem({
            prompt: t(
              `Let $f(t) = ${k} u(t - ${c})(t - ${c})^2$. Evaluate the expression $s^3 e^{${cs}} \\mathcal{L}\\{f(t)\\}$.`,
              `设 $f(t) = ${k} u(t - ${c})(t - ${c})^2$。计算表达式 $s^3 e^{${cs}} \\mathcal{L}\\{f(t)\\}$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                k,
                "That forgets the $2!$ in $\\mathcal{L}\\{t^2\\} = \\frac{2!}{s^3}$.",
                "这忘了 $\\mathcal{L}\\{t^2\\} = \\frac{2!}{s^3}$ 中的 $2!$。",
              ),
              why(
                6 * k,
                "That uses $3! = 6$; the power of $t$ is $2$, so the factor is $2! = 2$.",
                "这用了 $3! = 6$；$t$ 的次数是 $2$，因子应为 $2! = 2$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Identify the undelayed function", "找出未延迟的函数"],
                  t("", ""),
                  [`f(t) = u(t - ${c})g(t - ${c}), \\qquad g(t) = ${k}t^2`],
                ],
                [
                  ["Transform with the delay", "带延迟取变换"],
                  t("", ""),
                  [`G(s) = ${k} \\cdot \\frac{2!}{s^3} = \\frac{${ans}}{s^3}`, `\\mathcal{L}\\{f\\} = \\frac{${ans}e^{-${cs}}}{s^3}`],
                ],
                [["Multiply", "相乘"], t("", ""), [`s^3e^{${cs}} \\cdot \\frac{${ans}e^{-${cs}}}{s^3} = ${ans}`]],
              ],
              t(
                `Substituting $x = t - ${c}$: $\\int_{${c}}^\\infty ${k}(t - ${c})^2e^{-st}\\,dt = ${k}e^{-${cs}}\\int_0^\\infty x^2e^{-sx}\\,dx = ${k}e^{-${cs}} \\cdot \\frac{2}{s^3}$, so the expression is $${k} \\cdot 2 = ${ans}$.`,
                `代换 $x = t - ${c}$：$\\int_{${c}}^\\infty ${k}(t - ${c})^2e^{-st}\\,dt = ${k}e^{-${cs}}\\int_0^\\infty x^2e^{-sx}\\,dx = ${k}e^{-${cs}} \\cdot \\frac{2}{s^3}$，所以表达式等于 $${k} \\cdot 2 = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "evaluating-a-delayed-inverse-transform",
        title: t("Evaluating a delayed inverse transform", "求延迟逆变换的值"),
        explanation: t(
          "The factor $e^{-cs}$ delays a function by $c$: $\\mathcal{L}^{-1}\\{e^{-cs}F(s)\\} = f(t - c)u(t - c)$. So\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{ke^{-cs}}{s^{2}}\\right\\} = k(t - c)u(t - c),$$\n\nwhich is $0$ before $t = c$ and a ramp starting from $0$ afterwards. Forgetting to replace $t$ by $t - c$ gives $kt$ instead.\n\n> **Watch out.** Before $t = c$ the step is off and the value is $0$. For $\\mathcal{L}^{-1}\\left\\{\\frac{3e^{-2s}}{s^2}\\right\\}$ the value at $t = 1$ is $0$, and at $t = 5$ it is $3 \\cdot 3 = 9$, not $3 \\cdot 5 = 15$.",
          "因子 $e^{-cs}$ 使函数延迟 $c$：$\\mathcal{L}^{-1}\\{e^{-cs}F(s)\\} = f(t - c)u(t - c)$。所以\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{ke^{-cs}}{s^{2}}\\right\\} = k(t - c)u(t - c),$$\n\n它在 $t = c$ 之前为 $0$，之后是从 $0$ 开始的斜坡。忘记把 $t$ 换成 $t - c$ 会得到 $kt$。\n\n> **注意。** 在 $t = c$ 之前阶跃未接通，函数值为 $0$。$\\mathcal{L}^{-1}\\left\\{\\frac{3e^{-2s}}{s^2}\\right\\}$ 在 $t = 1$ 处为 $0$，在 $t = 5$ 处为 $3 \\cdot 3 = 9$，不是 $3 \\cdot 5 = 15$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(2, 9);
          const c = rng.int(1, 6);
          const before = c >= 2 && !rng.bool(0.8);
          const t1 = before ? rng.int(1, c - 1) : c + rng.int(1, 6);
          const ans = before ? 0 : k * (t1 - c);
          const cs = `${co(c)}s`;
          return numberProblem({
            prompt: t(
              `Let $f(t) = \\mathcal{L}^{-1}\\left\\{\\frac{${k}e^{-${cs}}}{s^{2}}\\right\\}$. Find $f(${t1})$.`,
              `设 $f(t) = \\mathcal{L}^{-1}\\left\\{\\frac{${k}e^{-${cs}}}{s^{2}}\\right\\}$。求 $f(${t1})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                k * t1,
                `That forgets the delay; $e^{-${cs}}$ replaces $t$ by $t - ${c}$.`,
                `这忘了延迟；$e^{-${cs}}$ 把 $t$ 换成 $t - ${c}$。`,
              ),
              why(
                k * (t1 + c),
                `That shifts the wrong way; a delay replaces $t$ by $t - ${c}$, not $t + ${c}$.`,
                `这平移方向反了；延迟把 $t$ 换成 $t - ${c}$，不是 $t + ${c}$。`,
              ),
              why(
                k * Math.abs(t1 - c),
                `That ignores the step; before $t = ${c}$ it is $0$, so the function is $0$.`,
                `这忽略了阶跃；在 $t = ${c}$ 之前它为 $0$，函数值也为 $0$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Invert without the delay", "先不考虑延迟求逆"],
                  t("", ""),
                  [`\\mathcal{L}^{-1}\\left\\{\\frac{${k}}{s^2}\\right\\} = ${k}t`],
                ],
                [["Apply the delay", "加上延迟"], t("", ""), [`f(t) = ${k}(t - ${c})u(t - ${c})`]],
                before
                  ? [
                      ["Evaluate", "求值"],
                      t(`At $t = ${t1} < ${c}$ the step is still off.`, `在 $t = ${t1} < ${c}$ 处阶跃尚未接通。`),
                      [`f(${t1}) = ${k}(${t1} - ${c}) \\cdot 0 = 0`],
                    ]
                  : [["Evaluate", "求值"], t("", ""), [`f(${t1}) = ${k}(${t1} - ${c}) \\cdot 1 = ${ans}`]],
              ],
              before
                ? t(
                    `The delayed ramp only starts at $t = ${c}$, and $t = ${t1}$ comes earlier, so nothing has happened yet.`,
                    `延迟后的斜坡在 $t = ${c}$ 才开始，而 $t = ${t1}$ 更早，所以此时尚未发生任何变化。`,
                  )
                : t(
                    `The ramp starts from $0$ at $t = ${c}$ and climbs $${k}$ per unit of time; after $${t1 - c}$ units it has reached $${k} \\cdot ${t1 - c} = ${ans}$.`,
                    `斜坡在 $t = ${c}$ 从 $0$ 开始，每单位时间上升 $${k}$；经过 $${t1 - c}$ 个单位后达到 $${k} \\cdot ${t1 - c} = ${ans}$。`,
                  ),
            ),
          });
        },
      },
    ],
  },

  // 5.18.12 Inverse Laplace Transforms
  {
    id: "inverse-laplace-transforms",
    title: t("Inverse Laplace Transforms", "拉普拉斯逆变换"),
    summary: t(
      "The inverse transform $\\mathcal{L}^{-1}\\{F(s)\\}$ recovers $f(t)$ through partial fractions and a table of known pairs.",
      "拉普拉斯逆变换 $\\mathcal{L}^{-1}\\{F(s)\\}$ 借助部分分式与基本变换表还原 $f(t)$。",
    ),
    intro: t(
      "Take $F(s) = \\frac{5s - 7}{(s - 1)(s - 2)}$. Covering up $(s - 1)$ and setting $s = 1$ gives $A = \\frac{5 - 7}{1 - 2} = 2$; covering up $(s - 2)$ and setting $s = 2$ gives $B = \\frac{10 - 7}{2 - 1} = 3$. So $F = \\frac{2}{s - 1} + \\frac{3}{s - 2}$ and $f(t) = 2e^{t} + 3e^{2t}$.\n\nCheck: $\\frac{2}{s - 1} + \\frac{3}{s - 2} = \\frac{2(s - 2) + 3(s - 1)}{(s - 1)(s - 2)} = \\frac{5s - 7}{(s - 1)(s - 2)}$.\n\nIn this lesson we invert transforms by splitting them into partial fractions.",
      "取 $F(s) = \\frac{5s - 7}{(s - 1)(s - 2)}$。遮住 $(s - 1)$ 并令 $s = 1$ 得 $A = \\frac{5 - 7}{1 - 2} = 2$；遮住 $(s - 2)$ 并令 $s = 2$ 得 $B = \\frac{10 - 7}{2 - 1} = 3$。所以 $F = \\frac{2}{s - 1} + \\frac{3}{s - 2}$，$f(t) = 2e^{t} + 3e^{2t}$。\n\n检验：$\\frac{2}{s - 1} + \\frac{3}{s - 2} = \\frac{2(s - 2) + 3(s - 1)}{(s - 1)(s - 2)} = \\frac{5s - 7}{(s - 1)(s - 2)}$。\n\n本课我们把变换拆成部分分式来求逆变换。",
    ),
    prerequisites: ["the-second-shifting-theorem-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "partial-fractions-for-inverse-laplace",
        title: t("Initial value from partial fraction inverse transform", "由部分分式逆变换确定初值"),
        explanation: t(
          "Splitting the transform into simple fractions lets you invert each one separately, since each simple fraction is the transform of an exponential. For $F(s) = \\frac{A}{s - a} + \\frac{B}{s - b}$, the inverse transform is $f(t) = A e^{at} + B e^{bt}$. At $t = 0$, $f(0) = A + B$.\n\n> **Watch out.** At $t = 0$ every exponential equals $1$, so $f(0)$ adds all the coefficients. For $\\frac{2}{s - 1} + \\frac{3}{s - 2}$, $f(0) = 5$, not $2$.",
          "把变换拆成简单分式后，可以分别对每一项求逆变换，因为每个简单分式都是某个指数函数的变换。对于 $F(s) = \\frac{A}{s - a} + \\frac{B}{s - b}$，逆变换为 $f(t) = A e^{at} + B e^{bt}$。在 $t = 0$ 处，$f(0) = A + B$。\n\n> **注意。** 在 $t = 0$ 处每个指数都等于 $1$，所以 $f(0)$ 是全部系数之和。对 $\\frac{2}{s - 1} + \\frac{3}{s - 2}$，$f(0) = 5$，不是 $2$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 5);
          const b = a + rng.int(2, 6);
          const A = rng.int(2, 20);
          const B = rng.int(2, 20);
          const numS = A + B;
          const numConst = A * b + B * a;
          const ans = numS;
          return numberProblem({
            prompt: t(
              `Let $F(s) = \\frac{${numS}s - ${numConst}}{(s - ${a})(s - ${b})}$ be the Laplace transform of $f(t)$. Find the initial value $f(0) = \\lim_{t \\to 0} f(t)$.`,
              `设 $f(t)$ 的拉普拉斯变换为 $F(s) = \\frac{${numS}s - ${numConst}}{(s - ${a})(s - ${b})}$。求初值 $f(0) = \\lim_{t \\to 0} f(t)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                A,
                `That is only the coefficient of $e^{${co(a)}t}$; at $t = 0$ the other term adds $${B}$.`,
                `这只是 $e^{${co(a)}t}$ 的系数；在 $t = 0$ 处另一项还要加 $${B}$。`,
              ),
              why(
                B,
                `That is only the coefficient of $e^{${b}t}$; at $t = 0$ the other term adds $${A}$.`,
                `这只是 $e^{${b}t}$ 的系数；在 $t = 0$ 处另一项还要加 $${A}$。`,
              ),
              why(
                numConst,
                "That reads the constant of the numerator; $f(0) = A + B$, which is the coefficient of $s$ on top.",
                "这读的是分子的常数项；$f(0) = A + B$，是分子中 $s$ 的系数。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Split into partial fractions", "拆成部分分式"],
                  t("Cover up each factor and set $s$ to its root.", "遮住每个因子，令 $s$ 等于它的根。"),
                  [
                    `A = \\frac{${numS} \\cdot ${a} - ${numConst}}{${a} - ${b}} = ${A}`,
                    `B = \\frac{${numS} \\cdot ${b} - ${numConst}}{${b} - ${a}} = ${B}`,
                  ],
                ],
                [["Invert", "求逆变换"], t("", ""), [`f(t) = ${A}e^{${co(a)}t} + ${B}e^{${b}t}`]],
                [["Evaluate at t = 0", "代入 t = 0"], t("", ""), [`f(0) = ${A} + ${B} = ${ans}`]],
              ],
              t(
                `The initial value theorem gives the same: $\\lim_{s \\to \\infty} sF(s) = ${numS}$, the coefficient of $s$ in the numerator.`,
                `初值定理给出同样的结果：$\\lim_{s \\to \\infty} sF(s) = ${numS}$，即分子中 $s$ 的系数。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-partial-fraction-coefficient-by-the-cover-up-rule",
        title: t("A partial-fraction coefficient by the cover-up rule", "用遮盖法求部分分式系数"),
        explanation: t(
          "For $F(s) = \\frac{\\alpha s + \\beta}{(s - p)(s - q)} = \\frac{A}{s - p} + \\frac{B}{s - q}$, cover up the factor $(s - p)$ and set $s = p$ in what remains:\n\n$$A = \\frac{\\alpha p + \\beta}{p - q}.$$\n\nThen $f(t) = Ae^{pt} + Be^{qt}$, so $A$ is the coefficient of $e^{pt}$ in the inverse transform.\n\n> **Watch out.** The denominator is $p - q$, the covered root minus the other one. For $\\frac{s + 5}{(s - 1)(s + 2)}$, $A = \\frac{1 + 5}{1 - (-2)} = 2$, not $\\frac{6}{-2 - 1} = -2$.",
          "对 $F(s) = \\frac{\\alpha s + \\beta}{(s - p)(s - q)} = \\frac{A}{s - p} + \\frac{B}{s - q}$，遮住因子 $(s - p)$，在剩余部分中令 $s = p$：\n\n$$A = \\frac{\\alpha p + \\beta}{p - q}.$$\n\n于是 $f(t) = Ae^{pt} + Be^{qt}$，所以 $A$ 是逆变换中 $e^{pt}$ 的系数。\n\n> **注意。** 分母是 $p - q$，即被遮住的根减去另一个根。对 $\\frac{s + 5}{(s - 1)(s + 2)}$，$A = \\frac{1 + 5}{1 - (-2)} = 2$，不是 $\\frac{6}{-2 - 1} = -2$。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
          let q = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
          if (q === p) q = -p;
          const al = rng.int(1, 9);
          const be = rng.int(-9, 9) || 4;
          const ans = Q.of(al * p + be, p - q);
          const B = Q.of(al * q + be, q - p);
          const fac = (r: number): string => `(s ${signed(-r)})`;
          return numberProblem({
            prompt: t(
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${co(al)}s ${signed(be)}}{${fac(p)}${fac(q)}}\\right\\} = Ae^{${co(p)}t} + Be^{${co(q)}t}$. Find $A$.`,
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${co(al)}s ${signed(be)}}{${fac(p)}${fac(q)}}\\right\\} = Ae^{${co(p)}t} + Be^{${co(q)}t}$。求 $A$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                B,
                `That is $B$, found by covering up $${fac(q)}$; $A$ belongs to $${fac(p)}$.`,
                `这是遮住 $${fac(q)}$ 得到的 $B$；$A$ 对应 $${fac(p)}$。`,
              ),
              why(
                Q.of(al * p + be, q - p),
                "That subtracts the roots in the wrong order; the denominator is $p - q$.",
                "这把两根相减的顺序弄反了；分母是 $p - q$。",
              ),
              why(
                Q.of(al * q + be, p - q),
                `That sets $s = ${q}$ in the numerator; covering up $${fac(p)}$ means setting $s = ${p}$.`,
                `这在分子中令 $s = ${q}$；遮住 $${fac(p)}$ 应令 $s = ${p}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  [`Cover up the factor of A`, "遮住 A 对应的因子"],
                  t(
                    `Multiply both sides by $${fac(p)}$ and set $s = ${p}$; the $B$ term vanishes.`,
                    `两边同乘 $${fac(p)}$ 并令 $s = ${p}$；$B$ 项消失。`,
                  ),
                  [`A = \\frac{${al} \\cdot ${inP(p)} ${signed(be)}}{${p} - ${inP(q)}} = ${ans.toLatex()}`],
                ],
                [
                  ["Read off the inverse", "读出逆变换"],
                  t(
                    `The fraction $\\frac{A}{${fac(p)}}$ inverts to $Ae^{${co(p)}t}$, so this is the coefficient asked for.`,
                    `分式 $\\frac{A}{${fac(p)}}$ 的逆变换是 $Ae^{${co(p)}t}$，所以这就是所求系数。`,
                  ),
                ],
              ],
              t(
                `Covering up $${fac(q)}$ gives $B = ${B.toLatex()}$, and $A + B = ${ans.toLatex()} + ${parQ(B)} = ${al}$, the coefficient of $s$ in the numerator, as it must be.`,
                `遮住 $${fac(q)}$ 得 $B = ${B.toLatex()}$，而 $A + B = ${ans.toLatex()} + ${parQ(B)} = ${al}$，正是分子中 $s$ 的系数。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.1 Solving First-Order ODEs Using Laplace Transforms
  {
    id: "solving-first-order-odes-using-laplace-transforms",
    title: t("Solving First-Order ODEs Using Laplace Transforms", "用拉普拉斯变换求解一阶常微分方程"),
    summary: t(
      "Transforming y' + ay = b converts the ODE into an algebraic equation (s + a)Y(s) - y(0) = b/s, solving initial value problems directly.",
      "对 y' + ay = b 两边取拉普拉斯变换得到代数方程 (s + a)Y(s) - y(0) = b/s，可直接解出初值问题。",
    ),
    intro: t(
      "Take $y' + 2y = 6$ with $y(0) = 1$. Transforming, $sY - 1 + 2Y = \\frac{6}{s}$, so $Y = \\frac{1}{s + 2} + \\frac{6}{s(s + 2)} = \\frac{3}{s} - \\frac{2}{s + 2}$ and $y = 3 - 2e^{-2t}$.\n\nCheck: $y(0) = 3 - 2 = 1$, and $y' + 2y = 4e^{-2t} + 6 - 4e^{-2t} = 6$.\n\nIn this lesson we solve first-order initial value problems with Laplace transforms.",
      "取 $y' + 2y = 6$，$y(0) = 1$。取变换得 $sY - 1 + 2Y = \\frac{6}{s}$，所以 $Y = \\frac{1}{s + 2} + \\frac{6}{s(s + 2)} = \\frac{3}{s} - \\frac{2}{s + 2}$，$y = 3 - 2e^{-2t}$。\n\n检验：$y(0) = 3 - 2 = 1$，且 $y' + 2y = 4e^{-2t} + 6 - 4e^{-2t} = 6$。\n\n本课我们用拉普拉斯变换求解一阶初值问题。",
    ),
    prerequisites: ["inverse-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "first-order-ivp-via-laplace",
        title: t("Steady-state solution of a first-order ODE via Laplace", "由拉普拉斯变换求解一阶方程的稳态解"),
        explanation: t(
          "Transforming the equation turns it into algebra, and the term that does not decay in the inverse transform gives the steady state. For $y' + a y = K$ with $y(0) = 0$, $Y(s) = \\frac{K}{s(s + a)} = \\frac{K/a}{s} - \\frac{K/a}{s + a}$. In the time domain, $y(t) = \\frac{K}{a}(1 - e^{-at})$, so the steady-state limit is $\\lim_{t \\to \\infty} y(t) = \\frac{K}{a}$.\n\n> **Watch out.** The steady state is $\\frac{K}{a}$, the value at which $y' = 0$, not the forcing $K$ itself. For $y' + 4y = 20$ it is $5$, not $20$.",
          "对方程做变换就把它变成代数问题，逆变换中不衰减的那一项给出稳态。对于 $y' + a y = K$（满足 $y(0) = 0$），变换后 $Y(s) = \\frac{K}{s(s + a)}$。求逆变换得 $y(t) = \\frac{K}{a}(1 - e^{-at})$，其稳态极限为 $\\lim_{t \\to \\infty} y(t) = \\frac{K}{a}$。\n\n> **注意。** 稳态是使 $y' = 0$ 的值 $\\frac{K}{a}$，不是外力 $K$ 本身。对 $y' + 4y = 20$，稳态是 $5$，不是 $20$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 8);
          const ans = rng.int(2, 35);
          const K = ans * a;
          return numberProblem({
            prompt: t(
              `Use Laplace transforms to solve the initial value problem $y' + ${a}y = ${K}$ with $y(0) = 0$. Determine the steady-state value $\\lim_{t \\to \\infty} y(t)$.`,
              `利用拉普拉斯变换求解初值问题 $y' + ${a}y = ${K}$（$y(0) = 0$）。求稳态解 $\\lim_{t \\to \\infty} y(t)$ 的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(K, `That is the forcing; the steady state divides it by $${a}$.`, `这是外力；稳态还要除以 $${a}$。`),
              why(
                0,
                "That is the starting value; the exponential term dies away and $y$ rises to the steady state.",
                "这是初始值；指数项衰减后 $y$ 升到稳态。",
              ),
              why(
                Q.of(a, K),
                `That divides $${a}$ by $${K}$; the steady state is $${K}$ divided by $${a}$.`,
                `这用 $${a}$ 除以 $${K}$；稳态是 $${K}$ 除以 $${a}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the equation", "对方程取变换"],
                  t("", ""),
                  [`sY - 0 + ${a}Y = \\frac{${K}}{s}`, `Y = \\frac{${K}}{s(s + ${a})}`],
                ],
                [
                  ["Split and invert", "拆分并求逆"],
                  t("", ""),
                  [`Y = \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}}`, `y(t) = ${ans}\\left(1 - e^{-${a}t}\\right)`],
                ],
                [
                  ["Let t grow", "令 t 增大"],
                  t(`As $t \\to \\infty$, $e^{-${a}t} \\to 0$.`, `当 $t \\to \\infty$ 时，$e^{-${a}t} \\to 0$。`),
                  [`\\lim_{t \\to \\infty} y(t) = ${ans}`],
                ],
              ],
              t(
                `At the steady state $y' = 0$, so $${a}y = ${K}$ and $y = ${ans}$.`,
                `在稳态 $y' = 0$，所以 $${a}y = ${K}$，$y = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-transient-coefficient-from-partial-fractions",
        title: t("The transient coefficient from partial fractions", "由部分分式求瞬态系数"),
        explanation: t(
          "Transforming $y' + ay = b$, $y(0) = y_0$ gives $(s + a)Y = y_0 + \\frac{b}{s}$, so\n\n$$Y(s) = \\frac{y_0}{s + a} + \\frac{b}{s(s + a)} = \\frac{b/a}{s} + \\frac{y_0 - b/a}{s + a}.$$\n\nInverting, $y(t) = \\frac{b}{a} + \\left(y_0 - \\frac{b}{a}\\right)e^{-at}$: the coefficient of $e^{-at}$ is the initial value minus the steady state.\n\n> **Watch out.** The coefficient of $e^{-at}$ is not the initial value: part of $y_0$ is already the steady state. For $y' + 2y = 8$, $y(0) = 1$: $C_2 = 1 - 4 = -3$, not $1$.",
          "对 $y' + ay = b$，$y(0) = y_0$ 取变换得 $(s + a)Y = y_0 + \\frac{b}{s}$，所以\n\n$$Y(s) = \\frac{y_0}{s + a} + \\frac{b}{s(s + a)} = \\frac{b/a}{s} + \\frac{y_0 - b/a}{s + a}.$$\n\n取逆变换得 $y(t) = \\frac{b}{a} + \\left(y_0 - \\frac{b}{a}\\right)e^{-at}$：$e^{-at}$ 的系数等于初值减去稳态值。\n\n> **注意。** $e^{-at}$ 的系数不是初值：$y_0$ 中有一部分已是稳态。对 $y' + 2y = 8$，$y(0) = 1$：$C_2 = 1 - 4 = -3$，不是 $1$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 6);
          const b = rng.int(1, 20);
          const ss = Q.of(b, a);
          let y0 = rng.int(-5, 10);
          // Starting at the steady state leaves no transient to find.
          if (Q.of(y0).eq(ss)) y0 += 1;
          const ans = Q.of(y0).sub(ss);
          const ssL = ss.toLatex();
          const ax = a === 1 ? "" : `${a}`;
          return numberProblem({
            prompt: t(
              `Solve $y' + ${ax}y = ${b}$, $y(0) = ${y0}$ with Laplace transforms. The solution has the form $y = C_1 + C_2e^{-${ax}t}$. Find $C_2$.`,
              `用拉普拉斯变换求解 $y' + ${ax}y = ${b}$，$y(0) = ${y0}$。解的形式为 $y = C_1 + C_2e^{-${ax}t}$。求 $C_2$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                ss,
                "That is $C_1$, the steady state; $C_2$ is what is left of the initial value.",
                "这是稳态 $C_1$；$C_2$ 是初值减去稳态后剩下的部分。",
              ),
              why(
                Q.of(y0),
                "That is the initial value; part of it is the steady state, which belongs to $C_1$.",
                "这是初值；其中一部分是稳态，属于 $C_1$。",
              ),
              why(
                ss.sub(Q.of(y0)),
                "That subtracts the wrong way round; $C_2$ is initial value minus steady state.",
                "这减反了；$C_2$ 是初值减稳态。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the equation", "对方程取变换"],
                  t("", ""),
                  [`sY - ${inP(y0)} + ${ax}Y = \\frac{${b}}{s}`, `Y = \\frac{${y0}}{s + ${a}} + \\frac{${b}}{s(s + ${a})}`],
                ],
                [
                  ["Split the second fraction", "拆开第二个分式"],
                  t("", ""),
                  [`\\frac{${b}}{s(s + ${a})} = \\frac{${ssL}}{s} - \\frac{${ssL}}{s + ${a}}`],
                ],
                [
                  ["Collect the decaying terms", "合并衰减项"],
                  t(
                    `Both fractions over $s + ${a}$ invert to multiples of $e^{-${ax}t}$.`,
                    `分母为 $s + ${a}$ 的两项都变为 $e^{-${ax}t}$ 的倍数。`,
                  ),
                  [`C_2 = ${y0} - ${ssL} = ${ans.toLatex()}`],
                ],
              ],
              t(
                `At $t = 0$, $C_1 + C_2 = ${ssL} + ${parQ(ans)} = ${y0}$, the given initial value.`,
                `在 $t = 0$ 处，$C_1 + C_2 = ${ssL} + ${parQ(ans)} = ${y0}$，正是给定的初值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.2 Solving First-Order ODEs With Time-Delayed Forcing Using Laplace Transforms
  {
    id: "solving-first-order-odes-with-time-delayed-forcing-using-laplace-transforms",
    title: t("Solving First-Order ODEs With Time-Delayed Forcing Using Laplace Transforms", "用拉普拉斯变换求解含时滞激励的一阶常微分方程"),
    summary: t(
      "Forcing by a delayed step $u(t - c)$ brings in the factor $e^{-cs}$, and the response stays zero until $t = c$.",
      "延迟阶跃 $u(t - c)$ 作为外力引入因子 $e^{-cs}$，系统的响应在 $t = c$ 之前保持为零。",
    ),
    intro: t(
      "Take $y' + y = 2u(t - 1)$ with $y(0) = 0$. Then $Y = \\frac{2e^{-s}}{s(s + 1)}$, and since $\\frac{2}{s(s + 1)}$ inverts to $2\\left(1 - e^{-t}\\right)$, the delay gives $y = 2\\left(1 - e^{-(t - 1)}\\right)u(t - 1)$.\n\nCheck: for $t > 1$, $y' + y = 2e^{-(t - 1)} + 2 - 2e^{-(t - 1)} = 2$, and before $t = 1$ both $y$ and the forcing are $0$.\n\nIn this lesson we solve first-order equations driven by a delayed step.",
      "取 $y' + y = 2u(t - 1)$，$y(0) = 0$。则 $Y = \\frac{2e^{-s}}{s(s + 1)}$，由于 $\\frac{2}{s(s + 1)}$ 的逆变换为 $2\\left(1 - e^{-t}\\right)$，延迟后得 $y = 2\\left(1 - e^{-(t - 1)}\\right)u(t - 1)$。\n\n检验：当 $t > 1$ 时，$y' + y = 2e^{-(t - 1)} + 2 - 2e^{-(t - 1)} = 2$；在 $t = 1$ 之前 $y$ 与外力都为 $0$。\n\n本课我们求解由延迟阶跃驱动的一阶方程。",
    ),
    prerequisites: ["solving-first-order-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "delayed-step-forcing-first-order",
        title: t("Long-term limit with delayed step forcing", "含延迟阶跃激励的长期极限"),
        explanation: t(
          "A delayed step does nothing before it switches on, and long afterward the solution settles to the same steady state as for an immediate step. For $y' + a y = K u(t - c)$ with $y(0) = 0$, $Y(s) = \\frac{K e^{-cs}}{s(s + a)}$. Inverting gives $y(t) = \\frac{K}{a}(1 - e^{-a(t - c)}) u(t - c)$. As $t \\to \\infty$, $y(t) \\to \\frac{K}{a}$.\n\n> **Watch out.** The delay changes when $y$ starts to rise, not where it ends up. For $y' + 2y = 10u(t - 3)$ the limit is $5$, the same as for a step applied at once.",
          "延迟的阶跃在开启之前不起作用，很久以后解会稳定到与立即阶跃相同的稳态。对于方程 $y' + a y = K u(t - c)$（$y(0) = 0$），变换得 $Y(s) = \\frac{K e^{-cs}}{s(s + a)}$。其解为 $y(t) = \\frac{K}{a}(1 - e^{-a(t - c)}) u(t - c)$。当 $t \\to \\infty$ 时，$y(t) \\to \\frac{K}{a}$。\n\n> **注意。** 延迟改变的是 $y$ 开始上升的时刻，不改变最终值。对 $y' + 2y = 10u(t - 3)$，极限是 $5$，与立即施加阶跃时相同。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 6);
          const c = rng.int(1, 5);
          const ans = rng.int(2, 35);
          const K = ans * a;
          const cs = `${co(c)}s`;
          return numberProblem({
            prompt: t(
              `A dynamical system satisfies $y' + ${a}y = ${K} u(t - ${c})$ with $y(0) = 0$. Using Laplace transforms, determine the eventual steady-state value $\\lim_{t \\to \\infty} y(t)$.`,
              `动力系统满足 $y' + ${a}y = ${K} u(t - ${c})$，初始条件 $y(0) = 0$。利用拉普拉斯变换，求当 $t \\to \\infty$ 时的稳态极限值 $\\lim_{t \\to \\infty} y(t)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(K, `That is the size of the step; the steady state divides it by $${a}$.`, `这是阶跃的大小；稳态还要除以 $${a}$。`),
              why(
                0,
                `That is the value before $t = ${c}$; the step stays on afterwards, so $y$ keeps rising.`,
                `这是 $t = ${c}$ 之前的值；此后阶跃一直接通，$y$ 继续上升。`,
              ),
              why(
                Q.of(a, K),
                `That divides $${a}$ by $${K}$; the steady state is $${K}$ divided by $${a}$.`,
                `这用 $${a}$ 除以 $${K}$；稳态是 $${K}$ 除以 $${a}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the equation", "对方程取变换"],
                  t("", ""),
                  [`(s + ${a})Y = \\frac{${K}e^{-${cs}}}{s}`, `Y = e^{-${cs}}\\left(\\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}}\\right)`],
                ],
                [["Invert with the delay", "带延迟求逆"], t("", ""), [`y(t) = ${ans}\\left(1 - e^{-${a}(t - ${c})}\\right)u(t - ${c})`]],
                [["Let t grow", "令 t 增大"], t("", ""), [`\\lim_{t \\to \\infty} y(t) = ${ans}`]],
              ],
              t(
                `The final value theorem agrees: $sY = \\frac{${K}e^{-${cs}}}{s + ${a}} \\to \\frac{${K}}{${a}} = ${ans}$ as $s \\to 0$.`,
                `终值定理给出同样结果：当 $s \\to 0$ 时 $sY = \\frac{${K}e^{-${cs}}}{s + ${a}} \\to \\frac{${K}}{${a}} = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-response-to-a-delayed-step-at-a-given-time",
        title: t("The response to a delayed step at a given time", "延迟阶跃在给定时刻的响应"),
        explanation: t(
          "For $y' + ay = ku(t - c)$, $y(0) = 0$: $Y = \\frac{ke^{-cs}}{s(s + a)}$, and $\\frac{k}{s(s + a)}$ inverts to $\\frac{k}{a}\\left(1 - e^{-at}\\right)$. The factor $e^{-cs}$ delays this by $c$:\n\n$$y(t) = \\frac{k}{a}\\left(1 - e^{-a(t - c)}\\right)u(t - c).$$\n\nNothing happens before $t = c$; afterwards $y$ rises toward $\\frac{k}{a}$, reaching half of it at $t = c + \\frac{\\ln 2}{a}$.\n\n> **Watch out.** $e^{-\\ln m} = \\frac{1}{m}$, not $m$. With $k = 6$, $a = 2$ and $c = 1$, at $t = 1 + \\frac{\\ln 2}{2}$ the value is $3\\left(1 - \\frac{1}{2}\\right) = \\frac{3}{2}$, not $3(1 - 2) = -3$.",
          "对 $y' + ay = ku(t - c)$，$y(0) = 0$：$Y = \\frac{ke^{-cs}}{s(s + a)}$，而 $\\frac{k}{s(s + a)}$ 的逆变换为 $\\frac{k}{a}\\left(1 - e^{-at}\\right)$。因子 $e^{-cs}$ 使其延迟 $c$：\n\n$$y(t) = \\frac{k}{a}\\left(1 - e^{-a(t - c)}\\right)u(t - c).$$\n\n在 $t = c$ 之前什么也不发生；之后 $y$ 向 $\\frac{k}{a}$ 上升，在 $t = c + \\frac{\\ln 2}{a}$ 时达到它的一半。\n\n> **注意。** $e^{-\\ln m} = \\frac{1}{m}$，不是 $m$。当 $k = 6$，$a = 2$，$c = 1$ 时，在 $t = 1 + \\frac{\\ln 2}{2}$ 处的值为 $3\\left(1 - \\frac{1}{2}\\right) = \\frac{3}{2}$，不是 $3(1 - 2) = -3$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 6);
          const k = rng.int(2, 30);
          const c = rng.int(1, 6);
          const m = rng.pick([2, 4]);
          const ans = Q.of(k * (m - 1), a * m);
          const top = Q.of(k, a);
          const gap = Q.of(k, a * m);
          const ax = a === 1 ? "" : `${a}`;
          const when = a === 1 ? `${c} + \\ln ${m}` : `${c} + \\frac{\\ln ${m}}{${a}}`;
          return numberProblem({
            prompt: t(
              `$y' + ${ax}y = ${k}u(t - ${c})$ with $y(0) = 0$. Find $y\\left(${when}\\right)$.`,
              `$y' + ${ax}y = ${k}u(t - ${c})$，$y(0) = 0$。求 $y\\left(${when}\\right)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                top,
                "That is the final value; at this time $y$ has only covered part of the way.",
                "这是最终值；此时 $y$ 只走了一部分路程。",
              ),
              why(gap, "That is the gap still left to the final value, not the value reached.", "这是距最终值还差的部分，不是已达到的值。"),
              why(
                Q.of(k * (m - 1), m),
                `That forgets to divide by $a = ${a}$ in $\\frac{k}{a}$.`,
                `这忘了在 $\\frac{k}{a}$ 中除以 $a = ${a}$。`,
              ),
              why(
                Q.of(k * (1 - m), a),
                `That writes $e^{-\\ln ${m}}$ as $${m}$; it is $\\frac{1}{${m}}$.`,
                `这把 $e^{-\\ln ${m}}$ 写成了 $${m}$；它等于 $\\frac{1}{${m}}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Invert with the delay", "带延迟求逆"],
                  t("", ""),
                  [`y(t) = ${top.toLatex()}\\left(1 - e^{-${ax}(t - ${c})}\\right)u(t - ${c})`],
                ],
                [
                  ["Evaluate", "求值"],
                  t(`At this time $${ax}(t - ${c}) = \\ln ${m}$ and the step is on.`, `此时 $${ax}(t - ${c}) = \\ln ${m}$，阶跃已接通。`),
                  [`e^{-\\ln ${m}} = \\frac{1}{${m}}`, `y = ${top.toLatex()}\\left(1 - \\frac{1}{${m}}\\right) = ${ans.toLatex()}`],
                ],
              ],
              t(
                `The gap to the final value $${top.toLatex()}$ shrinks by the factor $e^{-\\ln ${m}} = \\frac{1}{${m}}$, so the gap is $${gap.toLatex()}$ and $y = ${top.toLatex()} - ${gap.toLatex()} = ${ans.toLatex()}$.`,
                `与最终值 $${top.toLatex()}$ 的差距缩小为原来的 $e^{-\\ln ${m}} = \\frac{1}{${m}}$，即差距为 $${gap.toLatex()}$，所以 $y = ${top.toLatex()} - ${gap.toLatex()} = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.3 Solving Second-Order ODEs Using Laplace Transforms
  {
    id: "solving-second-order-odes-using-laplace-transforms",
    title: t("Solving Second-Order ODEs Using Laplace Transforms", "用拉普拉斯变换求解二阶常微分方程"),
    summary: t(
      "The Laplace transform turns $y'' + \\omega^2 y = 0$ into $(s^2 + \\omega^2)Y(s) - sy(0) - y'(0) = 0$, which solves second-order initial value problems directly.",
      "拉普拉斯变换把 $y'' + \\omega^2 y = 0$ 化为 $(s^2 + \\omega^2)Y(s) - sy(0) - y'(0) = 0$，从而直接解出二阶初值问题。",
    ),
    intro: t(
      "Take $y'' + 4y = 0$ with $y(0) = 3$ and $y'(0) = 4$. Transforming, $(s^2 + 4)Y = 3s + 4$, so $Y = 3 \\cdot \\frac{s}{s^2 + 4} + 2 \\cdot \\frac{2}{s^2 + 4}$ and $y = 3\\cos 2t + 2\\sin 2t$.\n\nCheck: $y(0) = 3$, $y'(0) = 2 \\cdot 2 = 4$, and $y'' = -12\\cos 2t - 8\\sin 2t = -4y$.\n\nIn this lesson we solve second-order initial value problems with Laplace transforms.",
      "取 $y'' + 4y = 0$，$y(0) = 3$，$y'(0) = 4$。取变换得 $(s^2 + 4)Y = 3s + 4$，所以 $Y = 3 \\cdot \\frac{s}{s^2 + 4} + 2 \\cdot \\frac{2}{s^2 + 4}$，$y = 3\\cos 2t + 2\\sin 2t$。\n\n检验：$y(0) = 3$，$y'(0) = 2 \\cdot 2 = 4$，且 $y'' = -12\\cos 2t - 8\\sin 2t = -4y$。\n\n本课我们用拉普拉斯变换求解二阶初值问题。",
    ),
    prerequisites: ["solving-first-order-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "harmonic-oscillator-ivp-via-laplace",
        title: t("Oscillation amplitude from Laplace transform of an IVP", "由初值问题的拉普拉斯变换确定振幅"),
        explanation: t(
          "The transformed solution has the form of the transform of a sine, so the inverse is a sine wave whose amplitude is read from the coefficient. For $y'' + \\omega^2 y = 0$ with $y(0) = 0$ and $y'(0) = v_0$, $Y(s) = \\frac{v_0}{s^2 + \\omega^2} = \\frac{v_0}{\\omega} \\frac{\\omega}{s^2 + \\omega^2}$. The solution is $y(t) = \\frac{v_0}{\\omega} \\sin(\\omega t)$, with amplitude $A = \\frac{v_0}{\\omega}$.\n\n> **Watch out.** Divide by $\\omega$, not by $\\omega^2$: the sine pair has $\\omega$ on top. For $y'' + 9y = 0$, $y(0) = 0$, $y'(0) = 12$, the solution is $4\\sin 3t$, not $\\frac{4}{3}\\sin 3t$.",
          "变换后的解具有正弦函数变换的形式，所以逆变换是一条正弦曲线，振幅可以从系数读出。对于 $y'' + \\omega^2 y = 0$（$y(0) = 0$，$y'(0) = v_0$），变换后 $Y(s) = \\frac{v_0}{s^2 + \\omega^2}$，其逆变换为 $y(t) = \\frac{v_0}{\\omega} \\sin(\\omega t)$，振荡振幅为 $A = \\frac{v_0}{\\omega}$。\n\n> **注意。** 要除以 $\\omega$，不是 $\\omega^2$：正弦变换对的分子是 $\\omega$。对 $y'' + 9y = 0$，$y(0) = 0$，$y'(0) = 12$，解为 $4\\sin 3t$，不是 $\\frac{4}{3}\\sin 3t$。",
        ),
        generate(rng: Rng): Problem {
          const omega = rng.int(2, 10);
          const ans = rng.int(2, 35);
          const v0 = ans * omega;
          const w2 = omega * omega;
          return numberProblem({
            prompt: t(
              `Solve the initial value problem $y'' + ${w2}y = 0$ with $y(0) = 0$ and $y'(0) = ${v0}$ using Laplace transforms. Find the amplitude $A$ of the resulting sinusoidal motion $y(t) = A \\sin(${omega}t)$.`,
              `利用拉普拉斯变换求解初值问题 $y'' + ${w2}y = 0$（$y(0) = 0$，$y'(0) = ${v0}$）。求简谐振动 $y(t) = A \\sin(${omega}t)$ 的振幅 $A$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                v0,
                `That is the initial velocity; the sine pair needs $${omega}$ on top, so divide by $${omega}$.`,
                `这是初速度；正弦变换对的分子需要 $${omega}$，所以要除以 $${omega}$。`,
              ),
              why(
                Q.of(v0, w2),
                `That divides by $${w2}$; the sine pair has $${omega}$ on top, not $${w2}$.`,
                `这除以了 $${w2}$；正弦变换对的分子是 $${omega}$，不是 $${w2}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the equation", "对方程取变换"],
                  t("", ""),
                  [`s^2Y - s \\cdot 0 - ${v0} + ${w2}Y = 0`, `Y = \\frac{${v0}}{s^2 + ${w2}}`],
                ],
                [
                  ["Match the sine pair", "凑出正弦变换对"],
                  t("", ""),
                  [`Y = ${ans} \\cdot \\frac{${omega}}{s^2 + ${w2}}`, `y(t) = ${ans}\\sin ${omega}t`],
                ],
              ],
              t(
                `$y'(t) = ${ans} \\cdot ${omega}\\cos ${omega}t$, so $y'(0) = ${v0}$, and $y(0) = 0$, as required.`,
                `$y'(t) = ${ans} \\cdot ${omega}\\cos ${omega}t$，所以 $y'(0) = ${v0}$，且 $y(0) = 0$，符合要求。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-coefficient-of-an-overdamped-solution",
        title: t("A coefficient of an overdamped solution", "过阻尼解的系数"),
        explanation: t(
          "For $y'' + (p + q)y' + pqy = 0$, transforming gives\n\n$$Y(s) = \\frac{y_0s + v_0 + (p + q)y_0}{(s + p)(s + q)}, \\qquad y_0 = y(0),\\ v_0 = y'(0).$$\n\nThe cover-up rule at $s = -p$ gives the coefficient of $e^{-pt}$: $A = \\frac{qy_0 + v_0}{q - p}$. Note the $(p + q)y_0$ term in the numerator, which comes from transforming $y'$.\n\n> **Watch out.** Leaving out the $(p + q)y_0$ that $\\mathcal{L}\\{y'\\}$ brings in is the usual slip. For $y'' + 3y' + 2y = 0$, $y(0) = 1$, $y'(0) = 0$: $Y = \\frac{s + 3}{(s + 1)(s + 2)}$ and $A = 2$, not $-1$.",
          "对 $y'' + (p + q)y' + pqy = 0$ 取变换得\n\n$$Y(s) = \\frac{y_0s + v_0 + (p + q)y_0}{(s + p)(s + q)}, \\qquad y_0 = y(0),\\ v_0 = y'(0).$$\n\n在 $s = -p$ 处用遮盖法得 $e^{-pt}$ 的系数：$A = \\frac{qy_0 + v_0}{q - p}$。注意分子中的 $(p + q)y_0$ 项，它来自对 $y'$ 的变换。\n\n> **注意。** 常见错误是漏掉 $\\mathcal{L}\\{y'\\}$ 带来的 $(p + q)y_0$。对 $y'' + 3y' + 2y = 0$，$y(0) = 1$，$y'(0) = 0$：$Y = \\frac{s + 3}{(s + 1)(s + 2)}$，$A = 2$，不是 $-1$。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.int(1, 4);
          const q = p + rng.int(1, 4);
          const y0 = rng.int(-4, 6);
          // y(0) = y'(0) = 0 has only the zero solution, which leaves nothing to find.
          const v0 = y0 === 0 ? rng.pick([-5, -3, -2, 2, 3, 5]) : rng.int(-6, 6);
          const N = v0 + (p + q) * y0;
          const ans = Q.of(q * y0 + v0, q - p);
          const B = Q.of(p * y0 + v0, p - q);
          const num = poly([y0, "s"], [N, ""]);
          return numberProblem({
            prompt: t(
              `Solve $y'' + ${p + q}y' + ${p * q}y = 0$, $y(0) = ${y0}$, $y'(0) = ${v0}$ with Laplace transforms. Writing $y = Ae^{-${co(p)}t} + Be^{-${q}t}$, find $A$.`,
              `用拉普拉斯变换求解 $y'' + ${p + q}y' + ${p * q}y = 0$，$y(0) = ${y0}$，$y'(0) = ${v0}$。写成 $y = Ae^{-${co(p)}t} + Be^{-${q}t}$，求 $A$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(v0 - p * y0, q - p),
                `That leaves out the $${p + q}y(0)$ that transforming $${p + q}y'$ brings into the numerator.`,
                `这漏掉了变换 $${p + q}y'$ 时带入分子的 $${p + q}y(0)$。`,
              ),
              why(
                Q.of(q * y0 + v0, p - q),
                `That subtracts in the wrong order; covering up $(s + ${p})$ leaves $s + ${q}$, which is $${q - p}$ at $s = -${p}$.`,
                `这减反了顺序；遮住 $(s + ${p})$ 后剩下 $s + ${q}$，在 $s = -${p}$ 处为 $${q - p}$。`,
              ),
              why(
                B,
                `That is $B$, the coefficient of $e^{-${q}t}$, found by covering up $(s + ${q})$.`,
                `这是遮住 $(s + ${q})$ 得到的 $e^{-${q}t}$ 的系数 $B$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the equation", "对方程取变换"],
                  t("Both initial values enter, the position twice.", "两个初值都会出现，其中位置出现两次。"),
                  [
                    `\\left(s^2Y${y0 === 0 ? "" : ` ${sco(-y0)}s`}${v0 === 0 ? "" : ` ${signed(-v0)}`}\\right) + ${p + q}\\left(sY${y0 === 0 ? "" : ` ${signed(-y0)}`}\\right) + ${p * q}Y = 0`,
                    `Y = \\frac{${num}}{(s + ${p})(s + ${q})}`,
                  ],
                ],
                [
                  ["Cover up the factor of A", "遮住 A 对应的因子"],
                  t(`Set $s = -${p}$ in what is left.`, `在剩余部分中令 $s = -${p}$。`),
                  [`A = \\frac{${inP(y0)} \\cdot (-${p})${N === 0 ? "" : ` ${signed(N)}`}}{${q} - ${p}} = ${ans.toLatex()}`],
                ],
              ],
              t(
                `Covering up $(s + ${q})$ gives $B = ${B.toLatex()}$, and $A + B = ${ans.toLatex()} + ${parQ(B)} = ${y0}$, which is $y(0)$.`,
                `遮住 $(s + ${q})$ 得 $B = ${B.toLatex()}$，而 $A + B = ${ans.toLatex()} + ${parQ(B)} = ${y0}$，正是 $y(0)$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.4 Solving Second-Order ODEs With Time-Delayed Forcing Using Laplace Transforms
  {
    id: "solving-second-order-odes-with-time-delayed-forcing-using-laplace-transforms",
    title: t(
      "Solving Second-Order ODEs With Time-Delayed Forcing Using Laplace Transforms",
      "用拉普拉斯变换求解含时滞激励的二阶常微分方程",
    ),
    summary: t(
      "A delayed step input $y'' + \\omega^2 y = Ku(t - c)$ makes an undamped oscillator oscillate about the new level $\\frac{K}{\\omega^2}$.",
      "对无阻尼谐振子施加延迟阶跃激励 $y'' + \\omega^2 y = Ku(t - c)$，它将围绕新平衡位置 $\\frac{K}{\\omega^2}$ 振荡。",
    ),
    intro: t(
      "Take $y'' + 4y = 8u(t - 1)$ starting at rest. Then $Y = \\frac{8e^{-s}}{s(s^2 + 4)} = 2e^{-s}\\left(\\frac{1}{s} - \\frac{s}{s^2 + 4}\\right)$, so $y = 2\\left(1 - \\cos 2(t - 1)\\right)u(t - 1)$.\n\nCheck: for $t > 1$, $y'' + 4y = 8\\cos 2(t - 1) + 8 - 8\\cos 2(t - 1) = 8$, and $y = y' = 0$ at $t = 1$, so the motion starts smoothly from rest.\n\nIn this lesson we solve second-order equations driven by a delayed step.",
      "取从静止开始的 $y'' + 4y = 8u(t - 1)$。则 $Y = \\frac{8e^{-s}}{s(s^2 + 4)} = 2e^{-s}\\left(\\frac{1}{s} - \\frac{s}{s^2 + 4}\\right)$，所以 $y = 2\\left(1 - \\cos 2(t - 1)\\right)u(t - 1)$。\n\n检验：当 $t > 1$ 时，$y'' + 4y = 8\\cos 2(t - 1) + 8 - 8\\cos 2(t - 1) = 8$；在 $t = 1$ 处 $y = y' = 0$，所以运动从静止平稳开始。\n\n本课我们求解由延迟阶跃驱动的二阶方程。",
    ),
    prerequisites: ["solving-second-order-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "delayed-step-forcing-second-order",
        title: t("Equilibrium offset under delayed step excitation", "延迟阶跃激励下的平衡位置偏移"),
        explanation: t(
          "After the step switches on, the oscillator vibrates about a new equilibrium, shifted by the step size divided by the square of the frequency. For $y'' + \\omega^2 y = K u(t - c)$ with zero initial conditions, $Y(s) = \\frac{K e^{-cs}}{s(s^2 + \\omega^2)} = \\frac{K}{\\omega^2} e^{-cs} \\left[ \\frac{1}{s} - \\frac{s}{s^2 + \\omega^2} \\right]$. For $t \\ge c$, $y(t) = \\frac{K}{\\omega^2}[1 - \\cos(\\omega(t - c))]$, oscillating about the equilibrium level $\\frac{K}{\\omega^2}$.\n\n> **Watch out.** The center is halfway between the lowest point $0$ and the highest point $\\frac{2K}{\\omega^2}$. For $y'' + 4y = 12u(t - 1)$ the center is $3$, not the top value $6$.",
          "阶跃开启后，振子围绕一个新的平衡位置振动，偏移量等于阶跃大小除以频率的平方。对于 $y'' + \\omega^2 y = K u(t - c)$（零初始条件），变换后 $Y(s) = \\frac{K e^{-cs}}{s(s^2 + \\omega^2)}$。当 $t \\ge c$ 时，$y(t) = \\frac{K}{\\omega^2}[1 - \\cos(\\omega(t - c))]$，围绕平衡中心 $\\frac{K}{\\omega^2}$ 振荡。\n\n> **注意。** 中心位于最低点 $0$ 与最高点 $\\frac{2K}{\\omega^2}$ 的正中间。对 $y'' + 4y = 12u(t - 1)$，中心是 $3$，不是最高值 $6$。",
        ),
        generate(rng: Rng): Problem {
          const omega = rng.int(2, 6);
          const c = rng.int(1, 4);
          const ans = rng.int(2, 35);
          const w2 = omega * omega;
          const K = ans * w2;
          const cs = `${co(c)}s`;
          return numberProblem({
            prompt: t(
              `An oscillator satisfies $y'' + ${w2}y = ${K} u(t - ${c})$ with $y(0) = 0$ and $y'(0) = 0$. Determine the center of oscillation (the new equilibrium position) for $t > ${c}$.`,
              `谐振子满足方程 $y'' + ${w2}y = ${K} u(t - ${c})$，初始条件为零。求在 $t > ${c}$ 时系统振荡的中心位置（即新的平衡位置）。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                2 * ans,
                "That is the highest point of the swing; the center is halfway between $0$ and it.",
                "这是摆动的最高点；中心在 $0$ 与它的正中间。",
              ),
              why(
                K,
                `That is the size of the step; the center divides it by $\\omega^2 = ${w2}$.`,
                `这是阶跃的大小；中心还要除以 $\\omega^2 = ${w2}$。`,
              ),
              why(
                Q.of(K, omega),
                `That divides by $\\omega = ${omega}$; the equilibrium divides by $\\omega^2 = ${w2}$.`,
                `这除以了 $\\omega = ${omega}$；平衡位置应除以 $\\omega^2 = ${w2}$。`,
              ),
            ]),
            solution: walked(
              [
                [["Transform the equation", "对方程取变换"], t("", ""), [`(s^2 + ${w2})Y = \\frac{${K}e^{-${cs}}}{s}`]],
                [
                  ["Split the fraction", "拆分分式"],
                  t("", ""),
                  [`Y = ${ans}e^{-${cs}}\\left(\\frac{1}{s} - \\frac{s}{s^2 + ${w2}}\\right)`],
                ],
                [
                  ["Invert with the delay", "带延迟求逆"],
                  t(
                    "The cosine swings between $-1$ and $1$, so $y$ swings about the constant term.",
                    "余弦在 $-1$ 与 $1$ 之间摆动，所以 $y$ 围绕常数项摆动。",
                  ),
                  [`y(t) = ${ans}\\left(1 - \\cos ${omega}(t - ${c})\\right)u(t - ${c})`],
                ],
              ],
              t(
                `At rest under the step, $y'' = 0$ and $${w2}y = ${K}$, so the equilibrium is $y = ${ans}$; the motion swings between $0$ and $${2 * ans}$ around it.`,
                `在阶跃作用下静止时 $y'' = 0$，$${w2}y = ${K}$，所以平衡位置为 $y = ${ans}$；运动在 $0$ 与 $${2 * ans}$ 之间围绕它摆动。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-position-of-an-oscillator-after-a-delayed-step",
        title: t("The position of an oscillator after a delayed step", "延迟阶跃后振子的位置"),
        explanation: t(
          "For $y'' + \\omega^{2}y = ku(t - c)$ starting at rest, $Y = \\frac{ke^{-cs}}{s(s^{2} + \\omega^{2})}$ and $\\frac{1}{s(s^{2} + \\omega^{2})} = \\frac{1}{\\omega^{2}}\\left(\\frac{1}{s} - \\frac{s}{s^{2} + \\omega^{2}}\\right)$, so\n\n$$y(t) = \\frac{k}{\\omega^{2}}\\left(1 - \\cos\\omega(t - c)\\right)u(t - c).$$\n\nThe oscillator swings between $0$ and $\\frac{2k}{\\omega^{2}}$, reaching the top half a period after the step.\n\n> **Watch out.** When $\\omega(t - c) = \\pi$ the cosine is $-1$, so the bracket is $1 - (-1) = 2$ and the oscillator is at the top, not the center. For $y'' + 4y = 8u(t - 1)$ at $t = 1 + \\frac{\\pi}{2}$, $y = 2 \\cdot 2 = 4$.",
          "对从静止开始的 $y'' + \\omega^{2}y = ku(t - c)$，$Y = \\frac{ke^{-cs}}{s(s^{2} + \\omega^{2})}$，且 $\\frac{1}{s(s^{2} + \\omega^{2})} = \\frac{1}{\\omega^{2}}\\left(\\frac{1}{s} - \\frac{s}{s^{2} + \\omega^{2}}\\right)$，所以\n\n$$y(t) = \\frac{k}{\\omega^{2}}\\left(1 - \\cos\\omega(t - c)\\right)u(t - c).$$\n\n振子在 $0$ 与 $\\frac{2k}{\\omega^{2}}$ 之间摆动，在阶跃后半个周期到达最高点。\n\n> **注意。** 当 $\\omega(t - c) = \\pi$ 时余弦为 $-1$，括号等于 $1 - (-1) = 2$，振子位于最高点，而不是中心。对 $y'' + 4y = 8u(t - 1)$，在 $t = 1 + \\frac{\\pi}{2}$ 处 $y = 2 \\cdot 2 = 4$。",
        ),
        generate(rng: Rng): Problem {
          const w = rng.int(1, 5);
          const k = rng.int(1, 12) * w;
          const c = rng.int(1, 5);
          const m = rng.pick([1, 2, 3, 1, 3]);
          const cosv = m % 2 === 1 ? -1 : 1;
          const ans = Q.of(k * (1 - cosv), w * w);
          const level = Q.of(k, w * w);
          const mpi = `${m === 1 ? "" : m}\\pi`;
          const tw = w === 1 ? mpi : `\\frac{${mpi}}{${w}}`;
          const tt = `${c} + ${tw}`;
          return numberProblem({
            prompt: t(
              `$y'' + ${w * w === 1 ? "" : w * w}y = ${k}u(t - ${c})$ with $y(0) = y'(0) = 0$. Find $y(${tt})$.`,
              `$y'' + ${w * w === 1 ? "" : w * w}y = ${k}u(t - ${c})$，$y(0) = y'(0) = 0$。求 $y(${tt})$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                level,
                "That is the center of the swing; the cosine term moves the oscillator away from it.",
                "这是摆动的中心；余弦项使振子偏离中心。",
              ),
              why(
                Q.of(k * (1 + cosv), w * w),
                `That takes the cosine with the wrong sign; $\\cos ${mpi} = ${cosv}$.`,
                `这把余弦的符号弄反了；$\\cos ${mpi} = ${cosv}$。`,
              ),
              why(
                Q.of(k * (1 - cosv), w),
                `That divides by $\\omega = ${w}$; the partial fractions bring $\\frac{1}{\\omega^2}$.`,
                `这除以了 $\\omega = ${w}$；部分分式带来的是 $\\frac{1}{\\omega^2}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Invert with the delay", "带延迟求逆"],
                  t(`For $t \\ge ${c}$ the step is on.`, `当 $t \\ge ${c}$ 时阶跃已接通。`),
                  [`y(t) = ${level.toLatex()}\\left(1 - \\cos ${co(w)}(t - ${c})\\right)`],
                ],
                [
                  ["Evaluate", "求值"],
                  t("", ""),
                  [
                    `${co(w)}(t - ${c}) = ${mpi}, \\qquad \\cos ${mpi} = ${cosv}`,
                    `y = ${level.toLatex()}\\left(1 - ${inP(cosv)}\\right) = ${ans.toLatex()}`,
                  ],
                ],
              ],
              cosv === -1
                ? t(
                    `An odd multiple of $\\pi$ after the step is an odd number of half periods, which puts the oscillator at the top of its swing, $2 \\cdot ${level.toLatex()} = ${ans.toLatex()}$.`,
                    `阶跃后经过 $\\pi$ 的奇数倍，即奇数个半周期，振子位于摆动的最高点 $2 \\cdot ${level.toLatex()} = ${ans.toLatex()}$。`,
                  )
                : t(
                    "An even multiple of $\\pi$ after the step is a whole number of periods, which brings the oscillator back to where it started, $0$.",
                    "阶跃后经过 $\\pi$ 的偶数倍，即整数个周期，振子回到起点 $0$。",
                  ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.5 Solving Homogeneous Systems of ODEs Using Laplace Transforms
  {
    id: "solving-homogeneous-systems-of-odes-using-laplace-transforms",
    title: t("Solving Homogeneous Systems of ODEs Using Laplace Transforms", "用拉普拉斯变换求解齐次常微分方程组"),
    summary: t(
      "The linear system x' = A x transforms to (sI - A)X(s) = x(0), converting coupled differential equations into a matrix linear algebra problem.",
      "线性微分系统 x' = A x 变换为 (sI - A)X(s) = x(0)，将耦合微分方程组转化为矩阵代数问题求解。",
    ),
    intro: t(
      "Take $x_1' = 3x_1 + x_2$, $x_2' = 2x_1 + 2x_2$. Transforming gives $(sI - A)\\mathbf{X} = \\mathbf{x}(0)$ with $\\det(sI - A) = (s - 3)(s - 2) - 2 = s^2 - 5s + 4 = (s - 1)(s - 4)$, so the solutions are built from $e^{t}$ and $e^{4t}$.\n\nCheck: the eigenvalues of $A$ add up to the trace $3 + 2 = 5$ and multiply to the determinant $6 - 2 = 4$, and indeed $1 + 4 = 5$ and $1 \\cdot 4 = 4$.\n\nIn this lesson we solve linear systems by turning them into matrix algebra in $s$.",
      "取 $x_1' = 3x_1 + x_2$，$x_2' = 2x_1 + 2x_2$。取变换得 $(sI - A)\\mathbf{X} = \\mathbf{x}(0)$，其中 $\\det(sI - A) = (s - 3)(s - 2) - 2 = s^2 - 5s + 4 = (s - 1)(s - 4)$，所以解由 $e^{t}$ 和 $e^{4t}$ 构成。\n\n检验：$A$ 的特征值之和等于迹 $3 + 2 = 5$，之积等于行列式 $6 - 2 = 4$，而 $1 + 4 = 5$，$1 \\cdot 4 = 4$。\n\n本课我们把线性方程组变成关于 $s$ 的矩阵代数来求解。",
    ),
    prerequisites: ["solving-second-order-odes-using-laplace-transforms", "introduction-to-systems-of-linear-odes"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "resolvent-matrix-system-laplace",
        title: t("Evaluating the determinant of the characteristic matrix sI - A", "计算特征矩阵 sI - A 的行列式"),
        explanation: t(
          "Transforming a linear system gives a matrix equation, and the determinant of the shifted matrix is the characteristic polynomial of the system. For $\\mathbf{x}' = A \\mathbf{x}$, taking Laplace transforms yields $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$. The determinant $\\det(sI - A)$ is the characteristic polynomial of $A$. At $s = 0$, $\\det(0I - A) = \\det(-A) = (-1)^n \\det(A)$.\n\n> **Watch out.** The off-diagonal entries of $sI - A$ are $-b$ and $-c$, whose product $bc$ is still subtracted. For $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ the value at $s = 0$ is $12 - 2 = 10$, not $12 + 2 = 14$.",
          "对线性方程组做变换得到一个矩阵方程，平移后矩阵的行列式就是方程组的特征多项式。对系统 $\\mathbf{x}' = A \\mathbf{x}$ 取拉普拉斯变换得到 $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$。行列式 $\\det(sI - A)$ 即为 $A$ 的特征多项式。在 $s = 0$ 处，$\\det(0I - A) = \\det(-A) = (-1)^n \\det(A)$。\n\n> **注意。** $sI - A$ 的非对角元是 $-b$ 与 $-c$，它们的乘积 $bc$ 仍然要减去。对 $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$，$s = 0$ 处的值为 $12 - 2 = 10$，不是 $12 + 2 = 14$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 6);
          const d = rng.int(2, 6);
          const b = rng.int(1, 3);
          const c = rng.int(1, 3);
          const ans = a * d - b * c;
          return numberProblem({
            prompt: t(
              `Consider the system $\\mathbf{x}' = A \\mathbf{x}$ with $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$. When taking the Laplace transform $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$, evaluate the determinant $\\det(sI - A)$ at $s = 0$.`,
              `考虑微分系统 $\\mathbf{x}' = A \\mathbf{x}$，其中 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$。两边取拉普拉斯变换得 $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$。计算特征矩阵行列式 $\\det(sI - A)$ 在 $s = 0$ 处的值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                a + d,
                "That is the trace, the coefficient of $-s$; at $s = 0$ only the constant term is left.",
                "这是迹，即 $-s$ 的系数；在 $s = 0$ 处只剩常数项。",
              ),
              why(
                a * d,
                "That keeps the diagonal product and drops the off-diagonal product $bc$.",
                "这只保留了对角元之积，丢掉了非对角元之积 $bc$。",
              ),
              why(
                a * d + b * c,
                "That adds $bc$; the determinant subtracts the product of the off-diagonal entries.",
                "这加上了 $bc$；行列式要减去非对角元之积。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Form sI - A", "写出 sI - A"],
                  t("", ""),
                  [`sI - A = \\begin{pmatrix} s - ${a} & -${b} \\\\ -${c} & s - ${d} \\end{pmatrix}`],
                ],
                [
                  ["Take the determinant", "求行列式"],
                  t("", ""),
                  [`\\det(sI - A) = (s - ${a})(s - ${d}) - (-${b})(-${c}) = s^2 - ${a + d}s${ans === 0 ? "" : ` ${signed(ans)}`}`],
                ],
                [["Set s = 0", "令 s = 0"], t("", ""), [`\\det(-A) = ${a * d} - ${b * c} = ${ans}`]],
              ],
              t(
                `At $s = 0$ the matrix is $-A$, and for a $2 \\times 2$ matrix $\\det(-A) = (-1)^2\\det A = ${a} \\cdot ${d} - ${b} \\cdot ${c} = ${ans}$.`,
                `在 $s = 0$ 处矩阵为 $-A$，对 $2 \\times 2$ 矩阵 $\\det(-A) = (-1)^2\\det A = ${a} \\cdot ${d} - ${b} \\cdot ${c} = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "solving-a-triangular-system-in-the-s-domain",
        title: t("Solving a triangular system in the $s$-domain", "在 $s$ 域中求解三角方程组"),
        explanation: t(
          "For $x_1' = ax_1 + bx_2$, $x_2' = dx_2$, transforming turns the system into algebra. Solve the second equation first, then substitute:\n\n$$X_2 = \\frac{x_2(0)}{s - d}, \\qquad X_1 = \\frac{x_1(0) + bX_2}{s - a}.$$\n\nThe coupling term $bX_2$ is the only way $x_2$ influences $x_1$; leaving it out treats the equations as independent.\n\n> **Watch out.** Substitute the transform $X_2$, not the initial value $x_2(0)$. For $x_1' = -x_1 + 2x_2$, $x_2' = x_2$, $x_1(0) = 1$, $x_2(0) = 4$ at $s = 3$: $X_2 = 2$ and $X_1 = \\frac{1 + 4}{4} = \\frac{5}{4}$, not $\\frac{1 + 8}{4} = \\frac{9}{4}$.",
          "对 $x_1' = ax_1 + bx_2$，$x_2' = dx_2$，取变换后方程组变为代数方程。先解第二个方程，再代入：\n\n$$X_2 = \\frac{x_2(0)}{s - d}, \\qquad X_1 = \\frac{x_1(0) + bX_2}{s - a}.$$\n\n耦合项 $bX_2$ 是 $x_2$ 影响 $x_1$ 的唯一途径；省略它就把两个方程当成了独立的。\n\n> **注意。** 代入的是变换 $X_2$，不是初值 $x_2(0)$。对 $x_1' = -x_1 + 2x_2$，$x_2' = x_2$，$x_1(0) = 1$，$x_2(0) = 4$，在 $s = 3$ 处：$X_2 = 2$，$X_1 = \\frac{1 + 4}{4} = \\frac{5}{4}$，不是 $\\frac{1 + 8}{4} = \\frac{9}{4}$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.pick([-3, -2, -1, 1, 2, 3]);
          let d = rng.pick([-3, -2, -1, 1, 2, 3]);
          if (d === a) d = -a;
          const b = rng.int(-4, 5) || 2;
          const x1 = rng.int(-3, 5);
          const x2 = rng.int(1, 5);
          const s0 = Math.max(a, d) + rng.int(1, 3);
          const X2 = Q.of(x2, s0 - d);
          const ans = Q.of(x1)
            .add(Q.of(b).mul(X2))
            .div(Q.of(s0 - a));
          const own = Q.of(x1, s0 - a);
          const coupled = Q.of(b * x2, (s0 - a) * (s0 - d));
          const over = (n: string, den: string, one: boolean): string => (one ? n : `\\frac{${n}}{${den}}`);
          const ownF = over(`${x1}`, `${s0 - a}`, s0 - a === 1);
          const coupledF = over(
            `${inP(b)} \\cdot ${x2}`,
            s0 - d === 1 ? `${s0 - a}` : s0 - a === 1 ? `${s0 - d}` : `${s0 - a} \\cdot ${s0 - d}`,
            (s0 - a) * (s0 - d) === 1,
          );
          return numberProblem({
            prompt: t(
              `For $x_1' = ${co(a)}x_1 ${signed(b).replace(/ 1$/, " ")}x_2$, $x_2' = ${co(d)}x_2$ with $x_1(0) = ${x1}$, $x_2(0) = ${x2}$, find $X_1(${s0})$, where $X_1 = \\mathcal{L}\\{x_1\\}$.`,
              `对 $x_1' = ${co(a)}x_1 ${signed(b).replace(/ 1$/, " ")}x_2$，$x_2' = ${co(d)}x_2$，$x_1(0) = ${x1}$，$x_2(0) = ${x2}$，求 $X_1(${s0})$，其中 $X_1 = \\mathcal{L}\\{x_1\\}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                own,
                "That leaves out the coupling term $bX_2$, as if $x_2$ had no effect on $x_1$.",
                "这漏掉了耦合项 $bX_2$，好像 $x_2$ 对 $x_1$ 没有影响。",
              ),
              why(X2, "That is $X_2$; the question asks for $X_1$.", "这是 $X_2$；题目问的是 $X_1$。"),
              why(
                Q.of(x1 + b * x2, s0 - a),
                "That substitutes the initial value $x_2(0)$ where the transform $X_2$ belongs.",
                "这在应代入变换 $X_2$ 的地方代入了初值 $x_2(0)$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Solve the second equation", "解第二个方程"],
                  t("It does not involve $x_1$.", "它不含 $x_1$。"),
                  [`sX_2 - ${x2} = ${co(d)}X_2`, `X_2(${s0}) = \\frac{${x2}}{${s0} - ${inP(d)}} = ${X2.toLatex()}`],
                ],
                [
                  ["Substitute into the first", "代入第一个方程"],
                  t("", ""),
                  [
                    `sX_1 - ${inP(x1)} = ${co(a)}X_1 ${signed(b).replace(/ 1$/, " ")}X_2`,
                    `X_1(${s0}) = \\frac{${x1} + ${inP(b)} \\cdot ${X2.toLatex()}}{${s0} - ${inP(a)}} = ${ans.toLatex()}`,
                  ],
                ],
              ],
              t(
                `Split $X_1(${s0})$ into the part from $x_1(0)$, $${ownF}$, and the part carried over from $x_2$, $${coupledF}$. They are $${own.toLatex()}$ and $${coupled.toLatex()}$, which add to $${ans.toLatex()}$.`,
                `把 $X_1(${s0})$ 拆成来自 $x_1(0)$ 的部分 $${ownF}$ 与由 $x_2$ 传来的部分 $${coupledF}$。它们分别为 $${own.toLatex()}$ 与 $${coupled.toLatex()}$，之和为 $${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 5.19.6 Solving Inhomogeneous Systems of ODEs Using Laplace Transforms
  {
    id: "solving-inhomogeneous-systems-of-odes-using-laplace-transforms",
    title: t("Solving Inhomogeneous Systems of ODEs Using Laplace Transforms", "用拉普拉斯变换求解非齐次常微分方程组"),
    summary: t(
      "Inhomogeneous linear systems x' = A x + f(t) transform algebraically to (sI - A)X(s) = x(0) + F(s), resolved by matrix inversion.",
      "非齐次线性系统 x' = A x + f(t) 经拉普拉斯变换转化为代数方程 (sI - A)X(s) = x(0) + F(s)，通过矩阵求逆直接求解。",
    ),
    intro: t(
      "Take $x_1' = -2x_1 + 6$ with $x_1(0) = 0$. Then $(s + 2)X_1 = \\frac{6}{s}$, so $X_1 = \\frac{6}{s(s + 2)} = \\frac{3}{s} - \\frac{3}{s + 2}$ and $x_1 = 3\\left(1 - e^{-2t}\\right)$, which settles at $3$.\n\nCheck: at $x_1 = 3$ the right side is $-6 + 6 = 0$, so $3$ is the equilibrium, and the final value theorem gives $\\lim_{s \\to 0} sX_1 = \\frac{6}{2} = 3$.\n\nIn this lesson we solve forced linear systems with Laplace transforms.",
      "取 $x_1' = -2x_1 + 6$，$x_1(0) = 0$。则 $(s + 2)X_1 = \\frac{6}{s}$，所以 $X_1 = \\frac{6}{s(s + 2)} = \\frac{3}{s} - \\frac{3}{s + 2}$，$x_1 = 3\\left(1 - e^{-2t}\\right)$，最终稳定在 $3$。\n\n检验：当 $x_1 = 3$ 时右边为 $-6 + 6 = 0$，所以 $3$ 是平衡值；终值定理也给出 $\\lim_{s \\to 0} sX_1 = \\frac{6}{2} = 3$。\n\n本课我们用拉普拉斯变换求解有外力的线性方程组。",
    ),
    prerequisites: ["solving-homogeneous-systems-of-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "inhomogeneous-system-transfer-function",
        title: t("Steady-state component in an uncoupled inhomogeneous system", "非齐次解耦系统中的稳态分量"),
        explanation: t(
          "When the equations are uncoupled, each component can be transformed and solved on its own, and its long term value is its steady state. For $x_1' = -a x_1 + c_1$ with $x_1(0) = 0$, transforming gives $(s + a)X_1(s) = \\frac{c_1}{s}$, so $x_1(t) = \\frac{c_1}{a}(1 - e^{-at})$. The steady-state component is $\\lim_{t \\to \\infty} x_1(t) = \\frac{c_1}{a}$.\n\n> **Watch out.** The equilibrium is where $x_1' = 0$, so $ax_1 = c_1$ and $x_1 = \\frac{c_1}{a}$, not $c_1$. For $x_1' = -4x_1 + 20$ it is $5$.",
          "当方程互不耦合时，每个分量都可以单独变换和求解，它的长期值就是稳态。对于 $x_1' = -a x_1 + c_1$（$x_1(0) = 0$），取变换得 $(s + a)X_1(s) = \\frac{c_1}{s}$，解得 $x_1(t) = \\frac{c_1}{a}(1 - e^{-at})$。其稳态极限为 $\\lim_{t \\to \\infty} x_1(t) = \\frac{c_1}{a}$。\n\n> **注意。** 平衡值满足 $x_1' = 0$，所以 $ax_1 = c_1$，$x_1 = \\frac{c_1}{a}$，不是 $c_1$。对 $x_1' = -4x_1 + 20$，平衡值是 $5$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 6);
          const ans = rng.int(2, 35);
          const c1 = ans * a;
          return numberProblem({
            prompt: t(
              `A first-order inhomogeneous system includes the component equation $x_1' = -${a}x_1 + ${c1}$ with $x_1(0) = 0$. Using the Laplace transform, determine the long-term equilibrium value $\\lim_{t \\to \\infty} x_1(t)$.`,
              `一阶非齐次系统包含分量方程 $x_1' = -${a}x_1 + ${c1}$，初值 $x_1(0) = 0$。利用拉普拉斯变换，求该分量的长期平衡值 $\\lim_{t \\to \\infty} x_1(t)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(c1, `That is the forcing; the equilibrium divides it by $${a}$.`, `这是外力项；平衡值还要除以 $${a}$。`),
              why(
                0,
                "That is the starting value; the exponential term dies away and $x_1$ rises to the equilibrium.",
                "这是初始值；指数项衰减后 $x_1$ 升到平衡值。",
              ),
              why(
                Q.of(a, c1),
                `That divides $${a}$ by $${c1}$; the equilibrium is $${c1}$ divided by $${a}$.`,
                `这用 $${a}$ 除以 $${c1}$；平衡值是 $${c1}$ 除以 $${a}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the equation", "对方程取变换"],
                  t("", ""),
                  [`sX_1 - 0 = -${a}X_1 + \\frac{${c1}}{s}`, `X_1 = \\frac{${c1}}{s(s + ${a})}`],
                ],
                [
                  ["Split and invert", "拆分并求逆"],
                  t("", ""),
                  [`X_1 = \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}}`, `x_1(t) = ${ans}\\left(1 - e^{-${a}t}\\right) \\to ${ans}`],
                ],
              ],
              t(
                `At the equilibrium $x_1' = 0$, so $${a}x_1 = ${c1}$ and $x_1 = ${ans}$.`,
                `在平衡状态 $x_1' = 0$，所以 $${a}x_1 = ${c1}$，$x_1 = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-long-run-value-of-a-cascade-by-the-final-value-theorem",
        title: t("The long-run value of a cascade by the final value theorem", "用终值定理求级联系统的长期值"),
        explanation: t(
          "For the cascade $x_2' = -bx_2 + k$, $x_1' = -ax_1 + x_2$ starting at $0$, the transforms are\n\n$$X_2 = \\frac{k}{s(s + b)}, \\qquad X_1 = \\frac{X_2}{s + a} = \\frac{k}{s(s + a)(s + b)}.$$\n\nWhen the limit exists, the final value theorem gives $\\lim_{t \\to \\infty}x(t) = \\lim_{s \\to 0}sX(s)$, so $x_1 \\to \\frac{k}{ab}$ without inverting the transform.\n\n> **Watch out.** The first stage is fed by $x_2$, which settles at $\\frac{k}{b}$, so divide by both rates. For $x_2' = -2x_2 + 12$ and $x_1' = -3x_1 + x_2$, $x_1 \\to \\frac{12}{6} = 2$, not $\\frac{12}{3} = 4$.",
          "对从 $0$ 出发的级联系统 $x_2' = -bx_2 + k$，$x_1' = -ax_1 + x_2$，变换为\n\n$$X_2 = \\frac{k}{s(s + b)}, \\qquad X_1 = \\frac{X_2}{s + a} = \\frac{k}{s(s + a)(s + b)}.$$\n\n当极限存在时，终值定理给出 $\\lim_{t \\to \\infty}x(t) = \\lim_{s \\to 0}sX(s)$，所以无需求逆变换即得 $x_1 \\to \\frac{k}{ab}$。\n\n> **注意。** 第一级由 $x_2$ 驱动，而 $x_2$ 稳定在 $\\frac{k}{b}$，所以要除以两个速率。对 $x_2' = -2x_2 + 12$ 与 $x_1' = -3x_1 + x_2$，$x_1 \\to \\frac{12}{6} = 2$，不是 $\\frac{12}{3} = 4$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 6);
          const b = rng.int(2, 6);
          const k = rng.int(2, 40);
          const ans = Q.of(k, a * b);
          const x2 = Q.of(k, b);
          return numberProblem({
            prompt: t(
              `$x_1' = -${a}x_1 + x_2$ and $x_2' = -${b}x_2 + ${k}$, with $x_1(0) = x_2(0) = 0$. Use the final value theorem to find $\\lim_{t \\to \\infty}x_1(t)$.`,
              `$x_1' = -${a}x_1 + x_2$，$x_2' = -${b}x_2 + ${k}$，$x_1(0) = x_2(0) = 0$。用终值定理求 $\\lim_{t \\to \\infty}x_1(t)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                x2,
                "That is the long-run value of $x_2$; $x_1$ divides it by $a$ once more.",
                "这是 $x_2$ 的长期值；$x_1$ 还要再除以 $a$。",
              ),
              why(
                Q.of(k, a),
                `That feeds $x_1$ with $${k}$; its input is $x_2$, which settles at $${x2.toLatex()}$.`,
                `这让 $x_1$ 以 $${k}$ 为输入；它的输入是 $x_2$，而 $x_2$ 稳定在 $${x2.toLatex()}$。`,
              ),
              why(
                Q.of(k, a + b),
                "That adds the two rates; the stages in a cascade multiply them.",
                "这把两个速率相加了；级联中两级的速率相乘。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Transform the second equation", "变换第二个方程"],
                  t("", ""),
                  [`sX_2 = -${b}X_2 + \\frac{${k}}{s}, \\qquad X_2 = \\frac{${k}}{s(s + ${b})}`],
                ],
                [
                  ["Transform the first equation", "变换第一个方程"],
                  t("", ""),
                  [`sX_1 = -${a}X_1 + X_2, \\qquad X_1 = \\frac{${k}}{s(s + ${a})(s + ${b})}`],
                ],
                [
                  ["Apply the final value theorem", "应用终值定理"],
                  t("", ""),
                  [`\\lim_{s \\to 0} sX_1 = \\frac{${k}}{${a} \\cdot ${b}} = ${ans.toLatex()}`],
                ],
              ],
              t(
                `At equilibrium $x_2' = 0$ gives $x_2 = ${x2.toLatex()}$, and then $x_1' = 0$ gives $${a}x_1 = ${x2.toLatex()}$, so $x_1 = ${ans.toLatex()}$.`,
                `平衡时由 $x_2' = 0$ 得 $x_2 = ${x2.toLatex()}$，再由 $x_1' = 0$ 得 $${a}x_1 = ${x2.toLatex()}$，所以 $x_1 = ${ans.toLatex()}$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
