import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, gcd, num, paren, Q, radical, simplifyRadical } from "@ga/subject-math";

import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { chosenMath, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { rooted } from "./grade-8-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

// 8th Grade Math, radicals: square roots and cube roots of perfect squares and cubes, surds, the product and quotient
// rules for radicals, equations solved with square and cube roots, and side lengths of squares and cubes.

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

/** squareFree are square-free radicands other than 1. */
const squareFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];

/** isSquare reports whether n is a perfect square. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** reduced draws a fraction a/b in lowest terms with a between 1 and aMax and b between 2 and bMax. */
function reduced(rng: Rng, aMax: number, bMax: number): Q {
  const [a, b] = [rng.int(1, aMax), rng.int(2, bMax)];
  return gcd(a, b) === 1 ? Q.of(a, b) : reduced(rng, aMax, bMax);
}

/** power writes q^k with parentheses around a negative number or a fraction. */
const power = (q: Q, k: number) => `${q.sign() < 0 || !q.isInteger() ? `\\left(${num(q)}\\right)` : num(q)}^{${k}}`;

// ---------------------------------------------------------------------------
// Square roots and cube roots

/** primeTeX writes a whole number above 1 as a product of prime powers, such as 2^{4} \cdot 3^{2}. */
function primeTeX(n: number): string {
  const parts: string[] = [];
  let rest = n;
  for (let p = 2; p * p <= rest; p++) {
    let e = 0;
    while (rest % p === 0) {
      rest /= p;
      e++;
    }
    if (e > 0) parts.push(e === 1 ? `${p}` : `${p}^{${e}}`);
  }
  if (rest > 1) parts.push(`${rest}`);
  return parts.join(" \\cdot ");
}

/** grouped writes how the prime factors of r^k fall into groups of k, one from each group giving r, for a whole number r above 1. */
function grouped(r: number, k: 2 | 3): Pair {
  const whole = primeTeX(r ** k);
  const one = primeTeX(r);
  const back = one === `${r}` ? `$${r}$` : `$${one} = ${r}$`;
  return k === 2
    ? [
        `Split into prime pairs: $${r ** k} = ${whole}$. One factor from each pair gives ${back}.`,
        `分成成对的质因数：$${r ** k} = ${whole}$。每对取一个，得 ${back}。`,
      ]
    : [
        `Group the prime factors in threes: $${r ** k} = ${whole}$. One factor from each group gives ${back}.`,
        `把质因数三个一组：$${r ** k} = ${whole}$。每组取一个，得 ${back}。`,
      ];
}

/** cubed writes x^3 for a whole number, with parentheses around a negative one. */
const cubed = (x: number) => `${x < 0 ? `(${x})` : x}^{3}`;

/** theSquareRootOfAPerfectSquare evaluates square roots of perfect squares. */
export const theSquareRootOfAPerfectSquare = withIntro(
  topic(
    "the-square-root-of-a-perfect-square",
    t("The Square Root of a Perfect Square", "完全平方数的平方根"),
    t(
      "The square root √a is the nonnegative number whose square is a, so √a = r exactly when r ≥ 0 and r² = a. For fractions and decimals, a perfect square has a square root that is a fraction or a decimal: √(9/25) = 3/5 and √0.36 = 0.6.",
      "平方根 √a 是平方等于 a 的非负数，所以 √a = r 当且仅当 r ≥ 0 且 r² = a。分数和小数中也有完全平方数，它们的平方根是分数或小数：√(9/25) = 3/5，√0.36 = 0.6。",
    ),
    ["powers-of-rational-numbers"],
    ["8.EE.A.2"],
    [
      lesson(
        "square-roots-of-whole-numbers",
        ["Whole numbers", "整数"],
        [
          [
            "$\\sqrt{144} = 12$ because $12^{2} = 144$. Although $(-12)^{2} = 144$ as well, the symbol $\\sqrt{\\phantom{0}}$ means the root that is not negative, so $\\sqrt{144} = 12$ and $-\\sqrt{144} = -12$.",
            "$\\sqrt{144} = 12$，因为 $12^{2} = 144$。虽然 $(-12)^{2}$ 也等于 $144$，但根号 $\\sqrt{\\phantom{0}}$ 表示非负的根，所以 $\\sqrt{144} = 12$，$-\\sqrt{144} = -12$。",
          ],
          [
            "Split into prime pairs: $144 = 2^{4} \\cdot 3^{2}$, and one factor from each pair gives $2^{2} \\cdot 3 = 12$.",
            "分成成对的质因数：$144 = 2^{4} \\cdot 3^{2}$，每对取一个，得 $2^{2} \\cdot 3 = 12$。",
          ],
          ["The square root is not half the number: $\\sqrt{144} \\neq 72$.", "平方根不是这个数的一半：$\\sqrt{144} \\neq 72$。"],
        ],
        (rng) => {
          const r = rng.int(2, 30);
          const neg = rng.bool(0.25);
          const v = neg ? -r : r;
          const expr = `${neg ? "-" : ""}\\sqrt{${r * r}}`;
          const s = neg ? -1 : 1;
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            v,
            [
              [
                ["Find the root", "找出平方根"],
                [
                  `$${r}^{2} = ${r * r}$ and $${r}$ is not negative, so $\\sqrt{${r * r}} = ${r}$.`,
                  `$${r}^{2} = ${r * r}$，且 $${r}$ 不是负数，所以 $\\sqrt{${r * r}} = ${r}$。`,
                ],
              ],
              [
                ["Apply the sign", "处理符号"],
                neg
                  ? ["The minus sign stands outside the root, so it applies afterward:", "负号在根号外面，开方之后再加上："]
                  : [
                      `The root sign names the root that is not negative, so the answer is not $-${r}$:`,
                      `根号表示非负的根，所以答案不是 $-${r}$：`,
                    ],
                [`${expr} = ${v}`],
              ],
            ],
            grouped(r, 2),
            [
              [
                -v,
                neg ? "That drops the minus sign in front of the root." : "The root sign names the root that is not negative.",
                neg ? "这是丢掉了根号前面的负号。" : "根号表示非负的根。",
              ],
              [
                Q.of(s * r * r, 2),
                "That halves the number; a square root is not half of it.",
                "这是把这个数除以 $2$；平方根不是它的一半。",
              ],
              [s * r * r, "That leaves the number without taking its root.", "这是没有开方，直接写了根号里的数。"],
            ],
          );
        },
        lineFigure(
          {
            lo: -15,
            hi: 15,
            step: 5,
            labels: [-15, -10, -5, 0, 5, 10, 15],
            marks: [
              { at: -12, text: "−12" },
              { at: 12, text: "√144 = 12", result: true },
            ],
          },
          [
            "A number line with −12 and 12 marked: both square to 144, and √144 names the one that is not negative, 12.",
            "数轴上标出 −12 和 12：它们的平方都是 144，而 √144 指的是非负的那个，即 12。",
          ],
        ),
      ),
      lesson(
        "square-roots-of-fractions-and-decimals",
        ["Fractions and decimals", "分数和小数"],
        [
          [
            "Take the root of the numerator and of the denominator: $\\sqrt{\\frac{49}{64}} = \\frac{7}{8}$. For a decimal, the square of a number with one decimal place has two, so $\\sqrt{0.09} = 0.3$.",
            "分子、分母分别开平方：$\\sqrt{\\frac{49}{64}} = \\frac{7}{8}$。对于小数，一位小数的平方有两位小数，所以 $\\sqrt{0.09} = 0.3$。",
          ],
          [
            "Write the decimal as a fraction: $0.09 = \\frac{9}{100}$, and $\\sqrt{\\frac{9}{100}} = \\frac{3}{10} = 0.3$.",
            "把小数写成分数：$0.09 = \\frac{9}{100}$，$\\sqrt{\\frac{9}{100}} = \\frac{3}{10} = 0.3$。",
          ],
          ["$\\sqrt{0.09}$ is not $0.03$: $0.03^{2} = 0.0009$.", "$\\sqrt{0.09}$ 不是 $0.03$：$0.03^{2} = 0.0009$。"],
        ],
        (rng) => {
          if (rng.bool()) {
            const r = reduced(rng, 12, 15);
            const sq = r.mul(r);
            const [p, q] = [Number(r.n), Number(r.d)];
            return valued(
              [`Evaluate $\\sqrt{${num(sq)}}$.`, `计算 $\\sqrt{${num(sq)}}$。`],
              r,
              [
                [
                  ["Split the root", "拆开根号"],
                  ["Take the root of the numerator and of the denominator:", "分子、分母分别开平方："],
                  [`\\sqrt{${num(sq)}} = \\frac{\\sqrt{${p * p}}}{\\sqrt{${q * q}}}`],
                ],
                [
                  ["Take each root", "分别开方"],
                  [`$${p}^{2} = ${p * p}$ and $${q}^{2} = ${q * q}$:`, `$${p}^{2} = ${p * p}$，$${q}^{2} = ${q * q}$：`],
                  [`\\frac{\\sqrt{${p * p}}}{\\sqrt{${q * q}}} = ${num(r)}`],
                ],
              ],
              [
                `Square the answer, and the number under the root returns: $${power(r, 2)} = ${num(sq)}$.`,
                `把答案平方，又得到根号里的数：$${power(r, 2)} = ${num(sq)}$。`,
              ],
              [
                [Q.of(p * p, 2 * q * q), "That halves the numerator instead of taking roots.", "这是把分子除以 $2$，而不是开方。"],
                [Q.of(p, q * q), "That takes the root of the numerator only.", "这是只给分子开了方。"],
                [sq, "That leaves the fraction without taking its root.", "这是没有开方，直接写了根号里的分数。"],
              ],
            );
          }
          for (;;) {
            const r = rng.bool() ? Q.of(rng.int(1, 12), 10) : Q.of(rng.int(11, 25), 100);
            if (r.isInteger()) continue;
            const sq = r.mul(r);
            const d = dec(r).split(".")[1]!.length;
            const top = Number(r.mul(Q.of(10 ** d)).n);
            return valued(
              [`Evaluate $\\sqrt{${dec(sq)}}$.`, `计算 $\\sqrt{${dec(sq)}}$。`],
              r,
              [
                [
                  ["Count the decimal places", "数小数位数"],
                  [
                    `$${dec(sq)}$ has $${2 * d}$ decimal places, so its root has $${d}$.`,
                    `$${dec(sq)}$ 有 $${2 * d}$ 位小数，所以它的平方根有 $${d}$ 位小数。`,
                  ],
                ],
                [
                  ["Take the root", "开平方"],
                  [`$${top}^{2} = ${top * top}$, so:`, `$${top}^{2} = ${top * top}$，所以：`],
                  [`\\sqrt{${dec(sq)}} = ${dec(r)}`],
                ],
              ],
              [
                `Write it as a fraction: $${dec(sq)} = \\frac{${top * top}}{${10 ** (2 * d)}}$, and its root is $\\frac{${top}}{${10 ** d}} = ${dec(r)}$.`,
                `写成分数：$${dec(sq)} = \\frac{${top * top}}{${10 ** (2 * d)}}$，它的平方根是 $\\frac{${top}}{${10 ** d}} = ${dec(r)}$。`,
              ],
              [
                [
                  r.div(Q.of(10)),
                  "That gives the root too many decimal places; it has half as many as the number.",
                  "这是平方根的小数位数太多了；它只有原数的一半。",
                ],
                [r.mul(Q.of(10)), "That gives the root too few decimal places.", "这是平方根的小数位数太少了。"],
                [sq.div(Q.of(2)), "That halves the number instead of taking its root.", "这是把这个数除以 $2$，而不是开方。"],
              ],
              { form: "decimal" },
            );
          }
        },
        lineFigure(
          {
            lo: 0,
            hi: 1,
            step: 0.1,
            labels: [0, 0.5, 1],
            marks: [
              { at: 0.09, text: "0.09" },
              { at: 0.3, text: "√0.09 = 0.3", result: true },
            ],
          },
          [
            "A number line from 0 to 1 with 0.09 and 0.3 marked: the root of a number between 0 and 1 is larger than the number.",
            "一条从 0 到 1 的数轴，标出 0.09 和 0.3：0 和 1 之间的数，平方根比它本身大。",
          ],
        ),
      ),
    ],
  ),
  [
    "A square tile covers $144$ cm². To cut a matching edge, we need the side length, the number whose square is $144$.",
    "一块正方形瓷砖的面积是 $144$ 平方厘米。要配一条边，就要知道边长，也就是平方等于 $144$ 的数。",
  ],
  ["$12 \\times 12 = 144$, so the side is $12$ cm.", "$12 \\times 12 = 144$，所以边长是 $12$ 厘米。"],
  ["find square roots of perfect squares, including fractions and decimals.", "求完全平方数的平方根，包括分数和小数。"],
);

