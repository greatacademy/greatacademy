import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q, svgDocument } from "@ga/subject-math";

import { numberProblem, verdictChoice } from "../problems.ts";
import {
  cayleyTex,
  cyclicGroup,
  type Fact,
  type FiniteGroup,
  factProblem,
  gcd,
  inverseOf,
  kleinGroup,
  mod,
  modInverse,
  multiplicativeOrder,
  phi,
  relabel,
  shuffled,
  signed,
  symmetricGroup3,
  texChoice,
  textChoice,
  units,
} from "./abstract-algebra-common.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 2, modules 2.2 and 2.3: binary operations and groups.

/** Linear is the operation a ∗ b = pa + qb + rab + k on the integers. */
interface Linear {
  readonly p: number;
  readonly q: number;
  readonly r: number;
  readonly k: number;
}

/** applyLinear evaluates a ∗ b. */
const applyLinear = (o: Linear, a: number, b: number) => o.p * a + o.q * b + o.r * a * b + o.k;

/** term writes c·v as a term of a sum, first or after another term. */
function term(c: number, v: string, first: boolean): string {
  if (c === 0) return "";
  const mag = Math.abs(c) === 1 ? v : `${Math.abs(c)}${v}`;
  if (first) return c < 0 ? `-${mag}` : mag;
  return c < 0 ? ` - ${mag}` : ` + ${mag}`;
}

/** linearTex writes pa + qb + rab + k. */
function linearTex(o: Linear): string {
  const parts: [number, string][] = [
    [o.p, "a"],
    [o.q, "b"],
    [o.r, "ab"],
  ];
  let s = "";
  for (const [c, v] of parts) s += term(c, v, s === "");
  if (o.k !== 0) s += s === "" ? `${o.k}` : ` ${signed(o.k)}`;
  return s === "" ? "0" : s;
}

