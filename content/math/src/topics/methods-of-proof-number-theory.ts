import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";

import { numberProblem, yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { isPrimeNumber, range } from "./methods-of-proof-common.ts";

// Methods of Proof unit 4: divisibility, the Euclidean algorithm and proof by induction.

/** gcd is the greatest common divisor of two integers. */
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** lcm is the least common multiple of two positive integers. */
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** floorDiv is the quotient of the division algorithm: the q with a = bq + r and 0 ≤ r < b. */
export const floorDiv = (a: number, b: number) => Math.floor(a / b);

/** mod is the remainder of the division algorithm, always in 0..b−1. */
export const mod = (a: number, b: number) => ((a % b) + b) % b;

/** bezout finds integers x, y with ax + by = gcd(a, b), by the extended Euclidean algorithm. */
export function bezout(a: number, b: number): [number, number] {
  if (b === 0) return [Math.sign(a) || 1, 0];
  const [x, y] = bezout(b, mod(a, b));
  return [y, x - floorDiv(a, b) * y];
}

/** factorize lists the prime factorization of n > 1 as [prime, exponent] pairs. */
export function factorize(n: number): [number, number][] {
  const out: [number, number][] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e++;
    }
    if (e > 0) out.push([p, e]);
  }
  if (m > 1) out.push([m, 1]);
  return out;
}

/** signed writes "+ 3" or "- 3" after a term, or nothing for 0. */
const signed = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** math wraps LaTeX as an option. */
const math = (s: string) => t(`$${s}$`, `$${s}$`);

