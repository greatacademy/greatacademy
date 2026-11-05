import type { Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { range, setProblem, setTex } from "./methods-of-proof-common.ts";
import { bezout, gcd, mod } from "./methods-of-proof-number-theory.ts";

// Methods of Proof unit 6: modular congruence and linear congruences.

/** math wraps LaTeX as an option. */
const math = (s: string) => t(`$${s}$`, `$${s}$`);

/** signed writes "+ 3" or "- 3" after a term, or nothing for 0. */
const signed = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** cong writes a ≡ b (mod n) in LaTeX. */
const cong = (a: string | number, b: string | number, n: number | string) => `${a} \\equiv ${b} \\pmod{${n}}`;

/** ncong writes a ≢ b (mod n) in LaTeX. */
const ncong = (a: string | number, b: string | number, n: number | string) => `${a} \\not\\equiv ${b} \\pmod{${n}}`;

/** reduced writes "x ≡ v", or just "v" when x already equals v. */
const reduced = (x: number, v: number) => (x === v ? `${v}` : `${x} \\equiv ${v}`);

/** par puts negative numbers in parentheses. */
const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** modPow computes bᵉ mod n by repeated squaring. */
export function modPow(b: number, e: number, n: number): number {
  let result = 1 % n;
  let base = mod(b, n);
  for (let k = e; k > 0; k = Math.floor(k / 2)) {
    if (k % 2 === 1) result = (result * base) % n;
    base = (base * base) % n;
  }
  return result;
}

/** inverseMod finds the inverse of a modulo n, assuming gcd(a, n) = 1. */
export const inverseMod = (a: number, n: number) => mod(bezout(mod(a, n), n)[0], n);

/** trueFalse are the options of a true-or-false question. */
const trueFalse: readonly Text[] = [t("True", "真"), t("False", "假")];

/** modularCongruence defines a ≡ b (mod n). */
export const modularCongruence: TopicDef = {
  id: "modular-congruence",
  title: t("Modular Congruence", "模同余"),
  summary: t(
    "a ≡ b (mod n) means n divides a − b; equivalently, a and b leave the same remainder on division by n.",
    "a ≡ b (mod n) 表示 n 整除 a − b；等价地，a 与 b 除以 n 的余数相同。",
  ),
  prerequisites: ["the-division-algorithm"],
  encompasses: [{ topic: "integer-divisibility", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-a-congruence",
      title: t("Checking a congruence", "检验同余式"),
      explanation: t(
        "Two integers are congruent modulo a number exactly when their difference is a whole multiple of that number. $38 \\equiv 10 \\pmod{7}$ because $38 - 10 = 28 = 7 \\cdot 4$. But $38 \\not\\equiv 11 \\pmod{7}$, since $38 - 11 = 27$ is not a multiple of $7$.",
        "两个整数模某个数同余，当且仅当它们的差是这个数的倍数。$38 \\equiv 10 \\pmod{7}$，因为 $38 - 10 = 28 = 7 \\cdot 4$。但 $38 \\not\\equiv 11 \\pmod{7}$，因为 $38 - 11 = 27$ 不是 $7$ 的倍数。",
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const a = rng.int(-60, 99);
        const value = rng.bool();
        const b = value ? a - n * rng.nonZero(-6, 6) : a - n * rng.int(-6, 6) + rng.int(1, n - 1);
        const diff = a - b;
        const shownB = b < 0 ? `(${b})` : `${b}`;
        const quotient = diff / n < 0 ? `(${diff / n})` : `${diff / n}`;
        return oneOf(
          rng,
          t(`Is $${cong(a, b, n)}$?`, `$${cong(a, b, n)}$ 成立吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                `Yes: $${a} - ${shownB} = ${diff} = ${n} \\cdot ${quotient}$.`,
                `成立：$${a} - ${shownB} = ${diff} = ${n} \\cdot ${quotient}$。`,
              )
            : t(
                `No: $${a} - ${shownB} = ${diff}$ is not a multiple of $${n}$.`,
                `不成立：$${a} - ${shownB} = ${diff}$ 不是 $${n}$ 的倍数。`,
              ),
        );
      },
    },
    {
      id: "finding-congruent-integers",
      title: t("Finding congruent integers", "找出同余的整数"),
      explanation: t(
        "Adding or subtracting the modulus does not change the remainder, so the congruent integers are spaced evenly by the modulus. The integers congruent to $5$ modulo $8$ are $\\dots, -11, -3, 5, 13, 21, \\dots$: add or subtract multiples of $8$.",
        "加上或减去模不会改变余数，所以同余的整数以模为间隔均匀分布。模 $8$ 与 $5$ 同余的整数是 $\\dots, -11, -3, 5, 13, 21, \\dots$：加上或减去 $8$ 的倍数即可。",
      ),
      generate(rng) {
        const n = rng.int(3, 13);
        const a = rng.int(-30, 50);
        const right = a + n * rng.pick([-4, -3, -2, 2, 3, 4, 5]);
        const wrong = [1, 2, 3].map((k) => a + n * rng.int(-3, 3) + (k % n === 0 ? 1 : k));
        const shownA = a < 0 ? `(${a})` : `${a}`;
        const quotient = (right - a) / n < 0 ? `(${(right - a) / n})` : `${(right - a) / n}`;
        return oneOf(
          rng,
          t(`Which integer is congruent to $${a}$ modulo $${n}$?`, `哪个整数模 $${n}$ 与 $${a}$ 同余？`),
          math(`${right}`),
          wrong.map((w) => math(`${w}`)),
          t(
            `$${right} - ${shownA} = ${right - a} = ${n} \\cdot ${quotient}$.`,
            `$${right} - ${shownA} = ${right - a} = ${n} \\cdot ${quotient}$。`,
          ),
        );
      },
    },
  ],
};

/** theAdditionPropertyOfModularArithmetic adds and subtracts congruences. */
export const theAdditionPropertyOfModularArithmetic: TopicDef = {
  id: "the-addition-property-of-modular-arithmetic",
  title: t("The Addition Property of Modular Arithmetic", "模运算的加法性质"),
  summary: t(
    "If a ≡ b and c ≡ d (mod n), then a + c ≡ b + d and a − c ≡ b − d (mod n): reduce before adding.",
    "若 a ≡ b 且 c ≡ d (mod n)，则 a + c ≡ b + d 且 a − c ≡ b − d (mod n)：可以先约化再相加。",
  ),
  prerequisites: ["modular-congruence"],
  encompasses: [{ topic: "modular-congruence", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "adding-congruences",
      title: t("Adding congruences", "同余式相加"),
      explanation: t(
        "Congruences can be added and subtracted like equations, and the result can then be reduced to a remainder in the usual range. If $a \\equiv 4 \\pmod{9}$ and $b \\equiv 7 \\pmod{9}$, then $a + b \\equiv 11 \\equiv 2 \\pmod{9}$ and $a - b \\equiv -3 \\equiv 6 \\pmod{9}$.",
        "同余式可以像等式一样相加和相减，然后再把结果约化到通常范围内的余数。若 $a \\equiv 4 \\pmod{9}$ 且 $b \\equiv 7 \\pmod{9}$，则 $a + b \\equiv 11 \\equiv 2 \\pmod{9}$，$a - b \\equiv -3 \\equiv 6 \\pmod{9}$。",
      ),
      generate(rng) {
        const n = rng.int(4, 13);
        const r = rng.int(1, n - 1);
        const minus = rng.bool();
        // Equal remainders would make a difference trivially zero.
        const s = rng.pick(range(1, n - 1).filter((v) => !minus || v !== r));
        const value = mod(minus ? r - s : r + s, n);
        const op = minus ? "-" : "+";
        return numberProblem({
          prompt: t(
            `Suppose $${cong("a", r, n)}$ and $${cong("b", s, n)}$. Find the remainder $r$ with $0 \\le r < ${n}$ and $${cong(`a ${op} b`, "r", n)}$.`,
            `设 $${cong("a", r, n)}$，$${cong("b", s, n)}$。求满足 $0 \\le r < ${n}$ 且 $${cong(`a ${op} b`, "r", n)}$ 的余数 $r$。`,
          ),
          answer: value,
          wrong: [minus ? r - s : r + s, mod(minus ? r + s : r - s, n), mod(r * s, n)],
          solution: t(
            `$a ${op} b \\equiv ${r} ${op} ${s} = ${reduced(minus ? r - s : r + s, value)} \\pmod{${n}}$.`,
            `$a ${op} b \\equiv ${r} ${op} ${s} = ${reduced(minus ? r - s : r + s, value)} \\pmod{${n}}$。`,
          ),
        });
      },
    },
    {
      id: "reducing-before-adding",
      title: t("Reducing before adding", "先约化再相加"),
      explanation: t(
        "To find the remainder of $1234 + 5678$ on division by $9$, reduce each term: $1234 \\equiv 1$ and $5678 \\equiv 8$, so the sum is $\\equiv 9 \\equiv 0 \\pmod{9}$.",
        "求 $1234 + 5678$ 除以 $9$ 的余数：先约化每一项，$1234 \\equiv 1$，$5678 \\equiv 8$，所以和 $\\equiv 9 \\equiv 0 \\pmod{9}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const xs = range(1, rng.int(2, 3)).map(() => rng.int(100, 9999));
        const signs = xs.map((_, i) => (i === 0 ? 1 : rng.pick([1, -1])));
        const total = xs.reduce((s, x, i) => s + signs[i]! * x, 0);
        const value = mod(total, n);
        const expr = xs.map((x, i) => (i === 0 ? `${x}` : `${signs[i]! > 0 ? "+" : "-"} ${x}`)).join(" ");
        const rs = xs.map((x) => mod(x, n));
        return numberProblem({
          prompt: t(`Find the remainder when $${expr}$ is divided by $${n}$.`, `求 $${expr}$ 除以 $${n}$ 的余数。`),
          answer: value,
          wrong: [rs.reduce((s, r) => s + r, 0) % n, mod(-total, n), mod(value + 1, n)],
          solution: t(
            `The terms are $\\equiv ${rs.join(", ")} \\pmod{${n}}$, so the expression is $\\equiv ${rs.map((r, i) => (i === 0 ? `${r}` : `${signs[i]! > 0 ? "+" : "-"} ${r}`)).join(" ")} \\equiv ${value} \\pmod{${n}}$.`,
            `各项 $\\equiv ${rs.join(", ")} \\pmod{${n}}$，所以表达式 $\\equiv ${rs.map((r, i) => (i === 0 ? `${r}` : `${signs[i]! > 0 ? "+" : "-"} ${r}`)).join(" ")} \\equiv ${value} \\pmod{${n}}$。`,
          ),
        });
      },
    },
  ],
};

/** modularResidues reduces integers to their least nonnegative residues. */
export const modularResidues: TopicDef = {
  id: "modular-residues",
  title: t("Modular Residues", "模剩余"),
  summary: t(
    "Every integer is congruent mod n to exactly one residue in {0, 1, …, n − 1}: its remainder on division by n.",
    "每个整数模 n 恰好与 {0, 1, …, n − 1} 中的一个剩余同余：即它除以 n 的余数。",
  ),
  prerequisites: ["modular-congruence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "least-nonnegative-residues",
      title: t("Least nonnegative residues", "最小非负剩余"),
      explanation: t(
        "The residue of $-23$ modulo $6$ is $1$, since $-23 = 6 \\cdot (-4) + 1$. For negative numbers, go down to the next multiple of $n$, not up.",
        "$-23$ 模 $6$ 的剩余是 $1$，因为 $-23 = 6 \\cdot (-4) + 1$。对负数，要取下一个更小的 $n$ 的倍数，而不是更大的。",
      ),
      generate(rng) {
        const n = rng.int(3, 17);
        const a = rng.bool() ? -rng.int(n + 1, 200) : rng.int(n + 1, 999);
        const r = mod(a, n);
        const q = (a - r) / n;
        return numberProblem({
          prompt: t(
            `Find the residue $r$ with $0 \\le r < ${n}$ and $${cong(a, "r", n)}$.`,
            `求满足 $0 \\le r < ${n}$ 且 $${cong(a, "r", n)}$ 的剩余 $r$。`,
          ),
          answer: r,
          wrong: [Math.abs(a) % n, a % n, n - r],
          solution: t(
            `Divide by $${n}$ with a remainder in $[0, ${n})$: $${a} = ${n} \\cdot (${q}) + ${r}$, so $${a} - ${r}$ is a multiple of $${n}$ and $r = ${r}$.`,
            `除以 $${n}$，使余数在 $[0, ${n})$ 中：$${a} = ${n} \\cdot (${q}) + ${r}$，所以 $${a} - ${r}$ 是 $${n}$ 的倍数，$r = ${r}$。`,
          ),
        });
      },
    },
    {
      id: "counting-integers-in-a-residue-class",
      title: t("Counting integers in a residue class", "统计剩余类中的整数"),
      explanation: t(
        "The members of a residue class form an arithmetic progression, so count them by finding the first and last terms in the range. How many integers from $1$ to $50$ are $\\equiv 3 \\pmod{7}$? They are $3, 10, \\dots, 45$, that is $3 + 7k$ for $k = 0, \\dots, 6$: seven of them.",
        "一个剩余类中的元素构成等差数列，所以通过找出范围内的首项和末项来计数。从 $1$ 到 $50$ 中有多少个整数 $\\equiv 3 \\pmod{7}$？它们是 $3, 10, \\dots, 45$，即 $3 + 7k$，$k = 0, \\dots, 6$：共七个。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const r = rng.int(0, n - 1);
        const lo = rng.int(1, 30);
        const hi = lo + rng.int(30, 150);
        const xs = range(lo, hi).filter((x) => mod(x - r, n) === 0);
        return numberProblem({
          prompt: t(
            `How many integers $x$ with $${lo} \\le x \\le ${hi}$ satisfy $${cong("x", r, n)}$?`,
            `满足 $${lo} \\le x \\le ${hi}$ 且 $${cong("x", r, n)}$ 的整数 $x$ 有多少个？`,
          ),
          answer: xs.length,
          wrong: [xs.length + 1, xs.length - 1, Math.floor((hi - lo) / n)],
          solution: t(
            `They are $${xs[0]}, ${xs[1]}, \\dots, ${xs[xs.length - 1]}$: $\\dfrac{${xs[xs.length - 1]} - ${xs[0]}}{${n}} + 1 = ${xs.length}$ integers.`,
            `它们是 $${xs[0]}, ${xs[1]}, \\dots, ${xs[xs.length - 1]}$：共 $\\dfrac{${xs[xs.length - 1]} - ${xs[0]}}{${n}} + 1 = ${xs.length}$ 个。`,
          ),
        });
      },
    },
  ],
};

/** theMultiplicationPropertiesOfModularArithmetic multiplies congruences and takes powers. */
export const theMultiplicationPropertiesOfModularArithmetic: TopicDef = {
  id: "the-multiplication-properties-of-modular-arithmetic",
  title: t("The Multiplication Properties of Modular Arithmetic", "模运算的乘法性质"),
  summary: t(
    "If a ≡ b and c ≡ d (mod n), then ac ≡ bd and aᵏ ≡ bᵏ (mod n), so products and powers can be reduced step by step.",
    "若 a ≡ b 且 c ≡ d (mod n)，则 ac ≡ bd，aᵏ ≡ bᵏ (mod n)，所以乘积与幂都可以逐步约化。",
  ),
  prerequisites: ["the-addition-property-of-modular-arithmetic", "modular-residues"],
  encompasses: [{ topic: "the-addition-property-of-modular-arithmetic", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reducing-products",
      title: t("Reducing products", "约化乘积"),
      explanation: t(
        "Congruences can be multiplied, so reduce each factor first and multiply the small remainders instead of the large numbers. $123 \\cdot 456 \\pmod{10}$: $123 \\equiv 3$ and $456 \\equiv 6$, so the product is $\\equiv 18 \\equiv 8 \\pmod{10}$.",
        "同余式可以相乘，所以先约化每个因数，再把小的余数相乘，而不是乘大数。$123 \\cdot 456 \\pmod{10}$：$123 \\equiv 3$，$456 \\equiv 6$，所以乘积 $\\equiv 18 \\equiv 8 \\pmod{10}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 13);
        const nudge = (v: number): number => (v % n === 0 ? v + 1 : v);
        const a = nudge(rng.int(50, 999));
        const b = nudge(rng.int(50, 999));
        const ra = a % n;
        const rb = b % n;
        const value = (a * b) % n;
        return numberProblem({
          prompt: t(`Find the remainder when $${a} \\cdot ${b}$ is divided by $${n}$.`, `求 $${a} \\cdot ${b}$ 除以 $${n}$ 的余数。`),
          answer: value,
          wrong: [(ra + rb) % n, ra * rb, mod(value - 1, n)],
          solution: t(
            `$${a} \\equiv ${ra}$ and $${b} \\equiv ${rb}$, so the product is $\\equiv ${reduced(ra * rb, value)} \\pmod{${n}}$.`,
            `$${a} \\equiv ${ra}$，$${b} \\equiv ${rb}$，所以乘积 $\\equiv ${reduced(ra * rb, value)} \\pmod{${n}}$。`,
          ),
        });
      },
    },
    {
      id: "reducing-powers",
      title: t("Reducing powers", "约化幂"),
      explanation: t(
        "Look for a small power that is congruent to one, then split the exponent into multiples of it plus a remainder. To find $2^{100} \\bmod 7$: $2^3 = 8 \\equiv 1 \\pmod{7}$, so $2^{100} = (2^3)^{33} \\cdot 2 \\equiv 1^{33} \\cdot 2 = 2 \\pmod{7}$. Look for a power that is $\\equiv 1$ (or $\\equiv -1$).",
        "寻找一个同余于 1 的小幂，再把指数分成它的倍数加上余数。求 $2^{100} \\bmod 7$：$2^3 = 8 \\equiv 1 \\pmod{7}$，所以 $2^{100} = (2^3)^{33} \\cdot 2 \\equiv 1^{33} \\cdot 2 = 2 \\pmod{7}$。寻找 $\\equiv 1$（或 $\\equiv -1$）的幂。",
      ),
      generate(rng) {
        let n: number;
        let b: number;
        do {
          n = rng.int(3, 13);
          b = rng.int(2, 30);
        } while (gcd(b, n) !== 1 || b % n === 1);
        const e = rng.int(20, 200);
        const value = modPow(b, e, n);
        let k = 1;
        while (modPow(b, k, n) !== 1) k++;
        return numberProblem({
          prompt: t(`Find the remainder when $${b}^{${e}}$ is divided by $${n}$.`, `求 $${b}^{${e}}$ 除以 $${n}$ 的余数。`),
          answer: value,
          wrong: [modPow(b, e + 1, n), modPow(b, e - 1, n), (b * e) % n],
          solution: t(
            `$${b}^{${k}} \\equiv 1 \\pmod{${n}}$ and $${e} = ${k} \\cdot ${Math.floor(e / k)} + ${e % k}$, so $${b}^{${e}} \\equiv ${b}^{${e % k}} \\equiv ${value} \\pmod{${n}}$.`,
            `$${b}^{${k}} \\equiv 1 \\pmod{${n}}$，且 $${e} = ${k} \\cdot ${Math.floor(e / k)} + ${e % k}$，所以 $${b}^{${e}} \\equiv ${b}^{${e % k}} \\equiv ${value} \\pmod{${n}}$。`,
          ),
        });
      },
    },
  ],
};

/** theDivisionPropertiesOfModularArithmetic cancels common factors in congruences. */
export const theDivisionPropertiesOfModularArithmetic: TopicDef = {
  id: "the-division-properties-of-modular-arithmetic",
  title: t("The Division Properties of Modular Arithmetic", "模运算的除法性质"),
  summary: t(
    "If ca ≡ cb (mod n), then a ≡ b (mod n/gcd(c, n)); in particular c can be cancelled when gcd(c, n) = 1.",
    "若 ca ≡ cb (mod n)，则 a ≡ b (mod n/gcd(c, n))；特别地，当 gcd(c, n) = 1 时可以约去 c。",
  ),
  prerequisites: ["the-multiplication-properties-of-modular-arithmetic", "the-euclidean-algorithm"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-modulus-after-cancelling",
      title: t("The modulus after cancelling", "约去后的模"),
      explanation: t(
        "Dividing a congruence by a common factor is allowed only if the modulus is divided by its gcd with that factor. From $6a \\equiv 6b \\pmod{15}$: $\\gcd(6, 15) = 3$, so $a \\equiv b \\pmod{5}$. Dividing by $6$ also divides the modulus by the common factor $3$.",
        "只有把模也除以它与该因数的最大公因数，才可以把同余式除以这个公因数。由 $6a \\equiv 6b \\pmod{15}$：$\\gcd(6, 15) = 3$，所以 $a \\equiv b \\pmod{5}$。两边除以 $6$ 时，模也要除以公因数 $3$。",
      ),
      generate(rng) {
        const c = rng.int(2, 15);
        const factors = range(2, c).filter((f) => c % f === 0);
        const n = rng.int(0, 3) === 0 ? rng.int(4, 40) : rng.pick(factors) * rng.int(2, 8);
        const g = gcd(c, n);
        return numberProblem({
          prompt: t(
            `If $${cong(`${c}a`, `${c}b`, n)}$, what is the largest $m$ for which $a \\equiv b \\pmod{m}$ must hold?`,
            `若 $${cong(`${c}a`, `${c}b`, n)}$，使 $a \\equiv b \\pmod{m}$ 必然成立的最大的 $m$ 是多少？`,
          ),
          answer: n / g,
          wrong: [n, g, Math.max(1, Math.floor(n / c))],
          solution:
            g === 1
              ? t(
                  `$\\gcd(${c}, ${n}) = 1$, so $${n} \\mid ${c}(a - b)$ gives $${n} \\mid a - b$: $m = ${n}$.`,
                  `$\\gcd(${c}, ${n}) = 1$，所以由 $${n} \\mid ${c}(a - b)$ 得 $${n} \\mid a - b$：$m = ${n}$。`,
                )
              : t(
                  `$\\gcd(${c}, ${n}) = ${g}$, so $${n} \\mid ${c}(a - b)$ gives $${n / g} \\mid ${c / g}(a - b)$, and $\\gcd(${c / g}, ${n / g}) = 1$, so $m = ${n / g}$.`,
                  `$\\gcd(${c}, ${n}) = ${g}$，由 $${n} \\mid ${c}(a - b)$ 得 $${n / g} \\mid ${c / g}(a - b)$，而 $\\gcd(${c / g}, ${n / g}) = 1$，所以 $m = ${n / g}$。`,
                ),
        });
      },
    },
    {
      id: "when-cancellation-is-valid",
      title: t("When cancellation is valid", "何时可以约去"),
      explanation: t(
        "A factor can be cancelled from both sides without changing the modulus only when it shares no common factor with the modulus. $4 \\cdot 2 \\equiv 4 \\cdot 5 \\pmod{12}$, but $2 \\not\\equiv 5 \\pmod{12}$: cancelling $4$ fails because $\\gcd(4, 12) \\ne 1$. Cancelling $c$ is valid exactly when $\\gcd(c, n) = 1$.",
        "只有当一个因数与模没有公因数时，才能在不改变模的情况下从两边约去它。$4 \\cdot 2 \\equiv 4 \\cdot 5 \\pmod{12}$，但 $2 \\not\\equiv 5 \\pmod{12}$：约去 $4$ 失败，因为 $\\gcd(4, 12) \\ne 1$。当且仅当 $\\gcd(c, n) = 1$ 时可以约去 $c$。",
      ),
      generate(rng) {
        const c = rng.int(2, 12);
        const n = rng.int(4, 30);
        const g = gcd(c, n);
        const value = g === 1;
        return oneOf(
          rng,
          t(
            `True or false: for all integers $a$ and $b$, if $${cong(`${c}a`, `${c}b`, n)}$, then $${cong("a", "b", n)}$.`,
            `判断真假：对所有整数 $a$、$b$，若 $${cong(`${c}a`, `${c}b`, n)}$，则 $${cong("a", "b", n)}$。`,
          ),
          trueFalse[value ? 0 : 1]!,
          [trueFalse[value ? 1 : 0]!],
          value
            ? t(
                `$\\gcd(${c}, ${n}) = 1$, so $${n} \\mid ${c}(a - b)$ forces $${n} \\mid a - b$.`,
                `$\\gcd(${c}, ${n}) = 1$，所以 $${n} \\mid ${c}(a - b)$ 推出 $${n} \\mid a - b$。`,
              )
            : t(
                `$\\gcd(${c}, ${n}) = ${g}$. Take $a = 0$, $b = ${n / g}$: $${c} \\cdot ${n / g}$ is a multiple of $${n}$, but $${n / g} \\not\\equiv 0 \\pmod{${n}}$.`,
                `$\\gcd(${c}, ${n}) = ${g}$。取 $a = 0$，$b = ${n / g}$：$${c} \\cdot ${n / g}$ 是 $${n}$ 的倍数，但 $${n / g} \\not\\equiv 0 \\pmod{${n}}$。`,
              ),
        );
      },
    },
  ],
};

/** provingPropertiesOfModularCongruence proves congruence laws from the definition. */
export const provingPropertiesOfModularCongruence: TopicDef = {
  id: "proving-properties-of-modular-congruence",
  title: t("Proving Properties of Modular Congruence", "证明模同余的性质"),
  summary: t(
    "Write each congruence as an equation, a − b = nk, combine the equations, and factor out n.",
    "把每个同余式写成等式 a − b = nk，再把等式组合起来并提出 n。",
  ),
  prerequisites: ["the-multiplication-properties-of-modular-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "combining-the-defining-equations",
      title: t("Combining the defining equations", "组合定义等式"),
      explanation: t(
        "Each congruence means a difference is a multiple of the modulus, so combine those equations to show the new difference is a multiple too. To prove that $a \\equiv b$ and $c \\equiv d \\pmod{6}$ imply $a + c \\equiv b + d \\pmod{6}$: write $a - b = 6k$ and $c - d = 6l$. Then $(a + c) - (b + d) = 6k + 6l = 6(k + l)$.",
        "每个同余式都意味着某个差是模的倍数，所以把这些等式组合起来，证明新的差也是模的倍数。证明 $a \\equiv b$ 且 $c \\equiv d \\pmod{6}$ 推出 $a + c \\equiv b + d \\pmod{6}$：写 $a - b = 6k$，$c - d = 6l$。则 $(a + c) - (b + d) = 6k + 6l = 6(k + l)$。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const kind = rng.int(0, 4);
        const both = `$a - b = ${n}k$ and $c - d = ${n}l$`;
        const bothZh = `$a - b = ${n}k$，$c - d = ${n}l$`;
        const cases: [string, string, string, string, string[]][] = [
          [
            `${cong("a", "b", n)} \\text{ and } ${cong("c", "d", n)}`,
            both,
            bothZh,
            `(a + c) - (b + d) = ${n}(k + l)`,
            [`(a + c) - (b + d) = ${n}kl`, `(a + c) - (b + d) = ${n}(k - l)`, `(a + c) - (b + d) = ${2 * n}(k + l)`],
          ],
          [
            `${cong("a", "b", n)} \\text{ and } ${cong("c", "d", n)}`,
            both,
            bothZh,
            `(a - c) - (b - d) = ${n}(k - l)`,
            [`(a - c) - (b - d) = ${n}(k + l)`, `(a - c) - (b - d) = ${n}kl`, `(a - c) - (b - d) = ${n}(l - k)`],
          ],
          [
            `${cong("a", "b", n)} \\text{ and } ${cong("b", "c", n)}`,
            `$a - b = ${n}k$ and $b - c = ${n}l$`,
            `$a - b = ${n}k$，$b - c = ${n}l$`,
            `a - c = ${n}(k + l)`,
            [`a - c = ${n}(k - l)`, `a - c = ${n}kl`, `c - a = ${n}(k + l)`],
          ],
          [
            cong("a", "b", n),
            `$a - b = ${n}k$`,
            `$a - b = ${n}k$`,
            `b - a = ${n}(-k)`,
            [`b - a = ${n}k`, `b - a = -k`, `a - b = ${n}(-k)`],
          ],
          [
            cong("a", "b", n),
            `$a - b = ${n}k$`,
            `$a - b = ${n}k$`,
            `ca - cb = ${n}(ck)`,
            [`ca - cb = ${n}k`, `ca - cb = c + ${n}k`, `ca - cb = ${n}(c + k)`],
          ],
        ];
        const [hyp, writeEn, writeZh, right, wrong] = cases[kind]!;
        const goal = [`a + c \\equiv b + d`, `a - c \\equiv b - d`, `a \\equiv c`, `b \\equiv a`, `ca \\equiv cb`][kind]!;
        return oneOf(
          rng,
          t(
            `To prove that $${hyp}$ ${kind < 3 ? "imply" : "implies"} $${goal} \\pmod{${n}}$, write ${writeEn}. Which equation finishes the proof?`,
            `为证明 $${hyp}$ 推出 $${goal} \\pmod{${n}}$，写出 ${writeZh}。哪个等式完成证明？`,
          ),
          math(right),
          wrong.map(math),
          t(
            `$${right}$ shows the difference is a multiple of $${n}$, which is the definition of $${goal} \\pmod{${n}}$.`,
            `$${right}$ 说明差是 $${n}$ 的倍数，这正是 $${goal} \\pmod{${n}}$ 的定义。`,
          ),
        );
      },
    },
    {
      id: "true-and-false-congruence-laws",
      title: t("True and false congruence laws", "同余律的真假"),
      explanation: t(
        "Valid: if $a \\equiv b \\pmod{n}$ then $a^2 \\equiv b^2$, $a + c \\equiv b + c$, and $a \\equiv b \\pmod{d}$ for every divisor $d$ of $n$. Invalid: $a^2 \\equiv b^2$ does not give $a \\equiv b$ (e.g. $1^2 \\equiv 4^2 \\pmod{5}$), and $a \\equiv b \\pmod{n}$ does not give $a \\equiv b \\pmod{2n}$.",
        "成立：若 $a \\equiv b \\pmod{n}$，则 $a^2 \\equiv b^2$，$a + c \\equiv b + c$，并且对 $n$ 的每个因数 $d$ 有 $a \\equiv b \\pmod{d}$。不成立：$a^2 \\equiv b^2$ 推不出 $a \\equiv b$（例如 $1^2 \\equiv 4^2 \\pmod{5}$），$a \\equiv b \\pmod{n}$ 也推不出 $a \\equiv b \\pmod{2n}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const divisors = range(2, n - 1).filter((d) => n % d === 0);
        const d = divisors.length > 0 ? rng.pick(divisors) : 0;
        const claims: [string, boolean, Text][] = [
          [
            `${cong("a", "b", n)} \\implies ${cong("a^2", "b^2", n)}`,
            true,
            t("Multiply the congruence by itself.", "把同余式与自身相乘。"),
          ],
          [
            `${cong("a^2", "b^2", n)} \\implies ${cong("a", "b", n)}`,
            false,
            t(
              `$1^2 \\equiv (${n - 1})^2 \\pmod{${n}}$ but $1 \\not\\equiv ${n - 1}$.`,
              `$1^2 \\equiv (${n - 1})^2 \\pmod{${n}}$，但 $1 \\not\\equiv ${n - 1}$。`,
            ),
          ],
          [
            `${cong("a", "b", n)} \\implies ${cong("a", "b", 2 * n)}`,
            false,
            t(
              `$${n} \\equiv 0 \\pmod{${n}}$ but $${n} \\not\\equiv 0 \\pmod{${2 * n}}$.`,
              `$${n} \\equiv 0 \\pmod{${n}}$，但 $${n} \\not\\equiv 0 \\pmod{${2 * n}}$。`,
            ),
          ],
          [
            d > 0 ? `${cong("a", "b", n)} \\implies ${cong("a", "b", d)}` : `${cong("a", "b", 2 * n)} \\implies ${cong("a", "b", n)}`,
            true,
            t(
              d > 0
                ? `$${d} \\mid ${n}$ and $${n} \\mid a - b$, so $${d} \\mid a - b$.`
                : `$${n} \\mid ${2 * n}$ and $${2 * n} \\mid a - b$, so $${n} \\mid a - b$.`,
              d > 0
                ? `$${d} \\mid ${n}$ 且 $${n} \\mid a - b$，所以 $${d} \\mid a - b$。`
                : `$${n} \\mid ${2 * n}$ 且 $${2 * n} \\mid a - b$，所以 $${n} \\mid a - b$。`,
            ),
          ],
          [
            `${cong("a", "b", n)} \\implies ${cong("a + c", "b + c", n)}`,
            true,
            t("$(a + c) - (b + c) = a - b$.", "$(a + c) - (b + c) = a - b$。"),
          ],
          [
            `${cong("a", "b", n)} \\implies ${cong(`a^{${n}}`, `b^{${n}}`, n)}`,
            true,
            t("Powers of congruent numbers are congruent.", "同余的数的幂也同余。"),
          ],
          [
            `${cong("a", "b", n)} \\implies ${cong(`${n + 1}a`, "b", n)}`,
            true,
            t(
              `$${n + 1} \\equiv 1 \\pmod{${n}}$, so $${n + 1}a \\equiv a \\equiv b$.`,
              `$${n + 1} \\equiv 1 \\pmod{${n}}$，所以 $${n + 1}a \\equiv a \\equiv b$。`,
            ),
          ],
          [`${cong("ab", 0, n)} \\implies ${cong("a", 0, n)} \\text{ or } ${cong("b", 0, n)}`, false, t("", "")],
        ];
        const pick = rng.int(0, claims.length - 1);
        let [claim, value, why] = claims[pick]!;
        if (pick === 7) {
          const prime = range(2, n - 1).every((p) => n % p !== 0);
          value = prime;
          const p = range(2, n - 1).find((x) => n % x === 0) ?? 1;
          why = prime
            ? t(
                `$${n}$ is prime, so $${n} \\mid ab$ implies $${n} \\mid a$ or $${n} \\mid b$ (Euclid's lemma).`,
                `$${n}$ 是素数，所以 $${n} \\mid ab$ 推出 $${n} \\mid a$ 或 $${n} \\mid b$（欧几里得引理）。`,
              )
            : t(
                `$${p} \\cdot ${n / p} = ${n} \\equiv 0$, but neither factor is $\\equiv 0 \\pmod{${n}}$.`,
                `$${p} \\cdot ${n / p} = ${n} \\equiv 0$，但两个因子都不 $\\equiv 0 \\pmod{${n}}$。`,
              );
        }
        return oneOf(
          rng,
          t(`True or false, for all integers $a$, $b$, $c$: $${claim}$.`, `判断真假（对所有整数 $a$、$b$、$c$）：$${claim}$。`),
          trueFalse[value ? 0 : 1]!,
          [trueFalse[value ? 1 : 0]!],
          why,
        );
      },
    },
  ],
};

/** provingDivisibilityUsingCongruence proves divisibility by working with residues. */
export const provingDivisibilityUsingCongruence: TopicDef = {
  id: "proving-divisibility-using-congruence",
  title: t("Proving Divisibility Using Congruence", "用同余证明整除"),
  summary: t(
    "To show m divides an expression for every n, check each residue of n modulo m; to test a large number, reduce 10 modulo m.",
    "要证明 m 对每个 n 都整除某个表达式，逐一检验 n 模 m 的每个剩余；要检验大数，先把 10 模 m 约化。",
  ),
  prerequisites: ["the-multiplication-properties-of-modular-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-residue-classes",
      title: t("Checking residue classes", "逐一检验剩余类"),
      explanation: t(
        "Every integer falls into one of finitely many residue classes, so checking one representative from each class covers all integers. To prove $3 \\mid n^3 - n$, check $n \\equiv 0, 1, 2 \\pmod{3}$: $0 - 0 = 0$, $1 - 1 = 0$, $8 - 2 = 6 \\equiv 0$. Every case gives $0$, so $3$ always divides $n^3 - n$.",
        "每个整数都属于有限个剩余类之一，所以从每类中检查一个代表就覆盖了所有整数。证明 $3 \\mid n^3 - n$：检验 $n \\equiv 0, 1, 2 \\pmod{3}$：$0 - 0 = 0$，$1 - 1 = 0$，$8 - 2 = 6 \\equiv 0$。每种情况都得 $0$，所以 $3$ 总整除 $n^3 - n$。",
      ),
      generate(rng) {
        const m = rng.int(3, 9);
        const r = rng.int(1, m - 1);
        const p = rng.int(2, 4);
        const a = rng.int(1, 6);
        const c = rng.int(-9, 9);
        const tex = `n^{${p}} + ${a === 1 ? "" : a}n${signed(c)}`;
        const value = mod(r ** p + a * r + c, m);
        return numberProblem({
          prompt: t(
            `In a proof by cases modulo $${m}$, suppose $${cong("n", r, m)}$. Find the residue $s$ with $0 \\le s < ${m}$ and $${cong(tex, "s", m)}$.`,
            `在模 $${m}$ 的分情况证明中，设 $${cong("n", r, m)}$。求满足 $0 \\le s < ${m}$ 且 $${cong(tex, "s", m)}$ 的剩余 $s$。`,
          ),
          answer: value,
          wrong: [mod(r * p + a * r + c, m), mod(r ** p + a + c, m), mod(value + 1, m)],
          solution: t(
            `$${r}^{${p}}${signed(a)} \\cdot ${r}${signed(c)} = ${r ** p + a * r + c} \\equiv ${value} \\pmod{${m}}$.`,
            `$${r}^{${p}}${signed(a)} \\cdot ${r}${signed(c)} = ${r ** p + a * r + c} \\equiv ${value} \\pmod{${m}}$。`,
          ),
        });
      },
    },
    {
      id: "digit-tests-for-divisibility",
      title: t("Digit tests", "数字判别法"),
      explanation: t(
        "Ten has a simple remainder modulo nine and eleven, so a number reduces to a simple combination of its digits. Since $10 \\equiv 1 \\pmod{9}$, a number is congruent to its digit sum modulo $9$. Since $10 \\equiv -1 \\pmod{11}$, $d_k \\cdots d_1 d_0 \\equiv d_0 - d_1 + d_2 - \\cdots \\pmod{11}$. For $8371$: $1 - 7 + 3 - 8 = -11 \\equiv 0$, so $11 \\mid 8371$.",
        "10 模 9 和模 11 的余数都很简单，所以一个数可以约化为其各位数字的简单组合。因为 $10 \\equiv 1 \\pmod{9}$，一个数模 $9$ 与其各位数字之和同余。因为 $10 \\equiv -1 \\pmod{11}$，$d_k \\cdots d_1 d_0 \\equiv d_0 - d_1 + d_2 - \\cdots \\pmod{11}$。对 $8371$：$1 - 7 + 3 - 8 = -11 \\equiv 0$，所以 $11 \\mid 8371$。",
      ),
      generate(rng) {
        const m = rng.pick([3, 9, 11]);
        const x = rng.int(10000, 9999999);
        const digits = `${x}`.split("").map(Number).reverse();
        const value = x % m;
        const sum = m === 11 ? digits.reduce((s, d, i) => s + (i % 2 === 0 ? d : -d), 0) : digits.reduce((s, d) => s + d, 0);
        return numberProblem({
          prompt: t(
            `Using $${cong(10, m === 11 ? -1 : 1, m)}$, find the remainder when $${x}$ is divided by $${m}$.`,
            `利用 $${cong(10, m === 11 ? -1 : 1, m)}$，求 $${x}$ 除以 $${m}$ 的余数。`,
          ),
          answer: value,
          wrong: [mod(-sum, m), digits[0]! % m, mod(value + 1, m)],
          solution: t(
            `${m === 11 ? "The alternating digit sum from the right" : "The digit sum"} is $${sum}$, and $${sum} \\equiv ${value} \\pmod{${m}}$.`,
            `${m === 11 ? "从右起的交错数字和" : "各位数字之和"}是 $${sum}$，而 $${sum} \\equiv ${value} \\pmod{${m}}$。`,
          ),
        });
      },
    },
  ],
};

/** provingCongruenceByContrapositive proves congruence statements through their contrapositives. */
export const provingCongruenceByContrapositive: TopicDef = {
  id: "proving-congruence-by-contrapositive",
  title: t("Proving Congruence by Contrapositive", "用逆否命题证明同余"),
  summary: t(
    "A statement with a ≢ hypothesis is often easier as its contrapositive, which has an ≡ hypothesis that can be computed with.",
    "假设为 ≢ 的命题常常改证其逆否命题更容易，因为逆否命题的假设是 ≡，可以直接计算。",
  ),
  prerequisites: ["proving-properties-of-modular-congruence", "proof-by-contrapositive"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "forming-the-contrapositive",
      title: t("Forming the contrapositive", "写出逆否命题"),
      explanation: t(
        "The contrapositive of “if $n^2 \\not\\equiv 1 \\pmod{8}$, then $n$ is even” is “if $n$ is odd, then $n^2 \\equiv 1 \\pmod{8}$”, which can be checked on $n \\equiv 1, 3, 5, 7 \\pmod{8}$.",
        "“若 $n^2 \\not\\equiv 1 \\pmod{8}$，则 $n$ 是偶数”的逆否命题是“若 $n$ 是奇数，则 $n^2 \\equiv 1 \\pmod{8}$”，可以对 $n \\equiv 1, 3, 5, 7 \\pmod{8}$ 逐一检验。",
      ),
      generate(rng) {
        const m = rng.int(3, 12);
        const d = rng.int(1, m - 1);
        const p = rng.int(2, 3);
        const c = modPow(d, p, m);
        const np = `n^{${p}}`;
        const stmt = (h: string, k: string) => math(`\\text{If } ${h}, \\text{ then } ${k}.`);
        return oneOf(
          rng,
          t(
            `Which is the contrapositive of “if $${ncong(np, c, m)}$, then $${ncong("n", d, m)}$”?`,
            `“若 $${ncong(np, c, m)}$，则 $${ncong("n", d, m)}$”的逆否命题是哪一个？`,
          ),
          stmt(cong("n", d, m), cong(np, c, m)),
          [stmt(ncong("n", d, m), ncong(np, c, m)), stmt(cong(np, c, m), cong("n", d, m)), stmt(cong("n", d, m), ncong(np, c, m))],
          t(
            `Swap the hypothesis and conclusion and negate both. It is true: $${d}^{${p}} = ${d ** p} \\equiv ${c} \\pmod{${m}}$.`,
            `交换假设与结论并同时否定。它是真的：$${d}^{${p}} = ${d ** p} \\equiv ${c} \\pmod{${m}}$。`,
          ),
        );
      },
    },
    {
      id: "finding-the-residues-that-satisfy-a-congruence",
      title: t("Residues satisfying a congruence", "满足同余式的剩余"),
      explanation: t(
        "To see which residues satisfy a congruence, test each residue class in turn, since there are only finitely many. To prove “if $n^2 \\not\\equiv 4 \\pmod{5}$, then $n \\not\\equiv 2$ and $n \\not\\equiv 3 \\pmod{5}$”, first find which residues satisfy $n^2 \\equiv 4 \\pmod{5}$: squaring $0, 1, 2, 3, 4$ gives $0, 1, 4, 4, 1$, so exactly $n \\equiv 2, 3$.",
        "要知道哪些余数满足一个同余式，逐个检验每个剩余类，因为只有有限个。要证明“若 $n^2 \\not\\equiv 4 \\pmod{5}$，则 $n \\not\\equiv 2$ 且 $n \\not\\equiv 3 \\pmod{5}$”，先找出满足 $n^2 \\equiv 4 \\pmod{5}$ 的剩余：$0, 1, 2, 3, 4$ 的平方为 $0, 1, 4, 4, 1$，所以恰好是 $n \\equiv 2, 3$。",
      ),
      generate(rng) {
        const m = rng.int(5, 16);
        const p = rng.int(2, 3);
        const r0 = rng.int(1, m - 1);
        const c = modPow(r0, p, m);
        const roots = range(0, m - 1).filter((r) => modPow(r, p, m) === c);
        return setProblem({
          prompt: t(
            `Which residues $r \\in \\{0, 1, \\dots, ${m - 1}\\}$ satisfy $${cong(`r^{${p}}`, c, m)}$?`,
            `哪些剩余 $r \\in \\{0, 1, \\dots, ${m - 1}\\}$ 满足 $${cong(`r^{${p}}`, c, m)}$？`,
          ),
          values: roots,
          wrong: [[r0], roots.length > 1 ? roots.slice(1) : [r0, m - r0]],
          solution: t(
            `Compute $r^{${p}} \\bmod ${m}$ for each $r$: the residues with value $${c}$ are $${setTex(roots)}$.`,
            `对每个 $r$ 计算 $r^{${p}} \\bmod ${m}$：值为 $${c}$ 的剩余是 $${setTex(roots)}$。`,
          ),
        });
      },
    },
  ],
};

