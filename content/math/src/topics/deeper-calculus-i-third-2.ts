// Third knowledge points for thin topics of Calculus I, from extrema to integrals:
// the reverse question, a harder case or a common trap. See
// `deeperCalculusIThird2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, paren, poly, Q } from "@ga/subject-math";

import { functionProblem } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** minus writes x - a with the sign tidied. */
const minus = (a: number) => linear(1, -a);
/** power writes (x - a) raised to n, without brackets when a is 0. */
const power = (a: number, n: number) => (a === 0 ? `x^{${n}}` : `(${minus(a)})^{${n}}`);
/** same2 writes one formula as a pair for both languages. */
const same2 = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];

const criticalNotExtreme = point(
  "critical-points-that-are-not-extrema",
  ["Critical points that are not extrema", "不是极值点的临界点"],
  [
    "A critical point is only a candidate. There is a local extremum only where $f'$ changes sign. A squared factor in $f'$ gives a critical point where $f'$ keeps its sign, so $f$ has no extremum there.",
    "临界点只是候选点。只有在 $f'$ 变号的地方才有局部极值。$f'$ 中的平方因式给出的临界点处 $f'$ 不变号，所以 $f$ 在那里没有极值。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x !== a));
    const k = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const d = poly([k, b === 0 ? `x(${minus(a)})^{2}` : `${power(a, 2)}(${minus(b)})`]);
    return ask(
      [
        `$f'(x) = ${d}$, so $f$ has critical points at $x = ${Math.min(a, b)}$ and $x = ${Math.max(a, b)}$ but only one local extremum. At which $x$ is it?`,
        `$f'(x) = ${d}$，所以 $f$ 的临界点是 $x = ${Math.min(a, b)}$ 和 $x = ${Math.max(a, b)}$，但只有一个局部极值。它在哪个 $x$ 处？`,
      ],
      b,
      [a, a + b, -b],
      [
        `$${power(a, 2)}$ does not change sign at $x = ${a}$, so $f'$ keeps its sign there and there is no extremum. $f'$ changes sign only at $x = ${b}$.`,
        `$${power(a, 2)}$ 在 $x = ${a}$ 处不变号，所以 $f'$ 在那里符号不变，没有极值。$f'$ 只在 $x = ${b}$ 处变号。`,
      ],
    );
  },
);

const openEndpoints = point(
  "extrema-on-an-interval-that-is-not-closed",
  ["Extrema on an interval that is not closed", "非闭区间上的最值"],
  [
    "The extreme value theorem needs a closed interval. Without it an extremum may still exist, but must be checked: an interior minimum is still attained, while values rising toward an excluded endpoint have no maximum, since no point reaches the bound.",
    "极值定理要求闭区间。没有这个条件时最值仍可能存在，但必须逐一检查：区间内部的最小值仍能取到；而函数值趋向被排除的端点时不断增大，就没有最大值，因为没有哪个点能达到那个上界。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((x) => x !== a));
    const k = rng.int(-9, 9);
    const closedLeft = rng.bool();
    const closedRight = closedLeft ? false : rng.bool();
    const leftFar = a > b;
    const attained = leftFar ? closedLeft : closedRight;
    const top = Math.max(a, b) ** 2 + k;
    const set = `${closedLeft ? "[" : "("}${-a}, ${b}${closedRight ? "]" : ")"}`;
    const f = poly([1, "x^{2}"], [k, ""]);
    const withMax: Pair = [`Minimum $${k}$ and maximum $${top}$`, `最小值 $${k}$，最大值 $${top}$`];
    const noMax: Pair = [`Minimum $${k}$ and no maximum`, `最小值 $${k}$，没有最大值`];
    return choose(
      rng,
      [`Which describes the extreme values of $f(x) = ${f}$ on $${set}$?`, `$f(x) = ${f}$ 在 $${set}$ 上的最值情况是哪一项？`],
      attained ? withMax : noMax,
      [
        attained ? noMax : withMax,
        [`No minimum and no maximum, because the interval is not closed`, `没有最小值也没有最大值，因为区间不是闭区间`],
        [`No minimum and maximum $${top}$`, `没有最小值，最大值 $${top}$`],
      ],
      [
        `The minimum $${k}$ occurs at the interior point $x = 0$. The largest values are near the farther endpoint, $x = ${leftFar ? -a : b}$, where they approach $${top}$. That endpoint is ${attained ? `included, so $${top}$ is the maximum` : `excluded, so $${top}$ is never reached and there is no maximum`}.`,
        `最小值 $${k}$ 在内部点 $x = 0$ 处取到。最大的函数值出现在较远的端点 $x = ${leftFar ? -a : b}$ 附近，趋于 $${top}$。这个端点${attained ? `包含在区间内，所以 $${top}$ 是最大值` : `不在区间内，所以 $${top}$ 取不到，没有最大值`}。`,
      ],
    );
  },
);

const coefficientFromInflection = point(
  "a-coefficient-from-the-location-of-an-inflection-point",
  ["A coefficient from the location of an inflection point", "由拐点位置求系数"],
  [
    "The reverse of finding an inflection point: for a cubic, $f''$ is linear and changes sign at its zero, so requiring $f''(c) = 0$ gives an equation for an unknown coefficient. The linear and constant terms of $f$ do not matter.",
    "这是求拐点的逆问题：三次函数的 $f''$ 是一次函数，在其零点处变号，所以令 $f''(c) = 0$ 就得到未知系数的方程。$f$ 的一次项和常数项不起作用。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const c = nz(rng, 6);
    const m = rng.int(-9, 9);
    const n = rng.int(-9, 9);
    const answer = -3 * a * c;
    const f = poly([a, "x^{3}"], [1, "kx^{2}"], [m, "x"], [n, ""]);
    return ask(
      [
        `The graph of $f(x) = ${f}$ has its point of inflection at $x = ${c}$. Find $k$.`,
        `$f(x) = ${f}$ 的图像在 $x = ${c}$ 处有拐点。求 $k$。`,
      ],
      answer,
      [-answer, -6 * a * c, -a * c],
      [
        `$f''(x) = ${poly([6 * a, "x"])} + 2k$. Setting $f''(${c}) = 0$ gives $${6 * a * c} + 2k = 0$, so $k = ${answer}$.`,
        `$f''(x) = ${poly([6 * a, "x"])} + 2k$。令 $f''(${c}) = 0$，得 $${6 * a * c} + 2k = 0$，所以 $k = ${answer}$。`,
      ],
    );
  },
);

const cornerOfSegments = point(
  "the-derivative-at-a-corner",
  ["The derivative at a corner", "折点处的导数"],
  [
    "On a piecewise-linear graph each segment has its own slope. At the point where two segments meet, the derivative exists only if the slopes agree; at a true corner the one-sided slopes differ and the derivative does not exist, even though $f$ is continuous there.",
    "在折线图像上，每条线段有自己的斜率。在两条线段的交点处，只有斜率相同时导数才存在；在真正的折点处，两侧斜率不同，导数不存在，尽管 $f$ 在那里连续。",
  ],
  (rng) => {
    const x1 = rng.int(-3, 3);
    const w1 = rng.int(1, 3);
    const w2 = rng.int(1, 3);
    const m1 = nz(rng, 4);
    const m2 = rng.bool(0.25) ? m1 : rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((x) => x !== m1));
    const y1 = rng.int(-5, 5);
    const path = `$(${x1 - w1}, ${y1 - m1 * w1})$, $(${x1}, ${y1})$, $(${x1 + w2}, ${y1 + m2 * w2})$`;
    const none: Pair = [`It does not exist`, `不存在`];
    const num = (v: Q | number): Pair => same2(v instanceof Q ? v.toLatex() : String(v));
    const avg = Q.of(m1 + m2, 2);
    return choose(
      rng,
      [
        `The graph of $f$ is made of line segments joining ${path}, in that order. Find $f'(${x1})$.`,
        `$f$ 的图像由依次连接 ${path} 的线段组成。求 $f'(${x1})$。`,
      ],
      m1 === m2 ? num(m1) : none,
      m1 === m2 ? [none, num(m1 + 1), num(-m1)] : [num(m1), num(m2), num(avg)],
      [
        `The slope is $${m1}$ on the left and $${m2}$ on the right. ${m1 === m2 ? `They agree, so the two segments form one line and $f'(${x1}) = ${m1}$.` : "They differ, so the graph has a corner and the derivative does not exist."}`,
        `左侧斜率是 $${m1}$，右侧斜率是 $${m2}$。${m1 === m2 ? `二者相同，所以两条线段构成一条直线，$f'(${x1}) = ${m1}$。` : "二者不同，所以图像有折点，导数不存在。"}`,
      ],
    );
  },
);

const peakOfDerivative = point(
  "a-peak-of-the-derivative-is-not-a-peak-of-the-function",
  ["A peak of the derivative is not a peak of the function", "导数的峰值不是函数的峰值"],
  [
    "It is easy to read the graph of $f'$ as if it were $f$. The height of $f'$ gives the slope of $f$: its sign shows whether $f$ rises or falls. A local maximum or minimum of $f'$ is where the slope is most extreme, which is an inflection point of $f$, not an extremum.",
    "很容易把 $f'$ 的图像误读成 $f$ 的图像。$f'$ 的高度给出 $f$ 的斜率：它的符号说明 $f$ 上升还是下降。$f'$ 的局部极大或极小值是斜率最极端的地方，那是 $f$ 的拐点，而不是极值点。",
  ],
  (rng) => {
    const c = rng.int(-6, 6);
    const v = nz(rng, 9);
    const peak = rng.bool();
    const dir: Pair = v > 0 ? ["increasing", "递增"] : ["decreasing", "递减"];
    return choose(
      rng,
      [
        `The graph of $f'$ has a local ${peak ? "maximum" : "minimum"} at $(${c}, ${v})$. Which is true of $f$ at $x = ${c}$?`,
        `$f'$ 的图像在 $(${c}, ${v})$ 处有局部${peak ? "极大值" : "极小值"}。关于 $f$ 在 $x = ${c}$ 处，哪项正确？`,
      ],
      [`$f$ is ${dir[0]} and has a point of inflection`, `$f$ ${dir[1]}，并且有拐点`],
      [
        [`$f$ has a local ${peak ? "maximum" : "minimum"}`, `$f$ 有局部${peak ? "极大值" : "极小值"}`],
        [`$f$ has the value $${v}$ and a horizontal tangent`, `$f$ 的值是 $${v}$，并且有水平切线`],
        [`$f$ is ${v > 0 ? "decreasing" : "increasing"} and has a point of inflection`, `$f$ ${v > 0 ? "递减" : "递增"}，并且有拐点`],
      ],
      [
        `Since $f'(${c}) = ${v} ${v > 0 ? "> 0" : "< 0"}$, $f$ is ${dir[0]} there, so it is not an extremum. And $f'$ switches between increasing and decreasing at $x = ${c}$, so $f$ changes concavity: a point of inflection.`,
        `因为 $f'(${c}) = ${v} ${v > 0 ? "> 0" : "< 0"}$，所以 $f$ 在那里${dir[1]}，不是极值点。而 $f'$ 在 $x = ${c}$ 处从递增变为递减或相反，所以 $f$ 改变凹凸性：这是拐点。`,
      ],
    );
  },
);

