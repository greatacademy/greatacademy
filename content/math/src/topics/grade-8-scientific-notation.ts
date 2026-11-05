import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q, sci } from "@ga/subject-math";

import { numberProblem, scientificProblem, scientificValue, steps } from "../problems.ts";
import { mantissa, normalize, standard } from "./exponents.ts";
import { compareProblem } from "./grade-4-fractions.ts";

// 8th Grade Math, scientific notation: writing numbers in scientific notation and back, comparing them, adding,
// subtracting, multiplying and dividing them, and estimating and comparing real-world quantities.

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

/** Sci is a number a × 10^n. */
interface Sci {
  readonly a: Q;
  readonly n: number;
}

/** value is the exact value of a × 10^n. */
const value = (s: Sci) => scientificValue(s.a, s.n);

/** show writes a × 10^n in LaTeX. */
const show = (s: Sci) => sci(s.a, s.n);

/** draw draws a number in scientific notation with an exponent between lo and hi. */
const draw = (rng: Rng, lo: number, hi: number): Sci => ({ a: mantissa(rng), n: rng.int(lo, hi) });

/** exponent draws a nonzero exponent between lo and hi, since a factor of 10^0 is not worth writing. */
function exponent(rng: Rng, lo: number, hi: number): number {
  const n = rng.int(lo, hi);
  return n === 0 ? exponent(rng, lo, hi) : n;
}

/** sciProblem builds a problem whose answer is the positive value v written in scientific notation. */
function sciProblem(prompt: Text, v: Q, solution: Text, wrong: readonly Sci[]): Problem {
  const s = normalize(v);
  return scientificProblem({
    prompt,
    answer: { a: s.a, n: s.n },
    solution,
    wrong: wrong.filter((w) => w.a.sign() > 0).map((w) => [w.a, w.n] as const),
  });
}

/** renormalize writes the step that moves a first factor outside [1, 10) back into it, or nothing. */
function renormalize(a: Q, n: number): string {
  const s = normalize(scientificValue(a, n));
  return s.n === n ? "" : ` = ${sci(s.a, s.n)}`;
}

/** places writes "1 place" or "n places". */
const places = (n: number) => `${n} place${n === 1 ? "" : "s"}`;

// ---------------------------------------------------------------------------
// Writing and comparing numbers in scientific notation

/** writingNumbersInScientificNotation writes large and small numbers as a × 10^n. */
export const writingNumbersInScientificNotation = topic(
  "writing-numbers-in-scientific-notation",
  t("Writing Numbers in Scientific Notation", "用科学记数法表示数"),
  t(
    "A number is in scientific notation when it is written a × 10ⁿ with 1 ≤ a < 10 and n an integer. Move the decimal point until exactly one nonzero digit is in front of it; n is the number of places moved, positive for a number of 10 or more and negative for a number less than 1.",
    "把数写成 a × 10ⁿ 的形式，其中 1 ≤ a < 10，n 为整数，就是科学记数法。移动小数点，使它前面恰好有一个非零数字；n 是移动的位数，数大于或等于 10 时为正，小于 1 时为负。",
  ),
  ["negative-exponents"],
  ["8.EE.A.3"],
  [
    {
      id: "writing-large-numbers",
      title: t("Large numbers", "大数"),
      explanation: t(
        "For $45{,}000$, move the decimal point $4$ places left to get $4.5$, which is between $1$ and $10$. Moving left divided by $10^{4}$, so multiply back: $45{,}000 = 4.5 \\times 10^{4}$. Writing $45 \\times 10^{3}$ has the right value but is not scientific notation, because $45 \\ge 10$.",
        "对于 $45{,}000$，把小数点向左移动 $4$ 位得到 $4.5$，它在 $1$ 和 $10$ 之间。向左移动相当于除以 $10^{4}$，所以要乘回来：$45{,}000 = 4.5 \\times 10^{4}$。写成 $45 \\times 10^{3}$ 虽然值相等，但不是科学记数法，因为 $45 \\ge 10$。",
      ),
      generate(rng) {
        const s = draw(rng, 3, 10);
        const v = value(s);
        return sciProblem(
          t(`Write $${standard(v)}$ in scientific notation.`, `用科学记数法表示 $${standard(v)}$。`),
          v,
          t(
            `Move the decimal point ${places(s.n)} to the left to get $${dec(s.a)}$:${steps(`${standard(v)} = ${show(s)}`)}`,
            `把小数点向左移动 ${s.n} 位得到 $${dec(s.a)}$：${steps(`${standard(v)} = ${show(s)}`)}`,
          ),
          // Counting the digits instead of the places, one place short, and the wrong sign.
          [
            { a: s.a, n: s.n + 1 },
            { a: s.a, n: s.n - 1 },
            { a: s.a, n: -s.n },
          ],
        );
      },
    },
    {
      id: "writing-small-numbers",
      title: t("Small numbers", "小数"),
      explanation: t(
        "For $0.00032$, move the decimal point $4$ places right, past the first nonzero digit, to get $3.2$. Moving right multiplied by $10^{4}$, so multiply by $10^{-4}$ to undo it: $0.00032 = 3.2 \\times 10^{-4}$. Count the places moved, not the zeros after the decimal point, which are one fewer.",
        "对于 $0.00032$，把小数点向右移过第一个非零数字，共移动 $4$ 位，得到 $3.2$。向右移动相当于乘以 $10^{4}$，所以要乘以 $10^{-4}$ 还原：$0.00032 = 3.2 \\times 10^{-4}$。要数移动的位数，而不是小数点后面 $0$ 的个数，后者少一个。",
      ),
      generate(rng) {
        const s = draw(rng, -8, -2);
        const v = value(s);
        return sciProblem(
          t(`Write $${standard(v)}$ in scientific notation.`, `用科学记数法表示 $${standard(v)}$。`),
          v,
          t(
            `Move the decimal point ${places(-s.n)} to the right, past the first nonzero digit, to get $${dec(s.a)}$:${steps(`${standard(v)} = ${show(s)}`)}`,
            `把小数点向右移过第一个非零数字，共移动 ${-s.n} 位，得到 $${dec(s.a)}$：${steps(`${standard(v)} = ${show(s)}`)}`,
          ),
          // A positive exponent, and counting only the zeros after the decimal point.
          [
            { a: s.a, n: -s.n },
            { a: s.a, n: s.n + 1 },
            { a: s.a, n: s.n - 1 },
          ],
        );
      },
    },
  ],
);

