import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, factorizationLatex, gcd, num, primeFactors, Q, radical, simplifyRadical } from "@ga/subject-math";

import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { lesson, valued, withIntro } from "./grade-6-kit.ts";
import { rooted, tableFigure } from "./grade-8-kit.ts";
import { areaGridFigure, equalTape, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** squareFree are the square-free radicands used in generated problems. */
const squareFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

/** root writes c√m without simplifying: root(3, 8) is "3\sqrt{8}". */
const root = (c: number, m: number) => `${c === 1 ? "" : c === -1 ? "-" : c}\\sqrt{${m}}`;

/** extraction writes the steps √(k²m) = √(k²)·√m = k√m. */
function extraction(n: number): string {
  const [k, m] = simplifyRadical(n);
  return `\\sqrt{${n}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`;
}

/** radicand draws k²m with k ≥ 2 and m square-free, at most max. */
function radicand(rng: Rng, max: number): number {
  for (;;) {
    const k = rng.int(2, 7);
    const m = rng.pick(squareFree);
    if (k * k * m <= max) return k * k * m;
  }
}

/** splitPowers writes n as primes, then each exponent divided by k: "144 = 2^{4} \cdot 3^{2}" and "2^{2} \cdot 3 = 12". */
function splitPowers(n: number, k: 2 | 3): [whole: string, part: string] {
  const factors = primeFactors(n);
  const root = Math.round(n ** (1 / k));
  const part = factorizationLatex(factors.map(([p, e]) => [p, e / k]));
  return [`${n} = ${factorizationLatex(factors)}`, part === String(root) ? part : `${part} = ${root}`];
}

/** squareRootsAndCubeRoots takes square roots of perfect squares and cube roots of perfect cubes. */
export const squareRootsAndCubeRoots: TopicDef = withIntro(
  {
    id: "square-roots-and-cube-roots",
    title: t("Square Roots and Cube Roots", "平方根与立方根"),
    summary: t("Take square roots of perfect squares and cube roots of perfect cubes.", "求完全平方数的平方根和完全立方数的立方根。"),
    prerequisites: ["powers-of-rational-numbers"],
    encompasses: [{ topic: "powers-of-rational-numbers", weight: 0.3 }],
    xp: 10,
    standards: ["CCSS.8.EE.A.2"],
    knowledgePoints: [
      lesson(
        "square-roots-of-perfect-squares",
        ["Square roots of perfect squares", "完全平方数的平方根"],
        [
          [
            "The **square root** $\\sqrt{a}$ is the number $r \\ge 0$ with $r^{2} = a$. So $\\sqrt{49} = 7$ because $7^{2} = 49$: a square of area $49$ has side $7$. For a fraction, take the root of each part, $\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$. For a decimal, take the root of the digits and halve the decimal places, $\\sqrt{0.36} = 0.6$.",
            "**平方根** $\\sqrt{a}$ 是满足 $r^{2} = a$ 的数 $r \\ge 0$。所以 $\\sqrt{49} = 7$，因为 $7^{2} = 49$：面积为 $49$ 的正方形边长是 $7$。分数分别对分子、分母开方，$\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$。小数先对数字开方，再把小数位数减半，$\\sqrt{0.36} = 0.6$。",
          ],
          ["$0.6 \\times 0.6 = 0.36$, so $\\sqrt{0.36} = 0.6$.", "$0.6 \\times 0.6 = 0.36$，所以 $\\sqrt{0.36} = 0.6$。"],
          [
            "The symbol $\\sqrt{\\phantom{a}}$ always means the nonnegative root. $\\sqrt{49}$ is $7$, not $-7$, and $-\\sqrt{49} = -7$.",
            "符号 $\\sqrt{\\phantom{a}}$ 总是表示非负的根。$\\sqrt{49}$ 是 $7$，不是 $-7$；而 $-\\sqrt{49} = -7$。",
          ],
        ],
        (rng) => {
          const kind = rng.pick(["integer", "integer", "fraction", "decimal"] as const);
          const negate = rng.bool(0.25);
          let r: Q;
          if (kind === "integer") r = Q.of(rng.int(2, 25));
          else if (kind === "decimal") r = Q.of(rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]), 10);
          else {
            let a: number;
            let b: number;
            do {
              a = rng.int(1, 9);
              b = rng.int(2, 12);
            } while (gcd(a, b) !== 1);
            r = Q.of(a, b);
          }
          const sq = r.mul(r);
          const shown = (v: Q) => (kind === "decimal" ? dec(v) : num(v));
          const inside = shown(sq);
          const value = negate ? r.neg() : r;
          const a = Number(r.n);
          const b = Number(r.d);
          const k = Number(r.mul(Q.of(10)).n);
          const find: Walk =
            kind === "integer"
              ? [
                  ["Find the root", "找出根"],
                  [`Look for the nonnegative number whose square is $${inside}$:`, `找平方等于 $${inside}$ 的非负数：`],
                  [`${a}^{2} = ${inside}`],
                ]
              : kind === "fraction"
                ? [
                    ["Root of each part", "分子分母分别开方"],
                    [`$${a * a}$ and $${b * b}$ are both perfect squares:`, `$${a * a}$ 和 $${b * b}$ 都是完全平方数：`],
                    [`\\sqrt{${inside}} = \\frac{\\sqrt{${a * a}}}{\\sqrt{${b * b}}} = ${num(r)}`],
                  ]
                : [
                    ["Root of the digits", "数字开方"],
                    [
                      `Take the root of the digits, $\\sqrt{${k * k}} = ${k}$. The number has $2$ decimal places, so its root has $1$:`,
                      `先对数字开方，$\\sqrt{${k * k}} = ${k}$。这个数有 $2$ 位小数，所以它的根有 $1$ 位：`,
                    ],
                    [`\\sqrt{${inside}} = ${dec(r)}`],
                  ];
          const check: Pair =
            kind === "integer"
              ? (() => {
                  const [whole, part] = splitPowers(a * a, 2);
                  return [
                    `Factor into primes: $${whole}$. Halving each exponent gives $${part}$.`,
                    `分解质因数：$${whole}$。把每个指数减半，得 $${part}$。`,
                  ];
                })()
              : kind === "fraction"
                ? [
                    `Square the root back: $\\left(${num(r)}\\right)^{2} = \\frac{${a * a}}{${b * b}}$.`,
                    `把根平方回去：$\\left(${num(r)}\\right)^{2} = \\frac{${a * a}}{${b * b}}$。`,
                  ]
                : [
                    `Square the root back: $${dec(r)} \\times ${dec(r)} = ${inside}$.`,
                    `把根平方回去：$${dec(r)} \\times ${dec(r)} = ${inside}$。`,
                  ];
          return valued(
            [`Evaluate $${negate ? "-" : ""}\\sqrt{${inside}}$.`, `计算 $${negate ? "-" : ""}\\sqrt{${inside}}$。`],
            value,
            [
              find,
              [
                ["Read the sign", "确定符号"],
                negate
                  ? [
                      "The root symbol gives the nonnegative root, and the minus sign in front takes its opposite:",
                      "根号给出非负的根，前面的负号再取它的相反数：",
                    ]
                  : ["The root symbol gives the nonnegative root:", "根号给出非负的根："],
                [`${negate ? "-" : ""}\\sqrt{${inside}} = ${shown(value)}`],
              ],
            ],
            check,
            [
              [
                value.neg(),
                negate
                  ? "That drops the minus sign in front of the root."
                  : "That gives the negative root; the root symbol means the nonnegative one.",
                negate ? "这是丢掉了根号前面的负号。" : "这是取了负的根；根号表示非负的根。",
              ],
              [sq.div(Q.of(2)), "That halves the number instead of taking its root.", "这是把这个数除以 2，而不是开方。"],
              ...(kind === "decimal"
                ? [
                    [
                      r.mul(Q.of(10)).mul(Q.of(negate ? -1 : 1)),
                      "That puts the point in the wrong place; the root has half as many decimal places.",
                      "这是小数点点错了；根的小数位数是原数的一半。",
                    ] as const,
                  ]
                : []),
            ],
            kind === "decimal" ? { form: "decimal" } : {},
          );
        },
        tableFigure(
          ["7"],
          ["7"],
          [["49"]],
          ["A square of area 49 whose sides are each 7 long, since 7 × 7 = 49.", "一个面积为 49 的正方形，每条边长 7，因为 7 × 7 = 49。"],
        ),
      ),
      lesson(
        "squaring-a-square-root",
        ["Squaring a square root", "平方根的平方"],
        [
          [
            "By definition $\\sqrt{a}$ is the nonnegative number whose square is $a$, so squaring it gives $a$ back, even when $\\sqrt{a}$ is not a whole number: $\\left(\\sqrt{7}\\right)^{2} = 7$. With a coefficient, square each factor: $\\left(3\\sqrt{2}\\right)^{2} = 3^{2} \\cdot \\left(\\sqrt{2}\\right)^{2} = 9 \\cdot 2 = 18$.",
            "按定义，$\\sqrt{a}$ 是平方等于 $a$ 的非负数，所以它的平方就是 $a$，即使 $\\sqrt{a}$ 不是整数：$\\left(\\sqrt{7}\\right)^{2} = 7$。有系数时，每个因数分别平方：$\\left(3\\sqrt{2}\\right)^{2} = 3^{2} \\cdot \\left(\\sqrt{2}\\right)^{2} = 9 \\cdot 2 = 18$。",
          ],
          [
            "$\\sqrt{2} \\approx 1.414$, and $1.414^{2} \\approx 1.999$, very close to $2$.",
            "$\\sqrt{2} \\approx 1.414$，而 $1.414^{2} \\approx 1.999$，非常接近 $2$。",
          ],
          [
            "Square the coefficient too. $\\left(3\\sqrt{2}\\right)^{2}$ is $18$, not $3 \\cdot 2 = 6$.",
            "系数也要平方。$\\left(3\\sqrt{2}\\right)^{2}$ 是 $18$，不是 $3 \\cdot 2 = 6$。",
          ],
        ],
        (rng) => {
          const m = rng.pick([...squareFree, 17, 19, 21, 22, 23, 26, 29, 30]);
          const c = rng.bool(0.5) ? 1 : rng.pick([2, 3, 4, 5, -2, -3]);
          const value = c * c * m;
          const expr = c === 1 ? `\\left(\\sqrt{${m}}\\right)^{2}` : `\\left(${root(c, m)}\\right)^{2}`;
          const approx = (c * Math.sqrt(m)).toFixed(3);
          const squared = (Number(approx) * Number(approx)).toFixed(2);
          return valued(
            [`Evaluate $${expr}$.`, `计算 $${expr}$。`],
            value,
            c === 1
              ? [
                  [
                    ["Use the meaning", "用定义"],
                    [`$\\sqrt{${m}}$ is the nonnegative number whose square is $${m}$.`, `$\\sqrt{${m}}$ 是平方等于 $${m}$ 的非负数。`],
                  ],
                  [["Square it", "平方"], ["So squaring it gives the number back:", "所以把它平方就得到原来的数："], [`${expr} = ${m}`]],
                ]
              : [
                  [
                    ["Square each factor", "每个因数分别平方"],
                    ["The power applies to the coefficient and to the root:", "乘方既作用于系数，也作用于根式："],
                    [`${expr} = ${c < 0 ? `(${c})` : c}^{2} \\cdot \\left(\\sqrt{${m}}\\right)^{2}`],
                  ],
                  [
                    ["Multiply", "相乘"],
                    ["Squaring the root gives back the number under it:", "根式的平方就是根号下的数："],
                    [`${c * c} \\cdot ${m} = ${value}`],
                  ],
                ],
            [
              `Use a decimal: $${root(c, m)} \\approx ${approx}$, and $${Number(approx) < 0 ? `(${approx})` : approx}^{2} \\approx ${squared}$, very close to $${value}$.`,
              `用小数估算：$${root(c, m)} \\approx ${approx}$，而 $${Number(approx) < 0 ? `(${approx})` : approx}^{2} \\approx ${squared}$，非常接近 $${value}$。`,
            ],
            [
              [
                m * m * c * c,
                "That squares the number under the root as well; squaring the root just undoes it.",
                "这是把根号下的数也平方了；平方只是把根号去掉。",
              ],
              [2 * c * m, "That doubles instead of squaring.", "这是乘 2，而不是平方。"],
              ...(c === 1
                ? []
                : [
                    [c * m, "That uses the coefficient once; it is squared too.", "这里系数只乘了一次；系数也要平方。"] as const,
                    ...(c < 0
                      ? [
                          [
                            -value,
                            "That keeps the minus sign; the square of a negative coefficient is positive.",
                            "这是保留了负号；负系数的平方是正数。",
                          ] as const,
                        ]
                      : []),
                  ]),
            ],
            { form: "integer" },
          );
        },
        tableFigure(
          ["√7"],
          ["√7"],
          [["7"]],
          ["A square whose sides are each √7 long; its area is √7 × √7 = 7.", "一个每条边长 √7 的正方形，面积是 √7 × √7 = 7。"],
        ),
      ),
      {
        ...lesson(
          "cube-roots-of-perfect-cubes",
          ["Cube roots of perfect cubes", "完全立方数的立方根"],
          [
            [
              "The **cube root** $\\sqrt[3]{a}$ is the number whose cube is $a$: $\\sqrt[3]{64} = 4$ because $4^{3} = 64$, and a cube of volume $64$ has edge $4$. Unlike square roots, cube roots of negative numbers exist, because the cube of a negative number is negative: $\\sqrt[3]{-27} = -3$ since $(-3)^{3} = -27$.",
              "**立方根** $\\sqrt[3]{a}$ 是立方等于 $a$ 的数：$\\sqrt[3]{64} = 4$，因为 $4^{3} = 64$，体积为 $64$ 的正方体棱长是 $4$。与平方根不同，负数也有立方根，因为负数的立方是负数：$\\sqrt[3]{-27} = -3$，因为 $(-3)^{3} = -27$。",
            ],
            ["$(-3)(-3)(-3) = 9 \\cdot (-3) = -27$.", "$(-3)(-3)(-3) = 9 \\cdot (-3) = -27$。"],
            [
              "A cube root is not a third of the number. $\\sqrt[3]{27}$ is $3$, not $9$.",
              "立方根不是这个数的三分之一。$\\sqrt[3]{27}$ 是 $3$，不是 $9$。",
            ],
          ],
          (rng) => {
            const whole = rng.bool(0.75);
            let a: number;
            let b = 1;
            if (whole) a = rng.int(2, 10);
            else {
              do {
                a = rng.int(1, 5);
                b = rng.int(2, 6);
              } while (gcd(a, b) !== 1);
            }
            const s = rng.sign();
            const r = Q.of(s * a, b);
            const cube = r.pow(3);
            const size = Q.of(a, b);
            const check: Pair = whole
              ? (() => {
                  const [all, part] = splitPowers(a ** 3, 3);
                  return [
                    `Factor the size into primes: $${all}$. A third of each exponent gives $${part}$.`,
                    `把大小分解质因数：$${all}$。把每个指数除以 3，得 $${part}$。`,
                  ];
                })()
              : [
                  `Cube the root back one factor at a time: $${num(r)}, \\; ${num(r.pow(2))}, \\; ${num(cube)}$.`,
                  `把根一个因数一个因数地立方回去：$${num(r)}, \\; ${num(r.pow(2))}, \\; ${num(cube)}$。`,
                ];
            return valued(
              [`Evaluate $\\sqrt[3]{${num(cube)}}$.`, `计算 $\\sqrt[3]{${num(cube)}}$。`],
              r,
              [
                [
                  ["Settle the sign", "定符号"],
                  s < 0
                    ? [
                        "The number is negative, and three negative factors make a negative product, so the root is negative.",
                        "这个数是负数，三个负因数的积是负数，所以立方根是负数。",
                      ]
                    : ["The number is positive, so the root is positive.", "这个数是正数，所以立方根是正数。"],
                ],
                [
                  ["Find the size", "求大小"],
                  [`Look for the number whose cube is $${num(size.pow(3))}$:`, `找立方等于 $${num(size.pow(3))}$ 的数：`],
                  [`${whole ? a : `\\left(${num(size)}\\right)`}^{3} = ${num(size.pow(3))}`, `\\sqrt[3]{${num(cube)}} = ${num(r)}`],
                ],
              ],
              check,
              [
                [
                  r.neg(),
                  s < 0
                    ? "That drops the sign; the cube root of a negative number is negative."
                    : "That adds a minus sign; the cube root of a positive number is positive.",
                  s < 0 ? "这是丢掉了符号；负数的立方根是负数。" : "这是多了一个负号；正数的立方根是正数。",
                ],
                [cube.div(Q.of(3)), "That divides by $3$ instead of taking the cube root.", "这是除以 $3$，而不是开立方。"],
              ],
            );
          },
          tableFigure(
            ["1", "2", "3", "4"],
            ["n³", "∛(n³)"],
            [
              ["1", "1"],
              ["8", "2"],
              ["27", "3"],
              ["64", "4"],
            ],
            [
              "A table of the first perfect cubes 1, 8, 27 and 64 beside their cube roots 1, 2, 3 and 4.",
              "前几个完全立方数 1、8、27、64 及其立方根 1、2、3、4 的表。",
            ],
          ),
        ),
        keyPrerequisites: ["powers-of-integers"],
      },
    ],
  },
  [
    "A square garden covers $49$ m². How long is each side? We need a number that times itself makes $49$.",
    "一块正方形花园面积 $49$ 平方米。每条边多长？要找一个自乘等于 $49$ 的数。",
  ],
  ["$7 \\times 7 = 49$, so each side is $7$ m, and $\\sqrt{49} = 7$.", "$7 \\times 7 = 49$，所以每条边长 $7$ 米，$\\sqrt{49} = 7$。"],
  [
    "undo squaring and cubing with square roots and cube roots of fractions, decimals and negative numbers.",
    "学习用平方根和立方根还原平方与立方，包括分数、小数和负数。",
  ],
);