/** squaringASquareRoot squares square roots and multiples of them. */
export const squaringASquareRoot = withIntro(
  topic(
    "squaring-a-square-root",
    t("Squaring a Square Root", "平方根的平方"),
    t(
      "Because √a is the nonnegative number whose square is a, (√a)² = √a · √a = a for every a ≥ 0, even when √a is irrational. A number in front squares too: (c√a)² = c² · a.",
      "因为 √a 是平方等于 a 的非负数，所以对任意 a ≥ 0，(√a)² = √a · √a = a，即使 √a 是无理数也成立。前面的系数也要平方：(c√a)² = c² · a。",
    ),
    ["the-square-root-of-a-perfect-square"],
    ["8.EE.A.2"],
    [
      lesson(
        "squaring-a-root",
        ["Squaring a root", "根式的平方"],
        [
          [
            "$\\sqrt{7}$ is the number whose square is $7$, so $\\left(\\sqrt{7}\\right)^{2} = 7$ and $\\sqrt{7} \\cdot \\sqrt{7} = 7$. There is no need to find $\\sqrt{7}$ first.",
            "$\\sqrt{7}$ 就是平方等于 $7$ 的数，所以 $\\left(\\sqrt{7}\\right)^{2} = 7$，$\\sqrt{7} \\cdot \\sqrt{7} = 7$。不需要先求出 $\\sqrt{7}$。",
          ],
          [
            "Estimate: $\\sqrt{7}$ is between $2$ and $3$, so its square is between $4$ and $9$, and $7$ is.",
            "估一估：$\\sqrt{7}$ 在 $2$ 和 $3$ 之间，所以它的平方在 $4$ 和 $9$ 之间，$7$ 正是如此。",
          ],
          ["The answer is not $7^{2} = 49$; only the root is squared.", "答案不是 $7^{2} = 49$；被平方的只是根式。"],
        ],
        (rng) => {
          const m = rng.pick([...squareFree, 8, 12, 18, 20, 24, 30, 40, 50]);
          const expr = rng.bool() ? `\\left(\\sqrt{${m}}\\right)^{2}` : `\\sqrt{${m}} \\cdot \\sqrt{${m}}`;
          const lo = Math.floor(Math.sqrt(m));
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            m,
            [
              [
                ["Use what the root means", "用根号的意义"],
                [`$\\sqrt{${m}}$ is the number whose square is $${m}$.`, `$\\sqrt{${m}}$ 是平方等于 $${m}$ 的数。`],
              ],
              [
                ["Square it", "平方"],
                ["So squaring it gives back the number under the root:", "所以把它平方，就得到根号里的数："],
                [`${expr} = ${m}`],
              ],
            ],
            [
              `Use a decimal: $\\sqrt{${m}} \\approx ${Math.sqrt(m).toFixed(3)}$, and $${Math.sqrt(m).toFixed(3)}^{2} \\approx ${(Number(Math.sqrt(m).toFixed(3)) ** 2).toFixed(2)}$, which rounds to $${m}$.`,
              `用小数验证：$\\sqrt{${m}} \\approx ${Math.sqrt(m).toFixed(3)}$，$${Math.sqrt(m).toFixed(3)}^{2} \\approx ${(Number(Math.sqrt(m).toFixed(3)) ** 2).toFixed(2)}$，四舍五入正是 $${m}$。`,
            ],
            [
              [m * m, "That squares the number under the root as well.", "这是把根号里的数也平方了。"],
              [2 * m, "That doubles the number instead of squaring the root.", "这是把数乘 $2$，而不是把根式平方。"],
              [lo, "That is about the root itself, not its square.", "这大约是根式本身，而不是它的平方。"],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "(√7)² = 7",
              pieces: [
                { size: 2.6, text: "√7" },
                { size: 2.6, text: "√7", lit: true },
              ],
            },
          ],
          [
            "Two equal pieces, each √7 long, multiplied together give 7, since √7 is the number whose square is 7.",
            "两段一样长的 √7 相乘得 7，因为 √7 就是平方等于 7 的数。",
          ],
        ),
      ),
      lesson(
        "squaring-a-multiple-of-a-root",
        ["Coefficients and signs", "系数与符号"],
        [
          [
            "Square the number in front as well as the root: $\\left(3\\sqrt{5}\\right)^{2} = 3^{2} \\cdot \\left(\\sqrt{5}\\right)^{2} = 9 \\cdot 5 = 45$. A minus sign inside the parentheses is squared, but one outside is not: $\\left(-\\sqrt{5}\\right)^{2} = 5$ while $-\\left(\\sqrt{5}\\right)^{2} = -5$.",
            "前面的系数和根式都要平方：$\\left(3\\sqrt{5}\\right)^{2} = 3^{2} \\cdot \\left(\\sqrt{5}\\right)^{2} = 9 \\cdot 5 = 45$。括号内的负号要参与平方，括号外的则不参与：$\\left(-\\sqrt{5}\\right)^{2} = 5$，而 $-\\left(\\sqrt{5}\\right)^{2} = -5$。",
          ],
          [
            "Bring the $3$ under the root: $3\\sqrt{5} = \\sqrt{9 \\cdot 5} = \\sqrt{45}$, and squaring a root leaves $45$.",
            "把 $3$ 移到根号里：$3\\sqrt{5} = \\sqrt{9 \\cdot 5} = \\sqrt{45}$，根式平方后就是 $45$。",
          ],
          [
            "$\\left(3\\sqrt{5}\\right)^{2}$ is not $3 \\cdot 5 = 15$; the $3$ is squared too.",
            "$\\left(3\\sqrt{5}\\right)^{2}$ 不是 $3 \\cdot 5 = 15$；$3$ 也要平方。",
          ],
        ],
        (rng) => {
          const m = rng.pick(squareFree);
          const kind = rng.pick(["coefficient", "coefficient", "inside", "outside"] as const);
          if (kind === "coefficient") {
            const c = rng.pick([2, 3, 4, 5, 6, 10, -2, -3, -4]);
            const expr = `\\left(${c}\\sqrt{${m}}\\right)^{2}`;
            const v = c * c * m;
            const ac = Math.abs(c);
            return valued(
              [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
              v,
              [
                [
                  ["Square each factor", "每个因数都平方"],
                  ["The coefficient and the root are both squared:", "系数和根式都要平方："],
                  [`${expr} = ${paren(c)}^{2} \\cdot \\left(\\sqrt{${m}}\\right)^{2}`],
                ],
                [
                  ["Multiply", "相乘"],
                  [
                    `$${paren(c)}^{2} = ${c * c}$ and $\\left(\\sqrt{${m}}\\right)^{2} = ${m}$:`,
                    `$${paren(c)}^{2} = ${c * c}$，$\\left(\\sqrt{${m}}\\right)^{2} = ${m}$：`,
                  ],
                  [`${c * c} \\cdot ${m} = ${v}`],
                ],
              ],
              [
                `Bring $${ac}$ under the root: $${ac}\\sqrt{${m}} = \\sqrt{${ac * ac} \\cdot ${m}} = \\sqrt{${v}}$.${c < 0 ? " The minus sign disappears when squared." : ""} Squaring a root leaves the number under it, $${v}$.`,
                `把 $${ac}$ 移到根号里：$${ac}\\sqrt{${m}} = \\sqrt{${ac * ac} \\cdot ${m}} = \\sqrt{${v}}$。${c < 0 ? "负号平方后消失。" : ""}根式平方后就是根号里的数 $${v}$。`,
              ],
              [
                [c * m, "That squares the root but not the coefficient.", "这是只把根式平方了，系数没有平方。"],
                [c * c * m * m, "That squares the number under the root as well.", "这是把根号里的数也平方了。"],
                [-v, "A square of a nonzero number is positive.", "非零数的平方是正数。"],
                [2 * c * m, "That doubles the coefficient instead of squaring it.", "这是把系数乘 $2$，而不是平方。"],
              ],
            );
          }
          const inside = kind === "inside";
          const expr = inside ? `\\left(-\\sqrt{${m}}\\right)^{2}` : `-\\left(\\sqrt{${m}}\\right)^{2}`;
          const v = inside ? m : -m;
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            v,
            [
              [
                ["Find what is squared", "看清平方的是什么"],
                inside
                  ? ["The minus sign is inside the parentheses, so it is squared with the root.", "负号在括号里，要和根式一起平方。"]
                  : [
                      `Only $\\sqrt{${m}}$ is inside the parentheses; the minus sign waits outside.`,
                      `括号里只有 $\\sqrt{${m}}$；负号在括号外面。`,
                    ],
              ],
              [
                ["Square", "平方"],
                inside
                  ? ["A negative number squared is positive:", "负数的平方是正数："]
                  : ["Square the root, then apply the sign:", "先把根式平方，再加上负号："],
                [`${expr} = ${v}`],
              ],
            ],
            inside
              ? [
                  `Multiply it out: $\\left(-\\sqrt{${m}}\\right) \\cdot \\left(-\\sqrt{${m}}\\right)$ is a negative times a negative, so it is positive, and its size is $\\sqrt{${m}} \\cdot \\sqrt{${m}} = ${m}$.`,
                  `乘出来：$\\left(-\\sqrt{${m}}\\right) \\cdot \\left(-\\sqrt{${m}}\\right)$ 是负数乘负数，结果为正，大小是 $\\sqrt{${m}} \\cdot \\sqrt{${m}} = ${m}$。`,
                ]
              : [
                  `Use the order of operations: the power comes before the minus sign, so first $\\left(\\sqrt{${m}}\\right)^{2} = ${m}$, and the sign then gives $-${m}$.`,
                  `按运算顺序：先乘方，再取负号，所以先算 $\\left(\\sqrt{${m}}\\right)^{2} = ${m}$，再加负号得 $-${m}$。`,
                ],
            [
              [
                -v,
                inside
                  ? "The minus sign inside is squared, so the result is positive."
                  : "The minus sign is outside the power, so it stays.",
                inside ? "括号里的负号也被平方了，所以结果是正数。" : "负号在乘方外面，所以要保留。",
              ],
              [inside ? m * m : -m * m, "That squares the number under the root as well.", "这是把根号里的数也平方了。"],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "(3√5)² = 45",
              pieces: [
                { size: 1, text: "3²", lit: true },
                { size: 1, text: "(√5)²" },
              ],
            },
            {
              total: "9 · 5 = 45",
              pieces: [
                { size: 1, text: "9", lit: true },
                { size: 1, text: "5" },
              ],
            },
          ],
          [
            "Two bars: 3² times (√5)², then 9 times 5, both making 45; the coefficient is squared too.",
            "两个长条：3² 乘 (√5)²，再是 9 乘 5，结果都是 45；系数也要平方。",
          ],
        ),
      ),
    ],
  ),
  [
    "A square has a side of $\\sqrt{7}$ cm. Its area is the side times itself, even though $\\sqrt{7}$ never ends as a decimal.",
    "一个正方形的边长是 $\\sqrt{7}$ 厘米。它的面积是边长乘边长，尽管 $\\sqrt{7}$ 写成小数永远写不完。",
  ],
  [
    "$\\sqrt{7} \\approx 2.65$ and $2.65^{2} \\approx 7.02$, close to $7$.",
    "$\\sqrt{7} \\approx 2.65$，$2.65^{2} \\approx 7.02$，接近 $7$。",
  ],
  ["square square roots and multiples of them, minding coefficients and signs.", "求平方根及其倍数的平方，注意系数和符号。"],
);

/** theCubeRootOfAPerfectCube evaluates cube roots of perfect cubes. */
export const theCubeRootOfAPerfectCube = withIntro(
  topic(
    "the-cube-root-of-a-perfect-cube",
    t("The Cube Root of a Perfect Cube", "完全立方数的立方根"),
    t(
      "The cube root ∛a is the number whose cube is a. Every number has exactly one real cube root, and the cube root of a negative number is negative: ∛(−8) = −2. Fractions and decimals that are perfect cubes have cube roots that are fractions and decimals.",
      "立方根 ∛a 是立方等于 a 的数。每个数都恰好有一个实数立方根，负数的立方根是负数：∛(−8) = −2。是完全立方数的分数和小数，其立方根也是分数和小数。",
    ),
    ["the-square-root-of-a-perfect-square"],
    ["8.EE.A.2"],
    [
      lesson(
        "cube-roots-of-integers",
        ["Integers", "整数"],
        [
          [
            "$\\sqrt[3]{125} = 5$ because $5^{3} = 125$, and $\\sqrt[3]{-125} = -5$ because $(-5)^{3} = -125$. A sign in front of the root applies afterward: $-\\sqrt[3]{125} = -5$ as well.",
            "$\\sqrt[3]{125} = 5$，因为 $5^{3} = 125$；$\\sqrt[3]{-125} = -5$，因为 $(-5)^{3} = -125$。根号前面的负号在开方之后再加上：$-\\sqrt[3]{125}$ 也等于 $-5$。",
          ],
          [
            "Group the prime factors in threes: $216 = 2^{3} \\cdot 3^{3}$, and one from each group gives $2 \\cdot 3 = 6$.",
            "把质因数三个一组：$216 = 2^{3} \\cdot 3^{3}$，每组取一个，得 $2 \\cdot 3 = 6$。",
          ],
          [
            "A cube root is not a third of the number: $\\sqrt[3]{216} = 6$, not $72$.",
            "立方根不是这个数的三分之一：$\\sqrt[3]{216} = 6$，而不是 $72$。",
          ],
        ],
        (rng) => {
          const r = rng.int(2, 12) * (rng.bool(0.4) ? -1 : 1);
          const cube = r ** 3;
          const outside = rng.bool(0.25);
          const v = outside ? -r : r;
          const expr = `${outside ? "-" : ""}\\sqrt[3]{${cube}}`;
          const R = Math.abs(r);
          const [ge, gz] = grouped(R, 3);
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            v,
            [
              [
                ["Find the root", "找出立方根"],
                [`$${cubed(r)} = ${cube}$, so $\\sqrt[3]{${cube}} = ${r}$.`, `$${cubed(r)} = ${cube}$，所以 $\\sqrt[3]{${cube}} = ${r}$。`],
              ],
              [
                ["Apply the sign", "处理符号"],
                outside
                  ? ["The minus sign in front applies after the root:", "根号前的负号在开方之后再加上："]
                  : r < 0
                    ? [
                        "A negative number has a negative cube root, since three negative factors make a negative product:",
                        "负数的立方根是负数，因为三个负因数的积是负数：",
                      ]
                    : ["A positive number has a positive cube root:", "正数的立方根是正数："],
                [`${expr} = ${v}`],
              ],
            ],
            v > 0 ? [ge, gz] : [`${ge} The sign then makes it $${v}$.`, `${gz}再加上负号，得 $${v}$。`],
            [
              [
                -v,
                outside
                  ? "That loses a sign: the root and the minus sign in front each count."
                  : r < 0
                    ? "The cube root of a negative number is negative."
                    : "The cube root of a positive number is positive.",
                outside
                  ? "这是弄丢了一个符号：根号里的符号和根号前的负号都要算。"
                  : r < 0
                    ? "负数的立方根是负数。"
                    : "正数的立方根是正数。",
              ],
              [
                Q.of(outside ? -cube : cube, 3),
                "That divides by $3$; a cube root is not a third of the number.",
                "这是除以 $3$；立方根不是这个数的三分之一。",
              ],
              [outside ? -cube : cube, "That leaves the number without taking its root.", "这是没有开方，直接写了根号里的数。"],
            ],
          );
        },
        lineFigure(
          {
            lo: -3,
            hi: 3,
            step: 1,
            labels: [-3, -2, -1, 0, 1, 2, 3],
            marks: [
              { at: -2, text: "∛(−8)" },
              { at: 2, text: "∛8", result: true },
            ],
          },
          [
            "A number line with ∛(−8) = −2 and ∛8 = 2 marked: each number has one cube root, with the same sign as the number.",
            "数轴上标出 ∛(−8) = −2 和 ∛8 = 2：每个数只有一个立方根，符号与这个数相同。",
          ],
        ),
      ),
      lesson(
        "cube-roots-of-fractions-and-decimals",
        ["Fractions and decimals", "分数和小数"],
        [
          [
            "Take the cube root of the numerator and of the denominator: $\\sqrt[3]{\\frac{8}{27}} = \\frac{2}{3}$. The cube of a number with one decimal place has three decimal places, so $\\sqrt[3]{0.064} = 0.4$.",
            "分子、分母分别开立方：$\\sqrt[3]{\\frac{8}{27}} = \\frac{2}{3}$。一位小数的立方有三位小数，所以 $\\sqrt[3]{0.064} = 0.4$。",
          ],
          [
            "Write the decimal as a fraction: $0.064 = \\frac{64}{1000}$, and $\\sqrt[3]{\\frac{64}{1000}} = \\frac{4}{10} = 0.4$.",
            "把小数写成分数：$0.064 = \\frac{64}{1000}$，$\\sqrt[3]{\\frac{64}{1000}} = \\frac{4}{10} = 0.4$。",
          ],
          ["$\\sqrt[3]{0.064}$ is not $0.04$: $0.04^{3} = 0.000064$.", "$\\sqrt[3]{0.064}$ 不是 $0.04$：$0.04^{3} = 0.000064$。"],
        ],
        (rng) => {
          const s = rng.bool(0.3) ? -1 : 1;
          if (rng.bool()) {
            const r = reduced(rng, 5, 6).mul(Q.of(s));
            const cube = r.pow(3);
            const [p, q] = [Math.abs(Number(r.n)), Number(r.d)];
            const sign = s < 0 ? "-" : "";
            return valued(
              [`Evaluate $\\sqrt[3]{${num(cube)}}$.`, `计算 $\\sqrt[3]{${num(cube)}}$。`],
              r,
              [
                [
                  ["Split the root", "拆开根号"],
                  [
                    s < 0
                      ? "The number is negative, so its cube root is negative. Take the cube root of the top and of the bottom:"
                      : "Take the cube root of the numerator and of the denominator:",
                    s < 0 ? "这个数是负数，所以它的立方根是负数。分子、分母分别开立方：" : "分子、分母分别开立方：",
                  ],
                  [`\\sqrt[3]{${num(cube)}} = ${sign}\\frac{\\sqrt[3]{${p ** 3}}}{\\sqrt[3]{${q ** 3}}}`],
                ],
                [
                  ["Take each root", "分别开方"],
                  [`$${p}^{3} = ${p ** 3}$ and $${q}^{3} = ${q ** 3}$:`, `$${p}^{3} = ${p ** 3}$，$${q}^{3} = ${q ** 3}$：`],
                  [`${sign}\\frac{\\sqrt[3]{${p ** 3}}}{\\sqrt[3]{${q ** 3}}} = ${num(r)}`],
                ],
              ],
              [
                `Cube the answer, and the number under the root returns: $${power(r, 3)} = ${num(cube)}$.`,
                `把答案立方，又得到根号里的数：$${power(r, 3)} = ${num(cube)}$。`,
              ],
              [
                [
                  r.neg(),
                  s < 0 ? "The cube root of a negative number is negative." : "The cube root of a positive number is positive.",
                  s < 0 ? "负数的立方根是负数。" : "正数的立方根是正数。",
                ],
                [Q.of(s * p ** 3, 3 * q ** 3), "That divides by $3$ instead of taking the cube root.", "这是除以 $3$，而不是开立方。"],
                [cube, "That leaves the fraction without taking its root.", "这是没有开方，直接写了根号里的分数。"],
              ],
            );
          }
          const k = rng.int(1, 9);
          const r = Q.of(s * k, 10);
          const cube = r.pow(3);
          return valued(
            [`Evaluate $\\sqrt[3]{${dec(cube)}}$.`, `计算 $\\sqrt[3]{${dec(cube)}}$。`],
            r,
            [
              [
                ["Count the decimal places", "数小数位数"],
                [
                  `$${dec(cube)}$ has $3$ decimal places, so its cube root has $1$.`,
                  `$${dec(cube)}$ 有 $3$ 位小数，所以它的立方根有 $1$ 位小数。`,
                ],
              ],
              [
                ["Take the root", "开立方"],
                [`$${cubed(s * k)} = ${s * k ** 3}$, so:`, `$${cubed(s * k)} = ${s * k ** 3}$，所以：`],
                [`\\sqrt[3]{${dec(cube)}} = ${dec(r)}`],
              ],
            ],
            [
              `Write it as a fraction: $${dec(cube)} = \\frac{${s * k ** 3}}{1000}$, and since $\\sqrt[3]{1000} = 10$, the root is $\\frac{${s * k}}{10} = ${dec(r)}$.`,
              `写成分数：$${dec(cube)} = \\frac{${s * k ** 3}}{1000}$，而 $\\sqrt[3]{1000} = 10$，所以立方根是 $\\frac{${s * k}}{10} = ${dec(r)}$。`,
            ],
            [
              [
                r.div(Q.of(10)),
                "That gives the root too many decimal places; it has a third as many as the number.",
                "这是立方根的小数位数太多了；它只有原数的三分之一。",
              ],
              [r.mul(Q.of(10)), "That gives the root too few decimal places.", "这是立方根的小数位数太少了。"],
              [
                r.neg(),
                s < 0 ? "The cube root of a negative number is negative." : "The cube root of a positive number is positive.",
                s < 0 ? "负数的立方根是负数。" : "正数的立方根是正数。",
              ],
            ],
            { form: "decimal" },
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 0.5,
            step: 0.1,
            labels: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
            marks: [
              { at: 0.064, text: "0.064" },
              { at: 0.4, text: "∛0.064 = 0.4", result: true },
            ],
          },
          [
            "A number line from 0 to 0.5 with 0.064 and 0.4 marked: the cube root of a number between 0 and 1 is larger than the number.",
            "一条从 0 到 0.5 的数轴，标出 0.064 和 0.4：0 和 1 之间的数，立方根比它本身大。",
          ],
        ),
      ),
    ],
  ),
  [
    "A box shaped like a cube holds $125$ cm³. Its edge is the number whose cube is $125$.",
    "一个正方体盒子的容积是 $125$ 立方厘米。它的棱长就是立方等于 $125$ 的数。",
  ],
  ["$5 \\times 5 \\times 5 = 125$, so the edge is $5$ cm.", "$5 \\times 5 \\times 5 = 125$，所以棱长是 $5$ 厘米。"],
  ["find cube roots of perfect cubes, including negative numbers, fractions and decimals.", "求完全立方数的立方根，包括负数、分数和小数。"],
);

