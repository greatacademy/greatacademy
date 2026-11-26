// Knowledge points of Methods of Proof that ask the learner to read a drawing: Venn diagrams, digraphs of relations and
// arrow diagrams of functions. See `deeperFiguresMethodsOfProofPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { svgDocument } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";
import { proofDrawings1 } from "../explanation-drawings-methods-of-proof-1.ts";

import { say, withMistakes } from "../problems.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
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
  /** rule says in words when a region belongs to the set of A, B and C. */
  readonly rule: Pair;
}

const expressions: readonly SetExpression[] = [
  {
    tex: (a, b, c) => `${a} \\cap (${b} \\cup ${c})`,
    member: (a, b, c) => a && (b || c),
    rule: ["inside A and inside at least one of B and C", "在 A 内，并且至少在 B、C 之一内"],
  },
  {
    tex: (a, b, c) => `${a} \\cup (${b} \\cap ${c})`,
    member: (a, b, c) => a || (b && c),
    rule: ["inside A, or inside both B and C", "在 A 内，或者同时在 B 和 C 内"],
  },
  {
    tex: (a, b, c) => `(${a} \\cup ${b}) \\cap ${c}`,
    member: (a, b, c) => (a || b) && c,
    rule: ["inside C and inside at least one of A and B", "在 C 内，并且至少在 A、B 之一内"],
  },
  {
    tex: (a, b, c) => `(${a} \\cap ${b}) \\cup ${c}`,
    member: (a, b, c) => (a && b) || c,
    rule: ["inside C, or inside both A and B", "在 C 内，或者同时在 A 和 B 内"],
  },
  { tex: (a, b, c) => `${a} \\cap ${b} \\cap ${c}`, member: (a, b, c) => a && b && c, rule: ["inside all three circles", "在三个圆内"] },
  {
    tex: (a, b, c) => `${a} \\cup ${b} \\cup ${c}`,
    member: (a, b, c) => a || b || c,
    rule: ["inside at least one of the three circles", "至少在三个圆之一内"],
  },
  {
    tex: (a, b, c) => `(${a} \\cap ${b}) \\setminus ${c}`,
    member: (a, b, c) => a && b && !c,
    rule: ["inside A and B but outside C", "在 A 和 B 内，但在 C 外"],
  },
  {
    tex: (a, b, c) => `${a} \\setminus (${b} \\cup ${c})`,
    member: (a, b, c) => a && !b && !c,
    rule: ["inside A but outside both B and C", "在 A 内，但在 B 和 C 外"],
  },
];

/** regionName names the region of a three-circle diagram inside exactly the circles A, B and C marked true. */
function regionName(a: boolean, b: boolean, c: boolean): Pair {
  const n = ["A", "B", "C"].filter((_, i) => [a, b, c][i]);
  if (n.length === 0) return ["the region outside all three circles", "三个圆之外的区域"];
  if (n.length === 3) return ["the region inside all three circles", "三个圆的公共区域"];
  return [`the region inside only ${n.join(" and ")}`, `只在 ${n.join("、")} 内的区域`];
}

const setOfVenn = {
  ...point(
    "the-set-marked-on-a-three-circle-diagram",
    ["The set marked on a three-circle diagram", "三圆图上标出的集合"],
    [
      "Three circles split the box into eight regions, one for each way of being inside or outside each circle. An expression in $A$, $B$ and $C$ is a rule that each region either meets or fails, so to name a marked set, test every region against the rule. For example, $A \\cap (B \\cup C)$ contains a region when it is inside $A$ and inside $B$ or $C$: that gives three regions, inside only $A$ and $B$, inside only $A$ and $C$, and inside all three. By the distributive law, $(A \\cap B) \\cup (A \\cap C)$ marks the same three.\n\n> **Watch out.** Brackets change the set. $A \\cap (B \\cup C)$ and $(A \\cap B) \\cup C$ use the same symbols, but the second contains all of $C$, even the part outside $A$. An expression matches only if it agrees with the dots on all eight regions.",
      "三个圆把方框分成八个区域，每个区域对应在每个圆内或圆外的一种情况。由 $A$、$B$、$C$ 组成的表达式就是一条规则，每个区域要么满足、要么不满足，所以要说出标记的集合，就用规则检验每个区域。例如，$A \\cap (B \\cup C)$ 包含一个区域，当且仅当它在 $A$ 内、并且在 $B$ 或 $C$ 内：这给出三个区域，只在 $A$ 和 $B$ 内、只在 $A$ 和 $C$ 内、在三个圆内。由分配律，$(A \\cap B) \\cup (A \\cap C)$ 标出同样的三个区域。\n\n> **注意。** 括号会改变集合。$A \\cap (B \\cup C)$ 与 $(A \\cap B) \\cup C$ 用的符号相同，但后者包含整个 $C$，连 $A$ 外的部分也包括。只有在全部八个区域上都与点一致的表达式才匹配。",
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
      const inside = regionPoints.filter(([a, b, c]) => member(a, b, c)).map(([a, b, c]) => names.filter((_, i) => [a, b, c][i]).sort());
      const regionsEn = inside.map((n) =>
        n.length === 0 ? "outside all three circles" : n.length === 3 ? "inside all three circles" : `inside only ${n.join(" and ")}`,
      );
      const regionsZh = inside.map((n) =>
        n.length === 0 ? "三个圆之外" : n.length === 3 ? "三个圆的公共部分" : `只在 ${n.join("、")} 内`,
      );
      const wrongs = rng.sample(
        expressions.filter((e) => e !== right),
        3,
      );
      const reasons = wrongs.map((e): Reason => {
        const [a, b, c] = regionPoints.find(([x, y, z]) => e.member(x, y, z) !== right.member(x, y, z)) ?? [false, false, false];
        const [en, zh] = regionName(a, b, c);
        const tex = texOf(e);
        return right.member(a, b, c)
          ? [
              same(tex)[0],
              `${en[0]?.toUpperCase()}${en.slice(1)} has a dot, but $${tex}$ leaves it out.`,
              `${zh}有点，但 $${tex}$ 不包含它。`,
            ]
          : [same(tex)[0], `$${tex}$ contains ${en}, which has no dot.`, `$${tex}$ 包含${zh}，而那里没有点。`];
      });
      const n = inside.length;
      return reasoned(
        choose(
          rng,
          [
            "A dot marks each region of the diagram that belongs to a set. Which expression names that set?",
            "图中的点标出属于某集合的每个区域。哪个表达式表示这个集合？",
          ],
          same(texOf(right)),
          wrongs.map((e) => same(texOf(e))),
          [
            `**Step 1: Read the dots.** ${n === 1 ? "One region carries a dot" : `${n} regions carry dots`}: ${regionsEn.join("; ")}.\n\n**Step 2: Find the rule.** $${texOf(right)}$ contains a region when it is ${right.rule[0]}. The dotted regions are exactly the regions that meet this rule.\n\n**Check.** Each of the other ${8 - n} regions fails the rule and has no dot, so $${texOf(right)}$ agrees with the drawing on all eight regions.`,
            `**第一步：读点。** 有点的区域共 ${n} 个：${regionsZh.join("；")}。\n\n**第二步：找规则。** $${texOf(right)}$ 包含一个区域，当且仅当它${right.rule[1]}。有点的区域恰好是满足这条规则的区域。\n\n**检验。** 其余 ${8 - n} 个区域都不满足规则，也都没有点，所以 $${texOf(right)}$ 在全部八个区域上都与图一致。`,
          ],
          {
            svg: vennFigure(names, member),
            alt: t(
              `Three overlapping circles labeled ${names.join(", ")}, with a dot in each of these regions: ${regionsEn.join("; ")}.`,
              `标有 ${names.join("、")} 的三个相交的圆，以下每个区域各有一个点：${regionsZh.join("；")}。`,
            ),
          },
        ),
        reasons,
      );
    },
  ),
  figure: proofDrawings1["distributive-properties-of-set-operations#the-set-marked-on-a-three-circle-diagram"],
};