/** simplifyingSquareRoots writes square roots in simplest radical form, multiplies them, and moves a whole number under a root. */
export const simplifyingSquareRoots: TopicDef = withIntro(
  {
    id: "simplifying-square-roots",
    title: t("Simplifying Square Roots", "化简平方根"),
    summary: t("Write square roots in simplest radical form, and multiply them.", "把平方根化成最简根式，并进行根式乘法。"),
    prerequisites: ["square-roots-and-cube-roots"],
    encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.4 }],
    xp: 12,
    standards: ["CCSS.8.EE.A.2", "CCSS.HSN.RN.A.2"],
    knowledgePoints: [
      {
        ...lesson(
          "simplest-radical-form",
          ["Simplest radical form", "最简根式"],
          [
            [
              "Since $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$, a perfect-square factor can come out of the root: $\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$. A root is in **simplest form** when no perfect square other than $1$ divides the number under it.",
              "因为 $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$，完全平方因数可以移到根号外：$\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$。根号里的数除了 $1$ 以外不再有完全平方因数时，根式就是**最简根式**。",
            ],
            ["Square back: $6^{2} \\cdot 2 = 36 \\cdot 2 = 72$.", "平方回去：$6^{2} \\cdot 2 = 36 \\cdot 2 = 72$。"],
            [
              "Take out the largest square factor. $\\sqrt{72} = 2\\sqrt{18}$ is true, but $\\sqrt{18}$ still holds the square $9$.",
              "要移出最大的平方因数。$\\sqrt{72} = 2\\sqrt{18}$ 没错，但 $\\sqrt{18}$ 里还有平方数 $9$。",
            ],
          ],
          (rng) => {
            const n = radicand(rng, 300);
            const [k, m] = simplifyRadical(n);
            const c = rng.bool(0.3) ? rng.int(2, 5) : 1;
            const expr = root(c, n);
            const partial = [2, 3, 5].find((p) => k % p === 0 && k !== p);
            return rooted(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              [c * k, m],
              [
                [
                  ["Find the largest square factor", "找出最大的平方因数"],
                  [
                    `$${n} = ${k * k} \\cdot ${m}$, and $${k * k} = ${k}^{2}$.`,
                    `$${n} = ${k * k} \\cdot ${m}$，而 $${k * k} = ${k}^{2}$。`,
                  ],
                ],
                [
                  ["Take it out", "移到根号外"],
                  c === 1
                    ? ["Take the square root of the square factor:", "把平方因数开方，移到根号外："]
                    : [`Take the square root of the square factor, then multiply by $${c}$:`, `把平方因数开方移出，再乘以 $${c}$：`],
                  [c === 1 ? extraction(n) : `${expr} = ${c} \\cdot ${radical(k, m)} = ${radical(c * k, m)}`],
                ],
              ],
              [`Square back: $${k}^{2} \\cdot ${m} = ${n}$.`, `平方回去：$${k}^{2} \\cdot ${m} = ${n}$。`],
              [
                [
                  root(c * k * k, m),
                  "That puts the square factor outside instead of its square root.",
                  "这是把平方因数本身移到了外面，而不是它的平方根。",
                ],
                ...(partial
                  ? [
                      [
                        root(c * partial, n / (partial * partial)),
                        "That takes out a smaller square; the root can still be simplified.",
                        "这是移出了较小的平方因数；根式还能继续化简。",
                      ] as const,
                    ]
                  : []),
                [
                  root(c * m, k),
                  "That swaps the numbers; the square root of the square factor goes outside.",
                  "这是把两个数弄反了；移到外面的是平方因数的平方根。",
                ],
              ],
            );
          },
          areaGridFigure(["6√2"], ["6√2"], [["72"]]),
        ),
        keyPrerequisites: ["prime-factorization"],
      },
      lesson(
        "multiplying-square-roots",
        ["Multiplying square roots", "根式的乘法"],
        [
          [
            "For numbers that are not negative, $\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$. Multiply the numbers in front, multiply the numbers under the roots, then simplify: $2\\sqrt{6} \\cdot 5\\sqrt{10} = 10\\sqrt{60} = 10 \\cdot 2\\sqrt{15} = 20\\sqrt{15}$.",
            "对于非负数，$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$。根号前面的数相乘，根号里的数相乘，再化简：$2\\sqrt{6} \\cdot 5\\sqrt{10} = 10\\sqrt{60} = 10 \\cdot 2\\sqrt{15} = 20\\sqrt{15}$。",
          ],
          [
            "$\\sqrt{4} \\cdot \\sqrt{9} = 2 \\cdot 3 = 6$, and $\\sqrt{36} = 6$ too.",
            "$\\sqrt{4} \\cdot \\sqrt{9} = 2 \\cdot 3 = 6$，而 $\\sqrt{36}$ 也等于 $6$。",
          ],
          [
            "Multiply the numbers under the roots, do not add them. $\\sqrt{2} \\cdot \\sqrt{3}$ is $\\sqrt{6}$, not $\\sqrt{5}$.",
            "根号里的数要相乘，不是相加。$\\sqrt{2} \\cdot \\sqrt{3}$ 是 $\\sqrt{6}$，不是 $\\sqrt{5}$。",
          ],
        ],
        (rng) => {
          let p: number;
          let q: number;
          do {
            [p, q] = rng.sample(squareFree, 2) as [number, number];
          } while (gcd(p, q) === 1 && rng.bool(0.7));
          const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
          const [k, m] = simplifyRadical(p * q);
          const product = root(a * b, p * q);
          const answer = radical(a * b * k, m);
          return rooted(
            [`Simplify $${root(a, p)} \\cdot ${root(b, q)}$.`, `化简 $${root(a, p)} \\cdot ${root(b, q)}$。`],
            [a * b * k, m],
            [
              [
                ["Multiply", "相乘"],
                ["Multiply the numbers in front and the numbers under the roots:", "根号前面的数相乘，根号里的数相乘："],
                [`${root(a, p)} \\cdot ${root(b, q)} = ${product}`],
              ],
              k > 1
                ? [
                    ["Simplify", "化简"],
                    [
                      `$${p * q} = ${k * k} \\cdot ${m}$, so $${k}$ comes out:`,
                      `$${p * q} = ${k * k} \\cdot ${m}$，所以 $${k}$ 移到根号外：`,
                    ],
                    [`${product} = ${answer}`],
                  ]
                : [
                    ["Simplify", "化简"],
                    [
                      `$${p * q}$ has no square factor, so $${product}$ is already simplest.`,
                      `$${p * q}$ 没有平方因数，所以 $${product}$ 已是最简根式。`,
                    ],
                  ],
            ],
            [
              `Square both forms: $${(a * b) ** 2} \\cdot ${p * q} = ${(a * b * k) ** 2} \\cdot ${m} = ${(a * b) ** 2 * p * q}$.`,
              `把两种写法都平方：$${(a * b) ** 2} \\cdot ${p * q} = ${(a * b * k) ** 2} \\cdot ${m} = ${(a * b) ** 2 * p * q}$。`,
            ],
            [
              [root(a * b, p + q), "That adds the numbers under the roots; they multiply.", "这是把根号里的数相加了；它们要相乘。"],
              [root(a + b, p * q), "That adds the numbers in front; they multiply.", "这是把根号前面的数相加了；它们要相乘。"],
              ...(k > 1
                ? [
                    [
                      root(a * b * k, m * k),
                      `That takes $${k}$ out but leaves it under the root too.`,
                      `这是把 $${k}$ 移了出去，却又留在根号里。`,
                    ] as const,
                  ]
                : []),
            ],
          );
        },
        areaGridFigure(["2√6"], ["5√10"], [["20√15"]]),
      ),
      lesson(
        "moving-a-whole-number-under-a-root",
        ["Moving a whole number under a root", "把整数移到根号里"],
        [
          [
            "Simplifying pulls a square factor out of a root, and the same step works in reverse. A whole number $k$ equals $\\sqrt{k^{2}}$, so $3\\sqrt{5} = \\sqrt{9} \\cdot \\sqrt{5} = \\sqrt{45}$. This helps when you compare surds: the one with the larger number under its root is larger.",
            "化简是把平方因数从根号里移出来，这一步也可以倒过来做。整数 $k$ 等于 $\\sqrt{k^{2}}$，所以 $3\\sqrt{5} = \\sqrt{9} \\cdot \\sqrt{5} = \\sqrt{45}$。比较根式时这很有用：根号里的数较大的那个就较大。",
          ],
          ["Simplify back: $\\sqrt{45} = \\sqrt{9 \\cdot 5} = 3\\sqrt{5}$.", "化简回去：$\\sqrt{45} = \\sqrt{9 \\cdot 5} = 3\\sqrt{5}$。"],
          [
            "Square the outside number on the way in. $3\\sqrt{5}$ is $\\sqrt{45}$, not $\\sqrt{15}$.",
            "外面的数移进根号时要平方。$3\\sqrt{5}$ 是 $\\sqrt{45}$，不是 $\\sqrt{15}$。",
          ],
        ],
        (rng) => {
          const k = rng.int(2, 12);
          const m = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
          const answer = k * k * m;
          return valued(
            [`The number $${k}\\sqrt{${m}}$ can be written as $\\sqrt{n}$. Find $n$.`, `$${k}\\sqrt{${m}}$ 可以写成 $\\sqrt{n}$。求 $n$。`],
            answer,
            [
              [
                ["Write the number as a root", "把整数写成根式"],
                [`$${k} = \\sqrt{${k * k}}$.`, `$${k} = \\sqrt{${k * k}}$。`],
              ],
              [
                ["Join the roots", "合成一个根式"],
                ["Use the product rule for roots:", "用根式的乘法法则："],
                [`\\sqrt{${k * k}} \\cdot \\sqrt{${m}} = \\sqrt{${answer}}`],
              ],
            ],
            [
              `Simplify back: $\\sqrt{${answer}} = \\sqrt{${k * k} \\cdot ${m}} = ${k}\\sqrt{${m}}$.`,
              `化简回去：$\\sqrt{${answer}} = \\sqrt{${k * k} \\cdot ${m}} = ${k}\\sqrt{${m}}$。`,
            ],
            [
              [k * m, `That leaves $${k}$ unsquared; square it on the way in.`, `这是没有把 $${k}$ 平方；移进根号时要平方。`],
              [
                k * k + m,
                "That adds the square to the number under the root; they multiply.",
                "这是把平方数和根号里的数相加了；它们要相乘。",
              ],
              [k * m * m, `That squares $${m}$ instead of $${k}$.`, `这是把 $${m}$ 平方了，应当平方 $${k}$。`],
              [k + m, "That adds the two numbers.", "这是把两个数相加了。"],
              [(k * m) ** 2, "That squares the number under the root as well.", "这是把根号里的数也平方了。"],
            ],
            { solveFor: "n" },
          );
        },
        areaGridFigure(["3√5"], ["3√5"], [["45"]]),
      ),
    ],
  },
  [
    "A square patio has an area of $72$ m². Its side is $\\sqrt{72}$ m long. The builder wants a simpler way to write that length.",
    "一个正方形露台的面积是 $72$ 平方米，边长是 $\\sqrt{72}$ 米。施工的师傅想把这个长度写得更简单些。",
  ],
  [
    "$36 \\cdot 2 = 72$ and $\\sqrt{36} = 6$, so the side is $6\\sqrt{2}$ m.",
    "$36 \\cdot 2 = 72$，$\\sqrt{36} = 6$，所以边长是 $6\\sqrt{2}$ 米。",
  ],
  [
    "write square roots in simplest form, multiply them, and move a whole number under a root.",
    "把平方根化成最简根式，做根式乘法，并把整数移到根号里。",
  ],
);

