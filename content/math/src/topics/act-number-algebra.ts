import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, pointProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// ACT Math, number and algebra: ones digits of powers, digits of expansions in powers of a base, counting integers
// between bounds, defined operations, properties of operations, comparing quantities under constraints, slant
// asymptotes, joint variation, real-number restrictions, expressions evaluated from given relations, matrix equations
// and models, sums and differences of cubes in rational expressions, and systems solved from graphs.

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
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem, figure?: Figure): KnowledgePointDef {
  return figure ? { id, title, explanation, generate, figure } : { id, title, explanation, generate };
}

/** distinct drops the values equal to the answer or to an earlier value. */
function distinct(answer: Q, values: readonly Q[]): Q[] {
  const out: Q[] = [];
  for (const v of values) if (!v.eq(answer) && !out.some((o) => o.eq(v))) out.push(v);
  return out;
}

/** paren wraps a negative number in parentheses. */
const paren = (v: number) => (v < 0 ? `(${v})` : String(v));

// ---------------------------------------------------------------------------
// Number theory

/** cycleOf lists the ones digits of d¹, d², d³, … until they repeat. */
function cycleOf(d: number): number[] {
  const out: number[] = [];
  let v = d % 10;
  while (!out.includes(v)) {
    out.push(v);
    v = (v * d) % 10;
  }
  return out;
}

/** onesDigit is the ones digit of b^n for n ≥ 1. */
function onesDigit(b: number, n: number): number {
  const c = cycleOf(b % 10);
  return c[(n - 1) % c.length]!;
}