/** convertingScientificNotationToStandardNotation writes a × 10^n out in full. */
export const convertingScientificNotationToStandardNotation = topic(
  "converting-scientific-notation-to-standard-notation",
  t("Converting Scientific Notation to Standard Notation", "把科学记数法化为一般形式"),
  t(
    "Multiplying by $10^{n}$ moves the decimal point $n$ places to the right, and multiplying by $10^{-n}$ moves it $n$ places to the left. Fill any empty places with zeros.",
    "乘以 $10^{n}$ 就是把小数点向右移动 $n$ 位，乘以 $10^{-n}$ 就是向左移动 $n$ 位。空出的数位用 $0$ 补足。",
  ),
  ["writing-numbers-in-scientific-notation"],
  ["8.EE.A.3"],
  [
    {
      id: "positive-powers-of-ten",
      title: t("Positive powers of ten", "10 的正整数次幂"),
      explanation: t(
        "$6.07 \\times 10^{5}$: move the decimal point $5$ places right. Two of the places are taken by the digits $0$ and $7$, and three more zeros fill the rest: $607{,}000$. The exponent is the number of places moved, not the number of zeros written.",
        "$6.07 \\times 10^{5}$：把小数点向右移动 $5$ 位。其中两位由数字 $0$ 和 $7$ 占据，其余三位补 $0$：$607{,}000$。指数是小数点移动的位数，而不是写出的 $0$ 的个数。",
      ),
      generate(rng) {
        const s = draw(rng, 2, 9);
        const v = value(s);
        return numberProblem({
          prompt: t(`Write $${show(s)}$ in standard notation.`, `把 $${show(s)}$ 写成一般形式。`),
          answer: v,
          form: "decimal",
          // Writing n zeros after the digits, and moving one place too few or the wrong way.
          wrong: [
            ...(s.a.isInteger() ? [] : [Q.of(Number(s.a.n)).mul(Q.of(10).pow(s.n))]),
            scientificValue(s.a, s.n - 1),
            scientificValue(s.a, -s.n),
          ],
          solution: t(
            `Move the decimal point ${places(s.n)} to the right, filling empty places with zeros:${steps(`${show(s)} = ${standard(v)}`)}`,
            `把小数点向右移动 ${s.n} 位，空出的数位补 $0$：${steps(`${show(s)} = ${standard(v)}`)}`,
          ),
        });
      },
    },
    {
      id: "negative-powers-of-ten",
      title: t("Negative powers of ten", "10 的负整数次幂"),
      explanation: t(
        "$2.5 \\times 10^{-3}$: move the decimal point $3$ places left, writing zeros in front: $0.0025$. A negative exponent always gives a number between $0$ and $1$ when $a$ is between $1$ and $10$; it never makes the number negative.",
        "$2.5 \\times 10^{-3}$：把小数点向左移动 $3$ 位，前面补 $0$：$0.0025$。当 $a$ 在 $1$ 和 $10$ 之间时，负整数指数总是得到 $0$ 和 $1$ 之间的数；它不会使数变成负数。",
      ),
      generate(rng) {
        const s = draw(rng, -7, -1);
        const v = value(s);
        return numberProblem({
          prompt: t(`Write $${show(s)}$ in standard notation.`, `把 $${show(s)}$ 写成一般形式。`),
          answer: v,
          form: "decimal",
          // Writing n zeros after the decimal point, the opposite direction, and a negative number.
          wrong: [scientificValue(s.a, s.n - 1), scientificValue(s.a, -s.n), v.neg()],
          solution: t(
            `Move the decimal point ${places(-s.n)} to the left, filling empty places with zeros:${steps(`${show(s)} = ${standard(v)}`)}`,
            `把小数点向左移动 ${-s.n} 位，空出的数位补 $0$：${steps(`${show(s)} = ${standard(v)}`)}`,
          ),
        });
      },
    },
  ],
);

