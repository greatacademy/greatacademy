import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { range, setProblem, setTex } from "./methods-of-proof-common.ts";
import { modPow } from "./methods-of-proof-congruence.ts";
import { gcd, mod } from "./methods-of-proof-number-theory.ts";

// Methods of Proof unit 7: relations and equivalence relations.

/** math wraps LaTeX as an option. */
const math = (s: string) => t(`$${s}$`, `$${s}$`);

/** par wraps a negative number in parentheses. */
const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** Pair is an ordered pair of a relation. */
type Pair = readonly [number, number];

/** pairKey identifies a pair for set membership. */
const pairKey = (p: Pair) => `${p[0]},${p[1]}`;

/** sortPairs orders pairs lexicographically and removes duplicates. */
function sortPairs(r: readonly Pair[]): Pair[] {
  const seen = new Set<string>();
  const out: Pair[] = [];
  for (const p of r)
    if (!seen.has(pairKey(p))) {
      seen.add(pairKey(p));
      out.push(p);
    }
  return out.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
}

/** relTex writes a finite relation as a set of pairs. */
const relTex = (r: readonly Pair[]) =>
  r.length === 0
    ? "\\varnothing"
    : `\\{${sortPairs(r)
        .map(([a, b]) => `(${a}, ${b})`)
        .join(", ")}\\}`;

/** has tests whether (a, b) is in the relation. */
const has = (r: readonly Pair[], a: number, b: number) => r.some(([x, y]) => x === a && y === b);

/** pairsOf lists A × A for A = {1, …, n}. */
const pairsOf = (n: number): Pair[] => range(1, n).flatMap((a) => range(1, n).map((b) => [a, b] as const));

/** isSymmetric tests symmetry. */
const isSymmetric = (r: readonly Pair[]) => r.every(([a, b]) => has(r, b, a));

/** transitivityGap finds pairs (a, b), (b, c) whose (a, c) is missing, or undefined when the relation is transitive. */
function transitivityGap(r: readonly Pair[]): [number, number, number] | undefined {
  for (const [a, b] of r) for (const [b2, c] of r) if (b === b2 && !has(r, a, c)) return [a, b, c];
  return undefined;
}

/** transitiveClosure adds pairs until the relation is transitive. */
function transitiveClosure(r: readonly Pair[]): Pair[] {
  let out = sortPairs(r);
  for (let gap = transitivityGap(out); gap; gap = transitivityGap(out)) out = sortPairs([...out, [gap[0], gap[2]]]);
  return out;
}

/** randomRel picks a relation on {1, …, n} where each pair appears with probability p percent. */
const randomRel = (rng: Rng, n: number, p: number) => pairsOf(n).filter(() => rng.int(1, 100) <= p);

/** RuleRel is a relation on a set of numbers given by a rule. */
interface RuleRel {
  readonly tex: string;
  readonly holds: (a: number, b: number) => boolean;
}

/** finiteRule picks a rule for a relation between small positive integers. */
function finiteRule(rng: Rng): RuleRel {
  const k = rng.int(2, 4);
  const s = rng.int(4, 9);
  return rng.pick<RuleRel>([
    { tex: "a < b", holds: (a, b) => a < b },
    { tex: "a \\le b", holds: (a, b) => a <= b },
    { tex: "a \\mid b", holds: (a, b) => b % a === 0 },
    { tex: `a + b = ${s}`, holds: (a, b) => a + b === s },
    { tex: `b = a + ${k - 1}`, holds: (a, b) => b === a + k - 1 },
    { tex: `${k} \\mid a + b`, holds: (a, b) => (a + b) % k === 0 },
    { tex: `|a - b| \\le ${k - 1}`, holds: (a, b) => Math.abs(a - b) <= k - 1 },
    { tex: `a + b > ${s}`, holds: (a, b) => a + b > s },
    { tex: `b = ${k}a`, holds: (a, b) => b === k * a },
  ]);
}

/** relationsOnFiniteSets builds relations as subsets of A × B. */
export const relationsOnFiniteSets: TopicDef = {
  id: "relations-on-finite-sets",
  title: t("Relations on Finite Sets", "有限集上的关系"),
  summary: t(
    "A relation from A to B is a subset R ⊆ A × B; we write a R b when (a, b) ∈ R.",
    "从 A 到 B 的关系是一个子集 R ⊆ A × B；当 (a, b) ∈ R 时记作 a R b。",
  ),
  prerequisites: ["the-cartesian-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-pairs-in-a-relation",
      title: t("Counting pairs in a relation", "统计关系中的序对"),
      explanation: t(
        "Let $A = \\{1, 2, 3, 4\\}$ and $R = \\{(a, b) \\in A \\times A : a < b\\}$. Then $R = \\{(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)\\}$ has $6$ pairs.",
        "设 $A = \\{1, 2, 3, 4\\}$，$R = \\{(a, b) \\in A \\times A : a < b\\}$。则 $R = \\{(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)\\}$，共 $6$ 个序对。",
      ),
      generate(rng) {
        const n = rng.int(4, 7);
        let rule: RuleRel;
        let r: Pair[];
        do {
          rule = finiteRule(rng);
          r = pairsOf(n).filter(([a, b]) => rule.holds(a, b));
        } while (r.length === 0);
        return numberProblem({
          prompt: t(
            `Let $A = ${setTex(range(1, n))}$ and $R = \\{(a, b) \\in A \\times A : ${rule.tex}\\}$. How many pairs are in $R$?`,
            `设 $A = ${setTex(range(1, n))}$，$R = \\{(a, b) \\in A \\times A : ${rule.tex}\\}$。$R$ 中有多少个序对？`,
          ),
          answer: r.length,
          wrong: [r.length + 1, r.length - 1, n * n - r.length],
          solution: t(
            `$R = ${relTex(r)}$, which has $${r.length}$ ${r.length === 1 ? "pair" : "pairs"}.`,
            `$R = ${relTex(r)}$，共 $${r.length}$ 个序对。`,
          ),
        });
      },
    },
    {
      id: "pairs-in-a-relation",
      title: t("Pairs in a relation", "关系中的序对"),
      explanation: t(
        "With $A = \\{1, \\dots, 6\\}$ and $a \\mathrel{R} b \\iff a \\mid b$: $(2, 6) \\in R$ because $2 \\mid 6$, but $(6, 2) \\notin R$. The order of a pair matters.",
        "取 $A = \\{1, \\dots, 6\\}$，$a \\mathrel{R} b \\iff a \\mid b$：$(2, 6) \\in R$，因为 $2 \\mid 6$；但 $(6, 2) \\notin R$。序对的顺序很重要。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        let rule: RuleRel;
        let ins: Pair[];
        let outs: Pair[];
        do {
          rule = finiteRule(rng);
          ins = pairsOf(n).filter(([a, b]) => rule.holds(a, b));
          outs = pairsOf(n).filter(([a, b]) => !rule.holds(a, b));
        } while (ins.length === 0 || outs.length < 3);
        const right = rng.pick(ins);
        const wrong = rng.shuffle(outs).slice(0, 3);
        return oneOf(
          rng,
          t(
            `On $A = ${setTex(range(1, n))}$, let $a \\mathrel{R} b \\iff ${rule.tex}$. Which pair is in $R$?`,
            `在 $A = ${setTex(range(1, n))}$ 上，令 $a \\mathrel{R} b \\iff ${rule.tex}$。哪个序对属于 $R$？`,
          ),
          math(`(${right[0]}, ${right[1]})`),
          wrong.map(([a, b]) => math(`(${a}, ${b})`)),
          t(
            `With $a = ${right[0]}$ and $b = ${right[1]}$, the condition $${rule.tex}$ holds; it fails for the other pairs.`,
            `取 $a = ${right[0]}$，$b = ${right[1]}$，条件 $${rule.tex}$ 成立；其余序对都不满足。`,
          ),
        );
      },
    },
  ],
};

