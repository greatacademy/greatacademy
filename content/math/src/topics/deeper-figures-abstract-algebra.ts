// Knowledge points of Abstract Algebra that ask the learner to read a drawing: Cayley graphs, subgroup lattices, arrow
// diagrams of permutations and symmetric figures. See `deeperFiguresAbstractAlgebraPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { gcd, svgDocument } from "@ga/subject-math";
import { algebraDrawings1 } from "../explanation-drawings-abstract-algebra-1.ts";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { ask, choose, divisors, observed, type Pair, point, same } from "../university-kit.ts";
import { arrowLine, node, ring } from "./figure-reading-more.ts";

/** ringed circles a node to highlight it. */
const ringed = ([x, y]: Point) =>
  `<circle class="accent" cx="${x}" cy="${y}" r="16" fill="none" stroke="currentColor" stroke-width="2.5"/>`;

/** edgeBetween draws a plain line between two nodes, stopping at their circles so that the labels stay clear. */
function edgeBetween([x1, y1]: Point, [x2, y2]: Point, extra = ""): string {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const [ux, uy] = [((x2 - x1) / length) * 12, ((y2 - y1) / length) * 12];
  const r = (v: number) => Math.round(v * 10) / 10;
  return `<line x1="${r(x1 + ux)}" y1="${r(y1 + uy)}" x2="${r(x2 - ux)}" y2="${r(y2 - uy)}" ${extra}/>`;
}

/** additionGraph draws the integers modulo n in a ring, with an arrow from each x to x + g. */
function additionGraph(n: number, g: number): string {
  const at = ring(n, 85);
  const lines = at.map((p, x) => arrowLine(p, at[(x + g) % n] as Point, 14, true)).join("");
  return svgDocument(220, lines + at.map((p, x) => node(p, String(x))).join(""));
}

/** primeCount counts the prime factors of a number, with repetition. */
function primeCount(n: number): number {
  let count = 0;
  let rest = n;
  for (let p = 2; p <= rest; p++)
    while (rest % p === 0) {
      rest /= p;
      count++;
    }
  return count;
}

/** latticePositions places the divisors of n in rows by their number of prime factors, with the whole group on top. */
function latticePositions(n: number): Map<number, Point> {
  const levels = new Map<number, number[]>();
  for (const d of divisors(n)) levels.set(primeCount(d), [...(levels.get(primeCount(d)) ?? []), d]);
  const top = primeCount(n);
  const places = new Map<number, Point>();
  for (const [level, row] of levels)
    row.forEach((d, i) => {
      places.set(d, [160 + (i - (row.length - 1) / 2) * 66, 200 - (level * 180) / Math.max(top, 1)]);
    });
  return places;
}

/** latticeFigure draws the subgroup lattice of the integers modulo n, labelling each subgroup by its order. */
function latticeFigure(n: number, labels: boolean, marked: readonly number[] = []): string {
  const places = latticePositions(n);
  let lines = "";
  for (const a of places.keys())
    for (const b of places.keys())
      if (b % a === 0 && primeCount(b) === primeCount(a) + 1) {
        lines += edgeBetween(places.get(a) as Point, places.get(b) as Point);
      }
  const nodes = [...places].map(([d, p]) => node(p, labels ? String(d) : "")).join("");
  return svgDocument(220, lines + nodes + marked.map((d) => ringed(places.get(d) as Point)).join(""));
}

/** cycleText writes a permutation in cycle notation, leaving out fixed points. */
function cycleText(perm: readonly number[]): string {
  const seen = new Set<number>();
  let text = "";
  perm.forEach((_, start) => {
    if (seen.has(start) || perm[start] === start) return;
    const cycle: number[] = [];
    let x = start;
    while (!seen.has(x)) {
      seen.add(x);
      cycle.push(x + 1);
      x = perm[x] as number;
    }
    text += `(${cycle.join("\\;")})`;
  });
  return text === "" ? "e" : text;
}

/** cycleCount counts the cycles of a permutation, with fixed points counted as cycles. */
function cycleCount(perm: readonly number[]): number {
  const seen = new Set<number>();
  let count = 0;
  perm.forEach((_, start) => {
    if (seen.has(start)) return;
    count++;
    let x = start;
    while (!seen.has(x)) {
      seen.add(x);
      x = perm[x] as number;
    }
  });
  return count;
}

/** randomPerm shuffles the positions, leaving at most one fixed point so that the drawing has plenty of arrows. */
function randomPerm(rng: Rng, n: number): number[] {
  let perm = rng.shuffle(Array.from({ length: n }, (_, i) => i));
  for (let tries = 0; tries < 6 && perm.filter((v, i) => v === i).length > 1; tries++) perm = rng.shuffle(perm);
  return perm;
}

/** permFigure draws a permutation on a ring of numbered points, with an arrow from each point to its image. */
function permFigure(perm: readonly number[]): string {
  const at = ring(perm.length, 85);
  const lines = perm.map((v, i) => (v === i ? "" : arrowLine(at[i] as Point, at[v] as Point, 14, true))).join("");
  return svgDocument(220, lines + at.map((p, i) => node(p, String(i + 1))).join(""));
}

/** permAlt describes a permutation in words for the description of a figure. */
const permAlt = (perm: readonly number[]) => perm.map((v, i) => `${i + 1} to ${v + 1}`).join(", ");

/** permAltZh describes a permutation in Chinese for the description of a figure. */
const permAltZh = (perm: readonly number[]) => perm.map((v, i) => `${i + 1} 到 ${v + 1}`).join("，");

