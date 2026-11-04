import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { table } from "../exam.ts";
import { numberProblem, steps } from "../problems.ts";
import { numberLineFigure } from "./compound-inequalities.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// ACT Math Fundamentals, reasoning in algebra: related conditional statements, common multiples that clear fractions,
// formulas adjusted to a change, quadratic inequalities on number lines, powers written as radicals or in scientific
// notation, quotients that cannot take a value, identities, functions given by tables, logarithm statements and
// geometric sequences. Also two topics several courses share: end behavior of polynomials and the common difference.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** fr writes a reduced fraction in LaTeX. */
const fr = (n: number, d: number) => Q.of(n, d).toLatex();

/** gcd is the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** lcm is the least common multiple of two positive integers. */
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

/** math is a choice option made of one LaTeX expression. */
const math = (s: string): Text => same(`$${s}$`);

// ---------------------------------------------------------------------------
// Conditional statements

/** Claim is a conditional statement "if a thing has p, then it has q" whose converse is false. */
interface Claim {
  readonly thing: Text;
  readonly it: Text;
  readonly p: Text;
  readonly notP: Text;
  readonly q: Text;
  readonly notQ: Text;
}

/** claim builds a Claim from English and Chinese wording, in the order thing, it, p, not p, q, not q. */
const claim = (en: readonly string[], zh: readonly string[]): Claim => {
  const at = (i: number) => t(en[i] as string, zh[i] as string);
  return { thing: at(0), it: at(1), p: at(2), notP: at(3), q: at(4), notQ: at(5) };
};

const claims: readonly Claim[] = [
  claim(
    ["a figure", "it", "is a square", "is not a square", "is a rectangle", "is not a rectangle"],
    ["一个图形", "它", "是正方形", "不是正方形", "是长方形", "不是长方形"],
  ),
  claim(
    ["a whole number", "it", "is a multiple of 6", "is not a multiple of 6", "is even", "is not even"],
    ["一个整数", "它", "是 6 的倍数", "不是 6 的倍数", "是偶数", "不是偶数"],
  ),
  claim(
    ["a whole number", "it", "ends in 0", "does not end in 0", "is a multiple of 5", "is not a multiple of 5"],
    ["一个整数", "它", "个位是 0", "个位不是 0", "是 5 的倍数", "不是 5 的倍数"],
  ),
  claim(
    ["a whole number", "it", "is a multiple of 9", "is not a multiple of 9", "is a multiple of 3", "is not a multiple of 3"],
    ["一个整数", "它", "是 9 的倍数", "不是 9 的倍数", "是 3 的倍数", "不是 3 的倍数"],
  ),
  claim(
    ["a number", "it", "is greater than 10", "is not greater than 10", "is greater than 5", "is not greater than 5"],
    ["一个数", "它", "大于 10", "不大于 10", "大于 5", "不大于 5"],
  ),
  claim(
    ["a triangle", "it", "is equilateral", "is not equilateral", "is isosceles", "is not isosceles"],
    ["一个三角形", "它", "是等边三角形", "不是等边三角形", "是等腰三角形", "不是等腰三角形"],
  ),
  claim(
    ["an animal", "it", "is a robin", "is not a robin", "is a bird", "is not a bird"],
    ["一种动物", "它", "是知更鸟", "不是知更鸟", "是鸟", "不是鸟"],
  ),
  claim(
    ["a city", "it", "is in Texas", "is not in Texas", "is in the United States", "is not in the United States"],
    ["一座城市", "它", "在得克萨斯州", "不在得克萨斯州", "在美国", "不在美国"],
  ),
  claim(
    ["a student", "the student", "is in the band", "is not in the band", "plays an instrument", "does not play an instrument"],
    ["一名学生", "这名学生", "在乐队里", "不在乐队里", "会演奏乐器", "不会演奏乐器"],
  ),
  claim(
    ["a quadrilateral", "it", "is a rhombus", "is not a rhombus", "is a parallelogram", "is not a parallelogram"],
    ["一个四边形", "它", "是菱形", "不是菱形", "是平行四边形", "不是平行四边形"],
  ),
  claim(
    ["a whole number", "it", "is a prime greater than 2", "is not a prime greater than 2", "is odd", "is not odd"],
    ["一个整数", "它", "是大于 2 的质数", "不是大于 2 的质数", "是奇数", "不是奇数"],
  ),
  claim(
    ["a day", "it", "is a Saturday", "is not a Saturday", "falls on a weekend", "does not fall on a weekend"],
    ["某一天", "它", "是星期六", "不是星期六", "在周末", "不在周末"],
  ),
];

/** ifThen writes a conditional statement about the claim's thing. */
const ifThen = (c: Claim, hyp: Text, con: Text): Text =>
  t(
    `If ${c.thing.en} ${hyp.en}, then ${c.it.en} ${con.en}.`,
    `如果${c.thing["zh-CN"]}${hyp["zh-CN"]}，那么${c.it["zh-CN"]}${con["zh-CN"]}。`,
  );

