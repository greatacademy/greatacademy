import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { range, setProblem, setTex, uniqueSorted } from "./methods-of-proof-common.ts";
import {
  and,
  deMorganRewrite,
  type Formula,
  inequivalentTo,
  mutations,
  not,
  or,
  randomFormula,
  type Var,
  v,
  varsOf,
} from "./methods-of-proof-logic.ts";
import { follows, setExpr } from "./methods-of-proof-predicates.ts";

// Methods of Proof unit 2: extrema of sets, power sets, partitions, indicator functions and the algebra of sets.

/** names are the set names of the variables. */
const names: Record<Var, string> = { p: "A", q: "B", r: "C", s: "D" };

/** Lang selects the language of connective words. */
type Lang = "en" | "zh";

/** words are the connective words inside LaTeX. */
const words = { en: { and: "\\text{ and }", or: "\\text{ or }" }, zh: { and: "\\text{ 且 }", or: "\\text{ 或 }" } } as const;

/** memTex writes "x belongs to the set of f" as a statement about membership in A, B, C. */
export function memTex(f: Formula, lang: Lang, x = "x"): string {
  const inner = (g: Formula) => (g.k === "and" || g.k === "or" ? `(${memTex(g, lang, x)})` : memTex(g, lang, x));
  if (f.k === "var") return `${x} \\in ${names[f.v]}`;
  if (f.k === "not") return `${x} \\notin ${f.a.k === "var" ? names[f.a.v] : setExpr(f.a)}`;
  if (f.k === "and" || f.k === "or") {
    const same = (g: Formula) => (g.k === f.k ? memTex(g, lang, x) : inner(g));
    return `${same(f.a)}${words[lang][f.k]}${same(f.b)}`;
  }
  return `${x} \\in ${setExpr(f)}`;
}

/** mem wraps memTex as an option. */
const mem = (f: Formula) => t(`$${memTex(f, "en")}$`, `$${memTex(f, "zh")}$`);

/** setOpt writes a set expression as an option. */
const setOpt = (f: Formula) => t(`$${setExpr(f)}$`, `$${setExpr(f)}$`);

/** lit picks a set or its complement. */
const lit = (rng: Rng, x: Var, chance = 4) => (rng.int(0, chance - 1) === 0 ? not(v(x)) : v(x));

/** letters picks three distinct variables in random order. */
const letters = (rng: Rng) => rng.shuffle(["p", "q", "r"] as const) as [Var, Var, Var];

