// Third knowledge points for thin topics of Abstract Algebra, on permutations, symmetries, cosets
// and the isomorphism theorems: the reverse question, a harder case or a common trap.
// See `deeperAbstractAlgebraThirdPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { algebraDrawings1 } from "../explanation-drawings-abstract-algebra-1.ts";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { choose, factorize, type Pair, point, totient } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { gcd, lcm } from "./deeper-methods-of-proof-third.ts";

/** asPair turns a text into a pair, so that a walked solution can go where a pair is expected. */
const asPair = (x: Text): Pair => [x.en, x["zh-CN"]];
/** distinctMistakes keeps the typical mistakes whose values differ from the answer, each value once. */
const distinctMistakes = <T extends { readonly value: unknown }>(answer: unknown, list: readonly T[]): T[] =>
  list.filter((m, i) => m.value !== answer && list.findIndex((x) => x.value === m.value) === i);

/** cycleText writes a cycle in the usual notation. */
const cycleText = (cycle: readonly number[]) => `(${cycle.join("\\;")})`;
/** applyCycle gives the image of a point under one cycle. */
const applyCycle = (cycle: readonly number[], x: number) => {
  const i = cycle.indexOf(x);
  return i < 0 ? x : (cycle[(i + 1) % cycle.length] as number);
};
/** inverseCycleImage gives the image of a point under the inverse of one cycle. */
const inverseCycleImage = (cycle: readonly number[], x: number) => {
  const i = cycle.indexOf(x);
  return i < 0 ? x : (cycle[(i + cycle.length - 1) % cycle.length] as number);
};
/** oneTo lists the integers from one to n. */
const oneTo = (n: number) => [...Array(n).keys()].map((i) => i + 1);
/** factorial gives n factorial. */
export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** Signed describes a symmetry of the cube: coordinate i of the image is sign[i] times coordinate perm[i]. */
type Signed = { perm: readonly number[]; sign: readonly number[] };
/** randomSigned picks a symmetry of the cube. */
const randomSigned = (rng: Rng): Signed => ({
  perm: rng.shuffle([0, 1, 2]),
  sign: [rng.pick([1, -1]), rng.pick([1, -1]), rng.pick([1, -1])],
});
/** signedText writes a symmetry of the cube as a map of the coordinates. */
const signedText = (f: Signed) =>
  `(x, y, z) \\mapsto (${[0, 1, 2].map((i) => `${(f.sign[i] as number) < 0 ? "-" : ""}${"xyz"[f.perm[i] as number]}`).join(", ")})`;
/** applySigned applies a symmetry of the cube to a point. */
const applySigned = (f: Signed, v: readonly number[]) => [0, 1, 2].map((i) => (f.sign[i] as number) * (v[f.perm[i] as number] as number));
/** applySignedInverse applies the inverse of a symmetry of the cube to a point. */
const applySignedInverse = (f: Signed, w: readonly number[]) => {
  const v = [0, 0, 0];
  for (const i of [0, 1, 2]) v[f.perm[i] as number] = (f.sign[i] as number) * (w[i] as number);
  return v;
};
/** tuple writes a point. */
const tuple = (v: readonly number[]) => `(${v.join(", ")})`;

const sumOfSubgroups = point(
  "the-sum-of-two-subgroups-of-the-integers",
  ["The sum of two subgroups of the integers", "整数的两个子群之和"],
  [
    "Every subgroup of the integers has the form $d\\mathbb{Z}$. The set $a\\mathbb{Z} + b\\mathbb{Z}$ of all combinations $ax + by$ is a subgroup, and by Bezout's identity its positive generator is $\\gcd(a, b)$. Intersections give the least common multiple instead.\n\nFor $12\\mathbb{Z} + 20\\mathbb{Z}$: $\\gcd(12, 20) = 4$, so the sum is $4\\mathbb{Z}$.\n\nCheck: $2 \\cdot 12 - 20 = 4$, so $4$ is a combination, and $4$ divides both $12$ and $20$, so every combination is a multiple of $4$.\n\n> **Watch out.** The sum is the larger subgroup, given by the gcd; the lcm gives the smaller intersection $12\\mathbb{Z} \\cap 20\\mathbb{Z} = 60\\mathbb{Z}$.",
    "整数的每个子群都形如 $d\\mathbb{Z}$。所有组合 $ax + by$ 构成的集合 $a\\mathbb{Z} + b\\mathbb{Z}$ 是子群，由贝祖等式，它的正生成元是 $\\gcd(a, b)$。而交集给出的是最小公倍数。\n\n对 $12\\mathbb{Z} + 20\\mathbb{Z}$：$\\gcd(12, 20) = 4$，所以该和为 $4\\mathbb{Z}$。\n\n检验：$2 \\cdot 12 - 20 = 4$，所以 $4$ 是一个组合；又 $4$ 整除 $12$ 与 $20$，所以每个组合都是 $4$ 的倍数。\n\n> **注意。** 和是较大的子群，由最大公约数给出；最小公倍数给出的是较小的交 $12\\mathbb{Z} \\cap 20\\mathbb{Z} = 60\\mathbb{Z}$。",
  ],
  (rng) => {
    const g = rng.int(2, 12);
    const a = g * rng.int(1, 9);
    let b = g * rng.int(1, 9);
    if (b === a) b += g;
    const answer = gcd(a, b);
    // x and y with a x + b y = gcd(a, b), the smallest |x| that works.
    const x = [...Array(2 * b + 1).keys()]
      .map((i) => (i % 2 === 0 ? i / 2 : -(i + 1) / 2))
      .find((v) => (answer - a * v) % b === 0) as number;
    const y = (answer - a * x) / b;
    const term = (c: number, v: number) => (c === 1 ? `${v}` : c === -1 ? `-${v}` : `${c} \\cdot ${v}`);
    const combo = x === 0 ? term(y, b) : y === 0 ? term(x, a) : `${term(x, a)} ${y < 0 ? "-" : "+"} ${term(Math.abs(y), b)}`;
    const mistakes = [
      why(
        lcm(a, b),
        "The lcm generates the intersection $a\\mathbb{Z} \\cap b\\mathbb{Z}$, not the sum.",
        "最小公倍数生成的是交 $a\\mathbb{Z} \\cap b\\mathbb{Z}$，而不是和。",
      ),
      why(a + b, "$a + b$ lies in the sum, but it is not the smallest positive element.", "$a + b$ 在和中，但不是其中最小的正元素。"),
      why(a * b, "The product is a common multiple, which generates a smaller subgroup.", "乘积是公倍数，它生成的子群更小。"),
      why(
        Math.min(a, b),
        `$${Math.min(a, b)}\\mathbb{Z}$ does not contain $${Math.max(a, b)}$, so it cannot be the sum.`,
        `$${Math.min(a, b)}\\mathbb{Z}$ 不含 $${Math.max(a, b)}$，所以不可能是和。`,
      ),
      why(Math.abs(a - b), "The difference is in the sum, but the gcd can be smaller still.", "差在和中，但最大公约数可能更小。"),
    ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i);
    return numberProblem({
      prompt: t(
        `The sum $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$ is a subgroup $d\\mathbb{Z}$ of $\\mathbb{Z}$ with $d > 0$. Find $d$.`,
        `和 $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子群 $d\\mathbb{Z}$，其中 $d > 0$。求 $d$。`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Use Bezout", "用贝祖等式"],
            t(
              `The combinations $${a}x + ${b}y$ are exactly the multiples of $\\gcd(${a}, ${b})$.`,
              `组合 $${a}x + ${b}y$ 恰好是 $\\gcd(${a}, ${b})$ 的所有倍数。`,
            ),
          ],
          [
            ["Compute the gcd", "求最大公约数"],
            t(`$\\gcd(${a}, ${b}) = ${answer}$, so $d = ${answer}$.`, `$\\gcd(${a}, ${b}) = ${answer}$，所以 $d = ${answer}$。`),
          ],
        ],
        t(
          `$${combo} = ${answer}$, so $${answer}$ is in the sum, and $${answer}$ divides both $${a}$ and $${b}$.`,
          `$${combo} = ${answer}$，所以 $${answer}$ 在和中，且 $${answer}$ 整除 $${a}$ 与 $${b}$。`,
        ),
      ),
    });
  },
);

const cyclePower = point(
  "a-high-power-of-a-cycle",
  ["A high power of a cycle", "循环的高次幂"],
  [
    "A cycle of length $L$ returns every point to itself after $L$ steps. So its power $\\sigma^{k}$ depends only on the remainder of $k$ modulo $L$, and even a very high power can be found by moving along the cycle only a few places.\n\nFor $\\sigma = (2\\;6\\;1\\;5)$ and $\\sigma^{50}(6)$: $50 = 12 \\cdot 4 + 2$, so move $2$ places from $6$: $6 \\to 1 \\to 5$, giving $5$.\n\nCheck: $\\sigma^{48} = (\\sigma^4)^{12} = e$, so $\\sigma^{50} = \\sigma^{2}$, and $\\sigma^{2}(6) = 5$ as found.\n\n> **Watch out.** Move from the given point, not from the first entry of the written cycle, and reduce $k$ modulo the length of the cycle, not modulo $n$.",
    "长度为 $L$ 的循环经过 $L$ 步使每个点回到自身。所以幂 $\\sigma^{k}$ 只取决于 $k$ 模 $L$ 的余数，即使是很高的幂，也只需沿循环移动几个位置就能求出。\n\n对 $\\sigma = (2\\;6\\;1\\;5)$ 求 $\\sigma^{50}(6)$：$50 = 12 \\cdot 4 + 2$，所以从 $6$ 移动 $2$ 个位置：$6 \\to 1 \\to 5$，得 $5$。\n\n检验：$\\sigma^{48} = (\\sigma^4)^{12} = e$，所以 $\\sigma^{50} = \\sigma^{2}$，而 $\\sigma^{2}(6) = 5$，与所得一致。\n\n> **注意。** 要从给定的点出发，而不是从所写循环的第一项出发；并且 $k$ 要对循环的长度取模，而不是对 $n$ 取模。",
  ],
  (rng) => {
    for (;;) {
      const n = rng.int(6, 9);
      const L = rng.int(4, n);
      const cycle = rng.sample(oneTo(n), L);
      const k = rng.int(10, 200);
      const start = rng.int(0, L - 1);
      const x = cycle[start] as number;
      const steps = k % L;
      const answer = cycle[(start + steps) % L] as number;
      const mistakes = distinctMistakes(answer, [
        why(applyCycle(cycle, x), "That applies $\\sigma$ only once and ignores the exponent.", "那只作用了一次 $\\sigma$，忽略了指数。"),
        why(
          cycle[(start + L - steps) % L] as number,
          `That moves $${steps}$ places backward; powers of $\\sigma$ move forward along the cycle.`,
          `那是向后移动了 $${steps}$ 个位置；$\\sigma$ 的幂是沿循环向前移动。`,
        ),
        why(
          cycle[steps] as number,
          "That counts the places from the first entry of the written cycle instead of from the given point.",
          "那是从所写循环的第一项开始数，而不是从给定的点开始。",
        ),
        why(
          cycle[(start + (k % n)) % L] as number,
          `That reduces $${k}$ modulo $${n}$, the number of symbols, instead of modulo the cycle length $${L}$.`,
          `那是把 $${k}$ 对符号个数 $${n}$ 取模，而不是对循环长度 $${L}$ 取模。`,
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `In $S_{${n}}$, let $\\sigma = ${cycleText(cycle)}$. Find $\\sigma^{${k}}(${x})$.`,
          `在 $S_{${n}}$ 中，设 $\\sigma = ${cycleText(cycle)}$。求 $\\sigma^{${k}}(${x})$。`,
        ),
        answer,
        mistakes,
        solution: walked(
          [
            [
              ["Reduce the exponent", "约化指数"],
              t(
                `The cycle has length $${L}$ and $${k} = ${Math.floor(k / L)} \\cdot ${L} + ${steps}$, so $\\sigma^{${k}}$ moves each point $${steps}$ places.`,
                `循环长度是 $${L}$，且 $${k} = ${Math.floor(k / L)} \\cdot ${L} + ${steps}$，所以 $\\sigma^{${k}}$ 把每个点移动 $${steps}$ 个位置。`,
              ),
            ],
            [
              ["Move along the cycle", "沿循环移动"],
              t(`Moving $${steps}$ places from $${x}$ gives $${answer}$.`, `从 $${x}$ 移动 $${steps}$ 个位置得 $${answer}$。`),
            ],
          ],
          t(
            `$\\sigma^{${k - steps}} = (\\sigma^{${L}})^{${Math.floor(k / L)}} = e$, so only the last $${steps}$ steps move $${x}$.`,
            `$\\sigma^{${k - steps}} = (\\sigma^{${L}})^{${Math.floor(k / L)}} = e$，所以只有最后 $${steps}$ 步移动 $${x}$。`,
          ),
        ),
      });
    }
  },
);

