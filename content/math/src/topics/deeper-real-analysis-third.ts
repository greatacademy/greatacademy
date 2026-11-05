// Third knowledge points for thin topics of Real Analysis: the reverse question, a harder case
// or a common trap. See `deeperRealAnalysisThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";

const supOfImage = point(
  "the-supremum-after-a-reflection",
  ["The supremum after a reflection", "反射之后的上确界"],
  [
    "Multiplying a set by a negative number turns it upside down: upper bounds become lower bounds. So the supremum of $\\{c - kx : x \\in A\\}$ with $k > 0$ comes from the infimum of $A$, and using the supremum of $A$ here is a common mistake.",
    "把集合乘以负数会使它上下颠倒：上界变成下界。所以当 $k > 0$ 时，$\\{c - kx : x \\in A\\}$ 的上确界来自 $A$ 的下确界，这里使用 $A$ 的上确界是常见的错误。",
  ],
  (rng) => {
    const i = rng.int(-9, 5);
    const s = i + rng.int(1, 9);
    const k = rng.int(2, 6);
    const c = rng.int(-9, 9);
    const answer = c - k * i;
    return ask(
      [
        `A bounded set $A$ has $\\inf A = ${i}$ and $\\sup A = ${s}$. What is the supremum of $\\{${c} - ${k}x : x \\in A\\}$?`,
        `有界集 $A$ 满足 $\\inf A = ${i}$，$\\sup A = ${s}$。$\\{${c} - ${k}x : x \\in A\\}$ 的上确界是多少？`,
      ],
      answer,
      [c - k * s, c + k * i, k * s],
      [
        `The expression is largest when $x$ is smallest, so the supremum uses $\\inf A$: it is $${c} - ${k} \\cdot (${i}) = ${answer}$.`,
        `$x$ 越小，这个式子越大，所以上确界用 $\\inf A$：它等于 $${c} - ${k} \\cdot (${i}) = ${answer}$。`,
      ],
    );
  },
);

const whichFixedPoint = point(
  "which-fixed-point-a-recursion-reaches",
  ["Which fixed point a recursion reaches", "递推到达哪个不动点"],
  [
    "The limit of a recursion must be a fixed point, but there may be several. To decide among them, compare $a_{n+1}$ with $a_n$ to find the direction of the sequence, and then look for the bound that stops it. The starting value can matter.",
    "递推的极限必须是不动点，但不动点可能有多个。要作出判断，就比较 $a_{n+1}$ 与 $a_n$，确定数列的方向，再找到阻止它的界。初始值可能会起作用。",
  ],
  (rng) => {
    const r = rng.int(1, 7);
    const s = r + rng.int(2, 8);
    const t = rng.int(r + 1, s - 1);
    return ask(
      [
        `Let $a_{n+1} = \\frac{a_n^{2} + ${r * s}}{${r + s}}$ with $a_1 = ${t}$. What is the limit of $a_n$?`,
        `设 $a_{n+1} = \\frac{a_n^{2} + ${r * s}}{${r + s}}$，$a_1 = ${t}$。$a_n$ 的极限是多少？`,
      ],
      r,
      [s, t, Q.of(r + s, 2)],
      [
        `The fixed points are $${r}$ and $${s}$, and $a_{n+1} - a_n = \\frac{(a_n - ${r})(a_n - ${s})}{${r + s}}$ is negative between them, so the sequence decreases. It stays above $${r}$, because $a_{n+1} - ${r} = \\frac{a_n^{2} - ${r * r}}{${r + s}} > 0$ whenever $a_n > ${r}$. A bounded monotone sequence converges to a fixed point, and $${r}$ is the only one it can reach.`,
        `不动点是 $${r}$ 和 $${s}$，在它们之间 $a_{n+1} - a_n = \\frac{(a_n - ${r})(a_n - ${s})}{${r + s}}$ 为负，所以数列递减。它保持在 $${r}$ 之上，因为只要 $a_n > ${r}$，就有 $a_{n+1} - ${r} = \\frac{a_n^{2} - ${r * r}}{${r + s}} > 0$。有界单调数列收敛到不动点，而它只能到达 $${r}$。`,
      ],
    );
  },
);