const shapeFromDerivativeValues = point(
  "the-shape-from-values-of-the-derivative",
  ["The shape from values of the derivative", "由导数值判断形状"],
  [
    "Two separate readings: the sign of $f'$ says whether $f$ rises or falls, and whether $f'$ goes up or down says the concavity. So negative values of $f'$ moving toward zero mean $f$ falls, more and more slowly, and is concave up.",
    "这是两个独立的判断：$f'$ 的符号说明 $f$ 上升还是下降，$f'$ 的增减说明凹凸性。所以 $f'$ 的负值逐渐接近零，意味着 $f$ 在下降且越降越慢，图像上凹。",
  ],
  (rng) => {
    const x0 = rng.int(-6, 3);
    const w = rng.int(1, 2);
    const positive = rng.bool();
    const up = rng.bool();
    const steps = [rng.int(1, 5), rng.int(1, 5)];
    const lo = rng.int(1, 6);
    const mags = [lo, lo + steps[0]!, lo + steps[0]! + steps[1]!];
    const rising = positive ? up : !up;
    const ordered = rising ? mags : [...mags].reverse();
    const vals = ordered.map((m) => (positive ? m : -m));
    const xs = [x0, x0 + w, x0 + 2 * w];
    const table = `| $x$ | ${xs.map((x) => `$${x}$`).join(" | ")} |\n| :---: | :---: | :---: | :---: |\n| $f'(x)$ | ${vals.map((v) => `$${v}$`).join(" | ")} |`;
    const text = (inc: boolean, cup: boolean): Pair => [
      `$f$ is ${inc ? "increasing" : "decreasing"} and concave ${cup ? "up" : "down"}`,
      `$f$ ${inc ? "递增" : "递减"}且${cup ? "上凹" : "下凹"}`,
    ];
    return choose(
      rng,
      [
        `The derivative $f'$ is monotonic on $[${xs[0]}, ${xs[2]}]$, keeps its sign there, and has these values.\n\n${table}\n\nWhich describes $f$ on this interval?`,
        `导数 $f'$ 在 $[${xs[0]}, ${xs[2]}]$ 上单调且不变号，取值如下。\n\n${table}\n\n$f$ 在这个区间上的情况是哪一项？`,
      ],
      text(positive, up),
      [text(!positive, up), text(positive, !up), text(!positive, !up)],
      [
        `The values of $f'$ are ${positive ? "positive, so $f$ is increasing" : "negative, so $f$ is decreasing"}. They ${up ? "increase, so $f$ is concave up" : "decrease, so $f$ is concave down"}.`,
        `$f'$ 的值${positive ? "为正，所以 $f$ 递增" : "为负，所以 $f$ 递减"}。这些值${up ? "在增大，所以 $f$ 上凹" : "在减小，所以 $f$ 下凹"}。`,
      ],
    );
  },
);

const areaUnderSlopedDerivative = point(
  "values-from-a-sloped-segment-of-the-derivative",
  ["Values from a sloped segment of the derivative", "由导数的斜线段求函数值"],
  [
    "The change in $f$ over an interval is the signed area under the graph of $f'$. When $f'$ is a sloped segment that area is a trapezoid, so the change is the average of the two end values of $f'$ times the width. Using just one end value is the common mistake.",
    "$f$ 在区间上的变化量等于 $f'$ 图像下的有向面积。当 $f'$ 是斜线段时，这个面积是梯形，所以变化量等于 $f'$ 两端值的平均数乘以宽度。只用一端的值是常见的错误。",
  ],
  (rng) => {
    const a = rng.int(-6, 2);
    const w = rng.int(2, 5);
    const b = a + w;
    const u = rng.int(-6, 6);
    const v = rng.pick([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x !== u));
    const start = rng.int(-8, 8);
    const change = Q.of((u + v) * w, 2);
    const answer = change.add(Q.of(start));
    return ask(
      [
        `The graph of $f'$ on $[${a}, ${b}]$ is the line segment from $(${a}, ${u})$ to $(${b}, ${v})$, and $f(${a}) = ${start}$. Find $f(${b})$.`,
        `$f'$ 在 $[${a}, ${b}]$ 上的图像是从 $(${a}, ${u})$ 到 $(${b}, ${v})$ 的线段，且 $f(${a}) = ${start}$。求 $f(${b})$。`,
      ],
      answer,
      [Q.of(start + v * w), Q.of(start + u * w), Q.of(start + v - u), change],
      [
        `The signed area is $\\frac{${paren(u)} + ${paren(v)}}{2} \\cdot ${w} = ${change.toLatex()}$, so $f(${b}) = ${start} + ${change.sign() < 0 ? `(${change.toLatex()})` : change.toLatex()} = ${answer.toLatex()}$.`,
        `有向面积是 $\\frac{${paren(u)} + ${paren(v)}}{2} \\cdot ${w} = ${change.toLatex()}$，所以 $f(${b}) = ${start} + ${change.sign() < 0 ? `(${change.toLatex()})` : change.toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const secondTestSilent = point(
  "when-the-second-derivative-test-says-nothing",
  ["When the second derivative test says nothing", "二阶导数判别法失效时"],
  [
    "If $f'(a) = 0$ and $f''(a) = 0$, the second derivative test gives no information: $f$ may have a minimum, a maximum or neither. Look at the sign of $f'$ on each side instead. For $k(x - a)^{n}$ this depends on whether $n$ is even or odd.",
    "如果 $f'(a) = 0$ 且 $f''(a) = 0$，二阶导数判别法不提供任何信息：$f$ 可能有极小值、极大值或都没有。这时要看 $f'$ 在两侧的符号。对 $k(x - a)^{n}$，结果取决于 $n$ 的奇偶。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const k = nz(rng, 5);
    const n = rng.int(3, 6);
    const b = rng.int(-6, 6);
    const f = poly([k, power(a, n)], [b, ""]);
    const even = n % 2 === 0;
    const min: Pair = ["A local minimum", "局部极小值"];
    const max: Pair = ["A local maximum", "局部极大值"];
    const neither: Pair = ["Neither a maximum nor a minimum", "既没有极大值也没有极小值"];
    const cannot: Pair = ["It cannot be decided, because $f''$ is zero there", "无法判断，因为 $f''$ 在该点为零"];
    const correct = even ? (k > 0 ? min : max) : neither;
    return choose(
      rng,
      [
        `$f(x) = ${f}$ has $f'(${a}) = 0$ and $f''(${a}) = 0$. What does $f$ have at $x = ${a}$?`,
        `$f(x) = ${f}$ 满足 $f'(${a}) = 0$ 且 $f''(${a}) = 0$。$f$ 在 $x = ${a}$ 处有什么？`,
      ],
      correct,
      [min, max, neither, cannot].filter((o) => o !== correct),
      [
        even
          ? `The power $${n}$ is even, so $${power(a, n)}$ is positive on both sides of $x = ${a}$ and the coefficient $${k}$ is ${k > 0 ? "positive" : "negative"}. So $f$ is ${k > 0 ? "above" : "below"} $f(${a})$ on both sides: a local ${k > 0 ? "minimum" : "maximum"}.`
          : `$f'(x) = ${poly([k * n, power(a, n - 1)])}$ has the even power $${n - 1}$, so $f'$ keeps its sign across $x = ${a}$. So there is no extremum.`,
        even
          ? `指数 $${n}$ 是偶数，所以 $${power(a, n)}$ 在 $x = ${a}$ 两侧都为正，而系数 $${k}$ ${k > 0 ? "为正" : "为负"}。所以 $f$ 在两侧都${k > 0 ? "大于" : "小于"} $f(${a})$：这是局部${k > 0 ? "极小值" : "极大值"}。`
          : `$f'(x) = ${poly([k * n, power(a, n - 1)])}$ 的指数 $${n - 1}$ 是偶数，所以 $f'$ 在 $x = ${a}$ 两侧不变号。因此没有极值。`,
      ],
    );
  },
);

const overOrUnderTrig = point(
  "whether-a-trigonometric-linearization-is-too-high-or-too-low",
  ["Whether a linearization is too high or too low", "线性近似偏高还是偏低"],
  [
    "A tangent line lies above a concave-down graph and below a concave-up one. So the sign of $f''$ on the side of the point decides whether the linearization overestimates or underestimates. Sine and tangent change concavity at $0$, so the side matters.",
    "切线位于下凹图像的上方、上凹图像的下方。所以该点那一侧 $f''$ 的符号决定线性近似是偏高还是偏低。正弦和正切在 $0$ 处改变凹凸性，所以哪一侧很重要。",
  ],
  (rng) => {
    const kind = rng.pick(["sin", "tan", "cos"] as const);
    const k = nz(rng, 5);
    const i = rng.pick([-1, 1]) * rng.int(2, 20);
    const x = Q.of(i, 100);
    const positive = i > 0;
    const f2 = kind === "sin" ? (positive ? -k : k) : kind === "tan" ? (positive ? k : -k) : -k;
    const under = f2 > 0;
    const f = poly([k, `\\${kind} x`]);
    const L = kind === "cos" ? `${k}` : poly([k, "x"]);
    const over: Pair = ["An overestimate", "偏高"];
    const low: Pair = ["An underestimate", "偏低"];
    const exact: Pair = ["Exactly right, since $x$ is so small", "完全准确，因为 $x$ 很小"];
    return choose(
      rng,
      [
        `Near $0$, the linearization of $f(x) = ${f}$ is $L(x) = ${L}$. What is $L(${dec(x)})$ compared with $f(${dec(x)})$?`,
        `在 $0$ 附近，$f(x) = ${f}$ 的线性近似是 $L(x) = ${L}$。$L(${dec(x)})$ 与 $f(${dec(x)})$ 相比如何？`,
      ],
      under ? low : over,
      [under ? over : low, exact],
      [
        `Between $0$ and $${dec(x)}$, $f''$ is ${under ? "positive, so the graph is concave up and lies above its tangent" : "negative, so the graph is concave down and lies below its tangent"}. So the linearization is ${under ? "too low" : "too high"}.`,
        `在 $0$ 与 $${dec(x)}$ 之间，$f''$ ${under ? "为正，所以图像上凹，位于切线上方" : "为负，所以图像下凹，位于切线下方"}。所以线性近似${under ? "偏低" : "偏高"}。`,
      ],
    );
  },
);

