import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q, sci } from "@ga/subject-math";

import { numberProblem, scientificProblem, scientificValue, steps } from "../problems.ts";
import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { mantissa, normalize, standard } from "./exponents.ts";
import { compareProblem } from "./grade-4-fractions.ts";
import { lesson, valued, withIntro } from "./grade-6-kit.ts";
import { scienced } from "./grade-8-kit.ts";
import { lineFigure, type Tape, tapeFigure } from "./upper-grades-kit.ts";

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

/** signed writes an integer for use after an operator: "(-3)" or "3". */
const signed = (n: number) => (n < 0 ? `(${n})` : String(n));

/** timesTen draws a bar of a first factor followed by shaded pieces, one for each factor of ten, with the value over it. */
function timesTen(first: string, size: number, count: number, each: string, total: string): Tape {
  return { total, pieces: [{ size, text: first }, ...Array.from({ length: count }, () => ({ size: 1, text: each, lit: true }))] };
}

/** placed writes v in scientific notation in two labelled steps: place the point, then count the places. */
function placed(v: Q, s: Sci): readonly [Walk[], Pair] {
  const k = Math.abs(s.n);
  const way = s.n > 0 ? (["left", "左"] as const) : (["right", "右"] as const);
  const back = s.n > 0 ? (["right", "右"] as const) : (["left", "左"] as const);
  return [
    [
      [
        ["Place the point", "点小数点"],
        [`Put the point after the first nonzero digit: $${dec(s.a)}$.`, `把小数点放在第一个非零数字后面：$${dec(s.a)}$。`],
      ],
      [
        ["Count the places", "数位数"],
        [
          `The point moved $${k}$ ${k === 1 ? "place" : "places"} to the ${way[0]}, so the exponent is $${s.n}$:`,
          `小数点向${way[1]}移动了 $${k}$ 位，所以指数是 $${s.n}$：`,
        ],
        [`${standard(v)} = ${show(s)}`],
      ],
    ],
    [
      `Move the point back $${k}$ ${k === 1 ? "place" : "places"} to the ${back[0]}, and you get $${standard(v)}$ again.`,
      `把小数点向${back[1]}移回 $${k}$ 位，又得到 $${standard(v)}$。`,
    ],
  ];
}

