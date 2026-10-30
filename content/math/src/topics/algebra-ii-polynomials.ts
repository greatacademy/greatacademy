import type { Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, linear, num, paren, poly, Q, simplifyRadical } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, pointProblem, steps, yesNo } from "../problems.ts";

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
  knowledgePoints: [
    {
      id: "nested-sets",
      title: t("Natural numbers, whole numbers and integers", "正整数、非负整数与整数"),
      explanation: t(
        "The numbers we use sit in sets inside one another:\n\n- the **natural numbers** $1, 2, 3, \\ldots$;\n- the **whole numbers** $0, 1, 2, 3, \\ldots$: the natural numbers and $0$;\n- the **integers** $\\ldots, -2, -1, 0, 1, 2, \\ldots$;\n- the **rational numbers**: every quotient $\\frac{p}{q}$ of integers with $q \\ne 0$, such as $\\frac{3}{4}$, $-2.5 = -\\frac{5}{2}$ and $7 = \\frac{7}{1}$.\n\nEach set contains the ones before it. To classify a number, first **simplify** it: $\\sqrt{49} = 7$ is a natural number and $-\\frac{12}{3} = -4$ is an integer, although neither looks like one. The smallest set containing $-4$ is the integers.",
        "我们使用的数组成一层套一层的集合：\n\n- **正整数**（自然数）$1, 2, 3, \\ldots$；\n- **非负整数** $0, 1, 2, 3, \\ldots$：正整数和 $0$；\n- **整数** $\\ldots, -2, -1, 0, 1, 2, \\ldots$；\n- **有理数**：所有整数之商 $\\frac{p}{q}$（$q \\ne 0$），例如 $\\frac{3}{4}$、$-2.5 = -\\frac{5}{2}$ 和 $7 = \\frac{7}{1}$。\n\n每个集合都包含前面的集合。分类之前先**化简**：$\\sqrt{49} = 7$ 是正整数，$-\\frac{12}{3} = -4$ 是整数，尽管它们看起来不像。包含 $-4$ 的最小集合是整数集。",
      ),
      keyPrerequisites: ["fractions-and-decimals"],
      generate(rng) {
        const c = classified(rng, rng.pick([0, 1, 2, 3, 0, 2, 3] as const));
        return choiceProblem({
          prompt: t(`What is the smallest of these sets that contains $${c.tex}$?`, `下列集合中，包含 $${c.tex}$ 的最小集合是哪一个？`),
          options: setNames.slice(0, 4),
          correct: c.kind,
          solution: t(
            `${c.why.en} So the smallest set is the ${setNames[c.kind]!.en.toLowerCase()}.`,
            `${c.why["zh-CN"]}所以最小的集合是${setNames[c.kind]!["zh-CN"]}集。`,
          ),
        });
      },
    },
    {
      id: "rational-or-irrational",
      title: t("Rational and irrational numbers", "有理数与无理数"),
      explanation: t(
        "A real number that is not rational is **irrational**: it cannot be written as a quotient of integers. Its decimal expansion never ends and never repeats. Examples are $\\sqrt{n}$ when $n$ is a positive integer that is not a perfect square, $\\sqrt[3]{n}$ when $n$ is not a perfect cube, and $\\pi$.\n\nEvery decimal that terminates ($0.75 = \\frac{3}{4}$) or repeats ($0.\\overline{3} = \\frac{1}{3}$) is rational. Together the rational and the irrational numbers form the **real numbers**.\n\nSimplify before deciding: $\\sqrt{\\frac{4}{9}} = \\frac{2}{3}$ is rational, but $\\sqrt{8} = 2\\sqrt{2}$ is irrational.",
        "不是有理数的实数叫做**无理数**：它不能写成整数之商，小数展开既不终止也不循环。例如：$n$ 是不是完全平方数的正整数时的 $\\sqrt{n}$，$n$ 不是完全立方数时的 $\\sqrt[3]{n}$，以及 $\\pi$。\n\n有限小数（$0.75 = \\frac{3}{4}$）和循环小数（$0.\\overline{3} = \\frac{1}{3}$）都是有理数。有理数和无理数合起来组成**实数**。\n\n判断之前先化简：$\\sqrt{\\frac{4}{9}} = \\frac{2}{3}$ 是有理数，而 $\\sqrt{8} = 2\\sqrt{2}$ 是无理数。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const c = classified(rng, rng.pick([0, 2, 3, 3, 4, 4, 4] as const));
        const rational = c.kind < 4;
        return choiceProblem({
          prompt: t(`Is $${c.tex}$ a rational number?`, `$${c.tex}$ 是有理数吗？`),
          options: yesNo,
          correct: rational ? 0 : 1,
          solution: t(
            `${c.why.en} So it is ${rational ? "rational" : "irrational"}.`,
            `${c.why["zh-CN"]}所以它是${rational ? "有理数" : "无理数"}。`,
          ),
        });
      },
    },
    {
      id: "the-odd-one-out",
      title: t("Finding the irrational number", "找出无理数"),
      explanation: t(
        "To find the irrational numbers in a list, simplify each number: roots of perfect squares and perfect cubes, fractions that reduce to integers, and repeating decimals are all rational. Among\n\n$$\\sqrt{36}, \\quad -\\frac{10}{5}, \\quad 0.\\overline{7}, \\quad \\sqrt{20}$$\n\nthe first three equal $6$, $-2$ and $\\frac{7}{9}$, while $\\sqrt{20} = 2\\sqrt{5}$ is irrational.",
        "要在一组数中找出无理数，先把每个数化简：完全平方数和完全立方数的根、能约成整数的分数、循环小数都是有理数。在\n\n$$\\sqrt{36}, \\quad -\\frac{10}{5}, \\quad 0.\\overline{7}, \\quad \\sqrt{20}$$\n\n中，前三个分别等于 $6$、$-2$ 和 $\\frac{7}{9}$，而 $\\sqrt{20} = 2\\sqrt{5}$ 是无理数。",
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
        return choiceProblem({
          prompt: findIrrational
            ? t(`Which of these numbers is irrational?${listTex(all)}`, `下列哪个数是无理数？${listTex(all)}`)
            : t(`Which of these numbers is rational?${listTex(all)}`, `下列哪个数是有理数？${listTex(all)}`),
          options: all.map((c) => same(`$${c.tex}$`)),
          correct,
          solution: t(
            `${odd.why.en} Each of the other numbers is ${findIrrational ? "rational" : "irrational"}.`,
            `${odd.why["zh-CN"]}其余的数都是${findIrrational ? "有理数" : "无理数"}。`,
          ),
        });
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

/** repeatingSteps writes the subtraction that turns a repeating decimal into a fraction. */
function repeatingSteps(d: Repeating): string {
  const n = d.a.length;
  const v = repeatingValue(d);
  const big = 10 ** (n + d.r.length);
  const small = 10 ** n;
  const intBig = Number(`${d.whole}${d.a}${d.r}`);
  const intSmall = Number(`${d.whole}${d.a}`);
  const top = intBig - intSmall;
  const bottom = big - small;
  return steps(
    `x = ${repeatingTex(d)}`,
    `${big}x = ${intBig}.\\overline{${d.r}}`,
    ...(n > 0 ? [`${small}x = ${intSmall}.\\overline{${d.r}}`] : []),
    `${big}x - ${small === 1 ? "" : small}x = ${intBig} - ${intSmall}`,
    `${bottom}x = ${top}`,
    `x = \\frac{${top}}{${bottom}}${gcd(top, bottom) === 1 ? "" : ` = ${num(v)}`}`,
  );
}

export const writingRepeatingDecimalsAsFractions: TopicDef = {
  id: "writing-repeating-decimals-as-fractions",
  title: t("Writing Repeating Decimals as Fractions", "把循环小数化成分数"),
  summary: t(
    "Write a repeating decimal as a fraction by multiplying by a power of ten and subtracting.",
    "乘以 10 的幂再相减，把循环小数化成分数。",
  ),
  prerequisites: ["the-real-number-system", "one-step-equations-multiplication"],
  encompasses: [{ topic: "fractions-and-decimals", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.8.NS.A.1"],
  knowledgePoints: [
    {
      id: "purely-repeating",
      title: t("Purely repeating decimals", "纯循环小数"),
      explanation: t(
        "A bar marks the digits that repeat: $0.\\overline{36} = 0.363636\\ldots$. To write it as a fraction, call it $x$ and multiply by $10^{m}$, where $m$ is the number of repeating digits. The repeating tails then line up and cancel when you subtract:\n\n$$\\begin{aligned} 100x &= 36.\\overline{36} \\\\ x &= 0.\\overline{36} \\\\ 99x &= 36 \\end{aligned}$$\n\nSo $x = \\frac{36}{99} = \\frac{4}{11}$. Always reduce the fraction to lowest terms.",
        "横线标出循环的数字：$0.\\overline{36} = 0.363636\\ldots$。要化成分数，设它为 $x$，乘以 $10^{m}$，其中 $m$ 是循环节的位数。这样循环部分对齐，相减后抵消：\n\n$$\\begin{aligned} 100x &= 36.\\overline{36} \\\\ x &= 0.\\overline{36} \\\\ 99x &= 36 \\end{aligned}$$\n\n所以 $x = \\frac{36}{99} = \\frac{4}{11}$。结果总要约成最简分数。",
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
          solution: t(
            `Let $x = ${repeatingTex(d)}$ and multiply by $${10 ** m}$, since ${m === 1 ? "one digit repeats" : `${m} digits repeat`}:${repeatingSteps(d)}`,
            `设 $x = ${repeatingTex(d)}$，因为循环节有 ${m} 位，所以乘以 $${10 ** m}$：${repeatingSteps(d)}`,
          ),
        });
      },
    },
    {
      id: "with-a-whole-part",
      title: t("Repeating decimals greater than 1", "大于 1 的循环小数"),
      explanation: t(
        "The same subtraction works when there is a whole-number part:\n\n$$\\begin{aligned} 100x &= 215.\\overline{15} \\\\ x &= 2.\\overline{15} \\\\ 99x &= 213 \\end{aligned}$$\n\nso $x = \\frac{213}{99} = \\frac{71}{33}$. Check: $\\frac{71}{33}$ is a little more than $2$, as it should be.",
        "有整数部分时，同样的减法也适用：\n\n$$\\begin{aligned} 100x &= 215.\\overline{15} \\\\ x &= 2.\\overline{15} \\\\ 99x &= 213 \\end{aligned}$$\n\n所以 $x = \\frac{213}{99} = \\frac{71}{33}$。检验：$\\frac{71}{33}$ 比 $2$ 稍大，符合预期。",
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
          solution: t(
            `Let $x = ${repeatingTex(d)}$ and multiply by $${10 ** m}$:${repeatingSteps(d)}`,
            `设 $x = ${repeatingTex(d)}$，乘以 $${10 ** m}$：${repeatingSteps(d)}`,
          ),
        });
      },
    },
    {
      id: "delayed-repetition",
      title: t("Digits before the repetition", "循环之前有其他数字"),
      explanation: t(
        "When some digits come before the repeating block, as in $0.1\\overline{6} = 0.1666\\ldots$, use two multiples of $x$ whose decimal parts are both just the repeating tail: one that moves the non-repeating digits in front of the point, and one that moves one more full block:\n\n$$\\begin{aligned} 100x &= 16.\\overline{6} \\\\ 10x &= 1.\\overline{6} \\\\ 90x &= 15 \\end{aligned}$$\n\nSo $x = \\frac{15}{90} = \\frac{1}{6}$.",
        "当循环节之前还有其他数字时，例如 $0.1\\overline{6} = 0.1666\\ldots$，取 $x$ 的两个倍数，使它们的小数部分都只剩循环部分：一个把不循环的数字移到小数点前，另一个再多移一个完整的循环节：\n\n$$\\begin{aligned} 100x &= 16.\\overline{6} \\\\ 10x &= 1.\\overline{6} \\\\ 90x &= 15 \\end{aligned}$$\n\n所以 $x = \\frac{15}{90} = \\frac{1}{6}$。",
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
          solution: t(
            `Let $x = ${repeatingTex(d)}$. Multiply by $10$ to move the non-repeating digit in front of the point, and by $${10 ** (m + 1)}$ to move one more block, then subtract:${repeatingSteps(d)}`,
            `设 $x = ${repeatingTex(d)}$。乘以 $10$ 把不循环的数字移到小数点前，乘以 $${10 ** (m + 1)}$ 再多移一个循环节，然后相减：${repeatingSteps(d)}`,
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
      };
    case 1:
      return {
        tex: `${frac}\\sqrt{${n}}`,
        rational: false,
        why: t(
          `$\\sqrt{${n}}$ is irrational, and a nonzero rational number times an irrational number is irrational.`,
          `$\\sqrt{${n}}$ 是无理数，非零有理数乘无理数是无理数。`,
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
      };
    }
    case 3: {
      const a = rng.int(1, 9);
      const b = rng.int(1, 9);
      return {
        tex: `(${a} + \\sqrt{${n}}) + (${b} - \\sqrt{${n}})`,
        rational: true,
        why: t(`The irrational parts cancel: the sum is $${a + b}$, which is rational.`, `无理部分相互抵消：和为 $${a + b}$，是有理数。`),
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
      };
    }
    default: {
      const a = rng.int(2, 9);
      const b = rng.int(2, 9);
      return {
        tex: `\\sqrt{${a * a}} + \\frac{${b}}{${b + 1}}`,
        rational: true,
        why: t(`$\\sqrt{${a * a}} = ${a}$, and a sum of rational numbers is rational.`, `$\\sqrt{${a * a}} = ${a}$，有理数之和是有理数。`),
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
    { topic: "simplifying-square-roots", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.RN.B.3"],
  knowledgePoints: [
    {
      id: "general-rules",
      title: t("The general rules", "一般规律"),
      explanation: t(
        'Sums and products of rational numbers are always rational. With an irrational number:\n\n- rational $+$ irrational is **always irrational**: if $a + b$ were rational, then $b = (a + b) - a$ would be rational too;\n- **nonzero** rational $\\times$ irrational is **always irrational**, for the same reason with division; but $0 \\cdot \\sqrt{2} = 0$, so without "nonzero" it can be either;\n- irrational $+$ irrational and irrational $\\times$ irrational **can be either**: $\\sqrt{2} + (-\\sqrt{2}) = 0$ and $\\sqrt{2} \\cdot \\sqrt{2} = 2$ are rational, while $\\sqrt{2} + \\sqrt{3}$ and $\\sqrt{2} \\cdot \\sqrt{3}$ are irrational.',
        "有理数的和与积一定是有理数。涉及无理数时：\n\n- 有理数 $+$ 无理数**一定是无理数**：如果 $a + b$ 是有理数，那么 $b = (a + b) - a$ 也是有理数，矛盾；\n- **非零**有理数 $\\times$ 无理数**一定是无理数**，理由相同（改用除法）；但 $0 \\cdot \\sqrt{2} = 0$，所以没有“非零”时两种情况都可能；\n- 无理数 $+$ 无理数、无理数 $\\times$ 无理数**两种情况都可能**：$\\sqrt{2} + (-\\sqrt{2}) = 0$ 和 $\\sqrt{2} \\cdot \\sqrt{2} = 2$ 是有理数，而 $\\sqrt{2} + \\sqrt{3}$ 和 $\\sqrt{2} \\cdot \\sqrt{3}$ 是无理数。",
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
        return choiceProblem({
          prompt: t(`Suppose $${A}$ is ${en}. Is $${expr}$ rational or irrational?`, `设 $${A}$ ${zh}。$${expr}$ 是有理数还是无理数？`),
          options: alwaysOptions,
          correct: rule.answer,
          solution: t(why(rule.why.en), why(rule.why["zh-CN"])),
        });
      },
    },
    {
      id: "deciding-for-a-number",
      title: t("Deciding for a given expression", "判断具体的式子"),
      explanation: t(
        "For a specific expression, simplify first, then apply the rules. $\\frac{1}{2} + \\sqrt{3}$ is rational plus irrational, so it is irrational. But $\\sqrt{8} \\cdot \\sqrt{2} = \\sqrt{16} = 4$ is rational, although both factors are irrational, and $\\sqrt{12} - 2\\sqrt{3} = 2\\sqrt{3} - 2\\sqrt{3} = 0$ is rational too.",
        "对于具体的式子，先化简，再用规律判断。$\\frac{1}{2} + \\sqrt{3}$ 是有理数加无理数，所以是无理数。但 $\\sqrt{8} \\cdot \\sqrt{2} = \\sqrt{16} = 4$ 是有理数，尽管两个因数都是无理数；$\\sqrt{12} - 2\\sqrt{3} = 2\\sqrt{3} - 2\\sqrt{3} = 0$ 也是有理数。",
      ),
      generate(rng) {
        const c = combo(rng);
        return choiceProblem({
          prompt: t(`Is $${c.tex}$ rational or irrational?`, `$${c.tex}$ 是有理数还是无理数？`),
          options: [t("Rational", "有理数"), t("Irrational", "无理数")],
          correct: c.rational ? 0 : 1,
          solution: c.why,
        });
      },
    },
    {
      id: "finding-the-odd-one",
      title: t("Finding the rational or irrational expression", "找出有理数或无理数的式子"),
      explanation: t(
        "To find the one rational expression among several, simplify each one. Of $\\sqrt{3} + 1$, $2\\sqrt{5}$, $\\sqrt{3} \\cdot \\sqrt{27}$ and $\\sqrt{2} + \\sqrt{3}$, only $\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{81} = 9$ is rational.",
        "要在几个式子中找出唯一的有理数，逐个化简。在 $\\sqrt{3} + 1$、$2\\sqrt{5}$、$\\sqrt{3} \\cdot \\sqrt{27}$ 和 $\\sqrt{2} + \\sqrt{3}$ 中，只有 $\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{81} = 9$ 是有理数。",
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
        return choiceProblem({
          prompt: findRational
            ? t(`Which of these expressions has a rational value?${listTex(all)}`, `下列哪个式子的值是有理数？${listTex(all)}`)
            : t(`Which of these expressions has an irrational value?${listTex(all)}`, `下列哪个式子的值是无理数？${listTex(all)}`),
          options: all.map((c) => same(`$${c.tex}$`)),
          correct,
          solution: t(
            `${odd.why.en} Each of the other expressions is ${findRational ? "irrational" : "rational"}.`,
            `${odd.why["zh-CN"]}其余的式子都是${findRational ? "无理数" : "有理数"}。`,
          ),
        });
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

export const imaginaryNumbers: TopicDef = {
  id: "imaginary-numbers",
  title: t("Imaginary Numbers", "虚数"),
  summary: t(
    "Use the imaginary unit $i = \\sqrt{-1}$ to take square roots of negative numbers, and multiply imaginary numbers using $i^{2} = -1$.",
    "用虚数单位 $i = \\sqrt{-1}$ 求负数的平方根，并利用 $i^{2} = -1$ 进行虚数的乘法。",
  ),
  prerequisites: ["the-real-number-system", "simplifying-square-roots"],
  encompasses: [{ topic: "simplifying-square-roots", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSN.CN.A.1"],
  knowledgePoints: [
    {
      id: "square-roots-of-negative-numbers",
      title: t("Square roots of negative numbers", "负数的平方根"),
      explanation: t(
        "No real number squares to a negative number. The **imaginary unit** $i$ is a new number with $i^{2} = -1$, so $\\sqrt{-1} = i$. For a positive number $n$,\n\n$$\\sqrt{-n} = i\\sqrt{n}$$\n\nThen simplify $\\sqrt{n}$ as usual: $\\sqrt{-49} = 7i$ and $\\sqrt{-18} = i\\sqrt{18} = 3i\\sqrt{2}$. Numbers such as $7i$ and $3i\\sqrt{2}$ are **imaginary numbers**. Write $i$ before a root, $3i\\sqrt{2}$, so that it is not mistaken for being under the root.",
        "没有实数的平方是负数。**虚数单位** $i$ 是一个新的数，满足 $i^{2} = -1$，所以 $\\sqrt{-1} = i$。对正数 $n$，\n\n$$\\sqrt{-n} = i\\sqrt{n}$$\n\n然后照常化简 $\\sqrt{n}$：$\\sqrt{-49} = 7i$，$\\sqrt{-18} = i\\sqrt{18} = 3i\\sqrt{2}$。像 $7i$ 和 $3i\\sqrt{2}$ 这样的数叫做**虚数**。把 $i$ 写在根号前面，如 $3i\\sqrt{2}$，以免误认为 $i$ 在根号里。",
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
          solution: t(
            `Write $\\sqrt{-${n}} = i\\sqrt{${n}}$ and simplify the root:${steps(`${expr} = ${front(k)}i\\sqrt{${n}} = ${answer}`)}`,
            `把 $\\sqrt{-${n}}$ 写成 $i\\sqrt{${n}}$，再化简根式：${steps(`${expr} = ${front(k)}i\\sqrt{${n}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "products-of-imaginary-numbers",
      title: t("Products and powers of imaginary numbers", "虚数的乘积与乘方"),
      explanation: t(
        "Multiply imaginary numbers like monomials, treating $i$ as a variable, then replace $i^{2}$ by $-1$:\n\n$$(3i)(-5i) = -15i^{2} = -15 \\cdot (-1) = 15$$\n\n$$(4i)^{2} = 16i^{2} = -16$$\n\nThe product of two imaginary numbers is a real number. Forgetting that $i^{2} = -1$ gives the wrong sign.",
        "像单项式一样相乘虚数，把 $i$ 当作变量，再把 $i^{2}$ 换成 $-1$：\n\n$$(3i)(-5i) = -15i^{2} = -15 \\cdot (-1) = 15$$\n\n$$(4i)^{2} = 16i^{2} = -16$$\n\n两个虚数的积是实数。忘记 $i^{2} = -1$ 就会得到相反的符号。",
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
            solution: t(
              `Multiply, then use $i^{2} = -1$:${steps(`${expr} = ${a * b}i^{2} = ${a * b} \\cdot (-1) = ${-a * b}`)}`,
              `相乘后利用 $i^{2} = -1$：${steps(`${expr} = ${a * b}i^{2} = ${a * b} \\cdot (-1) = ${-a * b}`)}`,
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
            solution: t(
              `Square the coefficient and $i$:${steps(`${expr} = ${paren(a)}^{2}i^{2} = ${a * a} \\cdot (-1) = ${-a * a}`)}`,
              `把系数和 $i$ 分别平方：${steps(`${expr} = ${paren(a)}^{2}i^{2} = ${a * a} \\cdot (-1) = ${-a * a}`)}`,
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
          solution: t(
            `Replace $i^{2}$ by $-1$:${steps(`${expr} = ${a} \\cdot (-1) ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${-a + b}`)}`,
            `把 $i^{2}$ 换成 $-1$：${steps(`${expr} = ${a} \\cdot (-1) ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${-a + b}`)}`,
          ),
        });
      },
    },
    {
      id: "products-of-roots-of-negative-numbers",
      title: t("Products of square roots of negative numbers", "负数平方根的乘积"),
      explanation: t(
        "The rule $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$ holds only when $a$ and $b$ are not both negative. Rewrite each root with $i$ **first**:\n\n$$\\sqrt{-4} \\cdot \\sqrt{-9} = 2i \\cdot 3i = 6i^{2} = -6$$\n\nnot $\\sqrt{36} = 6$. Likewise $\\sqrt{-3} \\cdot \\sqrt{-6} = i\\sqrt{3} \\cdot i\\sqrt{6} = i^{2}\\sqrt{18} = -3\\sqrt{2}$. With one negative radicand, $\\sqrt{-2} \\cdot \\sqrt{8} = i\\sqrt{2} \\cdot 2\\sqrt{2} = 4i$.",
        "法则 $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$ 只在 $a$、$b$ 不同为负数时成立。要**先**用 $i$ 改写每个根式：\n\n$$\\sqrt{-4} \\cdot \\sqrt{-9} = 2i \\cdot 3i = 6i^{2} = -6$$\n\n而不是 $\\sqrt{36} = 6$。同样，$\\sqrt{-3} \\cdot \\sqrt{-6} = i\\sqrt{3} \\cdot i\\sqrt{6} = i^{2}\\sqrt{18} = -3\\sqrt{2}$。只有一个被开方数为负时，$\\sqrt{-2} \\cdot \\sqrt{8} = i\\sqrt{2} \\cdot 2\\sqrt{2} = 4i$。",
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
        const mid = both
          ? `i\\sqrt{${a}} \\cdot i\\sqrt{${b}} = i^{2}\\sqrt{${a * b}}`
          : `i\\sqrt{${a}} \\cdot \\sqrt{${b}} = i\\sqrt{${a * b}}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: both ? [rad(c, m), imag(-c, m), imag(c, m)] : [rad(c, m), imag(-c, m), rad(-c, m)],
          solution: t(
            `Rewrite the roots of negative numbers with $i$ before multiplying:${steps(`${expr} = ${mid} = ${answer}`)}`,
            `相乘之前，先用 $i$ 改写负数的平方根：${steps(`${expr} = ${mid} = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "x-squared-equals-a-negative",
      title: t("Solving $x^{2} = -k$", "解 $x^{2} = -k$"),
      explanation: t(
        "Over the real numbers $x^{2} = -16$ has no solution. With imaginary numbers it has two: take the square root of both sides with $\\pm$,\n\n$$x = \\pm\\sqrt{-16} = \\pm 4i$$\n\nCheck: $(4i)^{2} = 16i^{2} = -16$ and $(-4i)^{2} = -16$. The two solutions are opposites, $4i$ and $-4i$. In these problems, enter the one whose imaginary part is positive: $4i$.",
        "在实数范围内 $x^{2} = -16$ 没有解。有了虚数，它有两个解：两边开平方并加上 $\\pm$，\n\n$$x = \\pm\\sqrt{-16} = \\pm 4i$$\n\n检验：$(4i)^{2} = 16i^{2} = -16$，$(-4i)^{2} = -16$。两个解互为相反数：$4i$ 和 $-4i$。在这些题目中，输入虚部为正的那个：$4i$。",
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
          solution: t(
            `Isolate $${v}^{2}$ and take square roots:${steps(`${v}^{2} = -${n}`, `${v} = \\pm\\sqrt{-${n}} = \\pm ${imag(c, m)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `分离出 $${v}^{2}$，再开平方：${steps(`${v}^{2} = -${n}`, `${v} = \\pm\\sqrt{-${n}} = \\pm ${imag(c, m)}`)}虚部为正的解是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      title: t("Equations of the form $ax^{2} + c = 0$", "形如 $ax^{2} + c = 0$ 的方程"),
      explanation: t(
        "Isolate $x^{2}$ first: subtract the constant, then divide by the coefficient of $x^{2}$.\n\n$$3x^{2} + 54 = 0 \\quad\\Rightarrow\\quad 3x^{2} = -54 \\quad\\Rightarrow\\quad x^{2} = -18$$\n\nso $x = \\pm\\sqrt{-18} = \\pm 3i\\sqrt{2}$.",
        "先分离出 $x^{2}$：减去常数，再除以 $x^{2}$ 的系数。\n\n$$3x^{2} + 54 = 0 \\quad\\Rightarrow\\quad 3x^{2} = -54 \\quad\\Rightarrow\\quad x^{2} = -18$$\n\n所以 $x = \\pm\\sqrt{-18} = \\pm 3i\\sqrt{2}$。",
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
          solution: t(
            `Isolate $x^{2}$, then take square roots:${steps(`${s * a}x^{2} = ${-s * a * n}`, `x^{2} = -${n}`, `x = \\pm\\sqrt{-${n}} = \\pm ${imag(c, m)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `分离出 $x^{2}$，再开平方：${steps(`${s * a}x^{2} = ${-s * a * n}`, `x^{2} = -${n}`, `x = \\pm\\sqrt{-${n}} = \\pm ${imag(c, m)}`)}虚部为正的解是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "rearranging-first",
      title: t("Collecting terms first", "先移项合并"),
      explanation: t(
        "When $x^{2}$ appears on both sides, collect the $x^{2}$ terms on one side and the constants on the other:\n\n$$5x^{2} + 30 = 2x^{2} + 3 \\quad\\Rightarrow\\quad 3x^{2} = -27 \\quad\\Rightarrow\\quad x^{2} = -9$$\n\nso $x = \\pm 3i$. A negative value of $x^{2}$ means the solutions are imaginary.",
        "当方程两边都有 $x^{2}$ 时，把 $x^{2}$ 项移到一边，常数移到另一边：\n\n$$5x^{2} + 30 = 2x^{2} + 3 \\quad\\Rightarrow\\quad 3x^{2} = -27 \\quad\\Rightarrow\\quad x^{2} = -9$$\n\n所以 $x = \\pm 3i$。$x^{2}$ 的值为负，说明解是虚数。",
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
          solution: t(
            `Collect the $x^{2}$ terms on the left and the constants on the right:${steps(`${front(a)}x^{2} = ${q} - ${paren(r)} = ${-a * n}`, `x^{2} = -${n}`, `x = \\pm ${imag(c, m)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `把 $x^{2}$ 项移到左边，常数移到右边：${steps(`${front(a)}x^{2} = ${q} - ${paren(r)} = ${-a * n}`, `x^{2} = -${n}`, `x = \\pm ${imag(c, m)}`)}虚部为正的解是 $${answer}$。`,
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
  encompasses: [{ topic: "imaginary-numbers", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSN.CN.A.1"],
  knowledgePoints: [
    {
      id: "real-and-imaginary-parts",
      title: t("Real and imaginary parts", "实部与虚部"),
      explanation: t(
        "A **complex number** is a number $a + bi$ with $a$ and $b$ real. The real number $a$ is its **real part** and the real number $b$ is its **imaginary part**: for $-4 + 7i$ the real part is $-4$ and the imaginary part is $7$, not $7i$.\n\nEvery real number is a complex number with imaginary part $0$, and every imaginary number $bi$ has real part $0$. When the terms are written in another order, as in $3i - 5$, the real part is still the term without $i$: $-5$.",
        "**复数**是形如 $a + bi$ 的数，其中 $a$、$b$ 是实数。实数 $a$ 是它的**实部**，实数 $b$ 是它的**虚部**：$-4 + 7i$ 的实部是 $-4$，虚部是 $7$，而不是 $7i$。\n\n每个实数都是虚部为 $0$ 的复数，每个虚数 $bi$ 的实部都是 $0$。项的顺序不同时，例如 $3i - 5$，实部仍是不含 $i$ 的项：$-5$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 5);
        const a = kind === 4 ? 0 : rng.nonZero(-12, 12);
        const b = kind === 5 ? 0 : rng.nonZero(-12, 12);
        const z = kind === 3 ? poly([b, "i"], [a, ""]) : cx(a, b);
        const real = rng.bool();
        return numberProblem({
          prompt: real
            ? t(`What is the real part of $${z}$?`, `$${z}$ 的实部是多少？`)
            : t(`What is the imaginary part of $${z}$?`, `$${z}$ 的虚部是多少？`),
          answer: real ? a : b,
          wrong: real ? [b, -a] : [a, -b],
          solution: real
            ? t(
                `Written as $a + bi$, the number is $${cx(a, b)}$; its real part is $${a}$.`,
                `写成 $a + bi$ 的形式是 $${cx(a, b)}$；实部是 $${a}$。`,
              )
            : t(
                `Written as $a + bi$, the number is $${cx(a, b)}$; its imaginary part is the real number $${b}$.`,
                `写成 $a + bi$ 的形式是 $${cx(a, b)}$；虚部是实数 $${b}$。`,
              ),
        });
      },
    },
    {
      id: "standard-form",
      title: t("Writing complex numbers in the form $a + bi$", "把复数写成 $a + bi$ 的形式"),
      explanation: t(
        "To write an expression in the form $a + bi$, rewrite square roots of negative numbers with $i$, then collect the real terms and the imaginary terms:\n\n$$6 - \\sqrt{-12} = 6 - i\\sqrt{12} = 6 - 2i\\sqrt{3}$$\n\nA fraction is divided term by term: $\\frac{8 + \\sqrt{-36}}{2} = \\frac{8 + 6i}{2} = 4 + 3i$.",
        "要把式子写成 $a + bi$ 的形式，先用 $i$ 改写负数的平方根，再把实数项和虚数项分别合并：\n\n$$6 - \\sqrt{-12} = 6 - i\\sqrt{12} = 6 - 2i\\sqrt{3}$$\n\n分式要逐项相除：$\\frac{8 + \\sqrt{-36}}{2} = \\frac{8 + 6i}{2} = 4 + 3i$。",
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
            solution: t(
              `Rewrite the root with $i$, then divide each term by $${d}$:${steps(`\\frac{${top}}{${d}} = \\frac{${cxr(d * a, s * c * d, m)}}{${d}} = ${answer}`)}`,
              `先用 $i$ 改写根式，再把每一项除以 $${d}$：${steps(`\\frac{${top}}{${d}} = \\frac{${cxr(d * a, s * c * d, m)}}{${d}} = ${answer}`)}`,
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
          solution: t(
            `$\\sqrt{-${n}} = ${imag(c, m)}$, so the number is $${answer}$: its real part is $${a}$ and its imaginary part is $${rad(s * c, m)}$.`,
            `$\\sqrt{-${n}} = ${imag(c, m)}$，所以这个数是 $${answer}$：实部是 $${a}$，虚部是 $${rad(s * c, m)}$。`,
          ),
        });
      },
    },
    {
      id: "equal-complex-numbers",
      title: t("Equal complex numbers", "复数相等"),
      explanation: t(
        "Two complex numbers are **equal** exactly when their real parts are equal and their imaginary parts are equal. So one equation between complex numbers gives two real equations. If $a$ and $b$ are real and\n\n$$(2a - 1) + 3bi = 7 - 12i$$\n\nthen $2a - 1 = 7$ and $3b = -12$, so $a = 4$ and $b = -4$.",
        "两个复数**相等**，当且仅当它们的实部相等且虚部相等。所以一个复数等式给出两个实数等式。若 $a$、$b$ 是实数，且\n\n$$(2a - 1) + 3bi = 7 - 12i$$\n\n则 $2a - 1 = 7$，$3b = -12$，所以 $a = 4$，$b = -4$。",
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
          solution: t(
            `Equate the real parts and the imaginary parts:${steps(`${linear(p, q, "a")} = ${A} \\quad\\Rightarrow\\quad a = ${a}`, `${front(r)}b = ${B} \\quad\\Rightarrow\\quad b = ${b}`)}`,
            `令实部相等、虚部相等：${steps(`${linear(p, q, "a")} = ${A} \\quad\\Rightarrow\\quad a = ${a}`, `${front(r)}b = ${B} \\quad\\Rightarrow\\quad b = ${b}`)}`,
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
  knowledgePoints: [
    {
      id: "adding",
      title: t("Adding complex numbers", "复数的加法"),
      explanation: t(
        "Add complex numbers like polynomials in $i$: add the real parts and add the imaginary parts.\n\n$$(3 - 2i) + (-5 + 6i) = (3 - 5) + (-2 + 6)i = -2 + 4i$$",
        "像关于 $i$ 的多项式那样相加复数：实部相加，虚部相加。\n\n$$(3 - 2i) + (-5 + 6i) = (3 - 5) + (-2 + 6)i = -2 + 4i$$",
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
          solution: t(
            `Add the real parts and the imaginary parts:${steps(`${expr} = (${a} ${c < 0 ? "-" : "+"} ${Math.abs(c)}) + (${b} ${d < 0 ? "-" : "+"} ${Math.abs(d)})i = ${answer}`)}`,
            `实部相加，虚部相加：${steps(`${expr} = (${a} ${c < 0 ? "-" : "+"} ${Math.abs(c)}) + (${b} ${d < 0 ? "-" : "+"} ${Math.abs(d)})i = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "subtracting",
      title: t("Subtracting complex numbers", "复数的减法"),
      explanation: t(
        "To subtract, distribute the minus sign to **both** parts of the second number, then combine:\n\n$$(4 + i) - (6 - 3i) = 4 + i - 6 + 3i = -2 + 4i$$\n\nA common mistake is to change the sign of the real part only, which would give $-2 - 2i$.",
        "相减时，把减号分配给第二个数的**两个**部分，再合并：\n\n$$(4 + i) - (6 - 3i) = 4 + i - 6 + 3i = -2 + 4i$$\n\n常见的错误是只改变实部的符号，那样会得到 $-2 - 2i$。",
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
          solution: t(
            `Distribute the minus sign, then combine:${steps(`${expr} = ${poly([a, ""], [b, "i"], [-c, ""], [-d, "i"])} = ${answer}`)}`,
            `去括号（注意减号），再合并：${steps(`${expr} = ${poly([a, ""], [b, "i"], [-c, ""], [-d, "i"])} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "combinations",
      title: t("Multiples, sums and differences", "倍数与加减混合"),
      explanation: t(
        "A real number times a complex number multiplies both parts: $3(2 - 5i) = 6 - 15i$. With several terms, distribute first, then collect the real and the imaginary terms:\n\n$$2(1 + 4i) - (3 - i) + 5i = 2 + 8i - 3 + i + 5i = -1 + 14i$$\n\nRewrite square roots of negative numbers with $i$ before combining: $\\sqrt{-25} = 5i$.",
        "实数乘复数时，两个部分都要乘：$3(2 - 5i) = 6 - 15i$。项较多时，先去括号，再把实数项和虚数项分别合并：\n\n$$2(1 + 4i) - (3 - i) + 5i = 2 + 8i - 3 + i + 5i = -1 + 14i$$\n\n合并前先用 $i$ 改写负数的平方根：$\\sqrt{-25} = 5i$。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3, 4, 5, -2, -3]);
        const [a, b] = drawComplex(rng, 6);
        const [c, d] = drawComplex(rng, 9);
        const sub = rng.bool();
        const root = rng.bool();
        const e = rng.int(1, 9);
        const extra = root ? ` + \\sqrt{-${e * e}}` : ` ${rng.bool() ? "+" : "-"} ${e}i`;
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
          solution: t(
            `Distribute, then collect the real terms and the imaginary terms:${steps(`${expr} = ${poly([k * a, ""], [k * b, "i"], [s * c, ""], [s * d, "i"], [ex, "i"])} = ${answer}`)}`,
            `去括号，再分别合并实数项和虚数项：${steps(`${expr} = ${poly([k * a, ""], [k * b, "i"], [s * c, ""], [s * d, "i"], [ex, "i"])} = ${answer}`)}`,
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
  knowledgePoints: [
    {
      id: "by-an-imaginary-number",
      title: t("Multiplying by an imaginary number", "乘以一个虚数"),
      explanation: t(
        "Distribute, then replace $i^{2}$ by $-1$ and write the result in the form $a + bi$:\n\n$$3i(4 - 2i) = 12i - 6i^{2} = 12i + 6 = 6 + 12i$$",
        "用分配律展开，把 $i^{2}$ 换成 $-1$，再把结果写成 $a + bi$ 的形式：\n\n$$3i(4 - 2i) = 12i - 6i^{2} = 12i + 6 = 6 + 12i$$",
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
          solution: t(
            `Distribute and use $i^{2} = -1$:${steps(`${expr} = ${poly([k * a, "i"], [k * b, "i^{2}"])} = ${poly([k * a, "i"], [-k * b, ""])} = ${answer}`)}`,
            `用分配律展开，并利用 $i^{2} = -1$：${steps(`${expr} = ${poly([k * a, "i"], [k * b, "i^{2}"])} = ${poly([k * a, "i"], [-k * b, ""])} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "two-complex-numbers",
      title: t("Multiplying two complex numbers", "两个复数相乘"),
      explanation: t(
        "Multiply two complex numbers like two binomials, with four products, then use $i^{2} = -1$:\n\n$$(2 + 3i)(4 - i) = 8 - 2i + 12i - 3i^{2} = 8 + 10i + 3 = 11 + 10i$$\n\nIn general $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$: the product of the imaginary parts becomes **negative** and joins the real part.",
        "像两个二项式那样相乘两个复数，共有四个乘积，再利用 $i^{2} = -1$：\n\n$$(2 + 3i)(4 - i) = 8 - 2i + 12i - 3i^{2} = 8 + 10i + 3 = 11 + 10i$$\n\n一般地，$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$：虚部之积变为**负数**，并入实部。",
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
          solution: t(
            `Multiply every term of the first factor by every term of the second, then use $i^{2} = -1$:${steps(`${expr} = ${poly([a * c, ""], [a * d, "i"], [b * c, "i"], [b * d, "i^{2}"])}`, `= ${poly([a * c, ""], [a * d + b * c, "i"], [-b * d, ""])} = ${answer}`)}`,
            `用第一个因式的每一项乘第二个因式的每一项，再利用 $i^{2} = -1$：${steps(`${expr} = ${poly([a * c, ""], [a * d, "i"], [b * c, "i"], [b * d, "i^{2}"])}`, `= ${poly([a * c, ""], [a * d + b * c, "i"], [-b * d, ""])} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "squares-and-conjugates",
      title: t("Squares and conjugates", "平方与共轭复数"),
      explanation: t(
        "The **conjugate** of $a + bi$ is $a - bi$. Their product is a real number, by the difference of squares:\n\n$$(a + bi)(a - bi) = a^{2} - b^{2}i^{2} = a^{2} + b^{2}$$\n\nso $(3 + 4i)(3 - 4i) = 9 + 16 = 25$. A square follows the pattern of squaring a binomial:\n\n$$(3 + 4i)^{2} = 9 + 24i + 16i^{2} = -7 + 24i$$",
        "$a + bi$ 的**共轭复数**是 $a - bi$。由平方差公式，它们的积是实数：\n\n$$(a + bi)(a - bi) = a^{2} - b^{2}i^{2} = a^{2} + b^{2}$$\n\n所以 $(3 + 4i)(3 - 4i) = 9 + 16 = 25$。平方则按照二项式平方的规律展开：\n\n$$(3 + 4i)^{2} = 9 + 24i + 16i^{2} = -7 + 24i$$",
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
            solution: t(
              `The factors are conjugates, so the product is $a^{2} + b^{2}$:${steps(`${expr} = ${paren(a)}^{2} - (${imag(b, 1)})^{2} = ${a * a} - ${paren(-b * b)} = ${a * a + b * b}`)}`,
              `两个因式互为共轭复数，所以积为 $a^{2} + b^{2}$：${steps(`${expr} = ${paren(a)}^{2} - (${imag(b, 1)})^{2} = ${a * a} - ${paren(-b * b)} = ${a * a + b * b}`)}`,
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
          solution: t(
            `Square the binomial, then use $i^{2} = -1$:${steps(`${expr} = ${paren(a)}^{2} + 2 \\cdot ${paren(a)} \\cdot ${imag(b, 1)} + (${imag(b, 1)})^{2}`, `= ${poly([a * a, ""], [2 * a * b, "i"], [-b * b, ""])} = ${answer}`)}`,
            `按二项式平方展开，再利用 $i^{2} = -1$：${steps(`${expr} = ${paren(a)}^{2} + 2 \\cdot ${paren(a)} \\cdot ${imag(b, 1)} + (${imag(b, 1)})^{2}`, `= ${poly([a * a, ""], [2 * a * b, "i"], [-b * b, ""])} = ${answer}`)}`,
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
    { topic: "the-quadratic-formula", weight: 0.5 },
    { topic: "quadratic-equations-with-purely-imaginary-solutions", weight: 0.4 },
    { topic: "complex-numbers", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSN.CN.C.7", "CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "square-root-method",
      title: t("Using square roots", "用开平方法"),
      explanation: t(
        "An equation $(x - h)^{2} = -k$ with $k > 0$ is solved like before, with imaginary square roots:\n\n$$(x - 3)^{2} + 16 = 0 \\quad\\Rightarrow\\quad (x - 3)^{2} = -16 \\quad\\Rightarrow\\quad x - 3 = \\pm 4i$$\n\nso $x = 3 \\pm 4i$. The two solutions $3 + 4i$ and $3 - 4i$ are **complex conjugates**. Enter the one whose imaginary part is positive.",
        "方程 $(x - h)^{2} = -k$（$k > 0$）的解法与以前相同，只是平方根是虚数：\n\n$$(x - 3)^{2} + 16 = 0 \\quad\\Rightarrow\\quad (x - 3)^{2} = -16 \\quad\\Rightarrow\\quad x - 3 = \\pm 4i$$\n\n所以 $x = 3 \\pm 4i$。两个解 $3 + 4i$ 和 $3 - 4i$ 互为**共轭复数**。请输入虚部为正的那个解。",
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
          solution: t(
            `Isolate the square, then take square roots:${steps(`${fac(h)}^{2} = -${k}`, `${linear(1, -h)} = \\pm ${imag(c, m)}`, `x = ${h} \\pm ${imag(c, m)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `分离出平方项，再开平方：${steps(`${fac(h)}^{2} = -${k}`, `${linear(1, -h)} = \\pm ${imag(c, m)}`, `x = ${h} \\pm ${imag(c, m)}`)}虚部为正的解是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "quadratic-formula",
      title: t("Using the quadratic formula", "用求根公式"),
      explanation: t(
        "When the discriminant $b^{2} - 4ac$ is negative, the quadratic formula still works, with an imaginary square root. For $x^{2} - 4x + 13 = 0$:\n\n$$x = \\frac{4 \\pm \\sqrt{16 - 52}}{2} = \\frac{4 \\pm \\sqrt{-36}}{2} = \\frac{4 \\pm 6i}{2} = 2 \\pm 3i$$\n\nDivide **both** terms of the numerator by the denominator.",
        "判别式 $b^{2} - 4ac$ 为负时，求根公式仍然适用，只是平方根是虚数。对 $x^{2} - 4x + 13 = 0$：\n\n$$x = \\frac{4 \\pm \\sqrt{16 - 52}}{2} = \\frac{4 \\pm \\sqrt{-36}}{2} = \\frac{4 \\pm 6i}{2} = 2 \\pm 3i$$\n\n分子的**两项**都要除以分母。",
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
          solution: t(
            `Here $a = 1$, $b = ${b}$ and $c = ${cc}$, so $b^{2} - 4ac = ${b * b} - ${4 * cc} = ${disc}$:${steps(`x = \\frac{${-b} \\pm \\sqrt{${disc}}}{2} = \\frac{${-b} \\pm ${imag(c2, m2)}}{2} = ${h} \\pm ${imag(c, m)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `这里 $a = 1$，$b = ${b}$，$c = ${cc}$，所以 $b^{2} - 4ac = ${b * b} - ${4 * cc} = ${disc}$：${steps(`x = \\frac{${-b} \\pm \\sqrt{${disc}}}{2} = \\frac{${-b} \\pm ${imag(c2, m2)}}{2} = ${h} \\pm ${imag(c, m)}`)}虚部为正的解是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      title: t("Equations with a leading coefficient", "二次项系数不为 1 的方程"),
      explanation: t(
        "With a leading coefficient, use $2a$ in the denominator. For $2x^{2} - 4x + 10 = 0$, $b^{2} - 4ac = 16 - 80 = -64$:\n\n$$x = \\frac{4 \\pm \\sqrt{-64}}{4} = \\frac{4 \\pm 8i}{4} = 1 \\pm 2i$$\n\nYou may also divide the equation by $2$ first: $x^{2} - 2x + 5 = 0$ has the same solutions.",
        "二次项系数不为 1 时，分母是 $2a$。对 $2x^{2} - 4x + 10 = 0$，$b^{2} - 4ac = 16 - 80 = -64$：\n\n$$x = \\frac{4 \\pm \\sqrt{-64}}{4} = \\frac{4 \\pm 8i}{4} = 1 \\pm 2i$$\n\n也可以先把方程除以 $2$：$x^{2} - 2x + 5 = 0$ 的解相同。",
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
          solution: t(
            `Here $b^{2} - 4ac = ${b * b} - ${4 * a * cc} = ${disc}$:${steps(`x = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}} = \\frac{${-b} \\pm ${imag(c2, m2)}}{${2 * a}} = ${h} \\pm ${imag(c, m)}`)}The solution with a positive imaginary part is $${answer}$.`,
            `这里 $b^{2} - 4ac = ${b * b} - ${4 * a * cc} = ${disc}$：${steps(`x = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}} = \\frac{${-b} \\pm ${imag(c2, m2)}}{${2 * a}} = ${h} \\pm ${imag(c, m)}`)}虚部为正的解是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "conjugate-pairs",
      title: t("Conjugate pairs of solutions", "成对的共轭复数解"),
      explanation: t(
        "When a quadratic equation with **real** coefficients has a nonreal solution $p + qi$, its other solution is the conjugate $p - qi$, because the $\\pm$ in the formula gives both. Then\n\n$$x^{2} + bx + c = (x - (p + qi))(x - (p - qi)) = x^{2} - 2px + (p^{2} + q^{2})$$\n\nso $b = -2p$ and $c = p^{2} + q^{2}$. For the solution $2 - 3i$: $b = -4$ and $c = 4 + 9 = 13$.",
        "当**实系数**一元二次方程有一个非实数解 $p + qi$ 时，另一个解就是它的共轭复数 $p - qi$，因为公式中的 $\\pm$ 同时给出两者。于是\n\n$$x^{2} + bx + c = (x - (p + qi))(x - (p - qi)) = x^{2} - 2px + (p^{2} + q^{2})$$\n\n所以 $b = -2p$，$c = p^{2} + q^{2}$。若一个解是 $2 - 3i$，则 $b = -4$，$c = 4 + 9 = 13$。",
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
            solution: t(
              `Nonreal solutions of an equation with real coefficients come in conjugate pairs: the other solution is $${cx(p, -q)}$.`,
              `实系数方程的非实数解成对出现，互为共轭：另一个解是 $${cx(p, -q)}$。`,
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
          solution: t(
            `The other solution is $${cx(p, -q)}$. Their sum is $${2 * p}$ and their product is $${paren(p)}^{2} + ${paren(q)}^{2} = ${p * p + q * q}$, so${steps(`x^{2} + bx + c = ${poly([1, "x^{2}"], [-2 * p, "x"], [p * p + q * q, ""])}`)}and $(b, c) = (${-2 * p}, ${p * p + q * q})$.`,
            `另一个解是 $${cx(p, -q)}$。两解之和是 $${2 * p}$，之积是 $${paren(p)}^{2} + ${paren(q)}^{2} = ${p * p + q * q}$，所以${steps(`x^{2} + bx + c = ${poly([1, "x^{2}"], [-2 * p, "x"], [p * p + q * q, ""])}`)}即 $(b, c) = (${-2 * p}, ${p * p + q * q})$。`,
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

export const cyclicPropertyOfTheImaginaryUnit: TopicDef = {
  id: "cyclic-property-of-the-imaginary-unit",
  title: t("The Cyclic Property of the Imaginary Unit", "虚数单位的周期性"),
  summary: t(
    "Simplify powers of $i$ using the cycle $i, -1, -i, 1$ that repeats every four powers.",
    "利用每四次重复一次的循环 $i, -1, -i, 1$ 化简 $i$ 的乘方。",
  ),
  prerequisites: ["imaginary-numbers", "power-rules"],
  encompasses: [{ topic: "product-and-quotient-rules", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSN.CN.A.2"],
  knowledgePoints: [
    {
      id: "powers-of-i",
      title: t("Powers of $i$", "$i$ 的乘方"),
      explanation: t(
        "The powers of $i$ repeat in a cycle of four:\n\n$$i^{1} = i, \\quad i^{2} = -1, \\quad i^{3} = i^{2} \\cdot i = -i, \\quad i^{4} = (i^{2})^{2} = 1$$\n\nthen $i^{5} = i^{4} \\cdot i = i$ starts the cycle again. Since $i^{4} = 1$, divide the exponent by $4$ and keep the **remainder**: $i^{4q + r} = (i^{4})^{q} \\cdot i^{r} = i^{r}$. For example, $i^{43} = i^{40} \\cdot i^{3} = -i$, because $43 = 4 \\cdot 10 + 3$. A remainder of $0$ gives $i^{0} = 1$.",
        "$i$ 的乘方以四为周期循环：\n\n$$i^{1} = i, \\quad i^{2} = -1, \\quad i^{3} = i^{2} \\cdot i = -i, \\quad i^{4} = (i^{2})^{2} = 1$$\n\n然后 $i^{5} = i^{4} \\cdot i = i$ 又开始新的循环。因为 $i^{4} = 1$，把指数除以 $4$ 并保留**余数**：$i^{4q + r} = (i^{4})^{q} \\cdot i^{r} = i^{r}$。例如 $43 = 4 \\cdot 10 + 3$，所以 $i^{43} = i^{40} \\cdot i^{3} = -i$。余数为 $0$ 时得 $i^{0} = 1$。",
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
          solution: t(
            `$${n} = 4 \\cdot ${(n - r) / 4} + ${r}$, so${steps(`i^{${n}} = (i^{4})^{${(n - r) / 4}} \\cdot i^{${r}} = 1 \\cdot i^{${r}} = ${answer}`)}`,
            `$${n} = 4 \\cdot ${(n - r) / 4} + ${r}$，所以${steps(`i^{${n}} = (i^{4})^{${(n - r) / 4}} \\cdot i^{${r}} = 1 \\cdot i^{${r}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "products-quotients-and-powers",
      title: t("Products, quotients and powers", "乘积、商与乘方"),
      explanation: t(
        "The rules of exponents hold for powers of $i$. Combine the exponents first, then reduce:\n\n$$i^{23} \\cdot i^{14} = i^{37} = i, \\qquad \\frac{i^{30}}{i^{7}} = i^{23} = -i, \\qquad (i^{3})^{5} = i^{15} = -i$$\n\nNegative exponents follow the same cycle: $i^{-1} = \\frac{1}{i} = -i$, since $i \\cdot (-i) = -i^{2} = 1$; so $i^{-n} = i^{4k - n}$ for any multiple $4k$ of four larger than $n$.",
        "指数运算法则对 $i$ 的乘方同样成立。先合并指数，再化简：\n\n$$i^{23} \\cdot i^{14} = i^{37} = i, \\qquad \\frac{i^{30}}{i^{7}} = i^{23} = -i, \\qquad (i^{3})^{5} = i^{15} = -i$$\n\n负指数遵循同样的循环：$i^{-1} = \\frac{1}{i} = -i$，因为 $i \\cdot (-i) = -i^{2} = 1$；所以对任何大于 $n$ 的四的倍数 $4k$，$i^{-n} = i^{4k - n}$。",
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
        const answer = iPower(e);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: iValues.filter((v) => v !== answer),
          solution: t(
            `Combine the exponents, then use the cycle of four:${steps(`${expr} = ${how} = ${answer}`)}`,
            `先合并指数，再利用以四为周期的循环：${steps(`${expr} = ${how} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "expressions-with-powers-of-i",
      title: t("Expressions with several powers", "含多个乘方的式子"),
      explanation: t(
        "Reduce each power of $i$ to one of $1$, $i$, $-1$, $-i$, then combine the real and the imaginary terms:\n\n$$3i^{14} - 2i^{7} + i^{20} = 3(-1) - 2(-i) + 1 = -2 + 2i$$",
        "把每个 $i$ 的乘方化为 $1$、$i$、$-1$、$-i$ 之一，再合并实数项和虚数项：\n\n$$3i^{14} - 2i^{7} + i^{20} = 3(-1) - 2(-i) + 1 = -2 + 2i$$",
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
          solution: t(
            `Reduce each power, then combine:${steps(`${expr} = ${values} = ${answer}`)}`,
            `先化简每个乘方，再合并：${steps(`${expr} = ${values} = ${answer}`)}`,
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
