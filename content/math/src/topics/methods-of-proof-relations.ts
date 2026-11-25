import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { svgDocument } from "@ga/subject-math";

import { numberProblem, why, yesNo } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
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
  /** show writes the condition with the numbers a and b put in. */
  readonly show: (a: number, b: number) => string;
}

/** finiteRule picks a rule for a relation between small positive integers. */
function finiteRule(rng: Rng): RuleRel {
  const k = rng.int(2, 4);
  const s = rng.int(4, 9);
  return rng.pick<RuleRel>([
    { tex: "a < b", holds: (a, b) => a < b, show: (a, b) => `${a} < ${b}` },
    { tex: "a \\le b", holds: (a, b) => a <= b, show: (a, b) => `${a} \\le ${b}` },
    { tex: "a \\mid b", holds: (a, b) => b % a === 0, show: (a, b) => `${a} \\mid ${b}` },
    { tex: `a + b = ${s}`, holds: (a, b) => a + b === s, show: (a, b) => `${a} + ${b} = ${s}` },
    { tex: `b = a + ${k - 1}`, holds: (a, b) => b === a + k - 1, show: (a, b) => `${b} = ${a} + ${k - 1}` },
    { tex: `${k} \\mid a + b`, holds: (a, b) => (a + b) % k === 0, show: (a, b) => `${k} \\mid ${a} + ${b}` },
    { tex: `|a - b| \\le ${k - 1}`, holds: (a, b) => Math.abs(a - b) <= k - 1, show: (a, b) => `|${a} - ${b}| \\le ${k - 1}` },
    { tex: `a + b > ${s}`, holds: (a, b) => a + b > s, show: (a, b) => `${a} + ${b} > ${s}` },
    { tex: `b = ${k}a`, holds: (a, b) => b === k * a, show: (a, b) => `${b} = ${k} \\cdot ${a}` },
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
  intro: t(
    "Let $A = \\{1, 2, 3\\}$ and $R = \\{(a, b) \\in A \\times A : a + b = 4\\}$. Going through the $9$ pairs of $A \\times A$, the condition holds for $(1, 3)$, $(2, 2)$ and $(3, 1)$, so $R = \\{(1, 3), (2, 2), (3, 1)\\}$: a relation is just the set of pairs that satisfy its condition.\n\nCheck: $(1, 3)$ and $(3, 1)$ are different pairs, and both belong to $R$ because $1 + 3 = 3 + 1 = 4$; $(1, 2)$ does not, because $1 + 2 = 3$.\n\nIn this lesson we list and count the pairs of a relation on a finite set, and test whether a given pair belongs to it.",
    "设 $A = \\{1, 2, 3\\}$，$R = \\{(a, b) \\in A \\times A : a + b = 4\\}$。逐一检查 $A \\times A$ 的 $9$ 个有序对，条件对 $(1, 3)$、$(2, 2)$、$(3, 1)$ 成立，所以 $R = \\{(1, 3), (2, 2), (3, 1)\\}$：关系就是满足其条件的有序对的集合。\n\n检验：$(1, 3)$ 与 $(3, 1)$ 是不同的有序对，二者都属于 $R$，因为 $1 + 3 = 3 + 1 = 4$；$(1, 2)$ 不属于 $R$，因为 $1 + 2 = 3$。\n\n本课我们列出并统计有限集上关系的有序对，并判断给定的有序对是否属于它。",
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
        "A relation on a finite set is a set of ordered pairs, so list the pairs that satisfy the condition and count them. Let $A = \\{1, 2, 3, 4\\}$ and $R = \\{(a, b) \\in A \\times A : a < b\\}$. Then $R = \\{(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)\\}$ has $6$ pairs.\n\n> **Watch out.** Order matters: $(1, 2)$ and $(2, 1)$ are different pairs, and each counts only if it satisfies the condition. A pair $(a, a)$ counts too when the condition allows it.",
        "有限集上的关系是有序对的集合，所以列出满足条件的有序对并计数。设 $A = \\{1, 2, 3, 4\\}$，$R = \\{(a, b) \\in A \\times A : a < b\\}$。则 $R = \\{(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)\\}$，共 $6$ 个序对。\n\n> **注意。** 顺序很重要：$(1, 2)$ 与 $(2, 1)$ 是不同的有序对，各自只有满足条件才计入。条件允许时，$(a, a)$ 这样的有序对也要计入。",
      ),
      generate(rng) {
        const n = rng.int(4, 7);
        let rule: RuleRel;
        let r: Pair[];
        do {
          rule = finiteRule(rng);
          r = pairsOf(n).filter(([a, b]) => rule.holds(a, b));
        } while (r.length === 0);
        const rows = range(1, n).map((a) => [a, r.filter(([x]) => x === a).map(([, b]) => b)] as const);
        const rowText = (none: string, sep: string) =>
          rows.map(([a, bs]) => `$a = ${a}$${sep}${bs.length === 0 ? none : `$b = ${bs.join(", ")}$`}`);
        const out = pairsOf(n).find(([a, b]) => !rule.holds(a, b));
        const [p, q] = r[0]!;
        return numberProblem({
          prompt: t(
            `Let $A = ${setTex(range(1, n))}$ and $R = \\{(a, b) \\in A \\times A : ${rule.tex}\\}$. How many pairs are in $R$?`,
            `设 $A = ${setTex(range(1, n))}$，$R = \\{(a, b) \\in A \\times A : ${rule.tex}\\}$。$R$ 中有多少个序对？`,
          ),
          answer: r.length,
          wrong: [r.length + 1, r.length - 1],
          mistakes: [
            why(
              n * n - r.length,
              "That counts the pairs of $A \\times A$ that fail the condition.",
              "这数的是 $A \\times A$ 中不满足条件的有序对。",
            ),
            why(
              n * n,
              "That counts every pair of $A \\times A$, without the condition.",
              "这数的是 $A \\times A$ 的全部有序对，没有考虑条件。",
            ),
          ],
          solution: walked(
            [
              [
                ["Go through the first entries", "按第一个元素逐一检查"],
                t(`${rowText("none", ": ").join("; ")}.`, `${rowText("无", "：").join("；")}。`),
              ],
              [
                ["Collect the pairs", "收集有序对"],
                t(
                  `$R = ${relTex(r)}$, which has $${r.length}$ ${r.length === 1 ? "pair" : "pairs"}.`,
                  `$R = ${relTex(r)}$，共 $${r.length}$ 个序对。`,
                ),
              ],
            ],
            t(
              `$(${p}, ${q})$ is in $R$ because $${rule.show(p, q)}$ holds${out ? `, while $(${out[0]}, ${out[1]})$ is not, because $${rule.show(out[0], out[1])}$ fails` : ""}.`,
              `$(${p}, ${q})$ 属于 $R$，因为 $${rule.show(p, q)}$ 成立${out ? `；而 $(${out[0]}, ${out[1]})$ 不属于 $R$，因为 $${rule.show(out[0], out[1])}$ 不成立` : ""}。`,
            ),
          ),
        });
      },
    },
    {
      id: "pairs-in-a-relation",
      title: t("Pairs in a relation", "关系中的序对"),
      explanation: t(
        "A relation can hold for a pair in one order but not the other, because the first and second positions play different roles. With $A = \\{1, \\dots, 6\\}$ and $a \\mathrel{R} b \\iff a \\mid b$: $(2, 6) \\in R$ because $2 \\mid 6$, but $(6, 2) \\notin R$. The order of a pair matters.\n\n> **Watch out.** Put the first entry in for $a$ and the second for $b$. Swapping them tests the reverse pair, which may not be in $R$.",
        "一个关系可能对某个有序对成立而对反序不成立，因为第一和第二位置的作用不同。取 $A = \\{1, \\dots, 6\\}$，$a \\mathrel{R} b \\iff a \\mid b$：$(2, 6) \\in R$，因为 $2 \\mid 6$；但 $(6, 2) \\notin R$。序对的顺序很重要。\n\n> **注意。** 第一个元素代入 $a$，第二个代入 $b$。把它们交换，检验的就是反序的有序对，它可能不属于 $R$。",
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
        const [p, q] = right;
        const back = rule.holds(q, p);
        return reasoned(
          oneOf(
            rng,
            t(
              `On $A = ${setTex(range(1, n))}$, let $a \\mathrel{R} b \\iff ${rule.tex}$. Which pair is in $R$?`,
              `在 $A = ${setTex(range(1, n))}$ 上，令 $a \\mathrel{R} b \\iff ${rule.tex}$。哪个序对属于 $R$？`,
            ),
            math(`(${p}, ${q})`),
            wrong.map(([a, b]) => math(`(${a}, ${b})`)),
            walked(
              [
                [
                  ["Substitute", "代入"],
                  t(
                    `With $a = ${p}$ and $b = ${q}$, the condition reads $${rule.show(p, q)}$.`,
                    `取 $a = ${p}$，$b = ${q}$，条件为 $${rule.show(p, q)}$。`,
                  ),
                ],
                [["Decide", "判断"], t(`It holds, so $(${p}, ${q}) \\in R$.`, `它成立，所以 $(${p}, ${q}) \\in R$。`)],
              ],
              p === q
                ? t(
                    `$(${p}, ${p})$ is its own reverse, and it satisfies $${rule.tex}$.`,
                    `$(${p}, ${p})$ 反序后不变，并且满足 $${rule.tex}$。`,
                  )
                : t(
                    `The reverse pair $(${q}, ${p})$ gives $${rule.show(q, p)}$, which ${back ? "also holds" : "fails"}${back ? "" : ": the order matters"}.`,
                    `反序的有序对 $(${q}, ${p})$ 给出 $${rule.show(q, p)}$，它${back ? "也成立" : "不成立：顺序很重要"}。`,
                  ),
            ),
          ),
          wrong.map(([a, b]): Reason => {
            const reverse = rule.holds(b, a);
            return [
              `$(${a}, ${b})$`,
              `With $a = ${a}$ and $b = ${b}$, $${rule.show(a, b)}$ is false${reverse ? `; it is the reverse $(${b}, ${a})$ that is in $R$` : ""}.`,
              `取 $a = ${a}$，$b = ${b}$，$${rule.show(a, b)}$ 不成立${reverse ? `；属于 $R$ 的是反序的 $(${b}, ${a})$` : ""}。`,
            ];
          }),
        );
      },
    },
  ],
};

/** IntRule is a rule on ℤ that also works out why a pair satisfies it. */
interface IntRule extends RuleRel {
  /** calc works the condition out for a pair that satisfies it. */
  readonly calc: (a: number, b: number) => string;
}

/** relationsOnInfiniteSets describes relations on ℤ and ℝ by rules. */
export const relationsOnInfiniteSets: TopicDef = {
  id: "relations-on-infinite-sets",
  title: t("Relations on Infinite Sets", "无限集上的关系"),
  summary: t(
    "Relations on infinite sets such as ℤ or ℝ are given by rules, such as a R b ⟺ a − b is even, or x R y ⟺ x² + y² = 1.",
    "ℤ、ℝ 等无限集上的关系由规则给出，例如 a R b ⟺ a − b 为偶数，或 x R y ⟺ x² + y² = 1。",
  ),
  intro: t(
    "On $\\mathbb{Z}$, let $a \\mathrel{R} b \\iff a - b$ is even. The relation has infinitely many pairs, so it cannot be listed; the rule describes it instead. To test $(5, -3)$, compute $5 - (-3) = 8$, which is even, so $5 \\mathrel{R} -3$. To test $(4, 1)$, compute $4 - 1 = 3$, which is odd, so $(4, 1) \\notin R$.\n\nCheck: the integers related to $5$ are $\\ldots, 1, 3, 5, 7, 9, \\ldots$, the odd numbers, and $-3$ is one of them.\n\nIn this lesson we test pairs against a rule on the integers and count the elements related to a given one.",
    "在 $\\mathbb{Z}$ 上，令 $a \\mathrel{R} b \\iff a - b$ 为偶数。这个关系有无穷多个有序对，无法一一列出，而是由规则来描述。检验 $(5, -3)$：$5 - (-3) = 8$ 是偶数，所以 $5 \\mathrel{R} -3$。检验 $(4, 1)$：$4 - 1 = 3$ 是奇数，所以 $(4, 1) \\notin R$。\n\n检验：与 $5$ 相关的整数是 $\\ldots, 1, 3, 5, 7, 9, \\ldots$，即全体奇数，$-3$ 是其中之一。\n\n本课我们用整数上的规则检验有序对，并统计与给定元素相关的元素个数。",
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
        "To decide whether a pair belongs to the relation, substitute the two numbers into its defining condition and check it. On $\\mathbb{Z}$, let $a \\mathrel{R} b \\iff 3 \\mid a - b$. Then $(7, -2) \\in R$ since $7 - (-2) = 9$, but $(7, 2) \\notin R$ since $5$ is not a multiple of $3$.\n\n> **Watch out.** Put negative numbers in with brackets: $a - b$ with $b = -2$ is $a - (-2) = a + 2$. Dropping the bracket changes the sign and the verdict.",
        "要判断一个有序对是否属于这个关系，把两个数代入它的定义条件进行检验。在 $\\mathbb{Z}$ 上，令 $a \\mathrel{R} b \\iff 3 \\mid a - b$。则 $(7, -2) \\in R$，因为 $7 - (-2) = 9$；但 $(7, 2) \\notin R$，因为 $5$ 不是 $3$ 的倍数。\n\n> **注意。** 代入负数时要加括号：$b = -2$ 时 $a - b$ 是 $a - (-2) = a + 2$。漏掉括号会改变符号，也改变结论。",
      ),
      generate(rng) {
        const k = rng.int(2, 7);
        const c = rng.int(1, 9);
        const rules: IntRule[] = [
          {
            tex: `${k} \\mid a - b`,
            holds: (a, b) => mod(a - b, k) === 0,
            show: (a, b) => `${k} \\mid ${a} - ${par(b)}`,
            calc: (a, b) => `${a} - ${par(b)} = ${a - b} = ${k} \\cdot ${par((a - b) / k)}`,
          },
          {
            tex: `b = ${k}a + ${c}`,
            holds: (a, b) => b === k * a + c,
            show: (a, b) => `${b} = ${k} \\cdot ${par(a)} + ${c}`,
            calc: (a) => `${k} \\cdot ${par(a)} + ${c} = ${k * a} + ${c} = ${k * a + c}`,
          },
          {
            tex: `a^2 + b^2 = ${k * k + c * c}`,
            holds: (a, b) => a * a + b * b === k * k + c * c,
            show: (a, b) => `${par(a)}^2 + ${par(b)}^2 = ${k * k + c * c}`,
            calc: (a, b) => `${par(a)}^2 + ${par(b)}^2 = ${a * a} + ${b * b} = ${a * a + b * b}`,
          },
          {
            tex: `a < b < a + ${k}`,
            holds: (a, b) => a < b && b < a + k,
            show: (a, b) => `${a} < ${b} < ${a} + ${k}`,
            calc: (a, b) => `${a} < ${b} < ${a + k}`,
          },
          {
            tex: `ab = ${k * c}`,
            holds: (a, b) => a * b === k * c,
            show: (a, b) => `${par(a)} \\cdot ${par(b)} = ${k * c}`,
            calc: (a, b) => `${par(a)} \\cdot ${par(b)} = ${a * b}`,
          },
        ];
        const rule = rng.pick(rules);
        const cands = range(-12, 12).flatMap((a) => range(-30, 30).map((b) => [a, b] as Pair));
        const ins = cands.filter(([a, b]) => rule.holds(a, b));
        const outs = cands.filter(([a, b]) => !rule.holds(a, b) && ins.some(([x, y]) => Math.abs(x - a) + Math.abs(y - b) <= 2));
        const right = rng.pick(ins);
        const wrong = rng.shuffle(outs).slice(0, 3);
        const [p, q] = right;
        return reasoned(
          oneOf(
            rng,
            t(
              `On $\\mathbb{Z}$, let $a \\mathrel{R} b \\iff ${rule.tex}$. Which pair is in $R$?`,
              `在 $\\mathbb{Z}$ 上，令 $a \\mathrel{R} b \\iff ${rule.tex}$。哪个序对属于 $R$？`,
            ),
            math(`(${p}, ${q})`),
            wrong.map(([a, b]) => math(`(${a}, ${b})`)),
            walked(
              [
                [
                  ["Substitute", "代入"],
                  t(`For $(${p}, ${q})$ the condition reads $${rule.show(p, q)}$.`, `对 $(${p}, ${q})$，条件为 $${rule.show(p, q)}$。`),
                ],
                [
                  ["Work it out", "计算"],
                  t(
                    `$${rule.calc(p, q)}$, so the condition holds and $(${p}, ${q}) \\in R$.`,
                    `$${rule.calc(p, q)}$，所以条件成立，$(${p}, ${q}) \\in R$。`,
                  ),
                ],
              ],
              t(
                `Each other option fails, for example $(${wrong[0]![0]}, ${wrong[0]![1]})$: $${rule.show(wrong[0]![0], wrong[0]![1])}$ is false.`,
                `其余选项都不成立，例如 $(${wrong[0]![0]}, ${wrong[0]![1]})$：$${rule.show(wrong[0]![0], wrong[0]![1])}$ 不成立。`,
              ),
            ),
          ),
          wrong.map(
            ([a, b]): Reason => [
              `$(${a}, ${b})$`,
              `For this pair $${rule.show(a, b)}$ is false.`,
              `对这个有序对，$${rule.show(a, b)}$ 不成立。`,
            ],
          ),
        );
      },
    },
    {
      id: "counting-related-elements",
      title: t("Counting related elements", "统计相关元素"),
      explanation: t(
        "Fix the first element and find every second element that satisfies the condition with it. On $\\mathbb{Z}$, let $a \\mathrel{R} b \\iff |a - b| \\le 2$. The integers $b$ with $5 \\mathrel{R} b$ are $3, 4, 5, 6, 7$: five of them.\n\n> **Watch out.** Count both sides and the middle: the integers from $x - k$ to $x + k$ number $2k + 1$, not $2k$. With $<$ in place of $\\le$, the two ends drop out.",
        "固定第一个元素，找出与它满足条件的所有第二个元素。在 $\\mathbb{Z}$ 上，令 $a \\mathrel{R} b \\iff |a - b| \\le 2$。满足 $5 \\mathrel{R} b$ 的整数 $b$ 是 $3, 4, 5, 6, 7$：共五个。\n\n> **注意。** 两侧和中间都要数：从 $x - k$ 到 $x + k$ 的整数有 $2k + 1$ 个，不是 $2k$ 个。把 $\\le$ 换成 $<$ 时，两端的数不算。",
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
        const lo = ys[0]!;
        const hi = ys[ys.length - 1]!;
        const left = r - x0 * x0;
        const s = Math.floor(Math.sqrt(left));
        const steps: [[string, string], Text][] =
          kind === 2
            ? [
                [
                  ["Isolate y", "分离 y"],
                  t(`$${par(x0)}^2 + y^2 \\le ${r}$ means $y^2 \\le ${left}$.`, `$${par(x0)}^2 + y^2 \\le ${r}$ 即 $y^2 \\le ${left}$。`),
                ],
                [
                  ["Find the largest |y|", "求最大的 |y|"],
                  t(
                    `$${s}^2 = ${s * s} \\le ${left} < ${(s + 1) ** 2} = ${s + 1}^2$, so $-${s} \\le y \\le ${s}$.`,
                    `$${s}^2 = ${s * s} \\le ${left} < ${(s + 1) ** 2} = ${s + 1}^2$，所以 $-${s} \\le y \\le ${s}$。`,
                  ),
                ],
                [["Count", "计数"], t(`$${s} + ${s} + 1 = ${ys.length}$ integers.`, `共 $${s} + ${s} + 1 = ${ys.length}$ 个整数。`)],
              ]
            : [
                [
                  ["Rewrite as an interval", "写成区间"],
                  t(
                    kind === 0
                      ? `$|${par(x0)} - y| \\le ${k}$ means $${x0 - k} \\le y \\le ${x0 + k}$.`
                      : `$|${par(x0)} - y| < ${k}$ means $${x0 - k} < y < ${x0 + k}$, that is, $${lo} \\le y \\le ${hi}$.`,
                    kind === 0
                      ? `$|${par(x0)} - y| \\le ${k}$ 即 $${x0 - k} \\le y \\le ${x0 + k}$。`
                      : `$|${par(x0)} - y| < ${k}$ 即 $${x0 - k} < y < ${x0 + k}$，也就是 $${lo} \\le y \\le ${hi}$。`,
                  ),
                ],
                [
                  ["Count", "计数"],
                  t(`$${hi} - ${par(lo)} + 1 = ${ys.length}$ integers.`, `共 $${hi} - ${par(lo)} + 1 = ${ys.length}$ 个整数。`),
                ],
              ];
        const check =
          kind === 2
            ? t(
                `$y = ${s}$ gives $${par(x0)}^2 + ${s}^2 = ${x0 * x0 + s * s} \\le ${r}$, while $y = ${s + 1}$ gives $${x0 * x0 + (s + 1) ** 2} > ${r}$.`,
                `$y = ${s}$ 时 $${par(x0)}^2 + ${s}^2 = ${x0 * x0 + s * s} \\le ${r}$，而 $y = ${s + 1}$ 时得 $${x0 * x0 + (s + 1) ** 2} > ${r}$。`,
              )
            : t(
                `The ends work: $|${par(x0)} - ${par(hi)}| = ${hi - x0}$; one step further, $|${par(x0)} - ${par(hi + 1)}| = ${hi + 1 - x0}$ is too big.`,
                `端点满足条件：$|${par(x0)} - ${par(hi)}| = ${hi - x0}$；再往外一步，$|${par(x0)} - ${par(hi + 1)}| = ${hi + 1 - x0}$ 就太大了。`,
              );
        const mistakes =
          kind === 2
            ? [
                why(
                  s,
                  "That counts only the positive values of $y$; $y$ can be negative or $0$ too.",
                  "这只数了正的 $y$；$y$ 也可以是负数或 $0$。",
                ),
                why(2 * s, "That leaves out $y = 0$.", "这漏掉了 $y = 0$。"),
              ]
            : kind === 0
              ? [
                  why(2 * k, `That leaves out $y = ${x0}$ itself, in the middle.`, `这漏掉了中间的 $y = ${x0}$ 本身。`),
                  why(k, "That counts only one side.", "这只数了一侧。"),
                ]
              : [
                  why(
                    2 * k + 1,
                    `$<$ is strict, so $y = ${x0 - k}$ and $y = ${x0 + k}$ are left out.`,
                    `$<$ 是严格不等号，所以 $y = ${x0 - k}$ 和 $y = ${x0 + k}$ 不算。`,
                  ),
                  why(2 * k, `$<$ leaves out both ends, not just one.`, `$<$ 去掉的是两端，而不只是一端。`),
                ];
        return numberProblem({
          prompt: t(
            `On $\\mathbb{Z}$, let $x \\mathrel{R} y \\iff ${tex}$. How many integers $y$ satisfy $${x0} \\mathrel{R} y$?`,
            `在 $\\mathbb{Z}$ 上，令 $x \\mathrel{R} y \\iff ${tex}$。有多少个整数 $y$ 满足 $${x0} \\mathrel{R} y$？`,
          ),
          answer: ys.length,
          wrong: [ys.length + 1],
          mistakes,
          solution: walked(steps, check),
        });
      },
    },
  ],
};

/** RealRel describes a relation on ℝ with its domain and range, the wrong answers it invites and how to work it out. */
interface RealRel {
  readonly rel: string;
  readonly dom: string;
  readonly ran: string;
  readonly domWrong: readonly (readonly [string, string, string])[];
  readonly ranWrong: readonly (readonly [string, string, string])[];
  readonly domStep: Text;
  readonly ranStep: Text;
  readonly check: Text;
}

