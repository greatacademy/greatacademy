// Knowledge points of Abstract Algebra that ask the learner to read a drawing: Cayley graphs, subgroup lattices, arrow
// diagrams of permutations and symmetric figures. See `deeperFiguresAbstractAlgebraPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { gcd, svgDocument } from "@ga/subject-math";
import { algebraDrawings1 } from "../explanation-drawings-abstract-algebra-1.ts";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { numberProblem } from "../problems.ts";
import { ask, choose, divisors, observed, type Pair, point, same } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { arrowLine, node, ring } from "./figure-reading-more.ts";

/** asPair turns a text into a pair, so that a walked solution can go where a pair is expected. */
const asPair = (x: Text): Pair => [x.en, x["zh-CN"]];

/** said pairs a typical wrong answer with what is wrong about it. */
const said = (value: number, en: string, zh: string) => ({ value, why: t(en, zh) });

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
      "In the Cayley graph of the integers modulo $n$, each arrow adds the same element $g$. The order of $g$ is the number of steps along arrows needed to get back to the start. Follow the arrows from $0$ and count them. The result always divides $n$, and it equals $n$ divided by the greatest common divisor of $n$ and $g$.\n\nFor example, in the integers modulo $8$ with $g = 2$, the arrows run $0 \\to 2 \\to 4 \\to 6 \\to 0$. That is $4$ steps, so the order of $2$ is $4$, and indeed $\\frac{8}{\\gcd(8, 2)} = \\frac{8}{2} = 4$.\n\nCheck: $4 \\cdot 2 = 8$, which is $0$ modulo $8$, while $2$, $2 \\cdot 2 = 4$ and $3 \\cdot 2 = 6$ are not.\n\n> **Watch out.** The order is the number of arrows on the way back to $0$, not the element $g$ on the first arrow and not the number of points $n$.",
      "在模 $n$ 整数的凯莱图中，每个箭头都加上同一个元素 $g$。$g$ 的阶是沿箭头回到起点所需的步数。从 $0$ 出发沿箭头走并计数。结果总是整除 $n$，并且等于 $n$ 除以 $n$ 与 $g$ 的最大公约数。\n\n例如，在模 $8$ 整数中取 $g = 2$，箭头依次为 $0 \\to 2 \\to 4 \\to 6 \\to 0$。共 $4$ 步，所以 $2$ 的阶是 $4$，确实 $\\frac{8}{\\gcd(8, 2)} = \\frac{8}{2} = 4$。\n\n检验：$4 \\cdot 2 = 8$，模 $8$ 为 $0$；而 $2$、$2 \\cdot 2 = 4$、$3 \\cdot 2 = 6$ 都不是 $0$。\n\n> **注意。** 阶是回到 $0$ 途中经过的箭头数，既不是第一个箭头上的元素 $g$，也不是点的个数 $n$。",
    ],
    (rng) => {
      const explained = (n: number, g: number) =>
        [
          said(
            g,
            `$${g}$ is the element on each arrow, read from the arrow out of $0$; the order counts the arrows back to $0$.`,
            `$${g}$ 是每个箭头所加的元素，由从 $0$ 出发的箭头读出；阶数的是回到 $0$ 的箭头个数。`,
          ),
          said(
            n,
            `$${n}$ is the number of points; the walk from $0$ comes back sooner because $\\gcd(${n}, ${g}) > 1$.`,
            `$${n}$ 是点的个数；因为 $\\gcd(${n}, ${g}) > 1$，从 $0$ 出发的行走会更早回来。`,
          ),
          said(
            gcd(n, g),
            `This is $\\gcd(${n}, ${g})$ itself; the order is $${n}$ divided by it.`,
            `这是 $\\gcd(${n}, ${g})$ 本身；阶是 $${n}$ 除以它。`,
          ),
          said(
            n - g,
            `This is the inverse $-${g} = ${n - g}$, which follows the arrows backward; it is an element, not a count of steps.`,
            `这是逆元 $-${g} = ${n - g}$，相当于逆着箭头走；它是一个元素，而不是步数。`,
          ),
        ].filter((m) => m.value !== n / gcd(n, g));
      let n: number;
      let g: number;
      // Draw again when fewer than two typical mistakes differ from the order.
      do {
        n = rng.pick([5, 6, 7, 8, 9, 10, 12]);
        g = rng.int(1, n - 1);
      } while (new Set(explained(n, g).map((m) => m.value)).size < 2);
      const order = n / gcd(n, g);
      const seen = new Set<number>();
      const mistakes = explained(n, g).filter((m) => !seen.has(m.value) && Boolean(seen.add(m.value)));
      const walk = [...Array.from({ length: order }, (_, i) => (i * g) % n), 0].join(" \\to ");
      return {
        ...numberProblem({
          prompt: t(
            `The drawing shows the integers modulo $${n}$, and each arrow adds the same element $g$. What is the order of $g$?`,
            `图中是模 $${n}$ 的整数，每个箭头都加上同一个元素 $g$。$g$ 的阶是多少？`,
          ),
          answer: order,
          form: "integer",
          mistakes,
          solution: walked(
            [
              [
                ["Read the element", "读出元素"],
                t(`The arrow out of $0$ points to $${g}$, so $g = ${g}$.`, `从 $0$ 出发的箭头指向 $${g}$，所以 $g = ${g}$。`),
              ],
              [["Follow the arrows", "沿箭头走"], t(`From $0$ the arrows run $${walk}$.`, `从 $0$ 出发，箭头依次为 $${walk}$。`)],
              [
                ["Count the steps", "数步数"],
                t(`That is $${order}$ steps, so the order of $${g}$ is $${order}$.`, `共 $${order}$ 步，所以 $${g}$ 的阶是 $${order}$。`),
              ],
            ],
            t(
              `$${n} \\div \\gcd(${n}, ${g}) = ${n} \\div ${gcd(n, g)} = ${order}$, the same count.`,
              `$${n} \\div \\gcd(${n}, ${g}) = ${n} \\div ${gcd(n, g)} = ${order}$，与所数的一致。`,
            ),
          ),
        }),
        figure: {
          svg: additionGraph(n, g),
          alt: t(
            `The integers modulo ${n} in a ring, with an arrow from each x to x + ${g}.`,
            `模 ${n} 的整数排成一圈，每个 x 都有箭头指向 x + ${g}。`,
          ),
        },
      };
    },
  ),
  figure: algebraDrawings1["cyclic-subgroups#the-order-of-an-element-from-its-arrows"],
};

