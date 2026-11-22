import type { Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, linear, num, paren, poly, Q, simplifyRadical } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, pointProblem, steps, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

// Algebra II: number systems (the real numbers and complex numbers) and
// polynomials (least common multiples, identities, factoring, division,
// polynomial equations, the factor, remainder and rational roots theorems,
// and graphs of polynomials).

/** isSquare tells whether n is the square of an integer. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** isCube tells whether n is the cube of an integer. */
const isCube = (n: number) => Math.round(Math.cbrt(n)) ** 3 === n;

/** front writes an integer factor before a variable or parentheses: "", "-", "3" or "-2". */
const front = (c: number) => (c === 1 ? "" : c === -1 ? "-" : String(c));

/** cx writes the complex number a + bi in standard form: "3 - 2i", "-i", "4". */
const cx = (a: number, b: number) => poly([a, ""], [b, "i"]);

/** imag writes c·i·√m: "3i", "-i", "2i\sqrt{5}". */
const imag = (c: number, m: number) => poly([c, m === 1 ? "i" : `i\\sqrt{${m}}`]);

/** cxr writes a + c·i·√m in standard form: "-1 + 2i\sqrt{3}". */
const cxr = (a: number, c: number, m: number) => poly([a, ""], [c, m === 1 ? "i" : `i\\sqrt{${m}}`]);

/** rad writes c·√m: "3\sqrt{2}", "-\sqrt{5}", "7". */
const rad = (c: number, m: number) => (m === 1 ? String(c) : poly([c, `\\sqrt{${m}}`]));

/** sqrtParts writes √n as c√m with m square-free. */
const sqrtParts = (n: number): [number, number] => simplifyRadical(n);

/** fac writes the factor (x − r). */
const fac = (r: number, v = "x") => `(${linear(1, -r, v)})`;

