import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, num, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";
import type { Pair } from "./early-grades-more-kit.ts";
import { compareProblem, mathText, pickChoice } from "./grade-4-fractions.ts";
import { lesson, valued, withIntro } from "./grade-6-kit.ts";
import { lineFigure } from "./upper-grades-kit.ts";

// 8th Grade Math, the real number system: classifying roots as rational or irrational, approximating roots, comparing
// and ordering real numbers, and estimating expressions with irrational numbers.

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

/** iroot is the integer part of the k-th root of a nonnegative integer n. */
function iroot(n: number, k: 2 | 3): number {
  let r = Math.floor(k === 2 ? Math.sqrt(n) : Math.cbrt(n));
  while (r ** k > n) r--;
  while ((r + 1) ** k <= n) r++;
  return r;
}

/** rationalRoot is the k-th root of a nonnegative rational q when it is rational. */
function rationalRoot(q: Q, k: 2 | 3): Q | undefined {
  const [n, d] = [Number(q.n), Number(q.d)];
  const [rn, rd] = [iroot(n, k), iroot(d, k)];
  return rn ** k === n && rd ** k === d ? Q.of(rn, rd) : undefined;
}

/** rootLatex writes the square or cube root of the LaTeX expression x. */
const rootLatex = (x: string, k: 2 | 3) => (k === 2 ? `\\sqrt{${x}}` : `\\sqrt[3]{${x}}`);

/** approx writes a positive real number rounded to two decimal places. */
const approx = (x: number) => x.toFixed(2);

/** rationalIrrational are the options of a rational-or-irrational question. */
const rationalIrrational: readonly Text[] = [t("Rational", "有理数"), t("Irrational", "无理数")];

// ---------------------------------------------------------------------------
// Classifying roots

/** Radicand is a number under a root sign: its value and how it is written. */
interface Radicand {
  readonly value: Q;
  readonly latex: string;
}

/** squareRadicand draws a number under a square root, rational or not, including ones that only look irrational. */
function squareRadicand(rng: Rng): Radicand {
  switch (rng.pick(["integer", "integer", "fraction", "decimal", "quotient"] as const)) {
    case "integer": {
      const v = rng.bool() ? rng.int(2, 20) ** 2 : rng.pick([2, 3, 5, 8, 10, 12, 18, 20, 24, 27, 32, 40, 45, 50, 72, 99]);
      return { value: Q.of(v), latex: String(v) };
    }
    case "fraction": {
      const [a, b] = rng.pick([
        [4, 9],
        [1, 16],
        [9, 25],
        [25, 49],
        [2, 9],
        [4, 7],
        [1, 8],
        [3, 4],
        [16, 5],
        [49, 64],
      ] as const);
      return { value: Q.of(a, b), latex: `\\frac{${a}}{${b}}` };
    }
    case "decimal": {
      const v = rng.pick([Q.of(49, 100), Q.of(16, 100), Q.of(144, 100), Q.of(4, 10), Q.of(9, 10), Q.of(25, 10), Q.of(1, 1000)]);
      return { value: v, latex: dec(v) };
    }
    case "quotient": {
      // A fraction that simplifies: √(8/2) = √4 = 2, but √(8/4) = √2.
      const [a, b] = rng.pick([
        [8, 2],
        [27, 3],
        [50, 2],
        [12, 3],
        [8, 4],
        [18, 3],
        [45, 9],
        [20, 5],
      ] as const);
      return { value: Q.of(a, b), latex: `\\frac{${a}}{${b}}` };
    }
  }
}

/** cubeRadicand draws a number under a cube root, rational or not, including perfect squares that are not cubes. */
function cubeRadicand(rng: Rng): Radicand {
  switch (rng.pick(["integer", "integer", "fraction", "decimal"] as const)) {
    case "integer": {
      const v = rng.bool()
        ? rng.sign() * rng.int(1, 10) ** 3
        : rng.sign() * rng.pick([2, 4, 9, 16, 25, 36, 49, 81, 100, 10, 12, 20, 30, 50]);
      return { value: Q.of(v), latex: String(v) };
    }
    case "fraction": {
      const [a, b] = rng.pick([
        [8, 27],
        [1, 64],
        [27, 125],
        [1, 8],
        [4, 9],
        [1, 9],
        [8, 9],
        [2, 27],
      ] as const);
      const s = rng.sign();
      return { value: Q.of(s * a, b), latex: `${s < 0 ? "-" : ""}\\frac{${a}}{${b}}` };
    }
    case "decimal": {
      const v = rng.pick([Q.of(8, 1000), Q.of(27, 1000), Q.of(125, 1000), Q.of(1, 1000), Q.of(8, 100), Q.of(27, 10), Q.of(64, 100)]);
      return { value: v, latex: dec(v) };
    }
  }
}

