import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { yesNo } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { domainTex, type Pred, range, setProblem, setTex, truthSet, twoPredicates } from "./methods-of-proof-common.ts";
import {
  and,
  evaluate,
  type Formula,
  iff,
  imp,
  inequivalentTo,
  math,
  not,
  or,
  randomFormula,
  rows,
  TF,
  tex,
  truthOption,
  type Var,
  v,
  varsOf,
} from "./methods-of-proof-logic.ts";

// Methods of Proof unit 1, modules 1.3–1.5: predicates, quantifiers and logical inference.

/** universe picks the domain 1..n. */
const universe = (rng: Rng) => {
  const n = rng.int(10, 16);
  return { n, domain: range(1, n), tex: domainTex(n) };
};

/** setOf writes "\{x \in U : …\}" in words. */
const describe = (p: Text) => t(`the set of $x \\in U$ for which ${p.en}`, `$U$ 中使${p["zh-CN"]}的 $x$ 组成的集合`);

/** joinPreds writes two predicates joined by a connective word. */
const joinPreds = (a: Text, b: Text, en: string, zh: string) => t(`${a.en} ${en} ${b.en}`, `${a["zh-CN"]} ${zh} ${b["zh-CN"]}`);

/** truthSetsOfPredicates finds the set of values that make a predicate true. */
export const truthSetsOfPredicates: TopicDef = {
  id: "truth-sets-of-predicates",
  title: t("Truth Sets of Predicates", "谓词的真值集"),
  summary: t(
    "The truth set of a predicate P(x) over a domain U is {x ∈ U : P(x)}, the set of values that make it true.",
    "谓词 P(x) 在论域 U 上的真值集是 {x ∈ U : P(x)}，即使它为真的所有值组成的集合。",
  ),
  intro: t(
    'The sentence "$x$ is a multiple of $4$" is neither true nor false until $x$ is given a value. Take $U = \\{1, 2, \\dots, 12\\}$ and try each element: $4$, $8$ and $12$ make it true, and the other nine make it false. The values that make it true form the set $\\{4, 8, 12\\}$.\n\nCheck: $3$ values make it true and $9$ make it false, and $3 + 9 = 12$, so every element of $U$ was tried exactly once.\n\nIn this lesson we find the set of values that make a predicate true, first in a small domain and then over the integers.',
    "句子“$x$ 是 $4$ 的倍数”在 $x$ 取定值之前，既不真也不假。取 $U = \\{1, 2, \\dots, 12\\}$，逐个试其中的元素：$4$、$8$、$12$ 使它为真，其余九个使它为假。使它为真的值组成集合 $\\{4, 8, 12\\}$。\n\n检验：有 $3$ 个值使它为真，$9$ 个使它为假，$3 + 9 = 12$，所以 $U$ 的每个元素恰好试了一次。\n\n本课我们求使谓词为真的值组成的集合，先在小的论域中，再在整数上。",
  ),
  prerequisites: ["statements-and-predicates", "describing-sets-using-set-builder-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-truth-sets-in-a-finite-domain",
      title: t("Truth sets in a finite domain", "有限论域中的真值集"),
      explanation: t(
        'A predicate $P(x)$ becomes a statement once $x$ is replaced by a value from the **domain** $U$. Its **truth set** is $\\{x \\in U : P(x)\\}$. With $U = \\{1, 2, \\dots, 10\\}$ and $P(x)$: "$x$ is a multiple of $3$", the truth set is $\\{3, 6, 9\\}$.\n\n> **Watch out.** The truth set holds the values that make the predicate true, not the ones that make it false, and it must hold all of them: test every element of $U$ before writing the set.',
        "谓词 $P(x)$ 中的 $x$ 用**论域** $U$ 中的值代入后就成为命题。它的**真值集**是 $\\{x \\in U : P(x)\\}$。若 $U = \\{1, 2, \\dots, 10\\}$，$P(x)$：“$x$ 是 $3$ 的倍数”，则真值集为 $\\{3, 6, 9\\}$。\n\n> **注意。** 真值集收的是使谓词为真的值，不是使它为假的值，而且要收全：写出集合之前，要检验 $U$ 的每个元素。",
      ),
      generate(rng) {
        const u = universe(rng);
        const [p] = twoPredicates(rng, u.n);
        const set = truthSet(u.domain, p.holds);
        const rest = truthSet(u.domain, (x) => !p.holds(x));
        return setProblem({
          prompt: t(
            `Let $U = ${u.tex}$ and let $P(x)$ be the predicate "${p.text.en}". Find the truth set of $P(x)$.`,
            `设 $U = ${u.tex}$，谓词 $P(x)$ 为“${p.text["zh-CN"]}”。求 $P(x)$ 的真值集。`,
          ),
          values: set,
          wrong: [rest, set.slice(1)],
          mistakes: [
            [rest, "That is the set of values that make the predicate false.", "这是使谓词为假的值组成的集合。"],
            [set.slice(1), `That leaves out $${set[0]}$, which also makes the predicate true.`, `这漏掉了 $${set[0]}$，它也使谓词为真。`],
          ],
          solution: walked(
            [
              [
                ["Test each element", "逐个检验"],
                t(
                  `Go through $1, 2, \\dots, ${u.n}$ and keep the values for which ${p.text.en}: ${set.length === 0 ? "there are none" : `$${set.join(", ")}$`}.`,
                  `依次检验 $1, 2, \\dots, ${u.n}$，留下使${p.text["zh-CN"]}的值：${set.length === 0 ? "一个也没有" : `$${set.join(", ")}$`}。`,
                ),
              ],
              [["Write the set", "写出集合"], t(`The truth set is $${setTex(set)}$.`, `真值集为 $${setTex(set)}$。`)],
            ],
            t(
              `The values that fail are $${setTex(rest)}$. The two sets have $${set.length}$ and $${rest.length}$ elements, and $${set.length} + ${rest.length} = ${u.n}$, so every element of $U$ is in exactly one of them.`,
              `不满足的值是 $${setTex(rest)}$。两个集合分别有 $${set.length}$ 个和 $${rest.length}$ 个元素，$${set.length} + ${rest.length} = ${u.n}$，所以 $U$ 的每个元素恰在其中一个集合里。`,
            ),
          ),
        });
      },
    },
    {
      id: "finding-truth-sets-over-the-integers",
      title: t("Truth sets over the integers", "整数上的真值集"),
      explanation: t(
        "The truth set of a predicate is the set of elements of the universe that make it true, so list exactly those integers, including the negative ones. Over $\\mathbb{Z}$ a truth set can still be finite. $\\{x \\in \\mathbb{Z} : x^2 < 10\\} = \\{-3, -2, -1, 0, 1, 2, 3\\}$, since $3^2 = 9 < 10$ but $4^2 = 16 \\ge 10$.\n\n> **Watch out.** Over $\\mathbb{Z}$ the negative integers and $0$ count too. Test the boundary values themselves: a strict inequality leaves them out, and a weak one keeps them.",
        "谓词的真值集是论域中使它为真的元素的集合，所以要准确列出这些整数，包括负整数。在 $\\mathbb{Z}$ 上真值集也可能是有限的。$\\{x \\in \\mathbb{Z} : x^2 < 10\\} = \\{-3, -2, -1, 0, 1, 2, 3\\}$，因为 $3^2 = 9 < 10$，而 $4^2 = 16 \\ge 10$。\n\n> **注意。** 在 $\\mathbb{Z}$ 上，负整数和 $0$ 也要算。要检验边界值本身：严格不等式不含边界，非严格不等式含边界。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const c = rng.int(2, 40);
          const r = Math.ceil(Math.sqrt(c)) - 1;
          const values = range(-r, r);
          return setProblem({
            prompt: t(`Find the truth set of $x^2 < ${c}$ over $\\mathbb{Z}$.`, `求 $x^2 < ${c}$ 在 $\\mathbb{Z}$ 上的真值集。`),
            values,
            wrong: [range(0, r), range(-r - 1, r + 1), range(1, r)],
            mistakes: [
              [
                range(0, r),
                "That leaves out the negative integers, whose squares are just as small.",
                "这漏掉了负整数，它们的平方同样小。",
              ],
              [
                range(-r - 1, r + 1),
                `That includes $\\pm ${r + 1}$, but $${r + 1}^2 = ${(r + 1) ** 2}$ is not less than $${c}$.`,
                `这包含了 $\\pm ${r + 1}$，但 $${r + 1}^2 = ${(r + 1) ** 2}$ 不小于 $${c}$。`,
              ],
              [range(1, r), "That leaves out $0$ and the negative integers.", "这漏掉了 $0$ 和负整数。"],
            ],
            solution: walked(
              [
                [
                  ["Find the largest size that works", "找出满足条件的最大绝对值"],
                  t(
                    `$${r}^2 = ${r * r} < ${c}$ but $${r + 1}^2 = ${(r + 1) ** 2} \\ge ${c}$, so $x^2 < ${c}$ holds exactly when $|x| \\le ${r}$.`,
                    `$${r}^2 = ${r * r} < ${c}$，而 $${r + 1}^2 = ${(r + 1) ** 2} \\ge ${c}$，所以 $x^2 < ${c}$ 恰当 $|x| \\le ${r}$ 时成立。`,
                  ),
                ],
                [
                  ["List the integers", "列出整数"],
                  t(
                    `The integers with $|x| \\le ${r}$ run from $${-r}$ to $${r}$: $${setTex(values)}$.`,
                    `满足 $|x| \\le ${r}$ 的整数从 $${-r}$ 到 $${r}$：$${setTex(values)}$。`,
                  ),
                ],
              ],
              t(
                `$x = ${-r}$ gives $${r * r} < ${c}$, inside; $x = ${-r - 1}$ gives $${(r + 1) ** 2} \\ge ${c}$, outside. The set has $${2 * r + 1}$ elements, $${r}$ on each side of $0$.`,
                `$x = ${-r}$ 得 $${r * r} < ${c}$，在集合内；$x = ${-r - 1}$ 得 $${(r + 1) ** 2} \\ge ${c}$，在集合外。集合有 $${2 * r + 1}$ 个元素，$0$ 两侧各 $${r}$ 个。`,
              ),
            ),
          });
        }
        const a = rng.int(-6, 6);
        const b = rng.int(1, 3);
        const strict = rng.bool();
        const values = strict ? range(a - b + 1, a + b - 1) : range(a - b, a + b);
        const other = strict ? range(a - b, a + b) : range(a - b + 1, a + b - 1);
        const rel = strict ? "<" : "\\le";
        const shown = a === 0 ? "|x|" : `|x ${a > 0 ? "-" : "+"} ${Math.abs(a)}|`;
        const reach = strict ? b - 1 : b;
        return setProblem({
          prompt: t(
            `Find the truth set of $${shown} ${rel} ${b}$ over $\\mathbb{Z}$.`,
            `求 $${shown} ${rel} ${b}$ 在 $\\mathbb{Z}$ 上的真值集。`,
          ),
          values,
          wrong: [other, range(a, a + b)],
          mistakes: [
            strict
              ? [
                  other,
                  `That includes $${a - b}$ and $${a + b}$, which are at distance exactly $${b}$ from $${a}$, not less.`,
                  `这包含了 $${a - b}$ 和 $${a + b}$，它们与 $${a}$ 的距离恰为 $${b}$，并不小于 $${b}$。`,
                ]
              : [
                  other,
                  `That leaves out $${a - b}$ and $${a + b}$, which are at distance exactly $${b}$ from $${a}$ and so satisfy $\\le$.`,
                  `这漏掉了 $${a - b}$ 和 $${a + b}$，它们与 $${a}$ 的距离恰为 $${b}$，满足 $\\le$。`,
                ],
            [
              range(a, a + b),
              `That only goes to the right of $${a}$; the distance counts on both sides.`,
              `这只取了 $${a}$ 右侧的数；距离在两侧都要算。`,
            ],
          ],
          solution: walked(
            [
              [
                ["Read it as a distance", "看成距离"],
                t(
                  `$${shown}$ is the distance from $x$ to $${a}$, so the predicate says that distance is ${strict ? "less than" : "at most"} $${b}$${strict ? `, that is at most $${b - 1}$ for integers` : ""}.`,
                  `$${shown}$ 是 $x$ 到 $${a}$ 的距离，所以谓词是说这个距离${strict ? "小于" : "不超过"} $${b}$${strict ? `，对整数即不超过 $${b - 1}$` : ""}。`,
                ),
              ],
              [
                ["List the integers", "列出整数"],
                t(`Go $${reach}$ either side of $${a}$: $${setTex(values)}$.`, `在 $${a}$ 两侧各取 $${reach}$ 步：$${setTex(values)}$。`),
              ],
            ],
            t(
              `At $x = ${a + b}$ the distance is exactly $${b}$, and $${b} ${rel} ${b}$ is ${strict ? "false, so it is left out" : "true, so it is kept"}. The set has $${2 * reach + 1}$ elements, as $${reach}$ steps either side of the centre give.`,
              `$x = ${a + b}$ 时距离恰为 $${b}$，而 $${b} ${rel} ${b}$ ${strict ? "不成立，所以不含它" : "成立，所以含它"}。集合有 $${2 * reach + 1}$ 个元素，与中心两侧各 $${reach}$ 步相符。`,
            ),
          ),
        });
      },
    },
  ],
};

/** said writes whether a value satisfies a predicate: '"$x$ is even" is true'. */
const said = (p: Pred, x: number) =>
  t(`"${p.text.en}" is ${p.holds(x) ? "true" : "false"}`, `“${p.text["zh-CN"]}”${p.holds(x) ? "为真" : "为假"}`);

/** WrongRule is a typical wrong combination of two predicates, with what it gets wrong in English and Chinese. */
type WrongRule = readonly [holds: (p: boolean, q: boolean) => boolean, en: string, zh: string];

/** combinedSetProblem asks for the truth set of a combination of two predicates. */
function combinedSetProblem(
  rng: Rng,
  label: (p: Pred, q: Pred) => Text,
  holds: (p: boolean, q: boolean) => boolean,
  rule: Text,
  wrongs: readonly WrongRule[],
): Problem {
  const u = universe(rng);
  const [p, q] = twoPredicates(rng, u.n);
  const value = (f: (a: boolean, b: boolean) => boolean) => truthSet(u.domain, (x) => f(p.holds(x), q.holds(x)));
  const set = value(holds);
  const pSet = truthSet(u.domain, p.holds);
  const qSet = truthSet(u.domain, q.holds);
  const desc = label(p, q);
  const inside = set[0];
  const outside = u.domain.find((x) => !set.includes(x));
  const tried = [inside, outside].filter((x): x is number => x !== undefined);
  return setProblem({
    prompt: t(`Let $U = ${u.tex}$. Find ${describe(desc).en}.`, `设 $U = ${u.tex}$。求${describe(desc)["zh-CN"]}。`),
    values: set,
    wrong: wrongs.map(([f]) => value(f)),
    mistakes: wrongs.map(([f, en, zh]) => [value(f), en, zh] as const),
    solution: walked(
      [
        [
          ["Find the two truth sets", "求两个真值集"],
          t(
            `Let $A = ${setTex(pSet)}$ be the truth set of "${p.text.en}" and $B = ${setTex(qSet)}$ that of "${q.text.en}".`,
            `设 $A = ${setTex(pSet)}$ 为“${p.text["zh-CN"]}”的真值集，$B = ${setTex(qSet)}$ 为“${q.text["zh-CN"]}”的真值集。`,
          ),
        ],
        [["Combine them", "组合"], t(`${rule.en} This gives $${setTex(set)}$.`, `${rule["zh-CN"]}得到 $${setTex(set)}$。`)],
      ],
      t(
        `Try values directly. ${tried
          .map((x) => `For $x = ${x}$, ${said(p, x).en} and ${said(q, x).en}, so $${x}$ is ${set.includes(x) ? "in" : "not in"} the set.`)
          .join(" ")}`,
        `直接代值检验。${tried
          .map(
            (x) => `$x = ${x}$ 时，${said(p, x)["zh-CN"]}，${said(q, x)["zh-CN"]}，所以 $${x}$ ${set.includes(x) ? "在" : "不在"}集合中。`,
          )
          .join("")}`,
      ),
    ),
  });
}

/** theAndAndOrConnectivesWithPredicates combines predicates with ∧ and ∨. */
export const theAndAndOrConnectivesWithPredicates: TopicDef = {
  id: "the-and-and-or-connectives-with-predicates",
  title: t("The AND and OR Connectives With Predicates", "谓词的“且”与“或”"),
  summary: t(
    "The truth set of P(x) ∧ Q(x) is the intersection of the truth sets; that of P(x) ∨ Q(x) is their union.",
    "P(x) ∧ Q(x) 的真值集是两个真值集的交集；P(x) ∨ Q(x) 的真值集是它们的并集。",
  ),
  intro: t(
    'In $U = \\{1, 2, \\dots, 10\\}$, "$x$ is even" has truth set $A = \\{2, 4, 6, 8, 10\\}$ and "$x > 6$" has $B = \\{7, 8, 9, 10\\}$. A value makes "$x$ is even and $x > 6$" true when it is in both sets: $\\{8, 10\\}$. It makes "$x$ is even or $x > 6$" true when it is in at least one: $\\{2, 4, 6, 7, 8, 9, 10\\}$.\n\nCheck: the "or" set should have $|A| + |B| - |A \\cap B| = 5 + 4 - 2 = 7$ elements, and it does.\n\nIn this lesson we find the truth sets of predicates joined by "and" and "or" as intersections and unions.',
    "在 $U = \\{1, 2, \\dots, 10\\}$ 中，“$x$ 是偶数”的真值集是 $A = \\{2, 4, 6, 8, 10\\}$，“$x > 6$”的是 $B = \\{7, 8, 9, 10\\}$。一个值同时属于两个集合时，使“$x$ 是偶数且 $x > 6$”为真：$\\{8, 10\\}$。至少属于其中一个时，使“$x$ 是偶数或 $x > 6$”为真：$\\{2, 4, 6, 7, 8, 9, 10\\}$。\n\n检验：“或”的集合应有 $|A| + |B| - |A \\cap B| = 5 + 4 - 2 = 7$ 个元素，确实如此。\n\n本课我们把用“且”“或”连接的谓词的真值集求成交集与并集。",
  ),
  prerequisites: ["truth-sets-of-predicates", "the-and-and-or-connectives"],
  encompasses: [{ topic: "truth-sets-of-predicates", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-conjunctions",
      title: t("Truth sets of conjunctions", "合取的真值集"),
      explanation: t(
        'If $A$ and $B$ are the truth sets of $P(x)$ and $Q(x)$, then $P(x) \\wedge Q(x)$ is true exactly for the elements in both: its truth set is $A \\cap B$. With $A = \\{2, 4, 6\\}$ and $B = \\{4, 5, 6\\}$ it is $\\{4, 6\\}$.\n\n> **Watch out.** "And" keeps only the elements in both sets. Putting every element of either set in gives the truth set of "or" instead.',
        "若 $A$、$B$ 分别是 $P(x)$、$Q(x)$ 的真值集，则 $P(x) \\wedge Q(x)$ 恰对同时属于两者的元素为真：其真值集为 $A \\cap B$。若 $A = \\{2, 4, 6\\}$，$B = \\{4, 5, 6\\}$，它就是 $\\{4, 6\\}$。\n\n> **注意。** “且”只保留同时属于两个集合的元素。把任一集合的元素都放进来，得到的是“或”的真值集。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => joinPreds(p.text, q.text, "and", "且"),
          (a, b) => a && b,
          t("The conjunction is true on the elements in both: $A \\cap B$.", "合取在同时属于两者的元素上为真：$A \\cap B$。"),
          [
            [
              (a, b) => a || b,
              'That is the union, the truth set of "or"; "and" needs both predicates true.',
              "这是并集，即“或”的真值集；“且”要求两个谓词都为真。",
            ],
            [(a) => a, "That checks only the first predicate; the second must hold as well.", "这只检验了第一个谓词；第二个也必须成立。"],
          ],
        ),
    },
    {
      id: "truth-sets-of-disjunctions",
      title: t("Truth sets of disjunctions", "析取的真值集"),
      explanation: t(
        'An element satisfies an or statement when it satisfies either part, so the truth set collects the elements of both truth sets. $P(x) \\vee Q(x)$ is true when at least one of the predicates is: its truth set is $A \\cup B$. With $A = \\{2, 4, 6\\}$ and $B = \\{4, 5, 6\\}$ it is $\\{2, 4, 5, 6\\}$.\n\n> **Watch out.** "Or" in mathematics is inclusive: an element in both sets belongs to the union too. Do not drop the elements the two sets share.',
        "一个元素满足“或”命题，只要它满足其中一部分，所以真值集汇集了两个真值集中的元素。$P(x) \\vee Q(x)$ 只要其中一个谓词为真就为真：其真值集为 $A \\cup B$。若 $A = \\{2, 4, 6\\}$，$B = \\{4, 5, 6\\}$，它就是 $\\{2, 4, 5, 6\\}$。\n\n> **注意。** 数学中的“或”是相容的：同时属于两个集合的元素也属于并集。不要丢掉两个集合共有的元素。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => joinPreds(p.text, q.text, "or", "或"),
          (a, b) => a || b,
          t("The disjunction is true on the elements in at least one: $A \\cup B$.", "析取在至少属于其中一个的元素上为真：$A \\cup B$。"),
          [
            [
              (a, b) => a && b,
              'That is the intersection, the truth set of "and"; "or" needs only one predicate true.',
              "这是交集，即“且”的真值集；“或”只要一个谓词为真。",
            ],
            [
              (a, b) => a !== b,
              'That drops the elements that satisfy both predicates; "or" includes them.',
              "这丢掉了同时满足两个谓词的元素；“或”包含它们。",
            ],
          ],
        ),
    },
  ],
};