/** theMaximumAndMinimumOfASet finds the largest and smallest elements of sets. */
export const theMaximumAndMinimumOfASet: TopicDef = {
  id: "the-maximum-and-minimum-of-a-set",
  title: t("The Maximum and Minimum of a Set", "集合的最大值与最小值"),
  summary: t(
    "max S is an element of S at least as large as every element of S; a set need not have one.",
    "max S 是 S 中不小于 S 所有元素的那个元素；集合不一定有最大值。",
  ),
  prerequisites: ["describing-sets-using-set-builder-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "extrema-of-finite-sets",
      title: t("Extrema of finite sets", "有限集的最值"),
      explanation: t(
        "The **maximum** $\\max S$ is the element $m \\in S$ with $s \\le m$ for every $s \\in S$; the **minimum** is defined similarly. Every nonempty finite set of numbers has both. For $S = \\{x \\in \\mathbb{Z} : -4 < x \\le 9,\\ x \\text{ odd}\\}$, $\\min S = -3$ and $\\max S = 9$.",
        "**最大值** $\\max S$ 是满足对每个 $s \\in S$ 都有 $s \\le m$ 的元素 $m \\in S$；**最小值**类似定义。每个非空有限数集都有最大值和最小值。对 $S = \\{x \\in \\mathbb{Z} : -4 < x \\le 9,\\ x \\text{ 为奇数}\\}$，$\\min S = -3$，$\\max S = 9$。",
      ),
      generate(rng) {
        const a = rng.int(-12, 5);
        const b = a + rng.int(5, 15);
        const lowStrict = rng.bool();
        const highStrict = rng.bool();
        const parity = rng.int(0, 2);
        const lo = lowStrict ? a + 1 : a;
        const hi = highStrict ? b - 1 : b;
        const ok = (x: number) => parity === 0 || Math.abs(x % 2) === parity % 2;
        const members = range(lo, hi).filter(ok);
        const askMax = rng.bool();
        const answer = askMax ? members[members.length - 1]! : members[0]!;
        const cond = parity === 0 ? "" : parity === 1 ? ",\\ x \\text{ odd}" : ",\\ x \\text{ even}";
        const condZh = parity === 0 ? "" : parity === 1 ? ",\\ x \\text{ 为奇数}" : ",\\ x \\text{ 为偶数}";
        const set = (c: string) => `\\{x \\in \\mathbb{Z} : ${a} ${lowStrict ? "<" : "\\le"} x ${highStrict ? "<" : "\\le"} ${b}${c}\\}`;
        return numberProblem({
          prompt: t(
            `Let $S = ${set(cond)}$. Find $\\${askMax ? "max" : "min"} S$.`,
            `设 $S = ${set(condZh)}$。求 $\\${askMax ? "max" : "min"} S$。`,
          ),
          answer,
          wrong: [askMax ? b : a, askMax ? members[0]! : members[members.length - 1]!, answer + (askMax ? 1 : -1)],
          solution: t(
            `The elements of $S$ are $${setTex(members)}$, so $\\${askMax ? "max" : "min"} S = ${answer}$.`,
            `$S$ 的元素是 $${setTex(members)}$，所以 $\\${askMax ? "max" : "min"} S = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "sets-without-a-maximum-or-minimum",
      title: t("Sets without a maximum or minimum", "没有最值的集合"),
      explanation: t(
        "An infinite set may have no maximum or minimum. $(0, 1] = \\{x \\in \\mathbb{R} : 0 < x \\le 1\\}$ has maximum $1$ but no minimum: for any $s$ in the set, $s/2$ is a smaller element. $\\mathbb{Z}$ has neither, while $\\{x \\in \\mathbb{Z} : x > 3\\}$ has minimum $4$ and no maximum.",
        "无限集可能没有最大值或最小值。$(0, 1] = \\{x \\in \\mathbb{R} : 0 < x \\le 1\\}$ 的最大值为 $1$，但没有最小值：对集合中任意 $s$，$s/2$ 是更小的元素。$\\mathbb{Z}$ 两者都没有，而 $\\{x \\in \\mathbb{Z} : x > 3\\}$ 的最小值为 $4$，没有最大值。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = a + rng.int(1, 9);
        const kind = rng.int(0, 3);
        const real = rng.bool();
        const D = real ? "\\mathbb{R}" : "\\mathbb{Z}";
        let set: string;
        let min: number | null;
        let max: number | null;
        if (kind === 0) {
          const ls = rng.bool();
          const hs = rng.bool();
          set = `\\{x \\in ${D} : ${a} ${ls ? "<" : "\\le"} x ${hs ? "<" : "\\le"} ${b}\\}`;
          min = ls ? (real ? null : a + 1) : a;
          max = hs ? (real ? null : b - 1) : b;
        } else if (kind === 1) {
          const strict = rng.bool();
          set = `\\{x \\in ${D} : x ${strict ? ">" : "\\ge"} ${a}\\}`;
          min = strict ? (real ? null : a + 1) : a;
          max = null;
        } else if (kind === 2) {
          const strict = rng.bool();
          set = `\\{x \\in ${D} : x ${strict ? "<" : "\\le"} ${b}\\}`;
          min = null;
          max = strict ? (real ? null : b - 1) : b;
        } else {
          const k = rng.int(1, 9);
          set = `\\{x \\in ${D} : x^2 < ${k * k}\\}`;
          min = real ? null : -(k - 1);
          max = real ? null : k - 1;
        }
        if (min !== null && max !== null && min > max) [min, max] = [null, null];
        const describe = (lo: number | null, hi: number | null) =>
          t(
            `${lo === null ? "No minimum" : `Minimum $${lo}$`}, ${hi === null ? "no maximum" : `maximum $${hi}$`}`,
            `${lo === null ? "没有最小值" : `最小值 $${lo}$`}，${hi === null ? "没有最大值" : `最大值 $${hi}$`}`,
          );
        const right = describe(min, max);
        const lo0 = min ?? a;
        const hi0 = max ?? b;
        return oneOf(
          rng,
          t(`Which describes the extrema of $${set}$?`, `$${set}$ 的最值情况是哪一个？`),
          right,
          [describe(lo0, hi0), describe(null, null), describe(lo0, null), describe(null, hi0), describe(lo0 - 1, hi0 + 1)],
          t(
            `${min === null ? "Every element has a smaller element in the set, so there is no minimum" : `$${min}$ is in the set and no element is smaller`}; ${max === null ? "every element has a larger element in the set, so there is no maximum" : `$${max}$ is in the set and no element is larger`}.`,
            `${min === null ? "集合中每个元素都有更小的元素，所以没有最小值" : `$${min}$ 在集合中且没有更小的元素`}；${max === null ? "集合中每个元素都有更大的元素，所以没有最大值" : `$${max}$ 在集合中且没有更大的元素`}。`,
          ),
        );
      },
    },
  ],
};

/** letterSet picks n distinct letters for a set's elements. */
const letterSet = (rng: Rng, n: number) => rng.shuffle(["a", "b", "c", "d", "e", "f", "g", "h"]).slice(0, n).sort();

/** brace writes a set of letters or numbers. */
const brace = (xs: readonly (string | number)[]) => (xs.length === 0 ? "\\varnothing" : `\\{${xs.join(", ")}\\}`);

/** powerSets counts and recognizes subsets. */
export const powerSets: TopicDef = {
  id: "power-sets",
  title: t("Power Sets", "幂集"),
  summary: t(
    "The power set P(A) is the set of all subsets of A; a set with n elements has 2ⁿ subsets.",
    "幂集 P(A) 是 A 的所有子集组成的集合；含 n 个元素的集合有 2ⁿ 个子集。",
  ),
  prerequisites: ["subsets", "cardinality-of-finite-sets"],
  encompasses: [{ topic: "subsets", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-size-of-a-power-set",
      title: t("The size of a power set", "幂集的元素个数"),
      explanation: t(
        "The **power set** $\\mathcal{P}(A)$ contains every subset of $A$, including $\\varnothing$ and $A$ itself. Each element of $A$ is either in a subset or not, so $|\\mathcal{P}(A)| = 2^{|A|}$. For $A = \\{1, 2, 3\\}$, $|\\mathcal{P}(A)| = 8$.",
        "**幂集** $\\mathcal{P}(A)$ 包含 $A$ 的所有子集，包括 $\\varnothing$ 与 $A$ 本身。$A$ 的每个元素要么在子集中，要么不在，所以 $|\\mathcal{P}(A)| = 2^{|A|}$。若 $A = \\{1, 2, 3\\}$，则 $|\\mathcal{P}(A)| = 8$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const n = rng.int(0, 7);
          const xs = uniqueSorted(rng.shuffle(range(1, 20)).slice(0, n));
          return numberProblem({
            prompt: t(
              `Let $A = ${brace(xs)}$. How many elements does $\\mathcal{P}(A)$ have?`,
              `设 $A = ${brace(xs)}$。$\\mathcal{P}(A)$ 有多少个元素？`,
            ),
            answer: 2 ** n,
            wrong: [2 * n, n ** 2, 2 ** n - 1, n],
            solution: t(
              `$|A| = ${n}$, so $|\\mathcal{P}(A)| = 2^{${n}} = ${2 ** n}$.`,
              `$|A| = ${n}$，所以 $|\\mathcal{P}(A)| = 2^{${n}} = ${2 ** n}$。`,
            ),
          });
        }
        if (kind === 1) {
          const n = rng.int(2, 7);
          const k = rng.int(1, n - 1);
          let c = 1;
          for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
          return numberProblem({
            prompt: t(
              `A set $A$ has $${n}$ elements. How many elements of $\\mathcal{P}(A)$ have exactly $${k}$ element${k === 1 ? "" : "s"}?`,
              `集合 $A$ 有 $${n}$ 个元素。$\\mathcal{P}(A)$ 中恰有 $${k}$ 个元素的成员有多少个？`,
            ),
            answer: c,
            wrong: [2 ** n, 2 ** k, n * k],
            solution: t(
              `Choosing $${k}$ of the $${n}$ elements gives $\\binom{${n}}{${k}} = ${c}$ subsets.`,
              `从 $${n}$ 个元素中选 $${k}$ 个，得 $\\binom{${n}}{${k}} = ${c}$ 个子集。`,
            ),
          });
        }
        const n = rng.int(1, 3);
        const xs = range(1, n);
        const inner = 2 ** n;
        return numberProblem({
          prompt: t(
            `Let $A = ${brace(xs)}$. How many elements does $\\mathcal{P}(\\mathcal{P}(A))$ have?`,
            `设 $A = ${brace(xs)}$。$\\mathcal{P}(\\mathcal{P}(A))$ 有多少个元素？`,
          ),
          answer: 2 ** inner,
          wrong: [inner, 2 * inner, inner ** 2],
          solution: t(
            `$|\\mathcal{P}(A)| = 2^{${n}} = ${inner}$, so $|\\mathcal{P}(\\mathcal{P}(A))| = 2^{${inner}} = ${2 ** inner}$.`,
            `$|\\mathcal{P}(A)| = 2^{${n}} = ${inner}$，所以 $|\\mathcal{P}(\\mathcal{P}(A))| = 2^{${inner}} = ${2 ** inner}$。`,
          ),
        });
      },
    },
    {
      id: "elements-of-a-power-set",
      title: t("Elements of a power set", "幂集的元素"),
      explanation: t(
        "The elements of $\\mathcal{P}(A)$ are sets. If $A = \\{a, b, c\\}$, then $\\{a, c\\} \\in \\mathcal{P}(A)$ and $\\varnothing \\in \\mathcal{P}(A)$, but $a \\notin \\mathcal{P}(A)$: $a$ is an element of $A$, not a subset. Instead $\\{a\\} \\in \\mathcal{P}(A)$.",
        "$\\mathcal{P}(A)$ 的元素是集合。若 $A = \\{a, b, c\\}$，则 $\\{a, c\\} \\in \\mathcal{P}(A)$，$\\varnothing \\in \\mathcal{P}(A)$，但 $a \\notin \\mathcal{P}(A)$：$a$ 是 $A$ 的元素而不是子集。应写作 $\\{a\\} \\in \\mathcal{P}(A)$。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const all = ["a", "b", "c", "d", "e", "f", "g"];
        const a = letterSet(rng, n);
        const outside = all.find((x) => !a.includes(x))!;
        const sub = rng
          .shuffle(a)
          .slice(0, rng.int(1, n - 1))
          .sort();
        const askIn = rng.bool();
        const ins = [brace(sub), "\\varnothing", brace(a), brace([rng.pick(a)])];
        const outs = [rng.pick(a), brace([...sub, outside].sort()), `\\{${brace(sub)}\\}`, brace([outside])];
        const right = askIn ? rng.pick(ins) : rng.pick(outs);
        const wrong = askIn ? rng.shuffle(outs).slice(0, 3) : rng.shuffle(ins).slice(0, 3);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        return oneOf(
          rng,
          askIn
            ? t(
                `Let $A = ${brace(a)}$. Which is an element of $\\mathcal{P}(A)$?`,
                `设 $A = ${brace(a)}$。哪个是 $\\mathcal{P}(A)$ 的元素？`,
              )
            : t(
                `Let $A = ${brace(a)}$. Which is not an element of $\\mathcal{P}(A)$?`,
                `设 $A = ${brace(a)}$。哪个不是 $\\mathcal{P}(A)$ 的元素？`,
              ),
          opt(right),
          wrong.map(opt),
          t(
            "The elements of $\\mathcal{P}(A)$ are exactly the subsets of $A$, including $\\varnothing$ and $A$. A single letter is an element of $A$, not a subset, and a set containing a letter outside $A$ is not a subset.",
            "$\\mathcal{P}(A)$ 的元素恰是 $A$ 的子集，包括 $\\varnothing$ 与 $A$。单个字母是 $A$ 的元素而不是子集；含有 $A$ 以外字母的集合也不是子集。",
          ),
        );
      },
    },
  ],
};

/** partitionsOfSets splits a set into nonempty disjoint blocks. */
export const partitionsOfSets: TopicDef = {
  id: "partitions-of-sets",
  title: t("Partitions of Sets", "集合的划分"),
  summary: t(
    "A partition of A is a collection of nonempty, pairwise disjoint subsets of A whose union is A.",
    "A 的划分是 A 的一族非空、两两不交且并集为 A 的子集。",
  ),
  prerequisites: ["power-sets", "the-intersection-of-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-partitions",
      title: t("Recognizing partitions", "识别划分"),
      explanation: t(
        "A collection of subsets of $A$ is a **partition** when (1) no block is empty, (2) no two blocks share an element, and (3) every element of $A$ lies in some block. $\\{\\{1, 4\\}, \\{2\\}, \\{3, 5\\}\\}$ partitions $\\{1, 2, 3, 4, 5\\}$; $\\{\\{1, 4\\}, \\{2, 4\\}, \\{3, 5\\}\\}$ does not, since $4$ is in two blocks.",
        "$A$ 的一族子集若满足：(1) 没有空块，(2) 任意两块没有公共元素，(3) $A$ 的每个元素都在某一块中，则称为**划分**。$\\{\\{1, 4\\}, \\{2\\}, \\{3, 5\\}\\}$ 是 $\\{1, 2, 3, 4, 5\\}$ 的划分；$\\{\\{1, 4\\}, \\{2, 4\\}, \\{3, 5\\}\\}$ 不是，因为 $4$ 在两块中。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const xs = rng.shuffle(range(1, n));
        const cuts = uniqueSorted(rng.shuffle(range(1, n - 1)).slice(0, rng.int(1, 3)));
        const blocks: number[][] = [];
        let start = 0;
        for (const c of [...cuts, n]) {
          blocks.push(uniqueSorted(xs.slice(start, c)));
          start = c;
        }
        const flaw = rng.int(0, 3);
        let why: Text;
        if (flaw === 1) {
          const donor = blocks.find((b) => b.length > 1) ?? blocks[0]!;
          const x = donor[0]!;
          const target = blocks.find((b) => b !== donor)!;
          target.push(x);
          target.sort((p, q) => p - q);
          why = t(`No: $${x}$ lies in two blocks.`, `不是：$${x}$ 同时在两块中。`);
        } else if (flaw === 2) {
          const b = blocks.find((bl) => bl.length > 1) ?? blocks[0]!;
          const x = b.pop()!;
          if (b.length === 0) blocks.splice(blocks.indexOf(b), 1);
          why = t(`No: $${x}$ is in no block.`, `不是：$${x}$ 不在任何一块中。`);
        } else if (flaw === 3) {
          blocks.push([]);
          why = t("No: a partition cannot contain the empty set.", "不是：划分中不能含有空集。");
        } else {
          why = t("Yes: the blocks are nonempty, pairwise disjoint, and cover every element.", "是：各块非空、两两不交，且覆盖所有元素。");
        }
        const shown = rng.shuffle(blocks).map(brace).join(", ");
        return oneOf(
          rng,
          t(`Is $\\{${shown}\\}$ a partition of $${brace(range(1, n))}$?`, `$\\{${shown}\\}$ 是 $${brace(range(1, n))}$ 的划分吗？`),
          yesNo[flaw === 0 ? 0 : 1]!,
          [yesNo[flaw === 0 ? 1 : 0]!],
          why,
        );
      },
    },
    {
      id: "partitions-by-remainder",
      title: t("Partitions by remainder", "按余数划分"),
      explanation: t(
        "Grouping the elements of $\\{1, 2, \\dots, n\\}$ by their remainder on division by $k$ gives a partition with $k$ blocks (if $n \\ge k$). Dividing by $3$, $\\{1, \\dots, 10\\}$ splits into $\\{3, 6, 9\\}$, $\\{1, 4, 7, 10\\}$ and $\\{2, 5, 8\\}$.",
        "把 $\\{1, 2, \\dots, n\\}$ 的元素按除以 $k$ 的余数分组，得到含 $k$ 块的划分（当 $n \\ge k$ 时）。按除以 $3$ 分组，$\\{1, \\dots, 10\\}$ 分为 $\\{3, 6, 9\\}$、$\\{1, 4, 7, 10\\}$ 和 $\\{2, 5, 8\\}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        const n = rng.int(10, 20);
        const m = rng.int(1, n);
        const block = range(1, n).filter((x) => x % k === m % k);
        return setProblem({
          prompt: t(
            `Partition $\\{1, 2, \\dots, ${n}\\}$ by remainder on division by $${k}$. Which block contains $${m}$?`,
            `把 $\\{1, 2, \\dots, ${n}\\}$ 按除以 $${k}$ 的余数划分。哪一块包含 $${m}$？`,
          ),
          values: block,
          wrong: [range(1, n).filter((x) => x % k === (m + 1) % k), block.filter((x) => x >= m)],
          solution: t(
            `$${m}$ leaves remainder $${m % k}$, so its block is every element with remainder $${m % k}$: $${setTex(block)}$.`,
            `$${m}$ 除以 $${k}$ 余 $${m % k}$，所以它所在的块是所有余数为 $${m % k}$ 的元素：$${setTex(block)}$。`,
          ),
        });
      },
    },
  ],
};

/** indicatorFunctions represents sets by 0–1 valued functions. */
export const indicatorFunctions: TopicDef = {
  id: "indicator-functions",
  title: t("Indicator Functions", "示性函数"),
  summary: t(
    "The indicator function 1_A(x) is 1 when x ∈ A and 0 otherwise; set operations become arithmetic on indicators.",
    "示性函数 1_A(x) 在 x ∈ A 时为 1，否则为 0；集合运算对应示性函数的算术运算。",
  ),
  prerequisites: ["set-complements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-indicator-functions",
      title: t("Sums of indicators", "示性函数求和"),
      explanation: t(
        "$\\mathbf{1}_A(x) = 1$ if $x \\in A$ and $0$ if $x \\notin A$. Summing an indicator counts elements: $\\sum_{x=1}^{n} \\mathbf{1}_A(x) = |A \\cap \\{1, \\dots, n\\}|$. If $A$ is the set of multiples of $3$, $\\sum_{x=1}^{20} \\mathbf{1}_A(x) = 6$.",
        "$\\mathbf{1}_A(x)$ 在 $x \\in A$ 时为 $1$，在 $x \\notin A$ 时为 $0$。对示性函数求和就是计数：$\\sum_{x=1}^{n} \\mathbf{1}_A(x) = |A \\cap \\{1, \\dots, n\\}|$。若 $A$ 是 $3$ 的倍数组成的集合，则 $\\sum_{x=1}^{20} \\mathbf{1}_A(x) = 6$。",
      ),
      generate(rng) {
        const n = rng.int(12, 40);
        const k = rng.int(2, 5);
        const m = rng.int(2, 7);
        const kind = rng.int(0, 2);
        const inA = (x: number) => x % k === 0;
        const inB = (x: number) => x % m === 0;
        const [expr, f] = [
          [`\\mathbf{1}_A(x)`, (x: number) => (inA(x) ? 1 : 0)],
          [`\\mathbf{1}_A(x)\\,\\mathbf{1}_B(x)`, (x: number) => (inA(x) && inB(x) ? 1 : 0)],
          [`\\bigl(1 - \\mathbf{1}_A(x)\\bigr)`, (x: number) => (inA(x) ? 0 : 1)],
        ][kind] as [string, (x: number) => number];
        const total = range(1, n).reduce((s, x) => s + f(x), 0);
        const meaning = [t("$A$", "$A$"), t("$A \\cap B$", "$A \\cap B$"), t("$A^{c}$", "$A^{c}$")][kind]!;
        return numberProblem({
          prompt: t(
            `Let $A$ be the set of multiples of $${k}$${kind === 1 ? ` and $B$ the set of multiples of $${m}$` : ""}. Compute $\\sum_{x=1}^{${n}} ${expr}$.`,
            `设 $A$ 为 $${k}$ 的倍数组成的集合${kind === 1 ? `，$B$ 为 $${m}$ 的倍数组成的集合` : ""}。计算 $\\sum_{x=1}^{${n}} ${expr}$。`,
          ),
          answer: total,
          wrong: [Math.floor(n / k), n - Math.floor(n / k), Math.floor(n / (k * m)), total + 1],
          solution: t(
            `The summand is the indicator of ${meaning.en}, so the sum counts the elements of ${meaning.en} among $1, \\dots, ${n}$: $${total}$.`,
            `求和项是 ${meaning["zh-CN"]} 的示性函数，所以和就是 $1, \\dots, ${n}$ 中属于 ${meaning["zh-CN"]} 的元素个数：$${total}$。`,
          ),
        });
      },
    },
    {
      id: "indicators-of-set-operations",
      title: t("Indicators of set operations", "集合运算的示性函数"),
      explanation: t(
        "$\\mathbf{1}_{A \\cap B} = \\mathbf{1}_A \\mathbf{1}_B$, $\\mathbf{1}_{A^{c}} = 1 - \\mathbf{1}_A$, $\\mathbf{1}_{A \\cup B} = \\mathbf{1}_A + \\mathbf{1}_B - \\mathbf{1}_A \\mathbf{1}_B$ and $\\mathbf{1}_{A \\setminus B} = \\mathbf{1}_A (1 - \\mathbf{1}_B)$. Check each by trying the four cases $x \\in A$ or not, $x \\in B$ or not.",
        "$\\mathbf{1}_{A \\cap B} = \\mathbf{1}_A \\mathbf{1}_B$，$\\mathbf{1}_{A^{c}} = 1 - \\mathbf{1}_A$，$\\mathbf{1}_{A \\cup B} = \\mathbf{1}_A + \\mathbf{1}_B - \\mathbf{1}_A \\mathbf{1}_B$，$\\mathbf{1}_{A \\setminus B} = \\mathbf{1}_A (1 - \\mathbf{1}_B)$。可以逐一检验 $x$ 是否属于 $A$、是否属于 $B$ 这四种情形。",
      ),
      generate(rng) {
        const [X, Y] = rng.shuffle(["A", "B", "C", "D"]);
        const I = (s: string) => `\\mathbf{1}_{${s}}`;
        const forms = [
          { set: `${X} \\cap ${Y}`, right: `${I(X!)} ${I(Y!)}` },
          { set: `${X} \\cup ${Y}`, right: `${I(X!)} + ${I(Y!)} - ${I(X!)} ${I(Y!)}` },
          { set: `${X}^{c}`, right: `1 - ${I(X!)}` },
          { set: `${X} \\setminus ${Y}`, right: `${I(X!)} (1 - ${I(Y!)})` },
          { set: `${X}^{c} \\cap ${Y}^{c}`, right: `(1 - ${I(X!)})(1 - ${I(Y!)})` },
        ];
        const pool = [
          ...forms.map((f) => f.right),
          `${I(X!)} + ${I(Y!)}`,
          `${I(Y!)} (1 - ${I(X!)})`,
          `1 - ${I(X!)} ${I(Y!)}`,
          `${I(X!)} - ${I(Y!)}`,
        ];
        const f = rng.pick(forms);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        return oneOf(
          rng,
          t(`Which expression equals $${I(f.set)}$?`, `哪个表达式等于 $${I(f.set)}$？`),
          opt(f.right),
          rng.shuffle(pool.filter((p) => p !== f.right)).map(opt),
          t(
            `Check every case of membership in $${X}$${f.set.includes(Y!) ? ` and $${Y}$` : ""}: $${f.right}$ is $1$ exactly when $x \\in ${f.set}$.`,
            `检验 $x$ 是否属于 $${X}$${f.set.includes(Y!) ? `、$${Y}$` : ""} 的各种情形：$${f.right}$ 恰在 $x \\in ${f.set}$ 时为 $1$。`,
          ),
        );
      },
    },
  ],
};

/** Inclusion is a claim S ⊆ T about sets of integers or reals, with its truth and a reason. */
interface Inclusion {
  readonly s: string;
  readonly t: string;
  readonly value: boolean;
  readonly why: Text;
}

/** inclusion picks a concrete inclusion claim. */
function inclusion(rng: Rng): Inclusion {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const k = rng.int(2, 12);
    const m = rng.int(2, 12);
    const value = k % m === 0;
    return {
      s: `\\{x \\in \\mathbb{Z} : ${k} \\mid x\\}`,
      t: `\\{x \\in \\mathbb{Z} : ${m} \\mid x\\}`,
      value,
      why: value
        ? t(
            `If $${k} \\mid x$, write $x = ${k}j = ${m}(${k / m}j)$, so $${m} \\mid x$.`,
            `若 $${k} \\mid x$，设 $x = ${k}j = ${m}(${k / m}j)$，则 $${m} \\mid x$。`,
          )
        : t(`$x = ${k}$ is in the first set but $${m} \\nmid ${k}$.`, `$x = ${k}$ 在第一个集合中，但 $${m} \\nmid ${k}$。`),
    };
  }
  if (kind === 1) {
    const a = rng.int(-5, 5);
    const r = rng.int(1, 4);
    const b = a + rng.int(-3, 3);
    const s = rng.int(1, 6);
    const value = Math.abs(a - b) + r <= s;
    const show = (c: number, d: number) => `\\{x \\in \\mathbb{R} : |x ${c < 0 ? "+" : "-"} ${Math.abs(c)}| < ${d}\\}`;
    return {
      s: show(a, r),
      t: show(b, s),
      value,
      why: value
        ? t(
            `If $|x - (${a})| < ${r}$, then $|x - (${b})| \\le |x - (${a})| + |${a - b}| < ${r} + ${Math.abs(a - b)} \\le ${s}$.`,
            `若 $|x - (${a})| < ${r}$，则 $|x - (${b})| \\le |x - (${a})| + |${a - b}| < ${r} + ${Math.abs(a - b)} \\le ${s}$。`,
          )
        : t(
            `The first set is $(${a - r}, ${a + r})$ and the second is $(${b - s}, ${b + s})$; the first sticks out of the second.`,
            `第一个集合是 $(${a - r}, ${a + r})$，第二个是 $(${b - s}, ${b + s})$；第一个超出了第二个。`,
          ),
    };
  }
  const c = rng.int(1, 9);
  const d = rng.int(1, 10);
  const value = c * c <= d * d && c <= d;
  return {
    s: `\\{x \\in \\mathbb{R} : x^2 < ${c * c}\\}`,
    t: `\\{x \\in \\mathbb{R} : x < ${d}\\}`,
    value,
    why: value
      ? t(`If $x^2 < ${c * c}$ then $x < ${c} \\le ${d}$.`, `若 $x^2 < ${c * c}$，则 $x < ${c} \\le ${d}$。`)
      : t(
          `$x = ${(c + d) / 2 === Math.floor((c + d) / 2) ? (c + d) / 2 : `${c + d}/2`}$ satisfies $x^2 < ${c * c}$ but not $x < ${d}$.`,
          `$x = ${(c + d) / 2 === Math.floor((c + d) / 2) ? (c + d) / 2 : `${c + d}/2`}$ 满足 $x^2 < ${c * c}$ 但不满足 $x < ${d}$。`,
        ),
  };
}

/** chaseProblem asks for the step that unpacks membership in the left set of a proof of left ⊆ right; reason says how the step follows. */
function chaseProblem(rng: Rng, left: Formula, right: Formula, step: Formula, reason?: Text): Problem {
  const wrong = inequivalentTo(rng, step, [...mutations(step), ...mutations(left)]);
  const L = setExpr(left);
  const R = setExpr(right);
  const why = reason ?? t(`unpack the definition of $${L}$`, `按 $${L}$ 的定义展开`);
  return oneOf(
    rng,
    t(
      `To prove $${L} \\subseteq ${R}$: Let $x \\in ${L}$. Then ____. Hence $x \\in ${R}$. Which statement fills the blank?`,
      `证明 $${L} \\subseteq ${R}$：设 $x \\in ${L}$，则 ____。因此 $x \\in ${R}$。空白处应填哪个命题？`,
    ),
    mem(step),
    wrong.map(mem),
    t(`To fill the blank, ${why.en}: $${memTex(step, "en")}$.`, `${why["zh-CN"]}，得 $${memTex(step, "zh")}$。`),
  );
}

/** inclusionPair builds a valid inclusion from random literals. */
function inclusionPair(rng: Rng): [Formula, Formula] {
  for (;;) {
    const [x, y, z] = letters(rng);
    const a = lit(rng, x);
    const b = lit(rng, y);
    const c = lit(rng, z);
    const pairs: [Formula, Formula][] = [
      [and(a, b), a],
      [a, or(a, b)],
      [and(a, b), or(a, c)],
      [and(a, or(b, c)), or(a, b)],
      [and(and(a, b), c), and(a, c)],
      [and(a, b), or(b, c)],
    ];
    const [l, r] = rng.pick(pairs);
    if (follows([l], r).valid) return [l, r];
  }
}

/** provingSubsetRelations proves and disproves inclusions. */
export const provingSubsetRelations: TopicDef = {
  id: "proving-subset-relations",
  title: t("Proving Subset Relations", "证明子集关系"),
  summary: t(
    "To prove S ⊆ T, take an arbitrary x ∈ S and show x ∈ T; to disprove it, find one element of S outside T.",
    "要证明 S ⊆ T，任取 x ∈ S 并证明 x ∈ T；要否定它，找出 S 中一个不属于 T 的元素。",
  ),
  prerequisites: ["conditional-statements-with-predicates"],
  encompasses: [{ topic: "subsets", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "deciding-subset-relations",
      title: t("Deciding inclusions", "判断包含关系"),
      explanation: t(
        "$S \\subseteq T$ means $\\forall x\\,(x \\in S \\Rightarrow x \\in T)$. Prove it by taking an arbitrary $x \\in S$ and deducing $x \\in T$; disprove it with one counterexample. $\\{x \\in \\mathbb{Z} : 6 \\mid x\\} \\subseteq \\{x \\in \\mathbb{Z} : 3 \\mid x\\}$, since $x = 6j = 3(2j)$; the reverse inclusion fails for $x = 3$.",
        "$S \\subseteq T$ 表示 $\\forall x\\,(x \\in S \\Rightarrow x \\in T)$。证明时任取 $x \\in S$，推出 $x \\in T$；否定时只需一个反例。$\\{x \\in \\mathbb{Z} : 6 \\mid x\\} \\subseteq \\{x \\in \\mathbb{Z} : 3 \\mid x\\}$，因为 $x = 6j = 3(2j)$；反方向的包含在 $x = 3$ 时不成立。",
      ),
      generate(rng) {
        const c = inclusion(rng);
        return oneOf(
          rng,
          t(`Is $${c.s} \\subseteq ${c.t}$?`, `$${c.s} \\subseteq ${c.t}$ 成立吗？`),
          yesNo[c.value ? 0 : 1]!,
          [yesNo[c.value ? 1 : 0]!],
          c.why,
        );
      },
    },
    {
      id: "element-chasing",
      title: t("Element chasing", "元素追踪法"),
      explanation: t(
        'An **element-chasing** proof of $S \\subseteq T$ starts "Let $x \\in S$", unpacks the definition of $S$, and rebuilds the definition of $T$. To show $A \\cap B \\subseteq A \\cup C$: let $x \\in A \\cap B$; then $x \\in A$ and $x \\in B$; in particular $x \\in A$, so $x \\in A \\cup C$.',
        "**元素追踪法**证明 $S \\subseteq T$ 时，以“设 $x \\in S$”开始，按定义展开 $S$，再按定义组装出 $T$。证明 $A \\cap B \\subseteq A \\cup C$：设 $x \\in A \\cap B$，则 $x \\in A$ 且 $x \\in B$；特别地 $x \\in A$，所以 $x \\in A \\cup C$。",
      ),
      generate(rng) {
        const [l, r] = inclusionPair(rng);
        return chaseProblem(rng, l, r, l);
      },
    },
  ],
};

/** disjointSets recognizes sets with no common element. */
export const disjointSets: TopicDef = {
  id: "disjoint-sets",
  title: t("Disjoint Sets", "不相交集合"),
  summary: t(
    "A and B are disjoint when A ∩ B = ∅; a collection is pairwise disjoint when every two of its sets are disjoint.",
    "若 A ∩ B = ∅，则 A 与 B 不相交；若一族集合中任意两个都不相交，则称它们两两不交。",
  ),
  prerequisites: ["the-intersection-of-sets", "indexed-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "deciding-whether-sets-are-disjoint",
      title: t("Deciding disjointness", "判断是否不相交"),
      explanation: t(
        "To show $A \\cap B = \\varnothing$, show no element can satisfy both conditions. In $\\{1, \\dots, 20\\}$, the multiples of $4$ and of $6$ are not disjoint ($12$ is in both); the multiples of $5$ and the numbers of the form $5j + 2$ are disjoint, since their remainders on division by $5$ differ.",
        "要证明 $A \\cap B = \\varnothing$，就要说明没有元素能同时满足两个条件。在 $\\{1, \\dots, 20\\}$ 中，$4$ 的倍数与 $6$ 的倍数不是不相交的（$12$ 同属两者）；$5$ 的倍数与形如 $5j + 2$ 的数不相交，因为它们除以 $5$ 的余数不同。",
      ),
      generate(rng) {
        const n = rng.int(10, 30);
        const k = rng.int(2, 9);
        const m = rng.int(2, 9);
        const shift = rng.bool() ? 0 : rng.int(1, m - 1);
        const A = range(1, n).filter((x) => x % k === 0);
        const B = range(1, n).filter((x) => x % m === shift % m);
        const common = A.filter((x) => B.includes(x));
        const value = common.length === 0;
        const bTex = shift === 0 ? `\\{x : ${m} \\mid x\\}` : `\\{x : x = ${m}j + ${shift}\\}`;
        return oneOf(
          rng,
          t(
            `In the universe $\\{1, 2, \\dots, ${n}\\}$, are $\\{x : ${k} \\mid x\\}$ and $${bTex}$ disjoint?`,
            `在全集 $\\{1, 2, \\dots, ${n}\\}$ 中，$\\{x : ${k} \\mid x\\}$ 与 $${bTex}$ 不相交吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                `The sets are $${setTex(A)}$ and $${setTex(B)}$, which share no element.`,
                `两个集合分别是 $${setTex(A)}$ 和 $${setTex(B)}$，没有公共元素。`,
              )
            : t(`No: $${common[0]}$ is in both sets.`, `不是：$${common[0]}$ 同属两个集合。`),
        );
      },
    },
    {
      id: "pairwise-disjoint-collections",
      title: t("Pairwise disjoint collections", "两两不交的集合族"),
      explanation: t(
        "$A_1, A_2, A_3$ are **pairwise disjoint** when $A_i \\cap A_j = \\varnothing$ for all $i \\ne j$. This is stronger than $A_1 \\cap A_2 \\cap A_3 = \\varnothing$: $\\{1, 2\\}, \\{2, 3\\}, \\{4\\}$ have empty triple intersection but are not pairwise disjoint.",
        "若对所有 $i \\ne j$ 都有 $A_i \\cap A_j = \\varnothing$，则称 $A_1, A_2, A_3$ **两两不交**。这比 $A_1 \\cap A_2 \\cap A_3 = \\varnothing$ 更强：$\\{1, 2\\}, \\{2, 3\\}, \\{4\\}$ 的三者交集为空，但它们不是两两不交的。",
      ),
      generate(rng) {
        for (;;) {
          const sets = [0, 1, 2].map(() => uniqueSorted(rng.shuffle(range(1, 12)).slice(0, rng.int(2, 4))));
          const pairs = [
            [0, 1],
            [0, 2],
            [1, 2],
          ] as const;
          const bad = pairs.filter(([i, j]) => sets[i]!.some((x) => sets[j]!.includes(x)));
          if (bad.length !== 1) continue;
          const [i, j] = bad[0]!;
          const label = (p: readonly [number, number]) => t(`$A_${p[0] + 1}$ and $A_${p[1] + 1}$`, `$A_${p[0] + 1}$ 与 $A_${p[1] + 1}$`);
          const shared = sets[i]!.filter((x) => sets[j]!.includes(x));
          return oneOf(
            rng,
            t(
              `Let $A_1 = ${setTex(sets[0]!)}$, $A_2 = ${setTex(sets[1]!)}$ and $A_3 = ${setTex(sets[2]!)}$. Which pair is not disjoint?`,
              `设 $A_1 = ${setTex(sets[0]!)}$，$A_2 = ${setTex(sets[1]!)}$，$A_3 = ${setTex(sets[2]!)}$。哪一对集合不是不相交的？`,
            ),
            label([i, j]),
            [...pairs.filter((p) => p[0] !== i || p[1] !== j).map(label), t("Every pair is disjoint", "每一对都不相交")],
            t(
              `$A_${i + 1} \\cap A_${j + 1} = ${setTex(shared)}$; the other intersections are empty.`,
              `$A_${i + 1} \\cap A_${j + 1} = ${setTex(shared)}$；其余交集都为空。`,
            ),
          );
        }
      },
    },
  ],
};

