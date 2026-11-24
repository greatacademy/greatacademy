import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, num, Q } from "@ga/subject-math";

import { compared, type Pair, type Walk } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

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

/** powerWord names a square or a cube, in English and Chinese. */
const powerWord = (k: 2 | 3): Pair => (k === 2 ? ["square", "平方"] : ["cube", "立方"]);

/** perfect tells whether a nonnegative integer is a perfect k-th power. */
const perfect = (n: number, k: 2 | 3) => iroot(n, k) ** k === n;

/** trap writes the perfect k-th powers on each side of a positive integer that is not one. */
function trap(n: number, k: 2 | 3): string {
  const lo = iroot(n, k);
  return `${lo}^{${k}} = ${lo ** k} < ${n} < ${(lo + 1) ** k} = ${lo + 1}^{${k}}`;
}

/** rootOptions are the two options of a rational-or-irrational question. */
const rootOptions: readonly [Pair, Pair] = [
  ["Rational", "有理数"],
  ["Irrational", "无理数"],
];

/** classified asks whether the square or cube root of r is rational, simplifying first and testing for perfect powers. */
function classified(rng: Rng, r: Radicand, k: 2 | 3): Problem {
  const [word, wordZh] = powerWord(k);
  const neg = r.value.sign() < 0;
  const a = r.value.abs();
  const [p, q] = [Number(a.n), Number(a.d)];
  const expr = rootLatex(r.latex, k);
  const bare = r.latex.replace(/^-/, "");
  const root = rationalRoot(a, k);
  const shown = (v: Q) => (r.latex.includes(".") ? dec(v) : num(v));
  const inner = num(a);
  const signNote: Pair = neg
    ? [
        ` A cube root of a negative number is negative, so test $${inner}$ and put the sign back.`,
        `负数的立方根是负数，所以检验 $${inner}$，最后再加上负号。`,
      ]
    : ["", ""];
  const simplify: Pair = r.latex.includes(".")
    ? [`$${bare} = ${inner}$ in lowest terms.`, `$${bare} = ${inner}$，已是最简分数。`]
    : r.latex.includes("frac") && a.isInteger()
      ? [`$${bare} = ${inner}$.`, `$${bare} = ${inner}$。`]
      : r.latex.includes("frac")
        ? [`$${bare}$ is already in lowest terms.`, `$${bare}$ 已是最简分数。`]
        : [`$${inner}$ is a whole number.`, `$${inner}$ 是整数。`];
  const walkStart: Walk = [
    ["Simplify what is under the root", "化简根号内的数"],
    [simplify[0] + signNote[0], simplify[1] + signNote[1]],
  ];
  if (root) {
    const value = neg ? root.neg() : root;
    const [rp, rq] = [Number(root.n), Number(root.d)];
    const raised = value.sign() < 0 || shown(value).includes("frac") ? `\\left(${shown(value)}\\right)` : shown(value);
    return chosen(
      rng,
      [`Is $${expr}$ rational or irrational?`, `$${expr}$ 是有理数还是无理数？`],
      rootOptions[0],
      [
        [
          rootOptions[1],
          `$${inner}$ is the ${word} of $${num(root)}$, so its ${word} root is the rational number $${shown(value)}$.`,
          `$${inner}$ 是 $${num(root)}$ 的${wordZh}，所以它的${wordZh}根是有理数 $${shown(value)}$。`,
        ],
      ],
      [
        walkStart,
        [
          [`Look for a perfect ${word}`, `找完全${wordZh}数`],
          q === 1
            ? [`$${p} = ${rp}^{${k}}$, so the root is rational:`, `$${p} = ${rp}^{${k}}$，所以这个根是有理数：`]
            : [
                `$${p} = ${rp}^{${k}}$ and $${q} = ${rq}^{${k}}$, so the root is rational:`,
                `$${p} = ${rp}^{${k}}$，$${q} = ${rq}^{${k}}$，所以这个根是有理数：`,
              ],
          [`${expr} = ${shown(value)}`],
        ],
      ],
      [
        `Raise the answer back, and the number under the root returns: $${raised}^{${k}} = ${shown(r.value)}$.`,
        `把结果${wordZh}回去，得到的正是根号内的数：$${raised}^{${k}} = ${shown(r.value)}$。`,
      ],
    );
  }
  const topBad = !perfect(p, k);
  const m = p * q ** (k - 1);
  const why: Pair = topBad
    ? q === 1
      ? [`$${p}$ is not a perfect ${word}`, `$${p}$ 不是完全${wordZh}数`]
      : [`The top, $${p}$, is not a perfect ${word}`, `分子 $${p}$ 不是完全${wordZh}数`]
    : [`The top, $${p}$, is a perfect ${word}, but the bottom, $${q}$, is not`, `分子 $${p}$ 是完全${wordZh}数，但分母 $${q}$ 不是`];
  return chosen(
    rng,
    [`Is $${expr}$ rational or irrational?`, `$${expr}$ 是有理数还是无理数？`],
    rootOptions[1],
    [
      [
        rootOptions[0],
        r.latex.includes("frac") && a.isInteger()
          ? `Simplify first: the number is $${inner}$, and ${why[0].charAt(0).toLowerCase()}${why[0].slice(1)}.`
          : `${why[0]}: $${trap(topBad ? p : q, k)}$.`,
        r.latex.includes("frac") && a.isInteger()
          ? `先化简：这个数是 $${inner}$，而${why[1]}。`
          : `${why[1]}：$${trap(topBad ? p : q, k)}$。`,
      ],
    ],
    [
      walkStart,
      [
        [`Look for a perfect ${word}`, `找完全${wordZh}数`],
        [`${why[0]}, so the root is irrational:`, `${why[1]}，所以这个根是无理数：`],
        [trap(topBad ? p : q, k)],
      ],
    ],
    q === 1
      ? [
          `Trap it between whole numbers: the root lies strictly between $${iroot(p, k)}$ and $${iroot(p, k) + 1}$, since $${trap(p, k)}$. A fraction in lowest terms with a bottom above $1$ has a ${word} with a bottom above $1$, never a whole number, so nothing rational fits.`,
          `把它夹在两个整数之间：这个根严格介于 $${iroot(p, k)}$ 和 $${iroot(p, k) + 1}$ 之间，因为 $${trap(p, k)}$。分母大于 $1$ 的最简分数，${wordZh}后分母仍大于 $1$，不会是整数，所以没有有理数符合。`,
        ]
      : [
          `Multiply the top and the bottom by $${k === 2 ? q : `${q}^{2}`}$: the number becomes $${m}$ over $${q}^{${k}}$. The bottom is a perfect ${word}, but the top is not, so the root stays irrational: $${trap(m, k)}$.`,
          `分子分母同乘 $${k === 2 ? q : `${q}^{2}`}$：这个数变成 $${m}$ 除以 $${q}^{${k}}$。分母是完全${wordZh}数，分子却不是，所以这个根仍是无理数：$${trap(m, k)}$。`,
        ],
  );
}