/** relationsOnInfiniteSets describes relations on ℤ and ℝ by rules. */
export const relationsOnInfiniteSets: TopicDef = {
  id: "relations-on-infinite-sets",
  title: t("Relations on Infinite Sets", "无限集上的关系"),
  summary: t(
    "Relations on infinite sets such as ℤ or ℝ are given by rules, such as a R b ⟺ a − b is even, or x R y ⟺ x² + y² = 1.",
    "ℤ、ℝ 等无限集上的关系由规则给出，例如 a R b ⟺ a − b 为偶数，或 x R y ⟺ x² + y² = 1。",
  ),
  prerequisites: ["relations-on-finite-sets"],
  encompasses: [{ topic: "relations-on-finite-sets", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "membership-in-relations-on-the-integers",
      title: t("Membership", "属于关系"),
      explanation: t(
        "On $\\mathbb{Z}$, let $a \\mathrel{R} b \\iff 3 \\mid a - b$. Then $(7, -2) \\in R$ since $7 - (-2) = 9$, but $(7, 2) \\notin R$ since $5$ is not a multiple of $3$.",
        "在 $\\mathbb{Z}$ 上，令 $a \\mathrel{R} b \\iff 3 \\mid a - b$。则 $(7, -2) \\in R$，因为 $7 - (-2) = 9$；但 $(7, 2) \\notin R$，因为 $5$ 不是 $3$ 的倍数。",
      ),
      generate(rng) {
        const k = rng.int(2, 7);
        const c = rng.int(1, 9);
        const rules: RuleRel[] = [
          { tex: `${k} \\mid a - b`, holds: (a, b) => mod(a - b, k) === 0 },
          { tex: `b = ${k}a${c > 0 ? ` + ${c}` : ""}`, holds: (a, b) => b === k * a + c },
          { tex: `a^2 + b^2 = ${k * k + c * c}`, holds: (a, b) => a * a + b * b === k * k + c * c },
          { tex: `a < b < a + ${k}`, holds: (a, b) => a < b && b < a + k },
          { tex: `ab = ${k * c}`, holds: (a, b) => a * b === k * c },
        ];
        const rule = rng.pick(rules);
        const cands = range(-12, 12).flatMap((a) => range(-30, 30).map((b) => [a, b] as Pair));
        const ins = cands.filter(([a, b]) => rule.holds(a, b));
        const outs = cands.filter(([a, b]) => !rule.holds(a, b) && ins.some(([x, y]) => Math.abs(x - a) + Math.abs(y - b) <= 2));
        const right = rng.pick(ins);
        const wrong = rng.shuffle(outs).slice(0, 3);
        return oneOf(
          rng,
          t(
            `On $\\mathbb{Z}$, let $a \\mathrel{R} b \\iff ${rule.tex}$. Which pair is in $R$?`,
            `在 $\\mathbb{Z}$ 上，令 $a \\mathrel{R} b \\iff ${rule.tex}$。哪个序对属于 $R$？`,
          ),
          math(`(${right[0]}, ${right[1]})`),
          wrong.map(([a, b]) => math(`(${a}, ${b})`)),
          t(
            `For $(${right[0]}, ${right[1]})$ the condition $${rule.tex}$ holds; check each of the others and it fails.`,
            `对 $(${right[0]}, ${right[1]})$，条件 $${rule.tex}$ 成立；逐一检验其余序对，都不成立。`,
          ),
        );
      },
    },
    {
      id: "counting-related-elements",
      title: t("Counting related elements", "统计相关元素"),
      explanation: t(
        "On $\\mathbb{Z}$, let $a \\mathrel{R} b \\iff |a - b| \\le 2$. The integers $b$ with $5 \\mathrel{R} b$ are $3, 4, 5, 6, 7$: five of them.",
        "在 $\\mathbb{Z}$ 上，令 $a \\mathrel{R} b \\iff |a - b| \\le 2$。满足 $5 \\mathrel{R} b$ 的整数 $b$ 是 $3, 4, 5, 6, 7$：共五个。",
      ),
      generate(rng) {
        const a = rng.int(-9, 12);
        const k = rng.int(1, 6);
        const kind = rng.int(0, 2);
        const r = rng.int(10, 60);
        const kinds: [string, (x: number, y: number) => boolean][] = [
          [`|x - y| \\le ${k}`, (x: number, y: number) => Math.abs(x - y) <= k],
          [`|x - y| < ${k}`, (x: number, y: number) => Math.abs(x - y) < k],
          [`x^2 + y^2 \\le ${r}`, (x: number, y: number) => x * x + y * y <= r],
        ];
        const [tex, holds] = kinds[kind]!;
        const x0 = kind === 2 ? rng.int(-3, 3) : a;
        const ys = range(-100, 100).filter((y) => holds(x0, y));
        return numberProblem({
          prompt: t(
            `On $\\mathbb{Z}$, let $x \\mathrel{R} y \\iff ${tex}$. How many integers $y$ satisfy $${x0} \\mathrel{R} y$?`,
            `在 $\\mathbb{Z}$ 上，令 $x \\mathrel{R} y \\iff ${tex}$。有多少个整数 $y$ 满足 $${x0} \\mathrel{R} y$？`,
          ),
          answer: ys.length,
          wrong: [ys.length + 1, ys.length - 1, kind === 0 ? k : 2 * k],
          solution: t(
            ys.length === 0 ? "No integer works." : `They are $${ys[0]} \\le y \\le ${ys[ys.length - 1]}$: $${ys.length}$ integers.`,
            ys.length === 0 ? "没有满足条件的整数。" : `它们是 $${ys[0]} \\le y \\le ${ys[ys.length - 1]}$：共 $${ys.length}$ 个整数。`,
          ),
        });
      },
    },
  ],
};

/** theDomainAndRangeOfARelation finds the first and second coordinates of a relation. */
export const theDomainAndRangeOfARelation: TopicDef = {
  id: "the-domain-and-range-of-a-relation",
  title: t("The Domain and Range of a Relation", "关系的定义域与值域"),
  summary: t(
    "The domain of R is the set of first coordinates of its pairs; the range is the set of second coordinates.",
    "R 的定义域是其序对第一个坐标组成的集合；值域是第二个坐标组成的集合。",
  ),
  prerequisites: ["relations-on-infinite-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "domain-and-range-of-a-finite-relation",
      title: t("Finite relations", "有限关系"),
      explanation: t(
        "For $R = \\{(1, 4), (2, 4), (2, 5), (6, 1)\\}$: $\\operatorname{dom} R = \\{1, 2, 6\\}$ and $\\operatorname{ran} R = \\{1, 4, 5\\}$.",
        "对 $R = \\{(1, 4), (2, 4), (2, 5), (6, 1)\\}$：$\\operatorname{dom} R = \\{1, 2, 6\\}$，$\\operatorname{ran} R = \\{1, 4, 5\\}$。",
      ),
      generate(rng) {
        const size = rng.int(3, 6);
        const r = sortPairs(range(1, size).map(() => [rng.int(1, 9), rng.int(1, 9)] as Pair));
        const dom = r.map(([a]) => a);
        const ran = r.map(([, b]) => b);
        const askDom = rng.bool();
        return setProblem({
          prompt: t(
            `Find the ${askDom ? "domain" : "range"} of $R = ${relTex(r)}$.`,
            `求 $R = ${relTex(r)}$ 的${askDom ? "定义域" : "值域"}。`,
          ),
          values: askDom ? dom : ran,
          wrong: [askDom ? ran : dom, [...dom, ...ran]],
          solution: t(
            `The ${askDom ? "first" : "second"} coordinates are $${setTex(askDom ? dom : ran)}$.`,
            `${askDom ? "第一个" : "第二个"}坐标组成 $${setTex(askDom ? dom : ran)}$。`,
          ),
        });
      },
    },
    {
      id: "domain-and-range-of-a-relation-on-the-reals",
      title: t("Relations on ℝ", "ℝ 上的关系"),
      explanation: t(
        "For $R = \\{(x, y) \\in \\mathbb{R}^2 : y^2 = x - 3\\}$: a real $y$ exists exactly when $x \\ge 3$, so $\\operatorname{dom} R = [3, \\infty)$, and every real $y$ occurs, so $\\operatorname{ran} R = \\mathbb{R}$.",
        "对 $R = \\{(x, y) \\in \\mathbb{R}^2 : y^2 = x - 3\\}$：当且仅当 $x \\ge 3$ 时存在实数 $y$，所以 $\\operatorname{dom} R = [3, \\infty)$；每个实数 $y$ 都出现，所以 $\\operatorname{ran} R = \\mathbb{R}$。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const r = rng.int(1, 6);
        const rels: [string, string, string, string[]][] = [
          [`y^2 = x - ${c}`, `[${c}, \\infty)`, "\\mathbb{R}", [`[-${c}, \\infty)`, `[0, \\infty)`, `(${c}, \\infty)`]],
          [`y = \\sqrt{x + ${c}}`, `[-${c}, \\infty)`, "[0, \\infty)", [`[${c}, \\infty)`, "\\mathbb{R}", `(-${c}, \\infty)`]],
          [`x^2 + y^2 = ${r * r}`, `[-${r}, ${r}]`, `[-${r}, ${r}]`, [`[0, ${r}]`, `[-${r * r}, ${r * r}]`, "\\mathbb{R}"]],
          [
            `y = \\dfrac{1}{x - ${c}}`,
            `\\mathbb{R} \\setminus \\{${c}\\}`,
            "\\mathbb{R} \\setminus \\{0\\}",
            [`\\mathbb{R} \\setminus \\{-${c}\\}`, "\\mathbb{R}", `(${c}, \\infty)`],
          ],
          [`x = y^2 + ${c}`, `[${c}, \\infty)`, "\\mathbb{R}", [`[0, \\infty)`, `[-${c}, \\infty)`, `(${c}, \\infty)`]],
          [`|y| = x - ${c}`, `[${c}, \\infty)`, "\\mathbb{R}", [`[0, \\infty)`, `(${c}, \\infty)`, `[-${c}, \\infty)`]],
        ];
        const [rel, dom, ran, wrongs] = rng.pick(rels);
        const askDom = rng.bool();
        const right = askDom ? dom : ran;
        const other = askDom ? ran : dom;
        return oneOf(
          rng,
          t(
            `Find the ${askDom ? "domain" : "range"} of $R = \\{(x, y) \\in \\mathbb{R}^2 : ${rel}\\}$.`,
            `求 $R = \\{(x, y) \\in \\mathbb{R}^2 : ${rel}\\}$ 的${askDom ? "定义域" : "值域"}。`,
          ),
          math(right),
          [other, ...wrongs].map(math),
          t(
            `The $x$-values with at least one partner $y$ form $${dom}$, and the $y$-values that occur form $${ran}$.`,
            `至少有一个对应 $y$ 的 $x$ 组成 $${dom}$，出现过的 $y$ 组成 $${ran}$。`,
          ),
        );
      },
    },
  ],
};