/** theNotConnectiveWithPredicates negates predicates. */
export const theNotConnectiveWithPredicates: TopicDef = {
  id: "the-not-connective-with-predicates",
  title: t("The NOT Connective With Predicates", "谓词的“非”"),
  summary: t(
    "The truth set of ¬P(x) is the complement of the truth set of P(x) in the domain.",
    "¬P(x) 的真值集是 P(x) 的真值集在论域中的补集。",
  ),
  intro: t(
    'In $U = \\{1, 2, \\dots, 8\\}$, "$x$ is prime" has truth set $\\{2, 3, 5, 7\\}$. Its negation, "$x$ is not prime", is true exactly where the original is false, so its truth set is what is left of $U$: $\\{1, 4, 6, 8\\}$.\n\nCheck: the two sets have no element in common, and together they make up all $8$ elements of $U$.\n\nIn this lesson we find the truth set of a negated predicate as a complement, then combine a negated predicate with another.',
    "在 $U = \\{1, 2, \\dots, 8\\}$ 中，“$x$ 是质数”的真值集是 $\\{2, 3, 5, 7\\}$。它的否定“$x$ 不是质数”恰在原谓词为假处为真，所以它的真值集是 $U$ 中剩下的部分：$\\{1, 4, 6, 8\\}$。\n\n检验：两个集合没有公共元素，合起来恰是 $U$ 的全部 $8$ 个元素。\n\n本课我们把否定谓词的真值集求成补集，再把否定谓词与另一谓词组合。",
  ),
  prerequisites: ["the-and-and-or-connectives-with-predicates", "set-complements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-negations",
      title: t("Truth sets of negations", "否定的真值集"),
      explanation: t(
        "Negating a predicate swaps true and false for every element, so its truth set is everything in the universe outside the original truth set. $\\neg P(x)$ is true exactly where $P(x)$ is false, so its truth set is $A^{c} = U \\setminus A$. In $U = \\{1, \\dots, 6\\}$ with $A = \\{2, 4, 6\\}$, it is $\\{1, 3, 5\\}$.\n\n> **Watch out.** The complement is taken inside the domain $U$: list the elements of $U$ that are not in $A$, all of them and nothing from outside $U$.",
        "否定一个谓词会使每个元素的真假互换，所以它的真值集是论域中原真值集以外的所有元素。$\\neg P(x)$ 恰在 $P(x)$ 为假处为真，所以其真值集为 $A^{c} = U \\setminus A$。在 $U = \\{1, \\dots, 6\\}$ 中，若 $A = \\{2, 4, 6\\}$，它就是 $\\{1, 3, 5\\}$。\n\n> **注意。** 补集是在论域 $U$ 内取的：列出 $U$ 中不属于 $A$ 的元素，一个不漏，也不要 $U$ 以外的元素。",
      ),
      generate(rng) {
        const u = universe(rng);
        const [p] = twoPredicates(rng, u.n);
        const set = truthSet(u.domain, p.holds);
        const comp = truthSet(u.domain, (x) => !p.holds(x));
        return setProblem({
          prompt: t(
            `Let $U = ${u.tex}$ and let $P(x)$ be "${p.text.en}". Find the truth set of $\\neg P(x)$.`,
            `设 $U = ${u.tex}$，$P(x)$ 为“${p.text["zh-CN"]}”。求 $\\neg P(x)$ 的真值集。`,
          ),
          values: comp,
          wrong: [set, ...(comp.length > 1 ? [comp.slice(1)] : [])],
          mistakes: [
            [set, "That is the truth set of $P(x)$ itself, not of its negation.", "这是 $P(x)$ 本身的真值集，不是其否定的。"],
            ...(comp.length > 1
              ? [
                  [
                    comp.slice(1),
                    `That leaves out $${comp[0]}$, where $P(x)$ is false.`,
                    `这漏掉了 $${comp[0]}$，那里 $P(x)$ 为假。`,
                  ] as const,
                ]
              : []),
          ],
          solution: walked(
            [
              [
                ["Find the truth set of $P(x)$", "求 $P(x)$ 的真值集"],
                t(`${p.text.en} exactly for $x \\in ${setTex(set)}$.`, `恰当 $x \\in ${setTex(set)}$ 时${p.text["zh-CN"]}。`),
              ],
              [
                ["Take the complement in $U$", "在 $U$ 中取补集"],
                t(
                  `$\\neg P(x)$ is true where $P(x)$ is false: $${setTex(comp)}$.`,
                  `$\\neg P(x)$ 在 $P(x)$ 为假处为真：$${setTex(comp)}$。`,
                ),
              ],
            ],
            t(
              `The two sets share no element and have $${set.length} + ${comp.length} = ${u.n}$ elements together, all of $U$.`,
              `两个集合没有公共元素，合起来有 $${set.length} + ${comp.length} = ${u.n}$ 个元素，恰是整个 $U$。`,
            ),
          ),
        });
      },
    },
    {
      id: "truth-sets-with-a-negated-predicate",
      title: t("Combining with a negated predicate", "与否定谓词组合"),
      explanation: t(
        'Combine the rules for and, or and not step by step, turning each logical operation into the matching set operation. The truth set of $P(x) \\wedge \\neg Q(x)$ is $A \\cap B^{c} = A \\setminus B$, and that of $P(x) \\vee \\neg Q(x)$ is $A \\cup B^{c}$. With $U = \\{1, \\dots, 6\\}$, $A = \\{2, 4, 6\\}$ and $B = \\{4, 5, 6\\}$: $A \\setminus B = \\{2\\}$ and $A \\cup B^{c} = \\{1, 2, 3, 4, 6\\}$.\n\n> **Watch out.** Take the complement of $B$ before combining. Combining with $B$ itself answers the question without the "not".',
        "把“与”“或”“非”的规则一步一步结合起来，把每个逻辑运算转化为相应的集合运算。$P(x) \\wedge \\neg Q(x)$ 的真值集为 $A \\cap B^{c} = A \\setminus B$，$P(x) \\vee \\neg Q(x)$ 的真值集为 $A \\cup B^{c}$。若 $U = \\{1, \\dots, 6\\}$，$A = \\{2, 4, 6\\}$，$B = \\{4, 5, 6\\}$：$A \\setminus B = \\{2\\}$，$A \\cup B^{c} = \\{1, 2, 3, 4, 6\\}$。\n\n> **注意。** 先求 $B$ 的补集再组合。直接与 $B$ 组合，回答的是去掉“非”之后的问题。",
      ),
      generate(rng) {
        const isAnd = rng.bool();
        return combinedSetProblem(
          rng,
          (p, q) => joinPreds(p.text, q.negation, isAnd ? "and" : "or", isAnd ? "且" : "或"),
          isAnd ? (a, b) => a && !b : (a, b) => a || !b,
          isAnd
            ? t(
                "The second part is true on $B^{c}$, so the statement is true on $A \\cap B^{c} = A \\setminus B$.",
                "第二部分在 $B^{c}$ 上为真，所以该命题在 $A \\cap B^{c} = A \\setminus B$ 上为真。",
              )
            : t(
                "The second part is true on $B^{c}$, so the statement is true on $A \\cup B^{c}$.",
                "第二部分在 $B^{c}$ 上为真，所以该命题在 $A \\cup B^{c}$ 上为真。",
              ),
          isAnd
            ? [
                [
                  (a, b) => a && b,
                  "That uses $B$ instead of its complement; the second part is negated.",
                  "这用了 $B$ 而不是它的补集；第二部分是否定的。",
                ],
                [
                  (a, b) => !a && !b,
                  "That negates the first part as well; only the second is negated.",
                  "这把第一部分也否定了；只有第二部分是否定的。",
                ],
              ]
            : [
                [
                  (a, b) => a || b,
                  "That uses $B$ instead of its complement; the second part is negated.",
                  "这用了 $B$ 而不是它的补集；第二部分是否定的。",
                ],
                [
                  (a, b) => a && !b,
                  'That is the truth set of "and"; "or" needs only one part true.',
                  "这是“且”的真值集；“或”只要一部分为真。",
                ],
              ],
        );
      },
    },
  ],
};
/** simplifyingPredicateExpressionsUsingDeMorgansLaws negates compound predicates. */
export const simplifyingPredicateExpressionsUsingDeMorgansLaws: TopicDef = {
  id: "simplifying-predicate-expressions-using-de-morgans-laws",
  title: t("Simplifying Predicate Expressions Using De Morgan's Laws", "用德摩根律化简谓词表达式"),
  summary: t(
    "¬(P(x) ∧ Q(x)) ≡ ¬P(x) ∨ ¬Q(x) and ¬(P(x) ∨ Q(x)) ≡ ¬P(x) ∧ ¬Q(x).",
    "¬(P(x) ∧ Q(x)) ≡ ¬P(x) ∨ ¬Q(x)，¬(P(x) ∨ Q(x)) ≡ ¬P(x) ∧ ¬Q(x)。",
  ),
  intro: t(
    'When is "$x$ is even and $x > 5$" false? It fails as soon as one part fails: when $x$ is odd, or when $x \\le 5$. So its negation is "$x$ is odd or $x \\le 5$": both parts are negated, and "and" becomes "or". This is De Morgan\'s law, applied to predicates for each value of $x$.\n\nCheck: at $x = 8$ the original is true and "$8$ is odd or $8 \\le 5$" is false; at $x = 3$ the original is false and "$3$ is odd or $3 \\le 5$" is true. The two always disagree, as a negation must.\n\nIn this lesson we negate predicates joined by "and" and "or", and find the truth sets of such negations.',
    "“$x$ 是偶数且 $x > 5$”什么时候为假？只要有一部分不成立它就不成立：$x$ 是奇数时，或 $x \\le 5$ 时。所以它的否定是“$x$ 是奇数或 $x \\le 5$”：两部分都取否定，“且”变成“或”。这就是德摩根律，对 $x$ 的每个值用于谓词。\n\n检验：$x = 8$ 时原命题为真，而“$8$ 是奇数或 $8 \\le 5$”为假；$x = 3$ 时原命题为假，而“$3$ 是奇数或 $3 \\le 5$”为真。两者总是相反，否定本应如此。\n\n本课我们否定用“且”“或”连接的谓词，并求这些否定的真值集。",
  ),
  prerequisites: ["the-not-connective-with-predicates", "de-morgans-laws-for-logic"],
  encompasses: [{ topic: "the-not-connective-with-predicates", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-compound-predicates",
      title: t("Negating compound predicates", "否定复合谓词"),
      explanation: t(
        'De Morgan\'s laws hold for predicates, for each value of $x$: $\\neg(P(x) \\wedge Q(x)) \\equiv \\neg P(x) \\vee \\neg Q(x)$ and $\\neg(P(x) \\vee Q(x)) \\equiv \\neg P(x) \\wedge \\neg Q(x)$. The negation of "$x$ is even and $x > 4$" is "$x$ is odd or $x \\le 4$".\n\n> **Watch out.** Two changes are needed, never one: negate both predicates and switch the connective. Negating the parts but keeping "and" gives a different statement.',
        "德摩根律对谓词同样成立（对每个 $x$ 都成立）：$\\neg(P(x) \\wedge Q(x)) \\equiv \\neg P(x) \\vee \\neg Q(x)$，$\\neg(P(x) \\vee Q(x)) \\equiv \\neg P(x) \\wedge \\neg Q(x)$。“$x$ 是偶数且 $x > 4$”的否定是“$x$ 是奇数或 $x \\le 4$”。\n\n> **注意。** 要做两处改动，缺一不可：两个谓词都取否定，并且换联结词。只否定两部分而保留“且”，得到的是另一个命题。",
      ),
      generate(rng) {
        const [p, q] = twoPredicates(rng, 20);
        const isAnd = rng.bool();
        const [w, wz, ow, owz] = isAnd ? ["and", "且", "or", "或"] : ["or", "或", "and", "且"];
        const keepConnective = joinPreds(p.negation, q.negation, w, wz);
        const onlyFirst = joinPreds(p.negation, q.text, ow, owz);
        const onlySecond = joinPreds(p.text, q.negation, w, wz);
        const x = rng.int(1, 20);
        const original = isAnd ? p.holds(x) && q.holds(x) : p.holds(x) || q.holds(x);
        return reasoned(
          oneOf(
            rng,
            t(
              `Which predicate is equivalent to the negation of "${p.text.en} ${w} ${q.text.en}"?`,
              `哪个谓词等价于“${p.text["zh-CN"]} ${wz} ${q.text["zh-CN"]}”的否定？`,
            ),
            joinPreds(p.negation, q.negation, ow, owz),
            [keepConnective, onlyFirst, onlySecond],
            walked(
              [
                [
                  ["Apply De Morgan's law", "用德摩根律"],
                  t(
                    `The negation of a statement joined by "${w}" is the negations of its parts joined by "${ow}".`,
                    `用“${wz}”连接的命题，其否定是各部分的否定用“${owz}”连接。`,
                  ),
                ],
                [
                  ["Negate each predicate", "否定每个谓词"],
                  t(
                    `The negation of "${p.text.en}" is "${p.negation.en}", and of "${q.text.en}" is "${q.negation.en}". So the answer is "${p.negation.en} ${ow} ${q.negation.en}".`,
                    `“${p.text["zh-CN"]}”的否定是“${p.negation["zh-CN"]}”，“${q.text["zh-CN"]}”的否定是“${q.negation["zh-CN"]}”。所以答案是“${p.negation["zh-CN"]} ${owz} ${q.negation["zh-CN"]}”。`,
                  ),
                ],
              ],
              t(
                `Try $x = ${x}$: the original statement is ${original ? "true" : "false"}, and "${p.negation.en} ${ow} ${q.negation.en}" is ${original ? "false" : "true"}. They disagree, as a negation must.`,
                `试 $x = ${x}$：原命题为${original ? "真" : "假"}，而“${p.negation["zh-CN"]} ${owz} ${q.negation["zh-CN"]}”为${original ? "假" : "真"}。两者相反，否定本应如此。`,
              ),
            ),
          ),
          [
            [
              keepConnective.en,
              `That negates both parts but keeps "${w}"; the connective must change to "${ow}".`,
              `这否定了两部分，却保留了“${wz}”；联结词必须改为“${owz}”。`,
            ],
            [onlyFirst.en, "That negates only the first predicate; both must be negated.", "这只否定了第一个谓词；两个都必须否定。"],
            [onlySecond.en, `That negates only the second predicate and keeps "${w}".`, `这只否定了第二个谓词，并保留了“${wz}”。`],
          ],
        );
      },
    },
    {
      id: "truth-sets-of-negated-compound-predicates",
      title: t("Truth sets of negated compounds", "否定复合谓词的真值集"),
      explanation: t(
        'The truth set of $\\neg(P(x) \\vee Q(x))$ is $(A \\cup B)^{c} = A^{c} \\cap B^{c}$: the elements where both predicates fail. The truth set of $\\neg(P(x) \\wedge Q(x))$ is $(A \\cap B)^{c} = A^{c} \\cup B^{c}$: the elements where at least one fails. In $U = \\{1, \\dots, 6\\}$ with $A = \\{2, 4, 6\\}$ and $B = \\{4, 5, 6\\}$, $(A \\cup B)^{c} = \\{1, 3\\}$.\n\n> **Watch out.** The negation of "and" needs only one predicate to fail, while the negation of "or" needs both to fail. Mixing them up swaps $\\cup$ and $\\cap$.',
        "$\\neg(P(x) \\vee Q(x))$ 的真值集为 $(A \\cup B)^{c} = A^{c} \\cap B^{c}$：两个谓词都不成立的元素。$\\neg(P(x) \\wedge Q(x))$ 的真值集为 $(A \\cap B)^{c} = A^{c} \\cup B^{c}$：至少一个不成立的元素。在 $U = \\{1, \\dots, 6\\}$ 中，若 $A = \\{2, 4, 6\\}$，$B = \\{4, 5, 6\\}$，则 $(A \\cup B)^{c} = \\{1, 3\\}$。\n\n> **注意。** “且”的否定只需一个谓词不成立，“或”的否定需要两个都不成立。弄混了就会把 $\\cup$ 和 $\\cap$ 换错。",
      ),
      generate(rng) {
        const isAnd = rng.bool();
        const [w, wz] = isAnd ? ["and", "且"] : ["or", "或"];
        return combinedSetProblem(
          rng,
          (p, q) => t(`it is not true that ${p.text.en} ${w} ${q.text.en}`, `“${p.text["zh-CN"]} ${wz} ${q.text["zh-CN"]}”不成立`),
          isAnd ? (a, b) => !(a && b) : (a, b) => !(a || b),
          isAnd
            ? t(
                "By De Morgan's laws the statement is true where at least one predicate fails: $(A \\cap B)^{c} = A^{c} \\cup B^{c}$.",
                "由德摩根律，该命题在至少一个谓词不成立处为真：$(A \\cap B)^{c} = A^{c} \\cup B^{c}$。",
              )
            : t(
                "By De Morgan's laws the statement is true where both predicates fail: $(A \\cup B)^{c} = A^{c} \\cap B^{c}$.",
                "由德摩根律，该命题在两个谓词都不成立处为真：$(A \\cup B)^{c} = A^{c} \\cap B^{c}$。",
              ),
          isAnd
            ? [
                [
                  (a, b) => !a && !b,
                  'That needs both predicates to fail, which negates "or"; the negation of "and" needs only one to fail.',
                  "这要求两个谓词都不成立，是“或”的否定；“且”的否定只需一个不成立。",
                ],
                [
                  (a, b) => a && b,
                  "That is where the statement inside holds, not where it fails.",
                  "这是括号内命题成立的地方，而不是不成立的地方。",
                ],
              ]
            : [
                [
                  (a, b) => !a || !b,
                  'That needs only one predicate to fail, which negates "and"; the negation of "or" needs both to fail.',
                  "这只需一个谓词不成立，是“且”的否定；“或”的否定需要两个都不成立。",
                ],
                [
                  (a, b) => a || b,
                  "That is where the statement inside holds, not where it fails.",
                  "这是括号内命题成立的地方，而不是不成立的地方。",
                ],
              ],
        );
      },
    },
  ],
};

/** conditionalStatementsWithPredicates studies P(x) ⇒ Q(x). */
export const conditionalStatementsWithPredicates: TopicDef = {
  id: "conditional-statements-with-predicates",
  title: t("Conditional Statements With Predicates", "谓词的条件命题"),
  summary: t(
    "P(x) ⇒ Q(x) is true where P(x) is false or Q(x) is true, so its truth set is Aᶜ ∪ B.",
    "P(x) ⇒ Q(x) 在 P(x) 为假或 Q(x) 为真处为真，所以其真值集为 Aᶜ ∪ B。",
  ),
  intro: t(
    'Take $U = \\{1, 2, \\dots, 8\\}$ and the claim "if $x$ is even, then $x > 3$". It can only be broken by an even $x$ that is not greater than $3$, and $2$ is the only one. Every other value keeps the claim: $4, 6, 8$ because they are even and greater than $3$, and the odd values because the claim says nothing about them. So it is true for $\\{1, 3, 4, 5, 6, 7, 8\\}$ and false only at $2$.\n\nCheck: $7$ true values and $1$ false value make $8$, all of $U$.\n\nIn this lesson we find where a conditional between predicates is true, and the values that make it false.',
    "取 $U = \\{1, 2, \\dots, 8\\}$ 和断言“如果 $x$ 是偶数，那么 $x > 3$”。只有不大于 $3$ 的偶数 $x$ 才能推翻它，而只有 $2$ 是这样的数。其余每个值都使断言成立：$4, 6, 8$ 是因为它们是偶数且大于 $3$，奇数是因为断言对它们没有要求。所以它对 $\\{1, 3, 4, 5, 6, 7, 8\\}$ 为真，只在 $2$ 处为假。\n\n检验：$7$ 个真值与 $1$ 个假值共 $8$ 个，恰是整个 $U$。\n\n本课我们求谓词之间的条件命题在哪里为真，以及使它为假的值。",
  ),
  prerequisites: ["the-not-connective-with-predicates", "conditional-statements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-conditional-predicates",
      title: t("Truth sets of conditionals", "条件命题的真值集"),
      explanation: t(
        "A conditional is false only when the hypothesis holds and the conclusion fails, so it is true everywhere except the part of the first set outside the second. Since $P(x) \\Rightarrow Q(x) \\equiv \\neg P(x) \\vee Q(x)$, its truth set is $A^{c} \\cup B$: every $x$ outside $A$, plus every $x$ in $B$. In $U = \\{1, \\dots, 6\\}$ with $A = \\{2, 4, 6\\}$ and $B = \\{4, 5, 6\\}$, it is $\\{1, 3, 4, 5, 6\\}$: only $2$ breaks it.\n\n> **Watch out.** Values outside $A$ make the conditional true, because they do not meet the hypothesis. Leaving them out keeps only part of the truth set.",
        "条件句只有在前提成立而结论不成立时才为假，所以除了第一个集合中不属于第二个集合的部分，它处处为真。由于 $P(x) \\Rightarrow Q(x) \\equiv \\neg P(x) \\vee Q(x)$，其真值集为 $A^{c} \\cup B$：不在 $A$ 中的所有 $x$，加上 $B$ 中的所有 $x$。在 $U = \\{1, \\dots, 6\\}$ 中，若 $A = \\{2, 4, 6\\}$，$B = \\{4, 5, 6\\}$，它就是 $\\{1, 3, 4, 5, 6\\}$：只有 $2$ 推翻它。\n\n> **注意。** 不在 $A$ 中的值使条件命题为真，因为它们不满足前提。漏掉它们，就只得到真值集的一部分。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => t(`"if ${p.text.en}, then ${q.text.en}" is true`, `“如果 ${p.text["zh-CN"]}，那么 ${q.text["zh-CN"]}”为真`),
          (a, b) => !a || b,
          t(
            "The conditional fails only on $A \\setminus B$, so it is true on the rest of $U$: $A^{c} \\cup B$.",
            "条件命题只在 $A \\setminus B$ 上不成立，所以在 $U$ 的其余部分为真：$A^{c} \\cup B$。",
          ),
          [
            [
              (a, b) => a && b,
              "That keeps only the values where both hold; the conditional is also true wherever the hypothesis is false.",
              "这只保留了两者都成立的值；凡前提为假处，条件命题也为真。",
            ],
            [
              (_, b) => b,
              "That leaves out the values where the hypothesis is false, which make the conditional true.",
              "这漏掉了前提为假的值，它们使条件命题为真。",
            ],
            [
              (a, b) => a || !b,
              "That is the truth set of the converse, with hypothesis and conclusion swapped.",
              "这是逆命题的真值集，前提与结论互换了。",
            ],
          ],
        ),
    },
    {
      id: "values-that-make-a-conditional-false",
      title: t("Values that make a conditional false", "使条件命题为假的值"),
      explanation: t(
        "$P(x) \\Rightarrow Q(x)$ is false exactly when $P(x)$ is true and $Q(x)$ is false, that is on $A \\cap B^{c} = A \\setminus B$. These values are the **counterexamples** to the conditional. With $A = \\{2, 4, 6\\}$ and $B = \\{4, 5, 6\\}$, the only counterexample is $2$.\n\n> **Watch out.** A value that fails the hypothesis is never a counterexample, whatever the conclusion does. Look only inside $A$.",
        "$P(x) \\Rightarrow Q(x)$ 恰在 $P(x)$ 真而 $Q(x)$ 假时为假，即在 $A \\cap B^{c} = A \\setminus B$ 上。这些值就是该条件命题的**反例**。若 $A = \\{2, 4, 6\\}$，$B = \\{4, 5, 6\\}$，唯一的反例是 $2$。\n\n> **注意。** 不满足前提的值永远不是反例，不论结论如何。只在 $A$ 中找。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => t(`"if ${p.text.en}, then ${q.text.en}" is false`, `“如果 ${p.text["zh-CN"]}，那么 ${q.text["zh-CN"]}”为假`),
          (a, b) => a && !b,
          t(
            "The conditional is false where the hypothesis holds and the conclusion fails: $A \\setminus B$.",
            "条件命题在前提成立而结论不成立处为假：$A \\setminus B$。",
          ),
          [
            [
              (a, b) => !a && b,
              "That has the hypothesis false and the conclusion true, where the conditional is true.",
              "这是前提为假、结论为真的值，那里条件命题为真。",
            ],
            [(a, b) => a && b, "There both hold, so the conditional is true.", "那里两者都成立，所以条件命题为真。"],
            [
              (_, b) => !b,
              "That also takes values where the hypothesis is false, and those make the conditional true.",
              "这还取了前提为假的值，它们使条件命题为真。",
            ],
          ],
        ),
    },
  ],
};
/** letters picks two distinct statement letters. */
const twoLetters = (rng: Rng): [Formula, Formula] => {
  const [a, b] = rng.shuffle(["p", "q", "r", "s"] as const);
  return [v(a!), v(b!)];
};

/** Condition classifies how one condition relates to another. */
type Condition = "sufficient" | "necessary" | "both" | "neither";

/** conditionNames are the options for classifying a condition. */
const conditionNames: Record<Condition, Text> = {
  sufficient: t("Sufficient but not necessary", "充分不必要"),
  necessary: t("Necessary but not sufficient", "必要不充分"),
  both: t("Both necessary and sufficient", "充分必要"),
  neither: t("Neither necessary nor sufficient", "既不充分也不必要"),
};

