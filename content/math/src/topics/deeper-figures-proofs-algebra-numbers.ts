// Knowledge points of Methods of Proof, Abstract Algebra and Number Theory that ask the learner to read a drawing: two-set
// diagrams, number lines, residue clocks, operation tables, permutation diagrams, necklaces, power cycles, and the graphs
// of number-theoretic functions. See `deeperFiguresProofsAlgebraNumbersPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { chart, intTicks } from "./figure-charts.ts";
import { arrowLine, drawn, label, node, ring } from "./figure-reading-more.ts";

/** figureOf pairs a drawing with its description in both languages. */
const figureOf = (svg: string, [en, zh]: Pair) => ({ svg, alt: t(en, zh) });

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const mod = (a: number, n: number) => ((a % n) + n) % n;

// Two-set diagrams.

type Region = "onlyA" | "both" | "onlyB" | "out";

const regionPaths: Readonly<Record<Region, string>> = {
  both: "M160 53.8 A65 65 0 0 1 160 156.2 A65 65 0 0 1 160 53.8Z",
  onlyA: "M160 53.8 A65 65 0 1 0 160 156.2 A65 65 0 0 1 160 53.8Z",
  onlyB: "M160 53.8 A65 65 0 1 1 160 156.2 A65 65 0 0 0 160 53.8Z",
  out: "M20 14H300V196H20Z M160 53.8 A65 65 0 1 0 160 156.2 A65 65 0 1 0 160 53.8Z",
};

/** vennTwo draws two overlapping sets inside a box, with the given regions shaded. */
function vennTwo(names: readonly [string, string], shaded: readonly Region[]): string {
  const fill = shaded
    .map((r) => `<path class="accent" d="${regionPaths[r]}" fill="currentColor" fill-opacity="0.3" fill-rule="evenodd" stroke="none"/>`)
    .join("");
  return svgDocument(
    210,
    `${fill}<rect x="20" y="14" width="280" height="182"/><circle cx="120" cy="105" r="65"/><circle cx="200" cy="105" r="65"/>${label(70, 34, names[0])}${label(250, 34, names[1])}`,
  );
}

const regionNames: Readonly<Record<Region, Pair>> = {
  onlyA: ["only the first set", "只属于第一个集合的部分"],
  both: ["the overlap", "重叠部分"],
  onlyB: ["only the second set", "只属于第二个集合的部分"],
  out: ["outside both sets", "两个集合之外的部分"],
};

/** vennAlt describes which regions of a two-set diagram are shaded. */
const vennAlt = (names: readonly [string, string], shaded: readonly Region[]): Pair => [
  `Two overlapping sets, ${names[0]} on the left and ${names[1]} on the right, inside a box. Shaded: ${shaded.map((r) => regionNames[r][0]).join(", ")}.`,
  `方框内两个重叠的集合，左边是 ${names[0]}，右边是 ${names[1]}。阴影：${shaded.map((r) => regionNames[r][1]).join("、")}。`,
];

const NAME_PAIRS: readonly (readonly [string, string])[] = [
  ["A", "B"],
  ["P", "Q"],
  ["S", "T"],
  ["X", "Y"],
  ["M", "N"],
  ["C", "D"],
  ["E", "F"],
  ["G", "H"],
  ["R", "U"],
  ["V", "W"],
];

/** namesOf chooses the names of two sets, in either order. */
const namesOf = (rng: Rng): readonly [string, string] => {
  const [a, b] = rng.pick(NAME_PAIRS);
  return rng.bool() ? [a, b] : [b, a];
};

interface TwoSetExpression {
  readonly tex: (a: string, b: string) => string;
  readonly shaded: readonly Region[];
}

const differences: readonly TwoSetExpression[] = [
  { tex: (a, b) => `${a} \\setminus ${b}`, shaded: ["onlyA"] },
  { tex: (a, b) => `${b} \\setminus ${a}`, shaded: ["onlyB"] },
  { tex: (a, b) => `${a} \\cap ${b}`, shaded: ["both"] },
  { tex: (a, b) => `(${a} \\setminus ${b}) \\cup (${b} \\setminus ${a})`, shaded: ["onlyA", "onlyB"] },
];

const differenceOnVenn = point(
  "a-difference-of-sets-on-a-diagram",
  ["A difference of sets on a diagram", "图上的集合差"],
  [
    "The difference $A \\setminus B$ holds the elements of $A$ that are not in $B$. On a diagram, it is the part of $A$ outside the overlap, and it is usually not the same as $B \\setminus A$.",
    "差集 $A \\setminus B$ 由属于 $A$ 但不属于 $B$ 的元素组成。在图上，它是 $A$ 中重叠部分之外的部分，通常与 $B \\setminus A$ 不同。",
  ],
  (rng) => {
    const names = namesOf(rng);
    const [a, b] = names;
    const right = rng.pick(differences);
    return choose(
      rng,
      ["Which set does the shaded part of the diagram show?", "图中的阴影部分表示哪个集合？"],
      same(right.tex(a, b)),
      differences.filter((e) => e !== right).map((e) => same(e.tex(a, b))),
      [
        `The shading covers ${right.shaded.map((r) => regionNames[r][0]).join(" and ")}, which is $${right.tex(a, b)}$.`,
        `阴影覆盖${right.shaded.map((r) => regionNames[r][1]).join("和")}，即 $${right.tex(a, b)}$。`,
      ],
      figureOf(vennTwo(names, right.shaded), vennAlt(names, right.shaded)),
    );
  },
);

const complements: readonly TwoSetExpression[] = [
  { tex: (a) => `${a}^{c}`, shaded: ["onlyB", "out"] },
  { tex: (_, b) => `${b}^{c}`, shaded: ["onlyA", "out"] },
  { tex: (a, b) => `(${a} \\cup ${b})^{c}`, shaded: ["out"] },
  { tex: (a, b) => `(${a} \\cap ${b})^{c}`, shaded: ["onlyA", "onlyB", "out"] },
];

const complementOnVenn = point(
  "a-complement-on-a-diagram",
  ["A complement on a diagram", "图上的补集"],
  [
    "The complement $A^{c}$ holds every element of the box, the universal set, that is not in $A$. So the shading of a complement always includes the part outside both sets.",
    "补集 $A^{c}$ 由方框（全集）中所有不属于 $A$ 的元素组成。所以补集的阴影总是包含两个集合之外的部分。",
  ],
  (rng) => {
    const names = namesOf(rng);
    const [a, b] = names;
    const right = rng.pick(complements);
    return choose(
      rng,
      ["The box is the universal set. Which set does the shaded part of the diagram show?", "方框是全集。图中的阴影部分表示哪个集合？"],
      same(right.tex(a, b)),
      complements.filter((e) => e !== right).map((e) => same(e.tex(a, b))),
      [
        `The shading covers ${right.shaded.map((r) => regionNames[r][0]).join(" and ")}, which is everything outside the set being complemented: $${right.tex(a, b)}$.`,
        `阴影覆盖${right.shaded.map((r) => regionNames[r][1]).join("和")}，也就是被取补的集合之外的全部：$${right.tex(a, b)}$。`,
      ],
      figureOf(vennTwo(names, right.shaded), vennAlt(names, right.shaded)),
    );
  },
);

const deMorganOnVenn = point(
  "de-morgans-laws-on-a-diagram",
  ["De Morgan's laws on a diagram", "图上的德摩根律"],
  [
    "De Morgan's laws say $(A \\cup B)^{c} = A^{c} \\cap B^{c}$ and $(A \\cap B)^{c} = A^{c} \\cup B^{c}$. Being outside the union means being outside each set, and being outside the overlap means being outside at least one set.",
    "德摩根律指出 $(A \\cup B)^{c} = A^{c} \\cap B^{c}$，$(A \\cap B)^{c} = A^{c} \\cup B^{c}$。在并集之外就是在每个集合之外，在重叠部分之外就是至少在一个集合之外。",
  ],
  (rng) => {
    const names = namesOf(rng);
    const [a, b] = names;
    const union = rng.bool();
    const shaded: readonly Region[] = union ? ["out"] : ["onlyA", "onlyB", "out"];
    const options: Pair[] = [
      same(`${a}^{c} \\cap ${b}^{c}`),
      same(`${a}^{c} \\cup ${b}^{c}`),
      same(`${a} \\cap ${b}^{c}`),
      same(`${a}^{c} \\cap ${b}`),
    ];
    const right = (union ? options[0] : options[1]) as Pair;
    return choose(
      rng,
      ["The box is the universal set. Which set equals the shaded part of the diagram?", "方框是全集。哪个集合等于图中的阴影部分？"],
      right,
      options.filter((o) => o !== right),
      union
        ? [
            `The shading is outside both sets, so it is the elements outside $${a}$ and outside $${b}$: $${a}^{c} \\cap ${b}^{c}$.`,
            `阴影在两个集合之外，也就是既在 $${a}$ 之外又在 $${b}$ 之外的元素：$${a}^{c} \\cap ${b}^{c}$。`,
          ]
        : [
            `The shading is everything except the overlap, so it is the elements outside $${a}$ or outside $${b}$: $${a}^{c} \\cup ${b}^{c}$.`,
            `阴影是重叠部分之外的全部，也就是在 $${a}$ 之外或在 $${b}$ 之外的元素：$${a}^{c} \\cup ${b}^{c}$。`,
          ],
      figureOf(vennTwo(names, shaded), vennAlt(names, shaded)),
    );
  },
);