const orderFromTwoLine = point(
  "the-order-from-two-line-notation",
  ["The order from two-line notation", "由两行记法求阶"],
  [
    "The order of a permutation cannot be read directly from two-line notation. Convert it to disjoint cycles first: the order is then the least common multiple of the cycle lengths, not their sum or product, since each cycle must return at the same time.\n\nFor $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 4 & 6 & 5 & 1 & 2 & 3 \\end{pmatrix}$: $1 \\mapsto 4 \\mapsto 1$ and $2 \\mapsto 6 \\mapsto 3 \\mapsto 5 \\mapsto 2$, so it is $(1\\;4)(2\\;6\\;3\\;5)$, of order $\\operatorname{lcm}(2, 4) = 4$.\n\nCheck: after $4$ steps the $4$-cycle has gone round once and the transposition twice; after $2$ steps the $4$-cycle is only halfway.\n\n> **Watch out.** The product $2 \\cdot 4 = 8$ and the sum $2 + 4 = 6$ are both wrong here: the order is the least common multiple.",
    "置换的阶不能直接从两行记法中读出。要先转化为不相交循环：阶就是各循环长度的最小公倍数，而不是它们的和或积，因为每个循环必须同时回到原位。\n\n对 $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 4 & 6 & 5 & 1 & 2 & 3 \\end{pmatrix}$：$1 \\mapsto 4 \\mapsto 1$，$2 \\mapsto 6 \\mapsto 3 \\mapsto 5 \\mapsto 2$，所以它是 $(1\\;4)(2\\;6\\;3\\;5)$，阶为 $\\operatorname{lcm}(2, 4) = 4$。\n\n检验：走 $4$ 步后，$4$-循环转了一圈，对换转了两圈；走 $2$ 步时 $4$-循环只走了一半。\n\n> **注意。** 这里乘积 $2 \\cdot 4 = 8$ 与和 $2 + 4 = 6$ 都不对：阶是最小公倍数。",
  ],
  (rng) => {
    for (;;) {
      const n = rng.int(5, 8);
      const image = rng.shuffle(oneTo(n));
      const seen = new Set<number>();
      const cycles: number[][] = [];
      for (let start = 1; start <= n; start++) {
        if (seen.has(start)) continue;
        const cycle: number[] = [];
        let x = start;
        while (!seen.has(x)) {
          seen.add(x);
          cycle.push(x);
          x = image[x - 1] as number;
        }
        cycles.push(cycle);
      }
      const moving = cycles.filter((c) => c.length > 1);
      if (moving.length === 0) continue;
      const lengths = moving.map((c) => c.length);
      const answer = lengths.reduce(lcm, 1);
      const written = moving.map(cycleText).join("");
      const mistakes = distinctMistakes(answer, [
        why(
          lengths.reduce((a, b) => a * b, 1),
          "That multiplies the cycle lengths; the cycles first return together at their least common multiple.",
          "那是把循环长度相乘；各循环第一次同时回到原位是在最小公倍数步时。",
        ),
        why(
          lengths.reduce((a, b) => a + b, 0),
          "That adds the cycle lengths, which counts the points moved, not the steps until all return.",
          "那是把循环长度相加，数的是被移动的点，而不是全部回到原位所需的步数。",
        ),
        why(
          Math.max(...lengths),
          "That is the longest cycle alone; the shorter cycles must be back at their start too.",
          "那只是最长的循环；较短的循环也必须回到起点。",
        ),
        why(n, "That is the number of symbols; the order depends only on the cycle lengths.", "那是符号的个数；阶只取决于循环的长度。"),
        why(
          cycles.length,
          "That counts the cycles, fixed points included, rather than combining their lengths.",
          "那是数循环的个数（包括不动点），而不是把它们的长度结合起来。",
        ),
      ]);
      if (mistakes.length < 2) continue;
      const twoLine = `\\begin{pmatrix} ${oneTo(n).join(" & ")} \\\\ ${image.join(" & ")} \\end{pmatrix}`;
      return numberProblem({
        prompt: t(`Find the order of $${twoLine}$.`, `求 $${twoLine}$ 的阶。`),
        answer,
        mistakes,
        solution: walked(
          [
            [
              ["Find the cycles", "找出循环"],
              t(
                `In disjoint cycles it is $${written}$, with cycle lengths $${lengths.join(", ")}$.`,
                `写成不相交循环是 $${written}$，循环长度为 $${lengths.join(", ")}$。`,
              ),
            ],
            [
              ["Take the lcm", "取最小公倍数"],
              lengths.length === 1
                ? t(`A single cycle has order equal to its length, $${answer}$.`, `单个循环的阶等于它的长度 $${answer}$。`)
                : t(
                    `$\\operatorname{lcm}(${lengths.join(", ")}) = ${answer}$.`,
                    `$\\operatorname{lcm}(${lengths.join(", ")}) = ${answer}$。`,
                  ),
            ],
          ],
          t(
            `$${answer}$ is a multiple of every cycle length, and no smaller positive number is, so all cycles first return together after $${answer}$ steps.`,
            `$${answer}$ 是每个循环长度的倍数，且没有更小的正数如此，所以各循环在 $${answer}$ 步后第一次同时回到原位。`,
          ),
        ),
      });
    }
  },
);

const inverseOfProduct = point(
  "the-inverse-of-a-product-of-cycles",
  ["The inverse of a product of cycles", "循环之积的逆"],
  [
    "The inverse of a product reverses the order: $(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$. For cycles that overlap, this order matters. To find the image of a point, apply the inverse of the outer factor first, because that undoes the last step taken by the product.\n\nFor $\\sigma = (1\\;2\\;3)$ and $\\tau = (2\\;3\\;4)$: $\\sigma^{-1}(2) = 1$ and $\\tau^{-1}(1) = 1$, so $(\\sigma\\tau)^{-1}(2) = 1$.\n\nCheck: going forward, $\\sigma\\tau(1) = \\sigma(\\tau(1)) = \\sigma(1) = 2$, so the inverse does send $2$ back to $1$.\n\n> **Watch out.** Undoing $\\tau$ first computes $(\\tau\\sigma)^{-1}$ instead: here $\\tau^{-1}(2) = 4$ and $\\sigma^{-1}(4) = 4$, which is wrong.",
    "积的逆要颠倒次序：$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$。对有重叠的循环，这个次序很重要。求某点的像时，先用外层因子的逆，因为这撤销了积的最后一步。\n\n对 $\\sigma = (1\\;2\\;3)$ 与 $\\tau = (2\\;3\\;4)$：$\\sigma^{-1}(2) = 1$，$\\tau^{-1}(1) = 1$，所以 $(\\sigma\\tau)^{-1}(2) = 1$。\n\n检验：正向验算，$\\sigma\\tau(1) = \\sigma(\\tau(1)) = \\sigma(1) = 2$，所以逆确实把 $2$ 送回 $1$。\n\n> **注意。** 先撤销 $\\tau$ 算的是 $(\\tau\\sigma)^{-1}$：这里 $\\tau^{-1}(2) = 4$，$\\sigma^{-1}(4) = 4$，这是错的。",
  ],
  (rng) => {
    for (;;) {
      const n = 6;
      const sigma = rng.sample(oneTo(n), rng.int(3, 4));
      const tau = rng.sample(oneTo(n), rng.int(3, 4));
      const x = rng.int(1, n);
      const first = inverseCycleImage(sigma, x);
      const answer = inverseCycleImage(tau, first);
      const mistakes = distinctMistakes(answer, [
        why(
          inverseCycleImage(sigma, inverseCycleImage(tau, x)),
          "That undoes $\\tau$ first; $\\sigma$ acts last in $\\sigma\\tau$, so it must be undone first.",
          "那是先撤销 $\\tau$；在 $\\sigma\\tau$ 中 $\\sigma$ 最后作用，所以要先撤销它。",
        ),
        why(
          applyCycle(sigma, applyCycle(tau, x)),
          "That is $\\sigma\\tau$ itself, not its inverse.",
          "那是 $\\sigma\\tau$ 本身，不是它的逆。",
        ),
        why(first, "That undoes $\\sigma$ but forgets to undo $\\tau$.", "那撤销了 $\\sigma$，但忘了撤销 $\\tau$。"),
        why(x, `The product moves $${x}$, so its inverse moves it too.`, `这个积移动 $${x}$，所以它的逆也移动它。`),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `In $S_{${n}}$, let $\\sigma = ${cycleText(sigma)}$ and $\\tau = ${cycleText(tau)}$, composed from right to left. Find $(\\sigma\\tau)^{-1}(${x})$.`,
          `在 $S_{${n}}$ 中，设 $\\sigma = ${cycleText(sigma)}$，$\\tau = ${cycleText(tau)}$，从右向左复合。求 $(\\sigma\\tau)^{-1}(${x})$。`,
        ),
        answer,
        mistakes,
        solution: walked(
          [
            [
              ["Reverse the order", "颠倒次序"],
              t(
                "$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$, so undo $\\sigma$ first.",
                "$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$，所以先撤销 $\\sigma$。",
              ),
            ],
            [["Undo σ", "撤销 σ"], t(`$\\sigma^{-1}(${x}) = ${first}$.`, `$\\sigma^{-1}(${x}) = ${first}$。`)],
            [["Undo τ", "撤销 τ"], t(`$\\tau^{-1}(${first}) = ${answer}$.`, `$\\tau^{-1}(${first}) = ${answer}$。`)],
          ],
          t(
            `Going forward, $\\sigma(\\tau(${answer})) = \\sigma(${applyCycle(tau, answer)}) = ${x}$.`,
            `正向验算：$\\sigma(\\tau(${answer})) = \\sigma(${applyCycle(tau, answer)}) = ${x}$。`,
          ),
        ),
      });
    }
  },
);

const tetrahedronGeometry = point(
  "the-geometry-of-a-tetrahedron-permutation",
  ["The geometry of a tetrahedron permutation", "四面体置换的几何含义"],
  [
    "Every permutation of the four vertices of a regular tetrahedron is a symmetry, and its cycle type shows what it does in space. Three-cycles and double swaps are rotations, a single swap is a reflection, and a four-cycle combines a rotation with a reflection.\n\nFor $(1\\;3)(2\\;4)$: it moves every vertex and swaps the ends of the edges $13$ and $24$, so it is the half-turn about the axis through the midpoints of those two edges.\n\nCheck: $(1\\;3)(2\\;4)$ is a product of $2$ transpositions, so it is even, as a rotation must be.\n\n> **Watch out.** Both $(1\\;3)$ and $(1\\;3)(2\\;4)$ swap $1$ and $3$, but the single swap is odd and fixes $2$ and $4$: it is a reflection, not a rotation.",
    "正四面体四个顶点的每个置换都是对称，它的循环类型说明它在空间中的作用。三循环和两组对换是旋转，单个对换是反射，四循环则把旋转与反射结合在一起。\n\n对 $(1\\;3)(2\\;4)$：它移动每个顶点，交换棱 $13$ 与棱 $24$ 的端点，所以它是绕过这两条棱中点的轴转半圈。\n\n检验：$(1\\;3)(2\\;4)$ 是 $2$ 个对换之积，是偶置换，旋转正应如此。\n\n> **注意。** $(1\\;3)$ 与 $(1\\;3)(2\\;4)$ 都交换 $1$ 和 $3$，但单个对换是奇置换，并固定 $2$ 与 $4$：它是反射，不是旋转。",
  ],
  (rng) => {
    const v = rng.sample(oneTo(9), 4) as [number, number, number, number];
    const [a, b, c, d] = v;
    const kind = rng.int(0, 3);
    const text = [cycleText([a, b, c]), `${cycleText([a, b])}${cycleText([c, d])}`, cycleText([a, b]), cycleText([a, b, c, d])][
      kind
    ] as string;
    const options: Pair[] = [
      ["A rotation about an axis through a vertex", "绕过顶点的轴的旋转"],
      ["A half-turn about an axis through the midpoints of opposite edges", "绕过对棱中点的轴转半圈"],
      ["A reflection in a plane", "关于平面的反射"],
      ["A rotation combined with a reflection, with no fixed vertex", "旋转与反射的复合，没有不动顶点"],
    ];
    const whys: Pair[] = [
      [
        `It fixes vertex $${d}$ and cycles the other three, so it turns the solid about the axis through that vertex.`,
        `它固定顶点 $${d}$，轮换其他三个顶点，所以它绕过该顶点的轴转动立体。`,
      ],
      [
        `It swaps the endpoints of each of two opposite edges, so it is an even permutation with no fixed vertex: a half-turn through the midpoints of the edges joining $${a}, ${b}$ and $${c}, ${d}$.`,
        `它交换两条对棱的端点，是没有不动顶点的偶置换：绕连接棱 $${a}, ${b}$ 与棱 $${c}, ${d}$ 中点的轴转半圈。`,
      ],
      [
        `It swaps two vertices and fixes the other two, which is a reflection in the plane through $${c}$, $${d}$ and the midpoint of the edge joining $${a}$ and $${b}$.`,
        `它交换两个顶点并固定另外两个，这是关于过 $${c}$，$${d}$ 和棱 $${a}, ${b}$ 中点的平面的反射。`,
      ],
      [
        `A four-cycle is an odd permutation, so it reverses orientation, but it fixes no vertex, so it is not a plain reflection.`,
        `四循环是奇置换，所以它改变定向，但没有不动顶点，所以不是单纯的反射。`,
      ],
    ];
    const option = options[kind] as Pair;
    const fixedCount = [1, 0, 2, 0][kind] as number;
    const parity = [t("even", "偶"), t("even", "偶"), t("odd", "奇"), t("odd", "奇")][kind] as Text;
    const reasons: Reason[] = [
      [
        options[0]![0],
        "A rotation about an axis through a vertex fixes that vertex and is a $3$-cycle of the other three; this permutation is not.",
        "绕过顶点的轴的旋转固定该顶点，并是其余三个顶点的 $3$-循环；这个置换不是。",
      ],
      [
        options[1]![0],
        "A half-turn through edge midpoints is a product of two disjoint swaps; this permutation is not.",
        "绕对棱中点的半圈旋转是两个不相交对换之积；这个置换不是。",
      ],
      [
        options[2]![0],
        "A reflection swaps exactly two vertices and fixes the other two; this permutation does not.",
        "反射恰好交换两个顶点并固定另外两个；这个置换不是这样。",
      ],
      [
        options[3]![0],
        "That needs a $4$-cycle, which moves every vertex and is odd; this permutation is not one.",
        "那需要一个 $4$-循环，它移动每个顶点且是奇置换；这个置换不是。",
      ],
    ];
    return reasoned(
      choose(
        rng,
        [
          `The vertices of a regular tetrahedron are labeled $${v.join(", ")}$. What does the vertex permutation $${text}$ do geometrically?`,
          `正四面体的顶点标为 $${v.join(", ")}$。顶点置换 $${text}$ 在几何上起什么作用？`,
        ],
        option,
        options.filter((o) => o !== option),
        asPair(
          walked(
            [
              [
                ["Read the cycle type", "读循环类型"],
                t(
                  `$${text}$ fixes $${fixedCount}$ ${fixedCount === 1 ? "vertex" : "vertices"} and is ${parity.en}.`,
                  `$${text}$ 固定 $${fixedCount}$ 个顶点，是${parity["zh-CN"]}置换。`,
                ),
              ],
              [["Match the motion", "对应运动"], t(...(whys[kind] as Pair))],
            ],
            t(
              `Rotations are exactly the even permutations, and $${text}$ is ${parity.en}, so it ${kind < 2 ? "is" : "is not"} a rotation, as the answer says.`,
              `旋转恰是偶置换，而 $${text}$ 是${parity["zh-CN"]}置换，所以它${kind < 2 ? "是" : "不是"}旋转，与答案一致。`,
            ),
          ),
        ),
      ),
      reasons,
    );
  },
);