const orderFromArrows = {
  ...point(
    "the-order-of-an-element-from-its-arrows",
    ["The order of an element from its arrows", "由箭头读元素的阶"],
    [
      "In the Cayley graph of the integers modulo $n$, each arrow adds the same element $g$. The order of $g$ is the number of steps along arrows needed to get back to the start. Follow the arrows from $0$ and count them. The result always divides $n$, and it equals $n$ divided by the greatest common divisor of $n$ and $g$.",
      "在模 $n$ 整数的凯莱图中，每个箭头都加上同一个元素 $g$。$g$ 的阶是沿箭头回到起点所需的步数。从 $0$ 出发沿箭头走并计数。结果总是整除 $n$，并且等于 $n$ 除以 $n$ 与 $g$ 的最大公约数。",
    ],
    (rng) => {
      const n = rng.pick([5, 6, 7, 8, 9, 10, 12]);
      const g = rng.int(1, n - 1);
      const order = n / gcd(n, g);
      return ask(
        [
          `The drawing shows the integers modulo $${n}$, and each arrow adds the same element $g$. What is the order of $g$?`,
          `图中是模 $${n}$ 的整数，每个箭头都加上同一个元素 $g$。$g$ 的阶是多少？`,
        ],
        order,
        [g, n, gcd(n, g) === order ? n - 1 : gcd(n, g)],
        [
          `The arrow out of $0$ points to $${g}$, so $g = ${g}$. Following the arrows from $0$ returns to $0$ after $${order}$ steps, so that is the order.`,
          `从 $0$ 出发的箭头指向 $${g}$，所以 $g = ${g}$。从 $0$ 沿箭头走 $${order}$ 步回到 $0$，所以阶就是这个数。`,
        ],
        {
          svg: additionGraph(n, g),
          alt: t(
            `The integers modulo ${n} in a ring, with an arrow from each x to x + ${g}.`,
            `模 ${n} 的整数排成一圈，每个 x 都有箭头指向 x + ${g}。`,
          ),
        },
      );
    },
  ),
  figure: algebraDrawings1["cyclic-subgroups#the-order-of-an-element-from-its-arrows"],
};

const cyclesOfArrows = {
  ...point(
    "the-separate-cycles-of-an-addition-graph",
    ["The separate cycles of an addition graph", "加法图中的分离圈"],
    [
      "An element generates the whole group of integers modulo $n$ exactly when its arrows form a single cycle through every point. If the arrows split into several separate cycles, the element generates only a proper subgroup, whose cosets are those cycles. The number of cycles is the greatest common divisor of $n$ and the element.",
      "一个元素生成模 $n$ 整数的整个群，当且仅当它的箭头构成经过每一点的单个圈。如果箭头分成几个分离的圈，这个元素只生成真子群，这些圈就是它的陪集。圈的个数是 $n$ 与该元素的最大公约数。",
    ],
    (rng) => {
      const n = rng.pick([6, 8, 9, 10, 12]);
      const g = rng.int(1, n - 1);
      const d = gcd(n, g);
      return ask(
        [
          "Each arrow adds the same element $g$ to a point. Into how many separate cycles do the arrows split the points?",
          "每个箭头都给一个点加上同一个元素 $g$。箭头把这些点分成多少个分离的圈？",
        ],
        d,
        [n / d === d ? d + 1 : n / d, d + 1, g === d ? d + 2 : g],
        [
          d === 1
            ? `Starting from $0$ and following the arrows reaches every point before returning, so there is a single cycle and $g = ${g}$ generates the group.`
            : `Starting from $0$, the arrows reach only the multiples of $${d}$, and the other points form parallel cycles, so there are $${d}$ cycles and $g = ${g}$ does not generate the group.`,
          d === 1
            ? `从 $0$ 出发沿箭头走，回来之前到达每一点，所以只有一个圈，$g = ${g}$ 生成这个群。`
            : `从 $0$ 出发，箭头只到达 $${d}$ 的倍数，其余的点构成平行的圈，所以有 $${d}$ 个圈，$g = ${g}$ 不生成这个群。`,
        ],
        {
          svg: additionGraph(n, g),
          alt: t(
            `The integers modulo ${n} in a ring, with an arrow from each x to x + ${g}.`,
            `模 ${n} 的整数排成一圈，每个 x 都有箭头指向 x + ${g}。`,
          ),
        },
      );
    },
  ),
  figure: algebraDrawings1["generators-of-cyclic-groups#the-separate-cycles-of-an-addition-graph"],
};