/** writingNumbersInScientificNotation writes large and small numbers as a × 10^n. */
export const writingNumbersInScientificNotation = withIntro(
  topic(
    "writing-numbers-in-scientific-notation",
    t("Writing Numbers in Scientific Notation", "用科学记数法表示数"),
    t(
      "A number is in scientific notation when it is written a × 10ⁿ with 1 ≤ a < 10 and n an integer. Move the decimal point until exactly one nonzero digit is in front of it; n is the number of places moved, positive for a number of 10 or more and negative for a number less than 1.",
      "把数写成 a × 10ⁿ 的形式，其中 1 ≤ a < 10，n 为整数，就是科学记数法。移动小数点，使它前面恰好有一个非零数字；n 是移动的位数，数大于或等于 10 时为正，小于 1 时为负。",
    ),
    ["negative-exponents"],
    ["8.EE.A.3"],
    [
      lesson(
        "writing-large-numbers",
        ["Large numbers", "大数"],
        [
          [
            "For $45{,}000$, move the decimal point $4$ places to the left to get $4.5$. That number is between $1$ and $10$. Moving left divided by $10^{4}$, so multiply back: $45{,}000 = 4.5 \\times 10^{4}$.",
            "对于 $45{,}000$，把小数点向左移动 $4$ 位，得到 $4.5$。这个数在 $1$ 和 $10$ 之间。向左移动相当于除以 $10^{4}$，所以要乘回来：$45{,}000 = 4.5 \\times 10^{4}$。",
          ],
          ["$4.5 \\times 10{,}000 = 45{,}000$.", "$4.5 \\times 10{,}000 = 45{,}000$。"],
          [
            "The first factor must be less than $10$. $45 \\times 10^{3}$ has the right value, but it is not scientific notation.",
            "前面的因数必须小于 $10$。$45 \\times 10^{3}$ 的值虽然对，但不是科学记数法。",
          ],
        ],
        (rng) => {
          const s = draw(rng, 3, 10);
          const v = value(s);
          const [walk, check] = placed(v, s);
          return scienced(
            [`Write $${standard(v)}$ in scientific notation.`, `用科学记数法表示 $${standard(v)}$。`],
            s.a,
            s.n,
            walk,
            check,
            [
              [s.a, s.n + 1, "That counts the digits, not the places the point moves.", "这是数了数字的个数，而不是小数点移动的位数。"],
              [s.a, s.n - 1, "That counts one place too few.", "这是少数了一位。"],
              [
                s.a,
                -s.n,
                "That has the wrong sign; a number of $10$ or more has a positive exponent.",
                "这是符号错了；大于或等于 $10$ 的数指数是正的。",
              ],
            ],
          );
        },
        tapeFigure(
          [timesTen("4.5", 2, 4, "×10", "45 000")],
          [
            "A bar: 4.5 followed by four shaded pieces ×10, with 45 000 over the whole bar.",
            "一个长条：4.5 后面跟着四段涂色的 ×10，整个长条上方标着 45 000。",
          ],
        ),
      ),
      lesson(
        "writing-small-numbers",
        ["Small numbers", "小数"],
        [
          [
            "For $0.00032$, move the decimal point $4$ places to the right, past the first nonzero digit, to get $3.2$. Moving right multiplied by $10^{4}$. To undo it, multiply by $10^{-4}$: $0.00032 = 3.2 \\times 10^{-4}$.",
            "对于 $0.00032$，把小数点向右移过第一个非零数字，共移动 $4$ 位，得到 $3.2$。向右移动相当于乘以 $10^{4}$。要还原，就乘以 $10^{-4}$：$0.00032 = 3.2 \\times 10^{-4}$。",
          ],
          [
            "Divide by $10$ four times: $3.2 \\div 10 \\div 10 \\div 10 \\div 10 = 0.00032$.",
            "除以四次 $10$：$3.2 \\div 10 \\div 10 \\div 10 \\div 10 = 0.00032$。",
          ],
          [
            "Count the places the point moves, not the zeros. $0.00032$ has $3$ zeros after the point, but the point moves $4$ places.",
            "要数小数点移动的位数，而不是 $0$ 的个数。$0.00032$ 的小数点后面有 $3$ 个 $0$，但小数点移动了 $4$ 位。",
          ],
        ],
        (rng) => {
          const s = draw(rng, -8, -2);
          const v = value(s);
          const [walk, check] = placed(v, s);
          return scienced(
            [`Write $${standard(v)}$ in scientific notation.`, `用科学记数法表示 $${standard(v)}$。`],
            s.a,
            s.n,
            walk,
            check,
            [
              [
                s.a,
                -s.n,
                "That has the wrong sign; a number less than $1$ has a negative exponent.",
                "这是符号错了；小于 $1$ 的数指数是负的。",
              ],
              [
                s.a,
                s.n + 1,
                "That counts only the zeros after the point; the point moves one place more.",
                "这是只数了小数点后面的 $0$；小数点还要多移一位。",
              ],
              [s.a, s.n - 1, "That counts one place too many.", "这是多数了一位。"],
            ],
          );
        },
        tapeFigure(
          [timesTen("3.2", 2, 4, "÷10", "0.00032")],
          [
            "A bar: 3.2 followed by four shaded pieces ÷10, with 0.00032 over the whole bar.",
            "一个长条：3.2 后面跟着四段涂色的 ÷10，整个长条上方标着 0.00032。",
          ],
        ),
      ),
      lesson(
        "fixing-a-coefficient-outside-the-range",
        ["Fixing a coefficient outside the range", "调整超出范围的系数"],
        [
          [
            "$34 \\times 10^{5}$ is not in scientific notation, because $34$ is $10$ or more. Write $34$ as $3.4 \\times 10$. Then $34 \\times 10^{5} = 3.4 \\times 10^{6}$. When the first factor gets smaller, the exponent gets larger by the number of places the point moves.",
            "$34 \\times 10^{5}$ 不是科学记数法，因为 $34$ 不小于 $10$。把 $34$ 写成 $3.4 \\times 10$，于是 $34 \\times 10^{5} = 3.4 \\times 10^{6}$。前面的因数变小，指数就变大，变大的数等于小数点移动的位数。",
          ],
          [
            "Both are $3{,}400{,}000$: $34 \\times 100{,}000$ and $3.4 \\times 1{,}000{,}000$.",
            "两个都是 $3{,}400{,}000$：$34 \\times 100{,}000$ 和 $3.4 \\times 1{,}000{,}000$。",
          ],
          [
            "The exponent moves the other way from the first factor. $34 \\times 10^{5}$ is $3.4 \\times 10^{6}$, not $3.4 \\times 10^{4}$.",
            "指数和前面的因数朝相反方向变。$34 \\times 10^{5}$ 是 $3.4 \\times 10^{6}$，不是 $3.4 \\times 10^{4}$。",
          ],
        ],
        (rng) => {
          const digits = rng.pick([...Array(89).keys()].map((i) => i + 11).filter((v) => v % 10 !== 0));
          const shift = rng.pick([-3, -2, -1, 1, 2, 3]);
          const exponent = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
          const proper = Q.of(digits, 10);
          const shown = shift > 0 ? proper.mul(Q.of(10 ** shift)) : proper.div(Q.of(10 ** -shift));
          const answer = exponent + shift;
          const k = Math.abs(shift);
          const unit = k === 1 ? "place" : "places";
          return valued(
            [
              `Write $${dec(shown)} \\times 10^{${exponent}}$ in scientific notation as $a \\times 10^{k}$. What is $k$?`,
              `把 $${dec(shown)} \\times 10^{${exponent}}$ 写成科学记数法 $a \\times 10^{k}$。$k$ 是多少？`,
            ],
            answer,
            [
              [
                ["Fix the first factor", "调整前面的因数"],
                [
                  `It must become $${dec(proper)}$, so the point moves $${k}$ ${unit} to the ${shift > 0 ? "left" : "right"}.`,
                  `它要变成 $${dec(proper)}$，所以小数点向${shift > 0 ? "左" : "右"}移动 $${k}$ 位。`,
                ],
              ],
              [
                ["Change the exponent", "调整指数"],
                [
                  `To keep the value, the exponent ${shift > 0 ? "rises" : "falls"} by $${k}$:`,
                  `为了保持数值不变，指数${shift > 0 ? "增加" : "减少"} $${k}$：`,
                ],
                [`k = ${exponent} ${shift > 0 ? "+" : "-"} ${k} = ${answer}`],
              ],
            ],
            [
              `Write the first factor with a power of ten: $${dec(shown)} = ${dec(proper)} \\times 10^{${shift}}$, and $${exponent} + ${signed(shift)} = ${answer}$.`,
              `把前面的因数写成带 $10$ 的幂的形式：$${dec(shown)} = ${dec(proper)} \\times 10^{${shift}}$，而 $${exponent} + ${signed(shift)} = ${answer}$。`,
            ],
            [
              [
                exponent - shift,
                "That moves the exponent the same way as the first factor; it moves the other way.",
                "这是让指数和前面的因数朝同一方向变；它们应当相反。",
              ],
              [exponent, "That fixes the first factor but leaves the exponent as it was.", "这是调整了前面的因数，却没有改指数。"],
              [answer + 1, "That changes the exponent by one place too many.", "这是指数多变了 $1$。"],
              [answer - 1, "That changes the exponent by one place too few.", "这是指数少变了 $1$。"],
            ],
            { solveFor: "k" },
          );
        },
        tapeFigure(
          [timesTen("34", 3, 5, "×10", "3 400 000"), timesTen("3.4", 2, 6, "×10", "3 400 000")],
          [
            "Two bars of the same length, both 3 400 000: one is 34 followed by five pieces ×10, the other is 3.4 followed by six pieces ×10.",
            "两个一样长的长条，都是 3 400 000：一个是 34 后面跟着五段 ×10，另一个是 3.4 后面跟着六段 ×10。",
          ],
        ),
      ),
    ],
  ),
  [
    "A store sells $45{,}000$ pencils a year. A grain of sand is about $0.00032$ m wide. Both numbers are easier to read as a short number times a power of ten.",
    "一家商店一年卖出 $45{,}000$ 支铅笔。一粒沙子大约宽 $0.00032$ 米。把它们写成一个简短的数乘 $10$ 的幂，读起来就容易多了。",
  ],
  ["$45{,}000 = 4.5 \\times 10{,}000$, and $10{,}000 = 10^{4}$.", "$45{,}000 = 4.5 \\times 10{,}000$，而 $10{,}000 = 10^{4}$。"],
  [
    "write large and small numbers in scientific notation, and fix a first factor that is too big or too small.",
    "用科学记数法表示大数和小数，并调整过大或过小的前面因数。",
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
export const dividingNumbersInScientificNotation = withIntro(
  topic(
    "dividing-numbers-in-scientific-notation",
    t("Dividing Numbers in Scientific Notation", "科学记数法的除法"),
    t(
      "To divide numbers in scientific notation, divide the first factors and subtract the exponents: (a × 10ᵐ) ÷ (b × 10ⁿ) = (a ÷ b) × 10ᵐ⁻ⁿ. If a ÷ b is less than 1, move the decimal point one place right and lower the exponent by 1.",
      "科学记数法的数相除时，前面的因数相除，指数相减：(a × 10ᵐ) ÷ (b × 10ⁿ) = (a ÷ b) × 10ᵐ⁻ⁿ。如果 a ÷ b 小于 1，就把小数点向右移动一位，指数减 1。",
    ),
    ["multiplying-numbers-in-scientific-notation", "the-quotient-rule-for-exponents"],
    ["8.EE.A.4"],
    [
      lesson(
        "dividing-with-quotients-of-at-least-one",
        ["Quotients of 1 or more", "因数之商大于或等于 1"],
        [
          [
            "Divide the first factors. Divide the powers of ten by subtracting the exponents. When the first quotient is $1$ or more, the answer is already in scientific notation: $\\frac{8.4 \\times 10^{9}}{2 \\times 10^{3}} = \\frac{8.4}{2} \\times 10^{9 - 3} = 4.2 \\times 10^{6}$.",
            "前面的因数相除，$10$ 的幂相除时指数相减。如果前面因数的商大于或等于 $1$，结果已经是科学记数法：$\\frac{8.4 \\times 10^{9}}{2 \\times 10^{3}} = \\frac{8.4}{2} \\times 10^{9 - 3} = 4.2 \\times 10^{6}$。",
          ],
          ["Multiply back: $4.2 \\times 2 = 8.4$, and $6 + 3 = 9$.", "乘回去验证：$4.2 \\times 2 = 8.4$，$6 + 3 = 9$。"],
          [
            "Take the divisor's exponent from the dividend's, not the other way round. Here it is $9 - 3 = 6$, not $3 - 9 = -6$.",
            "用被除数的指数减去除数的指数，不能反过来。这里是 $9 - 3 = 6$，不是 $3 - 9 = -6$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const b = Q.of(rng.pick([12, 15, 20, 25, 30, 40]), 10);
            const q = Q.of(rng.int(11, 39), 10);
            const a = b.mul(q);
            if (a.cmp(Q.of(10)) >= 0 || !a.mul(Q.of(100)).isInteger()) continue;
            const [m, n] = [exponent(rng, -6, 12), exponent(rng, -6, 10)];
            return scienced(
              [
                `Find $\\frac{${sci(a, m)}}{${sci(b, n)}}$. Give the answer in scientific notation.`,
                `计算 $\\frac{${sci(a, m)}}{${sci(b, n)}}$，结果用科学记数法表示。`,
              ],
              q,
              m - n,
              [
                [
                  ["Divide the first factors", "前面的因数相除"],
                  [`$${dec(a)} \\div ${dec(b)} = ${dec(q)}$.`, `$${dec(a)} \\div ${dec(b)} = ${dec(q)}$。`],
                ],
                [
                  ["Subtract the exponents", "指数相减"],
                  ["Take the exponent of the divisor from that of the dividend:", "用被除数的指数减去除数的指数："],
                  [`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${signed(n)}} = ${sci(q, m - n)}`],
                ],
              ],
              [
                `Multiply back: $${dec(q)} \\times ${dec(b)} = ${dec(a)}$, and $${m - n} + ${signed(n)} = ${m}$.`,
                `乘回去验证：$${dec(q)} \\times ${dec(b)} = ${dec(a)}$，$${m - n} + ${signed(n)} = ${m}$。`,
              ],
              [
                [q, n - m, "That subtracts the exponents the wrong way round.", "这是把指数减反了。"],
                [q, m + n, "That adds the exponents; dividing subtracts them.", "这是把指数相加了；相除时指数相减。"],
              ],
            );
          }
        },
        lineFigure(
          {
            lo: 0,
            hi: 9,
            step: 1,
            labels: [0, 3, 6, 9],
            marks: [
              { at: 9, text: "10⁹" },
              { at: 6, text: "10⁶", result: true },
            ],
            jumps: [[9, 6]],
          },
          [
            "A number line of exponents from 0 to 9: a jump back 3 places from 10⁹ lands on 10⁶.",
            "一条从 0 到 9 的指数数轴：从 10⁹ 向回跳 3 格，落在 10⁶。",
          ],
        ),
      ),
      lesson(
        "dividing-with-quotients-less-than-one",
        ["Quotients less than 1", "因数之商小于 1"],
        [
          [
            "When the first quotient is less than $1$, the answer is not yet in scientific notation. Multiply the first factor by $10$ and lower the exponent by $1$, so the value stays the same: $\\frac{2.4 \\times 10^{5}}{6 \\times 10^{2}} = 0.4 \\times 10^{3} = 4 \\times 10^{2}$.",
            "如果前面因数的商小于 $1$，结果还不是科学记数法。把前面的因数乘以 $10$，同时把指数减 $1$，数值不变：$\\frac{2.4 \\times 10^{5}}{6 \\times 10^{2}} = 0.4 \\times 10^{3} = 4 \\times 10^{2}$。",
          ],
          ["Both are $400$: $0.4 \\times 1000$ and $4 \\times 100$.", "两个都是 $400$：$0.4 \\times 1000$ 和 $4 \\times 100$。"],
          [
            "Lower the exponent when the first factor grows. $0.4 \\times 10^{3}$ is $4 \\times 10^{2}$, not $4 \\times 10^{4}$.",
            "前面的因数变大时，指数要减小。$0.4 \\times 10^{3}$ 是 $4 \\times 10^{2}$，不是 $4 \\times 10^{4}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const b = Q.of(rng.int(4, 9));
            const q = Q.of(rng.int(2, 9), 10).add(rng.bool(0.4) ? Q.of(rng.int(1, 9), 100) : Q.zero);
            const a = b.mul(q);
            if (a.cmp(Q.one) < 0 || q.cmp(Q.one) >= 0) continue;
            const [m, n] = [exponent(rng, -6, 12), exponent(rng, -6, 10)];
            const s = normalize(scientificValue(q, m - n));
            return scienced(
              [
                `Find $\\frac{${sci(a, m)}}{${sci(b, n)}}$. Give the answer in scientific notation.`,
                `计算 $\\frac{${sci(a, m)}}{${sci(b, n)}}$，结果用科学记数法表示。`,
              ],
              s.a,
              s.n,
              [
                [
                  ["Divide the first factors", "前面的因数相除"],
                  [`$${dec(a)} \\div ${dec(b)} = ${dec(q)}$.`, `$${dec(a)} \\div ${dec(b)} = ${dec(q)}$。`],
                ],
                [
                  ["Subtract the exponents", "指数相减"],
                  ["Take the exponent of the divisor from that of the dividend:", "用被除数的指数减去除数的指数："],
                  [`\\frac{${dec(a)}}{${dec(b)}} \\times 10^{${m} - ${signed(n)}} = ${sci(q, m - n)}`],
                ],
                [
                  ["Fix the first factor", "调整前面的因数"],
                  [
                    `It is less than $1$, so move the point one place right and lower the exponent by $1$:`,
                    `它小于 $1$，所以把小数点向右移一位，指数减 $1$：`,
                  ],
                  [`${sci(q, m - n)} = ${sci(s.a, s.n)}`],
                ],
              ],
              [
                `The first factor grew ten times and the power of ten shrank ten times: $${dec(q)} \\times 10 = ${dec(s.a)}$, and $${m - n} - 1 = ${s.n}$.`,
                `前面的因数扩大十倍，$10$ 的幂缩小十倍：$${dec(q)} \\times 10 = ${dec(s.a)}$，$${m - n} - 1 = ${s.n}$。`,
              ],
              [
                [
                  s.a,
                  m - n,
                  "That moves the point but keeps the exponent; lower it by $1$.",
                  "这是移了小数点，却没有改指数；指数要减 $1$。",
                ],
                [
                  s.a,
                  m - n + 1,
                  "That raises the exponent; it goes down when the first factor grows.",
                  "这是把指数加大了；前面的因数变大时，指数要减小。",
                ],
                [s.a, n - m - 1, "That subtracts the exponents the wrong way round.", "这是把指数减反了。"],
              ],
            );
          }
        },
        tapeFigure(
          [timesTen("0.4", 1, 3, "×10", "400"), timesTen("4", 2, 2, "×10", "400")],
          [
            "Two bars of the same length, both 400: one is 0.4 followed by three pieces ×10, the other is 4 followed by two pieces ×10.",
            "两个一样长的长条，都是 400：一个是 0.4 后面跟着三段 ×10，另一个是 4 后面跟着两段 ×10。",
          ],
        ),
      ),
      lesson(
        "a-travel-time-in-scientific-notation",
        ["A travel time in scientific notation", "用科学记数法算行程时间"],
        [
          [
            "Time is distance divided by speed. Distances in space are huge, so both are often written in scientific notation. Divide the first factors and subtract the exponents, then write the power of ten out: $\\frac{6 \\times 10^{8}}{3 \\times 10^{5}} = 2 \\times 10^{3} = 2000$.",
            "时间等于路程除以速度。太空中的距离非常大，所以两者常用科学记数法表示。前面的因数相除，指数相减，再把 $10$ 的幂写出来：$\\frac{6 \\times 10^{8}}{3 \\times 10^{5}} = 2 \\times 10^{3} = 2000$。",
          ],
          [
            "Multiply back: $2000$ hours at $3 \\times 10^{5}$ km per hour is $6 \\times 10^{8}$ km.",
            "乘回去验证：以每小时 $3 \\times 10^{5}$ 千米的速度飞 $2000$ 小时，正好是 $6 \\times 10^{8}$ 千米。",
          ],
          [
            "Subtract the exponent of the speed, do not add it. Adding gives $2 \\times 10^{13}$ hours, which is far too long.",
            "要减去速度的指数，不能加上。相加会得到 $2 \\times 10^{13}$ 小时，这太长了。",
          ],
        ],
        (rng) => {
          const [speedTenths, ratio] = rng.pick<[number, number]>([
            [12, 2],
            [12, 3],
            [12, 4],
            [12, 5],
            [15, 2],
            [15, 3],
            [15, 4],
            [15, 6],
            [20, 2],
            [20, 3],
            [20, 4],
            [25, 2],
            [25, 3],
            [30, 2],
            [30, 3],
            [40, 2],
          ]);
          const q = rng.int(3, 8);
          const gap = rng.int(1, 5);
          const p = q + gap;
          const distance = Q.of(speedTenths * ratio, 10);
          const speed = Q.of(speedTenths, 10);
          const answer = ratio * 10 ** gap;
          const powerLatex = gap === 1 ? "10" : `10^{${gap}}`;
          return valued(
            [
              `A probe travels $${dec(distance)} \\times 10^{${p}}$ km at a steady $${dec(speed)} \\times 10^{${q}}$ km per hour. How many hours does the trip take?`,
              `一个探测器以每小时 $${dec(speed)} \\times 10^{${q}}$ 千米的速度匀速飞行 $${dec(distance)} \\times 10^{${p}}$ 千米。这段旅程要多少小时？`,
            ],
            answer,
            [
              [
                ["Set up the division", "列出除法"],
                ["Time is distance divided by speed:", "时间等于路程除以速度："],
                [`\\frac{${dec(distance)} \\times 10^{${p}}}{${dec(speed)} \\times 10^{${q}}}`],
              ],
              [
                ["Divide", "相除"],
                [
                  `The first factors give $${ratio}$, and the exponents give $${p} - ${q} = ${gap}$:`,
                  `前面的因数相除得 $${ratio}$，指数相减得 $${p} - ${q} = ${gap}$：`,
                ],
                [`${ratio} \\times ${powerLatex} = ${answer}`],
              ],
            ],
            [
              `Multiply back: $${answer} \\times ${dec(speed)} \\times 10^{${q}} = ${dec(distance)} \\times 10^{${p}}$.`,
              `乘回去验证：$${answer} \\times ${dec(speed)} \\times 10^{${q}} = ${dec(distance)} \\times 10^{${p}}$。`,
            ],
            [
              [ratio * 10 ** (gap + 1), "That writes one zero too many.", "这是多写了一个 $0$。"],
              [ratio * 10 ** (gap - 1), "That writes one zero too few.", "这是少写了一个 $0$。"],
              [(ratio + 1) * 10 ** gap, "That divides the first factors wrongly.", "这是前面的因数除错了。"],
            ],
            { unit: "h" },
          );
        },
        tapeFigure(
          [
            {
              total: "6 × 10⁸ km",
              pieces: [
                { size: 1, text: "3 × 10⁵" },
                { size: 1, text: "3 × 10⁵", lit: true },
                { size: 1, text: "3 × 10⁵" },
                { size: 2, text: "…", dashed: true },
              ],
            },
          ],
          [
            "A bar of 6 × 10⁸ km cut into pieces of 3 × 10⁵ km, one for each hour of the trip; there are 2000 of them.",
            "一个表示 6 × 10⁸ 千米的长条，切成每段 3 × 10⁵ 千米的小段，每段是一小时的路程，共有 2000 段。",
          ],
        ),
      ),
    ],
  ),
  [
    "Light travels about $3 \\times 10^{5}$ km each second. The Sun is about $1.5 \\times 10^{8}$ km away. To find how long sunlight takes to reach us, we divide.",
    "光每秒大约走 $3 \\times 10^{5}$ 千米。太阳离我们大约 $1.5 \\times 10^{8}$ 千米。要知道阳光多久照到地球，就要做除法。",
  ],
  [
    "$1.5 \\div 3 = 0.5$ and $8 - 5 = 3$. So it takes $0.5 \\times 10^{3} = 500$ seconds.",
    "$1.5 \\div 3 = 0.5$，$8 - 5 = 3$。所以要 $0.5 \\times 10^{3} = 500$ 秒。",
  ],
  [
    "divide numbers in scientific notation, fix a first factor less than $1$, and find travel times.",
    "做科学记数法的除法，调整小于 $1$ 的前面因数，并计算行程时间。",
  ],
);

// ---------------------------------------------------------------------------
// Real-world quantities

/** Quantity is a real-world quantity for estimation: [English, Chinese, unit in English, unit in Chinese, lowest and highest exponent]. */
type Quantity = readonly [string, string, string, string, number, number];

/** quantities are quantities whose sizes vary from case to case, so that no particular value is claimed as a fact. */
const quantities: readonly Quantity[] = [
  ["the population of a city", "一座城市的人口", "people", "人", 5, 7],
  ["the traffic to a website in a year", "一个网站一年的访问量", "visits", "人次", 6, 9],
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