/** Identity is an elementary property of set operations. */
interface Identity {
  readonly name: Text;
  readonly left: (a: string, b: string) => string;
  readonly right: (a: string, b: string) => string;
}

/** identities are the elementary properties of set operations, for sets inside a universe U. */
const identities: readonly Identity[] = [
  { name: t("Identity", "同一律"), left: (a) => `${a} \\cup \\varnothing`, right: (a) => a },
  { name: t("Identity", "同一律"), left: (a) => `${a} \\cap U`, right: (a) => a },
  { name: t("Domination", "零律"), left: (a) => `${a} \\cup U`, right: () => "U" },
  { name: t("Domination", "零律"), left: (a) => `${a} \\cap \\varnothing`, right: () => "\\varnothing" },
  { name: t("Idempotence", "幂等律"), left: (a) => `${a} \\cup ${a}`, right: (a) => a },
  { name: t("Idempotence", "幂等律"), left: (a) => `${a} \\cap ${a}`, right: (a) => a },
  { name: t("Complement", "互补律"), left: (a) => `${a} \\cup ${a}^{c}`, right: () => "U" },
  { name: t("Complement", "互补律"), left: (a) => `${a} \\cap ${a}^{c}`, right: () => "\\varnothing" },
  { name: t("Double complement", "双重补律"), left: (a) => `(${a}^{c})^{c}`, right: (a) => a },
  { name: t("Absorption", "吸收律"), left: (a, b) => `${a} \\cup (${a} \\cap ${b})`, right: (a) => a },
  { name: t("Absorption", "吸收律"), left: (a, b) => `${a} \\cap (${a} \\cup ${b})`, right: (a) => a },
  { name: t("Difference", "差集律"), left: (a) => `${a} \\setminus ${a}`, right: () => "\\varnothing" },
];