const productGrid = point(
  "the-pair-missing-from-a-drawn-cartesian-product",
  ["The pair missing from a drawn Cartesian product", "所画笛卡儿积缺少的序对"],
  [
    "The Cartesian product $A \\times B$ holds every pair $(a, b)$ with $a \\in A$ and $b \\in B$. Drawn as dots, it fills every crossing of the columns of $A$ with the rows of $B$, so a gap stands out.",
    "笛卡儿积 $A \\times B$ 由所有满足 $a \\in A$，$b \\in B$ 的序对 $(a, b)$ 组成。画成点时，它填满 $A$ 的各列与 $B$ 的各行的每个交叉点，所以缺口很显眼。",
  ],
  (rng) => {
    const A = rng.sample([1, 2, 3, 4, 5, 6, 7], rng.int(3, 4)).sort((p, q) => p - q);
    const B = rng.sample([1, 2, 3, 4, 5, 6], 3).sort((p, q) => p - q);
    const missing: Point = [rng.pick(A), rng.pick(B)];
    const marks: PlaneMark[] = [];
    for (const a of A) for (const b of B) if (a !== missing[0] || b !== missing[1]) marks.push({ kind: "point", at: [a, b] });
    const pair = (p: Point): Pair => same(`(${p[0]}, ${p[1]})`);
    const others: Point[] = [
      [missing[1], missing[0]],
      [A.find((v) => v !== missing[0]) as number, B.find((v) => v !== missing[1]) as number],
      [A[A.length - 1] === missing[0] ? (A[0] as number) : (A[A.length - 1] as number), missing[1]],
      [missing[0], B[B.length - 1] === missing[1] ? (B[0] as number) : (B[B.length - 1] as number)],
    ];
    return choose(
      rng,
      [
        "The dots show every pair of a product $A \\times B$ except one. Which pair is missing?",
        "这些点表示积 $A \\times B$ 中除一个之外的所有序对。缺少哪个序对？",
      ],
      pair(missing),
      others.map(pair),
      [
        `The columns give $A = \\{${A.join(", ")}\\}$ and the rows give $B = \\{${B.join(", ")}\\}$. The only crossing without a dot is $(${missing[0]}, ${missing[1]})$.`,
        `各列给出 $A = \\{${A.join(", ")}\\}$，各行给出 $B = \\{${B.join(", ")}\\}$。唯一没有点的交叉处是 $(${missing[0]}, ${missing[1]})$。`,
      ],
      drawn(
        { xMin: 0, xMax: 8, yMin: 0, yMax: 7 },
        marks,
        t(
          `Dots at ${marks.map((m) => (m.kind === "point" ? `(${m.at[0]}, ${m.at[1]})` : "")).join(", ")}.`,
          `点位于 ${marks.map((m) => (m.kind === "point" ? `(${m.at[0]}, ${m.at[1]})` : "")).join("、")}。`,
        ),
      ),
    );
  },
);

const relationDots = point(
  "the-domain-and-range-of-a-drawn-relation",
  ["The domain and range of a drawn relation", "所画关系的定义域和值域"],
  [
    "The domain of a relation is the set of first coordinates of its pairs, and the range is the set of second coordinates. Several dots in one column count only once toward the domain.",
    "关系的定义域是其序对第一坐标的集合，值域是第二坐标的集合。同一列的几个点对定义域只算一次。",
  ],
  (rng) => {
    const count = rng.int(5, 8);
    const seen = new Map<string, Point>();
    while (seen.size < count) {
      const p: Point = [rng.int(1, 6), rng.int(1, 6)];
      seen.set(`${p[0]},${p[1]}`, p);
    }
    const pts = [...seen.values()];
    const domain = [...new Set(pts.map((p) => p[0]))].sort((p, q) => p - q);
    const range = [...new Set(pts.map((p) => p[1]))].sort((p, q) => p - q);
    const askDomain = rng.bool();
    const sum = (askDomain ? domain : range).reduce((n, v) => n + v, 0);
    const otherSum = (askDomain ? range : domain).reduce((n, v) => n + v, 0);
    const allSum = pts.reduce((n, p) => n + (askDomain ? p[0] : p[1]), 0);
    return ask(
      askDomain
        ? ["The dots show a relation. Find the sum of the elements of its domain.", "这些点表示一个关系。求它的定义域中各元素之和。"]
        : ["The dots show a relation. Find the sum of the elements of its range.", "这些点表示一个关系。求它的值域中各元素之和。"],
      sum,
      [otherSum, allSum, (askDomain ? domain : range).length, sum + 1, count],
      [
        `${askDomain ? "The first coordinates" : "The second coordinates"} that occur are $${(askDomain ? domain : range).join(", ")}$, each counted once. Their sum is $${sum}$.`,
        `出现的${askDomain ? "第一坐标" : "第二坐标"}为 $${(askDomain ? domain : range).join("$、$")}$，每个只算一次。它们的和为 $${sum}$。`,
      ],
      drawn(
        { xMin: 0, xMax: 7, yMin: 0, yMax: 7 },
        pts.map((at): PlaneMark => ({ kind: "point", at })),
        t(`Dots at ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`, `点位于 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`),
      ),
    );
  },
);

const divisionLine = point(
  "the-division-algorithm-on-a-number-line",
  ["The division algorithm on a number line", "数轴上的带余除法"],
  [
    "Writing $a = qd + r$ with $0 \\le r < d$ means stepping back from $a$ to the nearest multiple of $d$ at or to its left. This holds for negative $a$ too, so $q$ is often more negative than you might first guess.",
    "写成 $a = qd + r$（$0 \\le r < d$）就是从 $a$ 退回到它左边（或恰好在它上面）最近的 $d$ 的倍数。对负的 $a$ 也是如此，所以 $q$ 往往比第一感觉更负。",
  ],
  (rng) => {
    const d = rng.int(3, 7);
    const q = rng.int(-4, 3);
    const r = rng.int(1, d - 1);
    const a = q * d + r;
    const low = Math.min(q, 0) - 1;
    const high = Math.max(q, 0) + 2;
    const askQ = rng.bool();
    const dots = Array.from({ length: high - low + 1 }, (_, i) => (low + i) * d);
    const x0 = low * d;
    const x1 = high * d;
    const px = (v: number) => Math.round((20 + ((v - x0) * 280) / (x1 - x0)) * 10) / 10;
    let body = `<line x1="14" y1="60" x2="306" y2="60"/>`;
    for (const v of dots) body += `<line x1="${px(v)}" y1="54" x2="${px(v)}" y2="66"/>${label(px(v), 84, String(v).replace("-", "−"))}`;
    body += `<circle class="accent" cx="${px(a)}" cy="60" r="5" fill="currentColor" stroke="none"/>${label(px(a), 42, "a")}`;
    const svg = svgDocument(100, body);
    return ask(
      askQ
        ? [
            `The long ticks are the multiples of $${d}$, and the dot is $a = ${a}$. Write $a = ${d}q + r$ with $0 \\le r < ${d}$. Find $q$.`,
            `长刻度是 $${d}$ 的倍数，点是 $a = ${a}$。写成 $a = ${d}q + r$，$0 \\le r < ${d}$。求 $q$。`,
          ]
        : [
            `The long ticks are the multiples of $${d}$, and the dot is $a = ${a}$. Write $a = ${d}q + r$ with $0 \\le r < ${d}$. Find $r$.`,
            `长刻度是 $${d}$ 的倍数，点是 $a = ${a}$。写成 $a = ${d}q + r$，$0 \\le r < ${d}$。求 $r$。`,
          ],
      askQ ? q : r,
      askQ ? [q + 1, q - 1, r, a] : [d - r, -(d - r), q, r + 1, a],
      [
        `The nearest multiple of $${d}$ at or to the left of $${a}$ is $${q * d} = ${d}(${q})$. So $q = ${q}$ and $r = ${a} - (${q * d}) = ${r}$.`,
        `$${a}$ 左边最近的 $${d}$ 的倍数是 $${q * d} = ${d}(${q})$。所以 $q = ${q}$，$r = ${a} - (${q * d}) = ${r}$。`,
      ],
      figureOf(svg, [
        `A number line with ticks at ${dots.join(", ")}, and a dot at ${a}.`,
        `数轴上的刻度位于 ${dots.join("、")}，点位于 ${a}。`,
      ]),
    );
  },
);

/** clock draws the residues modulo n around a circle, with some of them filled. */
function clock(n: number, filled: readonly number[] = [], arrows = ""): string {
  const spots = ring(n, 80);
  const body = spots
    .map(
      (p, i) =>
        (filled.includes(i)
          ? `<circle class="accent" cx="${p[0]}" cy="${p[1]}" r="12" fill="currentColor" fill-opacity="0.3" stroke="none"/>`
          : "") + node(p, String(i)),
    )
    .join("");
  return svgDocument(220, body + arrows);
}

const clockWalk = point(
  "walking-on-a-residue-clock",
  ["Walking on a residue clock", "在剩余类时钟上行走"],
  [
    "In $\\mathbb{Z}_n$, adding $k$ means moving $k$ steps clockwise around the circle of residues, wrapping past $0$. Every full turn of $n$ steps changes nothing, so only $k \\bmod n$ matters.",
    "在 $\\mathbb{Z}_n$ 中，加 $k$ 就是在剩余类的圆上顺时针走 $k$ 步，经过 $0$ 时绕回。每走满 $n$ 步一圈等于没动，所以只有 $k \\bmod n$ 起作用。",
  ],
  (rng) => {
    const n = rng.int(5, 12);
    const start = rng.int(0, n - 1);
    const k = rng.int(n + 1, 4 * n);
    const answer = mod(start + k, n);
    return ask(
      [
        `The clock shows $\\mathbb{Z}_{${n}}$, with the shaded residue as the start. Where do you land after moving $${k}$ steps clockwise?`,
        `时钟表示 $\\mathbb{Z}_{${n}}$，有阴影的剩余类是起点。顺时针走 $${k}$ 步后到达哪里？`,
      ],
      answer,
      [mod(start - k, n), mod(k, n), start + k, mod(answer + 1, n)],
      [
        `The clock has $${n}$ residues, and $${k} \\equiv ${mod(k, n)} \\pmod{${n}}$. So you land on $${start} + ${mod(k, n)} \\equiv ${answer}$.`,
        `时钟有 $${n}$ 个剩余类，$${k} \\equiv ${mod(k, n)} \\pmod{${n}}$。所以到达 $${start} + ${mod(k, n)} \\equiv ${answer}$。`,
      ],
      figureOf(clock(n, [start]), [
        `A clock of the residues 0 to ${n - 1}, with ${start} shaded.`,
        `0 到 ${n - 1} 的剩余类时钟，${start} 有阴影。`,
      ]),
    );
  },
);