const cosetOnRing = point(
  "a-coset-on-a-drawn-ring",
  ["A coset on a drawn ring", "图中圆环上的陪集"],
  [
    "A coset $x + H$ of a subgroup $H$ of the integers modulo $n$ is $H$ turned around the ring by $x$ steps. So the coset has the same size and spacing as $H$, and it contains $x$. It either equals $H$ or shares no point with it, and the cosets together cover the whole ring.",
    "模 $n$ 整数的子群 $H$ 的陪集 $x + H$，就是把 $H$ 沿圆环转动 $x$ 步。所以陪集与 $H$ 大小和间隔相同，并且包含 $x$。它要么等于 $H$，要么与 $H$ 没有公共点，所有陪集合起来覆盖整个圆环。",
  ],
  (rng) => {
    const n = rng.pick([6, 8, 9, 10, 12]);
    const step = rng.pick(divisors(n).filter((d) => d > 1 && d < n));
    const size = n / step;
    const x = rng.int(1, step === 1 ? n - 1 : step - 1);
    const H = Array.from({ length: size }, (_, i) => i * step);
    const set = (shift: number, stride = step) =>
      same(
        `\\{${Array.from({ length: size }, (_, i) => (shift + i * stride) % n)
          .sort((a, b) => a - b)
          .join(", ")}\\}`,
      );
    const at = ring(n, 85);
    const svg = svgDocument(220, at.map((p, i) => node(p, String(i))).join("") + H.map((v) => ringed(at[v] as Point)).join(""));
    return choose(
      rng,
      [
        `The circled points form a subgroup $H$ of the integers modulo $${n}$. What is the coset $${x} + H$?`,
        `圈出的点构成模 $${n}$ 整数的子群 $H$。陪集 $${x} + H$ 是什么？`,
      ],
      set(x),
      [set(0), set(x + 1), set(0, step === 2 ? 1 : step - 1), set(x, step === 2 ? 1 : step - 1), set(x + 2)],
      [
        `The circled points are spaced $${step}$ apart. Turning them by $${x}$ steps keeps this spacing and moves $0$ to $${x}$, which gives the coset.`,
        `圈出的点间隔为 $${step}$。把它们转动 $${x}$ 步，保持这一间隔并把 $0$ 移到 $${x}$，就得到这个陪集。`,
      ],
      {
        svg,
        alt: t(
          `The integers modulo ${n} in a ring, with ${H.join(", ")} circled.`,
          `模 ${n} 的整数排成一圈，其中 ${H.join("，")} 被圈出。`,
        ),
      },
    );
  },
);

const lattices = [8, 12, 16, 18, 20, 24, 27, 28, 30, 36, 42];

const indexInLattice = point(
  "the-index-from-a-subgroup-lattice",
  ["The index from a subgroup lattice", "由子群格读指数"],
  [
    "A subgroup lattice shows the subgroups as nodes, with lines going upward from each to the slightly larger ones that contain it. The top node is the whole group. By Lagrange's theorem, the index of a subgroup is the order of the group divided by the order of the subgroup, so the two labels give it directly.",
    "子群格用节点表示子群，从每个节点向上连线到包含它的稍大子群。最上面的节点是整个群。由拉格朗日定理，子群的指数等于群的阶除以子群的阶，所以两个标记直接给出它。",
  ],
  (rng) => {
    const n = rng.pick(lattices);
    const d = rng.pick(divisors(n).filter((v) => v < n));
    return ask(
      [
        "The drawing shows the subgroup lattice of a cyclic group, each node labeled by the order of the subgroup. What is the index of the circled subgroup in the whole group?",
        "图中是某循环群的子群格，每个节点标有子群的阶。圈出的子群在整个群中的指数是多少？",
      ],
      n / d,
      [d === n / d ? d + 1 : d, n, n - d],
      [
        `The top node shows that the group has order $${n}$, and the circled subgroup has order $${d}$. The index is the quotient, $${n / d}$.`,
        `最上面的节点说明群的阶是 $${n}$，圈出的子群的阶是 $${d}$。指数就是它们的商 $${n / d}$。`,
      ],
      {
        svg: latticeFigure(n, true, [d]),
        alt: t(
          `The lattice of subgroups of orders ${divisors(n).join(", ")}, with the subgroup of order ${d} circled.`,
          `阶为 ${divisors(n).join("，")} 的子群的格，阶为 ${d} 的子群被圈出。`,
        ),
      },
    );
  },
);

const shapeOfLattice = point(
  "the-group-from-the-shape-of-its-lattice",
  ["The group from the shape of its lattice", "由格的形状判断群"],
  [
    "The subgroups of a cyclic group of order $n$ correspond exactly to the divisors of $n$. So the lattice has the same shape as the divisors under division. A prime power gives a single chain, a product of two primes gives a diamond, and a product of three different primes gives the corners of a cube.",
    "$n$ 阶循环群的子群恰好对应 $n$ 的因数。所以子群格与因数按整除排列的形状相同。素数幂给出一条链，两个素数之积给出菱形，三个不同素数之积给出立方体的顶点。",
  ],
  (rng) => {
    const shapes: { readonly right: readonly number[]; readonly wrong: readonly number[]; readonly clue: Pair }[] = [
      {
        right: [4, 9, 25, 49],
        wrong: [6, 8, 10, 12, 15],
        clue: ["a chain of three nodes, which fits the square of a prime", "三个节点的链，符合素数的平方"],
      },
      {
        right: [8, 27],
        wrong: [4, 9, 6, 12, 18, 30],
        clue: ["a chain of four nodes, which fits the cube of a prime", "四个节点的链，符合素数的立方"],
      },
      {
        right: [6, 10, 15, 14, 21],
        wrong: [4, 8, 9, 12, 30],
        clue: ["a diamond, which fits a product of two different primes", "菱形，符合两个不同素数之积"],
      },
      {
        right: [12, 18, 20, 28],
        wrong: [6, 8, 16, 24, 30, 36],
        clue: ["two rows of three nodes, which fits a prime squared times another prime", "两列各三个节点，符合素数平方乘另一个素数"],
      },
      {
        right: [30, 42],
        wrong: [8, 12, 16, 24, 36],
        clue: ["the corners of a cube, which fits a product of three different primes", "立方体的顶点，符合三个不同素数之积"],
      },
    ];
    const shape = rng.pick(shapes);
    const n = rng.pick(shape.right);
    const z = (m: number) => same(`\\mathbb{Z}_{${m}}`);
    return choose(
      rng,
      [
        "The subgroup lattice of a cyclic group is drawn without labels. Which group could it be?",
        "图中是某循环群的子群格，没有标记。它可能是哪个群？",
      ],
      z(n),
      rng.sample(shape.wrong, 3).map(z),
      [
        `The lattice is ${shape.clue[0]}, and the divisors of $${n}$ have that shape under division.`,
        `这个格是${shape.clue[1]}，$${n}$ 的因数按整除排列正是这个形状。`,
      ],
      {
        svg: latticeFigure(n, false),
        alt: t(`An unlabeled lattice: ${observed(shape.clue)[0]}.`, `没有标记的格：${observed(shape.clue)[1]}。`),
      },
    );
  },
);