const cubeFixedVertices = {
  ...point(
    "the-vertices-a-cube-symmetry-fixes",
    ["The vertices a cube symmetry fixes", "立方体对称固定的顶点"],
    [
      "A vertex of the cube $[-1, 1]^{3}$ is a point with coordinates $\\pm 1$. A symmetry written as a map of coordinates fixes such a vertex when the resulting equations hold, and the equations may have several solutions, one solution or none.\n\nFor $(x, y, z) \\mapsto (y, x, z)$ the equations are $y = x$, $x = y$ and $z = z$: $x = y$ with $z$ free, so the $4$ vertices $(1, 1, 1)$, $(1, 1, -1)$, $(-1, -1, 1)$ and $(-1, -1, -1)$ are fixed.\n\nCheck: the map sends $(1, 1, -1)$ to $(1, 1, -1)$, while it sends $(1, -1, 1)$ to $(-1, 1, 1)$, a different vertex.\n\n> **Watch out.** An equation such as $-x = x$ forces $x = 0$, which no vertex has, so then no vertex is fixed at all, even if the other equations are easy.",
      "立方体 $[-1, 1]^{3}$ 的顶点是坐标为 $\\pm 1$ 的点。写成坐标映射的对称，在所得方程成立时固定这样的顶点，方程可能有多个解、一个解或无解。\n\n对 $(x, y, z) \\mapsto (y, x, z)$，方程为 $y = x$、$x = y$ 与 $z = z$：$x = y$，$z$ 任意，所以 $(1, 1, 1)$、$(1, 1, -1)$、$(-1, -1, 1)$、$(-1, -1, -1)$ 这 $4$ 个顶点不动。\n\n检验：该映射把 $(1, 1, -1)$ 送到 $(1, 1, -1)$，而把 $(1, -1, 1)$ 送到另一个顶点 $(-1, 1, 1)$。\n\n> **注意。** 像 $-x = x$ 这样的方程迫使 $x = 0$，而没有顶点满足它，所以这时根本没有不动顶点，即使其他方程很容易满足。",
    ],
    (rng) => {
      const f = randomSigned(rng);
      const vertices: number[][] = [];
      for (const x of [1, -1]) for (const y of [1, -1]) for (const z of [1, -1]) vertices.push([x, y, z]);
      const fixed = vertices.filter((v) => applySigned(f, v).every((c, i) => c === v[i]));
      const answer = fixed.length;
      const alone = [0, 1, 2].filter((i) => f.perm[i] === i && f.sign[i] === 1).length;
      const equations = [0, 1, 2]
        .map((i) => `${(f.sign[i] as number) < 0 ? "-" : ""}${"xyz"[f.perm[i] as number]} = ${"xyz"[i]}`)
        .join(", \\; ");
      const mistakes = distinctMistakes(answer, [
        why(8 - answer, "That counts the vertices that move, not the ones that stay.", "那数的是移动的顶点，而不是不动的顶点。"),
        why(8, "Not every vertex satisfies the equations; check them at each vertex.", "并非每个顶点都满足这些方程；要逐个顶点检验。"),
        why(
          2 ** alone,
          "That only lets the coordinates the map leaves alone vary freely, forgetting the conditions from the coordinates it moves.",
          "那只让映射不动的坐标自由取值，忘了被移动的坐标带来的条件。",
        ),
        why(
          1,
          "Only the center is sure to be fixed, but the center is not a vertex; the vertices fixed come in pairs $v$ and $-v$.",
          "只有中心一定不动，但中心不是顶点；不动的顶点总是成对出现，即 $v$ 与 $-v$。",
        ),
      ]);
      const image = applySigned(f, [1, 1, 1]);
      return numberProblem({
        prompt: t(
          `The cube $[-1, 1]^{3}$ has the symmetry $${signedText(f)}$. How many of its $8$ vertices does this symmetry fix?`,
          `立方体 $[-1, 1]^{3}$ 有对称 $${signedText(f)}$。这个对称固定 $8$ 个顶点中的多少个？`,
        ),
        answer,
        mistakes,
        solution: walked(
          [
            [["Write the equations", "列方程"], t(`A vertex is fixed when $${equations}$.`, `顶点不动当且仅当 $${equations}$。`)],
            [
              ["Solve over the vertices", "在顶点中求解"],
              answer === 0
                ? t(
                    "No point with coordinates $\\pm 1$ satisfies all of them, so no vertex is fixed.",
                    "没有坐标为 $\\pm 1$ 的点同时满足它们，所以没有不动顶点。",
                  )
                : t(
                    `The solutions are $${fixed.map(tuple).join(", ")}$: $${answer}$ ${answer === 1 ? "vertex" : "vertices"}.`,
                    `解为 $${fixed.map(tuple).join(", ")}$：共 $${answer}$ 个顶点。`,
                  ),
            ],
          ],
          answer === 0
            ? t(
                `For example $(1, 1, 1)$ goes to $${tuple(image)}$, a different vertex.`,
                `例如 $(1, 1, 1)$ 被送到另一个顶点 $${tuple(image)}$。`,
              )
            : t(
                `The map sends $${tuple(fixed[0] as number[])}$ to $${tuple(applySigned(f, fixed[0] as number[]))}$, the same vertex.`,
                `该映射把 $${tuple(fixed[0] as number[])}$ 送到 $${tuple(applySigned(f, fixed[0] as number[]))}$，即同一个顶点。`,
              ),
        ),
      });
    },
  ),
  figure: algebraDrawings1["the-symmetry-group-of-a-cube-rotations-and-reflections#the-vertices-a-cube-symmetry-fixes"],
};

const cubeConjugate = point(
  "a-conjugate-of-a-cube-symmetry",
  ["A conjugate of a cube symmetry", "立方体对称的共轭"],
  [
    "The conjugate $\\sigma\\rho\\sigma^{-1}$ acts from right to left: undo $\\sigma$, apply $\\rho$, then redo $\\sigma$. It is the same kind of motion as $\\rho$, seen from a position moved by $\\sigma$, and in general it differs from $\\rho$ because the group is not abelian.\n\nFor $\\rho: (x, y, z) \\mapsto (x, y, -z)$ and $\\sigma: (x, y, z) \\mapsto (y, z, x)$ at $(1, 2, 3)$: $\\sigma^{-1}(1, 2, 3) = (3, 1, 2)$, then $\\rho$ gives $(3, 1, -2)$, then $\\sigma$ gives $(1, -2, 3)$.\n\nCheck: $\\sigma(3, 1, 2) = (1, 2, 3)$, so the first step is right; and the result negates only the $y$-coordinate, a reflection like $\\rho$.\n\n> **Watch out.** $\\sigma\\rho\\sigma^{-1}$ is not $\\rho$: here $\\rho(1, 2, 3) = (1, 2, -3)$, which differs from $(1, -2, 3)$.",
    "共轭 $\\sigma\\rho\\sigma^{-1}$ 从右向左作用：先撤销 $\\sigma$，再作用 $\\rho$，然后再作用 $\\sigma$。它与 $\\rho$ 是同一类运动，只是从被 $\\sigma$ 移动过的位置看，一般与 $\\rho$ 不同，因为这个群不是阿贝尔群。\n\n对 $\\rho: (x, y, z) \\mapsto (x, y, -z)$ 与 $\\sigma: (x, y, z) \\mapsto (y, z, x)$，在 $(1, 2, 3)$ 处：$\\sigma^{-1}(1, 2, 3) = (3, 1, 2)$，再由 $\\rho$ 得 $(3, 1, -2)$，再由 $\\sigma$ 得 $(1, -2, 3)$。\n\n检验：$\\sigma(3, 1, 2) = (1, 2, 3)$，所以第一步是对的；结果只把 $y$ 坐标变号，与 $\\rho$ 一样是反射。\n\n> **注意。** $\\sigma\\rho\\sigma^{-1}$ 不是 $\\rho$：这里 $\\rho(1, 2, 3) = (1, 2, -3)$，与 $(1, -2, 3)$ 不同。",
  ],
  (rng) => {
    for (;;) {
      const rho = randomSigned(rng);
      const sigma = randomSigned(rng);
      const p = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
      const a = applySignedInverse(sigma, p);
      const b = applySigned(rho, a);
      const c = applySigned(sigma, b);
      const answer = c[0] as number;
      const mistakes = distinctMistakes(answer, [
        why(
          applySigned(rho, p)[0] as number,
          "That applies $\\rho$ alone; conjugating by $\\sigma$ usually changes the map.",
          "那只作用了 $\\rho$；用 $\\sigma$ 共轭通常会改变这个映射。",
        ),
        why(
          applySignedInverse(sigma, applySigned(rho, applySigned(sigma, p)))[0] as number,
          "That is $\\sigma^{-1}\\rho\\sigma$: it applies $\\sigma$ first instead of $\\sigma^{-1}$.",
          "那是 $\\sigma^{-1}\\rho\\sigma$：它先作用 $\\sigma$，而不是 $\\sigma^{-1}$。",
        ),
        why(
          b[0] as number,
          "That stops after $\\rho$ and leaves out the last step, $\\sigma$.",
          "那在作用 $\\rho$ 后就停了，漏掉了最后一步 $\\sigma$。",
        ),
        why(
          applySigned(sigma, applySigned(rho, applySigned(sigma, p)))[0] as number,
          "That applies $\\sigma$ at the start instead of undoing it.",
          "那在开头作用了 $\\sigma$，而不是撤销它。",
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `Let $\\rho: ${signedText(rho)}$ and $\\sigma: ${signedText(sigma)}$ be symmetries of the cube. Find the first coordinate of $\\sigma\\rho\\sigma^{-1}${tuple(p)}$, composing from right to left.`,
          `设 $\\rho: ${signedText(rho)}$ 和 $\\sigma: ${signedText(sigma)}$ 是立方体的对称。从右向左复合，求 $\\sigma\\rho\\sigma^{-1}${tuple(p)}$ 的第一个坐标。`,
        ),
        answer,
        mistakes,
        solution: walked(
          [
            [["Undo σ", "撤销 σ"], t(`$\\sigma^{-1}${tuple(p)} = ${tuple(a)}$.`, `$\\sigma^{-1}${tuple(p)} = ${tuple(a)}$。`)],
            [["Apply ρ", "作用 ρ"], t(`$\\rho${tuple(a)} = ${tuple(b)}$.`, `$\\rho${tuple(a)} = ${tuple(b)}$。`)],
            [
              ["Redo σ", "再作用 σ"],
              t(
                `$\\sigma${tuple(b)} = ${tuple(c)}$, whose first coordinate is $${answer}$.`,
                `$\\sigma${tuple(b)} = ${tuple(c)}$，第一个坐标是 $${answer}$。`,
              ),
            ],
          ],
          t(
            `$\\sigma${tuple(a)} = ${tuple(applySigned(sigma, a))}$, the starting point, so the first step undid $\\sigma$ correctly.`,
            `$\\sigma${tuple(a)} = ${tuple(applySigned(sigma, a))}$，正是起点，所以第一步正确地撤销了 $\\sigma$。`,
          ),
        ),
      });
    }
  },
);