const cyclesOfArrows = {
  ...point(
    "the-separate-cycles-of-an-addition-graph",
    ["The separate cycles of an addition graph", "加法图中的分离圈"],
    [
      "An element generates the whole group of integers modulo $n$ exactly when its arrows form a single cycle through every point. If the arrows split into several separate cycles, the element generates only a proper subgroup, whose cosets are those cycles. The number of cycles is the greatest common divisor of $n$ and the element.\n\nFor example, in the integers modulo $12$, adding $5$ gives one cycle through all $12$ points, since $\\gcd(12, 5) = 1$. Adding $3$ gives the $3$ cycles $0 \\to 3 \\to 6 \\to 9$, $1 \\to 4 \\to 7 \\to 10$ and $2 \\to 5 \\to 8 \\to 11$, since $\\gcd(12, 3) = 3$.\n\nCheck: the $3$ cycles have $4$ points each, and $3 \\cdot 4 = 12$ uses every point exactly once.\n\n> **Watch out.** The number of cycles is $\\gcd(n, g)$, while the length of each cycle is $n$ divided by it: do not report the length as the count.",
      "一个元素生成模 $n$ 整数的整个群，当且仅当它的箭头构成经过每一点的单个圈。如果箭头分成几个分离的圈，这个元素只生成真子群，这些圈就是它的陪集。圈的个数是 $n$ 与该元素的最大公约数。\n\n例如，在模 $12$ 整数中，加 $5$ 得到经过全部 $12$ 个点的一个圈，因为 $\\gcd(12, 5) = 1$。加 $3$ 得到 $3$ 个圈 $0 \\to 3 \\to 6 \\to 9$、$1 \\to 4 \\to 7 \\to 10$ 和 $2 \\to 5 \\to 8 \\to 11$，因为 $\\gcd(12, 3) = 3$。\n\n检验：这 $3$ 个圈各有 $4$ 个点，$3 \\cdot 4 = 12$，每个点恰好用了一次。\n\n> **注意。** 圈的个数是 $\\gcd(n, g)$，而每个圈的长度是 $n$ 除以它：不要把长度当成个数。",
    ],
    (rng) => {
      const explained = (n: number, g: number) =>
        [
          said(
            n / gcd(n, g),
            `$${n / gcd(n, g)}$ is the number of points on each cycle, not the number of cycles.`,
            `$${n / gcd(n, g)}$ 是每个圈上的点数，而不是圈的个数。`,
          ),
          said(
            g,
            `$${g}$ is the element added by each arrow; the number of cycles is $\\gcd(${n}, ${g})$.`,
            `$${g}$ 是每个箭头所加的元素；圈的个数是 $\\gcd(${n}, ${g})$。`,
          ),
          said(
            1,
            `A single cycle would mean $${g}$ generates the group, but the cycle through $0$ reaches only the multiples of $${gcd(n, g)}$.`,
            `只有一个圈意味着 $${g}$ 生成整个群，但经过 $0$ 的圈只到达 $${gcd(n, g)}$ 的倍数。`,
          ),
          said(
            n,
            `$${n}$ counts the points or the arrows, not the separate cycles they form.`,
            `$${n}$ 是点数或箭头数，而不是它们构成的分离圈的个数。`,
          ),
        ].filter((m) => m.value !== gcd(n, g));
      let n: number;
      let g: number;
      // Draw again when fewer than two typical mistakes differ from the count.
      do {
        n = rng.pick([6, 8, 9, 10, 12]);
        g = rng.int(1, n - 1);
      } while (new Set(explained(n, g).map((m) => m.value)).size < 2);
      const d = gcd(n, g);
      const seen = new Set<number>();
      const mistakes = explained(n, g).filter((m) => !seen.has(m.value) && Boolean(seen.add(m.value)));
      const length = n / d;
      const first = Array.from({ length }, (_, i) => (i * g) % n).join(" \\to ");
      return {
        ...numberProblem({
          prompt: t(
            "Each arrow adds the same element $g$ to a point. Into how many separate cycles do the arrows split the points?",
            "每个箭头都给一个点加上同一个元素 $g$。箭头把这些点分成多少个分离的圈？",
          ),
          answer: d,
          form: "integer",
          mistakes,
          solution: walked(
            [
              [
                ["Read the element", "读出元素"],
                t(`The arrow out of $0$ points to $${g}$, so $g = ${g}$.`, `从 $0$ 出发的箭头指向 $${g}$，所以 $g = ${g}$。`),
              ],
              [
                ["Follow the cycle through 0", "沿经过 0 的圈走"],
                t(
                  `From $0$ the arrows run $${first}$ and back to $0$, which is $${length}$ of the $${n}$ points.`,
                  `从 $0$ 出发，箭头依次为 $${first}$，再回到 $0$，经过 $${n}$ 个点中的 $${length}$ 个。`,
                ),
              ],
              [
                ["Count the cycles", "数圈数"],
                d === 1
                  ? t(
                      `The cycle already passes every point, so there is $1$ cycle and $${g}$ generates the group.`,
                      `这个圈已经经过每一点，所以只有 $1$ 个圈，$${g}$ 生成这个群。`,
                    )
                  : t(
                      `Every cycle has $${length}$ points, so the $${n}$ points split into $${n} \\div ${length} = ${d}$ cycles.`,
                      `每个圈有 $${length}$ 个点，所以 $${n}$ 个点分成 $${n} \\div ${length} = ${d}$ 个圈。`,
                    ),
              ],
            ],
            t(`$\\gcd(${n}, ${g}) = ${d}$, the same count.`, `$\\gcd(${n}, ${g}) = ${d}$，与所数的一致。`),
          ),
        }),
        figure: {
          svg: additionGraph(n, g),
          alt: t(
            `The integers modulo ${n} in a ring, with an arrow from each x to x + ${g}.`,
            `模 ${n} 的整数排成一圈，每个 x 都有箭头指向 x + ${g}。`,
          ),
        },
      };
    },
  ),
  figure: algebraDrawings1["generators-of-cyclic-groups#the-separate-cycles-of-an-addition-graph"],
};

const cosetOnRing = point(
  "a-coset-on-a-drawn-ring",
  ["A coset on a drawn ring", "图中圆环上的陪集"],
  [
    "A coset $x + H$ of a subgroup $H$ of the integers modulo $n$ is $H$ turned around the ring by $x$ steps. So the coset has the same size and spacing as $H$, and it contains $x$. It either equals $H$ or shares no point with it, and the cosets together cover the whole ring.\n\nOn a ring of $20$ points with $H = \\{0, 5, 10, 15\\}$ circled, turning by $3$ gives $3 + H = \\{3, 8, 13, 18\\}$: still $4$ points, still $5$ apart.\n\nCheck: $18 + 5 = 23 \\equiv 3 \\pmod{20}$, so one more step of $5$ comes back to the start, and none of $3, 8, 13, 18$ is circled.\n\n> **Watch out.** A coset keeps the spacing of $H$: $3 + H$ is not the run $\\{3, 4, 5, 6\\}$ of neighbors of $3$.",
    "模 $n$ 整数的子群 $H$ 的陪集 $x + H$，就是把 $H$ 沿圆环转动 $x$ 步。所以陪集与 $H$ 大小和间隔相同，并且包含 $x$。它要么等于 $H$，要么与 $H$ 没有公共点，所有陪集合起来覆盖整个圆环。\n\n在 $20$ 个点的圆环上圈出 $H = \\{0, 5, 10, 15\\}$，转动 $3$ 步得 $3 + H = \\{3, 8, 13, 18\\}$：仍是 $4$ 个点，间隔仍为 $5$。\n\n检验：$18 + 5 = 23 \\equiv 3 \\pmod{20}$，所以再走一步 $5$ 就回到起点，而 $3, 8, 13, 18$ 都没有被圈出。\n\n> **注意。** 陪集保持 $H$ 的间隔：$3 + H$ 不是 $3$ 的一串相邻点 $\\{3, 4, 5, 6\\}$。",
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
    const wrongStride = step === 2 ? 1 : step - 1;
    const reasons: Reason[] = [
      [
        set(0)[0],
        "That is $H$ itself, the circled points; the coset is turned away from them.",
        "那是 $H$ 本身，即圈出的点；陪集是把它们转开后得到的。",
      ],
      [set(x + 1)[0], `That turns $H$ by $${x + 1}$ steps, one too many.`, `那是把 $H$ 转动 $${x + 1}$ 步，多转了一步。`],
      [
        set(0, wrongStride)[0],
        `Those points are spaced $${wrongStride}$ apart, but the circled points are $${step}$ apart.`,
        `这些点的间隔是 $${wrongStride}$，而圈出的点间隔为 $${step}$。`,
      ],
      [
        set(x, wrongStride)[0],
        `That starts at $${x}$ but uses spacing $${wrongStride}$ instead of $${step}$.`,
        `那从 $${x}$ 开始，但间隔用的是 $${wrongStride}$ 而不是 $${step}$。`,
      ],
      [set(x + 2)[0], `That turns $H$ by $${x + 2}$ steps, two too many.`, `那是把 $H$ 转动 $${x + 2}$ 步，多转了两步。`],
    ];
    return reasoned(
      choose(
        rng,
        [
          `The circled points form a subgroup $H$ of the integers modulo $${n}$. What is the coset $${x} + H$?`,
          `圈出的点构成模 $${n}$ 整数的子群 $H$。陪集 $${x} + H$ 是什么？`,
        ],
        set(x),
        [set(0), set(x + 1), set(0, wrongStride), set(x, wrongStride), set(x + 2)],
        asPair(
          walked(
            [
              [
                ["Read the subgroup", "读出子群"],
                t(`The circled points are $${H.join(", ")}$, spaced $${step}$ apart.`, `圈出的点是 $${H.join(", ")}$，间隔为 $${step}$。`),
              ],
              [
                ["Turn the ring", "转动圆环"],
                t(
                  `Turning them by $${x}$ steps keeps this spacing and moves $0$ to $${x}$, which gives $${set(x)[0].slice(1, -1)}$.`,
                  `把它们转动 $${x}$ 步，保持这一间隔并把 $0$ 移到 $${x}$，得 $${set(x)[0].slice(1, -1)}$。`,
                ),
              ],
            ],
            t(
              `The coset has $${size}$ points like $H$, contains $${x}$, and shares none with $H$, since $${x}$ is not a multiple of $${step}$.`,
              `陪集与 $H$ 一样有 $${size}$ 个点，包含 $${x}$，且与 $H$ 没有公共点，因为 $${x}$ 不是 $${step}$ 的倍数。`,
            ),
          ),
        ),
        {
          svg,
          alt: t(
            `The integers modulo ${n} in a ring, with ${H.join(", ")} circled.`,
            `模 ${n} 的整数排成一圈，其中 ${H.join("，")} 被圈出。`,
          ),
        },
      ),
      reasons,
    );
  },
);