/** graphicalRepresentationsOfRelations draws relations as directed graphs and matrices. */
export const graphicalRepresentationsOfRelations: TopicDef = {
  id: "graphical-representations-of-relations",
  title: t("Graphical Representations of Relations", "关系的图形表示"),
  summary: t(
    "A relation on a finite set can be drawn as a directed graph (an arrow a → b for each pair, a loop for (a, a)) or written as a 0–1 matrix.",
    "有限集上的关系可以画成有向图（每个序对画一条箭头 a → b，(a, a) 画成自环），也可以写成 0–1 矩阵。",
  ),
  prerequisites: ["relations-on-finite-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reading-a-directed-graph",
      title: t("Directed graphs", "有向图"),
      explanation: t(
        "In the directed graph of $R = \\{(1, 1), (1, 2), (2, 3), (3, 1), (3, 2)\\}$ there is one loop (at $1$), and vertex $3$ has two outgoing arrows (to $1$ and $2$).",
        "在 $R = \\{(1, 1), (1, 2), (2, 3), (3, 1), (3, 2)\\}$ 的有向图中有一个自环（在 $1$ 处），顶点 $3$ 有两条出边（指向 $1$ 和 $2$）。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const r = sortPairs(randomRel(rng, n, 40));
        const v = rng.int(1, n);
        const kind = rng.int(0, 2);
        const loops = r.filter(([a, b]) => a === b).length;
        const outs = r.filter(([a]) => a === v).length;
        const ins = r.filter(([, b]) => b === v).length;
        const [en, zh, value, alt] = [
          ["How many loops does its directed graph have?", "它的有向图有多少个自环？", loops, r.length],
          [`How many arrows leave vertex $${v}$ (counting a loop)?`, `从顶点 $${v}$ 出发的箭头有多少条（自环也算）？`, outs, ins],
          [`How many arrows enter vertex $${v}$ (counting a loop)?`, `指向顶点 $${v}$ 的箭头有多少条（自环也算）？`, ins, outs],
        ][kind] as [string, string, number, number];
        return numberProblem({
          prompt: t(
            `Let $R = ${relTex(r)}$ on $${setTex(range(1, n))}$. ${en}`,
            `设 $R = ${relTex(r)}$ 是 $${setTex(range(1, n))}$ 上的关系。${zh}`,
          ),
          answer: value,
          wrong: [alt, value + 1, Math.max(0, value - 1)],
          solution: t(
            kind === 0
              ? `Loops are the pairs $(a, a)$: there ${loops === 1 ? "is $1$" : `are $${loops}$`}.`
              : `Count the pairs with $${v}$ as the ${kind === 1 ? "first" : "second"} coordinate: $${value}$.`,
            kind === 0
              ? `自环就是形如 $(a, a)$ 的序对：共 $${loops}$ 个。`
              : `统计${kind === 1 ? "第一个" : "第二个"}坐标为 $${v}$ 的序对：共 $${value}$ 个。`,
          ),
        });
      },
    },
    {
      id: "the-matrix-of-a-relation",
      title: t("The matrix of a relation", "关系矩阵"),
      explanation: t(
        "The matrix of a relation on $\\{1, \\dots, n\\}$ has entry $1$ in row $i$, column $j$ when $(i, j) \\in R$, and $0$ otherwise. For $R = \\{(1, 2), (2, 1), (2, 3)\\}$ on $\\{1, 2, 3\\}$, row $2$ is $1\\,0\\,1$.",
        "$\\{1, \\dots, n\\}$ 上关系的矩阵：若 $(i, j) \\in R$，第 $i$ 行第 $j$ 列为 $1$，否则为 $0$。对 $\\{1, 2, 3\\}$ 上的 $R = \\{(1, 2), (2, 1), (2, 3)\\}$，第 $2$ 行是 $1\\,0\\,1$。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        let r: Pair[];
        let i: number;
        let row: string;
        let col: string;
        do {
          r = sortPairs(randomRel(rng, n, 45));
          i = rng.int(1, n);
          row = range(1, n)
            .map((j) => (has(r, i, j) ? 1 : 0))
            .join("\\,");
          col = range(1, n)
            .map((j) => (has(r, j, i) ? 1 : 0))
            .join("\\,");
        } while (row === col);
        const flip = row
          .split("\\,")
          .map((x) => (x === "1" ? "0" : "1"))
          .join("\\,");
        const rev = row.split("\\,").reverse().join("\\,");
        return oneOf(
          rng,
          t(
            `Let $R = ${relTex(r)}$ on $${setTex(range(1, n))}$. What is row $${i}$ of the matrix of $R$?`,
            `设 $R = ${relTex(r)}$ 是 $${setTex(range(1, n))}$ 上的关系。$R$ 的矩阵第 $${i}$ 行是什么？`,
          ),
          math(row),
          [col, flip, rev].map(math),
          t(
            `Row $${i}$ has a $1$ in column $j$ exactly when $(${i}, j) \\in R$: $${row}$.`,
            `第 $${i}$ 行第 $j$ 列为 $1$ 当且仅当 $(${i}, j) \\in R$：$${row}$。`,
          ),
        );
      },
    },
  ],
};

/** operationsOnRelations forms inverses and compositions of relations. */
export const operationsOnRelations: TopicDef = {
  id: "operations-on-relations",
  title: t("Operations on Relations", "关系的运算"),
  summary: t(
    "R⁻¹ = {(b, a) : (a, b) ∈ R}; the composition S ∘ R = {(a, c) : a R b and b S c for some b}.",
    "R⁻¹ = {(b, a) : (a, b) ∈ R}；复合 S ∘ R = {(a, c) : 存在 b 使 a R b 且 b S c}。",
  ),
  prerequisites: ["the-domain-and-range-of-a-relation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-inverse-relation",
      title: t("The inverse relation", "逆关系"),
      explanation: t(
        "Reverse every pair: if $R = \\{(1, 3), (2, 3), (4, 1)\\}$, then $R^{-1} = \\{(3, 1), (3, 2), (1, 4)\\}$. The domain of $R^{-1}$ is the range of $R$.",
        "把每个序对反过来：若 $R = \\{(1, 3), (2, 3), (4, 1)\\}$，则 $R^{-1} = \\{(3, 1), (3, 2), (1, 4)\\}$。$R^{-1}$ 的定义域就是 $R$ 的值域。",
      ),
      generate(rng) {
        let r: Pair[];
        do r = sortPairs(range(1, rng.int(3, 4)).map(() => [rng.int(1, 6), rng.int(1, 6)] as Pair));
        while (r.length < 3 || isSymmetric(r));
        const inv = r.map(([a, b]) => [b, a] as Pair);
        const half = r.map((p, i) => (i === 0 ? ([p[1], p[0]] as Pair) : p));
        const comp = r.map(([a, b]) => [7 - a, 7 - b] as Pair);
        const neg = inv.map(([a, b], i) => (i === inv.length - 1 ? ([a, a] as Pair) : ([a, b] as Pair)));
        return oneOf(
          rng,
          t(`Let $R = ${relTex(r)}$. What is $R^{-1}$?`, `设 $R = ${relTex(r)}$。$R^{-1}$ 是什么？`),
          math(relTex(inv)),
          [r, half, comp, neg].map((x) => math(relTex(x))),
          t(`Reverse each pair: $R^{-1} = ${relTex(inv)}$.`, `把每个序对反过来：$R^{-1} = ${relTex(inv)}$。`),
        );
      },
    },
    {
      id: "composing-relations",
      title: t("Composing relations", "关系的复合"),
      explanation: t(
        "With $R = \\{(1, 2), (1, 3), (2, 2)\\}$ and $S = \\{(2, 5), (3, 6)\\}$: $1 \\to 2 \\to 5$, $1 \\to 3 \\to 6$ and $2 \\to 2 \\to 5$, so $S \\circ R = \\{(1, 5), (1, 6), (2, 5)\\}$.",
        "取 $R = \\{(1, 2), (1, 3), (2, 2)\\}$，$S = \\{(2, 5), (3, 6)\\}$：$1 \\to 2 \\to 5$，$1 \\to 3 \\to 6$，$2 \\to 2 \\to 5$，所以 $S \\circ R = \\{(1, 5), (1, 6), (2, 5)\\}$。",
      ),
      generate(rng) {
        let r: Pair[];
        let s: Pair[];
        let comp: Pair[];
        do {
          r = sortPairs(range(1, 4).map(() => [rng.int(1, 4), rng.int(1, 4)] as Pair));
          s = sortPairs(range(1, 4).map(() => [rng.int(1, 4), rng.int(1, 4)] as Pair));
          comp = sortPairs(r.flatMap(([a, b]) => s.filter(([b2]) => b2 === b).map(([, c]) => [a, c] as Pair)));
        } while (comp.length === 0);
        const other = sortPairs(s.flatMap(([a, b]) => r.filter(([b2]) => b2 === b).map(([, c]) => [a, c] as Pair)));
        return numberProblem({
          prompt: t(
            `Let $R = ${relTex(r)}$ and $S = ${relTex(s)}$. How many pairs are in $S \\circ R = \\{(a, c) : a \\mathrel{R} b \\text{ and } b \\mathrel{S} c \\text{ for some } b\\}$?`,
            `设 $R = ${relTex(r)}$，$S = ${relTex(s)}$。$S \\circ R = \\{(a, c) : \\text{存在 } b \\text{ 使 } a \\mathrel{R} b \\text{ 且 } b \\mathrel{S} c\\}$ 中有多少个序对？`,
          ),
          answer: comp.length,
          wrong: [other.length, r.length * s.length, comp.length + 1],
          solution: t(
            `$S \\circ R = ${relTex(comp)}$: $${comp.length}$ pairs.`,
            `$S \\circ R = ${relTex(comp)}$：共 $${comp.length}$ 个序对。`,
          ),
        });
      },
    },
  ],
};

/** nAryRelations studies relations among three or more sets. */
export const nAryRelations: TopicDef = {
  id: "n-ary-relations",
  title: t("n-ary Relations", "n 元关系"),
  summary: t(
    "An n-ary relation on sets A₁, …, Aₙ is a subset of A₁ × ⋯ × Aₙ, a set of n-tuples.",
    "集合 A₁, …, Aₙ 上的 n 元关系是 A₁ × ⋯ × Aₙ 的子集，即一组 n 元组。",
  ),
  prerequisites: ["relations-on-finite-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-tuples",
      title: t("Counting tuples", "统计元组"),
      explanation: t(
        "On $A = \\{1, 2, 3, 4\\}$, the ternary relation $\\{(a, b, c) \\in A^3 : a + b = c\\}$ contains $(1, 1, 2), (1, 2, 3), (2, 1, 3), (1, 3, 4), (2, 2, 4), (3, 1, 4)$: six triples.",
        "在 $A = \\{1, 2, 3, 4\\}$ 上，三元关系 $\\{(a, b, c) \\in A^3 : a + b = c\\}$ 包含 $(1, 1, 2), (1, 2, 3), (2, 1, 3), (1, 3, 4), (2, 2, 4), (3, 1, 4)$：共六个三元组。",
      ),
      generate(rng) {
        const n = rng.int(3, 7);
        const s = rng.int(5, 12);
        const rules: [string, (a: number, b: number, c: number) => boolean][] = [
          ["a + b = c", (a, b, c) => a + b === c],
          ["a < b < c", (a, b, c) => a < b && b < c],
          ["a \\le b \\le c", (a, b, c) => a <= b && b <= c],
          [`a + b + c = ${s}`, (a, b, c) => a + b + c === s],
          ["a = b = c", (a, b, c) => a === b && b === c],
          ["ab = c", (a, b, c) => a * b === c],
        ];
        const [tex, holds] = rng.pick(rules);
        const count = range(1, n).reduce(
          (x, a) => x + range(1, n).reduce((y, b) => y + range(1, n).filter((c) => holds(a, b, c)).length, 0),
          0,
        );
        return numberProblem({
          prompt: t(
            `Let $A = ${setTex(range(1, n))}$. How many triples are in $\\{(a, b, c) \\in A^3 : ${tex}\\}$?`,
            `设 $A = ${setTex(range(1, n))}$。$\\{(a, b, c) \\in A^3 : ${tex}\\}$ 中有多少个三元组？`,
          ),
          answer: count,
          wrong: [count + 1, n ** 3 - count, Math.max(0, count - 1)],
          solution: t(
            `List the triples by their first entry and count: $${count}$.`,
            `按第一个分量分类列出三元组并计数：共 $${count}$ 个。`,
          ),
        });
      },
    },
    {
      id: "tuples-in-a-relation",
      title: t("Tuples in a relation", "关系中的元组"),
      explanation: t(
        "Let $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : x + 2y = z\\}$. Then $(3, 1, 5) \\in R$, but $(1, 3, 5) \\notin R$, since $1 + 6 = 7$. Positions matter.",
        "设 $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : x + 2y = z\\}$。则 $(3, 1, 5) \\in R$，但 $(1, 3, 5) \\notin R$，因为 $1 + 6 = 7$。分量的位置很重要。",
      ),
      generate(rng) {
        const o = rng.int(1, 3);
        const p = rng.int(2, 5);
        const q = rng.int(1, 4);
        const x = rng.int(-6, 6);
        const y = rng.int(-6, 6);
        const z = o * x + p * y + q;
        const tex = `${o === 1 ? "" : o}x + ${p}y + ${q} = z`;
        const wrong: [number, number, number][] = [
          [y, x, z],
          [x, y, z + 1],
          [x, y, x + y + q],
        ].filter(([a, b, c]) => o * a! + p * b! + q !== c) as [number, number, number][];
        const fmt = ([a, b, c]: readonly [number, number, number]) => math(`(${a}, ${b}, ${c})`);
        return oneOf(
          rng,
          t(
            `Let $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : ${tex}\\}$. Which triple is in $R$?`,
            `设 $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : ${tex}\\}$。哪个三元组属于 $R$？`,
          ),
          fmt([x, y, z]),
          wrong.map(fmt),
          t(
            `$${o === 1 ? "" : `${o} \\cdot `}${par(x)} + ${p} \\cdot ${par(y)} + ${q} = ${z}$.`,
            `$${o === 1 ? "" : `${o} \\cdot `}${par(x)} + ${p} \\cdot ${par(y)} + ${q} = ${z}$。`,
          ),
        );
      },
    },
  ],
};

