import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { choiceProblem, isTerminating, mixedLatex, numberProblem } from "../problems.ts";
import { compareProblem, mathText, pickChoice } from "./grade-4-fractions.ts";

// 7th Grade Math: adding, subtracting, multiplying and dividing rational numbers, opposites, reciprocals and zero,
// rational numbers as terminating or repeating decimals, and powers with rational bases.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** gcd is the greatest common divisor of two positive whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** names are the people in word problems. */
const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

/** Kind is how a rational number is written: as an integer or fraction, as a mixed number, or as a decimal. */
type Kind = "fraction" | "mixed" | "decimal";

/** show writes a rational number in the given kind: "-\frac{7}{4}", "-1\frac{3}{4}" or "-1.75". */
function show(q: Q, kind: Kind): string {
  if (kind === "decimal") return dec(q);
  if (kind === "mixed") return mixedLatex(q);
  return q.toLatex();
}

/** par writes a number, in parentheses when it is negative: "(-3)". */
const par = (q: Q, kind: Kind = "fraction") => (q.sign() < 0 ? `\\left(${show(q, kind)}\\right)` : show(q, kind));

/** cents writes an amount of cents as dollars with two decimal places: 1250 → "12.50". */
const cents = (c: number) => (c / 100).toFixed(2);

/** properQ draws a proper fraction n/d in lowest terms with d from 2 to maxDen. */
function properQ(rng: Rng, maxDen = 9): Q {
  const d = rng.int(2, maxDen);
  let n: number;
  do n = rng.int(1, d - 1);
  while (gcd(n, d) !== 1);
  return Q.of(n, d);
}

/** decQ draws a positive decimal with the given number of places, from lo to hi in units of the last place, not a whole number. */
function decQ(rng: Rng, places: number, lo: number, hi: number): Q {
  const scale = 10 ** places;
  let n: number;
  do n = rng.int(lo, hi);
  while (n % 10 === 0);
  return Q.of(n, scale);
}

/** formOf is the answer form for a kind: decimals are answered as decimals, other numbers in any exact form. */
const formOf = (kind: Kind) => (kind === "decimal" ? ("decimal" as const) : undefined);

/** ArithmeticProblem describes a one-line computation with the answer and typical wrong results. */
interface ArithmeticProblem {
  readonly expr: string;
  readonly answer: Q;
  readonly kind: Kind;
  readonly wrong: readonly Q[];
  readonly solution: Text;
}

/** evaluate builds the problem "Evaluate expr." from an ArithmeticProblem. */
function evaluate(p: ArithmeticProblem): Problem {
  return numberProblem({
    prompt: t(`Evaluate $${p.expr}$.`, `计算 $${p.expr}$。`),
    answer: p.answer,
    ...(formOf(p.kind) && { form: formOf(p.kind) }),
    wrong: [...p.wrong],
    solution: p.solution,
  });
}

/** subtractAcross is the result of the common mistake (a − c)/(b − d) for a/b − c/d, when it is defined and differs from the answer. */
function subtractAcross(x: Q, y: Q): Q[] {
  const den = x.d - y.d;
  return den === 0n ? [] : [Q.of(x.n - y.n, den)];
}

// ---------------------------------------------------------------------------
// Addition and subtraction of rational numbers

/** subtractingAPositiveNumberFromASmallerPositiveNumber subtracts a larger positive number from a smaller one. */
export const subtractingAPositiveNumberFromASmallerPositiveNumber = topic(
  "subtracting-a-positive-number-from-a-smaller-positive-number",
  t("Subtracting a Positive Number From a Smaller Positive Number", "较小的正数减去较大的正数"),
  t(
    "Subtracting b moves b units to the left on the number line, so when b is larger than a, a − b lands left of 0: a − b = −(b − a). For example, 4 − 9 = −5.",
    "减去 b 就是在数轴上向左移动 b 个单位，所以当 b 比 a 大时，a − b 落在 0 的左边：a − b = −(b − a)。例如 4 − 9 = −5。",
  ),
  ["interpreting-negative-numbers", "identifying-rational-numbers-on-a-number-line"],
  ["7.NS.A.1", "7.NS.A.1c"],
  [
    {
      id: "smaller-minus-larger",
      title: t("Subtracting a larger number", "减去较大的数"),
      explanation: t(
        "Subtracting a positive number means moving left on the number line. When the number taken away is larger, the result passes zero and becomes negative: it is the opposite of the larger number minus the smaller one.\n\n$4 - 9$: start at $4$ and move $9$ units left. Moving $4$ units reaches $0$, and $5$ more reach $-5$. So $4 - 9 = -(9 - 4) = -5$.",
        "减去一个正数，就是在数轴上向左移动。减去的数更大时，结果会越过零变成负数，它等于大数减小数的相反数。\n\n$4 - 9$：从 $4$ 出发向左移动 $9$ 个单位。移动 $4$ 个单位到 $0$，再移动 $5$ 个单位到 $-5$。所以 $4 - 9 = -(9 - 4) = -5$。",
      ),
      generate(rng) {
        const a = rng.int(1, 30);
        const b = rng.int(a + 1, a + 40);
        return evaluate({
          expr: `${a} - ${b}`,
          answer: Q.of(a - b),
          kind: "fraction",
          wrong: [Q.of(b - a), Q.of(-(a + b)), Q.of(a + b)],
          solution: t(
            `$${b}$ is larger than $${a}$, so the result is negative: $${a} - ${b} = -(${b} - ${a}) = ${a - b}$.`,
            `$${b}$ 比 $${a}$ 大，所以结果是负数：$${a} - ${b} = -(${b} - ${a}) = ${a - b}$。`,
          ),
        });
      },
    },
    {
      id: "smaller-minus-larger-in-context",
      title: t("Going below zero in context", "实际情境中低于零"),
      explanation: t(
        "A drop, a loss or a withdrawal that is larger than the starting amount takes the value below zero. Subtract as usual; the answer is negative, and its size is how far below zero the value ends up.\n\nThe temperature is $4^{\\circ}\\text{C}$ and falls by $9^{\\circ}\\text{C}$: $4 - 9 = -5$, so it is $-5^{\\circ}\\text{C}$.",
        "下降、亏损或取款的量大于原来的量时，结果会低于零。照常相减，答案是负数，它的大小表示比零低多少。\n\n气温是 $4^{\\circ}\\text{C}$，下降了 $9^{\\circ}\\text{C}$：$4 - 9 = -5$，所以是 $-5^{\\circ}\\text{C}$。",
      ),
      generate(rng) {
        const who = rng.pick(names);
        const a = rng.int(1, 25);
        const b = rng.int(a + 1, a + 30);
        const ctx = rng.int(0, 2);
        const prompt =
          ctx === 0
            ? t(
                `The temperature at noon is $${a}^{\\circ}\\text{C}$. By midnight it has fallen by $${b}^{\\circ}\\text{C}$. What is the temperature at midnight, in degrees Celsius?`,
                `中午气温是 $${a}^{\\circ}\\text{C}$，到午夜下降了 $${b}^{\\circ}\\text{C}$。午夜气温是多少摄氏度？`,
              )
            : ctx === 1
              ? t(
                  `${who} has $\\$${a}$ in a bank account and makes a payment of $\\$${b}$ from it. What is the new balance, in dollars?`,
                  `${who} 的银行账户里有 $\\$${a}$，从中支付了 $\\$${b}$。账户余额变为多少美元？`,
                )
              : t(
                  `A hiking trail starts at an elevation of $${a}$ meters above sea level and descends $${b}$ meters into a valley. What is the elevation at the end of the trail, in meters?`,
                  `一条徒步路线的起点海拔为 $${a}$ 米，沿路线下降了 $${b}$ 米，进入一个山谷。路线终点的海拔是多少米？`,
                );
        return numberProblem({
          prompt,
          answer: a - b,
          form: "integer",
          wrong: [b - a, -(a + b), a + b],
          solution: t(
            `A fall, payment or descent subtracts: $${a} - ${b}$. Taking away more than there is goes below $0$ by the difference: $${a} - ${b} = -(${b} - ${a}) = ${a - b}$.`,
            `下降、支付或下行都是减法：$${a} - ${b}$。减去的比原有的多，结果就低于 $0$，相差多少就是负多少：$${a} - ${b} = -(${b} - ${a}) = ${a - b}$。`,
          ),
        });
      },
    },
  ],
);

/** subtractingAPositiveNumberFromANegativeNumber subtracts a positive number from a negative one. */
export const subtractingAPositiveNumberFromANegativeNumber = topic(
  "subtracting-a-positive-number-from-a-negative-number",
  t("Subtracting a Positive Number From a Negative Number", "负数减去正数"),
  t(
    "Starting left of 0 and moving further left, the result is more negative: −a − b = −(a + b). For example, −4 − 7 = −11.",
    "从 0 的左边出发，再向左移动，结果更小：−a − b = −(a + b)。例如 −4 − 7 = −11。",
  ),
  ["subtracting-a-positive-number-from-a-smaller-positive-number"],
  ["7.NS.A.1", "7.NS.A.1c"],
  [
    {
      id: "negative-minus-positive",
      title: t("A negative number minus a positive number", "负数减正数"),
      explanation: t(
        "Starting from a negative number and subtracting a positive one moves further left, away from zero. The result is negative, and its distance from zero is the sum of the two distances.\n\n$-4 - 7$: start at $-4$ and move $7$ units left to $-11$. The distances add: $-(4 + 7) = -11$.",
        "从一个负数出发再减去一个正数，会继续向左移动，离零更远。结果是负数，它到零的距离等于两段距离之和。\n\n$-4 - 7$：从 $-4$ 出发向左移动 $7$ 个单位，到达 $-11$。两段距离相加：$-(4 + 7) = -11$。",
      ),
      generate(rng) {
        const a = rng.int(1, 40);
        const b = rng.int(1, 40);
        return evaluate({
          expr: `-${a} - ${b}`,
          answer: Q.of(-a - b),
          kind: "fraction",
          wrong: [Q.of(b - a), Q.of(a - b), Q.of(a + b)],
          solution: t(
            `Both moves are to the left of $0$, so the distances add: $-${a} - ${b} = -(${a} + ${b}) = ${-a - b}$.`,
            `两次都向 $0$ 的左边移动，所以距离相加：$-${a} - ${b} = -(${a} + ${b}) = ${-a - b}$。`,
          ),
        });
      },
    },
    {
      id: "negative-minus-positive-in-context",
      title: t("Going further below zero", "在零以下继续下降"),
      explanation: t(
        "When a quantity is already below zero, such as a depth or a debt, a further decrease makes it more negative. Subtract the decrease from the negative starting value.\n\nA diver at $-12$ meters descends $7$ more meters: $-12 - 7 = -19$ meters.",
        "当一个量已经低于零时，比如深度或欠款，再减少会使它变得更负。用负的起始值减去减少的量。\n\n潜水员在 $-12$ 米处，又下潜 $7$ 米：$-12 - 7 = -19$ 米。",
      ),
      generate(rng) {
        const a = rng.int(2, 30);
        const b = rng.int(2, 30);
        const ctx = rng.int(0, 2);
        const prompt =
          ctx === 0
            ? t(
                `The temperature at midnight is $-${a}^{\\circ}\\text{C}$. By dawn it has fallen another $${b}^{\\circ}\\text{C}$. What is the temperature at dawn, in degrees Celsius?`,
                `午夜气温是 $-${a}^{\\circ}\\text{C}$，到黎明又下降了 $${b}^{\\circ}\\text{C}$。黎明时气温是多少摄氏度？`,
              )
            : ctx === 1
              ? t(
                  `A diver is at an elevation of $-${a}$ meters and descends another $${b}$ meters. What is the diver's new elevation, in meters?`,
                  `一名潜水员在海拔 $-${a}$ 米处，又下潜了 $${b}$ 米。潜水员现在的海拔是多少米？`,
                )
              : t(
                  `A bank account has a balance of $-\\$${a}$. A fee of $\\$${b}$ is taken out. What is the new balance, in dollars?`,
                  `一个银行账户的余额是 $-\\$${a}$，又被扣除了 $\\$${b}$ 的手续费。账户余额变为多少美元？`,
                );
        return numberProblem({
          prompt,
          answer: -a - b,
          form: "integer",
          wrong: [b - a, a - b, a + b],
          solution: t(`$-${a} - ${b} = -(${a} + ${b}) = ${-a - b}$.`, `$-${a} - ${b} = -(${a} + ${b}) = ${-a - b}$。`),
        });
      },
    },
  ],
);

