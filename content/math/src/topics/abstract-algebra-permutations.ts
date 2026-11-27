import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, type Mark, type Point, sketch } from "@ga/subject-math";
import { algebraDrawings1 } from "../explanation-drawings-abstract-algebra-1.ts";

import { article, numberProblem, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { factProblem, gcd, lcm, mod, phi, texChoice, textChoice } from "./abstract-algebra-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

/** apart keeps the typical mistakes whose values differ from the answer, each value once. */
const apart = <T extends { readonly value: unknown }>(answer: unknown, list: readonly T[]): T[] =>
  list.filter((m, i) => m.value !== answer && list.findIndex((x) => x.value === m.value) === i);

/** rPow writes the rotation rᵏ, without a redundant exponent. */
const rPow = (k: number) => (k === 0 ? "e" : k === 1 ? "r" : `r^{${k}}`);

// Abstract Algebra unit 3: permutations and cycles, symmetric and alternating groups, and symmetry groups of figures.

/** Perm is a permutation of {0, …, n − 1}, listing the image of each point; points are shown to learners as 1, …, n. */
export type Perm = readonly number[];

/** identityPerm is the identity permutation of n points. */
export const identityPerm = (n: number): Perm => range(0, n - 1);

/** composePerm is p ∘ q: apply q first, then p. */
export const composePerm = (p: Perm, q: Perm): Perm => q.map((x) => p[x]!);

/** invertPerm is the inverse permutation. */
export function invertPerm(p: Perm): Perm {
  const r: number[] = [];
  p.forEach((y, x) => {
    r[y] = x;
  });
  return r;
}

/** cyclePerm is the cycle through the given points, as a permutation of n points. */
export function cyclePerm(n: number, c: readonly number[]): Perm {
  const p = range(0, n - 1);
  c.forEach((x, i) => {
    p[x] = c[(i + 1) % c.length]!;
  });
  return p;
}

/** productOfCycles is the product c₁c₂⋯cₖ of cycles, composed from right to left. */
export const productOfCycles = (n: number, cs: readonly (readonly number[])[]): Perm =>
  cs.reduce<Perm>((acc, c) => composePerm(acc, cyclePerm(n, c)), identityPerm(n));

/** cyclesOf decomposes a permutation into disjoint cycles of length at least 2, each starting at its smallest point. */
export function cyclesOf(p: Perm): number[][] {
  const seen = new Set<number>();
  const cycles: number[][] = [];
  for (let i = 0; i < p.length; i++) {
    if (seen.has(i) || p[i] === i) continue;
    const c: number[] = [];
    for (let x = i; !seen.has(x); x = p[x]!) {
      seen.add(x);
      c.push(x);
    }
    cycles.push(c);
  }
  return cycles;
}

/** oneCycleTex writes one cycle in one-based notation, such as (1 3 5). */
export const oneCycleTex = (c: readonly number[]) => `(${c.map((x) => x + 1).join("\\;")})`;

/** cyclesTex writes a list of cycles side by side, or e for none. */
export const cyclesTex = (cs: readonly (readonly number[])[]) => (cs.length === 0 ? "e" : cs.map(oneCycleTex).join(""));

/** permCycleTex writes a permutation in disjoint cycle notation. */
export const permCycleTex = (p: Perm) => cyclesTex(cyclesOf(p));

/** permTex writes a permutation in two-line notation. */
export const permTex = (p: Perm) =>
  `\\begin{pmatrix} ${p.map((_, i) => i + 1).join(" & ")} \\\\ ${p.map((y) => y + 1).join(" & ")} \\end{pmatrix}`;

/** permOrder is the order of a permutation, the lcm of its cycle lengths. */
export const permOrder = (p: Perm) => cyclesOf(p).reduce((l, c) => lcm(l, c.length), 1);

/** transpositionCount is the least number of transpositions whose product is the permutation. */
export const transpositionCount = (p: Perm) => cyclesOf(p).reduce((s, c) => s + c.length - 1, 0);

/** isEven reports whether a permutation is even. */
export const isEven = (p: Perm) => transpositionCount(p) % 2 === 0;

/** randomPerm is a random non-identity permutation of n points. */
export function randomPerm(rng: Rng, n: number): Perm {
  let p: Perm;
  do p = rng.shuffle(range(0, n - 1));
  while (cyclesOf(p).length === 0);
  return p;
}

/** randomDisjointCycles picks disjoint cycles of the given lengths among n points. */
export function randomDisjointCycles(rng: Rng, n: number, lengths: readonly number[]): number[][] {
  const pts = rng.shuffle(range(0, n - 1));
  let at = 0;
  return lengths.map((k) => {
    const c = pts.slice(at, at + k);
    at += k;
    return c;
  });
}

/** overlappingCycles picks two cycles among n points that share at least one point. */
function overlappingCycles(rng: Rng, n: number): [number[], number[]] {
  let a: number[];
  let b: number[];
  do {
    a = rng.sample(range(0, n - 1), rng.int(2, 4));
    b = rng.sample(range(0, n - 1), rng.int(2, 4));
  } while (!a.some((x) => b.includes(x)));
  return [a, b];
}

/** mangled is a plausible wrong cycle notation for p: two points of a long cycle swapped, or two transpositions merged. */
function mangled(p: Perm): string {
  const cs = cyclesOf(p).map((c) => [...c]);
  const long = cs.find((c) => c.length >= 3);
  if (long) {
    const k = long.length;
    [long[k - 2], long[k - 1]] = [long[k - 1]!, long[k - 2]!];
  } else if (cs.length >= 2) cs.splice(0, 2, [...cs[0]!, ...cs[1]!]);
  else return cyclesTex([...cs, [p.length - 1, p.length - 2]].filter((c) => c.length > 0));
  return cyclesTex(cs);
}

/** COMPOSE_NOTE states the composition convention. */
const COMPOSE_NOTE = t(
  "Products are composed from right to left: $\\sigma\\tau$ applies $\\tau$ first.",
  "乘积从右向左复合：$\\sigma\\tau$ 先作用 $\\tau$。",
);

/** cycles introduces cycle notation and evaluates cycles and products of cycles. */
export const cycles: TopicDef = {
  id: "cycles",
  title: t("Cycles", "轮换"),
  summary: t(
    "A permutation of a finite set is a bijection from the set to itself. The cycle (a₁ a₂ … aₖ) sends a₁ to a₂, a₂ to a₃, …, aₖ to a₁, and fixes every other point. Permutations are multiplied by composition, from right to left.",
    "有限集的置换是该集合到自身的双射。轮换 (a₁ a₂ … aₖ) 把 a₁ 映到 a₂，a₂ 映到 a₃，……，aₖ 映到 a₁，并固定其余各点。置换的乘法是复合，从右向左进行。",
  ),
  intro: t(
    "In $S_5$, let $\\sigma = (1\\;4\\;2\\;5)$. Each entry goes to the next one: $\\sigma(1) = 4$, $\\sigma(4) = 2$, $\\sigma(2) = 5$, and the last entry wraps around to the first, so $\\sigma(5) = 1$. The point $3$ is missing from the cycle, so $\\sigma(3) = 3$. For a product, apply the right factor first: with $\\tau = (2\\;3)$, $\\sigma\\tau(3) = \\sigma(2) = 5$.\n\nCheck: following $\\sigma$ from $1$ gives $1 \\mapsto 4 \\mapsto 2 \\mapsto 5 \\mapsto 1$, back to the start after $4$ steps, one for each entry of the cycle.\n\nIn this lesson we read cycle notation, find images under cycles and evaluate products of cycles.",
    "在 $S_5$ 中，设 $\\sigma = (1\\;4\\;2\\;5)$。每一项映到下一项：$\\sigma(1) = 4$，$\\sigma(4) = 2$，$\\sigma(2) = 5$，最后一项绕回第一项，所以 $\\sigma(5) = 1$。点 $3$ 不在轮换中，所以 $\\sigma(3) = 3$。对于乘积，先作用右边的因子：设 $\\tau = (2\\;3)$，则 $\\sigma\\tau(3) = \\sigma(2) = 5$。\n\n检验：从 $1$ 出发沿 $\\sigma$ 走：$1 \\mapsto 4 \\mapsto 2 \\mapsto 5 \\mapsto 1$，走 $4$ 步回到起点，轮换中每一项一步。\n\n本课我们读懂轮换记法，求轮换下的像，并计算轮换的乘积。",
  ),
  prerequisites: ["permutations", "function-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "images-under-cycles",
      title: t("Applying a cycle", "作用一个轮换"),
      explanation: t(
        "A cycle sends each listed point to the next one, the last point back to the first, and leaves every other point fixed. In $S_6$, $\\sigma = (2\\;5\\;3\\;6)$ sends $2 \\mapsto 5$, $5 \\mapsto 3$, $3 \\mapsto 6$ and wraps around: $6 \\mapsto 2$. Points not in the cycle are fixed, so $\\sigma(1) = 1$.\n\nCheck: the images $5, 3, 6, 2$ of $2, 5, 3, 6$ are the same four points in a new order, as they must be for a bijection.\n\n> **Watch out.** Read the cycle from left to right: $\\sigma(5)$ is the entry after $5$, which is $3$, not the entry before it, which is $2$.",
        "一个轮换把每个列出的点送到下一个点，把最后一个点送回第一个点，其余的点保持不动。在 $S_6$ 中，$\\sigma = (2\\;5\\;3\\;6)$ 把 $2 \\mapsto 5$、$5 \\mapsto 3$、$3 \\mapsto 6$，并绕回 $6 \\mapsto 2$。不在轮换中的点保持不动，所以 $\\sigma(1) = 1$。\n\n检验：$2, 5, 3, 6$ 的像 $5, 3, 6, 2$ 是同样四个点换了顺序，双射正应如此。\n\n> **注意。** 轮换要从左往右读：$\\sigma(5)$ 是 $5$ 后面的数 $3$，而不是前面的数 $2$。",
      ),
      generate(rng) {
        const n = rng.int(5, 9);
        const c = rng.sample(range(0, n - 1), rng.int(3, Math.min(n, 7)));
        const x = rng.bool(0.8) ? rng.pick(c) : rng.int(0, n - 1);
        const p = cyclePerm(n, c);
        const value = p[x]! + 1;
        const inCycle = c.includes(x);
        const mistakes = inCycle
          ? apart(value, [
              why(
                invertPerm(p)[x]! + 1,
                `That is the entry before $${x + 1}$; $\\sigma$ sends each entry to the one after it.`,
                `那是 $${x + 1}$ 前面的数；$\\sigma$ 把每个数送到它后面的数。`,
              ),
              why(
                x + 1,
                `$${x + 1}$ appears in the cycle, so it is moved, not fixed.`,
                `$${x + 1}$ 出现在轮换中，所以它被移动，不是不动点。`,
              ),
              why(
                p[p[x]!]! + 1,
                "That moves two places along the cycle; one application moves one place.",
                "那是沿轮换移动了两位；作用一次只移动一位。",
              ),
            ])
          : apart(value, [
              why(
                c[0]! + 1,
                `$${x + 1}$ is not in the cycle, so it is fixed; it is not sent to the first entry.`,
                `$${x + 1}$ 不在轮换中，所以不动；它不会被送到第一个数。`,
              ),
              why(
                c[c.length - 1]! + 1,
                "That is the last entry, which wraps around to the first; a point outside the cycle is not moved at all.",
                "那是最后一个数，它绕回第一个数；不在轮换中的点根本不移动。",
              ),
              why(
                ((x + 1) % n) + 1,
                "The cycle does not add $1$ to a point; points outside it stay where they are.",
                "轮换不是把点加 $1$；不在其中的点保持不动。",
              ),
            ]);
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find $\\sigma(${x + 1})$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma(${x + 1})$。`,
          ),
          answer: value,
          mistakes,
          solution: inCycle
            ? walked(
                [
                  [
                    ["Find the point", "找到该点"],
                    t(`$${x + 1}$ appears in $${oneCycleTex(c)}$.`, `$${x + 1}$ 出现在 $${oneCycleTex(c)}$ 中。`),
                  ],
                  [
                    ["Take the next entry", "取下一个数"],
                    c[c.length - 1] === x
                      ? t(
                          `It is the last entry, so it wraps around to the first: $\\sigma(${x + 1}) = ${value}$.`,
                          `它是最后一个数，所以绕回第一个数：$\\sigma(${x + 1}) = ${value}$。`,
                        )
                      : t(
                          `The entry after it is $${value}$, so $\\sigma(${x + 1}) = ${value}$.`,
                          `它后面的数是 $${value}$，所以 $\\sigma(${x + 1}) = ${value}$。`,
                        ),
                  ],
                ],
                t(
                  `In the cycle, the entry just before $${value}$ is $${x + 1}$, so $\\sigma^{-1}(${value}) = ${x + 1}$.`,
                  `在轮换中，紧挨在 $${value}$ 前面的是 $${x + 1}$，所以 $\\sigma^{-1}(${value}) = ${x + 1}$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Look for the point", "寻找该点"],
                    t(
                      `$${x + 1}$ does not appear in $${oneCycleTex(c)}$, so it is fixed: $\\sigma(${x + 1}) = ${value}$.`,
                      `$${x + 1}$ 不出现在 $${oneCycleTex(c)}$ 中，所以不动：$\\sigma(${x + 1}) = ${value}$。`,
                    ),
                  ],
                ],
                t(
                  `The entries of the cycle are $${c.map((v) => v + 1).join(", ")}$, and $${x + 1}$ is not among them.`,
                  `轮换中的数为 $${c.map((v) => v + 1).join(", ")}$，其中没有 $${x + 1}$。`,
                ),
              ),
        });
      },
    },
    {
      id: "products-of-cycles",
      title: t("Products of cycles", "轮换的乘积"),
      explanation: t(
        "A product of permutations is a composition of functions, so the factor on the right acts first, just as with ordinary functions. To evaluate $\\sigma\\tau$ at a point, apply $\\tau$ first and then $\\sigma$. With $\\sigma = (1\\;3\\;4)$ and $\\tau = (1\\;2)$: $\\tau(1) = 2$ and $\\sigma(2) = 2$, so $\\sigma\\tau(1) = 2$.\n\nCheck: in the other order, $\\sigma(1) = 3$ and $\\tau(3) = 3$, so $\\tau\\sigma(1) = 3$. The two products differ, so the order of the factors matters.\n\n> **Watch out.** Do not read the product from left to right: $\\sigma\\tau$ applies $\\tau$ first, even though $\\sigma$ is written first.",
        "置换的乘积是函数的复合，所以右边的因子先作用，与普通函数一样。求 $\\sigma\\tau$ 在某点的值时，先作用 $\\tau$，再作用 $\\sigma$。设 $\\sigma = (1\\;3\\;4)$、$\\tau = (1\\;2)$：$\\tau(1) = 2$，$\\sigma(2) = 2$，所以 $\\sigma\\tau(1) = 2$。\n\n检验：换个顺序，$\\sigma(1) = 3$，$\\tau(3) = 3$，所以 $\\tau\\sigma(1) = 3$。两个乘积不同，所以因子的顺序很重要。\n\n> **注意。** 乘积不能从左往右读：$\\sigma\\tau$ 先作用 $\\tau$，尽管 $\\sigma$ 写在前面。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(5, 8);
          const [a, b] = overlappingCycles(rng, n);
          const pa = cyclePerm(n, a);
          const pb = cyclePerm(n, b);
          const x = rng.pick([...a, ...b]);
          const mid = pb[x]!;
          const value = pa[mid]! + 1;
          const mistakes = apart(value, [
            why(
              pb[pa[x]!]! + 1,
              "That applies $\\sigma$ first; in $\\sigma\\tau$ the factor $\\tau$ on the right acts first.",
              "那是先作用了 $\\sigma$；在 $\\sigma\\tau$ 中右边的 $\\tau$ 先作用。",
            ),
            why(pa[x]! + 1, "That applies only $\\sigma$; $\\tau$ must act first.", "那只作用了 $\\sigma$；必须先作用 $\\tau$。"),
            why(
              mid + 1,
              "That applies only $\\tau$; $\\sigma$ still has to act on the result.",
              "那只作用了 $\\tau$；还要对结果作用 $\\sigma$。",
            ),
            why(x + 1, "The point is moved by the product; check each factor in turn.", "这个点被乘积移动了；要依次检查每个因子。"),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(a)}$ and $\\tau = ${oneCycleTex(b)}$. ${COMPOSE_NOTE.en} Find $\\sigma\\tau(${x + 1})$.`,
              `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(a)}$，$\\tau = ${oneCycleTex(b)}$。${COMPOSE_NOTE["zh-CN"]}求 $\\sigma\\tau(${x + 1})$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [["Apply τ first", "先作用 τ"], t(`$\\tau(${x + 1}) = ${mid + 1}$.`, `$\\tau(${x + 1}) = ${mid + 1}$。`)],
                [
                  ["Then apply σ", "再作用 σ"],
                  t(
                    `$\\sigma(${mid + 1}) = ${value}$, so $\\sigma\\tau(${x + 1}) = ${value}$.`,
                    `$\\sigma(${mid + 1}) = ${value}$，所以 $\\sigma\\tau(${x + 1}) = ${value}$。`,
                  ),
                ],
              ],
              t(
                `Going back, $\\sigma^{-1}(${value}) = ${mid + 1}$ and $\\tau^{-1}(${mid + 1}) = ${x + 1}$, which returns to the start.`,
                `反过来，$\\sigma^{-1}(${value}) = ${mid + 1}$，$\\tau^{-1}(${mid + 1}) = ${x + 1}$，回到了起点。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** convertingBetweenPermutationsAndCycles converts between two-line and cycle notation. */
export const convertingBetweenPermutationsAndCycles: TopicDef = {
  id: "converting-between-permutations-and-cycles",
  title: t("Converting Between Permutations and Cycles", "置换与轮换的互化"),
  summary: t(
    "Every permutation is a product of disjoint cycles, unique up to order. To find them, start at the smallest point not yet used and follow it until it returns; fixed points are usually omitted. Disjoint cycles commute.",
    "每个置换都是不相交轮换之积，除顺序外唯一。求法是从尚未用过的最小点出发，沿着映射走直到回到起点；不动点通常省略。不相交的轮换可交换。",
  ),
  intro: t(
    "Take $\\pi = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 3 & 6 & 4 & 1 & 5 & 2 \\end{pmatrix}$. Start at $1$ and follow the images: $1 \\mapsto 3 \\mapsto 4 \\mapsto 1$, which closes the cycle $(1\\;3\\;4)$. The smallest unused point is $2$: $2 \\mapsto 6 \\mapsto 2$ gives $(2\\;6)$. The point $5$ is fixed. So $\\pi = (1\\;3\\;4)(2\\;6)$.\n\nCheck: going back, $(1\\;3\\;4)(2\\;6)$ sends $1, 2, 3, 4, 5, 6$ to $3, 6, 4, 1, 5, 2$, exactly the bottom row of $\\pi$.\n\nIn this lesson we convert permutations from two-line notation to disjoint cycles and back.",
    "设 $\\pi = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 3 & 6 & 4 & 1 & 5 & 2 \\end{pmatrix}$。从 $1$ 出发追踪像：$1 \\mapsto 3 \\mapsto 4 \\mapsto 1$，闭合成轮换 $(1\\;3\\;4)$。未用过的最小点是 $2$：$2 \\mapsto 6 \\mapsto 2$ 得 $(2\\;6)$。点 $5$ 不动。所以 $\\pi = (1\\;3\\;4)(2\\;6)$。\n\n检验：反过来，$(1\\;3\\;4)(2\\;6)$ 把 $1, 2, 3, 4, 5, 6$ 依次送到 $3, 6, 4, 1, 5, 2$，正是 $\\pi$ 的下行。\n\n本课我们把置换从两行记法化为不相交轮换，也从轮换化回两行记法。",
  ),
  prerequisites: ["cycles"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-permutations-as-cycles",
      title: t("Two-line notation to cycles", "两行记法化为轮换"),
      explanation: t(
        "Follow a point to its image, then to the image of that, until you return; this closes one cycle, and then start again with an unused point. For $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 3 & 5 & 4 & 1 & 2 \\end{pmatrix}$: $1 \\mapsto 3 \\mapsto 4 \\mapsto 1$ gives $(1\\;3\\;4)$, and $2 \\mapsto 5 \\mapsto 2$ gives $(2\\;5)$. So the permutation is $(1\\;3\\;4)(2\\;5)$.\n\nCheck: the cycles use $3 + 2 = 5$ points, every point exactly once, and $(1\\;3\\;4)(2\\;5)$ sends $4 \\mapsto 1$, as the bottom row says under $4$.\n\n> **Watch out.** Follow the arrows from the top row to the bottom row; following them from the bottom row up gives the inverse permutation.",
        "从一个点追踪到它的像，再追踪到像的像，直到回到起点；这样就完成一个轮换，然后从一个未用过的点重新开始。对 $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 3 & 5 & 4 & 1 & 2 \\end{pmatrix}$：$1 \\mapsto 3 \\mapsto 4 \\mapsto 1$ 得 $(1\\;3\\;4)$，$2 \\mapsto 5 \\mapsto 2$ 得 $(2\\;5)$。所以该置换为 $(1\\;3\\;4)(2\\;5)$。\n\n检验：这些轮换用了 $3 + 2 = 5$ 个点，每个点恰好一次；且 $(1\\;3\\;4)(2\\;5)$ 把 $4 \\mapsto 1$，与下行中 $4$ 下方的数一致。\n\n> **注意。** 要从上行追到下行；从下行往上追得到的是逆置换。",
      ),
      generate(rng) {
        const p = randomPerm(rng, rng.int(5, 8));
        const cs = cyclesOf(p);
        const moved = cs.reduce((s, c) => s + c.length, 0);
        const [i, j, k] = rng.sample(range(0, p.length - 1), 3) as [number, number, number];
        const swap = (u: number, v: number) => p.map((y, x) => (x === u ? p[v]! : x === v ? p[u]! : y));
        const misread = [permCycleTex(swap(i, j)), permCycleTex(swap(j, k))];
        const reasons: Reason[] = [
          [
            `$${permCycleTex(invertPerm(p))}$`,
            "That is the inverse: it follows each point from the bottom row up instead of from the top row down.",
            "那是逆置换：它是从下行往上追，而不是从上行往下追。",
          ],
          ...misread.map(
            (m): Reason => [
              `$${m}$`,
              "That misreads two columns: two points get each other's images.",
              "那读错了两列：有两个点的像互换了。",
            ],
          ),
          [
            `$${mangled(p)}$`,
            "Two points in it are out of order or two cycles are merged, so it sends some point to the wrong image.",
            "其中有两个点顺序错了，或有两个轮换被合并了，所以它把某个点送错了地方。",
          ],
          [
            `$${permCycleTex(composePerm(p, p))}$`,
            "That sends each point two steps along; it is the square of the permutation.",
            "那是把每个点沿轮换送两步；它是这个置换的平方。",
          ],
          [
            `$${mangled(invertPerm(p))}$`,
            "That is a garbled form of the inverse, read from the bottom row up.",
            "那是逆置换的错乱形式，是从下行往上读的。",
          ],
        ];
        return reasoned(
          texChoice(
            rng,
            t(`Write $${permTex(p)}$ as a product of disjoint cycles.`, `把 $${permTex(p)}$ 写成不相交轮换之积。`),
            permCycleTex(p),
            [permCycleTex(invertPerm(p)), mangled(p), permCycleTex(composePerm(p, p)), mangled(invertPerm(p)), ...misread],
            walked(
              [
                [
                  ["Follow each point", "追踪每个点"],
                  t(
                    `Start at the smallest unused point and follow it until it returns: ${cs.map((c) => `$${[...c, c[0]!].map((v) => v + 1).join(" \\mapsto ")}$`).join(", ")}.`,
                    `从未用过的最小点出发，追踪到回到起点：${cs.map((c) => `$${[...c, c[0]!].map((v) => v + 1).join(" \\mapsto ")}$`).join("，")}。`,
                  ),
                ],
                [["Write the cycles", "写出轮换"], t(`The permutation is $${permCycleTex(p)}$.`, `该置换为 $${permCycleTex(p)}$。`)],
              ],
              moved === p.length
                ? t(`The cycles use all $${p.length}$ points, each exactly once.`, `这些轮换用到了全部 $${p.length}$ 个点，每个恰好一次。`)
                : t(
                    `The cycles move $${moved}$ points, and the other $${p.length - moved}$ are fixed points, so every point is accounted for once.`,
                    `这些轮换移动了 $${moved}$ 个点，其余 $${p.length - moved}$ 个是不动点，所以每个点恰好出现一次。`,
                  ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "writing-cycles-as-permutations",
      title: t("Cycles to two-line notation", "轮换化为两行记法"),
      explanation: t(
        "Two line notation lists the image of every point, so find where each point goes under the product of cycles. To write $(1\\;4)(2\\;3\\;5)$ in two-line notation, record the image of each point: $1 \\mapsto 4$, $2 \\mapsto 3$, $3 \\mapsto 5$, $4 \\mapsto 1$, $5 \\mapsto 2$, giving $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 4 & 3 & 5 & 1 & 2 \\end{pmatrix}$.\n\nCheck: the bottom row $4, 3, 5, 1, 2$ lists each of $1$ to $5$ exactly once, as the images of a permutation must.\n\n> **Watch out.** A point missing from every cycle is fixed and still gets a column, with itself underneath.",
        "两行记法列出每个点的像，所以要求出每个点在这些轮换的乘积下去哪里。要把 $(1\\;4)(2\\;3\\;5)$ 写成两行记法，就记下每个点的像：$1 \\mapsto 4$、$2 \\mapsto 3$、$3 \\mapsto 5$、$4 \\mapsto 1$、$5 \\mapsto 2$，得 $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 4 & 3 & 5 & 1 & 2 \\end{pmatrix}$。\n\n检验：下行 $4, 3, 5, 1, 2$ 中 $1$ 到 $5$ 各出现一次，置换的像正应如此。\n\n> **注意。** 不在任何轮换中的点是不动点，它仍占一列，下方写它自己。",
      ),
      generate(rng) {
        const p = randomPerm(rng, rng.int(5, 7));
        const swapped = [...p];
        const [i, j] = rng.sample(range(0, p.length - 1), 2);
        [swapped[i!], swapped[j!]] = [swapped[j!]!, swapped[i!]!];
        const images = p.map((y, x) => `${x + 1} \\mapsto ${y + 1}`).join(", ");
        const reasons: Reason[] = [
          [
            `$${permTex(invertPerm(p))}$`,
            "That is the inverse: under each point it writes the point before it in its cycle, not the one after.",
            "那是逆置换：每个点下方写的是轮换中它前面的点，而不是后面的点。",
          ],
          [
            `$${permTex(swapped)}$`,
            `Two images are exchanged: compare it with ${"$"}${images}$.`,
            `有两个像被交换了：与 ${"$"}${images}$ 比较。`,
          ],
          [
            `$${permTex(composePerm(p, p))}$`,
            "That moves each point two steps along its cycle; it is the square.",
            "那是把每个点沿轮换移动两步；它是平方。",
          ],
        ];
        return reasoned(
          texChoice(
            rng,
            t(
              `Write $${permCycleTex(p)}$ in $S_{${p.length}}$ in two-line notation.`,
              `把 $S_{${p.length}}$ 中的 $${permCycleTex(p)}$ 写成两行记法。`,
            ),
            permTex(p),
            [permTex(invertPerm(p)), permTex(swapped), permTex(composePerm(p, p))],
            walked(
              [
                [
                  ["Find each image", "求每个像"],
                  t(
                    `Read each point's image from its cycle, fixed points mapping to themselves: $${images}$.`,
                    `从轮换中读出每个点的像，不动点映到自身：$${images}$。`,
                  ),
                ],
                [["Write the rows", "写出两行"], t(`So the permutation is $${permTex(p)}$.`, `所以该置换为 $${permTex(p)}$。`)],
              ],
              t(`The bottom row lists each of $1$ to $${p.length}$ exactly once.`, `下行中 $1$ 到 $${p.length}$ 各出现一次。`),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** theInverseOfACycle inverts cycles. */
