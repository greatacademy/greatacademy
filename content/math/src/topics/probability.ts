import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, type Mark, type Point, poly, Q, sketch, solutionsChecker } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, steps, yesNo } from "../problems.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sorted = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);
const unique = (xs: readonly number[]) => sorted([...new Set(xs)]);
const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);

/** range lists the integers from a to b inclusive. */
const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** setTex writes a set of numbers in LaTeX: "\{1, 3, 5\}", or "\varnothing" when it is empty. */
const setTex = (xs: readonly number[]) => (xs.length === 0 ? "\\varnothing" : `\\{${unique(xs).join(", ")}\\}`);

/** ratio writes the probability n/d, followed by its lowest terms when it reduces: "\frac{6}{20} = \frac{3}{10}". */
function ratio(n: number, d: number): string {
  const raw = `\\frac{${n}}{${d}}`;
  const v = Q.of(n, d);
  return v.toLatex() === raw ? raw : `${raw} = ${v.toLatex()}`;
}

/** SetProblem describes a problem whose answer is a finite set of numbers. */
interface SetProblem {
  readonly prompt: Text;
  readonly values: readonly number[];
  readonly solution: Text;
  /** wrong are the sets typical mistakes produce; sets equal to the answer are dropped. */
  readonly wrong?: readonly (readonly number[])[];
}

/** setProblem builds a problem whose answer is a set of numbers, typed as a list such as "\{2, 4, 6\}" or "2, 4, 6", checked by the "solutions" checker. */
function setProblem(p: SetProblem): Problem {
  const expected = { var: "x", values: unique(p.values).map(String) };
  return {
    prompt: p.prompt,
    answer: { checker: "solutions", expected, input: { kind: "math" } },
    solution: p.solution,
    canonical: setTex(p.values),
    wrong: [...new Set((p.wrong ?? []).map(setTex))].filter((w) => !solutionsChecker.check(expected, w).correct),
  };
}

/** probProblem builds a problem whose answer is a probability, accepted as a fraction in lowest terms or a decimal. */
const probProblem = (prompt: Text, answer: Coefficient, solution: Text, wrong: readonly Coefficient[]) =>
  numberProblem({ prompt, answer, solution, wrong: wrong.filter((w) => toQ(w).sign() >= 0) });

/** piTex writes c·π in LaTeX: "\frac{9\pi}{64}", "\pi". */
function piTex(c: Q): string {
  const top = c.n === 1n ? "\\pi" : `${c.n}\\pi`;
  return c.d === 1n ? top : `\\frac{${top}}{${c.d}}`;
}

const SET_EN = " Write the set as a list, such as $\\{1, 2, 3\\}$, or $\\varnothing$ if it is empty.";
const SET_ZH = "用列举法写出集合，如 $\\{1, 2, 3\\}$；若为空集，写 $\\varnothing$。";

/** NumEvent is an event about a number drawn from 1 to n, such as "the number is even". */
interface NumEvent {
  readonly en: string;
  readonly zh: string;
  readonly test: (x: number) => boolean;
  /** loose is the test a typical mistake applies instead: the boundary included or excluded wrongly. */
  readonly loose: (x: number) => boolean;
}

/** numberEvent draws an event about a whole number from 1 to n (n ≥ 6). */
function numberEvent(rng: Rng, n: number): NumEvent {
  const kind = rng.pick(["even", "odd", "multiple", "greater", "less", "atLeast", "atMost", "factor"] as const);
  switch (kind) {
    case "even":
      return { en: "even", zh: "是偶数", test: (x) => x % 2 === 0, loose: (x) => x % 2 === 1 };
    case "odd":
      return { en: "odd", zh: "是奇数", test: (x) => x % 2 === 1, loose: (x) => x % 2 === 0 };
    case "multiple": {
      const k = rng.int(3, Math.min(5, Math.floor(n / 2)));
      return { en: `a multiple of ${k}`, zh: `是 ${k} 的倍数`, test: (x) => x % k === 0, loose: (x) => k % x === 0 };
    }
    case "greater": {
      const m = rng.int(2, n - 2);
      return { en: `greater than ${m}`, zh: `大于 ${m}`, test: (x) => x > m, loose: (x) => x >= m };
    }
    case "less": {
      const m = rng.int(3, n - 1);
      return { en: `less than ${m}`, zh: `小于 ${m}`, test: (x) => x < m, loose: (x) => x <= m };
    }
    case "atLeast": {
      const m = rng.int(3, n - 1);
      return { en: `at least ${m}`, zh: `不小于 ${m}`, test: (x) => x >= m, loose: (x) => x > m };
    }
    case "atMost": {
      const m = rng.int(2, n - 2);
      return { en: `at most ${m}`, zh: `不大于 ${m}`, test: (x) => x <= m, loose: (x) => x < m };
    }
    case "factor": {
      const f = rng.pick([12, 18, 20, 24, 30, 36].filter((v) => v <= 3 * n));
      return { en: `a factor of ${f}`, zh: `是 ${f} 的因数`, test: (x) => f % x === 0, loose: (x) => x % f === 0 || x === f };
    }
  }
}

/** colors are the colors of marbles, spinner sections and the like. */
const colors = [
  ["red", "红"],
  ["blue", "蓝"],
  ["green", "绿"],
  ["yellow", "黄"],
  ["white", "白"],
] as const;

// ---------------------------------------------------------------------------
// Venn diagrams
// ---------------------------------------------------------------------------

/** ring draws a circle of radius r about c. */
const ring = (c: Point, r: number) => ({
  kind: "polygon" as const,
  points: Array.from({ length: 96 }, (_, i): Point => [c[0] + r * Math.cos((i * Math.PI) / 48), c[1] + r * Math.sin((i * Math.PI) / 48)]),
});

/** count writes a number centered at a point. */
const count = (at: Point, text: string): Mark => ({ kind: "label", at: [at[0], at[1] - 0.45], text, dir: "n" });

/** venn2Svg draws the Venn diagram of two sets A and B in U with the given texts in the regions A only, both, B only and neither. */
function venn2Svg(texts: readonly string[]): string {
  const marks: Mark[] = [
    {
      kind: "polygon",
      points: [
        [-5.6, -3.4],
        [5.6, -3.4],
        [5.6, 3.4],
        [-5.6, 3.4],
      ],
    },
    ring([-1.5, 0], 2.6),
    ring([1.5, 0], 2.6),
    { kind: "label", at: [-3.3, 1.85], text: "A", dir: "nw", italic: true },
    { kind: "label", at: [3.3, 1.85], text: "B", dir: "ne", italic: true },
    { kind: "label", at: [-5.6, 3.4], text: "U", dir: "se", italic: true },
  ];
  const at: Point[] = [
    [-2.5, 0],
    [0, 0],
    [2.5, 0],
    [4.7, -2.7],
  ];
  texts.forEach((s, i) => {
    if (s) marks.push(count(at[i]!, s));
  });
  return sketch(marks);
}

/** Venn2 are the counts of the regions A only, both, B only and neither. */
type Venn2 = readonly [number, number, number, number];

/** venn2Members are the memberships (in A, in B) of the regions of a Venn2. */
const venn2Members: readonly (readonly [boolean, boolean])[] = [
  [true, false],
  [true, true],
  [false, true],
  [false, false],
];

/** venn2Figure draws a two-set Venn diagram with counts. */
function venn2Figure(c: Venn2): Figure {
  return {
    svg: venn2Svg(c.map(String)),
    alt: t(
      `Venn diagram of A and B inside U: ${c[0]} in A only, ${c[1]} in both A and B, ${c[2]} in B only, ${c[3]} outside both.`,
      `U 中 A 与 B 的韦恩图：仅在 A 中 ${c[0]}，同时在 A 和 B 中 ${c[1]}，仅在 B 中 ${c[2]}，两者之外 ${c[3]}。`,
    ),
  };
}

/** venn2Counts draws the counts of a two-set Venn diagram. */
const venn2Counts = (rng: Rng): Venn2 => [rng.int(2, 24), rng.int(1, 15), rng.int(2, 24), rng.int(1, 16)];

/** Venn3 are the counts of the regions A only, A and B only, B only, A and C only, all three, B and C only, C only and none. */
type Venn3 = readonly [number, number, number, number, number, number, number, number];

/** venn3Members are the memberships (in A, in B, in C) of the regions of a Venn3. */
const venn3Members: readonly (readonly [boolean, boolean, boolean])[] = [
  [true, false, false],
  [true, true, false],
  [false, true, false],
  [true, false, true],
  [true, true, true],
  [false, true, true],
  [false, false, true],
  [false, false, false],
];

/** venn3Figure draws a three-set Venn diagram with counts. */
function venn3Figure(c: Venn3): Figure {
  const marks: Mark[] = [
    {
      kind: "polygon",
      points: [
        [-5.2, -4.4],
        [5.2, -4.4],
        [5.2, 4.3],
        [-5.2, 4.3],
      ],
    },
    ring([-1.3, 0.8], 2.4),
    ring([1.3, 0.8], 2.4),
    ring([0, -1.35], 2.4),
    { kind: "label", at: [-3.0, 2.5], text: "A", dir: "nw", italic: true },
    { kind: "label", at: [3.0, 2.5], text: "B", dir: "ne", italic: true },
    { kind: "label", at: [1.7, -3.05], text: "C", dir: "se", italic: true },
    { kind: "label", at: [-5.2, 4.3], text: "U", dir: "se", italic: true },
  ];
  const at: Point[] = [
    [-2.2, 1.4],
    [0, 1.95],
    [2.2, 1.4],
    [-1.35, -0.55],
    [0, 0.25],
    [1.35, -0.55],
    [0, -2.55],
    [4.4, -3.7],
  ];
  c.forEach((s, i) => {
    marks.push(count(at[i]!, String(s)));
  });
  return {
    svg: sketch(marks),
    alt: t(
      `Venn diagram of A, B and C inside U: ${c[0]} in A only, ${c[2]} in B only, ${c[6]} in C only, ${c[1]} in A and B but not C, ${c[3]} in A and C but not B, ${c[5]} in B and C but not A, ${c[4]} in all three, ${c[7]} outside all three.`,
      `U 中 A、B、C 的韦恩图：仅在 A 中 ${c[0]}，仅在 B 中 ${c[2]}，仅在 C 中 ${c[6]}，在 A 和 B 中但不在 C 中 ${c[1]}，在 A 和 C 中但不在 B 中 ${c[3]}，在 B 和 C 中但不在 A 中 ${c[5]}，三者都在 ${c[4]}，三者之外 ${c[7]}。`,
    ),
  };
}

/** venn3Counts draws the counts of a three-set Venn diagram. */
const venn3Counts = (rng: Rng): Venn3 => [
  rng.int(2, 15),
  rng.int(1, 9),
  rng.int(2, 15),
  rng.int(1, 9),
  rng.int(1, 6),
  rng.int(1, 9),
  rng.int(2, 15),
  rng.int(1, 12),
];

/** Survey is the setting of a two-set Venn diagram: who was asked, and the two properties A and B, in the third person singular. */
interface Survey {
  readonly who: Text;
  readonly a: Text;
  readonly b: Text;
}

const surveys: readonly Survey[] = [
  { who: t("students", "学生"), a: t("plays soccer", "踢足球"), b: t("plays basketball", "打篮球") },
  { who: t("adults", "成年人"), a: t("owns a cat", "养猫"), b: t("owns a dog", "养狗") },
  { who: t("students", "学生"), a: t("studies French", "学法语"), b: t("studies Spanish", "学西班牙语") },
  { who: t("office workers", "上班族"), a: t("drinks coffee", "喝咖啡"), b: t("drinks tea", "喝茶") },
  { who: t("club members", "俱乐部会员"), a: t("swims", "游泳"), b: t("runs", "跑步") },
  { who: t("shoppers", "顾客"), a: t("bought fruit", "买了水果"), b: t("bought bread", "买了面包") },
];

/** surveyPrompt introduces a two-set Venn diagram with counts and the events A and B. */
function surveyPrompt(s: Survey, total: number): Text {
  return t(
    `In a survey of ${total} ${s.who.en}, $A$ is the event that a person ${s.a.en} and $B$ the event that the person ${s.b.en}. The Venn diagram shows how many people are in each region. One person is chosen at random.`,
    `调查了 ${total} 名${s.who["zh-CN"]}，事件 $A$ 表示此人${s.a["zh-CN"]}，事件 $B$ 表示此人${s.b["zh-CN"]}。韦恩图给出了每个区域的人数。从中随机选出一人。`,
  );
}

/** Survey3 is the setting of a three-set Venn diagram. */
interface Survey3 {
  readonly who: Text;
  readonly a: Text;
  readonly b: Text;
  readonly c: Text;
}

const surveys3: readonly Survey3[] = [
  { who: t("students", "学生"), a: t("takes art", "选修美术"), b: t("takes music", "选修音乐"), c: t("takes drama", "选修戏剧") },
  { who: t("guests", "客人"), a: t("ordered soup", "点了汤"), b: t("ordered salad", "点了沙拉"), c: t("ordered dessert", "点了甜点") },
  { who: t("teenagers", "青少年"), a: t("uses app A", "使用应用 A"), b: t("uses app B", "使用应用 B"), c: t("uses app C", "使用应用 C") },
  { who: t("runners", "跑者"), a: t("ran in spring", "春季参赛"), b: t("ran in summer", "夏季参赛"), c: t("ran in autumn", "秋季参赛") },
];

function survey3Prompt(s: Survey3, total: number): Text {
  return t(
    `In a survey of ${total} ${s.who.en}, $A$, $B$ and $C$ are the events that a person ${s.a.en}, ${s.b.en} and ${s.c.en}. The Venn diagram shows how many people are in each region. One person is chosen at random.`,
    `调查了 ${total} 名${s.who["zh-CN"]}，事件 $A$、$B$、$C$ 分别表示此人${s.a["zh-CN"]}、${s.b["zh-CN"]}、${s.c["zh-CN"]}。韦恩图给出了每个区域的人数。从中随机选出一人。`,
  );
}

/** VennEvent is an event built from A and B, with its LaTeX and a description of its regions. */
interface VennEvent {
  readonly tex: string;
  readonly en: string;
  readonly zh: string;
  readonly test: (a: boolean, b: boolean) => boolean;
}

/** vennCount counts the people of a two-set Venn diagram in an event. */
const vennCount = (c: Venn2, e: (a: boolean, b: boolean) => boolean) =>
  sum(c.filter((_, i) => e(venn2Members[i]![0], venn2Members[i]![1])));

/** vennSolution writes the solution of P(event) from a two-set Venn diagram. */
function vennSolution(c: Venn2, e: VennEvent): Text {
  const parts = c.filter((_, i) => e.test(venn2Members[i]![0], venn2Members[i]![1]));
  const n = sum(parts);
  const total = sum(c);
  const add = parts.length > 1 ? `${parts.join(" + ")} = ${n}` : `${n}`;
  return t(
    `$${e.tex}$ is ${e.en}. It holds $${add}$ of the $${total}$ people:${steps(`P(${e.tex}) = ${ratio(n, total)}`)}`,
    `$${e.tex}$ 是${e.zh}，共有 $${add}$ 人，总人数为 $${total}$：${steps(`P(${e.tex}) = ${ratio(n, total)}`)}`,
  );
}

// ---------------------------------------------------------------------------
// 6.16 Introduction to Probability
// ---------------------------------------------------------------------------

/** DescribedSet is a set given by a rule, with the sets that typical mistakes produce. */
interface DescribedSet {
  readonly en: string;
  readonly zh: string;
  readonly elements: readonly number[];
  readonly loose: readonly (readonly number[])[];
}

/** describedSet draws a set in set-builder notation: numbers of a kind between two bounds, or the factors of a number. */
function describedSet(rng: Rng, name: string): DescribedSet {
  if (rng.bool(0.2)) {
    const n = rng.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50]);
    const fs = range(1, n).filter((x) => n % x === 0);
    return {
      en: `${name} = \\{x \\mid x \\text{ is a factor of } ${n}\\}`,
      zh: `${name} = \\{x \\mid x \\text{ 是 } ${n} \\text{ 的因数}\\}`,
      elements: fs,
      loose: [fs.filter((x) => x !== 1 && x !== n), fs.filter((x) => x !== n)],
    };
  }
  for (;;) {
    const k = rng.pick([0, 1, 2, 3, 4, 5, 6]);
    const lo = rng.int(1, 20);
    const hi = lo + rng.int(10, 32);
    const strictLo = rng.bool();
    const strictHi = rng.bool();
    const [what, whatZh, p] =
      k === 0
        ? ["an odd number", "是奇数", (x: number) => x % 2 === 1]
        : k === 1
          ? ["an even number", "是偶数", (x: number) => x % 2 === 0]
          : [`a multiple of ${k + 1}`, `是 ${k + 1} 的倍数`, (x: number) => x % (k + 1) === 0];
    const within = (sl: boolean, sh: boolean) => range(lo, hi).filter((x) => p(x) && (sl ? x > lo : true) && (sh ? x < hi : true));
    const elements = within(strictLo, strictHi);
    if (elements.length < 3 || elements.length > 10) continue;
    // A bound that is not itself of the kind makes strict and non-strict the same; require one bound to matter.
    if (!p(lo) && !p(hi)) continue;
    const opLo = strictLo ? "<" : "\\le";
    const opHi = strictHi ? "<" : "\\le";
    return {
      en: `${name} = \\{x \\mid x \\text{ is ${what}}, ${lo} ${opLo} x ${opHi} ${hi}\\}`,
      zh: `${name} = \\{x \\mid x \\text{ ${whatZh}}, ${lo} ${opLo} x ${opHi} ${hi}\\}`,
      elements,
      loose: [within(false, false), within(true, true), within(!strictLo, !strictHi)],
    };
  }
}