const clockNegative = point(
  "a-negative-number-on-a-residue-clock",
  ["A negative number on a residue clock", "剩余类时钟上的负数"],
  [
    "Every integer lands on exactly one residue: the remainder $r$ with $0 \\le r < n$. A negative number means walking counterclockwise from $0$, so $-a$ lands on $n - (a \\bmod n)$ unless $n$ divides $a$.",
    "每个整数恰好落在一个剩余类上：余数 $r$，$0 \\le r < n$。负数表示从 $0$ 逆时针走，所以除非 $n$ 整除 $a$，$-a$ 落在 $n - (a \\bmod n)$ 上。",
  ],
  (rng) => {
    const n = rng.int(5, 12);
    const a = rng.int(n + 1, 50);
    const value = -a;
    const answer = mod(value, n);
    return ask(
      [
        `The clock shows $\\mathbb{Z}_{${n}}$. Which residue on it is the class of $${value}$?`,
        `时钟表示 $\\mathbb{Z}_{${n}}$。它上面哪个剩余类是 $${value}$ 的类？`,
      ],
      answer,
      [mod(a, n), mod(answer + 1, n), mod(answer - 1, n), n - answer + 1],
      [
        `Add multiples of $${n}$ until the value lies between $0$ and $${n - 1}$: $${value} + ${n}(${Math.ceil(a / n)}) = ${answer}$.`,
        `加上 $${n}$ 的倍数，直到结果在 $0$ 到 $${n - 1}$ 之间：$${value} + ${n}(${Math.ceil(a / n)}) = ${answer}$。`,
      ],
      figureOf(clock(n), [`A clock of the residues 0 to ${n - 1}.`, `0 到 ${n - 1} 的剩余类时钟。`]),
    );
  },
);

const nullBand = point(
  "where-a-null-sequence-enters-a-drawn-band",
  ["Where a null sequence enters a drawn band", "零数列何时进入所画的带"],
  [
    "A sequence tends to zero when, for every $\\varepsilon > 0$, there is an $N$ with $|a_n| < \\varepsilon$ for all $n \\ge N$. On a plot, that says all the dots from $N$ on lie inside the band between $-\\varepsilon$ and $\\varepsilon$. Earlier dots may wander in and out.",
    "数列趋于零是指：对每个 $\\varepsilon > 0$，存在 $N$，使所有 $n \\ge N$ 都有 $|a_n| < \\varepsilon$。在图上，就是从 $N$ 开始的所有点都在 $-\\varepsilon$ 与 $\\varepsilon$ 之间的带内。更早的点可以进进出出。",
  ],
  (rng) => {
    const c = rng.int(2, 6);
    const m = rng.int(3, 9);
    const eps = c / (m + 0.5);
    const signs = rng.bool();
    const a = (n: number) => ((signs ? (-1) ** n : 1) * c) / n;
    const svg = chart([0, 14], [-c * 0.6, c * 1.1], intTicks(0, 14), [[c, String(c)]], (x, y) => {
      const dash = 'stroke="currentColor" stroke-dasharray="5 4"';
      let s = `<line ${dash} x1="${x(0)}" y1="${y(eps)}" x2="${x(14)}" y2="${y(eps)}"/><line ${dash} x1="${x(0)}" y1="${y(-eps)}" x2="${x(14)}" y2="${y(-eps)}"/><line stroke="currentColor" x1="${x(0)}" y1="${y(0)}" x2="${x(14)}" y2="${y(0)}"/>`;
      for (let n = 1; n <= 14; n++) s += `<circle cx="${x(n)}" cy="${y(a(n))}" r="3" fill="currentColor" stroke="none"/>`;
      return s;
    });
    return ask(
      [
        `The dots show $a_n = ${signs ? "\\frac{(-1)^n" : `\\frac{`}${signs ? ` \\cdot ${c}}` : `${c}}`}{n}$, and the dashed lines are at $\\pm\\varepsilon$. Find the smallest $N$ such that $|a_n| < \\varepsilon$ for every $n \\ge N$.`,
        `这些点表示 $a_n = ${signs ? "\\frac{(-1)^n" : `\\frac{`}${signs ? ` \\cdot ${c}}` : `${c}}`}{n}$，虚线位于 $\\pm\\varepsilon$。求最小的 $N$，使每个 $n \\ge N$ 都有 $|a_n| < \\varepsilon$。`,
      ],
      m + 1,
      [m, m + 2, m - 1, c, 2 * m + 1],
      [
        `The term $n = ${m}$ is the last dot outside the band, and all later dots stay inside, since $\\frac{${c}}{n}$ keeps shrinking. So $N = ${m + 1}$.`,
        `$n = ${m}$ 是带外的最后一个点，之后的点都在带内，因为 $\\frac{${c}}{n}$ 不断变小。所以 $N = ${m + 1}$。`,
      ],
      figureOf(svg, [
        `Dots for n from 1 to 14, and a dashed band in which the dots stay from n = ${m + 1} on.`,
        `n 从 1 到 14 的点，以及一条虚线带，从 n = ${m + 1} 起点都留在带内。`,
      ]),
    );
  },
);

const extremeOnLine = point(
  "the-maximum-of-a-drawn-interval",
  ["The maximum of a drawn interval", "所画区间的最大值"],
  [
    "The maximum of a set must belong to the set. An interval with a hollow right end has values as close to that end as you like but none at it, so it has no maximum, though the end is still its supremum.",
    "集合的最大值必须属于该集合。右端空心的区间有任意接近该端点的值，但取不到它，所以没有最大值，尽管该端点仍是它的上确界。",
  ],
  (rng) => {
    const a = rng.int(-6, 1);
    const b = a + rng.int(2, 5);
    const leftIn = rng.bool();
    const rightIn = rng.bool();
    const askMax = rng.bool();
    const value = askMax ? b : a;
    const included = askMax ? rightIn : leftIn;
    const other = askMax ? a : b;
    const none: Pair = askMax ? ["There is no maximum", "没有最大值"] : ["There is no minimum", "没有最小值"];
    const word: Pair = askMax ? ["maximum", "最大值"] : ["minimum", "最小值"];
    const marks: PlaneMark[] = [
      { kind: "segment", a: [a, 0], b: [b, 0], accent: true },
      { kind: "point", at: [a, 0], open: !leftIn },
      { kind: "point", at: [b, 0], open: !rightIn },
    ];
    return choose(
      rng,
      [
        `The colored segment on the $x$-axis is a set of real numbers, with a filled dot for an end it contains and a hollow dot for an end it does not. What is its ${word[0]}?`,
        `$x$ 轴上的彩色线段是一个实数集，实心点表示包含该端点，空心点表示不包含。它的${word[1]}是什么？`,
      ],
      included ? same(String(value)) : none,
      [included ? none : same(String(value)), same(String(other)), same(String(askMax ? value - 1 : value + 1))],
      included
        ? [
            `The end $${value}$ has a filled dot, so it is in the set, and nothing in the set goes past it.`,
            `端点 $${value}$ 是实心点，所以它在集合中，集合中没有超过它的数。`,
          ]
        : [
            `The end $${value}$ has a hollow dot, so it is not in the set, and any number of the set can be beaten by one closer to $${value}$.`,
            `端点 $${value}$ 是空心点，所以它不在集合中，而集合中任何一个数都能被更接近 $${value}$ 的数超过。`,
          ],
      drawn(
        { xMin: -7, xMax: 7, yMin: -2, yMax: 2 },
        marks,
        t(
          `A segment from ${a} (${leftIn ? "filled" : "hollow"}) to ${b} (${rightIn ? "filled" : "hollow"}).`,
          `从 ${a}（${leftIn ? "实心" : "空心"}）到 ${b}（${rightIn ? "实心" : "空心"}）的线段。`,
        ),
      ),
    );
  },
);

const truthSetLine = point(
  "the-predicate-of-a-drawn-truth-set",
  ["The predicate of a drawn truth set", "所画真值集对应的谓词"],
  [
    "The truth set of a predicate holds the values that make it true. For $|x - a| < r$ it is the interval of radius $r$ about $a$ with hollow ends, $|x - a| \\le r$ has filled ends, and $|x - a| > r$ is everything outside.",
    "谓词的真值集由使它为真的值组成。$|x - a| < r$ 的真值集是以 $a$ 为中心、半径为 $r$、两端空心的区间，$|x - a| \\le r$ 两端实心，$|x - a| > r$ 则是外面的全部。",
  ],
  (rng) => {
    const a = rng.int(-3, 3);
    const r = rng.int(1, 3);
    const kind = rng.pick(["lt", "le", "gt", "ge"] as const);
    const filled = kind === "le" || kind === "ge";
    const inside = kind === "lt" || kind === "le";
    const marks: PlaneMark[] = inside
      ? [{ kind: "segment", a: [a - r, 0], b: [a + r, 0], accent: true }]
      : [
          { kind: "segment", a: [-8, 0], b: [a - r, 0], accent: true },
          { kind: "segment", a: [a + r, 0], b: [8, 0], accent: true },
        ];
    marks.push({ kind: "point", at: [a - r, 0], open: !filled }, { kind: "point", at: [a + r, 0], open: !filled });
    const shifted = a === 0 ? "|x|" : a > 0 ? `|x - ${a}|` : `|x + ${-a}|`;
    const form = (op: string) => same(`${shifted} ${op} ${r}`);
    const ops = { lt: "<", le: "\\le", gt: ">", ge: "\\ge" } as const;
    return choose(
      rng,
      [
        "The colored part of the $x$-axis is the truth set of a predicate about a real number $x$, with filled dots for ends it contains and hollow dots for ends it does not. Which predicate is it?",
        "$x$ 轴的彩色部分是关于实数 $x$ 的谓词的真值集，实心点表示包含该端点，空心点表示不包含。它是哪个谓词？",
      ],
      form(ops[kind]),
      (["lt", "le", "gt", "ge"] as const).filter((k) => k !== kind).map((k) => form(ops[k])),
      [
        `The ends are $${a} \\pm ${r}$, so the distance from $${a}$ is compared with $${r}$. The set is ${inside ? "between" : "outside"} the ends, and the ends are ${filled ? "included" : "excluded"}.`,
        `端点为 $${a} \\pm ${r}$，所以比较的是到 $${a}$ 的距离与 $${r}$。集合在端点${inside ? "之间" : "之外"}，${filled ? "包含" : "不包含"}端点。`,
      ],
      drawn(
        { xMin: -8, xMax: 8, yMin: -2, yMax: 2 },
        marks,
        t(
          `The ${inside ? "part between" : "parts outside"} ${a - r} and ${a + r}, with ${filled ? "filled" : "hollow"} dots at those values.`,
          `${a - r} 与 ${a + r} ${inside ? "之间" : "之外"}的部分，这两个值处是${filled ? "实心" : "空心"}点。`,
        ),
      ),
    );
  },
);