const leastPerimeterSector = point(
  "the-least-perimeter-for-a-given-area",
  ["The least perimeter for a given area", "给定面积时的最小周长"],
  [
    "This is the reverse of the largest area for a given perimeter. With area $A$ and radius $r$, the arc is $\\frac{2A}{r}$, so the perimeter is $P = 2r + \\frac{2A}{r}$. Then $P'(r) = 0$ gives $r = \\sqrt{A}$ and $P = 4\\sqrt{A}$, and the central angle is $2$ radians, as before.",
    "这是给定周长求最大面积的逆问题。面积为 $A$、半径为 $r$ 时，弧长是 $\\frac{2A}{r}$，所以周长 $P = 2r + \\frac{2A}{r}$。由 $P'(r) = 0$ 得 $r = \\sqrt{A}$，$P = 4\\sqrt{A}$，圆心角同样是 $2$ 弧度。",
  ],
  (rng) => {
    const m = rng.int(2, 40);
    const A = m * m;
    const unit = rng.pick([
      ["cm", "厘米"],
      ["m", "米"],
    ] as const);
    return ask(
      [
        `A sector of a circle has area $${A}$ ${unit[0]}². Find the least possible perimeter, in ${unit[0]}, including both radii and the arc.`,
        `一个扇形的面积是 $${A}$ 平方${unit[1]}。求它的最小周长（包括两条半径和弧），单位是${unit[1]}。`,
      ],
      4 * m,
      [2 * m, m, 3 * m, A],
      [
        `$P(r) = 2r + \\frac{${2 * A}}{r}$, and $P'(r) = 2 - \\frac{${2 * A}}{r^{2}} = 0$ gives $r = ${m}$. Then the arc is $${2 * m}$ and $P = ${m} + ${m} + ${2 * m} = ${4 * m}$.`,
        `$P(r) = 2r + \\frac{${2 * A}}{r}$，由 $P'(r) = 2 - \\frac{${2 * A}}{r^{2}} = 0$ 得 $r = ${m}$。此时弧长是 $${2 * m}$，$P = ${m} + ${m} + ${2 * m} = ${4 * m}$。`,
      ],
    );
  },
);

/** sheets are rectangular sheets whose best tray has a rational height: the two sides and that height, for scale 1. */
const sheets = [
  { w: 5, l: 8, x: Q.of(1), other: Q.of(10, 3) },
  { w: 8, l: 15, x: Q.of(5, 3), other: Q.of(6) },
  { w: 16, l: 21, x: Q.of(3), other: Q.of(28, 3) },
] as const;

const trayFromRectangle = point(
  "trays-folded-from-rectangular-sheets",
  ["Trays folded from rectangular sheets", "用长方形纸板折成的盘子"],
  [
    "With unequal sides $w$ and $l$, the volume is $V(x) = x(w - 2x)(l - 2x)$, and $V'(x) = 0$ is a quadratic with two roots. Only a root with $0 < x < \\frac{w}{2}$ makes a tray, and the shortcut $x = \\frac{w}{6}$ for a square sheet no longer applies.",
    "两边 $w$ 和 $l$ 不相等时，容积是 $V(x) = x(w - 2x)(l - 2x)$，$V'(x) = 0$ 是有两个根的二次方程。只有满足 $0 < x < \\frac{w}{2}$ 的根才能折成盘子，而且正方形纸板的简便结论 $x = \\frac{w}{6}$ 不再适用。",
  ],
  (rng) => {
    const s = rng.pick(sheets);
    const k = rng.int(1, 10);
    const w = s.w * k;
    const l = s.l * k;
    const x = s.x.mul(Q.of(k));
    const other = s.other.mul(Q.of(k));
    const vol = (h: Q) => h.mul(Q.of(w).sub(h.mul(Q.of(2)))).mul(Q.of(l).sub(h.mul(Q.of(2))));
    const six = Q.of(w, 6);
    const askVolume = rng.bool();
    const setup: Pair = [
      `An open tray is made from a $${w}$ cm by $${l}$ cm sheet by cutting equal squares from the corners and folding up the sides.`,
      `把一张 $${w}$ 厘米乘 $${l}$ 厘米的纸板四角各剪去相同的正方形，折起四边做成无盖盘子。`,
    ];
    const sol: Pair = [
      `$V'(x) = 12x^{2} - ${4 * (w + l)}x + ${w * l} = 0$ has roots $${x.toLatex()}$ and $${other.toLatex()}$. The second is more than half of $${w}$, so the height is $${x.toLatex()}$ and the volume is $${vol(x).toLatex()}$ cm³.`,
      `$V'(x) = 12x^{2} - ${4 * (w + l)}x + ${w * l} = 0$ 的根是 $${x.toLatex()}$ 和 $${other.toLatex()}$。后者超过 $${w}$ 的一半，所以高是 $${x.toLatex()}$，容积是 $${vol(x).toLatex()}$ 立方厘米。`,
    ];
    return askVolume
      ? ask(
          [`${setup[0]} Find the largest possible volume, in cm³.`, `${setup[1]}求最大容积，单位是立方厘米。`],
          vol(x),
          [vol(six), Q.of(w * l).mul(x), vol(Q.of(l, 6))],
          sol,
        )
      : ask(
          [`${setup[0]} Find the height, in cm, that gives the largest volume.`, `${setup[1]}求使容积最大的高，单位是厘米。`],
          x,
          [six, other, Q.of(l, 6)],
          sol,
        );
  },
);

const leastDistanceSquared = point(
  "the-least-distance-and-an-endpoint-trap",
  ["The least distance and an endpoint trap", "最短距离与端点陷阱"],
  [
    "To minimize distance, minimize its square. For $y = \\sqrt{kx}$ and the point $(a, 0)$, $D^{2} = (x - a)^{2} + kx$, a parabola in $x$ with vertex at $x = a - \\frac{k}{2}$. But the curve only has $x \\ge 0$: if the vertex is negative, the closest point is the endpoint $(0, 0)$.",
    "要使距离最小，就使它的平方最小。对 $y = \\sqrt{kx}$ 和点 $(a, 0)$，$D^{2} = (x - a)^{2} + kx$ 是关于 $x$ 的抛物线，顶点在 $x = a - \\frac{k}{2}$。但曲线只有 $x \\ge 0$ 的部分：如果顶点为负，最近的点就是端点 $(0, 0)$。",
  ],
  (rng) => {
    const k = rng.int(1, 8);
    const a = rng.int(1, 9);
    const vertex = Q.of(2 * a - k, 2);
    const inside = vertex.sign() > 0;
    const formula = Q.of(k * a).sub(Q.of(k * k, 4));
    const answer = inside ? formula : Q.of(a * a);
    const f = k === 1 ? "\\sqrt{x}" : `\\sqrt{${k}x}`;
    return ask(
      [
        `Find the square of the least distance from the point $(${a}, 0)$ to the curve $y = ${f}$.`,
        `求点 $(${a}, 0)$ 到曲线 $y = ${f}$ 的最短距离的平方。`,
      ],
      answer,
      [inside ? Q.of(a * a) : formula, vertex, Q.of(k * a)],
      [
        `$D^{2} = (x - ${a})^{2} + ${k}x$ has its vertex at $x = ${vertex.toLatex()}$. ${inside ? `That is on the curve, and substituting gives $D^{2} = ${answer.toLatex()}$.` : `${vertex.isZero() ? "That is the endpoint" : "That is not on the curve, so the least value on $x \\ge 0$ is at the endpoint"} $x = 0$, which gives $D^{2} = ${answer.toLatex()}$.`}`,
        `$D^{2} = (x - ${a})^{2} + ${k}x$ 的顶点在 $x = ${vertex.toLatex()}$。${inside ? `它在曲线上，代入得 $D^{2} = ${answer.toLatex()}$。` : `${vertex.isZero() ? "它就是端点" : "它不在曲线上，所以在 $x \\ge 0$ 上最小值在端点"} $x = 0$ 处取到，得 $D^{2} = ${answer.toLatex()}$。`}`,
      ],
    );
  },
);

const newtonOnQuadratic = point(
  "one-newton-step-on-a-quadratic",
  ["One Newton step on a quadratic", "二次函数上的一步牛顿法"],
  [
    "For optimization, Newton's method uses $x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}$, which is not the root-finding step $x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$. On a quadratic, $f'$ is linear, so one step lands exactly on the vertex from any start: a useful check.",
    "用于最优化时，牛顿法的迭代是 $x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}$，而不是求根的迭代 $x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$。对二次函数，$f'$ 是一次函数，所以从任何起点出发一步就恰好到达顶点：这是一个有用的检验。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 9);
    const c = rng.int(-9, 9);
    const vertex = Q.of(-b, 2 * a);
    const pick = rng.int(-6, 6);
    const x0 = 2 * a * pick + b === 0 ? pick + 1 : pick;
    const f0 = a * x0 * x0 + b * x0 + c;
    const d0 = 2 * a * x0 + b;
    const wrong = [Q.of(x0).sub(Q.of(f0, d0)), vertex.neg(), Q.of(x0).sub(Q.of(d0))];
    return ask(
      [
        `Apply one step of Newton's method for optimization to $f(x) = ${poly([a, "x^{2}"], [b, "x"], [c, ""])}$, with $x_{0} = ${x0}$. Find $x_{1}$.`,
        `对 $f(x) = ${poly([a, "x^{2}"], [b, "x"], [c, ""])}$ 用牛顿法做一步最优化迭代，取 $x_{0} = ${x0}$。求 $x_{1}$。`,
      ],
      vertex,
      wrong,
      [
        `$f'(${x0}) = ${d0}$ and $f'' = ${2 * a}$, so $x_{1} = ${x0} - \\frac{${d0}}{${2 * a}} = ${vertex.toLatex()}$, which is the vertex of the parabola.`,
        `$f'(${x0}) = ${d0}$，$f'' = ${2 * a}$，所以 $x_{1} = ${x0} - \\frac{${d0}}{${2 * a}} = ${vertex.toLatex()}$，这正是抛物线的顶点。`,
      ],
    );
  },
);