/** sharpPair rounds two different numbers to the fewest places, at least two, that keep them in the same order. */
function sharpPair(x: number, y: number): [string, string] {
  for (let p = 2; ; p++) {
    const [sx, sy] = [x.toFixed(p), y.toFixed(p)];
    if (Math.sign(Number(sx) - Number(sy)) === Math.sign(x - y)) return [sx, sy];
  }
}

/** against says, exactly, on which side of the decimal m a real number lies. */
function against(x: Real, m: Q): Pair {
  const md = dec(m);
  const above = x.value > m.toNumber();
  const side: Pair = above ? ["above", "大于"] : ["below", "小于"];
  if (x.kind === "sqrt" || x.kind === "cbrt") {
    const k = x.kind === "sqrt" ? 2 : 3;
    const power = k === 2 ? m.mul(m) : m.mul(m).mul(m);
    return [
      `$${md}^{${k}} = ${dec(power)}$ is ${above ? "less" : "more"} than $${num(x.q)}$, so $${x.latex}$ is ${side[0]} $${md}$`,
      `$${md}^{${k}} = ${dec(power)}$ ${above ? "小于" : "大于"} $${num(x.q)}$，所以 $${x.latex}$ ${side[1]} $${md}$`,
    ];
  }
  if (x.kind === "fraction") {
    const [p, q] = [Number(x.q.n), Number(x.q.d)];
    return [
      `$${md} \\times ${q} = ${dec(m.mul(Q.of(q)))}$ is ${above ? "less" : "more"} than $${p}$, so $${x.latex}$ is ${side[0]} $${md}$`,
      `$${md} \\times ${q} = ${dec(m.mul(Q.of(q)))}$ ${above ? "小于" : "大于"} $${p}$，所以 $${x.latex}$ ${side[1]} $${md}$`,
    ];
  }
  if (x.kind === "pi") return [`$\\pi = 3.14159\\ldots$ is ${side[0]} $${md}$`, `$\\pi = 3.14159\\ldots$ ${side[1]} $${md}$`];
  return [`$${x.latex}$ is ${side[0]} $${md}$`, `$${x.latex}$ ${side[1]} $${md}$`];
}

/** exactly tells whether a real number is written as a plain decimal or whole number. */
const exactly = (latex: string) => /^[\d.]+$/.test(latex);

/** dotLine draws a number line from lo to hi in tenths with several labeled points. */
function dotLine(lo: number, hi: number, labels: readonly number[], marks: readonly (readonly [number, string])[], alt: Pair): Figure {
  return lineFigure(
    {
      lo,
      hi,
      step: 0.1,
      labels,
      label: (v) => v.toFixed(1).replace(/\.0+$/, ""),
      marks: marks.map(([at, text], i) => ({ at, text, result: i === marks.length - 1 })),
    },
    alt,
  );
}