const lattices = [8, 12, 16, 18, 20, 24, 27, 28, 30, 36, 42];

const indexInLattice = point(
  "the-index-from-a-subgroup-lattice",
  ["The index from a subgroup lattice", "由子群格读指数"],
  [
    "A subgroup lattice shows the subgroups as nodes, with lines going upward from each to the slightly larger ones that contain it. The top node is the whole group. By Lagrange's theorem, the index of a subgroup is the order of the group divided by the order of the subgroup, so the two labels give it directly.\n\nIn the lattice of $\\mathbb{Z}_{60}$, the node labeled $6$ has index $\\frac{60}{6} = 10$, although only two lines lead up from it to the top, through $12$ or through $30$.\n\nCheck: $10 \\cdot 6 = 60$, so the $10$ cosets of $6$ elements each fill the group.\n\n> **Watch out.** The index is not the number of lines up to the top, and not the label of the node: read the two orders and divide.",
    "子群格用节点表示子群，从每个节点向上连线到包含它的稍大子群。最上面的节点是整个群。由拉格朗日定理，子群的指数等于群的阶除以子群的阶，所以两个标记直接给出它。\n\n在 $\\mathbb{Z}_{60}$ 的子群格中，标有 $6$ 的节点的指数是 $\\frac{60}{6} = 10$，尽管从它到顶端只有两条线，经过 $12$ 或经过 $30$。\n\n检验：$10 \\cdot 6 = 60$，所以 $10$ 个各有 $6$ 个元素的陪集正好填满整个群。\n\n> **注意。** 指数不是到顶端的线的条数，也不是节点上的标记：要读出两个阶再相除。",
  ],
  (rng) => {
    const n = rng.pick(lattices);
    const d = rng.pick(divisors(n).filter((v) => v < n));
    const mistakes = [
      said(d, "That is the order of the circled subgroup, not its index.", "那是圈出的子群的阶，不是它的指数。"),
      said(n, "That is the order of the whole group, the label at the top.", "那是整个群的阶，即顶端的标记。"),
      said(n - d, "The index is a quotient of the two orders, not their difference.", "指数是两个阶的商，不是它们的差。"),
    ].filter((m, i, all) => m.value !== n / d && all.findIndex((o) => o.value === m.value) === i);
    return {
      ...numberProblem({
        prompt: t(
          "The drawing shows the subgroup lattice of a cyclic group, each node labeled by the order of the subgroup. What is the index of the circled subgroup in the whole group?",
          "图中是某循环群的子群格，每个节点标有子群的阶。圈出的子群在整个群中的指数是多少？",
        ),
        answer: n / d,
        mistakes,
        solution: walked(
          [
            [
              ["Read the two orders", "读出两个阶"],
              t(
                `The top node shows that the group has order $${n}$, and the circled subgroup has order $${d}$.`,
                `最上面的节点说明群的阶是 $${n}$，圈出的子群的阶是 $${d}$。`,
              ),
            ],
            [["Divide", "相除"], t(`The index is $\\frac{${n}}{${d}} = ${n / d}$.`, `指数是 $\\frac{${n}}{${d}} = ${n / d}$。`)],
          ],
          d === 1
            ? t(
                `The trivial subgroup has cosets of one element each, and there are $${n}$ of them.`,
                `平凡子群的每个陪集只有一个元素，共有 $${n}$ 个陪集。`,
              )
            : t(`$${n / d} \\cdot ${d} = ${n}$, so the cosets fill the group.`, `$${n / d} \\cdot ${d} = ${n}$，所以陪集正好填满整个群。`),
        ),
      }),
      figure: {
        svg: latticeFigure(n, true, [d]),
        alt: t(
          `The lattice of subgroups of orders ${divisors(n).join(", ")}, with the subgroup of order ${d} circled.`,
          `阶为 ${divisors(n).join("，")} 的子群的格，阶为 ${d} 的子群被圈出。`,
        ),
      },
    };
  },
);

/** latticeShape describes the shape of the lattice of divisors of m, from the exponents of its prime factors. */
function latticeShape(m: number): Pair {
  const exponents: number[] = [];
  let rest = m;
  for (let p = 2; p <= rest; p++) {
    let e = 0;
    while (rest % p === 0) {
      rest /= p;
      e++;
    }
    if (e > 0) exponents.push(e);
  }
  const key = exponents.sort((a, b) => b - a).join(",");
  const count = divisors(m).length;
  if (exponents.length === 1) return [`a chain of ${count} nodes`, `${count} 个节点的链`];
  const named: Record<string, Pair> = {
    "1,1": ["a diamond of four nodes", "四个节点的菱形"],
    "2,1": ["two rows of three nodes", "两列各三个节点"],
    "3,1": ["two rows of four nodes", "两列各四个节点"],
    "2,2": ["a three-by-three grid of nine nodes", "九个节点的三乘三方阵"],
    "1,1,1": ["the eight corners of a cube", "立方体的八个顶点"],
  };
  return named[key] ?? [`a lattice of ${count} nodes`, `${count} 个节点的格`];
}