/** classifyRoot asks whether the square or cube root of r is rational. */
function classifyRoot(r: Radicand, k: 2 | 3): Problem {
  const neg = r.value.sign() < 0;
  const root = rationalRoot(r.value.abs(), k);
  const expr = rootLatex(r.latex, k);
  const reduced = r.latex.includes("frac") && r.value.isInteger() ? num(r.value) : "";
  const simplifyEn = reduced ? `First simplify inside the root: $${expr} = ${rootLatex(reduced, k)}$. ` : "";
  const simplifyZh = reduced ? `先化简根号内的数：$${expr} = ${rootLatex(reduced, k)}$。` : "";
  const power = k === 2 ? "square" : "cube";
  const powerZh = k === 2 ? "平方" : "立方";
  const shown = (q: Q) => (r.latex.includes(".") ? dec(q) : num(q));
  const value = root && (neg ? root.neg() : root);
  return choiceProblem({
    prompt: t(`Is $${expr}$ rational or irrational?`, `$${expr}$ 是有理数还是无理数？`),
    options: rationalIrrational,
    correct: root ? 0 : 1,
    solution: value
      ? t(
          `${simplifyEn}$${value.sign() < 0 || !value.isInteger() ? `\\left(${shown(value)}\\right)` : shown(value)}^{${k}} = ${shown(r.value)}$, so $${expr} = ${shown(value)}$, which is rational.`,
          `${simplifyZh}$${value.sign() < 0 || !value.isInteger() ? `\\left(${shown(value)}\\right)` : shown(value)}^{${k}} = ${shown(r.value)}$，所以 $${expr} = ${shown(value)}$，是有理数。`,
        )
      : t(
          `${simplifyEn}$${reduced || shown(r.value)}$ is not the ${power} of a rational number, so its ${power} root is irrational.`,
          `${simplifyZh}$${reduced || shown(r.value)}$ 不是任何有理数的${powerZh}，所以它的${powerZh}根是无理数。`,
        ),
  });
}

/** classifyingSquareRootsAndCubeRootsAsRationalOrIrrational decides whether a root is rational. */
export const classifyingSquareRootsAndCubeRootsAsRationalOrIrrational = topic(
  "classifying-square-roots-and-cube-roots-as-rational-or-irrational",
  t("Classifying Square Roots and Cube Roots as Rational or Irrational", "判断平方根和立方根是有理数还是无理数"),
  t(
    "The square root of a number is rational exactly when the number is the square of a rational number, and the cube root exactly when it is the cube of one. A fraction in lowest terms has a rational square root only when both its numerator and its denominator are perfect squares; every other root of a rational number is irrational.",
    "一个数的平方根是有理数，当且仅当这个数是某个有理数的平方；立方根是有理数，当且仅当它是某个有理数的立方。最简分数的平方根是有理数，仅当分子和分母都是完全平方数；有理数的其他根都是无理数。",
  ),
  ["the-real-number-system"],
  ["8.NS.A.1"],
  [
    {
      id: "classifying-square-roots",
      title: t("Square roots", "平方根"),
      explanation: t(
        "$\\sqrt{49} = 7$ and $\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$ are rational, but $\\sqrt{50}$ is irrational, since $50$ is not a perfect square. Simplify first: $\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ is rational. Decimals need care: $\\sqrt{0.49} = 0.7$, but $0.4 = \\frac{2}{5}$, so $\\sqrt{0.4}$ is irrational.",
        "$\\sqrt{49} = 7$ 和 $\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$ 是有理数，而 $\\sqrt{50}$ 是无理数，因为 $50$ 不是完全平方数。要先化简：$\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ 是有理数。小数要小心：$\\sqrt{0.49} = 0.7$，但 $0.4 = \\frac{2}{5}$，所以 $\\sqrt{0.4}$ 是无理数。",
      ),
      generate: (rng) => classifyRoot(squareRadicand(rng), 2),
    },
    {
      id: "classifying-cube-roots",
      title: t("Cube roots", "立方根"),
      explanation: t(
        "$\\sqrt[3]{-64} = -4$ and $\\sqrt[3]{0.008} = 0.2$ are rational. A perfect square is not always a perfect cube: $\\sqrt[3]{16}$ is irrational, because $2^{3} = 8$ and $3^{3} = 27$ leave no integer whose cube is $16$.",
        "$\\sqrt[3]{-64} = -4$ 和 $\\sqrt[3]{0.008} = 0.2$ 是有理数。完全平方数不一定是完全立方数：$\\sqrt[3]{16}$ 是无理数，因为 $2^{3} = 8$，$3^{3} = 27$，没有立方等于 $16$ 的整数。",
      ),
      generate: (rng) => classifyRoot(cubeRadicand(rng), 3),
    },
  ],
);

// ---------------------------------------------------------------------------
// Approximating roots

/** nonPower draws an integer between lo and hi that is not a perfect k-th power. */
function nonPower(rng: Rng, lo: number, hi: number, k: 2 | 3): number {
  const n = rng.int(lo, hi);
  return iroot(n, k) ** k === n ? nonPower(rng, lo, hi, k) : n;
}

/** rootLine draws a number line from lo to hi with ticks every step, text under the given ticks, and one point with its text. */
function rootLine(
  lo: number,
  hi: number,
  step: number,
  labels: readonly number[],
  at: number,
  text: string,
  alt: Pair,
  places = 1,
): Figure {
  return lineFigure(
    { lo, hi, step, labels, label: (v) => v.toFixed(places).replace(/\.0+$/, ""), marks: [{ at, text, result: true }] },
    alt,
  );
}