/** introductionToBinaryOperations evaluates operations and checks closure. */
export const introductionToBinaryOperations: TopicDef = {
  id: "introduction-to-binary-operations",
  title: t("Introduction to Binary Operations", "二元运算简介"),
  summary: t(
    "A binary operation ∗ on a set S is a function S × S → S: it assigns to every ordered pair (a, b) of elements of S an element a ∗ b that again lies in S. That last requirement is called closure.",
    "集合 S 上的二元运算 ∗ 是一个函数 S × S → S：它给 S 中每个有序对 (a, b) 指定一个仍属于 S 的元素 a ∗ b。最后这个要求称为封闭性。",
  ),
  prerequisites: ["functional-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-binary-operations",
      title: t("Evaluating an operation", "计算运算结果"),
      explanation: t(
        "A binary operation is a rule that combines two elements into one, so evaluate it by substituting the two elements into its formula in order. Substitute the first element for $a$ and the second for $b$. With $a \\ast b = 2a - b + ab$, $3 \\ast (-1) = 6 + 1 - 3 = 4$, while $(-1) \\ast 3 = -2 - 3 - 3 = -8$: the order matters.",
        "二元运算是把两个元素合成一个元素的规则，所以按顺序把两个元素代入它的公式来求值。把第一个元素代入 $a$，第二个代入 $b$。若 $a \\ast b = 2a - b + ab$，则 $3 \\ast (-1) = 6 + 1 - 3 = 4$，而 $(-1) \\ast 3 = -2 - 3 - 3 = -8$：顺序很重要。",
      ),
      generate(rng) {
        const o: Linear = { p: rng.nonZero(-4, 4), q: rng.nonZero(-4, 4), r: rng.int(-2, 2), k: rng.int(-6, 6) };
        const x = rng.nonZero(-6, 6);
        const y = rng.nonZero(-6, 6);
        const value = applyLinear(o, x, y);
        return numberProblem({
          prompt: t(
            `The binary operation $\\ast$ on $\\mathbb{Z}$ is defined by $a \\ast b = ${linearTex(o)}$. Find $${x} \\ast ${y < 0 ? `(${y})` : y}$.`,
            `$\\mathbb{Z}$ 上的二元运算 $\\ast$ 定义为 $a \\ast b = ${linearTex(o)}$。求 $${x} \\ast ${y < 0 ? `(${y})` : y}$。`,
          ),
          answer: value,
          wrong: [applyLinear(o, y, x), value - 2 * o.k, o.p * x + o.q * y + o.k],
          solution: t(
            `Substitute $a = ${x}$ and $b = ${y}$: the result is $${value}$.`,
            `代入 $a = ${x}$、$b = ${y}$：结果为 $${value}$。`,
          ),
        });
      },
    },
    {
      id: "closure-of-binary-operations",
      title: t("Closure", "封闭性"),
      explanation: t(
        "To show that $\\ast$ is not a binary operation on $S$, find one pair $a, b \\in S$ with $a \\ast b \\notin S$. For example, subtraction is not a binary operation on $\\mathbb{Z}^+$, since $1 - 2 = -1$.",
        "要说明 $\\ast$ 不是 $S$ 上的二元运算，只需找到一对 $a, b \\in S$ 使 $a \\ast b \\notin S$。例如减法不是 $\\mathbb{Z}^+$ 上的二元运算，因为 $1 - 2 = -1$。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const n = rng.int(3, 9);
        const facts: Fact[] = [
          {
            prompt: t(
              `Is $a \\ast b = a + b ${signed(k)}$ a binary operation on the even integers?`,
              `$a \\ast b = a + b ${signed(k)}$ 是偶数集上的二元运算吗？`,
            ),
            holds: k % 2 === 0,
            reason:
              k % 2 === 0
                ? t(`The sum of two even integers and $${k}$ is even.`, `两个偶数与 $${k}$ 的和是偶数。`)
                : t(`$0 \\ast 0 = ${k}$ is odd.`, `$0 \\ast 0 = ${k}$ 是奇数。`),
          },
          {
            prompt: t(
              `Is $a \\ast b = ab ${signed(k)}$ a binary operation on the odd integers?`,
              `$a \\ast b = ab ${signed(k)}$ 是奇数集上的二元运算吗？`,
            ),
            holds: k % 2 === 0,
            reason:
              k % 2 === 0
                ? t(
                    `The product of two odd integers is odd, and adding the even number $${k}$ keeps it odd.`,
                    `两个奇数的积是奇数，再加偶数 $${k}$ 仍是奇数。`,
                  )
                : t(`$1 \\ast 1 = ${1 + k}$ is even.`, `$1 \\ast 1 = ${1 + k}$ 是偶数。`),
          },
          {
            prompt: t(
              `Is $a \\ast b = a + b - ${k}$ a binary operation on $\\mathbb{Z}^+$?`,
              `$a \\ast b = a + b - ${k}$ 是 $\\mathbb{Z}^+$ 上的二元运算吗？`,
            ),
            holds: k === 1,
            reason:
              k === 1
                ? t("For positive integers $a + b - 1 \\ge 1$.", "对正整数 $a + b - 1 \\ge 1$。")
                : t(`$1 \\ast 1 = ${2 - k}$ is not positive.`, `$1 \\ast 1 = ${2 - k}$ 不是正数。`),
          },
          {
            prompt: t(
              `Is $a \\ast b = ${k}a - b$ a binary operation on $\\mathbb{Z}^+$?`,
              `$a \\ast b = ${k}a - b$ 是 $\\mathbb{Z}^+$ 上的二元运算吗？`,
            ),
            holds: false,
            reason: t(`$1 \\ast ${k} = 0$ is not positive.`, `$1 \\ast ${k} = 0$ 不是正数。`),
          },
          {
            prompt: t(
              `Is $a \\ast b = a + b$ (ordinary addition) a binary operation on $\\{0, 1, \\dots, ${n - 1}\\}$?`,
              `$a \\ast b = a + b$（普通加法）是 $\\{0, 1, \\dots, ${n - 1}\\}$ 上的二元运算吗？`,
            ),
            holds: false,
            reason: t(`$${n - 1} \\ast 1 = ${n}$ is not in the set.`, `$${n - 1} \\ast 1 = ${n}$ 不在该集合中。`),
          },
          {
            prompt: t(
              `Is $a \\ast b = (a + b) \\bmod ${n}$ a binary operation on $\\{0, 1, \\dots, ${n - 1}\\}$?`,
              `$a \\ast b = (a + b) \\bmod ${n}$ 是 $\\{0, 1, \\dots, ${n - 1}\\}$ 上的二元运算吗？`,
            ),
            holds: true,
            reason: t(`A remainder on division by $${n}$ always lies in the set.`, `除以 $${n}$ 的余数总在该集合中。`),
          },
          {
            prompt: t(
              `Is $a \\ast b = ${k}ab$ a binary operation on $\\mathbb{Z}$?`,
              `$a \\ast b = ${k}ab$ 是 $\\mathbb{Z}$ 上的二元运算吗？`,
            ),
            holds: true,
            reason: t("Products of integers are integers.", "整数的积是整数。"),
          },
          {
            prompt: t(
              `Is $a \\ast b = \\frac{a + b}{${k + 1}}$ a binary operation on $\\mathbb{Z}$?`,
              `$a \\ast b = \\frac{a + b}{${k + 1}}$ 是 $\\mathbb{Z}$ 上的二元运算吗？`,
            ),
            holds: false,
            reason: t(`$0 \\ast 1 = \\frac{1}{${k + 1}}$ is not an integer.`, `$0 \\ast 1 = \\frac{1}{${k + 1}}$ 不是整数。`),
          },
          {
            prompt: t(
              `Is $a \\ast b = \\frac{a + b}{${k + 1}}$ a binary operation on $\\mathbb{Q}$?`,
              `$a \\ast b = \\frac{a + b}{${k + 1}}$ 是 $\\mathbb{Q}$ 上的二元运算吗？`,
            ),
            holds: true,
            reason: t("Sums and quotients of rational numbers by nonzero integers are rational.", "有理数之和除以非零整数仍是有理数。"),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
  ],
};

/** counterexample finds small a, b, c with (a ∗ b) ∗ c ≠ a ∗ (b ∗ c). */
function counterexample(f: (a: number, b: number) => number): [number, number, number] | undefined {
  for (const a of range(0, 3))
    for (const b of range(0, 3)) for (const c of range(0, 3)) if (f(f(a, b), c) !== f(a, f(b, c))) return [a, b, c];
  return undefined;
}

/** associativeBinaryOperations computes iterated products and decides associativity. */
export const associativeBinaryOperations: TopicDef = {
  id: "associative-binary-operations",
  title: t("Associative Binary Operations", "可结合的二元运算"),
  summary: t(
    "A binary operation ∗ is associative if (a ∗ b) ∗ c = a ∗ (b ∗ c) for all a, b and c. Then a product of several elements has the same value however it is bracketed. One triple where the two sides differ shows an operation is not associative.",
    "若对所有 a、b、c 都有 (a ∗ b) ∗ c = a ∗ (b ∗ c)，则二元运算 ∗ 是可结合的。此时多个元素的乘积无论怎样加括号，值都相同。只要找到一组使两边不等的三元组，就说明运算不可结合。",
  ),
  prerequisites: ["introduction-to-binary-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-iterated-operations",
      title: t("Bracketed products", "带括号的运算"),
      explanation: t(
        "An operation combines only two elements at a time, so a bracketed expression is evaluated from the inside out, and different bracketings may disagree. Work from the innermost brackets. With $a \\ast b = a + 2b$, $(1 \\ast 2) \\ast 3 = 5 \\ast 3 = 11$ but $1 \\ast (2 \\ast 3) = 1 \\ast 8 = 17$, so this operation is not associative.",
        "运算一次只合并两个元素，所以带括号的表达式要从里向外计算，不同的加括号方式可能给出不同结果。从最内层括号算起。若 $a \\ast b = a + 2b$，则 $(1 \\ast 2) \\ast 3 = 5 \\ast 3 = 11$，而 $1 \\ast (2 \\ast 3) = 1 \\ast 8 = 17$，所以这个运算不可结合。",
      ),
      generate(rng) {
        const o: Linear = { p: rng.nonZero(-3, 3), q: rng.nonZero(-3, 3), r: 0, k: rng.int(-5, 5) };
        const [x, y, z] = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
        const left = rng.bool();
        const f = (a: number, b: number) => applyLinear(o, a, b);
        const value = left ? f(f(x, y), z) : f(x, f(y, z));
        const other = left ? f(x, f(y, z)) : f(f(x, y), z);
        const p = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        const expr = left ? `(${x} \\ast ${p(y)}) \\ast ${p(z)}` : `${x} \\ast (${y} \\ast ${p(z)})`;
        return numberProblem({
          prompt: t(
            `The operation $\\ast$ on $\\mathbb{Z}$ is defined by $a \\ast b = ${linearTex(o)}$. Find $${expr}$.`,
            `$\\mathbb{Z}$ 上的运算 $\\ast$ 定义为 $a \\ast b = ${linearTex(o)}$。求 $${expr}$。`,
          ),
          answer: value,
          wrong: [other, f(x, y), f(y, z)],
          solution: t(
            left
              ? `First $${x} \\ast ${p(y)} = ${f(x, y)}$, then $${p(f(x, y))} \\ast ${p(z)} = ${value}$.`
              : `First $${y} \\ast ${p(z)} = ${f(y, z)}$, then $${x} \\ast ${p(f(y, z))} = ${value}$.`,
            left
              ? `先算 $${x} \\ast ${p(y)} = ${f(x, y)}$，再算 $${p(f(x, y))} \\ast ${p(z)} = ${value}$。`
              : `先算 $${y} \\ast ${p(z)} = ${f(y, z)}$，再算 $${x} \\ast ${p(f(y, z))} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "deciding-associativity",
      title: t("Deciding associativity", "判断结合性"),
      explanation: t(
        "Expand both sides. For $a \\ast b = a + b + ab$, both $(a \\ast b) \\ast c$ and $a \\ast (b \\ast c)$ equal $a + b + c + ab + bc + ca + abc$, so $\\ast$ is associative. If the expansions differ, find specific values to show it.",
        "把两边展开。对 $a \\ast b = a + b + ab$，$(a \\ast b) \\ast c$ 与 $a \\ast (b \\ast c)$ 都等于 $a + b + c + ab + bc + ca + abc$，所以 $\\ast$ 可结合。若展开式不同，就找具体数值说明。",
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const m = rng.int(2, 5);
        const ops: Linear[] = [
          { p: 1, q: 1, r: 0, k },
          { p: 1, q: 1, r: k, k: 0 },
          { p: m, q: m, r: 0, k: 0 },
          { p: 1, q: -1, r: 0, k },
          { p: 0, q: 0, r: 1, k },
          { p: 1, q: m, r: 0, k: 0 },
          { p: 0, q: 0, r: k, k: 0 },
          { p: m, q: 1, r: 0, k },
        ];
        const o = rng.pick(ops);
        const f = (a: number, b: number) => applyLinear(o, a, b);
        const bad = counterexample(f);
        return factProblem({
          prompt: t(
            `Is the operation $a \\ast b = ${linearTex(o)}$ on $\\mathbb{Z}$ associative?`,
            `$\\mathbb{Z}$ 上的运算 $a \\ast b = ${linearTex(o)}$ 可结合吗？`,
          ),
          holds: bad === undefined,
          reason:
            bad === undefined
              ? t(
                  "Expanding $(a \\ast b) \\ast c$ and $a \\ast (b \\ast c)$ gives the same expression.",
                  "把 $(a \\ast b) \\ast c$ 与 $a \\ast (b \\ast c)$ 展开得到同一个式子。",
                )
              : t(
                  `$(${bad[0]} \\ast ${bad[1]}) \\ast ${bad[2]} = ${f(f(bad[0], bad[1]), bad[2])}$ but $${bad[0]} \\ast (${bad[1]} \\ast ${bad[2]}) = ${f(bad[0], f(bad[1], bad[2]))}$.`,
                  `$(${bad[0]} \\ast ${bad[1]}) \\ast ${bad[2]} = ${f(f(bad[0], bad[1]), bad[2])}$，而 $${bad[0]} \\ast (${bad[1]} \\ast ${bad[2]}) = ${f(bad[0], f(bad[1], bad[2]))}$。`,
                ),
        });
      },
    },
  ],
};

/** LETTERS are the element names of small operation tables. */
const LETTERS = ["a", "b", "c", "d"] as const;

/** opTableTex writes the table of an operation on the first n letters. */
const opTableTex = (table: readonly (readonly number[])[]) =>
  `\\begin{array}{c|${"c".repeat(table.length)}} \\ast & ${table.map((_, j) => LETTERS[j]).join(" & ")} \\\\ \\hline ${table
    .map((row, i) => `${LETTERS[i]} & ${row.map((x) => LETTERS[x]).join(" & ")}`)
    .join(" \\\\ ")} \\end{array}`;

/** commutativeBinaryOperations decides commutativity from formulas and tables. */
export const commutativeBinaryOperations: TopicDef = {
  id: "commutative-binary-operations",
  title: t("Commutative Binary Operations", "可交换的二元运算"),
  summary: t(
    "A binary operation ∗ is commutative if a ∗ b = b ∗ a for all a and b. In an operation table this means the table is symmetric about its main diagonal.",
    "若对所有 a、b 都有 a ∗ b = b ∗ a，则二元运算 ∗ 是可交换的。在运算表中，这意味着表格关于主对角线对称。",
  ),
  prerequisites: ["introduction-to-binary-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "commutativity-of-formulas",
      title: t("Operations given by formulas", "由公式给出的运算"),
      explanation: t(
        "An operation is commutative when the order of the two elements never matters, which you check by swapping them in the formula. Swap $a$ and $b$ and compare. $a \\ast b = 3a + 3b - ab$ is commutative, since swapping gives $3b + 3a - ba$, the same. $a \\ast b = 2a + b$ is not: $1 \\ast 0 = 2$ but $0 \\ast 1 = 1$.",
        "如果两个元素的顺序从不影响结果，运算就是可交换的，检验方法是在公式中交换它们。交换 $a$ 与 $b$ 后比较。$a \\ast b = 3a + 3b - ab$ 可交换，因为交换后得 $3b + 3a - ba$，与原式相同。$a \\ast b = 2a + b$ 不可交换：$1 \\ast 0 = 2$，而 $0 \\ast 1 = 1$。",
      ),
      generate(rng) {
        const p = rng.nonZero(-4, 4);
        const q = rng.bool() ? p : rng.nonZero(-4, 4);
        const o: Linear = { p, q, r: rng.int(-3, 3), k: rng.int(-5, 5) };
        const yes = p === q;
        return factProblem({
          prompt: t(
            `Is the operation $a \\ast b = ${linearTex(o)}$ on $\\mathbb{Z}$ commutative?`,
            `$\\mathbb{Z}$ 上的运算 $a \\ast b = ${linearTex(o)}$ 可交换吗？`,
          ),
          holds: yes,
          reason: yes
            ? t("Swapping $a$ and $b$ gives the same expression.", "交换 $a$ 与 $b$ 得到同一个式子。")
            : t(
                `$1 \\ast 0 = ${applyLinear(o, 1, 0)}$ but $0 \\ast 1 = ${applyLinear(o, 0, 1)}$.`,
                `$1 \\ast 0 = ${applyLinear(o, 1, 0)}$，而 $0 \\ast 1 = ${applyLinear(o, 0, 1)}$。`,
              ),
        });
      },
    },
    {
      id: "commutativity-of-tables",
      title: t("Operations given by tables", "由表格给出的运算"),
      explanation: t(
        "Entry $(x, y)$ of the table is $x \\ast y$. Compare it with entry $(y, x)$: the operation is commutative exactly when every such pair matches, that is, when the table is symmetric about the main diagonal.",
        "表中第 $x$ 行第 $y$ 列的元素是 $x \\ast y$。把它与第 $y$ 行第 $x$ 列比较：运算可交换当且仅当每一对都相同，即表格关于主对角线对称。",
      ),
      generate(rng) {
        const n = 4;
        const table = range(0, n - 1).map(() => range(0, n - 1).map(() => rng.int(0, n - 1)));
        for (const i of range(0, n - 1)) for (const j of range(i + 1, n - 1)) if (rng.bool(0.6)) table[j]![i] = table[i]![j]!;
        const bad = range(0, n - 1).flatMap((i) =>
          range(i + 1, n - 1)
            .filter((j) => table[i]![j] !== table[j]![i])
            .map((j) => [i, j] as const),
        );
        return numberProblem({
          prompt: t(
            `An operation $\\ast$ on $\\{a, b, c, d\\}$ has the table $${opTableTex(table)}$ (row $x$, column $y$ gives $x \\ast y$). For how many pairs of distinct elements $\\{x, y\\}$ is $x \\ast y \\ne y \\ast x$?`,
            `$\\{a, b, c, d\\}$ 上的运算 $\\ast$ 的运算表为 $${opTableTex(table)}$（第 $x$ 行第 $y$ 列给出 $x \\ast y$）。有多少对不同元素 $\\{x, y\\}$ 使 $x \\ast y \\ne y \\ast x$？`,
          ),
          answer: bad.length,
          wrong: [6 - bad.length, 2 * bad.length, bad.length + 1],
          solution: t(
            bad.length === 0
              ? "The table is symmetric about its main diagonal, so there are none."
              : `Comparing the entries on either side of the main diagonal, the pairs ${bad.map(([i, j]) => `$\\{${LETTERS[i]}, ${LETTERS[j]}\\}$`).join(", ")} differ, so the answer is $${bad.length}$.`,
            bad.length === 0
              ? "表格关于主对角线对称，所以没有这样的对。"
              : `比较主对角线两侧的元素，${bad.map(([i, j]) => `$\\{${LETTERS[i]}, ${LETTERS[j]}\\}$`).join("、")} 不同，所以答案为 $${bad.length}$。`,
          ),
        });
      },
    },
  ],
};

/** Shifted is an operation with a known identity and inverses: kind "add" is a ∗ b = a + b + c on ℤ, "mul" is a ∗ b = ab / c on ℚ \ {0}. */
interface Shifted {
  readonly kind: "add" | "mul";
  readonly c: number;
}

/** shiftedTex writes the formula and set of a shifted operation. */
const shiftedTex = (s: Shifted) => (s.kind === "add" ? `a \\ast b = a + b ${signed(s.c)}` : `a \\ast b = \\frac{ab}{${s.c}}`);

/** shiftedSet writes the set a shifted operation acts on. */
const shiftedSet = (s: Shifted) => (s.kind === "add" ? "\\mathbb{Z}" : "\\mathbb{Q} \\setminus \\{0\\}");

/** shiftedIdentity is the identity of a shifted operation. */
const shiftedIdentity = (s: Shifted) => (s.kind === "add" ? -s.c : s.c);

/** randomShifted picks a shifted operation. */
const randomShifted = (rng: Rng): Shifted => (rng.bool() ? { kind: "add", c: rng.nonZero(-9, 9) } : { kind: "mul", c: rng.int(2, 9) });

/** randomGroupTable picks a small group and relabels it. */
function randomGroupTable(rng: Rng): FiniteGroup {
  const g = rng.pick([cyclicGroup(3), cyclicGroup(4), cyclicGroup(5), kleinGroup()]);
  return relabel(rng, g);
}

/** identitiesOfBinaryOperations finds identity elements. */
export const identitiesOfBinaryOperations: TopicDef = {
  id: "identities-of-binary-operations",
  title: t("Identities of Binary Operations", "二元运算的单位元"),
  summary: t(
    "An identity element for ∗ on S is an element e of S with e ∗ a = a ∗ e = a for every a in S. An operation has at most one identity. In a table, the identity's row and column repeat the column and row headings.",
    "S 上运算 ∗ 的单位元是 S 中满足对每个 a ∈ S 都有 e ∗ a = a ∗ e = a 的元素 e。一个运算至多有一个单位元。在运算表中，单位元所在的行和列分别与列标题和行标题相同。",
  ),
  prerequisites: ["commutative-binary-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "identities-from-formulas",
      title: t("Identities from formulas", "由公式求单位元"),
      explanation: t(
        "An identity element leaves every element unchanged on both sides, so solve for it from one side and confirm it works on the other. Solve $a \\ast e = a$ for $e$ and check that $e \\ast a = a$ too. For $a \\ast b = a + b - 4$ on $\\mathbb{Z}$, $a + e - 4 = a$ gives $e = 4$. For $a \\ast b = \\frac{ab}{3}$ on $\\mathbb{Q} \\setminus \\{0\\}$, $\\frac{ae}{3} = a$ gives $e = 3$.",
        "单位元从两边作用都不改变任何元素，所以从一边解出它，再确认它在另一边也成立。解 $a \\ast e = a$ 求 $e$，并检验 $e \\ast a = a$ 也成立。对 $\\mathbb{Z}$ 上的 $a \\ast b = a + b - 4$，由 $a + e - 4 = a$ 得 $e = 4$。对 $\\mathbb{Q} \\setminus \\{0\\}$ 上的 $a \\ast b = \\frac{ab}{3}$，由 $\\frac{ae}{3} = a$ 得 $e = 3$。",
      ),
      generate(rng) {
        const s = randomShifted(rng);
        const e = shiftedIdentity(s);
        return numberProblem({
          prompt: t(
            `Find the identity element of the operation $${shiftedTex(s)}$ on $${shiftedSet(s)}$.`,
            `求 $${shiftedSet(s)}$ 上运算 $${shiftedTex(s)}$ 的单位元。`,
          ),
          answer: e,
          wrong: [-e, s.kind === "add" ? 0 : 1, s.kind === "mul" ? Q.of(1, s.c) : s.c * 2],
          solution:
            s.kind === "add"
              ? t(`$a \\ast e = a + e ${signed(s.c)} = a$ gives $e = ${e}$.`, `由 $a \\ast e = a + e ${signed(s.c)} = a$ 得 $e = ${e}$。`)
              : t(`$a \\ast e = \\frac{ae}{${s.c}} = a$ gives $e = ${e}$.`, `由 $a \\ast e = \\frac{ae}{${s.c}} = a$ 得 $e = ${e}$。`),
        });
      },
    },
    {
      id: "identities-from-tables",
      title: t("Identities from tables", "由运算表求单位元"),
      explanation: t(
        "Look for the row that copies the column headings in order; its element $e$ satisfies $e \\ast x = x$ for all $x$. Check that its column also copies the row headings.",
        "找出与列标题顺序完全相同的那一行；它对应的元素 $e$ 对所有 $x$ 满足 $e \\ast x = x$。再检验它所在的列也与行标题相同。",
      ),
      generate(rng) {
        const g = randomGroupTable(rng);
        const order = rng.shuffle(range(0, g.size - 1));
        const e = g.labels[g.identity]!;
        return texChoice(
          rng,
          t(
            `An operation $\\ast$ has the table $${cayleyTex(g, order)}$. Which element is the identity?`,
            `运算 $\\ast$ 的运算表为 $${cayleyTex(g, order)}$。哪个元素是单位元？`,
          ),
          e,
          rng.shuffle(g.labels.filter((x) => x !== e)),
          t(
            `The row of $${e}$ repeats the column headings and its column repeats the row headings, so $${e}$ is the identity.`,
            `$${e}$ 所在的行与列标题相同，所在的列与行标题相同，所以 $${e}$ 是单位元。`,
          ),
        );
      },
    },
  ],
};

/** inversesUnderBinaryOperations finds inverses for operations with identities. */
export const inversesUnderBinaryOperations: TopicDef = {
  id: "inverses-under-binary-operations",
  title: t("Inverses Under Binary Operations", "二元运算下的逆元"),
  summary: t(
    "If ∗ has identity e, an inverse of a is an element a′ with a ∗ a′ = a′ ∗ a = e. Find it by solving a ∗ a′ = e. In a table, the inverse of a is the column in which the identity appears in row a.",
    "若 ∗ 有单位元 e，则 a 的逆元是满足 a ∗ a′ = a′ ∗ a = e 的元素 a′。解方程 a ∗ a′ = e 即可求得。在运算表中，a 的逆元就是 a 所在行中单位元出现的那一列。",
  ),
  prerequisites: ["identities-of-binary-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverses-from-formulas",
      title: t("Inverses from formulas", "由公式求逆元"),
      explanation: t(
        "For $a \\ast b = a + b - 4$ the identity is $4$, so the inverse of $7$ solves $7 + x - 4 = 4$: $x = 1$. For $a \\ast b = \\frac{ab}{3}$ the identity is $3$, so the inverse of $2$ solves $\\frac{2x}{3} = 3$: $x = \\frac{9}{2}$.",
        "对 $a \\ast b = a + b - 4$，单位元为 $4$，所以 $7$ 的逆元满足 $7 + x - 4 = 4$：$x = 1$。对 $a \\ast b = \\frac{ab}{3}$，单位元为 $3$，所以 $2$ 的逆元满足 $\\frac{2x}{3} = 3$：$x = \\frac{9}{2}$。",
      ),
      generate(rng) {
        const s = randomShifted(rng);
        const e = shiftedIdentity(s);
        const a = s.kind === "add" ? rng.int(-9, 9) : rng.nonZero(-9, 9);
        const inv = s.kind === "add" ? Q.of(-2 * s.c - a) : Q.of(s.c * s.c, a);
        return numberProblem({
          prompt: t(
            `Find the inverse of $${a}$ under the operation $${shiftedTex(s)}$ on $${shiftedSet(s)}$.`,
            `求 $${shiftedSet(s)}$ 上运算 $${shiftedTex(s)}$ 下 $${a}$ 的逆元。`,
          ),
          answer: inv,
          wrong: s.kind === "add" ? [-a, e - a, -a - s.c] : [Q.of(1, a), Q.of(s.c, a), Q.of(a, s.c * s.c)],
          solution:
            s.kind === "add"
              ? t(
                  `The identity is $${e}$, and $${a} + x ${signed(s.c)} = ${e}$ gives $x = ${inv.toLatex()}$.`,
                  `单位元为 $${e}$，由 $${a} + x ${signed(s.c)} = ${e}$ 得 $x = ${inv.toLatex()}$。`,
                )
              : t(
                  `The identity is $${e}$, and $\\frac{${a}x}{${s.c}} = ${e}$ gives $x = ${inv.toLatex()}$.`,
                  `单位元为 $${e}$，由 $\\frac{${a}x}{${s.c}} = ${e}$ 得 $x = ${inv.toLatex()}$。`,
                ),
        });
      },
    },
    {
      id: "inverses-from-tables",
      title: t("Inverses from tables", "由运算表求逆元"),
      explanation: t(
        "First find the identity $e$. Then in the row of $x$, find the column where $e$ appears: that column's element is $x^{-1}$.",
        "先找出单位元 $e$。再在 $x$ 所在的行中找到 $e$ 出现的那一列：该列对应的元素就是 $x^{-1}$。",
      ),
      generate(rng) {
        const g = randomGroupTable(rng);
        const order = rng.shuffle(range(0, g.size - 1));
        const x = rng.pick(range(0, g.size - 1).filter((a) => a !== g.identity));
        const inv = inverseOf(g, x);
        return texChoice(
          rng,
          t(
            `An operation $\\ast$ has the table $${cayleyTex(g, order)}$. Find the inverse of $${g.labels[x]}$.`,
            `运算 $\\ast$ 的运算表为 $${cayleyTex(g, order)}$。求 $${g.labels[x]}$ 的逆元。`,
          ),
          g.labels[inv]!,
          rng.shuffle(g.labels.filter((_, i) => i !== inv)),
          t(
            `The identity is $${g.labels[g.identity]}$, and $${g.labels[x]} \\ast ${g.labels[inv]} = ${g.labels[g.identity]}$.`,
            `单位元为 $${g.labels[g.identity]}$，且 $${g.labels[x]} \\ast ${g.labels[inv]} = ${g.labels[g.identity]}$。`,
          ),
        );
      },
    },
  ],
};

/** AXIOMS are the group axioms, in the order they are checked, followed by "it is a group". */
const AXIOMS: readonly Text[] = [
  t("Closure", "封闭性"),
  t("Associativity", "结合律"),
  t("Identity", "单位元"),
  t("Inverses", "逆元"),
  t("None: it is a group", "都满足：它是群"),
];

/** Candidate is a set with an operation and the first group axiom it fails (4 if it is a group). */
interface Candidate {
  readonly tex: string;
  readonly fails: number;
  readonly reason: Text;
}

/** introductionToGroups checks the group axioms. */
export const introductionToGroups: TopicDef = {
  id: "introduction-to-groups",
  title: t("Introduction to Groups", "群简介"),
  summary: t(
    "A group (G, ∗) is a set G with a binary operation ∗ (so G is closed under ∗) that is associative, has an identity element e, and in which every element has an inverse. Integers under addition form a group; integers under multiplication do not, since 2 has no inverse.",
    "群 (G, ∗) 是一个带有二元运算 ∗ 的集合 G（所以 G 对 ∗ 封闭），该运算满足结合律、有单位元 e，且每个元素都有逆元。整数对加法构成群；整数对乘法不构成群，因为 2 没有逆元。",
  ),
  prerequisites: ["associative-binary-operations", "inverses-under-binary-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-the-group-axioms",
      title: t("Checking the axioms", "检验群公理"),
      explanation: t(
        "Check closure, associativity, identity and inverses in that order. $(2\\mathbb{Z}, \\cdot)$ is closed and associative but has no identity, since $1 \\notin 2\\mathbb{Z}$. $(\\mathbb{Z}_{\\ge 0}, +)$ has identity $0$ but $1$ has no inverse.",
        "依次检验封闭性、结合律、单位元与逆元。$(2\\mathbb{Z}, \\cdot)$ 封闭且可结合，但没有单位元，因为 $1 \\notin 2\\mathbb{Z}$。$(\\mathbb{Z}_{\\ge 0}, +)$ 有单位元 $0$，但 $1$ 没有逆元。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const r = rng.int(1, k - 1);
        const n = rng.int(4, 15);
        const prime = range(2, n - 1).every((d) => n % d !== 0);
        const cands: Candidate[] = [
          {
            tex: `(${k}\\mathbb{Z}, +)`,
            fails: 4,
            reason: t(
              `Multiples of $${k}$ are closed under addition, $0$ is the identity, and $-x$ is the inverse of $x$.`,
              `$${k}$ 的倍数对加法封闭，$0$ 是单位元，$-x$ 是 $x$ 的逆元。`,
            ),
          },
          {
            tex: `(${k}\\mathbb{Z}, \\cdot)`,
            fails: 2,
            reason: t(
              `Multiplication is closed and associative, but the identity $1$ is not a multiple of $${k}$.`,
              `乘法封闭且可结合，但单位元 $1$ 不是 $${k}$ 的倍数。`,
            ),
          },
          {
            tex: `(${k}\\mathbb{Z}, -)`,
            fails: 1,
            reason: t(
              `$(0 - ${k}) - ${k} = ${-2 * k}$ but $0 - (${k} - ${k}) = 0$.`,
              `$(0 - ${k}) - ${k} = ${-2 * k}$，而 $0 - (${k} - ${k}) = 0$。`,
            ),
          },
          {
            tex: `(\\{x \\in \\mathbb{Z} : x \\equiv ${r} \\pmod{${k}}\\}, +)`,
            fails: 0,
            reason: t(
              `$${r} + ${r} = ${2 * r}$, which is not congruent to $${r}$ modulo $${k}$.`,
              `$${r} + ${r} = ${2 * r}$，它模 $${k}$ 不同余于 $${r}$。`,
            ),
          },
          {
            tex: `(\\{${k}x : x \\in \\mathbb{Z}, x \\ge 0\\}, +)`,
            fails: 3,
            reason: t(
              `$0$ is the identity, but $${k}$ has no inverse, since $-${k}$ is not in the set.`,
              `$0$ 是单位元，但 $${k}$ 没有逆元，因为 $-${k}$ 不在集合中。`,
            ),
          },
          {
            tex: `(\\mathbb{Z}_{${n}}, +)`,
            fails: 4,
            reason: t(
              `Addition modulo $${n}$ is closed and associative, $0$ is the identity, and $${n} - x$ is the inverse of $x \\ne 0$.`,
              `模 $${n}$ 加法封闭且可结合，$0$ 是单位元，$${n} - x$ 是 $x \\ne 0$ 的逆元。`,
            ),
          },
          {
            tex: `(\\mathbb{Z}_{${n}}, \\cdot)`,
            fails: 3,
            reason: t("$1$ is the identity, but $0$ has no inverse.", "$1$ 是单位元，但 $0$ 没有逆元。"),
          },
          {
            tex: `(\\mathbb{Z}_{${n}} \\setminus \\{0\\}, \\cdot)`,
            fails: prime ? 4 : 0,
            reason: prime
              ? t(
                  `$${n}$ is prime, so every nonzero residue has an inverse modulo $${n}$ and products of nonzero residues are nonzero.`,
                  `$${n}$ 是素数，所以每个非零剩余都有模 $${n}$ 的逆元，且非零剩余之积非零。`,
                )
              : (() => {
                  const d = range(2, n - 1).find((x) => n % x === 0)!;
                  return t(
                    `$${d} \\cdot ${n / d} = 0$ in $\\mathbb{Z}_{${n}}$, so the set is not closed.`,
                    `在 $\\mathbb{Z}_{${n}}$ 中 $${d} \\cdot ${n / d} = 0$，所以集合不封闭。`,
                  );
                })(),
          },
        ];
        const c = rng.pick(cands);
        return textChoice(
          rng,
          t(
            `Which group axiom, checked in the order closure, associativity, identity, inverses, is the first to fail for $${c.tex}$?`,
            `按封闭性、结合律、单位元、逆元的顺序检验，$${c.tex}$ 第一个不满足的群公理是哪一个？`,
          ),
          [AXIOMS[c.fails]!, ...AXIOMS.filter((_, i) => i !== c.fails)],
          c.reason,
        );
      },
    },
    {
      id: "solving-equations-in-groups",
      title: t("Solving equations", "解方程"),
      explanation: t(
        "In a group, $a \\ast x = b$ has the unique solution $x = a^{-1} \\ast b$. In $(\\mathbb{Z}, \\ast)$ with $a \\ast b = a + b - 3$, the identity is $3$, the inverse of $5$ is $1$, and $5 \\ast x = 9$ gives $x = 1 \\ast 9 = 7$.",
        "在群中，$a \\ast x = b$ 有唯一解 $x = a^{-1} \\ast b$。在 $a \\ast b = a + b - 3$ 的 $(\\mathbb{Z}, \\ast)$ 中，单位元为 $3$，$5$ 的逆元为 $1$，由 $5 \\ast x = 9$ 得 $x = 1 \\ast 9 = 7$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-9, 9);
        const a = rng.int(-9, 9);
        const b = rng.int(-9, 9);
        const x = b - a - c;
        return numberProblem({
          prompt: t(
            `$\\mathbb{Z}$ is a group under $a \\ast b = a + b ${signed(c)}$. Solve $${a} \\ast x = ${b}$.`,
            `$\\mathbb{Z}$ 在运算 $a \\ast b = a + b ${signed(c)}$ 下构成群。解方程 $${a} \\ast x = ${b}$。`,
          ),
          answer: x,
          wrong: [b - a, b - a + c, b + a - c],
          solveFor: "x",
          solution: t(`$${a} + x ${signed(c)} = ${b}$, so $x = ${x}$.`, `$${a} + x ${signed(c)} = ${b}$，所以 $x = ${x}$。`),
        });
      },
    },
  ],
};

/** realRationalAndComplexGroups decides which sets of numbers are groups and inverts complex numbers. */
export const realRationalAndComplexGroups: TopicDef = {
  id: "real-rational-and-complex-groups",
  title: t("Real, Rational, and Complex Groups", "实数、有理数与复数群"),
  summary: t(
    "$\\mathbb{Z}$, $\\mathbb{Q}$, $\\mathbb{R}$ and $\\mathbb{C}$ are groups under addition, and $\\mathbb{Q}^*$, $\\mathbb{R}^*$ and $\\mathbb{C}^*$ (the nonzero numbers) are groups under multiplication. Many subsets are groups too, such as the positive reals, the complex numbers of modulus $1$, and the $n$th roots of unity under multiplication.",
    "$\\mathbb{Z}$、$\\mathbb{Q}$、$\\mathbb{R}$ 与 $\\mathbb{C}$ 对加法构成群，$\\mathbb{Q}^*$、$\\mathbb{R}^*$ 与 $\\mathbb{C}^*$（非零数）对乘法构成群。许多子集也构成群，例如正实数、模为 $1$ 的复数以及 $n$ 次单位根对乘法构成群。",
  ),
  prerequisites: ["introduction-to-groups", "dividing-complex-numbers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "groups-of-numbers",
      title: t("Groups of numbers", "数构成的群"),
      explanation: t(
        "$\\{2^n : n \\in \\mathbb{Z}\\}$ is a group under multiplication: $2^m 2^n = 2^{m+n}$, the identity is $2^0 = 1$, and $2^{-n}$ inverts $2^n$. With $n \\ge 0$ only, $2$ would have no inverse. The negative reals are not closed under multiplication.",
        "$\\{2^n : n \\in \\mathbb{Z}\\}$ 对乘法构成群：$2^m 2^n = 2^{m+n}$，单位元为 $2^0 = 1$，$2^{-n}$ 是 $2^n$ 的逆元。若只取 $n \\ge 0$，则 $2$ 没有逆元。负实数对乘法不封闭。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const facts: Fact[] = [
          {
            prompt: t(
              `Is $\\{${k}^n : n \\in \\mathbb{Z}\\}$ a group under multiplication?`,
              `$\\{${k}^n : n \\in \\mathbb{Z}\\}$ 对乘法构成群吗？`,
            ),
            holds: true,
            reason: t(
              `$${k}^m \\cdot ${k}^n = ${k}^{m+n}$, the identity is $${k}^0 = 1$, and $${k}^{-n}$ is the inverse of $${k}^n$.`,
              `$${k}^m \\cdot ${k}^n = ${k}^{m+n}$，单位元为 $${k}^0 = 1$，$${k}^{-n}$ 是 $${k}^n$ 的逆元。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{${k}^n : n \\in \\mathbb{Z}, n \\ge 0\\}$ a group under multiplication?`,
              `$\\{${k}^n : n \\in \\mathbb{Z}, n \\ge 0\\}$ 对乘法构成群吗？`,
            ),
            holds: false,
            reason: t(
              `The inverse of $${k}$ would be $\\frac{1}{${k}}$, which is not in the set.`,
              `$${k}$ 的逆元应为 $\\frac{1}{${k}}$，它不在集合中。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{z \\in \\mathbb{C} : |z| = ${k}\\}$ a group under multiplication?`,
              `$\\{z \\in \\mathbb{C} : |z| = ${k}\\}$ 对乘法构成群吗？`,
            ),
            holds: false,
            reason: t(`$|${k} \\cdot ${k}| = ${k * k}$, so the set is not closed.`, `$|${k} \\cdot ${k}| = ${k * k}$，所以集合不封闭。`),
          },
          {
            prompt: t(
              `Is $\\{z \\in \\mathbb{C} : z^{${k}} = 1\\}$ a group under multiplication?`,
              `$\\{z \\in \\mathbb{C} : z^{${k}} = 1\\}$ 对乘法构成群吗？`,
            ),
            holds: true,
            reason: t(
              `If $z^{${k}} = w^{${k}} = 1$ then $(zw)^{${k}} = 1$ and $(z^{-1})^{${k}} = 1$, and $1$ is in the set.`,
              `若 $z^{${k}} = w^{${k}} = 1$，则 $(zw)^{${k}} = 1$ 且 $(z^{-1})^{${k}} = 1$，并且 $1$ 在集合中。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{z \\in \\mathbb{C} : z^{${k}} = 1\\}$ a group under addition?`,
              `$\\{z \\in \\mathbb{C} : z^{${k}} = 1\\}$ 对加法构成群吗？`,
            ),
            holds: false,
            reason: t(
              `$1 + 1 = 2$ and $2^{${k}} \\ne 1$, so the set is not closed.`,
              `$1 + 1 = 2$，而 $2^{${k}} \\ne 1$，所以集合不封闭。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt{${k === 4 || k === 9 ? 2 : k}} : a, b \\in \\mathbb{Q}\\}$ a group under addition?`,
              `$\\{a + b\\sqrt{${k === 4 || k === 9 ? 2 : k}} : a, b \\in \\mathbb{Q}\\}$ 对加法构成群吗？`,
            ),
            holds: true,
            reason: t(
              "Sums and negatives of such numbers have the same form, and $0 = 0 + 0\\sqrt{\\cdot}$ is the identity.",
              "这类数的和与相反数仍是同样的形式，且 $0$ 是单位元。",
            ),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{R} : x > ${k}\\}$ a group under multiplication?`,
              `$\\{x \\in \\mathbb{R} : x > ${k}\\}$ 对乘法构成群吗？`,
            ),
            holds: false,
            reason: t(`The identity $1$ is not greater than $${k}$.`, `单位元 $1$ 不大于 $${k}$。`),
          },
          {
            prompt: t(
              `Is $\\{\\frac{m}{${k}^n} : m, n \\in \\mathbb{Z}\\}$ a group under addition?`,
              `$\\{\\frac{m}{${k}^n} : m, n \\in \\mathbb{Z}\\}$ 对加法构成群吗？`,
            ),
            holds: true,
            reason: t(
              `Over a common denominator $${k}^n$, sums and negatives stay in the set, and $0$ is the identity.`,
              `通分到公分母 $${k}^n$ 后，和与相反数仍在集合中，且 $0$ 是单位元。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{\\frac{m}{${k}^n} : m, n \\in \\mathbb{Z}\\} \\setminus \\{0\\}$ a group under multiplication?`,
              `$\\{\\frac{m}{${k}^n} : m, n \\in \\mathbb{Z}\\} \\setminus \\{0\\}$ 对乘法构成群吗？`,
            ),
            holds: false,
            reason: t(
              `$${k + 1}$ is in the set but $\\frac{1}{${k + 1}}$ is not, since $${k + 1}$ shares no factor with $${k}$.`,
              `$${k + 1}$ 在集合中，但 $\\frac{1}{${k + 1}}$ 不在，因为 $${k + 1}$ 与 $${k}$ 互素。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "inverses-in-the-complex-group",
      title: t("Inverses of complex numbers", "复数的逆元"),
      explanation: t(
        "Multiplying a complex number by its conjugate gives a positive real number, so dividing the conjugate by that number gives the inverse. In $(\\mathbb{C}^*, \\cdot)$ the inverse of $z = a + bi$ is $z^{-1} = \\frac{\\bar z}{|z|^2} = \\frac{a - bi}{a^2 + b^2}$. For $z = 3 + 4i$, $z^{-1} = \\frac{3}{25} - \\frac{4}{25}i$.",
        "复数乘以它的共轭得到一个正实数，所以把共轭除以这个数就得到逆元。在 $(\\mathbb{C}^*, \\cdot)$ 中，$z = a + bi$ 的逆元为 $z^{-1} = \\frac{\\bar z}{|z|^2} = \\frac{a - bi}{a^2 + b^2}$。对 $z = 3 + 4i$，$z^{-1} = \\frac{3}{25} - \\frac{4}{25}i$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const n = a * a + b * b;
        const real = rng.bool();
        const value = real ? Q.of(a, n) : Q.of(-b, n);
        const z = `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i`;
        return numberProblem({
          prompt: t(
            `Find the ${real ? "real" : "imaginary"} part of the inverse of $z = ${z}$ in the group $(\\mathbb{C}^*, \\cdot)$.`,
            `求群 $(\\mathbb{C}^*, \\cdot)$ 中 $z = ${z}$ 的逆元的${real ? "实部" : "虚部"}。`,
          ),
          answer: value,
          wrong: [real ? Q.of(1, a) : Q.of(-1, b), real ? Q.of(-a, n) : Q.of(b, n), real ? Q.of(a, n * n) : Q.of(-b, n * n)],
          solution: t(
            `$z^{-1} = \\frac{${a} ${b < 0 ? "+" : "-"} ${Math.abs(b)}i}{${n}}$, whose ${real ? "real" : "imaginary"} part is $${value.toLatex()}$.`,
            `$z^{-1} = \\frac{${a} ${b < 0 ? "+" : "-"} ${Math.abs(b)}i}{${n}}$，其${real ? "实部" : "虚部"}为 $${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** Mat2 is a 2 × 2 integer matrix [[a, b], [c, d]]. */
export type Mat2 = readonly [number, number, number, number];

/** mul2 multiplies 2 × 2 matrices. */
export const mul2 = (x: Mat2, y: Mat2): Mat2 => [
  x[0] * y[0] + x[1] * y[2],
  x[0] * y[1] + x[1] * y[3],
  x[2] * y[0] + x[3] * y[2],
  x[2] * y[1] + x[3] * y[3],
];

/** mat2Tex writes a 2 × 2 matrix. */
export const mat2Tex = (m: Mat2) => `\\begin{pmatrix} ${m[0]} & ${m[1]} \\\\ ${m[2]} & ${m[3]} \\end{pmatrix}`;

/** ENTRY_NAMES name the entries of a 2 × 2 matrix. */
const ENTRY_NAMES: readonly Text[] = [t("top-left", "左上"), t("top-right", "右上"), t("bottom-left", "左下"), t("bottom-right", "右下")];

/** matrixGroups works in groups of invertible matrices. */
export const matrixGroups: TopicDef = {
  id: "matrix-groups",
  title: t("Matrix Groups", "矩阵群"),
  summary: t(
    "The invertible n × n matrices form the general linear group GL(n, ℝ) under matrix multiplication; the matrices of determinant 1 form the special linear group SL(n, ℝ). A set of matrices is a group under multiplication when it contains I and is closed under products and inverses.",
    "可逆的 n × n 矩阵在矩阵乘法下构成一般线性群 GL(n, ℝ)；行列式为 1 的矩阵构成特殊线性群 SL(n, ℝ)。一个矩阵集合对乘法构成群，当它含有 I 并且对乘积与逆封闭时。",
  ),
  prerequisites: ["introduction-to-groups", "inverses-of-2x2-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverses-in-sl2z",
      title: t("Inverses in $SL(2, \\mathbb{Z})$", "$SL(2, \\mathbb{Z})$ 中的逆元"),
      explanation: t(
        "If $\\det A = ad - bc = 1$, then $A^{-1} = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$, which again has integer entries and determinant $1$. So the integer matrices of determinant $1$ form a group, $SL(2, \\mathbb{Z})$.",
        "若 $\\det A = ad - bc = 1$，则 $A^{-1} = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$，它的元素仍是整数且行列式为 $1$。所以行列式为 $1$ 的整数矩阵构成群 $SL(2, \\mathbb{Z})$。",
      ),
      generate(rng) {
        let a: Mat2;
        do {
          a = mul2(mul2([1, rng.int(-3, 3), 0, 1], [1, 0, rng.int(-3, 3), 1]), [1, rng.int(-2, 2), 0, 1]);
        } while (a.every((x, i) => x === [1, 0, 0, 1][i]));
        const inv: Mat2 = [a[3], -a[1], -a[2], a[0]];
        const i = rng.int(0, 3);
        return numberProblem({
          prompt: t(
            `$A = ${mat2Tex(a)}$ lies in $SL(2, \\mathbb{Z})$. Find the ${ENTRY_NAMES[i]!.en} entry of $A^{-1}$.`,
            `$A = ${mat2Tex(a)}$ 属于 $SL(2, \\mathbb{Z})$。求 $A^{-1}$ 的${ENTRY_NAMES[i]!["zh-CN"]}元素。`,
          ),
          answer: inv[i]!,
          wrong: [a[i]!, -a[i]!, -inv[i]!, a[3 - i]!],
          solution: t(`$\\det A = 1$, so $A^{-1} = ${mat2Tex(inv)}$.`, `$\\det A = 1$，所以 $A^{-1} = ${mat2Tex(inv)}$。`),
        });
      },
    },
    {
      id: "groups-of-matrices",
      title: t("Which sets are groups", "哪些集合是群"),
      explanation: t(
        "Use $\\det(AB) = \\det A \\det B$ and $\\det(A^{-1}) = \\frac{1}{\\det A}$. The matrices of determinant $2$ are not closed: the product of two has determinant $4$. The matrices of determinant $\\pm 1$ are a group.",
        "利用 $\\det(AB) = \\det A \\det B$ 与 $\\det(A^{-1}) = \\frac{1}{\\det A}$。行列式为 $2$ 的矩阵不封闭：两个这样的矩阵之积的行列式为 $4$。行列式为 $\\pm 1$ 的矩阵构成群。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const set = (tex: string) => `\\left\\{${tex}\\right\\}`;
        const facts: Fact[] = [
          {
            prompt: t(
              `Is the set of real $2 \\times 2$ matrices with determinant $${k}$ a group under multiplication?`,
              `行列式为 $${k}$ 的实 $2 \\times 2$ 矩阵的集合对乘法构成群吗？`,
            ),
            holds: false,
            reason: t(`The product of two such matrices has determinant $${k * k}$.`, `两个这样的矩阵之积的行列式为 $${k * k}$。`),
          },
          {
            prompt: t(
              `Is the set of real $2 \\times 2$ matrices with determinant $-${k}$ or $${k}$ a group under multiplication?`,
              `行列式为 $-${k}$ 或 $${k}$ 的实 $2 \\times 2$ 矩阵的集合对乘法构成群吗？`,
            ),
            holds: false,
            reason: t(
              `The identity matrix has determinant $1$, and products have determinant $\\pm ${k * k}$.`,
              `单位矩阵的行列式为 $1$，并且乘积的行列式为 $\\pm ${k * k}$。`,
            ),
          },
          {
            prompt: t(
              `Is $${set(`\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} : a \\in ${k}\\mathbb{Z}`)}$ a group under multiplication?`,
              `$${set(`\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} : a \\in ${k}\\mathbb{Z}`)}$ 对乘法构成群吗？`,
            ),
            holds: true,
            reason: t(
              "The product of the matrices for $a$ and $b$ is the matrix for $a + b$, the identity is the matrix for $0$, and the inverse of the matrix for $a$ is the matrix for $-a$.",
              "$a$ 与 $b$ 对应的矩阵之积是 $a + b$ 对应的矩阵，单位元是 $0$ 对应的矩阵，$a$ 对应的矩阵的逆是 $-a$ 对应的矩阵。",
            ),
          },
          {
            prompt: t(
              `Is $${set(`\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} : a \\in \\mathbb{Z}, a \\ge ${k - 2}`)}$ a group under multiplication?`,
              `$${set(`\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} : a \\in \\mathbb{Z}, a \\ge ${k - 2}`)}$ 对乘法构成群吗？`,
            ),
            holds: false,
            reason:
              k === 2
                ? t(
                    "The matrix for $a = 1$ has inverse the matrix for $-1$, which is not in the set.",
                    "$a = 1$ 对应的矩阵的逆是 $-1$ 对应的矩阵，它不在集合中。",
                  )
                : t("The identity matrix (the matrix for $a = 0$) is not in the set.", "单位矩阵（$a = 0$ 对应的矩阵）不在集合中。"),
          },
          {
            prompt: t(
              `Is $${set(`\\begin{pmatrix} ${k}^n & 0 \\\\ 0 & 1 \\end{pmatrix} : n \\in \\mathbb{Z}`)}$ a group under multiplication?`,
              `$${set(`\\begin{pmatrix} ${k}^n & 0 \\\\ 0 & 1 \\end{pmatrix} : n \\in \\mathbb{Z}`)}$ 对乘法构成群吗？`,
            ),
            holds: true,
            reason: t(
              `Multiplying the matrices for $m$ and $n$ gives the matrix for $m + n$; $n = 0$ gives $I$ and $-n$ gives the inverse.`,
              `$m$ 与 $n$ 对应的矩阵相乘得到 $m + n$ 对应的矩阵；$n = 0$ 给出 $I$，$-n$ 给出逆。`,
            ),
          },
          {
            prompt: t(
              `Is $${set(`\\begin{pmatrix} a & 0 \\\\ 0 & a \\end{pmatrix} : a \\in \\mathbb{Z}, a \\ne 0`)}$ a group under multiplication?`,
              `$${set(`\\begin{pmatrix} a & 0 \\\\ 0 & a \\end{pmatrix} : a \\in \\mathbb{Z}, a \\ne 0`)}$ 对乘法构成群吗？`,
            ),
            holds: false,
            reason: t(
              `The inverse of the matrix for $a = ${k}$ has entries $\\frac{1}{${k}}$, which are not integers.`,
              `$a = ${k}$ 对应的矩阵的逆的元素为 $\\frac{1}{${k}}$，不是整数。`,
            ),
          },
          {
            prompt: t(
              `Is the set of real $${k}\\times${k}$ matrices with positive determinant a group under multiplication?`,
              `行列式为正的实 $${k}\\times${k}$ 矩阵的集合对乘法构成群吗？`,
            ),
            holds: true,
            reason: t(
              "Products and inverses of matrices with positive determinant have positive determinant, and $\\det I = 1$.",
              "行列式为正的矩阵之积与逆的行列式仍为正，且 $\\det I = 1$。",
            ),
          },
          {
            prompt: t(
              `Is the set of real $${k}\\times${k}$ matrices with negative determinant a group under multiplication?`,
              `行列式为负的实 $${k}\\times${k}$ 矩阵的集合对乘法构成群吗？`,
            ),
            holds: false,
            reason: t("The product of two such matrices has positive determinant.", "两个这样的矩阵之积的行列式为正。"),
          },
          {
            prompt: t(
              `Is the set of all real $${k}\\times${k}$ matrices a group under multiplication?`,
              `所有实 $${k}\\times${k}$ 矩阵的集合对乘法构成群吗？`,
            ),
            holds: false,
            reason: t("The zero matrix has no inverse.", "零矩阵没有逆。"),
          },
          {
            prompt: t(
              `Is the set of all real $${k}\\times${k}$ matrices a group under addition?`,
              `所有实 $${k}\\times${k}$ 矩阵的集合对加法构成群吗？`,
            ),
            holds: true,
            reason: t(
              "Matrix addition is closed and associative, the zero matrix is the identity, and $-A$ inverts $A$.",
              "矩阵加法封闭且可结合，零矩阵是单位元，$-A$ 是 $A$ 的逆元。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
  ],
};

/** Mobius is the function (ax + b) / (cx + d), with its formula. */
export interface Mobius {
  readonly m: Mat2;
  readonly tex: string;
}

/** ANHARMONIC are the six functions that permute 0, 1 and ∞, a group under composition. */
export const ANHARMONIC: readonly Mobius[] = [
  { m: [1, 0, 0, 1], tex: "x" },
  { m: [0, 1, 1, 0], tex: "\\frac{1}{x}" },
  { m: [-1, 1, 0, 1], tex: "1 - x" },
  { m: [0, 1, -1, 1], tex: "\\frac{1}{1 - x}" },
  { m: [1, -1, 1, 0], tex: "\\frac{x - 1}{x}" },
  { m: [1, 0, 1, -1], tex: "\\frac{x}{x - 1}" },
];

/** sameMobius reports whether two matrices give the same function, that is, are proportional. */
export const sameMobius = (x: Mat2, y: Mat2) =>
  x[0] * y[1] === x[1] * y[0] &&
  x[0] * y[2] === x[2] * y[0] &&
  x[0] * y[3] === x[3] * y[0] &&
  x[1] * y[2] === x[2] * y[1] &&
  x[1] * y[3] === x[3] * y[1] &&
  x[2] * y[3] === x[3] * y[2];

/** affineTex writes ax + b. */
const affineTex = (a: number, b: number) => `${a === 1 ? "" : a === -1 ? "-" : a}x ${b === 0 ? "" : signed(b)}`.trim();

/** functionGroups composes functions in groups of functions. */
export const functionGroups: TopicDef = {
  id: "function-groups",
  title: t("Function Groups", "函数群"),
  summary: t(
    "Bijections can be composed and inverted, and composition is associative, so a set of bijections of a set to itself that contains the identity function and is closed under composition and inverses is a group under composition. Examples are the maps x ↦ ax + b with a ≠ 0, and the six functions x, 1/x, 1 − x, 1/(1 − x), (x − 1)/x and x/(x − 1).",
    "双射可以复合和求逆，且复合满足结合律，所以一组从某集合到自身的双射，若含有恒等函数并对复合与求逆封闭，就在复合下构成群。例如 a ≠ 0 时的映射 x ↦ ax + b，以及六个函数 x、1/x、1 − x、1/(1 − x)、(x − 1)/x 与 x/(x − 1)。",
  ),
  prerequisites: ["introduction-to-groups", "function-composition", "bijections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "composing-in-a-group-of-functions",
      title: t("Composing functions", "复合函数"),
      explanation: t(
        "In a group of functions the operation is composition, so the product of two elements is one function applied to the output of the other. Substitute the inner function into the outer one and simplify. If $f(x) = \\frac{1}{x}$ and $g(x) = 1 - x$, then $(f \\circ g)(x) = \\frac{1}{1 - x}$ and $(g \\circ f)(x) = 1 - \\frac{1}{x} = \\frac{x - 1}{x}$.",
        "在函数群中运算是复合，所以两个元素的乘积就是把一个函数作用在另一个函数的输出上。把内层函数代入外层函数并化简。若 $f(x) = \\frac{1}{x}$、$g(x) = 1 - x$，则 $(f \\circ g)(x) = \\frac{1}{1 - x}$，$(g \\circ f)(x) = 1 - \\frac{1}{x} = \\frac{x - 1}{x}$。",
      ),
      generate(rng) {
        const f = rng.pick(ANHARMONIC);
        const g = rng.pick(ANHARMONIC);
        const fg = mul2(f.m, g.m);
        const right = ANHARMONIC.find((h) => sameMobius(h.m, fg))!;
        const gf = ANHARMONIC.find((h) => sameMobius(h.m, mul2(g.m, f.m)))!;
        return texChoice(
          rng,
          t(
            `The six functions $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ form a group under composition. If $f(x) = ${f.tex}$ and $g(x) = ${g.tex}$, what is $(f \\circ g)(x)$?`,
            `六个函数 $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ 在复合下构成群。若 $f(x) = ${f.tex}$、$g(x) = ${g.tex}$，则 $(f \\circ g)(x)$ 是什么？`,
          ),
          right.tex,
          [gf.tex, ...rng.shuffle(ANHARMONIC.map((h) => h.tex))],
          t(
            `$(f \\circ g)(x) = f(g(x))$; substituting $g(x) = ${g.tex}$ into $f$ and simplifying gives $${right.tex}$.`,
            `$(f \\circ g)(x) = f(g(x))$；把 $g(x) = ${g.tex}$ 代入 $f$ 并化简得 $${right.tex}$。`,
          ),
        );
      },
    },
    {
      id: "inverses-in-the-affine-group",
      title: t("Inverses of affine maps", "仿射映射的逆"),
      explanation: t(
        "The inverse of an affine map undoes it by first removing the shift and then dividing by the scale, and it is again an affine map. In the group of maps $x \\mapsto ax + b$, the inverse of $f(x) = ax + b$ is $f^{-1}(x) = \\frac{x - b}{a}$, and $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$. For $f(x) = 2x + 1$ and $g(x) = x - 3$, $(f \\circ g)^{-1}(5) = g^{-1}(f^{-1}(5)) = g^{-1}(2) = 5$.",
        "仿射映射的逆先去掉平移再除以缩放比，从而撤销原映射，它仍然是一个仿射映射。在映射 $x \\mapsto ax + b$ 构成的群中，$f(x) = ax + b$ 的逆为 $f^{-1}(x) = \\frac{x - b}{a}$，且 $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$。若 $f(x) = 2x + 1$、$g(x) = x - 3$，则 $(f \\circ g)^{-1}(5) = g^{-1}(f^{-1}(5)) = g^{-1}(2) = 5$。",
      ),
      generate(rng) {
        const [a, b, c, d] = [rng.nonZero(-4, 4), rng.int(-6, 6), rng.nonZero(-4, 4), rng.int(-6, 6)];
        const k = rng.int(-9, 9);
        const finv = Q.of(k - b, a);
        const value = finv.sub(Q.of(d)).div(Q.of(c));
        const wrongOrder = Q.of(k - d, c)
          .sub(Q.of(b))
          .div(Q.of(a));
        return numberProblem({
          prompt: t(
            `In the group of functions $x \\mapsto ax + b$ ($a \\ne 0$) under composition, let $f(x) = ${affineTex(a, b)}$ and $g(x) = ${affineTex(c, d)}$. Find $(f \\circ g)^{-1}(${k})$.`,
            `在复合运算下的函数群 $x \\mapsto ax + b$（$a \\ne 0$）中，设 $f(x) = ${affineTex(a, b)}$、$g(x) = ${affineTex(c, d)}$。求 $(f \\circ g)^{-1}(${k})$。`,
          ),
          answer: value,
          wrong: [wrongOrder, Q.of(a * (c * k + d) + b), finv],
          solution: t(
            `$(f \\circ g)^{-1}(${k}) = g^{-1}(f^{-1}(${k}))$. First $f^{-1}(${k}) = \\frac{${k} ${signed(-b)}}{${a}} = ${finv.toLatex()}$, then $g^{-1}$ of that is $${value.toLatex()}$.`,
            `$(f \\circ g)^{-1}(${k}) = g^{-1}(f^{-1}(${k}))$。先算 $f^{-1}(${k}) = \\frac{${k} ${signed(-b)}}{${a}} = ${finv.toLatex()}$，再用 $g^{-1}$ 得 $${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** generalGroups works in groups defined by unusual operations. */
export const generalGroups: TopicDef = {
  id: "general-groups",
  title: t("General Groups", "一般的群"),
  summary: t(
    "Any set with an operation satisfying the axioms is a group, however unfamiliar the operation. In a group, xⁿ means x ∗ x ∗ ⋯ ∗ x (n factors), x⁰ = e, and x⁻ⁿ = (x⁻¹)ⁿ.",
    "任何带有满足公理的运算的集合都是群，无论运算多么陌生。在群中，xⁿ 表示 x ∗ x ∗ ⋯ ∗ x（n 个因子），x⁰ = e，x⁻ⁿ = (x⁻¹)ⁿ。",
  ),
  prerequisites: ["real-rational-and-complex-groups", "matrix-groups", "function-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "powers-in-general-groups",
      title: t("Powers of elements", "元素的幂"),
      explanation: t(
        "A power means combining an element with itself repeatedly using the group's own operation, which may not be ordinary multiplication. In $(\\mathbb{Z}, \\ast)$ with $a \\ast b = a + b + 2$, $x^2 = 2x + 2$, $x^3 = x^2 \\ast x = 3x + 4$ and in general $x^n = nx + 2(n - 1)$. So $5^4 = 20 + 6 = 26$.",
        "幂的意思是用群自身的运算把一个元素反复与自己结合，这个运算不一定是普通乘法。在 $a \\ast b = a + b + 2$ 的 $(\\mathbb{Z}, \\ast)$ 中，$x^2 = 2x + 2$，$x^3 = x^2 \\ast x = 3x + 4$，一般地 $x^n = nx + 2(n - 1)$。所以 $5^4 = 20 + 6 = 26$。",
      ),
      generate(rng) {
        const c = rng.nonZero(-5, 5);
        const x = rng.int(-6, 6);
        const n = rng.int(2, 6);
        const value = n * x + (n - 1) * c;
        return numberProblem({
          prompt: t(
            `$\\mathbb{Z}$ is a group under $a \\ast b = a + b ${signed(c)}$. Find $${x < 0 ? `(${x})` : x}^{${n}}$ in this group.`,
            `$\\mathbb{Z}$ 在 $a \\ast b = a + b ${signed(c)}$ 下构成群。求该群中的 $${x < 0 ? `(${x})` : x}^{${n}}$。`,
          ),
          answer: value,
          wrong: [x ** n, n * x + n * c, n * x],
          solution: t(
            `Each of the $${n - 1}$ operations adds $${c}$, so $${x < 0 ? `(${x})` : x}^{${n}} = ${n} \\cdot ${x < 0 ? `(${x})` : x} + ${n - 1} \\cdot ${c < 0 ? `(${c})` : c} = ${value}$.`,
            `$${n - 1}$ 次运算每次加 $${c}$，所以 $${x < 0 ? `(${x})` : x}^{${n}} = ${n} \\cdot ${x < 0 ? `(${x})` : x} + ${n - 1} \\cdot ${c < 0 ? `(${c})` : c} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "inverses-in-general-groups",
      title: t("Inverses", "逆元"),
      explanation: t(
        "The inverse of an element is what combines with it to give the identity, so set up that equation using the operation and solve it. $\\mathbb{R} \\setminus \\{-1\\}$ is a group under $a \\ast b = a + b + ab$ with identity $0$. The inverse of $a$ solves $a + x + ax = 0$, so $x = -\\frac{a}{1 + a}$; for $a = 3$ it is $-\\frac{3}{4}$.",
        "一个元素的逆元是与它结合得到单位元的那个元素，所以用这个运算列出方程并求解。$\\mathbb{R} \\setminus \\{-1\\}$ 在 $a \\ast b = a + b + ab$ 下构成群，单位元为 $0$。$a$ 的逆元满足 $a + x + ax = 0$，所以 $x = -\\frac{a}{1 + a}$；$a = 3$ 时为 $-\\frac{3}{4}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        let a: number;
        do a = rng.nonZero(-9, 9);
        while (1 + k * a === 0);
        const value = Q.of(-a, 1 + k * a);
        const excluded = Q.of(-1, k).toLatex();
        return numberProblem({
          prompt: t(
            `$\\mathbb{R} \\setminus \\{${excluded}\\}$ is a group under $a \\ast b = a + b + ${k === 1 ? "" : k}ab$. Find the inverse of $${a}$.`,
            `$\\mathbb{R} \\setminus \\{${excluded}\\}$ 在 $a \\ast b = a + b + ${k === 1 ? "" : k}ab$ 下构成群。求 $${a}$ 的逆元。`,
          ),
          answer: value,
          wrong: [Q.of(-a), Q.of(1, a), Q.of(a, 1 + k * a)],
          solution: t(
            `The identity is $0$. Solve $${a} + x ${signed(k * a)}x = 0$: $x = ${value.toLatex()}$.`,
            `单位元为 $0$。解 $${a} + x ${signed(k * a)}x = 0$：$x = ${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** MATRIX_GROUP_ORDERS are matrix groups over ℤₚ with the formulas for their orders. */
const MATRIX_GROUP_ORDERS: readonly { en: string; zh: string; order: (p: number) => number; formula: string; why: Text }[] = [
  {
    en: "$GL(2, \\mathbb{Z}_{p})$, the group of invertible $2 \\times 2$ matrices over $\\mathbb{Z}_{p}$",
    zh: "$GL(2, \\mathbb{Z}_{p})$（$\\mathbb{Z}_{p}$ 上可逆的 $2 \\times 2$ 矩阵构成的群）",
    order: (p) => (p * p - 1) * (p * p - p),
    formula: "(p^2 - 1)(p^2 - p)",
    why: t(
      "The first column is any of the $p^2 - 1$ nonzero vectors, and the second any of the $p^2 - p$ vectors outside the line of the first",
      "第一列可以是 $p^2 - 1$ 个非零向量中的任一个，第二列可以是第一列所在直线之外的 $p^2 - p$ 个向量中的任一个",
    ),
  },
  {
    en: "$SL(2, \\mathbb{Z}_{p})$, the group of $2 \\times 2$ matrices of determinant $1$ over $\\mathbb{Z}_{p}$",
    zh: "$SL(2, \\mathbb{Z}_{p})$（$\\mathbb{Z}_{p}$ 上行列式为 $1$ 的 $2 \\times 2$ 矩阵构成的群）",
    order: (p) => p * (p * p - 1),
    formula: "p(p^2 - 1)",
    why: t(
      "The determinant takes each of the $p - 1$ nonzero values equally often on $GL(2, \\mathbb{Z}_p)$, so the order of that group is divided by $p - 1$",
      "在 $GL(2, \\mathbb{Z}_p)$ 上，行列式取 $p - 1$ 个非零值中每个值的次数相同，所以把该群的阶除以 $p - 1$",
    ),
  },
  {
    en: "the group of invertible upper triangular $2 \\times 2$ matrices over $\\mathbb{Z}_{p}$",
    zh: "$\\mathbb{Z}_{p}$ 上可逆的 $2 \\times 2$ 上三角矩阵构成的群",
    order: (p) => (p - 1) * (p - 1) * p,
    formula: "(p - 1)^2 p",
    why: t(
      "Each of the two diagonal entries is one of the $p - 1$ nonzero values, and the entry above the diagonal is any of the $p$ values",
      "两个对角元各取 $p - 1$ 个非零值之一，对角线上方的元素可取 $p$ 个值中的任一个",
    ),
  },
  {
    en: "the group of invertible diagonal $2 \\times 2$ matrices over $\\mathbb{Z}_{p}$",
    zh: "$\\mathbb{Z}_{p}$ 上可逆的 $2 \\times 2$ 对角矩阵构成的群",
    order: (p) => (p - 1) * (p - 1),
    formula: "(p - 1)^2",
    why: t("Each of the two diagonal entries is one of the $p - 1$ nonzero values", "两个对角元各取 $p - 1$ 个非零值之一"),
  },
  {
    en: "the group of invertible diagonal $3 \\times 3$ matrices over $\\mathbb{Z}_{p}$",
    zh: "$\\mathbb{Z}_{p}$ 上可逆的 $3 \\times 3$ 对角矩阵构成的群",
    order: (p) => (p - 1) ** 3,
    formula: "(p - 1)^3",
    why: t("Each of the three diagonal entries is one of the $p - 1$ nonzero values", "三个对角元各取 $p - 1$ 个非零值之一"),
  },
];

/** theOrderOfAGroup counts the elements of finite groups. */
export const theOrderOfAGroup: TopicDef = {
  id: "the-order-of-a-group",
  title: t("The Order of a Group", "群的阶"),
  summary: t(
    "The order |G| of a group is its number of elements. For example |ℤₙ| = n, the group U(n) of units modulo n has order φ(n), and GL(2, ℤₚ) has order (p² − 1)(p² − p): the first column can be any nonzero vector and the second any vector not a multiple of the first.",
    "群的阶 |G| 是它的元素个数。例如 |ℤₙ| = n，模 n 单位群 U(n) 的阶为 φ(n)，GL(2, ℤₚ) 的阶为 (p² − 1)(p² − p)：第一列可以是任意非零向量，第二列可以是不为第一列倍数的任意向量。",
  ),
  prerequisites: ["introduction-to-groups", "eulers-totient-function"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-order-of-the-group-of-units",
      title: t("The group of units", "单位群"),
      explanation: t(
        "The elements with multiplicative inverses modulo a number are exactly those coprime to it, so there are as many as Euler's totient counts. $U(n) = \\{a \\in \\mathbb{Z}_n : \\gcd(a, n) = 1\\}$ is a group under multiplication modulo $n$, of order $\\varphi(n)$. For $n = 12$, $U(12) = \\{1, 5, 7, 11\\}$ has order $\\varphi(12) = 4$.",
        "模某个数有乘法逆元的元素恰好是与它互素的数，所以个数等于欧拉函数的值。$U(n) = \\{a \\in \\mathbb{Z}_n : \\gcd(a, n) = 1\\}$ 在模 $n$ 乘法下构成群，阶为 $\\varphi(n)$。$n = 12$ 时，$U(12) = \\{1, 5, 7, 11\\}$ 的阶为 $\\varphi(12) = 4$。",
      ),
      generate(rng) {
        const n = rng.int(6, 60);
        const value = phi(n);
        return numberProblem({
          prompt: t(
            `Find the order of $U(${n})$, the group of units of $\\mathbb{Z}_{${n}}$ under multiplication.`,
            `求 $U(${n})$（$\\mathbb{Z}_{${n}}$ 的单位在乘法下构成的群）的阶。`,
          ),
          answer: value,
          wrong: [n - 1, n, value + 1, Math.floor(n / 2)],
          solution: t(`$|U(${n})| = \\varphi(${n}) = ${value}$.`, `$|U(${n})| = \\varphi(${n}) = ${value}$。`),
        });
      },
    },
    {
      id: "orders-of-matrix-groups",
      title: t("Matrix groups over finite fields", "有限域上的矩阵群"),
      explanation: t(
        "Count matrices entry by entry. An invertible diagonal $2 \\times 2$ matrix over $\\mathbb{Z}_5$ has two nonzero diagonal entries: $4^2 = 16$ choices. For $GL(2, \\mathbb{Z}_p)$, the first column is any of $p^2 - 1$ nonzero vectors and the second any of the $p^2 - p$ vectors not a multiple of it.",
        "逐个元素计数。$\\mathbb{Z}_5$ 上可逆的 $2 \\times 2$ 对角矩阵有两个非零对角元：$4^2 = 16$ 种。对 $GL(2, \\mathbb{Z}_p)$，第一列可以是 $p^2 - 1$ 个非零向量中的任一个，第二列可以是 $p^2 - p$ 个不为它的倍数的向量中的任一个。",
      ),
      generate(rng) {
        const g = rng.pick(MATRIX_GROUP_ORDERS);
        const p = rng.pick([2, 3, 5, 7, 11, 13]);
        const value = g.order(p);
        const sub = (s: string) => s.replace(/\{p\}/g, `{${p}}`);
        return numberProblem({
          prompt: t(`Find the order of ${sub(g.en)}.`, `求${sub(g.zh)}的阶。`),
          answer: value,
          wrong: MATRIX_GROUP_ORDERS.map((h) => h.order(p)).concat([p ** 4]),
          solution: t(
            `${g.why.en}. So the order is $${g.formula}$, which for $p = ${p}$ is $${value}$.`,
            `${g.why["zh-CN"]}。所以阶为 $${g.formula}$，当 $p = ${p}$ 时为 $${value}$。`,
          ),
        });
      },
    },
  ],
};

/** ordersOfGroupElements finds orders of elements of ℤₙ and U(n). */
export const ordersOfGroupElements: TopicDef = {
  id: "orders-of-group-elements",
  title: t("Orders of Group Elements", "群元素的阶"),
  summary: t(
    "The order of an element a is the least positive n with aⁿ = e (in additive notation, na = 0); if there is none, a has infinite order. In ℤₙ the order of a is n / gcd(a, n).",
    "元素 a 的阶是使 aⁿ = e（加法记号下为 na = 0）的最小正整数 n；若不存在，则 a 的阶为无穷。在 ℤₙ 中，a 的阶为 n / gcd(a, n)。",
  ),
  prerequisites: ["the-order-of-a-group"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-in-additive-groups",
      title: t("Orders in $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 中的阶"),
      explanation: t(
        "In $\\mathbb{Z}_{12}$, the multiples of $8$ are $8, 4, 0$, so $8$ has order $3$. In general the order of $a$ in $\\mathbb{Z}_n$ is $\\frac{n}{\\gcd(a, n)}$, here $\\frac{12}{4} = 3$.",
        "在 $\\mathbb{Z}_{12}$ 中，$8$ 的倍数依次为 $8, 4, 0$，所以 $8$ 的阶为 $3$。一般地，$a$ 在 $\\mathbb{Z}_n$ 中的阶为 $\\frac{n}{\\gcd(a, n)}$，这里为 $\\frac{12}{4} = 3$。",
      ),
      generate(rng) {
        const n = rng.int(6, 40);
        const a = rng.int(1, n - 1);
        const value = n / gcd(a, n);
        return numberProblem({
          prompt: t(
            `Find the order of $${a}$ in the group $\\mathbb{Z}_{${n}}$ under addition.`,
            `求 $${a}$ 在加法群 $\\mathbb{Z}_{${n}}$ 中的阶。`,
          ),
          answer: value,
          wrong: [gcd(a, n), n, n - a, a],
          solution: t(
            `$\\gcd(${a}, ${n}) = ${gcd(a, n)}$, so the order is $\\frac{${n}}{${gcd(a, n)}} = ${value}$.`,
            `$\\gcd(${a}, ${n}) = ${gcd(a, n)}$，所以阶为 $\\frac{${n}}{${gcd(a, n)}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "orders-in-groups-of-units",
      title: t("Orders in U(n)", "U(n) 中的阶"),
      explanation: t(
        "The order of an element is the smallest positive power that gives the identity, so compute powers until you reach one. Compute successive powers until you reach $1$. In $U(10)$, $3^1 = 3$, $3^2 = 9$, $3^3 = 27 \\equiv 7$, $3^4 \\equiv 21 \\equiv 1$, so $3$ has order $4$.",
        "元素的阶是使它等于单位元的最小正幂，所以逐个计算幂，直到得到 1。依次计算幂直到得到 $1$。在 $U(10)$ 中，$3^1 = 3$，$3^2 = 9$，$3^3 = 27 \\equiv 7$，$3^4 \\equiv 21 \\equiv 1$，所以 $3$ 的阶为 $4$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 30);
          a = rng.pick(units(n));
        } while (a === 1);
        const value = multiplicativeOrder(a, n);
        const powers = range(1, value).map((k) => {
          let x = 1;
          for (let i = 0; i < k; i++) x = mod(x * a, n);
          return x;
        });
        return numberProblem({
          prompt: t(
            `Find the order of $${a}$ in $U(${n})$, the group of units modulo $${n}$ under multiplication.`,
            `求 $${a}$ 在 $U(${n})$（模 $${n}$ 单位在乘法下构成的群）中的阶。`,
          ),
          answer: value,
          wrong: [phi(n), value + 1, n / gcd(a, n), value * 2],
          solution: t(
            `The powers of $${a}$ modulo $${n}$ are $${powers.join(", ")}$, so the order is $${value}$.`,
            `$${a}$ 模 $${n}$ 的幂依次为 $${powers.join(", ")}$，所以阶为 $${value}$。`,
          ),
        });
      },
    },
  ],
};

/** computingInversesOfElementsInZn inverts elements of U(n) and solves equations there. */
export const computingInversesOfElementsInZn: TopicDef = {
  id: "computing-inverses-of-elements-in-zn",
  title: t("Computing Inverses of Elements in Zn", "计算 Zn 中元素的逆"),
  summary: t(
    "An element a of ℤₙ has a multiplicative inverse exactly when gcd(a, n) = 1. The inverse can be found by the extended Euclidean algorithm, or for small n by trial; then ax = b is solved by x = a⁻¹b.",
    "ℤₙ 中的元素 a 有乘法逆元当且仅当 gcd(a, n) = 1。逆元可用扩展欧几里得算法求得，n 较小时也可试算；于是 ax = b 的解为 x = a⁻¹b。",
  ),
  prerequisites: ["orders-of-group-elements", "multiplicative-inverses-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inverses-in-groups-of-units",
      title: t("Inverses in U(n)", "U(n) 中的逆元"),
      explanation: t(
        "The extended Euclidean algorithm writes one as a combination of the element and the modulus, and the coefficient of the element is its inverse. In $U(26)$, the extended Euclidean algorithm gives $26 = 3 \\cdot 7 + 5$, $7 = 5 + 2$, $5 = 2 \\cdot 2 + 1$, and back-substituting $1 = 3 \\cdot 26 - 11 \\cdot 7$. So $7^{-1} = -11 = 15$.",
        "扩展欧几里得算法把 1 写成该元素与模的组合，其中该元素的系数就是它的逆元。在 $U(26)$ 中，扩展欧几里得算法给出 $26 = 3 \\cdot 7 + 5$，$7 = 5 + 2$，$5 = 2 \\cdot 2 + 1$，回代得 $1 = 3 \\cdot 26 - 11 \\cdot 7$。所以 $7^{-1} = -11 = 15$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 60);
          a = rng.pick(units(n));
        } while (a === 1 || a === n - 1);
        const inv = modInverse(a, n);
        return numberProblem({
          prompt: t(
            `Find the inverse of $${a}$ in $U(${n})$. Give an answer between $0$ and $${n - 1}$.`,
            `求 $${a}$ 在 $U(${n})$ 中的逆元。答案取 $0$ 到 $${n - 1}$ 之间的数。`,
          ),
          answer: inv,
          wrong: [n - a, n - inv, mod(a * a, n)],
          solution: t(
            `$${a} \\cdot ${inv} = ${a * inv} = ${Math.floor((a * inv) / n)} \\cdot ${n} + 1$, so $${a}^{-1} = ${inv}$.`,
            `$${a} \\cdot ${inv} = ${a * inv} = ${Math.floor((a * inv) / n)} \\cdot ${n} + 1$，所以 $${a}^{-1} = ${inv}$。`,
          ),
        });
      },
    },
    {
      id: "solving-equations-in-groups-of-units",
      title: t("Solving ax = b", "解 ax = b"),
      explanation: t(
        "In any group an equation of this form has exactly one solution, found by multiplying both sides by the inverse of the coefficient. Multiply both sides by $a^{-1}$. In $U(11)$, $3x = 7$: $3^{-1} = 4$, so $x = 4 \\cdot 7 = 28 \\equiv 6$. Check: $3 \\cdot 6 = 18 \\equiv 7$.",
        "在任何群中，这种形式的方程恰好有一个解，把两边乘以系数的逆元就能求出。两边同乘 $a^{-1}$。在 $U(11)$ 中解 $3x = 7$：$3^{-1} = 4$，所以 $x = 4 \\cdot 7 = 28 \\equiv 6$。验算：$3 \\cdot 6 = 18 \\equiv 7$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 40);
          a = rng.pick(units(n));
        } while (a === 1);
        const b = rng.pick(units(n).filter((v) => v !== a));
        const inv = modInverse(a, n);
        const x = mod(inv * b, n);
        return numberProblem({
          prompt: t(
            `Solve $${a}x = ${b}$ in $U(${n})$. Give an answer between $0$ and $${n - 1}$.`,
            `在 $U(${n})$ 中解 $${a}x = ${b}$。答案取 $0$ 到 $${n - 1}$ 之间的数。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [mod(a * b, n), inv, mod(b - a, n)],
          solution: t(
            `$${a}^{-1} = ${inv}$ in $U(${n})$, so $x = ${inv} \\cdot ${b} = ${inv * b} \\equiv ${x}$.`,
            `在 $U(${n})$ 中 $${a}^{-1} = ${inv}$，所以 $x = ${inv} \\cdot ${b} = ${inv * b} \\equiv ${x}$。`,
          ),
        });
      },
    },
  ],
};

/** randomSmallGroup picks a relabeled group of order 3 to 6, including S₃. */
const randomSmallGroup = (rng: Rng) =>
  relabel(rng, rng.pick([cyclicGroup(3), cyclicGroup(4), cyclicGroup(5), cyclicGroup(6), kleinGroup(), symmetricGroup3()]));

/** cayleyTables reads and completes Cayley tables. */
export const cayleyTables: TopicDef = {
  id: "cayley-tables",
  title: t("Cayley Tables", "凯莱表"),
  summary: t(
    "The Cayley table of a finite group lists every product a ∗ b, with a labeling the row and b the column. Because ax = b and ya = b have unique solutions, every element appears exactly once in each row and each column: the table is a Latin square.",
    "有限群的凯莱表列出所有乘积 a ∗ b，其中 a 标记行，b 标记列。由于 ax = b 与 ya = b 都有唯一解，每个元素在每一行、每一列中恰好出现一次：凯莱表是一个拉丁方。",
  ),
  prerequisites: ["introduction-to-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "completing-cayley-tables",
      title: t("Completing a table", "补全凯莱表"),
      explanation: t(
        "Each element occurs exactly once in every row and column of a group's Cayley table. So a missing entry is the one element that does not yet appear in its row (or in its column).",
        "群的凯莱表中每个元素在每一行、每一列恰好出现一次。所以缺失的元素就是它所在行（或列）中尚未出现的那个元素。",
      ),
      generate(rng) {
        const g = randomSmallGroup(rng);
        const order = shuffled(rng, g);
        const a = rng.pick(order.slice(1));
        const b = rng.pick(order.slice(1));
        const ab = g.op(a, b);
        return texChoice(
          rng,
          t(
            `The Cayley table of a group is $${cayleyTex(g, order, [[a, b]])}$. Which element is missing?`,
            `一个群的凯莱表为 $${cayleyTex(g, order, [[a, b]])}$。缺失的元素是什么？`,
          ),
          g.labels[ab]!,
          rng.shuffle(g.labels.filter((_, i) => i !== ab)),
          t(
            `Row $${g.labels[a]}$ must contain every element once, and $${g.labels[ab]}$ is the only one missing from it.`,
            `第 $${g.labels[a]}$ 行必须恰好含每个元素一次，而其中只缺少 $${g.labels[ab]}$。`,
          ),
        );
      },
    },
    {
      id: "computing-with-cayley-tables",
      title: t("Computing products", "计算乘积"),
      explanation: t(
        "A Cayley table lists every product, with the row giving the first element and the column giving the second, so products are looked up step by step. To find $(x \\ast y) \\ast z$, read $x \\ast y$ from row $x$, column $y$, then look up that element's row and column $z$.",
        "凯莱表列出所有乘积，行给出第一个元素，列给出第二个元素，所以乘积可以逐步查出。要求 $(x \\ast y) \\ast z$，先在第 $x$ 行第 $y$ 列读出 $x \\ast y$，再查该元素所在行与第 $z$ 列的交叉处。",
      ),
      generate(rng) {
        const g = randomSmallGroup(rng);
        const order = shuffled(rng, g);
        const [x, y, z] = [rng.pick(order), rng.pick(order), rng.pick(order)];
        const xy = g.op(x, y);
        const value = g.op(xy, z);
        const L = g.labels;
        return texChoice(
          rng,
          t(
            `The Cayley table of a group is $${cayleyTex(g, order)}$. Find $(${L[x]} \\ast ${L[y]}) \\ast ${L[z]}$.`,
            `一个群的凯莱表为 $${cayleyTex(g, order)}$。求 $(${L[x]} \\ast ${L[y]}) \\ast ${L[z]}$。`,
          ),
          L[value]!,
          [L[g.op(z, xy)]!, L[xy]!, L[g.op(x, z)]!, ...rng.shuffle(L.filter((_, i) => i !== value))],
          t(
            `$${L[x]} \\ast ${L[y]} = ${L[xy]}$ and $${L[xy]} \\ast ${L[z]} = ${L[value]}$.`,
            `$${L[x]} \\ast ${L[y]} = ${L[xy]}$，且 $${L[xy]} \\ast ${L[z]} = ${L[value]}$。`,
          ),
        );
      },
    },
  ],
};

/** cayleyFigure draws the Cayley diagram of ℤₙ with arrows x → x + g, its vertices 0, …, n − 1 on a circle; arrows listed in path are highlighted. */
function cayleyFigure(n: number, g: number, path: readonly number[], alt: Text): Figure {
  const [cx, cy, R, r] = [160, 115, 90, 12];
  const fx = (x: number) => Math.round(x * 10) / 10;
  const pos = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const;
  });
  let body = "";
  for (let x = 0; x < n; x++) {
    const [x1, y1] = pos[x]!;
    const [x2, y2] = pos[(x + g) % n]!;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
    const [ex, ey] = [x2 - ux * r, y2 - uy * r];
    const [bx, by] = [ex - ux * 8, ey - uy * 8];
    const cls = path.includes(x) ? ' class="accent" stroke-width="2.5"' : "";
    body += `<line${cls} x1="${fx(x1 + ux * r)}" y1="${fx(y1 + uy * r)}" x2="${fx(ex)}" y2="${fx(ey)}"/>`;
    body += `<polygon${cls} fill="currentColor" points="${fx(ex)},${fx(ey)} ${fx(bx - uy * 3.5)},${fx(by + ux * 3.5)} ${fx(bx + uy * 3.5)},${fx(by - ux * 3.5)}"/>`;
  }
  for (const [i, [x, y]] of pos.entries()) {
    body += `<circle cx="${fx(x)}" cy="${fx(y)}" r="${r}"/><text x="${fx(x)}" y="${fx(y + 4.5)}" stroke="none" fill="currentColor">${i}</text>`;
  }
  return { svg: svgDocument(230, body), alt };
}

/** cayleyDiagrams follows the arrows of Cayley diagrams of cyclic groups. */
export const cayleyDiagrams: TopicDef = {
  id: "cayley-diagrams",
  title: t("Cayley Diagrams", "凯莱图"),
  summary: t(
    "A Cayley diagram of a group with chosen generators has a vertex for each element and, for each generator g, an arrow from x to x ∗ g. Following a path of arrows multiplies by the generators along it. In ℤₙ with generator g, the arrows of g form gcd(g, n) cycles, each of length n / gcd(g, n).",
    "取定生成元的群的凯莱图中，每个元素是一个顶点，对每个生成元 g，从 x 到 x ∗ g 有一条箭头。沿箭头走一条路径，就是依次乘上路径上的生成元。在以 g 为生成元的 ℤₙ 中，g 的箭头构成 gcd(g, n) 个圈，每个圈长 n / gcd(g, n)。",
  ),
  prerequisites: ["cayley-tables", "orders-of-group-elements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "following-arrows-in-cayley-diagrams",
      title: t("Following arrows", "沿箭头走"),
      explanation: t(
        "In the Cayley diagram of $\\mathbb{Z}_{10}$ with arrows $x \\to x + 3$, following $4$ arrows from $7$ adds $4 \\cdot 3 = 12$: you end at $(7 + 12) \\bmod 10 = 9$. Following an arrow backwards subtracts $3$.",
        "在箭头为 $x \\to x + 3$ 的 $\\mathbb{Z}_{10}$ 凯莱图中，从 $7$ 出发沿 $4$ 条箭头走，加上 $4 \\cdot 3 = 12$：终点为 $(7 + 12) \\bmod 10 = 9$。逆着箭头走则减去 $3$。",
      ),
      figure: cayleyFigure(
        10,
        3,
        [7, 0, 3, 6],
        t(
          "The Cayley diagram of ℤ₁₀ with an arrow from each x to x + 3. The path of 4 arrows from 7 is highlighted: 7 → 0 → 3 → 6 → 9.",
          "ℤ₁₀ 的凯莱图，每个 x 都有一条箭头指向 x + 3。从 7 出发的 4 条箭头的路径被高亮：7 → 0 → 3 → 6 → 9。",
        ),
      ),
      generate(rng) {
        const n = rng.int(5, 16);
        const g = rng.int(2, n - 1);
        const h = rng.int(1, n - 1);
        const start = rng.int(0, n - 1);
        const forward = rng.int(2, 7);
        const back = rng.int(0, 3);
        const value = mod(start + forward * g - back * h, n);
        return numberProblem({
          prompt: t(
            `The Cayley diagram of $\\mathbb{Z}_{${n}}$ has solid arrows $x \\to x + ${g}$ and dashed arrows $x \\to x + ${h}$. Starting at $${start}$, you follow $${forward}$ solid arrows forwards${back === 0 ? "" : ` and then $${back}$ dashed arrow${back === 1 ? "" : "s"} backwards`}. At which vertex do you end?`,
            `$\\mathbb{Z}_{${n}}$ 的凯莱图中，实线箭头为 $x \\to x + ${g}$，虚线箭头为 $x \\to x + ${h}$。从 $${start}$ 出发，顺着实线箭头走 $${forward}$ 步${back === 0 ? "" : `，再逆着虚线箭头走 $${back}$ 步`}。终点是哪个顶点？`,
          ),
          answer: value,
          wrong: [mod(start + forward * g + back * h, n), mod(start + forward + g, n), mod(forward * g, n)],
          solution: t(
            `You end at $${start} + ${forward} \\cdot ${g}${back === 0 ? "" : ` - ${back} \\cdot ${h}`} \\equiv ${value} \\pmod{${n}}$.`,
            `终点为 $${start} + ${forward} \\cdot ${g}${back === 0 ? "" : ` - ${back} \\cdot ${h}`} \\equiv ${value} \\pmod{${n}}$。`,
          ),
        });
      },
    },
    {
      id: "cycles-in-cayley-diagrams",
      title: t("Cycles of arrows", "箭头构成的圈"),
      explanation: t(
        "In $\\mathbb{Z}_{12}$ the arrows $x \\to x + 8$ form the cycles $0 \\to 8 \\to 4 \\to 0$, $1 \\to 9 \\to 5 \\to 1$, and so on: each has length equal to the order $3$ of $8$, so there are $\\frac{12}{3} = 4 = \\gcd(8, 12)$ cycles.",
        "在 $\\mathbb{Z}_{12}$ 中，箭头 $x \\to x + 8$ 构成圈 $0 \\to 8 \\to 4 \\to 0$、$1 \\to 9 \\to 5 \\to 1$ 等：每个圈的长度等于 $8$ 的阶 $3$，所以共有 $\\frac{12}{3} = 4 = \\gcd(8, 12)$ 个圈。",
      ),
      figure: cayleyFigure(
        12,
        8,
        [0, 8, 4],
        t(
          "The Cayley diagram of ℤ₁₂ with an arrow from each x to x + 8. The arrows form 4 triangles, such as the highlighted cycle 0 → 8 → 4 → 0 and the cycle 1 → 9 → 5 → 1.",
          "ℤ₁₂ 的凯莱图，每个 x 都有一条箭头指向 x + 8。箭头构成 4 个三角形，例如高亮的圈 0 → 8 → 4 → 0，以及圈 1 → 9 → 5 → 1。",
        ),
      ),
      generate(rng) {
        const n = rng.int(6, 30);
        const g = rng.int(1, n - 1);
        const d = gcd(g, n);
        const length = rng.bool();
        const value = length ? n / d : d;
        return numberProblem({
          prompt: length
            ? t(
                `In the Cayley diagram of $\\mathbb{Z}_{${n}}$ with arrows $x \\to x + ${g}$, how many vertices lie on each cycle of arrows?`,
                `在箭头为 $x \\to x + ${g}$ 的 $\\mathbb{Z}_{${n}}$ 凯莱图中，每个箭头圈上有多少个顶点？`,
              )
            : t(
                `In the Cayley diagram of $\\mathbb{Z}_{${n}}$ with arrows $x \\to x + ${g}$, into how many cycles do the arrows split the vertices?`,
                `在箭头为 $x \\to x + ${g}$ 的 $\\mathbb{Z}_{${n}}$ 凯莱图中，箭头把顶点分成多少个圈？`,
              ),
          answer: value,
          wrong: [length ? d : n / d, g, n - g, 1],
          solution: t(
            `$${g}$ has order $\\frac{${n}}{\\gcd(${g}, ${n})} = ${n / d}$, so each cycle has $${n / d}$ vertices and there are $${d}$ cycles.`,
            `$${g}$ 的阶为 $\\frac{${n}}{\\gcd(${g}, ${n})} = ${n / d}$，所以每个圈有 $${n / d}$ 个顶点，共有 $${d}$ 个圈。`,
          ),
        });
      },
    },
  ],
};

/** abelianGroups decides commutativity of groups. */
export const abelianGroups: TopicDef = {
  id: "abelian-groups",
  title: t("Abelian Groups", "阿贝尔群"),
  summary: t(
    "A group is abelian if its operation is commutative. ℤₙ, U(n) and the nonzero complex numbers are abelian; GL(2, ℝ), the symmetries of a triangle S₃, and the affine maps under composition are not. A finite group is abelian exactly when its Cayley table is symmetric.",
    "运算可交换的群称为阿贝尔群。ℤₙ、U(n) 与非零复数是阿贝尔群；GL(2, ℝ)、三角形的对称群 S₃ 以及复合下的仿射映射不是。有限群是阿贝尔群当且仅当它的凯莱表对称。",
  ),
  prerequisites: ["cayley-tables", "general-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-abelian-groups",
      title: t("Recognizing abelian groups", "识别阿贝尔群"),
      explanation: t(
        "Look for two elements that do not commute. In the affine group, $f(x) = 2x$ and $g(x) = x + 1$ give $f(g(x)) = 2x + 2$ but $g(f(x)) = 2x + 1$. Groups of numbers under $+$ or $\\cdot$, and diagonal matrices, are abelian.",
        "寻找两个不可交换的元素。在仿射群中，$f(x) = 2x$ 与 $g(x) = x + 1$ 给出 $f(g(x)) = 2x + 2$，而 $g(f(x)) = 2x + 1$。数在 $+$ 或 $\\cdot$ 下构成的群以及对角矩阵群都是阿贝尔群。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const p = rng.pick([2, 3, 5, 7]);
        const size = rng.int(2, 4);
        const facts: Fact[] = [
          {
            prompt: t(`Is $\\mathbb{Z}_{${n}}$ under addition abelian?`, `加法群 $\\mathbb{Z}_{${n}}$ 是阿贝尔群吗？`),
            holds: true,
            reason: t("Addition modulo $n$ is commutative.", "模 $n$ 加法可交换。"),
          },
          {
            prompt: t(`Is $U(${n})$ under multiplication abelian?`, `乘法群 $U(${n})$ 是阿贝尔群吗？`),
            holds: true,
            reason: t("Multiplication modulo $n$ is commutative.", "模 $n$ 乘法可交换。"),
          },
          {
            prompt: t(`Is $GL(${size}, \\mathbb{Z}_{${p}})$ abelian?`, `$GL(${size}, \\mathbb{Z}_{${p}})$ 是阿贝尔群吗？`),
            holds: false,
            reason: t(
              "Elementary matrices that add row 1 to row 2 and row 2 to row 1 do not commute.",
              "把第 1 行加到第 2 行的初等矩阵与把第 2 行加到第 1 行的初等矩阵不可交换。",
            ),
          },
          {
            prompt: t(
              `Is the group of invertible diagonal $${(n % 4) + 2} \\times ${(n % 4) + 2}$ matrices over $\\mathbb{Z}_{${p}}$ abelian?`,
              `$\\mathbb{Z}_{${p}}$ 上可逆的 $${(n % 4) + 2} \\times ${(n % 4) + 2}$ 对角矩阵构成的群是阿贝尔群吗？`,
            ),
            holds: true,
            reason: t("Diagonal matrices multiply entry by entry, which is commutative.", "对角矩阵逐元素相乘，是可交换的。"),
          },
          {
            prompt: t(
              `Is $\\{z \\in \\mathbb{C} : z^{${n}} = 1\\}$ under multiplication abelian?`,
              `乘法群 $\\{z \\in \\mathbb{C} : z^{${n}} = 1\\}$ 是阿贝尔群吗？`,
            ),
            holds: true,
            reason: t("Multiplication of complex numbers is commutative.", "复数乘法可交换。"),
          },
          {
            prompt: t(
              `Is the group of maps $x \\mapsto ax + b$ with $a \\in \\mathbb{Z}_{${p}} \\setminus \\{0\\}$, $b \\in \\mathbb{Z}_{${p}}$, under composition, abelian?`,
              `$a \\in \\mathbb{Z}_{${p}} \\setminus \\{0\\}$、$b \\in \\mathbb{Z}_{${p}}$ 的映射 $x \\mapsto ax + b$ 在复合下构成的群是阿贝尔群吗？`,
            ),
            holds: p === 2,
            reason:
              p === 2
                ? t(
                    "Over $\\mathbb{Z}_2$ the only maps are $x \\mapsto x + b$, which commute.",
                    "在 $\\mathbb{Z}_2$ 上只有映射 $x \\mapsto x + b$，它们可交换。",
                  )
                : t(
                    "$f(x) = 2x$ and $g(x) = x + 1$ give $f(g(x)) = 2x + 2$ but $g(f(x)) = 2x + 1$.",
                    "$f(x) = 2x$ 与 $g(x) = x + 1$ 给出 $f(g(x)) = 2x + 2$，而 $g(f(x)) = 2x + 1$。",
                  ),
          },
          {
            prompt: t(
              `Is $\\mathbb{Z}$ under $a \\ast b = a + b ${signed(n)}$ abelian?`,
              `$\\mathbb{Z}$ 在 $a \\ast b = a + b ${signed(n)}$ 下构成的群是阿贝尔群吗？`,
            ),
            holds: true,
            reason: t("$a + b + c = b + a + c$.", "$a + b + c = b + a + c$。"),
          },
          {
            prompt: t(`Is $SL(2, \\mathbb{Z}_{${p}})$ abelian?`, `$SL(2, \\mathbb{Z}_{${p}})$ 是阿贝尔群吗？`),
            holds: false,
            reason: t(
              "$\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $\\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$ do not commute.",
              "$\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ 与 $\\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$ 不可交换。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "abelian-groups-from-cayley-tables",
      title: t("Cayley tables of abelian groups", "阿贝尔群的凯莱表"),
      explanation: t(
        "A finite group is abelian exactly when its Cayley table is symmetric about the main diagonal, provided rows and columns are listed in the same order. One asymmetric pair of entries is enough to show it is not abelian.",
        "当行与列按相同顺序排列时，有限群是阿贝尔群当且仅当它的凯莱表关于主对角线对称。只要有一对不对称的元素，就说明它不是阿贝尔群。",
      ),
      generate(rng) {
        const g = relabel(rng, rng.pick([symmetricGroup3(), symmetricGroup3(), cyclicGroup(6), cyclicGroup(5), kleinGroup()]));
        const order = shuffled(rng, g);
        const pair = order.flatMap((a) => order.filter((b) => g.op(a, b) !== g.op(b, a)).map((b) => [a, b] as const))[0];
        const L = g.labels;
        // For an abelian group the option for "no" claims a product that the table does not have.
        const [a, b] = pair ?? [order[1]!, order[2]!];
        const claimed = pair ? g.op(b, a) : order.find((x) => x !== g.op(b, a))!;
        const reason: Text =
          pair === undefined
            ? t("The table is symmetric about its main diagonal.", "表格关于主对角线对称。")
            : t(
                `$${L[pair[0]]} \\ast ${L[pair[1]]} = ${L[g.op(pair[0], pair[1])]}$ but $${L[pair[1]]} \\ast ${L[pair[0]]} = ${L[g.op(pair[1], pair[0])]}$.`,
                `$${L[pair[0]]} \\ast ${L[pair[1]]} = ${L[g.op(pair[0], pair[1])]}$，而 $${L[pair[1]]} \\ast ${L[pair[0]]} = ${L[g.op(pair[1], pair[0])]}$。`,
              );
        return verdictChoice(rng, {
          prompt: t(
            `Is the group with Cayley table $${cayleyTex(g, order)}$ abelian?`,
            `凯莱表为 $${cayleyTex(g, order)}$ 的群是阿贝尔群吗？`,
          ),
          holds: g.abelian,
          yes: t("the table is symmetric about its main diagonal", "表格关于主对角线对称"),
          no: t(
            `$${L[a]} \\ast ${L[b]} = ${L[g.op(a, b)]}$ but $${L[b]} \\ast ${L[a]} = ${L[claimed]}$`,
            `$${L[a]} \\ast ${L[b]} = ${L[g.op(a, b)]}$，而 $${L[b]} \\ast ${L[a]} = ${L[claimed]}$`,
          ),
          yesWrong: t("every row contains every element exactly once", "每一行都恰好含每个元素一次"),
          noWrong: t("the table is not symmetric about its other diagonal", "表格关于另一条对角线不对称"),
          solution: t(`${g.abelian ? "Yes" : "No"}. ${reason.en}`, `${g.abelian ? "是" : "否"}。${reason["zh-CN"]}`),
        });
      },
    },
  ],
};

/** abstractAlgebraGroupTopics are the topics of Abstract Algebra modules 2.2 and 2.3. */
export const abstractAlgebraGroupTopics: readonly TopicDef[] = [
  introductionToBinaryOperations,
  associativeBinaryOperations,
  commutativeBinaryOperations,
  identitiesOfBinaryOperations,
  inversesUnderBinaryOperations,
  introductionToGroups,
  realRationalAndComplexGroups,
  matrixGroups,
  functionGroups,
  generalGroups,
  theOrderOfAGroup,
  ordersOfGroupElements,
  computingInversesOfElementsInZn,
  cayleyTables,
  cayleyDiagrams,
  abelianGroups,
];