const shapeOfLattice = point(
  "the-group-from-the-shape-of-its-lattice",
  ["The group from the shape of its lattice", "由格的形状判断群"],
  [
    "The subgroups of a cyclic group of order $n$ correspond exactly to the divisors of $n$. So the lattice has the same shape as the divisors under division. A prime power gives a single chain, a product of two primes gives a diamond, and a product of three different primes gives the corners of a cube.\n\nFor example, $12 = 2^2 \\cdot 3$ has the divisors $1, 2, 4$ and $3, 6, 12$. They form two rows of three nodes, each row a chain by factors of $2$, with every node joined to the one $3$ times as large. So the lattice of $\\mathbb{Z}_{12}$ has that shape.\n\nCheck: the number of nodes is the number of divisors, $(2 + 1)(1 + 1) = 6$, which matches the $6$ divisors listed.\n\n> **Watch out.** The number of nodes alone does not decide the group: $\\mathbb{Z}_{8}$ and $\\mathbb{Z}_{6}$ both have $4$ subgroups, but one lattice is a chain and the other a diamond.",
    "$n$ 阶循环群的子群恰好对应 $n$ 的因数。所以子群格与因数按整除排列的形状相同。素数幂给出一条链，两个素数之积给出菱形，三个不同素数之积给出立方体的顶点。\n\n例如，$12 = 2^2 \\cdot 3$ 的因数是 $1, 2, 4$ 和 $3, 6, 12$。它们排成两列各三个节点，每列按因子 $2$ 成链，每个节点都与它的 $3$ 倍相连。所以 $\\mathbb{Z}_{12}$ 的子群格就是这个形状。\n\n检验：节点数就是因数的个数 $(2 + 1)(1 + 1) = 6$，与列出的 $6$ 个因数一致。\n\n> **注意。** 只看节点个数不能确定群：$\\mathbb{Z}_{8}$ 和 $\\mathbb{Z}_{6}$ 都有 $4$ 个子群，但一个的格是链，另一个是菱形。",
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
    const wrong = rng.sample(shape.wrong, 3);
    const reasons: Reason[] = wrong.map((m) => [
      z(m)[0],
      `The subgroups of $\\mathbb{Z}_{${m}}$ match the $${divisors(m).length}$ divisors of $${m}$, which form ${latticeShape(m)[0]}, not the shape drawn.`,
      `$\\mathbb{Z}_{${m}}$ 的子群对应 $${m}$ 的 $${divisors(m).length}$ 个因数，它们构成${latticeShape(m)[1]}，不是图中的形状。`,
    ]);
    const factors = divisors(n);
    return reasoned(
      choose(
        rng,
        [
          "The subgroup lattice of a cyclic group is drawn without labels. Which group could it be?",
          "图中是某循环群的子群格，没有标记。它可能是哪个群？",
        ],
        z(n),
        wrong.map(z),
        asPair(
          walked(
            [
              [["Read the shape", "读出形状"], t(`The lattice is ${shape.clue[0]}.`, `这个格是${shape.clue[1]}。`)],
              [
                ["Match the divisors", "对应因数"],
                t(
                  `The divisors of $${n}$ are $${factors.join(", ")}$, and under division they form ${latticeShape(n)[0]}, so the group can be $\\mathbb{Z}_{${n}}$.`,
                  `$${n}$ 的因数是 $${factors.join(", ")}$，按整除排列构成${latticeShape(n)[1]}，所以这个群可以是 $\\mathbb{Z}_{${n}}$。`,
                ),
              ],
            ],
            t(
              `The drawing has $${factors.length}$ nodes, one for each of the $${factors.length}$ divisors of $${n}$.`,
              `图中有 $${factors.length}$ 个节点，对应 $${n}$ 的 $${factors.length}$ 个因数。`,
            ),
          ),
        ),
        {
          svg: latticeFigure(n, false),
          alt: t(`An unlabeled lattice: ${observed(shape.clue)[0]}.`, `没有标记的格：${observed(shape.clue)[1]}。`),
        },
      ),
      reasons,
    );
  },
);

const aboveInLattice = point(
  "subgroups-of-a-quotient-from-the-lattice",
  ["Subgroups of a quotient from the lattice", "由格读商群的子群"],
  [
    "The correspondence theorem says that the subgroups of the quotient $G/N$ match the subgroups of $G$ that contain $N$. In a lattice, these are the node of $N$ and all the nodes that can be reached from it by going upward along lines. Nodes on another branch do not contain $N$, even when they are higher in the picture.\n\nIn the lattice of $\\mathbb{Z}_{60}$ with the node $6$ circled, going upward reaches $6, 12, 30, 60$, so $\\mathbb{Z}_{60}/N$ has $4$ subgroups. The node $20$ sits higher than $6$ but on another branch, and $6$ does not divide $20$.\n\nCheck: $\\mathbb{Z}_{60}/N$ is cyclic of order $\\frac{60}{6} = 10$, and $10$ has the $4$ divisors $1, 2, 5, 10$.\n\n> **Watch out.** Count $N$ itself, which matches the trivial subgroup of $G/N$, and leave out every node that cannot be reached by going up from $N$.",
    "对应定理说，商群 $G/N$ 的子群与 $G$ 中包含 $N$ 的子群一一对应。在格中，这些就是 $N$ 的节点，以及从它沿线向上能到达的所有节点。其他分支上的节点不包含 $N$，即使它们在图中位置更高。\n\n在 $\\mathbb{Z}_{60}$ 的子群格中圈出节点 $6$，向上能到达 $6, 12, 30, 60$，所以 $\\mathbb{Z}_{60}/N$ 有 $4$ 个子群。节点 $20$ 比 $6$ 高，但在另一个分支上，而 $6$ 不整除 $20$。\n\n检验：$\\mathbb{Z}_{60}/N$ 是 $\\frac{60}{6} = 10$ 阶循环群，$10$ 有 $1, 2, 5, 10$ 这 $4$ 个因数。\n\n> **注意。** 要算上 $N$ 本身，它对应 $G/N$ 的平凡子群；从 $N$ 向上到达不了的节点都不算。",
  ],
  (rng) => {
    const n = rng.pick(lattices);
    const d = rng.pick(divisors(n).filter((v) => v < n));
    const above = divisors(n).filter((v) => v % d === 0);
    const mistakes = [
      said(
        divisors(n).length,
        "That counts every subgroup of $G$, including those that do not contain $N$.",
        "那数的是 $G$ 的所有子群，包括不含 $N$ 的。",
      ),
      said(
        above.length - 1,
        "That leaves out $N$ itself, which matches the trivial subgroup of $G/N$.",
        "那漏掉了 $N$ 本身，它对应 $G/N$ 的平凡子群。",
      ),
      said(n / d, "That is the order of $G/N$; count its subgroups instead.", "那是 $G/N$ 的阶；应数它的子群。"),
    ].filter((m, i, all) => m.value !== above.length && all.findIndex((o) => o.value === m.value) === i);
    return {
      ...numberProblem({
        prompt: t(
          "The drawing shows the subgroup lattice of a cyclic group $G$, each node labeled by order, with a subgroup $N$ circled. How many subgroups does the quotient $G/N$ have?",
          "图中是循环群 $G$ 的子群格，每个节点标有阶，子群 $N$ 被圈出。商群 $G/N$ 有多少个子群？",
        ),
        answer: above.length,
        mistakes,
        solution: walked(
          [
            [
              ["Use the correspondence theorem", "用对应定理"],
              t("The subgroups of the quotient match the subgroups of $G$ that contain $N$.", "商群的子群对应 $G$ 中包含 $N$ 的子群。"),
            ],
            [
              ["Go up from the circled node", "从圈出的节点向上"],
              t(
                `Going upward reaches the orders $${above.join(", ")}$, counting $N$ itself, which makes $${above.length}$.`,
                `向上到达阶为 $${above.join(", ")}$ 的子群，包括 $N$ 本身，共 $${above.length}$ 个。`,
              ),
            ],
          ],
          t(
            `$G/N$ is cyclic of order $\\frac{${n}}{${d}} = ${n / d}$, and $${n / d}$ has the $${above.length}$ divisors $${divisors(n / d).join(", ")}$.`,
            `$G/N$ 是 $\\frac{${n}}{${d}} = ${n / d}$ 阶循环群，$${n / d}$ 有 $${divisors(n / d).join(", ")}$ 这 $${above.length}$ 个因数。`,
          ),
        ),
      }),
      figure: {
        svg: latticeFigure(n, true, [d]),
        alt: t(
          `The lattice of subgroups of orders ${divisors(n).join(", ")}, with the subgroup of order ${d} circled.`,
          `阶为 ${divisors(n).join("，")} 的子群的格，阶为 ${d} 的子群被圈出。`,
        ),
      },
    };
  },
);