/** necessaryAndSufficientConditions relates conditions to implications. */
export const necessaryAndSufficientConditions: TopicDef = {
  id: "necessary-and-sufficient-conditions",
  title: t("Necessary and Sufficient Conditions", "充分条件与必要条件"),
  summary: t(
    "p is sufficient for q when p ⇒ q, necessary for q when q ⇒ p, and both when p ⇔ q.",
    "若 p ⇒ q，则 p 是 q 的充分条件；若 q ⇒ p，则 p 是 q 的必要条件；若 p ⇔ q，则二者兼具。",
  ),
  intro: t(
    'For a whole number $n$, compare "$n$ ends in $0$" with "$n$ is even". Ending in $0$ is enough to be even, so it is a **sufficient** condition: "ends in $0$" $\\Rightarrow$ "even". It is not needed, though: $4$ is even and does not end in $0$. Being even, on the other hand, is a **necessary** condition for ending in $0$: no number ends in $0$ without being even.\n\nCheck: the two descriptions are the same implication read from each end. "Ending in $0$ is sufficient for being even" and "being even is necessary for ending in $0$" both say "ends in $0$" $\\Rightarrow$ "even".\n\nIn this lesson we write conditions as implications and classify one condition as sufficient, necessary, both or neither for another.',
    "对整数 $n$，比较“$n$ 的末位是 $0$”与“$n$ 是偶数”。末位是 $0$ 足以保证是偶数，所以它是**充分**条件：“末位是 $0$”$\\Rightarrow$“偶数”。但它不是必需的：$4$ 是偶数，末位却不是 $0$。反过来，是偶数是末位为 $0$ 的**必要**条件：不是偶数的数，末位不可能是 $0$。\n\n检验：这两种说法是同一个蕴涵从两端读。“末位是 $0$ 是偶数的充分条件”与“是偶数是末位为 $0$ 的必要条件”说的都是“末位是 $0$”$\\Rightarrow$“偶数”。\n\n本课我们把条件写成蕴涵，并判断一个条件是另一个的充分、必要、充要条件，还是两者都不是。",
  ),
  prerequisites: ["biconditional-statements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "conditions-as-implications",
      title: t("Conditions as implications", "用蕴涵表示条件"),
      explanation: t(
        '"$p$ is a **sufficient** condition for $q$" means $p \\Rightarrow q$: knowing $p$ is enough to get $q$. "$p$ is a **necessary** condition for $q$" means $q \\Rightarrow p$: $q$ cannot hold without $p$. "Necessary and sufficient" means $p \\Leftrightarrow q$. Being a square is sufficient for being a rectangle, and being a rectangle is necessary for being a square: both say "square" $\\Rightarrow$ "rectangle".\n\n> **Watch out.** A necessary condition is the conclusion of the implication, not its hypothesis. "$p$ is necessary for $q$" is $q \\Rightarrow p$, with the arrow pointing to $p$.',
        "“$p$ 是 $q$ 的**充分**条件”表示 $p \\Rightarrow q$：有 $p$ 就足以得到 $q$。“$p$ 是 $q$ 的**必要**条件”表示 $q \\Rightarrow p$：没有 $p$ 就不可能有 $q$。“充分必要”表示 $p \\Leftrightarrow q$。是正方形是是矩形的充分条件，是矩形是是正方形的必要条件：两者说的都是“正方形”$\\Rightarrow$“矩形”。\n\n> **注意。** 必要条件是蕴涵的结论，不是前提。“$p$ 是 $q$ 的必要条件”是 $q \\Rightarrow p$，箭头指向 $p$。",
      ),
      generate(rng) {
        const [a, b] = twoLetters(rng);
        const kind = rng.pick(["sufficient", "necessary", "both"] as const);
        const words = {
          sufficient: t("a sufficient condition", "充分条件"),
          necessary: t("a necessary condition", "必要条件"),
          both: t("a necessary and sufficient condition", "充分必要条件"),
        }[kind];
        const right = kind === "sufficient" ? imp(a, b) : kind === "necessary" ? imp(b, a) : iff(a, b);
        // ¬q ⇒ ¬p says the same as p ⇒ q, so the contrapositive offered must not be that of the right answer.
        const contrapositive = kind === "necessary" ? imp(not(b), not(a)) : imp(not(a), not(b));
        const wrong = [imp(a, b), imp(b, a), iff(a, b), contrapositive].filter((f) => tex(f) !== tex(right));
        const [ta, tb] = [tex(a), tex(b)];
        const oneWay = kind === "both";
        const reasons: Reason[] = [
          [
            math(imp(a, b)).en,
            oneWay
              ? "That gives only one direction; a necessary and sufficient condition needs both."
              : `That says $${ta}$ is sufficient for $${tb}$.`,
            oneWay ? "这只给出一个方向；充分必要条件需要两个方向。" : `这说的是 $${ta}$ 是 $${tb}$ 的充分条件。`,
          ],
          [
            math(imp(b, a)).en,
            oneWay
              ? "That gives only one direction; a necessary and sufficient condition needs both."
              : `That says $${ta}$ is necessary for $${tb}$.`,
            oneWay ? "这只给出一个方向；充分必要条件需要两个方向。" : `这说的是 $${ta}$ 是 $${tb}$ 的必要条件。`,
          ],
          [math(iff(a, b)).en, "That claims both directions; only one is meant here.", "这断言了两个方向；这里只说了一个方向。"],
          [
            math(contrapositive).en,
            kind === "necessary"
              ? `This is the contrapositive of $${ta} \\Rightarrow ${tb}$, so it says $${ta}$ is sufficient.`
              : `This is equivalent to $${tb} \\Rightarrow ${ta}$, which says $${ta}$ is necessary${oneWay ? ", only one direction" : ""}.`,
            kind === "necessary"
              ? `这是 $${ta} \\Rightarrow ${tb}$ 的逆否命题，说的是 $${ta}$ 是充分条件。`
              : `这与 $${tb} \\Rightarrow ${ta}$ 等价，说的是 $${ta}$ 是必要条件${oneWay ? "，只有一个方向" : ""}。`,
          ],
        ];
        return reasoned(
          oneOf(
            rng,
            t(`Which statement means "$${ta}$ is ${words.en} for $${tb}$"?`, `哪个命题表示“$${ta}$ 是 $${tb}$ 的${words["zh-CN"]}”？`),
            math(right),
            wrong.map(math),
            walked(
              [
                [
                  ["Recall the meaning", "回忆含义"],
                  kind === "sufficient"
                    ? t(
                        "A sufficient condition is enough to give the other statement, so it is the hypothesis.",
                        "充分条件足以推出另一命题，所以它是前提。",
                      )
                    : kind === "necessary"
                      ? t(
                          "A necessary condition is needed by the other statement, so the other statement implies it: it is the conclusion.",
                          "必要条件是另一命题所必需的，所以另一命题蕴涵它：它是结论。",
                        )
                      : t(
                          "A necessary and sufficient condition implies the other statement and is implied by it.",
                          "充分必要条件蕴涵另一命题，也被另一命题蕴涵。",
                        ),
                ],
                [["Write it in symbols", "写成符号"], t(`The statement is $${tex(right)}$.`, `该命题为 $${tex(right)}$。`)],
              ],
              kind === "sufficient"
                ? t(
                    `Read $${ta} \\Rightarrow ${tb}$ back: whenever $${ta}$ holds, $${tb}$ follows, so $${ta}$ is enough for $${tb}$.`,
                    `把 $${ta} \\Rightarrow ${tb}$ 读回去：只要 $${ta}$ 成立，$${tb}$ 就成立，所以 $${ta}$ 足以保证 $${tb}$。`,
                  )
                : kind === "necessary"
                  ? t(
                      `Read $${tb} \\Rightarrow ${ta}$ through its contrapositive $\\neg ${ta} \\Rightarrow \\neg ${tb}$: without $${ta}$ there is no $${tb}$, so $${tb}$ needs $${ta}$.`,
                      `通过逆否命题 $\\neg ${ta} \\Rightarrow \\neg ${tb}$ 读 $${tb} \\Rightarrow ${ta}$：没有 $${ta}$ 就没有 $${tb}$，所以 $${tb}$ 需要 $${ta}$。`,
                    )
                  : t(
                      `$${ta} \\Leftrightarrow ${tb}$ contains $${ta} \\Rightarrow ${tb}$, which makes $${ta}$ sufficient, and $${tb} \\Rightarrow ${ta}$, which makes it necessary.`,
                      `$${ta} \\Leftrightarrow ${tb}$ 包含 $${ta} \\Rightarrow ${tb}$，使 $${ta}$ 成为充分条件；也包含 $${tb} \\Rightarrow ${ta}$，使它成为必要条件。`,
                    ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "classifying-conditions",
      title: t("Classifying conditions", "判断条件类型"),
      explanation: t(
        'To classify condition $A$ for $B$, ask two questions: does $A$ imply $B$ (sufficient)? does $B$ imply $A$ (necessary)? For integers $x$, "$x$ is a multiple of $6$" is sufficient but not necessary for "$x$ is even": $6 \\mid x$ forces $x$ even, but $x = 4$ is even without being a multiple of $6$.\n\n> **Watch out.** Answer both questions separately. One implication holding says nothing about the other: a single counterexample settles a direction that fails.',
        "判断 $A$ 是 $B$ 的什么条件，要问两个问题：$A$ 是否蕴涵 $B$（充分）？$B$ 是否蕴涵 $A$（必要）？对整数 $x$，“$x$ 是 $6$ 的倍数”是“$x$ 是偶数”的充分不必要条件：$6 \\mid x$ 必然使 $x$ 为偶数，但 $x = 4$ 是偶数却不是 $6$ 的倍数。\n\n> **注意。** 两个问题要分别回答。一个方向的蕴涵成立，对另一个方向什么也没说明：一个反例就能否定不成立的方向。",
      ),
      generate(rng) {
        let a: Text;
        let b: Text;
        let ab: boolean;
        let ba: boolean;
        let forward: Text;
        let backward: Text;
        let check: Text;
        if (rng.bool()) {
          const divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15];
          const k = rng.pick(divisors);
          const m = rng.pick(divisors.filter((v) => v !== k));
          a = t(`$x$ is a multiple of $${k}$`, `$x$ 是 $${k}$ 的倍数`);
          b = t(`$x$ is a multiple of $${m}$`, `$x$ 是 $${m}$ 的倍数`);
          ab = k % m === 0;
          ba = m % k === 0;
          forward = ab
            ? t(
                `Yes: $${m} \\mid ${k}$, so every multiple of $${k}$ is a multiple of $${m}$.`,
                `是：$${m} \\mid ${k}$，所以 $${k}$ 的倍数都是 $${m}$ 的倍数。`,
              )
            : t(
                `No: $x = ${k}$ is a multiple of $${k}$ but not of $${m}$, since $${m} \\nmid ${k}$.`,
                `否：$x = ${k}$ 是 $${k}$ 的倍数，但不是 $${m}$ 的倍数，因为 $${m} \\nmid ${k}$。`,
              );
          backward = ba
            ? t(
                `Yes: $${k} \\mid ${m}$, so every multiple of $${m}$ is a multiple of $${k}$.`,
                `是：$${k} \\mid ${m}$，所以 $${m}$ 的倍数都是 $${k}$ 的倍数。`,
              )
            : t(
                `No: $x = ${m}$ is a multiple of $${m}$ but not of $${k}$, since $${k} \\nmid ${m}$.`,
                `否：$x = ${m}$ 是 $${m}$ 的倍数，但不是 $${k}$ 的倍数，因为 $${k} \\nmid ${m}$。`,
              );
          check = t(
            `List the positive multiples: of $${k}$, $${k}, ${2 * k}, ${3 * k}, \\dots$; of $${m}$, $${m}, ${2 * m}, ${3 * m}, \\dots$. The first list ${ab ? "lies inside" : "is not inside"} the second, and the second ${ba ? "lies inside" : "is not inside"} the first.`,
            `列出正倍数：$${k}$ 的倍数 $${k}, ${2 * k}, ${3 * k}, \\dots$；$${m}$ 的倍数 $${m}, ${2 * m}, ${3 * m}, \\dots$。第一列${ab ? "包含于" : "不包含于"}第二列，第二列${ba ? "包含于" : "不包含于"}第一列。`,
          );
        } else {
          const p = rng.int(-5, 9);
          const q = rng.bool(0.3) ? p : rng.int(-5, 9);
          a = t(`$x > ${p}$`, `$x > ${p}$`);
          b = p === q ? t(`$x \\ge ${p + 1}$`, `$x \\ge ${p + 1}$`) : t(`$x > ${q}$`, `$x > ${q}$`);
          ab = p >= q;
          ba = q >= p;
          const bTex = p === q ? `x \\ge ${p + 1}` : `x > ${q}`;
          forward = ab
            ? t(
                p === q ? `Yes: for an integer, $x > ${p}$ means $x \\ge ${p + 1}$.` : `Yes: $x > ${p}$ and $${p} > ${q}$ give $x > ${q}$.`,
                p === q ? `是：对整数，$x > ${p}$ 就是 $x \\ge ${p + 1}$。` : `是：$x > ${p}$ 且 $${p} > ${q}$，得 $x > ${q}$。`,
              )
            : t(`No: $x = ${p + 1}$ satisfies $x > ${p}$ but not $x > ${q}$.`, `否：$x = ${p + 1}$ 满足 $x > ${p}$，但不满足 $x > ${q}$。`);
          backward = ba
            ? t(
                p === q ? `Yes: $x \\ge ${p + 1}$ gives $x > ${p}$.` : `Yes: $x > ${q}$ and $${q} > ${p}$ give $x > ${p}$.`,
                p === q ? `是：$x \\ge ${p + 1}$ 得 $x > ${p}$。` : `是：$x > ${q}$ 且 $${q} > ${p}$，得 $x > ${p}$。`,
              )
            : t(`No: $x = ${q + 1}$ satisfies $x > ${q}$ but not $x > ${p}$.`, `否：$x = ${q + 1}$ 满足 $x > ${q}$，但不满足 $x > ${p}$。`);
          check = t(
            `Compare the truth sets: $x > ${p}$ holds for the integers from $${p + 1}$ up, and $${bTex}$ for those from $${(p === q ? p : q) + 1}$ up. ${p === q ? "They are the same set." : `The set that starts later, from $${Math.max(p, q) + 1}$, lies inside the other.`}`,
            `比较真值集：$x > ${p}$ 对从 $${p + 1}$ 起的整数成立，$${bTex}$ 对从 $${(p === q ? p : q) + 1}$ 起的整数成立。${p === q ? "两者是同一个集合。" : `起点较晚的集合（从 $${Math.max(p, q) + 1}$ 起）包含于另一个。`}`,
          );
        }
        const claims: Record<Condition, readonly [boolean, boolean]> = {
          sufficient: [true, false],
          necessary: [false, true],
          both: [true, true],
          neither: [false, false],
        };
        const kind: Condition = ab && ba ? "both" : ab ? "sufficient" : ba ? "necessary" : "neither";
        const reasons = (Object.keys(claims) as Condition[]).map((c): Reason => {
          const [cab] = claims[c];
          const [x, y, holds] = cab !== ab ? [a, b, ab] : [b, a, ba];
          return [
            conditionNames[c].en,
            holds
              ? `That denies that "${x.en}" implies "${y.en}", but it does.`
              : `That needs "${x.en}" to imply "${y.en}", but it does not.`,
            holds
              ? `这否认了“${x["zh-CN"]}”蕴涵“${y["zh-CN"]}”，但它确实蕴涵。`
              : `这要求“${x["zh-CN"]}”蕴涵“${y["zh-CN"]}”，但它并不蕴涵。`,
          ];
        });
        return reasoned(
          oneOf(
            rng,
            t(
              `For integers $x$, what kind of condition is "${a.en}" for "${b.en}"?`,
              `对整数 $x$，“${a["zh-CN"]}”是“${b["zh-CN"]}”的什么条件？`,
            ),
            conditionNames[kind],
            Object.values(conditionNames).filter((n) => n !== conditionNames[kind]),
            walked(
              [
                [
                  ["Test sufficiency", "检验充分性"],
                  t(`Does "${a.en}" imply "${b.en}"? ${forward.en}`, `“${a["zh-CN"]}”是否蕴涵“${b["zh-CN"]}”？${forward["zh-CN"]}`),
                ],
                [
                  ["Test necessity", "检验必要性"],
                  t(
                    `Does "${b.en}" imply "${a.en}"? ${backward.en} So it is ${conditionNames[kind].en.toLowerCase()}.`,
                    `“${b["zh-CN"]}”是否蕴涵“${a["zh-CN"]}”？${backward["zh-CN"]}所以是${conditionNames[kind]["zh-CN"]}条件。`,
                  ),
                ],
              ],
              check,
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** Construction is a way of phrasing a conditional; parts gives the hypothesis and conclusion. */
interface Construction {
  readonly phrase: (a: string, b: string) => Text;
  /** forward is true when the construction means a ⇒ b, false when it means b ⇒ a. */
  readonly meaning: "forward" | "backward" | "unless";
}

/** constructions are common English phrasings of conditionals. */
const constructions: readonly Construction[] = [
  { phrase: (a, b) => t(`${a} only if ${b}`, `${a}仅当${b}`), meaning: "forward" },
  { phrase: (a, b) => t(`${a} if ${b}`, `${a}，如果${b}`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} whenever ${b}`, `每当${b}时，${a}`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} is sufficient for ${b}`, `${a}是${b}的充分条件`), meaning: "forward" },
  { phrase: (a, b) => t(`${a} is necessary for ${b}`, `${a}是${b}的必要条件`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} provided that ${b}`, `只要${b}，就${a}`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} unless ${b}`, `除非${b}，否则${a}`), meaning: "unless" },
];

/** Fact is a true implication between two mathematical properties, with a case where its converse fails. */
interface Fact {
  readonly a: Text;
  readonly b: Text;
  /** counter describes a case with b true and a false. */
  readonly counter: Text;
}

/** fact picks a true implication a ⇒ b whose converse fails. */
function fact(rng: Rng): Fact {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const k = rng.int(2, 5);
    const m = rng.int(2, 4);
    return {
      a: t(`$n$ is divisible by $${k * m}$`, `$n$ 能被 $${k * m}$ 整除`),
      b: t(`$n$ is divisible by $${k}$`, `$n$ 能被 $${k}$ 整除`),
      counter: t(`$n = ${k}$ is divisible by $${k}$ but not by $${k * m}$`, `$n = ${k}$ 能被 $${k}$ 整除，却不能被 $${k * m}$ 整除`),
    };
  }
  if (kind === 1) {
    const b = rng.int(-5, 8);
    const a = b + rng.int(1, 6);
    return {
      a: t(`$x > ${a}$`, `$x > ${a}$`),
      b: t(`$x > ${b}$`, `$x > ${b}$`),
      counter: t(`$x = ${a}$ satisfies $x > ${b}$ but not $x > ${a}$`, `$x = ${a}$ 满足 $x > ${b}$，却不满足 $x > ${a}$`),
    };
  }
  if (kind === 2) {
    const a = rng.int(1, 9);
    return {
      a: t(`$x = ${a}$`, `$x = ${a}$`),
      b: t(`$x^2 = ${a * a}$`, `$x^2 = ${a * a}$`),
      counter: t(`$x = ${-a}$ satisfies $x^2 = ${a * a}$ but is not $${a}$`, `$x = ${-a}$ 满足 $x^2 = ${a * a}$，却不等于 $${a}$`),
    };
  }
  return rng.pick([
    {
      a: t("$ABCD$ is a square", "$ABCD$ 是正方形"),
      b: t("$ABCD$ is a rectangle", "$ABCD$ 是矩形"),
      counter: t("a $1 \\times 2$ rectangle is not a square", "$1 \\times 2$ 的矩形不是正方形"),
    },
    {
      a: t("$\\triangle ABC$ is equilateral", "$\\triangle ABC$ 是等边三角形"),
      b: t("$\\triangle ABC$ is isosceles", "$\\triangle ABC$ 是等腰三角形"),
      counter: t(
        "a triangle with sides $2, 2, 3$ is isosceles but not equilateral",
        "边长为 $2, 2, 3$ 的三角形是等腰三角形，却不是等边三角形",
      ),
    },
    {
      a: t("$f$ is differentiable at $a$", "$f$ 在 $a$ 处可导"),
      b: t("$f$ is continuous at $a$", "$f$ 在 $a$ 处连续"),
      counter: t("$f(x) = |x|$ is continuous at $0$ but not differentiable there", "$f(x) = |x|$ 在 $0$ 处连续，却不可导"),
    },
  ]);
}

/** grammaticalConstructionsForConditionalStatements reads the many English phrasings of p ⇒ q. */
export const grammaticalConstructionsForConditionalStatements: TopicDef = {
  id: "grammatical-constructions-for-conditional-statements",
  title: t("Grammatical Constructions for Conditional Statements", "条件命题的语法结构"),
  summary: t(
    '"p only if q", "q if p", "q whenever p" and "q provided that p" all mean p ⇒ q; "p unless q" means ¬q ⇒ p.',
    "“p 仅当 q”、“q，如果 p”、“每当 p 时，q”、“只要 p，就 q”都表示 p ⇒ q；“除非 q，否则 p”表示 ¬q ⇒ p。",
  ),
  intro: t(
    'The sentences "a number is divisible by $4$ only if it is even" and "a number is even if it is divisible by $4$" put the two parts in opposite orders, yet they say the same thing: if a number is divisible by $4$, then it is even. The word order does not show which part is the hypothesis; the small words "if" and "only if" do. "If" introduces the hypothesis, and "only if" introduces the conclusion.\n\nCheck: the one case that would break the claim is a number divisible by $4$ that is odd. Both sentences rule out exactly that case, so they say the same thing.\n\nIn this lesson we translate the common phrasings of conditionals into symbols and into "if … then …" form.',
    "句子“一个数能被 $4$ 整除，仅当它是偶数”和“一个数是偶数，如果它能被 $4$ 整除”两部分的次序相反，说的却是同一件事：如果一个数能被 $4$ 整除，那么它是偶数。语序并不说明哪部分是前提；“如果”“仅当”这些小词才说明。“如果”引出前提，“仅当”引出结论。\n\n检验：唯一能推翻这个断言的情形，是能被 $4$ 整除的奇数。两个句子排除的恰好都是这种情形，所以说的是同一件事。\n\n本课我们把条件命题的常见说法译成符号，以及“如果……那么……”的形式。",
  ),
  prerequisites: ["necessary-and-sufficient-conditions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "symbolizing-conditional-phrasings",
      title: t("Symbolizing phrasings", "把说法写成符号"),
      explanation: t(
        'Find the hypothesis first. In "$p$ only if $q$", $p$ cannot happen without $q$, so $p \\Rightarrow q$. In "$p$ if $q$", the "if" marks the hypothesis: $q \\Rightarrow p$. "$p$ unless $q$" means that if $q$ fails then $p$ holds: $\\neg q \\Rightarrow p$, equivalently $p \\vee q$.\n\n> **Watch out.** "Only if" does not mark the hypothesis the way "if" does; it marks the conclusion. "$p$ only if $q$" is $p \\Rightarrow q$, not $q \\Rightarrow p$.',
        "先找出前提。在“$p$ 仅当 $q$”中，没有 $q$ 就不可能有 $p$，所以是 $p \\Rightarrow q$。在“$p$，如果 $q$”中，“如果”标出的是前提：$q \\Rightarrow p$。“除非 $q$，否则 $p$”表示若 $q$ 不成立则 $p$ 成立：$\\neg q \\Rightarrow p$，等价于 $p \\vee q$。\n\n> **注意。** “仅当”不像“如果”那样标出前提；它标出的是结论。“$p$ 仅当 $q$”是 $p \\Rightarrow q$，不是 $q \\Rightarrow p$。",
      ),
      generate(rng) {
        const [a, b] = twoLetters(rng);
        const c = rng.pick(constructions);
        const right = c.meaning === "forward" ? imp(a, b) : c.meaning === "backward" ? imp(b, a) : imp(not(b), a);
        const wrong = inequivalentTo(rng, right, [imp(a, b), imp(b, a), iff(a, b), imp(b, not(a)), imp(not(a), b), imp(a, not(b))]);
        const phrase = c.phrase(`$${tex(a)}$`, `$${tex(b)}$`);
        const [ta, tb] = [tex(a), tex(b)];
        const unless = c.meaning === "unless";
        const noNegation: readonly [string, string] = unless
          ? [
              `"$${ta}$ unless $${tb}$" makes $\\neg ${tb}$ the hypothesis and $${ta}$ the conclusion; this does not.`,
              `“除非 $${tb}$，否则 $${ta}$”以 $\\neg ${tb}$ 为前提、$${ta}$ 为结论；这个不是。`,
            ]
          : ["The phrase contains no negation.", "这个说法中没有否定。"];
        const reasons: Reason[] = [
          [
            math(imp(a, b)).en,
            unless
              ? `"Unless $${tb}$" means "if not $${tb}$", so the hypothesis is $\\neg ${tb}$.`
              : `That makes $${ta}$ the hypothesis, but here it is the conclusion.`,
            unless ? `“除非 $${tb}$”表示“如果非 $${tb}$”，所以前提是 $\\neg ${tb}$。` : `这把 $${ta}$ 当成前提，但这里它是结论。`,
          ],
          [
            math(imp(b, a)).en,
            unless
              ? `"Unless $${tb}$" means "if not $${tb}$", so the hypothesis is $\\neg ${tb}$, not $${tb}$.`
              : `That makes $${tb}$ the hypothesis, but here it is the conclusion.`,
            unless
              ? `“除非 $${tb}$”表示“如果非 $${tb}$”，所以前提是 $\\neg ${tb}$，不是 $${tb}$。`
              : `这把 $${tb}$ 当成前提，但这里它是结论。`,
          ],
          [math(iff(a, b)).en, "That claims both directions; the phrase gives only one.", "这断言了两个方向；这个说法只给出一个方向。"],
          [math(imp(b, not(a))).en, ...noNegation],
          [math(imp(not(a), b)).en, ...noNegation],
          [math(imp(a, not(b))).en, ...noNegation],
        ];
        const hypothesis = c.meaning === "forward" ? ta : c.meaning === "backward" ? tb : `\\neg ${tb}`;
        const conclusion = c.meaning === "forward" ? tb : ta;
        return reasoned(
          oneOf(
            rng,
            t(`Which statement is "${phrase.en}" in symbols?`, `“${phrase["zh-CN"]}”用符号表示是哪个命题？`),
            math(right),
            wrong.map(math),
            walked(
              [
                [
                  ["Find the hypothesis", "找出前提"],
                  unless
                    ? t(
                        `"Unless $${tb}$" means "if not $${tb}$", so the hypothesis is $\\neg ${tb}$.`,
                        `“除非 $${tb}$”表示“如果非 $${tb}$”，所以前提是 $\\neg ${tb}$。`,
                      )
                    : t(
                        `In "${phrase.en}" the hypothesis is $${hypothesis}$ and the conclusion is $${conclusion}$.`,
                        `在“${phrase["zh-CN"]}”中，前提是 $${hypothesis}$，结论是 $${conclusion}$。`,
                      ),
                ],
                [["Write the implication", "写出蕴涵"], t(`The statement is $${tex(right)}$.`, `该命题为 $${tex(right)}$。`)],
              ],
              t(
                `The only case that breaks "${phrase.en}" is $${hypothesis}$ true with $${conclusion}$ false, and that is exactly the row where $${tex(right)}$ is false.`,
                `唯一推翻“${phrase["zh-CN"]}”的情形是 $${hypothesis}$ 为真而 $${conclusion}$ 为假，而这恰是 $${tex(right)}$ 为假的那一行。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "rewriting-sentences-as-if-then",
      title: t("Rewriting sentences as if–then", "改写成“如果……那么……”"),
      explanation: t(
        '"$f$ is continuous at $a$ if $f$ is differentiable at $a$" and "$f$ is differentiable at $a$ only if $f$ is continuous at $a$" both say: if $f$ is differentiable at $a$, then $f$ is continuous at $a$. Find the part after "if", or the part before "only if": that is the hypothesis.\n\n> **Watch out.** Do not reverse the sentence into its converse. A true conditional can have a false converse: $|x|$ is continuous at $0$ without being differentiable there.',
        "“$f$ 在 $a$ 处连续，如果 $f$ 在 $a$ 处可导”与“$f$ 在 $a$ 处可导仅当 $f$ 在 $a$ 处连续”说的都是：如果 $f$ 在 $a$ 处可导，那么 $f$ 在 $a$ 处连续。找出“如果”后面的部分，或“仅当”前面的部分：那就是前提。\n\n> **注意。** 不要把句子反过来变成逆命题。真的条件命题，其逆命题可能为假：$|x|$ 在 $0$ 处连续，却不可导。",
      ),
      generate(rng) {
        const f = fact(rng);
        const c = rng.pick(constructions.filter((x) => x.meaning !== "unless"));
        const sentence =
          c.meaning === "forward"
            ? t(c.phrase(f.a.en, f.b.en).en, c.phrase(f.a["zh-CN"], f.b["zh-CN"])["zh-CN"])
            : t(c.phrase(f.b.en, f.a.en).en, c.phrase(f.b["zh-CN"], f.a["zh-CN"])["zh-CN"]);
        const ifThen = (h: Text, k: Text) => t(`If ${h.en}, then ${k.en}.`, `如果 ${h["zh-CN"]}，那么 ${k["zh-CN"]}。`);
        const converse = ifThen(f.b, f.a);
        const both = t(`${f.a.en} if and only if ${f.b.en}.`, `${f.a["zh-CN"]}当且仅当 ${f.b["zh-CN"]}。`);
        return reasoned(
          oneOf(
            rng,
            t(`Which sentence means the same as "${sentence.en}"?`, `哪个句子与“${sentence["zh-CN"]}”意思相同？`),
            ifThen(f.a, f.b),
            [converse, both],
            walked(
              [
                [
                  ["Find the hypothesis", "找出前提"],
                  t(
                    `In "${sentence.en}" the hypothesis is "${f.a.en}" and the conclusion is "${f.b.en}".`,
                    `在“${sentence["zh-CN"]}”中，前提是“${f.a["zh-CN"]}”，结论是“${f.b["zh-CN"]}”。`,
                  ),
                ],
                [["Write it as if–then", "写成“如果……那么……”"], ifThen(f.a, f.b)],
              ],
              t(
                `The converse cannot be what is meant, since it is false: ${f.counter.en}. The sentence, read as above, is true.`,
                `所指的不可能是逆命题，因为逆命题为假：${f.counter["zh-CN"]}。按上面读出的句子为真。`,
              ),
            ),
          ),
          [
            [converse.en, "That is the converse; it swaps the hypothesis and the conclusion.", "这是逆命题；它把前提和结论对调了。"],
            [
              both.en,
              "That claims both directions; the sentence gives only one, and its converse fails.",
              "这断言了两个方向；原句只给出一个方向，而且它的逆命题不成立。",
            ],
          ],
        );
      },
    },
  ],
};

/** setExpr translates a formula into a set expression, writing p, q, r and s as A, B, C and D. */
export function setExpr(f: Formula): string {
  const names: Record<Var, string> = { p: "A", q: "B", r: "C", s: "D" };
  const inner = (g: Formula) => (g.k === "var" || g.k === "not" ? setExpr(g) : `(${setExpr(g)})`);
  if (f.k === "var") return names[f.v];
  if (f.k === "not") return f.a.k === "not" ? `(${setExpr(f.a)})^{c}` : `${inner(f.a)}^{c}`;
  if (f.k === "and") return `${inner(f.a)} \\cap ${inner(f.b)}`;
  if (f.k === "or") return `${inner(f.a)} \\cup ${inner(f.b)}`;
  if (f.k === "imp") return setExpr(or(not(f.a), f.b));
  return `${inner(f.a)} = ${inner(f.b)}`;
}

/** predExpr writes a formula with predicate letters P(x), Q(x). */
function predExpr(f: Formula): string {
  return tex(f).replace(/\bp\b/g, "P(x)").replace(/\bq\b/g, "Q(x)");
}

/** translatingBetweenLogicalAndSetOperations matches connectives with set operations. */
export const translatingBetweenLogicalAndSetOperations: TopicDef = {
  id: "translating-between-logical-and-set-operations",
  title: t("Translating Between Logical and Set Operations", "逻辑运算与集合运算的互译"),
  summary: t(
    "∧, ∨ and ¬ on predicates match ∩, ∪ and complement on truth sets; ∀x (P(x) ⇒ Q(x)) matches A ⊆ B.",
    "谓词上的 ∧、∨、¬ 对应真值集上的 ∩、∪、补集；∀x (P(x) ⇒ Q(x)) 对应 A ⊆ B。",
  ),
  intro: t(
    'In $U = \\{1, 2, \\dots, 10\\}$, let $P(x)$ be "$x$ is even", with truth set $A = \\{2, 4, 6, 8, 10\\}$, and $Q(x)$ be "$x$ is a multiple of $4$", with $B = \\{4, 8\\}$. The predicate $P(x) \\wedge \\neg Q(x)$ is true for the even numbers that are not multiples of $4$: $\\{2, 6, 10\\}$, which is $A \\cap B^{c}$. And every multiple of $4$ is even, so "$Q(x) \\Rightarrow P(x)$ for every $x$" holds, which is the statement $B \\subseteq A$.\n\nCheck: $A \\cap B^{c}$ should be $A$ with the elements of $B$ removed, $\\{2, 4, 6, 8, 10\\} \\setminus \\{4, 8\\} = \\{2, 6, 10\\}$, the same set.\n\nIn this lesson we translate compound predicates into set expressions and quantified statements into relations between sets.',
    "在 $U = \\{1, 2, \\dots, 10\\}$ 中，设 $P(x)$ 为“$x$ 是偶数”，真值集 $A = \\{2, 4, 6, 8, 10\\}$；$Q(x)$ 为“$x$ 是 $4$ 的倍数”，真值集 $B = \\{4, 8\\}$。谓词 $P(x) \\wedge \\neg Q(x)$ 对不是 $4$ 的倍数的偶数为真：$\\{2, 6, 10\\}$，即 $A \\cap B^{c}$。而 $4$ 的倍数都是偶数，所以“对每个 $x$，$Q(x) \\Rightarrow P(x)$”成立，这就是 $B \\subseteq A$。\n\n检验：$A \\cap B^{c}$ 应是从 $A$ 中去掉 $B$ 的元素，$\\{2, 4, 6, 8, 10\\} \\setminus \\{4, 8\\} = \\{2, 6, 10\\}$，是同一个集合。\n\n本课我们把复合谓词译成集合表达式，把量化命题译成集合之间的关系。",
  ),
  prerequisites: ["simplifying-predicate-expressions-using-de-morgans-laws", "conditional-statements-with-predicates"],
  encompasses: [{ topic: "simplifying-predicate-expressions-using-de-morgans-laws", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-compound-predicates",
      title: t("Truth sets of compound predicates", "复合谓词的真值集"),
      explanation: t(
        "Let $A$ and $B$ be the truth sets of $P(x)$ and $Q(x)$. Replace $\\wedge$ by $\\cap$, $\\vee$ by $\\cup$ and $\\neg$ by complement: $P(x) \\wedge \\neg Q(x)$ has truth set $A \\cap B^{c}$, and $\\neg(P(x) \\vee Q(x))$ has truth set $(A \\cup B)^{c}$.\n\n> **Watch out.** A negation applies only to what it stands in front of. $\\neg P(x) \\wedge Q(x)$ is $A^{c} \\cap B$, while $\\neg(P(x) \\wedge Q(x))$ is $(A \\cap B)^{c}$: keep the brackets where the formula has them.",
        "设 $A$、$B$ 分别是 $P(x)$、$Q(x)$ 的真值集。把 $\\wedge$ 换成 $\\cap$，$\\vee$ 换成 $\\cup$，$\\neg$ 换成补集：$P(x) \\wedge \\neg Q(x)$ 的真值集为 $A \\cap B^{c}$，$\\neg(P(x) \\vee Q(x))$ 的真值集为 $(A \\cup B)^{c}$。\n\n> **注意。** 否定只作用于紧跟其后的部分。$\\neg P(x) \\wedge Q(x)$ 是 $A^{c} \\cap B$，而 $\\neg(P(x) \\wedge Q(x))$ 是 $(A \\cap B)^{c}$：公式在哪里有括号，集合表达式就在哪里保留括号。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or"]);
          if (varsOf(f).length < 2) continue;
          const negation = f.k === "not" ? f.a : not(f);
          const swapped = swapConnectives(f);
          const leaves = negateLeaves(f);
          const wrong = inequivalentTo(rng, f, [negation, ...swapped, ...leaves]);
          const opt = (g: Formula) => t(`$${setExpr(g)}$`, `$${setExpr(g)}$`);
          const env = { p: true, q: false, r: false, s: false };
          const value = evaluate(f, env);
          return reasoned(
            oneOf(
              rng,
              t(
                `Let $A$ and $B$ be the truth sets of $P(x)$ and $Q(x)$ in a domain $U$. What is the truth set of $${predExpr(f)}$?`,
                `设 $A$、$B$ 分别是 $P(x)$、$Q(x)$ 在论域 $U$ 中的真值集。$${predExpr(f)}$ 的真值集是什么？`,
              ),
              opt(f),
              wrong.map(opt),
              walked(
                [
                  [
                    ["Match each operation", "逐个对应运算"],
                    t(
                      "$P(x)$ and $Q(x)$ become $A$ and $B$; $\\wedge$ becomes $\\cap$, $\\vee$ becomes $\\cup$, and $\\neg$ becomes complement, keeping the brackets of the formula.",
                      "$P(x)$、$Q(x)$ 变为 $A$、$B$；$\\wedge$ 变为 $\\cap$，$\\vee$ 变为 $\\cup$，$\\neg$ 变为补集，并保留公式中的括号。",
                    ),
                  ],
                  [
                    ["Write the set", "写出集合"],
                    t(`$${predExpr(f)}$ has truth set $${setExpr(f)}$.`, `$${predExpr(f)}$ 的真值集为 $${setExpr(f)}$。`),
                  ],
                ],
                t(
                  `Take an element in $A$ but not in $B$: there $P(x)$ is true and $Q(x)$ false, so $${predExpr(f)}$ is ${value ? "true" : "false"}, and the element is ${value ? "in" : "outside"} $${setExpr(f)}$, as it should be.`,
                  `取一个属于 $A$ 而不属于 $B$ 的元素：这时 $P(x)$ 为真，$Q(x)$ 为假，所以 $${predExpr(f)}$ 为${value ? "真" : "假"}，而这个元素${value ? "在" : "不在"} $${setExpr(f)}$ 中，正应如此。`,
                ),
              ),
            ),
            [
              [
                opt(negation).en,
                "That is the complement of the right set: the truth set of the negation.",
                "这是正确集合的补集，即否定的真值集。",
              ],
              ...swapped.map(
                (g): Reason => [
                  opt(g).en,
                  "That swaps $\\cap$ and $\\cup$ for a connective.",
                  "这把某个联结词对应的 $\\cap$ 与 $\\cup$ 换错了。",
                ],
              ),
              ...leaves.map(
                (g): Reason => [
                  opt(g).en,
                  "That changes which sets are complemented; a complement goes exactly where the formula has $\\neg$.",
                  "这改变了取补集的位置；只有公式中有 $\\neg$ 的地方才取补集。",
                ],
              ),
            ],
          );
        }
      },
    },
    {
      id: "quantified-statements-as-set-relations",
      title: t("Quantified statements as set relations", "量化命题与集合关系"),
      explanation: t(
        'A predicate picks out the set of elements where it is true, so statements about all elements become statements about how those sets relate. "$P(x) \\Rightarrow Q(x)$ for every $x \\in U$" says every element of $A$ lies in $B$: $A \\subseteq B$. "$P(x) \\Leftrightarrow Q(x)$ for every $x$" says $A = B$. "No $x$ satisfies $P(x) \\wedge Q(x)$" says $A \\cap B = \\varnothing$.\n\n> **Watch out.** The direction of the implication is the direction of the inclusion. "$P(x) \\Rightarrow Q(x)$ for every $x$" puts $A$ inside $B$, not $B$ inside $A$.',
        "一个谓词选出使它为真的元素组成的集合，所以关于所有元素的命题就变成了关于这些集合之间关系的命题。“对每个 $x \\in U$，$P(x) \\Rightarrow Q(x)$”表示 $A$ 的每个元素都在 $B$ 中：$A \\subseteq B$。“对每个 $x$，$P(x) \\Leftrightarrow Q(x)$”表示 $A = B$。“没有 $x$ 满足 $P(x) \\wedge Q(x)$”表示 $A \\cap B = \\varnothing$。\n\n> **注意。** 蕴涵的方向就是包含的方向。“对每个 $x$，$P(x) \\Rightarrow Q(x)$”是把 $A$ 放进 $B$，而不是把 $B$ 放进 $A$。",
      ),
      generate(rng) {
        const letters = rng.shuffle([
          ["P", "A"],
          ["Q", "B"],
          ["R", "C"],
        ] as const);
        const [[p, a], [q, b]] = [letters[0]!, letters[1]!];
        const neg = rng.int(0, 3);
        const pl = neg === 1 ? `\\neg ${p}(x)` : `${p}(x)`;
        const ql = neg === 2 ? `\\neg ${q}(x)` : `${q}(x)`;
        const as = neg === 1 ? `${a}^{c}` : a;
        const bs = neg === 2 ? `${b}^{c}` : b;
        const kind = rng.int(0, 3);
        const statements = [
          t(`$${pl} \\Rightarrow ${ql}$ for every $x \\in U$`, `对每个 $x \\in U$，$${pl} \\Rightarrow ${ql}$`),
          t(`$${pl} \\Leftrightarrow ${ql}$ for every $x \\in U$`, `对每个 $x \\in U$，$${pl} \\Leftrightarrow ${ql}$`),
          t(`no $x \\in U$ satisfies $${pl} \\wedge ${ql}$`, `没有 $x \\in U$ 满足 $${pl} \\wedge ${ql}$`),
          t(`some $x \\in U$ satisfies $${pl} \\wedge ${ql}$`, `存在 $x \\in U$ 满足 $${pl} \\wedge ${ql}$`),
          t(`$${ql} \\Rightarrow ${pl}$ for every $x \\in U$`, `对每个 $x \\in U$，$${ql} \\Rightarrow ${pl}$`),
        ];
        const statement = statements[kind]!;
        const relations = [
          `${as} \\subseteq ${bs}`,
          `${as} = ${bs}`,
          `${as} \\cap ${bs} = \\varnothing`,
          `${as} \\cap ${bs} \\ne \\varnothing`,
          `${bs} \\subseteq ${as}`,
        ];
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        const checks = [
          t(
            `The statement fails only if some $x$ makes $${pl}$ true and $${ql}$ false, that is an element of $${as}$ outside $${bs}$, which is exactly what $${relations[0]}$ rules out.`,
            `该命题只有在某个 $x$ 使 $${pl}$ 为真而 $${ql}$ 为假时才不成立，即 $${as}$ 中有元素在 $${bs}$ 之外，而这恰是 $${relations[0]}$ 所排除的。`,
          ),
          t(
            `The statement fails only if some $x$ makes one side true and the other false, an element in one set but not the other, which is exactly what $${relations[1]}$ rules out.`,
            `该命题只有在某个 $x$ 使一边为真、另一边为假时才不成立，即有元素属于一个集合而不属于另一个，而这恰是 $${relations[1]}$ 所排除的。`,
          ),
          t(
            `The statement fails only if some $x$ satisfies both, an element of $${as} \\cap ${bs}$, which is exactly what $${relations[2]}$ rules out.`,
            `该命题只有在某个 $x$ 同时满足两者时才不成立，即 $${as} \\cap ${bs}$ 中有元素，而这恰是 $${relations[2]}$ 所排除的。`,
          ),
          t(
            `The statement holds exactly when some $x$ satisfies both, that is when $${as} \\cap ${bs}$ has an element, as $${relations[3]}$ says.`,
            `该命题恰在某个 $x$ 同时满足两者时成立，即 $${as} \\cap ${bs}$ 中有元素，正如 $${relations[3]}$ 所说。`,
          ),
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $${a}$ and $${b}$ be the truth sets of $${p}(x)$ and $${q}(x)$. Which set relation says that ${statement.en}?`,
              `设 $${a}$、$${b}$ 分别是 $${p}(x)$、$${q}(x)$ 的真值集。哪个集合关系表示${statement["zh-CN"]}？`,
            ),
            opt(relations[kind]!),
            relations.filter((_, i) => i !== kind).map(opt),
            walked(
              [
                [
                  ["Find the truth sets of the parts", "求各部分的真值集"],
                  t(`$${pl}$ has truth set $${as}$ and $${ql}$ has $${bs}$.`, `$${pl}$ 的真值集为 $${as}$，$${ql}$ 的真值集为 $${bs}$。`),
                ],
                [
                  ["Translate the statement", "翻译命题"],
                  t(`So the statement says $${relations[kind]}$.`, `所以该命题表示 $${relations[kind]}$。`),
                ],
              ],
              checks[kind]!,
            ),
          ),
          relations.map((r, i): Reason => [opt(r).en, `That says ${statements[i]!.en}.`, `这表示${statements[i]!["zh-CN"]}。`]),
        );
      },
    },
  ],
};

/** swapConnectives changes the top connective of a formula. */
function swapConnectives(f: Formula): Formula[] {
  if (f.k === "and") return [or(f.a, f.b)];
  if (f.k === "or") return [and(f.a, f.b)];
  if (f.k === "not") return swapConnectives(f.a).map(not);
  return [];
}

/** negateLeaves negates one variable occurrence at a time. */
function negateLeaves(f: Formula): Formula[] {
  if (f.k === "var") return [not(f)];
  if (f.k === "not") return f.a.k === "var" ? [f.a] : negateLeaves(f.a).map(not);
  return [...negateLeaves(f.a).map((a) => ({ ...f, a })), ...negateLeaves(f.b).map((b) => ({ ...f, b }))];
}

/** Claim is a quantified statement with its truth value, a reason and a check of that reason. */
interface Claim {
  readonly tex: string;
  readonly value: boolean;
  readonly why: Text;
  /** check confirms the verdict another way, often on a particular value. */
  readonly check: Text;
}

/** Domain is ℤ or ℝ. */
type Domain = "Z" | "R";

/** dom writes a domain in LaTeX. */
const dom = (d: Domain) => (d === "Z" ? "\\mathbb{Z}" : "\\mathbb{R}");

/** singleClaim builds a statement with one quantifier over ℤ or ℝ. */
function singleClaim(rng: Rng): Claim {
  const d: Domain = rng.bool() ? "Z" : "R";
  const D = dom(d);
  const k = rng.int(2, 9);
  const kind = rng.int(0, 7);
  switch (kind) {
    case 0:
      return {
        tex: `\\forall x \\in ${D},\\ x^2 \\ge 0`,
        value: true,
        why: t(
          "Every square is nonnegative: a product of two numbers of the same sign is not negative.",
          "任何数的平方都非负：两个同号数的积不是负数。",
        ),
        check: t(
          "Try $x = -3$: $9 \\ge 0$. Try the boundary case $x = 0$: $0 \\ge 0$, still true.",
          "试 $x = -3$：$9 \\ge 0$。再试边界情形 $x = 0$：$0 \\ge 0$，仍然成立。",
        ),
      };
    case 1:
      return {
        tex: `\\forall x \\in ${D},\\ x^2 > 0`,
        value: false,
        why: t("$x = 0$ is a counterexample: $0^2 = 0$, which is not greater than $0$.", "$x = 0$ 是反例：$0^2 = 0$，不大于 $0$。"),
        check: t(
          "Every other value works, such as $x = 2$ with $4 > 0$, so $0$ is the only counterexample, and one is enough to make a $\\forall$ statement false.",
          "其他值都满足，如 $x = 2$ 时 $4 > 0$，所以 $0$ 是唯一的反例，而一个反例就足以使 $\\forall$ 命题为假。",
        ),
      };
    case 2: {
      const value = d === "R" || k % 2 === 0;
      return {
        tex: `\\exists x \\in ${D},\\ 2x = ${k}`,
        value,
        why: value
          ? t(`$x = ${k / 2}$ works, and one example is enough.`, `$x = ${k / 2}$ 满足条件，一个例子就足够。`)
          : t(`The only solution is $x = ${k}/2$, which is not an integer.`, `唯一的解是 $x = ${k}/2$，它不是整数。`),
        check: value
          ? t(`Substitute: $2 \\cdot ${k / 2} = ${k}$.`, `代入：$2 \\cdot ${k / 2} = ${k}$。`)
          : t(
              `The integers on either side, $x = ${(k - 1) / 2}$ and $x = ${(k + 1) / 2}$, give $2x = ${k - 1}$ and $2x = ${k + 1}$: even numbers, never $${k}$.`,
              `两侧的整数 $x = ${(k - 1) / 2}$ 和 $x = ${(k + 1) / 2}$ 给出 $2x = ${k - 1}$ 和 $2x = ${k + 1}$：都是偶数，不会是 $${k}$。`,
            ),
      };
    }
    case 3:
      return {
        tex: `\\exists x \\in ${D},\\ x^2 = -${k}`,
        value: false,
        why: t("A square is never negative, so no value works.", "平方永远不是负数，所以没有值满足。"),
        check: t(
          `Try $x = 0, 1, -1$: the squares are $0, 1, 1$, all at least $0 > -${k}$.`,
          `试 $x = 0, 1, -1$：平方是 $0, 1, 1$，都不小于 $0 > -${k}$。`,
        ),
      };
    case 4: {
      const root = Math.round(Math.sqrt(k));
      const exact = root * root === k;
      const value = d === "R" || exact;
      const low = Math.floor(Math.sqrt(k));
      return {
        tex: `\\exists x \\in ${D},\\ x^2 = ${k}`,
        value,
        why: value
          ? t(
              `$x = ${exact ? root : `\\sqrt{${k}}`}$ works, and one example is enough.`,
              `$x = ${exact ? root : `\\sqrt{${k}}`}$ 满足条件，一个例子就足够。`,
            )
          : t(`$${k}$ is not a perfect square, so no integer works.`, `$${k}$ 不是完全平方数，所以没有整数满足。`),
        check: value
          ? t(`Substitute: $(${exact ? root : `\\sqrt{${k}}`})^2 = ${k}$.`, `代入：$(${exact ? root : `\\sqrt{${k}}`})^2 = ${k}$。`)
          : t(
              `The squares of consecutive integers jump from $${low}^2 = ${low * low}$ to $${low + 1}^2 = ${(low + 1) ** 2}$, passing over $${k}$.`,
              `相邻整数的平方从 $${low}^2 = ${low * low}$ 跳到 $${low + 1}^2 = ${(low + 1) ** 2}$，跳过了 $${k}$。`,
            ),
      };
    }
    case 5:
      return {
        tex: `\\forall x \\in ${D},\\ x^2 \\ge x`,
        value: d === "Z",
        why:
          d === "Z"
            ? t(
                "For an integer, $x^2 - x = x(x - 1) \\ge 0$ since there is no integer strictly between $0$ and $1$.",
                "对整数，$x^2 - x = x(x - 1) \\ge 0$，因为 $0$ 与 $1$ 之间没有整数。",
              )
            : t(
                "$x = \\tfrac{1}{2}$ is a counterexample: $\\tfrac{1}{4} < \\tfrac{1}{2}$.",
                "$x = \\tfrac{1}{2}$ 是反例：$\\tfrac{1}{4} < \\tfrac{1}{2}$。",
              ),
        check:
          d === "Z"
            ? t(
                "Try $x = -1, 0, 1, 2$: $1 \\ge -1$, $0 \\ge 0$, $1 \\ge 1$, $4 \\ge 2$, all true.",
                "试 $x = -1, 0, 1, 2$：$1 \\ge -1$，$0 \\ge 0$，$1 \\ge 1$，$4 \\ge 2$，都成立。",
              )
            : t(
                "The counterexample sits between $0$ and $1$, the only place where $x(x - 1) < 0$; there are no integers there, which is why the same statement over $\\mathbb{Z}$ is true.",
                "反例位于 $0$ 与 $1$ 之间，这是 $x(x - 1) < 0$ 的唯一区域；那里没有整数，所以同一命题在 $\\mathbb{Z}$ 上为真。",
              ),
      };
    case 6:
      return {
        tex: `\\forall x \\in ${D},\\ x + ${k} > x`,
        value: true,
        why: t(`Adding $${k} > 0$ always increases a number.`, `加上 $${k} > 0$ 总会使数变大。`),
        check: t(
          `Subtract $x$ from both sides: the inequality becomes $${k} > 0$, which holds whatever $x$ is.`,
          `两边减去 $x$：不等式变为 $${k} > 0$，不论 $x$ 是多少都成立。`,
        ),
      };
    default:
      return {
        tex: `\\exists x \\in ${D},\\ ${k}x = x`,
        value: true,
        why: t("$x = 0$ works, and one example is enough.", "$x = 0$ 满足条件，一个例子就足够。"),
        check: t(`Substitute: $${k} \\cdot 0 = 0$.`, `代入：$${k} \\cdot 0 = 0$。`),
      };
  }
}

/** claimProblem asks whether a quantified statement is true. */
function claimProblem(rng: Rng, c: Claim, need: Text): Problem {
  return reasoned(
    oneOf(
      rng,
      t(`Is the statement $${c.tex}$ true or false?`, `命题 $${c.tex}$ 是真还是假？`),
      truthOption(c.value),
      [truthOption(!c.value)],
      walked(
        [
          [["Decide what settles it", "确定判断依据"], need],
          [
            ["Settle it", "作出判断"],
            t(`${c.why.en} So the statement is ${c.value ? "true" : "false"}.`, `${c.why["zh-CN"]}所以该命题为${c.value ? "真" : "假"}。`),
          ],
        ],
        c.check,
      ),
    ),
    [[truthOption(!c.value).en, c.why.en, c.why["zh-CN"]]],
  );
}

/** universalAndExistentialQuantifiers evaluates ∀ and ∃ statements. */
export const universalAndExistentialQuantifiers: TopicDef = {
  id: "universal-and-existential-quantifiers",
  title: t("Universal and Existential Quantifiers", "全称量词与存在量词"),
  summary: t(
    "∀x ∈ S, P(x) is true when P holds for every element of S; ∃x ∈ S, P(x) is true when P holds for at least one.",
    "∀x ∈ S, P(x) 在 P 对 S 的每个元素都成立时为真；∃x ∈ S, P(x) 在 P 至少对一个元素成立时为真。",
  ),
  intro: t(
    'Let $S = \\{3, 5, 9\\}$. The claim "every element of $S$ is odd" is true: $3$, $5$ and $9$ are all odd. The claim "every element of $S$ is prime" is false, and one element shows it: $9 = 3 \\cdot 3$. The claim "some element of $S$ is a square" is true, and one element shows it too: $9 = 3^2$. "For every" needs all the elements; "there exists" needs only one.\n\nCheck: $2$ of the $3$ elements are prime, so "every element is prime" fails while "some element is prime" holds, as one count tells both.\n\nIn this lesson we decide whether statements with $\\forall$ and $\\exists$ are true, first over a finite set and then over the integers and the reals.',
    "设 $S = \\{3, 5, 9\\}$。断言“$S$ 的每个元素都是奇数”为真：$3$、$5$、$9$ 都是奇数。断言“$S$ 的每个元素都是质数”为假，一个元素就能说明：$9 = 3 \\cdot 3$。断言“$S$ 中有某个元素是平方数”为真，同样一个元素就能说明：$9 = 3^2$。“对每个”需要所有元素；“存在”只需要一个。\n\n检验：$3$ 个元素中有 $2$ 个是质数，所以“每个元素都是质数”不成立，而“有元素是质数”成立，一个计数同时说明了两者。\n\n本课我们判断含 $\\forall$、$\\exists$ 的命题的真假，先在有限集上，再在整数和实数上。",
  ),
  prerequisites: ["truth-sets-of-predicates"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "quantifiers-over-finite-sets",
      title: t("Quantifiers over finite sets", "有限集上的量词"),
      explanation: t(
        '$\\forall x \\in S,\\ P(x)$ ("for all") is true when $P(x)$ holds for every element of $S$; one counterexample makes it false. $\\exists x \\in S,\\ P(x)$ ("there exists") is true when at least one element works. With $S = \\{2, 3, 5\\}$, "$\\forall x \\in S$, $x$ is prime" is true, while "$\\exists x \\in S$, $x$ is even" is true because of $2$.\n\n> **Watch out.** "There exists" does not need most elements, only one; "for all" fails on a single exception, however many elements work.',
        "$\\forall x \\in S,\\ P(x)$（“对所有”）在 $P(x)$ 对 $S$ 的每个元素都成立时为真；一个反例就使它为假。$\\exists x \\in S,\\ P(x)$（“存在”）只要至少一个元素满足就为真。若 $S = \\{2, 3, 5\\}$，则“$\\forall x \\in S$，$x$ 是质数”为真，“$\\exists x \\in S$，$x$ 是偶数”因 $2$ 而为真。\n\n> **注意。** “存在”不需要大多数元素，只需一个；“对所有”只要有一个例外就不成立，不论有多少元素满足。",
      ),
      generate(rng) {
        const size = rng.int(3, 5);
        const s = rng
          .shuffle(range(1, 30))
          .slice(0, size)
          .sort((x, y) => x - y);
        const [p] = twoPredicates(rng, 30);
        const all = rng.bool();
        const hits = s.filter(p.holds);
        const value = all ? hits.length === s.length : hits.length > 0;
        const q = all ? "\\forall" : "\\exists";
        const misses = s.filter((x) => !p.holds(x));
        const verdict = all
          ? value
            ? t(
                "Every element of $S$ satisfies the predicate, so there is no counterexample.",
                "$S$ 的每个元素都满足该谓词，所以没有反例。",
              )
            : t(`$x = ${misses[0]}$ is a counterexample, and one is enough.`, `$x = ${misses[0]}$ 是反例，一个就足够。`)
          : value
            ? t(`$x = ${hits[0]}$ satisfies the predicate, and one example is enough.`, `$x = ${hits[0]}$ 满足该谓词，一个例子就足够。`)
            : t("No element of $S$ satisfies the predicate, so there is no example.", "$S$ 中没有元素满足该谓词，所以没有例子。");
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $S = ${setTex(s)}$. Is the statement "$${q} x \\in S$, ${p.text.en}" true or false?`,
              `设 $S = ${setTex(s)}$。命题“$${q} x \\in S$，${p.text["zh-CN"]}”是真还是假？`,
            ),
            truthOption(value),
            [truthOption(!value)],
            walked(
              [
                [
                  ["Test each element", "逐个检验"],
                  t(
                    `Of the elements of $S$, ${hits.length === 0 ? "none satisfies" : `$${hits.join(", ")}$ ${hits.length === 1 ? "satisfies" : "satisfy"}`} "${p.text.en}".`,
                    `$S$ 的元素中，${hits.length === 0 ? "没有一个满足" : `$${hits.join(", ")}$ 满足`}“${p.text["zh-CN"]}”。`,
                  ),
                ],
                [["Apply the quantifier", "应用量词"], verdict],
              ],
              t(
                `Count: $${hits.length}$ of the $${s.length}$ elements work. "For all" needs $${s.length}$ and "there exists" needs at least $1$, so the statement is ${value ? "true" : "false"}.`,
                `计数：$${s.length}$ 个元素中有 $${hits.length}$ 个满足。“对所有”需要 $${s.length}$ 个，“存在”至少需要 $1$ 个，所以该命题为${value ? "真" : "假"}。`,
              ),
            ),
          ),
          [[truthOption(!value).en, verdict.en, verdict["zh-CN"]]],
        );
      },
    },
    {
      id: "quantifiers-over-infinite-sets",
      title: t("Quantifiers over infinite sets", "无限集上的量词"),
      explanation: t(
        "Over $\\mathbb{Z}$ or $\\mathbb{R}$ you cannot check every element. A $\\forall$ statement needs a general argument, or one counterexample to refute it; an $\\exists$ statement needs one example, or a general argument that none exists. $\\exists x \\in \\mathbb{Z},\\ 2x = 7$ is false, but $\\exists x \\in \\mathbb{R},\\ 2x = 7$ is true.\n\n> **Watch out.** Read the domain. The same predicate can be true over $\\mathbb{R}$ and false over $\\mathbb{Z}$, because the example it needs may not be an integer.",
        "在 $\\mathbb{Z}$ 或 $\\mathbb{R}$ 上无法逐个检验。$\\forall$ 命题需要一般性的论证，或用一个反例否定；$\\exists$ 命题需要一个例子，或论证不存在。$\\exists x \\in \\mathbb{Z},\\ 2x = 7$ 为假，而 $\\exists x \\in \\mathbb{R},\\ 2x = 7$ 为真。\n\n> **注意。** 要看清论域。同一个谓词可能在 $\\mathbb{R}$ 上为真、在 $\\mathbb{Z}$ 上为假，因为所需的例子可能不是整数。",
      ),
      generate(rng) {
        const c = singleClaim(rng);
        const universal = c.tex.startsWith("\\forall");
        return claimProblem(
          rng,
          c,
          universal
            ? t(
                "A $\\forall$ statement is true only if a general argument covers every value; one counterexample makes it false.",
                "$\\forall$ 命题只有在一般论证覆盖每个值时才为真；一个反例就使它为假。",
              )
            : t(
                "An $\\exists$ statement is true if one example works; it is false only if no value can work.",
                "$\\exists$ 命题只要一个例子满足就为真；只有任何值都不满足时才为假。",
              ),
        );
      },
    },
  ],
};

/** Rel is a relation with its negation, in LaTeX. */
interface Rel {
  readonly tex: string;
  readonly neg: string;
  /** wrongNeg is a plausible but incorrect negation. */
  readonly wrongNeg: string;
}

/** relation picks a relation between an expression in x and a number. */
function relation(rng: Rng, lhs: string): Rel {
  const c = rng.int(-9, 12);
  const [op, neg, wrong] = rng.pick([
    [">", "\\le", "<"],
    ["<", "\\ge", ">"],
    ["\\ge", "<", "\\le"],
    ["\\le", ">", "\\ge"],
    ["=", "\\ne", "<"],
    ["\\ne", "=", ">"],
  ] as const);
  return { tex: `${lhs} ${op} ${c}`, neg: `${lhs} ${neg} ${c}`, wrongNeg: `${lhs} ${wrong} ${c}` };
}

/** flipQ swaps ∀ and ∃. */
const flipQ = (q: string) => (q === "\\forall" ? "\\exists" : "\\forall");

/** negatingQuantifiedStatements negates ∀ and ∃ statements. */
export const negatingQuantifiedStatements: TopicDef = {
  id: "negating-quantified-statements",
  title: t("Negating Quantified Statements", "否定量化命题"),
  summary: t("¬(∀x, P(x)) ≡ ∃x, ¬P(x) and ¬(∃x, P(x)) ≡ ∀x, ¬P(x).", "¬(∀x, P(x)) ≡ ∃x, ¬P(x)，¬(∃x, P(x)) ≡ ∀x, ¬P(x)。"),
  intro: t(
    'What would it take for "every student passed" to be false? Not that every student failed: one student who did not pass is enough. So the negation of "for every $x$, $P(x)$" is "there is an $x$ with not $P(x)$". In the same way, "some student passed" is false only when no student passed, that is when every student did not pass.\n\nCheck: in a class where $9$ students passed and $1$ did not, "every student passed" is false and its negation "some student did not pass" is true, while "every student failed" is false too, so it cannot be the negation.\n\nIn this lesson we negate statements with one quantifier, in symbols and in words.',
    "“每个学生都及格了”要怎样才为假？并不需要每个学生都不及格：一个没及格的学生就够了。所以“对每个 $x$，$P(x)$”的否定是“存在 $x$，使非 $P(x)$”。同样，“有学生及格了”只有在没有学生及格，即每个学生都没及格时才为假。\n\n检验：在一个 $9$ 人及格、$1$ 人没及格的班里，“每个学生都及格了”为假，其否定“有学生没及格”为真；而“每个学生都没及格”也为假，所以它不可能是否定。\n\n本课我们否定含一个量词的命题，用符号，也用文字。",
  ),
  prerequisites: ["universal-and-existential-quantifiers", "simplifying-predicate-expressions-using-de-morgans-laws"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-quantified-statements-symbolically",
      title: t("Negating symbolically", "用符号否定"),
      explanation: t(
        "To negate, flip the quantifier and negate the predicate: $\\neg(\\forall x,\\ P(x)) \\equiv \\exists x,\\ \\neg P(x)$. Then simplify the predicate with De Morgan's laws and $\\neg(A \\Rightarrow B) \\equiv A \\wedge \\neg B$. The negation of $\\forall x \\in \\mathbb{R},\\ (x > 2 \\Rightarrow x^2 > 4)$ is $\\exists x \\in \\mathbb{R},\\ (x > 2 \\wedge x^2 \\le 4)$.\n\n> **Watch out.** The negation of $>$ is $\\le$, not $<$: the equal case belongs to the negation. And the negation of an implication is not another implication.",
        "否定时，翻转量词并否定谓词：$\\neg(\\forall x,\\ P(x)) \\equiv \\exists x,\\ \\neg P(x)$。再用德摩根律和 $\\neg(A \\Rightarrow B) \\equiv A \\wedge \\neg B$ 化简谓词。$\\forall x \\in \\mathbb{R},\\ (x > 2 \\Rightarrow x^2 > 4)$ 的否定是 $\\exists x \\in \\mathbb{R},\\ (x > 2 \\wedge x^2 \\le 4)$。\n\n> **注意。** $>$ 的否定是 $\\le$，不是 $<$：相等的情形属于否定。蕴涵的否定也不再是蕴涵。",
      ),
      generate(rng) {
        const q = rng.pick(["\\forall", "\\exists"]);
        const D = dom(rng.bool() ? "Z" : "R");
        const a = relation(rng, "x");
        const b = relation(rng, rng.pick(["x^2", "2x", "x + 1", "|x|"]));
        const shape = rng.int(0, 2);
        const body = [a.tex, `(${a.tex} \\wedge ${b.tex})`, `(${a.tex} \\Rightarrow ${b.tex})`][shape]!;
        const negBody = [a.neg, `(${a.neg} \\vee ${b.neg})`, `(${a.tex} \\wedge ${b.neg})`][shape]!;
        const badBody = [a.wrongNeg, `(${a.neg} \\wedge ${b.neg})`, `(${a.tex} \\Rightarrow ${b.neg})`][shape]!;
        const s = (qq: string, bb: string) => t(`$${qq} x \\in ${D},\\ ${bb}$`, `$${qq} x \\in ${D},\\ ${bb}$`);
        const nq = flipQ(q);
        const bodyRule = [
          t(`The negation of $${a.tex}$ is $${a.neg}$.`, `$${a.tex}$ 的否定是 $${a.neg}$。`),
          t(
            `By De Morgan's law the negation of a conjunction is the disjunction of the negations: $${negBody}$.`,
            `由德摩根律，合取的否定是各部分否定的析取：$${negBody}$。`,
          ),
          t(
            `The negation of $A \\Rightarrow B$ is $A \\wedge \\neg B$: $${negBody}$.`,
            `$A \\Rightarrow B$ 的否定是 $A \\wedge \\neg B$：$${negBody}$。`,
          ),
        ][shape]!;
        const badReason = [
          t(`The negation of $${a.tex}$ is $${a.neg}$, not $${a.wrongNeg}$.`, `$${a.tex}$ 的否定是 $${a.neg}$，不是 $${a.wrongNeg}$。`),
          t("That keeps $\\wedge$; the negation of a conjunction is a disjunction.", "这保留了 $\\wedge$；合取的否定是析取。"),
          t(
            "That is still an implication; the negation of $A \\Rightarrow B$ is $A \\wedge \\neg B$.",
            "这仍是蕴涵；$A \\Rightarrow B$ 的否定是 $A \\wedge \\neg B$。",
          ),
        ][shape]!;
        return reasoned(
          oneOf(
            rng,
            t(`What is the negation of $${q} x \\in ${D},\\ ${body}$?`, `$${q} x \\in ${D},\\ ${body}$ 的否定是什么？`),
            s(nq, negBody),
            [s(q, negBody), s(nq, badBody), s(nq, body)],
            walked(
              [
                [["Flip the quantifier", "翻转量词"], t(`$${q}$ becomes $${nq}$.`, `$${q}$ 变为 $${nq}$。`)],
                [["Negate the predicate", "否定谓词"], bodyRule],
              ],
              t(
                `Negating the answer again should give back the statement: $${nq}$ flips back to $${q}$, and the negation of $${negBody}$ is $${body}$.`,
                `再否定一次答案，应得回原命题：$${nq}$ 翻转回 $${q}$，而 $${negBody}$ 的否定是 $${body}$。`,
              ),
            ),
          ),
          [
            [s(q, negBody).en, `That keeps $${q}$; the quantifier must flip to $${nq}$.`, `这保留了 $${q}$；量词必须翻转为 $${nq}$。`],
            [s(nq, badBody).en, badReason.en, badReason["zh-CN"]],
            [s(nq, body).en, "That flips the quantifier but does not negate the predicate.", "这翻转了量词，却没有否定谓词。"],
          ],
        );
      },
    },
    {
      id: "negating-quantified-sentences",
      title: t("Negating sentences in words", "否定文字叙述的命题"),
      explanation: t(
        'The negation of "every prime number is odd" is "some prime number is not odd", not "every prime number is not odd". The negation of "some perfect square is even" is "every perfect square is not even", that is, "no perfect square is even".\n\n> **Watch out.** Make both changes: switch "every" and "some", and negate the property. Changing only one of them gives a statement that can be false together with the original.',
        "“每个质数都是奇数”的否定是“存在一个质数不是奇数”，而不是“每个质数都不是奇数”。“存在一个完全平方数是偶数”的否定是“每个完全平方数都不是偶数”，即“没有完全平方数是偶数”。\n\n> **注意。** 两处都要改：互换“每个”与“存在”，并否定性质。只改一处，得到的命题可能与原命题同时为假。",
      ),
      generate(rng) {
        const k = rng.int(3, 9);
        const a = rng.int(2, 20);
        const subject = rng.pick([
          t("prime number", "质数"),
          t(`multiple of $${k}$`, `$${k}$ 的倍数`),
          t(`integer greater than $${a}$`, `大于 $${a}$ 的整数`),
          t("perfect square", "完全平方数"),
        ]);
        const m = rng.int(2, 7);
        const b = rng.int(5, 40);
        const prop = rng.pick([
          [t("is odd", "是奇数"), t("is not odd", "不是奇数")],
          [t(`is divisible by $${m}$`, `能被 $${m}$ 整除`), t(`is not divisible by $${m}$`, `不能被 $${m}$ 整除`)],
          [t(`is less than $${b}$`, `小于 $${b}$`), t(`is at least $${b}$`, `不小于 $${b}$`)],
        ] as const);
        const [yes, no] = prop;
        const all = rng.bool();
        const every = (p: Text) => t(`Every ${subject.en} ${p.en}.`, `每个${subject["zh-CN"]}都${p["zh-CN"]}。`);
        const some = (p: Text) => t(`Some ${subject.en} ${p.en}.`, `存在一个${subject["zh-CN"]}${p["zh-CN"]}。`);
        const original = all ? every(yes) : some(yes);
        const right = all ? some(no) : every(no);
        const keep = all ? every(no) : some(no);
        const flipOnly = all ? some(yes) : every(yes);
        return reasoned(
          oneOf(
            rng,
            t(`What is the negation of "${original.en}"?`, `“${original["zh-CN"]}”的否定是什么？`),
            right,
            [keep, flipOnly],
            walked(
              [
                [
                  ["Switch the quantifier", "互换量词"],
                  t(
                    `"${all ? "Every" : "Some"}" becomes "${all ? "some" : "every"}".`,
                    `“${all ? "每个" : "存在"}”变为“${all ? "存在" : "每个"}”。`,
                  ),
                ],
                [
                  ["Negate the property", "否定性质"],
                  t(
                    `"${yes.en}" becomes "${no.en}". The negation is "${right.en}"`,
                    `“${yes["zh-CN"]}”变为“${no["zh-CN"]}”。否定是“${right["zh-CN"]}”`,
                  ),
                ],
              ],
              all
                ? t(
                    `The original is false exactly when at least one ${subject.en} is an exception, and that is what "${right.en}" says, so the two always have opposite truth values.`,
                    `原命题恰在至少有一个${subject["zh-CN"]}是例外时为假，而这正是“${right["zh-CN"]}”所说的，所以两者的真值总是相反。`,
                  )
                : t(
                    `The original is false exactly when no ${subject.en} has the property, and that is what "${right.en}" says, so the two always have opposite truth values.`,
                    `原命题恰在没有${subject["zh-CN"]}具有该性质时为假，而这正是“${right["zh-CN"]}”所说的，所以两者的真值总是相反。`,
                  ),
            ),
          ),
          [
            [
              keep.en,
              `That keeps "${all ? "every" : "some"}"; the quantifier must switch as well as the property.`,
              `这保留了“${all ? "每个" : "存在"}”；量词和性质都必须改变。`,
            ],
            [flipOnly.en, "That switches the quantifier but does not negate the property.", "这互换了量词，却没有否定性质。"],
          ],
        );
      },
    },
  ],
};

/** nestedClaim builds a statement with two quantifiers over ℤ or ℝ. */
function nestedClaim(rng: Rng, forallFirst: boolean): Claim {
  const d: Domain = rng.bool() ? "Z" : "R";
  const D = dom(d);
  const c = rng.int(2, 9);
  const pre = forallFirst ? `\\forall x \\in ${D},\\ \\exists y \\in ${D},\\ ` : `\\exists x \\in ${D},\\ \\forall y \\in ${D},\\ `;
  const kind = rng.int(0, 5);
  if (forallFirst) {
    switch (kind) {
      case 0:
        return {
          tex: `${pre}x + y = ${c}`,
          value: true,
          why: t(`Given $x$, take $y = ${c} - x$.`, `给定 $x$，取 $y = ${c} - x$。`),
          check: t(
            `Try $x = 5$: $y = ${c - 5}$ gives $5 + (${c - 5}) = ${c}$.`,
            `试 $x = 5$：取 $y = ${c - 5}$，得 $5 + (${c - 5}) = ${c}$。`,
          ),
        };
      case 1:
        return d === "R"
          ? {
              tex: `${pre}${c}y = x`,
              value: true,
              why: t(`Given $x$, take $y = x/${c}$.`, `给定 $x$，取 $y = x/${c}$。`),
              check: t(
                `Try $x = 7$: $y = \\tfrac{7}{${c}}$ gives $${c} \\cdot \\tfrac{7}{${c}} = 7$.`,
                `试 $x = 7$：取 $y = \\tfrac{7}{${c}}$，得 $${c} \\cdot \\tfrac{7}{${c}} = 7$。`,
              ),
            }
          : {
              tex: `${pre}${c}y = x`,
              value: false,
              why: t(`For $x = 1$, $y = 1/${c}$ is not an integer.`, `当 $x = 1$ 时，$y = 1/${c}$ 不是整数。`),
              check: t(
                `With integers, $${c}y$ takes the values $\\dots, -${c}, 0, ${c}, \\dots$, jumping from $0$ to $${c}$ and missing $1$.`,
                `对整数，$${c}y$ 取值 $\\dots, -${c}, 0, ${c}, \\dots$，从 $0$ 跳到 $${c}$，取不到 $1$。`,
              ),
            };
      case 2:
        return {
          tex: `${pre}xy = ${c}`,
          value: false,
          why: t(`For $x = 0$, $xy = 0 \\ne ${c}$ for every $y$.`, `当 $x = 0$ 时，对每个 $y$ 都有 $xy = 0 \\ne ${c}$。`),
          check: t(
            `Whatever happens for other values of $x$, the statement needs a $y$ for every $x$, and with $x = 0$ the tries $y = 1$ and $y = ${c}$ both give $0$.`,
            `不论其他 $x$ 如何，该命题要求每个 $x$ 都有对应的 $y$；而 $x = 0$ 时，试 $y = 1$ 和 $y = ${c}$ 都得 $0$。`,
          ),
        };
      case 3:
        return d === "R"
          ? {
              tex: `${pre}y^3 = x + ${c}`,
              value: true,
              why: t(
                `Take $y = \\sqrt[3]{x + ${c}}$, since every real number has a real cube root.`,
                `取 $y = \\sqrt[3]{x + ${c}}$，因为每个实数都有实立方根。`,
              ),
              check: t(
                `Try $x = ${8 - c}$: $y = 2$ gives $2^3 = 8 = ${8 - c} + ${c}$.`,
                `试 $x = ${8 - c}$：取 $y = 2$，得 $2^3 = 8 = ${8 - c} + ${c}$。`,
              ),
            }
          : {
              tex: `${pre}y^3 = x + ${c}`,
              value: false,
              why: t(
                `For $x = ${2 - c}$, we would need $y^3 = 2$, and no integer cube is $2$.`,
                `当 $x = ${2 - c}$ 时需要 $y^3 = 2$，而没有整数的立方等于 $2$。`,
              ),
              check: t(
                "The integer cubes nearest $2$ are $1^3 = 1$ and $2^3 = 8$, so $2$ is skipped.",
                "最接近 $2$ 的整数立方是 $1^3 = 1$ 和 $2^3 = 8$，跳过了 $2$。",
              ),
            };
      case 4:
        return {
          tex: `${pre}y^2 = x + ${c}`,
          value: false,
          why: t(`For $x = ${-c - 1}$, $y^2 = -1$ has no solution.`, `当 $x = ${-c - 1}$ 时，$y^2 = -1$ 无解。`),
          check: t(
            "Try $y = 0, 1, -1$: the squares are $0, 1, 1$, never $-1$; no square is negative.",
            "试 $y = 0, 1, -1$：平方是 $0, 1, 1$，都不是 $-1$；平方不会是负数。",
          ),
        };
      default:
        return d === "R"
          ? {
              tex: `${pre}x < y < x + 1`,
              value: true,
              why: t("Take $y = x + \\tfrac{1}{2}$.", "取 $y = x + \\tfrac{1}{2}$。"),
              check: t("Try $x = 3$: $y = 3.5$ and $3 < 3.5 < 4$.", "试 $x = 3$：$y = 3.5$，$3 < 3.5 < 4$。"),
            }
          : {
              tex: `${pre}x < y < x + 1`,
              value: false,
              why: t("There is no integer strictly between $x$ and $x + 1$.", "$x$ 与 $x + 1$ 之间没有整数。"),
              check: t(
                "Try $x = 3$: the integers next to it are $3$ and $4$, and none lies strictly between them.",
                "试 $x = 3$：相邻的整数是 $3$ 和 $4$，它们之间严格地没有整数。",
              ),
            };
    }
  }
  switch (kind) {
    case 0:
      return {
        tex: `${pre}x + y = y + ${c}`,
        value: true,
        why: t(`$x = ${c}$ works for every $y$.`, `$x = ${c}$ 对每个 $y$ 都成立。`),
        check: t(
          `With $x = ${c}$, try $y = 0$ and $y = 5$: $${c} + 0 = 0 + ${c}$ and $${c} + 5 = 5 + ${c}$.`,
          `取 $x = ${c}$，试 $y = 0$ 和 $y = 5$：$${c} + 0 = 0 + ${c}$，$${c} + 5 = 5 + ${c}$。`,
        ),
      };
    case 1:
      return {
        tex: `${pre}x + y = ${c}`,
        value: false,
        why: t(`For any fixed $x$, the equation fails for $y = ${c + 1} - x$.`, `对任何固定的 $x$，当 $y = ${c + 1} - x$ 时等式不成立。`),
        check: t(
          `Try $x = 0$: $y = ${c}$ works but $y = ${c + 1}$ gives $${c + 1}$. A fixed $x$ matches only one value of $y$.`,
          `试 $x = 0$：$y = ${c}$ 满足，但 $y = ${c + 1}$ 得 $${c + 1}$。固定的 $x$ 只能配一个 $y$。`,
        ),
      };
    case 2:
      return {
        tex: `${pre}xy = 0`,
        value: true,
        why: t("$x = 0$ works for every $y$.", "$x = 0$ 对每个 $y$ 都成立。"),
        check: t("With $x = 0$, try $y = 7$ and $y = -2$: both products are $0$.", "取 $x = 0$，试 $y = 7$ 和 $y = -2$：两个积都是 $0$。"),
      };
    case 3:
      return {
        tex: `${pre}x \\le y^2 - ${c}`,
        value: true,
        why: t(`$x = -${c}$ works, since $y^2 \\ge 0$.`, `$x = -${c}$ 满足，因为 $y^2 \\ge 0$。`),
        check: t(
          `With $x = -${c}$ the hardest case is $y = 0$, where $y^2 - ${c} = -${c}$, and $-${c} \\le -${c}$ still holds.`,
          `取 $x = -${c}$，最难的情形是 $y = 0$，这时 $y^2 - ${c} = -${c}$，而 $-${c} \\le -${c}$ 仍然成立。`,
        ),
      };
    case 4:
      return {
        tex: `${pre}x \\le y + ${c}`,
        value: false,
        why: t(`For any fixed $x$, take $y = x - ${c + 1}$.`, `对任何固定的 $x$，取 $y = x - ${c + 1}$。`),
        check: t(`Try $x = 0$: $y = -${c + 1}$ gives $0 \\le -1$, which is false.`, `试 $x = 0$：$y = -${c + 1}$ 得 $0 \\le -1$，不成立。`),
      };
    default:
      return {
        tex: `${pre}xy = ${c}y`,
        value: true,
        why: t(`$x = ${c}$ works for every $y$.`, `$x = ${c}$ 对每个 $y$ 都成立。`),
        check: t(
          `With $x = ${c}$, try $y = 2$: $${c} \\cdot 2 = ${c} \\cdot 2$; both sides are the same product for every $y$.`,
          `取 $x = ${c}$，试 $y = 2$：$${c} \\cdot 2 = ${c} \\cdot 2$；对每个 $y$ 两边都是同一个积。`,
        ),
      };
  }
}

/** nestedQuantifiers evaluates statements with two quantifiers. */
export const nestedQuantifiers: TopicDef = {
  id: "nested-quantifiers",
  title: t("Nested Quantifiers", "嵌套量词"),
  summary: t(
    "In ∀x ∃y P(x, y), y may depend on x; in ∃x ∀y P(x, y), one x must work for every y.",
    "在 ∀x ∃y P(x, y) 中 y 可以依赖于 x；在 ∃x ∀y P(x, y) 中，必须有一个 x 对所有 y 都成立。",
  ),
  intro: t(
    'Compare "every integer has a larger integer" with "some integer is larger than every integer". The first is true: for $x$ take $y = x + 1$, a different $y$ for each $x$. The second is false: one fixed $x$ would have to beat every integer, itself included. In symbols they are $\\forall x\\ \\exists y,\\ y > x$ and $\\exists y\\ \\forall x,\\ y > x$: the same quantifiers in a different order, with different meanings.\n\nCheck: for the first, try $x = 10$: $y = 11$ works. For the second, any candidate $y$ fails against $x = y$, since $y > y$ is false.\n\nIn this lesson we decide whether statements with two quantifiers are true, reading their order with care.',
    "比较“每个整数都有比它大的整数”与“有一个整数比每个整数都大”。前者为真：对 $x$ 取 $y = x + 1$，每个 $x$ 有各自的 $y$。后者为假：一个固定的 $x$ 必须大于每个整数，包括它自己。用符号写，它们是 $\\forall x\\ \\exists y,\\ y > x$ 和 $\\exists y\\ \\forall x,\\ y > x$：量词相同，次序不同，含义也不同。\n\n检验：对前者，试 $x = 10$：$y = 11$ 满足。对后者，任何候选的 $y$ 遇到 $x = y$ 都不成立，因为 $y > y$ 为假。\n\n本课我们判断含两个量词的命题的真假，并仔细读出它们的次序。",
  ),
  prerequisites: ["universal-and-existential-quantifiers"],
  encompasses: [{ topic: "universal-and-existential-quantifiers", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "for-all-there-exists-statements",
      title: t("For all … there exists …", "对所有……存在……"),
      explanation: t(
        "$\\forall x\\ \\exists y\\ P(x, y)$ is a challenge: for each $x$ someone gives you, you must find a $y$, which may depend on $x$. $\\forall x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ x + y = 0$ is true: take $y = -x$.\n\n> **Watch out.** To show such a statement false you need one $x$ for which no $y$ at all works; a single $y$ that fails proves nothing.",
        "$\\forall x\\ \\exists y\\ P(x, y)$ 像一场挑战：别人给出任意 $x$，你都要找到一个 $y$，而 $y$ 可以依赖于 $x$。$\\forall x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ x + y = 0$ 为真：取 $y = -x$。\n\n> **注意。** 要证明这样的命题为假，需要找到一个 $x$，使任何 $y$ 都不满足；某一个 $y$ 不满足什么也证明不了。",
      ),
      generate: (rng) =>
        claimProblem(
          rng,
          nestedClaim(rng, true),
          t(
            "$\\forall x\\ \\exists y$ is true if for each $x$ some $y$ works, possibly depending on $x$; it is false if some $x$ has no $y$ at all.",
            "$\\forall x\\ \\exists y$ 在每个 $x$ 都有某个 $y$ 满足时为真，$y$ 可以依赖于 $x$；若某个 $x$ 找不到任何 $y$，它就为假。",
          ),
        ),
    },
    {
      id: "there-exists-for-all-statements",
      title: t("There exists … for all …", "存在……对所有……"),
      explanation: t(
        "$\\exists x\\ \\forall y\\ P(x, y)$ is much stronger: a single $x$ must work against every $y$. $\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x + y = 0$ is false, because no one number cancels every $y$; but $\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x \\cdot y = 0$ is true with $x = 0$.\n\n> **Watch out.** The $x$ is chosen before $y$ and cannot change with it. An $x$ that works for one $y$ at a time is not enough.",
        "$\\exists x\\ \\forall y\\ P(x, y)$ 要强得多：必须有一个 $x$ 对所有 $y$ 都成立。$\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x + y = 0$ 为假，因为没有一个数能抵消所有 $y$；但 $\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x \\cdot y = 0$ 为真，取 $x = 0$。\n\n> **注意。** $x$ 在 $y$ 之前选定，不能随 $y$ 改变。只对某一个 $y$ 成立的 $x$ 是不够的。",
      ),
      generate: (rng) =>
        claimProblem(
          rng,
          nestedClaim(rng, false),
          t(
            "$\\exists x\\ \\forall y$ is true only if one single $x$ works against every $y$; it is false if every $x$ is beaten by some $y$.",
            "$\\exists x\\ \\forall y$ 只有在某一个 $x$ 对每个 $y$ 都成立时才为真；若每个 $x$ 都会被某个 $y$ 推翻，它就为假。",
          ),
        ),
    },
  ],
};

/** Pattern is an order of two quantifiers. */
type Pattern = "AE" | "EA" | "AA" | "EE";

/** patterns lists the orders of two quantifiers. */
const patterns: readonly Pattern[] = ["AE", "EA", "AA", "EE"];

/** formal writes a two-quantifier statement in symbols. */
function formal(p: Pattern, D: string, body: string): string {
  if (p === "AE") return `\\forall x \\in ${D},\\ \\exists y \\in ${D},\\ ${body}`;
  if (p === "EA") return `\\exists y \\in ${D},\\ \\forall x \\in ${D},\\ ${body}`;
  if (p === "AA") return `\\forall x \\in ${D},\\ \\forall y \\in ${D},\\ ${body}`;
  return `\\exists x \\in ${D},\\ \\exists y \\in ${D},\\ ${body}`;
}

/** informal writes a two-quantifier statement in words. */
function informal(p: Pattern, d: Domain, body: string): Text {
  const [one, many, zhNoun] = d === "Z" ? ["integer", "integers", "整数"] : ["real number", "real numbers", "实数"];
  if (p === "AE")
    return t(
      `For every ${one} $x$ there is ${one === "integer" ? "an" : "a"} ${one} $y$ such that $${body}$.`,
      `对每个${zhNoun} $x$，都存在${zhNoun} $y$ 使 $${body}$。`,
    );
  if (p === "EA")
    return t(
      `There is ${one === "integer" ? "an" : "a"} ${one} $y$ such that $${body}$ for every ${one} $x$.`,
      `存在一个${zhNoun} $y$，使得对每个${zhNoun} $x$ 都有 $${body}$。`,
    );
  if (p === "AA") return t(`$${body}$ for all ${many} $x$ and $y$.`, `对所有${zhNoun} $x$ 和 $y$，都有 $${body}$。`);
  return t(`There are ${many} $x$ and $y$ such that $${body}$.`, `存在${zhNoun} $x$ 和 $y$ 使 $${body}$。`);
}

/** patternWords says in words what an order of quantifiers claims. */
const patternWords: Record<Pattern, Text> = {
  AE: t("each $x$ has a $y$ of its own", "每个 $x$ 都有各自的 $y$"),
  EA: t("a single $y$ works for every $x$", "有一个 $y$ 对每个 $x$ 都成立"),
  AA: t("every pair $x$, $y$ satisfies the relation", "每一对 $x$、$y$ 都满足关系"),
  EE: t("at least one pair $x$, $y$ satisfies the relation", "至少有一对 $x$、$y$ 满足关系"),
};

/** body picks a relation between x and y. */
function twoVariableBody(rng: Rng): string {
  const c = rng.int(1, 9);
  return rng.pick([`x + y = ${c}`, `xy = ${c}`, `y > x + ${c}`, `y^2 = x + ${c}`, `x - y = ${c}`, `y < ${c}x`, `x^2 + y^2 = ${c}`]);
}

/** formalAndInformalLanguage translates between words and symbols. */
export const formalAndInformalLanguage: TopicDef = {
  id: "formal-and-informal-language",
  title: t("Formal and Informal Language", "形式语言与非形式语言"),
  summary: t(
    "Translate quantified statements between words and symbols, keeping track of the order of the quantifiers.",
    "在文字与符号之间翻译量化命题，注意量词的顺序。",
  ),
  intro: t(
    'The sentence "for every real number $x$ there is a real number $y$ with $y > x$" names its quantifiers in the order they apply: first "for every $x$", then "there is a $y$". So in symbols it is $\\forall x \\in \\mathbb{R},\\ \\exists y \\in \\mathbb{R},\\ y > x$. The sentence "there is a real number $y$ with $y > x$ for every real number $x$" mentions $x$ at the end, but its $y$ is chosen first, once for all $x$: $\\exists y \\in \\mathbb{R},\\ \\forall x \\in \\mathbb{R},\\ y > x$.\n\nCheck: the first statement is true ($y = x + 1$) and the second false (no $y$ exceeds itself), so the two translations must differ, and they do.\n\nIn this lesson we translate statements with two quantifiers from words into symbols and back.',
    "句子“对每个实数 $x$，都存在实数 $y$ 使 $y > x$”按量词起作用的次序说出它们：先“对每个 $x$”，再“存在 $y$”。所以用符号写是 $\\forall x \\in \\mathbb{R},\\ \\exists y \\in \\mathbb{R},\\ y > x$。句子“存在一个实数 $y$，使得对每个实数 $x$ 都有 $y > x$”在末尾才提到 $x$，但它的 $y$ 是先选定的，对所有 $x$ 都是这一个：$\\exists y \\in \\mathbb{R},\\ \\forall x \\in \\mathbb{R},\\ y > x$。\n\n检验：前一个命题为真（$y = x + 1$），后一个为假（没有 $y$ 大于它自己），所以两个译文必然不同，确实如此。\n\n本课我们把含两个量词的命题从文字译成符号，再译回来。",
  ),
  prerequisites: ["nested-quantifiers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-statements-in-symbols",
      title: t("Words to symbols", "文字译成符号"),
      explanation: t(
        '"For every real number $x$ there is a real number $y$ with $x + y = 1$" is $\\forall x \\in \\mathbb{R},\\ \\exists y \\in \\mathbb{R},\\ x + y = 1$. "There is a $y$ such that … for every $x$" puts $\\exists y$ first: $\\exists y\\ \\forall x$.\n\n> **Watch out.** Write the quantifiers in the order of choice, not in the order the words happen to appear. A "there is" whose object is fixed for every $x$ goes in front.',
        "“对每个实数 $x$，都存在实数 $y$ 使 $x + y = 1$”写作 $\\forall x \\in \\mathbb{R},\\ \\exists y \\in \\mathbb{R},\\ x + y = 1$。“存在 $y$，使得对每个 $x$ 都……”把 $\\exists y$ 放在前面：$\\exists y\\ \\forall x$。\n\n> **注意。** 量词按选取的先后来写，而不是按词语碰巧出现的先后。对每个 $x$ 都固定不变的“存在”要放在前面。",
      ),
      generate(rng) {
        const d: Domain = rng.bool() ? "Z" : "R";
        const body = twoVariableBody(rng);
        const p = rng.pick(patterns);
        const words = informal(p, d, body);
        const opt = (q: Pattern) => t(`$${formal(q, dom(d), body)}$`, `$${formal(q, dom(d), body)}$`);
        return reasoned(
          oneOf(
            rng,
            t(`Which symbolic statement says "${words.en}"?`, `哪个符号命题表示“${words["zh-CN"]}”？`),
            opt(p),
            patterns.filter((q) => q !== p).map(opt),
            walked(
              [
                [
                  ["Find what the sentence claims", "找出句子的断言"],
                  t(`The sentence says that ${patternWords[p].en}.`, `这个句子说的是${patternWords[p]["zh-CN"]}。`),
                ],
                [
                  ["Write the quantifiers in that order", "按此次序写出量词"],
                  t(`$${formal(p, dom(d), body)}$.`, `$${formal(p, dom(d), body)}$。`),
                ],
              ],
              t(
                `Read the symbols back in words: "${informal(p, d, body).en}", the sentence given.`,
                `把符号读回文字：“${informal(p, d, body)["zh-CN"]}”，正是所给的句子。`,
              ),
            ),
          ),
          patterns.map((q): Reason => [opt(q).en, `That says ${patternWords[q].en}.`, `这说的是${patternWords[q]["zh-CN"]}。`]),
        );
      },
    },
    {
      id: "reading-symbols-in-words",
      title: t("Symbols to words", "符号译成文字"),
      explanation: t(
        'Read $\\exists y \\in \\mathbb{Z},\\ \\forall x \\in \\mathbb{Z},\\ xy = x$ as "there is an integer $y$ such that $xy = x$ for every integer $x$" (true, with $y = 1$). Swapping the quantifiers changes the meaning.\n\n> **Watch out.** A sentence that mentions the variables in a different order is fine, as long as the choice order stays the same: what matters is which variable is fixed first.',
        "$\\exists y \\in \\mathbb{Z},\\ \\forall x \\in \\mathbb{Z},\\ xy = x$ 读作“存在一个整数 $y$，使得对每个整数 $x$ 都有 $xy = x$”（为真，取 $y = 1$）。交换量词会改变含义。\n\n> **注意。** 句子提到变量的先后可以不同，只要选取的先后不变：关键是哪个变量先固定。",
      ),
      generate(rng) {
        const d: Domain = rng.bool() ? "Z" : "R";
        const body = twoVariableBody(rng);
        const p = rng.pick(patterns);
        return reasoned(
          oneOf(
            rng,
            t(`Which sentence says $${formal(p, dom(d), body)}$?`, `哪个句子表示 $${formal(p, dom(d), body)}$？`),
            informal(p, d, body),
            patterns.filter((q) => q !== p).map((q) => informal(q, d, body)),
            walked(
              [
                [
                  ["Read the quantifiers in order", "按次序读量词"],
                  t(`The symbols say that ${patternWords[p].en}.`, `这些符号说的是${patternWords[p]["zh-CN"]}。`),
                ],
                [["Find the matching sentence", "找出对应的句子"], t(`"${informal(p, d, body).en}"`, `“${informal(p, d, body)["zh-CN"]}”`)],
              ],
              t(
                `Translate the sentence back into symbols: $${formal(p, dom(d), body)}$, the statement given.`,
                `把句子译回符号：$${formal(p, dom(d), body)}$，正是所给的命题。`,
              ),
            ),
          ),
          patterns.map(
            (q): Reason => [informal(q, d, body).en, `That says ${patternWords[q].en}.`, `这说的是${patternWords[q]["zh-CN"]}。`],
          ),
        );
      },
    },
  ],
};

/** negatingStatementsWithNestedQuantifiers negates statements with two quantifiers. */
export const negatingStatementsWithNestedQuantifiers: TopicDef = {
  id: "negating-statements-with-nested-quantifiers",
  title: t("Negating Statements With Nested Quantifiers", "否定含嵌套量词的命题"),
  summary: t(
    "To negate, flip every quantifier and negate the predicate: ¬(∀x ∃y P) ≡ ∃x ∀y ¬P.",
    "否定时翻转每个量词并否定谓词：¬(∀x ∃y P) ≡ ∃x ∀y ¬P。",
  ),
  intro: t(
    'Negate "every integer has a larger integer", $\\forall x\\ \\exists y,\\ y > x$, one quantifier at a time. Its negation says that not every integer has one: some integer $x$ has no larger integer, that is every $y$ fails to be larger. In symbols, $\\exists x\\ \\forall y,\\ y \\le x$. Both quantifiers flipped, and $>$ became $\\le$.\n\nCheck: the original is true, so its negation must be false, and it is: any $x$ is beaten by $y = x + 1$.\n\nIn this lesson we negate statements with two quantifiers, in symbols and in words.',
    "逐个量词地否定“每个整数都有比它大的整数”，即 $\\forall x\\ \\exists y,\\ y > x$。它的否定是说并非每个整数都有：有某个整数 $x$ 没有比它大的整数，也就是每个 $y$ 都不比它大。用符号写是 $\\exists x\\ \\forall y,\\ y \\le x$。两个量词都翻转了，$>$ 变成了 $\\le$。\n\n检验：原命题为真，所以它的否定必为假，确实如此：任何 $x$ 都会被 $y = x + 1$ 超过。\n\n本课我们否定含两个量词的命题，用符号，也用文字。",
  ),
  prerequisites: ["formal-and-informal-language", "negating-quantified-statements"],
  encompasses: [{ topic: "negating-quantified-statements", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-two-quantifiers",
      title: t("Negating two quantifiers", "否定两个量词"),
      explanation: t(
        "Negation passes through quantifiers one at a time, turning every for all into there exists and every there exists into for all: $\\neg \\forall x\\ \\exists y\\ P \\equiv \\exists x\\ \\neg \\exists y\\ P \\equiv \\exists x\\ \\forall y\\ \\neg P$. The negation of $\\forall x\\ \\exists y,\\ y > x$ is $\\exists x\\ \\forall y,\\ y \\le x$.\n\n> **Watch out.** Every quantifier flips, not just the first one, and the order of the variables stays the same.",
        "否定逐个穿过量词，把每个“对所有”变成“存在”，把每个“存在”变成“对所有”：$\\neg \\forall x\\ \\exists y\\ P \\equiv \\exists x\\ \\neg \\exists y\\ P \\equiv \\exists x\\ \\forall y\\ \\neg P$。$\\forall x\\ \\exists y,\\ y > x$ 的否定是 $\\exists x\\ \\forall y,\\ y \\le x$。\n\n> **注意。** 每个量词都要翻转，不只是第一个；变量的次序保持不变。",
      ),
      generate(rng) {
        const D = dom(rng.bool() ? "Z" : "R");
        const q1 = rng.pick(["\\forall", "\\exists"]);
        const q2 = rng.pick(["\\forall", "\\exists"]);
        const r = relation(rng, rng.pick(["x + y", "xy", "x - y", "x^2 + y", "x + 2y"]));
        const s = (a: string, b: string, body: string) =>
          t(`$${a} x \\in ${D},\\ ${b} y \\in ${D},\\ ${body}$`, `$${a} x \\in ${D},\\ ${b} y \\in ${D},\\ ${body}$`);
        const [f1, f2] = [flipQ(q1), flipQ(q2)];
        return reasoned(
          oneOf(
            rng,
            t(
              `What is the negation of $${q1} x \\in ${D},\\ ${q2} y \\in ${D},\\ ${r.tex}$?`,
              `$${q1} x \\in ${D},\\ ${q2} y \\in ${D},\\ ${r.tex}$ 的否定是什么？`,
            ),
            s(f1, f2, r.neg),
            [s(f1, f2, r.tex), s(q1, q2, r.neg), s(f1, q2, r.neg), s(f1, f2, r.wrongNeg)],
            walked(
              [
                [
                  ["Pass the outer quantifier", "穿过外层量词"],
                  t(
                    `$\\neg ${q1} x\\ (\\dots)$ becomes $${f1} x\\ \\neg(\\dots)$.`,
                    `$\\neg ${q1} x\\ (\\dots)$ 变为 $${f1} x\\ \\neg(\\dots)$。`,
                  ),
                ],
                [
                  ["Pass the inner quantifier", "穿过内层量词"],
                  t(
                    `$\\neg ${q2} y,\\ ${r.tex}$ becomes $${f2} y,\\ ${r.neg}$, so the negation is $${f1} x \\in ${D},\\ ${f2} y \\in ${D},\\ ${r.neg}$.`,
                    `$\\neg ${q2} y,\\ ${r.tex}$ 变为 $${f2} y,\\ ${r.neg}$，所以否定是 $${f1} x \\in ${D},\\ ${f2} y \\in ${D},\\ ${r.neg}$。`,
                  ),
                ],
              ],
              t(
                `Negating the answer again should give back the statement: $${f1}$ and $${f2}$ flip back to $${q1}$ and $${q2}$, and the negation of $${r.neg}$ is $${r.tex}$.`,
                `再否定一次答案，应得回原命题：$${f1}$、$${f2}$ 翻转回 $${q1}$、$${q2}$，而 $${r.neg}$ 的否定是 $${r.tex}$。`,
              ),
            ),
          ),
          [
            [s(f1, f2, r.tex).en, "That flips the quantifiers but does not negate the relation.", "这翻转了量词，却没有否定关系。"],
            [
              s(q1, q2, r.neg).en,
              "That negates the relation but keeps the quantifiers; both must flip.",
              "这否定了关系，却保留了量词；两个量词都必须翻转。",
            ],
            [
              s(f1, q2, r.neg).en,
              "That flips only the first quantifier; the negation passes through both.",
              "这只翻转了第一个量词；否定要穿过两个量词。",
            ],
            [
              s(f1, f2, r.wrongNeg).en,
              `The negation of $${r.tex}$ is $${r.neg}$, not $${r.wrongNeg}$.`,
              `$${r.tex}$ 的否定是 $${r.neg}$，不是 $${r.wrongNeg}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "negating-nested-sentences-in-words",
      title: t("Negating nested sentences", "否定嵌套语句"),
      explanation: t(
        'The negation of "for every real number $x$ there is a real number $y$ with $xy = 1$" is "there is a real number $x$ such that $xy \\ne 1$ for every real number $y$" — true, with $x = 0$.\n\n> **Watch out.** Make all three changes: "for every" becomes "there is", "there is" becomes "for every", and the relation is negated. Missing any one of them gives a statement that is not the negation.',
        "“对每个实数 $x$，都存在实数 $y$ 使 $xy = 1$”的否定是“存在一个实数 $x$，使得对每个实数 $y$ 都有 $xy \\ne 1$”——它为真，取 $x = 0$。\n\n> **注意。** 三处都要改：“对每个”变为“存在”，“存在”变为“对每个”，关系取否定。漏掉任何一处，得到的都不是否定。",
      ),
      generate(rng) {
        const d: Domain = rng.bool() ? "Z" : "R";
        const c = rng.int(1, 9);
        const [rel, neg] = rng.pick([
          [`x + y = ${c}`, `x + y \\ne ${c}`],
          [`xy = ${c}`, `xy \\ne ${c}`],
          [`y > x + ${c}`, `y \\le x + ${c}`],
          [`y^2 = x + ${c}`, `y^2 \\ne x + ${c}`],
          [`y < ${c}x`, `y \\ge ${c}x`],
        ] as const);
        const [one, zh] = d === "Z" ? ["integer", "整数"] : ["real number", "实数"];
        const an = one === "integer" ? "an" : "a";
        const ae = (body: string) =>
          t(`For every ${one} $x$ there is ${an} ${one} $y$ with $${body}$.`, `对每个${zh} $x$，都存在${zh} $y$ 使 $${body}$。`);
        const ea = (body: string) =>
          t(
            `There is ${an} ${one} $x$ such that $${body}$ for every ${one} $y$.`,
            `存在一个${zh} $x$，使得对每个${zh} $y$ 都有 $${body}$。`,
          );
        const startAE = rng.bool();
        const original = startAE ? ae(rel) : ea(rel);
        const right = startAE ? ea(neg) : ae(neg);
        const keep = startAE ? ae(neg) : ea(neg);
        const flipOnly = startAE ? ea(rel) : ae(rel);
        return reasoned(
          oneOf(
            rng,
            t(`What is the negation of "${original.en}"?`, `“${original["zh-CN"]}”的否定是什么？`),
            right,
            [keep, flipOnly],
            walked(
              [
                [
                  ["Switch the quantifiers", "互换量词"],
                  t(
                    `"For every $x$" and "there is $y$" become "there is $x$" and "for every $y$"${startAE ? "" : ", and the other way round"}.`,
                    `“对每个 $x$”“存在 $y$”变为“存在 $x$”“对每个 $y$”${startAE ? "" : "，反之亦然"}。`,
                  ),
                ],
                [
                  ["Negate the relation", "否定关系"],
                  t(`$${rel}$ becomes $${neg}$. The negation is "${right.en}"`, `$${rel}$ 变为 $${neg}$。否定是“${right["zh-CN"]}”`),
                ],
              ],
              startAE
                ? t(
                    `The two cannot both hold: the answer's $x$ would be one for which no $y$ gives $${rel}$, while the original promises such a $y$ for every $x$. Nor can both fail, since then every $x$ would have such a $y$ and also one would not.`,
                    `两者不可能同时成立：答案中的 $x$ 找不到使 $${rel}$ 的 $y$，而原命题保证每个 $x$ 都有这样的 $y$。两者也不可能同时不成立，否则每个 $x$ 都有这样的 $y$，同时又有一个没有。`,
                  )
                : t(
                    `The two cannot both hold: the original's $x$ gives $${rel}$ for every $y$, while the answer says that this $x$, like every other, has some $y$ with $${neg}$. Nor can both fail, for the same reason read the other way.`,
                    `两者不可能同时成立：原命题中的 $x$ 对每个 $y$ 都使 $${rel}$，而答案说这个 $x$ 和其他每个 $x$ 一样，都有某个 $y$ 使 $${neg}$。同理两者也不可能同时不成立。`,
                  ),
            ),
          ),
          [
            [keep.en, "That negates the relation but keeps the quantifiers in place.", "这否定了关系，却保留了原来的量词。"],
            [flipOnly.en, "That switches the quantifiers but does not negate the relation.", "这互换了量词，却没有否定关系。"],
          ],
        );
      },
    },
  ],
};

/** quantified writes a quantified predicate such as "\forall x\, P(x)". */
const quantified = (q: string, x: string, p: string) => `${q} ${x}\\, ${p}(${x})`;

/** prenexNormalForm moves quantifiers to the front of a statement. */
export const prenexNormalForm: TopicDef = {
  id: "prenex-normal-form",
  title: t("Prenex Normal Form", "前束范式"),
  summary: t(
    "A statement is in prenex normal form when all its quantifiers come first, followed by a quantifier-free formula.",
    "若一个命题的所有量词都在最前面，后面是不含量词的公式，则称它为前束范式。",
  ),
  intro: t(
    "The statement $(\\forall x\\, P(x)) \\wedge (\\exists y\\, Q(y))$ has its quantifiers inside the brackets. Since $x$ appears only on the left and $y$ only on the right, the quantifiers can be written at the front: $\\forall x\\, \\exists y\\, (P(x) \\wedge Q(y))$. A statement with all its quantifiers in front, followed by a formula without quantifiers, is in **prenex normal form**.\n\nCheck: in a domain where $P(x)$ holds for every $x$ and $Q(5)$ holds, both forms are true, the second with $y = 5$ whatever $x$ is.\n\nIn this lesson we move quantifiers out of conjunctions, disjunctions and implications, flipping them when a negation or a hypothesis requires it.",
    "命题 $(\\forall x\\, P(x)) \\wedge (\\exists y\\, Q(y))$ 的量词在括号里面。由于 $x$ 只出现在左边，$y$ 只出现在右边，量词可以写到最前面：$\\forall x\\, \\exists y\\, (P(x) \\wedge Q(y))$。所有量词都在最前面、后面是不含量词的公式的命题，称为**前束范式**。\n\n检验：在 $P(x)$ 对每个 $x$ 成立、且 $Q(5)$ 成立的论域中，两种形式都为真，后者不论 $x$ 是什么都取 $y = 5$。\n\n本课我们把量词从合取、析取和蕴涵中提出来，在否定或前提要求时翻转它们。",
  ),
  prerequisites: ["negating-statements-with-nested-quantifiers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "pulling-quantifiers-out-of-conjunctions-and-disjunctions",
      title: t("Pulling quantifiers out of ∧ and ∨", "从 ∧ 与 ∨ 中提出量词"),
      explanation: t(
        "When $y$ does not occur in $P(x)$, $(\\forall x\\, P(x)) \\wedge (\\exists y\\, Q(y)) \\equiv \\forall x\\, \\exists y\\, (P(x) \\wedge Q(y))$, and the same holds with $\\vee$. A negation in front must first be pushed in: $\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$.\n\n> **Watch out.** Only a quantifier with a negation in front of it flips. A quantifier moved out of $\\wedge$ or $\\vee$ without one keeps its kind.",
        "当 $y$ 不出现在 $P(x)$ 中时，$(\\forall x\\, P(x)) \\wedge (\\exists y\\, Q(y)) \\equiv \\forall x\\, \\exists y\\, (P(x) \\wedge Q(y))$，换成 $\\vee$ 也成立。前面若有否定，要先把它移入：$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$。\n\n> **注意。** 只有前面带否定的量词才翻转。从 $\\wedge$ 或 $\\vee$ 中提出、前面没有否定的量词，保持原来的种类。",
      ),
      generate(rng) {
        const [P, Q] = rng.shuffle(["P", "Q", "R", "S"]);
        const q1 = rng.pick(["\\forall", "\\exists"]);
        const q2 = rng.pick(["\\forall", "\\exists"]);
        const op = rng.pick(["\\wedge", "\\vee"]);
        const negated = rng.bool();
        const left = negated ? `\\neg (${quantified(q1, "x", P!)})` : `(${quantified(q1, "x", P!)})`;
        const statement = `${left} ${op} (${quantified(q2, "y", Q!)})`;
        const outer = negated ? flipQ(q1) : q1;
        const inner = (lp: string) => `(${lp} ${op} ${Q}(y))`;
        const lp = negated ? `\\neg ${P}(x)` : `${P}(x)`;
        const form = (a: string, b: string, l: string) => t(`$${a} x\\, ${b} y\\, ${inner(l)}$`, `$${a} x\\, ${b} y\\, ${inner(l)}$`);
        const wrongOuter = form(negated ? q1 : flipQ(q1), q2, lp);
        return reasoned(
          oneOf(
            rng,
            t(`Which is a prenex normal form of $${statement}$?`, `$${statement}$ 的前束范式是哪个？`),
            form(outer, q2, lp),
            [wrongOuter, form(outer, flipQ(q2), lp), form(flipQ(outer), flipQ(q2), lp)],
            walked(
              [
                negated
                  ? [
                      ["Push the negation in", "把否定移入"],
                      t(
                        `$\\neg ${quantified(q1, "x", P!)} \\equiv ${outer} x\\, \\neg ${P}(x)$: the quantifier flips.`,
                        `$\\neg ${quantified(q1, "x", P!)} \\equiv ${outer} x\\, \\neg ${P}(x)$：量词翻转。`,
                      ),
                    ]
                  : [
                      ["Check the variables", "检查变量"],
                      t(
                        `$x$ appears only in the left part and $y$ only in the right, and there is no negation in front.`,
                        `$x$ 只出现在左边，$y$ 只出现在右边，前面也没有否定。`,
                      ),
                    ],
                [
                  ["Move the quantifiers out", "提出量词"],
                  t(
                    `Each variable appears in only one part, so both quantifiers move out unchanged: $${outer} x\\, ${q2} y\\, ${inner(lp)}$.`,
                    `每个变量只出现在一个部分中，所以两个量词原样提出：$${outer} x\\, ${q2} y\\, ${inner(lp)}$。`,
                  ),
                ],
              ],
              t(
                `Push the quantifiers back in: $${q2} y$ only concerns $${Q}(y)$ and $${outer} x$ only $${lp}$, which gives $(${outer} x\\, ${lp}) ${op} (${quantified(q2, "y", Q!)})$, the statement ${negated ? "after its negation was pushed in" : "itself"}.`,
                `把量词移回去：$${q2} y$ 只涉及 $${Q}(y)$，$${outer} x$ 只涉及 $${lp}$，得到 $(${outer} x\\, ${lp}) ${op} (${quantified(q2, "y", Q!)})$，${negated ? "即移入否定之后的原命题" : "正是原命题"}。`,
              ),
            ),
          ),
          [
            [
              wrongOuter.en,
              negated
                ? `That moves $${q1}$ out without flipping it; the negation in front of it flips it to $${outer}$.`
                : `That flips $${q1}$, but with no negation in front it moves out unchanged.`,
              negated ? `这把 $${q1}$ 原样提出；它前面的否定会把它翻转为 $${outer}$。` : `这翻转了 $${q1}$，但它前面没有否定，应原样提出。`,
            ],
            [
              form(outer, flipQ(q2), lp).en,
              `That flips $${q2}$; $${Q}(y)$ has no negation in front, so its quantifier keeps its kind.`,
              `这翻转了 $${q2}$；$${Q}(y)$ 前面没有否定，它的量词保持原来的种类。`,
            ],
            [
              form(flipQ(outer), flipQ(q2), lp).en,
              "That flips both quantifiers, as a negation of the whole statement would.",
              "这把两个量词都翻转了，那是否定整个命题时才有的变化。",
            ],
          ],
        );
      },
    },
    {
      id: "pulling-quantifiers-out-of-implications",
      title: t("Pulling quantifiers out of implications", "从蕴涵中提出量词"),
      explanation: t(
        "Since $A \\Rightarrow B \\equiv \\neg A \\vee B$, a quantifier in the hypothesis flips when it moves out, while one in the conclusion does not: $(\\exists x\\, P(x)) \\Rightarrow (\\forall y\\, Q(y)) \\equiv \\forall x\\, \\forall y\\, (P(x) \\Rightarrow Q(y))$.\n\n> **Watch out.** The hypothesis sits under a hidden negation, so its quantifier flips; the conclusion does not, so its quantifier stays.",
        "由于 $A \\Rightarrow B \\equiv \\neg A \\vee B$，前提中的量词提出时要翻转，而结论中的量词不变：$(\\exists x\\, P(x)) \\Rightarrow (\\forall y\\, Q(y)) \\equiv \\forall x\\, \\forall y\\, (P(x) \\Rightarrow Q(y))$。\n\n> **注意。** 前提处在一个隐含的否定之下，所以它的量词翻转；结论没有，所以它的量词不变。",
      ),
      generate(rng) {
        const [P, Q] = rng.shuffle(["P", "Q", "R", "S"]);
        const q1 = rng.pick(["\\forall", "\\exists"]);
        const q2 = rng.pick(["\\forall", "\\exists"]);
        const statement = `(${quantified(q1, "x", P!)}) \\Rightarrow (${quantified(q2, "y", Q!)})`;
        const body = `(${P}(x) \\Rightarrow ${Q}(y))`;
        const form = (a: string, b: string) => t(`$${a} x\\, ${b} y\\, ${body}$`, `$${a} x\\, ${b} y\\, ${body}$`);
        const f1 = flipQ(q1);
        return reasoned(
          oneOf(
            rng,
            t(`Which is a prenex normal form of $${statement}$?`, `$${statement}$ 的前束范式是哪个？`),
            form(f1, q2),
            [form(q1, q2), form(f1, flipQ(q2)), form(q1, flipQ(q2))],
            walked(
              [
                [
                  ["Rewrite the implication", "改写蕴涵"],
                  t(
                    `$A \\Rightarrow B \\equiv \\neg A \\vee B$, and $\\neg ${quantified(q1, "x", P!)} \\equiv ${f1} x\\, \\neg ${P}(x)$, so the statement is $(${f1} x\\, \\neg ${P}(x)) \\vee (${quantified(q2, "y", Q!)})$.`,
                    `$A \\Rightarrow B \\equiv \\neg A \\vee B$，而 $\\neg ${quantified(q1, "x", P!)} \\equiv ${f1} x\\, \\neg ${P}(x)$，所以原命题为 $(${f1} x\\, \\neg ${P}(x)) \\vee (${quantified(q2, "y", Q!)})$。`,
                  ),
                ],
                [
                  ["Move the quantifiers out", "提出量词"],
                  t(
                    `Each variable appears in one part only: $${f1} x\\, ${q2} y\\, (\\neg ${P}(x) \\vee ${Q}(y))$, which is $${f1} x\\, ${q2} y\\, ${body}$.`,
                    `每个变量只出现在一个部分中：$${f1} x\\, ${q2} y\\, (\\neg ${P}(x) \\vee ${Q}(y))$，即 $${f1} x\\, ${q2} y\\, ${body}$。`,
                  ),
                ],
              ],
              t(
                `Try a case: let $${P}(x)$ be false for every $x$. Then $${quantified(q1, "x", P!)}$ is false, so the original implication is true; and every $${body}$ has a false hypothesis, so the answer is true as well.`,
                `试一种情形：设 $${P}(x)$ 对每个 $x$ 都为假。这时 $${quantified(q1, "x", P!)}$ 为假，原蕴涵为真；而每个 $${body}$ 的前提都为假，答案也为真。`,
              ),
            ),
          ),
          [
            [
              form(q1, q2).en,
              `That keeps $${q1}$; a quantifier in the hypothesis flips when it moves out.`,
              `这保留了 $${q1}$；前提中的量词提出时要翻转。`,
            ],
            [
              form(f1, flipQ(q2)).en,
              `That flips $${q2}$ too; the quantifier of the conclusion stays.`,
              `这把 $${q2}$ 也翻转了；结论中的量词不变。`,
            ],
            [
              form(q1, flipQ(q2)).en,
              "That flips the wrong quantifier: the hypothesis's flips and the conclusion's stays.",
              "这翻转错了量词：应翻转前提的，保留结论的。",
            ],
          ],
        );
      },
    },
  ],
};

/** follows tells whether the conclusion is true in every row where all premises are true, and returns a counterexample row otherwise. */
export function follows(premises: readonly Formula[], conclusion: Formula) {
  const vars = varsOf(...premises, conclusion);
  for (const env of rows(vars)) {
    if (premises.every((p) => evaluate(p, env)) && !evaluate(conclusion, env)) return { valid: false, env, vars } as const;
  }
  return { valid: true, vars } as const;
}

/** argumentTex writes premises and a conclusion. */
const argumentTex = (premises: readonly Formula[], conclusion: Formula) =>
  t(
    `premises $${premises.map(tex).join("$, $")}$ and conclusion $${tex(conclusion)}$`,
    `前提 $${premises.map(tex).join("$、$")}$，结论 $${tex(conclusion)}$`,
  );

/** validityProblem asks whether an argument is valid, walks through the rows that matter, and checks the other way round. */
function validityProblem(rng: Rng, premises: readonly Formula[], conclusion: Formula, named?: Text): Problem {
  const r = follows(premises, conclusion);
  const arg = argumentTex(premises, conclusion);
  const all = rows(r.vars);
  const rowTex = (env: (typeof all)[number]) => r.vars.map((x) => `${x} = ${TF(env[x])}`).join(", ");
  const list = (envs: typeof all) => envs.map((env) => `$${rowTex(env)}$`);
  const c = tex(conclusion);
  const note = named ? ` ${named.en}` : "";
  const noteZh = named ? named["zh-CN"] : "";
  let solution: Text;
  if (r.valid) {
    const supporting = all.filter((env) => premises.every((p) => evaluate(p, env)));
    const falseConclusion = all.filter((env) => !evaluate(conclusion, env));
    solution = walked(
      [
        [
          ["Find the rows where every premise is true", "找出所有前提都为真的行"],
          t(`They are ${list(supporting).join("; ")}.`, `它们是 ${list(supporting).join("；")}。`),
        ],
        [
          ["Look at the conclusion in those rows", "看这些行中的结论"],
          t(
            `$${c}$ is true in each of them, so no row makes every premise true and the conclusion false: the argument is valid.${note}`,
            `$${c}$ 在每一行中都为真，所以没有一行使所有前提为真而结论为假：论证有效。${noteZh}`,
          ),
        ],
      ],
      falseConclusion.length === 0
        ? t(
            `Go the other way: $${c}$ is true in every row, so no counterexample can exist.`,
            `反过来看：$${c}$ 在每一行都为真，所以不可能有反例。`,
          )
        : t(
            `Go the other way: the rows where $${c}$ is false are ${list(falseConclusion).join("; ")}, and in each of them some premise is false, so none is a counterexample.`,
            `反过来看：使 $${c}$ 为假的行是 ${list(falseConclusion).join("；")}，其中每一行都有某个前提为假，所以没有一行是反例。`,
          ),
    );
  } else {
    const row = rowTex(r.env);
    solution = walked(
      [
        [
          ["Look for a counterexample", "寻找反例"],
          t(
            "A counterexample is a row in which every premise is true and the conclusion is false; one is enough to make the argument invalid.",
            "反例是使所有前提为真而结论为假的一行；只要有一行，论证就无效。",
          ),
        ],
        [
          ["Find one", "找出一行"],
          t(
            `With $${row}$ every premise is true but $${c}$ is false, so the argument is not valid.${note}`,
            `当 $${row}$ 时所有前提都为真，但 $${c}$ 为假，所以论证无效。${noteZh}`,
          ),
        ],
      ],
      t(
        `Put $${row}$ into each formula: ${premises.map((p) => `$${tex(p)}$ is ${TF(evaluate(p, r.env))}`).join(", ")}, and $${c}$ is ${TF(evaluate(conclusion, r.env))}.`,
        `把 $${row}$ 代入每个公式：${premises.map((p) => `$${tex(p)}$ 为 ${TF(evaluate(p, r.env))}`).join("，")}，而 $${c}$ 为 ${TF(evaluate(conclusion, r.env))}。`,
      ),
    );
  }
  return reasoned(
    oneOf(
      rng,
      t(`Is the argument with ${arg.en} valid?`, `${arg["zh-CN"]}的论证有效吗？`),
      yesNo[r.valid ? 0 : 1]!,
      [yesNo[r.valid ? 1 : 0]!],
      solution,
    ),
    r.valid
      ? [
          [
            yesNo[1]!.en,
            "An invalid argument needs a row with every premise true and the conclusion false; look at the rows where the premises all hold.",
            "无效的论证需要有一行使所有前提为真而结论为假；看看所有前提都成立的那些行。",
          ],
        ]
      : [
          [
            yesNo[0]!.en,
            "Valid means the conclusion holds in every row where the premises do; look for a row where the premises hold and the conclusion fails.",
            "有效是指在前提都成立的每一行结论都成立；找找前提成立而结论不成立的行。",
          ],
        ],
  );
}

/** neg negates a literal without doubling negations. */
const neg = (f: Formula) => (f.k === "not" ? f.a : not(f));

/** literalPair picks two literals on distinct letters. */
const literalPair = (rng: Rng): [Formula, Formula] => {
  const [a, b] = twoLetters(rng);
  return [rng.int(0, 3) === 0 ? not(a) : a, rng.int(0, 3) === 0 ? not(b) : b];
};

/** capital starts a sentence with a capital letter. */
const capital = (s: string) => s.replace(/^./, (ch) => ch.toUpperCase());

/** implicationEliminationAndDenyingTheConsequent applies modus ponens and modus tollens. */
export const implicationEliminationAndDenyingTheConsequent: TopicDef = {
  id: "implication-elimination-and-denying-the-consequent",
  title: t("Implication Elimination and Denying the Consequent", "肯定前件与否定后件"),
  summary: t(
    "From p ⇒ q and p conclude q (modus ponens); from p ⇒ q and ¬q conclude ¬p (modus tollens).",
    "由 p ⇒ q 与 p 推出 q（肯定前件）；由 p ⇒ q 与 ¬q 推出 ¬p（否定后件）。",
  ),
  intro: t(
    'Suppose "if $n$ is a multiple of $6$, then $n$ is even" is true. If we also know that $n = 18$ is a multiple of $6$, we may conclude that $18$ is even: the hypothesis holds, so the conclusion does. If instead we know that $n = 25$ is not even, we may conclude that $25$ is not a multiple of $6$: were it one, it would be even. The first step is **modus ponens**, the second **modus tollens**.\n\nCheck: $18 = 2 \\cdot 9$ is even, and $25 = 6 \\cdot 4 + 1$ is indeed not a multiple of $6$.\n\nIn this lesson we draw conclusions from conditionals and tell valid forms of argument from two common fallacies.',
    "设“如果 $n$ 是 $6$ 的倍数，那么 $n$ 是偶数”为真。若还知道 $n = 18$ 是 $6$ 的倍数，就可以得出 $18$ 是偶数：前提成立，所以结论成立。若知道的是 $n = 25$ 不是偶数，就可以得出 $25$ 不是 $6$ 的倍数：假如它是，它就会是偶数。前一步是**肯定前件**，后一步是**否定后件**。\n\n检验：$18 = 2 \\cdot 9$ 是偶数；$25 = 6 \\cdot 4 + 1$ 确实不是 $6$ 的倍数。\n\n本课我们由条件命题得出结论，并区分有效的论证形式和两种常见谬误。",
  ),
  prerequisites: ["converse-inverse-and-contrapositive", "tautologies-and-contradictions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "drawing-conclusions-from-conditionals",
      title: t("Drawing conclusions", "得出结论"),
      explanation: t(
        "An argument is **valid** when the conclusion is true whenever all premises are. **Modus ponens:** from $p \\Rightarrow q$ and $p$, conclude $q$. **Modus tollens:** from $p \\Rightarrow q$ and $\\neg q$, conclude $\\neg p$, because $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$.\n\n> **Watch out.** Modus tollens denies the conclusion and concludes the hypothesis is false. Denying the hypothesis instead tells you nothing about the conclusion.",
        "若所有前提为真时结论必为真，则论证**有效**。**肯定前件：**由 $p \\Rightarrow q$ 与 $p$ 推出 $q$。**否定后件：**由 $p \\Rightarrow q$ 与 $\\neg q$ 推出 $\\neg p$，因为 $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$。\n\n> **注意。** 否定后件是否定结论，从而推出前提为假。反过来否定前提，对结论什么也说明不了。",
      ),
      generate(rng) {
        const f = fact(rng);
        const not = (x: Text) => t(`it is not true that ${x.en}`, `${x["zh-CN"]}不成立`);
        const ponens = rng.bool();
        const second = ponens ? f.a : not(f.b);
        const right = ponens ? f.b : not(f.a);
        const clash = ponens ? not(f.b) : f.a;
        const denies = ponens ? not(f.a) : f.b;
        return reasoned(
          oneOf(
            rng,
            t(
              `Suppose "if ${f.a.en}, then ${f.b.en}" is true and ${second.en}. What can you conclude?`,
              `已知“如果 ${f.a["zh-CN"]}，那么 ${f.b["zh-CN"]}”为真，且${second["zh-CN"]}。可以得出什么结论？`,
            ),
            t(`${capital(right.en)}.`, `${right["zh-CN"]}。`),
            [
              t(`${capital(clash.en)}.`, `${clash["zh-CN"]}。`),
              t(`${capital(denies.en)}.`, `${denies["zh-CN"]}。`),
              t("Nothing can be concluded.", "无法得出任何结论。"),
            ],
            walked(
              [
                [
                  ["Name the form", "认出形式"],
                  ponens
                    ? t(
                        `The second fact says the hypothesis "${f.a.en}" holds: this is modus ponens.`,
                        `第二个事实说前提“${f.a["zh-CN"]}”成立：这是肯定前件。`,
                      )
                    : t(
                        `The second fact says the conclusion "${f.b.en}" fails: this is modus tollens.`,
                        `第二个事实说结论“${f.b["zh-CN"]}”不成立：这是否定后件。`,
                      ),
                ],
                [
                  ["Conclude", "得出结论"],
                  ponens
                    ? t(`The hypothesis holds, so the conclusion holds: ${f.b.en}.`, `前提成立，所以结论成立：${f.b["zh-CN"]}。`)
                    : t(
                        `The conclusion fails, so the hypothesis cannot hold: ${right.en}.`,
                        `结论不成立，所以前提不可能成立：${right["zh-CN"]}。`,
                      ),
                ],
              ],
              ponens
                ? t(
                    `Use the contrapositive instead: "if it is not true that ${f.b.en}, then it is not true that ${f.a.en}". Were the conclusion false, the hypothesis would be false too, against the given fact; so the conclusion holds.`,
                    `改用逆否命题：“如果${f.b["zh-CN"]}不成立，那么${f.a["zh-CN"]}不成立”。假如结论为假，前提也会为假，与已知事实矛盾；所以结论成立。`,
                  )
                : t(
                    `Suppose instead that ${f.a.en}. Then the conditional gives ${f.b.en}, against the given fact; so the hypothesis fails.`,
                    `反设${f.a["zh-CN"]}。那么由条件命题得${f.b["zh-CN"]}，与已知事实矛盾；所以前提不成立。`,
                  ),
            ),
          ),
          [
            [
              `${capital(clash.en)}.`,
              "This cannot hold: with the conditional and the given fact it leads to a contradiction.",
              "这不可能成立：它与条件命题和已知事实放在一起会产生矛盾。",
            ],
            [`${capital(denies.en)}.`, "This contradicts the fact that was given.", "这与已知事实矛盾。"],
            [
              "Nothing can be concluded.",
              "The conditional and the given fact are enough to draw a conclusion here.",
              "条件命题和已知事实足以在这里得出结论。",
            ],
          ],
        );
      },
    },
    {
      id: "recognizing-valid-and-invalid-forms",
      title: t("Valid and invalid forms", "有效与无效的形式"),
      explanation: t(
        "Two common fallacies look similar to valid forms. **Affirming the consequent:** from $p \\Rightarrow q$ and $q$, concluding $p$. **Denying the antecedent:** from $p \\Rightarrow q$ and $\\neg p$, concluding $\\neg q$. Both fail when $p$ is false and $q$ is true.\n\n> **Watch out.** An argument whose conclusion happens to be true can still be invalid. Validity asks whether the premises force the conclusion in every row, not whether it is true in one.",
        "有两种常见谬误看起来很像有效形式。**肯定后件：**由 $p \\Rightarrow q$ 与 $q$ 推出 $p$。**否定前件：**由 $p \\Rightarrow q$ 与 $\\neg p$ 推出 $\\neg q$。当 $p$ 假而 $q$ 真时，两者都不成立。\n\n> **注意。** 结论碰巧为真的论证也可能无效。有效性问的是前提是否在每一行都迫使结论成立，而不是结论在某一行是否为真。",
      ),
      generate(rng) {
        const [a, b] = literalPair(rng);
        const form = rng.int(0, 3);
        const premise = imp(a, b);
        const [second, conclusion] = [
          [a, b],
          [neg(b), neg(a)],
          [b, a],
          [neg(a), neg(b)],
        ][form]! as [Formula, Formula];
        const names = [
          t("This is modus ponens.", "这是肯定前件。"),
          t("This is modus tollens.", "这是否定后件。"),
          t("This is the fallacy of affirming the consequent.", "这是肯定后件的谬误。"),
          t("This is the fallacy of denying the antecedent.", "这是否定前件的谬误。"),
        ];
        return validityProblem(rng, [premise, second], conclusion, names[form]);
      },
    },
  ],
};