/** identityNames are the distinct property names. */
const identityNames = [...new Map(identities.map((i) => [i.name.en, i.name])).values()];

/** elementaryPropertiesOfSetOperations simplifies set expressions. */
export const elementaryPropertiesOfSetOperations: TopicDef = {
  id: "elementary-properties-of-set-operations",
  title: t("Elementary Properties of Set Operations", "集合运算的基本性质"),
  summary: t(
    "Union and intersection are commutative and associative, and satisfy identity, domination, idempotence, complement and absorption laws.",
    "并与交满足交换律、结合律，以及同一律、零律、幂等律、互补律和吸收律。",
  ),
  prerequisites: ["disjoint-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "simplifying-with-set-properties",
      title: t("Simplifying set expressions", "化简集合表达式"),
      explanation: t(
        "For sets $A$, $B$ in a universe $U$: $A \\cup \\varnothing = A$, $A \\cap U = A$, $A \\cup U = U$, $A \\cap \\varnothing = \\varnothing$, $A \\cup A = A$, $A \\cup A^{c} = U$, $A \\cap A^{c} = \\varnothing$, $(A^{c})^{c} = A$ and $A \\cup (A \\cap B) = A$.",
        "对全集 $U$ 中的集合 $A$、$B$：$A \\cup \\varnothing = A$，$A \\cap U = A$，$A \\cup U = U$，$A \\cap \\varnothing = \\varnothing$，$A \\cup A = A$，$A \\cup A^{c} = U$，$A \\cap A^{c} = \\varnothing$，$(A^{c})^{c} = A$，$A \\cup (A \\cap B) = A$。",
      ),
      generate(rng) {
        const id = rng.pick(identities);
        const [a, b] = rng.shuffle(["A", "B", "C", "D"]) as [string, string];
        const right = id.right(a, b);
        const pool = [a, b, "U", "\\varnothing", `${a} \\cap ${b}`, `${a} \\cup ${b}`, `${a}^{c}`];
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        return oneOf(
          rng,
          t(`For sets in a universe $U$, simplify $${id.left(a, b)}$.`, `对全集 $U$ 中的集合，化简 $${id.left(a, b)}$。`),
          opt(right),
          rng.shuffle(pool.filter((p) => p !== right)).map(opt),
          t(
            `By the ${id.name.en.toLowerCase()} law, $${id.left(a, b)} = ${right}$.`,
            `由${id.name["zh-CN"]}，$${id.left(a, b)} = ${right}$。`,
          ),
        );
      },
    },
    {
      id: "naming-set-properties",
      title: t("Naming the property", "说出性质"),
      explanation: t(
        "Each property has a name: identity ($A \\cup \\varnothing = A$), domination ($A \\cup U = U$), idempotence ($A \\cup A = A$), complement ($A \\cup A^{c} = U$), double complement ($(A^{c})^{c} = A$) and absorption ($A \\cup (A \\cap B) = A$).",
        "每条性质都有名称：同一律（$A \\cup \\varnothing = A$）、零律（$A \\cup U = U$）、幂等律（$A \\cup A = A$）、互补律（$A \\cup A^{c} = U$）、双重补律（$(A^{c})^{c} = A$）、吸收律（$A \\cup (A \\cap B) = A$）。",
      ),
      generate(rng) {
        const id = rng.pick(identities.filter((i) => i.name.en !== "Difference"));
        const [a, b] = rng.shuffle(["A", "B", "C", "D"]) as [string, string];
        return oneOf(
          rng,
          t(`Which property states $${id.left(a, b)} = ${id.right(a, b)}$?`, `哪条性质表明 $${id.left(a, b)} = ${id.right(a, b)}$？`),
          id.name,
          rng.shuffle(identityNames.filter((n) => n.en !== id.name.en && n.en !== "Difference")),
          t(`This is the ${id.name.en.toLowerCase()} law.`, `这是${id.name["zh-CN"]}。`),
        );
      },
    },
  ],
};

