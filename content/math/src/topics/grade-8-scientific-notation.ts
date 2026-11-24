import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q, sci } from "@ga/subject-math";

import { scientificValue } from "../problems.ts";
import { compared, type Pair, type Walk } from "./early-grades-more-kit.ts";
import { mantissa, normalize, standard } from "./exponents.ts";
import { chosenMath, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { type Shift, scienced } from "./grade-8-kit.ts";
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

/** tenths writes v ÷ 10 as a decimal. */
const tenths = (v: number) => dec(Q.of(v, 10));

/** joined writes "a = b", or only a when the two are written the same. */
const joined = (a: string, b: string) => (a === b ? a : `${a} = ${b}`);

/** shiftOf writes the positive value v in scientific notation as a wrong answer with its reason, or nothing when v is not positive or its first factor needs more than three decimal places. */
function shiftOf(v: Q, en: string, zh: string): Shift[] {
  if (v.sign() <= 0) return [];
  const s = normalize(v);
  return s.a.mul(Q.of(1000)).isInteger() ? [[s.a, s.n, en, zh]] : [];
}

/** fixed writes the step that brings a first factor r over 10^n back into [1, 10), or nothing when it is already there. */
function fixed(r: Q, n: number): Walk[] {
  const s = normalize(scientificValue(r, n));
  if (s.n === n) return [];
  const k = Math.abs(s.n - n);
  return [
    [
      ["Fix the first factor", "调整前面的因数"],
      s.n > n
        ? [
            `It is $10$ or more, so move the point one place left and raise the exponent by $1$:`,
            `它不小于 $10$，所以把小数点向左移一位，指数加 $1$：`,
          ]
        : [
            `It is less than $1$, so move the point $${k}$ ${k === 1 ? "place" : "places"} right and lower the exponent by $${k}$:`,
            `它小于 $1$，所以把小数点向右移 $${k}$ 位，指数减 $${k}$：`,
          ],
      [`${sci(r, n)} = ${sci(s.a, s.n)}`],
    ],
  ];
}

/** differ asks for x ± y in scientific notation when the powers of ten differ: match the powers, combine the first factors,
 * fix the first factor, and check by matching the powers the other way. */
function differ(x: Sci, y: Sci, op: "+" | "-"): Problem {
  const gap = x.n - y.n;
  const ten = Q.of(10).pow(gap);
  const shifted = y.a.div(ten);
  const r = op === "+" ? x.a.add(shifted) : x.a.sub(shifted);
  const s = normalize(scientificValue(r, x.n));
  const big = x.a.mul(ten);
  const other = op === "+" ? big.add(y.a) : big.sub(y.a);
  const naive = op === "+" ? x.a.add(y.a) : x.a.sub(y.a);
  const wrongWay = op === "+" ? x.a.add(y.a.mul(ten)) : x.a.sub(y.a.mul(ten));
  const [verb, verbZh, result, resultZh] = op === "+" ? ["Add", "相加", "sum", "和"] : ["Subtract", "相减", "difference", "差"];
  return scienced(
    [
      `Find $${show(x)} ${op} ${show(y)}$. Give the answer in scientific notation.`,
      `计算 $${show(x)} ${op} ${show(y)}$，结果用科学记数法表示。`,
    ],
    s.a,
    s.n,
    [
      [
        ["Match the powers", "统一指数"],
        [
          `The power of $${show(y)}$ must rise by $${gap}$ to reach $10^{${x.n}}$, so its point moves $${gap}$ ${gap === 1 ? "place" : "places"} left:`,
          `$${show(y)}$ 的指数要增加 $${gap}$ 才到 $10^{${x.n}}$，所以它的小数点向左移 $${gap}$ 位：`,
        ],
        [`${show(y)} = ${sci(shifted, x.n)}`],
      ],
      [
        [`${verb} the first factors`, `前面的因数${verbZh}`],
        ["Keep the common power of ten:", "公共的 $10$ 的幂不变："],
        [`${show(x)} ${op} ${sci(shifted, x.n)} = ${sci(r, x.n)}`],
      ],
      ...fixed(r, x.n),
    ],
    [
      `Match the powers the other way, with $10^{${y.n}}$. Then $${show(x)} = ${sci(big, y.n)}$, and $${dec(big)} ${op} ${dec(y.a)} = ${dec(other)}$, so the ${result} is $${joined(sci(other, y.n), sci(s.a, s.n))}$.`,
      `换一种方式统一指数，都用 $10^{${y.n}}$。这时 $${show(x)} = ${sci(big, y.n)}$，而 $${dec(big)} ${op} ${dec(y.a)} = ${dec(other)}$，所以${resultZh}是 $${joined(sci(other, y.n), sci(s.a, s.n))}$。`,
    ],
    [
      ...shiftOf(
        scientificValue(naive, x.n),
        `That ${verb.toLowerCase()}s the first factors without matching the powers of ten.`,
        `这是没有统一指数就把前面的因数${verbZh}了。`,
      ),
      ...shiftOf(
        scientificValue(naive, y.n),
        "That combines the first factors and keeps the smaller power of ten.",
        "这是把前面的因数直接合并，又用了较小的 $10$ 的幂。",
      ),
      ...(s.n === x.n
        ? []
        : ([[s.a, x.n, "That moves the point but leaves the exponent as it was.", "这是移了小数点，却没有改指数。"]] as Shift[])),
      ...shiftOf(
        scientificValue(wrongWay, x.n),
        `That moves the point of $${show(y)}$ to the right; a larger power needs a smaller first factor.`,
        `这是把 $${show(y)}$ 的小数点向右移了；指数变大时，前面的因数要变小。`,
      ),
    ],
  );
}

/** convertingScientificNotationToStandardNotation writes a × 10^n out in full. */
export const convertingScientificNotationToStandardNotation = withIntro(
  topic(
    "converting-scientific-notation-to-standard-notation",
    t("Converting Scientific Notation to Standard Notation", "把科学记数法化为一般形式"),
    t(
      "Multiplying by $10^{n}$ moves the decimal point $n$ places to the right, and multiplying by $10^{-n}$ moves it $n$ places to the left. Fill any empty places with zeros.",
      "乘以 $10^{n}$ 就是把小数点向右移动 $n$ 位，乘以 $10^{-n}$ 就是向左移动 $n$ 位。空出的数位用 $0$ 补足。",
    ),
    ["writing-numbers-in-scientific-notation"],
    ["8.EE.A.3"],
    [
      lesson(
        "positive-powers-of-ten",
        ["Positive powers of ten", "10 的正整数次幂"],
        [
          [
            "Multiplying by $10^{n}$ moves the decimal point $n$ places to the right. For $6.07 \\times 10^{5}$, two of the five places are taken by the digits $0$ and $7$, and three more zeros fill the rest: $607{,}000$.",
            "乘以 $10^{n}$ 就是把小数点向右移动 $n$ 位。对于 $6.07 \\times 10^{5}$，五位中有两位由数字 $0$ 和 $7$ 占据，其余三位补 $0$：$607{,}000$。",
          ],
          [
            "Count the digits: $607{,}000$ has $6$ digits, and a whole number with $6$ digits lies between $10^{5}$ and $10^{6}$.",
            "数一数位数：$607{,}000$ 有 $6$ 位，而 $6$ 位整数在 $10^{5}$ 和 $10^{6}$ 之间。",
          ],
          [
            "The exponent counts the places the point moves, not the zeros to write. $6.07 \\times 10^{5}$ is not $60{,}700{,}000$.",
            "指数是小数点移动的位数，不是要写的 $0$ 的个数。$6.07 \\times 10^{5}$ 不是 $60{,}700{,}000$。",
          ],
        ],
        (rng) => {
          const s = draw(rng, 3, 9);
          const v = value(s);
          const d = s.a.isInteger() ? 0 : dec(s.a).split(".")[1]!.length;
          const digits = s.n + 1;
          return valued(
            [`Write $${show(s)}$ in standard notation.`, `把 $${show(s)}$ 写成一般形式。`],
            v,
            [
              [
                ["Count the places", "数位数"],
                d === 0
                  ? [
                      `The exponent is $${s.n}$, so the point moves $${s.n}$ places to the right. No digits stand after the point.`,
                      `指数是 $${s.n}$，所以小数点向右移动 $${s.n}$ 位。小数点后没有数字。`,
                    ]
                  : [
                      `The exponent is $${s.n}$, so the point moves $${s.n}$ places to the right. The ${d === 1 ? "digit" : `$${d}$ digits`} after the point take${d === 1 ? "s" : ""} up $${d}$ of them.`,
                      `指数是 $${s.n}$，所以小数点向右移动 $${s.n}$ 位，小数点后的 $${d}$ 个数字占去其中 $${d}$ 位。`,
                    ],
              ],
              [
                ["Fill with zeros", "补零"],
                [`The other $${s.n - d}$ places get zeros:`, `其余 $${s.n - d}$ 位补 $0$：`],
                [`${show(s)} = ${standard(v)}`],
              ],
            ],
            [
              `Count the digits: a whole number with $${digits}$ digits lies between $10^{${s.n}}$ and $10^{${s.n + 1}}$, just as $${show(s)}$ does, and it begins with the digits of $${dec(s.a)}$.`,
              `数一数位数：$${digits}$ 位整数在 $10^{${s.n}}$ 和 $10^{${s.n + 1}}$ 之间，$${show(s)}$ 也是这样，而且它开头的数字就是 $${dec(s.a)}$ 的数字。`,
            ],
            [
              ...(s.a.isInteger()
                ? []
                : ([
                    [
                      s.a.mul(Q.of(10 ** d)).mul(Q.of(10).pow(s.n)),
                      `That writes $${s.n}$ zeros after the digits, but the digits after the point already take up some of the places.`,
                      `这是在数字后面写了 $${s.n}$ 个 $0$，但小数点后的数字已经占去了几位。`,
                    ],
                  ] as Off[])),
              [scientificValue(s.a, s.n - 1), "That moves the point one place too few.", "这是小数点少移了一位。"],
              [scientificValue(s.a, s.n + 1), "That moves the point one place too many.", "这是小数点多移了一位。"],
              [
                scientificValue(s.a, -s.n),
                "That moves the point to the left; a positive exponent moves it right.",
                "这是把小数点向左移了；正指数要向右移。",
              ],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "6.07 × 10⁵ = 607 000",
              pieces: [
                { size: 1, text: "6" },
                { size: 1, text: "0", lit: true },
                { size: 1, text: "7", lit: true },
                { size: 1, text: "0", dashed: true },
                { size: 1, text: "0", dashed: true },
                { size: 1, text: "0", dashed: true },
              ],
            },
          ],
          [
            "The digits of 607 000 in a row: 6, then 0 and 7 shaded as the two places the digits take, then three dashed zeros that fill the rest of the five places.",
            "607 000 的数字排成一排：6，然后涂色的 0 和 7 是数字占去的两位，再是三个虚线的 0，补满其余的位，共五位。",
          ],
        ),
      ),
      lesson(
        "negative-powers-of-ten",
        ["Negative powers of ten", "10 的负整数次幂"],
        [
          [
            "Multiplying by $10^{-n}$ moves the decimal point $n$ places to the left. For $2.5 \\times 10^{-3}$, write zeros in front as the point moves: $0.0025$.",
            "乘以 $10^{-n}$ 就是把小数点向左移动 $n$ 位。对于 $2.5 \\times 10^{-3}$，小数点移动时在前面补 $0$：$0.0025$。",
          ],
          [
            "Read the place: in $0.0025$ the digit $2$ is in the thousandths place, the $10^{-3}$ place, which matches the exponent.",
            "看数位：$0.0025$ 中的数字 $2$ 在千分位，也就是 $10^{-3}$ 位，和指数一致。",
          ],
          [
            "A negative exponent makes the number small, not negative. $2.5 \\times 10^{-3}$ is not $-2500$.",
            "负指数使数变小，而不是变成负数。$2.5 \\times 10^{-3}$ 不是 $-2500$。",
          ],
        ],
        (rng) => {
          const s = draw(rng, -7, -1);
          const v = value(s);
          const k = -s.n;
          const first = dec(s.a)[0]!;
          return valued(
            [`Write $${show(s)}$ in standard notation.`, `把 $${show(s)}$ 写成一般形式。`],
            v,
            [
              [
                ["Count the places", "数位数"],
                [
                  `The exponent is $${s.n}$, so the point moves $${k}$ ${k === 1 ? "place" : "places"} to the left.`,
                  `指数是 $${s.n}$，所以小数点向左移动 $${k}$ 位。`,
                ],
              ],
              [
                ["Fill with zeros", "补零"],
                k === 1
                  ? [
                      `The digit $${first}$ lands right after the point, and no zeros are needed:`,
                      `数字 $${first}$ 紧挨在小数点后面，不用补 $0$：`,
                    ]
                  : [
                      `The digit $${first}$ lands in place $${k}$ after the point, with $${k - 1}$ ${k - 1 === 1 ? "zero" : "zeros"} between:`,
                      `数字 $${first}$ 落在小数点后第 $${k}$ 位，中间有 $${k - 1}$ 个 $0$：`,
                    ],
                [`${show(s)} = ${standard(v)}`],
              ],
            ],
            [
              `Read the place: the first nonzero digit, $${first}$, stands $${k}$ ${k === 1 ? "place" : "places"} after the point, which is the $10^{${s.n}}$ place.`,
              `看数位：第一个非零数字 $${first}$ 在小数点后第 $${k}$ 位，正是 $10^{${s.n}}$ 位。`,
            ],
            [
              [
                scientificValue(s.a, s.n - 1),
                `That writes $${k}$ zeros after the point, but the digit itself takes the last of the $${k}$ places.`,
                `这是在小数点后写了 $${k}$ 个 $0$，但数字本身占了这 $${k}$ 位中的最后一位。`,
              ],
              [scientificValue(s.a, s.n + 1), "That moves the point one place too few.", "这是小数点少移了一位。"],
              [
                scientificValue(s.a, -s.n),
                "That moves the point to the right; a negative exponent moves it left.",
                "这是把小数点向右移了；负指数要向左移。",
              ],
              [v.neg(), "A negative exponent makes the number small, not negative.", "负指数使数变小，而不是变成负数。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "2.5 × 10⁻³ = 0.0025",
              pieces: [
                { size: 1, text: "0", dashed: true },
                { size: 1, text: "0", dashed: true },
                { size: 1, text: "2", lit: true },
                { size: 1, text: "5" },
              ],
            },
          ],
          [
            "The digits after the point of 0.0025: two dashed zeros, then the shaded 2 in the third place, the 10⁻³ place, then 5.",
            "0.0025 小数点后的数字：两个虚线的 0，然后涂色的 2 在第三位，即 10⁻³ 位，再是 5。",
          ],
        ),
      ),
    ],
  ),
  [
    "A report says a country used $6.07 \\times 10^{5}$ tonnes of paper. To picture that amount, we write it out in full.",
    "一份报告说一个国家用了 $6.07 \\times 10^{5}$ 吨纸。为了想象这个量，我们把它完整地写出来。",
  ],
  ["$6.07 \\times 100{,}000 = 607{,}000$.", "$6.07 \\times 100{,}000 = 607{,}000$。"],
  [
    "write numbers in scientific notation out in full, for positive and negative powers of ten.",
    "把用科学记数法表示的数完整写出来，包括 $10$ 的正整数次幂和负整数次幂。",
  ],
);

/** comparingNumbersInScientificNotation orders numbers in scientific notation and finds how many times one is another. */
export const comparingNumbersInScientificNotation = withIntro(
  topic(
    "comparing-numbers-in-scientific-notation",
    t("Comparing Numbers in Scientific Notation", "比较用科学记数法表示的数"),
    t(
      "For positive numbers in scientific notation, the one with the greater power of ten is greater, whatever the first factors are; with equal powers, compare the first factors. To find how many times one number is another, divide: divide the first factors and subtract the exponents.",
      "对于用科学记数法表示的正数，$10$ 的指数较大的数较大，与前面的因数无关；指数相等时，比较前面的因数。要求一个数是另一个数的多少倍，就做除法：前面的因数相除，指数相减。",
    ),
    ["writing-numbers-in-scientific-notation"],
    ["8.EE.A.3"],
    [
      lesson(
        "ordering-numbers-in-scientific-notation",
        ["Which is greater?", "比较大小"],
        [
          [
            "For positive numbers in scientific notation, the greater power of ten wins, whatever the first factors are. Only when the powers are equal do the first factors decide. $9.1 \\times 10^{3} < 1.2 \\times 10^{4}$, since the second number has the greater power.",
            "对于用科学记数法表示的正数，$10$ 的指数大的数就大，与前面的因数无关。只有指数相等时，才比较前面的因数。$9.1 \\times 10^{3} < 1.2 \\times 10^{4}$，因为第二个数的指数更大。",
          ],
          ["Write both out: $9{,}100 < 12{,}000$.", "把两个数写出来：$9{,}100 < 12{,}000$。"],
          [
            "Do not compare the first factors first. $9.1$ is more than $1.2$, but $9.1 \\times 10^{3}$ is the smaller number. With negative exponents, $10^{-3}$ is greater than $10^{-5}$.",
            "不要先比较前面的因数。$9.1$ 比 $1.2$ 大，但 $9.1 \\times 10^{3}$ 是较小的数。负指数也一样，$10^{-3}$ 大于 $10^{-5}$。",
          ],
        ],
        (rng) => {
          const negative = rng.bool(0.4);
          const n = negative ? rng.int(-8, -4) : rng.int(2, 7);
          const kind = rng.pick(["trap", "same", "far"] as const);
          const big = Q.of(rng.int(61, 99), 10);
          const small = Q.of(rng.int(11, 59), 10);
          const x: Sci = { a: big, n };
          const y: Sci = { a: small, n: kind === "trap" ? n + 1 : kind === "same" ? n : n + rng.int(2, 3) };
          const [l, r] = rng.bool() ? [x, y] : [y, x];
          const rel = value(l).cmp(value(r)) + 1;
          const sym = ["<", "=", ">"][rel]!;
          const naive = l.a.cmp(r.a) + 1;
          const greater = rel === 2 ? l : r;
          const walk: Walk[] =
            l.n === r.n
              ? [
                  [
                    ["Compare the powers", "比较指数"],
                    [`Both have $10^{${n}}$, so the powers do not decide.`, `两个数都是 $10^{${n}}$，指数分不出大小。`],
                  ],
                  [
                    ["Compare the first factors", "比较前面的因数"],
                    [`$${dec(l.a)} ${sym} ${dec(r.a)}$, so:`, `$${dec(l.a)} ${sym} ${dec(r.a)}$，所以：`],
                    [`${show(l)} ${sym} ${show(r)}`],
                  ],
                ]
              : [
                  [
                    ["Compare the powers", "比较指数"],
                    [
                      `$10^{${Math.max(l.n, r.n)}}$ is greater than $10^{${Math.min(l.n, r.n)}}$, and each first factor is at least $1$ and less than $10$.`,
                      `$10^{${Math.max(l.n, r.n)}}$ 大于 $10^{${Math.min(l.n, r.n)}}$，而每个前面的因数都不小于 $1$ 且小于 $10$。`,
                    ],
                  ],
                  [
                    ["Decide", "判断"],
                    [
                      `So the number with the greater power is at least $10^{${Math.max(l.n, r.n)}}$, and the other is less than that:`,
                      `所以指数大的数至少是 $10^{${Math.max(l.n, r.n)}}$，另一个数比它小：`,
                    ],
                    [`${show(l)} ${sym} ${show(r)}`],
                  ],
                ];
          const reasons = [0, 1, 2].map(
            (i): Pair =>
              i === 1
                ? l.n === r.n
                  ? ["The first factors differ, so the numbers differ.", "前面的因数不同，所以两个数不相等。"]
                  : ["The powers of ten differ, so the numbers cannot be equal.", "$10$ 的指数不同，两个数不可能相等。"]
                : i === naive && l.n !== r.n
                  ? [
                      "That compares only the first factors; the power of ten decides first.",
                      "这是只比较了前面的因数；应当先看 $10$ 的指数。",
                    ]
                  : [
                      `That has the order backwards; $${show(greater)}$ is the greater number.`,
                      `这是把大小弄反了；$${show(greater)}$ 是较大的数。`,
                    ],
          ) as [Pair, Pair, Pair];
          return compared(
            show(l),
            show(r),
            rel,
            walk,
            [
              `Write both out in full, and the order is the same: $${standard(value(l))} ${sym} ${standard(value(r))}$.`,
              `把两个数完整写出来，大小关系相同：$${standard(value(l))} ${sym} ${standard(value(r))}$。`,
            ],
            reasons,
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 13000,
            step: 1000,
            labels: [0, 5000, 10000],
            marks: [
              { at: 9100, text: "9.1 × 10³" },
              { at: 12000, text: "1.2 × 10⁴", result: true },
            ],
          },
          [
            "A number line from 0 to 13 000: 9.1 × 10³ sits at 9 100, left of 1.2 × 10⁴ at 12 000.",
            "一条从 0 到 13 000 的数轴：9.1 × 10³ 在 9 100，位于 12 000 处的 1.2 × 10⁴ 左边。",
          ],
        ),
      ),
      lesson(
        "how-many-times-as-large",
        ["How many times as large?", "是多少倍"],
        [
          [
            "To find how many times one number is another, divide: divide the first factors and subtract the exponents. $\\frac{6 \\times 10^{8}}{2 \\times 10^{3}} = 3 \\times 10^{5}$.",
            "要求一个数是另一个数的多少倍，就做除法：前面的因数相除，指数相减。$\\frac{6 \\times 10^{8}}{2 \\times 10^{3}} = 3 \\times 10^{5}$。",
          ],
          [
            "Multiply back: $3 \\times 2 = 6$ and $5 + 3 = 8$, so $3 \\times 10^{5}$ times $2 \\times 10^{3}$ is $6 \\times 10^{8}$.",
            "乘回去：$3 \\times 2 = 6$，$5 + 3 = 8$，所以 $3 \\times 10^{5}$ 乘 $2 \\times 10^{3}$ 等于 $6 \\times 10^{8}$。",
          ],
          [
            "Subtracting the numbers answers a different question, how much larger. And the exponents are subtracted in order: $8 - 3$, not $3 - 8$.",
            "两数相减回答的是另一个问题：大多少。指数也要按顺序相减：是 $8 - 3$，不是 $3 - 8$。",
          ],
        ],
        (rng) => {
          for (;;) {
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
            if (n === 0) continue;
            const x: Sci = { a: Q.of(p), n: m };
            const y: Sci = { a: Q.of(q), n };
            const k = Q.of(p, q);
            const s = normalize(scientificValue(k, m - n));
            const back = s.a.mul(Q.of(q));
            return scienced(
              [
                `$${show(x)}$ is how many times as large as $${show(y)}$? Answer in scientific notation.`,
                `$${show(x)}$ 是 $${show(y)}$ 的多少倍？用科学记数法作答。`,
              ],
              s.a,
              s.n,
              [
                [
                  ["Divide the first factors", "前面的因数相除"],
                  [`$${p} \\div ${q} = ${dec(k)}$.`, `$${p} \\div ${q} = ${dec(k)}$。`],
                ],
                [
                  ["Subtract the exponents", "指数相减"],
                  ["Take the exponent of the second number from that of the first:", "用第一个数的指数减去第二个数的指数："],
                  [`${dec(k)} \\times 10^{${m} - ${signed(n)}} = ${sci(k, m - n)}`],
                ],
                ...fixed(k, m - n),
              ],
              [
                `Multiply back by $${show(y)}$: $${dec(s.a)} \\times ${q} = ${dec(back)}$ and $${s.n} + ${signed(n)} = ${s.n + n}$, so the product is $${joined(sci(back, s.n + n), show(x))}$.`,
                `乘回 $${show(y)}$：$${dec(s.a)} \\times ${q} = ${dec(back)}$，$${s.n} + ${signed(n)} = ${s.n + n}$，所以积是 $${joined(sci(back, s.n + n), show(x))}$。`,
              ],
              [
                ...shiftOf(scientificValue(k, n - m), "That subtracts the exponents the wrong way round.", "这是把指数减反了。"),
                ...shiftOf(
                  scientificValue(k, m + n),
                  "That adds the exponents; dividing subtracts them.",
                  "这是把指数相加了；相除时指数相减。",
                ),
                ...shiftOf(
                  scientificValue(Q.of(q, p), m - n),
                  "That divides the first factors the wrong way round.",
                  "这是把前面的因数除反了。",
                ),
                ...(s.n === m - n
                  ? []
                  : ([[s.a, m - n, "That moves the point but keeps the exponent.", "这是移了小数点，却没有改指数。"]] as Shift[])),
              ],
            );
          }
        },
        lineFigure(
          {
            lo: 0,
            hi: 9,
            step: 1,
            labels: [0, 3, 8],
            marks: [
              { at: 3, text: "10³" },
              { at: 8, text: "10⁸", result: true },
            ],
            jumps: [[3, 8]],
          },
          [
            "A number line of exponents from 0 to 9: a jump of 5 from 10³ to 10⁸, so 10⁸ is 10⁵ times 10³.",
            "一条从 0 到 9 的指数数轴：从 10³ 跳 5 格到 10⁸，所以 10⁸ 是 10³ 的 10⁵ 倍。",
          ],
        ),
      ),
    ],
  ),
  [
    "A star is $9.1 \\times 10^{3}$ light-years away, and another is $1.2 \\times 10^{4}$ light-years away. Which is farther, and by how many times?",
    "一颗恒星离我们 $9.1 \\times 10^{3}$ 光年，另一颗离我们 $1.2 \\times 10^{4}$ 光年。哪颗更远？远多少倍？",
  ],
  [
    "$9.1 \\times 10^{3} = 9{,}100$ and $1.2 \\times 10^{4} = 12{,}000$.",
    "$9.1 \\times 10^{3} = 9{,}100$，$1.2 \\times 10^{4} = 12{,}000$。",
  ],
  [
    "compare numbers in scientific notation by their powers of ten, and find how many times as large one is as another.",
    "按 $10$ 的指数比较用科学记数法表示的数，并求一个数是另一个数的多少倍。",
  ],
);

// ---------------------------------------------------------------------------
// Operations in scientific notation

/** additionAndSubtractionInScientificNotation adds and subtracts numbers with the same power of ten. */
export const additionAndSubtractionInScientificNotation = withIntro(
  topic(
    "addition-and-subtraction-in-scientific-notation",
    t("Addition and Subtraction in Scientific Notation", "科学记数法的加减"),
    t(
      "Numbers with the same power of ten add and subtract like like terms: add or subtract the first factors and keep the power of ten. If the result is no longer between 1 and 10, adjust it: 12.3 × 10⁴ = 1.23 × 10⁵.",
      "10 的指数相同的数像同类项一样相加减：前面的因数相加减，10 的幂不变。如果结果不再在 1 和 10 之间，就要调整：12.3 × 10⁴ = 1.23 × 10⁵。",
    ),
    ["writing-numbers-in-scientific-notation"],
    ["8.EE.A.4"],
    [
      lesson(
        "adding-with-the-same-power",
        ["Adding with the same power of ten", "10 的指数相同的加法"],
        [
          [
            "Numbers with the same power of ten add like like terms: add the first factors and keep the power. $7.4 \\times 10^{6} + 4.9 \\times 10^{6} = 12.3 \\times 10^{6}$, and since $12.3 \\ge 10$, it becomes $1.23 \\times 10^{7}$.",
            "$10$ 的指数相同的数像同类项一样相加：前面的因数相加，$10$ 的幂不变。$7.4 \\times 10^{6} + 4.9 \\times 10^{6} = 12.3 \\times 10^{6}$，由于 $12.3 \\ge 10$，写成 $1.23 \\times 10^{7}$。",
          ],
          [
            "Add them written out: $7{,}400{,}000 + 4{,}900{,}000 = 12{,}300{,}000$.",
            "写出来相加：$7{,}400{,}000 + 4{,}900{,}000 = 12{,}300{,}000$。",
          ],
          [
            "Keep the power of ten. Adding the exponents too, to get $10^{12}$, is wrong.",
            "$10$ 的幂保持不变。把指数也相加得到 $10^{12}$ 是错的。",
          ],
        ],
        (rng) => {
          const n = rng.bool(0.3) ? rng.int(-7, -2) : rng.int(2, 9);
          const [a, b] = [mantissa(rng), mantissa(rng)];
          const sum = a.add(b);
          const s = normalize(scientificValue(sum, n));
          return scienced(
            [
              `Find $${sci(a, n)} + ${sci(b, n)}$. Give the answer in scientific notation.`,
              `计算 $${sci(a, n)} + ${sci(b, n)}$，结果用科学记数法表示。`,
            ],
            s.a,
            s.n,
            [
              [
                ["Add the first factors", "前面的因数相加"],
                [`The powers match, so add the first factors and keep $10^{${n}}$:`, `指数相同，所以前面的因数相加，$10^{${n}}$ 不变：`],
                [`(${dec(a)} + ${dec(b)}) \\times 10^{${n}} = ${sci(sum, n)}`],
              ],
              ...(s.n === n
                ? ([
                    [
                      ["Check the form", "检查形式"],
                      [
                        `$${dec(sum)}$ is at least $1$ and less than $10$, so this is already scientific notation.`,
                        `$${dec(sum)}$ 不小于 $1$ 且小于 $10$，所以已经是科学记数法。`,
                      ],
                    ],
                  ] as Walk[])
                : fixed(sum, n)),
            ],
            [
              `Add them written out in full, and the sum matches: $${standard(scientificValue(a, n))} + ${standard(scientificValue(b, n))} = ${standard(scientificValue(sum, n))}$.`,
              `把它们完整写出来相加，和是一样的：$${standard(scientificValue(a, n))} + ${standard(scientificValue(b, n))} = ${standard(scientificValue(sum, n))}$。`,
            ],
            [
              [s.a, s.n + n, "That adds the exponents too; the power of ten stays the same.", "这是把指数也相加了；$10$ 的幂应保持不变。"],
              ...(s.n === n
                ? ([
                    [
                      s.a,
                      n + 1,
                      "That raises the exponent, but the sum is already less than $10$.",
                      "这是把指数加大了，但和已经小于 $10$。",
                    ],
                  ] as Shift[])
                : ([
                    [s.a, n, "That moves the point but does not raise the exponent.", "这是移了小数点，却没有把指数加 $1$。"],
                    [
                      s.a,
                      n - 1,
                      "That lowers the exponent; a first factor made smaller needs a larger exponent.",
                      "这是把指数减小了；前面的因数变小，指数要变大。",
                    ],
                  ] as Shift[])),
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "12.3 × 10⁶ = 1.23 × 10⁷",
              pieces: [
                { size: 7.4, text: "7.4" },
                { size: 4.9, text: "4.9", lit: true },
              ],
            },
          ],
          [
            "A bar of 7.4 and a shaded 4.9, both counted in 10⁶, making 12.3 × 10⁶, which is 1.23 × 10⁷.",
            "一个长条：7.4 和涂色的 4.9，单位都是 10⁶，合起来是 12.3 × 10⁶，即 1.23 × 10⁷。",
          ],
        ),
      ),
      lesson(
        "subtracting-with-the-same-power",
        ["Subtracting with the same power of ten", "10 的指数相同的减法"],
        [
          [
            "With the same power of ten, subtract the first factors and keep the power. If the new first factor is less than $1$, move the point right and lower the exponent. $5.2 \\times 10^{-3} - 4.7 \\times 10^{-3} = 0.5 \\times 10^{-3} = 5 \\times 10^{-4}$.",
            "$10$ 的指数相同时，前面的因数相减，$10$ 的幂不变。如果新的因数小于 $1$，就把小数点右移并减小指数。$5.2 \\times 10^{-3} - 4.7 \\times 10^{-3} = 0.5 \\times 10^{-3} = 5 \\times 10^{-4}$。",
          ],
          [
            "Add back: $5 \\times 10^{-4} + 4.7 \\times 10^{-3} = 0.5 \\times 10^{-3} + 4.7 \\times 10^{-3} = 5.2 \\times 10^{-3}$.",
            "加回去：$5 \\times 10^{-4} + 4.7 \\times 10^{-3} = 0.5 \\times 10^{-3} + 4.7 \\times 10^{-3} = 5.2 \\times 10^{-3}$。",
          ],
          [
            "Subtract only the first factors. Subtracting the exponents too leaves $10^{0}$, which is wrong.",
            "只把前面的因数相减。把指数也相减会得到 $10^{0}$，这是错的。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.bool(0.3) ? rng.int(-7, -2) : rng.int(2, 11);
            const a = mantissa(rng);
            const b = rng.bool(0.5) ? a.sub(Q.of(rng.int(1, 9), 10)) : mantissa(rng);
            if (b.cmp(Q.one) < 0 || b.cmp(a) >= 0) continue;
            const d = a.sub(b);
            const s = normalize(scientificValue(d, n));
            return scienced(
              [
                `Find $${sci(a, n)} - ${sci(b, n)}$. Give the answer in scientific notation.`,
                `计算 $${sci(a, n)} - ${sci(b, n)}$，结果用科学记数法表示。`,
              ],
              s.a,
              s.n,
              [
                [
                  ["Subtract the first factors", "前面的因数相减"],
                  [
                    `The powers match, so subtract the first factors and keep $10^{${n}}$:`,
                    `指数相同，所以前面的因数相减，$10^{${n}}$ 不变：`,
                  ],
                  [`(${dec(a)} - ${dec(b)}) \\times 10^{${n}} = ${sci(d, n)}`],
                ],
                ...(s.n === n
                  ? ([
                      [
                        ["Check the form", "检查形式"],
                        [
                          `$${dec(d)}$ is at least $1$ and less than $10$, so this is already scientific notation.`,
                          `$${dec(d)}$ 不小于 $1$ 且小于 $10$，所以已经是科学记数法。`,
                        ],
                      ],
                    ] as Walk[])
                  : fixed(d, n)),
              ],
              [
                `Add back: $${dec(d)} + ${dec(b)} = ${dec(a)}$, so the difference and $${sci(b, n)}$ make $${sci(a, n)}$ again.`,
                `加回去：$${dec(d)} + ${dec(b)} = ${dec(a)}$，所以差与 $${sci(b, n)}$ 合起来又是 $${sci(a, n)}$。`,
              ],
              [
                [
                  s.a,
                  s.n - n,
                  "That subtracts the exponents too; the power of ten stays the same.",
                  "这是把指数也相减了；$10$ 的幂应保持不变。",
                ],
                ...(s.n === n
                  ? shiftOf(
                      scientificValue(a.add(b), n),
                      "That adds the first factors instead of subtracting them.",
                      "这是把前面的因数相加了，应当相减。",
                    )
                  : ([
                      [s.a, n, "That moves the point but does not lower the exponent.", "这是移了小数点，却没有把指数减小。"],
                      [
                        s.a,
                        n + 1,
                        "That raises the exponent; a first factor made larger needs a smaller exponent.",
                        "这是把指数加大了；前面的因数变大，指数要变小。",
                      ],
                    ] as Shift[])),
              ],
            );
          }
        },
        tapeFigure(
          [timesTen("0.5", 1, 3, "÷10", "0.0005"), timesTen("5", 2, 2, "÷10", "0.0005")],
          [
            "Two bars of the same length, both 0.0005: one is 0.5 followed by three pieces ÷10, the other is 5 followed by two pieces ÷10.",
            "两个一样长的长条，都是 0.0005：一个是 0.5 后面跟着三段 ÷10，另一个是 5 后面跟着两段 ÷10。",
          ],
        ),
      ),
    ],
  ),
  [
    "One warehouse holds $7.4 \\times 10^{6}$ boxes and another holds $4.9 \\times 10^{6}$. Both counts are millions, so they can be added as millions.",
    "一个仓库有 $7.4 \\times 10^{6}$ 个箱子，另一个有 $4.9 \\times 10^{6}$ 个。两个数都以百万计，可以按百万相加。",
  ],
  ["$7.4$ million and $4.9$ million make $12.3$ million.", "$7.4$ 百万加 $4.9$ 百万等于 $12.3$ 百万。"],
  [
    "add and subtract numbers with the same power of ten, and fix the first factor when it leaves the range.",
    "做 $10$ 的指数相同的加减法，并在前面的因数超出范围时调整它。",
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

/** additionInScientificNotationWithDifferentPowersOfTen adds numbers whose powers of ten differ. */
export const additionInScientificNotationWithDifferentPowersOfTen = withIntro(
  topic(
    "addition-in-scientific-notation-with-different-powers-of-ten",
    t("Addition in Scientific Notation With Different Powers of Ten", "10 的指数不同的科学记数法加法"),
    t(
      "To add numbers in scientific notation with different powers of ten, first rewrite one of them so that both have the same power: moving the decimal point one place left raises the exponent by 1. Then add the first factors and keep the common power.",
      "10 的指数不同的科学记数法数相加时，先改写其中一个数，使两者的 10 的指数相同：小数点每向左移动一位，指数就增加 1。然后把前面的因数相加，10 的幂不变。",
    ),
    ["addition-and-subtraction-in-scientific-notation"],
    ["8.EE.A.4"],
    [
      lesson(
        "adding-powers-one-apart",
        ["Powers one apart", "指数相差 1"],
        [
          [
            "First factors can be added only when the powers of ten match. For $3.2 \\times 10^{5} + 4.1 \\times 10^{4}$, write $4.1 \\times 10^{4} = 0.41 \\times 10^{5}$: the power rises by $1$, so the point moves one place left. The sum is $3.61 \\times 10^{5}$.",
            "$10$ 的指数相同时才能把前面的因数相加。对于 $3.2 \\times 10^{5} + 4.1 \\times 10^{4}$，写成 $4.1 \\times 10^{4} = 0.41 \\times 10^{5}$：指数加 $1$，小数点左移一位。和是 $3.61 \\times 10^{5}$。",
          ],
          [
            "Match the powers the other way: $3.2 \\times 10^{5} = 32 \\times 10^{4}$, and $32 + 4.1 = 36.1$, so the sum is $36.1 \\times 10^{4} = 3.61 \\times 10^{5}$.",
            "换一种方式统一指数：$3.2 \\times 10^{5} = 32 \\times 10^{4}$，$32 + 4.1 = 36.1$，所以和是 $36.1 \\times 10^{4} = 3.61 \\times 10^{5}$。",
          ],
          [
            "Adding $3.2 + 4.1$ directly ignores that the second number is ten times smaller.",
            "直接计算 $3.2 + 4.1$ 忽略了第二个数小十倍。",
          ],
        ],
        (rng) => {
          const [x, y] = pair(rng, [1, 1]);
          return differ(x, y, "+");
        },
        tapeFigure(
          [timesTen("4.1", 2, 4, "×10", "41 000"), timesTen("0.41", 1, 5, "×10", "41 000")],
          [
            "Two bars of the same length, both 41 000: one is 4.1 followed by four pieces ×10, the other is 0.41 followed by five pieces ×10.",
            "两个一样长的长条，都是 41 000：一个是 4.1 后面跟着四段 ×10，另一个是 0.41 后面跟着五段 ×10。",
          ],
        ),
      ),
      lesson(
        "adding-powers-further-apart",
        ["Powers further apart", "指数相差更多"],
        [
          [
            "When the exponents differ by more, move the point of the smaller number as many places as they differ. For $6.5 \\times 10^{8} + 2.7 \\times 10^{5}$, the gap is $3$: $2.7 \\times 10^{5} = 0.0027 \\times 10^{8}$, and the sum is $6.5027 \\times 10^{8}$.",
            "指数相差更多时，两个指数相差几，较小数的小数点就移几位。对于 $6.5 \\times 10^{8} + 2.7 \\times 10^{5}$，相差 $3$：$2.7 \\times 10^{5} = 0.0027 \\times 10^{8}$，和是 $6.5027 \\times 10^{8}$。",
          ],
          [
            "Match the other way: $6.5 \\times 10^{8} = 6500 \\times 10^{5}$, and $6500 + 2.7 = 6502.7$, which is $6.5027 \\times 10^{8}$.",
            "换一种方式统一指数：$6.5 \\times 10^{8} = 6500 \\times 10^{5}$，$6500 + 2.7 = 6502.7$，就是 $6.5027 \\times 10^{8}$。",
          ],
          [
            "The smaller number changes only the later digits. An answer like $9.2 \\times 10^{8}$ treats it as if it had the same power.",
            "较小的数只改变后面的数位。像 $9.2 \\times 10^{8}$ 这样的答案把它当成了同样的指数。",
          ],
        ],
        (rng) => {
          const [x, y] = pair(rng, [2, 3]);
          return differ(x, y, "+");
        },
        lineFigure(
          {
            lo: 4,
            hi: 9,
            step: 1,
            labels: [5, 8],
            marks: [
              { at: 5, text: "10⁵" },
              { at: 8, text: "10⁸", result: true },
            ],
            jumps: [[5, 8]],
          },
          [
            "A number line of exponents: a jump of 3 from 10⁵ up to 10⁸, so the point of 2.7 moves 3 places left to give 0.0027.",
            "一条指数数轴：从 10⁵ 向上跳 3 格到 10⁸，所以 2.7 的小数点左移 3 位，得到 0.0027。",
          ],
        ),
      ),
    ],
  ),
  [
    "A city has $3.2 \\times 10^{5}$ homes, and a nearby town has $4.1 \\times 10^{4}$. To count them all, the two numbers must be written with the same power of ten.",
    "一座城市有 $3.2 \\times 10^{5}$ 户住宅，附近一个镇有 $4.1 \\times 10^{4}$ 户。要算总数，两个数必须写成相同的 $10$ 的幂。",
  ],
  ["$320{,}000 + 41{,}000 = 361{,}000$.", "$320{,}000 + 41{,}000 = 361{,}000$。"],
  [
    "match the powers of ten before adding, whether they are one apart or further apart.",
    "相加前先统一 $10$ 的指数，无论相差 $1$ 还是更多。",
  ],
);

/** subtractionInScientificNotationWithDifferentPowersOfTen subtracts numbers whose powers of ten differ. */
export const subtractionInScientificNotationWithDifferentPowersOfTen = withIntro(
  topic(
    "subtraction-in-scientific-notation-with-different-powers-of-ten",
    t("Subtraction in Scientific Notation With Different Powers of Ten", "10 的指数不同的科学记数法减法"),
    t(
      "To subtract numbers in scientific notation with different powers of ten, rewrite the smaller number with the power of the larger one, subtract the first factors, and adjust the result if the first factor falls below $1$.",
      "$10$ 的指数不同的科学记数法数相减时，把较小的数改写成与较大的数相同的 $10$ 的幂，再把前面的因数相减；如果结果前面的因数小于 $1$，就要调整。",
    ),
    ["addition-and-subtraction-in-scientific-notation"],
    ["8.EE.A.4"],
    [
      lesson(
        "subtracting-with-different-powers",
        ["Matching the powers", "统一 10 的指数"],
        [
          [
            "First factors can be subtracted only when the powers match. Rewrite the number with the smaller power, moving its point one place left for each step up. $5.6 \\times 10^{7} - 3.4 \\times 10^{5} = 5.6 \\times 10^{7} - 0.034 \\times 10^{7} = 5.566 \\times 10^{7}$.",
            "指数相同时才能把前面的因数相减。改写指数较小的数，指数每增加 $1$，小数点左移一位。$5.6 \\times 10^{7} - 3.4 \\times 10^{5} = 5.6 \\times 10^{7} - 0.034 \\times 10^{7} = 5.566 \\times 10^{7}$。",
          ],
          [
            "Match the other way: $5.6 \\times 10^{7} = 560 \\times 10^{5}$, and $560 - 3.4 = 556.6$, which is $5.566 \\times 10^{7}$.",
            "换一种方式统一指数：$5.6 \\times 10^{7} = 560 \\times 10^{5}$，$560 - 3.4 = 556.6$，就是 $5.566 \\times 10^{7}$。",
          ],
          [
            "Move the point of the smaller number to the left. Moving it right makes $340 \\times 10^{7}$, far too large.",
            "较小数的小数点要向左移。向右移会得到 $340 \\times 10^{7}$，大得多了。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [x, y] = pair(rng, [1, 3]);
            if (value(x).sub(value(y)).cmp(scientificValue(Q.one, x.n)) < 0) continue;
            return differ(x, y, "-");
          }
        },
        lineFigure(
          {
            lo: 4,
            hi: 8,
            step: 1,
            labels: [5, 7],
            marks: [
              { at: 5, text: "10⁵" },
              { at: 7, text: "10⁷", result: true },
            ],
            jumps: [[5, 7]],
          },
          [
            "A number line of exponents: a jump of 2 from 10⁵ up to 10⁷, so the point of 3.4 moves 2 places left to give 0.034.",
            "一条指数数轴：从 10⁵ 向上跳 2 格到 10⁷，所以 3.4 的小数点左移 2 位，得到 0.034。",
          ],
        ),
      ),
      lesson(
        "subtracting-to-a-smaller-power",
        ["Results with a smaller power", "结果的指数变小"],
        [
          [
            "A difference can fall below the larger power. $1.2 \\times 10^{6} - 4.5 \\times 10^{5} = 1.2 \\times 10^{6} - 0.45 \\times 10^{6} = 0.75 \\times 10^{6}$, and since $0.75 < 1$, move the point one place right and lower the exponent: $7.5 \\times 10^{5}$.",
            "差可能小于较大的那个幂。$1.2 \\times 10^{6} - 4.5 \\times 10^{5} = 1.2 \\times 10^{6} - 0.45 \\times 10^{6} = 0.75 \\times 10^{6}$，由于 $0.75 < 1$，把小数点右移一位，指数减 $1$：$7.5 \\times 10^{5}$。",
          ],
          [
            "Match the other way: $1.2 \\times 10^{6} = 12 \\times 10^{5}$, and $12 - 4.5 = 7.5$.",
            "换一种方式统一指数：$1.2 \\times 10^{6} = 12 \\times 10^{5}$，$12 - 4.5 = 7.5$。",
          ],
          [
            "After moving the point right, lower the exponent. $7.5 \\times 10^{6}$ is ten times too large.",
            "小数点右移后，指数要减小。$7.5 \\times 10^{6}$ 大了十倍。",
          ],
        ],
        (rng) => {
          for (;;) {
            const m = rng.bool(0.25) ? rng.int(-6, -1) : rng.int(3, 11);
            const x = { a: Q.of(rng.int(10, 19), 10), n: m };
            const y = { a: Q.of(rng.int(10, 99), 10), n: m - 1 };
            const d = value(x).sub(value(y));
            if (d.sign() <= 0 || d.cmp(scientificValue(Q.one, m)) >= 0) continue;
            return differ(x, y, "-");
          }
        },
        tapeFigure(
          [timesTen("0.75", 1, 6, "×10", "750 000"), timesTen("7.5", 2, 5, "×10", "750 000")],
          [
            "Two bars of the same length, both 750 000: one is 0.75 followed by six pieces ×10, the other is 7.5 followed by five pieces ×10.",
            "两个一样长的长条，都是 750 000：一个是 0.75 后面跟着六段 ×10，另一个是 7.5 后面跟着五段 ×10。",
          ],
        ),
      ),
    ],
  ),
  [
    "A tank holds $5.6 \\times 10^{7}$ liters of water, and $3.4 \\times 10^{5}$ liters are drained. To find what is left, match the powers of ten first.",
    "一个水箱有 $5.6 \\times 10^{7}$ 升水，放掉了 $3.4 \\times 10^{5}$ 升。要算剩下多少，先统一 $10$ 的指数。",
  ],
  ["$56{,}000{,}000 - 340{,}000 = 55{,}660{,}000$.", "$56{,}000{,}000 - 340{,}000 = 55{,}660{,}000$。"],
  [
    "subtract numbers with different powers of ten, and lower the power when the difference falls below it.",
    "做 $10$ 的指数不同的减法，并在差变小时降低指数。",
  ],
);

/** furtherAdditionInScientificNotationWithDifferentPowersOfTen adds with negative exponents and results that move to a larger power. */
export const furtherAdditionInScientificNotationWithDifferentPowersOfTen = withIntro(
  topic(
    "further-addition-in-scientific-notation-with-different-powers-of-ten",
    t("Further Addition in Scientific Notation With Different Powers of Ten", "10 的指数不同的科学记数法加法（进阶）"),
    t(
      "The same method works with negative exponents: $10^{-3}$ is ten times $10^{-4}$, so the number with exponent $-3$ is the one with the larger power. When the sum of the first factors reaches $10$ or more, move the decimal point one place left and raise the exponent by $1$.",
      "负整数指数也用同样的方法：$10^{-3}$ 是 $10^{-4}$ 的十倍，所以指数为 $-3$ 的数的 $10$ 的幂较大。前面的因数之和达到 $10$ 或更大时，把小数点向左移动一位，指数加 $1$。",
    ),
    ["addition-in-scientific-notation-with-different-powers-of-ten"],
    ["8.EE.A.4"],
    [
      lesson(
        "adding-with-negative-exponents",
        ["Negative exponents", "负整数指数"],
        [
          [
            "With negative exponents, the larger power is the one closer to zero. Rewrite the other number with that power. For $3.5 \\times 10^{-4} + 2.1 \\times 10^{-6}$, the larger power is $10^{-4}$, and $2.1 \\times 10^{-6} = 0.021 \\times 10^{-4}$. The sum is $3.521 \\times 10^{-4}$.",
            "指数为负时，较大的幂是更接近零的那个。把另一个数改写成这个幂。对于 $3.5 \\times 10^{-4} + 2.1 \\times 10^{-6}$，较大的幂是 $10^{-4}$，而 $2.1 \\times 10^{-6} = 0.021 \\times 10^{-4}$。和是 $3.521 \\times 10^{-4}$。",
          ],
          ["Write both as decimals: $0.00035 + 0.0000021 = 0.0003521$.", "都写成小数：$0.00035 + 0.0000021 = 0.0003521$。"],
          [
            "$-6$ is less than $-4$, so $10^{-6}$ is the smaller power. Rewriting $3.5 \\times 10^{-4}$ with $10^{-6}$ also works, but the point then moves right.",
            "$-6$ 小于 $-4$，所以 $10^{-6}$ 是较小的幂。把 $3.5 \\times 10^{-4}$ 改写成 $10^{-6}$ 也可以，但那时小数点要右移。",
          ],
        ],
        (rng) => {
          const m = rng.int(-9, -2);
          const x = { a: mantissa(rng), n: m };
          const y = { a: mantissa(rng), n: m - rng.int(1, 3) };
          return differ(x, y, "+");
        },
        lineFigure(
          {
            lo: -7,
            hi: -3,
            step: 1,
            labels: [-6, -4],
            marks: [
              { at: -6, text: "10⁻⁶" },
              { at: -4, text: "10⁻⁴", result: true },
            ],
            jumps: [[-6, -4]],
          },
          [
            "A number line of exponents: a jump of 2 from 10⁻⁶ up to 10⁻⁴, so 10⁻⁴ is the larger power and the point of 2.1 moves 2 places left.",
            "一条指数数轴：从 10⁻⁶ 向上跳 2 格到 10⁻⁴，所以 10⁻⁴ 是较大的幂，2.1 的小数点左移 2 位。",
          ],
        ),
      ),
      lesson(
        "sums-that-reach-the-next-power",
        ["Sums that reach the next power", "和进到更高的幂"],
        [
          [
            "After matching the powers, the sum of the first factors can reach $10$. Then divide it by $10$ and raise the exponent by $1$. $9.6 \\times 10^{5} + 7 \\times 10^{4} = 9.6 \\times 10^{5} + 0.7 \\times 10^{5} = 10.3 \\times 10^{5} = 1.03 \\times 10^{6}$.",
            "统一指数后，前面的因数之和可能达到 $10$。这时把它除以 $10$，指数加 $1$。$9.6 \\times 10^{5} + 7 \\times 10^{4} = 9.6 \\times 10^{5} + 0.7 \\times 10^{5} = 10.3 \\times 10^{5} = 1.03 \\times 10^{6}$。",
          ],
          ["Write both out: $960{,}000 + 70{,}000 = 1{,}030{,}000$.", "写出来：$960{,}000 + 70{,}000 = 1{,}030{,}000$。"],
          [
            "$10.3 \\times 10^{5}$ has the right value, but it is not scientific notation.",
            "$10.3 \\times 10^{5}$ 的值虽然对，但不是科学记数法。",
          ],
        ],
        (rng) => {
          for (;;) {
            const m = rng.bool(0.3) ? rng.int(-6, -1) : rng.int(3, 11);
            const x = { a: Q.of(rng.int(85, 99), 10), n: m };
            const y = { a: mantissa(rng), n: m - 1 };
            if (x.a.add(y.a.div(Q.of(10))).cmp(Q.of(10)) < 0) continue;
            return differ(x, y, "+");
          }
        },
        tapeFigure(
          [timesTen("10.3", 3, 5, "×10", "1 030 000"), timesTen("1.03", 2, 6, "×10", "1 030 000")],
          [
            "Two bars of the same length, both 1 030 000: one is 10.3 followed by five pieces ×10, the other is 1.03 followed by six pieces ×10.",
            "两个一样长的长条，都是 1 030 000：一个是 10.3 后面跟着五段 ×10，另一个是 1.03 后面跟着六段 ×10。",
          ],
        ),
      ),
    ],
  ),
  [
    "A drop of water holds $3.5 \\times 10^{-4}$ grams of salt, and a speck of dust adds $2.1 \\times 10^{-6}$ grams more. Small numbers add the same way as large ones.",
    "一滴水里有 $3.5 \\times 10^{-4}$ 克盐，一粒灰尘又加了 $2.1 \\times 10^{-6}$ 克。很小的数和很大的数加法一样。",
  ],
  ["$0.00035 + 0.0000021 = 0.0003521$.", "$0.00035 + 0.0000021 = 0.0003521$。"],
  [
    "add numbers with negative exponents, and move to the next power when the first factors reach $10$.",
    "做负整数指数的加法，并在前面的因数之和达到 $10$ 时进到更高的幂。",
  ],
);

/** multiplyingNumbersInScientificNotation multiplies the first factors and adds the exponents. */
export const multiplyingNumbersInScientificNotation = withIntro(
  topic(
    "multiplying-numbers-in-scientific-notation",
    t("Multiplying Numbers in Scientific Notation", "科学记数法的乘法"),
    t(
      "To multiply numbers in scientific notation, multiply the first factors and add the exponents: $(a \\times 10^{m})(b \\times 10^{n}) = ab \\times 10^{m + n}$. If ab is $10$ or more, move the decimal point one place left and raise the exponent by $1$.",
      "科学记数法的数相乘时，前面的因数相乘，指数相加：(a × 10ᵐ)(b × $10^{n}$) = ab × 10ᵐ⁺ⁿ。如果 ab 大于或等于 $10$，就把小数点向左移动一位，指数加 $1$。",
    ),
    ["writing-numbers-in-scientific-notation", "the-product-rule-for-exponents"],
    ["8.EE.A.4"],
    [
      lesson(
        "multiplying-with-small-products",
        ["Products less than 10", "因数之积小于 10"],
        [
          [
            "Multiply the first factors, and multiply the powers of ten by adding the exponents. When the product of the first factors is less than $10$, the answer is already in scientific notation: $(2 \\times 10^{5})(3.1 \\times 10^{-2}) = 6.2 \\times 10^{3}$.",
            "前面的因数相乘，$10$ 的幂相乘时指数相加。如果前面因数之积小于 $10$，结果已经是科学记数法：$(2 \\times 10^{5})(3.1 \\times 10^{-2}) = 6.2 \\times 10^{3}$。",
          ],
          ["Divide back: $6.2 \\div 3.1 = 2$ and $3 - (-2) = 5$.", "除回去：$6.2 \\div 3.1 = 2$，$3 - (-2) = 5$。"],
          [
            "Add the exponents; do not multiply them. $10^{5} \\times 10^{-2}$ is $10^{3}$, not $10^{-10}$.",
            "指数相加，不能相乘。$10^{5} \\times 10^{-2}$ 是 $10^{3}$，不是 $10^{-10}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = Q.of(rng.pick([20, 30, 40, 15, 25, 12]), 10);
            const b = Q.of(rng.int(11, 99), 10);
            const p = a.mul(b);
            const [m, n] = [exponent(rng, -8, 12), exponent(rng, -8, 12)];
            if (p.cmp(Q.of(10)) >= 0 || m + n === 0) continue;
            return scienced(
              [
                `Find $(${sci(a, m)})(${sci(b, n)})$. Give the answer in scientific notation.`,
                `计算 $(${sci(a, m)})(${sci(b, n)})$，结果用科学记数法表示。`,
              ],
              p,
              m + n,
              [
                [
                  ["Multiply the first factors", "前面的因数相乘"],
                  [
                    `$${dec(a)} \\times ${dec(b)} = ${dec(p)}$, which is less than $10$.`,
                    `$${dec(a)} \\times ${dec(b)} = ${dec(p)}$，小于 $10$。`,
                  ],
                ],
                [
                  ["Add the exponents", "指数相加"],
                  ["The powers of ten follow the product rule:", "$10$ 的幂按同底数幂的乘法计算："],
                  [`${dec(p)} \\times 10^{${m} + ${signed(n)}} = ${sci(p, m + n)}`],
                ],
              ],
              [
                `Divide back by the second number: $${dec(p)} \\div ${dec(b)} = ${dec(a)}$, and $${m + n} - ${signed(n)} = ${m}$.`,
                `除以第二个数来验证：$${dec(p)} \\div ${dec(b)} = ${dec(a)}$，$${m + n} - ${signed(n)} = ${m}$。`,
              ],
              [
                [p, m * n, "That multiplies the exponents; multiplying the numbers adds them.", "这是把指数相乘了；数相乘时指数相加。"],
                ...shiftOf(
                  scientificValue(a.add(b), m + n),
                  "That adds the first factors; they are multiplied.",
                  "这是把前面的因数相加了；应当相乘。",
                ),
                [p, m - n, "That subtracts the exponents; that is for dividing.", "这是把指数相减了；那是除法的做法。"],
              ],
            );
          }
        },
        lineFigure(
          {
            lo: 0,
            hi: 6,
            step: 1,
            labels: [0, 3, 5],
            marks: [
              { at: 5, text: "10⁵" },
              { at: 3, text: "10³", result: true },
            ],
            jumps: [[5, 3]],
          },
          [
            "A number line of exponents: adding −2 to 5 is a jump back 2 from 10⁵ to 10³.",
            "一条指数数轴：5 加上 −2，就是从 10⁵ 向回跳 2 格到 10³。",
          ],
        ),
      ),
      lesson(
        "multiplying-with-large-products",
        ["Products of 10 or more", "因数之积大于或等于 10"],
        [
          [
            "When the product of the first factors is $10$ or more, tidy it: move the point one place left and raise the exponent by $1$. $(6 \\times 10^{4})(8.5 \\times 10^{3}) = 51 \\times 10^{7} = 5.1 \\times 10^{8}$.",
            "前面因数之积大于或等于 $10$ 时要整理：小数点左移一位，指数加 $1$。$(6 \\times 10^{4})(8.5 \\times 10^{3}) = 51 \\times 10^{7} = 5.1 \\times 10^{8}$。",
          ],
          ["Divide back: $51 \\div 8.5 = 6$ and $7 - 3 = 4$.", "除回去：$51 \\div 8.5 = 6$，$7 - 3 = 4$。"],
          [
            "Forgetting to raise the exponent gives $5.1 \\times 10^{7}$, an answer ten times too small.",
            "忘记把指数加 $1$ 会得到 $5.1 \\times 10^{7}$，小了十倍。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = Q.of(rng.int(3, 9));
            const b = Q.of(rng.int(25, 99), 10);
            const p = a.mul(b);
            const [m, n] = [exponent(rng, -8, 12), exponent(rng, -8, 12)];
            if (p.cmp(Q.of(10)) < 0 || m + n === 0) continue;
            const s = normalize(scientificValue(p, m + n));
            return scienced(
              [
                `Find $(${sci(a, m)})(${sci(b, n)})$. Give the answer in scientific notation.`,
                `计算 $(${sci(a, m)})(${sci(b, n)})$，结果用科学记数法表示。`,
              ],
              s.a,
              s.n,
              [
                [
                  ["Multiply the first factors", "前面的因数相乘"],
                  [`$${dec(a)} \\times ${dec(b)} = ${dec(p)}$.`, `$${dec(a)} \\times ${dec(b)} = ${dec(p)}$。`],
                ],
                [
                  ["Add the exponents", "指数相加"],
                  ["The powers of ten follow the product rule:", "$10$ 的幂按同底数幂的乘法计算："],
                  [`${dec(p)} \\times 10^{${m} + ${signed(n)}} = ${sci(p, m + n)}`],
                ],
                ...fixed(p, m + n),
              ],
              [
                `Divide back by the second number: $${sci(s.a, s.n)} = ${sci(p, m + n)}$, and $${dec(p)} \\div ${dec(b)} = ${dec(a)}$, $${m + n} - ${signed(n)} = ${m}$.`,
                `除以第二个数来验证：$${sci(s.a, s.n)} = ${sci(p, m + n)}$，而 $${dec(p)} \\div ${dec(b)} = ${dec(a)}$，$${m + n} - ${signed(n)} = ${m}$。`,
              ],
              [
                [s.a, m + n, "That moves the point but does not raise the exponent.", "这是移了小数点，却没有把指数加 $1$。"],
                [
                  s.a,
                  m * n + 1,
                  "That multiplies the exponents; multiplying the numbers adds them.",
                  "这是把指数相乘了；数相乘时指数相加。",
                ],
                [
                  s.a,
                  m + n - 1,
                  "That lowers the exponent; a first factor made smaller needs a larger exponent.",
                  "这是把指数减小了；前面的因数变小，指数要变大。",
                ],
              ],
            );
          }
        },
        tapeFigure(
          [timesTen("51", 3, 7, "×10", "5.1 × 10⁸"), timesTen("5.1", 2, 8, "×10", "5.1 × 10⁸")],
          [
            "Two bars of the same length, both 5.1 × 10⁸: one is 51 followed by seven pieces ×10, the other is 5.1 followed by eight pieces ×10.",
            "两个一样长的长条，都是 5.1 × 10⁸：一个是 51 后面跟着七段 ×10，另一个是 5.1 后面跟着八段 ×10。",
          ],
        ),
      ),
    ],
  ),
  [
    "A factory makes $6 \\times 10^{4}$ boxes, each holding $8.5 \\times 10^{3}$ beads. The total number of beads is a product of two numbers in scientific notation.",
    "一家工厂生产 $6 \\times 10^{4}$ 个盒子，每盒装 $8.5 \\times 10^{3}$ 颗珠子。珠子的总数是两个科学记数法表示的数的积。",
  ],
  ["$60{,}000 \\times 8{,}500 = 510{,}000{,}000$.", "$60{,}000 \\times 8{,}500 = 510{,}000{,}000$。"],
  [
    "multiply numbers in scientific notation, and tidy a product of the first factors that reaches $10$.",
    "做科学记数法的乘法，并整理达到 $10$ 的前面因数之积。",
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
export const estimatingAndComparingRealWorldQuantitiesUsingScientificNotation = withIntro(
  topic(
    "estimating-and-comparing-real-world-quantities-using-scientific-notation",
    t("Estimating and Comparing Real-World Quantities Using Scientific Notation", "用科学记数法估计和比较实际量"),
    t(
      "Very large and very small quantities can be estimated as a single digit times a power of ten: round the first factor of the scientific notation to the nearest whole number. Two estimates are compared by dividing them, which tells how many times as large one is as the other.",
      "很大或很小的量可以估计成一个一位数乘以 10 的幂：把科学记数法前面的因数四舍五入到整数。比较两个估计值时用除法，就能知道一个是另一个的多少倍。",
    ),
    ["comparing-numbers-in-scientific-notation", "dividing-numbers-in-scientific-notation"],
    ["8.EE.A.3", "8.EE.A.4"],
    [
      lesson(
        "estimating-a-quantity",
        ["Estimating a quantity", "估计一个量"],
        [
          [
            "A large or small quantity can be estimated as one digit times a power of ten. Write it in scientific notation and round the first factor to the nearest whole number. $3{,}847{,}000 = 3.847 \\times 10^{6}$, about $4 \\times 10^{6}$.",
            "很大或很小的量可以估计成一个一位数乘以 $10$ 的幂。先写成科学记数法，再把前面的因数四舍五入到整数。$3{,}847{,}000 = 3.847 \\times 10^{6}$，大约是 $4 \\times 10^{6}$。",
          ],
          [
            "Round the number itself to its first digit: $3{,}847{,}000$ is closest to $4{,}000{,}000$.",
            "把这个数本身四舍五入到最高位：$3{,}847{,}000$ 最接近 $4{,}000{,}000$。",
          ],
          [
            "If the first factor rounds up to $10$, as $9.6$ does, the estimate becomes $1 \\times 10^{7}$, not $10 \\times 10^{6}$.",
            "如果前面的因数像 $9.6$ 一样入成 $10$，估计值就是 $1 \\times 10^{7}$，而不是 $10 \\times 10^{6}$。",
          ],
        ],
        (rng) => {
          const [en, zh, unit, unitZh, lo, hi] = rng.pick(quantities);
          const a = Q.of(rng.int(1001, 9899), 1000);
          const n = rng.int(lo, hi);
          const v = scientificValue(a, n);
          const r = Math.round(Number(a.n) / Number(a.d));
          const est: Sci = r === 10 ? { a: Q.one, n: n + 1 } : { a: Q.of(r), n };
          const down = Math.floor(Number(a.n) / Number(a.d));
          return scienced(
            [
              `${en[0]!.toUpperCase()}${en.slice(1)} is $${standard(v)}$ ${unit}. Estimate it as a single digit times a power of ten.`,
              `${zh}是 $${standard(v)}$ ${unitZh}。把它估计成一个一位数乘以 $10$ 的幂。`,
            ],
            est.a,
            est.n,
            [
              [
                ["Write it in scientific notation", "写成科学记数法"],
                ["Put the point after the first nonzero digit and count the places:", "把小数点放在第一个非零数字后面，数一数移动的位数："],
                [`${standard(v)} = ${sci(a, n)}`],
              ],
              [
                ["Round the first factor", "把前面的因数取整"],
                r === 10
                  ? [
                      `$${dec(a)}$ rounds to $10$, and $10 \\times 10^{${n}}$ is written with the next power:`,
                      `$${dec(a)}$ 四舍五入得 $10$，而 $10 \\times 10^{${n}}$ 要写成更高的幂：`,
                    ]
                  : [`Round $${dec(a)}$ to the nearest whole number:`, `把 $${dec(a)}$ 四舍五入到整数：`],
                [`${sci(a, n)} \\approx ${show(est)}`],
              ],
            ],
            [
              `Round the number itself to one nonzero digit, and you reach the same estimate: $${standard(v)} \\approx ${standard(value(est))}$.`,
              `把这个数本身四舍五入到最高位，得到同样的估计：$${standard(v)} \\approx ${standard(value(est))}$。`,
            ],
            [
              [Q.of(Math.max(down, 1)), n, "That cuts off the decimals instead of rounding.", "这是直接舍去了小数部分，而不是四舍五入。"],
              [est.a, est.n + 1, "That counts one place too many.", "这是多数了一位。"],
              [est.a, est.n - 1, "That counts one place too few.", "这是少数了一位。"],
            ],
          );
        },
        lineFigure(
          {
            lo: 3,
            hi: 5,
            step: 0.5,
            labels: [3, 4, 5],
            marks: [
              { at: 3.847, text: "3.847" },
              { at: 4, text: "4", result: true },
            ],
          },
          [
            "A number line from 3 to 5: 3.847 sits closer to 4 than to 3, so 3.847 × 10⁶ is about 4 × 10⁶.",
            "一条从 3 到 5 的数轴：3.847 离 4 比离 3 近，所以 3.847 × 10⁶ 大约是 4 × 10⁶。",
          ],
        ),
      ),
      lesson(
        "comparing-estimates",
        ["Comparing estimates", "比较估计值"],
        [
          [
            "To compare two estimates, divide the larger by the smaller: divide the first factors and subtract the exponents. $\\frac{3 \\times 10^{8}}{6 \\times 10^{4}} = 0.5 \\times 10^{4} = 5{,}000$, so the first is about $5{,}000$ times the second.",
            "比较两个估计值时，用较大的除以较小的：前面的因数相除，指数相减。$\\frac{3 \\times 10^{8}}{6 \\times 10^{4}} = 0.5 \\times 10^{4} = 5{,}000$，所以前者大约是后者的 $5{,}000$ 倍。",
          ],
          [
            "Multiply back: $5{,}000 \\times 6 \\times 10^{4} = 30{,}000 \\times 10^{4} = 3 \\times 10^{8}$.",
            "乘回去：$5{,}000 \\times 6 \\times 10^{4} = 30{,}000 \\times 10^{4} = 3 \\times 10^{8}$。",
          ],
          [
            "Divide the larger by the smaller. Dividing the other way gives a number less than $1$, which says how much of the larger the smaller is.",
            "用较大的除以较小的。反过来除会得到小于 $1$ 的数，那表示较小的是较大的几分之几。",
          ],
        ],
        (rng) => {
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
          const k = Q.of(p, q);
          const ratio = k.mul(scientificValue(Q.one, m - n));
          const text = sentence(sci(p, m), sci(q, n));
          return valued(
            [text.en, text["zh-CN"]],
            ratio,
            [
              [
                ["Divide the first factors", "前面的因数相除"],
                [`$${p} \\div ${q} = ${dec(k)}$.`, `$${p} \\div ${q} = ${dec(k)}$。`],
              ],
              [
                ["Subtract the exponents", "指数相减"],
                [
                  "Take the smaller quantity's exponent from the larger one's, and write the result out:",
                  "用较大量的指数减去较小量的指数，再把结果写出来：",
                ],
                [`${dec(k)} \\times 10^{${m} - ${signed(n)}} = ${standard(ratio)}`],
              ],
            ],
            [
              `Multiply back by the smaller quantity. The first factor gives $${standard(ratio)} \\times ${q} = ${standard(ratio.mul(Q.of(q)))}$. That times $10^{${n}}$ is $${sci(p, m)}$, the larger quantity.`,
              `乘以较小的量来验证。先乘前面的因数：$${standard(ratio)} \\times ${q} = ${standard(ratio.mul(Q.of(q)))}$。再乘 $10^{${n}}$ 就是 $${sci(p, m)}$。`,
            ],
            [
              [Q.one.div(ratio), "That divides the smaller quantity by the larger one.", "这是用较小的量除以较大的量。"],
              [
                scientificValue(Q.one, m - n),
                "That subtracts the exponents but leaves out the first factors.",
                "这是只把指数相减，漏掉了前面的因数。",
              ],
              [k, "That divides the first factors but leaves out the powers of ten.", "这是只把前面的因数相除，漏掉了 $10$ 的幂。"],
              [ratio.mul(Q.of(10)), "That writes one zero too many.", "这是多写了一个 $0$。"],
            ],
            { form: "decimal" },
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 9,
            step: 1,
            labels: [0, 4, 8],
            marks: [
              { at: 4, text: "10⁴" },
              { at: 8, text: "10⁸", result: true },
            ],
            jumps: [[4, 8]],
          },
          [
            "A number line of exponents: a jump of 4 from 10⁴ to 10⁸, a factor of 10⁴; the first factors 3 ÷ 6 = 0.5 then scale it to 5 000.",
            "一条指数数轴：从 10⁴ 跳 4 格到 10⁸，相差 10⁴ 倍；再乘前面因数之商 3 ÷ 6 = 0.5，得 5 000。",
          ],
        ),
      ),
    ],
  ),
  [
    "A country has about $3 \\times 10^{8}$ people, and one of its towns about $6 \\times 10^{4}$. Rounded numbers like these are enough to compare sizes.",
    "一个国家大约有 $3 \\times 10^{8}$ 人，其中一个小镇大约有 $6 \\times 10^{4}$ 人。这样取整的数已经足够比较大小。",
  ],
  ["$300{,}000{,}000 \\div 60{,}000 = 5{,}000$.", "$300{,}000{,}000 \\div 60{,}000 = 5{,}000$。"],
  [
    "estimate quantities as one digit times a power of ten, and compare two estimates by dividing.",
    "把量估计成一个一位数乘以 $10$ 的幂，并用除法比较两个估计值。",
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

/** zerosAtTheEnd counts the zeros at the end of a number in scientific notation written out; it is the third point of converting-scientific-notation-to-standard-notation, to take the place of the one in the deeper files. */
export const zerosAtTheEnd = lesson(
  "zeros-at-the-end",
  ["Zeros at the end", "末尾的零"],
  [
    [
      "The power of ten counts the places the point moves, and some of those places are filled by the digits already after the point. Only the places left over become zeros: $6.07 \\times 10^{5}$ ends in $5 - 2 = 3$ zeros.",
      "$10$ 的指数表示小数点移动的位数，其中一些位由小数点后已有的数字占据。只有剩下的位才变成零：$6.07 \\times 10^{5}$ 末尾有 $5 - 2 = 3$ 个零。",
    ],
    ["Write it out: $607{,}000$ ends in three zeros.", "写出来：$607{,}000$ 末尾有三个零。"],
    [
      "The exponent is not the number of zeros. $6.07 \\times 10^{5}$ has five places to move, but only three zeros.",
      "指数不是零的个数。$6.07 \\times 10^{5}$ 小数点移动五位，但只有三个零。",
    ],
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const two = rng.bool();
    const c = rng.int(1, 9);
    const n = rng.int(4, 11);
    const text = two ? `${a}.${b}${c}` : `${a}.${b}`;
    const d = two ? 2 : 1;
    const zeros = n - d;
    const v = scientificValue(Q.of(two ? a * 100 + b * 10 + c : a * 10 + b, two ? 100 : 10), n);
    return valued(
      [
        `How many zeros does $${text} \\times 10^{${n}}$ end with when written in standard notation?`,
        `$${text} \\times 10^{${n}}$ 写成一般形式后，末尾有几个零？`,
      ],
      zeros,
      [
        [
          ["Count the digits after the point", "数小数点后的数字"],
          [
            `$${text}$ has $${d}$ ${d === 1 ? "digit" : "digits"} after the point, and the point moves $${n}$ places.`,
            `$${text}$ 的小数点后有 $${d}$ 个数字，小数点要移动 $${n}$ 位。`,
          ],
        ],
        [
          ["Count the places left", "数剩下的位"],
          [`Those digits fill $${d}$ of the places, and zeros fill the rest:`, `这些数字占去 $${d}$ 位，其余的位补零：`],
          [`${n} - ${d} = ${zeros}`],
        ],
      ],
      [
        `Write the number out in full and count: $${standard(v)}$. It ends in $${zeros}$ zeros.`,
        `把这个数完整写出来再数：$${standard(v)}$。末尾有 $${zeros}$ 个零。`,
      ],
      [
        [
          n,
          "That counts the places the point moves, but some of them are taken by digits.",
          "这是数了小数点移动的位数，但其中有几位由数字占据。",
        ],
        [n + 1, "That counts the digits of the whole number, not the zeros at the end.", "这是数了整个数的位数，而不是末尾的零。"],
        [zeros - 1, "That counts one zero too few.", "这是少数了一个零。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "6.07 × 10⁵ = 607 000",
        pieces: [
          { size: 1, text: "6" },
          { size: 1, text: "0", lit: true },
          { size: 1, text: "7", lit: true },
          { size: 1, text: "0", dashed: true },
          { size: 1, text: "0", dashed: true },
          { size: 1, text: "0", dashed: true },
        ],
      },
    ],
    [
      "The digits of 607 000: 6, then 0 and 7 shaded as the two places the digits take, then the three dashed zeros at the end.",
      "607 000 的数字：6，然后涂色的 0 和 7 是数字占去的两位，最后是末尾三个虚线的 0。",
    ],
  ),
);

/** theGreatestOfFourInScientificNotation picks the greatest of four numbers in scientific notation; it is the third point of comparing-numbers-in-scientific-notation, to take the place of the one in the deeper files. */
export const theGreatestOfFourInScientificNotation = lesson(
  "the-greatest-of-four-in-scientific-notation",
  ["The greatest of four", "四个数中最大的"],
  [
    [
      "In scientific notation, the power of ten decides first, and the first factor decides only between equal powers. This holds for negative powers too, where a power closer to zero is greater.",
      "科学记数法中先看 $10$ 的指数，指数相同时才比较前面的数。负指数也是如此，离零更近的指数更大。",
    ],
    [
      "Rewrite all four with the smallest power, and the first factors compare directly: $7.3 \\times 10^{5} = 730 \\times 10^{3}$, while $9.8 \\times 10^{4} = 98 \\times 10^{3}$.",
      "把四个数都改写成最小的幂，前面的数就能直接比较：$7.3 \\times 10^{5} = 730 \\times 10^{3}$，而 $9.8 \\times 10^{4} = 98 \\times 10^{3}$。",
    ],
    [
      "The largest first factor does not win by itself. $9.8 \\times 10^{4}$ is less than $1.2 \\times 10^{5}$.",
      "前面的数最大并不一定最大。$9.8 \\times 10^{4}$ 小于 $1.2 \\times 10^{5}$。",
    ],
  ],
  (rng) => {
    const n = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 3, 4, 5, 6, 7, 8, 9]);
    const top = Q.of(rng.int(21, 99), 10);
    const one = Q.of(rng.int(11, 19), 10);
    const w1 = Q.of(rng.int(11, 99), 10);
    const w2 = Q.of(rng.int(11, 99), 10);
    const at = (a: Q, k: number) => dec(a.mul(Q.of(10).pow(k)));
    return chosenMath(
      rng,
      ["Which number is the greatest?", "哪个数最大？"],
      sci(top, n),
      [
        [
          sci(w1, n - 1),
          `Its power, $10^{${n - 1}}$, is lower, so it is less than $10^{${n}}$ whatever its first factor.`,
          `它的幂 $10^{${n - 1}}$ 较小，所以无论前面的数是多少，它都小于 $10^{${n}}$。`,
        ],
        [
          sci(w2, n - 2),
          `Its power, $10^{${n - 2}}$, is two lower, so it is less than $10^{${n - 1}}$.`,
          `它的幂 $10^{${n - 2}}$ 小两级，所以它小于 $10^{${n - 1}}$。`,
        ],
        [
          sci(one, n),
          `It has the greatest power too, but its first factor $${dec(one)}$ is less than $${dec(top)}$.`,
          `它的幂也最大，但前面的数 $${dec(one)}$ 小于 $${dec(top)}$。`,
        ],
      ],
      [
        [
          ["Find the greatest power", "找最大的幂"],
          [`The greatest power is $10^{${n}}$, and two of the numbers have it.`, `最大的幂是 $10^{${n}}$，有两个数是这个幂。`],
        ],
        [
          ["Compare those two", "比较这两个数"],
          [`Between them, $${dec(top)} > ${dec(one)}$, so the greatest is:`, `两者之中 $${dec(top)} > ${dec(one)}$，所以最大的是：`],
          [sci(top, n)],
        ],
      ],
      [
        `Rewrite all four with $10^{${n - 2}}$. The first factors become $${at(top, 2)}$, $${at(one, 2)}$, $${at(w1, 1)}$ and $${dec(w2)}$, and $${at(top, 2)}$ is the largest.`,
        `把四个数都改写成 $10^{${n - 2}}$，前面的数变成 $${at(top, 2)}$、$${at(one, 2)}$、$${at(w1, 1)}$ 和 $${dec(w2)}$，其中 $${at(top, 2)}$ 最大。`,
      ],
    );
  },
  lineFigure(
    {
      lo: 2,
      hi: 6,
      step: 1,
      labels: [3, 4, 5],
      marks: [
        { at: 3, text: "10³" },
        { at: 4, text: "10⁴" },
        { at: 5, text: "10⁵", result: true },
      ],
    },
    [
      "A number line of exponents with 10³, 10⁴ and 10⁵ marked: the numbers with 10⁵, the greatest power, are the greatest, and the first factors decide between them.",
      "一条指数数轴，标着 10³、10⁴ 和 10⁵：幂最大的 10⁵ 的数最大，它们之间再比较前面的数。",
    ],
  ),
);

/** aDifferenceBelowOne fixes a difference of first factors that falls below 1; it is the third point of addition-and-subtraction-in-scientific-notation, to take the place of the one in the deeper files. */
export const aDifferenceBelowOne = lesson(
  "a-difference-below-one",
  ["A difference below 1", "差小于 1"],
  [
    [
      "When a difference of the first factors falls below $1$, the answer is not yet in scientific notation. Multiply the first factor by ten and lower the power of ten by one: $0.5 \\times 10^{4} = 5 \\times 10^{3}$.",
      "前面的数之差小于 $1$ 时，结果还不是科学记数法。把前面的数乘 $10$，同时把 $10$ 的指数减 $1$：$0.5 \\times 10^{4} = 5 \\times 10^{3}$。",
    ],
    [
      "Both are $5{,}000$: $0.5 \\times 10{,}000$ and $5 \\times 1{,}000$.",
      "两个都是 $5{,}000$：$0.5 \\times 10{,}000$ 和 $5 \\times 1{,}000$。",
    ],
    [
      "The first factor grew, so the exponent goes down. $0.5 \\times 10^{4}$ is not $5 \\times 10^{5}$.",
      "前面的数变大了，所以指数要减小。$0.5 \\times 10^{4}$ 不是 $5 \\times 10^{5}$。",
    ],
  ],
  (rng) => {
    const d = rng.int(1, 9);
    const a = rng.int(11, 80);
    const n = rng.int(3, 9);
    const big = scientificValue(Q.of(a + d, 10), n);
    const small = scientificValue(Q.of(a, 10), n);
    return chosenMath(
      rng,
      [
        `Find $${tenths(a + d)} \\times 10^{${n}} - ${tenths(a)} \\times 10^{${n}}$ in scientific notation.`,
        `用科学记数法表示 $${tenths(a + d)} \\times 10^{${n}} - ${tenths(a)} \\times 10^{${n}}$。`,
      ],
      `${d} \\times 10^{${n - 1}}`,
      [
        [
          `${d} \\times 10^{${n}}`,
          "That moves the point but keeps the exponent; it must go down by $1$.",
          "这是移了小数点，却没有改指数；指数要减 $1$。",
        ],
        [
          `0.${d} \\times 10^{${n}}`,
          `That has the right value, but $0.${d}$ is less than $1$, so it is not scientific notation.`,
          `值是对的，但 $0.${d}$ 小于 $1$，所以不是科学记数法。`,
        ],
        [
          `${d} \\times 10^{${n + 1}}`,
          "That raises the exponent; a first factor made larger needs a smaller exponent.",
          "这是把指数加大了；前面的数变大，指数要变小。",
        ],
      ],
      [
        [
          ["Subtract the first factors", "前面的数相减"],
          ["The powers match, so subtract the first factors:", "指数相同，所以前面的数相减："],
          [`${tenths(a + d)} - ${tenths(a)} = 0.${d}`],
        ],
        [
          ["Fix the first factor", "调整前面的数"],
          [
            "It is less than $1$, so move the point one place right and lower the exponent by $1$:",
            "它小于 $1$，所以把小数点右移一位，指数减 $1$：",
          ],
          [`0.${d} \\times 10^{${n}} = ${d} \\times 10^{${n - 1}}`],
        ],
      ],
      [
        `Subtract them written out in full: $${standard(big)} - ${standard(small)} = ${standard(big.sub(small))}$.`,
        `把它们完整写出来相减：$${standard(big)} - ${standard(small)} = ${standard(big.sub(small))}$。`,
      ],
    );
  },
  tapeFigure(
    [timesTen("0.5", 1, 4, "×10", "5 000"), timesTen("5", 2, 3, "×10", "5 000")],
    [
      "Two bars of the same length, both 5 000: one is 0.5 followed by four pieces ×10, the other is 5 followed by three pieces ×10.",
      "两个一样长的长条，都是 5 000：一个是 0.5 后面跟着四段 ×10，另一个是 5 后面跟着三段 ×10。",
    ],
  ),
);

/** matchingThePowersFirst rewrites a number with a power of ten one higher; it is the third point of addition-in-scientific-notation-with-different-powers-of-ten, to take the place of the one in the deeper files. */
export const matchingThePowersFirst = lesson(
  "matching-the-powers-first",
  ["Matching the powers first", "先统一指数"],
  [
    [
      "Numbers can be added only when their powers of ten match. Raising the power by one means making the first factor ten times smaller, so the value stays the same: $4.1 \\times 10^{4} = 0.41 \\times 10^{5}$.",
      "$10$ 的指数相同时才能相加。指数加 $1$ 时，前面的数要缩小为十分之一，这样值不变：$4.1 \\times 10^{4} = 0.41 \\times 10^{5}$。",
    ],
    [
      "Both are $41{,}000$: $4.1 \\times 10{,}000$ and $0.41 \\times 100{,}000$.",
      "两个都是 $41{,}000$：$4.1 \\times 10{,}000$ 和 $0.41 \\times 100{,}000$。",
    ],
    [
      "The first factor and the exponent move in opposite directions. A higher power needs a smaller first factor, not $41$.",
      "前面的数和指数朝相反方向变。指数变大，前面的数要变小，而不是 $41$。",
    ],
  ],
  (rng) => {
    const a = rng.int(11, 99);
    const n = rng.int(2, 9);
    const answer = Q.of(a, 100);
    return valued(
      [
        `What number goes in the box? $$${tenths(a)} \\times 10^{${n}} = \\square \\times 10^{${n + 1}}$$`,
        `方框里是什么数？$$${tenths(a)} \\times 10^{${n}} = \\square \\times 10^{${n + 1}}$$`,
      ],
      answer,
      [
        [
          ["Compare the powers", "比较指数"],
          [`$10^{${n + 1}}$ is ten times $10^{${n}}$.`, `$10^{${n + 1}}$ 是 $10^{${n}}$ 的十倍。`],
        ],
        [
          ["Shrink the first factor", "缩小前面的数"],
          [
            "So the first factor must be ten times smaller, with its point one place left:",
            "所以前面的数要缩小为十分之一，小数点左移一位：",
          ],
          [`${tenths(a)} \\div 10 = ${dec(answer)}`],
        ],
      ],
      [
        `Write both sides out in full, and they agree: each is $${standard(scientificValue(Q.of(a, 10), n))}$.`,
        `把两边都完整写出来，结果相同：都是 $${standard(scientificValue(Q.of(a, 10), n))}$。`,
      ],
      [
        [
          Q.of(a),
          "That makes the first factor ten times larger; a higher power needs a smaller one.",
          "这是把前面的数扩大了十倍；指数变大，前面的数要变小。",
        ],
        [Q.of(a, 10), "That keeps the first factor, so the value grows ten times.", "这是前面的数没变，值就扩大了十倍。"],
        [
          Q.of(a, 1000),
          "That moves the point two places; one step up in the power needs only one.",
          "这是小数点移了两位；指数只加 $1$，只需移一位。",
        ],
      ],
      { form: "decimal" },
    );
  },
  tapeFigure(
    [timesTen("4.1", 2, 4, "×10", "41 000"), timesTen("0.41", 1, 5, "×10", "41 000")],
    [
      "Two bars of the same length, both 41 000: one is 4.1 followed by four pieces ×10, the other is 0.41 followed by five pieces ×10.",
      "两个一样长的长条，都是 41 000：一个是 4.1 后面跟着四段 ×10，另一个是 0.41 后面跟着五段 ×10。",
    ],
  ),
);

/** whenTheSmallerHardlyMatters estimates a difference whose smaller number is many powers of ten below; it is the third point of subtraction-in-scientific-notation-with-different-powers-of-ten, to take the place of the one in the deeper files. */
export const whenTheSmallerHardlyMatters = lesson(
  "when-the-smaller-hardly-matters",
  ["When the smaller hardly matters", "小数几乎不起作用时"],
  [
    [
      "When two powers of ten are far apart, the smaller number barely changes the larger one. So the difference is very close to the larger number, which is a quick way to check an answer.",
      "两个指数相差很大时，小数几乎不改变大数。所以差非常接近大数，可以用来快速检验答案。",
    ],
    [
      "Match the powers exactly: $4.5 \\times 10^{9} - 2.3 \\times 10^{2} = (4.5 - 0.00000023) \\times 10^{9} = 4.49999977 \\times 10^{9}$, which rounds to $4.5 \\times 10^{9}$.",
      "精确地统一指数：$4.5 \\times 10^{9} - 2.3 \\times 10^{2} = (4.5 - 0.00000023) \\times 10^{9} = 4.49999977 \\times 10^{9}$，四舍五入是 $4.5 \\times 10^{9}$。",
    ],
    [
      "The larger number sets the size of the answer. Taking the smaller power, as in $4.5 \\times 10^{2}$, is far too small.",
      "较大的数决定答案的大小。取较小的幂，如 $4.5 \\times 10^{2}$，就小得太多了。",
    ],
  ],
  (rng) => {
    const a = rng.pick([...Array(89).keys()].map((i) => i + 11).filter((v) => v % 10 !== 0));
    let b = rng.int(11, 99);
    if (b === a) b = a === 99 ? 98 : a + 1;
    const n = rng.int(4, 12);
    const gap = rng.int(6, 9);
    const shifted = Q.of(b, 10).div(Q.of(10).pow(gap));
    const exact = Q.of(a, 10).sub(shifted);
    return chosenMath(
      rng,
      [
        `Which is closest to $${tenths(a)} \\times 10^{${n}} - ${tenths(b)} \\times 10^{${n - gap}}$?`,
        `哪个最接近 $${tenths(a)} \\times 10^{${n}} - ${tenths(b)} \\times 10^{${n - gap}}$？`,
      ],
      `${tenths(a)} \\times 10^{${n}}`,
      [
        [
          `${tenths(a)} \\times 10^{${n - gap}}`,
          "That takes the smaller power; the larger number sets the size.",
          "这是用了较小的幂；答案的大小由较大的数决定。",
        ],
        [`${tenths(b)} \\times 10^{${n}}`, "That takes the first factor of the smaller number.", "这是用了较小数前面的数。"],
        [
          `${tenths(a)} \\times 10^{${n - 1}}`,
          "That lowers the power, which makes the answer ten times too small.",
          "这是把指数减小了，答案小了十倍。",
        ],
      ],
      [
        [
          ["Compare the sizes", "比较大小"],
          [
            `The second number has a power $${gap}$ lower, so it is about $10^{${gap}}$ times smaller.`,
            `第二个数的指数小 $${gap}$，所以它大约小 $10^{${gap}}$ 倍。`,
          ],
        ],
        [
          ["Estimate", "估计"],
          [
            "Taking it away changes only digits far after the point, so the difference is closest to:",
            "减去它只改变小数点后很远的数位，所以差最接近：",
          ],
          [`${tenths(a)} \\times 10^{${n}}`],
        ],
      ],
      [
        `Match the powers exactly: the second number is $${sci(shifted, n)}$, so the difference is $${sci(exact, n)}$. To one decimal place, $${dec(exact)}$ rounds to $${tenths(a)}$.`,
        `精确地统一指数：第二个数是 $${sci(shifted, n)}$，所以差是 $${sci(exact, n)}$。保留一位小数，$${dec(exact)}$ 约等于 $${tenths(a)}$。`,
      ],
    );
  },
  lineFigure(
    {
      lo: 0,
      hi: 10,
      step: 1,
      labels: [0, 2, 9],
      marks: [
        { at: 2, text: "10²" },
        { at: 9, text: "10⁹", result: true },
      ],
      jumps: [[2, 9]],
    },
    [
      "A number line of exponents: 10² and 10⁹ are 7 apart, so the smaller number is about 10⁷ times smaller and barely changes the larger.",
      "一条指数数轴：10² 和 10⁹ 相差 7 格，所以较小的数大约小 10⁷ 倍，几乎不改变较大的数。",
    ],
  ),
);

/** aSumAsADecimal writes a sum of two negative powers of ten as a decimal; it is the third point of further-addition-in-scientific-notation-with-different-powers-of-ten, to take the place of the one in the deeper files. */
export const aSumAsADecimal = lesson(
  "a-sum-as-a-decimal",
  ["A sum as a decimal", "和写成小数"],
  [
    [
      "Negative powers of ten name decimal places, so they can be read directly into a decimal. Each number fills its own place: $3 \\times 10^{-2} + 5 \\times 10^{-3} = 0.03 + 0.005 = 0.035$.",
      "$10$ 的负指数对应小数位，可以直接读成小数。每个数占自己的数位：$3 \\times 10^{-2} + 5 \\times 10^{-3} = 0.03 + 0.005 = 0.035$。",
    ],
    [
      "Match the powers instead: $5 \\times 10^{-3} = 0.5 \\times 10^{-2}$, so the sum is $3.5 \\times 10^{-2} = 0.035$.",
      "也可以先统一指数：$5 \\times 10^{-3} = 0.5 \\times 10^{-2}$，所以和是 $3.5 \\times 10^{-2} = 0.035$。",
    ],
    [
      "The two digits sit in different places. Adding them, $3 + 5 = 8$, mixes hundredths with thousandths.",
      "两个数字在不同的数位上。把它们直接相加 $3 + 5 = 8$，就把百分位和千分位混在一起了。",
    ],
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const n = rng.int(1, 3);
    const first = Q.of(a, 10 ** n);
    const second = Q.of(b, 10 ** (n + 1));
    const answer = first.add(second);
    return valued(
      [
        `Write $${a} \\times 10^{-${n}} + ${b} \\times 10^{-${n + 1}}$ as a decimal.`,
        `把 $${a} \\times 10^{-${n}} + ${b} \\times 10^{-${n + 1}}$ 写成小数。`,
      ],
      answer,
      [
        [
          ["Write each as a decimal", "各自写成小数"],
          [
            `$${a}$ goes in place $${n}$ after the point, and $${b}$ in place $${n + 1}$:`,
            `$${a}$ 在小数点后第 $${n}$ 位，$${b}$ 在第 $${n + 1}$ 位：`,
          ],
          [`${a} \\times 10^{-${n}} = ${dec(first)}`, `${b} \\times 10^{-${n + 1}} = ${dec(second)}`],
        ],
        [
          ["Add", "相加"],
          ["Each digit keeps its own place:", "每个数字保持在自己的数位："],
          [`${dec(first)} + ${dec(second)} = ${dec(answer)}`],
        ],
      ],
      [
        `Match the powers instead: $${b} \\times 10^{-${n + 1}} = 0.${b} \\times 10^{-${n}}$, so the sum is $${a}.${b} \\times 10^{-${n}} = ${dec(answer)}$.`,
        `也可以先统一指数：$${b} \\times 10^{-${n + 1}} = 0.${b} \\times 10^{-${n}}$，所以和是 $${a}.${b} \\times 10^{-${n}} = ${dec(answer)}$。`,
      ],
      [
        [Q.of(a + b, 10 ** n), "That adds the digits as if they were in the same place.", "这是把两个数字当成在同一数位上相加了。"],
        [Q.of(a + b, 10 ** (n + 1)), "That puts both digits in the later place.", "这是把两个数字都放在了后一位。"],
        [Q.of(a * 10 + b, 10 ** n), "That puts the digits one place too early.", "这是把数字放早了一位。"],
      ],
      { form: "decimal" },
    );
  },
  tapeFigure(
    [
      {
        total: "3 × 10⁻² + 5 × 10⁻³ = 0.035",
        pieces: [
          { size: 1, text: "0." },
          { size: 1, text: "0" },
          { size: 1, text: "3", lit: true },
          { size: 1, text: "5", lit: true },
        ],
      },
    ],
    [
      "The places of 0.035: 0, then 0 in the tenths, 3 in the hundredths, the 10⁻² place, and 5 in the thousandths, the 10⁻³ place.",
      "0.035 的数位：0，十分位是 0，百分位（10⁻² 位）是 3，千分位（10⁻³ 位）是 5。",
    ],
  ),
);

/** thePowerAfterTidyingTheProduct finds the exponent of a product whose first factors multiply to 10 or more; it is the third point of multiplying-numbers-in-scientific-notation, to take the place of the one in the deeper files. */
export const thePowerAfterTidyingTheProduct = lesson(
  "the-power-after-tidying-the-product",
  ["The power after tidying the product", "整理积后的指数"],
  [
    [
      "Multiplying adds the powers of ten, but the product of the first factors may reach $10$. Then it must be tidied, which raises the power of ten by one more: $(6 \\times 10^{4})(5 \\times 10^{3}) = 30 \\times 10^{7} = 3 \\times 10^{8}$.",
      "相乘时指数相加，但前面的数之积可能达到 $10$。这时要整理，指数还要再加 $1$：$(6 \\times 10^{4})(5 \\times 10^{3}) = 30 \\times 10^{7} = 3 \\times 10^{8}$。",
    ],
    [
      "$3 \\times 10 = 30$, so $3 \\times 10^{8} = 30 \\times 10^{7}$.",
      "$3 \\times 10 = 30$，所以 $3 \\times 10^{8} = 30 \\times 10^{7}$。",
    ],
    [
      "Do not stop at $4 + 3 = 7$. The product $30$ is not between $1$ and $10$, so the exponent rises once more.",
      "不要停在 $4 + 3 = 7$。积 $30$ 不在 $1$ 和 $10$ 之间，所以指数还要再加 $1$。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(Math.ceil(10 / a), 9);
    const m = exponent(rng, -9, 12);
    const n = rng.int(2, 12);
    const power = m + n + 1;
    const c = Q.of(a * b, 10);
    return valued(
      [
        `In scientific notation, $(${a} \\times 10^{${m}})(${b} \\times 10^{${n}}) = c \\times 10^{k}$ with $c$ between $1$ and $10$. What is $k$?`,
        `用科学记数法表示，$(${a} \\times 10^{${m}})(${b} \\times 10^{${n}}) = c \\times 10^{k}$，其中 $c$ 在 $1$ 和 $10$ 之间。$k$ 是多少？`,
      ],
      power,
      [
        [
          ["Multiply the first factors", "前面的数相乘"],
          [
            `$${a} \\times ${b} = ${a * b}$, and the exponents add to $${m} + ${n} = ${m + n}$.`,
            `$${a} \\times ${b} = ${a * b}$，指数相加得 $${m} + ${n} = ${m + n}$。`,
          ],
        ],
        [
          ["Tidy the product", "整理积"],
          [
            `$${a * b}$ is $10$ or more, so move its point one place left and raise the exponent by $1$:`,
            `$${a * b}$ 不小于 $10$，所以小数点左移一位，指数加 $1$：`,
          ],
          [`${a * b} \\times 10^{${m + n}} = ${dec(c)} \\times 10^{${power}}`],
        ],
      ],
      [
        `Undo the tidying: $${dec(c)} \\times 10 = ${a * b}$, so $${dec(c)} \\times 10^{${power}} = ${a * b} \\times 10^{${m + n}}$, and $${dec(c)}$ lies between $1$ and $10$.`,
        `把整理还原：$${dec(c)} \\times 10 = ${a * b}$，所以 $${dec(c)} \\times 10^{${power}} = ${a * b} \\times 10^{${m + n}}$，而 $${dec(c)}$ 在 $1$ 和 $10$ 之间。`,
      ],
      [
        [m + n, "That adds the exponents but forgets to tidy the product.", "这是指数相加了，却忘了整理积。"],
        [m * n, "That multiplies the exponents; multiplying the numbers adds them.", "这是把指数相乘了；数相乘时指数相加。"],
        [m + n + 2, "That raises the exponent twice; tidying raises it once.", "这是指数加了两次；整理只加一次。"],
        [
          m + n - 1,
          "That lowers the exponent; a first factor made smaller needs a larger exponent.",
          "这是把指数减小了；前面的数变小，指数要变大。",
        ],
      ],
      { solveFor: "k" },
    );
  },
  tapeFigure(
    [timesTen("30", 3, 7, "×10", "3 × 10⁸"), timesTen("3", 2, 8, "×10", "3 × 10⁸")],
    [
      "Two bars of the same length, both 3 × 10⁸: one is 30 followed by seven pieces ×10, the other is 3 followed by eight pieces ×10.",
      "两个一样长的长条，都是 3 × 10⁸：一个是 30 后面跟着七段 ×10，另一个是 3 后面跟着八段 ×10。",
    ],
  ),
);

/** howLongItTakes divides a total by a rate in scientific notation; it is the third point of estimating-and-comparing-real-world-quantities-using-scientific-notation, to take the place of the one in the deeper files. */
export const howLongItTakes = lesson(
  "how-long-it-takes",
  ["How long it takes", "需要多长时间"],
  [
    [
      "Dividing a total by a rate gives a time, and in scientific notation this means dividing the first factors and subtracting the powers of ten. A file of $8 \\times 10^{9}$ bytes at $2 \\times 10^{6}$ bytes per second takes $4 \\times 10^{3}$ seconds.",
      "总量除以速率得到时间，在科学记数法中就是前面的数相除、指数相减。一个 $8 \\times 10^{9}$ 字节的文件以每秒 $2 \\times 10^{6}$ 字节下载，需要 $4 \\times 10^{3}$ 秒。",
    ],
    [
      "Multiply back: $(4 \\times 10^{3})(2 \\times 10^{6}) = 8 \\times 10^{9}$.",
      "乘回去：$(4 \\times 10^{3})(2 \\times 10^{6}) = 8 \\times 10^{9}$。",
    ],
    [
      "Subtract the exponent of the rate; adding it gives $4 \\times 10^{15}$ seconds, millions of years.",
      "要减去速率的指数；相加会得到 $4 \\times 10^{15}$ 秒，那是几百万年。",
    ],
  ],
  (rng) => {
    const [q, r] = rng.pick<[number, number]>([
      [1.5, 2],
      [1.5, 3],
      [1.5, 4],
      [2, 2],
      [2, 3],
      [2, 4],
      [2.5, 2],
      [2.5, 3],
      [3, 2],
      [3, 3],
      [4, 2],
    ]);
    const m = rng.int(7, 12);
    const n = rng.int(2, 6);
    const tq = Q.of(q * 10, 10);
    const total = tq.mul(Q.of(r));
    return scienced(
      [
        `A file of $${dec(total)} \\times 10^{${m}}$ bytes downloads at $${r} \\times 10^{${n}}$ bytes per second. How many seconds does it take? Answer in scientific notation.`,
        `一个 $${dec(total)} \\times 10^{${m}}$ 字节的文件以每秒 $${r} \\times 10^{${n}}$ 字节下载。需要多少秒？用科学记数法作答。`,
      ],
      tq,
      m - n,
      [
        [
          ["Set up the division", "列出除法"],
          ["Time is the total divided by the rate:", "时间等于总量除以速率："],
          [`\\frac{${dec(total)} \\times 10^{${m}}}{${r} \\times 10^{${n}}}`],
        ],
        [
          ["Divide", "相除"],
          [
            `The first factors give $${dec(total)} \\div ${r} = ${dec(tq)}$, and the exponents give $${m} - ${n} = ${m - n}$:`,
            `前面的数相除得 $${dec(total)} \\div ${r} = ${dec(tq)}$，指数相减得 $${m} - ${n} = ${m - n}$：`,
          ],
          [`${sci(tq, m - n)}`],
        ],
      ],
      [
        `Multiply the time by the rate: $(${sci(tq, m - n)})(${r} \\times 10^{${n}}) = ${sci(total, m)}$.`,
        `用时间乘速率来验证：$(${sci(tq, m - n)})(${r} \\times 10^{${n}}) = ${sci(total, m)}$。`,
      ],
      [
        [tq, m + n, "That adds the exponents; dividing subtracts them.", "这是把指数相加了；相除时指数相减。"],
        ...shiftOf(
          scientificValue(total.mul(Q.of(r)), m - n),
          "That multiplies the first factors instead of dividing them.",
          "这是把前面的数相乘了，应当相除。",
        ),
        ...shiftOf(
          scientificValue(Q.one.div(tq), n - m),
          "That divides the rate by the size of the file, the wrong way round.",
          "这是用速率除以文件大小，除反了。",
        ),
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "8 × 10⁹ bytes",
        pieces: [
          { size: 1, text: "2 × 10⁶" },
          { size: 1, text: "2 × 10⁶", lit: true },
          { size: 1, text: "2 × 10⁶" },
          { size: 2, text: "…", dashed: true },
        ],
      },
    ],
    [
      "A bar of 8 × 10⁹ bytes cut into pieces of 2 × 10⁶ bytes, one for each second of the download; there are 4 × 10³ of them.",
      "一个表示 8 × 10⁹ 字节的长条，切成每段 2 × 10⁶ 字节的小段，每段是一秒的下载量，共有 4 × 10³ 段。",
    ],
  ),
);