const dihedralWalk = {
  ...point(
    "a-walk-on-a-dihedral-cayley-graph",
    ["A walk on a dihedral Cayley graph", "二面体群凯莱图上的行走"],
    [
      "A Cayley graph for the generating set of a rotation $r$ and a reflection $s$ has one kind of edge for each generator. A word in the generators is a walk: each letter says which kind of edge to follow from the current point. In the dihedral group, the rotation arrows run in opposite directions on the two rings.\n\nFor example, in the Cayley graph of $D_4$, read the word $r, s, r$ from $e$. The rotation arrow on the outer ring leads to $r$, the reflection edge leads down to $rs$, and the rotation arrow on the inner ring leads on to $s$. So the walk ends at $s$, which says $rsr = s$.\n\nCheck: in $D_4$, $sr = r^{-1}s$, so $rsr = r(sr) = rr^{-1}s = s$.\n\n> **Watch out.** On the inner ring, follow that ring's own arrows, which run the other way: going the same way as on the outer ring gives the wrong end.",
      "由旋转 $r$ 和反射 $s$ 组成的生成集的凯莱图，每个生成元对应一种边。生成元组成的字就是一次行走：每个字母说明从当前点沿哪种边走。在二面体群中，两个环上的旋转箭头方向相反。\n\n例如，在 $D_4$ 的凯莱图中，从 $e$ 出发读字 $r, s, r$。外环上的旋转箭头通向 $r$，反射边向下通向 $rs$，内环上的旋转箭头再通向 $s$。所以行走在 $s$ 结束，这说明 $rsr = s$。\n\n检验：在 $D_4$ 中 $sr = r^{-1}s$，所以 $rsr = r(sr) = rr^{-1}s = s$。\n\n> **注意。** 在内环上要沿内环自己的箭头走，它们方向相反：按外环的方向走会得到错误的终点。",
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
      const start = rng.int(0, n - 1);
      const startName = outerName(start);
      // walkOf lists the points visited, following the inner arrows backward when `same` and every arrow backward when `against`.
      const walkOf = (edges: readonly boolean[], mode: "right" | "same" | "against") => {
        let [index, onOuter] = [start, true];
        const visited = [startName];
        for (const useR of edges) {
          if (useR) {
            const forward = mode === "same" || onOuter ? 1 : -1;
            index = (index + (mode === "against" ? -forward : forward) + n) % n;
          } else onOuter = !onOuter;
          visited.push(onOuter ? outerName(index) : innerName(index));
        }
        return visited;
      };
      const path = walkOf(word, "right");
      const finish = path[path.length - 1] as string;
      const route = path.join(" \\to ");
      const steps: Pair = [word.map((w) => (w ? "solid" : "dashed")).join(", "), word.map((w) => (w ? "实线" : "虚线")).join("，")];
      const typical: [string, string, string][] = [
        [
          walkOf(word, "same").at(-1) as string,
          "This is where the walk ends if the arrows on the inner ring are taken to run the same way as on the outer ring; they run the opposite way.",
          "这是把内环的箭头当成与外环同向时的终点；其实内环箭头方向相反。",
        ],
        [
          walkOf(word, "against").at(-1) as string,
          "This is where the walk ends going against the arrows; each solid edge is followed in the direction of its arrow.",
          "这是逆着箭头走的终点；每条实线都要沿箭头方向走。",
        ],
        [
          path[path.length - 2] as string,
          "This is where the walk stands before the last edge, which still has to be followed.",
          "这是走最后一条边之前所在的点，最后一条边还要走。",
        ],
      ];
      const chosen = typical.filter(([v], i) => v !== finish && typical.findIndex(([x]) => x === v) === i).slice(0, 3);
      const used = new Set([finish, ...chosen.map(([v]) => v)]);
      const fill = rng.sample(
        names.filter((v) => !used.has(v)),
        3 - chosen.length,
      );
      const reasons: Reason[] = [
        ...chosen.map(([v, en, zh]): Reason => [`$${v}$`, en, zh]),
        ...fill.map(
          (v): Reason => [
            `$${v}$`,
            `Following the edges in order from $${startName}$ gives the walk $${route}$, which does not end at $${v}$.`,
            `从 $${startName}$ 按顺序沿边走得到 $${route}$，终点不是 $${v}$。`,
          ],
        ),
      ];
      const crossings = word.filter((w) => !w).length;
      return reasoned(
        choose(
          rng,
          [
            `Solid arrows apply the rotation and dashed lines apply the reflection. Starting at $${startName}$, follow these edges in order: ${steps[0]}. Where does the walk end?`,
            `实线箭头表示旋转，虚线表示反射。从 $${startName}$ 出发，依次沿这些边走：${steps[1]}。行走在哪里结束？`,
          ],
          same(finish),
          [...chosen.map(([v]) => v), ...fill].map((v) => same(v)),
          asPair(
            walked(
              [
                [
                  ["Follow the edges", "沿边走"],
                  t(
                    `From $${startName}$, follow each solid arrow in its own direction on its ring and cross rings on each dashed line: $${route}$.`,
                    `从 $${startName}$ 出发，实线沿所在环的箭头方向走，虚线换环：$${route}$。`,
                  ),
                ],
                [["Read the end", "读出终点"], t(`The walk ends at $${finish}$.`, `行走在 $${finish}$ 结束。`)],
              ],
              t(
                `The walk crosses $${crossings}$ dashed ${crossings === 1 ? "line" : "lines"}, an ${crossings % 2 === 0 ? "even" : "odd"} number, so it ends on the ${crossings % 2 === 0 ? "outer" : "inner"} ring, where $${finish}$ is.`,
                `行走经过 $${crossings}$ 条虚线，是${crossings % 2 === 0 ? "偶" : "奇"}数，所以终点在${crossings % 2 === 0 ? "外" : "内"}环上，$${finish}$ 正在那里。`,
              ),
            ),
          ),
          {
            svg: svgDocument(220, body),
            alt: t(
              `A dihedral Cayley graph with two rings of ${n} points each, joined by dashed lines; the rings have arrows in opposite directions.`,
              `二面体群的凯莱图，两个环各有 ${n} 个点，由虚线连接；两个环的箭头方向相反。`,
            ),
          },
        ),
        reasons,
      );
    },
  ),
  figure: algebraDrawings1["generating-sets#a-walk-on-a-dihedral-cayley-graph"],
};