/** approximatingSquareRootsAndCubeRoots finds the nearest integer and the nearest tenth of an irrational root. */
export const approximatingSquareRootsAndCubeRoots = withIntro(
  topic(
    "approximating-square-roots-and-cube-roots",
    t("Approximating Square Roots and Cube Roots", "估算平方根和立方根"),
    t(
      "An irrational root can be located between consecutive integers by finding the perfect squares or perfect cubes on either side of the number under the root. Squaring numbers with one decimal place narrows the root down to the nearest tenth.",
      "找出根号内的数两侧的完全平方数或完全立方数，就能确定无理根在哪两个连续整数之间。再把一位小数平方，就能把根精确到十分位。",
    ),
    ["classifying-square-roots-and-cube-roots-as-rational-or-irrational"],
    ["8.NS.A.2"],
    [
      lesson(
        "nearest-whole-number",
        ["The nearest whole number", "最接近的整数"],
        [
          [
            "A square rug has an area of $41$ square feet, so its side is $\\sqrt{41}$ feet. $6^{2} = 36$ and $7^{2} = 49$, so the side is between $6$ and $7$. The halfway value $6.5$ has $6.5^{2} = 42.25$. $41$ is less than that, so $\\sqrt{41}$ is closer to $6$.",
            "一块正方形地毯的面积是 $41$ 平方英尺，所以边长是 $\\sqrt{41}$ 英尺。$6^{2} = 36$，$7^{2} = 49$，所以边长在 $6$ 和 $7$ 之间。中间值 $6.5$ 的平方是 $6.5^{2} = 42.25$。$41$ 比它小，所以 $\\sqrt{41}$ 更接近 $6$。",
          ],
          [
            "$41$ is $5$ above $36$ but $8$ below $49$, so it sits nearer $6^{2}$.",
            "$41$ 比 $36$ 大 $5$，比 $49$ 小 $8$，所以离 $6^{2}$ 更近。",
          ],
          [
            "Do not halve the number. $41 \\div 2 = 20.5$ is far from $\\sqrt{41}$.",
            "不要把这个数除以 2。$41 \\div 2 = 20.5$ 和 $\\sqrt{41}$ 差得很远。",
          ],
        ],
        (rng) => {
          for (;;) {
            const k = rng.bool(0.65) ? 2 : 3;
            const n = k === 2 ? nonPower(rng, 5, 230, 2) : nonPower(rng, 3, 700, 3);
            const lo = iroot(n, k);
            const [a, b] = [lo ** k, (lo + 1) ** k];
            const up = n > (lo + 0.5) ** k;
            // The check compares distances, which must agree with the halfway value.
            if (up !== b - n < n - a || b - n === n - a) continue;
            const ans = up ? lo + 1 : lo;
            const expr = rootLatex(String(n), k);
            const mid = dec(Q.of((2 * lo + 1) ** k, 2 ** k));
            const word = k === 2 ? ["perfect squares", "完全平方数"] : ["perfect cubes", "完全立方数"];
            return valued(
              [`Which whole number is closest to $${expr}$?`, `哪个整数最接近 $${expr}$？`],
              ans,
              [
                [
                  [`Find the ${word[0]} on each side`, `找出两边的${word[1]}`],
                  [`$${lo}^{${k}} = ${a}$ and $${lo + 1}^{${k}} = ${b}$, so:`, `$${lo}^{${k}} = ${a}$，$${lo + 1}^{${k}} = ${b}$，所以：`],
                  [`${lo} < ${expr} < ${lo + 1}`],
                ],
                [
                  ["Test the halfway value", "检验中间值"],
                  [
                    `$${lo}.5^{${k}} = ${mid}$, and $${n}$ is ${up ? "more" : "less"} than that, so the root is ${up ? "above" : "below"} $${lo}.5$.`,
                    `$${lo}.5^{${k}} = ${mid}$，$${n}$ 比它${up ? "大" : "小"}，所以这个根${up ? "大于" : "小于"} $${lo}.5$。`,
                  ],
                ],
              ],
              [
                `Compare distances: $${n}$ is $${n - a}$ above $${a}$ and $${b - n}$ below $${b}$, so it is nearer $${ans}^{${k}}$.`,
                `比较距离：$${n}$ 比 $${a}$ 大 $${n - a}$，比 $${b}$ 小 $${b - n}$，所以离 $${ans}^{${k}}$ 更近。`,
              ],
              [
                [up ? lo : lo + 1, "That is the farther of the two neighbors.", "这是两个相邻整数中离得较远的那个。"],
                [Math.round(n / k), `That divides by ${k} instead of taking the root.`, `这是除以 ${k}，而不是开方。`],
              ],
            );
          }
        },
        rootLine(6, 7, 0.1, [6, 6.5, 7], Math.sqrt(41), "√41", [
          "A number line from 6 to 7 in tenths, with 6.5 marked and √41 plotted left of 6.5.",
          "一条从 6 到 7、以十分之一为刻度的数轴，标出 6.5，√41 在 6.5 的左边。",
        ]),
      ),
      lesson(
        "nearest-tenth",
        ["The nearest tenth", "精确到十分位"],
        [
          [
            "$\\sqrt{20}$ is between $4$ and $5$. Now square tenths: $4.4^{2} = 19.36$ and $4.5^{2} = 20.25$. So $\\sqrt{20}$ is between $4.4$ and $4.5$. The halfway value has $4.45^{2} = 19.8025$, which is less than $20$. So $\\sqrt{20}$ rounds up to $4.5$.",
            "$\\sqrt{20}$ 在 $4$ 和 $5$ 之间。再把一位小数平方：$4.4^{2} = 19.36$，$4.5^{2} = 20.25$。所以 $\\sqrt{20}$ 在 $4.4$ 和 $4.5$ 之间。中间值的平方 $4.45^{2} = 19.8025$ 小于 $20$，所以 $\\sqrt{20}$ 约等于 $4.5$。",
          ],
          [
            "$4.5^{2} = 20.25$ is $0.25$ from $20$, but $4.4^{2} = 19.36$ is $0.64$ away.",
            "$4.5^{2} = 20.25$ 离 $20$ 差 $0.25$，而 $4.4^{2} = 19.36$ 差 $0.64$。",
          ],
          [
            "Do not stop at the first tenth whose square is too small. $4.4^{2}$ is below $20$, but $4.5$ is nearer.",
            "不要停在平方偏小的那个一位小数上。$4.4^{2}$ 小于 $20$，但 $4.5$ 更接近。",
          ],
        ],
        (rng) => {
          const n = nonPower(rng, 3, 120, 2);
          const a = iroot(100 * n, 2);
          const up = 100 * n > a * a + a;
          const [lo, hi] = [Q.of(a, 10), Q.of(a + 1, 10)];
          const mid = Q.of(2 * a + 1, 20);
          const ans = up ? hi : lo;
          const [sl, sh] = [lo.mul(lo), hi.mul(hi)];
          return valued(
            [`Find $\\sqrt{${n}}$ to the nearest tenth.`, `求 $\\sqrt{${n}}$ 的近似值，精确到十分位。`],
            ans,
            [
              [
                ["Trap it between tenths", "夹在两个一位小数之间"],
                [`Square tenths until one is too big:`, `把一位小数平方，直到超过 $${n}$：`],
                [`${dec(lo)}^{2} = ${dec(sl)},\\quad ${dec(hi)}^{2} = ${dec(sh)}`],
              ],
              [
                ["Test the halfway value", "检验中间值"],
                [
                  `$${dec(mid)}^{2} = ${dec(mid.mul(mid))}$ is ${up ? "less" : "more"} than $${n}$, so $\\sqrt{${n}}$ rounds to $${dec(ans)}$.`,
                  `$${dec(mid)}^{2} = ${dec(mid.mul(mid))}$ ${up ? "小于" : "大于"} $${n}$，所以 $\\sqrt{${n}} \\approx ${dec(ans)}$。`,
                ],
              ],
            ],
            [
              `Compare distances: $${dec(sh)}$ is $${dec(sh.sub(Q.of(n)))}$ above $${n}$ and $${dec(sl)}$ is $${dec(Q.of(n).sub(sl))}$ below, so $${dec(ans)}$ is nearer.`,
              `比较距离：$${dec(sh)}$ 比 $${n}$ 大 $${dec(sh.sub(Q.of(n)))}$，$${dec(sl)}$ 比它小 $${dec(Q.of(n).sub(sl))}$，所以 $${dec(ans)}$ 更接近。`,
            ],
            [
              [up ? lo : hi, "That rounds the wrong way: the halfway square decides.", "这是舍入方向错了：要看中间值的平方。"],
              [
                Q.of(Math.round(n * 5), 10),
                "That halves the number instead of taking its square root.",
                "这是把这个数除以 2，而不是开平方。",
              ],
            ],
            { form: "decimal" },
          );
        },
        rootLine(
          4.4,
          4.5,
          0.01,
          [4.4, 4.45, 4.5],
          Math.sqrt(20),
          "√20",
          [
            "A number line from 4.4 to 4.5 in hundredths, with 4.45 marked and √20 plotted right of 4.45.",
            "一条从 4.4 到 4.5、以百分之一为刻度的数轴，标出 4.45，√20 在 4.45 的右边。",
          ],
          2,
        ),
      ),
      lesson(
        "whole-numbers-between-two-roots",
        ["Whole numbers between two roots", "两个根之间的整数"],
        [
          [
            "How many whole numbers lie between $\\sqrt{10}$ and $\\sqrt{50}$? $9 < 10 < 16$, so $\\sqrt{10}$ is between $3$ and $4$. $49 < 50 < 64$, so $\\sqrt{50}$ is between $7$ and $8$. The whole numbers between them are $4, 5, 6, 7$: there are $7 - 3 = 4$.",
            "$\\sqrt{10}$ 和 $\\sqrt{50}$ 之间有多少个整数？$9 < 10 < 16$，所以 $\\sqrt{10}$ 在 $3$ 和 $4$ 之间。$49 < 50 < 64$，所以 $\\sqrt{50}$ 在 $7$ 和 $8$ 之间。它们之间的整数是 $4, 5, 6, 7$，共 $7 - 3 = 4$ 个。",
          ],
          [
            "Square each one: $16, 25, 36, 49$ are all between $10$ and $50$, and $64$ is not.",
            "把每个数平方：$16, 25, 36, 49$ 都在 $10$ 和 $50$ 之间，$64$ 不在。",
          ],
          [
            "Do not subtract the numbers under the roots. $50 - 10 = 40$ counts something else.",
            "不要用根号里的数相减。$50 - 10 = 40$ 数的是别的东西。",
          ],
        ],
        (rng) => {
          const low = rng.int(2, 15);
          const high = low + rng.int(2, 9);
          const a = low * low + rng.int(1, 2 * low);
          const b = high * high + rng.int(1, 2 * high);
          const answer = high - low;
          return valued(
            [
              `How many whole numbers lie between $\\sqrt{${a}}$ and $\\sqrt{${b}}$?`,
              `$\\sqrt{${a}}$ 和 $\\sqrt{${b}}$ 之间有多少个整数？`,
            ],
            answer,
            [
              [
                ["Place each root", "确定每个根的位置"],
                [`The perfect squares on each side show where the roots are:`, `两边的完全平方数说明了根的位置：`],
                [
                  `${low * low} < ${a} < ${(low + 1) ** 2} \\Rightarrow ${low} < \\sqrt{${a}} < ${low + 1}`,
                  `${high * high} < ${b} < ${(high + 1) ** 2} \\Rightarrow ${high} < \\sqrt{${b}} < ${high + 1}`,
                ],
              ],
              [
                ["Count", "数一数"],
                [`The whole numbers are $${low + 1}$ to $${high}$:`, `这些整数是 $${low + 1}$ 到 $${high}$：`],
                [`${high} - ${low} = ${answer}`],
              ],
            ],
            [
              `Square the end ones: $${low + 1}^{2} = ${(low + 1) ** 2}$ is above $${a}$, and $${high}^{2} = ${high * high}$ is below $${b}$.`,
              `把两端的数平方：$${low + 1}^{2} = ${(low + 1) ** 2}$ 大于 $${a}$，$${high}^{2} = ${high * high}$ 小于 $${b}$。`,
            ],
            [
              [answer + 1, `That also counts $${low}$, which is below $\\sqrt{${a}}$.`, `这把 $${low}$ 也算上了，它比 $\\sqrt{${a}}$ 小。`],
              [answer - 1, `That leaves out one end, $${low + 1}$ or $${high}$.`, `这漏掉了一端的 $${low + 1}$ 或 $${high}$。`],
              [b - a, "That subtracts the numbers under the roots.", "这是用根号里的数相减。"],
            ],
          );
        },
        lineFigure(
          {
            lo: 3,
            hi: 8,
            step: 1,
            labels: [3, 4, 5, 6, 7, 8],
            marks: [
              { at: Math.sqrt(10), text: "√10" },
              { at: Math.sqrt(50), text: "√50" },
            ],
          },
          [
            "A number line from 3 to 8 with √10 just above 3 and √50 just above 7; the whole numbers 4 to 7 lie between them.",
            "一条从 3 到 8 的数轴，√10 略大于 3，√50 略大于 7；整数 4 到 7 在它们之间。",
          ],
        ),
      ),
    ],
  ),
  [
    "A square garden has an area of $30$ square meters. How long is each side? $5 \\times 5 = 25$ is too small, and $6 \\times 6 = 36$ is too big.",
    "一个正方形花园的面积是 $30$ 平方米。每条边有多长？$5 \\times 5 = 25$ 太小，$6 \\times 6 = 36$ 太大。",
  ],
  [
    "So the side $\\sqrt{30}$ is between $5$ and $6$, and $25 < 30 < 36$ agrees.",
    "所以边长 $\\sqrt{30}$ 在 $5$ 和 $6$ 之间，$25 < 30 < 36$ 也说明了这一点。",
  ],
  [
    "trap square roots and cube roots between whole numbers and find them to the nearest tenth.",
    "把平方根和立方根夹在两个整数之间，并求出精确到十分位的近似值。",
  ],
);

