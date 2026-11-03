import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { article, numberProblem } from "../problems.ts";
import { factProblem, gcd, lcm, mod, phi, texChoice, textChoice } from "./abstract-algebra-common.ts";
import { range } from "./methods-of-proof-common.ts";

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
  prerequisites: ["permutations", "function-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "images-under-cycles",
      title: t("Applying a cycle", "作用一个轮换"),
      explanation: t(
        "A cycle sends each listed point to the next one, the last point back to the first, and leaves every other point fixed. In $S_6$, $\\sigma = (2\\;5\\;3\\;6)$ sends $2 \\mapsto 5$, $5 \\mapsto 3$, $3 \\mapsto 6$ and wraps around: $6 \\mapsto 2$. Points not in the cycle are fixed, so $\\sigma(1) = 1$.",
        "一个轮换把每个列出的点送到下一个点，把最后一个点送回第一个点，其余的点保持不动。在 $S_6$ 中，$\\sigma = (2\\;5\\;3\\;6)$ 把 $2 \\mapsto 5$、$5 \\mapsto 3$、$3 \\mapsto 6$，并绕回 $6 \\mapsto 2$。不在轮换中的点保持不动，所以 $\\sigma(1) = 1$。",
      ),
      generate(rng) {
        const n = rng.int(5, 9);
        const c = rng.sample(range(0, n - 1), rng.int(3, Math.min(n, 7)));
        const x = rng.bool(0.8) ? rng.pick(c) : rng.int(0, n - 1);
        const p = cyclePerm(n, c);
        const value = p[x]! + 1;
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find $\\sigma(${x + 1})$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma(${x + 1})$。`,
          ),
          answer: value,
          wrong: [invertPerm(p)[x]! + 1, x + 1, p[p[x]!]! + 1],
          solution: c.includes(x)
            ? t(
                `In the cycle, $${x + 1}$ is followed by $${value}$ (wrapping around at the end).`,
                `在轮换中，$${x + 1}$ 后面是 $${value}$（到末尾时绕回开头）。`,
              )
            : t(`$${x + 1}$ is not in the cycle, so it is fixed.`, `$${x + 1}$ 不在轮换中，所以保持不动。`),
        });
      },
    },
    {
      id: "products-of-cycles",
      title: t("Products of cycles", "轮换的乘积"),
      explanation: t(
        "A product of permutations is a composition of functions, so the factor on the right acts first, just as with ordinary functions. To evaluate $\\sigma\\tau$ at a point, apply $\\tau$ first and then $\\sigma$. With $\\sigma = (1\\;3\\;4)$ and $\\tau = (1\\;2)$: $\\tau(1) = 2$ and $\\sigma(2) = 2$, so $\\sigma\\tau(1) = 2$.",
        "置换的乘积是函数的复合，所以右边的因子先作用，与普通函数一样。求 $\\sigma\\tau$ 在某点的值时，先作用 $\\tau$，再作用 $\\sigma$。设 $\\sigma = (1\\;3\\;4)$、$\\tau = (1\\;2)$：$\\tau(1) = 2$，$\\sigma(2) = 2$，所以 $\\sigma\\tau(1) = 2$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const [a, b] = overlappingCycles(rng, n);
        const pa = cyclePerm(n, a);
        const pb = cyclePerm(n, b);
        const x = rng.pick([...a, ...b]);
        const mid = pb[x]!;
        const value = pa[mid]! + 1;
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(a)}$ and $\\tau = ${oneCycleTex(b)}$. ${COMPOSE_NOTE.en} Find $\\sigma\\tau(${x + 1})$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(a)}$，$\\tau = ${oneCycleTex(b)}$。${COMPOSE_NOTE["zh-CN"]}求 $\\sigma\\tau(${x + 1})$。`,
          ),
          answer: value,
          wrong: [pb[pa[x]!]! + 1, pa[x]! + 1, mid + 1],
          solution: t(
            `$\\tau(${x + 1}) = ${mid + 1}$ and $\\sigma(${mid + 1}) = ${value}$.`,
            `$\\tau(${x + 1}) = ${mid + 1}$，$\\sigma(${mid + 1}) = ${value}$。`,
          ),
        });
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
  prerequisites: ["cycles"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-permutations-as-cycles",
      title: t("Two-line notation to cycles", "两行记法化为轮换"),
      explanation: t(
        "Follow a point to its image, then to the image of that, until you return; this closes one cycle, and then start again with an unused point. For $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 3 & 5 & 4 & 1 & 2 \\end{pmatrix}$: $1 \\mapsto 3 \\mapsto 4 \\mapsto 1$ gives $(1\\;3\\;4)$, and $2 \\mapsto 5 \\mapsto 2$ gives $(2\\;5)$. So the permutation is $(1\\;3\\;4)(2\\;5)$.",
        "从一个点追踪到它的像，再追踪到像的像，直到回到起点；这样就完成一个轮换，然后从一个未用过的点重新开始。对 $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 3 & 5 & 4 & 1 & 2 \\end{pmatrix}$：$1 \\mapsto 3 \\mapsto 4 \\mapsto 1$ 得 $(1\\;3\\;4)$，$2 \\mapsto 5 \\mapsto 2$ 得 $(2\\;5)$。所以该置换为 $(1\\;3\\;4)(2\\;5)$。",
      ),
      generate(rng) {
        const p = randomPerm(rng, rng.int(5, 8));
        return texChoice(
          rng,
          t(`Write $${permTex(p)}$ as a product of disjoint cycles.`, `把 $${permTex(p)}$ 写成不相交轮换之积。`),
          permCycleTex(p),
          [permCycleTex(invertPerm(p)), mangled(p), permCycleTex(composePerm(p, p)), mangled(invertPerm(p))],
          t(`Follow each point until it returns: $${permCycleTex(p)}$.`, `沿着每个点走直到回到起点：$${permCycleTex(p)}$。`),
        );
      },
    },
    {
      id: "writing-cycles-as-permutations",
      title: t("Cycles to two-line notation", "轮换化为两行记法"),
      explanation: t(
        "Two line notation lists the image of every point, so find where each point goes under the product of cycles. To write $(1\\;4)(2\\;3\\;5)$ in two-line notation, record the image of each point: $1 \\mapsto 4$, $2 \\mapsto 3$, $3 \\mapsto 5$, $4 \\mapsto 1$, $5 \\mapsto 2$, giving $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 4 & 3 & 5 & 1 & 2 \\end{pmatrix}$.",
        "两行记法列出每个点的像，所以要求出每个点在这些轮换的乘积下去哪里。要把 $(1\\;4)(2\\;3\\;5)$ 写成两行记法，就记下每个点的像：$1 \\mapsto 4$、$2 \\mapsto 3$、$3 \\mapsto 5$、$4 \\mapsto 1$、$5 \\mapsto 2$，得 $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 \\\\ 4 & 3 & 5 & 1 & 2 \\end{pmatrix}$。",
      ),
      generate(rng) {
        const p = randomPerm(rng, rng.int(5, 7));
        const swapped = [...p];
        const [i, j] = rng.sample(range(0, p.length - 1), 2);
        [swapped[i!], swapped[j!]] = [swapped[j!]!, swapped[i!]!];
        return texChoice(
          rng,
          t(
            `Write $${permCycleTex(p)}$ in $S_{${p.length}}$ in two-line notation.`,
            `把 $S_{${p.length}}$ 中的 $${permCycleTex(p)}$ 写成两行记法。`,
          ),
          permTex(p),
          [permTex(invertPerm(p)), permTex(swapped), permTex(composePerm(p, p))],
          t(
            `Record the image of each point, with fixed points mapping to themselves: $${permTex(p)}$.`,
            `记下每个点的像，不动点映到自身：$${permTex(p)}$。`,
          ),
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
  prerequisites: ["cycles"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverting-cycles",
      title: t("Inverting a cycle", "求轮换的逆"),
      explanation: t(
        "Undoing a cycle means sending each point back to the one before it, which is the same cycle listed in reverse order. $(1\\;4\\;2\\;6)^{-1} = (6\\;2\\;4\\;1)$, which starting from the smallest point is $(1\\;6\\;2\\;4)$.",
        "撤销一个轮换就是把每个点送回它前面的点，这就是把同一个轮换倒序列出。$(1\\;4\\;2\\;6)^{-1} = (6\\;2\\;4\\;1)$，从最小点开始写为 $(1\\;6\\;2\\;4)$。",
      ),
      generate(rng) {
        const n = rng.int(6, 9);
        const c = rng.sample(range(0, n - 1), rng.int(4, Math.min(n, 7)));
        const p = cyclePerm(n, c);
        const others = range(1, 4).map(() => permCycleTex(cyclePerm(n, rng.shuffle(c))));
        return texChoice(
          rng,
          t(`In $S_{${n}}$, find $${oneCycleTex(c)}^{-1}$.`, `在 $S_{${n}}$ 中，求 $${oneCycleTex(c)}^{-1}$。`),
          permCycleTex(invertPerm(p)),
          [oneCycleTex(c), permCycleTex(composePerm(p, p)), ...others],
          t(
            `Reverse the order: $${oneCycleTex([...c].reverse())} = ${permCycleTex(invertPerm(p))}$.`,
            `倒序排列：$${oneCycleTex([...c].reverse())} = ${permCycleTex(invertPerm(p))}$。`,
          ),
        );
      },
    },
    {
      id: "images-under-inverse-cycles",
      title: t("Evaluating an inverse cycle", "求逆轮换的值"),
      explanation: t(
        "$\\sigma^{-1}(x)$ is the point that $\\sigma$ sends to $x$: the point just before $x$ in the cycle. For $\\sigma = (3\\;1\\;5\\;2)$, $\\sigma^{-1}(5) = 1$ and $\\sigma^{-1}(3) = 2$.",
        "$\\sigma^{-1}(x)$ 是被 $\\sigma$ 映到 $x$ 的点，即轮换中紧挨在 $x$ 前面的点。对 $\\sigma = (3\\;1\\;5\\;2)$，$\\sigma^{-1}(5) = 1$，$\\sigma^{-1}(3) = 2$。",
      ),
      generate(rng) {
        const n = rng.int(5, 9);
        const c = rng.sample(range(0, n - 1), rng.int(3, Math.min(n, 7)));
        const x = rng.pick(c);
        const p = cyclePerm(n, c);
        const value = invertPerm(p)[x]! + 1;
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find $\\sigma^{-1}(${x + 1})$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma^{-1}(${x + 1})$。`,
          ),
          answer: value,
          wrong: [p[x]! + 1, x + 1],
          solution: t(
            `$\\sigma$ sends $${value}$ to $${x + 1}$, so $\\sigma^{-1}(${x + 1}) = ${value}$.`,
            `$\\sigma$ 把 $${value}$ 映到 $${x + 1}$，所以 $\\sigma^{-1}(${x + 1}) = ${value}$。`,
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
  prerequisites: ["converting-between-permutations-and-cycles", "the-inverse-of-a-cycle"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverses-in-two-line-notation",
      title: t("Inverses in two-line notation", "两行记法下的逆"),
      explanation: t(
        "To find $\\sigma^{-1}(x)$, find $x$ in the bottom row; the entry above it is the answer. For $\\sigma = \\begin{pmatrix} 1 & 2 & 3 & 4 \\\\ 3 & 1 & 4 & 2 \\end{pmatrix}$, $\\sigma^{-1}(4) = 3$.",
        "求 $\\sigma^{-1}(x)$ 时，在下行中找到 $x$，它上方的数就是答案。对 $\\sigma = \\begin{pmatrix} 1 & 2 & 3 & 4 \\\\ 3 & 1 & 4 & 2 \\end{pmatrix}$，$\\sigma^{-1}(4) = 3$。",
      ),
      generate(rng) {
        const p = randomPerm(rng, rng.int(5, 8));
        let x: number;
        do x = rng.int(0, p.length - 1);
        while (p[x] === x);
        const value = invertPerm(p)[x]! + 1;
        return numberProblem({
          prompt: t(
            `Let $\\sigma = ${permTex(p)}$. Find $\\sigma^{-1}(${x + 1})$.`,
            `设 $\\sigma = ${permTex(p)}$。求 $\\sigma^{-1}(${x + 1})$。`,
          ),
          answer: value,
          wrong: [p[x]! + 1, p[p[x]!]! + 1, x + 1],
          solution: t(
            `$${x + 1}$ appears in the bottom row under $${value}$, so $\\sigma(${value}) = ${x + 1}$.`,
            `$${x + 1}$ 出现在下行中 $${value}$ 的下方，所以 $\\sigma(${value}) = ${x + 1}$。`,
          ),
        });
      },
    },
    {
      id: "inverses-of-products-of-cycles",
      title: t("Inverses of products", "乘积的逆"),
      explanation: t(
        "The inverse of a product reverses the order of the factors and inverts each, so the last factor applied is undone first. $(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$: to evaluate it at $x$, apply $\\sigma^{-1}$ first, then $\\tau^{-1}$. With $\\sigma = (1\\;2\\;3)$ and $\\tau = (1\\;4)$: $\\sigma^{-1}(1) = 3$ and $\\tau^{-1}(3) = 3$, so $(\\sigma\\tau)^{-1}(1) = 3$.",
        "乘积的逆把因子的顺序反过来并把每个因子取逆，所以最后作用的因子最先被撤销。$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$：求它在 $x$ 处的值时，先作用 $\\sigma^{-1}$，再作用 $\\tau^{-1}$。设 $\\sigma = (1\\;2\\;3)$、$\\tau = (1\\;4)$：$\\sigma^{-1}(1) = 3$，$\\tau^{-1}(3) = 3$，所以 $(\\sigma\\tau)^{-1}(1) = 3$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const [a, b] = overlappingCycles(rng, n);
        const ia = invertPerm(cyclePerm(n, a));
        const ib = invertPerm(cyclePerm(n, b));
        const x = rng.pick([...a, ...b]);
        const value = ib[ia[x]!]! + 1;
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(a)}$ and $\\tau = ${oneCycleTex(b)}$. ${COMPOSE_NOTE.en} Find $(\\sigma\\tau)^{-1}(${x + 1})$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(a)}$，$\\tau = ${oneCycleTex(b)}$。${COMPOSE_NOTE["zh-CN"]}求 $(\\sigma\\tau)^{-1}(${x + 1})$。`,
          ),
          answer: value,
          wrong: [ia[ib[x]!]! + 1, cyclePerm(n, a)[cyclePerm(n, b)[x]!]! + 1, x + 1],
          solution: t(
            `$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$. $\\sigma^{-1}(${x + 1}) = ${ia[x]! + 1}$ and $\\tau^{-1}(${ia[x]! + 1}) = ${value}$.`,
            `$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$。$\\sigma^{-1}(${x + 1}) = ${ia[x]! + 1}$，$\\tau^{-1}(${ia[x]! + 1}) = ${value}$。`,
          ),
        });
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
  prerequisites: ["cycles", "orders-of-group-elements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "powers-of-cycles",
      title: t("Powers of a cycle", "轮换的幂"),
      explanation: t(
        "Each application of a cycle moves a point one place along it, so a power moves it that many places, wrapping around the cycle. $\\sigma^m$ moves each point of the cycle $m$ places forward, wrapping around. For $\\sigma = (1\\;5\\;2\\;7\\;4)$, $\\sigma^3(5) = 4$ since $5 \\to 2 \\to 7 \\to 4$.",
        "每作用一次轮换，点就沿着它移动一个位置，所以幂会使点移动那么多个位置，并在轮换上绕回。$\\sigma^m$ 把轮换中的每个点向前移动 $m$ 位，到末尾绕回。对 $\\sigma = (1\\;5\\;2\\;7\\;4)$，$\\sigma^3(5) = 4$，因为 $5 \\to 2 \\to 7 \\to 4$。",
      ),
      generate(rng) {
        const n = rng.int(6, 9);
        const k = rng.int(4, Math.min(n, 7));
        const c = rng.sample(range(0, n - 1), k);
        const m = rng.int(2, 2 * k + 2);
        const i = rng.int(0, k - 1);
        const value = c[(i + m) % k]! + 1;
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find $\\sigma^{${m}}(${c[i]! + 1})$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma^{${m}}(${c[i]! + 1})$。`,
          ),
          answer: value,
          wrong: [c[mod(i - m, k)]! + 1, c[(i + m - 1) % k]! + 1, c[(i + 1) % k]! + 1],
          solution: t(
            `$\\sigma$ has order $${k}$, so $\\sigma^{${m}}$ moves each point $${m} \\bmod ${k} = ${m % k}$ places forward: $\\sigma^{${m}}(${c[i]! + 1}) = ${value}$.`,
            `$\\sigma$ 的阶为 $${k}$，所以 $\\sigma^{${m}}$ 把每个点向前移动 $${m} \\bmod ${k} = ${m % k}$ 位：$\\sigma^{${m}}(${c[i]! + 1}) = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "orders-of-powers-of-cycles",
      title: t("Orders of powers of a cycle", "轮换幂的阶"),
      explanation: t(
        "If $\\sigma$ is a $k$-cycle, then $\\sigma^m$ has order $\\frac{k}{\\gcd(k, m)}$. For a $6$-cycle $\\sigma$, $\\sigma^4$ has order $\\frac{6}{2} = 3$: it splits into two $3$-cycles.",
        "若 $\\sigma$ 是 $k$-轮换，则 $\\sigma^m$ 的阶为 $\\frac{k}{\\gcd(k, m)}$。对 $6$-轮换 $\\sigma$，$\\sigma^4$ 的阶为 $\\frac{6}{2} = 3$：它分裂为两个 $3$-轮换。",
      ),
      generate(rng) {
        const n = rng.int(7, 10);
        const k = rng.int(4, n);
        let m: number;
        do m = rng.int(2, 2 * k);
        while (m % k === 0);
        const c = rng.sample(range(0, n - 1), k);
        const value = k / gcd(k, m);
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(c)}$. Find the order of $\\sigma^{${m}}$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(c)}$。求 $\\sigma^{${m}}$ 的阶。`,
          ),
          answer: value,
          wrong: [k, gcd(k, m), m % k],
          solution: t(
            `$\\sigma$ is ${article(k)} $${k}$-cycle, so $\\sigma^{${m}}$ has order $\\frac{${k}}{\\gcd(${k}, ${m})} = ${value}$.`,
            `$\\sigma$ 是 $${k}$-轮换，所以 $\\sigma^{${m}}$ 的阶为 $\\frac{${k}}{\\gcd(${k}, ${m})} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** theOrderOfAPermutation finds orders of permutations. */
export const theOrderOfAPermutation: TopicDef = {
  id: "the-order-of-a-permutation",
  title: t("The Order of a Permutation", "置换的阶"),
  summary: t(
    "The order of a permutation is the least common multiple of the lengths of its disjoint cycles. To find the order of a permutation given in two-line notation, first decompose it into disjoint cycles.",
    "置换的阶是它的各个不相交轮换长度的最小公倍数。求两行记法下置换的阶时，先把它分解为不相交轮换。",
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
        "$(1\\;2\\;3\\;4)(5\\;6\\;7\\;8\\;9\\;10)$ has order $\\operatorname{lcm}(4, 6) = 12$: both cycles return to the start together only after a common multiple of $4$ and $6$ steps.",
        "$(1\\;2\\;3\\;4)(5\\;6\\;7\\;8\\;9\\;10)$ 的阶为 $\\operatorname{lcm}(4, 6) = 12$：两个轮换要在 $4$ 与 $6$ 的公倍数步后才同时回到起点。",
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
          wrong: [lengths.reduce((a, b) => a * b, 1), lengths.reduce((a, b) => a + b, 0), Math.max(...lengths)],
          solution: t(
            `The cycle lengths are $${lengths.join(", ")}$, so the order is $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$.`,
            `轮换长度为 $${lengths.join(", ")}$，所以阶为 $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "orders-of-permutations-in-two-line-notation",
      title: t("Permutations in two-line notation", "两行记法下的置换"),
      explanation: t(
        "Write the permutation as disjoint cycles first; its order is the least common multiple of the cycle lengths. $\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 2 & 3 & 1 & 5 & 4 & 6 \\end{pmatrix} = (1\\;2\\;3)(4\\;5)$, so its order is $\\operatorname{lcm}(3, 2) = 6$.",
        "先把置换写成不相交轮换的乘积；它的阶是各轮换长度的最小公倍数。$\\begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\\\ 2 & 3 & 1 & 5 & 4 & 6 \\end{pmatrix} = (1\\;2\\;3)(4\\;5)$，所以它的阶为 $\\operatorname{lcm}(3, 2) = 6$。",
      ),
      generate(rng) {
        const p = randomPerm(rng, rng.int(6, 9));
        const lengths = cyclesOf(p).map((c) => c.length);
        const value = permOrder(p);
        return numberProblem({
          prompt: t(`Find the order of $${permTex(p)}$.`, `求 $${permTex(p)}$ 的阶。`),
          answer: value,
          wrong: [lengths.reduce((a, b) => a * b, 1), lengths.reduce((a, b) => a + b, 0), Math.max(...lengths), p.length],
          solution: t(
            `It is $${permCycleTex(p)}$, so its order is $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$.`,
            `它等于 $${permCycleTex(p)}$，所以阶为 $\\operatorname{lcm}(${lengths.join(", ")}) = ${value}$。`,
          ),
        });
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
  prerequisites: ["converting-between-permutations-and-cycles"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-transpositions",
      title: t("Fewest transpositions", "最少对换个数"),
      explanation: t(
        "Each transposition can merge or split cycles by only one, so the fewest needed is the number of points minus the number of cycles. A $k$-cycle is a product of $k - 1$ transpositions, and no fewer. So $(1\\;2\\;3\\;4)(5\\;6\\;7)$ needs $3 + 2 = 5$ transpositions.",
        "每个对换只能使轮换数增加或减少一个，所以所需的最少对换数等于点数减去轮换数。$k$-轮换是 $k - 1$ 个对换之积，且不能更少。所以 $(1\\;2\\;3\\;4)(5\\;6\\;7)$ 需要 $3 + 2 = 5$ 个对换。",
      ),
      generate(rng) {
        const p = randomPerm(rng, rng.int(6, 10));
        const cs = cyclesOf(p);
        const value = transpositionCount(p);
        const asCycles = rng.bool();
        return numberProblem({
          prompt: t(
            `What is the least number of transpositions whose product is $${asCycles ? permCycleTex(p) : permTex(p)}$?`,
            `$${asCycles ? permCycleTex(p) : permTex(p)}$ 最少能写成多少个对换之积？`,
          ),
          answer: value,
          wrong: [cs.length, cs.reduce((s, c) => s + c.length, 0), value - 1],
          solution: t(
            `${asCycles ? "" : `It is $${permCycleTex(p)}$. `}Each $k$-cycle needs $k - 1$ transpositions: $${cs.map((c) => c.length - 1).join(" + ")} = ${value}$.`,
            `${asCycles ? "" : `它等于 $${permCycleTex(p)}$。`}每个 $k$-轮换需要 $k - 1$ 个对换：$${cs.map((c) => c.length - 1).join(" + ")} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "even-and-odd-permutations",
      title: t("Even and odd permutations", "偶置换与奇置换"),
      explanation: t(
        "A $k$-cycle is even when $k$ is odd, and odd when $k$ is even. The parity of a product is found by adding: $(1\\;2\\;3\\;4)(2\\;5)$ is a product of $3 + 1 = 4$ transpositions, so it is even, even though the cycles overlap.",
        "$k$ 为奇数时 $k$-轮换是偶置换，$k$ 为偶数时是奇置换。乘积的奇偶性通过相加求得：$(1\\;2\\;3\\;4)(2\\;5)$ 是 $3 + 1 = 4$ 个对换之积，所以是偶置换，即使两个轮换有重叠。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const cs = range(1, rng.int(2, 3)).map(() => rng.sample(range(0, n - 1), rng.int(2, 5)));
        const count = cs.reduce((s, c) => s + c.length - 1, 0);
        const even = count % 2 === 0;
        return textChoice(
          rng,
          t(`Is $${cyclesTex(cs)}$ in $S_{${n}}$ even or odd?`, `$S_{${n}}$ 中的 $${cyclesTex(cs)}$ 是偶置换还是奇置换？`),
          even ? EVEN_ODD : [EVEN_ODD[1]!, EVEN_ODD[0]!],
          t(
            `It is a product of $${cs.map((c) => c.length - 1).join(" + ")} = ${count}$ transpositions, so it is ${even ? "even" : "odd"}.`,
            `它是 $${cs.map((c) => c.length - 1).join(" + ")} = ${count}$ 个对换之积，所以是${even ? "偶" : "奇"}置换。`,
          ),
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
  prerequisites: ["transpositions", "the-inverse-of-a-permutation", "the-order-of-a-permutation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-cycles-in-symmetric-groups",
      title: t("Counting cycles", "数轮换"),
      explanation: t(
        "To count $3$-cycles in $S_5$: choose an ordered list of $3$ points in $5 \\cdot 4 \\cdot 3 = 60$ ways; each cycle is written $3$ ways (start anywhere), giving $20$.",
        "数 $S_5$ 中的 $3$-轮换：有序地选出 $3$ 个点有 $5 \\cdot 4 \\cdot 3 = 60$ 种方式；每个轮换有 $3$ 种写法（从任一点开始），所以共 $20$ 个。",
      ),
      generate(rng) {
        const n = rng.int(4, 9);
        const k = rng.int(2, n);
        const ordered = factorial(n) / factorial(n - k);
        const value = ordered / k;
        return numberProblem({
          prompt: t(`How many $${k}$-cycles are there in $S_{${n}}$?`, `$S_{${n}}$ 中有多少个 $${k}$-轮换？`),
          answer: value,
          wrong: [ordered, ordered / factorial(k), factorial(n)],
          solution: t(
            `There are $\\frac{${n}!}{${n - k}!} = ${ordered}$ ordered lists of $${k}$ points, and each cycle arises from $${k}$ of them: $\\frac{${ordered}}{${k}} = ${value}$.`,
            `有序选出 $${k}$ 个点有 $\\frac{${n}!}{${n - k}!} = ${ordered}$ 种方式，每个轮换对应其中 $${k}$ 种：$\\frac{${ordered}}{${k}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "products-in-symmetric-groups",
      title: t("Multiplying in Sₙ", "Sₙ 中的乘法"),
      explanation: t(
        "Follow each point through the right factor and then the left factor, recording the cycles as they close. To write $\\sigma\\tau$ in disjoint cycles, follow each point through $\\tau$ then $\\sigma$. With $\\sigma = (1\\;2\\;3)$ and $\\tau = (2\\;4)$: $1 \\mapsto 1 \\mapsto 2$, $2 \\mapsto 4 \\mapsto 4$, $4 \\mapsto 2 \\mapsto 3$, $3 \\mapsto 3 \\mapsto 1$, so $\\sigma\\tau = (1\\;2\\;4\\;3)$.",
        "让每个点先经过右边的因子再经过左边的因子，在轮换闭合时把它们记录下来。要把 $\\sigma\\tau$ 写成不相交轮换，就让每个点依次经过 $\\tau$ 和 $\\sigma$。设 $\\sigma = (1\\;2\\;3)$、$\\tau = (2\\;4)$：$1 \\mapsto 1 \\mapsto 2$，$2 \\mapsto 4 \\mapsto 4$，$4 \\mapsto 2 \\mapsto 3$，$3 \\mapsto 3 \\mapsto 1$，所以 $\\sigma\\tau = (1\\;2\\;4\\;3)$。",
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
        return texChoice(
          rng,
          t(
            `In $S_{${n}}$, let $\\sigma = ${oneCycleTex(a)}$ and $\\tau = ${oneCycleTex(b)}$. ${COMPOSE_NOTE.en} Find $\\sigma\\tau$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${oneCycleTex(a)}$，$\\tau = ${oneCycleTex(b)}$。${COMPOSE_NOTE["zh-CN"]}求 $\\sigma\\tau$。`,
          ),
          permCycleTex(st),
          [permCycleTex(ts), mangled(st), permCycleTex(invertPerm(st))],
          t(
            `Follow each point through $\\tau$ and then $\\sigma$: $\\sigma\\tau = ${permCycleTex(st)}$.`,
            `让每个点依次经过 $\\tau$ 和 $\\sigma$：$\\sigma\\tau = ${permCycleTex(st)}$。`,
          ),
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
  prerequisites: ["the-symmetric-group-on-n-symbols", "properties-of-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-elements-of-alternating-groups",
      title: t("Counting in Aₙ", "Aₙ 中的计数"),
      explanation: t(
        "$|A_5| = \\frac{5!}{2} = 60$. Every $3$-cycle is even, so all $\\frac{5 \\cdot 4 \\cdot 3}{3} = 20$ three-cycles of $S_5$ lie in $A_5$, while no $4$-cycle does.",
        "$|A_5| = \\frac{5!}{2} = 60$。每个 $3$-轮换都是偶置换，所以 $S_5$ 的全部 $\\frac{5 \\cdot 4 \\cdot 3}{3} = 20$ 个 $3$-轮换都在 $A_5$ 中，而 $4$-轮换都不在。",
      ),
      generate(rng) {
        const n = rng.int(3, 9);
        if (rng.bool(0.3)) {
          const value = factorial(n) / 2;
          return numberProblem({
            prompt: t(`How many elements does $A_{${n}}$ have?`, `$A_{${n}}$ 有多少个元素？`),
            answer: value,
            wrong: [factorial(n), factorial(n - 1), Math.floor(value / 2)],
            solution: t(
              `Exactly half of the $${n}! = ${factorial(n)}$ permutations are even: $${value}$.`,
              `$${n}! = ${factorial(n)}$ 个置换中恰有一半是偶置换：$${value}$。`,
            ),
          });
        }
        const k = rng.int(2, n);
        const count = factorial(n) / factorial(n - k) / k;
        const value = k % 2 === 1 ? count : 0;
        return numberProblem({
          prompt: t(`How many $${k}$-cycles lie in $A_{${n}}$?`, `$A_{${n}}$ 中有多少个 $${k}$-轮换？`),
          answer: value,
          wrong: [k % 2 === 1 ? Math.floor(count / 2) : count, k % 2 === 1 ? 0 : Math.floor(count / 2), factorial(n) / 2],
          solution:
            k % 2 === 1
              ? t(
                  `${article(k, true)} $${k}$-cycle is a product of $${k - 1}$ transpositions, so it is even. All $${count}$ of the $${k}$-cycles in $S_{${n}}$ lie in $A_{${n}}$.`,
                  `$${k}$-轮换是 $${k - 1}$ 个对换之积，是偶置换。$S_{${n}}$ 中全部 $${count}$ 个 $${k}$-轮换都在 $A_{${n}}$ 中。`,
                )
              : t(
                  `${article(k, true)} $${k}$-cycle is a product of $${k - 1}$ transpositions, so it is odd, and none lie in $A_{${n}}$.`,
                  `$${k}$-轮换是 $${k - 1}$ 个对换之积，是奇置换，所以都不在 $A_{${n}}$ 中。`,
                ),
        });
      },
    },
    {
      id: "membership-in-alternating-groups",
      title: t("Membership in Aₙ", "是否属于 Aₙ"),
      explanation: t(
        "A permutation is even when it is a product of an even number of transpositions, and the alternating group consists of the even permutations. Count transpositions: a $k$-cycle contributes $k - 1$. $(1\\;3)(2\\;4\\;5\\;6)$ contributes $1 + 3 = 4$, so it is even and lies in $A_6$.",
        "当一个置换是偶数个对换的乘积时，它是偶置换，交错群由所有偶置换组成。数对换：$k$-轮换贡献 $k - 1$ 个。$(1\\;3)(2\\;4\\;5\\;6)$ 贡献 $1 + 3 = 4$ 个，所以是偶置换，属于 $A_6$。",
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

/** Figure is a plane figure with the sizes of its symmetry and rotation groups. */
interface Figure {
  readonly name: Text;
  readonly symmetries: number;
  readonly rotations: number;
}

/** FIGURES are plane figures whose symmetry groups are not regular polygons. */
const FIGURES: readonly Figure[] = [
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

/** theSymmetryGroupOfAFigure counts symmetries of plane figures and computes their action on vertices. */
export const theSymmetryGroupOfAFigure: TopicDef = {
  id: "the-symmetry-group-of-a-figure",
  title: t("The Symmetry Group of a Figure", "图形的对称群"),
  summary: t(
    "An isometry of the plane preserves distances. The symmetries of a figure are the isometries that map it onto itself; they form a group under composition. A regular n-gon has 2n symmetries: n rotations and n reflections. Each symmetry permutes the vertices.",
    "平面的等距变换保持距离。图形的对称是把它映到自身的等距变换；它们在复合下构成群。正 n 边形有 2n 个对称：n 个旋转和 n 个反射。每个对称都置换顶点。",
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
        "A rectangle that is not a square has $4$ symmetries: the identity, the rotation by $180^\\circ$, and the reflections in its two lines of symmetry. A regular hexagon has $6$ rotations and $6$ reflections.",
        "不是正方形的长方形有 $4$ 个对称：恒等变换、旋转 $180^\\circ$，以及关于两条对称轴的反射。正六边形有 $6$ 个旋转和 $6$ 个反射。",
      ),
      generate(rng) {
        const rotationsOnly = rng.bool();
        let name: Text;
        let value: number;
        if (rng.bool(0.6)) {
          const n = rng.int(3, 20);
          name = t(`a regular ${n}-gon`, `正 ${n} 边形`);
          value = rotationsOnly ? n : 2 * n;
        } else {
          const f = rng.pick(FIGURES);
          name = f.name;
          value = rotationsOnly ? f.rotations : f.symmetries;
        }
        return numberProblem({
          prompt: rotationsOnly
            ? t(
                `How many rotational symmetries (including the identity) does ${name.en} have?`,
                `${name["zh-CN"]}有多少个旋转对称（包括恒等变换）？`,
              )
            : t(`How many symmetries (rotations and reflections) does ${name.en} have?`, `${name["zh-CN"]}有多少个对称（旋转与反射）？`),
          answer: value,
          wrong: rotationsOnly
            ? [2 * value, value + 1, Math.max(1, value - 1)]
            : [value / 2 >= 1 ? Math.floor(value / 2) : 2, value + 1, 2 * value],
          solution: t(
            `Listing the isometries that map the figure onto itself gives $${value}$.`,
            `列出把图形映到自身的等距变换，共 $${value}$ 个。`,
          ),
        });
      },
    },
    {
      id: "symmetries-as-permutations-of-vertices",
      title: t("Symmetries as permutations", "对称作为置换"),
      explanation: t(
        "Label the vertices of a regular $n$-gon $1, \\dots, n$ counterclockwise. The rotation by $\\frac{360k}{n}$ degrees counterclockwise sends vertex $i$ to vertex $i + k$ (mod $n$). The reflection in the line through vertex $1$ sends vertex $i$ to vertex $2 - i$ (mod $n$).",
        "把正 $n$ 边形的顶点逆时针标为 $1, \\dots, n$。逆时针旋转 $\\frac{360k}{n}$ 度把顶点 $i$ 映到顶点 $i + k$（模 $n$）。关于过顶点 $1$ 的直线的反射把顶点 $i$ 映到顶点 $2 - i$（模 $n$）。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const i = rng.int(2, n);
        const label = (x: number) => mod(x - 1, n) + 1;
        if (rng.bool()) {
          const k = rng.int(1, n - 1);
          const deg = (360 * k) / n;
          const value = label(i + k);
          return numberProblem({
            prompt: t(
              `The vertices of a regular ${n}-gon are labeled $1, \\dots, ${n}$ counterclockwise. The rotation by $${Number.isInteger(deg) ? deg : `\\frac{${360 * k}}{${n}}`}^\\circ$ counterclockwise sends vertex $${i}$ to which vertex?`,
              `正 ${n} 边形的顶点逆时针标为 $1, \\dots, ${n}$。逆时针旋转 $${Number.isInteger(deg) ? deg : `\\frac{${360 * k}}{${n}}`}^\\circ$ 把顶点 $${i}$ 映到哪个顶点？`,
            ),
            answer: value,
            wrong: [label(i - k), label(i + k + 1), label(k)],
            solution: t(
              `The rotation moves each vertex $${k}$ places counterclockwise: $${i} \\mapsto ${value}$.`,
              `该旋转把每个顶点逆时针移动 $${k}$ 位：$${i} \\mapsto ${value}$。`,
            ),
          });
        }
        let v: number;
        do v = rng.int(1, n);
        while (v === i);
        const value = label(2 * v - i);
        return numberProblem({
          prompt: t(
            `The vertices of a regular ${n}-gon are labeled $1, \\dots, ${n}$ counterclockwise. The reflection in the line through the center and vertex $${v}$ sends vertex $${i}$ to which vertex?`,
            `正 ${n} 边形的顶点逆时针标为 $1, \\dots, ${n}$。关于过中心与顶点 $${v}$ 的直线的反射把顶点 $${i}$ 映到哪个顶点？`,
          ),
          answer: value,
          wrong: [label(i + 2 * v), label(n + 1 - i), label(2 * v - i + 1)],
          solution: t(
            `Vertex $${i}$ is $${mod(i - v, n)}$ places counterclockwise from vertex $${v}$, so its mirror image is $${mod(i - v, n)}$ places clockwise from it: vertex $${value}$.`,
            `顶点 $${i}$ 在顶点 $${v}$ 逆时针方向 $${mod(i - v, n)}$ 位处，所以它的镜像在顶点 $${v}$ 顺时针方向 $${mod(i - v, n)}$ 位处：顶点 $${value}$。`,
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
  prerequisites: ["the-symmetry-group-of-a-figure", "presentations-of-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-elements-of-dihedral-groups",
      title: t("Orders in Dₙ", "Dₙ 中元素的阶"),
      explanation: t(
        "In $D_n$ the rotation $r^k$ has order $\\frac{n}{\\gcd(k, n)}$, and every reflection $r^ks$ has order $2$. In $D_{12}$, $r^8$ has order $\\frac{12}{4} = 3$ and $r^5s$ has order $2$.",
        "在 $D_n$ 中，旋转 $r^k$ 的阶为 $\\frac{n}{\\gcd(k, n)}$，每个反射 $r^ks$ 的阶为 $2$。在 $D_{12}$ 中，$r^8$ 的阶为 $\\frac{12}{4} = 3$，$r^5s$ 的阶为 $2$。",
      ),
      generate(rng) {
        const n = rng.int(4, 20);
        const k = rng.int(1, n - 1);
        const reflection = rng.bool(0.3);
        const value = reflection ? 2 : n / gcd(k, n);
        return numberProblem({
          prompt: t(
            `In the dihedral group $D_{${n}}$ of order $${2 * n}$, with $r$ the rotation by $\\frac{360^\\circ}{${n}}$ and $s$ a reflection, find the order of $${reflection ? `r^{${k}}s` : `r^{${k}}`}$.`,
            `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$r$ 为旋转 $\\frac{360^\\circ}{${n}}$，$s$ 为一个反射。求 $${reflection ? `r^{${k}}s` : `r^{${k}}`}$ 的阶。`,
          ),
          answer: value,
          wrong: reflection ? [n / gcd(k, n), 2 * n, n] : [n, gcd(k, n), 2 * value],
          solution: reflection
            ? t(`$r^{${k}}s$ is a reflection, so its order is $2$.`, `$r^{${k}}s$ 是反射，所以阶为 $2$。`)
            : t(
                `$r^{${k}}$ has order $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$.`,
                `$r^{${k}}$ 的阶为 $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$。`,
              ),
        });
      },
    },
    {
      id: "counting-elements-of-dihedral-groups",
      title: t("Counting elements of Dₙ", "Dₙ 中的计数"),
      explanation: t(
        "$D_n$ has $n$ reflections, each of order $2$. When $n$ is even, the half turn $r^{n/2}$ also has order $2$, so $D_n$ has $n + 1$ elements of order $2$; when $n$ is odd it has $n$.",
        "$D_n$ 有 $n$ 个反射，每个的阶都是 $2$。$n$ 为偶数时，半周旋转 $r^{n/2}$ 的阶也是 $2$，所以 $D_n$ 有 $n + 1$ 个 $2$ 阶元素；$n$ 为奇数时有 $n$ 个。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const kind = rng.int(0, 1);
        if (kind === 0) {
          const value = n % 2 === 0 ? n + 1 : n;
          return numberProblem({
            prompt: t(
              `How many elements of order $2$ does the dihedral group $D_{${n}}$ of order $${2 * n}$ have?`,
              `$${2 * n}$ 阶二面体群 $D_{${n}}$ 有多少个 $2$ 阶元素？`,
            ),
            answer: value,
            wrong: [n % 2 === 0 ? n : n + 1, 1, 2 * n - 1],
            solution: t(
              n % 2 === 0
                ? `The $${n}$ reflections and the half turn $r^{${n / 2}}$: $${value}$.`
                : `The $${n}$ reflections; no rotation has order $2$ since $${n}$ is odd.`,
              n % 2 === 0
                ? `$${n}$ 个反射与半周旋转 $r^{${n / 2}}$：共 $${value}$ 个。`
                : `$${n}$ 个反射；由于 $${n}$ 是奇数，没有 $2$ 阶旋转。`,
            ),
          });
        }
        const d = rng.pick([3, 4, 5, 6]);
        const m = n * d <= 60 ? n * d : d * rng.int(1, 6);
        const value = phi(d);
        return numberProblem({
          prompt: t(
            `How many elements of order $${d}$ does the dihedral group $D_{${m}}$ of order $${2 * m}$ have?`,
            `$${2 * m}$ 阶二面体群 $D_{${m}}$ 有多少个 $${d}$ 阶元素？`,
          ),
          answer: value,
          wrong: [d, value + 1, m / d],
          solution: t(
            `Reflections have order $2$, so only rotations $r^k$ can have order $${d}$; they are the $\\varphi(${d}) = ${value}$ generators of the subgroup of order $${d}$ of $\\langle r \\rangle$.`,
            `反射的阶为 $2$，所以只有旋转 $r^k$ 可能是 $${d}$ 阶；它们是 $\\langle r \\rangle$ 的 $${d}$ 阶子群的 $\\varphi(${d}) = ${value}$ 个生成元。`,
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
  prerequisites: ["dihedral-group", "the-alternating-group-on-n-symbols"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rotations-of-a-tetrahedron",
      title: t("Rotations as permutations", "旋转作为置换"),
      explanation: t(
        "A rotation fixing vertex $1$ is a $3$-cycle of the other vertices: if it sends $2 \\mapsto 3$, it is $(2\\;3\\;4)$ and sends $4 \\mapsto 2$. A rotation swapping two vertices is a half turn, which also swaps the other two: $(1\\;2)(3\\;4)$.",
        "固定顶点 $1$ 的旋转是其余顶点的 $3$-轮换：若它把 $2 \\mapsto 3$，它就是 $(2\\;3\\;4)$，把 $4 \\mapsto 2$。交换两个顶点的旋转是半周旋转，它同时交换另外两个顶点：$(1\\;2)(3\\;4)$。",
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
            wrong: [c, d, a],
            solution: t(
              `The rotation is the $3$-cycle $(${b}\\;${c}\\;${d})$ of the other vertices, so $${d} \\mapsto ${b}$.`,
              `该旋转是其余顶点的 $3$-轮换 $(${b}\\;${c}\\;${d})$，所以 $${d} \\mapsto ${b}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `The vertices of a regular tetrahedron are labeled $1, 2, 3, 4$. A rotation of the tetrahedron sends vertex $${a}$ to vertex $${b}$ and vertex $${b}$ to vertex $${a}$. Where does it send vertex $${c}$?`,
            `正四面体的顶点标为 $1, 2, 3, 4$。它的一个旋转把顶点 $${a}$ 映到顶点 $${b}$，把顶点 $${b}$ 映到顶点 $${a}$。它把顶点 $${c}$ 映到哪里？`,
          ),
          answer: d,
          wrong: [c, a, b],
          solution: t(
            `A rotation is an even permutation, so it cannot be the transposition $(${a}\\;${b})$; it must be the half turn $(${a}\\;${b})(${c}\\;${d})$, sending $${c} \\mapsto ${d}$.`,
            `旋转是偶置换，不能是对换 $(${a}\\;${b})$；它必然是半周旋转 $(${a}\\;${b})(${c}\\;${d})$，把 $${c} \\mapsto ${d}$。`,
          ),
        });
      },
    },
    {
      id: "rotations-and-reflections-of-a-tetrahedron",
      title: t("Rotation or not", "是否为旋转"),
      explanation: t(
        "A symmetry of the tetrahedron is a rotation exactly when it permutes the vertices evenly. The reflection in the plane through an edge and the midpoint of the opposite edge is a transposition, such as $(1\\;2)$, so it is not a rotation.",
        "正四面体的对称是旋转当且仅当它对顶点的置换是偶置换。关于过一条棱与对棱中点的平面的反射是一个对换，例如 $(1\\;2)$，所以它不是旋转。",
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

/** theSymmetryGroupOfACubeRotationsAndReflections classifies symmetries of the cube and finds their orders. */
export const theSymmetryGroupOfACubeRotationsAndReflections: TopicDef = {
  id: "the-symmetry-group-of-a-cube-rotations-and-reflections",
  title: t("The Symmetry Group of a Cube: Rotations and Reflections", "立方体的对称群：旋转与反射"),
  summary: t(
    "The cube has 48 symmetries. The 24 rotations are the identity, 9 rotations about axes through centers of opposite faces (6 of order 4, 3 of order 2), 8 of order 3 about axes through opposite vertices, and 6 half turns about axes through midpoints of opposite edges. For the cube [−1, 1]³ the symmetries are the maps permuting the coordinates and changing their signs; a symmetry is a rotation exactly when its matrix has determinant 1.",
    "立方体有 48 个对称。24 个旋转为：恒等变换、绕过对面中心的轴的 9 个旋转（6 个 4 阶、3 个 2 阶）、绕过对顶点的轴的 8 个 3 阶旋转，以及绕过对棱中点的轴的 6 个半周旋转。对立方体 [−1, 1]³，对称就是置换坐标并改变其符号的映射；对称是旋转当且仅当其矩阵的行列式为 1。",
  ),
  prerequisites: ["the-symmetry-group-of-a-tetrahedron"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rotations-or-reflections-of-a-cube",
      title: t("Rotation or not", "是否为旋转"),
      explanation: t(
        "Write the symmetry as a matrix with one $\\pm 1$ in each row and column. Its determinant is the sign of the coordinate permutation times the product of the signs. $(x, y, z) \\mapsto (-y, x, z)$ swaps two coordinates (sign $-1$) and negates one ($-1$), so the determinant is $1$: a quarter turn about the $z$-axis.",
        "把对称写成每行每列恰有一个 $\\pm 1$ 的矩阵。它的行列式等于坐标置换的符号乘以各符号之积。$(x, y, z) \\mapsto (-y, x, z)$ 交换两个坐标（符号 $-1$）并使一个变号（$-1$），所以行列式为 $1$：它是绕 $z$ 轴的四分之一周旋转。",
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
      title: t("Orders of symmetries", "对称的阶"),
      explanation: t(
        "Apply the map repeatedly until every coordinate returns. $(x, y, z) \\mapsto (y, z, x)$ cycles the coordinates and has order $3$: it is a rotation about the diagonal through $(1, 1, 1)$. $(x, y, z) \\mapsto (-y, x, -z)$ has order $4$.",
        "反复作用该映射，直到每个坐标都回到原样。$(x, y, z) \\mapsto (y, z, x)$ 轮换坐标，阶为 $3$：它是绕过 $(1, 1, 1)$ 的对角线的旋转。$(x, y, z) \\mapsto (-y, x, -z)$ 的阶为 $4$。",
      ),
      generate(rng) {
        const m = randomCubeSymmetry(rng);
        const value = order3(m);
        return numberProblem({
          prompt: t(
            `${CUBE_SETUP.en} Find the order of the symmetry $${cubeMapTex(m)}$.`,
            `${CUBE_SETUP["zh-CN"]}求对称 $${cubeMapTex(m)}$ 的阶。`,
          ),
          answer: value,
          wrong: [2, 3, 4, 6].filter((x) => x !== value),
          solution: t(
            `Applying it repeatedly returns to $(x, y, z)$ first after $${value}$ steps.`,
            `反复作用它，第一次回到 $(x, y, z)$ 是在第 $${value}$ 步。`,
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
  prerequisites: ["the-symmetry-group-of-a-cube-rotations-and-reflections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "images-under-composite-symmetries",
      title: t("Composing symmetries", "复合对称"),
      explanation: t(
        "A composite symmetry applies the right map first and then the left map, so substitute the result of one into the formula of the other. $\\rho \\circ \\mu$ applies $\\mu$ first. With $\\mu: (x, y, z) \\mapsto (x, y, -z)$ and $\\rho: (x, y, z) \\mapsto (-y, x, z)$: $\\mu(1, 2, 3) = (1, 2, -3)$ and $\\rho(1, 2, -3) = (-2, 1, -3)$.",
        "复合对称先作用右边的映射，再作用左边的映射，所以把一个映射的结果代入另一个映射的公式。$\\rho \\circ \\mu$ 先作用 $\\mu$。设 $\\mu: (x, y, z) \\mapsto (x, y, -z)$，$\\rho: (x, y, z) \\mapsto (-y, x, z)$：$\\mu(1, 2, 3) = (1, 2, -3)$，$\\rho(1, 2, -3) = (-2, 1, -3)$。",
      ),
      generate(rng) {
        let rho: Mat3;
        let mu: Mat3;
        do {
          rho = randomCubeSymmetry(rng);
          mu = randomCubeSymmetry(rng);
        } while (mul3(rho, mu).every((row, i) => row.every((x, j) => x === mul3(mu, rho)[i]![j])));
        const v = rng.sample([1, 2, 3, 4, 5], 3).map((x) => (rng.bool() ? x : -x));
        const right = apply3(rho, apply3(mu, v));
        return texChoice(
          rng,
          t(
            `${CUBE_SETUP.en} Let $\\rho: ${cubeMapTex(rho)}$ and $\\mu: ${cubeMapTex(mu)}$. Find $(\\rho \\circ \\mu)${pointTex(v)}$.`,
            `${CUBE_SETUP["zh-CN"]}设 $\\rho: ${cubeMapTex(rho)}$，$\\mu: ${cubeMapTex(mu)}$。求 $(\\rho \\circ \\mu)${pointTex(v)}$。`,
          ),
          pointTex(right),
          [pointTex(apply3(mu, apply3(rho, v))), pointTex(apply3(rho, v)), pointTex(apply3(mu, v))],
          t(
            `$\\mu${pointTex(v)} = ${pointTex(apply3(mu, v))}$, and $\\rho${pointTex(apply3(mu, v))} = ${pointTex(right)}$.`,
            `$\\mu${pointTex(v)} = ${pointTex(apply3(mu, v))}$，$\\rho${pointTex(apply3(mu, v))} = ${pointTex(right)}$。`,
          ),
        );
      },
    },
    {
      id: "orders-of-composite-symmetries",
      title: t("Orders of composites", "复合的阶"),
      explanation: t(
        "Find the composite map first, then its order. With $\\rho: (x, y, z) \\mapsto (-y, x, z)$ and $\\mu: (x, y, z) \\mapsto (x, y, -z)$, $\\rho \\circ \\mu: (x, y, z) \\mapsto (-y, x, -z)$, which has order $4$ and is not a rotation.",
        "先求出复合映射，再求它的阶。设 $\\rho: (x, y, z) \\mapsto (-y, x, z)$，$\\mu: (x, y, z) \\mapsto (x, y, -z)$，则 $\\rho \\circ \\mu: (x, y, z) \\mapsto (-y, x, -z)$，阶为 $4$，且不是旋转。",
      ),
      generate(rng) {
        let rho: Mat3;
        let mu: Mat3;
        let c: Mat3;
        do {
          rho = randomCubeSymmetry(rng);
          mu = randomCubeSymmetry(rng);
          c = mul3(rho, mu);
        } while (isIdentity3(c));
        const value = order3(c);
        return numberProblem({
          prompt: t(
            `${CUBE_SETUP.en} Let $\\rho: ${cubeMapTex(rho)}$ and $\\mu: ${cubeMapTex(mu)}$. Find the order of $\\rho \\circ \\mu$.`,
            `${CUBE_SETUP["zh-CN"]}设 $\\rho: ${cubeMapTex(rho)}$，$\\mu: ${cubeMapTex(mu)}$。求 $\\rho \\circ \\mu$ 的阶。`,
          ),
          answer: value,
          wrong: [
            order3(rho),
            order3(mu),
            lcm(order3(rho), order3(mu)),
            order3(mul3(mu, rho)) === value ? 2 * value : order3(mul3(mu, rho)),
          ],
          solution: t(
            `$\\rho \\circ \\mu$ is $${cubeMapTex(c)}$, which returns to $(x, y, z)$ first after $${value}$ applications.`,
            `$\\rho \\circ \\mu$ 为 $${cubeMapTex(c)}$，作用 $${value}$ 次后第一次回到 $(x, y, z)$。`,
          ),
        });
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