const speedingUp = point(
  "speeding-up-or-slowing-down",
  ["Speeding up or slowing down", "加速还是减速"],
  [
    "A particle speeds up when its velocity and acceleration have the same sign and slows down when they have opposite signs. A positive acceleration alone does not mean speeding up: if the particle is moving in the negative direction, it is slowing down.",
    "速度和加速度同号时质点加速，异号时质点减速。只看加速度为正并不能说明在加速：如果质点正沿负方向运动，它其实在减速。",
  ],
  (rng) => {
    const T = rng.int(1, 5);
    let b = rng.int(-9, 9);
    if (6 * T + 2 * b === 0) b += 1;
    let c = rng.int(-20, 20);
    if (3 * T * T + 2 * b * T + c === 0) c += 1;
    const v = 3 * T * T + 2 * b * T + c;
    const acc = 6 * T + 2 * b;
    const same = v > 0 === acc > 0;
    const up: Pair = [`Speeding up, because $v$ and $a$ have the same sign`, `加速，因为 $v$ 和 $a$ 同号`];
    const down: Pair = [`Slowing down, because $v$ and $a$ have opposite signs`, `减速，因为 $v$ 和 $a$ 异号`];
    const trap: Pair =
      acc > 0
        ? v < 0
          ? [`Speeding up, because $a$ is positive`, `加速，因为 $a$ 为正`]
          : [`Slowing down, because $a$ is small compared with $v$`, `减速，因为 $a$ 比 $v$ 小`]
        : v < 0
          ? [`Slowing down, because $a$ is negative`, `减速，因为 $a$ 为负`]
          : [`Speeding up, because $v$ is positive`, `加速，因为 $v$ 为正`];
    const s = poly([1, "t^{3}"], [b, "t^{2}"], [c, "t"]);
    return choose(
      rng,
      [
        `A particle has position $s(t) = ${s}$ metres after $t$ seconds. What is happening to its speed at $t = ${T}$?`,
        `质点 $t$ 秒时的位置是 $s(t) = ${s}$ 米。在 $t = ${T}$ 时它的速率如何变化？`,
      ],
      same ? up : down,
      [same ? down : up, trap, [`Neither: its speed is constant at that moment`, `都不是：此刻速率不变`]],
      [
        `$v(${T}) = ${v}$ and $a(${T}) = ${acc}$. They have ${same ? "the same sign, so the particle is speeding up" : "opposite signs, so the particle is slowing down"}.`,
        `$v(${T}) = ${v}$，$a(${T}) = ${acc}$。它们${same ? "同号，所以质点在加速" : "异号，所以质点在减速"}。`,
      ],
    );
  },
);

const coefficientFromAntiderivative = point(
  "the-constant-multiple-from-its-antiderivative",
  ["The constant multiple from its antiderivative", "由原函数求常数倍数"],
  [
    "The reverse question gives the antiderivative and asks for the constant in the integrand. Since differentiating undoes integrating, differentiate the answer: the power rule brings the exponent down, so the constant is the coefficient times the exponent, not the coefficient divided by it.",
    "反过来的问题是给出原函数，求被积函数中的常数。因为求导抵消积分，所以对结果求导：幂法则把指数乘到前面，所以这个常数等于系数乘以指数，而不是系数除以指数。",
  ],
  (rng) => {
    const n = rng.int(2, 7);
    const a = nz(rng, 9);
    const answer = a * (n + 1);
    return ask(
      [
        `$\\int kx^{${n}} \\, dx = ${poly([a, `x^{${n + 1}}`])} + C$. Find $k$.`,
        `$\\int kx^{${n}} \\, dx = ${poly([a, `x^{${n + 1}}`])} + C$。求 $k$。`,
      ],
      answer,
      [Q.of(a, n + 1), a * n, a],
      [
        `Differentiating the right side gives $${paren(a)} \\cdot ${n + 1}x^{${n}} = ${answer}x^{${n}}$, so $k = ${answer}$.`,
        `对右边求导得 $${paren(a)} \\cdot ${n + 1}x^{${n}} = ${answer}x^{${n}}$，所以 $k = ${answer}$。`,
      ],
    );
  },
);

const noProductRule = point(
  "there-is-no-product-rule-for-integrals",
  ["There is no product rule for integrals", "积分没有乘法法则"],
  [
    "The integral of a sum is the sum of the integrals, but the integral of a product is not the product of the integrals. So multiply out first and then use the sum rule. Differentiating the wrong answer with the product rule shows that it fails.",
    "和的积分等于积分的和，但积的积分不等于积分的积。所以要先展开，再用和的法则。用乘法法则对错误答案求导，就能看出它不对。",
  ],
  (rng) => {
    const a = nz(rng, 7);
    const b = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
    const answer = poly([Q.of(1, 3), "x^{3}"], [Q.of(a + b, 2), "x^{2}"], [a * b, "x"], [1, "C"]);
    const half = (c: number) => poly([Q.of(1, 2), "x^{2}"], [c, "x"]);
    const wrongOne = `\\left(${half(a)}\\right)\\left(${half(b)}\\right) + C`;
    return functionProblem({
      prompt: t(`Find $\\int (${linear(1, a)})(${linear(1, b)}) \\, dx$.`, `求 $\\int (${linear(1, a)})(${linear(1, b)}) \\, dx$。`),
      answer,
      antiderivative: true,
      wrong: [
        wrongOne,
        poly([Q.of(1, 3), "x^{3}"], [a + b, "x^{2}"], [a * b, "x"], [1, "C"]),
        poly([Q.of(1, 3), "x^{3}"], [Q.of(a + b, 2), "x^{2}"], [1, "C"]),
      ],
      solution: t(
        `Expand first: $(${linear(1, a)})(${linear(1, b)}) = ${poly([1, "x^{2}"], [a + b, "x"], [a * b, ""])}$. Integrating term by term gives $${answer}$.`,
        `先展开：$(${linear(1, a)})(${linear(1, b)}) = ${poly([1, "x^{2}"], [a + b, "x"], [a * b, ""])}$。逐项积分得 $${answer}$。`,
      ),
    });
  },
);

const hyperbolicIdentityIntegral = point(
  "integrating-with-a-hyperbolic-identity",
  ["Integrating with a hyperbolic identity", "用双曲恒等式求积分"],
  [
    "Powers such as $\\tanh^{2}x$ have no direct formula, but identities turn them into known integrals: $\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x$, $\\coth^{2}x = 1 + \\operatorname{csch}^{2}x$, and $\\cosh^{2}x - \\sinh^{2}x = 1$. The signs differ from the circular identities.",
    "$\\tanh^{2}x$ 这样的幂没有直接的公式，但恒等式能把它们化成已知积分：$\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x$，$\\coth^{2}x = 1 + \\operatorname{csch}^{2}x$，$\\cosh^{2}x - \\sinh^{2}x = 1$。这些符号与三角恒等式不同。",
  ],
  (rng) => {
    const k = nz(rng, 9);
    const kind = rng.pick(["tanh", "coth", "unit"] as const);
    const integrand =
      kind === "tanh"
        ? poly([k, "\\tanh^{2}x"])
        : kind === "coth"
          ? poly([k, "\\coth^{2}x"])
          : `${k === 1 ? "" : k === -1 ? "-" : k}\\left(\\cosh^{2}x - \\sinh^{2}x\\right)`;
    const answer = kind === "unit" ? poly([k, "x"], [1, "C"]) : poly([k, "x"], [-k, `\\${kind} x`], [1, "C"]);
    const wrong =
      kind === "unit"
        ? [poly([k, "\\sinh x"], [-k, "\\cosh x"], [1, "C"]), poly([-k, "x"], [1, "C"])]
        : [poly([k, "x"], [k, `\\${kind} x`], [1, "C"]), poly([k, `\\${kind} x`], [1, "C"])];
    const identity =
      kind === "tanh"
        ? "\\tanh^{2}x = 1 - \\operatorname{sech}^{2}x"
        : kind === "coth"
          ? "\\coth^{2}x = 1 + \\operatorname{csch}^{2}x"
          : "\\cosh^{2}x - \\sinh^{2}x = 1";
    return functionProblem({
      prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong,
      solution: t(
        `Use $${identity}$. ${kind === "unit" ? `The integrand is the constant $${k}$` : `The integral of $\\operatorname{${kind === "tanh" ? "sech" : "csch"}}^{2}x$ is $${kind === "tanh" ? "\\tanh x" : "-\\coth x"}$`}, so the result is $${answer}$.`,
        `用 $${identity}$。${kind === "unit" ? `被积函数是常数 $${k}$` : `$\\operatorname{${kind === "tanh" ? "sech" : "csch"}}^{2}x$ 的积分是 $${kind === "tanh" ? "\\tanh x" : "-\\coth x"}$`}，所以结果是 $${answer}$。`,
      ),
    });
  },
);