const directComponent = point(
  "the-component-in-an-internal-direct-sum",
  ["The component in an internal direct sum", "内直和中的分量"],
  [
    "If $\\mathbb{Z}_{n}$ is the internal direct sum of two subgroups, each element splits uniquely into one part from each subgroup. Finding the part is a Chinese remainder problem: it is a multiple of one generator, and it agrees with the element modulo the other.\n\nIn $\\mathbb{Z}_{77} = \\langle 7 \\rangle \\oplus \\langle 11 \\rangle$, split $30$. The part $h$ is a multiple of $7$ with $h \\equiv 30 \\equiv 8 \\pmod{11}$, which gives $h = 63$, and then $t = 30 - 63 = -33 \\equiv 44$.\n\nCheck: $63 + 44 = 107 = 77 + 30$, with $63 = 9 \\cdot 7$ and $44 = 4 \\cdot 11$.\n\n> **Watch out.** Match the element modulo the other generator, not modulo the part's own one: every multiple of $7$ is $0$ modulo $7$, so that condition says nothing.",
    "如果 $\\mathbb{Z}_{n}$ 是两个子群的内直和，那么每个元素都可以唯一地分解为每个子群中的一部分。求这一部分是一个中国剩余定理问题：它是一个生成元的倍数，并且模另一个生成元与该元素同余。\n\n在 $\\mathbb{Z}_{77} = \\langle 7 \\rangle \\oplus \\langle 11 \\rangle$ 中分解 $30$。部分 $h$ 是 $7$ 的倍数且 $h \\equiv 30 \\equiv 8 \\pmod{11}$，得 $h = 63$，于是 $t = 30 - 63 = -33 \\equiv 44$。\n\n检验：$63 + 44 = 107 = 77 + 30$，且 $63 = 9 \\cdot 7$，$44 = 4 \\cdot 11$。\n\n> **注意。** 要模另一个生成元与该元素同余，而不是模这一部分自己的生成元：$7$ 的每个倍数模 $7$ 都是 $0$，这个条件什么也说明不了。",
  ],
  (rng) => {
    const [m, k] = rng.pick([
      [3, 4],
      [3, 5],
      [4, 5],
      [3, 7],
      [4, 7],
      [5, 6],
      [5, 7],
      [7, 8],
      [2, 9],
      [5, 8],
    ] as const);
    const n = m * k;
    // An element of either subgroup would already be its own decomposition.
    const x = rng.pick(Array.from({ length: n - 1 }, (_, i) => i + 1).filter((v) => v % m !== 0 && v % k !== 0));
    let h = 0;
    while (h % m !== 0 || (h - x) % k !== 0) h++;
    const other = (((x - h) % n) + n) % n;
    const mistakes = [
      why(other, `That is $t$, the part in $\\langle ${k} \\rangle$.`, `那是 $t$，即 $\\langle ${k} \\rangle$ 中的部分。`),
      why(
        x,
        `$${x}$ is not a multiple of $${m}$, so it is not in $\\langle ${m} \\rangle$.`,
        `$${x}$ 不是 $${m}$ 的倍数，所以不在 $\\langle ${m} \\rangle$ 中。`,
      ),
      why(
        x % m,
        `That is $${x}$ modulo $${m}$; $h$ must be a multiple of $${m}$ that agrees with $${x}$ modulo $${k}$.`,
        `那是 $${x}$ 模 $${m}$ 的余数；$h$ 应是 $${m}$ 的倍数，且模 $${k}$ 与 $${x}$ 同余。`,
      ),
    ].filter((w, i, all) => w.value !== h && all.findIndex((o) => o.value === w.value) === i);
    const sumText = h + other === x ? `${x}` : `${h + other} = ${n} + ${x}`;
    return numberProblem({
      prompt: t(
        `In $\\mathbb{Z}_{${n}}$, every element is uniquely $h + t$ with $h \\in \\langle ${m} \\rangle$ and $t \\in \\langle ${k} \\rangle$. Find $h$ for the element $${x}$, as a value from $0$ to $${n - 1}$.`,
        `在 $\\mathbb{Z}_{${n}}$ 中，每个元素都可唯一地写成 $h + t$，其中 $h \\in \\langle ${m} \\rangle$，$t \\in \\langle ${k} \\rangle$。对元素 $${x}$，求 $h$，取值范围为 $0$ 到 $${n - 1}$。`,
      ),
      answer: h,
      mistakes,
      solution: walked(
        [
          [
            ["Set up the conditions", "列出条件"],
            t(
              `$h$ must be a multiple of $${m}$ with $h \\equiv ${x} \\equiv ${x % k} \\pmod{${k}}$.`,
              `$h$ 必须是 $${m}$ 的倍数，且 $h \\equiv ${x} \\equiv ${x % k} \\pmod{${k}}$。`,
            ),
          ],
          [
            ["Search the multiples", "在倍数中查找"],
            t(
              `Among $0, ${m}, ${2 * m}, \\dots$ the first with remainder $${x % k}$ modulo $${k}$ is $h = ${h}$.`,
              `在 $0, ${m}, ${2 * m}, \\dots$ 中，第一个模 $${k}$ 余 $${x % k}$ 的是 $h = ${h}$。`,
            ),
          ],
        ],
        t(
          `Then $t = ${other}$ is a multiple of $${k}$, and $${h} + ${other} = ${sumText}$.`,
          `这时 $t = ${other}$ 是 $${k}$ 的倍数，且 $${h} + ${other} = ${sumText}$。`,
        ),
      ),
    });
  },
);

const cosetOrder = point(
  "the-order-of-a-coset-in-a-quotient",
  ["The order of a coset in a quotient", "商群中陪集的阶"],
  [
    "A coset $a + H$ can have a smaller order in the quotient than $a$ has in the group, since it is enough for a multiple of $a$ to land in $H$. With $H = \\langle d \\rangle$ and $d \\mid n$, the order is $\\frac{d}{\\gcd(a, d)}$.\n\nIn $\\mathbb{Z}_{180}/\\langle 45 \\rangle$, the coset $30 + \\langle 45 \\rangle$ has order $\\frac{45}{\\gcd(30, 45)} = \\frac{45}{15} = 3$, although $30$ has order $6$ in $\\mathbb{Z}_{180}$.\n\nCheck: $3 \\cdot 30 = 90 = 2 \\cdot 45$ lies in $\\langle 45 \\rangle$, while $30$ and $60$ do not.\n\n> **Watch out.** Divide $d$, not $n$, by the gcd: $\\frac{180}{\\gcd(30, 180)} = 6$ is the order of $30$ in the group, not of its coset.",
    "陪集 $a + H$ 在商群中的阶可能小于 $a$ 在群中的阶，因为只要 $a$ 的某个倍数落入 $H$ 就够了。当 $H = \\langle d \\rangle$ 且 $d \\mid n$ 时，阶是 $\\frac{d}{\\gcd(a, d)}$。\n\n在 $\\mathbb{Z}_{180}/\\langle 45 \\rangle$ 中，陪集 $30 + \\langle 45 \\rangle$ 的阶是 $\\frac{45}{\\gcd(30, 45)} = \\frac{45}{15} = 3$，尽管 $30$ 在 $\\mathbb{Z}_{180}$ 中的阶是 $6$。\n\n检验：$3 \\cdot 30 = 90 = 2 \\cdot 45$ 在 $\\langle 45 \\rangle$ 中，而 $30$ 与 $60$ 不在。\n\n> **注意。** 要用 $d$ 而不是 $n$ 除以最大公因数：$\\frac{180}{\\gcd(30, 180)} = 6$ 是 $30$ 在群中的阶，不是它的陪集的阶。",
  ],
  (rng) => {
    const d = rng.int(4, 18);
    const n = d * rng.int(2, 6);
    const a = rng.int(1, n - 1);
    const g = gcd(a, d);
    const answer = d / g;
    const mistakes = [
      why(
        n / gcd(a, n),
        `That is the order of $${a}$ in $\\mathbb{Z}_{${n}}$; the coset only needs a multiple to land in $\\langle ${d} \\rangle$.`,
        `那是 $${a}$ 在 $\\mathbb{Z}_{${n}}$ 中的阶；陪集只需某个倍数落入 $\\langle ${d} \\rangle$。`,
      ),
      why(
        d,
        `That is the order of the whole quotient; divide it by $\\gcd(${a}, ${d})$.`,
        `那是整个商群的阶；还要除以 $\\gcd(${a}, ${d})$。`,
      ),
      why(
        g,
        `That is $\\gcd(${a}, ${d})$ itself; the order is $${d}$ divided by it.`,
        `那是 $\\gcd(${a}, ${d})$ 本身；阶是 $${d}$ 除以它。`,
      ),
    ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i);
    return numberProblem({
      prompt: t(
        `In $\\mathbb{Z}_{${n}}/\\langle ${d} \\rangle$, find the order of the coset $${a} + \\langle ${d} \\rangle$.`,
        `在 $\\mathbb{Z}_{${n}}/\\langle ${d} \\rangle$ 中，求陪集 $${a} + \\langle ${d} \\rangle$ 的阶。`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Say what the order means", "说明阶的含义"],
            t(
              `We need the smallest $t > 0$ with $${a === 1 ? "t" : `t \\cdot ${a}`}$ a multiple of $${d}$.`,
              `需要使 $${a === 1 ? "t" : `t \\cdot ${a}`}$ 为 $${d}$ 的倍数的最小 $t > 0$。`,
            ),
          ],
          [
            ["Use the gcd", "利用最大公因数"],
            t(
              `Since $\\gcd(${a}, ${d}) = ${g}$, that is $t = \\frac{${d}}{${g}} = ${answer}$.`,
              `由于 $\\gcd(${a}, ${d}) = ${g}$，所以 $t = \\frac{${d}}{${g}} = ${answer}$。`,
            ),
          ],
        ],
        answer === 1
          ? t(
              `$${a}$ is already a multiple of $${d}$, so the coset is $\\langle ${d} \\rangle$ itself.`,
              `$${a}$ 已经是 $${d}$ 的倍数，所以这个陪集就是 $\\langle ${d} \\rangle$ 本身。`,
            )
          : t(
              `$${a === 1 ? `${answer}` : `${answer} \\cdot ${a} = ${answer * a}`}$ is a multiple of $${d}$, and no smaller positive multiple of $${a}$ is.`,
              `$${a === 1 ? `${answer}` : `${answer} \\cdot ${a} = ${answer * a}`}$ 是 $${d}$ 的倍数，而 $${a}$ 更小的正倍数都不是。`,
            ),
      ),
    });
  },
);

const rationalCosetOrder = point(
  "the-order-of-a-coset-of-the-integers-in-the-rationals",
  ["The order of a coset of the integers in the rationals", "有理数中整数陪集的阶"],
  [
    "The group $\\mathbb{Q}/\\mathbb{Z}$ is infinite, yet every element has finite order, because a multiple of any fraction is an integer. The order is the denominator in lowest terms, so a fraction must be reduced before the order can be read off.\n\nThe coset $\\frac{84}{120} + \\mathbb{Z}$ has order $10$, because $\\gcd(84, 120) = 12$ and $\\frac{84}{120} = \\frac{7}{10}$.\n\nCheck: $10 \\cdot \\frac{7}{10} = 7$ is an integer, while $5 \\cdot \\frac{7}{10} = 3.5$ is not.\n\n> **Watch out.** The order is never the unreduced denominator $120$, and an integer part changes nothing: $\\frac{130}{60} + \\mathbb{Z} = \\frac{13}{6} + \\mathbb{Z} = \\frac{1}{6} + \\mathbb{Z}$ has order $6$.",
    "群 $\\mathbb{Q}/\\mathbb{Z}$ 是无限的，但每个元素的阶都有限，因为任何分数的某个倍数都是整数。阶是最简分数的分母，所以必须先约分才能读出阶。\n\n陪集 $\\frac{84}{120} + \\mathbb{Z}$ 的阶是 $10$，因为 $\\gcd(84, 120) = 12$，$\\frac{84}{120} = \\frac{7}{10}$。\n\n检验：$10 \\cdot \\frac{7}{10} = 7$ 是整数，而 $5 \\cdot \\frac{7}{10} = 3.5$ 不是。\n\n> **注意。** 阶绝不是未约分的分母 $120$，整数部分也不影响阶：$\\frac{130}{60} + \\mathbb{Z} = \\frac{13}{6} + \\mathbb{Z} = \\frac{1}{6} + \\mathbb{Z}$ 的阶是 $6$。",
  ],
  (rng) => {
    const q = rng.int(4, 60);
    const p = rng.int(1, 3 * q);
    const g = gcd(p, q);
    const reduced = q / g;
    const mistakes = [
      why(q, "That is the denominator before reducing the fraction.", "那是约分前的分母。"),
      why(p / g, "That is the numerator in lowest terms; the order is the denominator.", "那是约分后的分子；阶是分母。"),
      why(g, `That is $\\gcd(${p}, ${q})$, the factor that cancels.`, `那是约去的因数 $\\gcd(${p}, ${q})$。`),
      why(p, "That is the numerator.", "那是分子。"),
    ].filter((w, i, all) => w.value !== reduced && all.findIndex((o) => o.value === w.value) === i);
    const lowest = reduced === 1 ? `${p / g}` : `\\frac{${p / g}}{${reduced}}`;
    return numberProblem({
      prompt: t(
        `Find the order of the coset $\\frac{${p}}{${q}} + \\mathbb{Z}$ in $\\mathbb{Q}/\\mathbb{Z}$.`,
        `求陪集 $\\frac{${p}}{${q}} + \\mathbb{Z}$ 在 $\\mathbb{Q}/\\mathbb{Z}$ 中的阶。`,
      ),
      answer: reduced,
      mistakes,
      solution: walked(
        [
          [
            ["Reduce the fraction", "约分"],
            t(
              `$\\gcd(${p}, ${q}) = ${g}$, so $\\frac{${p}}{${q}} = ${lowest}$.`,
              `$\\gcd(${p}, ${q}) = ${g}$，所以 $\\frac{${p}}{${q}} = ${lowest}$。`,
            ),
          ],
          [
            ["Read off the denominator", "读出分母"],
            reduced === 1
              ? t(
                  "The fraction is an integer, so the coset is $\\mathbb{Z}$ itself and has order $1$.",
                  "这个分数是整数，所以陪集就是 $\\mathbb{Z}$ 本身，阶为 $1$。",
                )
              : t(`The order is the denominator in lowest terms, $${reduced}$.`, `阶是最简分数的分母 $${reduced}$。`),
          ],
        ],
        reduced === 1
          ? t(
              `$\\frac{${p}}{${q}} = ${p / q}$, and an integer lies in $\\mathbb{Z}$.`,
              `$\\frac{${p}}{${q}} = ${p / q}$，而整数属于 $\\mathbb{Z}$。`,
            )
          : t(
              `$${reduced} \\cdot ${lowest} = ${p / g}$ is an integer, and no smaller positive multiple is, since $${p / g}$ and $${reduced}$ are coprime.`,
              `$${reduced} \\cdot ${lowest} = ${p / g}$ 是整数，又因 $${p / g}$ 与 $${reduced}$ 互素，没有更小的正倍数是整数。`,
            ),
      ),
    });
  },
);