const cycleFromArrows = point(
  "cycle-notation-from-an-arrow-diagram",
  ["Cycle notation from an arrow diagram", "由箭头图写轮换记法"],
  [
    "To write a permutation in cycles from a diagram of arrows, start at a point and follow arrows until they return, writing the points in the order visited. Then start again from a point not yet used. Points with no arrow are fixed, and they are left out. The direction of the arrows matters, since reversing them gives the inverse.\n\nFor arrows $1 \\to 3$, $3 \\to 1$, $2 \\to 4$, $4 \\to 5$ and $5 \\to 2$: from $1$ the arrows go $1 \\to 3 \\to 1$, giving $(1\\;3)$, and from $2$, the lowest point not yet used, they go $2 \\to 4 \\to 5 \\to 2$, giving $(2\\;4\\;5)$. The permutation is $(1\\;3)(2\\;4\\;5)$.\n\nCheck: every point with an arrow appears exactly once, and reading the cycles back gives the arrows, for example $4$ is followed by $5$ in $(2\\;4\\;5)$, as the arrow $4 \\to 5$ says.\n\n> **Watch out.** Follow each arrow from its tail to its head. Reading them backward gives $(1\\;3)(2\\;5\\;4)$, the inverse.",
    "要从箭头图写出置换的轮换形式，从一点出发沿箭头走直到回来，按到达顺序写下各点。然后从还没用过的点再开始。没有箭头的点是不动点，略去不写。箭头方向很重要，因为反向就得到逆置换。\n\n对箭头 $1 \\to 3$、$3 \\to 1$、$2 \\to 4$、$4 \\to 5$、$5 \\to 2$：从 $1$ 出发得 $1 \\to 3 \\to 1$，即 $(1\\;3)$；再从还没用过的最小点 $2$ 出发得 $2 \\to 4 \\to 5 \\to 2$，即 $(2\\;4\\;5)$。这个置换是 $(1\\;3)(2\\;4\\;5)$。\n\n检验：每个有箭头的点恰好出现一次，并且由轮换可以读回箭头，例如在 $(2\\;4\\;5)$ 中 $4$ 后面是 $5$，与箭头 $4 \\to 5$ 一致。\n\n> **注意。** 每个箭头要从尾走到头。反着读得到 $(1\\;3)(2\\;5\\;4)$，那是逆置换。",
  ],
  (rng) => {
    const n = rng.int(4, 7);
    const perm = randomPerm(rng, n);
    const inverse = [...perm];
    perm.forEach((v, i) => {
      inverse[v] = i;
    });
    const right = cycleText(perm);
    const moved = perm.map((v, i) => i).filter((i) => perm[i] !== i);
    const cycles: number[][] = [];
    const used = new Set<number>();
    for (const start of moved) {
      if (used.has(start)) continue;
      const cycle: number[] = [];
      for (let x = start; !used.has(x); x = perm[x] as number) {
        used.add(x);
        cycle.push(x + 1);
      }
      cycles.push(cycle);
    }
    // A single cycle read off wrongly, written in the canonical form so that it never repeats the right answer in disguise.
    const asCycle = (list: readonly number[]) => {
      const p = Array.from({ length: n }, (_, i) => i);
      list.forEach((x, i) => {
        p[x] = list[(i + 1) % list.length] as number;
      });
      return cycleText(p);
    };
    const typical: Reason[] = [
      [
        `$${cycleText(inverse)}$`,
        "This follows each arrow backward, from head to tail, which gives the inverse.",
        "这是把每个箭头从头到尾反着走，得到的是逆置换。",
      ],
      [
        `$${cycleText(perm.map((v) => perm[v] as number))}$`,
        "This follows two arrows at each step, which gives the square of the permutation.",
        "这是每一步走两个箭头，得到的是置换的平方。",
      ],
      [
        `$${asCycle(moved)}$`,
        "This lists the moved points in increasing order instead of following the arrows.",
        "这是把移动的点按从小到大的顺序列出，而没有沿箭头走。",
      ],
      [
        `$${asCycle(perm)}$`,
        "This writes the images of $1, 2, 3, \\dots$ in a row as one cycle, but that row is the bottom of the two-line notation, not a cycle.",
        "这是把 $1, 2, 3, \\dots$ 的像排成一行当作一个轮换，但那一行是两行记法的下行，而不是轮换。",
      ],
    ];
    const fill = [cycleText(randomPerm(rng, n)), cycleText(randomPerm(rng, n)), cycleText(randomPerm(rng, n))].map(
      (c): Reason => [
        `$${c}$`,
        `Following the arrows from each unused point gives $${right}$, not this.`,
        `从每个未用的点出发沿箭头走，得到的是 $${right}$，不是这个。`,
      ],
    );
    const reasons = [...typical, ...fill].filter(([o], i, all) => o !== `$${right}$` && all.findIndex(([x]) => x === o) === i);
    return reasoned(
      choose(
        rng,
        [
          "Each arrow goes from a point to its image under a permutation, and a point with no arrow is fixed. What is the permutation in cycle notation?",
          "每个箭头从一点指向它在置换下的像，没有箭头的点是不动点。这个置换的轮换记法是什么？",
        ],
        same(right),
        reasons.slice(0, 4).map(([o]) => [o, o] as Pair),
        asPair(
          walked(
            [
              ...cycles.map(
                (cycle, i): Step => [
                  i === 0 ? ["Start at the lowest moved point", "从最小的移动点出发"] : ["Start again", "再出发"],
                  t(
                    `From $${cycle[0]}$ the arrows go $${[...cycle, cycle[0]].join(" \\to ")}$, giving $(${cycle.join("\\;")})$.`,
                    `从 $${cycle[0]}$ 出发，箭头依次为 $${[...cycle, cycle[0]].join(" \\to ")}$，得 $(${cycle.join("\\;")})$。`,
                  ),
                ],
              ),
              [
                ["Write the product", "写成乘积"],
                t(`Leaving out fixed points, the permutation is $${right}$.`, `略去不动点，这个置换是 $${right}$。`),
              ],
            ],
            cycles.length === 1
              ? t(
                  `The cycle has length $${moved.length}$, the number of points with an arrow, so each moved point appears exactly once.`,
                  `这个轮换的长度 $${moved.length}$ 等于有箭头的点数，所以每个移动的点恰好出现一次。`,
                )
              : t(
                  `The cycles have lengths adding to $${cycles.map((c) => c.length).join(" + ")} = ${moved.length}$, the number of points with an arrow, so each moved point appears exactly once.`,
                  `各轮换的长度之和 $${cycles.map((c) => c.length).join(" + ")} = ${moved.length}$ 等于有箭头的点数，所以每个移动的点恰好出现一次。`,
                ),
          ),
        ),
        { svg: permFigure(perm), alt: t(`A permutation that sends ${permAlt(perm)}.`, `一个置换，把 ${permAltZh(perm)}。`) },
      ),
      reasons,
    );
  },
);

const inverseFromArrows = point(
  "the-inverse-from-an-arrow-diagram",
  ["The inverse from an arrow diagram", "由箭头图读逆置换"],
  [
    "The inverse of a permutation undoes it, so it reverses every arrow. To find the image of a point under the inverse, look for the arrow that ends at that point and read where it starts. A common slip is to follow the arrow out of the point, which gives the permutation and not its inverse.\n\nFor arrows $1 \\to 4$, $4 \\to 2$, $2 \\to 1$, $3 \\to 5$ and $5 \\to 3$: the arrow that ends at $4$ starts at $1$, so $\\sigma^{-1}(4) = 1$.\n\nCheck: $\\sigma(1) = 4$, by the arrow $1 \\to 4$, so applying $\\sigma^{-1}$ after $\\sigma$ brings $1$ back to $1$.\n\n> **Watch out.** The arrow out of $4$ ends at $2$, but that gives $\\sigma(4) = 2$, not $\\sigma^{-1}(4)$.",
    "置换的逆撤销它，所以把每个箭头反向。要求一点在逆置换下的像，就找到终点是这一点的箭头，读它的起点。常见错误是沿从这一点出发的箭头走，这得到的是置换本身而不是它的逆。\n\n对箭头 $1 \\to 4$、$4 \\to 2$、$2 \\to 1$、$3 \\to 5$、$5 \\to 3$：终点是 $4$ 的箭头从 $1$ 出发，所以 $\\sigma^{-1}(4) = 1$。\n\n检验：由箭头 $1 \\to 4$ 得 $\\sigma(1) = 4$，所以先作用 $\\sigma$ 再作用 $\\sigma^{-1}$，$1$ 回到 $1$。\n\n> **注意。** 从 $4$ 出发的箭头指向 $2$，但那给出的是 $\\sigma(4) = 2$，而不是 $\\sigma^{-1}(4)$。",
  ],
  (rng) => {
    for (;;) {
      const n = rng.int(5, 8);
      const perm = randomPerm(rng, n);
      const moved = perm.map((_, i) => i).filter((i) => perm[i] !== i);
      const k = rng.pick(moved);
      const source = perm.indexOf(k);
      const image = perm[k] as number;
      const back = perm.indexOf(source);
      const seen = new Set<number>([source + 1]);
      const mistakes = [
        said(
          image + 1,
          `This follows the arrow out of $${k + 1}$, which gives $\\sigma(${k + 1})$, not the inverse.`,
          `这是沿从 $${k + 1}$ 出发的箭头走，得到的是 $\\sigma(${k + 1})$，而不是逆。`,
        ),
        said(
          k + 1,
          `$${k + 1}$ has an arrow into it from another point, so it is not fixed by $\\sigma^{-1}$.`,
          `有箭头从别的点指向 $${k + 1}$，所以它不是 $\\sigma^{-1}$ 的不动点。`,
        ),
        said(
          back + 1,
          `This steps back along two arrows, which gives $\\sigma^{-2}(${k + 1})$; the inverse steps back along one.`,
          `这是逆着走了两个箭头，得到 $\\sigma^{-2}(${k + 1})$；逆只逆着走一个箭头。`,
        ),
      ].filter((m) => !seen.has(m.value) && Boolean(seen.add(m.value)));
      if (mistakes.length < 2) continue;
      return {
        ...numberProblem({
          prompt: t(
            `Each arrow goes from a point to its image under a permutation $\\sigma$, and a point with no arrow is fixed. What is $\\sigma^{-1}(${k + 1})$?`,
            `每个箭头从一点指向它在置换 $\\sigma$ 下的像，没有箭头的点是不动点。$\\sigma^{-1}(${k + 1})$ 是多少？`,
          ),
          answer: source + 1,
          form: "integer",
          mistakes,
          solution: walked(
            [
              [
                ["Find the arrow into the point", "找指向这一点的箭头"],
                t(
                  `The arrow that ends at $${k + 1}$ is $${source + 1} \\to ${k + 1}$.`,
                  `终点是 $${k + 1}$ 的箭头是 $${source + 1} \\to ${k + 1}$。`,
                ),
              ],
              [
                ["Read its start", "读它的起点"],
                t(
                  `So $\\sigma(${source + 1}) = ${k + 1}$, and the inverse sends $${k + 1}$ back to $${source + 1}$: $\\sigma^{-1}(${k + 1}) = ${source + 1}$.`,
                  `所以 $\\sigma(${source + 1}) = ${k + 1}$，逆置换把 $${k + 1}$ 送回 $${source + 1}$：$\\sigma^{-1}(${k + 1}) = ${source + 1}$。`,
                ),
              ],
            ],
            t(
              `$\\sigma(\\sigma^{-1}(${k + 1})) = \\sigma(${source + 1}) = ${k + 1}$, by the arrow out of $${source + 1}$.`,
              `由从 $${source + 1}$ 出发的箭头，$\\sigma(\\sigma^{-1}(${k + 1})) = \\sigma(${source + 1}) = ${k + 1}$。`,
            ),
          ),
        }),
        figure: { svg: permFigure(perm), alt: t(`A permutation that sends ${permAlt(perm)}.`, `一个置换，把 ${permAltZh(perm)}。`) },
      };
    }
  },
);