/** RootChoice is a root written in LaTeX with its value when the value is rational. */
interface RootChoice {
  readonly latex: string;
  readonly value?: string;
}

/** rationalRoots are roots that look irrational at first sight but have rational values. */
const rationalRoots: readonly RootChoice[] = [
  { latex: "\\sqrt{0.25}", value: "0.5" },
  { latex: "\\sqrt{0.04}", value: "0.2" },
  { latex: "\\sqrt[3]{-8}", value: "-2" },
  { latex: "\\sqrt[3]{0.001}", value: "0.1" },
  { latex: "\\sqrt{\\frac{50}{2}}", value: "5" },
  { latex: "\\sqrt{\\frac{16}{9}}", value: "\\frac{4}{3}" },
  { latex: "\\sqrt[3]{\\frac{1}{27}}", value: "\\frac{1}{3}" },
  { latex: "\\sqrt{196}", value: "14" },
  { latex: "\\sqrt[3]{216}", value: "6" },
  { latex: "\\sqrt{\\frac{27}{3}}", value: "3" },
  { latex: "\\sqrt[3]{-125}", value: "-5" },
  { latex: "\\sqrt{1.44}", value: "1.2" },
];

/** surdRoots are roots with irrational values, several of them perfect powers of the wrong kind. */
const surdRoots: readonly RootChoice[] = [
  { latex: "\\sqrt{0.4}" },
  { latex: "\\sqrt[3]{9}" },
  { latex: "\\sqrt[3]{16}" },
  { latex: "\\sqrt{\\frac{4}{5}}" },
  { latex: "\\sqrt{27}" },
  { latex: "\\sqrt{8}" },
  { latex: "\\sqrt[3]{36}" },
  { latex: "\\sqrt{0.9}" },
  { latex: "\\sqrt[3]{-4}" },
];