/** parity classifies integers and expressions as even or odd. */
export const parity: TopicDef = {
  id: "parity",
  title: t("Parity", "奇偶性"),
  summary: t(
    "Every integer is either even or odd; parity of sums and products follows simple rules.",
    "每个整数要么是偶数，要么是奇数；和与积的奇偶性遵循简单的规则。",
  ),
  prerequisites: ["proving-parity"],
  encompasses: [{ topic: "proving-parity", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "parity-of-arithmetic-expressions",
      title: t("Parity of expressions", "表达式的奇偶性"),
      explanation: t(
        "Track only parity: even + odd is odd, odd · odd is odd, and a product is even if any factor is even. So $37 \\cdot 59 + 84$ is odd + even, which is odd, without computing it.",
        "只需跟踪奇偶性：偶 + 奇 = 奇，奇 · 奇 = 奇，乘积中只要有一个因数是偶数，乘积就是偶数。所以无需计算，$37 \\cdot 59 + 84$ 是奇 + 偶，为奇数。",
      ),
      generate(rng) {
        const a = rng.int(11, 99);
        const b = rng.int(11, 99);
        const c = rng.int(11, 99);
        const e = rng.int(2, 9);
        const forms: [string, number][] = [
          [`${a} \\cdot ${b} + ${c}`, a * b + c],
          [`${a}^{${e}} + ${b}`, a + b],
          [`${a} \\cdot ${b} \\cdot ${c} - 1`, a * b * c - 1],
          [`${a}^{${e}} - ${b}^{${e}}`, a - b],
          [`${a} + ${b} + ${c}`, a + b + c],
          [`(${a} + ${b}) \\cdot ${c}`, (a + b) * c],
        ];
        const [expr, v] = rng.pick(forms);
        const r = mod(v, 2);
        const options = [t("Even", "偶数"), t("Odd", "奇数")];
        return oneOf(
          rng,
          t(`Is $${expr}$ even or odd?`, `$${expr}$ 是偶数还是奇数？`),
          options[r]!,
          [options[1 - r]!],
          t(
            `Replace each number by its parity (a power has the parity of its base): the result is ${r === 0 ? "even" : "odd"}.`,
            `把每个数换成它的奇偶性（幂与底数同奇偶）：结果是${r === 0 ? "偶数" : "奇数"}。`,
          ),
        );
      },
    },
    {
      id: "counting-odd-and-even-integers",
      title: t("Counting odd and even integers", "统计奇数与偶数的个数"),
      explanation: t(
        "Between $a$ and $b$ the integers alternate in parity. From $3$ to $20$ there are $18$ integers: $9$ odd and $9$ even. From $3$ to $21$ there are $19$: the ends are odd, so $10$ are odd.",
        "从 $a$ 到 $b$ 的整数奇偶交替。从 $3$ 到 $20$ 共 $18$ 个整数：$9$ 个奇数，$9$ 个偶数。从 $3$ 到 $21$ 共 $19$ 个：两端都是奇数，所以有 $10$ 个奇数。",
      ),
      generate(rng) {
        const a = rng.int(-30, 40);
        const b = a + rng.int(5, 60);
        const odd = rng.bool();
        const count = range(a, b).filter((x) => mod(x, 2) === (odd ? 1 : 0)).length;
        const word = odd ? t("odd", "奇数") : t("even", "偶数");
        return numberProblem({
          prompt: t(
            `How many ${word.en} integers $n$ satisfy $${a} \\le n \\le ${b}$?`,
            `满足 $${a} \\le n \\le ${b}$ 的${word["zh-CN"]}有多少个？`,
          ),
          answer: count,
          wrong: [b - a + 1 - count, Math.floor((b - a) / 2), b - a + 1],
          solution: t(
            `There are $${b - a + 1}$ integers, alternating in parity, and $${count}$ of them are ${word.en}.`,
            `共有 $${b - a + 1}$ 个整数，奇偶交替，其中 $${count}$ 个是${word["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

/** integerDivisibility applies the definition a | b. */
export const integerDivisibility: TopicDef = {
  id: "integer-divisibility",
  title: t("Integer Divisibility", "整数的整除"),
  summary: t(
    "For integers a and b, a | b when b = ak for some integer k; negative numbers and 0 follow the same definition.",
    "对整数 a、b，若存在整数 k 使 b = ak，则 a | b；负数和 0 也遵循同样的定义。",
  ),
  prerequisites: ["proving-divisibility"],
  encompasses: [{ topic: "proving-divisibility", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "deciding-divisibility",
      title: t("Deciding divisibility", "判断整除"),
      explanation: t(
        "One integer divides another when the second is an integer multiple of the first, which allows negative numbers and zero. $-6 \\mid 42$ since $42 = (-6)(-7)$; $7 \\mid 0$ since $0 = 7 \\cdot 0$; but $0 \\nmid 5$, because $0 \\cdot k = 0$ for every $k$. Signs do not affect divisibility.",
        "一个整数整除另一个整数，是指后者是前者的整数倍，这里允许负数和零。$-6 \\mid 42$，因为 $42 = (-6)(-7)$；$7 \\mid 0$，因为 $0 = 7 \\cdot 0$；但 $0 \\nmid 5$，因为对每个 $k$，$0 \\cdot k = 0$。符号不影响整除性。",
      ),
      generate(rng) {
        const kind = rng.int(0, 5);
        let a: number;
        let b: number;
        if (kind === 0) {
          a = rng.int(2, 15) * (rng.bool() ? -1 : 1);
          b = 0;
        } else if (kind === 1) {
          a = 0;
          b = rng.int(1, 30) * (rng.bool() ? -1 : 1);
        } else {
          a = rng.int(2, 15) * (rng.bool() ? -1 : 1);
          b = (kind < 4 ? a * rng.int(-12, 12) : a * rng.int(-12, 12) + rng.int(1, Math.abs(a) - 1)) || a;
        }
        const value = a === 0 ? b === 0 : b % a === 0;
        return oneOf(
          rng,
          t(`Is it true that $${a} \\mid ${b}$?`, `$${a} \\mid ${b}$ 成立吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          a === 0
            ? t(`$0 \\cdot k = 0 \\ne ${b}$ for every integer $k$.`, `对每个整数 $k$，$0 \\cdot k = 0 \\ne ${b}$。`)
            : value
              ? t(
                  `Yes: $${a} \\mid ${b}$ means $${b} = ${a}k$ for some integer $k$, and $k = ${b / a}$ works: $${b} = (${a})(${b / a})$.`,
                  `成立：$${a} \\mid ${b}$ 表示存在整数 $k$ 使 $${b} = ${a}k$，取 $k = ${b / a}$ 即可：$${b} = (${a})(${b / a})$。`,
                )
              : t(
                  `No: $${a} \\mid ${b}$ would need an integer $k$ with $${b} = ${a}k$, but $${b} / (${a})$ is not an integer.`,
                  `不成立：$${a} \\mid ${b}$ 需要整数 $k$ 使 $${b} = ${a}k$，但 $${b} / (${a})$ 不是整数。`,
                ),
        );
      },
    },
    {
      id: "counting-divisors-and-multiples",
      title: t("Counting divisors and multiples", "统计因数与倍数"),
      explanation: t(
        "The multiples of $d$ between $1$ and $N$ are $d, 2d, \\dots, \\lfloor N/d \\rfloor d$. The positive divisors of $36$ are $1, 2, 3, 4, 6, 9, 12, 18, 36$: nine of them, and eighteen counting negatives.",
        "$1$ 到 $N$ 之间 $d$ 的倍数是 $d, 2d, \\dots, \\lfloor N/d \\rfloor d$。$36$ 的正因数是 $1, 2, 3, 4, 6, 9, 12, 18, 36$，共九个；算上负因数共十八个。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const d = rng.int(3, 17);
          const a = rng.int(-60, 60);
          const b = a + rng.int(30, 200);
          const count = range(a, b).filter((x) => x % d === 0).length;
          return numberProblem({
            prompt: t(
              `How many integers $n$ with $${a} \\le n \\le ${b}$ are divisible by $${d}$?`,
              `满足 $${a} \\le n \\le ${b}$ 且能被 $${d}$ 整除的整数 $n$ 有多少个？`,
            ),
            answer: count,
            wrong: [Math.floor((b - a) / d), Math.floor(b / d), count + 1],
            solution: t(
              `The multiples of $${d}$ in the range run from $${Math.ceil(a / d) * d}$ to $${Math.floor(b / d) * d}$: $${count}$ of them.`,
              `区间内 $${d}$ 的倍数从 $${Math.ceil(a / d) * d}$ 到 $${Math.floor(b / d) * d}$，共 $${count}$ 个。`,
            ),
          });
        }
        const n = rng.int(12, 200);
        const all = rng.bool();
        const pos = range(1, n).filter((x) => n % x === 0).length;
        return numberProblem({
          prompt: t(`How many ${all ? "" : "positive "}integers divide $${n}$?`, `有多少个${all ? "" : "正"}整数整除 $${n}$？`),
          answer: all ? 2 * pos : pos,
          wrong: [all ? pos : 2 * pos, pos - 2, pos + 1],
          solution: t(
            `$${n}$ has $${pos}$ positive divisors${all ? `, and each has a negative partner, giving $${2 * pos}$` : ""}.`,
            `$${n}$ 有 $${pos}$ 个正因数${all ? `，每个都有对应的负因数，共 $${2 * pos}$ 个` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** theDivisionAlgorithm writes a = bq + r with 0 ≤ r < b. */
export const theDivisionAlgorithm: TopicDef = {
  id: "the-division-algorithm",
  title: t("The Division Algorithm", "带余除法"),
  summary: t(
    "For integers a and b > 0 there are unique integers q and r with a = bq + r and 0 ≤ r < b.",
    "对整数 a 与 b > 0，存在唯一的整数 q、r，使 a = bq + r 且 0 ≤ r < b。",
  ),
  prerequisites: ["integer-divisibility"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "remainders-of-negative-integers",
      title: t("Remainders", "余数"),
      explanation: t(
        "The division algorithm requires a remainder between zero and the divisor, so for negative numbers the quotient must be rounded down. The remainder is never negative. $-23 = 5 \\cdot (-5) + 2$, so dividing $-23$ by $5$ gives $q = -5$ and $r = 2$, not $q = -4$, $r = -3$.",
        "带余除法要求余数介于零和除数之间，所以对于负数，商必须向下取整。余数永远不为负。$-23 = 5 \\cdot (-5) + 2$，所以 $-23$ 除以 $5$ 得 $q = -5$，$r = 2$，而不是 $q = -4$，$r = -3$。",
      ),
      generate(rng) {
        const b = rng.int(3, 15);
        const a = rng.int(-150, 150);
        const r = mod(a, b);
        return numberProblem({
          prompt: t(
            `Write $${a} = ${b}q + r$ with $0 \\le r < ${b}$. Find $r$.`,
            `把 $${a}$ 写成 $${b}q + r$，其中 $0 \\le r < ${b}$。求 $r$。`,
          ),
          answer: r,
          wrong: [Math.abs(a) % b, a % b, b - r],
          solution: t(
            `Take $q = \\lfloor ${a} / ${b} \\rfloor = ${floorDiv(a, b)}$, the largest integer with $${b}q \\le ${a}$; then $r = ${a} - ${b} \\cdot (${floorDiv(a, b)}) = ${r}$, which lies in $[0, ${b})$.`,
            `取 $q = \\lfloor ${a} / ${b} \\rfloor = ${floorDiv(a, b)}$，即满足 $${b}q \\le ${a}$ 的最大整数；于是 $r = ${a} - ${b} \\cdot (${floorDiv(a, b)}) = ${r}$，它在 $[0, ${b})$ 中。`,
          ),
        });
      },
    },
    {
      id: "quotients-of-the-division-algorithm",
      title: t("Quotients", "商"),
      explanation: t(
        "The quotient is the floor of the exact ratio, which is what keeps the remainder from becoming negative. The quotient is $q = \\lfloor a/b \\rfloor$, rounding down even for negative $a$: dividing $-23$ by $5$ gives $q = \\lfloor -4.6 \\rfloor = -5$.",
        "商是精确比值的向下取整，正是这一点保证余数不会变成负数。商是 $q = \\lfloor a/b \\rfloor$，即使 $a$ 为负也向下取整：$-23$ 除以 $5$ 得 $q = \\lfloor -4.6 \\rfloor = -5$。",
      ),
      generate(rng) {
        const b = rng.int(3, 15);
        const a = rng.int(-200, 200);
        const q = floorDiv(a, b);
        return numberProblem({
          prompt: t(
            `Write $${a} = ${b}q + r$ with $0 \\le r < ${b}$. Find $q$.`,
            `把 $${a}$ 写成 $${b}q + r$，其中 $0 \\le r < ${b}$。求 $q$。`,
          ),
          answer: q,
          wrong: [Math.trunc(a / b), q + 1, -q],
          solution: t(
            `$q = \\lfloor ${a}/${b} \\rfloor = ${q}$, and $${a} = ${b} \\cdot (${q}) + ${mod(a, b)}$.`,
            `$q = \\lfloor ${a}/${b} \\rfloor = ${q}$，且 $${a} = ${b} \\cdot (${q}) + ${mod(a, b)}$。`,
          ),
        });
      },
    },
  ],
};

/** euclidSteps lists the divisions of the Euclidean algorithm on a > b > 0. */
function euclidSteps(a: number, b: number): string[] {
  const lines: string[] = [];
  let [x, y] = [a, b];
  while (y !== 0) {
    lines.push(`${x} = ${y} \\cdot ${floorDiv(x, y)} + ${mod(x, y)}`);
    [x, y] = [y, mod(x, y)];
  }
  return lines;
}

/** euclidPair picks a pair with a nontrivial Euclidean algorithm. */
function euclidPair(rng: Rng, coprime = false): [number, number] {
  for (;;) {
    const g = coprime ? 1 : rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13]);
    const a = g * rng.int(5, 40);
    const b = g * rng.int(3, 30);
    if (a > b && gcd(a, b) === g && euclidSteps(a, b).length >= 3) return [a, b];
  }
}

/** theEuclideanAlgorithm computes greatest common divisors by repeated division. */
export const theEuclideanAlgorithm: TopicDef = {
  id: "the-euclidean-algorithm",
  title: t("The Euclidean Algorithm", "欧几里得算法"),
  summary: t(
    "gcd(a, b) = gcd(b, r) where r is the remainder of a divided by b; repeating until the remainder is 0 gives the gcd.",
    "gcd(a, b) = gcd(b, r)，其中 r 是 a 除以 b 的余数；重复直到余数为 0，就得到最大公因数。",
  ),
  prerequisites: ["the-division-algorithm", "greatest-common-factor"],
  encompasses: [{ topic: "greatest-common-factor", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "one-step-of-the-euclidean-algorithm",
      title: t("One step", "一步"),
      explanation: t(
        "If $a = bq + r$, every common divisor of $a$ and $b$ divides $r = a - bq$, and every common divisor of $b$ and $r$ divides $a$. So $\\gcd(a, b) = \\gcd(b, r)$: $\\gcd(252, 105) = \\gcd(105, 42)$.",
        "若 $a = bq + r$，则 $a$ 与 $b$ 的每个公因数都整除 $r = a - bq$，$b$ 与 $r$ 的每个公因数也都整除 $a$。所以 $\\gcd(a, b) = \\gcd(b, r)$：$\\gcd(252, 105) = \\gcd(105, 42)$。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const r = mod(a, b);
        return numberProblem({
          prompt: t(
            `The Euclidean algorithm gives $\\gcd(${a}, ${b}) = \\gcd(${b}, r)$. Find $r$.`,
            `欧几里得算法给出 $\\gcd(${a}, ${b}) = \\gcd(${b}, r)$。求 $r$。`,
          ),
          answer: r,
          wrong: [a - b, floorDiv(a, b), gcd(a, b)],
          solution: t(
            `$${a} = ${b} \\cdot ${floorDiv(a, b)} + ${r}$, so $r = ${r}$.`,
            `$${a} = ${b} \\cdot ${floorDiv(a, b)} + ${r}$，所以 $r = ${r}$。`,
          ),
        });
      },
    },
    {
      id: "computing-gcds-with-the-euclidean-algorithm",
      title: t("Computing the gcd", "计算最大公因数"),
      explanation: t(
        "A common divisor of two numbers also divides their remainder, so replacing the pair by the smaller number and the remainder keeps the gcd the same. Repeat until the remainder is $0$; the last nonzero remainder is the gcd. $252 = 105 \\cdot 2 + 42$, $105 = 42 \\cdot 2 + 21$, $42 = 21 \\cdot 2 + 0$, so $\\gcd(252, 105) = 21$.",
        "两个数的公因数也整除它们的余数，所以把这一对数换成较小的数和余数，最大公因数不变。重复直到余数为 $0$；最后一个非零余数就是最大公因数。$252 = 105 \\cdot 2 + 42$，$105 = 42 \\cdot 2 + 21$，$42 = 21 \\cdot 2 + 0$，所以 $\\gcd(252, 105) = 21$。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const g = gcd(a, b);
        const steps = euclidSteps(a, b);
        return numberProblem({
          prompt: t(`Use the Euclidean algorithm to find $\\gcd(${a}, ${b})$.`, `用欧几里得算法求 $\\gcd(${a}, ${b})$。`),
          answer: g,
          wrong: [mod(a, b), g * 2, 1],
          solution: t(
            `$${steps.join(",\\ ")}$. The last nonzero remainder is $${g}$.`,
            `$${steps.join(",\\ ")}$。最后一个非零余数是 $${g}$。`,
          ),
        });
      },
    },
  ],
};

/** theExtendedEuclideanAlgorithm writes gcd(a, b) as a combination of a and b. */
export const theExtendedEuclideanAlgorithm: TopicDef = {
  id: "the-extended-euclidean-algorithm",
  title: t("The Extended Euclidean Algorithm", "扩展欧几里得算法"),
  summary: t(
    "Working the Euclidean algorithm backwards writes gcd(a, b) = ax + by for integers x and y (Bézout's identity).",
    "把欧几里得算法倒推回去，可以把 gcd(a, b) 写成 ax + by（x、y 为整数），即裴蜀等式。",
  ),
  prerequisites: ["the-euclidean-algorithm"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bezout-coefficients",
      title: t("Bézout coefficients", "裴蜀系数"),
      explanation: t(
        "Working back through the Euclidean algorithm writes the gcd as an integer combination of the two original numbers. From $35 = 12 \\cdot 2 + 11$ and $12 = 11 \\cdot 1 + 1$: $1 = 12 - 11 = 12 - (35 - 2 \\cdot 12) = 3 \\cdot 12 - 35$. So $35x + 12y = 1$ with $x = -1$, $y = 3$. Adding $12$ to $x$ and subtracting $35$ from $y$ gives another solution, such as $x = 11$, $y = -32$.",
        "沿着欧几里得算法倒推，就能把最大公因数写成两个原数的整数组合。由 $35 = 12 \\cdot 2 + 11$ 与 $12 = 11 \\cdot 1 + 1$：$1 = 12 - 11 = 12 - (35 - 2 \\cdot 12) = 3 \\cdot 12 - 35$。所以 $35x + 12y = 1$ 有解 $x = -1$，$y = 3$。把 $x$ 加 $12$、$y$ 减 $35$ 得到另一组解，例如 $x = 11$，$y = -32$。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const g = gcd(a, b);
        const m = b / g;
        const [x0] = bezout(a, b);
        const x = mod(x0, m);
        const y = (g - a * x) / b;
        return numberProblem({
          prompt: t(
            `There are integers $x, y$ with $${a}x + ${b}y = ${g}$ and $0 \\le x < ${m}$. Find $x$.`,
            `存在整数 $x, y$ 使 $${a}x + ${b}y = ${g}$ 且 $0 \\le x < ${m}$。求 $x$。`,
          ),
          answer: x,
          wrong: [m - x, x0, mod(-x0, m) === x ? x + 1 : mod(-x0, m)],
          solution: t(
            `Back-substituting through $${euclidSteps(a, b).join(",\\ ")}$ gives $${a}(${x0}) + ${b}(${(g - a * x0) / b}) = ${g}$. Shifting $x$ by multiples of $${m}$: $x = ${x}$, $y = ${y}$.`,
            `沿 $${euclidSteps(a, b).join(",\\ ")}$ 倒推得 $${a}(${x0}) + ${b}(${(g - a * x0) / b}) = ${g}$。把 $x$ 加减 $${m}$ 的倍数：$x = ${x}$，$y = ${y}$。`,
          ),
        });
      },
    },
    {
      id: "scaling-bezout-identities",
      title: t("Scaling a Bézout identity", "放大裴蜀等式"),
      explanation: t(
        "Multiplying both sides of the identity by the same integer turns a solution for the gcd into a solution for any multiple of it. If $ax_0 + by_0 = g$, then multiplying by $k$ solves $ax + by = kg$: $x = kx_0$, $y = ky_0$. From $35(-1) + 12(3) = 1$ we get $35(-5) + 12(15) = 5$.",
        "把恒等式两边乘以同一个整数，就把关于最大公因数的解变成关于它任意倍数的解。若 $ax_0 + by_0 = g$，两边乘 $k$ 就得到 $ax + by = kg$ 的解：$x = kx_0$，$y = ky_0$。由 $35(-1) + 12(3) = 1$ 得 $35(-5) + 12(15) = 5$。",
      ),
      generate(rng) {
        const [a, b] = euclidPair(rng);
        const g = gcd(a, b);
        const [x0, y0] = bezout(a, b);
        const k = rng.int(2, 9);
        const askX = rng.bool();
        return numberProblem({
          prompt: t(
            `Given $${a}(${x0}) + ${b}(${y0}) = ${g}$, find the solution of $${a}x + ${b}y = ${k * g}$ with ${askX ? `$y = ${k * y0}$. What is $x$?` : `$x = ${k * x0}$. What is $y$?`}`,
            `已知 $${a}(${x0}) + ${b}(${y0}) = ${g}$，求 $${a}x + ${b}y = ${k * g}$ 满足${askX ? `$y = ${k * y0}$ 的解。$x$ 是多少？` : `$x = ${k * x0}$ 的解。$y$ 是多少？`}`,
          ),
          answer: askX ? k * x0 : k * y0,
          wrong: askX ? [x0, x0 + k, k * y0] : [y0, y0 + k, k * x0],
          solution: t(
            `Multiply the identity by $${k}$: $${a}(${k * x0}) + ${b}(${k * y0}) = ${k * g}$.`,
            `把等式乘以 $${k}$：$${a}(${k * x0}) + ${b}(${k * y0}) = ${k * g}$。`,
          ),
        });
      },
    },
  ],
};

/** linearDiophantineEquations solves ax + by = c in integers. */
export const linearDiophantineEquations: TopicDef = {
  id: "linear-diophantine-equations",
  title: t("Linear Diophantine Equations", "线性丢番图方程"),
  summary: t(
    "ax + by = c has integer solutions exactly when gcd(a, b) | c; they are x = x₀ + (b/g)t, y = y₀ − (a/g)t.",
    "ax + by = c 有整数解当且仅当 gcd(a, b) | c；通解为 x = x₀ + (b/g)t，y = y₀ − (a/g)t。",
  ),
  prerequisites: ["the-extended-euclidean-algorithm"],
  encompasses: [{ topic: "the-extended-euclidean-algorithm", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "existence-of-integer-solutions",
      title: t("Existence of solutions", "解的存在性"),
      explanation: t(
        "$g = \\gcd(a, b)$ divides $ax + by$ for all integers $x, y$, so a solution needs $g \\mid c$; Bézout's identity shows this is enough. $6x + 15y = 21$ has solutions; $6x + 15y = 20$ does not.",
        "$g = \\gcd(a, b)$ 整除任意整数 $x, y$ 对应的 $ax + by$，所以有解需要 $g \\mid c$；裴蜀等式说明这也是充分的。$6x + 15y = 21$ 有解，$6x + 15y = 20$ 无解。",
      ),
      generate(rng) {
        const g = rng.int(1, 9);
        let a: number;
        let b: number;
        do {
          a = g * rng.int(2, 15);
          b = g * rng.int(2, 15);
        } while (gcd(a, b) !== g);
        const value = rng.bool();
        const c = value ? g * rng.int(1, 30) : g * rng.int(1, 30) + rng.int(1, Math.max(1, g - 1));
        const ok = c % g === 0;
        return oneOf(
          rng,
          t(`Does $${a}x + ${b}y = ${c}$ have a solution in integers?`, `$${a}x + ${b}y = ${c}$ 有整数解吗？`),
          yesNo[ok ? 0 : 1]!,
          [yesNo[ok ? 1 : 0]!],
          t(
            `$\\gcd(${a}, ${b}) = ${g}$, which ${ok ? "divides" : "does not divide"} $${c}$.`,
            `$\\gcd(${a}, ${b}) = ${g}$，它${ok ? "整除" : "不整除"} $${c}$。`,
          ),
        );
      },
    },
    {
      id: "counting-positive-solutions",
      title: t("Counting positive solutions", "统计正整数解"),
      explanation: t(
        "All solutions of a linear Diophantine equation come from one by adding steps along a parameter, so find the parameter values that keep both positive. The solutions of $3x + 5y = 52$ are $x = 4 + 5t$, $y = 8 - 3t$. Both are positive for $t = 0, 1, 2$, so there are three positive solutions: $(4, 8)$, $(9, 5)$, $(14, 2)$.",
        "线性丢番图方程的所有解都可以由一个解沿参数逐步得到，所以找出使两者都为正的参数值。$3x + 5y = 52$ 的解为 $x = 4 + 5t$，$y = 8 - 3t$。当 $t = 0, 1, 2$ 时两者都为正，所以有三组正整数解：$(4, 8)$、$(9, 5)$、$(14, 2)$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 12);
          const b = rng.int(2, 12);
          const c = rng.int(20, 150);
          if (a === b || c % gcd(a, b) !== 0) continue;
          const sols = range(1, c).filter((x) => c - a * x > 0 && (c - a * x) % b === 0);
          if (sols.length === 0) continue;
          return numberProblem({
            prompt: t(
              `How many pairs of positive integers $(x, y)$ satisfy $${a}x + ${b}y = ${c}$?`,
              `有多少对正整数 $(x, y)$ 满足 $${a}x + ${b}y = ${c}$？`,
            ),
            answer: sols.length,
            wrong: [sols.length + 1, Math.floor(c / (a * b)), sols.length - 1],
            solution: t(
              `The positive solutions are ${sols.map((x) => `$(${x}, ${(c - a * x) / b})$`).join(", ")}.`,
              `正整数解为 ${sols.map((x) => `$(${x}, ${(c - a * x) / b})$`).join("、")}。`,
            ),
          });
        }
      },
    },
  ],
};

/** Property is a divisibility claim with numbers filled in. */
interface Property {
  readonly claim: Text;
  readonly value: boolean;
  readonly why: Text;
}

/** divisibilityProperty picks a concrete divisibility claim. */
function divisibilityProperty(rng: Rng): Property {
  const kind = rng.int(0, 5);
  const d = rng.int(2, 15);
  if (kind === 0)
    return {
      claim: t(`If $${d} \\mid m$ and $m \\mid n$, must $${d} \\mid n$?`, `若 $${d} \\mid m$ 且 $m \\mid n$，是否一定有 $${d} \\mid n$？`),
      value: true,
      why: t(`$m = ${d}j$ and $n = mk = ${d}(jk)$.`, `$m = ${d}j$，$n = mk = ${d}(jk)$。`),
    };
  if (kind === 1) {
    const a = rng.int(2, 12);
    const b = rng.pick(range(2, 12).filter((x) => x !== a));
    const value = gcd(a, b) === 1;
    return {
      claim: t(
        `If $${a} \\mid m$ and $${b} \\mid m$, must $${a * b} \\mid m$?`,
        `若 $${a} \\mid m$ 且 $${b} \\mid m$，是否一定有 $${a * b} \\mid m$？`,
      ),
      value,
      why: value
        ? t(
            `$${a}$ and $${b}$ share no factor, so $m$ is a multiple of $\\operatorname{lcm}(${a}, ${b}) = ${a * b}$.`,
            `$${a}$ 与 $${b}$ 没有公因数，所以 $m$ 是 $\\operatorname{lcm}(${a}, ${b}) = ${a * b}$ 的倍数。`,
          )
        : t(
            `$m = ${lcm(a, b)}$ is divisible by both but not by $${a * b}$.`,
            `$m = ${lcm(a, b)}$ 能被两者整除，但不能被 $${a * b}$ 整除。`,
          ),
    };
  }
  if (kind === 2)
    return {
      claim: t(
        `If $${d} \\mid m + n$ and $${d} \\mid m$, must $${d} \\mid n$?`,
        `若 $${d} \\mid m + n$ 且 $${d} \\mid m$，是否一定有 $${d} \\mid n$？`,
      ),
      value: true,
      why: t(`$n = (m + n) - m$ is a difference of multiples of $${d}$.`, `$n = (m + n) - m$ 是 $${d}$ 的倍数之差。`),
    };
  if (kind === 3)
    return {
      claim: t(`If $${d} \\mid m + n$, must $${d} \\mid m$?`, `若 $${d} \\mid m + n$，是否一定有 $${d} \\mid m$？`),
      value: false,
      why: t(
        `$m = 1$, $n = ${d - 1}$ gives $m + n = ${d}$, but $${d} \\nmid 1$.`,
        `$m = 1$，$n = ${d - 1}$ 时 $m + n = ${d}$，但 $${d} \\nmid 1$。`,
      ),
    };
  if (kind === 4) {
    const k = rng.int(2, 5);
    return {
      claim: t(`If $${d} \\mid m$, must $${d} \\mid m^{${k}}$?`, `若 $${d} \\mid m$，是否一定有 $${d} \\mid m^{${k}}$？`),
      value: true,
      why: t(
        `$m^{${k}} = m \\cdot m^{${k - 1}}$ is a multiple of $m$, hence of $${d}$.`,
        `$m^{${k}} = m \\cdot m^{${k - 1}}$ 是 $m$ 的倍数，从而是 $${d}$ 的倍数。`,
      ),
    };
  }
  const c = rng.int(2, 9);
  return {
    claim: t(`If $${d} \\mid m$, must $${d * c} \\mid ${c}m$?`, `若 $${d} \\mid m$，是否一定有 $${d * c} \\mid ${c}m$？`),
    value: true,
    why: t(`$m = ${d}j$ gives $${c}m = ${d * c}j$.`, `$m = ${d}j$ 推出 $${c}m = ${d * c}j$。`),
  };
}

/** propertiesOfIntegerDivisibility uses transitivity, combinations and lcms. */
export const propertiesOfIntegerDivisibility: TopicDef = {
  id: "properties-of-integer-divisibility",
  title: t("Properties of Integer Divisibility", "整除的性质"),
  summary: t(
    "Divisibility is transitive, passes to linear combinations, and a | m, b | m imply lcm(a, b) | m.",
    "整除具有传递性，可传递给线性组合；并且 a | m、b | m 推出 lcm(a, b) | m。",
  ),
  prerequisites: ["integer-divisibility", "least-common-multiple"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "which-divisibility-claims-hold",
      title: t("Which claims hold", "哪些命题成立"),
      explanation: t(
        "Each true divisibility claim follows from writing numbers as multiples, and each false one is shown by a small counterexample. True: if $a \\mid b$ and $b \\mid c$ then $a \\mid c$; if $a \\mid b$ and $a \\mid c$ then $a \\mid bx + cy$. False in general: $a \\mid b + c \\Rightarrow a \\mid b$, and $a \\mid m, b \\mid m \\Rightarrow ab \\mid m$ (try $4 \\mid 12$, $6 \\mid 12$, $24 \\nmid 12$).",
        "每个成立的整除命题都可以通过把数写成倍数来证明，每个不成立的命题都可以用一个小的反例说明。成立：若 $a \\mid b$ 且 $b \\mid c$，则 $a \\mid c$；若 $a \\mid b$ 且 $a \\mid c$，则 $a \\mid bx + cy$。一般不成立：$a \\mid b + c \\Rightarrow a \\mid b$，以及 $a \\mid m, b \\mid m \\Rightarrow ab \\mid m$（试 $4 \\mid 12$，$6 \\mid 12$，$24 \\nmid 12$）。",
      ),
      generate(rng) {
        const p = divisibilityProperty(rng);
        return oneOf(rng, p.claim, yesNo[p.value ? 0 : 1]!, [yesNo[p.value ? 1 : 0]!], p.why);
      },
    },
    {
      id: "smallest-common-multiples",
      title: t("Smallest common multiples", "最小公倍数"),
      explanation: t(
        "Every common multiple of two numbers is a multiple of their least common multiple, so the least common multiple is the smallest positive one. If $a \\mid m$ and $b \\mid m$ for a positive integer $m$, then $\\operatorname{lcm}(a, b) \\mid m$, so the smallest such $m$ is $\\operatorname{lcm}(a, b) = ab/\\gcd(a, b)$.",
        "两个数的每个公倍数都是它们最小公倍数的倍数，所以最小公倍数是最小的正公倍数。若正整数 $m$ 满足 $a \\mid m$ 且 $b \\mid m$，则 $\\operatorname{lcm}(a, b) \\mid m$，所以这样的最小 $m$ 是 $\\operatorname{lcm}(a, b) = ab/\\gcd(a, b)$。",
      ),
      generate(rng) {
        const a = rng.int(4, 30);
        const b = rng.int(4, 30);
        const c = rng.bool() ? rng.int(2, 10) : 1;
        const L = lcm(lcm(a, b), c);
        const list = c === 1 ? `${a}` : `${a}, ${c}`;
        return numberProblem({
          prompt: t(
            `What is the smallest positive integer $m$ divisible by ${c === 1 ? `$${a}$ and $${b}$` : `$${a}$, $${b}$ and $${c}$`}?`,
            `能被 ${c === 1 ? `$${a}$ 和 $${b}$` : `$${a}$、$${b}$ 和 $${c}$`} 整除的最小正整数 $m$ 是多少？`,
          ),
          answer: L,
          wrong: [a * b * c, gcd(a, b), L * 2],
          solution: t(
            `$m$ must be a multiple of $\\operatorname{lcm}(${list}, ${b}) = ${L}$.`,
            `$m$ 必须是 $\\operatorname{lcm}(${list}, ${b}) = ${L}$ 的倍数。`,
          ),
        });
      },
    },
  ],
};

/** isSquarefree tests whether no prime squared divides n. */
const isSquarefree = (n: number) => factorize(n).every(([, e]) => e === 1);

/** propertiesOfPrimeDivisibility applies Euclid's lemma. */
export const propertiesOfPrimeDivisibility: TopicDef = {
  id: "properties-of-prime-divisibility",
  title: t("Properties of Prime Divisibility", "素数整除的性质"),
  summary: t(
    "Euclid's lemma: if a prime p divides mn, then p | m or p | n. This fails for composite divisors.",
    "欧几里得引理：若素数 p 整除 mn，则 p | m 或 p | n。对合数除数不成立。",
  ),
  prerequisites: ["properties-of-integer-divisibility", "linear-diophantine-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "euclids-lemma",
      title: t("Euclid's lemma", "欧几里得引理"),
      explanation: t(
        "If $p$ is prime, $p \\mid mn$ and $p \\nmid m$, then $\\gcd(p, m) = 1$, so $px + my = 1$ and $n = pnx + mny$ is divisible by $p$. For composite $d$ it fails: $6 \\mid 4 \\cdot 3$ but $6 \\nmid 4$ and $6 \\nmid 3$.",
        "若 $p$ 是素数，$p \\mid mn$ 且 $p \\nmid m$，则 $\\gcd(p, m) = 1$，于是 $px + my = 1$，$n = pnx + mny$ 能被 $p$ 整除。对合数 $d$ 不成立：$6 \\mid 4 \\cdot 3$，但 $6 \\nmid 4$ 且 $6 \\nmid 3$。",
      ),
      generate(rng) {
        const d = rng.int(2, 40);
        const power = rng.bool();
        const k = rng.int(2, 4);
        const value = power ? isSquarefree(d) : isPrimeNumber(d);
        const f = factorize(d);
        const claim = power
          ? t(`If $${d} \\mid m^{${k}}$, must $${d} \\mid m$?`, `若 $${d} \\mid m^{${k}}$，是否一定有 $${d} \\mid m$？`)
          : t(
              `If $${d} \\mid mn$ and $${d} \\nmid m$, must $${d} \\mid n$?`,
              `若 $${d} \\mid mn$ 且 $${d} \\nmid m$，是否一定有 $${d} \\mid n$？`,
            );
        let why: Text;
        if (value)
          why = power
            ? t(
                `Each prime factor of $${d}$ divides $m^{${k}}$, so by Euclid's lemma divides $m$; they are distinct, so their product $${d}$ divides $m$.`,
                `$${d}$ 的每个素因数整除 $m^{${k}}$，由欧几里得引理整除 $m$；它们互不相同，所以乘积 $${d}$ 整除 $m$。`,
              )
            : t(`$${d}$ is prime, so Euclid's lemma applies.`, `$${d}$ 是素数，欧几里得引理适用。`);
        else if (power) {
          const m = f.reduce((acc, [p, e]) => acc * p ** Math.ceil(e / k), 1);
          why = t(
            `$m = ${m}$: $${d} \\mid ${m}^{${k}}$ but $${d} \\nmid ${m}$.`,
            `$m = ${m}$：$${d} \\mid ${m}^{${k}}$，但 $${d} \\nmid ${m}$。`,
          );
        } else {
          const p = f[0]![0];
          const m = p;
          const n = d / p;
          why = t(
            `$m = ${m}$, $n = ${n}$: $${d} \\mid ${m * n}$ but $${d} \\nmid ${m}$ and $${d} \\nmid ${n}$.`,
            `$m = ${m}$，$n = ${n}$：$${d} \\mid ${m * n}$，但 $${d} \\nmid ${m}$ 且 $${d} \\nmid ${n}$。`,
          );
        }
        return oneOf(rng, claim, yesNo[value ? 0 : 1]!, [yesNo[value ? 1 : 0]!], why);
      },
    },
    {
      id: "smallest-m-with-d-dividing-a-power",
      title: t("Divisors of powers", "幂的因数"),
      explanation: t(
        "Raising a number to a power multiplies the exponent of every prime in it, so each prime must appear often enough to reach the divisor's exponent. $d \\mid m^k$ exactly when each prime $p^e$ in $d$ has $p^{\\lceil e/k \\rceil} \\mid m$. The smallest positive $m$ with $72 = 2^3 \\cdot 3^2 \\mid m^2$ is $2^2 \\cdot 3 = 12$.",
        "把一个数升幂会使其中每个素数的指数相乘，所以每个素数必须出现足够多次，才能达到因数中的指数。$d \\mid m^k$ 当且仅当 $d$ 中每个素数幂 $p^e$ 都满足 $p^{\\lceil e/k \\rceil} \\mid m$。满足 $72 = 2^3 \\cdot 3^2 \\mid m^2$ 的最小正整数 $m$ 是 $2^2 \\cdot 3 = 12$。",
      ),
      generate(rng) {
        let d: number;
        do d = rng.int(8, 400);
        while (isSquarefree(d));
        const k = rng.int(2, 3);
        const f = factorize(d);
        const m = f.reduce((acc, [p, e]) => acc * p ** Math.ceil(e / k), 1);
        const rad = f.reduce((acc, [p]) => acc * p, 1);
        const tex = f.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
        return numberProblem({
          prompt: t(
            `What is the smallest positive integer $m$ such that $${d} \\mid m^{${k}}$?`,
            `使 $${d} \\mid m^{${k}}$ 的最小正整数 $m$ 是多少？`,
          ),
          answer: m,
          wrong: [d, rad, Math.round(Math.sqrt(d)), m * rad],
          solution: t(
            `$${d} = ${tex}$; each exponent $e$ needs at least $\\lceil e/${k} \\rceil$ in $m$, so $m = ${m}$.`,
            `$${d} = ${tex}$；每个指数 $e$ 要求 $m$ 中至少有 $\\lceil e/${k} \\rceil$ 次，所以 $m = ${m}$。`,
          ),
        });
      },
    },
  ],
};

/** mathematicalInduction proves statements for all n ≥ n₀. */
export const mathematicalInduction: TopicDef = {
  id: "mathematical-induction",
  title: t("Mathematical Induction", "数学归纳法"),
  summary: t(
    "Prove P(n₀), then prove P(k) ⇒ P(k + 1) for every k ≥ n₀; together these prove P(n) for all n ≥ n₀.",
    "证明 P(n₀)，再对每个 k ≥ n₀ 证明 P(k) ⇒ P(k + 1)；二者合起来证明了对所有 n ≥ n₀，P(n) 成立。",
  ),
  prerequisites: ["direct-proof", "sigma-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "base-case-and-inductive-step",
      title: t("Base case and inductive step", "基础步骤与归纳步骤"),
      explanation: t(
        "To prove $P(n)$ for all $n \\ge 1$: check the **base case** $P(1)$, then in the **inductive step** assume $P(k)$ (the inductive hypothesis) for an arbitrary $k \\ge 1$ and prove $P(k + 1)$.",
        "要对所有 $n \\ge 1$ 证明 $P(n)$：先验证**基础步骤** $P(1)$，再在**归纳步骤**中对任意 $k \\ge 1$ 假设 $P(k)$（归纳假设），证明 $P(k + 1)$。",
      ),
      generate(rng) {
        const n0 = rng.int(0, 6);
        const a = rng.int(2, 9);
        const c = rng.int(1, 20);
        const stmt = rng.pick([
          (n: string) => `${a}^{${n}} \\ge ${n} + ${c}`,
          (n: string) => `${a} \\mid ${a + 1}^{${n}} - 1`,
          (n: string) => `\\textstyle\\sum_{i=1}^{${n}} ${a}i = ${a}\\frac{${n}(${n} + 1)}{2}`,
        ]);
        const s = (en: string, zh: string) => t(en, zh);
        return oneOf(
          rng,
          t(
            `To prove $${stmt("n")}$ for all integers $n \\ge ${n0}$ by induction, what does the inductive step do?`,
            `用数学归纳法证明对所有整数 $n \\ge ${n0}$ 有 $${stmt("n")}$，归纳步骤要做什么？`,
          ),
          s(
            `Assume $${stmt("k")}$ for some $k \\ge ${n0}$; prove $${stmt("k + 1")}$.`,
            `对某个 $k \\ge ${n0}$ 假设 $${stmt("k")}$；证明 $${stmt("k + 1")}$。`,
          ),
          [
            s(`Assume $${stmt("k + 1")}$; prove $${stmt("k")}$.`, `假设 $${stmt("k + 1")}$；证明 $${stmt("k")}$。`),
            s(`Prove $${stmt(`${n0}`)}$.`, `证明 $${stmt(`${n0}`)}$。`),
            s(
              `Assume $${stmt("n")}$ for all $n \\ge ${n0}$; prove $${stmt("k + 1")}$.`,
              `假设对所有 $n \\ge ${n0}$ 有 $${stmt("n")}$；证明 $${stmt("k + 1")}$。`,
            ),
          ],
          t(
            `The inductive step assumes the statement for one arbitrary $k \\ge ${n0}$ and proves it for $k + 1$. Proving it for $n = ${n0}$ is the base case, and assuming it for all $n$ assumes what is to be proved.`,
            `归纳步骤对任意一个 $k \\ge ${n0}$ 假设命题成立，并证明它对 $k + 1$ 成立。证明 $n = ${n0}$ 的情形是基础步骤；假设对所有 $n$ 成立则是假设了要证明的结论。`,
          ),
        );
      },
    },
    {
      id: "the-inductive-step-for-sums",
      title: t("The inductive step for sums", "求和公式的归纳步骤"),
      explanation: t(
        "The sum up to the next term is the sum up to the current term plus one more term, so the hypothesis replaces the first part. For $\\sum_{i=1}^{n} (2i - 1) = n^2$: assume $\\sum_{i=1}^{k} (2i - 1) = k^2$. Then $\\sum_{i=1}^{k+1} (2i - 1) = k^2 + (2(k + 1) - 1) = k^2 + 2k + 1 = (k + 1)^2$. The new term is the summand at $i = k + 1$.",
        "到下一项的和等于到当前项的和再加一项，所以归纳假设可以替换前一部分。对 $\\sum_{i=1}^{n} (2i - 1) = n^2$：假设 $\\sum_{i=1}^{k} (2i - 1) = k^2$。则 $\\sum_{i=1}^{k+1} (2i - 1) = k^2 + (2(k + 1) - 1) = k^2 + 2k + 1 = (k + 1)^2$。新增的项是 $i = k + 1$ 时的求和项。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(-9, 9);
        const term = (i: string) => `${a === 1 ? "" : a}${i}${signed(b)}`;
        const k1 = (x: string) => (x === "i" ? "i" : `(${x})`);
        const ak = `${a === 1 ? "" : a}k`;
        const right = `${ak}${signed(a + b)}`;
        const opts = [`${ak}${signed(b)}`, `${ak}${signed(a)}`, `${ak}${signed(2 * a + b)}`, `${a === 1 ? "" : a}(k + 1)k`];
        return oneOf(
          rng,
          t(
            `In proving a formula for $\\sum_{i=1}^{n} (${term("i")})$ by induction, $\\sum_{i=1}^{k+1} (${term("i")})$ equals $\\sum_{i=1}^{k} (${term("i")})$ plus what?`,
            `用归纳法证明 $\\sum_{i=1}^{n} (${term("i")})$ 的公式时，$\\sum_{i=1}^{k+1} (${term("i")})$ 等于 $\\sum_{i=1}^{k} (${term("i")})$ 加上什么？`,
          ),
          math(right),
          opts.map(math),
          t(
            `The added term is the summand at $i = k + 1$: $${term(k1("k + 1"))} = ${right}$.`,
            `新增的项是 $i = k + 1$ 时的求和项：$${term(k1("k + 1"))} = ${right}$。`,
          ),
        );
      },
    },
  ],
};

/** firstFrom finds the least N ≤ limit such that f holds for every n from N to limit. */
function firstFrom(f: (n: number) => boolean, from: number, limit: number): number {
  let N = limit;
  while (N - 1 >= from && f(N - 1)) N--;
  return N;
}

/** provingInequalitiesUsingInduction proves inequalities like 2ⁿ > n² for large n. */
export const provingInequalitiesUsingInduction: TopicDef = {
  id: "proving-inequalities-using-induction",
  title: t("Proving Inequalities Using Induction", "用归纳法证明不等式"),
  summary: t(
    "Inequalities like 2ⁿ > n² hold from some n₀ on; the inductive step chains the hypothesis with an estimate.",
    "像 2ⁿ > n² 这样的不等式从某个 n₀ 起成立；归纳步骤把归纳假设与一个估计串联起来。",
  ),
  prerequisites: ["mathematical-induction"],
  encompasses: [{ topic: "mathematical-induction", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-the-base-case",
      title: t("Finding the base case", "确定起点"),
      explanation: t(
        "Induction needs a starting value where the statement holds and from which every step works, so check small values to find where it begins. $2^n > n^2$ fails for $n = 2, 3, 4$ but holds for $n = 5$ ($32 > 25$) and every larger $n$, so an induction proof starts at $n_0 = 5$.",
        "归纳法需要一个使命题成立、并且由此每一步都成立的起点，所以要检查较小的值，找出从哪里开始。$2^n > n^2$ 在 $n = 2, 3, 4$ 时不成立，但在 $n = 5$ 时成立（$32 > 25$），且对更大的 $n$ 都成立，所以归纳证明从 $n_0 = 5$ 开始。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let tex: string;
        let f: (n: number) => boolean;
        if (kind === 0) {
          const a = rng.int(2, 3);
          const c = rng.int(3, 60);
          tex = `${a}^n > ${c}n`;
          f = (n) => a ** n > c * n;
        } else if (kind === 1) {
          const a = rng.int(2, 4);
          const k = rng.int(2, 3);
          tex = `${a}^n > n^{${k}}`;
          f = (n) => a ** n > n ** k;
        } else {
          const a = rng.int(2, 6);
          tex = `n! > ${a}^n`;
          f = (n) => range(1, n).reduce((x, y) => x * y, 1) > a ** n;
        }
        const N = firstFrom(f, 1, 40);
        return numberProblem({
          prompt: t(
            `What is the smallest positive integer $n_0$ such that $${tex}$ holds for every integer $n \\ge n_0$?`,
            `使 $${tex}$ 对每个整数 $n \\ge n_0$ 都成立的最小正整数 $n_0$ 是多少？`,
          ),
          answer: N,
          wrong: [N - 1, N + 1, 1],
          solution: t(
            `$${tex}$ fails at $n = ${N - 1}$ and holds from $n = ${N}$ on, which induction confirms.`,
            `$${tex}$ 在 $n = ${N - 1}$ 时不成立，从 $n = ${N}$ 起成立，这可以用归纳法证明。`,
          ),
        });
      },
    },
    {
      id: "chaining-the-inductive-hypothesis",
      title: t("Chaining the hypothesis", "串联归纳假设"),
      explanation: t(
        "For an inequality, apply the hypothesis to part of the next expression and then show that the extra amount is at least what is needed. To prove $3^n > 5n$ for $n \\ge 3$: assume $3^k > 5k$. Then $3^{k+1} = 3 \\cdot 3^k > 15k = 5k + 10k \\ge 5k + 5 = 5(k + 1)$, using $10k \\ge 5$.",
        "对于不等式，把归纳假设用在下一个表达式的一部分上，再证明多出的量至少达到所需的量。证明 $n \\ge 3$ 时 $3^n > 5n$：假设 $3^k > 5k$。则 $3^{k+1} = 3 \\cdot 3^k > 15k = 5k + 10k \\ge 5k + 5 = 5(k + 1)$，其中用到 $10k \\ge 5$。",
      ),
      generate(rng) {
        const a = rng.int(2, 7);
        const c = rng.int(2, 15);
        return oneOf(
          rng,
          t(
            `Assume $${a}^k > ${c}k$. Multiplying by $${a}$, which inequality follows for $${a}^{k+1}$?`,
            `假设 $${a}^k > ${c}k$。两边乘以 $${a}$，关于 $${a}^{k+1}$ 可得哪个不等式？`,
          ),
          math(`${a}^{k+1} > ${a * c}k`),
          [
            math(`${a}^{k+1} > ${c}k + ${a}`),
            math(`${a}^{k+1} > ${c}(k + 1)k`),
            math(`${a}^{k+1} > ${c + a}k`),
            math(`${a}^{k+1} > ${c}k^{${a}}`),
          ],
          t(
            `$${a}^{k+1} = ${a} \\cdot ${a}^k > ${a} \\cdot ${c}k = ${a * c}k$; it then remains to show $${a * c}k \\ge ${c}(k + 1)$.`,
            `$${a}^{k+1} = ${a} \\cdot ${a}^k > ${a} \\cdot ${c}k = ${a * c}k$；接下来只需证明 $${a * c}k \\ge ${c}(k + 1)$。`,
          ),
        );
      },
    },
  ],
};

/** provingDivisibilityUsingInduction proves d | f(n) for all n. */
export const provingDivisibilityUsingInduction: TopicDef = {
  id: "proving-divisibility-using-induction",
  title: t("Proving Divisibility Using Induction", "用归纳法证明整除性"),
  summary: t(
    "Write f(k + 1) as a multiple of f(k) plus a multiple of d; then d | f(k) gives d | f(k + 1).",
    "把 f(k + 1) 写成 f(k) 的倍数加上 d 的倍数；于是由 d | f(k) 得 d | f(k + 1)。",
  ),
  prerequisites: ["mathematical-induction", "properties-of-integer-divisibility"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-the-next-term",
      title: t("Rewriting the next term", "改写下一项"),
      explanation: t(
        "Rewrite the next expression so that the expression from the hypothesis appears inside it, and the rest is visibly divisible. To prove $7 \\mid 8^n - 1$: $8^{k+1} - 1 = 8 \\cdot 8^k - 8 + 7 = 8(8^k - 1) + 7$. The inductive hypothesis says $7 \\mid 8^k - 1$, and $7 \\mid 7$, so $7 \\mid 8^{k+1} - 1$.",
        "改写下一个表达式，使归纳假设中的表达式出现在其中，而剩下的部分明显可以被整除。证明 $7 \\mid 8^n - 1$：$8^{k+1} - 1 = 8 \\cdot 8^k - 8 + 7 = 8(8^k - 1) + 7$。归纳假设给出 $7 \\mid 8^k - 1$，又 $7 \\mid 7$，所以 $7 \\mid 8^{k+1} - 1$。",
      ),
      generate(rng) {
        const a = rng.int(3, 20);
        const c = rng.int(1, a - 2);
        const d = a - c;
        const f = (k: string) => `${a}^{${k}} - ${c}^{${k}}`;
        return oneOf(
          rng,
          t(
            `To prove $${d} \\mid ${f("n")}$ by induction, which rewriting of $${f("k+1")}$ works?`,
            `用归纳法证明 $${d} \\mid ${f("n")}$，$${f("k+1")}$ 的哪种改写可行？`,
          ),
          math(`${a}(${f("k")}) + ${d} \\cdot ${c}^{k}`),
          [
            math(`${a}(${f("k")}) + ${c}^{k}`),
            math(`${c}(${f("k")}) + ${a}^{k}`),
            math(`${a}(${f("k")}) - ${d} \\cdot ${a}^{k}`),
            math(`(${f("k")}) + ${d}`),
          ],
          t(
            `$${a}^{k+1} - ${c}^{k+1} = ${a} \\cdot ${a}^k - ${a} \\cdot ${c}^k + (${a} - ${c})${c}^k = ${a}(${f("k")}) + ${d} \\cdot ${c}^k$, and both parts are divisible by $${d}$.`,
            `$${a}^{k+1} - ${c}^{k+1} = ${a} \\cdot ${a}^k - ${a} \\cdot ${c}^k + (${a} - ${c})${c}^k = ${a}(${f("k")}) + ${d} \\cdot ${c}^k$，两部分都能被 $${d}$ 整除。`,
          ),
        );
      },
    },
    {
      id: "the-largest-guaranteed-divisor",
      title: t("The largest guaranteed divisor", "必然的最大因数"),
      explanation: t(
        "$a^n - 1$ is divisible by $a - 1$ for every $n \\ge 1$, and at $n = 1$ it equals $a - 1$, so no larger integer divides every term. For $n^3 - n$ the answer is $6$: it is $(n - 1)n(n + 1)$, and $2^3 - 2 = 6$.",
        "对每个 $n \\ge 1$，$a^n - 1$ 都能被 $a - 1$ 整除；而 $n = 1$ 时它等于 $a - 1$，所以没有更大的整数能整除所有项。对 $n^3 - n$，答案是 $6$：它等于 $(n - 1)n(n + 1)$，且 $2^3 - 2 = 6$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const a = rng.int(3, 30);
        const c = rng.int(1, Math.min(9, a - 1));
        let tex: string;
        let f: (n: number) => number;
        if (kind === 0) {
          tex = `${a}^n - 1`;
          f = (n) => a ** n - 1;
        } else if (kind === 1) {
          tex = `${a}^{n} - ${c}^{n}`;
          f = (n) => a ** n - c ** n;
        } else {
          tex = `${a}^{2n} - 1`;
          f = (n) => a ** (2 * n) - 1;
        }
        const g = range(1, 4).reduce((acc, n) => gcd(acc, f(n)), 0);
        return numberProblem({
          prompt: t(
            `What is the largest integer that divides $${tex}$ for every positive integer $n$?`,
            `对每个正整数 $n$ 都能整除 $${tex}$ 的最大整数是多少？`,
          ),
          answer: g,
          wrong: [f(1) === g ? g * 2 : f(1), a, a + 1],
          solution: t(
            `At $n = 1$ the value is $${f(1)}$, and $\\gcd$ with the next values is $${g}$; induction shows $${g}$ divides every term.`,
            `$n = 1$ 时值为 $${f(1)}$，与后续几项的最大公因数是 $${g}$；用归纳法可证 $${g}$ 整除每一项。`,
          ),
        });
      },
    },
  ],
};

/** provingMatrixIdentitiesUsingInduction proves formulas for powers of matrices. */
export const provingMatrixIdentitiesUsingInduction: TopicDef = {
  id: "proving-matrix-identities-using-induction",
  title: t("Proving Matrix Identities Using Induction", "用归纳法证明矩阵恒等式"),
  summary: t("Guess a formula for Aⁿ, then prove it by induction using Aᵏ⁺¹ = AᵏA.", "猜出 Aⁿ 的公式，再利用 Aᵏ⁺¹ = AᵏA 用归纳法证明。"),
  prerequisites: ["mathematical-induction", "powers-of-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "entries-of-matrix-powers",
      title: t("Entries of matrix powers", "矩阵幂的元素"),
      explanation: t(
        "Compute the first few powers to guess a pattern for the entries, then prove the pattern by induction. By induction, $\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^n = \\begin{pmatrix} 1 & na \\\\ 0 & 1 \\end{pmatrix}$ and $\\begin{pmatrix} b & 1 \\\\ 0 & b \\end{pmatrix}^n = \\begin{pmatrix} b^n & nb^{n-1} \\\\ 0 & b^n \\end{pmatrix}$.",
        "先计算前几次幂，猜出元素的规律，再用归纳法证明这个规律。由归纳法，$\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^n = \\begin{pmatrix} 1 & na \\\\ 0 & 1 \\end{pmatrix}$，$\\begin{pmatrix} b & 1 \\\\ 0 & b \\end{pmatrix}^n = \\begin{pmatrix} b^n & nb^{n-1} \\\\ 0 & b^n \\end{pmatrix}$。",
      ),
      generate(rng) {
        const n = rng.int(4, 20);
        if (rng.bool()) {
          const a = rng.int(-9, 9) || 2;
          return numberProblem({
            prompt: t(
              `Find the top-right entry of $\\begin{pmatrix} 1 & ${a} \\\\ 0 & 1 \\end{pmatrix}^{${n}}$.`,
              `求 $\\begin{pmatrix} 1 & ${a} \\\\ 0 & 1 \\end{pmatrix}^{${n}}$ 右上角的元素。`,
            ),
            answer: n * a,
            wrong: [a ** n, a, (n - 1) * a],
            solution: t(
              `The power is $\\begin{pmatrix} 1 & ${n}(${a}) \\\\ 0 & 1 \\end{pmatrix}$, so the entry is $${n * a}$.`,
              `该幂为 $\\begin{pmatrix} 1 & ${n}(${a}) \\\\ 0 & 1 \\end{pmatrix}$，所以元素为 $${n * a}$。`,
            ),
          });
        }
        const b = rng.int(2, 3);
        const m = rng.int(3, 8);
        return numberProblem({
          prompt: t(
            `Find the top-right entry of $\\begin{pmatrix} ${b} & 1 \\\\ 0 & ${b} \\end{pmatrix}^{${m}}$.`,
            `求 $\\begin{pmatrix} ${b} & 1 \\\\ 0 & ${b} \\end{pmatrix}^{${m}}$ 右上角的元素。`,
          ),
          answer: m * b ** (m - 1),
          wrong: [b ** m, m * b ** m, b ** (m - 1)],
          solution: t(
            `The top-right entry of the $n$th power is $nb^{n-1} = ${m} \\cdot ${b}^{${m - 1}} = ${m * b ** (m - 1)}$.`,
            `第 $n$ 次幂右上角的元素是 $nb^{n-1} = ${m} \\cdot ${b}^{${m - 1}} = ${m * b ** (m - 1)}$。`,
          ),
        });
      },
    },
    {
      id: "the-inductive-step-for-matrix-powers",
      title: t("The inductive step", "归纳步骤"),
      explanation: t(
        "Multiply the assumed formula for one power by the matrix once more and check that the entries match the formula for the next power. Assume $A^k = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}$. Then $A^{k+1} = A^k A = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & (k + 1)a \\\\ 0 & 1 \\end{pmatrix}$.",
        "把假设的某次幂公式再乘一次矩阵，检查各元素是否与下一次幂的公式一致。假设 $A^k = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}$。则 $A^{k+1} = A^k A = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & (k + 1)a \\\\ 0 & 1 \\end{pmatrix}$。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const lower = rng.bool();
        const pm = (x: string, y: string) =>
          lower ? `\\begin{pmatrix} ${x} & 0 \\\\ ${y} & ${x} \\end{pmatrix}` : `\\begin{pmatrix} ${x} & ${y} \\\\ 0 & ${x} \\end{pmatrix}`;
        const A = pm(`${b}`, `${a}`);
        const Ak = pm(`${b}^k`, `${a}k \\cdot ${b}^{k-1}`);
        const right = pm(`${b}^{k+1}`, `${a}(k + 1) \\cdot ${b}^{k}`);
        return oneOf(
          rng,
          t(
            `Let $A = ${A}$ and assume $A^k = ${Ak}$. What is $A^{k+1} = A^k A$?`,
            `设 $A = ${A}$，并假设 $A^k = ${Ak}$。$A^{k+1} = A^k A$ 是什么？`,
          ),
          math(right),
          [
            math(pm(`${b}^{k+1}`, `${a}k \\cdot ${b}^{k}`)),
            math(pm(`${b}^{k+1}`, `${a}(k + 1) \\cdot ${b}^{k+1}`)),
            math(pm(`${b}^{k}`, `${a}(k + 1) \\cdot ${b}^{k}`)),
          ],
          t(
            `The diagonal entries multiply to $${b}^{k+1}$; the off-diagonal entry is $${b}^k \\cdot ${a} + ${a}k \\cdot ${b}^{k-1} \\cdot ${b} = ${a}(k + 1) \\cdot ${b}^k$.`,
            `对角元素相乘得 $${b}^{k+1}$；非对角元素为 $${b}^k \\cdot ${a} + ${a}k \\cdot ${b}^{k-1} \\cdot ${b} = ${a}(k + 1) \\cdot ${b}^k$。`,
          ),
        );
      },
    },
  ],
};