/** functionalRelations identifies relations that are functions. */
export const functionalRelations: TopicDef = {
  id: "functional-relations",
  title: t("Functional Relations", "函数关系"),
  summary: t(
    "A relation R from A to B is a function when every a ∈ A is related to exactly one b ∈ B.",
    "若每个 a ∈ A 都恰与一个 b ∈ B 相关，则从 A 到 B 的关系 R 是函数。",
  ),
  prerequisites: ["the-domain-and-range-of-a-relation", "sets-and-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finite-functional-relations",
      title: t("Finite relations", "有限关系"),
      explanation: t(
        "From $A = \\{1, 2, 3\\}$ to $B = \\{4, 5\\}$: $\\{(1, 4), (2, 4), (3, 5)\\}$ is a function. $\\{(1, 4), (1, 5), (3, 5)\\}$ is not: $1$ has two partners and $2$ has none.",
        "从 $A = \\{1, 2, 3\\}$ 到 $B = \\{4, 5\\}$：$\\{(1, 4), (2, 4), (3, 5)\\}$ 是函数。$\\{(1, 4), (1, 5), (3, 5)\\}$ 不是：$1$ 有两个对应元素，$2$ 没有。",
      ),
      generate(rng) {
        const m = rng.int(3, 4);
        const B = [5, 6, 7, 8].slice(0, rng.int(2, 4));
        const kind = rng.int(0, 2);
        const r: Pair[] = range(1, m).map((a) => [a, rng.pick(B)] as Pair);
        const victim = rng.int(1, m);
        let bad: Pair[] = r;
        if (kind === 1) bad = [...r, [victim, rng.pick(B.filter((b) => b !== r[victim - 1]![1]))] as Pair];
        if (kind === 2) bad = r.filter(([a]) => a !== victim);
        const value = kind === 0;
        return oneOf(
          rng,
          t(
            `Is $${relTex(bad)}$ a function from $${setTex(range(1, m))}$ to $${setTex(B)}$?`,
            `$${relTex(bad)}$ 是从 $${setTex(range(1, m))}$ 到 $${setTex(B)}$ 的函数吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          [
            t(
              "Yes: each element of the domain appears exactly once as a first coordinate.",
              "是：定义域中每个元素恰好作为第一个坐标出现一次。",
            ),
            t(`No: $${victim}$ is related to two different elements.`, `不是：$${victim}$ 与两个不同的元素相关。`),
            t(`No: $${victim}$ is related to nothing.`, `不是：$${victim}$ 不与任何元素相关。`),
          ][kind]!,
        );
      },
    },
    {
      id: "functional-relations-on-the-reals",
      title: t("Relations on ℝ", "ℝ 上的关系"),
      explanation: t(
        "$\\{(x, y) : y = x^2\\}$ is a function $\\mathbb{R} \\to \\mathbb{R}$. $\\{(x, y) : x = y^2\\}$ is not: $x = 4$ is related to both $2$ and $-2$, and $x = -1$ to nothing.",
        "$\\{(x, y) : y = x^2\\}$ 是函数 $\\mathbb{R} \\to \\mathbb{R}$。$\\{(x, y) : x = y^2\\}$ 不是：$x = 4$ 同时与 $2$ 和 $-2$ 相关，而 $x = -1$ 不与任何数相关。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const rels: [string, boolean, Text][] = [
          [`y = x^2 - ${c}`, true, t("Each $x$ gives exactly one $y$.", "每个 $x$ 恰给出一个 $y$。")],
          [
            `x = y^2 + ${c}`,
            false,
            t(`$x = ${c + 1}$ is related to $y = 1$ and $y = -1$.`, `$x = ${c + 1}$ 同时与 $y = 1$ 和 $y = -1$ 相关。`),
          ],
          [`y^3 = x + ${c}`, true, t("Every real number has exactly one real cube root.", "每个实数恰有一个实立方根。")],
          [`x^2 + y^2 = ${c * c}`, false, t(`$x = 0$ is related to $y = \\pm ${c}$.`, `$x = 0$ 与 $y = \\pm ${c}$ 都相关。`)],
          [`y = |x - ${c}|`, true, t("Each $x$ gives exactly one $y$.", "每个 $x$ 恰给出一个 $y$。")],
          [`|y| = x + ${c}`, false, t(`$x = ${1 - c}$ is related to $y = \\pm 1$.`, `$x = ${1 - c}$ 与 $y = \\pm 1$ 都相关。`)],
          [
            `y = \\sqrt{x - ${c}}`,
            false,
            t(
              `$x = 0$ is related to nothing, since $\\sqrt{-${c}}$ is not real.`,
              `$x = 0$ 不与任何数相关，因为 $\\sqrt{-${c}}$ 不是实数。`,
            ),
          ],
          [
            `e^y = x^2 + ${c}`,
            true,
            t(`$y = \\ln(x^2 + ${c})$ is defined and unique for every $x$.`, `对每个 $x$，$y = \\ln(x^2 + ${c})$ 有定义且唯一。`),
          ],
        ];
        const [rel, value, why] = rng.pick(rels);
        return oneOf(
          rng,
          t(
            `Is $\\{(x, y) \\in \\mathbb{R}^2 : ${rel}\\}$ a function from $\\mathbb{R}$ to $\\mathbb{R}$?`,
            `$\\{(x, y) \\in \\mathbb{R}^2 : ${rel}\\}$ 是从 $\\mathbb{R}$ 到 $\\mathbb{R}$ 的函数吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          why,
        );
      },
    },
  ],
};

/** reflexiveRel builds a finite relation on {1, …, n} that is reflexive (0), irreflexive (1) or neither (2). */
function reflexiveRel(rng: Rng, n: number, kind: number): Pair[] {
  const off = randomRel(rng, n, 35).filter(([a, b]) => a !== b);
  if (kind === 0) return sortPairs([...off, ...range(1, n).map((a) => [a, a] as Pair)]);
  if (kind === 1) return sortPairs(off.length > 0 ? off : [[1, 2]]);
  const loops = rng.shuffle(range(1, n)).slice(0, rng.int(1, n - 1));
  return sortPairs([...off, ...loops.map((a) => [a, a] as Pair)]);
}

/** reflexiveAndIrreflexiveRelations checks whether elements are related to themselves. */
export const reflexiveAndIrreflexiveRelations: TopicDef = {
  id: "reflexive-and-irreflexive-relations",
  title: t("Reflexive and Irreflexive Relations", "自反关系与反自反关系"),
  summary: t(
    "R on A is reflexive if a R a for every a ∈ A, and irreflexive if a R a for no a ∈ A; many relations are neither.",
    "若对每个 a ∈ A 都有 a R a，则 A 上的 R 是自反的；若没有 a ∈ A 使 a R a，则是反自反的；很多关系两者都不是。",
  ),
  prerequisites: ["graphical-representations-of-relations", "relations-on-infinite-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reflexivity-of-finite-relations",
      title: t("Finite relations", "有限关系"),
      explanation: t(
        "On $\\{1, 2, 3\\}$: $\\{(1, 1), (2, 2), (3, 3), (1, 2)\\}$ is reflexive; $\\{(1, 2), (2, 1)\\}$ is irreflexive; $\\{(1, 1), (1, 2)\\}$ is neither, since it contains $(1, 1)$ but not $(2, 2)$.",
        "在 $\\{1, 2, 3\\}$ 上：$\\{(1, 1), (2, 2), (3, 3), (1, 2)\\}$ 是自反的；$\\{(1, 2), (2, 1)\\}$ 是反自反的；$\\{(1, 1), (1, 2)\\}$ 两者都不是，因为它含 $(1, 1)$ 却不含 $(2, 2)$。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        const kind = rng.int(0, 2);
        const r = reflexiveRel(rng, n, kind);
        const options = [t("Reflexive", "自反"), t("Irreflexive", "反自反"), t("Neither", "两者都不是")];
        const missing = range(1, n).find((a) => !has(r, a, a));
        const present = range(1, n).find((a) => has(r, a, a));
        return oneOf(
          rng,
          t(`Classify $R = ${relTex(r)}$ on $${setTex(range(1, n))}$.`, `对 $${setTex(range(1, n))}$ 上的 $R = ${relTex(r)}$ 进行分类。`),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          [
            t("Every pair $(a, a)$ is present.", "每个 $(a, a)$ 都在其中。"),
            t("No pair $(a, a)$ is present.", "没有任何 $(a, a)$ 在其中。"),
            t(
              `$(${present}, ${present}) \\in R$ but $(${missing}, ${missing}) \\notin R$.`,
              `$(${present}, ${present}) \\in R$，但 $(${missing}, ${missing}) \\notin R$。`,
            ),
          ][kind]!,
        );
      },
    },
    {
      id: "reflexivity-of-relations-on-the-integers",
      title: t("Relations on the integers", "整数上的关系"),
      explanation: t(
        "On $\\mathbb{Z}$: $a \\le b$ is reflexive; $a < b$ is irreflexive; $ab > 0$ is neither, since $1 \\cdot 1 > 0$ but $0 \\cdot 0 = 0$.",
        "在 $\\mathbb{Z}$ 上：$a \\le b$ 是自反的；$a < b$ 是反自反的；$ab > 0$ 两者都不是，因为 $1 \\cdot 1 > 0$ 而 $0 \\cdot 0 = 0$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const rules: [string, number, Text][] = [
          ["a \\le b", 0, t("$a \\le a$ always.", "总有 $a \\le a$。")],
          ["a < b", 1, t("$a < a$ never holds.", "$a < a$ 永不成立。")],
          ["ab > 0", 2, t("$1 \\cdot 1 > 0$ but $0 \\cdot 0 = 0$.", "$1 \\cdot 1 > 0$，但 $0 \\cdot 0 = 0$。")],
          [`${k} \\mid a - b`, 0, t(`$a - a = 0$ is a multiple of $${k}$.`, `$a - a = 0$ 是 $${k}$ 的倍数。`)],
          [`b = a + ${k}`, 1, t(`$a = a + ${k}$ never holds.`, `$a = a + ${k}$ 永不成立。`)],
          [
            `a + b = ${2 * k}`,
            2,
            t(`$${k} + ${k} = ${2 * k}$, but $0 + 0 \\ne ${2 * k}$.`, `$${k} + ${k} = ${2 * k}$，但 $0 + 0 \\ne ${2 * k}$。`),
          ],
          ["a \\ne b", 1, t("$a \\ne a$ never holds.", "$a \\ne a$ 永不成立。")],
          [`|a - b| \\le ${k}`, 0, t(`$|a - a| = 0 \\le ${k}$.`, `$|a - a| = 0 \\le ${k}$。`)],
          [
            `a^2 = ${k}b`,
            2,
            t(`$${k}^2 = ${k} \\cdot ${k}$, but $1 \\ne ${k} \\cdot 1$.`, `$${k}^2 = ${k} \\cdot ${k}$，但 $1 \\ne ${k} \\cdot 1$。`),
          ],
          ["2 \\mid a + b", 0, t("$a + a = 2a$ is even.", "$a + a = 2a$ 是偶数。")],
          ["2 \\nmid a + b", 1, t("$a + a = 2a$ is never odd.", "$a + a = 2a$ 永远不是奇数。")],
        ];
        const [rule, kind, why] = rng.pick(rules);
        const options = [t("Reflexive", "自反"), t("Irreflexive", "反自反"), t("Neither", "两者都不是")];
        return oneOf(
          rng,
          t(
            `Classify the relation $a \\mathrel{R} b \\iff ${rule}$ on $\\mathbb{Z}$.`,
            `对 $\\mathbb{Z}$ 上的关系 $a \\mathrel{R} b \\iff ${rule}$ 进行分类。`,
          ),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          why,
        );
      },
    },
  ],
};