/** Equality is a set identity used in proofs, as formulas over p, q, r. */
interface Equality {
  readonly left: Formula;
  readonly right: Formula;
}

/** propertyEquality picks an absorption or similar identity with letters. */
function propertyEquality(rng: Rng): Equality {
  const [x, y] = letters(rng);
  const a = lit(rng, x, 5);
  const b = lit(rng, y, 5);
  return rng.pick([
    { left: or(a, and(a, b)), right: a },
    { left: and(a, or(a, b)), right: a },
    { left: and(a, b), right: and(b, a) },
    { left: or(a, b), right: or(b, a) },
    { left: or(and(a, b), and(a, not(b))), right: a },
  ]);
}

/** provingElementaryPropertiesOfSetOperations proves set equalities by double inclusion. */
export const provingElementaryPropertiesOfSetOperations: TopicDef = {
  id: "proving-elementary-properties-of-set-operations",
  title: t("Proving Elementary Properties of Set Operations", "证明集合运算的基本性质"),
  summary: t(
    "Prove S = T by double inclusion: show S ⊆ T and T ⊆ S, each by element chasing.",
    "用双向包含证明 S = T：分别用元素追踪法证明 S ⊆ T 与 T ⊆ S。",
  ),
  prerequisites: ["elementary-properties-of-set-operations", "proving-subset-relations"],
  encompasses: [{ topic: "proving-subset-relations", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "double-inclusion",
      title: t("Double inclusion", "双向包含"),
      explanation: t(
        "Two sets are equal when each is a subset of the other. To prove $A \\cup (A \\cap B) = A$, prove $A \\cup (A \\cap B) \\subseteq A$ and $A \\subseteq A \\cup (A \\cap B)$.",
        "两个集合互为子集时相等。要证明 $A \\cup (A \\cap B) = A$，就要证明 $A \\cup (A \\cap B) \\subseteq A$ 与 $A \\subseteq A \\cup (A \\cap B)$。",
      ),
      generate(rng) {
        const e = propertyEquality(rng);
        const S = setExpr(e.left);
        const T = setExpr(e.right);
        const opt = (en: string, zh: string) => t(en, zh);
        return oneOf(
          rng,
          t(`What must be shown to prove $${S} = ${T}$ by double inclusion?`, `用双向包含证明 $${S} = ${T}$，需要证明什么？`),
          opt(`$${S} \\subseteq ${T}$ and $${T} \\subseteq ${S}$`, `$${S} \\subseteq ${T}$ 且 $${T} \\subseteq ${S}$`),
          [
            opt(`$${S} \\subseteq ${T}$ only`, `只需 $${S} \\subseteq ${T}$`),
            opt(`$${S} \\cap ${T} \\ne \\varnothing$`, `$${S} \\cap ${T} \\ne \\varnothing$`),
            opt(`$|${S}| = |${T}|$`, `$|${S}| = |${T}|$`),
          ],
          t("Equality of sets means each is a subset of the other.", "集合相等意味着二者互为子集。"),
        );
      },
    },
    {
      id: "chasing-elements-through-a-property",
      title: t("Chasing elements through a property", "用元素追踪证明性质"),
      explanation: t(
        "In each direction, unpack the definition of the left set. For $A \\cup (A \\cap B) \\subseteq A$: let $x \\in A \\cup (A \\cap B)$; then $x \\in A$ or ($x \\in A$ and $x \\in B$); in either case $x \\in A$.",
        "每个方向都先按定义展开左边的集合。证明 $A \\cup (A \\cap B) \\subseteq A$：设 $x \\in A \\cup (A \\cap B)$，则 $x \\in A$ 或（$x \\in A$ 且 $x \\in B$）；无论哪种情形都有 $x \\in A$。",
      ),
      generate(rng) {
        const e = propertyEquality(rng);
        const [l, r] =
          e.right.k === "and" || e.right.k === "or"
            ? rng.pick([
                [e.left, e.right],
                [e.right, e.left],
              ])
            : [e.left, e.right];
        return chaseProblem(rng, l, r, l);
      },
    },
  ],
};