/** realRelations lists the relations on ℝ whose domain and range are asked for. */
function realRelations(c: number, r: number): RealRel[] {
  const isDomain: [string, string] = ["That is the range, the set of $y$-values.", "这是值域，即 $y$ 值的集合。"];
  const isRange: [string, string] = ["That is the domain, the set of $x$-values.", "这是定义域，即 $x$ 值的集合。"];
  return [
    {
      rel: `y^2 = x - ${c}`,
      dom: `[${c}, \\infty)`,
      ran: "\\mathbb{R}",
      domWrong: [
        ["\\mathbb{R}", ...isDomain],
        [
          `[-${c}, \\infty)`,
          `$x - ${c} \\ge 0$ gives $x \\ge ${c}$, not $x \\ge -${c}$.`,
          `$x - ${c} \\ge 0$ 得 $x \\ge ${c}$，不是 $x \\ge -${c}$。`,
        ],
        [
          "[0, \\infty)",
          `$y^2 \\ge 0$ forces $x - ${c} \\ge 0$, so $x \\ge ${c}$.`,
          `$y^2 \\ge 0$ 要求 $x - ${c} \\ge 0$，所以 $x \\ge ${c}$。`,
        ],
        [`(${c}, \\infty)`, `$x = ${c}$ works, with $y = 0$.`, `$x = ${c}$ 可以取到，此时 $y = 0$。`],
      ],
      ranWrong: [
        [`[${c}, \\infty)`, ...isRange],
        ["[0, \\infty)", "$y$ itself can be negative; only $y^2$ is nonnegative.", "$y$ 本身可以是负数；只有 $y^2$ 非负。"],
        [`[-${c}, \\infty)`, `Every real $y$ occurs, with $x = y^2 + ${c}$.`, `每个实数 $y$ 都出现，对应 $x = y^2 + ${c}$。`],
      ],
      domStep: t(
        `A real $y$ exists exactly when $x - ${c} \\ge 0$, so the domain is $[${c}, \\infty)$.`,
        `当且仅当 $x - ${c} \\ge 0$ 时存在实数 $y$，所以定义域是 $[${c}, \\infty)$。`,
      ),
      ranStep: t(
        `Every real $y$ occurs, with $x = y^2 + ${c}$, so the range is $\\mathbb{R}$.`,
        `每个实数 $y$ 都出现，对应 $x = y^2 + ${c}$，所以值域是 $\\mathbb{R}$。`,
      ),
      check: t(
        `$(${c}, 0)$ and $(${c + 4}, -2)$ satisfy $y^2 = x - ${c}$: $0 = 0$ and $4 = 4$.`,
        `$(${c}, 0)$ 和 $(${c + 4}, -2)$ 满足 $y^2 = x - ${c}$：$0 = 0$，$4 = 4$。`,
      ),
    },
    {
      rel: `y = \\sqrt{x + ${c}}`,
      dom: `[-${c}, \\infty)`,
      ran: "[0, \\infty)",
      domWrong: [
        ["[0, \\infty)", ...isDomain],
        [
          `[${c}, \\infty)`,
          `$x + ${c} \\ge 0$ gives $x \\ge -${c}$, not $x \\ge ${c}$.`,
          `$x + ${c} \\ge 0$ 得 $x \\ge -${c}$，不是 $x \\ge ${c}$。`,
        ],
        ["\\mathbb{R}", `The square root needs $x + ${c} \\ge 0$.`, `平方根要求 $x + ${c} \\ge 0$。`],
        [`(-${c}, \\infty)`, `$x = -${c}$ works, giving $y = 0$.`, `$x = -${c}$ 可以取到，此时 $y = 0$。`],
      ],
      ranWrong: [
        [`[-${c}, \\infty)`, ...isRange],
        ["\\mathbb{R}", "A square root is never negative.", "平方根永远不是负数。"],
        [`[${c}, \\infty)`, `$y = 0$ occurs, at $x = -${c}$.`, `$y = 0$ 可以取到，在 $x = -${c}$ 处。`],
      ],
      domStep: t(
        `The root is defined exactly when $x + ${c} \\ge 0$, so the domain is $[-${c}, \\infty)$.`,
        `当且仅当 $x + ${c} \\ge 0$ 时根式有定义，所以定义域是 $[-${c}, \\infty)$。`,
      ),
      ranStep: t(
        `A square root takes every value $\\ge 0$ and nothing else, so the range is $[0, \\infty)$.`,
        `平方根取遍所有 $\\ge 0$ 的值，且只取这些值，所以值域是 $[0, \\infty)$。`,
      ),
      check: t(
        `$x = -${c}$ gives $y = 0$, and $x = ${9 - c}$ gives $y = \\sqrt{9} = 3$.`,
        `$x = -${c}$ 时 $y = 0$，$x = ${9 - c}$ 时 $y = \\sqrt{9} = 3$。`,
      ),
    },
    {
      rel: `x^2 + y^2 = ${r * r}`,
      dom: `[-${r}, ${r}]`,
      ran: `[-${r}, ${r}]`,
      domWrong: [
        [`[0, ${r}]`, `Negative $x$ also occurs, for example $(-${r}, 0)$.`, `负的 $x$ 也会出现，例如 $(-${r}, 0)$。`],
        [
          `[-${r * r}, ${r * r}]`,
          `$x^2 \\le ${r * r}$ gives $|x| \\le ${r}$, not $|x| \\le ${r * r}$.`,
          `$x^2 \\le ${r * r}$ 得 $|x| \\le ${r}$，不是 $|x| \\le ${r * r}$。`,
        ],
        ["\\mathbb{R}", `$y^2 \\ge 0$ forces $x^2 \\le ${r * r}$.`, `$y^2 \\ge 0$ 要求 $x^2 \\le ${r * r}$。`],
      ],
      ranWrong: [
        [`[0, ${r}]`, `Negative $y$ also occurs, for example $(0, -${r})$.`, `负的 $y$ 也会出现，例如 $(0, -${r})$。`],
        [
          `[-${r * r}, ${r * r}]`,
          `$y^2 \\le ${r * r}$ gives $|y| \\le ${r}$, not $|y| \\le ${r * r}$.`,
          `$y^2 \\le ${r * r}$ 得 $|y| \\le ${r}$，不是 $|y| \\le ${r * r}$。`,
        ],
        ["\\mathbb{R}", `$x^2 \\ge 0$ forces $y^2 \\le ${r * r}$.`, `$x^2 \\ge 0$ 要求 $y^2 \\le ${r * r}$。`],
      ],
      domStep: t(
        `$y^2 = ${r * r} - x^2 \\ge 0$ exactly when $-${r} \\le x \\le ${r}$, so the domain is $[-${r}, ${r}]$.`,
        `当且仅当 $-${r} \\le x \\le ${r}$ 时 $y^2 = ${r * r} - x^2 \\ge 0$，所以定义域是 $[-${r}, ${r}]$。`,
      ),
      ranStep: t(
        `In the same way $x^2 = ${r * r} - y^2 \\ge 0$ gives the range $[-${r}, ${r}]$.`,
        `同理，由 $x^2 = ${r * r} - y^2 \\ge 0$ 得值域 $[-${r}, ${r}]$。`,
      ),
      check: t(
        `$(${r}, 0)$, $(-${r}, 0)$, $(0, ${r})$ and $(0, -${r})$ all lie on the circle.`,
        `$(${r}, 0)$、$(-${r}, 0)$、$(0, ${r})$、$(0, -${r})$ 都在圆上。`,
      ),
    },
    {
      rel: `y = \\dfrac{1}{x - ${c}}`,
      dom: `\\mathbb{R} \\setminus \\{${c}\\}`,
      ran: "\\mathbb{R} \\setminus \\{0\\}",
      domWrong: [
        ["\\mathbb{R} \\setminus \\{0\\}", ...isDomain],
        [
          `\\mathbb{R} \\setminus \\{-${c}\\}`,
          `The denominator $x - ${c}$ is zero at $x = ${c}$, not at $x = -${c}$.`,
          `分母 $x - ${c}$ 在 $x = ${c}$ 处为零，不是在 $x = -${c}$ 处。`,
        ],
        ["\\mathbb{R}", `$x = ${c}$ makes the denominator zero.`, `$x = ${c}$ 使分母为零。`],
        [`(${c}, \\infty)`, `$x < ${c}$ works too; $y$ is then negative.`, `$x < ${c}$ 也可以；这时 $y$ 是负数。`],
      ],
      ranWrong: [
        [`\\mathbb{R} \\setminus \\{${c}\\}`, ...isRange],
        ["\\mathbb{R}", "A fraction with numerator $1$ is never $0$.", "分子为 $1$ 的分数永远不为 $0$。"],
        [`(${c}, \\infty)`, `$y$ takes every nonzero value, including negative ones.`, `$y$ 取遍所有非零值，包括负值。`],
      ],
      domStep: t(
        `The fraction is defined unless $x - ${c} = 0$, so the domain is $\\mathbb{R} \\setminus \\{${c}\\}$.`,
        `只要 $x - ${c} \\ne 0$ 分数就有定义，所以定义域是 $\\mathbb{R} \\setminus \\{${c}\\}$。`,
      ),
      ranStep: t(
        `For $y \\ne 0$, $x = ${c} + \\dfrac{1}{y}$ works, and $y = 0$ never occurs, so the range is $\\mathbb{R} \\setminus \\{0\\}$.`,
        `当 $y \\ne 0$ 时取 $x = ${c} + \\dfrac{1}{y}$ 即可，而 $y = 0$ 永远不出现，所以值域是 $\\mathbb{R} \\setminus \\{0\\}$。`,
      ),
      check: t(
        `$x = ${c + 2}$ gives $y = \\dfrac{1}{2}$, and $x = ${c - 1}$ gives $y = -1$.`,
        `$x = ${c + 2}$ 时 $y = \\dfrac{1}{2}$，$x = ${c - 1}$ 时 $y = -1$。`,
      ),
    },
    {
      rel: `x = y^2 + ${c}`,
      dom: `[${c}, \\infty)`,
      ran: "\\mathbb{R}",
      domWrong: [
        ["\\mathbb{R}", ...isDomain],
        [
          "[0, \\infty)",
          `$x = y^2 + ${c} \\ge ${c}$, so values of $x$ below $${c}$ never occur.`,
          `$x = y^2 + ${c} \\ge ${c}$，所以小于 $${c}$ 的 $x$ 不会出现。`,
        ],
        [
          `[-${c}, \\infty)`,
          `$y^2 \\ge 0$ gives $x \\ge ${c}$, not $x \\ge -${c}$.`,
          `$y^2 \\ge 0$ 得 $x \\ge ${c}$，不是 $x \\ge -${c}$。`,
        ],
        [`(${c}, \\infty)`, `$x = ${c}$ occurs, at $y = 0$.`, `$x = ${c}$ 可以取到，在 $y = 0$ 处。`],
      ],
      ranWrong: [
        [`[${c}, \\infty)`, ...isRange],
        ["[0, \\infty)", "$y$ itself can be negative; only $y^2$ is nonnegative.", "$y$ 本身可以是负数；只有 $y^2$ 非负。"],
        [`(${c}, \\infty)`, `Any real $y$ works: it gives $x = y^2 + ${c}$.`, `任何实数 $y$ 都可以：它给出 $x = y^2 + ${c}$。`],
      ],
      domStep: t(
        `$x = y^2 + ${c}$ takes every value $\\ge ${c}$ and nothing less, so the domain is $[${c}, \\infty)$.`,
        `$x = y^2 + ${c}$ 取遍所有 $\\ge ${c}$ 的值，不会更小，所以定义域是 $[${c}, \\infty)$。`,
      ),
      ranStep: t(`Every real $y$ gives an $x$, so the range is $\\mathbb{R}$.`, `每个实数 $y$ 都给出一个 $x$，所以值域是 $\\mathbb{R}$。`),
      check: t(`$y = 0$ gives $x = ${c}$, and $y = -3$ gives $x = ${9 + c}$.`, `$y = 0$ 时 $x = ${c}$，$y = -3$ 时 $x = ${9 + c}$。`),
    },
    {
      rel: `|y| = x - ${c}`,
      dom: `[${c}, \\infty)`,
      ran: "\\mathbb{R}",
      domWrong: [
        ["\\mathbb{R}", ...isDomain],
        [
          "[0, \\infty)",
          `$|y| \\ge 0$ forces $x - ${c} \\ge 0$, so $x \\ge ${c}$.`,
          `$|y| \\ge 0$ 要求 $x - ${c} \\ge 0$，所以 $x \\ge ${c}$。`,
        ],
        [`(${c}, \\infty)`, `$x = ${c}$ works, with $y = 0$.`, `$x = ${c}$ 可以取到，此时 $y = 0$。`],
        [
          `[-${c}, \\infty)`,
          `$x - ${c} \\ge 0$ gives $x \\ge ${c}$, not $x \\ge -${c}$.`,
          `$x - ${c} \\ge 0$ 得 $x \\ge ${c}$，不是 $x \\ge -${c}$。`,
        ],
      ],
      ranWrong: [
        [`[${c}, \\infty)`, ...isRange],
        ["[0, \\infty)", "$y$ itself can be negative; only $|y|$ is nonnegative.", "$y$ 本身可以是负数；只有 $|y|$ 非负。"],
        [`(${c}, \\infty)`, `Every real $y$ occurs, with $x = |y| + ${c}$.`, `每个实数 $y$ 都出现，对应 $x = |y| + ${c}$。`],
      ],
      domStep: t(
        `$|y| = x - ${c}$ has a solution exactly when $x - ${c} \\ge 0$, so the domain is $[${c}, \\infty)$.`,
        `当且仅当 $x - ${c} \\ge 0$ 时 $|y| = x - ${c}$ 有解，所以定义域是 $[${c}, \\infty)$。`,
      ),
      ranStep: t(
        `Every real $y$ occurs, with $x = |y| + ${c}$, so the range is $\\mathbb{R}$.`,
        `每个实数 $y$ 都出现，对应 $x = |y| + ${c}$，所以值域是 $\\mathbb{R}$。`,
      ),
      check: t(
        `$(${c + 2}, 2)$ and $(${c + 2}, -2)$ both satisfy $|y| = x - ${c}$.`,
        `$(${c + 2}, 2)$ 和 $(${c + 2}, -2)$ 都满足 $|y| = x - ${c}$。`,
      ),
    },
  ];
}