/** comparingNumbersInScientificNotation orders numbers in scientific notation and finds how many times one is another. */
export const comparingNumbersInScientificNotation = topic(
  "comparing-numbers-in-scientific-notation",
  t("Comparing Numbers in Scientific Notation", "比较用科学记数法表示的数"),
  t(
    "For positive numbers in scientific notation, the one with the greater power of ten is greater, whatever the first factors are; with equal powers, compare the first factors. To find how many times one number is another, divide: divide the first factors and subtract the exponents.",
    "对于用科学记数法表示的正数，$10$ 的指数较大的数较大，与前面的因数无关；指数相等时，比较前面的因数。要求一个数是另一个数的多少倍，就做除法：前面的因数相除，指数相减。",
  ),
  ["writing-numbers-in-scientific-notation"],
  ["8.EE.A.3"],
  [
    {
      id: "ordering-numbers-in-scientific-notation",
      title: t("Which is greater?", "比较大小"),
      explanation: t(
        "$9.1 \\times 10^{3} = 9{,}100$ and $1.2 \\times 10^{4} = 12{,}000$, so $9.1 \\times 10^{3} < 1.2 \\times 10^{4}$: the larger first factor does not win when the power of ten is smaller. Negative exponents follow the same rule: $10^{-3}$ is greater than $10^{-5}$.",
        "$9.1 \\times 10^{3} = 9{,}100$，$1.2 \\times 10^{4} = 12{,}000$，所以 $9.1 \\times 10^{3} < 1.2 \\times 10^{4}$：10 的指数较小时，前面的因数大也没用。负整数指数也一样：$10^{-3}$ 大于 $10^{-5}$。",
      ),
      generate(rng) {
        const negative = rng.bool(0.4);
        const n = negative ? rng.int(-8, -4) : rng.int(2, 9);
        const kind = rng.pick(["trap", "same", "far"] as const);
        const big = Q.of(rng.int(61, 99), 10);
        const small = Q.of(rng.int(11, 59), 10);
        const [x, y]: [Sci, Sci] =
          kind === "trap"
            ? [
                { a: big, n },
                { a: small, n: n + 1 },
              ]
            : kind === "same"
              ? [
                  { a: big, n },
                  { a: small, n },
                ]
              : [
                  { a: big, n },
                  { a: small, n: n + rng.int(2, 3) },
                ];
        const [l, r] = rng.bool() ? [x, y] : [y, x];
        const rel = value(l).cmp(value(r)) + 1;
        const sym = ["<", "=", ">"][rel]!;
        return compareProblem(
          show(l),
          show(r),
          rel,
          t(
            l.n === r.n
              ? `The powers of ten are equal, so compare the first factors: $${dec(l.a)} ${sym} ${dec(r.a)}$, so $${show(l)} ${sym} ${show(r)}$.`
              : `The power $10^{${Math.max(l.n, r.n)}}$ is greater than $10^{${Math.min(l.n, r.n)}}$, and the first factors are between $1$ and $10$, so $${show(l)} ${sym} ${show(r)}$.`,
            l.n === r.n
              ? `10 的指数相等，所以比较前面的因数：$${dec(l.a)} ${sym} ${dec(r.a)}$，因此 $${show(l)} ${sym} ${show(r)}$。`
              : `$10^{${Math.max(l.n, r.n)}}$ 大于 $10^{${Math.min(l.n, r.n)}}$，而前面的因数都在 $1$ 和 $10$ 之间，所以 $${show(l)} ${sym} ${show(r)}$。`,
          ),
        );
      },
    },
    {
      id: "how-many-times-as-large",
      title: t("How many times as large?", "是多少倍"),
      explanation: t(
        "$6 \\times 10^{8}$ is how many times as large as $2 \\times 10^{3}$? Divide the first factors and subtract the exponents: $\\frac{6}{2} \\times 10^{8 - 3} = 3 \\times 10^{5}$. Subtracting the numbers instead answers a different question, how much larger.",
        "$6 \\times 10^{8}$ 是 $2 \\times 10^{3}$ 的多少倍？前面的因数相除，指数相减：$\\frac{6}{2} \\times 10^{8 - 3} = 3 \\times 10^{5}$。把两个数相减回答的是另一个问题：大多少。",
      ),
      generate(rng) {
        const [p, q] = rng.pick([
          [6, 2],
          [8, 2],
          [9, 3],
          [8, 4],
          [6, 3],
          [2, 4],
          [3, 6],
          [1, 2],
          [4, 8],
          [3, 5],
          [7, 2],
          [9, 2],
        ] as const);
        const m = exponent(rng, -4, 12);
        const n = m - rng.int(2, 9);
        if (n === 0) return this.generate(rng);
        const [x, y] = [
          { a: Q.of(p), n: m },
          { a: Q.of(q), n },
        ];
        const ratio = value(x).div(value(y));
        const k = Q.of(p, q);
        return sciProblem(
          t(
            `$${show(x)}$ is how many times as large as $${show(y)}$? Answer in scientific notation.`,
            `$${show(x)}$ 是 $${show(y)}$ 的多少倍？用科学记数法作答。`,
          ),
          ratio,
          t(
            `Divide the first factors and subtract the exponents:${steps(`\\frac{${show(x)}}{${show(y)}} = \\frac{${p}}{${q}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${dec(k)} \\times 10^{${m - n}}${renormalize(k, m - n)}`)}`,
            `前面的因数相除，指数相减：${steps(`\\frac{${show(x)}}{${show(y)}} = \\frac{${p}}{${q}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${dec(k)} \\times 10^{${m - n}}${renormalize(k, m - n)}`)}`,
          ),
          // Subtracting the exponents the other way, adding them, and dividing the first factors the other way.
          [
            { a: normalize(k).a, n: n - m + normalize(k).n },
            { a: normalize(k).a, n: m + n + normalize(k).n },
            ...(Q.of(q, p).mul(Q.of(100)).isInteger() ? [{ a: normalize(Q.of(q, p)).a, n: m - n + normalize(Q.of(q, p)).n }] : []),
          ],
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Operations in scientific notation

/** additionAndSubtractionInScientificNotation adds and subtracts numbers with the same power of ten. */
export const additionAndSubtractionInScientificNotation = topic(
  "addition-and-subtraction-in-scientific-notation",
  t("Addition and Subtraction in Scientific Notation", "科学记数法的加减"),
  t(
    "Numbers with the same power of ten add and subtract like like terms: add or subtract the first factors and keep the power of ten. If the result is no longer between 1 and 10, adjust it: 12.3 × 10⁴ = 1.23 × 10⁵.",
    "10 的指数相同的数像同类项一样相加减：前面的因数相加减，10 的幂不变。如果结果不再在 1 和 10 之间，就要调整：12.3 × 10⁴ = 1.23 × 10⁵。",
  ),
  ["writing-numbers-in-scientific-notation"],
  ["8.EE.A.4"],
  [
    {
      id: "adding-with-the-same-power",
      title: t("Adding with the same power of ten", "10 的指数相同的加法"),
      explanation: t(
        "$7.4 \\times 10^{6} + 4.9 \\times 10^{6} = (7.4 + 4.9) \\times 10^{6} = 12.3 \\times 10^{6}$. Since $12.3 \\ge 10$, write it as $1.23 \\times 10^{1} \\times 10^{6} = 1.23 \\times 10^{7}$. Keep the power of ten: adding the exponents too, to get $10^{12}$, is wrong.",
        "$7.4 \\times 10^{6} + 4.9 \\times 10^{6} = (7.4 + 4.9) \\times 10^{6} = 12.3 \\times 10^{6}$。由于 $12.3 \\ge 10$，写成 $1.23 \\times 10^{1} \\times 10^{6} = 1.23 \\times 10^{7}$。10 的幂保持不变：把指数也相加得到 $10^{12}$ 是错的。",
      ),
      generate(rng) {
        const n = rng.bool(0.3) ? rng.int(-7, -2) : rng.int(2, 11);
        const [a, b] = [mantissa(rng), mantissa(rng)];
        const s = a.add(b);
        return sciProblem(
          t(
            `Find $${sci(a, n)} + ${sci(b, n)}$. Give the answer in scientific notation.`,
            `计算 $${sci(a, n)} + ${sci(b, n)}$，结果用科学记数法表示。`,
          ),
          scientificValue(s, n),
          t(
            `The powers of ten are the same, so add the first factors:${steps(`(${dec(a)} + ${dec(b)}) \\times 10^{${n}} = ${sci(s, n)}${renormalize(s, n)}`)}`,
            `10 的指数相同，所以前面的因数相加：${steps(`(${dec(a)} + ${dec(b)}) \\times 10^{${n}} = ${sci(s, n)}${renormalize(s, n)}`)}`,
          ),
          // Adding the exponents too, and moving the decimal point without changing the exponent.
          [
            { a: normalize(s).a, n: 2 * n + normalize(s).n },
            { a: normalize(s).a, n },
          ],
        );
      },
    },
    {
      id: "subtracting-with-the-same-power",
      title: t("Subtracting with the same power of ten", "10 的指数相同的减法"),
      explanation: t(
        "When two numbers in scientific notation have the same power of ten, subtract the coefficients and keep the power. If the new coefficient is less than $1$, move the decimal point and lower the exponent so that the coefficient is at least $1$ and less than $10$.\n\n$5.2 \\times 10^{-3} - 4.7 \\times 10^{-3} = (5.2 - 4.7) \\times 10^{-3} = 0.5 \\times 10^{-3}$. Since $0.5 < 1$, write it as $5 \\times 10^{-1} \\times 10^{-3} = 5 \\times 10^{-4}$: the exponent goes down by $1$.",
        "两个科学记数法表示的数，如果 10 的指数相同，就把系数相减，10 的幂不变。如果新系数小于 $1$，就移动小数点并减小指数，使系数大于或等于 $1$ 且小于 $10$。\n\n$5.2 \\times 10^{-3} - 4.7 \\times 10^{-3} = (5.2 - 4.7) \\times 10^{-3} = 0.5 \\times 10^{-3}$。由于 $0.5 < 1$，写成 $5 \\times 10^{-1} \\times 10^{-3} = 5 \\times 10^{-4}$：指数减小 $1$。",
      ),
      generate(rng) {
        const n = rng.bool(0.3) ? rng.int(-7, -2) : rng.int(2, 11);
        const [x, y] = [mantissa(rng), mantissa(rng)];
        if (x.eq(y)) return this.generate(rng);
        const [a, b] = x.cmp(y) > 0 ? [x, y] : [y, x];
        const d = a.sub(b);
        return sciProblem(
          t(
            `Find $${sci(a, n)} - ${sci(b, n)}$. Give the answer in scientific notation.`,
            `计算 $${sci(a, n)} - ${sci(b, n)}$，结果用科学记数法表示。`,
          ),
          scientificValue(d, n),
          t(
            `The powers of ten are the same, so subtract the first factors:${steps(`(${dec(a)} - ${dec(b)}) \\times 10^{${n}} = ${sci(d, n)}${renormalize(d, n)}`)}`,
            `10 的指数相同，所以前面的因数相减：${steps(`(${dec(a)} - ${dec(b)}) \\times 10^{${n}} = ${sci(d, n)}${renormalize(d, n)}`)}`,
          ),
          // Subtracting the exponents too, and moving the decimal point without changing the exponent.
          [
            { a: normalize(d).a, n: normalize(d).n },
            { a: normalize(d).a, n },
          ],
        );
      },
    },
  ],
);

/** Pair is two numbers in scientific notation with the exponent of the first greater by gap. */
function pair(rng: Rng, gap: readonly [number, number], negative = 0.25): readonly [Sci, Sci] {
  const m = rng.bool(negative) ? rng.int(-6, -1) : rng.int(4, 11);
  return [
    { a: mantissa(rng), n: m },
    { a: mantissa(rng), n: m - rng.int(gap[0], gap[1]) },
  ];
}

/** matchSteps writes x ± y with y rewritten to the power of ten of x, the sum or difference, and its normal form. */
function matchSteps(x: Sci, y: Sci, op: "+" | "-"): string {
  const shifted = y.a.div(Q.of(10).pow(x.n - y.n));
  const r = op === "+" ? x.a.add(shifted) : x.a.sub(shifted);
  return `${show(x)} ${op} ${show(y)} = ${show(x)} ${op} ${sci(shifted, x.n)} = ${sci(r, x.n)}${renormalize(r, x.n)}`;
}

/** differentPowersProblem asks for x ± y in scientific notation when the powers of ten differ. */
function differentPowersProblem(x: Sci, y: Sci, op: "+" | "-"): Problem {
  const v = op === "+" ? value(x).add(value(y)) : value(x).sub(value(y));
  const naive = op === "+" ? x.a.add(y.a) : x.a.sub(y.a);
  return sciProblem(
    t(
      `Find $${show(x)} ${op} ${show(y)}$. Give the answer in scientific notation.`,
      `计算 $${show(x)} ${op} ${show(y)}$，结果用科学记数法表示。`,
    ),
    v,
    t(
      `Rewrite $${show(y)}$ with the power $10^{${x.n}}$ by moving its decimal point ${places(x.n - y.n)} to the left, then ${op === "+" ? "add" : "subtract"} the first factors:${steps(matchSteps(x, y, op))}`,
      `把小数点向左移动 ${x.n - y.n} 位，将 $${show(y)}$ 改写成含 $10^{${x.n}}$ 的形式，再把前面的因数${op === "+" ? "相加" : "相减"}：${steps(matchSteps(x, y, op))}`,
    ),
    // Combining the first factors without matching the powers, keeping either power or combining the exponents too, and
    // forgetting to adjust the exponent after moving the decimal point.
    [
      ...(naive.sign() > 0
        ? [x.n, y.n, op === "+" ? x.n + y.n : x.n - y.n].map((e) => ({ a: normalize(naive).a, n: e + normalize(naive).n }))
        : []),
      { a: normalize(v).a, n: x.n },
    ],
  );
}

/** additionInScientificNotationWithDifferentPowersOfTen adds numbers whose powers of ten differ. */
export const additionInScientificNotationWithDifferentPowersOfTen = topic(
  "addition-in-scientific-notation-with-different-powers-of-ten",
  t("Addition in Scientific Notation With Different Powers of Ten", "10 的指数不同的科学记数法加法"),
  t(
    "To add numbers in scientific notation with different powers of ten, first rewrite one of them so that both have the same power: moving the decimal point one place left raises the exponent by 1. Then add the first factors and keep the common power.",
    "10 的指数不同的科学记数法数相加时，先改写其中一个数，使两者的 10 的指数相同：小数点每向左移动一位，指数就增加 1。然后把前面的因数相加，10 的幂不变。",
  ),
  ["addition-and-subtraction-in-scientific-notation"],
  ["8.EE.A.4"],
  [
    {
      id: "adding-powers-one-apart",
      title: t("Powers one apart", "指数相差 1"),
      explanation: t(
        "$3.2 \\times 10^{5} + 4.1 \\times 10^{4}$: write $4.1 \\times 10^{4} = 0.41 \\times 10^{5}$, moving the decimal point one place left and adding $1$ to the exponent. Then $3.2 \\times 10^{5} + 0.41 \\times 10^{5} = 3.61 \\times 10^{5}$. Adding $3.2 + 4.1$ directly ignores that the second number is ten times smaller.",
        "$3.2 \\times 10^{5} + 4.1 \\times 10^{4}$：写成 $4.1 \\times 10^{4} = 0.41 \\times 10^{5}$，小数点向左移动一位，指数加 $1$。于是 $3.2 \\times 10^{5} + 0.41 \\times 10^{5} = 3.61 \\times 10^{5}$。直接计算 $3.2 + 4.1$ 忽略了第二个数小十倍。",
      ),
      generate(rng) {
        const [x, y] = pair(rng, [1, 1]);
        return differentPowersProblem(x, y, "+");
      },
    },
    {
      id: "adding-powers-further-apart",
      title: t("Powers further apart", "指数相差更多"),
      explanation: t(
        "$6.5 \\times 10^{8} + 2.7 \\times 10^{5}$: the exponents differ by $3$, so move the decimal point $3$ places left: $2.7 \\times 10^{5} = 0.0027 \\times 10^{8}$. The sum is $6.5027 \\times 10^{8}$. The smaller number changes only the later digits.",
        "$6.5 \\times 10^{8} + 2.7 \\times 10^{5}$：指数相差 $3$，所以把小数点向左移动 $3$ 位：$2.7 \\times 10^{5} = 0.0027 \\times 10^{8}$。和为 $6.5027 \\times 10^{8}$。较小的数只改变后面的数位。",
      ),
      generate(rng) {
        const [x, y] = pair(rng, [2, 3]);
        return differentPowersProblem(x, y, "+");
      },
    },
  ],
);

/** subtractionInScientificNotationWithDifferentPowersOfTen subtracts numbers whose powers of ten differ. */
export const subtractionInScientificNotationWithDifferentPowersOfTen = topic(
  "subtraction-in-scientific-notation-with-different-powers-of-ten",
  t("Subtraction in Scientific Notation With Different Powers of Ten", "10 的指数不同的科学记数法减法"),
  t(
    "To subtract numbers in scientific notation with different powers of ten, rewrite the smaller number with the power of the larger one, subtract the first factors, and adjust the result if the first factor falls below $1$.",
    "$10$ 的指数不同的科学记数法数相减时，把较小的数改写成与较大的数相同的 $10$ 的幂，再把前面的因数相减；如果结果前面的因数小于 $1$，就要调整。",
  ),
  ["addition-and-subtraction-in-scientific-notation"],
  ["8.EE.A.4"],
  [
    {
      id: "subtracting-with-different-powers",
      title: t("Matching the powers", "统一 10 的指数"),
      explanation: t(
        "Coefficients can only be subtracted when the powers of ten match. Rewrite the number with the smaller power so it uses the larger power: each step up in the exponent moves its decimal point one place to the left. Then subtract the coefficients.\n\n$5.6 \\times 10^{7} - 3.4 \\times 10^{5}$: write $3.4 \\times 10^{5} = 0.034 \\times 10^{7}$, then subtract: $(5.6 - 0.034) \\times 10^{7} = 5.566 \\times 10^{7}$.",
        "只有 10 的指数相同时才能把系数相减。把指数较小的数改写成用较大的 10 的幂表示：指数每增加 $1$，系数的小数点向左移一位。然后把系数相减。\n\n$5.6 \\times 10^{7} - 3.4 \\times 10^{5}$：写成 $3.4 \\times 10^{5} = 0.034 \\times 10^{7}$，再相减：$(5.6 - 0.034) \\times 10^{7} = 5.566 \\times 10^{7}$。",
      ),
      generate(rng) {
        const [x, y] = pair(rng, [1, 3]);
        if (value(x).sub(value(y)).cmp(scientificValue(Q.one, x.n)) < 0) return this.generate(rng);
        return differentPowersProblem(x, y, "-");
      },
    },
    {
      id: "subtracting-to-a-smaller-power",
      title: t("Results with a smaller power", "结果的指数变小"),
      explanation: t(
        "$1.2 \\times 10^{6} - 4.5 \\times 10^{5} = 1.2 \\times 10^{6} - 0.45 \\times 10^{6} = 0.75 \\times 10^{6}$. The first factor $0.75$ is less than $1$, so move the decimal point one place right and lower the exponent: $7.5 \\times 10^{5}$.",
        "$1.2 \\times 10^{6} - 4.5 \\times 10^{5} = 1.2 \\times 10^{6} - 0.45 \\times 10^{6} = 0.75 \\times 10^{6}$。前面的因数 $0.75$ 小于 $1$，所以把小数点向右移动一位，指数减小 $1$：$7.5 \\times 10^{5}$。",
      ),
      generate(rng) {
        const m = rng.bool(0.25) ? rng.int(-6, -1) : rng.int(3, 11);
        const a = Q.of(rng.int(10, 19), 10);
        const b = Q.of(rng.int(10, 99), 10);
        const x = { a, n: m };
        const y = { a: b, n: m - 1 };
        if (value(x).sub(value(y)).sign() <= 0 || value(x).sub(value(y)).cmp(scientificValue(Q.one, m)) >= 0) {
          return this.generate(rng);
        }
        return differentPowersProblem(x, y, "-");
      },
    },
  ],
);

/** furtherAdditionInScientificNotationWithDifferentPowersOfTen adds with negative exponents and results that move to a larger power. */
export const furtherAdditionInScientificNotationWithDifferentPowersOfTen = topic(
  "further-addition-in-scientific-notation-with-different-powers-of-ten",
  t("Further Addition in Scientific Notation With Different Powers of Ten", "10 的指数不同的科学记数法加法（进阶）"),
  t(
    "The same method works with negative exponents: $10^{-3}$ is ten times $10^{-4}$, so the number with exponent $-3$ is the one with the larger power. When the sum of the first factors reaches $10$ or more, move the decimal point one place left and raise the exponent by $1$.",
    "负整数指数也用同样的方法：$10^{-3}$ 是 $10^{-4}$ 的十倍，所以指数为 $-3$ 的数的 $10$ 的幂较大。前面的因数之和达到 $10$ 或更大时，把小数点向左移动一位，指数加 $1$。",
  ),
  ["addition-in-scientific-notation-with-different-powers-of-ten"],
  ["8.EE.A.4"],
  [
    {
      id: "adding-with-negative-exponents",
      title: t("Negative exponents", "负整数指数"),
      explanation: t(
        "With negative exponents, the larger power of ten is the one whose exponent is closer to zero. Rewrite the other number with that power by moving its decimal point left as many places as the exponents differ, then add the coefficients.\n\n$3.5 \\times 10^{-4} + 2.1 \\times 10^{-6}$: the larger power is $10^{-4}$, and $-4 - (-6) = 2$, so $2.1 \\times 10^{-6} = 0.021 \\times 10^{-4}$. The sum is $3.521 \\times 10^{-4}$.",
        "指数是负数时，较大的 10 的幂是指数更接近零的那个。把另一个数改写成用这个幂表示：两个指数相差几，小数点就向左移几位，然后把系数相加。\n\n$3.5 \\times 10^{-4} + 2.1 \\times 10^{-6}$：较大的幂是 $10^{-4}$，而 $-4 - (-6) = 2$，所以 $2.1 \\times 10^{-6} = 0.021 \\times 10^{-4}$。和为 $3.521 \\times 10^{-4}$。",
      ),
      generate(rng) {
        const m = rng.int(-9, -2);
        const x = { a: mantissa(rng), n: m };
        const y = { a: mantissa(rng), n: m - rng.int(1, 3) };
        return differentPowersProblem(x, y, "+");
      },
    },
    {
      id: "sums-that-reach-the-next-power",
      title: t("Sums that reach the next power", "和进到更高的幂"),
      explanation: t(
        "After adding the coefficients, the sum can be $10$ or more, which is not allowed in scientific notation. Divide the coefficient by $10$ and raise the exponent by $1$; the value stays the same.\n\n$9.6 \\times 10^{5} + 7 \\times 10^{4} = 9.6 \\times 10^{5} + 0.7 \\times 10^{5} = 10.3 \\times 10^{5}$. Since $10.3 \\ge 10$, write it as $1.03 \\times 10^{6}$.",
        "系数相加后，和可能大于或等于 $10$，这在科学记数法中是不允许的。把系数除以 $10$，同时把指数加 $1$，数值保持不变。\n\n$9.6 \\times 10^{5} + 7 \\times 10^{4} = 9.6 \\times 10^{5} + 0.7 \\times 10^{5} = 10.3 \\times 10^{5}$。由于 $10.3 \\ge 10$，写成 $1.03 \\times 10^{6}$。",
      ),
      generate(rng) {
        const m = rng.bool(0.3) ? rng.int(-6, -1) : rng.int(3, 11);
        const x = { a: Q.of(rng.int(85, 99), 10), n: m };
        const y = { a: mantissa(rng), n: m - 1 };
        if (x.a.add(y.a.div(Q.of(10))).cmp(Q.of(10)) < 0) return this.generate(rng);
        return differentPowersProblem(x, y, "+");
      },
    },
  ],
);

/** multiplyingNumbersInScientificNotation multiplies the first factors and adds the exponents. */
export const multiplyingNumbersInScientificNotation = topic(
  "multiplying-numbers-in-scientific-notation",
  t("Multiplying Numbers in Scientific Notation", "科学记数法的乘法"),
  t(
    "To multiply numbers in scientific notation, multiply the first factors and add the exponents: $(a \\times 10^{m})(b \\times 10^{n}) = ab \\times 10^{m + n}$. If ab is $10$ or more, move the decimal point one place left and raise the exponent by $1$.",
    "科学记数法的数相乘时，前面的因数相乘，指数相加：(a × 10ᵐ)(b × $10^{n}$) = ab × 10ᵐ⁺ⁿ。如果 ab 大于或等于 $10$，就把小数点向左移动一位，指数加 $1$。",
  ),
  ["writing-numbers-in-scientific-notation", "the-product-rule-for-exponents"],
  ["8.EE.A.4"],
  [
    {
      id: "multiplying-with-small-products",
      title: t("Products less than 10", "因数之积小于 10"),
      explanation: t(
        "To multiply numbers in scientific notation, multiply the coefficients together and multiply the powers of ten together. When the product of the coefficients is less than $10$, the answer is already in scientific notation.\n\n$(2 \\times 10^{5})(3.1 \\times 10^{-2}) = (2 \\times 3.1) \\times 10^{5 + (-2)} = 6.2 \\times 10^{3}$. The powers of ten follow the product rule, so the exponents are added.",
        "科学记数法表示的数相乘时，系数与系数相乘，10 的幂与 10 的幂相乘。如果系数之积小于 $10$，结果已经是科学记数法。\n\n$(2 \\times 10^{5})(3.1 \\times 10^{-2}) = (2 \\times 3.1) \\times 10^{5 + (-2)} = 6.2 \\times 10^{3}$。10 的幂按同底数幂的乘法计算，所以指数相加。",
      ),
      generate(rng) {
        const a = Q.of(rng.pick([2, 3, 4, 1.5, 2.5, 1.2].map((v) => v * 10)), 10);
        const b = Q.of(rng.int(11, 99), 10);
        const p = a.mul(b);
        if (p.cmp(Q.of(10)) >= 0) return this.generate(rng);
        const [m, n] = [exponent(rng, -8, 12), exponent(rng, -8, 12)];
        return sciProblem(
          t(
            `Find $(${sci(a, m)})(${sci(b, n)})$. Give the answer in scientific notation.`,
            `计算 $(${sci(a, m)})(${sci(b, n)})$，结果用科学记数法表示。`,
          ),
          scientificValue(p, m + n),
          t(
            `Multiply the first factors and add the exponents:${steps(`(${dec(a)} \\times ${dec(b)}) \\times 10^{${m} + ${n < 0 ? `(${n})` : n}} = ${sci(p, m + n)}`)}`,
            `前面的因数相乘，指数相加：${steps(`(${dec(a)} \\times ${dec(b)}) \\times 10^{${m} + ${n < 0 ? `(${n})` : n}} = ${sci(p, m + n)}`)}`,
          ),
          // Multiplying the exponents, and adding the first factors.
          [
            { a: p, n: m * n },
            { a: normalize(a.add(b)).a, n: m + n + normalize(a.add(b)).n },
          ],
        );
      },
    },
    {
      id: "multiplying-with-large-products",
      title: t("Products of 10 or more", "因数之积大于或等于 10"),
      explanation: t(
        "$(6 \\times 10^{4})(8.5 \\times 10^{3}) = 51 \\times 10^{7}$. Since $51 \\ge 10$, write $51 = 5.1 \\times 10^{1}$, so the product is $5.1 \\times 10^{8}$. Forgetting to raise the exponent gives an answer ten times too small.",
        "$(6 \\times 10^{4})(8.5 \\times 10^{3}) = 51 \\times 10^{7}$。由于 $51 \\ge 10$，写成 $51 = 5.1 \\times 10^{1}$，所以积为 $5.1 \\times 10^{8}$。忘记把指数加 $1$ 会使结果小十倍。",
      ),
      generate(rng) {
        const a = Q.of(rng.int(3, 9));
        const b = Q.of(rng.int(25, 99), 10);
        const p = a.mul(b);
        if (p.cmp(Q.of(10)) < 0) return this.generate(rng);
        const [m, n] = [exponent(rng, -8, 12), exponent(rng, -8, 12)];
        const s = normalize(scientificValue(p, m + n));
        return sciProblem(
          t(
            `Find $(${sci(a, m)})(${sci(b, n)})$. Give the answer in scientific notation.`,
            `计算 $(${sci(a, m)})(${sci(b, n)})$，结果用科学记数法表示。`,
          ),
          scientificValue(p, m + n),
          t(
            `Multiply the first factors and add the exponents, then adjust, since $${dec(p)} \\ge 10$:${steps(`(${dec(a)} \\times ${dec(b)}) \\times 10^{${m} + ${n < 0 ? `(${n})` : n}} = ${sci(p, m + n)}${renormalize(p, m + n)}`)}`,
            `前面的因数相乘，指数相加；由于 $${dec(p)} \\ge 10$，还要调整：${steps(`(${dec(a)} \\times ${dec(b)}) \\times 10^{${m} + ${n < 0 ? `(${n})` : n}} = ${sci(p, m + n)}${renormalize(p, m + n)}`)}`,
          ),
          // Not raising the exponent, and multiplying the exponents.
          [
            { a: s.a, n: m + n },
            { a: s.a, n: m * n + 1 },
          ],
        );
      },
    },
  ],
);

/** dividingNumbersInScientificNotation divides the first factors and subtracts the exponents. */
export const dividingNumbersInScientificNotation = topic(
  "dividing-numbers-in-scientific-notation",
  t("Dividing Numbers in Scientific Notation", "科学记数法的除法"),
  t(
    "To divide numbers in scientific notation, divide the first factors and subtract the exponents: (a × 10ᵐ) ÷ (b × 10ⁿ) = (a ÷ b) × 10ᵐ⁻ⁿ. If a ÷ b is less than 1, move the decimal point one place right and lower the exponent by 1.",
    "科学记数法的数相除时，前面的因数相除，指数相减：(a × 10ᵐ) ÷ (b × 10ⁿ) = (a ÷ b) × 10ᵐ⁻ⁿ。如果 a ÷ b 小于 1，就把小数点向右移动一位，指数减 1。",
  ),
  ["multiplying-numbers-in-scientific-notation", "the-quotient-rule-for-exponents"],
  ["8.EE.A.4"],
  [
    {
      id: "dividing-with-quotients-of-at-least-one",
      title: t("Quotients of 1 or more", "因数之商大于或等于 1"),
      explanation: t(
        "To divide numbers in scientific notation, divide the coefficients and divide the powers of ten. When the quotient of the coefficients is at least $1$, the answer is already in scientific notation.\n\n$\\frac{8.4 \\times 10^{9}}{2 \\times 10^{3}} = \\frac{8.4}{2} \\times 10^{9 - 3} = 4.2 \\times 10^{6}$. Subtract the exponent of the divisor from the exponent of the dividend.",
        "科学记数法表示的数相除时，系数与系数相除，10 的幂与 10 的幂相除。如果系数之商大于或等于 $1$，结果已经是科学记数法。\n\n$\\frac{8.4 \\times 10^{9}}{2 \\times 10^{3}} = \\frac{8.4}{2} \\times 10^{9 - 3} = 4.2 \\times 10^{6}$。用被除数的指数减去除数的指数。",
      ),
      generate(rng) {
        const b = Q.of(rng.pick([12, 15, 2, 25, 3, 4].map((v) => (v < 10 ? v * 10 : v))), 10);
        const q = Q.of(rng.int(11, 39), 10);
        const a = b.mul(q);
        if (a.cmp(Q.of(10)) >= 0 || !a.mul(Q.of(100)).isInteger()) return this.generate(rng);
        const [m, n] = [exponent(rng, -6, 12), exponent(rng, -6, 10)];
        return sciProblem(
          t(
            `Find $\\frac{${sci(a, m)}}{${sci(b, n)}}$. Give the answer in scientific notation.`,
            `计算 $\\frac{${sci(a, m)}}{${sci(b, n)}}$，结果用科学记数法表示。`,
          ),
          scientificValue(q, m - n),
          t(
            `Divide the first factors and subtract the exponents:${steps(`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${sci(q, m - n)}`)}`,
            `前面的因数相除，指数相减：${steps(`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${sci(q, m - n)}`)}`,
          ),
          // Subtracting the exponents the other way, and adding them.
          [
            { a: q, n: n - m },
            { a: q, n: m + n },
          ],
        );
      },
    },
    {
      id: "dividing-with-quotients-less-than-one",
      title: t("Quotients less than 1", "因数之商小于 1"),
      explanation: t(
        "When the quotient of the coefficients is less than $1$, it is not yet scientific notation. Multiply the coefficient by $10$ and lower the exponent by $1$ to keep the same value.\n\n$\\frac{2.4 \\times 10^{5}}{6 \\times 10^{2}} = 0.4 \\times 10^{3}$. Since $0.4 < 1$, write $0.4 = 4 \\times 10^{-1}$, so the quotient is $4 \\times 10^{2}$.",
        "如果系数之商小于 $1$，结果还不是科学记数法。把系数乘以 $10$，同时把指数减 $1$，数值保持不变。\n\n$\\frac{2.4 \\times 10^{5}}{6 \\times 10^{2}} = 0.4 \\times 10^{3}$。由于 $0.4 < 1$，写成 $0.4 = 4 \\times 10^{-1}$，所以商为 $4 \\times 10^{2}$。",
      ),
      generate(rng) {
        const b = Q.of(rng.int(4, 9));
        const q = Q.of(rng.int(2, 9), 10).add(rng.bool(0.4) ? Q.of(rng.int(1, 9), 100) : Q.zero);
        const a = b.mul(q);
        if (a.cmp(Q.one) < 0 || q.cmp(Q.one) >= 0) return this.generate(rng);
        const [m, n] = [exponent(rng, -6, 12), exponent(rng, -6, 10)];
        const s = normalize(scientificValue(q, m - n));
        return sciProblem(
          t(
            `Find $\\frac{${sci(a, m)}}{${sci(b, n)}}$. Give the answer in scientific notation.`,
            `计算 $\\frac{${sci(a, m)}}{${sci(b, n)}}$，结果用科学记数法表示。`,
          ),
          scientificValue(q, m - n),
          t(
            `Divide the first factors and subtract the exponents, then adjust, since $${dec(q)} < 1$:${steps(`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${sci(q, m - n)}${renormalize(q, m - n)}`)}`,
            `前面的因数相除，指数相减；由于 $${dec(q)} < 1$，还要调整：${steps(`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${n < 0 ? `(${n})` : n}} = ${sci(q, m - n)}${renormalize(q, m - n)}`)}`,
          ),
          // Not lowering the exponent, and subtracting the exponents the other way.
          [
            { a: s.a, n: m - n },
            { a: s.a, n: n - m - 1 },
          ],
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Real-world quantities

/** Quantity is a real-world quantity for estimation: [English, Chinese, unit in English, unit in Chinese, lowest and highest exponent]. */
type Quantity = readonly [string, string, string, string, number, number];

/** quantities are quantities whose sizes vary from case to case, so that no particular value is claimed as a fact. */
const quantities: readonly Quantity[] = [
  ["the population of a city", "一座城市的人口", "people", "人", 5, 7],
  ["the number of visitors to a website in a year", "一个网站一年的访问人次", "visits", "人次", 6, 9],
  ["the area of a farm", "一个农场的面积", "square meters", "平方米", 5, 7],
  ["the amount of water in a reservoir", "一个水库的蓄水量", "liters", "升", 8, 11],
  ["the length of a bacterium", "一个细菌的长度", "meters", "米", -7, -6],
  ["the thickness of a sheet of plastic film", "一张塑料薄膜的厚度", "meters", "米", -5, -4],
  ["the mass of a grain of sand", "一粒沙子的质量", "grams", "克", -4, -3],
  ["the width of a strand of spider silk", "一根蛛丝的直径", "meters", "米", -6, -5],
];

/** Comparison is a pair of related quantities: a sentence stating the two sizes, the exponents of the larger one and the gap. */
type Comparison = readonly [(x: string, y: string) => Text, readonly [number, number], readonly [number, number]];

/** comparisons are pairs of quantities of the same kind with typical sizes. */
const comparisons: readonly Comparison[] = [
  [
    (x, y) =>
      t(
        `A country has about $${x}$ people, and a town in it has about $${y}$ people. About how many times as many people does the country have as the town?`,
        `一个国家大约有 $${x}$ 人，其中一个小镇大约有 $${y}$ 人。这个国家的人口大约是这个小镇的多少倍？`,
      ),
    [7, 8],
    [3, 5],
  ],
  [
    (x, y) =>
      t(
        `A loaded cargo ship has a mass of about $${x}$ kilograms, and a car about $${y}$ kilograms. About how many times the mass of the car is the mass of the ship?`,
        `一艘满载的货轮的质量大约是 $${x}$ 千克，一辆汽车大约是 $${y}$ 千克。货轮的质量大约是汽车的多少倍？`,
      ),
    [7, 7],
    [4, 4],
  ],
  [
    (x, y) =>
      t(
        `A human hair is about $${x}$ meters wide, and a virus about $${y}$ meters. About how many times the width of the virus is the width of the hair?`,
        `一根头发的直径大约是 $${x}$ 米，一个病毒的直径大约是 $${y}$ 米。头发的直径大约是病毒的多少倍？`,
      ),
    [-5, -5],
    [2, 3],
  ],
  [
    (x, y) =>
      t(
        `A large lake holds about $${x}$ liters of water, and a swimming pool about $${y}$ liters. About how many times the water in the pool is the water in the lake?`,
        `一个大湖大约有 $${x}$ 升水，一个游泳池大约有 $${y}$ 升水。大湖的水量大约是游泳池的多少倍？`,
      ),
    [11, 13],
    [5, 7],
  ],
];

/** estimatingAndComparingRealWorldQuantitiesUsingScientificNotation estimates quantities as one digit times a power of ten and compares them. */
export const estimatingAndComparingRealWorldQuantitiesUsingScientificNotation = topic(
  "estimating-and-comparing-real-world-quantities-using-scientific-notation",
  t("Estimating and Comparing Real-World Quantities Using Scientific Notation", "用科学记数法估计和比较实际量"),
  t(
    "Very large and very small quantities can be estimated as a single digit times a power of ten: round the first factor of the scientific notation to the nearest whole number. Two estimates are compared by dividing them, which tells how many times as large one is as the other.",
    "很大或很小的量可以估计成一个一位数乘以 10 的幂：把科学记数法前面的因数四舍五入到整数。比较两个估计值时用除法，就能知道一个是另一个的多少倍。",
  ),
  ["comparing-numbers-in-scientific-notation", "dividing-numbers-in-scientific-notation"],
  ["8.EE.A.3", "8.EE.A.4"],
  [
    {
      id: "estimating-a-quantity",
      title: t("Estimating a quantity", "估计一个量"),
      explanation: t(
        "A city has $3{,}847{,}000$ people, which is $3.847 \\times 10^{6}$. Rounding the first factor to the nearest whole number gives about $4 \\times 10^{6}$ people. If the first factor rounds up to $10$, as $9.6$ does, the estimate becomes $1 \\times 10^{7}$.",
        "一座城市有 $3{,}847{,}000$ 人，即 $3.847 \\times 10^{6}$。把前面的因数四舍五入到整数，大约是 $4 \\times 10^{6}$ 人。如果前面的因数像 $9.6$ 一样入成 $10$，估计值就变成 $1 \\times 10^{7}$。",
      ),
      generate(rng) {
        const [en, zh, unit, unitZh, lo, hi] = rng.pick(quantities);
        const a = Q.of(rng.int(1001, 9899), 1000);
        const n = rng.int(lo, hi);
        const v = scientificValue(a, n);
        const r = Math.round(Number(a.n) / Number(a.d));
        const est = r === 10 ? { a: Q.one, n: n + 1 } : { a: Q.of(r), n };
        return sciProblem(
          t(
            `${en[0]!.toUpperCase()}${en.slice(1)} is $${standard(v)}$ ${unit}. Estimate it as a single digit times a power of ten.`,
            `${zh}是 $${standard(v)}$ ${unitZh}。把它估计成一个一位数乘以 10 的幂。`,
          ),
          value(est),
          t(
            `In scientific notation the quantity is $${sci(a, n)}$. Round $${dec(a)}$ to the nearest whole number:${steps(`${sci(a, n)} \\approx ${show(est)}`)}`,
            `用科学记数法表示，这个量是 $${sci(a, n)}$。把 $${dec(a)}$ 四舍五入到整数：${steps(`${sci(a, n)} \\approx ${show(est)}`)}`,
          ),
          // Truncating instead of rounding, and the wrong count of places.
          [
            { a: Q.of(Math.floor(Number(a.n) / Number(a.d))), n },
            { a: est.a, n: est.n + 1 },
            { a: est.a, n: est.n - 1 },
          ],
        );
      },
    },
    {
      id: "comparing-estimates",
      title: t("Comparing estimates", "比较估计值"),
      explanation: t(
        "A country has about $3 \\times 10^{8}$ people and a town in it about $6 \\times 10^{4}$. Then $\\frac{3 \\times 10^{8}}{6 \\times 10^{4}} = 0.5 \\times 10^{4} = 5 \\times 10^{3}$, so the country has about $5{,}000$ times as many people. Divide the larger by the smaller.",
        "一个国家大约有 $3 \\times 10^{8}$ 人，其中一个小镇大约有 $6 \\times 10^{4}$ 人。$\\frac{3 \\times 10^{8}}{6 \\times 10^{4}} = 0.5 \\times 10^{4} = 5 \\times 10^{3}$，所以这个国家的人口大约是小镇的 $5{,}000$ 倍。用较大的数除以较小的数。",
      ),
      generate(rng) {
        const [sentence, [lo, hi], [g1, g2]] = rng.pick(comparisons);
        const [p, q] = rng.pick([
          [6, 2],
          [8, 2],
          [9, 3],
          [8, 4],
          [3, 6],
          [2, 4],
          [4, 8],
          [1, 2],
          [6, 3],
          [9, 2],
        ] as const);
        const m = rng.int(lo, hi);
        const n = m - rng.int(g1, g2);
        const ratio = Q.of(p, q).mul(scientificValue(Q.one, m - n));
        return numberProblem({
          prompt: sentence(sci(p, m), sci(q, n)),
          answer: ratio,
          form: "decimal",
          // Dividing the other way, subtracting the exponents only, and the ratio of the first factors alone.
          wrong: [Q.one.div(ratio), scientificValue(Q.one, m - n), Q.of(p, q)],
          solution: t(
            `Divide the larger quantity by the smaller one:${steps(`\\frac{${sci(p, m)}}{${sci(q, n)}} = ${dec(Q.of(p, q))} \\times 10^{${m - n}}${renormalize(Q.of(p, q), m - n)} = ${standard(ratio)}`)}`,
            `用较大的量除以较小的量：${steps(`\\frac{${sci(p, m)}}{${sci(q, n)}} = ${dec(Q.of(p, q))} \\times 10^{${m - n}}${renormalize(Q.of(p, q), m - n)} = ${standard(ratio)}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade8ScientificNotationTopics lists the 8th grade topics on scientific notation. */
export const grade8ScientificNotationTopics: readonly TopicDef[] = [
  writingNumbersInScientificNotation,
  convertingScientificNotationToStandardNotation,
  comparingNumbersInScientificNotation,
  additionAndSubtractionInScientificNotation,
  additionInScientificNotationWithDifferentPowersOfTen,
  subtractionInScientificNotationWithDifferentPowersOfTen,
  furtherAdditionInScientificNotationWithDifferentPowersOfTen,
  multiplyingNumbersInScientificNotation,
  dividingNumbersInScientificNotation,
  estimatingAndComparingRealWorldQuantitiesUsingScientificNotation,
];