/** symmetryRel builds a relation that is symmetric (0), antisymmetric (1), both (2) or neither (3). */
function symmetryRel(rng: Rng, n: number, kind: number): Pair[] {
  const loops = range(1, n)
    .filter(() => rng.bool())
    .map((a) => [a, a] as Pair);
  const offPairs = range(1, n).flatMap((a) => range(a + 1, n).map((b) => [a, b] as Pair));
  const chosen = rng.shuffle(offPairs).slice(0, rng.int(2, 3));
  if (kind === 0) return sortPairs([...loops, ...chosen.flatMap(([a, b]) => [[a, b] as Pair, [b, a] as Pair])]);
  if (kind === 1) return sortPairs([...loops, ...chosen.map(([a, b]) => (rng.bool() ? ([a, b] as Pair) : ([b, a] as Pair)))]);
  if (kind === 2) return sortPairs(loops.length > 0 ? loops : [[1, 1]]);
  const [p, q] = chosen as [Pair, Pair];
  return sortPairs([...loops, p, [p[1], p[0]], rng.bool() ? q : [q[1], q[0]]]);
}

/** symmetricAndAntisymmetricRelations checks how pairs relate to their reverses. */
export const symmetricAndAntisymmetricRelations: TopicDef = {
  id: "symmetric-and-antisymmetric-relations",
  title: t("Symmetric and Antisymmetric Relations", "对称关系与反对称关系"),
  summary: t(
    "R is symmetric if a R b implies b R a, and antisymmetric if a R b and b R a imply a = b.",
    "若 a R b 推出 b R a，则 R 是对称的；若 a R b 且 b R a 推出 a = b，则 R 是反对称的。",
  ),
  prerequisites: ["reflexive-and-irreflexive-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "symmetry-of-finite-relations",
      title: t("Finite relations", "有限关系"),
      explanation: t(
        "$\\{(1, 2), (2, 1), (3, 3)\\}$ is symmetric. $\\{(1, 2), (2, 3)\\}$ is antisymmetric. $\\{(1, 1), (2, 2)\\}$ is both. $\\{(1, 2), (2, 1), (1, 3)\\}$ is neither: $(1, 3)$ lacks its reverse, and $(1, 2), (2, 1)$ with $1 \\ne 2$ break antisymmetry.",
        "$\\{(1, 2), (2, 1), (3, 3)\\}$ 是对称的。$\\{(1, 2), (2, 3)\\}$ 是反对称的。$\\{(1, 1), (2, 2)\\}$ 两者都是。$\\{(1, 2), (2, 1), (1, 3)\\}$ 两者都不是：$(1, 3)$ 没有反向序对，而 $(1, 2), (2, 1)$ 且 $1 \\ne 2$ 破坏了反对称性。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        const kind = rng.int(0, 3);
        const r = symmetryRel(rng, n, kind);
        const options = [
          t("Symmetric only", "仅对称"),
          t("Antisymmetric only", "仅反对称"),
          t("Both", "两者都是"),
          t("Neither", "两者都不是"),
        ];
        return oneOf(
          rng,
          t(
            `Is $R = ${relTex(r)}$ symmetric, antisymmetric, both, or neither?`,
            `$R = ${relTex(r)}$ 是对称的、反对称的、两者都是，还是两者都不是？`,
          ),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          [
            t(
              "Every pair's reverse is present, and some pair $(a, b)$ with $a \\ne b$ appears in both directions.",
              "每个序对的反向都在其中，且有 $a \\ne b$ 的序对双向出现。",
            ),
            t(
              "No pair $(a, b)$ with $a \\ne b$ appears in both directions, and some pair lacks its reverse.",
              "没有 $a \\ne b$ 的序对双向出现，且有序对缺少反向。",
            ),
            t("Only pairs $(a, a)$ appear, so both conditions hold.", "只有形如 $(a, a)$ 的序对，所以两个条件都成立。"),
            t(
              "Some pair lacks its reverse, and some pair $(a, b)$ with $a \\ne b$ appears in both directions.",
              "有序对缺少反向，同时有 $a \\ne b$ 的序对双向出现。",
            ),
          ][kind]!,
        );
      },
    },
    {
      id: "symmetry-of-relations-on-the-integers",
      title: t("Relations on the integers", "整数上的关系"),
      explanation: t(
        "On $\\mathbb{Z}$: $a + b$ even is symmetric; $a \\le b$ is antisymmetric; $a = b$ is both; $|a - b| \\le 1$ and $a \\le b$ is antisymmetric too, while $a \\le b + 1$ is neither: $(1, 2)$ and $(2, 1)$ are both in it, but $(1, 3)$ lacks its reverse.",
        "在 $\\mathbb{Z}$ 上：“$a + b$ 为偶数”是对称的；$a \\le b$ 是反对称的；$a = b$ 两者都是；$a \\le b + 1$ 两者都不是：$(1, 2)$ 与 $(2, 1)$ 都在其中，而 $(1, 3)$ 没有反向序对。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const rules: [string, number, Text][] = [
          [
            `${k} \\mid a + b`,
            0,
            t(
              `$a + b = b + a$, and $(1, ${k - 1})$, $(${k - 1}, 1)$ are both in $R$.`,
              `$a + b = b + a$，且 $(1, ${k - 1})$、$(${k - 1}, 1)$ 都在 $R$ 中。`,
            ),
          ],
          [`|a - b| = ${k}`, 0, t("$|a - b| = |b - a|$.", "$|a - b| = |b - a|$。")],
          [
            "a \\le b",
            1,
            t(
              "$a \\le b$ and $b \\le a$ force $a = b$; $(1, 2)$ lacks its reverse.",
              "$a \\le b$ 且 $b \\le a$ 推出 $a = b$；$(1, 2)$ 没有反向。",
            ),
          ],
          [
            `b = a + ${k}`,
            1,
            t(`$b = a + ${k}$ and $a = b + ${k}$ never hold together.`, `$b = a + ${k}$ 与 $a = b + ${k}$ 不会同时成立。`),
          ],
          [
            "b = a^2",
            1,
            t(
              "$b = a^2$ and $a = b^2$ give $a = a^4$, so $a \\in \\{0, 1\\}$ and $b = a$; $(2, 4)$ lacks its reverse.",
              "$b = a^2$ 与 $a = b^2$ 给出 $a = a^4$，所以 $a \\in \\{0, 1\\}$ 且 $b = a$；$(2, 4)$ 没有反向。",
            ),
          ],
          ["a = b", 2, t("Only pairs $(a, a)$ occur.", "只出现形如 $(a, a)$ 的序对。")],
          [`a = b \\wedge ${k} \\mid a`, 2, t("Only pairs $(a, a)$ occur.", "只出现形如 $(a, a)$ 的序对。")],
          [
            `a \\le b + ${k - 1}`,
            3,
            t(
              `$(1, 2)$ and $(2, 1)$ are both in $R$, but $(1, ${k + 1})$ is in $R$ while $(${k + 1}, 1)$ is not.`,
              `$(1, 2)$ 与 $(2, 1)$ 都在 $R$ 中，而 $(1, ${k + 1})$ 在 $R$ 中但 $(${k + 1}, 1)$ 不在。`,
            ),
          ],
          [
            `|a - b| \\le ${k} \\wedge a \\le b + 1`,
            3,
            t(
              `$(1, 2)$ and $(2, 1)$ are both in $R$, but $(1, ${k + 1})$ is in $R$ while $(${k + 1}, 1)$ is not.`,
              `$(1, 2)$ 与 $(2, 1)$ 都在 $R$ 中，而 $(1, ${k + 1})$ 在 $R$ 中但 $(${k + 1}, 1)$ 不在。`,
            ),
          ],
        ];
        const [rule, kind, why] = rng.pick(rules);
        const options = [
          t("Symmetric only", "仅对称"),
          t("Antisymmetric only", "仅反对称"),
          t("Both", "两者都是"),
          t("Neither", "两者都不是"),
        ];
        return oneOf(
          rng,
          t(
            `On $\\mathbb{Z}$, is $a \\mathrel{R} b \\iff ${rule}$ symmetric, antisymmetric, both, or neither?`,
            `在 $\\mathbb{Z}$ 上，$a \\mathrel{R} b \\iff ${rule}$ 是对称的、反对称的、两者都是，还是两者都不是？`,
          ),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          why,
        );
      },
    },
  ],
};