const cosetEntry = point(
  "an-entry-of-a-matrix-in-a-coset",
  ["An entry of a matrix in a coset", "陪集中矩阵的元素"],
  [
    "Two matrices of $GL(2, \\mathbb{R})$ lie in the same coset of $SL(2, \\mathbb{R})$ exactly when they have the same determinant. So membership in a coset is a single equation, which can be solved for a missing entry of a matrix.\n\nIf $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 3 \\end{pmatrix}$, then $\\det A = 9 - 2 = 7$, so $\\begin{pmatrix} x & 2 \\\\ 5 & 4 \\end{pmatrix}$ lies in $A \\cdot SL(2, \\mathbb{R})$ when $4x - 10 = 7$, that is $x = \\frac{17}{4}$.\n\nCheck: $\\frac{17}{4} \\cdot 4 - 2 \\cdot 5 = 17 - 10 = 7$.\n\n> **Watch out.** The coset $A \\cdot SL(2, \\mathbb{R})$ is made of the matrices with determinant $\\det A$, not $1$; only $SL(2, \\mathbb{R})$ itself has determinant $1$.",
    "$GL(2, \\mathbb{R})$ 中的两个矩阵属于 $SL(2, \\mathbb{R})$ 的同一个陪集，当且仅当它们的行列式相同。所以属于某个陪集只是一个方程，可以解出矩阵中缺少的元素。\n\n若 $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 3 \\end{pmatrix}$，则 $\\det A = 9 - 2 = 7$，所以当 $4x - 10 = 7$，即 $x = \\frac{17}{4}$ 时，$\\begin{pmatrix} x & 2 \\\\ 5 & 4 \\end{pmatrix}$ 属于 $A \\cdot SL(2, \\mathbb{R})$。\n\n检验：$\\frac{17}{4} \\cdot 4 - 2 \\cdot 5 = 17 - 10 = 7$。\n\n> **注意。** 陪集 $A \\cdot SL(2, \\mathbb{R})$ 由行列式为 $\\det A$ 的矩阵组成，不是行列式为 $1$ 的；只有 $SL(2, \\mathbb{R})$ 本身的行列式为 $1$。",
  ],
  (rng) => {
    let a = rng.int(-5, 6);
    const b = rng.int(-5, 5);
    const c = rng.int(-5, 5);
    const d = rng.int(1, 6);
    if (a * d === b * c) a += 1;
    const det = a * d - b * c;
    const p = rng.int(-5, 5);
    const q = rng.int(-5, 5);
    const r = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
    const answer = Q.of(det + p * q, r);
    const mistakes = [
      why(
        Q.of(p * q + 1, r),
        "That gives determinant $1$, which puts the matrix in $SL(2, \\mathbb{R})$, not in this coset.",
        "那使行列式为 $1$，矩阵落在 $SL(2, \\mathbb{R})$ 中，而不是这个陪集中。",
      ),
      why(
        Q.of(det - p * q, r),
        `Sign slip: $${r}x - (${p})(${q}) = ${det}$ gives $${r}x = ${det} + (${p})(${q})$.`,
        `符号错误：$${r}x - (${p})(${q}) = ${det}$ 得 $${r}x = ${det} + (${p})(${q})$。`,
      ),
      why(Q.of(det, 1), "That is $\\det A$ itself, not the entry $x$.", "那是 $\\det A$ 本身，不是元素 $x$。"),
    ].filter((w, i, all) => {
      const asQ = (v: typeof w.value) => (typeof v === "number" ? Q.of(v) : v);
      return !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i;
    });
    return numberProblem({
      prompt: t(
        `Let $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$. Find the value of $x$ for which $\\begin{pmatrix} x & ${p} \\\\ ${q} & ${r} \\end{pmatrix}$ lies in $A \\cdot SL(2, \\mathbb{R})$.`,
        `设 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$。求 $x$ 的值，使 $\\begin{pmatrix} x & ${p} \\\\ ${q} & ${r} \\end{pmatrix}$ 属于 $A \\cdot SL(2, \\mathbb{R})$。`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Find the determinant of the coset", "求陪集的行列式"],
            t(`$\\det A = (${a})(${d}) - (${b})(${c}) = ${det}$.`, `$\\det A = (${a})(${d}) - (${b})(${c}) = ${det}$。`),
          ],
          [
            ["Solve for the entry", "解出元素"],
            t(
              `$${r}x - (${p})(${q}) = ${det}$, so $${r}x = ${det + p * q}$ and $x = ${answer.toLatex()}$.`,
              `$${r}x - (${p})(${q}) = ${det}$，所以 $${r}x = ${det + p * q}$，$x = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$(${answer.toLatex()})(${r}) - (${p})(${q}) = ${det + p * q} - (${p * q}) = ${det}$, which matches $\\det A$.`,
          `$(${answer.toLatex()})(${r}) - (${p})(${q}) = ${det + p * q} - (${p * q}) = ${det}$，与 $\\det A$ 相同。`,
        ),
      ),
    });
  },
);

const cosetCount = point(
  "the-number-of-cosets-of-a-permutation-subgroup",
  ["The number of cosets of a permutation subgroup", "置换子群的陪集个数"],
  [
    "Lagrange's theorem counts the cosets without listing them: their number is the order of the group divided by the order of the subgroup. The subgroup generated by a permutation has order equal to the least common multiple of the lengths of its disjoint cycles.\n\nIn $S_{10}$, $H = \\langle (1\\;2\\;3)(4\\;5\\;6\\;7) \\rangle$ has order $\\operatorname{lcm}(3, 4) = 12$, so it has $\\frac{10!}{12} = \\frac{3628800}{12} = 302400$ left cosets.\n\nCheck: $302400 \\cdot 12 = 3628800 = 10!$.\n\n> **Watch out.** Use the least common multiple of the cycle lengths, not their product: $(1\\;2)(3\\;4)$ has order $2$, not $4$.",
    "拉格朗日定理不必列出陪集就能计数：陪集的个数等于群的阶除以子群的阶。由一个置换生成的子群，其阶等于该置换各不相交循环长度的最小公倍数。\n\n在 $S_{10}$ 中，$H = \\langle (1\\;2\\;3)(4\\;5\\;6\\;7) \\rangle$ 的阶是 $\\operatorname{lcm}(3, 4) = 12$，所以它有 $\\frac{10!}{12} = \\frac{3628800}{12} = 302400$ 个左陪集。\n\n检验：$302400 \\cdot 12 = 3628800 = 10!$。\n\n> **注意。** 要用各循环长度的最小公倍数，而不是它们的乘积：$(1\\;2)(3\\;4)$ 的阶是 $2$，不是 $4$。",
  ],
  (rng) => {
    const lengths = rng.pick([[3], [4], [5], [2, 2], [2, 3], [3, 3], [2, 4], [2, 5], [3, 4], [2, 2, 2], [6]] as const);
    const least = lengths.reduce((a, b) => a + b, 0);
    const n = rng.int(Math.max(least, 4), 8);
    const labels = rng.shuffle(oneTo(n));
    let at = 0;
    const cycles = lengths.map((l) => {
      const c = labels.slice(at, at + l);
      at += l;
      return c;
    });
    const order = lengths.reduce<number>(lcm, 1);
    const answer = factorial(n) / order;
    const text = cycles.map(cycleText).join("");
    const product = lengths.reduce<number>((a, b) => a * b, 1);
    const mistakes = [
      why(factorial(n), `That is $|S_{${n}}| = ${n}!$; divide it by $|H|$.`, `那是 $|S_{${n}}| = ${n}!$；还要除以 $|H|$。`),
      why(order, "That is $|H|$, not the number of its cosets.", "那是 $|H|$，不是陪集的个数。"),
      why(
        factorial(n) / product,
        "That divides by the product of the cycle lengths; the order of the generator is their least common multiple.",
        "那是除以各循环长度的乘积；生成元的阶是它们的最小公倍数。",
      ),
    ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i);
    return numberProblem({
      prompt: t(
        `How many left cosets does $H = \\langle ${text} \\rangle$ have in $S_{${n}}$?`,
        `$H = \\langle ${text} \\rangle$ 在 $S_{${n}}$ 中有多少个左陪集？`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Find the order of the generator", "求生成元的阶"],
            lengths.length === 1
              ? t(
                  `A cycle of length $${order}$ has order $${order}$, so $|H| = ${order}$.`,
                  `长度为 $${order}$ 的循环的阶是 $${order}$，所以 $|H| = ${order}$。`,
                )
              : t(
                  `The order is $\\operatorname{lcm}(${lengths.join(", ")}) = ${order}$, so $|H| = ${order}$.`,
                  `阶是 $\\operatorname{lcm}(${lengths.join(", ")}) = ${order}$，所以 $|H| = ${order}$。`,
                ),
          ],
          [
            ["Divide by Lagrange's theorem", "用拉格朗日定理相除"],
            t(
              `The number of cosets is $\\frac{${n}!}{${order}} = \\frac{${factorial(n)}}{${order}} = ${answer}$.`,
              `陪集个数是 $\\frac{${n}!}{${order}} = \\frac{${factorial(n)}}{${order}} = ${answer}$。`,
            ),
          ],
        ],
        t(`$${answer} \\cdot ${order} = ${factorial(n)} = ${n}!$.`, `$${answer} \\cdot ${order} = ${factorial(n)} = ${n}!$。`),
      ),
    });
  },
);

const largestMaximal = point(
  "the-largest-maximal-subgroup-of-a-cyclic-group",
  ["The largest maximal subgroup of a cyclic group", "循环群最大的极大子群"],
  [
    "The maximal subgroups of $\\mathbb{Z}_{n}$ correspond to the primes dividing $n$: for a prime $p$, the subgroup $\\langle p \\rangle$ has prime index $p$. So the largest maximal subgroup comes from the smallest prime factor, and its order is $n$ divided by this prime.\n\nIn $\\mathbb{Z}_{1001}$, with $1001 = 7 \\cdot 11 \\cdot 13$, the maximal subgroups $\\langle 7 \\rangle$, $\\langle 11 \\rangle$ and $\\langle 13 \\rangle$ have orders $143$, $91$ and $77$. The largest is $\\langle 7 \\rangle$, of order $143$.\n\nCheck: $143 \\cdot 7 = 1001$, and the index $7$ is prime.\n\n> **Watch out.** The largest maximal subgroup comes from the smallest prime, not the largest: $\\langle 13 \\rangle$ is maximal too, but has only $77$ elements.",
    "$\\mathbb{Z}_{n}$ 的极大子群对应于整除 $n$ 的素数：对素数 $p$，子群 $\\langle p \\rangle$ 的指数是素数 $p$。所以最大的极大子群来自最小的素因子，它的阶是 $n$ 除以这个素数。\n\n在 $\\mathbb{Z}_{1001}$ 中，$1001 = 7 \\cdot 11 \\cdot 13$，极大子群 $\\langle 7 \\rangle$、$\\langle 11 \\rangle$、$\\langle 13 \\rangle$ 的阶分别是 $143$、$91$、$77$。最大的是 $143$ 阶的 $\\langle 7 \\rangle$。\n\n检验：$143 \\cdot 7 = 1001$，且指数 $7$ 是素数。\n\n> **注意。** 最大的极大子群来自最小的素数，而不是最大的素数：$\\langle 13 \\rangle$ 也是极大子群，但只有 $77$ 个元素。",
  ],
  (rng) => {
    let n = rng.int(15, 400);
    while (factorize(n).length < 2) n++;
    const primes = factorize(n).map(([p]) => p);
    const small = primes[0] as number;
    const large = primes[primes.length - 1] as number;
    const answer = n / small;
    const mistakes = [
      why(
        n / large,
        `That comes from the largest prime $${large}$, which gives the smallest maximal subgroup.`,
        `那来自最大的素数 $${large}$，给出的是最小的极大子群。`,
      ),
      why(small, "That is the index of the subgroup, not its order.", "那是子群的指数，不是它的阶。"),
      why(n - 1, `A subgroup's order must divide $${n}$, and $${n - 1}$ does not.`, `子群的阶必须整除 $${n}$，而 $${n - 1}$ 不整除。`),
    ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i);
    const factored = factorize(n)
      .map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`))
      .join(" \\cdot ");
    return numberProblem({
      prompt: t(
        `What is the order of the largest maximal subgroup of $\\mathbb{Z}_{${n}}$?`,
        `$\\mathbb{Z}_{${n}}$ 的最大的极大子群的阶是多少？`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Factor the order", "分解阶"],
            t(`$${n} = ${factored}$, so the smallest prime factor is $${small}$.`, `$${n} = ${factored}$，所以最小的素因子是 $${small}$。`),
          ],
          [
            ["Divide by the smallest prime", "除以最小的素数"],
            t(
              `A maximal subgroup has prime index, so the largest is $\\langle ${small} \\rangle$, of order $\\frac{${n}}{${small}} = ${answer}$.`,
              `极大子群的指数是素数，所以最大的是 $\\langle ${small} \\rangle$，阶为 $\\frac{${n}}{${small}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer} \\cdot ${small} = ${n}$, and the index $${small}$ is prime.`,
          `$${answer} \\cdot ${small} = ${n}$，且指数 $${small}$ 是素数。`,
        ),
      ),
    });
  },
);

const normalizerOfCycle = point(
  "the-normalizer-of-a-cycle-subgroup",
  ["The normalizer of a cycle subgroup", "循环子群的正规化子"],
  [
    "An element normalizes $\\langle c \\rangle$ when conjugation sends $c$ to a generator of this subgroup. A cycle of length $k$ has $\\varphi(k)$ generators, each reached by $k$ arrangements on the support, and points off the support may be permuted freely.\n\nIn $S_{10}$, the normalizer of $\\langle (1\\;2\\;3\\;4\\;5) \\rangle$ has $5 \\cdot \\varphi(5) \\cdot 5! = 5 \\cdot 4 \\cdot 120 = 2400$ elements.\n\nCheck: $S_{10}$ has $\\frac{10!}{5 \\cdot 5!} = 6048$ five-cycles, which make $\\frac{6048}{4} = 1512$ subgroups, and $\\frac{10!}{2400} = 1512$ as well.\n\n> **Watch out.** The normalizer is bigger than the centralizer by the factor $\\varphi(k)$: the centralizer here has only $5 \\cdot 120 = 600$ elements, because it must send the cycle to itself, not to another generator.",
    "一个元素正规化 $\\langle c \\rangle$，是指共轭把 $c$ 变成这个子群的生成元。长度为 $k$ 的循环有 $\\varphi(k)$ 个生成元，每个生成元都能由支撑集上的 $k$ 种排列得到，而支撑集以外的点可以任意置换。\n\n在 $S_{10}$ 中，$\\langle (1\\;2\\;3\\;4\\;5) \\rangle$ 的正规化子有 $5 \\cdot \\varphi(5) \\cdot 5! = 5 \\cdot 4 \\cdot 120 = 2400$ 个元素。\n\n检验：$S_{10}$ 有 $\\frac{10!}{5 \\cdot 5!} = 6048$ 个五轮换，构成 $\\frac{6048}{4} = 1512$ 个子群，而 $\\frac{10!}{2400} = 1512$，结果一致。\n\n> **注意。** 正规化子比中心化子大 $\\varphi(k)$ 倍：这里中心化子只有 $5 \\cdot 120 = 600$ 个元素，因为它必须把这个循环变成自身，而不是另一个生成元。",
  ],
  (rng) => {
    const n = rng.int(4, 9);
    const k = rng.int(3, Math.min(n, 7));
    const c = rng.sample(oneTo(n), k);
    const phi = totient(k);
    const rest = factorial(n - k);
    const answer = k * phi * rest;
    const mistakes = [
      why(
        k * rest,
        `That is the centralizer; conjugation may also send the cycle to any of its $${phi}$ generators.`,
        `那是中心化子；共轭还可以把这个循环变成它的 $${phi}$ 个生成元中的任一个。`,
      ),
      why(
        k * phi,
        `That leaves out the $${n - k}!$ permutations of the points off the cycle.`,
        `那漏掉了循环以外的点的 $${n - k}!$ 种置换。`,
      ),
      why(
        phi * rest,
        `That leaves out the $${k}$ ways to place each generator on the cycle's points.`,
        `那漏掉了每个生成元在循环的点上的 $${k}$ 种摆放方式。`,
      ),
    ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i);
    const shown = [k, phi, rest].filter((v) => v > 1).join(" \\cdot ");
    return numberProblem({
      prompt: t(
        `How many elements does the normalizer of $\\langle ${cycleText(c)} \\rangle$ in $S_{${n}}$ have?`,
        `$\\langle ${cycleText(c)} \\rangle$ 在 $S_{${n}}$ 中的正规化子有多少个元素？`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [
            ["Count on the cycle", "在循环上计数"],
            t(
              `The cycle has $\\varphi(${k}) = ${phi}$ generators, each reached in $${k}$ ways: $${k} \\cdot ${phi} = ${k * phi}$.`,
              `这个循环有 $\\varphi(${k}) = ${phi}$ 个生成元，每个有 $${k}$ 种得到方式：$${k} \\cdot ${phi} = ${k * phi}$。`,
            ),
          ],
          [
            ["Count off the cycle", "在循环外计数"],
            t(
              `The other $${n - k}$ points contribute $${n - k}! = ${rest}$, so the normalizer has $${shown} = ${answer}$ elements.`,
              `其余 $${n - k}$ 个点贡献 $${n - k}! = ${rest}$，所以正规化子有 $${shown} = ${answer}$ 个元素。`,
            ),
          ],
        ],
        t(
          `$\\frac{${n}!}{${answer}} = ${factorial(n) / answer}$ is a whole number, the number of subgroups conjugate to this one, as Lagrange's theorem requires.`,
          `$\\frac{${n}!}{${answer}} = ${factorial(n) / answer}$ 是整数，即与它共轭的子群个数，符合拉格朗日定理。`,
        ),
      ),
    });
  },
);