/** findingOnesDigitsOfPowers finds ones digits of large powers from the repeating cycle of ones digits. */
export const findingOnesDigitsOfPowers = topic(
  "finding-ones-digits-of-powers",
  t("Finding Ones Digits of Powers From Repeating Blocks", "利用循环节求幂的个位数字"),
  t(
    "Find the ones digit of a large power from the repeating block of ones digits of its powers, and combine ones digits in sums and products.",
    "利用幂的个位数字的循环规律求大指数幂的个位数字，并求和与积的个位数字。",
  ),
  ["powers-of-integers", "finding-remainders"],
  ["8.EE.A.1"],
  [
    kp(
      "the-cycle-of-ones-digits",
      t("The cycle of ones digits", "个位数字的循环"),
      t(
        "The ones digit of a product depends only on the ones digits of the factors, so the ones digits of $b, b^{2}, b^{3}, \\dots$ repeat in a short block. For $7$ the block is $7, 9, 3, 1$, of length $4$. To find the ones digit of $7^{50}$, divide $50$ by $4$: the remainder is $2$, so the ones digit is the second in the block, $9$. A remainder of $0$ means the last digit of the block.",
        "积的个位数字只取决于各因数的个位数字，所以 $b, b^{2}, b^{3}, \\dots$ 的个位数字会按一个较短的块循环。$7$ 的循环块是 $7, 9, 3, 1$，长度为 $4$。要求 $7^{50}$ 的个位数字，用 $50$ 除以 $4$，余数为 $2$，所以个位数字是块中第二个数 $9$。余数为 $0$ 时取块中的最后一个数。",
      ),
      (rng) => {
        const b = rng.pick([2, 3, 4, 7, 8, 9, 12, 13, 17, 18, 23, 27, 33, 38]);
        const n = rng.int(10, 120);
        const c = cycleOf(b % 10);
        const r = n % c.length;
        const answer = onesDigit(b, n);
        return numberProblem({
          prompt: t(`What is the ones digit of $${b}^{${n}}$?`, `$${b}^{${n}}$ 的个位数字是多少？`),
          answer,
          form: "integer",
          wrong: distinct(
            Q.of(answer),
            c.map((d) => Q.of(d)),
          ),
          solution: t(
            `The ones digits of the powers of $${b}$ repeat in the block $${c.join(", ")}$ of length $${c.length}$. Since $${n} = ${c.length} \\cdot ${Math.floor(n / c.length)} + ${r}$, the ones digit is ${r === 0 ? "the last" : `number $${r}$`} in the block: $${answer}$.`,
            `$${b}$ 的幂的个位数字按块 $${c.join(", ")}$ 循环，长度为 $${c.length}$。因为 $${n} = ${c.length} \\cdot ${Math.floor(n / c.length)} + ${r}$，个位数字是块中${r === 0 ? "最后一个" : `第 $${r}$ 个`}数：$${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "ones-digits-of-sums-and-products",
      t("Ones digits of sums and products of powers", "幂的和与积的个位数字"),
      t(
        "To find the ones digit of a sum or product of powers, find the ones digit of each power from its cycle, then add or multiply those digits and keep only the ones digit of the result. For $3^{21} + 4^{10}$: the ones digit of $3^{21}$ is $3$ and that of $4^{10}$ is $6$, so the sum ends in the ones digit of $3 + 6 = 9$.",
        "要求幂的和或积的个位数字，先由循环规律求出每个幂的个位数字，再把这些数字相加或相乘，只保留结果的个位数字。对于 $3^{21} + 4^{10}$：$3^{21}$ 的个位数字是 $3$，$4^{10}$ 的个位数字是 $6$，所以和的个位数字是 $3 + 6 = 9$ 的个位数字。",
      ),
      (rng) => {
        const a = rng.pick([2, 3, 4, 7, 8, 9]);
        let b = rng.pick([2, 3, 4, 7, 8, 9]);
        while (b === a) b = rng.pick([2, 3, 4, 7, 8, 9]);
        const m = rng.int(10, 60);
        const n = rng.int(10, 60);
        const da = onesDigit(a, m);
        const db = onesDigit(b, n);
        const product = rng.bool();
        const answer = product ? (da * db) % 10 : (da + db) % 10;
        return numberProblem({
          prompt: t(
            `What is the ones digit of $${a}^{${m}} ${product ? "\\cdot" : "+"} ${b}^{${n}}$?`,
            `$${a}^{${m}} ${product ? "\\cdot" : "+"} ${b}^{${n}}$ 的个位数字是多少？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(product ? (da + db) % 10 : (da * db) % 10), Q.of(da), Q.of(db), Q.of((a * b) % 10)]),
          solution: t(
            `The ones digit of $${a}^{${m}}$ is $${da}$ and the ones digit of $${b}^{${n}}$ is $${db}$. The ${product ? `product $${da} \\cdot ${db} = ${da * db}$` : `sum $${da} + ${db} = ${da + db}$`} has ones digit $${answer}$.`,
            `$${a}^{${m}}$ 的个位数字是 $${da}$，$${b}^{${n}}$ 的个位数字是 $${db}$。${product ? `积 $${da} \\cdot ${db} = ${da * db}$` : `和 $${da} + ${db} = ${da + db}$`} 的个位数字是 $${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** recoveringDigitsFromBaseExpansions finds the digits of a number written in powers of a base by repeated division. */
export const recoveringDigitsFromBaseExpansions = topic(
  "recovering-digits-from-base-expansions",
  t("Recovering Restricted Digits in a Powers-of-a-Base Expansion", "由按幂展开的式子求受限的数字"),
  t(
    "Write a number as a sum of multiples of powers of a base with restricted digits, and recover those digits by division.",
    "把一个数写成某个底数的各次幂的倍数之和（系数受限制），并用除法求出这些系数。",
  ),
  ["finding-remainders", "powers-of-integers"],
  ["N-RN.A.2"],
  [
    kp(
      "finding-one-digit",
      t("Finding one digit", "求某一位数字"),
      t(
        "If $N = a \\cdot b^{2} + c \\cdot b + d$ with whole numbers $a$, $c$, $d$ each less than $b$, then these digits are unique and can be found by division. Divide $N$ by $b$: the remainder is $d$. Divide the quotient by $b$ again: the remainder is $c$ and the quotient is $a$. For $N = 47$ and $b = 5$: $47 = 5 \\cdot 9 + 2$ and $9 = 5 \\cdot 1 + 4$, so $47 = 1 \\cdot 5^{2} + 4 \\cdot 5 + 2$.",
        "若 $N = a \\cdot b^{2} + c \\cdot b + d$，其中整数 $a$、$c$、$d$ 都小于 $b$ 且不为负，则这些系数是唯一的，可以用除法求出。用 $b$ 除 $N$，余数是 $d$；再用 $b$ 除所得的商，余数是 $c$，商是 $a$。对于 $N = 47$，$b = 5$：$47 = 5 \\cdot 9 + 2$，$9 = 5 \\cdot 1 + 4$，所以 $47 = 1 \\cdot 5^{2} + 4 \\cdot 5 + 2$。",
      ),
      (rng) => {
        const b = rng.int(3, 9);
        const a = rng.int(1, b - 1);
        const c = rng.int(0, b - 1);
        const d = rng.int(0, b - 1);
        const n = a * b * b + c * b + d;
        const ask = rng.pick(["a", "c", "d"] as const);
        const answer = { a, c, d }[ask];
        const q1 = Math.floor(n / b);
        return numberProblem({
          prompt: t(
            `The number $${n}$ can be written as $a \\cdot ${b}^{2} + c \\cdot ${b} + d$, where $a$, $c$ and $d$ are whole numbers less than $${b}$. What is the value of $${ask}$?`,
            `数 $${n}$ 可以写成 $a \\cdot ${b}^{2} + c \\cdot ${b} + d$，其中 $a$、$c$、$d$ 都是小于 $${b}$ 的非负整数。求 $${ask}$ 的值。`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(a), Q.of(c), Q.of(d), Q.of(q1 % 10), Q.of(n % 10)]),
          solution: t(
            `Divide by $${b}$ twice:${steps(`${n} = ${b} \\cdot ${q1} + ${d}`, `${q1} = ${b} \\cdot ${a} + ${c}`)}So $${n} = ${a} \\cdot ${b}^{2} + ${c} \\cdot ${b} + ${d}$ and $${ask} = ${answer}$.`,
            `用 $${b}$ 连除两次：${steps(`${n} = ${b} \\cdot ${q1} + ${d}`, `${q1} = ${b} \\cdot ${a} + ${c}`)}所以 $${n} = ${a} \\cdot ${b}^{2} + ${c} \\cdot ${b} + ${d}$，$${ask} = ${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "four-digit-expansions",
      t("Expansions with four digits", "四位的展开式"),
      t(
        "With powers up to $b^{3}$, divide by $b$ three times. Each remainder is the next digit from the right, and the last quotient is the leading digit; it must also be less than $b$. For $N = 194$ and $b = 5$: $194 = 5 \\cdot 38 + 4$, $38 = 5 \\cdot 7 + 3$ and $7 = 5 \\cdot 1 + 2$, so $194 = 1 \\cdot 5^{3} + 2 \\cdot 5^{2} + 3 \\cdot 5 + 4$. Check by expanding: $125 + 50 + 15 + 4 = 194$.",
        "当用到 $b^{3}$ 时，用 $b$ 连除三次。每个余数依次是从右往左的下一位数字，最后的商是最高位数字，它也必须小于 $b$。对于 $N = 194$，$b = 5$：$194 = 5 \\cdot 38 + 4$，$38 = 5 \\cdot 7 + 3$，$7 = 5 \\cdot 1 + 2$，所以 $194 = 1 \\cdot 5^{3} + 2 \\cdot 5^{2} + 3 \\cdot 5 + 4$。展开检验：$125 + 50 + 15 + 4 = 194$。",
      ),
      (rng) => {
        const b = rng.int(2, 6);
        const ds = [rng.int(1, b - 1), rng.int(0, b - 1), rng.int(0, b - 1), rng.int(0, b - 1)];
        const n = ds.reduce((s, x) => s * b + x, 0);
        const sum = ds.reduce((s, x) => s + x, 0);
        const q1 = Math.floor(n / b);
        const q2 = Math.floor(q1 / b);
        return numberProblem({
          prompt: t(
            `The number $${n}$ is written as $p \\cdot ${b}^{3} + q \\cdot ${b}^{2} + r \\cdot ${b} + s$, where $p$, $q$, $r$ and $s$ are whole numbers less than $${b}$. What is $p + q + r + s$?`,
            `数 $${n}$ 写成 $p \\cdot ${b}^{3} + q \\cdot ${b}^{2} + r \\cdot ${b} + s$，其中 $p$、$q$、$r$、$s$ 都是小于 $${b}$ 的非负整数。求 $p + q + r + s$。`,
          ),
          answer: sum,
          form: "integer",
          wrong: distinct(Q.of(sum), [
            Q.of(
              String(n)
                .split("")
                .reduce((s, x) => s + Number(x), 0),
            ),
            Q.of(ds[0]! + ds[3]!),
            Q.of(q2 + (q1 % b) + (n % b)),
          ]),
          solution: t(
            `Divide by $${b}$ three times:${steps(`${n} = ${b} \\cdot ${q1} + ${ds[3]}`, `${q1} = ${b} \\cdot ${q2} + ${ds[2]}`, `${q2} = ${b} \\cdot ${ds[0]} + ${ds[1]}`)}So $p = ${ds[0]}$, $q = ${ds[1]}$, $r = ${ds[2]}$, $s = ${ds[3]}$, and the sum is $${sum}$.`,
            `用 $${b}$ 连除三次：${steps(`${n} = ${b} \\cdot ${q1} + ${ds[3]}`, `${q1} = ${b} \\cdot ${q2} + ${ds[2]}`, `${q2} = ${b} \\cdot ${ds[0]} + ${ds[1]}`)}所以 $p = ${ds[0]}$，$q = ${ds[1]}$，$r = ${ds[2]}$，$s = ${ds[3]}$，和为 $${sum}$。`,
          ),
        });
      },
    ),
  ],
);

/** countingIntegersWithinBounds counts the integers that satisfy compound inequalities and bounds on square roots. */
export const countingIntegersWithinBounds = topic(
  "counting-integers-within-bounds",
  t("Finding Integers a Bound Allows", "求范围所允许的整数"),
  t(
    "Count the integers that satisfy a compound inequality or lie between bounds on a square root, paying attention to which endpoints are included.",
    "计算满足复合不等式或平方根范围的整数个数，注意端点是否包括在内。",
  ),
  ["solving-compound-inequalities", "approximating-square-roots"],
  ["A-REI.B.3", "8.NS.A.2"],
  [
    kp(
      "integers-satisfying-a-compound-inequality",
      t("Integers satisfying a compound inequality", "满足复合不等式的整数"),
      t(
        "Solve the compound inequality for the variable, then count the integers in the interval. From $m$ to $n$ inclusive there are $n - m + 1$ integers; leave out an endpoint when its inequality is strict. For $-4 < 2n + 2 \\le 12$, subtract $2$ and divide by $2$ to get $-3 < n \\le 5$, so $n$ is one of $-2, -1, \\dots, 5$: that is $8$ integers.",
        "先解出复合不等式中的变量，再数区间内的整数。从 $m$ 到 $n$（包括两端）共有 $n - m + 1$ 个整数；某端不等号为严格不等号时不包括该端点。对于 $-4 < 2n + 2 \\le 12$，减去 $2$ 再除以 $2$，得 $-3 < n \\le 5$，所以 $n$ 是 $-2, -1, \\dots, 5$ 中的一个：共 $8$ 个整数。",
      ),
      (rng) => {
        const k = rng.int(2, 5);
        const c = rng.int(-9, 9);
        const lo = rng.int(-12, 3);
        const hi = lo + rng.int(3, 15);
        const strictLo = rng.bool();
        const strictHi = rng.bool();
        const first = strictLo ? lo + 1 : lo;
        const last = strictHi ? hi - 1 : hi;
        const count = last - first + 1;
        const L = k * lo + c;
        const H = k * hi + c;
        const expr = `${k}n ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
        return numberProblem({
          prompt: t(
            `How many integers $n$ satisfy $${L} ${strictLo ? "<" : "\\le"} ${expr} ${strictHi ? "<" : "\\le"} ${H}$?`,
            `有多少个整数 $n$ 满足 $${L} ${strictLo ? "<" : "\\le"} ${expr} ${strictHi ? "<" : "\\le"} ${H}$？`,
          ),
          answer: count,
          form: "integer",
          wrong: distinct(Q.of(count), [Q.of(hi - lo + 1), Q.of(hi - lo), Q.of(hi - lo - 1), Q.of(H - L + 1)]),
          solution: t(
            `Subtract $${c}$ and divide by $${k}$: $${lo} ${strictLo ? "<" : "\\le"} n ${strictHi ? "<" : "\\le"} ${hi}$. The integers are $${first}$ through $${last}$, which is $${last} - ${paren(first)} + 1 = ${count}$ integers.`,
            `减去 $${c}$ 再除以 $${k}$：$${lo} ${strictLo ? "<" : "\\le"} n ${strictHi ? "<" : "\\le"} ${hi}$。整数为 $${first}$ 到 $${last}$，共 $${last} - ${paren(first)} + 1 = ${count}$ 个。`,
          ),
        });
      },
    ),
    kp(
      "integers-between-square-root-bounds",
      t("Integers between bounds on a square root", "平方根范围内的整数"),
      t(
        "For a positive integer $n$, the inequality $a < \\sqrt{n} < b$ with positive $a$ and $b$ is the same as $a^{2} < n < b^{2}$, since squaring keeps the order of positive numbers. For $3 < \\sqrt{n} < 5$, $9 < n < 25$, so $n$ is one of $10, 11, \\dots, 24$: $15$ integers. With $\\le$ instead of $<$, include $a^{2}$ or $b^{2}$.",
        "对于正整数 $n$，当 $a$、$b$ 为正数时，不等式 $a < \\sqrt{n} < b$ 等价于 $a^{2} < n < b^{2}$，因为平方不改变正数的大小顺序。对于 $3 < \\sqrt{n} < 5$，有 $9 < n < 25$，所以 $n$ 是 $10, 11, \\dots, 24$ 中的一个：共 $15$ 个整数。若是 $\\le$ 而不是 $<$，则要包括 $a^{2}$ 或 $b^{2}$。",
      ),
      (rng) => {
        const a = rng.int(1, 9);
        const b = a + rng.int(1, 4);
        const strictLo = rng.bool();
        const strictHi = rng.bool();
        const first = strictLo ? a * a + 1 : a * a;
        const last = strictHi ? b * b - 1 : b * b;
        const count = last - first + 1;
        return numberProblem({
          prompt: t(
            `How many integers $n$ satisfy $${a} ${strictLo ? "<" : "\\le"} \\sqrt{n} ${strictHi ? "<" : "\\le"} ${b}$?`,
            `有多少个整数 $n$ 满足 $${a} ${strictLo ? "<" : "\\le"} \\sqrt{n} ${strictHi ? "<" : "\\le"} ${b}$？`,
          ),
          answer: count,
          form: "integer",
          wrong: distinct(Q.of(count), [Q.of(b - a + 1), Q.of(b - a - 1), Q.of(b * b - a * a), Q.of(b * b - a * a + 1)]),
          solution: t(
            `Square every part: $${a * a} ${strictLo ? "<" : "\\le"} n ${strictHi ? "<" : "\\le"} ${b * b}$. The integers are $${first}$ through $${last}$, which is $${last} - ${first} + 1 = ${count}$ integers.`,
            `各部分平方：$${a * a} ${strictLo ? "<" : "\\le"} n ${strictHi ? "<" : "\\le"} ${b * b}$。整数为 $${first}$ 到 $${last}$，共 $${last} - ${first} + 1 = ${count}$ 个。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Expressions and operations

/** DefinedOp is an operation a ◇ b given by a formula. */
interface DefinedOp {
  readonly latex: string;
  readonly f: (a: number, b: number) => number;
  readonly show: (a: number, b: number) => string;
}

/** definedOps are the operations of the defined-operation problems; each is linear in a for a fixed b. */
const definedOps: readonly DefinedOp[] = [
  { latex: "a \\diamond b = 2a - b^{2}", f: (a, b) => 2 * a - b * b, show: (a, b) => `2${paren(a)} - ${paren(b)}^{2}` },
  { latex: "a \\diamond b = ab + a - b", f: (a, b) => a * b + a - b, show: (a, b) => `${paren(a)}${paren(b)} + ${paren(a)} - ${paren(b)}` },
  { latex: "a \\diamond b = 3a + 2b", f: (a, b) => 3 * a + 2 * b, show: (a, b) => `3${paren(a)} + 2${paren(b)}` },
  { latex: "a \\diamond b = a(b + 1)", f: (a, b) => a * (b + 1), show: (a, b) => `${paren(a)}(${paren(b)} + 1)` },
  { latex: "a \\diamond b = 4a - 3b", f: (a, b) => 4 * a - 3 * b, show: (a, b) => `4${paren(a)} - 3${paren(b)}` },
  { latex: "a \\diamond b = a + b^{2}", f: (a, b) => a + b * b, show: (a, b) => `${paren(a)} + ${paren(b)}^{2}` },
];

/** applyingDefinedOperations evaluates and solves with operations defined by formulas. */
export const applyingDefinedOperations = topic(
  "applying-defined-operations",
  t("Applying Defined Operations", "运用自定义运算"),
  t(
    "Evaluate an operation defined by a formula, including nested uses, and solve equations that contain it.",
    "按公式定义的运算求值（包括嵌套使用），并解含有这种运算的方程。",
  ),
  ["evaluating-algebraic-expressions", "two-step-equations"],
  ["A-SSE.A.1"],
  [
    kp(
      "evaluating-a-defined-operation",
      t("Evaluating a defined operation", "按定义求值"),
      t(
        "A defined operation such as $a \\diamond b = 2a - b^{2}$ is a rule: replace $a$ with the first number and $b$ with the second, then evaluate. So $5 \\diamond 3 = 2(5) - 3^{2} = 1$. Order matters, since $3 \\diamond 5 = 2(3) - 5^{2} = -19$. For a nested expression such as $(1 \\diamond 2) \\diamond 3$, evaluate the inside first.",
        "像 $a \\diamond b = 2a - b^{2}$ 这样的自定义运算是一条规则：用第一个数替换 $a$，用第二个数替换 $b$，再计算。所以 $5 \\diamond 3 = 2(5) - 3^{2} = 1$。顺序很重要，因为 $3 \\diamond 5 = 2(3) - 5^{2} = -19$。对于像 $(1 \\diamond 2) \\diamond 3$ 这样的嵌套式子，先算括号里面的。",
      ),
      (rng) => {
        const op = rng.pick(definedOps);
        const x = rng.int(-6, 9);
        const y = rng.int(-5, 6);
        const nested = rng.bool(0.4);
        const z = rng.int(-3, 4);
        const inner = op.f(x, y);
        const answer = nested ? op.f(inner, z) : inner;
        const swapped = nested ? op.f(z, inner) : op.f(y, x);
        return numberProblem({
          prompt: nested
            ? t(
                `For all numbers $a$ and $b$, let $${op.latex}$. What is the value of $(${x} \\diamond ${paren(y)}) \\diamond ${paren(z)}$?`,
                `对所有数 $a$、$b$，令 $${op.latex}$。求 $(${x} \\diamond ${paren(y)}) \\diamond ${paren(z)}$ 的值。`,
              )
            : t(
                `For all numbers $a$ and $b$, let $${op.latex}$. What is the value of $${x} \\diamond ${paren(y)}$?`,
                `对所有数 $a$、$b$，令 $${op.latex}$。求 $${x} \\diamond ${paren(y)}$ 的值。`,
              ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(swapped), Q.of(inner), Q.of(x + y), Q.of(-answer)]),
          solution: nested
            ? t(
                `Inside first: $${x} \\diamond ${paren(y)} = ${op.show(x, y)} = ${inner}$. Then $${inner} \\diamond ${paren(z)} = ${op.show(inner, z)} = ${answer}$.`,
                `先算括号内：$${x} \\diamond ${paren(y)} = ${op.show(x, y)} = ${inner}$。再算 $${inner} \\diamond ${paren(z)} = ${op.show(inner, z)} = ${answer}$。`,
              )
            : t(
                `Replace $a$ with $${x}$ and $b$ with $${y}$: $${op.show(x, y)} = ${answer}$.`,
                `用 $${x}$ 替换 $a$，用 $${y}$ 替换 $b$：$${op.show(x, y)} = ${answer}$。`,
              ),
        });
      },
    ),
    kp(
      "solving-with-a-defined-operation",
      t("Solving equations with a defined operation", "解含自定义运算的方程"),
      t(
        "If an equation contains a defined operation with an unknown, first rewrite the operation using its rule, then solve the resulting equation. With $a \\diamond b = 3a + 2b$ and $x \\diamond 4 = 23$, the rule gives $3x + 2(4) = 23$, so $3x = 15$ and $x = 5$.",
        "如果方程中含有带未知数的自定义运算，先按规则把运算改写出来，再解所得的方程。若 $a \\diamond b = 3a + 2b$，且 $x \\diamond 4 = 23$，则由规则得 $3x + 2(4) = 23$，所以 $3x = 15$，$x = 5$。",
      ),
      (rng) => {
        const op = rng.pick(definedOps.filter((o) => o.f(1, 2) - o.f(0, 2) !== 0 && o.f(1, 0) - o.f(0, 0) !== 0));
        const x = rng.nonZero(-8, 9);
        const b = rng.int(1, 6);
        const value = op.f(x, b);
        const slope = op.f(1, b) - op.f(0, b);
        const rest = op.f(0, b);
        if (slope === 0) return applyingDefinedOperations.knowledgePoints[1]!.generate(rng);
        return numberProblem({
          prompt: t(
            `For all numbers $a$ and $b$, let $${op.latex}$. If $x \\diamond ${b} = ${value}$, what is the value of $x$?`,
            `对所有数 $a$、$b$，令 $${op.latex}$。若 $x \\diamond ${b} = ${value}$，求 $x$ 的值。`,
          ),
          answer: x,
          wrong: distinct(Q.of(x), [Q.of(value - rest), Q.of(value, slope), Q.of(value + rest, slope), Q.of(op.f(value, b))]),
          solution: t(
            `By the rule, $x \\diamond ${b} = ${slope === 1 ? "x" : `${slope}x`} ${rest < 0 ? "-" : "+"} ${Math.abs(rest)}$. So $${slope === 1 ? "x" : `${slope}x`} ${rest < 0 ? "-" : "+"} ${Math.abs(rest)} = ${value}$, which gives $x = \\frac{${value - rest}}{${slope}} = ${x}$.`,
            `按规则，$x \\diamond ${b} = ${slope === 1 ? "x" : `${slope}x`} ${rest < 0 ? "-" : "+"} ${Math.abs(rest)}$。所以 $${slope === 1 ? "x" : `${slope}x`} ${rest < 0 ? "-" : "+"} ${Math.abs(rest)} = ${value}$，得 $x = \\frac{${value - rest}}{${slope}} = ${x}$。`,
          ),
        });
      },
    ),
  ],
);

/** Property is a property of addition or multiplication with a statement that illustrates it. */
interface Property {
  readonly name: Text;
  readonly example: (a: string, b: string, c: string) => string;
}

const properties: readonly Property[] = [
  { name: t("Commutative property of addition", "加法交换律"), example: (a, b) => `${a} + ${b} = ${b} + ${a}` },
  { name: t("Commutative property of multiplication", "乘法交换律"), example: (a, b) => `${a} \\cdot ${b} = ${b} \\cdot ${a}` },
  { name: t("Associative property of addition", "加法结合律"), example: (a, b, c) => `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})` },
  {
    name: t("Associative property of multiplication", "乘法结合律"),
    example: (a, b, c) => `(${a} \\cdot ${b}) \\cdot ${c} = ${a} \\cdot (${b} \\cdot ${c})`,
  },
  { name: t("Distributive property", "分配律"), example: (a, b, c) => `${a}(${b} + ${c}) = ${a} \\cdot ${b} + ${a} \\cdot ${c}` },
  { name: t("Additive identity property", "加法单位元性质"), example: (a) => `${a} + 0 = ${a}` },
  { name: t("Additive inverse property", "加法逆元性质"), example: (a) => `${a} + (-${a}) = 0` },
  { name: t("Multiplicative identity property", "乘法单位元性质"), example: (a) => `${a} \\cdot 1 = ${a}` },
];

/** propertyTerms are the numbers and variables used in property statements. */
const propertyTerms = ["3", "5", "7", "x", "y", "2a", "4b", "9", "m", "n"];

/** propertiesOfRealNumberOperations names the properties of addition and multiplication that statements illustrate. */
export const propertiesOfRealNumberOperations = topic(
  "properties-of-real-number-operations",
  t("Naming the Addition Property Illustrated by a Statement", "说出等式所体现的运算性质"),
  t(
    "Name the commutative, associative, distributive, identity and inverse properties illustrated by statements, and pick statements that illustrate a named property.",
    "说出等式所体现的交换律、结合律、分配律、单位元与逆元性质，并选出体现指定性质的等式。",
  ),
  ["distributive-property"],
  ["A-SSE.A.1"],
  [
    kp(
      "naming-the-property",
      t("Naming the property a statement illustrates", "说出等式体现的性质"),
      t(
        "The **commutative** properties change the order: $a + b = b + a$ and $ab = ba$. The **associative** properties change the grouping, with the order unchanged: $(a + b) + c = a + (b + c)$. The **distributive** property multiplies a sum term by term: $a(b + c) = ab + ac$. Adding $0$ or multiplying by $1$ uses an **identity** property, and $a + (-a) = 0$ is the **additive inverse** property.",
        "**交换律**改变顺序：$a + b = b + a$，$ab = ba$。**结合律**改变分组方式而顺序不变：$(a + b) + c = a + (b + c)$。**分配律**把一个数逐项乘以和：$a(b + c) = ab + ac$。加 $0$ 或乘 $1$ 用的是**单位元**性质，$a + (-a) = 0$ 是**加法逆元**性质。",
      ),
      (rng) => {
        const i = rng.int(0, properties.length - 1);
        const [a, b, c] = rng.sample(propertyTerms, 3) as [string, string, string];
        const others = rng.sample(
          properties.filter((_, j) => j !== i).map((p) => p.name),
          3,
        );
        return pickChoice(
          rng,
          t(
            `Which property is illustrated by the statement $${properties[i]!.example(a, b, c)}$?`,
            `等式 $${properties[i]!.example(a, b, c)}$ 体现了哪个性质？`,
          ),
          properties[i]!.name,
          others,
          t(
            `The statement is an instance of the ${properties[i]!.name.en.toLowerCase()}.`,
            `这个等式是${properties[i]!.name["zh-CN"]}的一个例子。`,
          ),
        );
      },
    ),
    kp(
      "choosing-a-statement-for-a-property",
      t("Choosing a statement for a property", "选出体现某性质的等式"),
      t(
        "To pick the statement that illustrates a property, check what changes between the two sides. If only the order of the terms changes, it is commutative; if only the parentheses move, it is associative; if a factor is multiplied into a sum, it is distributive. A statement like $(a + b) + c = c + (a + b)$ only changes the order of two groups, so it is commutative even though it has parentheses.",
        "要选出体现某性质的等式，就看两边之间改变了什么。如果只改变了项的顺序，是交换律；如果只移动了括号，是结合律；如果把一个因数乘进和里，是分配律。像 $(a + b) + c = c + (a + b)$ 这样的等式只交换了两组的顺序，所以尽管有括号，它体现的是交换律。",
      ),
      (rng) => {
        const i = rng.int(0, 4);
        const [a, b, c] = rng.sample(propertyTerms, 3) as [string, string, string];
        const wrongIdx = rng.sample(
          [0, 1, 2, 3, 4, 5, 7].filter((j) => j !== i),
          3,
        );
        return pickChoice(
          rng,
          t(
            `Each statement below uses $${a}$, $${b}$ and $${c}$. Which one illustrates the ${properties[i]!.name.en.toLowerCase()}?`,
            `下面每个等式都用到 $${a}$、$${b}$ 和 $${c}$。哪个等式体现了${properties[i]!.name["zh-CN"]}？`,
          ),
          mathText(properties[i]!.example(a, b, c)),
          wrongIdx.map((j) => mathText(properties[j]!.example(a, b, c))),
          t(
            `$${properties[i]!.example(a, b, c)}$ illustrates the ${properties[i]!.name.en.toLowerCase()}; the other statements illustrate other properties.`,
            `$${properties[i]!.example(a, b, c)}$ 体现了${properties[i]!.name["zh-CN"]}；其他等式体现的是别的性质。`,
          ),
        );
      },
    ),
  ],
);

/** Interval is a range of x in which the powers and reciprocals of x keep a fixed order. */
interface Interval {
  readonly latex: string;
  readonly sample: number;
  readonly pool: readonly { readonly latex: string; readonly f: (x: number) => number }[];
}

const powerPool = [
  { latex: "x", f: (x: number) => x },
  { latex: "x^{2}", f: (x: number) => x * x },
  { latex: "x^{3}", f: (x: number) => x * x * x },
  { latex: "\\frac{1}{x}", f: (x: number) => 1 / x },
  { latex: "-x", f: (x: number) => -x },
];
const positivePool = [
  ...powerPool,
  { latex: "\\sqrt{x}", f: (x: number) => Math.sqrt(x) },
  { latex: "\\frac{1}{x^{2}}", f: (x: number) => 1 / (x * x) },
];

const intervals: readonly Interval[] = [
  { latex: "0 < x < 1", sample: 0.5, pool: positivePool },
  { latex: "x > 1", sample: 2, pool: positivePool },
  { latex: "-1 < x < 0", sample: -0.5, pool: powerPool },
  { latex: "x < -1", sample: -2, pool: powerPool },
];

/** Constraint is an order of two variables with statements that must be true or must be false under it. */
interface Constraint {
  readonly latex: (a: string, b: string) => string;
  readonly yes: readonly ((a: string, b: string) => string)[];
  readonly no: readonly ((a: string, b: string) => string)[];
}

const constraints: readonly Constraint[] = [
  {
    latex: (a, b) => `0 < ${a} < ${b}`,
    yes: [
      (a, b) => `${a}^{2} < ${b}^{2}`,
      (a, b) => `${a}${b} > 0`,
      (a, b) => `\\frac{${a}}{${b}} < 1`,
      (a, b) => `\\frac{1}{${a}} > \\frac{1}{${b}}`,
    ],
    no: [
      (a, b) => `${a}^{2} > ${b}^{2}`,
      (a, b) => `${a}${b} < 0`,
      (a, b) => `\\frac{${a}}{${b}} > 1`,
      (a, b) => `\\frac{1}{${a}} < \\frac{1}{${b}}`,
      (a, b) => `${a} - ${b} > 0`,
    ],
  },
  {
    latex: (a, b) => `${a} < ${b} < 0`,
    yes: [(a, b) => `${a}^{2} > ${b}^{2}`, (a, b) => `${a}${b} > 0`, (a, b) => `\\frac{${a}}{${b}} > 1`, (a, b) => `${a} + ${b} < 0`],
    no: [
      (a, b) => `${a}^{2} < ${b}^{2}`,
      (a, b) => `${a}${b} < 0`,
      (a, b) => `\\frac{${a}}{${b}} < 1`,
      (a, b) => `${a} + ${b} > 0`,
      (a, b) => `${a} - ${b} > 0`,
    ],
  },
  {
    latex: (a, b) => `${a} < 0 < ${b}`,
    yes: [
      (a, b) => `${a}${b} < 0`,
      (a, b) => `\\frac{${a}}{${b}} < 0`,
      (a, b) => `\\frac{1}{${a}} < \\frac{1}{${b}}`,
      (a, b) => `${a}^{3} < ${b}^{3}`,
    ],
    no: [
      (a, b) => `${a}${b} > 0`,
      (a, b) => `\\frac{${a}}{${b}} > 0`,
      (a, b) => `\\frac{1}{${a}} > \\frac{1}{${b}}`,
      (a, b) => `${a} - ${b} > 0`,
    ],
  },
];

/** comparingQuantitiesUnderConstraints orders expressions and decides which statements must hold under a constraint. */
export const comparingQuantitiesUnderConstraints = topic(
  "comparing-quantities-under-constraints",
  t("Comparing Quantities Under Given Constraints", "在给定约束条件下比较大小"),
  t(
    "Order powers, roots and reciprocals of a number known only to lie in an interval, and decide which statements must be true for variables in a given order.",
    "对只知道所在区间的数，比较它的幂、根和倒数的大小；对给定大小顺序的变量，判断哪些结论一定成立。",
  ),
  ["comparing-and-ordering-real-numbers", "negative-exponents"],
  ["6.NS.C.7", "A-REI.B.3"],
  [
    kp(
      "ordering-expressions-in-an-interval",
      t("Ordering expressions of a number in an interval", "比较区间内一个数的式子"),
      t(
        "When only an interval for $x$ is known, test any convenient value inside it, because the order of $x$, $x^{2}$, $x^{3}$, $\\sqrt{x}$ and $\\frac{1}{x}$ stays the same throughout each of the intervals $0 < x < 1$, $x > 1$, $-1 < x < 0$ and $x < -1$. For $0 < x < 1$, try $x = \\frac{1}{2}$: $x^{3} = \\frac{1}{8} < x^{2} = \\frac{1}{4} < x < \\sqrt{x} < \\frac{1}{x} = 2$. Squaring a number between $0$ and $1$ makes it smaller.",
        "当只知道 $x$ 所在的区间时，在区间内任取一个方便的值来检验即可，因为在 $0 < x < 1$、$x > 1$、$-1 < x < 0$、$x < -1$ 每个区间内，$x$、$x^{2}$、$x^{3}$、$\\sqrt{x}$、$\\frac{1}{x}$ 的大小顺序都不变。对于 $0 < x < 1$，取 $x = \\frac{1}{2}$：$x^{3} = \\frac{1}{8} < x^{2} = \\frac{1}{4} < x < \\sqrt{x} < \\frac{1}{x} = 2$。介于 $0$ 和 $1$ 之间的数平方后变小。",
      ),
      (rng) => {
        const iv = rng.pick(intervals);
        const opts = rng.sample(iv.pool, 4);
        const greatest = rng.bool();
        const vals = opts.map((o) => o.f(iv.sample));
        const best = greatest ? Math.max(...vals) : Math.min(...vals);
        const k = vals.indexOf(best);
        return pickChoice(
          rng,
          t(
            `If $${iv.latex}$, which of ${opts.map((o) => `$${o.latex}$`).join(", ")} has the ${greatest ? "greatest" : "least"} value?`,
            `若 $${iv.latex}$，${opts.map((o) => `$${o.latex}$`).join("、")} 中哪个的值最${greatest ? "大" : "小"}？`,
          ),
          mathText(opts[k]!.latex),
          opts.filter((_, i) => i !== k).map((o) => mathText(o.latex)),
          t(
            `The order is the same for every $x$ with $${iv.latex}$, so test $x = ${iv.sample}$: ${opts.map((o, i) => `$${o.latex} = ${Math.round(vals[i]! * 1000) / 1000}$`).join(", ")}. The ${greatest ? "greatest" : "least"} is $${opts[k]!.latex}$.`,
            `对满足 $${iv.latex}$ 的每个 $x$，大小顺序都相同，所以取 $x = ${iv.sample}$ 检验：${opts.map((o, i) => `$${o.latex} = ${Math.round(vals[i]! * 1000) / 1000}$`).join("，")}。最${greatest ? "大" : "小"}的是 $${opts[k]!.latex}$。`,
          ),
        );
      },
    ),
    kp(
      "statements-that-must-be-true",
      t("Statements that must be true", "一定成立的结论"),
      t(
        "A statement must be true only if it holds for every allowed value. Use sign rules: the product and quotient of two negatives are positive, and of numbers with opposite signs are negative. Squaring reverses the order of negative numbers: if $a < b < 0$ then $a^{2} > b^{2}$, because $a$ is farther from $0$. One counterexample is enough to show that a statement need not be true.",
        "只有对所有允许的值都成立的结论才一定成立。利用符号法则：两个负数的积与商为正，异号两数的积与商为负。负数平方后大小顺序反过来：若 $a < b < 0$，则 $a^{2} > b^{2}$，因为 $a$ 离 $0$ 更远。只要一个反例就能说明某个结论不一定成立。",
      ),
      (rng) => {
        const c = rng.pick(constraints);
        const [a, b] = rng.sample(["a", "b", "c", "m", "n", "p", "q", "r", "s", "x", "y", "z"], 2) as [string, string];
        const yes = rng.pick(c.yes)(a, b);
        const no = rng.sample(c.no, 3).map((f) => f(a, b));
        return pickChoice(
          rng,
          t(`If $${c.latex(a, b)}$, which of the following must be true?`, `若 $${c.latex(a, b)}$，下列哪个结论一定成立？`),
          mathText(yes),
          no.map((s) => mathText(s)),
          t(
            `Under $${c.latex(a, b)}$, the statement $${yes}$ holds for all allowed values, by the sign rules and the order of $${a}$ and $${b}$. Each of the other statements fails for every allowed pair.`,
            `在 $${c.latex(a, b)}$ 的条件下，由符号法则和 $${a}$、$${b}$ 的大小关系，$${yes}$ 对所有允许的值都成立。其他结论对任何允许的取值都不成立。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Functions

/** slantAsymptotesOfRationalFunctions finds slant asymptotes by division and tells which kind of asymptote a function has. */
export const slantAsymptotesOfRationalFunctions = topic(
  "slant-asymptotes-of-rational-functions",
  t("Finding Slant Asymptotes of Rational Functions", "求有理函数的斜渐近线"),
  t(
    "Find the slant asymptote of a rational function whose numerator has degree one more than its denominator, and tell horizontal, slant and no asymptotes apart by degree.",
    "求分子次数比分母高一次的有理函数的斜渐近线，并根据次数区分水平渐近线、斜渐近线和没有这类渐近线的情况。",
  ),
  ["horizontal-asymptotes-of-rational-functions"],
  ["F-IF.C.7.d"],
  [
    kp(
      "slant-asymptote-by-division",
      t("The slant asymptote by division", "用除法求斜渐近线"),
      t(
        "If the degree of the numerator is exactly one more than the degree of the denominator, divide: $\\frac{p(x)}{q(x)} = mx + k + \\frac{r}{q(x)}$. As $x$ grows large in either direction, the remainder term approaches $0$, so the graph approaches the line $y = mx + k$, the **slant asymptote**. For $\\frac{x^{2} + 3x + 5}{x - 1}$, division gives $x + 4 + \\frac{9}{x - 1}$, so the slant asymptote is $y = x + 4$.",
        "如果分子的次数恰好比分母高一次，就做除法：$\\frac{p(x)}{q(x)} = mx + k + \\frac{r}{q(x)}$。当 $x$ 向任一方向无限增大时，余项趋于 $0$，所以图象趋近直线 $y = mx + k$，即**斜渐近线**。对于 $\\frac{x^{2} + 3x + 5}{x - 1}$，除法得 $x + 4 + \\frac{9}{x - 1}$，所以斜渐近线为 $y = x + 4$。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const r = rng.nonZero(-6, 6);
        const b = rng.int(-9, 9);
        const c = rng.int(-12, 12);
        const k = b + a * r;
        const rem = c + k * r;
        if (rem === 0) return slantAsymptotesOfRationalFunctions.knowledgePoints[0]!.generate(rng);
        const askSlope = rng.bool(0.25) && a !== 1;
        const num = `${a === 1 ? "" : a === -1 ? "-" : a}x^{2}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`}${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`}`;
        const den = `x ${r < 0 ? "+" : "-"} ${Math.abs(r)}`;
        const answer = askSlope ? a : k;
        return numberProblem({
          prompt: t(
            `The graph of $f(x) = \\frac{${num}}{${den}}$ has a slant asymptote $y = mx + k$. What is the value of $${askSlope ? "m" : "k"}$?`,
            `$f(x) = \\frac{${num}}{${den}}$ 的图象有斜渐近线 $y = mx + k$。求 $${askSlope ? "m" : "k"}$ 的值。`,
          ),
          answer,
          wrong: distinct(Q.of(answer), askSlope ? [Q.of(b), Q.of(1), Q.of(-a)] : [Q.of(b), Q.of(b - a * r), Q.of(rem), Q.of(c)]),
          solution: t(
            `Dividing by $${den}$ gives $${a === 1 ? "" : a === -1 ? "-" : a}x ${k < 0 ? "-" : "+"} ${Math.abs(k)} + \\frac{${rem}}{${den}}$. The fraction approaches $0$, so the slant asymptote is $y = ${a === 1 ? "" : a === -1 ? "-" : a}x ${k < 0 ? "-" : "+"} ${Math.abs(k)}$ and $${askSlope ? "m" : "k"} = ${answer}$.`,
            `除以 $${den}$ 得 $${a === 1 ? "" : a === -1 ? "-" : a}x ${k < 0 ? "-" : "+"} ${Math.abs(k)} + \\frac{${rem}}{${den}}$。分式趋于 $0$，所以斜渐近线为 $y = ${a === 1 ? "" : a === -1 ? "-" : a}x ${k < 0 ? "-" : "+"} ${Math.abs(k)}$，$${askSlope ? "m" : "k"} = ${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "which-asymptote-by-degree",
      t("Which asymptote, by degree", "根据次数判断渐近线类型"),
      t(
        "Compare the degree $n$ of the numerator with the degree $d$ of the denominator. If $n < d$, the horizontal asymptote is $y = 0$. If $n = d$, the horizontal asymptote is the ratio of the leading coefficients. If $n = d + 1$, there is a slant asymptote. If $n > d + 1$, there is neither a horizontal nor a slant asymptote.",
        "比较分子的次数 $n$ 与分母的次数 $d$。若 $n < d$，水平渐近线为 $y = 0$；若 $n = d$，水平渐近线为首项系数之比；若 $n = d + 1$，有斜渐近线；若 $n > d + 1$，既没有水平渐近线也没有斜渐近线。",
      ),
      (rng) => {
        const d = rng.int(1, 3);
        const kind = rng.int(0, 3);
        const n = [rng.int(0, d - 1), d, d + 1, d + rng.int(2, 3)][kind]!;
        const term = (deg: number) => {
          const c = rng.nonZero(-5, 5);
          const rest = rng.int(1, 9);
          const head = deg === 0 ? `${c}` : `${c === 1 ? "" : c === -1 ? "-" : c}x${deg === 1 ? "" : `^{${deg}}`}`;
          return deg === 0 ? head : `${head} + ${rest}`;
        };
        const options = [
          t("A horizontal asymptote at $y = 0$", "水平渐近线 $y = 0$"),
          t("A horizontal asymptote at a nonzero value", "非零的水平渐近线"),
          t("A slant asymptote", "斜渐近线"),
          t("Neither a horizontal nor a slant asymptote", "既无水平渐近线也无斜渐近线"),
        ];
        const correct = kind;
        const [top, bottom] = [term(n), term(d)];
        return pickChoice(
          rng,
          t(
            `Which describes the end behavior asymptote of the graph of $f(x) = \\frac{${top}}{${bottom}}$?`,
            `下列哪项描述了 $f(x) = \\frac{${top}}{${bottom}}$ 的图象在两端的渐近线？`,
          ),
          options[correct]!,
          options.filter((_, i) => i !== correct),
          t(
            `The numerator has degree $${n}$ and the denominator has degree $${d}$. ${["Since the numerator has smaller degree, the graph approaches $y = 0$.", "Since the degrees are equal, the graph approaches the ratio of the leading coefficients.", "Since the numerator has degree one more, the graph approaches a slant line.", "Since the numerator has degree at least two more, the graph has neither kind."][kind]}`,
            `分子次数为 $${n}$，分母次数为 $${d}$。${["分子次数较小，所以图象趋近 $y = 0$。", "两者次数相等，所以图象趋近首项系数之比。", "分子次数恰好高一次，所以图象趋近一条斜线。", "分子次数至少高两次，所以两种渐近线都没有。"][kind]}`,
          ),
        );
      },
    ),
  ],
);

/** jointVariation solves joint and combined variation problems and finds how a quantity scales. */
export const jointVariation = topic(
  "joint-variation",
  t("Scaling a Joint Variation", "联合变化中的按比例变化"),
  t(
    "Write and use equations for quantities that vary jointly with, or inversely with, several others, and find how a quantity changes when the others are scaled.",
    "为随其他几个量联合变化或反比变化的量写出并运用方程，并求出其他量按比例变化时这个量如何变化。",
  ),
  ["inverse-variation"],
  ["A-CED.A.2"],
  [
    kp(
      "finding-a-value-with-joint-variation",
      t("Finding a value with joint variation", "用联合变化求值"),
      t(
        "$z$ **varies jointly** as $x$ and $y$ when $z = kxy$ for a constant $k$. Find $k$ from one set of values, then use it for another. If $z = 60$ when $x = 3$ and $y = 4$, then $k = \\frac{60}{12} = 5$, so when $x = 2$ and $y = 7$, $z = 5 \\cdot 2 \\cdot 7 = 70$. In combined variation such as $z = \\frac{kx}{y}$, $z$ varies directly as $x$ and inversely as $y$.",
        "当 $z = kxy$（$k$ 为常数）时，称 $z$ 与 $x$、$y$ **联合变化**。先由一组值求出 $k$，再用于另一组值。若 $x = 3$、$y = 4$ 时 $z = 60$，则 $k = \\frac{60}{12} = 5$，所以 $x = 2$、$y = 7$ 时 $z = 5 \\cdot 2 \\cdot 7 = 70$。在像 $z = \\frac{kx}{y}$ 这样的组合变化中，$z$ 与 $x$ 成正比，与 $y$ 成反比。",
      ),
      (rng) => {
        const k = rng.int(2, 9);
        const inverse = rng.bool(0.4);
        const [x1, y1, x2, y2] = [rng.int(2, 9), rng.int(2, 6), rng.int(2, 9), rng.int(2, 6)];
        const z = (x: number, y: number) => (inverse ? Q.of(k * x, y) : Q.of(k * x * y));
        const z1 = z(x1, y1);
        const answer = z(x2, y2);
        if (!z1.isInteger()) return jointVariation.knowledgePoints[0]!.generate(rng);
        const kQ = inverse ? z1.mul(Q.of(y1)).div(Q.of(x1)) : z1.div(Q.of(x1 * y1));
        return numberProblem({
          prompt: inverse
            ? t(
                `The quantity $z$ varies directly as $x$ and inversely as $y$. When $x = ${x1}$ and $y = ${y1}$, $z = ${z1.toLatex()}$. What is $z$ when $x = ${x2}$ and $y = ${y2}$?`,
                `量 $z$ 与 $x$ 成正比，与 $y$ 成反比。当 $x = ${x1}$、$y = ${y1}$ 时，$z = ${z1.toLatex()}$。当 $x = ${x2}$、$y = ${y2}$ 时，$z$ 是多少？`,
              )
            : t(
                `The quantity $z$ varies jointly as $x$ and $y$. When $x = ${x1}$ and $y = ${y1}$, $z = ${z1.toLatex()}$. What is $z$ when $x = ${x2}$ and $y = ${y2}$?`,
                `量 $z$ 与 $x$、$y$ 联合变化。当 $x = ${x1}$、$y = ${y1}$ 时，$z = ${z1.toLatex()}$。当 $x = ${x2}$、$y = ${y2}$ 时，$z$ 是多少？`,
              ),
          answer,
          form: "fraction",
          wrong: distinct(
            answer,
            inverse ? [Q.of(k * x2 * y2), Q.of(k * y2, x2), kQ] : [Q.of(k * x2, y2), z1.add(Q.of(x2 + y2 - x1 - y1)), kQ],
          ),
          solution: inverse
            ? t(
                `Write $z = \\frac{kx}{y}$. Then $${z1.toLatex()} = \\frac{k \\cdot ${x1}}{${y1}}$, so $k = ${kQ.toLatex()}$, and $z = \\frac{${kQ.toLatex()} \\cdot ${x2}}{${y2}} = ${answer.toLatex()}$.`,
                `写出 $z = \\frac{kx}{y}$。则 $${z1.toLatex()} = \\frac{k \\cdot ${x1}}{${y1}}$，所以 $k = ${kQ.toLatex()}$，$z = \\frac{${kQ.toLatex()} \\cdot ${x2}}{${y2}} = ${answer.toLatex()}$。`,
              )
            : t(
                `Write $z = kxy$. Then $${z1.toLatex()} = k \\cdot ${x1} \\cdot ${y1}$, so $k = ${kQ.toLatex()}$, and $z = ${kQ.toLatex()} \\cdot ${x2} \\cdot ${y2} = ${answer.toLatex()}$.`,
                `写出 $z = kxy$。则 $${z1.toLatex()} = k \\cdot ${x1} \\cdot ${y1}$，所以 $k = ${kQ.toLatex()}$，$z = ${kQ.toLatex()} \\cdot ${x2} \\cdot ${y2} = ${answer.toLatex()}$。`,
              ),
        });
      },
    ),
    kp(
      "scaling-in-joint-variation",
      t("Scaling in joint variation", "联合变化中的倍数关系"),
      t(
        "To see how $z$ changes when the other quantities are multiplied by factors, substitute the factors into the formula; the constant $k$ cancels. If $z = \\frac{kxy^{2}}{w}$ and $x$ is doubled, $y$ is tripled and $w$ is halved, then $z$ is multiplied by $\\frac{2 \\cdot 3^{2}}{\\frac{1}{2}} = 36$. Squared quantities contribute the square of their factor.",
        "要看其他量乘以某些倍数时 $z$ 如何变化，把这些倍数代入公式即可，常数 $k$ 会约去。若 $z = \\frac{kxy^{2}}{w}$，$x$ 变为 $2$ 倍，$y$ 变为 $3$ 倍，$w$ 变为一半，则 $z$ 变为原来的 $\\frac{2 \\cdot 3^{2}}{\\frac{1}{2}} = 36$ 倍。平方的量贡献其倍数的平方。",
      ),
      (rng) => {
        const form = rng.pick([
          {
            latex: "z = kxy",
            f: (a: Q, b: Q, _c: Q) => a.mul(b),
            show: (a: number, b: number, _c: number) => `${a} \\cdot ${b}`,
            uses: 2,
            en: "varies jointly as $x$ and $y$",
            zh: "与 $x$、$y$ 联合变化",
          },
          {
            latex: "z = kxy^{2}",
            f: (a: Q, b: Q, _c: Q) => a.mul(b.pow(2)),
            show: (a: number, b: number, _c: number) => `${a} \\cdot ${b}^{2}`,
            uses: 2,
            en: "varies jointly as $x$ and the square of $y$",
            zh: "与 $x$ 和 $y$ 的平方联合变化",
          },
          {
            latex: "z = \\frac{kx}{y}",
            f: (a: Q, b: Q, _c: Q) => a.div(b),
            show: (a: number, b: number, _c: number) => `\\frac{${a}}{${b}}`,
            uses: 2,
            en: "varies directly as $x$ and inversely as $y$",
            zh: "与 $x$ 成正比，与 $y$ 成反比",
          },
          {
            latex: "z = \\frac{kxy}{w}",
            f: (a: Q, b: Q, c: Q) => a.mul(b).div(c),
            show: (a: number, b: number, c: number) => `\\frac{${a} \\cdot ${b}}{${c}}`,
            uses: 3,
            en: "varies jointly as $x$ and $y$ and inversely as $w$",
            zh: "与 $x$、$y$ 联合变化，与 $w$ 成反比",
          },
          {
            latex: "z = \\frac{kx}{y^{2}}",
            f: (a: Q, b: Q, _c: Q) => a.div(b.pow(2)),
            show: (a: number, b: number, _c: number) => `\\frac{${a}}{${b}^{2}}`,
            uses: 2,
            en: "varies directly as $x$ and inversely as the square of $y$",
            zh: "与 $x$ 成正比，与 $y$ 的平方成反比",
          },
        ]);
        const factor = () => rng.pick([2, 3, 4, 5]);
        const fx = factor();
        const fy = factor();
        const fw = factor();
        const answer = form.f(Q.of(fx), Q.of(fy), Q.of(fw));
        const words = (f: number, en: boolean) =>
          en
            ? f === 2
              ? "doubled"
              : f === 3
                ? "tripled"
                : `multiplied by $${f}$`
            : f === 2
              ? "变为 $2$ 倍"
              : f === 3
                ? "变为 $3$ 倍"
                : `变为 $${f}$ 倍`;
        return numberProblem({
          prompt: t(
            `The quantity $z$ ${form.en}. If $x$ is ${words(fx, true)} and $y$ is ${words(fy, true)}${form.uses === 3 ? `, and $w$ is ${words(fw, true)}` : ""}, by what factor is $z$ multiplied?`,
            `量 $z$ ${form.zh}。若 $x$ ${words(fx, false)}，$y$ ${words(fy, false)}${form.uses === 3 ? `，$w$ ${words(fw, false)}` : ""}，则 $z$ 变为原来的多少倍？`,
          ),
          answer,
          form: "fraction",
          wrong: distinct(answer, [Q.of(fx * fy), Q.of(fx + fy), Q.of(fx, fy), Q.of(fx * fy * fy)]),
          solution: t(
            `With $${form.latex}$, replace each quantity by its factor times the old value. The constant $k$ and the old values cancel, leaving the factor $${form.show(fx, fy, fw)} = ${answer.toLatex()}$.`,
            `由 $${form.latex}$，把每个量换成它的倍数乘以原来的值。常数 $k$ 和原来的值都约去，剩下 $${form.show(fx, fy, fw)} = ${answer.toLatex()}$，即 $z$ 变为原来的 $${answer.toLatex()}$ 倍。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Real-number restrictions, given relations, matrix equations and models, cubes in rational expressions, and systems
// read from graphs

/** lin writes a·v + c in LaTeX: "3x - 6", "-x + 2", "x". */
function lin(a: number, c: number, v = "x"): string {
  const head = a === 1 ? v : a === -1 ? `-${v}` : `${a}${v}`;
  return c === 0 ? head : `${head} ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
}

/** mat writes a matrix of numbers or LaTeX entries in LaTeX. */
const mat = (m: readonly (readonly (number | string)[])[]): string =>
  `\\begin{bmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;

/** realNumberRestrictions finds the values for which a quotient or an even root is not a real number. */
export const realNumberRestrictions = topic(
  "real-number-restrictions",
  t("Reasoning About Real-Number Restrictions", "关于实数范围限制的推理"),
  t(
    "Find the values of a variable for which an expression is not a real number: those that make a denominator zero, and those that put a negative number under a square root.",
    "求使一个式子不是实数的变量取值：使分母为零的值，以及使平方根下出现负数的值。",
  ),
  ["evaluating-algebraic-expressions", "solving-one-step-inequalities", "the-square-root-of-a-perfect-square"],
  ["6.EE.A.2", "A-REI.B.3"],
  [
    kp(
      "values-where-a-quotient-is-not-defined",
      t("Values where a quotient is not defined", "使商无意义的值"),
      t(
        "Division by zero is not defined, so a fraction has no value when its denominator equals zero, whatever its numerator is. To find the value that is not allowed, set the denominator equal to $0$ and solve. For $\\frac{x + 4}{3x - 12}$, $3x - 12 = 0$ gives $x = 4$, so the expression is not defined at $x = 4$ and defined for every other real number. A zero numerator causes no trouble: it only makes the value $0$.",
        "除以零没有意义，所以无论分子是什么，分母等于零时分数都没有值。要找出不允许的值，令分母等于 $0$ 并求解。对于 $\\frac{x + 4}{3x - 12}$，由 $3x - 12 = 0$ 得 $x = 4$，所以该式在 $x = 4$ 处无意义，对其他每个实数都有意义。分子为零并不会出问题，只是使值为 $0$。",
      ),
      (rng) => {
        const r = rng.nonZero(-9, 9);
        const a = rng.int(2, 5);
        let q = rng.nonZero(-9, 9);
        while (q === -r) q = rng.nonZero(-9, 9);
        const den = lin(a, -a * r);
        const num = lin(1, q);
        return numberProblem({
          prompt: t(
            `For what value of $x$ is the expression $\\dfrac{${num}}{${den}}$ not defined?`,
            `当 $x$ 取何值时，式子 $\\dfrac{${num}}{${den}}$ 无意义？`,
          ),
          answer: r,
          solveFor: "x",
          form: "integer",
          wrong: [-r, a * r, -q, Q.of(r, a)],
          solution: t(
            `The expression is not defined where the denominator is zero: $${den} = 0$ gives $${a}x = ${a * r}$, so $x = ${r}$. The numerator $${num}$ does not matter.`,
            `分母为零时式子无意义：由 $${den} = 0$ 得 $${a}x = ${a * r}$，所以 $x = ${r}$。分子 $${num}$ 不影响结果。`,
          ),
        });
      },
    ),
    kp(
      "square-roots-of-negative-numbers",
      t("Square roots of negative numbers", "负数的平方根"),
      t(
        "No real number squares to a negative number, so $\\sqrt{u}$ is a real number only when $u \\ge 0$. To find where $\\sqrt{2x - 7}$ is real, solve $2x - 7 \\ge 0$ to get $x \\ge 3.5$; the least integer allowed is $4$. When the variable has a negative coefficient, as in $\\sqrt{10 - 3x}$, solving $10 - 3x \\ge 0$ gives $x \\le \\frac{10}{3}$, an upper bound, so the greatest integer allowed is $3$.",
        "没有哪个实数的平方是负数，所以只有当 $u \\ge 0$ 时 $\\sqrt{u}$ 才是实数。要找出 $\\sqrt{2x - 7}$ 为实数的范围，解 $2x - 7 \\ge 0$ 得 $x \\ge 3.5$，允许的最小整数是 $4$。当变量的系数为负时，比如 $\\sqrt{10 - 3x}$，解 $10 - 3x \\ge 0$ 得 $x \\le \\frac{10}{3}$，这是一个上界，所以允许的最大整数是 $3$。",
      ),
      (rng) => {
        const a = rng.int(2, 6);
        const b = rng.int(1, 40);
        const up = rng.bool();
        const bound = Q.of(b, a);
        const answer = up ? Math.floor(b / a) : Math.ceil(b / a);
        const expr = up ? `${b} - ${a}x` : `${a}x - ${b}`;
        return numberProblem({
          prompt: t(
            `What is the ${up ? "greatest" : "least"} integer $x$ for which $\\sqrt{${expr}}$ is a real number?`,
            `使 $\\sqrt{${expr}}$ 为实数的${up ? "最大" : "最小"}整数 $x$ 是多少？`,
          ),
          answer,
          form: "integer",
          wrong: [
            up ? answer + 1 : answer - 1,
            -answer,
            b,
            up ? Math.ceil(b / a) + (b % a === 0 ? 1 : 0) : Math.floor(b / a) - (b % a === 0 ? 1 : 0),
          ],
          solution: t(
            `The square root is real only when $${expr} \\ge 0$, that is, $x ${up ? "\\le" : "\\ge"} ${bound.toLatex()}$. The ${up ? "greatest" : "least"} integer with this property is $${answer}$.`,
            `只有当 $${expr} \\ge 0$，即 $x ${up ? "\\le" : "\\ge"} ${bound.toLatex()}$ 时，平方根才是实数。满足条件的${up ? "最大" : "最小"}整数是 $${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** evaluatingExpressionsUsingGivenRelations finds the value of an expression from a relation without solving for each variable. */
export const evaluatingExpressionsUsingGivenRelations = topic(
  "evaluating-expressions-using-given-relations",
  t("Evaluating Expressions Using Given Relations", "利用已知关系求式子的值"),
  t(
    "Find the value of an expression from a given relation between its variables, by rewriting the expression in terms of the part whose value is known.",
    "根据变量之间的已知关系，把式子改写成用已知部分表示的形式，从而求出式子的值。",
  ),
  ["evaluating-algebraic-expressions", "distributive-property"],
  ["A-SSE.A.2"],
  [
    kp(
      "multiples-of-a-known-expression",
      t("Multiples of a known expression", "已知式子的倍数"),
      t(
        "When an equation gives the value of an expression such as $2x + 3y$, look for that expression inside the one you must evaluate instead of trying to find $x$ and $y$, which one equation cannot determine. If $2x + 3y = 7$, then $6x + 9y - 4 = 3(2x + 3y) - 4 = 3 \\cdot 7 - 4 = 17$. Factor out the multiple first, then substitute the known value.",
        "当方程给出了像 $2x + 3y$ 这样的式子的值时，应在要求值的式子中寻找这个式子，而不是去求 $x$ 和 $y$，因为一个方程无法确定它们。若 $2x + 3y = 7$，则 $6x + 9y - 4 = 3(2x + 3y) - 4 = 3 \\cdot 7 - 4 = 17$。先提出倍数，再代入已知的值。",
      ),
      (rng) => {
        const a = rng.int(1, 5);
        let b = rng.int(1, 5);
        while (b === a) b = rng.int(1, 5);
        const k = rng.int(2, 5);
        const s = rng.nonZero(-9, 12);
        const c = rng.nonZero(-10, 10);
        const [u, v] = rng.pick([
          ["x", "y"],
          ["a", "b"],
          ["m", "n"],
          ["p", "q"],
        ] as const);
        const known = `${a === 1 ? "" : a}${u} + ${b === 1 ? "" : b}${v}`;
        const target = `${k * a}${u} + ${k * b}${v} ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
        const answer = k * s + c;
        return numberProblem({
          prompt: t(`If $${known} = ${s}$, what is the value of $${target}$?`, `若 $${known} = ${s}$，则 $${target}$ 的值是多少？`),
          answer,
          form: "integer",
          wrong: [s + c, k * s, k * s - c, k * (s + c)],
          solution: t(
            steps(
              `Factor $${k}$ out of the variable terms: $${target} = ${k}(${known}) ${c < 0 ? "-" : "+"} ${Math.abs(c)}$.`,
              `Substitute $${known} = ${s}$: $${k} \\cdot ${paren(s)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${answer}$.`,
            ),
            steps(
              `从含变量的项中提出 $${k}$：$${target} = ${k}(${known}) ${c < 0 ? "-" : "+"} ${Math.abs(c)}$。`,
              `代入 $${known} = ${s}$：$${k} \\cdot ${paren(s)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${answer}$。`,
            ),
          ),
        });
      },
    ),
    kp(
      "substituting-a-proportional-relation",
      t("Substituting a proportional relation", "代入比例关系"),
      t(
        "When one variable is a multiple of another, as in $a = 4b$, substitute to write the whole expression in terms of one variable; in a quotient that variable then cancels. With $a = 4b$ and $b \\ne 0$, $\\frac{a + b}{a - b} = \\frac{4b + b}{4b - b} = \\frac{5b}{3b} = \\frac{5}{3}$. The value is the same for every allowed $b$, which is why the question can ask for a single number.",
        "当一个变量是另一个变量的倍数时，比如 $a = 4b$，代入后就能把整个式子用一个变量表示；在商中这个变量随后会约去。由 $a = 4b$ 且 $b \\ne 0$，$\\frac{a + b}{a - b} = \\frac{4b + b}{4b - b} = \\frac{5b}{3b} = \\frac{5}{3}$。对每个允许的 $b$，值都相同，所以题目可以要求一个确定的数。",
      ),
      (rng) => {
        const m = rng.pick([2, 3, 4, 5, 6, -2, -3, -4]);
        const p = rng.int(1, 3);
        const forms = [
          { latex: "\\dfrac{a + b}{a - b}", num: m + 1, den: m - 1 },
          { latex: `\\dfrac{a + ${p}b}{b}`, num: m + p, den: 1 },
          { latex: "\\dfrac{a^{2} + b^{2}}{ab}", num: m * m + 1, den: m },
        ];
        const f = rng.pick(forms);
        const answer = Q.of(f.num, f.den);
        return numberProblem({
          prompt: t(
            `If $a = ${m}b$ and $b \\ne 0$, what is the value of $${f.latex}$?`,
            `若 $a = ${m}b$ 且 $b \\ne 0$，则 $${f.latex}$ 的值是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: [Q.of(f.den, f.num === 0 ? 1 : f.num), Q.of(m), Q.of(f.num), Q.of(m + 1, m)],
          solution: t(
            `Substitute $a = ${m}b$ and cancel $b$: the expression equals $${answer.toLatex()}$ for every $b \\ne 0$.`,
            `代入 $a = ${m}b$ 并约去 $b$：对每个 $b \\ne 0$，式子都等于 $${answer.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "products-from-a-sum-and-a-difference",
      t("Products from a sum and a difference", "由和与差求积"),
      t(
        "Some expressions factor into pieces whose values are given. Because $x^{2} - y^{2} = (x + y)(x - y)$, knowing $x + y$ and $x - y$ is enough to find $x^{2} - y^{2}$ without finding $x$ or $y$: if $x + y = 9$ and $x - y = 4$, then $x^{2} - y^{2} = 9 \\cdot 4 = 36$. Recognizing the factored form saves solving a system.",
        "有些式子可以分解成值已知的几部分。因为 $x^{2} - y^{2} = (x + y)(x - y)$，只要知道 $x + y$ 和 $x - y$，不必求出 $x$ 或 $y$ 就能得到 $x^{2} - y^{2}$：若 $x + y = 9$，$x - y = 4$，则 $x^{2} - y^{2} = 9 \\cdot 4 = 36$。认出分解后的形式就省去了解方程组。",
      ),
      (rng) => {
        const s = rng.nonZero(-12, 15);
        const d = rng.nonZero(-9, 9);
        const answer = s * d;
        return numberProblem({
          prompt: t(
            `If $x + y = ${s}$ and $x - y = ${d}$, what is the value of $x^{2} - y^{2}$?`,
            `若 $x + y = ${s}$，$x - y = ${d}$，则 $x^{2} - y^{2}$ 的值是多少？`,
          ),
          answer,
          form: "integer",
          wrong: [s * s - d * d, s + d, s * s + d * d, -answer],
          solution: t(
            `Factor: $x^{2} - y^{2} = (x + y)(x - y) = ${paren(s)} \\cdot ${paren(d)} = ${answer}$.`,
            `分解因式：$x^{2} - y^{2} = (x + y)(x - y) = ${paren(s)} \\cdot ${paren(d)} = ${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** matrixEquations finds unknown entries from equal matrices and from scalar matrix equations. */
export const matrixEquations = topic(
  "matrix-equations",
  t("Finding Unknown Entries From a Scalar Matrix Equation", "由含数乘的矩阵方程求未知元素"),
  t(
    "Use the fact that equal matrices have equal entries to find unknowns, and solve equations such as $kX + B = C$ for an unknown matrix one entry at a time.",
    "利用相等矩阵的对应元素相等求未知数，并逐个元素地求解像 $kX + B = C$ 这样的未知矩阵方程。",
  ),
  ["scalar-multiplication-of-matrices", "two-step-equations"],
  ["N-VM.C.8"],
  [
    kp(
      "equal-matrices",
      t("Equal matrices", "相等的矩阵"),
      t(
        "Two matrices are equal exactly when they have the same dimensions and every entry of one equals the entry in the same position of the other. An equation between two $2 \\times 2$ matrices is therefore four ordinary equations, one for each position. Set the entries containing unknowns equal to the matching entries and solve each equation separately.",
        "两个矩阵相等，当且仅当它们的阶数相同，并且一个矩阵的每个元素都等于另一个矩阵相同位置上的元素。因此两个 $2 \\times 2$ 矩阵之间的等式就是四个普通方程，每个位置一个。把含未知数的元素与对应位置的元素相等，再分别解每个方程。",
      ),
      (rng) => {
        const x = rng.int(-6, 9);
        const y = rng.nonZero(-5, 6);
        const k = rng.int(2, 4);
        const p = rng.nonZero(-5, 5);
        const q = rng.int(-9, 9);
        const r = rng.int(-9, 9);
        const left = mat([
          [lin(1, p), q],
          [r, `${k}y`],
        ]);
        const right = mat([
          [x + p, q],
          [r, k * y],
        ]);
        return numberProblem({
          prompt: t(`If $${left} = ${right}$, what is $x + y$?`, `若 $${left} = ${right}$，则 $x + y$ 是多少？`),
          answer: x + y,
          form: "integer",
          wrong: [x + p + k * y, x + k * y, x - y, x + p + y],
          solution: t(
            steps(
              `Matching the top-left entries, $${lin(1, p)} = ${x + p}$, so $x = ${x}$.`,
              `Matching the bottom-right entries, $${k}y = ${k * y}$, so $y = ${y}$.`,
              `So $x + y = ${x + y}$.`,
            ),
            steps(
              `比较左上角的元素，$${lin(1, p)} = ${x + p}$，所以 $x = ${x}$。`,
              `比较右下角的元素，$${k}y = ${k * y}$，所以 $y = ${y}$。`,
              `所以 $x + y = ${x + y}$。`,
            ),
          ),
        });
      },
    ),
    kp(
      "solving-a-scalar-matrix-equation",
      t("Solving a scalar matrix equation", "解含数乘的矩阵方程"),
      t(
        "Solve $kX + B = C$ for the matrix $X$ just as you would solve $kx + b = c$ for a number: subtract $B$ from both sides, then divide every entry by $k$, so $X = \\frac{1}{k}(C - B)$. Matrix subtraction and scalar multiplication both work entry by entry, so any single entry of $X$ comes from the matching entries of $B$ and $C$ alone.",
        "求解矩阵 $X$ 满足的 $kX + B = C$，与求解数的方程 $kx + b = c$ 一样：两边同时减去 $B$，再把每个元素除以 $k$，所以 $X = \\frac{1}{k}(C - B)$。矩阵减法和数乘都是逐个元素进行的，所以 $X$ 的任一元素只由 $B$ 和 $C$ 中对应位置的元素决定。",
      ),
      (rng) => {
        const k = rng.int(2, 4);
        const X = [0, 1].map(() => [0, 1].map(() => rng.int(-6, 6)));
        const B = [0, 1].map(() => [0, 1].map(() => rng.int(-9, 9)));
        const C = X.map((row, i) => row.map((v, j) => k * v + B[i]![j]!));
        const i = rng.int(0, 1);
        const j = rng.int(0, 1);
        const x = X[i]![j]!;
        const b = B[i]![j]!;
        const c = C[i]![j]!;
        const rowName = i === 0 ? t("first", "第一") : t("second", "第二");
        const colName = j === 0 ? t("first", "第一") : t("second", "第二");
        return numberProblem({
          prompt: t(
            `The matrix $X$ satisfies $${k}X + ${mat(B)} = ${mat(C)}$. What is the entry of $X$ in the ${rowName.en} row and ${colName.en} column?`,
            `矩阵 $X$ 满足 $${k}X + ${mat(B)} = ${mat(C)}$。$X$ 中位于${rowName["zh-CN"]}行${colName["zh-CN"]}列的元素是多少？`,
          ),
          answer: x,
          form: "fraction",
          wrong: [c - b, Q.of(c + b, k), Q.of(c, k).sub(Q.of(b)), k * c - b],
          solution: t(
            `Subtract and divide entry by entry: $X = \\frac{1}{${k}}\\left(${mat(C)} - ${mat(B)}\\right)$, so the entry is $\\frac{${c} - ${paren(b)}}{${k}} = \\frac{${c - b}}{${k}} = ${x}$.`,
            `逐个元素相减再相除：$X = \\frac{1}{${k}}\\left(${mat(C)} - ${mat(B)}\\right)$，所以该元素为 $\\frac{${c} - ${paren(b)}}{${k}} = \\frac{${c - b}}{${k}} = ${x}$。`,
          ),
        });
      },
    ),
  ],
);

/** modelingWithMatrixProducts uses products of quantity and price matrices to find totals. */
export const modelingWithMatrixProducts = topic(
  "modeling-with-matrix-products",
  t("Modeling With Matrix Products", "用矩阵乘积建模"),
  t(
    "Organize quantities and unit values in matrices and multiply them so that each entry of the product is a total, choosing the order of the factors that makes the dimensions match.",
    "把数量和单价排成矩阵并相乘，使乘积的每个元素都是一个总量，并选择使阶数相容的因子顺序。",
  ),
  ["multiplying-matrices"],
  ["N-VM.C.6", "N-VM.C.8"],
  [
    kp(
      "totals-from-a-matrix-product",
      t("Totals from a matrix product", "由矩阵乘积求总量"),
      t(
        "If each row of a matrix $N$ lists how many of each item one store sold, and a column matrix $P$ lists the price of each item in the same order, then each entry of $NP$ is a row of $N$ times the column $P$: the number of each item times its price, added up. So the entry in row $i$ of $NP$ is the total revenue of store $i$.",
        "若矩阵 $N$ 的每一行列出某家商店各种商品的销量，列矩阵 $P$ 按同样的顺序列出各商品的单价，那么 $NP$ 的每个元素都是 $N$ 的一行乘以列 $P$：各商品的数量乘以单价再相加。所以 $NP$ 第 $i$ 行的元素就是第 $i$ 家商店的总收入。",
      ),
      (rng) => {
        const N = [0, 1].map(() => [0, 1, 2].map(() => rng.int(1, 12)));
        const P = [0, 1, 2].map(() => rng.int(2, 9));
        const i = rng.int(0, 1);
        const row = N[i]!;
        const total = row.reduce((s, v, j) => s + v * P[j]!, 0);
        const other = N[1 - i]!.reduce((s, v, j) => s + v * P[j]!, 0);
        const sumN = row.reduce((s, v) => s + v, 0);
        const sumP = P.reduce((s, v) => s + v, 0);
        const store = i === 0 ? t("A", "A") : t("B", "B");
        return numberProblem({
          prompt: t(
            `The rows of $N = ${mat(N)}$ give the numbers of pens, notebooks and folders sold by stores A and B, and $P = ${mat(P.map((v) => [v]))}$ gives the prices, in dollars, of a pen, a notebook and a folder. What is the entry of $NP$ that gives store ${store.en}'s total revenue, in dollars?`,
            `矩阵 $N = ${mat(N)}$ 的两行分别是商店 A 和 B 卖出的钢笔、笔记本和文件夹的数量，$P = ${mat(P.map((v) => [v]))}$ 给出钢笔、笔记本和文件夹的单价（美元）。$NP$ 中表示商店 ${store["zh-CN"]} 总收入（美元）的元素是多少？`,
          ),
          answer: total,
          form: "integer",
          wrong: [other, sumN * sumP, sumN + sumP, row[0]! * P[0]!],
          solution: t(
            `Row ${i + 1} of $N$ times $P$: $${row.map((v, j) => `${v} \\cdot ${P[j]}`).join(" + ")} = ${total}$.`,
            `$N$ 的第 ${i + 1} 行乘以 $P$：$${row.map((v, j) => `${v} \\cdot ${P[j]}`).join(" + ")} = ${total}$。`,
          ),
        });
      },
    ),
    kp(
      "choosing-the-order-of-the-factors",
      t("Choosing the order of the factors", "选择因子的顺序"),
      t(
        "A product $AB$ is defined only when the number of columns of $A$ equals the number of rows of $B$, and in a model the matching dimension must be the one that lists the items. If quantities of $3$ items fill the columns of a $2 \\times 3$ matrix $N$, prices must form a $3 \\times 1$ column $P$ and the totals are $NP$. If instead the items fill the rows of $N$, prices form a $1 \\times 3$ row and the totals are $PN$.",
        "乘积 $AB$ 只有在 $A$ 的列数等于 $B$ 的行数时才有定义，而在模型中，相匹配的那一维必须是列出各商品的那一维。若 $3$ 种商品的数量排在 $2 \\times 3$ 矩阵 $N$ 的各列，价格就要排成 $3 \\times 1$ 的列 $P$，总量为 $NP$。若商品排在 $N$ 的各行，价格就排成 $1 \\times 3$ 的行，总量为 $PN$。",
      ),
      (rng) => {
        const items = rng.int(2, 4);
        const groups = rng.pick([2, 3, 4].filter((g) => g !== items));
        const byColumns = rng.bool();
        const who = rng.pick([
          { en: "customers bought", zh: "位顾客购买", each: "customer", eachZh: "每位顾客", total: "total cost", totalZh: "总花费" },
          { en: "stores sold", zh: "家商店卖出", each: "store", eachZh: "每家商店", total: "total revenue", totalZh: "总收入" },
          { en: "families ordered", zh: "个家庭订购", each: "family", eachZh: "每个家庭", total: "total cost", totalZh: "总花费" },
        ]);
        const nDims = byColumns ? `${groups} \\times ${items}` : `${items} \\times ${groups}`;
        const pDims = byColumns ? `${items} \\times 1` : `1 \\times ${items}`;
        const correct = byColumns ? "NP" : "PN";
        return pickChoice(
          rng,
          t(
            `A $${nDims}$ matrix $N$ lists how many of each of $${items}$ items $${groups}$ ${who.en}, with one ${byColumns ? "column" : "row"} for each item. A $${pDims}$ matrix $P$ lists the price of each item. Which product gives each ${who.each}'s ${who.total}?`,
            `一个 $${nDims}$ 矩阵 $N$ 列出了 $${groups}$ ${who.zh} $${items}$ 种商品各自的数量，每种商品占一${byColumns ? "列" : "行"}。一个 $${pDims}$ 矩阵 $P$ 列出了每种商品的单价。哪个乘积给出${who.eachZh}的${who.totalZh}？`,
          ),
          mathText(correct),
          [mathText(byColumns ? "PN" : "NP"), mathText("N + P"), mathText(byColumns ? "P^{T}N" : "NP^{T}")],
          t(
            `The items must be the matching dimension. ${byColumns ? `$N$ is $${nDims}$ and $P$ is $${pDims}$, so $NP$ is defined and is $${groups} \\times 1$` : `$P$ is $${pDims}$ and $N$ is $${nDims}$, so $PN$ is defined and is $1 \\times ${groups}$`}: one total for each ${who.each}.`,
            `商品必须是相匹配的那一维。${byColumns ? `$N$ 是 $${nDims}$，$P$ 是 $${pDims}$，所以 $NP$ 有定义，是 $${groups} \\times 1$ 矩阵` : `$P$ 是 $${pDims}$，$N$ 是 $${nDims}$，所以 $PN$ 有定义，是 $1 \\times ${groups}$ 矩阵`}：${who.eachZh}一个总量。`,
          ),
        );
      },
    ),
  ],
);

/** cubeParts writes (p·x)³ ± q³ pieces for the sum- and difference-of-cubes topic. */
function cubeParts(p: number, q: number, plus: boolean) {
  const s = plus ? "+" : "-";
  const o = plus ? "-" : "+";
  const px = p === 1 ? "x" : `${p}x`;
  const pp = p * p === 1 ? "" : String(p * p);
  return {
    cubic: `${p ** 3 === 1 ? "" : p ** 3}x^{3} ${s} ${q ** 3}`,
    linear: `${px} ${s} ${q}`,
    quadratic: `${pp}x^{2} ${o} ${p * q === 1 ? "" : p * q}x + ${q * q}`,
    wrongQuadratic: `${pp}x^{2} ${s} ${p * q === 1 ? "" : p * q}x + ${q * q}`,
  };
}

/** simplifyingRationalExpressionsWithSumsAndDifferencesOfCubes cancels factors of sums and differences of cubes. */
export const simplifyingRationalExpressionsWithSumsAndDifferencesOfCubes = topic(
  "simplifying-rational-expressions-with-sums-and-differences-of-cubes",
  t("Simplifying Cubic Rational Expressions by Factoring", "通过因式分解化简三次有理式"),
  t(
    "Factor $a^{3} - b^{3} = (a - b)(a^{2} + ab + b^{2})$ and $a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2})$ in a rational expression, then cancel the common factors.",
    "在有理式中用 $a^{3} - b^{3} = (a - b)(a^{2} + ab + b^{2})$ 和 $a^{3} + b^{3} = (a + b)(a^{2} - ab + b^{2})$ 分解因式，再约去公因式。",
  ),
  ["factoring-sums-and-differences-of-cubes", "simplifying-rational-expressions-by-factoring"],
  ["A-SSE.A.2", "A-APR.D.6"],
  [
    kp(
      "cubes-over-a-linear-factor",
      t("A sum or difference of cubes over a linear factor", "立方和或立方差除以一次因式"),
      t(
        "A difference of cubes always contains the factor $a - b$, and a sum of cubes always contains $a + b$, so a quotient such as $\\frac{x^{3} - 8}{x - 2}$ simplifies by factoring the numerator: $\\frac{(x - 2)(x^{2} + 2x + 4)}{x - 2} = x^{2} + 2x + 4$ for $x \\ne 2$. Remember the signs: the middle term of the quadratic factor has the opposite sign to the one between the cubes, and the last term is always positive.",
        "立方差总含有因式 $a - b$，立方和总含有因式 $a + b$，所以像 $\\frac{x^{3} - 8}{x - 2}$ 这样的商可以通过分解分子来化简：当 $x \\ne 2$ 时，$\\frac{(x - 2)(x^{2} + 2x + 4)}{x - 2} = x^{2} + 2x + 4$。注意符号：二次因式的中间项与两个立方之间的符号相反，最后一项总是正的。",
      ),
      (rng) => {
        const p = rng.pick([1, 1, 2, 3]);
        const q = rng.int(1, 5);
        const plus = rng.bool();
        const c = cubeParts(p, q, plus);
        return expressionProblem({
          prompt: t(
            `Simplify $\\dfrac{${c.cubic}}{${c.linear}}$ for $x \\ne ${Q.of(plus ? -q : q, p).toLatex()}$.`,
            `当 $x \\ne ${Q.of(plus ? -q : q, p).toLatex()}$ 时，化简 $\\dfrac{${c.cubic}}{${c.linear}}$。`,
          ),
          answer: c.quadratic,
          simplified: true,
          wrong: [c.wrongQuadratic, `${p * p === 1 ? "" : p * p}x^{2} + ${q * q}`, `(${c.linear})^{2}`],
          solution: t(
            `Factor the ${plus ? "sum" : "difference"} of cubes: $${c.cubic} = (${c.linear})(${c.quadratic})$. Cancelling $${c.linear}$ leaves $${c.quadratic}$.`,
            `把立方${plus ? "和" : "差"}分解因式：$${c.cubic} = (${c.linear})(${c.quadratic})$。约去 $${c.linear}$ 后剩下 $${c.quadratic}$。`,
          ),
        });
      },
    ),
    kp(
      "cubes-over-a-difference-of-squares",
      t("A difference of cubes over a difference of squares", "立方差除以平方差"),
      t(
        "When both the numerator and the denominator factor, factor both completely before cancelling. In $\\frac{x^{3} - 27}{x^{2} - 9}$, the numerator is $(x - 3)(x^{2} + 3x + 9)$ and the denominator is $(x - 3)(x + 3)$. Only the common factor $x - 3$ cancels, leaving $\\frac{x^{2} + 3x + 9}{x + 3}$; the quadratic $x^{2} + 3x + 9$ has no real roots, so nothing else cancels.",
        "当分子和分母都能分解时，先把它们完全分解再约分。在 $\\frac{x^{3} - 27}{x^{2} - 9}$ 中，分子是 $(x - 3)(x^{2} + 3x + 9)$，分母是 $(x - 3)(x + 3)$。只有公因式 $x - 3$ 能约去，剩下 $\\frac{x^{2} + 3x + 9}{x + 3}$；二次式 $x^{2} + 3x + 9$ 没有实根，所以不能再约分。",
      ),
      (rng) => {
        const [p, q] = rng.pick([
          [1, 1],
          [1, 2],
          [1, 3],
          [1, 4],
          [1, 5],
          [1, 6],
          [2, 1],
          [2, 3],
          [2, 5],
          [3, 1],
          [3, 2],
          [3, 4],
          [3, 5],
          [4, 1],
          [4, 3],
          [4, 5],
        ] as const);
        const plus = rng.bool();
        const c = cubeParts(p, q, plus);
        const px = p === 1 ? "x" : `${p}x`;
        const other = `${px} ${plus ? "-" : "+"} ${q}`;
        const square = `${p === 1 ? "" : p * p}x^{2} - ${q * q}`;
        const excluded = Q.of(q, p).toLatex();
        const answer = `\\frac{${c.quadratic}}{${other}}`;
        return expressionProblem({
          prompt: t(
            `Simplify $\\dfrac{${c.cubic}}{${square}}$ for $x \\ne \\pm ${excluded}$.`,
            `当 $x \\ne \\pm ${excluded}$ 时，化简 $\\dfrac{${c.cubic}}{${square}}$。`,
          ),
          answer,
          lowest: true,
          wrong: [`\\frac{${c.wrongQuadratic}}{${other}}`, `\\frac{${c.quadratic}}{${c.linear}}`, c.linear],
          solution: t(
            steps(
              `Factor both parts: $\\dfrac{(${c.linear})(${c.quadratic})}{(${c.linear})(${other})}$.`,
              `Cancel $${c.linear}$: the result is $${answer}$.`,
            ),
            steps(
              `把分子分母都分解：$\\dfrac{(${c.linear})(${c.quadratic})}{(${c.linear})(${other})}$。`,
              `约去 $${c.linear}$，结果为 $${answer}$。`,
            ),
          ),
        });
      },
    ),
  ],
);

export /** circleMarks draws the circle x² + y² = r² as its upper and lower halves. */
function circleMarks(r: number): PlaneMark[] {
  const half = (x: number) => Math.sqrt(Math.max(0, r * r - x * x));
  return [
    { kind: "curve", f: half, from: -r, to: r },
    { kind: "curve", f: (x) => -half(x), from: -r, to: r },
  ];
}

const systemsView = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 };

/** circleAndLinesFigure shows x² + y² = 25 with lines that cross it twice, touch it once and miss it. */
const circleAndLinesFigure: Figure = {
  svg: plane(systemsView, [
    ...circleMarks(5),
    { kind: "line", a: [0, 3], b: [1, 3], accent: true },
    { kind: "line", a: [0, 5], b: [1, 5], dashed: true },
    { kind: "line", a: [0, 7], b: [1, 7], dashed: true },
    { kind: "point", at: [-4, 3], accent: true },
    { kind: "point", at: [4, 3], accent: true },
    { kind: "point", at: [0, 5], accent: true },
    { kind: "label", at: [8, 3], text: "y = 3", dir: "sw" },
    { kind: "label", at: [8, 5], text: "y = 5", dir: "nw" },
    { kind: "label", at: [8, 7], text: "y = 7", dir: "nw" },
  ]),
  alt: t(
    "The circle x² + y² = 25 with three horizontal lines: y = 3 crosses it at (−4, 3) and (4, 3), y = 5 touches it at (0, 5), and y = 7 passes above it.",
    "圆 x² + y² = 25 与三条水平线：y = 3 与它交于 (−4, 3) 和 (4, 3)，y = 5 在 (0, 5) 处与它相切，y = 7 从它上方经过。",
  ),
};

/** parabolaAndLinesFigure shows y = (x − 1)² − 3 with lines that cross it twice, touch it once and miss it. */
const parabolaAndLinesFigure: Figure = {
  svg: plane(systemsView, [
    { kind: "curve", f: (x) => (x - 1) ** 2 - 3 },
    { kind: "line", a: [0, 1], b: [1, 1], accent: true },
    { kind: "line", a: [0, -3], b: [1, -3], dashed: true },
    { kind: "line", a: [0, -5], b: [1, -5], dashed: true },
    { kind: "point", at: [-1, 1], accent: true },
    { kind: "point", at: [3, 1], accent: true },
    { kind: "point", at: [1, -3], accent: true },
    { kind: "label", at: [8, 1], text: "y = 1", dir: "nw" },
    { kind: "label", at: [8, -3], text: "y = −3", dir: "nw" },
    { kind: "label", at: [8, -5], text: "y = −5", dir: "sw" },
  ]),
  alt: t(
    "The upward parabola y = (x − 1)² − 3 with vertex (1, −3) and three horizontal lines: y = 1 crosses it at (−1, 1) and (3, 1), y = −3 touches it at the vertex, and y = −5 passes below it.",
    "开口向上的抛物线 y = (x − 1)² − 3，顶点为 (1, −3)，以及三条水平线：y = 1 与它交于 (−1, 1) 和 (3, 1)，y = −3 在顶点处与它相切，y = −5 从它下方经过。",
  ),
};

/** checkingPointFigure shows x² + y² = 25 and y = x + 1 meeting at (3, 4) and (−4, −3), with (4, 3) on the circle only. */
const checkingPointFigure: Figure = {
  svg: plane(systemsView, [
    ...circleMarks(5),
    { kind: "line", a: [0, 1], b: [1, 2], accent: true },
    { kind: "point", at: [3, 4], accent: true, label: "(3, 4)", dir: "w" },
    { kind: "point", at: [-4, -3], accent: true, label: "(−4, −3)", dir: "w" },
    { kind: "point", at: [4, 3], open: true, label: "(4, 3)", dir: "e" },
  ]),
  alt: t(
    "The circle x² + y² = 25 and the line y = x + 1, which meet at (3, 4) and (−4, −3); the point (4, 3) lies on the circle but not on the line.",
    "圆 x² + y² = 25 与直线 y = x + 1 交于 (3, 4) 和 (−4, −3)；点 (4, 3) 在圆上，但不在直线上。",
  ),
};

/** vertexForm writes a(x − h)² + v in LaTeX, leaving out a unit coefficient and zero terms. */
function vertexForm(a: number, h: number, v: number): string {
  const sq = h === 0 ? "x^{2}" : `(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})^{2}`;
  const coef = a === 1 ? "" : a === -1 ? "-" : String(a);
  return `${coef}${sq}${v === 0 ? "" : ` ${v < 0 ? "-" : "+"} ${Math.abs(v)}`}`;
}

/** lineAt writes m · x + b with the number x substituted, for checking a point on y = mx + b. */
const lineAt = (m: number, b: number, x: number) => `${m} \\cdot ${paren(x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;

/** plain writes a LaTeX expression for alt text: superscript squares, true minus signs and no braces. */
const plain = (latex: string) =>
  latex
    .replace(/\^\{2\}/g, "²")
    .replace(/-/g, "−")
    .replace(/[{}]/g, "");

/** parabolaCheckFigure shows y = x² − 3 and y = x − 1 meeting at (2, 1) and (−1, −2), with (−2, 1) on the parabola only. */
const parabolaCheckFigure: Figure = {
  svg: plane(systemsView, [
    { kind: "curve", f: (x) => x * x - 3 },
    { kind: "line", a: [0, -1], b: [1, 0], accent: true },
    { kind: "point", at: [2, 1], accent: true, label: "(2, 1)", dir: "e" },
    { kind: "point", at: [-1, -2], accent: true, label: "(−1, −2)", dir: "w" },
    { kind: "point", at: [-2, 1], open: true, label: "(−2, 1)", dir: "w" },
  ]),
  alt: t(
    "The parabola y = x² − 3 and the line y = x − 1, which meet at (2, 1) and (−1, −2); the point (−2, 1) lies on the parabola but not on the line.",
    "抛物线 y = x² − 3 与直线 y = x − 1 交于 (2, 1) 和 (−1, −2)；点 (−2, 1) 在抛物线上，但不在直线上。",
  ),
};

/** solvingSystemsOfNonlinearEquationsUsingGraphs reads, counts and checks the solutions of a system as the points where its graphs meet. */
const solvingSystemsOfNonlinearEquationsUsingGraphs = topic(
  "solving-systems-of-nonlinear-equations-using-graphs",
  t("Solving Systems of Nonlinear Equations Using Graphs", "用图象解非线性方程组"),
  t(
    "Treat the solutions of a system as the points where the graphs of its equations meet: read them from a graph, count them by picturing a parabola together with a horizontal line, and check a point by testing it in both equations.",
    "把方程组的解看作各方程图象的交点：从图象上读出解，通过想象抛物线与水平线的位置来数出解的个数，并把一个点代入两个方程来检验它是否为解。",
  ),
  ["solving-systems-of-nonlinear-equations"],
  ["A-REI.C.7", "A-REI.D.11"],
  [
    kp(
      "reading-solutions-from-a-graph",
      t("Reading the solutions from a graph", "从图象读出解"),
      t(
        "Each solution of a system is a point that lies on the graph of every equation, so once the graphs are drawn, the solutions are the points where they cross. Read the coordinates of each crossing point from the grid, then substitute them into both equations to confirm that the reading is exact.",
        "方程组的每个解都是同时位于每个方程图象上的点，所以画出图象后，解就是图象的交点。从网格上读出每个交点的坐标，再代入两个方程，确认读数准确。",
      ),
      (rng) => {
        const a = rng.pick([1, -1]);
        const h = rng.int(-2, 2);
        const v = a > 0 ? rng.int(-6, -1) : rng.int(1, 6);
        const f = (x: number) => a * (x - h) ** 2 + v;
        const [x1, x2] = rng
          .sample([-3, -2, -1, 1, 2, 3], 2)
          .map((d) => h + d)
          .sort((p, q) => p - q) as [number, number];
        const m = a * (x1 + x2 - 2 * h);
        const b = f(x1) - m * x1;
        const parabola = vertexForm(a, h, v);
        const line = linear(m, b);
        return {
          ...pointProblem({
            prompt: t(
              `The graphs of the equations of the system $y = ${parabola}$, $y = ${line}$ are shown. Which solution has the greater $x$-coordinate?`,
              `图中是方程组 $y = ${parabola}$，$y = ${line}$ 中两个方程的图象。哪个解的 $x$ 坐标较大？`,
            ),
            answer: [x2, f(x2)],
            wrong: [
              [x1, f(x1)],
              [f(x2), x2],
              [h, v],
            ],
            solution: t(
              `The graphs cross at $(${x1}, ${f(x1)})$ and $(${x2}, ${f(x2)})$, and the second has the greater $x$-coordinate. Check it in both equations: $${vertexForm(a, h, v).replace(/x/g, paren(x2))} = ${f(x2)}$ and $${lineAt(m, b, x2)} = ${f(x2)}$.`,
              `两个图象交于 $(${x1}, ${f(x1)})$ 和 $(${x2}, ${f(x2)})$，后者的 $x$ 坐标较大。代入两个方程检验：$${vertexForm(a, h, v).replace(/x/g, paren(x2))} = ${f(x2)}$，$${lineAt(m, b, x2)} = ${f(x2)}$。`,
            ),
          }),
          figure: {
            svg: plane(systemsView, [
              { kind: "curve", f },
              { kind: "line", a: [0, b], b: [1, m + b], accent: true },
            ]),
            alt: t(
              `The parabola y = ${plain(parabola)} and the line y = ${plain(line)} drawn on the same grid.`,
              `在同一网格中画出的抛物线 y = ${plain(parabola)} 与直线 y = ${plain(line)}。`,
            ),
          },
        };
      },
    ),
    kp(
      "a-parabola-and-a-horizontal-line",
      t("A parabola and a horizontal line", "抛物线与水平线"),
      t(
        "The graph of $y = a(x - h)^{2} + v$ is a parabola with vertex $(h, v)$; it opens upward when $a > 0$, so $v$ is its lowest $y$-value, and downward when $a < 0$, so $v$ is its highest. A horizontal line $y = k$ on the open side of the vertex crosses the parabola twice, the line $y = v$ touches it once at the vertex, and a line beyond the vertex misses it.",
        "$y = a(x - h)^{2} + v$ 的图象是顶点为 $(h, v)$ 的抛物线；$a > 0$ 时开口向上，$v$ 是最小的 $y$ 值；$a < 0$ 时开口向下，$v$ 是最大的 $y$ 值。位于抛物线开口一侧的水平线 $y = k$ 与它交于两点，直线 $y = v$ 在顶点处与它切于一点，越过顶点另一侧的直线与它不相交。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const h = rng.int(-5, 5);
        const v = rng.int(-6, 6);
        const kind = rng.int(0, 2);
        const up = a > 0;
        const k = kind === 1 ? v : (kind === 0) === up ? v + rng.int(1, 6) : v - rng.int(1, 6);
        const answer = kind === 0 ? 2 : kind === 1 ? 1 : 0;
        const sq = h === 0 ? "x^{2}" : `(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})^{2}`;
        const coef = a === 1 ? "" : a === -1 ? "-" : String(a);
        const rhs = `${coef}${sq}${v === 0 ? "" : ` ${v < 0 ? "-" : "+"} ${Math.abs(v)}`}`;
        return numberProblem({
          prompt: t(
            `How many real solutions does the system $y = ${rhs}$, $y = ${k}$ have?`,
            `方程组 $y = ${rhs}$，$y = ${k}$ 有多少个实数解？`,
          ),
          answer,
          form: "integer",
          wrong: [0, 1, 2, 3],
          solution: t(
            `The parabola opens ${up ? "upward" : "downward"} from its vertex $(${h}, ${v})$, so its ${up ? "least" : "greatest"} $y$-value is $${v}$. The line $y = ${k}$ ${kind === 0 ? "lies on the open side and crosses it twice" : kind === 1 ? "passes through the vertex and touches it once" : `lies ${up ? "below" : "above"} the vertex and misses it`}: ${answer === 1 ? "$1$ solution" : `$${answer}$ solutions`}.`,
            `抛物线从顶点 $(${h}, ${v})$ 开口向${up ? "上" : "下"}，所以它的最${up ? "小" : "大"} $y$ 值为 $${v}$。直线 $y = ${k}$ ${kind === 0 ? "位于开口一侧，与抛物线交于两点" : kind === 1 ? "经过顶点，与抛物线切于一点" : `位于顶点${up ? "下方" : "上方"}，与抛物线不相交`}：共 $${answer}$ 个解。`,
          ),
        });
      },
      parabolaAndLinesFigure,
    ),
    kp(
      "checking-an-intersection-point",
      t("Checking an intersection point", "检验交点"),
      t(
        "A point that looks like an intersection on a graph is a solution only if its coordinates satisfy both equations exactly. To decide which listed point solves the system $y = x^{2} - 3$, $y = x - 1$, substitute each into both: $(2, 1)$ gives $2^{2} - 3 = 1$ and $2 - 1 = 1$, so it is a solution, while $(-2, 1)$ lies on the parabola but the line gives $-2 - 1 = -3$ there.",
        "图象上看起来像交点的点，只有当它的坐标恰好满足两个方程时才是解。要判断所列哪个点是方程组 $y = x^{2} - 3$，$y = x - 1$ 的解，把每个点代入两个方程：$(2, 1)$ 给出 $2^{2} - 3 = 1$ 和 $2 - 1 = 1$，所以它是解；而 $(-2, 1)$ 在抛物线上，但直线在该处给出 $-2 - 1 = -3$。",
      ),
      (rng) => {
        const c = rng.int(-4, 3);
        const [r1, r2] = rng.sample([-3, -2, -1, 0, 1, 2, 3], 2) as [number, number];
        const m = r1 + r2;
        const b = c - r1 * r2;
        const onParabola = (x: number) => x * x + c;
        const onLine = (x: number) => m * x + b;
        const x0 = rng.pick([r1, r2]);
        const y0 = onParabola(x0);
        const others = [-3, -2, -1, 0, 1, 2, 3].filter((x) => x !== r1 && x !== r2);
        const [x3, x4] = rng.sample(others, 2) as [number, number];
        const pt = (x: number, y: number) => mathText(`(${x}, ${y})`);
        const swapped = onParabola(y0) === x0 && onLine(y0) === x0 ? [] : [pt(y0, x0)];
        const parabola = poly([1, "x^{2}"], [c, ""]);
        const line = linear(m, b);
        return pickChoice(
          rng,
          t(
            `Which point is a solution of the system $y = ${parabola}$, $y = ${line}$?`,
            `哪个点是方程组 $y = ${parabola}$，$y = ${line}$ 的解？`,
          ),
          pt(x0, y0),
          [pt(x3, onParabola(x3)), pt(x4, onLine(x4)), ...swapped],
          t(
            `Substitute $(${x0}, ${y0})$: $${paren(x0)}^{2} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${y0}$ and $${lineAt(m, b, x0)} = ${y0}$, so it lies on both graphs. The point $(${x3}, ${onParabola(x3)})$ lies on the parabola, but the line gives $${onLine(x3)}$ at $x = ${x3}$; the point $(${x4}, ${onLine(x4)})$ lies on the line, but the parabola gives $${onParabola(x4)}$ at $x = ${x4}$.`,
            `代入 $(${x0}, ${y0})$：$${paren(x0)}^{2} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${y0}$，且 $${lineAt(m, b, x0)} = ${y0}$，所以它在两个图象上。点 $(${x3}, ${onParabola(x3)})$ 在抛物线上，但直线在 $x = ${x3}$ 处给出 $${onLine(x3)}$；点 $(${x4}, ${onLine(x4)})$ 在直线上，但抛物线在 $x = ${x4}$ 处给出 $${onParabola(x4)}$。`,
          ),
        );
      },
      parabolaCheckFigure,
    ),
  ],
);

/** systemsWithACircleAndALine counts and checks the solutions of a system of a circle and a line. */
const systemsWithACircleAndALine = topic(
  "systems-with-a-circle-and-a-line",
  t("Systems With a Circle and a Line", "圆与直线组成的方程组"),
  t(
    "Count the solutions of a system of a circle centered at the origin and a line by picturing where the line meets the circle, and check a point by testing it in both equations.",
    "通过想象直线与以原点为圆心的圆的位置关系来数出方程组的解的个数，并把一个点代入两个方程来检验它是否为解。",
  ),
  ["solving-systems-of-nonlinear-equations-using-graphs", "equations-of-circles"],
  ["A-REI.C.7"],
  [
    kp(
      "a-circle-and-a-line",
      t("A circle and a horizontal or vertical line", "圆与水平线或竖直线"),
      t(
        "Each solution of a system is a point on both graphs, so the number of solutions is the number of points where the graphs cross or touch. The circle $x^{2} + y^{2} = r^{2}$ reaches from $-r$ to $r$ in each direction. A horizontal line $y = k$ cuts it twice when $|k| < r$, touches it once when $|k| = r$, and misses it when $|k| > r$; a vertical line $x = k$ behaves the same way.",
        "方程组的每个解都是两个图象上共同的点，所以解的个数就是图象相交或相切的点的个数。圆 $x^{2} + y^{2} = r^{2}$ 在每个方向上都从 $-r$ 延伸到 $r$。水平线 $y = k$ 在 $|k| < r$ 时与它交于两点，$|k| = r$ 时与它切于一点，$|k| > r$ 时与它不相交；竖直线 $x = k$ 的情况相同。",
      ),
      (rng) => {
        const r = rng.int(2, 9);
        const kind = rng.int(0, 2);
        const k = rng.sign() * (kind === 0 ? rng.int(0, r - 1) : kind === 1 ? r : rng.int(r + 1, r + 6));
        const answer = kind === 0 ? 2 : kind === 1 ? 1 : 0;
        const v = rng.pick(["x", "y"]);
        return numberProblem({
          prompt: t(
            `How many real solutions does the system $x^{2} + y^{2} = ${r * r}$, $${v} = ${k}$ have?`,
            `方程组 $x^{2} + y^{2} = ${r * r}$，$${v} = ${k}$ 有多少个实数解？`,
          ),
          answer,
          form: "integer",
          wrong: [0, 1, 2, 4],
          solution: t(
            `The circle has radius $${r}$. Since $|${k}| ${kind === 0 ? "<" : kind === 1 ? "=" : ">"} ${r}$, the line ${kind === 0 ? "crosses the circle twice" : kind === 1 ? "touches the circle once" : "misses the circle"}, so there ${answer === 1 ? "is $1$ solution" : `are $${answer}$ solutions`}.`,
            `圆的半径为 $${r}$。因为 $|${k}| ${kind === 0 ? "<" : kind === 1 ? "=" : ">"} ${r}$，这条直线${kind === 0 ? "与圆交于两点" : kind === 1 ? "与圆切于一点" : "与圆不相交"}，所以有 $${answer}$ 个解。`,
          ),
        });
      },
      circleAndLinesFigure,
    ),
    kp(
      "checking-a-point-on-a-circle-and-a-line",
      t("Checking a point on a circle and a line", "检验圆与直线的交点"),
      t(
        "A point that looks like an intersection on a graph is a solution only if its coordinates satisfy both equations exactly. To decide which listed point solves the system $x^{2} + y^{2} = 25$, $y = x + 1$, substitute each into both: $(3, 4)$ gives $9 + 16 = 25$ and $4 = 3 + 1$, so it is a solution, while $(4, 3)$ lies on the circle but not on the line.",
        "图象上看起来像交点的点，只有当它的坐标恰好满足两个方程时才是解。要判断所列哪个点是方程组 $x^{2} + y^{2} = 25$，$y = x + 1$ 的解，把每个点代入两个方程：$(3, 4)$ 给出 $9 + 16 = 25$ 和 $4 = 3 + 1$，所以它是解；而 $(4, 3)$ 在圆上却不在直线上。",
      ),
      (rng) => {
        const [p, q, c] = rng.pick([
          [3, 4, 5],
          [5, 12, 13],
          [6, 8, 10],
        ] as const);
        const pts: [number, number][] = [];
        for (const [x, y] of [
          [p, q],
          [q, p],
        ] as const)
          for (const sx of [1, -1]) for (const sy of [1, -1]) pts.push([sx * x, sy * y]);
        // Pairs of lattice points joined by a line with an integer slope and intercept, not through the center.
        const pairs = pts.flatMap((A) =>
          pts
            .filter(([x, y]) => x !== A[0] && !(x === -A[0] && y === -A[1]))
            .filter(([x, y]) => (y - A[1]) % (x - A[0]) === 0 && (A[1] * x - y * A[0]) % (x - A[0]) === 0)
            .map((B) => [A, B] as const),
        );
        const [P1, P2] = rng.pick(pairs);
        const m = Q.of(P2[1] - P1[1], P2[0] - P1[0]);
        const b = Q.of(P1[1]).sub(m.mul(Q.of(P1[0])));
        const onLine = ([x, y]: [number, number]) => Q.of(y).eq(m.mul(Q.of(x)).add(b));
        const mx = m.eq(Q.of(1)) ? "x" : m.eq(Q.of(-1)) ? "-x" : `${m.toLatex()}x`;
        const line =
          m.sign() === 0
            ? `y = ${b.toLatex()}`
            : b.sign() === 0
              ? `y = ${mx}`
              : `y = ${mx} ${b.sign() < 0 ? "-" : "+"} ${b.abs().toLatex()}`;
        const [x0, y0] = rng.bool() ? P1 : P2;
        const offCircle: [number, number] = [2 * P2[0] - P1[0], 2 * P2[1] - P1[1]];
        const wrongPts = [
          ...rng.sample(
            pts.filter((pt) => !onLine(pt)),
            2,
          ),
          offCircle,
        ];
        const pt = ([x, y]: readonly [number, number]) => mathText(`(${x}, ${y})`);
        return pickChoice(
          rng,
          t(
            `Which point is a solution of the system $x^{2} + y^{2} = ${c * c}$, $${line}$?`,
            `哪个点是方程组 $x^{2} + y^{2} = ${c * c}$，$${line}$ 的解？`,
          ),
          pt([x0, y0]),
          wrongPts.map(pt),
          t(
            `Substitute $(${x0}, ${y0})$: $${paren(x0)}^{2} + ${paren(y0)}^{2} = ${c * c}$, and it satisfies $${line}$, so it lies on both graphs. Each other point fails at least one of the equations.`,
            `代入 $(${x0}, ${y0})$：$${paren(x0)}^{2} + ${paren(y0)}^{2} = ${c * c}$，并且它满足 $${line}$，所以它在两个图象上。其他每个点都至少不满足其中一个方程。`,
          ),
        );
      },
      checkingPointFigure,
    ),
  ],
);

/** actNumberAlgebraTopics lists the ACT Math number and algebra topics in prerequisite order. */
export const actNumberAlgebraTopics: readonly TopicDef[] = [
  findingOnesDigitsOfPowers,
  recoveringDigitsFromBaseExpansions,
  countingIntegersWithinBounds,
  applyingDefinedOperations,
  propertiesOfRealNumberOperations,
  comparingQuantitiesUnderConstraints,
  slantAsymptotesOfRationalFunctions,
  jointVariation,
  realNumberRestrictions,
  evaluatingExpressionsUsingGivenRelations,
  matrixEquations,
  modelingWithMatrixProducts,
  simplifyingRationalExpressionsWithSumsAndDifferencesOfCubes,
  solvingSystemsOfNonlinearEquationsUsingGraphs,
  systemsWithACircleAndALine,
];