/** twoSets picks two listed sets inside 1..n. */
function twoSets(rng: Rng) {
  const n = rng.int(8, 12);
  const pick = () => uniqueSorted(rng.shuffle(range(1, n)).slice(0, rng.int(3, 6)));
  return { n, U: range(1, n), A: pick(), B: pick(), C: pick() };
}

/** deMorgansLawsForSets complements unions and intersections. */
export const deMorgansLawsForSets: TopicDef = {
  id: "de-morgans-laws-for-sets",
  title: t("De Morgan's Laws for Sets", "集合的德摩根律"),
  summary: t("(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ and (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ.", "(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ，(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ。"),
  prerequisites: ["elementary-properties-of-set-operations", "de-morgans-laws-for-logic"],
  encompasses: [{ topic: "set-complements", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "complements-of-unions-and-intersections",
      title: t("Complements of unions and intersections", "并集与交集的补集"),
      explanation: t(
        "$(A \\cup B)^{c} = A^{c} \\cap B^{c}$: an element is outside $A \\cup B$ exactly when it is outside both. $(A \\cap B)^{c} = A^{c} \\cup B^{c}$: an element is outside $A \\cap B$ when it is outside at least one.",
        "$(A \\cup B)^{c} = A^{c} \\cap B^{c}$：元素不在 $A \\cup B$ 中，当且仅当它两个都不在。$(A \\cap B)^{c} = A^{c} \\cup B^{c}$：元素不在 $A \\cap B$ 中，当且仅当它至少不在其中一个。",
      ),
      generate(rng) {
        const { n, U, A, B } = twoSets(rng);
        const isUnion = rng.bool();
        const values = U.filter((x) => (isUnion ? !A.includes(x) && !B.includes(x) : !(A.includes(x) && B.includes(x))));
        const op = isUnion ? "\\cup" : "\\cap";
        const other = isUnion ? "\\cap" : "\\cup";
        return setProblem({
          prompt: t(
            `Let $U = \\{1, 2, \\dots, ${n}\\}$, $A = ${setTex(A)}$ and $B = ${setTex(B)}$. Find $(A ${op} B)^{c}$.`,
            `设 $U = \\{1, 2, \\dots, ${n}\\}$，$A = ${setTex(A)}$，$B = ${setTex(B)}$。求 $(A ${op} B)^{c}$。`,
          ),
          values,
          wrong: [
            U.filter((x) => (isUnion ? !(A.includes(x) && B.includes(x)) : !A.includes(x) && !B.includes(x))),
            U.filter((x) => (isUnion ? A.includes(x) || B.includes(x) : A.includes(x) && B.includes(x))),
          ],
          solution: t(
            `By De Morgan's law, $(A ${op} B)^{c} = A^{c} ${other} B^{c}$, which is $${setTex(values)}$.`,
            `由德摩根律，$(A ${op} B)^{c} = A^{c} ${other} B^{c}$，即 $${setTex(values)}$。`,
          ),
        });
      },
    },
    {
      id: "rewriting-complements-of-set-expressions",
      title: t("Rewriting complements", "改写补集"),
      explanation: t(
        "Apply De Morgan's laws repeatedly to push a complement inward, and cancel double complements: $(A \\cap (B \\cup C^{c}))^{c} = A^{c} \\cup (B^{c} \\cap C)$.",
        "反复应用德摩根律把补集移入，并消去双重补：$(A \\cap (B \\cup C^{c}))^{c} = A^{c} \\cup (B^{c} \\cap C)$。",
      ),
      generate(rng) {
        for (;;) {
          const inner = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or"]);
          if ((inner.k !== "and" && inner.k !== "or") || varsOf(inner).length < 2) continue;
          const f = not(inner);
          const g = deMorganRewrite(f);
          const wrong = inequivalentTo(rng, f, [...mutations(g), ...mutations(inner)]);
          return oneOf(
            rng,
            t(`Which set equals $${setExpr(f)}$?`, `哪个集合等于 $${setExpr(f)}$？`),
            setOpt(g),
            wrong.map(setOpt),
            t(
              `Push the complement inward, swapping $\\cup$ and $\\cap$: $${setExpr(f)} = ${setExpr(g)}$.`,
              `把补集移入括号，并互换 $\\cup$ 与 $\\cap$：$${setExpr(f)} = ${setExpr(g)}$。`,
            ),
          );
        }
      },
    },
  ],
};

/** provingDeMorgansLawsForSets proves De Morgan's laws by element chasing. */
export const provingDeMorgansLawsForSets: TopicDef = {
  id: "proving-de-morgans-laws-for-sets",
  title: t("Proving De Morgan's Laws for Sets", "证明集合的德摩根律"),
  summary: t(
    "x ∈ (A ∪ B)ᶜ ⇔ ¬(x ∈ A ∨ x ∈ B) ⇔ x ∉ A ∧ x ∉ B ⇔ x ∈ Aᶜ ∩ Bᶜ: De Morgan's laws for sets follow from those for logic.",
    "x ∈ (A ∪ B)ᶜ ⇔ ¬(x ∈ A ∨ x ∈ B) ⇔ x ∉ A ∧ x ∉ B ⇔ x ∈ Aᶜ ∩ Bᶜ：集合的德摩根律由逻辑的德摩根律得出。",
  ),
  prerequisites: ["de-morgans-laws-for-sets", "proving-elementary-properties-of-set-operations"],
  encompasses: [{ topic: "de-morgans-laws-for-sets", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-key-step-of-de-morgans-laws",
      title: t("The key step", "关键一步"),
      explanation: t(
        "Let $x \\in (A \\cup B)^{c}$. Then $x \\notin A \\cup B$, so it is not true that $x \\in A$ or $x \\in B$. By De Morgan's law for logic, $x \\notin A$ and $x \\notin B$, so $x \\in A^{c} \\cap B^{c}$.",
        "设 $x \\in (A \\cup B)^{c}$，则 $x \\notin A \\cup B$，即“$x \\in A$ 或 $x \\in B$”不成立。由逻辑的德摩根律，$x \\notin A$ 且 $x \\notin B$，所以 $x \\in A^{c} \\cap B^{c}$。",
      ),
      generate(rng) {
        const [x, y, z] = letters(rng);
        const a = lit(rng, x, 5);
        const b = lit(rng, y, 5);
        const c = v(z);
        const inner = rng.pick([or(a, b), and(a, b), or(a, and(b, c)), and(a, or(b, c))]);
        const f = not(inner);
        const step = deMorganRewrite(f);
        return chaseProblem(
          rng,
          f,
          step,
          step,
          t("apply De Morgan's law for logic to the negated membership", "对否定的隶属关系应用逻辑的德摩根律"),
        );
      },
    },
    {
      id: "the-reverse-inclusion",
      title: t("The reverse inclusion", "反方向的包含"),
      explanation: t(
        "For $A^{c} \\cap B^{c} \\subseteq (A \\cup B)^{c}$: let $x \\in A^{c} \\cap B^{c}$. Then $x \\notin A$ and $x \\notin B$, so $x$ is in neither, that is $x \\notin A \\cup B$. Hence $x \\in (A \\cup B)^{c}$.",
        "证明 $A^{c} \\cap B^{c} \\subseteq (A \\cup B)^{c}$：设 $x \\in A^{c} \\cap B^{c}$，则 $x \\notin A$ 且 $x \\notin B$，即 $x$ 两个都不在，也就是 $x \\notin A \\cup B$。因此 $x \\in (A \\cup B)^{c}$。",
      ),
      generate(rng) {
        const [x, y, z] = letters(rng);
        const a = lit(rng, x, 5);
        const b = lit(rng, y, 5);
        const [l, r, isAnd] = rng.pick([
          [a, b, false],
          [a, b, true],
          [a, and(b, v(z)), false],
          [a, or(b, v(z)), true],
        ] as const);
        const inner = isAnd ? and(l, r) : or(l, r);
        const swapped = isAnd ? or(l, r) : and(l, r);
        const f = not(inner);
        const start = deMorganRewrite(f);
        const right = t(`$x \\notin ${setExpr(inner)}$`, `$x \\notin ${setExpr(inner)}$`);
        const wrongs = [
          t(`$x \\in ${setExpr(inner)}$`, `$x \\in ${setExpr(inner)}$`),
          t(`$x \\notin ${setExpr(swapped)}$`, `$x \\notin ${setExpr(swapped)}$`),
          t(`$x \\in ${setExpr(swapped)}$`, `$x \\in ${setExpr(swapped)}$`),
        ];
        return oneOf(
          rng,
          t(
            `To prove $${setExpr(start)} \\subseteq ${setExpr(f)}$: Let $x \\in ${setExpr(start)}$. Then $${memTex(start, "en")}$, so ____. Hence $x \\in ${setExpr(f)}$. Which statement fills the blank?`,
            `证明 $${setExpr(start)} \\subseteq ${setExpr(f)}$：设 $x \\in ${setExpr(start)}$，则 $${memTex(start, "zh")}$，所以 ____。因此 $x \\in ${setExpr(f)}$。空白处应填哪个命题？`,
          ),
          right,
          wrongs,
          t(
            `By De Morgan's law for logic, $${memTex(start, "en")}$ says exactly that $x \\notin ${setExpr(inner)}$.`,
            `由逻辑的德摩根律，$${memTex(start, "zh")}$ 恰好说明 $x \\notin ${setExpr(inner)}$。`,
          ),
        );
      },
    },
  ],
};