const harmonicGap = point(
  "a-gap-that-does-not-shrink",
  ["A gap that does not shrink", "不缩小的差距"],
  [
    "For a Cauchy sequence, it is not enough that consecutive terms get close. The harmonic partial sums have steps that tend to zero, yet $a_{2n} - a_n$ stays at least $\\frac{1}{2}$ for every $n$, because it has $n$ terms that are each at least $\\frac{1}{2n}$. So they are not Cauchy.",
    "对柯西数列来说，仅仅相邻项接近是不够的。调和级数部分和的步长趋于零，但对每个 $n$，$a_{2n} - a_n$ 都至少为 $\\frac{1}{2}$，因为它有 $n$ 项，每项至少为 $\\frac{1}{2n}$。所以它们不是柯西数列。",
  ],
  (rng) => {
    const c = rng.int(1, 6);
    const n = rng.int(2, 6);
    let answer = Q.of(0);
    for (let k = n + 1; k <= 2 * n; k++) answer = answer.add(Q.of(c, k));
    const start = c === 1 ? "" : `${c}`;
    return ask(
      [
        `Let $a_n = ${start}\\left(1 + \\frac{1}{2} + \\cdots + \\frac{1}{n}\\right)$. Find $a_{${2 * n}} - a_{${n}}$.`,
        `设 $a_n = ${start}\\left(1 + \\frac{1}{2} + \\cdots + \\frac{1}{n}\\right)$。求 $a_{${2 * n}} - a_{${n}}$。`,
      ],
      answer,
      [Q.of(c, 2 * n), Q.of(c, n), Q.of(c, 2)],
      [
        `The difference keeps the terms with denominators from $${n + 1}$ to $${2 * n}$, and adding them gives $${answer.toLatex()}$. This is more than $${Q.of(c, 2).toLatex()}$, so such gaps do not tend to zero.`,
        `差中保留分母从 $${n + 1}$ 到 $${2 * n}$ 的项，相加得 $${answer.toLatex()}$。它大于 $${Q.of(c, 2).toLatex()}$，所以这样的差距不趋于零。`,
      ],
    );
  },
);

const classifyAlternating = point(
  "classifying-a-general-alternating-series",
  ["Classifying a general alternating series", "判断一般的交错级数"],
  [
    "An alternating sign alone proves nothing. First check that the terms tend to zero, since otherwise the series diverges. Then compare the absolute values with a $p$-series: convergence means absolute convergence, and divergence leaves conditional convergence by the alternating series test.",
    "仅有交错符号不能说明什么。首先检查通项是否趋于零，否则级数发散。然后把绝对值与 $p$ 级数比较：收敛意味着绝对收敛，发散时由交错级数判别法得到条件收敛。",
  ],
  (rng) => {
    const c = rng.int(2, 9);
    const absolutely: Pair = ["It converges absolutely", "它绝对收敛"];
    const conditionally: Pair = ["It converges conditionally", "它条件收敛"];
    const diverges: Pair = ["It diverges", "它发散"];
    const cases: { term: string; result: Pair; why: Pair }[] = [
      {
        term: `\\frac{(-1)^k k}{k + ${c}}`,
        result: diverges,
        why: [
          "The absolute values of the terms tend to $1$, so the terms do not tend to zero and the series diverges.",
          "通项的绝对值趋于 $1$，所以通项不趋于零，级数发散。",
        ],
      },
      {
        term: `\\frac{(-1)^k k^{2}}{k^{2} + ${c}}`,
        result: diverges,
        why: [
          "The absolute values of the terms tend to $1$, so the terms do not tend to zero and the series diverges.",
          "通项的绝对值趋于 $1$，所以通项不趋于零，级数发散。",
        ],
      },
      {
        term: `\\frac{(-1)^k}{k^{2} + ${c}}`,
        result: absolutely,
        why: [
          "The absolute values are below $\\frac{1}{k^{2}}$, and that series converges, so the convergence is absolute.",
          "绝对值小于 $\\frac{1}{k^{2}}$，而那个级数收敛，所以是绝对收敛。",
        ],
      },
      {
        term: `\\frac{(-1)^k k}{k^{3} + ${c}}`,
        result: absolutely,
        why: [
          "The absolute values are below $\\frac{1}{k^{2}}$, and that series converges, so the convergence is absolute.",
          "绝对值小于 $\\frac{1}{k^{2}}$，而那个级数收敛，所以是绝对收敛。",
        ],
      },
      {
        term: `\\frac{(-1)^k}{k + ${c}}`,
        result: conditionally,
        why: [
          "The absolute values behave like $\\frac{1}{k}$, whose series diverges, but they decrease to zero, so the alternating series test gives conditional convergence.",
          "绝对值的行为类似 $\\frac{1}{k}$，其级数发散，但它们递减趋于零，所以由交错级数判别法得条件收敛。",
        ],
      },
      {
        term: `\\frac{(-1)^k k}{k^{2} + ${c}}`,
        result: conditionally,
        why: [
          "The absolute values behave like $\\frac{1}{k}$, whose series diverges, but they eventually decrease to zero, so the alternating series test gives conditional convergence.",
          "绝对值的行为类似 $\\frac{1}{k}$，其级数发散，但它们最终递减趋于零，所以由交错级数判别法得条件收敛。",
        ],
      },
    ];
    const chosen = rng.pick(cases);
    return choose(
      rng,
      [`What does $\\sum_{k=1}^{\\infty} ${chosen.term}$ do?`, `$\\sum_{k=1}^{\\infty} ${chosen.term}$ 的敛散性如何？`],
      chosen.result,
      [absolutely, conditionally, diverges].filter((o) => o !== chosen.result),
      chosen.why,
    );
  },
);

