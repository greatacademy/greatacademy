// Third knowledge points for thin topics of Abstract Algebra, on permutations, symmetries, cosets
// and the isomorphism theorems: the reverse question, a harder case or a common trap.
// See `deeperAbstractAlgebraThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { Q } from "@ga/subject-math";
import { algebraDrawings1 } from "../explanation-drawings-abstract-algebra-1.ts";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { ask, choose, factorize, type Pair, point, totient } from "../university-kit.ts";
import { gcd, lcm } from "./deeper-methods-of-proof-third.ts";

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
    "Every subgroup of the integers has the form $d\\mathbb{Z}$. The set $a\\mathbb{Z} + b\\mathbb{Z}$ of all combinations $ax + by$ is a subgroup, and by Bezout's identity its positive generator is $\\gcd(a, b)$. Intersections give the least common multiple instead.",
    "整数的每个子群都形如 $d\\mathbb{Z}$。所有组合 $ax + by$ 构成的集合 $a\\mathbb{Z} + b\\mathbb{Z}$ 是子群，由贝祖等式，它的正生成元是 $\\gcd(a, b)$。而交集给出的是最小公倍数。",
  ],
  (rng) => {
    const g = rng.int(2, 12);
    const a = g * rng.int(1, 9);
    let b = g * rng.int(1, 9);
    if (b === a) b += g;
    const answer = gcd(a, b);
    return ask(
      [
        `The sum $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$ is a subgroup $d\\mathbb{Z}$ of $\\mathbb{Z}$ with $d > 0$. Find $d$.`,
        `和 $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子群 $d\\mathbb{Z}$，其中 $d > 0$。求 $d$。`,
      ],
      answer,
      [lcm(a, b), a + b, a * b],
      [
        `The combinations $${a}x + ${b}y$ are exactly the multiples of $\\gcd(${a}, ${b})$, so $d = ${answer}$.`,
        `组合 $${a}x + ${b}y$ 恰好是 $\\gcd(${a}, ${b})$ 的所有倍数，所以 $d = ${answer}$。`,
      ],
    );
  },
);

const cyclePower = point(
  "a-high-power-of-a-cycle",
  ["A high power of a cycle", "循环的高次幂"],
  [
    "A cycle of length $L$ returns every point to itself after $L$ steps. So its power $\\sigma^{k}$ depends only on the remainder of $k$ modulo $L$, and even a very high power can be found by moving along the cycle only a few places.",
    "长度为 $L$ 的循环经过 $L$ 步使每个点回到自身。所以幂 $\\sigma^{k}$ 只取决于 $k$ 模 $L$ 的余数，即使是很高的幂，也只需沿循环移动几个位置就能求出。",
  ],
  (rng) => {
    const n = rng.int(6, 9);
    const L = rng.int(4, n);
    const cycle = rng.sample(oneTo(n), L);
    const k = rng.int(10, 200);
    const start = rng.int(0, L - 1);
    const x = cycle[start] as number;
    const steps = k % L;
    const answer = cycle[(start + steps) % L] as number;
    return ask(
      [
        `In $S_{${n}}$, let $\\sigma = ${cycleText(cycle)}$. Find $\\sigma^{${k}}(${x})$.`,
        `在 $S_{${n}}$ 中，设 $\\sigma = ${cycleText(cycle)}$。求 $\\sigma^{${k}}(${x})$。`,
      ],
      answer,
      [applyCycle(cycle, x), steps, cycle[(start + L - steps) % L] as number],
      [
        `The cycle has length $${L}$ and $${k} \\equiv ${steps} \\pmod{${L}}$, so we move $${steps}$ places along the cycle from $${x}$, which gives $${answer}$.`,
        `循环长度是 $${L}$，且 $${k} \\equiv ${steps} \\pmod{${L}}$，所以从 $${x}$ 沿循环移动 $${steps}$ 个位置，得 $${answer}$。`,
      ],
    );
  },
);

const orderFromTwoLine = point(
  "the-order-from-two-line-notation",
  ["The order from two-line notation", "由两行记法求阶"],
  [
    "The order of a permutation cannot be read directly from two-line notation. Convert it to disjoint cycles first: the order is then the least common multiple of the cycle lengths, not their sum or product, since each cycle must return at the same time.",
    "置换的阶不能直接从两行记法中读出。要先转化为不相交循环：阶就是各循环长度的最小公倍数，而不是它们的和或积，因为每个循环必须同时回到原位。",
  ],
  (rng) => {
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
    const lengths = cycles.map((c) => c.length);
    const answer = lengths.reduce(lcm, 1);
    const written =
      cycles
        .filter((c) => c.length > 1)
        .map(cycleText)
        .join("") || "e";
    const twoLine = `\\begin{pmatrix} ${oneTo(n).join(" & ")} \\\\ ${image.join(" & ")} \\end{pmatrix}`;
    return ask(
      [`Find the order of $${twoLine}$.`, `求 $${twoLine}$ 的阶。`],
      answer,
      [cycles.length, n, lengths.reduce((a, b) => a * b, 1) === answer ? answer + 1 : lengths.reduce((a, b) => a * b, 1)],
      [
        `In disjoint cycles it is $${written}$, with cycle lengths $${lengths.join(", ")}$. Their least common multiple is $${answer}$.`,
        `写成不相交循环是 $${written}$，循环长度为 $${lengths.join(", ")}$。它们的最小公倍数是 $${answer}$。`,
      ],
    );
  },
);