const aboveInLattice = point(
  "subgroups-of-a-quotient-from-the-lattice",
  ["Subgroups of a quotient from the lattice", "由格读商群的子群"],
  [
    "The correspondence theorem says that the subgroups of the quotient $G/N$ match the subgroups of $G$ that contain $N$. In a lattice, these are the node of $N$ and all the nodes that can be reached from it by going upward along lines. Nodes on another branch do not contain $N$, even when they are higher in the picture.",
    "对应定理说，商群 $G/N$ 的子群与 $G$ 中包含 $N$ 的子群一一对应。在格中，这些就是 $N$ 的节点，以及从它沿线向上能到达的所有节点。其他分支上的节点不包含 $N$，即使它们在图中位置更高。",
  ],
  (rng) => {
    const n = rng.pick(lattices);
    const d = rng.pick(divisors(n).filter((v) => v < n));
    const above = divisors(n).filter((v) => v % d === 0);
    return ask(
      [
        "The drawing shows the subgroup lattice of a cyclic group $G$, each node labeled by order, with a subgroup $N$ circled. How many subgroups does the quotient $G/N$ have?",
        "图中是循环群 $G$ 的子群格，每个节点标有阶，子群 $N$ 被圈出。商群 $G/N$ 有多少个子群？",
      ],
      above.length,
      [divisors(n).length, above.length - 1, n / d === above.length ? above.length + 1 : n / d],
      [
        `The subgroups of the quotient match those containing $N$. Going upward from the circled node reaches the orders $${above.join(", ")}$, counting $N$ itself, which makes $${above.length}$.`,
        `商群的子群对应包含 $N$ 的子群。从圈出的节点向上到达阶为 $${above.join(", ")}$ 的子群，包括 $N$ 本身，共 $${above.length}$ 个。`,
      ],
      {
        svg: latticeFigure(n, true, [d]),
        alt: t(
          `The lattice of subgroups of orders ${divisors(n).join(", ")}, with the subgroup of order ${d} circled.`,
          `阶为 ${divisors(n).join("，")} 的子群的格，阶为 ${d} 的子群被圈出。`,
        ),
      },
    );
  },
);

const dihedralWalk = {
  ...point(
    "a-walk-on-a-dihedral-cayley-graph",
    ["A walk on a dihedral Cayley graph", "二面体群凯莱图上的行走"],
    [
      "A Cayley graph for the generating set of a rotation $r$ and a reflection $s$ has one kind of edge for each generator. A word in the generators is a walk: each letter says which kind of edge to follow from the current point. In the dihedral group, the rotation arrows run in opposite directions on the two rings.",
      "由旋转 $r$ 和反射 $s$ 组成的生成集的凯莱图，每个生成元对应一种边。生成元组成的字就是一次行走：每个字母说明从当前点沿哪种边走。在二面体群中，两个环上的旋转箭头方向相反。",
    ],
    (rng) => {
      const n = rng.pick([3, 4, 5, 6]);
      const outer = ring(n, 88);
      const inner = ring(n, 44);
      const names = rng.shuffle("ABCDEFGHJKLM".split("").slice(0, 2 * n));
      const outerName = (i: number) => names[i] as string;
      const innerName = (i: number) => names[n + i] as string;
      let body = "";
      for (let i = 0; i < n; i++) {
        body += arrowLine(outer[i] as Point, outer[(i + 1) % n] as Point, 14, true);
        body += arrowLine(inner[(i + 1) % n] as Point, inner[i] as Point, 14, true);
        body += edgeBetween(outer[i] as Point, inner[i] as Point, 'stroke-dasharray="4 3"');
      }
      for (let i = 0; i < n; i++) body += node(outer[i] as Point, outerName(i)) + node(inner[i] as Point, innerName(i));
      const length = rng.int(3, 5);
      const word = Array.from({ length }, () => rng.bool());
      if (!word.some((w) => w)) word[0] = true;
      if (word.every((w) => w)) word[length - 1] = false;
      let [index, onOuter] = [rng.int(0, n - 1), true];
      const startName = outerName(index);
      for (const useR of word) {
        if (useR) index = onOuter ? (index + 1) % n : (index + n - 1) % n;
        else onOuter = !onOuter;
      }
      const finish = onOuter ? outerName(index) : innerName(index);
      const steps: Pair = [word.map((w) => (w ? "solid" : "dashed")).join(", "), word.map((w) => (w ? "实线" : "虚线")).join("，")];
      const others = names.filter((v) => v !== finish);
      return choose(
        rng,
        [
          `Solid arrows apply the rotation and dashed lines apply the reflection. Starting at $${startName}$, follow these edges in order: ${steps[0]}. Where does the walk end?`,
          `实线箭头表示旋转，虚线表示反射。从 $${startName}$ 出发，依次沿这些边走：${steps[1]}。行走在哪里结束？`,
        ],
        same(finish),
        rng.sample(others, 3).map((v) => same(v)),
        [
          `Following the edges in the given order from $${startName}$, on each ring in the direction of its arrows, and crossing between rings on each dashed line, the walk ends at $${finish}$.`,
          `从 $${startName}$ 出发按给定顺序走，在每个环上沿箭头方向，遇到虚线就换环，行走在 $${finish}$ 结束。`,
        ],
        {
          svg: svgDocument(220, body),
          alt: t(
            `A dihedral Cayley graph with two rings of ${n} points each, joined by dashed lines; the rings have arrows in opposite directions.`,
            `二面体群的凯莱图，两个环各有 ${n} 个点，由虚线连接；两个环的箭头方向相反。`,
          ),
        },
      );
    },
  ),
  figure: algebraDrawings1["generating-sets#a-walk-on-a-dihedral-cayley-graph"],
};