/** transitiveRelations checks the chain condition a R b, b R c ⟹ a R c. */
export const transitiveRelations: TopicDef = {
  id: "transitive-relations",
  title: t("Transitive Relations", "传递关系"),
  summary: t(
    "R is transitive if a R b and b R c always imply a R c; the transitive closure adds the missing pairs.",
    "若 a R b 且 b R c 总推出 a R c，则 R 是传递的；传递闭包补上缺失的序对。",
  ),
  prerequisites: ["symmetric-and-antisymmetric-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-transitivity",
      title: t("Checking transitivity", "检验传递性"),
      explanation: t(
        "$\\{(1, 2), (2, 3), (1, 3)\\}$ is transitive. $\\{(1, 2), (2, 1)\\}$ is not: $(1, 2)$ and $(2, 1)$ require $(1, 1)$.",
        "$\\{(1, 2), (2, 3), (1, 3)\\}$ 是传递的。$\\{(1, 2), (2, 1)\\}$ 不是：$(1, 2)$ 与 $(2, 1)$ 要求 $(1, 1)$。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        const value = rng.bool();
        let r: Pair[];
        do r = sortPairs(randomRel(rng, n, value ? 25 : 30));
        while (r.length < 2 || r.length > 7 || (value ? transitiveClosure(r).length > 7 : !transitivityGap(r)));
        if (value) r = transitiveClosure(r);
        const gap = transitivityGap(r);
        return oneOf(
          rng,
          t(`Is $R = ${relTex(r)}$ transitive?`, `$R = ${relTex(r)}$ 是传递的吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          gap
            ? t(
                `No: $(${gap[0]}, ${gap[1]})$ and $(${gap[1]}, ${gap[2]})$ are in $R$, but $(${gap[0]}, ${gap[2]})$ is not.`,
                `不是：$(${gap[0]}, ${gap[1]})$ 与 $(${gap[1]}, ${gap[2]})$ 在 $R$ 中，但 $(${gap[0]}, ${gap[2]})$ 不在。`,
              )
            : t(
                "Yes: every chain $(a, b), (b, c)$ has its shortcut $(a, c)$ in $R$.",
                "是：每条链 $(a, b), (b, c)$ 的捷径 $(a, c)$ 都在 $R$ 中。",
              ),
        );
      },
    },
    {
      id: "the-transitive-closure",
      title: t("The transitive closure", "传递闭包"),
      explanation: t(
        "For $R = \\{(1, 2), (2, 3), (3, 4)\\}$, add $(1, 3)$ and $(2, 4)$, then $(1, 4)$: the transitive closure has $6$ pairs, $3$ more than $R$.",
        "对 $R = \\{(1, 2), (2, 3), (3, 4)\\}$，补上 $(1, 3)$ 与 $(2, 4)$，再补上 $(1, 4)$：传递闭包有 $6$ 个序对，比 $R$ 多 $3$ 个。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        let r: Pair[];
        do r = sortPairs(range(1, rng.int(3, 4)).map(() => [rng.int(1, n), rng.int(1, n)] as Pair));
        while (!transitivityGap(r) || transitiveClosure(r).length > 12);
        const closure = transitiveClosure(r);
        const added = closure.filter(([a, b]) => !has(r, a, b));
        return numberProblem({
          prompt: t(
            `How many pairs must be added to $R = ${relTex(r)}$ to obtain its transitive closure?`,
            `要得到 $R = ${relTex(r)}$ 的传递闭包，需要添加多少个序对？`,
          ),
          answer: added.length,
          wrong: [closure.length, added.length - 1, added.length + 1],
          solution: t(`Add $${relTex(added)}$: $${added.length}$ pairs.`, `添加 $${relTex(added)}$：共 $${added.length}$ 个序对。`),
        });
      },
    },
  ],
};

/** equivalenceRelations combines reflexivity, symmetry and transitivity. */
export const equivalenceRelations: TopicDef = {
  id: "equivalence-relations",
  title: t("Equivalence Relations", "等价关系"),
  summary: t(
    "An equivalence relation is reflexive, symmetric and transitive; it corresponds to a partition of the set into blocks of mutually related elements.",
    "等价关系是自反、对称且传递的关系；它对应把集合划分成若干块、块内元素两两相关的一个划分。",
  ),
  prerequisites: ["transitive-relations", "partitions-of-sets"],
  encompasses: [
    { topic: "reflexive-and-irreflexive-relations", weight: 0.2 },
    { topic: "symmetric-and-antisymmetric-relations", weight: 0.2 },
    { topic: "transitive-relations", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "which-property-fails",
      title: t("Which property fails?", "哪个性质不成立？"),
      explanation: t(
        "On $\\mathbb{Z}$: $3 \\mid a - b$ is an equivalence relation. $|a - b| \\le 1$ is not transitive ($0 \\sim 1 \\sim 2$ but $0 \\not\\sim 2$). $a \\le b$ is not symmetric. $ab > 0$ is not reflexive ($0 \\not\\sim 0$).",
        "在 $\\mathbb{Z}$ 上：$3 \\mid a - b$ 是等价关系。$|a - b| \\le 1$ 不传递（$0 \\sim 1 \\sim 2$ 但 $0 \\not\\sim 2$）。$a \\le b$ 不对称。$ab > 0$ 不自反（$0 \\not\\sim 0$）。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const rules: [string, number, Text][] = [
          [`${k} \\mid a - b`, 0, t("It is reflexive, symmetric and transitive.", "它自反、对称且传递。")],
          [
            "|a| = |b|",
            0,
            t("Equality of $|a|$ and $|b|$ is reflexive, symmetric and transitive.", "$|a|$ 与 $|b|$ 相等是自反、对称且传递的。"),
          ],
          [
            `a^2 \\equiv b^2 \\pmod{${k}}`,
            0,
            t("It is congruence of $a^2$ and $b^2$, an equivalence relation.", "它是 $a^2$ 与 $b^2$ 的同余，是等价关系。"),
          ],
          [
            "2 \\mid a + b",
            0,
            t("$a + b$ is even exactly when $a$ and $b$ have the same parity.", "$a + b$ 为偶数当且仅当 $a$ 与 $b$ 奇偶性相同。"),
          ],
          [
            "ab > 0",
            1,
            t(
              "It is symmetric and transitive ($a$, $b$, $c$ share a sign), but $0 \\cdot 0 = 0$, so $0 \\not\\sim 0$.",
              "它对称且传递（$a$、$b$、$c$ 同号），但 $0 \\cdot 0 = 0$，所以 $0 \\not\\sim 0$。",
            ),
          ],
          [
            `a = b \\wedge ${k} \\nmid a`,
            1,
            t(
              `It is symmetric and transitive, but $${k} \\mid 0$, so $0 \\not\\sim 0$.`,
              `它对称且传递，但 $${k} \\mid 0$，所以 $0 \\not\\sim 0$。`,
            ),
          ],
          [
            "a \\le b",
            2,
            t("It is reflexive and transitive, but $1 \\le 2$ while $2 \\not\\le 1$.", "它自反且传递，但 $1 \\le 2$ 而 $2 \\not\\le 1$。"),
          ],
          [
            "|a| \\le |b|",
            2,
            t(
              "It is reflexive and transitive, but $|1| \\le |2|$ while $|2| \\not\\le |1|$.",
              "它自反且传递，但 $|1| \\le |2|$ 而 $|2| \\not\\le |1|$。",
            ),
          ],
          [
            `|a - b| \\le ${k}`,
            3,
            t(
              `It is reflexive and symmetric, but $0 \\sim ${k} \\sim ${2 * k}$ while $0 \\not\\sim ${2 * k}$.`,
              `它自反且对称，但 $0 \\sim ${k} \\sim ${2 * k}$ 而 $0 \\not\\sim ${2 * k}$。`,
            ),
          ],
          [
            `|a - b| \\ne ${k}`,
            3,
            t(
              `It is reflexive and symmetric, but $0 \\sim 1 \\sim ${k}$ while $0 \\not\\sim ${k}$.`,
              `它自反且对称，但 $0 \\sim 1 \\sim ${k}$ 而 $0 \\not\\sim ${k}$。`,
            ),
          ],
        ];
        const [rule, kind, why] = rng.pick(rules);
        const options = [
          t("It is an equivalence relation", "它是等价关系"),
          t("Not reflexive", "不自反"),
          t("Not symmetric", "不对称"),
          t("Not transitive", "不传递"),
        ];
        return oneOf(
          rng,
          t(
            `On $\\mathbb{Z}$, let $a \\sim b \\iff ${rule}$. Which is true?`,
            `在 $\\mathbb{Z}$ 上，令 $a \\sim b \\iff ${rule}$。哪个说法正确？`,
          ),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          why,
        );
      },
    },
    {
      id: "counting-pairs-of-an-equivalence-relation",
      title: t("Counting pairs", "统计序对"),
      explanation: t(
        "An equivalence relation whose classes have sizes $3, 2, 1$ relates every two elements of the same class, in both orders and with themselves: $3^2 + 2^2 + 1^2 = 14$ pairs.",
        "等价类大小为 $3, 2, 1$ 的等价关系，把同一类中的任意两个元素（两种顺序，以及元素与自身）都相关：共 $3^2 + 2^2 + 1^2 = 14$ 个序对。",
      ),
      generate(rng) {
        const sizes = range(1, rng.int(2, 4))
          .map(() => rng.int(1, 5))
          .sort((a, b) => b - a);
        const total = sizes.reduce((s, x) => s + x, 0);
        const count = sizes.reduce((s, x) => s + x * x, 0);
        return numberProblem({
          prompt: t(
            `An equivalence relation on a set of $${total}$ elements has equivalence classes of sizes $${sizes.join(", ")}$. How many ordered pairs does it contain?`,
            `某个含 $${total}$ 个元素的集合上的等价关系，其等价类的大小为 $${sizes.join(", ")}$。它包含多少个有序对？`,
          ),
          answer: count,
          wrong: [sizes.reduce((s, x) => s + (x * (x - 1)) / 2, 0), count - total, total * total],
          solution: t(
            `Each class of size $s$ gives $s^2$ pairs: $${sizes.map((s) => `${s}^2`).join(" + ")} = ${count}$.`,
            `每个大小为 $s$ 的类给出 $s^2$ 个序对：$${sizes.map((s) => `${s}^2`).join(" + ")} = ${count}$。`,
          ),
        });
      },
    },
  ],
};

/** provingARelationIsAnEquivalenceRelation proves the three properties from a rule. */
export const provingARelationIsAnEquivalenceRelation: TopicDef = {
  id: "proving-a-relation-is-an-equivalence-relation",
  title: t("Proving a Relation Is an Equivalence Relation", "证明一个关系是等价关系"),
  summary: t(
    "Prove reflexivity, symmetry and transitivity separately, each by rewriting the defining condition.",
    "分别证明自反性、对称性与传递性，每一步都改写定义条件。",
  ),
  prerequisites: ["equivalence-relations", "proving-properties-of-modular-congruence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "identities-in-equivalence-proofs",
      title: t("The key identities", "关键恒等式"),
      explanation: t(
        "Let $a \\sim b \\iff 8 \\mid 3a + 5b$. Reflexive: $3a + 5a = 8a$. Symmetric: $3b + 5a = 8(a + b) - (3a + 5b)$. Transitive: $3a + 5c = (3a + 5b) + (3b + 5c) - 8b$.",
        "令 $a \\sim b \\iff 8 \\mid 3a + 5b$。自反：$3a + 5a = 8a$。对称：$3b + 5a = 8(a + b) - (3a + 5b)$。传递：$3a + 5c = (3a + 5b) + (3b + 5c) - 8b$。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 9);
          q = rng.int(1, 9);
        } while (p === q);
        const m = p + q;
        const prop = rng.int(0, 2);
        const lin = (x: string, y: string) => `${p === 1 ? "" : p}${x} + ${q === 1 ? "" : q}${y}`;
        const table: [string, string, string[]][] = [
          [lin("a", "a"), `${m}a`, [`${p * q}a`, `${m}a^2`, `${Math.abs(p - q) === 1 ? "" : Math.abs(p - q)}a`]],
          [
            lin("b", "a"),
            `${m}(a + b) - (${lin("a", "b")})`,
            [`${m}(a + b) + (${lin("a", "b")})`, `${m}ab - (${lin("a", "b")})`, `${m}(a - b) - (${lin("a", "b")})`],
          ],
          [
            lin("a", "c"),
            `(${lin("a", "b")}) + (${lin("b", "c")}) - ${m}b`,
            [
              `(${lin("a", "b")}) + (${lin("b", "c")}) + ${m}b`,
              `(${lin("a", "b")}) - (${lin("b", "c")})`,
              `(${lin("a", "b")}) + (${lin("b", "c")}) - ${m}c`,
            ],
          ],
        ];
        const [goal, right, wrong] = table[prop]!;
        const names = [t("reflexivity", "自反性"), t("symmetry", "对称性"), t("transitivity", "传递性")][prop]!;
        return oneOf(
          rng,
          t(
            `Let $a \\sim b \\iff ${m} \\mid ${lin("a", "b")}$ on $\\mathbb{Z}$. To prove ${names.en}, which identity shows $${m} \\mid ${goal}$?`,
            `在 $\\mathbb{Z}$ 上令 $a \\sim b \\iff ${m} \\mid ${lin("a", "b")}$。为证明${names["zh-CN"]}，哪个恒等式说明 $${m} \\mid ${goal}$？`,
          ),
          math(`${goal} = ${right}`),
          wrong.map((w) => math(`${goal} = ${w}`)),
          t(
            `$${goal} = ${right}$, and every term on the right is a multiple of $${m}$ (using the hypotheses).`,
            `$${goal} = ${right}$，右边每一项都是 $${m}$ 的倍数（利用假设）。`,
          ),
        );
      },
    },
    {
      id: "equivalent-pairs",
      title: t("Equivalent pairs", "等价的数对"),
      explanation: t(
        "On $\\mathbb{N} \\times \\mathbb{N}$, $(a, b) \\sim (c, d) \\iff a + d = b + c$ is an equivalence relation (it says $a - b = c - d$). So $(5, 2) \\sim (7, 4)$. On $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$, $(a, b) \\sim (c, d) \\iff ad = bc$ says $\\tfrac{a}{b} = \\tfrac{c}{d}$, so $(2, 3) \\sim (4, 6)$.",
        "在 $\\mathbb{N} \\times \\mathbb{N}$ 上，$(a, b) \\sim (c, d) \\iff a + d = b + c$ 是等价关系（它表示 $a - b = c - d$）。所以 $(5, 2) \\sim (7, 4)$。在 $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$ 上，$(a, b) \\sim (c, d) \\iff ad = bc$ 表示 $\\tfrac{a}{b} = \\tfrac{c}{d}$，所以 $(2, 3) \\sim (4, 6)$。",
      ),
      generate(rng) {
        const additive = rng.bool();
        const a = rng.int(1, 9);
        const b = ((a + rng.int(0, 7)) % 9) + 1;
        const k = rng.int(2, 5);
        const pair = (x: number, y: number) => math(`(${x}, ${y})`);
        if (additive) {
          return oneOf(
            rng,
            t(
              `On $\\mathbb{N} \\times \\mathbb{N}$, let $(a, b) \\sim (c, d) \\iff a + d = b + c$. Which pair is equivalent to $(${a}, ${b})$?`,
              `在 $\\mathbb{N} \\times \\mathbb{N}$ 上，令 $(a, b) \\sim (c, d) \\iff a + d = b + c$。哪个数对与 $(${a}, ${b})$ 等价？`,
            ),
            pair(a + k, b + k),
            [pair(b + k, a + k), pair(a * k, b * k), pair(a + k, b + k + 1)],
            t(
              `$${a} + ${b + k} = ${b} + ${a + k}$, since both pairs have difference $${a - b}$.`,
              `$${a} + ${b + k} = ${b} + ${a + k}$，因为两对的差都是 $${a - b}$。`,
            ),
          );
        }
        const g = gcd(a, b);
        return oneOf(
          rng,
          t(
            `On $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$, let $(a, b) \\sim (c, d) \\iff ad = bc$. Which pair is equivalent to $(${a}, ${b})$?`,
            `在 $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$ 上，令 $(a, b) \\sim (c, d) \\iff ad = bc$。哪个数对与 $(${a}, ${b})$ 等价？`,
          ),
          pair(a * k, b * k),
          [pair(a + k, b + k), pair(b * k, a * k), pair(a * k, b * k + 1)],
          t(
            `$${a} \\cdot ${b * k} = ${b} \\cdot ${a * k}$: both pairs represent $\\tfrac{${a / g}}{${b / g}}$.`,
            `$${a} \\cdot ${b * k} = ${b} \\cdot ${a * k}$：两对都表示 $\\tfrac{${a / g}}{${b / g}}$。`,
          ),
        );
      },
    },
  ],
};

/** residueClasses studies the classes [a]ₙ = {x : x ≡ a (mod n)}. */
export const residueClasses: TopicDef = {
  id: "residue-classes",
  title: t("Residue Classes", "剩余类"),
  summary: t(
    "Congruence modulo n is an equivalence relation; its classes [a]ₙ = {a + kn : k ∈ ℤ} are the residue classes, and [a]ₙ = [b]ₙ exactly when a ≡ b (mod n).",
    "模 n 同余是等价关系；它的等价类 [a]ₙ = {a + kn : k ∈ ℤ} 称为剩余类，且 [a]ₙ = [b]ₙ 当且仅当 a ≡ b (mod n)。",
  ),
  prerequisites: ["equivalence-relations", "modular-residues"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elements-of-a-residue-class",
      title: t("Elements of a residue class", "剩余类中的元素"),
      explanation: t(
        "$[2]_5 = \\{\\dots, -8, -3, 2, 7, 12, \\dots\\}$. Its elements between $-10$ and $10$ are $-8, -3, 2, 7$.",
        "$[2]_5 = \\{\\dots, -8, -3, 2, 7, 12, \\dots\\}$。它在 $-10$ 与 $10$ 之间的元素是 $-8, -3, 2, 7$。",
      ),
      generate(rng) {
        const n = rng.int(3, 9);
        const a = rng.int(-20, 20);
        const lo = rng.int(-20, 0);
        const hi = lo + rng.int(15, 30);
        const xs = range(lo, hi).filter((x) => mod(x - a, n) === 0);
        return setProblem({
          prompt: t(
            `List the elements $x$ of $[${a}]_{${n}}$ with $${lo} \\le x \\le ${hi}$.`,
            `列出 $[${a}]_{${n}}$ 中满足 $${lo} \\le x \\le ${hi}$ 的元素 $x$。`,
          ),
          values: xs,
          wrong: [xs.map((x) => x + 1), range(lo, hi).filter((x) => mod(x + a, n) === 0)],
          solution: t(
            `$[${a}]_{${n}}$ consists of the integers $\\equiv ${mod(a, n)} \\pmod{${n}}$: $${setTex(xs)}$.`,
            `$[${a}]_{${n}}$ 由所有 $\\equiv ${mod(a, n)} \\pmod{${n}}$ 的整数组成：$${setTex(xs)}$。`,
          ),
        });
      },
    },
    {
      id: "equal-residue-classes",
      title: t("Equal residue classes", "相等的剩余类"),
      explanation: t(
        "$[17]_6 = [-1]_6$ because $17 - (-1) = 18$ is a multiple of $6$. Two residue classes are either equal or disjoint.",
        "$[17]_6 = [-1]_6$，因为 $17 - (-1) = 18$ 是 $6$ 的倍数。两个剩余类要么相等，要么不相交。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const a = rng.int(-30, 40);
        const value = rng.bool();
        const b = value ? a + n * rng.pick([-3, -2, -1, 1, 2, 3]) : a + n * rng.int(-3, 3) + rng.int(1, n - 1);
        return oneOf(
          rng,
          t(`Is $[${a}]_{${n}} = [${b}]_{${n}}$?`, `$[${a}]_{${n}} = [${b}]_{${n}}$ 成立吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(`Yes: $${a} - ${par(b)} = ${a - b}$ is a multiple of $${n}$.`, `成立：$${a} - ${par(b)} = ${a - b}$ 是 $${n}$ 的倍数。`)
            : t(
                `No: $${a} - ${par(b)} = ${a - b}$ is not a multiple of $${n}$, so the classes are disjoint.`,
                `不成立：$${a} - ${par(b)} = ${a - b}$ 不是 $${n}$ 的倍数，所以这两个类不相交。`,
              ),
        );
      },
    },
  ],
};