const centralizerByType = {
  ...point(
    "the-centralizer-from-the-cycle-type",
    ["The centralizer from the cycle type", "由循环类型求中心化子"],
    [
      "An element commutes with a permutation when it maps cycles to cycles of the same length, keeping the order. For $c$ cycles of length $m$, there are $c!$ ways to match the cycles and $m^{c}$ rotations, and fixed points count as cycles of length one.\n\nThe figure shows $(1\\;2\\;3)(4\\;5\\;6)$: the two cycles can be swapped in $2!$ ways and each rotated in $3$ ways, so its centralizer has $2! \\cdot 3^2 = 18$ elements. In $S_{12}$, $(1\\;2)(3\\;4)(5\\;6\\;7)(8\\;9\\;10)$ with the fixed points $11$ and $12$ has a centralizer of $2^2 \\cdot 2! \\cdot 3^2 \\cdot 2! \\cdot 2! = 288$ elements.\n\nCheck: $\\frac{12!}{288} = 1663200$ is a whole number, the count of permutations of this cycle type.\n\n> **Watch out.** Cycles of different lengths cannot be swapped, so the matching factor $c!$ is taken separately for each length; the fixed points add their own factor, $2! = 2$ here.",
      "一个元素与置换可交换，是指它把循环映成长度相同的循环且保持次序。对于 $c$ 个长度为 $m$ 的循环，有 $c!$ 种配对方式和 $m^{c}$ 种旋转方式，不动点算作长度为一的循环。\n\n图中是 $(1\\;2\\;3)(4\\;5\\;6)$：两个循环可以交换，有 $2!$ 种方式，每个循环可以旋转 $3$ 种方式，所以它的中心化子有 $2! \\cdot 3^2 = 18$ 个元素。在 $S_{12}$ 中，有不动点 $11$ 与 $12$ 的 $(1\\;2)(3\\;4)(5\\;6\\;7)(8\\;9\\;10)$ 的中心化子有 $2^2 \\cdot 2! \\cdot 3^2 \\cdot 2! \\cdot 2! = 288$ 个元素。\n\n检验：$\\frac{12!}{288} = 1663200$ 是整数，即这种循环类型的置换个数。\n\n> **注意。** 长度不同的循环不能互换，所以配对因子 $c!$ 要对每种长度分别计算；不动点另有自己的因子，这里是 $2! = 2$。",
    ],
    (rng) => {
      const lengths = rng.pick([
        [2, 2],
        [2, 2, 2],
        [3, 3],
        [2, 3],
        [2, 2, 3],
        [4, 4],
        [2, 4],
        [3, 3, 2],
        [2, 2, 2, 2],
        [3, 4],
      ] as const);
      const used = lengths.reduce<number>((a, b) => a + b, 0);
      const n = rng.int(Math.max(used, 5), 9);
      const fixed = n - used;
      const labels = rng.shuffle(oneTo(n));
      let at = 0;
      const cycles = lengths.map((l) => {
        const c = labels.slice(at, at + l);
        at += l;
        return c;
      });
      const counts = new Map<number, number>();
      for (const l of lengths) counts.set(l, (counts.get(l) ?? 0) + 1);
      let rotations = 1;
      let matchings = 1;
      const factors: string[] = [];
      for (const [m, c] of [...counts].sort((x, y) => x[0] - y[0])) {
        rotations *= m ** c;
        matchings *= factorial(c);
        factors.push(c === 1 ? `${m}` : `${m}^{${c}} \\cdot ${c}!`);
      }
      if (fixed > 1) factors.push(`${fixed}!`);
      const answer = rotations * matchings * factorial(fixed);
      const product = factors.join(" \\cdot ");
      const mistakes = [
        why(
          rotations * factorial(fixed),
          "That leaves out the ways to match cycles of equal length with each other.",
          "那漏掉了等长循环之间的配对方式。",
        ),
        why(
          rotations * matchings,
          `That leaves out the $${fixed}!$ permutations of the fixed points.`,
          `那漏掉了不动点的 $${fixed}!$ 种置换。`,
        ),
        why(
          lengths.reduce<number>(lcm, 1),
          "That is the order of the permutation, which counts only its own powers.",
          "那是这个置换的阶，只数了它自身的幂。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i);
      return numberProblem({
        prompt: t(
          `How many elements does the centralizer of $${cycles.map(cycleText).join("")}$ in $S_{${n}}$ have?`,
          `$${cycles.map(cycleText).join("")}$ 在 $S_{${n}}$ 中的中心化子有多少个元素？`,
        ),
        answer,
        mistakes,
        solution: walked(
          [
            [
              ["Group the cycles by length", "按长度给循环分组"],
              t(
                `The lengths are $${lengths.join(", ")}$${fixed === 0 ? "" : `, with $${fixed}$ fixed ${fixed === 1 ? "point" : "points"}`}.`,
                `各循环长度为 $${lengths.join(", ")}$${fixed === 0 ? "" : `，另有 $${fixed}$ 个不动点`}。`,
              ),
            ],
            [
              ["Multiply rotations and matchings", "旋转数与配对数相乘"],
              t(`This gives $${product} = ${answer}$.`, `得 $${product} = ${answer}$。`),
            ],
          ],
          t(
            `$\\frac{${n}!}{${answer}} = ${factorial(n) / answer}$ is a whole number, the count of permutations of this cycle type.`,
            `$\\frac{${n}!}{${answer}} = ${factorial(n) / answer}$ 是整数，即这种循环类型的置换个数。`,
          ),
        ),
      });
    },
  ),
  figure: algebraDrawings2["the-centralizer-of-a-subgroup#the-centralizer-from-the-cycle-type"],
};

const compositionLength = point(
  "the-length-of-a-composition-series",
  ["The length of a composition series", "合成列的长度"],
  [
    "A composition series breaks a group into a chain whose quotients are simple groups. For $\\mathbb{Z}_{n}$, each simple quotient is $\\mathbb{Z}_{p}$ for a prime $p$, so the length is the number of prime factors of $n$, counted with multiplicity, whichever chain is chosen.\n\nFor $\\mathbb{Z}_{1000}$, with $1000 = 2^3 \\cdot 5^3$, the length is $3 + 3 = 6$, for example $\\mathbb{Z}_{1000} \\supset \\langle 2 \\rangle \\supset \\langle 4 \\rangle \\supset \\langle 8 \\rangle \\supset \\langle 40 \\rangle \\supset \\langle 200 \\rangle \\supset \\{0\\}$.\n\nCheck: the quotients have orders $2, 2, 2, 5, 5, 5$, whose product is $1000$.\n\n> **Watch out.** Count primes with multiplicity: $1000$ has only $2$ distinct prime factors, but each factor $2$ and each factor $5$ is a separate step.",
    "合成列把群分解成一条链，链中的商都是单群。对 $\\mathbb{Z}_{n}$，每个单商都是素数 $p$ 对应的 $\\mathbb{Z}_{p}$，所以长度等于 $n$ 的素因子个数（计重数），与所选的链无关。\n\n对 $\\mathbb{Z}_{1000}$，$1000 = 2^3 \\cdot 5^3$，长度是 $3 + 3 = 6$，例如 $\\mathbb{Z}_{1000} \\supset \\langle 2 \\rangle \\supset \\langle 4 \\rangle \\supset \\langle 8 \\rangle \\supset \\langle 40 \\rangle \\supset \\langle 200 \\rangle \\supset \\{0\\}$。\n\n检验：各商的阶为 $2, 2, 2, 5, 5, 5$，乘积是 $1000$。\n\n> **注意。** 素因子要计重数：$1000$ 只有 $2$ 个不同的素因子，但每个因子 $2$ 和每个因子 $5$ 都是单独的一步。",
  ],
  (rng) => {
    let n = rng.int(12, 720);
    while (factorize(n).reduce((a, [, e]) => a + e, 0) < 3) n++;
    const f = factorize(n);
    const answer = f.reduce((a, [, e]) => a + e, 0);
    const text = f.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
    const mistakes = [
      why(
        f.length,
        "That counts the distinct primes; a repeated prime gives a step each time.",
        "那是不同素数的个数；重复的素数每出现一次就是一步。",
      ),
      why(
        answer + 1,
        "That counts the subgroups in the chain, both ends included; the steps are one fewer.",
        "那是链中子群的个数（含两端）；步数比它少一。",
      ),
      why(answer - 1, "That counts only the subgroups strictly between the ends.", "那只数了两端之间的子群。"),
      why(
        f.reduce((a, [, e]) => a * (e + 1), 1),
        `That counts all subgroups of $\\mathbb{Z}_{${n}}$, not the steps of one chain.`,
        `那是 $\\mathbb{Z}_{${n}}$ 的全部子群个数，不是一条链的步数。`,
      ),
    ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i);
    const primesInOrder = f.flatMap(([p, e]) => Array.from({ length: e }, () => p));
    const gens = primesInOrder.slice(0, -1).map((_, i) => primesInOrder.slice(0, i + 1).reduce((a, b) => a * b, 1));
    const chain = [`\\mathbb{Z}_{${n}}`, ...gens.map((g) => `\\langle ${g} \\rangle`), "\\{0\\}"].join(" \\supset ");
    return numberProblem({
      prompt: t(
        `How many steps does a composition series of $\\mathbb{Z}_{${n}}$ have, from the whole group down to the trivial subgroup?`,
        `从整个群到平凡子群，$\\mathbb{Z}_{${n}}$ 的合成列有多少步？`,
      ),
      answer,
      mistakes,
      solution: walked(
        [
          [["Factor the order", "分解阶"], t(`$${n} = ${text}$.`, `$${n} = ${text}$。`)],
          [
            ["Count the prime factors", "数素因子"],
            t(
              `With multiplicity there are $${answer}$ prime factors, and each step divides the order by one prime, so there are $${answer}$ steps.`,
              `计重数共有 $${answer}$ 个素因子，每一步使阶除以一个素数，所以有 $${answer}$ 步。`,
            ),
          ],
        ],
        t(`One such series is $${chain}$, with $${answer}$ steps.`, `其中一条合成列是 $${chain}$，共 $${answer}$ 步。`),
      ),
    });
  },
);

const imageBetweenGroups = point(
  "the-image-of-a-map-between-different-cyclic-groups",
  ["The image of a map between different cyclic groups", "不同循环群之间映射的像"],
  [
    "A homomorphism from $\\mathbb{Z}_{m}$ to $\\mathbb{Z}_{n}$ is determined by the image $a$ of $1$, which must satisfy $n \\mid ma$. The image is the cyclic subgroup generated by $a$ in the codomain, and it has $\\frac{n}{\\gcd(a, n)}$ elements. For $\\varphi: \\mathbb{Z}_{8} \\to \\mathbb{Z}_{12}$ with $\\varphi(1) = 9$, allowed because $8 \\cdot 9 = 72 = 6 \\cdot 12$, the image is $\\langle 9 \\rangle = \\{0, 9, 6, 3\\}$, with $\\frac{12}{\\gcd(9, 12)} = \\frac{12}{3} = 4$ elements.\n\nCheck: $4 \\cdot 9 = 36 = 3 \\cdot 12$, so $9$ has order $4$, and $4$ divides $8$, as the size of an image of $\\mathbb{Z}_8$ must.\n\n> **Watch out.** Take the gcd with $n$, the order of the codomain, where the image lives: $\\gcd(9, 8) = 1$ would wrongly give $8$ elements.",
    "从 $\\mathbb{Z}_{m}$ 到 $\\mathbb{Z}_{n}$ 的同态由 $1$ 的像 $a$ 确定，$a$ 必须满足 $n \\mid ma$。像是陪域中由 $a$ 生成的循环子群，有 $\\frac{n}{\\gcd(a, n)}$ 个元素。对 $\\varphi: \\mathbb{Z}_{8} \\to \\mathbb{Z}_{12}$，$\\varphi(1) = 9$（允许，因为 $8 \\cdot 9 = 72 = 6 \\cdot 12$），像是 $\\langle 9 \\rangle = \\{0, 9, 6, 3\\}$，有 $\\frac{12}{\\gcd(9, 12)} = \\frac{12}{3} = 4$ 个元素。\n\n检验：$4 \\cdot 9 = 36 = 3 \\cdot 12$，所以 $9$ 的阶为 $4$；并且 $4$ 整除 $8$，这正是 $\\mathbb{Z}_8$ 的像的大小必须满足的。\n\n> **注意。** 要与陪域的阶 $n$ 取最大公因数，因为像在陪域中：用 $\\gcd(9, 8) = 1$ 会错得到 $8$ 个元素。",
  ],
  (rng) => {
    for (;;) {
      const g = rng.int(2, 8);
      const [u, v] = rng.pick([
        [2, 3],
        [3, 2],
        [3, 4],
        [4, 3],
        [2, 5],
        [5, 2],
        [5, 3],
        [3, 5],
        [1, 2],
        [2, 1],
        [1, 3],
        [3, 1],
      ] as const);
      const m = g * u;
      const n = g * v;
      const a = v * rng.int(1, g - 1);
      const d = gcd(a, n);
      const answer = n / d;
      const mistakes = distinctMistakes(answer, [
        why(
          m / gcd(a, m),
          `That takes the gcd with $${m}$, the order of the domain; the image lives in $\\mathbb{Z}_{${n}}$, so use $\\gcd(${a}, ${n}) = ${d}$.`,
          `那是与定义域的阶 $${m}$ 取最大公因数；像在 $\\mathbb{Z}_{${n}}$ 中，所以要用 $\\gcd(${a}, ${n}) = ${d}$。`,
        ),
        why(
          d,
          `$${d} = \\gcd(${a}, ${n})$ generates the image, but the number of elements is $${n}$ divided by it.`,
          `$${d} = \\gcd(${a}, ${n})$ 生成像，但元素个数是 $${n}$ 除以它。`,
        ),
        why(
          n,
          `That is all of $\\mathbb{Z}_{${n}}$, but $${a}$ does not generate $\\mathbb{Z}_{${n}}$.`,
          `那是整个 $\\mathbb{Z}_{${n}}$，但 $${a}$ 不生成 $\\mathbb{Z}_{${n}}$。`,
        ),
        why(
          m,
          `That is all of $\\mathbb{Z}_{${m}}$, but $\\varphi(${answer}) = 0$, so the map is not one-to-one.`,
          `那是整个 $\\mathbb{Z}_{${m}}$，但 $\\varphi(${answer}) = 0$，所以映射不是单射。`,
        ),
        why(m / answer, "That is the size of the kernel, the elements sent to $0$.", "那是核的大小，即被送到 $0$ 的元素个数。"),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `Let $\\varphi: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$ be the homomorphism with $\\varphi(1) = ${a}$. How many elements does its image have?`,
          `设 $\\varphi: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$ 是满足 $\\varphi(1) = ${a}$ 的同态。它的像有多少个元素？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Name the image", "写出像"],
              t(
                `The image is $\\langle ${a} \\rangle$ in $\\mathbb{Z}_{${n}}$.`,
                `像是 $\\mathbb{Z}_{${n}}$ 中的 $\\langle ${a} \\rangle$。`,
              ),
            ],
            [
              ["Find its size", "求它的大小"],
              t(
                `$\\gcd(${a}, ${n}) = ${d}$, so it has $${d === 1 ? `${n}` : `\\frac{${n}}{${d}} = ${answer}`}$ elements.`,
                `$\\gcd(${a}, ${n}) = ${d}$，所以它有 $${d === 1 ? `${n}` : `\\frac{${n}}{${d}} = ${answer}`}$ 个元素。`,
              ),
            ],
          ],
          t(
            `$${answer} \\cdot ${a} = ${answer * a} = ${(answer * a) / n} \\cdot ${n}$, so $${a}$ has order $${answer}$, and $${answer}$ divides $${m}$, as the size of an image of $\\mathbb{Z}_{${m}}$ must.`,
            `$${answer} \\cdot ${a} = ${answer * a} = ${(answer * a) / n} \\cdot ${n}$，所以 $${a}$ 的阶为 $${answer}$；并且 $${answer}$ 整除 $${m}$，这正是 $\\mathbb{Z}_{${m}}$ 的像的大小必须满足的。`,
          ),
        ),
      });
    }
  },
);

const smallestKernel = point(
  "the-smallest-possible-kernel",
  ["The smallest possible kernel", "最小可能的核"],
  [
    "By the first isomorphism theorem, the image of a homomorphism has an order dividing the order of both groups. So between cyclic groups the largest image has $\\gcd(m, n)$ elements, and this limit forces the kernel to have at least $\\frac{m}{\\gcd(m, n)}$ elements. From $\\mathbb{Z}_{20}$ to $\\mathbb{Z}_{8}$ the image has at most $\\gcd(20, 8) = 4$ elements, so the kernel has at least $\\frac{20}{4} = 5$.\n\nCheck: $\\varphi(1) = 2$ is allowed, since $20 \\cdot 2 = 40 = 5 \\cdot 8$, and $2$ has order $4$ in $\\mathbb{Z}_8$, so the kernel is $\\{0, 4, 8, 12, 16\\}$, exactly $5$ elements.\n\n> **Watch out.** The largest image has $\\gcd(m, n)$ elements, not $\\min(m, n)$: an image of $8$ elements is impossible here, because $8$ does not divide $20$.",
    "由第一同构定理，同态的像的阶同时整除两个群的阶。所以在循环群之间，最大的像有 $\\gcd(m, n)$ 个元素，这个限制使核至少有 $\\frac{m}{\\gcd(m, n)}$ 个元素。从 $\\mathbb{Z}_{20}$ 到 $\\mathbb{Z}_{8}$，像至多有 $\\gcd(20, 8) = 4$ 个元素，所以核至少有 $\\frac{20}{4} = 5$ 个。\n\n检验：$\\varphi(1) = 2$ 是允许的，因为 $20 \\cdot 2 = 40 = 5 \\cdot 8$；而 $2$ 在 $\\mathbb{Z}_8$ 中的阶为 $4$，所以核是 $\\{0, 4, 8, 12, 16\\}$，恰有 $5$ 个元素。\n\n> **注意。** 最大的像有 $\\gcd(m, n)$ 个元素，而不是 $\\min(m, n)$ 个：这里 $8$ 个元素的像不可能，因为 $8$ 不整除 $20$。",
  ],
  (rng) => {
    for (;;) {
      const g = rng.int(2, 12);
      const u = rng.int(2, 9);
      let v = rng.int(1, 9);
      while (gcd(u, v) !== 1) v++;
      const m = g * u;
      const n = g * v;
      const answer = u;
      const mistakes = distinctMistakes(answer, [
        why(
          g,
          `That is the largest possible image, $\\gcd(${m}, ${n}) = ${g}$; the kernel has $${m}$ divided by it.`,
          `那是最大可能的像 $\\gcd(${m}, ${n}) = ${g}$；核的大小是 $${m}$ 除以它。`,
        ),
        why(
          1,
          `A one-to-one map would need an image of $${m}$ elements, but $${m}$ does not divide $${n}$.`,
          `单射需要像有 $${m}$ 个元素，但 $${m}$ 不整除 $${n}$。`,
        ),
        why(m, "That is the kernel of the zero map, the largest kernel, not the smallest.", "那是零映射的核，是最大的核，而不是最小的。"),
        why(
          v,
          `That divides $${n}$, the order of the target, by the gcd; the kernel lies in $\\mathbb{Z}_{${m}}$, so divide $${m}$.`,
          `那是用目标群的阶 $${n}$ 除以最大公因数；核在 $\\mathbb{Z}_{${m}}$ 中，所以要除 $${m}$。`,
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `What is the smallest possible order of the kernel of a homomorphism $\\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$?`,
          `同态 $\\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$ 的核的最小可能阶是多少？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Bound the image", "估计像"],
              t(
                `The order of the image divides both $${m}$ and $${n}$, so it is at most $\\gcd(${m}, ${n}) = ${g}$.`,
                `像的阶同时整除 $${m}$ 和 $${n}$，所以至多为 $\\gcd(${m}, ${n}) = ${g}$。`,
              ),
            ],
            [
              ["Bound the kernel", "估计核"],
              t(
                `The orders of the kernel and the image multiply to $${m}$, so the kernel has at least $\\frac{${m}}{${g}} = ${answer}$ elements.`,
                `核与像的阶之积为 $${m}$，所以核至少有 $\\frac{${m}}{${g}} = ${answer}$ 个元素。`,
              ),
            ],
          ],
          t(
            `$\\varphi(1) = ${v}$ is allowed, since $${m} \\cdot ${v} = ${m * v} = ${answer} \\cdot ${n}$, and $${v}$ has order $${g}$ in $\\mathbb{Z}_{${n}}$, so this map has a kernel of exactly $${answer}$ elements.`,
            `$\\varphi(1) = ${v}$ 是允许的，因为 $${m} \\cdot ${v} = ${m * v} = ${answer} \\cdot ${n}$；而 $${v}$ 在 $\\mathbb{Z}_{${n}}$ 中的阶为 $${g}$，所以这个映射的核恰有 $${answer}$ 个元素。`,
          ),
        ),
      });
    }
  },
);