const cycleFromArrows = point(
  "cycle-notation-from-an-arrow-diagram",
  ["Cycle notation from an arrow diagram", "由箭头图写轮换记法"],
  [
    "To write a permutation in cycles from a diagram of arrows, start at a point and follow arrows until they return, writing the points in the order visited. Then start again from a point not yet used. Points with no arrow are fixed, and they are left out. The direction of the arrows matters, since reversing them gives the inverse.",
    "要从箭头图写出置换的轮换形式，从一点出发沿箭头走直到回来，按到达顺序写下各点。然后从还没用过的点再开始。没有箭头的点是不动点，略去不写。箭头方向很重要，因为反向就得到逆置换。",
  ],
  (rng) => {
    const n = rng.int(4, 7);
    const perm = randomPerm(rng, n);
    const inverse = [...perm];
    perm.forEach((v, i) => {
      inverse[v] = i;
    });
    const right = cycleText(perm);
    const cand = [
      cycleText(inverse),
      cycleText(perm.map((v) => perm[v] as number)),
      cycleText(perm.map((v) => (v + 1) % n)),
      cycleText(randomPerm(rng, n)),
      cycleText(randomPerm(rng, n)),
      cycleText(randomPerm(rng, n)),
    ];
    const wrong = [...new Set(cand)].filter((c) => c !== right);
    return choose(
      rng,
      [
        "Each arrow goes from a point to its image under a permutation, and a point with no arrow is fixed. What is the permutation in cycle notation?",
        "每个箭头从一点指向它在置换下的像，没有箭头的点是不动点。这个置换的轮换记法是什么？",
      ],
      same(right),
      wrong.map((c) => same(c)),
      [
        `Starting from the lowest unused point and following the arrows until they close up gives $${right}$.`,
        `从最小的未用点出发，沿箭头走到闭合，得到 $${right}$。`,
      ],
      { svg: permFigure(perm), alt: t(`A permutation that sends ${permAlt(perm)}.`, `一个置换，把 ${permAltZh(perm)}。`) },
    );
  },
);

const inverseFromArrows = point(
  "the-inverse-from-an-arrow-diagram",
  ["The inverse from an arrow diagram", "由箭头图读逆置换"],
  [
    "The inverse of a permutation undoes it, so it reverses every arrow. To find the image of a point under the inverse, look for the arrow that ends at that point and read where it starts. A common slip is to follow the arrow out of the point, which gives the permutation and not its inverse.",
    "置换的逆撤销它，所以把每个箭头反向。要求一点在逆置换下的像，就找到终点是这一点的箭头，读它的起点。常见错误是沿从这一点出发的箭头走，这得到的是置换本身而不是它的逆。",
  ],
  (rng) => {
    const n = rng.int(5, 8);
    const perm = randomPerm(rng, n);
    const moved = perm.map((_, i) => i).filter((i) => perm[i] !== i);
    const k = rng.pick(moved);
    const source = perm.indexOf(k);
    return ask(
      [
        `Each arrow goes from a point to its image under a permutation $\\sigma$, and a point with no arrow is fixed. What is $\\sigma^{-1}(${k + 1})$?`,
        `每个箭头从一点指向它在置换 $\\sigma$ 下的像，没有箭头的点是不动点。$\\sigma^{-1}(${k + 1})$ 是多少？`,
      ],
      source + 1,
      [(perm[k] as number) + 1, k + 1, ((perm[perm[k] as number] as number) % n) + 1],
      [
        `The arrow that ends at $${k + 1}$ starts at $${source + 1}$, so $\\sigma(${source + 1}) = ${k + 1}$ and the inverse sends $${k + 1}$ back to $${source + 1}$.`,
        `终点是 $${k + 1}$ 的箭头从 $${source + 1}$ 出发，所以 $\\sigma(${source + 1}) = ${k + 1}$，逆置换把 $${k + 1}$ 送回 $${source + 1}$。`,
      ],
      { svg: permFigure(perm), alt: t(`A permutation that sends ${permAlt(perm)}.`, `一个置换，把 ${permAltZh(perm)}。`) },
    );
  },
);