const injectiveGraph = point(
  "injectivity-from-a-drawn-graph",
  ["Injectivity from a drawn graph", "由图判断单射"],
  [
    "A function is injective when different inputs always give different outputs. On a graph, that fails exactly when some horizontal line meets the graph more than once, and two such crossings are a counterexample.",
    "当不同的输入总给出不同的输出时，函数是单射。在图上，它不成立当且仅当某条水平线与图像相交不止一次，这样的两个交点就是反例。",
  ],
  (rng) => {
    const shape = rng.pick(["line", "cubic", "parabola", "vee", "wave"] as const);
    const h = rng.int(-2, 2);
    const k = rng.int(-3, 3);
    const s = rng.pick([0.5, 1, 1.5]) * rng.sign();
    const f = {
      line: (x: number) => k + s * (x - h),
      cubic: (x: number) => k + (s / 4) * (x - h) ** 3,
      parabola: (x: number) => k + (s / 2) * (x - h) ** 2,
      vee: (x: number) => k + s * Math.abs(x - h),
      wave: (x: number) => k + 2 * s * Math.sin(x - h),
    }[shape];
    const injective = shape === "line" || shape === "cubic";
    const yes: Pair = ["Injective: every horizontal line meets the graph at most once", "单射：每条水平线与图像至多相交一次"];
    const no: Pair = ["Not injective: some horizontal line meets the graph twice", "不是单射：某条水平线与图像相交两次"];
    const yes2: Pair = ["Injective: every vertical line meets the graph at most once", "单射：每条竖直线与图像至多相交一次"];
    const no2: Pair = ["Not injective: some vertical line meets the graph twice", "不是单射：某条竖直线与图像相交两次"];
    return choose(
      rng,
      [
        "The curve is the graph of a function on the whole real line, and it continues in the same way past the drawing. Which statement is true?",
        "曲线是定义在整个实数轴上的函数的图像，并按同样的方式延伸到图外。哪个说法正确？",
      ],
      injective ? yes : no,
      [injective ? no : yes, yes2, no2],
      injective
        ? ["The graph always moves in one direction, so no height is reached twice.", "图像始终朝一个方向走，所以没有哪个高度被达到两次。"]
        : [
            "The graph turns back, so a horizontal line near the turn crosses it on both sides.",
            "图像会折返，所以折返点附近的水平线在两侧都与它相交。",
          ],
      drawn(
        { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
        [{ kind: "curve", f, accent: true }],
        t(
          {
            line: "A straight line that is not horizontal.",
            cubic: "A cubic curve that always moves in one direction.",
            parabola: "A parabola.",
            vee: "A V-shaped graph.",
            wave: "A wave that goes up and down.",
          }[shape],
          {
            line: "一条不水平的直线。",
            cubic: "始终朝一个方向走的三次曲线。",
            parabola: "一条抛物线。",
            vee: "V 形的图像。",
            wave: "上下起伏的波。",
          }[shape],
        ),
      ),
    );
  },
);

// Abstract algebra.

/** stepsArrows draws the arrows of repeatedly adding k on the clock of Z_n, starting at 0. */
function stepsArrows(n: number, k: number): string {
  const spots = ring(n, 80);
  let body = "";
  let at = 0;
  do {
    const to = (at + k) % n;
    body += arrowLine(spots[at] as Point, spots[to] as Point, 14, true);
    at = to;
  } while (at !== 0);
  return body;
}

const orderOnClock = point(
  "the-order-of-an-element-from-its-star",
  ["The order of an element from its star", "由星形路径求元素的阶"],
  [
    "In $\\mathbb{Z}_n$, the multiples of $k$ trace a closed path around the clock. The order of $k$ is the number of arrows in that path, which equals $\\frac{n}{\\gcd(n, k)}$.",
    "在 $\\mathbb{Z}_n$ 中，$k$ 的倍数在时钟上描出一条闭合路径。$k$ 的阶就是路径上箭头的数目，等于 $\\frac{n}{\\gcd(n, k)}$。",
  ],
  (rng) => {
    const n = rng.pick([6, 8, 9, 10, 12]);
    const k = rng.pick(Array.from({ length: n - 2 }, (_, i) => i + 2).filter((v) => v !== n / 2));
    const answer = n / gcd(n, k);
    return ask(
      [
        `In $\\mathbb{Z}_{${n}}$, the arrows start at $0$ and repeatedly add one fixed element $k$, the first arrow going from $0$ to $k$. Find the order of $k$.`,
        `在 $\\mathbb{Z}_{${n}}$ 中，箭头从 $0$ 出发，反复加同一个元素 $k$，第一个箭头从 $0$ 指向 $k$。求 $k$ 的阶。`,
      ],
      answer,
      [n, k, gcd(n, k), n - k],
      [
        `The first arrow gives $k = ${k}$. The path closes after $${answer}$ arrows, which matches $\\frac{${n}}{\\gcd(${n}, ${k})} = ${answer}$.`,
        `第一个箭头给出 $k = ${k}$。路径走 $${answer}$ 个箭头后闭合，与 $\\frac{${n}}{\\gcd(${n}, ${k})} = ${answer}$ 相符。`,
      ],
      figureOf(clock(n, [], stepsArrows(n, k)), [
        `A clock of Z${n} with arrows from 0 in steps of ${k}.`,
        `Z${n} 的时钟，箭头从 0 出发，步长为 ${k}。`,
      ]),
    );
  },
);

const generatorOnClock = point(
  "does-a-drawn-star-generate-the-group",
  ["Does a drawn star generate the group?", "所画的星形路径能生成整个群吗？"],
  [
    "An element $k$ generates $\\mathbb{Z}_n$ when its multiples reach every residue, which happens exactly when $\\gcd(n, k) = 1$. Otherwise it generates only the multiples of $\\gcd(n, k)$.",
    "当元素 $k$ 的倍数能到达每个剩余类时，它生成 $\\mathbb{Z}_n$，这恰好发生在 $\\gcd(n, k) = 1$ 时。否则它只生成 $\\gcd(n, k)$ 的倍数。",
  ],
  (rng) => {
    const n = rng.pick([6, 8, 9, 10, 12]);
    const k = rng.int(2, n - 2);
    const d = gcd(n, k);
    const generates = d === 1;
    const size = n / d;
    const yes: Pair = [`$${k}$ generates $\\mathbb{Z}_{${n}}$`, `$${k}$ 生成 $\\mathbb{Z}_{${n}}$`];
    const sub = (m: number): Pair => [`$${k}$ generates a subgroup of size $${m}$`, `$${k}$ 生成大小为 $${m}$ 的子群`];
    return choose(
      rng,
      [
        `In $\\mathbb{Z}_{${n}}$, the arrows start at $0$ and repeatedly add $${k}$. Which statement is true?`,
        `在 $\\mathbb{Z}_{${n}}$ 中，箭头从 $0$ 出发，反复加 $${k}$。哪个说法正确？`,
      ],
      generates ? yes : sub(size),
      generates
        ? [sub(d === 1 ? n - 1 : d), sub(k), sub(n - k === k ? k + 1 : n - k)]
        : [yes, sub(d === size ? size + 1 : d), sub(k === size ? k + 1 : k)],
      generates
        ? [
            `The path reaches all $${n}$ residues, since $\\gcd(${n}, ${k}) = 1$.`,
            `路径到达全部 $${n}$ 个剩余类，因为 $\\gcd(${n}, ${k}) = 1$。`,
          ]
        : [
            `The path closes after $${size}$ arrows and misses the other residues, since $\\gcd(${n}, ${k}) = ${d}$.`,
            `路径走 $${size}$ 个箭头后闭合，错过其余剩余类，因为 $\\gcd(${n}, ${k}) = ${d}$。`,
          ],
      figureOf(clock(n, [], stepsArrows(n, k)), [
        `A clock of Z${n} with arrows from 0 in steps of ${k}.`,
        `Z${n} 的时钟，箭头从 0 出发，步长为 ${k}。`,
      ]),
    );
  },
);

type Op = (a: number, b: number) => number;

const permutationsOf3 = [
  [0, 1, 2],
  [1, 2, 0],
  [2, 0, 1],
  [1, 0, 2],
  [0, 2, 1],
  [2, 1, 0],
] as const;

const s3: Op = (a, b) => {
  const [p, q] = [permutationsOf3[a] as readonly number[], permutationsOf3[b] as readonly number[]];
  const composed = q.map((v) => p[v] as number);
  return permutationsOf3.findIndex((r) => r.every((v, i) => v === composed[i]));
};

/** tableGroup chooses a small group, written with shuffled letters, and returns its operation on those letters. */
function tableGroup(rng: Rng) {
  const kind = rng.pick(["z4", "v4", "z5", "z6", "s3"] as const);
  const size = { z4: 4, v4: 4, z5: 5, z6: 6, s3: 6 }[kind];
  const op: Op = kind === "v4" ? (a, b) => a ^ b : kind === "s3" ? s3 : (a, b) => (a + b) % size;
  const letters = rng.sample(["a", "b", "c", "d", "e", "f", "g", "h", "p", "q", "u", "w"], size);
  const order = rng.shuffle(Array.from({ length: size }, (_, i) => i));
  const name = (i: number) => letters[i] as string;
  return { kind, size, op, order, name, identity: 0 };
}

/** tableSvg draws the operation table of a small group, where the entry in row x and column y is x * y. */
function tableSvg(size: number, order: readonly number[], op: Op, name: (i: number) => string) {
  const cell = 30;
  const left = 160 - ((size + 1) * cell) / 2;
  let body = "";
  for (let i = 0; i <= size + 1; i++) {
    body += `<line x1="${left}" y1="${6 + i * cell}" x2="${left + (size + 1) * cell}" y2="${6 + i * cell}"/><line x1="${left + i * cell}" y1="6" x2="${left + i * cell}" y2="${6 + (size + 1) * cell}"/>`;
  }
  const entry = (r: number, c: number, text: string, bold = false) =>
    label(left + c * cell + cell / 2, 6 + r * cell + cell / 2 + 4, text, bold ? 'font-weight="700"' : "");
  body += entry(0, 0, "∗", true);
  order.forEach((x, i) => {
    body += entry(0, i + 1, name(x), true) + entry(i + 1, 0, name(x), true);
    order.forEach((y, j) => {
      body += entry(i + 1, j + 1, name(op(x, y)));
    });
  });
  return svgDocument(12 + (size + 1) * cell, body);
}

/** tableAlt spells out an operation table row by row. */
const tableAlt = (order: readonly number[], op: Op, name: (i: number) => string): Pair => {
  const rows = order.map((x) => `${name(x)}: ${order.map((y) => name(op(x, y))).join(" ")}`).join("; ");
  return [
    `An operation table with columns ${order.map(name).join(" ")}. Rows: ${rows}.`,
    `运算表，各列为 ${order.map(name).join(" ")}。各行：${rows}。`,
  ];
};

const tableIdentity = point(
  "the-identity-from-an-operation-table",
  ["The identity from an operation table", "由运算表找单位元"],
  [
    "The identity $e$ satisfies $e * x = x * e = x$ for every $x$. In a table, its row and its column repeat the headings exactly.",
    "单位元 $e$ 对每个 $x$ 都满足 $e * x = x * e = x$。在表中，它的行和列都与表头完全相同。",
  ],
  (rng) => {
    const { size, op, order, name, identity } = tableGroup(rng);
    const others = order.filter((v) => v !== identity);
    return choose(
      rng,
      [
        "The table shows a group, with the entry in row $x$ and column $y$ equal to $x * y$. Which element is the identity?",
        "表表示一个群，第 $x$ 行第 $y$ 列的元素为 $x * y$。哪个元素是单位元？",
      ],
      same(name(identity)),
      rng.sample(others, Math.min(3, size - 1)).map((v) => same(name(v))),
      [
        `The row of $${name(identity)}$ and its column both repeat the headings, so $${name(identity)}$ changes nothing.`,
        `$${name(identity)}$ 的行和列都与表头相同，所以 $${name(identity)}$ 不改变任何元素。`,
      ],
      figureOf(tableSvg(size, order, op, name), tableAlt(order, op, name)),
    );
  },
);

const tableInverse = point(
  "an-inverse-from-an-operation-table",
  ["An inverse from an operation table", "由运算表求逆元"],
  [
    "First find the identity from the row that repeats the headings. The inverse of $x$ is the element $y$ with $x * y$ equal to the identity, so find the identity in the row of $x$ and read off its column.",
    "先由与表头相同的行找到单位元。$x$ 的逆元是使 $x * y$ 等于单位元的元素 $y$，所以在 $x$ 的行中找到单位元，再读出它所在的列。",
  ],
  (rng) => {
    const { size, op, order, name, identity } = tableGroup(rng);
    const x = rng.pick(order.filter((v) => v !== identity));
    const inverse = order.find((y) => op(x, y) === identity) as number;
    const wrong = order.filter((v) => v !== inverse);
    return choose(
      rng,
      [
        `The table shows a group, with the entry in row $x$ and column $y$ equal to $x * y$. What is the inverse of $${name(x)}$?`,
        `表表示一个群，第 $x$ 行第 $y$ 列的元素为 $x * y$。$${name(x)}$ 的逆元是什么？`,
      ],
      same(name(inverse)),
      rng.sample(wrong, Math.min(3, size - 1)).map((v) => same(name(v))),
      [
        `The identity is $${name(identity)}$, and in the row of $${name(x)}$ it appears in the column of $${name(inverse)}$.`,
        `单位元是 $${name(identity)}$，它在 $${name(x)}$ 的行中出现在 $${name(inverse)}$ 这一列。`,
      ],
      figureOf(tableSvg(size, order, op, name), tableAlt(order, op, name)),
    );
  },
);

const tableAbelian = point(
  "abelian-or-not-from-an-operation-table",
  ["Abelian or not, from an operation table", "由运算表判断是否为阿贝尔群"],
  [
    "A group is abelian when $x * y = y * x$ for all $x$ and $y$. Then its table is symmetric about the main diagonal, provided the rows and columns have the same order, and a single mismatched pair shows it is not abelian.",
    "当所有 $x$、$y$ 都满足 $x * y = y * x$ 时，群是阿贝尔群。只要行和列的顺序相同，它的表就关于主对角线对称，而一对不匹配的元素就说明它不是阿贝尔群。",
  ],
  (rng) => {
    const { kind, size, op, order, name } = tableGroup(rng);
    const abelian = kind !== "s3";
    let witness = "";
    if (!abelian)
      for (const x of order)
        for (const y of order)
          if (!witness && op(x, y) !== op(y, x))
            witness = `$${name(x)} * ${name(y)} = ${name(op(x, y))}$, $${name(y)} * ${name(x)} = ${name(op(y, x))}$`;
    const yes: Pair = ["Abelian: the table is symmetric about its main diagonal", "阿贝尔群：表关于主对角线对称"];
    const no: Pair = ["Not abelian: the table is not symmetric about its main diagonal", "不是阿贝尔群：表不关于主对角线对称"];
    const notGroup: Pair = ["Not a group: an element repeats in a row", "不是群：某一行有重复元素"];
    const noIdentity: Pair = ["Not a group: there is no identity", "不是群：没有单位元"];
    return choose(
      rng,
      [
        "The table shows an operation on a finite set, with the entry in row $x$ and column $y$ equal to $x * y$. Which statement is true?",
        "表表示有限集上的一个运算，第 $x$ 行第 $y$ 列的元素为 $x * y$。哪个说法正确？",
      ],
      abelian ? yes : no,
      [abelian ? no : yes, notGroup, noIdentity],
      abelian
        ? ["Every entry matches its mirror image across the main diagonal.", "每个元素都与它关于主对角线的镜像相同。"]
        : [`For example, ${witness}.`, `例如，${witness}。`],
      figureOf(tableSvg(size, order, op, name), tableAlt(order, op, name)),
    );
  },
);

/** randomPermutation chooses a permutation of 0..n-1 that moves at least two points. */
function randomPermutation(rng: Rng, n: number): number[] {
  for (;;) {
    const p = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    if (p.some((v, i) => v !== i)) return p;
  }
}

/** stringDiagram draws a permutation as arrows from a top row to a bottom row, showing i to p(i). */
function stringDiagram(p: readonly number[]): string {
  const n = p.length;
  const px = (i: number) => 160 + (i - (n - 1) / 2) * (280 / Math.max(n, 6));
  let body = "";
  p.forEach((to, i) => {
    body += arrowLine([px(i), 30], [px(to), 130], 14, true);
    body += node([px(i), 24], String(i + 1)) + node([px(to), 136], String(to + 1));
  });
  return svgDocument(160, body);
}

const stringAlt = (p: readonly number[]): Pair => [
  `Arrows from a top row to a bottom row: ${p.map((v, i) => `${i + 1} to ${v + 1}`).join(", ")}.`,
  `从上排指向下排的箭头：${p.map((v, i) => `${i + 1} 到 ${v + 1}`).join("、")}。`,
];

/** cyclesOf returns the cycles of a permutation, each beginning at its smallest element. */
function cyclesOf(p: readonly number[]): number[][] {
  const seen = new Set<number>();
  const out: number[][] = [];
  p.forEach((_, i) => {
    if (seen.has(i)) return;
    const c: number[] = [];
    let at = i;
    while (!seen.has(at)) {
      seen.add(at);
      c.push(at);
      at = p[at] as number;
    }
    out.push(c);
  });
  return out;
}

const cycleTypeDrawn = point(
  "the-cycle-type-of-a-drawn-permutation",
  ["The cycle type of a drawn permutation", "所画置换的轮换型"],
  [
    "Follow each number through the arrows until you return to it: that is one cycle. The cycle type lists the lengths of all the cycles, including fixed points as cycles of length one.",
    "沿箭头跟踪每个数，直到回到它自身，就得到一个轮换。轮换型列出所有轮换的长度，不动点算作长度为一的轮换。",
  ],
  (rng) => {
    const n = rng.int(4, 6);
    const p = randomPermutation(rng, n);
    const cycles = cyclesOf(p);
    const lengths = cycles.map((c) => c.length).sort((a, b) => b - a);
    const form = (l: readonly number[]) => same(`(${l.join(", ")})`);
    const partitions: Record<number, number[][]> = {
      4: [[4], [3, 1], [2, 2], [2, 1, 1]],
      5: [[5], [4, 1], [3, 2], [3, 1, 1], [2, 2, 1], [2, 1, 1, 1]],
      6: [[6], [5, 1], [4, 2], [3, 3], [4, 1, 1], [3, 2, 1], [2, 2, 2], [2, 2, 1, 1]],
    };
    const wrong = rng.sample(
      (partitions[n] as number[][]).filter((l) => l.join() !== lengths.join()),
      3,
    );
    const written = cycles.map((c) => `(${c.map((v) => v + 1).join("\\,")})`).join("");
    return choose(
      rng,
      [
        "The arrows show a permutation, sending each top number to a bottom number. What is its cycle type?",
        "箭头表示一个置换，把上排的每个数送到下排的一个数。它的轮换型是什么？",
      ],
      form(lengths),
      wrong.map(form),
      [
        `Following the arrows gives the cycles $${written}$, of lengths $${lengths.join(", ")}$.`,
        `沿箭头得到轮换 $${written}$，长度为 $${lengths.join(", ")}$。`,
      ],
      figureOf(stringDiagram(p), stringAlt(p)),
    );
  },
);

const inverseDrawn = point(
  "the-inverse-of-a-drawn-permutation",
  ["The inverse of a drawn permutation", "所画置换的逆"],
  [
    "The inverse undoes each arrow. To find $\\sigma^{-1}(k)$, find $k$ in the bottom row and follow its arrow backward to the top row.",
    "逆置换把每个箭头反过来。要求 $\\sigma^{-1}(k)$，就在下排找到 $k$，沿箭头反向走到上排。",
  ],
  (rng) => {
    const n = rng.int(4, 6);
    const p = randomPermutation(rng, n);
    const k = rng.int(1, n);
    const answer = p.indexOf(k - 1) + 1;
    return ask(
      [
        `The arrows show a permutation $\\sigma$, sending each top number to a bottom number. Find $\\sigma^{-1}(${k})$.`,
        `箭头表示置换 $\\sigma$，把上排的每个数送到下排的一个数。求 $\\sigma^{-1}(${k})$。`,
      ],
      answer,
      [(p[k - 1] as number) + 1, k, (answer % n) + 1, n - answer + 1],
      [
        `The arrow that ends at $${k}$ in the bottom row starts at $${answer}$ in the top row, so $\\sigma(${answer}) = ${k}$.`,
        `下排指向 $${k}$ 的箭头从上排的 $${answer}$ 出发，所以 $\\sigma(${answer}) = ${k}$。`,
      ],
      figureOf(stringDiagram(p), stringAlt(p)),
    );
  },
);

/** necklace draws n beads on a circle, black for 1 and white for 0. */
function necklace(pattern: readonly number[]): string {
  const spots = ring(pattern.length, 70);
  const beads = pattern
    .map((v, i) => `<circle cx="${(spots[i] as Point)[0]}" cy="${(spots[i] as Point)[1]}" r="11" ${v ? 'fill="currentColor"' : ""}/>`)
    .join("");
  return svgDocument(220, beads);
}

/** periodicPattern chooses a pattern of beads with an exact rotational period p dividing n. */
function periodicPattern(rng: Rng) {
  const [n, p] = rng.pick<[number, number]>([
    [6, 2],
    [6, 3],
    [6, 6],
    [8, 2],
    [8, 4],
    [8, 8],
    [9, 3],
    [9, 9],
    [10, 2],
    [10, 5],
    [10, 10],
    [12, 3],
    [12, 4],
    [12, 6],
    [12, 12],
  ]);
  for (;;) {
    const block = Array.from({ length: p }, () => (rng.bool() ? 1 : 0));
    const pattern = Array.from({ length: n }, (_, i) => block[i % p] as number);
    const period = (Array.from({ length: n }, (_, i) => i + 1).find(
      (d) => n % d === 0 && pattern.every((v, i) => v === pattern[(i + d) % n]),
    ) ?? n) as number;
    if (period === p) return { n, p, pattern };
  }
}

const beadAlt = (pattern: readonly number[]): Pair => [
  `A necklace of ${pattern.length} beads. Going clockwise from the top: ${pattern.map((v) => (v ? "black" : "white")).join(", ")}.`,
  `${pattern.length} 颗珠子的项链。从顶部顺时针：${pattern.map((v) => (v ? "黑" : "白")).join("、")}。`,
];

const necklaceOrbit = point(
  "the-orbit-of-a-drawn-necklace",
  ["The orbit of a drawn necklace", "所画项链的轨道"],
  [
    "Rotations of a necklace with $n$ beads form a group of size $n$. The orbit of a coloring is the set of colorings you can reach by rotating. If the pattern first repeats after $p$ beads, the orbit has size $p$.",
    "$n$ 颗珠子的项链的旋转构成大小为 $n$ 的群。一种着色的轨道是旋转能得到的所有着色。如果图案在 $p$ 颗珠子后第一次重复，轨道的大小就是 $p$。",
  ],
  (rng) => {
    const { n, p, pattern } = periodicPattern(rng);
    return ask(
      [
        "The rotations of the necklace act on its colorings, with the beads in fixed positions. How many different colorings are in the orbit of the one shown?",
        "项链的旋转作用在它的着色上，珠子的位置固定。所示着色的轨道中有多少种不同的着色？",
      ],
      p,
      [n, n / p, pattern.reduce((a, b) => a + b, 0), 2 * n, n - p + 1],
      [
        `The pattern first repeats after $${p}$ beads, so exactly $${p}$ of the $${n}$ rotations give different colorings.`,
        `图案在 $${p}$ 颗珠子后第一次重复，所以 $${n}$ 个旋转中恰有 $${p}$ 个给出不同的着色。`,
      ],
      figureOf(necklace(pattern), beadAlt(pattern)),
    );
  },
);

const necklaceFixed = point(
  "the-rotations-that-fix-a-drawn-necklace",
  ["The rotations that fix a drawn necklace", "保持所画项链不变的旋转"],
  [
    "A rotation fixes a coloring when every bead lands on a bead of the same color. If the pattern first repeats after $p$ beads, the rotations that fix it are the multiples of $p$ steps, and there are $\\frac{n}{p}$ of them, counting the identity.",
    "当每颗珠子都落到同色珠子上时，旋转保持着色不变。如果图案在 $p$ 颗珠子后第一次重复，保持它不变的旋转就是 $p$ 步的倍数，共 $\\frac{n}{p}$ 个（含恒等旋转）。",
  ],
  (rng) => {
    const { n, p, pattern } = periodicPattern(rng);
    const answer = n / p;
    return ask(
      [
        "How many rotations of this necklace, counting the identity, leave the coloring unchanged?",
        "这条项链有多少个旋转（含恒等旋转）保持着色不变？",
      ],
      answer,
      [p, n, answer + 1, 2 * answer + 1],
      [
        `The pattern first repeats after $${p}$ beads, so the rotations by multiples of $${p}$ steps fix it. There are $\\frac{${n}}{${p}} = ${answer}$ of them.`,
        `图案在 $${p}$ 颗珠子后第一次重复，所以旋转 $${p}$ 步的倍数保持它不变，共 $\\frac{${n}}{${p}} = ${answer}$ 个。`,
      ],
      figureOf(necklace(pattern), beadAlt(pattern)),
    );
  },
);

// Number theory.

/** powerPath lists the powers of g modulo p from g^0 up to the point where they return to 1. */
function powerPath(g: number, p: number): number[] {
  const out = [1];
  let v = g % p;
  while (v !== 1) {
    out.push(v);
    v = (v * g) % p;
  }
  return out;
}

const powerCases: readonly (readonly [number, number])[] = [
  [2, 5],
  [3, 5],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
  [2, 11],
  [3, 11],
  [4, 11],
  [5, 11],
  [6, 11],
  [7, 11],
  [8, 11],
  [9, 11],
  [2, 13],
  [3, 13],
  [4, 13],
  [5, 13],
  [6, 13],
  [7, 13],
  [8, 13],
  [9, 13],
  [10, 13],
  [11, 13],
  [12, 13],
  [2, 17],
  [3, 17],
  [4, 17],
];

/** powerFigure draws the residues modulo p with arrows that follow the powers of g from 1. */
function powerFigure(g: number, p: number, path: readonly number[]) {
  const spots = ring(p, 86);
  let body = spots.map((q, i) => node(q, String(i))).join("");
  path.forEach((v, i) => {
    body += arrowLine(spots[v] as Point, spots[path[(i + 1) % path.length] as number] as Point, 14, true);
  });
  return figureOf(svgDocument(220, body), [
    `The residues modulo ${p} on a circle, with arrows through the powers of ${g}: ${path.join(", ")}, then back to 1.`,
    `模 ${p} 的剩余类排成一圈，箭头依次经过 ${g} 的幂：${path.join("、")}，然后回到 1。`,
  ]);
}

const powerOnCycle = point(
  "a-large-power-from-a-drawn-cycle-of-powers",
  ["A large power from a drawn cycle of powers", "由所画幂循环求高次幂"],
  [
    "The powers of $g$ modulo $n$ run around a closed cycle starting at $1$. If the cycle has length $L$, then $g^K$ depends only on $K \\bmod L$, so walk that many arrows from $1$.",
    "$g$ 模 $n$ 的幂沿一个从 $1$ 开始的闭合循环运行。如果循环长度为 $L$，$g^K$ 就只取决于 $K \\bmod L$，所以从 $1$ 出发走这么多个箭头即可。",
  ],
  (rng) => {
    const [g, p] = rng.pick(powerCases);
    const path = powerPath(g, p);
    const L = path.length;
    const K = rng.int(L + 1, 200);
    const answer = path[K % L] as number;
    return ask(
      [
        `The arrows start at $1$ and follow the powers of $${g}$ modulo $${p}$. Find $${g}^{${K}} \\bmod ${p}$.`,
        `箭头从 $1$ 出发，依次经过 $${g}$ 模 $${p}$ 的幂。求 $${g}^{${K}} \\bmod ${p}$。`,
      ],
      answer,
      [path[(K + 1) % L] as number, K % p, K % L, (path[(K % L) + 1 === L ? 0 : (K % L) + 1] as number) + 1],
      [
        `The cycle has length $${L}$, and $${K} \\equiv ${K % L} \\pmod{${L}}$. Walking $${K % L}$ arrows from $1$ lands on $${answer}$.`,
        `循环长度为 $${L}$，$${K} \\equiv ${K % L} \\pmod{${L}}$。从 $1$ 走 $${K % L}$ 个箭头到达 $${answer}$。`,
      ],
      powerFigure(g, p, path),
    );
  },
);

const rootOnCycle = point(
  "is-a-drawn-cycle-that-of-a-primitive-root",
  ["Is a drawn cycle that of a primitive root?", "所画循环属于原根吗？"],
  [
    "An integer $g$ is a primitive root modulo a prime $p$ when its powers reach every nonzero residue, so its cycle has length $p - 1$. A shorter cycle has a length dividing $p - 1$, and that length is the order of $g$.",
    "当整数 $g$ 的幂能到达模素数 $p$ 的每个非零剩余类时，它是原根，此时它的循环长度为 $p - 1$。较短的循环长度整除 $p - 1$，这个长度就是 $g$ 的阶。",
  ],
  (rng) => {
    const [g, p] = rng.pick(powerCases);
    const path = powerPath(g, p);
    const L = path.length;
    const isRoot = L === p - 1;
    const yes: Pair = [`$${g}$ is a primitive root modulo $${p}$`, `$${g}$ 是模 $${p}$ 的原根`];
    const no: Pair = [`$${g}$ is not a primitive root: its order is $${L}$`, `$${g}$ 不是原根：它的阶为 $${L}$`];
    const wrongOrder = (m: number): Pair => [`$${g}$ is not a primitive root: its order is $${m}$`, `$${g}$ 不是原根：它的阶为 $${m}$`];
    return choose(
      rng,
      [
        `The arrows start at $1$ and follow the powers of $${g}$ modulo $${p}$. Which statement is true?`,
        `箭头从 $1$ 出发，依次经过 $${g}$ 模 $${p}$ 的幂。哪个说法正确？`,
      ],
      isRoot ? yes : no,
      isRoot ? [wrongOrder(Math.floor((p - 1) / 2)), wrongOrder(p), wrongOrder(g)] : [yes, wrongOrder(p - 1), wrongOrder(L + 1)],
      isRoot
        ? [`The cycle passes through all $${p - 1}$ nonzero residues.`, `循环经过全部 $${p - 1}$ 个非零剩余类。`]
        : [
            `The cycle has only $${L}$ residues out of $${p - 1}$, so the order of $${g}$ is $${L}$.`,
            `循环只有 $${p - 1}$ 个中的 $${L}$ 个剩余类，所以 $${g}$ 的阶为 $${L}$。`,
          ],
      powerFigure(g, p, path),
    );
  },
);

/** rhoWalk iterates x to x^2 + c modulo n until a value repeats, and returns the values with the index of the repeat. */
function rhoWalk(start: number, c: number, n: number) {
  const values = [start];
  for (;;) {
    const next = ((values[values.length - 1] as number) ** 2 + c) % n;
    const at = values.indexOf(next);
    if (at >= 0) return { values, tail: at, loop: values.length - at };
    values.push(next);
  }
}

const rhoDrawn = point(
  "the-shape-of-a-drawn-rho",
  ["The shape of a drawn rho", "所画 rho 形路径的形状"],
  [
    "Iterating $x \\mapsto x^2 + c$ modulo $n$ must repeat eventually, since there are finitely many residues. The path then looks like the letter rho: a tail that is never revisited, followed by a closed loop. Pollard's method looks for this repeat modulo a hidden factor.",
    "由于剩余类有限，模 $n$ 迭代 $x \\mapsto x^2 + c$ 最终必然重复。路径看起来像希腊字母 $\\rho$：一段不再经过的尾巴，接一个闭合的环。波拉德方法就是寻找模某个隐藏因子的这种重复。",
  ],
  (rng) => {
    let walk = rhoWalk(2, 1, 13);
    let c = 1;
    let n = 13;
    let start = 2;
    for (let tries = 0; tries < 200; tries++) {
      n = rng.pick([17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61]);
      c = rng.int(1, 5);
      start = rng.int(0, n - 1);
      walk = rhoWalk(start, c, n);
      if (walk.tail >= 1 && walk.tail <= 4 && walk.loop >= 2 && walk.loop <= 7) break;
    }
    const { values, tail, loop } = walk;
    const _loopValues = values.slice(tail);
    const spots = ring(loop, 58, 220, 100);
    const tailSpots: Point[] = values.slice(0, tail).map((_, i): Point => [20 + ((i + 0.2) * 100) / Math.max(tail, 1), 100]);
    const position = (i: number): Point => (i < tail ? (tailSpots[i] as Point) : (spots[i - tail] as Point));
    let body = values.map((v, i) => node(position(i), String(v))).join("");
    values.forEach((_, i) => {
      const to = i + 1 < values.length ? i + 1 : tail;
      body += arrowLine(position(i), position(to), 14, true);
    });
    const kind = rng.bool();
    const answer = kind ? loop : tail;
    return ask(
      kind
        ? [
            `The arrows show $x \\mapsto x^2 + ${c}$ modulo $${n}$, starting at $${start}$. How many residues are in the closed loop?`,
            `箭头表示模 $${n}$ 的 $x \\mapsto x^2 + ${c}$，从 $${start}$ 出发。闭合的环中有多少个剩余类？`,
          ]
        : [
            `The arrows show $x \\mapsto x^2 + ${c}$ modulo $${n}$, starting at $${start}$. How many residues are on the tail, before the path enters the closed loop?`,
            `箭头表示模 $${n}$ 的 $x \\mapsto x^2 + ${c}$，从 $${start}$ 出发。在进入闭合的环之前，尾巴上有多少个剩余类？`,
          ],
      answer,
      [kind ? tail + loop : loop, kind ? tail : tail + loop, answer + 1, n - answer],
      [
        `The path passes $${values.join(", ")}$, then returns to $${values[tail]}$. So the tail has $${tail}$ residue${tail > 1 ? "s" : ""}, and the loop has $${loop}$.`,
        `路径经过 $${values.join("$、$")}$，然后回到 $${values[tail]}$。所以尾巴有 $${tail}$ 个剩余类，环有 $${loop}$ 个。`,
      ],
      figureOf(svgDocument(210, body), [
        `A path through ${values.join(", ")}, and from the last value back to ${values[tail]}.`,
        `路径经过 ${values.join("、")}，并从最后一个值回到 ${values[tail]}。`,
      ]),
    );
  },
);

const SLOPES: readonly (readonly [number, number])[] = [
  [1, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [3, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
  [1, 6],
  [5, 6],
  [1, 7],
  [2, 5],
  [3, 5],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 7],
  [6, 7],
  [1, 8],
  [3, 8],
  [5, 8],
  [7, 8],
];

const tripleCircle = point(
  "a-pythagorean-triple-from-a-line-through-the-circle",
  ["A Pythagorean triple from a line through the circle", "由过单位圆的直线得到勾股数"],
  [
    "A line through $(-1, 0)$ with rational slope $t = \\frac{p}{q}$ meets the unit circle again at $\\left(\\frac{q^2 - p^2}{q^2 + p^2}, \\frac{2pq}{q^2 + p^2}\\right)$. Clearing denominators gives the Pythagorean triple $q^2 - p^2,\\ 2pq,\\ q^2 + p^2$.",
    "过 $(-1, 0)$、有理斜率 $t = \\frac{p}{q}$ 的直线与单位圆的另一个交点是 $\\left(\\frac{q^2 - p^2}{q^2 + p^2}, \\frac{2pq}{q^2 + p^2}\\right)$。消去分母就得到勾股数 $q^2 - p^2,\\ 2pq,\\ q^2 + p^2$。",
  ],
  (rng) => {
    const [p, q] = rng.pick(SLOPES);
    const X = Q.of(q * q - p * p, q * q + p * p);
    const Y = Q.of(2 * p * q, q * q + p * p);
    const askX = rng.bool();
    const slope = Q.of(p, q);
    const px = X.toNumber();
    const py = Y.toNumber();
    return ask(
      askX
        ? [
            `The line passes through $(-1, 0)$ and $\\left(0, ${slope.toLatex()}\\right)$, and it meets the unit circle again at $A$. Find the $x$-coordinate of $A$.`,
            `直线过 $(-1, 0)$ 和 $\\left(0, ${slope.toLatex()}\\right)$，并与单位圆再次相交于 $A$。求 $A$ 的 $x$ 坐标。`,
          ]
        : [
            `The line passes through $(-1, 0)$ and $\\left(0, ${slope.toLatex()}\\right)$, and it meets the unit circle again at $A$. Find the $y$-coordinate of $A$.`,
            `直线过 $(-1, 0)$ 和 $\\left(0, ${slope.toLatex()}\\right)$，并与单位圆再次相交于 $A$。求 $A$ 的 $y$ 坐标。`,
          ],
      askX ? X : Y,
      askX
        ? [Y, Q.of(q * q + p * p, q * q - p * p), Q.of(q * q - p * p, q * q), slope]
        : [X, slope, Q.of(p * q, q * q + p * p), Q.of(2 * p * q, q * q)],
      [
        `The slope is $t = ${slope.toLatex()}$, so $p = ${p}$ and $q = ${q}$. Then $A = \\left(\\frac{${q * q} - ${p * p}}{${q * q} + ${p * p}}, \\frac{2(${p})(${q})}{${q * q} + ${p * p}}\\right) = \\left(${X.toLatex()}, ${Y.toLatex()}\\right)$.`,
        `斜率为 $t = ${slope.toLatex()}$，所以 $p = ${p}$，$q = ${q}$。于是 $A = \\left(\\frac{${q * q} - ${p * p}}{${q * q} + ${p * p}}, \\frac{2(${p})(${q})}{${q * q} + ${p * p}}\\right) = \\left(${X.toLatex()}, ${Y.toLatex()}\\right)$。`,
      ],
      drawn(
        { xMin: -2, xMax: 2, yMin: -2, yMax: 2, step: 0.5, labelEvery: 2 },
        [
          { kind: "circle", center: [0, 0], r: 1 },
          { kind: "line", a: [-1, 0], b: [0, p / q], accent: true },
          { kind: "point", at: [-1, 0] },
          { kind: "point", at: [0, p / q] },
          { kind: "point", at: [px, py], label: "A", dir: "ne" },
        ],
        t(
          `The unit circle and a line through (−1, 0) with slope ${p}/${q}, meeting the circle again at A.`,
          `单位圆和过 (−1, 0)、斜率为 ${p}/${q} 的直线，直线与圆再次相交于 A。`,
        ),
      ),
    );
  },
);

const PRIMES_TO_60 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];

/** primeCount counts the primes up to x, for x at most 60. */
const primeCount = (x: number) => PRIMES_TO_60.filter((p) => p <= x).length;

const primeSteps = point(
  "primes-in-a-range-from-the-graph-of-the-counting-function",
  ["Primes in a range, from the graph of the counting function", "由计数函数的图求区间内的素数"],
  [
    "The function $\\pi(x)$ counts the primes up to $x$, so its graph climbs one step at each prime. The number of primes $p$ with $a < p \\le b$ is $\\pi(b) - \\pi(a)$, a difference of two heights.",
    "函数 $\\pi(x)$ 统计不超过 $x$ 的素数个数，所以它的图像在每个素数处上升一级。满足 $a < p \\le b$ 的素数 $p$ 的个数是 $\\pi(b) - \\pi(a)$，即两个高度之差。",
  ],
  (rng) => {
    const a = rng.int(2, 40);
    const b = rng.int(a + 5, 60);
    const answer = primeCount(b) - primeCount(a);
    const svg = chart([0, 60], [0, 18], intTicks(0, 60, 10), intTicks(0, 18, 2), (x, y) => {
      let at = 0;
      let line = `${x(0)},${y(0)}`;
      for (const p of PRIMES_TO_60) {
        line += ` ${x(p)},${y(at)} ${x(p)},${y(at + 1)}`;
        at += 1;
      }
      line += ` ${x(60)},${y(at)}`;
      return `<polyline class="accent" stroke="currentColor" fill="none" points="${line}"/>`;
    });
    return ask(
      [
        `The graph shows the prime-counting function $\\pi(x)$. How many primes $p$ satisfy $${a} < p \\le ${b}$?`,
        `图中是素数计数函数 $\\pi(x)$。有多少个素数 $p$ 满足 $${a} < p \\le ${b}$？`,
      ],
      answer,
      [primeCount(b), answer + 1, answer === 0 ? 2 : answer - 1, primeCount(b) + primeCount(a)],
      [
        `The heights are $\\pi(${b}) = ${primeCount(b)}$ and $\\pi(${a}) = ${primeCount(a)}$. Their difference is $${answer}$.`,
        `高度为 $\\pi(${b}) = ${primeCount(b)}$，$\\pi(${a}) = ${primeCount(a)}$。它们的差为 $${answer}$。`,
      ],
      figureOf(svg, ["A staircase graph that climbs one step at each prime up to 60.", "阶梯状的图像，到 60 为止在每个素数处上升一级。"]),
    );
  },
);

const SUMS_OF_TWO_SQUARES = [1, 2, 4, 5, 8, 9, 10, 13, 16, 17, 18, 20, 25, 26, 29, 32, 34, 36, 37, 40, 41, 45, 49, 50, 52, 53, 58];

const latticeCircle = point(
  "lattice-points-on-a-drawn-circle",
  ["Lattice points on a drawn circle", "所画圆上的格点"],
  [
    "The sum-of-squares function $r_2(n)$ counts the integer solutions of $x^2 + y^2 = n$, including signs and order. These are the lattice points on the circle of radius $\\sqrt{n}$, and the symmetry of the circle means they usually come in groups of eight or four.",
    "平方和函数 $r_2(n)$ 统计 $x^2 + y^2 = n$ 的整数解，符号和顺序不同算不同解。这些解就是半径为 $\\sqrt{n}$ 的圆上的格点，由于圆的对称性，它们通常八个或四个一组。",
  ],
  (rng) => {
    const n = rng.pick(SUMS_OF_TWO_SQUARES);
    const R = Math.sqrt(n);
    const solutions: Point[] = [];
    for (let x = -8; x <= 8; x++) for (let y = -8; y <= 8; y++) if (x * x + y * y === n) solutions.push([x, y]);
    const answer = solutions.length;
    const first = solutions.filter(([x, y]) => x >= 0 && y >= 0 && x >= y)[0] as Point;
    return ask(
      [
        `The drawing shows the circle $x^2 + y^2 = ${n}$ on a grid. Find $r_2(${n})$, the number of lattice points on the circle.`,
        `图中是网格上的圆 $x^2 + y^2 = ${n}$。求 $r_2(${n})$，即圆上格点的个数。`,
      ],
      answer,
      [answer / 2, answer + 4, answer === 4 ? 8 : 4, 2 * answer],
      [
        `One solution is $(${first[0]}, ${first[1]})$. All the sign changes and swaps of its coordinates give the $${answer}$ lattice points on the circle.`,
        `一个解是 $(${first[0]}, ${first[1]})$。改变坐标的符号和交换坐标，得到圆上全部 $${answer}$ 个格点。`,
      ],
      drawn(
        { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
        [{ kind: "circle", center: [0, 0], r: R }],
        t(
          `A circle about the origin with radius squared ${n}. It passes through the grid points ${solutions.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
          `以原点为圆心、半径平方为 ${n} 的圆。它经过格点 ${solutions.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
        ),
      ),
    );
  },
);

/** fareyNeighbours lists the adjacent pairs of the Farey sequence of order n. */
function fareyNeighbours(n: number): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  let [a, b, c, d] = [0, 1, 1, n];
  while (c <= n && c / d <= 1 && a < b) {
    out.push([a, b, c, d]);
    const k = Math.floor((n + b) / d);
    [a, b, c, d] = [c, d, k * c - a, k * d - b];
    if (c > d) break;
  }
  return out;
}

const fareyLine = point(
  "the-next-fraction-between-drawn-farey-neighbours",
  ["The next fraction between drawn Farey neighbours", "所画法里相邻分数之间的下一个分数"],
  [
    "Two neighbours $\\frac{a}{b} < \\frac{c}{d}$ in a Farey sequence satisfy $bc - ad = 1$. The first fraction to appear between them, as the order grows, is their mediant $\\frac{a + c}{b + d}$, not their average.",
    "法里数列中的相邻分数 $\\frac{a}{b} < \\frac{c}{d}$ 满足 $bc - ad = 1$。随着阶数增大，第一个出现在它们之间的分数是它们的中间分数 $\\frac{a + c}{b + d}$，而不是平均数。",
  ],
  (rng) => {
    const order = rng.int(4, 8);
    const [a, b, c, d] = rng.pick(fareyNeighbours(order));
    const answer = Q.of(a + c, b + d);
    const low = Q.of(a, b);
    const high = Q.of(c, d);
    const text = (n: number, m: number) => (m === 1 ? String(n) : `${n}/${m}`);
    const px = (v: number) => Math.round((30 + v * 260) * 10) / 10;
    const svg = svgDocument(
      100,
      `<line x1="30" y1="60" x2="290" y2="60"/><line x1="30" y1="54" x2="30" y2="66"/><line x1="290" y1="54" x2="290" y2="66"/>${label(30, 84, "0")}${label(290, 84, "1")}<circle class="accent" cx="${px(a / b)}" cy="60" r="5" fill="currentColor" stroke="none"/><circle class="accent" cx="${px(c / d)}" cy="60" r="5" fill="currentColor" stroke="none"/>${label(px(a / b) - 12, 42, text(a, b))}${label(px(c / d) + 12, 42, text(c, d))}`,
    );
    return ask(
      [
        `The marked fractions are neighbours in the Farey sequence of order $${order}$. Which fraction first appears between them as the order grows?`,
        `标记的分数是 $${order}$ 阶法里数列中的相邻分数。随着阶数增大，哪个分数最先出现在它们之间？`,
      ],
      answer,
      [low.add(high).div(Q.of(2, 1)), Q.of(a * c + 1, b * d), Q.of(a + c + 1, b + d), Q.of(a + c, b + d + 1)],
      [
        `The mediant of the neighbours is $\\frac{${a} + ${c}}{${b} + ${d}} = ${answer.toLatex()}$.`,
        `相邻分数的中间分数为 $\\frac{${a} + ${c}}{${b} + ${d}} = ${answer.toLatex()}$。`,
      ],
      figureOf(svg, [
        `A number line from 0 to 1, with dots at ${text(a, b)} and ${text(c, d)}.`,
        `从 0 到 1 的数轴，点位于 ${text(a, b)} 和 ${text(c, d)}。`,
      ]),
    );
  },
);

/** deeperFiguresProofsAlgebraNumbersPoints adds knowledge points of Methods of Proof, Abstract Algebra and Number Theory that are answered by reading a drawing. */
export const deeperFiguresProofsAlgebraNumbersPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-difference-of-sets": [differenceOnVenn],
  "set-complements": [complementOnVenn],
  "proving-de-morgans-laws-for-sets": [deMorganOnVenn],
  "the-cartesian-product": [productGrid],
  "the-domain-and-range-of-a-relation": [relationDots],
  "the-division-algorithm": [divisionLine],
  "the-integers-modulo-n": [clockWalk],
  "modular-residues": [clockNegative],
  "the-limit-of-a-null-sequence": [nullBand],
  "the-maximum-and-minimum-of-a-set": [extremeOnLine],
  "truth-sets-of-predicates": [truthSetLine],
  injections: [injectiveGraph],
  "orders-of-group-elements": [orderOnClock],
  "finite-cyclic-groups": [generatorOnClock],
  "identities-of-binary-operations": [tableIdentity],
  "inverses-under-binary-operations": [tableInverse],
  "abelian-groups": [tableAbelian],
  "cycle-types-of-permutations": [cycleTypeDrawn],
  "the-inverse-of-a-cycle": [inverseDrawn],
  orbits: [necklaceOrbit],
  "colorings-of-necklaces": [necklaceFixed],
  "powers-modulo-n": [powerOnCycle],
  "primitive-roots": [rootOnCycle],
  "pollards-rho-method": [rhoDrawn],
  "pythagorean-triples": [tripleCircle],
  "the-distribution-of-primes": [primeSteps],
  "the-sum-of-squares-function": [latticeCircle],
  "farey-sequences": [fareyLine],
};