const absoluteRearrangement = point(
  "rearranging-an-absolutely-convergent-series",
  ["Rearranging an absolutely convergent series", "重排绝对收敛的级数"],
  [
    "An absolutely convergent series keeps its sum under every rearrangement, however the terms are shuffled. So a rearranged geometric series with ratio between $-1$ and $1$ still has the sum of the original, and the original sum can be used without following the new order.",
    "绝对收敛的级数无论如何重排，和都不变。所以公比在 $-1$ 和 $1$ 之间的几何级数重排后仍有原来的和，可以直接用原来的和，而不必追踪新的次序。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const r = rng.int(2, 9);
    const answer = Q.of(c * r, r + 1);
    const start = c === 1 ? "" : `${c}`;
    return ask(
      [
        `Rearrange $\\sum_{n \\ge 0} ${start}\\left(-\\frac{1}{${r}}\\right)^{n}$ so that two positive terms come before each negative term. What is the sum of the new series?`,
        `重排 $\\sum_{n \\ge 0} ${start}\\left(-\\frac{1}{${r}}\\right)^{n}$，使每个负项之前有两个正项。新级数的和是多少？`,
      ],
      answer,
      [Q.of(c * r * r, r * r - 1), Q.of(c * r, r - 1), Q.of(c)],
      [
        `The series converges absolutely, so the sum is unchanged. It is the geometric sum $\\frac{${c}}{1 + \\frac{1}{${r}}} = ${answer.toLatex()}$.`,
        `这个级数绝对收敛，所以和不变。它是几何级数的和 $\\frac{${c}}{1 + \\frac{1}{${r}}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const cauchyProductReverse = point(
  "recovering-a-factor-of-a-cauchy-product",
  ["Recovering a factor of a Cauchy product", "还原柯西积的因子"],
  [
    "The Cauchy product is built from $c_n = \\sum_{k=0}^{n} a_k b_{n-k}$. If the $a_k$ and the $c_n$ are known and $a_0 \\ne 0$, these equations can be solved one at a time for the $b_n$, in the same way as long division of power series.",
    "柯西积由 $c_n = \\sum_{k=0}^{n} a_k b_{n-k}$ 构成。如果已知 $a_k$ 和 $c_n$，且 $a_0 \\ne 0$，那么可以逐个解这些方程求出 $b_n$，这与幂级数的长除法相同。",
  ],
  (rng) => {
    const a0 = rng.pick([1, -1]);
    const a1 = rng.int(-5, 5);
    const a2 = rng.int(-5, 5);
    const b0 = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const b1 = rng.int(-5, 5);
    const b2 = rng.int(-6, 6);
    const c0 = a0 * b0;
    const c1 = a0 * b1 + a1 * b0;
    const c2 = a0 * b2 + a1 * b1 + a2 * b0;
    return ask(
      [
        `The series $\\sum a_n$ begins with $a_0, a_1, a_2 = ${a0}, ${a1}, ${a2}$, and its Cauchy product with $\\sum b_n$ begins with $c_0, c_1, c_2 = ${c0}, ${c1}, ${c2}$. Find $b_2$.`,
        `级数 $\\sum a_n$ 以 $a_0, a_1, a_2 = ${a0}, ${a1}, ${a2}$ 开始，它与 $\\sum b_n$ 的柯西积以 $c_0, c_1, c_2 = ${c0}, ${c1}, ${c2}$ 开始。求 $b_2$。`,
      ],
      b2,
      [c2, a0 * (c2 - a2 * b0), a0 * (c2 - a1 * b1)],
      [
        `Solving in order gives $b_0 = ${b0}$ and $b_1 = ${b1}$. Then $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ becomes $${c2} = ${poly([a0, "b_2"], [a1 * b1 + a2 * b0, ""])}$, so $b_2 = ${b2}$.`,
        `依次求解得 $b_0 = ${b0}$，$b_1 = ${b1}$。于是 $c_2 = a_0 b_2 + a_1 b_1 + a_2 b_0$ 变为 $${c2} = ${poly([a0, "b_2"], [a1 * b1 + a2 * b0, ""])}$，所以 $b_2 = ${b2}$。`,
      ],
    );
  },
);

const removingDiscontinuity = point(
  "the-value-that-removes-a-discontinuity",
  ["The value that removes a discontinuity", "消除间断的值"],
  [
    "A removable discontinuity has a limit but the wrong value or no value at the point. To remove it, set the value equal to the limit. For a rational function, cancel the common factor first, because the limit is not found by substituting into the original fraction.",
    "可去间断点处有极限，但函数值错误或没有定义。要消除它，就令函数值等于极限。对有理函数要先约去公因式，因为极限不能通过代入原来的分式求得。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    let b = rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8]);
    if (b === a) b = a + 1;
    const top = poly([1, "x^{2}"], [-(a + b), "x"], [a * b, ""]);
    const answer = a - b;
    return ask(
      [
        `The function $f(x) = \\frac{${top}}{x - ${a}}$ is not defined at $x = ${a}$. What value of $f(${a})$ makes $f$ continuous there?`,
        `函数 $f(x) = \\frac{${top}}{x - ${a}}$ 在 $x = ${a}$ 处没有定义。$f(${a})$ 取什么值时 $f$ 在该点连续？`,
      ],
      answer,
      [a + b, a, b],
      [
        `The factor $x - ${a}$ cancels, which leaves $${poly([1, "x"], [-b, ""])}$. Its limit at $x = ${a}$ is $${answer}$, so this is the required value.`,
        `约去因式 $x - ${a}$，剩下 $${poly([1, "x"], [-b, ""])}$。它在 $x = ${a}$ 处的极限是 $${answer}$，所以这就是所求的值。`,
      ],
    );
  },
);

const rationalIrrational = point(
  "continuity-of-a-function-split-by-rationality",
  ["Continuity of a function split by rationality", "按有理性分段的函数的连续性"],
  [
    "Every point is a limit of rational numbers and also a limit of irrational numbers. So if a function follows one formula on the rationals and another on the irrationals, the sequential criterion allows continuity only at points where the two formulas agree.",
    "每个点既是有理数的极限，也是无理数的极限。所以如果函数在有理数上用一个公式，在无理数上用另一个公式，序列判据只允许它在两个公式相等的点连续。",
  ],
  (rng) => {
    const a = rng.int(-5, 6);
    let c = rng.int(-5, 6);
    if (c === a) c = a + 1;
    const b = rng.int(-9, 9);
    let d = rng.int(-9, 9);
    if (d === b) d = b + 1;
    const answer = Q.of(d - b, a - c);
    const first = poly([a, "x"], [b, ""]) || "0";
    const second = poly([c, "x"], [d, ""]) || "0";
    return ask(
      [
        `Let $f(x) = ${first}$ for rational $x$ and $f(x) = ${second}$ for irrational $x$. At which point is $f$ continuous?`,
        `当 $x$ 为有理数时，$f(x) = ${first}$；当 $x$ 为无理数时，$f(x) = ${second}$。$f$ 在哪一点连续？`,
      ],
      answer,
      [answer.neg().eq(answer) ? Q.of(1) : answer.neg(), Q.of(d + b, a - c), Q.of(d - b, 1)],
      [
        `Rational and irrational sequences tending to $x$ give the limits of the two formulas, so these must agree: $${first} = ${second}$. This gives $x = ${answer.toLatex()}$, and $f$ is continuous there.`,
        `趋于 $x$ 的有理数列和无理数列给出两个公式的极限，所以它们必须相等：$${first} = ${second}$。这给出 $x = ${answer.toLatex()}$，$f$ 在该点连续。`,
      ],
    );
  },
);

const threeBisections = point(
  "the-interval-after-three-bisections",
  ["The interval after three bisections", "三次二分后的区间"],
  [
    "Each step of bisection evaluates at the midpoint and keeps the half on which the sign changes, so the root stays trapped. After $n$ steps, the interval has length $\\frac{1}{2^{n}}$ of the original, and its endpoints come from following the choices one at a time.",
    "二分法的每一步都在中点求值，并保留符号变化的那一半，所以根始终被夹住。经过 $n$ 步后，区间的长度是原来的 $\\frac{1}{2^{n}}$，它的端点要逐次根据选择得出。",
  ],
  (rng) => {
    const m = rng.int(1, 9);
    let N = rng.int(m * m + 1, (m + 2) * (m + 2) - 1);
    if (Number.isInteger(Math.sqrt(N))) N += 1;
    let lo = 4 * m;
    let hi = 4 * m + 8;
    const mids: string[] = [];
    for (let i = 0; i < 3; i++) {
      const mid = (lo + hi) / 2;
      mids.push(Q.of(mid, 4).toLatex());
      if (mid * mid < 16 * N) lo = mid;
      else hi = mid;
    }
    const answer = Q.of(lo, 4);
    return ask(
      [
        `To solve $x^{2} = ${N}$, bisection starts on $[${m}, ${m + 2}]$. What is the left endpoint of the interval kept after three steps?`,
        `为解 $x^{2} = ${N}$，二分法从 $[${m}, ${m + 2}]$ 开始。三步后保留的区间的左端点是多少？`,
      ],
      answer,
      [Q.of(hi, 4), Q.of(m + 1), Q.of(Math.floor(Math.sqrt(N)))],
      [
        `The midpoints tested are $${mids.join(", ")}$. Comparing each square with $${N}$ leaves the interval from $${answer.toLatex()}$ to $${Q.of(hi, 4).toLatex()}$.`,
        `依次检验的中点是 $${mids.join(", ")}$。把每个平方与 $${N}$ 比较，留下从 $${answer.toLatex()}$ 到 $${Q.of(hi, 4).toLatex()}$ 的区间。`,
      ],
    );
  },
);

const contractionBound = point(
  "the-error-bound-of-a-contraction",
  ["The error bound of a contraction", "压缩映射的误差界"],
  [
    "On a complete metric space, a contraction with constant $q < 1$ has a unique fixed point $x^{*}$, and completeness is what makes the iterates converge to it. The estimate $d(x_n, x^{*}) \\le \\frac{q^{n}}{1 - q} d(x_0, x_1)$ bounds the error before the limit is known.",
    "在完备度量空间上，常数 $q < 1$ 的压缩映射有唯一不动点 $x^{*}$，完备性正是迭代收敛到它的原因。估计式 $d(x_n, x^{*}) \\le \\frac{q^{n}}{1 - q} d(x_0, x_1)$ 在极限未知时就给出误差的界。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const n = rng.int(2, 5);
    const D = rng.int(1, 12);
    const answer = Q.of(D * k, k ** n * (k - 1));
    return ask(
      [
        `A contraction on a complete metric space has constant $q = \\frac{1}{${k}}$, and its iterates have $d(x_0, x_1) = ${D}$. What upper bound does the standard estimate give for $d(x_{${n}}, x^{*})$?`,
        `完备度量空间上的压缩映射的常数为 $q = \\frac{1}{${k}}$，其迭代满足 $d(x_0, x_1) = ${D}$。标准估计式给出 $d(x_{${n}}, x^{*})$ 的什么上界？`,
      ],
      answer,
      [Q.of(D, k ** n), Q.of(D * k, k - 1), Q.of(D, k ** n * (k - 1))],
      [
        `The estimate gives $\\frac{q^{${n}}}{1 - q} \\cdot ${D}$, with $q^{${n}} = \\frac{1}{${k ** n}}$ and $1 - q = \\frac{${k - 1}}{${k}}$. The result is $${answer.toLatex()}$.`,
        `估计式给出 $\\frac{q^{${n}}}{1 - q} \\cdot ${D}$，其中 $q^{${n}} = \\frac{1}{${k ** n}}$，$1 - q = \\frac{${k - 1}}{${k}}$。结果是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const subsequenceLimit = point(
  "the-largest-limit-of-a-subsequence",
  ["The largest limit of a subsequence", "子列的最大极限"],
  [
    "A sequence in a compact interval always has a convergent subsequence, by Bolzano and Weierstrass, even if the sequence itself diverges. Different subsequences can have different limits, and terms that shrink away, such as those with $\\frac{1}{n}$, do not affect any of them.",
    "由波尔查诺-魏尔斯特拉斯定理，紧区间中的数列总有收敛子列，即使数列本身发散。不同的子列可以有不同的极限，而像含 $\\frac{1}{n}$ 这样逐渐消失的项不影响任何极限。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const c = rng.int(-9, 9);
    const d = rng.int(1, 9);
    const x = poly([a, "(-1)^{n}"], [c, ""], [1, `\\frac{${d}}{n}`]);
    const answer = a + c;
    return ask(
      [
        `The sequence $x_n = ${x}$ diverges, but it has convergent subsequences. What is the largest limit of a convergent subsequence?`,
        `数列 $x_n = ${x}$ 发散，但它有收敛子列。收敛子列的极限的最大值是多少？`,
      ],
      answer,
      [a + c + d, c, c - a],
      [
        `The term with $\\frac{1}{n}$ tends to zero, so the even and odd terms tend to $${c + a}$ and $${c - a}$. The largest limit is $${answer}$.`,
        `含 $\\frac{1}{n}$ 的项趋于零，所以偶数项和奇数项分别趋于 $${c + a}$ 和 $${c - a}$。最大的极限是 $${answer}$。`,
      ],
    );
  },
);

const lebesgueNumber = point(
  "the-overlap-of-a-cover",
  ["The overlap of a cover", "覆盖的重叠"],
  [
    "When an open cover is made of overlapping intervals, a short interval fits inside a single member only if it is shorter than a limit set by the overlap. A Lebesgue number of an open cover is a $\\delta > 0$ such that every set of diameter less than $\\delta$ lies inside a single member of the cover. An open cover of a compact set always has one, and it is the number behind many proofs by compactness. For overlapping open intervals, the danger is an interval that reaches past the overlap of two neighbours: it sticks out of both.",
    "当开覆盖由互相重叠的区间组成时，只有比重叠所确定的界限更短的小区间，才能放进单个成员之内。开覆盖的勒贝格数是这样一个 $\\delta > 0$：每个直径小于 $\\delta$ 的集合都落在覆盖的某一个成员之内。紧集的开覆盖总有勒贝格数，许多紧性证明都依赖它。对于互相重叠的开区间，危险在于小区间越过两个相邻区间的重叠部分：这时它同时伸出这两个区间。",
  ],
  (rng) => {
    const w = rng.int(2, 9);
    const s = rng.int(1, 2 * w - 1);
    const answer = 2 * w - s;
    const center = s === 1 ? "k" : `${s}k`;
    return ask(
      [
        `The open intervals $(${center} - ${w}, ${center} + ${w})$, for all integers $k$, cover the real line. What is the largest $\\delta$ such that every closed interval of length less than $\\delta$ lies inside one of them?`,
        `对所有整数 $k$，开区间 $(${center} - ${w}, ${center} + ${w})$ 覆盖实数轴。使每个长度小于 $\\delta$ 的闭区间都落在其中一个开区间内的最大 $\\delta$ 是多少？`,
      ],
      answer,
      [w === answer ? answer + 1 : w, s === answer ? answer + 2 : s, 2 * w],
      [
        `A closed interval of length $\\ell$ fits in a member exactly when some center lies in an open range of length $${2 * w} - \\ell$. Centers are spaced $${s}$ apart, so this is guaranteed when $\\ell < ${answer}$.`,
        `长度为 $\\ell$ 的闭区间能放进某个成员，当且仅当某个中心落在长度为 $${2 * w} - \\ell$ 的开范围内。中心的间距是 $${s}$，所以当 $\\ell < ${answer}$ 时这一定成立。`,
      ],
    );
  },
);

const uniformSqrt = point(
  "a-uniform-delta-for-a-square-root",
  ["A uniform delta for a square root", "平方根的一致 delta"],
  [
    "The square root is uniformly continuous on $[0, \\infty)$ although its slope is unbounded near zero, because $|\\sqrt{x} - \\sqrt{y}| \\le \\sqrt{|x - y|}$. So a suitable $\\delta$ is proportional to $\\varepsilon^{2}$, not to $\\varepsilon$, and the steepest place to test is at $x = 0$.",
    "平方根在 $[0, \\infty)$ 上一致连续，尽管它在零附近的斜率无界，因为 $|\\sqrt{x} - \\sqrt{y}| \\le \\sqrt{|x - y|}$。所以合适的 $\\delta$ 与 $\\varepsilon^{2}$ 成正比，而不是与 $\\varepsilon$ 成正比，最陡的检验位置是 $x = 0$。",
  ],
  (rng) => {
    const c = rng.int(2, 6);
    const k = rng.int(2, 12);
    const answer = Q.of(1, (c * k) ** 2);
    return ask(
      [
        `For $f(x) = ${c}\\sqrt{x}$ on $[0, \\infty)$ and $\\varepsilon = \\frac{1}{${k}}$, what is the largest $\\delta$ such that $|x - y| < \\delta$ always gives $|f(x) - f(y)| < \\varepsilon$?`,
        `对 $[0, \\infty)$ 上的 $f(x) = ${c}\\sqrt{x}$ 和 $\\varepsilon = \\frac{1}{${k}}$，使 $|x - y| < \\delta$ 总能推出 $|f(x) - f(y)| < \\varepsilon$ 的最大 $\\delta$ 是多少？`,
      ],
      answer,
      [Q.of(1, c * k), Q.of(1, k), Q.of(1, c * k * k)],
      [
        `The inequality gives $|f(x) - f(y)| \\le ${c}\\sqrt{|x - y|}$, with equality at $x = 0$. Solving $${c}\\sqrt{\\delta} = \\frac{1}{${k}}$ gives $\\delta = ${answer.toLatex()}$.`,
        `不等式给出 $|f(x) - f(y)| \\le ${c}\\sqrt{|x - y|}$，在 $x = 0$ 处取等号。解 $${c}\\sqrt{\\delta} = \\frac{1}{${k}}$，得 $\\delta = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const exactCubicZeros = point(
  "counting-the-exact-zeros-of-a-cubic",
  ["Counting the exact zeros of a cubic", "精确计算三次函数的零点"],
  [
    "Rolle's theorem gives an upper bound on the number of zeros, since zeros of $f$ are separated by zeros of $f'$. To find the exact count, evaluate $f$ at the critical points as well: the signs of these values show how many times the graph actually crosses the axis.",
    "罗尔定理给出零点个数的上界，因为 $f$ 的零点被 $f'$ 的零点分隔。要求出准确的个数，还要计算 $f$ 在临界点的值：这些值的符号说明图像实际穿过坐标轴多少次。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const edge = 2 * a ** 3;
    const mode = rng.int(0, 2);
    const c =
      mode === 0 ? rng.int(-edge + 1, edge - 1) : mode === 1 ? rng.pick([-edge, edge]) : rng.pick([-1, 1]) * (edge + rng.int(1, 20));
    const low = c - edge;
    const high = c + edge;
    const answer = low < 0 && high > 0 ? 3 : low === 0 || high === 0 ? 2 : 1;
    const f = poly([1, "x^{3}"], [-3 * a * a, "x"], [c, ""]);
    const why: Pair =
      answer === 3
        ? ["They have opposite signs, so the graph crosses the axis three times.", "它们符号相反，所以图像穿过坐标轴三次。"]
        : answer === 2
          ? [
              "One of them is zero, so the graph touches the axis there and crosses it once elsewhere.",
              "其中一个为零，所以图像在该处与坐标轴相切，并在别处穿过一次。",
            ]
          : ["They have the same sign, so the graph crosses the axis only once.", "它们符号相同，所以图像只穿过坐标轴一次。"];
    return ask(
      [`How many distinct real zeros does $${f}$ have?`, `$${f}$ 有多少个不同的实零点？`],
      answer,
      [0, 1, 2, 3].filter((v) => v !== answer),
      [
        `The critical points are $x = ${a}$ and $x = ${-a}$, where the values are $${low}$ and $${high}$. ${why[0]}`,
        `临界点是 $x = ${a}$ 和 $x = ${-a}$，函数值分别是 $${low}$ 和 $${high}$。${why[1]}`,
      ],
    );
  },
);

const darbouxCount = point(
  "the-zeros-forced-by-sign-changes",
  ["The zeros forced by sign changes", "符号变化迫使的零点"],
  [
    "A derivative need not be continuous, yet Darboux's theorem gives it the intermediate value property. So each change of sign among known values of $f'$ forces a zero between them, and nothing else is forced, which means that the sign changes give the guaranteed number of zeros.",
    "导数不一定连续，但达布定理使它具有介值性质。所以 $f'$ 的已知值中，每次符号变化都迫使其间有一个零点，除此之外没有别的强制，这意味着符号变化数就是可保证的零点个数。",
  ],
  (rng) => {
    const n = rng.int(4, 7);
    const values = [...Array(n).keys()].map(() => rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8]));
    let changes = 0;
    for (let i = 1; i < n; i++) if ((values[i - 1] as number) * (values[i] as number) < 0) changes++;
    const shown = values.map((v, i) => `f'(${i}) = ${v}`).join(", ");
    return ask(
      [
        `A function is differentiable on $[0, ${n - 1}]$, with $${shown}$. What is the smallest number of zeros that $f'$ must have on this interval?`,
        `函数在 $[0, ${n - 1}]$ 上可导，且 $${shown}$。$f'$ 在这个区间上至少必须有多少个零点？`,
      ],
      changes,
      [n - 1 === changes ? changes + 1 : n - 1, changes + 1, values.filter((v) => v < 0).length],
      [
        `The listed values change sign $${changes}$ ${changes === 1 ? "time" : "times"}, and Darboux's theorem puts a zero of $f'$ in each such gap. A function could have no other zeros of $f'$, so the minimum is $${changes}$.`,
        `所列的值变号 $${changes}$ 次，达布定理在每个这样的区间内给出 $f'$ 的一个零点。函数可以使 $f'$ 没有其他零点，所以最小值是 $${changes}$。`,
      ],
    );
  },
);

const escapingMass = point(
  "an-integral-limit-that-beats-the-pointwise-limit",
  ["An integral limit that beats the pointwise limit", "积分极限不等于逐点极限的积分"],
  [
    "A sequence of functions can tend to zero at every point while its integrals tend to something else, because a tall narrow peak keeps carrying area near one point. So a limit and an integral can be exchanged only with a condition such as uniform convergence, and here it fails.",
    "函数列可以在每一点都趋于零，而积分却趋于别的值，因为又高又窄的尖峰在一点附近持续携带面积。所以只有在一致收敛这样的条件下才能交换极限与积分，而这里这个条件不成立。",
  ],
  (rng) => {
    const k = rng.int(1, 12);
    const p = rng.int(2, 5);
    const answer = Q.of(k, p);
    const start = k === 1 ? "" : `${k} `;
    const inner = p === 2 ? "x" : `x^{${p - 1}}`;
    return ask(
      [
        `Let $f_n(x) = ${start}n ${inner} (1 - x^{${p}})^{n}$ on $[0, 1]$. It tends to $0$ at every point. What is $\\lim_{n \\to \\infty} \\int_0^1 f_n(x) \\, dx$?`,
        `设 $[0, 1]$ 上的 $f_n(x) = ${start}n ${inner} (1 - x^{${p}})^{n}$。它在每一点都趋于 $0$。$\\lim_{n \\to \\infty} \\int_0^1 f_n(x) \\, dx$ 是多少？`,
      ],
      answer,
      [0, Q.of(k), Q.of(k, p + 1)],
      [
        `Substituting $u = 1 - x^{${p}}$ gives $\\int_0^1 f_n \\, dx = \\frac{${start}n}{${p}(n + 1)}$, which tends to $${answer.toLatex()}$. This is not $0$, the integral of the pointwise limit.`,
        `代换 $u = 1 - x^{${p}}$，得 $\\int_0^1 f_n \\, dx = \\frac{${start}n}{${p}(n + 1)}$，它趋于 $${answer.toLatex()}$。这不是逐点极限的积分 $0$。`,
      ],
    );
  },
);

const mTestTerms = point(
  "how-many-terms-the-m-test-requires",
  ["How many terms the M-test requires", "M 判别法需要多少项"],
  [
    "The M-test does more than prove convergence: it bounds the error of a partial sum by the tail of the series $\\sum M_k$, at every $x$ at once. So the number of terms needed for a given accuracy can be found without looking at any particular $x$.",
    "M 判别法不只证明收敛：它用级数 $\\sum M_k$ 的尾部同时在每个 $x$ 处给出部分和的误差界。所以可以不考虑任何具体的 $x$，就求出达到给定精度所需的项数。",
  ],
  (rng) => {
    const r = rng.int(2, 5);
    const m = rng.int(10, 2000);
    let N = 0;
    while (r ** N * (r - 1) < m) N++;
    const tail = r ** N * (r - 1);
    return ask(
      [
        `For $\\sum_{k=1}^{\\infty} \\frac{\\sin(kx)}{${r}^{k}}$, what is the smallest $N$ for which the M-test bound on the error of the first $N$ terms is at most $\\frac{1}{${m}}$?`,
        `对 $\\sum_{k=1}^{\\infty} \\frac{\\sin(kx)}{${r}^{k}}$，使前 $N$ 项误差的 M 判别法上界不超过 $\\frac{1}{${m}}$ 的最小 $N$ 是多少？`,
      ],
      N,
      [N + 1, N - 1, N + 2],
      [
        `With $M_k = \\frac{1}{${r}^{k}}$, the tail after $N$ terms is $\\frac{1}{${r}^{N} \\cdot ${r - 1}}$. Reaching a denominator of at least $${m}$ first happens at $N = ${N}$, where it is $${tail}$.`,
        `取 $M_k = \\frac{1}{${r}^{k}}$，前 $N$ 项之后的尾部是 $\\frac{1}{${r}^{N} \\cdot ${r - 1}}$。分母首次不小于 $${m}$ 是在 $N = ${N}$，此时分母为 $${tail}$。`,
      ],
    );
  },
);

/** deeperRealAnalysisThirdPoints maps topics of Real Analysis to a third knowledge point. */
export const deeperRealAnalysisThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "suprema-of-sets-of-reals": [supOfImage],
  "the-monotone-convergence-theorem": [whichFixedPoint],
  "cauchy-sequences": [harmonicGap],
  "absolute-and-conditional-convergence-of-series": [classifyAlternating],
  "rearrangements-of-series": [absoluteRearrangement],
  "cauchy-products-of-series": [cauchyProductReverse],
  "kinds-of-discontinuities": [removingDiscontinuity],
  "the-sequential-criterion-for-continuity": [rationalIrrational],
  "the-bisection-proof": [threeBisections],
  "complete-metric-spaces": [contractionBound],
  "compactness-on-the-real-line": [subsequenceLimit],
  "open-covers": [lebesgueNumber],
  "uniform-continuity": [uniformSqrt],
  "rolles-theorem-and-counting-zeros": [exactCubicZeros],
  "darbouxs-theorem": [darbouxCount],
  "exchanging-limits-and-integrals": [escapingMass],
  "the-weierstrass-m-test": [mTestTerms],
};