/** disjunctiveSyllogismAndTransitivityOfImplication chains inferences. */
export const disjunctiveSyllogismAndTransitivityOfImplication: TopicDef = {
  id: "disjunctive-syllogism-and-transitivity-of-implication",
  title: t("Disjunctive Syllogism and Transitivity of Implication", "选言推理与蕴涵的传递性"),
  summary: t("From p ∨ q and ¬p conclude q; from p ⇒ q and q ⇒ r conclude p ⇒ r.", "由 p ∨ q 与 ¬p 推出 q；由 p ⇒ q 与 q ⇒ r 推出 p ⇒ r。"),
  intro: t(
    'A number $n$ is known to be odd or a multiple of $4$, and it is not odd. Then it is a multiple of $4$: of the two options, at least one holds, and one has been ruled out. This is **disjunctive syllogism**. Separately, if "$n$ is a multiple of $8$" implies "$n$ is a multiple of $4$", and that implies "$n$ is even", then "$n$ is a multiple of $8$" implies "$n$ is even": the implications chain. This is **transitivity**.\n\nCheck: try $n = 16$ in the chain: it is a multiple of $8$, of $4$ and of $2$, as each link promises.\n\nIn this lesson we use these two rules, rearranging premises into a chain when they come out of order.',
    "已知一个数 $n$ 是奇数或是 $4$ 的倍数，且它不是奇数。那么它是 $4$ 的倍数：两个选项至少有一个成立，而其中一个已被排除。这就是**选言推理**。另外，若“$n$ 是 $8$ 的倍数”蕴涵“$n$ 是 $4$ 的倍数”，后者又蕴涵“$n$ 是偶数”，则“$n$ 是 $8$ 的倍数”蕴涵“$n$ 是偶数”：蕴涵可以串联。这就是**传递性**。\n\n检验：在这条链上试 $n = 16$：它是 $8$ 的倍数、$4$ 的倍数，也是 $2$ 的倍数，正如每一环所保证的。\n\n本课我们使用这两条规则，前提次序打乱时先把它们排成一条链。",
  ),
  prerequisites: ["implication-elimination-and-denying-the-consequent"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-disjunctive-syllogism",
      title: t("Disjunctive syllogism", "选言推理"),
      explanation: t(
        '**Disjunctive syllogism:** from $p \\vee q$ and $\\neg p$, conclude $q$. If at least one of two statements is true and one of them is false, the other must be true.\n\n> **Watch out.** The rule needs one part denied. From $p \\vee q$ and $p$ nothing follows about $q$, since "or" allows both parts to be true.',
        "**选言推理：**由 $p \\vee q$ 与 $\\neg p$ 推出 $q$。若两个命题中至少有一个为真，而其中一个为假，则另一个必为真。\n\n> **注意。** 这条规则需要否定其中一部分。由 $p \\vee q$ 与 $p$ 推不出关于 $q$ 的任何结论，因为“或”允许两部分都为真。",
      ),
      generate(rng) {
        const [a, b] = literalPair(rng);
        const denyFirst = rng.bool();
        const denied = denyFirst ? a : b;
        const premises = [or(a, b), neg(denied)];
        const right = denyFirst ? b : a;
        const wrong = [neg(right), denied, and(a, b)];
        return reasoned(
          oneOf(
            rng,
            t(
              `From the premises $${tex(premises[0]!)}$ and $${tex(premises[1]!)}$, which statement follows?`,
              `由前提 $${tex(premises[0]!)}$ 与 $${tex(premises[1]!)}$，可以推出哪个命题？`,
            ),
            math(right),
            wrong.map(math),
            walked(
              [
                [
                  ["Use the second premise", "使用第二个前提"],
                  t(`$${tex(premises[1]!)}$ says that $${tex(denied)}$ is false.`, `$${tex(premises[1]!)}$ 说明 $${tex(denied)}$ 为假。`),
                ],
                [
                  ["Use the first premise", "使用第一个前提"],
                  t(
                    `At least one of $${tex(a)}$, $${tex(b)}$ is true, and it is not $${tex(denied)}$, so $${tex(right)}$ is true.`,
                    `$${tex(a)}$、$${tex(b)}$ 中至少一个为真，而不是 $${tex(denied)}$，所以 $${tex(right)}$ 为真。`,
                  ),
                ],
              ],
              t(
                `Suppose $${tex(right)}$ were false as well. Then both parts of $${tex(premises[0]!)}$ would be false and the first premise would fail; so $${tex(right)}$ must be true.`,
                `假设 $${tex(right)}$ 也为假。那么 $${tex(premises[0]!)}$ 的两部分都为假，第一个前提就不成立；所以 $${tex(right)}$ 必为真。`,
              ),
            ),
          ),
          [
            [
              math(neg(right)).en,
              'This is the opposite of what follows: at least one part of the "or" is true, and the other part is false.',
              "这与结论相反：“或”的两部分至少有一个为真，而另一部分为假。",
            ],
            [math(denied).en, "This part is denied by the second premise.", "这一部分被第二个前提否定了。"],
            [
              math(and(a, b)).en,
              "This needs both parts true, but the second premise denies one of them.",
              "这要求两部分都为真，但第二个前提否定了其中一个。",
            ],
          ],
        );
      },
    },
    {
      id: "chaining-implications",
      title: t("Chaining implications", "串联蕴涵"),
      explanation: t(
        "**Transitivity:** from $p \\Rightarrow q$ and $q \\Rightarrow r$, conclude $p \\Rightarrow r$. Premises may be given in any order or in contrapositive form; rearrange them into a chain first.\n\n> **Watch out.** A premise $\\neg q \\Rightarrow \\neg p$ is the same link as $p \\Rightarrow q$, but a converse $q \\Rightarrow p$ is not; and a chain only runs forward, so it never gives $r \\Rightarrow p$.",
        "**传递性：**由 $p \\Rightarrow q$ 与 $q \\Rightarrow r$ 推出 $p \\Rightarrow r$。前提可能以任意顺序或以逆否形式给出；先把它们排成一条链。\n\n> **注意。** 前提 $\\neg q \\Rightarrow \\neg p$ 与 $p \\Rightarrow q$ 是同一环，但逆命题 $q \\Rightarrow p$ 不是；链只能向前走，所以永远得不到 $r \\Rightarrow p$。",
      ),
      generate(rng) {
        const letters = rng.shuffle(["p", "q", "r", "s"] as const).map((x) => (rng.int(0, 3) === 0 ? not(v(x)) : v(x)));
        const length = rng.int(2, 3);
        const chain = letters.slice(0, length + 1);
        let flipped = false;
        const premises = chain.slice(0, -1).map((x, i) => {
          const y = chain[i + 1]!;
          if (rng.int(0, 3) > 0) return imp(x, y);
          flipped = true;
          return imp(neg(y), neg(x));
        });
        const first = chain[0]!;
        const last = chain[length]!;
        const right = imp(first, last);
        const reasons: Reason[] = [
          [
            math(imp(last, first)).en,
            "That runs the chain backward; it gives the converse of what follows.",
            "这把链倒过来走了；得到的是结论的逆命题。",
          ],
          [
            math(imp(neg(first), neg(last))).en,
            "That is the inverse of what follows, and an inverse is not implied.",
            "这是结论的否命题，否命题不能由此推出。",
          ],
          [
            math(imp(first, neg(last))).en,
            `The chain from $${tex(first)}$ ends at $${tex(last)}$, not at its negation.`,
            `从 $${tex(first)}$ 出发的链终点是 $${tex(last)}$，而不是它的否定。`,
          ],
          [
            math(and(first, last)).en,
            "The premises are all conditionals; none of them says that any statement is actually true.",
            "前提都是条件命题；没有一个说明哪个命题真的成立。",
          ],
          [math(imp(chain[1]!, first)).en, "That runs one link backward.", "这把一环倒过来走了。"],
        ];
        const candidates = [imp(last, first), imp(neg(first), neg(last)), imp(first, neg(last)), and(first, last), imp(chain[1]!, first)];
        const wrong = candidates.filter((c) => !follows(premises, c).valid);
        const shuffled = rng.shuffle(premises);
        return reasoned(
          oneOf(
            rng,
            t(
              `From the premises ${shuffled.map((p) => `$${tex(p)}$`).join(", ")}, which statement follows?`,
              `由前提 ${shuffled.map((p) => `$${tex(p)}$`).join("、")}，可以推出哪个命题？`,
            ),
            math(right),
            wrong.map(math),
            walked(
              [
                [
                  ["Turn each premise into a forward link", "把每个前提写成向前的一环"],
                  flipped
                    ? t(
                        "A premise of the form $\\neg y \\Rightarrow \\neg x$ is the contrapositive of $x \\Rightarrow y$, so rewrite it that way.",
                        "形如 $\\neg y \\Rightarrow \\neg x$ 的前提是 $x \\Rightarrow y$ 的逆否命题，把它改写成这种形式。",
                      )
                    : t(
                        "Every premise is already a forward link; only their order is mixed.",
                        "每个前提都已经是向前的一环，只是次序打乱了。",
                      ),
                ],
                [
                  ["Put the links in a chain", "把各环排成链"],
                  t(
                    `$${chain.map(tex).join(" \\Rightarrow ")}$. By transitivity, $${tex(right)}$.`,
                    `$${chain.map(tex).join(" \\Rightarrow ")}$。由传递性得 $${tex(right)}$。`,
                  ),
                ],
              ],
              t(
                `Try a row with $${tex(first)}$ true: each link forces the next statement true in turn, ending with $${tex(last)}$ true, so $${tex(right)}$ holds. With $${tex(first)}$ false, $${tex(right)}$ holds automatically.`,
                `试 $${tex(first)}$ 为真的一行：每一环依次迫使下一个命题为真，最后 $${tex(last)}$ 为真，所以 $${tex(right)}$ 成立。若 $${tex(first)}$ 为假，$${tex(right)}$ 自然成立。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** Rule is a named rule of inference. */
interface Rule {
  readonly name: Text;
  /** form is the rule's schema with the letters P, Q and R. */
  readonly form: Text;
  readonly make: (a: Formula, b: Formula, c: Formula) => { premises: Formula[]; conclusion: Formula };
}

/** inferenceRules are the named rules of inference. */
const inferenceRules: readonly Rule[] = [
  {
    name: t("Modus ponens", "肯定前件"),
    form: t("from $P \\Rightarrow Q$ and $P$, conclude $Q$", "由 $P \\Rightarrow Q$ 与 $P$ 推出 $Q$"),
    make: (a, b) => ({ premises: [imp(a, b), a], conclusion: b }),
  },
  {
    name: t("Modus tollens", "否定后件"),
    form: t("from $P \\Rightarrow Q$ and $\\neg Q$, conclude $\\neg P$", "由 $P \\Rightarrow Q$ 与 $\\neg Q$ 推出 $\\neg P$"),
    make: (a, b) => ({ premises: [imp(a, b), neg(b)], conclusion: neg(a) }),
  },
  {
    name: t("Disjunctive syllogism", "选言推理"),
    form: t("from $P \\lor Q$ and $\\neg P$, conclude $Q$", "由 $P \\lor Q$ 与 $\\neg P$ 推出 $Q$"),
    make: (a, b) => ({ premises: [or(a, b), neg(a)], conclusion: b }),
  },
  {
    name: t("Transitivity", "传递性"),
    form: t(
      "from $P \\Rightarrow Q$ and $Q \\Rightarrow R$, conclude $P \\Rightarrow R$",
      "由 $P \\Rightarrow Q$ 与 $Q \\Rightarrow R$ 推出 $P \\Rightarrow R$",
    ),
    make: (a, b, c) => ({ premises: [imp(a, b), imp(b, c)], conclusion: imp(a, c) }),
  },
  {
    name: t("Conjunction", "合取引入"),
    form: t("from $P$ and $Q$, conclude $P \\land Q$", "由 $P$ 与 $Q$ 推出 $P \\land Q$"),
    make: (a, b) => ({ premises: [a, b], conclusion: and(a, b) }),
  },
  {
    name: t("Simplification", "化简"),
    form: t("from $P \\land Q$, conclude $P$", "由 $P \\land Q$ 推出 $P$"),
    make: (a, b) => ({ premises: [and(a, b)], conclusion: a }),
  },
  {
    name: t("Addition", "附加"),
    form: t("from $P$, conclude $P \\lor Q$", "由 $P$ 推出 $P \\lor Q$"),
    make: (a, b) => ({ premises: [a], conclusion: or(a, b) }),
  },
  {
    name: t("Resolution", "消解"),
    form: t("from $P \\lor Q$ and $\\neg P \\lor R$, conclude $Q \\lor R$", "由 $P \\lor Q$ 与 $\\neg P \\lor R$ 推出 $Q \\lor R$"),
    make: (a, b, c) => ({ premises: [or(a, b), or(neg(a), c)], conclusion: or(b, c) }),
  },
];

/** additionalRulesOfLogicalInference names and checks rules of inference. */
export const additionalRulesOfLogicalInference: TopicDef = {
  id: "additional-rules-of-logical-inference",
  title: t("Additional Rules of Logical Inference", "更多逻辑推理规则"),
  summary: t(
    "Conjunction, simplification, addition and resolution join modus ponens, modus tollens, disjunctive syllogism and transitivity as rules of inference.",
    "合取引入、化简、附加和消解，与肯定前件、否定后件、选言推理和传递性一起构成推理规则。",
  ),
  intro: t(
    "Take the premises $p \\vee q$ and $\\neg p \\vee r$. If $p$ is true, the second premise forces $r$; if $p$ is false, the first forces $q$. Either way $q \\vee r$ is true, so the argument from these premises to $q \\vee r$ is valid. This step is called **resolution**, one of several named rules that each pass from true premises only to true conclusions.\n\nCheck: try $p = T$, $q = F$, $r = T$: both premises are true and $q \\vee r$ is true, as the rule says.\n\nIn this lesson we name the rules of inference and decide by truth tables whether an argument is valid.",
    "取前提 $p \\vee q$ 与 $\\neg p \\vee r$。若 $p$ 为真，第二个前提迫使 $r$ 为真；若 $p$ 为假，第一个前提迫使 $q$ 为真。无论哪种情况 $q \\vee r$ 都为真，所以由这些前提到 $q \\vee r$ 的论证有效。这一步叫作**消解**，它是若干有名的规则之一，这些规则都只会从真的前提得到真的结论。\n\n检验：试 $p = T$，$q = F$，$r = T$：两个前提都为真，$q \\vee r$ 也为真，正如规则所说。\n\n本课我们说出推理规则的名称，并用真值表判断论证是否有效。",
  ),
  prerequisites: ["disjunctive-syllogism-and-transitivity-of-implication"],
  encompasses: [{ topic: "disjunctive-syllogism-and-transitivity-of-implication", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "naming-rules-of-inference",
      title: t("Naming the rule", "说出规则"),
      explanation: t(
        '**Conjunction:** from $p$ and $q$, conclude $p \\wedge q$. **Simplification:** from $p \\wedge q$, conclude $p$. **Addition:** from $p$, conclude $p \\vee q$ for any $q$. **Resolution:** from $p \\vee q$ and $\\neg p \\vee r$, conclude $q \\vee r$.\n\n> **Watch out.** Match the shape of the whole step, premises and conclusion together. Addition builds an "or" from one premise; simplification takes a part out of an "and"; they run in opposite directions.',
        "**合取引入：**由 $p$ 和 $q$ 推出 $p \\wedge q$。**化简：**由 $p \\wedge q$ 推出 $p$。**附加：**由 $p$ 推出 $p \\vee q$（$q$ 任意）。**消解：**由 $p \\vee q$ 与 $\\neg p \\vee r$ 推出 $q \\vee r$。\n\n> **注意。** 要对照整个步骤的形式，前提和结论一起看。附加由一个前提造出“或”；化简从“且”中取出一部分；两者方向相反。",
      ),
      generate(rng) {
        const rule = rng.pick(inferenceRules);
        const [a, b] = literalPair(rng);
        const others = ["p", "q", "r", "s"].filter((x) => !varsOf(a, b).includes(x as Var)) as Var[];
        const c = v(rng.pick(others));
        const { premises, conclusion } = rule.make(a, b, c);
        const vars = varsOf(...premises, conclusion);
        const row = rows(vars).find((env) => premises.every((p) => evaluate(p, env)))!;
        const rowTex = vars.map((x) => `${x} = ${TF(row[x])}`).join(", ");
        const uses = rule.form.en.includes("R");
        const match = `P = ${tex(a)},\\ Q = ${tex(b)}${uses ? `,\\ R = ${tex(c)}` : ""}`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Which rule of inference concludes $${tex(conclusion)}$ from ${premises.map((p) => `$${tex(p)}$`).join(" and ")}?`,
              `由 ${premises.map((p) => `$${tex(p)}$`).join(" 与 ")} 推出 $${tex(conclusion)}$ 用的是哪条推理规则？`,
            ),
            rule.name,
            rng.shuffle(inferenceRules.filter((r) => r !== rule)).map((r) => r.name),
            walked(
              [
                [["Match the letters", "对应字母"], t(`Take $${match}$.`, `取 $${match}$。`)],
                [
                  ["Name the rule", "说出规则"],
                  t(
                    `The step then reads ${rule.form.en}: this is ${rule.name.en.toLowerCase()}.`,
                    `这一步就成为${rule.form["zh-CN"]}：这是${rule.name["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `A rule never leads from true premises to a false conclusion. Try $${rowTex}$: every premise is true, and so is $${tex(conclusion)}$.`,
                `推理规则绝不会从真前提得到假结论。试 $${rowTex}$：每个前提都为真，$${tex(conclusion)}$ 也为真。`,
              ),
            ),
          ),
          inferenceRules.map(
            (r): Reason => [
              r.name.en,
              `${r.name.en} goes ${r.form.en}, and that is not the shape of this step.`,
              `${r.name["zh-CN"]}是${r.form["zh-CN"]}，这一步不是这种形式。`,
            ],
          ),
        );
      },
    },
    {
      id: "checking-validity-with-truth-tables",
      title: t("Checking validity", "检验有效性"),
      explanation: t(
        "An argument is valid exactly when $(\\text{premises}) \\Rightarrow \\text{conclusion}$ is a tautology. To show it is invalid, find one row where every premise is true and the conclusion is false.\n\n> **Watch out.** Only the rows where every premise is true matter. A row with a false premise and a false conclusion is not a counterexample.",
        "论证有效，当且仅当 $(\\text{前提}) \\Rightarrow \\text{结论}$ 是永真式。要证明论证无效，只需找到一行使所有前提为真而结论为假。\n\n> **注意。** 只有所有前提都为真的行才重要。前提有假、结论也为假的行不是反例。",
      ),
      generate(rng) {
        const wantValid = rng.bool();
        for (;;) {
          const premises = [
            randomFormula(rng, 1, ["p", "q", "r"], ["and", "or", "imp"]),
            randomFormula(rng, 1, ["p", "q", "r"], ["and", "or", "imp"]),
          ];
          const conclusion = randomFormula(rng, rng.int(0, 1), ["p", "q", "r"], ["and", "or", "imp"]);
          if (premises.some((p) => p.k === "var" || p.k === "not")) continue;
          if (tex(premises[0]!) === tex(premises[1]!)) continue;
          // The premises must be consistent, or every conclusion follows vacuously.
          if (!rows(varsOf(...premises)).some((env) => premises.every((p) => evaluate(p, env)))) continue;
          if (premises.some((p) => tex(p) === tex(conclusion))) continue;
          if (follows(premises, conclusion).valid !== wantValid) continue;
          return validityProblem(rng, premises, conclusion);
        }
      },
    },
  ],
};

/** methodsOfProofPredicateTopics are the topics of Methods of Proof modules 1.3–1.5. */
export const methodsOfProofPredicateTopics: readonly TopicDef[] = [
  truthSetsOfPredicates,
  theAndAndOrConnectivesWithPredicates,
  theNotConnectiveWithPredicates,
  simplifyingPredicateExpressionsUsingDeMorgansLaws,
  conditionalStatementsWithPredicates,
  necessaryAndSufficientConditions,
  grammaticalConstructionsForConditionalStatements,
  translatingBetweenLogicalAndSetOperations,
  universalAndExistentialQuantifiers,
  negatingQuantifiedStatements,
  nestedQuantifiers,
  formalAndInformalLanguage,
  negatingStatementsWithNestedQuantifiers,
  prenexNormalForm,
  implicationEliminationAndDenyingTheConsequent,
  disjunctiveSyllogismAndTransitivityOfImplication,
  additionalRulesOfLogicalInference,
];