/** distribute expands one distributive step at the top of a formula. */
function distribute(f: Formula): Formula {
  if (f.k === "and" && f.b.k === "or") return or(and(f.a, f.b.a), and(f.a, f.b.b));
  if (f.k === "or" && f.b.k === "and") return and(or(f.a, f.b.a), or(f.a, f.b.b));
  return f;
}

/** distributiveForm picks a formula of the form a ∘ (b • c). */
function distributiveForm(rng: Rng): Formula {
  const [x, y, z] = letters(rng);
  const a = lit(rng, x, 5);
  const b = lit(rng, y, 5);
  const c = lit(rng, z, 5);
  return rng.bool() ? and(a, or(b, c)) : or(a, and(b, c));
}

/** distributivePropertiesOfSetOperations distributes ∩ over ∪ and ∪ over ∩. */
export const distributivePropertiesOfSetOperations: TopicDef = {
  id: "distributive-properties-of-set-operations",
  title: t("Distributive Properties of Set Operations", "集合运算的分配律"),
  summary: t(
    "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) and A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C).",
    "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)，A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)。",
  ),
  prerequisites: ["elementary-properties-of-set-operations", "the-distributive-laws"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-with-three-sets",
      title: t("Computing with three sets", "三个集合的运算"),
      explanation: t(
        "Parentheses matter: $A \\cap (B \\cup C)$ and $(A \\cap B) \\cup C$ are different sets in general. Compute the inner operation first, or use the distributive law: $A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$.",
        "括号很重要：一般而言 $A \\cap (B \\cup C)$ 与 $(A \\cap B) \\cup C$ 是不同的集合。先算括号内的运算，或用分配律：$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$。",
      ),
      generate(rng) {
        const { A, B, C } = twoSets(rng);
        const capFirst = rng.bool();
        const inA = (x: number) => A.includes(x);
        const inB = (x: number) => B.includes(x);
        const inC = (x: number) => C.includes(x);
        const all = uniqueSorted([...A, ...B, ...C]);
        const values = all.filter((x) => (capFirst ? inA(x) && (inB(x) || inC(x)) : inA(x) || (inB(x) && inC(x))));
        const regrouped = all.filter((x) => (capFirst ? (inA(x) && inB(x)) || inC(x) : (inA(x) || inB(x)) && inC(x)));
        const expr = capFirst ? "A \\cap (B \\cup C)" : "A \\cup (B \\cap C)";
        const law = capFirst ? "(A \\cap B) \\cup (A \\cap C)" : "(A \\cup B) \\cap (A \\cup C)";
        return setProblem({
          prompt: t(
            `Let $A = ${setTex(A)}$, $B = ${setTex(B)}$ and $C = ${setTex(C)}$. Find $${expr}$.`,
            `设 $A = ${setTex(A)}$，$B = ${setTex(B)}$，$C = ${setTex(C)}$。求 $${expr}$。`,
          ),
          values,
          wrong: [regrouped, all.filter((x) => (capFirst ? inA(x) && inB(x) && inC(x) : inA(x) || inB(x) || inC(x)))],
          solution: t(`$${expr} = ${law} = ${setTex(values)}$.`, `$${expr} = ${law} = ${setTex(values)}$。`),
        });
      },
    },
    {
      id: "applying-the-distributive-laws-for-sets",
      title: t("Applying the distributive laws", "应用分配律"),
      explanation: t(
        "Both operations distribute over each other: $A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$. Read right to left, the law factors out a common set.",
        "两种运算可以互相分配：$A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$。从右往左读，分配律可以提取公共的集合。",
      ),
      generate(rng) {
        const f = distributiveForm(rng);
        const g = distribute(f);
        const [src, dst] = rng.bool() ? [f, g] : [g, f];
        const wrong = inequivalentTo(rng, src, [...mutations(dst), ...mutations(src)]);
        return oneOf(
          rng,
          t(`Which set equals $${setExpr(src)}$?`, `哪个集合等于 $${setExpr(src)}$？`),
          setOpt(dst),
          wrong.map(setOpt),
          t(`By the distributive law, $${setExpr(src)} = ${setExpr(dst)}$.`, `由分配律，$${setExpr(src)} = ${setExpr(dst)}$。`),
        );
      },
    },
  ],
};

/** provingDistributivePropertiesOfUnionAndIntersection proves the distributive laws by element chasing. */
export const provingDistributivePropertiesOfUnionAndIntersection: TopicDef = {
  id: "proving-distributive-properties-of-union-and-intersection",
  title: t("Proving Distributive Properties of Union and Intersection", "证明并与交的分配律"),
  summary: t(
    "The distributive laws for sets follow from the distributive laws for ∧ and ∨, applied to membership statements.",
    "集合的分配律由 ∧ 与 ∨ 的分配律作用于隶属关系命题得到。",
  ),
  prerequisites: ["distributive-properties-of-set-operations", "proving-elementary-properties-of-set-operations"],
  encompasses: [{ topic: "distributive-properties-of-set-operations", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "distributing-membership-statements",
      title: t("Distributing membership statements", "分配隶属关系命题"),
      explanation: t(
        "Let $x \\in A \\cap (B \\cup C)$. Then $x \\in A$ and ($x \\in B$ or $x \\in C$). By the distributive law for logic, ($x \\in A$ and $x \\in B$) or ($x \\in A$ and $x \\in C$), so $x \\in (A \\cap B) \\cup (A \\cap C)$.",
        "设 $x \\in A \\cap (B \\cup C)$，则 $x \\in A$ 且（$x \\in B$ 或 $x \\in C$）。由逻辑的分配律，（$x \\in A$ 且 $x \\in B$）或（$x \\in A$ 且 $x \\in C$），所以 $x \\in (A \\cap B) \\cup (A \\cap C)$。",
      ),
      generate(rng) {
        const f = distributiveForm(rng);
        const g = distribute(f);
        return chaseProblem(
          rng,
          f,
          g,
          g,
          t("unpack the definition and apply the distributive law for logic", "按定义展开并应用逻辑的分配律"),
        );
      },
    },
    {
      id: "proving-the-reverse-inclusion-by-cases",
      title: t("The reverse inclusion by cases", "分情形证明反方向"),
      explanation: t(
        "For $(A \\cap B) \\cup (A \\cap C) \\subseteq A \\cap (B \\cup C)$, let $x$ be in the left set and consider two cases. If $x \\in A \\cap B$, then $x \\in A$ and $x \\in B \\subseteq B \\cup C$. If $x \\in A \\cap C$, then $x \\in A$ and $x \\in C \\subseteq B \\cup C$. Either way $x \\in A \\cap (B \\cup C)$.",
        "证明 $(A \\cap B) \\cup (A \\cap C) \\subseteq A \\cap (B \\cup C)$：设 $x$ 属于左边的集合，分两种情形。若 $x \\in A \\cap B$，则 $x \\in A$ 且 $x \\in B \\subseteq B \\cup C$。若 $x \\in A \\cap C$，则 $x \\in A$ 且 $x \\in C \\subseteq B \\cup C$。无论哪种情形，都有 $x \\in A \\cap (B \\cup C)$。",
      ),
      generate(rng) {
        const [x, y, z] = rng.shuffle(["p", "q", "r", "s"] as const) as [Var, Var, Var];
        const A = names[x];
        const B = names[y];
        const C = names[z];
        const capOverCup = rng.bool();
        const caseSet = rng.bool() ? B : C;
        const right = capOverCup
          ? t(`$x \\in ${A}$ and $x \\in ${B} \\cup ${C}$`, `$x \\in ${A}$ 且 $x \\in ${B} \\cup ${C}$`)
          : t(`$x \\in ${A} \\cup ${B}$ and $x \\in ${A} \\cup ${C}$`, `$x \\in ${A} \\cup ${B}$ 且 $x \\in ${A} \\cup ${C}$`);
        const wrong = capOverCup
          ? [
              t(`$x \\in ${A}$ and $x \\in ${B} \\cap ${C}$`, `$x \\in ${A}$ 且 $x \\in ${B} \\cap ${C}$`),
              t(`$x \\in ${A}$ or $x \\in ${B} \\cup ${C}$`, `$x \\in ${A}$ 或 $x \\in ${B} \\cup ${C}$`),
              t(`$x \\in ${caseSet}$ only`, `只有 $x \\in ${caseSet}$`),
            ]
          : [
              t(`$x \\in ${A} \\cap ${B}$ and $x \\in ${A} \\cap ${C}$`, `$x \\in ${A} \\cap ${B}$ 且 $x \\in ${A} \\cap ${C}$`),
              t(`$x \\in ${A} \\cup ${B}$ or $x \\in ${A} \\cup ${C}$`, `$x \\in ${A} \\cup ${B}$ 或 $x \\in ${A} \\cup ${C}$`),
              t(`$x \\in ${B} \\cap ${C}$`, `$x \\in ${B} \\cap ${C}$`),
            ];
        const left = capOverCup ? `(${A} \\cap ${B}) \\cup (${A} \\cap ${C})` : `${A} \\cup (${B} \\cap ${C})`;
        const target = capOverCup ? `${A} \\cap (${B} \\cup ${C})` : `(${A} \\cup ${B}) \\cap (${A} \\cup ${C})`;
        const caseText = capOverCup
          ? t(`Suppose $x \\in ${A} \\cap ${caseSet}$.`, `设 $x \\in ${A} \\cap ${caseSet}$。`)
          : rng.bool()
            ? t(`Suppose $x \\in ${A}$.`, `设 $x \\in ${A}$。`)
            : t(`Suppose $x \\in ${B} \\cap ${C}$.`, `设 $x \\in ${B} \\cap ${C}$。`);
        return oneOf(
          rng,
          t(
            `In proving $${left} \\subseteq ${target}$, one case reads: "${caseText.en} Then ____, so $x \\in ${target}$." Which statement fills the blank?`,
            `在证明 $${left} \\subseteq ${target}$ 时，其中一种情形是：“${caseText["zh-CN"]}则 ____，所以 $x \\in ${target}$。”空白处应填哪个命题？`,
          ),
          right,
          wrong,
          t(
            `Membership in $${target}$ means exactly ${right.en}, and in this case both parts hold.`,
            `属于 $${target}$ 恰好意味着${right["zh-CN"]}，而在该情形下两部分都成立。`,
          ),
        );
      },
    },
  ],
};