/** surds identifies roots whose values are irrational and makes a root rational with the smallest factor. */
export const surds = withIntro(
  topic(
    "surds",
    t("Surds", "不尽根数"),
    t(
      "A surd is a root whose value is irrational, such as √2 or ∛10. Roots that simplify to rational numbers, such as √0.25 = 0.5 or ∛(−8) = −2, are not surds. A square root of a whole number is a surd exactly when some prime appears in the number an odd number of times.",
      "值为无理数的根式叫作不尽根数，例如 √2 或 ∛10。能化为有理数的根式，例如 √0.25 = 0.5 或 ∛(−8) = −2，不是不尽根数。一个整数的平方根是不尽根数，当且仅当这个整数中有某个质因数出现奇数次。",
    ),
    ["the-cube-root-of-a-perfect-cube", "classifying-square-roots-and-cube-roots-as-rational-or-irrational"],
    ["8.NS.A.1", "8.EE.A.2"],
    [
      lesson(
        "identifying-surds",
        ["Identifying surds", "识别不尽根数"],
        [
          [
            "A **surd** is a root whose value is irrational, like $\\sqrt{2}$ or $\\sqrt[3]{10}$. To test a root, simplify the number under it. Then ask whether it is a perfect square, or a perfect cube for a cube root. $\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ is not a surd, but $\\sqrt{0.4} = \\sqrt{\\frac{2}{5}}$ is.",
            "值为无理数的根式叫作**不尽根数**，例如 $\\sqrt{2}$ 或 $\\sqrt[3]{10}$。判断时，先化简根号里的数，再看它是不是完全平方数；立方根就看是不是完全立方数。$\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ 不是不尽根数，而 $\\sqrt{0.4} = \\sqrt{\\frac{2}{5}}$ 是。",
          ],
          ["$5^{2} = 25$, but no fraction squared gives $\\frac{2}{5}$.", "$5^{2} = 25$，但没有哪个分数的平方等于 $\\frac{2}{5}$。"],
          [
            "Match the test to the root. $16$ is a perfect square, but $\\sqrt[3]{16}$ is still a surd.",
            "判断要看根指数。$16$ 是完全平方数，但 $\\sqrt[3]{16}$ 仍是不尽根数。",
          ],
        ],
        (rng) => {
          const surd = rng.pick(surdRoots);
          const others = rng.sample(rationalRoots, 3);
          const cube = surd.latex.includes("[3]");
          return chosenMath(
            rng,
            ["Which of these is a surd?", "下面哪一个是不尽根数？"],
            surd.latex,
            others.map(
              (r) => [r.latex, `That one is rational: $${r.latex} = ${r.value}$.`, `它是有理数：$${r.latex} = ${r.value}$。`] as const,
            ),
            [
              [
                ["Simplify each root", "化简每个根式"],
                ["Three of them come out exact:", "其中三个能开尽："],
                others.map((r) => `${r.latex} = ${r.value}`),
              ],
              [
                ["Find the surd", "找出不尽根数"],
                [
                  `The number under $${surd.latex}$ is not a perfect ${cube ? "cube" : "square"} of a rational number, so it is a surd.`,
                  `$${surd.latex}$ 根号里的数不是有理数的${cube ? "立方" : "平方"}，所以它是不尽根数。`,
                ],
              ],
            ],
            [
              "Raise each exact value to the root's power and you get back the number under its root. No rational number does that for the surd.",
              "把每个开尽的值按根指数乘方，都能得回根号里的数。没有哪个有理数能对不尽根数做到这一点。",
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 3,
            step: 0.5,
            labels: [0, 1, 2, 3],
            marks: [
              { at: Math.SQRT2, text: "√2", result: true },
              { at: 2, text: "√4" },
            ],
          },
          [
            "A number line from 0 to 3: √4 lands on the whole number 2, while √2 falls between 1 and 2.",
            "一条从 0 到 3 的数轴：√4 正好落在整数 2 上，而 √2 落在 1 和 2 之间。",
          ],
        ),
      ),
      lesson(
        "making-a-square-root-rational",
        ["Making a square root rational", "使平方根成为有理数"],
        [
          [
            "$\\sqrt{12}$ is a surd because $12 = 2^{2} \\cdot 3$ has the prime $3$ only once. Multiply $12$ by $3$ and you get $36 = 6^{2}$. So the smallest whole number $k$ that makes $\\sqrt{12k}$ rational is $3$.",
            "$\\sqrt{12}$ 是不尽根数，因为 $12 = 2^{2} \\cdot 3$ 中质因数 $3$ 只出现一次。$12$ 乘以 $3$ 得 $36 = 6^{2}$。所以使 $\\sqrt{12k}$ 为有理数的最小正整数 $k$ 是 $3$。",
          ],
          ["$\\sqrt{12 \\cdot 3} = \\sqrt{36} = 6$.", "$\\sqrt{12 \\cdot 3} = \\sqrt{36} = 6$。"],
          [
            "Multiplying by $12$ also works, but it is not the smallest. Use only the primes that have no partner.",
            "乘以 $12$ 也可以，但不是最小的。只补上没有配对的质因数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const m = rng.pick([2, 3, 5, 6, 7, 10, 11, 14, 15]);
            const s = rng.pick([1, 2, 3, 4, 5, 6]);
            const n = s * s * m;
            if (n === m && rng.bool(0.7)) continue;
            return valued(
              [
                `What is the smallest positive whole number $k$ for which $\\sqrt{${n}k}$ is rational?`,
                `使 $\\sqrt{${n}k}$ 为有理数的最小正整数 $k$ 是多少？`,
              ],
              m,
              [
                [
                  ["Split off the squares", "分出平方因数"],
                  s > 1
                    ? [
                        `$${n} = ${s * s} \\cdot ${m}$, and $${s * s} = ${s}^{2}$ is already a perfect square.`,
                        `$${n} = ${s * s} \\cdot ${m}$，而 $${s * s} = ${s}^{2}$ 已经是完全平方数。`,
                      ]
                    : [`$${n}$ has no square factor at all.`, `$${n}$ 没有平方因数。`],
                ],
                [
                  ["Pair the rest", "给其余的配对"],
                  [
                    `$${m}$ has no square factor, so it needs one more $${m}$. Take $k = ${m}$:`,
                    `$${m}$ 没有平方因数，还需要再乘一个 $${m}$。取 $k = ${m}$：`,
                  ],
                  [`\\sqrt{${n} \\cdot ${m}} = \\sqrt{${n * m}} = ${s * m}`],
                ],
              ],
              [`Square the root back: $${s * m} \\cdot ${s * m} = ${n * m}$.`, `把结果平方回去：$${s * m} \\cdot ${s * m} = ${n * m}$。`],
              [
                [n, "That works, but it is not the smallest choice.", "这样也可以，但不是最小的。"],
                ...(s > 1
                  ? [
                      [
                        s * s,
                        "That is the square factor; it is already paired and does not help.",
                        "这是平方因数；它已经配好对，乘它没有用。",
                      ] as const,
                    ]
                  : []),
                [2, "That doubles the number, which does not pair every prime.", "这是乘以 $2$，并不能让每个质因数都配对。"],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "36 = 6²",
              pieces: [
                { size: 2, text: "2" },
                { size: 2, text: "2" },
                { size: 3, text: "3" },
                { size: 3, text: "3", lit: true },
              ],
            },
          ],
          [
            "A bar of the factors of 12 · 3: 2, 2, 3 and a shaded extra 3. Every prime now has a partner, so the product 36 is 6².",
            "一个表示 12 · 3 各因数的长条：2、2、3，以及涂色的另一个 3。每个质因数都配了对，所以乘积 36 是 6²。",
          ],
        ),
      ),
    ],
  ),
  [
    "Mia draws a square with an area of $4$ cm². Its side is $\\sqrt{4} = 2$ cm. Then she draws one with an area of $2$ cm². Its side is $\\sqrt{2}$ cm, and no fraction is exactly that long.",
    "小米画了一个面积为 $4$ 平方厘米的正方形，边长是 $\\sqrt{4} = 2$ 厘米。她又画了一个面积为 $2$ 平方厘米的正方形，边长是 $\\sqrt{2}$ 厘米，没有哪个分数正好这么长。",
  ],
  [
    "$1.4^{2} = 1.96$ and $1.5^{2} = 2.25$, so $\\sqrt{2}$ is between $1.4$ and $1.5$.",
    "$1.4^{2} = 1.96$，$1.5^{2} = 2.25$，所以 $\\sqrt{2}$ 在 $1.4$ 和 $1.5$ 之间。",
  ],
  ["tell surds from roots that come out exact, and make a square root rational.", "区分不尽根数和能开尽的根式，并使平方根成为有理数。"],
);

// ---------------------------------------------------------------------------
// The rules of radicals

/** nonSquareSplit draws a factorization n = d · (n/d) with neither factor a perfect square, or nothing. */
function nonSquareSplit(rng: Rng, n: number): [number, number] | undefined {
  const ds: number[] = [];
  for (let d = 2; d < n; d++) if (n % d === 0 && !isSquare(d) && !isSquare(n / d)) ds.push(d);
  if (ds.length === 0) return undefined;
  const d = rng.pick(ds);
  return [d, n / d];
}

/** theProductRuleForRadicals multiplies square roots: √a · √b = √(ab). */
export const theProductRuleForRadicals = withIntro(
  topic(
    "the-product-rule-for-radicals",
    t("The Product Rule for Radicals", "根式的乘法法则"),
    t(
      "For a, b ≥ 0, √a · √b = √(ab): the product of two square roots is the square root of the product. Two surds can multiply to a whole number, √2 · √8 = √16 = 4, and the product may need simplifying, √6 · √10 = √60 = 2√15. There is no such rule for sums: √a + √b is not √(a + b).",
      "对 a, b ≥ 0，√a · √b = √(ab)：两个平方根的积等于积的平方根。两个不尽根数的积可以是整数，√2 · √8 = √16 = 4；积也可能需要化简，√6 · √10 = √60 = 2√15。加法没有这样的法则：√a + √b 不等于 √(a + b)。",
    ),
    ["simplifying-square-roots"],
    ["8.EE.A.2", "HSN.RN.A.2"],
    [
      lesson(
        "products-that-are-whole-numbers",
        ["Products that are whole numbers", "积为整数"],
        [
          [
            "For $a, b \\ge 0$, $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$. So $\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{81} = 9$. With numbers in front, multiply them separately: $2\\sqrt{5} \\cdot 3\\sqrt{20} = 6\\sqrt{100} = 60$.",
            "对 $a, b \\ge 0$，$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$。所以 $\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{81} = 9$。根号前有系数时，系数单独相乘：$2\\sqrt{5} \\cdot 3\\sqrt{20} = 6\\sqrt{100} = 60$。",
          ],
          [
            "Simplify each root first: $\\sqrt{27} = 3\\sqrt{3}$, so $\\sqrt{3} \\cdot 3\\sqrt{3} = 3 \\cdot 3 = 9$.",
            "先化简每个根式：$\\sqrt{27} = 3\\sqrt{3}$，所以 $\\sqrt{3} \\cdot 3\\sqrt{3} = 3 \\cdot 3 = 9$。",
          ],
          [
            "Take the root at the end. Stopping at $\\sqrt{81}$ and writing $81$ forgets it.",
            "最后要开方。停在 $\\sqrt{81}$ 而写成 $81$，就是忘了开方。",
          ],
        ],
        (rng) => {
          for (;;) {
            const r = rng.pick([4, 6, 8, 9, 10, 12, 15, 18, 20]);
            const split = nonSquareSplit(rng, r * r);
            if (!split) continue;
            const [a, b] = split;
            const [c, d] = rng.bool(0.35) ? [rng.int(2, 4), rng.int(2, 5)] : [1, 1];
            const cd = c * d;
            const front = cd === 1 ? "" : `${cd}`;
            const lhs = `${c === 1 ? "" : c}\\sqrt{${a}} \\cdot ${d === 1 ? "" : d}\\sqrt{${b}}`;
            const v = cd * r;
            const [ka, m] = simplifyRadical(a);
            const [kb] = simplifyRadical(b);
            return valued(
              [`Evaluate $${lhs}$.`, `计算 $${lhs}$。`],
              v,
              [
                [
                  ["Multiply under one root", "合到一个根号下"],
                  [
                    cd === 1
                      ? "Multiply the numbers under the roots:"
                      : "Multiply the numbers in front, and multiply the numbers under the roots:",
                    cd === 1 ? "根号里的数相乘：" : "根号前的数相乘，根号里的数相乘：",
                  ],
                  [`${lhs} = ${front}\\sqrt{${a} \\cdot ${b}} = ${front}\\sqrt{${a * b}}`],
                ],
                [
                  ["Take the root", "开平方"],
                  [`$${a * b} = ${r}^{2}$, so:`, `$${a * b} = ${r}^{2}$，所以：`],
                  [`${front}\\sqrt{${a * b}} = ${cd === 1 ? r : `${cd} \\cdot ${r} = ${v}`}`],
                ],
              ],
              [
                `Simplify each root first: ${ka === 1 ? `$\\sqrt{${a}}$ is already simple` : `$\\sqrt{${a}} = ${radical(ka, m)}$`} and ${kb === 1 ? `$\\sqrt{${b}}$ is already simple` : `$\\sqrt{${b}} = ${radical(kb, m)}$`}. Then $\\sqrt{${m}} \\cdot \\sqrt{${m}} = ${m}$, and the product is $${cd * ka * kb} \\cdot ${m} = ${v}$.`,
                `先化简每个根式：${ka === 1 ? `$\\sqrt{${a}}$ 已是最简` : `$\\sqrt{${a}} = ${radical(ka, m)}$`}，${kb === 1 ? `$\\sqrt{${b}}$ 已是最简` : `$\\sqrt{${b}} = ${radical(kb, m)}$`}。于是 $\\sqrt{${m}} \\cdot \\sqrt{${m}} = ${m}$，积是 $${cd * ka * kb} \\cdot ${m} = ${v}$。`,
              ],
              [
                [cd * a * b, "That multiplies under the root but forgets to take the root.", "这是根号里的数相乘了，却忘了开方。"],
                ...(cd === 1 ? [] : ([[r, "That leaves out the numbers in front of the roots.", "这是漏掉了根号前的数。"]] as Off[])),
                [a + b, "That adds the numbers under the roots.", "这是把根号里的数相加了。"],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "√3 · √27 = √81 = 9",
              pieces: [
                { size: 1, text: "3" },
                { size: 3, text: "27", lit: true },
              ],
            },
          ],
          [
            "A bar of 3 and 27 multiplied under one root: their product 81 is a perfect square, so the root is 9.",
            "一个长条：3 和 27 在同一个根号下相乘，积 81 是完全平方数，所以平方根是 9。",
          ],
        ),
      ),
      lesson(
        "products-in-simplest-form",
        ["Products in simplest radical form", "积化为最简根式"],
        [
          [
            "$\\sqrt{6} \\cdot \\sqrt{10} = \\sqrt{60}$. Then simplify: the largest square factor of $60$ is $4$, so $\\sqrt{60} = \\sqrt{4} \\cdot \\sqrt{15} = 2\\sqrt{15}$.",
            "$\\sqrt{6} \\cdot \\sqrt{10} = \\sqrt{60}$。再化简：$60$ 的最大平方因数是 $4$，所以 $\\sqrt{60} = \\sqrt{4} \\cdot \\sqrt{15} = 2\\sqrt{15}$。",
          ],
          [
            "Square both: $\\left(2\\sqrt{15}\\right)^{2} = 4 \\cdot 15 = 60$, and $\\left(\\sqrt{6} \\cdot \\sqrt{10}\\right)^{2} = 6 \\cdot 10 = 60$.",
            "两边都平方：$\\left(2\\sqrt{15}\\right)^{2} = 4 \\cdot 15 = 60$，$\\left(\\sqrt{6} \\cdot \\sqrt{10}\\right)^{2} = 6 \\cdot 10 = 60$。",
          ],
          [
            "Take out the square root of the square factor, not the factor itself: $\\sqrt{60}$ is $2\\sqrt{15}$, not $4\\sqrt{15}$.",
            "移到根号外的是平方因数的平方根，不是平方因数本身：$\\sqrt{60}$ 是 $2\\sqrt{15}$，不是 $4\\sqrt{15}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [a, b] = rng.sample([2, 3, 5, 6, 7, 10, 12, 14, 15, 18, 20, 21], 2) as [number, number];
            const p = a * b;
            const [k, m] = simplifyRadical(p);
            if (k === 1 || m === 1) continue;
            return rooted(
              [
                `Simplify $\\sqrt{${a}} \\cdot \\sqrt{${b}}$. Write the answer in simplest radical form.`,
                `化简 $\\sqrt{${a}} \\cdot \\sqrt{${b}}$，结果写成最简根式。`,
              ],
              [k, m],
              [
                [
                  ["Multiply under one root", "合到一个根号下"],
                  ["Multiply the numbers under the roots:", "根号里的数相乘："],
                  [`\\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${p}}`],
                ],
                [
                  ["Take out the square factor", "开出平方因数"],
                  [`The largest square factor of $${p}$ is $${k * k}$:`, `$${p}$ 的最大平方因数是 $${k * k}$：`],
                  [`\\sqrt{${p}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`],
                ],
              ],
              [
                `Square both: $\\left(${radical(k, m)}\\right)^{2} = ${k * k} \\cdot ${m} = ${p}$, and $\\left(\\sqrt{${a}} \\cdot \\sqrt{${b}}\\right)^{2} = ${a} \\cdot ${b} = ${p}$. Both are positive, so they are equal.`,
                `两边都平方：$\\left(${radical(k, m)}\\right)^{2} = ${k * k} \\cdot ${m} = ${p}$，$\\left(\\sqrt{${a}} \\cdot \\sqrt{${b}}\\right)^{2} = ${a} \\cdot ${b} = ${p}$。两者都是正数，所以相等。`,
              ],
              [
                [`\\sqrt{${a + b}}`, "That adds the numbers under the roots.", "这是把根号里的数相加了。"],
                [radical(k * k, m), "That takes out the square factor without its root.", "这是把平方因数直接移出，没有开方。"],
                [`${m}\\sqrt{${k}}`, "That swaps the number outside and the number under the root.", "这是把根号外和根号里的数弄反了。"],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "√60 = 2√15",
              pieces: [
                { size: 1, text: "4", lit: true },
                { size: 3, text: "15" },
              ],
            },
          ],
          [
            "A bar of 60 split as 4 times 15: the square factor 4 comes out of the root as 2, and 15 stays under it.",
            "一个表示 60 的长条分成 4 乘 15：平方因数 4 开方后以 2 移出根号，15 留在根号里。",
          ],
        ),
      ),
    ],
  ),
  [
    "A rectangle is $\\sqrt{3}$ m wide and $\\sqrt{27}$ m long. Its area is the product of two roots.",
    "一个长方形宽 $\\sqrt{3}$ 米，长 $\\sqrt{27}$ 米。它的面积是两个根式的积。",
  ],
  [
    "$\\sqrt{3} \\approx 1.73$ and $\\sqrt{27} \\approx 5.20$, and $1.73 \\times 5.20 \\approx 9$.",
    "$\\sqrt{3} \\approx 1.73$，$\\sqrt{27} \\approx 5.20$，$1.73 \\times 5.20 \\approx 9$。",
  ],
  [
    "multiply square roots under one root, and write the product in simplest radical form.",
    "把平方根合到一个根号下相乘，并把积写成最简根式。",
  ],
);

/** theQuotientRuleForRadicals divides square roots: √a / √b = √(a/b). */
export const theQuotientRuleForRadicals = withIntro(
  topic(
    "the-quotient-rule-for-radicals",
    t("The Quotient Rule for Radicals", "根式的除法法则"),
    t(
      "For a ≥ 0 and b > 0, √a / √b = √(a/b): the quotient of two square roots is the square root of the quotient. Dividing first often turns two surds into a whole number or a simpler surd: √72 / √2 = √36 = 6.",
      "对 a ≥ 0，b > 0，√a / √b = √(a/b)：两个平方根的商等于商的平方根。先做除法，常常能把两个不尽根数化为整数或更简单的根式：√72 / √2 = √36 = 6。",
    ),
    ["the-product-rule-for-radicals"],
    ["8.EE.A.2", "HSN.RN.A.2"],
    [
      lesson(
        "quotients-that-are-rational",
        ["Quotients that are rational", "商为有理数"],
        [
          [
            "For $a \\ge 0$ and $b > 0$, the quotient of two square roots is the root of the quotient. If that quotient is a perfect square, or a fraction of perfect squares, the root is rational: $\\frac{\\sqrt{75}}{\\sqrt{3}} = \\sqrt{25} = 5$.",
            "对 $a \\ge 0$，$b > 0$，两个平方根之商等于商的平方根。如果这个商是完全平方数，或者是两个完全平方数之比，开方的结果就是有理数：$\\frac{\\sqrt{75}}{\\sqrt{3}} = \\sqrt{25} = 5$。",
          ],
          [
            "Simplify each root first: $\\sqrt{75} = 5\\sqrt{3}$, and $\\frac{5\\sqrt{3}}{\\sqrt{3}} = 5$.",
            "先化简每个根式：$\\sqrt{75} = 5\\sqrt{3}$，$\\frac{5\\sqrt{3}}{\\sqrt{3}} = 5$。",
          ],
          [
            "Take the root of the quotient. $\\frac{75}{3} = 25$ is the number under the root, not the answer.",
            "要给商开方。$\\frac{75}{3} = 25$ 是根号里的数，不是答案。",
          ],
        ],
        (rng) => {
          const m = rng.pick([2, 3, 5, 6, 7]);
          const r = rng.bool(0.65) ? Q.of(rng.int(2, 9)) : reduced(rng, 7, 5);
          const [p, q] = [Number(r.n), Number(r.d)];
          const [a, b] = [p * p * m, q * q * m];
          const frac = `\\frac{\\sqrt{${a}}}{\\sqrt{${b}}}`;
          const inner = Q.of(a, b);
          return valued(
            [`Evaluate $${frac}$.`, `计算 $${frac}$。`],
            r,
            [
              [
                ["Divide under one root", "合到一个根号下"],
                ["Divide the numbers under the roots:", "根号里的数相除："],
                [`${frac} = \\sqrt{\\frac{${a}}{${b}}} = \\sqrt{${num(inner)}}`],
              ],
              [
                ["Take the root", "开平方"],
                [
                  `The number under the root is a perfect square: $${num(inner)} = ${power(r, 2)}$.`,
                  `根号里的数是完全平方数：$${num(inner)} = ${power(r, 2)}$。`,
                ],
                [`\\sqrt{${num(inner)}} = ${num(r)}`],
              ],
            ],
            [
              `Simplify each root first: ${p === 1 ? `$\\sqrt{${a}}$ is already simple` : `$\\sqrt{${a}} = ${radical(p, m)}$`} and ${q === 1 ? `$\\sqrt{${b}}$ is already simple` : `$\\sqrt{${b}} = ${radical(q, m)}$`}. The factor $\\sqrt{${m}}$ cancels, which leaves $${num(r)}$.`,
              `先化简每个根式：${p === 1 ? `$\\sqrt{${a}}$ 已是最简` : `$\\sqrt{${a}} = ${radical(p, m)}$`}，${q === 1 ? `$\\sqrt{${b}}$ 已是最简` : `$\\sqrt{${b}} = ${radical(q, m)}$`}。约去 $\\sqrt{${m}}$，剩下 $${num(r)}$。`,
            ],
            [
              [inner, "That divides under the root but forgets to take the root.", "这是根号里的数相除了，却忘了开方。"],
              ...(isSquare(a - b) && a > b
                ? ([[Math.sqrt(a - b), "That subtracts the numbers under the roots.", "这是把根号里的数相减了。"]] as Off[])
                : []),
              [Q.of(a, 2 * b), "That halves the quotient instead of taking its root.", "这是把商除以 $2$，而不是开方。"],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "75 ÷ 3 = 25 = 5²",
              pieces: [
                { size: 1, text: "3", lit: true },
                { size: 1, text: "3" },
                { size: 1, text: "3" },
                { size: 1, text: "3" },
                { size: 1, text: "3" },
              ],
            },
          ],
          [
            "A bar showing 75 ÷ 3 = 25 cut into five pieces labelled 3: the quotient 25 is a perfect square, so √75 ÷ √3 = 5.",
            "一个表示 75 ÷ 3 = 25 的长条，分成五段标着 3：商 25 是完全平方数，所以 √75 ÷ √3 = 5。",
          ],
        ),
      ),
      lesson(
        "quotients-in-simplest-form",
        ["Quotients in simplest radical form", "商化为最简根式"],
        [
          [
            "After dividing under one root, the number may still have a square factor. Take it out as its square root: $\\frac{\\sqrt{90}}{\\sqrt{5}} = \\sqrt{18} = \\sqrt{9} \\cdot \\sqrt{2} = 3\\sqrt{2}$.",
            "合到一个根号下相除后，根号里的数可能还有平方因数。把它开方后移出：$\\frac{\\sqrt{90}}{\\sqrt{5}} = \\sqrt{18} = \\sqrt{9} \\cdot \\sqrt{2} = 3\\sqrt{2}$。",
          ],
          [
            "Multiply back: $3\\sqrt{2} \\cdot \\sqrt{5} = 3\\sqrt{10} = \\sqrt{90}$.",
            "乘回去：$3\\sqrt{2} \\cdot \\sqrt{5} = 3\\sqrt{10} = \\sqrt{90}$。",
          ],
          [
            "Divide under the root; do not subtract. $\\frac{\\sqrt{90}}{\\sqrt{5}}$ is not $\\sqrt{85}$.",
            "根号里的数要相除，不是相减。$\\frac{\\sqrt{90}}{\\sqrt{5}}$ 不是 $\\sqrt{85}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const b = rng.pick([2, 3, 5, 6, 7]);
            const k = rng.int(2, 5);
            const m = rng.pick(squareFree.filter((x) => x <= 15 && x !== b));
            const a = b * k * k * m;
            if (a > 600) continue;
            const frac = `\\frac{\\sqrt{${a}}}{\\sqrt{${b}}}`;
            return rooted(
              [`Simplify $${frac}$. Write the answer in simplest radical form.`, `化简 $${frac}$，结果写成最简根式。`],
              [k, m],
              [
                [
                  ["Divide under one root", "合到一个根号下"],
                  ["Divide the numbers under the roots:", "根号里的数相除："],
                  [`${frac} = \\sqrt{\\frac{${a}}{${b}}} = \\sqrt{${a / b}}`],
                ],
                [
                  ["Take out the square factor", "开出平方因数"],
                  [`The largest square factor of $${a / b}$ is $${k * k}$:`, `$${a / b}$ 的最大平方因数是 $${k * k}$：`],
                  [`\\sqrt{${a / b}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`],
                ],
              ],
              [
                `Multiply back: $${radical(k, m)} \\cdot \\sqrt{${b}} = ${radical(k, m * b)}$, and bringing $${k}$ under the root gives $\\sqrt{${k * k} \\cdot ${m * b}} = \\sqrt{${a}}$.`,
                `乘回去：$${radical(k, m)} \\cdot \\sqrt{${b}} = ${radical(k, m * b)}$，把 $${k}$ 移进根号得 $\\sqrt{${k * k} \\cdot ${m * b}} = \\sqrt{${a}}$。`,
              ],
              [
                [`\\sqrt{${a - b}}`, "That subtracts the numbers under the roots.", "这是把根号里的数相减了。"],
                [radical(k * k, m), "That takes out the square factor without its root.", "这是把平方因数直接移出，没有开方。"],
                [`${m}\\sqrt{${k}}`, "That swaps the number outside and the number under the root.", "这是把根号外和根号里的数弄反了。"],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "√90 ÷ √5 = √18 = 3√2",
              pieces: [
                { size: 1, text: "9", lit: true },
                { size: 1, text: "2" },
              ],
            },
          ],
          [
            "A bar of 18 split as 9 times 2: the square factor 9 comes out of the root as 3, and 2 stays under it.",
            "一个表示 18 的长条分成 9 乘 2：平方因数 9 开方后以 3 移出根号，2 留在根号里。",
          ],
        ),
      ),
    ],
  ),
  [
    "A rectangle has an area of $\\sqrt{75}$ m² and a width of $\\sqrt{3}$ m. Its length is the quotient of two roots.",
    "一个长方形的面积是 $\\sqrt{75}$ 平方米，宽是 $\\sqrt{3}$ 米。它的长是两个根式的商。",
  ],
  [
    "$\\sqrt{75} \\approx 8.66$ and $\\sqrt{3} \\approx 1.73$, and $8.66 \\div 1.73 \\approx 5$.",
    "$\\sqrt{75} \\approx 8.66$，$\\sqrt{3} \\approx 1.73$，$8.66 \\div 1.73 \\approx 5$。",
  ],
  [
    "divide square roots under one root, and write the quotient in simplest radical form.",
    "把平方根合到一个根号下相除，并把商写成最简根式。",
  ],
);

// ---------------------------------------------------------------------------
// Equations with square and cube roots

/** signed writes "+ b" or "- |b|" after a term. */
const signed = (b: number) => (b < 0 ? `- ${-b}` : `+ ${b}`);

/** linearLatex writes ax + b. */
const linearLatex = (a: number, b: number) => `${a === 1 ? "" : a}x ${signed(b)}`;

/** solvingRadicalEquationsWithSquareRoots isolates a square root and squares both sides. */
export const solvingRadicalEquationsWithSquareRoots = withIntro(
  topic(
    "solving-radical-equations-with-square-roots",
    t("Solving Radical Equations With Square Roots", "解含平方根的方程"),
    t(
      "To solve an equation with the unknown under a square root, first isolate the root, then square both sides, since (√x)² = x. A square root is never negative, so an equation such as √x = −3 has no solution; always check the answer in the original equation.",
      "未知数在平方根号内的方程，先把根式单独留在一边，再两边平方，因为 (√x)² = x。平方根不会是负数，所以像 √x = −3 这样的方程无解；最后总要把答案代回原方程检验。",
    ),
    ["solving-equations-with-square-roots", "squaring-a-square-root"],
    ["8.EE.A.2"],
    [
      lesson(
        "isolating-the-square-root",
        ["Isolating the square root", "把根式单独留在一边"],
        [
          [
            "Get the root alone first, then square both sides, since $(\\sqrt{x})^{2} = x$. For $\\sqrt{x} + 4 = 11$, subtract $4$ to get $\\sqrt{x} = 7$. Then $x = 49$. For $3\\sqrt{x} = 12$, divide by $3$: $\\sqrt{x} = 4$, so $x = 16$.",
            "先把根式单独留在一边，再两边平方，因为 $(\\sqrt{x})^{2} = x$。对于 $\\sqrt{x} + 4 = 11$，两边减 $4$ 得 $\\sqrt{x} = 7$，于是 $x = 49$。对于 $3\\sqrt{x} = 12$，两边除以 $3$：$\\sqrt{x} = 4$，所以 $x = 16$。",
          ],
          ["$\\sqrt{49} + 4 = 7 + 4 = 11$.", "$\\sqrt{49} + 4 = 7 + 4 = 11$。"],
          [
            "Do not square before the root is alone. $(\\sqrt{x} + 4)^{2}$ is not $x + 16$.",
            "根式还没单独留下时不要平方。$(\\sqrt{x} + 4)^{2}$ 不等于 $x + 16$。",
          ],
        ],
        (rng) => {
          const r = rng.int(2, 15);
          const kind = rng.pick(["plain", "plus", "minus", "times"] as const);
          const b = rng.int(1, 12);
          const c = rng.int(2, 6);
          const [eq, isolate]: [string, Pair] =
            kind === "plain"
              ? [`\\sqrt{x} = ${r}`, ["The root is already alone.", "根式已经单独在一边。"]]
              : kind === "plus"
                ? [
                    `\\sqrt{x} + ${b} = ${r + b}`,
                    [`Subtract $${b}$ from both sides: $\\sqrt{x} = ${r}$.`, `两边减 $${b}$：$\\sqrt{x} = ${r}$。`],
                  ]
                : kind === "minus"
                  ? [
                      `\\sqrt{x} - ${b} = ${r - b}`,
                      [`Add $${b}$ to both sides: $\\sqrt{x} = ${r}$.`, `两边加 $${b}$：$\\sqrt{x} = ${r}$。`],
                    ]
                  : [
                      `${c}\\sqrt{x} = ${c * r}`,
                      [`Divide both sides by $${c}$: $\\sqrt{x} = ${r}$.`, `两边除以 $${c}$：$\\sqrt{x} = ${r}$。`],
                    ];
          const rhs = kind === "plain" ? r : kind === "plus" ? r + b : kind === "minus" ? r - b : c * r;
          return valued(
            [`Solve $${eq}$.`, `解方程 $${eq}$。`],
            r * r,
            [
              [["Isolate the root", "把根式单独留下"], isolate],
              [["Square both sides", "两边平方"], ["Squaring undoes the root:", "平方消去根号："], [`x = ${r}^{2} = ${r * r}`]],
            ],
            [
              `Put $${r * r}$ back: $\\sqrt{${r * r}} = ${r}$, so the equation holds.`,
              `把 $${r * r}$ 代回去：$\\sqrt{${r * r}} = ${r}$，方程成立。`,
            ],
            [
              [r, "That forgets to square; $x$ is under the root.", "这是忘了平方；$x$ 在根号里。"],
              ...(kind === "plain"
                ? []
                : [[rhs * rhs, "That squares before the root is alone.", "这是在根式单独留下之前就平方了。"] as const]),
              [2 * r, "That doubles instead of squaring.", "这是乘以 $2$，而不是平方。"],
              ...(kind === "times"
                ? [
                    [
                      Q.of(rhs * rhs, c),
                      `That divides by $${c}$ after squaring; divide first.`,
                      `这是平方之后才除以 $${c}$；要先除。`,
                    ] as const,
                  ]
                : []),
            ],
            { solveFor: "x" },
          );
        },
        tapeFigure(
          [
            {
              total: "11",
              pieces: [
                { size: 7, text: "√x" },
                { size: 4, text: "4", lit: true },
              ],
            },
          ],
          ["A bar of 11 made of √x and 4, so √x is 7.", "一个长度为 11 的长条，由 √x 和 4 组成，所以 √x 是 7。"],
        ),
      ),
      lesson(
        "expressions-under-the-square-root",
        ["Expressions under the root", "根号内是式子"],
        [
          [
            "In $\\sqrt{2x + 3} = 5$ the root is already alone, so the first step is to square both sides. That gives $2x + 3 = 25$. Then $2x = 22$ and $x = 11$.",
            "在 $\\sqrt{2x + 3} = 5$ 中，根式已经单独在一边，所以第一步就是两边平方，得 $2x + 3 = 25$。于是 $2x = 22$，$x = 11$。",
          ],
          ["$\\sqrt{2 \\cdot 11 + 3} = \\sqrt{25} = 5$.", "$\\sqrt{2 \\cdot 11 + 3} = \\sqrt{25} = 5$。"],
          [
            "Square the right side too. Solving $2x + 3 = 5$ gives the wrong $x = 1$.",
            "右边也要平方。解 $2x + 3 = 5$ 会得到错误的 $x = 1$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.int(1, 5);
            const x = rng.int(-6, 15);
            const b = rng.int(-15, 15);
            const inside = a * x + b;
            if (b === 0 || !isSquare(inside) || inside === 0) continue;
            const c = Math.sqrt(inside);
            if (c === 1) continue;
            const eq = `\\sqrt{${linearLatex(a, b)}} = ${c}`;
            const move: Pair = b > 0 ? [`Subtract $${b}$`, `两边减 $${b}$`] : [`Add $${-b}$`, `两边加 $${-b}$`];
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Square both sides", "两边平方"],
                  ["The root is alone, so square both sides:", "根式已经单独在一边，两边平方："],
                  [`${linearLatex(a, b)} = ${c * c}`],
                ],
                [
                  ["Solve", "解方程"],
                  a === 1 ? [`${move[0]}:`, `${move[1]}：`] : [`${move[0]}, then divide by $${a}$:`, `${move[1]}，再除以 $${a}$：`],
                  a === 1 ? [`x = ${x}`] : [`${a}x = ${c * c - b}`, `x = ${x}`],
                ],
              ],
              [
                `Put it back: $\\sqrt{${a === 1 ? "" : `${a} \\cdot `}${paren(x)} ${signed(b)}} = \\sqrt{${c * c}} = ${c}$.`,
                `代回去：$\\sqrt{${a === 1 ? "" : `${a} \\cdot `}${paren(x)} ${signed(b)}} = \\sqrt{${c * c}} = ${c}$。`,
              ],
              [
                [Q.of(c - b, a), "That leaves the right side unsquared.", "这是右边没有平方。"],
                [Q.of(c * c + b, a), "That moves the constant across without changing its sign.", "这是移项时没有改变常数的符号。"],
                [Q.of(2 * c - b, a), "That doubles the right side instead of squaring it.", "这是把右边乘以 $2$，而不是平方。"],
              ],
              { solveFor: "x" },
            );
          }
        },
        tapeFigure(
          [
            {
              total: "25",
              pieces: [
                { size: 22, text: "2x" },
                { size: 3, text: "3", lit: true },
              ],
            },
          ],
          ["After squaring, a bar of 25 made of 2x and 3, so 2x is 22.", "平方之后，一个长度为 25 的长条由 2x 和 3 组成，所以 2x 是 22。"],
        ),
      ),
      lesson(
        "two-square-roots-set-equal",
        ["Two square roots set equal", "两个相等的平方根"],
        [
          [
            "When one square root equals another, square both sides. Both roots go away at once. For $\\sqrt{5x + 2} = \\sqrt{3x + 8}$, that gives $5x + 2 = 3x + 8$. So $2x = 6$ and $x = 3$.",
            "一个平方根等于另一个平方根时，两边平方，两个根号同时去掉。对于 $\\sqrt{5x + 2} = \\sqrt{3x + 8}$，得到 $5x + 2 = 3x + 8$。所以 $2x = 6$，$x = 3$。",
          ],
          [
            "Both sides become $\\sqrt{17}$: $5 \\cdot 3 + 2 = 3 \\cdot 3 + 8 = 17$.",
            "两边都变成 $\\sqrt{17}$：$5 \\cdot 3 + 2 = 3 \\cdot 3 + 8 = 17$。",
          ],
          [
            "Check that the number under each root is not negative. A value that makes it negative is not a solution.",
            "要检验每个根号里的数不是负数。使它为负的值不是解。",
          ],
        ],
        (rng) => {
          const answer = rng.int(2, 12);
          const c = rng.int(2, 7);
          const a = c + rng.int(1, 5);
          const b = rng.int(1, 30);
          const d = (a - c) * answer + b;
          const value = a * answer + b;
          const gap = a - c === 1 ? "" : `${a - c}`;
          const root = Math.sqrt(value);
          return valued(
            [`Solve $\\sqrt{${a}x + ${b}} = \\sqrt{${c}x + ${d}}$.`, `解方程 $\\sqrt{${a}x + ${b}} = \\sqrt{${c}x + ${d}}$。`],
            answer,
            [
              [["Square both sides", "两边平方"], ["Both roots go away:", "两个根号都去掉："], [`${a}x + ${b} = ${c}x + ${d}`]],
              [
                ["Solve", "解方程"],
                [`Subtract $${c}x$ and $${b}$ from both sides:`, `两边减去 $${c}x$ 和 $${b}$：`],
                a - c === 1 ? [`x = ${d - b}`] : [`${gap}x = ${d - b}`, `x = ${answer}`],
              ],
            ],
            [
              `Both sides have $${value}$ under the root, which is not negative: $${a} \\cdot ${answer} + ${b} = ${c} \\cdot ${answer} + ${d} = ${value}$.`,
              `两边根号里都是 $${value}$，不是负数：$${a} \\cdot ${answer} + ${b} = ${c} \\cdot ${answer} + ${d} = ${value}$。`,
            ],
            [
              [-answer, "That gets the sign wrong when moving the terms.", "这是移项时符号弄错了。"],
              [Q.of(d - b, a + c), "That adds the $x$ terms instead of subtracting them.", "这是把含 $x$ 的项相加了，而不是相减。"],
              [value, "That is the number under the roots, not $x$.", "这是根号里的数，不是 $x$。"],
              ...(Number.isInteger(root) ? [[root, "That is the value of each root, not $x$.", "这是根式的值，不是 $x$。"] as const] : []),
            ],
            { solveFor: "x" },
          );
        },
        tapeFigure(
          [
            {
              total: "17",
              pieces: [
                { size: 15, text: "5x" },
                { size: 2, text: "2", lit: true },
              ],
            },
            {
              pieces: [
                { size: 9, text: "3x" },
                { size: 8, text: "8", lit: true },
              ],
            },
          ],
          [
            "Two bars of 17 when x = 3: one made of 5x and 2, the other of 3x and 8.",
            "x = 3 时两个长度都是 17 的长条：一个由 5x 和 2 组成，另一个由 3x 和 8 组成。",
          ],
        ),
      ),
    ],
  ),
  [
    "A square garden has an area of $x$ m². Its side is $\\sqrt{x}$ m. With a path $4$ m wide along one side, the garden and path measure $11$ m across.",
    "一个正方形花园的面积是 $x$ 平方米，边长是 $\\sqrt{x}$ 米。沿一边修了一条宽 $4$ 米的小路，花园加小路共宽 $11$ 米。",
  ],
  ["The side is $11 - 4 = 7$ m, so the area is $7^{2} = 49$ m².", "边长是 $11 - 4 = 7$ 米，所以面积是 $7^{2} = 49$ 平方米。"],
  [
    "solve equations with square roots by getting the root alone and squaring both sides.",
    "解含平方根的方程：先把根式单独留下，再两边平方。",
  ],
);

/** solvingEquationsUsingCubeRoots solves equations of the form ax³ + b = c by taking cube roots. */
export const solvingEquationsUsingCubeRoots = withIntro(
  topic(
    "solving-equations-using-cube-roots",
    t("Solving Equations Using Cube Roots", "用立方根解方程"),
    t(
      "The equation x³ = a has exactly one solution, x = ∛a, which is negative when a is negative. Unlike x² = a, there is no second solution with the opposite sign, because (−2)³ = −8, not 8. To solve ax³ + b = c, isolate x³ first.",
      "方程 x³ = a 恰好有一个解 x = ∛a，当 a 为负数时它是负数。与 x² = a 不同，它没有符号相反的第二个解，因为 (−2)³ = −8，而不是 8。解 ax³ + b = c 时，先把 x³ 单独留在一边。",
    ),
    ["the-cube-root-of-a-perfect-cube", "solving-equations-with-square-roots"],
    ["8.EE.A.2"],
    [
      lesson(
        "x-cubed-equals-a-number",
        ["$x^3$ equals a number", "$x^3$ 等于一个数"],
        [
          [
            "$x^{3} = -64$ has exactly one real solution, the cube root: $x = \\sqrt[3]{-64} = -4$. Unlike $x^{2} = 64$, there is no second solution with the opposite sign.",
            "$x^{3} = -64$ 恰好有一个实数解，就是立方根：$x = \\sqrt[3]{-64} = -4$。与 $x^{2} = 64$ 不同，它没有符号相反的第二个解。",
          ],
          ["Substitute: $(-4)^{3} = -64$, while $4^{3} = 64$.", "代入检验：$(-4)^{3} = -64$，而 $4^{3} = 64$。"],
          [
            "Dividing by $3$ gives $-\\frac{64}{3}$, which is wrong; the cube root is not a third.",
            "除以 $3$ 得 $-\\frac{64}{3}$，这是错的；立方根不是三分之一。",
          ],
        ],
        (rng) => {
          for (;;) {
            const x = rng.bool(0.8) ? Q.of(rng.nonZero(-10, 10)) : reduced(rng, 4, 5).mul(Q.of(rng.sign()));
            const a = x.pow(3);
            if (a.abs().eq(Q.one)) continue;
            const [p, q] = [Math.abs(Number(x.n)), Number(x.d)];
            const check: Pair =
              q === 1
                ? x.sign() > 0
                  ? grouped(p, 3)
                  : [
                      `${grouped(p, 3)[0]} The number is negative, so its cube root is $${num(x)}$.`,
                      `${grouped(p, 3)[1]}这个数是负数，所以它的立方根是 $${num(x)}$。`,
                    ]
                : [
                    `Take the cube root of the top and of the bottom: $\\sqrt[3]{${p ** 3}} = ${p}$ and $\\sqrt[3]{${q ** 3}} = ${q}$. With the sign of the number, that is $${num(x)}$.`,
                    `分子、分母分别开立方：$\\sqrt[3]{${p ** 3}} = ${p}$，$\\sqrt[3]{${q ** 3}} = ${q}$。带上这个数的符号，就是 $${num(x)}$。`,
                  ];
            return valued(
              [`Solve $x^{3} = ${num(a)}$.`, `解方程 $x^{3} = ${num(a)}$。`],
              x,
              [
                [
                  ["Take the cube root", "开立方"],
                  [`Only one real number has the cube $${num(a)}$:`, `立方等于 $${num(a)}$ 的实数只有一个：`],
                  [`x = \\sqrt[3]{${num(a)}}`],
                ],
                [
                  ["Find it", "求出它"],
                  [`Find the number with that cube: $${power(x, 3)} = ${num(a)}$.`, `找出立方等于它的数：$${power(x, 3)} = ${num(a)}$。`],
                  [`x = ${num(x)}`],
                ],
              ],
              check,
              [
                [a.div(Q.of(3)), "That divides by $3$; the cube root is not a third.", "这是除以 $3$；立方根不是三分之一。"],
                [x.neg(), "That has the wrong sign; a cube keeps the sign of the number.", "这是符号错了；立方保持原数的符号。"],
                [a, "That stops before taking the cube root.", "这是还没有开立方就停下了。"],
              ],
              { solveFor: "x" },
            );
          }
        },
        lineFigure(
          {
            lo: -5,
            hi: 5,
            step: 1,
            labels: [-4, 0, 4],
            marks: [{ at: -4, text: "x = −4", result: true }],
          },
          [
            "A number line with −4 marked as the only solution of x³ = −64; 4 is not one, since 4³ = 64.",
            "数轴上标出 −4，它是 x³ = −64 唯一的解；4 不是解，因为 4³ = 64。",
          ],
        ),
      ),
      lesson(
        "isolating-the-cube",
        ["Isolating the cube", "把立方项单独留在一边"],
        [
          [
            "$2x^{3} + 5 = -11$: subtract $5$ to get $2x^{3} = -16$, divide by $2$ to get $x^{3} = -8$, and take the cube root: $x = -2$. Take the cube root last, only after $x^{3}$ is alone.",
            "$2x^{3} + 5 = -11$：两边减 $5$ 得 $2x^{3} = -16$，两边除以 $2$ 得 $x^{3} = -8$，再开立方：$x = -2$。要等 $x^{3}$ 单独留在一边后，最后再开立方。",
          ],
          [
            "Substitute: $2 \\cdot (-2)^{3} + 5 = 2 \\cdot (-8) + 5 = -11$.",
            "代入检验：$2 \\cdot (-2)^{3} + 5 = 2 \\cdot (-8) + 5 = -11$。",
          ],
          ["Do not stop at $x^{3} = -8$; the question asks for $x$.", "不要停在 $x^{3} = -8$；题目求的是 $x$。"],
        ],
        (rng) => {
          for (;;) {
            const x = rng.nonZero(-5, 5);
            const a = rng.int(1, 5);
            const b = rng.nonZero(-20, 20);
            if (a === 1 && Math.abs(x) === 1) continue;
            const c = a * x ** 3 + b;
            const lhs = `${a === 1 ? "" : a}x^{3} ${signed(b)}`;
            const times = a === 1 ? "" : `${a} \\cdot `;
            return valued(
              [`Solve $${lhs} = ${c}$.`, `解方程 $${lhs} = ${c}$。`],
              x,
              [
                [
                  ["Isolate the cube", "把立方项单独留下"],
                  [
                    `${b > 0 ? "Subtract" : "Add"} $${Math.abs(b)}$${a === 1 ? "" : `, then divide by $${a}$`}:`,
                    `两边${b > 0 ? "减" : "加"} $${Math.abs(b)}$${a === 1 ? "" : `，再除以 $${a}$`}：`,
                  ],
                  [...(a === 1 ? [] : [`${a}x^{3} = ${c - b}`]), `x^{3} = ${x ** 3}`],
                ],
                [
                  ["Take the cube root", "开立方"],
                  ["Now take the cube root of both sides:", "两边开立方："],
                  [`x = \\sqrt[3]{${x ** 3}} = ${x}`],
                ],
              ],
              [
                `Substitute: $${times}${cubed(x)} ${signed(b)} = ${times}${paren(x ** 3)} ${signed(b)} = ${c}$.`,
                `代入检验：$${times}${cubed(x)} ${signed(b)} = ${times}${paren(x ** 3)} ${signed(b)} = ${c}$。`,
              ],
              [
                [x ** 3, "That stops at $x^{3}$; take the cube root too.", "这是停在了 $x^{3}$；还要开立方。"],
                [-x, "That has the wrong sign; a cube keeps the sign of the number.", "这是符号错了；立方保持原数的符号。"],
                [Q.of(x ** 3, 3), "That divides by $3$ instead of taking the cube root.", "这是除以 $3$，而不是开立方。"],
              ],
              { solveFor: "x" },
            );
          }
        },
        tapeFigure(
          [
            {
              total: "2x³ + 5 = −11",
              pieces: [
                { size: 2, text: "x³", lit: true },
                { size: 2, text: "x³", lit: true },
                { size: 1, text: "+5", dashed: true },
              ],
            },
          ],
          [
            "A bar of two pieces x³ and a dashed +5 making −11: take away the 5, split the rest in two, and only then take the cube root.",
            "一个长条：两段 x³ 和虚线的 +5，合起来是 −11：先去掉 5，再把剩下的平分成两份，最后再开立方。",
          ],
        ),
      ),
    ],
  ),
  [
    "A cube-shaped tank has a volume of $64$ m³. Its edge $x$ satisfies $x^{3} = 64$.",
    "一个正方体水箱的容积是 $64$ 立方米。它的棱长 $x$ 满足 $x^{3} = 64$。",
  ],
  ["$4 \\times 4 \\times 4 = 64$, so $x = 4$.", "$4 \\times 4 \\times 4 = 64$，所以 $x = 4$。"],
  ["solve equations with a cube by isolating it and taking the cube root.", "解含立方的方程：先把立方项单独留下，再开立方。"],
);

/** solvingRadicalEquationsWithCubeRoots isolates a cube root and cubes both sides. */
export const solvingRadicalEquationsWithCubeRoots = withIntro(
  topic(
    "solving-radical-equations-with-cube-roots",
    t("Solving Radical Equations With Cube Roots", "解含立方根的方程"),
    t(
      "To solve an equation with the unknown under a cube root, isolate the cube root and cube both sides, since (∛x)³ = x. A cube root can be negative, so ∛x = −3 has the solution x = −27.",
      "未知数在立方根号内的方程，先把立方根单独留在一边，再两边立方，因为 (∛x)³ = x。立方根可以是负数，所以 ∛x = −3 的解是 x = −27。",
    ),
    ["solving-equations-using-cube-roots", "solving-radical-equations-with-square-roots"],
    ["8.EE.A.2"],
    [
      lesson(
        "isolating-the-cube-root",
        ["Isolating the cube root", "把立方根单独留在一边"],
        [
          [
            "$\\sqrt[3]{x} + 7 = 3$: subtract $7$ to get $\\sqrt[3]{x} = -4$, then cube: $x = (-4)^{3} = -64$. Unlike a square root, a cube root may equal a negative number.",
            "$\\sqrt[3]{x} + 7 = 3$：两边减 $7$ 得 $\\sqrt[3]{x} = -4$，再立方：$x = (-4)^{3} = -64$。与平方根不同，立方根可以等于负数。",
          ],
          ["Substitute: $\\sqrt[3]{-64} = -4$ and $-4 + 7 = 3$.", "代入检验：$\\sqrt[3]{-64} = -4$，$-4 + 7 = 3$。"],
          [
            "Isolate the root before cubing. Cubing $3$ first gives $27$, which is wrong.",
            "先分离根式再立方。先把 $3$ 立方得 $27$，这是错的。",
          ],
        ],
        (rng) => {
          for (;;) {
            const r = rng.nonZero(-6, 6);
            if (Math.abs(r) === 1) continue;
            const kind = rng.pick(["plain", "shift", "times"] as const);
            const b = rng.nonZero(-9, 9);
            const c = rng.int(2, 4);
            const eq =
              kind === "plain"
                ? `\\sqrt[3]{x} = ${r}`
                : kind === "shift"
                  ? `\\sqrt[3]{x} ${signed(b)} = ${r + b}`
                  : `${c}\\sqrt[3]{x} = ${c * r}`;
            const isolate: Pair =
              kind === "plain"
                ? ["The cube root is already alone:", "立方根已经单独在一边："]
                : kind === "shift"
                  ? [
                      `${b > 0 ? "Subtract" : "Add"} $${Math.abs(b)}$ ${b > 0 ? "from" : "to"} both sides:`,
                      `两边${b > 0 ? "减" : "加"} $${Math.abs(b)}$：`,
                    ]
                  : [`Divide both sides by $${c}$:`, `两边除以 $${c}$：`];
            const rhs = kind === "plain" ? r : kind === "shift" ? r + b : c * r;
            const back =
              kind === "plain"
                ? ""
                : kind === "shift"
                  ? `, and $${r} ${signed(b)} = ${r + b}$`
                  : `, and $${c} \\cdot ${paren(r)} = ${c * r}$`;
            const backZh =
              kind === "plain" ? "" : kind === "shift" ? `，$${r} ${signed(b)} = ${r + b}$` : `，$${c} \\cdot ${paren(r)} = ${c * r}$`;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              r ** 3,
              [
                [["Isolate the cube root", "把立方根单独留下"], isolate, [`\\sqrt[3]{x} = ${r}`]],
                [
                  ["Cube both sides", "两边立方"],
                  ["Cubing undoes the cube root:", "立方可以抵消立方根："],
                  [`x = ${paren(r)}^{3} = ${r ** 3}`],
                ],
              ],
              [`Substitute: $\\sqrt[3]{${r ** 3}} = ${r}$${back}.`, `代入检验：$\\sqrt[3]{${r ** 3}} = ${r}$${backZh}。`],
              [
                [r * r, "That squares instead of cubing.", "这是平方了，而不是立方。"],
                [3 * r, "That multiplies by $3$ instead of cubing.", "这是乘 $3$，而不是立方。"],
                ...(kind === "plain"
                  ? []
                  : ([[rhs ** 3, "That cubes before isolating the root.", "这是还没把根式分离就立方了。"]] as Off[])),
              ],
              { solveFor: "x" },
            );
          }
        },
        lineFigure(
          {
            lo: -5,
            hi: 4,
            step: 1,
            labels: [-4, 0, 3],
            marks: [
              { at: -4, text: "∛x = −4", result: true },
              { at: 3, text: "3" },
            ],
            jumps: [[3, -4]],
          },
          [
            "A number line: undoing + 7 is a jump back 7 from 3 to −4, so ∛x = −4 and x = (−4)³ = −64.",
            "一条数轴：去掉 + 7 就是从 3 向回跳 7 格到 −4，所以 ∛x = −4，x = (−4)³ = −64。",
          ],
        ),
      ),
      lesson(
        "expressions-under-the-cube-root",
        ["Expressions under the cube root", "立方根号内是式子"],
        [
          [
            "Cubing undoes a cube root, so cube both sides and solve the equation that is left. $\\sqrt[3]{3x - 2} = -2$: cubing gives $3x - 2 = -8$, so $3x = -6$ and $x = -2$.",
            "立方运算可以抵消立方根，所以两边同时立方，再解剩下的方程。$\\sqrt[3]{3x - 2} = -2$：两边立方得 $3x - 2 = -8$，所以 $3x = -6$，$x = -2$。",
          ],
          ["Substitute: $3 \\cdot (-2) - 2 = -8$, and $\\sqrt[3]{-8} = -2$.", "代入检验：$3 \\cdot (-2) - 2 = -8$，$\\sqrt[3]{-8} = -2$。"],
          ["Cube the right side too: $3x - 2 = -2$ forgets it.", "右边也要立方：写成 $3x - 2 = -2$ 就是忘了。"],
        ],
        (rng) => {
          for (;;) {
            const a = rng.int(1, 5);
            const c = rng.nonZero(-4, 4);
            const b = rng.nonZero(-12, 12);
            if (Math.abs(c) === 1 || (c ** 3 - b) % a !== 0) continue;
            const x = (c ** 3 - b) / a;
            const eq = `\\sqrt[3]{${linearLatex(a, b)}} = ${c}`;
            const times = a === 1 ? "" : `${a} \\cdot `;
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Cube both sides", "两边立方"],
                  ["Cubing undoes the cube root:", "立方可以抵消立方根："],
                  [`${linearLatex(a, b)} = ${paren(c)}^{3} = ${c ** 3}`],
                ],
                [
                  ["Solve", "解方程"],
                  [
                    `${b > 0 ? "Subtract" : "Add"} $${Math.abs(b)}$${a === 1 ? "" : `, then divide by $${a}$`}:`,
                    `两边${b > 0 ? "减" : "加"} $${Math.abs(b)}$${a === 1 ? "" : `，再除以 $${a}$`}：`,
                  ],
                  [...(a === 1 ? [] : [`${a}x = ${c ** 3 - b}`]), `x = ${x}`],
                ],
              ],
              [
                `Substitute: $${times}${paren(x)} ${signed(b)} = ${c ** 3}$, and $\\sqrt[3]{${c ** 3}} = ${c}$.`,
                `代入检验：$${times}${paren(x)} ${signed(b)} = ${c ** 3}$，$\\sqrt[3]{${c ** 3}} = ${c}$。`,
              ],
              [
                [Q.of(c - b, a), "That does not cube the right side.", "这是没有把右边立方。"],
                [Q.of(c * c - b, a), "That squares the right side instead of cubing it.", "这是把右边平方了，而不是立方。"],
                [Q.of(3 * c - b, a), "That multiplies the right side by $3$ instead of cubing it.", "这是把右边乘 $3$，而不是立方。"],
              ],
              { solveFor: "x" },
            );
          }
        },
        tapeFigure(
          [
            {
              total: "3x − 2 = (−2)³ = −8",
              pieces: [
                { size: 3, text: "3x", lit: true },
                { size: 1, text: "−2", dashed: true },
              ],
            },
          ],
          [
            "A bar of 3x and a dashed −2 that together make (−2)³ = −8, once both sides are cubed.",
            "一个长条：3x 和虚线的 −2，两边立方后合起来是 (−2)³ = −8。",
          ],
        ),
      ),
    ],
  ),
  [
    "A cube's edge is $\\sqrt[3]{x}$ cm, and its volume $x$ cm³ is unknown. Equations like this hide the unknown under a cube root.",
    "一个正方体的棱长是 $\\sqrt[3]{x}$ 厘米，体积 $x$ 立方厘米未知。这样的方程把未知数藏在了立方根号里。",
  ],
  ["$\\sqrt[3]{27} = 3$, since $3^{3} = 27$.", "$\\sqrt[3]{27} = 3$，因为 $3^{3} = 27$。"],
  [
    "solve equations with the unknown under a cube root by isolating the root and cubing both sides.",
    "解未知数在立方根号内的方程：先分离根式，再两边立方。",
  ],
);