/** distinctInts draws n distinct integers in [lo, hi], none in avoid. */
function distinctInts(rng: Rng, n: number, lo: number, hi: number, avoid: readonly number[] = []): number[] {
  const pool = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((x) => !avoid.includes(x));
  return rng.sample(pool, n);
}

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps (one step goes unlabelled) followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], say, lines = []], i) => {
        const head = parts.length > 1 ? `${stepLabel(i + 1, en, zh)[locale]} ` : "";
        return `${head}${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** threeTex lists three numbers in LaTeX as "$a$, $b$ and $c$" in each locale. */
const threeTex = (cs: readonly { readonly tex: string }[]): Text =>
  t(`$${cs[0]!.tex}$, $${cs[1]!.tex}$ and $${cs[2]!.tex}$`, `$${cs[0]!.tex}$、$${cs[1]!.tex}$ 和 $${cs[2]!.tex}$`);

// Unit: number systems. Module: the real number system.

const setNames: readonly Text[] = [
  t("Natural numbers", "自然数（正整数）"),
  t("Whole numbers", "非负整数"),
  t("Integers", "整数"),
  t("Rational numbers", "有理数"),
  t("Irrational numbers", "无理数"),
];

/** Classified is a number written in LaTeX with the smallest of the sets above that contains it. */
interface Classified {
  readonly tex: string;
  readonly kind: 0 | 1 | 2 | 3 | 4;
  readonly why: Text;
}

/** nonSquare draws an integer in [2, 60] that is not a perfect square. */
function nonSquare(rng: Rng): number {
  let n: number;
  do n = rng.int(2, 60);
  while (isSquare(n));
  return n;
}

/** classified draws a number of the given kind, written in one of several forms. */
function classified(rng: Rng, kind: 0 | 1 | 2 | 3 | 4): Classified {
  const k = rng.int(2, 12);
  switch (kind) {
    case 0: {
      const form = rng.int(0, 2);
      if (form === 0) {
        const n = rng.int(1, 60);
        return { tex: String(n), kind, why: t(`$${n}$ is a positive whole number.`, `$${n}$ 是正整数。`) };
      }
      if (form === 1) return { tex: `\\sqrt{${k * k}}`, kind, why: t(`$\\sqrt{${k * k}} = ${k}$.`, `$\\sqrt{${k * k}} = ${k}$。`) };
      const d = rng.int(2, 6);
      return { tex: `\\frac{${k * d}}{${d}}`, kind, why: t(`$\\frac{${k * d}}{${d}} = ${k}$.`, `$\\frac{${k * d}}{${d}} = ${k}$。`) };
    }
    case 1: {
      const form = rng.int(0, 2);
      const tx = form === 0 ? "0" : form === 1 ? `\\frac{0}{${k}}` : `${k} - ${k}`;
      return {
        tex: tx,
        kind,
        why: t(`$${tx} = 0$: a whole number, but not a natural number.`, `$${tx} = 0$：是非负整数，但不是正整数。`),
      };
    }
    case 2: {
      const form = rng.int(0, 2);
      if (form === 0) {
        const n = rng.int(1, 60);
        return { tex: `-${n}`, kind, why: t(`$-${n}$ is a negative integer.`, `$-${n}$ 是负整数。`) };
      }
      if (form === 1) return { tex: `-\\sqrt{${k * k}}`, kind, why: t(`$-\\sqrt{${k * k}} = -${k}$.`, `$-\\sqrt{${k * k}} = -${k}$。`) };
      const d = rng.int(2, 6);
      return { tex: `-\\frac{${k * d}}{${d}}`, kind, why: t(`$-\\frac{${k * d}}{${d}} = -${k}$.`, `$-\\frac{${k * d}}{${d}} = -${k}$。`) };
    }
    case 3: {
      const form = rng.int(0, 3);
      const s = rng.sign();
      if (form === 0) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 11);
          q = rng.int(2, 12);
        } while (gcd(p, q) !== 1);
        const tx = `${s < 0 ? "-" : ""}\\frac{${p}}{${q}}`;
        return {
          tex: tx,
          kind,
          why: t(`$${tx}$ is a quotient of integers that is not an integer.`, `$${tx}$ 是两个整数的商，但不是整数。`),
        };
      }
      if (form === 1) {
        const v = `${s < 0 ? "-" : ""}${rng.int(0, 9)}.${rng.int(1, 9)}${rng.pick(["", "5", "25", "75"])}`;
        return { tex: v, kind, why: t(`$${v}$ is a terminating decimal, so it is a fraction.`, `$${v}$ 是有限小数，可以写成分数。`) };
      }
      if (form === 2) {
        const d = rng.int(1, 9);
        const v = `0.\\overline{${d}}`;
        return { tex: v, kind, why: t(`$${v} = \\frac{${d}}{9}$ is a repeating decimal.`, `$${v} = \\frac{${d}}{9}$ 是循环小数。`) };
      }
      let p: number;
      let q: number;
      do {
        p = rng.int(1, 9);
        q = rng.int(2, 10);
      } while (gcd(p, q) !== 1);
      const v = `\\sqrt{\\frac{${p * p}}{${q * q}}}`;
      return { tex: v, kind, why: t(`$${v} = \\frac{${p}}{${q}}$.`, `$${v} = \\frac{${p}}{${q}}$。`) };
    }
    default: {
      const form = rng.int(0, 3);
      if (form === 0) {
        const n = nonSquare(rng);
        const v = `${rng.bool() ? "-" : ""}\\sqrt{${n}}`;
        return {
          tex: v,
          kind,
          why: t(
            `$${n}$ is not a perfect square, so $\\sqrt{${n}}$ is irrational.`,
            `$${n}$ 不是完全平方数，所以 $\\sqrt{${n}}$ 是无理数。`,
          ),
        };
      }
      if (form === 1) {
        const c = rng.int(2, 5);
        const v = `${c}\\pi`;
        return {
          tex: v,
          kind,
          why: t(
            "$\\pi$ is irrational, and a nonzero rational multiple of it is irrational.",
            "$\\pi$ 是无理数，它的非零有理数倍也是无理数。",
          ),
        };
      }
      if (form === 2) {
        let n: number;
        do n = rng.int(2, 40);
        while (isCube(n));
        return {
          tex: `\\sqrt[3]{${n}}`,
          kind,
          why: t(
            `$${n}$ is not a perfect cube, so $\\sqrt[3]{${n}}$ is irrational.`,
            `$${n}$ 不是完全立方数，所以 $\\sqrt[3]{${n}}$ 是无理数。`,
          ),
        };
      }
      const n = nonSquare(rng);
      const d = rng.int(2, 5);
      return {
        tex: `\\frac{\\sqrt{${n}}}{${d}}`,
        kind,
        why: t(
          `$\\sqrt{${n}}$ is irrational, and dividing it by $${d}$ keeps it irrational.`,
          `$\\sqrt{${n}}$ 是无理数，除以 $${d}$ 后仍是无理数。`,
        ),
      };
    }
  }
}

/** smallestCheck confirms that the set just below the chosen one does not contain the number. */
function smallestCheck(c: Classified): Text {
  switch (c.kind) {
    case 0:
      return t(
        `The value of $${c.tex}$ is a positive whole number, and the natural numbers are the smallest set in the list, so no smaller set is possible.`,
        `$${c.tex}$ 的值是正整数，而正整数集是列表中最小的集合，不可能更小。`,
      );
    case 1:
      return t(
        `The value of $${c.tex}$ is $0$. The natural numbers start at $1$, so they do not contain it; the whole numbers do.`,
        `$${c.tex}$ 的值是 $0$。正整数从 $1$ 开始，不包含它；非负整数包含它。`,
      );
    case 2:
      return t(
        `The value of $${c.tex}$ is negative, so the whole numbers, which have no negative numbers, do not contain it; the integers do.`,
        `$${c.tex}$ 的值是负数，而非负整数集里没有负数，不包含它；整数集包含它。`,
      );
    default:
      return t(
        `The value of $${c.tex}$ lies strictly between two integers, so the integers do not contain it; the rational numbers, the quotients of integers, do.`,
        `$${c.tex}$ 的值严格位于两个相邻整数之间，所以整数集不包含它；有理数集（整数之商）包含它。`,
      );
  }
}

/** rationalCheck confirms whether a classified number is rational. */
function rationalCheck(c: Classified): Text {
  if (c.kind < 3) {
    const set = setNames[c.kind]!;
    return t(
      `$${c.tex}$ is in the set of ${set.en.toLowerCase()}, which sits inside the rational numbers: every integer $n$ equals $\\frac{n}{1}$.`,
      `$${c.tex}$ 属于${set["zh-CN"]}集，而这个集合包含在有理数集中：每个整数 $n$ 都等于 $\\frac{n}{1}$。`,
    );
  }
  if (c.kind === 3)
    return t(
      `$${c.tex}$ equals a quotient of integers, and its decimal ends or repeats, as the decimal of every rational number does.`,
      `$${c.tex}$ 等于整数之商，它的小数是有限小数或循环小数，有理数的小数都是这样。`,
    );
  return t(
    `No simplification turns $${c.tex}$ into a quotient of integers: it is not the root of a perfect square or cube, not a fraction of integers and not a decimal that ends or repeats.`,
    `任何化简都不能把 $${c.tex}$ 变成整数之商：它不是完全平方数或完全立方数的根，不是整数之比，也不是有限小数或循环小数。`,
  );
}

export const theRealNumberSystem: TopicDef = {
  id: "the-real-number-system",
  title: t("The Real Number System", "实数系"),
  summary: t(
    "Classify numbers as natural numbers, whole numbers, integers, rational numbers and irrational numbers.",
    "把数分类为正整数（自然数）、非负整数、整数、有理数和无理数。",
  ),
  prerequisites: ["fractions-and-decimals", "square-roots-and-cube-roots"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.8.NS.A.1", "CCSS.HSN.RN.B.3"],
  intro: t(
    `Is $\\sqrt{\\frac{9}{16}}$ an integer? A fraction? Something else? Simplify it first: $\\frac{3}{4} \\cdot \\frac{3}{4} = \\frac{9}{16}$, so $\\sqrt{\\frac{9}{16}} = \\frac{3}{4}$. That is a quotient of integers but not an integer itself, so the smallest set it belongs to is the **rational numbers**.

Now try $\\sqrt{12}$. Since $3^{2} = 9 < 12 < 16 = 4^{2}$, no integer squares to $12$, and $\\sqrt{12} = 2\\sqrt{3}$ cannot be written as a quotient of integers at all: it is **irrational**. Check: $\\left(\\frac{3}{4}\\right)^{2} = \\frac{9}{16}$, as claimed.

In this lesson we sort numbers into the natural numbers, whole numbers, integers, rational numbers and irrational numbers.`,
    `$\\sqrt{\\frac{9}{16}}$ 是整数吗？是分数吗？还是别的数？先化简：$\\frac{3}{4} \\cdot \\frac{3}{4} = \\frac{9}{16}$，所以 $\\sqrt{\\frac{9}{16}} = \\frac{3}{4}$。它是整数之商，但本身不是整数，所以包含它的最小集合是**有理数**集。

再看 $\\sqrt{12}$。因为 $3^{2} = 9 < 12 < 16 = 4^{2}$，没有整数的平方等于 $12$，而 $\\sqrt{12} = 2\\sqrt{3}$ 根本不能写成整数之商：它是**无理数**。检验：$\\left(\\frac{3}{4}\\right)^{2} = \\frac{9}{16}$，与上面一致。

这节课我们把数分为正整数、非负整数、整数、有理数和无理数。`,
  ),
  knowledgePoints: [
    {
      id: "nested-sets",
      title: t("Natural numbers, whole numbers and integers", "正整数、非负整数与整数"),
      explanation: t(
        `The numbers we use sit in sets inside one another. Each new set adds the numbers the previous one was missing:

- the **natural numbers** $1, 2, 3, \\ldots$, for counting;
- the **whole numbers** $0, 1, 2, 3, \\ldots$: the natural numbers and $0$;
- the **integers** $\\ldots, -2, -1, 0, 1, 2, \\ldots$, so that every subtraction has an answer;
- the **rational numbers**: every quotient $\\frac{p}{q}$ of integers with $q \\ne 0$, so that division by a nonzero number has an answer. Examples are $\\frac{3}{4}$, $-2.5 = -\\frac{5}{2}$ and $7 = \\frac{7}{1}$.

Each set contains the ones before it. To find the smallest set containing a number, simplify it first, because its form can hide its value. For $-\\frac{12}{3}$: dividing gives $-4$, a negative integer. It is not a whole number, since it is negative, so the smallest set is the **integers**. Check: $-4 \\cdot 3 = -12$.

> **Watch out.** Classify the value, not the look: $\\sqrt{49} = 7$ is a natural number and $-\\frac{12}{3}$ is an integer. The question asks for the **smallest** set: $7$ is also rational, but the answer is the natural numbers. $0$ is a whole number but not a natural number.`,
        `我们使用的数组成一层套一层的集合，每个新集合都补上前一个集合缺少的数：

- **正整数**（自然数）$1, 2, 3, \\ldots$，用来计数；
- **非负整数** $0, 1, 2, 3, \\ldots$：正整数和 $0$；
- **整数** $\\ldots, -2, -1, 0, 1, 2, \\ldots$，使每个减法都有结果；
- **有理数**：所有整数之商 $\\frac{p}{q}$（$q \\ne 0$），使除以非零数都有结果。例如 $\\frac{3}{4}$、$-2.5 = -\\frac{5}{2}$ 和 $7 = \\frac{7}{1}$。

每个集合都包含前面的集合。要找包含某个数的最小集合，先化简，因为它的写法可能掩盖它的值。对于 $-\\frac{12}{3}$：相除得 $-4$，是负整数。它是负数，所以不是非负整数，最小的集合是**整数**集。检验：$-4 \\cdot 3 = -12$。

> **注意。** 按值分类，不要看外表：$\\sqrt{49} = 7$ 是正整数，$-\\frac{12}{3}$ 是整数。题目问的是**最小**的集合：$7$ 也是有理数，但答案是正整数集。$0$ 是非负整数，但不是正整数。`,
      ),
      keyPrerequisites: ["fractions-and-decimals"],
      generate(rng) {
        const c = classified(rng, rng.pick([0, 1, 2, 3, 0, 2, 3] as const));
        return reasoned(
          choiceProblem({
            prompt: t(`What is the smallest of these sets that contains $${c.tex}$?`, `下列集合中，包含 $${c.tex}$ 的最小集合是哪一个？`),
            options: setNames.slice(0, 4),
            correct: c.kind,
            solution: walked(
              [
                [["Simplify", "化简"], c.why],
                [
                  ["Choose the smallest set", "选出最小的集合"],
                  t(
                    `So the smallest set containing $${c.tex}$ is the ${setNames[c.kind]!.en.toLowerCase()}.`,
                    `所以包含 $${c.tex}$ 的最小集合是${setNames[c.kind]!["zh-CN"]}集。`,
                  ),
                ],
              ],
              smallestCheck(c),
            ),
          }),
          [
            ...setNames
              .slice(0, 4)
              .map((s, i) =>
                i < c.kind
                  ? ([s.en, `$${c.tex}$ is not in this set: it is too small.`, `$${c.tex}$ 不在这个集合里：这个集合太小了。`] as const)
                  : ([
                      s.en,
                      `This set contains $${c.tex}$, but a smaller one does too, and the question asks for the smallest.`,
                      `这个集合包含 $${c.tex}$，但更小的集合也包含它，而题目问的是最小的集合。`,
                    ] as const),
              ),
          ],
        );
      },
    },
    {
      id: "rational-or-irrational",
      title: t("Rational and irrational numbers", "有理数与无理数"),
      explanation: t(
        `A real number that is not rational is **irrational**: it cannot be written as a quotient of integers. The decimal of a quotient of integers always ends or repeats, because long division has only finitely many remainders; so an irrational number has a decimal that never ends and never repeats. Examples are $\\sqrt{n}$ when $n$ is a positive integer that is not a perfect square, $\\sqrt[3]{n}$ when $n$ is not a perfect cube, and $\\pi$. Together the rational and the irrational numbers form the **real numbers**.

Is $\\sqrt{\\frac{25}{4}}$ rational? Simplify: $\\sqrt{\\frac{25}{4}} = \\frac{5}{2}$, a quotient of integers, so yes. Is $\\sqrt{45}$ rational? $45$ lies between the perfect squares $36$ and $49$, so its square root is not an integer, and $\\sqrt{45} = 3\\sqrt{5}$ is irrational. Check: $\\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$.

> **Watch out.** A root sign does not make a number irrational: $\\sqrt{64} = 8$ and $\\sqrt[3]{27} = 3$ are rational. Repeating decimals such as $0.\\overline{3} = \\frac{1}{3}$ are rational. Being written with integers, as $\\sqrt{7}$ or $2\\pi$ are, does not make a number rational.`,
        `不是有理数的实数叫做**无理数**：它不能写成整数之商。整数之商的小数一定是有限小数或循环小数，因为长除法的余数只有有限多种；所以无理数的小数既不终止也不循环。例如：$n$ 是不是完全平方数的正整数时的 $\\sqrt{n}$，$n$ 不是完全立方数时的 $\\sqrt[3]{n}$，以及 $\\pi$。有理数和无理数合起来组成**实数**。

$\\sqrt{\\frac{25}{4}}$ 是有理数吗？化简：$\\sqrt{\\frac{25}{4}} = \\frac{5}{2}$，是整数之商，所以是。$\\sqrt{45}$ 是有理数吗？$45$ 介于完全平方数 $36$ 和 $49$ 之间，它的平方根不是整数，$\\sqrt{45} = 3\\sqrt{5}$ 是无理数。检验：$\\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$。

> **注意。** 有根号不代表是无理数：$\\sqrt{64} = 8$ 和 $\\sqrt[3]{27} = 3$ 都是有理数。像 $0.\\overline{3} = \\frac{1}{3}$ 这样的循环小数是有理数。用整数写出来，如 $\\sqrt{7}$ 或 $2\\pi$，并不代表它是有理数。`,
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const c = classified(rng, rng.pick([0, 2, 3, 3, 4, 4, 4] as const));
        const rational = c.kind < 4;
        const reasons: [string, string, string][] = rational
          ? [
              [
                "No",
                `Simplify before deciding: ${c.why.en} That is a quotient of integers, so it is rational.`,
                `判断之前先化简：${c.why["zh-CN"]}这是整数之商，所以是有理数。`,
              ],
            ]
          : [
              [
                "Yes",
                `Being written with integers does not make a number rational: ${c.why.en}`,
                `用整数写出来并不代表它是有理数：${c.why["zh-CN"]}`,
              ],
            ];
        return reasoned(
          choiceProblem({
            prompt: t(`Is $${c.tex}$ a rational number?`, `$${c.tex}$ 是有理数吗？`),
            options: yesNo,
            correct: rational ? 0 : 1,
            solution: walked(
              [
                [["Simplify", "化简"], c.why],
                [
                  ["Decide", "判断"],
                  rational
                    ? t(
                        "It can be written as a quotient of integers, so it is rational: the answer is yes.",
                        "它能写成整数之商，所以是有理数：答案是“是”。",
                      )
                    : t(
                        "It cannot be written as a quotient of integers, so it is irrational: the answer is no.",
                        "它不能写成整数之商，所以是无理数：答案是“否”。",
                      ),
                ],
              ],
              rationalCheck(c),
            ),
          }),
          reasons,
        );
      },
    },
    {
      id: "the-odd-one-out",
      title: t("Finding the irrational number", "找出无理数"),
      explanation: t(
        `In a list where all numbers but one are of the same kind, simplify every number and the odd one shows itself. Roots of perfect squares and perfect cubes, fractions that reduce to integers, and decimals that end or repeat are all rational; roots of other integers and multiples of $\\pi$ are irrational.

Which of $\\sqrt[3]{64}$, $\\frac{14}{7}$, $\\sqrt{30}$, $0.\\overline{2}$ is irrational? Simplify: $\\sqrt[3]{64} = 4$, $\\frac{14}{7} = 2$, $0.\\overline{2} = \\frac{2}{9}$, all rational. $30$ lies between $25$ and $36$, so $\\sqrt{30}$ is irrational. Check: exactly one number in the list is irrational, as the question promises.

> **Watch out.** Simplify every option before choosing: a number that looks complicated, such as $\\sqrt{\\frac{4}{9}}$, may be rational, and one that looks simple, such as $\\sqrt{2}$, is not. Read whether the question asks for the rational or the irrational one.`,
        `一组数中，除一个以外都是同一类时，把每个数化简，那个与众不同的就显现出来了。完全平方数和完全立方数的根、能约成整数的分数、有限小数和循环小数都是有理数；其他整数的根和 $\\pi$ 的倍数是无理数。

$\\sqrt[3]{64}$、$\\frac{14}{7}$、$\\sqrt{30}$、$0.\\overline{2}$ 中哪个是无理数？化简：$\\sqrt[3]{64} = 4$，$\\frac{14}{7} = 2$，$0.\\overline{2} = \\frac{2}{9}$，都是有理数。$30$ 介于 $25$ 和 $36$ 之间，所以 $\\sqrt{30}$ 是无理数。检验：列表中恰好有一个无理数，与题意相符。

> **注意。** 选择之前把每个选项都化简：看起来复杂的数，如 $\\sqrt{\\frac{4}{9}}$，可能是有理数；看起来简单的数，如 $\\sqrt{2}$，却不是。看清题目问的是有理数还是无理数。`,
      ),
      generate(rng) {
        const findIrrational = rng.bool(0.6);
        const odd = classified(rng, findIrrational ? 4 : rng.pick([0, 2, 3] as const));
        const others: Classified[] = [];
        while (others.length < 3) {
          const c = classified(rng, findIrrational ? rng.pick([0, 1, 2, 3] as const) : 4);
          if (c.tex !== odd.tex && others.every((o) => o.tex !== c.tex)) others.push(c);
        }
        const correct = rng.int(0, 3);
        const all = [...others];
        all.splice(correct, 0, odd);
        const reasons: [string, string, string][] = others.map((c) => [
          `$${c.tex}$`,
          `${c.why.en} So it is ${findIrrational ? "rational" : "irrational"}.`,
          `${c.why["zh-CN"]}所以它是${findIrrational ? "有理数" : "无理数"}。`,
        ]);
        return reasoned(
          choiceProblem({
            prompt: findIrrational
              ? t(`Which of these numbers is irrational?${listTex(all)}`, `下列哪个数是无理数？${listTex(all)}`)
              : t(`Which of these numbers is rational?${listTex(all)}`, `下列哪个数是有理数？${listTex(all)}`),
            options: all.map((c) => same(`$${c.tex}$`)),
            correct,
            solution: walked(
              [
                [["Simplify each number", "逐个化简"], t(all.map((c) => c.why.en).join(" "), all.map((c) => c.why["zh-CN"]).join(""))],
                [
                  ["Pick the odd one out", "找出与众不同的数"],
                  t(
                    `Only $${odd.tex}$ is ${findIrrational ? "irrational" : "rational"}.`,
                    `只有 $${odd.tex}$ 是${findIrrational ? "无理数" : "有理数"}。`,
                  ),
                ],
              ],
              t(
                `Exactly one number in the list is ${findIrrational ? "irrational" : "rational"}, as the question requires: the other three, ${threeTex(others).en}, are all ${findIrrational ? "rational" : "irrational"}.`,
                `列表中恰好有一个${findIrrational ? "无理数" : "有理数"}，与题意相符：其余三个数 ${threeTex(others)["zh-CN"]} 都是${findIrrational ? "有理数" : "无理数"}。`,
              ),
            ),
          }),
          reasons,
        );
      },
    },
  ],
};

/** listTex lists the options of a choice in display math, so the prompt names them. */
const listTex = (all: readonly { readonly tex: string }[]) => `\n\n$$${all.map((c) => c.tex).join(", \\quad ")}$$`;

/** Repeating is a decimal 0.a(R)… with a non-repeating part a and a repeating block R, as digit strings. */
interface Repeating {
  readonly whole: number;
  readonly a: string;
  readonly r: string;
}

/** repeatingTex writes a repeating decimal: "2.1\overline{36}". */
const repeatingTex = (d: Repeating) => `${d.whole}.${d.a}\\overline{${d.r}}`;

/** repeatingValue is the exact value of a repeating decimal. */
function repeatingValue(d: Repeating): Q {
  const n = d.a.length;
  const m = d.r.length;
  const all = Number(`${d.a}${d.r}`);
  const head = d.a === "" ? 0 : Number(d.a);
  const frac = Q.of(all - head, 10 ** n * (10 ** m - 1));
  return frac.add(Q.of(d.whole));
}

/** block draws a repeating block of m digits that is not all zeros, not all nines and not a repetition of a shorter block. */
function block(rng: Rng, m: number): string {
  let s: string;
  do s = Array.from({ length: m }, () => rng.int(0, 9)).join("");
  while (/^0+$/.test(s) || /^9+$/.test(s) || (m > 1 && new Set(s).size === 1) || (m === 4 && s.slice(0, 2) === s.slice(2)));
  return s;
}

/** repeatingLines writes the multiplications that line up the tails, then the subtraction that turns a repeating decimal into a fraction. */
function repeatingLines(d: Repeating): [setup: string[], subtract: string[]] {
  const n = d.a.length;
  const v = repeatingValue(d);
  const big = 10 ** (n + d.r.length);
  const small = 10 ** n;
  const intBig = Number(`${d.whole}${d.a}${d.r}`);
  const intSmall = Number(`${d.whole}${d.a}`);
  const top = intBig - intSmall;
  const bottom = big - small;
  return [
    [`x = ${repeatingTex(d)}`, `${big}x = ${intBig}.\\overline{${d.r}}`, ...(n > 0 ? [`${small}x = ${intSmall}.\\overline{${d.r}}`] : [])],
    [
      `${big}x - ${small === 1 ? "" : small}x = ${intBig} - ${intSmall}`,
      `${bottom}x = ${top}`,
      `x = \\frac{${top}}{${bottom}}${gcd(top, bottom) === 1 ? "" : ` = ${num(v)}`}`,
    ],
  ];
}

/** repeatingCheck divides the fraction back out and confirms it is in lowest terms. */
function repeatingCheck(d: Repeating): Text {
  const v = repeatingValue(d);
  return t(
    `Dividing back, $${v.n} \\div ${v.d} = ${repeatingTex(d)}$, and $${v.n}$ and $${v.d}$ have no common factor, so the fraction is in lowest terms.`,
    `反过来相除，$${v.n} \\div ${v.d} = ${repeatingTex(d)}$，且 $${v.n}$ 与 $${v.d}$ 没有公因数，所以是最简分数。`,
  );
}

/** subtractStep is the step that subtracts the two lined-up multiples of a repeating decimal. */
const subtractStep = (d: Repeating): Step => [
  ["Subtract", "相减"],
  t(
    "The two right-hand sides have the same digits after the point, so subtracting cancels the endless tail and leaves an equation with integers:",
    "两个等式右边小数点后的数字完全相同，相减就消去了无尽的循环部分，只剩整数：",
  ),
  repeatingLines(d)[1],
];

export const writingRepeatingDecimalsAsFractions: TopicDef = {
  id: "writing-repeating-decimals-as-fractions",
  title: t("Writing Repeating Decimals as Fractions", "把循环小数化成分数"),
  summary: t(
    "Write a repeating decimal as a fraction by multiplying by a power of ten and subtracting.",
    "乘以 10 的幂再相减，把循环小数化成分数。",
  ),
  prerequisites: ["the-real-number-system", "one-step-equations-multiplication"],
  encompasses: [
    { topic: "fractions-and-decimals", weight: 0.3 },
    { topic: "one-step-equations-multiplication", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.8.NS.A.1"],
  intro: t(
    `Every fraction becomes a decimal that ends or repeats, and the reverse is true too. Take $x = 0.\\overline{5} = 0.555\\ldots$. Multiplying by $10$ shifts the digits one place, $10x = 5.555\\ldots$, but the tail after the point is still all fives. Subtracting removes it:

$$10x - x = 5.555\\ldots - 0.555\\ldots \\quad\\Rightarrow\\quad 9x = 5 \\quad\\Rightarrow\\quad x = \\frac{5}{9}.$$

Check: $5 \\div 9 = 0.555\\ldots$.

In this lesson we turn repeating decimals, with or without a whole part and with digits before the repetition, into fractions in lowest terms.`,
    `每个分数都能化成有限小数或循环小数，反过来也成立。设 $x = 0.\\overline{5} = 0.555\\ldots$。乘以 $10$ 把数字移动一位，$10x = 5.555\\ldots$，而小数点后仍然全是 $5$。相减就把它消去了：

$$10x - x = 5.555\\ldots - 0.555\\ldots \\quad\\Rightarrow\\quad 9x = 5 \\quad\\Rightarrow\\quad x = \\frac{5}{9}$$

检验：$5 \\div 9 = 0.555\\ldots$。

这节课我们把循环小数（包括有整数部分的、循环节前还有其他数字的）化成最简分数。`,
  ),
  knowledgePoints: [
    {
      id: "purely-repeating",
      title: t("Purely repeating decimals", "纯循环小数"),
      explanation: t(
        `A bar marks the digits that repeat: $0.\\overline{36} = 0.363636\\ldots$. The trick is to make two numbers with exactly the same endless tail, so that subtracting them leaves only integers. Call the decimal $x$ and multiply by $10^{m}$, where $m$ is the number of repeating digits: this shifts the point past one full block, and the tail lines up with the tail of $x$.

For $x = 0.\\overline{27}$, two digits repeat, so multiply by $100$:

$$\\begin{aligned} 100x &= 27.\\overline{27} \\\\ x &= 0.\\overline{27} \\\\ 99x &= 27 \\end{aligned}$$

So $x = \\frac{27}{99} = \\frac{3}{11}$. Check: $3 \\div 11 = 0.2727\\ldots$.

> **Watch out.** $0.\\overline{27}$ is not $\\frac{27}{100}$: that is $0.27$, which ends. Multiply by $10^{m}$ for $m$ repeating digits, not always by $10$; the denominator is then $99$, not $100$ or $101$. Reduce the fraction to lowest terms.`,
        `横线标出循环的数字：$0.\\overline{36} = 0.363636\\ldots$。诀窍是造出两个小数部分完全相同的数，相减后只剩整数。设这个小数为 $x$，乘以 $10^{m}$，其中 $m$ 是循环节的位数：这把小数点移过一个完整的循环节，小数部分与 $x$ 的小数部分对齐。

对 $x = 0.\\overline{27}$，循环节有两位，所以乘以 $100$：

$$\\begin{aligned} 100x &= 27.\\overline{27} \\\\ x &= 0.\\overline{27} \\\\ 99x &= 27 \\end{aligned}$$

所以 $x = \\frac{27}{99} = \\frac{3}{11}$。检验：$3 \\div 11 = 0.2727\\ldots$。

> **注意。** $0.\\overline{27}$ 不是 $\\frac{27}{100}$：那是有限小数 $0.27$。循环节有 $m$ 位就乘以 $10^{m}$，不是总乘以 $10$；这时分母是 $99$，不是 $100$ 或 $101$。结果要约成最简分数。`,
      ),
      generate(rng) {
        const m = rng.pick([1, 2, 2, 3]);
        const d: Repeating = { whole: 0, a: "", r: block(rng, m) };
        const v = repeatingValue(d);
        const R = Number(d.r);
        return numberProblem({
          prompt: t(`Write $${repeatingTex(d)}$ as a fraction in lowest terms.`, `把 $${repeatingTex(d)}$ 化成最简分数。`),
          answer: v,
          form: "fraction",
          wrong: [Q.of(R, 10 ** m), Q.of(R, 10 ** m + 1), Q.of(R, 9 * m)],
          solution: walked(
            [
              [
                ["Line up the tails", "对齐循环部分"],
                t(
                  `Let $x = ${repeatingTex(d)}$. ${m === 1 ? "One digit repeats" : `$${m}$ digits repeat`}, so multiply by $${10 ** m}$ to shift the point past one full block:`,
                  `设 $x = ${repeatingTex(d)}$。循环节有 ${m} 位，所以乘以 $${10 ** m}$，把小数点移过一个完整的循环节：`,
                ),
                repeatingLines(d)[0],
              ],
              subtractStep(d),
            ],
            repeatingCheck(d),
          ),
        });
      },
    },
    {
      id: "with-a-whole-part",
      title: t("Repeating decimals greater than 1", "大于 1 的循环小数"),
      explanation: t(
        `A whole-number part changes nothing in the method: multiplying by $10^{m}$ still lines up the tails, and the whole part simply moves along into the integers on the right.

For $x = 3.\\overline{4}$, one digit repeats, so multiply by $10$:

$$\\begin{aligned} 10x &= 34.\\overline{4} \\\\ x &= 3.\\overline{4} \\\\ 9x &= 31 \\end{aligned}$$

so $x = \\frac{31}{9}$. Check: $31 \\div 9 = 3.444\\ldots$, and the fraction is a little more than $3$, as it should be.

> **Watch out.** Keep the whole part: $3.\\overline{4}$ is not $\\frac{4}{9}$, which is less than $1$. Subtract the whole of $x$, not just its decimal part: $34 - 3 = 31$. Dividing by $10$ instead of $9$ gives $\\frac{34}{10} = 3.4$, which ends.`,
        `有整数部分并不改变方法：乘以 $10^{m}$ 仍然让小数部分对齐，整数部分只是跟着进入右边的整数。

对 $x = 3.\\overline{4}$，循环节有一位，所以乘以 $10$：

$$\\begin{aligned} 10x &= 34.\\overline{4} \\\\ x &= 3.\\overline{4} \\\\ 9x &= 31 \\end{aligned}$$

所以 $x = \\frac{31}{9}$。检验：$31 \\div 9 = 3.444\\ldots$，这个分数比 $3$ 稍大，符合预期。

> **注意。** 不要丢掉整数部分：$3.\\overline{4}$ 不是 $\\frac{4}{9}$，后者小于 $1$。要减去整个 $x$，不只是它的小数部分：$34 - 3 = 31$。除以 $10$ 而不是 $9$ 会得到 $\\frac{34}{10} = 3.4$，那是有限小数。`,
      ),
      generate(rng) {
        const m = rng.pick([1, 2, 2]);
        const d: Repeating = { whole: rng.int(1, 9), a: "", r: block(rng, m) };
        const v = repeatingValue(d);
        const R = Number(d.r);
        return numberProblem({
          prompt: t(`Write $${repeatingTex(d)}$ as a fraction in lowest terms.`, `把 $${repeatingTex(d)}$ 化成最简分数。`),
          answer: v,
          form: "fraction",
          wrong: [Q.of(d.whole * 10 ** m + R, 10 ** m), Q.of(R, 10 ** m - 1), Q.of(d.whole * 10 ** m + R, 10 ** m - 1)],
          solution: walked(
            [
              [
                ["Line up the tails", "对齐循环部分"],
                t(
                  `Let $x = ${repeatingTex(d)}$. ${m === 1 ? "One digit repeats" : `$${m}$ digits repeat`}, so multiply by $${10 ** m}$; the whole part $${d.whole}$ moves along with the digits:`,
                  `设 $x = ${repeatingTex(d)}$。循环节有 ${m} 位，所以乘以 $${10 ** m}$；整数部分 $${d.whole}$ 随数字一起移动：`,
                ),
                repeatingLines(d)[0],
              ],
              subtractStep(d),
            ],
            repeatingCheck(d),
          ),
        });
      },
    },
    {
      id: "delayed-repetition",
      title: t("Digits before the repetition", "循环之前有其他数字"),
      explanation: t(
        `When some digits come before the repeating block, as in $0.1\\overline{6} = 0.1666\\ldots$, multiplying $x$ itself does not line up with $x$: the tail of $x$ still contains the non-repeating digit. So use two multiples of $x$ whose decimal parts are both just the repeating tail: one moves the non-repeating digits in front of the point, the other moves one more full block.

For $x = 0.3\\overline{18}$: $10x = 3.\\overline{18}$ and $1000x = 318.\\overline{18}$ have the same tail, so

$$\\begin{aligned} 1000x &= 318.\\overline{18} \\\\ 10x &= 3.\\overline{18} \\\\ 990x &= 315 \\end{aligned}$$

and $x = \\frac{315}{990} = \\frac{7}{22}$. Check: $7 \\div 22 = 0.31818\\ldots$.

> **Watch out.** Subtracting $x$ instead of $10x$ leaves the non-repeating digit in the tail, so nothing cancels. The denominator is $990$, not $999$ or $1000$. Reduce the fraction at the end.`,
        `当循环节之前还有其他数字时，例如 $0.1\\overline{6} = 0.1666\\ldots$，直接把 $x$ 乘以 10 的幂与 $x$ 对不齐：$x$ 的小数部分还包含不循环的数字。所以取 $x$ 的两个倍数，使它们的小数部分都只剩循环部分：一个把不循环的数字移到小数点前，另一个再多移一个完整的循环节。

对 $x = 0.3\\overline{18}$：$10x = 3.\\overline{18}$ 与 $1000x = 318.\\overline{18}$ 的小数部分相同，所以

$$\\begin{aligned} 1000x &= 318.\\overline{18} \\\\ 10x &= 3.\\overline{18} \\\\ 990x &= 315 \\end{aligned}$$

得 $x = \\frac{315}{990} = \\frac{7}{22}$。检验：$7 \\div 22 = 0.31818\\ldots$。

> **注意。** 减去 $x$ 而不是 $10x$，小数部分里还留着不循环的数字，什么也消不掉。分母是 $990$，不是 $999$ 或 $1000$。最后要约分。`,
      ),
      generate(rng) {
        const m = rng.pick([1, 1, 2]);
        let a: string;
        let r: string;
        do {
          a = String(rng.int(0, 9));
          r = block(rng, m);
        } while (a === r.slice(-1));
        const d: Repeating = { whole: 0, a, r };
        const v = repeatingValue(d);
        const all = Number(`${a}${r}`);
        return numberProblem({
          prompt: t(`Write $${repeatingTex(d)}$ as a fraction in lowest terms.`, `把 $${repeatingTex(d)}$ 化成最简分数。`),
          answer: v,
          form: "fraction",
          wrong: [Q.of(all, 10 ** (m + 1) - 1), Q.of(all, 10 ** (m + 1)), Q.of(all, 10 * (10 ** m - 1))],
          solution: walked(
            [
              [
                ["Line up the tails", "对齐循环部分"],
                t(
                  `Let $x = ${repeatingTex(d)}$. Multiply by $10$ to move the non-repeating digit in front of the point, and by $${10 ** (m + 1)}$ to move one more block; both results have the same tail:`,
                  `设 $x = ${repeatingTex(d)}$。乘以 $10$ 把不循环的数字移到小数点前，乘以 $${10 ** (m + 1)}$ 再多移一个循环节；两个结果的小数部分相同：`,
                ),
                repeatingLines(d)[0],
              ],
              subtractStep(d),
            ],
            repeatingCheck(d),
          ),
        });
      },
    },
  ],
};

/** Combo is an expression built from rational and irrational numbers, with whether its value is rational. */
interface Combo {
  readonly tex: string;
  readonly rational: boolean;
  readonly why: Text;
  readonly check: Text;
}

/** combo draws a sum or product of rational and irrational numbers. */
function combo(rng: Rng, rational?: boolean): Combo {
  for (;;) {
    const c = comboOnce(rng);
    if (rational === undefined || c.rational === rational) return c;
  }
}

function comboOnce(rng: Rng): Combo {
  const kind = rng.int(0, 6);
  const n = nonSquare(rng);
  const p = rng.int(1, 9);
  const q = rng.int(2, 9);
  const frac = gcd(p, q) === 1 ? `\\frac{${p}}{${q}}` : String(p);
  switch (kind) {
    case 0:
      return {
        tex: `${frac} + \\sqrt{${n}}`,
        rational: false,
        why: t(
          `$\\sqrt{${n}}$ is irrational, and a rational number plus an irrational number is irrational.`,
          `$\\sqrt{${n}}$ 是无理数，有理数加无理数是无理数。`,
        ),
        check: t(
          `If the sum were a rational number $r$, then $\\sqrt{${n}} = r - ${frac}$ would be rational too; but $${n}$ is not a perfect square.`,
          `如果和是有理数 $r$，那么 $\\sqrt{${n}} = r - ${frac}$ 也是有理数；但 $${n}$ 不是完全平方数。`,
        ),
      };
    case 1:
      return {
        tex: `${frac}\\sqrt{${n}}`,
        rational: false,
        why: t(
          `$\\sqrt{${n}}$ is irrational, and a nonzero rational number times an irrational number is irrational.`,
          `$\\sqrt{${n}}$ 是无理数，非零有理数乘无理数是无理数。`,
        ),
        check: t(
          `If the product were a rational number $r$, then $\\sqrt{${n}} = r \\div ${frac}$ would be rational too; but $${n}$ is not a perfect square.`,
          `如果积是有理数 $r$，那么 $\\sqrt{${n}} = r \\div ${frac}$ 也是有理数；但 $${n}$ 不是完全平方数。`,
        ),
      };
    case 2: {
      const s = rng.int(1, 4);
      const k = rng.int(1, 4);
      const base = rng.pick([2, 3, 5, 6, 7]);
      const good = rng.bool();
      const a = base * s * s;
      const b = good ? base * k * k : nonSquare(rng) * base;
      const prod = a * b;
      const rational = isSquare(prod);
      const [c, m] = sqrtParts(prod);
      return {
        tex: `\\sqrt{${a}} \\cdot \\sqrt{${b}}`,
        rational,
        why: t(
          `$\\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${prod}} = ${rad(c, m)}$, which is ${rational ? "rational" : "irrational"}.`,
          `$\\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${prod}} = ${rad(c, m)}$，它是${rational ? "有理数" : "无理数"}。`,
        ),
        check: rational
          ? t(
              `$${c}^{2} = ${prod}$, so $\\sqrt{${prod}} = ${c}$ exactly.`,
              `$${c}^{2} = ${prod}$，所以 $\\sqrt{${prod}} = ${c}$ 恰好是整数。`,
            )
          : t(
              `$${prod}$ lies between the perfect squares $${Math.floor(Math.sqrt(prod)) ** 2}$ and $${(Math.floor(Math.sqrt(prod)) + 1) ** 2}$, so its square root is not an integer, and hence irrational.`,
              `$${prod}$ 介于完全平方数 $${Math.floor(Math.sqrt(prod)) ** 2}$ 与 $${(Math.floor(Math.sqrt(prod)) + 1) ** 2}$ 之间，它的平方根不是整数，所以是无理数。`,
            ),
      };
    }
    case 3: {
      const a = rng.int(1, 9);
      const b = rng.int(1, 9);
      return {
        tex: `(${a} + \\sqrt{${n}}) + (${b} - \\sqrt{${n}})`,
        rational: true,
        why: t(`The irrational parts cancel: the sum is $${a + b}$, which is rational.`, `无理部分相互抵消：和为 $${a + b}$，是有理数。`),
        check: t(
          `Regrouping, $(${a} + ${b}) + (\\sqrt{${n}} - \\sqrt{${n}}) = ${a + b} + 0 = ${a + b}$.`,
          `重新分组：$(${a} + ${b}) + (\\sqrt{${n}} - \\sqrt{${n}}) = ${a + b} + 0 = ${a + b}$。`,
        ),
      };
    }
    case 4: {
      const k = rng.int(2, 4);
      const base = rng.pick([2, 3, 5, 6, 7, 10]);
      const zero = rng.bool();
      const c2 = zero ? k : k + rng.pick([-1, 1]);
      const diff = k - c2;
      return {
        tex: `\\sqrt{${base * k * k}} - ${c2 === 1 ? "" : c2}\\sqrt{${base}}`,
        rational: zero,
        check: t(
          `$${k}^{2} \\cdot ${base} = ${base * k * k}$, so $\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$, and $${k}\\sqrt{${base}} - ${c2}\\sqrt{${base}} = (${k} - ${c2})\\sqrt{${base}} = ${zero ? "0" : rad(diff, base)}$${zero ? "" : `, a nonzero rational multiple of the irrational $\\sqrt{${base}}$`}.`,
          `$${k}^{2} \\cdot ${base} = ${base * k * k}$，所以 $\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$，而 $${k}\\sqrt{${base}} - ${c2}\\sqrt{${base}} = (${k} - ${c2})\\sqrt{${base}} = ${zero ? "0" : rad(diff, base)}$${zero ? "" : `，是无理数 $\\sqrt{${base}}$ 的非零有理数倍`}。`,
        ),
        why: zero
          ? t(
              `$\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$, so the difference is $0$, which is rational.`,
              `$\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$，所以差为 $0$，是有理数。`,
            )
          : t(
              `$\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$, so the difference is $${rad(diff, base)}$, which is irrational.`,
              `$\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$，所以差为 $${rad(diff, base)}$，是无理数。`,
            ),
      };
    }
    case 5: {
      const k = rng.int(2, 5);
      const base = rng.pick([2, 3, 5, 6, 7]);
      return {
        tex: `\\frac{\\sqrt{${base * k * k}}}{\\sqrt{${base}}}`,
        rational: true,
        why: t(
          `$\\frac{\\sqrt{${base * k * k}}}{\\sqrt{${base}}} = \\sqrt{${k * k}} = ${k}$, which is rational.`,
          `$\\frac{\\sqrt{${base * k * k}}}{\\sqrt{${base}}} = \\sqrt{${k * k}} = ${k}$，是有理数。`,
        ),
        check: t(
          `$\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$, and $${k}\\sqrt{${base}} \\div \\sqrt{${base}} = ${k}$.`,
          `$\\sqrt{${base * k * k}} = ${k}\\sqrt{${base}}$，而 $${k}\\sqrt{${base}} \\div \\sqrt{${base}} = ${k}$。`,
        ),
      };
    }
    default: {
      const a = rng.int(2, 9);
      const b = rng.int(2, 9);
      return {
        tex: `\\sqrt{${a * a}} + \\frac{${b}}{${b + 1}}`,
        rational: true,
        why: t(`$\\sqrt{${a * a}} = ${a}$, and a sum of rational numbers is rational.`, `$\\sqrt{${a * a}} = ${a}$，有理数之和是有理数。`),
        check: t(
          `$${a} + \\frac{${b}}{${b + 1}} = \\frac{${a * (b + 1) + b}}{${b + 1}}$, a quotient of integers.`,
          `$${a} + \\frac{${b}}{${b + 1}} = \\frac{${a * (b + 1) + b}}{${b + 1}}$，是整数之商。`,
        ),
      };
    }
  }
}

const alwaysOptions: readonly Text[] = [
  t("Always rational", "一定是有理数"),
  t("Always irrational", "一定是无理数"),
  t("Can be either", "两种情况都可能"),
];

/** Rule is a general statement about a sum or product of numbers of given kinds, with its answer. */
interface Rule {
  readonly en: string;
  readonly zh: string;
  readonly op: (a: string, b: string) => string;
  readonly answer: 0 | 1 | 2;
  readonly why: Text;
  readonly check: Text;
}

const rules: readonly Rule[] = [
  {
    en: "rational, and $B$ is irrational",
    zh: "是有理数，$B$ 是无理数",
    op: (a, b) => `${a} + ${b}`,
    answer: 1,
    why: t(
      "If $A + B$ were rational, then $B = (A + B) - A$ would be a difference of rational numbers, hence rational. So $A + B$ is always irrational.",
      "如果 $A + B$ 是有理数，那么 $B = (A + B) - A$ 是两个有理数之差，也是有理数，矛盾。所以 $A + B$ 一定是无理数。",
    ),
    check: t(
      "For example, $A = 1$ and $B = \\sqrt{2}$ give $1 + \\sqrt{2} \\approx 2.414\\ldots$, which is irrational.",
      "例如 $A = 1$，$B = \\sqrt{2}$ 时得 $1 + \\sqrt{2} \\approx 2.414\\ldots$，是无理数。",
    ),
  },
  {
    en: "rational, and $B$ is irrational",
    zh: "是有理数，$B$ 是无理数",
    op: (a, b) => `${a} - ${b}`,
    answer: 1,
    why: t(
      "If $A - B$ were rational, then $B = A - (A - B)$ would be rational. So $A - B$ is always irrational.",
      "如果 $A - B$ 是有理数，那么 $B = A - (A - B)$ 也是有理数，矛盾。所以 $A - B$ 一定是无理数。",
    ),
    check: t(
      "For example, $A = 1$ and $B = \\sqrt{2}$ give $1 - \\sqrt{2} \\approx -0.414\\ldots$, which is irrational.",
      "例如 $A = 1$，$B = \\sqrt{2}$ 时得 $1 - \\sqrt{2} \\approx -0.414\\ldots$，是无理数。",
    ),
  },
  {
    en: "a nonzero rational number, and $B$ is irrational",
    zh: "是非零有理数，$B$ 是无理数",
    op: (a, b) => `${a}${b}`,
    answer: 1,
    why: t(
      "If $AB$ were rational, then $B = \\frac{AB}{A}$ would be a quotient of rational numbers, hence rational. So $AB$ is always irrational.",
      "如果 $AB$ 是有理数，那么 $B = \\frac{AB}{A}$ 是有理数之商，也是有理数，矛盾。所以 $AB$ 一定是无理数。",
    ),
    check: t(
      "For example, $A = 3$ and $B = \\sqrt{2}$ give $3\\sqrt{2} = \\sqrt{18}$, and $18$ is not a perfect square, so it is irrational.",
      "例如 $A = 3$，$B = \\sqrt{2}$ 时得 $3\\sqrt{2} = \\sqrt{18}$，而 $18$ 不是完全平方数，所以是无理数。",
    ),
  },
  {
    en: "rational, and $B$ is irrational",
    zh: "是有理数，$B$ 是无理数",
    op: (a, b) => `${a}${b}`,
    answer: 2,
    why: t(
      "If $A = 0$, then $AB = 0$ is rational; if $A = 1$ and $B = \\sqrt{2}$, then $AB = \\sqrt{2}$ is irrational. It can be either.",
      "若 $A = 0$，则 $AB = 0$ 是有理数；若 $A = 1$，$B = \\sqrt{2}$，则 $AB = \\sqrt{2}$ 是无理数。两种情况都可能。",
    ),
    check: t(
      "The two examples, $0 \\cdot \\sqrt{2} = 0$ and $1 \\cdot \\sqrt{2} = \\sqrt{2}$, both meet the conditions and give different kinds, so neither always-answer is true.",
      "两个例子 $0 \\cdot \\sqrt{2} = 0$ 和 $1 \\cdot \\sqrt{2} = \\sqrt{2}$ 都满足条件，却得到不同类型的数，所以两个“一定”都不成立。",
    ),
  },
  {
    en: "irrational, and $B$ is irrational",
    zh: "是无理数，$B$ 也是无理数",
    op: (a, b) => `${a} + ${b}`,
    answer: 2,
    why: t(
      "$\\sqrt{2} + (-\\sqrt{2}) = 0$ is rational, but $\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$ is irrational. It can be either.",
      "$\\sqrt{2} + (-\\sqrt{2}) = 0$ 是有理数，而 $\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$ 是无理数。两种情况都可能。",
    ),
    check: t(
      "The two examples, $\\sqrt{2} + (-\\sqrt{2}) = 0$ and $\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$, both meet the conditions and give different kinds, so neither always-answer is true.",
      "两个例子 $\\sqrt{2} + (-\\sqrt{2}) = 0$ 和 $\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$ 都满足条件，却得到不同类型的数，所以两个“一定”都不成立。",
    ),
  },
  {
    en: "irrational, and $B$ is irrational",
    zh: "是无理数，$B$ 也是无理数",
    op: (a, b) => `${a}${b}`,
    answer: 2,
    why: t(
      "$\\sqrt{2} \\cdot \\sqrt{2} = 2$ is rational, but $\\sqrt{2} \\cdot \\sqrt{3} = \\sqrt{6}$ is irrational. It can be either.",
      "$\\sqrt{2} \\cdot \\sqrt{2} = 2$ 是有理数，而 $\\sqrt{2} \\cdot \\sqrt{3} = \\sqrt{6}$ 是无理数。两种情况都可能。",
    ),
    check: t(
      "The two examples, $\\sqrt{2} \\cdot \\sqrt{2} = 2$ and $\\sqrt{2} \\cdot \\sqrt{3} = \\sqrt{6}$, both meet the conditions and give different kinds, so neither always-answer is true.",
      "两个例子 $\\sqrt{2} \\cdot \\sqrt{2} = 2$ 和 $\\sqrt{2} \\cdot \\sqrt{3} = \\sqrt{6}$ 都满足条件，却得到不同类型的数，所以两个“一定”都不成立。",
    ),
  },
  {
    en: "rational, and $B$ is rational",
    zh: "是有理数，$B$ 也是有理数",
    op: (a, b) => `${a} + ${b}`,
    answer: 0,
    why: t(
      "$\\frac{p}{q} + \\frac{r}{s} = \\frac{ps + qr}{qs}$ is a quotient of integers. So the sum is always rational.",
      "$\\frac{p}{q} + \\frac{r}{s} = \\frac{ps + qr}{qs}$ 是整数之商，所以和一定是有理数。",
    ),
    check: t(
      "For example, $A = \\frac{1}{2}$ and $B = \\frac{1}{3}$ give $\\frac{5}{6}$, a quotient of integers.",
      "例如 $A = \\frac{1}{2}$，$B = \\frac{1}{3}$ 时得 $\\frac{5}{6}$，是整数之商。",
    ),
  },
  {
    en: "rational, and $B$ is rational",
    zh: "是有理数，$B$ 也是有理数",
    op: (a, b) => `${a}${b}`,
    answer: 0,
    why: t(
      "$\\frac{p}{q} \\cdot \\frac{r}{s} = \\frac{pr}{qs}$ is a quotient of integers. So the product is always rational.",
      "$\\frac{p}{q} \\cdot \\frac{r}{s} = \\frac{pr}{qs}$ 是整数之商，所以积一定是有理数。",
    ),
    check: t(
      "For example, $A = \\frac{2}{3}$ and $B = \\frac{3}{4}$ give $\\frac{6}{12} = \\frac{1}{2}$, a quotient of integers.",
      "例如 $A = \\frac{2}{3}$，$B = \\frac{3}{4}$ 时得 $\\frac{6}{12} = \\frac{1}{2}$，是整数之商。",
    ),
  },
];

const letterPairs: readonly (readonly [string, string])[] = [
  ["a", "b"],
  ["p", "q"],
  ["m", "n"],
  ["r", "s"],
  ["u", "v"],
];

export const sumsAndProductsOfRationalAndIrrationalNumbers: TopicDef = {
  id: "sums-and-products-of-rational-and-irrational-numbers",
  title: t("Sums and Products of Rational and Irrational Numbers", "有理数与无理数的和与积"),
  summary: t(
    "Decide whether sums and products of rational and irrational numbers are rational or irrational.",
    "判断有理数与无理数的和与积是有理数还是无理数。",
  ),
  prerequisites: ["the-real-number-system", "adding-and-subtracting-radicals"],
  encompasses: [
    { topic: "the-real-number-system", weight: 0.3 },
    { topic: "adding-and-subtracting-radicals", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.RN.B.3"],
  intro: t(
    `Is $3 + \\sqrt{2}$ rational? Suppose it were some rational number $r$. Then $\\sqrt{2} = r - 3$ would be a difference of rational numbers, and so rational, which it is not. So $3 + \\sqrt{2}$ is irrational, and the same argument works for any rational number plus any irrational number.

