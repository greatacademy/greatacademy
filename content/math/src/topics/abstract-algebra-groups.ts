import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, Q, svgDocument } from "@ga/subject-math";

import { numberProblem, verdictChoice, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
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
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 2, modules 2.2 and 2.3: binary operations and groups.

/** apart keeps the explained mistakes that differ from the answer and from each other. */
const apart = <T extends { readonly value: Coefficient }>(answer: Coefficient, list: readonly T[]): T[] => {
  const asQ = (v: Coefficient) => (typeof v === "number" ? Q.of(v) : v);
  return list.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && list.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
};

/** par writes a negative number in brackets, for use after an operator. */
const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);
/** parQ writes a negative rational in brackets, for use after an operator. */
const parQ = (q: ReturnType<typeof Q.of>) => (q.toNumber() < 0 ? `(${q.toLatex()})` : q.toLatex());

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
  intro: t(
    "Take $a \\ast b = a + b - ab$ on the integers. Then $3 \\ast 5 = 3 + 5 - 15 = -7$, again an integer, and sums and products of integers are always integers, so $\\ast$ is a binary operation on $\\mathbb{Z}$. By contrast, $a \\ast b = \\frac{a}{b}$ is not a binary operation on $\\mathbb{Z}$: $1 \\ast 2 = \\frac{1}{2}$ is not an integer, and $1 \\ast 0$ is not defined.\n\nCheck: $5 \\ast 3 = 5 + 3 - 15 = -7$ as well, and the value is an integer, as closure requires.\n\nIn this lesson we evaluate binary operations given by formulas and decide whether a set is closed under them.",
    "在整数上取 $a \\ast b = a + b - ab$。则 $3 \\ast 5 = 3 + 5 - 15 = -7$ 仍是整数，而整数的和与积总是整数，所以 $\\ast$ 是 $\\mathbb{Z}$ 上的二元运算。相反，$a \\ast b = \\frac{a}{b}$ 不是 $\\mathbb{Z}$ 上的二元运算：$1 \\ast 2 = \\frac{1}{2}$ 不是整数，而 $1 \\ast 0$ 没有定义。\n\n检验：$5 \\ast 3 = 5 + 3 - 15 = -7$ 也成立，结果是整数，符合封闭性的要求。\n\n本课我们计算由公式给出的二元运算，并判断集合对它们是否封闭。",
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
        "A binary operation is a rule that combines two elements into one, so evaluate it by substituting the two elements into its formula in order. Substitute the first element for $a$ and the second for $b$.\n\nWith $a \\ast b = 2a - b + ab$: $3 \\ast (-1) = 2 \\cdot 3 - (-1) + 3 \\cdot (-1) = 6 + 1 - 3 = 4$, while $(-1) \\ast 3 = -2 - 3 - 3 = -8$.\n\nCheck: put the numbers back term by term, $2a = 6$, $-b = 1$ and $ab = -3$, and they add to $4$.\n\n> **Watch out.** The order matters: $3 \\ast (-1)$ and $(-1) \\ast 3$ differ unless the formula is symmetric in $a$ and $b$. Keep the brackets around a negative $b$, since $-b$ with $b = -1$ is $+1$.",
        "二元运算是把两个元素合成一个元素的规则，所以按顺序把两个元素代入它的公式来求值。把第一个元素代入 $a$，第二个代入 $b$。\n\n若 $a \\ast b = 2a - b + ab$：$3 \\ast (-1) = 2 \\cdot 3 - (-1) + 3 \\cdot (-1) = 6 + 1 - 3 = 4$，而 $(-1) \\ast 3 = -2 - 3 - 3 = -8$。\n\n检验：逐项代回，$2a = 6$，$-b = 1$，$ab = -3$，三者之和为 $4$。\n\n> **注意。** 顺序很重要：除非公式关于 $a$、$b$ 对称，$3 \\ast (-1)$ 与 $(-1) \\ast 3$ 不同。负的 $b$ 要保留括号，因为 $b = -1$ 时 $-b$ 是 $+1$。",
      ),
      generate(rng) {
        for (;;) {
          const o: Linear = { p: rng.nonZero(-4, 4), q: rng.nonZero(-4, 4), r: rng.int(-2, 2), k: rng.int(-6, 6) };
          const x = rng.nonZero(-6, 6);
          const y = rng.nonZero(-6, 6);
          const value = applyLinear(o, x, y);
          const mistakes = apart(value, [
            why(
              applyLinear(o, y, x),
              `This substitutes the numbers the other way round, $a = ${y}$ and $b = ${x}$; the first element goes in for $a$.`,
              `这把数代反了，$a = ${y}$、$b = ${x}$；第一个元素应代入 $a$。`,
            ),
            why(
              value - 2 * o.q * y,
              `This loses the sign of $b = ${y}$ in the term in $b$.`,
              `这在含 $b$ 的项中弄错了 $b = ${y}$ 的符号。`,
            ),
            why(value - o.r * x * y, "This leaves out the term in $ab$.", "这漏掉了含 $ab$ 的项。"),
            why(value - o.k, "This leaves out the constant term.", "这漏掉了常数项。"),
          ]);
          if (mistakes.length < 2) continue;
          const terms = [o.p * x, o.q * y, o.r * x * y, o.k];
          return numberProblem({
            prompt: t(
              `The binary operation $\\ast$ on $\\mathbb{Z}$ is defined by $a \\ast b = ${linearTex(o)}$. Find $${x} \\ast ${par(y)}$.`,
              `$\\mathbb{Z}$ 上的二元运算 $\\ast$ 定义为 $a \\ast b = ${linearTex(o)}$。求 $${x} \\ast ${par(y)}$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Substitute in order", "按顺序代入"],
                  t(`Put $a = ${x}$ and $b = ${y}$ into $${linearTex(o)}$.`, `把 $a = ${x}$、$b = ${y}$ 代入 $${linearTex(o)}$。`),
                ],
                [
                  ["Evaluate the terms", "计算各项"],
                  t(
                    `The terms in $a$, $b$, $ab$ and the constant are $${terms.join("$, $")}$, so $${x} \\ast ${par(y)} = ${value}$.`,
                    `含 $a$、$b$、$ab$ 的项与常数项分别为 $${terms.join("$、$")}$，所以 $${x} \\ast ${par(y)} = ${value}$。`,
                  ),
                ],
              ],
              t(`$${terms.map(par).join(" + ")} = ${value}$.`, `$${terms.map(par).join(" + ")} = ${value}$。`),
            ),
          });
        }
      },
    },
    {
      id: "closure-of-binary-operations",
      title: t("Closure", "封闭性"),
      explanation: t(
        "To show that $\\ast$ is not a binary operation on $S$, find one pair $a, b \\in S$ with $a \\ast b \\notin S$. To show that it is, argue for every pair at once.\n\nSubtraction is not a binary operation on $\\mathbb{Z}^+$, since $1$ and $2$ are positive but $1 - 2 = -1$ is not. Addition is one on the even integers: $2m + 2n = 2(m + n)$ is even for all integers $m$ and $n$.\n\nCheck: the counterexample uses only elements of the set, $1, 2 \\in \\mathbb{Z}^+$, and its result $-1$ really lies outside it.\n\n> **Watch out.** One pair that stays in the set proves nothing: $3 - 1 = 2$ is positive, yet subtraction still fails on $\\mathbb{Z}^+$. Closure is a claim about every pair, including $a = b$.",
        "要说明 $\\ast$ 不是 $S$ 上的二元运算，只需找到一对 $a, b \\in S$ 使 $a \\ast b \\notin S$。要说明它是，就要对所有的对一起论证。\n\n减法不是 $\\mathbb{Z}^+$ 上的二元运算，因为 $1$ 和 $2$ 是正数，而 $1 - 2 = -1$ 不是。加法是偶数集上的二元运算：对所有整数 $m$、$n$，$2m + 2n = 2(m + n)$ 都是偶数。\n\n检验：反例只用了集合中的元素 $1, 2 \\in \\mathbb{Z}^+$，而它的结果 $-1$ 确实不在集合中。\n\n> **注意。** 一对留在集合中的元素什么也证明不了：$3 - 1 = 2$ 是正数，但减法在 $\\mathbb{Z}^+$ 上仍不封闭。封闭性是关于所有的对（包括 $a = b$）的断言。",
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
  intro: t(
    "For $a \\ast b = 2a + b$, $(1 \\ast 2) \\ast 3 = 4 \\ast 3 = 11$, while $1 \\ast (2 \\ast 3) = 1 \\ast 7 = 9$. The two bracketings give different values, so $\\ast$ is not associative.\n\nCheck: $1 \\ast 2 = 2 + 2 = 4$ and $4 \\ast 3 = 8 + 3 = 11$; $2 \\ast 3 = 4 + 3 = 7$ and $1 \\ast 7 = 2 + 7 = 9$.\n\nIn this lesson we evaluate products of three elements under both bracketings and decide whether an operation is associative.",
    "对 $a \\ast b = 2a + b$，$(1 \\ast 2) \\ast 3 = 4 \\ast 3 = 11$，而 $1 \\ast (2 \\ast 3) = 1 \\ast 7 = 9$。两种加括号方式的结果不同，所以 $\\ast$ 不满足结合律。\n\n检验：$1 \\ast 2 = 2 + 2 = 4$，$4 \\ast 3 = 8 + 3 = 11$；$2 \\ast 3 = 4 + 3 = 7$，$1 \\ast 7 = 2 + 7 = 9$。\n\n本课我们按两种加括号方式计算三个元素的乘积，并判断运算是否满足结合律。",
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
        "An operation combines only two elements at a time, so a bracketed expression is evaluated from the inside out, and different bracketings may disagree. Work from the innermost brackets.\n\nWith $a \\ast b = a + 2b$: $(1 \\ast 2) \\ast 3 = 5 \\ast 3 = 5 + 6 = 11$, but $1 \\ast (2 \\ast 3) = 1 \\ast 8 = 1 + 16 = 17$, so this operation is not associative.\n\nCheck: the inner result is used in its own place, as the first element in $5 \\ast 3$ and as the second in $1 \\ast 8$.\n\n> **Watch out.** The inner result goes back in where the brackets were: in $1 \\ast (2 \\ast 3)$ it is the second element, $1 \\ast 8$, not $8 \\ast 1 = 10$. And do not stop at the inner value.",
        "运算一次只合并两个元素，所以带括号的表达式要从里向外计算，不同的加括号方式可能给出不同结果。从最内层括号算起。\n\n若 $a \\ast b = a + 2b$：$(1 \\ast 2) \\ast 3 = 5 \\ast 3 = 5 + 6 = 11$，而 $1 \\ast (2 \\ast 3) = 1 \\ast 8 = 1 + 16 = 17$，所以这个运算不可结合。\n\n检验：内层结果放回它自己的位置，在 $5 \\ast 3$ 中作第一个元素，在 $1 \\ast 8$ 中作第二个元素。\n\n> **注意。** 内层结果要放回括号原来的位置：在 $1 \\ast (2 \\ast 3)$ 中它是第二个元素，即 $1 \\ast 8$，而不是 $8 \\ast 1 = 10$。也不要停在内层的值上。",
      ),
      generate(rng) {
        for (;;) {
          const o: Linear = { p: rng.nonZero(-3, 3), q: rng.nonZero(-3, 3), r: 0, k: rng.int(-5, 5) };
          const [x, y, z] = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
          const left = rng.bool();
          const f = (a: number, b: number) => applyLinear(o, a, b);
          const inner = left ? f(x, y) : f(y, z);
          const value = left ? f(inner, z) : f(x, inner);
          const other = left ? f(x, f(y, z)) : f(f(x, y), z);
          const swapped = left ? f(z, inner) : f(inner, x);
          const mistakes = apart(value, [
            why(
              other,
              "This brackets the product the other way; this operation is not associative.",
              "这按另一种方式加了括号；这个运算不可结合。",
            ),
            why(inner, "This stops after the inner bracket.", "这算完内层括号就停了。"),
            why(
              swapped,
              `This puts the inner result $${inner}$ on the wrong side of the second operation.`,
              `这把内层结果 $${inner}$ 放到了第二次运算的另一侧。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          const expr = left ? `(${x} \\ast ${par(y)}) \\ast ${par(z)}` : `${x} \\ast (${y} \\ast ${par(z)})`;
          const first = left ? `${x} \\ast ${par(y)}` : `${y} \\ast ${par(z)}`;
          const second = left ? `${inner} \\ast ${par(z)}` : `${x} \\ast ${par(inner)}`;
          return numberProblem({
            prompt: t(
              `The operation $\\ast$ on $\\mathbb{Z}$ is defined by $a \\ast b = ${linearTex(o)}$. Find $${expr}$.`,
              `$\\mathbb{Z}$ 上的运算 $\\ast$ 定义为 $a \\ast b = ${linearTex(o)}$。求 $${expr}$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [["Work out the inner bracket", "先算内层括号"], t(`$${first} = ${inner}$.`, `$${first} = ${inner}$。`)],
                [["Put it back in its place", "放回原位再算"], t(`$${second} = ${value}$.`, `$${second} = ${value}$。`)],
              ],
              t(
                `The inner result is the ${left ? "first" : "second"} element of the outer operation, just as the bracket was, and $${second} = ${value}$ by the formula.`,
                `内层结果是外层运算的${left ? "第一个" : "第二个"}元素，与括号的位置一致，按公式 $${second} = ${value}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "deciding-associativity",
      title: t("Deciding associativity", "判断结合性"),
      explanation: t(
        "Expand both sides. If the expansions agree, the operation is associative; if they differ, find specific values to show it.\n\nFor $a \\ast b = a + b + ab$: $(a \\ast b) \\ast c = (a + b + ab) + c + (a + b + ab)c$ and $a \\ast (b \\ast c) = a + (b + c + bc) + a(b + c + bc)$. Both equal $a + b + c + ab + bc + ca + abc$, so $\\ast$ is associative.\n\nCheck: with $a, b, c = 1, 2, 3$, $(1 \\ast 2) \\ast 3 = 5 \\ast 3 = 23$ and $1 \\ast (2 \\ast 3) = 1 \\ast 11 = 23$.\n\n> **Watch out.** Agreement on one triple does not prove associativity; it needs the algebra for all $a$, $b$, $c$. A single triple where the sides differ is enough to disprove it.",
        "把两边展开。若展开式相同，运算可结合；若不同，就找具体数值说明。\n\n对 $a \\ast b = a + b + ab$：$(a \\ast b) \\ast c = (a + b + ab) + c + (a + b + ab)c$，$a \\ast (b \\ast c) = a + (b + c + bc) + a(b + c + bc)$。两者都等于 $a + b + c + ab + bc + ca + abc$，所以 $\\ast$ 可结合。\n\n检验：取 $a, b, c = 1, 2, 3$，$(1 \\ast 2) \\ast 3 = 5 \\ast 3 = 23$，$1 \\ast (2 \\ast 3) = 1 \\ast 11 = 23$。\n\n> **注意。** 在一组数上相等并不能证明结合律；需要对所有 $a$、$b$、$c$ 作代数推导。只要有一组使两边不等，就足以否定它。",
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
  intro: t(
    "The operation $a \\ast b = a + b + ab$ is commutative: swapping $a$ and $b$ gives $b + a + ba$, the same expression. The operation $a \\ast b = a - b$ is not: $5 \\ast 2 = 3$ but $2 \\ast 5 = -3$.\n\nCheck: $2 \\ast 3 = 2 + 3 + 6 = 11$ and $3 \\ast 2 = 3 + 2 + 6 = 11$.\n\nIn this lesson we decide whether operations given by formulas or by tables are commutative.",
    "运算 $a \\ast b = a + b + ab$ 可交换：交换 $a$ 与 $b$ 得到 $b + a + ba$，是同一个式子。运算 $a \\ast b = a - b$ 不可交换：$5 \\ast 2 = 3$，而 $2 \\ast 5 = -3$。\n\n检验：$2 \\ast 3 = 2 + 3 + 6 = 11$，$3 \\ast 2 = 3 + 2 + 6 = 11$。\n\n本课我们判断由公式或运算表给出的运算是否可交换。",
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
        "An operation is commutative when the order of the two elements never matters, which you check by swapping them in the formula. Swap $a$ and $b$ and compare.\n\n$a \\ast b = 3a + 3b - ab$ is commutative, since swapping gives $3b + 3a - ba$, the same expression. $a \\ast b = 2a + b$ is not: $1 \\ast 0 = 2$ but $0 \\ast 1 = 1$.\n\nCheck: in $pa + qb + rab + k$, swapping exchanges only the coefficients of $a$ and $b$, so the operation is commutative exactly when $p = q$; here $3 = 3$, but $2 \\ne 1$.\n\n> **Watch out.** A pair with $a = b$, or any pair that happens to agree, shows nothing: $2a + b$ gives $1 \\ast 1 = 3$ both ways. Test a pair where the coefficients of $a$ and $b$ make a difference.",
        "如果两个元素的顺序从不影响结果，运算就是可交换的，检验方法是在公式中交换它们。交换 $a$ 与 $b$ 后比较。\n\n$a \\ast b = 3a + 3b - ab$ 可交换，因为交换后得 $3b + 3a - ba$，与原式相同。$a \\ast b = 2a + b$ 不可交换：$1 \\ast 0 = 2$，而 $0 \\ast 1 = 1$。\n\n检验：在 $pa + qb + rab + k$ 中，交换只是互换 $a$ 与 $b$ 的系数，所以运算可交换当且仅当 $p = q$；这里 $3 = 3$，而 $2 \\ne 1$。\n\n> **注意。** $a = b$ 的对，或者碰巧相等的对，说明不了什么：$2a + b$ 两种顺序都给出 $1 \\ast 1 = 3$。要取 $a$ 与 $b$ 的系数能体现差别的对来检验。",
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
        "Entry $(x, y)$ of the table is $x \\ast y$. Compare it with entry $(y, x)$: the operation is commutative exactly when every such pair matches, that is, when the table is symmetric about the main diagonal.\n\nOn $\\{a, b, c, d\\}$ there are $\\binom{4}{2} = 6$ pairs of distinct elements, one for each entry above the diagonal. If row $a$, column $b$ holds $c$ while row $b$, column $a$ holds $d$, then $a \\ast b \\ne b \\ast a$ and that pair counts.\n\nCheck: the pairs that commute and the pairs that do not together make all $6$.\n\n> **Watch out.** Count each unordered pair once: $\\{a, b\\}$ is one pair even though it gives two entries, $(a, b)$ and $(b, a)$. The diagonal entries $x \\ast x$ never count.",
        "表中第 $x$ 行第 $y$ 列的元素是 $x \\ast y$。把它与第 $y$ 行第 $x$ 列比较：运算可交换当且仅当每一对都相同，即表格关于主对角线对称。\n\n在 $\\{a, b, c, d\\}$ 上有 $\\binom{4}{2} = 6$ 对不同元素，每对对应主对角线上方的一个位置。若第 $a$ 行第 $b$ 列是 $c$，而第 $b$ 行第 $a$ 列是 $d$，则 $a \\ast b \\ne b \\ast a$，这一对就要计入。\n\n检验：可交换的对与不可交换的对合起来是全部 $6$ 对。\n\n> **注意。** 每个无序对只数一次：$\\{a, b\\}$ 虽然给出 $(a, b)$ 与 $(b, a)$ 两个位置，但只是一对。主对角线上的 $x \\ast x$ 从不计入。",
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
          mistakes: apart(bad.length, [
            why(
              6 - bad.length,
              "This counts the pairs that commute instead of those that do not.",
              "这数的是可交换的对，而不是不可交换的对。",
            ),
            why(
              2 * bad.length,
              "This counts each pair twice, once for each order; $\\{x, y\\}$ is a single pair.",
              "这把每对按两种顺序数了两次；$\\{x, y\\}$ 只是一对。",
            ),
            why(
              10 - bad.length,
              "This counts the commuting pairs and also the four diagonal entries $x \\ast x$.",
              "这数了可交换的对，还加上了主对角线上的四个 $x \\ast x$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["List the pairs", "列出所有的对"],
                t(
                  "The $6$ pairs of distinct elements correspond to the $6$ entries above the main diagonal.",
                  "$6$ 对不同元素对应主对角线上方的 $6$ 个位置。",
                ),
              ],
              [
                ["Compare mirror entries", "比较对称位置"],
                t(
                  bad.length === 0
                    ? "Every entry matches its mirror image across the main diagonal, so no pair fails."
                    : `The pairs ${bad.map(([i, j]) => `$\\{${LETTERS[i]}, ${LETTERS[j]}\\}$`).join(", ")} have $x \\ast y \\ne y \\ast x$, so the answer is $${bad.length}$.`,
                  bad.length === 0
                    ? "每个位置都与它关于主对角线的对称位置相同，所以没有不可交换的对。"
                    : `${bad.map(([i, j]) => `$\\{${LETTERS[i]}, ${LETTERS[j]}\\}$`).join("、")} 满足 $x \\ast y \\ne y \\ast x$，所以答案为 $${bad.length}$。`,
                ),
              ],
            ],
            t(
              `The other $${6 - bad.length}$ pairs commute, and $${bad.length} + ${6 - bad.length} = 6$ accounts for every pair.`,
              `其余 $${6 - bad.length}$ 对可交换，而 $${bad.length} + ${6 - bad.length} = 6$ 正是全部的对。`,
            ),
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
  intro: t(
    "For $a \\ast b = a + b - 5$ on $\\mathbb{Z}$, an identity $e$ must satisfy $a + e - 5 = a$ for every $a$, so $e = 5$.\n\nCheck: $5 \\ast 8 = 5 + 8 - 5 = 8$ and $8 \\ast 5 = 8 + 5 - 5 = 8$.\n\nIn this lesson we find the identities of operations given by formulas and by tables.",
    "对 $\\mathbb{Z}$ 上的 $a \\ast b = a + b - 5$，单位元 $e$ 必须对每个 $a$ 满足 $a + e - 5 = a$，所以 $e = 5$。\n\n检验：$5 \\ast 8 = 5 + 8 - 5 = 8$，$8 \\ast 5 = 8 + 5 - 5 = 8$。\n\n本课我们求由公式和运算表给出的运算的单位元。",
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
        "An identity element leaves every element unchanged on both sides, so solve for it from one side and confirm it works on the other. Solve $a \\ast e = a$ for $e$ and check that $e \\ast a = a$ too.\n\nFor $a \\ast b = a + b - 4$ on $\\mathbb{Z}$, $a + e - 4 = a$ gives $e = 4$. For $a \\ast b = \\frac{ab}{3}$ on $\\mathbb{Q} \\setminus \\{0\\}$, $\\frac{ae}{3} = a$ gives $e = 3$.\n\nCheck: $4 \\ast 7 = 4 + 7 - 4 = 7$ and $3 \\ast 5 = \\frac{15}{3} = 5$, so each leaves the other element unchanged.\n\n> **Watch out.** The identity belongs to the operation, not to ordinary arithmetic: $0$ is not the identity of $a + b - 4$, since $0 \\ast 7 = 3$, and $1$ is not the identity of $\\frac{ab}{3}$.",
        "单位元从两边作用都不改变任何元素，所以从一边解出它，再确认它在另一边也成立。解 $a \\ast e = a$ 求 $e$，并检验 $e \\ast a = a$ 也成立。\n\n对 $\\mathbb{Z}$ 上的 $a \\ast b = a + b - 4$，由 $a + e - 4 = a$ 得 $e = 4$。对 $\\mathbb{Q} \\setminus \\{0\\}$ 上的 $a \\ast b = \\frac{ab}{3}$，由 $\\frac{ae}{3} = a$ 得 $e = 3$。\n\n检验：$4 \\ast 7 = 4 + 7 - 4 = 7$，$3 \\ast 5 = \\frac{15}{3} = 5$，都使另一个元素保持不变。\n\n> **注意。** 单位元属于这个运算，而不是普通算术：$0$ 不是 $a + b - 4$ 的单位元，因为 $0 \\ast 7 = 3$；$1$ 也不是 $\\frac{ab}{3}$ 的单位元。",
      ),
      generate(rng) {
        const s = randomShifted(rng);
        const e = shiftedIdentity(s);
        const a = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `Find the identity element of the operation $${shiftedTex(s)}$ on $${shiftedSet(s)}$.`,
            `求 $${shiftedSet(s)}$ 上运算 $${shiftedTex(s)}$ 的单位元。`,
          ),
          answer: e,
          mistakes: apart(
            e,
            s.kind === "add"
              ? [
                  why(
                    s.c,
                    `This keeps the sign of $${s.c}$; solving $a + e ${signed(s.c)} = a$ moves it across.`,
                    `这保留了 $${s.c}$ 的符号；解 $a + e ${signed(s.c)} = a$ 时它要移到另一边。`,
                  ),
                  why(0, "This is the identity of ordinary addition, not of this operation.", "这是普通加法的单位元，不是这个运算的。"),
                ]
              : [
                  why(
                    1,
                    "This is the identity of ordinary multiplication, not of this operation.",
                    "这是普通乘法的单位元，不是这个运算的。",
                  ),
                  why(
                    Q.of(1, s.c),
                    `This divides by $${s.c}$ instead of multiplying: $\\frac{ae}{${s.c}} = a$ means $e = ${s.c}$.`,
                    `这是除以 $${s.c}$ 而不是乘：$\\frac{ae}{${s.c}} = a$ 意味着 $e = ${s.c}$。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Set up the equation", "列方程"],
                s.kind === "add"
                  ? t(`$a \\ast e = a + e ${signed(s.c)} = a$.`, `$a \\ast e = a + e ${signed(s.c)} = a$。`)
                  : t(`$a \\ast e = \\frac{ae}{${s.c}} = a$.`, `$a \\ast e = \\frac{ae}{${s.c}} = a$。`),
              ],
              [
                ["Solve for $e$", "解出 $e$"],
                s.kind === "add"
                  ? t(`Subtract $a$ from both sides: $e = ${e}$.`, `两边减去 $a$：$e = ${e}$。`)
                  : t(`Divide both sides by $a$ and multiply by $${s.c}$: $e = ${e}$.`, `两边除以 $a$ 再乘以 $${s.c}$：$e = ${e}$。`),
              ],
            ],
            s.kind === "add"
              ? t(
                  `$${e} \\ast ${a} = ${e} + ${a} ${signed(s.c)} = ${a}$, and the formula is symmetric, so $e$ works on both sides.`,
                  `$${e} \\ast ${a} = ${e} + ${a} ${signed(s.c)} = ${a}$，且公式对称，所以 $e$ 在两边都成立。`,
                )
              : t(
                  `$${e} \\ast ${a} = \\frac{${e * a}}{${s.c}} = ${a}$, and the formula is symmetric, so $e$ works on both sides.`,
                  `$${e} \\ast ${a} = \\frac{${e * a}}{${s.c}} = ${a}$，且公式对称，所以 $e$ 在两边都成立。`,
                ),
          ),
        });
      },
    },
    {
      id: "identities-from-tables",
      title: t("Identities from tables", "由运算表求单位元"),
      explanation: t(
        "Look for the row that copies the column headings in order; its element $e$ satisfies $e \\ast x = x$ for all $x$. Check that its column also copies the row headings.\n\nIf the headings are $p, q, r$ and row $q$ reads $p, q, r$, then $q \\ast p = p$, $q \\ast q = q$ and $q \\ast r = r$, so $q$ leaves everything unchanged from the left.\n\nCheck: column $q$ must read $p, q, r$ down the rows as well, giving $x \\ast q = x$ from the right.\n\n> **Watch out.** Do not take the element that heads the first row or column, or one whose row merely contains itself: the identity's whole row must match the headings in order.",
        "找出与列标题顺序完全相同的那一行；它对应的元素 $e$ 对所有 $x$ 满足 $e \\ast x = x$。再检验它所在的列也与行标题相同。\n\n若标题为 $p, q, r$，且第 $q$ 行为 $p, q, r$，则 $q \\ast p = p$，$q \\ast q = q$，$q \\ast r = r$，所以 $q$ 从左边作用不改变任何元素。\n\n检验：第 $q$ 列从上到下也必须是 $p, q, r$，这给出从右边作用 $x \\ast q = x$。\n\n> **注意。** 不要选排在第一行或第一列的元素，也不要选所在行只是含有它自己的元素：单位元的整行必须按顺序与标题相同。",
      ),
      generate(rng) {
        const g = randomGroupTable(rng);
        const order = rng.shuffle(range(0, g.size - 1));
        const L = g.labels;
        const e = L[g.identity]!;
        const reasons = range(0, g.size - 1)
          .filter((w) => w !== g.identity)
          .map(
            (w) =>
              [
                `$${L[w]}$`,
                `$${L[w]} \\ast ${e} = ${L[w]}$, not $${e}$, so the row of $${L[w]}$ does not repeat the column headings.`,
                `$${L[w]} \\ast ${e} = ${L[w]}$，而不是 $${e}$，所以 $${L[w]}$ 所在的行与列标题不同。`,
              ] as const,
          );
        return reasoned(
          texChoice(
            rng,
            t(
              `An operation $\\ast$ has the table $${cayleyTex(g, order)}$. Which element is the identity?`,
              `运算 $\\ast$ 的运算表为 $${cayleyTex(g, order)}$。哪个元素是单位元？`,
            ),
            e,
            rng.shuffle(L.filter((x) => x !== e)),
            walked(
              [
                [
                  ["Find the row that copies the headings", "找出与列标题相同的行"],
                  t(
                    `Row $${e}$ reads exactly like the column headings, so $${e} \\ast x = x$ for every $x$.`,
                    `第 $${e}$ 行与列标题完全相同，所以对每个 $x$ 都有 $${e} \\ast x = x$。`,
                  ),
                ],
              ],
              t(
                `Column $${e}$ also repeats the row headings, so $x \\ast ${e} = x$ as well, and $${e}$ is the identity.`,
                `第 $${e}$ 列也与行标题相同，所以 $x \\ast ${e} = x$ 也成立，$${e}$ 是单位元。`,
              ),
            ),
          ),
          reasons,
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
  intro: t(
    "Under $a \\ast b = a + b - 5$, whose identity is $5$, the inverse of $2$ solves $2 + x - 5 = 5$, so $x = 8$.\n\nCheck: $2 \\ast 8 = 2 + 8 - 5 = 5$, the identity, and $8 \\ast 2 = 5$ too.\n\nIn this lesson we find inverses from formulas and from operation tables.",
    "在单位元为 $5$ 的运算 $a \\ast b = a + b - 5$ 下，$2$ 的逆元满足 $2 + x - 5 = 5$，所以 $x = 8$。\n\n检验：$2 \\ast 8 = 2 + 8 - 5 = 5$，正是单位元，并且 $8 \\ast 2 = 5$ 也成立。\n\n本课我们由公式和运算表求逆元。",
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
        "An inverse combines with an element to give the identity of the operation, so find the identity first and then solve $a \\ast x = e$.\n\nFor $a \\ast b = a + b - 4$ the identity is $4$, so the inverse of $7$ solves $7 + x - 4 = 4$: $x = 1$. For $a \\ast b = \\frac{ab}{3}$ the identity is $3$, so the inverse of $2$ solves $\\frac{2x}{3} = 3$: $x = \\frac{9}{2}$.\n\nCheck: $7 \\ast 1 = 7 + 1 - 4 = 4$ and $2 \\ast \\frac{9}{2} = \\frac{9}{3} = 3$, each the identity.\n\n> **Watch out.** Solve for the identity of this operation, not for $0$ or $1$: $7 + x - 4 = 0$ gives $x = -3$, but $7 \\ast (-3) = 0$ is not the identity $4$.",
        "逆元与该元素结合得到这个运算的单位元，所以先求单位元，再解 $a \\ast x = e$。\n\n对 $a \\ast b = a + b - 4$，单位元为 $4$，所以 $7$ 的逆元满足 $7 + x - 4 = 4$：$x = 1$。对 $a \\ast b = \\frac{ab}{3}$，单位元为 $3$，所以 $2$ 的逆元满足 $\\frac{2x}{3} = 3$：$x = \\frac{9}{2}$。\n\n检验：$7 \\ast 1 = 7 + 1 - 4 = 4$，$2 \\ast \\frac{9}{2} = \\frac{9}{3} = 3$，都是单位元。\n\n> **注意。** 要让结果等于这个运算的单位元，而不是 $0$ 或 $1$：$7 + x - 4 = 0$ 给出 $x = -3$，但 $7 \\ast (-3) = 0$ 不是单位元 $4$。",
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
          mistakes: apart(
            inv,
            s.kind === "add"
              ? [
                  why(
                    -a,
                    "This is the inverse under ordinary addition; this operation has a different identity.",
                    "这是普通加法下的逆元；这个运算的单位元不同。",
                  ),
                  why(
                    -a - s.c,
                    `This solves $${a} + x ${signed(s.c)} = 0$; the right side must be the identity $${e}$.`,
                    `这解的是 $${a} + x ${signed(s.c)} = 0$；右边应为单位元 $${e}$。`,
                  ),
                  why(a - 2 * s.c, `This loses the sign of $${a}$ when moving it across.`, `这在移项时弄错了 $${a}$ 的符号。`),
                ]
              : [
                  why(
                    Q.of(1, a),
                    "This is the inverse under ordinary multiplication; this operation has a different identity.",
                    "这是普通乘法下的逆元；这个运算的单位元不同。",
                  ),
                  why(
                    Q.of(s.c, a),
                    `This solves $${a} \\ast x = 1$; the right side must be the identity $${e}$.`,
                    `这解的是 $${a} \\ast x = 1$；右边应为单位元 $${e}$。`,
                  ),
                  why(Q.of(a, s.c * s.c), "This turns the fraction upside down.", "这把分数颠倒了。"),
                ],
          ),
          solution: walked(
            [
              [["Find the identity", "求单位元"], t(`The identity of this operation is $${e}$.`, `这个运算的单位元为 $${e}$。`)],
              [
                ["Solve for the inverse", "解出逆元"],
                s.kind === "add"
                  ? t(
                      `$${a} + x ${signed(s.c)} = ${e}$ gives $x = ${inv.toLatex()}$.`,
                      `由 $${a} + x ${signed(s.c)} = ${e}$ 得 $x = ${inv.toLatex()}$。`,
                    )
                  : (() => {
                      const ax = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
                      const mid = a === 1 ? "" : ` = \\frac{${s.c * s.c}}{${a}}`;
                      return t(
                        `$\\frac{${ax}}{${s.c}} = ${e}$ gives $x${mid} = ${inv.toLatex()}$.`,
                        `由 $\\frac{${ax}}{${s.c}} = ${e}$ 得 $x${mid} = ${inv.toLatex()}$。`,
                      );
                    })(),
              ],
            ],
            s.kind === "add"
              ? t(
                  `$${a} \\ast ${par(inv.toNumber())} = ${a} + ${par(inv.toNumber())} ${signed(s.c)} = ${e}$, the identity.`,
                  `$${a} \\ast ${par(inv.toNumber())} = ${a} + ${par(inv.toNumber())} ${signed(s.c)} = ${e}$，正是单位元。`,
                )
              : t(
                  `$${a} \\cdot ${parQ(inv)} = ${s.c * s.c}$, and $\\frac{${s.c * s.c}}{${s.c}} = ${e}$, the identity.`,
                  `$${a} \\cdot ${parQ(inv)} = ${s.c * s.c}$，而 $\\frac{${s.c * s.c}}{${s.c}} = ${e}$，正是单位元。`,
                ),
          ),
        });
      },
    },
    {
      id: "inverses-from-tables",
      title: t("Inverses from tables", "由运算表求逆元"),
      explanation: t(
        "First find the identity $e$. Then in the row of $x$, find the column where $e$ appears: that column's element is $x^{-1}$.\n\nIf the identity is $p$ and row $r$ reads $r, p, q$ under the headings $p, q, r$, then $p$ sits in column $q$, so $r \\ast q = p$ and $r^{-1} = q$.\n\nCheck: in row $q$, the entry under column $r$ must also be $p$, since $q \\ast r = p$ as well.\n\n> **Watch out.** The answer is the heading of the column where $e$ appears, not the entry itself, and not the element whose row you are reading.",
        "先找出单位元 $e$。再在 $x$ 所在的行中找到 $e$ 出现的那一列：该列对应的元素就是 $x^{-1}$。\n\n若单位元为 $p$，在列标题 $p, q, r$ 下第 $r$ 行为 $r, p, q$，则 $p$ 位于第 $q$ 列，所以 $r \\ast q = p$，$r^{-1} = q$。\n\n检验：第 $q$ 行中第 $r$ 列的元素也必须是 $p$，因为同样有 $q \\ast r = p$。\n\n> **注意。** 答案是 $e$ 所在列的列标题，不是表中的元素本身，也不是你正在读的那一行的元素。",
      ),
      generate(rng) {
        const g = randomGroupTable(rng);
        const order = rng.shuffle(range(0, g.size - 1));
        const x = rng.pick(range(0, g.size - 1).filter((a) => a !== g.identity));
        const inv = inverseOf(g, x);
        const L = g.labels;
        const e = L[g.identity]!;
        const reasons = range(0, g.size - 1)
          .filter((w) => w !== inv)
          .map(
            (w) =>
              [
                `$${L[w]}$`,
                w === g.identity
                  ? `$${e}$ is the identity itself: $${L[x]} \\ast ${e} = ${L[x]}$, not $${e}$.`
                  : `$${L[x]} \\ast ${L[w]} = ${L[g.op(x, w)]}$, not the identity $${e}$.`,
                w === g.identity
                  ? `$${e}$ 是单位元本身：$${L[x]} \\ast ${e} = ${L[x]}$，而不是 $${e}$。`
                  : `$${L[x]} \\ast ${L[w]} = ${L[g.op(x, w)]}$，不是单位元 $${e}$。`,
              ] as const,
          );
        return reasoned(
          texChoice(
            rng,
            t(
              `An operation $\\ast$ has the table $${cayleyTex(g, order)}$. Find the inverse of $${L[x]}$.`,
              `运算 $\\ast$ 的运算表为 $${cayleyTex(g, order)}$。求 $${L[x]}$ 的逆元。`,
            ),
            L[inv]!,
            rng.shuffle(L.filter((_, i) => i !== inv)),
            walked(
              [
                [
                  ["Find the identity", "求单位元"],
                  t(`Row $${e}$ copies the column headings, so the identity is $${e}$.`, `第 $${e}$ 行与列标题相同，所以单位元为 $${e}$。`),
                ],
                [
                  ["Find the identity in the row", "在该行中找单位元"],
                  t(
                    `In row $${L[x]}$, the entry $${e}$ stands in column $${L[inv]}$, so $${L[x]} \\ast ${L[inv]} = ${e}$.`,
                    `在第 $${L[x]}$ 行中，元素 $${e}$ 位于第 $${L[inv]}$ 列，所以 $${L[x]} \\ast ${L[inv]} = ${e}$。`,
                  ),
                ],
              ],
              t(
                `Row $${L[inv]}$ has $${e}$ in column $${L[x]}$ too, so $${L[inv]} \\ast ${L[x]} = ${e}$ and $${L[x]}^{-1} = ${L[inv]}$.`,
                `第 $${L[inv]}$ 行的第 $${L[x]}$ 列也是 $${e}$，所以 $${L[inv]} \\ast ${L[x]} = ${e}$，$${L[x]}^{-1} = ${L[inv]}$。`,
              ),
            ),
          ),
          reasons,
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
  intro: t(
    "Take $\\mathbb{Z}$ under $a \\ast b = a + b + 1$. It is closed; it is associative, since both bracketings of $a \\ast b \\ast c$ give $a + b + c + 2$; the identity is $-1$, since $a + (-1) + 1 = a$; and the inverse of $a$ is $-a - 2$, since $a + (-a - 2) + 1 = -1$. So it is a group.\n\nCheck: the inverse of $3$ is $-5$, and $3 \\ast (-5) = 3 - 5 + 1 = -1$, the identity.\n\nIn this lesson we check the group axioms in order and solve equations $a \\ast x = b$ in groups.",
    "取 $\\mathbb{Z}$ 在 $a \\ast b = a + b + 1$ 下。它封闭；它满足结合律，因为 $a \\ast b \\ast c$ 的两种加括号方式都得 $a + b + c + 2$；单位元为 $-1$，因为 $a + (-1) + 1 = a$；$a$ 的逆元为 $-a - 2$，因为 $a + (-a - 2) + 1 = -1$。所以它是群。\n\n检验：$3$ 的逆元为 $-5$，而 $3 \\ast (-5) = 3 - 5 + 1 = -1$，正是单位元。\n\n本课我们依次检验群公理，并在群中解方程 $a \\ast x = b$。",
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
        "Check closure, associativity, identity and inverses in that order, and stop at the first that fails.\n\n$(2\\mathbb{Z}, \\cdot)$ is closed and associative but has no identity, since $1 \\notin 2\\mathbb{Z}$. $(\\mathbb{Z}_{\\ge 0}, +)$ has identity $0$ but $1$ has no inverse, since $-1 \\notin \\mathbb{Z}_{\\ge 0}$.\n\nCheck: one concrete counterexample settles a failure. In $2\\mathbb{Z}$, $e \\cdot 2 = 2$ forces $e = 1$, which is odd; in $\\mathbb{Z}_{\\ge 0}$, $1 + x = 0$ forces $x = -1$.\n\n> **Watch out.** An identity must lie in the set itself. The number $1$ works for multiplication of integers, but it is no use for $2\\mathbb{Z}$, because $1$ is not even.",
        "依次检验封闭性、结合律、单位元与逆元，遇到第一个不满足的就停下。\n\n$(2\\mathbb{Z}, \\cdot)$ 封闭且可结合，但没有单位元，因为 $1 \\notin 2\\mathbb{Z}$。$(\\mathbb{Z}_{\\ge 0}, +)$ 有单位元 $0$，但 $1$ 没有逆元，因为 $-1 \\notin \\mathbb{Z}_{\\ge 0}$。\n\n检验：一个具体的反例就能说明不满足。在 $2\\mathbb{Z}$ 中，$e \\cdot 2 = 2$ 迫使 $e = 1$，而它是奇数；在 $\\mathbb{Z}_{\\ge 0}$ 中，$1 + x = 0$ 迫使 $x = -1$。\n\n> **注意。** 单位元必须在集合之中。数 $1$ 对整数乘法是单位元，但对 $2\\mathbb{Z}$ 没有用，因为 $1$ 不是偶数。",
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
        const reasons = range(0, 4)
          .filter((i) => i !== c.fails)
          .map((i) => {
            const opt = AXIOMS[i]!;
            if (i === 4) {
              const f = AXIOMS[c.fails]!;
              return [opt.en, `${f.en} fails, so this is not a group.`, `${f["zh-CN"]}不满足，所以它不是群。`] as const;
            }
            if (i < c.fails) {
              return [
                opt.en,
                `${opt.en} holds here; the first failure comes later in the list.`,
                `这里${opt["zh-CN"]}成立；第一个不满足的公理在后面。`,
              ] as const;
            }
            return c.fails === 4
              ? ([opt.en, `${opt.en} holds here too: every axiom holds.`, `这里${opt["zh-CN"]}也成立：每条公理都满足。`] as const)
              : ([
                  opt.en,
                  `An earlier axiom, ${AXIOMS[c.fails]!.en.toLowerCase()}, already fails.`,
                  `更早的公理${AXIOMS[c.fails]!["zh-CN"]}已经不满足。`,
                ] as const);
          });
        return reasoned(
          textChoice(
            rng,
            t(
              `Which group axiom, checked in the order closure, associativity, identity, inverses, is the first to fail for $${c.tex}$?`,
              `按封闭性、结合律、单位元、逆元的顺序检验，$${c.tex}$ 第一个不满足的群公理是哪一个？`,
            ),
            [AXIOMS[c.fails]!, ...AXIOMS.filter((_, i) => i !== c.fails)],
            walked(
              [
                [
                  ["Check the axioms in order", "依次检验公理"],
                  c.fails === 4
                    ? t("Closure, associativity, identity and inverses all hold.", "封闭性、结合律、单位元与逆元都成立。")
                    : c.fails === 0
                      ? t("Closure is the first axiom, and it fails.", "封闭性是第一条公理，它就不满足。")
                      : t(
                          `${AXIOMS.slice(0, c.fails)
                            .map((a) => a.en)
                            .join(", ")} hold, and ${AXIOMS[c.fails]!.en.toLowerCase()} is next.`,
                          `${AXIOMS.slice(0, c.fails)
                            .map((a) => a["zh-CN"])
                            .join("、")}成立，接下来是${AXIOMS[c.fails]!["zh-CN"]}。`,
                        ),
                ],
                [["Give the reason", "说明理由"], c.reason],
              ],
              c.fails === 4
                ? t("No axiom fails, so the set is a group under this operation.", "没有公理不满足，所以该集合在这个运算下构成群。")
                : t(`One failing axiom is enough: $${c.tex}$ is not a group.`, `只要有一条公理不满足就够了：$${c.tex}$ 不是群。`),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "solving-equations-in-groups",
      title: t("Solving equations", "解方程"),
      explanation: t(
        "In a group, $a \\ast x = b$ has the unique solution $x = a^{-1} \\ast b$, found by applying $a^{-1}$ on the left of both sides.\n\nIn $(\\mathbb{Z}, \\ast)$ with $a \\ast b = a + b - 3$, the identity is $3$, the inverse of $5$ is $1$, and $5 \\ast x = 9$ gives $x = 1 \\ast 9 = 1 + 9 - 3 = 7$. Writing out the formula gives the same: $5 + x - 3 = 9$, so $x = 7$.\n\nCheck: $5 \\ast 7 = 5 + 7 - 3 = 9$.\n\n> **Watch out.** Do not solve $a + x = b$ and forget the constant of the operation: here that gives $x = 4$, but $5 \\ast 4 = 6$, not $9$.",
        "在群中，$a \\ast x = b$ 有唯一解 $x = a^{-1} \\ast b$，在等式两边左侧同时作用 $a^{-1}$ 即得。\n\n在 $a \\ast b = a + b - 3$ 的 $(\\mathbb{Z}, \\ast)$ 中，单位元为 $3$，$5$ 的逆元为 $1$，由 $5 \\ast x = 9$ 得 $x = 1 \\ast 9 = 1 + 9 - 3 = 7$。直接写出公式结果相同：$5 + x - 3 = 9$，所以 $x = 7$。\n\n检验：$5 \\ast 7 = 5 + 7 - 3 = 9$。\n\n> **注意。** 不要只解 $a + x = b$ 而忘掉运算中的常数：这里那样会得到 $x = 4$，但 $5 \\ast 4 = 6$，不是 $9$。",
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
          mistakes: apart(Q.of(x), [
            why(b - a, `This drops the constant $${c}$ of the operation.`, `这丢掉了运算中的常数 $${c}$。`),
            why(b - a + c, `This moves $${c}$ across without changing its sign.`, `这把 $${c}$ 移项时没有变号。`),
            why(b + a - c, `This moves $${a}$ across without changing its sign.`, `这把 $${a}$ 移项时没有变号。`),
          ]),
          solveFor: "x",
          solution: walked(
            [
              [
                ["Write out the operation", "写出运算"],
                t(
                  `$${a} \\ast x = ${a} + x ${signed(c)} = ${b}$, so $x = ${b} - ${par(a)} - ${par(c)} = ${x}$.`,
                  `$${a} \\ast x = ${a} + x ${signed(c)} = ${b}$，所以 $x = ${b} - ${par(a)} - ${par(c)} = ${x}$。`,
                ),
              ],
            ],
            t(
              `$${a} \\ast ${par(x)} = ${a} + ${par(x)} ${signed(c)} = ${b}$.`,
              `$${a} \\ast ${par(x)} = ${a} + ${par(x)} ${signed(c)} = ${b}$。`,
            ),
          ),
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
  intro: t(
    "$\\mathbb{Q}^*$, the nonzero rationals, is a group under multiplication: a product of nonzero rationals is a nonzero rational, $1$ is the identity, and $\\frac{2}{3}$ has inverse $\\frac{3}{2}$. The nonzero integers are not a group under multiplication, since $2$ has no integer inverse.\n\nCheck: $\\frac{2}{3} \\cdot \\frac{3}{2} = 1$, while $2x = 1$ forces $x = \\frac{1}{2}$, which is not an integer.\n\nIn this lesson we decide which sets of numbers are groups and find inverses of complex numbers.",
    "非零有理数 $\\mathbb{Q}^*$ 在乘法下构成群：非零有理数之积仍是非零有理数，$1$ 是单位元，$\\frac{2}{3}$ 的逆元为 $\\frac{3}{2}$。非零整数在乘法下不构成群，因为 $2$ 没有整数逆元。\n\n检验：$\\frac{2}{3} \\cdot \\frac{3}{2} = 1$，而 $2x = 1$ 迫使 $x = \\frac{1}{2}$，它不是整数。\n\n本课我们判断哪些数集构成群，并求复数的逆元。",
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
        "To decide whether a set of numbers is a group, check that sums or products stay in the set, that the identity ($0$ or $1$) is in it, and that each inverse ($-x$ or $\\frac{1}{x}$) is in it.\n\n$\\{2^n : n \\in \\mathbb{Z}\\}$ is a group under multiplication: $2^m 2^n = 2^{m+n}$, the identity is $2^0 = 1$, and $2^{-n}$ inverts $2^n$. With $n \\ge 0$ only, $2$ would have no inverse. The negative reals are not closed under multiplication.\n\nCheck: $2^3 \\cdot 2^{-3} = 2^0 = 1$, while $(-2)(-3) = 6$ is not negative.\n\n> **Watch out.** Associativity comes free from ordinary addition and multiplication, so the failures to look for are closure, a missing identity and a missing inverse.",
        "判断一个数集是否构成群，要检验和或积仍在集合中、单位元（$0$ 或 $1$）在集合中、每个逆元（$-x$ 或 $\\frac{1}{x}$）也在集合中。\n\n$\\{2^n : n \\in \\mathbb{Z}\\}$ 对乘法构成群：$2^m 2^n = 2^{m+n}$，单位元为 $2^0 = 1$，$2^{-n}$ 是 $2^n$ 的逆元。若只取 $n \\ge 0$，则 $2$ 没有逆元。负实数对乘法不封闭。\n\n检验：$2^3 \\cdot 2^{-3} = 2^0 = 1$，而 $(-2)(-3) = 6$ 不是负数。\n\n> **注意。** 普通加法与乘法本身满足结合律，所以要找的不满足之处是封闭性、缺少单位元和缺少逆元。",
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
        "Multiplying a complex number by its conjugate gives a positive real number, so dividing the conjugate by that number gives the inverse. In $(\\mathbb{C}^*, \\cdot)$ the inverse of $z = a + bi$ is $z^{-1} = \\frac{\\bar z}{|z|^2} = \\frac{a - bi}{a^2 + b^2}$.\n\nFor $z = 3 + 4i$, $|z|^2 = 9 + 16 = 25$, so $z^{-1} = \\frac{3}{25} - \\frac{4}{25}i$: real part $\\frac{3}{25}$, imaginary part $-\\frac{4}{25}$.\n\nCheck: $(3 + 4i)(3 - 4i) = 9 + 16 = 25$, and dividing by $25$ gives $1$.\n\n> **Watch out.** Divide by $a^2 + b^2$, not by $|z| = \\sqrt{a^2 + b^2}$, and remember that the imaginary part changes sign.",
        "复数乘以它的共轭得到一个正实数，所以把共轭除以这个数就得到逆元。在 $(\\mathbb{C}^*, \\cdot)$ 中，$z = a + bi$ 的逆元为 $z^{-1} = \\frac{\\bar z}{|z|^2} = \\frac{a - bi}{a^2 + b^2}$。\n\n对 $z = 3 + 4i$，$|z|^2 = 9 + 16 = 25$，所以 $z^{-1} = \\frac{3}{25} - \\frac{4}{25}i$：实部为 $\\frac{3}{25}$，虚部为 $-\\frac{4}{25}$。\n\n检验：$(3 + 4i)(3 - 4i) = 9 + 16 = 25$，再除以 $25$ 得 $1$。\n\n> **注意。** 要除以 $a^2 + b^2$，而不是 $|z| = \\sqrt{a^2 + b^2}$；还要记住虚部变号。",
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
          mistakes: apart(
            value,
            real
              ? [
                  why(
                    Q.of(1, a),
                    `This inverts the real part alone; the whole number $z$ must be inverted.`,
                    `这只把实部取倒数；要对整个 $z$ 求逆。`,
                  ),
                  why(
                    Q.of(-a, n),
                    "This changes the sign of the real part; only the imaginary part changes sign.",
                    "这把实部变了号；只有虚部变号。",
                  ),
                  why(Q.of(a), `This forgets to divide by $|z|^2 = ${n}$.`, `这忘了除以 $|z|^2 = ${n}$。`),
                ]
              : [
                  why(
                    Q.of(-1, b),
                    "This inverts the imaginary part alone; the whole number $z$ must be inverted.",
                    "这只把虚部取倒数；要对整个 $z$ 求逆。",
                  ),
                  why(
                    Q.of(b, n),
                    "This keeps the sign of the imaginary part; the conjugate changes it.",
                    "这保留了虚部的符号；共轭会改变它。",
                  ),
                  why(Q.of(-b), `This forgets to divide by $|z|^2 = ${n}$.`, `这忘了除以 $|z|^2 = ${n}$。`),
                ],
          ),
          solution: walked(
            [
              [["Find $|z|^2$", "求 $|z|^2$"], t(`$|z|^2 = ${a * a} + ${b * b} = ${n}$.`, `$|z|^2 = ${a * a} + ${b * b} = ${n}$。`)],
              [
                ["Divide the conjugate", "共轭除以 $|z|^2$"],
                t(
                  `$z^{-1} = \\frac{${a} ${b < 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i}{${n}}$, whose ${real ? "real" : "imaginary"} part is $${value.toLatex()}$.`,
                  `$z^{-1} = \\frac{${a} ${b < 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i}{${n}}$，其${real ? "实部" : "虚部"}为 $${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$(${z})(${a} ${b < 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i) = ${a * a} + ${b * b} = ${n}$, and $\\frac{${n}}{${n}} = 1$.`,
              `$(${z})(${a} ${b < 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i) = ${a * a} + ${b * b} = ${n}$，而 $\\frac{${n}}{${n}} = 1$。`,
            ),
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
  intro: t(
    "$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ has $\\det A = 2 - 1 = 1$, so it lies in $SL(2, \\mathbb{Z})$, and swapping the diagonal and negating the other entries gives $A^{-1} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$, again in $SL(2, \\mathbb{Z})$.\n\nCheck: $AA^{-1} = \\begin{pmatrix} 2 - 1 & -2 + 2 \\\\ 1 - 1 & -1 + 2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$.\n\nIn this lesson we invert matrices in $SL(2, \\mathbb{Z})$ and decide which sets of matrices are groups.",
    "$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ 的行列式为 $2 - 1 = 1$，所以它属于 $SL(2, \\mathbb{Z})$；交换主对角线、把另两个元素变号得 $A^{-1} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$，它也属于 $SL(2, \\mathbb{Z})$。\n\n检验：$AA^{-1} = \\begin{pmatrix} 2 - 1 & -2 + 2 \\\\ 1 - 1 & -1 + 2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$。\n\n本课我们求 $SL(2, \\mathbb{Z})$ 中矩阵的逆，并判断哪些矩阵集合构成群。",
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
        "If $\\det A = ad - bc = 1$, then $A^{-1} = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$, which again has integer entries and determinant $1$. So the integer matrices of determinant $1$ form a group, $SL(2, \\mathbb{Z})$.\n\nFor $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & 2 \\end{pmatrix}$, $\\det A = 4 - 3 = 1$, so swap the diagonal and negate the other two entries: $A^{-1} = \\begin{pmatrix} 2 & -3 \\\\ -1 & 2 \\end{pmatrix}$.\n\nCheck: the top-left entry of $AA^{-1}$ is $2 \\cdot 2 + 3 \\cdot (-1) = 1$ and the top-right is $2 \\cdot (-3) + 3 \\cdot 2 = 0$.\n\n> **Watch out.** Swap the two diagonal entries but only negate the off-diagonal ones; do not swap those.",
        "若 $\\det A = ad - bc = 1$，则 $A^{-1} = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$，它的元素仍是整数且行列式为 $1$。所以行列式为 $1$ 的整数矩阵构成群 $SL(2, \\mathbb{Z})$。\n\n对 $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & 2 \\end{pmatrix}$，$\\det A = 4 - 3 = 1$，所以交换主对角线元素、把另两个元素变号：$A^{-1} = \\begin{pmatrix} 2 & -3 \\\\ -1 & 2 \\end{pmatrix}$。\n\n检验：$AA^{-1}$ 的左上元素为 $2 \\cdot 2 + 3 \\cdot (-1) = 1$，右上元素为 $2 \\cdot (-3) + 3 \\cdot 2 = 0$。\n\n> **注意。** 主对角线的两个元素要交换，另两个元素只变号，不交换。",
      ),
      generate(rng) {
        for (;;) {
          const a: Mat2 = mul2(mul2([1, rng.int(-3, 3), 0, 1], [1, 0, rng.int(-3, 3), 1]), [1, rng.int(-2, 2), 0, 1]);
          if (a.every((x, i) => x === [1, 0, 0, 1][i])) continue;
          const inv: Mat2 = [a[3], 0 - a[1], 0 - a[2], a[0]];
          const i = rng.int(0, 3);
          const diagonal = i === 0 || i === 3;
          const mistakes = apart(
            Q.of(inv[i]!),
            diagonal
              ? [
                  why(
                    a[i]!,
                    "This keeps the entry of $A$ in that place; the diagonal entries swap.",
                    "这保留了 $A$ 在该位置的元素；主对角线元素要交换。",
                  ),
                  why(
                    -inv[i]!,
                    "This negates a diagonal entry; diagonal entries are swapped, not negated.",
                    "这把主对角线元素变了号；主对角线元素只交换，不变号。",
                  ),
                  why(
                    -a[i]!,
                    "This negates the entry in place instead of swapping the diagonal.",
                    "这把该位置的元素变号，而不是交换主对角线。",
                  ),
                ]
              : [
                  why(a[i]!, "This forgets to negate the off-diagonal entry.", "这忘了把非对角线元素变号。"),
                  why(
                    -a[3 - i]!,
                    "This also swaps the two off-diagonal entries; they stay in place.",
                    "这把两个非对角线元素也交换了；它们应留在原位。",
                  ),
                  why(a[3 - i]!, "This swaps the off-diagonal entries and forgets to negate.", "这交换了非对角线元素，还忘了变号。"),
                ],
          );
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `$A = ${mat2Tex(a)}$ lies in $SL(2, \\mathbb{Z})$. Find the ${ENTRY_NAMES[i]!.en} entry of $A^{-1}$.`,
              `$A = ${mat2Tex(a)}$ 属于 $SL(2, \\mathbb{Z})$。求 $A^{-1}$ 的${ENTRY_NAMES[i]!["zh-CN"]}元素。`,
            ),
            answer: inv[i]!,
            mistakes,
            solution: walked(
              [
                [
                  ["Check the determinant", "检验行列式"],
                  t(
                    `$\\det A = ${par(a[0])} \\cdot ${par(a[3])} - ${par(a[1])} \\cdot ${par(a[2])} = 1$.`,
                    `$\\det A = ${par(a[0])} \\cdot ${par(a[3])} - ${par(a[1])} \\cdot ${par(a[2])} = 1$。`,
                  ),
                ],
                [
                  ["Swap and negate", "交换并变号"],
                  t(
                    `Swap the diagonal and negate the other entries: $A^{-1} = ${mat2Tex(inv)}$, whose ${ENTRY_NAMES[i]!.en} entry is $${inv[i]}$.`,
                    `交换主对角线并把另两个元素变号：$A^{-1} = ${mat2Tex(inv)}$，其${ENTRY_NAMES[i]!["zh-CN"]}元素为 $${inv[i]}$。`,
                  ),
                ],
              ],
              t(
                `$${mat2Tex(a)}${mat2Tex(inv)} = ${mat2Tex(mul2(a, inv))}$, the identity matrix.`,
                `$${mat2Tex(a)}${mat2Tex(inv)} = ${mat2Tex(mul2(a, inv))}$，正是单位矩阵。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "groups-of-matrices",
      title: t("Which sets are groups", "哪些集合是群"),
      explanation: t(
        "Use $\\det(AB) = \\det A \\det B$ and $\\det(A^{-1}) = \\frac{1}{\\det A}$ to test closure and inverses, and check that $I$ is in the set.\n\nThe matrices of determinant $2$ are not closed: the product of two has determinant $2 \\cdot 2 = 4$. The matrices of determinant $\\pm 1$ are a group: products have determinant $\\pm 1$, inverses have determinant $\\frac{1}{\\pm 1} = \\pm 1$, and $\\det I = 1$.\n\nCheck: $\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$ has determinant $2$, and its square $\\begin{pmatrix} 4 & 0 \\\\ 0 & 1 \\end{pmatrix}$ has determinant $4$.\n\n> **Watch out.** A set of matrices under multiplication needs every member to be invertible; any set containing a matrix of determinant $0$ fails at once.",
        "利用 $\\det(AB) = \\det A \\det B$ 与 $\\det(A^{-1}) = \\frac{1}{\\det A}$ 检验封闭性与逆元，并检验 $I$ 在集合中。\n\n行列式为 $2$ 的矩阵不封闭：两个这样的矩阵之积的行列式为 $2 \\cdot 2 = 4$。行列式为 $\\pm 1$ 的矩阵构成群：乘积的行列式为 $\\pm 1$，逆的行列式为 $\\frac{1}{\\pm 1} = \\pm 1$，且 $\\det I = 1$。\n\n检验：$\\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$ 的行列式为 $2$，它的平方 $\\begin{pmatrix} 4 & 0 \\\\ 0 & 1 \\end{pmatrix}$ 的行列式为 $4$。\n\n> **注意。** 矩阵集合在乘法下构成群，要求每个元素都可逆；只要集合中含有行列式为 $0$ 的矩阵就立刻不满足。",
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
  intro: t(
    "With $f(x) = \\frac{1}{x}$ and $g(x) = 1 - x$, $(f \\circ g)(x) = f(1 - x) = \\frac{1}{1 - x}$, which is again one of the six functions $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$. Among the affine maps, $f(x) = 3x + 1$ has inverse $f^{-1}(x) = \\frac{x - 1}{3}$.\n\nCheck: $f^{-1}(7) = \\frac{6}{3} = 2$ and $f(2) = 7$, so $f^{-1}$ undoes $f$.\n\nIn this lesson we compose functions in a group of functions and invert affine maps.",
    "取 $f(x) = \\frac{1}{x}$、$g(x) = 1 - x$，则 $(f \\circ g)(x) = f(1 - x) = \\frac{1}{1 - x}$，它仍是六个函数 $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ 之一。在仿射映射中，$f(x) = 3x + 1$ 的逆为 $f^{-1}(x) = \\frac{x - 1}{3}$。\n\n检验：$f^{-1}(7) = \\frac{6}{3} = 2$，$f(2) = 7$，所以 $f^{-1}$ 撤销了 $f$。\n\n本课我们在函数群中复合函数，并求仿射映射的逆。",
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
        "In a group of functions the operation is composition, so the product of two elements is one function applied to the output of the other. Substitute the inner function into the outer one and simplify.\n\nIf $f(x) = \\frac{1}{x}$ and $g(x) = 1 - x$, then $(f \\circ g)(x) = f(1 - x) = \\frac{1}{1 - x}$ and $(g \\circ f)(x) = 1 - \\frac{1}{x} = \\frac{x - 1}{x}$.\n\nCheck: at $x = 3$, $g(3) = -2$ and $f(-2) = -\\frac{1}{2}$, which matches $\\frac{1}{1 - 3} = -\\frac{1}{2}$.\n\n> **Watch out.** $f \\circ g$ applies $g$ first. The two orders usually differ: here $\\frac{1}{1 - x}$ and $\\frac{x - 1}{x}$ are different functions.",
        "在函数群中运算是复合，所以两个元素的乘积就是把一个函数作用在另一个函数的输出上。把内层函数代入外层函数并化简。\n\n若 $f(x) = \\frac{1}{x}$、$g(x) = 1 - x$，则 $(f \\circ g)(x) = f(1 - x) = \\frac{1}{1 - x}$，$(g \\circ f)(x) = 1 - \\frac{1}{x} = \\frac{x - 1}{x}$。\n\n检验：在 $x = 3$ 处，$g(3) = -2$，$f(-2) = -\\frac{1}{2}$，与 $\\frac{1}{1 - 3} = -\\frac{1}{2}$ 一致。\n\n> **注意。** $f \\circ g$ 先作用 $g$。两种顺序通常不同：这里 $\\frac{1}{1 - x}$ 与 $\\frac{x - 1}{x}$ 是不同的函数。",
      ),
      generate(rng) {
        const f = rng.pick(ANHARMONIC);
        const g = rng.pick(ANHARMONIC);
        const fg = mul2(f.m, g.m);
        const right = ANHARMONIC.find((h) => sameMobius(h.m, fg))!;
        const gf = ANHARMONIC.find((h) => sameMobius(h.m, mul2(g.m, f.m)))!;
        const at3 = (h: Mobius) => Q.of(3 * h.m[0] + h.m[1], 3 * h.m[2] + h.m[3]).toLatex();
        const reasons = ANHARMONIC.filter((h) => h !== right).map(
          (h) =>
            [
              `$${h.tex}$`,
              h === gf
                ? `This is $g \\circ f$, which applies $f$ first; $f \\circ g$ applies $g$ first.`
                : `At $x = 3$ this function gives $${at3(h)}$, but $f(g(3)) = ${at3(right)}$.`,
              h === gf
                ? `这是 $g \\circ f$，它先作用 $f$；$f \\circ g$ 先作用 $g$。`
                : `在 $x = 3$ 处这个函数的值为 $${at3(h)}$，而 $f(g(3)) = ${at3(right)}$。`,
            ] as const,
        );
        return reasoned(
          texChoice(
            rng,
            t(
              `The six functions $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ form a group under composition. If $f(x) = ${f.tex}$ and $g(x) = ${g.tex}$, what is $(f \\circ g)(x)$?`,
              `六个函数 $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ 在复合下构成群。若 $f(x) = ${f.tex}$、$g(x) = ${g.tex}$，则 $(f \\circ g)(x)$ 是什么？`,
            ),
            right.tex,
            [gf.tex, ...rng.shuffle(ANHARMONIC.map((h) => h.tex))],
            walked(
              [
                [
                  ["Substitute the inner function", "代入内层函数"],
                  t(
                    `$(f \\circ g)(x) = f(g(x))$; substituting $g(x) = ${g.tex}$ into $f$ and simplifying gives $${right.tex}$.`,
                    `$(f \\circ g)(x) = f(g(x))$；把 $g(x) = ${g.tex}$ 代入 $f$ 并化简得 $${right.tex}$。`,
                  ),
                ],
              ],
              t(
                `At $x = 3$: $g(3) = ${at3(g)}$ and $f$ of that is $${at3(right)}$, the value of $${right.tex}$ at $3$.`,
                `在 $x = 3$ 处：$g(3) = ${at3(g)}$，再作用 $f$ 得 $${at3(right)}$，正是 $${right.tex}$ 在 $3$ 处的值。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "inverses-in-the-affine-group",
      title: t("Inverses of affine maps", "仿射映射的逆"),
      explanation: t(
        "The inverse of an affine map undoes it by first removing the shift and then dividing by the scale, and it is again an affine map. In the group of maps $x \\mapsto ax + b$, the inverse of $f(x) = ax + b$ is $f^{-1}(x) = \\frac{x - b}{a}$, and $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$.\n\nFor $f(x) = 2x + 1$ and $g(x) = x - 3$, $(f \\circ g)^{-1}(5) = g^{-1}(f^{-1}(5))$. First $f^{-1}(5) = \\frac{5 - 1}{2} = 2$, then $g^{-1}(2) = 2 + 3 = 5$.\n\nCheck: $(f \\circ g)(5) = f(5 - 3) = f(2) = 5$, so $5$ is sent back to $5$.\n\n> **Watch out.** Undo the maps in the reverse order: $f$ was applied last, so $f^{-1}$ comes first.",
        "仿射映射的逆先去掉平移再除以缩放比，从而撤销原映射，它仍然是一个仿射映射。在映射 $x \\mapsto ax + b$ 构成的群中，$f(x) = ax + b$ 的逆为 $f^{-1}(x) = \\frac{x - b}{a}$，且 $(f \\circ g)^{-1} = g^{-1} \\circ f^{-1}$。\n\n若 $f(x) = 2x + 1$、$g(x) = x - 3$，则 $(f \\circ g)^{-1}(5) = g^{-1}(f^{-1}(5))$。先算 $f^{-1}(5) = \\frac{5 - 1}{2} = 2$，再算 $g^{-1}(2) = 2 + 3 = 5$。\n\n检验：$(f \\circ g)(5) = f(5 - 3) = f(2) = 5$，所以 $5$ 被送回 $5$。\n\n> **注意。** 要按相反的顺序撤销：$f$ 是最后作用的，所以先用 $f^{-1}$。",
      ),
      generate(rng) {
        for (;;) {
          const [a, b, c, d] = [rng.nonZero(-4, 4), rng.int(-6, 6), rng.nonZero(-4, 4), rng.int(-6, 6)];
          const k = rng.int(-9, 9);
          const finv = Q.of(k - b, a);
          const value = finv.sub(Q.of(d)).div(Q.of(c));
          const wrongOrder = Q.of(k - d, c)
            .sub(Q.of(b))
            .div(Q.of(a));
          const mistakes = apart(value, [
            why(
              wrongOrder,
              "This undoes $g$ first; the inverse of $f \\circ g$ undoes $f$ first.",
              "这先撤销了 $g$；$f \\circ g$ 的逆要先撤销 $f$。",
            ),
            why(
              Q.of(a * (c * k + d) + b),
              `This evaluates $(f \\circ g)(${k})$ instead of its inverse.`,
              `这算的是 $(f \\circ g)(${k})$，而不是它的逆。`,
            ),
            why(finv, "This stops after $f^{-1}$ and never applies $g^{-1}$.", "这在 $f^{-1}$ 之后就停了，没有再作用 $g^{-1}$。"),
          ]);
          if (mistakes.length < 2) continue;
          /** undo writes (x - shift) / scale for the inverse of scale x + shift. */
          const undo = (x: string, scale: number, shift: number) => {
            const top = shift === 0 ? x : `${x} ${signed(-shift)}`;
            return scale === 1 ? top : scale === -1 ? `-(${top})` : `\\frac{${top}}{${scale}}`;
          };
          return numberProblem({
            prompt: t(
              `In the group of functions $x \\mapsto ax + b$ ($a \\ne 0$) under composition, let $f(x) = ${affineTex(a, b)}$ and $g(x) = ${affineTex(c, d)}$. Find $(f \\circ g)^{-1}(${k})$.`,
              `在复合运算下的函数群 $x \\mapsto ax + b$（$a \\ne 0$）中，设 $f(x) = ${affineTex(a, b)}$、$g(x) = ${affineTex(c, d)}$。求 $(f \\circ g)^{-1}(${k})$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Undo $f$ first", "先撤销 $f$"],
                  t(
                    `$(f \\circ g)^{-1}(${k}) = g^{-1}(f^{-1}(${k}))$, and $f^{-1}(${k}) = ${undo(`${k}`, a, b)} = ${finv.toLatex()}$.`,
                    `$(f \\circ g)^{-1}(${k}) = g^{-1}(f^{-1}(${k}))$，而 $f^{-1}(${k}) = ${undo(`${k}`, a, b)} = ${finv.toLatex()}$。`,
                  ),
                ],
                [
                  ["Then undo $g$", "再撤销 $g$"],
                  t(
                    `$g^{-1}(x) = ${undo("x", c, d)}$, so $g^{-1}(${finv.toLatex()}) = ${value.toLatex()}$.`,
                    `$g^{-1}(x) = ${undo("x", c, d)}$，所以 $g^{-1}(${finv.toLatex()}) = ${value.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$g(${value.toLatex()}) = ${finv.toLatex()}$ and $f(${finv.toLatex()}) = ${k}$, so $(f \\circ g)(${value.toLatex()}) = ${k}$.`,
                `$g(${value.toLatex()}) = ${finv.toLatex()}$，$f(${finv.toLatex()}) = ${k}$，所以 $(f \\circ g)(${value.toLatex()}) = ${k}$。`,
              ),
            ),
          });
        }
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
  intro: t(
    "Under $a \\ast b = a + b - 1$ on $\\mathbb{Z}$ the identity is $1$, the power $4^3 = (4 \\ast 4) \\ast 4 = 7 \\ast 4 = 10$, and the inverse of $4$ is $-2$, since $4 + (-2) - 1 = 1$.\n\nCheck: the formula $x^n = nx - (n - 1)$ for this operation gives $4^3 = 12 - 2 = 10$.\n\nIn this lesson we compute powers and inverses in groups with unfamiliar operations.",
    "在 $\\mathbb{Z}$ 上的 $a \\ast b = a + b - 1$ 下，单位元为 $1$，幂 $4^3 = (4 \\ast 4) \\ast 4 = 7 \\ast 4 = 10$，$4$ 的逆元为 $-2$，因为 $4 + (-2) - 1 = 1$。\n\n检验：这个运算的公式 $x^n = nx - (n - 1)$ 给出 $4^3 = 12 - 2 = 10$。\n\n本课我们在运算陌生的群中计算幂与逆元。",
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
        "A power means combining an element with itself repeatedly using the group's own operation, which may not be ordinary multiplication.\n\nIn $(\\mathbb{Z}, \\ast)$ with $a \\ast b = a + b + 2$, $x^2 = 2x + 2$, $x^3 = x^2 \\ast x = 3x + 4$ and in general $x^n = nx + 2(n - 1)$. So $5^4 = 20 + 6 = 26$.\n\nCheck: step by step, $5 \\ast 5 = 12$, $12 \\ast 5 = 19$ and $19 \\ast 5 = 26$.\n\n> **Watch out.** $n$ copies of $x$ need only $n - 1$ operations, so the constant is added $n - 1$ times, and $5^4$ here is not the ordinary $625$.",
        "幂的意思是用群自身的运算把一个元素反复与自己结合，这个运算不一定是普通乘法。\n\n在 $a \\ast b = a + b + 2$ 的 $(\\mathbb{Z}, \\ast)$ 中，$x^2 = 2x + 2$，$x^3 = x^2 \\ast x = 3x + 4$，一般地 $x^n = nx + 2(n - 1)$。所以 $5^4 = 20 + 6 = 26$。\n\n检验：逐步计算，$5 \\ast 5 = 12$，$12 \\ast 5 = 19$，$19 \\ast 5 = 26$。\n\n> **注意。** $n$ 个 $x$ 只需 $n - 1$ 次运算，所以常数只加 $n - 1$ 次；这里的 $5^4$ 也不是普通的 $625$。",
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
          mistakes: apart(Q.of(value), [
            why(
              x ** n,
              "This is the ordinary power; here the power uses the operation $\\ast$.",
              "这是普通的幂；这里的幂要用运算 $\\ast$。",
            ),
            why(
              n * x + n * c,
              `This adds $${c}$ $${n}$ times; $${n}$ copies need only $${n - 1}$ operations.`,
              `这把 $${c}$ 加了 $${n}$ 次；$${n}$ 个元素只需 $${n - 1}$ 次运算。`,
            ),
            why(n * x, `This drops the constant $${c}$ of the operation.`, `这丢掉了运算中的常数 $${c}$。`),
          ]),
          solution: walked(
            [
              [
                ["Count the operations", "数运算次数"],
                t(
                  `$${n}$ copies of $${par(x)}$ are joined by $${n - 1}$ operations, and each adds $${c}$.`,
                  `$${n}$ 个 $${par(x)}$ 之间有 $${n - 1}$ 次运算，每次加 $${c}$。`,
                ),
              ],
              [
                ["Add up", "求和"],
                t(
                  `$${par(x)}^{${n}} = ${n} \\cdot ${par(x)} + ${n - 1} \\cdot ${par(c)} = ${value}$.`,
                  `$${par(x)}^{${n}} = ${n} \\cdot ${par(x)} + ${n - 1} \\cdot ${par(c)} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Step by step: ${range(2, n)
                .map((m) => `$${par(m * x + (m - 1) * c - x - c)} \\ast ${par(x)} = ${m * x + (m - 1) * c}$`)
                .join(", ")}.`,
              `逐步计算：${range(2, n)
                .map((m) => `$${par(m * x + (m - 1) * c - x - c)} \\ast ${par(x)} = ${m * x + (m - 1) * c}$`)
                .join("，")}。`,
            ),
          ),
        });
      },
    },
    {
      id: "inverses-in-general-groups",
      title: t("Inverses", "逆元"),
      explanation: t(
        "The inverse of an element is what combines with it to give the identity, so set up that equation using the operation and solve it.\n\n$\\mathbb{R} \\setminus \\{-1\\}$ is a group under $a \\ast b = a + b + ab$ with identity $0$. The inverse of $a$ solves $a + x + ax = 0$, so $x(1 + a) = -a$ and $x = -\\frac{a}{1 + a}$; for $a = 3$ it is $-\\frac{3}{4}$.\n\nCheck: $3 \\ast (-\\frac{3}{4}) = 3 - \\frac{3}{4} - \\frac{9}{4} = 0$, the identity.\n\n> **Watch out.** The inverse is not $-a$ or $\\frac{1}{a}$: those are inverses for ordinary addition and multiplication, and $3 \\ast (-3) = -9$, not $0$.",
        "一个元素的逆元是与它结合得到单位元的那个元素，所以用这个运算列出方程并求解。\n\n$\\mathbb{R} \\setminus \\{-1\\}$ 在 $a \\ast b = a + b + ab$ 下构成群，单位元为 $0$。$a$ 的逆元满足 $a + x + ax = 0$，所以 $x(1 + a) = -a$，$x = -\\frac{a}{1 + a}$；$a = 3$ 时为 $-\\frac{3}{4}$。\n\n检验：$3 \\ast (-\\frac{3}{4}) = 3 - \\frac{3}{4} - \\frac{9}{4} = 0$，正是单位元。\n\n> **注意。** 逆元不是 $-a$ 或 $\\frac{1}{a}$：它们是普通加法与乘法下的逆元，而 $3 \\ast (-3) = -9$，不是 $0$。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.int(1, 4);
          const a = rng.nonZero(-9, 9);
          if (1 + k * a === 0) continue;
          const value = Q.of(-a, 1 + k * a);
          const excluded = Q.of(-1, k).toLatex();
          const mistakes = apart(value, [
            why(
              Q.of(-a),
              "This is the inverse under ordinary addition; this operation has its own inverse.",
              "这是普通加法下的逆元；这个运算有它自己的逆元。",
            ),
            why(
              Q.of(1, a),
              "This is the inverse under ordinary multiplication; this operation has its own inverse.",
              "这是普通乘法下的逆元；这个运算有它自己的逆元。",
            ),
            why(Q.of(a, 1 + k * a), `This loses the minus sign when moving $${a}$ across.`, `这在移项 $${a}$ 时丢了负号。`),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `$\\mathbb{R} \\setminus \\{${excluded}\\}$ is a group under $a \\ast b = a + b + ${k === 1 ? "" : k}ab$. Find the inverse of $${a}$.`,
              `$\\mathbb{R} \\setminus \\{${excluded}\\}$ 在 $a \\ast b = a + b + ${k === 1 ? "" : k}ab$ 下构成群。求 $${a}$ 的逆元。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Find the identity", "求单位元"],
                  t("$a \\ast 0 = a + 0 + 0 = a$, so the identity is $0$.", "$a \\ast 0 = a + 0 + 0 = a$，所以单位元为 $0$。"),
                ],
                [
                  ["Solve for the inverse", "解出逆元"],
                  t(
                    `$${a} + x ${signed(k * a)}x = 0$ gives $${1 + k * a === -1 ? "-" : 1 + k * a}x = ${-a}$, so $x = ${value.toLatex()}$.`,
                    `由 $${a} + x ${signed(k * a)}x = 0$ 得 $${1 + k * a === -1 ? "-" : 1 + k * a}x = ${-a}$，所以 $x = ${value.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${a} \\ast ${parQ(value)} = ${a} + ${parQ(value)} + ${parQ(Q.of(k * a).mul(value))} = ${Q.of(a)
                  .add(value)
                  .add(Q.of(k * a).mul(value))
                  .toLatex()}$, the identity.`,
                `$${a} \\ast ${parQ(value)} = ${a} + ${parQ(value)} + ${parQ(Q.of(k * a).mul(value))} = ${Q.of(a)
                  .add(value)
                  .add(Q.of(k * a).mul(value))
                  .toLatex()}$，正是单位元。`,
              ),
            ),
          });
        }
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
  intro: t(
    "$U(15)$ consists of the residues coprime to $15$: $1, 2, 4, 7, 8, 11, 13, 14$. So $|U(15)| = 8$, which matches $\\varphi(15) = 15 \\cdot \\frac{2}{3} \\cdot \\frac{4}{5} = 8$.\n\nCheck: the residues sharing a factor with $15$ are $0, 3, 5, 6, 9, 10, 12$, which is $7$ of the $15$, leaving $15 - 7 = 8$.\n\nIn this lesson we find the orders of groups of units and of matrix groups over $\\mathbb{Z}_p$.",
    "$U(15)$ 由与 $15$ 互素的剩余组成：$1, 2, 4, 7, 8, 11, 13, 14$。所以 $|U(15)| = 8$，与 $\\varphi(15) = 15 \\cdot \\frac{2}{3} \\cdot \\frac{4}{5} = 8$ 一致。\n\n检验：与 $15$ 有公因数的剩余为 $0, 3, 5, 6, 9, 10, 12$，共 $7$ 个，剩下 $15 - 7 = 8$ 个。\n\n本课我们求单位群以及 $\\mathbb{Z}_p$ 上矩阵群的阶。",
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
        "The elements with multiplicative inverses modulo a number are exactly those coprime to it, so there are as many as Euler's totient counts. $U(n) = \\{a \\in \\mathbb{Z}_n : \\gcd(a, n) = 1\\}$ is a group under multiplication modulo $n$, of order $\\varphi(n)$.\n\nFor $n = 12 = 2^2 \\cdot 3$, $\\varphi(12) = 12 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 4$, and indeed $U(12) = \\{1, 5, 7, 11\\}$.\n\nCheck: each listed element is its own inverse, since $5^2 = 25$, $7^2 = 49$ and $11^2 = 121$ are all $\\equiv 1 \\pmod{12}$, while $2, 3, 4, 6, 8, 9, 10$ share a factor with $12$.\n\n> **Watch out.** $U(n)$ is not $\\mathbb{Z}_n \\setminus \\{0\\}$ unless $n$ is prime: only the residues coprime to $n$ count.",
        "模某个数有乘法逆元的元素恰好是与它互素的数，所以个数等于欧拉函数的值。$U(n) = \\{a \\in \\mathbb{Z}_n : \\gcd(a, n) = 1\\}$ 在模 $n$ 乘法下构成群，阶为 $\\varphi(n)$。\n\n对 $n = 12 = 2^2 \\cdot 3$，$\\varphi(12) = 12 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 4$，确实 $U(12) = \\{1, 5, 7, 11\\}$。\n\n检验：列出的每个元素都是自己的逆元，因为 $5^2 = 25$、$7^2 = 49$、$11^2 = 121$ 都 $\\equiv 1 \\pmod{12}$；而 $2, 3, 4, 6, 8, 9, 10$ 都与 $12$ 有公因数。\n\n> **注意。** 除非 $n$ 是素数，$U(n)$ 不是 $\\mathbb{Z}_n \\setminus \\{0\\}$：只有与 $n$ 互素的剩余才算。",
      ),
      generate(rng) {
        const n = rng.int(6, 60);
        const value = phi(n);
        const primes = range(2, n).filter((p) => n % p === 0 && range(2, p - 1).every((d) => p % d !== 0));
        return numberProblem({
          prompt: t(
            `Find the order of $U(${n})$, the group of units of $\\mathbb{Z}_{${n}}$ under multiplication.`,
            `求 $U(${n})$（$\\mathbb{Z}_{${n}}$ 的单位在乘法下构成的群）的阶。`,
          ),
          answer: value,
          mistakes: apart(Q.of(value), [
            why(
              n - 1,
              "This counts every nonzero residue; only those coprime to the modulus are units.",
              "这数了每个非零剩余；只有与模互素的才是单位。",
            ),
            why(
              n,
              "This counts all of $\\mathbb{Z}_n$, including $0$ and the other non-units.",
              "这数了整个 $\\mathbb{Z}_n$，包括 $0$ 和其他非单位。",
            ),
            why(
              n - value,
              "This counts the residues that share a factor with the modulus, the non-units.",
              "这数的是与模有公因数的剩余，即非单位。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Factor the modulus", "分解模"],
                t(`The primes dividing $${n}$ are $${primes.join(", ")}$.`, `整除 $${n}$ 的素数为 $${primes.join(", ")}$。`),
              ],
              [
                ["Apply the totient formula", "用欧拉函数公式"],
                t(
                  `$\\varphi(${n}) = ${n}${primes.map((p) => ` \\cdot \\frac{${p - 1}}{${p}}`).join("")} = ${value}$.`,
                  `$\\varphi(${n}) = ${n}${primes.map((p) => ` \\cdot \\frac{${p - 1}}{${p}}`).join("")} = ${value}$。`,
                ),
              ],
            ],
            t(
              `The units are ${units(n).length <= 12 ? `$${units(n).join(", ")}$` : `$${units(n).slice(0, 6).join(", ")}, \\ldots, ${units(n).slice(-2).join(", ")}$`}, and there are $${units(n).length}$ of them.`,
              `单位为 ${units(n).length <= 12 ? `$${units(n).join(", ")}$` : `$${units(n).slice(0, 6).join(", ")}, \\ldots, ${units(n).slice(-2).join(", ")}$`}，共 $${units(n).length}$ 个。`,
            ),
          ),
        });
      },
    },
    {
      id: "orders-of-matrix-groups",
      title: t("Matrix groups over finite fields", "有限域上的矩阵群"),
      explanation: t(
        "Count matrices entry by entry, choosing each entry or column so that the matrix stays in the group.\n\nAn invertible diagonal $2 \\times 2$ matrix over $\\mathbb{Z}_5$ has two nonzero diagonal entries: $4^2 = 16$ choices. For $GL(2, \\mathbb{Z}_p)$, the first column is any of $p^2 - 1$ nonzero vectors and the second any of the $p^2 - p$ vectors not a multiple of it.\n\nCheck: for $p = 2$, $GL(2, \\mathbb{Z}_2)$ has $(4 - 1)(4 - 2) = 6$ elements, out of the $2^4 = 16$ matrices over $\\mathbb{Z}_2$.\n\n> **Watch out.** Do not count all $p^4$ matrices: a matrix with determinant $0$ has no inverse, so it is not in the group.",
        "逐个元素计数，每个元素或每一列的选法都要使矩阵仍在群中。\n\n$\\mathbb{Z}_5$ 上可逆的 $2 \\times 2$ 对角矩阵有两个非零对角元：$4^2 = 16$ 种。对 $GL(2, \\mathbb{Z}_p)$，第一列可以是 $p^2 - 1$ 个非零向量中的任一个，第二列可以是 $p^2 - p$ 个不为它的倍数的向量中的任一个。\n\n检验：$p = 2$ 时，$GL(2, \\mathbb{Z}_2)$ 有 $(4 - 1)(4 - 2) = 6$ 个元素，而 $\\mathbb{Z}_2$ 上的矩阵共有 $2^4 = 16$ 个。\n\n> **注意。** 不要把全部 $p^4$ 个矩阵都算上：行列式为 $0$ 的矩阵没有逆，不在群中。",
      ),
      generate(rng) {
        const g = rng.pick(MATRIX_GROUP_ORDERS);
        const p = rng.pick([2, 3, 5, 7, 11, 13]);
        const value = g.order(p);
        const sub = (s: string) => s.replace(/\{p\}/g, `{${p}}`);
        return numberProblem({
          prompt: t(`Find the order of ${sub(g.en)}.`, `求${sub(g.zh)}的阶。`),
          answer: value,
          mistakes: apart(Q.of(value), [
            ...MATRIX_GROUP_ORDERS.filter((h) => h !== g).map((h) =>
              why(
                h.order(p),
                `This is $${h.formula}$, the order of ${sub(h.en)}, a different group.`,
                `这是 $${h.formula}$，即${sub(h.zh)}的阶，那是另一个群。`,
              ),
            ),
            g.en.includes("3 \\times 3")
              ? why(
                  p ** 9,
                  "This counts every $3 \\times 3$ matrix, including those that are not in the group.",
                  "这数了所有 $3 \\times 3$ 矩阵，包括不在群中的。",
                )
              : why(
                  p ** 4,
                  "This counts every $2 \\times 2$ matrix, including those that are not in the group.",
                  "这数了所有 $2 \\times 2$ 矩阵，包括不在群中的。",
                ),
          ]),
          solution: walked(
            [
              [["Count the choices", "数选法"], t(`${g.why.en}.`, `${g.why["zh-CN"]}。`)],
              [
                ["Substitute $p$", "代入 $p$"],
                t(
                  `The order is $${g.formula}$, which for $p = ${p}$ is $${value}$.`,
                  `阶为 $${g.formula}$，当 $p = ${p}$ 时为 $${value}$。`,
                ),
              ],
            ],
            (() => {
              const size = g.en.includes("3 \\times 3") ? 3 : 2;
              const filled = g.formula.replace(/\) p$/, ") \\cdot p").replace(/p/g, `${p}`);
              return t(
                `$${filled} = ${value}$, fewer than the $${p}^{${size * size}} = ${p ** (size * size)}$ matrices of size $${size} \\times ${size}$ over $\\mathbb{Z}_{${p}}$, as it must be.`,
                `$${filled} = ${value}$，少于 $\\mathbb{Z}_{${p}}$ 上全部 $${p}^{${size * size}} = ${p ** (size * size)}$ 个 $${size} \\times ${size}$ 矩阵，这是应当的。`,
              );
            })(),
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
  intro: t(
    "In $\\mathbb{Z}_{18}$ the order of $12$ is $\\frac{18}{\\gcd(12, 18)} = \\frac{18}{6} = 3$. In $U(7)$ the powers of $2$ are $2, 4, 1$, so $2$ has order $3$ there too.\n\nCheck: $3 \\cdot 12 = 36 = 2 \\cdot 18$, and $2^3 = 8 = 7 + 1$.\n\nIn this lesson we find the orders of elements in $\\mathbb{Z}_n$ and in $U(n)$.",
    "在 $\\mathbb{Z}_{18}$ 中 $12$ 的阶为 $\\frac{18}{\\gcd(12, 18)} = \\frac{18}{6} = 3$。在 $U(7)$ 中 $2$ 的幂依次为 $2, 4, 1$，所以 $2$ 在那里的阶也是 $3$。\n\n检验：$3 \\cdot 12 = 36 = 2 \\cdot 18$，且 $2^3 = 8 = 7 + 1$。\n\n本课我们求 $\\mathbb{Z}_n$ 与 $U(n)$ 中元素的阶。",
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
        "The order of $a$ in $\\mathbb{Z}_n$ is the number of times $a$ must be added to itself to reach $0$.\n\nIn $\\mathbb{Z}_{12}$, the multiples of $8$ are $8, 4, 0$, so $8$ has order $3$. In general the order of $a$ in $\\mathbb{Z}_n$ is $\\frac{n}{\\gcd(a, n)}$, here $\\frac{12}{4} = 3$.\n\nCheck: $3 \\cdot 8 = 24 = 2 \\cdot 12$, and neither $8$ nor $16$ is a multiple of $12$.\n\n> **Watch out.** The order is $n$ divided by the gcd, not the gcd itself: $\\gcd(8, 12) = 4$, but $4 \\cdot 8 = 32$ is not a multiple of $12$.",
        "$a$ 在 $\\mathbb{Z}_n$ 中的阶，是把 $a$ 自己相加到得到 $0$ 所需的次数。\n\n在 $\\mathbb{Z}_{12}$ 中，$8$ 的倍数依次为 $8, 4, 0$，所以 $8$ 的阶为 $3$。一般地，$a$ 在 $\\mathbb{Z}_n$ 中的阶为 $\\frac{n}{\\gcd(a, n)}$，这里为 $\\frac{12}{4} = 3$。\n\n检验：$3 \\cdot 8 = 24 = 2 \\cdot 12$，而 $8$ 与 $16$ 都不是 $12$ 的倍数。\n\n> **注意。** 阶是 $n$ 除以最大公约数，而不是最大公约数本身：$\\gcd(8, 12) = 4$，但 $4 \\cdot 8 = 32$ 不是 $12$ 的倍数。",
      ),
      generate(rng) {
        const n = rng.int(6, 40);
        const a = rng.int(1, n - 1);
        const d = gcd(a, n);
        const value = n / d;
        return numberProblem({
          prompt: t(
            `Find the order of $${a}$ in the group $\\mathbb{Z}_{${n}}$ under addition.`,
            `求 $${a}$ 在加法群 $\\mathbb{Z}_{${n}}$ 中的阶。`,
          ),
          answer: value,
          mistakes: apart(Q.of(value), [
            why(
              d,
              `This is $\\gcd(${a}, ${n})$ itself; the order is $${n}$ divided by it.`,
              `这是 $\\gcd(${a}, ${n})$ 本身；阶是 $${n}$ 除以它。`,
            ),
            why(n, "This is the order of the whole group, not of the element.", "这是整个群的阶，不是这个元素的阶。"),
            why(n - a, `This is the inverse of $${a}$, not its order.`, `这是 $${a}$ 的逆元，不是它的阶。`),
            why(a, "This is the element itself, not the number of times it must be added.", "这是元素本身，不是需要相加的次数。"),
          ]),
          solution: walked(
            [
              [["Find the gcd", "求最大公约数"], t(`$\\gcd(${a}, ${n}) = ${d}$.`, `$\\gcd(${a}, ${n}) = ${d}$。`)],
              [
                ["Divide", "相除"],
                d === 1
                  ? t(`The gcd is $1$, so the order is $${n}$ itself.`, `最大公约数为 $1$，所以阶就是 $${n}$。`)
                  : t(`The order is $\\frac{${n}}{${d}} = ${value}$.`, `阶为 $\\frac{${n}}{${d}} = ${value}$。`),
              ],
            ],
            t(
              `$${value} \\cdot ${a} = ${value * a} = ${(value * a) / n} \\cdot ${n}$${value > 1 ? `, and no smaller positive multiple of $${a}$ is a multiple of $${n}$` : ""}.`,
              `$${value} \\cdot ${a} = ${value * a} = ${(value * a) / n} \\cdot ${n}$${value > 1 ? `，而 $${a}$ 更小的正倍数都不是 $${n}$ 的倍数` : ""}。`,
            ),
          ),
        });
      },
    },
    {
      id: "orders-in-groups-of-units",
      title: t("Orders in U(n)", "U(n) 中的阶"),
      explanation: t(
        "The order of an element is the smallest positive power that gives the identity, so compute successive powers until you reach $1$, reducing modulo $n$ at each step.\n\nIn $U(10)$, $3^1 = 3$, $3^2 = 9$, $3^3 = 27 \\equiv 7$, $3^4 \\equiv 7 \\cdot 3 = 21 \\equiv 1$, so $3$ has order $4$.\n\nCheck: the order divides $|U(10)| = \\varphi(10) = 4$, and $4$ does.\n\n> **Watch out.** The identity of $U(n)$ is $1$, not $0$, and the order of an element need not equal the order $\\varphi(n)$ of the whole group: in $U(10)$, $9^2 = 81 \\equiv 1$, so $9$ has order $2$.",
        "元素的阶是使它等于单位元的最小正幂，所以依次计算幂直到得到 $1$，每一步都模 $n$ 约简。\n\n在 $U(10)$ 中，$3^1 = 3$，$3^2 = 9$，$3^3 = 27 \\equiv 7$，$3^4 \\equiv 7 \\cdot 3 = 21 \\equiv 1$，所以 $3$ 的阶为 $4$。\n\n检验：阶整除 $|U(10)| = \\varphi(10) = 4$，而 $4$ 确实整除它。\n\n> **注意。** $U(n)$ 的单位元是 $1$ 而不是 $0$；元素的阶也不一定等于整个群的阶 $\\varphi(n)$：在 $U(10)$ 中 $9^2 = 81 \\equiv 1$，所以 $9$ 的阶为 $2$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(7, 30);
          const a = rng.pick(units(n));
          if (a === 1) continue;
          const value = multiplicativeOrder(a, n);
          const powers = range(1, value).map((k) => {
            let x = 1;
            for (let i = 0; i < k; i++) x = mod(x * a, n);
            return x;
          });
          const mistakes = apart(Q.of(value), [
            why(
              phi(n),
              `This is $\\varphi(${n})$, the order of the whole group; the order of $${a}$ only divides it.`,
              `这是整个群的阶 $\\varphi(${n})$；$${a}$ 的阶只是它的因数。`,
            ),
            why(
              n,
              `This uses the additive rule $\\frac{n}{\\gcd(a, n)}$, which is for $\\mathbb{Z}_{${n}}$ under addition.`,
              `这用了加法群的规则 $\\frac{n}{\\gcd(a, n)}$，它只适用于加法群 $\\mathbb{Z}_{${n}}$。`,
            ),
            why(
              value + 1,
              "This counts $a^0$ as well; the order is the exponent of the first power equal to $1$.",
              "这把 $a^0$ 也算进去了；阶是第一个等于 $1$ 的幂的指数。",
            ),
            why(value - 1, "This stops one power early, before the power equal to $1$.", "这少算了一次，在得到 $1$ 之前就停了。"),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `Find the order of $${a}$ in $U(${n})$, the group of units modulo $${n}$ under multiplication.`,
              `求 $${a}$ 在 $U(${n})$（模 $${n}$ 单位在乘法下构成的群）中的阶。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["List the powers", "列出幂"],
                  t(
                    `The powers $${a}^1, ${a}^2, \\ldots$ modulo $${n}$ are $${powers.join(", ")}$.`,
                    `$${a}^1, ${a}^2, \\ldots$ 模 $${n}$ 依次为 $${powers.join(", ")}$。`,
                  ),
                ],
                [
                  ["Read off the order", "读出阶"],
                  t(
                    `The first $1$ is at power $${value}$, so the order is $${value}$.`,
                    `第一个 $1$ 出现在第 $${value}$ 次幂，所以阶为 $${value}$。`,
                  ),
                ],
              ],
              t(
                `$${value}$ divides $|U(${n})| = \\varphi(${n}) = ${phi(n)}$, as the order of an element must.`,
                `$${value}$ 整除 $|U(${n})| = \\varphi(${n}) = ${phi(n)}$，元素的阶必须如此。`,
              ),
            ),
          });
        }
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
  intro: t(
    "In $U(17)$ the inverse of $5$ is $7$, since $5 \\cdot 7 = 35 = 2 \\cdot 17 + 1$. So $5x = 3$ has the solution $x = 7 \\cdot 3 = 21 \\equiv 4$.\n\nCheck: $5 \\cdot 4 = 20 = 17 + 3 \\equiv 3 \\pmod{17}$.\n\nIn this lesson we invert elements of $U(n)$ and solve equations $ax = b$ there.",
    "在 $U(17)$ 中 $5$ 的逆元为 $7$，因为 $5 \\cdot 7 = 35 = 2 \\cdot 17 + 1$。所以 $5x = 3$ 的解为 $x = 7 \\cdot 3 = 21 \\equiv 4$。\n\n检验：$5 \\cdot 4 = 20 = 17 + 3 \\equiv 3 \\pmod{17}$。\n\n本课我们求 $U(n)$ 中元素的逆元，并在其中解方程 $ax = b$。",
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
        "The extended Euclidean algorithm writes one as a combination of the element and the modulus, and the coefficient of the element is its inverse.\n\nIn $U(26)$, the extended Euclidean algorithm gives $26 = 3 \\cdot 7 + 5$, $7 = 5 + 2$, $5 = 2 \\cdot 2 + 1$, and back-substituting $1 = 3 \\cdot 26 - 11 \\cdot 7$. So $7^{-1} = -11 = 15$.\n\nCheck: $7 \\cdot 15 = 105 = 4 \\cdot 26 + 1$.\n\n> **Watch out.** A negative coefficient must be brought into range by adding the modulus: $-11$ becomes $26 - 11 = 15$, not $11$.",
        "扩展欧几里得算法把 1 写成该元素与模的组合，其中该元素的系数就是它的逆元。\n\n在 $U(26)$ 中，扩展欧几里得算法给出 $26 = 3 \\cdot 7 + 5$，$7 = 5 + 2$，$5 = 2 \\cdot 2 + 1$，回代得 $1 = 3 \\cdot 26 - 11 \\cdot 7$。所以 $7^{-1} = -11 = 15$。\n\n检验：$7 \\cdot 15 = 105 = 4 \\cdot 26 + 1$。\n\n> **注意。** 负系数要加上模化到范围内：$-11$ 变为 $26 - 11 = 15$，而不是 $11$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(7, 60);
          const a = rng.pick(units(n));
          if (a === 1 || a === n - 1) continue;
          const inv = modInverse(a, n);
          const mistakes = apart(Q.of(inv), [
            why(
              n - a,
              `This is the additive inverse of $${a}$; in $U(${n})$ the operation is multiplication.`,
              `这是 $${a}$ 的加法逆元；$U(${n})$ 中的运算是乘法。`,
            ),
            why(n - inv, "This drops the sign of the coefficient when bringing it into range.", "这在把系数化到范围内时丢了符号。"),
            why(
              a,
              `This takes $${a}$ to be its own inverse, but $${a} \\cdot ${a} = ${a * a} \\equiv ${mod(a * a, n)}$.`,
              `这把 $${a}$ 当成了自己的逆元，但 $${a} \\cdot ${a} = ${a * a} \\equiv ${mod(a * a, n)}$。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `Find the inverse of $${a}$ in $U(${n})$. Give an answer between $0$ and $${n - 1}$.`,
              `求 $${a}$ 在 $U(${n})$ 中的逆元。答案取 $0$ 到 $${n - 1}$ 之间的数。`,
            ),
            answer: inv,
            mistakes,
            solution: walked(
              [
                [
                  ["Solve $ax \\equiv 1$", "解 $ax \\equiv 1$"],
                  t(
                    `By the extended Euclidean algorithm (or by trial), $${a} \\cdot ${inv} \\equiv 1 \\pmod{${n}}$.`,
                    `用扩展欧几里得算法（或试算）得 $${a} \\cdot ${inv} \\equiv 1 \\pmod{${n}}$。`,
                  ),
                ],
                [
                  ["State the inverse", "写出逆元"],
                  t(`So $${a}^{-1} = ${inv}$ in $U(${n})$.`, `所以在 $U(${n})$ 中 $${a}^{-1} = ${inv}$。`),
                ],
              ],
              t(
                `$${a} \\cdot ${inv} = ${a * inv} = ${Math.floor((a * inv) / n)} \\cdot ${n} + 1$.`,
                `$${a} \\cdot ${inv} = ${a * inv} = ${Math.floor((a * inv) / n)} \\cdot ${n} + 1$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "solving-equations-in-groups-of-units",
      title: t("Solving ax = b", "解 ax = b"),
      explanation: t(
        "In any group an equation of this form has exactly one solution, found by multiplying both sides by the inverse of the coefficient: $x = a^{-1}b$.\n\nIn $U(11)$, $3x = 7$: $3^{-1} = 4$, since $3 \\cdot 4 = 12 \\equiv 1$, so $x = 4 \\cdot 7 = 28 \\equiv 6$.\n\nCheck: $3 \\cdot 6 = 18 \\equiv 7$.\n\n> **Watch out.** Do not divide $7$ by $3$ as ordinary numbers, or subtract: modulo $11$ the only way to undo multiplication by $3$ is to multiply by $3^{-1} = 4$.",
        "在任何群中，这种形式的方程恰好有一个解，把两边乘以系数的逆元就能求出：$x = a^{-1}b$。\n\n在 $U(11)$ 中解 $3x = 7$：$3^{-1} = 4$，因为 $3 \\cdot 4 = 12 \\equiv 1$，所以 $x = 4 \\cdot 7 = 28 \\equiv 6$。\n\n检验：$3 \\cdot 6 = 18 \\equiv 7$。\n\n> **注意。** 不要把 $7$ 当作普通数除以 $3$，也不要相减：模 $11$ 时，撤销乘 $3$ 的唯一办法是乘以 $3^{-1} = 4$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(7, 40);
          const a = rng.pick(units(n));
          if (a === 1) continue;
          const b = rng.pick(units(n).filter((v) => v !== a));
          const inv = modInverse(a, n);
          const x = mod(inv * b, n);
          const mistakes = apart(Q.of(x), [
            why(
              mod(a * b, n),
              `This multiplies $${b}$ by $${a}$ instead of by $${a}^{-1}$.`,
              `这把 $${b}$ 乘以 $${a}$，而不是乘以 $${a}^{-1}$。`,
            ),
            why(inv, `This is $${a}^{-1}$ itself; it still has to be multiplied by $${b}$.`, `这是 $${a}^{-1}$ 本身；还要再乘以 $${b}$。`),
            why(mod(b - a, n), "This subtracts, as if the operation were addition.", "这用了减法，好像运算是加法。"),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `Solve $${a}x = ${b}$ in $U(${n})$. Give an answer between $0$ and $${n - 1}$.`,
              `在 $U(${n})$ 中解 $${a}x = ${b}$。答案取 $0$ 到 $${n - 1}$ 之间的数。`,
            ),
            answer: x,
            solveFor: "x",
            mistakes,
            solution: walked(
              [
                [
                  ["Invert the coefficient", "求系数的逆元"],
                  t(
                    `$${a}^{-1} = ${inv}$ in $U(${n})$, since $${a} \\cdot ${inv} = ${a * inv} \\equiv 1$.`,
                    `在 $U(${n})$ 中 $${a}^{-1} = ${inv}$，因为 $${a} \\cdot ${inv} = ${a * inv} \\equiv 1$。`,
                  ),
                ],
                [
                  ["Multiply both sides", "两边同乘"],
                  t(`$x = ${inv} \\cdot ${b} = ${inv * b} \\equiv ${x}$.`, `$x = ${inv} \\cdot ${b} = ${inv * b} \\equiv ${x}$。`),
                ],
              ],
              t(`$${a} \\cdot ${x} = ${a * x} \\equiv ${b} \\pmod{${n}}$.`, `$${a} \\cdot ${x} = ${a * x} \\equiv ${b} \\pmod{${n}}$。`),
            ),
          });
        }
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
  intro: t(
    "In the Cayley table of $\\mathbb{Z}_4$, row $3$ reads $3, 0, 1, 2$ under the columns $0, 1, 2, 3$: each element exactly once. So if the entry in row $3$, column $2$ were hidden, it would have to be $1$, the one element missing from the row.\n\nCheck: $3 + 2 = 5 \\equiv 1 \\pmod{4}$.\n\nIn this lesson we complete Cayley tables and compute products with them.",
    "在 $\\mathbb{Z}_4$ 的凯莱表中，第 $3$ 行在列 $0, 1, 2, 3$ 下依次为 $3, 0, 1, 2$：每个元素恰好一次。所以若第 $3$ 行第 $2$ 列被遮住，它只能是 $1$，即该行中缺少的那个元素。\n\n检验：$3 + 2 = 5 \\equiv 1 \\pmod{4}$。\n\n本课我们补全凯莱表，并用它计算乘积。",
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
        "Each element occurs exactly once in every row and column of a group's Cayley table. So a missing entry is the one element that does not yet appear in its row (or in its column).\n\nIf a row of a group of order $4$ reads $c, ?, a, e$, the elements $e, a, c$ are already used, so the gap is $b$.\n\nCheck: the column of the gap must not contain $b$ elsewhere either; if it did, the table could not belong to a group.\n\n> **Watch out.** Do not fill the gap with the row or column heading: that is right only when the other factor is the identity.",
        "群的凯莱表中每个元素在每一行、每一列恰好出现一次。所以缺失的元素就是它所在行（或列）中尚未出现的那个元素。\n\n若一个 $4$ 阶群的某一行为 $c, ?, a, e$，则 $e, a, c$ 已经出现，所以空缺处是 $b$。\n\n检验：空缺所在的列中其他位置也不能出现 $b$；否则这张表不可能属于一个群。\n\n> **注意。** 不要用行标题或列标题去填空缺：只有当另一个因子是单位元时那样才对。",
      ),
      generate(rng) {
        const g = randomSmallGroup(rng);
        const order = shuffled(rng, g);
        const a = rng.pick(order.slice(1));
        const b = rng.pick(order.slice(1));
        const ab = g.op(a, b);
        const L = g.labels;
        const reasons = range(0, g.size - 1)
          .filter((w) => w !== ab)
          .map((w) => {
            const c = range(0, g.size - 1).find((v) => g.op(a, v) === w)!;
            return [
              `$${L[w]}$`,
              `$${L[w]}$ already appears in row $${L[a]}$, under column $${L[c]}$, and a row cannot repeat an element.`,
              `$${L[w]}$ 已经出现在第 $${L[a]}$ 行的第 $${L[c]}$ 列，而一行中不能有重复的元素。`,
            ] as const;
          });
        return reasoned(
          texChoice(
            rng,
            t(
              `The Cayley table of a group is $${cayleyTex(g, order, [[a, b]])}$. Which element is missing?`,
              `一个群的凯莱表为 $${cayleyTex(g, order, [[a, b]])}$。缺失的元素是什么？`,
            ),
            L[ab]!,
            rng.shuffle(L.filter((_, i) => i !== ab)),
            walked(
              [
                [
                  ["List the row", "列出该行"],
                  t(
                    `Row $${L[a]}$ already contains $${order
                      .filter((v) => v !== b)
                      .map((v) => L[g.op(a, v)])
                      .join(", ")}$.`,
                    `第 $${L[a]}$ 行已含有 $${order
                      .filter((v) => v !== b)
                      .map((v) => L[g.op(a, v)])
                      .join(", ")}$。`,
                  ),
                ],
                [
                  ["Find the unused element", "找出未出现的元素"],
                  t(`The only element not yet in the row is $${L[ab]}$.`, `该行中唯一还没出现的元素是 $${L[ab]}$。`),
                ],
              ],
              t(
                `Column $${L[b]}$ holds $${order
                  .filter((v) => v !== a)
                  .map((v) => L[g.op(v, b)])
                  .join(", ")}$ in the other rows, with no $${L[ab]}$, so it fits there too.`,
                `第 $${L[b]}$ 列的其他行为 $${order
                  .filter((v) => v !== a)
                  .map((v) => L[g.op(v, b)])
                  .join(", ")}$，没有 $${L[ab]}$，所以它在列中也合适。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "computing-with-cayley-tables",
      title: t("Computing products", "计算乘积"),
      explanation: t(
        "A Cayley table lists every product, with the row giving the first element and the column giving the second, so products are looked up step by step. To find $(x \\ast y) \\ast z$, read $x \\ast y$ from row $x$, column $y$, then look up that element's row and column $z$.\n\nIn $\\mathbb{Z}_4$ written as a table, $(3 \\ast 2) \\ast 3$: row $3$, column $2$ gives $1$, then row $1$, column $3$ gives $0$.\n\nCheck: by associativity, $3 \\ast (2 \\ast 3) = 3 \\ast 1 = 0$ gives the same.\n\n> **Watch out.** The row is the left factor and the column the right one. In a non-abelian group such as $S_3$, reading them the other way round gives a different answer.",
        "凯莱表列出所有乘积，行给出第一个元素，列给出第二个元素，所以乘积可以逐步查出。要求 $(x \\ast y) \\ast z$，先在第 $x$ 行第 $y$ 列读出 $x \\ast y$，再查该元素所在行与第 $z$ 列的交叉处。\n\n在 $\\mathbb{Z}_4$ 的运算表中求 $(3 \\ast 2) \\ast 3$：第 $3$ 行第 $2$ 列为 $1$，再看第 $1$ 行第 $3$ 列为 $0$。\n\n检验：由结合律，$3 \\ast (2 \\ast 3) = 3 \\ast 1 = 0$，结果相同。\n\n> **注意。** 行是左边的因子，列是右边的因子。在 $S_3$ 这样的非交换群中，把两者读反会得到不同的答案。",
      ),
      generate(rng) {
        const g = randomSmallGroup(rng);
        const order = shuffled(rng, g);
        const [x, y, z] = [rng.pick(order), rng.pick(order), rng.pick(order)];
        const xy = g.op(x, y);
        const value = g.op(xy, z);
        const L = g.labels;
        const named = new Map<number, readonly [string, string]>();
        const name = (w: number, en: string, zh: string) => {
          if (w !== value && !named.has(w)) named.set(w, [en, zh]);
        };
        name(
          g.op(z, xy),
          `This is $${L[z]} \\ast ${L[xy]}$: the factors were read in the wrong order in the second step.`,
          `这是 $${L[z]} \\ast ${L[xy]}$：第二步把两个因子的顺序读反了。`,
        );
        name(
          xy,
          `This is only $${L[x]} \\ast ${L[y]}$; it still has to be combined with $${L[z]}$.`,
          `这只是 $${L[x]} \\ast ${L[y]}$；还要再与 $${L[z]}$ 结合。`,
        );
        name(g.op(x, z), `This is $${L[x]} \\ast ${L[z]}$, which skips $${L[y]}$.`, `这是 $${L[x]} \\ast ${L[z]}$，跳过了 $${L[y]}$。`);
        for (const w of range(0, g.size - 1)) {
          name(
            w,
            `Row $${L[xy]}$, column $${L[z]}$ holds $${L[value]}$, not $${L[w]}$.`,
            `第 $${L[xy]}$ 行第 $${L[z]}$ 列是 $${L[value]}$，不是 $${L[w]}$。`,
          );
        }
        const reasons = [...named].map(([w, [en, zh]]) => [`$${L[w]}$`, en, zh] as const);
        return reasoned(
          texChoice(
            rng,
            t(
              `The Cayley table of a group is $${cayleyTex(g, order)}$. Find $(${L[x]} \\ast ${L[y]}) \\ast ${L[z]}$.`,
              `一个群的凯莱表为 $${cayleyTex(g, order)}$。求 $(${L[x]} \\ast ${L[y]}) \\ast ${L[z]}$。`,
            ),
            L[value]!,
            [L[g.op(z, xy)]!, L[xy]!, L[g.op(x, z)]!, ...rng.shuffle(L.filter((_, i) => i !== value))],
            walked(
              [
                [
                  ["Inner product", "里层乘积"],
                  t(
                    `Row $${L[x]}$, column $${L[y]}$: $${L[x]} \\ast ${L[y]} = ${L[xy]}$.`,
                    `第 $${L[x]}$ 行第 $${L[y]}$ 列：$${L[x]} \\ast ${L[y]} = ${L[xy]}$。`,
                  ),
                ],
                [
                  ["Outer product", "外层乘积"],
                  t(
                    `Row $${L[xy]}$, column $${L[z]}$: $${L[xy]} \\ast ${L[z]} = ${L[value]}$.`,
                    `第 $${L[xy]}$ 行第 $${L[z]}$ 列：$${L[xy]} \\ast ${L[z]} = ${L[value]}$。`,
                  ),
                ],
              ],
              t(
                `By associativity, $${L[x]} \\ast (${L[y]} \\ast ${L[z]}) = ${L[x]} \\ast ${L[g.op(y, z)]} = ${L[g.op(x, g.op(y, z))]}$, the same element.`,
                `由结合律，$${L[x]} \\ast (${L[y]} \\ast ${L[z]}) = ${L[x]} \\ast ${L[g.op(y, z)]} = ${L[g.op(x, g.op(y, z))]}$，是同一个元素。`,
              ),
            ),
          ),
          reasons,
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
  intro: t(
    "In the Cayley diagram of $\\mathbb{Z}_8$ with arrows $x \\to x + 6$, starting at $1$ and following $3$ arrows visits $1 \\to 7 \\to 5 \\to 3$. The arrows split the vertices into $\\gcd(6, 8) = 2$ cycles, each of length $\\frac{8}{2} = 4$.\n\nCheck: $1 + 3 \\cdot 6 = 19 \\equiv 3 \\pmod{8}$, and $2 \\cdot 4 = 8$ vertices in all.\n\nIn this lesson we follow paths of arrows in Cayley diagrams and count their cycles.",
    "在箭头为 $x \\to x + 6$ 的 $\\mathbb{Z}_8$ 凯莱图中，从 $1$ 出发沿 $3$ 条箭头走，依次经过 $1 \\to 7 \\to 5 \\to 3$。箭头把顶点分成 $\\gcd(6, 8) = 2$ 个圈，每个圈长 $\\frac{8}{2} = 4$。\n\n检验：$1 + 3 \\cdot 6 = 19 \\equiv 3 \\pmod{8}$，且共 $2 \\cdot 4 = 8$ 个顶点。\n\n本课我们在凯莱图中沿箭头的路径走，并数出它的圈。",
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
        "Each arrow adds its generator, so following several arrows adds the generator that many times, and following an arrow backwards subtracts it.\n\nIn the Cayley diagram of $\\mathbb{Z}_{10}$ with arrows $x \\to x + 3$, following $4$ arrows from $7$ adds $4 \\cdot 3 = 12$: you end at $(7 + 12) \\bmod 10 = 9$.\n\nCheck: the highlighted path in the figure visits $7, 0, 3, 6$ and ends at $9$.\n\n> **Watch out.** Reduce modulo $n$ at the end, and remember the starting vertex: $4 \\cdot 3 = 12 \\equiv 2$ is where the path from $0$ would end, not the path from $7$.",
        "每条箭头加上它的生成元，所以沿几条箭头走就加几次生成元，逆着箭头走则减去它。\n\n在箭头为 $x \\to x + 3$ 的 $\\mathbb{Z}_{10}$ 凯莱图中，从 $7$ 出发沿 $4$ 条箭头走，加上 $4 \\cdot 3 = 12$：终点为 $(7 + 12) \\bmod 10 = 9$。\n\n检验：图中高亮的路径依次经过 $7, 0, 3, 6$，终点为 $9$。\n\n> **注意。** 最后要模 $n$ 约简，并且不要忘了起点：$4 \\cdot 3 = 12 \\equiv 2$ 是从 $0$ 出发的终点，不是从 $7$ 出发的终点。",
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
        for (;;) {
          const n = rng.int(5, 16);
          const g = rng.int(2, n - 1);
          const h = rng.int(1, n - 1);
          const start = rng.int(0, n - 1);
          const forward = rng.int(2, 7);
          const back = rng.int(0, 3);
          const value = mod(start + forward * g - back * h, n);
          const mistakes = apart(Q.of(value), [
            ...(back === 0
              ? []
              : [
                  why(
                    mod(start + forward * g + back * h, n),
                    "This follows the dashed arrows forwards; going backwards subtracts.",
                    "这顺着虚线箭头走了；逆着走要减去。",
                  ),
                  why(mod(start + forward * g, n), "This leaves out the dashed arrows.", "这漏掉了虚线箭头。"),
                ]),
            why(
              mod(start + forward + g, n),
              `This adds the number of arrows and the step; each of the $${forward}$ arrows adds $${g}$.`,
              `这把箭头数与步长相加了；$${forward}$ 条箭头每条都加 $${g}$。`,
            ),
            why(mod(forward * g - back * h, n), `This forgets the starting vertex $${start}$.`, `这忘了起点 $${start}$。`),
            why(start + forward * g - back * h, `This forgets to reduce modulo $${n}$.`, `这忘了模 $${n}$ 约简。`),
          ]);
          if (mistakes.length < 2) continue;
          const raw = start + forward * g - back * h;
          const walk = [start];
          for (let s = 1; s <= forward; s++) walk.push(mod(start + s * g, n));
          for (let s = 1; s <= back; s++) walk.push(mod(start + forward * g - s * h, n));
          return numberProblem({
            prompt: t(
              `The Cayley diagram of $\\mathbb{Z}_{${n}}$ has solid arrows $x \\to x + ${g}$ and dashed arrows $x \\to x + ${h}$. Starting at $${start}$, you follow $${forward}$ solid arrows forwards${back === 0 ? "" : ` and then $${back}$ dashed arrow${back === 1 ? "" : "s"} backwards`}. At which vertex do you end?`,
              `$\\mathbb{Z}_{${n}}$ 的凯莱图中，实线箭头为 $x \\to x + ${g}$，虚线箭头为 $x \\to x + ${h}$。从 $${start}$ 出发，顺着实线箭头走 $${forward}$ 步${back === 0 ? "" : `，再逆着虚线箭头走 $${back}$ 步`}。终点是哪个顶点？`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Add up the arrows", "把箭头加起来"],
                  t(
                    `$${start} + ${forward} \\cdot ${g}${back === 0 ? "" : ` - ${back} \\cdot ${h}`} = ${raw}$.`,
                    `$${start} + ${forward} \\cdot ${g}${back === 0 ? "" : ` - ${back} \\cdot ${h}`} = ${raw}$。`,
                  ),
                ],
                [["Reduce", "约简"], t(`$${raw} \\equiv ${value} \\pmod{${n}}$.`, `$${raw} \\equiv ${value} \\pmod{${n}}$。`)],
              ],
              t(`Step by step: $${walk.join(" \\to ")}$, ending at $${value}$.`, `逐步走：$${walk.join(" \\to ")}$，终点为 $${value}$。`),
            ),
          });
        }
      },
    },
    {
      id: "cycles-in-cayley-diagrams",
      title: t("Cycles of arrows", "箭头构成的圈"),
      explanation: t(
        "Following the arrows of $g$ from any vertex returns to it after as many steps as the order of $g$, so every cycle has that length and the cycles split the $n$ vertices evenly.\n\nIn $\\mathbb{Z}_{12}$ the arrows $x \\to x + 8$ form the cycles $0 \\to 8 \\to 4 \\to 0$, $1 \\to 9 \\to 5 \\to 1$, and so on: each has length equal to the order $3$ of $8$, so there are $\\frac{12}{3} = 4 = \\gcd(8, 12)$ cycles.\n\nCheck: the figure shows $4$ triangles, and $4 \\cdot 3 = 12$ vertices in all.\n\n> **Watch out.** The length of a cycle is $\\frac{n}{\\gcd(g, n)}$ and the number of cycles is $\\gcd(g, n)$; do not swap them, and do not take the step $g$ itself as the length.",
        "从任一顶点出发沿 $g$ 的箭头走，走过 $g$ 的阶那么多步后回到原处，所以每个圈的长度都等于这个阶，这些圈把 $n$ 个顶点平均分开。\n\n在 $\\mathbb{Z}_{12}$ 中，箭头 $x \\to x + 8$ 构成圈 $0 \\to 8 \\to 4 \\to 0$、$1 \\to 9 \\to 5 \\to 1$ 等：每个圈的长度等于 $8$ 的阶 $3$，所以共有 $\\frac{12}{3} = 4 = \\gcd(8, 12)$ 个圈。\n\n检验：图中有 $4$ 个三角形，共 $4 \\cdot 3 = 12$ 个顶点。\n\n> **注意。** 圈的长度是 $\\frac{n}{\\gcd(g, n)}$，圈的个数是 $\\gcd(g, n)$；不要把两者弄反，也不要把步长 $g$ 本身当作长度。",
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
        for (;;) {
          const n = rng.int(6, 30);
          const g = rng.int(1, n - 1);
          const d = gcd(g, n);
          const length = rng.bool();
          const value = length ? n / d : d;
          const mistakes = apart(Q.of(value), [
            length
              ? why(
                  d,
                  `This is $\\gcd(${g}, ${n})$, the number of cycles, not their length.`,
                  `这是 $\\gcd(${g}, ${n})$，即圈的个数，不是圈的长度。`,
                )
              : why(n / d, `This is the length of each cycle, not the number of cycles.`, `这是每个圈的长度，不是圈的个数。`),
            why(g, "This is the step of the arrows, not a count of vertices or cycles.", "这是箭头的步长，不是顶点或圈的个数。"),
            why(
              n,
              length ? "This assumes one cycle through every vertex." : "This counts every vertex as its own cycle.",
              length ? "这假设只有一个经过所有顶点的圈。" : "这把每个顶点都当成了一个圈。",
            ),
            why(
              1,
              length
                ? "This counts a single vertex; following the arrows moves to a new vertex."
                : "This assumes one cycle through every vertex.",
              length ? "这只算了一个顶点；沿箭头走会到达新的顶点。" : "这假设只有一个经过所有顶点的圈。",
            ),
          ]);
          if (mistakes.length < 2) continue;
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
            mistakes,
            solution: walked(
              [
                [["Find the gcd", "求最大公约数"], t(`$\\gcd(${g}, ${n}) = ${d}$.`, `$\\gcd(${g}, ${n}) = ${d}$。`)],
                [
                  ["Length and number", "长度与个数"],
                  t(
                    `$${g}$ has order $${n / d}$, so each cycle has $${n / d}$ vertices and there are $${d}$ cycles.`,
                    `$${g}$ 的阶为 $${n / d}$，所以每个圈有 $${n / d}$ 个顶点，共有 $${d}$ 个圈。`,
                  ),
                ],
              ],
              t(
                `The cycle through $0$ is $${range(0, n / d)
                  .map((s) => mod(s * g, n))
                  .join(" \\to ")}$, and $${d} \\cdot ${n / d} = ${n}$ vertices in all.`,
                `经过 $0$ 的圈为 $${range(0, n / d)
                  .map((s) => mod(s * g, n))
                  .join(" \\to ")}$，共 $${d} \\cdot ${n / d} = ${n}$ 个顶点。`,
              ),
            ),
          });
        }
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
  intro: t(
    "In $S_3$ a rotation $r$ and a reflection $s$ satisfy $rs \\ne sr$, so $S_3$ is not abelian. In $U(8) = \\{1, 3, 5, 7\\}$ every product agrees with its reverse, such as $3 \\cdot 5 = 15 \\equiv 7$ and $5 \\cdot 3 \\equiv 7$, because multiplication of integers is commutative; so $U(8)$ is abelian.\n\nCheck: $7 \\cdot 3 = 21 \\equiv 5$ and $3 \\cdot 7 = 21 \\equiv 5 \\pmod{8}$.\n\nIn this lesson we decide whether groups are abelian, from their definitions and from their Cayley tables.",
    "在 $S_3$ 中，旋转 $r$ 与反射 $s$ 满足 $rs \\ne sr$，所以 $S_3$ 不是阿贝尔群。在 $U(8) = \\{1, 3, 5, 7\\}$ 中，每个乘积都与交换顺序后的乘积相同，例如 $3 \\cdot 5 = 15 \\equiv 7$，$5 \\cdot 3 \\equiv 7$，因为整数乘法可交换；所以 $U(8)$ 是阿贝尔群。\n\n检验：$7 \\cdot 3 = 21 \\equiv 5$，$3 \\cdot 7 = 21 \\equiv 5 \\pmod{8}$。\n\n本课我们根据定义和凯莱表判断群是否为阿贝尔群。",
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
        "To show a group is not abelian, find two elements that do not commute; to show it is abelian, show that the operation itself is commutative.\n\nIn the affine group, $f(x) = 2x$ and $g(x) = x + 1$ give $f(g(x)) = 2x + 2$ but $g(f(x)) = 2x + 1$, so it is not abelian. Groups of numbers under $+$ or $\\cdot$, and diagonal matrices, are abelian.\n\nCheck: at $x = 0$, $f(g(0)) = 2$ but $g(f(0)) = 1$.\n\n> **Watch out.** Finding one pair that commutes proves nothing: in a non-abelian group the identity commutes with everything. One pair that fails is enough to say no.",
        "要说明一个群不是阿贝尔群，就找出两个不可交换的元素；要说明它是阿贝尔群，就说明运算本身可交换。\n\n在仿射群中，$f(x) = 2x$ 与 $g(x) = x + 1$ 给出 $f(g(x)) = 2x + 2$，而 $g(f(x)) = 2x + 1$，所以它不是阿贝尔群。数在 $+$ 或 $\\cdot$ 下构成的群以及对角矩阵群都是阿贝尔群。\n\n检验：在 $x = 0$ 处，$f(g(0)) = 2$，而 $g(f(0)) = 1$。\n\n> **注意。** 找到一对可交换的元素什么也说明不了：在非阿贝尔群中单位元也与所有元素可交换。只要有一对不可交换，就可以回答否。",
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
        "A finite group is abelian exactly when its Cayley table is symmetric about the main diagonal, provided rows and columns are listed in the same order. One asymmetric pair of entries is enough to show it is not abelian.\n\nIn the table of $S_3$, row $r$, column $s$ holds $rs$ while row $s$, column $r$ holds $sr$, and these differ, so $S_3$ is not abelian. In the table of $\\mathbb{Z}_6$, every entry $a + b$ equals its mirror $b + a$.\n\nCheck: compare each entry above the diagonal with the one in the mirrored position below it; a single mismatch settles the answer.\n\n> **Watch out.** Every group table has each element once per row and column, so that tells you nothing about commutativity; only the symmetry about the main diagonal does.",
        "当行与列按相同顺序排列时，有限群是阿贝尔群当且仅当它的凯莱表关于主对角线对称。只要有一对不对称的元素，就说明它不是阿贝尔群。\n\n在 $S_3$ 的表中，第 $r$ 行第 $s$ 列为 $rs$，第 $s$ 行第 $r$ 列为 $sr$，两者不同，所以 $S_3$ 不是阿贝尔群。在 $\\mathbb{Z}_6$ 的表中，每个元素 $a + b$ 都等于它的镜像 $b + a$。\n\n检验：把主对角线上方的每个元素与它在下方的镜像位置比较；只要有一处不同就能下结论。\n\n> **注意。** 每个群的运算表都满足每行每列每个元素各出现一次，这与可交换性无关；只有关于主对角线的对称才说明问题。",
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
          solution: walked(
            [
              [
                ["Compare mirrored entries", "比较镜像位置的元素"],
                t(
                  "Rows and columns are listed in the same order, so compare each entry with the entry in the mirrored position across the main diagonal.",
                  "行与列按相同顺序排列，所以把每个元素与它关于主对角线的镜像位置上的元素比较。",
                ),
              ],
              [["Conclude", "下结论"], t(`${g.abelian ? "Yes" : "No"}. ${reason.en}`, `${g.abelian ? "是" : "否"}。${reason["zh-CN"]}`)],
            ],
            g.abelian
              ? t(
                  `For example, $${L[a]} \\ast ${L[b]} = ${L[g.op(a, b)]}$ and $${L[b]} \\ast ${L[a]} = ${L[g.op(b, a)]}$ agree.`,
                  `例如 $${L[a]} \\ast ${L[b]} = ${L[g.op(a, b)]}$ 与 $${L[b]} \\ast ${L[a]} = ${L[g.op(b, a)]}$ 相同。`,
                )
              : t(
                  `Row $${L[a]}$, column $${L[b]}$ holds $${L[g.op(a, b)]}$, but row $${L[b]}$, column $${L[a]}$ holds $${L[g.op(b, a)]}$.`,
                  `第 $${L[a]}$ 行第 $${L[b]}$ 列为 $${L[g.op(a, b)]}$，而第 $${L[b]}$ 行第 $${L[a]}$ 列为 $${L[g.op(b, a)]}$。`,
                ),
          ),
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