const intersectionFromSum = point(
  "the-intersection-from-the-second-isomorphism-theorem",
  ["The intersection from the second isomorphism theorem", "由第二同构定理求交集"],
  [
    "The second isomorphism theorem says that $(H + K)/K \\cong H/(H \\cap K)$. Comparing the orders gives $|H + K| \\cdot |H \\cap K| = |H| \\cdot |K|$, so the size of the intersection can be found from the sizes of the two subgroups and their sum. With $|H| = 6$, $|K| = 10$ and $|H + K| = 30$, we get $|H \\cap K| = \\frac{6 \\cdot 10}{30} = 2$.\n\nCheck: $(H + K)/K$ has $\\frac{30}{10} = 3$ elements and $H/(H \\cap K)$ has $\\frac{6}{2} = 3$, so the two sides agree.\n\n> **Watch out.** $H + K$ is not the union $H \\cup K$, so do not count as for sets: $6 + 10 - 30$ is negative. Divide $|H| \\cdot |K|$ by $|H + K|$.",
    "第二同构定理说 $(H + K)/K \\cong H/(H \\cap K)$。比较阶得 $|H + K| \\cdot |H \\cap K| = |H| \\cdot |K|$，所以交集的大小可以由两个子群及其和的大小求出。若 $|H| = 6$，$|K| = 10$，$|H + K| = 30$，则 $|H \\cap K| = \\frac{6 \\cdot 10}{30} = 2$。\n\n检验：$(H + K)/K$ 有 $\\frac{30}{10} = 3$ 个元素，$H/(H \\cap K)$ 有 $\\frac{6}{2} = 3$ 个，两边一致。\n\n> **注意。** $H + K$ 不是并集 $H \\cup K$，所以不能像集合那样计数：$6 + 10 - 30$ 是负数。要用 $|H| \\cdot |K|$ 除以 $|H + K|$。",
  ],
  (rng) => {
    for (;;) {
      const i = rng.int(2, 12);
      const [p, q] = rng.pick([
        [2, 3],
        [3, 2],
        [2, 5],
        [5, 2],
        [3, 4],
        [4, 3],
        [3, 5],
        [5, 3],
        [4, 5],
        [5, 4],
      ] as const);
      const h = i * p;
      const k = i * q;
      const sum = i * p * q;
      const mistakes = distinctMistakes(i, [
        why(
          p,
          `That is $|(H + K)/K| = \\frac{${sum}}{${k}}$, an index, not the size of the intersection.`,
          `那是指数 $|(H + K)/K| = \\frac{${sum}}{${k}}$，不是交集的大小。`,
        ),
        why(
          q,
          `That is $|(H + K)/H| = \\frac{${sum}}{${h}}$, an index, not the size of the intersection.`,
          `那是指数 $|(H + K)/H| = \\frac{${sum}}{${h}}$，不是交集的大小。`,
        ),
        why(
          h * k,
          `That is $|H| \\cdot |K|$, before dividing by $|H + K| = ${sum}$.`,
          `那是 $|H| \\cdot |K|$，还没有除以 $|H + K| = ${sum}$。`,
        ),
        ...(h + k - sum > 0
          ? [
              why(
                h + k - sum,
                "That counts as for sets, but $H + K$ is not the union of $H$ and $K$.",
                "那是按集合计数，但 $H + K$ 不是 $H$ 与 $K$ 的并集。",
              ),
            ]
          : []),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `In an abelian group, subgroups have $|H| = ${h}$, $|K| = ${k}$ and $|H + K| = ${sum}$. Find $|H \\cap K|$.`,
          `在阿贝尔群中，子群满足 $|H| = ${h}$，$|K| = ${k}$，$|H + K| = ${sum}$。求 $|H \\cap K|$。`,
        ),
        answer: i,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Apply the theorem", "用定理"],
              t(
                "$(H + K)/K \\cong H/(H \\cap K)$, so $\\frac{|H + K|}{|K|} = \\frac{|H|}{|H \\cap K|}$.",
                "$(H + K)/K \\cong H/(H \\cap K)$，所以 $\\frac{|H + K|}{|K|} = \\frac{|H|}{|H \\cap K|}$。",
              ),
            ],
            [
              ["Solve", "求解"],
              t(
                `$|H \\cap K| = \\frac{|H| \\cdot |K|}{|H + K|} = \\frac{${h} \\cdot ${k}}{${sum}} = ${i}$.`,
                `$|H \\cap K| = \\frac{|H| \\cdot |K|}{|H + K|} = \\frac{${h} \\cdot ${k}}{${sum}} = ${i}$。`,
              ),
            ],
          ],
          t(
            `$(H + K)/K$ has $\\frac{${sum}}{${k}} = ${p}$ elements and $H/(H \\cap K)$ has $\\frac{${h}}{${i}} = ${p}$.`,
            `$(H + K)/K$ 有 $\\frac{${sum}}{${k}} = ${p}$ 个元素，$H/(H \\cap K)$ 有 $\\frac{${h}}{${i}} = ${p}$ 个。`,
          ),
        ),
      });
    }
  },
);