const transpositionCount = point(
  "the-fewest-transpositions-for-a-drawing",
  ["The fewest transpositions for a drawing", "图中置换所需最少对换"],
  [
    "A cycle of length $k$ can be written with $k - 1$ transpositions, and no fewer. So the fewest transpositions for a permutation is the sum of $k - 1$ over its cycles, which equals the number of points minus the number of cycles, with fixed points counted as cycles of length one. The diagram shows the cycles directly.",
    "长度为 $k$ 的轮换可以写成 $k - 1$ 个对换，不能更少。所以一个置换所需的最少对换数是各轮换的 $k - 1$ 之和，等于点数减去轮换数，不动点算作长度为一的轮换。箭头图直接显示轮换。",
  ],
  (rng) => {
    const n = rng.int(5, 8);
    const perm = randomPerm(rng, n);
    const c = cycleCount(perm);
    const answer = n - c;
    return ask(
      [
        "Each arrow goes from a point to its image under a permutation, and a point with no arrow is fixed. What is the fewest transpositions whose product is this permutation?",
        "每个箭头从一点指向它在置换下的像，没有箭头的点是不动点。这个置换最少能写成多少个对换的积？",
      ],
      answer,
      [n, c === answer ? answer + 1 : c, answer + 1],
      [
        `The arrows form $${c}$ cycles on $${n}$ points, counting any fixed point as a cycle. A cycle of length $k$ needs $k - 1$ transpositions, which gives $${n} - ${c} = ${answer}$ in total.`,
        `箭头在 $${n}$ 个点上构成 $${c}$ 个轮换，不动点也算一个轮换。长度为 $k$ 的轮换需要 $k - 1$ 个对换，总共是 $${n} - ${c} = ${answer}$ 个。`,
      ],
      { svg: permFigure(perm), alt: t(`A permutation that sends ${permAlt(perm)}.`, `一个置换，把 ${permAltZh(perm)}。`) },
    );
  },
);

const orbitStabilizer = {
  ...point(
    "the-stabilizer-of-a-marked-point-of-a-polygon",
    ["The stabilizer of a marked point of a polygon", "多边形上所标点的稳定子"],
    [
      "The orbit-stabilizer theorem says that the size of a group equals the size of an orbit times the size of a stabilizer. The symmetry group of a regular polygon with $n$ sides has $2n$ elements. A point on no mirror line has a stabilizer of size one, a point on one mirror line has size two, and the center is fixed by all.",
      "轨道-稳定子定理说，群的大小等于轨道大小乘以稳定子大小。正 $n$ 边形的对称群有 $2n$ 个元素。不在任何镜像线上的点，稳定子大小为一；在一条镜像线上的点，大小为二；中心被所有元素固定。",
    ],
    (rng) => {
      const n = rng.int(3, 8);
      const at = ring(n, 88);
      const kind = rng.pick(["vertex", "midpoint", "center", "generic"] as const);
      const i = rng.int(0, n - 1);
      const [a, b] = [at[i] as Point, at[(i + 1) % n] as Point];
      const spot: Point =
        kind === "vertex"
          ? a
          : kind === "midpoint"
            ? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
            : kind === "center"
              ? [160, 110]
              : [Math.round(160 + 0.5 * (a[0] - 160) + 0.2 * (b[0] - 160)), Math.round(110 + 0.5 * (a[1] - 110) + 0.2 * (b[1] - 110))];
      const stabilizer = kind === "center" ? 2 * n : kind === "generic" ? 1 : 2;
      const orbit = (2 * n) / stabilizer;
      const seen: Pair =
        kind === "center"
          ? ["The point is the center, which every symmetry fixes", "这个点是中心，每个对称都固定它"]
          : kind === "generic"
            ? ["The point lies on no mirror line, so only the identity fixes it", "这个点不在任何镜像线上，所以只有恒等变换固定它"]
            : [
                "The point lies on exactly one mirror line, so the identity and that one reflection fix it",
                "这个点恰好在一条镜像线上，所以恒等变换和这个反射固定它",
              ];
      const body = `<polygon points="${at.map((p) => p.join(",")).join(" ")}" fill="none"/><circle class="accent" cx="${spot[0]}" cy="${spot[1]}" r="6" fill="currentColor" stroke="none"/>`;
      return ask(
        [
          "The symmetry group of the regular polygon acts on its points. How many symmetries fix the marked point?",
          "正多边形的对称群作用在它的点上。有多少个对称固定所标的点？",
        ],
        stabilizer,
        [orbit, 2 * n === stabilizer ? 1 : 2 * n, n === stabilizer ? n + 1 : n],
        [
          `${seen[0]}, so the stabilizer has size $${stabilizer}$. The orbit then has size $${orbit}$, and the product is the group size $${2 * n}$, as the theorem requires.`,
          `${seen[1]}，所以稳定子大小为 $${stabilizer}$。于是轨道大小为 $${orbit}$，二者之积是群的大小 $${2 * n}$，符合定理。`,
        ],
        {
          svg: svgDocument(220, body),
          alt: t(`A regular polygon with ${n} sides. ${observed(seen)[0]}.`, `正 ${n} 边形。${observed(seen)[1]}。`),
        },
      );
    },
  ),
  figure: algebraDrawings2["the-orbit-stabilizer-theorem#the-stabilizer-of-a-marked-point-of-a-polygon"],
};