/** sets is outline topic 6.16.1. */
export const sets: TopicDef = {
  id: "sets",
  title: t("Sets", "集合"),
  summary: t(
    "Use set notation: elements, the number of elements, set-builder notation, and subsets.",
    "使用集合记号：元素、元素个数、描述法和子集。",
  ),
  prerequisites: ["factors-of-a-number", "multiples-of-a-number"],
  encompasses: [
    { topic: "factors-of-a-number", weight: 0.1 },
    { topic: "multiples-of-a-number", weight: 0.1 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "listing-the-elements-of-a-set",
      title: t("Listing the elements of a set", "列举集合的元素"),
      explanation: t(
        'A **set** is a collection of distinct objects, its **elements**, written between braces: $A = \\{2, 4, 6\\}$. The order does not matter and no element is repeated. We write $4 \\in A$ for "$4$ is an element of $A$" and $5 \\notin A$ for "$5$ is not an element of $A$". The set with no elements is the **empty set** $\\varnothing$.\n\n**Set-builder notation** describes a set by a rule: $\\{x \\mid \\text{condition}\\}$ is "the set of all $x$ such that the condition holds". Watch the inequality signs: $<$ leaves a bound out, $\\le$ keeps it in.\n\n$B = \\{x \\mid x \\text{ is odd}, 3 \\le x < 11\\}$: the odd numbers from $3$ up to, but not including, $11$, so $B = \\{3, 5, 7, 9\\}$.',
        "**集合**是一些互不相同的对象（称为**元素**）的全体，写在花括号中：$A = \\{2, 4, 6\\}$。元素的顺序无关紧要，也不重复。$4 \\in A$ 表示“$4$ 是 $A$ 的元素”，$5 \\notin A$ 表示“$5$ 不是 $A$ 的元素”。没有元素的集合叫**空集**，记作 $\\varnothing$。\n\n**描述法**用规则描述集合：$\\{x \\mid \\text{条件}\\}$ 表示“所有满足条件的 $x$ 组成的集合”。注意不等号：$<$ 不含端点，$\\le$ 含端点。\n\n$B = \\{x \\mid x \\text{ 是奇数}, 3 \\le x < 11\\}$：从 $3$ 起到 $11$ 为止（不含 $11$）的奇数，所以 $B = \\{3, 5, 7, 9\\}$。",
      ),
      generate(rng) {
        const s = describedSet(rng, "A");
        return setProblem({
          prompt: t(`List the elements of $${s.en}$.${SET_EN}`, `用列举法写出 $${s.zh}$。${SET_ZH}`),
          values: s.elements,
          wrong: s.loose,
          solution: t(
            `Check each number against the rule, keeping or leaving out the bounds as the signs say:${steps(`A = ${setTex(s.elements)}`)}`,
            `逐个检验数是否满足规则，按不等号决定是否包含端点：${steps(`A = ${setTex(s.elements)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-number-of-elements",
      title: t("The number of elements", "元素的个数"),
      explanation: t(
        "$n(A)$ is the **number of elements** of a set $A$. For $A = \\{x \\mid x \\text{ is a multiple of } 5, 10 < x \\le 40\\}$, list the elements first: $A = \\{15, 20, 25, 30, 35, 40\\}$, so $n(A) = 6$. Note that $10$ is left out but $40$ is kept. $n(\\varnothing) = 0$.",
        "$n(A)$ 表示集合 $A$ 的**元素个数**。对于 $A = \\{x \\mid x \\text{ 是 } 5 \\text{ 的倍数}, 10 < x \\le 40\\}$，先列出元素：$A = \\{15, 20, 25, 30, 35, 40\\}$，所以 $n(A) = 6$。注意不含 $10$ 但含 $40$。$n(\\varnothing) = 0$。",
      ),
      generate(rng) {
        const s = describedSet(rng, "A");
        const n = s.elements.length;
        return numberProblem({
          prompt: t(`Let $${s.en}$. Find $n(A)$.`, `设 $${s.zh}$。求 $n(A)$。`),
          answer: n,
          form: "integer",
          wrong: [...s.loose.map((l) => l.length), n + 1, n - 1],
          solution: t(
            `List the elements:${steps(`A = ${setTex(s.elements)}`)}There are $${n}$ of them, so $n(A) = ${n}$.`,
            `列出元素：${steps(`A = ${setTex(s.elements)}`)}共 $${n}$ 个，所以 $n(A) = ${n}$。`,
          ),
        });
      },
    },
    {
      id: "subsets",
      title: t("Subsets", "子集"),
      explanation: t(
        "$B$ is a **subset** of $A$, written $B \\subseteq A$, when every element of $B$ is also an element of $A$. One element of $B$ outside $A$ is enough to make $B \\not\\subseteq A$. Every set is a subset of itself, and $\\varnothing$ is a subset of every set.\n\nFor $A = \\{1, 3, 5, 7, 9\\}$: $\\{3, 9\\} \\subseteq A$, but $\\{3, 4\\} \\not\\subseteq A$ because $4 \\notin A$.",
        "如果 $B$ 的每个元素都是 $A$ 的元素，就说 $B$ 是 $A$ 的**子集**，记作 $B \\subseteq A$。只要 $B$ 有一个元素不在 $A$ 中，就有 $B \\not\\subseteq A$。每个集合都是它自身的子集，$\\varnothing$ 是任何集合的子集。\n\n对于 $A = \\{1, 3, 5, 7, 9\\}$：$\\{3, 9\\} \\subseteq A$，但 $\\{3, 4\\} \\not\\subseteq A$，因为 $4 \\notin A$。",
      ),
      generate(rng) {
        const a = unique(rng.sample(range(1, 30), rng.int(5, 8)));
        const subset = rng.bool();
        let b = rng.sample(a, rng.int(2, 4));
        let outsider = 0;
        if (!subset) {
          outsider = rng.pick(range(1, 30).filter((x) => !a.includes(x)));
          b = [...b.slice(1), outsider];
        }
        b = unique(b);
        return choiceProblem({
          prompt: t(
            `Let $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Is $B \\subseteq A$?`,
            `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$。$B \\subseteq A$ 吗？`,
          ),
          options: yesNo,
          correct: subset ? 0 : 1,
          solution: subset
            ? t(
                `Each of $${b.join(", ")}$ is an element of $A$, so $B \\subseteq A$.`,
                `$${b.join(", ")}$ 都是 $A$ 的元素，所以 $B \\subseteq A$。`,
              )
            : t(
                `$${outsider} \\in B$ but $${outsider} \\notin A$, so $B \\not\\subseteq A$.`,
                `$${outsider} \\in B$ 但 $${outsider} \\notin A$，所以 $B \\not\\subseteq A$。`,
              ),
        });
      },
    },
  ],
};

/** Trial is a repeated experiment with one outcome counted. */
interface Trial {
  readonly en: (n: number, k: number) => string;
  readonly zh: (n: number, k: number) => string;
  readonly event: Text;
}

const trials: readonly Trial[] = [
  {
    en: (n, k) => `A coin is flipped ${n} times and lands heads ${k} times.`,
    zh: (n, k) => `一枚硬币抛了 ${n} 次，其中 ${k} 次正面朝上。`,
    event: t("the coin lands heads", "硬币正面朝上"),
  },
  {
    en: (n, k) => `A basketball player takes ${n} free throws and makes ${k} of them.`,
    zh: (n, k) => `一名篮球运动员罚球 ${n} 次，投中 ${k} 次。`,
    event: t("the player makes a free throw", "罚球投中"),
  },
  {
    en: (n, k) => `A thumbtack is dropped ${n} times and lands point up ${k} times.`,
    zh: (n, k) => `一枚图钉掷了 ${n} 次，其中 ${k} 次钉尖朝上。`,
    event: t("the thumbtack lands point up", "图钉钉尖朝上"),
  },
  {
    en: (n, k) => `Of ${n} light bulbs tested, ${k} are defective.`,
    zh: (n, k) => `检测了 ${n} 个灯泡，其中 ${k} 个有缺陷。`,
    event: t("a bulb is defective", "灯泡有缺陷"),
  },
  {
    en: (n, k) => `A bus was observed on ${n} days and arrived late on ${k} of them.`,
    zh: (n, k) => `观察了一辆公交车 ${n} 天，其中 ${k} 天晚点。`,
    event: t("the bus is late", "公交车晚点"),
  },
];

/** experimentalProbability is outline topic 6.16.2. */
export const experimentalProbability: TopicDef = {
  id: "experimental-probability",
  title: t("Experimental Probability", "试验概率"),
  summary: t(
    "Estimate the probability of an outcome as its relative frequency in repeated trials.",
    "用重复试验中结果出现的频率估计其概率。",
  ),
  prerequisites: ["equivalent-fractions"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.1 }],
  xp: 10,
  standards: ["CCSS.7.SP.C.6"],
  knowledgePoints: [
    {
      id: "relative-frequency",
      title: t("Relative frequency", "频率"),
      explanation: t(
        "When an experiment is repeated many times, the **experimental probability** of an outcome is the fraction of the trials in which it happened:\n\n$$P(\\text{outcome}) \\approx \\frac{\\text{number of times it happened}}{\\text{number of trials}}$$\n\nA die is rolled $50$ times and shows a six $9$ times, so the experimental probability of a six is $\\frac{9}{50}$. Divide by the number of **trials**, not by the number of times the outcome did not happen. Write the fraction in lowest terms.",
        "把一个试验重复很多次，某个结果的**试验概率**是它出现的次数占总试验次数的比例：\n\n$$P(\\text{结果}) \\approx \\frac{\\text{出现次数}}{\\text{试验次数}}$$\n\n掷骰子 $50$ 次，出现六点 $9$ 次，所以六点的试验概率是 $\\frac{9}{50}$。分母是**试验总次数**，而不是没有出现的次数。分数要化成最简形式。",
      ),
      generate(rng) {
        const tr = rng.pick(trials);
        const n = rng.pick([20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200]);
        const k = rng.int(1, n - 1);
        return probProblem(
          t(
            `${tr.en(n, k)} What is the experimental probability that ${tr.event.en}?`,
            `${tr.zh(n, k)}${tr.event["zh-CN"]}的试验概率是多少？`,
          ),
          Q.of(k, n),
          t(
            `Divide the number of times it happened by the number of trials:${steps(`P = ${ratio(k, n)}`)}`,
            `出现次数除以试验次数：${steps(`P = ${ratio(k, n)}`)}`,
          ),
          [Q.of(n - k, n), Q.of(k, n - k), Q.of(k, 100)],
        );
      },
    },
    {
      id: "experimental-probability-from-a-table",
      title: t("Experimental probability from a table", "由频数表求试验概率"),
      explanation: t(
        "Results are often recorded in a **frequency table**. The number of trials is the sum of all the frequencies. If several outcomes count, add their frequencies.\n\n| Color | Red | Blue | Green |\n| :--- | :--- | :--- | :--- |\n| Frequency | $14$ | $9$ | $17$ |\n\nThere were $14 + 9 + 17 = 40$ spins, so the experimental probability of blue is $\\frac{9}{40}$, and of red or green $\\frac{14 + 17}{40} = \\frac{31}{40}$.",
        "试验结果常记录在**频数表**中。试验总次数是所有频数之和。若有几个结果都算，就把它们的频数相加。\n\n| 颜色 | 红 | 蓝 | 绿 |\n| :--- | :--- | :--- | :--- |\n| 频数 | $14$ | $9$ | $17$ |\n\n共转了 $14 + 9 + 17 = 40$ 次，所以蓝色的试验概率是 $\\frac{9}{40}$，红色或绿色的试验概率是 $\\frac{14 + 17}{40} = \\frac{31}{40}$。",
      ),
      generate(rng) {
        const cs = rng.sample(colors, rng.int(3, 4));
        const f = cs.map(() => rng.int(3, 30));
        const total = sum(f);
        const two = rng.bool(0.4);
        const picked = two ? sorted(rng.sample(range(0, cs.length - 1), 2)) : [rng.int(0, cs.length - 1)];
        const k = sum(picked.map((i) => f[i]!));
        const name = (lang: 0 | 1) => picked.map((i) => cs[i]![lang]).join(lang === 0 ? " or " : "或");
        const table = (lang: 0 | 1) =>
          `| ${lang === 0 ? "Color" : "颜色"} | ${cs.map((c) => c[lang]).join(" | ")} |\n| :--- |${cs.map(() => " :--- |").join("")}\n| ${lang === 0 ? "Frequency" : "频数"} | ${f.map((x) => `$${x}$`).join(" | ")} |`;
        return probProblem(
          t(
            `A spinner was spun many times with these results:\n\n${table(0)}\n\nWhat is the experimental probability that the spinner lands on ${name(0)}?`,
            `转动一个转盘多次，结果如下：\n\n${table(1)}\n\n转盘停在${name(1)}色的试验概率是多少？`,
          ),
          Q.of(k, total),
          t(
            `There were $${f.join(" + ")} = ${total}$ spins, and ${name(0)} came up $${k}$ times:${steps(`P = ${ratio(k, total)}`)}`,
            `共转了 $${f.join(" + ")} = ${total}$ 次，${name(1)}色出现 $${k}$ 次：${steps(`P = ${ratio(k, total)}`)}`,
          ),
          [Q.of(k, total - k), Q.of(1, cs.length), Q.of(picked.length, cs.length), ...(two ? [Q.of(f[picked[0]!]!, total)] : [])],
        );
      },
    },
  ],
};

/** usingExperimentalProbabilityToMakePredictions is outline topic 6.16.3. */
export const usingExperimentalProbabilityToMakePredictions: TopicDef = {
  id: "using-experimental-probability-to-make-predictions",
  title: t("Using Experimental Probability to Make Predictions", "用试验概率进行预测"),
  summary: t(
    "Predict how often an outcome will occur in future trials from its experimental probability.",
    "由试验概率预测结果在今后试验中出现的次数。",
  ),
  prerequisites: ["experimental-probability", "proportions", "percent-of-a-number"],
  encompasses: [
    { topic: "experimental-probability", weight: 0.5 },
    { topic: "proportions", weight: 0.3 },
    { topic: "percent-of-a-number", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.7.SP.C.6"],
  knowledgePoints: [
    {
      id: "predicting-from-trials",
      title: t("Predicting from earlier trials", "由已有试验预测"),
      explanation: t(
        "To predict how many times an outcome will happen in a number of future trials, multiply its experimental probability by the number of trials:\n\n$$\\text{predicted count} = P(\\text{outcome}) \\times \\text{number of trials}$$\n\nA player made $18$ of $24$ shots. In $40$ shots she can expect to make about $\\frac{18}{24} \\times 40 = \\frac{3}{4} \\times 40 = 30$.",
        "要预测某个结果在今后若干次试验中出现几次，用它的试验概率乘以试验次数：\n\n$$\\text{预测次数} = P(\\text{结果}) \\times \\text{试验次数}$$\n\n一名球员 $24$ 次投篮投中 $18$ 次。投 $40$ 次，预计投中约 $\\frac{18}{24} \\times 40 = \\frac{3}{4} \\times 40 = 30$ 次。",
      ),
      generate(rng) {
        const tr = rng.pick(trials);
        for (;;) {
          const n = rng.pick([20, 24, 25, 30, 40, 50, 60, 80, 100]);
          const k = rng.int(1, n - 1);
          const p = Q.of(k, n);
          const m = Number(p.d) * rng.int(2, 30);
          if (m === n || m > 2000) continue;
          const answer = p.mul(Q.of(m));
          return numberProblem({
            prompt: t(
              `${tr.en(n, k)} Based on these results, in how many of the next ${m} trials can you expect that ${tr.event.en}?`,
              `${tr.zh(n, k)}根据这些结果，在接下来的 ${m} 次中，预计有多少次${tr.event["zh-CN"]}？`,
            ),
            answer,
            form: "integer",
            wrong: [Q.of(n - k, n).mul(Q.of(m)), k, Q.of(m - k), k + m - n],
            solution: t(
              `The experimental probability is $${ratio(k, n)}$:${steps(`${p.toLatex()} \\times ${m} = ${answer.toLatex()}`)}`,
              `试验概率是 $${ratio(k, n)}$：${steps(`${p.toLatex()} \\times ${m} = ${answer.toLatex()}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "predicting-from-a-sample",
      title: t("Predicting from a sample", "由样本预测"),
      explanation: t(
        "A random **sample** of a population gives an experimental probability for the whole population. Multiply it by the size of the population, whether it is given as a fraction or a percent.\n\nIn a random sample of $50$ students, $12$ walk to school. Of the $900$ students in the school, about $\\frac{12}{50} \\times 900 = 216$ walk. If instead $8\\%$ of a sample are left-handed, about $0.08 \\times 900 = 72$ of the $900$ are.",
        "从总体中随机抽取的**样本**给出了整个总体的试验概率。用它乘以总体的数量，无论它是分数还是百分数。\n\n随机抽取 $50$ 名学生，其中 $12$ 名步行上学。全校 $900$ 名学生中，约 $\\frac{12}{50} \\times 900 = 216$ 名步行上学。如果样本中 $8\\%$ 是左撇子，那么 $900$ 人中约有 $0.08 \\times 900 = 72$ 人是左撇子。",
      ),
      generate(rng) {
        const [en, zh, popEn, popZh] = rng.pick([
          ["prefer online classes", "更喜欢网课", "students in the district", "该区的学生"],
          ["have a library card", "有借书证", "residents of the town", "镇上的居民"],
          ["ride a bike to work", "骑车上班", "employees of the company", "公司的员工"],
          ["have been to the beach this year", "今年去过海滩", "people in the city", "城里的人"],
        ] as const);
        if (rng.bool()) {
          const pct = rng.pick([2, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]);
          const pop = rng.pick([200, 300, 400, 500, 600, 800, 1200, 1500, 2000, 2500, 4000]);
          const answer = Q.of(pct * pop, 100);
          return numberProblem({
            prompt: t(
              `In a random sample, $${pct}\\%$ of the people asked ${en}. Predict how many of the ${pop} ${popEn} ${en}.`,
              `随机抽样调查中，$${pct}\\%$ 的受访者${zh}。预测 ${pop} 名${popZh}中有多少人${zh}。`,
            ),
            answer,
            form: "integer",
            wrong: [Q.of(pop * (100 - pct), 100), pct, Q.of(pop, pct)],
            solution: t(
              `Take $${pct}\\%$ of ${pop}:${steps(`${dec(Q.of(pct, 100))} \\times ${pop} = ${answer.toLatex()}`)}`,
              `求 ${pop} 的 $${pct}\\%$：${steps(`${dec(Q.of(pct, 100))} \\times ${pop} = ${answer.toLatex()}`)}`,
            ),
          });
        }
        for (;;) {
          const n = rng.pick([20, 25, 30, 40, 50, 60, 80]);
          const k = rng.int(2, n - 2);
          const p = Q.of(k, n);
          const pop = Number(p.d) * rng.int(5, 60);
          if (pop <= n) continue;
          const answer = p.mul(Q.of(pop));
          return numberProblem({
            prompt: t(
              `In a random sample of ${n} ${popEn}, ${k} ${en}. Predict how many of all ${pop} ${popEn} ${en}.`,
              `随机抽取 ${n} 名${popZh}，其中 ${k} 人${zh}。预测全部 ${pop} 名${popZh}中有多少人${zh}。`,
            ),
            answer,
            form: "integer",
            wrong: [Q.of(n - k, n).mul(Q.of(pop)), k, pop - n + k],
            solution: t(
              `The sample gives the probability $${ratio(k, n)}$:${steps(`${p.toLatex()} \\times ${pop} = ${answer.toLatex()}`)}`,
              `样本给出的概率是 $${ratio(k, n)}$：${steps(`${p.toLatex()} \\times ${pop} = ${answer.toLatex()}`)}`,
            ),
          });
        }
      },
    },
  ],
};

/** Experiment is a simple experiment with equally likely outcomes. */
interface Experiment {
  readonly en: string;
  readonly zh: string;
  readonly size: number;
}

const experiments: readonly Experiment[] = [
  { en: "flipping a coin", zh: "抛一枚硬币", size: 2 },
  { en: "rolling a six-sided die", zh: "掷一枚六面骰子", size: 6 },
  { en: "spinning a spinner with 3 equal sections", zh: "转动一个有 3 个相等扇区的转盘", size: 3 },
  { en: "spinning a spinner with 4 equal sections", zh: "转动一个有 4 个相等扇区的转盘", size: 4 },
  { en: "spinning a spinner with 5 equal sections", zh: "转动一个有 5 个相等扇区的转盘", size: 5 },
  { en: "rolling an eight-sided die", zh: "掷一枚八面骰子", size: 8 },
  { en: "choosing a day of the week", zh: "选一周中的一天", size: 7 },
  { en: "choosing one of the letters A, B and C", zh: "从字母 A、B、C 中选一个", size: 3 },
];

/** diceSum counts the outcomes of two six-sided dice with sum s. */
const diceSum = (s: number) => Math.max(0, 6 - Math.abs(s - 7));

/** sampleSpacesAndEventsInProbability is outline topic 6.16.4. */
export const sampleSpacesAndEventsInProbability: TopicDef = {
  id: "sample-spaces-and-events-in-probability",
  title: t("Sample Spaces and Events in Probability", "样本空间与事件"),
  summary: t(
    "Describe the sample space of an experiment, list the outcomes of an event, and count outcomes of combined experiments.",
    "描述试验的样本空间，列出事件包含的结果，并计算组合试验的结果数。",
  ),
  prerequisites: ["sets"],
  encompasses: [{ topic: "sets", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.7.SP.C.8.B", "CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "listing-an-event",
      title: t("Listing the outcomes of an event", "列出事件的结果"),
      explanation: t(
        'The **sample space** $S$ of an experiment is the set of all its possible outcomes. Rolling a die has $S = \\{1, 2, 3, 4, 5, 6\\}$. An **event** is a subset of the sample space: the outcomes for which something happens.\n\nRolling a die, the event "the number is greater than $4$" is $\\{5, 6\\}$, and the event "the number is at most $2$" is $\\{1, 2\\}$: "at most" includes $2$, "greater than" excludes $4$.',
        "试验所有可能结果组成的集合叫**样本空间** $S$。掷一枚骰子，$S = \\{1, 2, 3, 4, 5, 6\\}$。**事件**是样本空间的子集：使某件事发生的那些结果。\n\n掷骰子时，事件“点数大于 $4$”是 $\\{5, 6\\}$，事件“点数不大于 $2$”是 $\\{1, 2\\}$：“不大于”包含 $2$，“大于”不包含 $4$。",
      ),
      generate(rng) {
        const n = rng.pick([6, 8, 10, 12, 15, 20]);
        for (;;) {
          const e = numberEvent(rng, n);
          const s = range(1, n);
          const ev = s.filter(e.test);
          if (ev.length === 0 || ev.length === n) continue;
          const what =
            n === 6
              ? t("A six-sided die is rolled", "掷一枚六面骰子")
              : t(`A card is drawn from ${n} cards numbered 1 to ${n}`, `从编号 1 到 ${n} 的 ${n} 张卡片中抽一张`);
          return setProblem({
            prompt: t(
              `${what.en}. List the outcomes in the event that the number is ${e.en}.${SET_EN}`,
              `${what["zh-CN"]}。列出事件“这个数${e.zh}”包含的结果。${SET_ZH}`,
            ),
            values: ev,
            wrong: [s.filter(e.loose), s.filter((x) => !e.test(x))],
            solution: t(
              `The sample space is $\\{1, 2, \\ldots, ${n}\\}$. The outcomes that are ${e.en} are${steps(setTex(ev))}`,
              `样本空间是 $\\{1, 2, \\ldots, ${n}\\}$。其中${e.zh}的结果是${steps(setTex(ev))}`,
            ),
          });
        }
      },
    },
    {
      id: "counting-outcomes-of-combined-experiments",
      title: t("Counting outcomes of combined experiments", "组合试验的结果数"),
      explanation: t(
        "When two experiments are done together, each outcome of the first pairs with each outcome of the second, so the sizes of the sample spaces **multiply**. Flipping a coin and rolling a die has $2 \\times 6 = 12$ outcomes: $(H, 1), (H, 2), \\ldots, (T, 6)$. With three experiments, multiply all three sizes.",
        "两个试验一起做时，第一个试验的每个结果都与第二个试验的每个结果配对，所以样本空间的大小**相乘**。抛一枚硬币并掷一枚骰子共有 $2 \\times 6 = 12$ 个结果：$(H, 1), (H, 2), \\ldots, (T, 6)$。三个试验就把三个大小相乘。",
      ),
      generate(rng) {
        const es = rng.sample(experiments, rng.int(2, 3));
        const sizes = es.map((e) => e.size);
        const product = sizes.reduce((p, x) => p * x, 1);
        return numberProblem({
          prompt: t(
            `How many outcomes are in the sample space of ${es.map((e) => e.en).join(" and ")}?`,
            `${es.map((e) => e.zh).join("并")}，样本空间中有多少个结果？`,
          ),
          answer: product,
          form: "integer",
          wrong: [sum(sizes), product - 1, sizes.length === 3 ? sizes[0]! * sizes[1]! : 2 * sum(sizes)],
          solution: t(
            `The experiments have ${sizes.join(", ")} outcomes. Each combination is one outcome:${steps(`${sizes.join(" \\times ")} = ${product}`)}`,
            `各试验分别有 ${sizes.join("、")} 个结果。每种组合是一个结果：${steps(`${sizes.join(" \\times ")} = ${product}`)}`,
          ),
        });
      },
    },
    {
      id: "outcomes-with-two-dice",
      title: t("Outcomes with two dice", "两枚骰子的结果"),
      explanation: t(
        "Rolling two dice has $6 \\times 6 = 36$ outcomes, the ordered pairs (first die, second die). Count an event by listing its pairs: a sum of $5$ comes from $(1, 4), (2, 3), (3, 2), (4, 1)$, which is $4$ outcomes. $(1, 4)$ and $(4, 1)$ are different outcomes, since the dice are different.",
        "掷两枚骰子有 $6 \\times 6 = 36$ 个结果，即有序数对（第一枚，第二枚）。列出事件中的数对来计数：点数和为 $5$ 的有 $(1, 4), (2, 3), (3, 2), (4, 1)$，共 $4$ 个结果。$(1, 4)$ 与 $(4, 1)$ 是不同的结果，因为两枚骰子不同。",
      ),
      generate(rng) {
        const kind = rng.pick(["sum", "atLeast", "atMost", "product", "doubles"] as const);
        if (kind === "product") {
          const v = rng.pick([4, 6, 8, 12, 18, 24]);
          const pairs = range(1, 6)
            .filter((a) => v % a === 0 && v / a <= 6)
            .map((a) => `(${a}, ${v / a})`);
          return numberProblem({
            prompt: t(
              `Two six-sided dice are rolled. How many outcomes have a product of ${v}?`,
              `掷两枚六面骰子。点数积为 ${v} 的结果有多少个？`,
            ),
            answer: pairs.length,
            form: "integer",
            wrong: [Math.ceil(pairs.length / 2), pairs.length + 1],
            solution: t(
              `List the ordered pairs:${steps(pairs.join(", "))}There are $${pairs.length}$.`,
              `列出有序数对：${steps(pairs.join(", "))}共 $${pairs.length}$ 个。`,
            ),
          });
        }
        if (kind === "doubles") {
          const d = rng.int(1, 5);
          const pairs = range(1, 6).flatMap((a) =>
            range(1, 6)
              .filter((b) => Math.abs(a - b) === d)
              .map((b) => `(${a}, ${b})`),
          );
          return numberProblem({
            prompt: t(
              `Two six-sided dice are rolled. How many outcomes have numbers that differ by ${d}?`,
              `掷两枚六面骰子。两个点数相差 ${d} 的结果有多少个？`,
            ),
            answer: pairs.length,
            form: "integer",
            wrong: [pairs.length / 2, 6 - d],
            solution: t(
              `List the ordered pairs:${steps(pairs.join(", "))}There are $${pairs.length}$.`,
              `列出有序数对：${steps(pairs.join(", "))}共 $${pairs.length}$ 个。`,
            ),
          });
        }
        const s = kind === "sum" ? rng.int(3, 11) : kind === "atLeast" ? rng.int(8, 11) : rng.int(3, 6);
        const sums = kind === "sum" ? [s] : kind === "atLeast" ? range(s, 12) : range(2, s);
        const n = sum(sums.map(diceSum));
        const pairs = sums.flatMap((v) =>
          range(1, 6)
            .filter((a) => v - a >= 1 && v - a <= 6)
            .map((a) => `(${a}, ${v - a})`),
        );
        const unordered = sum(sums.map((v) => Math.ceil(diceSum(v) / 2)));
        return numberProblem({
          prompt:
            kind === "sum"
              ? t(`Two six-sided dice are rolled. How many outcomes have a sum of ${s}?`, `掷两枚六面骰子。点数和为 ${s} 的结果有多少个？`)
              : kind === "atLeast"
                ? t(
                    `Two six-sided dice are rolled. How many outcomes have a sum of at least ${s}?`,
                    `掷两枚六面骰子。点数和不小于 ${s} 的结果有多少个？`,
                  )
                : t(
                    `Two six-sided dice are rolled. How many outcomes have a sum of at most ${s}?`,
                    `掷两枚六面骰子。点数和不大于 ${s} 的结果有多少个？`,
                  ),
          answer: n,
          form: "integer",
          wrong: [unordered, sums.length, kind === "sum" ? s - 1 : n - diceSum(s)],
          solution: t(
            `List the ordered pairs:${steps(pairs.join(", "))}There are $${n}$.`,
            `列出有序数对：${steps(pairs.join(", "))}共 $${n}$ 个。`,
          ),
        });
      },
    },
  ],
};

const likelihoods: readonly Text[] = [
  t("Impossible", "不可能"),
  t("Unlikely", "不太可能"),
  t("As likely as not", "可能性各半"),
  t("Likely", "很可能"),
  t("Certain", "必然"),
];

/** likelihoodOf classifies a probability: 0 impossible, 1 unlikely, 2 as likely as not, 3 likely, 4 certain. */
function likelihoodOf(p: Q): number {
  if (p.isZero()) return 0;
  if (p.eq(Q.one)) return 4;
  const c = p.cmp(Q.of(1, 2));
  return c < 0 ? 1 : c === 0 ? 2 : 3;
}

const likelihoodScale: Text = t(
  "$0$ means impossible, values below $\\frac{1}{2}$ unlikely, exactly $\\frac{1}{2}$ as likely as not, values above $\\frac{1}{2}$ likely, and $1$ certain.",
  "$0$ 表示不可能，小于 $\\frac{1}{2}$ 表示不太可能，恰为 $\\frac{1}{2}$ 表示可能性各半，大于 $\\frac{1}{2}$ 表示很可能，$1$ 表示必然。",
);

/** theLikelihoodOfAnEvent is outline topic 6.16.5. */
export const theLikelihoodOfAnEvent: TopicDef = {
  id: "the-likelihood-of-an-event",
  title: t("The Likelihood of an Event", "事件的可能性"),
  summary: t(
    "Describe how likely an event is from its probability on the scale from 0 to 1.",
    "根据 0 到 1 之间的概率描述事件发生的可能性。",
  ),
  prerequisites: ["sample-spaces-and-events-in-probability", "percents"],
  encompasses: [{ topic: "percents", weight: 0.1 }],
  xp: 8,
  standards: ["CCSS.7.SP.C.5"],
  knowledgePoints: [
    {
      id: "the-probability-scale",
      title: t("The probability scale", "概率刻度"),
      explanation: t(
        "A probability is a number from $0$ to $1$, written as a fraction, a decimal or a percent. The larger it is, the more likely the event:\n\n| Probability | Likelihood |\n| :--- | :--- |\n| $0$ | impossible |\n| between $0$ and $\\frac{1}{2}$ | unlikely |\n| $\\frac{1}{2}$ | as likely as not |\n| between $\\frac{1}{2}$ and $1$ | likely |\n| $1$ | certain |\n\nA probability of $0.35$ is below $0.5$, so the event is unlikely; $\\frac{5}{8} > \\frac{4}{8}$, so an event of probability $\\frac{5}{8}$ is likely.",
        "概率是 $0$ 到 $1$ 之间的数，可写成分数、小数或百分数。概率越大，事件越可能发生：\n\n| 概率 | 可能性 |\n| :--- | :--- |\n| $0$ | 不可能 |\n| $0$ 与 $\\frac{1}{2}$ 之间 | 不太可能 |\n| $\\frac{1}{2}$ | 可能性各半 |\n| $\\frac{1}{2}$ 与 $1$ 之间 | 很可能 |\n| $1$ | 必然 |\n\n概率 $0.35$ 小于 $0.5$，所以事件不太可能发生；$\\frac{5}{8} > \\frac{4}{8}$，所以概率为 $\\frac{5}{8}$ 的事件很可能发生。",
      ),
      generate(rng) {
        const cat = rng.pick([0, 1, 1, 2, 3, 3, 4]);
        const style = rng.pick(["fraction", "decimal", "percent"] as const);
        let p: Q;
        if (cat === 0) p = Q.zero;
        else if (cat === 4) p = Q.one;
        else if (cat === 2) p = Q.of(1, 2);
        else {
          const d = style === "fraction" ? rng.int(3, 20) : 100;
          const lo = cat === 1 ? 1 : Math.floor(d / 2) + 1;
          const hi = cat === 1 ? Math.ceil(d / 2) - 1 : d - 1;
          p = Q.of(rng.int(lo, hi), d);
        }
        const shown =
          style === "percent" ? `${p.mul(Q.of(100)).toLatex()}\\%` : style === "decimal" && !p.isInteger() ? dec(p) : p.toLatex();
        const fair = cat === 2 && style === "fraction" ? `\\frac{${rng.int(2, 9)}}{}` : "";
        const value = fair ? `\\frac{${fair.slice(6, -3)}}{${2 * Number(fair.slice(6, -3))}}` : shown;
        return choiceProblem({
          prompt: t(
            `The probability of an event is $${value}$. How likely is the event?`,
            `某事件的概率是 $${value}$。这个事件发生的可能性如何？`,
          ),
          options: likelihoods,
          correct: cat,
          solution: t(
            `${likelihoodScale.en} So the event is: ${likelihoods[cat]!.en.toLowerCase()}.`,
            `${likelihoodScale["zh-CN"]}所以这个事件：${likelihoods[cat]!["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "likelihood-from-outcomes",
      title: t("Likelihood from the outcomes", "由结果判断可能性"),
      explanation: t(
        "When all outcomes are equally likely, compare the number of outcomes in the event with the total. An event with no outcomes is impossible; one containing every outcome is certain. Otherwise it is likely when it holds more than half of the outcomes, unlikely when fewer than half, and as likely as not when exactly half.\n\nA bag holds $7$ red and $5$ blue marbles. Drawing red is likely, since $7$ is more than half of $12$; drawing green is impossible; drawing red or blue is certain.",
        "当所有结果等可能时，比较事件包含的结果数与结果总数。不含任何结果的事件不可能发生；包含所有结果的事件必然发生。否则，包含的结果多于一半时很可能，少于一半时不太可能，恰好一半时可能性各半。\n\n袋中有 $7$ 个红球和 $5$ 个蓝球。摸到红球很可能，因为 $7$ 超过 $12$ 的一半；摸到绿球不可能；摸到红球或蓝球是必然的。",
      ),
      generate(rng) {
        const cat = rng.int(0, 4);
        const cs = rng.sample(colors, 3);
        const counts = [rng.int(1, 12), rng.int(1, 12), rng.int(1, 12)];
        let event: Text;
        let inBag: number[];
        let k: number;
        if (cat === 0) {
          inBag = [0, 1];
          k = 0;
          event = t(`a ${cs[2]![0]} marble`, `${cs[2]![1]}球`);
        } else if (cat === 4) {
          inBag = [0, 1];
          k = counts[0]! + counts[1]!;
          event = t(`a ${cs[0]![0]} or a ${cs[1]![0]} marble`, `${cs[0]![1]}球或${cs[1]![1]}球`);
        } else {
          inBag = [0, 1, 2];
          const others = counts[1]! + counts[2]!;
          counts[0] = cat === 1 ? rng.int(1, others - 1 || 1) : cat === 2 ? others : others + rng.int(1, 8);
          if (cat === 1 && others < 2) counts[1] = counts[1]! + 2;
          k = counts[0];
          event = t(`a ${cs[0]![0]} marble`, `${cs[0]![1]}球`);
        }
        const total = sum(inBag.map((i) => counts[i]!));
        const bag = (lang: 0 | 1) =>
          inBag.map((i) => (lang === 0 ? `${counts[i]} ${cs[i]![0]}` : `${counts[i]} 个${cs[i]![1]}球`)).join(lang === 0 ? ", " : "、");
        const p = Q.of(k, total);
        return choiceProblem({
          prompt: t(
            `A bag holds ${bag(0)} marbles. One marble is drawn at random. How likely is it to be ${event.en}?`,
            `袋中有${bag(1)}。随机摸出一个球，摸到${event["zh-CN"]}的可能性如何？`,
          ),
          options: likelihoods,
          correct: likelihoodOf(p),
          solution: t(
            `${k} of the ${total} marbles are ${event.en.replace(/^an? /, "").replace(/ marble$/, "")}, so the probability is $${ratio(k, total)}$. ${likelihoodScale.en}`,
            `${total} 个球中有 ${k} 个是${event["zh-CN"]}，概率为 $${ratio(k, total)}$。${likelihoodScale["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** singleEventsInProbability is outline topic 6.16.6. */
export const singleEventsInProbability: TopicDef = {
  id: "single-events-in-probability",
  title: t("Single Events in Probability", "单个事件的概率"),
  summary: t(
    "Compute the probability of an event whose outcomes are equally likely as favorable outcomes over all outcomes.",
    "对等可能的结果，用有利结果数除以结果总数求事件的概率。",
  ),
  prerequisites: ["the-likelihood-of-an-event"],
  encompasses: [
    { topic: "the-likelihood-of-an-event", weight: 0.3 },
    { topic: "sample-spaces-and-events-in-probability", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.7.SP.C.7.A"],
  knowledgePoints: [
    {
      id: "drawing-from-a-bag",
      title: t("Drawing from a bag", "从袋中摸球"),
      explanation: t(
        "When all outcomes are **equally likely**, the probability of an event $E$ is\n\n$$P(E) = \\frac{\\text{number of outcomes in } E}{\\text{total number of outcomes}}$$\n\nA bag holds $3$ red, $5$ blue and $4$ green marbles, $12$ in all. Each marble is equally likely to be drawn, so $P(\\text{blue}) = \\frac{5}{12}$ and $P(\\text{green}) = \\frac{4}{12} = \\frac{1}{3}$. Divide by the **total**, not by the number of other marbles.",
        "当所有结果**等可能**时，事件 $E$ 的概率是\n\n$$P(E) = \\frac{E \\text{ 包含的结果数}}{\\text{结果总数}}$$\n\n袋中有 $3$ 个红球、$5$ 个蓝球、$4$ 个绿球，共 $12$ 个。每个球被摸到的可能性相同，所以 $P(\\text{蓝}) = \\frac{5}{12}$，$P(\\text{绿}) = \\frac{4}{12} = \\frac{1}{3}$。分母是**总数**，而不是其他球的个数。",
      ),
      generate(rng) {
        const cs = rng.sample(colors, rng.int(2, 4));
        const f = cs.map(() => rng.int(1, 15));
        const i = rng.int(0, cs.length - 1);
        const total = sum(f);
        const k = f[i]!;
        const bag = (lang: 0 | 1) =>
          cs.map((c, j) => (lang === 0 ? `${f[j]} ${c[0]}` : `${f[j]} 个${c[1]}球`)).join(lang === 0 ? ", " : "、");
        return probProblem(
          t(
            `A bag holds ${bag(0)} marbles. One marble is drawn at random. What is the probability that it is ${cs[i]![0]}?`,
            `袋中有${bag(1)}。随机摸出一个球，摸到${cs[i]![1]}球的概率是多少？`,
          ),
          Q.of(k, total),
          t(
            `There are $${f.join(" + ")} = ${total}$ marbles, and $${k}$ are ${cs[i]![0]}:${steps(`P(\\text{${cs[i]![0]}}) = ${ratio(k, total)}`)}`,
            `共有 $${f.join(" + ")} = ${total}$ 个球，其中 $${k}$ 个是${cs[i]![1]}球：${steps(`P = ${ratio(k, total)}`)}`,
          ),
          [Q.of(k, total - k), Q.of(1, cs.length), Q.of(1, total), Q.of(k, 10)],
        );
      },
    },
    {
      id: "numbered-cards",
      title: t("Numbered cards", "编号卡片"),
      explanation: t(
        "To find a probability, list or count the outcomes in the event, then divide by the number of outcomes.\n\nA card is drawn from $20$ cards numbered $1$ to $20$. The multiples of $3$ are $3, 6, 9, 12, 15, 18$, so $P(\\text{multiple of } 3) = \\frac{6}{20} = \\frac{3}{10}$.",
        "求概率时，先列出或数出事件包含的结果，再除以结果总数。\n\n从编号 $1$ 到 $20$ 的 $20$ 张卡片中抽一张。$3$ 的倍数有 $3, 6, 9, 12, 15, 18$，所以 $P(3 \\text{ 的倍数}) = \\frac{6}{20} = \\frac{3}{10}$。",
      ),
      generate(rng) {
        const n = rng.int(10, 30);
        for (;;) {
          const e = numberEvent(rng, n);
          const s = range(1, n);
          const ev = s.filter(e.test);
          if (ev.length === 0 || ev.length === n) continue;
          return probProblem(
            t(
              `A card is drawn at random from ${n} cards numbered 1 to ${n}. What is the probability that the number is ${e.en}?`,
              `从编号 1 到 ${n} 的 ${n} 张卡片中随机抽一张。这个数${e.zh}的概率是多少？`,
            ),
            Q.of(ev.length, n),
            t(
              `The outcomes that are ${e.en} are $${ev.join(", ")}$: ${ev.length} of the ${n} cards.${steps(`P = ${ratio(ev.length, n)}`)}`,
              `${e.zh}的结果有 $${ev.join(", ")}$，${n} 张中有 ${ev.length} 张。${steps(`P = ${ratio(ev.length, n)}`)}`,
            ),
            [Q.of(s.filter(e.loose).length, n), Q.of(n - ev.length, n), Q.of(ev.length, n - ev.length)],
          );
        }
      },
    },
    {
      id: "sums-of-two-dice",
      title: t("Sums of two dice", "两枚骰子的点数和"),
      explanation: t(
        "Two dice have $36$ equally likely outcomes. The sums $2$ to $12$ are **not** equally likely: count the ordered pairs that give each sum. A sum of $9$ comes from $(3, 6), (4, 5), (5, 4), (6, 3)$, so\n\n$$P(\\text{sum} = 9) = \\frac{4}{36} = \\frac{1}{9}$$",
        "两枚骰子有 $36$ 个等可能的结果。点数和 $2$ 到 $12$ **并不**等可能：要数出得到每个和的有序数对。和为 $9$ 的有 $(3, 6), (4, 5), (5, 4), (6, 3)$，所以\n\n$$P(\\text{和} = 9) = \\frac{4}{36} = \\frac{1}{9}$$",
      ),
      generate(rng) {
        const kind = rng.pick(["sum", "sum", "atMost", "atLeast", "not"] as const);
        const s = kind === "atMost" ? rng.int(3, 6) : kind === "atLeast" ? rng.int(8, 12) : rng.int(2, 12);
        const sums =
          kind === "atMost" ? range(2, s) : kind === "atLeast" ? range(s, 12) : kind === "not" ? range(2, 12).filter((v) => v !== s) : [s];
        const n = sum(sums.map(diceSum));
        const event = {
          sum: t(`the sum is ${s}`, `点数和为 ${s}`),
          atMost: t(`the sum is at most ${s}`, `点数和不大于 ${s}`),
          atLeast: t(`the sum is at least ${s}`, `点数和不小于 ${s}`),
          not: t(`the sum is not ${s}`, `点数和不为 ${s}`),
        }[kind];
        return probProblem(
          t(`Two six-sided dice are rolled. What is the probability that ${event.en}?`, `掷两枚六面骰子。${event["zh-CN"]}的概率是多少？`),
          Q.of(n, 36),
          t(
            `Of the $36$ ordered pairs, $${n}$ give a result where ${event.en}:${steps(`P = ${ratio(n, 36)}`)}`,
            `$36$ 个有序数对中，有 $${n}$ 个${event["zh-CN"]}：${steps(`P = ${ratio(n, 36)}`)}`,
          ),
          [Q.of(1, 11), Q.of(sums.length, 11), Q.of(n, 12), Q.of(sum(sums.map((v) => Math.ceil(diceSum(v) / 2))), 21)],
        );
      },
    },
  ],
};

/** usingProbabilityToMakePredictions is outline topic 6.16.7. */
export const usingProbabilityToMakePredictions: TopicDef = {
  id: "using-probability-to-make-predictions",
  title: t("Using Probability to Make Predictions", "用概率进行预测"),
  summary: t(
    "Predict how often an event will occur in repeated trials from its theoretical probability.",
    "由理论概率预测事件在重复试验中发生的次数。",
  ),
  prerequisites: ["single-events-in-probability", "using-experimental-probability-to-make-predictions"],
  encompasses: [
    { topic: "single-events-in-probability", weight: 0.5 },
    { topic: "using-experimental-probability-to-make-predictions", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.7.SP.C.6", "CCSS.7.SP.C.7.A"],
  knowledgePoints: [
    {
      id: "expected-number-of-times",
      title: t("The expected number of times", "预期次数"),
      explanation: t(
        "If an event has probability $P$, in $n$ trials we expect it about $P \\times n$ times.\n\nA die is rolled $90$ times. A number greater than $4$ has probability $\\frac{2}{6} = \\frac{1}{3}$, so we expect it about $\\frac{1}{3} \\times 90 = 30$ times. The real count will vary, but stays close to this on average.",
        "如果事件的概率是 $P$，那么在 $n$ 次试验中，预计它发生约 $P \\times n$ 次。\n\n掷骰子 $90$ 次。点数大于 $4$ 的概率是 $\\frac{2}{6} = \\frac{1}{3}$，所以预计约出现 $\\frac{1}{3} \\times 90 = 30$ 次。实际次数会有波动，但平均而言接近这个数。",
      ),
      generate(rng) {
        for (;;) {
          const useDie = rng.bool();
          const n = useDie ? 6 : rng.pick([8, 10, 12, 20]);
          const e = numberEvent(rng, n);
          const ev = range(1, n).filter(e.test);
          if (ev.length === 0 || ev.length === n) continue;
          const p = Q.of(ev.length, n);
          const trialsN = Number(p.d) * rng.int(3, 40);
          const answer = p.mul(Q.of(trialsN));
          const what = useDie
            ? t(`A fair six-sided die is rolled ${trialsN} times`, `一枚均匀的六面骰子掷 ${trialsN} 次`)
            : t(
                `A card is drawn from ${n} cards numbered 1 to ${n} and put back, ${trialsN} times`,
                `从编号 1 到 ${n} 的 ${n} 张卡片中有放回地抽卡 ${trialsN} 次`,
              );
          return numberProblem({
            prompt: t(
              `${what.en}. How many times can you expect the number to be ${e.en}?`,
              `${what["zh-CN"]}。预计这个数${e.zh}的次数是多少？`,
            ),
            answer,
            form: "integer",
            wrong: [Q.of(n - ev.length, n).mul(Q.of(trialsN)), ev.length, Q.of(trialsN, n)],
            solution: t(
              `$P = ${ratio(ev.length, n)}$, so the expected count is${steps(`${p.toLatex()} \\times ${trialsN} = ${answer.toLatex()}`)}`,
              `$P = ${ratio(ev.length, n)}$，所以预期次数是${steps(`${p.toLatex()} \\times ${trialsN} = ${answer.toLatex()}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "predictions-with-spinners-and-bags",
      title: t("Spinners and bags", "转盘与摸球"),
      explanation: t(
        "The same rule applies to spinners with equal sections and to drawing with replacement: find the probability of one trial, then multiply by the number of trials.\n\nA spinner has $8$ equal sections, $3$ of them blue. In $200$ spins we expect blue about $\\frac{3}{8} \\times 200 = 75$ times.",
        "同样的方法适用于等分转盘和有放回地摸球：先求一次试验的概率，再乘以试验次数。\n\n一个转盘有 $8$ 个相等的扇区，其中 $3$ 个是蓝色。转 $200$ 次，预计蓝色出现约 $\\frac{3}{8} \\times 200 = 75$ 次。",
      ),
      generate(rng) {
        const spinner = rng.bool();
        const [c, cz] = rng.pick(colors);
        const total = spinner ? rng.pick([4, 5, 6, 8, 10, 12]) : rng.int(5, 20);
        const k = rng.int(1, total - 1);
        const p = Q.of(k, total);
        const n = Number(p.d) * rng.int(4, 40);
        const answer = p.mul(Q.of(n));
        return numberProblem({
          prompt: spinner
            ? t(
                `A spinner has ${total} equal sections, ${k} of which are ${c}. It is spun ${n} times. How many times can you expect it to land on ${c}?`,
                `一个转盘有 ${total} 个相等的扇区，其中 ${k} 个是${cz}色。转 ${n} 次，预计停在${cz}色的次数是多少？`,
              )
            : t(
                `A bag holds ${total} marbles, ${k} of which are ${c}. A marble is drawn and put back ${n} times. How many times can you expect to draw a ${c} marble?`,
                `袋中有 ${total} 个球，其中 ${k} 个是${cz}球。有放回地摸球 ${n} 次，预计摸到${cz}球的次数是多少？`,
              ),
          answer,
          form: "integer",
          wrong: [Q.of(total - k, total).mul(Q.of(n)), Q.of(k, total - k).mul(Q.of(n)), Q.of(n, total)],
          solution: t(
            `One trial has $P = ${ratio(k, total)}$:${steps(`${p.toLatex()} \\times ${n} = ${answer.toLatex()}`)}`,
            `一次试验的概率 $P = ${ratio(k, total)}$：${steps(`${p.toLatex()} \\times ${n} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "trials-needed",
      title: t("How many trials", "需要多少次试验"),
      explanation: t(
        "Working backward, if an event of probability $P$ is expected $m$ times, the number of trials is $m \\div P$.\n\nA six on a die has probability $\\frac{1}{6}$. To expect $15$ sixes, roll about $15 \\div \\frac{1}{6} = 15 \\times 6 = 90$ times.",
        "反过来，如果概率为 $P$ 的事件预计发生 $m$ 次，那么试验次数是 $m \\div P$。\n\n骰子掷出六点的概率是 $\\frac{1}{6}$。要预计出现 $15$ 次六点，大约要掷 $15 \\div \\frac{1}{6} = 15 \\times 6 = 90$ 次。",
      ),
      generate(rng) {
        const total = rng.pick([4, 5, 6, 8, 10, 12]);
        const k = rng.int(1, total - 1);
        const p = Q.of(k, total);
        const m = Number(p.n) * rng.int(2, 25);
        const answer = Q.of(m).div(p);
        const [c, cz] = rng.pick(colors);
        return numberProblem({
          prompt: t(
            `A spinner has ${total} equal sections, ${k} of which are ${c}. About how many spins are needed to expect it to land on ${c} ${m} times?`,
            `一个转盘有 ${total} 个相等的扇区，其中 ${k} 个是${cz}色。大约要转多少次，才能预计停在${cz}色 ${m} 次？`,
          ),
          answer,
          form: "integer",
          wrong: [p.mul(Q.of(m)), m * total, m * k],
          solution: t(
            `$P = ${ratio(k, total)}$, and $P \\times n = ${m}$:${steps(`n = ${m} \\div ${p.toLatex()} = ${answer.toLatex()}`)}`,
            `$P = ${ratio(k, total)}$，且 $P \\times n = ${m}$：${steps(`n = ${m} \\div ${p.toLatex()} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** theComplementOfAnEvent is outline topic 6.16.8. */
export const theComplementOfAnEvent: TopicDef = {
  id: "the-complement-of-an-event",
  title: t("The Complement of an Event", "对立事件"),
  summary: t("Find the complement of an event and use P(A') = 1 − P(A).", "求事件的对立事件，并使用 P(A') = 1 − P(A)。"),
  prerequisites: ["single-events-in-probability"],
  encompasses: [{ topic: "single-events-in-probability", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "the-complement-as-a-set",
      title: t("The complement as a set", "对立事件的集合"),
      explanation: t(
        'The **complement** of an event $A$, written $A\'$, is the event that $A$ does **not** happen: the outcomes of the sample space $S$ that are not in $A$. Every outcome is in exactly one of $A$ and $A\'$.\n\nRolling a die, $S = \\{1, 2, 3, 4, 5, 6\\}$. If $A = \\{1, 2\\}$ is "less than $3$", then $A\' = \\{3, 4, 5, 6\\}$ is "at least $3$".',
        "事件 $A$ 的**对立事件**（补集）记作 $A'$，表示 $A$ **不**发生：样本空间 $S$ 中不在 $A$ 里的结果。每个结果恰好属于 $A$ 与 $A'$ 中的一个。\n\n掷骰子，$S = \\{1, 2, 3, 4, 5, 6\\}$。若 $A = \\{1, 2\\}$ 表示“小于 $3$”，则 $A' = \\{3, 4, 5, 6\\}$ 表示“不小于 $3$”。",
      ),
      generate(rng) {
        const n = rng.int(6, 14);
        const s = range(1, n);
        const listed = rng.bool();
        for (;;) {
          const e = numberEvent(rng, n);
          const a = listed ? unique(rng.sample(s, rng.int(2, n - 2))) : s.filter(e.test);
          if (a.length === 0 || a.length === n) continue;
          const comp = s.filter((x) => !a.includes(x));
          const def = listed
            ? t(`$A = ${setTex(a)}$`, `$A = ${setTex(a)}$`)
            : t(`$A$ is the event that the number is ${e.en}`, `事件 $A$ 表示这个数${e.zh}`);
          return setProblem({
            prompt: t(
              `A number is chosen from the sample space $S = \\{1, 2, \\ldots, ${n}\\}$, and ${def.en}. List the outcomes of $A'$.${SET_EN}`,
              `从样本空间 $S = \\{1, 2, \\ldots, ${n}\\}$ 中选一个数，${def["zh-CN"]}。列出 $A'$ 包含的结果。${SET_ZH}`,
            ),
            values: comp,
            wrong: [a, ...(listed ? [] : [s.filter((x) => !e.loose(x))])],
            solution: t(
              `${listed ? "" : `$A = ${setTex(a)}$. `}$A'$ holds every outcome of $S$ not in $A$:${steps(`A' = ${setTex(comp)}`)}`,
              `${listed ? "" : `$A = ${setTex(a)}$。`}$A'$ 由 $S$ 中不在 $A$ 里的所有结果组成：${steps(`A' = ${setTex(comp)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "probability-of-the-complement",
      title: t("The probability of the complement", "对立事件的概率"),
      explanation: t(
        "Since an event and its complement together make up every outcome, their probabilities add to $1$:\n\n$$P(A') = 1 - P(A)$$\n\nIf the probability of rain is $0.35$, the probability of no rain is $1 - 0.35 = 0.65$. If $P(A) = \\frac{3}{8}$, then $P(A') = \\frac{5}{8}$.",
        "事件与其对立事件合起来包含所有结果，所以它们的概率之和为 $1$：\n\n$$P(A') = 1 - P(A)$$\n\n下雨的概率是 $0.35$，不下雨的概率就是 $1 - 0.35 = 0.65$。若 $P(A) = \\frac{3}{8}$，则 $P(A') = \\frac{5}{8}$。",
      ),
      generate(rng) {
        const decimal = rng.bool();
        const p = decimal ? Q.of(rng.int(1, 99), 100) : Q.of(rng.int(1, 19), 20).add(Q.zero);
        const pv = decimal ? p : Q.of(rng.int(1, 11), 12).mul(Q.one);
        const [en, zh] = rng.pick([
          ["it rains tomorrow", "明天下雨"],
          ["a randomly chosen phone is faulty", "随机选的一部手机有故障"],
          ["the team wins its next game", "球队赢下一场比赛"],
          ["a randomly chosen student wears glasses", "随机选的一名学生戴眼镜"],
          ["the train is on time", "火车准点"],
        ] as const);
        const shown = decimal ? dec(pv) : pv.toLatex();
        const answer = Q.one.sub(pv);
        return probProblem(
          t(
            `The probability that ${en} is $${shown}$. What is the probability that this does not happen?`,
            `${zh}的概率是 $${shown}$。这件事不发生的概率是多少？`,
          ),
          answer,
          t(
            `The two events are complements:${steps(`P(A') = 1 - ${shown} = ${decimal ? dec(answer) : answer.toLatex()}`)}`,
            `这两个事件互为对立事件：${steps(`P(A') = 1 - ${shown} = ${decimal ? dec(answer) : answer.toLatex()}`)}`,
          ),
          [pv, Q.one.div(pv), Q.one.sub(pv).sub(Q.of(1, 10))],
        );
      },
    },
    {
      id: "complements-in-context",
      title: t("Complements in context", "实际问题中的对立事件"),
      explanation: t(
        '"Not" an outcome is the complement of that outcome. It is often quicker to find the probability of what does happen and subtract from $1$, or to count everything else.\n\nA bag holds $4$ red, $6$ blue and $5$ green marbles. $P(\\text{not blue}) = 1 - \\frac{6}{15} = \\frac{9}{15} = \\frac{3}{5}$, the same as counting the $4 + 5 = 9$ marbles that are not blue.',
        "“不是”某个结果就是这个结果的对立事件。常常先求发生的概率再用 $1$ 去减，或者直接数其余的结果，会更快。\n\n袋中有 $4$ 个红球、$6$ 个蓝球、$5$ 个绿球。$P(\\text{不是蓝球}) = 1 - \\frac{6}{15} = \\frac{9}{15} = \\frac{3}{5}$，与数出 $4 + 5 = 9$ 个非蓝球的结果相同。",
      ),
      generate(rng) {
        const cs = rng.sample(colors, rng.int(3, 4));
        const f = cs.map(() => rng.int(1, 15));
        const i = rng.int(0, cs.length - 1);
        const total = sum(f);
        const k = total - f[i]!;
        const bag = (lang: 0 | 1) =>
          cs.map((c, j) => (lang === 0 ? `${f[j]} ${c[0]}` : `${f[j]} 个${c[1]}球`)).join(lang === 0 ? ", " : "、");
        return probProblem(
          t(
            `A bag holds ${bag(0)} marbles. One marble is drawn at random. What is the probability that it is not ${cs[i]![0]}?`,
            `袋中有${bag(1)}。随机摸出一个球，摸到的不是${cs[i]![1]}球的概率是多少？`,
          ),
          Q.of(k, total),
          t(
            `$P(\\text{${cs[i]![0]}}) = \\frac{${f[i]}}{${total}}$, so${steps(`P(\\text{not ${cs[i]![0]}}) = 1 - \\frac{${f[i]}}{${total}} = ${ratio(k, total)}`)}`,
            `摸到${cs[i]![1]}球的概率是 $\\frac{${f[i]}}{${total}}$，所以${steps(`P = 1 - \\frac{${f[i]}}{${total}} = ${ratio(k, total)}`)}`,
          ),
          [Q.of(f[i]!, total), Q.of(k, f[i]!), Q.of(cs.length - 1, cs.length)],
        );
      },
    },
  ],
};

/** regionNames name the four regions of a two-set Venn diagram, in Venn2 order. */
const regionNames: readonly Text[] = [
  t("inside $A$ but outside $B$", "在 $A$ 内但在 $B$ 外"),
  t("inside both $A$ and $B$", "同时在 $A$ 和 $B$ 内"),
  t("inside $B$ but outside $A$", "在 $B$ 内但在 $A$ 外"),
  t("outside both $A$ and $B$", "在 $A$ 和 $B$ 之外"),
];

/** vennDiagramsInProbability is outline topic 6.16.9. */
export const vennDiagramsInProbability: TopicDef = {
  id: "venn-diagrams-in-probability",
  title: t("Venn Diagrams in Probability", "概率中的韦恩图"),
  summary: t(
    "Place outcomes in the regions of a Venn diagram, read counts from it, and find probabilities of single events.",
    "把结果放入韦恩图的各区域，从图中读出个数，并求单个事件的概率。",
  ),
  prerequisites: ["the-complement-of-an-event"],
  encompasses: [
    { topic: "the-complement-of-an-event", weight: 0.2 },
    { topic: "single-events-in-probability", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "placing-elements-in-a-venn-diagram",
      title: t("Placing elements in a Venn diagram", "把元素放入韦恩图"),
      explanation: t(
        "A **Venn diagram** draws the sample space (or universal set) $U$ as a rectangle and events as circles inside it. Two overlapping circles $A$ and $B$ split the rectangle into four regions: inside $A$ only, inside both, inside $B$ only, and outside both.\n\nLet $U = \\{1, 2, \\ldots, 8\\}$, $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5, 6\\}$. Then $1, 2$ go in $A$ only; $3, 4$ in both; $5, 6$ in $B$ only; and $7, 8$ outside both circles.",
        "**韦恩图**用矩形表示样本空间（全集）$U$，用其中的圆表示事件。两个相交的圆 $A$ 和 $B$ 把矩形分成四个区域：仅在 $A$ 内、同时在两者内、仅在 $B$ 内、两者之外。\n\n设 $U = \\{1, 2, \\ldots, 8\\}$，$A = \\{1, 2, 3, 4\\}$，$B = \\{3, 4, 5, 6\\}$。那么 $1, 2$ 放在仅属于 $A$ 的区域；$3, 4$ 放在两者都属于的区域；$5, 6$ 放在仅属于 $B$ 的区域；$7, 8$ 放在两圆之外。",
      ),
      figure: {
        svg: venn2Svg(["", "", "", ""]),
        alt: t("Venn diagram: a rectangle U containing two overlapping circles A and B.", "韦恩图：矩形 U 中有两个相交的圆 A 和 B。"),
      },
      generate(rng) {
        const n = rng.int(10, 16);
        const u = range(1, n);
        for (;;) {
          const a = unique(rng.sample(u, rng.int(3, 7)));
          const b = unique(rng.sample(u, rng.int(3, 7)));
          const regions = [
            a.filter((x) => !b.includes(x)),
            a.filter((x) => b.includes(x)),
            b.filter((x) => !a.includes(x)),
            u.filter((x) => !a.includes(x) && !b.includes(x)),
          ];
          if (regions.some((r) => r.length === 0)) continue;
          const r = rng.int(0, 3);
          return {
            ...setProblem({
              prompt: t(
                `Let $U = \\{1, 2, \\ldots, ${n}\\}$, $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Which elements go in the region of the Venn diagram ${regionNames[r]!.en}?${SET_EN}`,
                `设 $U = \\{1, 2, \\ldots, ${n}\\}$，$A = ${setTex(a)}$，$B = ${setTex(b)}$。韦恩图中${regionNames[r]!["zh-CN"]}的区域应放哪些元素？${SET_ZH}`,
              ),
              values: regions[r]!,
              wrong: [...regions.filter((_, i) => i !== r), r === 0 ? a : r === 2 ? b : r === 1 ? unique([...a, ...b]) : u],
              solution: t(
                `Sort each element of $U$ by whether it is in $A$ and in $B$:\n\n- $A$ only: $${setTex(regions[0]!)}$\n- both: $${setTex(regions[1]!)}$\n- $B$ only: $${setTex(regions[2]!)}$\n- neither: $${setTex(regions[3]!)}$\n\nSo the region ${regionNames[r]!.en} holds $${setTex(regions[r]!)}$.`,
                `按是否属于 $A$、是否属于 $B$ 对 $U$ 的每个元素分类：\n\n- 仅 $A$：$${setTex(regions[0]!)}$\n- 两者：$${setTex(regions[1]!)}$\n- 仅 $B$：$${setTex(regions[2]!)}$\n- 都不：$${setTex(regions[3]!)}$\n\n所以${regionNames[r]!["zh-CN"]}的区域是 $${setTex(regions[r]!)}$。`,
              ),
            }),
            figure: {
              svg: venn2Svg(["", "", "", ""]),
              alt: t("Venn diagram: a rectangle U containing two overlapping circles A and B.", "韦恩图：矩形 U 中有两个相交的圆 A 和 B。"),
            },
          };
        }
      },
    },
    {
      id: "reading-counts-from-a-venn-diagram",
      title: t("Reading counts from a Venn diagram", "从韦恩图读出个数"),
      explanation: t(
        "A Venn diagram may show **how many** elements lie in each region. The whole circle $A$ is two regions: $A$ only and the overlap. So $n(A)$ is the sum of those two numbers, and $n(U)$ is the sum of all four.\n\nWith $12$ in $A$ only, $5$ in both, $18$ in $B$ only and $7$ outside: $n(A) = 12 + 5 = 17$, $n(B) = 5 + 18 = 23$, and $n(U) = 12 + 5 + 18 + 7 = 42$.",
        "韦恩图可以标出每个区域中元素的**个数**。整个圆 $A$ 由两个区域组成：仅 $A$ 和重叠部分。所以 $n(A)$ 是这两个数之和，$n(U)$ 是四个数之和。\n\n仅 $A$ 有 $12$，两者都有 $5$，仅 $B$ 有 $18$，两者之外有 $7$：$n(A) = 12 + 5 = 17$，$n(B) = 5 + 18 = 23$，$n(U) = 12 + 5 + 18 + 7 = 42$。",
      ),
      figure: venn2Figure([12, 5, 18, 7]),
      generate(rng) {
        const c = venn2Counts(rng);
        const asked = rng.pick(["A", "B", "U", "notA"] as const);
        const [value, work] =
          asked === "A"
            ? [c[0] + c[1], `n(A) = ${c[0]} + ${c[1]} = ${c[0] + c[1]}`]
            : asked === "B"
              ? [c[1] + c[2], `n(B) = ${c[1]} + ${c[2]} = ${c[1] + c[2]}`]
              : asked === "U"
                ? [sum(c), `n(U) = ${c.join(" + ")} = ${sum(c)}`]
                : [c[2] + c[3], `n(A') = ${c[2]} + ${c[3]} = ${c[2] + c[3]}`];
        const tex = asked === "notA" ? "A'" : asked;
        return {
          ...numberProblem({
            prompt: t(
              `The Venn diagram shows the number of elements in each region. Find $n(${tex})$.`,
              `韦恩图标出了每个区域的元素个数。求 $n(${tex})$。`,
            ),
            answer: value,
            form: "integer",
            wrong: [c[0], c[2], c[0] + c[2], sum(c) - c[3], c[3]],
            solution: t(`Add the regions that make up $${tex}$:${steps(work)}`, `把组成 $${tex}$ 的区域相加：${steps(work)}`),
          }),
          figure: venn2Figure(c),
        };
      },
    },
    {
      id: "probabilities-from-a-venn-diagram",
      title: t("Probabilities from a Venn diagram", "由韦恩图求概率"),
      explanation: t(
        "When one member of $U$ is chosen at random, each is equally likely, so\n\n$$P(A) = \\frac{n(A)}{n(U)}$$\n\nIn the diagram above, $P(A) = \\frac{17}{42}$ and $P(B) = \\frac{23}{42}$. Use the total of **all** regions, including the one outside both circles, as the denominator.",
        "从 $U$ 中随机选一个成员时，每个成员被选中的可能性相同，所以\n\n$$P(A) = \\frac{n(A)}{n(U)}$$\n\n在上图中，$P(A) = \\frac{17}{42}$，$P(B) = \\frac{23}{42}$。分母是**所有**区域之和，包括两圆之外的区域。",
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const events: VennEvent[] = [
          { tex: "A", en: "the whole circle $A$", zh: "整个圆 $A$", test: (a) => a },
          { tex: "B", en: "the whole circle $B$", zh: "整个圆 $B$", test: (_, b) => b },
          { tex: "A'", en: "everything outside circle $A$", zh: "圆 $A$ 之外的全部区域", test: (a) => !a },
          { tex: "B'", en: "everything outside circle $B$", zh: "圆 $B$ 之外的全部区域", test: (_, b) => !b },
        ];
        const e = rng.pick(events);
        const n = vennCount(c, e.test);
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(${e.tex})$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(${e.tex})$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(c[0], total), Q.of(c[2], total), Q.of(n, total - c[3]), Q.of(total - n, total)],
          ),
          figure: venn2Figure(c),
        };
      },
    },
  ],
};

/** geometricProbability is outline topic 6.16.10. */
export const geometricProbability: TopicDef = {
  id: "geometric-probability",
  title: t("Geometric Probability", "几何概率"),
  summary: t(
    "Find probabilities as ratios of lengths or areas when a point is chosen at random on a segment or in a region.",
    "在线段上或区域内随机取点时，用长度或面积之比求概率。",
  ),
  prerequisites: ["single-events-in-probability", "areas-of-circles"],
  encompasses: [
    { topic: "single-events-in-probability", weight: 0.2 },
    { topic: "areas-of-circles", weight: 0.3 },
    { topic: "area-of-rectangles-and-squares", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.MG.A.3"],
  knowledgePoints: [
    {
      id: "probability-on-a-segment",
      title: t("Probability on a segment", "线段上的概率"),
      explanation: t(
        "When a point is chosen at random on a segment, every part of the same length is equally likely to contain it. So the probability that it lands in a part is\n\n$$P = \\frac{\\text{length of the part}}{\\text{length of the whole segment}}$$\n\nA point is chosen on the number line between $0$ and $20$. The probability that it lies between $6$ and $11$ is $\\frac{11 - 6}{20} = \\frac{5}{20} = \\frac{1}{4}$.",
        "在线段上随机取一点时，长度相同的各部分包含该点的可能性相同。所以点落在某一部分的概率是\n\n$$P = \\frac{\\text{这部分的长度}}{\\text{整条线段的长度}}$$\n\n在数轴上 $0$ 到 $20$ 之间随机取一点。它落在 $6$ 和 $11$ 之间的概率是 $\\frac{11 - 6}{20} = \\frac{5}{20} = \\frac{1}{4}$。",
      ),
      generate(rng) {
        const lo = rng.pick([0, 0, 0, 2, 4, 5, 10]);
        const len = rng.pick([8, 10, 12, 15, 16, 20, 24, 25, 30, 40]);
        const hi = lo + len;
        const c = rng.int(lo + 1, hi - 2);
        const d = rng.int(c + 1, hi - 1);
        const marks: Mark[] = [
          { kind: "segment", a: [lo, 0], b: [hi, 0] },
          { kind: "segment", a: [c, 0], b: [d, 0], accent: true },
          ...[lo, c, d, hi].flatMap((x): Mark[] => [
            { kind: "dot", at: [x, 0] },
            { kind: "label", at: [x, 0], text: String(x), dir: "s" },
          ]),
        ];
        return {
          ...probProblem(
            t(
              `A point is chosen at random on the number line between $${lo}$ and $${hi}$. What is the probability that it lies between $${c}$ and $${d}$?`,
              `在数轴上 $${lo}$ 与 $${hi}$ 之间随机取一点。它落在 $${c}$ 与 $${d}$ 之间的概率是多少？`,
            ),
            Q.of(d - c, len),
            t(
              `The part has length $${d} - ${c} = ${d - c}$ and the whole segment $${hi} - ${lo} = ${len}$:${steps(`P = ${ratio(d - c, len)}`)}`,
              `这部分长 $${d} - ${c} = ${d - c}$，整条线段长 $${hi} - ${lo} = ${len}$：${steps(`P = ${ratio(d - c, len)}`)}`,
            ),
            [Q.of(d - c, d), Q.of(d - c + 1, len + 1), Q.of(len - (d - c), len), ...(lo > 0 ? [Q.of(d - c, hi)] : [])],
          ),
          figure: {
            svg: sketch(marks),
            alt: t(
              `A segment of the number line from ${lo} to ${hi}, with the part from ${c} to ${d} highlighted.`,
              `数轴上从 ${lo} 到 ${hi} 的线段，其中 ${c} 到 ${d} 的部分被突出显示。`,
            ),
          },
        };
      },
    },
    {
      id: "probability-with-areas",
      title: t("Probability with areas", "面积中的概率"),
      explanation: t(
        "When a point is chosen at random in a region, such as a dart landing anywhere on a board, the probability that it lands in a part of the region is\n\n$$P = \\frac{\\text{area of the part}}{\\text{area of the whole region}}$$\n\nA board is a $10 \\times 8$ rectangle with a $4 \\times 3$ rectangle inside it. The probability that a dart landing on the board hits the small rectangle is $\\frac{12}{80} = \\frac{3}{20}$.",
        "在区域内随机取一点时（例如飞镖随机落在靶板上），点落在其中某一部分的概率是\n\n$$P = \\frac{\\text{这部分的面积}}{\\text{整个区域的面积}}$$\n\n靶板是 $10 \\times 8$ 的矩形，内有一个 $4 \\times 3$ 的矩形。落在靶板上的飞镖击中小矩形的概率是 $\\frac{12}{80} = \\frac{3}{20}$。",
      ),
      generate(rng) {
        const W = rng.int(8, 20);
        const H = rng.int(6, Math.min(14, W));
        const w = rng.int(2, W - 4);
        const h = rng.int(2, H - 4);
        const inside = rng.bool(0.7);
        const [x0, y0] = [(W - w) / 2, (H - h) / 2];
        const inner: Point[] = [
          [x0, y0],
          [x0 + w, y0],
          [x0 + w, y0 + h],
          [x0, y0 + h],
        ];
        const outer: Point[] = [
          [0, 0],
          [W, 0],
          [W, H],
          [0, H],
        ];
        const u = rng.pick(["cm", "in"]);
        const marks: Mark[] = [
          { kind: "polygon", points: outer },
          { kind: "polygon", points: inner, accent: true },
          { kind: "side", a: outer[0]!, b: outer[1]!, text: `${W} ${u}` },
          { kind: "side", a: outer[3]!, b: outer[0]!, text: `${H} ${u}` },
          { kind: "side", a: inner[0]!, b: inner[1]!, text: `${w} ${u}` },
          { kind: "side", a: inner[1]!, b: inner[2]!, text: `${h} ${u}` },
        ];
        const big = W * H;
        const small = w * h;
        const k = inside ? small : big - small;
        return {
          ...probProblem(
            inside
              ? t(
                  `A dart lands at a random point on the ${W} ${u} by ${H} ${u} board shown. What is the probability that it lands inside the highlighted ${w} ${u} by ${h} ${u} rectangle?`,
                  `飞镖随机落在图中 ${W} ${u} × ${H} ${u} 的靶板上。它落在突出显示的 ${w} ${u} × ${h} ${u} 矩形内的概率是多少？`,
                )
              : t(
                  `A dart lands at a random point on the ${W} ${u} by ${H} ${u} board shown. What is the probability that it lands outside the highlighted ${w} ${u} by ${h} ${u} rectangle?`,
                  `飞镖随机落在图中 ${W} ${u} × ${H} ${u} 的靶板上。它落在突出显示的 ${w} ${u} × ${h} ${u} 矩形外的概率是多少？`,
                ),
            Q.of(k, big),
            t(
              `The board has area $${W} \\times ${H} = ${big}$ and the small rectangle $${w} \\times ${h} = ${small}$.${inside ? "" : ` The part outside it has area $${big} - ${small} = ${k}$.`}${steps(`P = ${ratio(k, big)}`)}`,
              `靶板面积 $${W} \\times ${H} = ${big}$，小矩形面积 $${w} \\times ${h} = ${small}$。${inside ? "" : `小矩形外的面积是 $${big} - ${small} = ${k}$。`}${steps(`P = ${ratio(k, big)}`)}`,
            ),
            [Q.of(big - k, big), Q.of(w + h, W + H), Q.of(small, big - small), Q.of(w * h, 2 * (W + H))],
          ),
          figure: {
            svg: sketch(marks),
            alt: t(
              `A ${W} by ${H} rectangle with a highlighted ${w} by ${h} rectangle in its center.`,
              `一个 ${W} × ${H} 的矩形，中央有一个突出显示的 ${w} × ${h} 矩形。`,
            ),
          },
        };
      },
    },
    {
      id: "probability-with-circles",
      title: t("Probability with circles", "圆中的概率"),
      explanation: t(
        "The same ratio of areas works with circles; the answer then contains $\\pi$. A circle of radius $3$ is drawn inside a $10 \\times 8$ rectangle. A point chosen at random in the rectangle lands in the circle with probability\n\n$$\\frac{\\pi \\cdot 3^2}{10 \\times 8} = \\frac{9\\pi}{80}$$\n\nand outside it with probability $1 - \\frac{9\\pi}{80}$.",
        "面积之比同样适用于圆，此时答案含 $\\pi$。在 $10 \\times 8$ 的矩形内画一个半径为 $3$ 的圆。在矩形内随机取一点，它落在圆内的概率是\n\n$$\\frac{\\pi \\cdot 3^2}{10 \\times 8} = \\frac{9\\pi}{80}$$\n\n落在圆外的概率是 $1 - \\frac{9\\pi}{80}$。",
      ),
      generate(rng) {
        const r = rng.int(1, 6);
        const W = rng.int(2 * r, 2 * r + 8);
        const H = rng.int(2 * r, Math.max(2 * r, W));
        const inside = rng.bool(0.6);
        const p = Q.of(r * r, W * H);
        const answer = inside ? piTex(p) : `1 - ${piTex(p)}`;
        const c: Point = [W / 2, H / 2];
        const outer: Point[] = [
          [0, 0],
          [W, 0],
          [W, H],
          [0, H],
        ];
        const marks: Mark[] = [
          { kind: "polygon", points: outer },
          { ...ring(c, r), accent: true },
          { kind: "dot", at: c },
          { kind: "segment", a: c, b: [c[0] + r * 0.6, c[1] + r * 0.8] },
          { kind: "label", at: [c[0] + r * 0.3, c[1] + r * 0.4], text: String(r), dir: "w" },
          { kind: "side", a: outer[0]!, b: outer[1]!, text: String(W) },
          { kind: "side", a: outer[3]!, b: outer[0]!, text: String(H) },
        ];
        const wrongP = [Q.of(r, W * H), Q.of(2 * r, W * H), Q.of(r * r, 2 * (W + H))];
        return {
          ...expressionProblem({
            prompt: inside
              ? t(
                  `A circle of radius ${r} lies inside a ${W} by ${H} rectangle, as shown. A point is chosen at random inside the rectangle. What is the probability that it lies inside the circle? Give the exact answer in terms of $\\pi$.`,
                  `如图，半径为 ${r} 的圆位于 ${W} × ${H} 的矩形内。在矩形内随机取一点，它落在圆内的概率是多少？结果保留 $\\pi$。`,
                )
              : t(
                  `A circle of radius ${r} lies inside a ${W} by ${H} rectangle, as shown. A point is chosen at random inside the rectangle. What is the probability that it lies outside the circle? Give the exact answer in terms of $\\pi$.`,
                  `如图，半径为 ${r} 的圆位于 ${W} × ${H} 的矩形内。在矩形内随机取一点，它落在圆外的概率是多少？结果保留 $\\pi$。`,
                ),
            answer,
            simplified: true,
            wrong: [
              ...wrongP.map((w) => (inside ? piTex(w) : `1 - ${piTex(w)}`)),
              inside ? `1 - ${piTex(p)}` : piTex(p),
              poly([Q.of(W * H), ""], [Q.of(-r * r), "\\pi"]),
            ],
            solution: t(
              `The circle has area $\\pi \\cdot ${r}^2 = ${piTex(Q.of(r * r))}$ and the rectangle $${W} \\times ${H} = ${W * H}$:${steps(`P(\\text{inside}) = \\frac{${piTex(Q.of(r * r))}}{${W * H}} = ${piTex(p)}`)}${inside ? "" : `The point lies outside the circle with probability $1 - ${piTex(p)}$.`}`,
              `圆的面积是 $\\pi \\cdot ${r}^2 = ${piTex(Q.of(r * r))}$，矩形面积是 $${W} \\times ${H} = ${W * H}$：${steps(`P(\\text{圆内}) = \\frac{${piTex(Q.of(r * r))}}{${W * H}} = ${piTex(p)}`)}${inside ? "" : `点落在圆外的概率是 $1 - ${piTex(p)}$。`}`,
            ),
          }),
          figure: {
            svg: sketch(marks),
            alt: t(
              `A ${W} by ${H} rectangle with a highlighted circle of radius ${r} at its center.`,
              `一个 ${W} × ${H} 的矩形，中央有一个突出显示的半径为 ${r} 的圆。`,
            ),
          },
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 6.17 Compound Events in Probability
// ---------------------------------------------------------------------------

/** twoSets draws two listed sets of numbers from 1 to 20 that overlap in at least one element. */
function twoSets(rng: Rng, disjointChance = 0): [number[], number[]] {
  for (;;) {
    const a = unique(rng.sample(range(1, 20), rng.int(3, 7)));
    const b = unique(rng.sample(range(1, 20), rng.int(3, 7)));
    const common = a.filter((x) => b.includes(x)).length;
    const wantDisjoint = rng.bool(disjointChance);
    if (wantDisjoint ? common === 0 : common > 0 && common < Math.min(a.length, b.length)) return [a, b];
  }
}

const union = (a: readonly number[], b: readonly number[]) => unique([...a, ...b]);
const intersection = (a: readonly number[], b: readonly number[]) => a.filter((x) => b.includes(x));
const difference = (a: readonly number[], b: readonly number[]) => a.filter((x) => !b.includes(x));

/** theUnionOfSets is outline topic 6.17.1. */
export const theUnionOfSets: TopicDef = {
  id: "the-union-of-sets",
  title: t("The Union of Sets", "集合的并集"),
  summary: t(
    "Find the union of two sets, and the number of its elements from a Venn diagram.",
    "求两个集合的并集，并由韦恩图求其元素个数。",
  ),
  prerequisites: ["venn-diagrams-in-probability"],
  encompasses: [
    { topic: "venn-diagrams-in-probability", weight: 0.2 },
    { topic: "sets", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "listing-a-union",
      title: t("Listing a union", "列举并集"),
      explanation: t(
        "The **union** $A \\cup B$ is the set of elements in $A$ **or** in $B$ (or in both). List every element of $A$, then add the elements of $B$ not yet listed; an element in both is written once.\n\n$\\{1, 3, 5, 7\\} \\cup \\{3, 4, 5, 6\\} = \\{1, 3, 4, 5, 6, 7\\}$.\n\nIn a Venn diagram, $A \\cup B$ is everything inside at least one of the circles.",
        "**并集** $A \\cup B$ 是属于 $A$ **或**属于 $B$（或两者都属于）的元素组成的集合。先写出 $A$ 的所有元素，再添上 $B$ 中还没写的元素；同时属于两者的元素只写一次。\n\n$\\{1, 3, 5, 7\\} \\cup \\{3, 4, 5, 6\\} = \\{1, 3, 4, 5, 6, 7\\}$。\n\n在韦恩图中，$A \\cup B$ 是至少在一个圆内的全部区域。",
      ),
      generate(rng) {
        const [a, b] = twoSets(rng);
        const u = union(a, b);
        return setProblem({
          prompt: t(
            `Let $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Find $A \\cup B$.${SET_EN}`,
            `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$。求 $A \\cup B$。${SET_ZH}`,
          ),
          values: u,
          wrong: [intersection(a, b), union(difference(a, b), difference(b, a)), a, b],
          solution: t(
            `Take every element of $A$ and add those of $B$ not already listed:${steps(`A \\cup B = ${setTex(u)}`)}`,
            `取 $A$ 的所有元素，再添上 $B$ 中尚未列出的元素：${steps(`A \\cup B = ${setTex(u)}`)}`,
          ),
        });
      },
    },
    {
      id: "unions-of-described-sets",
      title: t("Unions of described sets", "由描述给出的集合的并集"),
      explanation: t(
        "When sets are described by rules, list each set first, then combine them. In $U = \\{1, 2, \\ldots, 10\\}$, let $A$ be the even numbers and $B$ the numbers greater than $7$. Then $A = \\{2, 4, 6, 8, 10\\}$, $B = \\{8, 9, 10\\}$, and $A \\cup B = \\{2, 4, 6, 8, 9, 10\\}$: the numbers that are even **or** greater than $7$.",
        "集合由规则描述时，先分别列出各集合，再合并。在 $U = \\{1, 2, \\ldots, 10\\}$ 中，设 $A$ 是偶数，$B$ 是大于 $7$ 的数。则 $A = \\{2, 4, 6, 8, 10\\}$，$B = \\{8, 9, 10\\}$，$A \\cup B = \\{2, 4, 6, 8, 9, 10\\}$：是偶数**或**大于 $7$ 的数。",
      ),
      generate(rng) {
        const n = rng.int(10, 16);
        const u = range(1, n);
        for (;;) {
          const e1 = numberEvent(rng, n);
          const e2 = numberEvent(rng, n);
          const a = u.filter(e1.test);
          const b = u.filter(e2.test);
          const ab = union(a, b);
          if (a.length === 0 || b.length === 0 || intersection(a, b).length === 0 || ab.length === n || e1.en === e2.en) continue;
          if (a.every((x) => b.includes(x)) || b.every((x) => a.includes(x))) continue;
          return setProblem({
            prompt: t(
              `Let $U = \\{1, 2, \\ldots, ${n}\\}$. $A$ is the set of numbers in $U$ that are ${e1.en}, and $B$ the set of numbers in $U$ that are ${e2.en}. Find $A \\cup B$.${SET_EN}`,
              `设 $U = \\{1, 2, \\ldots, ${n}\\}$。$A$ 是 $U$ 中${e1.zh}的数组成的集合，$B$ 是 $U$ 中${e2.zh}的数组成的集合。求 $A \\cup B$。${SET_ZH}`,
            ),
            values: ab,
            wrong: [intersection(a, b), union(u.filter(e1.loose), b), union(a, u.filter(e2.loose))],
            solution: t(
              `$A = ${setTex(a)}$ and $B = ${setTex(b)}$, so${steps(`A \\cup B = ${setTex(ab)}`)}`,
              `$A = ${setTex(a)}$，$B = ${setTex(b)}$，所以${steps(`A \\cup B = ${setTex(ab)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "counting-a-union-from-a-venn-diagram",
      title: t("Counting a union from a Venn diagram", "由韦恩图计算并集的元素个数"),
      explanation: t(
        "$A \\cup B$ covers three regions of a Venn diagram: $A$ only, both, and $B$ only. Add those three numbers, counting the overlap once, and leave out the region outside both circles.\n\nWith $12$ in $A$ only, $5$ in both, $18$ in $B$ only and $7$ outside: $n(A \\cup B) = 12 + 5 + 18 = 35$. Adding $n(A) + n(B) = 17 + 23 = 40$ would count the $5$ in the overlap twice.",
        "$A \\cup B$ 覆盖韦恩图的三个区域：仅 $A$、两者、仅 $B$。把这三个数相加，重叠部分只算一次，不含两圆之外的区域。\n\n仅 $A$ 有 $12$，两者都有 $5$，仅 $B$ 有 $18$，之外有 $7$：$n(A \\cup B) = 12 + 5 + 18 = 35$。若计算 $n(A) + n(B) = 17 + 23 = 40$，重叠部分的 $5$ 就被算了两次。",
      ),
      generate(rng) {
        const c = venn2Counts(rng);
        const n = c[0] + c[1] + c[2];
        return {
          ...numberProblem({
            prompt: t(
              "The Venn diagram shows the number of elements in each region. Find $n(A \\cup B)$.",
              "韦恩图标出了每个区域的元素个数。求 $n(A \\cup B)$。",
            ),
            answer: n,
            form: "integer",
            wrong: [n + c[1], sum(c), c[0] + c[2], c[1]],
            solution: t(
              `Add the three regions inside the circles:${steps(`n(A \\cup B) = ${c[0]} + ${c[1]} + ${c[2]} = ${n}`)}`,
              `把圆内的三个区域相加：${steps(`n(A \\cup B) = ${c[0]} + ${c[1]} + ${c[2]} = ${n}`)}`,
            ),
          }),
          figure: venn2Figure(c),
        };
      },
    },
  ],
};

/** theIntersectionOfSets is outline topic 6.17.2. */
export const theIntersectionOfSets: TopicDef = {
  id: "the-intersection-of-sets",
  title: t("The Intersection of Sets", "集合的交集"),
  summary: t("Find the intersection of two or three sets, and recognize disjoint sets.", "求两个或三个集合的交集，并识别不相交的集合。"),
  prerequisites: ["the-union-of-sets"],
  encompasses: [{ topic: "sets", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "listing-an-intersection",
      title: t("Listing an intersection", "列举交集"),
      explanation: t(
        "The **intersection** $A \\cap B$ is the set of elements in $A$ **and** in $B$: those they have in common. In a Venn diagram it is the overlap of the circles.\n\n$\\{1, 3, 5, 7\\} \\cap \\{3, 4, 5, 6\\} = \\{3, 5\\}$. Sets with no common element are **disjoint**: $\\{1, 2\\} \\cap \\{5, 6\\} = \\varnothing$.",
        "**交集** $A \\cap B$ 是既属于 $A$ **又**属于 $B$ 的元素组成的集合，即它们的公共元素。在韦恩图中它是两圆的重叠部分。\n\n$\\{1, 3, 5, 7\\} \\cap \\{3, 4, 5, 6\\} = \\{3, 5\\}$。没有公共元素的集合叫**不相交**的集合：$\\{1, 2\\} \\cap \\{5, 6\\} = \\varnothing$。",
      ),
      generate(rng) {
        const [a, b] = twoSets(rng, 0.15);
        const i = intersection(a, b);
        return setProblem({
          prompt: t(
            `Let $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Find $A \\cap B$.${SET_EN}`,
            `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$。求 $A \\cap B$。${SET_ZH}`,
          ),
          values: i,
          wrong: [union(a, b), difference(a, b), difference(b, a)],
          solution:
            i.length === 0
              ? t(
                  "$A$ and $B$ have no element in common, so $A \\cap B = \\varnothing$: they are disjoint.",
                  "$A$ 与 $B$ 没有公共元素，所以 $A \\cap B = \\varnothing$：它们不相交。",
                )
              : t(
                  `Keep the elements of $A$ that are also in $B$:${steps(`A \\cap B = ${setTex(i)}`)}`,
                  `保留 $A$ 中也属于 $B$ 的元素：${steps(`A \\cap B = ${setTex(i)}`)}`,
                ),
        });
      },
    },
    {
      id: "intersections-of-described-sets",
      title: t("Intersections of described sets", "由描述给出的集合的交集"),
      explanation: t(
        "List each set from its rule, then keep the common elements. In $U = \\{1, 2, \\ldots, 12\\}$, the multiples of $3$ are $\\{3, 6, 9, 12\\}$ and the numbers at most $7$ are $\\{1, \\ldots, 7\\}$; the numbers that are both are $\\{3, 6\\}$.",
        "先按规则列出各集合，再保留公共元素。在 $U = \\{1, 2, \\ldots, 12\\}$ 中，$3$ 的倍数是 $\\{3, 6, 9, 12\\}$，不大于 $7$ 的数是 $\\{1, \\ldots, 7\\}$；两者都满足的是 $\\{3, 6\\}$。",
      ),
      generate(rng) {
        const n = rng.int(10, 20);
        const u = range(1, n);
        for (;;) {
          const e1 = numberEvent(rng, n);
          const e2 = numberEvent(rng, n);
          const a = u.filter(e1.test);
          const b = u.filter(e2.test);
          const i = intersection(a, b);
          if (a.length === 0 || b.length === 0 || e1.en === e2.en || i.length === a.length || i.length === b.length) continue;
          return setProblem({
            prompt: t(
              `Let $U = \\{1, 2, \\ldots, ${n}\\}$. $A$ is the set of numbers in $U$ that are ${e1.en}, and $B$ the set of numbers in $U$ that are ${e2.en}. Find $A \\cap B$.${SET_EN}`,
              `设 $U = \\{1, 2, \\ldots, ${n}\\}$。$A$ 是 $U$ 中${e1.zh}的数组成的集合，$B$ 是 $U$ 中${e2.zh}的数组成的集合。求 $A \\cap B$。${SET_ZH}`,
            ),
            values: i,
            wrong: [union(a, b), intersection(u.filter(e1.loose), b), intersection(a, u.filter(e2.loose))],
            solution: t(
              `$A = ${setTex(a)}$ and $B = ${setTex(b)}$, so${steps(`A \\cap B = ${setTex(i)}`)}`,
              `$A = ${setTex(a)}$，$B = ${setTex(b)}$，所以${steps(`A \\cap B = ${setTex(i)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "intersections-of-three-sets",
      title: t("Intersections of three sets", "三个集合的交集"),
      explanation: t(
        "$A \\cap B \\cap C$ holds the elements in all three sets. Find $A \\cap B$ first, then keep those also in $C$.\n\nFor $A = \\{1, 2, 3, 4, 5\\}$, $B = \\{2, 3, 5, 7\\}$, $C = \\{3, 5, 6\\}$: $A \\cap B = \\{2, 3, 5\\}$, and $A \\cap B \\cap C = \\{3, 5\\}$.",
        "$A \\cap B \\cap C$ 由同时属于三个集合的元素组成。先求 $A \\cap B$，再保留其中也属于 $C$ 的元素。\n\n对于 $A = \\{1, 2, 3, 4, 5\\}$，$B = \\{2, 3, 5, 7\\}$，$C = \\{3, 5, 6\\}$：$A \\cap B = \\{2, 3, 5\\}$，$A \\cap B \\cap C = \\{3, 5\\}$。",
      ),
      generate(rng) {
        for (;;) {
          const pool = range(1, 15);
          const a = unique(rng.sample(pool, rng.int(4, 8)));
          const b = unique(rng.sample(pool, rng.int(4, 8)));
          const c = unique(rng.sample(pool, rng.int(4, 8)));
          const ab = intersection(a, b);
          const abc = intersection(ab, c);
          if (ab.length < 2 || ab.length === abc.length) continue;
          if (abc.length === 0 && !rng.bool(0.15)) continue;
          return setProblem({
            prompt: t(
              `Let $A = ${setTex(a)}$, $B = ${setTex(b)}$ and $C = ${setTex(c)}$. Find $A \\cap B \\cap C$.${SET_EN}`,
              `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$，$C = ${setTex(c)}$。求 $A \\cap B \\cap C$。${SET_ZH}`,
            ),
            values: abc,
            wrong: [ab, intersection(a, c), intersection(b, c), union(ab, c)],
            solution: t(
              `First $A \\cap B = ${setTex(ab)}$. Of these, keep the elements of $C$:${steps(`A \\cap B \\cap C = ${setTex(abc)}`)}`,
              `先求 $A \\cap B = ${setTex(ab)}$。再保留其中属于 $C$ 的元素：${steps(`A \\cap B \\cap C = ${setTex(abc)}`)}`,
            ),
          });
        }
      },
    },
  ],
};

/** TwoWay is the setting of a two-way table: who, the row property and its negation, the column property and its negation. */
interface TwoWay {
  readonly who: Text;
  readonly rows: readonly [Text, Text];
  readonly cols: readonly [Text, Text];
}

const twoWays: readonly TwoWay[] = [
  {
    who: t("students", "学生"),
    rows: [t("plays an instrument", "会演奏乐器"), t("does not play an instrument", "不会演奏乐器")],
    cols: [t("plays a sport", "参加运动"), t("does not play a sport", "不参加运动")],
  },
  {
    who: t("adults", "成年人"),
    rows: [t("owns a car", "有汽车"), t("does not own a car", "没有汽车")],
    cols: [t("lives in the city", "住在城里"), t("lives outside the city", "住在城外")],
  },
  {
    who: t("visitors to a museum", "博物馆参观者"),
    rows: [t("is an adult", "是成人"), t("is a child", "是儿童")],
    cols: [t("bought a ticket online", "在网上买票"), t("bought a ticket at the door", "在门口买票")],
  },
  {
    who: t("customers of a café", "咖啡馆顾客"),
    rows: [t("ordered a hot drink", "点了热饮"), t("ordered a cold drink", "点了冷饮")],
    cols: [t("ordered food", "点了食物"), t("did not order food", "没点食物")],
  },
];

/** twoWayTable writes a two-way table of counts in Markdown. */
function twoWayTable(w: TwoWay, c: readonly number[], lang: "en" | "zh-CN"): string {
  const cap = (s: string) => (lang === "en" ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  return `| | ${cap(w.cols[0][lang])} | ${cap(w.cols[1][lang])} |\n| :--- | :--- | :--- |\n| ${cap(w.rows[0][lang])} | $${c[0]}$ | $${c[1]}$ |\n| ${cap(w.rows[1][lang])} | $${c[2]}$ | $${c[3]}$ |`;
}

/** compoundEventsInProbabilityFromExperimentalData is outline topic 6.17.3. */
export const compoundEventsInProbabilityFromExperimentalData: TopicDef = {
  id: "compound-events-in-probability-from-experimental-data",
  title: t("Compound Events in Probability From Experimental Data", "由试验数据求复合事件的概率"),
  summary: t('Find experimental probabilities of "and" and "or" events from a two-way table.', "由双向表求“且”事件和“或”事件的试验概率。"),
  prerequisites: ["the-intersection-of-sets", "experimental-probability"],
  encompasses: [
    { topic: "experimental-probability", weight: 0.4 },
    { topic: "the-intersection-of-sets", weight: 0.2 },
    { topic: "the-union-of-sets", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.4", "CCSS.HSS.CP.B.7"],
  knowledgePoints: [
    {
      id: "and-events-from-a-table",
      title: t('"And" events from a table', "由表格求“且”事件的概率"),
      explanation: t(
        "A **two-way table** counts people (or trials) by two properties at once. Each cell counts those with one row property **and** one column property, so\n\n$$P(\\text{row and column}) = \\frac{\\text{the cell}}{\\text{the total of all four cells}}$$\n\n| | Plays a sport | Does not play a sport |\n| :--- | :--- | :--- |\n| Plays an instrument | $12$ | $18$ |\n| Does not play an instrument | $25$ | $5$ |\n\nThere are $12 + 18 + 25 + 5 = 60$ students, so the probability that a random one plays an instrument and a sport is $\\frac{12}{60} = \\frac{1}{5}$.",
        "**双向表**按两种属性同时统计人数（或试验次数）。每个单元格统计同时具有某行属性**且**具有某列属性的人数，所以\n\n$$P(\\text{行且列}) = \\frac{\\text{该单元格}}{\\text{四个单元格之和}}$$\n\n| | 参加运动 | 不参加运动 |\n| :--- | :--- | :--- |\n| 会演奏乐器 | $12$ | $18$ |\n| 不会演奏乐器 | $25$ | $5$ |\n\n共有 $12 + 18 + 25 + 5 = 60$ 名学生，所以随机一名学生既会演奏乐器又参加运动的概率是 $\\frac{12}{60} = \\frac{1}{5}$。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        const c = [rng.int(3, 40), rng.int(3, 40), rng.int(3, 40), rng.int(3, 40)];
        const total = sum(c);
        const r = rng.int(0, 1);
        const k = rng.int(0, 1);
        const cell = c[2 * r + k]!;
        const rowTotal = c[2 * r]! + c[2 * r + 1]!;
        const colTotal = c[k]! + c[2 + k]!;
        return probProblem(
          t(
            `A survey of ${w.who.en} gave these counts:\n\n${twoWayTable(w, c, "en")}\n\nOne of them is chosen at random. What is the probability that the person ${w.rows[r]!.en} and ${w.cols[k]!.en}?`,
            `对${w.who["zh-CN"]}的调查结果如下：\n\n${twoWayTable(w, c, "zh-CN")}\n\n从中随机选一人，此人${w.rows[r]!["zh-CN"]}且${w.cols[k]!["zh-CN"]}的概率是多少？`,
          ),
          Q.of(cell, total),
          t(
            `The total is $${c.join(" + ")} = ${total}$, and the cell for both properties is $${cell}$:${steps(`P = ${ratio(cell, total)}`)}`,
            `总人数为 $${c.join(" + ")} = ${total}$，同时具有两种属性的单元格是 $${cell}$：${steps(`P = ${ratio(cell, total)}`)}`,
          ),
          [Q.of(cell, rowTotal), Q.of(cell, colTotal), Q.of(rowTotal + colTotal - cell, total), Q.of(rowTotal, total)],
        );
      },
    },
    {
      id: "or-events-from-a-table",
      title: t('"Or" events from a table', "由表格求“或”事件的概率"),
      explanation: t(
        '"Row **or** column" means at least one of the two. Add the cells that have either property, counting the cell that has both only once. Equivalently, add the row total and the column total, then subtract the shared cell.\n\nIn the table of the previous step, the students who play an instrument or a sport are $12 + 18 + 25 = 55$ (equivalently, $30 + 37 - 12 = 55$), so the probability is $\\frac{55}{60} = \\frac{11}{12}$.',
        "“行**或**列”指至少具有两者之一。把具有任一属性的单元格相加，同时具有两者的单元格只算一次。等价地，把行合计与列合计相加，再减去公共单元格。\n\n在上一步的表格中，会演奏乐器或参加运动的学生有 $12 + 18 + 25 = 55$ 名（也可以算 $30 + 37 - 12 = 55$），所以概率是 $\\frac{55}{60} = \\frac{11}{12}$。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        const c = [rng.int(3, 40), rng.int(3, 40), rng.int(3, 40), rng.int(3, 40)];
        const total = sum(c);
        const r = rng.int(0, 1);
        const k = rng.int(0, 1);
        const cell = c[2 * r + k]!;
        const rowTotal = c[2 * r]! + c[2 * r + 1]!;
        const colTotal = c[k]! + c[2 + k]!;
        const n = rowTotal + colTotal - cell;
        return probProblem(
          t(
            `A survey of ${w.who.en} gave these counts:\n\n${twoWayTable(w, c, "en")}\n\nOne of them is chosen at random. What is the probability that the person ${w.rows[r]!.en} or ${w.cols[k]!.en}?`,
            `对${w.who["zh-CN"]}的调查结果如下：\n\n${twoWayTable(w, c, "zh-CN")}\n\n从中随机选一人，此人${w.rows[r]!["zh-CN"]}或${w.cols[k]!["zh-CN"]}的概率是多少？`,
          ),
          Q.of(n, total),
          t(
            `The row has $${rowTotal}$ people and the column $${colTotal}$, with $${cell}$ in both: $${rowTotal} + ${colTotal} - ${cell} = ${n}$ of the $${total}$.${steps(`P = ${ratio(n, total)}`)}`,
            `该行有 $${rowTotal}$ 人，该列有 $${colTotal}$ 人，两者都有的 $${cell}$ 人：共 $${rowTotal} + ${colTotal} - ${cell} = ${n}$ 人，总数 $${total}$。${steps(`P = ${ratio(n, total)}`)}`,
          ),
          [Q.of(rowTotal + colTotal, total), Q.of(cell, total), Q.of(n - cell, total)],
        );
      },
    },
  ],
};

/** computingProbabilitiesForCompoundEventsUsingVennDiagrams is outline topic 6.17.4. */
export const computingProbabilitiesForCompoundEventsUsingVennDiagrams: TopicDef = {
  id: "computing-probabilities-for-compound-events-using-venn-diagrams",
  title: t("Computing Probabilities for Compound Events Using Venn Diagrams", "用韦恩图求复合事件的概率"),
  summary: t(
    "Find P(A ∩ B), P(A ∪ B) and the probability of exactly one event from a Venn diagram.",
    "由韦恩图求 P(A ∩ B)、P(A ∪ B) 以及恰好一个事件发生的概率。",
  ),
  prerequisites: ["the-intersection-of-sets"],
  encompasses: [
    { topic: "the-intersection-of-sets", weight: 0.2 },
    { topic: "the-union-of-sets", weight: 0.2 },
    { topic: "venn-diagrams-in-probability", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "intersections-from-a-venn-diagram",
      title: t("P(A ∩ B) from a Venn diagram", "由韦恩图求 P(A ∩ B)"),
      explanation: t(
        'The event "$A$ and $B$" is the intersection $A \\cap B$: the overlap of the circles. Its probability is the overlap count over the total of all regions.\n\nIn the diagram, $P(A \\cap B) = \\frac{5}{42}$.',
        "事件“$A$ 且 $B$”就是交集 $A \\cap B$：两圆的重叠部分。它的概率是重叠部分的人数除以所有区域之和。\n\n在图中，$P(A \\cap B) = \\frac{5}{42}$。",
      ),
      figure: venn2Figure([12, 5, 18, 7]),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e: VennEvent = { tex: "A \\cap B", en: "the overlap of the circles", zh: "两圆的重叠部分", test: (a, b) => a && b };
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(A \\cap B)$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(A \\cap B)$。`),
            Q.of(c[1], total),
            vennSolution(c, e),
            [Q.of(c[1], total - c[3]), Q.of(c[0] + c[1] + c[2], total), Q.of(c[0] + 2 * c[1] + c[2], total), Q.of(c[1], c[0] + c[1])],
          ),
          figure: venn2Figure(c),
        };
      },
    },
    {
      id: "unions-from-a-venn-diagram",
      title: t("P(A ∪ B) from a Venn diagram", "由韦恩图求 P(A ∪ B)"),
      explanation: t(
        'The event "$A$ or $B$" is the union $A \\cup B$: everything inside at least one circle. Add the three regions inside the circles, the overlap once.\n\nIn the diagram of the previous step, $P(A \\cup B) = \\frac{12 + 5 + 18}{42} = \\frac{35}{42} = \\frac{5}{6}$.',
        "事件“$A$ 或 $B$”就是并集 $A \\cup B$：至少在一个圆内的全部区域。把圆内的三个区域相加，重叠部分算一次。\n\n在上一步的图中，$P(A \\cup B) = \\frac{12 + 5 + 18}{42} = \\frac{35}{42} = \\frac{5}{6}$。",
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e: VennEvent = { tex: "A \\cup B", en: "everything inside the circles", zh: "两圆内的全部区域", test: (a, b) => a || b };
        const n = c[0] + c[1] + c[2];
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(A \\cup B)$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(A \\cup B)$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(n + c[1], total), Q.of(c[0] + c[2], total), Q.of(c[1], total), Q.of(c[3], total)],
          ),
          figure: venn2Figure(c),
        };
      },
    },
    {
      id: "exactly-one-event",
      title: t("Exactly one of the events", "恰好一个事件发生"),
      explanation: t(
        '"Exactly one of $A$ and $B$" means $A$ or $B$ but **not both**: the two crescent regions $A$ only and $B$ only. "$A$ only" alone is the crescent of $A$.\n\nIn the diagram of the first step, $P(\\text{exactly one}) = \\frac{12 + 18}{42} = \\frac{30}{42} = \\frac{5}{7}$, and $P(A \\text{ only}) = \\frac{12}{42} = \\frac{2}{7}$.',
        "“$A$、$B$ 恰好发生一个”指 $A$ 或 $B$ 发生但**不同时**发生：即仅 $A$ 和仅 $B$ 两个月牙形区域。“仅 $A$”就是 $A$ 的月牙形区域。\n\n在第一步的图中，$P(\\text{恰好一个}) = \\frac{12 + 18}{42} = \\frac{30}{42} = \\frac{5}{7}$，$P(\\text{仅 } A) = \\frac{12}{42} = \\frac{2}{7}$。",
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const kind = rng.int(0, 2);
        const [en, zh, n] =
          kind === 0
            ? ["exactly one of $A$ and $B$ happens", "$A$、$B$ 恰好发生一个", c[0] + c[2]]
            : kind === 1
              ? ["$A$ happens but $B$ does not", "$A$ 发生而 $B$ 不发生", c[0]]
              : ["$B$ happens but $A$ does not", "$B$ 发生而 $A$ 不发生", c[2]];
        const parts = kind === 0 ? `${c[0]} + ${c[2]} = ${n}` : `${n}`;
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} What is the probability that ${en}?`, `${surveyPrompt(s, total)["zh-CN"]}${zh}的概率是多少？`),
            Q.of(n, total),
            t(
              `${kind === 0 ? "Exactly one means the two crescents, without the overlap" : "This is the crescent of one circle, without the overlap"}: $${parts}$ people.${steps(`P = ${ratio(n, total)}`)}`,
              `${kind === 0 ? "恰好一个即两个月牙形区域，不含重叠部分" : "这是一个圆的月牙形区域，不含重叠部分"}：$${parts}$ 人。${steps(`P = ${ratio(n, total)}`)}`,
            ),
            [Q.of(c[0] + c[1] + c[2], total), Q.of(kind === 2 ? c[1] + c[2] : c[0] + c[1], total), Q.of(c[1], total)],
          ),
          figure: venn2Figure(c),
        };
      },
    },
  ],
};

/** complementEvents are the events with complements asked about in a two-set Venn diagram. */
const complementEvents: readonly VennEvent[] = [
  { tex: "A'", en: "everything outside circle $A$", zh: "圆 $A$ 之外的全部区域", test: (a) => !a },
  { tex: "B'", en: "everything outside circle $B$", zh: "圆 $B$ 之外的全部区域", test: (_, b) => !b },
  { tex: "(A \\cup B)'", en: "the region outside both circles", zh: "两圆之外的区域", test: (a, b) => !a && !b },
  { tex: "(A \\cap B)'", en: "everything except the overlap", zh: "除重叠部分以外的全部区域", test: (a, b) => !(a && b) },
  { tex: "A \\cap B'", en: "the part of $A$ outside $B$", zh: "$A$ 中在 $B$ 之外的部分", test: (a, b) => a && !b },
  { tex: "A' \\cap B", en: "the part of $B$ outside $A$", zh: "$B$ 中在 $A$ 之外的部分", test: (a, b) => !a && b },
  { tex: "A' \\cap B'", en: "the region outside both circles", zh: "两圆之外的区域", test: (a, b) => !a && !b },
  { tex: "A \\cup B'", en: "circle $A$ together with everything outside $B$", zh: "圆 $A$ 与 $B$ 之外的全部区域", test: (a, b) => a || !b },
  { tex: "A' \\cup B", en: "circle $B$ together with everything outside $A$", zh: "圆 $B$ 与 $A$ 之外的全部区域", test: (a, b) => !a || b },
  { tex: "A' \\cup B'", en: "everything except the overlap", zh: "除重叠部分以外的全部区域", test: (a, b) => !a || !b },
];

/** computingProbabilitiesOfEventsContainingComplementsUsingVennDiagrams is outline topic 6.17.5. */
export const computingProbabilitiesOfEventsContainingComplementsUsingVennDiagrams: TopicDef = {
  id: "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
  title: t("Computing Probabilities of Events Containing Complements Using Venn Diagrams", "用韦恩图求含对立事件的概率"),
  summary: t(
    "Find probabilities of events such as A ∩ B', A' ∪ B and (A ∪ B)' from a Venn diagram.",
    "由韦恩图求 A ∩ B'、A' ∪ B、(A ∪ B)' 等事件的概率。",
  ),
  prerequisites: ["computing-probabilities-for-compound-events-using-venn-diagrams"],
  encompasses: [
    { topic: "computing-probabilities-for-compound-events-using-venn-diagrams", weight: 0.5 },
    { topic: "the-complement-of-an-event", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "complements-of-single-and-compound-events",
      title: t("Complements of events", "事件的对立事件"),
      explanation: t(
        "In a Venn diagram, the complement $A'$ is everything outside circle $A$, **including** the region outside both circles. The complement of a compound event is everything outside it: $(A \\cup B)'$ is the region outside both circles, and $(A \\cap B)'$ is everything except the overlap.\n\nWith $12$ in $A$ only, $5$ in both, $18$ in $B$ only and $7$ outside both: $P(A') = \\frac{18 + 7}{42} = \\frac{25}{42}$ and $P((A \\cup B)') = \\frac{7}{42} = \\frac{1}{6}$.",
        "在韦恩图中，对立事件 $A'$ 是圆 $A$ 之外的全部区域，**包括**两圆之外的区域。复合事件的对立事件是它之外的一切：$(A \\cup B)'$ 是两圆之外的区域，$(A \\cap B)'$ 是除重叠部分以外的全部区域。\n\n仅 $A$ 有 $12$，两者都有 $5$，仅 $B$ 有 $18$，两者之外有 $7$：$P(A') = \\frac{18 + 7}{42} = \\frac{25}{42}$，$P((A \\cup B)') = \\frac{7}{42} = \\frac{1}{6}$。",
      ),
      figure: venn2Figure([12, 5, 18, 7]),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e = rng.pick(complementEvents.slice(0, 4));
        const n = vennCount(c, e.test);
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(${e.tex})$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(${e.tex})$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(total - n, total), Q.of(n - c[3], total), Q.of(c[0], total), Q.of(c[2], total)],
          ),
          figure: venn2Figure(c),
        };
      },
    },
    {
      id: "intersections-and-unions-with-complements",
      title: t("Intersections and unions with complements", "含对立事件的交与并"),
      explanation: t(
        "Read each part of the event as a region, then combine: $\\cap$ keeps the regions in **both** parts, $\\cup$ keeps the regions in **either**.\n\n- $A \\cap B'$: inside $A$ and outside $B$, the crescent of $A$.\n- $A' \\cup B$: outside $A$, or inside $B$: every region except the crescent of $A$.\n\nIn the diagram above, $P(A \\cap B') = \\frac{12}{42} = \\frac{2}{7}$ and $P(A' \\cup B) = \\frac{5 + 18 + 7}{42} = \\frac{30}{42} = \\frac{5}{7}$.",
        "把事件的每一部分看作区域，再组合：$\\cap$ 保留**两部分都含**的区域，$\\cup$ 保留**任一部分含**的区域。\n\n- $A \\cap B'$：在 $A$ 内且在 $B$ 外，即 $A$ 的月牙形区域。\n- $A' \\cup B$：在 $A$ 外或在 $B$ 内：除 $A$ 的月牙形区域外的所有区域。\n\n在上图中，$P(A \\cap B') = \\frac{12}{42} = \\frac{2}{7}$，$P(A' \\cup B) = \\frac{5 + 18 + 7}{42} = \\frac{30}{42} = \\frac{5}{7}$。",
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e = rng.pick(complementEvents.slice(4));
        const n = vennCount(c, e.test);
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(${e.tex})$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(${e.tex})$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(total - n, total), Q.of(n - c[3], total), Q.of(c[0] + c[1], total), Q.of(c[1] + c[2], total)],
          ),
          figure: venn2Figure(c),
        };
      },
    },
  ],
};

/** Venn3Event is an event built from A, B and C. */
interface Venn3Event {
  readonly tex: string;
  readonly en: string;
  readonly zh: string;
  readonly test: (a: boolean, b: boolean, c: boolean) => boolean;
}

const venn3Count = (c: Venn3, e: Venn3Event) =>
  sum(c.filter((_, i) => e.test(venn3Members[i]![0], venn3Members[i]![1], venn3Members[i]![2])));

function venn3Solution(c: Venn3, e: Venn3Event): Text {
  const parts = c.filter((_, i) => e.test(venn3Members[i]![0], venn3Members[i]![1], venn3Members[i]![2]));
  const n = sum(parts);
  const total = sum(c);
  const add = parts.length > 1 ? `${parts.join(" + ")} = ${n}` : `${n}`;
  return t(
    `The event is ${e.en}. It holds $${add}$ of the $${total}$ people:${steps(`P = ${ratio(n, total)}`)}`,
    `该事件是${e.zh}，共有 $${add}$ 人，总人数为 $${total}$：${steps(`P = ${ratio(n, total)}`)}`,
  );
}

const venn3Intersections: readonly Venn3Event[] = [
  {
    tex: "P(A \\cap B \\cap C)",
    en: "the center region, common to all three circles",
    zh: "三圆共同的中心区域",
    test: (a, b, c) => a && b && c,
  },
  { tex: "P(A \\cap B)", en: "the overlap of $A$ and $B$, center included", zh: "$A$ 与 $B$ 的重叠部分（含中心）", test: (a, b) => a && b },
  {
    tex: "P(A \\cap C)",
    en: "the overlap of $A$ and $C$, center included",
    zh: "$A$ 与 $C$ 的重叠部分（含中心）",
    test: (a, _, c) => a && c,
  },
  {
    tex: "P(B \\cap C)",
    en: "the overlap of $B$ and $C$, center included",
    zh: "$B$ 与 $C$ 的重叠部分（含中心）",
    test: (_, b, c) => b && c,
  },
  { tex: "P(A)", en: "the whole circle $A$, four regions", zh: "整个圆 $A$（四个区域）", test: (a) => a },
  { tex: "P(C)", en: "the whole circle $C$, four regions", zh: "整个圆 $C$（四个区域）", test: (_, __, c) => c },
];

const venn3Unions: readonly Venn3Event[] = [
  {
    tex: "P(A \\cup B)",
    en: "everything inside $A$ or $B$, six regions",
    zh: "$A$ 或 $B$ 内的全部区域（六个区域）",
    test: (a, b) => a || b,
  },
  {
    tex: "P(B \\cup C)",
    en: "everything inside $B$ or $C$, six regions",
    zh: "$B$ 或 $C$ 内的全部区域（六个区域）",
    test: (_, b, c) => b || c,
  },
  {
    tex: "P(A \\cup C)",
    en: "everything inside $A$ or $C$, six regions",
    zh: "$A$ 或 $C$ 内的全部区域（六个区域）",
    test: (a, _, c) => a || c,
  },
  {
    tex: "P(A \\cup B \\cup C)",
    en: "everything inside at least one circle",
    zh: "至少在一个圆内的全部区域",
    test: (a, b, c) => a || b || c,
  },
  {
    tex: "P((A \\cup B) \\cap C)",
    en: "the part of $C$ that is also in $A$ or $B$",
    zh: "$C$ 中也在 $A$ 或 $B$ 内的部分",
    test: (a, b, c) => (a || b) && c,
  },
];

const venn3Others: readonly Venn3Event[] = [
  {
    tex: "P((A \\cup B \\cup C)')",
    en: "the region outside all three circles",
    zh: "三圆之外的区域",
    test: (a, b, c) => !a && !b && !c,
  },
  {
    tex: "P(\\text{exactly one})",
    en: "the three regions inside exactly one circle",
    zh: "恰好在一个圆内的三个区域",
    test: (a, b, c) => Number(a) + Number(b) + Number(c) === 1,
  },
  {
    tex: "P(A \\cap B \\cap C')",
    en: "the part of the overlap of $A$ and $B$ outside $C$",
    zh: "$A$ 与 $B$ 的重叠部分中在 $C$ 之外的部分",
    test: (a, b, c) => a && b && !c,
  },
  {
    tex: "P(A \\cap B' \\cap C')",
    en: "the part of $A$ outside both $B$ and $C$",
    zh: "$A$ 中在 $B$ 和 $C$ 之外的部分",
    test: (a, b, c) => a && !b && !c,
  },
  { tex: "P(C')", en: "everything outside circle $C$", zh: "圆 $C$ 之外的全部区域", test: (_, __, c) => !c },
];

/** venn3Problem asks for the probability of one event from a three-set Venn diagram. */
function venn3Problem(rng: Rng, events: readonly Venn3Event[]): Problem {
  const s = rng.pick(surveys3);
  const c = venn3Counts(rng);
  const total = sum(c);
  const e = rng.pick(events);
  const n = venn3Count(c, e);
  const what =
    e.tex === "P(\\text{exactly one})"
      ? t("What is the probability that exactly one of $A$, $B$ and $C$ happens?", "$A$、$B$、$C$ 恰好发生一个的概率是多少？")
      : t(`Find $${e.tex}$.`, `求 $${e.tex}$。`);
  const wrong = [Q.of(total - n, total), ...[0, 1, 2, 3, 4, 5, 6].map((i) => Q.of(n - c[i]!, total)), Q.of(n, total - c[7])];
  return {
    ...probProblem(
      t(`${survey3Prompt(s, total).en} ${what.en}`, `${survey3Prompt(s, total)["zh-CN"]}${what["zh-CN"]}`),
      Q.of(n, total),
      venn3Solution(c, e),
      wrong.filter((w) => w.sign() > 0),
    ),
    figure: venn3Figure(c),
  };
}

/** computingProbabilitiesForThreeEventsUsingVennDiagrams is outline topic 6.17.6. */
export const computingProbabilitiesForThreeEventsUsingVennDiagrams: TopicDef = {
  id: "computing-probabilities-for-three-events-using-venn-diagrams",
  title: t("Computing Probabilities for Three Events Using Venn Diagrams", "用韦恩图求三个事件的概率"),
  summary: t(
    "Read the eight regions of a three-set Venn diagram to find probabilities of intersections, unions and complements.",
    "读出三集合韦恩图的八个区域，求交、并和对立事件的概率。",
  ),
  prerequisites: ["computing-probabilities-of-events-containing-complements-using-venn-diagrams"],
  encompasses: [{ topic: "computing-probabilities-of-events-containing-complements-using-venn-diagrams", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.1"],
  knowledgePoints: [
    {
      id: "intersections-of-three-events",
      title: t("Intersections with three events", "三个事件的交"),
      explanation: t(
        "Three overlapping circles split $U$ into eight regions. The center belongs to all three circles; the three regions around it belong to exactly two. So $A \\cap B$ is **two** regions: $A$ and $B$ but not $C$, plus the center. The whole circle $A$ is four regions.\n\nIn the diagram, $P(A \\cap B \\cap C) = \\frac{3}{79}$, $P(A \\cap B) = \\frac{5 + 3}{79} = \\frac{8}{79}$ and $P(A) = \\frac{12 + 5 + 7 + 3}{79} = \\frac{27}{79}$.",
        "三个相交的圆把 $U$ 分成八个区域。中心区域属于三个圆；它周围的三个区域恰好属于两个圆。所以 $A \\cap B$ 由**两个**区域组成：在 $A$ 和 $B$ 中但不在 $C$ 中的区域，加上中心。整个圆 $A$ 由四个区域组成。\n\n在图中，$P(A \\cap B \\cap C) = \\frac{3}{79}$，$P(A \\cap B) = \\frac{5 + 3}{79} = \\frac{8}{79}$，$P(A) = \\frac{12 + 5 + 7 + 3}{79} = \\frac{27}{79}$。",
      ),
      figure: venn3Figure([12, 5, 18, 7, 3, 14, 9, 11]),
      generate: (rng) => venn3Problem(rng, venn3Intersections),
    },
    {
      id: "unions-of-three-events",
      title: t("Unions with three events", "三个事件的并"),
      explanation: t(
        "For a union, add every region inside at least one of the circles named, each region once. $A \\cup B$ covers six of the eight regions: all but $C$ only and the outside. $A \\cup B \\cup C$ is everything except the outside region.\n\nIn the diagram above, $P(A \\cup B \\cup C) = \\frac{79 - 11}{79} = \\frac{68}{79}$.",
        "求并集时，把至少在所列一个圆内的区域都加起来，每个区域只算一次。$A \\cup B$ 覆盖八个区域中的六个：除仅 $C$ 和外部区域之外的全部。$A \\cup B \\cup C$ 是除外部区域以外的全部。\n\n在上图中，$P(A \\cup B \\cup C) = \\frac{79 - 11}{79} = \\frac{68}{79}$。",
      ),
      generate: (rng) => venn3Problem(rng, venn3Unions),
    },
    {
      id: "complements-and-exactly-one-with-three-events",
      title: t('Complements and "exactly one" with three events', "三个事件的对立事件与“恰好一个”"),
      explanation: t(
        "A prime excludes a circle: $A \\cap B \\cap C'$ is the region in $A$ and $B$ but outside $C$; $A \\cap B' \\cap C'$ is $A$ only. \"Exactly one\" is the three regions that belong to a single circle, and $(A \\cup B \\cup C)'$ is the region outside all three.\n\nIn the diagram of the first step, $P(\\text{exactly one}) = \\frac{12 + 18 + 9}{79} = \\frac{39}{79}$.",
        "撇号表示排除某个圆：$A \\cap B \\cap C'$ 是在 $A$ 和 $B$ 中但在 $C$ 之外的区域；$A \\cap B' \\cap C'$ 是仅 $A$ 的区域。“恰好一个”是只属于一个圆的三个区域，$(A \\cup B \\cup C)'$ 是三圆之外的区域。\n\n在第一步的图中，$P(\\text{恰好一个}) = \\frac{12 + 18 + 9}{79} = \\frac{39}{79}$。",
      ),
      generate: (rng) => venn3Problem(rng, venn3Others),
    },
  ],
};

/** Probs are P(A), P(B) and P(A ∩ B) in hundredths, drawn so that every probability is between 0 and 1. */
function probs(rng: Rng): [number, number, number] {
  for (;;) {
    const a = rng.int(10, 85);
    const b = rng.int(10, 85);
    const ab = rng.int(1, Math.min(a, b) - 1);
    if (a + b - ab < 100 && a + b - ab > Math.max(a, b)) return [a, b, ab];
  }
}

/** pd writes hundredths as a decimal: pd(35) is "0.35". */
const pd = (h: number) => dec(Q.of(h, 100));

const hundredths = (h: number) => Q.of(h, 100);

/** additionContexts name events A and B in words. */
const additionContexts: readonly (readonly [string, string, string, string, string, string])[] = [
  ["a randomly chosen student", "随机选的一名学生", "has a sister", "有姐妹", "has a brother", "有兄弟"],
  ["a randomly chosen household", "随机选的一户人家", "owns a cat", "养猫", "owns a dog", "养狗"],
  ["a randomly chosen day", "随机选的一天", "is windy", "刮风", "is rainy", "下雨"],
  ["a randomly chosen customer", "随机选的一名顾客", "buys milk", "买牛奶", "buys eggs", "买鸡蛋"],
  ["a randomly chosen employee", "随机选的一名员工", "speaks French", "会说法语", "speaks German", "会说德语"],
];

/** theAdditionLawOfProbability is outline topic 6.17.7. */
export const theAdditionLawOfProbability: TopicDef = {
  id: "the-addition-law-of-probability",
  title: t("The Addition Law of Probability", "概率的加法公式"),
  summary: t(
    "Use P(A ∪ B) = P(A) + P(B) − P(A ∩ B) to find any one of the four probabilities from the other three.",
    "利用 P(A ∪ B) = P(A) + P(B) − P(A ∩ B)，由其中三个概率求第四个。",
  ),
  prerequisites: ["computing-probabilities-for-compound-events-using-venn-diagrams", "decimal-arithmetic"],
  encompasses: [
    { topic: "computing-probabilities-for-compound-events-using-venn-diagrams", weight: 0.3 },
    { topic: "decimal-arithmetic", weight: 0.1 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.7"],
  knowledgePoints: [
    {
      id: "finding-the-union",
      title: t("Finding P(A ∪ B)", "求 P(A ∪ B)"),
      explanation: t(
        "Adding $P(A)$ and $P(B)$ counts the overlap $A \\cap B$ twice, once in each circle. Subtract it once:\n\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n\nIf $P(A) = 0.4$, $P(B) = 0.35$ and $P(A \\cap B) = 0.15$, then $P(A \\cup B) = 0.4 + 0.35 - 0.15 = 0.6$.",
        "把 $P(A)$ 与 $P(B)$ 相加时，重叠部分 $A \\cap B$ 在两个圆里各算了一次，共两次。减去一次：\n\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n\n若 $P(A) = 0.4$，$P(B) = 0.35$，$P(A \\cap B) = 0.15$，则 $P(A \\cup B) = 0.4 + 0.35 - 0.15 = 0.6$。",
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const fractions = rng.bool(0.3);
        if (fractions) {
          const d = rng.pick([8, 10, 12, 15, 20]);
          const fa = rng.int(2, d - 2);
          const fb = rng.int(2, d - 2);
          const fab = rng.int(1, Math.min(fa, fb) - 1 || 1);
          const fu = fa + fb - fab;
          if (fab < Math.min(fa, fb) && fu <= d) {
            const [A, B, AB] = [Q.of(fa, d), Q.of(fb, d), Q.of(fab, d)];
            const U = Q.of(fu, d);
            return probProblem(
              t(
                `For events $A$ and $B$, $P(A) = ${A.toLatex()}$, $P(B) = ${B.toLatex()}$ and $P(A \\cap B) = ${AB.toLatex()}$. Find $P(A \\cup B)$.`,
                `事件 $A$、$B$ 满足 $P(A) = ${A.toLatex()}$，$P(B) = ${B.toLatex()}$，$P(A \\cap B) = ${AB.toLatex()}$。求 $P(A \\cup B)$。`,
              ),
              U,
              t(
                `Use the addition law:${steps(`P(A \\cup B) = ${A.toLatex()} + ${B.toLatex()} - ${AB.toLatex()} = ${U.toLatex()}`)}`,
                `利用加法公式：${steps(`P(A \\cup B) = ${A.toLatex()} + ${B.toLatex()} - ${AB.toLatex()} = ${U.toLatex()}`)}`,
              ),
              [A.add(B), A.add(B).add(AB), A.mul(B)],
            );
          }
        }
        const [who, whoZh, aEn, aZh, bEn, bZh] = rng.pick(additionContexts);
        return probProblem(
          t(
            `The probability that ${who} ${aEn} is $${pd(a)}$, that it ${bEn} is $${pd(b)}$, and that it ${aEn} and ${bEn} is $${pd(ab)}$. What is the probability that it ${aEn} or ${bEn}?`,
            `${whoZh}${aZh}的概率是 $${pd(a)}$，${bZh}的概率是 $${pd(b)}$，既${aZh}又${bZh}的概率是 $${pd(ab)}$。${aZh}或${bZh}的概率是多少？`,
          ),
          hundredths(u),
          t(
            `Let $A$ be "${aEn}" and $B$ "${bEn}". By the addition law,${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}`,
            `设 $A$ 为“${aZh}”，$B$ 为“${bZh}”。由加法公式，${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}`,
          ),
          [hundredths(a + b), hundredths(a + b + ab), hundredths(u - ab)],
        );
      },
    },
    {
      id: "finding-the-intersection",
      title: t("Finding P(A ∩ B)", "求 P(A ∩ B)"),
      explanation: t(
        "The addition law links four probabilities, so any three give the fourth. To find the intersection, rearrange:\n\n$$P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$$\n\nIf $P(A) = 0.5$, $P(B) = 0.45$ and $P(A \\cup B) = 0.7$, then $P(A \\cap B) = 0.5 + 0.45 - 0.7 = 0.25$.",
        "加法公式联系着四个概率，所以已知其中三个就能求出第四个。求交集时变形为：\n\n$$P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$$\n\n若 $P(A) = 0.5$，$P(B) = 0.45$，$P(A \\cup B) = 0.7$，则 $P(A \\cap B) = 0.5 + 0.45 - 0.7 = 0.25$。",
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        return probProblem(
          t(
            `For events $A$ and $B$, $P(A) = ${pd(a)}$, $P(B) = ${pd(b)}$ and $P(A \\cup B) = ${pd(u)}$. Find $P(A \\cap B)$.`,
            `事件 $A$、$B$ 满足 $P(A) = ${pd(a)}$，$P(B) = ${pd(b)}$，$P(A \\cup B) = ${pd(u)}$。求 $P(A \\cap B)$。`,
          ),
          hundredths(ab),
          t(
            `Rearrange the addition law:${steps(`P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}`,
            `将加法公式变形：${steps(`P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}`,
          ),
          [hundredths(u - a), hundredths(u - b), hundredths(a + b + u), Q.of(a * b, 10000)],
        );
      },
    },
    {
      id: "finding-one-event",
      title: t("Finding P(A) or P(B)", "求 P(A) 或 P(B)"),
      explanation: t(
        "To find one of the single events, rearrange for it:\n\n$$P(B) = P(A \\cup B) - P(A) + P(A \\cap B)$$\n\nIf $P(A \\cup B) = 0.8$, $P(A) = 0.5$ and $P(A \\cap B) = 0.2$, then $P(B) = 0.8 - 0.5 + 0.2 = 0.5$. The intersection is **added** back, because $P(B)$ includes the overlap.",
        "求某个单独事件的概率时，对它变形：\n\n$$P(B) = P(A \\cup B) - P(A) + P(A \\cap B)$$\n\n若 $P(A \\cup B) = 0.8$，$P(A) = 0.5$，$P(A \\cap B) = 0.2$，则 $P(B) = 0.8 - 0.5 + 0.2 = 0.5$。交集要**加**回来，因为 $P(B)$ 包含重叠部分。",
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const askA = rng.bool();
        const [known, want, kTex, wTex] = askA ? [b, a, "B", "A"] : [a, b, "A", "B"];
        return probProblem(
          t(
            `For events $A$ and $B$, $P(A \\cup B) = ${pd(u)}$, $P(${kTex}) = ${pd(known)}$ and $P(A \\cap B) = ${pd(ab)}$. Find $P(${wTex})$.`,
            `事件 $A$、$B$ 满足 $P(A \\cup B) = ${pd(u)}$，$P(${kTex}) = ${pd(known)}$，$P(A \\cap B) = ${pd(ab)}$。求 $P(${wTex})$。`,
          ),
          hundredths(want),
          t(
            `Rearrange the addition law for $P(${wTex})$:${steps(`P(${wTex}) = P(A \\cup B) - P(${kTex}) + P(A \\cap B) = ${pd(u)} - ${pd(known)} + ${pd(ab)} = ${pd(want)}`)}`,
            `将加法公式变形求 $P(${wTex})$：${steps(`P(${wTex}) = P(A \\cup B) - P(${kTex}) + P(A \\cap B) = ${pd(u)} - ${pd(known)} + ${pd(ab)} = ${pd(want)}`)}`,
          ),
          [hundredths(u - known), hundredths(u - known - ab), hundredths(u + known - ab)].filter((w) => w.cmp(Q.one) <= 0),
        );
      },
    },
  ],
};

/** applyingTheAdditionLawWithEventComplements is outline topic 6.17.8. */
export const applyingTheAdditionLawWithEventComplements: TopicDef = {
  id: "applying-the-addition-law-with-event-complements",
  title: t("Applying the Addition Law With Event Complements", "结合对立事件应用加法公式"),
  summary: t(
    "Combine the addition law with P(A') = 1 − P(A) to find the probability of neither event and to work from complements.",
    "把加法公式与 P(A') = 1 − P(A) 结合，求两事件都不发生的概率，并由对立事件求解。",
  ),
  prerequisites: ["the-addition-law-of-probability", "computing-probabilities-of-events-containing-complements-using-venn-diagrams"],
  encompasses: [
    { topic: "the-addition-law-of-probability", weight: 0.6 },
    { topic: "the-complement-of-an-event", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.7"],
  knowledgePoints: [
    {
      id: "probability-of-neither",
      title: t("The probability of neither event", "两事件都不发生的概率"),
      explanation: t(
        '"Neither $A$ nor $B$" is the complement of "$A$ or $B$": $(A \\cup B)\'$. Find $P(A \\cup B)$ with the addition law, then subtract from $1$:\n\n$$P(\\text{neither}) = 1 - \\big(P(A) + P(B) - P(A \\cap B)\\big)$$\n\nWith $P(A) = 0.4$, $P(B) = 0.35$ and $P(A \\cap B) = 0.15$: $P(A \\cup B) = 0.6$, so $P(\\text{neither}) = 0.4$.',
        "“$A$ 和 $B$ 都不发生”是“$A$ 或 $B$”的对立事件：$(A \\cup B)'$。先用加法公式求 $P(A \\cup B)$，再用 $1$ 减去它：\n\n$$P(\\text{都不发生}) = 1 - \\big(P(A) + P(B) - P(A \\cap B)\\big)$$\n\n若 $P(A) = 0.4$，$P(B) = 0.35$，$P(A \\cap B) = 0.15$：$P(A \\cup B) = 0.6$，所以 $P(\\text{都不发生}) = 0.4$。",
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const [who, whoZh, aEn, aZh, bEn, bZh] = rng.pick(additionContexts);
        return probProblem(
          t(
            `The probability that ${who} ${aEn} is $${pd(a)}$, that it ${bEn} is $${pd(b)}$, and that it ${aEn} and ${bEn} is $${pd(ab)}$. What is the probability that it does neither?`,
            `${whoZh}${aZh}的概率是 $${pd(a)}$，${bZh}的概率是 $${pd(b)}$，既${aZh}又${bZh}的概率是 $${pd(ab)}$。两者都不的概率是多少？`,
          ),
          hundredths(100 - u),
          t(
            `First $P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$. "Neither" is its complement:${steps(`P((A \\cup B)') = 1 - ${pd(u)} = ${pd(100 - u)}`)}`,
            `先求 $P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$。“都不”是它的对立事件：${steps(`P((A \\cup B)') = 1 - ${pd(u)} = ${pd(100 - u)}`)}`,
          ),
          [hundredths(u), hundredths(100 - a - b), hundredths(100 - ab), hundredths(100 - a - b - ab)],
        );
      },
    },
    {
      id: "working-from-complements",
      title: t("Working from complements", "由对立事件求解"),
      explanation: t(
        "When some probabilities are given as complements, first convert them with $P(A) = 1 - P(A')$, then apply the addition law.\n\nIf $P(A') = 0.7$, $P(B) = 0.45$ and $P(A \\cup B) = 0.6$: $P(A) = 0.3$, so $P(A \\cap B) = 0.3 + 0.45 - 0.6 = 0.15$.",
        "若某些概率以对立事件的形式给出，先用 $P(A) = 1 - P(A')$ 换算，再应用加法公式。\n\n若 $P(A') = 0.7$，$P(B) = 0.45$，$P(A \\cup B) = 0.6$：$P(A) = 0.3$，所以 $P(A \\cap B) = 0.3 + 0.45 - 0.6 = 0.15$。",
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const kind = rng.int(0, 2);
        if (kind === 0) {
          return probProblem(
            t(
              `For events $A$ and $B$, $P(A') = ${pd(100 - a)}$, $P(B') = ${pd(100 - b)}$ and $P(A \\cap B) = ${pd(ab)}$. Find $P(A \\cup B)$.`,
              `事件 $A$、$B$ 满足 $P(A') = ${pd(100 - a)}$，$P(B') = ${pd(100 - b)}$，$P(A \\cap B) = ${pd(ab)}$。求 $P(A \\cup B)$。`,
            ),
            hundredths(u),
            t(
              `$P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$ and $P(B) = 1 - ${pd(100 - b)} = ${pd(b)}$:${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}`,
              `$P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$，$P(B) = 1 - ${pd(100 - b)} = ${pd(b)}$：${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}`,
            ),
            [hundredths(200 - a - b - ab), hundredths(100 - u), hundredths(a + b)].filter((w) => w.cmp(Q.one) <= 0),
          );
        }
        if (kind === 1) {
          return probProblem(
            t(
              `For events $A$ and $B$, $P(A') = ${pd(100 - a)}$, $P(B) = ${pd(b)}$ and $P(A \\cup B) = ${pd(u)}$. Find $P(A \\cap B)$.`,
              `事件 $A$、$B$ 满足 $P(A') = ${pd(100 - a)}$，$P(B) = ${pd(b)}$，$P(A \\cup B) = ${pd(u)}$。求 $P(A \\cap B)$。`,
            ),
            hundredths(ab),
            t(
              `$P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$:${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}`,
              `$P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$：${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}`,
            ),
            [hundredths(100 - a + b - u), hundredths(u - b), hundredths(100 - ab)].filter((w) => w.sign() > 0 && w.cmp(Q.one) <= 0),
          );
        }
        return probProblem(
          t(
            `For events $A$ and $B$, $P(A) = ${pd(a)}$, $P(B) = ${pd(b)}$ and $P((A \\cup B)') = ${pd(100 - u)}$. Find $P(A \\cap B)$.`,
            `事件 $A$、$B$ 满足 $P(A) = ${pd(a)}$，$P(B) = ${pd(b)}$，$P((A \\cup B)') = ${pd(100 - u)}$。求 $P(A \\cap B)$。`,
          ),
          hundredths(ab),
          t(
            `$P(A \\cup B) = 1 - ${pd(100 - u)} = ${pd(u)}$:${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}`,
            `$P(A \\cup B) = 1 - ${pd(100 - u)} = ${pd(u)}$：${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}`,
          ),
          [hundredths(a + b - 100 + u), hundredths(100 - u), hundredths(a + b + u - 100)].filter((w) => w.sign() > 0 && w.cmp(Q.one) <= 0),
        );
      },
    },
  ],
};

/** mutuallyExclusiveEvents is outline topic 6.17.9. */
export const mutuallyExclusiveEvents: TopicDef = {
  id: "mutually-exclusive-events",
  title: t("Mutually Exclusive Events", "互斥事件"),
  summary: t(
    "Recognize mutually exclusive events and use P(A ∪ B) = P(A) + P(B) for them.",
    "识别互斥事件，并对其使用 P(A ∪ B) = P(A) + P(B)。",
  ),
  prerequisites: ["applying-the-addition-law-with-event-complements"],
  encompasses: [
    { topic: "the-addition-law-of-probability", weight: 0.4 },
    { topic: "the-intersection-of-sets", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.7"],
  knowledgePoints: [
    {
      id: "recognizing-mutually-exclusive-events",
      title: t("Recognizing mutually exclusive events", "识别互斥事件"),
      explanation: t(
        'Events $A$ and $B$ are **mutually exclusive** when they cannot happen together: they share no outcome, so $A \\cap B = \\varnothing$. In a Venn diagram their circles do not overlap.\n\nDrawing a card numbered $1$ to $10$: "even" and "less than $2$" are mutually exclusive, since $\\{2, 4, 6, 8, 10\\} \\cap \\{1\\} = \\varnothing$. "Even" and "a multiple of $3$" are not: both contain $6$.',
        "如果事件 $A$ 与 $B$ 不能同时发生，就称它们**互斥**：它们没有公共结果，即 $A \\cap B = \\varnothing$。在韦恩图中它们的圆不相交。\n\n从编号 $1$ 到 $10$ 的卡片中抽一张：“偶数”与“小于 $2$”互斥，因为 $\\{2, 4, 6, 8, 10\\} \\cap \\{1\\} = \\varnothing$。“偶数”与“$3$ 的倍数”不互斥：两者都含 $6$。",
      ),
      generate(rng) {
        const n = rng.pick([6, 8, 10, 12, 15, 20]);
        const s = range(1, n);
        const want = rng.bool();
        for (;;) {
          const e1 = numberEvent(rng, n);
          const e2 = numberEvent(rng, n);
          const a = s.filter(e1.test);
          const b = s.filter(e2.test);
          if (a.length === 0 || b.length === 0 || e1.en === e2.en) continue;
          const common = intersection(a, b);
          if ((common.length === 0) !== want) continue;
          const what =
            n === 6
              ? t("A six-sided die is rolled", "掷一枚六面骰子")
              : t(`A card is drawn from ${n} cards numbered 1 to ${n}`, `从编号 1 到 ${n} 的 ${n} 张卡片中抽一张`);
          return choiceProblem({
            prompt: t(
              `${what.en}. Let $A$ be the event that the number is ${e1.en}, and $B$ the event that it is ${e2.en}. Are $A$ and $B$ mutually exclusive?`,
              `${what["zh-CN"]}。事件 $A$ 表示这个数${e1.zh}，事件 $B$ 表示这个数${e2.zh}。$A$ 与 $B$ 互斥吗？`,
            ),
            options: yesNo,
            correct: want ? 0 : 1,
            solution: want
              ? t(
                  `$A = ${setTex(a)}$ and $B = ${setTex(b)}$ share no outcome, so $A \\cap B = \\varnothing$: they are mutually exclusive.`,
                  `$A = ${setTex(a)}$ 与 $B = ${setTex(b)}$ 没有公共结果，$A \\cap B = \\varnothing$：它们互斥。`,
                )
              : t(
                  `$A = ${setTex(a)}$ and $B = ${setTex(b)}$ share $${common.join(", ")}$, so both can happen at once: they are not mutually exclusive.`,
                  `$A = ${setTex(a)}$ 与 $B = ${setTex(b)}$ 有公共结果 $${common.join(", ")}$，两者可以同时发生：它们不互斥。`,
                ),
          });
        }
      },
    },
    {
      id: "adding-probabilities-of-mutually-exclusive-events",
      title: t("Adding probabilities of mutually exclusive events", "互斥事件的概率相加"),
      explanation: t(
        "For mutually exclusive events $P(A \\cap B) = 0$, so the addition law becomes\n\n$$P(A \\cup B) = P(A) + P(B)$$\n\nA spinner lands on red with probability $0.25$ and on blue with probability $0.4$. It cannot land on both, so $P(\\text{red or blue}) = 0.65$ and $P(\\text{neither}) = 1 - 0.65 = 0.35$.",
        "对互斥事件，$P(A \\cap B) = 0$，所以加法公式变为\n\n$$P(A \\cup B) = P(A) + P(B)$$\n\n转盘停在红色的概率是 $0.25$，停在蓝色的概率是 $0.4$。它不能同时停在两种颜色上，所以 $P(\\text{红或蓝}) = 0.65$，$P(\\text{都不是}) = 1 - 0.65 = 0.35$。",
      ),
      generate(rng) {
        const a = rng.int(5, 60);
        const b = rng.int(5, 90 - a);
        const [c1, c2] = rng.sample(colors, 2);
        const neither = rng.bool(0.4);
        const answer = neither ? 100 - a - b : a + b;
        return probProblem(
          t(
            `A spinner lands on ${c1![0]} with probability $${pd(a)}$ and on ${c2![0]} with probability $${pd(b)}$. ${neither ? `What is the probability that it lands on neither ${c1![0]} nor ${c2![0]}?` : `What is the probability that it lands on ${c1![0]} or ${c2![0]}?`}`,
            `转盘停在${c1![1]}色的概率是 $${pd(a)}$，停在${c2![1]}色的概率是 $${pd(b)}$。${neither ? `既不停在${c1![1]}色也不停在${c2![1]}色的概率是多少？` : `停在${c1![1]}色或${c2![1]}色的概率是多少？`}`,
          ),
          hundredths(answer),
          t(
            `The spinner cannot land on two colors at once, so the events are mutually exclusive:${steps(`P(\\text{${c1![0]} or ${c2![0]}}) = ${pd(a)} + ${pd(b)} = ${pd(a + b)}`)}${neither ? `Then $P(\\text{neither}) = 1 - ${pd(a + b)} = ${pd(answer)}$.` : ""}`,
            `转盘不能同时停在两种颜色上，所以这两个事件互斥：${steps(`P = ${pd(a)} + ${pd(b)} = ${pd(a + b)}`)}${neither ? `所以两者都不的概率是 $1 - ${pd(a + b)} = ${pd(answer)}$。` : ""}`,
          ),
          [Q.of(a * b, 10000), hundredths(neither ? a + b : 100 - a - b), hundredths(Math.abs(a - b))],
        );
      },
    },
    {
      id: "testing-for-mutual-exclusivity",
      title: t("Testing with probabilities", "用概率检验互斥"),
      explanation: t(
        "Events are mutually exclusive exactly when $P(A \\cap B) = 0$, which by the addition law means $P(A \\cup B) = P(A) + P(B)$.\n\nIf $P(A) = 0.3$, $P(B) = 0.5$ and $P(A \\cup B) = 0.8$, then $P(A \\cap B) = 0.3 + 0.5 - 0.8 = 0$: mutually exclusive. If instead $P(A \\cup B) = 0.7$, then $P(A \\cap B) = 0.1$: not mutually exclusive.",
        "事件互斥当且仅当 $P(A \\cap B) = 0$，由加法公式，这等价于 $P(A \\cup B) = P(A) + P(B)$。\n\n若 $P(A) = 0.3$，$P(B) = 0.5$，$P(A \\cup B) = 0.8$，则 $P(A \\cap B) = 0.3 + 0.5 - 0.8 = 0$：互斥。若 $P(A \\cup B) = 0.7$，则 $P(A \\cap B) = 0.1$：不互斥。",
      ),
      generate(rng) {
        const a = rng.int(5, 60);
        const b = rng.int(5, 95 - a);
        const exclusive = rng.bool();
        const ab = exclusive ? 0 : rng.int(1, Math.min(a, b) - 1);
        const u = a + b - ab;
        return choiceProblem({
          prompt: t(
            `For events $A$ and $B$, $P(A) = ${pd(a)}$, $P(B) = ${pd(b)}$ and $P(A \\cup B) = ${pd(u)}$. Are $A$ and $B$ mutually exclusive?`,
            `事件 $A$、$B$ 满足 $P(A) = ${pd(a)}$，$P(B) = ${pd(b)}$，$P(A \\cup B) = ${pd(u)}$。$A$ 与 $B$ 互斥吗？`,
          ),
          options: yesNo,
          correct: exclusive ? 0 : 1,
          solution: t(
            `${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${exclusive ? "The intersection has probability $0$, so they are mutually exclusive." : "The intersection has a positive probability, so they are not mutually exclusive."}`,
            `${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${exclusive ? "交集的概率为 $0$，所以它们互斥。" : "交集的概率为正，所以它们不互斥。"}`,
          ),
        });
      },
    },
  ],
};

export const probabilityTopics: readonly TopicDef[] = [
  sets,
  experimentalProbability,
  usingExperimentalProbabilityToMakePredictions,
  sampleSpacesAndEventsInProbability,
  theLikelihoodOfAnEvent,
  singleEventsInProbability,
  usingProbabilityToMakePredictions,
  theComplementOfAnEvent,
  vennDiagramsInProbability,
  geometricProbability,
  theUnionOfSets,
  theIntersectionOfSets,
  compoundEventsInProbabilityFromExperimentalData,
  computingProbabilitiesForCompoundEventsUsingVennDiagrams,
  computingProbabilitiesOfEventsContainingComplementsUsingVennDiagrams,
  computingProbabilitiesForThreeEventsUsingVennDiagrams,
  theAdditionLawOfProbability,
  applyingTheAdditionLawWithEventComplements,
  mutuallyExclusiveEvents,
];