/** strongInductionAndRecurrenceRelations uses strong induction for recursively defined sequences. */
export const strongInductionAndRecurrenceRelations: TopicDef = {
  id: "strong-induction-and-recurrence-relations",
  title: t("Strong Induction and Recurrence Relations", "强归纳法与递推关系"),
  summary: t(
    "Strong induction assumes P(n₀), …, P(k) to prove P(k + 1); it suits recurrences where each term depends on several earlier ones.",
    "强归纳法假设 P(n₀), …, P(k) 均成立来证明 P(k + 1)；适用于每一项依赖前面若干项的递推关系。",
  ),
  prerequisites: ["mathematical-induction", "recursive-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-terms-of-a-recurrence",
      title: t("Computing terms", "计算项"),
      explanation: t(
        "A recurrence gives each term from earlier ones, so starting from the initial values you can compute the terms one after another. A recurrence such as $a_n = a_{n-1} + 2a_{n-2}$ with $a_0 = 0$, $a_1 = 1$ determines every term: $a_2 = 1$, $a_3 = 3$, $a_4 = 5$, $a_5 = 11$.",
        "递推关系由前面的项给出每一项，所以从初值出发可以逐项计算。像 $a_n = a_{n-1} + 2a_{n-2}$、$a_0 = 0$、$a_1 = 1$ 这样的递推关系确定了每一项：$a_2 = 1$，$a_3 = 3$，$a_4 = 5$，$a_5 = 11$。",
      ),
      generate(rng) {
        const p = rng.int(-3, 4) || 1;
        const q = rng.int(-3, 4) || 2;
        const a0 = rng.int(-3, 5);
        const a1 = rng.int(-3, 5);
        const n = rng.int(4, 7);
        const seq = [a0, a1];
        for (let i = 2; i <= n; i++) seq.push(p * seq[i - 1]! + q * seq[i - 2]!);
        const rec = `a_n = ${p === 1 ? "" : p === -1 ? "-" : p}a_{n-1}${q === 1 ? " + " : q === -1 ? " - " : q > 0 ? ` + ${q}` : ` - ${-q}`}a_{n-2}`;
        return numberProblem({
          prompt: t(
            `Let $a_0 = ${a0}$, $a_1 = ${a1}$ and $${rec}$ for $n \\ge 2$. Find $a_{${n}}$.`,
            `设 $a_0 = ${a0}$，$a_1 = ${a1}$，且 $n \\ge 2$ 时 $${rec}$。求 $a_{${n}}$。`,
          ),
          answer: seq[n]!,
          wrong: [seq[n - 1]!, p * seq[n - 1]! + q * seq[n - 1]!, seq[n]! + 1],
          solution: t(`The terms are $${seq.join(", ")}$.`, `各项依次为 $${seq.join(", ")}$。`),
        });
      },
    },
    {
      id: "verifying-closed-forms",
      title: t("Closed forms", "通项公式"),
      explanation: t(
        "If $a_n = 5a_{n-1} - 6a_{n-2}$, then $a_n = A \\cdot 2^n + B \\cdot 3^n$ satisfies the recurrence for any $A, B$, since $2$ and $3$ are roots of $x^2 = 5x - 6$. The initial values fix $A$ and $B$; strong induction then proves the formula for every $n$.",
        "若 $a_n = 5a_{n-1} - 6a_{n-2}$，则对任意 $A, B$，$a_n = A \\cdot 2^n + B \\cdot 3^n$ 都满足递推关系，因为 $2$ 和 $3$ 是 $x^2 = 5x - 6$ 的根。初始值确定 $A$ 与 $B$；再用强归纳法证明公式对每个 $n$ 成立。",
      ),
      generate(rng) {
        let r: number;
        let s: number;
        do {
          r = rng.int(-3, 5);
          s = rng.int(-3, 5);
        } while (r === s || r === 0 || s === 0 || r + s === 0);
        const A = rng.int(-4, 4) || 1;
        const B = rng.int(-4, 4) || 2;
        const p = r + s;
        const q = -r * s;
        const a0 = A + B;
        const a1 = A * r + B * s;
        const base = (x: number) => (x < 0 ? `(${x})` : `${x}`);
        const form = (x: number, u: number, y: number, v: number) =>
          `${x} \\cdot ${base(u)}^n ${y < 0 ? "-" : "+"} ${Math.abs(y)} \\cdot ${base(v)}^n`;
        const rec = `a_n = ${poly([p, "a_{n-1}"], [q, "a_{n-2}"])}`;
        return oneOf(
          rng,
          t(
            `Let $a_0 = ${a0}$, $a_1 = ${a1}$ and $${rec}$. Which formula gives $a_n$?`,
            `设 $a_0 = ${a0}$，$a_1 = ${a1}$，且 $${rec}$。哪个公式给出 $a_n$？`,
          ),
          math(`a_n = ${form(A, r, B, s)}`),
          [
            math(`a_n = ${form(B, r, A, s)}`),
            math(`a_n = ${form(A, -r, B, -s)}`),
            math(`a_n = ${form(A + 1, r, B - 1, s)}`),
            math(`a_n = ${form(A, r + 1, B, s + 1)}`),
          ],
          t(
            `$${base(r)}$ and $${base(s)}$ are the roots of $x^2 = ${poly([p, "x"], [q, ""])}$, so the formula satisfies the recurrence, and it gives $a_0 = ${a0}$, $a_1 = ${a1}$. By strong induction it holds for all $n$.`,
            `$${base(r)}$ 与 $${base(s)}$ 是 $x^2 = ${poly([p, "x"], [q, ""])}$ 的根，所以公式满足递推关系，且给出 $a_0 = ${a0}$，$a_1 = ${a1}$。由强归纳法，它对所有 $n$ 成立。`,
          ),
        );
      },
    },
  ],
};

/** methodsOfProofNumberTheoryTopics are the new topics of Methods of Proof unit 4. */
export const methodsOfProofNumberTheoryTopics: readonly TopicDef[] = [
  parity,
  integerDivisibility,
  theDivisionAlgorithm,
  theEuclideanAlgorithm,
  theExtendedEuclideanAlgorithm,
  linearDiophantineEquations,
  propertiesOfIntegerDivisibility,
  propertiesOfPrimeDivisibility,
  mathematicalInduction,
  provingInequalitiesUsingInduction,
  provingDivisibilityUsingInduction,
  provingMatrixIdentitiesUsingInduction,
  strongInductionAndRecurrenceRelations,
];
