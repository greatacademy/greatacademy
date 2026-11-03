import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// ACT Math, number and algebra: ones digits of powers, digits of expansions in powers of a base, counting integers
// between bounds, defined operations, properties of operations, comparing quantities under constraints, slant
// asymptotes and joint variation.

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
  t("Finding Ones Digits of Powers", "求幂的个位数字"),
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
  t("Recovering Digits From Base Expansions", "由按幂展开的式子求数字"),
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
  t("Counting Integers Within Bounds", "计算范围内的整数个数"),
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
  t("Properties of Real-Number Operations", "实数运算的性质"),
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
  t("Comparing Quantities Under Constraints", "在约束条件下比较大小"),
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
  t("Slant Asymptotes of Rational Functions", "有理函数的斜渐近线"),
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
        return pickChoice(
          rng,
          t(
            `Which describes the end behavior asymptote of the graph of $f(x) = \\frac{${term(n)}}{${term(d)}}$?`,
            `下列哪项描述了 $f(x) = \\frac{${term(n)}}{${term(d)}}$ 的图象在两端的渐近线？`,
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
  t("Joint Variation", "联合变化"),
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
];
