import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q, svgDocument } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, steps, yesNo } from "../problems.ts";

// Conditional probability (Geometry 6.18) and combinatorics (Geometry 6.19).

/** fr writes a fraction n/d as it is, without simplifying it. */
const fr = (n: number, d: number) => `\\frac{${n}}{${d}}`;

/** ratioL writes n/d and, when it simplifies, "= " its simplest form. */
function ratioL(n: number, d: number): string {
  const v = Q.of(n, d).toLatex();
  return v === fr(n, d) ? v : `${fr(n, d)} = ${v}`;
}

/** h writes a number of hundredths as a decimal: h(35) is "0.35". */
const h = (x: number) => dec(Q.of(x, 100));

/** simplest asks for a fraction in simplest form. */
const simplest = t(" Give the answer as a fraction in simplest form.", "答案写成最简分数。");

/** asDecimal asks for a decimal. */
const asDecimal = t(" Give the answer as a decimal.", "答案写成小数。");

/** svgText writes a filled text element centered at (x, y). */
const svgText = (x: number, y: number, s: string, italic = false) =>
  `<text x="${x}" y="${y}" stroke="none" fill="currentColor"${italic ? ' font-style="italic"' : ""}>${s}</text>`;

/** venn draws two overlapping circles named a and b in a rectangle, with the values of A only, both, B only and neither. */
function venn(a: string, b: string, values: readonly [string, string, string, string]): string {
  return svgDocument(
    170,
    `<rect x="10" y="10" width="300" height="150"/>` +
      `<g class="accent"><circle cx="125" cy="88" r="62"/><circle cx="195" cy="88" r="62"/></g>` +
      svgText(52, 34, a, true) +
      svgText(268, 34, b, true) +
      svgText(94, 92, values[0]) +
      svgText(160, 92, values[1]) +
      svgText(226, 92, values[2]) +
      svgText(282, 150, values[3]),
  );
}

/** vennAlt describes a Venn diagram for screen readers. */
function vennAlt(a: string, b: string, v: readonly [string, string, string, string]): Text {
  return t(
    `Venn diagram of ${a} and ${b}: ${v[0]} in ${a} only, ${v[1]} in both, ${v[2]} in ${b} only, ${v[3]} in neither.`,
    `${a} 与 ${b} 的维恩图：只在 ${a} 中 ${v[0]}，两者都在 ${v[1]}，只在 ${b} 中 ${v[2]}，都不在 ${v[3]}。`,
  );
}

/** Branch is one branch of a tree diagram: the outcome at its end and its probability. */
interface Branch {
  readonly label: string;
  readonly p: string;
}

/** tree draws a two-stage tree diagram from left to right. */
function tree(first: readonly [Branch, Branch], second: readonly [readonly [Branch, Branch], readonly [Branch, Branch]]): string {
  const root = [16, 100] as const;
  const mids = [
    [140, 50],
    [140, 150],
  ] as const;
  const leaves = [
    [
      [270, 22],
      [270, 78],
    ],
    [
      [270, 122],
      [270, 178],
    ],
  ] as const;
  let body = `<circle cx="${root[0]}" cy="${root[1]}" r="2.5" fill="currentColor" stroke="none"/>`;
  for (const i of [0, 1] as const) {
    const [mx, my] = mids[i];
    body += `<line class="accent" x1="${root[0]}" y1="${root[1]}" x2="${mx - 12}" y2="${my}"/>`;
    body += svgText(mx, my + 4, first[i].label, true);
    body += svgText((root[0] + mx - 12) / 2, (root[1] + my) / 2 + (i === 0 ? -10 : 18), first[i].p);
    for (const j of [0, 1] as const) {
      const [lx, ly] = leaves[i][j];
      body += `<line class="accent" x1="${mx + 12}" y1="${my}" x2="${lx - 12}" y2="${ly}"/>`;
      body += svgText(lx, ly + 4, second[i][j].label, true);
      body += svgText((mx + lx) / 2, (my + ly) / 2 + (j === 0 ? -10 : 18), second[i][j].p);
    }
  }
  return svgDocument(200, body);
}

/** treeAlt describes a tree diagram for screen readers. */
function treeAlt(first: readonly [Branch, Branch], second: readonly [readonly [Branch, Branch], readonly [Branch, Branch]]): Text {
  const part = (i: 0 | 1) =>
    `${first[i].label} (${first[i].p}), then ${second[i][0].label} (${second[i][0].p}) or ${second[i][1].label} (${second[i][1].p})`;
  const partZh = (i: 0 | 1) =>
    `${first[i].label}（${first[i].p}），之后 ${second[i][0].label}（${second[i][0].p}）或 ${second[i][1].label}（${second[i][1].p}）`;
  return t(`Tree diagram: ${part(0)}; ${part(1)}.`, `树状图：${partZh(0)}；${partZh(1)}。`);
}

/** treeFigure builds a tree diagram figure. */
const treeFigure = (first: readonly [Branch, Branch], second: readonly [readonly [Branch, Branch], readonly [Branch, Branch]]): Figure => ({
  svg: tree(first, second),
  alt: treeAlt(first, second),
});

