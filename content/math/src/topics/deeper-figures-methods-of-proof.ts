// Knowledge points of Methods of Proof that ask the learner to read a drawing: Venn diagrams, digraphs of relations and
// arrow diagrams of functions. See `deeperFiguresMethodsOfProofPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { svgDocument } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { arrowLine, drawn, label, node, ring } from "./figure-reading-more.ts";

/** regionPoints lists which of the three sets each of the eight regions of a Venn diagram lies in, with the point for its shading. */
const regionPoints: readonly (readonly [boolean, boolean, boolean, Point])[] = [
  [true, false, false, [85, 75]],
  [false, true, false, [235, 75]],
  [false, false, true, [160, 180]],
  [true, true, false, [160, 62]],
  [true, false, true, [112, 135]],
  [false, true, true, [208, 135]],
  [true, true, true, [160, 108]],
  [false, false, false, [24, 200]],
];

/** vennFigure draws three overlapping circles with a dot in each region of the diagram that belongs to the set. */
function vennFigure(names: readonly [string, string, string], member: (a: boolean, b: boolean, c: boolean) => boolean): string {
  const circles: readonly [number, number][] = [
    [120, 85],
    [200, 85],
    [160, 150],
  ];
  const [p, q, r] = [label(70, 22, names[0]), label(250, 22, names[1]), label(255, 205, names[2])];
  const outlines = circles.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="62" fill="none"/>`).join("");
  const box = `<rect x="6" y="6" width="308" height="210" fill="none"/>`;
  const shade = regionPoints
    .filter(([a, b, c]) => member(a, b, c))
    .map(([, , , [x, y]]) => `<circle class="accent" cx="${x}" cy="${y}" r="7" fill="currentColor" stroke="none"/>`)
    .join("");
  return svgDocument(222, box + outlines + shade + p + q + r);
}

interface SetExpression {
  readonly tex: (a: string, b: string, c: string) => string;
  readonly member: (a: boolean, b: boolean, c: boolean) => boolean;
}

const expressions: readonly SetExpression[] = [
  { tex: (a, b, c) => `${a} \\cap (${b} \\cup ${c})`, member: (a, b, c) => a && (b || c) },
  { tex: (a, b, c) => `${a} \\cup (${b} \\cap ${c})`, member: (a, b, c) => a || (b && c) },
  { tex: (a, b, c) => `(${a} \\cup ${b}) \\cap ${c}`, member: (a, b, c) => (a || b) && c },
  { tex: (a, b, c) => `(${a} \\cap ${b}) \\cup ${c}`, member: (a, b, c) => (a && b) || c },
  { tex: (a, b, c) => `${a} \\cap ${b} \\cap ${c}`, member: (a, b, c) => a && b && c },
  { tex: (a, b, c) => `${a} \\cup ${b} \\cup ${c}`, member: (a, b, c) => a || b || c },
  { tex: (a, b, c) => `(${a} \\cap ${b}) \\setminus ${c}`, member: (a, b, c) => a && b && !c },
  { tex: (a, b, c) => `${a} \\setminus (${b} \\cup ${c})`, member: (a, b, c) => a && !b && !c },
];

const setOfVenn = point(
  "the-set-marked-on-a-three-circle-diagram",
  ["The set marked on a three-circle diagram", "三圆图上标出的集合"],
  [
    "The distributive laws say that $A \\cap (B \\cup C)$ and $(A \\cap B) \\cup (A \\cap C)$ mark the same regions of a Venn diagram. To name a marked set, test each region: is it in the first set, in the second and in the third? An expression matches only if it agrees with the drawing on all eight regions.",
    "分配律说 $A \\cap (B \\cup C)$ 与 $(A \\cap B) \\cup (A \\cap C)$ 在文氏图上标出相同的区域。要说出标记的集合，就检查每个区域：它是否在第一个集合里、第二个里和第三个里？只有在全部八个区域上都与图一致的表达式才匹配。",
  ],
  (rng) => {
    const names = rng.shuffle(["A", "B", "C"]) as [string, string, string];
    const right = rng.pick(expressions);
    const texOf = (e: SetExpression) => e.tex("A", "B", "C");
    const member = (a: boolean, b: boolean, c: boolean) => {
      // The circles drawn in the places of names[i] are read through their labels.
      const value: Record<string, boolean> = { [names[0]]: a, [names[1]]: b, [names[2]]: c };
      return right.member(value.A as boolean, value.B as boolean, value.C as boolean);
    };
    const inside = regionPoints.filter(([a, b, c]) => member(a, b, c)).map(([a, b, c]) => names.filter((_, i) => [a, b, c][i]));
    const regionsEn = inside.map((n) =>
      n.length === 0 ? "outside all three circles" : n.length === 3 ? "inside all three circles" : `inside only ${n.join(" and ")}`,
    );
    const regionsZh = inside.map((n) => (n.length === 0 ? "三个圆之外" : n.length === 3 ? "三个圆的公共部分" : `只在 ${n.join("、")} 内`));
    return choose(
      rng,
      [
        "A dot marks each region of the diagram that belongs to a set. Which expression names that set?",
        "图中的点标出属于某集合的每个区域。哪个表达式表示这个集合？",
      ],
      same(texOf(right)),
      rng
        .sample(
          expressions.filter((e) => e !== right),
          3,
        )
        .map((e) => same(texOf(e))),
      [
        `Testing each of the eight regions against $${texOf(right)}$ gives exactly the regions with dots, and every other choice differs from the drawing on at least one region.`,
        `对八个区域逐一检验 $${texOf(right)}$，恰好得到有点的区域，其他选项都至少在一个区域上与图不同。`,
      ],
      {
        svg: vennFigure(names, member),
        alt: t(
          `Three overlapping circles labeled ${names.join(", ")}, with a dot in each of these regions: ${regionsEn.join("; ")}.`,
          `标有 ${names.join("、")} 的三个相交的圆，以下每个区域各有一个点：${regionsZh.join("；")}。`,
        ),
      },
    );
  },
);

const countsOnVenn = {
  ...point(
    "reading-counts-from-a-two-circle-diagram",
    ["Reading counts from a two-circle diagram", "由两圆图读计数"],
    [
      "A Venn diagram with counts splits the elements into separate regions, so that each element is counted once. To find the size of a set, add the regions inside it. The size of a union adds the three regions once each, and the complement counts what lies outside the given set, including the region outside both circles.",
      "带计数的文氏图把元素分成互不相交的区域，所以每个元素只算一次。要求一个集合的大小，就把它内部的区域相加。并集的大小把三个区域各加一次，补集计算给定集合之外的部分，包括两个圆之外的区域。",
    ],
    (rng) => {
      const [onlyA, both, onlyB, outside] = [rng.int(2, 12), rng.int(1, 9), rng.int(2, 12), rng.int(1, 9)];
      const q = rng.pick([
        { tex: "|A \\cup B|", value: onlyA + both + onlyB, parts: [onlyA, both, onlyB] },
        { tex: "|A \\cap B|", value: both, parts: [both] },
        { tex: "|A \\setminus B|", value: onlyA, parts: [onlyA] },
        { tex: "|B \\setminus A|", value: onlyB, parts: [onlyB] },
        { tex: "|A|", value: onlyA + both, parts: [onlyA, both] },
        { tex: "|B|", value: onlyB + both, parts: [onlyB, both] },
        { tex: "|A^c|", value: onlyB + outside, parts: [onlyB, outside] },
        { tex: "|(A \\cup B)^c|", value: outside, parts: [outside] },
        { tex: "|A \\triangle B|", value: onlyA + onlyB, parts: [onlyA, onlyB] },
      ]);
      const body = `<rect x="10" y="10" width="300" height="170" fill="none"/><circle cx="125" cy="95" r="66" fill="none"/><circle cx="195" cy="95" r="66" fill="none"/>${label(90, 100, String(onlyA))}${label(160, 100, String(both))}${label(232, 100, String(onlyB))}${label(290, 168, String(outside))}${label(72, 32, "A")}${label(246, 32, "B")}`;
      return ask(
        [
          `The numbers give the count of elements in each region. What is $${q.tex}$?`,
          `图中的数给出每个区域的元素个数。$${q.tex}$ 是多少？`,
        ],
        q.value,
        [onlyA + both + onlyB + outside, q.value + both, q.value + outside, q.value + 1],
        [
          q.parts.length === 1
            ? `This set is one region of the diagram, which holds $${q.value}$ elements.`
            : `This set consists of the regions with counts $${q.parts.join(", ")}$, which add up to $${q.value}$.`,
          q.parts.length === 1
            ? `这个集合是图中的一个区域，含有 $${q.value}$ 个元素。`
            : `这个集合由计数为 $${q.parts.join(", ")}$ 的区域组成，总和为 $${q.value}$。`,
        ],
        {
          svg: svgDocument(190, body),
          alt: t(
            `Two circles A and B, with ${onlyA} only in A, ${both} in both, ${onlyB} only in B and ${outside} outside.`,
            `两个圆 A 和 B，只在 A 中有 ${onlyA} 个，两者都有的 ${both} 个，只在 B 中有 ${onlyB} 个，外面有 ${outside} 个。`,
          ),
        },
      );
    },
  ),
  figure: linearAlgebraDrawings1["cardinality-of-finite-sets#reading-counts-from-a-two-circle-diagram"],
};

/** arrowFunction draws a function between two columns of points, numbered on the left and lettered on the right. */
function arrowFunction(map: readonly number[], letters: readonly string[]): string {
  const left = map.map((_, i): Point => [70, 110 + (i - (map.length - 1) / 2) * 34]);
  const right = letters.map((_, i): Point => [250, 110 + (i - (letters.length - 1) / 2) * 34]);
  const lines = map.map((v, i) => arrowLine(left[i] as Point, right[v] as Point, 14, true)).join("");
  return svgDocument(
    220,
    lines + left.map((p, i) => node(p, String(i + 1))).join("") + right.map((p, i) => node(p, letters[i] as string)).join(""),
  );
}

/** functionAlt describes a function between columns in English. */
const functionAlt = (map: readonly number[], letters: readonly string[]) => map.map((v, i) => `${i + 1} to ${letters[v]}`).join(", ");

/** functionAltZh describes a function between columns in Chinese. */
const functionAltZh = (map: readonly number[], letters: readonly string[]) => map.map((v, i) => `${i + 1} 到 ${letters[v]}`).join("，");

const LETTERS = ["a", "b", "c", "d", "e", "f"];

const missedElements = point(
  "elements-a-drawn-function-misses",
  ["Elements a drawn function misses", "图中函数没有到达的元素"],
  [
    "A function is surjective when every element of the codomain is hit by at least one arrow. In an arrow diagram, look at the right column and find the points that no arrow reaches. If there are none, the function is onto. A function can hit a point many times and still miss others, so count the column on the right, not the arrows.",
    "函数是满射，当且仅当陪域的每个元素都至少被一个箭头到达。在箭头图中，看右列，找没有箭头到达的点。如果没有这样的点，函数就是满射。函数可以多次到达一个点，同时错过其他点，所以要数右列，而不是数箭头。",
  ],
  (rng) => {
    const m = rng.int(3, 6);
    const n = rng.int(3, 6);
    const map = Array.from({ length: m }, () => rng.int(0, n - 1));
    const letters = LETTERS.slice(0, n);
    const hit = new Set(map);
    const missed = n - hit.size;
    return ask(
      [
        "The arrows show a function from the left column to the right column. How many elements of the codomain are not in the image?",
        "箭头表示从左列到右列的函数。陪域中有多少个元素不在像中？",
      ],
      missed,
      [
        hit.size === missed ? missed + 1 : hit.size,
        Math.abs(m - n) === missed ? missed + 2 : Math.abs(m - n),
        m === missed ? missed + 3 : m,
      ],
      [
        `The arrows reach $${hit.size}$ of the $${n}$ points on the right, so $${missed}$ are left out, whatever the number of arrows.`,
        `箭头到达右边 $${n}$ 个点中的 $${hit.size}$ 个，所以有 $${missed}$ 个没被到达，与箭头的数量无关。`,
      ],
      {
        svg: arrowFunction(map, letters),
        alt: t(
          `A function from ${m} points to ${n} points, sending ${functionAlt(map, letters)}.`,
          `从 ${m} 个点到 ${n} 个点的函数，把 ${functionAltZh(map, letters)}。`,
        ),
      },
    );
  },
);

const collisions = point(
  "pairs-that-break-injectivity",
  ["Pairs that break injectivity", "破坏单射的元素对"],
  [
    "A function is injective when different inputs have different outputs. In an arrow diagram, two arrows ending at the same point form a collision, and a function with any collision is not injective. Three arrows ending at one point give three colliding pairs, because each pair of inputs among them shares an output.",
    "函数是单射，当且仅当不同的输入有不同的输出。在箭头图中，两个箭头终点相同就构成一次碰撞，有碰撞的函数不是单射。三个箭头终于同一点时给出三个碰撞对，因为其中每一对输入都共享一个输出。",
  ],
  (rng) => {
    const m = rng.int(3, 6);
    const n = rng.int(3, 5);
    const map = Array.from({ length: m }, () => rng.int(0, n - 1));
    const letters = LETTERS.slice(0, n);
    const counts = letters.map((_, y) => map.filter((v) => v === y).length);
    const pairs = counts.reduce((sum, c) => sum + (c * (c - 1)) / 2, 0);
    const distinct = new Set(map).size;
    return ask(
      [
        "The arrows show a function from the left column to the right column. How many pairs of different inputs have the same output?",
        "箭头表示从左列到右列的函数。有多少对不同的输入具有相同的输出？",
      ],
      pairs,
      [m - distinct === pairs ? pairs + 1 : m - distinct, pairs + 2, m === pairs ? pairs + 3 : m],
      [
        `The outputs are reached by $${counts.join(", ")}$ arrows, and a point reached by $k$ arrows gives $\\frac{k(k-1)}{2}$ pairs. Adding these gives $${pairs}$.`,
        `各输出分别被 $${counts.join(", ")}$ 个箭头到达，被 $k$ 个箭头到达的点给出 $\\frac{k(k-1)}{2}$ 对。相加得 $${pairs}$。`,
      ],
      {
        svg: arrowFunction(map, letters),
        alt: t(
          `A function from ${m} points to ${n} points, sending ${functionAlt(map, letters)}.`,
          `从 ${m} 个点到 ${n} 个点的函数，把 ${functionAltZh(map, letters)}。`,
        ),
      },
    );
  },
);

const imageAndPreimage = point(
  "images-and-preimages-from-arrows",
  ["Images and preimages from arrows", "由箭头读像和原像"],
  [
    "The image of a set under a function collects the ends of the arrows that start in the set. The preimage of a set collects the starts of the arrows that end in the set. So the two read an arrow diagram in opposite directions, and the preimage of a point that no arrow reaches is the empty set.",
    "集合在函数下的像收集从集合出发的箭头的终点。集合的原像收集终点在集合内的箭头的起点。所以二者沿相反方向读箭头图，没有箭头到达的点的原像是空集。",
  ],
  (rng) => {
    const m = rng.int(4, 6);
    const n = rng.int(3, 5);
    const map = Array.from({ length: m }, () => rng.int(0, n - 1));
    const letters = LETTERS.slice(0, n);
    const list = (xs: readonly (string | number)[]) => (xs.length === 0 ? "\\varnothing" : `\\{${xs.join(", ")}\\}`);
    const image = rng.bool();
    const S = rng
      .sample(
        Array.from({ length: m }, (_, i) => i + 1),
        2,
      )
      .sort((a, b) => a - b);
    const T = rng.sample(letters, 2).sort();
    const imageOf = (xs: readonly number[]) => [...new Set(xs.map((x) => letters[map[x - 1] as number] as string))].sort();
    const preOf = (ys: readonly string[]) =>
      Array.from({ length: m }, (_, i) => i + 1).filter((x) => ys.includes(letters[map[x - 1] as number] as string));
    const answer = image ? list(imageOf(S)) : list(preOf(T));
    const candidates = [
      list(preOf(T)),
      list(imageOf(S)),
      list(S),
      list(T),
      list(letters),
      list(imageOf(Array.from({ length: m }, (_, i) => i + 1))),
      list(rng.sample(letters, 1)),
      list(rng.sample(letters, 3).sort()),
      list(
        rng
          .sample(
            Array.from({ length: m }, (_, i) => i + 1),
            3,
          )
          .sort((a, b) => a - b),
      ),
      list([1]),
      list([]),
    ];
    const wrong = [...new Set(candidates)].filter((c) => c !== answer);
    return choose(
      rng,
      image
        ? [`The arrows show a function $f$. What is the image $f(${list(S)})$?`, `箭头表示函数 $f$。像 $f(${list(S)})$ 是什么？`]
        : [
            `The arrows show a function $f$. What is the preimage $f^{-1}(${list(T)})$?`,
            `箭头表示函数 $f$。原像 $f^{-1}(${list(T)})$ 是什么？`,
          ],
      same(answer),
      rng.shuffle(wrong).map((c) => same(c)),
      image
        ? [
            `Following the arrows out of the points of the set ends at the points in $${answer}$, and each of these is listed once.`,
            `沿集合中各点出发的箭头走，终点是 $${answer}$ 中的点，每个只列一次。`,
          ]
        : [
            `The arrows that end in the given set start at the points of $${answer}$, which is the preimage by definition.`,
            `终点在给定集合内的箭头从 $${answer}$ 中的点出发，这就是原像的定义。`,
          ],
      {
        svg: arrowFunction(map, letters),
        alt: t(
          `A function from ${m} points to ${n} points, sending ${functionAlt(map, letters)}.`,
          `从 ${m} 个点到 ${n} 个点的函数，把 ${functionAltZh(map, letters)}。`,
        ),
      },
    );
  },
);

/** relationFigure draws a relation as a digraph on points in a ring, with a small loop for a pair of the form (x, x). */
function relationFigure(n: number, pairs: readonly (readonly [number, number])[]): string {
  const at = ring(n, 80);
  let body = "";
  for (const [a, b] of pairs) {
    if (a === b) {
      const [x, y] = at[a] as Point;
      const [ux, uy] = [(x - 160) / 80, (y - 110) / 80];
      body += `<circle class="accent" stroke="currentColor" cx="${Math.round(x + 18 * ux)}" cy="${Math.round(y + 18 * uy)}" r="9" fill="none"/>`;
    } else {
      body += arrowLine(at[a] as Point, at[b] as Point, 14, true);
    }
  }
  return svgDocument(220, body + at.map((p, i) => node(p, String(i + 1))).join(""));
}

/** pairAlt describes the pairs of a relation. */
const pairAlt = (pairs: readonly (readonly [number, number])[]) => pairs.map(([a, b]) => `(${a + 1}, ${b + 1})`).join(", ");

/** relationText writes the pairs of a relation as a set. */
const relationText = (pairs: readonly (readonly [number, number])[]) =>
  `\\{${[...pairs]
    .sort((p, q) => p[0] - q[0] || p[1] - q[1])
    .map(([a, b]) => `(${a + 1}, ${b + 1})`)
    .join(", ")}\\}`;

const allPairs = (n: number) => Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_u, b): [number, number] => [a, b])).flat();

const pairsOfDigraph = point(
  "the-pairs-of-a-drawn-relation",
  ["The pairs of a drawn relation", "图中关系的有序对"],
  [
    "A digraph draws a relation on a set: an arrow from $a$ to $b$ means that the ordered pair $(a, b)$ is in the relation, and a small loop at $a$ means that $(a, a)$ is in it. The order within a pair matters, so an arrow in one direction does not give the pair in the opposite direction.",
    "有向图表示集合上的关系：从 $a$ 到 $b$ 的箭头表示有序对 $(a, b)$ 在关系中，$a$ 处的小圈表示 $(a, a)$ 在关系中。有序对的次序很重要，一个方向的箭头不会给出相反方向的有序对。",
  ],
  (rng) => {
    const n = rng.int(3, 4);
    const pairs = rng.sample(allPairs(n), rng.int(3, 4));
    const off = pairs.filter(([a, b]) => a !== b);
    if (off.length === 0) pairs[0] = [0, 1];
    const reversed = pairs.map(([a, b]): [number, number] => [b, a]);
    const someOther = (rngPick: readonly (readonly [number, number])[]) => {
      const remaining = allPairs(n).filter(([a, b]) => !rngPick.some(([c, d]) => c === a && d === b));
      return [...rngPick.slice(1), rng.pick(remaining)];
    };
    const right = relationText(pairs);
    const turned = (k: number) => relationText(pairs.map(([a, b]): [number, number] => [(a + k) % n, (b + k) % n]));
    const candidates = [
      relationText(reversed),
      turned(1),
      turned(2),
      relationText(someOther(pairs)),
      relationText(someOther(pairs)),
      relationText(someOther(pairs)),
      relationText(pairs.slice(1)),
      relationText(someOther(pairs)),
    ];
    return choose(
      rng,
      [
        "Which set of ordered pairs is the relation drawn? An arrow from $a$ to $b$ stands for $(a, b)$, and a small loop at a point stands for a pair of the point with itself.",
        "图中的关系是哪个有序对集合？从 $a$ 到 $b$ 的箭头表示 $(a, b)$，点上的小圈表示该点与自身组成的对。",
      ],
      same(right),
      [...new Set(candidates)].filter((c) => c !== right).map((c) => same(c)),
      [
        `Reading each arrow from its tail to its head, and each loop as a pair of a point with itself, gives exactly the pairs in $${right}$.`,
        `从箭头尾读到箭头头，把每个小圈读作点与自身的对，恰好得到 $${right}$ 中的有序对。`,
      ],
      {
        svg: relationFigure(n, pairs),
        alt: t(`A digraph on ${n} points with the pairs ${pairAlt(pairs)}.`, `${n} 个点上的有向图，有序对为 ${pairAlt(pairs)}。`),
      },
    );
  },
);

const missingLoops = point(
  "loops-missing-from-a-reflexive-relation",
  ["Loops missing from a reflexive relation", "自反关系缺少的小圈"],
  [
    "A relation is reflexive when every point is related to itself, which means every point of its digraph has a loop. It is irreflexive when no point has one. So a relation with some loops and not others is neither. Count the points without a loop to find how many pairs must be added to make it reflexive.",
    "关系是自反的，是指每一点都与自身相关，也就是有向图的每一点都有小圈。它是反自反的，是指没有一点有小圈。所以有些点有小圈、有些没有的关系两者都不是。数没有小圈的点，就知道要加多少对才能使它自反。",
  ],
  (rng) => {
    const n = rng.int(3, 6);
    const looped = rng.sample(
      Array.from({ length: n }, (_, i) => i),
      rng.int(0, n - 1),
    );
    const others = rng.sample(
      allPairs(n).filter(([a, b]) => a !== b),
      rng.int(2, 4),
    );
    const pairs = [...others, ...looped.map((i): [number, number] => [i, i])];
    const missing = n - looped.length;
    return ask(
      [
        "A small loop at a point stands for a pair of the point with itself. How many pairs must be added to make the relation drawn reflexive?",
        "点上的小圈表示该点与自身组成的对。要使图中的关系自反，必须添加多少对？",
      ],
      missing,
      [looped.length === missing ? missing + 1 : looped.length, n === missing ? missing + 2 : n, missing === 1 ? 2 : missing - 1],
      [
        `Reflexivity requires a loop at each of the $${n}$ points. There are $${looped.length}$ loops already, so $${missing}$ pairs must be added, and the arrows between different points play no part.`,
        `自反性要求 $${n}$ 个点每个都有小圈。已经有 $${looped.length}$ 个小圈，所以必须添加 $${missing}$ 对，不同点之间的箭头不起作用。`,
      ],
      {
        svg: relationFigure(n, pairs),
        alt: t(`A digraph on ${n} points with the pairs ${pairAlt(pairs)}.`, `${n} 个点上的有向图，有序对为 ${pairAlt(pairs)}。`),
      },
    );
  },
);

const transitiveClosurePair = point(
  "the-arrow-that-transitivity-demands",
  ["The arrow that transitivity demands", "传递性要求的箭头"],
  [
    "A relation is transitive when arrows from $a$ to $b$ and from $b$ to $c$ always come with an arrow from $a$ to $c$. So search the digraph for a path of two arrows with no shortcut. Any such missing shortcut is a counterexample to transitivity, and adding it is a step toward making the relation transitive.",
    "关系是传递的，是指从 $a$ 到 $b$ 和从 $b$ 到 $c$ 的箭头总伴随从 $a$ 到 $c$ 的箭头。所以在有向图中寻找没有捷径的两步路径。任何这样缺失的捷径都是传递性的反例，添加它是使关系传递的一步。",
  ],
  (rng) => {
    const n = rng.int(4, 5);
    const [a, b, c, d] = rng.sample(
      Array.from({ length: n }, (_, i) => i),
      4,
    ) as [number, number, number, number];
    const pairs: [number, number][] = [
      [a, b],
      [b, c],
      [d, b],
      [d, c],
    ];
    const pair = (x: number, y: number) => same(`(${x + 1}, ${y + 1})`);
    return choose(
      rng,
      ["For the relation drawn to be transitive, which pair must be added?", "要使图中的关系传递，必须添加哪一对？"],
      pair(a, c),
      [pair(c, a), pair(a, d), pair(c, b), pair(b, d)],
      [
        `The arrows from $${a + 1}$ to $${b + 1}$ and from $${b + 1}$ to $${c + 1}$ form a path with no shortcut. So $(${a + 1}, ${c + 1})$ must be added, while the path from $${d + 1}$ already has its shortcut.`,
        `从 $${a + 1}$ 到 $${b + 1}$ 和从 $${b + 1}$ 到 $${c + 1}$ 的箭头构成没有捷径的路径。所以必须添加 $(${a + 1}, ${c + 1})$，而从 $${d + 1}$ 出发的路径已经有捷径。`,
      ],
      {
        svg: relationFigure(n, pairs),
        alt: t(`A digraph on ${n} points with the pairs ${pairAlt(pairs)}.`, `${n} 个点上的有向图，有序对为 ${pairAlt(pairs)}。`),
      },
    );
  },
);

const equivalenceClasses = point(
  "equivalence-classes-from-a-drawing",
  ["Equivalence classes from a drawing", "由图读等价类"],
  [
    "The digraph of an equivalence relation breaks into separate clusters, and within a cluster every point is joined to every other. Each cluster is an equivalence class, so the number of clusters is the number of classes, and the class of a point is the cluster that contains it. Lines here stand for arrows in both directions.",
    "等价关系的有向图分成互不相连的几团，每一团内每一点都与其他各点相连。每一团就是一个等价类，所以团的个数就是等价类的个数，一点的等价类就是包含它的那一团。这里的线段表示两个方向的箭头。",
  ],
  (rng) => {
    const n = rng.int(6, 9);
    const labels = rng.shuffle(Array.from({ length: n }, (_, i) => i + 1));
    const sizes: number[] = [];
    let left = n;
    while (left > 0 && sizes.length < 4) {
      const take = sizes.length === 3 ? left : Math.min(left, rng.int(1, 4));
      sizes.push(take);
      left -= take;
    }
    const at = ring(n, 85);
    let cursor = 0;
    let body = "";
    const groups: number[][] = [];
    for (const size of sizes) {
      const part = Array.from({ length: size }, (_, i) => cursor + i);
      groups.push(part.map((i) => labels[i] as number));
      for (const i of part)
        for (const j of part)
          if (i < j) {
            const [p, q] = [at[i] as Point, at[j] as Point];
            const length = Math.hypot(q[0] - p[0], q[1] - p[1]);
            const [ux, uy] = [((q[0] - p[0]) / length) * 12, ((q[1] - p[1]) / length) * 12];
            body += `<line class="accent" stroke="currentColor" x1="${p[0] + ux}" y1="${p[1] + uy}" x2="${q[0] - ux}" y2="${q[1] - uy}"/>`;
          }
      cursor += size;
    }
    body += at.map((p, i) => node(p, String(labels[i]))).join("");
    const askCount = rng.bool();
    const target = rng.int(1, n);
    const size = (groups.find((g) => g.includes(target)) as number[]).length;
    const value = askCount ? groups.length : size;
    return ask(
      askCount
        ? [
            "The lines join related points of an equivalence relation, with every point also related to itself. How many equivalence classes are there?",
            "线段连接等价关系中相关的点，每一点也与自身相关。有多少个等价类？",
          ]
        : [
            `The lines join related points of an equivalence relation, with every point also related to itself. How many elements does the class of $${target}$ have?`,
            `线段连接等价关系中相关的点，每一点也与自身相关。$${target}$ 的等价类有多少个元素？`,
          ],
      value,
      [value + 1, n === value ? value + 2 : n, value === 1 ? 2 : value - 1],
      askCount
        ? [
            `The points split into $${groups.length}$ separate clusters, with no line between clusters, and each cluster is one class.`,
            `这些点分成 $${groups.length}$ 个互不相连的团，团之间没有线段，每一团是一个等价类。`,
          ]
        : [
            `The point $${target}$ lies in the cluster $\\{${(groups.find((g) => g.includes(target)) as number[]).join(", ")}\\}$, which includes the point itself, so its class has $${size}$ elements.`,
            `点 $${target}$ 所在的团是 $\\{${(groups.find((g) => g.includes(target)) as number[]).join(", ")}\\}$，包括它本身，所以它的等价类有 $${size}$ 个元素。`,
          ],
      {
        svg: svgDocument(220, body),
        alt: t(
          `Clusters of joined points: ${groups.map((g) => `{${g.join(", ")}}`).join(", ")}.`,
          `相连的点构成的团：${groups.map((g) => `{${g.join(", ")}}`).join("，")}。`,
        ),
      },
    );
  },
);

const compositionOfRelations = point(
  "composing-relations-through-three-columns",
  ["Composing relations through three columns", "通过三列复合关系"],
  [
    "To compose two relations, chain their arrows: a pair $(x, z)$ belongs to the composition exactly when an arrow from $x$ reaches some middle point $y$ and an arrow from $y$ reaches $z$. In a three-column drawing, each path from the left column through the middle to the right column gives one pair, and several paths may give the same pair.",
    "复合两个关系就是把箭头接起来：有序对 $(x, z)$ 属于复合，当且仅当从 $x$ 的箭头到达某个中间点 $y$，从 $y$ 的箭头到达 $z$。在三列图中，从左列经中间列到右列的每条路径给出一对，几条路径可能给出同一对。",
  ],
  (rng) => {
    const col = (x: number, count: number, i: number): Point => [x, 110 + (i - (count - 1) / 2) * 44];
    const [l, m, r] = [rng.int(2, 4), rng.int(2, 3), rng.int(2, 4)];
    const pick = (a: number, b: number) => {
      const all = Array.from({ length: a }, (_, i) => Array.from({ length: b }, (_u, j): [number, number] => [i, j])).flat();
      return rng.sample(all, Math.min(all.length, rng.int(2, 4)));
    };
    const first = pick(l, m);
    const second = pick(m, r);
    const composition = new Set<string>();
    const pairs: [number, number][] = [];
    for (const [a, b] of first)
      for (const [c, d] of second)
        if (b === c && !composition.has(`${a},${d}`)) {
          composition.add(`${a},${d}`);
          pairs.push([a, d]);
        }
    const wrong = [first.length * second.length, first.length + second.length, pairs.length + 1].filter((v) => v !== pairs.length);
    let body = "";
    for (const [a, b] of first) body += arrowLine(col(50, l, a), col(160, m, b), 14, true);
    for (const [a, b] of second) body += arrowLine(col(160, m, a), col(270, r, b), 14, true);
    const names = ["x", "y", "z", "w"];
    for (let i = 0; i < l; i++) body += node(col(50, l, i), `${i + 1}`);
    for (let i = 0; i < m; i++) body += node(col(160, m, i), names[i] as string);
    for (let i = 0; i < r; i++) body += node(col(270, r, i), LETTERS[i] as string);
    return ask(
      [
        "The left arrows show a relation $R$ and the right arrows show a relation $S$. How many ordered pairs are in the composition of $S$ with $R$, which goes from the left column to the right column?",
        "左边的箭头表示关系 $R$，右边的箭头表示关系 $S$。从左列到右列的复合关系有多少个有序对？",
      ],
      pairs.length,
      wrong,
      [
        `Each path through a middle point gives a pair, and paths with the same ends give the same pair. The distinct pairs of ends number $${pairs.length}$.`,
        `经过中间点的每条路径给出一对，端点相同的路径给出同一对。不同的端点对共有 $${pairs.length}$ 个。`,
      ],
      {
        svg: svgDocument(220, body),
        alt: t(
          `Three columns of ${l}, ${m} and ${r} points. The first relation joins ${pairAlt(first)} and the second joins ${pairAlt(second)}, numbering each column from the top.`,
          `三列，分别有 ${l}、${m}、${r} 个点。第一个关系连接 ${pairAlt(first)}，第二个连接 ${pairAlt(second)}，每列从上往下编号。`,
        ),
      },
    );
  },
);

interface PlanarRegion {
  readonly tex: (k: number, m: number) => string;
  readonly marks: (k: number, m: number) => PlaneMark[];
  readonly clue: Pair;
}

const planarRegions: readonly PlanarRegion[] = [
  {
    tex: (k, m) => `\\{(x, y) : x \\geq ${k},\\; y \\leq ${m}\\}`,
    marks: (k, m) => [
      {
        kind: "region",
        halfPlanes: [
          [1, 0, -k],
          [0, -1, m],
        ],
      },
    ],
    clue: ["the part to the right of a vertical line and below a horizontal line", "竖直线右边、水平线下方的部分"],
  },
  {
    tex: (k, m) => `\\{(x, y) : x \\leq ${k},\\; y \\geq ${m}\\}`,
    marks: (k, m) => [
      {
        kind: "region",
        halfPlanes: [
          [-1, 0, k],
          [0, 1, -m],
        ],
      },
    ],
    clue: ["the part to the left of a vertical line and above a horizontal line", "竖直线左边、水平线上方的部分"],
  },
  {
    tex: (k, m) => `\\{(x, y) : x \\geq ${k},\\; y \\geq ${m}\\}`,
    marks: (k, m) => [
      {
        kind: "region",
        halfPlanes: [
          [1, 0, -k],
          [0, 1, -m],
        ],
      },
    ],
    clue: ["the part to the right of a vertical line and above a horizontal line", "竖直线右边、水平线上方的部分"],
  },
  {
    tex: (k, m) => `\\{(x, y) : x \\leq ${k},\\; y \\leq ${m}\\}`,
    marks: (k, m) => [
      {
        kind: "region",
        halfPlanes: [
          [-1, 0, k],
          [0, -1, m],
        ],
      },
    ],
    clue: ["the part to the left of a vertical line and below a horizontal line", "竖直线左边、水平线下方的部分"],
  },
];

const regionSetBuilder = point(
  "set-builder-notation-for-a-drawn-region",
  ["Set-builder notation for a drawn region", "图中区域的集合构造记法"],
  [
    "Set-builder notation describes a planar region by the conditions its points satisfy. For a shaded quarter of the plane, read the boundaries first, which give the values $k$ and $m$, and then decide on which side of each boundary the shading lies. A point test is a useful check: pick a shaded point and substitute it.",
    "集合构造记法用点满足的条件描述平面区域。对平面上阴影的四分之一，先读边界，它们给出 $k$ 和 $m$ 的值，再判断阴影在每条边界的哪一侧。代入点检验很有用：取一个阴影中的点代入验证。",
  ],
  (rng) => {
    const k = rng.int(-3, 3);
    let m = rng.int(-3, 3);
    if (m === k) m = k === 3 ? 2 : k + 1;
    const right = rng.pick(planarRegions);
    const wrong = planarRegions.filter((r) => r !== right).map((r) => same(r.tex(k, m)));
    return choose(
      rng,
      ["Which set is the shaded region, boundaries included?", "阴影区域（包括边界）是哪个集合？"],
      same(right.tex(k, m)),
      [...wrong, same(right.tex(m, k))],
      [
        `The boundaries are the lines $x = ${k}$ and $y = ${m}$, and the shading is ${right.clue[0]}, which matches $${right.tex(k, m)}$.`,
        `边界是直线 $x = ${k}$ 和 $y = ${m}$，阴影是${right.clue[1]}，与 $${right.tex(k, m)}$ 相符。`,
      ],
      drawn(
        { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
        [
          ...right.marks(k, m),
          { kind: "segment", a: [k, -6], b: [k, 6], accent: true },
          { kind: "segment", a: [-6, m], b: [6, m], accent: true },
        ],
        t(`The lines x = ${k} and y = ${m}, with ${right.clue[0]} shaded.`, `直线 x = ${k} 和 y = ${m}，${right.clue[1]}有阴影。`),
      ),
    );
  },
);

const partitionCheck = point(
  "whether-drawn-groups-form-a-partition",
  ["Whether drawn groups form a partition", "图中的分组是否构成分划"],
  [
    "A partition of a set divides it into nonempty blocks so that every element is in exactly one block. A drawing fails this test if a point lies in two blocks, or if a point lies in none. Otherwise the blocks form a partition, however unequal in size they may be, and a block with one point is allowed.",
    "集合的分划把它分成非空的块，使每个元素恰好在一个块中。如果有点落在两个块中，或者有点不在任何块中，图就不符合。否则这些块构成分划，不管大小多么不等，只含一点的块也可以。",
  ],
  (rng) => {
    const kind = rng.pick(["partition", "overlap", "missing"] as const);
    const n = rng.int(7, 10);
    const pts = rng.shuffle(Array.from({ length: n }, (_, i) => i + 1));
    const blocks: number[][] = [];
    const first = n <= 8 ? 3 : 4;
    const widths = [first, 3, n - first - 3];
    let cursor = 0;
    let body = "";
    const place = (block: number, i: number): Point => [35 + block * 105 + (i % 2) * 30, 50 + Math.floor(i / 2) * 44];
    widths.forEach((size, b) => {
      const block = pts.slice(cursor, cursor + size);
      blocks.push(block);
      cursor += size;
      block.forEach((v, i) => {
        body += node(place(b, i), String(v));
      });
      body += `<ellipse class="accent" stroke="currentColor" fill="none" cx="${50 + b * 105}" cy="${50 + (Math.ceil(size / 2) - 1) * 22}" rx="48" ry="${26 + (Math.ceil(size / 2) - 1) * 24}"/>`;
    });
    const set = Array.from({ length: n }, (_, i) => i + 1);
    let extra = "";
    if (kind === "overlap") {
      const v = blocks[0]?.[0] as number;
      extra = node(place(1, 3), String(v));
    }
    const missing = kind === "missing" ? n + rng.int(1, 3) : 0;
    const domain = kind === "missing" ? [...set, missing] : set;
    const options: Record<string, Pair> = {
      partition: ["It is a partition", "是分划"],
      overlap: ["It is not a partition, because a point lies in two blocks", "不是分划，因为有一点在两个块中"],
      missing: ["It is not a partition, because a point lies in no block", "不是分划，因为有一点不在任何块中"],
      empty: ["It is not a partition, because blocks must have equal sizes", "不是分划，因为各块大小必须相等"],
    };
    const reason: Pair =
      kind === "partition"
        ? [
            "Every element of the set lies in exactly one block, and unequal sizes are allowed",
            "集合的每个元素恰好在一个块中，大小不等是允许的",
          ]
        : kind === "overlap"
          ? [`The point $${blocks[0]?.[0]}$ appears in two blocks`, `点 $${blocks[0]?.[0]}$ 出现在两个块中`]
          : [`The element $${missing}$ of the set appears in no block`, `集合中的元素 $${missing}$ 不在任何块中`];
    return choose(
      rng,
      [
        `The ellipses show proposed blocks for the set $\\{${domain.join(", ")}\\}$. Do they form a partition?`,
        `椭圆表示集合 $\\{${domain.join(", ")}\\}$ 的拟议分块。它们是否构成分划？`,
      ],
      options[kind] as Pair,
      Object.keys(options)
        .filter((k) => k !== kind)
        .map((k) => options[k] as Pair),
      [`${reason[0]}.`, `${reason[1]}。`],
      {
        svg: svgDocument(130, body + extra),
        alt: t(
          `Ellipses holding the blocks ${blocks.map((b) => `{${b.join(", ")}}`).join(", ")}${kind === "overlap" ? `, with ${blocks[0]?.[0]} also drawn in the second block` : ""}.`,
          `椭圆中的块为 ${blocks.map((b) => `{${b.join(", ")}}`).join("，")}${kind === "overlap" ? `，${blocks[0]?.[0]} 同时画在第二个块中` : ""}。`,
        ),
      },
    );
  },
);

const indicatorGraph = point(
  "the-set-of-a-drawn-indicator-function",
  ["The set of a drawn indicator function", "图中示性函数的集合"],
  [
    "The indicator function of a set equals one on the set and zero off it. So its graph shows the set directly as the part at height one. A filled circle at an end at height one means that the end belongs to the set, and an open circle there means it does not, which decides the type of bracket.",
    "集合的示性函数在集合上等于一，在集合外等于零。所以它的图以高度一的部分直接显示这个集合。高度一处端点的实心圆表示端点属于集合，空心圆表示不属于，这决定了括号的类型。",
  ],
  (rng) => {
    const a = rng.int(-5, 1);
    const b = a + rng.int(2, 5);
    const [leftIn, rightIn] = [rng.bool(), rng.bool()];
    const interval = (l: boolean, r: boolean) => `${l ? "[" : "("}${a}, ${b}${r ? "]" : ")"}`;
    const marks: PlaneMark[] = [
      { kind: "segment", a: [-7, 0], b: [a, 0], accent: true },
      { kind: "segment", a: [a, 1], b: [b, 1], accent: true },
      { kind: "segment", a: [b, 0], b: [7, 0], accent: true },
      { kind: "point", at: [a, 1], open: !leftIn, accent: true },
      { kind: "point", at: [a, 0], open: leftIn, accent: true },
      { kind: "point", at: [b, 1], open: !rightIn, accent: true },
      { kind: "point", at: [b, 0], open: rightIn, accent: true },
    ];
    const word = (b1: boolean): Pair => (b1 ? ["belongs to the set", "属于集合"] : ["does not belong to the set", "不属于集合"]);
    return choose(
      rng,
      ["The graph shows the indicator function of a set. Which set is it?", "图中是某集合的示性函数。它是哪个集合？"],
      same(interval(leftIn, rightIn)),
      [same(interval(!leftIn, rightIn)), same(interval(leftIn, !rightIn)), same(interval(!leftIn, !rightIn))],
      [
        `The graph has height one from $${a}$ to $${b}$. The value at $${a}$ is ${leftIn ? "one" : "zero"}, so it ${word(leftIn)[0]}, and the value at $${b}$ is ${rightIn ? "one" : "zero"}, so it ${word(rightIn)[0]}.`,
        `图在 $${a}$ 到 $${b}$ 之间高度为一。在 $${a}$ 处的值是${leftIn ? "一" : "零"}，所以它${word(leftIn)[1]}；在 $${b}$ 处的值是${rightIn ? "一" : "零"}，所以它${word(rightIn)[1]}。`,
      ],
      drawn(
        { xMin: -7, xMax: 7, yMin: -2, yMax: 3 },
        marks,
        t(
          `Height one from ${a} (${leftIn ? "filled" : "open"} there) to ${b} (${rightIn ? "filled" : "open"} there), and zero elsewhere.`,
          `从 ${a}（那里${leftIn ? "实心" : "空心"}）到 ${b}（那里${rightIn ? "实心" : "空心"}）高度为一，其他地方为零。`,
        ),
      ),
    );
  },
);

/** deeperFiguresMethodsOfProofPoints adds knowledge points of Methods of Proof that are answered by reading a drawing. */
export const deeperFiguresMethodsOfProofPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "distributive-properties-of-set-operations": [setOfVenn],
  "cardinality-of-finite-sets": [countsOnVenn],
  surjections: [missedElements],
  "into-functions": [collisions],
  "sets-and-functions": [imageAndPreimage],
  "graphical-representations-of-relations": [pairsOfDigraph],
  "reflexive-and-irreflexive-relations": [missingLoops],
  "transitive-relations": [transitiveClosurePair],
  "equivalence-relations": [equivalenceClasses],
  "operations-on-relations": [compositionOfRelations],
  "describing-planar-regions-using-set-builder-notation": [regionSetBuilder],
  "partitions-of-sets": [partitionCheck],
  "indicator-functions": [indicatorGraph],
};