const inverseOfProduct = point(
  "the-inverse-of-a-product-of-cycles",
  ["The inverse of a product of cycles", "循环之积的逆"],
  [
    "The inverse of a product reverses the order: $(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$. For cycles that overlap, this order matters. To find the image of a point, apply the inverse of the outer factor first, because that undoes the last step taken by the product.",
    "积的逆要颠倒次序：$(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$。对有重叠的循环，这个次序很重要。求某点的像时，先用外层因子的逆，因为这撤销了积的最后一步。",
  ],
  (rng) => {
    const n = 6;
    const sigma = rng.sample(oneTo(n), rng.int(3, 4));
    const tau = rng.sample(oneTo(n), rng.int(3, 4));
    const x = rng.int(1, n);
    const first = inverseCycleImage(sigma, x);
    const answer = inverseCycleImage(tau, first);
    const swapped = inverseCycleImage(sigma, inverseCycleImage(tau, x));
    const forward = applyCycle(sigma, applyCycle(tau, x));
    return ask(
      [
        `In $S_{${n}}$, let $\\sigma = ${cycleText(sigma)}$ and $\\tau = ${cycleText(tau)}$, composed from right to left. Find $(\\sigma\\tau)^{-1}(${x})$.`,
        `在 $S_{${n}}$ 中，设 $\\sigma = ${cycleText(sigma)}$，$\\tau = ${cycleText(tau)}$，从右向左复合。求 $(\\sigma\\tau)^{-1}(${x})$。`,
      ],
      answer,
      [swapped, forward, x],
      [
        `Since $(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$, first $\\sigma^{-1}(${x}) = ${first}$, and then $\\tau^{-1}(${first}) = ${answer}$.`,
        `由于 $(\\sigma\\tau)^{-1} = \\tau^{-1}\\sigma^{-1}$，先得 $\\sigma^{-1}(${x}) = ${first}$，再得 $\\tau^{-1}(${first}) = ${answer}$。`,
      ],
    );
  },
);

const tetrahedronGeometry = point(
  "the-geometry-of-a-tetrahedron-permutation",
  ["The geometry of a tetrahedron permutation", "四面体置换的几何含义"],
  [
    "Every permutation of the four vertices of a regular tetrahedron is a symmetry, and its cycle type shows what it does in space. Three-cycles and double swaps are rotations, a single swap is a reflection, and a four-cycle combines a rotation with a reflection.",
    "正四面体四个顶点的每个置换都是对称，它的循环类型说明它在空间中的作用。三循环和两组对换是旋转，单个对换是反射，四循环则把旋转与反射结合在一起。",
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
    return choose(
      rng,
      [
        `The vertices of a regular tetrahedron are labeled $${v.join(", ")}$. What does the vertex permutation $${text}$ do geometrically?`,
        `正四面体的顶点标为 $${v.join(", ")}$。顶点置换 $${text}$ 在几何上起什么作用？`,
      ],
      option,
      options.filter((o) => o !== option),
      whys[kind] as Pair,
    );
  },
);

const cubeFixedVertices = {
  ...point(
    "the-vertices-a-cube-symmetry-fixes",
    ["The vertices a cube symmetry fixes", "立方体对称固定的顶点"],
    [
      "A vertex of the cube $[-1, 1]^{3}$ is a point with coordinates $\\pm 1$. A symmetry written as a map of coordinates fixes such a vertex when the resulting equations hold, and the equations may have several solutions, one solution or none.",
      "立方体 $[-1, 1]^{3}$ 的顶点是坐标为 $\\pm 1$ 的点。写成坐标映射的对称，在所得方程成立时固定这样的顶点，方程可能有多个解、一个解或无解。",
    ],
    (rng) => {
      const f = randomSigned(rng);
      const vertices: number[][] = [];
      for (const x of [1, -1]) for (const y of [1, -1]) for (const z of [1, -1]) vertices.push([x, y, z]);
      const fixed = vertices.filter((v) => applySigned(f, v).every((c, i) => c === v[i]));
      const answer = fixed.length;
      return ask(
        [
          `The cube $[-1, 1]^{3}$ has the symmetry $${signedText(f)}$. How many of its $8$ vertices does this symmetry fix?`,
          `立方体 $[-1, 1]^{3}$ 有对称 $${signedText(f)}$。这个对称固定 $8$ 个顶点中的多少个？`,
        ],
        answer,
        [8 - answer, answer === 2 ? 4 : 2, answer === 1 ? 0 : 1],
        answer === 0
          ? [
              `Setting each image coordinate equal to the original gives equations with no solution among the points with coordinates $\\pm 1$, so no vertex is fixed.`,
              `令每个像坐标等于原坐标，得到的方程在坐标为 $\\pm 1$ 的点中无解，所以没有固定的顶点。`,
            ]
          : [
              `Setting each image coordinate equal to the original gives exactly these fixed vertices: $${fixed.map(tuple).join(", ")}$.`,
              `令每个像坐标等于原坐标，恰好得到这些固定顶点：$${fixed.map(tuple).join(", ")}$。`,
            ],
      );
    },
  ),
  figure: algebraDrawings1["the-symmetry-group-of-a-cube-rotations-and-reflections#the-vertices-a-cube-symmetry-fixes"],
};