const thirdChain = point(
  "orders-along-a-chain-of-normal-subgroups",
  ["Orders along a chain of normal subgroups", "正规子群链上的阶"],
  [
    "For normal subgroups $N \\le K$ of $G$, the third isomorphism theorem gives $(G/N)/(K/N) \\cong G/K$. So the indices along the chain multiply: $|G/N| = |G/K| \\cdot |K/N|$, and any one of them can be found from the other two. With $|G| = 60$, $|N| = 5$ and $|G/K| = 4$, we get $|G/N| = \\frac{60}{5} = 12$ and $|K/N| = \\frac{12}{4} = 3$.\n\nCheck: $|K| = \\frac{60}{4} = 15$, and $|K/N| = \\frac{15}{5} = 3$ again.\n\n> **Watch out.** $|K/N|$ is not $|K|$: after finding $|K| = 15$, still divide by $|N| = 5$.",
    "对于 $G$ 的正规子群 $N \\le K$，第三同构定理给出 $(G/N)/(K/N) \\cong G/K$。所以链上的指数相乘：$|G/N| = |G/K| \\cdot |K/N|$，其中任何一个都可以由另外两个求出。若 $|G| = 60$，$|N| = 5$，$|G/K| = 4$，则 $|G/N| = \\frac{60}{5} = 12$，$|K/N| = \\frac{12}{4} = 3$。\n\n检验：$|K| = \\frac{60}{4} = 15$，而 $|K/N| = \\frac{15}{5} = 3$，结果一致。\n\n> **注意。** $|K/N|$ 不是 $|K|$：求出 $|K| = 15$ 后，还要除以 $|N| = 5$。",
  ],
  (rng) => {
    for (;;) {
      const u = rng.int(2, 8);
      const a = rng.int(2, 9);
      const b = rng.int(2, 9);
      const size = u * a * b;
      const mistakes = distinctMistakes(a, [
        why(
          a * b,
          `That is $|G/N| = \\frac{${size}}{${u}}$; divide it by $|G/K| = ${b}$.`,
          `那是 $|G/N| = \\frac{${size}}{${u}}$；还要除以 $|G/K| = ${b}$。`,
        ),
        why(
          u * a,
          `That is $|K| = \\frac{${size}}{${b}}$; divide it by $|N| = ${u}$.`,
          `那是 $|K| = \\frac{${size}}{${b}}$；还要除以 $|N| = ${u}$。`,
        ),
        why(b, `That is $|G/K|$, which is given; the question asks for $|K/N|$.`, "那是已知的 $|G/K|$；题目问的是 $|K/N|$。"),
        why(a * b + b, "That adds the indices, but they multiply along the chain.", "那是把指数相加，但链上的指数是相乘的。"),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `Let $N \\le K$ be normal subgroups of $G$ with $|G| = ${size}$, $|N| = ${u}$ and $|G/K| = ${b}$. Find $|K/N|$.`,
          `设 $N \\le K$ 是 $G$ 的正规子群，$|G| = ${size}$，$|N| = ${u}$，$|G/K| = ${b}$。求 $|K/N|$。`,
        ),
        answer: a,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [["Find |G/N|", "求 |G/N|"], t(`$|G/N| = \\frac{${size}}{${u}} = ${a * b}$.`, `$|G/N| = \\frac{${size}}{${u}} = ${a * b}$。`)],
            [
              ["Cancel", "约去"],
              t(
                `Since $(G/N)/(K/N) \\cong G/K$, $|G/N| = |G/K| \\cdot |K/N|$, so $|K/N| = \\frac{${a * b}}{${b}} = ${a}$.`,
                `由于 $(G/N)/(K/N) \\cong G/K$，有 $|G/N| = |G/K| \\cdot |K/N|$，所以 $|K/N| = \\frac{${a * b}}{${b}} = ${a}$。`,
              ),
            ],
          ],
          t(
            `$|K| = \\frac{${size}}{${b}} = ${u * a}$, and $|K/N| = \\frac{${u * a}}{${u}} = ${a}$.`,
            `$|K| = \\frac{${size}}{${b}} = ${u * a}$，而 $|K/N| = \\frac{${u * a}}{${u}} = ${a}$。`,
          ),
        ),
      });
    }
  },
);

const reflectionFixedVertices = {
  ...point(
    "the-vertices-a-reflection-fixes",
    ["The vertices a reflection fixes", "反射固定的顶点"],
    [
      "The reflection $r^{a}s$ sends the vertex $v$ to $a - v$ modulo $n$, so a fixed vertex must satisfy $2v \\equiv a \\pmod{n}$. For odd $n$ there is one solution. For even $n$ there are two when $a$ is even and none when $a$ is odd.\n\nIn $D_{6}$, the reflection $r^{4}s$ fixes the vertices with $2v \\equiv 4 \\pmod{6}$, namely $2$ and $5$.\n\nCheck: $r^{4}s \\cdot 2 = 4 - 2 = 2$ and $r^{4}s \\cdot 5 = 4 - 5 = -1 \\equiv 5 \\pmod{6}$.\n\n> **Watch out.** For even $n$, solving $2v \\equiv a$ gives two vertices, $v$ and $v + \\frac{n}{2}$, opposite each other; do not stop at the first one.",
      "反射 $r^{a}s$ 把顶点 $v$ 映到模 $n$ 的 $a - v$，所以不动顶点必须满足 $2v \\equiv a \\pmod{n}$。当 $n$ 为奇数时有一个解。当 $n$ 为偶数时，$a$ 为偶数有两个解，$a$ 为奇数没有解。\n\n在 $D_{6}$ 中，反射 $r^{4}s$ 固定满足 $2v \\equiv 4 \\pmod{6}$ 的顶点，即 $2$ 与 $5$。\n\n检验：$r^{4}s \\cdot 2 = 4 - 2 = 2$，$r^{4}s \\cdot 5 = 4 - 5 = -1 \\equiv 5 \\pmod{6}$。\n\n> **注意。** 当 $n$ 为偶数时，解 $2v \\equiv a$ 得到两个相对的顶点 $v$ 与 $v + \\frac{n}{2}$；不要只找到第一个就停下。",
    ],
    (rng) => {
      const n = rng.int(5, 24);
      const a = rng.int(1, n - 1);
      const fixed: number[] = [];
      for (let v = 0; v < n; v++) if ((2 * v - a) % n === 0) fixed.push(v);
      const answer = fixed.length;
      const element = a === 1 ? "rs" : `r^{${a}}s`;
      return numberProblem({
        prompt: t(
          `$D_{${n}}$ acts on the vertices $0, 1, \\dots, ${n - 1}$ of a regular ${n}-gon, with $r \\cdot v = v + 1$ and $s \\cdot v = -v \\pmod{${n}}$. How many vertices does $${element}$ fix?`,
          `$D_{${n}}$ 作用在正 ${n} 边形的顶点 $0, 1, \\dots, ${n - 1}$ 上，其中 $r \\cdot v = v + 1$，$s \\cdot v = -v \\pmod{${n}}$。$${element}$ 固定多少个顶点？`,
        ),
        answer,
        mistakes: distinctMistakes(answer, [
          why(
            0,
            n % 2 === 1
              ? `For odd $${n}$, $2$ has an inverse modulo $${n}$, so $2v \\equiv ${a}$ always has a solution.`
              : `$${a}$ is even, so $2v \\equiv ${a} \\pmod{${n}}$ has solutions.`,
            n % 2 === 1
              ? `$${n}$ 为奇数时，$2$ 模 $${n}$ 可逆，所以 $2v \\equiv ${a}$ 总有解。`
              : `$${a}$ 是偶数，所以 $2v \\equiv ${a} \\pmod{${n}}$ 有解。`,
          ),
          why(
            1,
            n % 2 === 1
              ? "One solution is right for odd $n$."
              : `For even $${n}$ the solutions come in opposite pairs $v$ and $v + ${n / 2}$, so there are $0$ or $2$, never $1$.`,
            n % 2 === 1
              ? "当 $n$ 为奇数时，一个解是对的。"
              : `$${n}$ 为偶数时，解成对出现，即相对的 $v$ 与 $v + ${n / 2}$，所以有 $0$ 个或 $2$ 个，不会只有 $1$ 个。`,
          ),
          why(
            2,
            n % 2 === 1
              ? `For odd $${n}$ the congruence $2v \\equiv ${a}$ has exactly one solution, since $2$ has an inverse.`
              : `$${a}$ is odd, while $2v$ and $${n}$ are even, so no vertex is fixed.`,
            n % 2 === 1
              ? `$${n}$ 为奇数时，因为 $2$ 可逆，同余式 $2v \\equiv ${a}$ 恰有一个解。`
              : `$${a}$ 是奇数，而 $2v$ 与 $${n}$ 都是偶数，所以没有不动顶点。`,
          ),
          why(
            n,
            "Only the identity fixes every vertex; a reflection moves most of them.",
            "只有恒等元才固定每个顶点；反射移动其中大多数顶点。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Set up the congruence", "列出同余式"],
              t(
                `The element sends $v$ to $${a} - v$, so a fixed vertex needs $${a} - v \\equiv v$, that is $2v \\equiv ${a} \\pmod{${n}}$.`,
                `这个元素把 $v$ 映到 $${a} - v$，所以不动顶点需要 $${a} - v \\equiv v$，即 $2v \\equiv ${a} \\pmod{${n}}$。`,
              ),
            ],
            [
              ["Solve it", "解同余式"],
              answer === 0
                ? t(
                    `The left side is even and $${n}$ is even, but $${a}$ is odd, so there are none.`,
                    `左边是偶数，$${n}$ 是偶数，而 $${a}$ 是奇数，所以没有。`,
                  )
                : t(
                    `${answer === 1 ? `The only solution is $${fixed[0]}$` : `The solutions are $${fixed.join(", ")}$`}, so the count is $${answer}$.`,
                    `${answer === 1 ? `唯一的解是 $${fixed[0]}$` : `解是 $${fixed.join(", ")}$`}，所以个数是 $${answer}$。`,
                  ),
            ],
          ],
          answer === 0
            ? t(
                `For $v = 0$ the element gives $${a}$, and every vertex moves by an odd amount, $${a} - 2v$, so none stays.`,
                `$v = 0$ 时这个元素给出 $${a}$；每个顶点移动的量 $${a} - 2v$ 都是奇数，所以没有顶点不动。`,
              )
            : t(
                `${fixed.map((v) => `$${element} \\cdot ${v} = ${a} - ${v} \\equiv ${v} \\pmod{${n}}$`).join(" and ")}.`,
                `${fixed.map((v) => `$${element} \\cdot ${v} = ${a} - ${v} \\equiv ${v} \\pmod{${n}}$`).join("，")}。`,
              ),
        ),
      });
    },
  ),
  figure: algebraDrawings2["natural-actions-of-symmetric-and-dihedral-groups#the-vertices-a-reflection-fixes"],
};

/** deeperAbstractAlgebraThirdPoints maps topics of Abstract Algebra, on permutations, symmetries, cosets and the isomorphism theorems, to a third knowledge point. */
export const deeperAbstractAlgebraThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "subgroups-of-scalar-groups": [sumOfSubgroups],
  cycles: [cyclePower],
  "converting-between-permutations-and-cycles": [orderFromTwoLine],
  "the-inverse-of-a-cycle": [inverseOfProduct],
  "the-symmetry-group-of-a-tetrahedron": [tetrahedronGeometry],
  "the-symmetry-group-of-a-cube-rotations-and-reflections": [cubeFixedVertices],
  "the-symmetry-group-of-a-cube-combining-rotations-and-reflections": [cubeConjugate],
  "internal-direct-products": [directComponent],
  "cosets-of-the-additive-groups-of-integers-modulo-n": [cosetOrder],
  "cosets-of-infinite-scalar-groups": [rationalCosetOrder],
  "left-and-right-cosets-in-matrix-groups": [cosetEntry],
  "left-and-right-cosets-in-permutation-groups": [cosetCount],
  "maximal-normal-subgroups": [largestMaximal],
  "the-normalizer-of-a-subgroup": [normalizerOfCycle],
  "the-centralizer-of-a-subgroup": [centralizerByType],
  "simple-groups": [compositionLength],
  "the-image-of-a-group-homomorphism": [imageBetweenGroups],
  "the-first-isomorphism-theorem": [smallestKernel],
  "the-second-isomorphism-theorem": [intersectionFromSum],
  "the-third-isomorphism-theorem": [thirdChain],
  "natural-actions-of-symmetric-and-dihedral-groups": [reflectionFixedVertices],
};