/** formingRelatedConditionalStatements forms the converse, inverse and contrapositive and reasons from them. */
export const formingRelatedConditionalStatements = topic(
  "forming-related-conditional-statements",
  t("Forming Related Conditional Statements", "构造相关的条件命题"),
  t(
    "Form the converse, inverse and contrapositive of a conditional statement, and decide what follows from a true statement and one given fact.",
    "写出条件命题的逆命题、否命题和逆否命题，并判断由一个真命题和一个已知事实能推出什么。",
  ),
  ["conditional-statements"],
  ["HSG.CO.C.9"],
  [
    kp(
      "naming-the-converse-inverse-and-contrapositive",
      t("Naming the related statements", "辨认相关命题"),
      t(
        'From "if $P$, then $Q$", swapping the two parts gives the **converse**, "if $Q$, then $P$". Negating both parts gives the **inverse**, "if not $P$, then not $Q$". Doing both gives the **contrapositive**, "if not $Q$, then not $P$". Work out each one by asking what was swapped and what was negated.',
        "由“如果 $P$，那么 $Q$”，交换两部分得到**逆命题**“如果 $Q$，那么 $P$”。两部分都否定得到**否命题**“如果非 $P$，那么非 $Q$”。既交换又否定得到**逆否命题**“如果非 $Q$，那么非 $P$”。判断时要看交换了什么、否定了什么。",
      ),
      (rng) => {
        const c = rng.pick(claims);
        const converse = ifThen(c, c.q, c.p);
        const inverse = ifThen(c, c.notP, c.notQ);
        const contrapositive = ifThen(c, c.notQ, c.notP);
        const decoy = ifThen(c, c.p, c.notQ);
        const kind = rng.pick([
          {
            name: t("converse", "逆命题"),
            it: converse,
            how: t("swaps the two parts", "交换两部分"),
            rest: [inverse, contrapositive, decoy],
          },
          {
            name: t("inverse", "否命题"),
            it: inverse,
            how: t("negates both parts", "否定两部分"),
            rest: [converse, contrapositive, decoy],
          },
          {
            name: t("contrapositive", "逆否命题"),
            it: contrapositive,
            how: t("swaps the two parts and negates both", "交换两部分并都否定"),
            rest: [converse, inverse, decoy],
          },
        ]);
        const given = ifThen(c, c.p, c.q);
        return pickChoice(
          rng,
          t(
            `Statement: "${given.en}" Which statement is its ${kind.name.en}?`,
            `命题：“${given["zh-CN"]}”下面哪一个是它的${kind.name["zh-CN"]}？`,
          ),
          kind.it,
          kind.rest,
          t(
            `The ${kind.name.en} ${kind.how.en}, so it reads: ${kind.it.en}`,
            `${kind.name["zh-CN"]}要${kind.how["zh-CN"]}，所以它是：${kind.it["zh-CN"]}`,
          ),
        );
      },
    ),
    kp(
      "what-follows-from-a-true-conditional",
      t("What follows from a true conditional", "由真命题能推出什么"),
      t(
        "A true conditional always agrees with its contrapositive, but not with its converse or inverse. So knowing $P$ gives $Q$, and knowing not $Q$ gives not $P$. Knowing $Q$ or knowing not $P$ settles nothing, because the statement says nothing about those cases.",
        "真命题总与它的逆否命题同真，但不一定与逆命题、否命题同真。所以已知 $P$ 可得 $Q$，已知非 $Q$ 可得非 $P$。已知 $Q$ 或已知非 $P$ 则什么也推不出，因为原命题没有谈到这些情况。",
      ),
      (rng) => {
        const c = rng.pick(claims);
        const n = rng.pick(["T", "K", "M", "R", "W"]);
        const says = (x: Text): Text => t(`${n} ${x.en}.`, `${n} ${x["zh-CN"]}。`);
        const unknown = (x: Text): Text => t(`It cannot be determined whether ${n} ${x.en}.`, `无法确定 ${n} 是否满足“${x["zh-CN"]}”。`);
        const cases = [
          {
            fact: c.p,
            correct: says(c.q),
            wrong: [says(c.notQ), unknown(c.q), says(c.notP)],
            why: t("the hypothesis holds, so the conclusion must hold", "假设成立，所以结论一定成立"),
          },
          {
            fact: c.notQ,
            correct: says(c.notP),
            wrong: [says(c.p), unknown(c.p), says(c.q)],
            why: t("this is the contrapositive of the statement, which is equally true", "这是原命题的逆否命题，同样为真"),
          },
          {
            fact: c.q,
            correct: unknown(c.p),
            wrong: [says(c.p), says(c.notP), says(c.notQ)],
            why: t(
              "the statement does not say that only such things have this property, so its converse may be false",
              "原命题并没有说只有这类对象才有这一性质，所以它的逆命题可能是假的",
            ),
          },
          {
            fact: c.notP,
            correct: unknown(c.q),
            wrong: [says(c.q), says(c.notQ), says(c.p)],
            why: t(
              "the statement says nothing about things that fail its hypothesis, so its inverse may be false",
              "原命题没有谈到不满足假设的对象，所以它的否命题可能是假的",
            ),
          },
        ];
        const k = rng.pick(cases);
        const given = ifThen(c, c.p, c.q);
        return pickChoice(
          rng,
          t(
            `Suppose this statement is true: "${given.en}" ${c.thing.en[0]?.toUpperCase()}${c.thing.en.slice(1)} named ${n} ${k.fact.en}. What can be concluded?`,
            `假设这个命题为真：“${given["zh-CN"]}”${c.thing["zh-CN"]}记作 ${n}，${n} ${k.fact["zh-CN"]}。可以得出什么结论？`,
          ),
          k.correct,
          k.wrong,
          t(`Because ${k.why.en}: ${k.correct.en}`, `因为${k.why["zh-CN"]}：${k.correct["zh-CN"]}`),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Common multiples

/** denominators are pairs of denominators of the fractions to clear. */
const denominators: readonly (readonly [number, number])[] = [
  [2, 3],
  [3, 4],
  [4, 6],
  [2, 5],
  [3, 5],
  [4, 5],
  [6, 8],
  [6, 9],
  [4, 10],
  [8, 12],
  [9, 12],
  [10, 15],
];

/** applyingACommonMultiple clears fractions by multiplying by a common multiple of the denominators. */
export const applyingACommonMultiple = topic(
  "applying-a-common-multiple",
  t("Applying a Common Multiple", "运用公倍数"),
  t(
    "Choose the smallest number that clears all the fractions of an expression, and use it to solve an equation with fractions.",
    "选出能消去表达式中所有分母的最小的数，并用它解含分数的方程。",
  ),
  ["simplifying-linear-expressions-containing-fractions"],
  ["6.NS.B.4", "HSA.REI.B.3"],
  [
    kp(
      "the-smallest-multiplier-that-clears-fractions",
      t("The smallest multiplier that clears fractions", "消去分母的最小乘数"),
      t(
        "Multiplying by a number clears a denominator only when that denominator divides the number. To clear all of them with the smallest number, use the least common multiple of the denominators. Multiplying $\\frac{x}{4} + \\frac{5}{6}$ by $12$ gives $3x + 10$, with whole coefficients; the product $24$ works too but is larger than needed.",
        "乘一个数要消去分母，分母必须整除这个数。要用最小的数消去所有分母，就取分母的最小公倍数。把 $\\frac{x}{4} + \\frac{5}{6}$ 乘 $12$ 得 $3x + 10$，系数都是整数；分母之积 $24$ 也可以，但比需要的大。",
      ),
      (rng) => {
        const [a, c] = rng.pick(denominators) as readonly [number, number];
        const L = lcm(a, c);
        const b = rng.pick([1, 3, 5, 7].filter((v) => gcd(v, c) === 1));
        const [v, w] = rng.bool() ? [`\\frac{x}{${a}}`, `\\frac{${b}}{${c}}`] : [`\\frac{${b}}{${c}}`, `\\frac{x}{${a}}`];
        const op = rng.pick(["+", "-"]);
        return numberProblem({
          prompt: t(
            `What is the smallest positive whole number that, multiplied by $${v} ${op} ${w}$, leaves no fractions?`,
            `$${v} ${op} ${w}$ 乘哪个最小的正整数后不再含分数？`,
          ),
          answer: L,
          wrong: [a * c, Math.max(a, c), a + c, Math.min(a, c)],
          solution: t(
            `The multiplier must be divisible by both denominators, $${a}$ and $${c}$, so the smallest one is their least common multiple, $${L}$.`,
            `乘数必须能被两个分母 $${a}$ 和 $${c}$ 整除，所以最小的乘数是它们的最小公倍数 $${L}$。`,
          ),
        });
      },
    ),
    kp(
      "solving-with-a-common-multiple",
      t("Solving with a common multiple", "用公倍数解方程"),
      t(
        "To solve an equation such as $\\frac{x}{4} + \\frac{x}{6} = 5$, multiply both sides by the least common multiple of the denominators, here $12$. This is allowed because both sides stay equal, and it gives $3x + 2x = 60$, an equation with whole coefficients, so $x = 12$.",
        "解 $\\frac{x}{4} + \\frac{x}{6} = 5$ 这样的方程时，两边同乘分母的最小公倍数，这里是 $12$。两边仍然相等，并得到系数都是整数的方程 $3x + 2x = 60$，所以 $x = 12$。",
      ),
      (rng) => {
        const [a, c] = rng.pick(denominators) as readonly [number, number];
        const L = lcm(a, c);
        const k = rng.int(1, 4);
        const u = L / a;
        const v = L / c;
        const minus = u > v && rng.bool();
        const n = k * (minus ? u - v : u + v);
        const x = k * L;
        const op = minus ? "-" : "+";
        return numberProblem({
          prompt: t(`Solve $\\frac{x}{${a}} ${op} \\frac{x}{${c}} = ${n}$.`, `解方程 $\\frac{x}{${a}} ${op} \\frac{x}{${c}} = ${n}$。`),
          answer: x,
          solveFor: "x",
          wrong: [n * L, n * (a + c), k * (a + c), x + L, n],
          solution: t(
            `Multiply both sides by $${L}$, the least common multiple of the denominators, to clear the fractions:${steps(`${u}x ${op} ${v}x = ${n * L}`, `${minus ? u - v : u + v}x = ${n * L}`, `x = ${x}`)}`,
            `两边同乘分母的最小公倍数 $${L}$ 以消去分数：${steps(`${u}x ${op} ${v}x = ${n * L}`, `${minus ? u - v : u + v}x = ${n * L}`, `x = ${x}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Formulas

/** solvingAndAdjustingAGivenFormula solves a formula for one quantity and follows a change through it. */
export const solvingAndAdjustingAGivenFormula = topic(
  "solving-and-adjusting-a-given-formula",
  t("Solving and Adjusting a Given Formula", "求解并调整给定的公式"),
  t(
    "Use a given formula to find any of its quantities, and find how one quantity must change when another changes.",
    "用给定的公式求其中任一个量，并求出一个量变化时另一个量必须如何变化。",
  ),
  ["rearranging-formulas"],
  ["HSA.CED.A.4"],
  [
    kp(
      "finding-any-quantity-in-a-formula",
      t("Finding any quantity in a formula", "求公式中的任一个量"),
      t(
        "A formula is an equation, so it can be solved for any of its letters. Undo the operations on the wanted letter one at a time, last applied first. For $P = 2l + 2w$, subtract $2l$ and then divide by $2$ to get $w = \\frac{P - 2l}{2}$, and only then put in the numbers.",
        "公式就是方程，可以对其中任一个字母求解。按运算顺序的逆序，逐步消去作用在所求字母上的运算。对 $P = 2l + 2w$，先减去 $2l$，再除以 $2$，得 $w = \\frac{P - 2l}{2}$，然后代入数值。",
      ),
      (rng) => {
        const f = rng.int(0, 3);
        if (f === 0) {
          const l = rng.int(6, 30);
          const w = rng.int(2, 20);
          const P = 2 * l + 2 * w;
          return numberProblem({
            prompt: t(
              `The perimeter of a rectangle is given by $P = 2l + 2w$. Find $w$ when $P = ${P}$ and $l = ${l}$.`,
              `长方形的周长公式是 $P = 2l + 2w$。当 $P = ${P}$，$l = ${l}$ 时，求 $w$。`,
            ),
            answer: w,
            solveFor: "w",
            wrong: [P - 2 * l, P - l, (P + 2 * l) / 2, P / 2],
            solution: t(
              `Isolate $w$: subtract $2l$, then divide by $2$.${steps(`w = \\frac{P - 2l}{2}`, `w = \\frac{${P} - ${2 * l}}{2} = ${w}`)}`,
              `分离 $w$：先减去 $2l$，再除以 $2$。${steps(`w = \\frac{P - 2l}{2}`, `w = \\frac{${P} - ${2 * l}}{2} = ${w}`)}`,
            ),
          });
        }
        if (f === 1) {
          const C = 5 * rng.int(-4, 20);
          const F = (9 * C) / 5 + 32;
          return numberProblem({
            prompt: t(
              `Temperatures convert by $F = \\frac{9}{5}C + 32$. Find $C$ when $F = ${F}$.`,
              `温度换算公式是 $F = \\frac{9}{5}C + 32$。当 $F = ${F}$ 时，求 $C$。`,
            ),
            answer: C,
            solveFor: "C",
            wrong: [F - 32, Q.of(9 * F + 160, 5), Q.of(5 * F - 288, 9), C + 32],
            solution: t(
              `Subtract $32$, which was added last, then multiply by $\\frac{5}{9}$ to undo the coefficient.${steps(`C = \\frac{5}{9}(F - 32)`, `C = \\frac{5}{9}(${F - 32}) = ${C}`)}`,
              `先减去最后加上的 $32$，再乘 $\\frac{5}{9}$ 消去系数。${steps(`C = \\frac{5}{9}(F - 32)`, `C = \\frac{5}{9}(${F - 32}) = ${C}`)}`,
            ),
          });
        }
        if (f === 2) {
          const b = rng.int(3, 20);
          const h = 2 * rng.int(2, 12);
          const A = (b * h) / 2;
          return numberProblem({
            prompt: t(
              `The area of a triangle is given by $A = \\frac{1}{2}bh$. Find $b$ when $A = ${A}$ and $h = ${h}$.`,
              `三角形的面积公式是 $A = \\frac{1}{2}bh$。当 $A = ${A}$，$h = ${h}$ 时，求 $b$。`,
            ),
            answer: b,
            solveFor: "b",
            wrong: [Q.of(A, h), A * h, A - h, 2 * A],
            solution: t(
              `Multiply by $2$ to clear the fraction, then divide by $h$.${steps(`b = \\frac{2A}{h}`, `b = \\frac{${2 * A}}{${h}} = ${b}`)}`,
              `先乘 $2$ 消去分数，再除以 $h$。${steps(`b = \\frac{2A}{h}`, `b = \\frac{${2 * A}}{${h}} = ${b}`)}`,
            ),
          });
        }
        const a = rng.int(5, 40);
        const v = rng.int(2, 9);
        const n = rng.int(2, 15);
        const T = a + v * n;
        return numberProblem({
          prompt: t(
            `A shop's total charge is $T = a + vn$, where $a$ is a fixed fee, $v$ the price per item and $n$ the number of items. Find $n$ when $T = ${T}$, $a = ${a}$ and $v = ${v}$.`,
            `商店的总收费是 $T = a + vn$，其中 $a$ 是固定费用，$v$ 是单价，$n$ 是件数。当 $T = ${T}$，$a = ${a}$，$v = ${v}$ 时，求 $n$。`,
          ),
          answer: n,
          solveFor: "n",
          wrong: [T - a, Q.of(T, v), Q.of(T + a, v), T - v],
          solution: t(
            `Subtract the fixed fee, then divide by the price per item.${steps(`n = \\frac{T - a}{v}`, `n = \\frac{${T - a}}{${v}} = ${n}`)}`,
            `先减去固定费用，再除以单价。${steps(`n = \\frac{T - a}{v}`, `n = \\frac{${T - a}}{${v}} = ${n}`)}`,
          ),
        });
      },
    ),
    kp(
      "keeping-a-formula-balanced-after-a-change",
      t("Keeping a formula balanced after a change", "变化后保持公式成立"),
      t(
        "When one quantity in a formula changes and the result must stay the same, first compute the result from the original values. Then put the changed value into the formula, keep the result fixed, and solve for the quantity that must adjust. At $d = rt$, a trip of $120$ miles at $40$ mph takes $3$ hours; at $60$ mph the same trip takes $2$ hours.",
        "公式中一个量变化而结果必须不变时，先用原来的值算出结果。再把变化后的值代入公式，保持结果不变，解出必须调整的量。由 $d = rt$，以 $40$ 英里/时走 $120$ 英里用 $3$ 小时；以 $60$ 英里/时走同样路程用 $2$ 小时。",
      ),
      (rng) => {
        const f = rng.int(0, 2);
        if (f === 0) {
          const [r, r2] = rng.pick([
            [40, 60],
            [30, 45],
            [30, 60],
            [50, 75],
            [20, 30],
            [36, 54],
          ] as const);
          const t2 = rng.pick([2, 4, 6, 8, 10]);
          const d = r2 * t2;
          const t1 = d / r;
          return numberProblem({
            prompt: t(
              `Using $d = rt$, a trip takes $${t1}$ hours at $${r}$ miles per hour. How many hours does the same trip take at $${r2}$ miles per hour?`,
              `由 $d = rt$，一段路程以 $${r}$ 英里/时行驶需 $${t1}$ 小时。如果速度是 $${r2}$ 英里/时，走同样的路程需多少小时？`,
            ),
            answer: t2,
            wrong: [t1 - (r2 - r), t1 + 1, Q.of(r2 * t1, r), t1],
            solution: t(
              `The distance stays the same, so find it from the original values, then divide by the new speed.${steps(`d = ${r} \\cdot ${t1} = ${d}`, `t = \\frac{${d}}{${r2}} = ${t2}`)}`,
              `路程不变，先用原来的值求路程，再除以新的速度。${steps(`d = ${r} \\cdot ${t1} = ${d}`, `t = \\frac{${d}}{${r2}} = ${t2}`)}`,
            ),
          });
        }
        if (f === 1) {
          const b = rng.int(3, 12);
          const m = rng.pick([2, 3, 4]);
          const h2 = rng.int(2, 9);
          const h = h2 * m;
          return numberProblem({
            prompt: t(
              `In $A = \\frac{1}{2}bh$, a triangle has $b = ${b}$ and $h = ${h}$. The base is multiplied by $${m}$. What must the new height be for the area to stay the same?`,
              `在 $A = \\frac{1}{2}bh$ 中，一个三角形的 $b = ${b}$，$h = ${h}$。底变为原来的 $${m}$ 倍。要使面积不变，新的高应是多少？`,
            ),
            answer: h2,
            wrong: [h * m, h - m, h, b],
            solution: t(
              `The area is ${"$"}\\frac{1}{2}(${b})(${h}) = ${fr(b * h, 2)}${"$"}. With the new base $${b * m}$, solve for the height.${steps(`\\frac{1}{2}(${b * m})h = ${fr(b * h, 2)}`, `h = ${h2}`)}`,
              `面积是 $\\frac{1}{2}(${b})(${h}) = ${fr(b * h, 2)}$。新的底是 $${b * m}$，由此解出高。${steps(`\\frac{1}{2}(${b * m})h = ${fr(b * h, 2)}`, `h = ${h2}`)}`,
            ),
          });
        }
        const v = rng.int(3, 9);
        const n = rng.int(5, 12);
        const a = rng.int(10, 30);
        const m = rng.int(1, n - 2);
        const raise = v * m;
        return numberProblem({
          prompt: t(
            `A plumber charges $T = ${a} + ${v}n$ dollars for $n$ hours. The fixed fee rises by $${raise}$ dollars while the hourly price stays the same. A customer who paid for $${n}$ hours before wants to pay the same total. How many hours can the customer now buy?`,
            `水管工收费 $T = ${a} + ${v}n$ 美元（$n$ 为小时数）。固定费用上涨 $${raise}$ 美元，每小时价格不变。一位以前买 $${n}$ 小时的顾客想保持总费用不变。现在能买多少小时？`,
          ),
          answer: n - m,
          wrong: [n - raise, n + m, n, m],
          solution: t(
            `The old total is the new total, so the old hours pay for the raise as well.${steps(`T = ${a} + ${v}(${n}) = ${a + v * n}`, `${a + raise} + ${v}n = ${a + v * n}`, `n = ${n - m}`)}`,
            `总费用不变，所以要从原来的小时费用中拿出上涨的部分。${steps(`T = ${a} + ${v}(${n}) = ${a + v * n}`, `${a + raise} + ${v}n = ${a + v * n}`, `n = ${n - m}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Quadratic inequalities on number lines

/** QuadraticCase is the inequality (x - r)(x - s) op 0 with r < s. */
interface QuadraticCase {
  readonly r: number;
  readonly s: number;
  readonly inside: boolean;
  readonly closed: boolean;
}

/** quadraticCase picks a quadratic inequality with two integer roots. */
function quadraticCase(rng: Rng): QuadraticCase {
  const inside = rng.bool();
  const closed = rng.bool();
  if (rng.bool()) {
    const k = rng.int(2, 6);
    return { r: -k, s: k, inside, closed };
  }
  const r = rng.int(-5, 3);
  return { r, s: r + rng.int(2, 6), inside, closed };
}

/** inequalityOf writes the inequality of a case, as x² against a square when its roots are opposite. */
function inequalityOf({ r, s, inside, closed }: QuadraticCase): string {
  const op = inside ? (closed ? "\\le" : "<") : closed ? "\\ge" : ">";
  if (r === -s) return `x^{2} ${op} ${s * s}`;
  return `(${poly([1, "x"], [-r, ""])})(${poly([1, "x"], [-s, ""])}) ${op} 0`;
}

/** setOf is the solution set of a case. */
function setOf({ r, s, inside, closed }: QuadraticCase) {
  const lo = Q.of(r);
  const hi = Q.of(s);
  return inside
    ? [{ lo, hi, loClosed: closed, hiClosed: closed }]
    : [
        { lo: undefined, hi: lo, loClosed: false, hiClosed: closed },
        { lo: hi, hi: undefined, loClosed: closed, hiClosed: false },
      ];
}

/** lineWords describes the graph of a case in words. */
function lineWords({ r, s, inside, closed }: QuadraticCase): Text {
  const dot = closed ? t("Closed dots", "实心点在") : t("Open circles", "空心圈在");
  return inside
    ? t(`${dot.en} at $${r}$ and $${s}$, shaded between them`, `${dot["zh-CN"]} $${r}$ 和 $${s}$，两点之间涂色`)
    : t(`${dot.en} at $${r}$ and $${s}$, shaded outward from them`, `${dot["zh-CN"]} $${r}$ 和 $${s}$，向两点之外涂色`);
}

/** rootsWork shows how a quadratic inequality reaches its graph. */
function rootsWork(c: QuadraticCase): Text {
  const where = c.inside ? t("between the roots", "两根之间") : t("outside the roots", "两根之外");
  const sign = c.inside ? t("negative", "负") : t("positive", "正");
  const ends = c.closed
    ? t("included, so the dots are closed", "包含在内，所以用实心点")
    : t("excluded, so the circles are open", "不包含在内，所以用空心圈");
  return t(
    `The boundary values are $x = ${c.r}$ and $x = ${c.s}$. The upward parabola $${c.r === -c.s ? `x^{2} - ${c.s * c.s}` : `(${poly([1, "x"], [-c.r, ""])})(${poly([1, "x"], [-c.s, ""])})`}$ is ${sign.en} ${where.en}, and the boundary values are ${ends.en}.`,
    `边界值是 $x = ${c.r}$ 和 $x = ${c.s}$。开口向上的抛物线 $${c.r === -c.s ? `x^{2} - ${c.s * c.s}` : `(${poly([1, "x"], [-c.r, ""])})(${poly([1, "x"], [-c.s, ""])})`}$ 在${where["zh-CN"]}为${sign["zh-CN"]}，边界值${ends["zh-CN"]}。`,
  );
}

/** matchingSimpleQuadraticInequalitiesToNumberLines matches quadratic inequalities and the graphs of their solutions. */
export const matchingSimpleQuadraticInequalitiesToNumberLines = topic(
  "matching-simple-quadratic-inequalities-to-number-lines",
  t("Matching Simple Quadratic Inequalities to Number Lines", "把简单二次不等式与数轴配对"),
  t(
    "Match a quadratic inequality with two real roots to the number line showing its solutions, in both directions.",
    "把有两个实根的二次不等式与表示其解的数轴相互配对。",
  ),
  ["solving-elementary-quadratic-inequalities", "representing-solutions-to-inequalities-on-number-lines"],
  ["HSA.REI.B.4"],
  [
    kp(
      "from-an-inequality-to-its-number-line",
      t("From an inequality to its number line", "由不等式到数轴"),
      t(
        "Find the two boundary values, where the quadratic equals zero. Since $x^{2} - 9$ opens upward, it is negative between its roots $-3$ and $3$ and positive outside them. So $x^{2} < 9$ is shaded between the two values, and $x^{2} > 9$ outward from them. Strict signs give open circles; $\\le$ and $\\ge$ give closed dots.",
        "先求二次式等于零时的两个边界值。$x^{2} - 9$ 开口向上，在两根 $-3$ 和 $3$ 之间为负，在两根之外为正。所以 $x^{2} < 9$ 涂两点之间，$x^{2} > 9$ 向两点之外涂。严格不等号用空心圈，$\\le$ 和 $\\ge$ 用实心点。",
      ),
      (rng) => {
        const c = quadraticCase(rng);
        return pickChoice(
          rng,
          t(
            `Which number line description matches the solutions of $${inequalityOf(c)}$?`,
            `哪一种数轴描述与 $${inequalityOf(c)}$ 的解相符？`,
          ),
          lineWords(c),
          [
            lineWords({ ...c, inside: !c.inside }),
            lineWords({ ...c, closed: !c.closed }),
            lineWords({ ...c, inside: !c.inside, closed: !c.closed }),
          ],
          rootsWork(c),
        );
      },
    ),
    kp(
      "from-a-number-line-to-its-inequality",
      t("From a number line to its inequality", "由数轴到不等式"),
      t(
        "Read a number line in three steps. The two marked values are the roots, so they fix the quadratic. Shading between them means the quadratic is below zero, and shading outward means above zero. A closed dot adds the equal sign. Remember that $x^{2}$ is compared with the square of the marked value, not the value.",
        "按三步读数轴。标出的两个值是根，由此确定二次式。涂在两点之间表示二次式小于零，向外涂表示大于零。实心点要加上等号。注意 $x^{2}$ 比较的是标记值的平方，而不是标记值本身。",
      ),
      (rng) => {
        const c = quadraticCase(rng);
        const wrongRoots: string[] = [];
        if (c.r === -c.s) {
          const op = c.inside ? (c.closed ? "\\le" : "<") : c.closed ? "\\ge" : ">";
          wrongRoots.push(`x^{2} ${op} ${c.s}`);
        } else {
          const op = c.inside ? (c.closed ? "\\le" : "<") : c.closed ? "\\ge" : ">";
          wrongRoots.push(`(${poly([1, "x"], [c.r, ""])})(${poly([1, "x"], [c.s, ""])}) ${op} 0`);
        }
        return {
          ...pickChoice(
            rng,
            t("Which inequality has exactly the solutions graphed on the number line?", "哪个不等式的解恰好是数轴上所画的部分？"),
            math(inequalityOf(c)),
            [
              math(inequalityOf({ ...c, inside: !c.inside })),
              math(inequalityOf({ ...c, closed: !c.closed })),
              math(wrongRoots[0] as string),
            ],
            rootsWork(c),
          ),
          figure: numberLineFigure(setOf(c), Math.min(c.r - 2, -1), Math.max(c.s + 2, 1)),
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Powers as radicals and in scientific notation

/** root writes the n-th root of x^m. */
const root = (n: number, m: number) => (n === 2 ? `\\sqrt{x^{${m}}}` : `\\sqrt[${n}]{x^{${m}}}`);

/** simplifyingExponentialRadicalExpressions writes radicals of powers as single powers. */
export const simplifyingExponentialRadicalExpressions = topic(
  "simplifying-exponential-radical-expressions",
  t("Simplifying Exponential Radical Expressions", "化简指数根式"),
  t(
    "Write a radical of a power, alone or combined with another power, as one power of the variable.",
    "把幂的根式，单独或与其他幂相乘除时，写成变量的一个幂。",
  ),
  ["act-exam-simplifying-rational-exponents", "rewriting-radical-expressions-using-the-laws-of-exponents"],
  ["HSN.RN.A.2"],
  [
    kp(
      "a-root-of-a-power-as-one-power",
      t("A root of a power as one power", "幂的根式写成一个幂"),
      t(
        "The $n$-th root is the power $\\frac{1}{n}$, and a power of a power multiplies exponents, so $\\sqrt[n]{x^{m}} = x^{m/n}$. The exponent inside goes on top and the index of the root goes on the bottom. For instance $\\sqrt[3]{x^{6}} = x^{2}$ and $\\sqrt{x^{3}} = x^{3/2}$, for positive $x$.",
        "$n$ 次根就是 $\\frac{1}{n}$ 次幂，幂的乘方要把指数相乘，所以 $\\sqrt[n]{x^{m}} = x^{m/n}$。根号内的指数作分子，根指数作分母。例如对正数 $x$，$\\sqrt[3]{x^{6}} = x^{2}$，$\\sqrt{x^{3}} = x^{3/2}$。",
      ),
      (rng) => {
        const n = rng.pick([2, 3, 4, 5]);
        const m = rng.int(2, 12);
        return numberProblem({
          prompt: t(
            `For $x > 0$, the expression $${root(n, m)}$ equals $x^{k}$. What is $k$?`,
            `对 $x > 0$，表达式 $${root(n, m)}$ 等于 $x^{k}$。求 $k$。`,
          ),
          answer: Q.of(m, n),
          solveFor: "k",
          wrong: [Q.of(n, m), m - n, m * n, m + n],
          solution: t(
            `A root of index $${n}$ is the power $\\frac{1}{${n}}$, and a power of a power multiplies the exponents, so $k = ${m} \\cdot \\frac{1}{${n}} = ${fr(m, n)}$.`,
            `根指数为 $${n}$ 的根就是 $\\frac{1}{${n}}$ 次幂，幂的乘方要把指数相乘，所以 $k = ${m} \\cdot \\frac{1}{${n}} = ${fr(m, n)}$。`,
          ),
        });
      },
    ),
    kp(
      "a-root-combined-with-another-power",
      t("A root combined with another power", "根式与另一个幂相乘除"),
      t(
        "Once a radical is written as a power, the laws of exponents combine it with other powers of the same base: multiplying adds exponents and dividing subtracts them. So $\\sqrt{x^{3}} \\cdot x^{2} = x^{3/2} \\cdot x^{2} = x^{7/2}$ and $\\frac{x^{3}}{\\sqrt{x}} = x^{3 - 1/2} = x^{5/2}$.",
        "根式写成幂之后，就可以用指数运算法则与同底数的幂合并：相乘时指数相加，相除时指数相减。所以 $\\sqrt{x^{3}} \\cdot x^{2} = x^{3/2} \\cdot x^{2} = x^{7/2}$，$\\frac{x^{3}}{\\sqrt{x}} = x^{3 - 1/2} = x^{5/2}$。",
      ),
      (rng) => {
        const n = rng.pick([2, 3, 4]);
        const m = rng.int(1, 9);
        const p = rng.int(2, 8);
        const times = rng.bool();
        const shown = times
          ? `${root(n, m).replace("x^{1}", "x")} \\cdot x^{${p}}`
          : `\\frac{x^{${p}}}{${root(n, m).replace("x^{1}", "x")}}`;
        const num = times ? p * n + m : p * n - m;
        return numberProblem({
          prompt: t(
            `For $x > 0$, the expression $${shown}$ equals $x^{k}$. What is $k$?`,
            `对 $x > 0$，表达式 $${shown}$ 等于 $x^{k}$。求 $k$。`,
          ),
          answer: Q.of(num, n),
          solveFor: "k",
          wrong: [Q.of(times ? p * m : p * n + m, n), Q.of(m, n), times ? Q.of(p + m, n) : Q.of(p - m, n), p + m],
          solution: t(
            `Write the root as $x^{${fr(m, n)}}$, then ${times ? "add" : "subtract"} the exponents because ${times ? "the powers are multiplied" : "the powers are divided"}:${steps(`k = ${p} ${times ? "+" : "-"} ${fr(m, n)} = ${fr(num, n)}`)}`,
            `把根式写成 $x^{${fr(m, n)}}$，因为两个幂相${times ? "乘" : "除"}，所以指数相${times ? "加" : "减"}：${steps(`k = ${p} ${times ? "+" : "-"} ${fr(m, n)} = ${fr(num, n)}`)}`,
          ),
        });
      },
    ),
  ],
);

/** usingScientificNotationWithExponentialValues writes powers and products of powers in scientific notation. */
export const usingScientificNotationWithExponentialValues = topic(
  "using-scientific-notation-with-exponential-values",
  t("Using Scientific Notation With Exponential Values", "用科学记数法表示指数值"),
  t(
    "Write powers of numbers in scientific notation and products such as $2^{7} \\cdot 5^{5}$ by collecting factors of ten.",
    "用科学记数法表示数的幂，以及通过凑出 10 的因数表示 $2^{7} \\cdot 5^{5}$ 这样的积。",
  ),
  ["multiplying-numbers-in-scientific-notation", "the-power-of-product-rule-for-exponents"],
  ["8.EE.A.3"],
  [
    kp(
      "a-power-in-scientific-notation",
      t("A power in scientific notation", "幂的科学记数法"),
      t(
        "A power of a product is the product of the powers, so $(4 \\times 10^{3})^{2} = 16 \\times 10^{6}$. Scientific notation needs a first factor from $1$ up to $10$, so rewrite $16$ as $1.6 \\times 10$ and add one to the exponent: $1.6 \\times 10^{7}$. Forgetting this last step is the usual error.",
        "积的乘方等于乘方的积，所以 $(4 \\times 10^{3})^{2} = 16 \\times 10^{6}$。科学记数法要求前一个因数不小于 $1$ 且小于 $10$，所以把 $16$ 写成 $1.6 \\times 10$，指数再加一：$1.6 \\times 10^{7}$。常见错误就是漏了这最后一步。",
      ),
      (rng) => {
        const a = rng.int(2, 9);
        const n = rng.int(2, 9);
        const p = rng.pick([2, 2, 3]);
        const v = a ** p;
        const lift = String(v).length - 1;
        return numberProblem({
          prompt: t(
            `The value of $(${a} \\times 10^{${n}})^{${p}}$ is written in scientific notation as $c \\times 10^{e}$. What is $e$?`,
            `把 $(${a} \\times 10^{${n}})^{${p}}$ 的值用科学记数法写成 $c \\times 10^{e}$。求 $e$。`,
          ),
          answer: p * n + lift,
          solveFor: "e",
          wrong: [p * n + lift + 1, n + p, n ** p, p * n === p * n + lift ? p * n - 1 : p * n],
          solution: t(
            `Raise each factor to the power $${p}$; then ${lift === 0 ? "the first factor is already below $10$" : "move the first factor below $10$, which adds to the exponent of ten"}:${steps(`(${a} \\times 10^{${n}})^{${p}} = ${v} \\times 10^{${p * n}}`, `e = ${p * n}${lift ? ` + ${lift}` : ""} = ${p * n + lift}`)}`,
            `每个因数都乘方 $${p}$ 次；然后${lift === 0 ? "前一个因数已小于 $10$" : "把前一个因数变为小于 $10$，10 的指数随之增加"}：${steps(`(${a} \\times 10^{${n}})^{${p}} = ${v} \\times 10^{${p * n}}`, `e = ${p * n}${lift ? ` + ${lift}` : ""} = ${p * n + lift}`)}`,
          ),
        });
      },
    ),
    kp(
      "powers-of-two-and-five-make-tens",
      t("Powers of two and five make tens", "2 和 5 的幂凑成 10"),
      t(
        "Each pair of a factor $2$ and a factor $5$ makes a factor $10$. So in $2^{7} \\cdot 5^{5}$ pair off five of each to get $2^{2} \\cdot 10^{5} = 4 \\times 10^{5}$. The smaller exponent counts the tens, and the unpaired factors become the first factor of the scientific notation, adjusted if they reach $10$.",
        "一个因数 $2$ 和一个因数 $5$ 配成一个因数 $10$。所以在 $2^{7} \\cdot 5^{5}$ 中，各取五个配对，得 $2^{2} \\cdot 10^{5} = 4 \\times 10^{5}$。较小的指数给出 10 的个数，没配对的因数成为科学记数法的前一个因数；如果它达到 $10$，还要再调整。",
      ),
      (rng) => {
        const b = rng.int(3, 12);
        const c = rng.int(1, 4);
        const two = rng.bool();
        const rest = (two ? 2 : 5) ** c;
        const lift = String(rest).length - 1;
        const shown = two ? `2^{${b + c}} \\cdot 5^{${b}}` : `2^{${b}} \\cdot 5^{${b + c}}`;
        const answer = b + lift;
        return numberProblem({
          prompt: t(
            `The value of $${shown}$ is written in scientific notation as $d \\times 10^{e}$. What is $e$?`,
            `把 $${shown}$ 的值用科学记数法写成 $d \\times 10^{e}$。求 $e$。`,
          ),
          answer,
          solveFor: "e",
          wrong: [b + c, 2 * b + c, answer + 1, c, b === answer ? b - 1 : b],
          solution: t(
            `Pair $${b}$ twos with $${b}$ fives to make $10^{${b}}$; the factors left over are $${rest}$.${steps(`${shown} = ${rest} \\times 10^{${b}}${lift ? ` = ${rest / 10 ** lift} \\times 10^{${answer}}` : ""}`)}`,
            `把 $${b}$ 个 $2$ 与 $${b}$ 个 $5$ 配对，得 $10^{${b}}$；剩下的因数之积是 $${rest}$。${steps(`${shown} = ${rest} \\times 10^{${b}}${lift ? ` = ${rest / 10 ** lift} \\times 10^{${answer}}` : ""}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Impossible quotients

/** identifyingImpossibleCasesOfSymbolicQuotients decides what a quotient cannot equal and when an equation has no solution. */
export const identifyingImpossibleCasesOfSymbolicQuotients = topic(
  "identifying-impossible-cases-of-symbolic-quotients",
  t("Identifying Impossible Cases of Symbolic Quotients", "判断符号商不可能的情形"),
  t(
    "Decide which values a quotient cannot take from the signs and sizes of its parts, and recognize a rational equation whose only candidate makes a denominator zero.",
    "由分子分母的符号和大小判断商不可能取哪些值，并识别唯一候选解使分母为零的分式方程。",
  ),
  ["rational-equations-with-one-fractional-term", "real-number-restrictions"],
  ["HSA.REI.A.2"],
  [
    kp(
      "values-a-quotient-cannot-take",
      t("Values a quotient cannot take", "商不可能取的值"),
      t(
        "A quotient of two numbers with the same sign is positive and one with opposite signs is negative. Sizes matter too: if $a > b > 0$, then $\\frac{a}{b} > 1$, and if $0 < a < b$, then $0 < \\frac{a}{b} < 1$. Any value breaking such a rule is impossible, however the numbers are chosen.",
        "同号两数的商为正，异号两数的商为负。大小也有影响：若 $a > b > 0$，则 $\\frac{a}{b} > 1$；若 $0 < a < b$，则 $0 < \\frac{a}{b} < 1$。违反这些规律的值，无论怎样取数都不可能出现。",
      ),
      (rng) => {
        const u = rng.int(2, 6);
        const v = rng.int(7, 12);
        const small = fr(u, v);
        const big = fr(v, u);
        const [a, b] = rng.pick([
          ["a", "b"],
          ["p", "q"],
          ["m", "n"],
          ["r", "s"],
          ["u", "v"],
          ["c", "d"],
        ] as const);
        const moreThanOne = t(
          "a number of larger size over one of smaller size with the same sign gives more than $1$",
          "同号时绝对值较大的数除以绝对值较小的数，商大于 $1$",
        );
        const belowOne = t(
          "a number of smaller size over one of larger size with the same sign gives a number between $0$ and $1$",
          "同号时绝对值较小的数除以绝对值较大的数，商在 $0$ 和 $1$ 之间",
        );
        const cases = [
          {
            when: `$${a} > 0$`,
            and: `$${b} < 0$`,
            bad: big,
            good: [`-${big}`, `-${small}`, "-1"],
            why: t("opposite signs give a negative quotient", "异号两数的商为负"),
          },
          {
            when: `$${a} < 0$`,
            and: `$${b} < 0$`,
            bad: `-${small}`,
            good: [small, big, "1"],
            why: t("two negatives give a positive quotient", "两个负数的商为正"),
          },
          { when: `$${a} > ${b} > 0$`, and: "", bad: small, good: [big, `${u + 1}`, `${v}`], why: moreThanOne },
          { when: `$${a} < ${b} < 0$`, and: "", bad: small, good: [big, `${u + 1}`, `${v}`], why: moreThanOne },
          { when: `$0 < ${a} < ${b}$`, and: "", bad: big, good: [small, fr(1, u + 7), fr(1, 2)], why: belowOne },
          { when: `$${b} < ${a} < 0$`, and: "", bad: big, good: [small, fr(1, u + 7), fr(1, 2)], why: belowOne },
        ];
        const k = rng.pick(cases);
        return pickChoice(
          rng,
          t(
            `If ${k.when}${k.and && ` and ${k.and}`}, which of these cannot be the value of $\\frac{${a}}{${b}}$?`,
            `若 ${k.when}${k.and && ` 且 ${k.and}`}，下列哪个不可能是 $\\frac{${a}}{${b}}$ 的值？`,
          ),
          math(k.bad),
          k.good.map(math),
          t(`Since ${k.why.en}, the value $${k.bad}$ is impossible.`, `因为${k.why["zh-CN"]}，所以 $${k.bad}$ 不可能。`),
        );
      },
    ),
    kp(
      "an-equation-whose-candidate-is-not-allowed",
      t("An equation whose candidate is not allowed", "候选解不被允许的方程"),
      t(
        "In $\\frac{x + a}{x - b} = \\frac{c}{x - b}$ the denominators match, so the numerators must be equal: $x + a = c$. But $x = b$ makes both denominators zero, and division by zero is undefined. So if the candidate is $b$, the equation has no solution at all. Always check a candidate against the denominators.",
        "在 $\\frac{x + a}{x - b} = \\frac{c}{x - b}$ 中分母相同，所以分子必须相等：$x + a = c$。但 $x = b$ 会使两个分母为零，而除以零没有意义。所以如果候选解恰好是 $b$，方程就没有解。候选解一定要代回分母检验。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 4, 5, 6, -1, -2, -3, -4]);
        const b = rng.pick([1, 2, 3, 4, 5, 6, 7]);
        const blocked = rng.bool();
        const x = blocked ? b : b + rng.pick([1, 2, 3, 4, -1, -2, -9]);
        const c = x + a;
        const eq = `\\frac{${poly([1, "x"], [a, ""])}}{${poly([1, "x"], [-b, ""])}} = \\frac{${c}}{${poly([1, "x"], [-b, ""])}}`;
        const none = t(`No solution, since the only candidate makes a denominator zero`, `无解，因为唯一的候选解使分母为零`);
        const all = t(`Every real number except $${b}$`, `除 $${b}$ 以外的所有实数`);
        const at = (v: number) => t(`$x = ${v}$ only`, `只有 $x = ${v}$`);
        return pickChoice(
          rng,
          t(`Which describes the solutions of $${eq}$?`, `下面哪一项描述了 $${eq}$ 的解？`),
          blocked ? none : at(x),
          blocked ? [at(b), all, at(c + a)] : [none, at(b), all, at(c + a)],
          t(
            `The denominators match, so the numerators must be equal, which gives $x = ${c} ${a < 0 ? "+" : "-"} ${Math.abs(a)} = ${x}$. ${blocked ? `That value makes the denominator $x ${"-"} ${b}$ zero, so it must be rejected and no solution remains.` : `That value keeps the denominator nonzero, so it is the solution.`}`,
            `分母相同，所以分子必须相等，得 $x = ${c} ${a < 0 ? "+" : "-"} ${Math.abs(a)} = ${x}$。${blocked ? `这个值使分母 $x - ${b}$ 为零，必须舍去，因此方程无解。` : "这个值不使分母为零，所以它就是解。"}`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Trigonometric identities

const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];

/** reasoningWithTrigonometricIdentities combines the Pythagorean identity, quadrants and the sum formula. */
export const reasoningWithTrigonometricIdentities = topic(
  "reasoning-with-trigonometric-identities",
  t("Reasoning With Trigonometric Identities", "运用三角恒等式推理"),
  t(
    "Use the Pythagorean identity with a quadrant to find a missing ratio, and the sum formula for cosine to combine two angles given only by ratios.",
    "结合象限用毕达哥拉斯恒等式求未知比值，并用余弦和角公式合并只由比值给出的两个角。",
  ),
  ["the-sum-and-difference-formulas-for-cosine"],
  ["HSF.TF.C.8", "HSF.TF.C.9"],
  [
    kp(
      "a-missing-ratio-from-the-identity-and-a-quadrant",
      t("A missing ratio from the identity and a quadrant", "由恒等式和象限求未知比值"),
      t(
        "The identity $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ gives the size of the missing ratio but not its sign, because taking a square root leaves $\\pm$. The quadrant settles the sign: sine is positive in quadrants I and II, cosine in quadrants I and IV, and tangent in quadrants I and III.",
        "恒等式 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ 给出未知比值的大小，但不给出符号，因为开平方后有 $\\pm$。符号由象限决定：正弦在第一、二象限为正，余弦在第一、四象限为正，正切在第一、三象限为正。",
      ),
      (rng) => {
        const [a, b, c] = rng.pick(triples) as readonly [number, number, number];
        const q = rng.pick([1, 2, 3, 4]);
        const sinS = q <= 2 ? 1 : -1;
        const cosS = q === 1 || q === 4 ? 1 : -1;
        const givenSin = rng.bool();
        const quad = ["I", "II", "III", "IV"][q - 1] as string;
        const quadZh = ["一", "二", "三", "四"][q - 1] as string;
        const given = givenSin ? `\\sin\\theta = ${fr(sinS * a, c)}` : `\\cos\\theta = ${fr(cosS * b, c)}`;
        const want = rng.bool() ? (givenSin ? "cos" : "sin") : "tan";
        const answer = want === "cos" ? Q.of(cosS * b, c) : want === "sin" ? Q.of(sinS * a, c) : Q.of(sinS * cosS * a, b);
        const other = want === "tan" ? (givenSin ? `\\cos\\theta = ${fr(cosS * b, c)}` : `\\sin\\theta = ${fr(sinS * a, c)}`) : "";
        const size = givenSin ? b : a;
        return numberProblem({
          prompt: t(
            `An angle $\\theta$ lies in quadrant ${quad} and $${given}$. What is the value of $\\${want}\\theta$?`,
            `角 $\\theta$ 在第${quadZh}象限，且 $${given}$。求 $\\${want}\\theta$ 的值。`,
          ),
          answer,
          wrong: [answer.neg(), Q.of(a, b), Q.of(b, a), Q.of(c, size), Q.of(-b, a)],
          solution: t(
            `By the identity the other ratio has size $\\frac{${size}}{${c}}$, because ${c}^2 - ${givenSin ? a : b}^2 = ${size}^2. The quadrant fixes the sign.${steps(want === "tan" ? `${other}, \\quad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = ${answer.toLatex()}` : `\\${want}\\theta = ${answer.toLatex()}`)}`,
            `由恒等式，另一个比值的大小是 $\\frac{${size}}{${c}}$，因为 ${c}^2 - ${givenSin ? a : b}^2 = ${size}^2。符号由象限决定。${steps(want === "tan" ? `${other}, \\quad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = ${answer.toLatex()}` : `\\${want}\\theta = ${answer.toLatex()}`)}`,
          ),
        });
      },
    ),
    kp(
      "cosine-of-a-sum-from-given-ratios",
      t("Cosine of a sum from given ratios", "由已知比值求和角的余弦"),
      t(
        "To find $\\cos(A + B)$ without the angles, use $\\cos(A + B) = \\cos A\\cos B - \\sin A\\sin B$. The formula needs all four ratios, so first find the missing ones from the Pythagorean identity. For acute angles every ratio is positive. Note the minus sign for a sum and the plus sign for a difference.",
        "不知道角时求 $\\cos(A + B)$，要用 $\\cos(A + B) = \\cos A\\cos B - \\sin A\\sin B$。公式需要四个比值，所以先用毕达哥拉斯恒等式求出缺少的比值。锐角的所有比值都是正的。注意和角公式中是减号，差角公式中是加号。",
      ),
      (rng) => {
        const [a, b, c] = rng.pick(triples) as readonly [number, number, number];
        const [d, e, f] = rng.pick(triples.filter((x) => x[2] !== c)) as readonly [number, number, number];
        const sum = rng.bool();
        const op = sum ? "+" : "-";
        const num = sum ? b * e - a * d : b * e + a * d;
        const den = c * f;
        return numberProblem({
          prompt: t(
            `Angles $A$ and $B$ are acute, with $\\sin A = ${fr(a, c)}$ and $\\cos B = ${fr(e, f)}$. What is the value of $\\cos(A ${op} B)$?`,
            `$A$ 和 $B$ 都是锐角，$\\sin A = ${fr(a, c)}$，$\\cos B = ${fr(e, f)}$。求 $\\cos(A ${op} B)$ 的值。`,
          ),
          answer: Q.of(num, den),
          wrong: [Q.of(sum ? b * e + a * d : b * e - a * d, den), Q.of(a * e + b * d, den), Q.of(a * e, den), Q.of(b + e, c + f)],
          solution: t(
            `The identity gives the two missing ratios, $\\cos A = ${fr(b, c)}$ and $\\sin B = ${fr(d, f)}$. Put all four into the formula:${steps(`\\cos(A ${op} B) = ${fr(b, c)} \\cdot ${fr(e, f)} ${sum ? "-" : "+"} ${fr(a, c)} \\cdot ${fr(d, f)} = ${fr(num, den)}`)}`,
            `由恒等式求出缺少的两个比值：$\\cos A = ${fr(b, c)}$，$\\sin B = ${fr(d, f)}$。把四个比值代入公式：${steps(`\\cos(A ${op} B) = ${fr(b, c)} \\cdot ${fr(e, f)} ${sum ? "-" : "+"} ${fr(a, c)} \\cdot ${fr(d, f)} = ${fr(num, den)}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Function representations

/** reasoningFromFunctionRepresentations reads functions given by tables, alone and with a rule. */
export const reasoningFromFunctionRepresentations = topic(
  "reasoning-from-function-representations",
  t("Reasoning From Function Representations", "由函数的表示形式推理"),
  t(
    "Read values, inputs and compositions from a function given by a table, and combine a table with a rule.",
    "从用表格给出的函数中读取函数值、自变量和复合值，并把表格与解析式结合使用。",
  ),
  ["function-composition"],
  ["HSF.IF.A.2", "HSF.BF.A.1c"],
  [
    kp(
      "reading-values-and-inputs-from-a-table",
      t("Reading values and inputs from a table", "从表格读取函数值和自变量"),
      t(
        "In a function table, $f(a)$ is found by locating $a$ in the input row and reading the entry below it. To solve $f(x) = v$, go the other way: find $v$ in the output row and read the input above. For $f(f(a))$, read $f(a)$ first, then use that result as a new input.",
        "在函数表中求 $f(a)$，要在自变量一行找到 $a$，读出它下方的值。解 $f(x) = v$ 则反过来：在函数值一行找到 $v$，读出上方的自变量。求 $f(f(a))$ 时，先读出 $f(a)$，再把结果作为新的自变量。",
      ),
      (rng) => {
        const xs = [1, 2, 3, 4, 5, 6];
        const ys = rng.shuffle(xs).map((v) => v);
        const at = (x: number) => ys[x - 1] as number;
        const shown = table("x", "f(x)", xs, ys);
        const a = rng.pick(xs);
        const b = rng.pick(xs.filter((v) => v !== a));
        const form = rng.int(0, 2);
        if (form === 0) {
          const answer = at(at(a));
          return numberProblem({
            prompt: t(`The table defines the function $f$.${shown}What is $f(f(${a}))$?`, `表格定义了函数 $f$。${shown}求 $f(f(${a}))$。`),
            answer,
            wrong: [at(a), xs.find((x) => at(x) === a) as number, a, at(a) * at(a), answer + 1],
            solution: t(
              `Work from the inside: $f(${a}) = ${at(a)}$, and then this output is the new input, so $f(${at(a)}) = ${answer}$.`,
              `从内向外计算：$f(${a}) = ${at(a)}$，再把这个结果作为新的自变量，所以 $f(${at(a)}) = ${answer}$。`,
            ),
          });
        }
        if (form === 1) {
          const v = at(a);
          return numberProblem({
            prompt: t(
              `The table defines the function $f$.${shown}For which value of $x$ is $f(x) = ${at(a)}$?`,
              `表格定义了函数 $f$。${shown}当 $x$ 取何值时 $f(x) = ${at(a)}$？`,
            ),
            answer: a,
            solveFor: "x",
            wrong: [at(v), v === a ? at(a) + 1 : v, (a % 6) + 1],
            solution: t(
              `Here the output is given, so find $${v}$ in the bottom row and read the input above it: $x = ${a}$.`,
              `这里已知函数值，所以在下面一行找到 $${v}$，读出上方的自变量：$x = ${a}$。`,
            ),
          });
        }
        const answer = at(a) - 2 * at(b);
        return numberProblem({
          prompt: t(
            `The table defines the function $f$.${shown}What is $f(${a}) - 2f(${b})$?`,
            `表格定义了函数 $f$。${shown}求 $f(${a}) - 2f(${b})$。`,
          ),
          answer,
          wrong: [a - 2 * b, at(a) - at(2 * b > 6 ? b : 2 * b), at(a) - 2 * b, 2 * at(b) - at(a)],
          solution: t(
            `Read each value from the table, then compute: $f(${a}) = ${at(a)}$ and $f(${b}) = ${at(b)}$, so $${at(a)} - 2(${at(b)}) = ${answer}$.`,
            `先从表格读出各值，再计算：$f(${a}) = ${at(a)}$，$f(${b}) = ${at(b)}$，所以 $${at(a)} - 2(${at(b)}) = ${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "combining-a-table-with-a-rule",
      t("Combining a table with a rule", "把表格与解析式结合"),
      t(
        "Two functions may be given in different ways, one by a table and one by a rule. To find $g(f(a))$, read $f(a)$ from the table and put the result into the rule. To find $f(g(a))$, evaluate the rule first and look its output up in the table. The order of the letters decides which comes first.",
        "两个函数可能用不同方式给出：一个用表格，一个用解析式。求 $g(f(a))$ 时，先从表格读出 $f(a)$，再把结果代入解析式。求 $f(g(a))$ 时，先计算解析式，再到表格中查它的结果。字母的先后决定运算的先后。",
      ),
      (rng) => {
        const xs = [-2, -1, 0, 1, 2, 3];
        const ys = xs.map(() => rng.int(-6, 9));
        const at = (x: number) => ys[xs.indexOf(x)] as number;
        const shown = table("x", "f(x)", xs, ys);
        const m = rng.pick([2, 3, -2, 4, -3]);
        const c = rng.int(-5, 5);
        const rule = poly([m, "x"], [c, ""]);
        const g = (x: number) => m * x + c;
        if (rng.bool()) {
          const a = rng.pick(xs);
          const answer = g(at(a));
          return numberProblem({
            prompt: t(
              `The table defines $f$, and $g(x) = ${rule}$.${shown}What is $g(f(${a}))$?`,
              `表格定义了 $f$，且 $g(x) = ${rule}$。${shown}求 $g(f(${a}))$。`,
            ),
            answer,
            wrong: [g(a), at(a), g(a) + at(a), at(a) * m],
            solution: t(
              `Apply $f$ first because it is the inner function: $f(${a}) = ${at(a)}$. Then $g(${at(a)}) = ${m}(${at(a)}) ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${answer}$.`,
              `$f$ 是内层函数，所以先算：$f(${a}) = ${at(a)}$。然后 $g(${at(a)}) = ${m}(${at(a)}) ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${answer}$。`,
            ),
          });
        }
        const target = rng.pick(xs);
        const a = rng.int(-3, 3);
        const d = target - m * a;
        const rule2 = poly([m, "x"], [d, ""]);
        const answer = at(target);
        return numberProblem({
          prompt: t(
            `The table defines $f$, and $g(x) = ${rule2}$.${shown}What is $f(g(${a}))$?`,
            `表格定义了 $f$，且 $g(x) = ${rule2}$。${shown}求 $f(g(${a}))$。`,
          ),
          answer,
          wrong: [target, m * answer + d, xs.includes(a) ? at(a) : target + 1, answer + 1],
          solution: t(
            `Apply $g$ first because it is the inner function: $g(${a}) = ${target}$. Then look up that input in the table: $f(${target}) = ${answer}$.`,
            `$g$ 是内层函数，所以先算：$g(${a}) = ${target}$。然后在表格中查这个自变量：$f(${target}) = ${answer}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Logarithm statements

/** solvingForAnUnknownInALogarithmStatement finds an argument, a base or a value of a logarithm from its statement. */
export const solvingForAnUnknownInALogarithmStatement = topic(
  "solving-for-an-unknown-in-a-logarithm-statement",
  t("Solving for an Unknown in a Logarithm Statement", "求对数式中的未知量"),
  t(
    "Rewrite $\\log_{b} N = k$ as $b^{k} = N$ to find an unknown argument, base or value of a logarithm.",
    "把 $\\log_{b} N = k$ 改写成 $b^{k} = N$，求对数的未知真数、底数或对数值。",
  ),
  ["evaluating-logarithms"],
  ["HSF.BF.B.5"],
  [
    kp(
      "an-unknown-argument",
      t("An unknown argument", "未知的真数"),
      t(
        "The statement $\\log_{b} N = k$ says exactly that $b^{k} = N$: a logarithm is the exponent. So when the argument is unknown, the exponential form computes it directly. For $\\log_{3}(x + 2) = 4$, the argument is $3^{4} = 81$, so $x + 2 = 81$ and $x = 79$.",
        "$\\log_{b} N = k$ 正是说 $b^{k} = N$：对数就是指数。所以真数未知时，用指数形式可以直接算出。对 $\\log_{3}(x + 2) = 4$，真数是 $3^{4} = 81$，所以 $x + 2 = 81$，$x = 79$。",
      ),
      (rng) => {
        const b = rng.pick([2, 3, 4, 5, 6, 10]);
        const k = b === 10 ? rng.int(1, 3) : rng.int(2, b === 2 ? 6 : 3);
        const c = rng.pick([0, 0, rng.int(1, 9), -rng.int(1, 9)]);
        const inner = c === 0 ? "x" : `(${poly([1, "x"], [c, ""])})`;
        const answer = b ** k - c;
        return numberProblem({
          prompt: t(`Solve $\\log_{${b}} ${inner} = ${k}$.`, `解方程 $\\log_{${b}} ${inner} = ${k}$。`),
          answer,
          solveFor: "x",
          wrong: [b * k - c, k ** b - c, b ** k + c, b ** k === answer ? b ** k + 1 : b ** k],
          solution: t(
            `A logarithm is an exponent, so the statement says that $${b}$ to the power $${k}$ equals the argument.${steps(`${c === 0 ? "x" : poly([1, "x"], [c, ""])} = ${b}^{${k}} = ${b ** k}`, `x = ${answer}`)}`,
            `对数就是指数，所以这个式子说明 $${b}$ 的 $${k}$ 次幂等于真数。${steps(`${c === 0 ? "x" : poly([1, "x"], [c, ""])} = ${b}^{${k}} = ${b ** k}`, `x = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "an-unknown-base-or-value",
      t("An unknown base or value", "未知的底数或对数值"),
      t(
        "When the base is unknown in $\\log_{x} N = k$, solve $x^{k} = N$ by taking the $k$-th root, keeping the positive base. When the value is unknown in $\\log_{b} N = x$, solve $b^{x} = N$ by writing both numbers as powers of one base. For $\\log_{4} 8 = x$, $2^{2x} = 2^{3}$ gives $x = \\frac{3}{2}$.",
        "$\\log_{x} N = k$ 中底数未知时，解 $x^{k} = N$，开 $k$ 次方并取正的底数。$\\log_{b} N = x$ 中对数值未知时，解 $b^{x} = N$，把两个数写成同一底数的幂。对 $\\log_{4} 8 = x$，由 $2^{2x} = 2^{3}$ 得 $x = \\frac{3}{2}$。",
      ),
      (rng) => {
        if (rng.bool()) {
          const b = rng.int(2, 9);
          const k = rng.pick([2, 3, b <= 3 ? 4 : 2]);
          const N = b ** k;
          return numberProblem({
            prompt: t(`Solve $\\log_{x} ${N} = ${k}$.`, `解方程 $\\log_{x} ${N} = ${k}$。`),
            answer: b,
            solveFor: "x",
            wrong: [Q.of(N, k), N * k, N ** 2, k],
            solution: t(
              `Write the statement as a power, then take the root; a base must be positive.${steps(`x^{${k}} = ${N}`, `x = ${b}`)}`,
              `把式子写成幂的形式，再开方；底数必须为正。${steps(`x^{${k}} = ${N}`, `x = ${b}`)}`,
            ),
          });
        }
        const r = rng.pick([2, 3, 5]);
        const p = rng.int(1, 4);
        const q = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== p && (r !== 2 || Math.abs(v) <= 5)));
        const b = r ** p;
        const shownN = q > 0 ? `${r ** q}` : `\\frac{1}{${r ** -q}}`;
        return numberProblem({
          prompt: t(`Solve $\\log_{${b}} ${shownN} = x$.`, `解方程 $\\log_{${b}} ${shownN} = x$。`),
          answer: Q.of(q, p),
          solveFor: "x",
          wrong: [Q.of(p, q), Q.of(-q, p), q, Q.of(r ** Math.abs(q), b)],
          solution: t(
            `Write both numbers as powers of $${r}$ and equate the exponents, since powers of one base are equal only when their exponents are.${steps(`${r}^{${p}x} = ${r}^{${q}}`, `x = ${fr(q, p)}`)}`,
            `把两个数都写成 $${r}$ 的幂，并令指数相等，因为同底数的幂相等时指数相等。${steps(`${r}^{${p}x} = ${r}^{${q}}`, `x = ${fr(q, p)}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Geometric sequences

/** findingTermsAndInfiniteSumsOfGeometricSequences finds terms and infinite sums when the ratio is a fraction. */
export const findingTermsAndInfiniteSumsOfGeometricSequences = topic(
  "finding-terms-and-infinite-sums-of-geometric-sequences",
  t("Finding Terms and Infinite Sums of Geometric Sequences", "求等比数列的项与无穷和"),
  t(
    "Find a later term of a geometric sequence with a fractional ratio, and find or use the sum of all its terms.",
    "求公比为分数的等比数列的后面某一项，并求出或运用它所有项的和。",
  ),
  ["finding-the-sum-of-an-infinite-geometric-series"],
  ["HSF.BF.A.2", "HSA.SSE.B.4"],
  [
    kp(
      "a-later-term-with-a-fractional-ratio",
      t("A later term with a fractional ratio", "公比为分数时后面的项"),
      t(
        "The ratio $r$ is any term divided by the term before it, and the $n$-th term is $a_{n} = a_{1}r^{n - 1}$, because reaching term $n$ takes $n - 1$ multiplications. For $48, 24, 12, \\dots$ the ratio is $\\frac{1}{2}$, so $a_{5} = 48\\left(\\frac{1}{2}\\right)^{4} = 3$. A negative ratio makes the signs alternate.",
        "公比 $r$ 是任一项除以它的前一项，第 $n$ 项是 $a_{n} = a_{1}r^{n - 1}$，因为到第 $n$ 项要乘 $n - 1$ 次。对 $48, 24, 12, \\dots$，公比是 $\\frac{1}{2}$，所以 $a_{5} = 48\\left(\\frac{1}{2}\\right)^{4} = 3$。公比为负时符号交替。",
      ),
      (rng) => {
        const d = rng.pick([2, 3]);
        const s = rng.pick([1, -1]);
        const m = rng.int(1, 7);
        const n = rng.int(4, d === 2 ? 7 : 5);
        const a1 = m * d ** (n - 1);
        const term = (i: number) => (a1 * s ** (i - 1)) / d ** (i - 1);
        const answer = term(n);
        return numberProblem({
          prompt: t(
            `A geometric sequence begins $${term(1)}, ${term(2)}, ${term(3)}, \\dots$. What is its term number $${n}$?`,
            `一个等比数列开头是 $${term(1)}, ${term(2)}, ${term(3)}, \\dots$。求它的第 $${n}$ 项。`,
          ),
          answer,
          wrong: [term(n - 1), -answer, Q.of(a1 * s ** n, d ** n), Q.of(a1, d * n), term(2) - (n - 2) * (term(1) - term(2))],
          solution: t(
            `The ratio is $${fr(s, d)}$, since each term is that multiple of the one before it. Term $${n}$ takes $${n - 1}$ multiplications.${steps(`a_{${n}} = ${a1}\\left(${fr(s, d)}\\right)^{${n - 1}} = ${answer}`)}`,
            `公比是 $${fr(s, d)}$，因为每一项都是前一项的这么多倍。第 $${n}$ 项要乘 $${n - 1}$ 次。${steps(`a_{${n}} = ${a1}\\left(${fr(s, d)}\\right)^{${n - 1}} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "the-sum-of-all-the-terms",
      t("The sum of all the terms", "所有项的和"),
      t(
        "When $|r| < 1$, the partial sums of a geometric series approach $S = \\frac{a_{1}}{1 - r}$, because the leftover $r^{n}$ shrinks to zero. So $12 + 6 + 3 + \\dots = \\frac{12}{1 - 1/2} = 24$. The same equation can be solved for $a_{1}$ or for $r$ when the sum is what is known.",
        "当 $|r| < 1$ 时，等比级数的部分和趋近于 $S = \\frac{a_{1}}{1 - r}$，因为余下的 $r^{n}$ 趋于零。所以 $12 + 6 + 3 + \\dots = \\frac{12}{1 - 1/2} = 24$。已知和时，同一个等式也可以用来求 $a_{1}$ 或 $r$。",
      ),
      (rng) => {
        const [p, q] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [1, 5],
          [2, 5],
          [-1, 2],
          [-1, 3],
        ] as const);
        const a = rng.int(2, 30);
        const S = Q.of(a * q, q - p);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `An infinite geometric series has first term $${a}$ and common ratio $${fr(p, q)}$. What is its sum?`,
              `一个无穷等比级数的首项是 $${a}$，公比是 $${fr(p, q)}$。求它的和。`,
            ),
            answer: S,
            wrong: [Q.of(a * q, q + p), Q.of(a * p, q - p), Q.of(a * (q - p), q), Q.of(a * q, p)],
            solution: t(
              `The ratio has size below $1$, so the sum exists and equals the first term over one minus the ratio.${steps(`S = \\frac{${a}}{1 - \\left(${fr(p, q)}\\right)} = ${S.toLatex()}`)}`,
              `公比的绝对值小于 $1$，所以和存在，等于首项除以一减公比。${steps(`S = \\frac{${a}}{1 - \\left(${fr(p, q)}\\right)} = ${S.toLatex()}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `An infinite geometric series has common ratio $${fr(p, q)}$ and sum $${S.toLatex()}$. What is its first term?`,
            `一个无穷等比级数的公比是 $${fr(p, q)}$，和是 $${S.toLatex()}$。求它的首项。`,
          ),
          answer: a,
          wrong: [S, Q.of(a * q * q, (q - p) * (q - p)), Q.of(a * p, q - p), a + 1],
          solution: t(
            `Solve $S = \\frac{a_{1}}{1 - r}$ for the first term by multiplying both sides by $1 - r$.${steps(`a_{1} = S(1 - r) = ${S.toLatex()} \\cdot ${fr(q - p, q)} = ${a}`)}`,
            `两边同乘 $1 - r$，从 $S = \\frac{a_{1}}{1 - r}$ 解出首项。${steps(`a_{1} = S(1 - r) = ${S.toLatex()} \\cdot ${fr(q - p, q)} = ${a}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Topics several courses share: end behavior of polynomials and the common difference

/** endsText describes where a function's outputs go at both ends. */
const endsText = (right: 1 | -1, left: 1 | -1): Text => {
  const sign = (s: number) => (s > 0 ? "" : "-");
  const body = `$f(x) \\to ${sign(right)}\\infty$`;
  const body2 = `$f(x) \\to ${sign(left)}\\infty$`;
  return t(
    `As $x \\to \\infty$, ${body}; as $x \\to -\\infty$, ${body2}`,
    `当 $x \\to \\infty$ 时，${body}；当 $x \\to -\\infty$ 时，${body2}`,
  );
};

/** allEnds lists the four end behaviors. */
const allEnds = (right: 1 | -1, left: 1 | -1): readonly Text[] =>
  (
    [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ] as const
  )
    .filter(([r, l]) => r !== right || l !== left)
    .map(([r, l]) => endsText(r, l));

/** endBehaviorOfPolynomials reads the end behavior of a polynomial from its leading term. */
export const endBehaviorOfPolynomials = topic(
  "end-behavior-of-polynomials",
  t("End Behavior of Polynomials", "多项式的端点行为"),
  t(
    "Decide what a polynomial does at both ends from the degree and sign of its leading term, in expanded or factored form, and recognize a polynomial from its end behavior.",
    "由首项的次数和符号判断多项式（展开式或因式分解式）在两端的走向，并由端点行为辨认多项式。",
  ),
  ["end-behavior"],
  ["HSF.IF.C.7c"],
  [
    kp(
      "end-behavior-from-the-leading-term",
      t("End behavior from the leading term", "由首项判断端点行为"),
      t(
        "For large $|x|$ the term of highest degree outweighs the others, so it alone decides the ends. An even degree makes both ends agree: up when the coefficient is positive, down when negative. An odd degree makes them opposite: a positive coefficient falls on the left and rises on the right, and a negative one does the reverse.",
        "当 $|x|$ 很大时，次数最高的项比其他各项大得多，所以两端的走向只由它决定。次数为偶数时两端方向相同：系数为正时都向上，系数为负时都向下。次数为奇数时两端方向相反：系数为正时左低右高，系数为负时相反。",
      ),
      (rng) => {
        const n = rng.int(2, 7);
        const a = rng.pick([1, 2, 3, 4, 5, -1, -2, -3, -4, -5]);
        const lower = rng.int(1, n - 1);
        const b = rng.pick([2, 3, 5, 7, 9, -2, -3, -6, -8]);
        const c = rng.int(1, 12);
        // Written with a lower term first in half of the problems, so that the leading term must be picked out.
        const terms = poly([b, lower === 1 ? "x" : `x^{${lower}}`], [a, `x^{${n}}`], [c, ""]);
        const ordered = poly([a, `x^{${n}}`], [b, lower === 1 ? "x" : `x^{${lower}}`], [c, ""]);
        const shown = rng.bool() ? terms : ordered;
        const right: 1 | -1 = a > 0 ? 1 : -1;
        const left: 1 | -1 = n % 2 === 0 ? right : right === 1 ? -1 : 1;
        return pickChoice(
          rng,
          t(`Which describes the end behavior of $f(x) = ${shown}$?`, `哪一项描述了 $f(x) = ${shown}$ 的端点行为？`),
          endsText(right, left),
          allEnds(right, left),
          t(
            `The term of highest degree decides the ends, and here it is $${poly([a, `x^{${n}}`])}$. Its degree $${n}$ is ${n % 2 === 0 ? "even, so both ends go the same way" : "odd, so the ends go opposite ways"}, and its coefficient is ${a > 0 ? "positive" : "negative"}, so the right end goes ${a > 0 ? "up" : "down"}.`,
            `次数最高的项决定两端走向，这里是 $${poly([a, `x^{${n}}`])}$。它的次数 $${n}$ 是${n % 2 === 0 ? "偶数，所以两端方向相同" : "奇数，所以两端方向相反"}，系数为${a > 0 ? "正" : "负"}，所以右端向${a > 0 ? "上" : "下"}。`,
          ),
        );
      },
    ),
    kp(
      "end-behavior-of-a-factored-polynomial",
      t("End behavior of a factored polynomial", "因式分解式的端点行为"),
      t(
        "A factored polynomial does not need expanding. Multiply only the leading terms of the factors, each raised to its power, and the constant in front. For $-2(x - 1)^{2}(3 - x)$ that gives $-2 \\cdot x^{2} \\cdot (-x) = 2x^{3}$, so the leading term has odd degree and a positive coefficient. Watch for factors such as $3 - x$, where $x$ is negative.",
        "因式分解式不必展开。只需把前面的常数和各因式的最高次项（连同它的乘方）相乘。对 $-2(x - 1)^{2}(3 - x)$，得 $-2 \\cdot x^{2} \\cdot (-x) = 2x^{3}$，所以首项次数为奇数，系数为正。要留意 $3 - x$ 这样的因式，其中 $x$ 的系数是负的。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const r = rng.int(1, 6);
        const s = rng.int(1, 6);
        const p = rng.int(1, 3);
        const flip = rng.bool();
        const q = rng.int(1, 2);
        const n = p + q;
        const lead = a * (flip ? (-1) ** q : 1);
        const front = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const pow = (v: number) => (v === 1 ? "" : `^{${v}}`);
        const second = flip ? `(${s} - x)` : `(x + ${s})`;
        const shown = `${front}(x - ${r})${pow(p)}${second}${pow(q)}`;
        const right: 1 | -1 = lead > 0 ? 1 : -1;
        const left: 1 | -1 = n % 2 === 0 ? right : right === 1 ? -1 : 1;
        return pickChoice(
          rng,
          t(`Which describes the end behavior of $f(x) = ${shown}$?`, `哪一项描述了 $f(x) = ${shown}$ 的端点行为？`),
          endsText(right, left),
          allEnds(right, left),
          t(
            `Only the leading terms of the factors matter at the ends. Multiplying them gives a leading term with coefficient sign ${lead > 0 ? "positive" : "negative"} and degree $${n}$, ${n % 2 === 0 ? "even, so both ends match" : "odd, so the ends are opposite"}.${steps(`\\text{leading term: } ${poly([lead, n === 1 ? "x" : `x^{${n}}`])}`)}`,
            `在两端只有各因式的最高次项起作用。把它们相乘，得到系数为${lead > 0 ? "正" : "负"}、次数为 $${n}$ 的首项，次数是${n % 2 === 0 ? "偶数，所以两端方向相同" : "奇数，所以两端方向相反"}。${steps(`\\text{leading term: } ${poly([lead, n === 1 ? "x" : `x^{${n}}`])}`)}`,
          ),
        );
      },
    ),
    kp(
      "a-polynomial-from-its-end-behavior",
      t("A polynomial from its end behavior", "由端点行为辨认多项式"),
      t(
        "To go from the behavior back to a formula, read the two facts separately. If the ends agree the degree is even, and if they differ it is odd. The right end then gives the sign of the leading coefficient: up means positive and down means negative. Ignore all the lower terms, since they cannot change the ends.",
        "由走向反推解析式时，把两个事实分开来读。两端方向相同则次数为偶数，不同则为奇数。再由右端确定首项系数的符号：向上为正，向下为负。较低次的项可以不管，因为它们改变不了两端的走向。",
      ),
      (rng) => {
        const right: 1 | -1 = rng.pick([1, -1]);
        const left: 1 | -1 = rng.pick([1, -1]);
        const even = rng.pick([2, 4, 6]);
        const odd = rng.pick([3, 5, 7]);
        const a = rng.int(1, 5);
        const b = rng.pick([2, 3, -4, -5, 6, -7]);
        const c = rng.int(1, 9);
        const make = (sign: number, n: number) => math(poly([sign * a, `x^{${n}}`], [b, "x"], [c, ""]));
        const n = right === left ? even : odd;
        const other = right === left ? odd : even;
        return pickChoice(
          rng,
          t(
            `A polynomial function has $f(0) = ${c}$ and this end behavior: ${endsText(right, left).en}. Which could be the function?`,
            `一个多项式函数满足 $f(0) = ${c}$，端点行为是：${endsText(right, left)["zh-CN"]}。它可能是下面哪个函数？`,
          ),
          make(right, n),
          [make(-right, n), make(right, other), make(-right, other)],
          t(
            `The ends ${right === left ? "agree, so the degree is even" : "differ, so the degree is odd"}. The right end goes ${right > 0 ? "up" : "down"}, so the leading coefficient is ${right > 0 ? "positive" : "negative"}.`,
            `两端方向${right === left ? "相同，所以次数为偶数" : "不同，所以次数为奇数"}。右端向${right > 0 ? "上" : "下"}，所以首项系数为${right > 0 ? "正" : "负"}。`,
          ),
        );
      },
    ),
  ],
);

/** findingTheCommonDifferenceOfAnArithmeticSequence finds the common difference from terms, formulas and two far-apart terms. */
export const findingTheCommonDifferenceOfAnArithmeticSequence = topic(
  "finding-the-common-difference-of-an-arithmetic-sequence",
  t("Finding the Common Difference of an Arithmetic Sequence", "求等差数列的公差"),
  t(
    "Find the common difference of an arithmetic sequence from its listed terms, from a formula, and from two terms that are not next to each other.",
    "由列出的项、由公式、由两个不相邻的项求等差数列的公差。",
  ),
  ["explicit-and-recursive-arithmetic-formulas"],
  ["HSF.BF.A.2", "HSF.LE.A.2"],
  [
    kp(
      "the-difference-from-listed-terms",
      t("The difference from listed terms", "由列出的项求公差"),
      t(
        "The common difference $d$ is what each term adds to the one before it, so subtract in that order: $d = a_{n + 1} - a_{n}$. For $20, 17, 14, \\dots$ the difference is $17 - 20 = -3$, negative because the terms decrease. Subtracting in the other order gives the wrong sign.",
        "公差 $d$ 是每一项比前一项多出的量，所以要按这个顺序相减：$d = a_{n + 1} - a_{n}$。对 $20, 17, 14, \\dots$，公差是 $17 - 20 = -3$，因为各项递减所以为负。反过来相减就会得到错误的符号。",
      ),
      (rng) => {
        const a = rng.int(-20, 40);
        const d = rng.pick([-12, -9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 11, 15]);
        const s = rng.int(0, 2);
        const seq = [a, a + d, a + 2 * d, a + 3 * d];
        return numberProblem({
          prompt: t(
            `What is the common difference of the arithmetic sequence $${seq.join(", ")}, \\dots$?`,
            `等差数列 $${seq.join(", ")}, \\dots$ 的公差是多少？`,
          ),
          answer: d,
          solveFor: "d",
          wrong: [-d, 2 * d, a + d + a, Math.abs(d) === 1 ? 3 : d + 1],
          solution: t(
            `Subtract a term from the one after it, because the difference is what each term adds to the previous one: $${seq[s + 1]} - ${(seq[s] as number) < 0 ? `(${seq[s]})` : seq[s]} = ${d}$.`,
            `用后一项减去前一项，因为公差是每一项比前一项多出的量：$${seq[s + 1]} - ${(seq[s] as number) < 0 ? `(${seq[s]})` : seq[s]} = ${d}$。`,
          ),
        });
      },
    ),
    kp(
      "the-difference-from-a-formula",
      t("The difference from a formula", "由公式求公差"),
      t(
        "In $a_{n} = a_{1} + d(n - 1)$ the difference is the number multiplying $n - 1$. Written as $a_{n} = dn + c$, it is the coefficient of $n$, not the constant, because raising $n$ by one adds exactly that coefficient. In a recursive formula $a_{n} = a_{n - 1} + d$, it is the number added to the previous term.",
        "在 $a_{n} = a_{1} + d(n - 1)$ 中，公差是乘 $n - 1$ 的数。写成 $a_{n} = dn + c$ 时，公差是 $n$ 的系数，而不是常数，因为 $n$ 增加一时恰好增加这个系数。在递推公式 $a_{n} = a_{n - 1} + d$ 中，公差是加到前一项上的数。",
      ),
      (rng) => {
        const d = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const a = rng.pick([-8, -5, -3, -1, 1, 4, 6, 10, 12, 15, 20, 25]);
        const form = rng.int(0, 2);
        const shown =
          form === 0
            ? `a_{n} = ${a} ${d < 0 ? "-" : "+"} ${Math.abs(d)}(n - 1)`
            : form === 1
              ? `a_{n} = ${poly([d, "n"], [a, ""])}`
              : `a_{1} = ${a}, \\quad a_{n} = ${poly([1, "a_{n - 1}"], [d, ""])}`;
        const c = form === 0 ? a + d : form === 1 ? a + 2 * d : a + d;
        return numberProblem({
          prompt: t(
            `An arithmetic sequence is given by $${shown}$. What is its common difference?`,
            `一个等差数列由 $${shown}$ 给出。它的公差是多少？`,
          ),
          answer: d,
          solveFor: "d",
          wrong: [a, -d, c, d + a],
          solution: t(
            form === 2
              ? `The formula adds the same number to the previous term each time, and that number is the common difference, $${d}$.`
              : `Raising $n$ by one changes the term by the number multiplying $n$, so the common difference is $${d}$.`,
            form === 2
              ? `公式每次都给前一项加上同一个数，这个数就是公差 $${d}$。`
              : `$n$ 增加一时，项的变化量就是乘 $n$ 的数，所以公差是 $${d}$。`,
          ),
        });
      },
    ),
    kp(
      "the-difference-from-two-separated-terms",
      t("The difference from two separated terms", "由两个不相邻的项求公差"),
      t(
        "Going from term $m$ to term $n$ takes $n - m$ steps, each adding $d$. So $d = \\frac{a_{n} - a_{m}}{n - m}$: the change in value over the number of steps. If $a_{3} = 11$ and $a_{8} = 31$, there are $5$ steps sharing a change of $20$, so $d = 4$. Dividing by $8$ or by $3$ is the usual slip.",
        "从第 $m$ 项到第 $n$ 项要走 $n - m$ 步，每步加 $d$。所以 $d = \\frac{a_{n} - a_{m}}{n - m}$，即值的变化量除以步数。若 $a_{3} = 11$，$a_{8} = 31$，则 $5$ 步共变化 $20$，所以 $d = 4$。除以 $8$ 或 $3$ 是常见的错误。",
      ),
      (rng) => {
        const d = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const m = rng.int(1, 8);
        const gap = rng.int(2, 9);
        const n = m + gap;
        const am = rng.int(-15, 30);
        const an = am + d * gap;
        return numberProblem({
          prompt: t(
            `In an arithmetic sequence, $a_{${m}} = ${am}$ and $a_{${n}} = ${an}$. What is the common difference?`,
            `在一个等差数列中，$a_{${m}} = ${am}$，$a_{${n}} = ${an}$。公差是多少？`,
          ),
          answer: d,
          solveFor: "d",
          wrong: [an - am, -d, Q.of(an - am, n), Q.of(an, n), Q.of(an + am, gap)],
          solution: t(
            `There are $${n} - ${m} = ${gap}$ steps between the two terms, and each adds the same $d$, so share the change among them.${steps(`d = \\frac{${an} - ${am < 0 ? `(${am})` : am}}{${gap}} = ${d}`)}`,
            `两项之间有 $${n} - ${m} = ${gap}$ 步，每步加同样的 $d$，所以把变化量平均分给这些步。${steps(`d = \\frac{${an} - ${am < 0 ? `(${am})` : am}}{${gap}} = ${d}`)}`,
          ),
        });
      },
    ),
  ],
);

/** actFundamentalsReasoningAlgebraTopics lists the algebra and function reasoning topics of ACT Math Fundamentals, and two topics other courses share. */
export const actFundamentalsReasoningAlgebraTopics: readonly TopicDef[] = [
  formingRelatedConditionalStatements,
  applyingACommonMultiple,
  solvingAndAdjustingAGivenFormula,
  matchingSimpleQuadraticInequalitiesToNumberLines,
  simplifyingExponentialRadicalExpressions,
  usingScientificNotationWithExponentialValues,
  identifyingImpossibleCasesOfSymbolicQuotients,
  reasoningWithTrigonometricIdentities,
  reasoningFromFunctionRepresentations,
  solvingForAnUnknownInALogarithmStatement,
  findingTermsAndInfiniteSumsOfGeometricSequences,
  endBehaviorOfPolynomials,
  findingTheCommonDifferenceOfAnArithmeticSequence,
];