export const theInverseOfACycle: TopicDef = {
  id: "the-inverse-of-a-cycle",
  title: t("The Inverse of a Cycle", "轮换的逆"),
  summary: t(
    "The inverse of a cycle lists the same points in reverse order: (a₁ a₂ … aₖ)⁻¹ = (aₖ … a₂ a₁). A transposition (a b) is its own inverse.",
    "轮换的逆是把同样的点倒序排列：(a₁ a₂ … aₖ)⁻¹ = (aₖ … a₂ a₁)。对换 (a b) 是它自身的逆。",
  ),
  intro: t(
    "The inverse of a cycle runs it backward. For $\\sigma = (2\\;5\\;1\\;4)$, $\\sigma$ sends $2 \\mapsto 5 \\mapsto 1 \\mapsto 4 \\mapsto 2$, so $\\sigma^{-1}$ sends $2 \\mapsto 4 \\mapsto 1 \\mapsto 5 \\mapsto 2$: $\\sigma^{-1} = (2\\;4\\;1\\;5)$, which starting from its smallest entry is $(1\\;5\\;2\\;4)$. In particular $\\sigma^{-1}(1) = 5$, the entry just before $1$ in $\\sigma$.\n\nCheck: $\\sigma^{-1}(2) = 4$ and $\\sigma(4) = 2$, so $\\sigma\\sigma^{-1}$ sends $2$ back to $2$, and the same happens at every point.\n\nIn this lesson we invert cycles and find images under inverse cycles.",
    "轮换的逆就是把它倒着走。对 $\\sigma = (2\\;5\\;1\\;4)$，$\\sigma$ 把 $2 \\mapsto 5 \\mapsto 1 \\mapsto 4 \\mapsto 2$，所以 $\\sigma^{-1}$ 把 $2 \\mapsto 4 \\mapsto 1 \\mapsto 5 \\mapsto 2$：$\\sigma^{-1} = (2\\;4\\;1\\;5)$，从最小项开始写就是 $(1\\;5\\;2\\;4)$。特别地，$\\sigma^{-1}(1) = 5$，即 $\\sigma$ 中 $1$ 前面的那一项。\n\n检验：$\\sigma^{-1}(2) = 4$，$\\sigma(4) = 2$，所以 $\\sigma\\sigma^{-1}$ 把 $2$ 送回 $2$，其余每个点也是如此。\n\n本课我们求轮换的逆，并求逆轮换下的像。",
  ),
  prerequisites: ["cycles"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverting-cycles",
      title: t("Inverting a cycle", "求轮换的逆"),
      explanation: t(
        "Undoing a cycle means sending each point back to the one before it, which is the same cycle listed in reverse order. $(1\\;4\\;2\\;6)^{-1} = (6\\;2\\;4\\;1)$, which starting from the smallest point is $(1\\;6\\;2\\;4)$.\n\nCheck: $(1\\;4\\;2\\;6)$ sends $1 \\mapsto 4$, and $(1\\;6\\;2\\;4)$ sends $4 \\mapsto 1$, so together they return $1$ to itself.\n\n> **Watch out.** Writing the same cycle from a different starting point, such as $(4\\;2\\;6\\;1)$, does not invert it: that is the same cycle again.",
        "撤销一个轮换就是把每个点送回它前面的点，这就是把同一个轮换倒序列出。$(1\\;4\\;2\\;6)^{-1} = (6\\;2\\;4\\;1)$，从最小点开始写为 $(1\\;6\\;2\\;4)$。\n\n检验：$(1\\;4\\;2\\;6)$ 把 $1 \\mapsto 4$，而 $(1\\;6\\;2\\;4)$ 把 $4 \\mapsto 1$，两者合起来使 $1$ 回到自身。\n\n> **注意。** 从另一个起点写同一个轮换，例如 $(4\\;2\\;6\\;1)$，并不是取逆：它还是原来的轮换。",
      ),
      generate(rng) {
        const n = rng.int(6, 9);
        const c = rng.sample(range(0, n - 1), rng.int(4, Math.min(n, 7)));
        const p = cyclePerm(n, c);
        const others = range(1, 4).map(() => permCycleTex(cyclePerm(n, rng.shuffle(c))));
        const inverse = permCycleTex(invertPerm(p));
        const reasons: Reason[] = [
          [`$${oneCycleTex(c)}$`, "That is the cycle itself, not its inverse.", "那是轮换本身，不是它的逆。"],
          [
            `$${permCycleTex(composePerm(p, p))}$`,
            "That is the square: it moves each point two places forward instead of one place back.",
            "那是平方：它把每个点向前移两位，而不是向后移一位。",
          ],
          ...others.map(
            (o): Reason => [
              `$${o}$`,
              o === permCycleTex(p)
                ? "That is the cycle itself, only written from another starting point."
                : "Those points are shuffled into a different order; the inverse keeps the order and reverses it.",
              o === permCycleTex(p) ? "那是轮换本身，只是换了起点来写。" : "那些点被打乱成别的顺序；逆是保持顺序再倒过来。",
            ],
          ),
        ];
        return reasoned(
          texChoice(
            rng,
            t(`In $S_{${n}}$, find $${oneCycleTex(c)}^{-1}$.`, `在 $S_{${n}}$ 中，求 $${oneCycleTex(c)}^{-1}$。`),
            inverse,
            [oneCycleTex(c), permCycleTex(composePerm(p, p)), ...others],
            walked(
              [
                [
                  ["Reverse the order", "倒序排列"],
                  t(
                    `$${oneCycleTex(c)}^{-1} = ${oneCycleTex([...c].reverse())}$.`,
                    `$${oneCycleTex(c)}^{-1} = ${oneCycleTex([...c].reverse())}$。`,
                  ),
                ],
                [["Start at the smallest point", "从最小点开始写"], t(`This is $${inverse}$.`, `这就是 $${inverse}$。`)],
              ],
              t(
                `$${oneCycleTex(c)}$ sends $${c[0]! + 1} \\mapsto ${c[1]! + 1}$, and $${inverse}$ sends $${c[1]! + 1} \\mapsto ${c[0]! + 1}$, so the product fixes $${c[0]! + 1}$.`,
                `$${oneCycleTex(c)}$ 把 $${c[0]! + 1} \\mapsto ${c[1]! + 1}$，而 $${inverse}$ 把 $${c[1]! + 1} \\mapsto ${c[0]! + 1}$，所以乘积固定 $${c[0]! + 1}$。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "images-under-inverse-cycles",
      title: t("Evaluating an inverse cycle", "求逆轮换的值"),
      explanation: t(
        "$\\sigma^{-1}(x)$ is the point that $\\sigma$ sends to $x$: the point just before $x$ in the cycle. For $\\sigma = (3\\;1\\;5\\;2)$, $\\sigma^{-1}(5) = 1$ and $\\sigma^{-1}(3) = 2$.\n\nCheck: $\\sigma(1) = 5$ and $\\sigma(2) = 3$, wrapping around from the last entry, so both answers are sent back where they came from.\n\n> **Watch out.** For the first entry of the cycle, the point before it is the last entry: $\\sigma^{-1}(3) = 2$, not a point outside the cycle.",
        "$\\sigma^{-1}(x)$ 是被 $\\sigma$ 映到 $x$ 的点，即轮换中紧挨在 $x$ 前面的点。对 $\\sigma = (3\\;1\\;5\\;2)$，$\\sigma^{-1}(5) = 1$，$\\sigma^{-1}(3) = 2$。\n\n检验：$\\sigma(1) = 5$，$\\sigma(2) = 3$（从最后一个数绕回），所以两个答案都被送回原处。\n\n> **注意。** 对轮换的第一个数，它前面的点是最后一个数：$\\sigma^{-1}(3) = 2$，而不是轮换外的某个点。",
      ),
      generate(rng) {
        const n = rng.int(5, 9);
        const c = rng.sample(range(0, n - 1), rng.int(3, Math.min(n, 7)));
        const x = rng.pick(c);
        const p = cyclePerm(n, c);
        const value = invertPerm(p)[x]! + 1;
        const first = c[0] === x;
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find $\\sigma^{-1}(${x + 1})$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma^{-1}(${x + 1})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              p[x]! + 1,
              `That is $\\sigma(${x + 1})$, the entry after $${x + 1}$; the inverse takes the entry before it.`,
              `那是 $\\sigma(${x + 1})$，即 $${x + 1}$ 后面的数；逆取的是它前面的数。`,
            ),
            why(x + 1, `$${x + 1}$ is in the cycle, so $\\sigma^{-1}$ moves it.`, `$${x + 1}$ 在轮换中，所以 $\\sigma^{-1}$ 会移动它。`),
            why(
              invertPerm(p)[invertPerm(p)[x]!]! + 1,
              "That steps back two places; the inverse steps back one.",
              "那是向后退了两位；逆只退一位。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the point", "找到该点"],
                t(`$${x + 1}$ appears in $${oneCycleTex(c)}$.`, `$${x + 1}$ 出现在 $${oneCycleTex(c)}$ 中。`),
              ],
              [
                ["Take the entry before it", "取它前面的数"],
                first
                  ? t(
                      `It is the first entry, so the entry before it is the last one: $\\sigma^{-1}(${x + 1}) = ${value}$.`,
                      `它是第一个数，所以它前面的是最后一个数：$\\sigma^{-1}(${x + 1}) = ${value}$。`,
                    )
                  : t(
                      `The entry before it is $${value}$, so $\\sigma^{-1}(${x + 1}) = ${value}$.`,
                      `它前面的数是 $${value}$，所以 $\\sigma^{-1}(${x + 1}) = ${value}$。`,
                    ),
              ],
            ],
            t(
              `$\\sigma(${value}) = ${x + 1}$, so $\\sigma$ sends the answer back to $${x + 1}$.`,
              `$\\sigma(${value}) = ${x + 1}$，所以 $\\sigma$ 把答案送回 $${x + 1}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theInverseOfAPermutation inverts permutations in two-line notation and products of cycles. */
export const theInverseOfAPermutation: TopicDef = {
  id: "the-inverse-of-a-permutation",
  title: t("The Inverse of a Permutation", "置换的逆"),
  summary: t(
    "The inverse of a permutation in two-line notation is found by swapping the two rows and re-sorting the columns. The inverse of a product reverses the order: (στ)⁻¹ = τ⁻¹σ⁻¹; for a product of disjoint cycles, invert each cycle.",
    "两行记法下置换的逆，只需交换两行并重新按列排序。乘积的逆要反转顺序：(στ)⁻¹ = τ⁻¹σ⁻¹；对不相交轮换之积，把每个轮换分别取逆。",
  ),
  intro: t(
    "Let $\\pi = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 4 & 1 & 5 & 2 & 3 \\end{pmatrix}$. To find $\\pi^{-1}(3)$, look for $3$ in the bottom row: it sits under $5$, so $\\pi^{-1}(3) = 5$. Doing this for every point, $\\pi^{-1} = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 2 & 4 & 5 & 1 & 3 \\end{pmatrix}$. For a product the order reverses: $(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$.\n\nCheck: $\\pi(\\pi^{-1}(3)) = \\pi(5) = 3$ and $\\pi(\\pi^{-1}(1)) = \\pi(2) = 1$, so $\\pi$ undoes what $\\pi^{-1}$ does.\n\nIn this lesson we read inverses from two-line notation and invert products of cycles.",
    "设 $\\pi = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 4 & 1 & 5 & 2 & 3 \\end{pmatrix}$。求 $\\pi^{-1}(3)$ 时，在下行中找 $3$：它在 $5$ 的下方，所以 $\\pi^{-1}(3) = 5$。对每个点都这样做，得 $\\pi^{-1} = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 2 & 4 & 5 & 1 & 3 \\end{pmatrix}$。对于乘积，顺序要反过来：$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$。\n\n检验：$\\pi(\\pi^{-1}(3)) = \\pi(5) = 3$，$\\pi(\\pi^{-1}(1)) = \\pi(2) = 1$，所以 $\\pi$ 撤销了 $\\pi^{-1}$ 的作用。\n\n本课我们从两行记法读出逆置换，并求轮换乘积的逆。",
  ),
  prerequisites: ["converting-between-permutations-and-cycles", "the-inverse-of-a-cycle"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverses-in-two-line-notation",
      title: t("Inverses in two-line notation", "两行记法下的逆"),
      explanation: t(
        "To find $\\sigma^{-1}(x)$, find $x$ in the bottom row; the entry above it is the answer. For $\\sigma = \\begin{pmatrix} 1 & 2 & 3 & 4 \\\\ 3 & 1 & 4 & 2 \\end{pmatrix}$, $\\sigma^{-1}(4) = 3$.\n\nCheck: the column of $3$ reads $3$ over $4$, so $\\sigma(3) = 4$, and $\\sigma$ sends the answer back to $4$.\n\n> **Watch out.** Looking up $4$ in the top row gives $\\sigma(4) = 2$, which is $\\sigma$, not its inverse.",
        "求 $\\sigma^{-1}(x)$ 时，在下行中找到 $x$，它上方的数就是答案。对 $\\sigma = \\begin{pmatrix} 1 & 2 & 3 & 4 \\\\ 3 & 1 & 4 & 2 \\end{pmatrix}$，$\\sigma^{-1}(4) = 3$。\n\n检验：$3$ 所在的列是 $3$ 上 $4$ 下，所以 $\\sigma(3) = 4$，$\\sigma$ 把答案送回 $4$。\n\n> **注意。** 在上行中找 $4$ 得到的是 $\\sigma(4) = 2$，那是 $\\sigma$ 本身，不是它的逆。",
      ),
      generate(rng) {
        for (;;) {
          const p = randomPerm(rng, rng.int(5, 8));
          let x: number;
          do x = rng.int(0, p.length - 1);
          while (p[x] === x);
          const value = invertPerm(p)[x]! + 1;
          const mistakes = apart(value, [
            why(
              p[x]! + 1,
              `That is $\\sigma(${x + 1})$, read from the top row; the inverse is read from the bottom row.`,
              `那是 $\\sigma(${x + 1})$，是从上行读的；逆要从下行读。`,
            ),
            why(
              p[p[x]!]! + 1,
              "That applies $\\sigma$ twice; the inverse undoes $\\sigma$ once.",
              "那是作用了两次 $\\sigma$；逆是撤销一次 $\\sigma$。",
            ),
            why(
              x + 1,
              `$${x + 1}$ is not a fixed point of $\\sigma$, so the inverse moves it too.`,
              `$${x + 1}$ 不是 $\\sigma$ 的不动点，所以逆也会移动它。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `Let $\\sigma = ${permTex(p)}$. Find $\\sigma^{-1}(${x + 1})$.`,
              `设 $\\sigma = ${permTex(p)}$。求 $\\sigma^{-1}(${x + 1})$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Find it in the bottom row", "在下行中找到它"],
                  t(`$${x + 1}$ appears in the bottom row in the column of $${value}$.`, `$${x + 1}$ 出现在下行中 $${value}$ 那一列。`),
                ],
                [
                  ["Read the top row", "读上行"],
                  t(`So $\\sigma^{-1}(${x + 1}) = ${value}$.`, `所以 $\\sigma^{-1}(${x + 1}) = ${value}$。`),
                ],
              ],
              t(
                `$\\sigma(${value}) = ${x + 1}$, so $\\sigma$ sends the answer back to $${x + 1}$.`,
                `$\\sigma(${value}) = ${x + 1}$，所以 $\\sigma$ 把答案送回 $${x + 1}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "inverses-of-products-of-cycles",
      title: t("Inverses of products", "乘积的逆"),
      explanation: t(
        "The inverse of a product reverses the order of the factors and inverts each, so the last factor applied is undone first. $(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$: to evaluate it at $x$, apply $\\sigma^{-1}$ first, then $\\tau^{-1}$. With $\\sigma = (1\\;2\\;3)$ and $\\tau = (1\\;4)$: $\\sigma^{-1}(1) = 3$ and $\\tau^{-1}(3) = 3$, so $(\\sigma\\tau)^{-1}(1) = 3$.\n\nCheck: $\\sigma\\tau$ sends $3$ to $\\sigma(\\tau(3)) = \\sigma(3) = 1$, so $(\\sigma\\tau)^{-1}$ does send $1$ back to $3$.\n\n> **Watch out.** $(\\sigma\\tau)^{-1}$ is not $\\sigma^{-1}\\tau^{-1}$: applying $\\tau^{-1}$ first gives $\\sigma^{-1}(\\tau^{-1}(1)) = \\sigma^{-1}(4) = 4$, which is wrong.",
        "乘积的逆把因子的顺序反过来并把每个因子取逆，所以最后作用的因子最先被撤销。$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$：求它在 $x$ 处的值时，先作用 $\\sigma^{-1}$，再作用 $\\tau^{-1}$。设 $\\sigma = (1\\;2\\;3)$、$\\tau = (1\\;4)$：$\\sigma^{-1}(1) = 3$，$\\tau^{-1}(3) = 3$，所以 $(\\sigma\\tau)^{-1}(1) = 3$。\n\n检验：$\\sigma\\tau$ 把 $3$ 送到 $\\sigma(\\tau(3)) = \\sigma(3) = 1$，所以 $(\\sigma\\tau)^{-1}$ 确实把 $1$ 送回 $3$。\n\n> **注意。** $(\\sigma\\tau)^{-1}$ 不是 $\\sigma^{-1}\\tau^{-1}$：先作用 $\\tau^{-1}$ 得 $\\sigma^{-1}(\\tau^{-1}(1)) = \\sigma^{-1}(4) = 4$，这是错的。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(5, 8);
          const [a, b] = overlappingCycles(rng, n);
          const sa = cyclePerm(n, a);
          const sb = cyclePerm(n, b);
          const ia = invertPerm(sa);
          const ib = invertPerm(sb);
          const x = rng.pick([...a, ...b]);
          const value = ib[ia[x]!]! + 1;
          const mistakes = apart(value, [
            why(
              ia[ib[x]!]! + 1,
              "That applies $\\tau^{-1}$ first; the inverse of $\\sigma\\tau$ undoes $\\sigma$ first, since $\\sigma$ was applied last.",
              "那是先作用 $\\tau^{-1}$；$\\sigma\\tau$ 的逆要先撤销 $\\sigma$，因为 $\\sigma$ 是最后作用的。",
            ),
            why(sa[sb[x]!]! + 1, "That is $\\sigma\\tau$ itself, not its inverse.", "那是 $\\sigma\\tau$ 本身，不是它的逆。"),
            why(ib[x]! + 1, "That only undoes $\\tau$; $\\sigma$ must be undone too.", "那只撤销了 $\\tau$；$\\sigma$ 也要撤销。"),
            why(
              x + 1,
              `$${x + 1}$ is moved by the product, so its inverse moves it too.`,
              `$${x + 1}$ 被这个乘积移动，所以它的逆也会移动它。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(a)}$ and $\\tau = ${oneCycleTex(b)}$. ${COMPOSE_NOTE.en} Find $(\\sigma\\tau)^{-1}(${x + 1})$.`,
              `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(a)}$，$\\tau = ${oneCycleTex(b)}$。${COMPOSE_NOTE["zh-CN"]}求 $(\\sigma\\tau)^{-1}(${x + 1})$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Reverse the factors", "反转因子顺序"],
                  t(
                    "$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$, so apply $\\sigma^{-1}$ first.",
                    "$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$，所以先作用 $\\sigma^{-1}$。",
                  ),
                ],
                [
                  ["Undo σ", "撤销 σ"],
                  ia[x] === x
                    ? t(
                        `$\\sigma$ fixes $${x + 1}$, so $\\sigma^{-1}(${x + 1}) = ${x + 1}$.`,
                        `$\\sigma$ 固定 $${x + 1}$，所以 $\\sigma^{-1}(${x + 1}) = ${x + 1}$。`,
                      )
                    : t(
                        `$\\sigma^{-1}(${x + 1}) = ${ia[x]! + 1}$, the point before $${x + 1}$ in $\\sigma$.`,
                        `$\\sigma^{-1}(${x + 1}) = ${ia[x]! + 1}$，即 $\\sigma$ 中 $${x + 1}$ 前面的点。`,
                      ),
                ],
                [["Undo τ", "撤销 τ"], t(`$\\tau^{-1}(${ia[x]! + 1}) = ${value}$.`, `$\\tau^{-1}(${ia[x]! + 1}) = ${value}$。`)],
              ],
              t(
                `Going forward, $\\sigma(\\tau(${value})) = \\sigma(${sb[value - 1]! + 1}) = ${x + 1}$.`,
                `正向验算：$\\sigma(\\tau(${value})) = \\sigma(${sb[value - 1]! + 1}) = ${x + 1}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** theOrderOfACycle finds orders and powers of cycles. */
export const theOrderOfACycle: TopicDef = {
  id: "the-order-of-a-cycle",
  title: t("The Order of a Cycle", "轮换的阶"),
  summary: t(
    "A cycle of length k has order k: applying it k times returns every point to its start. The power σᵐ moves each point m steps along the cycle, so σᵐ has order k / gcd(k, m).",
    "长度为 k 的轮换的阶为 k：作用 k 次后每个点都回到原处。幂 σᵐ 把每个点沿轮换移动 m 步，所以 σᵐ 的阶为 k / gcd(k, m)。",
  ),
  intro: t(
    "Let $\\sigma = (1\\;3\\;5\\;2\\;6\\;4)$, a $6$-cycle, so $\\sigma$ has order $6$. The power $\\sigma^4$ moves each point $4$ places along the cycle: $\\sigma^4(1) = 6$, since $1 \\to 3 \\to 5 \\to 2 \\to 6$. Its order is $\\frac{6}{\\gcd(6, 4)} = \\frac{6}{2} = 3$.\n\nCheck: $\\sigma^4$ sends $1 \\mapsto 6 \\mapsto 5 \\mapsto 1$ and $3 \\mapsto 4 \\mapsto 2 \\mapsto 3$, so $\\sigma^4 = (1\\;6\\;5)(2\\;3\\;4)$, two $3$-cycles, which indeed has order $3$.\n\nIn this lesson we find powers of cycles and the orders of those powers.",
    "设 $\\sigma = (1\\;3\\;5\\;2\\;6\\;4)$，它是 $6$-轮换，所以 $\\sigma$ 的阶为 $6$。幂 $\\sigma^4$ 把每个点沿轮换移动 $4$ 位：$\\sigma^4(1) = 6$，因为 $1 \\to 3 \\to 5 \\to 2 \\to 6$。它的阶为 $\\frac{6}{\\gcd(6, 4)} = \\frac{6}{2} = 3$。\n\n检验：$\\sigma^4$ 把 $1 \\mapsto 6 \\mapsto 5 \\mapsto 1$，$3 \\mapsto 4 \\mapsto 2 \\mapsto 3$，所以 $\\sigma^4 = (1\\;6\\;5)(2\\;3\\;4)$，是两个 $3$-轮换，阶确实为 $3$。\n\n本课我们求轮换的幂以及这些幂的阶。",
  ),
  prerequisites: ["cycles", "orders-of-group-elements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "powers-of-cycles",
      title: t("Powers of a cycle", "轮换的幂"),
      explanation: t(
        "Each application of a cycle moves a point one place along it, so a power moves it that many places, wrapping around the cycle. $\\sigma^m$ moves each point of the cycle $m$ places forward, wrapping around. For $\\sigma = (1\\;5\\;2\\;7\\;4)$, $\\sigma^3(5) = 4$ since $5 \\to 2 \\to 7 \\to 4$.\n\nCheck: $\\sigma^5$ is the identity, so $\\sigma^8(5) = \\sigma^3(5) = 4$ as well.\n\n> **Watch out.** Count steps from the starting point, not from the start of the written cycle: $\\sigma^3(5)$ moves from $5$, the second entry, to $4$, the fifth.",
        "每作用一次轮换，点就沿着它移动一个位置，所以幂会使点移动那么多个位置，并在轮换上绕回。$\\sigma^m$ 把轮换中的每个点向前移动 $m$ 位，到末尾绕回。对 $\\sigma = (1\\;5\\;2\\;7\\;4)$，$\\sigma^3(5) = 4$，因为 $5 \\to 2 \\to 7 \\to 4$。\n\n检验：$\\sigma^5$ 是恒等置换，所以 $\\sigma^8(5) = \\sigma^3(5) = 4$ 也成立。\n\n> **注意。** 步数从出发点数起，而不是从所写轮换的开头数起：$\\sigma^3(5)$ 是从第二项 $5$ 走到第五项 $4$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(6, 9);
          const k = rng.int(4, Math.min(n, 7));
          const c = rng.sample(range(0, n - 1), k);
          const m = rng.int(2, 2 * k + 2);
          const i = rng.int(0, k - 1);
          const value = c[(i + m) % k]! + 1;
          const mistakes = apart(value, [
            why(
              c[mod(i - m, k)]! + 1,
              `That moves $${m}$ places backward; $\\sigma$ moves each point forward along the cycle.`,
              `那是向后移动了 $${m}$ 位；$\\sigma$ 是把点沿轮换向前移动。`,
            ),
            why(
              c[(i + m - 1) % k]! + 1,
              `That is one step short: it moves only $${m - 1}$ places.`,
              `少走了一步：只移动了 $${m - 1}$ 位。`,
            ),
            why(c[(i + 1) % k]! + 1, "That is $\\sigma$ applied once, ignoring the exponent.", "那是只作用了一次 $\\sigma$，忽略了指数。"),
            why(
              c[m % k]! + 1,
              "That counts the steps from the first entry of the written cycle instead of from the given point.",
              "那是从所写轮换的第一项开始数步，而不是从给定的点开始。",
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find $\\sigma^{${m}}(${c[i]! + 1})$.`,
              `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma^{${m}}(${c[i]! + 1})$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Reduce the exponent", "约化指数"],
                  t(
                    `$\\sigma$ is ${article(k)} $${k}$-cycle, so $\\sigma^{${k}} = e$ and $\\sigma^{${m}}$ moves each point $${m} \\bmod ${k} = ${m % k}$ places forward.`,
                    `$\\sigma$ 是 $${k}$-轮换，所以 $\\sigma^{${k}} = e$，$\\sigma^{${m}}$ 把每个点向前移动 $${m} \\bmod ${k} = ${m % k}$ 位。`,
                  ),
                ],
                [
                  ["Walk along the cycle", "沿轮换走"],
                  t(
                    `Starting at $${c[i]! + 1}$ and moving $${m % k}$ places gives $${value}$.`,
                    `从 $${c[i]! + 1}$ 出发移动 $${m % k}$ 位得到 $${value}$。`,
                  ),
                ],
              ],
              m >= k
                ? t(
                    `Walking all $${m}$ steps one at a time goes round the cycle and also ends at $${value}$.`,
                    `一步一步走满 $${m}$ 步，绕过轮换后同样停在 $${value}$。`,
                  )
                : t(
                    `Applying $${k - m === 1 ? "\\sigma" : `\\sigma^{${k - m}}`}$ to $${value}$ completes $${k}$ steps, which brings it back to $${c[i]! + 1}$.`,
                    `再对 $${value}$ 作用 $${k - m === 1 ? "\\sigma" : `\\sigma^{${k - m}}`}$ 就凑满 $${k}$ 步，回到 $${c[i]! + 1}$。`,
                  ),
            ),
          });
        }
      },
    },
    {
      id: "orders-of-powers-of-cycles",
      title: t("Orders of powers of a cycle", "轮换幂的阶"),
      explanation: t(
        "If $\\sigma$ is a $k$-cycle, then $\\sigma^m$ has order $\\frac{k}{\\gcd(k, m)}$. For a $6$-cycle $\\sigma$, $\\sigma^4$ has order $\\frac{6}{2} = 3$: it splits into two $3$-cycles.\n\nCheck: $(\\sigma^4)^3 = \\sigma^{12}$, and $12$ is a multiple of $6$, so it is $e$; while $(\\sigma^4)^1$ and $(\\sigma^4)^2 = \\sigma^8$ are not, since $4$ and $8$ are not multiples of $6$.\n\n> **Watch out.** The order is $\\frac{k}{\\gcd(k, m)}$, not $\\gcd(k, m)$ and not $k$: $\\sigma^4$ is not a $6$-cycle.",
        "若 $\\sigma$ 是 $k$-轮换，则 $\\sigma^m$ 的阶为 $\\frac{k}{\\gcd(k, m)}$。对 $6$-轮换 $\\sigma$，$\\sigma^4$ 的阶为 $\\frac{6}{2} = 3$：它分裂为两个 $3$-轮换。\n\n检验：$(\\sigma^4)^3 = \\sigma^{12}$，而 $12$ 是 $6$ 的倍数，所以它是 $e$；而 $(\\sigma^4)^1$ 与 $(\\sigma^4)^2 = \\sigma^8$ 都不是，因为 $4$ 和 $8$ 都不是 $6$ 的倍数。\n\n> **注意。** 阶是 $\\frac{k}{\\gcd(k, m)}$，不是 $\\gcd(k, m)$，也不是 $k$：$\\sigma^4$ 不是 $6$-轮换。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(7, 10);
          const k = rng.int(4, n);
          let m: number;
          do m = rng.int(2, 2 * k);
          while (m % k === 0);
          const c = rng.sample(range(0, n - 1), k);
          const g = gcd(k, m);
          const value = k / g;
          const mistakes = apart(value, [
            why(
              k,
              `That is the order of $\\sigma$; a power of $\\sigma$ can have smaller order.`,
              `那是 $\\sigma$ 的阶；$\\sigma$ 的幂的阶可以更小。`,
            ),
            why(
              g,
              `That is $\\gcd(${k}, ${m})$ itself; the order is $${k}$ divided by it.`,
              `那是 $\\gcd(${k}, ${m})$ 本身；阶是 $${k}$ 除以它。`,
            ),
            why(
              m % k,
              `That is $${m} \\bmod ${k}$, the number of places $\\sigma^{${m}}$ moves each point, not its order.`,
              `那是 $${m} \\bmod ${k}$，即 $\\sigma^{${m}}$ 使每个点移动的位数，不是它的阶。`,
            ),
            why(
              (k * m) / g,
              `That is $\\operatorname{lcm}(${k}, ${m})$, the exponent of $\\sigma$ reached, not the number of times $\\sigma^{${m}}$ is applied.`,
              `那是 $\\operatorname{lcm}(${k}, ${m})$，即到达的 $\\sigma$ 的指数，不是 $\\sigma^{${m}}$ 作用的次数。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find the order of $\\sigma^{${m}}$.`,
              `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma^{${m}}$ 的阶。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Order of σ", "σ 的阶"],
                  t(`$\\sigma$ is ${article(k)} $${k}$-cycle, so it has order $${k}$.`, `$\\sigma$ 是 $${k}$-轮换，所以阶为 $${k}$。`),
                ],
                [
                  ["Divide by the gcd", "除以最大公约数"],
                  g === 1
                    ? t(
                        `$\\gcd(${k}, ${m}) = 1$, so $\\sigma^{${m}}$ has the full order $${value}$.`,
                        `$\\gcd(${k}, ${m}) = 1$，所以 $\\sigma^{${m}}$ 的阶仍为 $${value}$。`,
                      )
                    : t(
                        `$\\gcd(${k}, ${m}) = ${g}$, so $\\sigma^{${m}}$ has order $\\frac{${k}}{${g}} = ${value}$.`,
                        `$\\gcd(${k}, ${m}) = ${g}$，所以 $\\sigma^{${m}}$ 的阶为 $\\frac{${k}}{${g}} = ${value}$。`,
                      ),
                ],
              ],
              t(
                `$(\\sigma^{${m}})^{${value}} = \\sigma^{${m * value}}$ and $${m * value}$ is a multiple of $${k}$, so it is $e$; no smaller power of $\\sigma^{${m}}$ gives a multiple of $${k}$.`,
                `$(\\sigma^{${m}})^{${value}} = \\sigma^{${m * value}}$，而 $${m * value}$ 是 $${k}$ 的倍数，所以它是 $e$；$\\sigma^{${m}}$ 更小的幂都不会使指数成为 $${k}$ 的倍数。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** orderMistakes are the usual wrong orders for a permutation with disjoint cycles of the given lengths among n symbols. */
function orderMistakes(value: number, lengths: readonly number[], n: number) {
  return apart(value, [
    why(
      lengths.reduce((a, b) => a * b, 1),
      "That multiplies the lengths; the cycles first return together at the least common multiple.",
      "那是把长度相乘；各轮换第一次同时回到起点是在最小公倍数步时。",
    ),
    why(
      lengths.reduce((a, b) => a + b, 0),
      "That adds the lengths, which counts the points moved, not the steps until they all return.",
      "那是把长度相加，数的是被移动的点数，而不是它们全部回到原处所需的步数。",
    ),
    why(
      Math.max(...lengths),
      "That is the length of the longest cycle; the shorter cycles must be back at their start too.",
      "那是最长轮换的长度；较短的轮换也必须回到起点。",
    ),
    why(n, "That is the number of symbols; the order depends only on the cycle lengths.", "那是符号的个数；阶只取决于轮换的长度。"),
  ]);
}

/** orderCheck confirms that the order is the least common multiple of the cycle lengths. */
const orderCheck = (value: number, lengths: readonly number[]) =>
  t(
    `$${value}$ is a multiple of each length $${lengths.join(", ")}$, and no smaller positive number is, so every cycle first returns to its start together after $${value}$ steps.`,
    `$${value}$ 是每个长度 $${lengths.join(", ")}$ 的倍数，且没有更小的正数如此，所以各轮换在 $${value}$ 步后第一次同时回到起点。`,
  );

/** theOrderOfAPermutation finds orders of permutations. */
export const theOrderOfAPermutation: TopicDef = {
  id: "the-order-of-a-permutation",
  title: t("The Order of a Permutation", "置换的阶"),
  summary: t(
    "The order of a permutation is the least common multiple of the lengths of its disjoint cycles. To find the order of a permutation given in two-line notation, first decompose it into disjoint cycles.",
    "置换的阶是它的各个不相交轮换长度的最小公倍数。求两行记法下置换的阶时，先把它分解为不相交轮换。",
  ),
  intro: t(
    "Let $\\pi = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 & 7 \\\\ 2 & 3 & 1 & 5 & 4 & 7 & 6 \\end{pmatrix}$. Following the points gives $\\pi = (1\\;2\\;3)(4\\;5)(6\\;7)$, with cycle lengths $3, 2, 2$. The cycles all return to their start together after $\\operatorname{lcm}(3, 2, 2) = 6$ steps, so $\\pi$ has order $6$.\n\nCheck: $\\pi^2 = (1\\;3\\;2)$ and $\\pi^3 = (4\\;5)(6\\;7)$ are not the identity, while $\\pi^6$ turns the $3$-cycle round twice and each transposition three times, giving $e$.\n\nIn this lesson we find the orders of products of disjoint cycles and of permutations in two-line notation.",
    "设 $\\pi = \\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 & 7 \\\\ 2 & 3 & 1 & 5 & 4 & 7 & 6 \\end{pmatrix}$。追踪各点得 $\\pi = (1\\;2\\;3)(4\\;5)(6\\;7)$，轮换长度为 $3, 2, 2$。各轮换在 $\\operatorname{lcm}(3, 2, 2) = 6$ 步后同时回到起点，所以 $\\pi$ 的阶为 $6$。\n\n检验：$\\pi^2 = (1\\;3\\;2)$ 与 $\\pi^3 = (4\\;5)(6\\;7)$ 都不是恒等置换，而 $\\pi^6$ 使 $3$-轮换转两圈、每个对换转三圈，得 $e$。\n\n本课我们求不相交轮换之积的阶，以及两行记法下置换的阶。",
  ),
  prerequisites: ["the-order-of-a-cycle", "converting-between-permutations-and-cycles"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-products-of-disjoint-cycles",
      title: t("Products of disjoint cycles", "不相交轮换之积"),
      explanation: t(
        "$(1\\;2\\;3\\;4)(5\\;6\\;7\\;8\\;9\\;10)$ has order $\\operatorname{lcm}(4, 6) = 12$: both cycles return to the start together only after a common multiple of $4$ and $6$ steps.\n\nCheck: after $12$ steps the first cycle has gone round $3$ times and the second $2$ times; after $6$ steps the first is only halfway round its second turn, so $6$ is too few.\n\n> **Watch out.** The order is the least common multiple, not the product $4 \\cdot 6 = 24$ and not the sum $4 + 6 = 10$.",
        "$(1\\;2\\;3\\;4)(5\\;6\\;7\\;8\\;9\\;10)$ 的阶为 $\\operatorname{lcm}(4, 6) = 12$：两个轮换要在 $4$ 与 $6$ 的公倍数步后才同时回到起点。\n\n检验：走 $12$ 步后，第一个轮换转了 $3$ 圈，第二个转了 $2$ 圈；走 $6$ 步时第一个轮换只在第二圈的一半，所以 $6$ 步不够。\n\n> **注意。** 阶是最小公倍数，不是乘积 $4 \\cdot 6 = 24$，也不是和 $4 + 6 = 10$。",
      ),
      generate(rng) {
        const lengths = rng.pick([
          [2, 3],
          [2, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 6],
          [2, 2, 3],
          [2, 3, 4],
          [3, 3],
          [4, 4],
          [2, 6],
          [3, 6],
          [5, 4],
          [2, 3, 5],
        ]);
        const n = Math.max(
          lengths.reduce((a, b) => a + b, 0),
          rng.int(8, 12),
        );
        const cs = randomDisjointCycles(rng, n, lengths);
        const value = lengths.reduce((a, b) => lcm(a, b), 1);
        return numberProblem({
          prompt: t(`Find the order of $${cyclesTex(cs)}$ in $S_{${n}}$.`, `求 $S_{${n}}$ 中 $${cyclesTex(cs)}$ 的阶。`),
          answer: value,
          mistakes: orderMistakes(value, lengths, n),
          solution: walked(
            [
              [
                ["Read the lengths", "读出长度"],
                t(`The disjoint cycles have lengths $${lengths.join(", ")}$.`, `这些不相交轮换的长度为 $${lengths.join(", ")}$。`),
              ],
              [
                ["Take the lcm", "取最小公倍数"],
                t(
                  `The order is $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$.`,
                  `阶为 $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$。`,
                ),
              ],
            ],
            orderCheck(value, lengths),
          ),
        });
      },
    },
    {
      id: "orders-of-permutations-in-two-line-notation",
      title: t("Permutations in two-line notation", "两行记法下的置换"),
      explanation: t(
        "Write the permutation as disjoint cycles first; its order is the least common multiple of the cycle lengths. $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 2 & 3 & 1 & 5 & 4 & 6 \\end{pmatrix} = (1\\;2\\;3)(4\\;5)$, so its order is $\\operatorname{lcm}(3, 2) = 6$.\n\nCheck: applying it $6$ times turns $(1\\;2\\;3)$ round twice and $(4\\;5)$ round three times, so every point is back, and $6$ is the first such count.\n\n> **Watch out.** Do not guess the order from the two-line notation: trace the cycles first. Here the order happens to equal the number of symbols, $6$, but in general it does not, and fixed points do not affect it.",
        "先把置换写成不相交轮换的乘积；它的阶是各轮换长度的最小公倍数。$\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 2 & 3 & 1 & 5 & 4 & 6 \\end{pmatrix} = (1\\;2\\;3)(4\\;5)$，所以它的阶为 $\\operatorname{lcm}(3, 2) = 6$。\n\n检验：作用 $6$ 次后 $(1\\;2\\;3)$ 转了两圈，$(4\\;5)$ 转了三圈，每个点都回到原处，而 $6$ 是第一个这样的次数。\n\n> **注意。** 不要从两行记法中直接猜阶：要先追踪出轮换。这里阶恰好等于符号个数 $6$，但一般并不如此，不动点也不影响阶。",
      ),
      generate(rng) {
        for (;;) {
          const p = randomPerm(rng, rng.int(6, 9));
          const lengths = cyclesOf(p).map((c) => c.length);
          const value = permOrder(p);
          const mistakes = orderMistakes(value, lengths, p.length);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(`Find the order of $${permTex(p)}$.`, `求 $${permTex(p)}$ 的阶。`),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Find the cycles", "找出轮换"],
                  t(`Following each point gives $${permCycleTex(p)}$.`, `追踪每个点得 $${permCycleTex(p)}$。`),
                ],
                lengths.length === 1
                  ? [
                      ["Read the order", "读出阶"],
                      t(`It is a single cycle, so its order is its length, $${value}$.`, `它是一个轮换，所以阶等于它的长度 $${value}$。`),
                    ]
                  : [
                      ["Take the lcm", "取最小公倍数"],
                      t(
                        `The order is $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$.`,
                        `阶为 $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$。`,
                      ),
                    ],
              ],
              orderCheck(value, lengths),
            ),
          });
        }
      },
    },
  ],
};

/** EVEN_ODD are the options for parity questions, even first. */
const EVEN_ODD: readonly Text[] = [t("Even", "偶置换"), t("Odd", "奇置换")];

/** transpositions writes permutations as products of transpositions and finds their parity. */
export const transpositions: TopicDef = {
  id: "transpositions",
  title: t("Transpositions", "对换"),
  summary: t(
    "A transposition is a 2-cycle. Every permutation is a product of transpositions: (a₁ a₂ … aₖ) = (a₁ aₖ)⋯(a₁ a₃)(a₁ a₂), using k − 1 of them. A permutation is even or odd according to whether it is a product of an even or an odd number of transpositions; this parity is well defined.",
    "对换是 2-轮换。每个置换都是对换之积：(a₁ a₂ … aₖ) = (a₁ aₖ)⋯(a₁ a₃)(a₁ a₂)，共用 k − 1 个对换。置换按照它是偶数个还是奇数个对换之积分为偶置换与奇置换；这种奇偶性是良定义的。",
  ),
  intro: t(
    "Write $(1\\;4\\;2\\;5\\;3)$ as a product of transpositions. Pair the first entry with each later one, last first: $(1\\;4\\;2\\;5\\;3) = (1\\;3)(1\\;5)(1\\;2)(1\\;4)$. That uses $5 - 1 = 4$ transpositions, an even number, so the cycle is an even permutation.\n\nCheck: applying the factors from the right, $2 \\mapsto 2 \\mapsto 1 \\mapsto 5 \\mapsto 5$, so the product sends $2$ to $5$, just as the cycle does.\n\nIn this lesson we count the fewest transpositions a permutation needs and decide whether it is even or odd.",
    "把 $(1\\;4\\;2\\;5\\;3)$ 写成对换之积。把第一项与后面每一项配对，从最后一项写起：$(1\\;4\\;2\\;5\\;3) = (1\\;3)(1\\;5)(1\\;2)(1\\;4)$。这用了 $5 - 1 = 4$ 个对换，是偶数个，所以这个轮换是偶置换。\n\n检验：从右往左作用各因子，$2 \\mapsto 2 \\mapsto 1 \\mapsto 5 \\mapsto 5$，所以乘积把 $2$ 送到 $5$，与轮换一致。\n\n本课我们求置换最少需要几个对换，并判断它是偶置换还是奇置换。",
  ),
  prerequisites: ["converting-between-permutations-and-cycles"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-transpositions",
      title: t("Fewest transpositions", "最少对换个数"),
      explanation: t(
        "Each transposition can merge or split cycles by only one, so the fewest needed is the number of points minus the number of cycles. A $k$-cycle is a product of $k - 1$ transpositions, and no fewer. So $(1\\;2\\;3\\;4)(5\\;6\\;7)$ needs $3 + 2 = 5$ transpositions.\n\nCheck: the $7$ points form $2$ cycles, and $7 - 2 = 5$ agrees.\n\n> **Watch out.** A $k$-cycle needs $k - 1$ transpositions, not $k$: $(1\\;2\\;3) = (1\\;3)(1\\;2)$ uses only two.",
        "每个对换只能使轮换数增加或减少一个，所以所需的最少对换数等于点数减去轮换数。$k$-轮换是 $k - 1$ 个对换之积，且不能更少。所以 $(1\\;2\\;3\\;4)(5\\;6\\;7)$ 需要 $3 + 2 = 5$ 个对换。\n\n检验：这 $7$ 个点构成 $2$ 个轮换，$7 - 2 = 5$，一致。\n\n> **注意。** $k$-轮换需要 $k - 1$ 个对换，而不是 $k$ 个：$(1\\;2\\;3) = (1\\;3)(1\\;2)$ 只用两个。",
      ),
      generate(rng) {
        for (;;) {
          const p = randomPerm(rng, rng.int(6, 10));
          const cs = cyclesOf(p);
          const value = transpositionCount(p);
          const moved = cs.reduce((s, c) => s + c.length, 0);
          const asCycles = rng.bool();
          const mistakes = apart(value, [
            why(
              moved,
              "That counts the points moved; each $k$-cycle needs only $k - 1$ transpositions.",
              "那是被移动的点数；每个 $k$-轮换只需 $k - 1$ 个对换。",
            ),
            why(cs.length, "That counts the cycles, not the transpositions they need.", "那是轮换的个数，不是它们需要的对换个数。"),
            why(
              value - 1,
              "That is one short: every $k$-cycle needs all $k - 1$ of its transpositions.",
              "少了一个：每个 $k$-轮换都需要整整 $k - 1$ 个对换。",
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `What is the least number of transpositions whose product is $${asCycles ? permCycleTex(p) : permTex(p)}$?`,
              `$${asCycles ? permCycleTex(p) : permTex(p)}$ 最少能写成多少个对换之积？`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                ...(asCycles
                  ? []
                  : [[["Find the cycles", "找出轮换"], t(`It is $${permCycleTex(p)}$.`, `它等于 $${permCycleTex(p)}$。`)] as const]),
                [
                  ["Count per cycle", "逐个轮换计数"],
                  t(
                    `Each $k$-cycle needs $k - 1$ transpositions: $${cs.length === 1 ? "" : `${cs.map((c) => c.length - 1).join(" + ")} = `}${value}$.`,
                    `每个 $k$-轮换需要 $k - 1$ 个对换：$${cs.length === 1 ? "" : `${cs.map((c) => c.length - 1).join(" + ")} = `}${value}$。`,
                  ),
                ],
              ],
              t(
                `$${moved}$ points are moved and they form $${cs.length}$ ${cs.length === 1 ? "cycle" : "cycles"}, and $${moved} - ${cs.length} = ${value}$.`,
                `被移动的 $${moved}$ 个点构成 $${cs.length}$ 个轮换，$${moved} - ${cs.length} = ${value}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "even-and-odd-permutations",
      title: t("Even and odd permutations", "偶置换与奇置换"),
      explanation: t(
        "A $k$-cycle is even when $k$ is odd, and odd when $k$ is even. The parity of a product is found by adding: $(1\\;2\\;3\\;4)(2\\;5)$ is a product of $3 + 1 = 4$ transpositions, so it is even, even though the cycles overlap.\n\nCheck: $(1\\;2\\;3\\;4)(2\\;5) = (1\\;2\\;5\\;3\\;4)$, a $5$-cycle, which is even since $5$ is odd.\n\n> **Watch out.** The parity of a cycle is opposite to the parity of its length: a $4$-cycle is odd, because it is a product of $3$ transpositions.",
        "$k$ 为奇数时 $k$-轮换是偶置换，$k$ 为偶数时是奇置换。乘积的奇偶性通过相加求得：$(1\\;2\\;3\\;4)(2\\;5)$ 是 $3 + 1 = 4$ 个对换之积，所以是偶置换，即使两个轮换有重叠。\n\n检验：$(1\\;2\\;3\\;4)(2\\;5) = (1\\;2\\;5\\;3\\;4)$ 是 $5$-轮换，因为 $5$ 是奇数，所以它是偶置换。\n\n> **注意。** 轮换的奇偶性与它的长度的奇偶性相反：$4$-轮换是奇置换，因为它是 $3$ 个对换之积。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const cs = range(1, rng.int(2, 3)).map(() => rng.sample(range(0, n - 1), rng.int(2, 5)));
        const count = cs.reduce((s, c) => s + c.length - 1, 0);
        const even = count % 2 === 0;
        const lengthSum = cs.reduce((s, c) => s + c.length, 0);
        const reasons: Reason[] = [
          [
            "Even",
            `It is a product of $${count}$ transpositions, an odd number${lengthSum % 2 === 0 ? `; adding the lengths, $${lengthSum}$, instead of the lengths minus one, gives the wrong parity` : ""}.`,
            `它是 $${count}$ 个对换之积，个数是奇数${lengthSum % 2 === 0 ? `；把长度相加得 $${lengthSum}$，而不是把长度减一后相加，就会得到错误的奇偶性` : ""}。`,
          ],
          [
            "Odd",
            `It is a product of $${count}$ transpositions, an even number${lengthSum % 2 === 1 ? `; adding the lengths, $${lengthSum}$, instead of the lengths minus one, gives the wrong parity` : ""}.`,
            `它是 $${count}$ 个对换之积，个数是偶数${lengthSum % 2 === 1 ? `；把长度相加得 $${lengthSum}$，而不是把长度减一后相加，就会得到错误的奇偶性` : ""}。`,
          ],
        ];
        const product = productOfCycles(n, cs);
        return reasoned(
          textChoice(
            rng,
            t(`Is $${cyclesTex(cs)}$ in $S_{${n}}$ even or odd?`, `$S_{${n}}$ 中的 $${cyclesTex(cs)}$ 是偶置换还是奇置换？`),
            even ? EVEN_ODD : [EVEN_ODD[1]!, EVEN_ODD[0]!],
            walked(
              [
                [
                  ["Count per cycle", "逐个轮换计数"],
                  t(
                    `A $k$-cycle is a product of $k - 1$ transpositions: $${cs.map((c) => c.length - 1).join(" + ")} = ${count}$.`,
                    `$k$-轮换是 $k - 1$ 个对换之积：$${cs.map((c) => c.length - 1).join(" + ")} = ${count}$。`,
                  ),
                ],
                [
                  ["Read the parity", "判断奇偶"],
                  t(
                    `$${count}$ is ${even ? "even" : "odd"}, so the permutation is ${even ? "even" : "odd"}.`,
                    `$${count}$ 是${even ? "偶" : "奇"}数，所以它是${even ? "偶" : "奇"}置换。`,
                  ),
                ],
              ],
              t(
                `Multiplied out, it is $${permCycleTex(product)}$, a product of $${transpositionCount(product)}$ transpositions, which has the same parity.`,
                `乘出来是 $${permCycleTex(product)}$，是 $${transpositionCount(product)}$ 个对换之积，奇偶性相同。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** factorial is n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** theSymmetricGroupOnNSymbols counts elements of Sₙ and multiplies them. */
export const theSymmetricGroupOnNSymbols: TopicDef = {
  id: "the-symmetric-group-on-n-symbols",
  title: t("The Symmetric Group on N Symbols", "n 元对称群"),
  summary: t(
    "The symmetric group Sₙ is the group of all permutations of {1, …, n} under composition. It has n! elements and is non-abelian for n ≥ 3. The number of k-cycles in Sₙ is n!/((n − k)! k), since a cycle can start at any of its k points.",
    "对称群 Sₙ 是 {1, …, n} 的全体置换在复合下构成的群。它有 n! 个元素，n ≥ 3 时不是阿贝尔群。Sₙ 中 k-轮换的个数为 n!/((n − k)! k)，因为一个轮换可以从它的 k 个点中任一个开始写。",
  ),
  intro: t(
    "$S_4$ has $4! = 24$ elements. To count its $3$-cycles, choose an ordered list of $3$ points in $4 \\cdot 3 \\cdot 2 = 24$ ways; each cycle is written in $3$ ways, one per starting point, so there are $8$. Products depend on order: with $\\sigma = (1\\;2)$ and $\\tau = (2\\;3)$, $\\sigma\\tau = (1\\;2\\;3)$ but $\\tau\\sigma = (1\\;3\\;2)$.\n\nCheck: there are $\\binom{4}{3} = 4$ sets of three points, and each carries two $3$-cycles, such as $(1\\;2\\;3)$ and $(1\\;3\\;2)$: $4 \\cdot 2 = 8$.\n\nIn this lesson we count cycles in $S_n$ and multiply permutations in it.",
    "$S_4$ 有 $4! = 24$ 个元素。数它的 $3$-轮换：有序选出 $3$ 个点有 $4 \\cdot 3 \\cdot 2 = 24$ 种方式；每个轮换有 $3$ 种写法（每个起点一种），所以共 $8$ 个。乘积与顺序有关：设 $\\sigma = (1\\;2)$、$\\tau = (2\\;3)$，则 $\\sigma\\tau = (1\\;2\\;3)$，而 $\\tau\\sigma = (1\\;3\\;2)$。\n\n检验：三个点的集合有 $\\binom{4}{3} = 4$ 个，每个集合上有两个 $3$-轮换，例如 $(1\\;2\\;3)$ 与 $(1\\;3\\;2)$：$4 \\cdot 2 = 8$。\n\n本课我们数 $S_n$ 中的轮换，并在其中做置换的乘法。",
  ),
  prerequisites: ["transpositions", "the-inverse-of-a-permutation", "the-order-of-a-permutation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-cycles-in-symmetric-groups",
      title: t("Counting cycles", "数轮换"),
      explanation: t(
        "To count $3$-cycles in $S_5$: choose an ordered list of $3$ points in $5 \\cdot 4 \\cdot 3 = 60$ ways; each cycle is written $3$ ways (start anywhere), giving $20$.\n\nCheck: there are $\\binom{5}{3} = 10$ sets of $3$ points, and each set carries $2$ different $3$-cycles, such as $(1\\;2\\;3)$ and $(1\\;3\\;2)$: $10 \\cdot 2 = 20$.\n\n> **Watch out.** Dividing by $3! = 6$ instead of $3$ counts sets of points, not cycles: $(1\\;2\\;3)$ and $(1\\;3\\;2)$ are different cycles on the same set.",
        "数 $S_5$ 中的 $3$-轮换：有序地选出 $3$ 个点有 $5 \\cdot 4 \\cdot 3 = 60$ 种方式；每个轮换有 $3$ 种写法（从任一点开始），所以共 $20$ 个。\n\n检验：$3$ 个点的集合有 $\\binom{5}{3} = 10$ 个，每个集合上有 $2$ 个不同的 $3$-轮换，例如 $(1\\;2\\;3)$ 与 $(1\\;3\\;2)$：$10 \\cdot 2 = 20$。\n\n> **注意。** 除以 $3! = 6$ 而不是 $3$ 数的是点的集合，而不是轮换：$(1\\;2\\;3)$ 与 $(1\\;3\\;2)$ 是同一集合上的不同轮换。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(4, 9);
          const k = rng.int(2, n);
          const ordered = factorial(n) / factorial(n - k);
          const value = ordered / k;
          const mistakes = apart(value, [
            why(
              ordered,
              `That counts ordered lists; each cycle is written in $${k}$ ways, one for each starting point.`,
              `那是有序排列的个数；每个轮换有 $${k}$ 种写法，对应每个起点。`,
            ),
            why(
              ordered / factorial(k),
              `That divides by $${k}!$ and counts sets of $${k}$ points; a set of $${k}$ points carries $${factorial(k - 1)}$ different cycles.`,
              `那是除以 $${k}!$，数的是 $${k}$ 个点的集合；一个 $${k}$ 点集合上有 $${factorial(k - 1)}$ 个不同的轮换。`,
            ),
            why(
              factorial(n),
              `That counts every permutation in $S_{${n}}$, not just the $${k}$-cycles.`,
              `那是 $S_{${n}}$ 中全部置换的个数，而不只是 $${k}$-轮换。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          const sets = ordered / factorial(k);
          return numberProblem({
            prompt: t(`How many $${k}$-cycles are there in $S_{${n}}$?`, `$S_{${n}}$ 中有多少个 $${k}$-轮换？`),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Count ordered lists", "数有序排列"],
                  t(
                    `There are $\\frac{${n}!}{${n - k}!} = ${ordered}$ ordered lists of $${k}$ points.`,
                    `有序选出 $${k}$ 个点有 $\\frac{${n}!}{${n - k}!} = ${ordered}$ 种方式。`,
                  ),
                ],
                [
                  ["Divide by the starting points", "除以起点个数"],
                  t(
                    `Each cycle arises from $${k}$ of them, one per starting point: $\\frac{${ordered}}{${k}} = ${value}$.`,
                    `每个轮换对应其中 $${k}$ 种，每个起点一种：$\\frac{${ordered}}{${k}} = ${value}$。`,
                  ),
                ],
              ],
              t(
                `There are $\\binom{${n}}{${k}} = ${sets}$ sets of $${k}$ points, each carrying $(${k} - 1)! = ${factorial(k - 1)}$ ${k === 2 ? "cycle" : "cycles"}:$${sets} \\cdot ${factorial(k - 1)} = ${value}$.`,
                `$${k}$ 个点的集合有 $\\binom{${n}}{${k}} = ${sets}$ 个，每个集合上有 $(${k} - 1)! = ${factorial(k - 1)}$ 个轮换：$${sets} \\cdot ${factorial(k - 1)} = ${value}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "products-in-symmetric-groups",
      title: t("Multiplying in $S_n$", "$S_n$ 中的乘法"),
      explanation: t(
        "Follow each point through the right factor and then the left factor, recording the cycles as they close. To write $\\sigma\\tau$ in disjoint cycles, follow each point through $\\tau$ then $\\sigma$. With $\\sigma = (1\\;2\\;3)$ and $\\tau = (2\\;4)$: $1 \\mapsto 1 \\mapsto 2$, $2 \\mapsto 4 \\mapsto 4$, $4 \\mapsto 2 \\mapsto 3$, $3 \\mapsto 3 \\mapsto 1$, so $\\sigma\\tau = (1\\;2\\;4\\;3)$.\n\nCheck: $(1\\;2\\;4\\;3)$ sends $4 \\mapsto 3$, and indeed $\\tau(4) = 2$ and $\\sigma(2) = 3$.\n\n> **Watch out.** Applying $\\sigma$ first gives $\\tau\\sigma = (1\\;4\\;2\\;3)$, a different permutation: products in $S_n$ depend on the order.",
        "让每个点先经过右边的因子再经过左边的因子，在轮换闭合时把它们记录下来。要把 $\\sigma\\tau$ 写成不相交轮换，就让每个点依次经过 $\\tau$ 和 $\\sigma$。设 $\\sigma = (1\\;2\\;3)$、$\\tau = (2\\;4)$：$1 \\mapsto 1 \\mapsto 2$，$2 \\mapsto 4 \\mapsto 4$，$4 \\mapsto 2 \\mapsto 3$，$3 \\mapsto 3 \\mapsto 1$，所以 $\\sigma\\tau = (1\\;2\\;4\\;3)$。\n\n检验：$(1\\;2\\;4\\;3)$ 把 $4 \\mapsto 3$，而确实 $\\tau(4) = 2$，$\\sigma(2) = 3$。\n\n> **注意。** 先作用 $\\sigma$ 得到的是 $\\tau\\sigma = (1\\;4\\;2\\;3)$，是另一个置换：$S_n$ 中的乘积与顺序有关。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        let a: number[];
        let b: number[];
        let st: Perm;
        let ts: Perm;
        do {
          [a, b] = overlappingCycles(rng, n);
          st = composePerm(cyclePerm(n, a), cyclePerm(n, b));
          ts = composePerm(cyclePerm(n, b), cyclePerm(n, a));
        } while (cyclesOf(st).length === 0 || permCycleTex(st) === permCycleTex(ts));
        const sa = cyclePerm(n, a);
        const sb = cyclePerm(n, b);
        const moved = [...new Set([...a, ...b])].sort((u, v) => u - v);
        const trace = moved.map((x) => `${x + 1} \\mapsto ${sb[x]! + 1} \\mapsto ${sa[sb[x]!]! + 1}`).join(", ");
        const juxtaposed = `${oneCycleTex(a)}${oneCycleTex(b)}`;
        const reasons: Reason[] = [
          [
            `$${permCycleTex(sa)}$`,
            "That is $\\sigma$ alone; the product also moves points through $\\tau$.",
            "那只是 $\\sigma$；乘积还要让点经过 $\\tau$。",
          ],
          [
            `$${permCycleTex(sb)}$`,
            "That is $\\tau$ alone; the product also moves points through $\\sigma$.",
            "那只是 $\\tau$；乘积还要让点经过 $\\sigma$。",
          ],
          [
            `$${juxtaposed}$`,
            "That writes the two cycles side by side, but they share a point, so it is not a product of disjoint cycles.",
            "那只是把两个轮换并排写出，但它们有公共点，所以不是不相交轮换之积。",
          ],
          [
            `$${permCycleTex(ts)}$`,
            "That is $\\tau\\sigma$: it applies $\\sigma$ first, but $\\sigma\\tau$ applies $\\tau$ first.",
            "那是 $\\tau\\sigma$：它先作用 $\\sigma$，而 $\\sigma\\tau$ 先作用 $\\tau$。",
          ],
          [
            `$${mangled(st)}$`,
            "Two points in it are out of order or two cycles are merged, so some point goes to the wrong image.",
            "其中有两个点顺序错了，或有两个轮换被合并了，所以某个点被送错了地方。",
          ],
          [
            `$${permCycleTex(invertPerm(st))}$`,
            "That is the inverse of $\\sigma\\tau$: it runs each cycle backward.",
            "那是 $\\sigma\\tau$ 的逆：它把每个轮换倒着走。",
          ],
        ];
        const x0 = moved[0]!;
        return reasoned(
          texChoice(
            rng,
            t(
              `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(a)}$ and $\\tau = ${oneCycleTex(b)}$. ${COMPOSE_NOTE.en} Find $\\sigma\\tau$.`,
              `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(a)}$，$\\tau = ${oneCycleTex(b)}$。${COMPOSE_NOTE["zh-CN"]}求 $\\sigma\\tau$。`,
            ),
            permCycleTex(st),
            [permCycleTex(ts), mangled(st), permCycleTex(invertPerm(st)), permCycleTex(sa), permCycleTex(sb), juxtaposed],
            walked(
              [
                [
                  ["Follow each point", "追踪每个点"],
                  t(
                    `Send each moved point through $\\tau$, then $\\sigma$: $${trace}$.`,
                    `让每个被移动的点先经过 $\\tau$，再经过 $\\sigma$：$${trace}$。`,
                  ),
                ],
                [
                  ["Close the cycles", "闭合轮换"],
                  t(`Reading off the cycles, $\\sigma\\tau = ${permCycleTex(st)}$.`, `读出轮换，$\\sigma\\tau = ${permCycleTex(st)}$。`),
                ],
              ],
              t(
                `$\\tau(${x0 + 1}) = ${sb[x0]! + 1}$ and $\\sigma(${sb[x0]! + 1}) = ${st[x0]! + 1}$, which is where $${permCycleTex(st)}$ sends $${x0 + 1}$.`,
                `$\\tau(${x0 + 1}) = ${sb[x0]! + 1}$，$\\sigma(${sb[x0]! + 1}) = ${st[x0]! + 1}$，正是 $${permCycleTex(st)}$ 把 $${x0 + 1}$ 送到的位置。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** theAlternatingGroupOnNSymbols counts elements of Aₙ and decides membership. */
export const theAlternatingGroupOnNSymbols: TopicDef = {
  id: "the-alternating-group-on-n-symbols",
  title: t("The Alternating Group on N Symbols", "n 元交错群"),
  summary: t(
    "The even permutations of {1, …, n} form a subgroup Aₙ of Sₙ, the alternating group. For n ≥ 2 exactly half the permutations are even, so |Aₙ| = n!/2. A k-cycle lies in Aₙ exactly when k is odd.",
    "{1, …, n} 的偶置换构成 Sₙ 的子群 Aₙ，称为交错群。n ≥ 2 时恰有一半置换是偶置换，所以 |Aₙ| = n!/2。k-轮换属于 Aₙ 当且仅当 k 为奇数。",
  ),
  intro: t(
    "$A_4$ consists of the even permutations of four points, so $|A_4| = \\frac{4!}{2} = 12$. They are the identity, the $8$ three-cycles, each a product of $2$ transpositions, and the $3$ products $(1\\;2)(3\\;4)$, $(1\\;3)(2\\;4)$, $(1\\;4)(2\\;3)$. A $4$-cycle such as $(1\\;2\\;3\\;4)$ needs $3$ transpositions, so it is odd and not in $A_4$.\n\nCheck: $1 + 8 + 3 = 12$, matching $\\frac{4!}{2}$.\n\nIn this lesson we count the elements of $A_n$ and decide which permutations lie in it.",
    "$A_4$ 由四个点上的偶置换组成，所以 $|A_4| = \\frac{4!}{2} = 12$。它们是恒等置换、$8$ 个 $3$-轮换（每个是 $2$ 个对换之积），以及 $3$ 个乘积 $(1\\;2)(3\\;4)$、$(1\\;3)(2\\;4)$、$(1\\;4)(2\\;3)$。像 $(1\\;2\\;3\\;4)$ 这样的 $4$-轮换需要 $3$ 个对换，是奇置换，不在 $A_4$ 中。\n\n检验：$1 + 8 + 3 = 12$，与 $\\frac{4!}{2}$ 一致。\n\n本课我们数 $A_n$ 的元素，并判断哪些置换属于它。",
  ),
  prerequisites: ["the-symmetric-group-on-n-symbols", "properties-of-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-elements-of-alternating-groups",
      title: t("Counting in $A_n$", "$A_n$ 中的计数"),
      explanation: t(
        '$|A_5| = \\frac{5!}{2} = 60$. Every $3$-cycle is even, so all $\\frac{5 \\cdot 4 \\cdot 3}{3} = 20$ three-cycles of $S_5$ lie in $A_5$, while no $4$-cycle does.\n\nCheck: $A_5$ is a subgroup of $S_5$, and $60$ divides $120$, as Lagrange\'s theorem requires; the $20$ three-cycles are among its $60$ elements.\n\n> **Watch out.** The rule "half are even" is about all of $S_n$, not about each kind of cycle: either every $k$-cycle is even or none is.',
        "$|A_5| = \\frac{5!}{2} = 60$。每个 $3$-轮换都是偶置换，所以 $S_5$ 的全部 $\\frac{5 \\cdot 4 \\cdot 3}{3} = 20$ 个 $3$-轮换都在 $A_5$ 中，而 $4$-轮换都不在。\n\n检验：$A_5$ 是 $S_5$ 的子群，$60$ 整除 $120$，符合拉格朗日定理；$20$ 个 $3$-轮换都在这 $60$ 个元素之中。\n\n> **注意。** “一半是偶置换”说的是整个 $S_n$，而不是每一类轮换：$k$-轮换要么全是偶置换，要么全不是。",
      ),
      generate(rng) {
        const n = rng.int(3, 9);
        if (rng.bool(0.3)) {
          const value = factorial(n) / 2;
          return numberProblem({
            prompt: t(`How many elements does $A_{${n}}$ have?`, `$A_{${n}}$ 有多少个元素？`),
            answer: value,
            mistakes: apart(value, [
              why(
                factorial(n),
                `That is $|S_{${n}}| = ${n}!$; only the even half of the permutations lie in $A_{${n}}$.`,
                `那是 $|S_{${n}}| = ${n}!$；只有偶置换那一半属于 $A_{${n}}$。`,
              ),
              why(factorial(n - 1), `That divides $${n}!$ by $${n}$ instead of by $2$.`, `那是把 $${n}!$ 除以 $${n}$，而不是除以 $2$。`),
              ...(value % 2 === 0
                ? [
                    why(
                      value / 2,
                      "That halves twice; half of all permutations are even.",
                      "那是除了两次 $2$；全部置换中恰有一半是偶置换。",
                    ),
                  ]
                : []),
            ]),
            solution: walked(
              [
                [["Count S_n", "数 S_n"], t(`$|S_{${n}}| = ${n}! = ${factorial(n)}$.`, `$|S_{${n}}| = ${n}! = ${factorial(n)}$。`)],
                [
                  ["Take the even half", "取偶置换那一半"],
                  t(
                    `Exactly half of them are even: $\\frac{${factorial(n)}}{2} = ${value}$.`,
                    `其中恰有一半是偶置换：$\\frac{${factorial(n)}}{2} = ${value}$。`,
                  ),
                ],
              ],
              t(
                `Multiplying by the transposition $(1\\;2)$ pairs each even permutation with an odd one, so the two halves are equal: $${value} + ${value} = ${factorial(n)}$.`,
                `乘以对换 $(1\\;2)$ 把每个偶置换与一个奇置换配对，所以两半相等：$${value} + ${value} = ${factorial(n)}$。`,
              ),
            ),
          });
        }
        const k = rng.int(2, n);
        const ordered = factorial(n) / factorial(n - k);
        const count = ordered / k;
        const odd = k % 2 === 1;
        const value = odd ? count : 0;
        return numberProblem({
          prompt: t(`How many $${k}$-cycles lie in $A_{${n}}$?`, `$A_{${n}}$ 中有多少个 $${k}$-轮换？`),
          answer: value,
          mistakes: apart(value, [
            why(
              count,
              `That counts every $${k}$-cycle of $S_{${n}}$, but ${article(k)} $${k}$-cycle is a product of $${k - 1}$ transpositions, which is odd.`,
              `那是 $S_{${n}}$ 中全部 $${k}$-轮换的个数，但 $${k}$-轮换是 $${k - 1}$ 个对换之积，是奇置换。`,
            ),
            why(
              0,
              `${article(k, true)} $${k}$-cycle is a product of $${k - 1}$ transpositions, an even number, so it is even and lies in $A_{${n}}$.`,
              `$${k}$-轮换是 $${k - 1}$ 个对换之积，个数为偶数，所以是偶置换，属于 $A_{${n}}$。`,
            ),
            ...(count % 2 === 0
              ? [
                  why(
                    count / 2,
                    `Not half: all $${k}$-cycles have the same parity, so either all or none lie in $A_{${n}}$.`,
                    `不是一半：所有 $${k}$-轮换的奇偶性相同，所以要么全在 $A_{${n}}$ 中，要么全不在。`,
                  ),
                ]
              : []),
            why(
              ordered,
              `That counts ordered lists of $${k}$ points; each cycle is written in $${k}$ ways.`,
              `那是 $${k}$ 个点的有序排列数；每个轮换有 $${k}$ 种写法。`,
            ),
            why(
              factorial(n) / 2,
              `That is $|A_{${n}}|$, all its elements, not just the $${k}$-cycles.`,
              `那是 $|A_{${n}}|$，即它的全部元素，而不只是 $${k}$-轮换。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the parity", "判断奇偶"],
                t(
                  `${article(k, true)} $${k}$-cycle is a product of $${k - 1}$ transpositions, so it is ${odd ? "even" : "odd"}.`,
                  `$${k}$-轮换是 $${k - 1}$ 个对换之积，所以是${odd ? "偶" : "奇"}置换。`,
                ),
              ],
              odd
                ? [
                    ["Count them", "计数"],
                    t(
                      `So all $\\frac{${ordered}}{${k}} = ${count}$ of the $${k}$-cycles in $S_{${n}}$ lie in $A_{${n}}$.`,
                      `所以 $S_{${n}}$ 中全部 $\\frac{${ordered}}{${k}} = ${count}$ 个 $${k}$-轮换都在 $A_{${n}}$ 中。`,
                    ),
                  ]
                : [
                    ["Count them", "计数"],
                    t(`So none of them lie in $A_{${n}}$: the answer is $0$.`, `所以它们都不在 $A_{${n}}$ 中：答案为 $0$。`),
                  ],
            ],
            odd
              ? t(
                  `$${count} \\le ${factorial(n) / 2} = |A_{${n}}|$, as it must be.`,
                  `$${count} \\le ${factorial(n) / 2} = |A_{${n}}|$，理应如此。`,
                )
              : t(
                  `Parity is well defined and $${k - 1}$ is odd, so no $${k}$-cycle can be written with an even number of transpositions.`,
                  `$${k - 1}$ 是奇数，奇偶性是良定义的，所以没有 $${k}$-轮换能写成偶数个对换之积。`,
                ),
          ),
        });
      },
    },
    {
      id: "membership-in-alternating-groups",
      title: t("Membership in $A_n$", "是否属于 $A_n$"),
      explanation: t(
        "A permutation is even when it is a product of an even number of transpositions, and the alternating group consists of the even permutations. Count transpositions: a $k$-cycle contributes $k - 1$. $(1\\;3)(2\\;4\\;5\\;6)$ contributes $1 + 3 = 4$, so it is even and lies in $A_6$.\n\nCheck: $(1\\;3)$ is odd and $(2\\;4\\;5\\;6)$ is odd, and odd times odd is even.\n\n> **Watch out.** Two cycles of even length make an even permutation: $(1\\;3)(2\\;4\\;5\\;6)$ lies in $A_6$ even though neither factor does.",
        "当一个置换是偶数个对换的乘积时，它是偶置换，交错群由所有偶置换组成。数对换：$k$-轮换贡献 $k - 1$ 个。$(1\\;3)(2\\;4\\;5\\;6)$ 贡献 $1 + 3 = 4$ 个，所以是偶置换，属于 $A_6$。\n\n检验：$(1\\;3)$ 是奇置换，$(2\\;4\\;5\\;6)$ 也是奇置换，奇乘奇得偶。\n\n> **注意。** 两个偶数长度的轮换之积是偶置换：$(1\\;3)(2\\;4\\;5\\;6)$ 属于 $A_6$，尽管两个因子都不属于。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const cs = range(1, rng.int(1, 3)).map(() => rng.sample(range(0, n - 1), rng.int(2, Math.min(n, 6))));
        const count = cs.reduce((s, c) => s + c.length - 1, 0);
        return factProblem({
          prompt: t(`Does $${cyclesTex(cs)}$ lie in $A_{${n}}$?`, `$${cyclesTex(cs)}$ 属于 $A_{${n}}$ 吗？`),
          holds: count % 2 === 0,
          reason: t(
            `It is a product of $${cs.map((c) => c.length - 1).join(" + ")} = ${count}$ transpositions, so it is ${count % 2 === 0 ? "even" : "odd"}.`,
            `它是 $${cs.map((c) => c.length - 1).join(" + ")} = ${count}$ 个对换之积，所以是${count % 2 === 0 ? "偶" : "奇"}置换。`,
          ),
        });
      },
    },
  ],
};

/** PlaneFigure is a plane figure with the sizes of its symmetry and rotation groups. */
interface PlaneFigure {
  readonly name: Text;
  readonly symmetries: number;
  readonly rotations: number;
}

/** FIGURES are plane figures whose symmetry groups are not regular polygons. */
const FIGURES: readonly PlaneFigure[] = [
  { name: t("a rectangle that is not a square", "不是正方形的长方形"), symmetries: 4, rotations: 2 },
  { name: t("a rhombus that is not a square", "不是正方形的菱形"), symmetries: 4, rotations: 2 },
  {
    name: t("a parallelogram that is neither a rectangle nor a rhombus", "既不是长方形也不是菱形的平行四边形"),
    symmetries: 2,
    rotations: 2,
  },
  { name: t("an isosceles triangle that is not equilateral", "不是等边三角形的等腰三角形"), symmetries: 2, rotations: 1 },
  { name: t("a scalene triangle", "不等边三角形"), symmetries: 1, rotations: 1 },
  { name: t("an isosceles trapezoid that is not a rectangle", "不是长方形的等腰梯形"), symmetries: 2, rotations: 1 },
  { name: t("a kite that is not a rhombus", "不是菱形的筝形"), symmetries: 2, rotations: 1 },
];

/** polygonVertex is vertex k (from 0) of a regular n-gon of radius 3 with vertex 0 at the top, counting counterclockwise. */
const polygonVertex = (n: number, k: number, r = 3): Point => {
  const a = Math.PI / 2 + (2 * Math.PI * k) / n;
  return [r * Math.cos(a), r * Math.sin(a)];
};

/** hexagonSymmetryFigure shows a regular hexagon with its six lines of symmetry. */
const hexagonSymmetryFigure: Figure = (() => {
  const pts = Array.from({ length: 6 }, (_, k) => polygonVertex(6, k));
  const lines: Mark[] = Array.from({ length: 6 }, (_, k): Mark => {
    // Even k: the line through opposite vertices; odd k: the line through midpoints of opposite sides.
    const a = Math.PI / 2 + (Math.PI * k) / 6;
    const r = 3.6;
    return { kind: "segment", a: [r * Math.cos(a), r * Math.sin(a)], b: [-r * Math.cos(a), -r * Math.sin(a)], dashed: true };
  });
  return {
    svg: sketch([{ kind: "polygon", points: pts }, ...lines, { kind: "dot", at: [0, 0] }]),
    alt: t(
      "A regular hexagon with its 6 lines of symmetry dashed: 3 through opposite vertices and 3 through the midpoints of opposite sides. With the 6 rotations about the center, it has 12 symmetries.",
      "一个正六边形，6 条对称轴用虚线画出：3 条过相对的顶点，3 条过相对边的中点。连同绕中心的 6 个旋转，它共有 12 个对称。",
    ),
  };
})();

/** pentagonReflectionFigure shows a regular pentagon labeled 1 to 5 counterclockwise with the line of reflection through vertex 1. */
const pentagonReflectionFigure: Figure = (() => {
  const pts = Array.from({ length: 5 }, (_, k) => polygonVertex(5, k));
  const dirs: Compass[] = ["n", "w", "sw", "se", "e"];
  return {
    svg: sketch([
      { kind: "polygon", points: pts },
      { kind: "segment", a: [0, 3], b: [0, -3.4], dashed: true },
      ...pts.map((p, k): Mark => ({ kind: "label", at: p, text: String(k + 1), dir: dirs[k]! })),
      { kind: "dot", at: [0, 0] },
    ]),
    alt: t(
      "A regular pentagon with vertices labeled 1 to 5 counterclockwise, vertex 1 at the top, and a dashed line of reflection through vertex 1 and the center. The reflection fixes 1 and swaps 2 with 5 and 3 with 4, so it sends i to 2 − i mod 5.",
      "一个正五边形，顶点逆时针标为 1 到 5，顶点 1 在顶端；虚线是过顶点 1 和中心的对称轴。该反射保持 1 不动，交换 2 与 5、3 与 4，所以它把 i 映到 2 − i（模 5）。",
    ),
  };
})();

/** theSymmetryGroupOfAFigure counts symmetries of plane figures and computes their action on vertices. */
export const theSymmetryGroupOfAFigure: TopicDef = {
  id: "the-symmetry-group-of-a-figure",
  title: t("The Symmetry Group of a Figure", "图形的对称群"),
  summary: t(
    "An isometry of the plane preserves distances. The symmetries of a figure are the isometries that map it onto itself; they form a group under composition. A regular n-gon has 2n symmetries: n rotations and n reflections. Each symmetry permutes the vertices.",
    "平面的等距变换保持距离。图形的对称是把它映到自身的等距变换；它们在复合下构成群。正 n 边形有 2n 个对称：n 个旋转和 n 个反射。每个对称都置换顶点。",
  ),
  intro: t(
    "A square has $8$ symmetries: the rotations by $0^\\circ$, $90^\\circ$, $180^\\circ$ and $270^\\circ$, and the reflections in its two diagonals and its two midlines. Label the vertices $1, 2, 3, 4$ counterclockwise. The rotation by $90^\\circ$ counterclockwise sends each vertex $i$ to $i + 1$, so it is the permutation $(1\\;2\\;3\\;4)$. The reflection in the diagonal through vertex $1$ sends $i$ to $2 - i$ mod $4$, which is $(2\\;4)$.\n\nCheck: that diagonal also passes through vertex $3$, and indeed $2 - 3 = -1$, which is $3$ mod $4$, so the reflection fixes $3$ as well as $1$.\n\nIn this lesson we count the symmetries of plane figures and write symmetries of regular polygons as permutations of their vertices.",
    "正方形有 $8$ 个对称：旋转 $0^\\circ$、$90^\\circ$、$180^\\circ$、$270^\\circ$，以及关于两条对角线和两条中线的反射。把顶点逆时针标为 $1, 2, 3, 4$。逆时针旋转 $90^\\circ$ 把每个顶点 $i$ 送到 $i + 1$，所以它是置换 $(1\\;2\\;3\\;4)$。关于过顶点 $1$ 的对角线的反射把 $i$ 送到 $2 - i$（模 $4$），即 $(2\\;4)$。\n\n检验：这条对角线也经过顶点 $3$，而确实 $2 - 3 = -1$，模 $4$ 为 $3$，所以该反射除了 $1$ 也固定 $3$。\n\n本课我们数平面图形的对称，并把正多边形的对称写成顶点的置换。",
  ),
  prerequisites: ["the-symmetric-group-on-n-symbols"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-symmetries-of-figures",
      title: t("Counting symmetries", "数对称"),
      explanation: t(
        "A rectangle that is not a square has $4$ symmetries: the identity, the rotation by $180^\\circ$, and the reflections in its two lines of symmetry. A regular hexagon has $6$ rotations and $6$ reflections.\n\nCheck: a symmetry of the hexagon is fixed by where it sends one vertex, $6$ choices, and whether it keeps or reverses the order of the vertices, $2$ choices: $6 \\cdot 2 = 12$, matching $6 + 6$.\n\n> **Watch out.** The identity is a symmetry too: counting only the visible turns and flips of the rectangle gives $3$, one short.",
        "不是正方形的长方形有 $4$ 个对称：恒等变换、旋转 $180^\\circ$，以及关于两条对称轴的反射。正六边形有 $6$ 个旋转和 $6$ 个反射。\n\n检验：正六边形的对称由它把某一个顶点送到哪里（$6$ 种）以及是否反转顶点的顺序（$2$ 种）决定：$6 \\cdot 2 = 12$，与 $6 + 6$ 一致。\n\n> **注意。** 恒等变换也是对称：只数长方形看得见的转动与翻转会得到 $3$，少了一个。",
      ),
      figure: hexagonSymmetryFigure,
      generate(rng) {
        const rotationsOnly = rng.bool();
        let name: Text;
        let rotations: number;
        let symmetries: number;
        let regular = 0;
        if (rng.bool(0.6)) {
          regular = rng.int(3, 20);
          name = t(`a regular ${regular}-gon`, `正 ${regular} 边形`);
          rotations = regular;
          symmetries = 2 * regular;
        } else {
          const f = rng.pick(FIGURES);
          name = f.name;
          rotations = f.rotations;
          symmetries = f.symmetries;
        }
        const lines = symmetries - rotations;
        const value = rotationsOnly ? rotations : symmetries;
        const mistakes = apart(
          value,
          rotationsOnly
            ? [
                why(symmetries, "That includes the reflections; only the rotations are asked for.", "那把反射也算进去了；题目只问旋转。"),
                why(rotations - 1, "That leaves out the identity, the rotation by $0^\\circ$.", "那漏掉了恒等变换，即旋转 $0^\\circ$。"),
                why(
                  rotations + 1,
                  "That counts the turns by $0^\\circ$ and $360^\\circ$ separately; they are the same symmetry.",
                  "那把旋转 $0^\\circ$ 与 $360^\\circ$ 分开算了；它们是同一个对称。",
                ),
              ]
            : [
                why(rotations, "That counts only the rotations; the reflections are symmetries too.", "那只数了旋转；反射也是对称。"),
                why(
                  lines,
                  "That counts only the reflections, one per line of symmetry; the rotations, the identity among them, count too.",
                  "那只数了反射（每条对称轴一个）；旋转（包括恒等变换）也要算。",
                ),
                why(symmetries - 1, "That leaves out the identity.", "那漏掉了恒等变换。"),
                why(
                  symmetries + 1,
                  "That counts the turns by $0^\\circ$ and $360^\\circ$ separately; they are the same symmetry.",
                  "那把旋转 $0^\\circ$ 与 $360^\\circ$ 分开算了；它们是同一个对称。",
                ),
              ],
        );
        const rotationStep: [readonly [string, string], Text] =
          regular > 0
            ? [
                ["Count the rotations", "数旋转"],
                t(
                  `The rotations by the multiples of $\\frac{360^\\circ}{${regular}}$, the identity included, number $${rotations}$.`,
                  `旋转角为 $\\frac{360^\\circ}{${regular}}$ 的倍数的旋转（包括恒等变换）共 $${rotations}$ 个。`,
                ),
              ]
            : rotations === 1
              ? [
                  ["Count the rotations", "数旋转"],
                  t("Only the identity turns it onto itself: $1$ rotation.", "只有恒等变换能把它转到自身：$1$ 个旋转。"),
                ]
              : [
                  ["Count the rotations", "数旋转"],
                  t("The identity and the half turn about the center: $2$ rotations.", "恒等变换与绕中心的半周旋转：$2$ 个旋转。"),
                ];
        const reflectionStep: [readonly [string, string], Text] = [
          ["Count the reflections", "数反射"],
          lines === 0
            ? t("It has no line of symmetry, so no reflections.", "它没有对称轴，所以没有反射。")
            : t(
                `It has $${lines}$ ${lines === 1 ? "line" : "lines"} of symmetry, one reflection each.`,
                `它有 $${lines}$ 条对称轴，每条一个反射。`,
              ),
        ];
        return numberProblem({
          prompt: rotationsOnly
            ? t(
                `How many rotational symmetries (including the identity) does ${name.en} have?`,
                `${name["zh-CN"]}有多少个旋转对称（包括恒等变换）？`,
              )
            : t(`How many symmetries (rotations and reflections) does ${name.en} have?`, `${name["zh-CN"]}有多少个对称（旋转与反射）？`),
          answer: value,
          mistakes,
          solution: walked(
            rotationsOnly
              ? [rotationStep]
              : [
                  rotationStep,
                  reflectionStep,
                  [["Add", "相加"], t(`$${rotations} + ${lines} = ${symmetries}$.`, `$${rotations} + ${lines} = ${symmetries}$。`)],
                ],
            regular > 0
              ? rotationsOnly
                ? t(
                    `A rotation is fixed by where it sends one vertex, and there are $${regular}$ vertices.`,
                    `旋转由它把某一个顶点送到哪里决定，而顶点共有 $${regular}$ 个。`,
                  )
                : t(
                    `A symmetry is fixed by where it sends one vertex, $${regular}$ choices, and whether it reverses the order of the vertices, $2$ choices: $${regular} \\cdot 2 = ${symmetries}$.`,
                    `对称由它把某一个顶点送到哪里（$${regular}$ 种）以及是否反转顶点的顺序（$2$ 种）决定：$${regular} \\cdot 2 = ${symmetries}$。`,
                  )
              : t(
                  `The rotations form a subgroup of the $${symmetries}$ symmetries, and $${rotations}$ divides $${symmetries}$, as Lagrange's theorem requires.`,
                  `旋转构成 $${symmetries}$ 个对称组成的群的子群，$${rotations}$ 整除 $${symmetries}$，符合拉格朗日定理。`,
                ),
          ),
        });
      },
    },
    {
      id: "symmetries-as-permutations-of-vertices",
      title: t("Symmetries as permutations", "对称作为置换"),
      explanation: t(
        "Label the vertices of a regular $n$-gon $1, \\dots, n$ counterclockwise. The rotation by $\\frac{360k}{n}$ degrees counterclockwise sends vertex $i$ to vertex $i + k$ (mod $n$). The reflection in the line through vertex $1$ sends vertex $i$ to vertex $2 - i$ (mod $n$).\n\nCheck: in the pentagon drawn, $2 - 3 = -1$, which is $4$ mod $5$, so the reflection sends $3$ to $4$, and the picture shows $3$ and $4$ as mirror images across the dashed line.\n\n> **Watch out.** Labels run from $1$ to $n$, so a result of $0$ means vertex $n$: in the pentagon, $2 - 2 = 0$ is vertex $5$, not a vertex $0$.",
        "把正 $n$ 边形的顶点逆时针标为 $1, \\dots, n$。逆时针旋转 $\\frac{360k}{n}$ 度把顶点 $i$ 映到顶点 $i + k$（模 $n$）。关于过顶点 $1$ 的直线的反射把顶点 $i$ 映到顶点 $2 - i$（模 $n$）。\n\n检验：在图中的五边形里，$2 - 3 = -1$，模 $5$ 为 $4$，所以该反射把 $3$ 送到 $4$；图中 $3$ 与 $4$ 正是关于虚线对称的。\n\n> **注意。** 标号从 $1$ 到 $n$，所以结果为 $0$ 表示顶点 $n$：在五边形中，$2 - 2 = 0$ 是顶点 $5$，没有顶点 $0$。",
      ),
      figure: pentagonReflectionFigure,
      generate(rng) {
        const n = rng.int(4, 12);
        const i = rng.int(2, n);
        const label = (x: number) => mod(x - 1, n) + 1;
        if (rng.bool()) {
          const k = rng.int(1, n - 1);
          const deg = (360 * k) / n;
          const value = label(i + k);
          const angle = Number.isInteger(deg) ? `${deg}` : `\\frac{${360 * k}}{${n}}`;
          return numberProblem({
            prompt: t(
              `The vertices of a regular ${n}-gon are labeled $1, \\dots, ${n}$ counterclockwise. The rotation by $${angle}^\\circ$ counterclockwise sends vertex $${i}$ to which vertex?`,
              `正 ${n} 边形的顶点逆时针标为 $1, \\dots, ${n}$。逆时针旋转 $${angle}^\\circ$ 把顶点 $${i}$ 映到哪个顶点？`,
            ),
            answer: value,
            mistakes: apart(value, [
              why(
                label(i - k),
                `That turns $${k}$ places clockwise; the rotation is counterclockwise, the direction the labels increase.`,
                `那是顺时针转了 $${k}$ 位；该旋转是逆时针的，也就是标号增大的方向。`,
              ),
              why(
                label(i + k - 1),
                "That is one place short: it counts the starting vertex as one of the steps.",
                "少了一位：它把出发的顶点也算作一步。",
              ),
              why(label(k + 1), `That is where vertex $1$ goes, not vertex $${i}$.`, `那是顶点 $1$ 的去处，不是顶点 $${i}$ 的。`),
              why(
                label(i + k + 1),
                "That is one place too far: it counts one step more than the rotation makes.",
                "多了一位：比旋转实际走的多算了一步。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Turn into places", "化为位数"],
                  t(
                    `One place is $\\frac{360^\\circ}{${n}}$, so the rotation by $${angle}^\\circ$ moves each vertex $${k}$ ${k === 1 ? "place" : "places"} counterclockwise.`,
                    `一位是 $\\frac{360^\\circ}{${n}}$，所以旋转 $${angle}^\\circ$ 把每个顶点逆时针移动 $${k}$ 位。`,
                  ),
                ],
                [
                  ["Count on", "往后数"],
                  t(
                    `$${i} + ${k} = ${i + k}$${i + k > n ? `, which is $${value}$ after going past $${n}$` : ""}, so $${i} \\mapsto ${value}$.`,
                    `$${i} + ${k} = ${i + k}$${i + k > n ? `，越过 $${n}$ 后为 $${value}$` : ""}，所以 $${i} \\mapsto ${value}$。`,
                  ),
                ],
              ],
              t(
                `Turning back $${k}$ places clockwise from vertex $${value}$ returns to vertex $${i}$.`,
                `从顶点 $${value}$ 顺时针转回 $${k}$ 位，回到顶点 $${i}$。`,
              ),
            ),
          });
        }
        let v: number;
        do v = rng.int(1, n);
        while (v === i);
        const value = label(2 * v - i);
        const d = mod(i - v, n);
        return numberProblem({
          prompt: t(
            `The vertices of a regular ${n}-gon are labeled $1, \\dots, ${n}$ counterclockwise. The reflection in the line through the center and vertex $${v}$ sends vertex $${i}$ to which vertex?`,
            `正 ${n} 边形的顶点逆时针标为 $1, \\dots, ${n}$。关于过中心与顶点 $${v}$ 的直线的反射把顶点 $${i}$ 映到哪个顶点？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              label(2 - i),
              `That is the reflection in the line through vertex $1$; this line passes through vertex $${v}$.`,
              `那是关于过顶点 $1$ 的直线的反射；这条直线过的是顶点 $${v}$。`,
            ),
            why(
              i,
              `Only the vertices on the line are fixed, and vertex $${i}$ is not on it.`,
              `只有在这条直线上的顶点不动，而顶点 $${i}$ 不在上面。`,
            ),
            why(
              label(2 * v - i + 1),
              "That is one place off: the mirror image is exactly as far clockwise from the line as the vertex is counterclockwise.",
              "差了一位：镜像在直线顺时针一侧的距离，与原顶点在逆时针一侧的距离完全相同。",
            ),
            why(
              label(i + d),
              `That moves $${d}$ more places counterclockwise; the mirror image is on the other side of vertex $${v}$.`,
              `那是再向逆时针移动 $${d}$ 位；镜像在顶点 $${v}$ 的另一侧。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Measure from the line", "从对称轴量起"],
                t(
                  `Vertex $${i}$ is $${d}$ ${d === 1 ? "place" : "places"} counterclockwise from vertex $${v}$.`,
                  `顶点 $${i}$ 在顶点 $${v}$ 逆时针方向 $${d}$ 位处。`,
                ),
              ],
              [
                ["Mirror it", "取镜像"],
                t(
                  `Its mirror image is $${d}$ ${d === 1 ? "place" : "places"} clockwise from vertex $${v}$: vertex $${value}$.`,
                  `它的镜像在顶点 $${v}$ 顺时针方向 $${d}$ 位处：顶点 $${value}$。`,
                ),
              ],
            ],
            t(
              `A reflection undoes itself, and vertex $${value}$ is indeed $${d}$ ${d === 1 ? "place" : "places"} clockwise from vertex $${v}$, so the reflection sends it back to $${i}$.`,
              `反射作用两次回到原样，而顶点 $${value}$ 确实在顶点 $${v}$ 顺时针方向 $${d}$ 位处，所以反射把它送回 $${i}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** dihedralGroup finds orders of elements of dihedral groups. */
export const dihedralGroup: TopicDef = {
  id: "dihedral-group",
  title: t("Dihedral Group", "二面体群"),
  summary: t(
    "The dihedral group Dₙ is the symmetry group of a regular n-gon, of order 2n. With r the rotation by 360°/n and s a reflection, Dₙ = {e, r, …, rⁿ⁻¹, s, rs, …, rⁿ⁻¹s}, with rⁿ = s² = e and srs = r⁻¹. Every rᵏs is a reflection, of order 2.",
    "二面体群 Dₙ 是正 n 边形的对称群，阶为 2n。设 r 为旋转 360°/n，s 为一个反射，则 Dₙ = {e, r, …, rⁿ⁻¹, s, rs, …, rⁿ⁻¹s}，满足 rⁿ = s² = e 与 srs = r⁻¹。每个 rᵏs 都是反射，阶为 2。",
  ),
  intro: t(
    "$D_6$ is the symmetry group of a regular hexagon, of order $12$, with $r$ the rotation by $60^\\circ$ and $s$ a reflection. The rotation $r^2$ has order $\\frac{6}{\\gcd(2, 6)} = 3$, the half turn $r^3$ has order $2$, and every $r^ks$, such as $r^4s$, is a reflection of order $2$. So the elements of order $2$ are the $6$ reflections and $r^3$: $7$ in all.\n\nCheck: sorting all $12$ elements by order gives $e$ of order $1$, $r$ and $r^5$ of order $6$, $r^2$ and $r^4$ of order $3$, $r^3$ and the $6$ reflections of order $2$: $1 + 2 + 2 + 7 = 12$.\n\nIn this lesson we find the orders of elements of $D_n$ and count its elements of a given order.",
    "$D_6$ 是正六边形的对称群，阶为 $12$；$r$ 为旋转 $60^\\circ$，$s$ 为一个反射。旋转 $r^2$ 的阶为 $\\frac{6}{\\gcd(2, 6)} = 3$，半周旋转 $r^3$ 的阶为 $2$，每个 $r^ks$（如 $r^4s$）都是阶为 $2$ 的反射。所以 $2$ 阶元素是 $6$ 个反射与 $r^3$：共 $7$ 个。\n\n检验：把全部 $12$ 个元素按阶分类：$e$ 的阶为 $1$，$r$ 与 $r^5$ 的阶为 $6$，$r^2$ 与 $r^4$ 的阶为 $3$，$r^3$ 与 $6$ 个反射的阶为 $2$：$1 + 2 + 2 + 7 = 12$。\n\n本课我们求 $D_n$ 中元素的阶，并数其中给定阶的元素。",
  ),
  prerequisites: ["the-symmetry-group-of-a-figure", "presentations-of-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-elements-of-dihedral-groups",
      figure: algebraDrawings1["dihedral-group#orders-of-elements-of-dihedral-groups"],
      title: t("Orders in $D_n$", "$D_n$ 中元素的阶"),
      explanation: t(
        "In $D_n$ the rotation $r^k$ has order $\\frac{n}{\\gcd(k, n)}$, and every reflection $r^ks$ has order $2$. In $D_{12}$, $r^8$ has order $\\frac{12}{4} = 3$ and $r^5s$ has order $2$.\n\nCheck: $(r^8)^3 = r^{24} = e$ because $24$ is a multiple of $12$; and $(r^5s)^2 = r^5 (s r^5 s) = r^5 r^{-5} = e$, using $srs = r^{-1}$.\n\n> **Watch out.** $r^ks$ is a reflection whatever $k$ is, so its order is $2$, not the order of $r^k$.",
        "在 $D_n$ 中，旋转 $r^k$ 的阶为 $\\frac{n}{\\gcd(k, n)}$，每个反射 $r^ks$ 的阶为 $2$。在 $D_{12}$ 中，$r^8$ 的阶为 $\\frac{12}{4} = 3$，$r^5s$ 的阶为 $2$。\n\n检验：$(r^8)^3 = r^{24} = e$，因为 $24$ 是 $12$ 的倍数；$(r^5s)^2 = r^5 (s r^5 s) = r^5 r^{-5} = e$，用到 $srs = r^{-1}$。\n\n> **注意。** 不论 $k$ 是多少，$r^ks$ 都是反射，所以它的阶是 $2$，而不是 $r^k$ 的阶。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(4, 20);
          const k = rng.int(1, n - 1);
          const reflection = rng.bool(0.3);
          const g = gcd(k, n);
          const value = reflection ? 2 : n / g;
          const el = reflection ? `${rPow(k)}s` : rPow(k);
          const mistakes = apart(
            value,
            reflection
              ? [
                  why(
                    n / g,
                    `That is the order of $${rPow(k)}$; multiplying by $s$ gives a reflection, of order $2$.`,
                    `那是 $${rPow(k)}$ 的阶；乘以 $s$ 后得到反射，阶为 $2$。`,
                  ),
                  why(
                    2 * n,
                    `That is the order of the whole group $D_{${n}}$, not of one element.`,
                    `那是整个群 $D_{${n}}$ 的阶，而不是某个元素的阶。`,
                  ),
                  why(n, `That is the order of $r$; $${el}$ is a reflection.`, `那是 $r$ 的阶；$${el}$ 是反射。`),
                ]
              : [
                  why(n, `That is the order of $r$; a power of $r$ can have smaller order.`, `那是 $r$ 的阶；$r$ 的幂的阶可以更小。`),
                  why(
                    g,
                    `That is $\\gcd(${k}, ${n})$ itself; the order is $${n}$ divided by it.`,
                    `那是 $\\gcd(${k}, ${n})$ 本身；阶是 $${n}$ 除以它。`,
                  ),
                  why(
                    2 * value,
                    "That doubles the order, as if the rotation were combined with a reflection.",
                    "那是把阶翻倍了，好像这个旋转与反射结合了。",
                  ),
                ],
          );
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `In the dihedral group $D_{${n}}$ of order $${2 * n}$, with $r$ the rotation by $\\frac{360^\\circ}{${n}}$ and $s$ a reflection, find the order of $${el}$.`,
              `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$r$ 为旋转 $\\frac{360^\\circ}{${n}}$，$s$ 为一个反射。求 $${el}$ 的阶。`,
            ),
            answer: value,
            mistakes,
            solution: reflection
              ? walked(
                  [
                    [
                      ["Recognize a reflection", "识别反射"],
                      t(
                        `Every element $r^ks$ is a reflection, so $${el}$ is a reflection.`,
                        `每个 $r^ks$ 形式的元素都是反射，所以 $${el}$ 是反射。`,
                      ),
                    ],
                    [
                      ["Read the order", "读出阶"],
                      t(
                        `A reflection is not the identity, and applying it twice gives $e$: the order is $2$.`,
                        `反射不是恒等变换，作用两次得 $e$：阶为 $2$。`,
                      ),
                    ],
                  ],
                  t(
                    `$(${el})^2 = ${rPow(k)}(s${rPow(k)}s) = ${rPow(k)}r^{-${k}} = e$, using $srs = r^{-1}$.`,
                    `$(${el})^2 = ${rPow(k)}(s${rPow(k)}s) = ${rPow(k)}r^{-${k}} = e$，用到 $srs = r^{-1}$。`,
                  ),
                )
              : walked(
                  [
                    [["Find the gcd", "求最大公约数"], t(`$\\gcd(${k}, ${n}) = ${g}$.`, `$\\gcd(${k}, ${n}) = ${g}$。`)],
                    [
                      ["Divide", "相除"],
                      g === 1
                        ? t(`So $${el}$ has order $${n}$, the same as $r$.`, `所以 $${el}$ 的阶为 $${n}$，与 $r$ 相同。`)
                        : t(
                            `So $${el}$ has order $\\frac{${n}}{${g}} = ${value}$.`,
                            `所以 $${el}$ 的阶为 $\\frac{${n}}{${g}} = ${value}$。`,
                          ),
                    ],
                  ],
                  t(
                    `$(${el})^{${value}} = r^{${k * value}}$, and $${k * value}$ is the least positive multiple of $${k}$ that is a multiple of $${n}$, so this is the first power equal to $e$.`,
                    `$(${el})^{${value}} = r^{${k * value}}$，而 $${k * value}$ 是 $${k}$ 的正倍数中最小的 $${n}$ 的倍数，所以这是第一个等于 $e$ 的幂。`,
                  ),
                ),
          });
        }
      },
    },
    {
      id: "counting-elements-of-dihedral-groups",
      figure: algebraDrawings1["dihedral-group#counting-elements-of-dihedral-groups"],
      title: t("Counting elements of $D_n$", "$D_n$ 中的计数"),
      explanation: t(
        "$D_n$ has $n$ reflections, each of order $2$. When $n$ is even, the half turn $r^{n/2}$ also has order $2$, so $D_n$ has $n + 1$ elements of order $2$; when $n$ is odd it has $n$.\n\nCheck: in $D_4$, the symmetries of a square, the elements of order $2$ are the $4$ reflections and the half turn $r^2$: $5 = 4 + 1$.\n\n> **Watch out.** When $n$ is even, do not forget the half turn $r^{n/2}$; it is a rotation, yet it has order $2$ like the reflections.",
        "$D_n$ 有 $n$ 个反射，每个的阶都是 $2$。$n$ 为偶数时，半周旋转 $r^{n/2}$ 的阶也是 $2$，所以 $D_n$ 有 $n + 1$ 个 $2$ 阶元素；$n$ 为奇数时有 $n$ 个。\n\n检验：在正方形的对称群 $D_4$ 中，$2$ 阶元素是 $4$ 个反射与半周旋转 $r^2$：$5 = 4 + 1$。\n\n> **注意。** $n$ 为偶数时，别忘了半周旋转 $r^{n/2}$；它是旋转，但和反射一样阶为 $2$。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const kind = rng.int(0, 1);
        if (kind === 0) {
          const even = n % 2 === 0;
          const value = even ? n + 1 : n;
          return numberProblem({
            prompt: t(
              `How many elements of order $2$ does the dihedral group $D_{${n}}$ of order $${2 * n}$ have?`,
              `$${2 * n}$ 阶二面体群 $D_{${n}}$ 有多少个 $2$ 阶元素？`,
            ),
            answer: value,
            mistakes: apart(value, [
              even
                ? why(
                    n,
                    `That counts only the reflections; the half turn $r^{${n / 2}}$ also has order $2$.`,
                    `那只数了反射；半周旋转 $r^{${n / 2}}$ 的阶也是 $2$。`,
                  )
                : why(
                    n + 1,
                    `That adds a half turn, but $${n}$ is odd, so no rotation has order $2$.`,
                    `那加上了一个半周旋转，但 $${n}$ 是奇数，没有 $2$ 阶旋转。`,
                  ),
              why(
                2 * n - 1,
                "That counts every element except the identity; the rotations other than a half turn do not have order $2$.",
                "那是除恒等变换外的全部元素；除半周旋转外，旋转的阶都不是 $2$。",
              ),
              why(1, "That counts only one element; every reflection has order $2$.", "那只数了一个元素；每个反射的阶都是 $2$。"),
            ]),
            solution: walked(
              [
                [
                  ["Count the reflections", "数反射"],
                  t(`$D_{${n}}$ has $${n}$ reflections, each of order $2$.`, `$D_{${n}}$ 有 $${n}$ 个反射，每个的阶都是 $2$。`),
                ],
                even
                  ? [
                      ["Add the half turn", "加上半周旋转"],
                      t(
                        `$${n}$ is even, so the half turn $r^{${n / 2}}$ has order $2$ too: $${n} + 1 = ${value}$.`,
                        `$${n}$ 是偶数，所以半周旋转 $r^{${n / 2}}$ 的阶也是 $2$：$${n} + 1 = ${value}$。`,
                      ),
                    ]
                  : [
                      ["Check the rotations", "检查旋转"],
                      t(
                        `$${n}$ is odd, so no rotation has order $2$: the count is $${value}$.`,
                        `$${n}$ 是奇数，所以没有 $2$ 阶旋转：共 $${value}$ 个。`,
                      ),
                    ],
              ],
              even
                ? t(
                    `$r^k$ has order $2$ exactly when $\\frac{${n}}{\\gcd(k, ${n})} = 2$, which for $0 < k < ${n}$ happens only at $k = ${n / 2}$.`,
                    `$r^k$ 的阶为 $2$ 当且仅当 $\\frac{${n}}{\\gcd(k, ${n})} = 2$，对 $0 < k < ${n}$ 只有 $k = ${n / 2}$。`,
                  )
                : t(
                    `$r^k$ has order $\\frac{${n}}{\\gcd(k, ${n})}$, a divisor of the odd number $${n}$, so it is never $2$.`,
                    `$r^k$ 的阶为 $\\frac{${n}}{\\gcd(k, ${n})}$，是奇数 $${n}$ 的因数，所以不可能是 $2$。`,
                  ),
            ),
          });
        }
        const d = rng.pick([3, 4, 5, 6]);
        const m = n * d <= 60 ? n * d : d * rng.int(1, 6);
        const value = phi(d);
        const sub = m / d === 1 ? "r" : `r^{${m / d}}`;
        return numberProblem({
          prompt: t(
            `How many elements of order $${d}$ does the dihedral group $D_{${m}}$ of order $${2 * m}$ have?`,
            `$${2 * m}$ 阶二面体群 $D_{${m}}$ 有多少个 $${d}$ 阶元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              d,
              `That counts every element of the subgroup of order $${d}$; only its generators have order $${d}$.`,
              `那数的是 $${d}$ 阶子群的全部元素；只有它的生成元的阶是 $${d}$。`,
            ),
            why(
              d - 1,
              `That leaves out only the identity, but some elements of the subgroup of order $${d}$ have smaller order.`,
              `那只去掉了恒等变换，但 $${d}$ 阶子群中有些元素的阶更小。`,
            ),
            why(
              m / d,
              `That is $\\frac{${m}}{${d}}$, the index of the subgroup of order $${d}$ in $\\langle r \\rangle$, not a count of elements of order $${d}$.`,
              `那是 $\\frac{${m}}{${d}}$，即 $${d}$ 阶子群在 $\\langle r \\rangle$ 中的指数，不是 $${d}$ 阶元素的个数。`,
            ),
            why(
              2 * value,
              `That adds reflections, but every reflection has order $2$, not $${d}$.`,
              `那把反射也算进去了，但每个反射的阶都是 $2$，而不是 $${d}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Rule out reflections", "排除反射"],
                t(
                  `Reflections have order $2$, so only rotations $r^k$ can have order $${d}$.`,
                  `反射的阶为 $2$，所以只有旋转 $r^k$ 可能是 $${d}$ 阶。`,
                ),
              ],
              [
                ["Count generators", "数生成元"],
                t(
                  `They are the generators of the subgroup $\\langle ${sub} \\rangle$ of order $${d}$ of $\\langle r \\rangle$: there are $\\varphi(${d}) = ${value}$.`,
                  `它们是 $\\langle r \\rangle$ 的 $${d}$ 阶子群 $\\langle ${sub} \\rangle$ 的生成元：共 $\\varphi(${d}) = ${value}$ 个。`,
                ),
              ],
            ],
            t(
              `They are the powers $${m / d === 1 ? "r^{j}" : `r^{${m / d}j}`}$ with $1 \\le j < ${d}$ and $\\gcd(j, ${d}) = 1$, and there are $${value}$ such $j$.`,
              `它们是满足 $1 \\le j < ${d}$ 且 $\\gcd(j, ${d}) = 1$ 的幂 $${m / d === 1 ? "r^{j}" : `r^{${m / d}j}`}$，这样的 $j$ 有 $${value}$ 个。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theSymmetryGroupOfATetrahedron works with rotations of a regular tetrahedron as permutations of its vertices. */
export const theSymmetryGroupOfATetrahedron: TopicDef = {
  id: "the-symmetry-group-of-a-tetrahedron",
  title: t("The Symmetry Group of a Tetrahedron", "正四面体的对称群"),
  summary: t(
    "Every symmetry of a regular tetrahedron permutes its four vertices, and every permutation arises, so the full symmetry group is S₄, of order 24. The 12 rotations are the even permutations, A₄: the identity, 8 rotations of order 3 about axes through a vertex, and 3 half turns about axes through midpoints of opposite edges.",
    "正四面体的每个对称都置换它的四个顶点，并且每个置换都能实现，所以全对称群为 S₄，阶为 24。12 个旋转就是偶置换 A₄：恒等变换、绕过顶点的轴的 8 个 3 阶旋转，以及绕过对棱中点的轴的 3 个半周旋转。",
  ),
  intro: t(
    "Label the vertices of a regular tetrahedron $1, 2, 3, 4$. A rotation about the axis through vertex $2$ fixes $2$ and cycles the other three; if it sends $1 \\mapsto 3$, it is $(1\\;3\\;4)$, so it sends $4 \\mapsto 1$. A half turn about the axis through the midpoints of two opposite edges swaps both pairs of ends, such as $(1\\;2)(3\\;4)$. The rotations are the $12$ even permutations, $A_4$; with the reflections, all $24$ permutations of $S_4$ occur.\n\nCheck: $(1\\;3\\;4)$ and $(1\\;2)(3\\;4)$ are each a product of $2$ transpositions, so both are even, as rotations must be.\n\nIn this lesson we write rotations of a tetrahedron as permutations of its vertices and tell rotations from the other symmetries.",
    "把正四面体的顶点标为 $1, 2, 3, 4$。绕过顶点 $2$ 的轴的旋转固定 $2$，并轮换其余三个顶点；若它把 $1 \\mapsto 3$，它就是 $(1\\;3\\;4)$，所以把 $4 \\mapsto 1$。绕过两条对棱中点的轴的半周旋转同时交换两条棱的端点，例如 $(1\\;2)(3\\;4)$。旋转恰是 $12$ 个偶置换 $A_4$；加上反射，$S_4$ 的全部 $24$ 个置换都会出现。\n\n检验：$(1\\;3\\;4)$ 与 $(1\\;2)(3\\;4)$ 都是 $2$ 个对换之积，都是偶置换，正如旋转所必须的。\n\n本课我们把正四面体的旋转写成顶点的置换，并区分旋转与其他对称。",
  ),
  prerequisites: ["dihedral-group", "the-alternating-group-on-n-symbols"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rotations-of-a-tetrahedron",
      figure: algebraDrawings1["the-symmetry-group-of-a-tetrahedron#rotations-of-a-tetrahedron"],
      title: t("Rotations as permutations", "旋转作为置换"),
      explanation: t(
        "A rotation fixing vertex $1$ is a $3$-cycle of the other vertices: if it sends $2 \\mapsto 3$, it is $(2\\;3\\;4)$ and sends $4 \\mapsto 2$. A rotation swapping two vertices is a half turn, which also swaps the other two: $(1\\;2)(3\\;4)$.\n\nCheck: $(2\\;3\\;4)$ is a product of $2$ transpositions and $(1\\;2)(3\\;4)$ of $2$ as well, so both are even, as every rotation of the tetrahedron must be.\n\n> **Watch out.** A rotation cannot swap just two vertices and fix the others: the transposition $(1\\;2)$ is odd, so it is a reflection, not a rotation.",
        "固定顶点 $1$ 的旋转是其余顶点的 $3$-轮换：若它把 $2 \\mapsto 3$，它就是 $(2\\;3\\;4)$，把 $4 \\mapsto 2$。交换两个顶点的旋转是半周旋转，它同时交换另外两个顶点：$(1\\;2)(3\\;4)$。\n\n检验：$(2\\;3\\;4)$ 是 $2$ 个对换之积，$(1\\;2)(3\\;4)$ 也是 $2$ 个对换之积，所以两者都是偶置换，正四面体的旋转都必须如此。\n\n> **注意。** 旋转不能只交换两个顶点而固定其余顶点：对换 $(1\\;2)$ 是奇置换，所以它是反射，不是旋转。",
      ),
      generate(rng) {
        const [a, b, c, d] = rng.shuffle([1, 2, 3, 4]) as [number, number, number, number];
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `The vertices of a regular tetrahedron are labeled $1, 2, 3, 4$. A rotation of the tetrahedron fixes vertex $${a}$ and sends vertex $${b}$ to vertex $${c}$. Where does it send vertex $${d}$?`,
              `正四面体的顶点标为 $1, 2, 3, 4$。它的一个旋转固定顶点 $${a}$，并把顶点 $${b}$ 映到顶点 $${c}$。它把顶点 $${d}$ 映到哪里？`,
            ),
            answer: b,
            mistakes: [
              why(
                c,
                `Vertex $${b}$ already goes to $${c}$, and a rotation sends different vertices to different places.`,
                `顶点 $${b}$ 已经映到 $${c}$，而旋转把不同的顶点送到不同的位置。`,
              ),
              why(
                d,
                `A rotation fixing vertex $${d}$ as well as $${a}$ would be the reflection $(${b}\\;${c})$, which is odd, not a rotation.`,
                `同时固定顶点 $${d}$ 与 $${a}$ 的对称是反射 $(${b}\\;${c})$，它是奇置换，不是旋转。`,
              ),
              why(
                a,
                `Vertex $${a}$ stays where it is, so no other vertex can go there.`,
                `顶点 $${a}$ 留在原处，所以别的顶点不能送到那里。`,
              ),
            ],
            solution: walked(
              [
                [
                  ["Cycle the other three", "轮换其余三个"],
                  t(
                    `Fixing $${a}$, the rotation cycles $${b}, ${c}, ${d}$; since $${b} \\mapsto ${c}$, it is $(${b}\\;${c}\\;${d})$.`,
                    `固定 $${a}$ 时，该旋转轮换 $${b}, ${c}, ${d}$；由于 $${b} \\mapsto ${c}$，它就是 $(${b}\\;${c}\\;${d})$。`,
                  ),
                ],
                [["Read the image", "读出像"], t(`So $${d} \\mapsto ${b}$.`, `所以 $${d} \\mapsto ${b}$。`)],
              ],
              t(
                `$(${b}\\;${c}\\;${d})$ is a $3$-cycle, an even permutation, so it is indeed a rotation.`,
                `$(${b}\\;${c}\\;${d})$ 是 $3$-轮换，是偶置换，所以确实是旋转。`,
              ),
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `The vertices of a regular tetrahedron are labeled $1, 2, 3, 4$. A rotation of the tetrahedron sends vertex $${a}$ to vertex $${b}$ and vertex $${b}$ to vertex $${a}$. Where does it send vertex $${c}$?`,
            `正四面体的顶点标为 $1, 2, 3, 4$。它的一个旋转把顶点 $${a}$ 映到顶点 $${b}$，把顶点 $${b}$ 映到顶点 $${a}$。它把顶点 $${c}$ 映到哪里？`,
          ),
          answer: d,
          mistakes: [
            why(
              c,
              `Fixing $${c}$ would make the symmetry the transposition $(${a}\\;${b})$, which is odd, so it would be a reflection.`,
              `若固定 $${c}$，这个对称就是对换 $(${a}\\;${b})$，它是奇置换，所以是反射。`,
            ),
            why(a, `Vertex $${b}$ already goes to $${a}$.`, `顶点 $${b}$ 已经映到 $${a}$。`),
            why(b, `Vertex $${a}$ already goes to $${b}$.`, `顶点 $${a}$ 已经映到 $${b}$。`),
          ],
          solution: walked(
            [
              [
                ["Use parity", "利用奇偶性"],
                t(
                  `A rotation is an even permutation, so it cannot be the transposition $(${a}\\;${b})$ alone.`,
                  `旋转是偶置换，不能只是对换 $(${a}\\;${b})$。`,
                ),
              ],
              [
                ["Swap the other pair", "交换另一对"],
                t(
                  `It must be the half turn $(${a}\\;${b})(${c}\\;${d})$, sending $${c} \\mapsto ${d}$.`,
                  `它必然是半周旋转 $(${a}\\;${b})(${c}\\;${d})$，把 $${c} \\mapsto ${d}$。`,
                ),
              ],
            ],
            t(
              `$(${a}\\;${b})(${c}\\;${d})$ is a product of $2$ transpositions, so it is even, and it does swap $${a}$ with $${b}$.`,
              `$(${a}\\;${b})(${c}\\;${d})$ 是 $2$ 个对换之积，是偶置换，并且确实交换 $${a}$ 与 $${b}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "rotations-and-reflections-of-a-tetrahedron",
      figure: algebraDrawings1["the-symmetry-group-of-a-tetrahedron#rotations-and-reflections-of-a-tetrahedron"],
      title: t("Rotation or not", "是否为旋转"),
      explanation: t(
        "A symmetry of the tetrahedron is a rotation exactly when it permutes the vertices evenly. The reflection in the plane through an edge and the midpoint of the opposite edge is a transposition, such as $(1\\;2)$, so it is not a rotation.\n\nCheck: $(1\\;2\\;3\\;4)$ is a product of $3$ transpositions, so it is odd and is not a rotation either; it is a quarter turn followed by a reflection.\n\n> **Watch out.** Multiply overlapping cycles out before judging, or add their transposition counts: $(1\\;2)(1\\;3)$ looks like two swaps but is the $3$-cycle $(1\\;3\\;2)$, an even permutation and a rotation.",
        "正四面体的对称是旋转当且仅当它对顶点的置换是偶置换。关于过一条棱与对棱中点的平面的反射是一个对换，例如 $(1\\;2)$，所以它不是旋转。\n\n检验：$(1\\;2\\;3\\;4)$ 是 $3$ 个对换之积，是奇置换，所以也不是旋转；它是四分之一周旋转再接一个反射。\n\n> **注意。** 有重叠的轮换要先乘出来再判断，或把它们的对换个数相加：$(1\\;2)(1\\;3)$ 看起来是两次交换，其实是 $3$-轮换 $(1\\;3\\;2)$，是偶置换，也是旋转。",
      ),
      generate(rng) {
        let cs: number[][];
        let p: Perm;
        do {
          cs = range(1, rng.int(1, 3)).map(() => rng.sample(range(0, 3), rng.int(2, 4)));
          p = productOfCycles(4, cs);
        } while (cyclesOf(p).length === 0);
        const even = isEven(p);
        return factProblem({
          prompt: t(
            `The vertices of a regular tetrahedron are labeled $1, 2, 3, 4$. Is the symmetry that permutes the vertices by $${cyclesTex(cs)}$ a rotation?`,
            `正四面体的顶点标为 $1, 2, 3, 4$。按 $${cyclesTex(cs)}$ 置换顶点的对称是旋转吗？`,
          ),
          holds: even,
          reason: t(
            `$${cyclesTex(cs)} = ${permCycleTex(p)}$ is ${even ? "even, so it lies in $A_4$, the rotation group" : "odd, so it is not in $A_4$, the rotation group"}.`,
            `$${cyclesTex(cs)} = ${permCycleTex(p)}$ 是${even ? "偶置换，属于旋转群 $A_4$" : "奇置换，不属于旋转群 $A_4$"}。`,
          ),
        });
      },
    },
  ],
};

/** Mat3 is a 3 × 3 matrix, used for the symmetries of a cube centered at the origin. */
type Mat3 = readonly (readonly number[])[];

/** mul3 multiplies two 3 × 3 matrices. */
const mul3 = (a: Mat3, b: Mat3): Mat3 =>
  range(0, 2).map((i) => range(0, 2).map((j) => range(0, 2).reduce((s, k) => s + a[i]![k]! * b[k]![j]!, 0)));

/** det3 is the determinant of a 3 × 3 matrix. */
const det3 = (m: Mat3) =>
  m[0]![0]! * (m[1]![1]! * m[2]![2]! - m[1]![2]! * m[2]![1]!) -
  m[0]![1]! * (m[1]![0]! * m[2]![2]! - m[1]![2]! * m[2]![0]!) +
  m[0]![2]! * (m[1]![0]! * m[2]![1]! - m[1]![1]! * m[2]![0]!);

/** isIdentity3 reports whether a matrix is the identity. */
const isIdentity3 = (m: Mat3) => m.every((row, i) => row.every((x, j) => x === (i === j ? 1 : 0)));

/** order3 is the order of an invertible 3 × 3 matrix of finite order. */
function order3(m: Mat3): number {
  let p = m;
  let k = 1;
  while (!isIdentity3(p)) {
    p = mul3(p, m);
    k++;
  }
  return k;
}

/** randomCubeSymmetry is a random non-identity symmetry of the cube [−1, 1]³: a signed permutation matrix. */
function randomCubeSymmetry(rng: Rng): Mat3 {
  let m: Mat3;
  do {
    const perm = rng.shuffle([0, 1, 2]);
    m = range(0, 2).map((i) => range(0, 2).map((j) => (j === perm[i] ? rng.pick([1, -1]) : 0)));
  } while (isIdentity3(m));
  return m;
}

/** cubeMapTex writes a symmetry as a map of coordinates, such as (x, y, z) ↦ (−y, x, z). */
const cubeMapTex = (m: Mat3) =>
  `(x, y, z) \\mapsto (${m
    .map((row) => {
      const j = row.findIndex((v) => v !== 0);
      return `${row[j] === -1 ? "-" : ""}${"xyz"[j]}`;
    })
    .join(", ")})`;

/** apply3 applies a matrix to a point. */
const apply3 = (m: Mat3, v: readonly number[]) => m.map((row) => row.reduce((s, x, j) => s + x * v[j]!, 0));

/** pointTex writes a point. */
const pointTex = (v: readonly number[]) => `(${v.join(", ")})`;

/** CUBE_SETUP describes the cube used in cube problems. */
const CUBE_SETUP = t(
  "The cube $[-1, 1]^3$ is centered at the origin with faces perpendicular to the axes.",
  "立方体 $[-1, 1]^3$ 以原点为中心，各面垂直于坐标轴。",
);

/** power3 is the k-th power of a matrix, for k ≥ 1. */
const power3 = (m: Mat3, k: number): Mat3 => (k <= 1 ? m : mul3(power3(m, k - 1), m));

/** powersTex lists the first k powers of a cube symmetry as maps. */
const powersTex = (m: Mat3, k: number) =>
  range(1, k)
    .map((j) => `$${cubeMapTex(power3(m, j))}$`)
    .join(", ");

/** ordinal writes 2 to 6 as an English ordinal word. */
const ordinal = (k: number) => ["first", "second", "third", "fourth", "fifth", "sixth"][k - 1] ?? `${k}th`;

/** cubeOrderMistakes explains the usual wrong orders 2, 3, 4 and 6 of the cube symmetry m of order value, after the given ones. */
function cubeOrderMistakes(m: Mat3, value: number, first: readonly ReturnType<typeof why>[]) {
  const guesses = [2, 3, 4, 6].map((k) =>
    k % value === 0
      ? why(
          k,
          `Applying it $${k}$ times does give the identity, but $${value}$ times already does; the order is the least such number.`,
          `作用 $${k}$ 次确实得到恒等变换，但作用 $${value}$ 次就已经得到了；阶是这样的次数中最小的。`,
        )
      : why(
          k,
          `Applying it $${k}$ times gives $${cubeMapTex(power3(m, k))}$, which is not the identity.`,
          `作用 $${k}$ 次得到 $${cubeMapTex(power3(m, k))}$，不是恒等变换。`,
        ),
  );
  return apart(value, [...first, ...guesses]).slice(0, 4);
}

/** theSymmetryGroupOfACubeRotationsAndReflections classifies symmetries of the cube and finds their orders. */
export const theSymmetryGroupOfACubeRotationsAndReflections: TopicDef = {
  id: "the-symmetry-group-of-a-cube-rotations-and-reflections",
  title: t("The Symmetry Group of a Cube: Rotations and Reflections", "立方体的对称群：旋转与反射"),
  summary: t(
    "The cube has 48 symmetries. The 24 rotations are the identity, 9 rotations about axes through centers of opposite faces (6 of order 4, 3 of order 2), 8 of order 3 about axes through opposite vertices, and 6 half turns about axes through midpoints of opposite edges. For the cube [−1, 1]³ the symmetries are the maps permuting the coordinates and changing their signs; a symmetry is a rotation exactly when its matrix has determinant 1.",
    "立方体有 48 个对称。24 个旋转为：恒等变换、绕过对面中心的轴的 9 个旋转（6 个 4 阶、3 个 2 阶）、绕过对顶点的轴的 8 个 3 阶旋转，以及绕过对棱中点的轴的 6 个半周旋转。对立方体 [−1, 1]³，对称就是置换坐标并改变其符号的映射；对称是旋转当且仅当其矩阵的行列式为 1。",
  ),
  intro: t(
    "For the cube $[-1, 1]^3$, consider $(x, y, z) \\mapsto (y, -x, z)$. It swaps two coordinates, sign $-1$, and negates one, another $-1$, so its matrix has determinant $1$ and it is a rotation: a quarter turn about the $z$-axis. Applying it twice gives $(-x, -y, z)$, and four times gives $(x, y, z)$, so its order is $4$. By contrast $(x, y, z) \\mapsto (x, y, -z)$ has determinant $-1$: it is the reflection in the $xy$-plane, of order $2$.\n\nCheck: the square $(-x, -y, z)$ is a half turn, not the identity, so the order is more than $2$, and it divides $4$ because the fourth power is the identity.\n\nIn this lesson we tell rotations of the cube from reflections and find the orders of its symmetries.",
    "对立方体 $[-1, 1]^3$，考虑 $(x, y, z) \\mapsto (y, -x, z)$。它交换两个坐标（符号 $-1$），并使一个坐标变号（又一个 $-1$），所以矩阵的行列式为 $1$，它是旋转：绕 $z$ 轴的四分之一周旋转。作用两次得 $(-x, -y, z)$，作用四次得 $(x, y, z)$，所以阶为 $4$。相比之下，$(x, y, z) \\mapsto (x, y, -z)$ 的行列式为 $-1$：它是关于 $xy$ 平面的反射，阶为 $2$。\n\n检验：平方 $(-x, -y, z)$ 是半周旋转而不是恒等变换，所以阶大于 $2$；又因四次幂是恒等变换，阶整除 $4$。\n\n本课我们区分立方体的旋转与反射，并求它的对称的阶。",
  ),
  prerequisites: ["the-symmetry-group-of-a-tetrahedron"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rotations-or-reflections-of-a-cube",
      figure: algebraDrawings1["the-symmetry-group-of-a-cube-rotations-and-reflections#rotations-or-reflections-of-a-cube"],
      title: t("Rotation or not", "是否为旋转"),
      explanation: t(
        "Write the symmetry as a matrix with one $\\pm 1$ in each row and column. Its determinant is the sign of the coordinate permutation times the product of the signs. $(x, y, z) \\mapsto (-y, x, z)$ swaps two coordinates (sign $-1$) and negates one ($-1$), so the determinant is $1$: a quarter turn about the $z$-axis.\n\nCheck: applied to the point $(1, 0, 0)$ it gives $(0, 1, 0)$, and to $(0, 1, 0)$ it gives $(-1, 0, 0)$, a turn by $90^\\circ$ in the $xy$-plane with $z$ untouched.\n\n> **Watch out.** Count both kinds of sign: $(x, y, z) \\mapsto (-x, -y, -z)$ has three minus signs and no swap, so its determinant is $-1$; the central inversion is not a rotation.",
        "把对称写成每行每列恰有一个 $\\pm 1$ 的矩阵。它的行列式等于坐标置换的符号乘以各符号之积。$(x, y, z) \\mapsto (-y, x, z)$ 交换两个坐标（符号 $-1$）并使一个变号（$-1$），所以行列式为 $1$：它是绕 $z$ 轴的四分之一周旋转。\n\n检验：它把 $(1, 0, 0)$ 映到 $(0, 1, 0)$，把 $(0, 1, 0)$ 映到 $(-1, 0, 0)$，正是在 $xy$ 平面内转 $90^\\circ$，而 $z$ 不变。\n\n> **注意。** 两种符号都要算：$(x, y, z) \\mapsto (-x, -y, -z)$ 有三个负号且没有交换，所以行列式为 $-1$；中心反演不是旋转。",
      ),
      generate(rng) {
        const m = randomCubeSymmetry(rng);
        const d = det3(m);
        return factProblem({
          prompt: t(
            `${CUBE_SETUP.en} Is the symmetry $${cubeMapTex(m)}$ a rotation?`,
            `${CUBE_SETUP["zh-CN"]}对称 $${cubeMapTex(m)}$ 是旋转吗？`,
          ),
          holds: d === 1,
          reason: t(`Its matrix has determinant $${d}$.`, `它的矩阵行列式为 $${d}$。`),
        });
      },
    },
    {
      id: "orders-of-symmetries-of-a-cube",
      figure: algebraDrawings1["the-symmetry-group-of-a-cube-rotations-and-reflections#orders-of-symmetries-of-a-cube"],
      title: t("Orders of symmetries", "对称的阶"),
      explanation: t(
        "Apply the map repeatedly until every coordinate returns. $(x, y, z) \\mapsto (y, z, x)$ cycles the coordinates and has order $3$: it is a rotation about the diagonal through $(1, 1, 1)$. $(x, y, z) \\mapsto (-y, x, -z)$ has order $4$.\n\nCheck: applying $(x, y, z) \\mapsto (-y, x, -z)$ twice gives $(-x, -y, z)$, three times $(y, -x, -z)$, and four times $(x, y, z)$, so $4$ is the first return.\n\n> **Watch out.** Watch the signs as well as the positions: after two steps $(-x, -y, z)$ has every coordinate back in its place, but two signs are still flipped, so it is not the identity yet.",
        "反复作用该映射，直到每个坐标都回到原样。$(x, y, z) \\mapsto (y, z, x)$ 轮换坐标，阶为 $3$：它是绕过 $(1, 1, 1)$ 的对角线的旋转。$(x, y, z) \\mapsto (-y, x, -z)$ 的阶为 $4$。\n\n检验：把 $(x, y, z) \\mapsto (-y, x, -z)$ 作用两次得 $(-x, -y, z)$，三次得 $(y, -x, -z)$，四次得 $(x, y, z)$，所以 $4$ 是第一次回到原样。\n\n> **注意。** 位置和符号都要看：两步后 $(-x, -y, z)$ 中每个坐标都回到了原位，但仍有两个符号是反的，所以还不是恒等变换。",
      ),
      generate(rng) {
        const m = randomCubeSymmetry(rng);
        const value = order3(m);
        const unsigned = m.map((row) => row.map(Math.abs));
        return numberProblem({
          prompt: t(
            `${CUBE_SETUP.en} Find the order of the symmetry $${cubeMapTex(m)}$.`,
            `${CUBE_SETUP["zh-CN"]}求对称 $${cubeMapTex(m)}$ 的阶。`,
          ),
          answer: value,
          mistakes: cubeOrderMistakes(m, value, [
            why(
              order3(unsigned),
              "That is the order of the shuffle of the coordinates alone; the signs must come back too.",
              "那只是坐标位置调换的阶；符号也必须复原。",
            ),
          ]),
          solution: walked(
            [[["Apply it repeatedly", "反复作用"], t(`The powers are ${powersTex(m, value)}.`, `各次幂依次为 ${powersTex(m, value)}。`)]],
            t(
              `The first power equal to $(x, y, z)$ is the ${ordinal(value)}, so the order is $${value}$.`,
              `第一个等于 $(x, y, z)$ 的是第 $${value}$ 次幂，所以阶为 $${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theSymmetryGroupOfACubeCombiningRotationsAndReflections composes symmetries of the cube. */
export const theSymmetryGroupOfACubeCombiningRotationsAndReflections: TopicDef = {
  id: "the-symmetry-group-of-a-cube-combining-rotations-and-reflections",
  title: t("The Symmetry Group of a Cube: Combining Rotations and Reflections", "立方体的对称群：旋转与反射的复合"),
  summary: t(
    "Composing symmetries multiplies their matrices. A composite of two rotations or two reflections is a rotation; a rotation composed with a reflection is not. Every symmetry of the cube is a rotation or a rotation composed with the central inversion (x, y, z) ↦ (−x, −y, −z), which commutes with every symmetry.",
    "复合对称就是把它们的矩阵相乘。两个旋转或两个反射的复合是旋转；旋转与反射的复合不是旋转。立方体的每个对称都是一个旋转，或者一个旋转与中心反演 (x, y, z) ↦ (−x, −y, −z) 的复合，而中心反演与每个对称都可交换。",
  ),
  intro: t(
    "Let $\\rho: (x, y, z) \\mapsto (y, z, x)$, a rotation of order $3$, and $\\mu: (x, y, z) \\mapsto (-x, y, z)$, a reflection. The composite $\\rho \\circ \\mu$ applies $\\mu$ first, giving $(-x, y, z)$, and then $\\rho$, giving $(y, z, -x)$. Applying $\\rho \\circ \\mu$ again gives $(z, -x, -y)$, and a third time gives $(-x, -y, -z)$, the central inversion. So the sixth power is the identity while none of the first three powers is, and the order, a divisor of $6$, is $6$.\n\nCheck: at the point $(1, 2, 3)$, $\\mu$ gives $(-1, 2, 3)$ and $\\rho$ then gives $(2, 3, -1)$, which is what the formula $(y, z, -x)$ gives.\n\nIn this lesson we compose symmetries of the cube, find images under the composite and find its order.",
    "设 $\\rho: (x, y, z) \\mapsto (y, z, x)$，它是 $3$ 阶旋转；$\\mu: (x, y, z) \\mapsto (-x, y, z)$，它是反射。复合 $\\rho \\circ \\mu$ 先作用 $\\mu$ 得 $(-x, y, z)$，再作用 $\\rho$ 得 $(y, z, -x)$。再作用一次 $\\rho \\circ \\mu$ 得 $(z, -x, -y)$，第三次得 $(-x, -y, -z)$，即中心反演。所以六次幂是恒等变换，而前三次幂都不是；阶是 $6$ 的因数，只能是 $6$。\n\n检验：在点 $(1, 2, 3)$ 处，$\\mu$ 得 $(-1, 2, 3)$，再作用 $\\rho$ 得 $(2, 3, -1)$，与公式 $(y, z, -x)$ 给出的一致。\n\n本课我们复合立方体的对称，求复合下的像，并求复合的阶。",
  ),
  prerequisites: ["the-symmetry-group-of-a-cube-rotations-and-reflections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "images-under-composite-symmetries",
      title: t("Composing symmetries", "复合对称"),
      explanation: t(
        "A composite symmetry applies the right map first and then the left map, so substitute the result of one into the formula of the other. $\\rho \\circ \\mu$ applies $\\mu$ first. With $\\mu: (x, y, z) \\mapsto (x, y, -z)$ and $\\rho: (x, y, z) \\mapsto (-y, x, z)$: $\\mu(1, 2, 3) = (1, 2, -3)$ and $\\rho(1, 2, -3) = (-2, 1, -3)$.\n\nCheck: $\\rho \\circ \\mu$ is the map $(x, y, z) \\mapsto (-y, x, -z)$, and at $(1, 2, 3)$ it gives $(-2, 1, -3)$ again.\n\n> **Watch out.** Applying $\\rho$ first gives $\\mu(\\rho(1, 2, 3)) = \\mu(-2, 1, 3) = (-2, 1, -3)$ here by luck, but in general $\\mu \\circ \\rho$ and $\\rho \\circ \\mu$ differ, so keep the order: right map first.",
        "复合对称先作用右边的映射，再作用左边的映射，所以把一个映射的结果代入另一个映射的公式。$\\rho \\circ \\mu$ 先作用 $\\mu$。设 $\\mu: (x, y, z) \\mapsto (x, y, -z)$，$\\rho: (x, y, z) \\mapsto (-y, x, z)$：$\\mu(1, 2, 3) = (1, 2, -3)$，$\\rho(1, 2, -3) = (-2, 1, -3)$。\n\n检验：$\\rho \\circ \\mu$ 就是映射 $(x, y, z) \\mapsto (-y, x, -z)$，它在 $(1, 2, 3)$ 处的值同样是 $(-2, 1, -3)$。\n\n> **注意。** 这里先作用 $\\rho$ 得 $\\mu(\\rho(1, 2, 3)) = \\mu(-2, 1, 3) = (-2, 1, -3)$，只是碰巧相同；一般而言 $\\mu \\circ \\rho$ 与 $\\rho \\circ \\mu$ 不同，所以要守住顺序：先作用右边的映射。",
      ),
      generate(rng) {
        let rho: Mat3;
        let mu: Mat3;
        do {
          rho = randomCubeSymmetry(rng);
          mu = randomCubeSymmetry(rng);
        } while (mul3(rho, mu).every((row, i) => row.every((x, j) => x === mul3(mu, rho)[i]![j])));
        const v = rng.sample([1, 2, 3, 4, 5], 3).map((x) => (rng.bool() ? x : -x));
        const mv = apply3(mu, v);
        const right = apply3(rho, mv);
        const reasons: Reason[] = [
          [
            `$${pointTex(apply3(mu, apply3(rho, v)))}$`,
            "That is $\\mu \\circ \\rho$: it applies $\\rho$ first, but $\\rho \\circ \\mu$ applies $\\mu$ first.",
            "那是 $\\mu \\circ \\rho$：它先作用 $\\rho$，而 $\\rho \\circ \\mu$ 先作用 $\\mu$。",
          ],
          [`$${pointTex(apply3(rho, v))}$`, "That applies only $\\rho$ and leaves out $\\mu$.", "那只作用了 $\\rho$，漏掉了 $\\mu$。"],
          [
            `$${pointTex(mv)}$`,
            "That applies only $\\mu$; $\\rho$ must then be applied to the result.",
            "那只作用了 $\\mu$；还要对结果再作用 $\\rho$。",
          ],
        ];
        return reasoned(
          texChoice(
            rng,
            t(
              `${CUBE_SETUP.en} Let $\\rho: ${cubeMapTex(rho)}$ and $\\mu: ${cubeMapTex(mu)}$. Find $(\\rho \\circ \\mu)${pointTex(v)}$.`,
              `${CUBE_SETUP["zh-CN"]}设 $\\rho: ${cubeMapTex(rho)}$，$\\mu: ${cubeMapTex(mu)}$。求 $(\\rho \\circ \\mu)${pointTex(v)}$。`,
            ),
            pointTex(right),
            [pointTex(apply3(mu, apply3(rho, v))), pointTex(apply3(rho, v)), pointTex(mv)],
            walked(
              [
                [["Apply μ first", "先作用 μ"], t(`$\\mu${pointTex(v)} = ${pointTex(mv)}$.`, `$\\mu${pointTex(v)} = ${pointTex(mv)}$。`)],
                [
                  ["Then apply ρ", "再作用 ρ"],
                  t(`$\\rho${pointTex(mv)} = ${pointTex(right)}$.`, `$\\rho${pointTex(mv)} = ${pointTex(right)}$。`),
                ],
              ],
              t(
                `The composite is the single map $\\rho \\circ \\mu: ${cubeMapTex(mul3(rho, mu))}$, which also sends $${pointTex(v)}$ to $${pointTex(right)}$.`,
                `复合映射就是 $\\rho \\circ \\mu: ${cubeMapTex(mul3(rho, mu))}$，它同样把 $${pointTex(v)}$ 送到 $${pointTex(right)}$。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "orders-of-composite-symmetries",
      figure: algebraDrawings1["the-symmetry-group-of-a-cube-combining-rotations-and-reflections#orders-of-composite-symmetries"],
      title: t("Orders of composites", "复合的阶"),
      explanation: t(
        "Find the composite map first, then its order. With $\\rho: (x, y, z) \\mapsto (-y, x, z)$ and $\\mu: (x, y, z) \\mapsto (x, y, -z)$, $\\rho \\circ \\mu: (x, y, z) \\mapsto (-y, x, -z)$, which has order $4$ and is not a rotation.\n\nCheck: $\\rho$ has determinant $1$ and $\\mu$ has determinant $-1$, so the composite has determinant $-1$, which is why it is not a rotation.\n\n> **Watch out.** The order of a composite is not found from the orders of the factors: here $\\rho$ has order $4$ and $\\mu$ order $2$, and $\\operatorname{lcm}(4, 2) = 4$ matches only by chance; work out the composite map itself.",
        "先求出复合映射，再求它的阶。设 $\\rho: (x, y, z) \\mapsto (-y, x, z)$，$\\mu: (x, y, z) \\mapsto (x, y, -z)$，则 $\\rho \\circ \\mu: (x, y, z) \\mapsto (-y, x, -z)$，阶为 $4$，且不是旋转。\n\n检验：$\\rho$ 的行列式为 $1$，$\\mu$ 的行列式为 $-1$，所以复合的行列式为 $-1$，这正是它不是旋转的原因。\n\n> **注意。** 复合的阶不能由各因子的阶求出：这里 $\\rho$ 的阶为 $4$，$\\mu$ 的阶为 $2$，$\\operatorname{lcm}(4, 2) = 4$ 只是碰巧相符；要算出复合映射本身。",
      ),
      generate(rng) {
        for (;;) {
          const rho = randomCubeSymmetry(rng);
          const mu = randomCubeSymmetry(rng);
          const c = mul3(rho, mu);
          if (isIdentity3(c)) continue;
          const value = order3(c);
          const mistakes = cubeOrderMistakes(c, value, [
            why(
              lcm(order3(rho), order3(mu)),
              `That is $\\operatorname{lcm}(${order3(rho)}, ${order3(mu)})$ of the orders of $\\rho$ and $\\mu$; the order of a composite must be found from the composite map.`,
              `那是 $\\rho$ 与 $\\mu$ 的阶的最小公倍数 $\\operatorname{lcm}(${order3(rho)}, ${order3(mu)})$；复合的阶要由复合映射本身求出。`,
            ),
            why(
              order3(mul3(mu, rho)),
              "That is the order of $\\mu \\circ \\rho$, which applies $\\rho$ first.",
              "那是 $\\mu \\circ \\rho$ 的阶，它先作用 $\\rho$。",
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `${CUBE_SETUP.en} Let $\\rho: ${cubeMapTex(rho)}$ and $\\mu: ${cubeMapTex(mu)}$. Find the order of $\\rho \\circ \\mu$.`,
              `${CUBE_SETUP["zh-CN"]}设 $\\rho: ${cubeMapTex(rho)}$，$\\mu: ${cubeMapTex(mu)}$。求 $\\rho \\circ \\mu$ 的阶。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Compose", "复合"],
                  t(
                    `Substituting $\\mu$ into $\\rho$ gives $\\rho \\circ \\mu: ${cubeMapTex(c)}$.`,
                    `把 $\\mu$ 代入 $\\rho$ 得 $\\rho \\circ \\mu: ${cubeMapTex(c)}$。`,
                  ),
                ],
                [
                  ["Apply it repeatedly", "反复作用"],
                  t(`Its powers are ${powersTex(c, value)}.`, `它的各次幂依次为 ${powersTex(c, value)}。`),
                ],
              ],
              t(
                `The first power equal to $(x, y, z)$ is the ${ordinal(value)}, so the order is $${value}$.`,
                `第一个等于 $(x, y, z)$ 的是第 $${value}$ 次幂，所以阶为 $${value}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** abstractAlgebraPermutationTopics are the topics of Abstract Algebra unit 3. */
export const abstractAlgebraPermutationTopics: readonly TopicDef[] = [
  cycles,
  convertingBetweenPermutationsAndCycles,
  theInverseOfACycle,
  theInverseOfAPermutation,
  theOrderOfACycle,
  theOrderOfAPermutation,
  transpositions,
  theSymmetricGroupOnNSymbols,
  theAlternatingGroupOnNSymbols,
  theSymmetryGroupOfAFigure,
  dihedralGroup,
  theSymmetryGroupOfATetrahedron,
  theSymmetryGroupOfACubeRotationsAndReflections,
  theSymmetryGroupOfACubeCombiningRotationsAndReflections,
];