const symmetryCount = {
  ...point(
    "counting-the-symmetries-of-a-drawn-figure",
    ["Counting the symmetries of a drawn figure", "数图形的对称"],
    [
      "The symmetry group of a plane figure holds all the rotations and reflections that map it onto itself, including the identity. Count the rotations first and then the mirror lines. A regular polygon has both kinds in equal number. A pinwheel has rotations and no mirror lines, because its blades lean one way around the center.",
      "平面图形的对称群包含把它映到自身的所有旋转和反射，包括恒等变换。先数旋转，再数镜像线。正多边形两种一样多。风车有旋转但没有镜像线，因为叶片朝一个方向绕中心倾斜。",
    ],
    (rng) => {
      const scale = rng.pick([0.7, 0.85, 1]);
      const c: Point = [160, 110];
      const rot = (pts: readonly Point[]) => pts.map(([x, y]): Point => [Math.round(c[0] + scale * x), Math.round(c[1] + scale * y)]);
      const poly = (pts: readonly Point[]) =>
        `<polygon class="accent" stroke="currentColor" fill="none" points="${rot(pts)
          .map((p) => p.join(","))
          .join(" ")}"/>`;
      const regular = (n: number): { body: string; count: number; clue: Pair } => ({
        body: poly(ring(n, 90, 0, 0)),
        count: 2 * n,
        clue: [
          `a regular polygon with ${n} sides, with ${n} rotations and ${n} mirror lines`,
          `正 ${n} 边形，有 ${n} 个旋转和 ${n} 条镜像线`,
        ],
      });
      const pinwheel = (n: number): { body: string; count: number; clue: Pair } => {
        let body = "";
        for (let i = 0; i < n; i++) {
          const a = (2 * Math.PI * i) / n - Math.PI / 2;
          const pts: Point[] = [
            [0, 0],
            [90 * Math.cos(a), 90 * Math.sin(a)],
            [55 * Math.cos(a + 0.5), 55 * Math.sin(a + 0.5)],
          ];
          body += poly(pts);
        }
        return {
          body,
          count: n,
          clue: [
            `a pinwheel with ${n} blades, with ${n} rotations and no mirror lines`,
            `有 ${n} 个叶片的风车，有 ${n} 个旋转，没有镜像线`,
          ],
        };
      };
      const shapes: { body: string; count: number; clue: Pair }[] = [
        ...[3, 4, 5, 6, 8].map(regular),
        ...[3, 4, 5, 6].map(pinwheel),
        {
          body: poly([
            [-110, -55],
            [110, -55],
            [110, 55],
            [-110, 55],
          ]),
          count: 4,
          clue: ["a rectangle, with two rotations and two mirror lines", "矩形，有两个旋转和两条镜像线"],
        },
        {
          body: poly([
            [-110, 50],
            [50, 50],
            [110, -50],
            [-50, -50],
          ]),
          count: 2,
          clue: ["a parallelogram, with two rotations and no mirror lines", "平行四边形，有两个旋转，没有镜像线"],
        },
        {
          body: poly([
            [0, -90],
            [60, 0],
            [0, 90],
            [-60, 0],
          ]),
          count: 4,
          clue: ["a rhombus, with two rotations and two mirror lines", "菱形，有两个旋转和两条镜像线"],
        },
        {
          body: poly([
            [0, -90],
            [55, 80],
            [-55, 80],
          ]),
          count: 2,
          clue: ["an isosceles triangle, with only the identity rotation and one mirror line", "等腰三角形，只有恒等旋转和一条镜像线"],
        },
      ];
      const shape = rng.pick(shapes);
      return ask(
        [
          "How many symmetries, counting rotations, reflections and the identity, does the figure have?",
          "这个图形有多少个对称？旋转、反射和恒等变换都要算。",
        ],
        shape.count,
        [shape.count - 1, 2 * shape.count, shape.count + 1],
        [
          `The figure is ${shape.clue[0]}. Adding these together, and remembering that the identity is one of the rotations, gives $${shape.count}$.`,
          `这个图形是${shape.clue[1]}。把它们加起来，并注意恒等变换是一个旋转，得到 $${shape.count}$。`,
        ],
        {
          svg: svgDocument(220, shape.body),
          alt: t(`A figure: ${shape.clue[0].split(",")[0]}.`, `一个图形：${shape.clue[1].split("，")[0]}。`),
        },
      );
    },
  ),
  figure: algebraDrawings1["the-symmetry-group-of-a-figure#counting-the-symmetries-of-a-drawn-figure"],
};

const necklace = {
  ...point(
    "rotations-that-fix-a-drawn-necklace",
    ["Rotations that fix a drawn necklace", "固定图中项链的旋转"],
    [
      "The stabilizer of a colored necklace in the rotation group is the set of rotations that leave the colors in place. If the color pattern repeats every $p$ beads, then only rotations by multiples of $p$ steps fix it. So the stabilizer has size $n / p$, and the orbit of the necklace has size $p$.",
      "在旋转群中，彩色项链的稳定子是使颜色不变的旋转组成的集合。如果颜色模式每 $p$ 颗珠子重复一次，那么只有转动 $p$ 的倍数步才能固定它。所以稳定子大小为 $n / p$，项链的轨道大小为 $p$。",
    ],
    (rng) => {
      const n = rng.pick([6, 8, 9, 10, 12]);
      const p = rng.pick(divisors(n).filter((d) => d > 1));
      const base = Array.from({ length: p }, () => rng.bool());
      base[0] = true;
      base[p - 1] = false;
      // A shorter period would change the answer, so it is computed from the beads themselves.
      const beads = Array.from({ length: n }, (_, i) => base[i % p] as boolean);
      const period = divisors(n).find((d) => beads.every((b, i) => b === beads[(i + d) % n])) as number;
      const stabilizer = n / period;
      const at = ring(n, 85);
      const body = `${at.map((q, i) => `<circle class="accent" cx="${q[0]}" cy="${q[1]}" r="11" stroke="currentColor" fill="${beads[i] ? "currentColor" : "none"}"/>`).join("")}`;
      return ask(
        [
          "The necklace has beads of two colors, and the group of rotations of the ring acts on it. How many rotations, counting the identity, leave the colors in place?",
          "项链上有两种颜色的珠子，圆环的旋转群作用在它上面。有多少个旋转使颜色不变？恒等变换也要算。",
        ],
        stabilizer,
        [
          period === stabilizer ? stabilizer + 1 : period,
          n,
          beads.filter((b) => b).length === stabilizer ? stabilizer + 2 : beads.filter((b) => b).length,
        ],
        [
          `The color pattern repeats every $${period}$ beads and no sooner, so only rotations by multiples of $${period}$ steps preserve it. Among the $${n}$ rotations, that makes $${stabilizer}$.`,
          `颜色模式每 $${period}$ 颗珠子重复一次，且没有更短的周期，所以只有转动 $${period}$ 的倍数步才能保持它。在 $${n}$ 个旋转中，这样的有 $${stabilizer}$ 个。`,
        ],
        {
          svg: svgDocument(220, body),
          alt: t(
            `A ring of ${n} beads, going around: ${beads.map((b) => (b ? "filled" : "hollow")).join(", ")}.`,
            `${n} 颗珠子组成的环，依次为：${beads.map((b) => (b ? "实心" : "空心")).join("、")}。`,
          ),
        },
      );
    },
  ),
  figure: algebraDrawings2["stabilizers#rotations-that-fix-a-drawn-necklace"],
};