const arsinhScaled = point(
  "integrating-to-arsinh-with-a-coefficient-inside",
  ["Integrating to arsinh with a coefficient inside", "根号内有系数时积分为 arsinh"],
  [
    "When $x^{2}$ has a coefficient under the root, write it as a square and use a linear substitution: $\\int \\frac{dx}{\\sqrt{k^{2}x^{2} + b^{2}}} = \\frac{1}{k}\\operatorname{arsinh}\\frac{kx}{b} + C$. The factor $\\frac{1}{k}$ is what the chain rule requires, and it is easy to lose.",
    "根号下 $x^{2}$ 带系数时，把它写成平方并作线性换元：$\\int \\frac{dx}{\\sqrt{k^{2}x^{2} + b^{2}}} = \\frac{1}{k}\\operatorname{arsinh}\\frac{kx}{b} + C$。因子 $\\frac{1}{k}$ 是链式法则所要求的，很容易漏掉。",
  ],
  (rng) => {
    const [k, b] = rng.pick([
      [2, 1],
      [2, 3],
      [2, 5],
      [3, 1],
      [3, 2],
      [3, 4],
      [3, 5],
      [4, 1],
      [4, 3],
      [4, 5],
      [5, 1],
      [5, 2],
      [5, 3],
    ] as const);
    const c = rng.pick([1, 2, 3, 4, 5, 6, 8, 10, 12, -1, -2, -3, -4, -6]);
    const inner = b === 1 ? `${k}x` : `\\frac{${k}x}{${b}}`;
    const fn = `\\operatorname{arsinh}\\left(${inner}\\right)`;
    const answer = poly([Q.of(c, k), fn], [1, "C"]);
    const root = `\\sqrt{${k * k}x^{2} + ${b * b}}`;
    const squares = `(${k}x)^{2} + ${b === 1 ? "1" : `${b}^{2}`}`;
    const inU = poly([Q.of(c, k), `\\operatorname{arsinh}${b === 1 ? " u" : `\\frac{u}{${b}}`}`]);
    return functionProblem({
      prompt: t(`Find $\\int \\frac{${c}}{${root}} \\, dx$.`, `求 $\\int \\frac{${c}}{${root}} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong: [poly([c, fn], [1, "C"]), poly([Q.of(c * k), fn], [1, "C"]), poly([Q.of(c, b), fn], [1, "C"])],
      solution: t(
        `Write the root as $\\sqrt{${squares}}$ and let $u = ${k}x$, so $dx = \\frac{du}{${k}}$. The integral is $${inU} + C = ${answer}$.`,
        `把根式写成 $\\sqrt{${squares}}$，令 $u = ${k}x$，则 $dx = \\frac{du}{${k}}$。积分是 $${inU} + C = ${answer}$。`,
      ),
    });
  },
);

const artanhOrArcoth = point(
  "artanh-or-arcoth-by-the-domain",
  ["Artanh or arcoth by the domain", "由定义域选择 artanh 或 arcoth"],
  [
    "$\\frac{1}{a^{2} - x^{2}}$ has two antiderivatives of the same form, and the domain chooses: $\\frac{1}{a}\\operatorname{artanh}\\frac{x}{a}$ for $|x| < a$ and $\\frac{1}{a}\\operatorname{arcoth}\\frac{x}{a}$ for $|x| > a$. Neither function is defined on the other's interval.",
    "$\\frac{1}{a^{2} - x^{2}}$ 有两个形式相同的原函数，由定义域决定选哪个：$|x| < a$ 时是 $\\frac{1}{a}\\operatorname{artanh}\\frac{x}{a}$，$|x| > a$ 时是 $\\frac{1}{a}\\operatorname{arcoth}\\frac{x}{a}$。这两个函数都在对方的区间上没有定义。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = nz(rng, 9);
    const inside = rng.bool();
    const coef = Q.of(c, a);
    const fn = (name: string, co: Q) => `${poly([co, `\\operatorname{${name}}\\frac{x}{${a}}`])} + C`;
    const right = inside ? "artanh" : "arcoth";
    const other = inside ? "arcoth" : "artanh";
    return choose(
      rng,
      [
        `Find $\\int \\frac{${c}}{${a * a} - x^{2}} \\, dx$ for $|x| ${inside ? "<" : ">"} ${a}$.`,
        `当 $|x| ${inside ? "<" : ">"} ${a}$ 时，求 $\\int \\frac{${c}}{${a * a} - x^{2}} \\, dx$。`,
      ],
      same2(fn(right, coef)),
      [same2(fn(other, coef)), same2(fn(right, Q.of(c))), same2(fn(other, Q.of(c)))],
      [
        `Here $a = ${a}$ and $|x| ${inside ? "<" : ">"} a$, so $\\frac{x}{${a}}$ is in the domain of $\\operatorname{${right}}$. The chain rule gives the factor $\\frac{1}{${a}}$, and the result is $${fn(right, coef)}$.`,
        `这里 $a = ${a}$，$|x| ${inside ? "<" : ">"} a$，所以 $\\frac{x}{${a}}$ 在 $\\operatorname{${right}}$ 的定义域内。链式法则给出因子 $\\frac{1}{${a}}$，结果是 $${fn(right, coef)}$。`,
      ],
    );
  },
);

/** gridWidth picks a subinterval width for a sum with values at equally spaced points. */
const gridWidth = (rng: Rng) => rng.pick([Q.of(1, 2), Q.of(1), Q.of(2), Q.of(1, 4), Q.of(3, 2)]);

const rightFromLeft = point(
  "the-right-sum-from-the-left-sum",
  ["The right sum from the left sum", "由左和求右和"],
  [
    "Left and right sums share all sample points except one at each end: the left uses $f(a)$ and the right uses $f(b)$. So $R_{n} = L_{n} + \\Delta x\\,(f(b) - f(a))$, without adding up everything again.",
    "左和与右和除两端各一点外，取样点都相同：左和用 $f(a)$，右和用 $f(b)$。所以 $R_{n} = L_{n} + \\Delta x\\,(f(b) - f(a))$，不必再把所有项加一遍。",
  ],
  (rng) => {
    const w = gridWidth(rng);
    const L = rng.int(10, 90);
    const fa = rng.int(-9, 9);
    const fb = rng.int(-9, 9);
    const gap = Q.of(fb - fa);
    const answer = Q.of(L).add(w.mul(gap));
    const n = rng.int(4, 12);
    const a = rng.int(-4, 4);
    const b = Q.of(a).add(w.mul(Q.of(n)));
    return ask(
      [
        `A left Riemann sum for $f$ on $[${a}, ${b.toLatex()}]$ with $${n}$ equal subintervals is $${L}$, and $f(${a}) = ${fa}$, $f\\left(${b.toLatex()}\\right) = ${fb}$. Find the right Riemann sum.`,
        `$f$ 在 $[${a}, ${b.toLatex()}]$ 上分成 $${n}$ 个等宽子区间的左黎曼和是 $${L}$，且 $f(${a}) = ${fa}$，$f\\left(${b.toLatex()}\\right) = ${fb}$。求右黎曼和。`,
      ],
      answer,
      [Q.of(L).sub(w.mul(gap)), Q.of(L).add(gap), Q.of(L + fb), Q.of(L).add(w.mul(Q.of(fb + fa)))],
      [
        `Here $\\Delta x = ${w.toLatex()}$. The right sum drops $f(${a}) \\Delta x$ and gains $f\\left(${b.toLatex()}\\right) \\Delta x$, so it is $${L} + ${w.toLatex()} \\cdot (${paren(fb)} - ${paren(fa)}) = ${answer.toLatex()}$.`,
        `这里 $\\Delta x = ${w.toLatex()}$。右和去掉 $f(${a}) \\Delta x$，加上 $f\\left(${b.toLatex()}\\right) \\Delta x$，所以等于 $${L} + ${w.toLatex()} \\cdot (${paren(fb)} - ${paren(fa)}) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const midpointOfLine = point(
  "midpoint-sums-of-linear-functions-are-exact",
  ["Midpoint sums of linear functions are exact", "一次函数的中点和是精确的"],
  [
    "On each subinterval, the midpoint rectangle of a line has the same area as the true trapezoid, since the errors on the two halves cancel. So for a linear function, the midpoint sum equals the exact area for any number of subintervals, and no long addition is needed.",
    "在每个子区间上，直线的中点矩形与真实的梯形面积相同，因为两半的误差相互抵消。所以对一次函数，无论分成多少个子区间，中点和都等于精确面积，不需要长长的加法。",
  ],
  (rng) => {
    const m = nz(rng, 6);
    const c = rng.int(-9, 9);
    const a = rng.int(-4, 4);
    const b = a + rng.int(2, 8);
    const n = rng.pick([50, 100, 200, 500]);
    const exact = Q.of(m * (b * b - a * a), 2).add(Q.of(c * (b - a)));
    const width = Q.of(b - a, n);
    const left = exact.sub(
      Q.of(m)
        .mul(width)
        .mul(Q.of(b - a))
        .div(Q.of(2)),
    );
    const f = linear(m, c);
    return ask(
      [
        `Find the midpoint Riemann sum of $f(x) = ${f}$ on $[${a}, ${b}]$ with $${n}$ subintervals of equal width.`,
        `求 $f(x) = ${f}$ 在 $[${a}, ${b}]$ 上分成 $${n}$ 个等宽子区间的中点黎曼和。`,
      ],
      exact,
      [left, Q.of(m * a + c).mul(Q.of(b - a)), Q.of(m * b + c).mul(Q.of(b - a))],
      [
        `$f$ is linear, so the midpoint sum equals $\\int_{${a}}^{${b}} (${f}) \\, dx$ for every $n$. Equivalently, the $x$-values average $${Q.of(a + b, 2).toLatex()}$, so the sum is $${b - a} \\cdot f\\left(${Q.of(a + b, 2).toLatex()}\\right) = ${exact.toLatex()}$.`,
        `$f$ 是一次函数，所以对每个 $n$，中点和都等于 $\\int_{${a}}^{${b}} (${f}) \\, dx$。也可以这样看：各 $x$ 值的平均是 $${Q.of(a + b, 2).toLatex()}$，所以这个和是 $${b - a} \\cdot f\\left(${Q.of(a + b, 2).toLatex()}\\right) = ${exact.toLatex()}$。`,
      ],
    );
  },
);

const trapezoidFromLeft = point(
  "the-trapezoidal-rule-from-the-left-sum",
  ["The trapezoidal rule from the left sum", "由左和求梯形法则的值"],
  [
    "The trapezoidal approximation is the average of the left and right sums, $T_{n} = \\frac{L_{n} + R_{n}}{2}$. Since $R_{n}$ differs from $L_{n}$ only at the ends, $T_{n} = L_{n} + \\frac{\\Delta x}{2}(f(b) - f(a))$.",
    "梯形近似是左和与右和的平均：$T_{n} = \\frac{L_{n} + R_{n}}{2}$。因为 $R_{n}$ 与 $L_{n}$ 只在两端不同，所以 $T_{n} = L_{n} + \\frac{\\Delta x}{2}(f(b) - f(a))$。",
  ],
  (rng) => {
    const w = gridWidth(rng);
    const L = rng.int(10, 90);
    const fa = rng.int(-9, 9);
    const fb = rng.int(-9, 9);
    const gap = Q.of(fb - fa);
    const half = w.div(Q.of(2));
    const answer = Q.of(L).add(half.mul(gap));
    return ask(
      [
        `For a function $f$ and a partition with width $\\Delta x = ${w.toLatex()}$ on $[a, b]$, the left sum is $${L}$, $f(a) = ${fa}$ and $f(b) = ${fb}$. Find the trapezoidal approximation.`,
        `对函数 $f$ 和 $[a, b]$ 上宽度 $\\Delta x = ${w.toLatex()}$ 的分割，左和是 $${L}$，$f(a) = ${fa}$，$f(b) = ${fb}$。求梯形近似值。`,
      ],
      answer,
      [Q.of(L).add(w.mul(gap)), Q.of(L).add(gap.div(Q.of(2))), Q.of(L).sub(half.mul(gap))],
      [
        `$T = L + \\frac{\\Delta x}{2}(f(b) - f(a)) = ${L} + ${half.toLatex()} \\cdot (${paren(fb)} - ${paren(fa)}) = ${answer.toLatex()}$.`,
        `$T = L + \\frac{\\Delta x}{2}(f(b) - f(a)) = ${L} + ${half.toLatex()} \\cdot (${paren(fb)} - ${paren(fa)}) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const intervalOffSum = point(
  "reading-the-interval-off-a-sum",
  ["Reading the interval off a sum", "从和式读出区间"],
  [
    "In a right Riemann sum $\\sum_{i=1}^{n} f(a + i\\Delta x)\\Delta x$, the term with $i = 0$ would be at $a$, and the last term is at $b = a + n\\Delta x$. Reading the constant and the coefficient of $i$ gives the interval and the integrand.",
    "在右黎曼和 $\\sum_{i=1}^{n} f(a + i\\Delta x)\\Delta x$ 中，$i = 0$ 对应 $a$，最后一项对应 $b = a + n\\Delta x$。读出常数项和 $i$ 的系数，就得到区间和被积函数。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const n = rng.pick([4, 6, 8, 10, 12, 20]);
    const w = rng.int(1, 6);
    const d = Q.of(w, n);
    const arg = poly([a, ""], [d, "i"]);
    const body = rng.pick([`\\left(${arg}\\right)^{2}`, `\\sqrt{${arg}}`, `\\frac{1}{${arg}}`, `\\ln\\left(${arg}\\right)`]);
    const b = a + w;
    return ask(
      [
        `The sum $\\sum_{i=1}^{${n}} ${body} \\cdot ${d.toLatex()}$ is a right Riemann sum for a function on $[${a}, b]$. Find $b$.`,
        `和式 $\\sum_{i=1}^{${n}} ${body} \\cdot ${d.toLatex()}$ 是某函数在 $[${a}, b]$ 上的右黎曼和。求 $b$。`,
      ],
      b,
      [w, a + n, Q.of(a).add(d), n],
      [
        `The width is $\\Delta x = ${d.toLatex()}$ and there are $${n}$ subintervals, so the length is $${n} \\cdot ${d.toLatex()} = ${w}$ and $b = ${a} + ${w} = ${b}$.`,
        `宽度 $\\Delta x = ${d.toLatex()}$，共 $${n}$ 个子区间，所以区间长度是 $${n} \\cdot ${d.toLatex()} = ${w}$，$b = ${a} + ${w} = ${b}$。`,
      ],
    );
  },
);

const samplePoint = point(
  "the-sample-point-of-one-term",
  ["The sample point of one term", "某一项的取样点"],
  [
    "The term with index $i$ of a midpoint sum samples the middle of the $i$th subinterval, which runs from $a + (i - 1)\\Delta x$ to $a + i\\Delta x$. So its sample point is $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$, not $a + i\\Delta x$.",
    "中点和第 $i$ 项的取样点是第 $i$ 个子区间的中点，这个子区间从 $a + (i - 1)\\Delta x$ 到 $a + i\\Delta x$。所以取样点是 $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$，而不是 $a + i\\Delta x$。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const n = rng.pick([4, 5, 6, 8, 10, 12]);
    const len = rng.int(1, 8);
    const b = a + len;
    const d = Q.of(len, n);
    const i = rng.int(2, n);
    const answer = Q.of(a).add(d.mul(Q.of(2 * i - 1, 2)));
    return ask(
      [
        `A midpoint Riemann sum for $f$ on $[${a}, ${b}]$ has $${n}$ subintervals of equal width. At which $x$ is $f$ evaluated in the term with $i = ${i}$?`,
        `$f$ 在 $[${a}, ${b}]$ 上的中点黎曼和有 $${n}$ 个等宽子区间。$i = ${i}$ 这一项在哪个 $x$ 处计算 $f$？`,
      ],
      answer,
      [Q.of(a).add(d.mul(Q.of(i))), Q.of(a).add(d.mul(Q.of(i - 1))), Q.of(a).add(d.mul(Q.of(i, 2)))],
      [
        `$\\Delta x = ${d.toLatex()}$, and subinterval $${i}$ has midpoint $${a} + \\left(${i} - \\frac{1}{2}\\right) \\cdot ${d.toLatex()} = ${answer.toLatex()}$.`,
        `$\\Delta x = ${d.toLatex()}$，第 $${i}$ 个子区间的中点是 $${a} + \\left(${i} - \\frac{1}{2}\\right) \\cdot ${d.toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** shapes are functions with a known concavity on positive x, for ordering approximations. */
const shapes = [
  { f: "e^{x}", up: true },
  { f: "\\frac{1}{x + 1}", up: true },
  { f: "x^{2} + 1", up: true },
  { f: "\\ln(x + 1)", up: false },
  { f: "\\sqrt{x + 1}", up: false },
  { f: "6x - x^{2}", up: false },
] as const;

const orderingEstimates = point(
  "ordering-the-midpoint-and-trapezoidal-estimates",
  ["Ordering the midpoint and trapezoidal estimates", "比较中点估计与梯形估计"],
  [
    "Concavity orders the two estimates around the exact area. On a concave-up graph, chords lie above the curve and tangents below, so $M_{n} < \\int f < T_{n}$. On a concave-down graph the order reverses. Monotonicity plays no part here.",
    "凹凸性决定了两个估计值与精确面积的大小顺序。在上凹图像上，弦在曲线上方，切线在曲线下方，所以 $M_{n} < \\int f < T_{n}$。在下凹图像上顺序相反。这里单调性不起作用。",
  ],
  (rng) => {
    const s = rng.pick(shapes);
    const p = rng.int(0, 4);
    const q = p + rng.int(1, 2);
    const n = rng.pick([4, 6, 8, 10]);
    const I = `\\int_{${p}}^{${q}} f`;
    const a = `M_{${n}} < ${I} < T_{${n}}`;
    const b = `T_{${n}} < ${I} < M_{${n}}`;
    return choose(
      rng,
      [
        `Let $f(x) = ${s.f}$ on $[${p}, ${q}]$, with midpoint and trapezoidal approximations $M_{${n}}$ and $T_{${n}}$. Which is true?`,
        `设 $[${p}, ${q}]$ 上的 $f(x) = ${s.f}$，中点近似和梯形近似分别是 $M_{${n}}$ 和 $T_{${n}}$。哪项正确？`,
      ],
      same2(s.up ? a : b),
      [same2(s.up ? b : a), same2(`${I} < M_{${n}} < T_{${n}}`), same2(`M_{${n}} < T_{${n}} < ${I}`)],
      [
        `$f''$ is ${s.up ? "positive" : "negative"} here, so $f$ is concave ${s.up ? "up" : "down"}. The trapezoids lie ${s.up ? "above" : "below"} the graph and the midpoint rectangles match its tangent lines, which lie ${s.up ? "below" : "above"}. So $${s.up ? a : b}$.`,
        `这里 $f''$ ${s.up ? "为正" : "为负"}，所以 $f$ ${s.up ? "上凹" : "下凹"}。梯形在图像${s.up ? "上方" : "下方"}，中点矩形相当于切线，在图像${s.up ? "下方" : "上方"}。所以 $${s.up ? a : b}$。`,
      ],
    );
  },
);

/** unitIntegrals are integrands and limits whose exact value is a whole number. */
const unitIntegrals: readonly { f: string; lo: string; hi: string; value: number; anti: string; bad: number }[] = [
  { f: "\\sec^{2}x", lo: "0", hi: "\\frac{\\pi}{4}", value: 1, anti: "\\tan x", bad: -1 },
  { f: "\\csc^{2}x", lo: "\\frac{\\pi}{4}", hi: "\\frac{\\pi}{2}", value: 1, anti: "-\\cot x", bad: -1 },
  { f: "\\sec x\\tan x", lo: "0", hi: "\\frac{\\pi}{3}", value: 1, anti: "\\sec x", bad: 2 },
  { f: "\\csc x\\cot x", lo: "\\frac{\\pi}{6}", hi: "\\frac{\\pi}{2}", value: 1, anti: "-\\csc x", bad: -1 },
  { f: "\\sec^{2}x", lo: "-\\frac{\\pi}{4}", hi: "\\frac{\\pi}{4}", value: 2, anti: "\\tan x", bad: 0 },
  { f: "\\frac{1}{x}", lo: "1", hi: "e^{2}", value: 2, anti: "\\ln x", bad: 1 },
  { f: "\\frac{1}{x}", lo: "e", hi: "e^{3}", value: 2, anti: "\\ln x", bad: 3 },
  { f: "e^{x}", lo: "0", hi: "\\ln 4", value: 3, anti: "e^{x}", bad: 4 },
  { f: "e^{x}", lo: "\\ln 2", hi: "\\ln 7", value: 5, anti: "e^{x}", bad: 7 },
];

const wholeNumberIntegrals = point(
  "other-trigonometric-and-exponential-antiderivatives",
  ["Other trigonometric and exponential antiderivatives", "其他三角与指数原函数"],
  [
    "The fundamental theorem works for any known antiderivative, including $\\tan x$ for $\\sec^{2}x$, $-\\cot x$ for $\\csc^{2}x$ and $\\sec x$ for $\\sec x\\tan x$. The minus signs in $-\\cot x$ and $-\\csc x$, and subtracting the value at the lower limit, are the usual sources of error.",
    "微积分基本定理适用于任何已知的原函数，包括 $\\sec^{2}x$ 的原函数 $\\tan x$、$\\csc^{2}x$ 的原函数 $-\\cot x$ 和 $\\sec x\\tan x$ 的原函数 $\\sec x$。$-\\cot x$ 和 $-\\csc x$ 中的负号，以及减去下限处的值，是常见的出错之处。",
  ],
  (rng) => {
    const u = rng.pick(unitIntegrals);
    const c = nz(rng, 12);
    const answer = c * u.value;
    const integrand = u.f === "\\frac{1}{x}" ? `\\frac{${c}}{x}` : poly([c, u.f]);
    return ask(
      [`Evaluate $\\int_{${u.lo}}^{${u.hi}} ${integrand} \\, dx$.`, `计算 $\\int_{${u.lo}}^{${u.hi}} ${integrand} \\, dx$。`],
      answer,
      [-answer, c * u.bad, c],
      [
        `An antiderivative of $${u.f}$ is $${u.anti}$. Evaluating it from $${u.lo}$ to $${u.hi}$ gives $${u.value}$, so the integral is $${paren(c)} \\cdot ${u.value} = ${answer}$.`,
        `$${u.f}$ 的一个原函数是 $${u.anti}$。从 $${u.lo}$ 到 $${u.hi}$ 取值得 $${u.value}$，所以积分是 $${paren(c)} \\cdot ${u.value} = ${answer}$。`,
      ],
    );
  },
);

const unknownFromCombination = point(
  "an-integral-from-a-known-combination",
  ["An integral from a known combination", "由已知组合求积分"],
  [
    "The sum and constant multiple rules turn a statement about $\\int (pf + qg)$ into a linear equation in the two integrals. If one is known, solve for the other, dividing by its coefficient at the end.",
    "和与常数倍法则把关于 $\\int (pf + qg)$ 的条件变成两个积分的一次方程。如果其中一个已知，就解出另一个，最后除以它的系数。",
  ],
  (rng) => {
    const a = rng.int(-4, 2);
    const b = a + rng.int(1, 6);
    const p = nz(rng, 6);
    const q = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const F = nz(rng, 9);
    const G = rng.int(-9, 9);
    const S = p * F + q * G;
    const integrand = poly([p, "f(x)"], [q, "g(x)"]);
    return ask(
      [
        `Given $\\int_{${a}}^{${b}} \\left[${integrand}\\right] dx = ${S}$ and $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$, find $\\int_{${a}}^{${b}} g(x) \\, dx$.`,
        `已知 $\\int_{${a}}^{${b}} \\left[${integrand}\\right] dx = ${S}$，$\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，求 $\\int_{${a}}^{${b}} g(x) \\, dx$。`,
      ],
      G,
      [Q.of(S - F, q), Q.of(S + p * F, q), S - p * F],
      [
        `$${paren(p)} \\cdot ${paren(F)} + ${paren(q)} \\cdot G = ${S}$, so $${q}G = ${S - p * F}$ and $G = ${G}$.`,
        `$${paren(p)} \\cdot ${paren(F)} + ${paren(q)} \\cdot G = ${S}$，所以 $${q}G = ${S - p * F}$，$G = ${G}$。`,
      ],
    );
  },
);

const whereSignedCancels = point(
  "where-signed-areas-cancel",
  ["Where signed areas cancel", "有向面积相互抵消之处"],
  [
    "A line crosses the $x$-axis at $r$, and the triangles on either side have opposite signs. The signed integral from $a$ to $c$ is zero when the two triangles are congruent, which happens when $r$ is the midpoint of $a$ and $c$. The total area is not zero there.",
    "直线在 $r$ 处穿过 $x$ 轴，两侧的三角形符号相反。从 $a$ 到 $c$ 的有向积分为零，当且仅当两个三角形全等，也就是 $r$ 是 $a$ 和 $c$ 的中点。这时总面积并不为零。",
  ],
  (rng) => {
    const m = nz(rng, 5);
    const r = rng.int(-5, 5);
    const a = r - rng.int(1, 7);
    const c = 2 * r - a;
    const f = linear(m, -m * r);
    return ask(
      [
        `Find the value $c > ${a}$ for which $\\int_{${a}}^{c} (${f}) \\, dx = 0$.`,
        `求满足 $\\int_{${a}}^{c} (${f}) \\, dx = 0$ 且 $c > ${a}$ 的 $c$。`,
      ],
      c,
      [r, 2 * r + a, r - a],
      [
        `The line crosses the axis at $x = ${r}$. The signed areas cancel when $${r}$ is the midpoint of $${a}$ and $c$, so $c = 2 \\cdot ${paren(r)} - ${paren(a)} = ${c}$.`,
        `直线在 $x = ${r}$ 处穿过坐标轴。当 $${r}$ 是 $${a}$ 和 $c$ 的中点时有向面积抵消，所以 $c = 2 \\cdot ${paren(r)} - ${paren(a)} = ${c}$。`,
      ],
    );
  },
);

const symmetryIntegrals = point(
  "definite-integrals-from-symmetry",
  ["Definite integrals from symmetry", "由对称性求定积分"],
  [
    "Symmetry of the graph gives integrals without a formula. If $f$ is even, the areas on the two sides of the $y$-axis are equal with the same sign. If $f$ is odd, they are equal with opposite signs, so the integral over $[-a, a]$ is $0$.",
    "图像的对称性不用公式就能给出积分。若 $f$ 是偶函数，$y$ 轴两侧的面积相等，符号相同。若 $f$ 是奇函数，两侧面积相等，符号相反，所以在 $[-a, a]$ 上的积分是 $0$。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const v = nz(rng, 12);
    const even = rng.bool();
    const whole = rng.bool();
    const answer = whole ? (even ? 2 * v : 0) : even ? v : -v;
    const upper = whole ? a : 0;
    return ask(
      [
        `$f$ is ${even ? "even" : "odd"} and $\\int_{0}^{${a}} f(x) \\, dx = ${v}$. Find $\\int_{${-a}}^{${upper}} f(x) \\, dx$.`,
        `$f$ 是${even ? "偶" : "奇"}函数，且 $\\int_{0}^{${a}} f(x) \\, dx = ${v}$。求 $\\int_{${-a}}^{${upper}} f(x) \\, dx$。`,
      ],
      answer,
      [2 * v, 0, v, -v],
      [
        `The graph on $[${-a}, 0]$ is the ${even ? "mirror image" : "point reflection"} of the graph on $[0, ${a}]$, so $\\int_{${-a}}^{0} f = ${even ? v : -v}$. ${whole ? `Adding $\\int_{0}^{${a}} f = ${v}$ gives $${answer}$.` : `This is the value asked for.`}`,
        `$[${-a}, 0]$ 上的图像是 $[0, ${a}]$ 上图像的${even ? "镜像" : "中心对称图形"}，所以 $\\int_{${-a}}^{0} f = ${even ? v : -v}$。${whole ? `加上 $\\int_{0}^{${a}} f = ${v}$ 得 $${answer}$。` : `这就是所求的值。`}`,
      ],
    );
  },
);

const valueFromNetChange = point(
  "a-value-of-the-function-from-its-net-change",
  ["A value of the function from its net change", "由净变化求函数值"],
  [
    "The fundamental theorem says $\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$, so knowing the integral and one value gives the other. Keep the order of the limits in mind: when the known value is at the upper limit, the unknown one is found by subtracting.",
    "微积分基本定理给出 $\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$，所以知道积分和一个函数值，就能求出另一个。注意上下限的顺序：已知的值在上限时，未知的值要用减法求得。",
  ],
  (rng) => {
    const a = rng.int(-6, 3);
    const b = a + rng.int(1, 7);
    const I = nz(rng, 15);
    const known = rng.int(-12, 12);
    const findLower = rng.bool();
    const answer = findLower ? known - I : known + I;
    return ask(
      findLower
        ? [
            `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$ and $f(${b}) = ${known}$. Find $f(${a})$.`,
            `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$，$f(${b}) = ${known}$。求 $f(${a})$。`,
          ]
        : [
            `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$ and $f(${a}) = ${known}$. Find $f(${b})$.`,
            `$\\int_{${a}}^{${b}} f'(x) \\, dx = ${I}$，$f(${a}) = ${known}$。求 $f(${b})$。`,
          ],
      answer,
      [findLower ? known + I : known - I, I, I - known],
      [
        `$f(${b}) - f(${a}) = ${I}$, and $${findLower ? `f(${b})` : `f(${a})`} = ${known}$, so $${findLower ? `f(${a})` : `f(${b})`} = ${answer}$.`,
        `$f(${b}) - f(${a}) = ${I}$，$${findLower ? `f(${b})` : `f(${a})`} = ${known}$，所以 $${findLower ? `f(${a})` : `f(${b})`} = ${answer}$。`,
      ],
    );
  },
);

/** areaStory draws four increasing points and three different areas for a derivative that is positive, negative, then positive. */
const areaStory = (rng: Rng) => {
  const x0 = rng.int(-8, -3);
  const x1 = x0 + rng.int(1, 4);
  const x2 = x1 + rng.int(1, 4);
  const x3 = x2 + rng.int(1, 4);
  const A1 = rng.int(2, 9);
  const A2 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== A1));
  const A3 = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== A2));
  const prose: Pair = [
    `$f'$ is positive on $(${x0}, ${x1})$, negative on $(${x1}, ${x2})$ and positive on $(${x2}, ${x3})$, and the areas between its graph and the $x$-axis on these intervals are $${A1}$, $${A2}$ and $${A3}$.`,
    `$f'$ 在 $(${x0}, ${x1})$ 上为正，在 $(${x1}, ${x2})$ 上为负，在 $(${x2}, ${x3})$ 上为正，它的图像与 $x$ 轴在这些区间上围成的面积依次是 $${A1}$、$${A2}$ 和 $${A3}$。`,
  ];
  return { x0, x1, x2, x3, A1, A2, A3, prose };
};

const maximumFromAreas = point(
  "the-absolute-maximum-from-areas-under-the-derivative",
  ["The absolute maximum from areas under the derivative", "由导数下的面积确定绝对最大值"],
  [
    "The absolute maximum is at a point where $f'$ changes from positive to negative or at an endpoint. Compare these candidates by net area: the right endpoint beats the interior peak only if the area gained after the dip is more than the area lost in it.",
    "绝对最大值出现在 $f'$ 由正变负的点或端点处。用净面积比较这些候选点：只有低谷之后增加的面积大于低谷中失去的面积时，右端点才超过内部的峰值。",
  ],
  (rng) => {
    const s = areaStory(rng);
    const answer = s.A2 > s.A3 ? s.x1 : s.x3;
    return ask(
      [
        `${s.prose[0]} At which $x$ does $f$ attain its absolute maximum on $[${s.x0}, ${s.x3}]$?`,
        `${s.prose[1]}$f$ 在 $[${s.x0}, ${s.x3}]$ 上的绝对最大值在哪个 $x$ 处取到？`,
      ],
      answer,
      [s.A2 > s.A3 ? s.x3 : s.x1, s.x2, s.x0],
      [
        `Relative to $f(${s.x0})$, the value at $x = ${s.x1}$ is $+${s.A1}$ and at $x = ${s.x3}$ it is $${s.A1} - ${s.A2} + ${s.A3} = ${s.A1 - s.A2 + s.A3}$. The larger is at $x = ${answer}$.`,
        `相对于 $f(${s.x0})$，$x = ${s.x1}$ 处的值是 $+${s.A1}$，$x = ${s.x3}$ 处的值是 $${s.A1} - ${s.A2} + ${s.A3} = ${s.A1 - s.A2 + s.A3}$。较大的在 $x = ${answer}$ 处。`,
      ],
    );
  },
);

const minimumFromAreas = point(
  "the-absolute-minimum-from-areas-under-the-derivative",
  ["The absolute minimum from areas under the derivative", "由导数下的面积确定绝对最小值"],
  [
    "The absolute minimum is at a point where $f'$ changes from negative to positive or at an endpoint. Here the left endpoint is a real candidate: the interior dip is lower than the start only if the area lost is more than the area first gained.",
    "绝对最小值出现在 $f'$ 由负变正的点或端点处。这里左端点是真正的候选点：只有失去的面积大于最初增加的面积时，内部的低谷才低于起点。",
  ],
  (rng) => {
    const s = areaStory(rng);
    const answer = s.A1 > s.A2 ? s.x0 : s.x2;
    return ask(
      [
        `${s.prose[0]} At which $x$ does $f$ attain its absolute minimum on $[${s.x0}, ${s.x3}]$?`,
        `${s.prose[1]}$f$ 在 $[${s.x0}, ${s.x3}]$ 上的绝对最小值在哪个 $x$ 处取到？`,
      ],
      answer,
      [s.A1 > s.A2 ? s.x2 : s.x0, s.x1, s.x3],
      [
        `Relative to $f(${s.x0})$, the value at $x = ${s.x2}$ is $${s.A1} - ${s.A2} = ${s.A1 - s.A2}$. ${s.A1 > s.A2 ? `That is positive, so the start at $x = ${s.x0}$ stays lowest.` : `That is negative, so $x = ${s.x2}$ is lower than the start.`}`,
        `相对于 $f(${s.x0})$，$x = ${s.x2}$ 处的值是 $${s.A1} - ${s.A2} = ${s.A1 - s.A2}$。${s.A1 > s.A2 ? `它是正的，所以起点 $x = ${s.x0}$ 仍是最低的。` : `它是负的，所以 $x = ${s.x2}$ 处比起点更低。`}`,
      ],
    );
  },
);

const criticalOutsideInterval = point(
  "a-critical-point-outside-the-interval",
  ["A critical point outside the interval", "区间外的临界点"],
  [
    "Solving $f'(x) = 0$ is not the whole search: the critical point may lie outside the interval, and on a closed interval the endpoints are always candidates. If $f'$ has one sign throughout, the maximum is at an endpoint.",
    "解 $f'(x) = 0$ 并不是全部工作：临界点可能在区间之外，而闭区间的端点总是候选点。如果 $f'$ 在整个区间上符号不变，最大值就在端点处。",
  ],
  (rng) => {
    const a = rng.int(-6, 2);
    const b = a + rng.int(3, 8);
    let r = rng.int(a - 4, b + 4);
    if (2 * r === a + b) r += 1;
    const k = nz(rng, 4);
    const down = k < 0;
    const answer = down ? Math.min(b, Math.max(a, r)) : Math.abs(r - a) > Math.abs(b - r) ? a : b;
    const d = poly([k, r === 0 ? "x" : `(${minus(r)})`]);
    const inside = r > a && r < b;
    const why: Pair = down
      ? inside
        ? [`$f'$ changes from positive to negative at $x = ${r}$, inside the interval`, `$f'$ 在区间内的 $x = ${r}$ 处由正变负`]
        : [
            `$f'$ has one sign on the interval, so $f$ is monotonic and the maximum is at the endpoint nearer to $${r}$`,
            `$f'$ 在区间上符号不变，所以 $f$ 单调，最大值在离 $${r}$ 较近的端点处`,
          ]
      : [
          `$f$ is a parabola opening upward with vertex at $x = ${r}$, so the maximum is at the endpoint farther from $${r}$`,
          `$f$ 是开口向上、顶点在 $x = ${r}$ 的抛物线，所以最大值在离 $${r}$ 较远的端点处`,
        ];
    return ask(
      [
        `$f'(x) = ${d}$. At which $x$ does $f$ attain its greatest value on $[${a}, ${b}]$?`,
        `$f'(x) = ${d}$。$f$ 在 $[${a}, ${b}]$ 上的最大值在哪个 $x$ 处取到？`,
      ],
      answer,
      [r, a, b],
      [`Here ${why[0]}, which gives $x = ${answer}$.`, `这里${why[1]}，所以 $x = ${answer}$。`],
    );
  },
);

const unknownFromLimit = point(
  "an-unknown-derivative-from-the-limit",
  ["An unknown derivative from the limit", "由极限求未知的导数"],
  [
    "L'Hopital's rule also runs backwards. When $f(a) = g(a) = 0$ and the derivatives are continuous with $g'(a) \\ne 0$, the limit of $\\frac{f}{g}$ is $\\frac{f'(a)}{g'(a)}$, so knowing the limit and one derivative gives the other. Both functions must vanish at $a$ first.",
    "洛必达法则也可以反过来用。当 $f(a) = g(a) = 0$，导数连续且 $g'(a) \\ne 0$ 时，$\\frac{f}{g}$ 的极限是 $\\frac{f'(a)}{g'(a)}$，所以知道极限和其中一个导数，就能求出另一个。前提是两个函数在 $a$ 处都为零。",
  ],
  (rng) => {
    const a = rng.int(-6, 6);
    const fp = nz(rng, 12);
    const gp = nz(rng, 9);
    const L = Q.of(fp, gp);
    const findTop = rng.bool();
    const answer = findTop ? fp : gp;
    const table = `| $x$ | $f(x)$ | $g(x)$ | $f'(x)$ | $g'(x)$ |\n| :---: | :---: | :---: | :---: | :---: |\n| $${a}$ | $0$ | $0$ | $${findTop ? "p" : fp}$ | $${findTop ? gp : "p"}$ |`;
    const limit = `\\lim_{x \\to ${a}} \\frac{f(x)}{g(x)} = ${L.toLatex()}`;
    return ask(
      [
        `$f$ and $g$ have continuous derivatives, with these values, and $${limit}$. Find $p$.\n\n${table}`,
        `$f$ 和 $g$ 的导数连续，取值如下，且 $${limit}$。求 $p$。\n\n${table}`,
      ],
      answer,
      findTop ? [L.div(Q.of(gp)), gp, -fp] : [L.mul(Q.of(fp)), fp, -gp],
      [
        `The form is $\\frac{0}{0}$, so the limit equals $\\frac{f'(${a})}{g'(${a})}$. Solving $${findTop ? `\\frac{p}{${gp}}` : `\\frac{${fp}}{p}`} = ${L.toLatex()}$ gives $p = ${answer}$.`,
        `这是 $\\frac{0}{0}$ 型，所以极限等于 $\\frac{f'(${a})}{g'(${a})}$。解 $${findTop ? `\\frac{p}{${gp}}` : `\\frac{${fp}}{p}`} = ${L.toLatex()}$ 得 $p = ${answer}$。`,
      ],
    );
  },
);

/** deeperCalculusIThird2Points maps topics of Calculus I, from extrema to integrals, to a third knowledge point. */
export const deeperCalculusIThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "lhopitals-rule-applied-to-tables": [unknownFromLimit],
  "global-vs-local-extrema-and-critical-points": [criticalNotExtreme],
  "the-extreme-value-theorem": [openEndpoints],
  "intervals-of-concavity": [coefficientFromInflection],
  "sketching-the-derivative-of-a-function-from-the-functions-graph": [cornerOfSegments],
  "interpreting-the-graph-of-a-functions-derivative": [peakOfDerivative],
  "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection": [shapeFromDerivativeValues],
  "sketching-a-function-from-the-graph-of-its-derivative": [areaUnderSlopedDerivative],
  "sketching-a-function-given-some-derivative-properties": [secondTestSilent],
  "approximating-trigonometric-functions-using-local-linearity": [overOrUnderTrig],
  "optimization-problems-involving-sectors-of-circles": [leastPerimeterSector],
  "optimization-problems-involving-boxes-and-trays": [trayFromRectangle],
  "optimizing-distances-to-curves": [leastDistanceSquared],
  "newtons-method-for-optimizing-single-variable-functions": [newtonOnQuadratic],
  "calculating-acceleration-for-straight-line-motion-using-differentiation": [speedingUp],
  "the-constant-multiple-rule-for-indefinite-integrals": [coefficientFromAntiderivative],
  "the-sum-rule-for-indefinite-integrals": [noProductRule],
  "integrating-hyperbolic-functions": [hyperbolicIdentityIntegral],
  "integration-using-inverse-hyperbolic-functions": [arsinhScaled],
  "integration-using-inverse-reciprocal-hyperbolic-functions": [artanhOrArcoth],
  "approximating-areas-with-the-left-riemann-sum": [rightFromLeft],
  "approximating-areas-with-the-midpoint-riemann-sum": [midpointOfLine],
  "approximating-areas-with-the-trapezoidal-rule": [trapezoidFromLeft],
  "left-and-right-riemann-sums-in-sigma-notation": [intervalOffSum],
  "midpoint-and-trapezoidal-rules-in-sigma-notation": [samplePoint],
  "approximating-areas-under-graphs-of-composite-functions": [orderingEstimates],
  "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions": [wholeNumberIntegrals],
  "the-sum-and-constant-multiple-rules-for-definite-integrals": [unknownFromCombination],
  "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect": [whereSignedCancels],
  "calculating-the-definite-integral-of-a-function-given-its-graph": [symmetryIntegrals],
  "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph": [valueFromNetChange],
  "maximizing-a-function-using-the-graph-of-its-derivative": [maximumFromAreas],
  "minimizing-a-function-using-the-graph-of-its-derivative": [minimumFromAreas],
  "further-optimizing-functions-using-graphs-of-derivatives": [criticalOutsideInterval],
};