const cubeConjugate = point(
  "a-conjugate-of-a-cube-symmetry",
  ["A conjugate of a cube symmetry", "立方体对称的共轭"],
  [
    "The conjugate $\\sigma\\rho\\sigma^{-1}$ acts from right to left: undo $\\sigma$, apply $\\rho$, then redo $\\sigma$. It is the same kind of motion as $\\rho$, seen from a position moved by $\\sigma$, and in general it differs from $\\rho$ because the group is not abelian.",
    "共轭 $\\sigma\\rho\\sigma^{-1}$ 从右向左作用：先撤销 $\\sigma$，再作用 $\\rho$，然后再作用 $\\sigma$。它与 $\\rho$ 是同一类运动，只是从被 $\\sigma$ 移动过的位置看，一般与 $\\rho$ 不同，因为这个群不是阿贝尔群。",
  ],
  (rng) => {
    const rho = randomSigned(rng);
    const sigma = randomSigned(rng);
    const p = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
    const a = applySignedInverse(sigma, p);
    const b = applySigned(rho, a);
    const c = applySigned(sigma, b);
    const direct = applySigned(rho, p);
    const flipped = applySignedInverse(sigma, applySigned(rho, applySigned(sigma, p)));
    return ask(
      [
        `Let $\\rho: ${signedText(rho)}$ and $\\sigma: ${signedText(sigma)}$ be symmetries of the cube. Find the first coordinate of $\\sigma\\rho\\sigma^{-1}${tuple(p)}$, composing from right to left.`,
        `设 $\\rho: ${signedText(rho)}$ 和 $\\sigma: ${signedText(sigma)}$ 是立方体的对称。从右向左复合，求 $\\sigma\\rho\\sigma^{-1}${tuple(p)}$ 的第一个坐标。`,
      ],
      c[0] as number,
      [direct[0] as number, flipped[0] as number, b[0] as number],
      [
        `First $\\sigma^{-1}$ gives $${tuple(a)}$, then $\\rho$ gives $${tuple(b)}$, and then $\\sigma$ gives $${tuple(c)}$. The first coordinate is $${c[0]}$.`,
        `先由 $\\sigma^{-1}$ 得 $${tuple(a)}$，再由 $\\rho$ 得 $${tuple(b)}$，然后由 $\\sigma$ 得 $${tuple(c)}$。第一个坐标是 $${c[0]}$。`,
      ],
    );
  },
);

const directComponent = point(
  "the-component-in-an-internal-direct-sum",
  ["The component in an internal direct sum", "内直和中的分量"],
  [
    "If $\\mathbb{Z}_{n}$ is the internal direct sum of two subgroups, each element splits uniquely into one part from each subgroup. Finding the part is a Chinese remainder problem: it is a multiple of one generator, and it agrees with the element modulo the other.",
    "如果 $\\mathbb{Z}_{n}$ 是两个子群的内直和，那么每个元素都可以唯一地分解为每个子群中的一部分。求这一部分是一个中国剩余定理问题：它是一个生成元的倍数，并且模另一个生成元与该元素同余。",
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
    return ask(
      [
        `In $\\mathbb{Z}_{${n}}$, every element is uniquely $h + t$ with $h \\in \\langle ${m} \\rangle$ and $t \\in \\langle ${k} \\rangle$. Find $h$ for the element $${x}$, as a value from $0$ to $${n - 1}$.`,
        `在 $\\mathbb{Z}_{${n}}$ 中，每个元素都可唯一地写成 $h + t$，其中 $h \\in \\langle ${m} \\rangle$，$t \\in \\langle ${k} \\rangle$。对元素 $${x}$，求 $h$，取值范围为 $0$ 到 $${n - 1}$。`,
      ],
      h,
      [other, x, x % m],
      [
        `We need $h$ to be a multiple of $${m}$ with $h \\equiv ${x} \\pmod{${k}}$, which gives $h = ${h}$. Then $t = ${other}$ is a multiple of $${k}$, and the two add up to $${x}$.`,
        `要求 $h$ 是 $${m}$ 的倍数且 $h \\equiv ${x} \\pmod{${k}}$，得 $h = ${h}$。这时 $t = ${other}$ 是 $${k}$ 的倍数，两者之和为 $${x}$。`,
      ],
    );
  },
);