Two irrational numbers behave differently: $\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4$ is rational. Check: $4^{2} = 16 = 2 \\cdot 8$.

In this lesson we learn which sums and products are always rational, which are always irrational, and which can be either, and we decide for given expressions.`,
    `$3 + \\sqrt{2}$ 是有理数吗？假设它等于某个有理数 $r$，那么 $\\sqrt{2} = r - 3$ 是两个有理数之差，也是有理数，这不可能。所以 $3 + \\sqrt{2}$ 是无理数；同样的推理对任何有理数加无理数都成立。

两个无理数则不同：$\\sqrt{2} \\cdot \\sqrt{8} = \\sqrt{16} = 4$ 是有理数。检验：$4^{2} = 16 = 2 \\cdot 8$。

这节课我们学习哪些和与积一定是有理数，哪些一定是无理数，哪些两种都可能，并判断具体的式子。`,
  ),
  knowledgePoints: [
    {
      id: "general-rules",
      title: t("The general rules", "一般规律"),
      explanation: t(
        `Sums and products of rational numbers are always rational: $\\frac{p}{q} + \\frac{r}{s} = \\frac{ps + qr}{qs}$ and $\\frac{p}{q} \\cdot \\frac{r}{s} = \\frac{pr}{qs}$ are again quotients of integers. With an irrational number, argue by undoing the operation:

- rational $+$ irrational is **always irrational**: if $a + b$ were rational, then $b = (a + b) - a$ would be rational too;
- **nonzero** rational $\\times$ irrational is **always irrational**, for the same reason with division;
- irrational $+$ irrational and irrational $\\times$ irrational **can be either**.

For example, is $5 - \\sqrt{3}$ rational? If it equalled a rational number $r$, then $\\sqrt{3} = 5 - r$ would be rational, which it is not; so it is always irrational. Check with numbers: $5 - \\sqrt{3} \\approx 3.268\\ldots$, a decimal that never settles into a repeat.

> **Watch out.** One example cannot prove "always": $\\sqrt{2} + \\sqrt{3}$ is irrational, but $\\sqrt{2} + (-\\sqrt{2}) = 0$ is not, so irrational plus irrational can be either. The word **nonzero** matters: $0 \\cdot \\sqrt{2} = 0$ is rational.`,
        `有理数的和与积一定是有理数：$\\frac{p}{q} + \\frac{r}{s} = \\frac{ps + qr}{qs}$，$\\frac{p}{q} \\cdot \\frac{r}{s} = \\frac{pr}{qs}$ 仍是整数之商。涉及无理数时，用逆运算来推理：

- 有理数 $+$ 无理数**一定是无理数**：如果 $a + b$ 是有理数，那么 $b = (a + b) - a$ 也是有理数，矛盾；
- **非零**有理数 $\\times$ 无理数**一定是无理数**，理由相同（改用除法）；
- 无理数 $+$ 无理数、无理数 $\\times$ 无理数**两种情况都可能**。

例如，$5 - \\sqrt{3}$ 是有理数吗？如果它等于有理数 $r$，那么 $\\sqrt{3} = 5 - r$ 也是有理数，这不可能；所以它一定是无理数。用数值检验：$5 - \\sqrt{3} \\approx 3.268\\ldots$，小数不会进入循环。

> **注意。** 一个例子不能证明“一定”：$\\sqrt{2} + \\sqrt{3}$ 是无理数，但 $\\sqrt{2} + (-\\sqrt{2}) = 0$ 不是，所以无理数加无理数两种都可能。“**非零**”很重要：$0 \\cdot \\sqrt{2} = 0$ 是有理数。`,
      ),
      generate(rng) {
        const rule = rng.pick(rules);
        const [a, b] = rng.pick(letterPairs);
        const A = a;
        const swap = rng.bool() && !rule.op("A", "B").includes("-");
        const expr = swap ? rule.op(b, A) : rule.op(A, b);
        const en = rule.en.replace("$B$", `$${b}$`);
        const zh = rule.zh.replace("$B$", `$${b}$`);
        const why = (s: string) => s.replaceAll("A", A).replaceAll("B", b);
        return reasoned(
          choiceProblem({
            prompt: t(`Suppose $${A}$ is ${en}. Is $${expr}$ rational or irrational?`, `设 $${A}$ ${zh}。$${expr}$ 是有理数还是无理数？`),
            options: alwaysOptions,
            correct: rule.answer,
            solution: walked(
              [
                [["Name the kinds", "写出类型"], t(`$${A}$ is ${en}. The expression is $${expr}$.`, `$${A}$ ${zh}。式子是 $${expr}$。`)],
                [["Reason", "推理"], t(why(rule.why.en), why(rule.why["zh-CN"]))],
              ],
              t(why(rule.check.en), why(rule.check["zh-CN"])),
            ),
          }),
          [
            ...alwaysOptions.map(
              (o, i) =>
                [
                  o.en,
                  i === 2
                    ? `The kind of number is settled here: it does not depend on which numbers $${A}$ and $${b}$ are.`
                    : rule.answer === 2
                      ? "Trying one example does not settle it: other choices of the numbers give the other kind."
                      : "This goes the other way: whichever numbers you choose, the result is always of the other kind.",
                  i === 2
                    ? `这里数的类型是确定的：与 $${A}$、$${b}$ 具体是什么数无关。`
                    : rule.answer === 2
                      ? "试一个例子说明不了问题：换别的数会得到另一种结果。"
                      : "正好相反：无论取什么数，结果总是另一种。",
                ] as const,
            ),
          ],
        );
      },
    },
    {
      id: "deciding-for-a-number",
      title: t("Deciding for a given expression", "判断具体的式子"),
      explanation: t(
        `The general rules only apply once you know what each part really is, so simplify first. Roots can combine and cancel: two irrational factors can multiply to a perfect square, and two irrational terms can subtract to $0$.

Is $\\sqrt{50} - 5\\sqrt{2}$ rational? Simplify: $\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2}$, so the difference is $5\\sqrt{2} - 5\\sqrt{2} = 0$, which is rational. And $\\frac{1}{2} + \\sqrt{3}$ is rational plus irrational, so it is irrational. Check: $5^{2} \\cdot 2 = 50$.

> **Watch out.** A root sign does not settle it: $\\sqrt{8} \\cdot \\sqrt{2} = \\sqrt{16} = 4$ is rational although both factors are irrational. Simplify a root before comparing it with another; $\\sqrt{12} - 2\\sqrt{3}$ looks irrational but equals $0$.`,
        `一般规律要在知道每部分到底是什么数之后才能使用，所以先化简。根式可以合并、抵消：两个无理数因数可能乘成完全平方数，两个无理数项可能相减得 $0$。

$\\sqrt{50} - 5\\sqrt{2}$ 是有理数吗？化简：$\\sqrt{50} = \\sqrt{25 \\cdot 2} = 5\\sqrt{2}$，所以差是 $5\\sqrt{2} - 5\\sqrt{2} = 0$，是有理数。而 $\\frac{1}{2} + \\sqrt{3}$ 是有理数加无理数，所以是无理数。检验：$5^{2} \\cdot 2 = 50$。

> **注意。** 有根号并不能说明问题：$\\sqrt{8} \\cdot \\sqrt{2} = \\sqrt{16} = 4$ 是有理数，尽管两个因数都是无理数。比较之前先把根式化简；$\\sqrt{12} - 2\\sqrt{3}$ 看起来是无理数，其实等于 $0$。`,
      ),
      generate(rng) {
        const c = combo(rng);
        const reasons: [string, string, string][] = c.rational
          ? [
              [
                "Irrational",
                `A root in the expression does not make its value irrational: ${c.why.en}`,
                `式子里有根号，值不一定是无理数：${c.why["zh-CN"]}`,
              ],
            ]
          : [["Rational", `Nothing cancels the irrational part here: ${c.why.en}`, `这里没有什么能消去无理部分：${c.why["zh-CN"]}`]];
        return reasoned(
          choiceProblem({
            prompt: t(`Is $${c.tex}$ rational or irrational?`, `$${c.tex}$ 是有理数还是无理数？`),
            options: [t("Rational", "有理数"), t("Irrational", "无理数")],
            correct: c.rational ? 0 : 1,
            solution: walked(
              [
                [["Simplify", "化简"], c.why],
                [
                  ["Decide", "判断"],
                  c.rational
                    ? t("So the value is rational.", "所以它的值是有理数。")
                    : t("So the value is irrational.", "所以它的值是无理数。"),
                ],
              ],
              c.check,
            ),
          }),
          reasons,
        );
      },
    },
    {
      id: "finding-the-odd-one",
      title: t("Finding the rational or irrational expression", "找出有理数或无理数的式子"),
      explanation: t(
        `To find the one expression of a different kind among several, simplify each one and apply the rules; the odd one is the only one whose kind differs.

Of $\\sqrt{5} + 2$, $3\\sqrt{7}$, $\\sqrt{2} \\cdot \\sqrt{18}$ and $\\sqrt{6} + \\sqrt{5}$, which is rational? $\\sqrt{5} + 2$ is irrational plus rational and $3\\sqrt{7}$ is a nonzero rational times an irrational, so both are irrational. $\\sqrt{6} + \\sqrt{5}$ does not cancel. But $\\sqrt{2} \\cdot \\sqrt{18} = \\sqrt{36} = 6$ is rational. Check: $6^{2} = 36 = 2 \\cdot 18$.

> **Watch out.** Simplify every option before deciding; a product of two roots may be a perfect square. Read whether the question asks for the rational or the irrational expression.`,
        `要在几个式子中找出类型不同的那一个，逐个化简并运用规律；与众不同的那个就是类型不同的唯一一个。