/** addingAndSubtractingRadicals combines like radicals, simplifying first when needed. */
export const addingAndSubtractingRadicals: TopicDef = withIntro(
  {
    id: "adding-and-subtracting-radicals",
    title: t("Adding and Subtracting Radicals", "根式的加减"),
    summary: t("Combine like radicals, simplifying first when needed.", "合并同类根式，必要时先化简。"),
    prerequisites: ["simplifying-square-roots", "combining-like-terms"],
    encompasses: [
      { topic: "simplifying-square-roots", weight: 0.4 },
      { topic: "combining-like-terms", weight: 0.2 },
    ],
    xp: 12,
    standards: ["CCSS.HSN.RN.B.3"],
    knowledgePoints: [
      {
        ...lesson(
          "like-radicals",
          ["Like radicals", "同类根式"],
          [
            [
              "Radicals with the same number under the root are **like radicals**. They combine the way like terms do: add or subtract the numbers in front and keep the root. $3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$, just as $3x + 5x = 8x$.",
              "根号里的数相同的根式叫作**同类根式**。它们像同类项一样合并：根号前面的数相加减，根式不变。$3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$，就像 $3x + 5x = 8x$。",
            ],
            [
              "Take $\\sqrt{2}$ as a unit: $3$ units and $5$ units make $8$ units.",
              "把 $\\sqrt{2}$ 看作一个单位：$3$ 个单位加 $5$ 个单位是 $8$ 个单位。",
            ],
            [
              "Keep the number under the root. $\\sqrt{2} + \\sqrt{2}$ is $2\\sqrt{2}$, not $\\sqrt{4}$.",
              "根号里的数不变。$\\sqrt{2} + \\sqrt{2}$ 是 $2\\sqrt{2}$，不是 $\\sqrt{4}$。",
            ],
          ],
          (rng) => {
            const m = rng.pick(squareFree);
            let a: number;
            let b: number;
            let s: 1 | -1;
            do {
              [a, b, s] = [rng.int(1, 12), rng.int(1, 12), rng.sign()];
            } while (a + s * b === 0);
            const c = a + s * b;
            const op = s > 0 ? "+" : "-";
            const expr = `${root(a, m)} ${op} ${root(b, m)}`;
            return rooted(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              [c, m],
              [
                [
                  ["Check the roots", "看根号"],
                  [`Both terms hold $\\sqrt{${m}}$, so they are like radicals.`, `两项都含 $\\sqrt{${m}}$，是同类根式。`],
                ],
                [
                  ["Combine", "合并"],
                  ["Combine the numbers in front and keep the root:", "根号前面的数相加减，根式不变："],
                  [`${expr} = (${a} ${op} ${b})\\sqrt{${m}} = ${radical(c, m)}`],
                ],
              ],
              [
                `Treat $\\sqrt{${m}}$ as a unit: $${a} ${op} ${b} = ${c}$ units.`,
                `把 $\\sqrt{${m}}$ 看作一个单位：$${a} ${op} ${b} = ${c}$ 个单位。`,
              ],
              [
                [
                  root(c, 2 * m),
                  "That doubles the number under the root; keep the root as it is.",
                  "这是把根号里的数翻了一倍；根式应当不变。",
                ],
                [
                  root(a - s * b === 0 ? c + 1 : a - s * b, m),
                  "That uses the wrong sign for the second term.",
                  "这是把第二项的符号弄错了。",
                ],
                [
                  root(a * b, m),
                  "That multiplies the numbers in front; like radicals add.",
                  "这是把根号前面的数相乘了；同类根式要相加减。",
                ],
              ],
            );
          },
          tapeFigure(
            [
              {
                total: "8√2",
                pieces: [
                  { size: 3, text: "3√2" },
                  { size: 5, text: "5√2", lit: true },
                ],
              },
            ],
            ["A bar of 8√2 made of a piece 3√2 and a shaded piece 5√2.", "一个表示 8√2 的长条，由 3√2 和涂色的 5√2 两段组成。"],
          ),
        ),
        keyPrerequisites: ["combining-like-terms"],
      },
      {
        ...lesson(
          "simplifying-then-combining",
          ["Simplifying before combining", "先化简再合并"],
          [
            [
              "Roots that look different may turn into like radicals once you simplify them. So simplify every root first, then combine: $\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$.",
              "看起来不同的根式，化简后可能是同类根式。所以先化简每个根式，再合并：$\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$。",
            ],
            [
              "$\\sqrt{12} \\approx 3.46$ and $\\sqrt{27} \\approx 5.20$. Their sum is about $8.66$, and so is $5\\sqrt{3}$.",
              "$\\sqrt{12} \\approx 3.46$，$\\sqrt{27} \\approx 5.20$。它们的和约为 $8.66$，$5\\sqrt{3}$ 也约为 $8.66$。",
            ],
            [
              "Do not add the numbers under the roots. $\\sqrt{12} + \\sqrt{27}$ is not $\\sqrt{39}$.",
              "不要把根号里的数相加。$\\sqrt{12} + \\sqrt{27}$ 不是 $\\sqrt{39}$。",
            ],
          ],
          (rng) => {
            const m = rng.pick([2, 3, 5, 6, 7]);
            let j: number;
            let k: number;
            do {
              [j, k] = [rng.int(1, 6), rng.int(2, 6)];
            } while (j === k);
            const s = rng.sign();
            const c = j + s * k;
            const op = s > 0 ? "+" : "-";
            const [x, y] = [j * j * m, k * k * m];
            const expr = `\\sqrt{${x}} ${op} \\sqrt{${y}}`;
            return rooted(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              [c, m],
              [
                [
                  ["Simplify each root", "化简每个根式"],
                  ["Take out the square factors:", "移出平方因数："],
                  [`\\sqrt{${x}} = ${radical(j, m)}`, `\\sqrt{${y}} = ${radical(k, m)}`],
                ],
                [
                  ["Combine", "合并"],
                  ["Now they are like radicals:", "现在它们是同类根式："],
                  [`${radical(j, m)} ${op} ${radical(k, m)} = ${radical(c, m)}`],
                ],
              ],
              [
                `Square back each root: $${j}^{2} \\cdot ${m} = ${x}$ and $${k}^{2} \\cdot ${m} = ${y}$.`,
                `把每个根式平方回去：$${j}^{2} \\cdot ${m} = ${x}$，$${k}^{2} \\cdot ${m} = ${y}$。`,
              ],
              [
                [
                  s > 0 ? `\\sqrt{${x + y}}` : `\\sqrt{${Math.abs(x - y)}}`,
                  "That combines the numbers under the roots; simplify first, then combine the numbers in front.",
                  "这是把根号里的数合并了；要先化简，再合并根号前面的数。",
                ],
                [
                  root(j * k, m),
                  "That multiplies the numbers in front; like radicals add.",
                  "这是把根号前面的数相乘了；同类根式要相加减。",
                ],
                [
                  root(c, 2 * m),
                  "That doubles the number under the root; keep the root as it is.",
                  "这是把根号里的数翻了一倍；根式应当不变。",
                ],
              ],
            );
          },
          tapeFigure(
            [
              {
                total: "5√3",
                pieces: [
                  { size: 2, text: "√12 = 2√3" },
                  { size: 3, text: "√27 = 3√3", lit: true },
                ],
              },
            ],
            ["A bar of 5√3 made of √12 = 2√3 and a shaded √27 = 3√3.", "一个表示 5√3 的长条，由 √12 = 2√3 和涂色的 √27 = 3√3 组成。"],
          ),
        ),
        keyPrerequisites: ["simplifying-square-roots"],
      },
      lesson(
        "a-perimeter-with-radicals",
        ["A perimeter with radicals", "含根号的周长"],
        [
          [
            "Simplify each side to the same root, and then the lengths add like like terms. A rectangle with sides $\\sqrt{8}$ and $\\sqrt{18}$ has sides $2\\sqrt{2}$ and $3\\sqrt{2}$. Its perimeter is $2(2 + 3)\\sqrt{2} = 10\\sqrt{2}$.",
            "先把每条边化简成同一个根式，长度就能像同类项一样相加。边长为 $\\sqrt{8}$ 和 $\\sqrt{18}$ 的长方形，两边是 $2\\sqrt{2}$ 和 $3\\sqrt{2}$，周长是 $2(2 + 3)\\sqrt{2} = 10\\sqrt{2}$。",
          ],
          [
            "Go around the rectangle: $2\\sqrt{2} + 3\\sqrt{2} + 2\\sqrt{2} + 3\\sqrt{2} = 10\\sqrt{2}$.",
            "沿长方形走一圈：$2\\sqrt{2} + 3\\sqrt{2} + 2\\sqrt{2} + 3\\sqrt{2} = 10\\sqrt{2}$。",
          ],
          [
            "A rectangle has four sides. Adding just two of them gives $5\\sqrt{2}$, only half the perimeter.",
            "长方形有四条边。只加两条得 $5\\sqrt{2}$，只是周长的一半。",
          ],
        ],
        (rng) => {
          const r = rng.pick([2, 3, 5, 6, 7]);
          const a = rng.int(2, 5);
          const drawn = rng.int(2, 5);
          const b = drawn === a ? (a === 5 ? 4 : a + 1) : drawn;
          const total = 2 * (a + b);
          return rooted(
            [
              `A rectangle has sides $\\sqrt{${a * a * r}}$ and $\\sqrt{${b * b * r}}$. What is its perimeter?`,
              `长方形的两边是 $\\sqrt{${a * a * r}}$ 和 $\\sqrt{${b * b * r}}$。周长是多少？`,
            ],
            [total, r],
            [
              [
                ["Simplify the sides", "化简边长"],
                ["Take out the square factors:", "移出平方因数："],
                [`\\sqrt{${a * a * r}} = ${a}\\sqrt{${r}}`, `\\sqrt{${b * b * r}} = ${b}\\sqrt{${r}}`],
              ],
              [
                ["Add all four sides", "四条边相加"],
                ["The perimeter is twice the sum of two sides next to each other:", "周长是相邻两边之和的两倍："],
                [`2(${a}\\sqrt{${r}} + ${b}\\sqrt{${r}}) = ${total}\\sqrt{${r}}`],
              ],
            ],
            [
              `Go around: $${a} + ${b} + ${a} + ${b} = ${total}$ copies of $\\sqrt{${r}}$.`,
              `走一圈：$${a} + ${b} + ${a} + ${b} = ${total}$ 个 $\\sqrt{${r}}$。`,
            ],
            [
              [`${a + b}\\sqrt{${r}}`, "That adds only two sides; a rectangle has four.", "这是只加了两条边；长方形有四条边。"],
              [
                `2\\sqrt{${(a * a + b * b) * r}}`,
                "That adds the numbers under the roots; simplify first.",
                "这是把根号里的数相加了；要先化简。",
              ],
              [`${total}\\sqrt{${2 * r}}`, "That doubles the number under the root as well.", "这是把根号里的数也乘了 $2$。"],
            ],
          );
        },
        areaGridFigure(["2√2"], ["3√2"], [["P = 10√2"]]),
      ),
    ],
  },
  [
    "A fence has two straight parts, $3\\sqrt{2}$ m and $5\\sqrt{2}$ m long. Together they are $8\\sqrt{2}$ m, just as $3$ apples and $5$ apples make $8$ apples.",
    "一段篱笆有两截直的，分别长 $3\\sqrt{2}$ 米和 $5\\sqrt{2}$ 米。合起来是 $8\\sqrt{2}$ 米，就像 $3$ 个苹果加 $5$ 个苹果是 $8$ 个苹果。",
  ],
  [
    "$\\sqrt{2} \\approx 1.41$, so $8\\sqrt{2} \\approx 11.3$, and $4.24 + 7.07 \\approx 11.3$ too.",
    "$\\sqrt{2} \\approx 1.41$，所以 $8\\sqrt{2} \\approx 11.3$，而 $4.24 + 7.07$ 也约为 $11.3$。",
  ],
  ["add and subtract like radicals, simplify first when needed, and find perimeters.", "合并同类根式，必要时先化简，并求周长。"],
);