const cosetOrder = point(
  "the-order-of-a-coset-in-a-quotient",
  ["The order of a coset in a quotient", "商群中陪集的阶"],
  [
    "A coset $a + H$ can have a smaller order in the quotient than $a$ has in the group, since it is enough for a multiple of $a$ to land in $H$. With $H = \\langle d \\rangle$ and $d \\mid n$, the order is $\\frac{d}{\\gcd(a, d)}$.",
    "陪集 $a + H$ 在商群中的阶可能小于 $a$ 在群中的阶，因为只要 $a$ 的某个倍数落入 $H$ 就够了。当 $H = \\langle d \\rangle$ 且 $d \\mid n$ 时，阶是 $\\frac{d}{\\gcd(a, d)}$。",
  ],
  (rng) => {
    const d = rng.int(4, 18);
    const n = d * rng.int(2, 6);
    const a = rng.int(1, n - 1);
    const g = gcd(a, d);
    const answer = d / g;
    return ask(
      [
        `In $\\mathbb{Z}_{${n}}/\\langle ${d} \\rangle$, find the order of the coset $${a} + \\langle ${d} \\rangle$.`,
        `在 $\\mathbb{Z}_{${n}}/\\langle ${d} \\rangle$ 中，求陪集 $${a} + \\langle ${d} \\rangle$ 的阶。`,
      ],
      answer,
      [n / gcd(a, n), d, g],
      [
        `We need the smallest $t > 0$ with $${d} \\mid ${a}t$. Since $\\gcd(${a}, ${d}) = ${g}$, that is $t = ${d} \\div ${g} = ${answer}$.`,
        `需要满足 $${d} \\mid ${a}t$ 的最小 $t > 0$。由于 $\\gcd(${a}, ${d}) = ${g}$，所以 $t = ${d} \\div ${g} = ${answer}$。`,
      ],
    );
  },
);

const rationalCosetOrder = point(
  "the-order-of-a-coset-of-the-integers-in-the-rationals",
  ["The order of a coset of the integers in the rationals", "有理数中整数陪集的阶"],
  [
    "The group $\\mathbb{Q}/\\mathbb{Z}$ is infinite, yet every element has finite order, because a multiple of any fraction is an integer. The order is the denominator in lowest terms, so a fraction must be reduced before the order can be read off.",
    "群 $\\mathbb{Q}/\\mathbb{Z}$ 是无限的，但每个元素的阶都有限，因为任何分数的某个倍数都是整数。阶是最简分数的分母，所以必须先约分才能读出阶。",
  ],
  (rng) => {
    const q = rng.int(4, 60);
    const p = rng.int(1, 3 * q);
    const g = gcd(p, q);
    const reduced = q / g;
    return ask(
      [
        `Find the order of the coset $\\frac{${p}}{${q}} + \\mathbb{Z}$ in $\\mathbb{Q}/\\mathbb{Z}$.`,
        `求陪集 $\\frac{${p}}{${q}} + \\mathbb{Z}$ 在 $\\mathbb{Q}/\\mathbb{Z}$ 中的阶。`,
      ],
      reduced,
      [q === reduced ? q + 1 : q, p / g, g],
      [
        `In lowest terms the denominator of $\\frac{${p}}{${q}}$ is $${reduced}$. The smallest positive multiple of the fraction that is an integer is therefore $${reduced}$ times it.`,
        `$\\frac{${p}}{${q}}$ 约分后的分母是 $${reduced}$。因此这个分数的倍数中，最小的正整数倍数是它的 $${reduced}$ 倍。`,
      ],
    );
  },
);