/** additiveInversesModuloN finds −a modulo n. */
export const additiveInversesModuloN: TopicDef = {
  id: "additive-inverses-modulo-n",
  title: t("Additive Inverses Modulo n", "模 n 的加法逆元"),
  summary: t(
    "The additive inverse of a modulo n is the residue b with a + b ≡ 0 (mod n), namely n − (a mod n) (or 0).",
    "a 模 n 的加法逆元是满足 a + b ≡ 0 (mod n) 的剩余 b，即 n − (a mod n)（或 0）。",
  ),
  prerequisites: ["modular-residues", "the-addition-property-of-modular-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-additive-inverses",
      title: t("Finding additive inverses", "求加法逆元"),
      explanation: t(
        "The additive inverse is what you add to get a multiple of the modulus, which is the modulus minus the reduced number. The additive inverse of $23$ modulo $9$: $23 \\equiv 5$, and $5 + 4 = 9 \\equiv 0$, so it is $4$.",
        "加法逆元是加上之后得到模的倍数的那个数，即模减去约化后的数。$23$ 模 $9$ 的加法逆元：$23 \\equiv 5$，而 $5 + 4 = 9 \\equiv 0$，所以是 $4$。",
      ),
      generate(rng) {
        const n = rng.int(4, 30);
        const a = rng.int(-50, 99);
        const value = mod(-a, n);
        return numberProblem({
          prompt: t(
            `Find the additive inverse of $${a}$ modulo $${n}$, as a residue in $\\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求 $${a}$ 模 $${n}$ 的加法逆元，写成 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的剩余。`,
          ),
          answer: value,
          wrong: [mod(a, n), -a, n - Math.abs(a)],
          solution: t(
            `$${a} \\equiv ${mod(a, n)} \\pmod{${n}}$ and $${mod(a, n)} + ${value} \\equiv 0$, so the inverse is $${value}$.`,
            `$${a} \\equiv ${mod(a, n)} \\pmod{${n}}$，且 $${mod(a, n)} + ${value} \\equiv 0$，所以逆元是 $${value}$。`,
          ),
        });
      },
    },
    {
      id: "solving-additive-congruences",
      title: t("Solving x + a ≡ b", "解 x + a ≡ b"),
      explanation: t(
        "Adding the same number to both sides keeps a congruence true, so subtracting the constant isolates the unknown. Add the additive inverse of $a$ to both sides: $x + 8 \\equiv 3 \\pmod{11}$ gives $x \\equiv 3 - 8 = -5 \\equiv 6 \\pmod{11}$.",
        "两边加上同一个数，同余式仍然成立，所以减去常数就能把未知数单独分离出来。两边加上 $a$ 的加法逆元：$x + 8 \\equiv 3 \\pmod{11}$ 得 $x \\equiv 3 - 8 = -5 \\equiv 6 \\pmod{11}$。",
      ),
      generate(rng) {
        const n = rng.int(4, 25);
        const a = rng.int(1, 60);
        const b = rng.int(0, n - 1);
        const value = mod(b - a, n);
        return numberProblem({
          prompt: t(
            `Solve $${cong(`x + ${a}`, b, n)}$ for the residue $x \\in \\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求解 $${cong(`x + ${a}`, b, n)}$，答案写成剩余 $x \\in \\{0, 1, \\dots, ${n - 1}\\}$。`,
          ),
          answer: value,
          wrong: [mod(b + a, n), b - a, mod(a - b, n)],
          solution: t(
            `$x \\equiv ${b} - ${a} = ${b - a} \\equiv ${value} \\pmod{${n}}$.`,
            `$x \\equiv ${b} - ${a} = ${b - a} \\equiv ${value} \\pmod{${n}}$。`,
          ),
        });
      },
    },
  ],
};

