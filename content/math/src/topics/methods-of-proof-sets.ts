import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, why, yesNo } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { domainTex, range, setProblem, setTex, uniqueSorted } from "./methods-of-proof-common.ts";
import {
  and,
  deMorganRewrite,
  type Env,
  evaluate,
  type Formula,
  inequivalentTo,
  mutations,
  not,
  or,
  randomFormula,
  rows,
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

/** capital starts a sentence with a capital letter. */
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** theMaximumAndMinimumOfASet finds the largest and smallest elements of sets. */
export const theMaximumAndMinimumOfASet: TopicDef = {
  id: "the-maximum-and-minimum-of-a-set",
  title: t("The Maximum and Minimum of a Set", "集合的最大值与最小值"),
  summary: t(
    "max S is an element of S at least as large as every element of S; a set need not have one.",
    "max S 是 S 中不小于 S 所有元素的那个元素；集合不一定有最大值。",
  ),
  intro: t(
    "Let $S = \\{x \\in \\mathbb{Z} : 2 \\le x < 11,\\ x \\text{ even}\\}$. Listing its elements gives $2, 4, 6, 8, 10$, so the smallest element is $2$ and the largest is $10$. Notice that the bound $11$ is not the largest element: it fails $x < 11$, and it is odd.\n\nCheck: $10$ is in $S$, and the next even number, $12$, breaks $x < 11$, so nothing in $S$ is larger than $10$.\n\nIn this lesson we find the maximum and minimum of a set, and recognize infinite sets that have no maximum or no minimum.",
    "设 $S = \\{x \\in \\mathbb{Z} : 2 \\le x < 11,\\ x \\text{ 为偶数}\\}$。列出它的元素：$2, 4, 6, 8, 10$，所以最小的元素是 $2$，最大的是 $10$。注意上界 $11$ 不是最大元素：它不满足 $x < 11$，而且是奇数。\n\n检验：$10$ 在 $S$ 中，下一个偶数 $12$ 不满足 $x < 11$，所以 $S$ 中没有比 $10$ 更大的元素。\n\n本课我们求集合的最大值与最小值，并认识没有最大值或没有最小值的无限集。",
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
        'The **maximum** $\\max S$ is the element $m \\in S$ with $s \\le m$ for every $s \\in S$; the **minimum** is defined similarly. Every nonempty finite set of numbers has both. For $S = \\{x \\in \\mathbb{Z} : -4 < x \\le 9,\\ x \\text{ odd}\\}$, $\\min S = -3$ and $\\max S = 9$.\n\n> **Watch out.** The maximum must be an element of the set. A bound written with $<$ is not in the set, and a condition such as "$x$ odd" can rule the bound out too, so the maximum may sit below the number written in the condition.',
        "**最大值** $\\max S$ 是满足对每个 $s \\in S$ 都有 $s \\le m$ 的元素 $m \\in S$；**最小值**类似定义。每个非空有限数集都有最大值和最小值。对 $S = \\{x \\in \\mathbb{Z} : -4 < x \\le 9,\\ x \\text{ 为奇数}\\}$，$\\min S = -3$，$\\max S = 9$。\n\n> **注意。** 最大值必须是集合的元素。用 $<$ 写的界不在集合中，“$x$ 为奇数”这样的条件也可能把界排除在外，所以最大值可能比条件中写的数小。",
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
        const other = askMax ? members[0]! : members[members.length - 1]!;
        const cond = parity === 0 ? "" : parity === 1 ? ",\\ x \\text{ odd}" : ",\\ x \\text{ even}";
        const condZh = parity === 0 ? "" : parity === 1 ? ",\\ x \\text{ 为奇数}" : ",\\ x \\text{ 为偶数}";
        const set = (c: string) => `\\{x \\in \\mathbb{Z} : ${a} ${lowStrict ? "<" : "\\le"} x ${highStrict ? "<" : "\\le"} ${b}${c}\\}`;
        const name = askMax ? "max" : "min";
        const step = parity === 0 ? 1 : 2;
        const next = askMax ? answer + step : answer - step;
        /** outside says why a number is not in S. */
        const outside = (x: number): [string, string] => {
          if (x > hi) return highStrict ? [`it fails $x < ${b}$`, `它不满足 $x < ${b}$`] : [`it is larger than $${b}$`, `它大于 $${b}$`];
          if (x < lo) return lowStrict ? [`it fails $${a} < x$`, `它不满足 $${a} < x$`] : [`it is smaller than $${a}$`, `它小于 $${a}$`];
          return parity === 1 ? ["it is even", "它是偶数"] : ["it is odd", "它是奇数"];
        };
        const bound = askMax ? b : a;
        const near = askMax ? answer + 1 : answer - 1;
        const [nearEn, nearZh] = outside(near);
        const [boundEn, boundZh] = outside(bound);
        const [nextEn, nextZh] = outside(next);
        return numberProblem({
          prompt: t(`Let $S = ${set(cond)}$. Find $\\${name} S$.`, `设 $S = ${set(condZh)}$。求 $\\${name} S$。`),
          answer,
          mistakes: [
            why(
              bound,
              `$${bound}$ is the bound written in the condition, but it is not an element of $S$: ${boundEn}.`,
              `$${bound}$ 是条件中写的界，但它不是 $S$ 的元素：${boundZh}。`,
            ),
            why(
              other,
              `$${other}$ is the ${askMax ? "smallest" : "largest"} element of $S$; the question asks for the ${askMax ? "largest" : "smallest"}.`,
              `$${other}$ 是 $S$ 中${askMax ? "最小" : "最大"}的元素；题目求的是${askMax ? "最大" : "最小"}的。`,
            ),
            why(near, `$${near}$ is not an element of $S$: ${nearEn}.`, `$${near}$ 不是 $S$ 的元素：${nearZh}。`),
          ],
          solution: walked(
            [
              [
                ["List the elements", "列出元素"],
                t(
                  `The integers from $${lo}$ to $${hi}$${parity === 0 ? "" : ` that are ${parity === 1 ? "odd" : "even"}`} are $${members.join(", ")}$.`,
                  `从 $${lo}$ 到 $${hi}$ 的${parity === 0 ? "" : parity === 1 ? "奇" : "偶"}整数${parity === 0 ? "" : "数"}是 $${members.join(", ")}$。`,
                ),
              ],
              [
                ["Read off the extreme", "读出最值"],
                t(
                  `The ${askMax ? "largest" : "smallest"} of them is $${answer}$, so $\\${name} S = ${answer}$.`,
                  `其中${askMax ? "最大" : "最小"}的是 $${answer}$，所以 $\\${name} S = ${answer}$。`,
                ),
              ],
            ],
            t(
              `$${answer}$ satisfies every condition of $S$. The next candidate ${askMax ? "above" : "below"} it, $${next}$, is not in $S$, since ${nextEn}, so no element of $S$ is ${askMax ? "larger" : "smaller"}.`,
              `$${answer}$ 满足 $S$ 的全部条件。它${askMax ? "上方" : "下方"}的下一个候选数 $${next}$ 不在 $S$ 中，因为${nextZh}，所以 $S$ 中没有${askMax ? "更大" : "更小"}的元素。`,
            ),
          ),
        });
      },
    },
    {
      id: "sets-without-a-maximum-or-minimum",
      title: t("Sets without a maximum or minimum", "没有最值的集合"),
      explanation: t(
        "An infinite set may have no maximum or minimum. $(0, 1] = \\{x \\in \\mathbb{R} : 0 < x \\le 1\\}$ has maximum $1$ but no minimum: for any $s$ in the set, $s/2$ is a smaller element. $\\mathbb{Z}$ has neither, while $\\{x \\in \\mathbb{Z} : x > 3\\}$ has minimum $4$ and no maximum.\n\n> **Watch out.** Whether the numbers are integers or reals changes the answer. Over $\\mathbb{Z}$, $x > 3$ starts at the next integer, $4$. Over $\\mathbb{R}$, $x > 3$ has no smallest element at all: $3$ is not in the set, and every element has a smaller one between it and $3$.",
        "无限集可能没有最大值或最小值。$(0, 1] = \\{x \\in \\mathbb{R} : 0 < x \\le 1\\}$ 的最大值为 $1$，但没有最小值：对集合中任意 $s$，$s/2$ 是更小的元素。$\\mathbb{Z}$ 两者都没有，而 $\\{x \\in \\mathbb{Z} : x > 3\\}$ 的最小值为 $4$，没有最大值。\n\n> **注意。** 取整数还是取实数，答案不同。在 $\\mathbb{Z}$ 上，$x > 3$ 从下一个整数 $4$ 开始。在 $\\mathbb{R}$ 上，$x > 3$ 根本没有最小元素：$3$ 不在集合中，而每个元素与 $3$ 之间都还有更小的元素。",
      ),
      generate(rng) {
        const a = rng.int(-9, 9);
        const b = a + rng.int(1, 9);
        const kind = rng.int(0, 3);
        const real = rng.bool();
        const D = real ? "\\mathbb{R}" : "\\mathbb{Z}";
        let around: readonly [number, number] = [a, b];
        let set: string;
        let min: number | null;
        let max: number | null;
        let holds: (x: number) => boolean;
        let low: number | null = a;
        let high: number | null = b;
        if (kind === 0) {
          const ls = rng.bool();
          const hs = rng.bool();
          set = `\\{x \\in ${D} : ${a} ${ls ? "<" : "\\le"} x ${hs ? "<" : "\\le"} ${b}\\}`;
          min = ls ? (real ? null : a + 1) : a;
          max = hs ? (real ? null : b - 1) : b;
          holds = (x) => (ls ? x > a : x >= a) && (hs ? x < b : x <= b);
        } else if (kind === 1) {
          const strict = rng.bool();
          set = `\\{x \\in ${D} : x ${strict ? ">" : "\\ge"} ${a}\\}`;
          min = strict ? (real ? null : a + 1) : a;
          max = null;
          holds = (x) => (strict ? x > a : x >= a);
          high = null;
        } else if (kind === 2) {
          const strict = rng.bool();
          set = `\\{x \\in ${D} : x ${strict ? "<" : "\\le"} ${b}\\}`;
          min = null;
          max = strict ? (real ? null : b - 1) : b;
          holds = (x) => (strict ? x < b : x <= b);
          low = null;
        } else {
          const k = rng.int(1, 9);
          around = [-k, k];
          set = `\\{x \\in ${D} : x^2 < ${k * k}\\}`;
          min = real ? null : -(k - 1);
          max = real ? null : k - 1;
          holds = (x) => x * x < k * k;
          low = -k;
          high = k;
        }
        const empty = min !== null && max !== null && min > max;
        if (empty) [min, max] = [null, null];
        const describe = (lo: number | null, hi: number | null) =>
          t(
            `${lo === null ? "No minimum" : `Minimum $${lo}$`}, ${hi === null ? "no maximum" : `maximum $${hi}$`}`,
            `${lo === null ? "没有最小值" : `最小值 $${lo}$`}，${hi === null ? "没有最大值" : `最大值 $${hi}$`}`,
          );
        const right = describe(min, max);
        const lo0 = min ?? around[0];
        const hi0 = max ?? around[1];
        const wrong: [number | null, number | null][] = [
          [lo0, hi0],
          [null, null],
          [lo0, null],
          [null, hi0],
          [lo0 - 1, hi0 + 1],
        ];
        /** side says what is wrong with a claimed extremum on one side, or nothing if it is right. */
        const side = (claimed: number | null, actual: number | null, isMin: boolean): [string, string] | null => {
          if (claimed === actual) return null;
          const word = isMin ? ["minimum", "最小值", "smaller", "更小"] : ["maximum", "最大值", "larger", "更大"];
          if (empty) return [`The set is empty, so it has no ${word[0]}.`, `这个集合是空集，所以没有${word[1]}。`];
          if (claimed === null)
            return [
              `$${actual}$ is in the set and nothing in it is ${word[2]}, so there is a ${word[0]}.`,
              `$${actual}$ 在集合中，且集合中没有${word[3]}的元素，所以有${word[1]}。`,
            ];
          if (!holds(claimed))
            return [`$${claimed}$ is not in the set, so it cannot be the ${word[0]}.`, `$${claimed}$ 不在集合中，所以不可能是${word[1]}。`];
          return [
            `$${claimed}$ is in the set, but the set has ${word[2]} elements, so it is not the ${word[0]}.`,
            `$${claimed}$ 在集合中，但集合中还有${word[3]}的元素，所以它不是${word[1]}。`,
          ];
        };
        const reasons: Reason[] = wrong.map(([lo, hi]) => {
          const r = side(lo, min, true) ?? side(hi, max, false) ?? ["", ""];
          return [describe(lo, hi).en, r[0], r[1]];
        });
        /** test says what trying values near one end shows. */
        const test = (actual: number | null, end: number | null, isMin: boolean): Text => {
          const dir = isMin ? -1 : 1;
          const near = (e: number, k: number) => Number((e - dir / k).toFixed(2));
          if (actual !== null)
            return t(
              `$x = ${actual}$ is in the set and $x = ${actual + dir}$ is not`,
              `$x = ${actual}$ 在集合中，而 $x = ${actual + dir}$ 不在`,
            );
          if (end === null) {
            const far = (isMin ? b : a) + dir * 1000;
            return t(
              `$x = ${far}$ and $x = ${far + dir}$ are both in the set, and so is every number beyond them`,
              `$x = ${far}$ 与 $x = ${far + dir}$ 都在集合中，更远的数也都在`,
            );
          }
          return t(
            `$x = ${end}$ is not in the set, while $x = ${near(end, 10)}$ and $x = ${near(end, 100)}$ are, ever closer to $${end}$`,
            `$x = ${end}$ 不在集合中，而 $x = ${near(end, 10)}$、$x = ${near(end, 100)}$ 都在，且越来越接近 $${end}$`,
          );
        };
        const minText =
          min === null
            ? t("every element has a smaller element in the set, so there is no minimum", "集合中每个元素都有更小的元素，所以没有最小值")
            : t(`$${min}$ is in the set and no element is smaller`, `$${min}$ 在集合中且没有更小的元素`);
        const maxText =
          max === null
            ? t("every element has a larger element in the set, so there is no maximum", "集合中每个元素都有更大的元素，所以没有最大值")
            : t(`$${max}$ is in the set and no element is larger`, `$${max}$ 在集合中且没有更大的元素`);
        const lowTest = test(min, low, true);
        const highTest = test(max, high, false);
        return reasoned(
          oneOf(
            rng,
            t(`Which describes the extrema of $${set}$?`, `$${set}$ 的最值情况是哪一个？`),
            right,
            wrong.map(([lo, hi]) => describe(lo, hi)),
            empty
              ? walked(
                  [
                    [
                      ["Look for elements", "寻找元素"],
                      t(
                        `No integer lies strictly between $${a}$ and $${b}$, so the set is empty.`,
                        `$${a}$ 与 $${b}$ 之间严格地没有整数，所以集合是空集。`,
                      ),
                    ],
                    [
                      ["Conclude", "得出结论"],
                      t(
                        "A maximum or minimum must be an element of the set, so the empty set has neither.",
                        "最大值与最小值都必须是集合的元素，所以空集两者都没有。",
                      ),
                    ],
                  ],
                  t(`$x = ${a}$ and $x = ${b}$ both fail a strict inequality.`, `$x = ${a}$ 与 $x = ${b}$ 都不满足严格不等式。`),
                )
              : walked(
                  [
                    [["The bottom of the set", "集合的下端"], t(`${capital(minText.en)}.`, `${minText["zh-CN"]}。`)],
                    [["The top of the set", "集合的上端"], t(`${capital(maxText.en)}.`, `${maxText["zh-CN"]}。`)],
                  ],
                  t(`At the bottom, ${lowTest.en}. At the top, ${highTest.en}.`, `下端：${lowTest["zh-CN"]}。上端：${highTest["zh-CN"]}。`),
                ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** letterSet picks n distinct letters for a set's elements. */
const letterSet = (rng: Rng, n: number) => rng.shuffle(["a", "b", "c", "d", "e", "f", "g", "h"]).slice(0, n).sort();

/** brace writes a set of letters or numbers. */
const brace = (xs: readonly (string | number)[]) => (xs.length === 0 ? "\\varnothing" : `\\{${xs.join(", ")}\\}`);

/** binom is the number of k-element subsets of an n-element set. */
const binom = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
};

/** bySize writes 2^n as the sum of the numbers of subsets of each size. */
const bySize = (n: number) =>
  range(0, n)
    .map((k) => binom(n, k))
    .join(" + ");

/** powerSets counts and recognizes subsets. */
export const powerSets: TopicDef = {
  id: "power-sets",
  title: t("Power Sets", "幂集"),
  summary: t(
    "The power set P(A) is the set of all subsets of A; a set with n elements has 2ⁿ subsets.",
    "幂集 P(A) 是 A 的所有子集组成的集合；含 n 个元素的集合有 2ⁿ 个子集。",
  ),
  intro: t(
    "The subsets of $A = \\{a, b\\}$ are $\\varnothing$, $\\{a\\}$, $\\{b\\}$ and $\\{a, b\\}$. Collected into one set, they form the **power set** $\\mathcal{P}(A) = \\{\\varnothing, \\{a\\}, \\{b\\}, \\{a, b\\}\\}$, which has $4$ elements.\n\nCheck: building a subset means deciding, for each of the $2$ elements of $A$, whether it goes in or stays out. That is $2 \\cdot 2 = 4$ choices, one for each subset listed.\n\nIn this lesson we count the elements of a power set and tell which sets are its elements.",
    "$A = \\{a, b\\}$ 的子集是 $\\varnothing$、$\\{a\\}$、$\\{b\\}$ 和 $\\{a, b\\}$。把它们收成一个集合，就得到**幂集** $\\mathcal{P}(A) = \\{\\varnothing, \\{a\\}, \\{b\\}, \\{a, b\\}\\}$，它有 $4$ 个元素。\n\n检验：构造一个子集，就是对 $A$ 的 $2$ 个元素逐个决定放进去还是不放。共 $2 \\cdot 2 = 4$ 种选法，恰好对应列出的每个子集。\n\n本课我们计算幂集的元素个数，并判断哪些集合是幂集的元素。",
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
        "The **power set** $\\mathcal{P}(A)$ contains every subset of $A$, including $\\varnothing$ and $A$ itself. Each element of $A$ is either in a subset or not, so $|\\mathcal{P}(A)| = 2^{|A|}$. For $A = \\{1, 2, 3\\}$, $|\\mathcal{P}(A)| = 8$.\n\n> **Watch out.** Count $\\varnothing$ and $A$ too: the answer is $2^{n}$, not $2^{n} - 1$, and not $2n$. For $\\mathcal{P}(\\mathcal{P}(A))$ apply the rule twice, the second time to the $2^{n}$ elements of $\\mathcal{P}(A)$.",
        "**幂集** $\\mathcal{P}(A)$ 包含 $A$ 的所有子集，包括 $\\varnothing$ 与 $A$ 本身。$A$ 的每个元素要么在子集中，要么不在，所以 $|\\mathcal{P}(A)| = 2^{|A|}$。若 $A = \\{1, 2, 3\\}$，则 $|\\mathcal{P}(A)| = 8$。\n\n> **注意。** $\\varnothing$ 和 $A$ 也要算上：答案是 $2^{n}$，不是 $2^{n} - 1$，也不是 $2n$。求 $\\mathcal{P}(\\mathcal{P}(A))$ 时要用两次这个规则，第二次作用于 $\\mathcal{P}(A)$ 的 $2^{n}$ 个元素。",
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
            mistakes: [
              why(
                2 * n,
                `That is $2 \\cdot ${n}$; each of the $${n}$ elements doubles the count, which gives $2^{${n}}$.`,
                `这是 $2 \\cdot ${n}$；$${n}$ 个元素中每一个都使个数翻倍，应得 $2^{${n}}$。`,
              ),
              why(
                n ** 2,
                `That is $${n}^2$; the count is $2^{${n}}$, with $2$ as the base.`,
                `这是 $${n}^2$；个数是 $2^{${n}}$，底数是 $2$。`,
              ),
              why(
                2 ** n - 1,
                "That leaves out one subset: the empty set and $A$ itself both count.",
                "这漏掉了一个子集：空集和 $A$ 本身都要算。",
              ),
              why(n, `That is the number of elements of $A$, not the number of its subsets.`, `这是 $A$ 的元素个数，不是子集的个数。`),
            ],
            solution: walked(
              [
                [["Count the elements of A", "数出 A 的元素"], t(`$A$ has $${n}$ element${n === 1 ? "" : "s"}.`, `$A$ 有 $${n}$ 个元素。`)],
                [
                  ["Count the subsets", "计算子集个数"],
                  t(
                    `Each element is either in a subset or not, so $|\\mathcal{P}(A)| = 2^{${n}} = ${2 ** n}$.`,
                    `每个元素要么在子集中，要么不在，所以 $|\\mathcal{P}(A)| = 2^{${n}} = ${2 ** n}$。`,
                  ),
                ],
              ],
              n === 0
                ? t(
                    "The empty set has exactly one subset, itself, so $\\mathcal{P}(\\varnothing) = \\{\\varnothing\\}$ has $1$ element, and $2^{0} = 1$.",
                    "空集恰有一个子集，即它本身，所以 $\\mathcal{P}(\\varnothing) = \\{\\varnothing\\}$ 有 $1$ 个元素，而 $2^{0} = 1$。",
                  )
                : t(
                    `Count the subsets by size instead, from $0$ elements up to $${n}$: $${bySize(n)} = ${2 ** n}$.`,
                    `改为按子集的大小来数，从 $0$ 个元素到 $${n}$ 个元素：$${bySize(n)} = ${2 ** n}$。`,
                  ),
            ),
          });
        }
        if (kind === 1) {
          const n = rng.int(2, 7);
          const k = rng.int(1, n - 1);
          const c = binom(n, k);
          return numberProblem({
            prompt: t(
              `A set $A$ has $${n}$ elements. How many elements of $\\mathcal{P}(A)$ have exactly $${k}$ element${k === 1 ? "" : "s"}?`,
              `集合 $A$ 有 $${n}$ 个元素。$\\mathcal{P}(A)$ 中恰有 $${k}$ 个元素的成员有多少个？`,
            ),
            answer: c,
            mistakes: [
              why(
                2 ** n,
                `That counts every subset, of every size; only the subsets with $${k}$ element${k === 1 ? "" : "s"} are asked for.`,
                `这数的是所有大小的子集；题目只问恰有 $${k}$ 个元素的子集。`,
              ),
              why(
                2 ** k,
                `$2^{${k}}$ counts the subsets of a $${k}$-element set, not the $${k}$-element subsets of a $${n}$-element set.`,
                `$2^{${k}}$ 是 $${k}$ 元集合的子集个数，不是 $${n}$ 元集合的 $${k}$ 元子集个数。`,
              ),
              why(
                n * k,
                `That multiplies $${n}$ by $${k}$; choosing $${k}$ of $${n}$ elements is counted by $\\binom{${n}}{${k}}$.`,
                `这是把 $${n}$ 乘以 $${k}$；从 $${n}$ 个元素中选 $${k}$ 个，个数是 $\\binom{${n}}{${k}}$。`,
              ),
            ],
            solution: walked(
              [
                [
                  ["Describe the subsets", "描述这些子集"],
                  t(
                    `A subset with $${k}$ element${k === 1 ? "" : "s"} is a choice of $${k}$ of the $${n}$ elements, in no order.`,
                    `含 $${k}$ 个元素的子集，就是从 $${n}$ 个元素中不计顺序地选出 $${k}$ 个。`,
                  ),
                ],
                [
                  ["Count the choices", "计算选法"],
                  t(
                    `$\\binom{${n}}{${k}} = \\dfrac{${n}!}{${k}!\\,${n - k}!} = ${c}$.`,
                    `$\\binom{${n}}{${k}} = \\dfrac{${n}!}{${k}!\\,${n - k}!} = ${c}$。`,
                  ),
                ],
              ],
              t(
                `Choose instead the $${n - k}$ element${n - k === 1 ? "" : "s"} to leave out: $\\binom{${n}}{${n - k}} = ${binom(n, n - k)}$, the same number.`,
                `改为选出不放进去的 $${n - k}$ 个元素：$\\binom{${n}}{${n - k}} = ${binom(n, n - k)}$，个数相同。`,
              ),
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
          mistakes: [
            why(
              inner,
              `That is $|\\mathcal{P}(A)|$; the power set has to be taken a second time.`,
              `这是 $|\\mathcal{P}(A)|$；还要再取一次幂集。`,
            ),
            why(
              2 * inner,
              `That doubles $|\\mathcal{P}(A)| = ${inner}$; the count of subsets is $2^{${inner}}$, not $2 \\cdot ${inner}$.`,
              `这是把 $|\\mathcal{P}(A)| = ${inner}$ 翻倍；子集个数是 $2^{${inner}}$，不是 $2 \\cdot ${inner}$。`,
            ),
            why(
              inner ** 2,
              `That squares $${inner}$; the count of subsets is $2^{${inner}}$.`,
              `这是把 $${inner}$ 平方；子集个数是 $2^{${inner}}$。`,
            ),
          ],
          solution: walked(
            [
              [
                ["The first power set", "第一次取幂集"],
                t(
                  `$|A| = ${n}$, so $|\\mathcal{P}(A)| = 2^{${n}} = ${inner}$.`,
                  `$|A| = ${n}$，所以 $|\\mathcal{P}(A)| = 2^{${n}} = ${inner}$。`,
                ),
              ],
              [
                ["The second power set", "第二次取幂集"],
                t(
                  `$\\mathcal{P}(A)$ is a set with $${inner}$ elements, so $|\\mathcal{P}(\\mathcal{P}(A))| = 2^{${inner}} = ${2 ** inner}$.`,
                  `$\\mathcal{P}(A)$ 是含 $${inner}$ 个元素的集合，所以 $|\\mathcal{P}(\\mathcal{P}(A))| = 2^{${inner}} = ${2 ** inner}$。`,
                ),
              ],
            ],
            n === 1
              ? t(
                  "$\\mathcal{P}(A) = \\{\\varnothing, \\{1\\}\\}$, and its subsets are $\\varnothing$, $\\{\\varnothing\\}$, $\\{\\{1\\}\\}$ and $\\{\\varnothing, \\{1\\}\\}$: $4$ of them.",
                  "$\\mathcal{P}(A) = \\{\\varnothing, \\{1\\}\\}$，它的子集是 $\\varnothing$、$\\{\\varnothing\\}$、$\\{\\{1\\}\\}$ 和 $\\{\\varnothing, \\{1\\}\\}$，共 $4$ 个。",
                )
              : t(
                  `Count the subsets of $\\mathcal{P}(A)$ by size instead: $${bySize(inner)} = ${2 ** inner}$.`,
                  `改为按大小数 $\\mathcal{P}(A)$ 的子集：$${bySize(inner)} = ${2 ** inner}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "elements-of-a-power-set",
      title: t("Elements of a power set", "幂集的元素"),
      explanation: t(
        "The elements of $\\mathcal{P}(A)$ are sets. If $A = \\{a, b, c\\}$, then $\\{a, c\\} \\in \\mathcal{P}(A)$ and $\\varnothing \\in \\mathcal{P}(A)$, but $a \\notin \\mathcal{P}(A)$: $a$ is an element of $A$, not a subset. Instead $\\{a\\} \\in \\mathcal{P}(A)$.\n\n> **Watch out.** $X \\in \\mathcal{P}(A)$ means $X \\subseteq A$, so test whether every element of $X$ is an element of $A$. A bare letter is not a set of letters, and $\\{\\{a\\}\\}$ is not a subset of $A$: its one element is the set $\\{a\\}$, not the letter $a$.",
        "$\\mathcal{P}(A)$ 的元素是集合。若 $A = \\{a, b, c\\}$，则 $\\{a, c\\} \\in \\mathcal{P}(A)$，$\\varnothing \\in \\mathcal{P}(A)$，但 $a \\notin \\mathcal{P}(A)$：$a$ 是 $A$ 的元素而不是子集。应写作 $\\{a\\} \\in \\mathcal{P}(A)$。\n\n> **注意。** $X \\in \\mathcal{P}(A)$ 的意思是 $X \\subseteq A$，所以要检验 $X$ 的每个元素是否都是 $A$ 的元素。单个字母不是由字母组成的集合；$\\{\\{a\\}\\}$ 也不是 $A$ 的子集：它唯一的元素是集合 $\\{a\\}$，而不是字母 $a$。",
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
        const one = rng.pick(a);
        const letter = rng.pick(a);
        const A = brace(a);
        /** Candidate is a possible element of P(A), with what testing it shows. */
        type Candidate = { readonly s: string; readonly isIn: boolean; readonly en: string; readonly zh: string };
        const ins: Candidate[] = [
          {
            s: brace(sub),
            isIn: true,
            en: `Each of its elements, $${sub.join(", ")}$, is in $A$, so it is a subset of $A$.`,
            zh: `它的每个元素 $${sub.join(", ")}$ 都在 $A$ 中，所以它是 $A$ 的子集。`,
          },
          {
            s: "\\varnothing",
            isIn: true,
            en: "The empty set has no element that could fail to be in $A$, so it is a subset of $A$.",
            zh: "空集没有不在 $A$ 中的元素，所以它是 $A$ 的子集。",
          },
          { s: A, isIn: true, en: "Every set is a subset of itself.", zh: "每个集合都是它自身的子集。" },
          {
            s: brace([one]),
            isIn: true,
            en: `Its one element, $${one}$, is in $A$, so it is a subset of $A$.`,
            zh: `它唯一的元素 $${one}$ 在 $A$ 中，所以它是 $A$ 的子集。`,
          },
        ];
        const outs: Candidate[] = [
          {
            s: letter,
            isIn: false,
            en: `$${letter}$ is an element of $A$, not a subset of it; the subset is $\\{${letter}\\}$.`,
            zh: `$${letter}$ 是 $A$ 的元素，不是子集；对应的子集是 $\\{${letter}\\}$。`,
          },
          {
            s: brace([...sub, outside].sort()),
            isIn: false,
            en: `It contains $${outside}$, which is not in $A$, so it is not a subset of $A$.`,
            zh: `它含有 $${outside}$，而 $${outside}$ 不在 $A$ 中，所以它不是 $A$ 的子集。`,
          },
          {
            s: `\\{${brace(sub)}\\}`,
            isIn: false,
            en: `Its one element is the set $${brace(sub)}$, which is not one of the letters of $A$, so it is not a subset of $A$.`,
            zh: `它唯一的元素是集合 $${brace(sub)}$，不是 $A$ 中的某个字母，所以它不是 $A$ 的子集。`,
          },
          {
            s: brace([outside]),
            isIn: false,
            en: `Its one element, $${outside}$, is not in $A$, so it is not a subset of $A$.`,
            zh: `它唯一的元素 $${outside}$ 不在 $A$ 中，所以它不是 $A$ 的子集。`,
          },
        ];
        const askIn = rng.bool();
        const right = askIn ? rng.pick(ins) : rng.pick(outs);
        const wrong = askIn ? rng.shuffle(outs).slice(0, 3) : rng.shuffle(ins).slice(0, 3);
        const opt = (c: Candidate) => t(`$${c.s}$`, `$${c.s}$`);
        return reasoned(
          oneOf(
            rng,
            askIn
              ? t(`Let $A = ${A}$. Which is an element of $\\mathcal{P}(A)$?`, `设 $A = ${A}$。哪个是 $\\mathcal{P}(A)$ 的元素？`)
              : t(`Let $A = ${A}$. Which is not an element of $\\mathcal{P}(A)$?`, `设 $A = ${A}$。哪个不是 $\\mathcal{P}(A)$ 的元素？`),
            opt(right),
            wrong.map(opt),
            walked(
              [
                [
                  ["Restate the question", "改写问题"],
                  t(
                    `$X \\in \\mathcal{P}(A)$ means $X \\subseteq A$: $X$ is a set and each of its elements is one of $${a.join(", ")}$.`,
                    `$X \\in \\mathcal{P}(A)$ 的意思是 $X \\subseteq A$：$X$ 是集合，且它的每个元素都是 $${a.join(", ")}$ 之一。`,
                  ),
                ],
                [
                  ["Test the options", "检验选项"],
                  t(
                    `$${right.s}$ ${right.isIn ? "passes" : "fails"} this test, while each other option ${right.isIn ? "fails" : "passes"} it.`,
                    `$${right.s}$ ${right.isIn ? "通过" : "通不过"}这一检验，而其他选项都${right.isIn ? "通不过" : "能通过"}。`,
                  ),
                ],
              ],
              t(right.en, right.zh),
            ),
          ),
          [...ins, ...outs].map((c): Reason => [opt(c).en, c.en, c.zh]),
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
  intro: t(
    "Sort $\\{1, 2, 3, 4, 5, 6\\}$ by remainder on division by $3$: $\\{3, 6\\}$ have remainder $0$, $\\{1, 4\\}$ remainder $1$ and $\\{2, 5\\}$ remainder $2$. Each number lands in exactly one group, and no group is empty, so the three groups form a **partition** of the set.\n\nCheck: the group sizes add up to $2 + 2 + 2 = 6$, the size of the whole set, and no number was written twice.\n\nIn this lesson we test whether a collection of sets is a partition, and build partitions by remainder.",
    "把 $\\{1, 2, 3, 4, 5, 6\\}$ 按除以 $3$ 的余数分组：$\\{3, 6\\}$ 余 $0$，$\\{1, 4\\}$ 余 $1$，$\\{2, 5\\}$ 余 $2$。每个数恰好落在一组中，且没有空组，所以这三组构成该集合的一个**划分**。\n\n检验：各组大小之和 $2 + 2 + 2 = 6$，正是整个集合的大小，且没有数被写了两次。\n\n本课我们判断一族集合是否为划分，并按余数构造划分。",
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
        "A collection of subsets of $A$ is a **partition** when (1) no block is empty, (2) no two blocks share an element, and (3) every element of $A$ lies in some block. $\\{\\{1, 4\\}, \\{2\\}, \\{3, 5\\}\\}$ partitions $\\{1, 2, 3, 4, 5\\}$; $\\{\\{1, 4\\}, \\{2, 4\\}, \\{3, 5\\}\\}$ does not, since $4$ is in two blocks.\n\n> **Watch out.** All three conditions must hold. Blocks that cover the set can still overlap, blocks that do not overlap can still miss an element, and an empty block spoils a partition even when the rest is fine.",
        "$A$ 的一族子集若满足：(1) 没有空块，(2) 任意两块没有公共元素，(3) $A$ 的每个元素都在某一块中，则称为**划分**。$\\{\\{1, 4\\}, \\{2\\}, \\{3, 5\\}\\}$ 是 $\\{1, 2, 3, 4, 5\\}$ 的划分；$\\{\\{1, 4\\}, \\{2, 4\\}, \\{3, 5\\}\\}$ 不是，因为 $4$ 在两块中。\n\n> **注意。** 三个条件必须同时成立。覆盖了整个集合的块仍可能重叠，不重叠的块仍可能漏掉元素，而一个空块即使其余都没问题，也会使它不是划分。",
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
        let verdict: Text;
        let found: Text;
        if (flaw === 1) {
          const donor = blocks.find((b) => b.length > 1) ?? blocks[0]!;
          const x = donor[0]!;
          const target = blocks.find((b) => b !== donor)!;
          target.push(x);
          target.sort((p, q) => p - q);
          verdict = t(
            `No: the blocks of a partition must be pairwise disjoint, but $${x}$ lies in two blocks.`,
            `不是：划分的各块必须两两不交，但 $${x}$ 同时在两块中。`,
          );
          found = t(`$${x}$ appears in two blocks, so condition (2) fails.`, `$${x}$ 出现在两块中，所以条件 (2) 不成立。`);
        } else if (flaw === 2) {
          const b = blocks.find((bl) => bl.length > 1) ?? blocks[0]!;
          const x = b.pop()!;
          if (b.length === 0) blocks.splice(blocks.indexOf(b), 1);
          verdict = t(
            `No: the blocks of a partition must cover the whole set, but $${x}$ is in no block.`,
            `不是：划分的各块必须覆盖整个集合，但 $${x}$ 不在任何一块中。`,
          );
          found = t(`$${x}$ is in no block, so condition (3) fails.`, `$${x}$ 不在任何一块中，所以条件 (3) 不成立。`);
        } else if (flaw === 3) {
          blocks.push([]);
          verdict = t("No: a partition cannot contain the empty set.", "不是：划分中不能含有空集。");
          found = t("One block is $\\varnothing$, so condition (1) fails.", "有一块是 $\\varnothing$，所以条件 (1) 不成立。");
        } else {
          verdict = t(
            "Yes: the blocks are nonempty, pairwise disjoint, and cover every element.",
            "是：各块非空、两两不交，且覆盖所有元素。",
          );
          found = t(
            `No block is empty, no number appears twice, and each of $1, \\dots, ${n}$ appears.`,
            `没有空块，没有数出现两次，且 $1, \\dots, ${n}$ 每个都出现了。`,
          );
        }
        const sizes = blocks.map((b) => b.length);
        const total = sizes.reduce((s, x) => s + x, 0);
        const shown = rng.shuffle(blocks).map(brace).join(", ");
        const set = brace(range(1, n));
        return reasoned(
          oneOf(
            rng,
            t(`Is $\\{${shown}\\}$ a partition of $${set}$?`, `$\\{${shown}\\}$ 是 $${set}$ 的划分吗？`),
            yesNo[flaw === 0 ? 0 : 1]!,
            [yesNo[flaw === 0 ? 1 : 0]!],
            walked(
              [
                [
                  ["Recall the conditions", "回顾条件"],
                  t(
                    "A partition needs (1) no empty block, (2) no element in two blocks, and (3) every element in some block.",
                    "划分要求 (1) 没有空块，(2) 没有元素在两块中，(3) 每个元素都在某一块中。",
                  ),
                ],
                [["Test them", "逐条检验"], found],
                [["Decide", "作出判断"], verdict],
              ],
              flaw === 3
                ? t(
                    `The block sizes add up to $${sizes.join(" + ")} = ${total}$, matching the $${n}$ elements, yet one of the sizes is $0$: matching sizes do not excuse an empty block.`,
                    `各块大小之和为 $${sizes.join(" + ")} = ${total}$，与 $${n}$ 个元素相符，但其中一个大小为 $0$：大小相符并不能弥补空块。`,
                  )
                : t(
                    `The block sizes add up to $${sizes.join(" + ")} = ${total}$, while the set has $${n}$ elements${total > n ? ", so some element is counted twice" : total < n ? ", so some element is missing" : ", as they must for a partition"}.`,
                    `各块大小之和为 $${sizes.join(" + ")} = ${total}$，而集合有 $${n}$ 个元素${total > n ? "，所以有元素被数了两次" : total < n ? "，所以有元素被漏掉" : "，正符合划分的要求"}。`,
                  ),
            ),
          ),
          [
            ["Yes", found.en, found["zh-CN"]],
            ["No", "All three conditions hold, so the collection is a partition.", "三个条件都成立，所以这族集合是划分。"],
          ],
        );
      },
    },
    {
      id: "partitions-by-remainder",
      title: t("Partitions by remainder", "按余数划分"),
      explanation: t(
        "Grouping the elements of $\\{1, 2, \\dots, n\\}$ by their remainder on division by $k$ gives a partition with $k$ blocks (if $n \\ge k$). Dividing by $3$, $\\{1, \\dots, 10\\}$ splits into $\\{3, 6, 9\\}$, $\\{1, 4, 7, 10\\}$ and $\\{2, 5, 8\\}$.\n\n> **Watch out.** The block of $m$ holds every number with the same remainder as $m$, including those smaller than $m$. Start from the smallest one and step by $k$ up to $n$.",
        "把 $\\{1, 2, \\dots, n\\}$ 的元素按除以 $k$ 的余数分组，得到含 $k$ 块的划分（当 $n \\ge k$ 时）。按除以 $3$ 分组，$\\{1, \\dots, 10\\}$ 分为 $\\{3, 6, 9\\}$、$\\{1, 4, 7, 10\\}$ 和 $\\{2, 5, 8\\}$。\n\n> **注意。** $m$ 所在的块包含所有与 $m$ 余数相同的数，也包括比 $m$ 小的数。从最小的那个开始，每次加 $k$，直到 $n$。",
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        const n = rng.int(10, 20);
        const m = rng.int(1, n);
        const r = m % k;
        const block = range(1, n).filter((x) => x % k === r);
        const nextBlock = range(1, n).filter((x) => x % k === (m + 1) % k);
        const last = block[block.length - 1]!;
        return setProblem({
          prompt: t(
            `Partition $\\{1, 2, \\dots, ${n}\\}$ by remainder on division by $${k}$. Which block contains $${m}$?`,
            `把 $\\{1, 2, \\dots, ${n}\\}$ 按除以 $${k}$ 的余数划分。哪一块包含 $${m}$？`,
          ),
          values: block,
          mistakes: [
            [
              nextBlock,
              `That block does not contain $${m}$: it holds the numbers with remainder $${(m + 1) % k}$.`,
              `这一块不含 $${m}$：它收的是余数为 $${(m + 1) % k}$ 的数。`,
            ],
            [
              block.filter((x) => x >= m),
              `That leaves out the numbers below $${m}$ with the same remainder, such as $${block[0]}$.`,
              `这漏掉了比 $${m}$ 小、余数相同的数，例如 $${block[0]}$。`,
            ],
          ],
          solution: walked(
            [
              [
                ["Find the remainder", "求余数"],
                t(
                  `$${m} = ${k} \\cdot ${Math.floor(m / k)} + ${r}$, so $${m}$ leaves remainder $${r}$.`,
                  `$${m} = ${k} \\cdot ${Math.floor(m / k)} + ${r}$，所以 $${m}$ 除以 $${k}$ 余 $${r}$。`,
                ),
              ],
              [
                ["Collect the block", "收集这一块"],
                t(
                  `The numbers up to $${n}$ with remainder $${r}$ start at $${block[0]}$ and go up by $${k}$: $${setTex(block)}$.`,
                  `不超过 $${n}$ 且余数为 $${r}$ 的数从 $${block[0]}$ 开始，每次加 $${k}$：$${setTex(block)}$。`,
                ),
              ],
            ],
            t(
              `$${m}$ is in the list, $${block[0]} - ${k} = ${block[0]! - k}$ is below $1$, and $${last} + ${k} = ${last + k}$ is above $${n}$, so no number with remainder $${r}$ is missing.`,
              `$${m}$ 在列表中，$${block[0]} - ${k} = ${block[0]! - k}$ 小于 $1$，$${last} + ${k} = ${last + k}$ 大于 $${n}$，所以没有漏掉余数为 $${r}$ 的数。`,
            ),
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
    "The indicator function $\\mathbf{1}_A(x)$ is $1$ when $x \\in A$ and $0$ otherwise; set operations become arithmetic on indicators.",
    "示性函数 $\\mathbf{1}_A(x)$ 在 $x \\in A$ 时为 $1$，否则为 $0$；集合运算对应示性函数的算术运算。",
  ),
  intro: t(
    "Let $A = \\{2, 4, 6\\}$ inside $U = \\{1, 2, \\dots, 6\\}$. The **indicator function** $\\mathbf{1}_A$ records membership as a number: at $x = 1, 2, 3, 4, 5, 6$ it takes the values $0, 1, 0, 1, 0, 1$. Adding these values gives $3$, the number of elements of $A$.\n\nCheck: $1 - \\mathbf{1}_A$ takes the values $1, 0, 1, 0, 1, 0$, which add up to $3 = |A^{c}|$, and $3 + 3 = 6 = |U|$.\n\nIn this lesson we count with sums of indicators and write the indicators of unions, intersections and complements.",
    "设 $A = \\{2, 4, 6\\}$，全集 $U = \\{1, 2, \\dots, 6\\}$。**示性函数** $\\mathbf{1}_A$ 用数记录是否属于 $A$：在 $x = 1, 2, 3, 4, 5, 6$ 处，它依次取 $0, 1, 0, 1, 0, 1$。把这些值相加得 $3$，正是 $A$ 的元素个数。\n\n检验：$1 - \\mathbf{1}_A$ 依次取 $1, 0, 1, 0, 1, 0$，和为 $3 = |A^{c}|$，而 $3 + 3 = 6 = |U|$。\n\n本课我们用示性函数的和来计数，并写出并集、交集与补集的示性函数。",
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
        "$\\mathbf{1}_A(x) = 1$ if $x \\in A$ and $0$ if $x \\notin A$. Summing an indicator counts elements: $\\sum_{x=1}^{n} \\mathbf{1}_A(x) = |A \\cap \\{1, \\dots, n\\}|$. If $A$ is the set of multiples of $3$, $\\sum_{x=1}^{20} \\mathbf{1}_A(x) = 6$.\n\n> **Watch out.** First decide which set the summand is the indicator of. $\\mathbf{1}_A \\mathbf{1}_B$ is $1$ only on $A \\cap B$; for multiples of $k$ and $m$ that means the multiples of $\\operatorname{lcm}(k, m)$, which is $k \\cdot m$ only when $k$ and $m$ share no factor. $1 - \\mathbf{1}_A$ counts the numbers outside $A$.",
        "$\\mathbf{1}_A(x)$ 在 $x \\in A$ 时为 $1$，在 $x \\notin A$ 时为 $0$。对示性函数求和就是计数：$\\sum_{x=1}^{n} \\mathbf{1}_A(x) = |A \\cap \\{1, \\dots, n\\}|$。若 $A$ 是 $3$ 的倍数组成的集合，则 $\\sum_{x=1}^{20} \\mathbf{1}_A(x) = 6$。\n\n> **注意。** 先判断求和项是哪个集合的示性函数。$\\mathbf{1}_A \\mathbf{1}_B$ 只在 $A \\cap B$ 上为 $1$；对 $k$ 的倍数与 $m$ 的倍数而言，就是 $\\operatorname{lcm}(k, m)$ 的倍数，只有当 $k$ 与 $m$ 没有公因数时它才等于 $k \\cdot m$。$1 - \\mathbf{1}_A$ 数的是 $A$ 以外的数。",
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
        const lcm = range(1, k * m).find((x) => inA(x) && inB(x))!;
        const inAcount = Math.floor(n / k);
        const meaning = [
          t("$A$", "$A$"),
          t(
            `$A \\cap B$, the multiples of $\\operatorname{lcm}(${k}, ${m}) = ${lcm}$`,
            `$A \\cap B$（即 $\\operatorname{lcm}(${k}, ${m}) = ${lcm}$ 的倍数）`,
          ),
          t("$A^{c}$", "$A^{c}$"),
        ][kind]!;
        const counted = [t("$A$", "$A$"), t("$A \\cap B$", "$A \\cap B$"), t("$A^{c}$", "$A^{c}$")][kind]!;
        const step = kind === 1 ? lcm : k;
        const q = Math.floor(n / step);
        const count = [
          t(
            `The multiples of $${k}$ up to $${n}$ number $\\lfloor ${n}/${k} \\rfloor = ${total}$.`,
            `不超过 $${n}$ 的 $${k}$ 的倍数有 $\\lfloor ${n}/${k} \\rfloor = ${total}$ 个。`,
          ),
          t(
            `The multiples of $${lcm}$ up to $${n}$ number $\\lfloor ${n}/${lcm} \\rfloor = ${total}$.`,
            `不超过 $${n}$ 的 $${lcm}$ 的倍数有 $\\lfloor ${n}/${lcm} \\rfloor = ${total}$ 个。`,
          ),
          t(
            `$A$ has $\\lfloor ${n}/${k} \\rfloor = ${inAcount}$ elements up to $${n}$, so $A^{c}$ has $${n} - ${inAcount} = ${total}$.`,
            `不超过 $${n}$ 时 $A$ 有 $\\lfloor ${n}/${k} \\rfloor = ${inAcount}$ 个元素，所以 $A^{c}$ 有 $${n} - ${inAcount} = ${total}$ 个。`,
          ),
        ][kind]!;
        const check =
          kind === 2
            ? t(
                `Each $x$ makes exactly one of $\\mathbf{1}_A(x)$ and $1 - \\mathbf{1}_A(x)$ equal to $1$, so the two sums must add up to $${n}$: $${inAcount} + ${total} = ${n}$.`,
                `每个 $x$ 恰使 $\\mathbf{1}_A(x)$ 与 $1 - \\mathbf{1}_A(x)$ 中的一个等于 $1$，所以两个和相加应为 $${n}$：$${inAcount} + ${total} = ${n}$。`,
              )
            : q === 0
              ? t(
                  `The first multiple of $${step}$ is $${step}$ itself, already beyond $${n}$, so nothing is counted.`,
                  `$${step}$ 的第一个倍数就是 $${step}$ 本身，已超过 $${n}$，所以一个也不计。`,
                )
              : t(
                  `The multiples counted are $${step}, ${2 * step}, \\dots, ${q * step}$, which is $${q}$ of them, and the next one, $${(q + 1) * step}$, is beyond $${n}$.`,
                  `计入的倍数是 $${step}, ${2 * step}, \\dots, ${q * step}$，共 $${q}$ 个；下一个 $${(q + 1) * step}$ 已超过 $${n}$。`,
                );
        return numberProblem({
          prompt: t(
            `Let $A$ be the set of multiples of $${k}$${kind === 1 ? ` and $B$ the set of multiples of $${m}$` : ""}. Compute $\\sum_{x=1}^{${n}} ${expr}$.`,
            `设 $A$ 为 $${k}$ 的倍数组成的集合${kind === 1 ? `，$B$ 为 $${m}$ 的倍数组成的集合` : ""}。计算 $\\sum_{x=1}^{${n}} ${expr}$。`,
          ),
          answer: total,
          mistakes: [
            why(
              inAcount,
              "That counts the elements of $A$, but the summand is not the indicator of $A$.",
              "这数的是 $A$ 的元素，但求和项不是 $A$ 的示性函数。",
            ),
            kind === 1
              ? why(
                  Math.floor(n / (k * m)),
                  `That counts multiples of $${k} \\cdot ${m} = ${k * m}$; the common multiples of $${k}$ and $${m}$ are the multiples of $${lcm}$.`,
                  `这数的是 $${k} \\cdot ${m} = ${k * m}$ 的倍数；$${k}$ 与 $${m}$ 的公倍数是 $${lcm}$ 的倍数。`,
                )
              : why(
                  n - inAcount,
                  "That counts the numbers outside $A$, but the summand is not the indicator of $A^{c}$.",
                  "这数的是 $A$ 以外的数，但求和项不是 $A^{c}$ 的示性函数。",
                ),
          ],
          solution: walked(
            [
              [
                ["Name the set", "说出集合"],
                t(
                  `The summand is the indicator of ${meaning.en}, so the sum counts the elements of ${counted.en} among $1, \\dots, ${n}$.`,
                  `求和项是 ${meaning["zh-CN"]} 的示性函数，所以和就是 $1, \\dots, ${n}$ 中属于 ${counted["zh-CN"]} 的元素个数。`,
                ),
              ],
              [["Count them", "计数"], count],
            ],
            check,
          ),
        });
      },
    },
    {
      id: "indicators-of-set-operations",
      title: t("Indicators of set operations", "集合运算的示性函数"),
      explanation: t(
        "An indicator is one on a set and zero off it, so intersections become products, complements become one minus, and unions need inclusion and exclusion. $\\mathbf{1}_{A \\cap B} = \\mathbf{1}_A \\mathbf{1}_B$, $\\mathbf{1}_{A^{c}} = 1 - \\mathbf{1}_A$, $\\mathbf{1}_{A \\cup B} = \\mathbf{1}_A + \\mathbf{1}_B - \\mathbf{1}_A \\mathbf{1}_B$ and $\\mathbf{1}_{A \\setminus B} = \\mathbf{1}_A (1 - \\mathbf{1}_B)$. Check each by trying the four cases $x \\in A$ or not, $x \\in B$ or not.\n\n> **Watch out.** $\\mathbf{1}_A + \\mathbf{1}_B$ is not the indicator of $A \\cup B$: at a point in both sets it equals $2$. Subtract the overlap $\\mathbf{1}_A \\mathbf{1}_B$ to bring it back to $1$.",
        "示性函数在集合上取 1、在集合外取 0，所以交集变成乘积，补集变成 1 减去它，并集则需要用容斥原理。$\\mathbf{1}_{A \\cap B} = \\mathbf{1}_A \\mathbf{1}_B$，$\\mathbf{1}_{A^{c}} = 1 - \\mathbf{1}_A$，$\\mathbf{1}_{A \\cup B} = \\mathbf{1}_A + \\mathbf{1}_B - \\mathbf{1}_A \\mathbf{1}_B$，$\\mathbf{1}_{A \\setminus B} = \\mathbf{1}_A (1 - \\mathbf{1}_B)$。可以逐一检验 $x$ 是否属于 $A$、是否属于 $B$ 这四种情形。\n\n> **注意。** $\\mathbf{1}_A + \\mathbf{1}_B$ 不是 $A \\cup B$ 的示性函数：在同时属于两个集合的点处它等于 $2$。要减去重叠部分 $\\mathbf{1}_A \\mathbf{1}_B$，才回到 $1$。",
      ),
      generate(rng) {
        const [X, Y] = rng.shuffle(["A", "B", "C", "D"]);
        const I = (s: string) => `\\mathbf{1}_{${s}}`;
        /** Form is a set built from X and Y, with its indicator and how both depend on the indicators of X and Y. */
        type Form = { set: string; right: string; holds: (p: number, q: number) => boolean; value: (p: number, q: number) => number };
        const forms: Form[] = [
          { set: `${X} \\cap ${Y}`, right: `${I(X!)} ${I(Y!)}`, holds: (p, q) => p === 1 && q === 1, value: (p, q) => p * q },
          {
            set: `${X} \\cup ${Y}`,
            right: `${I(X!)} + ${I(Y!)} - ${I(X!)} ${I(Y!)}`,
            holds: (p, q) => p === 1 || q === 1,
            value: (p, q) => p + q - p * q,
          },
          { set: `${X}^{c}`, right: `1 - ${I(X!)}`, holds: (p) => p === 0, value: (p) => 1 - p },
          {
            set: `${X} \\setminus ${Y}`,
            right: `${I(X!)} (1 - ${I(Y!)})`,
            holds: (p, q) => p === 1 && q === 0,
            value: (p, q) => p * (1 - q),
          },
          {
            set: `${X}^{c} \\cap ${Y}^{c}`,
            right: `(1 - ${I(X!)})(1 - ${I(Y!)})`,
            holds: (p, q) => p === 0 && q === 0,
            value: (p, q) => (1 - p) * (1 - q),
          },
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
        const usesY = f.set.includes(Y!);
        const cases = [
          [1, 1],
          [1, 0],
          [0, 1],
          [0, 0],
        ] as const;
        const table = cases.map(([p, q]) => `(${p}, ${q}) \\mapsto ${f.value(p, q)}`).join(",\\ ");
        const where = cases.filter(([p, q]) => f.holds(p, q));
        const inWords = (p: number, q: number, lang: "en" | "zh") =>
          lang === "en"
            ? `$x ${p ? "\\in" : "\\notin"} ${X}$${usesY ? ` and $x ${q ? "\\in" : "\\notin"} ${Y}$` : ""}`
            : `$x ${p ? "\\in" : "\\notin"} ${X}$${usesY ? ` 且 $x ${q ? "\\in" : "\\notin"} ${Y}$` : ""}`;
        const whereEn = [...new Set(where.map(([p, q]) => inWords(p, q, "en")))].join(" or ");
        const whereZh = [...new Set(where.map(([p, q]) => inWords(p, q, "zh")))].join(" 或 ");
        return reasoned(
          oneOf(
            rng,
            t(`Which expression equals $${I(f.set)}$?`, `哪个表达式等于 $${I(f.set)}$？`),
            opt(f.right),
            rng.shuffle(pool.filter((p) => p !== f.right)).map(opt),
            walked(
              [
                [
                  ["Say when x is in the set", "说出 x 何时属于该集合"],
                  t(`$x \\in ${f.set}$ exactly when ${whereEn}.`, `$x \\in ${f.set}$ 恰当 ${whereZh} 时成立。`),
                ],
                [
                  ["Translate into indicators", "翻译成示性函数"],
                  t(
                    `"And" becomes a product, "not" becomes $1 -$, and "or" becomes a sum minus the overlap, so $${I(f.set)} = ${f.right}$.`,
                    `“且”变成乘积，“非”变成 $1 -$，“或”变成和减去重叠部分，所以 $${I(f.set)} = ${f.right}$。`,
                  ),
                ],
              ],
              t(
                `Try the four cases $(${I(X!)}, ${I(Y!)})$: $${table}$. The value is $1$ exactly in the cases where $x \\in ${f.set}$, and $0$ otherwise.`,
                `试四种情形 $(${I(X!)}, ${I(Y!)})$：$${table}$。值恰在 $x \\in ${f.set}$ 的情形为 $1$，其余为 $0$。`,
              ),
            ),
          ),
          [
            ...forms.map((g) => [opt(g.right).en, `This is the indicator of $${g.set}$.`, `这是 $${g.set}$ 的示性函数。`] as const),
            [
              opt(`${I(X!)} + ${I(Y!)}`).en,
              `At a point in both sets this equals $2$, and an indicator only takes the values $0$ and $1$.`,
              `在同时属于两个集合的点处它等于 $2$，而示性函数只取 $0$ 和 $1$。`,
            ],
            [
              opt(`${I(Y!)} (1 - ${I(X!)})`).en,
              `This is the indicator of $${Y} \\setminus ${X}$.`,
              `这是 $${Y} \\setminus ${X}$ 的示性函数。`,
            ],
            [
              opt(`1 - ${I(X!)} ${I(Y!)}`).en,
              `This is the indicator of the complement of $${X} \\cap ${Y}$.`,
              `这是 $${X} \\cap ${Y}$ 的补集的示性函数。`,
            ],
            [
              opt(`${I(X!)} - ${I(Y!)}`).en,
              "At a point in the second set only this equals $-1$, and an indicator only takes the values $0$ and $1$.",
              "在只属于第二个集合的点处它等于 $-1$，而示性函数只取 $0$ 和 $1$。",
            ],
          ],
        );
      },
    },
  ],
};

/** Inclusion is a claim S ⊆ T about sets of integers or reals, with its truth, the argument that settles it and a second way to see it. */
interface Inclusion {
  readonly s: string;
  readonly t: string;
  readonly value: boolean;
  readonly why: Text;
  readonly check: Text;
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
            k === m
              ? "The two sets are the same set, and every set is a subset of itself."
              : `Let $x$ be in the first set, so $x = ${k}j$ for an integer $j$. Then $x = ${m}(${k / m}j)$, so $${m} \\mid x$ and $x$ is in the second set.`,
            k === m
              ? "两个集合是同一个集合，而每个集合都是它自身的子集。"
              : `设 $x$ 属于第一个集合，则 $x = ${k}j$，$j$ 为整数。于是 $x = ${m}(${k / m}j)$，所以 $${m} \\mid x$，$x$ 属于第二个集合。`,
          )
        : t(
            `$x = ${k}$ is in the first set, but $${m} \\nmid ${k}$, so it is not in the second: one counterexample disproves the inclusion.`,
            `$x = ${k}$ 属于第一个集合，但 $${m} \\nmid ${k}$，所以它不属于第二个集合：一个反例就否定了包含关系。`,
          ),
      check: value
        ? t(
            `Try an element: $x = ${3 * k}$ is in the first set, and $${3 * k} = ${m} \\cdot ${(3 * k) / m}$, so it is in the second set too.`,
            `试一个元素：$x = ${3 * k}$ 属于第一个集合，而 $${3 * k} = ${m} \\cdot ${(3 * k) / m}$，所以它也属于第二个集合。`,
          )
        : t(
            `Dividing, $${k} = ${m} \\cdot ${Math.floor(k / m)} + ${k % m}$ leaves remainder $${k % m} \\ne 0$, so indeed $${m} \\nmid ${k}$.`,
            `做除法，$${k} = ${m} \\cdot ${Math.floor(k / m)} + ${k % m}$，余数 $${k % m} \\ne 0$，所以确实 $${m} \\nmid ${k}$。`,
          ),
    };
  }
  if (kind === 1) {
    const a = rng.int(-5, 5);
    const r = rng.int(1, 4);
    const b = a + rng.int(-3, 3);
    const s = rng.int(1, 6);
    const value = Math.abs(a - b) + r <= s;
    const gap = (c: number) => (c === 0 ? "|x|" : `|x ${c < 0 ? "+" : "-"} ${Math.abs(c)}|`);
    const show = (c: number, d: number) => `\\{x \\in \\mathbb{R} : ${gap(c)} < ${d}\\}`;
    const ends = t(
      `The first set is the interval $(${a - r}, ${a + r})$ and the second is $(${b - s}, ${b + s})$.`,
      `第一个集合是区间 $(${a - r}, ${a + r})$，第二个是 $(${b - s}, ${b + s})$。`,
    );
    // A point of the first set outside the second: its centre, or an end of the second set that lies inside the first.
    const x = Math.abs(a - b) >= s ? a : b + s < a + r ? b + s : b - s;
    return {
      s: show(a, r),
      t: show(b, s),
      value,
      why: value
        ? a === b
          ? t(
              `Both sets measure the distance from $${a}$. If $${gap(a)} < ${r}$, then $${gap(a)} < ${r} \\le ${s}$, so $x$ is in the second set.`,
              `两个集合都度量到 $${a}$ 的距离。若 $${gap(a)} < ${r}$，则 $${gap(a)} < ${r} \\le ${s}$，所以 $x$ 属于第二个集合。`,
            )
          : t(
              `Let $${gap(a)} < ${r}$. By the triangle inequality, $${gap(b)} \\le ${gap(a)} + |${a} - ${b < 0 ? `(${b})` : b}| < ${r} + ${Math.abs(a - b)} \\le ${s}$, so $x$ is in the second set.`,
              `设 $${gap(a)} < ${r}$。由三角不等式，$${gap(b)} \\le ${gap(a)} + |${a} - ${b < 0 ? `(${b})` : b}| < ${r} + ${Math.abs(a - b)} \\le ${s}$，所以 $x$ 属于第二个集合。`,
            )
        : t(
            `$x = ${x}$ is in the first set, since $${gap(a).replace(/x/, `${x < 0 ? `(${x})` : x}`)} = ${Math.abs(x - a)} < ${r}$, but not in the second, since $${gap(b).replace(/x/, `${x < 0 ? `(${x})` : x}`)} = ${Math.abs(x - b)} \\ge ${s}$.`,
            `$x = ${x}$ 属于第一个集合，因为 $${gap(a).replace(/x/, `${x < 0 ? `(${x})` : x}`)} = ${Math.abs(x - a)} < ${r}$；但不属于第二个集合，因为 $${gap(b).replace(/x/, `${x < 0 ? `(${x})` : x}`)} = ${Math.abs(x - b)} \\ge ${s}$。`,
          ),
      check: value
        ? t(
            `${ends.en} Its ends satisfy $${b - s} \\le ${a - r}$ and $${a + r} \\le ${b + s}$, so the first interval lies inside the second.`,
            `${ends["zh-CN"]}端点满足 $${b - s} \\le ${a - r}$ 且 $${a + r} \\le ${b + s}$，所以第一个区间在第二个之内。`,
          )
        : t(
            `${ends.en} The first ${a + r > b + s ? `reaches $${a + r}$, past the end $${b + s}$ of the second` : `starts at $${a - r}$, before the start $${b - s}$ of the second`}, so it sticks out.`,
            `${ends["zh-CN"]}第一个区间${a + r > b + s ? `延伸到 $${a + r}$，超过第二个区间的右端 $${b + s}$` : `从 $${a - r}$ 开始，早于第二个区间的左端 $${b - s}$`}，所以它超出了第二个区间。`,
          ),
    };
  }
  const c = rng.int(1, 9);
  const d = rng.int(1, 10);
  const value = c <= d;
  const mid = (c + d) % 2 === 0 ? `${(c + d) / 2}` : `\\tfrac{${c + d}}{2}`;
  return {
    s: `\\{x \\in \\mathbb{R} : x^2 < ${c * c}\\}`,
    t: `\\{x \\in \\mathbb{R} : x < ${d}\\}`,
    value,
    why: value
      ? t(
          `Let $x^2 < ${c * c}$. Then $|x| < ${c}$, so $x < ${c} \\le ${d}$, and $x$ is in the second set.`,
          `设 $x^2 < ${c * c}$，则 $|x| < ${c}$，所以 $x < ${c} \\le ${d}$，$x$ 属于第二个集合。`,
        )
      : t(
          `$x = ${mid}$ lies between $${d}$ and $${c}$, so $x^2 < ${c * c}$ but $x \\ge ${d}$: it is in the first set and not in the second.`,
          `$x = ${mid}$ 在 $${d}$ 与 $${c}$ 之间，所以 $x^2 < ${c * c}$，但 $x \\ge ${d}$：它属于第一个集合而不属于第二个。`,
        ),
    check: value
      ? t(
          `The first set is the interval $(-${c}, ${c})$, and every number in it is below $${c}$, which is at most $${d}$.`,
          `第一个集合是区间 $(-${c}, ${c})$，其中每个数都小于 $${c}$，而 $${c}$ 不超过 $${d}$。`,
        )
      : t(
          `The first set is the interval $(-${c}, ${c})$, which reaches past $${d}$ because $${c} > ${d}$; the second set stops at $${d}$.`,
          `第一个集合是区间 $(-${c}, ${c})$，由于 $${c} > ${d}$，它延伸到 $${d}$ 之外；而第二个集合止于 $${d}$。`,
        ),
  };
}

/** pattern writes which sets an element is in, as a list of memberships. */
function pattern(env: Env, vars: readonly Var[]): Text {
  const one = (x: Var) => `$x ${env[x] ? "\\in" : "\\notin"} ${names[x]}$`;
  return t(vars.map(one).join(", "), vars.map(one).join("、"));
}

/** firstRow finds a row of the truth table where a test holds. */
const firstRow = (vars: readonly Var[], test: (env: Env) => boolean) => rows(vars).find(test);

/**
 * chaseProblem asks for the step that unpacks membership in the left set of a proof of left ⊆ right; reason says how the step
 * follows. The step must say the same as membership in the left set. An option that would also complete the proof is left
 * out, and each wrong option is answered with an element that shows where it breaks.
 */
function chaseProblem(rng: Rng, left: Formula, right: Formula, step: Formula, reason?: Text): Problem {
  const all = varsOf(left, right, step);
  const breaks = (w: Formula) => {
    const vars = varsOf(left, right, step, w);
    return firstRow(vars, (e) => evaluate(left, e) && !evaluate(w, e)) ?? firstRow(vars, (e) => evaluate(w, e) && !evaluate(right, e));
  };
  const wrong = inequivalentTo(rng, step, [...mutations(step), ...mutations(left)]).filter((w) => breaks(w) !== undefined);
  const L = setExpr(left);
  const R = setExpr(right);
  const why = reason ?? t(`unpack the definition of $${L}$`, `按 $${L}$ 的定义展开`);
  const sample = firstRow(all, (e) => evaluate(left, e))!;
  const reasons = wrong.map((w): Reason => {
    const vars = varsOf(left, right, step, w);
    const lost = firstRow(vars, (e) => evaluate(left, e) && !evaluate(w, e));
    if (lost) {
      const p = pattern(lost, vars);
      return [
        mem(w).en,
        `$x \\in ${L}$ does not give this: an element with ${p.en} is in $${L}$, but the statement is false for it.`,
        `由 $x \\in ${L}$ 推不出这一条：满足${p["zh-CN"]}的元素属于 $${L}$，但这条命题对它不成立。`,
      ];
    }
    const p = pattern(breaks(w)!, vars);
    return [
      mem(w).en,
      `This does not lead to $x \\in ${R}$: an element with ${p.en} makes it true but is not in $${R}$.`,
      `由这一条推不出 $x \\in ${R}$：满足${p["zh-CN"]}的元素使它成立，却不属于 $${R}$。`,
    ];
  });
  const p = pattern(sample, all);
  return reasoned(
    oneOf(
      rng,
      t(
        `To prove $${L} \\subseteq ${R}$: Let $x \\in ${L}$. Then ____. Hence $x \\in ${R}$. Which statement fills the blank?`,
        `证明 $${L} \\subseteq ${R}$：设 $x \\in ${L}$，则 ____。因此 $x \\in ${R}$。空白处应填哪个命题？`,
      ),
      mem(step),
      wrong.map(mem),
      walked(
        [
          [
            ["Unpack the membership", "展开隶属关系"],
            t(`To fill the blank, ${why.en}: $${memTex(step, "en")}$.`, `${why["zh-CN"]}，得 $${memTex(step, "zh")}$。`),
          ],
          [
            ["Finish the proof", "完成证明"],
            t(
              `Every element that satisfies this statement is in $${R}$, so the line "Hence $x \\in ${R}$" follows.`,
              `满足这条命题的每个元素都属于 $${R}$，所以“因此 $x \\in ${R}$”成立。`,
            ),
          ],
        ],
        t(
          `Take an element with ${p.en}. It is in $${L}$, the statement $${memTex(step, "en")}$ is true for it, and it is in $${R}$, as the proof says.`,
          `取满足${p["zh-CN"]}的元素。它属于 $${L}$，命题 $${memTex(step, "zh")}$ 对它成立，它也属于 $${R}$，与证明一致。`,
        ),
      ),
    ),
    reasons,
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
  intro: t(
    "Let $S = \\{x \\in \\mathbb{Z} : 4 \\mid x\\}$ and $T = \\{x \\in \\mathbb{Z} : 2 \\mid x\\}$. To prove $S \\subseteq T$, take any $x \\in S$. Then $x = 4j$ for some integer $j$, so $x = 2(2j)$ and $x \\in T$. The reverse inclusion $T \\subseteq S$ is false: $2 \\in T$ but $4 \\nmid 2$.\n\nCheck: $x = 12$ is in $S$, and $12 = 2 \\cdot 6$ is in $T$, as the proof says it must be.\n\nIn this lesson we decide whether one set is a subset of another, and write the step of an element-chasing proof.",
    "设 $S = \\{x \\in \\mathbb{Z} : 4 \\mid x\\}$，$T = \\{x \\in \\mathbb{Z} : 2 \\mid x\\}$。要证明 $S \\subseteq T$，任取 $x \\in S$，则存在整数 $j$ 使 $x = 4j$，于是 $x = 2(2j)$，$x \\in T$。反方向的 $T \\subseteq S$ 不成立：$2 \\in T$，但 $4 \\nmid 2$。\n\n检验：$x = 12$ 属于 $S$，而 $12 = 2 \\cdot 6$ 属于 $T$，与证明的结论一致。\n\n本课我们判断一个集合是否为另一个集合的子集，并写出元素追踪证明中的步骤。",
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
        "$S \\subseteq T$ means $\\forall x\\,(x \\in S \\Rightarrow x \\in T)$. Prove it by taking an arbitrary $x \\in S$ and deducing $x \\in T$; disprove it with one counterexample. $\\{x \\in \\mathbb{Z} : 6 \\mid x\\} \\subseteq \\{x \\in \\mathbb{Z} : 3 \\mid x\\}$, since $x = 6j = 3(2j)$; the reverse inclusion fails for $x = 3$.\n\n> **Watch out.** An example of an element of $S$ that lies in $T$ proves nothing about the rest of $S$, but a single element of $S$ outside $T$ disproves the inclusion. And $S \\subseteq T$ says nothing about $T \\subseteq S$.",
        "$S \\subseteq T$ 表示 $\\forall x\\,(x \\in S \\Rightarrow x \\in T)$。证明时任取 $x \\in S$，推出 $x \\in T$；否定时只需一个反例。$\\{x \\in \\mathbb{Z} : 6 \\mid x\\} \\subseteq \\{x \\in \\mathbb{Z} : 3 \\mid x\\}$，因为 $x = 6j = 3(2j)$；反方向的包含在 $x = 3$ 时不成立。\n\n> **注意。** 举出 $S$ 中一个属于 $T$ 的元素，并不能说明 $S$ 的其他元素；但只要 $S$ 中有一个元素不属于 $T$，包含关系就不成立。另外，$S \\subseteq T$ 与 $T \\subseteq S$ 无关。",
      ),
      generate(rng) {
        const c = inclusion(rng);
        return reasoned(
          oneOf(
            rng,
            t(`Is $${c.s} \\subseteq ${c.t}$?`, `$${c.s} \\subseteq ${c.t}$ 成立吗？`),
            yesNo[c.value ? 0 : 1]!,
            [yesNo[c.value ? 1 : 0]!],
            walked(
              [
                [
                  ["Say what must hold", "说出需要什么"],
                  t(
                    "The inclusion holds when every element of the first set is in the second; one element of the first set outside the second makes it fail.",
                    "包含关系成立，当且仅当第一个集合的每个元素都属于第二个集合；只要第一个集合中有一个元素不属于第二个，它就不成立。",
                  ),
                ],
                [[c.value ? "Prove it" : "Find a counterexample", c.value ? "证明它" : "找出反例"], c.why],
              ],
              c.check,
            ),
          ),
          c.value
            ? [["No", `It holds for every element: ${c.why.en}`, `它对每个元素都成立：${c.why["zh-CN"]}`]]
            : [["Yes", `A counterexample exists: ${c.why.en}`, `存在反例：${c.why["zh-CN"]}`]],
        );
      },
    },
    {
      id: "element-chasing",
      title: t("Element chasing", "元素追踪法"),
      explanation: t(
        'An **element-chasing** proof of $S \\subseteq T$ starts "Let $x \\in S$", unpacks the definition of $S$, and rebuilds the definition of $T$. To show $A \\cap B \\subseteq A \\cup C$: let $x \\in A \\cap B$; then $x \\in A$ and $x \\in B$; in particular $x \\in A$, so $x \\in A \\cup C$.\n\n> **Watch out.** The line after "Let $x \\in S$" must say exactly what $x \\in S$ means. A statement that $x \\in S$ does not give, or one that does not lead on to $x \\in T$, breaks the chain.',
        "**元素追踪法**证明 $S \\subseteq T$ 时，以“设 $x \\in S$”开始，按定义展开 $S$，再按定义组装出 $T$。证明 $A \\cap B \\subseteq A \\cup C$：设 $x \\in A \\cap B$，则 $x \\in A$ 且 $x \\in B$；特别地 $x \\in A$，所以 $x \\in A \\cup C$。\n\n> **注意。** “设 $x \\in S$”之后的一行必须恰好说出 $x \\in S$ 的含义。写出由 $x \\in S$ 推不出的命题，或写出推不到 $x \\in T$ 的命题，证明链就断了。",
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
  intro: t(
    "In $U = \\{1, 2, \\dots, 12\\}$, the even numbers $\\{2, 4, 6, 8, 10, 12\\}$ and the odd numbers $\\{1, 3, 5, 7, 9, 11\\}$ have no element in common: they are **disjoint**. The multiples of $3$, $\\{3, 6, 9, 12\\}$, are not disjoint from the even numbers, since $6$ is in both.\n\nCheck: the evens and the odds have $6 + 6 = 12$ elements between them, exactly the size of $U$, so no number was counted twice.\n\nIn this lesson we decide whether two sets are disjoint, and whether every pair in a collection is.",
    "在 $U = \\{1, 2, \\dots, 12\\}$ 中，偶数 $\\{2, 4, 6, 8, 10, 12\\}$ 与奇数 $\\{1, 3, 5, 7, 9, 11\\}$ 没有公共元素：它们**不相交**。$3$ 的倍数 $\\{3, 6, 9, 12\\}$ 与偶数不是不相交的，因为 $6$ 同属两者。\n\n检验：偶数和奇数合起来有 $6 + 6 = 12$ 个元素，恰好是 $U$ 的大小，所以没有数被数了两次。\n\n本课我们判断两个集合是否不相交，以及一族集合是否两两不交。",
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
        "To show $A \\cap B = \\varnothing$, show no element can satisfy both conditions. In $\\{1, \\dots, 20\\}$, the multiples of $4$ and of $6$ are not disjoint ($12$ is in both); the multiples of $5$ and the numbers of the form $5j + 2$ are disjoint, since their remainders on division by $5$ differ.\n\n> **Watch out.** One shared element is enough to make two sets not disjoint, so look for one first. To show they are disjoint you must rule out every element, for instance by comparing remainders.",
        "要证明 $A \\cap B = \\varnothing$，就要说明没有元素能同时满足两个条件。在 $\\{1, \\dots, 20\\}$ 中，$4$ 的倍数与 $6$ 的倍数不是不相交的（$12$ 同属两者）；$5$ 的倍数与形如 $5j + 2$ 的数不相交，因为它们除以 $5$ 的余数不同。\n\n> **注意。** 只要有一个公共元素，两个集合就不是不相交的，所以先找公共元素。要证明不相交，就必须排除每一个元素，例如比较余数。",
      ),
      generate(rng) {
        const n = rng.int(10, 30);
        const k = rng.int(2, 9);
        const m = rng.pick(range(2, 9).filter((v) => v !== k));
        const shift = rng.bool() ? 0 : rng.int(1, m - 1);
        const A = range(1, n).filter((x) => x % k === 0);
        const B = range(1, n).filter((x) => x % m === shift % m);
        const common = A.filter((x) => B.includes(x));
        const value = common.length === 0;
        const bTex = shift === 0 ? `\\{x : ${m} \\mid x\\}` : `\\{x : x = ${m}j + ${shift}\\}`;
        const remainders = uniqueSorted(A.map((x) => x % m));
        const c = common[0] ?? 0;
        const verdict = value
          ? t(`They share no element, so the sets are disjoint.`, `它们没有公共元素，所以两个集合不相交。`)
          : t(
              `No: disjoint sets share no element, but $${c}$ is in both, since it is a multiple of $${k}$ and also ${shift === 0 ? `a multiple of $${m}$` : `of the form $${m}j + ${shift}$`}.`,
              `不是：不相交的集合没有公共元素，但 $${c}$ 是 $${k}$ 的倍数，也${shift === 0 ? `是 $${m}$ 的倍数` : `形如 $${m}j + ${shift}$`}，同属两个集合。`,
            );
        return reasoned(
          oneOf(
            rng,
            t(
              `In the universe $\\{1, 2, \\dots, ${n}\\}$, are $\\{x : ${k} \\mid x\\}$ and $${bTex}$ disjoint?`,
              `在全集 $\\{1, 2, \\dots, ${n}\\}$ 中，$\\{x : ${k} \\mid x\\}$ 与 $${bTex}$ 不相交吗？`,
            ),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [
                  ["List both sets", "列出两个集合"],
                  t(`The sets are $${setTex(A)}$ and $${setTex(B)}$.`, `两个集合分别是 $${setTex(A)}$ 和 $${setTex(B)}$。`),
                ],
                [["Look for a common element", "寻找公共元素"], verdict],
              ],
              value
                ? t(
                    `Compare remainders on division by $${m}$: the elements of the second set all leave $${shift}$, while the multiples of $${k}$ leave only $${remainders.join(", ")}$, so no element can be in both.`,
                    `比较除以 $${m}$ 的余数：第二个集合的元素都余 $${shift}$，而 $${k}$ 的倍数只余 $${remainders.join(", ")}$，所以没有元素能同属两者。`,
                  )
                : t(
                    `$${c} = ${k} \\cdot ${c / k}$ and $${c} = ${m} \\cdot ${Math.floor(c / m)}${shift === 0 ? "" : ` + ${shift}`}$, so $${c}$ satisfies both conditions.`,
                    `$${c} = ${k} \\cdot ${c / k}$，且 $${c} = ${m} \\cdot ${Math.floor(c / m)}${shift === 0 ? "" : ` + ${shift}`}$，所以 $${c}$ 满足两个条件。`,
                  ),
            ),
          ),
          value
            ? [["No", "There is no common element, so the sets are disjoint.", "没有公共元素，所以两个集合不相交。"]]
            : [["Yes", `$${c}$ is in both sets, so they are not disjoint.`, `$${c}$ 同属两个集合，所以它们不是不相交的。`]],
        );
      },
    },
    {
      id: "pairwise-disjoint-collections",
      title: t("Pairwise disjoint collections", "两两不交的集合族"),
      explanation: t(
        "$A_1, A_2, A_3$ are **pairwise disjoint** when $A_i \\cap A_j = \\varnothing$ for all $i \\ne j$. This is stronger than $A_1 \\cap A_2 \\cap A_3 = \\varnothing$: $\\{1, 2\\}, \\{2, 3\\}, \\{4\\}$ have empty triple intersection but are not pairwise disjoint.\n\n> **Watch out.** Test every pair, all three of them. An empty intersection of all three sets does not show that each pair is disjoint.",
        "若对所有 $i \\ne j$ 都有 $A_i \\cap A_j = \\varnothing$，则称 $A_1, A_2, A_3$ **两两不交**。这比 $A_1 \\cap A_2 \\cap A_3 = \\varnothing$ 更强：$\\{1, 2\\}, \\{2, 3\\}, \\{4\\}$ 的三者交集为空，但它们不是两两不交的。\n\n> **注意。** 要检验每一对，共三对。三个集合的交集为空，并不能说明每一对都不相交。",
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
          const label = (p: readonly [number, number]) =>
            t(`$A_{${p[0] + 1}}$ and $A_{${p[1] + 1}}$`, `$A_{${p[0] + 1}}$ 与 $A_{${p[1] + 1}}$`);
          const shared = sets[i]!.filter((x) => sets[j]!.includes(x));
          const sizes = sets.map((s) => s.length);
          const union = uniqueSorted(sets.flat());
          const cap = (p: readonly [number, number]) => setTex(sets[p[0]]!.filter((x) => sets[p[1]]!.includes(x)));
          return reasoned(
            oneOf(
              rng,
              t(
                `Let $A_1 = ${setTex(sets[0]!)}$, $A_2 = ${setTex(sets[1]!)}$ and $A_3 = ${setTex(sets[2]!)}$. Which pair is not disjoint?`,
                `设 $A_1 = ${setTex(sets[0]!)}$，$A_2 = ${setTex(sets[1]!)}$，$A_3 = ${setTex(sets[2]!)}$。哪一对集合不是不相交的？`,
              ),
              label([i, j]),
              [...pairs.filter((p) => p[0] !== i || p[1] !== j).map(label), t("Every pair is disjoint", "每一对都不相交")],
              walked(
                [
                  [
                    ["Intersect each pair", "求每一对的交集"],
                    t(
                      `${pairs.map((p) => `$A_{${p[0] + 1}} \\cap A_{${p[1] + 1}} = ${cap(p)}$`).join(", ")}.`,
                      `${pairs.map((p) => `$A_{${p[0] + 1}} \\cap A_{${p[1] + 1}} = ${cap(p)}$`).join("，")}。`,
                    ),
                  ],
                  [
                    ["Pick the pair that overlaps", "找出重叠的一对"],
                    t(
                      `Only $A_{${i + 1}} \\cap A_{${j + 1}}$ is nonempty, so $A_{${i + 1}}$ and $A_{${j + 1}}$ are not disjoint.`,
                      `只有 $A_{${i + 1}} \\cap A_{${j + 1}}$ 非空，所以 $A_{${i + 1}}$ 与 $A_{${j + 1}}$ 不是不相交的。`,
                    ),
                  ],
                ],
                t(
                  `Count with sizes: $${sizes.join(" + ")} = ${sizes[0]! + sizes[1]! + sizes[2]!}$ elements are listed, while the union has $${union.length}$. The difference, $${shared.length}$, is exactly the number of elements shared by $A_{${i + 1}}$ and $A_{${j + 1}}$.`,
                  `用个数检验：列出的元素共 $${sizes.join(" + ")} = ${sizes[0]! + sizes[1]! + sizes[2]!}$ 个，而并集有 $${union.length}$ 个。差 $${shared.length}$ 恰是 $A_{${i + 1}}$ 与 $A_{${j + 1}}$ 的公共元素个数。`,
                ),
              ),
            ),
            [
              ...pairs.map(
                (p) =>
                  [
                    label(p).en,
                    `$A_{${p[0] + 1}}$ and $A_{${p[1] + 1}}$ have no element in common, so they are disjoint.`,
                    `$A_{${p[0] + 1}}$ 与 $A_{${p[1] + 1}}$ 没有公共元素，所以不相交。`,
                  ] as const,
              ),
              [
                "Every pair is disjoint",
                "One pair shares an element, so not every pair is disjoint.",
                "有一对集合有公共元素，所以并非每一对都不相交。",
              ],
            ],
          );
        }
      },
    },
  ],
};

/**
 * concrete picks sets for the variables of some formulas inside U = {1, …, 2ⁿ}, one element for each way of being in or out of
 * each set, so two formulas name the same set exactly when they give the same concrete set.
 */
function concrete(fs: readonly Formula[]) {
  const vars = varsOf(...fs);
  const size = 2 ** vars.length;
  const U = range(1, size);
  const env = (x: number): Env => {
    const e: Record<Var, boolean> = { p: false, q: false, r: false, s: false };
    vars.forEach((y, j) => {
      e[y] = (((x - 1) >> j) & 1) === 1;
    });
    return e;
  };
  const of = (f: Formula) => U.filter((x) => evaluate(f, env(x)));
  const given = vars.map((y) => `${names[y]} = ${setTex(of(v(y)))}`).join(", ");
  return { of, text: t(`$U = ${domainTex(size)}$ and $${given}$`, `$U = ${domainTex(size)}$，$${given}$`) };
}

/** Identity is an elementary property of set operations, with the condition for membership in its left side. */
interface Identity {
  readonly name: Text;
  readonly left: (a: string, b: string) => string;
  readonly right: (a: string, b: string) => string;
  readonly holds: (inA: boolean, inB: boolean) => boolean;
}

/** identities are the elementary properties of set operations, for sets inside a universe U. */
const identities: readonly Identity[] = [
  { name: t("Identity", "同一律"), left: (a) => `${a} \\cup \\varnothing`, right: (a) => a, holds: (p) => p },
  { name: t("Identity", "同一律"), left: (a) => `${a} \\cap U`, right: (a) => a, holds: (p) => p },
  { name: t("Domination", "零律"), left: (a) => `${a} \\cup U`, right: () => "U", holds: () => true },
  { name: t("Domination", "零律"), left: (a) => `${a} \\cap \\varnothing`, right: () => "\\varnothing", holds: () => false },
  { name: t("Idempotence", "幂等律"), left: (a) => `${a} \\cup ${a}`, right: (a) => a, holds: (p) => p },
  { name: t("Idempotence", "幂等律"), left: (a) => `${a} \\cap ${a}`, right: (a) => a, holds: (p) => p },
  { name: t("Complement", "互补律"), left: (a) => `${a} \\cup ${a}^{c}`, right: () => "U", holds: () => true },
  { name: t("Complement", "互补律"), left: (a) => `${a} \\cap ${a}^{c}`, right: () => "\\varnothing", holds: () => false },
  { name: t("Double complement", "双重补律"), left: (a) => `(${a}^{c})^{c}`, right: (a) => a, holds: (p) => p },
  { name: t("Absorption", "吸收律"), left: (a, b) => `${a} \\cup (${a} \\cap ${b})`, right: (a) => a, holds: (p) => p },
  { name: t("Absorption", "吸收律"), left: (a, b) => `${a} \\cap (${a} \\cup ${b})`, right: (a) => a, holds: (p) => p },
  { name: t("Difference", "差集律"), left: (a) => `${a} \\setminus ${a}`, right: () => "\\varnothing", holds: () => false },
];

/** identityNames are the distinct property names. */
const identityNames = [...new Map(identities.map((i) => [i.name.en, i.name])).values()];

/** lawStatements say what each named law states, in general. */
const lawStatements: Record<string, Text> = {
  Identity: t("$A \\cup \\varnothing = A$ and $A \\cap U = A$", "$A \\cup \\varnothing = A$ 与 $A \\cap U = A$"),
  Domination: t("$A \\cup U = U$ and $A \\cap \\varnothing = \\varnothing$", "$A \\cup U = U$ 与 $A \\cap \\varnothing = \\varnothing$"),
  Idempotence: t("$A \\cup A = A$ and $A \\cap A = A$", "$A \\cup A = A$ 与 $A \\cap A = A$"),
  Complement: t("$A \\cup A^{c} = U$ and $A \\cap A^{c} = \\varnothing$", "$A \\cup A^{c} = U$ 与 $A \\cap A^{c} = \\varnothing$"),
  "Double complement": t("$(A^{c})^{c} = A$", "$(A^{c})^{c} = A$"),
  Absorption: t("$A \\cup (A \\cap B) = A$ and $A \\cap (A \\cup B) = A$", "$A \\cup (A \\cap B) = A$ 与 $A \\cap (A \\cup B) = A$"),
};

/** kinds are the four kinds of element of U, by membership in A and B. */
const kinds = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
] as const;

/** kindText names a kind of element. */
const kindText = (inA: boolean, inB: boolean, a: string, b: string, usesB: boolean) =>
  usesB
    ? t(
        `$x ${inA ? "\\in" : "\\notin"} ${a}$, $x ${inB ? "\\in" : "\\notin"} ${b}$`,
        `$x ${inA ? "\\in" : "\\notin"} ${a}$、$x ${inB ? "\\in" : "\\notin"} ${b}$`,
      )
    : t(`$x ${inA ? "\\in" : "\\notin"} ${a}$`, `$x ${inA ? "\\in" : "\\notin"} ${a}$`);

/** lawCheck tests a law on every kind of element. */
function lawCheck(id: Identity, a: string, b: string): Text {
  const usesB = id.left(a, b).includes(b);
  const shown = usesB ? kinds : kinds.filter(([, q]) => q);
  const parts = shown.map(([p, q]) => {
    const k = kindText(p, q, a, b, usesB);
    const inside = id.holds(p, q);
    return t(
      `an element with ${k.en} is ${inside ? "in both sides" : "in neither side"}`,
      `满足${k["zh-CN"]}的元素${inside ? "两边都属于" : "两边都不属于"}`,
    );
  });
  return t(
    `Test each kind of element of $U$: ${parts.map((p) => p.en).join("; ")}. The two sides contain the same elements.`,
    `逐类检验 $U$ 的元素。${parts.map((p) => p["zh-CN"]).join("；")}。两边所含元素相同。`,
  );
}

/** elementaryPropertiesOfSetOperations simplifies set expressions. */
export const elementaryPropertiesOfSetOperations: TopicDef = {
  id: "elementary-properties-of-set-operations",
  title: t("Elementary Properties of Set Operations", "集合运算的基本性质"),
  summary: t(
    "Union and intersection are commutative and associative, and satisfy identity, domination, idempotence, complement and absorption laws.",
    "并与交满足交换律、结合律，以及同一律、零律、幂等律、互补律和吸收律。",
  ),
  intro: t(
    "Take $U = \\{1, 2, 3, 4\\}$ and $A = \\{1, 2\\}$, so $A^{c} = \\{3, 4\\}$. Then $A \\cup \\varnothing = \\{1, 2\\} = A$ and $A \\cap U = A$, while $A \\cup A^{c} = \\{1, 2, 3, 4\\} = U$ and $A \\cap A^{c} = \\varnothing$. These are instances of laws that hold for every set $A$.\n\nCheck: $A$ and $A^{c}$ have $2 + 2 = 4$ elements and share none, so their union must be all $4$ elements of $U$, as found.\n\nIn this lesson we simplify set expressions with the elementary laws and name the law each step uses.",
    "取 $U = \\{1, 2, 3, 4\\}$，$A = \\{1, 2\\}$，则 $A^{c} = \\{3, 4\\}$。于是 $A \\cup \\varnothing = \\{1, 2\\} = A$，$A \\cap U = A$，而 $A \\cup A^{c} = \\{1, 2, 3, 4\\} = U$，$A \\cap A^{c} = \\varnothing$。这些都是对任意集合 $A$ 成立的运算律的实例。\n\n检验：$A$ 与 $A^{c}$ 共有 $2 + 2 = 4$ 个元素且没有公共元素，所以它们的并集必是 $U$ 的全部 $4$ 个元素，与所得一致。\n\n本课我们用基本运算律化简集合表达式，并说出每一步所用的运算律。",
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
        "The laws of sets mirror the laws of logic, so the empty set and the universe behave like false and true in simplifications. For sets $A$, $B$ in a universe $U$: $A \\cup \\varnothing = A$, $A \\cap U = A$, $A \\cup U = U$, $A \\cap \\varnothing = \\varnothing$, $A \\cup A = A$, $A \\cup A^{c} = U$, $A \\cap A^{c} = \\varnothing$, $(A^{c})^{c} = A$ and $A \\cup (A \\cap B) = A$.\n\n> **Watch out.** $U$ swallows a set only under union, and $\\varnothing$ only under intersection: $A \\cup U = U$ but $A \\cap U = A$, and $A \\cap \\varnothing = \\varnothing$ but $A \\cup \\varnothing = A$.",
        "集合的运算律与逻辑的运算律一一对应，所以在化简中空集和全集分别像假和真一样起作用。对全集 $U$ 中的集合 $A$、$B$：$A \\cup \\varnothing = A$，$A \\cap U = A$，$A \\cup U = U$，$A \\cap \\varnothing = \\varnothing$，$A \\cup A = A$，$A \\cup A^{c} = U$，$A \\cap A^{c} = \\varnothing$，$(A^{c})^{c} = A$，$A \\cup (A \\cap B) = A$。\n\n> **注意。** $U$ 只在并运算中吞没集合，$\\varnothing$ 只在交运算中吞没集合：$A \\cup U = U$，但 $A \\cap U = A$；$A \\cap \\varnothing = \\varnothing$，但 $A \\cup \\varnothing = A$。",
      ),
      generate(rng) {
        const id = rng.pick(identities);
        const [a, b] = rng.shuffle(["A", "B", "C", "D"]) as [string, string];
        const right = id.right(a, b);
        const usesB = id.left(a, b).includes(b);
        /** Candidate is a possible simplification, with the condition for membership in it. */
        type Candidate = { readonly tex: string; readonly holds: (p: boolean, q: boolean) => boolean };
        // An option naming a set the expression does not use could be ruled out at a glance.
        const pool: Candidate[] = [
          { tex: a, holds: (p: boolean) => p },
          { tex: b, holds: (_: boolean, q: boolean) => q },
          { tex: "U", holds: () => true },
          { tex: "\\varnothing", holds: () => false },
          { tex: `${a} \\cap ${b}`, holds: (p: boolean, q: boolean) => p && q },
          { tex: `${a} \\cup ${b}`, holds: (p: boolean, q: boolean) => p || q },
          { tex: `${a}^{c}`, holds: (p: boolean) => !p },
        ].filter((c) => !c.tex.includes(b) || usesB);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        const reasons = pool.map((c): Reason => {
          const [p, q] = kinds.find(([x, y]) => c.holds(x, y) !== id.holds(x, y)) ?? [true, true];
          const k = kindText(p, q, a, b, usesB || c.tex.includes(b));
          const inLeft = id.holds(p, q);
          return [
            opt(c.tex).en,
            `An element with ${k.en} is ${inLeft ? "in" : "not in"} $${id.left(a, b)}$ but ${inLeft ? "not in" : "in"} $${c.tex}$, so the two sets differ.`,
            `满足${k["zh-CN"]}的元素${inLeft ? "属于" : "不属于"} $${id.left(a, b)}$，却${inLeft ? "不属于" : "属于"} $${c.tex}$，所以两个集合不同。`,
          ];
        });
        return reasoned(
          oneOf(
            rng,
            t(`For sets in a universe $U$, simplify $${id.left(a, b)}$.`, `对全集 $U$ 中的集合，化简 $${id.left(a, b)}$。`),
            opt(right),
            rng.shuffle(pool.filter((p) => p.tex !== right)).map((p) => opt(p.tex)),
            walked(
              [
                [
                  ["Recognize the law", "认出运算律"],
                  t(
                    `$${id.left(a, b)}$ has the shape of the ${id.name.en.toLowerCase()} law.`,
                    `$${id.left(a, b)}$ 具有${id.name["zh-CN"]}的形式。`,
                  ),
                ],
                [["Apply it", "应用它"], t(`$${id.left(a, b)} = ${right}$.`, `$${id.left(a, b)} = ${right}$。`)],
              ],
              lawCheck(id, a, b),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "naming-set-properties",
      title: t("Naming the property", "说出性质"),
      explanation: t(
        "Knowing the names of the standard set laws lets you justify each step of a simplification, just as in algebra. Each property has a name: identity ($A \\cup \\varnothing = A$), domination ($A \\cup U = U$), idempotence ($A \\cup A = A$), complement ($A \\cup A^{c} = U$), double complement ($(A^{c})^{c} = A$) and absorption ($A \\cup (A \\cap B) = A$).\n\n> **Watch out.** Identity combines a set with $\\varnothing$ or $U$ and leaves it unchanged; domination combines it with $\\varnothing$ or $U$ and gives that set back; idempotence combines a set with itself; absorption has a second set inside the brackets.",
        "知道标准集合运算律的名称，就能像在代数中一样为化简的每一步说明理由。每条性质都有名称：同一律（$A \\cup \\varnothing = A$）、零律（$A \\cup U = U$）、幂等律（$A \\cup A = A$）、互补律（$A \\cup A^{c} = U$）、双重补律（$(A^{c})^{c} = A$）、吸收律（$A \\cup (A \\cap B) = A$）。\n\n> **注意。** 同一律把集合与 $\\varnothing$ 或 $U$ 组合，集合保持不变；零律把集合与 $\\varnothing$ 或 $U$ 组合，结果就是 $\\varnothing$ 或 $U$ 本身；幂等律是集合与自身组合；吸收律的括号中有第二个集合。",
      ),
      generate(rng) {
        const id = rng.pick(identities.filter((i) => i.name.en !== "Difference"));
        const [a, b] = rng.shuffle(["A", "B", "C", "D"]) as [string, string];
        const lawNames = identityNames.filter((n) => n.en !== "Difference");
        return reasoned(
          oneOf(
            rng,
            t(`Which property states $${id.left(a, b)} = ${id.right(a, b)}$?`, `哪条性质表明 $${id.left(a, b)} = ${id.right(a, b)}$？`),
            id.name,
            rng.shuffle(lawNames.filter((n) => n.en !== id.name.en)),
            walked(
              [
                [
                  ["Compare with the laws", "与各运算律比较"],
                  t(
                    `The ${id.name.en.toLowerCase()} law states ${lawStatements[id.name.en]!.en}, which is the shape of $${id.left(a, b)} = ${id.right(a, b)}$.`,
                    `${id.name["zh-CN"]}表明${lawStatements[id.name.en]!["zh-CN"]}，正是 $${id.left(a, b)} = ${id.right(a, b)}$ 的形式。`,
                  ),
                ],
                [["Name it", "说出名称"], t(`This is the ${id.name.en.toLowerCase()} law.`, `这是${id.name["zh-CN"]}。`)],
              ],
              lawCheck(id, a, b),
            ),
          ),
          lawNames.map(
            (n): Reason => [
              n.en,
              `The ${n.en.toLowerCase()} law states ${lawStatements[n.en]!.en}, which is not the shape of this equation.`,
              `${n["zh-CN"]}表明${lawStatements[n.en]!["zh-CN"]}，不是这个等式的形式。`,
            ],
          ),
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
  intro: t(
    "To prove $A \\cap (A \\cup B) = A$, prove two inclusions. If $x \\in A \\cap (A \\cup B)$, then in particular $x \\in A$. If $x \\in A$, then $x \\in A \\cup B$ as well, so $x \\in A \\cap (A \\cup B)$. Each side is a subset of the other, so they are equal.\n\nCheck: with $A = \\{1, 2\\}$ and $B = \\{2, 3\\}$, $A \\cup B = \\{1, 2, 3\\}$ and $A \\cap (A \\cup B) = \\{1, 2\\} = A$.\n\nIn this lesson we prove that two sets are equal by double inclusion, chasing an element through each direction.",
    "要证明 $A \\cap (A \\cup B) = A$，就证明两个包含关系。若 $x \\in A \\cap (A \\cup B)$，则特别地 $x \\in A$。若 $x \\in A$，则也有 $x \\in A \\cup B$，所以 $x \\in A \\cap (A \\cup B)$。两边互为子集，所以相等。\n\n检验：取 $A = \\{1, 2\\}$，$B = \\{2, 3\\}$，则 $A \\cup B = \\{1, 2, 3\\}$，$A \\cap (A \\cup B) = \\{1, 2\\} = A$。\n\n本课我们用双向包含证明两个集合相等，在每个方向上追踪元素。",
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
        "Two sets are equal when each is a subset of the other. To prove $A \\cup (A \\cap B) = A$, prove $A \\cup (A \\cap B) \\subseteq A$ and $A \\subseteq A \\cup (A \\cap B)$.\n\n> **Watch out.** One inclusion is not enough: $S \\subseteq T$ still lets $T$ have extra elements. Equal sizes, or a shared element, do not make two sets equal either.",
        "两个集合互为子集时相等。要证明 $A \\cup (A \\cap B) = A$，就要证明 $A \\cup (A \\cap B) \\subseteq A$ 与 $A \\subseteq A \\cup (A \\cap B)$。\n\n> **注意。** 只证一个方向不够：$S \\subseteq T$ 仍允许 $T$ 有多余的元素。元素个数相同或有公共元素，也不能说明两个集合相等。",
      ),
      generate(rng) {
        const e = propertyEquality(rng);
        const S = setExpr(e.left);
        const T = setExpr(e.right);
        const c = concrete([e.left, e.right]);
        const opt = (en: string, zh: string) => t(en, zh);
        const only = opt(`$${S} \\subseteq ${T}$ only`, `只需 $${S} \\subseteq ${T}$`);
        const meet = opt(`$${S} \\cap ${T} \\ne \\varnothing$`, `$${S} \\cap ${T} \\ne \\varnothing$`);
        const size = opt(`$|${S}| = |${T}|$`, `$|${S}| = |${T}|$`);
        return reasoned(
          oneOf(
            rng,
            t(`What must be shown to prove $${S} = ${T}$ by double inclusion?`, `用双向包含证明 $${S} = ${T}$，需要证明什么？`),
            opt(`$${S} \\subseteq ${T}$ and $${T} \\subseteq ${S}$`, `$${S} \\subseteq ${T}$ 且 $${T} \\subseteq ${S}$`),
            [only, meet, size],
            walked(
              [
                [
                  ["Recall what equality means", "回顾相等的含义"],
                  t("Two sets are equal when they have exactly the same elements.", "两个集合相等，是指它们的元素完全相同。"),
                ],
                [
                  ["Split it into two inclusions", "拆成两个包含关系"],
                  t(
                    `Every element of $${S}$ must be in $${T}$, and every element of $${T}$ must be in $${S}$: $${S} \\subseteq ${T}$ and $${T} \\subseteq ${S}$.`,
                    `$${S}$ 的每个元素都要属于 $${T}$，$${T}$ 的每个元素也都要属于 $${S}$：$${S} \\subseteq ${T}$ 且 $${T} \\subseteq ${S}$。`,
                  ),
                ],
              ],
              t(
                `Try sets in which every way of belonging occurs: ${c.text.en}. Then both $${S}$ and $${T}$ are $${setTex(c.of(e.left))}$, so the equality holds there, as the two inclusions promise.`,
                `取各种隶属情形都出现的集合：${c.text["zh-CN"]}。此时 $${S}$ 与 $${T}$ 都等于 $${setTex(c.of(e.left))}$，等式成立，与两个包含关系的结论一致。`,
              ),
            ),
          ),
          [
            [
              only.en,
              `One inclusion still lets $${T}$ have elements outside $${S}$; the reverse inclusion is needed too.`,
              `只证一个方向，$${T}$ 仍可能有不属于 $${S}$ 的元素；还需要反方向的包含。`,
            ],
            [
              meet.en,
              "Sharing an element does not make two sets equal: $\\{1, 2\\}$ and $\\{2, 3\\}$ share $2$.",
              "有公共元素并不能使两个集合相等：$\\{1, 2\\}$ 与 $\\{2, 3\\}$ 有公共元素 $2$。",
            ],
            [
              size.en,
              "Equal sizes do not make two sets equal: $\\{1\\}$ and $\\{2\\}$ both have one element.",
              "元素个数相同并不能使两个集合相等：$\\{1\\}$ 与 $\\{2\\}$ 都只有一个元素。",
            ],
          ],
        );
      },
    },
    {
      id: "chasing-elements-through-a-property",
      title: t("Chasing elements through a property", "用元素追踪证明性质"),
      explanation: t(
        "In each direction, unpack the definition of the left set. For $A \\cup (A \\cap B) \\subseteq A$: let $x \\in A \\cup (A \\cap B)$; then $x \\in A$ or ($x \\in A$ and $x \\in B$); in either case $x \\in A$.\n\n> **Watch out.** Keep the brackets when you unpack. $x \\in A \\cup (A \\cap B)$ means $x \\in A$ or ($x \\in A$ and $x \\in B$), which is not the same statement as ($x \\in A$ or $x \\in A$) and $x \\in B$.",
        "每个方向都先按定义展开左边的集合。证明 $A \\cup (A \\cap B) \\subseteq A$：设 $x \\in A \\cup (A \\cap B)$，则 $x \\in A$ 或（$x \\in A$ 且 $x \\in B$）；无论哪种情形都有 $x \\in A$。\n\n> **注意。** 展开时要保留括号。$x \\in A \\cup (A \\cap B)$ 的意思是 $x \\in A$ 或（$x \\in A$ 且 $x \\in B$），它与（$x \\in A$ 或 $x \\in A$）且 $x \\in B$ 不是同一个命题。",
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

/** differs answers a wrong set option with a kind of element that is in one of the two sets and not the other. */
function differs(target: Formula, w: Formula): Reason {
  const vars = varsOf(target, w);
  const e = firstRow(vars, (x) => evaluate(target, x) !== evaluate(w, x));
  const T = setExpr(target);
  const W = setExpr(w);
  if (!e) return [setOpt(w).en, `$${W}$ is not the same set as $${T}$.`, `$${W}$ 与 $${T}$ 不是同一个集合。`];
  const p = pattern(e, vars);
  const inT = evaluate(target, e);
  return [
    setOpt(w).en,
    `An element with ${p.en} is ${inT ? "in" : "not in"} $${T}$ but ${inT ? "not in" : "in"} $${W}$, so the two sets differ.`,
    `满足${p["zh-CN"]}的元素${inT ? "属于" : "不属于"} $${T}$，却${inT ? "不属于" : "属于"} $${W}$，所以两个集合不同。`,
  ];
}

/**
 * blankReason answers a wrong way to fill the blank of "x ∈ given, so ____, hence x ∈ goal": either the hypothesis does not
 * give the statement, or the statement does not give the goal; s is the statement as a formula.
 */
function blankReason(option: string, s: Formula, given: Formula, goal: Formula): Reason {
  const vars = varsOf(s, given, goal);
  const G = setExpr(given);
  const lost = firstRow(vars, (e) => evaluate(given, e) && !evaluate(s, e));
  if (lost) {
    const p = pattern(lost, vars);
    return [
      option,
      `$x \\in ${G}$ does not give this: an element with ${p.en} is in $${G}$, but the statement is false for it.`,
      `由 $x \\in ${G}$ 推不出这一条：满足${p["zh-CN"]}的元素属于 $${G}$，但这条命题对它不成立。`,
    ];
  }
  const weak = firstRow(vars, (e) => evaluate(s, e) && !evaluate(goal, e));
  const Gl = setExpr(goal);
  if (!weak) return [option, "This statement does not fit the proof.", "这条命题不符合证明。"];
  const p = pattern(weak, vars);
  return [
    option,
    `This does not lead to $x \\in ${Gl}$: an element with ${p.en} makes it true but is not in $${Gl}$.`,
    `由这一条推不出 $x \\in ${Gl}$：满足${p["zh-CN"]}的元素使它成立，却不属于 $${Gl}$。`,
  ];
}

/** deMorgansLawsForSets complements unions and intersections. */
export const deMorgansLawsForSets: TopicDef = {
  id: "de-morgans-laws-for-sets",
  title: t("De Morgan's Laws for Sets", "集合的德摩根律"),
  summary: t("(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ and (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ.", "(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ，(A ∩ B)ᶜ = Aᶜ ∪ Bᶜ。"),
  intro: t(
    "Take $U = \\{1, 2, 3, 4, 5, 6\\}$, $A = \\{1, 2, 3\\}$ and $B = \\{2, 4\\}$. Then $A \\cup B = \\{1, 2, 3, 4\\}$, so $(A \\cup B)^{c} = \\{5, 6\\}$. On the other side, $A^{c} = \\{4, 5, 6\\}$ and $B^{c} = \\{1, 3, 5, 6\\}$, so $A^{c} \\cap B^{c} = \\{5, 6\\}$ as well: the elements outside the union are those outside both sets.\n\nCheck: $A \\cup B$ has $4$ of the $6$ elements of $U$, so its complement has $6 - 4 = 2$ elements, and $\\{5, 6\\}$ has $2$.\n\nIn this lesson we take complements of unions and intersections with De Morgan's laws and push complements inside set expressions.",
    "取 $U = \\{1, 2, 3, 4, 5, 6\\}$，$A = \\{1, 2, 3\\}$，$B = \\{2, 4\\}$。则 $A \\cup B = \\{1, 2, 3, 4\\}$，所以 $(A \\cup B)^{c} = \\{5, 6\\}$。另一方面，$A^{c} = \\{4, 5, 6\\}$，$B^{c} = \\{1, 3, 5, 6\\}$，所以 $A^{c} \\cap B^{c} = \\{5, 6\\}$ 也成立：不在并集中的元素，就是两个集合都不在的元素。\n\n检验：$A \\cup B$ 含 $U$ 的 $6$ 个元素中的 $4$ 个，所以它的补集有 $6 - 4 = 2$ 个元素，而 $\\{5, 6\\}$ 恰有 $2$ 个。\n\n本课我们用德摩根律求并集与交集的补集，并把补运算推入集合表达式内部。",
  ),
  prerequisites: ["elementary-properties-of-set-operations", "de-morgans-laws-for-logic"],
  encompasses: [{ topic: "set-complements", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "complements-of-unions-and-intersections",
      title: t("Complements of unions and intersections", "并集与交集的补集"),
      explanation: t(
        "$(A \\cup B)^{c} = A^{c} \\cap B^{c}$: an element is outside $A \\cup B$ exactly when it is outside both. $(A \\cap B)^{c} = A^{c} \\cup B^{c}$: an element is outside $A \\cap B$ when it is outside at least one.\n\n> **Watch out.** Taking the complement swaps the operation. $(A \\cup B)^{c}$ is $A^{c} \\cap B^{c}$, not $A^{c} \\cup B^{c}$; and $(A \\cap B)^{c}$ is $A^{c} \\cup B^{c}$, not $A^{c} \\cap B^{c}$.",
        "$(A \\cup B)^{c} = A^{c} \\cap B^{c}$：元素不在 $A \\cup B$ 中，当且仅当它两个都不在。$(A \\cap B)^{c} = A^{c} \\cup B^{c}$：元素不在 $A \\cap B$ 中，当且仅当它至少不在其中一个。\n\n> **注意。** 取补集时运算要互换。$(A \\cup B)^{c}$ 是 $A^{c} \\cap B^{c}$，不是 $A^{c} \\cup B^{c}$；$(A \\cap B)^{c}$ 是 $A^{c} \\cup B^{c}$，不是 $A^{c} \\cap B^{c}$。",
      ),
      generate(rng) {
        const { n, U, A, B } = twoSets(rng);
        const isUnion = rng.bool();
        const inA = (x: number) => A.includes(x);
        const inB = (x: number) => B.includes(x);
        const S = U.filter((x) => (isUnion ? inA(x) || inB(x) : inA(x) && inB(x)));
        const values = U.filter((x) => !S.includes(x));
        const Ac = U.filter((x) => !inA(x));
        const Bc = U.filter((x) => !inB(x));
        const op = isUnion ? "\\cup" : "\\cap";
        const other = isUnion ? "\\cap" : "\\cup";
        const swapped = U.filter((x) => (isUnion ? !inA(x) || !inB(x) : !inA(x) && !inB(x)));
        const mistakes: [number[], string, string][] = [
          isUnion
            ? [
                swapped,
                "That is $A^{c} \\cup B^{c}$, the complement of $A \\cap B$. An element outside $A \\cup B$ must be outside both sets, so the complements are intersected.",
                "这是 $A^{c} \\cup B^{c}$，即 $A \\cap B$ 的补集。不在 $A \\cup B$ 中的元素必须两个集合都不在，所以应取补集的交。",
              ]
            : [
                swapped,
                "That is $A^{c} \\cap B^{c}$, the complement of $A \\cup B$. An element outside $A \\cap B$ only has to be outside one of the sets, so the complements are united.",
                "这是 $A^{c} \\cap B^{c}$，即 $A \\cup B$ 的补集。不在 $A \\cap B$ 中的元素只需不在其中一个集合中，所以应取补集的并。",
              ],
          [
            S,
            `That is $A ${op} B$ itself; its complement is made of the elements of $U$ outside it.`,
            `这是 $A ${op} B$ 本身；它的补集由 $U$ 中不属于它的元素组成。`,
          ],
          isUnion
            ? [Ac, "That is $A^{c}$ only; the elements of $B$ must be left out as well.", "这只是 $A^{c}$；$B$ 的元素也要去掉。"]
            : [Ac, "That is $A^{c}$ only; the elements outside $B$ belong as well.", "这只是 $A^{c}$；不在 $B$ 中的元素也属于它。"],
        ];
        if (!isUnion)
          mistakes.push([
            U.filter((x) => (inA(x) || inB(x)) && !(inA(x) && inB(x))),
            "That takes the complement inside $A \\cup B$ only; the elements of $U$ outside both sets belong as well.",
            "这只在 $A \\cup B$ 内取补集；$U$ 中两个集合都不在的元素也属于它。",
          ]);
        return setProblem({
          prompt: t(
            `Let $U = \\{1, 2, \\dots, ${n}\\}$, $A = ${setTex(A)}$ and $B = ${setTex(B)}$. Find $(A ${op} B)^{c}$.`,
            `设 $U = \\{1, 2, \\dots, ${n}\\}$，$A = ${setTex(A)}$，$B = ${setTex(B)}$。求 $(A ${op} B)^{c}$。`,
          ),
          values,
          wrong: [swapped, S],
          mistakes,
          solution: walked(
            [
              [
                ["Apply De Morgan's law", "应用德摩根律"],
                t(`$(A ${op} B)^{c} = A^{c} ${other} B^{c}$.`, `$(A ${op} B)^{c} = A^{c} ${other} B^{c}$。`),
              ],
              [
                ["List the complements", "写出补集"],
                t(
                  `In $U$, $A^{c} = ${setTex(Ac)}$ and $B^{c} = ${setTex(Bc)}$.`,
                  `在 $U$ 中，$A^{c} = ${setTex(Ac)}$，$B^{c} = ${setTex(Bc)}$。`,
                ),
              ],
              [["Combine them", "组合"], t(`$A^{c} ${other} B^{c} = ${setTex(values)}$.`, `$A^{c} ${other} B^{c} = ${setTex(values)}$。`)],
            ],
            t(
              `Directly, $A ${op} B = ${setTex(S)}$, and the elements of $U$ outside it are $${setTex(values)}$: $${n} - ${S.length} = ${values.length}$ of them.`,
              `直接计算，$A ${op} B = ${setTex(S)}$，$U$ 中不属于它的元素是 $${setTex(values)}$，共 $${n} - ${S.length} = ${values.length}$ 个。`,
            ),
          ),
        });
      },
    },
    {
      id: "rewriting-complements-of-set-expressions",
      title: t("Rewriting complements", "改写补集"),
      explanation: t(
        "De Morgan's laws turn the complement of a union into an intersection of complements and vice versa, so a complement can be pushed onto single sets. Apply De Morgan's laws repeatedly to push a complement inward, and cancel double complements: $(A \\cap (B \\cup C^{c}))^{c} = A^{c} \\cup (B^{c} \\cap C)$.\n\n> **Watch out.** As the complement moves inward, every $\\cup$ it passes becomes $\\cap$ and every $\\cap$ becomes $\\cup$, and every set it reaches is complemented. A set that already carries a complement loses it: $(C^{c})^{c} = C$.",
        "德摩根律把并集的补变成补集的交，反之亦然，所以可以把补运算推到单个集合上。反复应用德摩根律把补集移入，并消去双重补：$(A \\cap (B \\cup C^{c}))^{c} = A^{c} \\cup (B^{c} \\cap C)$。\n\n> **注意。** 补运算向内移动时，经过的每个 $\\cup$ 都变成 $\\cap$，每个 $\\cap$ 都变成 $\\cup$，到达的每个集合都要取补。已经带补的集合则去掉补：$(C^{c})^{c} = C$。",
      ),
      generate(rng) {
        for (;;) {
          const inner = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or"]);
          if ((inner.k !== "and" && inner.k !== "or") || varsOf(inner).length < 2) continue;
          const f = not(inner);
          const g = deMorganRewrite(f);
          const top = inner.k === "or" ? and(not(inner.a), not(inner.b)) : or(not(inner.a), not(inner.b));
          const wrong = inequivalentTo(rng, f, [...mutations(g), ...mutations(inner)]);
          const c = concrete([f, g]);
          return reasoned(
            oneOf(
              rng,
              t(`Which set equals $${setExpr(f)}$?`, `哪个集合等于 $${setExpr(f)}$？`),
              setOpt(g),
              wrong.map(setOpt),
              walked(
                [
                  [
                    ["Apply De Morgan's law at the top", "在最外层应用德摩根律"],
                    t(
                      `The complement of ${inner.k === "or" ? "a union is the intersection" : "an intersection is the union"} of the complements: $${setExpr(f)} = ${setExpr(top)}$.`,
                      `${inner.k === "or" ? "并集的补是补集的交" : "交集的补是补集的并"}：$${setExpr(f)} = ${setExpr(top)}$。`,
                    ),
                  ],
                  [
                    ["Keep pushing inward", "继续向内推"],
                    t(
                      `Apply the law again inside any bracket and cancel double complements: $${setExpr(f)} = ${setExpr(g)}$.`,
                      `在括号内再次应用德摩根律，并消去双重补：$${setExpr(f)} = ${setExpr(g)}$。`,
                    ),
                  ],
                ],
                t(
                  `Try sets in which every way of belonging occurs: ${c.text.en}. Then $${setExpr(f)}$ and $${setExpr(g)}$ are both $${setTex(c.of(f))}$.`,
                  `取各种隶属情形都出现的集合：${c.text["zh-CN"]}。此时 $${setExpr(f)}$ 与 $${setExpr(g)}$ 都等于 $${setTex(c.of(f))}$。`,
                ),
              ),
            ),
            wrong.map((w) => differs(f, w)),
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
  intro: t(
    "To prove $(A \\cap B)^{c} \\subseteq A^{c} \\cup B^{c}$, let $x \\in (A \\cap B)^{c}$. Then $x \\notin A \\cap B$, so it is not true that $x \\in A$ and $x \\in B$. By De Morgan's law for logic, $x \\notin A$ or $x \\notin B$, that is, $x \\in A^{c}$ or $x \\in B^{c}$. Hence $x \\in A^{c} \\cup B^{c}$.\n\nCheck: with $U = \\{1, 2, 3, 4\\}$, $A = \\{1, 2\\}$ and $B = \\{2, 3\\}$, $(A \\cap B)^{c} = \\{1, 3, 4\\}$, and $A^{c} \\cup B^{c} = \\{3, 4\\} \\cup \\{1, 4\\} = \\{1, 3, 4\\}$.\n\nIn this lesson we prove De Morgan's laws for sets by chasing an element in each direction.",
    "要证明 $(A \\cap B)^{c} \\subseteq A^{c} \\cup B^{c}$，设 $x \\in (A \\cap B)^{c}$。则 $x \\notin A \\cap B$，即“$x \\in A$ 且 $x \\in B$”不成立。由逻辑的德摩根律，$x \\notin A$ 或 $x \\notin B$，即 $x \\in A^{c}$ 或 $x \\in B^{c}$。因此 $x \\in A^{c} \\cup B^{c}$。\n\n检验：取 $U = \\{1, 2, 3, 4\\}$，$A = \\{1, 2\\}$，$B = \\{2, 3\\}$，则 $(A \\cap B)^{c} = \\{1, 3, 4\\}$，而 $A^{c} \\cup B^{c} = \\{3, 4\\} \\cup \\{1, 4\\} = \\{1, 3, 4\\}$。\n\n本课我们在每个方向上追踪元素，证明集合的德摩根律。",
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
        'Let $x \\in (A \\cup B)^{c}$. Then $x \\notin A \\cup B$, so it is not true that $x \\in A$ or $x \\in B$. By De Morgan\'s law for logic, $x \\notin A$ and $x \\notin B$, so $x \\in A^{c} \\cap B^{c}$.\n\n> **Watch out.** Negating "$x \\in A$ or $x \\in B$" gives "$x \\notin A$ and $x \\notin B$", not "$x \\notin A$ or $x \\notin B$": the connective changes along with each membership.',
        "设 $x \\in (A \\cup B)^{c}$，则 $x \\notin A \\cup B$，即“$x \\in A$ 或 $x \\in B$”不成立。由逻辑的德摩根律，$x \\notin A$ 且 $x \\notin B$，所以 $x \\in A^{c} \\cap B^{c}$。\n\n> **注意。** “$x \\in A$ 或 $x \\in B$”的否定是“$x \\notin A$ 且 $x \\notin B$”，不是“$x \\notin A$ 或 $x \\notin B$”：每个隶属关系取否定的同时，连接词也要改变。",
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
        "To prove two sets equal, prove each is a subset of the other, taking an arbitrary element of one and showing it lies in the other. For $A^{c} \\cap B^{c} \\subseteq (A \\cup B)^{c}$: let $x \\in A^{c} \\cap B^{c}$. Then $x \\notin A$ and $x \\notin B$, so $x$ is in neither, that is $x \\notin A \\cup B$. Hence $x \\in (A \\cup B)^{c}$.\n\n> **Watch out.** The reverse direction needs its own argument: having shown $(A \\cup B)^{c} \\subseteq A^{c} \\cap B^{c}$ does not by itself give $A^{c} \\cap B^{c} \\subseteq (A \\cup B)^{c}$.",
        "要证明两个集合相等，就证明它们互为子集：任取一个集合中的元素，证明它属于另一个集合。证明 $A^{c} \\cap B^{c} \\subseteq (A \\cup B)^{c}$：设 $x \\in A^{c} \\cap B^{c}$，则 $x \\notin A$ 且 $x \\notin B$，即 $x$ 两个都不在，也就是 $x \\notin A \\cup B$。因此 $x \\in (A \\cup B)^{c}$。\n\n> **注意。** 反方向需要单独论证：证明了 $(A \\cup B)^{c} \\subseteq A^{c} \\cap B^{c}$，并不能直接得到 $A^{c} \\cap B^{c} \\subseteq (A \\cup B)^{c}$。",
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
        const wrongs: [Text, Formula][] = [
          [t(`$x \\in ${setExpr(inner)}$`, `$x \\in ${setExpr(inner)}$`), inner],
          [t(`$x \\notin ${setExpr(swapped)}$`, `$x \\notin ${setExpr(swapped)}$`), not(swapped)],
          [t(`$x \\in ${setExpr(swapped)}$`, `$x \\in ${setExpr(swapped)}$`), swapped],
        ];
        const vars = varsOf(start, f);
        const sample = firstRow(vars, (e) => evaluate(start, e))!;
        const p = pattern(sample, vars);
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove $${setExpr(start)} \\subseteq ${setExpr(f)}$: Let $x \\in ${setExpr(start)}$. Then $${memTex(start, "en")}$, so ____. Hence $x \\in ${setExpr(f)}$. Which statement fills the blank?`,
              `证明 $${setExpr(start)} \\subseteq ${setExpr(f)}$：设 $x \\in ${setExpr(start)}$，则 $${memTex(start, "zh")}$，所以 ____。因此 $x \\in ${setExpr(f)}$。空白处应填哪个命题？`,
            ),
            right,
            wrongs.map(([w]) => w),
            walked(
              [
                [
                  ["Apply De Morgan's law for logic", "应用逻辑的德摩根律"],
                  t(
                    `The statement $${memTex(start, "en")}$ is the negation of $${memTex(inner, "en")}$, so it says exactly that $x \\notin ${setExpr(inner)}$.`,
                    `命题 $${memTex(start, "zh")}$ 是 $${memTex(inner, "zh")}$ 的否定，所以它恰好说明 $x \\notin ${setExpr(inner)}$。`,
                  ),
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    `An element outside $${setExpr(inner)}$ is in its complement, so $x \\in ${setExpr(f)}$.`,
                    `不属于 $${setExpr(inner)}$ 的元素属于它的补集，所以 $x \\in ${setExpr(f)}$。`,
                  ),
                ],
              ],
              t(
                `Take an element with ${p.en}. It is in $${setExpr(start)}$, it is not in $${setExpr(inner)}$, and so it is in $${setExpr(f)}$, as the proof says.`,
                `取满足${p["zh-CN"]}的元素。它属于 $${setExpr(start)}$，不属于 $${setExpr(inner)}$，因而属于 $${setExpr(f)}$，与证明一致。`,
              ),
            ),
          ),
          wrongs.map(([w, s]) => blankReason(w.en, s, start, f)),
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
  intro: t(
    "Take $A = \\{1, 2, 3\\}$, $B = \\{2, 4\\}$ and $C = \\{3, 5\\}$. Then $B \\cup C = \\{2, 3, 4, 5\\}$ and $A \\cap (B \\cup C) = \\{2, 3\\}$. Distributing instead, $A \\cap B = \\{2\\}$ and $A \\cap C = \\{3\\}$, so $(A \\cap B) \\cup (A \\cap C) = \\{2, 3\\}$, the same set.\n\nCheck: each of $2$ and $3$ is in $A$ and in one of $B$, $C$, while $1$ is in $A$ but in neither $B$ nor $C$, so $\\{2, 3\\}$ is right.\n\nIn this lesson we compute with three sets and use the distributive laws to expand and factor set expressions.",
    "取 $A = \\{1, 2, 3\\}$，$B = \\{2, 4\\}$，$C = \\{3, 5\\}$。则 $B \\cup C = \\{2, 3, 4, 5\\}$，$A \\cap (B \\cup C) = \\{2, 3\\}$。改用分配律，$A \\cap B = \\{2\\}$，$A \\cap C = \\{3\\}$，所以 $(A \\cap B) \\cup (A \\cap C) = \\{2, 3\\}$，是同一个集合。\n\n检验：$2$ 与 $3$ 都属于 $A$，且各属于 $B$、$C$ 之一；$1$ 属于 $A$，但 $B$、$C$ 都不在，所以 $\\{2, 3\\}$ 正确。\n\n本课我们进行三个集合的运算，并用分配律展开和提取集合表达式。",
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
        "Parentheses matter: $A \\cap (B \\cup C)$ and $(A \\cap B) \\cup C$ are different sets in general. Compute the inner operation first, or use the distributive law: $A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$.\n\n> **Watch out.** Do not move the brackets. An element of $C$ outside $A$ is in $(A \\cap B) \\cup C$ but not in $A \\cap (B \\cup C)$.",
        "括号很重要：一般而言 $A \\cap (B \\cup C)$ 与 $(A \\cap B) \\cup C$ 是不同的集合。先算括号内的运算，或用分配律：$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$。\n\n> **注意。** 不要挪动括号。$C$ 中不属于 $A$ 的元素属于 $(A \\cap B) \\cup C$，却不属于 $A \\cap (B \\cup C)$。",
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
        const allThree = all.filter((x) => (capFirst ? inA(x) && inB(x) && inC(x) : inA(x) || inB(x) || inC(x)));
        const innerSet = all.filter((x) => (capFirst ? inB(x) || inC(x) : inB(x) && inC(x)));
        const AB = all.filter((x) => (capFirst ? inA(x) && inB(x) : inA(x) || inB(x)));
        const AC = all.filter((x) => (capFirst ? inA(x) && inC(x) : inA(x) || inC(x)));
        const [op, other] = capFirst ? ["\\cap", "\\cup"] : ["\\cup", "\\cap"];
        const expr = `A ${op} (B ${other} C)`;
        const law = `(A ${op} B) ${other} (A ${op} C)`;
        const moved = `(A ${op} B) ${other} C`;
        return setProblem({
          prompt: t(
            `Let $A = ${setTex(A)}$, $B = ${setTex(B)}$ and $C = ${setTex(C)}$. Find $${expr}$.`,
            `设 $A = ${setTex(A)}$，$B = ${setTex(B)}$，$C = ${setTex(C)}$。求 $${expr}$。`,
          ),
          values,
          wrong: [regrouped, allThree],
          mistakes: [
            [
              regrouped,
              `That is $${moved}$: the brackets were moved. Find $B ${other} C$ first, then combine it with $A$.`,
              `这是 $${moved}$：括号被挪动了。应先求 $B ${other} C$，再与 $A$ 运算。`,
            ],
            capFirst
              ? [
                  allThree,
                  "That keeps only the elements in all three sets; an element of $A$ needs to be in just one of $B$ and $C$.",
                  "这只保留了三个集合都有的元素；$A$ 的元素只需属于 $B$、$C$ 之一。",
                ]
              : [
                  allThree,
                  "That is $A \\cup B \\cup C$; an element outside $A$ has to be in both $B$ and $C$.",
                  "这是 $A \\cup B \\cup C$；不在 $A$ 中的元素必须同时属于 $B$ 与 $C$。",
                ],
            [innerSet, `That is $B ${other} C$ only; it still has to be combined with $A$.`, `这只是 $B ${other} C$；还要再与 $A$ 运算。`],
          ],
          solution: walked(
            [
              [["Work out the brackets", "先算括号"], t(`$B ${other} C = ${setTex(innerSet)}$.`, `$B ${other} C = ${setTex(innerSet)}$。`)],
              [
                ["Combine with A", "与 A 运算"],
                t(
                  `$${expr} = A ${op} ${setTex(innerSet)} = ${setTex(values)}$.`,
                  `$${expr} = A ${op} ${setTex(innerSet)} = ${setTex(values)}$。`,
                ),
              ],
            ],
            t(
              `By the distributive law, $${expr} = ${law}$. Here $A ${op} B = ${setTex(AB)}$ and $A ${op} C = ${setTex(AC)}$, and combining them gives $${setTex(values)}$ again.`,
              `由分配律，$${expr} = ${law}$。这里 $A ${op} B = ${setTex(AB)}$，$A ${op} C = ${setTex(AC)}$，二者运算后同样得到 $${setTex(values)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "applying-the-distributive-laws-for-sets",
      title: t("Applying the distributive laws", "应用分配律"),
      explanation: t(
        "Both operations distribute over each other: $A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$. Read right to left, the law factors out a common set.\n\n> **Watch out.** The set outside the brackets goes into both parts: $A \\cup (B \\cap C)$ is $(A \\cup B) \\cap (A \\cup C)$, not $(A \\cup B) \\cap C$.",
        "两种运算可以互相分配：$A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$。从右往左读，分配律可以提取公共的集合。\n\n> **注意。** 括号外的集合要分配到两部分中：$A \\cup (B \\cap C)$ 是 $(A \\cup B) \\cap (A \\cup C)$，不是 $(A \\cup B) \\cap C$。",
      ),
      generate(rng) {
        const f = distributiveForm(rng);
        const g = distribute(f);
        const expand = rng.bool();
        const [src, dst] = expand ? [f, g] : [g, f];
        const wrong = inequivalentTo(rng, src, [...mutations(dst), ...mutations(src)]);
        const outer = f.k === "and" || f.k === "or" ? setExpr(f.a) : "";
        const c = concrete([src, dst]);
        return reasoned(
          oneOf(
            rng,
            t(`Which set equals $${setExpr(src)}$?`, `哪个集合等于 $${setExpr(src)}$？`),
            setOpt(dst),
            wrong.map(setOpt),
            walked(
              [
                [
                  ["Find the shared set", "找出公共集合"],
                  expand
                    ? t(
                        `$${outer}$ stands outside the brackets, so it is combined with each set inside them.`,
                        `$${outer}$ 在括号外，所以要与括号内的每个集合分别运算。`,
                      )
                    : t(
                        `Both brackets contain $${outer}$, so it can be factored out.`,
                        `两个括号中都含 $${outer}$，所以可以把它提取出来。`,
                      ),
                ],
                [["Apply the law", "应用分配律"], t(`$${setExpr(src)} = ${setExpr(dst)}$.`, `$${setExpr(src)} = ${setExpr(dst)}$。`)],
              ],
              t(
                `Try sets in which every way of belonging occurs: ${c.text.en}. Then $${setExpr(src)}$ and $${setExpr(dst)}$ are both $${setTex(c.of(src))}$.`,
                `取各种隶属情形都出现的集合：${c.text["zh-CN"]}。此时 $${setExpr(src)}$ 与 $${setExpr(dst)}$ 都等于 $${setTex(c.of(src))}$。`,
              ),
            ),
          ),
          wrong.map((w) => differs(src, w)),
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
  intro: t(
    "To prove $A \\cup (B \\cap C) \\subseteq (A \\cup B) \\cap (A \\cup C)$, let $x \\in A \\cup (B \\cap C)$. Then $x \\in A$ or ($x \\in B$ and $x \\in C$). By the distributive law for logic, ($x \\in A$ or $x \\in B$) and ($x \\in A$ or $x \\in C$), so $x \\in (A \\cup B) \\cap (A \\cup C)$.\n\nCheck: with $A = \\{1\\}$, $B = \\{2, 3\\}$ and $C = \\{3, 4\\}$, the left set is $\\{1\\} \\cup \\{3\\} = \\{1, 3\\}$ and the right set is $\\{1, 2, 3\\} \\cap \\{1, 3, 4\\} = \\{1, 3\\}$.\n\nIn this lesson we prove the distributive laws for sets by chasing elements, with the distributive law of logic in one direction and cases in the other.",
    "要证明 $A \\cup (B \\cap C) \\subseteq (A \\cup B) \\cap (A \\cup C)$，设 $x \\in A \\cup (B \\cap C)$。则 $x \\in A$ 或（$x \\in B$ 且 $x \\in C$）。由逻辑的分配律，（$x \\in A$ 或 $x \\in B$）且（$x \\in A$ 或 $x \\in C$），所以 $x \\in (A \\cup B) \\cap (A \\cup C)$。\n\n检验：取 $A = \\{1\\}$，$B = \\{2, 3\\}$，$C = \\{3, 4\\}$，左边的集合是 $\\{1\\} \\cup \\{3\\} = \\{1, 3\\}$，右边的集合是 $\\{1, 2, 3\\} \\cap \\{1, 3, 4\\} = \\{1, 3\\}$。\n\n本课我们用元素追踪证明集合的分配律：一个方向用逻辑的分配律，另一个方向分情形讨论。",
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
        "Membership in a combination of sets is a logical statement, so the distributive law of logic proves the matching law for sets. Let $x \\in A \\cap (B \\cup C)$. Then $x \\in A$ and ($x \\in B$ or $x \\in C$). By the distributive law for logic, ($x \\in A$ and $x \\in B$) or ($x \\in A$ and $x \\in C$), so $x \\in (A \\cap B) \\cup (A \\cap C)$.\n\n> **Watch out.** Distributing repeats the outside condition in both parts. Writing ($x \\in A$ and $x \\in B$) or $x \\in C$ drops the condition $x \\in A$ from the second part.",
        "属于若干集合的组合是一个逻辑命题，所以逻辑的分配律可以证明集合相应的分配律。设 $x \\in A \\cap (B \\cup C)$，则 $x \\in A$ 且（$x \\in B$ 或 $x \\in C$）。由逻辑的分配律，（$x \\in A$ 且 $x \\in B$）或（$x \\in A$ 且 $x \\in C$），所以 $x \\in (A \\cap B) \\cup (A \\cap C)$。\n\n> **注意。** 分配时，括号外的条件要在两部分中各写一次。写成（$x \\in A$ 且 $x \\in B$）或 $x \\in C$，就在第二部分漏掉了条件 $x \\in A$。",
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
        "For $(A \\cap B) \\cup (A \\cap C) \\subseteq A \\cap (B \\cup C)$, let $x$ be in the left set and consider two cases. If $x \\in A \\cap B$, then $x \\in A$ and $x \\in B \\subseteq B \\cup C$. If $x \\in A \\cap C$, then $x \\in A$ and $x \\in C \\subseteq B \\cup C$. Either way $x \\in A \\cap (B \\cup C)$.\n\n> **Watch out.** Each case must reach the whole target. In the case $x \\in A \\cap B$, both $x \\in A$ and $x \\in B \\cup C$ have to be shown; one of them is not enough.",
        "证明 $(A \\cap B) \\cup (A \\cap C) \\subseteq A \\cap (B \\cup C)$：设 $x$ 属于左边的集合，分两种情形。若 $x \\in A \\cap B$，则 $x \\in A$ 且 $x \\in B \\subseteq B \\cup C$。若 $x \\in A \\cap C$，则 $x \\in A$ 且 $x \\in C \\subseteq B \\cup C$。无论哪种情形，都有 $x \\in A \\cap (B \\cup C)$。\n\n> **注意。** 每种情形都必须得到完整的目标。在 $x \\in A \\cap B$ 的情形中，$x \\in A$ 与 $x \\in B \\cup C$ 都要证明，只证其一不够。",
      ),
      generate(rng) {
        const [x, y, z] = rng.shuffle(["p", "q", "r", "s"] as const) as [Var, Var, Var];
        const A = names[x];
        const B = names[y];
        const C = names[z];
        const capOverCup = rng.bool();
        const caseSet = rng.bool() ? B : C;
        const inACase = rng.bool();
        const right = capOverCup
          ? t(`$x \\in ${A}$ and $x \\in ${B} \\cup ${C}$`, `$x \\in ${A}$ 且 $x \\in ${B} \\cup ${C}$`)
          : t(`$x \\in ${A} \\cup ${B}$ and $x \\in ${A} \\cup ${C}$`, `$x \\in ${A} \\cup ${B}$ 且 $x \\in ${A} \\cup ${C}$`);
        const left = capOverCup ? `(${A} \\cap ${B}) \\cup (${A} \\cap ${C})` : `${A} \\cup (${B} \\cap ${C})`;
        const target = capOverCup ? `${A} \\cap (${B} \\cup ${C})` : `(${A} \\cup ${B}) \\cap (${A} \\cup ${C})`;
        const bothParts: [string, string] = [
          `With "or", the statement does not give $x \\in ${target}$, which needs both parts to hold.`,
          `用“或”连接，这条命题推不出 $x \\in ${target}$，因为后者要求两部分都成立。`,
        ];
        const wrong: Reason[] = capOverCup
          ? [
              [
                `$x \\in ${A}$ and $x \\in ${B} \\cap ${C}$`,
                `In this case $x$ need not be in both $${B}$ and $${C}$: the case only gives $x \\in ${caseSet}$.`,
                `在这种情形下 $x$ 不一定同时属于 $${B}$ 与 $${C}$：该情形只给出 $x \\in ${caseSet}$。`,
              ],
              [`$x \\in ${A}$ or $x \\in ${B} \\cup ${C}$`, ...bothParts],
              [
                `$x \\in ${caseSet}$ only`,
                `That leaves out $x \\in ${A}$, which membership in $${target}$ also needs.`,
                `这漏掉了 $x \\in ${A}$，而属于 $${target}$ 也需要这一条。`,
              ],
            ]
          : [
              inACase
                ? [
                    `$x \\in ${A} \\cap ${B}$ and $x \\in ${A} \\cap ${C}$`,
                    `In this case $x$ need not be in $${B}$ or in $${C}$; besides, the target only asks for $${A} \\cup ${B}$ and $${A} \\cup ${C}$.`,
                    `在这种情形下 $x$ 不一定属于 $${B}$ 或 $${C}$；而且目标只要求属于 $${A} \\cup ${B}$ 与 $${A} \\cup ${C}$。`,
                  ]
                : [
                    `$x \\in ${A} \\cap ${B}$ and $x \\in ${A} \\cap ${C}$`,
                    `In this case $x$ need not be in $${A}$; besides, the target only asks for $${A} \\cup ${B}$ and $${A} \\cup ${C}$.`,
                    `在这种情形下 $x$ 不一定属于 $${A}$；而且目标只要求属于 $${A} \\cup ${B}$ 与 $${A} \\cup ${C}$。`,
                  ],
              [`$x \\in ${A} \\cup ${B}$ or $x \\in ${A} \\cup ${C}$`, ...bothParts],
              inACase
                ? [
                    `$x \\in ${B} \\cap ${C}$`,
                    `In this case $x$ is known to be in $${A}$, not in $${B}$ or $${C}$.`,
                    `在这种情形下只知道 $x$ 属于 $${A}$，不知道它属于 $${B}$ 或 $${C}$。`,
                  ]
                : [
                    `$x \\in ${B} \\cap ${C}$`,
                    `That only repeats the case; it still has to be shown that $x$ is in $${A} \\cup ${B}$ and in $${A} \\cup ${C}$.`,
                    `这只是重复了该情形；还要证明 $x$ 属于 $${A} \\cup ${B}$ 且属于 $${A} \\cup ${C}$。`,
                  ],
            ];
        const zhOf: Record<string, string> = {
          [`$x \\in ${A}$ and $x \\in ${B} \\cap ${C}$`]: `$x \\in ${A}$ 且 $x \\in ${B} \\cap ${C}$`,
          [`$x \\in ${A}$ or $x \\in ${B} \\cup ${C}$`]: `$x \\in ${A}$ 或 $x \\in ${B} \\cup ${C}$`,
          [`$x \\in ${caseSet}$ only`]: `只有 $x \\in ${caseSet}$`,
          [`$x \\in ${A} \\cap ${B}$ and $x \\in ${A} \\cap ${C}$`]: `$x \\in ${A} \\cap ${B}$ 且 $x \\in ${A} \\cap ${C}$`,
          [`$x \\in ${A} \\cup ${B}$ or $x \\in ${A} \\cup ${C}$`]: `$x \\in ${A} \\cup ${B}$ 或 $x \\in ${A} \\cup ${C}$`,
          [`$x \\in ${B} \\cap ${C}$`]: `$x \\in ${B} \\cap ${C}$`,
        };
        const caseText = capOverCup
          ? t(`Suppose $x \\in ${A} \\cap ${caseSet}$.`, `设 $x \\in ${A} \\cap ${caseSet}$。`)
          : inACase
            ? t(`Suppose $x \\in ${A}$.`, `设 $x \\in ${A}$。`)
            : t(`Suppose $x \\in ${B} \\cap ${C}$.`, `设 $x \\in ${B} \\cap ${C}$。`);
        const partsHold = capOverCup
          ? t(
              `From $x \\in ${A} \\cap ${caseSet}$ we get $x \\in ${A}$, and $x \\in ${caseSet} \\subseteq ${B} \\cup ${C}$.`,
              `由 $x \\in ${A} \\cap ${caseSet}$ 得 $x \\in ${A}$，且 $x \\in ${caseSet} \\subseteq ${B} \\cup ${C}$。`,
            )
          : inACase
            ? t(
                `From $x \\in ${A}$ we get $x \\in ${A} \\cup ${B}$ and $x \\in ${A} \\cup ${C}$, since $${A}$ is inside both.`,
                `由 $x \\in ${A}$ 得 $x \\in ${A} \\cup ${B}$ 且 $x \\in ${A} \\cup ${C}$，因为 $${A}$ 包含于两者。`,
              )
            : t(
                `From $x \\in ${B}$ we get $x \\in ${A} \\cup ${B}$, and from $x \\in ${C}$ we get $x \\in ${A} \\cup ${C}$.`,
                `由 $x \\in ${B}$ 得 $x \\in ${A} \\cup ${B}$，由 $x \\in ${C}$ 得 $x \\in ${A} \\cup ${C}$。`,
              );
        const [fa, fb, fc] = [v(x), v(y), v(z)];
        const leftF = capOverCup ? or(and(fa, fb), and(fa, fc)) : or(fa, and(fb, fc));
        const targetF = capOverCup ? and(fa, or(fb, fc)) : and(or(fa, fb), or(fa, fc));
        const c = concrete([leftF, targetF]);
        return reasoned(
          oneOf(
            rng,
            t(
              `In proving $${left} \\subseteq ${target}$, one case reads: "${caseText.en} Then ____, so $x \\in ${target}$." Which statement fills the blank?`,
              `在证明 $${left} \\subseteq ${target}$ 时，其中一种情形是：“${caseText["zh-CN"]}则 ____，所以 $x \\in ${target}$。”空白处应填哪个命题？`,
            ),
            right,
            wrong.map(([en]) => t(en, zhOf[en]!)),
            walked(
              [
                [
                  ["Unpack the target", "展开目标"],
                  t(`Membership in $${target}$ means ${right.en}.`, `属于 $${target}$ 意味着${right["zh-CN"]}。`),
                ],
                [["Check both parts in this case", "在该情形下检验两部分"], partsHold],
              ],
              t(
                `Try sets in which every way of belonging occurs: ${c.text.en}. Then $${left}$ and $${target}$ are both $${setTex(c.of(leftF))}$, as the two inclusions promise.`,
                `取各种隶属情形都出现的集合：${c.text["zh-CN"]}。此时 $${left}$ 与 $${target}$ 都等于 $${setTex(c.of(leftF))}$，与两个包含关系的结论一致。`,
              ),
            ),
          ),
          wrong,
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
  intro: t(
    "Take $A = \\{1, 2\\}$, $B = \\{3\\}$ and $C = \\{4\\}$. Then $A \\times (B \\cup C) = \\{(1, 3), (1, 4), (2, 3), (2, 4)\\}$. Separately, $A \\times B = \\{(1, 3), (2, 3)\\}$ and $A \\times C = \\{(1, 4), (2, 4)\\}$, and their union is the same four pairs.\n\nCheck: $|A| \\cdot |B \\cup C| = 2 \\cdot 2 = 4$, and four pairs were listed.\n\nIn this lesson we count products of set operations and prove the distributive laws of the Cartesian product by chasing ordered pairs.",
    "取 $A = \\{1, 2\\}$，$B = \\{3\\}$，$C = \\{4\\}$。则 $A \\times (B \\cup C) = \\{(1, 3), (1, 4), (2, 3), (2, 4)\\}$。另一方面，$A \\times B = \\{(1, 3), (2, 3)\\}$，$A \\times C = \\{(1, 4), (2, 4)\\}$，它们的并集正是这四个有序对。\n\n检验：$|A| \\cdot |B \\cup C| = 2 \\cdot 2 = 4$，与列出的四个有序对一致。\n\n本课我们计算集合运算的积集的元素个数，并用追踪有序对的方法证明笛卡儿积的分配律。",
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
        "The size of a Cartesian product is the product of the sizes, so set identities for products become identities of numbers. $|A \\times B| = |A| \\cdot |B|$, so $|A \\times (B \\cup C)| = |A| \\cdot |B \\cup C|$. By the distributive property this is also $|(A \\times B) \\cup (A \\times C)|$.\n\n> **Watch out.** Sizes of products multiply, not add. And $|B \\cup C|$ is not $|B| + |C|$ when $B$ and $C$ share elements: the shared ones would be counted twice.",
        "笛卡儿积的元素个数等于各集合个数的乘积，所以关于乘积的集合恒等式就变成了数的恒等式。$|A \\times B| = |A| \\cdot |B|$，所以 $|A \\times (B \\cup C)| = |A| \\cdot |B \\cup C|$。由分配律，它也等于 $|(A \\times B) \\cup (A \\times C)|$。\n\n> **注意。** 积集的元素个数要相乘，不是相加。并且当 $B$ 与 $C$ 有公共元素时，$|B \\cup C|$ 不等于 $|B| + |C|$：公共元素会被数两次。",
      ),
      generate(rng) {
        const { A, B, C } = twoSets(rng);
        const op = rng.pick(["\\cup", "\\cap", "\\setminus"] as const);
        const inter = B.filter((x) => C.includes(x));
        const diff = B.filter((x) => !C.includes(x));
        const inner = op === "\\cup" ? uniqueSorted([...B, ...C]) : op === "\\cap" ? inter : diff;
        const leftFactor = rng.bool();
        const [pB, pC] = leftFactor ? ["A \\times B", "A \\times C"] : ["B \\times A", "C \\times A"];
        const expr = `(${pB}) ${op} (${pC})`;
        const factored = leftFactor ? `A \\times (B ${op} C)` : `(B ${op} C) \\times A`;
        const [coord, coordZh] = leftFactor ? ["second", "第二个"] : ["first", "第一个"];
        const a = A.length;
        const answer = a * inner.length;
        const check =
          op === "\\cup"
            ? t(
                `Count the pairs of both products and subtract those counted twice: $|A| \\cdot |B| + |A| \\cdot |C| - |A| \\cdot |B \\cap C| = ${a} \\cdot ${B.length} + ${a} \\cdot ${C.length} - ${a} \\cdot ${inter.length} = ${answer}$.`,
                `把两个积集的有序对都数上，再减去数了两次的：$|A| \\cdot |B| + |A| \\cdot |C| - |A| \\cdot |B \\cap C| = ${a} \\cdot ${B.length} + ${a} \\cdot ${C.length} - ${a} \\cdot ${inter.length} = ${answer}$。`,
              )
            : op === "\\cap"
              ? t(
                  `From the $${a} \\cdot ${B.length}$ pairs of $${pB}$, remove those whose ${coord} coordinate is in $B \\setminus C$: $${a} \\cdot ${B.length} - ${a} \\cdot ${diff.length} = ${answer}$.`,
                  `从 $${pB}$ 的 $${a} \\cdot ${B.length}$ 个有序对中，去掉${coordZh}坐标属于 $B \\setminus C$ 的：$${a} \\cdot ${B.length} - ${a} \\cdot ${diff.length} = ${answer}$。`,
                )
              : t(
                  `From the $${a} \\cdot ${B.length}$ pairs of $${pB}$, remove those whose ${coord} coordinate is in $C$ as well: $${a} \\cdot ${B.length} - ${a} \\cdot ${inter.length} = ${answer}$.`,
                  `从 $${pB}$ 的 $${a} \\cdot ${B.length}$ 个有序对中，去掉${coordZh}坐标也属于 $C$ 的：$${a} \\cdot ${B.length} - ${a} \\cdot ${inter.length} = ${answer}$。`,
                );
        const onlyB =
          op === "\\cup"
            ? why(
                a * B.length,
                `That counts only the pairs of $${pB}$; the pairs of $${pC}$ whose ${coord} coordinate is outside $B$ belong too.`,
                `这只数了 $${pB}$ 的有序对；$${pC}$ 中${coordZh}坐标不在 $B$ 中的有序对也属于它。`,
              )
            : op === "\\cap"
              ? why(
                  a * B.length,
                  `That counts all of $${pB}$; only the pairs whose ${coord} coordinate is also in $C$ belong.`,
                  `这数了 $${pB}$ 的全部有序对；只有${coordZh}坐标也属于 $C$ 的才属于它。`,
                )
              : why(
                  a * B.length,
                  `That counts all of $${pB}$; the pairs whose ${coord} coordinate is in $C$ must be removed.`,
                  `这数了 $${pB}$ 的全部有序对；${coordZh}坐标属于 $C$ 的有序对要去掉。`,
                );
        const sum =
          op === "\\cup"
            ? why(
                a * (B.length + C.length),
                "That adds $|B|$ and $|C|$, so the elements of $B \\cap C$ are counted twice.",
                "这把 $|B|$ 与 $|C|$ 相加，$B \\cap C$ 的元素被数了两次。",
              )
            : why(
                a * (B.length + C.length),
                op === "\\cap"
                  ? "That adds the pairs of both products; the intersection keeps only the pairs that lie in both."
                  : "That adds the pairs of both products; the pairs of the second product are to be removed, not added.",
                op === "\\cap"
                  ? "这把两个积集的有序对相加；交集只保留同时属于两者的有序对。"
                  : "这把两个积集的有序对相加；第二个积集的有序对应当去掉，而不是加上。",
              );
        return numberProblem({
          prompt: t(
            `Let $A = ${setTex(A)}$, $B = ${setTex(B)}$ and $C = ${setTex(C)}$. How many ordered pairs are in $${expr}$?`,
            `设 $A = ${setTex(A)}$，$B = ${setTex(B)}$，$C = ${setTex(C)}$。$${expr}$ 中有多少个有序对？`,
          ),
          answer,
          mistakes: [
            sum,
            onlyB,
            why(
              a + inner.length,
              `That adds $|A|$ and $|B ${op} C|$; a product has $|A| \\cdot |B ${op} C|$ pairs.`,
              `这把 $|A|$ 与 $|B ${op} C|$ 相加；积集有 $|A| \\cdot |B ${op} C|$ 个有序对。`,
            ),
          ],
          solution: walked(
            [
              [["Apply the distributive property", "应用分配律"], t(`$${expr} = ${factored}$.`, `$${expr} = ${factored}$。`)],
              [["Work out the operation", "计算集合运算"], t(`$B ${op} C = ${setTex(inner)}$.`, `$B ${op} C = ${setTex(inner)}$。`)],
              [
                ["Count the pairs", "数有序对"],
                t(
                  `$|A| \\cdot |B ${op} C| = ${a} \\cdot ${inner.length} = ${answer}$.`,
                  `$|A| \\cdot |B ${op} C| = ${a} \\cdot ${inner.length} = ${answer}$。`,
                ),
              ],
            ],
            check,
          ),
        });
      },
    },
    {
      id: "chasing-ordered-pairs",
      title: t("Chasing ordered pairs", "追踪有序对"),
      explanation: t(
        'To prove an identity about products of sets, take an arbitrary ordered pair and follow what its membership says about each coordinate. Let $(x, y) \\in A \\times (B \\cup C)$. Then $x \\in A$ and ($y \\in B$ or $y \\in C$). So ($x \\in A$ and $y \\in B$) or ($x \\in A$ and $y \\in C$), that is, $(x, y) \\in A \\times B$ or $(x, y) \\in A \\times C$. Hence $(x, y) \\in (A \\times B) \\cup (A \\times C)$.\n\n> **Watch out.** A product contains pairs, not single coordinates: $(x, y) \\in A \\times B$ means $x \\in A$ and $y \\in B$, while "$x \\in A \\times B$" makes no sense for a coordinate $x$ of $A$.',
        "要证明关于集合乘积的恒等式，任取一个有序对，追踪它的隶属关系对每个坐标意味着什么。设 $(x, y) \\in A \\times (B \\cup C)$，则 $x \\in A$ 且（$y \\in B$ 或 $y \\in C$）。于是（$x \\in A$ 且 $y \\in B$）或（$x \\in A$ 且 $y \\in C$），即 $(x, y) \\in A \\times B$ 或 $(x, y) \\in A \\times C$。因此 $(x, y) \\in (A \\times B) \\cup (A \\times C)$。\n\n> **注意。** 积集的元素是有序对，不是单个坐标：$(x, y) \\in A \\times B$ 表示 $x \\in A$ 且 $y \\in B$，而对 $A$ 中的坐标 $x$ 写“$x \\in A \\times B$”没有意义。",
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
        const flipped = second === "\\in" ? "\\notin" : "\\in";
        const pairIn = (s: string, rel = "\\in") => `(x, y) ${rel} ${A} \\times ${s}`;
        const right = t(`$${pairIn(B)}$ ${en} $${pairIn(C, second)}$`, `$${pairIn(B)}$ ${zh} $${pairIn(C, second)}$`);
        const otherEn = en === "or" ? "and" : "or";
        const otherZh = zh === "或" ? "且" : "或";
        const swappedWord = t(`$${pairIn(B)}$ ${otherEn} $${pairIn(C, second)}$`, `$${pairIn(B)}$ ${otherZh} $${pairIn(C, second)}$`);
        const coordinate = t(
          `$x \\in ${A} \\times ${B}$ ${en} $y \\in ${A} \\times ${C}$`,
          `$x \\in ${A} \\times ${B}$ ${zh} $y \\in ${A} \\times ${C}$`,
        );
        const flip = t(`$${pairIn(B)}$ ${en} $${pairIn(C, flipped)}$`, `$${pairIn(B)}$ ${zh} $${pairIn(C, flipped)}$`);
        const reasons: Reason[] = [
          op === "cup"
            ? [
                swappedWord.en,
                `With "and", $y$ would have to be in both $${B}$ and $${C}$, but the hypothesis only gives one of them.`,
                `用“且”连接，$y$ 就必须同时属于 $${B}$ 与 $${C}$，但条件只给出其中之一。`,
              ]
            : [
                swappedWord.en,
                `"Or" loses information: the target $(${A} \\times ${B}) ${sym} (${A} \\times ${C})$ needs both parts, and the hypothesis gives both.`,
                `“或”丢失了信息：目标 $(${A} \\times ${B}) ${sym} (${A} \\times ${C})$ 需要两部分都成立，而条件恰好给出了两部分。`,
              ],
          [
            coordinate.en,
            `A single coordinate is not an ordered pair, so it cannot be an element of a product; the statement must be about the pair $(x, y)$.`,
            `单个坐标不是有序对，不可能是积集的元素；命题应当针对有序对 $(x, y)$。`,
          ],
          [
            flip.en,
            `The hypothesis gives $y ${second} ${C}$, so the pair is ${second === "\\in" ? "in" : "not in"} $${A} \\times ${C}$.`,
            `条件给出 $y ${second} ${C}$，所以该有序对${second === "\\in" ? "属于" : "不属于"} $${A} \\times ${C}$。`,
          ],
        ];
        const yRel = op === "minus" ? `y \\in ${B}\\text{ and }y \\notin ${C}` : `y \\in ${B}\\text{ ${en} }y \\in ${C}`;
        const yRelZh = op === "minus" ? `y \\in ${B}\\text{ 且 }y \\notin ${C}` : `y \\in ${B}\\text{ ${zh} }y \\in ${C}`;
        const ys = { cup: [3, 4, 5], cap: [4], minus: [3] }[op];
        const pairs = `\\{${[1, 2].flatMap((p) => ys.map((q) => `(${p}, ${q})`)).join(", ")}\\}`;
        const given = `${A} = \\{1, 2\\}$, $${B} = \\{3, 4\\}$, $${C} = \\{4, 5\\}`;
        const givenZh = `${A} = \\{1, 2\\}$，$${B} = \\{3, 4\\}$，$${C} = \\{4, 5\\}`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $(x, y) \\in ${A} \\times (${B} ${sym} ${C})$. Then $x \\in ${A}$ and $(${yRel})$, so ____. Which statement fills the blank?`,
              `设 $(x, y) \\in ${A} \\times (${B} ${sym} ${C})$，则 $x \\in ${A}$ 且 $(${yRelZh})$，所以 ____。空白处应填哪个命题？`,
            ),
            right,
            [swappedWord, coordinate, flip],
            walked(
              [
                [
                  ["Pair the coordinates", "配对坐标"],
                  op === "minus"
                    ? t(
                        `Join $x \\in ${A}$ to each condition on $y$: ($x \\in ${A}$ and $y \\in ${B}$) and ($x \\in ${A}$ and $y \\notin ${C}$).`,
                        `把 $x \\in ${A}$ 与关于 $y$ 的每个条件结合：（$x \\in ${A}$ 且 $y \\in ${B}$）且（$x \\in ${A}$ 且 $y \\notin ${C}$）。`,
                      )
                    : t(
                        `Join $x \\in ${A}$ to each condition on $y$: ($x \\in ${A}$ and $y \\in ${B}$) ${en} ($x \\in ${A}$ and $y \\in ${C}$).`,
                        `把 $x \\in ${A}$ 与关于 $y$ 的每个条件结合：（$x \\in ${A}$ 且 $y \\in ${B}$）${zh}（$x \\in ${A}$ 且 $y \\in ${C}$）。`,
                      ),
                ],
                [
                  ["Read each part as a product", "把每部分读作积集"],
                  t(
                    `Each part is a statement about the pair: ${right.en}. This shows $(x, y) \\in (${A} \\times ${B}) ${sym} (${A} \\times ${C})$.`,
                    `每部分都是关于有序对的命题：${right["zh-CN"]}。这说明 $(x, y) \\in (${A} \\times ${B}) ${sym} (${A} \\times ${C})$。`,
                  ),
                ],
              ],
              t(
                `With $${given}$, both $${A} \\times (${B} ${sym} ${C})$ and $(${A} \\times ${B}) ${sym} (${A} \\times ${C})$ are $${pairs}$.`,
                `取 $${givenZh}$，$${A} \\times (${B} ${sym} ${C})$ 与 $(${A} \\times ${B}) ${sym} (${A} \\times ${C})$ 都等于 $${pairs}$。`,
              ),
            ),
          ),
          reasons,
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