/** classifyingSquareRootsAndCubeRootsAsRationalOrIrrational decides whether a root is rational. */
export const classifyingSquareRootsAndCubeRootsAsRationalOrIrrational = withIntro(
  topic(
    "classifying-square-roots-and-cube-roots-as-rational-or-irrational",
    t("Classifying Square Roots and Cube Roots as Rational or Irrational", "判断平方根和立方根是有理数还是无理数"),
    t(
      "The square root of a number is rational exactly when the number is the square of a rational number, and the cube root exactly when it is the cube of one. A fraction in lowest terms has a rational square root only when both its numerator and its denominator are perfect squares; every other root of a rational number is irrational.",
      "一个数的平方根是有理数，当且仅当这个数是某个有理数的平方；立方根是有理数，当且仅当它是某个有理数的立方。最简分数的平方根是有理数，仅当分子和分母都是完全平方数；有理数的其他根都是无理数。",
    ),
    ["the-real-number-system"],
    ["8.NS.A.1"],
    [
      lesson(
        "classifying-square-roots",
        ["Square roots", "平方根"],
        [
          [
            "$\\sqrt{49} = 7$ and $\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$ are rational, but $\\sqrt{50}$ is irrational, since $50$ is not a perfect square. Simplify first: $\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ is rational. Decimals need care: $\\sqrt{0.49} = 0.7$, but $0.4 = \\frac{2}{5}$, so $\\sqrt{0.4}$ is irrational.",
            "$\\sqrt{49} = 7$ 和 $\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$ 是有理数，而 $\\sqrt{50}$ 是无理数，因为 $50$ 不是完全平方数。要先化简：$\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ 是有理数。小数要小心：$\\sqrt{0.49} = 0.7$，但 $0.4 = \\frac{2}{5}$，所以 $\\sqrt{0.4}$ 是无理数。",
          ],
          [
            "Square back: $\\left(\\frac{3}{5}\\right)^{2} = \\frac{9}{25}$ and $0.7^{2} = 0.49$. And $7^{2} = 49 < 50 < 64 = 8^{2}$ traps $\\sqrt{50}$ strictly between two whole numbers.",
            "平方回去：$\\left(\\frac{3}{5}\\right)^{2} = \\frac{9}{25}$，$0.7^{2} = 0.49$。而 $7^{2} = 49 < 50 < 64 = 8^{2}$ 把 $\\sqrt{50}$ 严格夹在两个整数之间。",
          ],
          [
            "A fraction needs both parts to be perfect squares: $\\sqrt{\\frac{4}{7}}$ is irrational even though $4 = 2^{2}$.",
            "分数的分子和分母都要是完全平方数：虽然 $4 = 2^{2}$，$\\sqrt{\\frac{4}{7}}$ 仍是无理数。",
          ],
        ],
        (rng) => classified(rng, squareRadicand(rng), 2),
        rootLine(7, 8, 0.1, [7, 7.5, 8], Math.sqrt(50), "√50", [
          "A number line from 7 to 8 in tenths, with √50 plotted just right of 7, between the two whole numbers.",
          "一条从 7 到 8、以十分之一为刻度的数轴，√50 在 7 的右边不远处，介于两个整数之间。",
        ]),
      ),
      lesson(
        "classifying-cube-roots",
        ["Cube roots", "立方根"],
        [
          [
            "$\\sqrt[3]{-64} = -4$ and $\\sqrt[3]{0.008} = 0.2$ are rational. A perfect square is not always a perfect cube: $\\sqrt[3]{16}$ is irrational, because $2^{3} = 8$ and $3^{3} = 27$ leave no integer whose cube is $16$.",
            "$\\sqrt[3]{-64} = -4$ 和 $\\sqrt[3]{0.008} = 0.2$ 是有理数。完全平方数不一定是完全立方数：$\\sqrt[3]{16}$ 是无理数，因为 $2^{3} = 8$，$3^{3} = 27$，没有立方等于 $16$ 的整数。",
          ],
          [
            "Cube back: $(-4)^{3} = -64$ and $0.2^{3} = 0.008$. And $8 < 16 < 27$ traps $\\sqrt[3]{16}$ strictly between $2$ and $3$.",
            "立方回去：$(-4)^{3} = -64$，$0.2^{3} = 0.008$。而 $8 < 16 < 27$ 把 $\\sqrt[3]{16}$ 严格夹在 $2$ 和 $3$ 之间。",
          ],
          [
            "A negative number still has a rational cube root when its size is a perfect cube: $\\sqrt[3]{-27} = -3$.",
            "负数的绝对值是完全立方数时，它的立方根仍是有理数：$\\sqrt[3]{-27} = -3$。",
          ],
        ],
        (rng) => classified(rng, cubeRadicand(rng), 3),
        rootLine(2, 3, 0.1, [2, 2.5, 3], Math.cbrt(16), "∛16", [
          "A number line from 2 to 3 in tenths, with ∛16 plotted between 2.5 and 2.6.",
          "一条从 2 到 3、以十分之一为刻度的数轴，∛16 在 2.5 和 2.6 之间。",
        ]),
      ),
    ],
  ),
  [
    "A square tile has an area of $2$ square feet, so its side is $\\sqrt{2}$ feet. Can that length be written as a fraction?",
    "一块正方形瓷砖的面积是 $2$ 平方英尺，所以边长是 $\\sqrt{2}$ 英尺。这个长度能写成分数吗？",
  ],
  [
    "Fractions come close, $1.4^{2} = 1.96$ and $1.5^{2} = 2.25$, but $2$ is not the square of any fraction, so $\\sqrt{2}$ is irrational.",
    "分数可以很接近，$1.4^{2} = 1.96$，$1.5^{2} = 2.25$，但 $2$ 不是任何分数的平方，所以 $\\sqrt{2}$ 是无理数。",
  ],
  [
    "tell whether a square root or a cube root is rational by simplifying and looking for perfect squares and cubes.",
    "先化简，再找完全平方数和完全立方数，判断平方根或立方根是不是有理数。",
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

/** Real is a real number with its LaTeX, its kind, and the rational number that defines it: the number under a root, or the value itself. */
interface Real {
  readonly value: number;
  readonly latex: string;
  readonly kind: "sqrt" | "cbrt" | "decimal" | "fraction" | "pi";
  readonly q: Q;
}

/** realsNear draws real numbers of different kinds between the integers k and k + 1. */
function realsNear(rng: Rng, k: number): Real[] {
  const out: Real[] = [];
  const sq = nonPower(rng, k * k + 1, (k + 1) ** 2 - 1, 2);
  out.push({ value: Math.sqrt(sq), latex: `\\sqrt{${sq}}`, kind: "sqrt", q: Q.of(sq) });
  const cu = nonPower(rng, k ** 3 + 1, (k + 1) ** 3 - 1, 3);
  out.push({ value: Math.cbrt(cu), latex: `\\sqrt[3]{${cu}}`, kind: "cbrt", q: Q.of(cu) });
  const d = Q.of(10 * k + rng.int(1, 9), 10).add(rng.bool() ? Q.of(rng.int(1, 9), 100) : Q.zero);
  out.push({ value: Number(d.n) / Number(d.d), latex: dec(d), kind: "decimal", q: d });
  const q = rng.pick([3, 4, 6, 7, 8, 9]);
  const r = rng.int(1, q - 1);
  const f = Q.of(k * q + r, q);
  out.push({ value: Number(f.n) / Number(f.d), latex: num(f), kind: "fraction", q: f });
  if (k === 3) out.push({ value: Math.PI, latex: "\\pi", kind: "pi", q: Q.zero });
  return out;
}

/** comparingAndOrderingRealNumbers compares real numbers and picks the greatest or least of several. */
export const comparingAndOrderingRealNumbers = withIntro(
  topic(
    "comparing-and-ordering-real-numbers",
    t("Comparing and Ordering Real Numbers", "实数的大小比较与排序"),
    t(
      "To compare a square root with another positive number, compare their squares: √30 < 5.5 because 30 < 5.5² = 30.25. To order several real numbers, approximate each one as a decimal, using perfect squares and cubes for roots and 3.14 for π.",
      "比较一个平方根和另一个正数的大小时，比较它们的平方：√30 < 5.5，因为 30 < 5.5² = 30.25。给几个实数排序时，把每个数近似成小数：根式借助完全平方数和完全立方数估算，π 取 3.14。",
    ),
    ["approximating-square-roots-and-cube-roots"],
    ["8.NS.A.2"],
    [
      lesson(
        "comparing-two-real-numbers",
        ["Comparing two numbers", "比较两个数"],
        [
          [
            "Is $\\sqrt{30}$ greater or less than $5.5$? Both are positive, so the one with the greater square is greater: $5.5^{2} = 30.25 > 30$, so $\\sqrt{30} < 5.5$. In the same way, $3\\sqrt{2} > \\sqrt{17}$ because $(3\\sqrt{2})^{2} = 9 \\cdot 2 = 18$, and $\\sqrt[3]{30} > 3$ because $3^{3} = 27 < 30$.",
            "$\\sqrt{30}$ 比 $5.5$ 大还是小？两者都是正数，所以平方较大的数较大：$5.5^{2} = 30.25 > 30$，所以 $\\sqrt{30} < 5.5$。同样，$3\\sqrt{2} > \\sqrt{17}$，因为 $(3\\sqrt{2})^{2} = 9 \\cdot 2 = 18$；$\\sqrt[3]{30} > 3$，因为 $3^{3} = 27 < 30$。",
          ],
          [
            "Approximate instead: $\\sqrt{30} \\approx 5.48$, a little less than $5.5$.",
            "改用估算：$\\sqrt{30} \\approx 5.48$，比 $5.5$ 略小。",
          ],
          [
            "Square both numbers, not just one: compare $30$ with $5.5^{2} = 30.25$, not with $5.5$.",
            "两个数都要平方，不能只平方一个：用 $30$ 和 $5.5^{2} = 30.25$ 比，不是和 $5.5$ 比。",
          ],
        ],
        (rng) => {
          for (;;) {
            const kind = rng.pick(["decimal", "fraction", "coefficient", "cube"] as const);
            let side: [string, string, Q, string, number][];
            if (kind === "decimal") {
              const n = nonPower(rng, 5, 99, 2);
              // A decimal with one place within 0.2 of √n, so that the comparison needs squaring.
              const d = Q.of(Math.round(Math.sqrt(n) * 10) + rng.pick([-2, -1, 1, 2]), 10);
              side = [
                [`\\sqrt{${n}}`, `\\left(\\sqrt{${n}}\\right)^{2} = ${n}`, Q.of(n), String(n), Math.sqrt(n)],
                [dec(d), `${dec(d)}^{2} = ${dec(d.mul(d))}`, d.mul(d), dec(d.mul(d)), d.toNumber()],
              ];
            } else if (kind === "fraction") {
              const n = nonPower(rng, 2, 50, 2);
              const q = rng.pick([2, 3, 4, 5]);
              const f = Q.of(Math.round(Math.sqrt(n) * q) + rng.pick([-1, 1]), q);
              if (f.sign() <= 0 || f.isInteger()) continue;
              side = [
                [`\\sqrt{${n}}`, `\\left(\\sqrt{${n}}\\right)^{2} = ${n}`, Q.of(n), String(n), Math.sqrt(n)],
                [num(f), `\\left(${num(f)}\\right)^{2} = ${num(f.mul(f))}`, f.mul(f), num(f.mul(f)), f.toNumber()],
              ];
            } else if (kind === "coefficient") {
              const c = rng.int(2, 5);
              const m = rng.pick([2, 3, 5, 6, 7]);
              const k = c * c * m + rng.pick([-3, -2, -1, 1, 2, 3]);
              side = [
                [
                  `${c}\\sqrt{${m}}`,
                  `\\left(${c}\\sqrt{${m}}\\right)^{2} = ${c * c} \\cdot ${m} = ${c * c * m}`,
                  Q.of(c * c * m),
                  String(c * c * m),
                  c * Math.sqrt(m),
                ],
                [`\\sqrt{${k}}`, `\\left(\\sqrt{${k}}\\right)^{2} = ${k}`, Q.of(k), String(k), Math.sqrt(k)],
              ];
            } else {
              const n = nonPower(rng, 3, 500, 3);
              const m = iroot(n, 3) + (rng.bool() ? 0 : 1);
              side = [
                [`\\sqrt[3]{${n}}`, `\\left(\\sqrt[3]{${n}}\\right)^{3} = ${n}`, Q.of(n), String(n), Math.cbrt(n)],
                [String(m), `${m}^{3} = ${m ** 3}`, Q.of(m ** 3), String(m ** 3), m],
              ];
            }
            if (rng.bool()) side.reverse();
            const [[l, pl, vl, wl, xl], [r, pr, vr, wr, xr]] = side as [
              [string, string, Q, string, number],
              [string, string, Q, string, number],
            ];
            const rel = vl.cmp(vr) + 1;
            const sym = ["<", "=", ">"][rel]!;
            const [word, wordZh] = kind === "cube" ? ["cubes", "立方"] : ["squares", "平方"];
            const [sl, sr] = sharpPair(xl, xr);
            const est = (latex: string, s: string) => (exactly(latex) ? `$${latex}$` : `$${latex} \\approx ${s}$`);
            const less = rel === 0;
            const reverse: Pair = [
              `That reverses the order: $${wl}$ is ${less ? "less" : "greater"} than $${wr}$, so $${l}$ is the ${less ? "smaller" : "greater"} number.`,
              `这把大小弄反了：$${wl}$ ${less ? "小于" : "大于"} $${wr}$，所以 $${l}$ 是${less ? "较小" : "较大"}的数。`,
            ];
            const equal: Pair = [
              `The ${word} are $${wl}$ and $${wr}$, which differ, so the numbers are not equal.`,
              `两个数的${wordZh}是 $${wl}$ 和 $${wr}$，并不相等，所以这两个数不相等。`,
            ];
            return compared(
              l,
              r,
              rel,
              [
                [
                  [`Compare the ${word}`, `比较${wordZh}`],
                  [
                    `Both numbers are positive, so the one with the greater ${word.slice(0, -1)} is greater:`,
                    `两个数都是正数，所以${wordZh}较大的数较大：`,
                  ],
                  [pl, pr],
                ],
                [
                  ["Decide", "下结论"],
                  [`$${wl} ${sym} ${wr}$, so $${l} ${sym} ${r}$.`, `$${wl} ${sym} ${wr}$，所以 $${l} ${sym} ${r}$。`],
                ],
              ],
              [
                `Approximate instead: ${est(l, sl)} and ${est(r, sr)}, so again $${l} ${sym} ${r}$.`,
                `改用估算：${est(l, sl)}，${est(r, sr)}，同样得到 $${l} ${sym} ${r}$。`,
              ],
              [reverse, equal, reverse],
            );
          }
        },
        rootLine(5, 6, 0.1, [5, 5.5, 6], Math.sqrt(30), "√30", [
          "A number line from 5 to 6 in tenths, with 5.5 labeled and √30 plotted just left of it.",
          "一条从 5 到 6、以十分之一为刻度的数轴，标出 5.5，√30 在它左边不远处。",
        ]),
      ),
      lesson(
        "ordering-real-numbers",
        ["The greatest and the least", "最大和最小"],
        [
          [
            "To find the greatest and the least of $\\sqrt{29}$, $5.1$, $\\frac{17}{3}$ and $\\sqrt[3]{200}$, approximate each one: $\\sqrt{29} \\approx 5.39$, since $5.4^{2} = 29.16$ is just above $29$; $\\frac{17}{3} \\approx 5.67$; $\\sqrt[3]{200} \\approx 5.85$, since $5.8^{3} \\approx 195.1$. So $\\sqrt[3]{200}$ is the greatest and $5.1$ the least.",
            "要找出 $\\sqrt{29}$、$5.1$、$\\frac{17}{3}$ 和 $\\sqrt[3]{200}$ 中最大和最小的数，先估算每个数：$\\sqrt{29} \\approx 5.39$，因为 $5.4^{2} = 29.16$ 略大于 $29$；$\\frac{17}{3} \\approx 5.67$；$\\sqrt[3]{200} \\approx 5.85$，因为 $5.8^{3} \\approx 195.1$。所以 $\\sqrt[3]{200}$ 最大，$5.1$ 最小。",
          ],
          [
            "Test $5.75$, which lies between the two largest: $5.75^{3} = 190.109375$ is less than $200$, and $5.75 \\times 3 = 17.25$ is more than $17$. So $\\sqrt[3]{200}$ is above $5.75$ and $\\frac{17}{3}$ is below it.",
            "检验介于最大两个数之间的 $5.75$：$5.75^{3} = 190.109375$ 小于 $200$，$5.75 \\times 3 = 17.25$ 大于 $17$。所以 $\\sqrt[3]{200}$ 大于 $5.75$，$\\frac{17}{3}$ 小于它。",
          ],
          [
            "Do not judge a root by the number under it: $\\sqrt[3]{200}$ has the largest number under its sign, yet it is only a little more than $5.8$.",
            "不能凭根号内的数判断大小：$\\sqrt[3]{200}$ 根号内的数最大，但它只比 $5.8$ 大一点。",
          ],
        ],
        (rng) => {
          for (;;) {
            const k = rng.int(2, 8);
            const picks = rng.sample(realsNear(rng, k), 4);
            const sorted = [...picks].sort((x, y) => x.value - y.value);
            if (sorted.some((x, i) => i > 0 && x.value - sorted[i - 1]!.value < 0.04)) continue;
            const greatest = rng.bool();
            const [target, next] = greatest ? [sorted[3]!, sorted[2]!] : [sorted[0]!, sorted[1]!];
            const mid = Q.of(Math.round(((target.value + next.value) / 2) * 100), 100);
            const list = picks.map((x) => `$${x.latex}$`);
            const near = (x: Real) => (exactly(x.latex) ? `$${x.latex}$` : `$${x.latex} \\approx ${approx(x.value)}$`);
            const [tt, tn] = [against(target, mid), against(next, mid)];
            return chosenMath(
              rng,
              [
                `Which of these numbers is the ${greatest ? "greatest" : "least"}? ${list.join(", ")}`,
                `下面哪个数${greatest ? "最大" : "最小"}？${list.join("、")}`,
              ],
              target.latex,
              picks
                .filter((x) => x !== target)
                .map((x) => [
                  x.latex,
                  `${near(x)} is ${greatest ? "less" : "greater"} than ${near(target)}.`,
                  `${near(x)} ${greatest ? "小于" : "大于"} ${near(target)}。`,
                ]),
              [
                [
                  ["Approximate each number", "估算每个数"],
                  ["Write each one as a decimal to two places:", "把每个数写成两位小数："],
                  picks.map((x) => (exactly(x.latex) ? x.latex : `${x.latex} \\approx ${approx(x.value)}`)),
                ],
                [
                  ["Compare", "比较"],
                  [
                    `The ${greatest ? "greatest" : "least"} decimal belongs to $${target.latex}$.`,
                    `${greatest ? "最大" : "最小"}的小数对应 $${target.latex}$。`,
                  ],
                ],
              ],
              [
                `Test $${dec(mid)}$, which lies between the two ${greatest ? "largest" : "smallest"} numbers: ${tt[0]}; ${tn[0]}. So $${target.latex}$ is the ${greatest ? "greatest" : "least"}.`,
                `检验介于${greatest ? "最大" : "最小"}两个数之间的 $${dec(mid)}$：${tt[1]}；${tn[1]}。所以 $${target.latex}$ ${greatest ? "最大" : "最小"}。`,
              ],
            );
          }
        },
        dotLine(
          5,
          6,
          [5, 5.5, 6],
          [
            [5.1, "5.1"],
            [Math.sqrt(29), "√29"],
            [17 / 3, "17/3"],
            [Math.cbrt(200), "∛200"],
          ],
          [
            "A number line from 5 to 6 in tenths with four points, from left to right: 5.1, √29, 17/3 and ∛200.",
            "一条从 5 到 6、以十分之一为刻度的数轴上有四个点，从左到右依次是 5.1、√29、17/3 和 ∛200。",
          ],
        ),
      ),
    ],
  ),
  [
    "One square rug has sides of $5.5$ feet. Another has an area of $30$ square feet, so its sides are $\\sqrt{30}$ feet. Which rug is wider?",
    "一块正方形地毯的边长是 $5.5$ 英尺。另一块的面积是 $30$ 平方英尺，所以边长是 $\\sqrt{30}$ 英尺。哪块地毯更宽？",
  ],
  [
    "$5.5^{2} = 30.25$, a little more than $30$, so the $5.5$ foot rug is a little wider.",
    "$5.5^{2} = 30.25$，比 $30$ 略大，所以边长 $5.5$ 英尺的地毯略宽一些。",
  ],
  [
    "compare and order roots, fractions, decimals and $\\pi$ by squaring, cubing or approximating them.",
    "通过平方、立方或估算，比较根式、分数、小数和 $\\pi$ 的大小并排序。",
  ],
);

// ---------------------------------------------------------------------------
// Estimating expressions

/** estimatingExpressionsWithIrrationalNumbers locates expressions with roots and π between integers. */
export const estimatingExpressionsWithIrrationalNumbers = withIntro(
  topic(
    "estimating-expressions-with-irrational-numbers",
    t("Estimating Expressions With Irrational Numbers", "估算含无理数的式子"),
    t(
      "An expression with an irrational number can be estimated by replacing the irrational number with an approximation: bound a root between integers, or use 3.14 for π. Multiplying a root by a number is easier to bound after moving the number under the root: 3√5 = √45.",
      "估算含无理数的式子时，可以用近似值代替无理数：把根式夹在两个整数之间，或者用 3.14 代替 π。根式乘以一个数时，先把这个数移到根号内更容易估算：3√5 = √45。",
    ),
    ["approximating-square-roots-and-cube-roots"],
    ["8.NS.A.2"],
    [
      lesson(
        "bounding-expressions-with-roots",
        ["Expressions with roots", "含根式的式子"],
        [
          [
            "$3 + \\sqrt{40}$: since $6 < \\sqrt{40} < 7$, adding $3$ to each part gives $9 < 3 + \\sqrt{40} < 10$. For $8 - \\sqrt{40}$ the bounds swap: $8 - 7 < 8 - \\sqrt{40} < 8 - 6$, so it is between $1$ and $2$.",
            "$3 + \\sqrt{40}$：因为 $6 < \\sqrt{40} < 7$，各部分都加 $3$，得到 $9 < 3 + \\sqrt{40} < 10$。对于 $8 - \\sqrt{40}$，上下界要交换：$8 - 7 < 8 - \\sqrt{40} < 8 - 6$，所以它在 $1$ 和 $2$ 之间。",
          ],
          [
            "$\\sqrt{40} \\approx 6.325$, so $3 + \\sqrt{40} \\approx 9.325$ and $8 - \\sqrt{40} \\approx 1.675$.",
            "$\\sqrt{40} \\approx 6.325$，所以 $3 + \\sqrt{40} \\approx 9.325$，$8 - \\sqrt{40} \\approx 1.675$。",
          ],
          [
            "Subtracting a root swaps the bounds. The smaller integer for $8 - \\sqrt{40}$ is $8 - 7 = 1$, not $8 - 6 = 2$.",
            "减去根式时上下界要交换。$8 - \\sqrt{40}$ 的较小整数是 $8 - 7 = 1$，不是 $8 - 6 = 2$。",
          ],
        ],
        (rng) => {
          const plus = rng.bool();
          const n = nonPower(rng, 3, 99, 2);
          const r = iroot(n, 2);
          const b = plus ? rng.int(1, 12) : rng.int(r + 2, r + 12);
          const expr = plus ? `${b} + \\sqrt{${n}}` : `${b} - \\sqrt{${n}}`;
          const lo = plus ? b + r : b - r - 1;
          const s = Q.of(Math.round(Math.sqrt(n) * 1000), 1000);
          const v = plus ? Q.of(b).add(s) : Q.of(b).sub(s);
          return valued(
            [
              `The value of $${expr}$ lies between two consecutive integers. What is the smaller of the two?`,
              `$${expr}$ 的值介于两个连续整数之间。较小的那个整数是多少？`,
            ],
            lo,
            [
              [
                ["Trap the root", "夹住根式"],
                [
                  `$${r}^{2} = ${r * r}$ and $${r + 1}^{2} = ${(r + 1) ** 2}$, so:`,
                  `$${r}^{2} = ${r * r}$，$${r + 1}^{2} = ${(r + 1) ** 2}$，所以：`,
                ],
                [`${r} < \\sqrt{${n}} < ${r + 1}`],
              ],
              plus
                ? [
                    ["Add to each part", "各部分都加上"],
                    [`Add $${b}$ to each part:`, `各部分都加 $${b}$：`],
                    [`${lo} < ${expr} < ${lo + 1}`],
                  ]
                : [
                    ["Subtract from the number", "从这个数中减去"],
                    [`Subtracting from $${b}$ swaps the bounds:`, `从 $${b}$ 中减去时上下界交换：`],
                    [`${b} - ${r + 1} < ${expr} < ${b} - ${r}`, `${lo} < ${expr} < ${lo + 1}`],
                  ],
            ],
            [
              `Approximate instead: $\\sqrt{${n}} \\approx ${dec(s)}$, so $${expr} \\approx ${dec(v)}$, between $${lo}$ and $${lo + 1}$.`,
              `改用估算：$\\sqrt{${n}} \\approx ${dec(s)}$，所以 $${expr} \\approx ${dec(v)}$，介于 $${lo}$ 和 $${lo + 1}$ 之间。`,
            ],
            plus
              ? [
                  [lo + 1, "That is the larger of the two integers.", "这是两个整数中较大的那个。"],
                  [r, `That leaves out the $${b}$ that is added.`, `这漏掉了加上的 $${b}$。`],
                  [b + n, "That adds the number under the root instead of its root.", "这是加上了根号内的数，而不是它的平方根。"],
                ]
              : [
                  [
                    b - r,
                    "That subtracts the lower bound of the root, which gives the larger integer.",
                    "这是减去了根的下界，得到的是较大的整数。",
                  ],
                  [r, `That is the bound of the root alone, before subtracting from $${b}$.`, `这只是根的下界，还没有从 $${b}$ 中减去。`],
                  [b - n, "That subtracts the number under the root instead of its root.", "这是减去了根号内的数，而不是它的平方根。"],
                ],
          );
        },
        rootLine(9, 10, 0.1, [9, 9.5, 10], 3 + Math.sqrt(40), "3 + √40", [
          "A number line from 9 to 10 in tenths, with 3 + √40 plotted between 9.3 and 9.4.",
          "一条从 9 到 10、以十分之一为刻度的数轴，3 + √40 在 9.3 和 9.4 之间。",
        ]),
      ),
      lesson(
        "estimating-expressions-with-pi",
        ["Expressions with π", "含 π 的式子"],
        [
          [
            "To estimate $5\\pi - 4$ to the nearest whole number, use $\\pi \\approx 3.14$: $5 \\times 3.14 - 4 = 11.7$, so $5\\pi - 4 \\approx 12$.",
            "要把 $5\\pi - 4$ 估算到整数，用 $\\pi \\approx 3.14$：$5 \\times 3.14 - 4 = 11.7$，所以 $5\\pi - 4 \\approx 12$。",
          ],
          [
            "Bound $\\pi$ instead: $3.14 < \\pi < 3.15$, so $5\\pi - 4$ is between $11.7$ and $11.75$, and both round to $12$.",
            "改用 $\\pi$ 的上下界：$3.14 < \\pi < 3.15$，所以 $5\\pi - 4$ 介于 $11.7$ 和 $11.75$ 之间，两者都约等于 $12$。",
          ],
          [
            "$\\pi \\approx 3$ is too rough here: it gives $5 \\times 3 - 4 = 11$.",
            "这里用 $\\pi \\approx 3$ 太粗略：会得到 $5 \\times 3 - 4 = 11$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
            const b = rng.nonZero(-9, 9);
            const v = a * Math.PI + b;
            const ans = Math.round(v);
            const times = Q.of(314 * a, 100);
            const [low, high] = [times.add(Q.of(b)), Q.of(315 * a, 100).add(Q.of(b))];
            if (v <= 0 || Math.round(low.toNumber()) !== ans || Math.round(high.toNumber()) !== ans) continue;
            const expr = `${a}\\pi ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
            return valued(
              [`Estimate $${expr}$ to the nearest whole number.`, `把 $${expr}$ 估算到整数。`],
              ans,
              [
                [
                  ["Replace π", "代入 π 的近似值"],
                  ["Use $\\pi \\approx 3.14$:", "用 $\\pi \\approx 3.14$："],
                  [`${a} \\times 3.14 = ${dec(times)}`],
                ],
                [
                  ["Finish and round", "算完并取整"],
                  [
                    `${b < 0 ? "Subtract" : "Add"} $${Math.abs(b)}$ and round to the nearest whole number:`,
                    `${b < 0 ? "减去" : "加上"} $${Math.abs(b)}$，再取最接近的整数：`,
                  ],
                  [`${dec(times)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${dec(low)} \\approx ${ans}`],
                ],
              ],
              [
                `Bound $\\pi$ instead: $3.14 < \\pi < 3.15$, so $${expr}$ is between $${dec(low)}$ and $${dec(high)}$, and both round to $${ans}$.`,
                `改用 $\\pi$ 的上下界：$3.14 < \\pi < 3.15$，所以 $${expr}$ 介于 $${dec(low)}$ 和 $${dec(high)}$ 之间，两者都约等于 $${ans}$。`,
              ],
              [
                [3 * a + b, "That uses $\\pi \\approx 3$, which is too rough here.", "这是用了 $\\pi \\approx 3$，这里太粗略。"],
                [Math.floor(v), "That drops the decimal part instead of rounding.", "这是直接去掉了小数部分，而不是四舍五入。"],
                [
                  Math.round(a * (Math.PI + b)),
                  `That multiplies $${b}$ by $${a}$ too; only $\\pi$ is multiplied.`,
                  `这把 $${b}$ 也乘了 $${a}$；只有 $\\pi$ 要乘。`,
                ],
              ],
            );
          }
        },
        rootLine(11, 12, 0.1, [11, 11.5, 12], 5 * Math.PI - 4, "5π − 4", [
          "A number line from 11 to 12 in tenths, with 5π − 4 plotted between 11.7 and 11.8, nearer 12.",
          "一条从 11 到 12、以十分之一为刻度的数轴，5π − 4 在 11.7 和 11.8 之间，更接近 12。",
        ]),
      ),
    ],
  ),
  [
    "A fence runs around a round garden $5$ meters across, so it is $5\\pi$ meters long. About how many meters of fencing is that?",
    "一圈篱笆围着一个直径 $5$ 米的圆形花园，所以长 $5\\pi$ 米。大约是多少米？",
  ],
  [
    "With $\\pi \\approx 3.14$, $5\\pi \\approx 15.7$, about $16$ meters; $\\pi \\approx 3$ would give only $15$.",
    "用 $\\pi \\approx 3.14$，$5\\pi \\approx 15.7$，大约 $16$ 米；用 $\\pi \\approx 3$ 只能得到 $15$。",
  ],
  [
    "estimate sums and differences with roots between whole numbers, and expressions with $\\pi$ to the nearest whole number.",
    "把含根式的和与差夹在两个整数之间，把含 $\\pi$ 的式子估算到整数。",
  ],
);

/** grade8RealNumberTopics lists the 8th grade topics on the real number system. */
export const grade8RealNumberTopics: readonly TopicDef[] = [
  classifyingSquareRootsAndCubeRootsAsRationalOrIrrational,
  approximatingSquareRootsAndCubeRoots,
  comparingAndOrderingRealNumbers,
  estimatingExpressionsWithIrrationalNumbers,
];

/** theSmallestMultiplierForARationalCubeRoot finds the least whole number that makes a product a perfect cube; it is the third point of classifying-square-roots-and-cube-roots-as-rational-or-irrational, to take the place of the one in the deeper files. */
export const theSmallestMultiplierForARationalCubeRoot = lesson(
  "the-smallest-multiplier-for-a-rational-cube-root",
  ["The smallest multiplier for a rational cube root", "使立方根为有理数的最小乘数"],
  [
    [
      "$\\sqrt[3]{72k}$ is a whole number when $72k$ is a perfect cube, that is, when every prime in it appears a multiple of three times. $72 = 2^{3} \\cdot 3^{2}$: the $2$s already make a group of three, and the $3$s need one more. So the smallest $k$ is $3$.",
      "当 $72k$ 是完全立方数，也就是每个质因数出现的次数都是 3 的倍数时，$\\sqrt[3]{72k}$ 是整数。$72 = 2^{3} \\cdot 3^{2}$：三个 $2$ 已经凑成一组，$3$ 还差一个。所以最小的 $k$ 是 $3$。",
    ],
    ["$72 \\times 3 = 216 = 6^{3}$, a perfect cube.", "$72 \\times 3 = 216 = 6^{3}$，是完全立方数。"],
    [
      "A square needs pairs, a cube needs groups of three: $k = 2$ makes $144 = 12^{2}$, a perfect square, but not a perfect cube.",
      "平方要两个一组，立方要三个一组：$k = 2$ 得到 $144 = 12^{2}$，是完全平方数，却不是完全立方数。",
    ],
  ],
  (rng) => {
    for (;;) {
      const ps = rng.sample([2, 3, 5, 7], rng.int(1, 2)).sort((x, y) => x - y);
      const es = ps.map(() => rng.int(1, 5));
      if (es.every((e) => e % 3 === 0)) continue;
      const a = ps.reduce((v, p, i) => v * p ** es[i]!, 1);
      const needs = es.map((e) => (3 - (e % 3)) % 3);
      const k = ps.reduce((v, p, i) => v * p ** needs[i]!, 1);
      if (a < 8 || a > 3000 || k > 300) continue;
      const n = a * k;
      const c = Math.round(Math.cbrt(n));
      const power = (p: number, e: number) => (e === 1 ? `${p}` : `${p}^{${e}}`);
      const factors = ps.map((p, i) => power(p, es[i]!)).join(" \\cdot ");
      const kFactors = ps
        .map((p, i) => [p, needs[i]!] as const)
        .filter(([, e]) => e > 0)
        .map(([p, e]) => power(p, e))
        .join(" \\cdot ");
      const once = ps.filter((_, i) => needs[i]! > 0).reduce((v, p) => v * p, 1);
      const square = ps.reduce((v, p, i) => v * p ** (es[i]! % 2), 1);
      const said = ps.map((p, i) =>
        needs[i] === 0
          ? [`$${p}$ appears $${es[i]}$ times, already whole groups`, `$${p}$ 出现 $${es[i]}$ 次，已经凑成整组`]
          : [
              `$${p}$ appears $${es[i]}$ time${es[i] === 1 ? "" : "s"} and needs $${needs[i]}$ more`,
              `$${p}$ 出现 $${es[i]}$ 次，还差 $${needs[i]}$ 个`,
            ],
      );
      return valued(
        [
          `What is the smallest positive whole number $k$ for which $\\sqrt[3]{${a}k}$ is a whole number?`,
          `使 $\\sqrt[3]{${a}k}$ 为整数的最小正整数 $k$ 是多少？`,
        ],
        k,
        [
          [
            ["Factor the number", "分解质因数"],
            [`Write $${a}$ as a product of primes:`, `把 $${a}$ 写成质数的乘积：`],
            [`${a} = ${factors}`],
          ],
          [
            ["Complete groups of three", "凑成三个一组"],
            [
              `A perfect cube has every prime a multiple of three times. ${said.map((s) => s[0]).join("; ")}:`,
              `完全立方数中每个质因数的个数都是 3 的倍数。${said.map((s) => s[1]).join("；")}：`,
            ],
            [`k = ${kFactors} = ${k}`],
          ],
        ],
        [
          `Multiply out: $${a} \\times ${k} = ${n} = ${c}^{3}$, a perfect cube.`,
          `乘出来：$${a} \\times ${k} = ${n} = ${c}^{3}$，是完全立方数。`,
        ],
        [
          [
            once,
            "That gives each short prime one more copy, but a prime may need two.",
            "这是给每个不够的质数只补了一个，但有的质数要补两个。",
          ],
          [square, "That makes a perfect square, not a perfect cube.", "这样得到的是完全平方数，不是完全立方数。"],
          [n, `That is the product $${a}k$, not the multiplier $k$.`, `这是乘积 $${a}k$，不是乘数 $k$。`],
          [c, "That is the cube root of the product, not the multiplier.", "这是乘积的立方根，不是乘数。"],
        ],
      );
    }
  },
  tapeFigure(
    [
      {
        pieces: [
          { size: 1, text: "2", lit: true },
          { size: 1, text: "2", lit: true },
          { size: 1, text: "2", lit: true },
          { size: 1, text: "3" },
          { size: 1, text: "3" },
          { size: 1, text: "3", dashed: true },
        ],
        total: "72 × 3 = 216",
      },
    ],
    [
      "The prime factors of 72 in a row: three 2s shaded as a full group, two 3s, and a dashed third 3 that the multiplier supplies.",
      "72 的质因数排成一排：三个 2 涂色成一整组，两个 3，还有一个虚线的 3 由乘数补上。",
    ],
  ),
);

/** integersBetweenTwoRoots counts the integers between two square roots; it is the third point of comparing-and-ordering-real-numbers, to take the place of the one in the deeper files. */
export const integersBetweenTwoRoots = lesson(
  "integers-between-two-roots",
  ["Integers between two roots", "两个根之间的整数"],
  [
    [
      "An integer lies between $\\sqrt{10}$ and $\\sqrt{50}$ exactly when its square lies between $10$ and $50$. $3^{2} = 9 < 10 < 16 = 4^{2}$ and $7^{2} = 49 < 50 < 64 = 8^{2}$, so the integers between are $4$, $5$, $6$ and $7$: four of them.",
      "一个整数在 $\\sqrt{10}$ 和 $\\sqrt{50}$ 之间，当且仅当它的平方在 $10$ 和 $50$ 之间。$3^{2} = 9 < 10 < 16 = 4^{2}$，$7^{2} = 49 < 50 < 64 = 8^{2}$，所以中间的整数是 $4$、$5$、$6$、$7$，共四个。",
    ],
    [
      "Their squares $16$, $25$, $36$ and $49$ all lie between $10$ and $50$, while $9$ and $64$ do not.",
      "它们的平方 $16$、$25$、$36$、$49$ 都在 $10$ 和 $50$ 之间，而 $9$ 和 $64$ 不在。",
    ],
    [
      "Count the integers between the roots, not between the numbers under them: there are $39$ whole numbers between $10$ and $50$, but only $4$ integers between $\\sqrt{10}$ and $\\sqrt{50}$.",
      "要数的是两个根之间的整数，不是根号内两个数之间的整数：$10$ 和 $50$ 之间有 $39$ 个整数，而 $\\sqrt{10}$ 和 $\\sqrt{50}$ 之间只有 $4$ 个。",
    ],
  ],
  (rng) => {
    const lo = rng.int(2, 9);
    const n = rng.int(2, 7);
    const hi = lo + n;
    const a = lo * lo + rng.int(1, 2 * lo);
    const b = hi * hi + rng.int(1, 2 * hi);
    const squares = Array.from({ length: n }, (_, i) => `$${(lo + 1 + i) ** 2}$`);
    return valued(
      [`How many integers lie between $\\sqrt{${a}}$ and $\\sqrt{${b}}$?`, `$\\sqrt{${a}}$ 和 $\\sqrt{${b}}$ 之间有多少个整数？`],
      n,
      [
        [
          ["Trap each root", "夹住每个根"],
          ["Find the perfect squares around both numbers:", "找出两个数两侧的完全平方数："],
          [trap(a, 2), trap(b, 2)],
        ],
        [
          ["Count the integers between", "数出中间的整数"],
          [
            `So $${lo} < \\sqrt{${a}} < ${lo + 1}$ and $${hi} < \\sqrt{${b}} < ${hi + 1}$. The integers between run from $${lo + 1}$ to $${hi}$:`,
            `所以 $${lo} < \\sqrt{${a}} < ${lo + 1}$，$${hi} < \\sqrt{${b}} < ${hi + 1}$。中间的整数从 $${lo + 1}$ 到 $${hi}$：`,
          ],
          [`${hi} - ${lo} = ${n}`],
        ],
      ],
      [
        `Square the candidates instead: ${squares.join(", ")} all lie between $${a}$ and $${b}$, while $${lo * lo}$ and $${(hi + 1) ** 2}$ do not. That is $${n}$ squares.`,
        `改为把候选整数平方：${squares.join("、")} 都在 $${a}$ 和 $${b}$ 之间，而 $${lo * lo}$ 和 $${(hi + 1) ** 2}$ 不在。一共 $${n}$ 个。`,
      ],
      [
        [n + 1, `That also counts $${lo}$, which is below $\\sqrt{${a}}$.`, `这把 $${lo}$ 也算进去了，而它小于 $\\sqrt{${a}}$。`],
        [
          n - 1,
          `That leaves out $${hi}$, which is below $\\sqrt{${b}}$ since $${hi * hi} < ${b}$.`,
          `这漏掉了 $${hi}$，而 $${hi * hi} < ${b}$，所以它小于 $\\sqrt{${b}}$。`,
        ],
        [
          b - a - 1,
          "That counts the whole numbers between the numbers under the roots, not between the roots.",
          "这数的是根号内两个数之间的整数，不是两个根之间的整数。",
        ],
        [hi, "That is the largest integer between them, not how many there are.", "这是中间最大的整数，不是整数的个数。"],
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
        { at: Math.sqrt(50), text: "√50", result: true },
      ],
    },
    [
      "A number line from 3 to 8 with √10 just right of 3 and √50 just right of 7; the integers 4, 5, 6 and 7 lie between them.",
      "一条从 3 到 8 的数轴，√10 在 3 的右边不远处，√50 在 7 的右边不远处；整数 4、5、6、7 在它们之间。",
    ],
  ),
);

/** aMultipleOfARoot traps a whole number times a square root between consecutive integers; it is the third point of estimating-expressions-with-irrational-numbers, to take the place of the one in the deeper files. */
export const aMultipleOfARoot = lesson(
  "a-multiple-of-a-root",
  ["A multiple of a root", "根的倍数"],
  [
    [
      "To trap $2\\sqrt{10}$, move the $2$ under the root by squaring it: $2\\sqrt{10} = \\sqrt{4 \\cdot 10} = \\sqrt{40}$. Since $36 < 40 < 49$, $2\\sqrt{10}$ is between $6$ and $7$.",
      "要夹住 $2\\sqrt{10}$，把 $2$ 平方后移到根号内：$2\\sqrt{10} = \\sqrt{4 \\cdot 10} = \\sqrt{40}$。因为 $36 < 40 < 49$，$2\\sqrt{10}$ 在 $6$ 和 $7$ 之间。",
    ],
    [
      "$\\sqrt{10} \\approx 3.162$, and $2 \\times 3.162 = 6.324$, between $6$ and $7$.",
      "$\\sqrt{10} \\approx 3.162$，$2 \\times 3.162 = 6.324$，在 $6$ 和 $7$ 之间。",
    ],
    [
      "Rounding the root before multiplying multiplies the error too: $5\\sqrt{7}$ is not near $5 \\times 3 = 15$, since $5\\sqrt{7} = \\sqrt{175}$ and $13^{2} = 169 < 175 < 196 = 14^{2}$.",
      "先把根取整再相乘，误差也会被放大：$5\\sqrt{7}$ 并不接近 $5 \\times 3 = 15$，因为 $5\\sqrt{7} = \\sqrt{175}$，而 $13^{2} = 169 < 175 < 196 = 14^{2}$。",
    ],
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const n = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]);
    const inside = k * k * n;
    const low = iroot(inside, 2);
    const s = Q.of(Math.round(Math.sqrt(n) * 1000), 1000);
    return valued(
      [
        `$${k}\\sqrt{${n}}$ lies between two consecutive whole numbers. What is the smaller one?`,
        `$${k}\\sqrt{${n}}$ 在两个相邻整数之间。较小的那个是多少？`,
      ],
      low,
      [
        [
          ["Move the multiplier under the root", "把乘数移到根号内"],
          [`$${k} = \\sqrt{${k * k}}$, so:`, `$${k} = \\sqrt{${k * k}}$，所以：`],
          [`${k}\\sqrt{${n}} = \\sqrt{${k * k} \\cdot ${n}} = \\sqrt{${inside}}`],
        ],
        [["Trap it", "夹住它"], [`Find the perfect squares around $${inside}$:`, `找出 $${inside}$ 两侧的完全平方数：`], [trap(inside, 2)]],
      ],
      [
        `Approximate instead: $\\sqrt{${n}} \\approx ${dec(s)}$, so $${k}\\sqrt{${n}} \\approx ${k} \\times ${dec(s)} = ${dec(s.mul(Q.of(k)))}$, between $${low}$ and $${low + 1}$.`,
        `改用估算：$\\sqrt{${n}} \\approx ${dec(s)}$，所以 $${k}\\sqrt{${n}} \\approx ${k} \\times ${dec(s)} = ${dec(s.mul(Q.of(k)))}$，介于 $${low}$ 和 $${low + 1}$ 之间。`,
      ],
      [
        [low + 1, "That is the larger of the two whole numbers.", "这是两个整数中较大的那个。"],
        [
          k * Math.round(Math.sqrt(n)),
          `That rounds $\\sqrt{${n}}$ first and then multiplies by $${k}$, which multiplies the rounding error too.`,
          `这是先把 $\\sqrt{${n}}$ 取整再乘 $${k}$，误差也被放大了。`,
        ],
        [
          k * iroot(n, 2),
          `That multiplies only the whole-number part of $\\sqrt{${n}}$ by $${k}$.`,
          `这只是把 $\\sqrt{${n}}$ 的整数部分乘了 $${k}$。`,
        ],
        [
          k * n,
          `That multiplies $${k}$ by $${n}$ instead of putting $${k * k}$ under the root.`,
          `这是把 $${k}$ 乘 $${n}$，而不是把 $${k * k}$ 放到根号内。`,
        ],
      ],
    );
  },
  rootLine(6, 7, 0.1, [6, 6.5, 7], 2 * Math.sqrt(10), "2√10", [
    "A number line from 6 to 7 in tenths, with 2√10 plotted between 6.3 and 6.4.",
    "一条从 6 到 7、以十分之一为刻度的数轴，2√10 在 6.3 和 6.4 之间。",
  ]),
);