/** Unit is a length unit with its square and cubic units: [length, area, volume] in English and Chinese. */
type Unit = readonly [Text, Text, Text];

/** units are length units with their area and volume units. */
const units: readonly Unit[] = [
  [t("centimeters", "厘米"), t("square centimeters", "平方厘米"), t("cubic centimeters", "立方厘米")],
  [t("meters", "米"), t("square meters", "平方米"), t("cubic meters", "立方米")],
  [t("inches", "英寸"), t("square inches", "平方英寸"), t("cubic inches", "立方英寸")],
  [t("feet", "英尺"), t("square feet", "平方英尺"), t("cubic feet", "立方英尺")],
];

/** findingSideLengthsOfSquaresAndCubesFromAreaOrVolume uses square and cube roots to find side lengths. */
export const findingSideLengthsOfSquaresAndCubesFromAreaOrVolume = withIntro(
  topic(
    "finding-side-lengths-of-squares-and-cubes-from-area-or-volume",
    t("Finding Side Lengths of Squares and Cubes From Area or Volume", "由面积或体积求正方形和正方体的边长"),
    t(
      "A square with side s has area s², so a square of area A has side √A. A cube with edge e has volume e³, so a cube of volume V has edge ∛V. Lengths are positive, so only the positive square root is used.",
      "边长为 s 的正方形面积是 s²，所以面积为 A 的正方形边长是 √A。棱长为 e 的正方体体积是 e³，所以体积为 V 的正方体棱长是 ∛V。长度是正数，所以只取正的平方根。",
    ),
    ["solving-equations-using-cube-roots"],
    ["8.EE.A.2"],
    [
      lesson(
        "side-of-a-square-from-its-area",
        ["The side of a square", "正方形的边长"],
        [
          [
            "A square has area $81$ m². Its side $s$ satisfies $s^{2} = 81$, so $s = \\sqrt{81} = 9$ m; $-9$ also solves the equation but is not a length.",
            "一个正方形的面积是 $81$ 平方米。它的边长 $s$ 满足 $s^{2} = 81$，所以 $s = \\sqrt{81} = 9$ 米；$-9$ 虽然也是方程的解，但不是长度。",
          ],
          ["Build the square back: $9 \\times 9 = 81$.", "把正方形拼回去：$9 \\times 9 = 81$。"],
          ["Dividing the area by $4$, as for a perimeter, gives the wrong $20.25$.", "像求周长那样把面积除以 $4$，会得到错误的 $20.25$。"],
        ],
        (rng) => {
          const [len, area] = rng.pick(units);
          const s = rng.bool(0.7) ? Q.of(rng.int(3, 25)) : Q.of(2 * rng.int(2, 12) + 1, 2);
          const A = s.mul(s);
          return valued(
            [
              `A square has an area of $${dec(A)}$ ${area.en}. How long is each side, in ${len.en}?`,
              `一个正方形的面积是 $${dec(A)}$ ${area["zh-CN"]}。它的边长是多少${len["zh-CN"]}？`,
            ],
            s,
            [
              [
                ["Set up the equation", "列方程"],
                [`The side $s$ satisfies $s^{2} = ${dec(A)}$.`, `边长 $s$ 满足 $s^{2} = ${dec(A)}$。`],
              ],
              [
                ["Take the positive root", "取正的平方根"],
                ["A length is positive, so take the positive root:", "长度是正数，所以取正的平方根："],
                [`s = \\sqrt{${dec(A)}} = ${dec(s)}`],
              ],
            ],
            [
              `Build the square back from its side: $${dec(s)} \\times ${dec(s)} = ${dec(A)}$, the area given.`,
              `用边长把正方形拼回去：$${dec(s)} \\times ${dec(s)} = ${dec(A)}$，正是给出的面积。`,
            ],
            [
              [A.div(Q.of(4)), "That divides the area by $4$, as for a perimeter.", "这是像求周长那样把面积除以 $4$。"],
              [A.div(Q.of(2)), "That halves the area instead of taking its root.", "这是把面积除以 $2$，而不是开方。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "s × s = 81",
              pieces: [
                { size: 1, text: "s = 9", lit: true },
                { size: 1, text: "s = 9" },
              ],
            },
          ],
          ["Two equal sides s multiplied to give the area 81, so each side is 9.", "两条相等的边 s 相乘得面积 81，所以每条边长 9。"],
        ),
      ),
      lesson(
        "edge-of-a-cube-from-its-volume",
        ["The edge of a cube", "正方体的棱长"],
        [
          [
            "A cube has volume $343$ in³. Its edge $e$ satisfies $e^{3} = 343$, so $e = \\sqrt[3]{343} = 7$ in. Each face is then a $7$ by $7$ square of $49$ in², and the surface has $6 \\cdot 49 = 294$ in².",
            "一个正方体的体积是 $343$ 立方英寸。它的棱长 $e$ 满足 $e^{3} = 343$，所以 $e = \\sqrt[3]{343} = 7$ 英寸。每个面是 $7 \\times 7$ 的正方形，面积 $49$ 平方英寸，表面积 $6 \\cdot 49 = 294$ 平方英寸。",
          ],
          ["Build the cube back: $7 \\times 7 \\times 7 = 343$.", "把正方体拼回去：$7 \\times 7 \\times 7 = 343$。"],
          ["The edge is not a third of the volume: $343 \\div 3$ is not $7$.", "棱长不是体积的三分之一：$343 \\div 3$ 不是 $7$。"],
        ],
        (rng) => {
          const [len, area, volume] = rng.pick(units);
          const e = rng.int(2, 12);
          const V = e ** 3;
          const ask = rng.pick(["edge", "edge", "face", "surface"] as const);
          const [answer, qEn, qZh] =
            ask === "edge"
              ? [e, `How long is each edge, in ${len.en}?`, `它的棱长是多少${len["zh-CN"]}？`]
              : ask === "face"
                ? [e * e, `What is the area of one face, in ${area.en}?`, `它一个面的面积是多少${area["zh-CN"]}？`]
                : [6 * e * e, `What is its surface area, in ${area.en}?`, `它的表面积是多少${area["zh-CN"]}？`];
          const last: Walk[] =
            ask === "edge"
              ? []
              : ask === "face"
                ? [
                    [
                      ["Find one face", "求一个面"],
                      [`Each face is a square with side $${e}$:`, `每个面是边长 $${e}$ 的正方形：`],
                      [`${e}^{2} = ${e * e}`],
                    ],
                  ]
                : [
                    [
                      ["Find the surface", "求表面积"],
                      ["Each face is a square, and a cube has $6$ faces:", "每个面是正方形，正方体有 $6$ 个面："],
                      [`6 \\cdot ${e}^{2} = 6 \\cdot ${e * e} = ${6 * e * e}`],
                    ],
                  ];
          const check: Pair =
            ask === "edge"
              ? [
                  `Build the cube back: $${e} \\times ${e} \\times ${e} = ${V}$.`,
                  `把正方体拼回去：$${e} \\times ${e} \\times ${e} = ${V}$。`,
                ]
              : ask === "face"
                ? [
                    `Use the volume another way: the cube is $${e}$ layers, each one face of $${e * e}$ unit cubes, and $${e} \\times ${e * e} = ${V}$.`,
                    `换一种方式用体积：正方体有 $${e}$ 层，每层是一个面，有 $${e * e}$ 个单位正方体，$${e} \\times ${e * e} = ${V}$。`,
                  ]
                : [
                    `Count the faces in pairs: top and bottom, front and back, left and right each give $2 \\times ${e * e} = ${2 * e * e}$, and $3 \\times ${2 * e * e} = ${6 * e * e}$.`,
                    `把面成对数：上下、前后、左右各是 $2 \\times ${e * e} = ${2 * e * e}$，$3 \\times ${2 * e * e} = ${6 * e * e}$。`,
                  ];
          return valued(
            [`A cube has a volume of $${V}$ ${volume.en}. ${qEn}`, `一个正方体的体积是 $${V}$ ${volume["zh-CN"]}。${qZh}`],
            answer,
            [
              [
                ["Set up the equation", "列方程"],
                [`The edge $e$ satisfies $e^{3} = ${V}$.`, `棱长 $e$ 满足 $e^{3} = ${V}$。`],
              ],
              [["Take the cube root", "开立方"], [`$${e}^{3} = ${V}$, so:`, `$${e}^{3} = ${V}$，所以：`], [`e = \\sqrt[3]{${V}} = ${e}`]],
              ...last,
            ],
            check,
            ask === "edge"
              ? [
                  [Q.of(V, 3), "That divides the volume by $3$; the edge is its cube root.", "这是把体积除以 $3$；棱长是它的立方根。"],
                  [Q.of(V, 6), "That divides the volume by $6$, as if counting faces.", "这是把体积除以 $6$，像在数面。"],
                ]
              : ask === "face"
                ? [
                    [e, "That is the edge, not the area of a face.", "这是棱长，不是一个面的面积。"],
                    [
                      Q.of(V, 6),
                      "That divides the volume by $6$; a face is the edge squared.",
                      "这是把体积除以 $6$；一个面的面积是棱长的平方。",
                    ],
                  ]
                : [
                    [e * e, "That is one face, not all six.", "这只是一个面，不是六个面。"],
                    [Q.of(V, 6), "That divides the volume by $6$; the surface is six faces.", "这是把体积除以 $6$；表面积是六个面的和。"],
                    [6 * e, "That multiplies the edge by $6$ instead of a face.", "这是把棱长乘 $6$，而不是把面积乘 $6$。"],
                  ],
          );
        },
        tapeFigure(
          [
            {
              total: "7 × 7 × 7 = 343",
              pieces: [
                { size: 1, text: "7", lit: true },
                { size: 1, text: "7" },
                { size: 1, text: "7" },
              ],
            },
          ],
          [
            "Three equal edges of 7 multiplied to give the volume 343, so the edge is the cube root, 7.",
            "三条相等的棱 7 相乘得体积 343，所以棱长是立方根 7。",
          ],
        ),
      ),
    ],
  ),
  [
    "A square rug covers $81$ m², and a cube-shaped box holds $343$ in³. Their sides are hidden in the area and the volume.",
    "一块正方形地毯的面积是 $81$ 平方米，一个正方体箱子的体积是 $343$ 立方英寸。它们的边长就藏在面积和体积里。",
  ],
  ["$9 \\times 9 = 81$ and $7 \\times 7 \\times 7 = 343$.", "$9 \\times 9 = 81$，$7 \\times 7 \\times 7 = 343$。"],
  ["find the side of a square from its area and the edge of a cube from its volume.", "由面积求正方形的边长，由体积求正方体的棱长。"],
);

/** grade8RadicalTopics lists the 8th grade topics on radicals. */
export const grade8RadicalTopics: readonly TopicDef[] = [
  theSquareRootOfAPerfectSquare,
  squaringASquareRoot,
  theCubeRootOfAPerfectCube,
  surds,
  theProductRuleForRadicals,
  theQuotientRuleForRadicals,
  solvingRadicalEquationsWithSquareRoots,
  solvingEquationsUsingCubeRoots,
  solvingRadicalEquationsWithCubeRoots,
  findingSideLengthsOfSquaresAndCubesFromAreaOrVolume,
];

/** countingTheSurds counts the surds in a list of roots; it is the third point of surds, to take the place of the one in the deeper files. */
export const countingTheSurds = lesson(
  "counting-the-surds",
  ["Counting the surds", "数一数不尽根数"],
  [
    [
      "A surd is a root that cannot be written as a fraction. Roots of perfect squares and perfect cubes are whole numbers in disguise: $\\sqrt{49} = 7$ and $\\sqrt[3]{27} = 3$. So simplify each root before you count it.",
      "不能写成分数的根式叫作不尽根数。完全平方数和完全立方数的根其实是整数：$\\sqrt{49} = 7$，$\\sqrt[3]{27} = 3$。所以先化简每个根式，再计数。",
    ],
    ["$7^{2} = 49$ and $3^{3} = 27$, so neither of them is a surd.", "$7^{2} = 49$，$3^{3} = 27$，所以它们都不是不尽根数。"],
    [
      "Match the test to the root. $\\sqrt[3]{25}$ is a surd, even though $25$ is a perfect square.",
      "判断要看根指数。$\\sqrt[3]{25}$ 是不尽根数，尽管 $25$ 是完全平方数。",
    ],
  ],
  (rng) => {
    const draw = () => {
      const kind = rng.int(0, 3);
      if (kind === 0) {
        const r = rng.int(2, 15);
        return { latex: `\\sqrt{${r ** 2}}`, value: r };
      }
      if (kind === 1) {
        const r = rng.int(2, 6);
        return { latex: `\\sqrt[3]{${r ** 3}}`, value: r };
      }
      if (kind === 2) return { latex: `\\sqrt{${rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 15, 17])}}` };
      return { latex: `\\sqrt[3]{${rng.pick([2, 3, 4, 5, 6, 7, 9, 10, 15, 25])}}` };
    };
    const size = rng.int(4, 6);
    const items: { latex: string; value?: number }[] = [];
    while (items.length < size) {
      const item = draw();
      if (!items.some((x) => x.latex === item.latex)) items.push(item);
    }
    const exact = items.filter((x) => x.value !== undefined);
    const surds = items.filter((x) => x.value === undefined).map((x) => x.latex);
    const count = surds.length;
    const list = items.map((x) => x.latex).join(",\\quad ");
    return valued(
      [`How many of these are surds? $$${list}$$`, `其中有几个不尽根数？$$${list}$$`],
      count,
      [
        exact.length === 0
          ? [
              ["Find the exact roots", "找出能开尽的根式"],
              ["None of them come out exact.", "没有一个能开尽。"],
            ]
          : [
              ["Find the exact roots", "找出能开尽的根式"],
              ["These are roots of perfect squares or perfect cubes:", "这些是完全平方数或完全立方数的根："],
              exact.map((x) => `${x.latex} = ${x.value}`),
            ],
        count === 0
          ? [
              ["Count the rest", "数剩下的"],
              ["Nothing is left, so there are no surds.", "没有剩下的，所以一个不尽根数也没有。"],
            ]
          : [
              ["Count the rest", "数剩下的"],
              [`The others are surds. There ${count === 1 ? "is" : "are"} $${count}$:`, `其余的是不尽根数，共 $${count}$ 个：`],
              [surds.join(",\\;")],
            ],
      ],
      [
        `Every root is counted once: $${exact.length}$ exact and $${count}$ surds make $${size}$.`,
        `每个根式都只数一次：$${exact.length}$ 个能开尽，$${count}$ 个不尽根数，共 $${size}$ 个。`,
      ],
      [
        [size, "That counts every root; some of them come out exact.", "这是把每个根式都算上了；有些能开尽。"],
        [size - count, "That counts the exact roots instead of the surds.", "这是数了能开尽的根式，而不是不尽根数。"],
        [count + 1, "That counts one exact root as a surd.", "这是把一个能开尽的根式算成了不尽根数。"],
      ],
    );
  },
  lineFigure(
    {
      lo: 6,
      hi: 8,
      step: 0.5,
      labels: [6, 7, 8],
      marks: [
        { at: 7, text: "√49" },
        { at: Math.sqrt(55), text: "√55", result: true },
      ],
    },
    [
      "A number line from 6 to 8: √49 lands on 7, while √55 falls between 7 and 8.",
      "一条从 6 到 8 的数轴：√49 正好落在 7 上，而 √55 落在 7 和 8 之间。",
    ],
  ),
);

/** theRootOfASum takes the square root of a sum after working out the sum; it is the third point of the-square-root-of-a-perfect-square, to take the place of the one in the deeper files. */
export const theRootOfASum = lesson(
  "the-root-of-a-sum",
  ["The root of a sum", "和的平方根"],
  [
    [
      "The square root of a sum is not the sum of the square roots. Work out what is under the root first, and only then take the root, as the root sign acts like parentheses: $\\sqrt{9 + 16} = \\sqrt{25} = 5$.",
      "和的平方根不等于平方根的和。先算出根号下的值，再开方，因为根号的作用类似于括号：$\\sqrt{9 + 16} = \\sqrt{25} = 5$。",
    ],
    [
      "Take out a common square: $36 + 64 = 4 \\cdot (9 + 16) = 4 \\cdot 25$, so $\\sqrt{36 + 64} = 2 \\cdot 5 = 10$.",
      "提出公共的平方因数：$36 + 64 = 4 \\cdot (9 + 16) = 4 \\cdot 25$，所以 $\\sqrt{36 + 64} = 2 \\cdot 5 = 10$。",
    ],
    ["$\\sqrt{9 + 16}$ is not $3 + 4 = 7$, since $7^{2} = 49$.", "$\\sqrt{9 + 16}$ 不是 $3 + 4 = 7$，因为 $7^{2} = 49$。"],
  ],
  (rng) => {
    const [a, b, c] = rng.pick<[number, number, number]>([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
      [20, 21, 29],
    ]);
    const k = rng.int(1, 6);
    const [p, q, r] = [a * k, b * k, c * k];
    return valued(
      [`Evaluate $\\sqrt{${p * p} + ${q * q}}$.`, `计算 $\\sqrt{${p * p} + ${q * q}}$。`],
      r,
      [
        [
          ["Work under the root first", "先算根号里面"],
          ["The root sign groups the sum, so add first:", "根号把和括在一起，所以先相加："],
          [`${p * p} + ${q * q} = ${r * r}`],
        ],
        [["Take the root", "开平方"], [`$${r}^{2} = ${r * r}$, so:`, `$${r}^{2} = ${r * r}$，所以：`], [`\\sqrt{${r * r}} = ${r}`]],
      ],
      k === 1
        ? grouped(r, 2)
        : [
            `Take out the common square first: $${p * p} + ${q * q} = ${k * k} \\cdot (${a * a} + ${b * b}) = ${k * k} \\cdot ${c * c}$. The root of each factor gives $${k} \\cdot ${c} = ${r}$.`,
            `先提出公共的平方因数：$${p * p} + ${q * q} = ${k * k} \\cdot (${a * a} + ${b * b}) = ${k * k} \\cdot ${c * c}$。每个因数分别开方，得 $${k} \\cdot ${c} = ${r}$。`,
          ],
      [
        [
          p + q,
          `That takes each root and adds them, but $${p + q}^{2} = ${(p + q) ** 2}$, not $${r * r}$.`,
          `这是分别开方再相加，但 $${p + q}^{2} = ${(p + q) ** 2}$，不是 $${r * r}$。`,
        ],
        [p * q, "That multiplies the two roots.", "这是把两个平方根相乘了。"],
        [r * r, "That adds but forgets to take the root.", "这是相加了，却忘了开方。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "9 + 16 = 25 = 5²",
        pieces: [
          { size: 9, text: "9" },
          { size: 16, text: "16", lit: true },
        ],
      },
    ],
    [
      "A bar of 9 and 16 making 25 under one root: the root of the whole is 5, not 3 + 4.",
      "一个长条：9 和 16 合起来是 25，在同一个根号下：整体的平方根是 5，不是 3 + 4。",
    ],
  ),
);

/** theRootOfANegativeSquared takes the square root of a negative number squared; it is the third point of squaring-a-square-root, to take the place of the one in the deeper files. */
export const theRootOfANegativeSquared = lesson(
  "the-root-of-a-negative-squared",
  ["The root of a negative squared", "负数平方后的根"],
  [
    [
      "Squaring and then taking the root does not always return the start. The square makes a negative number positive, and the root sign means the root that is not negative: $\\sqrt{(-5)^{2}} = \\sqrt{25} = 5$.",
      "先平方再开方不一定回到原数。平方把负数变成正数，而根号表示非负的那个根：$\\sqrt{(-5)^{2}} = \\sqrt{25} = 5$。",
    ],
    ["$5$ is not negative and $5^{2} = 25$.", "$5$ 不是负数，且 $5^{2} = 25$。"],
    ["The answer is not $-5$: a square root sign never gives a negative number.", "答案不是 $-5$：根号永远不会给出负数。"],
  ],
  (rng) => {
    const a = rng.int(2, 60);
    return valued(
      [`Evaluate $\\sqrt{(-${a})^{2}}$.`, `计算 $\\sqrt{(-${a})^{2}}$。`],
      a,
      [
        [["Square first", "先平方"], ["Work inside the root:", "先算根号里面："], [`(-${a})^{2} = ${a * a}`]],
        [
          ["Take the root", "开平方"],
          ["The root sign means the root that is not negative:", "根号表示非负的根："],
          [`\\sqrt{${a * a}} = ${a}`],
        ],
      ],
      grouped(a, 2),
      [
        [-a, "That keeps the minus sign, but a root sign never gives a negative number.", "这是保留了负号，但根号永远不会给出负数。"],
        [a * a, "That squares but forgets to take the root.", "这是平方了，却忘了开方。"],
        [-a * a, `That squares the $${a}$ only and keeps the sign, then forgets the root.`, `这是只把 $${a}$ 平方并保留负号，又忘了开方。`],
      ],
    );
  },
  lineFigure(
    {
      lo: -6,
      hi: 6,
      step: 1,
      labels: [-5, 0, 5],
      marks: [
        { at: -5, text: "−5" },
        { at: 5, text: "√25 = 5", result: true },
      ],
    },
    [
      "A number line with −5 and 5: (−5)² = 25, and √25 is the root that is not negative, 5.",
      "数轴上标出 −5 和 5：(−5)² = 25，而 √25 是非负的根 5。",
    ],
  ),
);

/** sumsOfCubeRoots adds cube roots, each with its own sign; it is the third point of the-cube-root-of-a-perfect-cube, to take the place of the one in the deeper files. */
export const sumsOfCubeRoots = lesson(
  "sums-of-cube-roots",
  ["Sums of cube roots", "立方根的和"],
  [
    [
      "A negative number has a negative cube root, because three negative factors multiply to a negative number. So each cube root in a sum carries its own sign: $2\\sqrt[3]{27} + \\sqrt[3]{-8} = 2 \\cdot 3 + (-2) = 4$.",
      "负数的立方根是负数，因为三个负因数的积是负数。所以和中的每个立方根都带着自己的符号：$2\\sqrt[3]{27} + \\sqrt[3]{-8} = 2 \\cdot 3 + (-2) = 4$。",
    ],
    ["Cube each root to confirm it: $3^{3} = 27$ and $(-2)^{3} = -8$.", "把每个立方根立方来确认：$3^{3} = 27$，$(-2)^{3} = -8$。"],
    [
      "$\\sqrt[3]{-8}$ is $-2$, not $2$; dropping the sign gives $8$ instead of $4$.",
      "$\\sqrt[3]{-8}$ 是 $-2$，不是 $2$；丢掉符号会得到 $8$ 而不是 $4$。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 10);
    const b = rng.int(2, 10);
    const k = rng.int(2, 6);
    const v = k * b - a;
    return valued(
      [`Evaluate $${k}\\sqrt[3]{${b ** 3}} + \\sqrt[3]{-${a ** 3}}$.`, `计算 $${k}\\sqrt[3]{${b ** 3}} + \\sqrt[3]{-${a ** 3}}$。`],
      v,
      [
        [
          ["Take each cube root", "分别开立方"],
          ["Each root keeps the sign of its number:", "每个立方根保持根号内数的符号："],
          [`\\sqrt[3]{${b ** 3}} = ${b}`, `\\sqrt[3]{-${a ** 3}} = -${a}`],
        ],
        [
          ["Combine", "合并"],
          [`Multiply the first by $${k}$ and add:`, `第一个乘 $${k}$，再相加：`],
          [`${k} \\cdot ${b} + (-${a}) = ${v}`],
        ],
      ],
      [
        `Cube each root to confirm it: $${b}^{3} = ${b ** 3}$ and $(-${a})^{3} = -${a ** 3}$. Then add in the other order: $-${a} + ${k * b} = ${v}$.`,
        `把每个立方根立方来确认：$${b}^{3} = ${b ** 3}$，$(-${a})^{3} = -${a ** 3}$。再换个顺序相加：$-${a} + ${k * b} = ${v}$。`,
      ],
      [
        [k * b + a, "That drops the sign; the cube root of a negative number is negative.", "这是丢掉了符号；负数的立方根是负数。"],
        [b - a, `That leaves out the $${k}$ in front of the first root.`, `这是漏掉了第一个根号前的 $${k}$。`],
        [k * (b - a), `That multiplies the second root by $${k}$ as well.`, `这是把第二个根也乘了 $${k}$。`],
      ],
    );
  },
  lineFigure(
    {
      lo: -3,
      hi: 7,
      step: 1,
      labels: [-2, 0, 4, 6],
      marks: [
        { at: 6, text: "2∛27 = 6" },
        { at: 4, text: "4", result: true },
      ],
      jumps: [[6, 4]],
    },
    [
      "A number line: from 6, which is 2∛27, a jump back 2 for ∛(−8) = −2 lands on 4.",
      "一条数轴：从 6（即 2∛27）出发，∛(−8) = −2 让它向回跳 2 格，落在 4。",
    ],
  ),
);

/** theMissingNumberUnderARoot finds the number under a root that makes a product of roots whole; it is the third point of the-product-rule-for-radicals, to take the place of the one in the deeper files. */
export const theMissingNumberUnderARoot = lesson(
  "the-missing-number-under-a-root",
  ["The missing number under a root", "根号下缺少的数"],
  [
    [
      "A product of square roots is the root of the product. So if the result is a whole number, its square is the product under the root, and division gives the missing number: $\\sqrt{3} \\cdot \\sqrt{\\square} = 6$ means $3 \\cdot \\square = 36$, so the box holds $12$.",
      "平方根的积等于积的平方根。所以结果是整数时，它的平方就是根号下的积，用除法求缺少的数：$\\sqrt{3} \\cdot \\sqrt{\\square} = 6$，即 $3 \\cdot \\square = 36$，所以方框里是 $12$。",
    ],
    [
      "Simplify: $\\sqrt{12} = 2\\sqrt{3}$, and $\\sqrt{3} \\cdot 2\\sqrt{3} = 2 \\cdot 3 = 6$.",
      "化简：$\\sqrt{12} = 2\\sqrt{3}$，$\\sqrt{3} \\cdot 2\\sqrt{3} = 2 \\cdot 3 = 6$。",
    ],
    ["Square the result before dividing: the box is not $6 \\div 3 = 2$.", "相除之前要先把结果平方：方框里不是 $6 \\div 3 = 2$。"],
  ],
  (rng) => {
    const k = rng.pick([2, 3, 5, 6, 7, 10, 11]);
    const m = rng.int(2, 9);
    const v = k * m * m;
    return valued(
      [
        `What number goes in the box? $$\\sqrt{${k}} \\cdot \\sqrt{\\square} = ${k * m}$$`,
        `方框里是什么数？$$\\sqrt{${k}} \\cdot \\sqrt{\\square} = ${k * m}$$`,
      ],
      v,
      [
        [
          ["Square both sides", "两边平方"],
          ["Squaring turns the product of roots into the product under them:", "平方后，根式之积变成根号内的数之积："],
          [`${k} \\cdot \\square = ${(k * m) ** 2}`],
        ],
        [["Divide", "相除"], [`Divide by $${k}$:`, `两边除以 $${k}$：`], [`\\square = ${(k * m) ** 2} \\div ${k} = ${v}`]],
      ],
      [
        `Simplify the root you found: $\\sqrt{${v}} = ${m}\\sqrt{${k}}$, and $\\sqrt{${k}} \\cdot ${m}\\sqrt{${k}} = ${m} \\cdot ${k} = ${k * m}$.`,
        `化简求出的根式：$\\sqrt{${v}} = ${m}\\sqrt{${k}}$，$\\sqrt{${k}} \\cdot ${m}\\sqrt{${k}} = ${m} \\cdot ${k} = ${k * m}$。`,
      ],
      [
        [m, "That divides the result by the number under the root without squaring it.", "这是没有平方，直接用结果除以根号里的数。"],
        [k * m, "That is the result itself, not the number under the root.", "这是结果本身，不是根号里的数。"],
        [m * m, "That squares only part of the result.", "这是只把结果的一部分平方了。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "3 · 12 = 36 = 6²",
        pieces: [
          { size: 1, text: "3" },
          { size: 4, text: "12", lit: true },
        ],
      },
    ],
    [
      "A bar of 3 and the missing 12 making 36 under one root, so the product of roots is 6.",
      "一个长条：3 和缺少的 12 在同一个根号下相乘得 36，所以根式之积是 6。",
    ],
  ),
);

/** theMissingNumberInAQuotientOfRoots finds the number under the upper root of a quotient of roots; it is the third point of the-quotient-rule-for-radicals, to take the place of the one in the deeper files. */
export const theMissingNumberInAQuotientOfRoots = lesson(
  "the-missing-number-in-a-quotient-of-roots",
  ["The missing number in a quotient of roots", "根式商中缺少的数"],
  [
    [
      "A quotient of square roots is the root of the quotient. Squaring the result gives that quotient, and multiplying by the number under the lower root gives the number under the upper one: $\\frac{\\sqrt{\\square}}{\\sqrt{2}} = 3$ means $\\square = 2 \\cdot 9 = 18$.",
      "平方根的商等于商的平方根。把结果平方得到这个商，再乘分母根号下的数，就得到分子根号下的数：$\\frac{\\sqrt{\\square}}{\\sqrt{2}} = 3$，所以 $\\square = 2 \\cdot 9 = 18$。",
    ],
    [
      "Simplify: $\\sqrt{18} = 3\\sqrt{2}$, and dividing by $\\sqrt{2}$ leaves $3$.",
      "化简：$\\sqrt{18} = 3\\sqrt{2}$，除以 $\\sqrt{2}$ 剩下 $3$。",
    ],
    ["Square the result first: the box is not $2 \\cdot 3 = 6$.", "要先把结果平方：方框里不是 $2 \\cdot 3 = 6$。"],
  ],
  (rng) => {
    const a = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
    const b = rng.int(2, 10);
    const v = a * b * b;
    const box = `\\frac{\\sqrt{\\square}}{\\sqrt{${a}}}`;
    return valued(
      [`What number goes in the box? $$${box} = ${b}$$`, `方框里是什么数？$$${box} = ${b}$$`],
      v,
      [
        [
          ["Square both sides", "两边平方"],
          ["Squaring turns the quotient of roots into the quotient under them:", "平方后，根式之商变成根号内的数之商："],
          [`\\frac{\\square}{${a}} = ${b * b}`],
        ],
        [["Multiply", "相乘"], [`Multiply by $${a}$:`, `两边乘 $${a}$：`], [`\\square = ${a} \\cdot ${b * b} = ${v}`]],
      ],
      [
        `Simplify the root you found: $\\sqrt{${v}} = ${b}\\sqrt{${a}}$, and dividing by $\\sqrt{${a}}$ leaves $${b}$.`,
        `化简求出的根式：$\\sqrt{${v}} = ${b}\\sqrt{${a}}$，除以 $\\sqrt{${a}}$ 剩下 $${b}$。`,
      ],
      [
        [a * b, "That multiplies by the result without squaring it.", "这是没有平方，直接乘了结果。"],
        [
          b * b,
          "That squares the result but does not multiply by the number under the lower root.",
          "这是把结果平方了，却没有乘分母根号里的数。",
        ],
        [a + b * b, "That adds instead of multiplying.", "这是相加了，而不是相乘。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "18 ÷ 2 = 9 = 3²",
        pieces: [
          { size: 1, text: "2", lit: true },
          { size: 1, text: "2" },
          { size: 1, text: "2" },
          { size: 1, text: "2" },
          { size: 1, text: "2" },
          { size: 1, text: "2" },
          { size: 1, text: "2" },
          { size: 1, text: "2" },
          { size: 1, text: "2" },
        ],
      },
    ],
    [
      "A bar of 18 cut into nine pieces of 2: the quotient 9 is 3², so the quotient of roots is 3.",
      "一个表示 18 的长条，切成九段 2：商 9 是 3²，所以根式之商是 3。",
    ],
  ),
);

/** aCubeOfASum solves (x + a)^3 = c by taking the cube root; it is the third point of solving-equations-using-cube-roots, to take the place of the one in the deeper files. */
export const aCubeOfASum = lesson(
  "a-cube-of-a-sum",
  ["A cube of a sum", "和的立方"],
  [
    [
      "When an expression in parentheses is cubed, taking the cube root leaves the expression. Then one more step finds $x$: $(x + 3)^{3} = -8$ gives $x + 3 = -2$, so $x = -5$. A cube has only one real root, unlike a square.",
      "括号内的式子立方时，开立方后剩下这个式子。再走一步求出 $x$：$(x + 3)^{3} = -8$ 得 $x + 3 = -2$，所以 $x = -5$。与平方不同，立方只有一个实数根。",
    ],
    ["Substitute: $-5 + 3 = -2$ and $(-2)^{3} = -8$.", "代入检验：$-5 + 3 = -2$，$(-2)^{3} = -8$。"],
    ["Take the cube root before subtracting: $-8 - 3 = -11$ is not $x$.", "先开立方再相减：$-8 - 3 = -11$ 不是 $x$。"],
  ],
  (rng) => {
    const a = rng.int(1, 15);
    const b = rng.int(1, 6);
    const neg = rng.bool();
    const value = neg ? -(b ** 3) : b ** 3;
    const root = neg ? -b : b;
    const x = root - a;
    return valued(
      [`Solve $(x + ${a})^{3} = ${value}$.`, `解方程 $(x + ${a})^{3} = ${value}$。`],
      x,
      [
        [
          ["Take the cube root", "开立方"],
          ["The cube root of both sides leaves what is in the parentheses:", "两边开立方，剩下括号里的式子："],
          [`x + ${a} = \\sqrt[3]{${value}} = ${root}`],
        ],
        [["Subtract", "相减"], [`Subtract $${a}$ from both sides:`, `两边减 $${a}$：`], [`x = ${root} - ${a} = ${x}`]],
      ],
      [
        `Substitute: $${x} + ${a} = ${root}$, and $${cubed(root)} = ${value}$.`,
        `代入检验：$${x} + ${a} = ${root}$，$${cubed(root)} = ${value}$。`,
      ],
      [
        [root + a, `That adds $${a}$ instead of subtracting it.`, `这是加了 $${a}$，而不是减去。`],
        [-root - a, "That gives the cube root the wrong sign.", "这是把立方根的符号弄反了。"],
        [value - a, "That subtracts before taking the cube root.", "这是还没开立方就相减了。"],
      ],
      { solveFor: "x" },
    );
  },
  lineFigure(
    {
      lo: -6,
      hi: 1,
      step: 1,
      labels: [-5, -2, 0],
      marks: [
        { at: -2, text: "x + 3 = −2" },
        { at: -5, text: "x = −5", result: true },
      ],
      jumps: [[-2, -5]],
    },
    [
      "A number line: x + 3 sits at −2, the cube root of −8, and a jump back 3 lands on x = −5.",
      "一条数轴：x + 3 在 −2，即 −8 的立方根，向回跳 3 格落在 x = −5。",
    ],
  ),
);

/** aCoefficientBeforeTheCubeRoot isolates a cube root with a coefficient before cubing; it is the third point of solving-radical-equations-with-cube-roots, to take the place of the one in the deeper files. */
export const aCoefficientBeforeTheCubeRoot = lesson(
  "a-coefficient-before-the-cube-root",
  ["A coefficient before the cube root", "立方根前的系数"],
  [
    [
      "Isolate the cube root completely before cubing: take away any added number, then divide by the coefficient. $2\\sqrt[3]{x} + 1 = 7$ gives $2\\sqrt[3]{x} = 6$, then $\\sqrt[3]{x} = 3$, so $x = 27$.",
      "立方之前要把立方根完全分离：先减去加上的数，再除以系数。$2\\sqrt[3]{x} + 1 = 7$ 得 $2\\sqrt[3]{x} = 6$，再得 $\\sqrt[3]{x} = 3$，所以 $x = 27$。",
    ],
    ["Substitute: $\\sqrt[3]{27} = 3$ and $2 \\cdot 3 + 1 = 7$.", "代入检验：$\\sqrt[3]{27} = 3$，$2 \\cdot 3 + 1 = 7$。"],
    ["Cubing too early cubes the coefficient as well: $6^{3} = 216$ is wrong.", "过早立方会把系数也立方：$6^{3} = 216$ 是错的。"],
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const r = rng.int(-5, 6) || 2;
    const a = rng.int(1, 20);
    const c = k * r + a;
    return valued(
      [`Solve $${k}\\sqrt[3]{x} + ${a} = ${c}$.`, `解方程 $${k}\\sqrt[3]{x} + ${a} = ${c}$。`],
      r ** 3,
      [
        [
          ["Isolate the cube root", "把立方根单独留下"],
          [`Subtract $${a}$, then divide by $${k}$:`, `两边减 $${a}$，再除以 $${k}$：`],
          [`${k}\\sqrt[3]{x} = ${k * r}`, `\\sqrt[3]{x} = ${r}`],
        ],
        [["Cube both sides", "两边立方"], ["Cubing undoes the cube root:", "立方可以抵消立方根："], [`x = ${paren(r)}^{3} = ${r ** 3}`]],
      ],
      [
        `Substitute: $\\sqrt[3]{${r ** 3}} = ${r}$, and $${k} \\cdot ${paren(r)} + ${a} = ${c}$.`,
        `代入检验：$\\sqrt[3]{${r ** 3}} = ${r}$，$${k} \\cdot ${paren(r)} + ${a} = ${c}$。`,
      ],
      [
        [r, "That finds the cube root but does not cube it.", "这是求出了立方根，却没有立方。"],
        [
          (k * r) ** 3,
          "That cubes before dividing by the coefficient, so the coefficient is cubed too.",
          "这是还没除以系数就立方了，把系数也立方了。",
        ],
        [k * r ** 3, "That cubes the root but keeps the coefficient.", "这是把根立方了，却保留了系数。"],
      ],
      { solveFor: "x" },
    );
  },
  tapeFigure(
    [
      {
        total: "2∛x + 1 = 7",
        pieces: [
          { size: 3, text: "∛x", lit: true },
          { size: 3, text: "∛x", lit: true },
          { size: 1, text: "+1", dashed: true },
        ],
      },
    ],
    [
      "A bar of two pieces ∛x and a dashed +1 making 7: take away the 1, split the 6 in two, and ∛x = 3.",
      "一个长条：两段 ∛x 和虚线的 +1，合起来是 7：去掉 1，把 6 平分成两份，∛x = 3。",
    ],
  ),
);

/** theVolumeFromTheSurfaceArea finds the volume of a cube from its surface area; it is the third point of finding-side-lengths-of-squares-and-cubes-from-area-or-volume, to take the place of the one in the deeper files. */
export const theVolumeFromTheSurfaceArea = lesson(
  "the-volume-from-the-surface-area",
  ["The volume from the surface area", "由表面积求体积"],
  [
    [
      "A cube has six equal square faces, so one face is a sixth of the surface area. Its square root gives the edge, and the cube of the edge gives the volume: a surface of $54$ cm² has faces of $9$ cm², edges of $3$ cm and a volume of $27$ cm³.",
      "立方体有六个相等的正方形面，所以一个面是表面积的六分之一。开平方得棱长，棱长的立方就是体积：表面积 $54$ 平方厘米，每个面 $9$ 平方厘米，棱长 $3$ 厘米，体积 $27$ 立方厘米。",
    ],
    [
      "Go back from the volume: $\\sqrt[3]{27} = 3$, a face is $3^{2} = 9$, and $6 \\cdot 9 = 54$.",
      "从体积倒推：$\\sqrt[3]{27} = 3$，一个面是 $3^{2} = 9$，$6 \\cdot 9 = 54$。",
    ],
    [
      "The volume is not the face area: $9$ is one face, and the volume needs the edge cubed.",
      "体积不是一个面的面积：$9$ 是一个面，体积要用棱长的立方。",
    ],
  ],
  (rng) => {
    const s = rng.int(2, 30);
    return valued(
      [
        `A cube has a surface area of $${6 * s * s}$ square centimeters. What is its volume, in cubic centimeters?`,
        `一个立方体的表面积是 $${6 * s * s}$ 平方厘米。它的体积是多少立方厘米？`,
      ],
      s ** 3,
      [
        [["Find one face", "求一个面"], ["A cube has six equal faces:", "立方体有六个相等的面："], [`${6 * s * s} \\div 6 = ${s * s}`]],
        [
          ["Find the edge", "求棱长"],
          ["A face is a square, so take the root:", "每个面是正方形，所以开平方："],
          [`\\sqrt{${s * s}} = ${s}`],
        ],
        [["Find the volume", "求体积"], ["Cube the edge:", "把棱长立方："], [`${s}^{3} = ${s ** 3}`]],
      ],
      [
        `Go back from the volume: $\\sqrt[3]{${s ** 3}} = ${s}$, one face is $${s}^{2} = ${s * s}$, and $6 \\cdot ${s * s} = ${6 * s * s}$.`,
        `从体积倒推：$\\sqrt[3]{${s ** 3}} = ${s}$，一个面是 $${s}^{2} = ${s * s}$，$6 \\cdot ${s * s} = ${6 * s * s}$。`,
      ],
      [
        [s * s, "That is the area of one face, not the volume.", "这是一个面的面积，不是体积。"],
        [6 * s, "That multiplies the edge by $6$.", "这是把棱长乘了 $6$。"],
        [6 * s ** 3, "That multiplies the volume by the six faces.", "这是把体积又乘了六个面。"],
      ],
    );
  },
  tapeFigure(
    [{ total: "54 cm²", pieces: Array.from({ length: 6 }, (_, i) => ({ size: 1, text: "9", lit: i === 0 })) }],
    [
      "A bar of 54 cut into six equal faces of 9: one face is 9, so the edge is 3 and the volume 27.",
      "一个表示 54 的长条，切成六个相等的面，每个 9：一个面是 9，所以棱长 3，体积 27。",
    ],
  ),
);