const cosetEntry = point(
  "an-entry-of-a-matrix-in-a-coset",
  ["An entry of a matrix in a coset", "陪集中矩阵的元素"],
  [
    "Two matrices of $GL(2, \\mathbb{R})$ lie in the same coset of $SL(2, \\mathbb{R})$ exactly when they have the same determinant. So membership in a coset is a single equation, which can be solved for a missing entry of a matrix.",
    "$GL(2, \\mathbb{R})$ 中的两个矩阵属于 $SL(2, \\mathbb{R})$ 的同一个陪集，当且仅当它们的行列式相同。所以属于某个陪集只是一个方程，可以解出矩阵中缺少的元素。",
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
    return ask(
      [
        `Let $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$. Find the value of $x$ for which $\\begin{pmatrix} x & ${p} \\\\ ${q} & ${r} \\end{pmatrix}$ lies in $A \\cdot SL(2, \\mathbb{R})$.`,
        `设 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$。求 $x$ 的值，使 $\\begin{pmatrix} x & ${p} \\\\ ${q} & ${r} \\end{pmatrix}$ 属于 $A \\cdot SL(2, \\mathbb{R})$。`,
      ],
      answer,
      [Q.of(p * q + 1, r), Q.of(det - p * q, r), Q.of(det, 1)],
      [
        `The determinants must agree, and $\\det A = ${det}$. So $${r}x - (${p})(${q}) = ${det}$, which gives $x = ${answer.toLatex()}$.`,
        `行列式必须相同，而 $\\det A = ${det}$。所以 $${r}x - (${p})(${q}) = ${det}$，得 $x = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const cosetCount = point(
  "the-number-of-cosets-of-a-permutation-subgroup",
  ["The number of cosets of a permutation subgroup", "置换子群的陪集个数"],
  [
    "Lagrange's theorem counts the cosets without listing them: their number is the order of the group divided by the order of the subgroup. The subgroup generated by a permutation has order equal to the least common multiple of the lengths of its disjoint cycles.",
    "拉格朗日定理不必列出陪集就能计数：陪集的个数等于群的阶除以子群的阶。由一个置换生成的子群，其阶等于该置换各不相交循环长度的最小公倍数。",
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
    return ask(
      [
        `How many left cosets does $H = \\langle ${text} \\rangle$ have in $S_{${n}}$?`,
        `$H = \\langle ${text} \\rangle$ 在 $S_{${n}}$ 中有多少个左陪集？`,
      ],
      answer,
      [
        factorial(n),
        order,
        factorial(n) / lengths.reduce<number>((a, b) => a * b, 1) === answer
          ? answer * 2
          : factorial(n) / lengths.reduce<number>((a, b) => a * b, 1),
      ],
      [
        `The generator has order $${order}$, the least common multiple of its cycle lengths. So the number of cosets is $\\frac{${n}!}{${order}} = ${answer}$.`,
        `生成元的阶是 $${order}$，即各循环长度的最小公倍数。所以陪集个数是 $\\frac{${n}!}{${order}} = ${answer}$。`,
      ],
    );
  },
);

const largestMaximal = point(
  "the-largest-maximal-subgroup-of-a-cyclic-group",
  ["The largest maximal subgroup of a cyclic group", "循环群最大的极大子群"],
  [
    "The maximal subgroups of $\\mathbb{Z}_{n}$ correspond to the primes dividing $n$: for a prime $p$, the subgroup $\\langle p \\rangle$ has prime index $p$. So the largest maximal subgroup comes from the smallest prime factor, and its order is $n$ divided by this prime.",
    "$\\mathbb{Z}_{n}$ 的极大子群对应于整除 $n$ 的素数：对素数 $p$，子群 $\\langle p \\rangle$ 的指数是素数 $p$。所以最大的极大子群来自最小的素因子，它的阶是 $n$ 除以这个素数。",
  ],
  (rng) => {
    let n = rng.int(15, 400);
    while (factorize(n).length < 2) n++;
    const primes = factorize(n).map(([p]) => p);
    const small = primes[0] as number;
    const large = primes[primes.length - 1] as number;
    const answer = n / small;
    return ask(
      [`What is the order of the largest maximal subgroup of $\\mathbb{Z}_{${n}}$?`, `$\\mathbb{Z}_{${n}}$ 的最大的极大子群的阶是多少？`],
      answer,
      [n / large, small, n - 1],
      [
        `A maximal subgroup has prime index, and the smallest prime dividing $${n}$ is $${small}$. So the largest maximal subgroup has order $\\frac{${n}}{${small}} = ${answer}$.`,
        `极大子群的指数是素数，而整除 $${n}$ 的最小素数是 $${small}$。所以最大的极大子群的阶是 $\\frac{${n}}{${small}} = ${answer}$。`,
      ],
    );
  },
);

const normalizerOfCycle = point(
  "the-normalizer-of-a-cycle-subgroup",
  ["The normalizer of a cycle subgroup", "循环子群的正规化子"],
  [
    "An element normalizes $\\langle c \\rangle$ when conjugation sends $c$ to a generator of this subgroup. A cycle of length $k$ has $\\varphi(k)$ generators, each reached by $k$ arrangements on the support, and points off the support may be permuted freely.",
    "一个元素正规化 $\\langle c \\rangle$，是指共轭把 $c$ 变成这个子群的生成元。长度为 $k$ 的循环有 $\\varphi(k)$ 个生成元，每个生成元都能由支撑集上的 $k$ 种排列得到，而支撑集以外的点可以任意置换。",
  ],
  (rng) => {
    const n = rng.int(4, 9);
    const k = rng.int(3, Math.min(n, 7));
    const c = rng.sample(oneTo(n), k);
    const phi = totient(k);
    const rest = factorial(n - k);
    const answer = k * phi * rest;
    return ask(
      [
        `How many elements does the normalizer of $\\langle ${cycleText(c)} \\rangle$ in $S_{${n}}$ have?`,
        `$\\langle ${cycleText(c)} \\rangle$ 在 $S_{${n}}$ 中的正规化子有多少个元素？`,
      ],
      answer,
      [k * rest, k * phi, phi * rest],
      [
        `The cycle has $\\varphi(${k}) = ${phi}$ generators, each reached in $${k}$ ways, and the points off the cycle contribute the factor $${n - k}! = ${rest}$. The product is $${answer}$.`,
        `这个循环有 $\\varphi(${k}) = ${phi}$ 个生成元，每个生成元有 $${k}$ 种得到方式，循环以外的点贡献因子 $${n - k}! = ${rest}$。乘积是 $${answer}$。`,
      ],
    );
  },
);

const centralizerByType = {
  ...point(
    "the-centralizer-from-the-cycle-type",
    ["The centralizer from the cycle type", "由循环类型求中心化子"],
    [
      "An element commutes with a permutation when it maps cycles to cycles of the same length, keeping the order. For $c$ cycles of length $m$, there are $c!$ ways to match the cycles and $m^{c}$ rotations, and fixed points count as cycles of length one.",
      "一个元素与置换可交换，是指它把循环映成长度相同的循环且保持次序。对于 $c$ 个长度为 $m$ 的循环，有 $c!$ 种配对方式和 $m^{c}$ 种旋转方式，不动点算作长度为一的循环。",
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
        factors.push(`${m}^{${c}} \\cdot ${c}!`);
      }
      if (fixed > 1) factors.push(`${fixed}!`);
      const answer = rotations * matchings * factorial(fixed);
      const product = factors.join(" \\cdot ");
      return ask(
        [
          `How many elements does the centralizer of $${cycles.map(cycleText).join("")}$ in $S_{${n}}$ have?`,
          `$${cycles.map(cycleText).join("")}$ 在 $S_{${n}}$ 中的中心化子有多少个元素？`,
        ],
        answer,
        [rotations * factorial(fixed), rotations * matchings, lengths.reduce<number>(lcm, 1)],
        [
          `Counting rotations and matchings of equal-length cycles${fixed === 0 ? "" : `, with the $${fixed}$ fixed ${fixed === 1 ? "point" : "points"}`}, gives $${product} = ${answer}$.`,
          `计算等长循环的旋转与配对${fixed === 0 ? "" : `，并考虑 $${fixed}$ 个不动点`}，得 $${product} = ${answer}$。`,
        ],
      );
    },
  ),
  figure: algebraDrawings2["the-centralizer-of-a-subgroup#the-centralizer-from-the-cycle-type"],
};

const compositionLength = point(
  "the-length-of-a-composition-series",
  ["The length of a composition series", "合成列的长度"],
  [
    "A composition series breaks a group into a chain whose quotients are simple groups. For $\\mathbb{Z}_{n}$, each simple quotient is $\\mathbb{Z}_{p}$ for a prime $p$, so the length is the number of prime factors of $n$, counted with multiplicity, whichever chain is chosen.",
    "合成列把群分解成一条链，链中的商都是单群。对 $\\mathbb{Z}_{n}$，每个单商都是素数 $p$ 对应的 $\\mathbb{Z}_{p}$，所以长度等于 $n$ 的素因子个数（计重数），与所选的链无关。",
  ],
  (rng) => {
    let n = rng.int(12, 720);
    while (factorize(n).reduce((a, [, e]) => a + e, 0) < 3) n++;
    const f = factorize(n);
    const answer = f.reduce((a, [, e]) => a + e, 0);
    const text = f.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
    return ask(
      [
        `How many steps does a composition series of $\\mathbb{Z}_{${n}}$ have, from the whole group down to the trivial subgroup?`,
        `从整个群到平凡子群，$\\mathbb{Z}_{${n}}$ 的合成列有多少步？`,
      ],
      answer,
      [f.length === answer ? answer + 1 : f.length, answer - 1, f.reduce((a, [, e]) => a * (e + 1), 1)],
      [
        `Since $${n} = ${text}$ has $${answer}$ prime factors with multiplicity, and each step divides the order by one prime, there are $${answer}$ steps.`,
        `由于 $${n} = ${text}$ 有 $${answer}$ 个素因子（计重数），每一步使阶除以一个素数，所以有 $${answer}$ 步。`,
      ],
    );
  },
);

const imageBetweenGroups = point(
  "the-image-of-a-map-between-different-cyclic-groups",
  ["The image of a map between different cyclic groups", "不同循环群之间映射的像"],
  [
    "A homomorphism from $\\mathbb{Z}_{m}$ to $\\mathbb{Z}_{n}$ is determined by the image $a$ of $1$, which must satisfy $n \\mid ma$. The image is the cyclic subgroup generated by $a$ in the codomain, and it has $\\frac{n}{\\gcd(a, n)}$ elements.",
    "从 $\\mathbb{Z}_{m}$ 到 $\\mathbb{Z}_{n}$ 的同态由 $1$ 的像 $a$ 确定，$a$ 必须满足 $n \\mid ma$。像是陪域中由 $a$ 生成的循环子群，有 $\\frac{n}{\\gcd(a, n)}$ 个元素。",
  ],
  (rng) => {
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
    const t = rng.int(1, g - 1);
    const a = v * t;
    const answer = n / gcd(a, n);
    return ask(
      [
        `Let $\\varphi: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$ be the homomorphism with $\\varphi(1) = ${a}$. How many elements does its image have?`,
        `设 $\\varphi: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$ 是满足 $\\varphi(1) = ${a}$ 的同态。它的像有多少个元素？`,
      ],
      answer,
      [m, n, m / gcd(a, m) === answer ? answer + 1 : m / gcd(a, m)],
      [
        `The image is $\\langle ${a} \\rangle$ in $\\mathbb{Z}_{${n}}$, where $\\gcd(${a}, ${n}) = ${gcd(a, n)}$. So it has $${n} \\div ${gcd(a, n)} = ${answer}$ elements.`,
        `像是 $\\mathbb{Z}_{${n}}$ 中的 $\\langle ${a} \\rangle$，其中 $\\gcd(${a}, ${n}) = ${gcd(a, n)}$。所以它有 $${n} \\div ${gcd(a, n)} = ${answer}$ 个元素。`,
      ],
    );
  },
);

const smallestKernel = point(
  "the-smallest-possible-kernel",
  ["The smallest possible kernel", "最小可能的核"],
  [
    "By the first isomorphism theorem, the image of a homomorphism has an order dividing the order of both groups. So between cyclic groups the largest image has $\\gcd(m, n)$ elements, and this limit forces the kernel to have at least $\\frac{m}{\\gcd(m, n)}$ elements.",
    "由第一同构定理，同态的像的阶同时整除两个群的阶。所以在循环群之间，最大的像有 $\\gcd(m, n)$ 个元素，这个限制使核至少有 $\\frac{m}{\\gcd(m, n)}$ 个元素。",
  ],
  (rng) => {
    const g = rng.int(2, 12);
    const u = rng.int(2, 9);
    let v = rng.int(1, 9);
    while (gcd(u, v) !== 1) v++;
    const m = g * u;
    const n = g * v;
    const answer = u;
    return ask(
      [
        `What is the smallest possible order of the kernel of a homomorphism $\\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$?`,
        `同态 $\\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${n}}$ 的核的最小可能阶是多少？`,
      ],
      answer,
      [g, 1, m],
      [
        `The image has order dividing $\\gcd(${m}, ${n}) = ${g}$, and this is attained. Since the order of the kernel times that of the image is $${m}$, the kernel has at least $${answer}$ elements.`,
        `像的阶整除 $\\gcd(${m}, ${n}) = ${g}$，并且可以取到。由于核的阶乘以像的阶等于 $${m}$，所以核至少有 $${answer}$ 个元素。`,
      ],
    );
  },
);

const intersectionFromSum = point(
  "the-intersection-from-the-second-isomorphism-theorem",
  ["The intersection from the second isomorphism theorem", "由第二同构定理求交集"],
  [
    "The second isomorphism theorem says that $(H + K)/K \\cong H/(H \\cap K)$. Comparing the orders gives $|H + K| \\cdot |H \\cap K| = |H| \\cdot |K|$, so the size of the intersection can be found from the sizes of the two subgroups and their sum.",
    "第二同构定理说 $(H + K)/K \\cong H/(H \\cap K)$。比较阶得 $|H + K| \\cdot |H \\cap K| = |H| \\cdot |K|$，所以交集的大小可以由两个子群及其和的大小求出。",
  ],
  (rng) => {
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
    return ask(
      [
        `In an abelian group, subgroups have $|H| = ${h}$, $|K| = ${k}$ and $|H + K| = ${sum}$. Find $|H \\cap K|$.`,
        `在阿贝尔群中，子群满足 $|H| = ${h}$，$|K| = ${k}$，$|H + K| = ${sum}$。求 $|H \\cap K|$。`,
      ],
      i,
      [h + k - sum > 0 && h + k - sum !== i ? h + k - sum : p, gcd(h, k) === i ? p * q : gcd(h, k), q],
      [
        `The orders of $(H + K)/K$ and $H/(H \\cap K)$ agree, so $|H \\cap K| = \\frac{${h} \\cdot ${k}}{${sum}} = ${i}$.`,
        `$(H + K)/K$ 与 $H/(H \\cap K)$ 的阶相同，所以 $|H \\cap K| = \\frac{${h} \\cdot ${k}}{${sum}} = ${i}$。`,
      ],
    );
  },
);

const thirdChain = point(
  "orders-along-a-chain-of-normal-subgroups",
  ["Orders along a chain of normal subgroups", "正规子群链上的阶"],
  [
    "For normal subgroups $N \\le K$ of $G$, the third isomorphism theorem gives $(G/N)/(K/N) \\cong G/K$. So the indices along the chain multiply: $|G/N| = |G/K| \\cdot |K/N|$, and any one of them can be found from the other two.",
    "对于 $G$ 的正规子群 $N \\le K$，第三同构定理给出 $(G/N)/(K/N) \\cong G/K$。所以链上的指数相乘：$|G/N| = |G/K| \\cdot |K/N|$，其中任何一个都可以由另外两个求出。",
  ],
  (rng) => {
    const u = rng.int(2, 8);
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const t = u * a * b;
    return ask(
      [
        `Let $N \\le K$ be normal subgroups of $G$ with $|G| = ${t}$, $|N| = ${u}$ and $|G/K| = ${b}$. Find $|K/N|$.`,
        `设 $N \\le K$ 是 $G$ 的正规子群，$|G| = ${t}$，$|N| = ${u}$，$|G/K| = ${b}$。求 $|K/N|$。`,
      ],
      a,
      [t / u === a ? a + 1 : t / u, t / b === a ? a + 2 : t / b, a * u === t ? a + 3 : a * u],
      [
        `Here $|G/N| = \\frac{${t}}{${u}} = ${a * b}$. Since $(G/N)/(K/N) \\cong G/K$, we get $|K/N| = \\frac{${a * b}}{${b}} = ${a}$.`,
        `这里 $|G/N| = \\frac{${t}}{${u}} = ${a * b}$。由于 $(G/N)/(K/N) \\cong G/K$，得 $|K/N| = \\frac{${a * b}}{${b}} = ${a}$。`,
      ],
    );
  },
);

const reflectionFixedVertices = {
  ...point(
    "the-vertices-a-reflection-fixes",
    ["The vertices a reflection fixes", "反射固定的顶点"],
    [
      "The reflection $r^{a}s$ sends the vertex $v$ to $a - v$ modulo $n$, so a fixed vertex must satisfy $2v \\equiv a \\pmod{n}$. For odd $n$ there is one solution. For even $n$ there are two when $a$ is even and none when $a$ is odd.",
      "反射 $r^{a}s$ 把顶点 $v$ 映到模 $n$ 的 $a - v$，所以不动顶点必须满足 $2v \\equiv a \\pmod{n}$。当 $n$ 为奇数时有一个解。当 $n$ 为偶数时，$a$ 为偶数有两个解，$a$ 为奇数没有解。",
    ],
    (rng) => {
      const n = rng.int(5, 24);
      const a = rng.int(1, n - 1);
      const fixed: number[] = [];
      for (let v = 0; v < n; v++) if ((2 * v - a) % n === 0) fixed.push(v);
      const answer = fixed.length;
      return ask(
        [
          `$D_{${n}}$ acts on the vertices $0, 1, \\dots, ${n - 1}$ of a regular ${n}-gon, with $r \\cdot v = v + 1$ and $s \\cdot v = -v \\pmod{${n}}$. How many vertices does $r^{${a}}s$ fix?`,
          `$D_{${n}}$ 作用在正 ${n} 边形的顶点 $0, 1, \\dots, ${n - 1}$ 上，其中 $r \\cdot v = v + 1$，$s \\cdot v = -v \\pmod{${n}}$。$r^{${a}}s$ 固定多少个顶点？`,
        ],
        answer,
        [0, 1, 2, n].filter((v) => v !== answer),
        answer === 0
          ? [
              `The element sends $v$ to $${a} - v$, so a fixed vertex needs $2v \\equiv ${a} \\pmod{${n}}$. The left side is even and $${n}$ is even, but $${a}$ is odd, so there are none.`,
              `这个元素把 $v$ 映到 $${a} - v$，所以不动顶点需要 $2v \\equiv ${a} \\pmod{${n}}$。左边是偶数，$${n}$ 是偶数，而 $${a}$ 是奇数，所以没有。`,
            ]
          : [
              `The element sends $v$ to $${a} - v$, so a fixed vertex needs $2v \\equiv ${a} \\pmod{${n}}$. ${answer === 1 ? `The only solution is $${fixed[0]}$` : `The solutions are $${fixed.join(", ")}$`}, so the count is $${answer}$.`,
              `这个元素把 $v$ 映到 $${a} - v$，所以不动顶点需要 $2v \\equiv ${a} \\pmod{${n}}$。${answer === 1 ? `唯一的解是 $${fixed[0]}$` : `解是 $${fixed.join(", ")}$`}，所以个数是 $${answer}$。`,
            ],
      );
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