/** KeyedRel is an equivalence relation on a finite set given by a key: x ~ y ⟺ key(x) = key(y). */
interface KeyedRel {
  readonly en: string;
  readonly zh: string;
  readonly key: (x: number) => number;
}

/** keyedRel picks an equivalence relation on {1, …, N} described by a shared property. */
function keyedRel(rng: Rng): KeyedRel {
  const k = rng.int(3, 6);
  const digitSum = (x: number) => `${x}`.split("").reduce((s, d) => s + Number(d), 0);
  return rng.pick<KeyedRel>([
    { en: `$x$ and $y$ leave the same remainder on division by $${k}$`, zh: `$x$ 与 $y$ 除以 $${k}$ 的余数相同`, key: (x) => x % k },
    {
      en: `$\\lfloor x / ${k} \\rfloor = \\lfloor y / ${k} \\rfloor$`,
      zh: `$\\lfloor x / ${k} \\rfloor = \\lfloor y / ${k} \\rfloor$`,
      key: (x) => Math.floor(x / k),
    },
    { en: "$x$ and $y$ have the same digit sum", zh: "$x$ 与 $y$ 的各位数字之和相同", key: digitSum },
    {
      en: "$x$ and $y$ have the same number of positive divisors",
      zh: "$x$ 与 $y$ 的正因数个数相同",
      key: (x) => range(1, x).filter((d) => x % d === 0).length,
    },
    { en: `$x^2 \\equiv y^2 \\pmod{${k + 2}}$`, zh: `$x^2 \\equiv y^2 \\pmod{${k + 2}}$`, key: (x) => modPow(x, 2, k + 2) },
    { en: "$x$ and $y$ have the same largest odd divisor", zh: "$x$ 与 $y$ 的最大奇因数相同", key: (x) => x / 2 ** Math.log2(x & -x) },
  ]);
}