const transpositionCount = point(
  "the-fewest-transpositions-for-a-drawing",
  ["The fewest transpositions for a drawing", "图中置换所需最少对换"],
  [
    "A cycle of length $k$ can be written with $k - 1$ transpositions, and no fewer. So the fewest transpositions for a permutation is the sum of $k - 1$ over its cycles, which equals the number of points minus the number of cycles, with fixed points counted as cycles of length one. The diagram shows the cycles directly.\n\nFor arrows $1 \\to 2$, $2 \\to 3$, $3 \\to 1$, $4 \\to 5$ and $5 \\to 4$ on $6$ points, with $6$ fixed: the cycles are $(1\\;2\\;3)$, $(4\\;5)$ and the fixed point $6$, so $3$ cycles on $6$ points, and the fewest transpositions is $6 - 3 = 3$.\n\nCheck: $(1\\;2\\;3) = (1\\;3)(1\\;2)$ uses $2$ and $(4\\;5)$ uses $1$, which makes $2 + 1 = 3$.\n\n> **Watch out.** Count the fixed point as a cycle in $n$ minus the number of cycles. Leaving it out gives $6 - 2 = 4$, one too many.",
    "长度为 $k$ 的轮换可以写成 $k - 1$ 个对换，不能更少。所以一个置换所需的最少对换数是各轮换的 $k - 1$ 之和，等于点数减去轮换数，不动点算作长度为一的轮换。箭头图直接显示轮换。\n\n对 $6$ 个点上的箭头 $1 \\to 2$、$2 \\to 3$、$3 \\to 1$、$4 \\to 5$、$5 \\to 4$，$6$ 不动：轮换是 $(1\\;2\\;3)$、$(4\\;5)$ 和不动点 $6$，即 $6$ 个点上有 $3$ 个轮换，最少对换数是 $6 - 3 = 3$。\n\n检验：$(1\\;2\\;3) = (1\\;3)(1\\;2)$ 用 $2$ 个，$(4\\;5)$ 用 $1$ 个，共 $2 + 1 = 3$ 个。\n\n> **注意。** 在点数减轮换数中，不动点要算作一个轮换。漏掉它会得到 $6 - 2 = 4$，多了一个。",
  ],
  (rng) => {
    for (;;) {
      const n = rng.int(5, 8);
      const perm = randomPerm(rng, n);
      const c = cycleCount(perm);
      const answer = n - c;
      const fixed = perm.filter((v, i) => v === i).length;
      const movedCount = n - fixed;
      const long = c - fixed;
      const seen = new Set<number>([answer]);
      const mistakes = [
        said(
          movedCount,
          "This counts the moved points, but a cycle of length $k$ needs only $k - 1$ transpositions.",
          "这数的是移动的点，但长度为 $k$ 的轮换只需要 $k - 1$ 个对换。",
        ),
        said(c, "This is the number of cycles, not the number of transpositions.", "这是轮换的个数，不是对换的个数。"),
        said(n, "This is the number of points; each cycle saves one transposition.", "这是点的个数；每个轮换都省掉一个对换。"),
        said(
          long,
          "This counts one transposition per cycle, but a cycle of length $k$ needs $k - 1$.",
          "这是每个轮换算一个对换，但长度为 $k$ 的轮换需要 $k - 1$ 个。",
        ),
      ].filter((m) => !seen.has(m.value) && Boolean(seen.add(m.value)));
      if (mistakes.length < 2) continue;
      const lengths: number[] = [];
      const used = new Set<number>();
      perm.forEach((_, start) => {
        if (used.has(start) || perm[start] === start) return;
        let size = 0;
        for (let x = start; !used.has(x); x = perm[x] as number) {
          used.add(x);
          size++;
        }
        lengths.push(size);
      });
      return {
        ...numberProblem({
          prompt: t(
            "Each arrow goes from a point to its image under a permutation, and a point with no arrow is fixed. What is the fewest transpositions whose product is this permutation?",
            "每个箭头从一点指向它在置换下的像，没有箭头的点是不动点。这个置换最少能写成多少个对换的积？",
          ),
          answer,
          form: "integer",
          mistakes,
          solution: walked(
            [
              [
                ["Read the cycles", "读出轮换"],
                c === 1
                  ? t(`The arrows form one cycle through all $${n}$ points.`, `箭头构成经过全部 $${n}$ 个点的一个轮换。`)
                  : t(
                      `The arrows form ${lengths.length === 1 ? "a cycle of length" : "cycles of lengths"} ${lengths.join(", ")}${fixed > 0 ? `, and ${fixed} fixed ${fixed === 1 ? "point" : "points"}` : ""}: $${c}$ cycles on $${n}$ points, counting fixed points.`,
                      `箭头构成长度为 ${lengths.join("、")} 的轮换${fixed > 0 ? `，还有 ${fixed} 个不动点` : ""}：$${n}$ 个点上共 $${c}$ 个轮换，不动点也算。`,
                    ),
              ],
              [
                ["Subtract", "相减"],
                t(`The fewest transpositions is $${n} - ${c} = ${answer}$.`, `最少对换数是 $${n} - ${c} = ${answer}$。`),
              ],
            ],
            t(
              `Adding $k - 1$ over the cycles that move points gives $${lengths.map((k) => `(${k} - 1)`).join(" + ")} = ${answer}$, the same.`,
              `对移动点的轮换求 $k - 1$ 之和，得 $${lengths.map((k) => `(${k} - 1)`).join(" + ")} = ${answer}$，结果一致。`,
            ),
          ),
        }),
        figure: { svg: permFigure(perm), alt: t(`A permutation that sends ${permAlt(perm)}.`, `一个置换，把 ${permAltZh(perm)}。`) },
      };
    }
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
      "The symmetry group of a plane figure holds all the rotations and reflections that map it onto itself, including the identity. Count the rotations first and then the mirror lines. A regular polygon has both kinds in equal number. A pinwheel has rotations and no mirror lines, because its blades lean one way around the center.\n\nFor the square drawn: the turns by $0^\\circ$, $90^\\circ$, $180^\\circ$ and $270^\\circ$ give $4$ rotations, and the $4$ dashed mirror lines give $4$ reflections, so $4 + 4 = 8$ symmetries. The pinwheel beside it has the same $4$ rotations and no mirror line, so $4 + 0 = 4$.\n\nCheck: a symmetry of the square can send one corner to any of the $4$ corners and then keep or swap its two sides, which gives $4 \\cdot 2 = 8$.\n\n> **Watch out.** The identity is one of the rotations, so do not leave it out, and do not count a reflection for a pinwheel: mirroring a blade makes it lean the other way.",
      "平面图形的对称群包含把它映到自身的所有旋转和反射，包括恒等变换。先数旋转，再数镜像线。正多边形两种一样多。风车有旋转但没有镜像线，因为叶片朝一个方向绕中心倾斜。\n\n对图中的正方形：转 $0^\\circ$、$90^\\circ$、$180^\\circ$、$270^\\circ$ 给出 $4$ 个旋转，$4$ 条虚线镜像线给出 $4$ 个反射，共 $4 + 4 = 8$ 个对称。旁边的风车有同样的 $4$ 个旋转，没有镜像线，共 $4 + 0 = 4$ 个。\n\n检验：正方形的一个对称可以把某个顶点送到 $4$ 个顶点中的任何一个，然后保持或交换它的两条边，共 $4 \\cdot 2 = 8$ 种。\n\n> **注意。** 恒等变换是一个旋转，不要漏掉；风车也不要算反射：把叶片镜像后，它会朝另一个方向倾斜。",
    ],
    (rng) => {
      const scale = rng.pick([0.7, 0.85, 1]);
      const c: Point = [160, 110];
      const rot = (pts: readonly Point[]) => pts.map(([x, y]): Point => [Math.round(c[0] + scale * x), Math.round(c[1] + scale * y)]);
      const poly = (pts: readonly Point[]) =>
        `<polygon class="accent" stroke="currentColor" fill="none" points="${rot(pts)
          .map((p) => p.join(","))
          .join(" ")}"/>`;
      // rot counts the rotations, and extra holds a typical wrong count that belongs to this shape alone.
      type Shape = { body: string; count: number; rot: number; clue: Pair; extra?: readonly [number, string, string] };
      const regular = (n: number): Shape => ({
        body: poly(ring(n, 90, 0, 0)),
        count: 2 * n,
        rot: n,
        clue: [
          `a regular polygon with ${n} sides, with ${n} rotations and ${n} mirror lines`,
          `正 ${n} 边形，有 ${n} 个旋转和 ${n} 条镜像线`,
        ],
      });
      const pinwheel = (n: number): Shape => {
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
          rot: n,
          clue: [
            `a pinwheel with ${n} blades, with ${n} rotations and no mirror lines`,
            `有 ${n} 个叶片的风车，有 ${n} 个旋转，没有镜像线`,
          ],
        };
      };
      const shapes: Shape[] = [
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
          rot: 2,
          clue: ["a rectangle, with two rotations and two mirror lines", "矩形，有两个旋转和两条镜像线"],
          extra: [
            8,
            "That is the count for a square; the sides of a rectangle differ, so quarter-turns and the diagonals do not map it onto itself.",
            "那是正方形的个数；矩形的长和宽不同，所以转四分之一周和沿对角线反射都不能把它映到自身。",
          ],
        },
        {
          body: poly([
            [-110, 50],
            [50, 50],
            [110, -50],
            [-50, -50],
          ]),
          count: 2,
          rot: 2,
          clue: ["a parallelogram, with two rotations and no mirror lines", "平行四边形，有两个旋转，没有镜像线"],
          extra: [
            6,
            "That adds two mirror lines through the middles of the sides, but folding a slanted parallelogram along them does not match its halves.",
            "那加上了过对边中点的两条镜像线，但沿这些线折叠斜的平行四边形，两半并不重合。",
          ],
        },
        {
          body: poly([
            [0, -90],
            [60, 0],
            [0, 90],
            [-60, 0],
          ]),
          count: 4,
          rot: 2,
          clue: ["a rhombus, with two rotations and two mirror lines", "菱形，有两个旋转和两条镜像线"],
          extra: [
            8,
            "That is the count for a square; the diagonals of a rhombus differ, so quarter-turns do not map it onto itself.",
            "那是正方形的个数；菱形的两条对角线不同，所以转四分之一周不能把它映到自身。",
          ],
        },
        {
          body: poly([
            [0, -90],
            [55, 80],
            [-55, 80],
          ]),
          count: 2,
          rot: 1,
          clue: ["an isosceles triangle, with only the identity rotation and one mirror line", "等腰三角形，只有恒等旋转和一条镜像线"],
          extra: [
            3,
            "That adds a half-turn, but turning the triangle upside down does not map it onto itself.",
            "那加上了半周旋转，但把三角形倒过来并不能映到自身。",
          ],
        },
      ];
      const shape = rng.pick(shapes);
      const mirrors = shape.count - shape.rot;
      const seen = new Set<number>([shape.count]);
      const mistakes = [
        said(shape.count - 1, "That leaves out the identity, which is one of the rotations.", "那漏掉了恒等变换，它是一个旋转。"),
        ...(mirrors > 0
          ? [
              said(
                shape.rot,
                `That counts only the rotations; the $${mirrors}$ mirror ${mirrors === 1 ? "line gives a reflection" : "lines give reflections"} too.`,
                `那只数了旋转；$${mirrors}$ 条镜像线还给出反射。`,
              ),
            ]
          : [
              said(
                2 * shape.rot,
                "That counts mirror lines as for a regular polygon, but this figure has none: reflecting it does not match it.",
                "那像正多边形一样数了镜像线，但这个图形没有镜像线：反射后不重合。",
              ),
            ]),
        ...(shape.extra ? [said(...shape.extra)] : []),
      ].filter((m) => !seen.has(m.value) && Boolean(seen.add(m.value)));
      return {
        ...numberProblem({
          prompt: t(
            "How many symmetries, counting rotations, reflections and the identity, does the figure have?",
            "这个图形有多少个对称？旋转、反射和恒等变换都要算。",
          ),
          answer: shape.count,
          form: "integer",
          mistakes,
          solution: walked(
            [
              [["Name the figure", "认出图形"], t(`The figure is ${shape.clue[0]}.`, `这个图形是${shape.clue[1]}。`)],
              [
                ["Add", "相加"],
                t(
                  `Counting the identity as a rotation, $${shape.rot} + ${mirrors} = ${shape.count}$.`,
                  `把恒等变换算作一个旋转，$${shape.rot} + ${mirrors} = ${shape.count}$。`,
                ),
              ],
            ],
            mirrors > 0
              ? t(
                  `Following one reflection by each rotation gives every reflection, so there are as many reflections as rotations: $2 \\cdot ${shape.rot} = ${shape.count}$.`,
                  `一个反射分别接上每个旋转就得到全部反射，所以反射与旋转一样多：$2 \\cdot ${shape.rot} = ${shape.count}$。`,
                )
              : t(
                  `With no mirror line the symmetries are just the rotations, $${shape.count}$ of them, one for each position the figure can be turned into.`,
                  `没有镜像线时，对称就是旋转，共 $${shape.count}$ 个，每个对应图形能转到的一个位置。`,
                ),
          ),
        }),
        figure: {
          svg: svgDocument(220, shape.body),
          alt: t(`A figure: ${shape.clue[0].split(",")[0]}.`, `一个图形：${shape.clue[1].split("，")[0]}。`),
        },
      };
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