在 $\\sqrt{5} + 2$、$3\\sqrt{7}$、$\\sqrt{2} \\cdot \\sqrt{18}$ 和 $\\sqrt{6} + \\sqrt{5}$ 中，哪个是有理数？$\\sqrt{5} + 2$ 是无理数加有理数，$3\\sqrt{7}$ 是非零有理数乘无理数，两者都是无理数。$\\sqrt{6} + \\sqrt{5}$ 不会抵消。而 $\\sqrt{2} \\cdot \\sqrt{18} = \\sqrt{36} = 6$ 是有理数。检验：$6^{2} = 36 = 2 \\cdot 18$。

> **注意。** 判断之前把每个选项都化简；两个根式之积可能是完全平方数。看清题目问的是有理数还是无理数的式子。`,
      ),
      generate(rng) {
        const findRational = rng.bool();
        const odd = combo(rng, findRational);
        const others: Combo[] = [];
        while (others.length < 3) {
          const c = combo(rng, !findRational);
          if (c.tex !== odd.tex && others.every((o) => o.tex !== c.tex)) others.push(c);
        }
        const correct = rng.int(0, 3);
        const all = [...others];
        all.splice(correct, 0, odd);
        return reasoned(
          choiceProblem({
            prompt: findRational
              ? t(`Which of these expressions has a rational value?${listTex(all)}`, `下列哪个式子的值是有理数？${listTex(all)}`)
              : t(`Which of these expressions has an irrational value?${listTex(all)}`, `下列哪个式子的值是无理数？${listTex(all)}`),
            options: all.map((c) => same(`$${c.tex}$`)),
            correct,
            solution: walked(
              [
                [["Simplify each expression", "逐个化简"], t(all.map((c) => c.why.en).join(" "), all.map((c) => c.why["zh-CN"]).join(""))],
                [
                  ["Pick the odd one out", "找出与众不同的式子"],
                  t(
                    `Only $${odd.tex}$ is ${findRational ? "rational" : "irrational"}; the other three are ${findRational ? "irrational" : "rational"}.`,
                    `只有 $${odd.tex}$ 是${findRational ? "有理数" : "无理数"}；其余三个都是${findRational ? "无理数" : "有理数"}。`,
                  ),
                ],
              ],
              odd.check,
            ),
          }),
          [...others.map((c) => [`$${c.tex}$`, c.why.en, c.why["zh-CN"]] as const)],
        );
      },
    },
  ],
};

// Module: introduction to complex numbers.

/** negRoot draws n = c²·m for √−n, with small c and square-free m. */
function negRoot(rng: Rng, radicalOnly = false): { n: number; c: number; m: number } {
  const m = radicalOnly || rng.bool(0.5) ? rng.pick([2, 3, 5, 6, 7, 10, 11, 13]) : 1;
  const c = m === 1 ? rng.int(1, 12) : rng.int(1, 5);
  return { n: c * c * m, c, m };
}

/** imagSquare squares c·i·√m in LaTeX: "(3i\sqrt{2})^{2} = 9 \cdot 2 \cdot i^{2} = -18". */
const imagSquare = (c: number, m: number) => `(${imag(c, m)})^{2} = ${c * c}${m > 1 ? ` \\cdot ${m}` : ""} \\cdot i^{2} = ${-c * c * m}`;

/** rootStep is the step that takes the square roots of x² = −n. */
const rootStep = (v: string, n: number, c: number, m: number): Step => [
  ["Take square roots", "开平方"],
  t("A negative number has two square roots, both imaginary, and they are opposites:", "负数有两个平方根，都是虚数，并且互为相反数："),
  [`${v} = \\pm\\sqrt{-${n}} = \\pm ${imag(c, m)}`],
];

/** chooseStep is the step that picks the solution whose imaginary part is positive. */
const chooseStep = (answer: string): Step => [
  ["Choose the solution", "选出所求的解"],
  t(`The solution with a positive imaginary part is $${answer}$.`, `虚部为正的解是 $${answer}$。`),
];

export const imaginaryNumbers: TopicDef = {
  id: "imaginary-numbers",
  title: t("Imaginary Numbers", "虚数"),
  summary: t(
    "Use the imaginary unit $i = \\sqrt{-1}$ to take square roots of negative numbers, and multiply imaginary numbers using $i^{2} = -1$.",
    "用虚数单位 $i = \\sqrt{-1}$ 求负数的平方根，并利用 $i^{2} = -1$ 进行虚数的乘法。",
  ),
  prerequisites: ["the-real-number-system", "simplifying-square-roots"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.CN.A.1"],
  intro: t(
    `What is $\\sqrt{-25}$? It would be a number whose square is $-25$. No real number works: $5^{2} = 25$ and $(-5)^{2} = 25$, and the square of every real number is at least $0$.

So mathematicians added a new number $i$, the **imaginary unit**, with $i^{2} = -1$. Then $(5i)^{2} = 25i^{2} = -25$, and we write $\\sqrt{-25} = 5i$. Check: $(5i)(5i) = 25 \\cdot (-1) = -25$.

In this lesson we take square roots of negative numbers and multiply imaginary numbers.`,
    `$\\sqrt{-25}$ 是多少？它应当是一个平方为 $-25$ 的数。实数都不行：$5^{2} = 25$，$(-5)^{2} = 25$，任何实数的平方都不小于 $0$。

于是数学家引入一个新的数 $i$，叫做**虚数单位**，满足 $i^{2} = -1$。这样 $(5i)^{2} = 25i^{2} = -25$，我们记 $\\sqrt{-25} = 5i$。检验：$(5i)(5i) = 25 \\cdot (-1) = -25$。

这节课我们求负数的平方根，并进行虚数的乘法。`,
  ),
  knowledgePoints: [
    {
      id: "square-roots-of-negative-numbers",
      title: t("Square roots of negative numbers", "负数的平方根"),
      explanation: t(
        `No real number squares to a negative number. The **imaginary unit** $i$ is a new number with $i^{2} = -1$, so $\\sqrt{-1} = i$. For a positive number $n$,

$$\\sqrt{-n} = i\\sqrt{n},$$

because $(i\\sqrt{n})^{2} = i^{2} \\cdot n = -n$. Then simplify $\\sqrt{n}$ as usual. For $\\sqrt{-50}$: $50 = 25 \\cdot 2$, so

$$\\sqrt{-50} = i\\sqrt{50} = 5i\\sqrt{2}.$$

Numbers such as $5i\\sqrt{2}$ are **imaginary numbers**. Check: $(5i\\sqrt{2})^{2} = 25 \\cdot 2 \\cdot i^{2} = -50$.

> **Watch out.** $\\sqrt{-50}$ is not $-\\sqrt{50}$: that is a negative real number, and its square is $+50$. Do not drop the $i$, and do not change the sign. Write $i$ before a root, $5i\\sqrt{2}$, so that it is not mistaken for being under the root, and simplify the root fully.`,
        `没有实数的平方是负数。**虚数单位** $i$ 是一个新的数，满足 $i^{2} = -1$，所以 $\\sqrt{-1} = i$。对正数 $n$，

$$\\sqrt{-n} = i\\sqrt{n}$$

因为 $(i\\sqrt{n})^{2} = i^{2} \\cdot n = -n$。然后照常化简 $\\sqrt{n}$。对 $\\sqrt{-50}$：$50 = 25 \\cdot 2$，所以

$$\\sqrt{-50} = i\\sqrt{50} = 5i\\sqrt{2}$$

像 $5i\\sqrt{2}$ 这样的数叫做**虚数**。检验：$(5i\\sqrt{2})^{2} = 25 \\cdot 2 \\cdot i^{2} = -50$。