const countsOnVenn = {
  ...point(
    "reading-counts-from-a-two-circle-diagram",
    ["Reading counts from a two-circle diagram", "由两圆图读计数"],
    [
      "A Venn diagram with counts splits the elements into separate regions, so that each element is counted once. To find the size of a set, add the regions inside it. The size of a union adds the three regions once each, and the complement counts what lies outside the given set, including the region outside both circles. With $5$ only in $A$, $2$ in both, $4$ only in $B$ and $3$ outside, $|A| = 5 + 2 = 7$ and $|A^c| = 4 + 3 = 7$.\n\n> **Watch out.** The number in a region counts only that region. The number in the left part of circle $A$ is $|A \\setminus B|$, not $|A|$: the size of $A$ also takes in the overlap. And a complement includes the region outside both circles.",
      "带计数的文氏图把元素分成互不相交的区域，所以每个元素只算一次。要求一个集合的大小，就把它内部的区域相加。并集的大小把三个区域各加一次，补集计算给定集合之外的部分，包括两个圆之外的区域。若只在 $A$ 中有 $5$ 个，两者都有的 $2$ 个，只在 $B$ 中有 $4$ 个，外面有 $3$ 个，则 $|A| = 5 + 2 = 7$，$|A^c| = 4 + 3 = 7$。\n\n> **注意。** 区域中的数只计这个区域。圆 $A$ 左边部分的数是 $|A \\setminus B|$，而不是 $|A|$：$A$ 的大小还包括重叠部分。补集也包括两个圆之外的区域。",
    ],
    (rng) => {
      const [onlyA, both, onlyB, outside] = [rng.int(2, 12), rng.int(1, 9), rng.int(2, 12), rng.int(1, 9)];
      const q = rng.pick([
        {
          tex: "|A \\cup B|",
          value: onlyA + both + onlyB,
          parts: [onlyA, both, onlyB],
          where: ["the three regions inside the circles", "两个圆内的三个区域"],
          hasBoth: true,
          hasOut: false,
        },
        {
          tex: "|A \\cap B|",
          value: both,
          parts: [both],
          where: ["the overlap of the circles", "两个圆的重叠部分"],
          hasBoth: true,
          hasOut: false,
        },
        {
          tex: "|A \\setminus B|",
          value: onlyA,
          parts: [onlyA],
          where: ["the part of $A$ outside $B$", "$A$ 中在 $B$ 之外的部分"],
          hasBoth: false,
          hasOut: false,
        },
        {
          tex: "|B \\setminus A|",
          value: onlyB,
          parts: [onlyB],
          where: ["the part of $B$ outside $A$", "$B$ 中在 $A$ 之外的部分"],
          hasBoth: false,
          hasOut: false,
        },
        {
          tex: "|A|",
          value: onlyA + both,
          parts: [onlyA, both],
          where: ["the two regions inside $A$", "$A$ 内的两个区域"],
          hasBoth: true,
          hasOut: false,
        },
        {
          tex: "|B|",
          value: onlyB + both,
          parts: [onlyB, both],
          where: ["the two regions inside $B$", "$B$ 内的两个区域"],
          hasBoth: true,
          hasOut: false,
        },
        {
          tex: "|A^c|",
          value: onlyB + outside,
          parts: [onlyB, outside],
          where: ["the part of $B$ outside $A$ and the region outside both circles", "$B$ 中在 $A$ 之外的部分和两个圆之外的区域"],
          hasBoth: false,
          hasOut: true,
        },
        {
          tex: "|(A \\cup B)^c|",
          value: outside,
          parts: [outside],
          where: ["the region outside both circles", "两个圆之外的区域"],
          hasBoth: false,
          hasOut: true,
        },
        {
          tex: "|A \\triangle B|",
          value: onlyA + onlyB,
          parts: [onlyA, onlyB],
          where: ["the two parts of the circles outside the overlap", "两个圆在重叠部分之外的两部分"],
          hasBoth: false,
          hasOut: false,
        },
      ]);
      const total = onlyA + both + onlyB + outside;
      const left = total - q.value;
      const body = `<rect x="10" y="10" width="300" height="170" fill="none"/><circle cx="125" cy="95" r="66" fill="none"/><circle cx="195" cy="95" r="66" fill="none"/>${label(90, 100, String(onlyA))}${label(160, 100, String(both))}${label(232, 100, String(onlyB))}${label(290, 168, String(outside))}${label(72, 32, "A")}${label(246, 32, "B")}`;
      const says = [
        say(
          String(total),
          "That adds every region of the diagram, including those outside the set.",
          "这把图中每个区域都加上了，包括集合之外的区域。",
        ),
        q.hasBoth
          ? say(
              String(q.value + both),
              "That counts the overlap twice; each region is added once.",
              "这把重叠部分算了两次；每个区域只加一次。",
            )
          : say(
              String(q.value + both),
              "That adds the overlap of the circles, which is not part of this set.",
              "这加上了两个圆的重叠部分，而它不属于这个集合。",
            ),
        q.hasOut
          ? say(
              String(q.value + outside),
              "That counts the region outside both circles twice; each region is added once.",
              "这把两个圆之外的区域算了两次；每个区域只加一次。",
            )
          : say(
              String(q.value + outside),
              "That adds the region outside both circles, which is not part of this set.",
              "这加上了两个圆之外的区域，而它不属于这个集合。",
            ),
      ].filter((s, i, all) => s.response !== String(q.value) && all.findIndex((x) => x.response === s.response) === i);
      return withMistakes(
        ask(
          [
            `The numbers give the count of elements in each region. What is $${q.tex}$?`,
            `图中的数给出每个区域的元素个数。$${q.tex}$ 是多少？`,
          ],
          q.value,
          [total, q.value + both, q.value + outside, q.value + 1],
          [
            `**Step 1: Find the regions.** $${q.tex}$ counts ${q.where[0]}.\n\n**Step 2: Add their counts.** ${q.parts.length === 1 ? `That region holds $${q.value}$ elements.` : `$${q.parts.join(" + ")} = ${q.value}$.`}\n\n**Check.** The regions left out hold $${total} - ${q.value} = ${left}$ elements, and $${q.value} + ${left} = ${total}$ is the sum of all four counts, $${onlyA} + ${both} + ${onlyB} + ${outside}$.`,
            `**第一步：找区域。** $${q.tex}$ 数的是${q.where[1]}。\n\n**第二步：把计数相加。** ${q.parts.length === 1 ? `这个区域含有 $${q.value}$ 个元素。` : `$${q.parts.join(" + ")} = ${q.value}$。`}\n\n**检验。** 未计入的区域共有 $${total} - ${q.value} = ${left}$ 个元素，而 $${q.value} + ${left} = ${total}$ 正是四个计数之和 $${onlyA} + ${both} + ${onlyB} + ${outside}$。`,
          ],
          {
            svg: svgDocument(190, body),
            alt: t(
              `Two circles A and B, with ${onlyA} only in A, ${both} in both, ${onlyB} only in B and ${outside} outside.`,
              `两个圆 A 和 B，只在 A 中有 ${onlyA} 个，两者都有的 ${both} 个，只在 B 中有 ${onlyB} 个，外面有 ${outside} 个。`,
            ),
          },
        ),
        says,
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
    "A function is surjective when every element of the codomain is hit by at least one arrow. In an arrow diagram, look at the right column and find the points that no arrow reaches. If there are none, the function is onto. A function can hit a point many times and still miss others, so count the column on the right, not the arrows. With arrows $1 \\to a$, $2 \\to a$, $3 \\to c$ into $\\{a, b, c, d\\}$, the points $b$ and $d$ are missed: $2$ elements.\n\n> **Watch out.** A point hit by two arrows still counts once. Count the points reached, then subtract from the size of the right column; the number of arrows does not settle it.",
    "函数是满射，当且仅当陪域的每个元素都至少被一个箭头到达。在箭头图中，看右列，找没有箭头到达的点。如果没有这样的点，函数就是满射。函数可以多次到达一个点，同时错过其他点，所以要数右列，而不是数箭头。箭头为 $1 \\to a$、$2 \\to a$、$3 \\to c$，映到 $\\{a, b, c, d\\}$ 时，$b$ 和 $d$ 没被到达：共 $2$ 个元素。\n\n> **注意。** 被两个箭头到达的点仍只算一次。先数被到达的点，再用右列的大小去减；箭头的数量决定不了答案。",
  ],
  (rng) => {
    const m = rng.int(3, 6);
    const n = rng.int(3, 6);
    const map = Array.from({ length: m }, () => rng.int(0, n - 1));
    const letters = LETTERS.slice(0, n);
    const hit = new Set(map);
    const missed = n - hit.size;
    const reached = letters.filter((_, i) => hit.has(i));
    const left = letters.filter((_, i) => !hit.has(i));
    const leftEn = left.length === 0 ? "none" : `$${left.join(", ")}$`;
    const leftZh = left.length === 0 ? "没有" : `$${left.join(", ")}$`;
    return withMistakes(
      ask(
        [
          "The arrows show a function from the left column to the right column. How many elements of the codomain are not in the image?",
          "箭头表示从左列到右列的函数。陪域中有多少个元素不在像中？",
        ],
        missed,
        [...new Set([missed + 1, hit.size, Math.abs(m - n), m])].filter((w) => w !== missed),
        [
          `**Step 1: Mark the points reached.** Following the arrows ${functionAlt(map, letters)}, the points reached are $${reached.join(", ")}$: $${hit.size}$ of them.\n\n**Step 2: Count the rest.** The right column has $${n}$ points, so $${n} - ${hit.size} = ${missed}$ ${missed === 1 ? "is" : "are"} missed: ${leftEn}.\n\n**Check.** Reached and missed points together make the whole column: $${hit.size} + ${missed} = ${n}$.`,
          `**第一步：标出被到达的点。** 沿箭头 ${functionAltZh(map, letters)}，被到达的点是 $${reached.join(", ")}$：共 $${hit.size}$ 个。\n\n**第二步：数其余的点。** 右列有 $${n}$ 个点，所以有 $${n} - ${hit.size} = ${missed}$ 个没被到达：${leftZh}。\n\n**检验。** 被到达的与没被到达的点合起来是整列：$${hit.size} + ${missed} = ${n}$。`,
        ],
        {
          svg: arrowFunction(map, letters),
          alt: t(
            `A function from ${m} points to ${n} points, sending ${functionAlt(map, letters)}.`,
            `从 ${m} 个点到 ${n} 个点的函数，把 ${functionAltZh(map, letters)}。`,
          ),
        },
      ),
      [
        say(
          String(hit.size),
          "That counts the points that are reached; the question asks for the ones left out.",
          "这数的是被到达的点；题目问的是没被到达的点。",
        ),
        say(
          String(Math.abs(m - n)),
          "Comparing the column sizes ignores points hit by more than one arrow.",
          "比较两列的大小，忽略了被多个箭头到达的点。",
        ),
        say(String(m), "That counts the arrows, not the points on the right.", "这数的是箭头，而不是右边的点。"),
      ].filter((mistake, i, all) => all.findIndex((x) => x.response === mistake.response) === i),
    );
  },
);

const collisions = point(
  "pairs-that-break-injectivity",
  ["Pairs that break injectivity", "破坏单射的元素对"],
  [
    "A function is injective when different inputs have different outputs. In an arrow diagram, two arrows ending at the same point form a collision, and a function with any collision is not injective. Three arrows ending at one point give three colliding pairs, because each pair of inputs among them shares an output. With arrows $1, 2, 3 \\to a$ and $4, 5 \\to b$: $\\frac{3 \\cdot 2}{2} + \\frac{2 \\cdot 1}{2} = 3 + 1 = 4$ pairs.\n\n> **Watch out.** A point reached by $k$ arrows gives $\\frac{k(k - 1)}{2}$ pairs, not $k - 1$: every two of its inputs form a pair.",
    "函数是单射，当且仅当不同的输入有不同的输出。在箭头图中，两个箭头终点相同就构成一次碰撞，有碰撞的函数不是单射。三个箭头终于同一点时给出三个碰撞对，因为其中每一对输入都共享一个输出。箭头为 $1, 2, 3 \\to a$ 和 $4, 5 \\to b$ 时：$\\frac{3 \\cdot 2}{2} + \\frac{2 \\cdot 1}{2} = 3 + 1 = 4$ 对。\n\n> **注意。** 被 $k$ 个箭头到达的点给出 $\\frac{k(k - 1)}{2}$ 对，而不是 $k - 1$ 对：它的任意两个输入都构成一对。",
  ],
  (rng) => {
    const m = rng.int(3, 6);
    const n = rng.int(3, 5);
    const map = Array.from({ length: m }, () => rng.int(0, n - 1));
    const letters = LETTERS.slice(0, n);
    const counts = letters.map((_, y) => map.filter((v) => v === y).length);
    const pairs = counts.reduce((sum, c) => sum + (c * (c - 1)) / 2, 0);
    const distinct = new Set(map).size;
    const shared = letters.map((letter, y) => ({ letter, c: counts[y] ?? 0 })).filter(({ c }) => c >= 2);
    const termsEn = shared.map(({ letter, c }) => `$${letter}$: $\\frac{${c} \\cdot ${c - 1}}{2} = ${(c * (c - 1)) / 2}$`).join("; ");
    const termsZh = shared.map(({ letter, c }) => `$${letter}$：$\\frac{${c} \\cdot ${c - 1}}{2} = ${(c * (c - 1)) / 2}$`).join("；");
    const sum = shared.map(({ c }) => (c * (c - 1)) / 2).join(" + ");
    const firstShared = shared[0];
    const inputs = firstShared ? map.map((v, i) => (letters[v] === firstShared.letter ? i + 1 : 0)).filter((i) => i > 0) : [];
    const listed = inputs.flatMap((x, i) => inputs.slice(i + 1).map((y) => `(${x}, ${y})`)).join(", ");
    const listedCount =
      (inputs.length * (inputs.length - 1)) / 2 === 1 ? "$1$ pair" : `$${(inputs.length * (inputs.length - 1)) / 2}$ pairs`;
    return withMistakes(
      ask(
        [
          "The arrows show a function from the left column to the right column. How many pairs of different inputs have the same output?",
          "箭头表示从左列到右列的函数。有多少对不同的输入具有相同的输出？",
        ],
        pairs,
        [...new Set([pairs + 1, pairs + 2, m - distinct, m])].filter((w) => w !== pairs),
        [
          `**Step 1: Count the arrows at each point.** Reading the arrows ${functionAlt(map, letters)}, the points $${letters.join(", ")}$ are reached by $${counts.join(", ")}$ arrows.\n\n**Step 2: Count the pairs.** ${shared.length === 0 ? "No point is reached twice, so there are no such pairs: $0$." : `A point reached by $k$ arrows gives $\\frac{k(k - 1)}{2}$ pairs. ${termsEn}.${shared.length > 1 ? ` In all, $${sum} = ${pairs}$.` : ""}`}\n\n**Check.** ${firstShared ? `At $${firstShared.letter}$ the inputs are $${inputs.join(", ")}$, and the pairs among them are $${listed}$: ${listedCount}.` : `The $${m}$ arrows end at $${m}$ different points, so no output is shared.`}`,
          `**第一步：数每个点上的箭头。** 读箭头 ${functionAltZh(map, letters)}，点 $${letters.join(", ")}$ 分别被 $${counts.join(", ")}$ 个箭头到达。\n\n**第二步：数对数。** ${shared.length === 0 ? "没有点被到达两次，所以没有这样的对：$0$。" : `被 $k$ 个箭头到达的点给出 $\\frac{k(k - 1)}{2}$ 对。${termsZh}。${shared.length > 1 ? `共 $${sum} = ${pairs}$。` : ""}`}\n\n**检验。** ${firstShared ? `在 $${firstShared.letter}$ 处，输入是 $${inputs.join(", ")}$，其中的对是 $${listed}$：共 $${(inputs.length * (inputs.length - 1)) / 2}$ 对。` : `$${m}$ 个箭头终于 $${m}$ 个不同的点，所以没有输出被共享。`}`,
        ],
        {
          svg: arrowFunction(map, letters),
          alt: t(
            `A function from ${m} points to ${n} points, sending ${functionAlt(map, letters)}.`,
            `从 ${m} 个点到 ${n} 个点的函数，把 ${functionAltZh(map, letters)}。`,
          ),
        },
      ),
      [
        say(
          String(m - distinct),
          "That counts each extra arrow once; three arrows at one point give three pairs, not two.",
          "这把每个多余的箭头只算一次；三个箭头到同一点给出三对，而不是两对。",
        ),
        say(String(m), "That counts the arrows; count the pairs of inputs that share an output.", "这数的是箭头；要数共享输出的输入对。"),
      ].filter((mistake, i, all) => all.findIndex((x) => x.response === mistake.response) === i),
    );
  },
);

const imageAndPreimage = point(
  "images-and-preimages-from-arrows",
  ["Images and preimages from arrows", "由箭头读像和原像"],
  [
    "The image of a set under a function collects the ends of the arrows that start in the set. The preimage of a set collects the starts of the arrows that end in the set. So the two read an arrow diagram in opposite directions, and the preimage of a point that no arrow reaches is the empty set. If $f$ sends $1 \\mapsto a$, $2 \\mapsto a$ and $3 \\mapsto b$, then $f(\\{1, 2\\}) = \\{a\\}$ and $f^{-1}(\\{a\\}) = \\{1, 2\\}$.\n\n> **Watch out.** An image lies in the codomain and a preimage lies in the domain, so they are not even made of the same kind of point. And an image lists each end once, even when several arrows reach it.",
    "集合在函数下的像收集从集合出发的箭头的终点。集合的原像收集终点在集合内的箭头的起点。所以二者沿相反方向读箭头图，没有箭头到达的点的原像是空集。若 $f$ 把 $1 \\mapsto a$，$2 \\mapsto a$，$3 \\mapsto b$，则 $f(\\{1, 2\\}) = \\{a\\}$，$f^{-1}(\\{a\\}) = \\{1, 2\\}$。\n\n> **注意。** 像在陪域中，原像在定义域中，所以它们甚至不是同一类点。而且即使有几个箭头到达同一个终点，像中也只列一次。",
  ],
  (rng) => {
    const m = rng.int(4, 6);
    const n = rng.int(3, 5);
    const map = Array.from({ length: m }, () => rng.int(0, n - 1));
    const letters = LETTERS.slice(0, n);
    const domain = Array.from({ length: m }, (_, i) => i + 1);
    const list = (xs: readonly (string | number)[]) => (xs.length === 0 ? "\\varnothing" : `\\{${xs.join(", ")}\\}`);
    const image = rng.bool();
    const S = rng.sample(domain, 2).sort((a, b) => a - b);
    const T = rng.sample(letters, 2).sort();
    const end = (x: number) => letters[map[x - 1] as number] as string;
    const imageOf = (xs: readonly number[]) => [...new Set(xs.map(end))].sort();
    const preOf = (ys: readonly string[]) => domain.filter((x) => ys.includes(end(x)));
    const answerSet: readonly (string | number)[] = image ? imageOf(S) : preOf(T);
    const answer = list(answerSet);
    const special = new Map<string, Pair>(
      image
        ? [
            [
              list(preOf(T)),
              [
                "That reads the arrows backwards; the image follows the arrows out of the set.",
                "这是沿箭头反方向读的；像要沿从集合出发的箭头走。",
              ],
            ],
            [list(S), ["That is the set itself; the image is where its arrows end.", "这是集合本身；像是它的箭头的终点。"]],
            [
              list(imageOf(domain)),
              [
                "That is the range, the image of the whole domain; only the arrows from the given set count.",
                "这是值域，即整个定义域的像；只有从给定集合出发的箭头才算。",
              ],
            ],
            [
              list(letters),
              [
                "That is the whole codomain; only the ends of arrows from the given set count.",
                "这是整个陪域；只有从给定集合出发的箭头的终点才算。",
              ],
            ],
          ]
        : [
            [
              list(imageOf(S)),
              [
                "That follows arrows forwards; the preimage collects the starts of the arrows that end in the set.",
                "这是沿箭头正方向读的；原像收集终点在集合内的箭头的起点。",
              ],
            ],
            [
              list(T),
              [
                "That is the given set itself; the preimage lies in the domain, at the starts of arrows.",
                "这是给定的集合本身；原像在定义域中，在箭头的起点。",
              ],
            ],
            [
              list(domain),
              [
                "That is the whole domain; only the points whose arrows end in the set count.",
                "这是整个定义域；只有箭头终点在集合内的点才算。",
              ],
            ],
          ],
    );
    const candidates: (readonly (string | number)[])[] = [
      preOf(T),
      imageOf(S),
      S,
      T,
      letters,
      imageOf(domain),
      domain,
      rng.sample(letters, 1),
      rng.sample(letters, 3).sort(),
      rng.sample(domain, 3).sort((a, b) => a - b),
      [1],
      [],
    ];
    const kindOk = (xs: readonly (string | number)[]) => xs.every((x) => typeof x === (image ? "string" : "number"));
    const reasonFor = (xs: readonly (string | number)[]): Pair => {
      const tex = list(xs);
      const named = special.get(tex);
      if (named) return named;
      if (!kindOk(xs)) {
        return image
          ? ["An image lies in the codomain, among the letters, not among the numbered points.", "像在陪域中，是字母点，而不是编号的点。"]
          : [
              "A preimage lies in the domain, among the numbered points, not among the letters.",
              "原像在定义域中，是编号的点，而不是字母点。",
            ];
      }
      const extra = xs.find((x) => !answerSet.includes(x));
      if (extra !== undefined) {
        return image
          ? [`No arrow from $${list(S)}$ ends at $${extra}$.`, `从 $${list(S)}$ 出发的箭头都不到达 $${extra}$。`]
          : [
              `The arrow from $${extra}$ ends at $${end(extra as number)}$, outside $${list(T)}$.`,
              `从 $${extra}$ 出发的箭头终点是 $${end(extra as number)}$，不在 $${list(T)}$ 中。`,
            ];
      }
      return image
        ? ["This set leaves out the end of an arrow from the given set.", "这个集合漏掉了从给定集合出发的某个箭头的终点。"]
        : ["This set leaves out a point whose arrow ends in the given set.", "这个集合漏掉了某个箭头终点在给定集合内的点。"];
    };
    const seen = new Set<string>([answer]);
    const wrong: (readonly (string | number)[])[] = [];
    for (const c of candidates) {
      if (!seen.has(list(c))) {
        seen.add(list(c));
        wrong.push(c);
      }
    }
    const reasons = wrong.map((c): Reason => {
      const [en, zh] = reasonFor(c);
      return [same(list(c))[0], en, zh];
    });
    const arrows = (xs: readonly number[]) => xs.map((x) => `${x} \\mapsto ${end(x)}`).join(",\\ ");
    const solution: Pair = image
      ? [
          `**Step 1: Follow the arrows out of the set.** $${arrows(S)}$.\n\n**Step 2: Collect the ends.** Listing each end once gives $f(${list(S)}) = ${answer}$.\n\n**Check.** Every point of $${answer}$ is reached by an arrow from $${list(S)}$, and both arrows from $${list(S)}$ end in $${answer}$.`,
          `**第一步：沿集合出发的箭头走。** $${arrows(S)}$。\n\n**第二步：收集终点。** 每个终点只列一次，得 $f(${list(S)}) = ${answer}$。\n\n**检验。** $${answer}$ 中每个点都有来自 $${list(S)}$ 的箭头到达，而且从 $${list(S)}$ 出发的两个箭头都终止于 $${answer}$。`,
        ]
      : [
          `**Step 1: Read every arrow.** $${arrows(domain)}$.\n\n**Step 2: Keep the starts that end in the set.** The arrows ending in $${list(T)}$ start at the points of $${answer}$, so $f^{-1}(${list(T)}) = ${answer}$.\n\n**Check.** ${answerSet.length === 0 ? `No arrow ends in $${list(T)}$, so the preimage is empty.` : `$f(${answer}) = ${list(imageOf(answerSet as number[]))}$, which lies inside $${list(T)}$, and every other point is sent outside $${list(T)}$.`}`,
          `**第一步：读出每个箭头。** $${arrows(domain)}$。\n\n**第二步：保留终点在集合内的起点。** 终点在 $${list(T)}$ 中的箭头从 $${answer}$ 中的点出发，所以 $f^{-1}(${list(T)}) = ${answer}$。\n\n**检验。** ${answerSet.length === 0 ? `没有箭头终止于 $${list(T)}$，所以原像是空集。` : `$f(${answer}) = ${list(imageOf(answerSet as number[]))}$，在 $${list(T)}$ 之内，而其余每个点都被送到 $${list(T)}$ 之外。`}`,
        ];
    return reasoned(
      choose(
        rng,
        image
          ? [`The arrows show a function $f$. What is the image $f(${list(S)})$?`, `箭头表示函数 $f$。像 $f(${list(S)})$ 是什么？`]
          : [
              `The arrows show a function $f$. What is the preimage $f^{-1}(${list(T)})$?`,
              `箭头表示函数 $f$。原像 $f^{-1}(${list(T)})$ 是什么？`,
            ],
        same(answer),
        rng.shuffle(wrong).map((c) => same(list(c))),
        solution,
        {
          svg: arrowFunction(map, letters),
          alt: t(
            `A function from ${m} points to ${n} points, sending ${functionAlt(map, letters)}.`,
            `从 ${m} 个点到 ${n} 个点的函数，把 ${functionAltZh(map, letters)}。`,
          ),
        },
      ),
      reasons,
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
    "A digraph draws a relation on a set: an arrow from $a$ to $b$ means that the ordered pair $(a, b)$ is in the relation, and a small loop at $a$ means that $(a, a)$ is in it. The order within a pair matters, so an arrow in one direction does not give the pair in the opposite direction. An arrow from $1$ to $3$ and a loop at $2$ give the relation $\\{(1, 3), (2, 2)\\}$.\n\n> **Watch out.** Read each arrow from its tail to its head: an arrow from $1$ to $3$ is $(1, 3)$, not $(3, 1)$. Do not forget the loops, which are pairs too.",
    "有向图表示集合上的关系：从 $a$ 到 $b$ 的箭头表示有序对 $(a, b)$ 在关系中，$a$ 处的小圈表示 $(a, a)$ 在关系中。有序对的次序很重要，一个方向的箭头不会给出相反方向的有序对。从 $1$ 到 $3$ 的箭头和 $2$ 处的小圈给出关系 $\\{(1, 3), (2, 2)\\}$。\n\n> **注意。** 每个箭头都从尾读到头：从 $1$ 到 $3$ 的箭头是 $(1, 3)$，不是 $(3, 1)$。别忘了小圈，它们也是有序对。",
  ],
  (rng) => {
    const n = rng.int(3, 4);
    const pairs = rng.sample(allPairs(n), rng.int(3, 4));
    const off = pairs.filter(([a, b]) => a !== b);
    if (off.length === 0) pairs[0] = [0, 1];
    const key = ([a, b]: readonly [number, number]) => `${a},${b}`;
    const inRight = new Set(pairs.map(key));
    const reversed = pairs.map(([a, b]): [number, number] => [b, a]);
    const someOther = (from: readonly [number, number][]) => {
      const remaining = allPairs(n).filter(([a, b]) => !from.some(([c, d]) => c === a && d === b));
      return [...from.slice(1), rng.pick(remaining)];
    };
    const right = relationText(pairs);
    const turned = (k: number) => pairs.map(([a, b]): [number, number] => [(a + k) % n, (b + k) % n]);
    const candidates: [number, number][][] = [
      reversed,
      turned(1),
      turned(2),
      someOther(pairs),
      someOther(pairs),
      pairs.slice(1),
      someOther(pairs),
    ];
    const pairTex = ([a, b]: readonly [number, number]) => `(${a + 1}, ${b + 1})`;
    const reasonFor = (c: readonly [number, number][]) => {
      const extra = c.find((p) => !inRight.has(key(p)));
      if (extra !== undefined) {
        const [a, b] = extra;
        return a === b
          ? say(
              `$${relationText(c)}$`,
              `It contains $${pairTex(extra)}$, but there is no loop at $${a + 1}$.`,
              `它包含 $${pairTex(extra)}$，但 $${a + 1}$ 处没有小圈。`,
            )
          : say(
              `$${relationText(c)}$`,
              `It contains $${pairTex(extra)}$, but no arrow goes from $${a + 1}$ to $${b + 1}$.`,
              `它包含 $${pairTex(extra)}$，但没有从 $${a + 1}$ 到 $${b + 1}$ 的箭头。`,
            );
      }
      const lost = pairs.find((p) => !c.some((q) => key(q) === key(p))) ?? pairs[0]!;
      return say(
        `$${relationText(c)}$`,
        `It leaves out $${pairTex(lost)}$, which the drawing shows.`,
        `它漏掉了图中画出的 $${pairTex(lost)}$。`,
      );
    };
    const ordered = [...pairs].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const loops = ordered.filter(([a, b]) => a === b);
    const arrows = ordered.filter(([a, b]) => a !== b);
    return withMistakes(
      choose(
        rng,
        [
          "Which set of ordered pairs is the relation drawn? An arrow from $a$ to $b$ stands for $(a, b)$, and a small loop at a point stands for a pair of the point with itself.",
          "图中的关系是哪个有序对集合？从 $a$ 到 $b$ 的箭头表示 $(a, b)$，点上的小圈表示该点与自身组成的对。",
        ],
        same(right),
        candidates.map((c) => same(relationText(c))),
        [
          `**Step 1: Read the arrows.** From tail to head: $${arrows.map(pairTex).join(", ")}$.\n\n**Step 2: Read the loops.** ${loops.length === 0 ? "There are no loops." : `$${loops.map(pairTex).join(", ")}$.`}\n\n**Check.** The relation is $${right}$, with $${pairs.length}$ pairs, one for each of the $${arrows.length}$ arrows and $${loops.length}$ loops drawn.`,
          `**第一步：读箭头。** 从尾到头：$${arrows.map(pairTex).join(", ")}$。\n\n**第二步：读小圈。** ${loops.length === 0 ? "没有小圈。" : `$${loops.map(pairTex).join(", ")}$。`}\n\n**检验。** 关系是 $${right}$，共 $${pairs.length}$ 个有序对，对应图中 $${arrows.length}$ 个箭头和 $${loops.length}$ 个小圈。`,
        ],
        {
          svg: relationFigure(n, pairs),
          alt: t(`A digraph on ${n} points with the pairs ${pairAlt(pairs)}.`, `${n} 个点上的有向图，有序对为 ${pairAlt(pairs)}。`),
        },
      ),
      [
        say(`$${relationText(reversed)}$`, "That reads every arrow from head to tail.", "这把每个箭头都从头读到了尾。"),
        ...candidates.slice(1).map(reasonFor),
      ],
    );
  },
);

const missingLoops = point(
  "loops-missing-from-a-reflexive-relation",
  ["Loops missing from a reflexive relation", "自反关系缺少的小圈"],
  [
    "A relation is reflexive when every point is related to itself, which means every point of its digraph has a loop. It is irreflexive when no point has one. So a relation with some loops and not others is neither. Count the points without a loop to find how many pairs must be added to make it reflexive. On $4$ points with loops at $1$ and $3$, the pairs $(2, 2)$ and $(4, 4)$ must be added.\n\n> **Watch out.** Arrows between different points do not count toward reflexivity, however many there are. Count the points that have no loop.",
    "关系是自反的，是指每一点都与自身相关，也就是有向图的每一点都有小圈。它是反自反的，是指没有一点有小圈。所以有些点有小圈、有些没有的关系两者都不是。数没有小圈的点，就知道要加多少对才能使它自反。在 $4$ 个点上，若 $1$ 和 $3$ 处有小圈，就必须添加 $(2, 2)$ 和 $(4, 4)$。\n\n> **注意。** 不同点之间的箭头无论有多少，都与自反性无关。要数的是没有小圈的点。",
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
    const without = Array.from({ length: n }, (_, i) => i).filter((i) => !looped.includes(i));
    const loopsTex = (list: readonly number[]) => list.map((i) => `(${i + 1}, ${i + 1})`).join(", ");
    return withMistakes(
      ask(
        [
          "A small loop at a point stands for a pair of the point with itself. How many pairs must be added to make the relation drawn reflexive?",
          "点上的小圈表示该点与自身组成的对。要使图中的关系自反，必须添加多少对？",
        ],
        missing,
        [looped.length === missing ? missing + 1 : looped.length, n === missing ? missing + 2 : n, missing === 1 ? 2 : missing - 1],
        [
          `**Step 1: Count the loops needed.** Reflexivity needs a loop at each of the $${n}$ points.\n\n**Step 2: Count the loops drawn.** There ${looped.length === 1 ? "is $1$ loop" : `are $${looped.length}$ loops`}, so $${n} - ${looped.length} = ${missing}$ pairs must be added; the arrows between different points play no part.\n\n**Check.** The points without a loop are $${without.map((i) => i + 1).join(", ")}$, so the pairs to add are $${loopsTex(without)}$.`,
          `**第一步：数需要的小圈。** 自反性要求 $${n}$ 个点每个都有小圈。\n\n**第二步：数画出的小圈。** 有 $${looped.length}$ 个小圈，所以必须添加 $${n} - ${looped.length} = ${missing}$ 对；不同点之间的箭头不起作用。\n\n**检验。** 没有小圈的点是 $${without.map((i) => i + 1).join(", ")}$，所以要添加的对是 $${loopsTex(without)}$。`,
        ],
        {
          svg: relationFigure(n, pairs),
          alt: t(`A digraph on ${n} points with the pairs ${pairAlt(pairs)}.`, `${n} 个点上的有向图，有序对为 ${pairAlt(pairs)}。`),
        },
      ),
      [
        say(
          String(looped.length),
          "That counts the loops already drawn; the question asks for the ones missing.",
          "这数的是已画出的小圈；题目问的是缺少的。",
        ),
        say(String(n), "Some points already have loops, and those pairs need not be added.", "有些点已经有小圈，这些对不必添加。"),
      ],
    );
  },
);

const transitiveClosurePair = point(
  "the-arrow-that-transitivity-demands",
  ["The arrow that transitivity demands", "传递性要求的箭头"],
  [
    "A relation is transitive when arrows from $a$ to $b$ and from $b$ to $c$ always come with an arrow from $a$ to $c$. So search the digraph for a path of two arrows with no shortcut. Any such missing shortcut is a counterexample to transitivity, and adding it is a step toward making the relation transitive. With arrows $1 \\to 2$ and $2 \\to 3$ but none from $1$ to $3$, the pair $(1, 3)$ must be added.\n\n> **Watch out.** The shortcut goes from the start of the path to its end, in the same direction: for $a \\to b \\to c$ it is $(a, c)$, not $(c, a)$.",
    "关系是传递的，是指从 $a$ 到 $b$ 和从 $b$ 到 $c$ 的箭头总伴随从 $a$ 到 $c$ 的箭头。所以在有向图中寻找没有捷径的两步路径。任何这样缺失的捷径都是传递性的反例，添加它是使关系传递的一步。有箭头 $1 \\to 2$ 和 $2 \\to 3$，却没有从 $1$ 到 $3$ 的箭头，就必须添加 $(1, 3)$。\n\n> **注意。** 捷径从路径的起点指向终点，方向相同：对 $a \\to b \\to c$ 是 $(a, c)$，不是 $(c, a)$。",
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
    const tex = (x: number, y: number) => `(${x + 1}, ${y + 1})`;
    const pair = (x: number, y: number) => same(tex(x, y));
    return withMistakes(
      choose(
        rng,
        ["For the relation drawn to be transitive, which pair must be added?", "要使图中的关系传递，必须添加哪一对？"],
        pair(a, c),
        [pair(c, a), pair(a, d), pair(c, b), pair(b, d)],
        [
          `**Step 1: Find the two-arrow paths.** $${a + 1} \\to ${b + 1} \\to ${c + 1}$ and $${d + 1} \\to ${b + 1} \\to ${c + 1}$.\n\n**Step 2: Look for their shortcuts.** The path from $${d + 1}$ already has the arrow $${d + 1} \\to ${c + 1}$, but there is no arrow from $${a + 1}$ to $${c + 1}$, so $${tex(a, c)}$ must be added.\n\n**Check.** No other path of two arrows exists: nothing leaves $${c + 1}$, and only $${b + 1}$ is reached in the middle.`,
          `**第一步：找两步路径。** $${a + 1} \\to ${b + 1} \\to ${c + 1}$ 和 $${d + 1} \\to ${b + 1} \\to ${c + 1}$。\n\n**第二步：找它们的捷径。** 从 $${d + 1}$ 出发的路径已有箭头 $${d + 1} \\to ${c + 1}$，但没有从 $${a + 1}$ 到 $${c + 1}$ 的箭头，所以必须添加 $${tex(a, c)}$。\n\n**检验。** 没有其他两步路径：没有箭头从 $${c + 1}$ 出发，作为中间点的只有 $${b + 1}$。`,
        ],
        {
          svg: relationFigure(n, pairs),
          alt: t(`A digraph on ${n} points with the pairs ${pairAlt(pairs)}.`, `${n} 个点上的有向图，有序对为 ${pairAlt(pairs)}。`),
        },
      ),
      [
        say(
          pair(c, a)[0],
          `That points backward; the path $${a + 1} \\to ${b + 1} \\to ${c + 1}$ needs a shortcut from $${a + 1}$ to $${c + 1}$.`,
          `方向反了；路径 $${a + 1} \\to ${b + 1} \\to ${c + 1}$ 需要从 $${a + 1}$ 到 $${c + 1}$ 的捷径。`,
        ),
        say(pair(a, d)[0], `No path of arrows leads from $${a + 1}$ to $${d + 1}$.`, `没有从 $${a + 1}$ 到 $${d + 1}$ 的箭头路径。`),
        say(
          pair(c, b)[0],
          `No arrow leaves $${c + 1}$, so transitivity asks for nothing from it.`,
          `没有箭头从 $${c + 1}$ 出发，所以传递性对它没有要求。`,
        ),
        say(pair(b, d)[0], `No path of arrows leads from $${b + 1}$ to $${d + 1}$.`, `没有从 $${b + 1}$ 到 $${d + 1}$ 的箭头路径。`),
      ],
    );
  },
);

const equivalenceClasses = point(
  "equivalence-classes-from-a-drawing",
  ["Equivalence classes from a drawing", "由图读等价类"],
  [
    "The digraph of an equivalence relation breaks into separate clusters, and within a cluster every point is joined to every other. Each cluster is an equivalence class, so the number of clusters is the number of classes, and the class of a point is the cluster that contains it. Lines here stand for arrows in both directions. If $1, 4$ are joined, $2, 5, 6$ are joined and $3$ stands alone, there are three classes, and $[3] = \\{3\\}$.\n\n> **Watch out.** A point with no lines is still a class of its own, since it is related to itself. And the class of a point includes the point.",
    "等价关系的有向图分成互不相连的几团，每一团内每一点都与其他各点相连。每一团就是一个等价类，所以团的个数就是等价类的个数，一点的等价类就是包含它的那一团。这里的线段表示两个方向的箭头。若 $1, 4$ 相连，$2, 5, 6$ 相连，$3$ 单独一点，则有三个等价类，且 $[3] = \\{3\\}$。\n\n> **注意。** 没有线段的点自己也是一个类，因为它与自身相关。一个点的等价类包含这个点本身。",
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
    const own = groups.find((g) => g.includes(target)) as number[];
    const size = own.length;
    const value = askCount ? groups.length : size;
    const listed = groups.map((g) => `\\{${[...g].sort((x, y) => x - y).join(", ")}\\}`).join(", ");
    const sizesText = groups.map((g) => g.length).join(" + ");
    return withMistakes(
      ask(
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
              `**Step 1: Find the clusters.** Following the lines, the points split into $${listed}$, with no line between clusters.\n\n**Step 2: Count.** Each cluster is one class: $${groups.length}$ classes.\n\n**Check.** The cluster sizes $${sizesText}$ add up to $${n}$, so every point lies in exactly one class.`,
              `**第一步：找出各团。** 沿线段看，这些点分成 $${listed}$，团之间没有线段。\n\n**第二步：计数。** 每一团是一个类：共 $${groups.length}$ 个类。\n\n**检验。** 各团大小 $${sizesText}$ 加起来是 $${n}$，所以每个点恰好在一个类中。`,
            ]
          : [
              `**Step 1: Find the cluster of ${target}.** The lines from $${target}$ reach ${size === 1 ? "no other point" : `$${own.filter((x) => x !== target).join(", ")}$`}, so its class is $\\{${[...own].sort((x, y) => x - y).join(", ")}\\}$.\n\n**Step 2: Count.** Including $${target}$ itself, the class has $${size}$ ${size === 1 ? "element" : "elements"}.\n\n**Check.** ${size === 1 ? `$${target}$ has no lines, and it is related to itself, so its class is $\\{${target}\\}$.` : `Every two points of the cluster are joined by a line, as an equivalence class requires: $\\binom{${size}}{2} = ${(size * (size - 1)) / 2}$ ${size === 2 ? "line" : "lines"}.`}`,
              `**第一步：找出 ${target} 所在的团。** 从 $${target}$ 出发的线段到达${size === 1 ? "其他任何点都没有" : ` $${own.filter((x) => x !== target).join(", ")}$`}，所以它的类是 $\\{${[...own].sort((x, y) => x - y).join(", ")}\\}$。\n\n**第二步：计数。** 算上 $${target}$ 本身，这个类有 $${size}$ 个元素。\n\n**检验。** ${size === 1 ? `$${target}$ 没有线段，而它与自身相关，所以它的类是 $\\{${target}\\}$。` : `团中每两点之间都有线段，符合等价类的要求：共 $\\binom{${size}}{2} = ${(size * (size - 1)) / 2}$ 条线段。`}`,
            ],
        {
          svg: svgDocument(220, body),
          alt: t(
            `Clusters of joined points: ${groups.map((g) => `{${g.join(", ")}}`).join(", ")}.`,
            `相连的点构成的团：${groups.map((g) => `{${g.join(", ")}}`).join("，")}。`,
          ),
        },
      ),
      askCount
        ? [
            say(
              String(n),
              "That counts the points; the points of one cluster share a class.",
              "这数的是点的个数；同一团中的点属于同一个类。",
            ),
          ]
        : [say(String(size - 1), `The class of $${target}$ includes $${target}$ itself.`, `$${target}$ 的等价类包含 $${target}$ 本身。`)],
    );
  },
);

const compositionOfRelations = point(
  "composing-relations-through-three-columns",
  ["Composing relations through three columns", "通过三列复合关系"],
  [
    "To compose two relations, chain their arrows: a pair $(x, z)$ belongs to the composition exactly when an arrow from $x$ reaches some middle point $y$ and an arrow from $y$ reaches $z$. In a three-column drawing, each path from the left column through the middle to the right column gives one pair, and several paths may give the same pair. With $1 \\to x \\to A$ and $1 \\to y \\to A$, the two paths give the single pair $(1, A)$.\n\n> **Watch out.** Count pairs of ends, not paths: two paths with the same start and finish give one pair. An arrow into a middle point with no arrow out of it gives nothing.",
    "复合两个关系就是把箭头接起来：有序对 $(x, z)$ 属于复合，当且仅当从 $x$ 的箭头到达某个中间点 $y$，从 $y$ 的箭头到达 $z$。在三列图中，从左列经中间列到右列的每条路径给出一对，几条路径可能给出同一对。若有 $1 \\to x \\to A$ 和 $1 \\to y \\to A$，两条路径只给出一对 $(1, A)$。\n\n> **注意。** 数的是端点对，不是路径：起点和终点相同的两条路径只给出一对。指向中间点而没有后续箭头的箭头什么也不给出。",
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
    let paths = 0;
    for (const [a, b] of first)
      for (const [c, d] of second)
        if (b === c) {
          paths++;
          if (!composition.has(`${a},${d}`)) {
            composition.add(`${a},${d}`);
            pairs.push([a, d]);
          }
        }
    const wrong = [first.length * second.length, first.length + second.length, pairs.length + 1].filter((v) => v !== pairs.length);
    let body = "";
    for (const [a, b] of first) body += arrowLine(col(50, l, a), col(160, m, b), 14, true);
    for (const [a, b] of second) body += arrowLine(col(160, m, a), col(270, r, b), 14, true);
    const names = ["x", "y", "z", "w"];
    for (let i = 0; i < l; i++) body += node(col(50, l, i), `${i + 1}`);
    for (let i = 0; i < m; i++) body += node(col(160, m, i), names[i] as string);
    for (let i = 0; i < r; i++) body += node(col(270, r, i), LETTERS[i] as string);
    const endsTex = pairs
      .sort((p, q) => p[0] - q[0] || p[1] - q[1])
      .map(([a, d]) => `(${a + 1}, ${LETTERS[d] as string})`)
      .join(", ");
    const pathList = first.flatMap(([a, b]) =>
      second.filter(([c]) => c === b).map(([, d]) => `${a + 1} \\to ${names[b] as string} \\to ${LETTERS[d] as string}`),
    );
    return withMistakes(
      ask(
        [
          "The left arrows show a relation $R$ and the right arrows show a relation $S$. How many ordered pairs are in the composition of $S$ with $R$, which goes from the left column to the right column?",
          "左边的箭头表示关系 $R$，右边的箭头表示关系 $S$。从左列到右列的复合关系有多少个有序对？",
        ],
        pairs.length,
        wrong,
        [
          `**Step 1: Trace the paths.** ${paths === 0 ? "No arrow of $R$ ends where an arrow of $S$ starts, so there are no paths." : `Through the middle column: $${pathList.join(",\\ ")}$.`}\n\n**Step 2: Keep the pairs of ends.** ${pairs.length === 0 ? "There are none, so the composition is empty." : `$${endsTex}$, which makes $${pairs.length}$.`}\n\n**Check.** ${paths === pairs.length ? `Each of the $${paths}$ paths has different ends, so no pair is counted twice.` : `The $${paths}$ paths give only $${pairs.length}$ pairs, because some share both ends.`}`,
          `**第一步：追踪路径。** ${paths === 0 ? "$R$ 的箭头都不终止于 $S$ 的箭头起点，所以没有路径。" : `经过中间列：$${pathList.join(",\\ ")}$。`}\n\n**第二步：保留端点对。** ${pairs.length === 0 ? "没有端点对，所以复合关系是空的。" : `$${endsTex}$，共 $${pairs.length}$ 个。`}\n\n**检验。** ${paths === pairs.length ? `$${paths}$ 条路径的端点各不相同，所以没有重复计数。` : `$${paths}$ 条路径只给出 $${pairs.length}$ 对，因为有些路径的两端相同。`}`,
        ],
        {
          svg: svgDocument(220, body),
          alt: t(
            `Three columns of ${l}, ${m} and ${r} points. The first relation joins ${pairAlt(first)} and the second joins ${pairAlt(second)}, numbering each column from the top.`,
            `三列，分别有 ${l}、${m}、${r} 个点。第一个关系连接 ${pairAlt(first)}，第二个连接 ${pairAlt(second)}，每列从上往下编号。`,
          ),
        },
      ),
      [
        ...(paths !== pairs.length
          ? [
              say(
                String(paths),
                "That counts paths; paths with the same two ends give one pair.",
                "这数的是路径；两端相同的路径只给出一对。",
              ),
            ]
          : []),
        say(
          String(first.length * second.length),
          "That pairs every arrow of $R$ with every arrow of $S$; they must meet at the same middle point.",
          "这把 $R$ 的每个箭头与 $S$ 的每个箭头都配对了；它们必须在同一个中间点相接。",
        ),
        say(
          String(first.length + second.length),
          "That counts the arrows; the composition counts pairs of ends of joined paths.",
          "这数的是箭头；复合关系数的是相接路径的端点对。",
        ),
      ],
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
    "Set-builder notation describes a planar region by the conditions its points satisfy. For a shaded quarter of the plane, read the boundaries first, which give the values $k$ and $m$, and then decide on which side of each boundary the shading lies. A point test is a useful check: pick a shaded point and substitute it.\n\n> **Watch out.** A vertical line has an equation $x = k$ and a horizontal line $y = m$, so the number read off the vertical line belongs with $x$. Shading to the right of a vertical line means $x \\geq k$, and shading below a horizontal line means $y \\leq m$.",
    "集合构造记法用点满足的条件描述平面区域。对平面上阴影的四分之一，先读边界，它们给出 $k$ 和 $m$ 的值，再判断阴影在每条边界的哪一侧。代入点检验很有用：取一个阴影中的点代入验证。\n\n> **注意。** 竖直线的方程是 $x = k$，水平线的方程是 $y = m$，所以从竖直线读出的数属于 $x$。阴影在竖直线右边表示 $x \\geq k$，阴影在水平线下方表示 $y \\leq m$。",
  ],
  (rng) => {
    const k = rng.int(-3, 3);
    let m = rng.int(-3, 3);
    if (m === k) m = k === 3 ? 2 : k + 1;
    const right = rng.pick(planarRegions);
    const xUp = (r: PlanarRegion) => r.tex(0, 0).includes("x \\geq");
    const yUp = (r: PlanarRegion) => r.tex(0, 0).includes("y \\geq");
    const others = planarRegions.filter((r) => r !== right);
    const side = (up: boolean): Pair => (up ? ["to the right of", "右边"] : ["to the left of", "左边"]);
    const level = (up: boolean): Pair => (up ? ["above", "上方"] : ["below", "下方"]);
    const reasons = others.map((r): Reason => {
      const tex = r.tex(k, m);
      if (xUp(r) !== xUp(right) && yUp(r) !== yUp(right)) {
        return [
          same(tex)[0],
          `This set is the opposite quarter: both inequalities face the wrong way.`,
          `这是相对的那个四分之一：两个不等式的方向都反了。`,
        ];
      }
      if (xUp(r) !== xUp(right)) {
        return [
          same(tex)[0],
          `The shading lies ${side(xUp(right))[0]} the line $x = ${k}$, but this set takes the points ${side(xUp(r))[0]} it.`,
          `阴影在直线 $x = ${k}$ 的${side(xUp(right))[1]}，但这个集合取的是它${side(xUp(r))[1]}的点。`,
        ];
      }
      return [
        same(tex)[0],
        `The shading lies ${level(yUp(right))[0]} the line $y = ${m}$, but this set takes the points ${level(yUp(r))[0]} it.`,
        `阴影在直线 $y = ${m}$ 的${level(yUp(right))[1]}，但这个集合取的是它${level(yUp(r))[1]}的点。`,
      ];
    });
    reasons.push([
      same(right.tex(m, k))[0],
      `This swaps the boundaries: the vertical line is $x = ${k}$, so $${k}$ belongs with $x$, and $${m}$ with $y$.`,
      `这把两条边界弄反了：竖直线是 $x = ${k}$，所以 $${k}$ 属于 $x$，$${m}$ 属于 $y$。`,
    ]);
    const px = xUp(right) ? k + 1 : k - 1;
    const py = yUp(right) ? m + 1 : m - 1;
    const tex = right.tex(k, m);
    return reasoned(
      choose(
        rng,
        ["Which set is the shaded region, boundaries included?", "阴影区域（包括边界）是哪个集合？"],
        same(tex),
        [...others.map((r) => same(r.tex(k, m))), same(right.tex(m, k))],
        [
          `**Step 1: Read the boundaries.** The vertical line is $x = ${k}$ and the horizontal line is $y = ${m}$.\n\n**Step 2: Read the sides.** The shading is ${right.clue[0]}: ${side(xUp(right))[0]} $x = ${k}$ gives $x ${xUp(right) ? "\\geq" : "\\leq"} ${k}$, and ${level(yUp(right))[0]} $y = ${m}$ gives $y ${yUp(right) ? "\\geq" : "\\leq"} ${m}$. With the boundaries included, the set is $${tex}$.\n\n**Check.** The shaded point $(${px}, ${py})$ satisfies both conditions: $${px} ${xUp(right) ? "\\geq" : "\\leq"} ${k}$ and $${py} ${yUp(right) ? "\\geq" : "\\leq"} ${m}$.`,
          `**第一步：读边界。** 竖直线是 $x = ${k}$，水平线是 $y = ${m}$。\n\n**第二步：读方向。** 阴影是${right.clue[1]}：在 $x = ${k}$ 的${side(xUp(right))[1]}给出 $x ${xUp(right) ? "\\geq" : "\\leq"} ${k}$，在 $y = ${m}$ 的${level(yUp(right))[1]}给出 $y ${yUp(right) ? "\\geq" : "\\leq"} ${m}$。包括边界，集合就是 $${tex}$。\n\n**检验。** 阴影中的点 $(${px}, ${py})$ 满足两个条件：$${px} ${xUp(right) ? "\\geq" : "\\leq"} ${k}$，$${py} ${yUp(right) ? "\\geq" : "\\leq"} ${m}$。`,
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
      ),
      reasons,
    );
  },
);

const partitionCheck = point(
  "whether-drawn-groups-form-a-partition",
  ["Whether drawn groups form a partition", "图中的分组是否构成分划"],
  [
    "A partition of a set divides it into nonempty blocks so that every element is in exactly one block. A drawing fails this test if a point lies in two blocks, or if an element of the set lies in none. Otherwise the blocks form a partition, however unequal in size they may be, and a block with one point is allowed. For example, $\\{1, 2\\}, \\{3\\}, \\{4, 5, 6\\}$ is a partition of $\\{1, 2, 3, 4, 5, 6\\}$, but $\\{1, 2\\}, \\{2, 3\\}, \\{4, 5, 6\\}$ is not, because $2$ lies in two blocks.\n\n> **Watch out.** Sizes do not matter. Look for an element drawn twice and for an element drawn nowhere; if neither happens, the blocks form a partition.",
    "集合的分划把它分成非空的块，使每个元素恰好在一个块中。如果有点落在两个块中，或者集合中有元素不在任何块中，图就不符合。否则这些块构成分划，不管大小多么不等，只含一点的块也可以。例如，$\\{1, 2\\}, \\{3\\}, \\{4, 5, 6\\}$ 是 $\\{1, 2, 3, 4, 5, 6\\}$ 的分划，但 $\\{1, 2\\}, \\{2, 3\\}, \\{4, 5, 6\\}$ 不是，因为 $2$ 在两个块中。\n\n> **注意。** 大小无关紧要。要找的是画了两次的元素和哪里都没画的元素；两者都没有，这些块就构成分划。",
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
    const twice = blocks[0]?.[0] as number;
    const extra = kind === "overlap" ? node(place(1, 3), String(twice)) : "";
    const missing = kind === "missing" ? n + rng.int(1, 3) : 0;
    const domain = kind === "missing" ? [...set, missing] : set;
    const options: Record<string, Pair> = {
      partition: ["It is a partition", "是分划"],
      overlap: ["It is not a partition, because a point lies in two blocks", "不是分划，因为有一点在两个块中"],
      missing: ["It is not a partition, because a point lies in no block", "不是分划，因为有一点不在任何块中"],
      empty: ["It is not a partition, because blocks must have equal sizes", "不是分划，因为各块大小必须相等"],
    };
    const why: Record<string, Pair> = {
      partition:
        kind === "overlap"
          ? [
              `$${twice}$ is drawn in two ellipses, so it is not in exactly one block.`,
              `$${twice}$ 画在两个椭圆中，所以它不是恰好在一个块中。`,
            ]
          : [`$${missing}$ is an element of the set but lies in no ellipse.`, `$${missing}$ 是集合的元素，却不在任何椭圆中。`],
      overlap: ["No number is drawn in two ellipses.", "没有数画在两个椭圆中。"],
      missing: ["Every element of the set lies in some ellipse.", "集合的每个元素都在某个椭圆中。"],
      empty: [
        "Blocks of a partition may have any sizes; only an element in two blocks or in none breaks the rule.",
        "分划的块可以是任意大小；只有元素在两个块中或不在任何块中才违反规则。",
      ],
    };
    const reasons = Object.keys(options)
      .filter((k) => k !== kind)
      .map((k): Reason => [(options[k] as Pair)[0], (why[k] as Pair)[0], (why[k] as Pair)[1]]);
    const drawnCount = n + (kind === "overlap" ? 1 : 0);
    const sizes = blocks.map((b) => b.length).join(" + ");
    const step1: Pair =
      kind === "overlap"
        ? [`$${twice}$ is drawn in the first ellipse and again in the second.`, `$${twice}$ 画在第一个椭圆中，又画在第二个椭圆中。`]
        : ["No number is drawn twice.", "没有数画了两次。"];
    const step2: Pair =
      kind === "missing"
        ? [`$${missing}$ is in the set but in no ellipse.`, `$${missing}$ 在集合中，却不在任何椭圆中。`]
        : ["Every element of the set appears in an ellipse.", "集合的每个元素都出现在某个椭圆中。"];
    const verdict: Pair =
      kind === "partition"
        ? ["Every element lies in exactly one block, so the blocks form a partition.", "每个元素恰好在一个块中，所以这些块构成分划。"]
        : kind === "overlap"
          ? [`$${twice}$ lies in two blocks, so this is not a partition.`, `$${twice}$ 在两个块中，所以这不是分划。`]
          : [`$${missing}$ lies in no block, so this is not a partition.`, `$${missing}$ 不在任何块中，所以这不是分划。`];
    const check: Pair =
      kind === "partition"
        ? [
            `The blocks hold ${sizes} = ${n} points, the size of the set, as they must when each element is counted once.`,
            `各块共有 ${sizes} = ${n} 个点，正是集合的大小，每个元素恰好算一次时就应如此。`,
          ]
        : kind === "overlap"
          ? [
              `The ellipses hold ${drawnCount} points for a set of ${n} elements, so some element is counted twice.`,
              `椭圆中共有 ${drawnCount} 个点，而集合只有 ${n} 个元素，所以有元素被算了两次。`,
            ]
          : [
              `The ellipses hold ${drawnCount} points for a set of ${n + 1} elements, so some element is left out.`,
              `椭圆中共有 ${drawnCount} 个点，而集合有 ${n + 1} 个元素，所以有元素被漏掉。`,
            ];
    return reasoned(
      choose(
        rng,
        [
          `The ellipses show proposed blocks for the set $\\{${domain.join(", ")}\\}$. Do they form a partition?`,
          `椭圆表示集合 $\\{${domain.join(", ")}\\}$ 的拟议分块。它们是否构成分划？`,
        ],
        options[kind] as Pair,
        Object.keys(options)
          .filter((k) => k !== kind)
          .map((k) => options[k] as Pair),
        [
          `**Step 1: Look for an element drawn twice.** ${step1[0]}\n\n**Step 2: Look for an element drawn nowhere.** ${step2[0]} ${verdict[0]}\n\n**Check.** ${check[0]}`,
          `**第一步：找画了两次的元素。** ${step1[1]}\n\n**第二步：找哪里都没画的元素。** ${step2[1]}${verdict[1]}\n\n**检验。** ${check[1]}`,
        ],
        {
          svg: svgDocument(130, body + extra),
          alt: t(
            `Ellipses holding the blocks ${blocks.map((b) => `{${b.join(", ")}}`).join(", ")}${kind === "overlap" ? `, with ${twice} also drawn in the second block` : ""}.`,
            `椭圆中的块为 ${blocks.map((b) => `{${b.join(", ")}}`).join("，")}${kind === "overlap" ? `，${twice} 同时画在第二个块中` : ""}。`,
          ),
        },
      ),
      reasons,
    );
  },
);

const indicatorGraph = {
  ...point(
    "the-set-of-a-drawn-indicator-function",
    ["The set of a drawn indicator function", "图中示性函数的集合"],
    [
      "The indicator function of a set equals one on the set and zero off it. So its graph shows the set directly as the part at height one. At each end of that part, one of the two dots, at height one or at height zero, is filled: it gives the value there. A filled dot at height one means the end belongs to the set, so its bracket is square; a filled dot at height zero means it does not, so its bracket is round. For example, a graph at height one from $-1$ to $2$, filled at $(-1, 1)$ and at $(2, 0)$, is the indicator function of $[-1, 2)$.\n\n> **Watch out.** Read the end from the filled dot, not from where the segment seems to stop. A hollow dot at height one, with a filled dot below it, leaves the end out of the set.",
      "集合的示性函数在集合上等于一，在集合外等于零。所以它的图以高度一的部分直接显示这个集合。在这部分的每个端点处，高度一和高度零的两个点中有一个是实心的：它给出那里的函数值。高度一处实心，表示端点属于集合，用方括号；高度零处实心，表示端点不属于集合，用圆括号。例如，从 $-1$ 到 $2$ 高度为一、在 $(-1, 1)$ 和 $(2, 0)$ 处实心的图，是 $[-1, 2)$ 的示性函数。\n\n> **注意。** 端点要看实心点，而不是看线段似乎停在哪里。高度一处是空心点、下方是实心点时，端点不属于集合。",
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
      const word = (inSet: boolean): Pair => (inSet ? ["belongs to the set", "属于集合"] : ["does not belong to the set", "不属于集合"]);
      const end = (x: number, inSet: boolean): Pair => [
        `The filled dot at $${x}$ is at height ${inSet ? "one" : "zero"}, so $${x}$ ${word(inSet)[0]}, but this interval ${inSet ? "leaves it out" : "includes it"}.`,
        `$${x}$ 处的实心点在高度${inSet ? "一" : "零"}，所以 $${x}$ ${word(inSet)[1]}，但这个区间${inSet ? "不包含它" : "包含了它"}。`,
      ];
      const wrong: [boolean, boolean][] = [
        [!leftIn, rightIn],
        [leftIn, !rightIn],
        [!leftIn, !rightIn],
      ];
      const reasons = wrong.map(([l, r]): Reason => {
        const parts = [...(l !== leftIn ? [end(a, leftIn)] : []), ...(r !== rightIn ? [end(b, rightIn)] : [])];
        return [same(interval(l, r))[0], parts.map((p) => p[0]).join(" "), parts.map((p) => p[1]).join("")];
      });
      const bracket = (inSet: boolean, left: boolean) => (inSet ? (left ? "[" : "]") : left ? "(" : ")");
      const right = interval(leftIn, rightIn);
      return reasoned(
        choose(
          rng,
          ["The graph shows the indicator function of a set. Which set is it?", "图中是某集合的示性函数。它是哪个集合？"],
          same(right),
          wrong.map(([l, r]) => same(interval(l, r))),
          [
            `**Step 1: Find the part at height one.** The graph is at height one from $${a}$ to $${b}$, so the set runs from $${a}$ to $${b}$.\n\n**Step 2: Read the ends.** At $${a}$ the filled dot is at height ${leftIn ? "one" : "zero"}, so $${a}$ ${word(leftIn)[0]} and the bracket is $${bracket(leftIn, true)}$. At $${b}$ the filled dot is at height ${rightIn ? "one" : "zero"}, so $${b}$ ${word(rightIn)[0]} and the bracket is $${bracket(rightIn, false)}$. The set is $${right}$.\n\n**Check.** $${a + 1}$ lies inside, where the graph is at height one, and $${b + 1}$ lies outside, where it is at height zero; $${right}$ contains $${a + 1}$ and not $${b + 1}$.`,
            `**第一步：找高度为一的部分。** 图在 $${a}$ 到 $${b}$ 之间高度为一，所以集合从 $${a}$ 到 $${b}$。\n\n**第二步：读端点。** 在 $${a}$ 处，实心点在高度${leftIn ? "一" : "零"}，所以 $${a}$ ${word(leftIn)[1]}，括号是 $${bracket(leftIn, true)}$。在 $${b}$ 处，实心点在高度${rightIn ? "一" : "零"}，所以 $${b}$ ${word(rightIn)[1]}，括号是 $${bracket(rightIn, false)}$。集合是 $${right}$。\n\n**检验。** $${a + 1}$ 在内部，图在那里高度为一；$${b + 1}$ 在外部，图在那里高度为零；$${right}$ 包含 $${a + 1}$ 而不包含 $${b + 1}$。`,
          ],
          drawn(
            { xMin: -7, xMax: 7, yMin: -2, yMax: 3 },
            marks,
            t(
              `Height one from ${a} (${leftIn ? "filled" : "open"} there) to ${b} (${rightIn ? "filled" : "open"} there), and zero elsewhere.`,
              `从 ${a}（那里${leftIn ? "实心" : "空心"}）到 ${b}（那里${rightIn ? "实心" : "空心"}）高度为一，其他地方为零。`,
            ),
          ),
        ),
        reasons,
      );
    },
  ),
  figure: proofDrawings1["indicator-functions#the-set-of-a-drawn-indicator-function"],
};

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