// ---------------------------------------------------------------------------
// Comparing and ordering real numbers

/** Real is a real number with its LaTeX. */
interface Real {
  readonly value: number;
  readonly latex: string;
}

/** realsNear draws real numbers of different kinds between the integers k and k + 1. */
function realsNear(rng: Rng, k: number): Real[] {
  const out: Real[] = [];
  const sq = nonPower(rng, k * k + 1, (k + 1) ** 2 - 1, 2);
  out.push({ value: Math.sqrt(sq), latex: `\\sqrt{${sq}}` });
  const cu = nonPower(rng, k ** 3 + 1, (k + 1) ** 3 - 1, 3);
  out.push({ value: Math.cbrt(cu), latex: `\\sqrt[3]{${cu}}` });
  const d = Q.of(10 * k + rng.int(1, 9), 10).add(rng.bool() ? Q.of(rng.int(1, 9), 100) : Q.zero);
  out.push({ value: Number(d.n) / Number(d.d), latex: dec(d) });
  const q = rng.pick([3, 4, 6, 7, 8, 9]);
  const r = rng.int(1, q - 1);
  const f = Q.of(k * q + r, q);
  out.push({ value: Number(f.n) / Number(f.d), latex: num(f) });
  if (k === 3) out.push({ value: Math.PI, latex: "\\pi" });
  return out;
}