const kernelArrows = point(
  "the-kernel-from-an-arrow-diagram",
  ["The kernel from an arrow diagram", "由箭头图读核"],
  [
    "The kernel of a group homomorphism is the set of elements that map to the identity. In an arrow diagram from one group to another, these are exactly the points whose arrows end at the identity element of the target. Every point of the target that is reached is reached by the same number of arrows, namely the size of the kernel.",
    "群同态的核是映到单位元的元素组成的集合。在从一个群到另一个群的箭头图中，它们恰好是箭头终点为目标群单位元的那些点。目标群中被到达的每一点，都被同样多的箭头到达，这个数就是核的大小。",
  ],
  (rng) => {
    const [m, n] = rng.pick<Point>([
      [4, 2],
      [4, 4],
      [6, 2],
      [6, 3],
      [6, 6],
      [8, 2],
      [8, 4],
      [8, 8],
      [6, 4],
      [8, 6],
      [4, 6],
      [4, 8],
      [3, 6],
      [2, 8],
    ]);
    const k = rng.pick(Array.from({ length: n - 1 }, (_, i) => i + 1).filter((c) => (c * m) % n === 0));
    const image = (x: number) => (k * x) % n;
    const kernel = Array.from({ length: m }, (_, x) => x).filter((x) => image(x) === 0);
    const left = Array.from({ length: m }, (_, i): Point => [70, 110 + (i - (m - 1) / 2) * 26]);
    const right = Array.from({ length: n }, (_, i): Point => [250, 110 + (i - (n - 1) / 2) * 26]);
    let body = "";
    left.forEach((p, x) => {
      body += arrowLine(p, right[image(x)] as Point, 14, true);
    });
    body += left.map((p, x) => node(p, String(x))).join("") + right.map((p, y) => node(p, String(y))).join("");
    const imageSize = m / kernel.length;
    return ask(
      [
        `The arrows show a homomorphism from the integers modulo $${m}$ on the left to the integers modulo $${n}$ on the right. How many elements are in its kernel?`,
        `箭头表示从左边模 $${m}$ 的整数到右边模 $${n}$ 的整数的同态。它的核有多少个元素？`,
      ],
      kernel.length,
      [imageSize === kernel.length ? kernel.length + 1 : imageSize, m === kernel.length ? kernel.length + 2 : m, kernel.length + 1],
      [
        `The arrows ending at $0$ on the right start at $${kernel.join(", ")}$ on the left, so the kernel has $${kernel.length}$ elements.`,
        `终点是右边 $0$ 的箭头从左边的 $${kernel.join(", ")}$ 出发，所以核有 $${kernel.length}$ 个元素。`,
      ],
      {
        svg: svgDocument(220, body),
        alt: t(
          `Arrows from the integers modulo ${m} to the integers modulo ${n}: ${left.map((_, x) => `${x} to ${image(x)}`).join(", ")}.`,
          `从模 ${m} 整数到模 ${n} 整数的箭头：${left.map((_, x) => `${x} 到 ${image(x)}`).join("、")}。`,
        ),
      },
    );
  },
);

/** deeperFiguresAbstractAlgebraPoints adds knowledge points of Abstract Algebra that are answered by reading a drawing. */
export const deeperFiguresAbstractAlgebraPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "cyclic-subgroups": [orderFromArrows],
  "generators-of-cyclic-groups": [cyclesOfArrows],
  "cosets-of-the-additive-groups-of-integers-modulo-n": [cosetOnRing],
  "lagranges-theorem": [indexInLattice],
  "properties-of-cyclic-groups": [shapeOfLattice],
  "quotient-groups": [aboveInLattice],
  "generating-sets": [dihedralWalk],
  "converting-between-permutations-and-cycles": [cycleFromArrows],
  "the-inverse-of-a-permutation": [inverseFromArrows],
  transpositions: [transpositionCount],
  "the-orbit-stabilizer-theorem": [orbitStabilizer],
  "the-symmetry-group-of-a-figure": [symmetryCount],
  stabilizers: [necklace],
  "the-kernel-of-a-group-homomorphism": [kernelArrows],
};