/** subtractingAPositiveFractionFromASmallerFraction subtracts a larger fraction or mixed number from a smaller one. */
export const subtractingAPositiveFractionFromASmallerFraction = topic(
  "subtracting-a-positive-fraction-from-a-smaller-fraction",
  t("Subtracting a Positive Fraction From a Smaller Fraction", "较小的分数减去较大的分数"),
  t(
    "As with whole numbers, a − b = −(b − a) when b > a: subtract the smaller fraction from the larger and make the result negative. 1/4 − 2/3 = −(8/12 − 3/12) = −5/12.",
    "与整数一样，当 b > a 时，a − b = −(b − a)：用较大的分数减去较小的分数，再把结果写成负数。1/4 − 2/3 = −(8/12 − 3/12) = −5/12。",
  ),
  ["subtracting-a-positive-number-from-a-smaller-positive-number", "subtracting-fractions-with-unlike-denominators"],
  ["7.NS.A.1", "7.NS.A.1c"],
  [
    {
      id: "smaller-fraction-minus-larger-fraction",
      title: t("Fractions", "分数"),
      explanation: t(
        "To subtract fractions, first rewrite them with a common denominator. If the fraction being subtracted is larger, the difference is negative: subtract the smaller numerator from the larger and put a negative sign in front.\n\n$\\frac{1}{4} - \\frac{2}{3} = \\frac{3}{12} - \\frac{8}{12} = -\\frac{5}{12}$.",
        "分数相减时，先通分。如果减数更大，差就是负数：用较大的分子减去较小的分子，再在前面加上负号。\n\n$\\frac{1}{4} - \\frac{2}{3} = \\frac{3}{12} - \\frac{8}{12} = -\\frac{5}{12}$。",
      ),
      generate(rng) {
        let a: Q, b: Q;
        do {
          a = properQ(rng, 10);
          b = properQ(rng, 10);
        } while (a.cmp(b) >= 0);
        const r = a.sub(b);
        return evaluate({
          expr: `${a.toLatex()} - ${b.toLatex()}`,
          answer: r,
          kind: "fraction",
          wrong: [r.neg(), ...subtractAcross(a, b), a.add(b).neg()],
          solution: t(
            `$${b.toLatex()}$ is larger than $${a.toLatex()}$, so the result is negative: $${a.toLatex()} - ${b.toLatex()} = -\\left(${b.toLatex()} - ${a.toLatex()}\\right) = ${r.toLatex()}$.`,
            `$${b.toLatex()}$ 比 $${a.toLatex()}$ 大，所以结果是负数：$${a.toLatex()} - ${b.toLatex()} = -\\left(${b.toLatex()} - ${a.toLatex()}\\right) = ${r.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "smaller-mixed-number-minus-larger-mixed-number",
      title: t("Whole and mixed numbers", "整数与带分数"),
      explanation: t(
        "When a smaller mixed number has a larger one taken from it, the result is negative. Subtract the smaller mixed number from the larger one, regrouping if needed, and make the answer negative.\n\n$2 - 3\\frac{1}{2} = -\\left(3\\frac{1}{2} - 2\\right) = -1\\frac{1}{2}$, and $1\\frac{1}{4} - 2\\frac{2}{3} = -\\left(2\\frac{8}{12} - 1\\frac{3}{12}\\right) = -1\\frac{5}{12}$.",
        "用较小的带分数减去较大的带分数，结果是负数。先用大的带分数减去小的带分数，必要时借位，再把答案写成负数。\n\n$2 - 3\\frac{1}{2} = -\\left(3\\frac{1}{2} - 2\\right) = -1\\frac{1}{2}$；$1\\frac{1}{4} - 2\\frac{2}{3} = -\\left(2\\frac{8}{12} - 1\\frac{3}{12}\\right) = -1\\frac{5}{12}$。",
      ),
      generate(rng) {
        let a: Q, b: Q;
        do {
          a = rng.bool(0.3) ? Q.of(rng.int(1, 5)) : properQ(rng, 8).add(Q.of(rng.int(0, 4)));
          b = properQ(rng, 8).add(Q.of(rng.int(1, 6)));
        } while (a.cmp(b) >= 0);
        const r = a.sub(b);
        return evaluate({
          expr: `${mixedLatex(a)} - ${mixedLatex(b)}`,
          answer: r,
          kind: "mixed",
          wrong: [r.neg(), a.add(b).neg(), r.sub(Q.one)],
          solution: t(
            `$${mixedLatex(b)}$ is larger, so $${mixedLatex(a)} - ${mixedLatex(b)} = -\\left(${mixedLatex(b)} - ${mixedLatex(a)}\\right) = ${mixedLatex(r)}$.`,
            `$${mixedLatex(b)}$ 更大，所以 $${mixedLatex(a)} - ${mixedLatex(b)} = -\\left(${mixedLatex(b)} - ${mixedLatex(a)}\\right) = ${mixedLatex(r)}$。`,
          ),
        });
      },
    },
  ],
);

/** subtractingAPositiveDecimalFromASmallerDecimal subtracts a larger decimal from a smaller one. */
export const subtractingAPositiveDecimalFromASmallerDecimal = topic(
  "subtracting-a-positive-decimal-from-a-smaller-decimal",
  t("Subtracting a Positive Decimal From a Smaller Decimal", "较小的小数减去较大的小数"),
  t(
    "Line up the decimal points and subtract the smaller decimal from the larger, then make the result negative: 2.3 − 5.75 = −(5.75 − 2.30) = −3.45.",
    "对齐小数点，用较大的小数减去较小的小数，再把结果写成负数：2.3 − 5.75 = −(5.75 − 2.30) = −3.45。",
  ),
  ["subtracting-a-positive-number-from-a-smaller-positive-number", "subtraction-with-unequal-numbers-of-decimals"],
  ["7.NS.A.1", "7.NS.A.1c"],
  [
    {
      id: "smaller-decimal-minus-larger-decimal",
      title: t("Decimals", "小数"),
      explanation: t(
        "When the decimal being subtracted is larger, the difference is negative. Line up the decimal points, subtract the smaller decimal from the larger, and write a negative sign in front of the result.\n\n$2.3 - 5.75 = -(5.75 - 2.30) = -3.45$. Write $2.3$ as $2.30$ so that the place values line up.",
        "减数是较大的小数时，差是负数。把小数点对齐，用大的小数减去小的小数，再在结果前写上负号。\n\n$2.3 - 5.75 = -(5.75 - 2.30) = -3.45$。把 $2.3$ 写成 $2.30$，使数位对齐。",
      ),
      generate(rng) {
        let a: Q, b: Q;
        do {
          a = decQ(rng, 1, 1, 99);
          b = decQ(rng, 2, 101, 1999);
        } while (a.cmp(b) >= 0);
        if (rng.bool(0.4)) [a, b] = [decQ(rng, 2, 1, Number((b.n * 100n) / b.d) - 1), b];
        const r = a.sub(b);
        const misaligned = b.sub(Q.of(a.n, a.d * 10n)).neg();
        return evaluate({
          expr: `${dec(a)} - ${dec(b)}`,
          answer: r,
          kind: "decimal",
          wrong: [r.neg(), a.add(b).neg(), misaligned],
          solution: t(
            `$${dec(b)}$ is larger, so $${dec(a)} - ${dec(b)} = -(${dec(b)} - ${dec(a)}) = ${dec(r)}$.`,
            `$${dec(b)}$ 更大，所以 $${dec(a)} - ${dec(b)} = -(${dec(b)} - ${dec(a)}) = ${dec(r)}$。`,
          ),
        });
      },
    },
    {
      id: "smaller-decimal-minus-larger-decimal-in-context",
      title: t("Decimals in context", "实际情境中的小数"),
      explanation: t(
        "When spending is more than the money available, the balance drops below zero. A negative balance shows how much is owed.\n\nA balance of $\\$12.50$ with a $\\$20.75$ purchase becomes $12.50 - 20.75 = -8.25$ dollars.",
        "花的钱比现有的钱多时，余额会低于零。负的余额表示欠了多少钱。\n\n余额 $\\$12.50$，消费 $\\$20.75$ 后变为 $12.50 - 20.75 = -8.25$ 美元。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const a = decQ(rng, 1, 1, 150);
          const b = decQ(rng, 1, Number(a.mul(Q.of(10)).n) + 1, 300);
          const r = a.sub(b);
          return numberProblem({
            prompt: t(
              `The temperature is $${dec(a)}^{\\circ}\\text{C}$. It falls by $${dec(b)}^{\\circ}\\text{C}$. What is the new temperature, in degrees Celsius?`,
              `气温是 $${dec(a)}^{\\circ}\\text{C}$，下降了 $${dec(b)}^{\\circ}\\text{C}$。现在气温是多少摄氏度？`,
            ),
            answer: r,
            form: "decimal",
            wrong: [r.neg(), a.add(b).neg()],
            solution: t(
              `$${dec(a)} - ${dec(b)} = -(${dec(b)} - ${dec(a)}) = ${dec(r)}$.`,
              `$${dec(a)} - ${dec(b)} = -(${dec(b)} - ${dec(a)}) = ${dec(r)}$。`,
            ),
          });
        }
        let a: number, b: number;
        do {
          a = rng.int(100, 5000);
          b = rng.int(200, 9000);
        } while (a >= b || a % 100 === 0 || b % 100 === 0);
        const [qa, qb] = [Q.of(a, 100), Q.of(b, 100)];
        const r = qa.sub(qb);
        const name = rng.pick(names);
        return numberProblem({
          prompt: t(
            `${name} has $\\$${cents(a)}$ on a transit card and takes a trip that costs $\\$${cents(b)}$. The card allows a negative balance. What is the new balance, in dollars?`,
            `${name} 的交通卡里有 $\\$${cents(a)}$，乘了一次车，车费 $\\$${cents(b)}$。这张卡允许余额为负。现在余额是多少美元？`,
          ),
          answer: r,
          form: "decimal",
          wrong: [r.neg(), qa.add(qb).neg()],
          solution: t(
            `$${cents(a)} - ${cents(b)} = -(${cents(b)} - ${cents(a)}) = ${dec(r)}$.`,
            `$${cents(a)} - ${cents(b)} = -(${cents(b)} - ${cents(a)}) = ${dec(r)}$。`,
          ),
        });
      },
    },
  ],
);

/** signedValue draws a nonzero rational of a kind: an integer, a fraction or mixed number, or a decimal. */
function signedValue(rng: Rng, kind: Kind, sign: 1 | -1 = rng.sign()): Q {
  const v =
    kind === "decimal" ? decQ(rng, rng.int(1, 2), 1, 999) : kind === "mixed" ? properQ(rng, 8).add(Q.of(rng.int(0, 5))) : properQ(rng, 10);
  return sign < 0 ? v.neg() : v;
}

/** rationalKind draws fraction, mixed or decimal. */
const rationalKind = (rng: Rng): Kind => rng.pick(["fraction", "mixed", "decimal"] as const);

/** addingAPositiveNumberToANegativeNumber adds a positive number to a negative one. */
export const addingAPositiveNumberToANegativeNumber = topic(
  "adding-a-positive-number-to-a-negative-number",
  t("Adding a Positive Number to a Negative Number", "负数加正数"),
  t(
    "Adding b moves b units to the right. From −a, the result is negative if b < a and positive if b > a; its size is the difference of the distances: −8 + 3 = −5 and −3 + 8 = 5.",
    "加上 b 就是向右移动 b 个单位。从 −a 出发，若 b < a，结果为负；若 b > a，结果为正；结果的绝对值是两段距离之差：−8 + 3 = −5，−3 + 8 = 5。",
  ),
  ["subtracting-a-positive-number-from-a-negative-number", "absolute-value"],
  ["7.NS.A.1", "7.NS.A.1b"],
  [
    {
      id: "negative-plus-positive-integers",
      title: t("Integers", "整数"),
      explanation: t(
        "Adding a positive number moves right on the number line. Starting from a negative number, the sum stays negative if the move is shorter than the distance to zero, and becomes positive if it is longer.\n\n$-8 + 3$: from $-8$ move $3$ right to $-5$. $-3 + 8$: from $-3$ move $8$ right, past $0$, to $5$.",
        "加上一个正数，就是在数轴上向右移动。从负数出发时，如果移动的距离比到零的距离短，和仍是负数；如果更长，和就是正数。\n\n$-8 + 3$：从 $-8$ 向右移动 $3$ 到 $-5$。$-3 + 8$：从 $-3$ 向右移动 $8$，越过 $0$，到 $5$。",
      ),
      generate(rng) {
        let a: number, b: number;
        do {
          a = rng.int(1, 40);
          b = rng.int(1, 40);
        } while (a === b);
        const r = b - a;
        return evaluate({
          expr: `-${a} + ${b}`,
          answer: Q.of(r),
          kind: "fraction",
          wrong: [Q.of(-r), Q.of(-(a + b)), Q.of(a + b)],
          solution: t(
            `The distances are $${a}$ to the left and $${b}$ to the right. ${b > a ? "The right move is longer, so the result is positive" : "The left distance is larger, so the result is negative"}: $-${a} + ${b} = ${r < 0 ? `-(${a} - ${b})` : `${b} - ${a}`} = ${r}$.`,
            `向左的距离是 $${a}$，向右的距离是 $${b}$。${b > a ? "向右的距离更大，所以结果为正" : "向左的距离更大，所以结果为负"}：$-${a} + ${b} = ${r < 0 ? `-(${a} - ${b})` : `${b} - ${a}`} = ${r}$。`,
          ),
        });
      },
    },
    {
      id: "negative-plus-positive-rationals",
      title: t("Fractions and decimals", "分数与小数"),
      explanation: t(
        "To add numbers with different signs, subtract the smaller absolute value from the larger one. The sum takes the sign of the number with the larger absolute value.\n\n$-2.75 + 1.5 = -(2.75 - 1.5) = -1.25$, and $-\\frac{1}{3} + \\frac{3}{4} = \\frac{3}{4} - \\frac{1}{3} = \\frac{5}{12}$.",
        "符号不同的两个数相加，用较大的绝对值减去较小的绝对值，和的符号与绝对值较大的数相同。\n\n$-2.75 + 1.5 = -(2.75 - 1.5) = -1.25$；$-\\frac{1}{3} + \\frac{3}{4} = \\frac{3}{4} - \\frac{1}{3} = \\frac{5}{12}$。",
      ),
      generate(rng) {
        const kind = rationalKind(rng);
        let a: Q, b: Q;
        do {
          a = signedValue(rng, kind, 1);
          b = signedValue(rng, kind, 1);
        } while (a.eq(b));
        const r = b.sub(a);
        return evaluate({
          expr: `${show(a.neg(), kind)} + ${show(b, kind)}`,
          answer: r,
          kind,
          wrong: [r.neg(), a.add(b).neg(), a.add(b)],
          solution: t(
            `$${show(a.neg(), kind)} + ${show(b, kind)} = ${show(b, kind)} - ${show(a, kind)} = ${show(r, kind)}$.`,
            `$${show(a.neg(), kind)} + ${show(b, kind)} = ${show(b, kind)} - ${show(a, kind)} = ${show(r, kind)}$。`,
          ),
        });
      },
    },
  ],
);

/** addingANegativeNumber adds a negative number to a positive or a negative number. */
export const addingANegativeNumber = topic(
  "adding-a-negative-number",
  t("Adding a Negative Number", "加上一个负数"),
  t(
    "Adding a negative number moves to the left: adding −b is the same as subtracting b. So 5 + (−8) = 5 − 8 = −3, and −4 + (−6) = −4 − 6 = −10.",
    "加上一个负数就是向左移动：加 −b 等于减 b。所以 5 + (−8) = 5 − 8 = −3，−4 + (−6) = −4 − 6 = −10。",
  ),
  ["adding-a-positive-number-to-a-negative-number"],
  ["7.NS.A.1", "7.NS.A.1b", "7.NS.A.1d"],
  [
    {
      id: "positive-plus-negative",
      title: t("A positive number plus a negative number", "正数加负数"),
      explanation: t(
        "Adding a negative number has the same effect as subtracting its absolute value: it moves left on the number line. So rewrite the sum as a subtraction and work it out.\n\n$5 + (-8) = 5 - 8 = -3$ and $9 + (-4) = 9 - 4 = 5$.",
        "加上一个负数，与减去它的绝对值效果相同，都是在数轴上向左移动。所以把加法改写成减法再计算。\n\n$5 + (-8) = 5 - 8 = -3$；$9 + (-4) = 9 - 4 = 5$。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool(0.6) ? "fraction" : "decimal";
        let a: Q, b: Q;
        do {
          a = kind === "fraction" ? Q.of(rng.int(1, 40)) : decQ(rng, 1, 1, 400);
          b = kind === "fraction" ? Q.of(rng.int(1, 40)) : decQ(rng, 1, 1, 400);
        } while (a.eq(b));
        const r = a.sub(b);
        return evaluate({
          expr: `${show(a, kind)} + ${par(b.neg(), kind)}`,
          answer: r,
          kind,
          wrong: [a.add(b), r.neg(), a.add(b).neg()],
          solution: t(
            `Adding $${show(b.neg(), kind)}$ is subtracting $${show(b, kind)}$: $${show(a, kind)} - ${show(b, kind)} = ${show(r, kind)}$.`,
            `加 $${show(b.neg(), kind)}$ 就是减 $${show(b, kind)}$：$${show(a, kind)} - ${show(b, kind)} = ${show(r, kind)}$。`,
          ),
        });
      },
    },
    {
      id: "negative-plus-negative",
      title: t("A negative number plus a negative number", "负数加负数"),
      explanation: t(
        "$-4 + (-6) = -4 - 6 = -10$: both moves are to the left, so the distances add and the sum is negative.",
        "$-4 + (-6) = -4 - 6 = -10$：两次都向左移动，所以距离相加，和为负数。",
      ),
      generate(rng) {
        const kind: Kind = rng.pick(["fraction", "fraction", "decimal", "mixed"] as const);
        const a = kind === "fraction" && rng.bool() ? Q.of(rng.int(1, 40)) : signedValue(rng, kind, 1);
        const b = kind === "fraction" && a.isInteger() ? Q.of(rng.int(1, 40)) : signedValue(rng, kind, 1);
        const r = a.add(b).neg();
        return evaluate({
          expr: `${show(a.neg(), kind)} + ${par(b.neg(), kind)}`,
          answer: r,
          kind,
          wrong: [r.neg(), a.sub(b), b.sub(a)],
          solution: t(
            `$${show(a.neg(), kind)} + ${par(b.neg(), kind)} = ${show(a.neg(), kind)} - ${show(b, kind)} = -\\left(${show(a, kind)} + ${show(b, kind)}\\right) = ${show(r, kind)}$.`,
            `$${show(a.neg(), kind)} + ${par(b.neg(), kind)} = ${show(a.neg(), kind)} - ${show(b, kind)} = -\\left(${show(a, kind)} + ${show(b, kind)}\\right) = ${show(r, kind)}$。`,
          ),
        });
      },
    },
  ],
);

/** subtractingANegativeNumber subtracts a negative number by adding its opposite. */
export const subtractingANegativeNumber = topic(
  "subtracting-a-negative-number",
  t("Subtracting a Negative Number", "减去一个负数"),
  t(
    "Subtracting a number is adding its opposite, so subtracting −b is adding b: 5 − (−3) = 5 + 3 = 8 and −2 − (−7) = −2 + 7 = 5. The difference a − b is also the distance from b to a, with a sign.",
    "减去一个数等于加上它的相反数，所以减 −b 就是加 b：5 − (−3) = 5 + 3 = 8，−2 − (−7) = −2 + 7 = 5。差 a − b 也是从 b 到 a 的带符号的距离。",
  ),
  ["adding-a-negative-number"],
  ["7.NS.A.1", "7.NS.A.1c"],
  [
    {
      id: "subtracting-a-negative-integer",
      title: t("Integers", "整数"),
      explanation: t(
        "Subtracting a negative number is the same as adding its opposite, a positive number. Change the subtraction to addition and the negative number to positive, then add.\n\n$5 - (-3) = 5 + 3 = 8$ and $-9 - (-4) = -9 + 4 = -5$.",
        "减去一个负数，等于加上它的相反数，也就是一个正数。把减法改成加法，把负数改成正数，再相加。\n\n$5 - (-3) = 5 + 3 = 8$；$-9 - (-4) = -9 + 4 = -5$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-30, 30);
        const b = rng.int(1, 30);
        const r = a + b;
        return evaluate({
          expr: `${a} - (-${b})`,
          answer: Q.of(r),
          kind: "fraction",
          wrong: [Q.of(a - b), Q.of(-r), Q.of(-a - b)],
          solution: t(
            `Subtracting $-${b}$ is adding $${b}$: $${a} - (-${b}) = ${a} + ${b} = ${r}$.`,
            `减 $-${b}$ 就是加 $${b}$：$${a} - (-${b}) = ${a} + ${b} = ${r}$。`,
          ),
        });
      },
    },
    {
      id: "subtracting-a-negative-rational",
      title: t("Fractions and decimals", "分数与小数"),
      explanation: t(
        "The rule for subtracting a negative is the same for fractions and decimals: subtracting a negative number means adding its opposite. Rewrite, then add as usual.\n\n$-\\frac{1}{2} - \\left(-\\frac{3}{4}\\right) = -\\frac{1}{2} + \\frac{3}{4} = \\frac{1}{4}$, and $1.2 - (-0.85) = 1.2 + 0.85 = 2.05$.",
        "分数和小数减去负数的规则相同：减去一个负数，就是加上它的相反数。先改写，再照常相加。\n\n$-\\frac{1}{2} - \\left(-\\frac{3}{4}\\right) = -\\frac{1}{2} + \\frac{3}{4} = \\frac{1}{4}$；$1.2 - (-0.85) = 1.2 + 0.85 = 2.05$。",
      ),
      generate(rng) {
        const kind = rationalKind(rng);
        let a: Q, b: Q;
        do {
          a = signedValue(rng, kind);
          b = signedValue(rng, kind, 1);
        } while (a.add(b).isZero());
        const r = a.add(b);
        return evaluate({
          expr: `${show(a, kind)} - ${par(b.neg(), kind)}`,
          answer: r,
          kind,
          wrong: [a.sub(b), r.neg(), a.neg().sub(b)],
          solution: t(
            `Subtracting $${show(b.neg(), kind)}$ is adding $${show(b, kind)}$: $${show(a, kind)} + ${show(b, kind)} = ${show(r, kind)}$.`,
            `减 $${show(b.neg(), kind)}$ 就是加 $${show(b, kind)}$：$${show(a, kind)} + ${show(b, kind)} = ${show(r, kind)}$。`,
          ),
        });
      },
    },
    {
      id: "differences-across-zero",
      title: t("Differences across zero", "跨越零的差"),
      explanation: t(
        "The difference between a positive and a negative value, such as a high and a low temperature, is the higher value minus the lower one. Subtracting the negative adds the two distances from zero.\n\nThe high temperature was $7^{\\circ}\\text{C}$ and the low $-5^{\\circ}\\text{C}$. The high was $7 - (-5) = 12$ degrees warmer.",
        "一个正值与一个负值之差，比如最高气温与最低气温之差，等于较大的值减去较小的值。减去负数相当于把两段到零的距离相加。\n\n最高气温 $7^{\\circ}\\text{C}$，最低气温 $-5^{\\circ}\\text{C}$。最高气温比最低气温高 $7 - (-5) = 12$ 度。",
      ),
      generate(rng) {
        const hi = rng.int(1, 30);
        const lo = rng.int(1, 30);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `One day the high temperature was $${hi}^{\\circ}\\text{C}$ and the low was $-${lo}^{\\circ}\\text{C}$. How many degrees warmer was the high than the low?`,
              `某天最高气温是 $${hi}^{\\circ}\\text{C}$，最低气温是 $-${lo}^{\\circ}\\text{C}$。最高气温比最低气温高多少度？`,
            ),
            answer: hi + lo,
            form: "integer",
            wrong: [hi - lo, lo - hi, -(hi + lo)],
            solution: t(`$${hi} - (-${lo}) = ${hi} + ${lo} = ${hi + lo}$ degrees.`, `$${hi} - (-${lo}) = ${hi} + ${lo} = ${hi + lo}$ 度。`),
          });
        }
        const up = 10 * rng.int(5, 90);
        const down = 10 * rng.int(2, 40);
        return numberProblem({
          prompt: t(
            `A plane flies at $${up}$ meters above sea level, directly above a submarine at $-${down}$ meters. How many meters apart are they?`,
            `一架飞机在海拔 $${up}$ 米处飞行，正下方有一艘潜艇位于海拔 $-${down}$ 米处。它们相距多少米？`,
          ),
          answer: up + down,
          form: "integer",
          wrong: [up - down, down - up, -(up + down)],
          solution: t(
            `$${up} - (-${down}) = ${up} + ${down} = ${up + down}$ meters.`,
            `$${up} - (-${down}) = ${up} + ${down} = ${up + down}$ 米。`,
          ),
        });
      },
    },
  ],
);

/** additiveInversesOfNumbers finds opposites and uses a + (−a) = 0. */
export const additiveInversesOfNumbers = topic(
  "additive-inverses-of-numbers",
  t("Additive Inverses of Numbers", "相反数（加法逆元）"),
  t(
    "The additive inverse of a number is its opposite: the number that adds to it to make 0. The additive inverse of 3/4 is −3/4, and that of −2.5 is 2.5, because −2.5 + 2.5 = 0. In a sum, a number and its inverse cancel.",
    "一个数的加法逆元就是它的相反数，即与它相加得 0 的数。3/4 的相反数是 −3/4，−2.5 的相反数是 2.5，因为 −2.5 + 2.5 = 0。在求和时，一个数与它的相反数可以相互抵消。",
  ),
  ["adding-a-positive-number-to-a-negative-number"],
  ["7.NS.A.1a", "7.NS.A.1b"],
  [
    {
      id: "finding-the-additive-inverse",
      title: t("Finding the additive inverse", "求相反数"),
      explanation: t(
        "The additive inverse of a number, also called its opposite, is the number that adds with it to zero. It has the same absolute value and the opposite sign.\n\nThe additive inverse of $-\\frac{2}{5}$ is $\\frac{2}{5}$, since $-\\frac{2}{5} + \\frac{2}{5} = 0$. It is not the reciprocal $-\\frac{5}{2}$.",
        "一个数的加法逆元，也叫相反数，是与它相加得零的数。它的绝对值与原数相同，符号相反。\n\n$-\\frac{2}{5}$ 的相反数是 $\\frac{2}{5}$，因为 $-\\frac{2}{5} + \\frac{2}{5} = 0$。它不是倒数 $-\\frac{5}{2}$。",
      ),
      generate(rng) {
        const kind = rationalKind(rng);
        const v = rng.bool(0.25) ? Q.of(rng.nonZero(-50, 50)) : signedValue(rng, kind);
        const r = v.neg();
        return numberProblem({
          prompt: t(`What is the additive inverse of $${show(v, kind)}$?`, `$${show(v, kind)}$ 的加法逆元（相反数）是多少？`),
          answer: r,
          ...(formOf(kind) && !v.isInteger() && { form: formOf(kind) }),
          wrong: [v, Q.one.div(v), Q.one.div(v).neg()],
          solution: t(
            `$${show(v, kind)} + ${par(r, kind)} = 0$, so the additive inverse is $${show(r, kind)}$.`,
            `$${show(v, kind)} + ${par(r, kind)} = 0$，所以加法逆元是 $${show(r, kind)}$。`,
          ),
        });
      },
    },
    {
      id: "using-additive-inverses-in-a-sum",
      title: t("Inverses cancel in a sum", "相反数在求和中抵消"),
      explanation: t(
        "A number and its opposite add to zero, so in a sum they cancel each other. Look for opposite pairs first; the order of terms in a sum can be changed freely.\n\nIn $-\\frac{4}{9} + 13 + \\frac{4}{9}$, the terms $-\\frac{4}{9}$ and $\\frac{4}{9}$ add to $0$, so the sum is $13$.",
        "一个数与它的相反数相加得零，所以在加法中它们互相抵消。先找出互为相反数的一对；加法中各项的顺序可以随意调换。\n\n在 $-\\frac{4}{9} + 13 + \\frac{4}{9}$ 中，$-\\frac{4}{9}$ 与 $\\frac{4}{9}$ 相加得 $0$，所以和是 $13$。",
      ),
      generate(rng) {
        const kind = rationalKind(rng);
        const v = signedValue(rng, kind);
        const w = Q.of(rng.nonZero(-40, 40));
        const order = rng.int(0, 2);
        const terms = [show(v, kind), par(w), par(v.neg(), kind)];
        const shown =
          order === 0
            ? [terms[0], terms[1], terms[2]]
            : order === 1
              ? [terms[1], par(v, kind), par(v.neg(), kind)]
              : [show(v, kind), par(v.neg(), kind), par(w)];
        return evaluate({
          expr: shown.join(" + "),
          answer: w,
          kind: "fraction",
          wrong: [w.add(v.mul(Q.of(2))), w.sub(v.mul(Q.of(2))), w.neg()],
          solution: t(
            `$${show(v, kind)}$ and $${show(v.neg(), kind)}$ are additive inverses, so they add to $0$. The sum is $${w.toLatex()}$.`,
            `$${show(v, kind)}$ 与 $${show(v.neg(), kind)}$ 互为相反数，和为 $0$。所以结果是 $${w.toLatex()}$。`,
          ),
        });
      },
    },
  ],
);

/** interpretingAdditiveOppositesAndAdditionUsingAbsoluteValue reads sums and differences as moves and distances. */
export const interpretingAdditiveOppositesAndAdditionUsingAbsoluteValue = topic(
  "interpreting-additive-opposites-and-addition-using-absolute-value",
  t("Interpreting Additive Opposites and Addition Using Absolute Value", "用绝对值理解相反数与加法"),
  t(
    "On a number line, p + q is the point |q| units from p: to the right if q is positive and to the left if q is negative. The distance between two rational numbers p and q is |p − q|.",
    "在数轴上，p + q 是距离 p 为 |q| 个单位的点：q 为正时在 p 的右边，q 为负时在 p 的左边。两个有理数 p 与 q 之间的距离是 |p − q|。",
  ),
  ["adding-a-negative-number", "interpreting-absolute-value"],
  ["7.NS.A.1b", "7.NS.A.1c"],
  [
    {
      id: "locating-a-sum-on-the-number-line",
      title: t("Where is p + q?", "p + q 在哪里？"),
      explanation: t(
        "The sum $p + q$ lies at distance $|q|$ from $p$ on the number line: to the right of $p$ when $q$ is positive and to the left when $q$ is negative.\n\n$3.5 + (-6)$ is $|-6| = 6$ units to the left of $3.5$, at $-2.5$.",
        "在数轴上，和 $p + q$ 与 $p$ 的距离是 $|q|$：$q$ 是正数时在 $p$ 的右边，$q$ 是负数时在 $p$ 的左边。\n\n$3.5 + (-6)$ 在 $3.5$ 左边 $|-6| = 6$ 个单位处，即 $-2.5$。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool() ? "fraction" : "decimal";
        const p = kind === "fraction" ? Q.of(rng.nonZero(-15, 15)) : decQ(rng, 1, 1, 150).mul(Q.of(rng.sign()));
        let q: Q;
        do q = Q.of(rng.nonZero(-15, 15));
        while (q.abs().eq(p.abs()));
        const right = q.sign() > 0;
        const m = q.abs();
        const where = (dist: Q, from: Q, toRight: boolean) =>
          t(
            `$${show(dist, kind)}$ units to the ${toRight ? "right" : "left"} of $${show(from, kind)}$`,
            `在 $${show(from, kind)}$ ${toRight ? "右" : "左"}边 $${show(dist, kind)}$ 个单位处`,
          );
        return pickChoice(
          rng,
          t(`On a number line, where is $${show(p, kind)} + ${par(q)}$?`, `在数轴上，$${show(p, kind)} + ${par(q)}$ 在哪里？`),
          where(m, p, right),
          [where(m, p, !right), where(p.abs(), q, p.sign() > 0 ? !right : right), where(m, p.neg(), right)],
          t(
            `Adding $${q.toLatex()}$ moves $|${q.toLatex()}| = ${m.toLatex()}$ units to the ${right ? "right" : "left"} of $${show(p, kind)}$, to $${show(p.add(q), kind)}$.`,
            `加上 $${q.toLatex()}$ 就是从 $${show(p, kind)}$ 向${right ? "右" : "左"}移动 $|${q.toLatex()}| = ${m.toLatex()}$ 个单位，到达 $${show(p.add(q), kind)}$。`,
          ),
        );
      },
    },
    {
      id: "distance-between-rational-numbers",
      title: t("The distance between two numbers", "两数之间的距离"),
      explanation: t(
        "The distance between two numbers on the number line is the absolute value of their difference. Subtract in either order and take the absolute value; a distance is never negative.\n\nThe distance between $-4.5$ and $2.25$ is $|2.25 - (-4.5)| = |6.75| = 6.75$.",
        "数轴上两个数之间的距离，等于它们之差的绝对值。用哪个数减哪个数都可以，再取绝对值；距离永远不是负数。\n\n$-4.5$ 与 $2.25$ 之间的距离是 $|2.25 - (-4.5)| = |6.75| = 6.75$。",
      ),
      generate(rng) {
        const kind: Kind = rng.pick(["fraction", "mixed", "decimal"] as const);
        let p: Q, q: Q;
        do {
          p = signedValue(rng, kind, -1).sub(Q.of(rng.int(0, 6)));
          q = signedValue(rng, kind, 1).add(Q.of(rng.int(0, 6)));
        } while (p.abs().eq(q.abs()));
        const [x, y] = rng.bool() ? [p, q] : [q, p];
        const d = q.sub(p);
        return numberProblem({
          prompt: t(
            `What is the distance between $${show(x, kind)}$ and $${show(y, kind)}$ on the number line?`,
            `在数轴上，$${show(x, kind)}$ 与 $${show(y, kind)}$ 之间的距离是多少？`,
          ),
          answer: d,
          ...(formOf(kind) && { form: formOf(kind) }),
          wrong: [q.add(p).abs(), q.sub(p).neg(), q.abs().sub(p.abs()).abs()],
          solution: t(
            `Distance $= |${show(q, kind)} - ${par(p, kind)}| = |${show(q, kind)} + ${show(p.neg(), kind)}| = ${show(d, kind)}$.`,
            `距离 $= |${show(q, kind)} - ${par(p, kind)}| = |${show(q, kind)} + ${show(p.neg(), kind)}| = ${show(d, kind)}$。`,
          ),
        });
      },
    },
  ],
);

/** solvingProblemsUsingAdditionAndSubtractionOfRationalNumbers solves word problems with signed sums and differences. */
export const solvingProblemsUsingAdditionAndSubtractionOfRationalNumbers = topic(
  "solving-problems-using-addition-and-subtraction-of-rational-numbers",
  t("Solving Problems Using Addition and Subtraction of Rational Numbers", "用有理数加减法解决问题"),
  t(
    "Write each change as a signed number, a rise or deposit as positive and a fall or withdrawal as negative, then add. To compare two values, subtract: the difference between 8.5 m above sea level and 3.25 m below it is 8.5 − (−3.25) = 11.75 m.",
    "把每次变化写成带符号的数，上升或存入记为正，下降或取出记为负，然后相加。比较两个值就相减：海拔 8.5 米与海拔 −3.25 米之差是 8.5 − (−3.25) = 11.75 米。",
  ),
  ["subtracting-a-negative-number", "interpreting-additive-opposites-and-addition-using-absolute-value"],
  ["7.NS.A.1d", "7.NS.A.3"],
  [
    {
      id: "a-sequence-of-changes",
      title: t("A sequence of changes", "连续的变化"),
      explanation: t(
        "Write each change as a signed number: rises and gains are positive, falls and losses are negative. Starting from the first value, add the changes in order.\n\nAt 6 a.m. it was $-3.5^{\\circ}\\text{C}$. It rose $8.25$ degrees by noon and fell $6.5$ degrees by evening: $-3.5 + 8.25 - 6.5 = -1.75^{\\circ}\\text{C}$.",
        "把每次变化写成带符号的数：上升和增加为正，下降和减少为负。从起始值开始，依次加上各次变化。\n\n早上 6 点气温是 $-3.5^{\\circ}\\text{C}$，到中午上升了 $8.25$ 度，到傍晚又下降了 $6.5$ 度：$-3.5 + 8.25 - 6.5 = -1.75^{\\circ}\\text{C}$。",
      ),
      generate(rng) {
        const start = decQ(rng, 1, 1, 120).neg();
        const up = decQ(rng, 2, 100, 1500);
        const down = decQ(rng, 1, 10, 200);
        const r = start.add(up).sub(down);
        return numberProblem({
          prompt: t(
            `At $6$ a.m. the temperature was $${dec(start)}^{\\circ}\\text{C}$. By noon it had risen $${dec(up)}$ degrees, and by evening it had fallen $${dec(down)}$ degrees from the noon temperature. What was the evening temperature, in degrees Celsius?`,
            `早上 $6$ 点气温是 $${dec(start)}^{\\circ}\\text{C}$。到中午上升了 $${dec(up)}$ 度，到傍晚又比中午下降了 $${dec(down)}$ 度。傍晚气温是多少摄氏度？`,
          ),
          answer: r,
          form: "decimal",
          wrong: [start.neg().add(up).sub(down), start.add(up).add(down), start.sub(up).add(down)],
          solution: t(
            `$${dec(start)} + ${dec(up)} - ${dec(down)} = ${dec(start.add(up))} - ${dec(down)} = ${dec(r)}$.`,
            `$${dec(start)} + ${dec(up)} - ${dec(down)} = ${dec(start.add(up))} - ${dec(down)} = ${dec(r)}$。`,
          ),
        });
      },
    },
    {
      id: "differences-of-signed-quantities",
      title: t("Comparing signed quantities", "比较带符号的量"),
      explanation: t(
        "Give values above a reference level, such as sea level, positive signs and values below it negative signs. The difference between two levels is the higher one minus the lower one.\n\nA hill is $8\\frac{1}{2}$ m above sea level and a cave floor is $3\\frac{1}{4}$ m below it. The difference is $8\\frac{1}{2} - \\left(-3\\frac{1}{4}\\right) = 11\\frac{3}{4}$ m.",
        "在某个基准之上的值，比如高于海平面，记为正；低于基准的值记为负。两个高度之差等于较高的减去较低的。\n\n山丘高出海平面 $8\\frac{1}{2}$ 米，洞底低于海平面 $3\\frac{1}{4}$ 米。高度差是 $8\\frac{1}{2} - \\left(-3\\frac{1}{4}\\right) = 11\\frac{3}{4}$ 米。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool() ? "mixed" : "decimal";
        const a = kind === "mixed" ? properQ(rng, 8).add(Q.of(rng.int(2, 40))) : decQ(rng, 2, 200, 9999);
        const b = kind === "mixed" ? properQ(rng, 8).add(Q.of(rng.int(1, 30))) : decQ(rng, 2, 100, 5000);
        const r = a.add(b);
        // Prices change in cents, so the stock context only takes decimals.
        const ctx = kind === "mixed" || rng.bool();
        return numberProblem({
          prompt: ctx
            ? t(
                `The top of a hill is $${show(a, kind)}$ meters above sea level, and the floor of a nearby cave is $${show(b, kind)}$ meters below sea level. How many meters higher is the top of the hill than the cave floor?`,
                `山顶高出海平面 $${show(a, kind)}$ 米，附近一个洞穴的洞底低于海平面 $${show(b, kind)}$ 米。山顶比洞底高多少米？`,
              )
            : t(
                `On Monday a stock's price rose by $\\$${show(a, kind)}$; on Tuesday it fell by $\\$${show(b, kind)}$. By how many dollars was Monday's change greater than Tuesday's change?`,
                `某只股票周一上涨了 $\\$${show(a, kind)}$，周二下跌了 $\\$${show(b, kind)}$。周一的变化量比周二的变化量大多少美元？`,
              ),
          answer: r,
          ...(formOf(kind) && { form: formOf(kind) }),
          wrong: [a.sub(b), b.sub(a), r.neg()],
          solution: t(
            `Write ${ctx ? "the cave floor" : "Tuesday's change"} as $${show(b.neg(), kind)}$. The difference is $${show(a, kind)} - ${par(b.neg(), kind)} = ${show(a, kind)} + ${show(b, kind)} = ${show(r, kind)}$.`,
            `把${ctx ? "洞底" : "周二的变化"}记为 $${show(b.neg(), kind)}$。差是 $${show(a, kind)} - ${par(b.neg(), kind)} = ${show(a, kind)} + ${show(b, kind)} = ${show(r, kind)}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Multiplication and division of rational numbers

/** smallFactor draws a rational factor of a kind that keeps products easy: a fraction with denominator up to 9, or a decimal with one or two places. */
function smallFactor(rng: Rng, kind: Kind): Q {
  if (kind === "decimal") return rng.bool() ? decQ(rng, 1, 1, 99) : Q.of(rng.int(2, 12));
  if (kind === "mixed") return properQ(rng, 6).add(Q.of(rng.int(1, 3)));
  return rng.bool(0.3) ? Q.of(rng.int(2, 12)) : properQ(rng, 9);
}

/** multiplyingPositiveNumbersWithNegativeNumbers multiplies numbers of opposite signs. */
export const multiplyingPositiveNumbersWithNegativeNumbers = topic(
  "multiplying-positive-numbers-with-negative-numbers",
  t("Multiplying Positive Numbers With Negative Numbers", "正数与负数相乘"),
  t(
    "A product of a positive and a negative number is negative: 3 × (−4) means three groups of −4, which is −12. Multiply the sizes, then make the result negative: (−2/3) × 9/4 = −3/2.",
    "正数与负数的积是负数：3 × (−4) 表示 3 个 −4 相加，等于 −12。先把两数的绝对值相乘，再取负号：(−2/3) × 9/4 = −3/2。",
  ),
  ["adding-a-negative-number", "multiplying-fractions", "multiplying-two-digit-decimals"],
  ["7.NS.A.2a", "7.NS.A.2c"],
  [
    {
      id: "positive-times-negative-integers",
      title: t("Integers", "整数"),
      explanation: t(
        "Multiplying by a positive whole number means repeated addition, and adding several negative numbers gives a negative result. So a positive times a negative is negative, whichever order the factors come in.\n\n$3 \\times (-4) = (-4) + (-4) + (-4) = -12$, and $(-6) \\times 5 = -30$.",
        "乘一个正整数就是重复相加，而几个负数相加结果是负数。所以正数乘负数得负数，与因数的顺序无关。\n\n$3 \\times (-4) = (-4) + (-4) + (-4) = -12$；$(-6) \\times 5 = -30$。",
      ),
      generate(rng) {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const negFirst = rng.bool();
        const [x, y] = negFirst ? [Q.of(-a), Q.of(b)] : [Q.of(a), Q.of(-b)];
        return evaluate({
          expr: `${par(x)} \\times ${par(y)}`,
          answer: Q.of(-a * b),
          kind: "fraction",
          wrong: [Q.of(a * b), Q.of(b - a), Q.of(a - b)],
          solution: t(
            `The factors have opposite signs, so the product is negative: $${a} \\times ${b} = ${a * b}$, giving $${-a * b}$.`,
            `两个因数符号相反，所以积为负数：$${a} \\times ${b} = ${a * b}$，结果是 $${-a * b}$。`,
          ),
        });
      },
    },
    {
      id: "positive-times-negative-rationals",
      title: t("Fractions and decimals", "分数与小数"),
      explanation: t(
        "The sign rule holds for fractions and decimals too: when one factor is positive and the other negative, the product is negative. Multiply the absolute values, then attach the negative sign.\n\n$\\left(-\\frac{2}{3}\\right) \\times \\frac{9}{4} = -\\frac{18}{12} = -\\frac{3}{2}$, and $0.4 \\times (-2.5) = -1$.",
        "分数和小数同样遵守符号法则：一个因数为正、另一个为负时，积为负数。先把绝对值相乘，再加上负号。\n\n$\\left(-\\frac{2}{3}\\right) \\times \\frac{9}{4} = -\\frac{18}{12} = -\\frac{3}{2}$；$0.4 \\times (-2.5) = -1$。",
      ),
      generate(rng) {
        const kind: Kind = rng.pick(["fraction", "decimal", "mixed"] as const);
        let a: Q, b: Q;
        do {
          a = smallFactor(rng, kind);
          b = smallFactor(rng, kind);
        } while (a.isInteger() && b.isInteger());
        const negFirst = rng.bool();
        const [x, y] = negFirst ? [a.neg(), b] : [a, b.neg()];
        const r = x.mul(y);
        return evaluate({
          expr: `${par(x, kind)} \\times ${par(y, kind)}`,
          answer: r,
          kind,
          wrong: [r.neg(), x.add(y), kind === "decimal" ? r.mul(Q.of(10)) : x.div(y)],
          solution: t(
            `The signs are different, so the product is negative: $${show(a, kind)} \\times ${show(b, kind)} = ${show(a.mul(b), kind)}$, giving $${show(r, kind)}$.`,
            `两数符号不同，所以积为负数：$${show(a, kind)} \\times ${show(b, kind)} = ${show(a.mul(b), kind)}$，结果是 $${show(r, kind)}$。`,
          ),
        });
      },
    },
  ],
);

/** multiplyingNegativeNumbers multiplies two or more negative factors. */
export const multiplyingNegativeNumbers = topic(
  "multiplying-negative-numbers",
  t("Multiplying Negative Numbers", "负数相乘"),
  t(
    "The product of two negative numbers is positive: (−3) × (−4) = 12. With several factors, count the negative ones: an even number of negative factors gives a positive product, an odd number a negative product.",
    "两个负数的积是正数：(−3) × (−4) = 12。多个因数相乘时，数一数负因数的个数：偶数个负因数，积为正；奇数个负因数，积为负。",
  ),
  ["multiplying-positive-numbers-with-negative-numbers"],
  ["7.NS.A.2a", "7.NS.A.2c"],
  [
    {
      id: "two-negative-factors",
      title: t("Two negative factors", "两个负因数"),
      explanation: t(
        "The product of two negative numbers is positive. Multiplying by a negative number reverses the sign, so reversing a negative sign makes the result positive. Multiply the absolute values and keep the result positive.\n\n$(-3) \\times (-4) = 12$ and $\\left(-\\frac{1}{2}\\right) \\times \\left(-\\frac{4}{5}\\right) = \\frac{2}{5}$: the product of two negatives is positive.",
        "两个负数的积是正数。乘一个负数会改变符号，而负号再改变一次就变成正的。把绝对值相乘，结果取正。\n\n$(-3) \\times (-4) = 12$；$\\left(-\\frac{1}{2}\\right) \\times \\left(-\\frac{4}{5}\\right) = \\frac{2}{5}$：两个负数的积是正数。",
      ),
      generate(rng) {
        const kind: Kind = rng.pick(["fraction", "fraction", "decimal"] as const);
        const ints = kind === "fraction" && rng.bool();
        const a = ints ? Q.of(rng.int(2, 15)) : smallFactor(rng, kind);
        const b = ints ? Q.of(rng.int(2, 15)) : smallFactor(rng, kind);
        const r = a.mul(b);
        return evaluate({
          expr: `${par(a.neg(), kind)} \\times ${par(b.neg(), kind)}`,
          answer: r,
          kind,
          wrong: [r.neg(), a.add(b).neg(), a.add(b)],
          solution: t(
            `Both factors are negative, so the product is positive: $${show(a, kind)} \\times ${show(b, kind)} = ${show(r, kind)}$.`,
            `两个因数都是负数，所以积为正数：$${show(a, kind)} \\times ${show(b, kind)} = ${show(r, kind)}$。`,
          ),
        });
      },
    },
    {
      id: "several-factors",
      title: t("Several factors", "多个因数"),
      explanation: t(
        "In a product of several numbers, each pair of negative factors gives a positive. Count the negative factors: an even number of them makes the product positive, and an odd number makes it negative.\n\n$(-2) \\times 3 \\times (-1) \\times (-5)$ has three negative factors, an odd number, so it is negative: $-(2 \\times 3 \\times 1 \\times 5) = -30$.",
        "几个数相乘时，每两个负因数相乘得正数。数一数负因数的个数：偶数个时积为正，奇数个时积为负。\n\n$(-2) \\times 3 \\times (-1) \\times (-5)$ 有三个负因数，是奇数个，所以积为负：$-(2 \\times 3 \\times 1 \\times 5) = -30$。",
      ),
      generate(rng) {
        const n = rng.int(3, 4);
        let fs: number[];
        do fs = Array.from({ length: n }, () => rng.nonZero(-6, 6));
        while (fs.filter((f) => f < 0).length < 2 || fs.every((f) => Math.abs(f) === 1));
        const negs = fs.filter((f) => f < 0).length;
        const r = fs.reduce((p, f) => p * f, 1);
        return evaluate({
          expr: fs.map((f) => par(Q.of(f))).join(" \\times "),
          answer: Q.of(r),
          kind: "fraction",
          wrong: [Q.of(-r), Q.of(fs.reduce((p, f) => p + f, 0))],
          solution: t(
            `There ${negs === 1 ? "is" : "are"} $${negs}$ negative factor${negs === 1 ? "" : "s"}, an ${negs % 2 === 0 ? "even" : "odd"} number, so the product is ${negs % 2 === 0 ? "positive" : "negative"}: $${r < 0 ? "-" : ""}(${fs.map((f) => Math.abs(f)).join(" \\times ")}) = ${r}$.`,
            `负因数有 $${negs}$ 个，是${negs % 2 === 0 ? "偶" : "奇"}数个，所以积为${negs % 2 === 0 ? "正" : "负"}：$${r < 0 ? "-" : ""}(${fs.map((f) => Math.abs(f)).join(" \\times ")}) = ${r}$。`,
          ),
        });
      },
    },
  ],
);

/** dividingWithNegativeNumbers divides integers with signs and finds missing factors. */
export const dividingWithNegativeNumbers = topic(
  "dividing-with-negative-numbers",
  t("Dividing With Negative Numbers", "负数的除法"),
  t(
    "Division follows the same sign rules as multiplication, because a ÷ b is the number that multiplies b to give a: −24 ÷ 6 = −4 since 6 × (−4) = −24, and −24 ÷ (−6) = 4 since (−6) × 4 = −24.",
    "除法的符号法则与乘法相同，因为 a ÷ b 就是乘 b 得 a 的那个数：−24 ÷ 6 = −4，因为 6 × (−4) = −24；−24 ÷ (−6) = 4，因为 (−6) × 4 = −24。",
  ),
  ["multiplying-negative-numbers"],
  ["7.NS.A.2b"],
  [
    {
      id: "dividing-signed-integers",
      title: t("Dividing integers", "整数相除"),
      explanation: t(
        "Division follows the same sign rules as multiplication, since it undoes multiplication. If the two numbers have the same sign the quotient is positive; if their signs differ it is negative.\n\n$\\frac{-36}{9} = -4$, $36 \\div (-9) = -4$ and $\\frac{-36}{-9} = 4$.",
        "除法是乘法的逆运算，所以符号法则与乘法相同。两个数同号，商为正；异号，商为负。\n\n$\\frac{-36}{9} = -4$，$36 \\div (-9) = -4$，$\\frac{-36}{-9} = 4$。",
      ),
      generate(rng) {
        const q = rng.int(2, 15);
        const d = rng.int(2, 12);
        const [sa, sb] = rng.pick([
          [-1, 1],
          [1, -1],
          [-1, -1],
        ] as const);
        const a = sa * q * d;
        const b = sb * d;
        const r = a / b;
        const bar = rng.bool();
        return evaluate({
          expr: bar ? `\\frac{${a}}{${b}}` : `${a} \\div ${par(Q.of(b))}`,
          answer: Q.of(r),
          kind: "fraction",
          wrong: [Q.of(-r), Q.of(b, a), Q.of(a * b)],
          solution: t(
            `$${q * d} \\div ${d} = ${q}$. The signs are ${sa === sb ? "the same, so the quotient is positive" : "different, so the quotient is negative"}: $${r}$. Check: $${par(Q.of(b))} \\times ${par(Q.of(r))} = ${a}$.`,
            `$${q * d} \\div ${d} = ${q}$。两数符号${sa === sb ? "相同，所以商为正" : "不同，所以商为负"}：$${r}$。验算：$${par(Q.of(b))} \\times ${par(Q.of(r))} = ${a}$。`,
          ),
        });
      },
    },
    {
      id: "finding-a-missing-factor",
      title: t("Finding a missing factor", "求缺少的因数"),
      explanation: t(
        "A missing factor is found by division: divide the product by the known factor. Then check the sign of the answer with the multiplication rules.\n\n$(-6) \\times \\square = 42$: $\\square = 42 \\div (-6) = -7$.",
        "求未知的因数用除法：用积除以已知的因数。然后用乘法的符号法则检验答案的符号。\n\n$(-6) \\times \\square = 42$：$\\square = 42 \\div (-6) = -7$。",
      ),
      generate(rng) {
        const f = rng.nonZero(-12, 12);
        let m: number;
        do m = rng.nonZero(-12, 12);
        while (f > 0 && m > 0);
        const p = f * m;
        const first = rng.bool();
        const shown = first ? `${par(Q.of(f))} \\times \\square = ${p}` : `\\square \\times ${par(Q.of(f))} = ${p}`;
        return numberProblem({
          prompt: t(`Find the missing number. $$${shown}$$`, `求方框中的数。$$${shown}$$`),
          answer: m,
          form: "integer",
          wrong: [-m, p - f, p + f],
          solution: t(
            `$\\square = ${p} \\div ${par(Q.of(f))} = ${m}$, since $${par(Q.of(f))} \\times ${par(Q.of(m))} = ${p}$.`,
            `$\\square = ${p} \\div ${par(Q.of(f))} = ${m}$，因为 $${par(Q.of(f))} \\times ${par(Q.of(m))} = ${p}$。`,
          ),
        });
      },
    },
  ],
);

/** signedFraction writes ±n/±d with the signs where they were drawn: "\frac{-3}{4}", "\frac{3}{-4}", "-\frac{3}{4}". */
const signedFraction = (n: number, d: number, outside = false) => (outside ? `-\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`);

/** equivalentFractionsWithNegativeNumbers moves the sign of a fraction between numerator, denominator and front. */
export const equivalentFractionsWithNegativeNumbers = topic(
  "equivalent-fractions-with-negative-numbers",
  t("Equivalent Fractions With Negative Numbers", "含负数的等值分数"),
  t(
    "A fraction is a quotient, so its sign follows the division rules: −(p/q) = (−p)/q = p/(−q), while (−p)/(−q) = p/q. A negative fraction can be simplified like any other: 15/(−20) = −3/4.",
    "分数是一个商，所以它的符号遵循除法法则：−(p/q) = (−p)/q = p/(−q)，而 (−p)/(−q) = p/q。负分数也可以像其他分数一样约分：15/(−20) = −3/4。",
  ),
  ["dividing-with-negative-numbers"],
  ["7.NS.A.2b"],
  [
    {
      id: "where-the-negative-sign-goes",
      title: t("Where the negative sign goes", "负号的位置"),
      explanation: t(
        "A fraction is a division, so one negative sign makes it negative wherever it is placed: in front, in the numerator or in the denominator. Two negative signs cancel and make the fraction positive.\n\n$-\\frac{3}{4} = \\frac{-3}{4} = \\frac{3}{-4}$, but $\\frac{-3}{-4} = \\frac{3}{4}$.",
        "分数表示除法，所以只有一个负号时，不论它写在分数前面、分子上还是分母上，分数都是负的。两个负号互相抵消，分数为正。\n\n$-\\frac{3}{4} = \\frac{-3}{4} = \\frac{3}{-4}$，但 $\\frac{-3}{-4} = \\frac{3}{4}$。",
      ),
      generate(rng) {
        let p: number, q: number;
        do {
          p = rng.int(1, 12);
          q = rng.int(2, 13);
        } while (gcd(p, q) !== 1 || p === q);
        const form = rng.int(0, 2);
        const target = form === 0 ? signedFraction(p, q, true) : form === 1 ? signedFraction(-p, q) : signedFraction(p, -q);
        const equal = [signedFraction(p, q, true), signedFraction(-p, q), signedFraction(p, -q)].filter((s) => s !== target);
        const correct = mathText(rng.pick(equal));
        return pickChoice(
          rng,
          t(`Which fraction is equal to $${target}$?`, `哪个分数等于 $${target}$？`),
          correct,
          [
            mathText(signedFraction(-p, -q)),
            mathText(signedFraction(p, q)),
            mathText(signedFraction(-q, p)),
            mathText(signedFraction(q, -p)),
          ],
          t(
            `A fraction with one negative sign, in front, in the numerator or in the denominator, is negative: $-\\frac{${p}}{${q}} = \\frac{-${p}}{${q}} = \\frac{${p}}{-${q}}$. With two negative signs in the fraction, $\\frac{-${p}}{-${q}} = \\frac{${p}}{${q}}$, it is positive.`,
            `只有一个负号的分数（负号在前面、分子或分母中）是负数：$-\\frac{${p}}{${q}} = \\frac{-${p}}{${q}} = \\frac{${p}}{-${q}}$。分子分母都有负号时，$\\frac{-${p}}{-${q}} = \\frac{${p}}{${q}}$，是正数。`,
          ),
        );
      },
    },
    {
      id: "simplifying-fractions-with-negative-signs",
      title: t("Simplifying", "约分"),
      explanation: t(
        "To simplify a fraction with negative signs, first decide the sign of the whole fraction, then simplify the absolute values by dividing by their greatest common factor.\n\n$\\frac{15}{-20} = -\\frac{15}{20} = -\\frac{3}{4}$ and $\\frac{-12}{-18} = \\frac{12}{18} = \\frac{2}{3}$.",
        "化简带负号的分数时，先确定整个分数的符号，再用分子分母绝对值的最大公因数去约分。\n\n$\\frac{15}{-20} = -\\frac{15}{20} = -\\frac{3}{4}$；$\\frac{-12}{-18} = \\frac{12}{18} = \\frac{2}{3}$。",
      ),
      generate(rng) {
        let p: number, q: number;
        do {
          p = rng.int(1, 9);
          q = rng.int(2, 10);
        } while (gcd(p, q) !== 1 || p === q);
        const k = rng.int(2, 8);
        const [sn, sd] = rng.pick([
          [-1, 1],
          [1, -1],
          [-1, -1],
        ] as const);
        const r = Q.of(sn * sd * p, q);
        return numberProblem({
          prompt: t(
            `Write $\\frac{${sn * p * k}}{${sd * q * k}}$ as a fraction in simplest form.`,
            `把 $\\frac{${sn * p * k}}{${sd * q * k}}$ 化成最简分数。`,
          ),
          answer: r,
          form: "fraction",
          wrong: [r.neg(), Q.of(sn * sd * q, p)],
          solution: t(
            `The fraction has ${sn * sd < 0 ? "one negative sign, so it is negative" : "two negative signs, so it is positive"}. Divide the numerator and denominator by $${k}$: $${r.toLatex()}$.`,
            `分数中有${sn * sd < 0 ? "一个负号，所以是负数" : "两个负号，所以是正数"}。分子分母同除以 $${k}$：$${r.toLatex()}$。`,
          ),
        });
      },
    },
  ],
);

/** dividingWithNegativeDecimalsAndFractions divides signed fractions, mixed numbers and decimals. */
export const dividingWithNegativeDecimalsAndFractions = topic(
  "dividing-with-negative-decimals-and-fractions",
  t("Dividing With Negative Decimals and Fractions", "负小数与负分数的除法"),
  t(
    "Divide the sizes as usual, multiplying by the reciprocal for fractions, then apply the sign rule: −2/3 ÷ 4/5 = −2/3 × 5/4 = −5/6, and −4.8 ÷ (−0.6) = 8.",
    "像往常一样计算绝对值的商，分数除法就乘除数的倒数，再按符号法则确定符号：−2/3 ÷ 4/5 = −2/3 × 5/4 = −5/6；−4.8 ÷ (−0.6) = 8。",
  ),
  ["dividing-with-negative-numbers", "dividing-fractions", "dividing-decimals-using-the-standard-algorithm"],
  ["7.NS.A.2b", "7.NS.A.2c"],
  [
    {
      id: "dividing-signed-fractions",
      title: t("Fractions and mixed numbers", "分数与带分数"),
      explanation: t(
        "To divide by a fraction, multiply by its reciprocal. Decide the sign with the usual rule, same signs positive and different signs negative, then simplify.\n\n$-\\frac{2}{3} \\div \\frac{4}{5} = -\\frac{2}{3} \\times \\frac{5}{4} = -\\frac{10}{12} = -\\frac{5}{6}$.",
        "除以一个分数，等于乘它的倒数。按通常的法则确定符号，同号为正、异号为负，再化简。\n\n$-\\frac{2}{3} \\div \\frac{4}{5} = -\\frac{2}{3} \\times \\frac{5}{4} = -\\frac{10}{12} = -\\frac{5}{6}$。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool(0.7) ? "fraction" : "mixed";
        let a: Q, b: Q;
        do {
          a = smallFactor(rng, kind);
          b = smallFactor(rng, kind);
        } while (a.eq(b) || (a.isInteger() && b.isInteger()));
        const [sa, sb] = rng.pick([
          [-1, 1],
          [1, -1],
          [-1, -1],
        ] as const);
        const [x, y] = [a.mul(Q.of(sa)), b.mul(Q.of(sb))];
        const r = x.div(y);
        return evaluate({
          expr: `${show(x, kind)} \\div ${par(y, kind)}`,
          answer: r,
          kind: "fraction",
          wrong: [r.neg(), x.mul(y), y.div(x)],
          solution: t(
            `Multiply by the reciprocal: $${a.toLatex()} \\times ${Q.one.div(b).toLatex()} = ${a.div(b).toLatex()}$. The signs are ${sa === sb ? "the same, so the quotient is positive" : "different, so the quotient is negative"}: $${r.toLatex()}$.`,
            `乘除数的倒数：$${a.toLatex()} \\times ${Q.one.div(b).toLatex()} = ${a.div(b).toLatex()}$。两数符号${sa === sb ? "相同，所以商为正" : "不同，所以商为负"}：$${r.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "dividing-signed-decimals",
      title: t("Decimals", "小数"),
      explanation: t(
        "To divide decimals, multiply both numbers by the same power of ten until the divisor is a whole number. The sign of the quotient follows the same rule as for integers.\n\n$-4.8 \\div 0.6 = -48 \\div 6 = -8$: multiplying both numbers by $10$ does not change the quotient.",
        "小数相除时，把两个数同时乘以 $10$ 的同一个幂，直到除数变成整数。商的符号与整数除法的法则相同。\n\n$-4.8 \\div 0.6 = -48 \\div 6 = -8$：把两个数都乘 $10$，商不变。",
      ),
      generate(rng) {
        const d = decQ(rng, 1, 2, 30);
        const q = rng.bool() ? Q.of(rng.int(2, 15)) : decQ(rng, 1, 2, 60);
        const [sa, sb] = rng.pick([
          [-1, 1],
          [1, -1],
          [-1, -1],
        ] as const);
        const a = q.mul(d).mul(Q.of(sa));
        const b = d.mul(Q.of(sb));
        const r = a.div(b);
        return evaluate({
          expr: `${dec(a)} \\div ${par(b, "decimal")}`,
          answer: r,
          kind: "decimal",
          wrong: [r.neg(), r.mul(Q.of(10)), r.div(Q.of(10))],
          solution: t(
            `Multiply both numbers by $10$: $${dec(a.mul(Q.of(10)))} \\div ${par(b.mul(Q.of(10)), "decimal")}$. The size of the quotient is $${dec(q)}$, and the signs are ${sa === sb ? "the same, so it is positive" : "different, so it is negative"}: $${dec(r)}$.`,
            `把两个数都乘 $10$：$${dec(a.mul(Q.of(10)))} \\div ${par(b.mul(Q.of(10)), "decimal")}$。商的绝对值是 $${dec(q)}$，两数符号${sa === sb ? "相同，所以商为正" : "不同，所以商为负"}：$${dec(r)}$。`,
          ),
        });
      },
    },
  ],
);

/** reciprocalDecimals are decimals whose reciprocals are simple. */
const reciprocalDecimals = [
  "0.25",
  "0.2",
  "0.5",
  "1.25",
  "2.5",
  "0.4",
  "0.125",
  "0.8",
  "0.75",
  "0.05",
  "0.1",
  "1.5",
  "0.6",
  "2.25",
  "0.04",
  "0.02",
];

/** flipFractionPart is the mistake of flipping only the fraction part of a mixed number: −2 1/3 → −(2 + 3) = −5. */
function flipFractionPart(v: Q): Q {
  const a = v.abs();
  const whole = Q.of(a.n / a.d);
  const flipped = whole.add(Q.one.div(a.sub(whole)));
  return v.sign() < 0 ? flipped.neg() : flipped;
}

/** reciprocalsOfRationalNumbers finds reciprocals of negative fractions, mixed numbers and decimals. */
export const reciprocalsOfRationalNumbers = topic(
  "reciprocals-of-rational-numbers",
  t("Reciprocals of Rational Numbers", "有理数的倒数"),
  t(
    "The reciprocal of a nonzero number is the number that multiplies it to give 1. A number and its reciprocal have the same sign: the reciprocal of −2 1/3 = −7/3 is −3/7, and that of −0.25 = −1/4 is −4. Zero has no reciprocal.",
    "一个非零数的倒数是与它相乘得 1 的数。一个数与它的倒数符号相同：−2 1/3 = −7/3 的倒数是 −3/7，−0.25 = −1/4 的倒数是 −4。0 没有倒数。",
  ),
  ["reciprocals", "multiplying-negative-numbers"],
  ["7.NS.A.2b", "7.NS.A.2c"],
  [
    {
      id: "reciprocals-of-negative-fractions-and-mixed-numbers",
      title: t("Fractions and mixed numbers", "分数与带分数"),
      explanation: t(
        "The reciprocal of a number is the number that multiplies with it to $1$. Write a mixed number as an improper fraction and flip it. A negative number has a negative reciprocal, because the product must be positive.\n\n$-2\\frac{1}{3} = -\\frac{7}{3}$, so its reciprocal is $-\\frac{3}{7}$: $\\left(-\\frac{7}{3}\\right) \\times \\left(-\\frac{3}{7}\\right) = 1$. The sign stays negative.",
        "一个数的倒数是与它相乘得 $1$ 的数。先把带分数化成假分数，再把分子分母颠倒。负数的倒数也是负数，因为两数之积必须是正数。\n\n$-2\\frac{1}{3} = -\\frac{7}{3}$，所以它的倒数是 $-\\frac{3}{7}$：$\\left(-\\frac{7}{3}\\right) \\times \\left(-\\frac{3}{7}\\right) = 1$。符号仍为负。",
      ),
      generate(rng) {
        const kind: Kind = rng.pick(["fraction", "mixed", "fraction"] as const);
        const base = kind === "mixed" ? properQ(rng, 9).add(Q.of(rng.int(1, 5))) : rng.bool(0.2) ? Q.of(rng.int(2, 20)) : properQ(rng, 12);
        const v = rng.bool(0.75) ? base.neg() : base;
        const r = Q.one.div(v);
        const improper = kind === "mixed" ? ` = ${v.toLatex()}` : "";
        return numberProblem({
          prompt: t(`What is the reciprocal of $${show(v, kind)}$?`, `$${show(v, kind)}$ 的倒数是多少？`),
          answer: r,
          wrong: [r.neg(), v.neg(), ...(kind === "mixed" ? [flipFractionPart(v)] : [])],
          solution: improper
            ? t(
                `$${show(v, kind)}${improper}$, so its reciprocal is $${r.toLatex()}$: $${par(v)} \\times ${par(r)} = 1$.`,
                `$${show(v, kind)}${improper}$，所以它的倒数是 $${r.toLatex()}$：$${par(v)} \\times ${par(r)} = 1$。`,
              )
            : t(
                `Swap the numerator and denominator and keep the sign: the reciprocal is $${r.toLatex()}$, since $${par(v)} \\times ${par(r)} = 1$.`,
                `交换分子与分母，符号不变：倒数是 $${r.toLatex()}$，因为 $${par(v)} \\times ${par(r)} = 1$。`,
              ),
        });
      },
    },
    {
      id: "reciprocals-of-decimals",
      title: t("Decimals", "小数"),
      explanation: t(
        "To find the reciprocal of a decimal, first write the decimal as a fraction in simplest form. Then flip the fraction and keep the sign.\n\n$-0.25 = -\\frac{1}{4}$, so its reciprocal is $-4$. $1.25 = \\frac{5}{4}$, so its reciprocal is $\\frac{4}{5} = 0.8$.",
        "求小数的倒数，先把小数化成最简分数，再把分子分母颠倒，符号不变。\n\n$-0.25 = -\\frac{1}{4}$，所以它的倒数是 $-4$。$1.25 = \\frac{5}{4}$，所以它的倒数是 $\\frac{4}{5} = 0.8$。",
      ),
      generate(rng) {
        const s = rng.pick(reciprocalDecimals);
        const [w, f = ""] = s.split(".");
        const v0 = Q.of(Number(w) * 10 ** f.length + Number(f), 10 ** f.length);
        const v = rng.bool(0.7) ? v0.neg() : v0;
        const r = Q.one.div(v);
        return numberProblem({
          prompt: t(`What is the reciprocal of $${dec(v)}$?`, `$${dec(v)}$ 的倒数是多少？`),
          answer: r,
          wrong: [r.neg(), v.neg(), v],
          solution: t(
            `$${dec(v)} = ${v.toLatex()}$, so its reciprocal is $${r.toLatex()}${r.d !== 1n && isTerminating(r) ? ` = ${dec(r)}` : ""}$.`,
            `$${dec(v)} = ${v.toLatex()}$，所以它的倒数是 $${r.toLatex()}${r.d !== 1n && isTerminating(r) ? ` = ${dec(r)}` : ""}$。`,
          ),
        });
      },
    },
  ],
);

/** undefinedText is the option for a quotient with divisor 0. */
const undefinedText = t("Not defined", "无意义");

/** zeroOptions are the choices for a value that may be 0, a, −a or undefined. */
const zeroOptions = (a: Q, kind: Kind): Text[] => [mathText("0"), mathText(show(a, kind)), mathText(show(a.neg(), kind)), undefinedText];

/** multiplyingAndDividingWithZero evaluates products and quotients with zero and recognizes division by zero. */
export const multiplyingAndDividingWithZero = topic(
  "multiplying-and-dividing-with-zero",
  t("Multiplying and Dividing With Zero", "与零相乘和相除"),
  t(
    "Any number times 0 is 0, and 0 divided by any nonzero number is 0: (−5) × 0 = 0 and 0 ÷ (−5) = 0. Dividing by 0 is not defined: no number times 0 gives −5, so −5 ÷ 0 has no value.",
    "任何数乘 0 都得 0，0 除以任何非零数都得 0：(−5) × 0 = 0，0 ÷ (−5) = 0。除以 0 没有意义：没有哪个数乘 0 得 −5，所以 −5 ÷ 0 没有值。",
  ),
  ["dividing-with-negative-numbers"],
  ["7.NS.A.2b"],
  [
    {
      id: "a-single-operation-with-zero",
      title: t("One operation with zero", "与零的一次运算"),
      explanation: t(
        "Any number times zero is zero, and zero divided by any nonzero number is zero. Dividing by zero is not defined, because no number can be multiplied by zero to give a nonzero result.\n\n$0 \\div (-7) = 0$ because $(-7) \\times 0 = 0$. But $-7 \\div 0$ is not defined, because no number times $0$ equals $-7$.",
        "任何数乘零都得零，零除以任何非零的数也得零。除以零没有意义，因为没有一个数乘零能得到非零的结果。\n\n$0 \\div (-7) = 0$，因为 $(-7) \\times 0 = 0$。但 $-7 \\div 0$ 没有意义，因为没有哪个数乘 $0$ 等于 $-7$。",
      ),
      generate(rng) {
        const kind: Kind = rng.pick(["fraction", "fraction", "decimal"] as const);
        const a = kind === "fraction" && rng.bool() ? Q.of(rng.nonZero(-30, 30)) : signedValue(rng, kind, rng.bool(0.7) ? -1 : 1);
        const shape = rng.int(0, 4);
        const exprs = [
          `${show(a, kind)} \\times 0`,
          `0 \\times ${par(a, kind)}`,
          `0 \\div ${par(a, kind)}`,
          `${show(a, kind)} \\div 0`,
          `\\frac{0}{${show(a, kind)}}`,
        ];
        const undefinedValue = shape === 3;
        const [zero, ...rest] = zeroOptions(a, kind);
        const options = [...rng.shuffle([zero!, ...rest.slice(0, 2)]), undefinedText];
        return choiceProblem({
          prompt: t(`What is the value of $${exprs[shape]}$?`, `$${exprs[shape]}$ 的值是多少？`),
          options,
          correct: undefinedValue ? 3 : options.indexOf(zero!),
          solution: undefinedValue
            ? t(
                `Division by $0$ is not defined: no number times $0$ gives $${show(a, kind)}$.`,
                `除以 $0$ 没有意义：没有哪个数乘 $0$ 得 $${show(a, kind)}$。`,
              )
            : shape <= 1
              ? t(`Any number times $0$ is $0$.`, `任何数乘 $0$ 都得 $0$。`)
              : t(
                  `$0$ divided by a nonzero number is $0$, because $${par(a, kind)} \\times 0 = 0$.`,
                  `$0$ 除以一个非零数得 $0$，因为 $${par(a, kind)} \\times 0 = 0$。`,
                ),
        });
      },
    },
    {
      id: "zero-inside-an-expression",
      title: t("Zero inside an expression", "式子中出现的零"),
      explanation: t(
        "In $\\frac{8}{3 - 3}$ the denominator is $0$, so it is not defined. In $(4 + (-4)) \\times 17$ the first factor is $0$, so the product is $0$.",
        "$\\frac{8}{3 - 3}$ 的分母是 $0$，所以它没有意义。$(4 + (-4)) \\times 17$ 的第一个因数是 $0$，所以积是 $0$。",
      ),
      generate(rng) {
        const b = Q.of(rng.nonZero(-20, 20));
        const c = rng.int(1, 15);
        const z = rng.pick([`${c} - ${c}`, `${c} + (-${c})`, `-${c} + ${c}`]);
        const shape = rng.int(0, 3);
        const expr = [
          `(${z}) \\times ${par(b)}`,
          `\\frac{${b.toLatex()}}{${z}}`,
          `\\frac{${z}}{${b.toLatex()}}`,
          `${par(b)} \\times ${c} \\div ${c}`,
        ][shape]!;
        const correct = shape === 1 ? 3 : shape === 3 ? 1 : 0;
        return choiceProblem({
          prompt: t(`What is the value of $${expr}$?`, `$${expr}$ 的值是多少？`),
          options: zeroOptions(b, "fraction"),
          correct,
          solution:
            shape === 0
              ? t(`$${z} = 0$, and $0 \\times ${par(b)} = 0$.`, `$${z} = 0$，而 $0 \\times ${par(b)} = 0$。`)
              : shape === 1
                ? t(`The denominator is $${z} = 0$, and division by $0$ is not defined.`, `分母 $${z} = 0$，除以 $0$ 没有意义。`)
                : shape === 2
                  ? t(`The numerator is $${z} = 0$, and $0 \\div ${par(b)} = 0$.`, `分子 $${z} = 0$，而 $0 \\div ${par(b)} = 0$。`)
                  : t(
                      `Multiplying by $${c}$ and then dividing by $${c}$ gives back $${b.toLatex()}$.`,
                      `先乘 $${c}$ 再除以 $${c}$，结果还是 $${b.toLatex()}$。`,
                    ),
        });
      },
    },
  ],
);

/** fractionsOfFractions finds a fraction of a fraction by multiplying. */
export const fractionsOfFractions = topic(
  "fractions-of-fractions",
  t("Fractions of Fractions", "分数的几分之几"),
  t(
    "A fraction of a quantity means that fraction times the quantity, so a fraction of a fraction is a product: 2/3 of 3/5 is 2/3 × 3/5 = 2/5. If 3/4 of a class are girls and 2/5 of the girls play soccer, then 2/5 × 3/4 = 3/10 of the class are girls who play soccer.",
    "一个量的几分之几就是用这个分数乘这个量，所以一个分数的几分之几是一个乘积：3/5 的 2/3 是 2/3 × 3/5 = 2/5。如果全班 3/4 是女生，女生中 2/5 踢足球，那么全班的 2/5 × 3/4 = 3/10 是踢足球的女生。",
  ),
  ["multiplying-fractions-word-problems"],
  ["7.NS.A.2a", "7.NS.A.3"],
  [
    {
      id: "a-fraction-of-a-fraction",
      title: t("A fraction of a fraction", "分数的几分之几"),
      explanation: t(
        "Taking a fraction of an amount means multiplying by that fraction. So a fraction of a fraction is their product: multiply the numerators and multiply the denominators, then simplify.\n\n$\\frac{2}{3}$ of $\\frac{3}{5}$ is $\\frac{2}{3} \\times \\frac{3}{5} = \\frac{6}{15} = \\frac{2}{5}$.",
        "求一个量的几分之几，就是乘这个分数。所以一个分数的几分之几是两个分数之积：分子乘分子，分母乘分母，再化简。\n\n$\\frac{3}{5}$ 的 $\\frac{2}{3}$ 是 $\\frac{2}{3} \\times \\frac{3}{5} = \\frac{6}{15} = \\frac{2}{5}$。",
      ),
      generate(rng) {
        let a: Q, b: Q;
        do {
          a = properQ(rng, 9);
          b = properQ(rng, 9);
        } while (a.eq(b));
        const r = a.mul(b);
        return numberProblem({
          prompt: t(`What is $${a.toLatex()}$ of $${b.toLatex()}$?`, `$${b.toLatex()}$ 的 $${a.toLatex()}$ 是多少？`),
          answer: r,
          wrong: [a.add(b), b.div(a), a.div(b)],
          solution: t(
            `"Of" means multiply: $${a.toLatex()} \\times ${b.toLatex()} = ${r.toLatex()}$.`,
            `求一个数的几分之几用乘法：$${a.toLatex()} \\times ${b.toLatex()} = ${r.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "a-fraction-of-a-part-in-context",
      title: t("A fraction of a part", "部分中的几分之几"),
      explanation: t(
        "$\\frac{2}{3}$ of a garden is vegetables, and $\\frac{1}{4}$ of the vegetable part is carrots. Carrots fill $\\frac{1}{4} \\times \\frac{2}{3} = \\frac{1}{6}$ of the garden.",
        "菜园的 $\\frac{2}{3}$ 种蔬菜，蔬菜部分的 $\\frac{1}{4}$ 种胡萝卜。胡萝卜占菜园的 $\\frac{1}{4} \\times \\frac{2}{3} = \\frac{1}{6}$。",
      ),
      generate(rng) {
        const who = rng.pick(names);
        const a = properQ(rng, 8);
        const b = properQ(rng, 8);
        const r = a.mul(b);
        const ctx = rng.int(0, 2);
        const [A, B] = [a.toLatex(), b.toLatex()];
        const prompt =
          ctx === 0
            ? t(
                `$${A}$ of the students in a class are girls, and $${B}$ of the girls play soccer. What fraction of all the students in the class are girls who play soccer?`,
                `某班学生中 $${A}$ 是女生，女生中有 $${B}$ 踢足球。踢足球的女生占全班学生的几分之几？`,
              )
            : ctx === 1
              ? t(
                  `$${A}$ of a garden is planted with vegetables, and $${B}$ of the vegetable part is planted with carrots. What fraction of the whole garden is planted with carrots?`,
                  `菜园的 $${A}$ 种蔬菜，蔬菜部分的 $${B}$ 种胡萝卜。胡萝卜占整个菜园的几分之几？`,
                )
              : t(
                  `$${A}$ of a pizza is left over, and ${who} eats $${B}$ of the leftover part. What fraction of the whole pizza is eaten?`,
                  `一个比萨还剩 $${A}$，${who} 吃了剩下部分的 $${B}$。吃掉的是整个比萨的几分之几？`,
                );
        return numberProblem({
          prompt,
          answer: r,
          wrong: [b, a.add(b), a.sub(b).abs()],
          solution: t(
            `The part is $${B}$ of $${A}$ of the whole: $${B} \\times ${A} = ${r.toLatex()}$.`,
            `所求部分是整体的 $${A}$ 的 $${B}$：$${B} \\times ${A} = ${r.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "a-fraction-of-a-fraction-of-a-quantity",
      title: t("A fraction of a fraction of a quantity", "一个量的几分之几的几分之几"),
      explanation: t(
        "Each fraction of a fraction is another multiplication, so the whole chain becomes one product. Multiply the fractions first, simplifying where you can, then multiply by the quantity.\n\n$\\frac{2}{3}$ of $\\frac{3}{4}$ of $48$ liters is $\\frac{2}{3} \\times \\frac{3}{4} \\times 48 = \\frac{1}{2} \\times 48 = 24$ liters.",
        "每次求几分之几都是一次乘法，所以整串运算就是一个乘积。可以先把分数相乘并约分，再乘这个量。\n\n$48$ 升的 $\\frac{3}{4}$ 的 $\\frac{2}{3}$ 是 $\\frac{2}{3} \\times \\frac{3}{4} \\times 48 = \\frac{1}{2} \\times 48 = 24$ 升。",
      ),
      generate(rng) {
        const a = properQ(rng, 6);
        const b = properQ(rng, 6);
        const ab = a.mul(b);
        const total = Number(ab.d) * rng.int(1, Math.max(2, Math.floor(300 / Number(ab.d))));
        const r = ab.mul(Q.of(total));
        return numberProblem({
          prompt: t(
            `What is $${a.toLatex()}$ of $${b.toLatex()}$ of $${total}$?`,
            `$${total}$ 的 $${b.toLatex()}$ 的 $${a.toLatex()}$ 是多少？`,
          ),
          answer: r,
          wrong: [b.mul(Q.of(total)), a.add(b).mul(Q.of(total)), a.mul(Q.of(total))],
          solution: t(
            `$${a.toLatex()} \\times ${b.toLatex()} \\times ${total} = ${ab.toLatex()} \\times ${total} = ${r.toLatex()}$.`,
            `$${a.toLatex()} \\times ${b.toLatex()} \\times ${total} = ${ab.toLatex()} \\times ${total} = ${r.toLatex()}$。`,
          ),
        });
      },
    },
  ],
);

/** RateSituation is a situation that a product or quotient of signed numbers models. */
interface RateSituation {
  readonly text: Text;
  readonly correct: string;
  readonly wrong: readonly string[];
  readonly why: Text;
}

/** rateSituation draws a situation modeled by n × (−r) or (−d) ÷ n. */
function rateSituation(rng: Rng): RateSituation {
  const n = rng.int(2, 12);
  const r = rng.bool() ? Q.of(rng.int(2, 15)) : decQ(rng, 1, 11, 95);
  const rs = dec(r);
  const kind = rng.int(0, 4);
  const who = rng.pick(names);
  if (kind <= 2) {
    const text = [
      t(
        `A diver descends at a constant rate of $${rs}$ meters per minute for $${n}$ minutes. Which expression gives the change in her elevation, in meters?`,
        `一名潜水员以每分钟 $${rs}$ 米的速度匀速下潜了 $${n}$ 分钟。哪个式子表示她高度的变化量（米）？`,
      ),
      t(
        `The temperature falls by $${rs}$ degrees every hour for $${n}$ hours. Which expression gives the total change in temperature, in degrees?`,
        `气温每小时下降 $${rs}$ 度，持续了 $${n}$ 小时。哪个式子表示气温的总变化量（度）？`,
      ),
      t(
        `${who} withdraws $\\$${rs}$ from a bank account every week for $${n}$ weeks. Which expression gives the change in the account balance, in dollars?`,
        `${who} 连续 $${n}$ 周每周从银行账户取出 $\\$${rs}$。哪个式子表示账户余额的变化量（美元）？`,
      ),
    ][kind]!;
    return {
      text,
      correct: `${n} \\times (-${rs})`,
      wrong: [`${n} + (-${rs})`, `(-${rs}) \\div ${n}`, `${n} \\times ${rs}`, `(-${n}) \\times (-${rs})`],
      why: t(
        `Each ${kind === 0 ? "minute" : kind === 1 ? "hour" : "week"} brings a change of $-${rs}$, and this happens $${n}$ times: $${n} \\times (-${rs})$. The change is negative because the quantity goes down.`,
        `每${kind === 0 ? "分钟" : kind === 1 ? "小时" : "周"}的变化量是 $-${rs}$，共发生 $${n}$ 次：$${n} \\times (-${rs})$。数量在减少，所以变化量是负数。`,
      ),
    };
  }
  const total = dec(r.mul(Q.of(n)));
  const dollars = cents(Number(r.mul(Q.of(n * 100)).n));
  const text =
    kind === 3
      ? t(
          `A submarine's elevation changes by $-${total}$ meters in $${n}$ minutes, at a constant rate. Which expression gives the change in elevation per minute, in meters?`,
          `一艘潜艇的高度在 $${n}$ 分钟内匀速变化了 $-${total}$ 米。哪个式子表示每分钟高度的变化量（米）？`,
        )
      : t(
          `A stock loses $\\$${dollars}$ in value over $${n}$ days, losing the same amount each day. Which expression gives the change in its value per day, in dollars?`,
          `某只股票在 $${n}$ 天内价值共下跌了 $\\$${dollars}$，每天跌得一样多。哪个式子表示每天价值的变化量（美元）？`,
        );
  return {
    text,
    correct: `(-${total}) \\div ${n}`,
    wrong: [`${n} \\div (-${total})`, `(-${total}) \\times ${n}`, `${total} \\div ${n}`, `(-${total}) - ${n}`],
    why: t(
      `The total change $-${total}$ is shared equally among $${n}$ ${kind === 3 ? "minutes" : "days"}: $(-${total}) \\div ${n}$.`,
      `总变化量 $-${total}$ 平均分到 $${n}$ ${kind === 3 ? "分钟" : "天"}：$(-${total}) \\div ${n}$。`,
    ),
  };
}

/** interpretingProductsAndQuotientsOfRationalNumbers models situations with signed products and quotients and predicts signs. */
export const interpretingProductsAndQuotientsOfRationalNumbers = topic(
  "interpreting-products-and-quotients-of-rational-numbers",
  t("Interpreting Products and Quotients of Rational Numbers", "理解有理数的乘积与商"),
  t(
    "A repeated loss is a product with a negative factor: losing \\$4.50 a week for 6 weeks is 6 × (−4.50). A total change shared equally is a quotient: a drop of 18 degrees over 6 hours is (−18) ÷ 6 per hour. The sign of a product or quotient depends only on how many negative numbers it has.",
    "重复的减少可以用含负因数的乘积表示：连续 6 周每周减少 \\$4.50 是 6 × (−4.50)。平均分配总变化量用商表示：6 小时下降 18 度，每小时是 (−18) ÷ 6。乘积或商的符号只取决于其中负数的个数。",
  ),
  ["dividing-with-negative-numbers"],
  ["7.NS.A.2a", "7.NS.A.2b"],
  [
    {
      id: "choosing-the-expression-for-a-situation",
      title: t("Choosing the expression", "选择式子"),
      explanation: t(
        "A repeated change is a product: the number of times times the signed change each time. Sharing a total change equally is a quotient: the signed total divided by the number of parts.\n\nA diver descends $4.5$ meters per minute for $6$ minutes: the change is $6 \\times (-4.5)$. A stock loses $\\$18$ over $6$ days: the change per day is $(-18) \\div 6$.",
        "重复发生的变化用乘法表示：次数乘每次带符号的变化量。把总变化平均分开用除法表示：带符号的总量除以份数。\n\n潜水员每分钟下潜 $4.5$ 米，持续 $6$ 分钟：变化量是 $6 \\times (-4.5)$。某只股票 $6$ 天下跌 $\\$18$：每天的变化量是 $(-18) \\div 6$。",
      ),
      generate(rng) {
        const s = rateSituation(rng);
        return pickChoice(rng, s.text, mathText(s.correct), rng.shuffle(s.wrong.map(mathText)), s.why);
      },
    },
    {
      id: "the-sign-of-a-product-or-quotient",
      title: t("The sign of a product or quotient", "积或商的符号"),
      explanation: t(
        "For a mix of multiplications and divisions, the sign depends only on how many negative numbers there are. An even count gives a positive value and an odd count gives a negative value.\n\n$(-3.2) \\times 5 \\div (-0.4) \\times (-7)$ has three negative numbers, an odd number, so its value is negative.",
        "乘除混合运算的符号只取决于负数的个数。偶数个时值为正，奇数个时值为负。\n\n$(-3.2) \\times 5 \\div (-0.4) \\times (-7)$ 中有三个负数，是奇数个，所以它的值是负数。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        let vs: Q[];
        do vs = Array.from({ length: n }, () => (rng.bool() ? Q.of(rng.nonZero(-20, 20)) : decQ(rng, 1, 1, 99).mul(Q.of(rng.sign()))));
        while (vs.filter((v) => v.sign() < 0).length === 0);
        const ops = Array.from({ length: n - 1 }, () => (rng.bool() ? "\\times" : "\\div"));
        const expr = vs.map((v, i) => (i === 0 ? show(v, "decimal") : `${ops[i - 1]} ${par(v, "decimal")}`)).join(" ");
        const negs = vs.filter((v) => v.sign() < 0).length;
        const positive = negs % 2 === 0;
        return choiceProblem({
          prompt: t(
            `Without calculating it, is the value of $${expr}$ positive or negative?`,
            `不计算，判断 $${expr}$ 的值是正数还是负数。`,
          ),
          options: [t("Positive", "正数"), t("Negative", "负数")],
          correct: positive ? 0 : 1,
          solution: t(
            `There ${negs === 1 ? "is" : "are"} $${negs}$ negative number${negs === 1 ? "" : "s"}, an ${positive ? "even" : "odd"} number, so the value is ${positive ? "positive" : "negative"}.`,
            `其中有 $${negs}$ 个负数，是${positive ? "偶" : "奇"}数个，所以值为${positive ? "正" : "负"}数。`,
          ),
        });
      },
    },
  ],
);

/** Evaluation is an expression with its value and the value a common slip gives. */
interface Evaluation {
  readonly expr: string;
  readonly value: Q;
  readonly slips: readonly Q[];
  readonly work: string;
  /** parens is true when the expression starts with a group in parentheses. */
  readonly parens?: boolean;
}

/** orderSolution names the step that comes first and shows the work. */
const orderSolution = (e: Evaluation): Text =>
  e.parens
    ? t(`Work inside the parentheses first, then divide: $${e.work}$.`, `先算括号里面的，再做除法：$${e.work}$。`)
    : t(`Multiply and divide before adding and subtracting: $${e.work}$.`, `先乘除，后加减：$${e.work}$。`);

/** orderedExpression draws an expression of three or four numbers that needs the order of operations. */
function orderedExpression(rng: Rng, draw: () => Q, kind: Kind): Evaluation {
  const [a, b, c, d] = [draw(), draw(), draw(), draw()];
  const s = (q: Q) => show(q, kind);
  const p = (q: Q) => par(q, kind);
  let form = rng.int(0, 3);
  // A decimal quotient need not terminate; products and differences of decimals always do.
  if (form === 2 && kind === "decimal" && !isTerminating(a.sub(b).div(c))) form = 0;
  switch (form) {
    case 0: {
      const v = a.sub(b.mul(c));
      return {
        expr: `${s(a)} - ${p(b)} \\times ${p(c)}`,
        value: v,
        slips: [a.sub(b).mul(c), a.add(b.mul(c))],
        work: `${s(a)} - ${p(b.mul(c))} = ${s(v)}`,
      };
    }
    case 1: {
      const q = b.mul(c);
      const v = a.add(q.div(c));
      return {
        expr: `${s(a)} + ${p(q)} \\div ${p(c)}`,
        value: v,
        slips: [a.add(q).div(c), a.sub(q.div(c))],
        work: `${s(a)} + ${p(b)} = ${s(v)}`,
      };
    }
    case 2: {
      const v = a.sub(b).div(c);
      return {
        expr: `\\left(${s(a)} - ${p(b)}\\right) \\div ${p(c)}`,
        value: v,
        slips: [a.sub(b.div(c)), a.add(b).div(c)],
        work: `${p(a.sub(b))} \\div ${p(c)} = ${s(v)}`,
        parens: true,
      };
    }
    default: {
      const v = a.mul(b).sub(c.mul(d));
      return {
        expr: `${p(a)} \\times ${p(b)} - ${p(c)} \\times ${p(d)}`,
        value: v,
        slips: [a.mul(b).sub(c).mul(d), a.mul(b).add(c.mul(d))],
        work: `${s(a.mul(b))} - ${p(c.mul(d))} = ${s(v)}`,
      };
    }
  }
}

/** evaluatingRationalNumberExpressionsWithoutExponents applies the order of operations with signed numbers. */
export const evaluatingRationalNumberExpressionsWithoutExponents = topic(
  "evaluating-rational-number-expressions-without-exponents",
  t("Evaluating Rational Number Expressions Without Exponents", "计算不含乘方的有理数式子"),
  t(
    "The order of operations is the same for signed numbers: parentheses first, then multiplication and division from left to right, then addition and subtraction from left to right. Keep track of each sign: 4 − (−3) × 5 = 4 − (−15) = 19.",
    "有理数的运算顺序不变：先算括号，再从左到右算乘除，最后从左到右算加减。注意每一步的符号：4 − (−3) × 5 = 4 − (−15) = 19。",
  ),
  ["dividing-with-negative-numbers", "subtracting-a-negative-number"],
  ["7.NS.A.3", "7.EE.B.3"],
  [
    {
      id: "integer-expressions",
      title: t("Integers", "整数"),
      explanation: t(
        "The order of operations is the same with negative numbers: work inside parentheses first, then multiply and divide from left to right, then add and subtract from left to right. Apply the sign rules at each step.\n\n$4 - (-3) \\times 5$: multiply first, $(-3) \\times 5 = -15$, then $4 - (-15) = 19$. Working left to right instead gives the wrong value $35$.",
        "有负数时运算顺序不变：先算括号内的，再从左到右算乘除，最后从左到右算加减。每一步都要用符号法则。\n\n$4 - (-3) \\times 5$：先算乘法，$(-3) \\times 5 = -15$，再算 $4 - (-15) = 19$。如果从左到右计算，会得到错误的 $35$。",
      ),
      generate(rng) {
        const e = orderedExpression(rng, () => Q.of(rng.nonZero(-9, 9)), "fraction");
        return evaluate({
          expr: e.expr,
          answer: e.value,
          kind: "fraction",
          wrong: [...e.slips, e.value.neg()],
          solution: orderSolution(e),
        });
      },
    },
    {
      id: "fraction-and-decimal-expressions",
      title: t("Fractions and decimals", "分数与小数"),
      explanation: t(
        "Fractions and decimals follow the same order of operations as integers: multiply and divide before adding and subtracting. Keep track of the sign of every intermediate result.\n\n$2.5 - 1.5 \\times (-4) = 2.5 - (-6) = 8.5$, and $-\\frac{1}{2} + \\frac{3}{4} \\times \\left(-\\frac{2}{3}\\right) = -\\frac{1}{2} + \\left(-\\frac{1}{2}\\right) = -1$.",
        "分数和小数的运算顺序与整数相同：先乘除，后加减。注意每个中间结果的符号。\n\n$2.5 - 1.5 \\times (-4) = 2.5 - (-6) = 8.5$；$-\\frac{1}{2} + \\frac{3}{4} \\times \\left(-\\frac{2}{3}\\right) = -\\frac{1}{2} + \\left(-\\frac{1}{2}\\right) = -1$。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool() ? "fraction" : "decimal";
        const draw = () => {
          const v =
            kind === "decimal"
              ? rng.bool()
                ? decQ(rng, 1, 1, 50)
                : Q.of(rng.int(1, 9))
              : rng.bool(0.3)
                ? Q.of(rng.int(1, 6))
                : properQ(rng, 6);
          return rng.bool() ? v.neg() : v;
        };
        let e: Evaluation;
        do e = orderedExpression(rng, draw, kind);
        while (kind === "decimal" && !isTerminating(e.value));
        return evaluate({
          expr: e.expr,
          answer: e.value,
          kind,
          wrong: [...e.slips.filter((x) => kind !== "decimal" || isTerminating(x)), e.value.neg()],
          solution: orderSolution(e),
        });
      },
    },
  ],
);

/** solvingProblemsUsingMultiplicationAndDivisionOfRationalNumbers solves rate problems with signed changes. */
export const solvingProblemsUsingMultiplicationAndDivisionOfRationalNumbers = topic(
  "solving-problems-using-multiplication-and-division-of-rational-numbers",
  t("Solving Problems Using Multiplication and Division of Rational Numbers", "用有理数乘除法解决问题"),
  t(
    "A steady change of r per unit for n units is a total change of n × r; a total change spread evenly over n units is a change of (total) ÷ n per unit; and the number of units needed for a total change is (total) ÷ r. Decreases are negative throughout.",
    "每单位变化 r，共 n 个单位，总变化量是 n × r；总变化量平均分到 n 个单位，每单位变化 (总变化量) ÷ n；达到某个总变化量需要的单位数是 (总变化量) ÷ r。减少量始终记为负数。",
  ),
  ["interpreting-products-and-quotients-of-rational-numbers", "dividing-with-negative-decimals-and-fractions"],
  ["7.NS.A.2a", "7.NS.A.2b", "7.NS.A.3"],
  [
    {
      id: "total-change-at-a-constant-rate",
      title: t("The total change", "总变化量"),
      explanation: t(
        "When something changes by the same amount each time, the total change is the rate times the number of times. A decrease is a negative rate, so the total change is negative.\n\nThe temperature falls $2.5$ degrees per hour for $4$ hours: the change is $4 \\times (-2.5) = -10$ degrees.",
        "当一个量每次变化相同的量时，总变化等于每次的变化量乘次数。减少用负数表示，所以总变化是负数。\n\n气温每小时下降 $2.5$ 度，持续 $4$ 小时：变化量是 $4 \\times (-2.5) = -10$ 度。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const r = decQ(rng, rng.int(1, 2), 11, 450);
        const start = rng.int(-10, 25);
        const askEnd = rng.bool();
        const change = r.mul(Q.of(-n));
        const end = Q.of(start).add(change);
        return numberProblem({
          prompt: askEnd
            ? t(
                `At midnight the temperature is $${start}^{\\circ}\\text{C}$. It falls by $${dec(r)}$ degrees every hour for $${n}$ hours. What is the temperature then, in degrees Celsius?`,
                `午夜气温是 $${start}^{\\circ}\\text{C}$，之后每小时下降 $${dec(r)}$ 度，持续 $${n}$ 小时。那时气温是多少摄氏度？`,
              )
            : t(
                `The water level in a reservoir falls by $${dec(r)}$ centimeters every day for $${n}$ days. What is the total change in the water level, in centimeters? Write a decrease as a negative number.`,
                `水库水位连续 $${n}$ 天每天下降 $${dec(r)}$ 厘米。水位的总变化量是多少厘米？减少用负数表示。`,
              ),
          answer: askEnd ? end : change,
          form: "decimal",
          wrong: askEnd ? [Q.of(start).sub(change), Q.of(start).sub(r), change] : [change.neg(), r.neg(), r.add(Q.of(n)).neg()],
          solution: askEnd
            ? t(
                `The change is $${n} \\times (-${dec(r)}) = ${dec(change)}$, so the temperature is $${start} + ${par(change, "decimal")} = ${dec(end)}^{\\circ}\\text{C}$.`,
                `变化量是 $${n} \\times (-${dec(r)}) = ${dec(change)}$，所以气温是 $${start} + ${par(change, "decimal")} = ${dec(end)}^{\\circ}\\text{C}$。`,
              )
            : t(`$${n} \\times (-${dec(r)}) = ${dec(change)}$ centimeters.`, `$${n} \\times (-${dec(r)}) = ${dec(change)}$ 厘米。`),
        });
      },
    },
    {
      id: "average-change-per-unit",
      title: t("The change per unit", "每单位的变化量"),
      explanation: t(
        "The average change per unit of time is the total change divided by the number of units. A negative total change gives a negative average, meaning a decrease each time on average.\n\nOver $6$ days a stock's price changed by $-\\$13.50$. On average it changed by $(-13.50) \\div 6 = -\\$2.25$ per day.",
        "每单位时间的平均变化等于总变化除以单位数。总变化为负时，平均变化也为负，表示平均每次都在减少。\n\n某只股票 $6$ 天内价格变化了 $-\\$13.50$。平均每天变化 $(-13.50) \\div 6 = -\\$2.25$。",
      ),
      generate(rng) {
        const n = rng.int(2, 10);
        const per = Q.of(rng.int(5, 400), 100).neg();
        const total = per.mul(Q.of(n));
        const what = rng.bool();
        return numberProblem({
          prompt: what
            ? t(
                `Over $${n}$ days, the price of a stock changed by $${dec(total)}$ dollars. What was the average change per day, in dollars?`,
                `$${n}$ 天内，某只股票的价格变化了 $${dec(total)}$ 美元。平均每天变化多少美元？`,
              )
            : t(
                `A hot-air balloon's elevation changed by $${dec(total.mul(Q.of(10)))}$ meters in $${n}$ minutes, at a constant rate. What was the change in elevation per minute, in meters?`,
                `一个热气球的高度在 $${n}$ 分钟内匀速变化了 $${dec(total.mul(Q.of(10)))}$ 米。每分钟高度变化多少米？`,
              ),
          answer: what ? per : per.mul(Q.of(10)),
          form: "decimal",
          wrong: what ? [per.neg(), total.mul(Q.of(n)), Q.of(n).div(total)] : [per.mul(Q.of(-10)), total.mul(Q.of(10 * n))],
          solution: what
            ? t(`$(${dec(total)}) \\div ${n} = ${dec(per)}$ dollars per day.`, `$(${dec(total)}) \\div ${n} = ${dec(per)}$ 美元/天。`)
            : t(
                `$(${dec(total.mul(Q.of(10)))}) \\div ${n} = ${dec(per.mul(Q.of(10)))}$ meters per minute.`,
                `$(${dec(total.mul(Q.of(10)))}) \\div ${n} = ${dec(per.mul(Q.of(10)))}$ 米/分钟。`,
              ),
        });
      },
    },
    {
      id: "time-for-a-total-change",
      title: t("How long does it take?", "需要多长时间？"),
      explanation: t(
        "To find how long a total change takes, divide the total change by the change per unit of time. Both are negative for a decrease, so the time comes out positive.\n\nA pond's water level falls $0.75$ cm per day. A change of $-6$ cm takes $(-6) \\div (-0.75) = 8$ days.",
        "要求总变化需要多长时间，就用总变化除以每单位时间的变化。减少时两者都是负数，所以时间是正数。\n\n池塘水位每天下降 $0.75$ 厘米。水位变化 $-6$ 厘米需要 $(-6) \\div (-0.75) = 8$ 天。",
      ),
      generate(rng) {
        const r = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(3, 4), Q.of(5, 4), Q.of(3, 2), Q.of(5, 2), Q.of(2, 5), Q.of(6, 5), Q.of(8, 5)]);
        const n = rng.int(3, 20);
        const total = r.mul(Q.of(n));
        const diver = rng.bool();
        return numberProblem({
          prompt: diver
            ? t(
                `A diver descends at a constant rate of $${dec(r)}$ meters per second. How many seconds does it take her to change elevation by $-${dec(total)}$ meters?`,
                `一名潜水员以每秒 $${dec(r)}$ 米的速度匀速下潜。她的高度变化 $-${dec(total)}$ 米需要多少秒？`,
              )
            : t(
                `The water level in a pond falls by $${dec(r)}$ centimeters per day. How many days does it take for the level to change by $-${dec(total)}$ centimeters?`,
                `池塘的水位每天下降 $${dec(r)}$ 厘米。水位变化 $-${dec(total)}$ 厘米需要多少天？`,
              ),
          answer: n,
          form: "integer",
          wrong: [-n, total.mul(r), r.div(total)],
          solution: t(
            `Each ${diver ? "second" : "day"} changes the ${diver ? "elevation" : "water level"} by $-${dec(r)}$, so it takes $(-${dec(total)}) \\div (-${dec(r)}) = ${n}$ ${diver ? "seconds" : "days"}.`,
            `每${diver ? "秒" : "天"}变化 $-${dec(r)}$，所以需要 $(-${dec(total)}) \\div (-${dec(r)}) = ${n}$ ${diver ? "秒" : "天"}。`,
          ),
        });
      },
    },
  ],
);

/** solvingProblemsUsingTheFourOperationsOnRationalNumbers combines all four operations in context. */
export const solvingProblemsUsingTheFourOperationsOnRationalNumbers = topic(
  "solving-problems-using-the-four-operations-on-rational-numbers",
  t("Solving Problems Using the Four Operations on Rational Numbers", "用有理数四则运算解决问题"),
  t(
    "Many problems combine operations: a balance of \\$45.80 after three withdrawals of \\$18.25 and a deposit of \\$30 is 45.80 + 3 × (−18.25) + 30 = \\$21.05. The mean of several signed numbers is their sum divided by how many there are.",
    "很多问题要综合运用几种运算：余额 \\$45.80，取款 3 次每次 \\$18.25，再存入 \\$30，结果是 45.80 + 3 × (−18.25) + 30 = \\$21.05。几个带符号的数的平均数是它们的和除以个数。",
  ),
  [
    "solving-problems-using-multiplication-and-division-of-rational-numbers",
    "solving-problems-using-addition-and-subtraction-of-rational-numbers",
  ],
  ["7.NS.A.3", "7.EE.B.3"],
  [
    {
      id: "a-balance-after-several-transactions",
      title: t("A balance after several transactions", "多次收支后的余额"),
      explanation: t(
        "Write deposits as positive numbers and withdrawals as negative numbers. Repeated equal transactions can be multiplied, and everything is then added to the starting balance.\n\n$\\$45.80$, then three withdrawals of $\\$18.25$ and a deposit of $\\$30$: $45.80 + 3 \\times (-18.25) + 30 = 45.80 - 54.75 + 30 = 21.05$ dollars.",
        "把存款写成正数，取款写成负数。重复的相同交易可以用乘法，然后把所有交易都加到起始余额上。\n\n余额 $\\$45.80$，取款三次每次 $\\$18.25$，再存入 $\\$30$：$45.80 + 3 \\times (-18.25) + 30 = 45.80 - 54.75 + 30 = 21.05$ 美元。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const start = rng.int(1000, 9000);
        const n = rng.int(2, 6);
        const w = 5 * rng.int(100, 900);
        const d = 100 * rng.int(5, 80);
        const end = start - n * w + d;
        const q = (c: number) => Q.of(c, 100);
        return numberProblem({
          prompt: t(
            `${name}'s bank account has a balance of $\\$${cents(start)}$. ${name} makes $${n}$ withdrawals of $\\$${cents(w)}$ each and then deposits $\\$${cents(d)}$. What is the balance now, in dollars? Write a negative balance as a negative number.`,
            `${name} 的银行账户余额是 $\\$${cents(start)}$。${name} 取款 $${n}$ 次，每次 $\\$${cents(w)}$，然后存入 $\\$${cents(d)}$。现在余额是多少美元？余额为负时用负数表示。`,
          ),
          answer: q(end),
          form: "decimal",
          wrong: [q(start - w + d), q(start + n * w + d), q(start - n * w - d)],
          solution: t(
            `$${cents(start)} + ${n} \\times (-${cents(w)}) + ${cents(d)} = ${cents(start)} - ${cents(n * w)} + ${cents(d)} = ${dec(q(end))}$.`,
            `$${cents(start)} + ${n} \\times (-${cents(w)}) + ${cents(d)} = ${cents(start)} - ${cents(n * w)} + ${cents(d)} = ${dec(q(end))}$。`,
          ),
        });
      },
    },
    {
      id: "the-mean-of-signed-numbers",
      title: t("The mean of signed numbers", "带符号数的平均数"),
      explanation: t(
        "The mean of a set of numbers is their sum divided by how many there are, and this works for negative numbers too. Add the signed values carefully, then divide.\n\nThe low temperatures on four days were $-6$, $2$, $-3.5$ and $-4.5$ degrees. The mean is $(-6 + 2 - 3.5 - 4.5) \\div 4 = -12 \\div 4 = -3$ degrees.",
        "一组数的平均数等于它们的和除以个数，对负数也一样。仔细把带符号的数相加，再相除。\n\n四天的最低气温分别是 $-6$、$2$、$-3.5$ 和 $-4.5$ 度。平均数是 $(-6 + 2 - 3.5 - 4.5) \\div 4 = -12 \\div 4 = -3$ 度。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        let vs: Q[], mean: Q;
        do {
          vs = Array.from({ length: n }, () => Q.of(rng.int(-30, 12), 2));
          mean = vs.reduce((s, v) => s.add(v), Q.zero).div(Q.of(n));
        } while (!isTerminating(mean) || mean.d > 4n || mean.sign() >= 0 || vs.every((v) => v.isInteger()));
        const sum = vs.reduce((s, v) => s.add(v), Q.zero);
        const absMean = vs.reduce((s, v) => s.add(v.abs()), Q.zero).div(Q.of(n));
        const list = vs.map((v) => dec(v));
        return numberProblem({
          prompt: t(
            `The low temperatures, in degrees Celsius, over $${n}$ days were $${list.join("$, $")}$. What was the mean low temperature?`,
            `连续 $${n}$ 天的最低气温（摄氏度）分别是 $${list.join("$、$")}$。最低气温的平均数是多少？`,
          ),
          answer: mean,
          form: "decimal",
          wrong: [mean.neg(), ...(isTerminating(absMean) ? [absMean] : []), sum],
          solution: t(
            `The sum is $${list.map((v, i) => (i === 0 ? v : v.startsWith("-") ? `- ${v.slice(1)}` : `+ ${v}`)).join(" ")} = ${dec(sum)}$, and $${dec(sum)} \\div ${n} = ${dec(mean)}$.`,
            `和是 $${list.map((v, i) => (i === 0 ? v : v.startsWith("-") ? `- ${v.slice(1)}` : `+ ${v}`)).join(" ")} = ${dec(sum)}$，$${dec(sum)} \\div ${n} = ${dec(mean)}$。`,
          ),
        });
      },
    },
  ],
);

/** solvingMultistepProblemsWithRationalNumbers solves longer problems with fractions, decimals and signs. */
export const solvingMultistepProblemsWithRationalNumbers = topic(
  "solving-multistep-problems-with-rational-numbers",
  t("Solving Multistep Problems With Rational Numbers", "解多步有理数问题"),
  t(
    "Break a long problem into steps, write each quantity with its sign, and keep fractions or decimals exact until the end. A profit is income minus costs; a negative result is a loss.",
    "把复杂的问题分成几步，每个量都带上符号，分数或小数保持精确直到最后。利润等于收入减去成本，结果为负表示亏损。",
  ),
  ["solving-problems-using-the-four-operations-on-rational-numbers", "fractions-of-fractions"],
  ["7.NS.A.3", "7.EE.B.3"],
  [
    {
      id: "multistep-elevation-problems",
      title: t("Elevations with fractions", "含分数的海拔问题"),
      explanation: t(
        "Write the starting position and each movement as a signed number, with up as positive and down as negative. Combine them into one expression and evaluate it with the order of operations.\n\nA diver at $-12\\frac{1}{2}$ m rises $3$ times by $2\\frac{3}{4}$ m and then sinks $5\\frac{1}{4}$ m: $-12\\frac{1}{2} + 3 \\times 2\\frac{3}{4} - 5\\frac{1}{4} = -9\\frac{1}{2}$ m.",
        "把起始位置和每次移动都写成带符号的数，向上为正，向下为负。把它们合成一个算式，按运算顺序计算。\n\n潜水员在 $-12\\frac{1}{2}$ 米处，上升 $3$ 次，每次 $2\\frac{3}{4}$ 米，然后下沉 $5\\frac{1}{4}$ 米：$-12\\frac{1}{2} + 3 \\times 2\\frac{3}{4} - 5\\frac{1}{4} = -9\\frac{1}{2}$ 米。",
      ),
      generate(rng) {
        let start: Q, n: number, up: Q, down: Q, end: Q;
        do {
          start = Q.of(rng.int(20, 160), rng.pick([2, 4])).neg();
          n = rng.int(2, 5);
          up = Q.of(rng.int(5, 40), 4);
          down = Q.of(rng.int(3, 40), 4);
          end = start.add(up.mul(Q.of(n))).sub(down);
        } while (end.sign() >= 0 || start.isInteger() || up.isInteger() || down.isInteger());
        return numberProblem({
          prompt: t(
            `A diver is at an elevation of $${mixedLatex(start)}$ meters, rises $${mixedLatex(up)}$ meters $${n}$ times and then descends $${mixedLatex(down)}$ meters. What is the diver's elevation now, in meters?`,
            `一名潜水员在海拔 $${mixedLatex(start)}$ 米处，上升 $${n}$ 次，每次 $${mixedLatex(up)}$ 米，然后下潜 $${mixedLatex(down)}$ 米。潜水员现在的海拔是多少米？`,
          ),
          answer: end,
          wrong: [
            start.add(up).sub(down),
            start.sub(up.mul(Q.of(n))).add(down),
            start
              .neg()
              .add(up.mul(Q.of(n)))
              .sub(down),
          ],
          solution: t(
            `$${mixedLatex(start)} + ${n} \\times ${mixedLatex(up)} - ${mixedLatex(down)} = ${mixedLatex(start)} + ${mixedLatex(up.mul(Q.of(n)))} - ${mixedLatex(down)} = ${mixedLatex(end)}$ meters.`,
            `$${mixedLatex(start)} + ${n} \\times ${mixedLatex(up)} - ${mixedLatex(down)} = ${mixedLatex(start)} + ${mixedLatex(up.mul(Q.of(n)))} - ${mixedLatex(down)} = ${mixedLatex(end)}$ 米。`,
          ),
        });
      },
    },
    {
      id: "profit-and-loss",
      title: t("Profit and loss", "盈利与亏损"),
      explanation: t(
        "Profit is income minus costs. Write the whole situation as one expression; a negative result means the costs were larger, which is a loss.\n\nA club pays $\\$85.50$ for supplies and sells $24$ cups of lemonade at $\\$1.75$ each, then splits the result among $3$ members: $(24 \\times 1.75 - 85.50) \\div 3 = -14.50$ dollars each, a loss.",
        "利润等于收入减去成本。把整个情境写成一个算式；结果是负数表示成本更高，即亏损。\n\n一个社团花 $\\$85.50$ 买材料，卖出 $24$ 杯柠檬水，每杯 $\\$1.75$，然后由 $3$ 名成员平分结果：每人 $(24 \\times 1.75 - 85.50) \\div 3 = -14.50$ 美元，即亏损。",
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        let price: number, n: number, cost: number;
        // Redraw everything: with an even k and an odd n·price/25, no cost would split evenly.
        do {
          price = 25 * rng.int(3, 12);
          n = rng.int(10, 60);
          cost = 50 * rng.int(10, 120);
        } while ((n * price - cost) % k !== 0 || n * price === cost);
        const share = Q.of(n * price - cost, 100 * k);
        return numberProblem({
          prompt: t(
            `A club spends $\\$${cents(cost)}$ on supplies. It sells ${n} cups of lemonade for $\\$${cents(price)}$ each. The profit is shared equally among ${k} members. How much does each member get, in dollars? Write a loss as a negative number.`,
            `一个社团花 $\\$${cents(cost)}$ 买材料，卖出 ${n} 杯柠檬水，每杯 $\\$${cents(price)}$。利润由 ${k} 名成员平分。每人分得多少美元？亏损用负数表示。`,
          ),
          answer: share,
          form: "decimal",
          wrong: [share.neg(), Q.of(n * price - cost, 100), Q.of(n * price + cost, 100 * k)],
          solution: t(
            `Income: $${n} \\times ${cents(price)} = ${cents(n * price)}$. Profit: $${cents(n * price)} - ${cents(cost)} = ${dec(Q.of(n * price - cost, 100))}$. Each member: $${par(Q.of(n * price - cost, 100), "decimal")} \\div ${k} = ${dec(share)}$.`,
            `收入：$${n} \\times ${cents(price)} = ${cents(n * price)}$。利润：$${cents(n * price)} - ${cents(cost)} = ${dec(Q.of(n * price - cost, 100))}$。每人：$${par(Q.of(n * price - cost, 100), "decimal")} \\div ${k} = ${dec(share)}$。`,
          ),
        });
      },
    },
  ],
);

/** Expansion is the decimal expansion of a positive rational: whole part, digits before the repeating block, and the block. */
interface Expansion {
  readonly whole: bigint;
  readonly pre: string;
  readonly rep: string;
}

/** expansion finds the decimal expansion of a positive rational by long division. */
function expansion(q: Q): Expansion {
  const whole = q.n / q.d;
  let r = q.n % q.d;
  const seen = new Map<bigint, number>();
  let digits = "";
  while (r !== 0n && !seen.has(r)) {
    seen.set(r, digits.length);
    r *= 10n;
    digits += String(r / q.d);
    r %= q.d;
  }
  if (r === 0n) return { whole, pre: digits, rep: "" };
  const at = seen.get(r)!;
  return { whole, pre: digits.slice(0, at), rep: digits.slice(at) };
}

/** expansionLatex writes an expansion with a bar over the repeating block: "0.1\overline{6}". */
const expansionLatex = (e: Expansion, sign = "") =>
  `${sign}${e.whole}${e.pre || e.rep ? "." : ""}${e.pre}${e.rep ? `\\overline{${e.rep}}` : ""}`;

/** repeatingDenominators are denominators whose fractions repeat with short periods. */
const repeatingDenominators = [3, 6, 9, 11, 12, 15, 18, 22, 30, 33, 36, 45];

/** rationalNumbersAsFiniteOrRepeatingDecimals converts fractions to decimals that terminate or repeat. */
export const rationalNumbersAsFiniteOrRepeatingDecimals = topic(
  "rational-numbers-as-finite-or-repeating-decimals",
  t("Rational Numbers as Finite or Repeating Decimals", "有理数是有限小数或无限循环小数"),
  t(
    "Dividing the numerator by the denominator turns any fraction into a decimal that either ends or repeats. In lowest terms, a fraction terminates exactly when its denominator has no prime factors other than 2 and 5: $-\\frac{3}{8} = -0.375$, but $\\frac{5}{6} = 0.8333\\ldots = 0.8\\overline{3}$.",
    "用分子除以分母，任何分数都能化成有限小数或无限循环小数。化成最简分数后，分母只含质因数 2 和 5 时才是有限小数：$-\\frac{3}{8} = -0.375$，而 $\\frac{5}{6} = 0.8333\\ldots = 0.8\\overline{3}$。",
  ),
  ["dividing-with-negative-numbers", "division-of-whole-numbers-with-decimal-quotients"],
  ["7.NS.A.2d"],
  [
    {
      id: "writing-a-fraction-as-a-terminating-decimal",
      title: t("Terminating decimals", "化成有限小数"),
      explanation: t(
        "To write a fraction as a decimal, divide the numerator by the denominator. If the division ends with no remainder, the decimal terminates. A negative fraction gives a negative decimal.\n\n$-\\frac{3}{8} = -(3 \\div 8) = -0.375$. The decimal is not $-3.8$: the fraction bar means division.",
        "把分数化成小数，就用分子除以分母。如果除到没有余数为止，得到的就是有限小数。负分数化成的小数也是负数。\n\n$-\\frac{3}{8} = -(3 \\div 8) = -0.375$。它不是 $-3.8$：分数线表示除法。",
      ),
      generate(rng) {
        const d = rng.pick([4, 8, 16, 20, 25, 40, 50, 80]);
        let n: number;
        do n = rng.int(1, 2 * d);
        while (gcd(n, d) !== 1);
        const sign = rng.bool(0.7) ? -1 : 1;
        const v = Q.of(sign * n, d);
        const digits = String(d).length;
        const misread = Q.of(sign * (n * 10 ** digits + d), 10 ** digits);
        return numberProblem({
          prompt: t(`Write $${v.toLatex()}$ as a decimal.`, `把 $${v.toLatex()}$ 化成小数。`),
          answer: v,
          form: "decimal",
          wrong: [v.neg(), misread, Q.of(sign * d, n).d === 1n ? Q.of(sign * d, n) : Q.of(sign * n, 10 ** digits)],
          solution: t(
            `Divide: $${n} \\div ${d} = ${dec(Q.of(n, d))}$, so $${v.toLatex()} = ${dec(v)}$.`,
            `做除法：$${n} \\div ${d} = ${dec(Q.of(n, d))}$，所以 $${v.toLatex()} = ${dec(v)}$。`,
          ),
        });
      },
    },
    {
      id: "terminating-or-repeating",
      title: t("Terminating or repeating?", "有限还是循环？"),
      explanation: t(
        "$\\frac{9}{12} = \\frac{3}{4}$ has denominator $4 = 2^{2}$, so it terminates: $0.75$. $\\frac{7}{12}$ is in lowest terms and $12 = 2^{2} \\times 3$ has the factor $3$, so it repeats: $0.58\\overline{3}$.",
        "$\\frac{9}{12} = \\frac{3}{4}$，分母 $4 = 2^{2}$，所以是有限小数：$0.75$。$\\frac{7}{12}$ 已是最简分数，$12 = 2^{2} \\times 3$ 含因数 $3$，所以是循环小数：$0.58\\overline{3}$。",
      ),
      generate(rng) {
        const terminates = rng.bool();
        const base = terminates ? rng.pick([2, 4, 5, 8, 10, 20, 25, 40]) : rng.pick([3, 6, 7, 9, 11, 12, 15, 18, 30]);
        let n: number;
        do n = rng.int(1, 3 * base);
        while (gcd(n, base) !== 1);
        const k = terminates ? rng.pick([1, 3, 3, 7, 9]) : rng.pick([1, 1, 2, 5]);
        const sign = rng.bool(0.5) ? "-" : "";
        const [sn, sd] = [n * k, base * k];
        const v = Q.of(n, base);
        const e = expansion(v);
        return choiceProblem({
          prompt: t(
            `Is $${sign}\\frac{${sn}}{${sd}}$ a terminating decimal or a repeating decimal?`,
            `$${sign}\\frac{${sn}}{${sd}}$ 是有限小数还是无限循环小数？`,
          ),
          options: [t("Terminating", "有限小数"), t("Repeating", "无限循环小数")],
          correct: terminates ? 0 : 1,
          solution: t(
            `${k > 1 ? `In lowest terms, $\\frac{${sn}}{${sd}} = \\frac{${n}}{${base}}$. ` : ""}The denominator $${base}$ ${terminates ? "has no prime factors other than 2 and 5, so the decimal terminates" : "has a prime factor other than 2 and 5, so the decimal repeats"}: $${sign}\\frac{${n}}{${base}} = ${expansionLatex(e, sign)}$.`,
            `${k > 1 ? `化成最简分数：$\\frac{${sn}}{${sd}} = \\frac{${n}}{${base}}$。` : ""}分母 $${base}$ ${terminates ? "只含质因数 2 和 5，所以是有限小数" : "含有 2 和 5 以外的质因数，所以是无限循环小数"}：$${sign}\\frac{${n}}{${base}} = ${expansionLatex(e, sign)}$。`,
          ),
        });
      },
    },
    {
      id: "writing-a-repeating-decimal",
      title: t("Writing a repeating decimal", "写出循环小数"),
      explanation: t(
        "When the division never ends, the remainders start to repeat, and so do the digits of the decimal. Write the repeating block once with a bar over it. Digits that come before the repeating block are written without the bar.\n\n$\\frac{5}{11} = 0.454545\\ldots = 0.\\overline{45}$, and $\\frac{1}{6} = 0.1666\\ldots = 0.1\\overline{6}$: the bar covers only the digits that repeat.",
        "如果除法永远除不尽，余数会开始重复，小数的数字也随之重复。把重复的一组数字写一次，并在上面画一条横线。重复部分之前的数字不画横线。\n\n$\\frac{5}{11} = 0.454545\\ldots = 0.\\overline{45}$；$\\frac{1}{6} = 0.1666\\ldots = 0.1\\overline{6}$：循环节上的横线只覆盖重复的数字。",
      ),
      generate(rng) {
        const d = rng.pick(repeatingDenominators);
        let n: number;
        do n = rng.int(1, d - 1);
        while (gcd(n, d) !== 1);
        const sign = rng.bool(0.4) ? "-" : "";
        const e = expansion(Q.of(n, d));
        const all = e.pre + e.rep;
        const wrongs: Expansion[] = [
          e.pre ? { whole: e.whole, pre: "", rep: all } : { whole: e.whole, pre: e.rep.slice(0, -1), rep: e.rep.slice(-1) },
          { whole: e.whole, pre: all, rep: "" },
          { whole: e.whole, pre: all.slice(0, -1), rep: all.slice(-1) + (e.rep.length > 1 ? e.rep[0] : "") },
          { whole: e.whole, pre: all + e.rep, rep: "" },
        ];
        return pickChoice(
          rng,
          t(`Which decimal is equal to $${sign}\\frac{${n}}{${d}}$?`, `哪个小数等于 $${sign}\\frac{${n}}{${d}}$？`),
          mathText(expansionLatex(e, sign)),
          wrongs.map((w) => mathText(expansionLatex(w, sign))),
          t(
            `Divide $${n}$ by $${d}$: $${n} \\div ${d} = ${e.whole}.${all}${e.rep}${e.rep}\\ldots$. The block $${e.rep}$ repeats${e.pre ? ` after $${e.pre}$` : ""}, so $${sign}\\frac{${n}}{${d}} = ${expansionLatex(e, sign)}$.`,
            `用 $${n}$ 除以 $${d}$：$${n} \\div ${d} = ${e.whole}.${all}${e.rep}${e.rep}\\ldots$。${e.pre ? `在 $${e.pre}$ 之后，` : ""}$${e.rep}$ 不断重复，所以 $${sign}\\frac{${n}}{${d}} = ${expansionLatex(e, sign)}$。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Exponents

/** powerBase writes a base for a power, in parentheses when it is negative or a fraction: "\left(-\frac{2}{3}\right)". */
const powerBase = (q: Q, kind: Kind) =>
  q.sign() < 0 || (!q.isInteger() && kind !== "decimal") ? `\\left(${show(q, kind)}\\right)` : show(q, kind);

/** powerProblem asks for b^n, with the typical slips: losing the sign, multiplying by n, and raising only the numerator. */
function powerProblem(b: Q, n: number, kind: Kind): Problem {
  const r = b.pow(n);
  const slips = [r.neg(), b.mul(Q.of(n)), ...(kind === "decimal" ? [r.mul(Q.of(10))] : [Q.of(b.n ** BigInt(n), b.d)])];
  const factors = Array.from({ length: n }, () => powerBase(b, kind)).join(" \\times ");
  const negs = b.sign() < 0 ? n : 0;
  return evaluate({
    expr: `${powerBase(b, kind)}^{${n}}`,
    answer: r,
    kind,
    wrong: slips,
    solution: t(
      `$${powerBase(b, kind)}^{${n}} = ${factors} = ${show(r, kind)}$.${negs > 0 ? ` There are $${n}$ negative factors, an ${n % 2 === 0 ? "even" : "odd"} number, so the result is ${n % 2 === 0 ? "positive" : "negative"}.` : ""}`,
      `$${powerBase(b, kind)}^{${n}} = ${factors} = ${show(r, kind)}$。${negs > 0 ? `有 $${n}$ 个负因数，是${n % 2 === 0 ? "偶" : "奇"}数个，所以结果为${n % 2 === 0 ? "正" : "负"}。` : ""}`,
    ),
  });
}

/** smallBase draws a base for a power: a fraction with a small denominator, or a decimal with one place. */
function smallBase(rng: Rng, kind: Kind, n: number): Q {
  const v =
    kind === "decimal" ? decQ(rng, 1, 1, n === 2 ? 30 : 15) : n === 2 ? properQ(rng, 12).add(Q.of(rng.bool(0.2) ? 1 : 0)) : properQ(rng, 6);
  return rng.bool(0.7) ? v.neg() : v;
}

/** squaringRationalNumbers squares negative numbers, fractions and decimals. */
export const squaringRationalNumbers = topic(
  "squaring-rational-numbers",
  t("Squaring Rational Numbers", "有理数的平方"),
  t(
    "The square of a number is the number times itself, so the square of a negative number is positive: (−3/4)² = 9/16 and (−0.3)² = 0.09. Without parentheses, −0.3² means −(0.3²) = −0.09.",
    "一个数的平方是这个数乘它自己，所以负数的平方是正数：(−3/4)² = 9/16，(−0.3)² = 0.09。没有括号时，−0.3² 表示 −(0.3²) = −0.09。",
  ),
  ["evaluating-exponents-with-fractional-bases", "evaluating-exponents-with-decimal-bases", "multiplying-negative-numbers"],
  ["7.NS.A.2a", "7.NS.A.3"],
  [
    {
      id: "squaring-negative-fractions",
      title: t("Fractions and integers", "分数与整数"),
      explanation: t(
        "Squaring a number means multiplying it by itself. A negative number times itself is positive, so every square is positive or zero. For a fraction, square the numerator and the denominator.\n\n$\\left(-\\frac{3}{4}\\right)^{2} = \\left(-\\frac{3}{4}\\right) \\times \\left(-\\frac{3}{4}\\right) = \\frac{9}{16}$. Square both the numerator and the denominator.",
        "平方就是一个数乘它自己。负数乘负数为正，所以任何数的平方都是正数或零。分数的平方要把分子和分母都平方。\n\n$\\left(-\\frac{3}{4}\\right)^{2} = \\left(-\\frac{3}{4}\\right) \\times \\left(-\\frac{3}{4}\\right) = \\frac{9}{16}$。分子分母都要平方。",
      ),
      generate(rng) {
        const b = rng.bool(0.25) ? Q.of(-rng.int(2, 20)) : smallBase(rng, "fraction", 2);
        return powerProblem(b, 2, "fraction");
      },
    },
    {
      id: "squaring-decimals",
      title: t("Decimals", "小数"),
      explanation: t(
        "To square a decimal, multiply it by itself. The square has twice as many decimal places as the number, because the decimal places of the two factors add.\n\n$(-0.3)^{2} = 0.09$, not $0.9$: tenths times tenths are hundredths.",
        "小数的平方就是它乘它自己。平方的小数位数是原数的两倍，因为两个因数的小数位数要相加。\n\n$(-0.3)^{2} = 0.09$，而不是 $0.9$：十分位乘十分位得百分位。",
      ),
      generate(rng) {
        return powerProblem(smallBase(rng, "decimal", 2), 2, "decimal");
      },
    },
    {
      id: "the-opposite-of-a-square",
      title: t("$-a^{2}$ and $(-a)^{2}$", "$-a^{2}$ 与 $(-a)^{2}$"),
      explanation: t(
        "In $-\\left(\\frac{2}{5}\\right)^{2}$ only $\\frac{2}{5}$ is squared, so it is $-\\frac{4}{25}$; in $\\left(-\\frac{2}{5}\\right)^{2}$ the negative number is squared, giving $\\frac{4}{25}$. Likewise $-6^{2} = -36$.",
        "$-\\left(\\frac{2}{5}\\right)^{2}$ 中只有 $\\frac{2}{5}$ 被平方，所以等于 $-\\frac{4}{25}$；$\\left(-\\frac{2}{5}\\right)^{2}$ 是负数的平方，等于 $\\frac{4}{25}$。同样，$-6^{2} = -36$。",
      ),
      generate(rng) {
        const kind: Kind = rng.pick(["fraction", "decimal", "fraction"] as const);
        const a = kind === "decimal" ? decQ(rng, 1, 1, 30) : rng.bool(0.4) ? Q.of(rng.int(2, 15)) : properQ(rng, 10);
        const inside = rng.bool(0.35);
        const base = inside
          ? `\\left(-${show(a, kind)}\\right)`
          : a.isInteger() || kind === "decimal"
            ? show(a, kind)
            : `\\left(${show(a, kind)}\\right)`;
        const expr = inside ? `${base}^{2}` : `-${base}^{2}`;
        const sq = a.pow(2);
        const r = inside ? sq : sq.neg();
        return evaluate({
          expr,
          answer: r,
          kind,
          wrong: [r.neg(), a.mul(Q.of(inside ? 2 : -2))],
          solution: inside
            ? t(
                `The whole negative number is squared: $${expr} = ${show(a.neg(), kind)} \\times ${par(a.neg(), kind)} = ${show(sq, kind)}$.`,
                `整个负数被平方：$${expr} = ${show(a.neg(), kind)} \\times ${par(a.neg(), kind)} = ${show(sq, kind)}$。`,
              )
            : t(
                `The exponent applies only to $${show(a, kind)}$, and then the result is made negative: $${expr} = -\\left(${show(a, kind)} \\times ${show(a, kind)}\\right) = ${show(r, kind)}$.`,
                `指数只作用于 $${show(a, kind)}$，再取相反数：$${expr} = -\\left(${show(a, kind)} \\times ${show(a, kind)}\\right) = ${show(r, kind)}$。`,
              ),
        });
      },
    },
  ],
);

/** cubingRationalNumbers cubes negative fractions and decimals. */
export const cubingRationalNumbers = topic(
  "cubing-rational-numbers",
  t("Cubing Rational Numbers", "有理数的立方"),
  t(
    "The cube of a number is the number multiplied by itself three times. Three negative factors give a negative product, so the cube of a negative number is negative: (−2/3)³ = −8/27 and (−0.2)³ = −0.008.",
    "一个数的立方是三个这个数相乘。三个负因数的积为负，所以负数的立方是负数：(−2/3)³ = −8/27，(−0.2)³ = −0.008。",
  ),
  ["squaring-rational-numbers"],
  ["7.NS.A.2a", "7.NS.A.3"],
  [
    {
      id: "cubing-fractions",
      title: t("Fractions and integers", "分数与整数"),
      explanation: t(
        "Cubing a number means using it as a factor three times. A negative number cubed stays negative, because three negative factors give a negative product. Cube both the numerator and the denominator.\n\n$\\left(-\\frac{2}{3}\\right)^{3} = \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) = -\\frac{8}{27}$.",
        "立方就是把一个数作为因数连乘三次。负数的立方仍是负数，因为三个负因数相乘积为负。分数的立方要把分子和分母都立方。\n\n$\\left(-\\frac{2}{3}\\right)^{3} = \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{2}{3}\\right) = -\\frac{8}{27}$。",
      ),
      generate(rng) {
        const b = rng.bool(0.2) ? Q.of(-rng.int(2, 10)) : smallBase(rng, "fraction", 3);
        return powerProblem(b, 3, "fraction");
      },
    },
    {
      id: "cubing-decimals",
      title: t("Decimals", "小数"),
      explanation: t(
        "The cube of a decimal has three times as many decimal places as the number. Its sign is the sign of the number itself, since an odd number of negative factors is negative.\n\n$(-0.2)^{3} = -0.008$: three factors of tenths give thousandths, and three negative factors give a negative result.",
        "小数的立方的小数位数是原数的三倍。它的符号与原数相同，因为奇数个负因数相乘积为负。\n\n$(-0.2)^{3} = -0.008$：三个十分位因数相乘得千分位，三个负因数相乘结果为负。",
      ),
      generate(rng) {
        return powerProblem(smallBase(rng, "decimal", 3), 3, "decimal");
      },
    },
  ],
);

/** exponentsWithRationalBases evaluates and compares higher powers of fractions and decimals. */
export const exponentsWithRationalBases = topic(
  "exponents-with-rational-bases",
  t("Exponents With Rational Bases", "底数为有理数的乘方"),
  t(
    "Any positive integer power of a rational number is repeated multiplication: (−1/2)⁵ = −1/32. A negative base gives a positive power for an even exponent and a negative one for an odd exponent. Powers of a number between 0 and 1 get smaller as the exponent grows.",
    "有理数的正整数次幂就是重复相乘：(−1/2)⁵ = −1/32。底数为负时，偶数次幂为正，奇数次幂为负。0 与 1 之间的数，指数越大，幂越小。",
  ),
  ["cubing-rational-numbers"],
  ["7.NS.A.2a", "7.NS.A.3"],
  [
    {
      id: "higher-powers-of-rational-numbers",
      title: t("Higher powers", "高次幂"),
      explanation: t(
        "A power with exponent $n$ multiplies the base by itself $n$ times. A negative base raised to an even power is positive, and raised to an odd power is negative.\n\n$\\left(-\\frac{1}{2}\\right)^{5} = -\\frac{1}{32}$ (five negative factors) and $(-0.1)^{4} = 0.0001$ (four negative factors).",
        "指数为 $n$ 的乘方是把底数连乘 $n$ 次。负数的偶次幂是正数，奇次幂是负数。\n\n$\\left(-\\frac{1}{2}\\right)^{5} = -\\frac{1}{32}$（五个负因数）；$(-0.1)^{4} = 0.0001$（四个负因数）。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const kind: Kind = rng.bool(0.7) ? "fraction" : "decimal";
        const bases =
          kind === "decimal"
            ? [Q.of(1, 10), Q.of(2, 10), Q.of(3, 10), Q.of(5, 10), Q.of(11, 10), Q.of(15, 10)]
            : [Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(3, 2), Q.of(1, 4), Q.of(3, 4), Q.of(2, 5), Q.of(1, 5), Q.of(5, 2), Q.of(1, 10)];
        const b0 = rng.pick(bases.filter((b) => n <= 5 || b.n < 3n));
        const b = rng.bool(0.7) ? b0.neg() : b0;
        return powerProblem(b, n, kind);
      },
    },
    {
      id: "comparing-powers-of-a-fraction",
      title: t("Comparing powers", "比较乘方的大小"),
      explanation: t(
        "$\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$ and $\\left(\\frac{2}{3}\\right)^{3} = \\frac{8}{27}$, and $\\frac{4}{9} = \\frac{12}{27} > \\frac{8}{27}$: multiplying by a number less than $1$ makes a positive number smaller. With a negative base, compare the signs first.",
        "$\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$，$\\left(\\frac{2}{3}\\right)^{3} = \\frac{8}{27}$，而 $\\frac{4}{9} = \\frac{12}{27} > \\frac{8}{27}$：正数乘一个小于 $1$ 的数会变小。底数为负时，先比较符号。",
      ),
      generate(rng) {
        const b0 = rng.pick([Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1, 3), Q.of(3, 5), Q.of(4, 5), Q.of(3, 2), Q.of(5, 4), Q.of(4, 3)]);
        const b = rng.bool(0.4) ? b0.neg() : b0;
        const m = rng.int(2, 3);
        const n = m + rng.int(1, 2);
        const [x, y] = [b.pow(m), b.pow(n)];
        const swap = rng.bool();
        const [l, r, ln, rn] = swap ? [y, x, n, m] : [x, y, m, n];
        const base = powerBase(b, "fraction");
        const rel = l.cmp(r) + 1;
        const sym = ["<", "=", ">"][rel]!;
        return compareProblem(
          `${base}^{${ln}}`,
          `${base}^{${rn}}`,
          rel,
          t(
            `$${base}^{${ln}} = ${l.toLatex()}$ and $${base}^{${rn}} = ${r.toLatex()}$, so $${base}^{${ln}} ${sym} ${base}^{${rn}}$.`,
            `$${base}^{${ln}} = ${l.toLatex()}$，$${base}^{${rn}} = ${r.toLatex()}$，所以 $${base}^{${ln}} ${sym} ${base}^{${rn}}$。`,
          ),
        );
      },
    },
  ],
);

/** evaluatingExpressionsWithPositiveIntegerExponents applies the order of operations with powers of signed numbers. */
export const evaluatingExpressionsWithPositiveIntegerExponents = topic(
  "evaluating-expressions-with-positive-integer-exponents",
  t("Evaluating Expressions With Positive Integer Exponents", "计算含正整数指数的式子"),
  t(
    "Exponents come right after parentheses in the order of operations, before multiplication and division: (−2)³ + 4 × 3² = −8 + 4 × 9 = 28. Remember that −3² = −9 while (−3)² = 9.",
    "在运算顺序中，乘方紧跟在括号之后，先于乘除：(−2)³ + 4 × 3² = −8 + 4 × 9 = 28。注意 −3² = −9，而 (−3)² = 9。",
  ),
  [
    "exponents-with-rational-bases",
    "evaluating-rational-number-expressions-without-exponents",
    "evaluating-whole-number-expressions-containing-exponents",
  ],
  ["7.NS.A.3", "7.EE.B.3"],
  [
    {
      id: "integer-expressions-with-exponents",
      title: t("Integers", "整数"),
      explanation: t(
        "Exponents come before multiplication and division in the order of operations. Evaluate every power first, paying attention to whether the negative sign is inside the parentheses, then multiply and divide, then add and subtract.\n\n$(-2)^{3} + 4 \\times 3^{2} = -8 + 4 \\times 9 = -8 + 36 = 28$, and $10 - 3^{2} \\times (-2) = 10 - 9 \\times (-2) = 28$.",
        "在运算顺序中，乘方先于乘除。先算出每个乘方，注意负号是否在括号里面，再算乘除，最后算加减。\n\n$(-2)^{3} + 4 \\times 3^{2} = -8 + 4 \\times 9 = -8 + 36 = 28$；$10 - 3^{2} \\times (-2) = 10 - 9 \\times (-2) = 28$。",
      ),
      generate(rng) {
        const a = rng.int(2, 5);
        const n = a <= 3 ? rng.int(2, 3) : 2;
        const b = rng.nonZero(-6, 6);
        const c = rng.int(2, 5);
        const d = rng.nonZero(-9, 9);
        const pa = Q.of(-a).pow(n);
        const shape = rng.int(0, 2);
        if (shape === 0) {
          const v = pa.add(Q.of(b * c * c));
          return evaluate({
            expr: `(-${a})^{${n}} + ${par(Q.of(b))} \\times ${c}^{2}`,
            answer: v,
            kind: "fraction",
            wrong: [pa.neg().add(Q.of(b * c * c)), pa.add(Q.of(b * c)).mul(Q.of(c)), pa.add(Q.of(b * c * 2))],
            solution: t(
              `Powers first: $(-${a})^{${n}} = ${pa.toLatex()}$ and $${c}^{2} = ${c * c}$. Then $${pa.toLatex()} + ${par(Q.of(b))} \\times ${c * c} = ${pa.toLatex()} + ${par(Q.of(b * c * c))} = ${v.toLatex()}$.`,
              `先算乘方：$(-${a})^{${n}} = ${pa.toLatex()}$，$${c}^{2} = ${c * c}$。再算 $${pa.toLatex()} + ${par(Q.of(b))} \\times ${c * c} = ${pa.toLatex()} + ${par(Q.of(b * c * c))} = ${v.toLatex()}$。`,
            ),
          });
        }
        if (shape === 1) {
          const v = Q.of(d - a * a);
          return evaluate({
            expr: `-${a}^{2} + ${par(Q.of(d))}`,
            answer: v,
            kind: "fraction",
            wrong: [Q.of(a * a + d), Q.of(-2 * a + d)],
            solution: t(
              `$-${a}^{2} = -(${a} \\times ${a}) = -${a * a}$, so the value is $-${a * a} + ${par(Q.of(d))} = ${v.toLatex()}$.`,
              `$-${a}^{2} = -(${a} \\times ${a}) = -${a * a}$，所以结果是 $-${a * a} + ${par(Q.of(d))} = ${v.toLatex()}$。`,
            ),
          });
        }
        const e = d - b;
        const v = Q.of(e).pow(2).mul(Q.of(-c)).add(Q.of(a));
        return evaluate({
          expr: `${a} - ${c}(${d} - ${par(Q.of(b))})^{2}`,
          answer: v,
          kind: "fraction",
          wrong: [Q.of(a - c).mul(Q.of(e * e)), Q.of(a).sub(Q.of(c * e).pow(2)), Q.of(a).add(Q.of(c * e * e))],
          solution: t(
            `Parentheses first: $${d} - ${par(Q.of(b))} = ${e}$. Then the power: $${par(Q.of(e))}^{2} = ${e * e}$. Then $${a} - ${c} \\times ${e * e} = ${v.toLatex()}$.`,
            `先算括号：$${d} - ${par(Q.of(b))} = ${e}$。再算乘方：$${par(Q.of(e))}^{2} = ${e * e}$。最后 $${a} - ${c} \\times ${e * e} = ${v.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "rational-expressions-with-exponents",
      title: t("Fractions and decimals", "分数与小数"),
      explanation: t(
        "Fractions and decimals use the same order: powers first, then multiplication and division, then addition and subtraction. A negative base in parentheses raised to an even power gives a positive value.\n\n$\\left(-\\frac{1}{2}\\right)^{2} - \\frac{3}{4} = \\frac{1}{4} - \\frac{3}{4} = -\\frac{1}{2}$, and $(-0.5)^{3} \\times 8 = -0.125 \\times 8 = -1$.",
        "分数和小数的运算顺序相同：先乘方，再乘除，最后加减。括号里的负数作底数，偶次幂的值为正。\n\n$\\left(-\\frac{1}{2}\\right)^{2} - \\frac{3}{4} = \\frac{1}{4} - \\frac{3}{4} = -\\frac{1}{2}$；$(-0.5)^{3} \\times 8 = -0.125 \\times 8 = -1$。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool() ? "fraction" : "decimal";
        const b0 =
          kind === "decimal" ? rng.pick([Q.of(1, 2), Q.of(1, 5), Q.of(3, 10), Q.of(1, 10), Q.of(3, 2), Q.of(2, 5)]) : properQ(rng, 6);
        const b = rng.bool(0.7) ? b0.neg() : b0;
        const n = rng.int(2, 3);
        const p = b.pow(n);
        const base = powerBase(b, kind);
        if (rng.bool()) {
          const c = kind === "decimal" ? decQ(rng, 1, 1, 30) : properQ(rng, 8);
          const v = p.sub(c);
          return evaluate({
            expr: `${base}^{${n}} - ${show(c, kind)}`,
            answer: v,
            kind,
            wrong: [p.neg().sub(c), b.mul(Q.of(n)).sub(c), c.sub(p)],
            solution: t(
              `The power first: $${base}^{${n}} = ${show(p, kind)}$. Then $${show(p, kind)} - ${show(c, kind)} = ${show(v, kind)}$.`,
              `先算乘方：$${base}^{${n}} = ${show(p, kind)}$。再算 $${show(p, kind)} - ${show(c, kind)} = ${show(v, kind)}$。`,
            ),
          });
        }
        const m = kind === "decimal" ? Q.of(rng.pick([2, 4, 5, 8, 10, 20])) : Q.of(Number(b.d) ** n).mul(Q.of(rng.int(1, 3)));
        const v = p.mul(m);
        return evaluate({
          expr: `${base}^{${n}} \\times ${show(m, kind)}`,
          answer: v,
          kind,
          wrong: [v.neg(), b.mul(m).pow(n), b.mul(Q.of(n)).mul(m)],
          solution: t(
            `The power first: $${base}^{${n}} = ${show(p, kind)}$. Then $${par(p, kind)} \\times ${show(m, kind)} = ${show(v, kind)}$.`,
            `先算乘方：$${base}^{${n}} = ${show(p, kind)}$。再算 $${par(p, kind)} \\times ${show(m, kind)} = ${show(v, kind)}$。`,
          ),
        });
      },
    },
  ],
);

/** grade7NumberSystemTopics lists the 7th grade topics on operations with rational numbers and exponents. */
export const grade7NumberSystemTopics: readonly TopicDef[] = [
  subtractingAPositiveNumberFromASmallerPositiveNumber,
  subtractingAPositiveNumberFromANegativeNumber,
  subtractingAPositiveFractionFromASmallerFraction,
  subtractingAPositiveDecimalFromASmallerDecimal,
  addingAPositiveNumberToANegativeNumber,
  addingANegativeNumber,
  subtractingANegativeNumber,
  additiveInversesOfNumbers,
  interpretingAdditiveOppositesAndAdditionUsingAbsoluteValue,
  solvingProblemsUsingAdditionAndSubtractionOfRationalNumbers,
  multiplyingPositiveNumbersWithNegativeNumbers,
  multiplyingNegativeNumbers,
  dividingWithNegativeNumbers,
  equivalentFractionsWithNegativeNumbers,
  dividingWithNegativeDecimalsAndFractions,
  reciprocalsOfRationalNumbers,
  multiplyingAndDividingWithZero,
  fractionsOfFractions,
  interpretingProductsAndQuotientsOfRationalNumbers,
  evaluatingRationalNumberExpressionsWithoutExponents,
  solvingProblemsUsingMultiplicationAndDivisionOfRationalNumbers,
  solvingProblemsUsingTheFourOperationsOnRationalNumbers,
  solvingMultistepProblemsWithRationalNumbers,
  rationalNumbersAsFiniteOrRepeatingDecimals,
  squaringRationalNumbers,
  cubingRationalNumbers,
  exponentsWithRationalBases,
  evaluatingExpressionsWithPositiveIntegerExponents,
];