/** comparingAndOrderingRealNumbers compares real numbers and picks the greatest or least of several. */
export const comparingAndOrderingRealNumbers = topic(
  "comparing-and-ordering-real-numbers",
  t("Comparing and Ordering Real Numbers", "实数的大小比较与排序"),
  t(
    "To compare a square root with another positive number, compare their squares: √30 < 5.5 because 30 < 5.5² = 30.25. To order several real numbers, approximate each one as a decimal, using perfect squares and cubes for roots and 3.14 for π.",
    "比较一个平方根和另一个正数的大小时，比较它们的平方：√30 < 5.5，因为 30 < 5.5² = 30.25。给几个实数排序时，把每个数近似成小数：根式借助完全平方数和完全立方数估算，π 取 3.14。",
  ),
  ["approximating-square-roots-and-cube-roots"],
  ["8.NS.A.2"],
  [
    {
      id: "comparing-two-real-numbers",
      title: t("Comparing two numbers", "比较两个数"),
      explanation: t(
        "Is $\\sqrt{30}$ greater or less than $5.5$? Both are positive, so the one with the greater square is greater: $5.5^{2} = 30.25 > 30$, so $\\sqrt{30} < 5.5$. In the same way, $3\\sqrt{2} = \\sqrt{18} > \\sqrt{17}$ because $(3\\sqrt{2})^{2} = 9 \\cdot 2 = 18$, and $\\sqrt[3]{30} > 3$ because $3^{3} = 27 < 30$.",
        "$\\sqrt{30}$ 比 $5.5$ 大还是小？两者都是正数，所以平方较大的数较大：$5.5^{2} = 30.25 > 30$，所以 $\\sqrt{30} < 5.5$。同样，$3\\sqrt{2} = \\sqrt{18} > \\sqrt{17}$，因为 $(3\\sqrt{2})^{2} = 9 \\cdot 2 = 18$；$\\sqrt[3]{30} > 3$，因为 $3^{3} = 27 < 30$。",
      ),
      generate(rng) {
        const kind = rng.pick(["decimal", "fraction", "coefficient", "cube"] as const);
        const flip = rng.bool();
        let a: string;
        let b: string;
        let rel: number;
        let why: [string, string];
        if (kind === "decimal") {
          const n = nonPower(rng, 5, 99, 2);
          const s = Math.sqrt(n);
          // A decimal with one place within 0.2 of √n, so that the comparison needs squaring.
          const d = Q.of(Math.round(s * 10) + rng.pick([-2, -1, 1, 2]), 10);
          rel = Q.of(n).cmp(d.mul(d)) + 1;
          [a, b] = [`\\sqrt{${n}}`, dec(d)];
          why = [
            `$\\left(\\sqrt{${n}}\\right)^{2} = ${n}$ and $${dec(d)}^{2} = ${dec(d.mul(d))}$`,
            `$\\left(\\sqrt{${n}}\\right)^{2} = ${n}$，$${dec(d)}^{2} = ${dec(d.mul(d))}$`,
          ];
        } else if (kind === "fraction") {
          const n = nonPower(rng, 2, 50, 2);
          const s = Math.sqrt(n);
          const q = rng.pick([2, 3, 4, 5]);
          const p = Math.round(s * q) + rng.pick([-1, 1]);
          const f = Q.of(p, q);
          if (f.sign() <= 0 || f.isInteger()) return this.generate(rng);
          rel = Q.of(n).cmp(f.mul(f)) + 1;
          [a, b] = [`\\sqrt{${n}}`, num(f)];
          why = [
            `$\\left(\\sqrt{${n}}\\right)^{2} = ${n}$ and $\\left(${num(f)}\\right)^{2} = ${num(f.mul(f))}$`,
            `$\\left(\\sqrt{${n}}\\right)^{2} = ${n}$，$\\left(${num(f)}\\right)^{2} = ${num(f.mul(f))}$`,
          ];
        } else if (kind === "coefficient") {
          const c = rng.int(2, 5);
          const m = rng.pick([2, 3, 5, 6, 7]);
          const k = c * c * m + rng.pick([-3, -2, -1, 1, 2, 3]);
          rel = Q.of(c * c * m).cmp(Q.of(k)) + 1;
          [a, b] = [`${c}\\sqrt{${m}}`, `\\sqrt{${k}}`];
          why = [
            `$\\left(${c}\\sqrt{${m}}\\right)^{2} = ${c * c} \\cdot ${m} = ${c * c * m}$ and $\\left(\\sqrt{${k}}\\right)^{2} = ${k}$`,
            `$\\left(${c}\\sqrt{${m}}\\right)^{2} = ${c * c} \\cdot ${m} = ${c * c * m}$，$\\left(\\sqrt{${k}}\\right)^{2} = ${k}$`,
          ];
        } else {
          const n = nonPower(rng, 3, 500, 3);
          const lo = iroot(n, 3);
          const m = rng.bool() ? lo : lo + 1;
          rel = Q.of(n).cmp(Q.of(m ** 3)) + 1;
          [a, b] = [`\\sqrt[3]{${n}}`, String(m)];
          why = [
            `$\\left(\\sqrt[3]{${n}}\\right)^{3} = ${n}$ and $${m}^{3} = ${m ** 3}$`,
            `$\\left(\\sqrt[3]{${n}}\\right)^{3} = ${n}$，$${m}^{3} = ${m ** 3}$`,
          ];
        }
        const sym = ["<", "=", ">"];
        const [l, r, rr] = flip ? [b, a, 2 - rel] : [a, b, rel];
        return compareProblem(
          l,
          r,
          rr,
          t(
            `Both numbers are positive, so compare their ${kind === "cube" ? "cubes" : "squares"}: ${why[0]}. Therefore $${l} ${sym[rr]} ${r}$.`,
            `两个数都是正数，所以比较它们的${kind === "cube" ? "立方" : "平方"}：${why[1]}。因此 $${l} ${sym[rr]} ${r}$。`,
          ),
        );
      },
    },
    {
      id: "ordering-real-numbers",
      title: t("The greatest and the least", "最大和最小"),
      explanation: t(
        "To find the greatest of $\\sqrt{29}$, $5.3$, $\\frac{16}{3}$ and $\\sqrt[3]{150}$, approximate each one: $\\sqrt{29} \\approx 5.39$ since $5.4^{2} = 29.16$ is just above $29$; $\\frac{16}{3} \\approx 5.33$; $\\sqrt[3]{150} \\approx 5.31$ since $5.3^{3} \\approx 148.9$. So $\\sqrt{29}$ is the greatest and $5.3$ the least.",
        "要找出 $\\sqrt{29}$、$5.3$、$\\frac{16}{3}$ 和 $\\sqrt[3]{150}$ 中最大的数，先估算每个数：$\\sqrt{29} \\approx 5.39$，因为 $5.4^{2} = 29.16$ 略大于 $29$；$\\frac{16}{3} \\approx 5.33$；$\\sqrt[3]{150} \\approx 5.31$，因为 $5.3^{3} \\approx 148.9$。所以 $\\sqrt{29}$ 最大，$5.3$ 最小。",
      ),
      generate(rng) {
        const k = rng.int(2, 8);
        const reals = realsNear(rng, k);
        const chosen = rng.sample(reals, 4);
        const sorted = [...chosen].sort((x, y) => x.value - y.value);
        if (sorted.some((x, i) => i > 0 && x.value - sorted[i - 1]!.value < 0.04)) return this.generate(rng);
        const greatest = rng.bool();
        const target = greatest ? sorted[3]! : sorted[0]!;
        const list = chosen.map((x) => `$${x.latex}$`);
        const approxs = chosen.map((x) => (/^[\d.]+$/.test(x.latex) ? `$${x.latex}$` : `$${x.latex} \\approx ${approx(x.value)}$`));
        return pickChoice(
          rng,
          t(
            `Which of these numbers is the ${greatest ? "greatest" : "least"}? ${list.join(", ")}`,
            `下面哪个数${greatest ? "最大" : "最小"}？${list.join("、")}`,
          ),
          mathText(target.latex),
          chosen.filter((x) => x !== target).map((x) => mathText(x.latex)),
          t(
            `Approximate each number: ${approxs.join(", ")}. The ${greatest ? "greatest" : "least"} is $${target.latex}$.`,
            `估算每个数：${approxs.join("，")}。${greatest ? "最大" : "最小"}的是 $${target.latex}$。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Estimating expressions

/** estimatingExpressionsWithIrrationalNumbers locates expressions with roots and π between integers. */
export const estimatingExpressionsWithIrrationalNumbers = topic(
  "estimating-expressions-with-irrational-numbers",
  t("Estimating Expressions With Irrational Numbers", "估算含无理数的式子"),
  t(
    "An expression with an irrational number can be estimated by replacing the irrational number with an approximation: bound a root between integers, or use 3.14 for π. Multiplying a root by a number is easier to bound after moving the number under the root: 3√5 = √45.",
    "估算含无理数的式子时，可以用近似值代替无理数：把根式夹在两个整数之间，或者用 3.14 代替 π。根式乘以一个数时，先把这个数移到根号内更容易估算：3√5 = √45。",
  ),
  ["approximating-square-roots-and-cube-roots"],
  ["8.NS.A.2"],
  [
    {
      id: "bounding-expressions-with-roots",
      title: t("Expressions with roots", "含根式的式子"),
      explanation: t(
        "$3 + \\sqrt{40}$: since $6 < \\sqrt{40} < 7$, $9 < 3 + \\sqrt{40} < 10$. For $8 - \\sqrt{40}$ the bounds swap: $8 - 7 < 8 - \\sqrt{40} < 8 - 6$, so it is between $1$ and $2$. For $2\\sqrt{10}$, write it as $\\sqrt{4 \\cdot 10} = \\sqrt{40}$, between $6$ and $7$; doubling the bounds of $\\sqrt{10}$ only gives $6$ and $8$.",
        "$3 + \\sqrt{40}$：因为 $6 < \\sqrt{40} < 7$，所以 $9 < 3 + \\sqrt{40} < 10$。对于 $8 - \\sqrt{40}$，上下界要交换：$8 - 7 < 8 - \\sqrt{40} < 8 - 6$，所以它在 $1$ 和 $2$ 之间。对于 $2\\sqrt{10}$，写成 $\\sqrt{4 \\cdot 10} = \\sqrt{40}$，在 $6$ 和 $7$ 之间；把 $\\sqrt{10}$ 的上下界加倍只能得到 $6$ 和 $8$。",
      ),
      generate(rng) {
        const kind = rng.pick(["plus", "minus", "times"] as const);
        const n = nonPower(rng, 3, 99, 2);
        const r = iroot(n, 2);
        let expr: string;
        let lo: number;
        let wrong: number[];
        let work: [string, string];
        const bound = `${r} < \\sqrt{${n}} < ${r + 1}`;
        if (kind === "plus") {
          const b = rng.int(1, 12);
          expr = `${b} + \\sqrt{${n}}`;
          lo = b + r;
          wrong = [b + r + 1, r];
          work = [`Since $${bound}$, add $${b}$ to each part.`, `因为 $${bound}$，各部分都加 $${b}$。`];
        } else if (kind === "minus") {
          const b = rng.int(r + 2, r + 12);
          expr = `${b} - \\sqrt{${n}}`;
          lo = b - r - 1;
          // Subtracting the lower bound, and the root's integer part alone.
          wrong = [b - r, r];
          work = [
            `Since $${bound}$, subtracting from $${b}$ reverses the bounds: $${b} - ${r + 1} < ${expr} < ${b} - ${r}$.`,
            `因为 $${bound}$，从 $${b}$ 中减去时上下界交换：$${b} - ${r + 1} < ${expr} < ${b} - ${r}$。`,
          ];
        } else {
          const c = rng.int(2, 4);
          const m = rng.pick([2, 3, 5, 6, 7, 10, 11]);
          if (iroot(c * c * m, 2) ** 2 === c * c * m) return this.generate(rng);
          expr = `${c}\\sqrt{${m}}`;
          lo = iroot(c * c * m, 2);
          // Multiplying the bounds of √m, which only narrows the value to a wider interval.
          wrong = [c * iroot(m, 2), c * m];
          work = [
            `Move $${c}$ under the root: $${expr} = \\sqrt{${c * c} \\cdot ${m}} = \\sqrt{${c * c * m}}$, and $${lo}^{2} = ${lo * lo} < ${c * c * m} < ${(lo + 1) ** 2} = ${lo + 1}^{2}$.`,
            `把 $${c}$ 移到根号内：$${expr} = \\sqrt{${c * c} \\cdot ${m}} = \\sqrt{${c * c * m}}$，而 $${lo}^{2} = ${lo * lo} < ${c * c * m} < ${(lo + 1) ** 2} = ${lo + 1}^{2}$。`,
          ];
        }
        return numberProblem({
          prompt: t(
            `The value of $${expr}$ lies between two consecutive integers. What is the smaller of the two?`,
            `$${expr}$ 的值介于两个连续整数之间。较小的那个整数是多少？`,
          ),
          answer: lo,
          form: "integer",
          wrong,
          solution: t(
            `${work[0]} So $${lo} < ${expr} < ${lo + 1}$, and the smaller integer is $${lo}$.`,
            `${work[1]}所以 $${lo} < ${expr} < ${lo + 1}$，较小的整数是 $${lo}$。`,
          ),
        });
      },
    },
    {
      id: "estimating-expressions-with-pi",
      title: t("Expressions with π", "含 π 的式子"),
      explanation: t(
        "To estimate $5\\pi - 4$ to the nearest whole number, use $\\pi \\approx 3.14$: $5 \\times 3.14 - 4 = 11.7$, so $5\\pi - 4 \\approx 12$. Using $\\pi \\approx 3$ gives $11$, which is too rough here.",
        "要把 $5\\pi - 4$ 估算到整数，用 $\\pi \\approx 3.14$：$5 \\times 3.14 - 4 = 11.7$，所以 $5\\pi - 4 \\approx 12$。用 $\\pi \\approx 3$ 会得到 $11$，这里太粗略了。",
      ),
      generate(rng) {
        // Multiples of π whose decimal part is far from one half, so that 3.14 rounds the same way as π.
        const a = rng.pick([2, 5, 6, 8, 9, 10, 12]);
        const b = rng.nonZero(-9, 9);
        const v = a * Math.PI + b;
        if (v <= 0) return this.generate(rng);
        const ans = Math.round(v);
        const approxV = Q.of(314 * a, 100).add(Q.of(b));
        const expr = `${a}\\pi ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
        return numberProblem({
          prompt: t(`Estimate $${expr}$ to the nearest whole number.`, `把 $${expr}$ 估算到整数。`),
          answer: ans,
          form: "integer",
          // Using π ≈ 3, dropping the decimal part instead of rounding, and multiplying the sum π + b by a.
          wrong: [3 * a + b, Math.floor(v), Math.round(a * (Math.PI + b))],
          solution: t(
            `Use $\\pi \\approx 3.14$:${steps(`${a} \\times 3.14 ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${dec(approxV)} \\approx ${ans}`)}`,
            `用 $\\pi \\approx 3.14$：${steps(`${a} \\times 3.14 ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${dec(approxV)} \\approx ${ans}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade8RealNumberTopics lists the 8th grade topics on the real number system. */
export const grade8RealNumberTopics: readonly TopicDef[] = [
  classifyingSquareRootsAndCubeRootsAsRationalOrIrrational,
  approximatingSquareRootsAndCubeRoots,
  comparingAndOrderingRealNumbers,
  estimatingExpressionsWithIrrationalNumbers,
];