/** rationalizingDenominators removes square roots from denominators. */
export const rationalizingDenominators: TopicDef = withIntro(
  {
    id: "rationalizing-denominators",
    title: t("Rationalizing Denominators", "分母有理化"),
    summary: t("Remove a square root from a denominator by multiplying by the root.", "通过乘以根式去掉分母中的平方根。"),
    prerequisites: ["simplifying-square-roots"],
    encompasses: [],
    xp: 12,
    standards: ["CCSS.HSN.RN.A.2"],
    knowledgePoints: [
      {
        ...lesson(
          "monomial-denominators",
          ["Roots in the denominator", "分母中含有根式"],
          [
            [
              "Simplest radical form has no root in the denominator. Multiply the top and the bottom by the root. Since $\\sqrt{m} \\cdot \\sqrt{m} = m$, the bottom becomes a whole number. Then reduce: $\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$.",
              "最简根式的分母中不含根式。把分子和分母同乘以这个根式。因为 $\\sqrt{m} \\cdot \\sqrt{m} = m$，分母就变成整数。然后约分：$\\frac{6}{\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$。",
            ],
            [
              "Multiply back: $2\\sqrt{3} \\cdot \\sqrt{3} = 2 \\cdot 3 = 6$.",
              "乘回去验证：$2\\sqrt{3} \\cdot \\sqrt{3} = 2 \\cdot 3 = 6$。",
            ],
            [
              "Multiply the top too, or the value changes. $\\frac{6}{\\sqrt{3}}$ is not $\\frac{6}{3}$.",
              "分子也要乘，否则值就变了。$\\frac{6}{\\sqrt{3}}$ 不等于 $\\frac{6}{3}$。",
            ],
          ],
          (rng) => {
            const m = rng.pick([2, 3, 5, 6, 7, 10, 11]);
            const b = rng.pick([1, 1, 2, 3]);
            const a = rng.bool(0.5) ? m * rng.int(1, 4) : rng.int(1, 12);
            const c = Q.of(a, b * m);
            const den = root(b, m);
            const raw = `\\frac{${root(a, m)}}{${b * m}}`;
            const answer = radical(c, m);
            return rooted(
              [`Rationalize the denominator and simplify: $\\frac{${a}}{${den}}$.`, `将分母有理化并化简：$\\frac{${a}}{${den}}$。`],
              [c, m],
              [
                [
                  ["Multiply by the root", "乘以根式"],
                  [`Multiply the top and the bottom by $\\sqrt{${m}}$:`, `分子、分母同乘以 $\\sqrt{${m}}$：`],
                  [`\\frac{${a}}{${den}} = \\frac{${root(a, m)}}{${den} \\cdot \\sqrt{${m}}} = ${raw}`],
                ],
                raw === answer
                  ? [
                      ["Reduce", "约分"],
                      ["Nothing cancels, so this is the simplest form.", "没有可以约去的，这就是最简形式。"],
                    ]
                  : [["Reduce", "约分"], ["Cancel the common factor:", "约去公因数："], [`${raw} = ${answer}`]],
              ],
              [
                `Multiply back by the old bottom: $${answer} \\cdot ${den} = ${a}$.`,
                `乘以原来的分母验证：$${answer} \\cdot ${den} = ${a}$。`,
              ],
              [
                [
                  b > 1 ? `\\frac{${root(a, m)}}{${b}}` : root(a, m),
                  `That forgets that the bottom gains a factor of $${m}$.`,
                  `这是忘了分母多了一个因数 $${m}$。`,
                ],
                [radical(Q.of(a, b * m * m), m), `That multiplies the bottom by $${m}$ twice.`, `这是把分母乘了两次 $${m}$。`],
                [
                  `\\frac{${a}}{${b * m}}`,
                  "That drops the root from the top; multiply the top by it too.",
                  "这是分子丢了根号；分子也要乘以这个根式。",
                ],
              ],
            );
          },
          lineFigure(
            { lo: 0, hi: 4, step: 0.5, labels: [0, 1, 2, 3, 4], marks: [{ at: 2 * Math.sqrt(3), text: "6/√3 = 2√3", result: true }] },
            [
              "A number line from 0 to 4 with one point near 3.46, named both 6/√3 and 2√3: the two forms are the same number.",
              "一条从 0 到 4 的数轴，在 3.46 附近有一个点，既是 6/√3 也是 2√3：两种写法是同一个数。",
            ],
          ),
        ),
        keyPrerequisites: ["equivalent-fractions"],
      },
      lesson(
        "square-roots-of-fractions",
        ["Square roots of fractions", "分数的平方根"],
        [
          [
            "The root of a fraction is the root of the top over the root of the bottom: $\\sqrt{\\frac{p}{q}} = \\frac{\\sqrt{p}}{\\sqrt{q}}$. That still has a root in the bottom, so multiply the top and the bottom by $\\sqrt{q}$. Then simplify the root on top: $\\sqrt{\\frac{5}{8}} = \\frac{\\sqrt{40}}{8} = \\frac{2\\sqrt{10}}{8} = \\frac{\\sqrt{10}}{4}$.",
            "分数的平方根等于分子的平方根除以分母的平方根：$\\sqrt{\\frac{p}{q}} = \\frac{\\sqrt{p}}{\\sqrt{q}}$。这时分母里还有根式，所以分子、分母同乘以 $\\sqrt{q}$，再化简分子的根式：$\\sqrt{\\frac{5}{8}} = \\frac{\\sqrt{40}}{8} = \\frac{2\\sqrt{10}}{8} = \\frac{\\sqrt{10}}{4}$。",
          ],
          [
            "Square it: $\\left(\\frac{\\sqrt{10}}{4}\\right)^{2} = \\frac{10}{16} = \\frac{5}{8}$.",
            "把它平方：$\\left(\\frac{\\sqrt{10}}{4}\\right)^{2} = \\frac{10}{16} = \\frac{5}{8}$。",
          ],
          [
            "Multiply the top by the root as well. $\\sqrt{\\frac{5}{8}}$ is not $\\frac{\\sqrt{5}}{8}$.",
            "分子也要乘以这个根式。$\\sqrt{\\frac{5}{8}}$ 不等于 $\\frac{\\sqrt{5}}{8}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const q = rng.pick([2, 3, 5, 6, 7, 8, 10, 12, 18, 20, 27, 50]);
            const p = rng.int(1, 15);
            if (gcd(p, q) !== 1 || [4, 9].includes(p)) continue;
            const [k, m] = simplifyRadical(p * q);
            if (m === 1) continue;
            const c = Q.of(k, q);
            const rp = p === 1 ? "1" : root(1, p);
            const quotient = p > 1 && rng.bool(0.5);
            const shown = quotient ? `\\frac{${rp}}{${root(1, q)}}` : `\\sqrt{\\frac{${p}}{${q}}}`;
            const cleared = `\\frac{${root(1, p * q)}}{${q}}`;
            const tail = k === 1 ? "" : ` = \\frac{${root(k, m)}}{${q}}`;
            const end = radical(c, m) === `\\frac{${root(k, m)}}{${q}}` ? "" : ` = ${radical(c, m)}`;
            return rooted(
              [`Simplify, with no root in the denominator: $${shown}$.`, `化简，使分母中不含根式：$${shown}$。`],
              [c, m],
              [
                quotient
                  ? [
                      ["Split the root", "拆开根式"],
                      ["It is already a root over a root.", "它已经是根式除以根式。"],
                    ]
                  : [
                      ["Split the root", "拆开根式"],
                      ["Write it as a root over a root:", "写成根式除以根式："],
                      [`\\sqrt{\\frac{${p}}{${q}}} = \\frac{${rp}}{${root(1, q)}}`],
                    ],
                [
                  ["Clear the bottom", "去掉分母的根式"],
                  [`Multiply the top and the bottom by $\\sqrt{${q}}$:`, `分子、分母同乘以 $\\sqrt{${q}}$：`],
                  [`\\frac{${rp}}{${root(1, q)}} = \\frac{${rp} \\cdot ${root(1, q)}}{${q}} = ${cleared}`],
                ],
                tail === "" && end === ""
                  ? [
                      ["Simplify", "化简"],
                      ["Nothing more comes out, so this is the simplest form.", "没有可以再移出或约去的，这就是最简形式。"],
                    ]
                  : [
                      ["Simplify", "化简"],
                      ["Take out the square factor and reduce:", "移出平方因数，再约分："],
                      [`${cleared}${tail}${end}`],
                    ],
              ],
              [
                `Square the answer: $\\frac{${k * k * m}}{${q * q}} = \\frac{${p}}{${q}}$.`,
                `把答案平方：$\\frac{${k * k * m}}{${q * q}} = \\frac{${p}}{${q}}$。`,
              ],
              [
                [
                  `\\frac{${rp}}{${q}}`,
                  "That clears the bottom but not the top; multiply both by the root.",
                  "这是只改了分母，没改分子；分子、分母都要乘以根式。",
                ],
                ...(p > 1
                  ? [
                      [
                        radical(Q.of(p, q), q),
                        `That takes $${p}$ out of the root; only square factors come out.`,
                        `这是把 $${p}$ 移出了根号；只有平方因数才能移出。`,
                      ] as const,
                    ]
                  : []),
                [radical(Q.of(k), m), "That forgets to divide by the bottom.", "这是忘了除以分母。"],
              ],
            );
          }
        },
        lineFigure(
          {
            lo: 0,
            hi: 1,
            step: 0.125,
            labels: [0, 0.5, 1],
            label: (v) => (v === 0.5 ? "1/2" : String(v)),
            marks: [{ at: Math.sqrt(5 / 8), text: "√10/4", result: true }],
          },
          ["A number line from 0 to 1 with √(5/8) = √10/4 marked near 0.79.", "一条从 0 到 1 的数轴，在 0.79 附近标出 √(5/8) = √10/4。"],
        ),
      ),
      lesson(
        "a-coefficient-beside-the-root",
        ["A coefficient beside the root", "根号旁的系数"],
        [
          [
            "When the bottom is a number times a root, like $2\\sqrt{5}$, only the root needs to go. Multiply the top and the bottom by $\\sqrt{5}$ alone. The bottom becomes $2 \\cdot 5 = 10$. Then cancel any common factor: $\\frac{30}{2\\sqrt{5}} = \\frac{30\\sqrt{5}}{10} = 3\\sqrt{5}$.",
            "分母是一个数乘根式时，比如 $2\\sqrt{5}$，只需要去掉根式。分子、分母只乘 $\\sqrt{5}$，分母变成 $2 \\cdot 5 = 10$。然后约去公因数：$\\frac{30}{2\\sqrt{5}} = \\frac{30\\sqrt{5}}{10} = 3\\sqrt{5}$。",
          ],
          [
            "Multiply back: $3\\sqrt{5} \\cdot 2\\sqrt{5} = 6 \\cdot 5 = 30$.",
            "乘回去验证：$3\\sqrt{5} \\cdot 2\\sqrt{5} = 6 \\cdot 5 = 30$。",
          ],
          [
            "The bottom becomes $2 \\cdot 5 = 10$, not $2$. Forgetting the $5$ gives $15\\sqrt{5}$.",
            "分母变成 $2 \\cdot 5 = 10$，不是 $2$。忘了乘 $5$ 会得到 $15\\sqrt{5}$。",
          ],
        ],
        (rng) => {
          const r = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
          const c = rng.int(2, 6);
          const k = rng.int(1, 5);
          const top = c * r * k;
          const answer = root(k, r);
          return rooted(
            [
              `Rationalize the denominator and simplify: $\\frac{${top}}{${c}\\sqrt{${r}}}$.`,
              `将分母有理化并化简：$\\frac{${top}}{${c}\\sqrt{${r}}}$。`,
            ],
            [k, r],
            [
              [
                ["Multiply by the root", "乘以根式"],
                [`Multiply the top and the bottom by $\\sqrt{${r}}$:`, `分子、分母同乘以 $\\sqrt{${r}}$：`],
                [`\\frac{${top}}{${c}\\sqrt{${r}}} = \\frac{${top}\\sqrt{${r}}}{${c * r}}`],
              ],
              [
                ["Cancel", "约分"],
                [`$${top} \\div ${c * r} = ${k}$, so:`, `$${top} \\div ${c * r} = ${k}$，所以：`],
                [`\\frac{${top}\\sqrt{${r}}}{${c * r}} = ${answer}`],
              ],
            ],
            [
              `Multiply back: $${answer} \\cdot ${c}\\sqrt{${r}} = ${k * c} \\cdot ${r} = ${top}$.`,
              `乘回去验证：$${answer} \\cdot ${c}\\sqrt{${r}} = ${k * c} \\cdot ${r} = ${top}$。`,
            ],
            [
              [root(c * k, r), `That forgets that the bottom gains a factor of $${r}$.`, `这是忘了分母多了一个因数 $${r}$。`],
              [`\\frac{${k}}{${r}}\\sqrt{${r}}`, `That divides by $${r}$ twice.`, `这是除了两次 $${r}$。`],
              [root(top, r), "That clears the root but never divides by the new bottom.", "这是去掉了根式，却没有除以新的分母。"],
            ],
          );
        },
        equalTape(10, "3√5", "30√5"),
      ),
    ],
  },
  [
    "Two friends work out the same length. One writes $\\frac{6}{\\sqrt{3}}$ and the other writes $2\\sqrt{3}$. They look different, but they are the same number.",
    "两个朋友算同一个长度。一个写成 $\\frac{6}{\\sqrt{3}}$，另一个写成 $2\\sqrt{3}$。看起来不一样，其实是同一个数。",
  ],
  [
    "$2\\sqrt{3} \\cdot \\sqrt{3} = 6$, so $2\\sqrt{3} = \\frac{6}{\\sqrt{3}}$.",
    "$2\\sqrt{3} \\cdot \\sqrt{3} = 6$，所以 $2\\sqrt{3} = \\frac{6}{\\sqrt{3}}$。",
  ],
  ["clear square roots from denominators and write answers in simplest radical form.", "去掉分母中的平方根，把答案写成最简根式。"],
);

/** radicalTopics are the square root and cube root topics. */
export const radicalTopics: readonly TopicDef[] = [
  squareRootsAndCubeRoots,
  simplifyingSquareRoots,
  addingAndSubtractingRadicals,
  rationalizingDenominators,
];