/** equivalenceClasses finds the class [a] and counts the classes. */
export const equivalenceClasses: TopicDef = {
  id: "equivalence-classes",
  title: t("Equivalence Classes", "等价类"),
  summary: t(
    "The equivalence class of a is [a] = {x : x ~ a}; the distinct classes partition the set.",
    "a 的等价类是 [a] = {x : x ~ a}；不同的等价类构成该集合的一个划分。",
  ),
  prerequisites: ["residue-classes"],
  encompasses: [{ topic: "residue-classes", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-an-equivalence-class",
      title: t("Finding an equivalence class", "求等价类"),
      explanation: t(
        "On $\\{1, \\dots, 20\\}$, let $x \\sim y$ when $x$ and $y$ have the same digit sum. Then $[5] = \\{5, 14\\}$, since $1 + 4 = 5$ and no other number up to $20$ has digit sum $5$.",
        "在 $\\{1, \\dots, 20\\}$ 上，当 $x$ 与 $y$ 的各位数字之和相同时令 $x \\sim y$。则 $[5] = \\{5, 14\\}$，因为 $1 + 4 = 5$，而 $20$ 以内没有其他数字和为 $5$ 的数。",
      ),
      generate(rng) {
        const N = rng.int(12, 24);
        const rel = keyedRel(rng);
        const a = rng.int(1, N);
        const cls = range(1, N).filter((x) => rel.key(x) === rel.key(a));
        return setProblem({
          prompt: t(
            `On $\\{1, 2, \\dots, ${N}\\}$, let $x \\sim y$ when ${rel.en}. Find $[${a}]$.`,
            `在 $\\{1, 2, \\dots, ${N}\\}$ 上，当${rel.zh}时令 $x \\sim y$。求 $[${a}]$。`,
          ),
          values: cls,
          wrong: [cls.filter((x) => x !== a), [a]],
          solution: t(
            `$[${a}]$ consists of the numbers whose value of the shared property matches that of $${a}$: $${setTex(cls)}$.`,
            `$[${a}]$ 由该性质与 $${a}$ 相同的数组成：$${setTex(cls)}$。`,
          ),
        });
      },
    },
    {
      id: "counting-equivalence-classes",
      title: t("Counting equivalence classes", "统计等价类个数"),
      explanation: t(
        "On $\\{1, \\dots, 10\\}$ with $x \\sim y \\iff \\lfloor x/3 \\rfloor = \\lfloor y/3 \\rfloor$, the classes are $\\{1, 2\\}, \\{3, 4, 5\\}, \\{6, 7, 8\\}, \\{9, 10\\}$: four classes, one for each value of $\\lfloor x/3 \\rfloor$.",
        "在 $\\{1, \\dots, 10\\}$ 上，$x \\sim y \\iff \\lfloor x/3 \\rfloor = \\lfloor y/3 \\rfloor$，等价类为 $\\{1, 2\\}, \\{3, 4, 5\\}, \\{6, 7, 8\\}, \\{9, 10\\}$：共四个，每个 $\\lfloor x/3 \\rfloor$ 的取值对应一个。",
      ),
      generate(rng) {
        const N = rng.int(10, 30);
        const rel = keyedRel(rng);
        const keys = new Set(range(1, N).map(rel.key));
        return numberProblem({
          prompt: t(
            `On $\\{1, 2, \\dots, ${N}\\}$, let $x \\sim y$ when ${rel.en}. How many equivalence classes are there?`,
            `在 $\\{1, 2, \\dots, ${N}\\}$ 上，当${rel.zh}时令 $x \\sim y$。共有多少个等价类？`,
          ),
          answer: keys.size,
          wrong: [keys.size + 1, keys.size - 1, N],
          solution: t(
            `There is one class for each value the shared property takes on $\\{1, \\dots, ${N}\\}$: $${keys.size}$ values.`,
            `该性质在 $\\{1, \\dots, ${N}\\}$ 上每取一个值就对应一个等价类：共 $${keys.size}$ 个值。`,
          ),
        });
      },
    },
  ],
};

/** theIntegersModuloN does arithmetic on residue classes. */
export const theIntegersModuloN: TopicDef = {
  id: "the-integers-modulo-n",
  title: t("The Integers Modulo n", "模 n 整数"),
  summary: t(
    "ℤₙ = {[0], [1], …, [n − 1]} with [a] + [b] = [a + b] and [a][b] = [ab], which are well defined; [a] is invertible exactly when gcd(a, n) = 1.",
    "ℤₙ = {[0], [1], …, [n − 1]}，运算为 [a] + [b] = [a + b]，[a][b] = [ab]，这些运算是良定义的；[a] 可逆当且仅当 gcd(a, n) = 1。",
  ),
  prerequisites: ["equivalence-classes", "multiplicative-inverses-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "arithmetic-in-the-integers-modulo-n",
      title: t("Arithmetic in ℤₙ", "ℤₙ 中的运算"),
      explanation: t(
        "In $\\mathbb{Z}_7$: $[5] + [4] \\cdot [6] = [5] + [24] = [5] + [3] = [8] = [1]$.",
        "在 $\\mathbb{Z}_7$ 中：$[5] + [4] \\cdot [6] = [5] + [24] = [5] + [3] = [8] = [1]$。",
      ),
      generate(rng) {
        const n = rng.int(4, 13);
        const a = rng.int(0, n - 1);
        const b = rng.int(1, n - 1);
        const c = rng.int(1, n - 1);
        const minus = rng.bool();
        const value = mod(minus ? a - b * c : a + b * c, n);
        const op = minus ? "-" : "+";
        return numberProblem({
          prompt: t(
            `In $\\mathbb{Z}_{${n}}$, $[${a}] ${op} [${b}] \\cdot [${c}] = [r]$ with $0 \\le r < ${n}$. Find $r$.`,
            `在 $\\mathbb{Z}_{${n}}$ 中，$[${a}] ${op} [${b}] \\cdot [${c}] = [r]$，其中 $0 \\le r < ${n}$。求 $r$。`,
          ),
          answer: value,
          wrong: [mod(minus ? (a - b) * c : (a + b) * c, n), minus ? a - b * c : a + b * c, mod(value + 1, n)],
          solution: t(
            `$[${b}] \\cdot [${c}] = [${b * c}] = [${mod(b * c, n)}]$, and $[${a}] ${op} [${mod(b * c, n)}] = [${value}]$.`,
            `$[${b}] \\cdot [${c}] = [${b * c}] = [${mod(b * c, n)}]$，而 $[${a}] ${op} [${mod(b * c, n)}] = [${value}]$。`,
          ),
        });
      },
    },
    {
      id: "units-and-zero-divisors",
      title: t("Units and zero divisors", "单位与零因子"),
      explanation: t(
        "In $\\mathbb{Z}_{12}$, the invertible classes are $[1], [5], [7], [11]$, those with $\\gcd(a, 12) = 1$. Every other nonzero class is a zero divisor: $[4] \\cdot [3] = [0]$.",
        "在 $\\mathbb{Z}_{12}$ 中，可逆类是 $[1], [5], [7], [11]$，即满足 $\\gcd(a, 12) = 1$ 的类。其余非零类都是零因子：$[4] \\cdot [3] = [0]$。",
      ),
      generate(rng) {
        const n = rng.int(6, 40);
        const units = range(1, n - 1).filter((a) => gcd(a, n) === 1);
        const zeroDiv = rng.bool();
        const count = zeroDiv ? n - 1 - units.length : units.length;
        return numberProblem({
          prompt: zeroDiv
            ? t(
                `How many nonzero classes $[a]$ in $\\mathbb{Z}_{${n}}$ are zero divisors, that is, $[a][b] = [0]$ for some nonzero $[b]$?`,
                `$\\mathbb{Z}_{${n}}$ 中有多少个非零类 $[a]$ 是零因子，即存在非零的 $[b]$ 使 $[a][b] = [0]$？`,
              )
            : t(`How many classes in $\\mathbb{Z}_{${n}}$ have a multiplicative inverse?`, `$\\mathbb{Z}_{${n}}$ 中有多少个类有乘法逆元？`),
          answer: count,
          wrong: [n - 1 - count, count + 1, n - count],
          solution: t(
            `The invertible classes are those with $\\gcd(a, ${n}) = 1$: there are $${units.length}$. The other $${n - 1 - units.length}$ nonzero classes are zero divisors.`,
            `可逆类就是满足 $\\gcd(a, ${n}) = 1$ 的类：共 $${units.length}$ 个。其余 $${n - 1 - units.length}$ 个非零类是零因子。`,
          ),
        });
      },
    },
  ],
};

/** methodsOfProofRelationTopics are the new topics of Methods of Proof unit 7. */
export const methodsOfProofRelationTopics: readonly TopicDef[] = [
  relationsOnFiniteSets,
  relationsOnInfiniteSets,
  theDomainAndRangeOfARelation,
  graphicalRepresentationsOfRelations,
  operationsOnRelations,
  nAryRelations,
  functionalRelations,
  reflexiveAndIrreflexiveRelations,
  symmetricAndAntisymmetricRelations,
  transitiveRelations,
  equivalenceRelations,
  provingARelationIsAnEquivalenceRelation,
  residueClasses,
  equivalenceClasses,
  theIntegersModuloN,
];