/** multiplicativeInversesModuloN finds a⁻¹ modulo n. */
export const multiplicativeInversesModuloN: TopicDef = {
  id: "multiplicative-inverses-modulo-n",
  title: t("Multiplicative Inverses Modulo n", "模 n 的乘法逆元"),
  summary: t(
    "a has an inverse modulo n exactly when gcd(a, n) = 1; the extended Euclidean algorithm gives as + nt = 1, and s is the inverse.",
    "a 模 n 有逆元当且仅当 gcd(a, n) = 1；扩展欧几里得算法给出 as + nt = 1，s 就是逆元。",
  ),
  prerequisites: ["additive-inverses-modulo-n", "the-multiplication-properties-of-modular-arithmetic", "the-extended-euclidean-algorithm"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-multiplicative-inverses",
      title: t("Finding multiplicative inverses", "求乘法逆元"),
      explanation: t(
        "An inverse exists when the number and the modulus are coprime, and the extended Euclidean algorithm finds it from a Bézout identity. The inverse of $7$ modulo $26$: the extended Euclidean algorithm gives $7 \\cdot (-11) + 26 \\cdot 3 = 1$, so $7^{-1} \\equiv -11 \\equiv 15 \\pmod{26}$. Check: $7 \\cdot 15 = 105 = 4 \\cdot 26 + 1$.",
        "当这个数与模互素时逆元存在，扩展欧几里得算法可以由贝祖等式求出它。$7$ 模 $26$ 的逆元：扩展欧几里得算法给出 $7 \\cdot (-11) + 26 \\cdot 3 = 1$，所以 $7^{-1} \\equiv -11 \\equiv 15 \\pmod{26}$。验证：$7 \\cdot 15 = 105 = 4 \\cdot 26 + 1$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(5, 40);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) !== 1);
        const value = inverseMod(a, n);
        return numberProblem({
          prompt: t(
            `Find the inverse of $${a}$ modulo $${n}$, as a residue in $\\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求 $${a}$ 模 $${n}$ 的逆元，写成 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的剩余。`,
          ),
          answer: value,
          wrong: [n - value, mod(-a, n), mod(value + 1, n)],
          solution: t(
            `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${(a * value - 1) / n} + 1 \\equiv 1 \\pmod{${n}}$.`,
            `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${(a * value - 1) / n} + 1 \\equiv 1 \\pmod{${n}}$。`,
          ),
        });
      },
    },
    {
      id: "existence-of-inverses",
      title: t("When an inverse exists", "逆元何时存在"),
      explanation: t(
        "If $\\gcd(a, n) = d > 1$, then $ax - 1$ can never be a multiple of $n$ (it is $\\equiv -1 \\pmod{d}$), so $a$ has no inverse. Modulo $12$, only $1, 5, 7, 11$ are invertible.",
        "若 $\\gcd(a, n) = d > 1$，则 $ax - 1$ 永远不会是 $n$ 的倍数（它 $\\equiv -1 \\pmod{d}$），所以 $a$ 没有逆元。模 $12$ 时，只有 $1, 5, 7, 11$ 可逆。",
      ),
      generate(rng) {
        const n = rng.int(6, 40);
        const a = rng.int(2, 3 * n);
        const g = gcd(a, n);
        const value = g === 1;
        return oneOf(
          rng,
          t(`Does $${a}$ have a multiplicative inverse modulo $${n}$?`, `$${a}$ 模 $${n}$ 有乘法逆元吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                `Yes: $\\gcd(${a}, ${n}) = 1$; its inverse is $${inverseMod(a, n)}$.`,
                `有：$\\gcd(${a}, ${n}) = 1$；逆元是 $${inverseMod(a, n)}$。`,
              )
            : t(`No: $\\gcd(${a}, ${n}) = ${g} > 1$.`, `没有：$\\gcd(${a}, ${n}) = ${g} > 1$。`),
        );
      },
    },
  ],
};

/** solvingLinearCongruences solves ax ≡ b (mod n). */
export const solvingLinearCongruences: TopicDef = {
  id: "solving-linear-congruences",
  title: t("Solving Linear Congruences", "解一次同余式"),
  summary: t(
    "When gcd(a, n) = 1, ax ≡ b (mod n) has the unique solution x ≡ a⁻¹b (mod n). In general it is solvable iff gcd(a, n) divides b, with gcd(a, n) solutions modulo n.",
    "当 gcd(a, n) = 1 时，ax ≡ b (mod n) 有唯一解 x ≡ a⁻¹b (mod n)。一般地，它有解当且仅当 gcd(a, n) 整除 b，此时模 n 有 gcd(a, n) 个解。",
  ),
  prerequisites: ["multiplicative-inverses-modulo-n"],
  encompasses: [{ topic: "multiplicative-inverses-modulo-n", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-with-an-inverse",
      title: t("Solving with an inverse", "利用逆元求解"),
      explanation: t(
        "Multiplying both sides by the inverse of the coefficient undoes the multiplication, just as dividing does for ordinary equations. $5x \\equiv 3 \\pmod{12}$: $5^{-1} \\equiv 5$ (since $25 \\equiv 1$), so $x \\equiv 5 \\cdot 3 = 15 \\equiv 3 \\pmod{12}$. Check: $5 \\cdot 3 = 15 \\equiv 3$.",
        "把两边乘以系数的逆元就撤销了乘法，就像普通方程中的除法一样。$5x \\equiv 3 \\pmod{12}$：$5^{-1} \\equiv 5$（因为 $25 \\equiv 1$），所以 $x \\equiv 5 \\cdot 3 = 15 \\equiv 3 \\pmod{12}$。验证：$5 \\cdot 3 = 15 \\equiv 3$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(5, 30);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) !== 1);
        const b = rng.int(1, n - 1);
        const inv = inverseMod(a, n);
        const value = mod(inv * b, n);
        return numberProblem({
          prompt: t(
            `Solve $${cong(`${a === 1 ? "" : a}x`, b, n)}$ for the residue $x \\in \\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求解 $${cong(`${a === 1 ? "" : a}x`, b, n)}$，答案写成剩余 $x \\in \\{0, 1, \\dots, ${n - 1}\\}$。`,
          ),
          answer: value,
          wrong: [inv, mod(b - a, n), mod(a * b, n)],
          solution: t(
            `$${a}^{-1} \\equiv ${inv} \\pmod{${n}}$, so $x \\equiv ${inv} \\cdot ${b} = ${inv * b} \\equiv ${value}$.`,
            `$${a}^{-1} \\equiv ${inv} \\pmod{${n}}$，所以 $x \\equiv ${inv} \\cdot ${b} = ${inv * b} \\equiv ${value}$。`,
          ),
        });
      },
    },
    {
      id: "counting-solutions-of-a-linear-congruence",
      title: t("Counting solutions", "统计解的个数"),
      explanation: t(
        "A linear congruence has solutions only when the gcd of the coefficient and the modulus divides the constant, and then it has exactly that many. $6x \\equiv 9 \\pmod{15}$: $\\gcd(6, 15) = 3$ divides $9$, so there are $3$ solutions modulo $15$. $6x \\equiv 4 \\pmod{15}$ has none, since $3 \\nmid 4$.",
        "线性同余式只有在系数与模的最大公因数整除常数时才有解，而且这时恰好有那么多个解。$6x \\equiv 9 \\pmod{15}$：$\\gcd(6, 15) = 3$ 整除 $9$，所以模 $15$ 有 $3$ 个解。$6x \\equiv 4 \\pmod{15}$ 无解，因为 $3 \\nmid 4$。",
      ),
      generate(rng) {
        const n = rng.int(6, 36);
        const factors = range(2, n - 1).filter((f) => n % f === 0);
        const f = factors.length > 0 && rng.int(0, 2) > 0 ? rng.pick(factors) : 1;
        const a = f * rng.int(f === 1 ? 2 : 1, Math.floor((n - 1) / f));
        const d = gcd(a, n);
        const b = rng.bool() ? d * rng.int(0, Math.floor((n - 1) / d)) : rng.int(1, n - 1);
        const count = b % d === 0 ? d : 0;
        return numberProblem({
          prompt: t(
            `How many solutions $x \\in \\{0, 1, \\dots, ${n - 1}\\}$ does $${cong(`${a === 1 ? "" : a}x`, b, n)}$ have?`,
            `$${cong(`${a === 1 ? "" : a}x`, b, n)}$ 在 $\\{0, 1, \\dots, ${n - 1}\\}$ 中有多少个解？`,
          ),
          answer: count,
          wrong: [1, count === 0 ? d : 0, n / d],
          solution:
            count === 0
              ? t(
                  `$\\gcd(${a}, ${n}) = ${d}$ does not divide $${b}$, so there are no solutions.`,
                  `$\\gcd(${a}, ${n}) = ${d}$ 不整除 $${b}$，所以无解。`,
                )
              : t(
                  d === 1
                    ? `$\\gcd(${a}, ${n}) = 1$, so there is exactly one solution modulo $${n}$.`
                    : `$\\gcd(${a}, ${n}) = ${d}$ divides $${b}$, so there are $${d}$ solutions modulo $${n}$.`,
                  d === 1
                    ? `$\\gcd(${a}, ${n}) = 1$，所以模 $${n}$ 恰有一个解。`
                    : `$\\gcd(${a}, ${n}) = ${d}$ 整除 $${b}$，所以模 $${n}$ 有 $${d}$ 个解。`,
                ),
        });
      },
    },
  ],
};

/** solvingAdvancedLinearCongruences solves ax ≡ b (mod n) when gcd(a, n) > 1. */
export const solvingAdvancedLinearCongruences: TopicDef = {
  id: "solving-advanced-linear-congruences",
  title: t("Solving Advanced Linear Congruences", "解较复杂的一次同余式"),
  summary: t(
    "If d = gcd(a, n) divides b, divide through by d, solve (a/d)x ≡ b/d (mod n/d), and list the d solutions modulo n.",
    "若 d = gcd(a, n) 整除 b，两边同除以 d，解 (a/d)x ≡ b/d (mod n/d)，再列出模 n 的 d 个解。",
  ),
  prerequisites: ["solving-linear-congruences", "the-division-properties-of-modular-arithmetic"],
  encompasses: [{ topic: "solving-linear-congruences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "listing-all-solutions",
      title: t("Listing all solutions", "列出全部解"),
      explanation: t(
        "Divide everything by the gcd, solve the smaller congruence, and then list its solutions within the original modulus. $6x \\equiv 9 \\pmod{15}$: divide by $3$ to get $2x \\equiv 3 \\pmod{5}$, so $x \\equiv 4 \\pmod{5}$. Modulo $15$ the solutions are $4, 9, 14$.",
        "把各项都除以最大公因数，解较小的同余式，再在原来的模内列出它的所有解。$6x \\equiv 9 \\pmod{15}$：两边除以 $3$ 得 $2x \\equiv 3 \\pmod{5}$，所以 $x \\equiv 4 \\pmod{5}$。模 $15$ 的解是 $4, 9, 14$。",
      ),
      generate(rng) {
        const d = rng.int(2, 4);
        let m: number;
        let a1: number;
        do {
          m = rng.int(3, 9);
          a1 = rng.int(1, m - 1);
        } while (gcd(a1, m) !== 1 || gcd(d, m) !== 1);
        const n = d * m;
        const b1 = rng.int(0, m - 1);
        const x0 = mod(inverseMod(a1, m) * b1, m);
        const a = d * a1;
        const b = d * b1;
        const sols = range(0, d - 1).map((k) => x0 + k * m);
        return setProblem({
          prompt: t(
            `Find all solutions $x \\in \\{0, 1, \\dots, ${n - 1}\\}$ of $${cong(`${a === 1 ? "" : a}x`, b, n)}$.`,
            `求 $${cong(`${a === 1 ? "" : a}x`, b, n)}$ 在 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的全部解。`,
          ),
          values: sols,
          wrong: [[x0], sols.map((s) => mod(s + 1, n))],
          solution: t(
            `$\\gcd(${a}, ${n}) = ${d}$: divide by $${d}$ to get $${cong(`${a1 === 1 ? "" : a1}x`, b1, m)}$${a1 === 1 ? "" : `, so $${cong("x", x0, m)}$`}. Modulo $${n}$: $${setTex(sols)}$.`,
            `$\\gcd(${a}, ${n}) = ${d}$：两边除以 $${d}$ 得 $${cong(`${a1 === 1 ? "" : a1}x`, b1, m)}$${a1 === 1 ? "" : `，所以 $${cong("x", x0, m)}$`}。模 $${n}$：$${setTex(sols)}$。`,
          ),
        });
      },
    },
    {
      id: "reducing-the-coefficients-first",
      title: t("Reducing the coefficients first", "先约化系数"),
      explanation: t(
        "Replacing every number by its remainder first keeps the arithmetic small and does not change the solutions. $47x \\equiv -13 \\pmod{9}$: reduce first, $47 \\equiv 2$ and $-13 \\equiv 5$, giving $2x \\equiv 5 \\pmod{9}$. Then $2^{-1} \\equiv 5$, so $x \\equiv 25 \\equiv 7 \\pmod{9}$.",
        "先把每个数换成它的余数，可以让计算保持简单，而且不改变解。$47x \\equiv -13 \\pmod{9}$：先约化，$47 \\equiv 2$，$-13 \\equiv 5$，得 $2x \\equiv 5 \\pmod{9}$。而 $2^{-1} \\equiv 5$，所以 $x \\equiv 25 \\equiv 7 \\pmod{9}$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(5, 17);
          a = rng.int(n + 1, 120);
        } while (gcd(a, n) !== 1);
        const b = rng.int(-80, -1);
        const ra = mod(a, n);
        const rb = mod(b, n);
        const value = mod(inverseMod(ra, n) * rb, n);
        return numberProblem({
          prompt: t(
            `Solve $${cong(`${a === 1 ? "" : a}x`, b, n)}$ for the residue $x \\in \\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求解 $${cong(`${a === 1 ? "" : a}x`, b, n)}$，答案写成剩余 $x \\in \\{0, 1, \\dots, ${n - 1}\\}$。`,
          ),
          answer: value,
          wrong: [mod(inverseMod(ra, n) * -b, n), mod(inverseMod(ra, n) * Math.abs(b % n), n), mod(value + 1, n)],
          solution: t(
            `$${a} \\equiv ${ra}$ and $${b} \\equiv ${rb}$, so $${cong(`${ra === 1 ? "" : ra}x`, rb, n)}$, and $x \\equiv ${inverseMod(ra, n)} \\cdot ${rb} \\equiv ${value}$.`,
            `$${a} \\equiv ${ra}$，$${b} \\equiv ${rb}$，所以 $${cong(`${ra === 1 ? "" : ra}x`, rb, n)}$，于是 $x \\equiv ${inverseMod(ra, n)} \\cdot ${rb} \\equiv ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** theChineseRemainderTheorem solves systems of congruences with coprime moduli. */
export const theChineseRemainderTheorem: TopicDef = {
  id: "the-chinese-remainder-theorem",
  title: t("The Chinese Remainder Theorem", "中国剩余定理"),
  summary: t(
    "If the moduli are pairwise coprime, a system x ≡ aᵢ (mod nᵢ) has exactly one solution modulo n₁n₂⋯nₖ.",
    "若各模两两互素，同余方程组 x ≡ aᵢ (mod nᵢ) 模 n₁n₂⋯nₖ 恰有一个解。",
  ),
  prerequisites: ["solving-linear-congruences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-two-congruences",
      title: t("Two congruences", "两个同余式"),
      explanation: t(
        "Write the general solution of the first congruence with a parameter and substitute it into the second to find the parameter. $x \\equiv 2 \\pmod{5}$, $x \\equiv 3 \\pmod{7}$: write $x = 2 + 5k$. Then $2 + 5k \\equiv 3 \\pmod{7}$, so $5k \\equiv 1$ and $k \\equiv 3 \\pmod{7}$. So $x = 17$, and all solutions are $x \\equiv 17 \\pmod{35}$.",
        "用一个参数写出第一个同余式的通解，再代入第二个同余式求出这个参数。$x \\equiv 2 \\pmod{5}$，$x \\equiv 3 \\pmod{7}$：写 $x = 2 + 5k$。则 $2 + 5k \\equiv 3 \\pmod{7}$，所以 $5k \\equiv 1$，$k \\equiv 3 \\pmod{7}$。于是 $x = 17$，全部解为 $x \\equiv 17 \\pmod{35}$。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        do {
          m = rng.int(3, 11);
          n = rng.int(3, 13);
        } while (gcd(m, n) !== 1);
        const a = rng.int(0, m - 1);
        const b = rng.int(0, n - 1);
        const x = range(0, m * n - 1).find((v) => v % m === a && v % n === b)!;
        const k = (x - a) / m;
        return numberProblem({
          prompt: t(
            `Find the smallest nonnegative $x$ with $${cong("x", a, m)}$ and $${cong("x", b, n)}$.`,
            `求同时满足 $${cong("x", a, m)}$ 与 $${cong("x", b, n)}$ 的最小非负整数 $x$。`,
          ),
          answer: x,
          wrong: [x + m * n, a + b, mod(a * n + b * m, m * n)],
          solution: t(
            `Write $x = ${a} + ${m}k$ and solve $${cong(`${a} + ${m}k`, b, n)}$: $k \\equiv ${k} \\pmod{${n}}$, so $x = ${x}$ (unique modulo $${m * n}$).`,
            `写 $x = ${a} + ${m}k$，解 $${cong(`${a} + ${m}k`, b, n)}$：$k \\equiv ${k} \\pmod{${n}}$，所以 $x = ${x}$（模 $${m * n}$ 唯一）。`,
          ),
        });
      },
    },
    {
      id: "solving-three-congruences",
      title: t("Three congruences", "三个同余式"),
      explanation: t(
        "Combine the congruences two at a time: solving the first pair gives one congruence, which is then combined with the third. $x \\equiv 1 \\pmod{3}$, $x \\equiv 2 \\pmod{4}$, $x \\equiv 3 \\pmod{5}$: the first two give $x \\equiv 10 \\pmod{12}$; then $10 + 12k \\equiv 3 \\pmod{5}$ gives $k \\equiv 4$, so $x = 58$ modulo $60$.",
        "把同余式两两合并：解出前两个得到一个同余式，再把它与第三个合并。$x \\equiv 1 \\pmod{3}$，$x \\equiv 2 \\pmod{4}$，$x \\equiv 3 \\pmod{5}$：前两个给出 $x \\equiv 10 \\pmod{12}$；再由 $10 + 12k \\equiv 3 \\pmod{5}$ 得 $k \\equiv 4$，所以模 $60$ 有 $x = 58$。",
      ),
      generate(rng) {
        const [p, q, r] = rng.pick([
          [2, 3, 5],
          [3, 4, 5],
          [3, 5, 7],
          [2, 5, 7],
          [4, 5, 7],
        ] as const);
        const a = rng.int(0, p - 1);
        const b = rng.int(0, q - 1);
        const c = rng.int(0, r - 1);
        const N = p * q * r;
        const x = range(0, N - 1).find((v) => v % p === a && v % q === b && v % r === c)!;
        const y = range(0, p * q - 1).find((v) => v % p === a && v % q === b)!;
        return numberProblem({
          prompt: t(
            `Find the smallest nonnegative $x$ with $${cong("x", a, p)}$, $${cong("x", b, q)}$ and $${cong("x", c, r)}$.`,
            `求同时满足 $${cong("x", a, p)}$、$${cong("x", b, q)}$、$${cong("x", c, r)}$ 的最小非负整数 $x$。`,
          ),
          answer: x,
          wrong: [y, x + N, a + b + c],
          solution: t(
            `The first two give $${cong("x", y, p * q)}$; then $x = ${y} + ${p * q}k \\equiv ${c} \\pmod{${r}}$ gives $x = ${x}$ (unique modulo $${N}$).`,
            `前两个给出 $${cong("x", y, p * q)}$；再由 $x = ${y} + ${p * q}k \\equiv ${c} \\pmod{${r}}$ 得 $x = ${x}$（模 $${N}$ 唯一）。`,
          ),
        });
      },
    },
  ],
};

/** provingPropertiesOfLinearCongruences proves existence and uniqueness of solutions. */
export const provingPropertiesOfLinearCongruences: TopicDef = {
  id: "proving-properties-of-linear-congruences",
  title: t("Proving Properties of Linear Congruences", "证明一次同余式的性质"),
  summary: t(
    "Existence: from as + nt = 1, x = sb solves ax ≡ b (mod n). Uniqueness: ax ≡ ay with gcd(a, n) = 1 gives n | x − y.",
    "存在性：由 as + nt = 1，x = sb 是 ax ≡ b (mod n) 的解。唯一性：ax ≡ ay 且 gcd(a, n) = 1 推出 n | x − y。",
  ),
  prerequisites: ["solving-advanced-linear-congruences", "proving-properties-of-modular-congruence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "constructing-a-solution-from-bezout",
      title: t("Constructing a solution", "构造解"),
      explanation: t(
        "A Bézout identity shows a multiple of the coefficient congruent to one, so scaling it gives a solution of the congruence. Given $7 \\cdot (-2) + 15 \\cdot 1 = 1$, multiply by $4$: $7 \\cdot (-8) + 15 \\cdot 4 = 4$, so $7 \\cdot (-8) \\equiv 4 \\pmod{15}$ and $x = -8 \\equiv 7$ solves $7x \\equiv 4 \\pmod{15}$.",
        "贝祖等式给出系数的一个同余于 1 的倍数，把它按比例放大就得到同余式的解。已知 $7 \\cdot (-2) + 15 \\cdot 1 = 1$，两边乘以 $4$：$7 \\cdot (-8) + 15 \\cdot 4 = 4$，所以 $7 \\cdot (-8) \\equiv 4 \\pmod{15}$，$x = -8 \\equiv 7$ 是 $7x \\equiv 4 \\pmod{15}$ 的解。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 40);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) !== 1);
        const [s, tt] = bezout(a, n);
        // With b = a the answer is x = 1, whatever the identity says.
        const b = rng.pick(range(2, n - 1).filter((v) => v !== a));
        const value = mod(s * b, n);
        return oneOf(
          rng,
          t(
            `Given $${a} \\cdot ${par(s)} + ${n} \\cdot ${par(tt)} = 1$, which residue solves $${cong(`${a === 1 ? "" : a}x`, b, n)}$?`,
            `已知 $${a} \\cdot ${par(s)} + ${n} \\cdot ${par(tt)} = 1$，哪个剩余是 $${cong(`${a === 1 ? "" : a}x`, b, n)}$ 的解？`,
          ),
          math(`x = ${value}`),
          [mod(tt * b, n), mod(s + b, n), mod(-s * b, n), mod(s, n)].filter((w) => w !== value).map((w) => math(`x = ${w}`)),
          t(
            `Multiply by $${b}$: $${a} \\cdot ${par(s * b)} + ${n} \\cdot ${par(tt * b)} = ${b}$, so $x \\equiv ${reduced(s * b, value)} \\pmod{${n}}$.`,
            `两边乘以 $${b}$：$${a} \\cdot ${par(s * b)} + ${n} \\cdot ${par(tt * b)} = ${b}$，所以 $x \\equiv ${reduced(s * b, value)} \\pmod{${n}}$。`,
          ),
        );
      },
    },
    {
      id: "proving-uniqueness-of-solutions",
      title: t("Proving uniqueness", "证明唯一性"),
      explanation: t(
        "If two solutions existed, the modulus would divide the coefficient times their difference, and coprimality forces it to divide the difference itself. Suppose $ax \\equiv b$ and $ay \\equiv b \\pmod{n}$ with $\\gcd(a, n) = 1$. Subtracting, $n \\mid a(x - y)$; since $n$ shares no factor with $a$, $n \\mid x - y$, so $x \\equiv y \\pmod{n}$.",
        "如果存在两个解，模就整除系数乘以它们的差，而互素性迫使模整除这个差本身。设 $ax \\equiv b$ 且 $ay \\equiv b \\pmod{n}$，$\\gcd(a, n) = 1$。相减得 $n \\mid a(x - y)$；由于 $n$ 与 $a$ 没有公因数，$n \\mid x - y$，所以 $x \\equiv y \\pmod{n}$。",
      ),
      generate(rng) {
        const n = rng.int(4, 30);
        const a0 = rng.int(2, 40);
        const a = a0 % n === 0 ? a0 + 1 : a0;
        const g = gcd(a, n);
        const coprime = g === 1;
        return oneOf(
          rng,
          t(
            `Suppose $${cong(`${a === 1 ? "" : a}x`, "b", n)}$ and $${cong(`${a}y`, "b", n)}$, so $${n} \\mid ${a}(x - y)$. What can we conclude?`,
            `设 $${cong(`${a === 1 ? "" : a}x`, "b", n)}$ 且 $${cong(`${a}y`, "b", n)}$，所以 $${n} \\mid ${a}(x - y)$。可以得出什么结论？`,
          ),
          coprime ? math(cong("x", "y", n)) : math(cong("x", "y", n / g)),
          coprime
            ? [math(`x = y`), math(cong("x", "y", n * a)), math(cong("x", 0, n))]
            : [math(cong("x", "y", n)), math(`x = y`), math(cong("x", "y", g))],
          coprime
            ? t(
                `$\\gcd(${a}, ${n}) = 1$, so $${n} \\mid x - y$: the solution is unique modulo $${n}$.`,
                `$\\gcd(${a}, ${n}) = 1$，所以 $${n} \\mid x - y$：解模 $${n}$ 唯一。`,
              )
            : t(
                `$\\gcd(${a}, ${n}) = ${g}$, so only $${n / g} \\mid ${a / g}(x - y)$ and hence $${n / g} \\mid x - y$; solutions repeat modulo $${n / g}$, not $${n}$.`,
                `$\\gcd(${a}, ${n}) = ${g}$，所以只能得到 $${n / g} \\mid ${a / g}(x - y)$，从而 $${n / g} \\mid x - y$；解按模 $${n / g}$ 重复，而非模 $${n}$。`,
              ),
        );
      },
    },
  ],
};

/** methodsOfProofCongruenceTopics are the new topics of Methods of Proof unit 6. */
export const methodsOfProofCongruenceTopics: readonly TopicDef[] = [
  modularCongruence,
  theAdditionPropertyOfModularArithmetic,
  modularResidues,
  theMultiplicationPropertiesOfModularArithmetic,
  theDivisionPropertiesOfModularArithmetic,
  provingPropertiesOfModularCongruence,
  provingDivisibilityUsingCongruence,
  provingCongruenceByContrapositive,
  additiveInversesModuloN,
  multiplicativeInversesModuloN,
  solvingLinearCongruences,
  solvingAdvancedLinearCongruences,
  theChineseRemainderTheorem,
  provingPropertiesOfLinearCongruences,
];