> **注意。** $\\sqrt{-50}$ 不是 $-\\sqrt{50}$：后者是负实数，它的平方是 $+50$。不要丢掉 $i$，也不要改变符号。把 $i$ 写在根号前面，如 $5i\\sqrt{2}$，以免误认为 $i$ 在根号里；根式要化到最简。`,
      ),
      keyPrerequisites: ["simplifying-square-roots"],
      generate(rng) {
        const { n, c, m } = negRoot(rng);
        const k = rng.pick([1, 1, 1, -1, 2, 3, -2]);
        const expr = `${front(k)}\\sqrt{-${n}}`;
        const answer = imag(k * c, m);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: [rad(k * c, m), imag(-k * c, m), imag(k, n), rad(-k * c, m)],
          solution: walked(
            [
              [
                ["Bring out $i$", "提出 $i$"],
                t(`Since $\\sqrt{-${n}} = i\\sqrt{${n}}$:`, `因为 $\\sqrt{-${n}} = i\\sqrt{${n}}$：`),
                [`${expr} = ${front(k)}i\\sqrt{${n}}`],
              ],
              c === 1 && m > 1
                ? [
                    ["Simplify the root", "化简根式"],
                    t(
                      `$${n}$ has no square factor greater than $1$, so the root is already simplified: the answer is $${answer}$.`,
                      `$${n}$ 没有大于 $1$ 的平方因数，根式已是最简：答案是 $${answer}$。`,
                    ),
                  ]
                : [
                    ["Simplify the root", "化简根式"],
                    m === 1
                      ? t(`$${n} = ${c}^{2}$, so $\\sqrt{${n}} = ${c}$:`, `$${n} = ${c}^{2}$，所以 $\\sqrt{${n}} = ${c}$：`)
                      : t(
                          `$${n} = ${c * c} \\cdot ${m}$, so $\\sqrt{${n}} = ${rad(c, m)}$:`,
                          `$${n} = ${c * c} \\cdot ${m}$，所以 $\\sqrt{${n}} = ${rad(c, m)}$：`,
                        ),
                    [`${front(k)}i\\sqrt{${n}} = ${answer}`],
                  ],
            ],
            t(
              `$${imagSquare(k * c, m)}$, and $(${expr})^{2} = ${k * k === 1 ? `-${n}` : `${k * k} \\cdot (-${n}) = ${-k * k * n}`}$ too.`,
              `$${imagSquare(k * c, m)}$，而 $(${expr})^{2} = ${k * k === 1 ? `-${n}` : `${k * k} \\cdot (-${n}) = ${-k * k * n}`}$，两者相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "products-of-imaginary-numbers",
      title: t("Products and powers of imaginary numbers", "虚数的乘积与乘方"),
      explanation: t(
        `Multiply imaginary numbers like monomials, treating $i$ as a variable: multiply the coefficients, and $i \\cdot i = i^{2}$. Then replace $i^{2}$ by $-1$, since that is what $i$ was defined to do. So the product of two imaginary numbers is a real number.

For $(-2i)(7i)$: the coefficients give $-14$ and the $i$'s give $i^{2}$, so

$$(-2i)(7i) = -14i^{2} = -14 \\cdot (-1) = 14.$$

Likewise $(6i)^{2} = 36i^{2} = -36$. Check: $14$ is real, as a product of two imaginary numbers must be, and its sign is the opposite of $(-2)(7) = -14$.

> **Watch out.** Forgetting that $i^{2} = -1$ leaves the sign wrong: $(-2i)(7i)$ is $14$, not $-14$. Square both the coefficient and $i$: $(6i)^{2}$ is $-36$, not $36$ or $12i$. Multiply the coefficients; do not add them.`,
        `像单项式一样相乘虚数，把 $i$ 当作变量：系数相乘，$i \\cdot i = i^{2}$。再把 $i^{2}$ 换成 $-1$，这正是 $i$ 的定义。所以两个虚数的积是实数。

对 $(-2i)(7i)$：系数相乘得 $-14$，$i$ 相乘得 $i^{2}$，所以

$$(-2i)(7i) = -14i^{2} = -14 \\cdot (-1) = 14$$

同样，$(6i)^{2} = 36i^{2} = -36$。检验：$14$ 是实数，两个虚数之积必然如此；它的符号与 $(-2)(7) = -14$ 相反。

> **注意。** 忘记 $i^{2} = -1$ 会弄错符号：$(-2i)(7i)$ 等于 $14$，不是 $-14$。系数和 $i$ 都要平方：$(6i)^{2}$ 等于 $-36$，不是 $36$ 或 $12i$。系数要相乘，不是相加。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const a = rng.nonZero(-9, 9);
          const b = rng.nonZero(-9, 9);
          const expr = `(${imag(a, 1)})(${imag(b, 1)})`;
          return numberProblem({
            prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
            answer: -a * b,
            wrong: [a * b, a + b],
            solution: walked(
              [
                [
                  ["Multiply like monomials", "像单项式一样相乘"],
                  t("Multiply the coefficients, and $i \\cdot i = i^{2}$:", "系数相乘，$i \\cdot i = i^{2}$："),
                  [`${expr} = ${poly([a * b, "i^{2}"])}`],
                ],
                [
                  ["Replace $i^{2}$", "替换 $i^{2}$"],
                  t("Since $i^{2} = -1$:", "因为 $i^{2} = -1$："),
                  [`${poly([a * b, "i^{2}"])} = ${a * b} \\cdot (-1) = ${-a * b}`],
                ],
              ],
              t(
                `The product of two imaginary numbers is real, and $i^{2} = -1$ flips the sign of $${a} \\cdot ${paren(b)} = ${a * b}$, giving $${-a * b}$.`,
                `两个虚数之积是实数，而 $i^{2} = -1$ 把 $${a} \\cdot ${paren(b)} = ${a * b}$ 的符号变反，得 $${-a * b}$。`,
              ),
            ),
          });
        }
        if (kind === 1) {
          const a = rng.nonZero(-9, 9);
          const expr = `(${imag(a, 1)})^{2}`;
          return numberProblem({
            prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
            answer: -a * a,
            wrong: [a * a, 2 * a, -2 * a],
            solution: walked(
              [
                [
                  ["Square each factor", "每个因数分别平方"],
                  t("Square the coefficient and square $i$:", "系数平方，$i$ 也平方："),
                  [`${expr} = ${paren(a)}^{2}i^{2} = ${a * a}i^{2}`],
                ],
                [
                  ["Replace $i^{2}$", "替换 $i^{2}$"],
                  t("Since $i^{2} = -1$:", "因为 $i^{2} = -1$："),
                  [`${a * a}i^{2} = ${a * a} \\cdot (-1) = ${-a * a}`],
                ],
              ],
              t(
                `Going back, $\\sqrt{${-a * a}} = i\\sqrt{${a * a}} = ${imag(Math.abs(a), 1)}$, ${a > 0 ? "the number we squared" : `the opposite of $${imag(a, 1)}$, which has the same square`}.`,
                `反过来，$\\sqrt{${-a * a}} = i\\sqrt{${a * a}} = ${imag(Math.abs(a), 1)}$，${a > 0 ? "正是被平方的数" : `是 $${imag(a, 1)}$ 的相反数，两者的平方相同`}。`,
              ),
            ),
          });
        }
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-12, 12);
        const expr = poly([a, "i^{2}"], [b, ""]);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: -a + b,
          wrong: [a + b, -a - b],
          solution: walked(
            [
              [
                ["Replace $i^{2}$", "替换 $i^{2}$"],
                t("Since $i^{2} = -1$:", "因为 $i^{2} = -1$："),
                [`${poly([a, "i^{2}"])} = ${a} \\cdot (-1) = ${-a}`],
              ],
              [
                ["Add the constant", "加上常数"],
                t("Now both terms are real:", "现在两项都是实数："),
                [`${-a} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${-a + b}`],
              ],
            ],
            t(
              `Working back, $${-a + b} - ${paren(b)} = ${-a}$, which is $${poly([a, "i^{2}"])}$ because $i^{2} = -1$.`,
              `反过来，$${-a + b} - ${paren(b)} = ${-a}$，因为 $i^{2} = -1$，它正是 $${poly([a, "i^{2}"])}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "products-of-roots-of-negative-numbers",
      title: t("Products of square roots of negative numbers", "负数平方根的乘积"),
      explanation: t(
        `The rule $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$ was proved for $a, b \\ge 0$, and it fails when both are negative: $\\sqrt{-1} \\cdot \\sqrt{-1} = i \\cdot i = -1$, but $\\sqrt{(-1)(-1)} = \\sqrt{1} = 1$. So rewrite each root of a negative number with $i$ **first**, then multiply.

For $\\sqrt{-5} \\cdot \\sqrt{-20}$:

$$\\sqrt{-5} \\cdot \\sqrt{-20} = i\\sqrt{5} \\cdot i\\sqrt{20} = i^{2}\\sqrt{100} = -10.$$

With one negative radicand, $\\sqrt{-3} \\cdot \\sqrt{12} = i\\sqrt{3} \\cdot \\sqrt{12} = i\\sqrt{36} = 6i$. Check: $(-10)^{2} = 100 = (-5)(-20)$, and the sign is negative because the two factors of $i$ make $i^{2} = -1$.

> **Watch out.** Multiplying under one root first, $\\sqrt{(-5)(-20)} = \\sqrt{100} = 10$, gives the wrong sign. With only one negative radicand the answer keeps one $i$. Simplify the remaining root.`,
        `法则 $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$ 是在 $a, b \\ge 0$ 时证明的，两者都为负时它不成立：$\\sqrt{-1} \\cdot \\sqrt{-1} = i \\cdot i = -1$，而 $\\sqrt{(-1)(-1)} = \\sqrt{1} = 1$。所以要**先**用 $i$ 改写每个负数的平方根，再相乘。

对 $\\sqrt{-5} \\cdot \\sqrt{-20}$：

$$\\sqrt{-5} \\cdot \\sqrt{-20} = i\\sqrt{5} \\cdot i\\sqrt{20} = i^{2}\\sqrt{100} = -10$$

只有一个被开方数为负时，$\\sqrt{-3} \\cdot \\sqrt{12} = i\\sqrt{3} \\cdot \\sqrt{12} = i\\sqrt{36} = 6i$。检验：$(-10)^{2} = 100 = (-5)(-20)$；符号为负，是因为两个 $i$ 相乘得 $i^{2} = -1$。

> **注意。** 先在一个根号下相乘，$\\sqrt{(-5)(-20)} = \\sqrt{100} = 10$，符号就错了。只有一个被开方数为负时，结果保留一个 $i$。剩下的根式要化简。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 30);
          b = rng.int(2, 30);
        } while (a === b && isSquare(a));
        const both = rng.bool(0.7);
        const [c, m] = sqrtParts(a * b);
        const expr = `\\sqrt{-${a}} \\cdot \\sqrt{${both ? "-" : ""}${b}}`;
        const answer = both ? rad(-c, m) : imag(c, m);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: both ? [rad(c, m), imag(-c, m), imag(c, m)] : [rad(c, m), imag(-c, m), rad(-c, m)],
          solution: walked(
            [
              [
                ["Rewrite with $i$", "用 $i$ 改写"],
                t("Rewrite each square root of a negative number with $i$ before multiplying:", "相乘之前，先用 $i$ 改写负数的平方根："),
                [`${expr} = ${both ? `i\\sqrt{${a}} \\cdot i\\sqrt{${b}}` : `i\\sqrt{${a}} \\cdot \\sqrt{${b}}`}`],
              ],
              [
                ["Multiply", "相乘"],
                both
                  ? t("Multiply the roots and the $i$'s, use $i^{2} = -1$ and simplify:", "根式相乘，$i$ 相乘，利用 $i^{2} = -1$ 并化简：")
                  : t("Multiply the roots and simplify:", "根式相乘并化简："),
                [
                  `${both ? `i^{2}\\sqrt{${a * b}} = -\\sqrt{${a * b}}` : `i\\sqrt{${a * b}}`}${c === 1 && m === a * b ? "" : ` = ${answer}`}`,
                ],
              ],
            ],
            t(
              `$(${answer})^{2} = ${both ? a * b : -a * b}$, and $(\\sqrt{-${a}})^{2}(\\sqrt{${both ? "-" : ""}${b}})^{2} = (-${a})(${both ? "-" : ""}${b}) = ${both ? a * b : -a * b}$ too.${both ? " The sign is negative because the two factors of $i$ make $i^{2} = -1$." : ""}`,
              `$(${answer})^{2} = ${both ? a * b : -a * b}$，而 $(\\sqrt{-${a}})^{2}(\\sqrt{${both ? "-" : ""}${b}})^{2} = (-${a})(${both ? "-" : ""}${b}) = ${both ? a * b : -a * b}$，两者相同。${both ? "符号为负，是因为两个 $i$ 相乘得 $i^{2} = -1$。" : ""}`,
            ),
          ),
        });
      },
    },
  ],
};

/** positiveRootNote is the instruction to enter the solution with a positive imaginary part. */
const positiveImaginary: Text = t(
  "The equation has two solutions, which differ only in the sign of their imaginary part. Enter the one whose imaginary part is positive.",
  "方程有两个解，它们只有虚部的符号不同。请输入虚部为正的那个解。",
);

export const quadraticEquationsWithPurelyImaginarySolutions: TopicDef = {
  id: "quadratic-equations-with-purely-imaginary-solutions",
  title: t("Quadratic Equations With Purely Imaginary Solutions", "解为纯虚数的一元二次方程"),
  summary: t(
    "Solve equations such as $x^{2} + 25 = 0$, whose solutions are the imaginary numbers $\\pm 5i$.",
    "解形如 $x^{2} + 25 = 0$ 的方程，它的解是虚数 $\\pm 5i$。",
  ),
  prerequisites: ["imaginary-numbers", "solving-equations-with-square-roots"],
  encompasses: [
    { topic: "solving-equations-with-square-roots", weight: 0.5 },
    { topic: "imaginary-numbers", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.CN.C.7"],
  intro: t(
    `The equation $x^{2} + 9 = 0$ asks for a number whose square is $-9$. On the real number line there is none, which is why the parabola $y = x^{2} + 9$ never meets the $x$-axis. With imaginary numbers there are two:

$$x^{2} = -9 \\quad\\Rightarrow\\quad x = \\pm\\sqrt{-9} = \\pm 3i$$

Check: $(3i)^{2} + 9 = -9 + 9 = 0$ and $(-3i)^{2} + 9 = -9 + 9 = 0$.

In this lesson we solve equations of the form $ax^{2} + c = 0$ whose solutions are imaginary, including ones that need rearranging first.`,
    `方程 $x^{2} + 9 = 0$ 要找平方为 $-9$ 的数。实数轴上没有这样的数，所以抛物线 $y = x^{2} + 9$ 与 $x$ 轴没有交点。有了虚数，就有两个解：

$$x^{2} = -9 \\quad\\Rightarrow\\quad x = \\pm\\sqrt{-9} = \\pm 3i$$

检验：$(3i)^{2} + 9 = -9 + 9 = 0$，$(-3i)^{2} + 9 = -9 + 9 = 0$。

这节课我们解形如 $ax^{2} + c = 0$、解为虚数的方程，包括需要先移项的方程。`,
  ),
  knowledgePoints: [
    {
      id: "x-squared-equals-a-negative",
      title: t("Solving $x^{2} = -k$", "解 $x^{2} = -k$"),
      explanation: t(
        `Over the real numbers $x^{2} = -k$ with $k > 0$ has no solution. With imaginary numbers it has two, because $i\\sqrt{k}$ and $-i\\sqrt{k}$ both square to $-k$: take the square root of both sides with $\\pm$.

For $x^{2} + 20 = 0$: subtract $20$, then take roots, simplifying $\\sqrt{20} = 2\\sqrt{5}$:

$$x^{2} = -20 \\quad\\Rightarrow\\quad x = \\pm\\sqrt{-20} = \\pm 2i\\sqrt{5}$$

In these problems, enter the solution whose imaginary part is positive: $2i\\sqrt{5}$. Check: $(2i\\sqrt{5})^{2} = 4 \\cdot 5 \\cdot i^{2} = -20$.

> **Watch out.** Keep the $i$: $\\pm 2\\sqrt{5}$ squares to $+20$, not $-20$. There are two solutions, not one. $\\sqrt{-20}$ is $2i\\sqrt{5}$, not $20i$ or $-2\\sqrt{5}$.`,
        `在实数范围内，$x^{2} = -k$（$k > 0$）没有解。有了虚数，它有两个解，因为 $i\\sqrt{k}$ 和 $-i\\sqrt{k}$ 的平方都是 $-k$：两边开平方并加上 $\\pm$。

对 $x^{2} + 20 = 0$：减去 $20$，再开平方，并化简 $\\sqrt{20} = 2\\sqrt{5}$：

$$x^{2} = -20 \\quad\\Rightarrow\\quad x = \\pm\\sqrt{-20} = \\pm 2i\\sqrt{5}$$

在这些题目中，输入虚部为正的那个解：$2i\\sqrt{5}$。检验：$(2i\\sqrt{5})^{2} = 4 \\cdot 5 \\cdot i^{2} = -20$。

> **注意。** 不要丢掉 $i$：$\\pm 2\\sqrt{5}$ 的平方是 $+20$，不是 $-20$。解有两个，不是一个。$\\sqrt{-20}$ 等于 $2i\\sqrt{5}$，不是 $20i$ 或 $-2\\sqrt{5}$。`,
      ),
      generate(rng) {
        const { n, c, m } = negRoot(rng);
        const v = rng.pick(["x", "y", "t"]);
        const eq = rng.bool() ? `${v}^{2} + ${n} = 0` : `${v}^{2} = -${n}`;
        const answer = imag(c, m);
        return expressionProblem({
          prompt: t(`Solve $${eq}$. ${positiveImaginary.en}`, `解方程 $${eq}$。${positiveImaginary["zh-CN"]}`),
          answer,
          radical: true,
          prefix: `${v} =`,
          wrong: [rad(c, m), imag(-c, m), imag(n, 1), String(n)],
          solution: walked(
            [
              [
                ["Isolate the square", "分离平方项"],
                eq.endsWith("= 0")
                  ? t(`Subtract $${n}$ from both sides:`, `两边减去 $${n}$：`)
                  : t("The square is already alone on one side:", "平方项已经单独在一边："),
                [`${v}^{2} = -${n}`],
              ],
              rootStep(v, n, c, m),
              chooseStep(answer),
            ],
            t(
              `$${imagSquare(c, m)}$, so $${v} = ${answer}$ satisfies $${eq}$.`,
              `$${imagSquare(c, m)}$，所以 $${v} = ${answer}$ 满足 $${eq}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      title: t("Equations of the form $ax^{2} + c = 0$", "形如 $ax^{2} + c = 0$ 的方程"),
      explanation: t(
        `With a coefficient on $x^{2}$, isolate $x^{2}$ before taking roots: the square root applies to $x^{2}$ alone, not to $ax^{2}$. Subtract the constant, then divide by the coefficient of $x^{2}$; if $x^{2}$ comes out negative, the solutions are imaginary.

For $5x^{2} + 45 = 0$:

$$5x^{2} = -45 \\quad\\Rightarrow\\quad x^{2} = -9 \\quad\\Rightarrow\\quad x = \\pm 3i$$

Check: $5(3i)^{2} + 45 = 5 \\cdot (-9) + 45 = 0$.

> **Watch out.** Divide by the coefficient before taking roots: $\\pm\\sqrt{-45}$ is wrong. When the coefficient is negative, as in $-2x^{2} - 8 = 0$, move the constant first, $-2x^{2} = 8$, then divide: $x^{2} = -4$. Keep the $i$ in the answer.`,
        `$x^{2}$ 有系数时，开平方之前先分离出 $x^{2}$：开平方只作用于 $x^{2}$ 本身，不是 $ax^{2}$。先减去常数，再除以 $x^{2}$ 的系数；如果 $x^{2}$ 为负，解就是虚数。

对 $5x^{2} + 45 = 0$：

$$5x^{2} = -45 \\quad\\Rightarrow\\quad x^{2} = -9 \\quad\\Rightarrow\\quad x = \\pm 3i$$

检验：$5(3i)^{2} + 45 = 5 \\cdot (-9) + 45 = 0$。

> **注意。** 开平方之前先除以系数：$\\pm\\sqrt{-45}$ 是错的。系数为负时，例如 $-2x^{2} - 8 = 0$，先移常数得 $-2x^{2} = 8$，再相除：$x^{2} = -4$。答案里要保留 $i$。`,
      ),
      generate(rng) {
        const { n, c, m } = negRoot(rng);
        const a = rng.int(2, 6);
        const s = rng.sign();
        const eq = `${s * a}x^{2} ${s > 0 ? "+" : "-"} ${a * n} = 0`;
        const answer = imag(c, m);
        return expressionProblem({
          prompt: t(`Solve $${eq}$. ${positiveImaginary.en}`, `解方程 $${eq}$。${positiveImaginary["zh-CN"]}`),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [rad(c, m), imag(-c, m), ...(isSquare(a * n) ? [imag(Math.sqrt(a * n), 1)] : [imag(1, a * n)])],
          solution: walked(
            [
              [
                ["Isolate $x^{2}$", "分离出 $x^{2}$"],
                t(
                  `${s > 0 ? "Subtract" : "Add"} $${a * n}$ ${s > 0 ? "from" : "to"} both sides, then divide by $${s * a}$:`,
                  `两边${s > 0 ? "减去" : "加上"} $${a * n}$，再除以 $${s * a}$：`,
                ),
                [`${s * a}x^{2} = ${-s * a * n}`, `x^{2} = -${n}`],
              ],
              rootStep("x", n, c, m),
              chooseStep(answer),
            ],
            t(
              `Since $${imagSquare(c, m)}$, substituting gives $${s * a} \\cdot (-${n}) ${s > 0 ? "+" : "-"} ${a * n} = ${-s * a * n} ${s > 0 ? "+" : "-"} ${a * n} = 0$.`,
              `因为 $${imagSquare(c, m)}$，代入得 $${s * a} \\cdot (-${n}) ${s > 0 ? "+" : "-"} ${a * n} = ${-s * a * n} ${s > 0 ? "+" : "-"} ${a * n} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "rearranging-first",
      title: t("Collecting terms first", "先移项合并"),
      explanation: t(
        `When $x^{2}$ appears on both sides, the equation is still of the form $ax^{2} + c = 0$ in disguise: collect the $x^{2}$ terms on one side and the constants on the other, then isolate $x^{2}$.

For $7x^{2} - 4 = 3x^{2} - 52$: subtract $3x^{2}$ and add $4$ on both sides,

$$4x^{2} = -48 \\quad\\Rightarrow\\quad x^{2} = -12 \\quad\\Rightarrow\\quad x = \\pm 2i\\sqrt{3}.$$

Check: with $x^{2} = -12$, the left side is $7 \\cdot (-12) - 4 = -88$ and the right side is $3 \\cdot (-12) - 52 = -88$.

> **Watch out.** When a term crosses the equals sign its sign changes: subtract $3x^{2}$, do not add it. A negative value of $x^{2}$ means imaginary solutions, not "no solution". Keep the $i$ and simplify the root.`,
        `当方程两边都有 $x^{2}$ 时，它其实仍是 $ax^{2} + c = 0$ 的形式：把 $x^{2}$ 项移到一边，常数移到另一边，再分离出 $x^{2}$。

对 $7x^{2} - 4 = 3x^{2} - 52$：两边减去 $3x^{2}$、加上 $4$，

$$4x^{2} = -48 \\quad\\Rightarrow\\quad x^{2} = -12 \\quad\\Rightarrow\\quad x = \\pm 2i\\sqrt{3}$$

检验：$x^{2} = -12$ 时，左边是 $7 \\cdot (-12) - 4 = -88$，右边是 $3 \\cdot (-12) - 52 = -88$。

> **注意。** 项移过等号要变号：要减去 $3x^{2}$，不是加上。$x^{2}$ 为负说明解是虚数，而不是“无解”。保留 $i$，并化简根式。`,
      ),
      generate(rng) {
        const { n, c, m } = negRoot(rng);
        const a = rng.int(1, 4);
        const p = rng.int(1, 4);
        const q = rng.int(-20, 20);
        const r = q + a * n;
        const eq = `${front(a + p)}x^{2} ${r < 0 ? "-" : "+"} ${Math.abs(r)} = ${poly([p, "x^{2}"], [q, ""])}`;
        const answer = imag(c, m);
        return expressionProblem({
          prompt: t(`Solve $${eq}$. ${positiveImaginary.en}`, `解方程 $${eq}$。${positiveImaginary["zh-CN"]}`),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [rad(c, m), imag(-c, m)],
          solution: walked(
            [
              [
                ["Collect the terms", "移项合并"],
                t(
                  `Subtract $${front(p)}x^{2}$ from both sides and ${r < 0 ? `add $${-r}$` : `subtract $${r}$`}${a === 1 ? "" : `, then divide by $${a}$`}:`,
                  `两边减去 $${front(p)}x^{2}$，${r < 0 ? `加上 $${-r}$` : `减去 $${r}$`}${a === 1 ? "" : `，再除以 $${a}$`}：`,
                ),
                [`${front(a)}x^{2} = ${q} - ${paren(r)} = ${-a * n}`, ...(a === 1 ? [] : [`x^{2} = -${n}`])],
              ],
              rootStep("x", n, c, m),
              chooseStep(answer),
            ],
            t(
              `$${imagSquare(c, m)}$. With $x^{2} = -${n}$, the left side is $${a + p} \\cdot (-${n}) ${r < 0 ? "-" : "+"} ${Math.abs(r)} = ${-(a + p) * n + r}$ and the right side is $${p} \\cdot (-${n}) ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${-p * n + q}$.`,
              `$${imagSquare(c, m)}$。$x^{2} = -${n}$ 时，左边是 $${a + p} \\cdot (-${n}) ${r < 0 ? "-" : "+"} ${Math.abs(r)} = ${-(a + p) * n + r}$，右边是 $${p} \\cdot (-${n}) ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${-p * n + q}$。`,
            ),
          ),
        });
      },
    },
  ],
};

export const complexNumbers: TopicDef = {
  id: "complex-numbers",
  title: t("Complex Numbers", "复数"),
  summary: t(
    "Write complex numbers in the form $a + bi$, name their real and imaginary parts, and equate complex numbers.",
    "把复数写成 $a + bi$ 的形式，指出它的实部和虚部，并利用复数相等求未知数。",
  ),
  prerequisites: ["imaginary-numbers"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSN.CN.A.1"],
  intro: t(
    `Adding a real number to an imaginary number gives a new kind of number: $5 + (-2i) = 5 - 2i$ cannot be simplified to a real number or to an imaginary number. Numbers like this are **complex numbers**, written $a + bi$ with $a$ and $b$ real.

For $5 - 2i$, the **real part** is $5$ and the **imaginary part** is $-2$. Check: $5 + (-2)i = 5 - 2i$.

In this lesson we name the real and imaginary parts of complex numbers, write expressions in the form $a + bi$, and use the fact that equal complex numbers have equal parts.`,
    `实数加虚数得到一种新的数：$5 + (-2i) = 5 - 2i$ 既不能化成实数，也不能化成虚数。这样的数叫做**复数**，写成 $a + bi$，其中 $a$、$b$ 是实数。

$5 - 2i$ 的**实部**是 $5$，**虚部**是 $-2$。检验：$5 + (-2)i = 5 - 2i$。

这节课我们指出复数的实部和虚部，把式子写成 $a + bi$ 的形式，并利用相等的复数实部、虚部分别相等。`,
  ),
  knowledgePoints: [
    {
      id: "real-and-imaginary-parts",
      title: t("Real and imaginary parts", "实部与虚部"),
      explanation: t(
        `A **complex number** is a number $a + bi$ with $a$ and $b$ real. The real number $a$ is its **real part** and the real number $b$ is its **imaginary part**. Both parts are real numbers: the imaginary part is the coefficient of $i$, not the term $bi$.

Every real number is a complex number with imaginary part $0$, and every imaginary number $bi$ has real part $0$. For $8i - 3$, first put it in the form $a + bi$: $-3 + 8i$. The real part is $-3$ and the imaginary part is $8$. Check: $-3 + 8i = 8i - 3$.

> **Watch out.** The imaginary part of $-3 + 8i$ is $8$, not $8i$. The real part is the term without $i$, wherever it is written: in $8i - 3$ it is $-3$, not $8$. Keep the signs: in $4 - 6i$ the imaginary part is $-6$.`,
        `**复数**是形如 $a + bi$ 的数，其中 $a$、$b$ 是实数。实数 $a$ 是它的**实部**，实数 $b$ 是它的**虚部**。两个部分都是实数：虚部是 $i$ 的系数，不是 $bi$ 这一项。

每个实数都是虚部为 $0$ 的复数，每个虚数 $bi$ 的实部都是 $0$。对 $8i - 3$，先写成 $a + bi$ 的形式：$-3 + 8i$。实部是 $-3$，虚部是 $8$。检验：$-3 + 8i = 8i - 3$。

> **注意。** $-3 + 8i$ 的虚部是 $8$，不是 $8i$。实部是不含 $i$ 的项，无论写在哪里：在 $8i - 3$ 中它是 $-3$，不是 $8$。注意符号：$4 - 6i$ 的虚部是 $-6$。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 5);
        const a = kind === 4 ? 0 : rng.nonZero(-12, 12);
        const b0 = kind === 5 ? 0 : rng.nonZero(-12, 12);
        // The real and imaginary parts differ in size, so that the answer tells them apart.
        const b = Math.abs(b0) === Math.abs(a) ? b0 + Math.sign(b0) * (Math.abs(b0) === 12 ? -1 : 1) : b0;
        const z = kind === 3 ? poly([b, "i"], [a, ""]) : cx(a, b);
        const real = rng.bool();
        return numberProblem({
          prompt: real
            ? t(`What is the real part of $${z}$?`, `$${z}$ 的实部是多少？`)
            : t(`What is the imaginary part of $${z}$?`, `$${z}$ 的虚部是多少？`),
          answer: real ? a : b,
          wrong: real ? [b, -a] : [a, -b],
          solution: real
            ? walked(
                [
                  [
                    ["Write it as $a + bi$", "写成 $a + bi$ 的形式"],
                    kind === 3
                      ? t(
                          `Put the real term first: $${z} = ${cx(a, b)} = ${a} + ${paren(b)}i$.`,
                          `把实数项写在前面：$${z} = ${cx(a, b)} = ${a} + ${paren(b)}i$。`,
                        )
                      : t(
                          `$${z}$ is already in this form, with $a = ${a}$ and $b = ${b}$.`,
                          `$${z}$ 已是这种形式，其中 $a = ${a}$，$b = ${b}$。`,
                        ),
                  ],
                  [
                    ["Read the part", "读出所求部分"],
                    t(`The real part is the number without $i$: $${a}$.`, `实部是不含 $i$ 的数：$${a}$。`),
                  ],
                ],
                t(
                  `Putting the parts back together, $${a} + ${paren(b)} \\cdot i = ${z}$, the given number.`,
                  `把两部分放回去，$${a} + ${paren(b)} \\cdot i = ${z}$，正是所给的数。`,
                ),
              )
            : walked(
                [
                  [
                    ["Write it as $a + bi$", "写成 $a + bi$ 的形式"],
                    kind === 3
                      ? t(
                          `Put the real term first: $${z} = ${cx(a, b)} = ${a} + ${paren(b)}i$.`,
                          `把实数项写在前面：$${z} = ${cx(a, b)} = ${a} + ${paren(b)}i$。`,
                        )
                      : t(
                          `$${z}$ is already in this form, with $a = ${a}$ and $b = ${b}$.`,
                          `$${z}$ 已是这种形式，其中 $a = ${a}$，$b = ${b}$。`,
                        ),
                  ],
                  [
                    ["Read the part", "读出所求部分"],
                    t(
                      `The imaginary part is the real number multiplying $i$: $${b}$${b === 0 ? "" : `, not $${imag(b, 1)}$`}.`,
                      `虚部是 $i$ 的系数，是实数 $${b}$${b === 0 ? "" : `，不是 $${imag(b, 1)}$`}。`,
                    ),
                  ],
                ],
                t(
                  `Putting the parts back together, $${a} + ${paren(b)} \\cdot i = ${z}$, the given number.`,
                  `把两部分放回去，$${a} + ${paren(b)} \\cdot i = ${z}$，正是所给的数。`,
                ),
              ),
        });
      },
    },
    {
      id: "standard-form",
      title: t("Writing complex numbers in the form $a + bi$", "把复数写成 $a + bi$ 的形式"),
      explanation: t(
        `The form $a + bi$ shows the two parts of a complex number at a glance, so we write every answer that way. Rewrite square roots of negative numbers with $i$, then collect the real terms and the imaginary terms. A fraction is divided term by term, because $\\frac{p + q}{d} = \\frac{p}{d} + \\frac{q}{d}$.

For $\\frac{10 - \\sqrt{-75}}{5}$: $\\sqrt{-75} = i\\sqrt{75} = 5i\\sqrt{3}$, so

$$\\frac{10 - \\sqrt{-75}}{5} = \\frac{10 - 5i\\sqrt{3}}{5} = 2 - i\\sqrt{3}.$$

Check: $5(2 - i\\sqrt{3}) = 10 - 5i\\sqrt{3}$, and $(5i\\sqrt{3})^{2} = 25 \\cdot 3 \\cdot i^{2} = -75$.

> **Watch out.** Divide **both** terms by the denominator, not just one. Keep the sign in front of the root with the imaginary part. $\\sqrt{-75}$ is $5i\\sqrt{3}$, not $75i$, and the $i$ must not disappear.`,
        `$a + bi$ 的形式让复数的两个部分一目了然，所以答案都写成这种形式。先用 $i$ 改写负数的平方根，再把实数项和虚数项分别合并。分式要逐项相除，因为 $\\frac{p + q}{d} = \\frac{p}{d} + \\frac{q}{d}$。

对 $\\frac{10 - \\sqrt{-75}}{5}$：$\\sqrt{-75} = i\\sqrt{75} = 5i\\sqrt{3}$，所以

$$\\frac{10 - \\sqrt{-75}}{5} = \\frac{10 - 5i\\sqrt{3}}{5} = 2 - i\\sqrt{3}$$

检验：$5(2 - i\\sqrt{3}) = 10 - 5i\\sqrt{3}$，且 $(5i\\sqrt{3})^{2} = 25 \\cdot 3 \\cdot i^{2} = -75$。

> **注意。** 分子的**两项**都要除以分母，不能只除一项。根号前的符号要跟着虚部。$\\sqrt{-75}$ 等于 $5i\\sqrt{3}$，不是 $75i$，$i$ 也不能丢。`,
      ),
      keyPrerequisites: ["imaginary-numbers"],
      generate(rng) {
        const { n, c, m } = negRoot(rng);
        const s = rng.sign();
        if (rng.bool(0.35)) {
          const d = rng.int(2, 4);
          const n2 = d * d * n;
          const a = rng.nonZero(-8, 8);
          const top = `${d * a} ${s > 0 ? "+" : "-"} \\sqrt{-${n2}}`;
          const answer = cxr(a, s * c, m);
          return expressionProblem({
            prompt: t(`Write $\\frac{${top}}{${d}}$ in the form $a + bi$.`, `把 $\\frac{${top}}{${d}}$ 写成 $a + bi$ 的形式。`),
            answer,
            radical: true,
            wrong: [cxr(a, s * c * d, m), cxr(d * a, s * c, m), cxr(a, -s * c, m)],
            solution: walked(
              [
                [
                  ["Rewrite the root", "改写根式"],
                  t(`$\\sqrt{-${n2}} = ${imag(c * d, m)}$, so`, `$\\sqrt{-${n2}} = ${imag(c * d, m)}$，所以`),
                  [`\\frac{${top}}{${d}} = \\frac{${cxr(d * a, s * c * d, m)}}{${d}}`],
                ],
                [
                  ["Divide each term", "逐项相除"],
                  t(
                    `Divide both terms by $${d}$: $${d * a} \\div ${d} = ${a}$ and $${imag(s * c * d, m)} \\div ${d} = ${imag(s * c, m)}$, so the number is $${answer}$.`,
                    `两项都除以 $${d}$：$${d * a} \\div ${d} = ${a}$，$${imag(s * c * d, m)} \\div ${d} = ${imag(s * c, m)}$，所以这个数是 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `$${d}(${answer}) = ${cxr(d * a, s * c * d, m)}$, and $${imagSquare(c * d, m)}$, so $${imag(c * d, m)}$ is the square root of $-${n2}$.`,
                `$${d}(${answer}) = ${cxr(d * a, s * c * d, m)}$，且 $${imagSquare(c * d, m)}$，所以 $${imag(c * d, m)}$ 正是 $-${n2}$ 的平方根。`,
              ),
            ),
          });
        }
        const a = rng.nonZero(-12, 12);
        const rootFirst = rng.bool();
        const expr = rootFirst
          ? `${s < 0 ? "-" : ""}\\sqrt{-${n}} ${a < 0 ? "-" : "+"} ${Math.abs(a)}`
          : `${a} ${s > 0 ? "+" : "-"} \\sqrt{-${n}}`;
        const answer = cxr(a, s * c, m);
        return expressionProblem({
          prompt: t(`Write $${expr}$ in the form $a + bi$.`, `把 $${expr}$ 写成 $a + bi$ 的形式。`),
          answer,
          radical: true,
          wrong: [cxr(a, -s * c, m), m === 1 ? String(a + s * c) : rad(s * c, m), cxr(a, s * n, 1)],
          solution: walked(
            [
              [
                ["Rewrite the root", "改写根式"],
                t(`$\\sqrt{-${n}} = ${imag(c, m)}$, so`, `$\\sqrt{-${n}} = ${imag(c, m)}$，所以`),
                [`${expr} = ${answer}`],
              ],
              [
                ["Name the parts", "指出实部和虚部"],
                t(`The real part is $${a}$ and the imaginary part is $${rad(s * c, m)}$.`, `实部是 $${a}$，虚部是 $${rad(s * c, m)}$。`),
              ],
            ],
            t(
              `$${imagSquare(c, m)}$, so $${imag(c, m)}$ is indeed the square root of $-${n}$.`,
              `$${imagSquare(c, m)}$，所以 $${imag(c, m)}$ 确实是 $-${n}$ 的平方根。`,
            ),
          ),
        });
      },
    },
    {
      id: "equal-complex-numbers",
      title: t("Equal complex numbers", "复数相等"),
      explanation: t(
        `Two complex numbers are **equal** exactly when their real parts are equal and their imaginary parts are equal: if $a + bi = c + di$ with real $a, b, c, d$, then $a - c = (d - b)i$, and a real number can equal an imaginary one only when both are $0$. So one equation between complex numbers gives two real equations.

If $a$ and $b$ are real and $(3a + 2) + 4bi = -7 + 20i$, then

$$3a + 2 = -7 \\quad\\Rightarrow\\quad a = -3, \\qquad 4b = 20 \\quad\\Rightarrow\\quad b = 5.$$

Check: $3(-3) + 2 = -7$ and $4 \\cdot 5 = 20$.

> **Watch out.** Match real with real and imaginary with imaginary; do not swap $a$ and $b$. The imaginary part of $20i$ is $20$, so solve $4b = 20$, not $4b = 20i$. Keep the signs of both parts.`,
        `两个复数**相等**，当且仅当它们的实部相等且虚部相等：若 $a + bi = c + di$（$a, b, c, d$ 为实数），则 $a - c = (d - b)i$，而实数等于虚数只有两者都为 $0$ 时才可能。所以一个复数等式给出两个实数等式。

若 $a$、$b$ 是实数，且 $(3a + 2) + 4bi = -7 + 20i$，则

$$3a + 2 = -7 \\quad\\Rightarrow\\quad a = -3, \\qquad 4b = 20 \\quad\\Rightarrow\\quad b = 5$$

检验：$3(-3) + 2 = -7$，$4 \\cdot 5 = 20$。

> **注意。** 实部对实部，虚部对虚部；不要把 $a$ 和 $b$ 弄反。$20i$ 的虚部是 $20$，所以解 $4b = 20$，不是 $4b = 20i$。两个部分的符号都要保留。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-9, 9);
        const p = rng.pick([1, 2, 3, 4, -2]);
        const q = rng.int(-9, 9);
        const r = rng.pick([1, 2, 3, 5, -1, -3]);
        const A = p * a + q;
        const B = r * b;
        const left = poly([1, `(${linear(p, q, "a")})`], [r, "bi"]);
        return pointProblem({
          prompt: t(
            `The real numbers $a$ and $b$ satisfy $${left} = ${cx(A, B)}$. Find $a$ and $b$, as the ordered pair $(a, b)$.`,
            `实数 $a$、$b$ 满足 $${left} = ${cx(A, B)}$。求 $a$ 和 $b$，写成有序数对 $(a, b)$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [
            [b, a],
            [a, -b],
            [Q.of(A, p), b],
          ],
          solution: walked(
            [
              [
                ["Equate the real parts", "令实部相等"],
                t("The real parts must be equal:", "实部必须相等："),
                p === 1 && q === 0
                  ? [`a = ${a}`]
                  : [`${linear(p, q, "a")} = ${A}`, ...(q !== 0 && p !== 1 ? [`${front(p)}a = ${A - q}`] : []), `a = ${a}`],
              ],
              [
                ["Equate the imaginary parts", "令虚部相等"],
                t("The imaginary parts must be equal:", "虚部必须相等："),
                r === 1 ? [`b = ${b}`] : [`${front(r)}b = ${B}`, `b = ${b}`],
              ],
            ],
            t(
              `Substituting, $${p === 1 ? paren(a) : `${p} \\cdot ${paren(a)}`}${q === 0 ? "" : ` + ${paren(q)}`} = ${A}$ and $${r === 1 ? paren(b) : `${r} \\cdot ${paren(b)}`} = ${B}$, so the left side is $${cx(A, B)}$, the right side.`,
              `代入得 $${p === 1 ? paren(a) : `${p} \\cdot ${paren(a)}`}${q === 0 ? "" : ` + ${paren(q)}`} = ${A}$，$${r === 1 ? paren(b) : `${r} \\cdot ${paren(b)}`} = ${B}$，所以左边是 $${cx(A, B)}$，等于右边。`,
            ),
          ),
        });
      },
    },
  ],
};

/** cxPar writes a complex number in parentheses. */
const cxPar = (a: number, b: number) => `(${cx(a, b)})`;

/** drawComplex draws a complex number with nonzero real and imaginary parts. */
const drawComplex = (rng: Rng, max = 9): [number, number] => [rng.nonZero(-max, max), rng.nonZero(-max, max)];

export const addingAndSubtractingComplexNumbers: TopicDef = {
  id: "adding-and-subtracting-complex-numbers",
  title: t("Adding and Subtracting Complex Numbers", "复数的加减"),
  summary: t(
    "Add and subtract complex numbers by combining their real parts and their imaginary parts.",
    "把实部与实部、虚部与虚部分别合并，进行复数的加减。",
  ),
  prerequisites: ["complex-numbers"],
  encompasses: [{ topic: "complex-numbers", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSN.CN.A.2"],
  intro: t(
    `A complex number has two parts that never mix: a real part and an imaginary part. So adding complex numbers works like adding $2 + 5x$ and $4 - 3x$: collect the like terms.

$$(2 + 5i) + (4 - 3i) = (2 + 4) + (5 - 3)i = 6 + 2i$$

Check: subtracting back, $(6 + 2i) - (4 - 3i) = 2 + 5i$.

In this lesson we add and subtract complex numbers, and combine multiples, sums and differences.`,
    `复数有两个互不混合的部分：实部和虚部。所以复数相加就像 $2 + 5x$ 与 $4 - 3x$ 相加：合并同类项。

$$(2 + 5i) + (4 - 3i) = (2 + 4) + (5 - 3)i = 6 + 2i$$

检验：反过来相减，$(6 + 2i) - (4 - 3i) = 2 + 5i$。

这节课我们进行复数的加减，以及倍数与加减的混合运算。`,
  ),
  knowledgePoints: [
    {
      id: "adding",
      title: t("Adding complex numbers", "复数的加法"),
      explanation: t(
        `Add complex numbers like polynomials in $i$: real parts are like terms of each other, and imaginary parts are like terms of each other, but a real term and an imaginary term never combine. So add the real parts and add the imaginary parts.

$$(-7 + 2i) + (3 - 9i) = (-7 + 3) + (2 - 9)i = -4 - 7i$$

Check: subtracting back, $(-4 - 7i) - (3 - 9i) = -7 + 2i$.

> **Watch out.** Do not add a real part to an imaginary part: $-4 - 7i$ is not $-11$. Keep each sign with its term: the imaginary part of $3 - 9i$ is $-9$, so $2 + (-9) = -7$, not $11$.`,
        `像关于 $i$ 的多项式那样相加复数：实部与实部是同类项，虚部与虚部是同类项，但实数项与虚数项不能合并。所以实部相加，虚部相加。

$$(-7 + 2i) + (3 - 9i) = (-7 + 3) + (2 - 9)i = -4 - 7i$$

检验：反过来相减，$(-4 - 7i) - (3 - 9i) = -7 + 2i$。

> **注意。** 不要把实部和虚部相加：$-4 - 7i$ 不是 $-11$。每项的符号跟着这一项：$3 - 9i$ 的虚部是 $-9$，所以 $2 + (-9) = -7$，不是 $11$。`,
      ),
      generate(rng) {
        const [a, b] = drawComplex(rng);
        const [c, d] = drawComplex(rng);
        const expr = `${cxPar(a, b)} + ${cxPar(c, d)}`;
        const answer = cx(a + c, b + d);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(a + c, b - d), cx(a - c, b + d), String(a + b + c + d), cx(a + c, -(b + d))],
          solution: walked(
            [
              [
                ["Group the parts", "分组"],
                t("Put the real parts together and the imaginary parts together:", "把实部放在一起，虚部放在一起："),
                [`${expr} = (${a} ${c < 0 ? "-" : "+"} ${Math.abs(c)}) + (${b} ${d < 0 ? "-" : "+"} ${Math.abs(d)})i`],
              ],
              [
                ["Combine", "合并"],
                t("Add within each group:", "每组分别相加："),
                [`(${a} ${c < 0 ? "-" : "+"} ${Math.abs(c)}) + (${b} ${d < 0 ? "-" : "+"} ${Math.abs(d)})i = ${answer}`],
              ],
            ],
            t(
              `Subtracting back, $(${answer}) - ${cxPar(c, d)} = ${cx(a, b)}$, the first number.`,
              `反过来相减，$(${answer}) - ${cxPar(c, d)} = ${cx(a, b)}$，正是第一个数。`,
            ),
          ),
        });
      },
    },
    {
      id: "subtracting",
      title: t("Subtracting complex numbers", "复数的减法"),
      explanation: t(
        `Subtracting a complex number means subtracting all of it, so the minus sign applies to **both** of its parts, just as $-(x - y) = -x + y$. Distribute the minus sign, then combine like terms.

$$(5 - 2i) - (-1 + 6i) = 5 - 2i + 1 - 6i = 6 - 8i$$

Check: adding back, $(6 - 8i) + (-1 + 6i) = 5 - 2i$.

> **Watch out.** Change the sign of the imaginary part too: changing only the real part would give $6 + 4i$. Subtract in the order written; $(-1 + 6i) - (5 - 2i)$ is the opposite, $-6 + 8i$. Do not add the second number.`,
        `减去一个复数就是减去它的全部，所以减号作用于它的**两个**部分，正如 $-(x - y) = -x + y$。先去括号（注意减号），再合并同类项。

$$(5 - 2i) - (-1 + 6i) = 5 - 2i + 1 - 6i = 6 - 8i$$

检验：反过来相加，$(6 - 8i) + (-1 + 6i) = 5 - 2i$。

> **注意。** 虚部的符号也要改变：只改实部会得到 $6 + 4i$。按书写的顺序相减；$(-1 + 6i) - (5 - 2i)$ 正好是相反数 $-6 + 8i$。不要把第二个数加上去。`,
      ),
      generate(rng) {
        const [a, b] = drawComplex(rng);
        const [c, d] = drawComplex(rng);
        const expr = `${cxPar(a, b)} - ${cxPar(c, d)}`;
        const answer = cx(a - c, b - d);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(a - c, b + d), cx(a + c, b + d), cx(c - a, d - b)],
          solution: walked(
            [
              [
                ["Distribute the minus sign", "去括号"],
                t("The minus sign changes the sign of both parts of the second number:", "减号改变第二个数两个部分的符号："),
                [`${expr} = ${poly([a, ""], [b, "i"], [-c, ""], [-d, "i"])}`],
              ],
              [
                ["Combine", "合并"],
                t("Collect the real terms and the imaginary terms:", "分别合并实数项和虚数项："),
                [`(${a} ${c > 0 ? "-" : "+"} ${Math.abs(c)}) + (${b} ${d > 0 ? "-" : "+"} ${Math.abs(d)})i = ${answer}`],
              ],
            ],
            t(
              `Adding back, $(${answer}) + ${cxPar(c, d)} = ${cx(a, b)}$, the first number.`,
              `反过来相加，$(${answer}) + ${cxPar(c, d)} = ${cx(a, b)}$，正是第一个数。`,
            ),
          ),
        });
      },
    },
    {
      id: "combinations",
      title: t("Multiples, sums and differences", "倍数与加减混合"),
      explanation: t(
        `A real number times a complex number multiplies both parts, by the distributive law: $3(2 - 5i) = 6 - 15i$. With several terms, distribute first, then collect the real terms and the imaginary terms. Rewrite square roots of negative numbers with $i$ before combining.

$$-2(3 - i) + (4 + 5i) - \\sqrt{-9} = -6 + 2i + 4 + 5i - 3i = -2 + 4i$$

Check, one piece at a time: $-2(3 - i) = -6 + 2i$; adding $4 + 5i$ gives $-2 + 7i$; subtracting $3i$ gives $-2 + 4i$.

> **Watch out.** Multiply **both** parts by the number in front, not just the real part. A minus sign before parentheses changes both signs inside. $\\sqrt{-9}$ is $3i$, an imaginary term, not $-3$.`,
        `由分配律，实数乘复数时两个部分都要乘：$3(2 - 5i) = 6 - 15i$。项较多时，先去括号，再把实数项和虚数项分别合并。合并之前先用 $i$ 改写负数的平方根。

$$-2(3 - i) + (4 + 5i) - \\sqrt{-9} = -6 + 2i + 4 + 5i - 3i = -2 + 4i$$

逐步检验：$-2(3 - i) = -6 + 2i$；加上 $4 + 5i$ 得 $-2 + 7i$；再减去 $3i$ 得 $-2 + 4i$。

> **注意。** 前面的数要乘**两个**部分，不能只乘实部。括号前的减号会改变括号里两项的符号。$\\sqrt{-9}$ 等于 $3i$，是虚数项，不是 $-3$。`,
      ),
      generate(rng) {
        const k = rng.pick([2, 3, 4, 5, -2, -3]);
        const [a, b] = drawComplex(rng, 6);
        const [c, d] = drawComplex(rng, 9);
        const sub = rng.bool();
        const root = rng.bool();
        const e = rng.int(1, 9);
        const extra = root ? ` + \\sqrt{-${e * e}}` : ` ${rng.bool() ? "+" : "-"} ${e === 1 ? "" : e}i`;
        const ex = root ? e : extra.includes("-") ? -e : e;
        const expr = `${k}${cxPar(a, b)} ${sub ? "-" : "+"} ${cxPar(c, d)}${extra}`;
        const s = sub ? -1 : 1;
        const re = k * a + s * c;
        const im = k * b + s * d + ex;
        const answer = cx(re, im);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(k * a + s * c, b + s * d + ex), cx(re, im - 2 * ex), cx(k * a - s * c, k * b - s * d + ex)],
          solution: walked(
            [
              [
                ["Distribute", "去括号"],
                root
                  ? t(
                      `Multiply out, and rewrite $\\sqrt{-${e * e}} = ${imag(e, 1)}$:`,
                      `去括号，并把 $\\sqrt{-${e * e}}$ 改写为 $${imag(e, 1)}$：`,
                    )
                  : t("Multiply out the parentheses:", "去括号："),
                [`${expr} = ${poly([k * a, ""], [k * b, "i"], [s * c, ""], [s * d, "i"], [ex, "i"])}`],
              ],
              [
                ["Collect", "合并"],
                t(
                  `The real terms give $${poly([k * a, ""], [s * c, ""])} = ${re}$ and the imaginary terms give $${poly([k * b, "i"], [s * d, "i"], [ex, "i"])} = ${im === 0 ? "0" : imag(im, 1)}$, so the result is $${answer}$.`,
                  `实数项得 $${poly([k * a, ""], [s * c, ""])} = ${re}$，虚数项得 $${poly([k * b, "i"], [s * d, "i"], [ex, "i"])} = ${im === 0 ? "0" : imag(im, 1)}$，所以结果是 $${answer}$。`,
                ),
              ],
            ],
            t(
              `One piece at a time: $${k}${cxPar(a, b)} = ${cx(k * a, k * b)}$; ${sub ? "subtracting" : "adding"} $${cxPar(c, d)}$ gives $${cx(k * a + s * c, k * b + s * d)}$; then ${ex > 0 ? "adding" : "subtracting"} $${imag(Math.abs(ex), 1)}$ gives $${answer}$.`,
              `逐步计算：$${k}${cxPar(a, b)} = ${cx(k * a, k * b)}$；${sub ? "减去" : "加上"} $${cxPar(c, d)}$ 得 $${cx(k * a + s * c, k * b + s * d)}$；再${ex > 0 ? "加上" : "减去"} $${imag(Math.abs(ex), 1)}$ 得 $${answer}$。`,
            ),
          ),
        });
      },
    },
  ],
};

export const multiplyingComplexNumbers: TopicDef = {
  id: "multiplying-complex-numbers",
  title: t("Multiplying Complex Numbers", "复数的乘法"),
  summary: t(
    "Multiply complex numbers by distributing and replacing $i^{2}$ by $-1$, including squares and products of conjugates.",
    "用分配律相乘复数并把 $i^{2}$ 换成 $-1$，包括复数的平方与共轭复数之积。",
  ),
  prerequisites: ["adding-and-subtracting-complex-numbers", "multiplying-binomials"],
  encompasses: [
    { topic: "multiplying-binomials", weight: 0.4 },
    { topic: "adding-and-subtracting-complex-numbers", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSN.CN.A.2"],
  intro: t(
    `Complex numbers multiply like binomials: every term times every term. The only new step is that $i \\cdot i = i^{2} = -1$, which turns that product into a real number:

$$(1 + 2i)(3 + i) = 3 + i + 6i + 2i^{2} = 3 + 7i - 2 = 1 + 7i$$

Check with the pattern $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$: $1 \\cdot 3 - 2 \\cdot 1 = 1$ and $1 \\cdot 1 + 2 \\cdot 3 = 7$.

In this lesson we multiply complex numbers, including squares and products of conjugates.`,
    `复数相乘与二项式相乘一样：每一项乘每一项。唯一的新步骤是 $i \\cdot i = i^{2} = -1$，它把这个乘积变成实数：

$$(1 + 2i)(3 + i) = 3 + i + 6i + 2i^{2} = 3 + 7i - 2 = 1 + 7i$$

用公式 $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ 检验：$1 \\cdot 3 - 2 \\cdot 1 = 1$，$1 \\cdot 1 + 2 \\cdot 3 = 7$。

这节课我们进行复数的乘法，包括复数的平方和共轭复数之积。`,
  ),
  knowledgePoints: [
    {
      id: "by-an-imaginary-number",
      title: t("Multiplying by an imaginary number", "乘以一个虚数"),
      explanation: t(
        `Complex numbers multiply like binomials, with one extra rule: $i^{2} = -1$. Multiplying by an imaginary number $ki$ sends the real part to an imaginary term and, through $i^{2} = -1$, the imaginary part to a real term.

Distribute, replace $i^{2}$ by $-1$, and write the result in the form $a + bi$:

$$-2i(5 + 3i) = -10i - 6i^{2} = -10i + 6 = 6 - 10i$$

Check with $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ for $(0 - 2i)(5 + 3i)$: real part $0 \\cdot 5 - (-2) \\cdot 3 = 6$, imaginary part $0 \\cdot 3 + (-2) \\cdot 5 = -10$.

> **Watch out.** $-6i^{2}$ is $+6$, not $-6$: replacing $i^{2}$ by $-1$ flips the sign. Write the real part first. Multiply each part by the whole of $-2i$, sign included.`,
        `复数相乘与二项式相乘一样，只多一条规则：$i^{2} = -1$。乘以虚数 $ki$ 时，实部变成虚数项，而虚部通过 $i^{2} = -1$ 变成实数项。

用分配律展开，把 $i^{2}$ 换成 $-1$，再把结果写成 $a + bi$ 的形式：

$$-2i(5 + 3i) = -10i - 6i^{2} = -10i + 6 = 6 - 10i$$

用 $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ 检验 $(0 - 2i)(5 + 3i)$：实部 $0 \\cdot 5 - (-2) \\cdot 3 = 6$，虚部 $0 \\cdot 3 + (-2) \\cdot 5 = -10$。

> **注意。** $-6i^{2}$ 等于 $+6$，不是 $-6$：把 $i^{2}$ 换成 $-1$ 会变号。实部写在前面。每一部分都要乘整个 $-2i$，连同符号。`,
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const [a, b] = drawComplex(rng);
        const expr = `${imag(k, 1)}${cxPar(a, b)}`;
        const answer = cx(-k * b, k * a);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(k * b, k * a), cx(k * a, k * b), cx(k * a, -k * b)],
          solution: walked(
            [
              [
                ["Distribute", "用分配律展开"],
                t(`Multiply each part by $${imag(k, 1)}$:`, `每一部分都乘以 $${imag(k, 1)}$：`),
                [`${expr} = ${poly([k * a, "i"], [k * b, "i^{2}"])}`],
              ],
              [
                ["Replace $i^{2}$", "替换 $i^{2}$"],
                t("Use $i^{2} = -1$ and put the real part first:", "利用 $i^{2} = -1$，并把实部写在前面："),
                [`${poly([k * a, "i"], [k * b, "i^{2}"])} = ${poly([k * a, "i"], [-k * b, ""])} = ${answer}`],
              ],
            ],
            t(
              `With $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ for $(0 ${k < 0 ? "-" : "+"} ${imag(Math.abs(k), 1)})${cxPar(a, b)}$: the real part is $0 \\cdot ${paren(a)} - ${paren(k)} \\cdot ${paren(b)} = ${-k * b}$ and the imaginary part is $0 \\cdot ${paren(b)} + ${paren(k)} \\cdot ${paren(a)} = ${k * a}$.`,
              `用 $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ 计算 $(0 ${k < 0 ? "-" : "+"} ${imag(Math.abs(k), 1)})${cxPar(a, b)}$：实部是 $0 \\cdot ${paren(a)} - ${paren(k)} \\cdot ${paren(b)} = ${-k * b}$，虚部是 $0 \\cdot ${paren(b)} + ${paren(k)} \\cdot ${paren(a)} = ${k * a}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "two-complex-numbers",
      title: t("Multiplying two complex numbers", "两个复数相乘"),
      explanation: t(
        `Multiply two complex numbers like two binomials: each term of the first times each term of the second, four products in all. The product of the two imaginary terms contains $i^{2} = -1$, so it becomes a real number and joins the real part. In general

$$(a + bi)(c + di) = (ac - bd) + (ad + bc)i.$$

For $(3 - 2i)(1 + 4i)$:

$$3 + 12i - 2i - 8i^{2} = 3 + 10i + 8 = 11 + 10i$$

Check with the pattern: $3 \\cdot 1 - (-2) \\cdot 4 = 11$ and $3 \\cdot 4 + (-2) \\cdot 1 = 10$.

> **Watch out.** The product of the imaginary parts is **subtracted** from the real part: $ac - bd$, not $ac + bd$. Do not stop at multiplying real by real and imaginary by imaginary; the two mixed products make the imaginary part.`,
        `像两个二项式那样相乘两个复数：第一个的每一项乘第二个的每一项，共四个乘积。两个虚数项之积含有 $i^{2} = -1$，于是变成实数并入实部。一般地

$$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$$

对 $(3 - 2i)(1 + 4i)$：

$$3 + 12i - 2i - 8i^{2} = 3 + 10i + 8 = 11 + 10i$$

用公式检验：$3 \\cdot 1 - (-2) \\cdot 4 = 11$，$3 \\cdot 4 + (-2) \\cdot 1 = 10$。

> **注意。** 虚部之积要从实部中**减去**：是 $ac - bd$，不是 $ac + bd$。不要只把实部乘实部、虚部乘虚部；两个交叉乘积构成虚部。`,
      ),
      keyPrerequisites: ["multiplying-binomials"],
      generate(rng) {
        const [a, b] = drawComplex(rng, 7);
        const [c, d] = drawComplex(rng, 7);
        const expr = `${cxPar(a, b)}${cxPar(c, d)}`;
        const answer = cx(a * c - b * d, a * d + b * c);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(a * c + b * d, a * d + b * c), cx(a * c, b * d), cx(a * c - b * d, a * d - b * c)],
          solution: walked(
            [
              [
                ["Multiply out", "展开"],
                t(
                  "Multiply every term of the first factor by every term of the second; there are four products:",
                  "用第一个因式的每一项乘第二个因式的每一项，共四个乘积：",
                ),
                [`${expr} = ${poly([a * c, ""], [a * d, "i"], [b * c, "i"], [b * d, "i^{2}"])}`],
              ],
              [
                ["Use $i^{2} = -1$ and combine", "利用 $i^{2} = -1$ 并合并"],
                t("The last product becomes real; then collect like terms:", "最后一个乘积变成实数，再合并同类项："),
                [
                  `${poly([a * c, ""], [a * d, "i"], [b * c, "i"], [b * d, "i^{2}"])} = ${poly([a * c, ""], [a * d + b * c, "i"], [-b * d, ""])} = ${answer}`,
                ],
              ],
            ],
            t(
              `With the pattern $(ac - bd) + (ad + bc)i$: $${a} \\cdot ${paren(c)} - ${paren(b)} \\cdot ${paren(d)} = ${a * c - b * d}$ and $${a} \\cdot ${paren(d)} + ${paren(b)} \\cdot ${paren(c)} = ${a * d + b * c}$.`,
              `用公式 $(ac - bd) + (ad + bc)i$：$${a} \\cdot ${paren(c)} - ${paren(b)} \\cdot ${paren(d)} = ${a * c - b * d}$，$${a} \\cdot ${paren(d)} + ${paren(b)} \\cdot ${paren(c)} = ${a * d + b * c}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "squares-and-conjugates",
      title: t("Squares and conjugates", "平方与共轭复数"),
      explanation: t(
        `The **conjugate** of $a + bi$ is $a - bi$. Their product is a real number, by the difference of squares, because $-b^{2}i^{2} = +b^{2}$:

$$(a + bi)(a - bi) = a^{2} - b^{2}i^{2} = a^{2} + b^{2}.$$

So $(2 - 5i)(2 + 5i) = 4 + 25 = 29$. A square follows the pattern $(x + y)^{2} = x^{2} + 2xy + y^{2}$:

$$(2 - 5i)^{2} = 4 - 20i + 25i^{2} = -21 - 20i$$

Check the square by multiplying out: real part $2 \\cdot 2 - (-5)(-5) = -21$, imaginary part $2 \\cdot (-5) + (-5) \\cdot 2 = -20$.

> **Watch out.** A product of conjugates is $a^{2} + b^{2}$, not $a^{2} - b^{2}$, and it has no $i$. Squaring is not squaring each part: $(2 - 5i)^{2}$ is not $4 + 25i^{2}$; the middle term $2xy$ is there.`,
        `$a + bi$ 的**共轭复数**是 $a - bi$。由平方差公式，它们的积是实数，因为 $-b^{2}i^{2} = +b^{2}$：

$$(a + bi)(a - bi) = a^{2} - b^{2}i^{2} = a^{2} + b^{2}$$

所以 $(2 - 5i)(2 + 5i) = 4 + 25 = 29$。平方则按照 $(x + y)^{2} = x^{2} + 2xy + y^{2}$ 展开：

$$(2 - 5i)^{2} = 4 - 20i + 25i^{2} = -21 - 20i$$

把平方直接相乘来检验：实部 $2 \\cdot 2 - (-5)(-5) = -21$，虚部 $2 \\cdot (-5) + (-5) \\cdot 2 = -20$。

> **注意。** 共轭复数之积是 $a^{2} + b^{2}$，不是 $a^{2} - b^{2}$，而且不含 $i$。平方不是把每部分分别平方：$(2 - 5i)^{2}$ 不等于 $4 + 25i^{2}$；中间项 $2xy$ 不能丢。`,
      ),
      generate(rng) {
        const [a, b] = drawComplex(rng, 8);
        if (rng.bool()) {
          const expr = `${cxPar(a, b)}${cxPar(a, -b)}`;
          return expressionProblem({
            prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
            answer: String(a * a + b * b),
            simplified: true,
            wrong: [String(a * a - b * b), cx(a * a + b * b, 2 * a * b), cx(a * a - b * b, -2 * a * b)],
            solution: walked(
              [
                [
                  ["Recognize conjugates", "识别共轭复数"],
                  t(
                    `$${cx(a, -b)}$ is the conjugate of $${cx(a, b)}$, so the product is a difference of squares:`,
                    `$${cx(a, -b)}$ 是 $${cx(a, b)}$ 的共轭复数，所以积是平方差：`,
                  ),
                  [`${expr} = ${paren(a)}^{2} - (${imag(b, 1)})^{2}`],
                ],
                [
                  ["Simplify", "化简"],
                  t("Since $(bi)^{2} = -b^{2}$, the subtraction becomes an addition:", "因为 $(bi)^{2} = -b^{2}$，减法变成加法："),
                  [`${paren(a)}^{2} - (${imag(b, 1)})^{2} = ${a * a} - ${paren(-b * b)} = ${a * a + b * b}`],
                ],
              ],
              t(
                `$a^{2} + b^{2} = ${a * a} + ${b * b} = ${a * a + b * b}$, a positive real number, as a product of conjugates always is.`,
                `$a^{2} + b^{2} = ${a * a} + ${b * b} = ${a * a + b * b}$，是正实数，共轭复数之积总是这样。`,
              ),
            ),
          });
        }
        const expr = `${cxPar(a, b)}^{2}`;
        const answer = cx(a * a - b * b, 2 * a * b);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(a * a + b * b, 2 * a * b), cx(a * a - b * b, 0), cx(a * a, b * b), cx(a * a + b * b, 0)],
          solution: walked(
            [
              [
                ["Square the binomial", "按二项式平方展开"],
                t("Use $(x + y)^{2} = x^{2} + 2xy + y^{2}$:", "利用 $(x + y)^{2} = x^{2} + 2xy + y^{2}$："),
                [`${expr} = ${paren(a)}^{2} + 2 \\cdot ${paren(a)} \\cdot ${imag(b, 1)} + (${imag(b, 1)})^{2}`],
              ],
              [
                ["Use $i^{2} = -1$", "利用 $i^{2} = -1$"],
                t("The last term becomes real; collect the real terms:", "最后一项变成实数，合并实数项："),
                [
                  `${poly([a * a, ""], [2 * a * b, "i"], [b * b, "i^{2}"])} = ${poly([a * a, ""], [2 * a * b, "i"], [-b * b, ""])} = ${answer}`,
                ],
              ],
            ],
            t(
              `Multiplying $${cxPar(a, b)}${cxPar(a, b)}$ out instead: the real part is $${paren(a)}^{2} - ${paren(b)}^{2} = ${a * a - b * b}$ and the imaginary part is $2 \\cdot ${paren(a)} \\cdot ${paren(b)} = ${2 * a * b}$.`,
              `直接相乘 $${cxPar(a, b)}${cxPar(a, b)}$ 来检验：实部是 $${paren(a)}^{2} - ${paren(b)}^{2} = ${a * a - b * b}$，虚部是 $2 \\cdot ${paren(a)} \\cdot ${paren(b)} = ${2 * a * b}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** complexRoots draws a center h and an imaginary part c√m for solutions h ± c·i·√m. */
function complexRoots(rng: Rng): { h: number; k: number; c: number; m: number } {
  const h = rng.nonZero(-6, 6);
  const { n, c, m } = negRoot(rng);
  return { h, k: n, c, m };
}

export const solvingQuadraticEquationsWithComplexRoots: TopicDef = {
  id: "solving-quadratic-equations-with-complex-roots",
  title: t("Solving Quadratic Equations With Complex Roots", "解有复数根的一元二次方程"),
  summary: t(
    "Solve quadratic equations whose discriminant is negative, finding a pair of complex conjugate solutions.",
    "解判别式为负的一元二次方程，求出一对共轭复数解。",
  ),
  prerequisites: ["the-discriminant-of-a-quadratic-equation", "complex-numbers", "quadratic-equations-with-purely-imaginary-solutions"],
  encompasses: [
    { topic: "quadratic-equations-with-purely-imaginary-solutions", weight: 0.4 },
    { topic: "complex-numbers", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSN.CN.C.7", "CCSS.HSA.REI.B.4.B"],
  intro: t(
    `The equation $x^{2} + 2x + 5 = 0$ has discriminant $2^{2} - 4 \\cdot 5 = -16$, so it has no real solutions: its parabola stays above the $x$-axis. With complex numbers the quadratic formula still works:

$$x = \\frac{-2 \\pm \\sqrt{-16}}{2} = \\frac{-2 \\pm 4i}{2} = -1 \\pm 2i$$

Check: $(-1 + 2i)^{2} + 2(-1 + 2i) + 5 = (-3 - 4i) + (-2 + 4i) + 5 = 0$.

In this lesson we solve quadratic equations with negative discriminants, by square roots and by the formula, and use the fact that their solutions come in conjugate pairs.`,
    `方程 $x^{2} + 2x + 5 = 0$ 的判别式为 $2^{2} - 4 \\cdot 5 = -16$，所以没有实数解：它的抛物线始终在 $x$ 轴上方。有了复数，求根公式仍然适用：

$$x = \\frac{-2 \\pm \\sqrt{-16}}{2} = \\frac{-2 \\pm 4i}{2} = -1 \\pm 2i$$

检验：$(-1 + 2i)^{2} + 2(-1 + 2i) + 5 = (-3 - 4i) + (-2 + 4i) + 5 = 0$。

这节课我们用开平方法和求根公式解判别式为负的一元二次方程，并利用它们的解成对共轭这一事实。`,
  ),
  knowledgePoints: [
    {
      id: "square-root-method",
      title: t("Using square roots", "用开平方法"),
      explanation: t(
        `An equation $(x - h)^{2} = -k$ with $k > 0$ is solved as before: isolate the square, take square roots with $\\pm$, then add $h$. The only difference is that the square roots of $-k$ are imaginary, so the solutions are complex.

For $2(x + 1)^{2} + 50 = 0$:

$$2(x + 1)^{2} = -50 \\quad\\Rightarrow\\quad (x + 1)^{2} = -25 \\quad\\Rightarrow\\quad x + 1 = \\pm 5i$$

so $x = -1 \\pm 5i$. The two solutions are **complex conjugates**; enter the one whose imaginary part is positive, $-1 + 5i$. Check: $x + 1 = 5i$, and $2(5i)^{2} + 50 = -50 + 50 = 0$.

> **Watch out.** Divide by the coefficient before taking roots. $x + 1 = \\pm 5i$ gives $x = -1 \\pm 5i$, not $1 \\pm 5i$: undo the $+1$ by subtracting. Keep the $i$: $-1 + 5$ is not a solution.`,
        `方程 $(x - h)^{2} = -k$（$k > 0$）的解法与以前相同：分离出平方项，开平方加 $\\pm$，再加上 $h$。唯一的不同是 $-k$ 的平方根是虚数，所以解是复数。

对 $2(x + 1)^{2} + 50 = 0$：

$$2(x + 1)^{2} = -50 \\quad\\Rightarrow\\quad (x + 1)^{2} = -25 \\quad\\Rightarrow\\quad x + 1 = \\pm 5i$$

所以 $x = -1 \\pm 5i$。两个解互为**共轭复数**；输入虚部为正的那个：$-1 + 5i$。检验：$x + 1 = 5i$，而 $2(5i)^{2} + 50 = -50 + 50 = 0$。

> **注意。** 开平方之前先除以系数。由 $x + 1 = \\pm 5i$ 得 $x = -1 \\pm 5i$，不是 $1 \\pm 5i$：要减去 $1$ 来抵消 $+1$。保留 $i$：$-1 + 5$ 不是解。`,
      ),
      generate(rng) {
        const { h, k, c, m } = complexRoots(rng);
        const a = rng.pick([1, 1, 2, 3]);
        const sq = `${front(a)}${fac(h)}^{2}`;
        const eq = rng.bool() ? `${sq} + ${a * k} = 0` : `${sq} = -${a * k}`;
        const answer = cxr(h, c, m);
        return expressionProblem({
          prompt: t(`Solve $${eq}$. ${positiveImaginary.en}`, `解方程 $${eq}$。${positiveImaginary["zh-CN"]}`),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [cxr(-h, c, m), cxr(h, -c, m), cxr(h, a * c, m), m === 1 ? String(h + c) : cxr(h, 1, k)],
          solution: walked(
            [
              [
                ["Isolate the square", "分离平方项"],
                eq.endsWith("= 0")
                  ? t(
                      `Subtract $${a * k}$ from both sides${a === 1 ? "" : `, then divide by $${a}$`}:`,
                      `两边减去 $${a * k}$${a === 1 ? "" : `，再除以 $${a}$`}：`,
                    )
                  : a === 1
                    ? t("The square is already alone on one side:", "平方项已经单独在一边：")
                    : t(`Divide both sides by $${a}$:`, `两边除以 $${a}$：`),
                [`${fac(h)}^{2} = -${k}`],
              ],
              [
                ["Take square roots", "开平方"],
                t("The square roots of a negative number are imaginary:", "负数的平方根是虚数："),
                [`${linear(1, -h)} = \\pm ${imag(c, m)}`, `x = ${h} \\pm ${imag(c, m)}`],
              ],
              chooseStep(answer),
            ],
            t(
              `With $x = ${answer}$, $${linear(1, -h)} = ${imag(c, m)}$, and $${imagSquare(c, m)}$${a === 1 ? "" : `; times $${a}$ this is $${-a * k}$`}, as the equation requires.`,
              `当 $x = ${answer}$ 时，$${linear(1, -h)} = ${imag(c, m)}$，而 $${imagSquare(c, m)}$${a === 1 ? "" : `；乘以 $${a}$ 得 $${-a * k}$`}，与方程相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "quadratic-formula",
      title: t("Using the quadratic formula", "用求根公式"),
      explanation: t(
        `The quadratic formula $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$ was derived by completing the square, and nothing in that derivation needs the discriminant to be positive. When $b^{2} - 4ac < 0$, its square root is imaginary and the formula gives two complex solutions.

For $x^{2} + 6x + 13 = 0$: $b^{2} - 4ac = 36 - 52 = -16$, and $\\sqrt{-16} = 4i$, so

$$x = \\frac{-6 \\pm 4i}{2} = -3 \\pm 2i.$$

Check: the solutions add to $-6 = -b$ and multiply to $(-3)^{2} + 2^{2} = 13 = c$.

> **Watch out.** Divide **both** terms of the numerator by the denominator: $\\frac{-6 \\pm 4i}{2}$ is $-3 \\pm 2i$, not $-6 \\pm 2i$. The formula starts with $-b$, so the sign of $b$ flips. Simplify the root of the negative discriminant.`,
        `求根公式 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$ 是通过配方推出的，推导过程中并不需要判别式为正。当 $b^{2} - 4ac < 0$ 时，它的平方根是虚数，公式给出两个复数解。

对 $x^{2} + 6x + 13 = 0$：$b^{2} - 4ac = 36 - 52 = -16$，$\\sqrt{-16} = 4i$，所以

$$x = \\frac{-6 \\pm 4i}{2} = -3 \\pm 2i$$

检验：两解之和为 $-6 = -b$，之积为 $(-3)^{2} + 2^{2} = 13 = c$。

> **注意。** 分子的**两项**都要除以分母：$\\frac{-6 \\pm 4i}{2}$ 等于 $-3 \\pm 2i$，不是 $-6 \\pm 2i$。公式以 $-b$ 开头，所以 $b$ 要变号。负判别式的平方根要化简。`,
      ),
      keyPrerequisites: ["the-quadratic-formula"],
      generate(rng) {
        const { h, k, c, m } = complexRoots(rng);
        const b = -2 * h;
        const cc = h * h + k;
        const eq = `${poly([1, "x^{2}"], [b, "x"], [cc, ""])} = 0`;
        const disc = b * b - 4 * cc;
        const answer = cxr(h, c, m);
        const [c2, m2] = sqrtParts(-disc);
        return expressionProblem({
          prompt: t(`Solve $${eq}$. ${positiveImaginary.en}`, `解方程 $${eq}$。${positiveImaginary["zh-CN"]}`),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [cxr(-h, c, m), cxr(h, 2 * c, m), cxr(2 * h, c2, m2)],
          solution: walked(
            [
              [
                ["Find the discriminant", "求判别式"],
                t(`Here $a = 1$, $b = ${b}$ and $c = ${cc}$:`, `这里 $a = 1$，$b = ${b}$，$c = ${cc}$：`),
                [`b^{2} - 4ac = ${b * b} - ${4 * cc} = ${disc}`],
              ],
              [
                ["Apply the formula", "代入公式"],
                t(
                  `The discriminant is negative, so its square root is imaginary, $\\sqrt{${disc}} = ${imag(c2, m2)}$; divide both terms by $2$:`,
                  `判别式为负，它的平方根是虚数，$\\sqrt{${disc}} = ${imag(c2, m2)}$；两项都除以 $2$：`,
                ),
                [`x = \\frac{${-b} \\pm \\sqrt{${disc}}}{2} = \\frac{${-b} \\pm ${imag(c2, m2)}}{2} = ${h} \\pm ${imag(c, m)}`],
              ],
              chooseStep(answer),
            ],
            t(
              `The solutions $${h} \\pm ${imag(c, m)}$ add to $${2 * h} = -(${b})$ and multiply to $${paren(h)}^{2} + ${k} = ${cc}$, the constant term, as they must for $x^{2} + bx + c$.`,
              `两个解 $${h} \\pm ${imag(c, m)}$ 之和为 $${2 * h} = -(${b})$，之积为 $${paren(h)}^{2} + ${k} = ${cc}$，正是常数项，与 $x^{2} + bx + c$ 的要求相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      title: t("Equations with a leading coefficient", "二次项系数不为 1 的方程"),
      explanation: t(
        `With a leading coefficient $a \\ne 1$, the formula divides by $2a$, not by $2$; the discriminant is $b^{2} - 4ac$ with the actual $a$. Alternatively, divide the whole equation by $a$ first: that does not change its solutions.

For $3x^{2} + 12x + 15 = 0$: $b^{2} - 4ac = 144 - 180 = -36$, so

$$x = \\frac{-12 \\pm 6i}{6} = -2 \\pm i.$$

Dividing by $3$ first gives $x^{2} + 4x + 5 = 0$, with the same solutions. Check: they add to $-4 = -\\frac{12}{3}$ and multiply to $(-2)^{2} + 1^{2} = 5 = \\frac{15}{3}$.

> **Watch out.** The denominator is $2a = 6$, not $2$. Use $4ac = 4 \\cdot 3 \\cdot 15$, including $a$. Divide both terms of the numerator.`,
        `二次项系数 $a \\ne 1$ 时，公式要除以 $2a$，不是 $2$；判别式 $b^{2} - 4ac$ 也要用真实的 $a$。也可以先把整个方程除以 $a$：这不改变它的解。

对 $3x^{2} + 12x + 15 = 0$：$b^{2} - 4ac = 144 - 180 = -36$，所以

$$x = \\frac{-12 \\pm 6i}{6} = -2 \\pm i$$

先除以 $3$ 得 $x^{2} + 4x + 5 = 0$，解相同。检验：两解之和为 $-4 = -\\frac{12}{3}$，之积为 $(-2)^{2} + 1^{2} = 5 = \\frac{15}{3}$。

> **注意。** 分母是 $2a = 6$，不是 $2$。$4ac = 4 \\cdot 3 \\cdot 15$，要包括 $a$。分子的两项都要除。`,
      ),
      generate(rng) {
        const { h, k, c, m } = complexRoots(rng);
        const a = rng.int(2, 4);
        const b = -2 * a * h;
        const cc = a * (h * h + k);
        const eq = `${poly([a, "x^{2}"], [b, "x"], [cc, ""])} = 0`;
        const disc = b * b - 4 * a * cc;
        const [c2, m2] = sqrtParts(-disc);
        const answer = cxr(h, c, m);
        return expressionProblem({
          prompt: t(`Solve $${eq}$. ${positiveImaginary.en}`, `解方程 $${eq}$。${positiveImaginary["zh-CN"]}`),
          answer,
          radical: true,
          prefix: "x =",
          wrong: [cxr(-h, c, m), cxr(a * h, c, m), cxr(h, a * c, m), cxr(2 * a * h, c2, m2)],
          solution: walked(
            [
              [
                ["Find the discriminant", "求判别式"],
                t(`Here $a = ${a}$, $b = ${b}$ and $c = ${cc}$:`, `这里 $a = ${a}$，$b = ${b}$，$c = ${cc}$：`),
                [`b^{2} - 4ac = ${b * b} - ${4 * a * cc} = ${disc}`],
              ],
              [
                ["Apply the formula", "代入公式"],
                t(
                  `The square root of the discriminant is $${imag(c2, m2)}$; divide both terms of the numerator by $2a = ${2 * a}$:`,
                  `判别式的平方根是 $${imag(c2, m2)}$；分子的两项都除以 $2a = ${2 * a}$：`,
                ),
                [
                  `x = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}} = \\frac{${-b} \\pm ${imag(c2, m2)}}{${2 * a}} = ${h} \\pm ${imag(c, m)}`,
                ],
              ],
              chooseStep(answer),
            ],
            t(
              `The solutions add to $${2 * h} = -\\frac{${b}}{${a}}$ and multiply to $${paren(h)}^{2} + ${k} = ${h * h + k} = \\frac{${cc}}{${a}}$, as they must.`,
              `两个解之和为 $${2 * h} = -\\frac{${b}}{${a}}$，之积为 $${paren(h)}^{2} + ${k} = ${h * h + k} = \\frac{${cc}}{${a}}$，与要求相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "conjugate-pairs",
      title: t("Conjugate pairs of solutions", "成对的共轭复数解"),
      explanation: t(
        `When a quadratic equation with **real** coefficients has a nonreal solution $p + qi$, its other solution is the conjugate $p - qi$: the formula gives $\\frac{-b}{2a} \\pm \\frac{\\sqrt{b^{2} - 4ac}}{2a}$, and the $\\pm$ changes only the sign of the imaginary part. Multiplying the two factors,

$$(x - (p + qi))(x - (p - qi)) = x^{2} - 2px + (p^{2} + q^{2}),$$

so $b = -2p$ and $c = p^{2} + q^{2}$. For the solution $-1 + 4i$: the other is $-1 - 4i$, $b = 2$ and $c = 1 + 16 = 17$. Check: $(-1 + 4i)^{2} + 2(-1 + 4i) + 17 = (-15 - 8i) + (-2 + 8i) + 17 = 0$.

> **Watch out.** The conjugate keeps the real part and changes only the sign of the imaginary part: $-1 + 4i$ pairs with $-1 - 4i$, not $1 - 4i$ or $1 + 4i$. $b$ is minus the sum, $-2p$, and $c$ is $p^{2} + q^{2}$, not $p^{2} - q^{2}$.`,
        `当**实系数**一元二次方程有一个非实数解 $p + qi$ 时，另一个解就是它的共轭复数 $p - qi$：公式给出 $\\frac{-b}{2a} \\pm \\frac{\\sqrt{b^{2} - 4ac}}{2a}$，$\\pm$ 只改变虚部的符号。把两个因式相乘，

$$(x - (p + qi))(x - (p - qi)) = x^{2} - 2px + (p^{2} + q^{2})$$

所以 $b = -2p$，$c = p^{2} + q^{2}$。若一个解是 $-1 + 4i$，则另一个是 $-1 - 4i$，$b = 2$，$c = 1 + 16 = 17$。检验：$(-1 + 4i)^{2} + 2(-1 + 4i) + 17 = (-15 - 8i) + (-2 + 8i) + 17 = 0$。

> **注意。** 共轭复数保留实部，只改变虚部的符号：$-1 + 4i$ 与 $-1 - 4i$ 成对，不是 $1 - 4i$ 或 $1 + 4i$。$b$ 是两解之和的相反数 $-2p$；$c$ 是 $p^{2} + q^{2}$，不是 $p^{2} - q^{2}$。`,
      ),
      generate(rng) {
        const p = rng.nonZero(-7, 7);
        const q = rng.nonZero(-7, 7);
        const z = cx(p, q);
        if (rng.bool(0.4)) {
          return expressionProblem({
            prompt: t(
              `One solution of a quadratic equation with real coefficients is $${z}$. What is the other solution?`,
              `一个实系数一元二次方程的一个解是 $${z}$。另一个解是什么？`,
            ),
            answer: cx(p, -q),
            simplified: true,
            prefix: "x =",
            wrong: [cx(-p, q), cx(-p, -q), z],
            solution: walked(
              [
                [
                  ["Use the conjugate pair", "利用共轭成对"],
                  t(
                    "The coefficients are real, so the $\\pm$ in the quadratic formula gives a pair of conjugates: the real part stays and the imaginary part changes sign.",
                    "系数是实数，所以求根公式中的 $\\pm$ 给出一对共轭复数：实部不变，虚部变号。",
                  ),
                ],
                [
                  ["Write the other solution", "写出另一个解"],
                  t(`The conjugate of $${z}$ is $${cx(p, -q)}$.`, `$${z}$ 的共轭复数是 $${cx(p, -q)}$。`),
                ],
              ],
              t(
                `The sum $(${z}) + (${cx(p, -q)}) = ${2 * p}$ and the product $${paren(p)}^{2} + ${paren(q)}^{2} = ${p * p + q * q}$ are both real, as they must be for an equation with real coefficients.`,
                `两解之和 $(${z}) + (${cx(p, -q)}) = ${2 * p}$ 与之积 $${paren(p)}^{2} + ${paren(q)}^{2} = ${p * p + q * q}$ 都是实数，实系数方程正应如此。`,
              ),
            ),
          });
        }
        return pointProblem({
          prompt: t(
            `The equation $x^{2} + bx + c = 0$, where $b$ and $c$ are real, has the solution $x = ${z}$. Find $b$ and $c$, as the ordered pair $(b, c)$.`,
            `方程 $x^{2} + bx + c = 0$（$b$、$c$ 为实数）有一个解 $x = ${z}$。求 $b$ 和 $c$，写成有序数对 $(b, c)$。`,
          ),
          answer: [-2 * p, p * p + q * q],
          vars: ["b", "c"],
          wrong: [
            [2 * p, p * p + q * q],
            [-2 * p, p * p - q * q],
            [-p, p * p + q * q],
          ],
          solution: walked(
            [
              [
                ["Find the other solution", "求另一个解"],
                t(
                  `The coefficients are real, so the other solution is the conjugate $${cx(p, -q)}$.`,
                  `系数是实数，所以另一个解是共轭复数 $${cx(p, -q)}$。`,
                ),
              ],
              [
                ["Multiply the factors", "因式相乘"],
                t(
                  `The solutions add to $${2 * p}$ and multiply to $${paren(p)}^{2} + ${paren(q)}^{2} = ${p * p + q * q}$, so`,
                  `两解之和为 $${2 * p}$，之积为 $${paren(p)}^{2} + ${paren(q)}^{2} = ${p * p + q * q}$，所以`,
                ),
                [`(x - (${z}))(x - (${cx(p, -q)})) = ${poly([1, "x^{2}"], [-2 * p, "x"], [p * p + q * q, ""])}`],
              ],
              [
                ["Read off $b$ and $c$", "读出 $b$ 和 $c$"],
                t(`So $(b, c) = (${-2 * p}, ${p * p + q * q})$.`, `所以 $(b, c) = (${-2 * p}, ${p * p + q * q})$。`),
              ],
            ],
            t(
              `$(${z})^{2} = ${cx(p * p - q * q, 2 * p * q)}$ and $${-2 * p}(${z}) = ${cx(-2 * p * p, -2 * p * q)}$; adding these and $${p * p + q * q}$ gives $0$.`,
              `$(${z})^{2} = ${cx(p * p - q * q, 2 * p * q)}$，$${-2 * p}(${z}) = ${cx(-2 * p * p, -2 * p * q)}$；把它们与 $${p * p + q * q}$ 相加得 $0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** iPower is i raised to n, for any integer n, in LaTeX. */
const iPower = (n: number) => ["1", "i", "-1", "-i"][((n % 4) + 4) % 4]!;

/** iPowerParts is i to the n as [real part, imaginary part]. */
function iPowerParts(n: number): [number, number] {
  const table: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  return table[((n % 4) + 4) % 4]!;
}

const iValues = ["1", "i", "-1", "-i"];

/** iCheck reaches i to a positive power n another way, through powers of i² = −1. */
function iCheck(n: number): Text {
  const work =
    n % 2 === 0
      ? `i^{${n}} = (i^{2})^{${n / 2}} = (-1)^{${n / 2}} = ${iPower(n)}`
      : `i^{${n}} = i \\cdot (i^{2})^{${(n - 1) / 2}} = i \\cdot (-1)^{${(n - 1) / 2}} = ${iPower(n)}`;
  return t(`Through $i^{2} = -1$ instead: $${work}$.`, `改用 $i^{2} = -1$ 计算：$${work}$。`);
}

export const cyclicPropertyOfTheImaginaryUnit: TopicDef = {
  id: "cyclic-property-of-the-imaginary-unit",
  title: t("The Cyclic Property of the Imaginary Unit", "虚数单位的周期性"),
  summary: t(
    "Simplify powers of $i$ using the cycle $i, -1, -i, 1$ that repeats every four powers.",
    "利用每四次重复一次的循环 $i, -1, -i, 1$ 化简 $i$ 的乘方。",
  ),
  prerequisites: ["imaginary-numbers", "power-rules"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSN.CN.A.2"],
  intro: t(
    `Multiply by $i$ again and again and watch what happens:

$$i^{1} = i, \\quad i^{2} = -1, \\quad i^{3} = -i, \\quad i^{4} = 1, \\quad i^{5} = i, \\quad i^{6} = -1, \\ldots$$

Each step multiplies the previous value by $i$, and once $i^{4} = 1$ the values start over. So $i^{6} = i^{4} \\cdot i^{2} = -1$. Check: $i^{6} = (i^{2})^{3} = (-1)^{3} = -1$.

In this lesson we use this cycle of four to simplify powers of $i$, products and quotients of powers, and expressions with several powers.`,
    `不断地乘以 $i$，看看会发生什么：

$$i^{1} = i, \\quad i^{2} = -1, \\quad i^{3} = -i, \\quad i^{4} = 1, \\quad i^{5} = i, \\quad i^{6} = -1, \\ldots$$

每一步都把前一个值乘以 $i$，一旦 $i^{4} = 1$，值就重新开始。所以 $i^{6} = i^{4} \\cdot i^{2} = -1$。检验：$i^{6} = (i^{2})^{3} = (-1)^{3} = -1$。

这节课我们利用这个以四为周期的循环，化简 $i$ 的乘方、乘方的积与商，以及含多个乘方的式子。`,
  ),
  knowledgePoints: [
    {
      id: "powers-of-i",
      title: t("Powers of $i$", "$i$ 的乘方"),
      explanation: t(
        `The powers of $i$ repeat in a cycle of four, because each power is the previous one times $i$:

$$i^{1} = i, \\quad i^{2} = -1, \\quad i^{3} = i^{2} \\cdot i = -i, \\quad i^{4} = (i^{2})^{2} = 1$$

Since $i^{4} = 1$, any multiple of four in the exponent contributes only a factor $1$: divide the exponent by $4$ and keep the **remainder**, $i^{4q + r} = (i^{4})^{q} \\cdot i^{r} = i^{r}$. For $i^{58}$: $58 = 4 \\cdot 14 + 2$, so $i^{58} = i^{2} = -1$. Check: $i^{58} = (i^{2})^{29} = (-1)^{29} = -1$.

> **Watch out.** Use the remainder, not the quotient: $i^{58}$ is $i^{2}$, not $i^{14}$. A remainder of $0$ gives $i^{0} = 1$, not $0$. The cycle is $i, -1, -i, 1$: do not mix up $i^{2}$ and $i^{3}$.`,
        `$i$ 的乘方以四为周期循环，因为每个乘方都是前一个乘以 $i$：

$$i^{1} = i, \\quad i^{2} = -1, \\quad i^{3} = i^{2} \\cdot i = -i, \\quad i^{4} = (i^{2})^{2} = 1$$

因为 $i^{4} = 1$，指数中四的倍数只贡献因数 $1$：把指数除以 $4$，保留**余数**，$i^{4q + r} = (i^{4})^{q} \\cdot i^{r} = i^{r}$。对 $i^{58}$：$58 = 4 \\cdot 14 + 2$，所以 $i^{58} = i^{2} = -1$。检验：$i^{58} = (i^{2})^{29} = (-1)^{29} = -1$。

> **注意。** 用余数，不是商：$i^{58}$ 等于 $i^{2}$，不是 $i^{14}$。余数为 $0$ 时得 $i^{0} = 1$，不是 $0$。循环是 $i, -1, -i, 1$：不要把 $i^{2}$ 和 $i^{3}$ 弄混。`,
      ),
      generate(rng) {
        const n = rng.int(5, 150);
        const r = n % 4;
        const answer = iPower(n);
        return expressionProblem({
          prompt: t(`Simplify $i^{${n}}$.`, `化简 $i^{${n}}$。`),
          answer,
          simplified: true,
          wrong: iValues.filter((v) => v !== answer),
          solution: walked(
            [
              [
                ["Divide the exponent by $4$", "指数除以 $4$"],
                t(`$${n} = 4 \\cdot ${(n - r) / 4} + ${r}$.`, `$${n} = 4 \\cdot ${(n - r) / 4} + ${r}$。`),
              ],
              [
                ["Use $i^{4} = 1$", "利用 $i^{4} = 1$"],
                t("Only the remainder matters:", "只有余数起作用："),
                [`i^{${n}} = (i^{4})^{${(n - r) / 4}} \\cdot i^{${r}} = 1 \\cdot i^{${r}} = ${answer}`],
              ],
            ],
            iCheck(n),
          ),
        });
      },
    },
    {
      id: "products-quotients-and-powers",
      title: t("Products, quotients and powers", "乘积、商与乘方"),
      explanation: t(
        `The rules of exponents hold for powers of $i$, since they only count factors: $i^{m} \\cdot i^{n} = i^{m + n}$, $\\frac{i^{m}}{i^{n}} = i^{m - n}$ and $(i^{m})^{n} = i^{mn}$. Combine the exponents first, then reduce with the cycle of four.

For $\\frac{i^{41}}{i^{6}}$: $i^{41 - 6} = i^{35}$, and $35 = 4 \\cdot 8 + 3$, so the quotient is $i^{3} = -i$. Negative exponents follow the same cycle: $i^{-1} = \\frac{1}{i} = -i$, since $i \\cdot (-i) = -i^{2} = 1$; in general multiply by a power $i^{4k} = 1$ to make the exponent positive. Check: $i^{35} = i \\cdot (i^{2})^{17} = i \\cdot (-1)^{17} = -i$.

> **Watch out.** Add the exponents of a product and subtract those of a quotient; do not multiply them. For a power of a power, multiply. $i^{-1}$ is $-i$, not $i$ or $-1$.`,
        `指数运算法则对 $i$ 的乘方同样成立，因为它们只是在数因数：$i^{m} \\cdot i^{n} = i^{m + n}$，$\\frac{i^{m}}{i^{n}} = i^{m - n}$，$(i^{m})^{n} = i^{mn}$。先合并指数，再用以四为周期的循环化简。

对 $\\frac{i^{41}}{i^{6}}$：$i^{41 - 6} = i^{35}$，而 $35 = 4 \\cdot 8 + 3$，所以商是 $i^{3} = -i$。负指数遵循同样的循环：$i^{-1} = \\frac{1}{i} = -i$，因为 $i \\cdot (-i) = -i^{2} = 1$；一般地，乘以 $i^{4k} = 1$ 把指数变为正数。检验：$i^{35} = i \\cdot (i^{2})^{17} = i \\cdot (-1)^{17} = -i$。

> **注意。** 积的指数相加，商的指数相减，不要相乘。乘方的乘方才是指数相乘。$i^{-1}$ 等于 $-i$，不是 $i$ 或 $-1$。`,
      ),
      keyPrerequisites: ["power-rules"],
      generate(rng) {
        const kind = rng.int(0, 3);
        let expr: string;
        let e: number;
        let how: string;
        if (kind === 0) {
          const a = rng.int(3, 40);
          const b = rng.int(3, 40);
          e = a + b;
          expr = `i^{${a}} \\cdot i^{${b}}`;
          how = `i^{${a} + ${b}} = i^{${e}}`;
        } else if (kind === 1) {
          const b = rng.int(2, 30);
          const a = b + rng.int(3, 40);
          e = a - b;
          expr = `\\frac{i^{${a}}}{i^{${b}}}`;
          how = `i^{${a} - ${b}} = i^{${e}}`;
        } else if (kind === 2) {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          e = a * b;
          expr = `(i^{${a}})^{${b}}`;
          how = `i^{${a} \\cdot ${b}} = i^{${e}}`;
        } else {
          const n = rng.int(1, 30);
          e = -n;
          const up = 4 * Math.ceil((n + 1) / 4);
          expr = `i^{-${n}}`;
          how = `i^{-${n}} \\cdot i^{${up}} = i^{${up - n}}`;
        }
        const pos = e < 0 ? e + 4 * Math.ceil((1 - e) / 4) : e;
        const rem = pos % 4;
        const answer = iPower(e);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: iValues.filter((v) => v !== answer),
          solution: walked(
            [
              [
                ["Combine the exponents", "合并指数"],
                e < 0
                  ? t("Multiply by a power of $i^{4} = 1$ to make the exponent positive:", "乘以 $i^{4} = 1$ 的乘方，把指数变为正数：")
                  : t("Use the rules of exponents:", "利用指数运算法则："),
                [`${expr} = ${how}`],
              ],
              [
                ["Reduce", "化简"],
                t(
                  `$${pos} = 4 \\cdot ${(pos - rem) / 4} + ${rem}$, and $i^{4} = 1$:`,
                  `$${pos} = 4 \\cdot ${(pos - rem) / 4} + ${rem}$，而 $i^{4} = 1$：`,
                ),
                [`i^{${pos}} = (i^{4})^{${(pos - rem) / 4}} \\cdot i^{${rem}} = ${answer}`],
              ],
            ],
            iCheck(pos),
          ),
        });
      },
    },
    {
      id: "expressions-with-powers-of-i",
      title: t("Expressions with several powers", "含多个乘方的式子"),
      explanation: t(
        `Each power of $i$ is one of $1$, $i$, $-1$, $-i$, so an expression with several powers is just a complex number in disguise. Reduce each power with the cycle of four, then combine the real and the imaginary terms.

$$2i^{9} - 4i^{18} + i^{31} = 2(i) - 4(-1) + (-i) = 4 + i$$

since $9 = 4 \\cdot 2 + 1$, $18 = 4 \\cdot 4 + 2$ and $31 = 4 \\cdot 7 + 3$. Check: the only even exponent, $18$, gives the real part $-4 \\cdot (-1) = 4$, and the odd ones give $2 - 1 = 1$ times $i$.

> **Watch out.** Reduce each power separately before combining; do not add the exponents of a sum. Keep the coefficient's sign with its power: $-4i^{18}$ is $-4(-1) = 4$. Even powers are real and odd powers are imaginary.`,
        `$i$ 的每个乘方都是 $1$、$i$、$-1$、$-i$ 之一，所以含多个乘方的式子其实就是一个复数。用以四为周期的循环化简每个乘方，再合并实数项和虚数项。

$$2i^{9} - 4i^{18} + i^{31} = 2(i) - 4(-1) + (-i) = 4 + i$$

因为 $9 = 4 \\cdot 2 + 1$，$18 = 4 \\cdot 4 + 2$，$31 = 4 \\cdot 7 + 3$。检验：唯一的偶数指数 $18$ 给出实部 $-4 \\cdot (-1) = 4$，奇数指数给出 $2 - 1 = 1$ 个 $i$。

> **注意。** 合并之前分别化简每个乘方；和的指数不能相加。系数的符号跟着它的乘方：$-4i^{18}$ 等于 $-4(-1) = 4$。偶数次乘方是实数，奇数次乘方是虚数。`,
      ),
      generate(rng) {
        const ns = distinctInts(rng, 3, 5, 60);
        const cs = ns.map(() => rng.nonZero(-6, 6));
        const expr = poly(...ns.map((n, j) => [cs[j]!, `i^{${n}}`] as const));
        let re = 0;
        let im = 0;
        ns.forEach((n, j) => {
          const [r, s] = iPowerParts(n);
          re += cs[j]! * r;
          im += cs[j]! * s;
        });
        const answer = cx(re, im);
        const values = ns.map((n, j) => `${cs[j]! < 0 ? "-" : j === 0 ? "" : "+"} ${Math.abs(cs[j]!)}(${iPower(n)})`).join(" ");
        let wrongIm = 0;
        let wrongRe = 0;
        ns.forEach((n, j) => {
          const [r, s] = iPowerParts(n + 2);
          wrongRe += cs[j]! * r;
          wrongIm += cs[j]! * s;
        });
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(re, -im), cx(-re, im), cx(wrongRe, wrongIm)],
          solution: walked(
            [
              [
                ["Reduce each power", "化简每个乘方"],
                t(
                  `Divide each exponent by $4$: ${ns.map((n) => `$${n} = 4 \\cdot ${Math.floor(n / 4)} + ${n % 4}$, so $i^{${n}} = ${iPower(n)}$`).join("; ")}.`,
                  `把每个指数除以 $4$：${ns.map((n) => `$${n} = 4 \\cdot ${Math.floor(n / 4)} + ${n % 4}$，所以 $i^{${n}} = ${iPower(n)}$`).join("；")}。`,
                ),
              ],
              [
                ["Substitute and combine", "代入并合并"],
                t("Replace each power and collect the real and the imaginary terms:", "代入每个乘方的值，合并实数项和虚数项："),
                [`${expr} = ${values} = ${answer}`],
              ],
            ],
            t(
              `Only the even exponents give real values, contributing $${re}$ in all, and the odd exponents contribute $${im}$ times $i$, so the answer is $${answer}$.`,
              `只有偶数指数给出实数，共 $${re}$；奇数指数共给出 $${im}$ 个 $i$，所以答案是 $${answer}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// TAIL
/** algebraIIPolynomialTopics are the topics of Algebra II on number systems and polynomials, in teaching order. */
export const algebraIIPolynomialTopics: readonly TopicDef[] = [
  theRealNumberSystem,
  writingRepeatingDecimalsAsFractions,
  sumsAndProductsOfRationalAndIrrationalNumbers,
  imaginaryNumbers,
  quadraticEquationsWithPurelyImaginarySolutions,
  complexNumbers,
  addingAndSubtractingComplexNumbers,
  multiplyingComplexNumbers,
  solvingQuadraticEquationsWithComplexRoots,
  cyclicPropertyOfTheImaginaryUnit,
];