/** provingDistributivePropertiesOfTheCartesianProduct distributes × over ∪, ∩ and ∖. */
export const provingDistributivePropertiesOfTheCartesianProduct: TopicDef = {
  id: "proving-distributive-properties-of-the-cartesian-product",
  title: t("Proving Distributive Properties of the Cartesian Product", "证明笛卡儿积的分配律"),
  summary: t(
    "A × (B ∪ C) = (A × B) ∪ (A × C), A × (B ∩ C) = (A × B) ∩ (A × C) and A × (B ∖ C) = (A × B) ∖ (A × C), proved by chasing ordered pairs.",
    "A × (B ∪ C) = (A × B) ∪ (A × C)，A × (B ∩ C) = (A × B) ∩ (A × C)，A × (B ∖ C) = (A × B) ∖ (A × C)，用追踪有序对的方法证明。",
  ),
  prerequisites: ["proving-distributive-properties-of-union-and-intersection", "the-cartesian-product"],
  encompasses: [{ topic: "the-cartesian-product", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-products-of-set-operations",
      title: t("Sizes of products", "积集的元素个数"),
      explanation: t(
        "$|A \\times B| = |A| \\cdot |B|$, so $|A \\times (B \\cup C)| = |A| \\cdot |B \\cup C|$. By the distributive property this is also $|(A \\times B) \\cup (A \\times C)|$.",
        "$|A \\times B| = |A| \\cdot |B|$，所以 $|A \\times (B \\cup C)| = |A| \\cdot |B \\cup C|$。由分配律，它也等于 $|(A \\times B) \\cup (A \\times C)|$。",
      ),
      generate(rng) {
        const { A, B, C } = twoSets(rng);
        const op = rng.pick(["\\cup", "\\cap", "\\setminus"] as const);
        const inner =
          op === "\\cup" ? uniqueSorted([...B, ...C]) : op === "\\cap" ? B.filter((x) => C.includes(x)) : B.filter((x) => !C.includes(x));
        const leftFactor = rng.bool();
        const expr = leftFactor ? `(A \\times B) ${op} (A \\times C)` : `(B \\times A) ${op} (C \\times A)`;
        const answer = A.length * inner.length;
        return numberProblem({
          prompt: t(
            `Let $A = ${setTex(A)}$, $B = ${setTex(B)}$ and $C = ${setTex(C)}$. How many ordered pairs are in $${expr}$?`,
            `设 $A = ${setTex(A)}$，$B = ${setTex(B)}$，$C = ${setTex(C)}$。$${expr}$ 中有多少个有序对？`,
          ),
          answer,
          wrong: [A.length * (B.length + C.length), A.length * B.length, A.length + inner.length],
          solution: t(
            `By the distributive property, $${expr} = ${leftFactor ? `A \\times (B ${op} C)` : `(B ${op} C) \\times A`}$. Since $B ${op} C = ${setTex(inner)}$, it has $${A.length} \\cdot ${inner.length} = ${answer}$ pairs.`,
            `由分配律，$${expr} = ${leftFactor ? `A \\times (B ${op} C)` : `(B ${op} C) \\times A`}$。由于 $B ${op} C = ${setTex(inner)}$，共有 $${A.length} \\cdot ${inner.length} = ${answer}$ 个有序对。`,
          ),
        });
      },
    },
    {
      id: "chasing-ordered-pairs",
      title: t("Chasing ordered pairs", "追踪有序对"),
      explanation: t(
        "Let $(x, y) \\in A \\times (B \\cup C)$. Then $x \\in A$ and ($y \\in B$ or $y \\in C$). So ($x \\in A$ and $y \\in B$) or ($x \\in A$ and $y \\in C$), that is, $(x, y) \\in A \\times B$ or $(x, y) \\in A \\times C$. Hence $(x, y) \\in (A \\times B) \\cup (A \\times C)$.",
        "设 $(x, y) \\in A \\times (B \\cup C)$，则 $x \\in A$ 且（$y \\in B$ 或 $y \\in C$）。于是（$x \\in A$ 且 $y \\in B$）或（$x \\in A$ 且 $y \\in C$），即 $(x, y) \\in A \\times B$ 或 $(x, y) \\in A \\times C$。因此 $(x, y) \\in (A \\times B) \\cup (A \\times C)$。",
      ),
      generate(rng) {
        const [x, y, z] = rng.shuffle(["p", "q", "r", "s"] as const) as [Var, Var, Var];
        const A = names[x];
        const B = names[y];
        const C = names[z];
        const op = rng.pick(["cup", "cap", "minus"] as const);
        const sym = { cup: "\\cup", cap: "\\cap", minus: "\\setminus" }[op];
        const [en, zh] = {
          cup: ["or", "或"],
          cap: ["and", "且"],
          minus: ["and", "且"],
        }[op];
        const second = op === "minus" ? "\\notin" : "\\in";
        const pairIn = (s: string, rel = "\\in") => `(x, y) ${rel} ${A} \\times ${s}`;
        const right = t(`$${pairIn(B)}$ ${en} $${pairIn(C, second)}$`, `$${pairIn(B)}$ ${zh} $${pairIn(C, second)}$`);
        const otherEn = en === "or" ? "and" : "or";
        const otherZh = zh === "或" ? "且" : "或";
        const wrong = [
          t(`$${pairIn(B)}$ ${otherEn} $${pairIn(C, second)}$`, `$${pairIn(B)}$ ${otherZh} $${pairIn(C, second)}$`),
          t(`$x \\in ${A} \\times ${B}$ ${en} $y \\in ${A} \\times ${C}$`, `$x \\in ${A} \\times ${B}$ ${zh} $y \\in ${A} \\times ${C}$`),
          t(
            `$${pairIn(B)}$ ${en} $${pairIn(C, second === "\\in" ? "\\notin" : "\\in")}$`,
            `$${pairIn(B)}$ ${zh} $${pairIn(C, second === "\\in" ? "\\notin" : "\\in")}$`,
          ),
        ];
        const yRel = op === "minus" ? `y \\in ${B}\\text{ and }y \\notin ${C}` : `y \\in ${B}\\text{ ${en} }y \\in ${C}`;
        const yRelZh = op === "minus" ? `y \\in ${B}\\text{ 且 }y \\notin ${C}` : `y \\in ${B}\\text{ ${zh} }y \\in ${C}`;
        return oneOf(
          rng,
          t(
            `Let $(x, y) \\in ${A} \\times (${B} ${sym} ${C})$. Then $x \\in ${A}$ and $(${yRel})$, so ____. Which statement fills the blank?`,
            `设 $(x, y) \\in ${A} \\times (${B} ${sym} ${C})$，则 $x \\in ${A}$ 且 $(${yRelZh})$，所以 ____。空白处应填哪个命题？`,
          ),
          right,
          wrong,
          t(
            `Pair $x \\in ${A}$ with each condition on $y$: ${right.en}. This shows $(x, y) \\in (${A} \\times ${B}) ${sym} (${A} \\times ${C})$.`,
            `把 $x \\in ${A}$ 与关于 $y$ 的每个条件配对：${right["zh-CN"]}。这说明 $(x, y) \\in (${A} \\times ${B}) ${sym} (${A} \\times ${C})$。`,
          ),
        );
      },
    },
  ],
};

/** methodsOfProofSetTopics are the new topics of Methods of Proof unit 2. */
export const methodsOfProofSetTopics: readonly TopicDef[] = [
  theMaximumAndMinimumOfASet,
  powerSets,
  partitionsOfSets,
  indicatorFunctions,
  provingSubsetRelations,
  disjointSets,
  elementaryPropertiesOfSetOperations,
  provingElementaryPropertiesOfSetOperations,
  deMorgansLawsForSets,
  provingDeMorgansLawsForSets,
  distributivePropertiesOfSetOperations,
  provingDistributivePropertiesOfUnionAndIntersection,
  provingDistributivePropertiesOfTheCartesianProduct,
];