/** fact is n!. */
function fact(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** perm is the number of ordered selections of r of n objects. */
function perm(n: number, r: number): number {
  let p = 1;
  for (let i = 0; i < r; i++) p *= n - i;
  return p;
}

/** comb is the number of unordered selections of r of n objects. */
const comb = (n: number, r: number) => perm(n, r) / fact(r);

/** prodL writes the product n(n-1)…(n-r+1): "7 \cdot 6 \cdot 5". */
function prodL(n: number, r: number): string {
  return Array.from({ length: r }, (_, i) => n - i).join(" \\cdot ");
}

// ---------------------------------------------------------------------------
// Venn diagrams

/** Pair is two characteristics of the people in a survey, with the letters of their events. */
interface Pair {
  readonly a: string;
  readonly b: string;
  readonly aDo: Text;
  readonly bDo: Text;
}

const pairs: readonly Pair[] = [
  { a: "S", b: "M", aDo: t("study Spanish", "学西班牙语"), bDo: t("play a musical instrument", "会演奏乐器") },
  { a: "C", b: "D", aDo: t("own a cat", "养猫"), bDo: t("own a dog", "养狗") },
  { a: "T", b: "C", aDo: t("drink tea", "喝茶"), bDo: t("drink coffee", "喝咖啡") },
  { a: "F", b: "B", aDo: t("play football", "踢足球"), bDo: t("play basketball", "打篮球") },
  { a: "W", b: "R", aDo: t("walk to school", "步行上学"), bDo: t("read every day", "每天阅读") },
];

/** Ev is the event A or B (set 0 or 1), or its complement. */
interface Ev {
  readonly set: 0 | 1;
  readonly not: boolean;
}

const inSet = [
  [true, true, false, false],
  [false, true, true, false],
] as const;

/** holds tells whether region r (A only, both, B only, neither) lies in event e. */
const holds = (e: Ev, r: number) => inSet[e.set][r] !== e.not;

/** evL writes an event in LaTeX: "S", "S'". */
const evL = (p: Pair, e: Ev) => (e.set === 0 ? p.a : p.b) + (e.not ? "'" : "");

/** evDo describes the people in an event: "own a cat", "do not own a cat". */
function evDo(p: Pair, e: Ev): Text {
  const d = e.set === 0 ? p.aDo : p.bDo;
  return e.not ? t(`do not ${d.en}`, `不${d["zh-CN"]}`) : d;
}

/** sumOf adds the values of the regions in which pred holds. */
const sumOf = (v: readonly number[], pred: (r: number) => boolean) => v.reduce((s, x, r) => (pred(r) ? s + x : s), 0);

/** Conditional is a conditional probability read from region values. */
interface Conditional {
  readonly joint: number;
  readonly cond: number;
  readonly target: number;
  readonly total: number;
}

/** conditional computes the values needed for P(target | cond). */
function conditional(v: readonly number[], target: Ev, cond: Ev): Conditional {
  return {
    joint: sumOf(v, (r) => holds(target, r) && holds(cond, r)),
    cond: sumOf(v, (r) => holds(cond, r)),
    target: sumOf(v, (r) => holds(target, r)),
    total: sumOf(v, () => true),
  };
}

/** pickEvents draws a target and a condition on different sets, with at least one complement when complements is set. */
function pickEvents(rng: Rng, complements: boolean | undefined): [Ev, Ev] {
  const s = rng.pick([0, 1] as const);
  const o = (1 - s) as 0 | 1;
  if (complements === false)
    return [
      { set: s, not: false },
      { set: o, not: false },
    ];
  if (complements === true) {
    const k = rng.int(0, 2);
    return [
      { set: s, not: k !== 1 },
      { set: o, not: k !== 0 },
    ];
  }
  return [
    { set: s, not: rng.bool(0.3) },
    { set: o, not: rng.bool(0.3) },
  ];
}

/** vennCounts draws counts for the four regions, each at least 1. */
const vennCounts = (rng: Rng): [number, number, number, number] => [rng.int(2, 25), rng.int(1, 18), rng.int(2, 25), rng.int(1, 15)];

/** vennCountProblem asks a conditional probability from a Venn diagram of counts. */
function vennCountProblem(rng: Rng, complements: boolean): Problem {
  const p = rng.pick(pairs);
  const v = vennCounts(rng);
  const [target, cond] = pickEvents(rng, complements);
  const c = conditional(v, target, cond);
  const vs = v.map(String) as unknown as [string, string, string, string];
  const tL = evL(p, target);
  const cL = evL(p, cond);
  const tD = evDo(p, target);
  const cD = evDo(p, cond);
  return {
    ...numberProblem({
      prompt: t(
        `The Venn diagram shows how many of the $${c.total}$ people surveyed ${p.aDo.en} ($${p.a}$) and how many ${p.bDo.en} ($${p.b}$). One of the people who ${cD.en} is chosen at random. What is the probability that this person ${tD.en.replace(/^do not/, "does not").replace(/^(\w+)/, (w) => (w === "does" ? w : thirdPerson(w)))}?${simplest.en}`,
        `维恩图显示了接受调查的 $${c.total}$ 人中${p.aDo["zh-CN"]}（$${p.a}$）和${p.bDo["zh-CN"]}（$${p.b}$）的人数。从${cD["zh-CN"]}的人中随机选一人，求此人${tD["zh-CN"]}的概率。${simplest["zh-CN"]}`,
      ),
      answer: Q.of(c.joint, c.cond),
      wrong: [Q.of(c.joint, c.total), Q.of(c.joint, c.target), Q.of(c.cond, c.total)],
      solution: t(
        `Only the $${c.cond}$ people who ${cD.en} count. Of them, $${c.joint}$ are also in $${tL}$:${steps(`P(${tL} \\mid ${cL}) = \\frac{n(${tL} \\cap ${cL})}{n(${cL})} = ${ratioL(c.joint, c.cond)}`)}`,
        `只考虑${cD["zh-CN"]}的 $${c.cond}$ 人，其中 $${c.joint}$ 人也属于 $${tL}$：${steps(`P(${tL} \\mid ${cL}) = \\frac{n(${tL} \\cap ${cL})}{n(${cL})} = ${ratioL(c.joint, c.cond)}`)}`,
      ),
    }),
    figure: { svg: venn(p.a, p.b, vs), alt: vennAlt(p.a, p.b, vs) },
  };
}

/** thirdPerson turns a verb into its third-person singular form: "own" → "owns", "study" → "studies". */
function thirdPerson(w: string): string {
  if (w.endsWith("y") && !/[aeiou]y$/.test(w)) return `${w.slice(0, -1)}ies`;
  if (/(s|sh|ch|x)$/.test(w)) return `${w}es`;
  return `${w}s`;
}

/** sing writes what a person does in the third person: "owns a cat", "does not own a cat". */
function sing(d: Text): string {
  if (d.en.startsWith("do not ")) return `does not ${d.en.slice(7)}`;
  return d.en.replace(/^(\w+)/, (w) => thirdPerson(w));
}

/** Conditional probabilities from Venn diagrams (Geometry 6.18.1). */
export const conditionalProbabilitiesFromVennDiagrams: TopicDef = {
  id: "conditional-probabilities-from-venn-diagrams",
  title: t("Conditional Probabilities From Venn Diagrams", "由维恩图求条件概率"),
  summary: t(
    "Find the probability of an event given that another event happens, from a Venn diagram of counts or of probabilities.",
    "由标有人数或概率的维恩图，求在一个事件发生的条件下另一个事件的概率。",
  ),
  prerequisites: ["fractions-and-decimals"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.3"],
  knowledgePoints: [
    {
      id: "conditional-from-counts",
      title: t("Conditional probability from counts", "由人数求条件概率"),
      explanation: t(
        "The **conditional probability** of $A$ given $B$, written $P(A \\mid B)$, is the probability that $A$ happens when we already know that $B$ happens. Knowing $B$ shrinks the sample space to $B$, so only the outcomes in $B$ count:\n\n$$P(A \\mid B) = \\frac{n(A \\cap B)}{n(B)}.$$\n\nIn the diagram, $20$ people were asked whether they study Spanish ($S$) and whether they play an instrument ($M$). One of the musicians is chosen at random. There are $4 + 6 = 10$ musicians, and $4$ of them study Spanish, so\n\n$$P(S \\mid M) = \\frac{4}{10} = \\frac{2}{5}.$$\n\nThe order matters: $P(M \\mid S) = \\frac{4}{8 + 4} = \\frac{1}{3}$ is a different probability, and $P(S \\cap M) = \\frac{4}{20}$ divides by everyone instead of by the musicians.",
        "在已知事件 $B$ 发生的条件下事件 $A$ 发生的概率，叫做 $B$ 发生条件下 $A$ 的**条件概率**，记作 $P(A \\mid B)$。已知 $B$ 发生，样本空间就缩小为 $B$，只有 $B$ 中的结果才算数：\n\n$$P(A \\mid B) = \\frac{n(A \\cap B)}{n(B)}.$$\n\n图中调查了 $20$ 人是否学西班牙语（$S$）、是否会演奏乐器（$M$）。从会演奏乐器的人中随机选一人。会演奏乐器的有 $4 + 6 = 10$ 人，其中 $4$ 人学西班牙语，所以\n\n$$P(S \\mid M) = \\frac{4}{10} = \\frac{2}{5}.$$\n\n顺序很重要：$P(M \\mid S) = \\frac{4}{8 + 4} = \\frac{1}{3}$ 是另一个概率；而 $P(S \\cap M) = \\frac{4}{20}$ 是除以全部人数，而不是除以会演奏乐器的人数。",
      ),
      figure: { svg: venn("S", "M", ["8", "4", "6", "2"]), alt: vennAlt("S", "M", ["8", "4", "6", "2"]) },
      generate: (rng) => vennCountProblem(rng, false),
    },
    {
      id: "conditional-with-complements",
      title: t("Conditions with complements", "含对立事件的条件"),
      explanation: t(
        "The event or the condition may be a complement. $B'$ (not $B$) is everything outside $B$, including the region outside both circles. Shade the condition first, count it, then count the part of it that lies in the event.\n\nIn the diagram, $P(S \\mid M')$: the people who do not play an instrument are $8 + 2 = 10$, and $8$ of them study Spanish, so $P(S \\mid M') = \\frac{8}{10} = \\frac{4}{5}$. For $P(S' \\mid M)$: of the $10$ musicians, $6$ do not study Spanish, so $P(S' \\mid M) = \\frac{6}{10} = \\frac{3}{5}$.",
        "事件或条件也可能是对立事件。$B'$（非 $B$）是 $B$ 以外的全部，包括两个圆外面的区域。先找出条件对应的区域并数出人数，再数其中属于所求事件的人数。\n\n图中求 $P(S \\mid M')$：不会演奏乐器的有 $8 + 2 = 10$ 人，其中 $8$ 人学西班牙语，所以 $P(S \\mid M') = \\frac{8}{10} = \\frac{4}{5}$。求 $P(S' \\mid M)$：会演奏乐器的 $10$ 人中有 $6$ 人不学西班牙语，所以 $P(S' \\mid M) = \\frac{6}{10} = \\frac{3}{5}$。",
      ),
      figure: { svg: venn("S", "M", ["8", "4", "6", "2"]), alt: vennAlt("S", "M", ["8", "4", "6", "2"]) },
      generate: (rng) => vennCountProblem(rng, true),
    },
    {
      id: "conditional-from-probabilities",
      title: t("Conditional probability from probabilities", "由概率求条件概率"),
      explanation: t(
        "When a Venn diagram shows probabilities instead of counts, divide probabilities instead of counts:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}.$$\n\nIf $P(A \\text{ only}) = 0.3$, $P(A \\cap B) = 0.2$, $P(B \\text{ only}) = 0.3$ and the region outside is $0.2$, then $P(B) = 0.2 + 0.3 = 0.5$ and\n\n$$P(A \\mid B) = \\frac{0.2}{0.5} = \\frac{2}{5}.$$\n\nMultiplying the top and the bottom by $10$ or $100$ turns the decimals into whole numbers before simplifying.",
        "如果维恩图标的是概率而不是人数，就用概率相除：\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}.$$\n\n若只在 $A$ 中的概率是 $0.3$，$P(A \\cap B) = 0.2$，只在 $B$ 中的是 $0.3$，两圆之外是 $0.2$，则 $P(B) = 0.2 + 0.3 = 0.5$，\n\n$$P(A \\mid B) = \\frac{0.2}{0.5} = \\frac{2}{5}.$$\n\n分子分母同乘 $10$ 或 $100$，先把小数化成整数再约分。",
      ),
      generate(rng) {
        const p = rng.pick(pairs);
        const v = [rng.int(5, 35), rng.int(5, 25), rng.int(5, 35)];
        v.push(100 - v[0]! - v[1]! - v[2]!);
        const [target, cond] = pickEvents(rng, undefined);
        const c = conditional(v, target, cond);
        const vs = v.map(h) as [string, string, string, string];
        const tL = evL(p, target);
        const cL = evL(p, cond);
        return {
          ...numberProblem({
            prompt: t(
              `A person is chosen at random. The Venn diagram shows the probabilities that the person ${p.aDo.en} ($${p.a}$), ${p.bDo.en} ($${p.b}$), both or neither. Find $P(${tL} \\mid ${cL})$, the probability that the person ${sing(evDo(p, target))} given that the person ${sing(evDo(p, cond))}.${simplest.en}`,
              `随机选一人。维恩图给出了此人${p.aDo["zh-CN"]}（$${p.a}$）、${p.bDo["zh-CN"]}（$${p.b}$）、两者都是或两者都不是的概率。求 $P(${tL} \\mid ${cL})$，即在此人${evDo(p, cond)["zh-CN"]}的条件下，此人${evDo(p, target)["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(c.joint, c.cond),
            wrong: [Q.of(c.joint, 100), Q.of(c.joint, c.target), Q.of(c.cond, 100)],
            solution: t(
              `$P(${cL}) = ${h(c.cond)}$ and $P(${tL} \\cap ${cL}) = ${h(c.joint)}$, so${steps(`P(${tL} \\mid ${cL}) = \\frac{${h(c.joint)}}{${h(c.cond)}} = ${ratioL(c.joint, c.cond)}`)}`,
              `$P(${cL}) = ${h(c.cond)}$，$P(${tL} \\cap ${cL}) = ${h(c.joint)}$，所以${steps(`P(${tL} \\mid ${cL}) = \\frac{${h(c.joint)}}{${h(c.cond)}} = ${ratioL(c.joint, c.cond)}`)}`,
            ),
          }),
          figure: { svg: venn(p.a, p.b, vs), alt: vennAlt(p.a, p.b, vs) },
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Two-way tables

/** Cat is one category of a two-way table: its heading and what a member of it does. */
interface Cat {
  readonly label: Text;
  readonly is: Text;
}

/** TableCtx is a two-way table of people classified two ways. */
interface TableCtx {
  readonly intro: Text;
  readonly a: Text;
  readonly the: Text;
  readonly rows: readonly [Cat, Cat];
  readonly cols: readonly [Cat, Cat];
}

const tables: readonly TableCtx[] = [
  {
    intro: t("The table shows how the students of a school get to school.", "下表显示了某校学生的上学方式。"),
    a: t("A student", "一名学生"),
    the: t("the student", "这名学生"),
    rows: [
      { label: t("Grade 9", "九年级"), is: t("is in Grade 9", "是九年级的") },
      { label: t("Grade 10", "十年级"), is: t("is in Grade 10", "是十年级的") },
    ],
    cols: [
      { label: t("Walks", "步行"), is: t("walks to school", "步行上学") },
      { label: t("Takes the bus", "坐公交"), is: t("takes the bus to school", "坐公交上学") },
    ],
  },
  {
    intro: t("The table shows the visitors to a cinema on one evening.", "下表显示了某电影院一个晚上的观众情况。"),
    a: t("A visitor", "一名观众"),
    the: t("the visitor", "这名观众"),
    rows: [
      { label: t("Adult", "成年人"), is: t("is an adult", "是成年人") },
      { label: t("Child", "儿童"), is: t("is a child", "是儿童") },
    ],
    cols: [
      { label: t("Bought popcorn", "买了爆米花"), is: t("bought popcorn", "买了爆米花") },
      { label: t("No popcorn", "没买爆米花"), is: t("did not buy popcorn", "没有买爆米花") },
    ],
  },
  {
    intro: t(
      "The table shows the workers of a factory by shift and by whether they were late last week.",
      "下表按班次和上周是否迟到统计了某工厂的工人。",
    ),
    a: t("A worker", "一名工人"),
    the: t("the worker", "这名工人"),
    rows: [
      { label: t("Morning shift", "早班"), is: t("works the morning shift", "上早班") },
      { label: t("Evening shift", "晚班"), is: t("works the evening shift", "上晚班") },
    ],
    cols: [
      { label: t("Late", "迟到过"), is: t("was late last week", "上周迟到过") },
      { label: t("Not late", "没迟到"), is: t("was not late last week", "上周没有迟到") },
    ],
  },
];

/** tableMd writes a two-way table in Markdown, with totals when asked. */
function tableMd(c: TableCtx, cells: readonly (readonly number[])[], totals: boolean): Text {
  const make = (loc: "en" | "zh-CN", total: string) => {
    const head = `| | ${c.cols[0].label[loc]} | ${c.cols[1].label[loc]} |${totals ? ` ${total} |` : ""}`;
    const rule = `| :--- | ---: | ---: |${totals ? " ---: |" : ""}`;
    const rows = cells.map((r, i) => `| ${c.rows[i as 0 | 1].label[loc]} | ${r[0]} | ${r[1]} |${totals ? ` ${r[0]! + r[1]!} |` : ""}`);
    const lines = [head, rule, ...rows];
    if (totals) {
      const c0 = cells[0]![0]! + cells[1]![0]!;
      const c1 = cells[0]![1]! + cells[1]![1]!;
      lines.push(`| ${total} | ${c0} | ${c1} | ${c0 + c1} |`);
    }
    return `\n\n${lines.join("\n")}\n\n`;
  };
  return t(make("en", "Total"), make("zh-CN", "合计"));
}

/** tableProblem asks a conditional probability from a two-way table, given a row or given a column. */
function tableProblem(rng: Rng, byRow: boolean, totals: boolean): Problem {
  const c = rng.pick(tables);
  const cells = [
    [rng.int(3, 40), rng.int(3, 40)],
    [rng.int(3, 40), rng.int(3, 40)],
  ];
  const i = rng.int(0, 1);
  const j = rng.int(0, 1);
  const cell = cells[i]![j]!;
  const rowT = cells[i]![0]! + cells[i]![1]!;
  const colT = cells[0]![j]! + cells[1]![j]!;
  const total = rowT + cells[1 - i]![0]! + cells[1 - i]![1]!;
  const row = c.rows[i as 0 | 1];
  const col = c.cols[j as 0 | 1];
  const [given, wanted, den, other] = byRow ? [row, col, rowT, colT] : [col, row, colT, rowT];
  const tb = tableMd(c, cells, totals);
  return numberProblem({
    prompt: t(
      `${c.intro.en}${tb.en}${c.a.en} is chosen at random. Given that ${c.the.en} ${given.is.en}, what is the probability that ${c.the.en} ${wanted.is.en}?${simplest.en}`,
      `${c.intro["zh-CN"]}${tb["zh-CN"]}随机选${c.a["zh-CN"]}。已知${c.the["zh-CN"]}${given.is["zh-CN"]}，求${c.the["zh-CN"]}${wanted.is["zh-CN"]}的概率。${simplest["zh-CN"]}`,
    ),
    answer: Q.of(cell, den),
    wrong: [Q.of(cell, total), Q.of(cell, other), Q.of(den, total)],
    solution: t(
      `Only the ${byRow ? "row" : "column"} "${given.label.en}" counts: it has $${totals ? den : `${byRow ? cells[i]![0] : cells[0]![j]} + ${byRow ? cells[i]![1] : cells[1]![j]} = ${den}`}$ people, and $${cell}$ of them are also in "${wanted.label.en}":${steps(`P = ${ratioL(cell, den)}`)}`,
      `只考虑“${given.label["zh-CN"]}”这一${byRow ? "行" : "列"}：共 $${totals ? den : `${byRow ? cells[i]![0] : cells[0]![j]} + ${byRow ? cells[i]![1] : cells[1]![j]} = ${den}`}$ 人，其中 $${cell}$ 人也属于“${wanted.label["zh-CN"]}”：${steps(`P = ${ratioL(cell, den)}`)}`,
    ),
  });
}

/** Conditional probabilities from two-way tables (Geometry 6.18.2). */
export const conditionalProbabilitiesFromTables: TopicDef = {
  id: "conditional-probabilities-from-tables",
  title: t("Conditional Probabilities From Tables", "由表格求条件概率"),
  summary: t(
    "Find conditional probabilities from two-way tables by restricting to one row or one column.",
    "在双向表中只看一行或一列，求条件概率。",
  ),
  prerequisites: ["conditional-probabilities-from-venn-diagrams"],
  encompasses: [{ topic: "conditional-probabilities-from-venn-diagrams", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.4", "CCSS.HSS.CP.B.6"],
  knowledgePoints: [
    {
      id: "given-a-row",
      title: t("Given a row", "已知所在行"),
      explanation: t(
        "A **two-way table** counts the members of a group classified in two ways. To find a probability *given* a category, keep only that category's row or column: its total is the denominator.\n\n| | Walks | Bus | Total |\n| :--- | ---: | ---: | ---: |\n| Grade 9 | 18 | 12 | 30 |\n| Grade 10 | 10 | 20 | 30 |\n| Total | 28 | 32 | 60 |\n\nGiven that a randomly chosen student is in Grade 9, the probability that the student walks is\n\n$$P(\\text{walks} \\mid \\text{Grade 9}) = \\frac{18}{30} = \\frac{3}{5}.$$\n\nDividing by $60$ would give the probability of being in Grade 9 *and* walking, a different question.",
        "**双向表**把一组对象按两种方式分类计数。求*已知*某一类时的概率，只保留这一类所在的行或列，它的合计就是分母。\n\n| | 步行 | 坐公交 | 合计 |\n| :--- | ---: | ---: | ---: |\n| 九年级 | 18 | 12 | 30 |\n| 十年级 | 10 | 20 | 30 |\n| 合计 | 28 | 32 | 60 |\n\n已知随机选出的学生是九年级的，他步行上学的概率是\n\n$$P(\\text{步行} \\mid \\text{九年级}) = \\frac{18}{30} = \\frac{3}{5}.$$\n\n如果除以 $60$，得到的是“是九年级的*且*步行上学”的概率，那是另一个问题。",
      ),
      generate: (rng) => tableProblem(rng, true, true),
    },
    {
      id: "given-a-column",
      title: t("Given a column", "已知所在列"),
      explanation: t(
        'The condition may be a column instead. In the table of the previous step, given that a student walks, the probability that the student is in Grade 9 uses the column "Walks", whose total is $28$:\n\n$$P(\\text{Grade 9} \\mid \\text{walks}) = \\frac{18}{28} = \\frac{9}{14}.$$\n\nThis is not the same as $P(\\text{walks} \\mid \\text{Grade 9}) = \\frac{3}{5}$: the cell is the same, but the condition, and so the denominator, is different.',
        "条件也可能是一列。在上一步的表中，已知学生步行上学，求他是九年级的概率，要看“步行”这一列，它的合计是 $28$：\n\n$$P(\\text{九年级} \\mid \\text{步行}) = \\frac{18}{28} = \\frac{9}{14}.$$\n\n它和 $P(\\text{步行} \\mid \\text{九年级}) = \\frac{3}{5}$ 不同：单元格相同，但条件不同，所以分母不同。",
      ),
      generate: (rng) => tableProblem(rng, false, true),
    },
    {
      id: "tables-without-totals",
      title: t("Tables without totals", "没有合计的表格"),
      explanation: t(
        "When the table has no totals, add the row or column of the condition yourself. With Grade 9: $18$ walk, $12$ take the bus, the number of Grade 9 students is $18 + 12 = 30$, so $P(\\text{bus} \\mid \\text{Grade 9}) = \\frac{12}{30} = \\frac{2}{5}$.",
        "如果表中没有合计，自己把条件所在的行或列加起来。九年级有 $18$ 人步行、$12$ 人坐公交，九年级共 $18 + 12 = 30$ 人，所以 $P(\\text{坐公交} \\mid \\text{九年级}) = \\frac{12}{30} = \\frac{2}{5}$。",
      ),
      generate: (rng) => tableProblem(rng, rng.bool(), false),
    },
  ],
};

// ---------------------------------------------------------------------------
// The multiplication law

/** Bag is a container of objects of two colors drawn without replacement. */
interface Bag {
  readonly setup: (x: number, y: number) => Text;
  readonly two: Text;
  readonly x: Text;
  readonly y: Text;
  readonly letters: readonly [string, string];
}

const bags: readonly Bag[] = [
  {
    setup: (x, y) => t(`A bag holds ${x} red and ${y} blue marbles.`, `袋子里有 ${x} 颗红弹珠和 ${y} 颗蓝弹珠。`),
    two: t("Two marbles are taken out at random, one after the other, without replacement.", "不放回地依次随机取出两颗弹珠。"),
    x: t("red", "红色"),
    y: t("blue", "蓝色"),
    letters: ["R", "B"],
  },
  {
    setup: (x, y) => t(`A drawer holds ${x} grey and ${y} white socks.`, `抽屉里有 ${x} 只灰袜子和 ${y} 只白袜子。`),
    two: t("Two socks are taken out at random, one after the other, without replacement.", "不放回地依次随机取出两只袜子。"),
    x: t("grey", "灰色"),
    y: t("white", "白色"),
    letters: ["G", "W"],
  },
  {
    setup: (x, y) => t(`A box holds ${x} green and ${y} yellow counters.`, `盒子里有 ${x} 个绿色筹码和 ${y} 个黄色筹码。`),
    two: t("Two counters are taken out at random, one after the other, without replacement.", "不放回地依次随机取出两个筹码。"),
    x: t("green", "绿色"),
    y: t("yellow", "黄色"),
    letters: ["G", "Y"],
  },
];

/** The multiplication law for conditional probability (Geometry 6.18.3). */
export const theMultiplicationLawForConditionalProbability: TopicDef = {
  id: "the-multiplication-law-for-conditional-probability",
  title: t("The Multiplication Law for Conditional Probability", "条件概率的乘法公式"),
  summary: t(
    "Use P(A ∩ B) = P(A) · P(B | A) to find the probability that two events both happen, or to find a conditional probability.",
    "用 P(A ∩ B) = P(A) · P(B | A) 求两个事件同时发生的概率，或求条件概率。",
  ),
  prerequisites: ["conditional-probabilities-from-venn-diagrams", "dividing-fractions", "decimal-arithmetic"],
  encompasses: [
    { topic: "conditional-probabilities-from-venn-diagrams", weight: 0.3 },
    { topic: "multiplying-fractions", weight: 0.4 },
    { topic: "dividing-fractions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.8"],
  knowledgePoints: [
    {
      id: "probability-of-both",
      title: t("The probability that both happen", "两个事件同时发生的概率"),
      explanation: t(
        "Multiplying both sides of $P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$ by $P(A)$ gives the **multiplication law**:\n\n$$P(A \\cap B) = P(A) \\cdot P(B \\mid A).$$\n\nFor both events to happen, $A$ must happen, and then $B$ must happen given $A$. If the probability of rain on Saturday is $\\frac{2}{5}$ and, when it rains on Saturday, the probability of rain on Sunday is $\\frac{3}{4}$, then the probability of rain on both days is\n\n$$\\frac{2}{5} \\cdot \\frac{3}{4} = \\frac{6}{20} = \\frac{3}{10}.$$",
        "把 $P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$ 两边同乘 $P(A)$，得到**乘法公式**：\n\n$$P(A \\cap B) = P(A) \\cdot P(B \\mid A).$$\n\n两个事件都发生，就是 $A$ 先发生，再在 $A$ 发生的条件下 $B$ 发生。若周六下雨的概率是 $\\frac{2}{5}$，周六下雨时周日也下雨的概率是 $\\frac{3}{4}$，则两天都下雨的概率是\n\n$$\\frac{2}{5} \\cdot \\frac{3}{4} = \\frac{6}{20} = \\frac{3}{10}.$$",
      ),
      generate(rng) {
        const b = rng.int(3, 10);
        const a = rng.int(1, b - 1);
        const d = rng.int(3, 10);
        const c = rng.int(1, d - 1);
        const pa = Q.of(a, b);
        const pc = Q.of(c, d);
        const ans = pa.mul(pc);
        const work = steps(`${pa.toLatex()} \\cdot ${pc.toLatex()} = ${ans.toLatex()}`);
        const rain = rng.bool();
        return numberProblem({
          prompt: rain
            ? t(
                `The probability that it rains on Saturday is $${pa.toLatex()}$. If it rains on Saturday, the probability that it also rains on Sunday is $${pc.toLatex()}$. What is the probability that it rains on both days?${simplest.en}`,
                `周六下雨的概率是 $${pa.toLatex()}$。如果周六下雨，周日也下雨的概率是 $${pc.toLatex()}$。求两天都下雨的概率。${simplest["zh-CN"]}`,
              )
            : t(
                `For two events $A$ and $B$, $P(A) = ${pa.toLatex()}$ and $P(B \\mid A) = ${pc.toLatex()}$. Find $P(A \\cap B)$.${simplest.en}`,
                `对两个事件 $A$ 和 $B$，$P(A) = ${pa.toLatex()}$，$P(B \\mid A) = ${pc.toLatex()}$。求 $P(A \\cap B)$。${simplest["zh-CN"]}`,
              ),
          answer: ans,
          wrong: [pc, pa.add(pc), pc.div(pa), pa.div(pc)],
          solution: t(
            `By the multiplication law, $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$:${work}`,
            `由乘法公式 $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$：${work}`,
          ),
        });
      },
    },
    {
      id: "finding-a-conditional-probability",
      title: t("Finding a conditional probability", "求条件概率"),
      explanation: t(
        "When $P(A)$ and $P(A \\cap B)$ are known, divide to find the conditional probability:\n\n$$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}.$$\n\nIf $60\\%$ of a class passed the first test and $45\\%$ passed both tests, then for a student who passed the first test, the probability of passing the second is\n\n$$\\frac{0.45}{0.6} = \\frac{45}{60} = \\frac{3}{4}.$$",
        "已知 $P(A)$ 和 $P(A \\cap B)$ 时，用除法求条件概率：\n\n$$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}.$$\n\n若某班 $60\\%$ 的学生通过了第一次测验，$45\\%$ 两次都通过，则对一名通过第一次测验的学生，他通过第二次的概率是\n\n$$\\frac{0.45}{0.6} = \\frac{45}{60} = \\frac{3}{4}.$$",
      ),
      generate(rng) {
        const x = 5 * rng.int(4, 19);
        const y = 5 * rng.int(1, x / 5 - 1);
        const ans = Q.of(y, x);
        const work = steps(`P(B \\mid A) = \\frac{${h(y)}}{${h(x)}} = ${ratioL(y, x)}`);
        const test = rng.bool();
        return numberProblem({
          prompt: test
            ? t(
                `In a class, the probability that a student passed the first test is $${h(x)}$, and the probability that a student passed both tests is $${h(y)}$. A student who passed the first test is chosen at random. What is the probability that this student passed the second test?${simplest.en}`,
                `某班学生通过第一次测验的概率是 $${h(x)}$，两次测验都通过的概率是 $${h(y)}$。从通过第一次测验的学生中随机选一人，求他通过第二次测验的概率。${simplest["zh-CN"]}`,
              )
            : t(
                `For two events $A$ and $B$, $P(A) = ${h(x)}$ and $P(A \\cap B) = ${h(y)}$. Find $P(B \\mid A)$.${simplest.en}`,
                `对两个事件 $A$ 和 $B$，$P(A) = ${h(x)}$，$P(A \\cap B) = ${h(y)}$。求 $P(B \\mid A)$。${simplest["zh-CN"]}`,
              ),
          answer: ans,
          wrong: [Q.of(x * y, 10000), Q.of(y, 100), Q.of(x - y, 100)],
          solution: t(
            `Divide the probability of both by the probability of the condition:${work}`,
            `用两者都发生的概率除以条件的概率：${work}`,
          ),
        });
      },
    },
    {
      id: "drawing-without-replacement",
      title: t("Drawing without replacement", "不放回地抽取"),
      explanation: t(
        "When objects are drawn **without replacement**, the second draw depends on the first. A bag holds $5$ red and $3$ blue marbles, and two are taken out one after the other. The first is red with probability $\\frac{5}{8}$. Given that it was red, $4$ red marbles are left among $7$, so the second is red with probability $\\frac{4}{7}$:\n\n$$P(\\text{both red}) = \\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}.$$",
        "**不放回**地抽取时，第二次抽取依赖于第一次。袋子里有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠，依次取出两颗。第一颗是红色的概率是 $\\frac{5}{8}$。在第一颗是红色的条件下，还剩 $7$ 颗，其中 $4$ 颗红色，所以第二颗是红色的概率是 $\\frac{4}{7}$：\n\n$$P(\\text{两颗都是红色}) = \\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}.$$",
      ),
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const first = rng.bool() ? 0 : 1;
        const second = rng.bool(0.6) ? first : 1 - first;
        const k = [x, y];
        const a = k[first]!;
        const b = second === first ? a - 1 : k[second]!;
        const ans = Q.of(a * b, n * (n - 1));
        const col = [bag.x, bag.y];
        const what =
          first === second
            ? t(`both are ${col[first]!.en}`, `两次都取到${col[first]!["zh-CN"]}`)
            : t(
                `the first is ${col[first]!.en} and the second is ${col[second]!.en}`,
                `第一次取到${col[first]!["zh-CN"]}、第二次取到${col[second]!["zh-CN"]}`,
              );
        const work = steps(`${fr(a, n)} \\cdot ${fr(b, n - 1)} = ${ratioL(a * b, n * (n - 1))}`);
        return numberProblem({
          prompt: t(
            `${bag.setup(x, y).en} ${bag.two.en} What is the probability that ${what.en}?${simplest.en}`,
            `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}求${what["zh-CN"]}的概率。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          wrong: [Q.of(a * k[second]!, n * n), Q.of(a * b, n * n), Q.of(a * b, n * (n + 1)), Q.of(b, n - 1)],
          solution: t(
            `The first draw has probability $${fr(a, n)}$. After it, $${n - 1}$ objects are left, $${b}$ of them ${col[second]!.en}:${work}`,
            `第一次的概率是 $${fr(a, n)}$。取出后还剩 $${n - 1}$ 个，其中 $${b}$ 个是${col[second]!["zh-CN"]}：${work}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// The law of total probability

/** Split is a situation with a first event A of probability p% and a second event with probabilities x% given A and y% given not A. */
interface Split {
  readonly intro: (p: number, x: number, y: number) => Text;
  readonly ask: Text;
  readonly askBack: Text;
  readonly a: Text;
  readonly notA: Text;
}

const splits: readonly Split[] = [
  {
    intro: (p, x, y) =>
      t(
        `Machine A makes ${p}% of a factory's light bulbs and machine B makes the rest. ${x}% of the bulbs from machine A and ${y}% of the bulbs from machine B are faulty.`,
        `某工厂的灯泡中 ${p}% 由机器 A 生产，其余由机器 B 生产。机器 A 生产的灯泡有 ${x}% 是次品，机器 B 生产的有 ${y}% 是次品。`,
      ),
    ask: t("A bulb is chosen at random. What is the probability that it is faulty?", "随机抽取一个灯泡，求它是次品的概率。"),
    askBack: t(
      "A bulb chosen at random is faulty. What is the probability that it was made by machine A?",
      "随机抽取的一个灯泡是次品，求它由机器 A 生产的概率。",
    ),
    a: t("made by A", "由 A 生产"),
    notA: t("made by B", "由 B 生产"),
  },
  {
    intro: (p, x, y) =>
      t(
        `${p}% of the people in a town have a certain illness. A test is positive for ${x}% of the people who have the illness and for ${y}% of the people who do not.`,
        `某镇 ${p}% 的人患有某种疾病。患病的人检测结果为阳性的比例是 ${x}%，未患病的人是 ${y}%。`,
      ),
    ask: t(
      "A person from the town is chosen at random and tested. What is the probability that the test is positive?",
      "从该镇随机选一人检测，求结果为阳性的概率。",
    ),
    askBack: t(
      "A person chosen at random from the town tests positive. What is the probability that the person has the illness?",
      "从该镇随机选出的一人检测结果为阳性，求此人患病的概率。",
    ),
    a: t("ill", "患病"),
    notA: t("not ill", "未患病"),
  },
  {
    intro: (p, x, y) =>
      t(
        `There is a ${p}% chance of rain tomorrow. If it rains, the chance that Ana is late for school is ${x}%; if it does not rain, the chance is ${y}%.`,
        `明天下雨的概率是 ${p}%。如果下雨，安娜上学迟到的概率是 ${x}%；如果不下雨，迟到的概率是 ${y}%。`,
      ),
    ask: t("What is the probability that Ana is late tomorrow?", "求安娜明天迟到的概率。"),
    askBack: t("Ana is late tomorrow. What is the probability that it rained?", "已知安娜明天迟到了，求明天下雨的概率。"),
    a: t("rain", "下雨"),
    notA: t("no rain", "不下雨"),
  },
];

/** splitValues draws p, x and y in percent, multiples of 5, with x > y. */
function splitValues(rng: Rng): [number, number, number] {
  const p = 5 * rng.int(2, 14);
  const x = 5 * rng.int(8, 19);
  const y = 5 * rng.int(1, 6);
  return [p, x, y];
}

/** The law of total probability (Geometry 6.18.4). */
export const theLawOfTotalProbability: TopicDef = {
  id: "the-law-of-total-probability",
  title: t("The Law of Total Probability", "全概率公式"),
  summary: t(
    "Find the probability of an event by splitting it according to whether another event happens: P(B) = P(A)P(B | A) + P(A')P(B | A').",
    "按另一个事件是否发生把事件分成两部分求概率：P(B) = P(A)P(B | A) + P(A')P(B | A')。",
  ),
  prerequisites: ["the-multiplication-law-for-conditional-probability", "adding-and-subtracting-fractions", "percents"],
  encompasses: [
    { topic: "the-multiplication-law-for-conditional-probability", weight: 0.6 },
    { topic: "decimal-arithmetic", weight: 0.3 },
    { topic: "percents", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.8"],
  knowledgePoints: [
    {
      id: "total-probability",
      title: t("Splitting an event in two", "把事件分成两部分"),
      explanation: t(
        "Every outcome is either in $A$ or in $A'$, so $B$ splits into the two parts $A \\cap B$ and $A' \\cap B$, which do not overlap. Adding their probabilities, each found with the multiplication law, gives the **law of total probability**:\n\n$$P(B) = P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A').$$\n\nIf $P(A) = 0.3$, $P(B \\mid A) = 0.6$ and $P(B \\mid A') = 0.2$, then $P(A') = 1 - 0.3 = 0.7$ and\n\n$$P(B) = 0.3 \\cdot 0.6 + 0.7 \\cdot 0.2 = 0.18 + 0.14 = 0.32.$$",
        "每个结果不是在 $A$ 中就是在 $A'$ 中，所以 $B$ 分成互不重叠的两部分 $A \\cap B$ 和 $A' \\cap B$。用乘法公式分别求出它们的概率再相加，就得到**全概率公式**：\n\n$$P(B) = P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A').$$\n\n若 $P(A) = 0.3$，$P(B \\mid A) = 0.6$，$P(B \\mid A') = 0.2$，则 $P(A') = 1 - 0.3 = 0.7$，\n\n$$P(B) = 0.3 \\cdot 0.6 + 0.7 \\cdot 0.2 = 0.18 + 0.14 = 0.32.$$",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        let c = rng.int(1, 9);
        if (c === b) c = c === 9 ? 1 : c + 1;
        const ans = Q.of(a * b + (10 - a) * c, 100);
        const work = steps(
          `P(B) = ${h(10 * a)} \\cdot ${h(10 * b)} + ${h(100 - 10 * a)} \\cdot ${h(10 * c)}`,
          `= ${h(a * b)} + ${h((10 - a) * c)} = ${dec(ans)}`,
        );
        return numberProblem({
          prompt: t(
            `For two events $A$ and $B$, $P(A) = ${h(10 * a)}$, $P(B \\mid A) = ${h(10 * b)}$ and $P(B \\mid A') = ${h(10 * c)}$. Find $P(B)$.${asDecimal.en}`,
            `对两个事件 $A$ 和 $B$，$P(A) = ${h(10 * a)}$，$P(B \\mid A) = ${h(10 * b)}$，$P(B \\mid A') = ${h(10 * c)}$。求 $P(B)$。${asDecimal["zh-CN"]}`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [Q.of(a * b, 100), Q.of(a * b + a * c, 100), Q.of(b + c, 10), Q.of(a * b + (10 - a) * (10 - c), 100)],
          solution: t(
            `$P(A') = 1 - ${h(10 * a)} = ${h(100 - 10 * a)}$. By the law of total probability:${work}`,
            `$P(A') = 1 - ${h(10 * a)} = ${h(100 - 10 * a)}$。由全概率公式：${work}`,
          ),
        });
      },
    },
    {
      id: "total-probability-in-context",
      title: t("Total probability in context", "实际问题中的全概率"),
      explanation: t(
        "In a word problem, find the two cases first. Machine A makes $60\\%$ of a factory's bulbs and machine B the other $40\\%$; $2\\%$ of A's bulbs and $5\\%$ of B's are faulty. A random bulb comes from A or from B, so\n\n$$P(\\text{faulty}) = 0.6 \\cdot 0.02 + 0.4 \\cdot 0.05 = 0.012 + 0.02 = 0.032.$$\n\nWrite each percent as a decimal before multiplying, and do not forget the case \"not A\", whose probability is $1 - P(A)$.",
        "在应用题中，先找出两种情况。机器 A 生产某工厂 $60\\%$ 的灯泡，机器 B 生产另外 $40\\%$；A 生产的有 $2\\%$ 是次品，B 生产的有 $5\\%$ 是次品。随机一个灯泡不是 A 生产就是 B 生产，所以\n\n$$P(\\text{次品}) = 0.6 \\cdot 0.02 + 0.4 \\cdot 0.05 = 0.012 + 0.02 = 0.032.$$\n\n相乘之前先把百分数写成小数，不要漏掉“非 A”的情况，它的概率是 $1 - P(A)$。",
      ),
      generate(rng) {
        const s = rng.pick(splits);
        const [p, x, y] = splitValues(rng);
        const ans = Q.of(p * x + (100 - p) * y, 10000);
        const work = steps(
          `${h(p)} \\cdot ${h(x)} + ${h(100 - p)} \\cdot ${h(y)} = ${dec(Q.of(p * x, 10000))} + ${dec(Q.of((100 - p) * y, 10000))} = ${dec(ans)}`,
        );
        return numberProblem({
          prompt: t(
            `${s.intro(p, x, y).en} ${s.ask.en}${asDecimal.en}`,
            `${s.intro(p, x, y)["zh-CN"]}${s.ask["zh-CN"]}${asDecimal["zh-CN"]}`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [Q.of(p * x, 10000), Q.of(x + y, 200), Q.of(x + y, 100), Q.of(p * y + (100 - p) * x, 10000)],
          solution: t(
            `The two cases are ${s.a.en} (probability $${h(p)}$) and ${s.notA.en} (probability $${h(100 - p)}$):${work}`,
            `两种情况是${s.a["zh-CN"]}（概率 $${h(p)}$）和${s.notA["zh-CN"]}（概率 $${h(100 - p)}$）：${work}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Tree diagrams for dependent events

/** bagTree is the tree diagram of two draws without replacement from x and y objects. */
function bagTree(bag: Bag, x: number, y: number): Figure {
  const n = x + y;
  const [X, Y] = bag.letters;
  return treeFigure(
    [
      { label: X, p: `${x}/${n}` },
      { label: Y, p: `${y}/${n}` },
    ],
    [
      [
        { label: X, p: `${x - 1}/${n - 1}` },
        { label: Y, p: `${y}/${n - 1}` },
      ],
      [
        { label: X, p: `${x}/${n - 1}` },
        { label: Y, p: `${y - 1}/${n - 1}` },
      ],
    ],
  );
}

/** Tree diagrams for dependent events (Geometry 6.18.5). */
export const treeDiagramsForDependentEvents: TopicDef = {
  id: "tree-diagrams-for-dependent-events",
  title: t("Tree Diagrams for Dependent Events", "相关事件的树状图"),
  summary: t(
    "Read and complete tree diagrams whose second-stage probabilities depend on the first stage, multiplying along paths and adding paths.",
    "读懂并补全第二阶段概率依赖于第一阶段的树状图：沿路径相乘，不同路径相加。",
  ),
  prerequisites: ["the-law-of-total-probability"],
  encompasses: [
    { topic: "the-law-of-total-probability", weight: 0.6 },
    { topic: "the-multiplication-law-for-conditional-probability", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.8"],
  knowledgePoints: [
    {
      id: "completing-a-tree",
      title: t("Completing a tree diagram", "补全树状图"),
      explanation: t(
        "A **tree diagram** shows a process in stages. Each branch carries a probability; the branches after the second stage carry conditional probabilities, such as $P(B \\mid A)$ on the branch to $B$ after $A$.\n\nThe branches leaving one point cover every possibility and do not overlap, so their probabilities **add up to $1$**. If the branches after $A$ are $B$ with $0.35$ and $B'$ with an unknown probability, that probability is $1 - 0.35 = 0.65$.",
        "**树状图**把一个过程分阶段画出来。每条分支上标有概率；第二阶段的分支上是条件概率，例如 $A$ 之后通向 $B$ 的分支上是 $P(B \\mid A)$。\n\n从同一点出发的各分支包含了所有可能且互不重叠，所以它们的概率**之和为 $1$**。若 $A$ 之后的分支是概率为 $0.35$ 的 $B$ 和概率未知的 $B'$，这个概率就是 $1 - 0.35 = 0.65$。",
      ),
      generate(rng) {
        const pa = 5 * rng.int(2, 18);
        const pb = 5 * rng.int(1, 19);
        let pc = 5 * rng.int(1, 19);
        if (pc === pb) pc = pc === 95 ? 5 : pc + 5;
        const values = [pa, 100 - pa, pb, 100 - pb, pc, 100 - pc];
        const miss = rng.int(0, 5);
        const lab = (i: number) => (i === miss ? "?" : h(values[i]!));
        const fig = treeFigure(
          [
            { label: "A", p: lab(0) },
            { label: "A′", p: lab(1) },
          ],
          [
            [
              { label: "B", p: lab(2) },
              { label: "B′", p: lab(3) },
            ],
            [
              { label: "B", p: lab(4) },
              { label: "B′", p: lab(5) },
            ],
          ],
        );
        const sib = miss ^ 1;
        const ans = Q.of(values[miss]!, 100);
        return {
          ...numberProblem({
            prompt: t(
              "The tree diagram shows the probabilities of events $A$ and $B$. What is the missing probability?",
              "树状图给出了事件 $A$ 和 $B$ 的概率。缺少的概率是多少？",
            ),
            answer: ans,
            form: "decimal",
            wrong: [values[sib]!, values[(miss + 2) % 6]!, 100 - values[(miss + 2) % 6]!]
              .filter((v) => v !== values[miss])
              .map((v) => Q.of(v, 100)),
            solution: t(
              `The branches leaving the same point add up to $1$:${steps(`1 - ${h(values[sib]!)} = ${h(values[miss]!)}`)}`,
              `从同一点出发的分支概率之和为 $1$：${steps(`1 - ${h(values[sib]!)} = ${h(values[miss]!)}`)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "probability-of-a-path",
      title: t("The probability of a path", "一条路径的概率"),
      explanation: t(
        'Each path from the start to an end is one outcome of the whole process. By the multiplication law, its probability is the **product of the probabilities along the path**.\n\nA bag holds $5$ red and $3$ blue marbles, and two are drawn without replacement. In its tree, the path "red, then blue" carries $\\frac{5}{8}$ and then $\\frac{3}{7}$ (after a red one, $3$ of the $7$ marbles left are blue):\n\n$$P(R \\text{ then } B) = \\frac{5}{8} \\cdot \\frac{3}{7} = \\frac{15}{56}.$$',
        "从起点到终点的每一条路径是整个过程的一种结果。由乘法公式，它的概率是**路径上各概率的乘积**。\n\n袋子里有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠，不放回地取两颗。在树状图中，“先红后蓝”这条路径上依次是 $\\frac{5}{8}$ 和 $\\frac{3}{7}$（取出一颗红的后，剩下 $7$ 颗中有 $3$ 颗蓝的）：\n\n$$P(\\text{先 } R \\text{ 后 } B) = \\frac{5}{8} \\cdot \\frac{3}{7} = \\frac{15}{56}.$$",
      ),
      figure: bagTree(bags[0]!, 5, 3),
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const first = rng.int(0, 1);
        const second = rng.int(0, 1);
        const k = [x, y];
        const a = k[first]!;
        const b = second === first ? a - 1 : k[second]!;
        const col = [bag.x, bag.y];
        const work = steps(`${fr(a, n)} \\cdot ${fr(b, n - 1)} = ${ratioL(a * b, n * (n - 1))}`);
        return {
          ...numberProblem({
            prompt: t(
              `${bag.setup(x, y).en} ${bag.two.en} The tree diagram shows the draws. What is the probability that the first is ${col[first]!.en} and the second is ${col[second]!.en}?${simplest.en}`,
              `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}树状图表示了这两次抽取。求第一次取到${col[first]!["zh-CN"]}、第二次取到${col[second]!["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(a * b, n * (n - 1)),
            wrong: [Q.of(a * b, n * n), Q.of(a + b, 2 * n - 1), Q.of(b, n - 1), Q.of(a * k[second]!, n * n)],
            solution: t(`Multiply along the path:${work}`, `沿路径相乘：${work}`),
          }),
          figure: bagTree(bag, x, y),
        };
      },
    },
    {
      id: "adding-paths",
      title: t("Adding paths", "路径相加"),
      explanation: t(
        'When several paths lead to the event, find the probability of each path and **add** them: different paths are different outcomes, so they do not overlap.\n\nWith $5$ red and $3$ blue marbles, the second marble is red along "red, red" and along "blue, red":\n\n$$P(\\text{second red}) = \\frac{5}{8} \\cdot \\frac{4}{7} + \\frac{3}{8} \\cdot \\frac{5}{7} = \\frac{20}{56} + \\frac{15}{56} = \\frac{35}{56} = \\frac{5}{8}.$$',
        "当有几条路径都通向所求事件时，分别求出每条路径的概率再**相加**：不同的路径是不同的结果，互不重叠。\n\n有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠时，第二颗是红色的路径有“红、红”和“蓝、红”：\n\n$$P(\\text{第二颗是红色}) = \\frac{5}{8} \\cdot \\frac{4}{7} + \\frac{3}{8} \\cdot \\frac{5}{7} = \\frac{20}{56} + \\frac{15}{56} = \\frac{35}{56} = \\frac{5}{8}.$$",
      ),
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const d = n * (n - 1);
        const kind = rng.int(0, 2);
        const col = [bag.x, bag.y];
        const c = rng.int(0, 1);
        const k = [x, y];
        const what = [
          t(`the second is ${col[c]!.en}`, `第二次取到${col[c]!["zh-CN"]}`),
          t("the two have different colors", "两次取到的颜色不同"),
          t("the two have the same color", "两次取到的颜色相同"),
        ][kind]!;
        const terms: [number, number, number, number][] =
          kind === 0
            ? [
                [k[c]!, n, k[c]! - 1, n - 1],
                [k[1 - c]!, n, k[c]!, n - 1],
              ]
            : kind === 1
              ? [
                  [x, n, y, n - 1],
                  [y, n, x, n - 1],
                ]
              : [
                  [x, n, x - 1, n - 1],
                  [y, n, y - 1, n - 1],
                ];
        const nums = terms.map(([a, , b]) => a * b);
        const total = nums[0]! + nums[1]!;
        const work = steps(
          terms.map(([a, p, b, q]) => `${fr(a, p)} \\cdot ${fr(b, q)}`).join(" + "),
          `= ${nums.map((m) => fr(m, d)).join(" + ")} = ${ratioL(total, d)}`,
        );
        return {
          ...numberProblem({
            prompt: t(
              `${bag.setup(x, y).en} ${bag.two.en} The tree diagram shows the draws. What is the probability that ${what.en}?${simplest.en}`,
              `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}树状图表示了这两次抽取。求${what["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(total, d),
            wrong: [Q.of(nums[0]!, d), Q.of(nums[1]!, d), Q.of(nums[0]! * nums[1]!, d * d)],
            solution: t(
              `Two paths lead to the event. Multiply along each and add:${work}`,
              `有两条路径通向这个事件。分别沿路径相乘再相加：${work}`,
            ),
          }),
          figure: bagTree(bag, x, y),
        };
      },
    },
  ],
};

/** Tree diagrams for dependent events: applications (Geometry 6.18.6). */
export const treeDiagramsForDependentEventsApplications: TopicDef = {
  id: "tree-diagrams-for-dependent-events-applications",
  title: t("Tree Diagrams for Dependent Events: Applications", "相关事件的树状图：应用"),
  summary: t(
    "Draw your own tree diagrams to solve problems with dependent events, including at-least-one problems and reversed conditional probabilities.",
    "自己画树状图解决相关事件的问题，包括“至少一个”问题和反过来的条件概率。",
  ),
  prerequisites: ["tree-diagrams-for-dependent-events"],
  encompasses: [
    { topic: "tree-diagrams-for-dependent-events", weight: 0.7 },
    { topic: "conditional-probabilities-from-venn-diagrams", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSS.CP.B.8", "CCSS.HSS.CP.A.3"],
  knowledgePoints: [
    {
      id: "at-least-one",
      title: t("At least one", "至少一个"),
      explanation: t(
        'For "at least one", it is usually quickest to use the complement: the only path that has none is the path with the other outcome both times.\n\nA bag holds $5$ red and $3$ blue marbles, and two are drawn without replacement. No red means blue, then blue: $\\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28}$. So\n\n$$P(\\text{at least one red}) = 1 - \\frac{3}{28} = \\frac{25}{28}.$$',
        "求“至少一个”时，通常用对立事件最快：一个也没有的路径只有一条，就是两次都是另一种结果。\n\n袋子里有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠，不放回地取两颗。没有红色就是“蓝、蓝”：$\\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28}$。所以\n\n$$P(\\text{至少一颗红色}) = 1 - \\frac{3}{28} = \\frac{25}{28}.$$",
      ),
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const d = n * (n - 1);
        const c = rng.int(0, 1);
        const col = [bag.x, bag.y];
        const o = c === 0 ? y : x;
        const none = o * (o - 1);
        const work = steps(
          `P(\\text{none}) = ${fr(o, n)} \\cdot ${fr(o - 1, n - 1)} = ${ratioL(none, d)}`,
          `1 - ${Q.of(none, d).toLatex()} = ${Q.of(d - none, d).toLatex()}`,
        );
        const workZh = steps(
          `P(\\text{一个也没有}) = ${fr(o, n)} \\cdot ${fr(o - 1, n - 1)} = ${ratioL(none, d)}`,
          `1 - ${Q.of(none, d).toLatex()} = ${Q.of(d - none, d).toLatex()}`,
        );
        return numberProblem({
          prompt: t(
            `${bag.setup(x, y).en} ${bag.two.en} What is the probability that at least one of them is ${col[c]!.en}?${simplest.en}`,
            `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}求至少一次取到${col[c]!["zh-CN"]}的概率。${simplest["zh-CN"]}`,
          ),
          answer: Q.of(d - none, d),
          wrong: [Q.of(none, d), Q.of(n * n - o * o, n * n), Q.of((c === 0 ? x : y) * (c === 0 ? x - 1 : y - 1), d), Q.of(2 * x * y, d)],
          solution: t(
            `None ${col[c]!.en} means the other color both times:${work}`,
            `一次也没取到${col[c]!["zh-CN"]}，就是两次都取到另一种颜色：${workZh}`,
          ),
        });
      },
    },
    {
      id: "reversing-a-condition",
      title: t("Reversing a condition", "反过来的条件"),
      explanation: t(
        "A tree gives $P(B \\mid A)$, but a question may ask for $P(A \\mid B)$. Use the definition of conditional probability, with the law of total probability for the denominator:\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(A) \\cdot P(B \\mid A)}{P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A')}.$$\n\nIf $10\\%$ of people have an illness, and a test is positive for $90\\%$ of the ill and $20\\%$ of the others, then\n\n$$P(\\text{ill} \\mid +) = \\frac{0.1 \\cdot 0.9}{0.1 \\cdot 0.9 + 0.9 \\cdot 0.2} = \\frac{0.09}{0.27} = \\frac{1}{3}.$$\n\nMost positive results come from the many healthy people.",
        "树状图给出的是 $P(B \\mid A)$，但问题可能问 $P(A \\mid B)$。这时用条件概率的定义，分母用全概率公式：\n\n$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(A) \\cdot P(B \\mid A)}{P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A')}.$$\n\n若 $10\\%$ 的人患有某种疾病，检测对患病者有 $90\\%$ 呈阳性，对其他人有 $20\\%$ 呈阳性，则\n\n$$P(\\text{患病} \\mid +) = \\frac{0.1 \\cdot 0.9}{0.1 \\cdot 0.9 + 0.9 \\cdot 0.2} = \\frac{0.09}{0.27} = \\frac{1}{3}.$$\n\n大多数阳性结果来自人数众多的健康人。",
      ),
      generate(rng) {
        const s = rng.pick(splits);
        const [p, x, y] = splitValues(rng);
        const top = p * x;
        const bottom = p * x + (100 - p) * y;
        const work = steps(
          `\\frac{${h(p)} \\cdot ${h(x)}}{${h(p)} \\cdot ${h(x)} + ${h(100 - p)} \\cdot ${h(y)}} = \\frac{${dec(Q.of(top, 10000))}}{${dec(Q.of(bottom, 10000))}} = ${Q.of(top, bottom).toLatex()}`,
        );
        return numberProblem({
          prompt: t(
            `${s.intro(p, x, y).en} ${s.askBack.en}${simplest.en}`,
            `${s.intro(p, x, y)["zh-CN"]}${s.askBack["zh-CN"]}${simplest["zh-CN"]}`,
          ),
          answer: Q.of(top, bottom),
          wrong: [Q.of(x, 100), Q.of(top, 10000), Q.of(p, 100), Q.of(bottom, 10000)],
          solution: t(
            `Divide the probability of the path through ${s.a.en} by the total probability of the result:${work}`,
            `用经过“${s.a["zh-CN"]}”的路径的概率除以这个结果的总概率：${work}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Independent events

/** Independent events (Geometry 6.18.7). */
export const independentEvents: TopicDef = {
  id: "independent-events",
  title: t("Independent Events", "独立事件"),
  summary: t(
    "Multiply the probabilities of independent events, and test whether two events are independent.",
    "独立事件的概率相乘，并判断两个事件是否独立。",
  ),
  prerequisites: ["the-multiplication-law-for-conditional-probability", "conditional-probabilities-from-tables"],
  encompasses: [
    { topic: "the-multiplication-law-for-conditional-probability", weight: 0.5 },
    { topic: "conditional-probabilities-from-tables", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.2", "CCSS.HSS.CP.A.5"],
  knowledgePoints: [
    {
      id: "multiplying-independent-probabilities",
      title: t("Multiplying probabilities", "概率相乘"),
      explanation: t(
        "Two events are **independent** when knowing that one happens does not change the probability of the other: $P(B \\mid A) = P(B)$. The multiplication law then becomes\n\n$$P(A \\cap B) = P(A) \\cdot P(B).$$\n\nA fair coin and a fair die do not affect each other, so the probability of heads and a number greater than $4$ is $\\frac{1}{2} \\cdot \\frac{2}{6} = \\frac{1}{6}$. If $A$ and $B$ are independent, so are $A$ and $B'$: $P(A \\cap B') = P(A) \\cdot (1 - P(B))$.",
        "如果知道一个事件发生并不改变另一个事件的概率，即 $P(B \\mid A) = P(B)$，就说这两个事件**相互独立**。这时乘法公式变为\n\n$$P(A \\cap B) = P(A) \\cdot P(B).$$\n\n一枚均匀硬币和一颗均匀骰子互不影响，所以掷出正面且点数大于 $4$ 的概率是 $\\frac{1}{2} \\cdot \\frac{2}{6} = \\frac{1}{6}$。若 $A$ 与 $B$ 独立，则 $A$ 与 $B'$ 也独立：$P(A \\cap B') = P(A) \\cdot (1 - P(B))$。",
      ),
      generate(rng) {
        if (rng.bool(0.35)) {
          const k = rng.int(1, 5);
          const heads = rng.bool();
          const ans = Q.of(6 - k, 12);
          return numberProblem({
            prompt: t(
              `A fair coin is tossed and a fair six-sided die is rolled. What is the probability of ${heads ? "heads" : "tails"} and a number greater than $${k}$?${simplest.en}`,
              `掷一枚均匀硬币和一颗均匀的六面骰子。求硬币${heads ? "正面" : "反面"}朝上且骰子点数大于 $${k}$ 的概率。${simplest["zh-CN"]}`,
            ),
            answer: ans,
            wrong: [Q.of(6 - k, 6), Q.of(1, 2).add(Q.of(6 - k, 6)), Q.of(5 - k, 12)],
            solution: t(
              `The coin and the die are independent. $${6 - k}$ of the $6$ numbers are greater than $${k}$:${steps(`\\frac{1}{2} \\cdot ${fr(6 - k, 6)} = ${ratioL(6 - k, 12)}`)}`,
              `硬币和骰子相互独立。$6$ 个点数中有 $${6 - k}$ 个大于 $${k}$：${steps(`\\frac{1}{2} \\cdot ${fr(6 - k, 6)} = ${ratioL(6 - k, 12)}`)}`,
            ),
          });
        }
        const b = rng.int(3, 9);
        const a = rng.int(1, b - 1);
        const d = rng.int(3, 9);
        const c = rng.int(1, d - 1);
        const pa = Q.of(a, b);
        const pb = Q.of(c, d);
        const kind = rng.int(0, 2);
        const fa = kind === 2 ? Q.one.sub(pa) : pa;
        const fb = kind === 0 ? pb : Q.one.sub(pb);
        const ev = ["A \\cap B", "A \\cap B'", "A' \\cap B'"][kind]!;
        const ans = fa.mul(fb);
        return numberProblem({
          prompt: t(
            `Events $A$ and $B$ are independent, with $P(A) = ${pa.toLatex()}$ and $P(B) = ${pb.toLatex()}$. Find $P(${ev})$.${simplest.en}`,
            `事件 $A$ 与 $B$ 相互独立，$P(A) = ${pa.toLatex()}$，$P(B) = ${pb.toLatex()}$。求 $P(${ev})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          wrong: [pa.mul(pb), fa.add(fb), Q.one.sub(pa.mul(pb)), pa.mul(Q.one.sub(pb))],
          solution: t(
            `Independent events multiply${kind === 0 ? "" : "; first take complements"}:${steps(`P(${ev}) = ${fa.toLatex()} \\cdot ${fb.toLatex()} = ${ans.toLatex()}`)}`,
            `独立事件的概率相乘${kind === 0 ? "" : "，先求对立事件的概率"}：${steps(`P(${ev}) = ${fa.toLatex()} \\cdot ${fb.toLatex()} = ${ans.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "testing-independence",
      title: t("Testing for independence", "判断是否独立"),
      explanation: t(
        "To test whether $A$ and $B$ are independent, compare $P(A \\cap B)$ with $P(A) \\cdot P(B)$: they are independent exactly when the two are equal.\n\nWith $P(A) = 0.4$, $P(B) = 0.5$ and $P(A \\cap B) = 0.2$: $0.4 \\cdot 0.5 = 0.2$, so $A$ and $B$ are independent. With $P(A \\cap B) = 0.25$ instead, they are not: knowing $A$ makes $B$ more likely.",
        "判断 $A$ 与 $B$ 是否独立，比较 $P(A \\cap B)$ 与 $P(A) \\cdot P(B)$：两者相等时，且仅在此时，它们相互独立。\n\n若 $P(A) = 0.4$，$P(B) = 0.5$，$P(A \\cap B) = 0.2$：$0.4 \\cdot 0.5 = 0.2$，所以 $A$ 与 $B$ 独立。若 $P(A \\cap B) = 0.25$，它们就不独立：知道 $A$ 发生会使 $B$ 更可能发生。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const indep = rng.bool();
        let j = a * b;
        if (!indep) {
          const lo = Math.max(1, 10 * (a + b) - 100);
          const hi = 10 * Math.min(a, b);
          const cands = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((v) => v !== a * b && Math.abs(v - a * b) <= 12);
          j = cands.length > 0 ? rng.pick(cands) : a * b;
        }
        const yes = j === a * b;
        const rel = yes ? "=" : "\\ne";
        return choiceProblem({
          prompt: t(
            `$P(A) = ${h(10 * a)}$, $P(B) = ${h(10 * b)}$ and $P(A \\cap B) = ${h(j)}$. Are $A$ and $B$ independent?`,
            `$P(A) = ${h(10 * a)}$，$P(B) = ${h(10 * b)}$，$P(A \\cap B) = ${h(j)}$。$A$ 与 $B$ 相互独立吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Compare: $P(A) \\cdot P(B) = ${h(10 * a)} \\cdot ${h(10 * b)} = ${h(a * b)} ${rel} ${h(j)} = P(A \\cap B)$, so they are ${yes ? "" : "not "}independent.`,
            `比较：$P(A) \\cdot P(B) = ${h(10 * a)} \\cdot ${h(10 * b)} = ${h(a * b)} ${rel} ${h(j)} = P(A \\cap B)$，所以它们${yes ? "" : "不"}独立。`,
          ),
        });
      },
    },
    {
      id: "independence-in-a-table",
      title: t("Independence in a two-way table", "双向表中的独立性"),
      explanation: t(
        "In a two-way table, a row category and a column category are independent when the conditional probability equals the overall probability: the column's share is the same within the row as in the whole table.\n\n| | Walks | Bus | Total |\n| :--- | ---: | ---: | ---: |\n| Grade 9 | 12 | 18 | 30 |\n| Grade 10 | 8 | 12 | 20 |\n| Total | 20 | 30 | 50 |\n\n$P(\\text{walks} \\mid \\text{Grade 9}) = \\frac{12}{30} = \\frac{2}{5}$ and $P(\\text{walks}) = \\frac{20}{50} = \\frac{2}{5}$, so being in Grade 9 and walking are independent.",
        "在双向表中，当条件概率等于总体概率，即某一列在这一行中所占的比例与在全表中所占的比例相同时，这一行的类别与这一列的类别相互独立。\n\n| | 步行 | 坐公交 | 合计 |\n| :--- | ---: | ---: | ---: |\n| 九年级 | 12 | 18 | 30 |\n| 十年级 | 8 | 12 | 20 |\n| 合计 | 20 | 30 | 50 |\n\n$P(\\text{步行} \\mid \\text{九年级}) = \\frac{12}{30} = \\frac{2}{5}$，$P(\\text{步行}) = \\frac{20}{50} = \\frac{2}{5}$，所以“是九年级的”与“步行上学”相互独立。",
      ),
      generate(rng) {
        const c = rng.pick(tables);
        const m = rng.int(2, 5);
        const k = rng.int(1, m - 1);
        const u1 = rng.int(2, 9);
        const u2 = rng.int(2, 9);
        const cells = [
          [u1 * k, u1 * (m - k)],
          [u2 * k, u2 * (m - k)],
        ];
        if (rng.bool()) {
          const s = rng.int(1, 3) * (rng.bool() ? 1 : -1);
          const r = rng.int(0, 1);
          const col = cells[r]![0]! + s > 0 && cells[r]![1]! - s > 0 ? s : -s;
          cells[r]![0]! += col;
          cells[r]![1]! -= col;
        }
        const i = rng.int(0, 1);
        const j = rng.int(0, 1);
        const cell = cells[i]![j]!;
        const rowT = cells[i]![0]! + cells[i]![1]!;
        const colT = cells[0]![j]! + cells[1]![j]!;
        const total = rowT + cells[1 - i]![0]! + cells[1 - i]![1]!;
        const yes = cell * total === rowT * colT;
        const rel = yes ? "=" : "\\ne";
        const row = c.rows[i as 0 | 1];
        const col = c.cols[j as 0 | 1];
        const tb = tableMd(c, cells, true);
        return choiceProblem({
          prompt: t(
            `${c.intro.en}${tb.en}For ${c.a.en.toLowerCase()} chosen at random, are the events "${c.the.en} ${row.is.en}" and "${c.the.en} ${col.is.en}" independent?`,
            `${c.intro["zh-CN"]}${tb["zh-CN"]}随机选${c.a["zh-CN"]}，事件“${c.the["zh-CN"]}${row.is["zh-CN"]}”与“${c.the["zh-CN"]}${col.is["zh-CN"]}”相互独立吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Compare the share of "${col.label.en}" in the row "${row.label.en}" with its share in the whole table: $${ratioL(cell, rowT)}$ and $${ratioL(colT, total)}$. Since $${Q.of(cell, rowT).toLatex()} ${rel} ${Q.of(colT, total).toLatex()}$, they are ${yes ? "" : "not "}independent.`,
            `比较“${col.label["zh-CN"]}”在“${row.label["zh-CN"]}”这一行中的比例与在全表中的比例：$${ratioL(cell, rowT)}$ 和 $${ratioL(colT, total)}$。因为 $${Q.of(cell, rowT).toLatex()} ${rel} ${Q.of(colT, total).toLatex()}$，所以它们${yes ? "" : "不"}独立。`,
          ),
        });
      },
    },
  ],
};

/** Tree diagrams for independent events (Geometry 6.18.8). */
export const treeDiagramsForIndependentEvents: TopicDef = {
  id: "tree-diagrams-for-independent-events",
  title: t("Tree Diagrams for Independent Events", "独立事件的树状图"),
  summary: t(
    "Use tree diagrams for independent events and repeated independent trials: both, neither, exactly one, and at least one.",
    "用树状图处理独立事件和独立重复试验：都发生、都不发生、恰好一个、至少一个。",
  ),
  prerequisites: ["independent-events", "tree-diagrams-for-dependent-events", "powers-of-rational-numbers"],
  encompasses: [
    { topic: "independent-events", weight: 0.6 },
    { topic: "tree-diagrams-for-dependent-events", weight: 0.5 },
    { topic: "powers-of-rational-numbers", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.2", "CCSS.HSS.CP.B.8"],
  knowledgePoints: [
    {
      id: "two-independent-events",
      title: t("Two independent events", "两个独立事件"),
      explanation: t(
        "For independent events, the second-stage branches are the same after every first-stage outcome, because the first stage does not change them.\n\nIf Leo's train is late with probability $0.2$ and his bus, independently, with probability $0.3$, then\n\n- both late: $0.2 \\cdot 0.3 = 0.06$;\n- neither late: $0.8 \\cdot 0.7 = 0.56$;\n- exactly one late: $0.2 \\cdot 0.7 + 0.8 \\cdot 0.3 = 0.14 + 0.24 = 0.38$;\n- at least one late: $1 - 0.56 = 0.44$.",
        "对独立事件，第一阶段的每种结果之后，第二阶段的分支都相同，因为第一阶段不会改变它们。\n\n若利奥的火车晚点的概率是 $0.2$，公交车晚点的概率是 $0.3$，两者独立，则\n\n- 都晚点：$0.2 \\cdot 0.3 = 0.06$；\n- 都不晚点：$0.8 \\cdot 0.7 = 0.56$；\n- 恰好一个晚点：$0.2 \\cdot 0.7 + 0.8 \\cdot 0.3 = 0.14 + 0.24 = 0.38$；\n- 至少一个晚点：$1 - 0.56 = 0.44$。",
      ),
      figure: treeFigure(
        [
          { label: "T", p: "0.2" },
          { label: "T′", p: "0.8" },
        ],
        [
          [
            { label: "B", p: "0.3" },
            { label: "B′", p: "0.7" },
          ],
          [
            { label: "B", p: "0.3" },
            { label: "B′", p: "0.7" },
          ],
        ],
      ),
      generate(rng) {
        const ctx = rng.pick([
          {
            l: ["T", "B"],
            intro: (a: string, b: string) =>
              t(
                `Leo's train is late ($T$) with probability $${a}$, and his bus is late ($B$) with probability $${b}$, independently of the train.`,
                `利奥的火车晚点（$T$）的概率是 $${a}$，公交车晚点（$B$）的概率是 $${b}$，两者相互独立。`,
              ),
            what: [
              t("both are late", "两者都晚点"),
              t("neither is late", "两者都不晚点"),
              t("exactly one of them is late", "恰好有一个晚点"),
              t("at least one of them is late", "至少有一个晚点"),
            ],
          },
          {
            l: ["M", "S"],
            intro: (a: string, b: string) =>
              t(
                `Mia passes her math exam ($M$) with probability $${a}$ and her science exam ($S$) with probability $${b}$, independently.`,
                `米娅通过数学考试（$M$）的概率是 $${a}$，通过科学考试（$S$）的概率是 $${b}$，两者相互独立。`,
              ),
            what: [
              t("she passes both", "两门都通过"),
              t("she passes neither", "两门都没通过"),
              t("she passes exactly one", "恰好通过一门"),
              t("she passes at least one", "至少通过一门"),
            ],
          },
        ] as const);
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const kind = rng.int(0, 3);
        const [A, B] = ctx.l;
        const both = a * b;
        const neither = (10 - a) * (10 - b);
        const one = a * (10 - b) + (10 - a) * b;
        const ans = Q.of([both, neither, one, 100 - neither][kind]!, 100);
        const work = [
          steps(`${h(10 * a)} \\cdot ${h(10 * b)} = ${h(both)}`),
          steps(`${h(100 - 10 * a)} \\cdot ${h(100 - 10 * b)} = ${h(neither)}`),
          steps(
            `${h(10 * a)} \\cdot ${h(100 - 10 * b)} + ${h(100 - 10 * a)} \\cdot ${h(10 * b)} = ${h(a * (10 - b))} + ${h((10 - a) * b)} = ${h(one)}`,
          ),
          steps(`1 - ${h(100 - 10 * a)} \\cdot ${h(100 - 10 * b)} = 1 - ${h(neither)} = ${h(100 - neither)}`),
        ][kind]!;
        const how = [
          t("Multiply along the path through both", "沿两者都发生的路径相乘"),
          t("Multiply along the path through neither", "沿两者都不发生的路径相乘"),
          t("Two paths have exactly one; add them", "恰好一个的路径有两条，相加"),
          t("Use the complement of neither", "用“都不发生”的对立事件"),
        ][kind]!;
        return {
          ...numberProblem({
            prompt: t(
              `${ctx.intro(h(10 * a), h(10 * b)).en} Use the tree diagram to find the probability that ${ctx.what[kind]!.en}.${asDecimal.en}`,
              `${ctx.intro(h(10 * a), h(10 * b))["zh-CN"]}利用树状图求${ctx.what[kind]!["zh-CN"]}的概率。${asDecimal["zh-CN"]}`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              Q.of(both, 100),
              Q.of(neither, 100),
              Q.of(one, 100),
              Q.of(100 - neither, 100),
              Q.of(a + b, 10),
              Q.of(a * (10 - b), 100),
            ],
            solution: t(`${how.en}:${work}`, `${how["zh-CN"]}：${work}`),
          }),
          figure: treeFigure(
            [
              { label: A, p: h(10 * a) },
              { label: `${A}′`, p: h(100 - 10 * a) },
            ],
            [
              [
                { label: B, p: h(10 * b) },
                { label: `${B}′`, p: h(100 - 10 * b) },
              ],
              [
                { label: B, p: h(10 * b) },
                { label: `${B}′`, p: h(100 - 10 * b) },
              ],
            ],
          ),
        };
      },
    },
    {
      id: "at-least-once-in-repeated-trials",
      title: t("At least once in repeated trials", "重复试验中至少一次"),
      explanation: t(
        'When the same experiment is repeated independently, each stage of the tree has the same branches. The path where the event never happens multiplies the probability of "not" once per trial, so\n\n$$P(\\text{at least once in } n \\text{ trials}) = 1 - (1 - p)^{n}.$$\n\nRolling a fair die $3$ times, the probability of at least one six is $1 - \\left(\\frac{5}{6}\\right)^{3} = 1 - \\frac{125}{216} = \\frac{91}{216}$. It is not $3 \\cdot \\frac{1}{6}$: that counts the outcomes with two or three sixes more than once.',
        "同一个试验独立重复时，树状图每一阶段的分支都相同。事件一次也不发生的那条路径，每次试验乘一次“不发生”的概率，所以\n\n$$P(n \\text{ 次中至少一次}) = 1 - (1 - p)^{n}.$$\n\n掷一颗均匀骰子 $3$ 次，至少一次掷出六点的概率是 $1 - \\left(\\frac{5}{6}\\right)^{3} = 1 - \\frac{125}{216} = \\frac{91}{216}$。不是 $3 \\cdot \\frac{1}{6}$：那样会把出现两次或三次六点的结果重复计算。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const kind = rng.int(0, 2);
        let p: Q;
        let what: Text;
        if (kind === 0) {
          const f = rng.int(1, 3);
          p = Q.of(f, 6);
          what = t(
            `A fair six-sided die is rolled $${n}$ times. What is the probability of rolling a number greater than $${6 - f}$ at least once?`,
            `掷一颗均匀的六面骰子 $${n}$ 次。求至少一次掷出大于 $${6 - f}$ 的点数的概率。`,
          );
        } else if (kind === 1) {
          const m = rng.pick([3, 4, 5, 8]);
          const r = rng.int(1, m - 1);
          p = Q.of(r, m);
          what = t(
            `A spinner has $${m}$ equal sections, $${r}$ of them red. It is spun $${n}$ times. What is the probability that it lands on red at least once?`,
            `一个转盘被分成 $${m}$ 个相等的扇区，其中 $${r}$ 个是红色。转动 $${n}$ 次，求至少一次停在红色上的概率。`,
          );
        } else {
          const k = rng.int(1, 9);
          p = Q.of(k, 10);
          what = t(
            `A basketball player makes each free throw with probability $${h(10 * k)}$, independently. She takes $${n}$ free throws. What is the probability that she makes at least one?`,
            `一名篮球运动员每次罚球命中的概率是 $${h(10 * k)}$，各次相互独立。她罚球 $${n}$ 次，求至少命中一次的概率。`,
          );
        }
        const q = Q.one.sub(p);
        const ans = Q.one.sub(q.pow(n));
        return numberProblem({
          prompt: t(`${what.en}${simplest.en}`, `${what["zh-CN"]}${simplest["zh-CN"]}`),
          answer: ans,
          wrong: [p.mul(Q.of(n)), Q.one.sub(p.pow(n)), q.pow(n), p.pow(n)],
          solution: t(
            `Each trial fails with probability $1 - ${p.toLatex()} = ${q.toLatex()}$. Failing all $${n}$ times has probability $\\left(${q.toLatex()}\\right)^{${n}} = ${q.pow(n).toLatex()}$, so${steps(`1 - ${q.pow(n).toLatex()} = ${ans.toLatex()}`)}`,
            `每次不成功的概率是 $1 - ${p.toLatex()} = ${q.toLatex()}$。$${n}$ 次都不成功的概率是 $\\left(${q.toLatex()}\\right)^{${n}} = ${q.pow(n).toLatex()}$，所以${steps(`1 - ${q.pow(n).toLatex()} = ${ans.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "exactly-k-in-three-trials",
      title: t("Exactly k successes in three trials", "三次试验中恰好 k 次成功"),
      explanation: t(
        "With three independent trials, the tree has $8$ paths. To find the probability of exactly two successes, count the paths with exactly two: $SSF$, $SFS$ and $FSS$. Each has the same probability $p^{2}(1 - p)$, so\n\n$$P(\\text{exactly two}) = 3p^{2}(1 - p).$$\n\nFor $p = 0.6$: $3 \\cdot 0.36 \\cdot 0.4 = 0.432$. Likewise, exactly one success has probability $3p(1 - p)^{2}$.",
        "三次独立试验的树状图有 $8$ 条路径。求恰好成功两次的概率，先数出恰好两次成功的路径：$SSF$、$SFS$、$FSS$。每条路径的概率都是 $p^{2}(1 - p)$，所以\n\n$$P(\\text{恰好两次}) = 3p^{2}(1 - p).$$\n\n当 $p = 0.6$ 时：$3 \\cdot 0.36 \\cdot 0.4 = 0.432$。同样，恰好成功一次的概率是 $3p(1 - p)^{2}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const two = rng.bool();
        const p = Q.of(k, 10);
        const q = Q.of(10 - k, 10);
        const path = two ? p.mul(p).mul(q) : p.mul(q).mul(q);
        const ans = path.mul(Q.of(3));
        const ctx = rng.pick([
          t(
            `A seed sprouts with probability $${h(10 * k)}$, independently of other seeds. Three seeds are planted. What is the probability that exactly ${two ? "two" : "one"} of them sprout${two ? "" : "s"}?`,
            `每粒种子发芽的概率是 $${h(10 * k)}$，各粒种子相互独立。种下三粒种子，求恰好有${two ? "两" : "一"}粒发芽的概率。`,
          ),
          t(
            `An archer hits the target with probability $${h(10 * k)}$ on each shot, independently. She shoots three times. What is the probability that she hits exactly ${two ? "twice" : "once"}?`,
            `一名射箭运动员每次射中靶子的概率是 $${h(10 * k)}$，各次相互独立。她射三次，求恰好射中${two ? "两" : "一"}次的概率。`,
          ),
        ]);
        const form = two ? `3 \\cdot ${dec(p)}^{2} \\cdot ${dec(q)}` : `3 \\cdot ${dec(p)} \\cdot ${dec(q)}^{2}`;
        return numberProblem({
          prompt: t(`${ctx.en}${asDecimal.en}`, `${ctx["zh-CN"]}${asDecimal["zh-CN"]}`),
          answer: ans,
          form: "decimal",
          wrong: [
            path,
            two ? p.mul(p).mul(Q.of(3)) : p.mul(Q.of(3)),
            two ? p.mul(p) : p,
            two ? p.mul(q).mul(q).mul(Q.of(3)) : p.mul(p).mul(q).mul(Q.of(3)),
          ],
          solution: t(
            `Three paths have exactly ${two ? "two successes" : "one success"}, each with probability $${dec(path)}$:${steps(`${form} = ${dec(ans)}`)}`,
            `恰好${two ? "两" : "一"}次成功的路径有三条，每条的概率都是 $${dec(path)}$：${steps(`${form} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Combinatorics

/** The rules of sum and product (Geometry 6.19.1). */
export const theRulesOfSumAndProduct: TopicDef = {
  id: "the-rules-of-sum-and-product",
  title: t("The Rules of Sum and Product", "加法原理与乘法原理"),
  summary: t(
    "Count choices made in sequence by multiplying and choices among separate options by adding.",
    "分步完成的选择用乘法计数，分类完成的选择用加法计数。",
  ),
  prerequisites: ["order-of-operations-with-integers"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSS.CP.B.9"],
  knowledgePoints: [
    {
      id: "rule-of-product",
      title: t("The rule of product", "乘法原理"),
      explanation: t(
        "**The rule of product.** If one choice can be made in $m$ ways and then, whatever it was, a second choice in $n$ ways, the two choices together can be made in $m \\cdot n$ ways. The rule extends to any number of steps.\n\nWith $4$ shirts, $3$ pairs of pants and $2$ pairs of shoes, there are $4 \\cdot 3 \\cdot 2 = 24$ outfits. A code of $3$ digits, each any of the $10$ digits, can be chosen in $10 \\cdot 10 \\cdot 10 = 1000$ ways.",
        "**乘法原理**：如果完成一件事要分两步，第一步有 $m$ 种方法，不论第一步怎样选，第二步都有 $n$ 种方法，那么完成这件事共有 $m \\cdot n$ 种方法。步数更多时同理。\n\n有 $4$ 件衬衫、$3$ 条裤子、$2$ 双鞋，就有 $4 \\cdot 3 \\cdot 2 = 24$ 种搭配。$3$ 位的密码，每一位可以是 $10$ 个数字中的任意一个，共有 $10 \\cdot 10 \\cdot 10 = 1000$ 种。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const [s, p, k] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 6)];
          const three = rng.bool();
          const ans = three ? s * p * k : s * p;
          return numberProblem({
            prompt: three
              ? t(
                  `Sam has ${s} shirts, ${p} pairs of pants and ${k} pairs of shoes. An outfit is one shirt, one pair of pants and one pair of shoes. How many different outfits can Sam make?`,
                  `萨姆有 ${s} 件衬衫、${p} 条裤子和 ${k} 双鞋。一套搭配由一件衬衫、一条裤子和一双鞋组成。萨姆一共能搭配出多少种不同的服装？`,
                )
              : t(
                  `Sam has ${s} shirts and ${p} pairs of pants. An outfit is one shirt and one pair of pants. How many different outfits can Sam make?`,
                  `萨姆有 ${s} 件衬衫和 ${p} 条裤子。一套搭配由一件衬衫和一条裤子组成。萨姆一共能搭配出多少种不同的服装？`,
                ),
            answer: ans,
            wrong: three ? [s + p + k, s * p, s * p + k] : [s + p, s * p * 2],
            solution: t(
              `Each choice can follow each earlier one, so multiply:${steps(three ? `${s} \\cdot ${p} \\cdot ${k} = ${ans}` : `${s} \\cdot ${p} = ${ans}`)}`,
              `每一步的每种选法都可以接在前面任何一种选法之后，所以相乘：${steps(three ? `${s} \\cdot ${p} \\cdot ${k} = ${ans}` : `${s} \\cdot ${p} = ${ans}`)}`,
            ),
          });
        }
        if (kind === 1) {
          const [a, b, c] = [rng.int(3, 8), rng.int(3, 12), rng.int(2, 9)];
          const ans = a * b * c;
          return numberProblem({
            prompt: t(
              `A café offers ${a} starters, ${b} main courses and ${c} desserts. A set meal is one of each. How many different set meals are there?`,
              `一家餐馆提供 ${a} 种前菜、${b} 种主菜和 ${c} 种甜点。一份套餐包括每类各一种。共有多少种不同的套餐？`,
            ),
            answer: ans,
            wrong: [a + b + c, a * b + c, a * b],
            solution: t(
              `Choose one of each in turn and multiply:${steps(`${a} \\cdot ${b} \\cdot ${c} = ${ans}`)}`,
              `依次各选一种，相乘：${steps(`${a} \\cdot ${b} \\cdot ${c} = ${ans}`)}`,
            ),
          });
        }
        const L = rng.int(1, 2);
        const D = rng.int(2, 4);
        const ans = 26 ** L * 10 ** D;
        const factors = [...Array(L).fill("26"), ...Array(D).fill("10")].join(" \\cdot ");
        return numberProblem({
          prompt: t(
            `A code is made of ${L === 1 ? "one letter" : `${L} letters`} (A to Z) followed by ${D} digits (0 to 9). Letters and digits may repeat. How many different codes are there?`,
            `一个编号由 ${L} 个字母（A 到 Z）后接 ${D} 个数字（0 到 9）组成，字母和数字都可以重复。共有多少种不同的编号？`,
          ),
          answer: ans,
          wrong: [26 * L + 10 * D, 26 * L * 10 * D, 26 + 10 ** D],
          solution: t(
            `Each of the ${L + D} positions is one step: $26$ ways for a letter and $10$ for a digit.${steps(`${factors} = ${ans}`)}`,
            `${L + D} 个位置各是一步：字母有 $26$ 种，数字有 $10$ 种。${steps(`${factors} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "rule-of-sum",
      title: t("The rule of sum", "加法原理"),
      explanation: t(
        "**The rule of sum.** If a choice is made from one of several groups that have nothing in common, the number of ways is the sum of the sizes of the groups.\n\nTo pick one book to read from $7$ novels and $5$ comics, there are $7 + 5 = 12$ choices: you choose one book, not one of each kind. Use the product when you make one choice *and then* another; use the sum when you make one choice *or* another.",
        "**加法原理**：如果从几个没有公共元素的组中只选一个，选法总数是各组元素个数之和。\n\n从 $7$ 本小说和 $5$ 本漫画中挑一本来读，有 $7 + 5 = 12$ 种选法：只选一本，而不是每类各选一本。先选一个*再*选一个时用乘法；选这一个*或*那一个时用加法。",
      ),
      generate(rng) {
        const three = rng.bool();
        const [a, b, c] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 15)];
        const ans = three ? a + b + c : a + b;
        const ctx = rng.int(0, 1);
        const prompt =
          ctx === 0
            ? three
              ? t(
                  `A shelf holds ${a} novels, ${b} comics and ${c} magazines. In how many ways can Lin choose one item to read?`,
                  `书架上有 ${a} 本小说、${b} 本漫画和 ${c} 本杂志。林从中选一本来读，有多少种选法？`,
                )
              : t(
                  `A shelf holds ${a} novels and ${b} comics. In how many ways can Lin choose one book to read?`,
                  `书架上有 ${a} 本小说和 ${b} 本漫画。林从中选一本来读，有多少种选法？`,
                )
            : three
              ? t(
                  `A school club can be chosen from ${a} sports clubs, ${b} music clubs or ${c} art clubs. Each student joins exactly one club. How many choices does a student have?`,
                  `学生可以从 ${a} 个体育社团、${b} 个音乐社团或 ${c} 个美术社团中选择。每名学生只参加一个社团。一名学生有多少种选择？`,
                )
              : t(
                  `A student joins exactly one club, either one of ${a} sports clubs or one of ${b} music clubs. How many choices does the student have?`,
                  `一名学生只参加一个社团，可以从 ${a} 个体育社团或 ${b} 个音乐社团中选。他有多少种选择？`,
                );
        return numberProblem({
          prompt,
          answer: ans,
          wrong: three ? [a * b * c, a + b, a * b + c] : [a * b, a + b - 1],
          solution: t(
            `Only one item is chosen, from groups with nothing in common, so add:${steps(three ? `${a} + ${b} + ${c} = ${ans}` : `${a} + ${b} = ${ans}`)}`,
            `只选一个，而且各组没有公共元素，所以相加：${steps(three ? `${a} + ${b} + ${c} = ${ans}` : `${a} + ${b} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "combining-sum-and-product",
      title: t("Combining the rules", "综合运用两个原理"),
      explanation: t(
        "Many problems split into cases (add) and count each case in steps (multiply).\n\nThere are $3$ roads from town A to town B, $4$ roads from B to C, and $2$ direct roads from A to C. A trip from A to C goes either through B, in $3 \\cdot 4 = 12$ ways, or directly, in $2$ ways, so there are $12 + 2 = 14$ routes.",
        "很多问题要先分类（相加），每一类再分步计数（相乘）。\n\n从 A 镇到 B 镇有 $3$ 条路，从 B 到 C 有 $4$ 条路，从 A 直达 C 有 $2$ 条路。从 A 到 C 要么经过 B，有 $3 \\cdot 4 = 12$ 种走法，要么直达，有 $2$ 种，所以共有 $12 + 2 = 14$ 种路线。",
      ),
      generate(rng) {
        const [a, b, c] = [rng.int(2, 6), rng.int(2, 6), rng.int(1, 5)];
        const ans = a * b + c;
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `There are ${a} roads from town A to town B, ${b} roads from town B to town C, and ${c} direct road${c === 1 ? "" : "s"} from town A to town C. How many different routes are there from A to C that pass through each town at most once?`,
              `从 A 镇到 B 镇有 ${a} 条路，从 B 镇到 C 镇有 ${b} 条路，从 A 镇直达 C 镇有 ${c} 条路。从 A 到 C，每个镇最多经过一次，共有多少种不同的路线？`,
            ),
            answer: ans,
            wrong: [a + b + c, a * b * c, a * b, (a + c) * b],
            solution: t(
              `Through B: $${a} \\cdot ${b} = ${a * b}$ routes. Directly: $${c}$. The cases do not overlap, so add:${steps(`${a * b} + ${c} = ${ans}`)}`,
              `经过 B：$${a} \\cdot ${b} = ${a * b}$ 种；直达：$${c}$ 种。两类不重叠，所以相加：${steps(`${a * b} + ${c} = ${ans}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `For lunch, Ava has either a sandwich and a drink, or a salad on its own. There are ${a} kinds of sandwich, ${b} kinds of drink and ${c} kind${c === 1 ? "" : "s"} of salad. How many different lunches can she have?`,
            `午餐时，阿娃要么吃一份三明治配一杯饮料，要么只吃一份沙拉。三明治有 ${a} 种，饮料有 ${b} 种，沙拉有 ${c} 种。她共有多少种不同的午餐选择？`,
          ),
          answer: ans,
          wrong: [a + b + c, a * b * c, a * b, (a + c) * b],
          solution: t(
            `Sandwich and drink: $${a} \\cdot ${b} = ${a * b}$ lunches. Salad: $${c}$. Add the two cases:${steps(`${a * b} + ${c} = ${ans}`)}`,
            `三明治配饮料：$${a} \\cdot ${b} = ${a * b}$ 种；沙拉：$${c}$ 种。两类相加：${steps(`${a * b} + ${c} = ${ans}`)}`,
          ),
        });
      },
    },
  ],
};

/** factL writes n! expanded: "5 \cdot 4 \cdot 3 \cdot 2 \cdot 1". */
const factL = (n: number) => (n <= 1 ? "1" : prodL(n, n));

/** Factorials (Geometry 6.19.2). */
export const factorials: TopicDef = {
  id: "factorials",
  title: t("Factorials", "阶乘"),
  summary: t("Evaluate factorials, including 0!, and simplify quotients of factorials.", "计算阶乘（包括 0!），并化简阶乘的商。"),
  prerequisites: ["the-rules-of-sum-and-product", "equivalent-fractions"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.1 }],
  xp: 10,
  standards: ["CCSS.HSS.CP.B.9"],
  knowledgePoints: [
    {
      id: "evaluating-factorials",
      title: t("Evaluating factorials", "计算阶乘"),
      explanation: t(
        "For a positive integer $n$, **$n$ factorial** is the product of the integers from $n$ down to $1$:\n\n$$n! = n \\cdot (n - 1) \\cdot \\ldots \\cdot 2 \\cdot 1, \\qquad 5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120.$$\n\nBy definition $0! = 1$ (and $1! = 1$). The factorial applies only to the number just before it: $2 \\cdot 3! = 2 \\cdot 6 = 12$, not $6! = 720$, and $3! + 2! = 6 + 2 = 8$, not $5! = 120$.",
        "对正整数 $n$，**$n$ 的阶乘**是从 $n$ 到 $1$ 的所有整数的乘积：\n\n$$n! = n \\cdot (n - 1) \\cdot \\ldots \\cdot 2 \\cdot 1, \\qquad 5! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 120.$$\n\n规定 $0! = 1$（$1! = 1$）。阶乘只作用于紧挨在它前面的数：$2 \\cdot 3! = 2 \\cdot 6 = 12$，而不是 $6! = 720$；$3! + 2! = 6 + 2 = 8$，而不是 $5! = 120$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        if (kind === 0) {
          const n = rng.int(0, 8);
          return numberProblem({
            prompt: t(`Evaluate $${n}!$.`, `计算 $${n}!$。`),
            answer: fact(n),
            wrong: [n, n * (n - 1), (n * (n + 1)) / 2, n === 0 ? 0 : fact(n - 1)],
            solution: t(
              n === 0
                ? "By definition, $0! = 1$."
                : `Multiply the integers from $${n}$ down to $1$:${steps(`${n}! = ${factL(n)} = ${fact(n)}`)}`,
              n === 0 ? "按规定，$0! = 1$。" : `把从 $${n}$ 到 $1$ 的整数相乘：${steps(`${n}! = ${factL(n)} = ${fact(n)}`)}`,
            ),
          });
        }
        if (kind === 1) {
          const a = rng.int(2, 5);
          const n = rng.int(2, 6);
          return numberProblem({
            prompt: t(`Evaluate $${a} \\cdot ${n}!$.`, `计算 $${a} \\cdot ${n}!$。`),
            answer: a * fact(n),
            wrong: [fact(a * n), a * n, fact(a) * fact(n)],
            solution: t(
              `The factorial applies to $${n}$ only:${steps(`${a} \\cdot ${n}! = ${a} \\cdot ${fact(n)} = ${a * fact(n)}`)}`,
              `阶乘只作用于 $${n}$：${steps(`${a} \\cdot ${n}! = ${a} \\cdot ${fact(n)} = ${a * fact(n)}`)}`,
            ),
          });
        }
        const n = rng.int(3, 7);
        const m = rng.int(1, n - 1);
        const plus = kind === 2;
        const ans = plus ? fact(n) + fact(m) : fact(n) - fact(m);
        const op = plus ? "+" : "-";
        return numberProblem({
          prompt: t(`Evaluate $${n}! ${op} ${m}!$.`, `计算 $${n}! ${op} ${m}!$。`),
          answer: ans,
          wrong: [plus ? fact(n + m) : fact(n - m), plus ? n + m : n - m, fact(n) * fact(m)],
          solution: t(
            `Evaluate each factorial first:${steps(`${n}! ${op} ${m}! = ${fact(n)} ${op} ${fact(m)} = ${ans}`)}`,
            `先分别计算每个阶乘：${steps(`${n}! ${op} ${m}! = ${fact(n)} ${op} ${fact(m)} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "quotients-of-factorials",
      title: t("Quotients of factorials", "阶乘的商"),
      explanation: t(
        "To divide factorials, write the larger one until the smaller one appears, and cancel:\n\n$$\\frac{9!}{6!} = \\frac{9 \\cdot 8 \\cdot 7 \\cdot 6!}{6!} = 9 \\cdot 8 \\cdot 7 = 504.$$\n\nThis is much quicker than computing $9! = 362\\,880$ and $6! = 720$. Note that $\\frac{9!}{6!}$ is not $3!$: factorials do not divide like ordinary numbers.",
        "做阶乘的除法时，把较大的阶乘展开到出现较小的阶乘为止，再约去：\n\n$$\\frac{9!}{6!} = \\frac{9 \\cdot 8 \\cdot 7 \\cdot 6!}{6!} = 9 \\cdot 8 \\cdot 7 = 504.$$\n\n这比先算出 $9! = 362\\,880$ 和 $6! = 720$ 快得多。注意 $\\frac{9!}{6!}$ 不是 $3!$：阶乘不能像普通的数那样相除。",
      ),
      generate(rng) {
        const n = rng.int(5, 15);
        const k = rng.int(1, 3);
        const m = n - k;
        const ans = perm(n, k);
        return numberProblem({
          prompt: t(`Evaluate $\\frac{${n}!}{${m}!}$.`, `计算 $\\frac{${n}!}{${m}!}$。`),
          answer: ans,
          wrong: [fact(k), n * k, ans / n, perm(n, k + 1)],
          solution: t(
            `Write $${n}!$ as $${prodL(n, k)} \\cdot ${m}!$ and cancel $${m}!$:${steps(`\\frac{${n}!}{${m}!} = ${prodL(n, k)} = ${ans}`)}`,
            `把 $${n}!$ 写成 $${prodL(n, k)} \\cdot ${m}!$，约去 $${m}!$：${steps(`\\frac{${n}!}{${m}!} = ${prodL(n, k)} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "factorials-in-numerator-and-denominator",
      title: t("Several factorials in a quotient", "含多个阶乘的商"),
      explanation: t(
        "When the denominator is a product of factorials, cancel the larger one first, then divide by the other:\n\n$$\\frac{8!}{5! \\cdot 3!} = \\frac{8 \\cdot 7 \\cdot 6}{3!} = \\frac{336}{6} = 56.$$\n\nSimplifying before multiplying keeps the numbers small: $\\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 8 \\cdot 7 = 56$.",
        "分母是几个阶乘的积时，先约去较大的那个阶乘，再除以另一个：\n\n$$\\frac{8!}{5! \\cdot 3!} = \\frac{8 \\cdot 7 \\cdot 6}{3!} = \\frac{336}{6} = 56.$$\n\n先约分再相乘可以让数字保持较小：$\\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 8 \\cdot 7 = 56$。",
      ),
      generate(rng) {
        const n = rng.int(5, 12);
        const r = rng.int(2, Math.min(4, n - 2));
        const m = n - r;
        const ans = comb(n, r);
        const swap = rng.bool();
        const den = swap ? `${r}! \\cdot ${m}!` : `${m}! \\cdot ${r}!`;
        return numberProblem({
          prompt: t(`Evaluate $\\frac{${n}!}{${den}}$.`, `计算 $\\frac{${n}!}{${den}}$。`),
          answer: ans,
          wrong: [perm(n, r), ans * 2, fact(r), n * r],
          solution: t(
            `Cancel $${m}!$, then divide by $${r}! = ${fact(r)}$:${steps(`\\frac{${n}!}{${den}} = \\frac{${prodL(n, r)}}{${r}!} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
            `约去 $${m}!$，再除以 $${r}! = ${fact(r)}$：${steps(`\\frac{${n}!}{${den}} = \\frac{${prodL(n, r)}}{${r}!} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
          ),
        });
      },
    },
  ],
};

/** lin writes kn + a: "n", "2n - 1", "n + 3". */
function lin(k: number, a: number): string {
  const head = k === 1 ? "n" : `${k}n`;
  return a === 0 ? head : a > 0 ? `${head} + ${a}` : `${head} - ${-a}`;
}

/** factArg writes the argument of a factorial, in parentheses unless it is a single letter: "n!", "(n + 1)!", "(2n)!". */
const factArg = (k: number, a: number) => (k === 1 && a === 0 ? "n!" : `(${lin(k, a)})!`);

/** productOf writes the product of the factors kn + a for a in as, monomial factor first: "n(n - 1)", "(n + 2)(n + 1)". */
function productOf(k: number, as: readonly number[]): string {
  const sorted = [...as].sort((x, y) => (x === 0 ? -1 : y === 0 ? 1 : y - x));
  return sorted.map((a) => (a === 0 ? lin(k, 0) : `(${lin(k, a)})`)).join("");
}

/** Factorials in variable expressions (Geometry 6.19.3). */
export const factorialsInVariableExpressions: TopicDef = {
  id: "factorials-in-variable-expressions",
  title: t("Factorials in Variable Expressions", "含变量的阶乘式"),
  summary: t(
    "Simplify quotients of factorials of expressions such as (n + 1)!/(n − 1)!, and solve simple equations with them.",
    "化简 (n + 1)!/(n − 1)! 这类含变量阶乘的商，并解相关的简单方程。",
  ),
  prerequisites: ["factorials", "multiplying-binomials"],
  encompasses: [
    { topic: "factorials", weight: 0.5 },
    { topic: "multiplying-binomials", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.9"],
  knowledgePoints: [
    {
      id: "consecutive-factorials",
      title: t("Factorials one apart", "相差 1 的阶乘"),
      explanation: t(
        "For a positive integer $n$, the factorial of $n + 1$ is $n + 1$ times the factorial of $n$:\n\n$$(n + 1)! = (n + 1) \\cdot n!.$$\n\nSo factorials of expressions one apart cancel to a single factor:\n\n$$\\frac{(n + 3)!}{(n + 2)!} = \\frac{(n + 3) \\cdot (n + 2)!}{(n + 2)!} = n + 3, \\qquad \\frac{(n - 1)!}{n!} = \\frac{(n - 1)!}{n \\cdot (n - 1)!} = \\frac{1}{n}.$$\n\nThe larger factorial is always the one with the larger expression inside.",
        "对正整数 $n$，$n + 1$ 的阶乘等于 $n + 1$ 乘以 $n$ 的阶乘：\n\n$$(n + 1)! = (n + 1) \\cdot n!.$$\n\n所以两个相差 $1$ 的式子的阶乘相除，约分后只剩一个因式：\n\n$$\\frac{(n + 3)!}{(n + 2)!} = \\frac{(n + 3) \\cdot (n + 2)!}{(n + 2)!} = n + 3, \\qquad \\frac{(n - 1)!}{n!} = \\frac{(n - 1)!}{n \\cdot (n - 1)!} = \\frac{1}{n}.$$\n\n括号里的式子较大的那个阶乘也较大。",
      ),
      generate(rng) {
        const k = rng.pick([1, 1, 2, 3]);
        const a = rng.int(-3, 3);
        const inv = rng.bool(0.35);
        const top = lin(k, a);
        const big = factArg(k, a);
        const small = factArg(k, a - 1);
        const answer = inv ? (a === 0 ? `\\frac{1}{${top}}` : `\\frac{1}{${top}}`) : top;
        const expr = inv ? `\\frac{${small}}{${big}}` : `\\frac{${big}}{${small}}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$, where $n$ is a large positive integer.`, `化简 $${expr}$，其中 $n$ 是足够大的正整数。`),
          answer,
          lowest: true,
          wrong: inv ? [top, `\\frac{1}{${lin(k, a - 1)}}`, "1"] : [lin(k, a - 1), "1", `${productOf(k, [a, a - 1])}`],
          solution: t(
            `Write $${big} = (${top}) \\cdot ${small}$ and cancel $${small}$:${steps(`${expr} = ${answer}`)}`,
            `把 $${big}$ 写成 $(${top}) \\cdot ${small}$，约去 $${small}$：${steps(`${expr} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "factorials-further-apart",
      title: t("Factorials further apart", "相差更多的阶乘"),
      explanation: t(
        "When the expressions differ by $2$ or $3$, write the larger factorial down to the smaller one; several factors remain:\n\n$$\\frac{(n + 1)!}{(n - 1)!} = \\frac{(n + 1) \\cdot n \\cdot (n - 1)!}{(n - 1)!} = n(n + 1) = n^{2} + n.$$\n\nLeave the answer as a product of factors or multiply it out; both are simplified.",
        "两个式子相差 $2$ 或 $3$ 时，把较大的阶乘展开到较小的阶乘为止，约分后剩下几个因式：\n\n$$\\frac{(n + 1)!}{(n - 1)!} = \\frac{(n + 1) \\cdot n \\cdot (n - 1)!}{(n - 1)!} = n(n + 1) = n^{2} + n.$$\n\n答案可以写成因式的积，也可以展开，两者都是化简后的形式。",
      ),
      generate(rng) {
        const k = rng.pick([1, 1, 1, 2]);
        const a = rng.int(-1, 4);
        const gap = rng.pick([2, 2, 3]);
        const inv = rng.bool(0.3);
        const as = Array.from({ length: gap }, (_, i) => a - i);
        const prod = productOf(k, as);
        const big = factArg(k, a);
        const small = factArg(k, a - gap);
        const answer = inv ? `\\frac{1}{${prod}}` : prod;
        const expr = inv ? `\\frac{${small}}{${big}}` : `\\frac{${big}}{${small}}`;
        const expand = as.map((x) => `(${lin(k, x)})`).join(" \\cdot ");
        return expressionProblem({
          prompt: t(`Simplify $${expr}$, where $n$ is a large positive integer.`, `化简 $${expr}$，其中 $n$ 是足够大的正整数。`),
          answer,
          lowest: true,
          wrong: inv ? [prod, `\\frac{1}{${lin(k, a)}}`] : [lin(k, a), productOf(k, as.slice(0, gap - 1)), `${gap}`],
          solution: t(
            `Write $${big} = ${expand} \\cdot ${small}$ and cancel $${small}$:${steps(`${expr} = ${answer}`)}`,
            `把 $${big}$ 写成 $${expand} \\cdot ${small}$，约去 $${small}$：${steps(`${expr} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "solving-factorial-equations",
      title: t("Solving factorial equations", "解阶乘方程"),
      explanation: t(
        "To solve an equation with factorials, simplify the quotient first, then find $n$:\n\n$$\\frac{n!}{(n - 2)!} = 42 \\quad\\Longrightarrow\\quad n(n - 1) = 42.$$\n\n$n$ and $n - 1$ are consecutive integers whose product is $42 = 7 \\cdot 6$, so $n = 7$. (Solving $n^{2} - n - 42 = 0$ also gives $n = -6$, which is rejected: a factorial needs a whole number.)",
        "解含阶乘的方程，先化简商，再求 $n$：\n\n$$\\frac{n!}{(n - 2)!} = 42 \\quad\\Longrightarrow\\quad n(n - 1) = 42.$$\n\n$n$ 与 $n - 1$ 是乘积为 $42 = 7 \\cdot 6$ 的两个连续整数，所以 $n = 7$。（解 $n^{2} - n - 42 = 0$ 还会得到 $n = -6$，应舍去：阶乘只对自然数有意义。）",
      ),
      generate(rng) {
        const form = rng.int(0, 2);
        const n = rng.int(3, 15);
        // form 0: n!/(n-2)! = n(n-1); form 1: (n+1)!/(n-1)! = (n+1)n; form 2: (n+2)!/n! = (n+2)(n+1).
        const hi = [n, n + 1, n + 2][form]!;
        const k = hi * (hi - 1);
        const expr = [`\\frac{n!}{(n - 2)!}`, `\\frac{(n + 1)!}{(n - 1)!}`, `\\frac{(n + 2)!}{n!}`][form]!;
        const prod = [`n(n - 1)`, `(n + 1)n`, `(n + 2)(n + 1)`][form]!;
        return numberProblem({
          prompt: t(`Solve $${expr} = ${k}$ for the positive integer $n$.`, `求满足 $${expr} = ${k}$ 的正整数 $n$。`),
          answer: n,
          solveFor: "n",
          wrong: [hi, hi - 1, n + 1, k / 2],
          solution: t(
            `Simplify: $${expr} = ${prod}$. The two consecutive integers with product $${k}$ are $${hi}$ and $${hi - 1}$, so${steps(`n = ${n}`)}`,
            `化简：$${expr} = ${prod}$。乘积为 $${k}$ 的两个连续整数是 $${hi}$ 和 $${hi - 1}$，所以${steps(`n = ${n}`)}`,
          ),
        });
      },
    },
  ],
};

/** Row is a kind of objects arranged in a row. */
interface Row {
  readonly setup: (n: number) => Text;
  readonly a: Text;
  readonly b: Text;
  readonly first: Text;
  readonly last: Text;
}

const rowsOf: readonly Row[] = [
  {
    setup: (n) => t(`${n} different books are placed in a row on a shelf.`, `把 ${n} 本不同的书在书架上排成一排。`),
    a: t("the dictionary", "词典"),
    b: t("the atlas", "地图册"),
    first: t("at the left end", "在最左端"),
    last: t("at the right end", "在最右端"),
  },
  {
    setup: (n) => t(`${n} friends stand in a line for a photo.`, `${n} 个朋友站成一排拍照。`),
    a: t("Ana", "安娜"),
    b: t("Ben", "本"),
    first: t("at the left end", "在最左端"),
    last: t("at the right end", "在最右端"),
  },
  {
    setup: (n) => t(`${n} runners finish a race, with no ties.`, `${n} 名运动员跑完一场比赛，没有并列名次。`),
    a: t("Kai", "凯"),
    b: t("Lea", "莉娅"),
    first: t("first", "第一名"),
    last: t("last", "最后一名"),
  },
  {
    setup: (n) => t(`A playlist plays ${n} different songs, each once.`, `一个播放列表把 ${n} 首不同的歌各播放一次。`),
    a: t("the oldest song", "最老的那首歌"),
    b: t("the newest song", "最新的那首歌"),
    first: t("first", "第一首"),
    last: t("last", "最后一首"),
  },
];

/** seatsInARow is a row of seats for problems where two people sit together or apart. */
const seatsInARow: Row = {
  setup: (n) => t(`${n} students sit in a row of ${n} chairs.`, `${n} 名学生坐在一排 ${n} 把椅子上。`),
  a: t("Mia", "米娅"),
  b: t("Noah", "诺亚"),
  first: t("in the first chair", "在第一把椅子上"),
  last: t("in the last chair", "在最后一把椅子上"),
};

/** Ordering objects (Geometry 6.19.4). */
export const orderingObjects: TopicDef = {
  id: "ordering-objects",
  title: t("Ordering Objects", "排列物体"),
  summary: t(
    "Count the orders of n different objects with n!, including orders with fixed positions and with objects kept together.",
    "用 n! 计算 n 个不同物体的排列数，包括某些位置固定或某些物体相邻的情况。",
  ),
  prerequisites: ["factorials"],
  encompasses: [
    { topic: "factorials", weight: 0.4 },
    { topic: "the-rules-of-sum-and-product", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.9"],
  knowledgePoints: [
    {
      id: "orders-of-n-objects",
      title: t("Orders of n objects", "n 个物体的排列"),
      explanation: t(
        "To put $n$ different objects in order, choose the first in $n$ ways, the second in $n - 1$ ways (one is used), and so on. By the rule of product, the number of orders is\n\n$$n \\cdot (n - 1) \\cdot \\ldots \\cdot 1 = n!.$$\n\nFour friends can stand in a line in $4! = 24$ ways.",
        "把 $n$ 个不同的物体排成一列：第一个有 $n$ 种选法，第二个有 $n - 1$ 种（已用掉一个），依此类推。由乘法原理，排列数是\n\n$$n \\cdot (n - 1) \\cdot \\ldots \\cdot 1 = n!.$$\n\n四个朋友站成一排有 $4! = 24$ 种站法。",
      ),
      generate(rng) {
        const r = rng.pick(rowsOf);
        const n = rng.int(3, 10);
        return numberProblem({
          prompt: t(`${r.setup(n).en} In how many different orders can this happen?`, `${r.setup(n)["zh-CN"]}共有多少种不同的顺序？`),
          answer: fact(n),
          wrong: [n, n * n, (n * (n + 1)) / 2, fact(n - 1)],
          solution: t(
            `There are $${n}$ choices for the first place, $${n - 1}$ for the next, and so on:${steps(`${n}! = ${fact(n)}`)}`,
            `第一个位置有 $${n}$ 种选法，下一个有 $${n - 1}$ 种，依此类推：${steps(`${n}! = ${fact(n)}`)}`,
          ),
        });
      },
    },
    {
      id: "fixed-positions",
      title: t("Fixed positions", "位置固定"),
      explanation: t(
        "When some objects must be in given places, place them first, then order the rest.\n\nIf 6 friends line up and Ana must be at the left end, the other $5$ fill the remaining places in $5! = 120$ ways. If Ana must be at *one of* the ends, there are $2$ choices for her end, so $2 \\cdot 5! = 240$ ways. If Ana is at the left end and Ben at the right end, the other $4$ can be ordered in $4! = 24$ ways.",
        "某些物体必须在指定位置时，先放好它们，再排列其余物体。\n\n6 个朋友排成一排，若安娜必须在最左端，其余 $5$ 人排在剩下的位置，有 $5! = 120$ 种。若安娜必须在*某一端*，她有 $2$ 种选法，共 $2 \\cdot 5! = 240$ 种。若安娜在最左端、本在最右端，其余 $4$ 人有 $4! = 24$ 种排法。",
      ),
      generate(rng) {
        const r = rng.pick(rowsOf);
        const n = rng.int(4, 9);
        const kind = rng.int(0, 2);
        const cond = [
          t(`${cap(r.a.en)} must be ${r.first.en}.`, `${r.a["zh-CN"]}必须${r.first["zh-CN"]}。`),
          t(`${cap(r.a.en)} must be either ${r.first.en} or ${r.last.en}.`, `${r.a["zh-CN"]}必须${r.first["zh-CN"]}或${r.last["zh-CN"]}。`),
          t(
            `${cap(r.a.en)} must be ${r.first.en} and ${r.b.en} must be ${r.last.en}.`,
            `${r.a["zh-CN"]}必须${r.first["zh-CN"]}，${r.b["zh-CN"]}必须${r.last["zh-CN"]}。`,
          ),
        ][kind]!;
        const ans = [fact(n - 1), 2 * fact(n - 1), fact(n - 2)][kind]!;
        const work = [
          steps(`${n - 1}! = ${ans}`),
          steps(`2 \\cdot ${n - 1}! = 2 \\cdot ${fact(n - 1)} = ${ans}`),
          steps(`${n - 2}! = ${ans}`),
        ][kind]!;
        return numberProblem({
          prompt: t(
            `${r.setup(n).en} ${cond.en} In how many different orders can this happen?`,
            `${r.setup(n)["zh-CN"]}${cond["zh-CN"]}共有多少种不同的顺序？`,
          ),
          answer: ans,
          wrong: [fact(n), fact(n) - fact(n - 1), fact(n - 1), 2 * fact(n - 2), n - 1],
          solution: t(
            `${["Place it first; the other", "There are 2 choices of end; then the other", "Place both; the other"][kind]} ${kind === 2 ? n - 2 : n - 1} can be in any order:${work}`,
            `${["先放好它，其余", "端点有 2 种选法，其余", "先放好这两个，其余"][kind]} ${kind === 2 ? n - 2 : n - 1} 个可以任意排列：${work}`,
          ),
        });
      },
    },
    {
      id: "objects-kept-together",
      title: t("Objects kept together", "物体相邻"),
      explanation: t(
        "To keep two objects next to each other, glue them into one block. With $6$ friends where Ana and Ben stand together, order $5$ units (the block and $4$ others) in $5!$ ways, and the block itself in $2$ ways (Ana–Ben or Ben–Ana): $2 \\cdot 5! = 240$.\n\nTo keep them **apart**, subtract from all orders: $6! - 2 \\cdot 5! = 720 - 240 = 480$.",
        "要让两个物体相邻，把它们“捆绑”成一个整体。6 个朋友中安娜和本必须相邻：把这个整体和其余 $4$ 人共 $5$ 个单位排列，有 $5!$ 种；整体内部有 $2$ 种（安娜—本或本—安娜），共 $2 \\cdot 5! = 240$ 种。\n\n要让它们**不相邻**，用全部排法减去相邻的排法：$6! - 2 \\cdot 5! = 720 - 240 = 480$。",
      ),
      generate(rng) {
        const r = rng.pick([...rowsOf.slice(0, 2), seatsInARow]);
        const n = rng.int(4, 9);
        const apart = rng.bool();
        const together = 2 * fact(n - 1);
        const ans = apart ? fact(n) - together : together;
        return numberProblem({
          prompt: t(
            `${r.setup(n).en} ${cap(r.a.en)} and ${r.b.en} must ${apart ? "not " : ""}be next to each other. In how many different orders can this happen?`,
            `${r.setup(n)["zh-CN"]}${r.a["zh-CN"]}和${r.b["zh-CN"]}${apart ? "不能" : "必须"}相邻。共有多少种不同的顺序？`,
          ),
          answer: ans,
          wrong: apart ? [together, fact(n) - fact(n - 1), fact(n - 2)] : [fact(n - 1), fact(n) - together, 2 * fact(n - 2)],
          solution: t(
            `Together: the block and the other $${n - 2}$ make $${n - 1}$ units, and the block has $2$ orders, so $2 \\cdot ${n - 1}! = ${together}$.${apart ? ` Apart: subtract from all orders.${steps(`${n}! - ${together} = ${fact(n)} - ${together} = ${ans}`)}` : ""}`,
            `相邻：整体和其余 $${n - 2}$ 个共 $${n - 1}$ 个单位，整体内部有 $2$ 种顺序，所以有 $2 \\cdot ${n - 1}! = ${together}$ 种。${apart ? `不相邻：用全部排法减去相邻的排法。${steps(`${n}! - ${together} = ${fact(n)} - ${together} = ${ans}`)}` : ""}`,
          ),
        });
      },
    },
  ],
};

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Permutations (Geometry 6.19.5). */
export const permutations: TopicDef = {
  id: "permutations",
  title: t("Permutations", "排列"),
  summary: t(
    "Count ordered selections of r objects from n with nPr = n!/(n − r)!.",
    "用 nPr = n!/(n − r)! 计算从 n 个物体中选出 r 个并排序的方法数。",
  ),
  prerequisites: ["ordering-objects"],
  encompasses: [
    { topic: "ordering-objects", weight: 0.5 },
    { topic: "factorials", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.9"],
  knowledgePoints: [
    {
      id: "evaluating-permutations",
      title: t("Evaluating permutations", "计算排列数"),
      explanation: t(
        "A **permutation** of $r$ objects from $n$ is an ordered selection: choose the first in $n$ ways, the second in $n - 1$ ways, …, the $r$th in $n - r + 1$ ways. Their number is\n\n$$_{n}P_{r} = P(n, r) = n(n - 1)\\cdots(n - r + 1) = \\frac{n!}{(n - r)!}.$$\n\nFor example $_{8}P_{3} = 8 \\cdot 7 \\cdot 6 = 336$: three factors, starting at $8$.",
        "从 $n$ 个物体中取出 $r$ 个按顺序排列，叫做一个**排列**：第一个有 $n$ 种选法，第二个有 $n - 1$ 种，……，第 $r$ 个有 $n - r + 1$ 种。排列数是\n\n$$_{n}P_{r} = P(n, r) = n(n - 1)\\cdots(n - r + 1) = \\frac{n!}{(n - r)!}.$$\n\n例如 $_{8}P_{3} = 8 \\cdot 7 \\cdot 6 = 336$：从 $8$ 开始的三个因数。",
      ),
      generate(rng) {
        const n = rng.int(5, 12);
        const r = rng.int(2, 4);
        const ans = perm(n, r);
        const notation = rng.bool() ? `{}_{${n}}P_{${r}}` : `P(${n}, ${r})`;
        return numberProblem({
          prompt: t(`Evaluate $${notation}$.`, `计算 $${notation}$。`),
          answer: ans,
          wrong: [comb(n, r), n ** r, n * r, perm(n, r + 1), fact(n) / fact(r)],
          solution: t(
            `Multiply $${r}$ factors, starting at $${n}$:${steps(`${notation} = \\frac{${n}!}{${n - r}!} = ${prodL(n, r)} = ${ans}`)}`,
            `从 $${n}$ 开始连乘 $${r}$ 个因数：${steps(`${notation} = \\frac{${n}!}{${n - r}!} = ${prodL(n, r)} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "permutations-in-context",
      title: t("Permutations in context", "实际问题中的排列"),
      explanation: t(
        "Use permutations when you pick $r$ of $n$ different objects and **the order matters**: different roles, positions or places.\n\nIn a club of $10$ members, a president, a vice president and a secretary can be chosen in $_{10}P_{3} = 10 \\cdot 9 \\cdot 8 = 720$ ways: Ana as president and Ben as secretary is different from Ben as president and Ana as secretary.",
        "从 $n$ 个不同的物体中选出 $r$ 个，并且**顺序有关**（不同的角色、位置或名次）时，用排列。\n\n一个有 $10$ 名成员的社团选出主席、副主席和秘书各一名，有 $_{10}P_{3} = 10 \\cdot 9 \\cdot 8 = 720$ 种选法：安娜当主席、本当秘书，与本当主席、安娜当秘书是不同的。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let n: number;
        let r: number;
        let prompt: Text;
        if (kind === 0) {
          n = rng.int(5, 15);
          r = 3;
          prompt = t(
            `${n} runners take part in a race. In how many ways can the gold, silver and bronze medals be awarded? (There are no ties.)`,
            `${n} 名运动员参加比赛。金、银、铜牌的颁发方式有多少种？（没有并列名次。）`,
          );
        } else if (kind === 1) {
          n = rng.int(6, 20);
          r = rng.int(2, 4);
          const roles = [
            t("a president and a vice president", "主席和副主席"),
            t("a president, a vice president and a secretary", "主席、副主席和秘书"),
            t("a president, a vice president, a secretary and a treasurer", "主席、副主席、秘书和财务"),
          ][r - 2]!;
          prompt = t(
            `A club has ${n} members. In how many ways can ${roles.en} be chosen, if no one holds two roles?`,
            `一个社团有 ${n} 名成员。选出${roles["zh-CN"]}，每人最多担任一个职务，有多少种选法？`,
          );
        } else {
          n = 10;
          r = rng.int(2, 5);
          prompt = t(
            `A code uses ${r} different digits (0 to 9), and the order of the digits matters. How many codes are possible?`,
            `一个密码由 ${r} 个互不相同的数字（0 到 9）组成，数字的顺序有关。共有多少种可能的密码？`,
          );
        }
        const ans = perm(n, r);
        return numberProblem({
          prompt,
          answer: ans,
          wrong: [comb(n, r), n ** r, n * r, fact(r)],
          solution: t(
            `The order matters, so count permutations of $${r}$ from $${n}$:${steps(`{}_{${n}}P_{${r}} = ${prodL(n, r)} = ${ans}`)}`,
            `顺序有关，所以求从 $${n}$ 个中取 $${r}$ 个的排列数：${steps(`{}_{${n}}P_{${r}} = ${prodL(n, r)} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "permutations-with-a-condition",
      title: t("Permutations with a condition", "有条件的排列"),
      explanation: t(
        "Deal with the condition first, then count what is left.\n\nIn a club of $10$, a president, a vice president and a secretary are chosen, and Ana must be president: the other two roles go to the other $9$ members in $_{9}P_{2} = 72$ ways. If instead Ana must hold no role, all three roles go to the other $9$: $_{9}P_{3} = 504$ ways.",
        "先处理条件，再对剩下的部分计数。\n\n一个 $10$ 人的社团选出主席、副主席和秘书，安娜必须当主席：另两个职务由其余 $9$ 人担任，有 $_{9}P_{2} = 72$ 种。若安娜不能担任任何职务，三个职务都由其余 $9$ 人担任：$_{9}P_{3} = 504$ 种。",
      ),
      generate(rng) {
        const n = rng.int(6, 15);
        const r = rng.int(2, 4);
        const must = rng.bool();
        const roles = [
          t("a president and a vice president", "主席和副主席"),
          t("a president, a vice president and a secretary", "主席、副主席和秘书"),
          t("a president, a vice president, a secretary and a treasurer", "主席、副主席、秘书和财务"),
        ][r - 2]!;
        const ans = must ? perm(n - 1, r - 1) : perm(n - 1, r);
        const [pn, pr] = must ? [n - 1, r - 1] : [n - 1, r];
        return numberProblem({
          prompt: t(
            `A club has ${n} members, including Ana. ${cap(roles.en)} are chosen, and no one holds two roles. In how many ways can this be done if Ana ${must ? "must be president" : "must not hold any role"}?`,
            `一个社团有 ${n} 名成员，其中有安娜。选出${roles["zh-CN"]}，每人最多担任一个职务。如果安娜${must ? "必须当主席" : "不能担任任何职务"}，有多少种选法？`,
          ),
          answer: ans,
          wrong: [perm(n, r), must ? perm(n - 1, r) : perm(n - 1, r - 1), perm(n, r) - ans, comb(pn, pr)],
          solution: t(
            `${must ? `Ana is president; the other $${r - 1}$ roles go to the other $${n - 1}$ members` : `All $${r}$ roles go to the other $${n - 1}$ members`}:${steps(`{}_{${pn}}P_{${pr}} = ${prodL(pn, pr)} = ${ans}`)}`,
            `${must ? `安娜当主席，另外 $${r - 1}$ 个职务由其余 $${n - 1}$ 人担任` : `$${r}$ 个职务都由其余 $${n - 1}$ 人担任`}：${steps(`{}_{${pn}}P_{${pr}} = ${prodL(pn, pr)} = ${ans}`)}`,
          ),
        });
      },
    },
  ],
};

/** Combinations (Geometry 6.19.6). */
export const combinations: TopicDef = {
  id: "combinations",
  title: t("Combinations", "组合"),
  summary: t(
    "Count unordered selections of r objects from n with nCr = n!/(r!(n − r)!), alone and with the rule of product.",
    "用 nCr = n!/(r!(n − r)!) 计算从 n 个物体中选出 r 个（不计顺序）的方法数，并与乘法原理结合使用。",
  ),
  prerequisites: ["permutations"],
  encompasses: [
    { topic: "permutations", weight: 0.5 },
    { topic: "factorials", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.9"],
  knowledgePoints: [
    {
      id: "evaluating-combinations",
      title: t("Evaluating combinations", "计算组合数"),
      explanation: t(
        "A **combination** of $r$ objects from $n$ is a selection in which the order does not matter. Each combination can be ordered in $r!$ ways, so there are $r!$ times fewer combinations than permutations:\n\n$$_{n}C_{r} = \\binom{n}{r} = \\frac{{}_{n}P_{r}}{r!} = \\frac{n!}{r!\\,(n - r)!}.$$\n\nFor example $\\binom{8}{3} = \\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = \\frac{336}{6} = 56$.",
        "从 $n$ 个物体中取出 $r$ 个、不计顺序，叫做一个**组合**。每个组合可以排成 $r!$ 种顺序，所以组合数是排列数的 $\\frac{1}{r!}$：\n\n$$_{n}C_{r} = \\binom{n}{r} = \\frac{{}_{n}P_{r}}{r!} = \\frac{n!}{r!\\,(n - r)!}.$$\n\n例如 $\\binom{8}{3} = \\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = \\frac{336}{6} = 56$。",
      ),
      generate(rng) {
        const n = rng.int(5, 14);
        const r = rng.int(2, Math.min(5, n - 2));
        const ans = comb(n, r);
        const notation = rng.bool() ? `{}_{${n}}C_{${r}}` : `\\binom{${n}}{${r}}`;
        return numberProblem({
          prompt: t(`Evaluate $${notation}$.`, `计算 $${notation}$。`),
          answer: ans,
          wrong: [perm(n, r), n * r, fact(n) / fact(r), comb(n, r - 1) === ans ? n : comb(n, r - 1)],
          solution: t(
            `Divide the permutations by $${r}!$:${steps(`${notation} = \\frac{${prodL(n, r)}}{${factL(r)}} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
            `用排列数除以 $${r}!$：${steps(`${notation} = \\frac{${prodL(n, r)}}{${factL(r)}} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "combinations-in-context",
      title: t("Combinations in context", "实际问题中的组合"),
      explanation: t(
        "Use combinations when you pick $r$ of $n$ different objects and **the order does not matter**: a group, a committee, a hand of cards, a set of toppings.\n\nA committee of $3$ from a club of $10$ can be formed in $\\binom{10}{3} = \\frac{10 \\cdot 9 \\cdot 8}{3!} = 120$ ways: Ana, Ben and Kai form the same committee in any order. Each handshake among $n$ people is a pair of people, so there are $\\binom{n}{2}$ handshakes.",
        "从 $n$ 个不同的物体中选出 $r$ 个，并且**与顺序无关**（一组人、一个委员会、一手牌、几种配料）时，用组合。\n\n从 $10$ 人的社团中选出 $3$ 人组成委员会，有 $\\binom{10}{3} = \\frac{10 \\cdot 9 \\cdot 8}{3!} = 120$ 种选法：安娜、本、凯不论按什么顺序选出，都是同一个委员会。$n$ 个人两两握手，每次握手对应一对人，所以共握手 $\\binom{n}{2}$ 次。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let n: number;
        let r: number;
        let prompt: Text;
        if (kind === 0) {
          n = rng.int(6, 15);
          r = rng.int(2, 5);
          prompt = t(
            `A committee of ${r} people is chosen from a club of ${n} members. How many different committees are possible?`,
            `从一个有 ${n} 名成员的社团中选出 ${r} 人组成委员会。可以组成多少个不同的委员会？`,
          );
        } else if (kind === 1) {
          n = rng.int(6, 14);
          r = rng.int(2, 4);
          prompt = t(
            `A pizzeria offers ${n} different toppings. How many different pizzas with exactly ${r} different toppings can be ordered?`,
            `一家比萨店提供 ${n} 种不同的配料。恰好加 ${r} 种不同配料的比萨共有多少种？`,
          );
        } else {
          n = rng.int(5, 20);
          r = 2;
          prompt = t(
            `At a meeting, each of the ${n} people shakes hands once with each of the others. How many handshakes are there?`,
            `一次会议上，${n} 个人中每两人握手一次。共握手多少次？`,
          );
        }
        const ans = comb(n, r);
        return numberProblem({
          prompt,
          answer: ans,
          wrong: [perm(n, r), n * r, n ** r, fact(n) / fact(n - r + 1)],
          solution: t(
            `The order does not matter, so count combinations of $${r}$ from $${n}$:${steps(`\\binom{${n}}{${r}} = \\frac{${prodL(n, r)}}{${r}!} = ${ans}`)}`,
            `与顺序无关，所以求从 $${n}$ 个中取 $${r}$ 个的组合数：${steps(`\\binom{${n}}{${r}} = \\frac{${prodL(n, r)}}{${r}!} = ${ans}`)}`,
          ),
        });
      },
    },
    {
      id: "choosing-from-two-groups",
      title: t("Choosing from two groups", "从两组中选取"),
      explanation: t(
        "When a selection takes a given number from each of two groups, choose from each group with a combination, then multiply by the rule of product.\n\nA team of $2$ girls and $3$ boys chosen from $5$ girls and $6$ boys: $\\binom{5}{2} \\cdot \\binom{6}{3} = 10 \\cdot 20 = 200$ teams. This is not $\\binom{11}{5} = 462$, which counts every team of $5$, whatever its mix.",
        "从两组中各选出指定的人数时，每组用组合数计算，再用乘法原理相乘。\n\n从 $5$ 名女生和 $6$ 名男生中选出 $2$ 名女生和 $3$ 名男生组队：$\\binom{5}{2} \\cdot \\binom{6}{3} = 10 \\cdot 20 = 200$ 种。它不是 $\\binom{11}{5} = 462$，那是不论男女组成的所有 $5$ 人队伍的个数。",
      ),
      generate(rng) {
        const g = rng.int(3, 9);
        const b = rng.int(3, 9);
        const x = rng.int(1, Math.min(3, g - 1));
        const y = rng.int(1, Math.min(3, b - 1));
        const ans = comb(g, x) * comb(b, y);
        return numberProblem({
          prompt: t(
            `A team is made of ${x} girl${x === 1 ? "" : "s"} chosen from ${g} girls and ${y} boy${y === 1 ? "" : "s"} chosen from ${b} boys. How many different teams are possible?`,
            `从 ${g} 名女生中选出 ${x} 名、从 ${b} 名男生中选出 ${y} 名组成一个队。可以组成多少个不同的队？`,
          ),
          answer: ans,
          wrong: [comb(g, x) + comb(b, y), comb(g + b, x + y), perm(g, x) * perm(b, y)],
          solution: t(
            `Choose the girls and the boys separately and multiply:${steps(`\\binom{${g}}{${x}} \\cdot \\binom{${b}}{${y}} = ${comb(g, x)} \\cdot ${comb(b, y)} = ${ans}`)}`,
            `分别选出女生和男生，再相乘：${steps(`\\binom{${g}}{${x}} \\cdot \\binom{${b}}{${y}} = ${comb(g, x)} \\cdot ${comb(b, y)} = ${ans}`)}`,
          ),
        });
      },
    },
  ],
};

/** Group is a group of two kinds of people or objects from which some are chosen at random. */
interface Group {
  readonly setup: (x: number, y: number, k: number) => Text;
  readonly x: Text;
  readonly y: Text;
}

const groups: readonly Group[] = [
  {
    setup: (x, y, k) =>
      t(
        `A club has ${x} women and ${y} men. A committee of ${k} members is chosen at random.`,
        `一个社团有 ${x} 名女性和 ${y} 名男性。从中随机选出 ${k} 人组成委员会。`,
      ),
    x: t("women", "女性"),
    y: t("men", "男性"),
  },
  {
    setup: (x, y, k) =>
      t(
        `A bag holds ${x} red and ${y} blue marbles. ${k} marbles are taken out at random at the same time.`,
        `袋子里有 ${x} 颗红弹珠和 ${y} 颗蓝弹珠。同时随机取出 ${k} 颗。`,
      ),
    x: t("red", "红色"),
    y: t("blue", "蓝色"),
  },
];

/** Computing probabilities using combinatorics (Geometry 6.19.7). */
export const computingProbabilitiesUsingCombinatorics: TopicDef = {
  id: "computing-probabilities-using-combinatorics",
  title: t("Computing Probabilities Using Combinatorics", "用计数方法求概率"),
  summary: t(
    "Find probabilities of equally likely outcomes by counting favorable and possible outcomes with combinations and orders.",
    "用组合数和排列数分别数出有利结果和全部结果，求等可能结果的概率。",
  ),
  prerequisites: ["combinations"],
  encompasses: [
    { topic: "combinations", weight: 0.7 },
    { topic: "ordering-objects", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.9"],
  knowledgePoints: [
    {
      id: "all-of-one-kind",
      title: t("All of one kind", "全是同一类"),
      explanation: t(
        "When all selections are equally likely,\n\n$$P(\\text{event}) = \\frac{\\text{number of favorable selections}}{\\text{number of possible selections}}.$$\n\nA committee of $3$ is chosen at random from $5$ women and $4$ men. There are $\\binom{9}{3} = 84$ possible committees, and $\\binom{5}{3} = 10$ of them are all women, so\n\n$$P(\\text{all women}) = \\frac{10}{84} = \\frac{5}{42}.$$",
        "当所有选法等可能时，\n\n$$P(\\text{事件}) = \\frac{\\text{有利的选法数}}{\\text{全部的选法数}}.$$\n\n从 $5$ 名女性和 $4$ 名男性中随机选出 $3$ 人组成委员会。全部委员会有 $\\binom{9}{3} = 84$ 个，其中全是女性的有 $\\binom{5}{3} = 10$ 个，所以\n\n$$P(\\text{全是女性}) = \\frac{10}{84} = \\frac{5}{42}.$$",
      ),
      generate(rng) {
        const gr = rng.pick(groups);
        const x = rng.int(3, 9);
        const y = rng.int(2, 9);
        const k = rng.int(2, Math.min(4, x));
        const n = x + y;
        const fav = comb(x, k);
        const all = comb(n, k);
        return numberProblem({
          prompt: t(
            `${gr.setup(x, y, k).en} What is the probability that all of them are ${gr.x.en}?${simplest.en}`,
            `${gr.setup(x, y, k)["zh-CN"]}求选出的全是${gr.x["zh-CN"]}的概率。${simplest["zh-CN"]}`,
          ),
          answer: Q.of(fav, all),
          wrong: [Q.of(x, n).pow(k), Q.of(x, n), Q.of(k, n), Q.of(1, all)],
          solution: t(
            `There are $\\binom{${n}}{${k}} = ${all}$ equally likely selections, and $\\binom{${x}}{${k}} = ${fav}$ of them are all ${gr.x.en}:${steps(`P = ${ratioL(fav, all)}`)}`,
            `等可能的选法共 $\\binom{${n}}{${k}} = ${all}$ 种，其中全是${gr.x["zh-CN"]}的有 $\\binom{${x}}{${k}} = ${fav}$ 种：${steps(`P = ${ratioL(fav, all)}`)}`,
          ),
        });
      },
    },
    {
      id: "exactly-j-of-one-kind",
      title: t("Exactly j of one kind", "恰好有 j 个是某一类"),
      explanation: t(
        "For a mixed selection, count the favorable selections with the rule of product: choose the right number from each kind.\n\nA committee of $3$ from $5$ women and $4$ men has exactly $2$ women in $\\binom{5}{2} \\cdot \\binom{4}{1} = 10 \\cdot 4 = 40$ ways, so\n\n$$P(\\text{exactly 2 women}) = \\frac{40}{84} = \\frac{10}{21}.$$",
        "对混合的选法，用乘法原理数有利的选法：每一类各选出要求的个数。\n\n从 $5$ 名女性和 $4$ 名男性中选出 $3$ 人，恰好有 $2$ 名女性的选法有 $\\binom{5}{2} \\cdot \\binom{4}{1} = 10 \\cdot 4 = 40$ 种，所以\n\n$$P(\\text{恰好 2 名女性}) = \\frac{40}{84} = \\frac{10}{21}.$$",
      ),
      generate(rng) {
        const gr = rng.pick(groups);
        const x = rng.int(3, 9);
        const y = rng.int(3, 9);
        const k = rng.int(3, 4);
        const j = rng.int(1, k - 1);
        const n = x + y;
        const fav = comb(x, j) * comb(y, k - j);
        const all = comb(n, k);
        return numberProblem({
          prompt: t(
            `${gr.setup(x, y, k).en} What is the probability that exactly ${j} of them ${j === 1 ? "is" : "are"} ${gr.x.en}?${simplest.en}`,
            `${gr.setup(x, y, k)["zh-CN"]}求选出的恰好有 ${j} 个是${gr.x["zh-CN"]}的概率。${simplest["zh-CN"]}`,
          ),
          answer: Q.of(fav, all),
          wrong: [Q.of(comb(x, j), all), Q.of(j, k), Q.of(comb(x, j) + comb(y, k - j), all), Q.of(x, n)],
          solution: t(
            `There are $\\binom{${n}}{${k}} = ${all}$ selections. Favorable: $${j}$ of the $${x}$ and $${k - j}$ of the $${y}$, in $\\binom{${x}}{${j}} \\cdot \\binom{${y}}{${k - j}} = ${comb(x, j)} \\cdot ${comb(y, k - j)} = ${fav}$ ways:${steps(`P = ${ratioL(fav, all)}`)}`,
            `全部选法有 $\\binom{${n}}{${k}} = ${all}$ 种。有利的选法：从 $${x}$ 个中选 $${j}$ 个，从 $${y}$ 个中选 $${k - j}$ 个，有 $\\binom{${x}}{${j}} \\cdot \\binom{${y}}{${k - j}} = ${comb(x, j)} \\cdot ${comb(y, k - j)} = ${fav}$ 种：${steps(`P = ${ratioL(fav, all)}`)}`,
          ),
        });
      },
    },
    {
      id: "probabilities-of-orders",
      title: t("Probabilities of orders", "排列的概率"),
      explanation: t(
        "When objects are put in a random order, all $n!$ orders are equally likely. Count the favorable orders with the methods for ordering objects.\n\n$6$ friends line up at random. Ana and Ben stand next to each other in $2 \\cdot 5! = 240$ of the $6! = 720$ orders, so the probability is $\\frac{240}{720} = \\frac{1}{3}$. Ana is at the left end and Ben at the right end in $4! = 24$ orders: probability $\\frac{24}{720} = \\frac{1}{30}$.",
        "物体随机排列时，全部 $n!$ 种顺序等可能。用排列物体的方法数出有利的顺序。\n\n$6$ 个朋友随机站成一排。在 $6! = 720$ 种顺序中，安娜和本相邻的有 $2 \\cdot 5! = 240$ 种，概率是 $\\frac{240}{720} = \\frac{1}{3}$。安娜在最左端、本在最右端的有 $4! = 24$ 种：概率是 $\\frac{24}{720} = \\frac{1}{30}$。",
      ),
      generate(rng) {
        const n = rng.int(4, 9);
        const kind = rng.int(0, 4);
        const fav = [2 * fact(n - 1), fact(n - 2), fact(n - 1), 2 * fact(n - 1), fact(n - 1)][kind]!;
        const all = fact(n);
        const what = [
          t("Ana and Ben stand next to each other", "安娜和本相邻"),
          t("Ana is at the left end and Ben is at the right end", "安娜在最左端、本在最右端"),
          t("Ana is at the left end", "安娜在最左端"),
          t("Ana is at one of the two ends", "安娜在两端之一"),
          t("Ana stands directly to the left of Ben", "安娜紧挨在本的左边"),
        ][kind]!;
        const how = [
          `2 \\cdot ${n - 1}! = ${fav}`,
          `${n - 2}! = ${fav}`,
          `${n - 1}! = ${fav}`,
          `2 \\cdot ${n - 1}! = ${fav}`,
          `${n - 1}! = ${fav}`,
        ][kind]!;
        return numberProblem({
          prompt: t(
            `${n} friends, including Ana and Ben, stand in a line in a random order. What is the probability that ${what.en}?${simplest.en}`,
            `包括安娜和本在内的 ${n} 个朋友随机站成一排。求${what["zh-CN"]}的概率。${simplest["zh-CN"]}`,
          ),
          answer: Q.of(fav, all),
          wrong: [Q.of(1, all), Q.of(1, n * n), Q.of(2, n * (n - 1)), Q.of(fact(n - 1), all)],
          solution: t(
            `All $${n}! = ${all}$ orders are equally likely, and $${how}$ of them are favorable:${steps(`P = ${ratioL(fav, all)}`)}`,
            `全部 $${n}! = ${all}$ 种顺序等可能，其中有利的有 $${how}$ 种：${steps(`P = ${ratioL(fav, all)}`)}`,
          ),
        });
      },
    },
  ],
};

/** combinatoricsTopics are the topics of conditional probability and combinatorics, in outline order. */
export const combinatoricsTopics: readonly TopicDef[] = [
  conditionalProbabilitiesFromVennDiagrams,
  conditionalProbabilitiesFromTables,
  theMultiplicationLawForConditionalProbability,
  theLawOfTotalProbability,
  treeDiagramsForDependentEvents,
  treeDiagramsForDependentEventsApplications,
  independentEvents,
  treeDiagramsForIndependentEvents,
  theRulesOfSumAndProduct,
  factorials,
  factorialsInVariableExpressions,
  orderingObjects,
  permutations,
  combinations,
  computingProbabilitiesUsingCombinatorics,
];