/** theDomainAndRangeOfARelation finds the first and second coordinates of a relation. */
export const theDomainAndRangeOfARelation: TopicDef = {
  id: "the-domain-and-range-of-a-relation",
  title: t("The Domain and Range of a Relation", "关系的定义域与值域"),
  summary: t(
    "The domain of R is the set of first coordinates of its pairs; the range is the set of second coordinates.",
    "R 的定义域是其序对第一个坐标组成的集合；值域是第二个坐标组成的集合。",
  ),
  intro: t(
    "Let $R = \\{(1, 5), (2, 5), (4, 7)\\}$. The first coordinates are $1, 2, 4$, so $\\operatorname{dom} R = \\{1, 2, 4\\}$. The second coordinates are $5, 5, 7$; listing each value once gives $\\operatorname{ran} R = \\{5, 7\\}$.\n\nCheck: every pair of $R$ has its first coordinate in $\\{1, 2, 4\\}$ and its second in $\\{5, 7\\}$, and every listed value comes from some pair.\n\nIn this lesson we find the domain and range of finite relations and of relations on $\\mathbb{R}$ given by equations.",
    "设 $R = \\{(1, 5), (2, 5), (4, 7)\\}$。第一个坐标是 $1, 2, 4$，所以 $\\operatorname{dom} R = \\{1, 2, 4\\}$。第二个坐标是 $5, 5, 7$；每个值只列一次，得 $\\operatorname{ran} R = \\{5, 7\\}$。\n\n检验：$R$ 的每个有序对，第一个坐标都在 $\\{1, 2, 4\\}$ 中，第二个坐标都在 $\\{5, 7\\}$ 中，而且列出的每个值都来自某个有序对。\n\n本课我们求有限关系的定义域和值域，以及由方程给出的 $\\mathbb{R}$ 上关系的定义域和值域。",
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
        "The domain collects the first entries of the pairs and the range collects the second entries, each listed once. For $R = \\{(1, 4), (2, 4), (2, 5), (6, 1)\\}$: $\\operatorname{dom} R = \\{1, 2, 6\\}$ and $\\operatorname{ran} R = \\{1, 4, 5\\}$.\n\n> **Watch out.** The domain uses only first entries and the range only second entries. A number that appears in a pair may belong to one set and not the other.",
        "定义域收集各有序对的第一个元素，值域收集第二个元素，每个只列一次。对 $R = \\{(1, 4), (2, 4), (2, 5), (6, 1)\\}$：$\\operatorname{dom} R = \\{1, 2, 6\\}$，$\\operatorname{ran} R = \\{1, 4, 5\\}$。\n\n> **注意。** 定义域只用第一个元素，值域只用第二个元素。出现在某个有序对中的数，可能只属于其中一个集合。",
      ),
      generate(rng) {
        const size = rng.int(3, 6);
        const r = sortPairs(range(1, size).map(() => [rng.int(1, 9), rng.int(1, 9)] as Pair));
        const dom = r.map(([a]) => a);
        const ran = r.map(([, b]) => b);
        const askDom = rng.bool();
        const coords = askDom ? dom : ran;
        const set = [...new Set(coords)].sort((x, y) => x - y);
        const [en, zh] = askDom ? ["first", "第一个"] : ["second", "第二个"];
        return setProblem({
          prompt: t(
            `Find the ${askDom ? "domain" : "range"} of $R = ${relTex(r)}$.`,
            `求 $R = ${relTex(r)}$ 的${askDom ? "定义域" : "值域"}。`,
          ),
          values: coords,
          wrong: [askDom ? ran : dom, [...dom, ...ran]],
          mistakes: [
            [
              askDom ? ran : dom,
              askDom
                ? "Those are the second coordinates, which form the range."
                : "Those are the first coordinates, which form the domain.",
              askDom ? "这些是第二个坐标，组成的是值域。" : "这些是第一个坐标，组成的是定义域。",
            ],
            [
              [...dom, ...ran],
              `That mixes both coordinates; use only the ${en} coordinate of each pair.`,
              `这把两个坐标混在一起了；只用每个有序对的${zh}坐标。`,
            ],
          ],
          solution: walked(
            [
              [
                [`Read off the ${en} coordinates`, `读出${zh}坐标`],
                t(`In order, they are $${coords.join(", ")}$.`, `依次是 $${coords.join(", ")}$。`),
              ],
              [
                ["Drop repeats", "去掉重复"],
                t(`The ${askDom ? "domain" : "range"} is $${setTex(set)}$.`, `${askDom ? "定义域" : "值域"}是 $${setTex(set)}$。`),
              ],
            ],
            t(
              `It has $${set.length}$ element${set.length === 1 ? "" : "s"} for $${r.length}$ pairs${set.length < r.length ? ", since some pairs share a value" : ""}; each element comes from a pair, such as $${set[0]}$ from $(${r.find((p) => p[askDom ? 0 : 1] === set[0])!.join(", ")})$.`,
              `$${r.length}$ 个有序对给出 $${set.length}$ 个元素${set.length < r.length ? "，因为有些有序对的值相同" : ""}；每个元素都来自某个有序对，例如 $${set[0]}$ 来自 $(${r.find((p) => p[askDom ? 0 : 1] === set[0])!.join(", ")})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "domain-and-range-of-a-relation-on-the-reals",
      title: t("Relations on $\\mathbb{R}$", "$\\mathbb{R}$ 上的关系"),
      explanation: t(
        "An input is in the domain when some output satisfies the equation with it, so solve for the outputs and see when they exist. For $R = \\{(x, y) \\in \\mathbb{R}^2 : y^2 = x - 3\\}$: a real $y$ exists exactly when $x \\ge 3$, so $\\operatorname{dom} R = [3, \\infty)$, and every real $y$ occurs, so $\\operatorname{ran} R = \\mathbb{R}$.\n\n> **Watch out.** Find the condition and solve it, sign and all: $x - 3 \\ge 0$ gives $x \\ge 3$, not $x \\ge -3$. Check an end point too, since it often belongs to the set.",
        "如果存在某个输出与一个输入满足方程，这个输入就在定义域中，所以要解出输出，看它何时存在。对 $R = \\{(x, y) \\in \\mathbb{R}^2 : y^2 = x - 3\\}$：当且仅当 $x \\ge 3$ 时存在实数 $y$，所以 $\\operatorname{dom} R = [3, \\infty)$；每个实数 $y$ 都出现，所以 $\\operatorname{ran} R = \\mathbb{R}$。\n\n> **注意。** 找出条件并连同符号一起解出：$x - 3 \\ge 0$ 得 $x \\ge 3$，不是 $x \\ge -3$。还要检查端点，它常常属于这个集合。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const r = rng.int(1, 6);
        const rel = rng.pick(realRelations(c, r));
        const askDom = rng.bool();
        const right = askDom ? rel.dom : rel.ran;
        const wrongs = askDom ? rel.domWrong : rel.ranWrong;
        return reasoned(
          oneOf(
            rng,
            t(
              `Find the ${askDom ? "domain" : "range"} of $R = \\{(x, y) \\in \\mathbb{R}^2 : ${rel.rel}\\}$.`,
              `求 $R = \\{(x, y) \\in \\mathbb{R}^2 : ${rel.rel}\\}$ 的${askDom ? "定义域" : "值域"}。`,
            ),
            math(right),
            wrongs.map(([w]) => math(w)),
            walked(
              askDom
                ? [
                    [["Find the x-values", "求 x 的取值"], rel.domStep],
                    [["Find the y-values", "求 y 的取值"], rel.ranStep],
                  ]
                : [
                    [["Find the y-values", "求 y 的取值"], rel.ranStep],
                    [["Find the x-values", "求 x 的取值"], rel.domStep],
                  ],
              rel.check,
            ),
          ),
          wrongs.map(([w, en, zh]): Reason => [`$${w}$`, en, zh]),
        );
      },
    },
  ],
};

/** relationFigure draws the directed graph of a relation on {1, …, n}: vertices on a circle, an arrow for each pair (offset when its reverse is also present) and a loop for each (a, a). */
function relationFigure(n: number, r: readonly Pair[]): Figure {
  const [cx, cy, R, rv] = [160, 110, 70, 12];
  const fx = (x: number) => Math.round(x * 10) / 10;
  const angle = (v: number) => -Math.PI / 2 + (2 * Math.PI * (v - 1)) / n;
  const pos = (v: number) => [cx + R * Math.cos(angle(v)), cy + R * Math.sin(angle(v))] as const;
  const keys = new Set(r.map(pairKey));
  let body = "";
  for (const [a, b] of r) {
    const [x1, y1] = pos(a);
    if (a === b) {
      // A loop sits just outside the vertex, away from the center.
      const [ux, uy] = [Math.cos(angle(a)), Math.sin(angle(a))];
      const [lx, ly] = [x1 + ux * (rv + 9), y1 + uy * (rv + 9)];
      body += `<circle cx="${fx(lx)}" cy="${fx(ly)}" r="10"/>`;
      // The arrowhead points back into the vertex where the loop meets it.
      const [hx, hy] = [x1 + ux * rv - uy * 6, y1 + uy * rv + ux * 6];
      body += `<polygon fill="currentColor" points="${fx(hx)},${fx(hy)} ${fx(hx + ux * 7 - uy * 3)},${fx(hy + uy * 7 + ux * 3)} ${fx(hx + ux * 7 + uy * 4)},${fx(hy + uy * 7 - ux * 4)}"/>`;
      continue;
    }
    const [x2, y2] = pos(b);
    const len = Math.hypot(x2 - x1, y2 - y1);
    const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
    const off = keys.has(pairKey([b, a])) ? 4 : 0;
    const [ox, oy] = [-uy * off, ux * off];
    const [ex, ey] = [x2 - ux * rv + ox, y2 - uy * rv + oy];
    const [bx, by] = [ex - ux * 8, ey - uy * 8];
    body += `<line x1="${fx(x1 + ux * rv + ox)}" y1="${fx(y1 + uy * rv + oy)}" x2="${fx(ex)}" y2="${fx(ey)}"/>`;
    body += `<polygon fill="currentColor" points="${fx(ex)},${fx(ey)} ${fx(bx - uy * 3.5)},${fx(by + ux * 3.5)} ${fx(bx + uy * 3.5)},${fx(by - ux * 3.5)}"/>`;
  }
  for (let v = 1; v <= n; v++) {
    const [x, y] = pos(v);
    body += `<circle cx="${fx(x)}" cy="${fx(y)}" r="${rv}"/><text x="${fx(x)}" y="${fx(y + 4.5)}" stroke="none" fill="currentColor">${v}</text>`;
  }
  const list = r.map(([a, b]) => (a === b ? `a loop at ${a}` : `${a} → ${b}`));
  const zhList = r.map(([a, b]) => (a === b ? `${a} 处的自环` : `${a} → ${b}`));
  return {
    svg: svgDocument(220, body),
    alt: t(
      `A directed graph with vertices 1 to ${n} and ${list.length === 0 ? "no arrows" : `arrows ${list.join(", ")}`}.`,
      `一个有向图，顶点为 1 到 ${n}，${zhList.length === 0 ? "没有箭头" : `箭头为 ${zhList.join("、")}`}。`,
    ),
  };
}

/** firstOf keeps the first mistake for each wrong value. */
const firstOf = <T extends { readonly value: unknown }>(ms: readonly T[]): T[] =>
  ms.filter((m, i) => ms.findIndex((x) => String(x.value) === String(m.value)) === i);

/** pairList writes pairs as a list, or a word when there are none. */
const pairList = (r: readonly Pair[], none: string) =>
  r.length === 0
    ? none
    : `$${sortPairs(r)
        .map(([a, b]) => `(${a}, ${b})`)
        .join(", ")}$`;

/** graphicalRepresentationsOfRelations draws relations as directed graphs and matrices. */
export const graphicalRepresentationsOfRelations: TopicDef = {
  id: "graphical-representations-of-relations",
  title: t("Graphical Representations of Relations", "关系的图形表示"),
  summary: t(
    "A relation on a finite set can be drawn as a directed graph (an arrow a → b for each pair, a loop for (a, a)) or written as a 0–1 matrix.",
    "有限集上的关系可以画成有向图（每个序对画一条箭头 a → b，(a, a) 画成自环），也可以写成 0–1 矩阵。",
  ),
  intro: t(
    "Let $R = \\{(1, 2), (2, 2), (2, 3)\\}$ on $\\{1, 2, 3\\}$. Its directed graph has three vertices $1, 2, 3$, an arrow $1 \\to 2$, an arrow $2 \\to 3$ and a loop at $2$ for the pair $(2, 2)$. Its matrix has a $1$ in row $i$, column $j$ for each pair $(i, j)$: the rows are $0\\,1\\,0$, then $0\\,1\\,1$, then $0\\,0\\,0$.\n\nCheck: $R$ has $3$ pairs, the graph has $3$ arrows counting the loop, and the matrix has $3$ ones.\n\nIn this lesson we read arrows and loops off a directed graph and write the rows of the matrix of a relation.",
    "设 $R = \\{(1, 2), (2, 2), (2, 3)\\}$ 是 $\\{1, 2, 3\\}$ 上的关系。它的有向图有三个顶点 $1, 2, 3$，一条箭头 $1 \\to 2$，一条箭头 $2 \\to 3$，以及序对 $(2, 2)$ 对应的在 $2$ 处的自环。它的矩阵中，每个序对 $(i, j)$ 在第 $i$ 行第 $j$ 列放一个 $1$：各行依次是 $0\\,1\\,0$、$0\\,1\\,1$、$0\\,0\\,0$。\n\n检验：$R$ 有 $3$ 个序对，图中连同自环共 $3$ 条箭头，矩阵中有 $3$ 个 $1$。\n\n本课我们从有向图读出箭头和自环，并写出关系矩阵的各行。",
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
        "In the directed graph of $R = \\{(1, 1), (1, 2), (2, 3), (3, 1), (3, 2)\\}$ there is one loop (at $1$), and vertex $3$ has two outgoing arrows (to $1$ and $2$).\n\n> **Watch out.** An arrow $a \\to b$ leaves $a$ and enters $b$, so arrows leaving $v$ are the pairs $(v, b)$ and arrows entering $v$ are the pairs $(a, v)$. A loop at $v$ counts both as leaving $v$ and as entering $v$.",
        "在 $R = \\{(1, 1), (1, 2), (2, 3), (3, 1), (3, 2)\\}$ 的有向图中有一个自环（在 $1$ 处），顶点 $3$ 有两条出边（指向 $1$ 和 $2$）。\n\n> **注意。** 箭头 $a \\to b$ 从 $a$ 出发、指向 $b$，所以从 $v$ 出发的箭头是序对 $(v, b)$，指向 $v$ 的箭头是序对 $(a, v)$。$v$ 处的自环既算从 $v$ 出发，也算指向 $v$。",
      ),
      figure: relationFigure(3, [
        [1, 1],
        [1, 2],
        [2, 3],
        [3, 1],
        [3, 2],
      ]),
      generate(rng) {
        const n = rng.int(3, 5);
        const r = sortPairs(randomRel(rng, n, 40));
        const v = rng.int(1, n);
        const kind = rng.int(0, 2);
        const loopPairs = r.filter(([a, b]) => a === b);
        const outPairs = r.filter(([a]) => a === v);
        const inPairs = r.filter(([, b]) => b === v);
        const loops = loopPairs.length;
        const outs = outPairs.length;
        const ins = inPairs.length;
        const looped = has(r, v, v);
        const [en, zh, value, alt] = [
          ["How many loops does its directed graph have?", "它的有向图有多少个自环？", loops, r.length],
          [`How many arrows leave vertex $${v}$ (counting a loop)?`, `从顶点 $${v}$ 出发的箭头有多少条（自环也算）？`, outs, ins],
          [`How many arrows enter vertex $${v}$ (counting a loop)?`, `指向顶点 $${v}$ 的箭头有多少条（自环也算）？`, ins, outs],
        ][kind] as [string, string, number, number];
        // Half the time the relation is given only by its drawing.
        const drawn = rng.bool();
        const read: [[string, string], Text][] = drawn
          ? [
              [
                ["Read the pairs", "读出序对"],
                t(
                  `Each arrow $a \\to b$ is a pair $(a, b)$, so $R = ${relTex(r)}$.`,
                  `每条箭头 $a \\to b$ 是一个序对 $(a, b)$，所以 $R = ${relTex(r)}$。`,
                ),
              ],
            ]
          : [];
        const degree = (first: boolean) => range(1, n).map((u) => r.filter((p) => p[first ? 0 : 1] === u).length);
        const steps: [[string, string], Text][] =
          kind === 0
            ? [
                [
                  ["Find the loops", "找出自环"],
                  t(
                    `A loop is a pair $(a, a)$: ${pairList(loopPairs, "there are none")}.`,
                    `自环是形如 $(a, a)$ 的序对：${pairList(loopPairs, "没有")}。`,
                  ),
                ],
                [["Count", "计数"], t(`There ${loops === 1 ? "is $1$ loop" : `are $${loops}$ loops`}.`, `共 $${loops}$ 个自环。`)],
              ]
            : [
                [
                  [
                    kind === 1 ? `Find the pairs that start at ${v}` : `Find the pairs that end at ${v}`,
                    kind === 1 ? `找出以 ${v} 开头的序对` : `找出以 ${v} 结尾的序对`,
                  ],
                  t(
                    `${kind === 1 ? `An arrow leaving $${v}$ is a pair $(${v}, b)$` : `An arrow entering $${v}$ is a pair $(a, ${v})$`}: ${pairList(kind === 1 ? outPairs : inPairs, "there are none")}.`,
                    `${kind === 1 ? `从 $${v}$ 出发的箭头是序对 $(${v}, b)$` : `指向 $${v}$ 的箭头是序对 $(a, ${v})$`}：${pairList(kind === 1 ? outPairs : inPairs, "没有")}。`,
                  ),
                ],
                [
                  ["Count", "计数"],
                  t(
                    `That makes $${value}$ ${value === 1 ? "arrow" : "arrows"}${looped ? `, the loop at $${v}$ included` : ""}.`,
                    `共 $${value}$ 条箭头${looped ? `，包括 $${v}$ 处的自环` : ""}。`,
                  ),
                ],
              ];
        const check =
          kind === 0
            ? t(
                `The other $${r.length - loops}$ of the $${r.length}$ pairs have two different coordinates, so they are arrows between different vertices.`,
                `$${r.length}$ 个序对中其余 $${r.length - loops}$ 个的两个坐标不同，所以它们是不同顶点之间的箭头。`,
              )
            : t(
                `Every arrow ${kind === 1 ? "leaves" : "enters"} exactly one vertex: the counts for $1, \\dots, ${n}$ are $${degree(kind === 1).join(", ")}$, which add up to the $${r.length}$ pairs of $R$.`,
                `每条箭头恰好${kind === 1 ? "从一个顶点出发" : "指向一个顶点"}：顶点 $1, \\dots, ${n}$ 的计数是 $${degree(kind === 1).join(", ")}$，加起来正是 $R$ 的 $${r.length}$ 个序对。`,
              );
        const mistakes =
          kind === 0
            ? [
                why(
                  r.length,
                  "That counts every arrow; a loop is only an arrow from a vertex to itself.",
                  "这数的是所有箭头；自环只是从一个顶点指向它自身的箭头。",
                ),
              ]
            : [
                why(
                  alt,
                  kind === 1
                    ? `That counts the arrows entering $${v}$, the pairs $(a, ${v})$.`
                    : `That counts the arrows leaving $${v}$, the pairs $(${v}, b)$.`,
                  kind === 1 ? `这数的是指向 $${v}$ 的箭头，即序对 $(a, ${v})$。` : `这数的是从 $${v}$ 出发的箭头，即序对 $(${v}, b)$。`,
                ),
                ...(looped
                  ? [why(value - 1, `That leaves out the loop at $${v}$, which counts too.`, `这漏掉了 $${v}$ 处的自环，它也要算。`)]
                  : []),
              ];
        const problem = numberProblem({
          prompt: drawn
            ? t(
                `The figure shows the directed graph of a relation $R$ on $${setTex(range(1, n))}$. ${en}`,
                `图中是 $${setTex(range(1, n))}$ 上关系 $R$ 的有向图。${zh}`,
              )
            : t(
                `Let $R = ${relTex(r)}$ on $${setTex(range(1, n))}$. ${en}`,
                `设 $R = ${relTex(r)}$ 是 $${setTex(range(1, n))}$ 上的关系。${zh}`,
              ),
          answer: value,
          wrong: [alt, value + 1, Math.max(0, value - 1)],
          mistakes: firstOf(mistakes),
          solution: walked([...read, ...steps], check),
        });
        return drawn ? { ...problem, figure: relationFigure(n, r) } : problem;
      },
    },
    {
      id: "the-matrix-of-a-relation",
      title: t("The matrix of a relation", "关系矩阵"),
      explanation: t(
        "The matrix of a relation on $\\{1, \\dots, n\\}$ has entry $1$ in row $i$, column $j$ when $(i, j) \\in R$, and $0$ otherwise. For $R = \\{(1, 2), (2, 1), (2, 3)\\}$ on $\\{1, 2, 3\\}$, row $2$ is $1\\,0\\,1$.\n\n> **Watch out.** Row $i$ is about the pairs that start at $i$; column $i$ is about the pairs that end at $i$. Reading the pairs that end at $i$ gives a column, not a row.",
        "$\\{1, \\dots, n\\}$ 上关系的矩阵：若 $(i, j) \\in R$，第 $i$ 行第 $j$ 列为 $1$，否则为 $0$。对 $\\{1, 2, 3\\}$ 上的 $R = \\{(1, 2), (2, 1), (2, 3)\\}$，第 $2$ 行是 $1\\,0\\,1$。\n\n> **注意。** 第 $i$ 行对应以 $i$ 开头的序对；第 $i$ 列对应以 $i$ 结尾的序对。读以 $i$ 结尾的序对得到的是列，不是行。",
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
        const starts = r.filter(([a]) => a === i);
        const ones = starts.map(([, b]) => b);
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $R = ${relTex(r)}$ on $${setTex(range(1, n))}$. What is row $${i}$ of the matrix of $R$?`,
              `设 $R = ${relTex(r)}$ 是 $${setTex(range(1, n))}$ 上的关系。$R$ 的矩阵第 $${i}$ 行是什么？`,
            ),
            math(row),
            [col, flip, rev].map(math),
            walked(
              [
                [
                  [`Find the pairs that start at ${i}`, `找出以 ${i} 开头的序对`],
                  t(
                    starts.length === 0 ? "There are none." : `They are ${pairList(starts, "")}.`,
                    starts.length === 0 ? "没有这样的序对。" : `它们是 ${pairList(starts, "")}。`,
                  ),
                ],
                [
                  ["Fill in the row", "填写这一行"],
                  t(
                    ones.length === 0
                      ? `No column gets a $1$, so row $${i}$ is $${row}$.`
                      : `Put $1$ in column${ones.length === 1 ? "" : "s"} $${ones.join(", ")}$ and $0$ elsewhere: $${row}$.`,
                    ones.length === 0
                      ? `没有哪一列为 $1$，所以第 $${i}$ 行是 $${row}$。`
                      : `在第 $${ones.join(", ")}$ 列填 $1$，其余填 $0$：$${row}$。`,
                  ),
                ],
              ],
              t(
                `The row has $${ones.length}$ ${ones.length === 1 ? "one" : "ones"}, one for each of the $${starts.length}$ pairs of $R$ that start at $${i}$.`,
                `这一行有 $${ones.length}$ 个 $1$，对应 $R$ 中以 $${i}$ 开头的 $${starts.length}$ 个序对。`,
              ),
            ),
          ),
          [
            [
              math(col).en,
              `This is column $${i}$: row $${i}$ lists the pairs that start at $${i}$.`,
              `这是第 $${i}$ 列：第 $${i}$ 行列出的是从 $${i}$ 出发的有序对。`,
            ],
            [
              math(flip).en,
              "The $0$s and $1$s are exchanged: a $1$ marks a pair that is in the relation.",
              "$0$ 和 $1$ 弄反了：$1$ 表示该有序对在关系中。",
            ],
            [math(rev).en, "The entries are in reverse order: the columns run from $1$ upward.", "元素顺序反了：列号是从 $1$ 往上排的。"],
          ],
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
  intro: t(
    "Let $R = \\{(1, 2), (2, 3)\\}$ and $S = \\{(2, 5), (3, 6)\\}$. Reversing each pair of $R$ gives $R^{-1} = \\{(2, 1), (3, 2)\\}$. For $S \\circ R$, follow $R$ and then $S$: $1 \\to 2 \\to 5$ and $2 \\to 3 \\to 6$, so $S \\circ R = \\{(1, 5), (2, 6)\\}$.\n\nCheck: the domain of $R^{-1}$ is $\\{2, 3\\}$, the range of $R$; and in the other order, $R \\circ S$ is empty, since no pair of $S$ ends where a pair of $R$ starts.\n\nIn this lesson we form the inverse of a relation and the composition of two relations.",
    "设 $R = \\{(1, 2), (2, 3)\\}$，$S = \\{(2, 5), (3, 6)\\}$。把 $R$ 的每个序对反过来，得 $R^{-1} = \\{(2, 1), (3, 2)\\}$。求 $S \\circ R$ 时先沿 $R$ 再沿 $S$：$1 \\to 2 \\to 5$，$2 \\to 3 \\to 6$，所以 $S \\circ R = \\{(1, 5), (2, 6)\\}$。\n\n检验：$R^{-1}$ 的定义域是 $\\{2, 3\\}$，正是 $R$ 的值域；换个顺序，$R \\circ S$ 是空集，因为 $S$ 中没有哪个序对的终点是 $R$ 中某个序对的起点。\n\n本课我们求关系的逆，以及两个关系的复合。",
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
        "The inverse relation reverses the direction of every pair, so its domain and range are the range and domain of the original. Reverse every pair: if $R = \\{(1, 3), (2, 3), (4, 1)\\}$, then $R^{-1} = \\{(3, 1), (3, 2), (1, 4)\\}$. The domain of $R^{-1}$ is the range of $R$.\n\n> **Watch out.** Swap the two entries of every pair, not just some of them, and keep each pair's own entries together: $(4, 1)$ becomes $(1, 4)$.",
        "逆关系把每个有序对的方向反过来，所以它的定义域和值域分别是原关系的值域和定义域。把每个序对反过来：若 $R = \\{(1, 3), (2, 3), (4, 1)\\}$，则 $R^{-1} = \\{(3, 1), (3, 2), (1, 4)\\}$。$R^{-1}$ 的定义域就是 $R$ 的值域。\n\n> **注意。** 每个序对的两个元素都要交换，不能只换一部分，而且每个序对的两个元素要保持在一起：$(4, 1)$ 变成 $(1, 4)$。",
      ),
      generate(rng) {
        let r: Pair[];
        do r = sortPairs(range(1, rng.int(3, 4)).map(() => [rng.int(1, 6), rng.int(1, 6)] as Pair));
        while (r.length < 3 || isSymmetric(r));
        const inv = r.map(([a, b]) => [b, a] as Pair);
        const half = r.map((p, i) => (i === 0 ? ([p[1], p[0]] as Pair) : p));
        const comp = r.map(([a, b]) => [7 - a, 7 - b] as Pair);
        const neg = inv.map(([a, b], i) => (i === inv.length - 1 ? ([a, a] as Pair) : ([a, b] as Pair)));
        const last = r[r.length - 1]!;
        const ran = [...new Set(r.map(([, b]) => b))].sort((x, y) => x - y);
        return reasoned(
          oneOf(
            rng,
            t(`Let $R = ${relTex(r)}$. What is $R^{-1}$?`, `设 $R = ${relTex(r)}$。$R^{-1}$ 是什么？`),
            math(relTex(inv)),
            [r, half, comp, neg].map((x) => math(relTex(x))),
            walked(
              [
                [
                  ["Reverse each pair", "把每个序对反过来"],
                  t(
                    `${r.map(([a, b]) => `$(${a}, ${b}) \\to (${b}, ${a})$`).join(", ")}.`,
                    `${r.map(([a, b]) => `$(${a}, ${b}) \\to (${b}, ${a})$`).join("，")}。`,
                  ),
                ],
                [["Collect them", "汇总"], t(`$R^{-1} = ${relTex(inv)}$.`, `$R^{-1} = ${relTex(inv)}$。`)],
              ],
              t(
                `The first coordinates of $R^{-1}$ form $${setTex(ran)}$, the range of $R$, as they should.`,
                `$R^{-1}$ 的第一个坐标组成 $${setTex(ran)}$，正是 $R$ 的值域。`,
              ),
            ),
          ),
          [
            [math(relTex(r)).en, "That is $R$ itself: every pair has to be reversed.", "这就是 $R$ 本身：每个序对都要反过来。"],
            [math(relTex(half)).en, "Only one pair was reversed; every pair has to be.", "只反转了一个序对；每个序对都要反转。"],
            [
              math(relTex(comp)).en,
              "That replaces each entry by $7$ minus it; the inverse swaps the two entries of each pair.",
              "这是把每个元素换成 $7$ 减去它；求逆是交换每个序对的两个元素。",
            ],
            [
              math(relTex(neg)).en,
              `The pair $(${last[0]}, ${last[1]})$ reverses to $(${last[1]}, ${last[0]})$; its entries were not kept together.`,
              `序对 $(${last[0]}, ${last[1]})$ 反过来是 $(${last[1]}, ${last[0]})$；它的两个元素没有保持在一起。`,
            ],
          ],
        );
      },
    },
    {
      id: "composing-relations",
      title: t("Composing relations", "关系的复合"),
      explanation: t(
        "The composition links pairs end to end, relating a first element to a final element whenever some middle element connects them. With $R = \\{(1, 2), (1, 3), (2, 2)\\}$ and $S = \\{(2, 5), (3, 6)\\}$: $1 \\to 2 \\to 5$, $1 \\to 3 \\to 6$ and $2 \\to 2 \\to 5$, so $S \\circ R = \\{(1, 5), (1, 6), (2, 5)\\}$.\n\n> **Watch out.** $S \\circ R$ follows $R$ first and then $S$: the middle element is the second entry of a pair of $R$ and the first entry of a pair of $S$. Linking them the other way gives $R \\circ S$, which is usually a different relation.",
        "复合把有序对首尾相接，只要有某个中间元素把它们连起来，就把第一个元素与最终元素关联起来。取 $R = \\{(1, 2), (1, 3), (2, 2)\\}$，$S = \\{(2, 5), (3, 6)\\}$：$1 \\to 2 \\to 5$，$1 \\to 3 \\to 6$，$2 \\to 2 \\to 5$，所以 $S \\circ R = \\{(1, 5), (1, 6), (2, 5)\\}$。\n\n> **注意。** $S \\circ R$ 先沿 $R$ 再沿 $S$：中间元素是 $R$ 中序对的第二个元素，也是 $S$ 中序对的第一个元素。反过来连接得到的是 $R \\circ S$，它通常是另一个关系。",
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
        const chains = (zh: boolean) =>
          r
            .map(([a, b]) => {
              const next = s.filter(([b2]) => b2 === b).map(([, c]) => `$${a} \\to ${b} \\to ${c}$`);
              return next.length > 0
                ? `$(${a}, ${b})$: ${next.join(", ")}`
                : zh
                  ? `$(${a}, ${b})$：$S$ 中没有以 $${b}$ 开头的序对`
                  : `$(${a}, ${b})$: no pair of $S$ starts at $${b}$`;
            })
            .join(zh ? "；" : "; ");
        const chainCount = r.reduce((x, [, b]) => x + s.filter(([b2]) => b2 === b).length, 0);
        return numberProblem({
          prompt: t(
            `Let $R = ${relTex(r)}$ and $S = ${relTex(s)}$. How many pairs are in $S \\circ R = \\{(a, c) : a \\mathrel{R} b \\text{ and } b \\mathrel{S} c \\text{ for some } b\\}$?`,
            `设 $R = ${relTex(r)}$，$S = ${relTex(s)}$。$S \\circ R = \\{(a, c) : \\text{存在 } b \\text{ 使 } a \\mathrel{R} b \\text{ 且 } b \\mathrel{S} c\\}$ 中有多少个序对？`,
          ),
          answer: comp.length,
          wrong: [other.length, r.length * s.length, comp.length + 1],
          mistakes: firstOf([
            why(
              other.length,
              "That counts $R \\circ S$, which follows $S$ first; $S \\circ R$ follows $R$ first.",
              "这数的是 $R \\circ S$，它先沿 $S$；$S \\circ R$ 要先沿 $R$。",
            ),
            why(
              chainCount,
              "Some chains give the same pair $(a, c)$; a pair of a set counts once.",
              "有些链得到同一个序对 $(a, c)$；集合中的序对只算一次。",
            ),
            why(
              r.length * s.length,
              "That pairs every pair of $R$ with every pair of $S$, whether or not they link.",
              "这把 $R$ 的每个序对与 $S$ 的每个序对都配了对，不管它们能否相接。",
            ),
          ]),
          solution: walked(
            [
              [["Follow each pair of R into S", "从 R 的每个序对接到 S"], t(`${chains(false)}.`, `${chains(true)}。`)],
              [
                ["Collect the ends", "汇总首尾"],
                t(
                  `$S \\circ R = ${relTex(comp)}$, which has $${comp.length}$ ${comp.length === 1 ? "pair" : "pairs"}.`,
                  `$S \\circ R = ${relTex(comp)}$，共 $${comp.length}$ 个序对。`,
                ),
              ],
            ],
            t(
              `Each pair of $S \\circ R$ comes from a chain: for example $(${comp[0]![0]}, ${comp[0]![1]})$ starts at a pair of $R$ beginning with $${comp[0]![0]}$ and ends at a pair of $S$ ending with $${comp[0]![1]}$.`,
              `$S \\circ R$ 的每个序对都来自一条链：例如 $(${comp[0]![0]}, ${comp[0]![1]})$ 从 $R$ 中以 $${comp[0]![0]}$ 开头的序对出发，到 $S$ 中以 $${comp[0]![1]}$ 结尾的序对为止。`,
            ),
          ),
        });
      },
    },
  ],
};

/** TripleRule is a condition on triples, with the numbers put in for show. */
type TripleRule = readonly [
  tex: string,
  holds: (a: number, b: number, c: number) => boolean,
  show: (a: number, b: number, c: number) => string,
];

/** nAryRelations studies relations among three or more sets. */
export const nAryRelations: TopicDef = {
  id: "n-ary-relations",
  title: t("n-ary Relations", "n 元关系"),
  summary: t(
    "An n-ary relation on sets A₁, …, Aₙ is a subset of A₁ × ⋯ × Aₙ, a set of n-tuples.",
    "集合 A₁, …, Aₙ 上的 n 元关系是 A₁ × ⋯ × Aₙ 的子集，即一组 n 元组。",
  ),
  intro: t(
    "Let $A = \\{1, 2, 3\\}$ and $T = \\{(a, b, c) \\in A^3 : a + b = c\\}$. With $a = 1$: $(1, 1, 2)$ and $(1, 2, 3)$. With $a = 2$: $(2, 1, 3)$. With $a = 3$: none, since $3 + 1 > 3$. So $T$ has $3$ triples.\n\nCheck: $(1, 2, 3)$ and $(2, 1, 3)$ are different triples and both belong to $T$, while $(3, 1, 2)$ does not, because $3 + 1 \\ne 2$: positions matter.\n\nIn this lesson we count the tuples of a relation of three places and test whether a tuple belongs to it.",
    "设 $A = \\{1, 2, 3\\}$，$T = \\{(a, b, c) \\in A^3 : a + b = c\\}$。$a = 1$ 时：$(1, 1, 2)$ 和 $(1, 2, 3)$。$a = 2$ 时：$(2, 1, 3)$。$a = 3$ 时：没有，因为 $3 + 1 > 3$。所以 $T$ 有 $3$ 个三元组。\n\n检验：$(1, 2, 3)$ 与 $(2, 1, 3)$ 是不同的三元组，都属于 $T$；而 $(3, 1, 2)$ 不属于 $T$，因为 $3 + 1 \\ne 2$：位置很重要。\n\n本课我们统计三元关系中的元组，并判断一个元组是否属于它。",
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
        "A relation of three places is a set of triples, so list all the triples from the set that satisfy the condition. On $A = \\{1, 2, 3, 4\\}$, the ternary relation $\\{(a, b, c) \\in A^3 : a + b = c\\}$ contains $(1, 1, 2), (1, 2, 3), (2, 1, 3), (1, 3, 4), (2, 2, 4), (3, 1, 4)$: six triples.\n\n> **Watch out.** Order matters in a triple: $(1, 2, 3)$ and $(2, 1, 3)$ are different, and each one counts if it satisfies the condition. Go through the first entries one by one so that none is missed.",
        "三元关系是三元组的集合，所以列出集合中满足条件的所有三元组。在 $A = \\{1, 2, 3, 4\\}$ 上，三元关系 $\\{(a, b, c) \\in A^3 : a + b = c\\}$ 包含 $(1, 1, 2), (1, 2, 3), (2, 1, 3), (1, 3, 4), (2, 2, 4), (3, 1, 4)$：共六个三元组。\n\n> **注意。** 三元组的顺序很重要：$(1, 2, 3)$ 与 $(2, 1, 3)$ 不同，各自满足条件就各算一个。按第一个分量逐一检查，才不会遗漏。",
      ),
      generate(rng) {
        const n = rng.int(3, 7);
        const s = rng.int(5, 12);
        const rules: TripleRule[] = [
          ["a + b = c", (a, b, c) => a + b === c, (a, b, c) => `${a} + ${b} = ${c}`],
          ["a < b < c", (a, b, c) => a < b && b < c, (a, b, c) => `${a} < ${b} < ${c}`],
          ["a \\le b \\le c", (a, b, c) => a <= b && b <= c, (a, b, c) => `${a} \\le ${b} \\le ${c}`],
          [`a + b + c = ${s}`, (a, b, c) => a + b + c === s, (a, b, c) => `${a} + ${b} + ${c} = ${s}`],
          ["a = b = c", (a, b, c) => a === b && b === c, (a, b, c) => `${a} = ${b} = ${c}`],
          ["ab = c", (a, b, c) => a * b === c, (a, b, c) => `${a} \\cdot ${b} = ${c}`],
        ];
        const [tex, holds, show] = rng.pick(rules);
        const triples = range(1, n).flatMap((a) => range(1, n).flatMap((b) => range(1, n).map((c) => [a, b, c] as const)));
        const ins = triples.filter(([a, b, c]) => holds(a, b, c));
        const count = ins.length;
        const byFirst = range(1, n).map((a) => [a, ins.filter(([x]) => x === a).length] as const);
        const first = ins[0];
        const swapped = ins.find(([a, b, c]) => a !== b && !holds(b, a, c)) ?? ins.find(([a, b]) => a !== b);
        return numberProblem({
          prompt: t(
            `Let $A = ${setTex(range(1, n))}$. How many triples are in $\\{(a, b, c) \\in A^3 : ${tex}\\}$?`,
            `设 $A = ${setTex(range(1, n))}$。$\\{(a, b, c) \\in A^3 : ${tex}\\}$ 中有多少个三元组？`,
          ),
          answer: count,
          wrong: [count + 1, n ** 3 - count, Math.max(0, count - 1)],
          mistakes: [
            why(n ** 3 - count, "That counts the triples of $A^3$ that fail the condition.", "这数的是 $A^3$ 中不满足条件的三元组。"),
            why(n ** 3, "That counts every triple of $A^3$, without the condition.", "这数的是 $A^3$ 的全部三元组，没有考虑条件。"),
          ],
          solution: walked(
            [
              [
                ["Sort by the first entry", "按第一个分量分类"],
                t(
                  `${byFirst.map(([a, k]) => `$a = ${a}$: $${k}$`).join("; ")}.`,
                  `${byFirst.map(([a, k]) => `$a = ${a}$：$${k}$ 个`).join("；")}。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(
                  `$${byFirst.map(([, k]) => k).join(" + ")} = ${count}$ triples.`,
                  `$${byFirst.map(([, k]) => k).join(" + ")} = ${count}$ 个三元组。`,
                ),
              ],
            ],
            first === undefined
              ? t(
                  `Even the largest triple $(${n}, ${n}, ${n})$ gives $${3 * n} < ${s}$, so no triple works.`,
                  `即使是最大的三元组 $(${n}, ${n}, ${n})$，和也只有 $${3 * n} < ${s}$，所以没有三元组满足条件。`,
                )
              : swapped === undefined
                ? t(
                    `The triples are $(1, 1, 1), \\dots, (${n}, ${n}, ${n})$, one for each element of $A$; $(1, 1, 2)$ is not among them because $1 \\ne 2$.`,
                    `这些三元组是 $(1, 1, 1), \\dots, (${n}, ${n}, ${n})$，$A$ 的每个元素各一个；$(1, 1, 2)$ 不在其中，因为 $1 \\ne 2$。`,
                  )
                : t(
                    `$(${swapped.join(", ")})$ is counted because $${show(...swapped)}$; the triple $(${swapped[1]}, ${swapped[0]}, ${swapped[2]})$ ${holds(swapped[1], swapped[0], swapped[2]) ? "is counted as well, separately" : "is not, because the condition fails"}.`,
                    `$(${swapped.join(", ")})$ 被计入，因为 $${show(...swapped)}$；三元组 $(${swapped[1]}, ${swapped[0]}, ${swapped[2]})$ ${holds(swapped[1], swapped[0], swapped[2]) ? "也单独计入" : "不计入，因为条件不成立"}。`,
                  ),
          ),
        });
      },
    },
    {
      id: "tuples-in-a-relation",
      title: t("Tuples in a relation", "关系中的元组"),
      explanation: t(
        "Each position in a tuple has its own role in the condition, so changing the order of the entries can change membership. Let $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : x + 2y = z\\}$. Then $(3, 1, 5) \\in R$, but $(1, 3, 5) \\notin R$, since $1 + 6 = 7$. Positions matter.\n\n> **Watch out.** Put each entry in its own place: the first for $x$, the second for $y$, the third for $z$. Then compute the left side with its coefficients before comparing it with $z$.",
        "元组中的每个位置在条件中都有自己的作用，所以改变各项的顺序可能会改变隶属关系。设 $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : x + 2y = z\\}$。则 $(3, 1, 5) \\in R$，但 $(1, 3, 5) \\notin R$，因为 $1 + 6 = 7$。分量的位置很重要。\n\n> **注意。** 每个分量代入自己的位置：第一个代入 $x$，第二个代入 $y$，第三个代入 $z$。先连同系数算出左边，再与 $z$ 比较。",
      ),
      generate(rng) {
        const o = rng.int(1, 3);
        const p = rng.int(2, 5);
        const q = rng.int(1, 4);
        const x = rng.int(-6, 6);
        const y = rng.int(-6, 6);
        const z = o * x + p * y + q;
        const tex = `${o === 1 ? "" : o}x + ${p}y + ${q} = z`;
        const lhs = (a: number, b: number) => `${o === 1 ? "" : `${o} \\cdot `}${par(a)} + ${p} \\cdot ${par(b)} + ${q}`;
        const value = (a: number, b: number) => o * a + p * b + q;
        const wrong: [number, number, number][] = [
          [y, x, z],
          [x, y, z + 1],
          [x, y, x + y + q],
        ].filter(([a, b, c]) => o * a! + p * b! + q !== c) as [number, number, number][];
        const fmt = ([a, b, c]: readonly [number, number, number]) => math(`(${a}, ${b}, ${c})`);
        const reasons = wrong.map(([a, b, c]): Reason => {
          const base = `$${lhs(a, b)} = ${value(a, b)}$, not $${c}$`;
          const baseZh = `$${lhs(a, b)} = ${value(a, b)}$，不是 $${c}$`;
          if (a === y && b === x && c === z && x !== y)
            return [fmt([a, b, c]).en, `${base}: the first two entries are in the wrong places.`, `${baseZh}：前两个分量的位置放错了。`];
          if (c === x + y + q)
            return [fmt([a, b, c]).en, `${base}: the coefficients of $x$ and $y$ were left out.`, `${baseZh}：漏掉了 $x$ 和 $y$ 的系数。`];
          return [fmt([a, b, c]).en, `${base}.`, `${baseZh}。`];
        });
        const swapFails = x !== y && value(y, x) !== z;
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : ${tex}\\}$. Which triple is in $R$?`,
              `设 $R = \\{(x, y, z) \\in \\mathbb{Z}^3 : ${tex}\\}$。哪个三元组属于 $R$？`,
            ),
            fmt([x, y, z]),
            wrong.map(fmt),
            walked(
              [
                [
                  ["Substitute", "代入"],
                  t(
                    `For $(${x}, ${y}, ${z})$, put $x = ${x}$ and $y = ${y}$: $${lhs(x, y)} = ${z}$.`,
                    `对 $(${x}, ${y}, ${z})$，取 $x = ${x}$，$y = ${y}$：$${lhs(x, y)} = ${z}$。`,
                  ),
                ],
                [
                  ["Compare with z", "与 z 比较"],
                  t(`The third entry is $${z}$, so the triple is in $R$.`, `第三个分量正是 $${z}$，所以这个三元组属于 $R$。`),
                ],
              ],
              swapFails
                ? t(
                    `Swapping the first two entries gives $${lhs(y, x)} = ${value(y, x)} \\ne ${z}$, so $(${y}, ${x}, ${z}) \\notin R$: positions matter.`,
                    `交换前两个分量得 $${lhs(y, x)} = ${value(y, x)} \\ne ${z}$，所以 $(${y}, ${x}, ${z}) \\notin R$：位置很重要。`,
                  )
                : t(
                    `Changing the third entry to $${z + 1}$ breaks the equation, since $${lhs(x, y)}$ is $${z}$.`,
                    `把第三个分量改成 $${z + 1}$ 等式就不成立，因为 $${lhs(x, y)}$ 等于 $${z}$。`,
                  ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** RealFunction is a relation on ℝ asked about as a function, with how to decide it and what the wrong answer misses. */
interface RealFunction {
  readonly rel: string;
  readonly value: boolean;
  readonly solve: Text;
  readonly decide: Text;
  readonly check: Text;
  readonly wrong: Text;
}

/** realFunctions lists the relations on ℝ asked about as functions. */
function realFunctions(c: number): RealFunction[] {
  return [
    {
      rel: `y = x^2 - ${c}`,
      value: true,
      solve: t(`The equation already gives $y$: one value, $x^2 - ${c}$.`, `方程直接给出 $y$：只有一个值 $x^2 - ${c}$。`),
      decide: t("Each $x$ gives exactly one $y$, so it is a function.", "每个 $x$ 恰给出一个 $y$，所以它是函数。"),
      check: t(
        `$x = 2$ and $x = -2$ both give $y = ${4 - c}$; two inputs may share an output.`,
        `$x = 2$ 和 $x = -2$ 都给出 $y = ${4 - c}$；两个输入可以共用一个输出。`,
      ),
      wrong: t(
        "Two inputs sharing an output, like $x = \\pm 2$, is allowed; only one input with two outputs breaks a function.",
        "两个输入共用一个输出（如 $x = \\pm 2$）是允许的；只有一个输入对应两个输出才不是函数。",
      ),
    },
    {
      rel: `x = y^2 + ${c}`,
      value: false,
      solve: t(`$y^2 = x - ${c}$, so $y = \\pm\\sqrt{x - ${c}}$.`, `$y^2 = x - ${c}$，所以 $y = \\pm\\sqrt{x - ${c}}$。`),
      decide: t(
        `$x = ${c + 1}$ is related to $y = 1$ and $y = -1$, so it is not a function.`,
        `$x = ${c + 1}$ 同时与 $y = 1$ 和 $y = -1$ 相关，所以它不是函数。`,
      ),
      check: t(`$1^2 + ${c} = (-1)^2 + ${c} = ${c + 1}$.`, `$1^2 + ${c} = (-1)^2 + ${c} = ${c + 1}$。`),
      wrong: t(`$x = ${c + 1}$ has two outputs, $y = 1$ and $y = -1$.`, `$x = ${c + 1}$ 有两个输出：$y = 1$ 和 $y = -1$。`),
    },
    {
      rel: `y^3 = x + ${c}`,
      value: true,
      solve: t(`$y = \\sqrt[3]{x + ${c}}$.`, `$y = \\sqrt[3]{x + ${c}}$。`),
      decide: t("Every real number has exactly one real cube root, so it is a function.", "每个实数恰有一个实立方根，所以它是函数。"),
      check: t(
        `$x = ${8 - c}$ gives $y^3 = 8$, and $y = 2$ is the only real solution.`,
        `$x = ${8 - c}$ 时 $y^3 = 8$，$y = 2$ 是唯一的实数解。`,
      ),
      wrong: t(
        "Unlike a square, a cube takes each real value exactly once, so each $x$ has exactly one $y$.",
        "与平方不同，立方恰好取每个实数值一次，所以每个 $x$ 恰有一个 $y$。",
      ),
    },
    {
      rel: `x^2 + y^2 = ${c * c}`,
      value: false,
      solve: t(`$y = \\pm\\sqrt{${c * c} - x^2}$.`, `$y = \\pm\\sqrt{${c * c} - x^2}$。`),
      decide: t(
        `$x = 0$ is related to $y = ${c}$ and $y = -${c}$, so it is not a function.`,
        `$x = 0$ 同时与 $y = ${c}$ 和 $y = -${c}$ 相关，所以它不是函数。`,
      ),
      check: t(`$0^2 + ${c}^2 = 0^2 + (-${c})^2 = ${c * c}$.`, `$0^2 + ${c}^2 = 0^2 + (-${c})^2 = ${c * c}$。`),
      wrong: t(`$x = 0$ has two outputs, $y = \\pm ${c}$.`, `$x = 0$ 有两个输出：$y = \\pm ${c}$。`),
    },
    {
      rel: `y = |x - ${c}|`,
      value: true,
      solve: t(`The equation already gives $y$: one value, $|x - ${c}|$.`, `方程直接给出 $y$：只有一个值 $|x - ${c}|$。`),
      decide: t("Each $x$ gives exactly one $y$, so it is a function.", "每个 $x$ 恰给出一个 $y$，所以它是函数。"),
      check: t(
        `$x = ${c + 1}$ and $x = ${c - 1}$ both give $y = 1$; two inputs may share an output.`,
        `$x = ${c + 1}$ 和 $x = ${c - 1}$ 都给出 $y = 1$；两个输入可以共用一个输出。`,
      ),
      wrong: t(
        "The absolute value gives one output for each $x$; different inputs may share it.",
        "绝对值对每个 $x$ 给出一个输出；不同的输入可以共用它。",
      ),
    },
    {
      rel: `|y| = x + ${c}`,
      value: false,
      solve: t(`For $x + ${c} \\ge 0$, $y = \\pm(x + ${c})$.`, `当 $x + ${c} \\ge 0$ 时，$y = \\pm(x + ${c})$。`),
      decide: t(
        `$x = ${1 - c}$ is related to $y = 1$ and $y = -1$, so it is not a function.`,
        `$x = ${1 - c}$ 同时与 $y = 1$ 和 $y = -1$ 相关，所以它不是函数。`,
      ),
      check: t(`$|1| = |-1| = 1 = ${par(1 - c)} + ${c}$.`, `$|1| = |-1| = 1 = ${par(1 - c)} + ${c}$。`),
      wrong: t(`$x = ${1 - c}$ has two outputs, $y = 1$ and $y = -1$.`, `$x = ${1 - c}$ 有两个输出：$y = 1$ 和 $y = -1$。`),
    },
    {
      rel: `y = \\sqrt{x - ${c}}`,
      value: false,
      solve: t(
        `$y$ exists only when $x - ${c} \\ge 0$, that is, $x \\ge ${c}$.`,
        `只有当 $x - ${c} \\ge 0$，即 $x \\ge ${c}$ 时，$y$ 才存在。`,
      ),
      decide: t(
        "A function from $\\mathbb{R}$ needs an output for every real $x$, and $x = 0$ has none, so it is not a function.",
        "从 $\\mathbb{R}$ 出发的函数要求每个实数 $x$ 都有输出，而 $x = 0$ 没有，所以它不是函数。",
      ),
      check: t(`At $x = 0$ the root would be $\\sqrt{-${c}}$, which is not real.`, `在 $x = 0$ 处根式是 $\\sqrt{-${c}}$，它不是实数。`),
      wrong: t(
        `Each $x \\ge ${c}$ has one output, but $x = 0$ has none, and a function from $\\mathbb{R}$ needs one for every $x$.`,
        `每个 $x \\ge ${c}$ 有一个输出，但 $x = 0$ 没有，而从 $\\mathbb{R}$ 出发的函数要求每个 $x$ 都有。`,
      ),
    },
    {
      rel: `e^y = x^2 + ${c}`,
      value: true,
      solve: t(`$y = \\ln(x^2 + ${c})$, and $x^2 + ${c} \\ge ${c} > 0$.`, `$y = \\ln(x^2 + ${c})$，且 $x^2 + ${c} \\ge ${c} > 0$。`),
      decide: t(
        "The logarithm exists for every $x$ and has one value, so it is a function.",
        "对数对每个 $x$ 都存在且只有一个值，所以它是函数。",
      ),
      check: t(
        `$x = 0$ gives $e^y = ${c}$, whose only solution is $y = \\ln ${c}$.`,
        `$x = 0$ 时 $e^y = ${c}$，唯一解是 $y = \\ln ${c}$。`,
      ),
      wrong: t(
        `$x^2 + ${c} > 0$ for every $x$, so the logarithm always exists, and $e^y$ takes each positive value once.`,
        `对每个 $x$ 都有 $x^2 + ${c} > 0$，所以对数总存在，而且 $e^y$ 取每个正值恰好一次。`,
      ),
    },
  ];
}

/** functionalRelations identifies relations that are functions. */
export const functionalRelations: TopicDef = {
  id: "functional-relations",
  title: t("Functional Relations", "函数关系"),
  summary: t(
    "A relation R from A to B is a function when every a ∈ A is related to exactly one b ∈ B.",
    "若每个 a ∈ A 都恰与一个 b ∈ B 相关，则从 A 到 B 的关系 R 是函数。",
  ),
  intro: t(
    "From $A = \\{1, 2, 3\\}$ to $B = \\{4, 5\\}$, take $R = \\{(1, 4), (2, 4), (3, 5)\\}$. The partners are $1 \\to 4$, $2 \\to 4$, $3 \\to 5$: each element of $A$ has exactly one, so $R$ is a function, even though $1$ and $2$ share theirs. Adding $(1, 5)$ would give $1$ two partners, and the result would not be a function.\n\nCheck: $R$ has $3$ pairs for the $3$ elements of $A$, and each element appears exactly once as a first coordinate.\n\nIn this lesson we decide whether a finite relation, or a relation on $\\mathbb{R}$ given by an equation, is a function.",
    "从 $A = \\{1, 2, 3\\}$ 到 $B = \\{4, 5\\}$，取 $R = \\{(1, 4), (2, 4), (3, 5)\\}$。对应关系是 $1 \\to 4$、$2 \\to 4$、$3 \\to 5$：$A$ 的每个元素恰有一个对应元素，所以 $R$ 是函数，尽管 $1$ 和 $2$ 的对应元素相同。若再加入 $(1, 5)$，$1$ 就有两个对应元素，结果就不是函数了。\n\n检验：$A$ 有 $3$ 个元素，$R$ 有 $3$ 个序对，每个元素作为第一个坐标恰好出现一次。\n\n本课我们判断有限关系，以及由方程给出的 $\\mathbb{R}$ 上的关系，是不是函数。",
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
        "A relation is a function when every element of the domain set is related to exactly one element, never none and never two. From $A = \\{1, 2, 3\\}$ to $B = \\{4, 5\\}$: $\\{(1, 4), (2, 4), (3, 5)\\}$ is a function. $\\{(1, 4), (1, 5), (3, 5)\\}$ is not: $1$ has two partners and $2$ has none.\n\n> **Watch out.** Two elements may share a partner: $(1, 4)$ and $(2, 4)$ together are fine. What breaks a function is one element with two partners, or an element with none.",
        "当定义域集合中的每个元素都恰好与一个元素相关，既不是零个也不是两个时，这个关系就是函数。从 $A = \\{1, 2, 3\\}$ 到 $B = \\{4, 5\\}$：$\\{(1, 4), (2, 4), (3, 5)\\}$ 是函数。$\\{(1, 4), (1, 5), (3, 5)\\}$ 不是：$1$ 有两个对应元素，$2$ 没有。\n\n> **注意。** 两个元素可以共用一个对应元素：$(1, 4)$ 和 $(2, 4)$ 同时存在没有问题。使关系不是函数的，是某个元素有两个对应元素，或某个元素没有对应元素。",
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
        bad = sortPairs(bad);
        const value = kind === 0;
        const partners = (zh: boolean) =>
          range(1, m)
            .map((a) => {
              const bs = bad.filter(([x]) => x === a).map(([, b]) => b);
              return bs.length === 0 ? (zh ? `$${a}$：没有` : `$${a}$: none`) : `$${a} \\to ${bs.join(", ")}$`;
            })
            .join(zh ? "；" : "; ");
        const shared = range(1, m).some((a) => range(a + 1, m).some((b) => r[a - 1]![1] === r[b - 1]![1]));
        const verdict = [
          t("Each element has exactly one partner, so $R$ is a function.", "每个元素恰有一个对应元素，所以 $R$ 是函数。"),
          t(`$${victim}$ has two partners, so $R$ is not a function.`, `$${victim}$ 有两个对应元素，所以 $R$ 不是函数。`),
          t(`$${victim}$ has no partner, so $R$ is not a function.`, `$${victim}$ 没有对应元素，所以 $R$ 不是函数。`),
        ][kind]!;
        const check = [
          t(
            `$R$ has $${m}$ pairs for $${m}$ elements, each element once as a first coordinate${shared ? "; sharing a partner is allowed" : ""}.`,
            `$${m}$ 个元素对应 $R$ 的 $${m}$ 个序对，每个元素作为第一个坐标出现一次${shared ? "；共用对应元素是允许的" : ""}。`,
          ),
          t(
            `$R$ has $${bad.length}$ pairs for only $${m}$ elements, so some element appears twice.`,
            `$R$ 有 $${bad.length}$ 个序对，却只有 $${m}$ 个元素，所以有元素出现了两次。`,
          ),
          t(
            `$R$ has only $${bad.length}$ pairs for $${m}$ elements, so some element is left out.`,
            `$R$ 只有 $${bad.length}$ 个序对，却有 $${m}$ 个元素，所以有元素被漏掉了。`,
          ),
        ][kind]!;
        const reason = [
          t(
            "Every element has exactly one partner; elements are allowed to share a partner.",
            "每个元素恰有一个对应元素；元素之间可以共用对应元素。",
          ),
          t(`$${victim}$ is related to two different elements.`, `$${victim}$ 与两个不同的元素相关。`),
          t(
            `$${victim}$ is related to nothing, and a function gives every element a partner.`,
            `$${victim}$ 不与任何元素相关，而函数要求每个元素都有对应元素。`,
          ),
        ][kind]!;
        return reasoned(
          oneOf(
            rng,
            t(
              `Is $${relTex(bad)}$ a function from $${setTex(range(1, m))}$ to $${setTex(B)}$?`,
              `$${relTex(bad)}$ 是从 $${setTex(range(1, m))}$ 到 $${setTex(B)}$ 的函数吗？`,
            ),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [["List the partners of each element", "列出每个元素的对应元素"], t(`${partners(false)}.`, `${partners(true)}。`)],
                [["Decide", "判断"], verdict],
              ],
              check,
            ),
          ),
          [[yesNo[value ? 1 : 0]!.en, reason.en, reason["zh-CN"]]],
        );
      },
    },
    {
      id: "functional-relations-on-the-reals",
      title: t("Relations on $\\mathbb{R}$", "$\\mathbb{R}$ 上的关系"),
      explanation: t(
        "A relation on the reals is a function when each input has exactly one output, which fails if an input has two or none. $\\{(x, y) : y = x^2\\}$ is a function $\\mathbb{R} \\to \\mathbb{R}$. $\\{(x, y) : x = y^2\\}$ is not: $x = 4$ is related to both $2$ and $-2$, and $x = -1$ to nothing.\n\n> **Watch out.** Solve for $y$ before deciding. A $\\pm$ in the answer means some input has two outputs, and a condition such as $x \\ge 3$ means some input has none.",
        "实数上的关系是函数，当且仅当每个输入恰好有一个输出；如果某个输入有两个或没有输出，就不是函数。$\\{(x, y) : y = x^2\\}$ 是函数 $\\mathbb{R} \\to \\mathbb{R}$。$\\{(x, y) : x = y^2\\}$ 不是：$x = 4$ 同时与 $2$ 和 $-2$ 相关，而 $x = -1$ 不与任何数相关。\n\n> **注意。** 先解出 $y$ 再判断。结果中出现 $\\pm$，说明某个输入有两个输出；出现 $x \\ge 3$ 这样的条件，说明某个输入没有输出。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const f = rng.pick(realFunctions(c));
        return reasoned(
          oneOf(
            rng,
            t(
              `Is $\\{(x, y) \\in \\mathbb{R}^2 : ${f.rel}\\}$ a function from $\\mathbb{R}$ to $\\mathbb{R}$?`,
              `$\\{(x, y) \\in \\mathbb{R}^2 : ${f.rel}\\}$ 是从 $\\mathbb{R}$ 到 $\\mathbb{R}$ 的函数吗？`,
            ),
            yesNo[f.value ? 0 : 1]!,
            [yesNo[f.value ? 1 : 0]!],
            walked(
              [
                [["Solve for y", "解出 y"], f.solve],
                [["Decide", "判断"], f.decide],
              ],
              f.check,
            ),
          ),
          [[yesNo[f.value ? 1 : 0]!.en, f.wrong.en, f.wrong["zh-CN"]]],
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

/** SelfRule is a rule on ℤ classified by how each integer relates to itself, with instances that hold and fail. */
interface SelfRule {
  readonly tex: string;
  readonly kind: number;
  /** self is the condition with b = a. */
  readonly self: string;
  readonly reason: Text;
  readonly pass?: string;
  readonly fail?: string;
}

/** reflexiveAndIrreflexiveRelations checks whether elements are related to themselves. */
export const reflexiveAndIrreflexiveRelations: TopicDef = {
  id: "reflexive-and-irreflexive-relations",
  title: t("Reflexive and Irreflexive Relations", "自反关系与反自反关系"),
  summary: t(
    "R on A is reflexive if a R a for every a ∈ A, and irreflexive if a R a for no a ∈ A; many relations are neither.",
    "若对每个 a ∈ A 都有 a R a，则 A 上的 R 是自反的；若没有 a ∈ A 使 a R a，则是反自反的；很多关系两者都不是。",
  ),
  intro: t(
    "On $A = \\{1, 2, 3\\}$, the relation $R = \\{(1, 1), (2, 2), (3, 3), (1, 2)\\}$ is reflexive: it contains $(a, a)$ for every $a \\in A$. Removing $(3, 3)$ gives $\\{(1, 1), (2, 2), (1, 2)\\}$, which is neither reflexive, since $(3, 3)$ is missing, nor irreflexive, since $(1, 1)$ is present. The relation $\\{(1, 2), (2, 1)\\}$ has no pair $(a, a)$ at all, so it is irreflexive.\n\nCheck: in the directed graph, reflexive means a loop at every vertex, and irreflexive means no loops at all.\n\nIn this lesson we classify finite relations and relations on $\\mathbb{Z}$ as reflexive, irreflexive or neither.",
    "在 $A = \\{1, 2, 3\\}$ 上，关系 $R = \\{(1, 1), (2, 2), (3, 3), (1, 2)\\}$ 是自反的：对每个 $a \\in A$ 它都含 $(a, a)$。去掉 $(3, 3)$ 得 $\\{(1, 1), (2, 2), (1, 2)\\}$，它不是自反的，因为缺 $(3, 3)$；也不是反自反的，因为含 $(1, 1)$。关系 $\\{(1, 2), (2, 1)\\}$ 根本没有 $(a, a)$ 形式的序对，所以是反自反的。\n\n检验：在有向图中，自反意味着每个顶点都有自环，反自反意味着没有任何自环。\n\n本课我们把有限关系和 $\\mathbb{Z}$ 上的关系分类为自反、反自反或两者都不是。",
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
        "A relation is reflexive when every element is related to itself, irreflexive when none is, and neither when only some are. On $\\{1, 2, 3\\}$: $\\{(1, 1), (2, 2), (3, 3), (1, 2)\\}$ is reflexive; $\\{(1, 2), (2, 1)\\}$ is irreflexive; $\\{(1, 1), (1, 2)\\}$ is neither, since it contains $(1, 1)$ but not $(2, 2)$.\n\n> **Watch out.** Reflexive needs every pair $(a, a)$ and irreflexive needs none, so a relation with some of them is neither. The pairs $(a, b)$ with $a \\ne b$ play no part in this.",
        "当每个元素都与自身相关时，关系是自反的；没有一个与自身相关时是反自反的；只有部分相关时两者都不是。在 $\\{1, 2, 3\\}$ 上：$\\{(1, 1), (2, 2), (3, 3), (1, 2)\\}$ 是自反的；$\\{(1, 2), (2, 1)\\}$ 是反自反的；$\\{(1, 1), (1, 2)\\}$ 两者都不是，因为它含 $(1, 1)$ 却不含 $(2, 2)$。\n\n> **注意。** 自反要求所有 $(a, a)$ 都在，反自反要求一个都不在，所以只含部分 $(a, a)$ 的关系两者都不是。$a \\ne b$ 的序对 $(a, b)$ 与此无关。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        const kind = rng.int(0, 2);
        const r = reflexiveRel(rng, n, kind);
        const options = [t("Reflexive", "自反"), t("Irreflexive", "反自反"), t("Neither", "两者都不是")];
        const missing = range(1, n).find((a) => !has(r, a, a)) ?? 1;
        const present = range(1, n).find((a) => has(r, a, a)) ?? 1;
        const loops = range(1, n).filter((a) => has(r, a, a));
        const off = r.filter(([a, b]) => a !== b);
        const verdict = [
          t("Every pair $(a, a)$ is present, so $R$ is reflexive.", "每个 $(a, a)$ 都在其中，所以 $R$ 是自反的。"),
          t("No pair $(a, a)$ is present, so $R$ is irreflexive.", "没有任何 $(a, a)$ 在其中，所以 $R$ 是反自反的。"),
          t(
            `$(${present}, ${present}) \\in R$ but $(${missing}, ${missing}) \\notin R$, so $R$ is neither.`,
            `$(${present}, ${present}) \\in R$，但 $(${missing}, ${missing}) \\notin R$，所以两者都不是。`,
          ),
        ][kind]!;
        const reasons: Reason[] = [
          [
            "Reflexive",
            `$(${missing}, ${missing}) \\notin R$, so not every element is related to itself.`,
            `$(${missing}, ${missing}) \\notin R$，所以并非每个元素都与自身相关。`,
          ],
          [
            "Irreflexive",
            `$(${present}, ${present}) \\in R$, so some element is related to itself.`,
            `$(${present}, ${present}) \\in R$，所以有元素与自身相关。`,
          ],
          kind === 0
            ? ["Neither", "Every pair $(a, a)$ is present, which makes $R$ reflexive.", "每个 $(a, a)$ 都在其中，这使 $R$ 是自反的。"]
            : ["Neither", "No pair $(a, a)$ is present, which makes $R$ irreflexive.", "没有任何 $(a, a)$ 在其中，这使 $R$ 是反自反的。"],
        ];
        return reasoned(
          oneOf(
            rng,
            t(`Classify $R = ${relTex(r)}$ on $${setTex(range(1, n))}$.`, `对 $${setTex(range(1, n))}$ 上的 $R = ${relTex(r)}$ 进行分类。`),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            walked(
              [
                [
                  ["Look for the pairs (a, a)", "找出形如 (a, a) 的序对"],
                  t(
                    loops.length === 0
                      ? `None of $${range(1, n)
                          .map((a) => `(${a}, ${a})`)
                          .join(", ")}$ is in $R$.`
                      : `$R$ contains $${loops.map((a) => `(${a}, ${a})`).join(", ")}$, out of the $${n}$ possible.`,
                    loops.length === 0
                      ? `$${range(1, n)
                          .map((a) => `(${a}, ${a})`)
                          .join(", ")}$ 都不在 $R$ 中。`
                      : `在 $${n}$ 个可能的序对中，$R$ 含 $${loops.map((a) => `(${a}, ${a})`).join(", ")}$。`,
                  ),
                ],
                [["Decide", "判断"], verdict],
              ],
              off.length === 0
                ? t(
                    "$R$ has no pairs $(a, b)$ with $a \\ne b$, so only the pairs $(a, a)$ were to be checked.",
                    "$R$ 没有 $a \\ne b$ 的序对 $(a, b)$，所以只需检查 $(a, a)$。",
                  )
                : t(
                    `The other pairs, such as $(${off[0]![0]}, ${off[0]![1]})$, join two different elements and do not affect the answer.`,
                    `其余的序对，例如 $(${off[0]![0]}, ${off[0]![1]})$，连接的是两个不同的元素，不影响结论。`,
                  ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "reflexivity-of-relations-on-the-integers",
      title: t("Relations on the integers", "整数上的关系"),
      explanation: t(
        "Check whether each integer satisfies the condition with itself; one integer that fails rules out reflexivity, and one that succeeds rules out irreflexivity. On $\\mathbb{Z}$: $a \\le b$ is reflexive; $a < b$ is irreflexive; $ab > 0$ is neither, since $1 \\cdot 1 > 0$ but $0 \\cdot 0 = 0$.\n\n> **Watch out.** Put $b = a$ and ask whether the result holds for every integer, for none, or for some. Trying a single integer is not enough to call a relation reflexive.",
        "检查每个整数与自身是否满足条件；有一个不满足就排除了自反性，有一个满足就排除了反自反性。在 $\\mathbb{Z}$ 上：$a \\le b$ 是自反的；$a < b$ 是反自反的；$ab > 0$ 两者都不是，因为 $1 \\cdot 1 > 0$ 而 $0 \\cdot 0 = 0$。\n\n> **注意。** 令 $b = a$，看结果对所有整数成立、对任何整数都不成立，还是只对部分成立。只试一个整数，不足以断定关系是自反的。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const rules: SelfRule[] = [
          {
            tex: "a \\le b",
            kind: 0,
            self: "a \\le a",
            reason: t("every number is at most itself", "每个数都不大于它自身"),
            pass: "5 \\le 5",
          },
          { tex: "a < b", kind: 1, self: "a < a", reason: t("no number is less than itself", "没有数小于它自身"), fail: "5 < 5" },
          {
            tex: "ab > 0",
            kind: 2,
            self: "a^2 > 0",
            reason: t("it holds for $a \\ne 0$ and fails for $a = 0$", "它对 $a \\ne 0$ 成立，对 $a = 0$ 不成立"),
            pass: "1 \\cdot 1 > 0",
            fail: "0 \\cdot 0 > 0",
          },
          {
            tex: `${k} \\mid a - b`,
            kind: 0,
            self: `${k} \\mid a - a`,
            reason: t(`$a - a = 0$ is a multiple of $${k}$`, `$a - a = 0$ 是 $${k}$ 的倍数`),
            pass: `${k} \\mid 5 - 5`,
          },
          {
            tex: `b = a + ${k}`,
            kind: 1,
            self: `a = a + ${k}`,
            reason: t(`it would need $${k} = 0$`, `它要求 $${k} = 0$`),
            fail: `5 = 5 + ${k}`,
          },
          {
            tex: `a + b = ${2 * k}`,
            kind: 2,
            self: `2a = ${2 * k}`,
            reason: t(`it holds only for $a = ${k}$`, `它只对 $a = ${k}$ 成立`),
            pass: `${k} + ${k} = ${2 * k}`,
            fail: `0 + 0 = ${2 * k}`,
          },
          { tex: "a \\ne b", kind: 1, self: "a \\ne a", reason: t("every number equals itself", "每个数都等于它自身"), fail: "5 \\ne 5" },
          {
            tex: `|a - b| \\le ${k}`,
            kind: 0,
            self: `|a - a| \\le ${k}`,
            reason: t(`$|a - a| = 0 \\le ${k}$`, `$|a - a| = 0 \\le ${k}$`),
            pass: `|5 - 5| \\le ${k}`,
          },
          {
            tex: `a^2 = ${k}b`,
            kind: 2,
            self: `a^2 = ${k}a`,
            reason: t(`it holds only for $a = 0$ and $a = ${k}$`, `它只对 $a = 0$ 和 $a = ${k}$ 成立`),
            pass: `${k}^2 = ${k} \\cdot ${k}`,
            fail: `1^2 = ${k} \\cdot 1`,
          },
          {
            tex: "2 \\mid a + b",
            kind: 0,
            self: "2 \\mid a + a",
            reason: t("$a + a = 2a$ is even", "$a + a = 2a$ 是偶数"),
            pass: "2 \\mid 5 + 5",
          },
          {
            tex: "2 \\nmid a + b",
            kind: 1,
            self: "2 \\nmid a + a",
            reason: t("$a + a = 2a$ is always even", "$a + a = 2a$ 总是偶数"),
            fail: "2 \\nmid 5 + 5",
          },
        ];
        const rule = rng.pick(rules);
        const { kind } = rule;
        const options = [t("Reflexive", "自反"), t("Irreflexive", "反自反"), t("Neither", "两者都不是")];
        const verdicts = [
          t("Every integer is related to itself, because", "每个整数都与自身相关，因为"),
          t("No integer is related to itself, because", "没有整数与自身相关，因为"),
          t("Some integers are related to themselves and some are not:", "有的整数与自身相关，有的不相关："),
        ];
        const result = ["reflexive", "irreflexive", "neither"][kind]!;
        const resultZh = ["是自反的", "是反自反的", "两者都不是"][kind]!;
        const reasons: Reason[] = [
          rule.fail === undefined
            ? ["Reflexive", "", ""]
            : [
                "Reflexive",
                `$${rule.fail}$ is false, so not every integer is related to itself.`,
                `$${rule.fail}$ 不成立，所以并非每个整数都与自身相关。`,
              ],
          rule.pass === undefined
            ? ["Irreflexive", "", ""]
            : ["Irreflexive", `$${rule.pass}$ holds, so some integer is related to itself.`, `$${rule.pass}$ 成立，所以有整数与自身相关。`],
          kind === 0
            ? [
                "Neither",
                `$${rule.self}$ holds for every integer $a$, which makes the relation reflexive.`,
                `$${rule.self}$ 对每个整数 $a$ 都成立，这使关系是自反的。`,
              ]
            : [
                "Neither",
                `$${rule.self}$ holds for no integer $a$, which makes the relation irreflexive.`,
                `$${rule.self}$ 对任何整数 $a$ 都不成立，这使关系是反自反的。`,
              ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Classify the relation $a \\mathrel{R} b \\iff ${rule.tex}$ on $\\mathbb{Z}$.`,
              `对 $\\mathbb{Z}$ 上的关系 $a \\mathrel{R} b \\iff ${rule.tex}$ 进行分类。`,
            ),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            walked(
              [
                [
                  ["Relate a to itself", "让 a 与自身比较"],
                  t(`Put $b = a$: the condition becomes $${rule.self}$.`, `令 $b = a$：条件变为 $${rule.self}$。`),
                ],
                [
                  ["Decide", "判断"],
                  t(
                    `${verdicts[kind]!.en} ${rule.reason.en}. So $R$ is ${result}.`,
                    `${verdicts[kind]!["zh-CN"]}${rule.reason["zh-CN"]}。所以 $R$ ${resultZh}。`,
                  ),
                ],
              ],
              kind === 0
                ? t(`For example, $${rule.pass}$ holds.`, `例如，$${rule.pass}$ 成立。`)
                : kind === 1
                  ? t(`For example, $${rule.fail}$ is false.`, `例如，$${rule.fail}$ 不成立。`)
                  : t(`$${rule.pass}$ holds, while $${rule.fail}$ is false.`, `$${rule.pass}$ 成立，而 $${rule.fail}$ 不成立。`),
            ),
          ),
          reasons.filter(([, en]) => en !== ""),
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

/** SymRule is a rule on ℤ with why it is or is not symmetric and antisymmetric: kind 0 symmetric only, 1 antisymmetric only, 2 both, 3 neither. */
interface SymRule {
  readonly tex: string;
  readonly kind: number;
  readonly sym: Text;
  readonly anti: Text;
  readonly check: Text;
}

/** symmetryOptions are the four answers about symmetry and antisymmetry. */
const symmetryOptions = [
  t("Symmetric only", "仅对称"),
  t("Antisymmetric only", "仅反对称"),
  t("Both", "两者都是"),
  t("Neither", "两者都不是"),
];

/** symmetryReasons says what is wrong with each wrong answer, given whether the relation is symmetric and antisymmetric and why. */
function symmetryReasons(symmetric: boolean, anti: boolean, sym: Text, antiWhy: Text): Reason[] {
  const r = (i: number, why: Text): Reason => [symmetryOptions[i]!.en, why.en, why["zh-CN"]];
  return [r(0, symmetric ? antiWhy : sym), r(1, anti ? sym : antiWhy), r(2, symmetric ? antiWhy : sym), r(3, symmetric ? sym : antiWhy)];
}

/** symmetricAndAntisymmetricRelations checks how pairs relate to their reverses. */
export const symmetricAndAntisymmetricRelations: TopicDef = {
  id: "symmetric-and-antisymmetric-relations",
  title: t("Symmetric and Antisymmetric Relations", "对称关系与反对称关系"),
  summary: t(
    "R is symmetric if a R b implies b R a, and antisymmetric if a R b and b R a imply a = b.",
    "若 a R b 推出 b R a，则 R 是对称的；若 a R b 且 b R a 推出 a = b，则 R 是反对称的。",
  ),
  intro: t(
    "On $\\{1, 2, 3\\}$, let $R = \\{(1, 2), (2, 1), (3, 3)\\}$. Every pair's reverse is in $R$, which makes $R$ symmetric. It is not antisymmetric, because $(1, 2)$ and $(2, 1)$ are both in $R$ while $1 \\ne 2$. By contrast, $S = \\{(1, 2), (2, 3)\\}$ is antisymmetric, since no two different elements are related both ways, and not symmetric, since $(2, 1) \\notin S$.\n\nCheck: $(3, 3)$ is its own reverse, so it affects neither property.\n\nIn this lesson we decide whether finite relations and relations on $\\mathbb{Z}$ are symmetric, antisymmetric, both or neither.",
    "在 $\\{1, 2, 3\\}$ 上，令 $R = \\{(1, 2), (2, 1), (3, 3)\\}$。每个序对的反向都在 $R$ 中，所以 $R$ 是对称的。它不是反对称的，因为 $(1, 2)$ 与 $(2, 1)$ 都在 $R$ 中，而 $1 \\ne 2$。相比之下，$S = \\{(1, 2), (2, 3)\\}$ 是反对称的，因为没有两个不同的元素双向相关；它不是对称的，因为 $(2, 1) \\notin S$。\n\n检验：$(3, 3)$ 的反向就是它自己，所以它对两个性质都没有影响。\n\n本课我们判断有限关系和 $\\mathbb{Z}$ 上的关系是对称的、反对称的、两者都是，还是两者都不是。",
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
        "$\\{(1, 2), (2, 1), (3, 3)\\}$ is symmetric. $\\{(1, 2), (2, 3)\\}$ is antisymmetric. $\\{(1, 1), (2, 2)\\}$ is both. $\\{(1, 2), (2, 1), (1, 3)\\}$ is neither: $(1, 3)$ lacks its reverse, and $(1, 2), (2, 1)$ with $1 \\ne 2$ break antisymmetry.\n\n> **Watch out.** Symmetric and antisymmetric are not opposites: a relation made only of pairs $(a, a)$ is both, and a relation can be neither. Pairs $(a, a)$ never break either property.",
        "$\\{(1, 2), (2, 1), (3, 3)\\}$ 是对称的。$\\{(1, 2), (2, 3)\\}$ 是反对称的。$\\{(1, 1), (2, 2)\\}$ 两者都是。$\\{(1, 2), (2, 1), (1, 3)\\}$ 两者都不是：$(1, 3)$ 没有反向序对，而 $(1, 2), (2, 1)$ 且 $1 \\ne 2$ 破坏了反对称性。\n\n> **注意。** 对称与反对称并不互相排斥：只由 $(a, a)$ 组成的关系两者都是，而一个关系也可能两者都不是。$(a, a)$ 形式的序对不会破坏任何一个性质。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        const kind = rng.int(0, 3);
        const r = symmetryRel(rng, n, kind);
        const lacking = r.find(([a, b]) => !has(r, b, a));
        const both = r.find(([a, b]) => a < b && has(r, b, a));
        const off = r.filter(([a, b]) => a !== b);
        const sym = lacking
          ? t(
              `$(${lacking[0]}, ${lacking[1]}) \\in R$ but $(${lacking[1]}, ${lacking[0]}) \\notin R$, so $R$ is not symmetric.`,
              `$(${lacking[0]}, ${lacking[1]}) \\in R$，但 $(${lacking[1]}, ${lacking[0]}) \\notin R$，所以 $R$ 不是对称的。`,
            )
          : off.length === 0
            ? t(
                "$R$ has only pairs $(a, a)$, each its own reverse, so $R$ is symmetric.",
                "$R$ 只有 $(a, a)$ 形式的序对，每个的反向都是它自己，所以 $R$ 是对称的。",
              )
            : t(
                `The reverse of each of $${off.map(([a, b]) => `(${a}, ${b})`).join(", ")}$ is in $R$, which makes $R$ symmetric.`,
                `$${off.map(([a, b]) => `(${a}, ${b})`).join(", ")}$ 的反向都在 $R$ 中，所以 $R$ 是对称的。`,
              );
        const anti = both
          ? t(
              `$(${both[0]}, ${both[1]})$ and $(${both[1]}, ${both[0]})$ are both in $R$ with $${both[0]} \\ne ${both[1]}$, so $R$ is not antisymmetric.`,
              `$(${both[0]}, ${both[1]})$ 与 $(${both[1]}, ${both[0]})$ 都在 $R$ 中，且 $${both[0]} \\ne ${both[1]}$，所以 $R$ 不是反对称的。`,
            )
          : t(
              "No two different elements are related in both directions, so $R$ is antisymmetric.",
              "没有两个不同的元素双向相关，所以 $R$ 是反对称的。",
            );
        const loops = r.filter(([a, b]) => a === b);
        return reasoned(
          oneOf(
            rng,
            t(
              `Is $R = ${relTex(r)}$ symmetric, antisymmetric, both, or neither?`,
              `$R = ${relTex(r)}$ 是对称的、反对称的、两者都是，还是两者都不是？`,
            ),
            symmetryOptions[kind]!,
            symmetryOptions.filter((_, i) => i !== kind),
            walked(
              [
                [["Test symmetry", "检验对称性"], sym],
                [["Test antisymmetry", "检验反对称性"], anti],
                [
                  ["Combine", "综合"],
                  t(`So the answer is: ${symmetryOptions[kind]!.en.toLowerCase()}.`, `所以答案是：${symmetryOptions[kind]!["zh-CN"]}。`),
                ],
              ],
              loops.length === 0
                ? t(
                    "$R$ has no pairs $(a, a)$, so every pair above joins two different elements.",
                    "$R$ 没有 $(a, a)$ 形式的序对，所以上面每个序对都连接两个不同的元素。",
                  )
                : t(
                    `The pairs $${loops.map(([a]) => `(${a}, ${a})`).join(", ")}$ are their own reverses and affect neither property.`,
                    `序对 $${loops.map(([a]) => `(${a}, ${a})`).join(", ")}$ 的反向是它们自己，对两个性质都没有影响。`,
                  ),
            ),
          ),
          symmetryReasons(!lacking, !both, sym, anti),
        );
      },
    },
    {
      id: "symmetry-of-relations-on-the-integers",
      title: t("Relations on the integers", "整数上的关系"),
      explanation: t(
        "On $\\mathbb{Z}$: $a + b$ even is symmetric; $a \\le b$ is antisymmetric; $a = b$ is both; $a \\le b + 1$ is neither: $(1, 2)$ and $(2, 1)$ are both in it, but $(1, 3)$ lacks its reverse.\n\n> **Watch out.** To rule a property out, one example is enough; to show it holds, argue for every pair. For antisymmetry, look for two different numbers related in both directions.",
        "在 $\\mathbb{Z}$ 上：“$a + b$ 为偶数”是对称的；$a \\le b$ 是反对称的；$a = b$ 两者都是；$a \\le b + 1$ 两者都不是：$(1, 2)$ 与 $(2, 1)$ 都在其中，而 $(1, 3)$ 没有反向序对。\n\n> **注意。** 要否定一个性质，一个例子就够了；要证明它成立，必须对每个序对论证。检验反对称性时，找两个双向相关的不同的数。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const rules: SymRule[] = [
          {
            tex: `${k} \\mid a + b`,
            kind: 0,
            sym: t(
              `Symmetric: $a + b = b + a$, so $${k} \\mid a + b$ gives $${k} \\mid b + a$.`,
              `对称：$a + b = b + a$，所以由 $${k} \\mid a + b$ 得 $${k} \\mid b + a$。`,
            ),
            anti: t(
              `Not antisymmetric: $(1, ${2 * k - 1})$ and $(${2 * k - 1}, 1)$ are both in $R$, with $1 \\ne ${2 * k - 1}$.`,
              `不是反对称：$(1, ${2 * k - 1})$ 与 $(${2 * k - 1}, 1)$ 都在 $R$ 中，而 $1 \\ne ${2 * k - 1}$。`,
            ),
            check: t(`$1 + ${2 * k - 1} = ${2 * k} = ${k} \\cdot 2$.`, `$1 + ${2 * k - 1} = ${2 * k} = ${k} \\cdot 2$。`),
          },
          {
            tex: `|a - b| = ${k}`,
            kind: 0,
            sym: t(
              "Symmetric: $|a - b| = |b - a|$, so $a \\mathrel{R} b$ gives $b \\mathrel{R} a$.",
              "对称：$|a - b| = |b - a|$，所以由 $a \\mathrel{R} b$ 得 $b \\mathrel{R} a$。",
            ),
            anti: t(
              `Not antisymmetric: $0 \\mathrel{R} ${k}$ and $${k} \\mathrel{R} 0$, with $0 \\ne ${k}$.`,
              `不是反对称：$0 \\mathrel{R} ${k}$ 且 $${k} \\mathrel{R} 0$，而 $0 \\ne ${k}$。`,
            ),
            check: t(`$|0 - ${k}| = |${k} - 0| = ${k}$.`, `$|0 - ${k}| = |${k} - 0| = ${k}$。`),
          },
          {
            tex: "a \\le b",
            kind: 1,
            sym: t("Not symmetric: $1 \\le 2$ but $2 \\not\\le 1$.", "不是对称：$1 \\le 2$，但 $2 \\not\\le 1$。"),
            anti: t("Antisymmetric: $a \\le b$ and $b \\le a$ force $a = b$.", "反对称：$a \\le b$ 且 $b \\le a$ 推出 $a = b$。"),
            check: t(
              "$(3, 3)$ is related both ways, which antisymmetry allows, since $3 = 3$.",
              "$(3, 3)$ 双向相关，这是反对称所允许的，因为 $3 = 3$。",
            ),
          },
          {
            tex: `b = a + ${k}`,
            kind: 1,
            sym: t(
              `Not symmetric: $(0, ${k}) \\in R$, but $(${k}, 0) \\notin R$, since $0 \\ne ${k} + ${k}$.`,
              `不是对称：$(0, ${k}) \\in R$，但 $(${k}, 0) \\notin R$，因为 $0 \\ne ${k} + ${k}$。`,
            ),
            anti: t(
              `Antisymmetric: $b = a + ${k}$ and $a = b + ${k}$ would give $a = a + ${2 * k}$, which never holds, so no two numbers are related both ways.`,
              `反对称：$b = a + ${k}$ 与 $a = b + ${k}$ 会推出 $a = a + ${2 * k}$，这永不成立，所以没有两个数双向相关。`,
            ),
            check: t(
              `$(0, ${k})$: $${k} = 0 + ${k}$ holds; $(${k}, 0)$: $0 = ${k} + ${k}$ fails.`,
              `$(0, ${k})$：$${k} = 0 + ${k}$ 成立；$(${k}, 0)$：$0 = ${k} + ${k}$ 不成立。`,
            ),
          },
          {
            tex: "b = a^2",
            kind: 1,
            sym: t(
              "Not symmetric: $(2, 4) \\in R$ since $4 = 2^2$, but $(4, 2) \\notin R$ since $2 \\ne 16$.",
              "不是对称：$(2, 4) \\in R$，因为 $4 = 2^2$；但 $(4, 2) \\notin R$，因为 $2 \\ne 16$。",
            ),
            anti: t(
              "Antisymmetric: $b = a^2$ and $a = b^2$ give $a = a^4$, so $a \\in \\{0, 1\\}$ and then $b = a^2 = a$.",
              "反对称：$b = a^2$ 与 $a = b^2$ 给出 $a = a^4$，所以 $a \\in \\{0, 1\\}$，从而 $b = a^2 = a$。",
            ),
            check: t(
              "The pairs related both ways are $(0, 0)$ and $(1, 1)$, and each has equal entries.",
              "双向相关的只有 $(0, 0)$ 和 $(1, 1)$，它们的两个元素都相等。",
            ),
          },
          {
            tex: "a = b",
            kind: 2,
            sym: t("Symmetric: $a = b$ gives $b = a$.", "对称：由 $a = b$ 得 $b = a$。"),
            anti: t("Antisymmetric: $a \\mathrel{R} b$ already means $a = b$.", "反对称：$a \\mathrel{R} b$ 本身就意味着 $a = b$。"),
            check: t("Every pair of $R$ has the form $(a, a)$, its own reverse.", "$R$ 的每个序对都形如 $(a, a)$，其反向就是它自己。"),
          },
          {
            tex: `a = b \\wedge ${k} \\mid a`,
            kind: 2,
            sym: t("Symmetric: every pair has the form $(a, a)$, its own reverse.", "对称：每个序对都形如 $(a, a)$，其反向就是它自己。"),
            anti: t("Antisymmetric: $a \\mathrel{R} b$ forces $a = b$.", "反对称：$a \\mathrel{R} b$ 推出 $a = b$。"),
            check: t(
              `$(${k}, ${k}) \\in R$, while $(${k}, ${2 * k}) \\notin R$ since $${k} \\ne ${2 * k}$.`,
              `$(${k}, ${k}) \\in R$，而 $(${k}, ${2 * k}) \\notin R$，因为 $${k} \\ne ${2 * k}$。`,
            ),
          },
          {
            tex: `a \\le b + ${k - 1}`,
            kind: 3,
            sym: t(
              `Not symmetric: $(1, ${k + 1}) \\in R$, but $(${k + 1}, 1) \\notin R$, since $${k + 1} > 1 + ${k - 1}$.`,
              `不是对称：$(1, ${k + 1}) \\in R$，但 $(${k + 1}, 1) \\notin R$，因为 $${k + 1} > 1 + ${k - 1}$。`,
            ),
            anti: t(
              "Not antisymmetric: $(1, 2)$ and $(2, 1)$ are both in $R$, with $1 \\ne 2$.",
              "不是反对称：$(1, 2)$ 与 $(2, 1)$ 都在 $R$ 中，而 $1 \\ne 2$。",
            ),
            check: t(
              `$1 \\le 2 + ${k - 1} = ${k + 1}$ and $2 \\le 1 + ${k - 1} = ${k}$.`,
              `$1 \\le 2 + ${k - 1} = ${k + 1}$，$2 \\le 1 + ${k - 1} = ${k}$。`,
            ),
          },
          {
            tex: `|a - b| \\le ${k} \\wedge a \\le b + 1`,
            kind: 3,
            sym: t(
              `Not symmetric: $(1, ${k + 1}) \\in R$, but $(${k + 1}, 1) \\notin R$, since $${k + 1} > 1 + 1$.`,
              `不是对称：$(1, ${k + 1}) \\in R$，但 $(${k + 1}, 1) \\notin R$，因为 $${k + 1} > 1 + 1$。`,
            ),
            anti: t(
              "Not antisymmetric: $(1, 2)$ and $(2, 1)$ are both in $R$, with $1 \\ne 2$.",
              "不是反对称：$(1, 2)$ 与 $(2, 1)$ 都在 $R$ 中，而 $1 \\ne 2$。",
            ),
            check: t(
              `$|1 - 2| = 1 \\le ${k}$ with $1 \\le 3$ and $2 \\le 2$; and $|1 - ${k + 1}| = ${k} \\le ${k}$ with $1 \\le ${k + 2}$.`,
              `$|1 - 2| = 1 \\le ${k}$，且 $1 \\le 3$、$2 \\le 2$；$|1 - ${k + 1}| = ${k} \\le ${k}$，且 $1 \\le ${k + 2}$。`,
            ),
          },
        ];
        const rule = rng.pick(rules);
        const { kind } = rule;
        return reasoned(
          oneOf(
            rng,
            t(
              `On $\\mathbb{Z}$, is $a \\mathrel{R} b \\iff ${rule.tex}$ symmetric, antisymmetric, both, or neither?`,
              `在 $\\mathbb{Z}$ 上，$a \\mathrel{R} b \\iff ${rule.tex}$ 是对称的、反对称的、两者都是，还是两者都不是？`,
            ),
            symmetryOptions[kind]!,
            symmetryOptions.filter((_, i) => i !== kind),
            walked(
              [
                [["Test symmetry", "检验对称性"], rule.sym],
                [["Test antisymmetry", "检验反对称性"], rule.anti],
              ],
              rule.check,
            ),
          ),
          symmetryReasons(kind === 0 || kind === 2, kind === 1 || kind === 2, rule.sym, rule.anti),
        );
      },
    },
  ],
};

/** chainsOf lists the chains (a, b), (b, c) of a relation as triples. */
const chainsOf = (r: readonly Pair[]) => r.flatMap(([a, b]) => r.filter(([b2]) => b2 === b).map(([, c]) => [a, b, c] as const));

/** transitiveRelations checks the chain condition a R b, b R c ⟹ a R c. */
export const transitiveRelations: TopicDef = {
  id: "transitive-relations",
  title: t("Transitive Relations", "传递关系"),
  summary: t(
    "R is transitive if a R b and b R c always imply a R c; the transitive closure adds the missing pairs.",
    "若 a R b 且 b R c 总推出 a R c，则 R 是传递的；传递闭包补上缺失的序对。",
  ),
  intro: t(
    "Let $R = \\{(1, 2), (2, 3)\\}$. The pairs $(1, 2)$ and $(2, 3)$ form a chain, so transitivity needs the shortcut $(1, 3)$, which is missing: $R$ is not transitive. Adding it gives $\\{(1, 2), (1, 3), (2, 3)\\}$, which is transitive: its only chain is still $(1, 2), (2, 3)$, and the shortcut is now present.\n\nCheck: the new pair $(1, 3)$ starts no new chain, since no pair of the relation starts at $3$.\n\nIn this lesson we test relations for transitivity and find the pairs a transitive closure adds.",
    "设 $R = \\{(1, 2), (2, 3)\\}$。序对 $(1, 2)$ 与 $(2, 3)$ 组成一条链，所以传递性要求捷径 $(1, 3)$，但它不在 $R$ 中：$R$ 不是传递的。补上它得 $\\{(1, 2), (1, 3), (2, 3)\\}$，它是传递的：唯一的链仍是 $(1, 2), (2, 3)$，而捷径现在已经在其中。\n\n检验：新序对 $(1, 3)$ 不会形成新的链，因为关系中没有以 $3$ 开头的序对。\n\n本课我们检验关系是否传递，并求传递闭包需要添加的序对。",
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
        "Transitivity requires that whenever two pairs link end to end, the pair joining the outer elements is also present. $\\{(1, 2), (2, 3), (1, 3)\\}$ is transitive. $\\{(1, 2), (2, 1)\\}$ is not: $(1, 2)$ and $(2, 1)$ require $(1, 1)$.\n\n> **Watch out.** A chain $(a, b), (b, a)$ needs the pair $(a, a)$, which is easy to overlook. A relation in which no two pairs link is transitive, since there is nothing to check.",
        "传递性要求只要两个有序对首尾相接，连接两端元素的有序对也必须存在。$\\{(1, 2), (2, 3), (1, 3)\\}$ 是传递的。$\\{(1, 2), (2, 1)\\}$ 不是：$(1, 2)$ 与 $(2, 1)$ 要求 $(1, 1)$。\n\n> **注意。** 链 $(a, b), (b, a)$ 要求序对 $(a, a)$，这很容易被忽略。如果关系中没有两个序对能首尾相接，它就是传递的，因为没有需要检验的情形。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        const value = rng.bool();
        let r: Pair[];
        do r = sortPairs(randomRel(rng, n, value ? 25 : 30));
        while (r.length < 2 || r.length > 7 || (value ? transitiveClosure(r).length > 7 : !transitivityGap(r)));
        if (value) r = transitiveClosure(r);
        const gap = transitivityGap(r);
        const chains = chainsOf(r).filter(([a, b, c]) => a !== b && b !== c);
        const gaps = chainsOf(r).filter(([a, , c]) => !has(r, a, c)).length;
        const chainText = (zh: boolean) =>
          chains.length === 0
            ? zh
              ? "没有两个连接不同元素的序对首尾相接。"
              : "No two pairs joining different elements link end to end."
            : `${chains.map(([a, b, c]) => `$(${a}, ${b}), (${b}, ${c}) \\to (${a}, ${c})$`).join(zh ? "；" : "; ")}${zh ? "。" : "."}`;
        return reasoned(
          oneOf(
            rng,
            t(`Is $R = ${relTex(r)}$ transitive?`, `$R = ${relTex(r)}$ 是传递的吗？`),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            gap
              ? walked(
                  [
                    [
                      ["Find a chain", "找一条链"],
                      t(
                        `$(${gap[0]}, ${gap[1]})$ and $(${gap[1]}, ${gap[2]})$ are in $R$.`,
                        `$(${gap[0]}, ${gap[1]})$ 与 $(${gap[1]}, ${gap[2]})$ 都在 $R$ 中。`,
                      ),
                    ],
                    [
                      ["Look for its shortcut", "找它的捷径"],
                      t(
                        `$(${gap[0]}, ${gap[2]}) \\notin R$, so $R$ is not transitive.`,
                        `$(${gap[0]}, ${gap[2]}) \\notin R$，所以 $R$ 不是传递的。`,
                      ),
                    ],
                  ],
                  t(
                    `One chain without its shortcut is enough; $R$ has $${gaps}$ such ${gaps === 1 ? "chain" : "chains"} in all.`,
                    `只要有一条链缺少捷径就足够了；$R$ 共有 $${gaps}$ 条这样的链。`,
                  ),
                )
              : walked(
                  [
                    [["List the chains", "列出各条链"], t(chainText(false), chainText(true))],
                    [
                      ["Decide", "判断"],
                      t("Every shortcut is in $R$, which makes $R$ transitive.", "每条捷径都在 $R$ 中，所以 $R$ 是传递的。"),
                    ],
                  ],
                  t(
                    "A chain through a pair $(a, a)$ gives back a pair already in the chain, so those need no check.",
                    "经过 $(a, a)$ 的链给出的仍是链中已有的序对，所以不必检验。",
                  ),
                ),
          ),
          [
            gap
              ? [
                  "Yes",
                  `$(${gap[0]}, ${gap[1]})$ and $(${gap[1]}, ${gap[2]})$ are in $R$, but $(${gap[0]}, ${gap[2]})$ is not.`,
                  `$(${gap[0]}, ${gap[1]})$ 与 $(${gap[1]}, ${gap[2]})$ 在 $R$ 中，但 $(${gap[0]}, ${gap[2]})$ 不在。`,
                ]
              : [
                  "No",
                  "Every chain $(a, b), (b, c)$ has its shortcut $(a, c)$ in $R$.",
                  "每条链 $(a, b), (b, c)$ 的捷径 $(a, c)$ 都在 $R$ 中。",
                ],
          ],
        );
      },
    },
    {
      id: "the-transitive-closure",
      title: t("The transitive closure", "传递闭包"),
      explanation: t(
        "The transitive closure adds the pairs needed for transitivity, repeating until no chain of pairs is missing its shortcut. For $R = \\{(1, 2), (2, 3), (3, 4)\\}$, add $(1, 3)$ and $(2, 4)$, then $(1, 4)$: the transitive closure has $6$ pairs, $3$ more than $R$.\n\n> **Watch out.** New pairs can form new chains, so keep going until a round adds nothing. Count only the pairs added, not every pair of the closure.",
        "传递闭包添加传递性所需的有序对，反复进行，直到每条有序对的链都有对应的捷径。对 $R = \\{(1, 2), (2, 3), (3, 4)\\}$，补上 $(1, 3)$ 与 $(2, 4)$，再补上 $(1, 4)$：传递闭包有 $6$ 个序对，比 $R$ 多 $3$ 个。\n\n> **注意。** 新加入的序对可能形成新的链，所以要一直做下去，直到某一轮不再添加。只数添加的序对，不要数闭包的全部序对。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        let r: Pair[];
        do r = sortPairs(range(1, rng.int(3, 4)).map(() => [rng.int(1, n), rng.int(1, n)] as Pair));
        while (!transitivityGap(r) || transitiveClosure(r).length > 12);
        const closure = transitiveClosure(r);
        const added = closure.filter(([a, b]) => !has(r, a, b));
        const rounds: Pair[][] = [];
        for (let cur = r; ; ) {
          const missing = sortPairs(
            chainsOf(cur)
              .filter(([a, , c]) => !has(cur, a, c))
              .map(([a, , c]) => [a, c] as Pair),
          );
          if (missing.length === 0) break;
          rounds.push(missing);
          cur = sortPairs([...cur, ...missing]);
        }
        const steps: [[string, string], Text][] = rounds.map((m, i) => [
          [i === 0 ? "Add the missing shortcuts" : "Add the shortcuts of the new chains", i === 0 ? "补上缺失的捷径" : "补上新链的捷径"],
          t(`Add ${pairList(m, "")}.`, `添加 ${pairList(m, "")}。`),
        ]);
        return numberProblem({
          prompt: t(
            `How many pairs must be added to $R = ${relTex(r)}$ to obtain its transitive closure?`,
            `要得到 $R = ${relTex(r)}$ 的传递闭包，需要添加多少个序对？`,
          ),
          answer: added.length,
          wrong: [closure.length, added.length - 1, added.length + 1],
          mistakes: firstOf([
            why(
              closure.length,
              "That counts every pair of the closure; only the added pairs are asked for.",
              "这数的是闭包的全部序对；题目只问添加的序对。",
            ),
            why(
              rounds[0]!.length,
              "That stops after one round; the new pairs form new chains that need shortcuts too.",
              "这只做了一轮；新加入的序对形成的新链也需要捷径。",
            ),
          ]),
          solution: walked(
            [
              ...steps,
              [
                ["Count", "计数"],
                t(
                  `${rounds.length > 1 ? "No new chain lacks a shortcut now. " : ""}In all, $${added.length}$ ${added.length === 1 ? "pair is" : "pairs are"} added.`,
                  `${rounds.length > 1 ? "现在没有缺少捷径的新链了。" : ""}共添加 $${added.length}$ 个序对。`,
                ),
              ],
            ],
            t(
              `The closure $${relTex(closure)}$ has $${closure.length} = ${r.length} + ${added.length}$ pairs, and every chain in it has its shortcut.`,
              `闭包 $${relTex(closure)}$ 有 $${closure.length} = ${r.length} + ${added.length}$ 个序对，其中每条链都有捷径。`,
            ),
          ),
        });
      },
    },
  ],
};

/** EquivRule is a rule on ℤ with a sentence for each of the three properties; kind 0 is an equivalence relation, 1, 2, 3 fail reflexivity, symmetry, transitivity. */
interface EquivRule {
  readonly tex: string;
  readonly kind: number;
  readonly refl: Text;
  readonly sym: Text;
  readonly trans: Text;
  readonly check: Text;
}

/** equivalenceRelations combines reflexivity, symmetry and transitivity. */
export const equivalenceRelations: TopicDef = {
  id: "equivalence-relations",
  title: t("Equivalence Relations", "等价关系"),
  summary: t(
    "An equivalence relation is reflexive, symmetric and transitive; it corresponds to a partition of the set into blocks of mutually related elements.",
    "等价关系是自反、对称且传递的关系；它对应把集合划分成若干块、块内元素两两相关的一个划分。",
  ),
  intro: t(
    "On $\\mathbb{Z}$, let $a \\sim b \\iff 3 \\mid a - b$. It is reflexive, since $a - a = 0$ is a multiple of $3$; symmetric, since $b - a = -(a - b)$; and transitive, since $a - c = (a - b) + (b - c)$ is a sum of multiples of $3$. So $\\sim$ is an equivalence relation, and it splits $\\mathbb{Z}$ into three classes: the multiples of $3$, the numbers $\\ldots, 1, 4, 7, \\ldots$ and the numbers $\\ldots, 2, 5, 8, \\ldots$.\n\nCheck: $7 \\sim 1$ because $7 - 1 = 6$, and indeed $7$ lies in the class of $1$.\n\nIn this lesson we find which property, if any, keeps a relation from being an equivalence relation, and count the pairs of an equivalence relation from its classes.",
    "在 $\\mathbb{Z}$ 上，令 $a \\sim b \\iff 3 \\mid a - b$。它是自反的，因为 $a - a = 0$ 是 $3$ 的倍数；是对称的，因为 $b - a = -(a - b)$；是传递的，因为 $a - c = (a - b) + (b - c)$ 是 $3$ 的倍数之和。所以 $\\sim$ 是等价关系，它把 $\\mathbb{Z}$ 分成三类：$3$ 的倍数，$\\ldots, 1, 4, 7, \\ldots$，以及 $\\ldots, 2, 5, 8, \\ldots$。\n\n检验：$7 \\sim 1$，因为 $7 - 1 = 6$；$7$ 确实在 $1$ 所在的类中。\n\n本课我们找出哪个性质使关系不是等价关系（如果有的话），并由等价类统计等价关系的序对个数。",
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
        "On $\\mathbb{Z}$: $3 \\mid a - b$ is an equivalence relation. $|a - b| \\le 1$ is not transitive ($0 \\sim 1 \\sim 2$ but $0 \\not\\sim 2$). $a \\le b$ is not symmetric. $ab > 0$ is not reflexive ($0 \\not\\sim 0$).\n\n> **Watch out.** Check all three properties. One example is enough to show a property fails, but showing it holds takes an argument that covers every integer.",
        "在 $\\mathbb{Z}$ 上：$3 \\mid a - b$ 是等价关系。$|a - b| \\le 1$ 不传递（$0 \\sim 1 \\sim 2$ 但 $0 \\not\\sim 2$）。$a \\le b$ 不对称。$ab > 0$ 不自反（$0 \\not\\sim 0$）。\n\n> **注意。** 三个性质都要检验。一个例子就足以说明某个性质不成立，但要说明它成立，必须给出对所有整数都适用的论证。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const rules: EquivRule[] = [
          {
            tex: `${k} \\mid a - b`,
            kind: 0,
            refl: t(`Reflexive: $a - a = 0$ is a multiple of $${k}$.`, `自反：$a - a = 0$ 是 $${k}$ 的倍数。`),
            sym: t(
              `Symmetric: if $${k} \\mid a - b$, then $${k} \\mid -(a - b) = b - a$.`,
              `对称：若 $${k} \\mid a - b$，则 $${k} \\mid -(a - b) = b - a$。`,
            ),
            trans: t(
              `Transitive: if $${k}$ divides $a - b$ and $b - c$, it divides their sum $a - c$.`,
              `传递：若 $${k}$ 整除 $a - b$ 与 $b - c$，它就整除二者之和 $a - c$。`,
            ),
            check: t(
              `$1 \\sim ${k + 1} \\sim ${2 * k + 1}$, and $${2 * k + 1} - 1 = ${2 * k}$, so $1 \\sim ${2 * k + 1}$ as well.`,
              `$1 \\sim ${k + 1} \\sim ${2 * k + 1}$，而 $${2 * k + 1} - 1 = ${2 * k}$，所以也有 $1 \\sim ${2 * k + 1}$。`,
            ),
          },
          {
            tex: "|a| = |b|",
            kind: 0,
            refl: t("Reflexive: $|a| = |a|$.", "自反：$|a| = |a|$。"),
            sym: t("Symmetric: $|a| = |b|$ gives $|b| = |a|$.", "对称：由 $|a| = |b|$ 得 $|b| = |a|$。"),
            trans: t("Transitive: $|a| = |b|$ and $|b| = |c|$ give $|a| = |c|$.", "传递：由 $|a| = |b|$ 且 $|b| = |c|$ 得 $|a| = |c|$。"),
            check: t(
              "The classes are $\\{0\\}, \\{-1, 1\\}, \\{-2, 2\\}, \\ldots$, a partition of $\\mathbb{Z}$.",
              "等价类是 $\\{0\\}, \\{-1, 1\\}, \\{-2, 2\\}, \\ldots$，构成 $\\mathbb{Z}$ 的一个划分。",
            ),
          },
          {
            tex: `a^2 \\equiv b^2 \\pmod{${k}}`,
            kind: 0,
            refl: t("Reflexive: $a^2 \\equiv a^2$.", "自反：$a^2 \\equiv a^2$。"),
            sym: t(
              "Symmetric: congruence is symmetric, so $a^2 \\equiv b^2$ gives $b^2 \\equiv a^2$.",
              "对称：同余是对称的，所以由 $a^2 \\equiv b^2$ 得 $b^2 \\equiv a^2$。",
            ),
            trans: t(
              "Transitive: $a^2 \\equiv b^2$ and $b^2 \\equiv c^2$ give $a^2 \\equiv c^2$.",
              "传递：由 $a^2 \\equiv b^2$ 且 $b^2 \\equiv c^2$ 得 $a^2 \\equiv c^2$。",
            ),
            check: t(
              `$${k - 1}^2 = ${(k - 1) ** 2} \\equiv 1 = 1^2 \\pmod{${k}}$, so $1 \\sim ${k - 1}$.`,
              `$${k - 1}^2 = ${(k - 1) ** 2} \\equiv 1 = 1^2 \\pmod{${k}}$，所以 $1 \\sim ${k - 1}$。`,
            ),
          },
          {
            tex: "2 \\mid a + b",
            kind: 0,
            refl: t("Reflexive: $a + a = 2a$ is even.", "自反：$a + a = 2a$ 是偶数。"),
            sym: t("Symmetric: $a + b = b + a$.", "对称：$a + b = b + a$。"),
            trans: t(
              "Transitive: $a + b$ and $b + c$ even mean $a$, $b$, $c$ share a parity, so $a + c$ is even.",
              "传递：$a + b$ 与 $b + c$ 都是偶数，说明 $a$、$b$、$c$ 奇偶性相同，所以 $a + c$ 是偶数。",
            ),
            check: t(
              "$1 \\sim 3 \\sim 5$, and $1 + 5 = 6$ is even, so $1 \\sim 5$.",
              "$1 \\sim 3 \\sim 5$，而 $1 + 5 = 6$ 是偶数，所以 $1 \\sim 5$。",
            ),
          },
          {
            tex: "ab > 0",
            kind: 1,
            refl: t("Not reflexive: $0 \\cdot 0 = 0$, so $0 \\not\\sim 0$.", "不自反：$0 \\cdot 0 = 0$，所以 $0 \\not\\sim 0$。"),
            sym: t("Symmetric: $ab = ba$.", "对称：$ab = ba$。"),
            trans: t(
              "Transitive: $ab > 0$ and $bc > 0$ mean $a$, $b$, $c$ share a sign, so $ac > 0$.",
              "传递：$ab > 0$ 且 $bc > 0$，说明 $a$、$b$、$c$ 同号，所以 $ac > 0$。",
            ),
            check: t(
              "Every $a \\ne 0$ has $a \\cdot a > 0$; only $0$ fails, and one failure is enough.",
              "每个 $a \\ne 0$ 都有 $a \\cdot a > 0$；只有 $0$ 不满足，而一个反例就足够了。",
            ),
          },
          {
            tex: `a = b \\wedge ${k} \\nmid a`,
            kind: 1,
            refl: t(`Not reflexive: $${k} \\mid 0$, so $0 \\not\\sim 0$.`, `不自反：$${k} \\mid 0$，所以 $0 \\not\\sim 0$。`),
            sym: t(
              `Symmetric: $a = b$ gives $b = a$, and $${k} \\nmid b$ because $b = a$.`,
              `对称：由 $a = b$ 得 $b = a$，且因为 $b = a$，有 $${k} \\nmid b$。`,
            ),
            trans: t("Transitive: $a = b = c$ gives $a = c$.", "传递：由 $a = b = c$ 得 $a = c$。"),
            check: t(
              `$1 \\sim 1$ since $${k} \\nmid 1$, but $${k} \\not\\sim ${k}$, so reflexivity fails.`,
              `$1 \\sim 1$，因为 $${k} \\nmid 1$；但 $${k} \\not\\sim ${k}$，所以自反性不成立。`,
            ),
          },
          {
            tex: "a \\le b",
            kind: 2,
            refl: t("Reflexive: $a \\le a$.", "自反：$a \\le a$。"),
            sym: t("Not symmetric: $1 \\le 2$ while $2 \\not\\le 1$.", "不对称：$1 \\le 2$，而 $2 \\not\\le 1$。"),
            trans: t("Transitive: $a \\le b \\le c$ gives $a \\le c$.", "传递：由 $a \\le b \\le c$ 得 $a \\le c$。"),
            check: t(
              "One pair is enough: $(1, 2)$ is related, but $(2, 1)$ is not.",
              "一个序对就够了：$(1, 2)$ 相关，而 $(2, 1)$ 不相关。",
            ),
          },
          {
            tex: "|a| \\le |b|",
            kind: 2,
            refl: t("Reflexive: $|a| \\le |a|$.", "自反：$|a| \\le |a|$。"),
            sym: t("Not symmetric: $|1| \\le |2|$ while $|2| \\not\\le |1|$.", "不对称：$|1| \\le |2|$，而 $|2| \\not\\le |1|$。"),
            trans: t("Transitive: $|a| \\le |b| \\le |c|$ gives $|a| \\le |c|$.", "传递：由 $|a| \\le |b| \\le |c|$ 得 $|a| \\le |c|$。"),
            check: t(
              "One pair is enough: $(1, 2)$ is related, but $(2, 1)$ is not.",
              "一个序对就够了：$(1, 2)$ 相关，而 $(2, 1)$ 不相关。",
            ),
          },
          {
            tex: `|a - b| \\le ${k}`,
            kind: 3,
            refl: t(`Reflexive: $|a - a| = 0 \\le ${k}$.`, `自反：$|a - a| = 0 \\le ${k}$。`),
            sym: t("Symmetric: $|a - b| = |b - a|$.", "对称：$|a - b| = |b - a|$。"),
            trans: t(
              `Not transitive: $0 \\sim ${k} \\sim ${2 * k}$, but $|0 - ${2 * k}| = ${2 * k} > ${k}$.`,
              `不传递：$0 \\sim ${k} \\sim ${2 * k}$，但 $|0 - ${2 * k}| = ${2 * k} > ${k}$。`,
            ),
            check: t(
              `$|0 - ${k}| = ${k} \\le ${k}$ and $|${k} - ${2 * k}| = ${k} \\le ${k}$, so both links hold.`,
              `$|0 - ${k}| = ${k} \\le ${k}$，$|${k} - ${2 * k}| = ${k} \\le ${k}$，所以两段都成立。`,
            ),
          },
          {
            tex: `|a - b| \\ne ${k}`,
            kind: 3,
            refl: t(`Reflexive: $|a - a| = 0 \\ne ${k}$.`, `自反：$|a - a| = 0 \\ne ${k}$。`),
            sym: t("Symmetric: $|a - b| = |b - a|$.", "对称：$|a - b| = |b - a|$。"),
            trans: t(
              `Not transitive: $0 \\sim 1 \\sim ${k}$, but $|0 - ${k}| = ${k}$, so $0 \\not\\sim ${k}$.`,
              `不传递：$0 \\sim 1 \\sim ${k}$，但 $|0 - ${k}| = ${k}$，所以 $0 \\not\\sim ${k}$。`,
            ),
            check: t(
              `$|0 - 1| = 1 \\ne ${k}$ and $|1 - ${k}| = ${k - 1} \\ne ${k}$, so both links hold.`,
              `$|0 - 1| = 1 \\ne ${k}$，$|1 - ${k}| = ${k - 1} \\ne ${k}$，所以两段都成立。`,
            ),
          },
        ];
        const rule = rng.pick(rules);
        const { kind } = rule;
        const options = [
          t("It is an equivalence relation", "它是等价关系"),
          t("Not reflexive", "不自反"),
          t("Not symmetric", "不对称"),
          t("Not transitive", "不传递"),
        ];
        const props = [rule.refl, rule.sym, rule.trans];
        const failing = props[kind - 1];
        const reasons: Reason[] = [
          ...(failing ? [[options[0]!.en, failing.en, failing["zh-CN"]] as Reason] : []),
          ...props.map((p, i): Reason => [options[i + 1]!.en, p.en, p["zh-CN"]]),
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `On $\\mathbb{Z}$, let $a \\sim b \\iff ${rule.tex}$. Which is true?`,
              `在 $\\mathbb{Z}$ 上，令 $a \\sim b \\iff ${rule.tex}$。哪个说法正确？`,
            ),
            options[kind]!,
            options.filter((_, i) => i !== kind),
            walked(
              [
                [["Test reflexivity", "检验自反性"], rule.refl],
                [["Test symmetry", "检验对称性"], rule.sym],
                [["Test transitivity", "检验传递性"], rule.trans],
              ],
              rule.check,
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "counting-pairs-of-an-equivalence-relation",
      title: t("Counting pairs", "统计序对"),
      explanation: t(
        "An equivalence relation whose classes have sizes $3, 2, 1$ relates every two elements of the same class, in both orders and with themselves: $3^2 + 2^2 + 1^2 = 14$ pairs.\n\n> **Watch out.** Inside a class of size $s$, every element is related to every element, itself included, in both orders: $s \\cdot s$ pairs. Elements of different classes are not related at all.",
        "等价类大小为 $3, 2, 1$ 的等价关系，把同一类中的任意两个元素（两种顺序，以及元素与自身）都相关：共 $3^2 + 2^2 + 1^2 = 14$ 个序对。\n\n> **注意。** 在大小为 $s$ 的类中，每个元素都与每个元素相关（包括它自身，两种顺序都算）：共 $s \\cdot s$ 个序对。不同类的元素之间完全不相关。",
      ),
      generate(rng) {
        const sizes = range(1, rng.int(2, 4))
          .map(() => rng.int(1, 5))
          .sort((a, b) => b - a);
        const total = sizes.reduce((s, x) => s + x, 0);
        const count = sizes.reduce((s, x) => s + x * x, 0);
        const unordered = sizes.reduce((s, x) => s + (x * (x - 1)) / 2, 0);
        return numberProblem({
          prompt: t(
            `An equivalence relation on a set of $${total}$ elements has equivalence classes of sizes $${sizes.join(", ")}$. How many ordered pairs does it contain?`,
            `某个含 $${total}$ 个元素的集合上的等价关系，其等价类的大小为 $${sizes.join(", ")}$。它包含多少个有序对？`,
          ),
          answer: count,
          wrong: [unordered, count - total, total * total],
          mistakes: firstOf([
            why(
              count - total,
              "That leaves out the pairs $(a, a)$; every element is related to itself.",
              "这漏掉了 $(a, a)$ 形式的序对；每个元素都与自身相关。",
            ),
            why(
              unordered,
              "That counts unordered pairs of different elements; the relation has ordered pairs, and the pairs $(a, a)$ too.",
              "这数的是不同元素的无序对；关系由有序对组成，还包括 $(a, a)$。",
            ),
            why(
              total * total,
              "That counts every ordered pair of the set, even across classes.",
              "这数的是集合的全部有序对，连不同类之间的也算上了。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Count each class", "分别计算每一类"],
                t(
                  `A class of size $s$ gives $s^2$ pairs: ${sizes.map((s) => `$${s}^2 = ${s * s}$`).join(", ")}.`,
                  `大小为 $s$ 的类给出 $s^2$ 个序对：${sizes.map((s) => `$${s}^2 = ${s * s}$`).join("，")}。`,
                ),
              ],
              [
                ["Add", "相加"],
                t(`$${sizes.map((s) => s * s).join(" + ")} = ${count}$.`, `$${sizes.map((s) => s * s).join(" + ")} = ${count}$。`),
              ],
            ],
            t(
              `The $${total}$ pairs $(a, a)$ plus $${count - total}$ pairs of different elements make $${count}$; the second number is even, since those pairs come in reverse pairs.`,
              `$${total}$ 个 $(a, a)$ 形式的序对，加上 $${count - total}$ 个不同元素的序对，共 $${count}$ 个；后一个数是偶数，因为这些序对成对出现、互为反向。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linear writes c₁x₁ + c₂x₂ + … with signs and unit coefficients tidied, dropping zero terms. */
function linear(terms: readonly (readonly [number, string])[]): string {
  const kept = terms.filter(([c]) => c !== 0);
  if (kept.length === 0) return "0";
  return kept
    .map(([c, x], i) => {
      const size = Math.abs(c) === 1 ? x : `${Math.abs(c)}${x}`;
      return i === 0 ? (c < 0 ? `-${size}` : size) : c < 0 ? ` - ${size}` : ` + ${size}`;
    })
    .join("");
}

/** provingARelationIsAnEquivalenceRelation proves the three properties from a rule. */
export const provingARelationIsAnEquivalenceRelation: TopicDef = {
  id: "proving-a-relation-is-an-equivalence-relation",
  title: t("Proving a Relation Is an Equivalence Relation", "证明一个关系是等价关系"),
  summary: t(
    "Prove reflexivity, symmetry and transitivity separately, each by rewriting the defining condition.",
    "分别证明自反性、对称性与传递性，每一步都改写定义条件。",
  ),
  intro: t(
    "On $\\mathbb{Z}$, let $a \\sim b \\iff 4 \\mid a + 3b$. Reflexive: $a + 3a = 4a$. Symmetric: if $4 \\mid a + 3b$, then $b + 3a = 4(a + b) - (a + 3b)$ is a multiple of $4$. Transitive: if $4 \\mid a + 3b$ and $4 \\mid b + 3c$, then $a + 3c = (a + 3b) + (b + 3c) - 4b$ is a multiple of $4$. So $\\sim$ is an equivalence relation.\n\nCheck: $1 \\sim 5$ since $1 + 15 = 16$, and in the other order $5 + 3 = 8$, so $5 \\sim 1$ too, as symmetry promises.\n\nIn this lesson we find the identity behind each of the three properties, and recognize equivalent pairs under relations on pairs of numbers.",
    "在 $\\mathbb{Z}$ 上，令 $a \\sim b \\iff 4 \\mid a + 3b$。自反：$a + 3a = 4a$。对称：若 $4 \\mid a + 3b$，则 $b + 3a = 4(a + b) - (a + 3b)$ 是 $4$ 的倍数。传递：若 $4 \\mid a + 3b$ 且 $4 \\mid b + 3c$，则 $a + 3c = (a + 3b) + (b + 3c) - 4b$ 是 $4$ 的倍数。所以 $\\sim$ 是等价关系。\n\n检验：$1 \\sim 5$，因为 $1 + 15 = 16$；反过来 $5 + 3 = 8$，所以也有 $5 \\sim 1$，正如对称性所保证的。\n\n本课我们找出三个性质各自依据的恒等式，并识别数对关系下等价的数对。",
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
        "Each property of an equivalence relation comes down to an identity showing that a new expression is a multiple of the modulus. Let $a \\sim b \\iff 8 \\mid 3a + 5b$. Reflexive: $3a + 5a = 8a$. Symmetric: $3b + 5a = 8(a + b) - (3a + 5b)$. Transitive: $3a + 5c = (3a + 5b) + (3b + 5c) - 8b$.\n\n> **Watch out.** The identity has to hold for all $a$, $b$, $c$, so expand the right side and compare it with the left before trusting it. A single wrong sign makes it false.",
        "等价关系的每个性质都归结为一个恒等式，说明某个新表达式是模的倍数。令 $a \\sim b \\iff 8 \\mid 3a + 5b$。自反：$3a + 5a = 8a$。对称：$3b + 5a = 8(a + b) - (3a + 5b)$。传递：$3a + 5c = (3a + 5b) + (3b + 5c) - 8b$。\n\n> **注意。** 恒等式必须对所有 $a$、$b$、$c$ 成立，所以要先展开右边，与左边比较后再采用。一个符号错了，恒等式就不成立。",
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
        const d = Math.abs(p - q);
        // Each wrong identity with what its right side expands to.
        const goal0 = [lin("a", "a"), lin("b", "a"), lin("a", "c")][prop]!;
        const expands = (r: string): [string, string] => [
          `The right side expands to $${r}$, not $${goal0}$.`,
          `右边展开为 $${r}$，不是 $${goal0}$。`,
        ];
        // Each wrong identity with why it fails.
        const table: [string, string, [string, string, string][]][] = [
          [
            lin("a", "a"),
            `${m}a`,
            [
              [
                `${p * q}a`,
                `$${p * q}a$ multiplies the coefficients; $${lin("a", "a")}$ adds them.`,
                `$${p * q}a$ 是把系数相乘；$${lin("a", "a")}$ 是把系数相加。`,
              ],
              [`${m}a^2`, `$${lin("a", "a")}$ has no $a^2$ term.`, `$${lin("a", "a")}$ 中没有 $a^2$ 项。`],
              [`${d === 1 ? "" : d}a`, "The coefficients add, not subtract.", "系数应相加，而不是相减。"],
            ],
          ],
          [
            lin("b", "a"),
            `${m}(a + b) - (${lin("a", "b")})`,
            [
              [
                `${m}(a + b) + (${lin("a", "b")})`,
                ...expands(
                  linear([
                    [m + p, "a"],
                    [m + q, "b"],
                  ]),
                ),
              ],
              [
                `${m}ab - (${lin("a", "b")})`,
                "The right side has a term in $ab$, which the left side does not.",
                "右边含有 $ab$ 项，而左边没有。",
              ],
              [
                `${m}(a - b) - (${lin("a", "b")})`,
                ...expands(
                  linear([
                    [q, "a"],
                    [-(m + q), "b"],
                  ]),
                ),
              ],
            ],
          ],
          [
            lin("a", "c"),
            `(${lin("a", "b")}) + (${lin("b", "c")}) - ${m}b`,
            [
              [
                `(${lin("a", "b")}) + (${lin("b", "c")}) + ${m}b`,
                ...expands(
                  linear([
                    [p, "a"],
                    [2 * m, "b"],
                    [q, "c"],
                  ]),
                ),
              ],
              [
                `(${lin("a", "b")}) - (${lin("b", "c")})`,
                ...expands(
                  linear([
                    [p, "a"],
                    [q - p, "b"],
                    [-q, "c"],
                  ]),
                ),
              ],
              [
                `(${lin("a", "b")}) + (${lin("b", "c")}) - ${m}c`,
                ...expands(
                  linear([
                    [p, "a"],
                    [m, "b"],
                    [-p, "c"],
                  ]),
                ),
              ],
            ],
          ],
        ];
        const [goal, right, wrong] = table[prop]!;
        const names = [t("reflexivity", "自反性"), t("symmetry", "对称性"), t("transitivity", "传递性")][prop]!;
        const known = [
          t(
            `Nothing is assumed: the identity must show $${m} \\mid ${goal}$ for every $a$.`,
            `没有任何假设：恒等式要对每个 $a$ 说明 $${m} \\mid ${goal}$。`,
          ),
          t(
            `We know $${m} \\mid ${lin("a", "b")}$ and want $${m} \\mid ${goal}$.`,
            `已知 $${m} \\mid ${lin("a", "b")}$，要证 $${m} \\mid ${goal}$。`,
          ),
          t(
            `We know $${m} \\mid ${lin("a", "b")}$ and $${m} \\mid ${lin("b", "c")}$, and want $${m} \\mid ${goal}$.`,
            `已知 $${m} \\mid ${lin("a", "b")}$ 且 $${m} \\mid ${lin("b", "c")}$，要证 $${m} \\mid ${goal}$。`,
          ),
        ][prop]!;
        const build = [
          t(`Add the coefficients: $${goal} = ${right}$, a multiple of $${m}$.`, `把系数相加：$${goal} = ${right}$，是 $${m}$ 的倍数。`),
          t(
            `Write the goal with the known expression: $${goal} = ${right}$; both terms on the right are multiples of $${m}$.`,
            `用已知表达式写出目标：$${goal} = ${right}$；右边两项都是 $${m}$ 的倍数。`,
          ),
          t(
            `Add the two known expressions and remove the $b$ terms: $${goal} = ${right}$; every term on the right is a multiple of $${m}$.`,
            `把两个已知表达式相加，再去掉含 $b$ 的项：$${goal} = ${right}$；右边每一项都是 $${m}$ 的倍数。`,
          ),
        ][prop]!;
        const expand = [
          `${p} + ${q} = ${m}`,
          `${m}a + ${m}b - ${linear([
            [p, "a"],
            [q, "b"],
          ])} = ${linear([
            [q, "a"],
            [p, "b"],
          ])}`,
          `${linear([
            [p, "a"],
            [q + p, "b"],
            [q, "c"],
          ])} - ${m}b = ${linear([
            [p, "a"],
            [q, "c"],
          ])}`,
        ][prop]!;
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $a \\sim b \\iff ${m} \\mid ${lin("a", "b")}$ on $\\mathbb{Z}$. To prove ${names.en}, which identity shows $${m} \\mid ${goal}$?`,
              `在 $\\mathbb{Z}$ 上令 $a \\sim b \\iff ${m} \\mid ${lin("a", "b")}$。为证明${names["zh-CN"]}，哪个恒等式说明 $${m} \\mid ${goal}$？`,
            ),
            math(`${goal} = ${right}`),
            wrong.map(([w]) => math(`${goal} = ${w}`)),
            walked(
              [
                [["State what is known", "写出已知"], known],
                [["Build the goal", "构造目标"], build],
              ],
              prop === 0
                ? t(
                    `Dividing $${m}a$ by $${m}$ leaves $a$, an integer, for every $a$.`,
                    `$${m}a$ 除以 $${m}$ 得 $a$，对每个 $a$ 都是整数。`,
                  )
                : t(`Expanding the right side: $${expand}$, which matches the left side.`, `展开右边：$${expand}$，与左边一致。`),
            ),
          ),
          wrong.map(([w, en, zh]): Reason => [math(`${goal} = ${w}`).en, en, zh]),
        );
      },
    },
    {
      id: "equivalent-pairs",
      title: t("Equivalent pairs", "等价的数对"),
      explanation: t(
        "Rearranging the condition shows it compares differences, so two pairs are equivalent when they have the same difference. On $\\mathbb{N} \\times \\mathbb{N}$, $(a, b) \\sim (c, d) \\iff a + d = b + c$ is an equivalence relation (it says $a - b = c - d$). So $(5, 2) \\sim (7, 4)$. On $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$, $(a, b) \\sim (c, d) \\iff ad = bc$ says $\\tfrac{a}{b} = \\tfrac{c}{d}$, so $(2, 3) \\sim (4, 6)$.\n\n> **Watch out.** Rewrite the condition before testing pairs: $a + d = b + c$ compares differences, and $ad = bc$ compares ratios. Adding the same number keeps a difference but changes a ratio; multiplying keeps a ratio but changes a difference.",
        "把条件变形就能看出它在比较差，所以两个有序对差相同时就等价。在 $\\mathbb{N} \\times \\mathbb{N}$ 上，$(a, b) \\sim (c, d) \\iff a + d = b + c$ 是等价关系（它表示 $a - b = c - d$）。所以 $(5, 2) \\sim (7, 4)$。在 $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$ 上，$(a, b) \\sim (c, d) \\iff ad = bc$ 表示 $\\tfrac{a}{b} = \\tfrac{c}{d}$，所以 $(2, 3) \\sim (4, 6)$。\n\n> **注意。** 检验数对之前先把条件变形：$a + d = b + c$ 比较的是差，$ad = bc$ 比较的是比。两数同加一个数，差不变而比改变；同乘一个数，比不变而差改变。",
      ),
      generate(rng) {
        const additive = rng.bool();
        const a = rng.int(1, 9);
        const b = ((a + rng.int(0, 7)) % 9) + 1;
        const k = rng.int(2, 5);
        const pair = (x: number, y: number) => math(`(${x}, ${y})`);
        if (additive) {
          const reasons: Reason[] = [
            [
              pair(b + k, a + k).en,
              `Its difference is $${b + k} - ${a + k} = ${b - a}$, the opposite of $${a} - ${b} = ${a - b}$.`,
              `它的差是 $${b + k} - ${a + k} = ${b - a}$，与 $${a} - ${b} = ${a - b}$ 相反。`,
            ],
            [
              pair(a * k, b * k).en,
              `Multiplying changes the difference: $${a * k} - ${b * k} = ${a * k - b * k}$, not $${a - b}$.`,
              `相乘会改变差：$${a * k} - ${b * k} = ${a * k - b * k}$，不是 $${a - b}$。`,
            ],
            [
              pair(a + k, b + k + 1).en,
              `Its difference is $${a + k} - ${b + k + 1} = ${a - b - 1}$, not $${a - b}$.`,
              `它的差是 $${a + k} - ${b + k + 1} = ${a - b - 1}$，不是 $${a - b}$。`,
            ],
          ];
          return reasoned(
            oneOf(
              rng,
              t(
                `On $\\mathbb{N} \\times \\mathbb{N}$, let $(a, b) \\sim (c, d) \\iff a + d = b + c$. Which pair is equivalent to $(${a}, ${b})$?`,
                `在 $\\mathbb{N} \\times \\mathbb{N}$ 上，令 $(a, b) \\sim (c, d) \\iff a + d = b + c$。哪个数对与 $(${a}, ${b})$ 等价？`,
              ),
              pair(a + k, b + k),
              [pair(b + k, a + k), pair(a * k, b * k), pair(a + k, b + k + 1)],
              walked(
                [
                  [
                    ["Rewrite the condition", "把条件变形"],
                    t(
                      `$a + d = b + c$ says $a - b = c - d$, so compare differences: $${a} - ${b} = ${a - b}$.`,
                      `$a + d = b + c$ 即 $a - b = c - d$，所以比较差：$${a} - ${b} = ${a - b}$。`,
                    ),
                  ],
                  [
                    ["Find the pair", "找出数对"],
                    t(
                      `$${a + k} - ${b + k} = ${a - b}$, so $(${a + k}, ${b + k}) \\sim (${a}, ${b})$.`,
                      `$${a + k} - ${b + k} = ${a - b}$，所以 $(${a + k}, ${b + k}) \\sim (${a}, ${b})$。`,
                    ),
                  ],
                ],
                t(
                  `With the original condition: $${a} + ${b + k} = ${a + b + k}$ and $${b} + ${a + k} = ${a + b + k}$.`,
                  `用原条件验证：$${a} + ${b + k} = ${a + b + k}$，$${b} + ${a + k} = ${a + b + k}$。`,
                ),
              ),
            ),
            reasons,
          );
        }
        const g = gcd(a, b);
        const reasons: Reason[] = [
          [
            pair(a + k, b + k).en,
            `Adding changes the ratio: $${a} \\cdot ${b + k} = ${a * (b + k)}$ but $${b} \\cdot ${a + k} = ${b * (a + k)}$.`,
            `相加会改变比：$${a} \\cdot ${b + k} = ${a * (b + k)}$，但 $${b} \\cdot ${a + k} = ${b * (a + k)}$。`,
          ],
          [
            pair(b * k, a * k).en,
            `That pair is the flipped ratio: $${a} \\cdot ${a * k} = ${a * a * k}$ but $${b} \\cdot ${b * k} = ${b * b * k}$.`,
            `这是倒过来的比：$${a} \\cdot ${a * k} = ${a * a * k}$，但 $${b} \\cdot ${b * k} = ${b * b * k}$。`,
          ],
          [
            pair(a * k, b * k + 1).en,
            `$${a} \\cdot ${b * k + 1} = ${a * (b * k + 1)}$ but $${b} \\cdot ${a * k} = ${a * b * k}$.`,
            `$${a} \\cdot ${b * k + 1} = ${a * (b * k + 1)}$，但 $${b} \\cdot ${a * k} = ${a * b * k}$。`,
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `On $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$, let $(a, b) \\sim (c, d) \\iff ad = bc$. Which pair is equivalent to $(${a}, ${b})$?`,
              `在 $\\mathbb{Z} \\times (\\mathbb{Z} \\setminus \\{0\\})$ 上，令 $(a, b) \\sim (c, d) \\iff ad = bc$。哪个数对与 $(${a}, ${b})$ 等价？`,
            ),
            pair(a * k, b * k),
            [pair(a + k, b + k), pair(b * k, a * k), pair(a * k, b * k + 1)],
            walked(
              [
                [
                  ["Rewrite the condition", "把条件变形"],
                  t(
                    `$ad = bc$ says $\\tfrac{a}{b} = \\tfrac{c}{d}$, so compare ratios: $\\tfrac{${a}}{${b}} = \\tfrac{${a / g}}{${b / g}}$.`,
                    `$ad = bc$ 即 $\\tfrac{a}{b} = \\tfrac{c}{d}$，所以比较比值：$\\tfrac{${a}}{${b}} = \\tfrac{${a / g}}{${b / g}}$。`,
                  ),
                ],
                [
                  ["Find the pair", "找出数对"],
                  t(
                    `Multiplying both entries by $${k}$ keeps the ratio: $(${a * k}, ${b * k})$.`,
                    `两个分量同乘 $${k}$，比值不变：$(${a * k}, ${b * k})$。`,
                  ),
                ],
              ],
              t(
                `With the original condition: $${a} \\cdot ${b * k} = ${a * b * k}$ and $${b} \\cdot ${a * k} = ${a * b * k}$.`,
                `用原条件验证：$${a} \\cdot ${b * k} = ${a * b * k}$，$${b} \\cdot ${a * k} = ${a * b * k}$。`,
              ),
            ),
          ),
          reasons,
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
  intro: t(
    "The residue class $[2]_5$ collects the integers congruent to $2$ modulo $5$: start at $2$ and step by $5$ both ways, giving $\\{\\dots, -8, -3, 2, 7, 12, \\dots\\}$. The class $[7]_5$ is the same set, because $7 - 2 = 5$; the class $[3]_5$ shares no element with it, because $3 - 2 = 1$ is not a multiple of $5$.\n\nCheck: $12 = 2 + 2 \\cdot 5$ and $-8 = 2 - 2 \\cdot 5$, and both leave remainder $2$ on division by $5$.\n\nIn this lesson we list elements of residue classes and decide when two classes are equal.",
    "剩余类 $[2]_5$ 收集所有模 $5$ 与 $2$ 同余的整数：从 $2$ 出发向两边每次走 $5$，得 $\\{\\dots, -8, -3, 2, 7, 12, \\dots\\}$。类 $[7]_5$ 是同一个集合，因为 $7 - 2 = 5$；类 $[3]_5$ 与它没有公共元素，因为 $3 - 2 = 1$ 不是 $5$ 的倍数。\n\n检验：$12 = 2 + 2 \\cdot 5$，$-8 = 2 - 2 \\cdot 5$，二者除以 $5$ 的余数都是 $2$。\n\n本课我们列出剩余类中的元素，并判断两个剩余类何时相等。",
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
        "A residue class contains every integer with the same remainder, obtained by adding or subtracting multiples of the modulus. $[2]_5 = \\{\\dots, -8, -3, 2, 7, 12, \\dots\\}$. Its elements between $-10$ and $10$ are $-8, -3, 2, 7$.\n\n> **Watch out.** Step by the modulus in both directions and include the negative elements. For a negative representative, use the remainder between $0$ and $n - 1$: $-3 \\equiv 2 \\pmod 5$, not $3$.",
        "一个剩余类包含所有余数相同的整数，可以通过加上或减去模的倍数得到。$[2]_5 = \\{\\dots, -8, -3, 2, 7, 12, \\dots\\}$。它在 $-10$ 与 $10$ 之间的元素是 $-8, -3, 2, 7$。\n\n> **注意。** 要向两个方向按模的大小前进，负的元素也要算上。代表元为负数时，用 $0$ 到 $n - 1$ 之间的余数：$-3 \\equiv 2 \\pmod 5$，不是 $3$。",
      ),
      generate(rng) {
        const n = rng.int(3, 9);
        const a = rng.int(-20, 20);
        const lo = rng.int(-20, 0);
        const hi = lo + rng.int(15, 30);
        const xs = range(lo, hi).filter((x) => mod(x - a, n) === 0);
        const r = mod(a, n);
        const first = xs[0]!;
        const last = xs[xs.length - 1]!;
        return setProblem({
          prompt: t(
            `List the elements $x$ of $[${a}]_{${n}}$ with $${lo} \\le x \\le ${hi}$.`,
            `列出 $[${a}]_{${n}}$ 中满足 $${lo} \\le x \\le ${hi}$ 的元素 $x$。`,
          ),
          values: xs,
          wrong: [xs.map((x) => x + 1), range(lo, hi).filter((x) => mod(x + a, n) === 0)],
          mistakes: [
            [
              xs.map((x) => x + 1),
              `Those leave remainder $${mod(r + 1, n)}$, not $${r}$, on division by $${n}$.`,
              `这些数除以 $${n}$ 余 $${mod(r + 1, n)}$，不是 $${r}$。`,
            ],
            [
              range(lo, hi).filter((x) => mod(x + a, n) === 0),
              `Those satisfy $x \\equiv ${-a} \\pmod{${n}}$; the class needs $x \\equiv ${a}$.`,
              `这些数满足 $x \\equiv ${-a} \\pmod{${n}}$；这个类要求 $x \\equiv ${a}$。`,
            ],
          ],
          solution: walked(
            [
              [
                ["Find the remainder", "求余数"],
                t(
                  `$${a} = ${n} \\cdot ${par((a - r) / n)} + ${r}$, so the class is the integers $\\equiv ${r} \\pmod{${n}}$.`,
                  `$${a} = ${n} \\cdot ${par((a - r) / n)} + ${r}$，所以这个类由 $\\equiv ${r} \\pmod{${n}}$ 的整数组成。`,
                ),
              ],
              [
                ["Step through the range", "在范围内逐个列出"],
                t(
                  `Starting at $${first}$ and adding $${n}$ each time: $${xs.join(", ")}$.`,
                  `从 $${first}$ 开始，每次加 $${n}$：$${xs.join(", ")}$。`,
                ),
              ],
            ],
            t(
              `One step further each way leaves the range: $${first} - ${n} = ${first - n} < ${lo}$ and $${last} + ${n} = ${last + n} > ${hi}$.`,
              `向两边再走一步就超出范围：$${first} - ${n} = ${first - n} < ${lo}$，$${last} + ${n} = ${last + n} > ${hi}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "equal-residue-classes",
      title: t("Equal residue classes", "相等的剩余类"),
      explanation: t(
        "Two residue classes are the same exactly when their representatives are congruent, and otherwise they share no elements. $[17]_6 = [-1]_6$ because $17 - (-1) = 18$ is a multiple of $6$. Two residue classes are either equal or disjoint.\n\n> **Watch out.** Compare the representatives by their difference, not by how close they are: $[17]_6 = [-1]_6$, while $[17]_6 \\ne [16]_6$.",
        "两个剩余类相同，当且仅当它们的代表元同余，否则它们没有公共元素。$[17]_6 = [-1]_6$，因为 $17 - (-1) = 18$ 是 $6$ 的倍数。两个剩余类要么相等，要么不相交。\n\n> **注意。** 用代表元的差来比较，而不是看它们是否接近：$[17]_6 = [-1]_6$，而 $[17]_6 \\ne [16]_6$。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const a = rng.int(-30, 40);
        const value = rng.bool();
        const b = value ? a + n * rng.pick([-3, -2, -1, 1, 2, 3]) : a + n * rng.int(-3, 3) + rng.int(1, n - 1);
        const diff = a - b;
        const q = Math.floor(diff / n);
        const rem = diff - n * q;
        return reasoned(
          oneOf(
            rng,
            t(`Is $[${a}]_{${n}} = [${b}]_{${n}}$?`, `$[${a}]_{${n}} = [${b}]_{${n}}$ 成立吗？`),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [["Subtract the representatives", "代表元相减"], t(`$${a} - ${par(b)} = ${diff}$.`, `$${a} - ${par(b)} = ${diff}$。`)],
                [
                  ["Divide by the modulus", "除以模"],
                  value
                    ? t(
                        `$${diff} = ${n} \\cdot ${par(q)}$ is a multiple of $${n}$, so the classes are equal.`,
                        `$${diff} = ${n} \\cdot ${par(q)}$ 是 $${n}$ 的倍数，所以两个类相等。`,
                      )
                    : t(
                        `$${diff} = ${n} \\cdot ${par(q)} + ${rem}$ is not a multiple of $${n}$, so the classes are different, and in fact disjoint.`,
                        `$${diff} = ${n} \\cdot ${par(q)} + ${rem}$ 不是 $${n}$ 的倍数，所以两个类不同，而且不相交。`,
                      ),
                ],
              ],
              t(
                `On division by $${n}$, $${a}$ leaves $${mod(a, n)}$ and $${b}$ leaves $${mod(b, n)}$${value ? ": the same remainder" : ": different remainders"}.`,
                `除以 $${n}$ 时，$${a}$ 余 $${mod(a, n)}$，$${b}$ 余 $${mod(b, n)}$${value ? "：余数相同" : "：余数不同"}。`,
              ),
            ),
          ),
          [
            value
              ? [
                  "No",
                  `$${a} - ${par(b)} = ${diff} = ${n} \\cdot ${par(q)}$ is a multiple of $${n}$.`,
                  `$${a} - ${par(b)} = ${diff} = ${n} \\cdot ${par(q)}$ 是 $${n}$ 的倍数。`,
                ]
              : ["Yes", `$${a} - ${par(b)} = ${diff}$ is not a multiple of $${n}$.`, `$${a} - ${par(b)} = ${diff}$ 不是 $${n}$ 的倍数。`],
          ],
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
  /** has says which value of the key an element has, such as "remainder 2". */
  readonly has: (x: number) => Text;
  /** name names the key, such as "the remainder". */
  readonly name: Text;
}

/** keyedRel picks an equivalence relation on {1, …, N} described by a shared property. */
function keyedRel(rng: Rng): KeyedRel {
  const k = rng.int(3, 6);
  const digitSum = (x: number) => `${x}`.split("").reduce((s, d) => s + Number(d), 0);
  const divisors = (x: number) => range(1, x).filter((d) => x % d === 0).length;
  const oddPart = (x: number) => x / 2 ** Math.log2(x & -x);
  return rng.pick<KeyedRel>([
    {
      en: `$x$ and $y$ leave the same remainder on division by $${k}$`,
      zh: `$x$ 与 $y$ 除以 $${k}$ 的余数相同`,
      key: (x) => x % k,
      has: (x) => t(`remainder $${x % k}$`, `余数 $${x % k}$`),
      name: t(`the remainder on division by $${k}$`, `除以 $${k}$ 的余数`),
    },
    {
      en: `$\\lfloor x / ${k} \\rfloor = \\lfloor y / ${k} \\rfloor$`,
      zh: `$\\lfloor x / ${k} \\rfloor = \\lfloor y / ${k} \\rfloor$`,
      key: (x) => Math.floor(x / k),
      has: (x) => t(`$\\lfloor x / ${k} \\rfloor = ${Math.floor(x / k)}$`, `$\\lfloor x / ${k} \\rfloor = ${Math.floor(x / k)}$`),
      name: t(`$\\lfloor x / ${k} \\rfloor$`, `$\\lfloor x / ${k} \\rfloor$`),
    },
    {
      en: "$x$ and $y$ have the same digit sum",
      zh: "$x$ 与 $y$ 的各位数字之和相同",
      key: digitSum,
      has: (x) => t(`digit sum $${digitSum(x)}$`, `数字和 $${digitSum(x)}$`),
      name: t("the digit sum", "数字和"),
    },
    {
      en: "$x$ and $y$ have the same number of positive divisors",
      zh: "$x$ 与 $y$ 的正因数个数相同",
      key: divisors,
      has: (x) => t(`$${divisors(x)}$ positive ${divisors(x) === 1 ? "divisor" : "divisors"}`, `$${divisors(x)}$ 个正因数`),
      name: t("the number of positive divisors", "正因数的个数"),
    },
    {
      en: `$x^2 \\equiv y^2 \\pmod{${k + 2}}$`,
      zh: `$x^2 \\equiv y^2 \\pmod{${k + 2}}$`,
      key: (x) => modPow(x, 2, k + 2),
      has: (x) => t(`$x^2 \\equiv ${modPow(x, 2, k + 2)} \\pmod{${k + 2}}$`, `$x^2 \\equiv ${modPow(x, 2, k + 2)} \\pmod{${k + 2}}$`),
      name: t(`the remainder of $x^2$ on division by $${k + 2}$`, `$x^2$ 除以 $${k + 2}$ 的余数`),
    },
    {
      en: "$x$ and $y$ have the same largest odd divisor",
      zh: "$x$ 与 $y$ 的最大奇因数相同",
      key: oddPart,
      has: (x) => t(`largest odd divisor $${oddPart(x)}$`, `最大奇因数 $${oddPart(x)}$`),
      name: t("the largest odd divisor", "最大奇因数"),
    },
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
  intro: t(
    "On $\\{1, \\dots, 10\\}$, let $x \\sim y$ when $x$ and $y$ leave the same remainder on division by $3$. Grouping by remainder gives $[1] = \\{1, 4, 7, 10\\}$, $[2] = \\{2, 5, 8\\}$ and $[3] = \\{3, 6, 9\\}$: three classes, one for each remainder $1, 2, 0$.\n\nCheck: the classes have $4 + 3 + 3 = 10$ elements in all, so every element lies in exactly one class.\n\nIn this lesson we find the class of an element and count the classes of an equivalence relation on a finite set.",
    "在 $\\{1, \\dots, 10\\}$ 上，当 $x$ 与 $y$ 除以 $3$ 的余数相同时令 $x \\sim y$。按余数分组得 $[1] = \\{1, 4, 7, 10\\}$、$[2] = \\{2, 5, 8\\}$、$[3] = \\{3, 6, 9\\}$：共三个类，余数 $1, 2, 0$ 各对应一个。\n\n检验：三个类共有 $4 + 3 + 3 = 10$ 个元素，所以每个元素恰好在一个类中。\n\n本课我们求一个元素的等价类，并统计有限集上等价关系的等价类个数。",
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
        "On $\\{1, \\dots, 20\\}$, let $x \\sim y$ when $x$ and $y$ have the same digit sum. Then $[5] = \\{5, 14\\}$, since $1 + 4 = 5$ and no other number up to $20$ has digit sum $5$.\n\n> **Watch out.** The class of $a$ always contains $a$ itself. Check every element of the set, not only those near $a$: elements far away can share the property.",
        "在 $\\{1, \\dots, 20\\}$ 上，当 $x$ 与 $y$ 的各位数字之和相同时令 $x \\sim y$。则 $[5] = \\{5, 14\\}$，因为 $1 + 4 = 5$，而 $20$ 以内没有其他数字和为 $5$ 的数。\n\n> **注意。** $a$ 的等价类总包含 $a$ 本身。要检查集合中的每个元素，而不只是 $a$ 附近的：离得远的元素也可能具有相同的性质。",
      ),
      generate(rng) {
        const N = rng.int(12, 24);
        const rel = keyedRel(rng);
        const a = rng.int(1, N);
        const cls = range(1, N).filter((x) => rel.key(x) === rel.key(a));
        const other = cls.find((x) => x !== a);
        const outside = range(1, N).find((x) => rel.key(x) !== rel.key(a))!;
        return setProblem({
          prompt: t(
            `On $\\{1, 2, \\dots, ${N}\\}$, let $x \\sim y$ when ${rel.en}. Find $[${a}]$.`,
            `在 $\\{1, 2, \\dots, ${N}\\}$ 上，当${rel.zh}时令 $x \\sim y$。求 $[${a}]$。`,
          ),
          values: cls,
          wrong: other === undefined ? [[]] : [cls.filter((x) => x !== a), [a]],
          mistakes:
            other === undefined
              ? [[[], `The class of $${a}$ contains $${a}$ itself.`, `$${a}$ 的等价类包含 $${a}$ 本身。`]]
              : [
                  [cls.filter((x) => x !== a), `The class of $${a}$ contains $${a}$ itself.`, `$${a}$ 的等价类包含 $${a}$ 本身。`],
                  [[a], `Other elements are related to $${a}$ too, such as $${other}$.`, `还有别的元素与 $${a}$ 相关，例如 $${other}$。`],
                ],
          solution: walked(
            [
              [[`Find the value for ${a}`, `求 ${a} 的取值`], t(`$${a}$ has ${rel.has(a).en}.`, `$${a}$ 的${rel.has(a)["zh-CN"]}。`)],
              [
                ["Collect the elements with the same value", "收集取值相同的元素"],
                t(`Going through $1, \\dots, ${N}$: $[${a}] = ${setTex(cls)}$.`, `逐一检查 $1, \\dots, ${N}$：$[${a}] = ${setTex(cls)}$。`),
              ],
            ],
            other === undefined
              ? t(
                  `No other element shares this value; for example, $${outside}$ has ${rel.has(outside).en}.`,
                  `没有其他元素取这个值；例如，$${outside}$ 的${rel.has(outside)["zh-CN"]}。`,
                )
              : t(
                  `$${other}$ has ${rel.has(other).en} as well, while $${outside}$ has ${rel.has(outside).en} and is left out.`,
                  `$${other}$ 的${rel.has(other)["zh-CN"]}，也一样；而 $${outside}$ 的${rel.has(outside)["zh-CN"]}，不在其中。`,
                ),
          ),
        });
      },
    },
    {
      id: "counting-equivalence-classes",
      title: t("Counting equivalence classes", "统计等价类个数"),
      explanation: t(
        "The equivalence classes partition the set, so group the elements by the value that the relation compares and count the groups. On $\\{1, \\dots, 10\\}$ with $x \\sim y \\iff \\lfloor x/3 \\rfloor = \\lfloor y/3 \\rfloor$, the classes are $\\{1, 2\\}, \\{3, 4, 5\\}, \\{6, 7, 8\\}, \\{9, 10\\}$: four classes, one for each value of $\\lfloor x/3 \\rfloor$.\n\n> **Watch out.** Count the different values the property takes on the set, not the elements. A value that no element of the set takes gives no class.",
        "等价类划分了整个集合，所以按照关系所比较的值把元素分组，再数出组数。在 $\\{1, \\dots, 10\\}$ 上，$x \\sim y \\iff \\lfloor x/3 \\rfloor = \\lfloor y/3 \\rfloor$，等价类为 $\\{1, 2\\}, \\{3, 4, 5\\}, \\{6, 7, 8\\}, \\{9, 10\\}$：共四个，每个 $\\lfloor x/3 \\rfloor$ 的取值对应一个。\n\n> **注意。** 数的是该性质在集合上取到的不同值的个数，而不是元素个数。集合中没有元素取到的值不对应任何类。",
      ),
      generate(rng) {
        const N = rng.int(10, 30);
        const rel = keyedRel(rng);
        const keys = [...new Set(range(1, N).map(rel.key))].sort((x, y) => x - y);
        const sizes = keys.map((v) => range(1, N).filter((x) => rel.key(x) === v).length);
        return numberProblem({
          prompt: t(
            `On $\\{1, 2, \\dots, ${N}\\}$, let $x \\sim y$ when ${rel.en}. How many equivalence classes are there?`,
            `在 $\\{1, 2, \\dots, ${N}\\}$ 上，当${rel.zh}时令 $x \\sim y$。共有多少个等价类？`,
          ),
          answer: keys.length,
          wrong: [keys.length + 1, keys.length - 1, N],
          mistakes: [
            why(
              N,
              "That counts the elements; elements with the same value share one class.",
              "这数的是元素个数；取值相同的元素属于同一个类。",
            ),
          ],
          solution: walked(
            [
              [
                ["List the values", "列出取值"],
                t(
                  `On $1, \\dots, ${N}$, ${rel.name.en} takes the values $${keys.join(", ")}$.`,
                  `在 $1, \\dots, ${N}$ 上，${rel.name["zh-CN"]}取值为 $${keys.join(", ")}$。`,
                ),
              ],
              [
                ["Count", "计数"],
                t(`Each value gives one class: $${keys.length}$ classes.`, `每个取值对应一个类：共 $${keys.length}$ 个类。`),
              ],
            ],
            t(
              `The classes have sizes $${sizes.join(", ")}$, which add up to $${N}$, so every element is in exactly one class.`,
              `各类的大小为 $${sizes.join(", ")}$，加起来是 $${N}$，所以每个元素恰好在一个类中。`,
            ),
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
  intro: t(
    "In $\\mathbb{Z}_5$: $[3] + [4] = [7] = [2]$ and $[3] \\cdot [4] = [12] = [2]$. The answers do not depend on the representatives: with $[8] = [3]$ in place of $[3]$, $[8] + [4] = [12] = [2]$ again. And $[2]$ has an inverse, $[3]$, since $[2] \\cdot [3] = [6] = [1]$.\n\nCheck: $7 = 5 + 2$ and $12 = 2 \\cdot 5 + 2$, so both results have remainder $2$.\n\nIn this lesson we compute in $\\mathbb{Z}_n$ and count its invertible classes and zero divisors.",
    "在 $\\mathbb{Z}_5$ 中：$[3] + [4] = [7] = [2]$，$[3] \\cdot [4] = [12] = [2]$。结果与代表元的选取无关：用 $[8] = [3]$ 代替 $[3]$，$[8] + [4] = [12] = [2]$，结果相同。而 $[2]$ 有逆元 $[3]$，因为 $[2] \\cdot [3] = [6] = [1]$。\n\n检验：$7 = 5 + 2$，$12 = 2 \\cdot 5 + 2$，所以两个结果的余数都是 $2$。\n\n本课我们在 $\\mathbb{Z}_n$ 中计算，并统计其中的可逆类和零因子。",
  ),
  prerequisites: ["equivalence-classes", "multiplicative-inverses-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "arithmetic-in-the-integers-modulo-n",
      title: t("Arithmetic in $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 中的运算"),
      explanation: t(
        "Arithmetic on residue classes works with any representatives, so compute with ordinary integers and reduce at the end. In $\\mathbb{Z}_7$: $[5] + [4] \\cdot [6] = [5] + [24] = [5] + [3] = [8] = [1]$.\n\n> **Watch out.** Multiply before adding or subtracting, as with ordinary numbers, and give the answer as a remainder from $0$ to $n - 1$: a negative result needs a multiple of $n$ added.",
        "剩余类上的运算可以用任意代表元进行，所以先用普通整数计算，最后再约化。在 $\\mathbb{Z}_7$ 中：$[5] + [4] \\cdot [6] = [5] + [24] = [5] + [3] = [8] = [1]$。\n\n> **注意。** 与普通数一样，先乘后加减；答案要写成 $0$ 到 $n - 1$ 之间的余数：结果为负时要加上 $n$ 的倍数。",
      ),
      generate(rng) {
        const n = rng.int(4, 13);
        const a = rng.int(0, n - 1);
        let b: number;
        let c: number;
        do {
          b = rng.int(2, n - 1);
          c = rng.int(2, n - 1);
        } while (b * c < n);
        const minus = rng.bool();
        const raw = minus ? a - b * c : a + b * c;
        const value = mod(raw, n);
        const op = minus ? "-" : "+";
        const prod = mod(b * c, n);
        const mid = minus ? a - prod : a + prod;
        const leftToRight = mod(minus ? (a - b) * c : (a + b) * c, n);
        return numberProblem({
          prompt: t(
            `In $\\mathbb{Z}_{${n}}$, $[${a}] ${op} [${b}] \\cdot [${c}] = [r]$ with $0 \\le r < ${n}$. Find $r$.`,
            `在 $\\mathbb{Z}_{${n}}$ 中，$[${a}] ${op} [${b}] \\cdot [${c}] = [r]$，其中 $0 \\le r < ${n}$。求 $r$。`,
          ),
          answer: value,
          wrong: [leftToRight, raw, mod(value + 1, n)],
          mistakes: [
            why(
              leftToRight,
              `That works from left to right; the product $[${b}] \\cdot [${c}]$ comes first.`,
              `这是从左到右计算的；应先算乘积 $[${b}] \\cdot [${c}]$。`,
            ),
            why(raw, `That is not reduced: $r$ must lie between $0$ and $${n - 1}$.`, `这没有约化：$r$ 必须在 $0$ 与 $${n - 1}$ 之间。`),
          ],
          solution: walked(
            [
              [
                ["Multiply", "先算乘法"],
                t(`$[${b}] \\cdot [${c}] = [${b * c}] = [${prod}]$.`, `$[${b}] \\cdot [${c}] = [${b * c}] = [${prod}]$。`),
              ],
              [
                [minus ? "Subtract" : "Add", minus ? "再算减法" : "再算加法"],
                t(
                  `$[${a}] ${op} [${prod}] = [${mid}]${mid === value ? "" : ` = [${value}]`}$${mid < 0 ? `, adding $${n}$ to bring it into range` : ""}.`,
                  `$[${a}] ${op} [${prod}] = [${mid}]${mid === value ? "" : ` = [${value}]`}$${mid < 0 ? `，加上 $${n}$ 使它落在范围内` : ""}。`,
                ),
              ],
            ],
            t(
              `With ordinary integers, $${a} ${op} ${b} \\cdot ${c} = ${raw} = ${n} \\cdot ${par((raw - value) / n)} + ${value}$, the same remainder.`,
              `用普通整数计算，$${a} ${op} ${b} \\cdot ${c} = ${raw} = ${n} \\cdot ${par((raw - value) / n)} + ${value}$，余数相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "units-and-zero-divisors",
      title: t("Units and zero divisors", "单位与零因子"),
      explanation: t(
        "A class has an inverse exactly when its representative is coprime to the modulus, and every other nonzero class multiplies some nonzero class to zero. In $\\mathbb{Z}_{12}$, the invertible classes are $[1], [5], [7], [11]$, those with $\\gcd(a, 12) = 1$. Every other nonzero class is a zero divisor: $[4] \\cdot [3] = [0]$.\n\n> **Watch out.** $[0]$ is neither invertible nor counted among the zero divisors here, so the invertible classes and the zero divisors together make up the $n - 1$ nonzero classes.",
        "一个类有逆元，当且仅当它的代表元与模互素；其他每个非零类都能与某个非零类相乘得到零。在 $\\mathbb{Z}_{12}$ 中，可逆类是 $[1], [5], [7], [11]$，即满足 $\\gcd(a, 12) = 1$ 的类。其余非零类都是零因子：$[4] \\cdot [3] = [0]$。\n\n> **注意。** $[0]$ 既不可逆，这里也不算作零因子，所以可逆类与零因子合起来恰好是 $n - 1$ 个非零类。",
      ),
      generate(rng) {
        const n = rng.int(6, 40);
        const units = range(1, n - 1).filter((a) => gcd(a, n) === 1);
        const zeroDiv = rng.bool();
        const count = zeroDiv ? n - 1 - units.length : units.length;
        const z = range(2, n - 1).find((a) => gcd(a, n) > 1);
        const mistakes = zeroDiv
          ? [
              why(units.length, "That counts the invertible classes.", "这数的是可逆类。"),
              why(
                n - units.length,
                "That counts $[0]$ too; only nonzero classes are asked about.",
                "这把 $[0]$ 也算进去了；题目只问非零类。",
              ),
            ]
          : [
              why(n - 1 - units.length, "That counts the zero divisors.", "这数的是零因子。"),
              why(units.length + 1, "That counts $[0]$ too, which has no inverse.", "这把 $[0]$ 也算进去了，而它没有逆元。"),
            ];
        return numberProblem({
          prompt: zeroDiv
            ? t(
                `How many nonzero classes $[a]$ in $\\mathbb{Z}_{${n}}$ are zero divisors, that is, $[a][b] = [0]$ for some nonzero $[b]$?`,
                `$\\mathbb{Z}_{${n}}$ 中有多少个非零类 $[a]$ 是零因子，即存在非零的 $[b]$ 使 $[a][b] = [0]$？`,
              )
            : t(`How many classes in $\\mathbb{Z}_{${n}}$ have a multiplicative inverse?`, `$\\mathbb{Z}_{${n}}$ 中有多少个类有乘法逆元？`),
          answer: count,
          wrong: [n - 1 - count, count + 1, n - count],
          mistakes: firstOf(mistakes),
          solution: walked(
            [
              [
                ["Find the invertible classes", "找出可逆类"],
                t(
                  `They are the $[a]$ with $\\gcd(a, ${n}) = 1$: $a = ${units.join(", ")}$, which makes $${units.length}$.`,
                  `它们是满足 $\\gcd(a, ${n}) = 1$ 的 $[a]$：$a = ${units.join(", ")}$，共 $${units.length}$ 个。`,
                ),
              ],
              ...(zeroDiv
                ? ([
                    [
                      ["Take the rest", "取其余的类"],
                      t(
                        `The other nonzero classes are zero divisors: $${n - 1} - ${units.length} = ${count}$.`,
                        `其余非零类都是零因子：$${n - 1} - ${units.length} = ${count}$ 个。`,
                      ),
                    ],
                  ] as [[string, string], Text][])
                : []),
            ],
            z === undefined
              ? t(
                  `$${n}$ is prime, so every $a$ from $1$ to $${n - 1}$ is coprime to it and there are no zero divisors.`,
                  `$${n}$ 是素数，所以 $1$ 到 $${n - 1}$ 的每个 $a$ 都与它互素，没有零因子。`,
                )
              : t(
                  `For example, $\\gcd(${z}, ${n}) = ${gcd(z, n)}$ and $[${z}] \\cdot [${n / gcd(z, n)}] = [${(z * n) / gcd(z, n)}] = [0]$, so $[${z}]$ is a zero divisor, while $[${n - 1}]$ is invertible: $[${n - 1}] \\cdot [${n - 1}] = [${(n - 1) ** 2}] = [1]$.`,
                  `例如 $\\gcd(${z}, ${n}) = ${gcd(z, n)}$，$[${z}] \\cdot [${n / gcd(z, n)}] = [${(z * n) / gcd(z, n)}] = [0]$，所以 $[${z}]$ 是零因子；而 $[${n - 1}]$ 可逆：$[${n - 1}] \\cdot [${n - 1}] = [${(n - 1) ** 2}] = [1]$。`,
                ),
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
