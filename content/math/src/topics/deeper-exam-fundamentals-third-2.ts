// A third knowledge point for the second half of the exam fundamentals topics that still had two.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { chooseFilled, decimal, fraction, integer, signed, skill } from "./third-kit.ts";

/** Rng is the random source a generator receives. */
type Rng = Parameters<KnowledgePointDef["generate"]>[0];

/** nz picks a nonzero integer of size at most n. */
const nz = (rng: Rng, n: number) => rng.int(1, n) * (rng.bool() ? 1 : -1);

/** paren writes a negative number in parentheses. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** factorOf writes x - p as a factor. */
const factorOf = (p: number) => (p < 0 ? `(x + ${-p})` : p === 0 ? "x" : `(x - ${p})`);

/** table writes a function table with its inputs and outputs. */
const table = (xs: readonly number[], ys: readonly number[]) =>
  `$$\\begin{array}{c|${xs.map(() => "c").join("")}} x & ${xs.join(" & ")} \\\\ \\hline f(x) & ${ys.join(" & ")} \\end{array}$$`;

/** triples lists small Pythagorean triples. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [20, 21, 29],
];

/** deeperExamFundamentalsThird2Points holds these third knowledge points, by topic in the exam shard. */
export const deeperExamFundamentalsThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "modeling-geometry-problems-using-linear-equations": [
    skill(
      "an-isosceles-triangle-from-its-perimeter",
      ["An isosceles triangle from its perimeter", "由周长求等腰三角形"],
      [
        "An isosceles triangle has two equal sides, so the expression for a leg is counted twice in the perimeter. Adding the base gives one linear equation for the unknown.",
        "等腰三角形有两条相等的边，所以腰的式子在周长中算两次。再加上底，就得到关于未知数的一个一次方程。",
      ],
      (rng) => {
        const x = rng.int(3, 40);
        const a = rng.int(1, 15);
        const p = 3 * x + 2 * a;
        return integer(
          [
            `The base of an isosceles triangle is $x$, each equal side is $x + ${a}$, and the perimeter is ${p}. What is $x$?`,
            `等腰三角形的底是 $x$，每条腰是 $x + ${a}$，周长是 ${p}。$x$ 是多少？`,
          ],
          x,
          [x + a, Math.floor(p / 3), Math.floor((p - a) / 2)],
          [`$3x + ${2 * a} = ${p}$ gives $x = ${x}$.`, `$3x + ${2 * a} = ${p}$，得 $x = ${x}$。`],
        );
      },
    ),
  ],
  "modeling-using-systems-of-non-linear-equations": [
    skill(
      "a-right-triangle-from-area-and-hypotenuse",
      ["A right triangle from area and hypotenuse", "由面积和斜边求直角三角形"],
      [
        "The area gives the product of the legs and the Pythagorean theorem gives the sum of their squares. So look for two numbers with that product whose squares have that sum, or substitute and solve.",
        "面积给出两直角边的积，勾股定理给出它们的平方和。所以找积和平方和都符合的两个数，或者代入求解。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const k = 2 * rng.int(1, 8);
        return integer(
          [
            `A right triangle has area ${(a * b * k * k) / 2} and hypotenuse ${c * k}. What is the length of its shorter leg?`,
            `直角三角形的面积是 ${(a * b * k * k) / 2}，斜边是 ${c * k}。较短的直角边长多少？`,
          ],
          a * k,
          [b * k, (c - a) * k, c * k - 1],
          [
            `The legs have product ${a * b * k * k}, and ${a * k} and ${b * k} fit the hypotenuse.`,
            `两直角边的积是 ${a * b * k * k}，${a * k} 和 ${b * k} 符合斜边。`,
          ],
        );
      },
    ),
  ],
  "optimizing-sums-differences-products-and-quotients": [
    skill(
      "extremes-when-a-square-is-involved",
      ["Extremes when a square is involved", "含平方时的极值"],
      [
        "Squaring favors the number farthest from zero, whichever sign it has. So compare the sizes of both ends of the interval, and subtract the smallest allowed value of the other variable.",
        "平方有利于离零最远的数，不管它是正是负。所以比较区间两端的绝对值，再减去另一变量允许的最小值。",
      ],
      (rng) => {
        const [p, q] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 2) as [number, number];
        const low = rng.int(1, 6);
        const high = low + rng.int(1, 9);
        const big = Math.max(p, q);
        return integer(
          [
            `If $-${p} \\le x \\le ${q}$ and $${low} \\le y \\le ${high}$, what is the greatest possible value of $x^{2} - y$?`,
            `若 $-${p} \\le x \\le ${q}$，$${low} \\le y \\le ${high}$，$x^{2} - y$ 的最大可能值是多少？`,
          ],
          big * big - low,
          [q * q - high, big * big - high, q * q - low === big * big - low ? p * p - low + 1 : Math.min(p, q) ** 2 - low],
          [`The largest square is ${big * big}, and the least $y$ is ${low}.`, `最大的平方是 ${big * big}，最小的 $y$ 是 ${low}。`],
        );
      },
    ),
  ],
  "parametrizing-systems-with-infinitely-many-solutions": [
    skill(
      "using-y-as-the-parameter",
      ["Using y as the parameter", "以 y 为参数"],
      [
        "Either variable can serve as the parameter. If $y = t$, one equation alone is enough to solve for $x$, because the other equation carries the same information.",
        "两个变量都可以作参数。如果 $y = t$，只用一个方程就能解出 $x$，因为另一个方程包含相同的信息。",
      ],
      (rng) => {
        const b = nz(rng, 9);
        const c = nz(rng, 20);
        const k = rng.int(2, 6);
        return chooseFilled(
          rng,
          [
            `The system $x${signed(b)}y = ${c}$, $${k}x${signed(k * b)}y = ${k * c}$ has infinitely many solutions. If $y = t$, express $x$ in terms of $t$.`,
            `方程组 $x${signed(b)}y = ${c}$，$${k}x${signed(k * b)}y = ${k * c}$ 有无穷多解。若 $y = t$，用 $t$ 表示 $x$。`,
          ],
          `x = ${c}${signed(-b)}t`,
          [`x = ${c}${signed(b)}t`, `x = ${-c}${signed(-b)}t`, `x = ${k * c}${signed(-b)}t`],
          [`The first equation gives $x = ${c}${signed(-b)}t$.`, `第一个方程给出 $x = ${c}${signed(-b)}t$。`],
        );
      },
    ),
  ],
  "partitioning-totals-using-ratios": [
    skill(
      "a-total-from-a-middle-share",
      ["A total from a middle share", "由中间一份求总量"],
      [
        "Any one share reveals the size of a single part, by dividing it by its number in the ratio. The total is then that part size times the sum of the numbers in the ratio.",
        "任一份除以它在比中的数，就得到一份的大小。总量就是这一份的大小乘比中各数之和。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
        const u = rng.int(3, 30);
        return integer(
          [
            `A prize is split in the ratio $${a} : ${b} : ${c}$. The second share is ${b * u} dollars. How many dollars is the whole prize?`,
            `奖金按 $${a} : ${b} : ${c}$ 分配。第二份是 ${b * u} 美元。全部奖金是多少美元？`,
          ],
          (a + b + c) * u,
          [(a + c) * u, 3 * b * u, b * u + a + c],
          [`One part is ${u}, and there are ${a + b + c} parts.`, `一份是 ${u}，共 ${a + b + c} 份。`],
        );
      },
    ),
  ],
  "properties-of-real-number-operations": [
    skill(
      "additive-and-multiplicative-inverses",
      ["Additive and multiplicative inverses", "相反数与倒数"],
      [
        "The additive inverse of a number sums with it to 0, so it changes the sign. The multiplicative inverse multiplies with it to 1, so it flips the fraction and keeps the sign.",
        "一个数的相反数与它的和是 0，所以符号改变。倒数与它的积是 1，所以分数颠倒，符号不变。",
      ],
      (rng) => {
        const q = rng.int(2, 15);
        const p = rng.int(1, 15) * (rng.bool() ? 1 : -1);
        const v = Q.of(p, q);
        const add = rng.bool();
        const inverse = Q.of(q, p);
        const negative = Q.of(-p, q);
        return fraction(
          add
            ? [`What is the additive inverse of $${v.toLatex()}$?`, `$${v.toLatex()}$ 的相反数是多少？`]
            : [`What is the multiplicative inverse of $${v.toLatex()}$?`, `$${v.toLatex()}$ 的倒数是多少？`],
          add ? negative : inverse,
          add ? [v, inverse, Q.of(-q, p)] : [v, negative, Q.of(-q, p)],
          add
            ? [`Adding it to the number must give 0.`, `它与原数相加必须得 0。`]
            : [`Multiplying it by the number must give 1.`, `它与原数相乘必须得 1。`],
        );
      },
    ),
  ],
  "quadratic-vs-exponential-models": [
    skill(
      "the-next-entry-from-the-pattern",
      ["The next entry from the pattern", "由规律求下一项"],
      [
        "Constant second differences mark a quadratic, while a constant ratio marks an exponential. Once the pattern is identified, it extends the table by one more entry without needing the whole formula.",
        "二阶差分恒定说明是二次函数，比值恒定说明是指数函数。识别规律之后，不需要完整公式就能把表格再延伸一项。",
      ],
      (rng) => {
        const expo = rng.bool();
        const xs = [0, 1, 2, 3];
        if (expo) {
          const a = rng.int(1, 9);
          const b = rng.int(2, 5);
          const ys = xs.map((x) => a * b ** x);
          return integer(
            [`What is $f(4)$ if the table follows its pattern? ${table(xs, ys)}`, `如果表格符合它的规律，$f(4)$ 是多少？${table(xs, ys)}`],
            a * b ** 4,
            [a * b ** 3 + (a * b ** 3 - a * b ** 2), a * b ** 3 + a, a * b ** 3 * 2 === a * b ** 4 ? a * b ** 4 + 1 : a * b ** 3 * 2],
            [`Each entry is ${b} times the one before.`, `每一项是前一项的 ${b} 倍。`],
          );
        }
        const a = rng.int(1, 5);
        const b = rng.int(-6, 9);
        const c = rng.int(-9, 9);
        const ys = xs.map((x) => a * x * x + b * x + c);
        const d = (ys[3] as number) - (ys[2] as number);
        return integer(
          [
            `The table shows values of a quadratic function $f$. What is $f(4)$? ${table(xs, ys)}`,
            `表格给出二次函数 $f$ 的一些值。$f(4)$ 是多少？${table(xs, ys)}`,
          ],
          16 * a + 4 * b + c,
          [(ys[3] as number) + d, (ys[3] as number) + 2 * d, (ys[3] as number) + d + a],
          [
            `The second differences are all $${2 * a}$, so the next difference is $${d + 2 * a}$. Adding it to the last value $${ys[3] as number}$ gives $${16 * a + 4 * b + c}$.`,
            `二阶差分都是 $${2 * a}$，所以下一个差是 $${d + 2 * a}$。把它加到最后一个值 $${ys[3] as number}$ 上得到 $${16 * a + 4 * b + c}$。`,
          ],
        );
      },
    ),
  ],
  "real-number-restrictions": [
    skill(
      "a-root-and-a-denominator-together",
      ["A root and a denominator together", "根式与分母并存"],
      [
        "Each restriction must hold at once. The expression under the root must be at least zero, and the denominator must not be zero, so remove that one value from the allowed integers.",
        "每个限制都要同时满足。根号下的式子不小于零，分母不等于零，所以要从允许的整数中去掉那一个值。",
      ],
      (rng) => {
        const a = rng.int(-8, 8);
        const b = a + rng.int(1, 6);
        const c = b + rng.int(1, 12);
        const inner = a < 0 ? `x + ${-a}` : a === 0 ? "x" : `x - ${a}`;
        const below = b < 0 ? `x + ${-b}` : b === 0 ? "x" : `x - ${b}`;
        return integer(
          [
            `How many integers $x$ with $x \\le ${c}$ make $\\frac{\\sqrt{${inner}}}{${below}}$ a real number?`,
            `满足 $x \\le ${c}$ 的整数 $x$ 中，有多少个使 $\\frac{\\sqrt{${inner}}}{${below}}$ 是实数？`,
          ],
          c - a,
          [c - a + 1, c - b, c - a - 1],
          [
            `The integers from ${a} to ${c} number ${c - a + 1}, and ${b} must be left out.`,
            `从 ${a} 到 ${c} 的整数有 ${c - a + 1} 个，要去掉 ${b}。`,
          ],
        );
      },
    ),
  ],
  "reasoning-about-coefficients-in-quadratic-equations-using-the-factor-theorem": [
    skill(
      "the-linear-coefficient-from-a-factor",
      ["The linear coefficient from a factor", "由因式求一次项系数"],
      [
        "If $x - r$ is a factor, then $r$ is a zero, so substituting it gives zero. When the constant term is known, this equation has just one unknown, which is the coefficient of $x$.",
        "如果 $x - r$ 是因式，那么 $r$ 是零点，代入得零。常数项已知时，这个方程只有一个未知数，就是 $x$ 的系数。",
      ],
      (rng) => {
        const r = nz(rng, 12);
        const s = nz(rng, 12);
        return integer(
          [
            `If $${factorOf(r).replace(/[()]/g, "")}$ is a factor of $x^2 + bx${signed(r * s)}$, what is $b$?`,
            `若 $${factorOf(r).replace(/[()]/g, "")}$ 是 $x^2 + bx${signed(r * s)}$ 的因式，$b$ 是多少？`,
          ],
          -(r + s),
          [r + s, r * s, s - r],
          [
            `Substituting $x = ${r}$ gives $${r * r} + ${paren(r)}b${signed(r * s)} = 0$.`,
            `代入 $x = ${r}$，得 $${r * r} + ${paren(r)}b${signed(r * s)} = 0$。`,
          ],
        );
      },
    ),
  ],
  "reasoning-about-coefficients-of-quadratics-using-standard-and-factored-forms": [
    skill(
      "the-sum-of-the-zeros",
      ["The sum of the zeros", "零点之和"],
      [
        "Expanding $a(x - p)(x - q)$ shows that the coefficient of $x$ is $-a(p + q)$. So the sum of the zeros can be read from the standard form as $-b$ divided by $a$, with no factoring.",
        "展开 $a(x - p)(x - q)$ 可知 $x$ 的系数是 $-a(p + q)$。所以不用分解，由标准形式就能读出零点之和：$-b$ 除以 $a$。",
      ],
      (rng) => {
        const a = nz(rng, 6);
        const s = nz(rng, 12);
        const c = nz(rng, 30);
        const b = -a * s;
        return integer(
          [
            `The quadratic $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x^2${signed(b)}x${signed(c)}$ has two zeros. What is their sum, counting complex zeros if necessary?`,
            `二次函数 $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x^2${signed(b)}x${signed(c)}$ 有两个零点（必要时算上复数零点）。它们的和是多少？`,
          ],
          s,
          [-s, b, a * s],
          [
            `The sum is $-\\frac{b}{a}$, with $b = ${b}$ and $a = ${a}$, which gives ${s}.`,
            `和是 $-\\frac{b}{a}$，其中 $b = ${b}$，$a = ${a}$，结果是 ${s}。`,
          ],
        );
      },
    ),
  ],
  "reasoning-about-coefficients-of-quadratics-using-symmetry": [
    skill(
      "the-other-zero-from-the-axis",
      ["The other zero from the axis", "由对称轴求另一个零点"],
      [
        "The two zeros of a quadratic lie the same distance from its axis of symmetry. So reflect the known zero over the axis, which gives twice the axis value minus the zero.",
        "二次函数的两个零点到对称轴的距离相等。所以把已知零点关于对称轴反射，得到对称轴值的两倍减去这个零点。",
      ],
      (rng) => {
        const h = nz(rng, 9);
        const d = nz(rng, 12);
        return integer(
          [
            `The graph of a quadratic function has axis of symmetry $x = ${h}$ and crosses the $x$-axis at $x = ${h + d}$. Where else does it cross?`,
            `二次函数图象的对称轴是 $x = ${h}$，与 $x$ 轴交于 $x = ${h + d}$。另一个交点在哪里？`,
          ],
          h - d,
          [-(h + d), h, 2 * h + d],
          [
            `The zero is ${Math.abs(d)} from the axis, so the other lies the same distance on the far side: $${h} ${d < 0 ? "+" : "-"} ${Math.abs(d)} = ${h - d}$.`,
            `零点与对称轴相距 ${Math.abs(d)}，所以另一个在对称轴另一侧相同距离处：$${h} ${d < 0 ? "+" : "-"} ${Math.abs(d)} = ${h - d}$。`,
          ],
        );
      },
    ),
  ],
  "reasoning-about-congruent-triangles": [
    skill(
      "the-information-that-is-not-enough",
      ["The information that is not enough", "不足以判定的条件"],
      [
        "Three equal pairs of angles only prove that triangles have the same shape, not the same size. So matching angles alone give similarity, while the valid criteria always include at least one side.",
        "三对相等的角只能说明三角形形状相同，不能说明大小相同。所以只有角相等得到的是相似，而有效的判定至少包含一条边。",
      ],
      (rng) => {
        const [a, b, c, d, e, f] = rng.sample(
          ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T"],
          6,
        ) as [string, string, string, string, string, string];
        const tri = `\\triangle ${a}${b}${c}`;
        const other = `\\triangle ${d}${e}${f}`;
        return chooseFilled(
          rng,
          [`Which of these does not by itself prove $${tri} \\cong ${other}$?`, `下面哪一组条件本身不能证明 $${tri} \\cong ${other}$？`],
          `\\angle ${a} = \\angle ${d},\\ \\angle ${b} = \\angle ${e},\\ \\angle ${c} = \\angle ${f}`,
          [
            `${a}${b} = ${d}${e},\\ ${b}${c} = ${e}${f},\\ ${a}${c} = ${d}${f}`,
            `${a}${b} = ${d}${e},\\ \\angle ${b} = \\angle ${e},\\ ${b}${c} = ${e}${f}`,
            `\\angle ${a} = \\angle ${d},\\ ${a}${b} = ${d}${e},\\ \\angle ${b} = \\angle ${e}`,
          ],
          [`Equal angles allow one triangle to be a scaled copy of the other.`, `角相等时，一个三角形可以是另一个的缩放。`],
        );
      },
    ),
  ],
  "reasoning-about-multi-leg-travel": [
    skill(
      "the-time-saved-by-a-faster-speed",
      ["The time saved by a faster speed", "提速节省的时间"],
      [
        "Time is distance divided by speed, so each speed gives its own time for the same trip. Subtract the two times, and convert from hours to minutes by multiplying by 60.",
        "时间等于路程除以速度，所以同一段路每种速度有各自的时间。两个时间相减，再乘 60 把小时化成分钟。",
      ],
      (rng) => {
        const b = rng.int(1, 6);
        const a = b + rng.int(1, 4);
        const k = rng.int(3, 15);
        return integer(
          [
            `A trip of ${k * a * b} miles is driven at ${k * a} miles per hour instead of ${k * b} miles per hour. How many minutes does this save?`,
            `一段 ${k * a * b} 英里的路程以每小时 ${k * a} 英里代替每小时 ${k * b} 英里行驶。这样节省多少分钟？`,
          ],
          60 * (a - b),
          [a - b, 60 * a, k * (a - b)],
          [`The times are ${a} and ${b} hours, a difference of ${a - b} hours.`, `时间分别是 ${a} 小时和 ${b} 小时，相差 ${a - b} 小时。`],
        );
      },
    ),
  ],
  "reasoning-about-similar-triangles": [
    skill(
      "an-area-from-a-side-ratio",
      ["An area from a side ratio", "由边长比求面积"],
      [
        "Lengths of similar triangles scale by the ratio of matching sides, but areas scale by the square of that ratio, because area has two dimensions. So square the side ratio before scaling the area.",
        "相似三角形的长度按对应边之比缩放，而面积按这个比的平方缩放，因为面积有两个维度。所以缩放面积前要先把边长比平方。",
      ],
      (rng) => {
        const p = rng.int(1, 6);
        const q = p + rng.int(1, 5);
        const v = rng.int(1, 8);
        const u = rng.int(1, 4);
        return integer(
          [
            `$\\triangle ABC \\sim \\triangle DEF$, with $AB = ${p * u}$ and $DE = ${q * u}$. If the area of $\\triangle ABC$ is ${p * p * v}, what is the area of $\\triangle DEF$?`,
            `$\\triangle ABC \\sim \\triangle DEF$，$AB = ${p * u}$，$DE = ${q * u}$。若 $\\triangle ABC$ 的面积是 ${p * p * v}，$\\triangle DEF$ 的面积是多少？`,
          ],
          q * q * v,
          [p * q * v, q * q * q * v, p * p * v + (q - p) * u],
          [`The area ratio is $${p * p} : ${q * q}$, so one part is ${v}.`, `面积比是 $${p * p} : ${q * q}$，所以一份是 ${v}。`],
        );
      },
    ),
  ],
  "reasoning-from-a-rectangular-prism": [
    skill(
      "an-edge-from-the-diagonal",
      ["An edge from the diagonal", "由对角线求棱长"],
      [
        "The square of the space diagonal is the sum of the squares of the three edges. So subtract the squares of the two known edges from the square of the diagonal, and take the root.",
        "体对角线的平方等于三条棱的平方和。所以从对角线的平方中减去两条已知棱的平方，再开方。",
      ],
      (rng) => {
        const [a, b, c, d] = rng.pick<[number, number, number, number]>([
          [1, 2, 2, 3],
          [2, 3, 6, 7],
          [1, 4, 8, 9],
          [4, 4, 7, 9],
          [2, 6, 9, 11],
          [6, 6, 7, 11],
          [3, 4, 12, 13],
          [2, 5, 14, 15],
          [2, 10, 11, 15],
          [8, 9, 12, 17],
        ]);
        const k = rng.int(1, 4);
        return integer(
          [
            `A rectangular box is ${a * k} cm long and ${b * k} cm wide, and its space diagonal is ${d * k} cm. How tall is it?`,
            `长方体盒子长 ${a * k} 厘米，宽 ${b * k} 厘米，体对角线长 ${d * k} 厘米。它有多高？`,
          ],
          c * k,
          [(d - a - b) * k > 0 ? (d - a - b) * k : c * k + 1, d * k, (a + b) * k],
          [
            `$${d * k}^{2} - ${a * k}^{2} - ${b * k}^{2} = ${c * c * k * k}$, whose root is ${c * k}.`,
            `$${d * k}^{2} - ${a * k}^{2} - ${b * k}^{2} = ${c * c * k * k}$，它的平方根是 ${c * k}。`,
          ],
        );
      },
    ),
  ],
  "reasoning-from-complex-products-and-nonreal-zeros": [
    skill(
      "the-product-of-a-conjugate-pair",
      ["The product of a conjugate pair", "共轭复数的积"],
      [
        "Nonreal zeros of a real quadratic come in conjugate pairs, and their product is the constant term. That product is always real and positive, equal to the sum of the squares of the real and imaginary parts.",
        "实系数二次式的非实数零点成共轭对，它们的积就是常数项。这个积总是正实数，等于实部与虚部的平方和。",
      ],
      (rng) => {
        const a = nz(rng, 12);
        const b = rng.int(1, 12);
        return integer(
          [
            `The quadratic $x^{2} + bx + c$ has real coefficients, and one zero is $${a} + ${b === 1 ? "" : b}i$. What is $c$?`,
            `实系数二次式 $x^{2} + bx + c$ 有一个零点 $${a} + ${b === 1 ? "" : b}i$。$c$ 是多少？`,
          ],
          a * a + b * b,
          [a * a - b * b, -2 * a, a * a + b],
          [
            `The other zero is the conjugate, and the product is $${a * a} + ${b * b}$.`,
            `另一个零点是共轭复数，积是 $${a * a} + ${b * b}$。`,
          ],
        );
      },
    ),
  ],
  "reasoning-from-composite-circle-figures": [
    skill(
      "a-ring-from-its-circumferences",
      ["A ring from its circumferences", "由周长求圆环"],
      [
        "A circumference gives a radius after dividing by $2\\pi$. The area of a ring is then $\\pi$ times the difference of the squares of the radii, not the square of the difference.",
        "周长除以 $2\\pi$ 得半径。圆环的面积是 $\\pi$ 乘半径平方的差，而不是差的平方。",
      ],
      (rng) => {
        const r = rng.int(1, 12);
        const s = r + rng.int(1, 9);
        return integer(
          [
            `Two circles share a center and have circumferences $${2 * r}\\pi$ and $${2 * s}\\pi$. The area of the ring between them is $k\\pi$. What is $k$?`,
            `两个同心圆的周长是 $${2 * r}\\pi$ 和 $${2 * s}\\pi$。它们之间圆环的面积是 $k\\pi$。$k$ 是多少？`,
          ],
          s * s - r * r,
          [(s - r) ** 2, 4 * (s * s - r * r), s * s + r * r],
          [
            `The radii are ${r} and ${s}, and $${s * s} - ${r * r} = ${s * s - r * r}$.`,
            `半径是 ${r} 和 ${s}，$${s * s} - ${r * r} = ${s * s - r * r}$。`,
          ],
        );
      },
    ),
  ],
  "reasoning-from-compound-right-triangles": [
    skill(
      "two-triangles-on-a-shared-hypotenuse",
      ["Two triangles on a shared hypotenuse", "共用斜边的两个三角形"],
      [
        "A segment can be the hypotenuse of one right triangle and a leg of another. So use the first triangle to find its length, and then use the theorem again in the second triangle.",
        "一条线段可以是一个直角三角形的斜边，又是另一个的直角边。所以先由第一个三角形求它的长度，再在第二个三角形中使用勾股定理。",
      ],
      (rng) => {
        const [a, b, c, d, e] = rng.pick<[number, number, number, number, number]>([
          [3, 4, 5, 12, 13],
          [6, 8, 10, 24, 26],
          [9, 12, 15, 20, 25],
          [5, 12, 13, 84, 85],
          [7, 24, 25, 60, 65],
          [15, 20, 25, 60, 65],
          [8, 6, 10, 24, 26],
          [12, 9, 15, 36, 39],
        ]);
        const k = rng.int(1, 4);
        return integer(
          [
            `In right triangle $ABC$, the right angle is at $B$, $AB = ${a * k}$ and $BC = ${b * k}$. In right triangle $ACD$, the right angle is at $C$ and $CD = ${d * k}$. What is $AD$?`,
            `在直角三角形 $ABC$ 中，直角在 $B$，$AB = ${a * k}$，$BC = ${b * k}$。在直角三角形 $ACD$ 中，直角在 $C$，$CD = ${d * k}$。$AD$ 是多少？`,
          ],
          e * k,
          [c * k, (a + d) * k, (c + d) * k],
          [`First $AC = ${c * k}$, and then $AD = ${e * k}$.`, `先得 $AC = ${c * k}$，再得 $AD = ${e * k}$。`],
        );
      },
    ),
  ],
  "reasoning-from-direction-and-displacement": [
    skill(
      "the-displacement-that-returns",
      ["The displacement that returns", "返回起点的位移"],
      [
        "To return to the start, the last displacement must cancel the sum of the earlier ones. So add the moves one component at a time, and change the sign of both components.",
        "要回到起点，最后的位移必须抵消前面位移的和。所以逐个分量相加，再把两个分量都变号。",
      ],
      (rng) => {
        const [a, b, c, d] = [nz(rng, 9), nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return chooseFilled(
          rng,
          [
            `A robot moves by $\\langle ${a}, ${b} \\rangle$ and then by $\\langle ${c}, ${d} \\rangle$. What third displacement brings it back to the start?`,
            `机器人先位移 $\\langle ${a}, ${b} \\rangle$，再位移 $\\langle ${c}, ${d} \\rangle$。第三次位移是多少才能回到起点？`,
          ],
          `\\langle ${-a - c}, ${-b - d} \\rangle`,
          [`\\langle ${a + c}, ${b + d} \\rangle`, `\\langle ${c - a}, ${d - b} \\rangle`, `\\langle ${a - c}, ${b - d} \\rangle`],
          [
            `The sum so far is $\\langle ${a + c}, ${b + d} \\rangle$, and the opposite cancels it.`,
            `目前的和是 $\\langle ${a + c}, ${b + d} \\rangle$，它的相反向量可以抵消。`,
          ],
        );
      },
    ),
  ],
  "reasoning-from-function-representations": [
    skill(
      "a-function-of-itself-from-a-table",
      ["A function of itself from a table", "由表格求复合"],
      [
        "To find $f(f(a))$ from a table, read the inner output first. Then find that output in the input row, and read the value below it, working from the inside out.",
        "由表格求 $f(f(a))$ 时，先读出内层的输出。然后在输入行找到这个输出，读出它下面的值，由内向外计算。",
      ],
      (rng) => {
        const xs = [1, 2, 3, 4, 5, 6];
        const ys = xs.map(() => rng.int(1, 6));
        const a = rng.int(1, 6);
        const inner = ys[a - 1] as number;
        const answer = ys[inner - 1] as number;
        return integer(
          [
            `The table defines the function $f$. What is $f(f(${a}))$? ${table(xs, ys)}`,
            `表格定义了函数 $f$。求 $f(f(${a}))$。${table(xs, ys)}`,
          ],
          answer,
          [inner, answer + 1, a],
          [`$f(${a}) = ${inner}$, and $f(${inner}) = ${answer}$.`, `$f(${a}) = ${inner}$，$f(${inner}) = ${answer}$。`],
        );
      },
    ),
  ],
  "reasoning-from-incomplete-linear-graphs": [
    skill(
      "where-the-line-crosses-the-axis",
      ["Where the line crosses the axis", "直线与坐标轴的交点"],
      [
        "A line continues past the part that is shown, with the same slope. So find the slope from two marked points, and count back from one of them until the height reaches zero.",
        "直线在画出的部分之外继续延伸，斜率不变。所以由两个标出的点求斜率，再从其中一点往回数，直到高度变成零。",
      ],
      (rng) => {
        const r = nz(rng, 20);
        const m = nz(rng, 5);
        const p = rng.int(1, 6);
        const q = p + rng.int(1, 6);
        return integer(
          [
            `A graph shows part of a line through the marked points $(${r + p}, ${m * p})$ and $(${r + q}, ${m * q})$. If the line continues, at what value of $x$ does it cross the $x$-axis?`,
            `图象显示一条直线的一部分，经过标出的点 $(${r + p}, ${m * p})$ 和 $(${r + q}, ${m * q})$。如果直线继续延伸，它与 $x$ 轴相交处的 $x$ 值是多少？`,
          ],
          r,
          [r + p, m * p, r - p],
          [
            `The slope is $${m}$, so going back $${p}$ in $x$ from the first point reaches height $0$, at $x = ${r}$.`,
            `斜率是 $${m}$，所以从第一个点沿 $x$ 往回 $${p}$ 就到高度 $0$，此时 $x = ${r}$。`,
          ],
        );
      },
    ),
  ],
  "reasoning-from-inscribed-special-polygons": [
    skill(
      "a-square-and-its-circle",
      ["A square and its circle", "正方形与它的外接圆"],
      [
        "A diagonal of an inscribed square is a diameter of the circle. The area of a square is half the square of its diagonal, so it equals twice the square of the radius.",
        "内接正方形的对角线是圆的直径。正方形的面积是对角线平方的一半，所以等于半径平方的两倍。",
      ],
      (rng) => {
        const r = rng.int(1, 25);
        return integer(
          [
            `A square is inscribed in a circle with area $${r * r}\\pi$. What is the area of the square?`,
            `正方形内接于面积为 $${r * r}\\pi$ 的圆。正方形的面积是多少？`,
          ],
          2 * r * r,
          [r * r, 4 * r * r, 2 * r],
          [
            `The radius is ${r}, so the diagonal is ${2 * r}, and half its square is ${2 * r * r}.`,
            `半径是 ${r}，所以对角线是 ${2 * r}，它的平方的一半是 ${2 * r * r}。`,
          ],
        );
      },
    ),
  ],
  "reasoning-from-multi-stage-percentages": [
    skill(
      "the-overall-percent",
      ["The overall percent", "总的百分比"],
      [
        "Percent changes multiply rather than add, because the second change applies to the new amount. So multiply the two factors to see the final amount as a percent of the original.",
        "百分比变化是相乘而不是相加，因为第二次变化作用于新的数量。所以把两个因子相乘，就得到最终数量相当于原来的百分之几。",
      ],
      (rng) => {
        const p = rng.int(1, 9) * 10;
        const q = rng.int(1, 8) * 10;
        const up = (100 + p) * (100 - q);
        return integer(
          [
            `A price rises ${p} percent and then falls ${q} percent. The final price is what percent of the original price?`,
            `价格先上涨百分之 ${p}，再下降百分之 ${q}。最终价格是原价的百分之几？`,
          ],
          up / 100,
          [100 + p - q, ((100 + q) * (100 - p)) / 100, 100 + q - p],
          [
            `A rise of ${p} percent multiplies by ${(100 + p) / 100}, and a fall of ${q} percent multiplies by ${(100 - q) / 100}. Percents do not simply add: $${(100 + p) / 100} \\times ${(100 - q) / 100} = ${up / 100}\\%$ of the original.`,
            `上涨百分之 ${p} 就是乘以 ${(100 + p) / 100}，下降百分之 ${q} 就是乘以 ${(100 - q) / 100}。百分数不能直接相加：$${(100 + p) / 100} \\times ${(100 - q) / 100} = ${up / 100}\\%$，这是相对于原价的。`,
          ],
        );
      },
    ),
  ],
  "reasoning-from-rigid-motions": [
    skill(
      "a-quarter-turn-then-a-slide",
      ["A quarter turn then a slide", "旋转四分之一圈再平移"],
      [
        "A clockwise quarter turn about the origin sends $(a, b)$ to $(b, -a)$. Order matters in a sequence, so apply the rotation first and then add the translation to the new coordinates.",
        "绕原点顺时针旋转 90 度把 $(a, b)$ 变成 $(b, -a)$。序列中的顺序很重要，所以先旋转，再把平移加到新坐标上。",
      ],
      (rng) => {
        const [a, b, h, k] = [nz(rng, 9), nz(rng, 9), nz(rng, 6), nz(rng, 6)];
        return chooseFilled(
          rng,
          [
            `Rotate $(${a}, ${b})$ by $90^{\\circ}$ clockwise about the origin. Then add ${h} to its $x$-coordinate and ${k} to its $y$-coordinate. Where does it end?`,
            `把 $(${a}, ${b})$ 绕原点顺时针旋转 $90^{\\circ}$。然后 $x$ 坐标加 ${h}，$y$ 坐标加 ${k}。它最后在哪里？`,
          ],
          `(${b + h}, ${-a + k})`,
          [`(${-b + h}, ${a + k})`, `(${a + h}, ${b + k})`, `(${b + k}, ${-a + h})`],
          [`The rotation gives $(${b}, ${-a})$, and the slide gives the result.`, `旋转得 $(${b}, ${-a})$，平移后得到结果。`],
        );
      },
    ),
  ],
  "reasoning-from-stated-probability-relationships": [
    skill(
      "three-outcomes-with-a-known-share",
      ["Three outcomes with a known share", "已知一份的三个结果"],
      [
        "The probabilities of all outcomes add up to 1. So subtract the known probability from 1, and split what remains according to the stated relationship between the two others.",
        "所有结果的概率之和是 1。所以用 1 减去已知概率，再按另外两个结果之间的关系分配剩下的部分。",
      ],
      (rng) => {
        const d = rng.pick([4, 5, 7, 8, 10, 11, 13]);
        const c = rng.int(1, d - 1);
        const t = rng.int(2, 6);
        return fraction(
          [
            `A marble is red, blue or green. The probability of green is $${Q.of(c, d).toLatex()}$, and red is ${t} times as likely as blue. What is the probability of blue?`,
            `弹珠是红色、蓝色或绿色。绿色的概率是 $${Q.of(c, d).toLatex()}$，红色的可能性是蓝色的 ${t} 倍。蓝色的概率是多少？`,
          ],
          Q.of(d - c, d * (t + 1)),
          [Q.of(t * (d - c), d * (t + 1)), Q.of(d - c, d), Q.of(1, t + 1)],
          [
            `What remains is $${Q.of(d - c, d).toLatex()}$, split into ${t + 1} equal parts.`,
            `剩下 $${Q.of(d - c, d).toLatex()}$，分成 ${t + 1} 等份。`,
          ],
        );
      },
    ),
  ],
  "reasoning-under-absolute-value-constraints": [
    skill(
      "counting-integers-under-a-constraint",
      ["Counting integers under a constraint", "数约束内的整数"],
      [
        "The inequality $|x - a| \\le k$ describes all numbers within $k$ of $a$. That is $k$ integers on each side plus $a$ itself, and a strict inequality leaves out the two end points.",
        "不等式 $|x - a| \\le k$ 表示与 $a$ 距离不超过 $k$ 的所有数。两边各有 $k$ 个整数，再加上 $a$ 本身；严格不等式则去掉两个端点。",
      ],
      (rng) => {
        const a = nz(rng, 15);
        const k = rng.int(2, 20);
        const closed = rng.bool();
        return integer(
          [
            `How many integers $x$ satisfy $|x ${a < 0 ? "+" : "-"} ${Math.abs(a)}| ${closed ? "\\le" : "<"} ${k}$?`,
            `有多少个整数 $x$ 满足 $|x ${a < 0 ? "+" : "-"} ${Math.abs(a)}| ${closed ? "\\le" : "<"} ${k}$？`,
          ],
          closed ? 2 * k + 1 : 2 * k - 1,
          [2 * k, closed ? 2 * k - 1 : 2 * k + 1, k],
          [
            `The distance from $x$ to ${a} is ${closed ? "at most" : "less than"} ${k}, so the integers run from ${closed ? a - k : a - k + 1} to ${closed ? a + k : a + k - 1}. That is $${closed ? a + k : a + k - 1} - (${closed ? a - k : a - k + 1}) + 1 = ${closed ? 2 * k + 1 : 2 * k - 1}$ integers.`,
            `$x$ 到 ${a} 的距离${closed ? "不超过" : "小于"} ${k}，所以这些整数从 ${closed ? a - k : a - k + 1} 到 ${closed ? a + k : a + k - 1}。个数是 $${closed ? a + k : a + k - 1} - (${closed ? a - k : a - k + 1}) + 1 = ${closed ? 2 * k + 1 : 2 * k - 1}$。`,
          ],
        );
      },
    ),
  ],
  "reasoning-with-derived-travel-rates": [
    skill(
      "hours-from-a-pace",
      ["Hours from a pace", "由配速求小时数"],
      [
        "A pace in minutes per mile is the upside-down form of a speed. So multiply it by the distance to get the total minutes, and divide by 60 to express the answer in hours.",
        "以每英里分钟数表示的配速是速度的倒数形式。所以乘路程得到总分钟数，再除以 60 用小时表示。",
      ],
      (rng) => {
        const m = rng.pick([4, 5, 6, 8, 10, 12, 15]);
        const h = rng.int(1, 9);
        const d = (60 * h) / m;
        const miles = d;
        const hours = (miles * m) / 60;
        return integer(
          [
            `A cyclist keeps a pace of ${m} minutes per mile. How many hours does it take to ride ${miles} miles?`,
            `骑行者保持每英里 ${m} 分钟的配速。骑 ${miles} 英里要多少小时？`,
          ],
          hours,
          [miles * m, Math.floor(miles / m), hours + 1],
          [
            `$${miles} \\times ${m} = ${miles * m}$ minutes, and dividing by 60 gives ${hours}.`,
            `$${miles} \\times ${m} = ${miles * m}$ 分钟，除以 60 得 ${hours}。`,
          ],
        );
      },
    ),
  ],
  "reasoning-with-multi-stage-fractional-amounts": [
    skill(
      "the-fraction-of-the-original-left",
      ["The fraction of the original left", "剩余占原来的几分之几"],
      [
        "Even without a starting amount, the fraction left can be found. Each stage keeps one minus its fraction of what was there, so multiply those kept fractions together.",
        "即使没有起始数量，也能求出剩余的比例。每一阶段保留的是当时数量的一减去该分数，所以把这些保留的分数相乘。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const a = rng.int(1, b - 1);
        const d = rng.int(2, 9);
        const c = rng.int(1, d - 1);
        return fraction(
          [
            `Someone spends $${Q.of(a, b).toLatex()}$ of their money, and then $${Q.of(c, d).toLatex()}$ of what remains. What fraction of the original money is left?`,
            `某人花掉钱的 $${Q.of(a, b).toLatex()}$，再花掉剩下的 $${Q.of(c, d).toLatex()}$。还剩原来的几分之几？`,
          ],
          Q.of((b - a) * (d - c), b * d),
          [Q.of(a * c, b * d), Q.of(Math.max(a * d + c * b, 1), 2 * b * d + 1), Q.of(b - a, b)],
          [
            `Keeping $${Q.of(b - a, b).toLatex()}$ and then $${Q.of(d - c, d).toLatex()}$ gives their product.`,
            `先保留 $${Q.of(b - a, b).toLatex()}$，再保留 $${Q.of(d - c, d).toLatex()}$，结果是它们的积。`,
          ],
        );
      },
    ),
  ],
  "reasoning-with-nested-function-composition": [
    skill(
      "an-input-for-a-composition-of-two",
      ["An input for a composition of two", "两个函数复合的输入"],
      [
        "To solve a composition equation, undo the outer function first, which tells you what the inner function must equal. Then undo the inner function to find the original input.",
        "解复合方程时，先还原外层函数，就知道内层函数应该等于多少。再还原内层函数，得到原来的输入。",
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const b = nz(rng, 9);
        const c = rng.int(2, 6);
        const d = nz(rng, 9);
        const x = nz(rng, 9);
        const inner = c * x + d;
        return integer(
          [
            `If $f(x) = ${a}x${signed(b)}$ and $g(x) = ${c}x${signed(d)}$, for what value of $x$ is $f(g(x)) = ${a * inner + b}$?`,
            `若 $f(x) = ${a}x${signed(b)}$，$g(x) = ${c}x${signed(d)}$，$x$ 为何值时 $f(g(x)) = ${a * inner + b}$？`,
          ],
          x,
          [inner, a * x + b, -x],
          [`$g(x)$ must equal ${inner}, and that gives $x = ${x}$.`, `$g(x)$ 必须等于 ${inner}，由此得 $x = ${x}$。`],
        );
      },
    ),
  ],
  "reasoning-with-trigonometric-identities": [
    skill(
      "secant-squared-from-the-tangent",
      ["Secant squared from the tangent", "由正切求正割的平方"],
      [
        "Dividing the Pythagorean identity by the square of cosine gives $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$. So the tangent alone fixes the square of the secant, whatever the quadrant.",
        "把毕达哥拉斯恒等式除以余弦的平方，得到 $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$。所以只由正切就能确定正割的平方，与象限无关。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick<readonly [number, number, number]>([
          ...triples.filter((t) => t[0] !== 6 && t[0] !== 9),
          [9, 40, 41],
          [12, 35, 37],
          [28, 45, 53],
        ]);
        const flip = rng.bool();
        const [o, h] = flip ? [b, a] : [a, b];
        const sign = rng.bool() ? "-" : "";
        return fraction(
          [
            `If $\\tan\\theta = ${sign}\\frac{${o}}{${h}}$, what is the value of $\\sec^{2}\\theta$?`,
            `若 $\\tan\\theta = ${sign}\\frac{${o}}{${h}}$，$\\sec^{2}\\theta$ 的值是多少？`,
          ],
          Q.of(c * c, h * h),
          [Q.of(h * h, c * c), Q.of(c, h), Q.of(o * o, h * h)],
          [
            `$1 + \\frac{${o * o}}{${h * h}} = \\frac{${c * c}}{${h * h}}$.`,
            `$1 + \\frac{${o * o}}{${h * h}} = \\frac{${c * c}}{${h * h}}$。`,
          ],
        );
      },
    ),
  ],
  "recovering-digits-from-base-expansions": [
    skill(
      "the-sum-of-the-digits-in-a-base",
      ["The sum of the digits in a base", "某进制下的数字和"],
      [
        "Repeated division by the base gives the digits as remainders, starting with the last one. Add these remainders to find the digit sum, which generally differs from one base to another.",
        "反复除以底数，余数就是各位数字，从最后一位开始。把这些余数相加得到数字和，不同进制的数字和一般不同。",
      ],
      (rng) => {
        const b = rng.int(2, 7);
        const n = rng.int(20, 300);
        const digits: number[] = [];
        for (let v = n; v > 0; v = Math.floor(v / b)) digits.unshift(v % b);
        const sum = digits.reduce((s, x) => s + x, 0);
        return integer(
          [
            `Write ${n} using powers of ${b}, with digits less than ${b}. What is the sum of its digits?`,
            `用 ${b} 的幂表示 ${n}，各位数字小于 ${b}。各位数字之和是多少？`,
          ],
          sum,
          [digits.length, sum + 1, sum + b],
          [`The digits are ${digits.join(", ")}, which add up to ${sum}.`, `各位数字是 ${digits.join("、")}，和是 ${sum}。`],
        );
      },
    ),
  ],
  "recovering-lengths-from-similarity-descriptions": [
    skill(
      "a-height-from-a-shadow",
      ["A height from a shadow", "由影子求高度"],
      [
        "Sunlight strikes nearby objects at the same angle, so objects and their shadows form similar triangles. The ratio of height to shadow is the same for both, which gives one proportion to solve.",
        "阳光以相同角度照射附近的物体，所以物体和影子构成相似三角形。两者高度与影子的比相同，由此得到一个比例式。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const s = rng.int(2, 6);
        const t = rng.int(3, 15);
        return integer(
          [
            `A pole ${r * s} ft tall casts a shadow ${s} ft long. At the same time, a tree casts a shadow ${t} ft long. How tall is the tree, in feet?`,
            `高 ${r * s} 英尺的杆子投下 ${s} 英尺长的影子。同一时刻，一棵树的影子长 ${t} 英尺。树高多少英尺？`,
          ],
          r * t,
          [r * s + t, s * t, t + r],
          [`The height is ${r} times the shadow, for both objects.`, `两个物体的高度都是影子的 ${r} 倍。`],
        );
      },
    ),
  ],
  "recovering-measures-from-central-angles": [
    skill(
      "the-area-of-a-sector",
      ["The area of a sector", "扇形的面积"],
      [
        "A sector takes the same fraction of the area as its central angle takes of 360 degrees. So multiply the area of the circle by the central angle over 360.",
        "扇形占圆面积的比例，等于它的圆心角占 360 度的比例。所以用圆的面积乘圆心角除以 360。",
      ],
      (rng) => {
        const [angle, part] = rng.pick<[number, number]>([
          [30, 12],
          [36, 10],
          [40, 9],
          [45, 8],
          [60, 6],
          [72, 5],
          [90, 4],
          [120, 3],
          [180, 2],
        ]);
        const r = rng.pick([part, 2 * part, 6, 12]);
        const usable = (r * r) % part === 0 ? r : part;
        const area = (usable * usable) / part;
        return integer(
          [
            `A sector of a circle of radius ${usable} has a central angle of $${angle}^{\\circ}$. Its area is $k\\pi$. What is $k$?`,
            `半径为 ${usable} 的圆中，一个扇形的圆心角是 $${angle}^{\\circ}$。面积是 $k\\pi$。$k$ 是多少？`,
          ],
          area,
          [usable * usable, (2 * usable) / part === Math.floor((2 * usable) / part) ? (2 * usable) / part : area + 1, area * 2],
          [
            `The sector is $\\frac{1}{${part}}$ of the circle, whose area is $${usable * usable}\\pi$.`,
            `扇形是圆的 $\\frac{1}{${part}}$，圆的面积是 $${usable * usable}\\pi$。`,
          ],
        );
      },
    ),
  ],
  "recovering-measures-of-squares-and-rectangles": [
    skill(
      "a-square-from-its-diagonal",
      ["A square from its diagonal", "由对角线求正方形"],
      [
        "The diagonal of a square is the side times root two. So a diagonal written with root two gives the side directly, and squaring the side gives the area.",
        "正方形的对角线是边长乘根号二。所以用根号二表示的对角线直接给出边长，把边长平方就得到面积。",
      ],
      (rng) => {
        const s = rng.int(2, 30);
        return integer(
          [`A square has a diagonal of length $${s}\\sqrt{2}$. What is its area?`, `正方形的对角线长 $${s}\\sqrt{2}$。它的面积是多少？`],
          s * s,
          [2 * s * s, 4 * s, s],
          [`The side is ${s}, so the area is ${s * s}.`, `边长是 ${s}，所以面积是 ${s * s}。`],
        );
      },
    ),
  ],
  "recovering-solid-measures-from-diagrams": [
    skill(
      "a-cone-with-its-height-missing",
      ["A cone with its height missing", "缺高的圆锥"],
      [
        "The volume of a cone is $\\frac{1}{3}\\pi$ times the square of the radius times the height. So multiply the volume by 3, divide by the square of the radius, and $\\pi$ cancels.",
        "圆锥的体积是 $\\frac{1}{3}\\pi$ 乘半径的平方再乘高。所以把体积乘 3，除以半径的平方，$\\pi$ 就约去了。",
      ],
      (rng) => {
        const r = rng.int(2, 10);
        const h = 3 * rng.int(1, 10);
        return integer(
          [
            `A cone has radius ${r} and volume $${(r * r * h) / 3}\\pi$. What is its height?`,
            `圆锥的半径是 ${r}，体积是 $${(r * r * h) / 3}\\pi$。它的高是多少？`,
          ],
          h,
          [h / 3, r * h, h + r],
          [
            `Undo the one third and the squared radius: $3 \\cdot ${(r * r * h) / 3} \\div ${r * r} = ${h}$.`,
            `消去三分之一和半径的平方：$3 \\cdot ${(r * r * h) / 3} \\div ${r * r} = ${h}$。`,
          ],
        );
      },
    ),
  ],
  "recovering-unstated-features-of-hyperbolas": [
    skill(
      "the-asymptote-from-vertices-and-foci",
      ["The asymptote from vertices and foci", "由顶点和焦点求渐近线"],
      [
        "The vertices give $a$, the foci give $c$, and $c^{2} = a^{2} + b^{2}$ gives $b$. For a hyperbola opening left and right, the asymptotes have slopes $\\pm\\frac{b}{a}$.",
        "顶点给出 $a$，焦点给出 $c$，由 $c^{2} = a^{2} + b^{2}$ 得 $b$。左右开口的双曲线，渐近线的斜率是 $\\pm\\frac{b}{a}$。",
      ],
      (rng) => {
        const [p, q, c] = rng.pick(triples.filter((t) => t[0] !== 6 && t[0] !== 9));
        const flip = rng.bool();
        const [a, b] = flip ? [q, p] : [p, q];
        const k = rng.int(1, 4);
        return fraction(
          [
            `A hyperbola centered at the origin has vertices $(\\pm ${a * k}, 0)$ and foci $(\\pm ${c * k}, 0)$. What is the positive slope of its asymptotes?`,
            `中心在原点的双曲线，顶点是 $(\\pm ${a * k}, 0)$，焦点是 $(\\pm ${c * k}, 0)$。渐近线的正斜率是多少？`,
          ],
          Q.of(b, a),
          [Q.of(a, b), Q.of(c, a), Q.of(b, c)],
          [`$b = ${b * k}$ and $a = ${a * k}$, so the slope is their ratio.`, `$b = ${b * k}$，$a = ${a * k}$，斜率是它们的比。`],
        );
      },
    ),
  ],
  "rewriting-radical-expressions-using-the-laws-of-exponents": [
    skill(
      "a-power-of-a-cube-root",
      ["A power of a cube root", "立方根的幂"],
      [
        "A cube root is the same as a power of one third. Raising to another power then multiplies the exponents, so the result is a single power with a fractional exponent.",
        "立方根相当于三分之一次幂。再取幂时指数相乘，所以结果是一个分数指数的幂。",
      ],
      (rng) => {
        const a = rng.int(1, 11);
        const b = rng.int(2, 7);
        return fraction(
          [
            `For $x > 0$, $\\left(\\sqrt[3]{x^{${a}}}\\right)^{${b}} = x^k$. What is $k$?`,
            `当 $x > 0$ 时，$\\left(\\sqrt[3]{x^{${a}}}\\right)^{${b}} = x^k$。$k$ 是多少？`,
          ],
          Q.of(a * b, 3),
          [Q.of(a + b, 3), Q.of(a, 3 * b), Q.of(3 * b, a)],
          [
            `Write the root as a power: $\\sqrt[3]{x^{${a}}} = x^{${a}/3}$. A power of a power multiplies the exponents: $k = \\frac{${a}}{3} \\cdot ${b} = ${Q.of(a * b, 3).toLatex()}$.`,
            `把根式写成幂：$\\sqrt[3]{x^{${a}}} = x^{${a}/3}$。幂的幂，指数相乘：$k = \\frac{${a}}{3} \\cdot ${b} = ${Q.of(a * b, 3).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "sat-equating-polynomial-coefficients": [
    skill(
      "sat-the-sum-of-the-coefficients",
      ["The sum of the coefficients", "系数之和"],
      [
        "An identity holds for every $x$, so it holds at $x = 1$. There the right side becomes the sum of its coefficients and the left side is easy, which avoids expanding.",
        "恒等式对每个 $x$ 都成立，所以在 $x = 1$ 时也成立。这时右边变成系数之和，左边容易计算，不必展开。",
      ],
      (rng) => {
        const [a, c] = [rng.int(1, 6), rng.int(1, 6)];
        const [b, d] = [nz(rng, 9), nz(rng, 9)];
        return integer(
          [
            `The equation $(${a === 1 ? "" : a}x${signed(b)})(${c === 1 ? "" : c}x${signed(d)}) = Ax^2 + Bx + C$ is true for all values of $x$. What is $A + B + C$?`,
            `方程 $(${a === 1 ? "" : a}x${signed(b)})(${c === 1 ? "" : c}x${signed(d)}) = Ax^2 + Bx + C$ 对所有 $x$ 成立。$A + B + C$ 是多少？`,
          ],
          (a + b) * (c + d),
          [a * c + b * d, a * d + b * c, a + b + c + d],
          [`Setting $x = 1$ gives $${a + b} \\cdot ${paren(c + d)}$.`, `令 $x = 1$，得 $${a + b} \\cdot ${paren(c + d)}$。`],
        );
      },
    ),
  ],
  "sat-exponential-model-rewriting": [
    skill(
      "sat-the-percent-decrease",
      ["The percent decrease", "下降的百分比"],
      [
        "A growth factor below 1 means decrease. Each period keeps that fraction of the amount, so the percent lost is 100 minus the factor written as a percent, not the factor itself.",
        "小于 1 的增长因子表示下降。每个周期保留这个比例，所以损失的百分比是 100 减去该因子的百分数形式，而不是因子本身。",
      ],
      (rng) => {
        const f = rng.int(55, 98);
        const a = rng.int(2, 90) * 50;
        return integer(
          [
            `The value of a machine is modeled by $V(t) = ${a}(${(f / 100).toFixed(2)})^t$, where $t$ is in years. By what percent does the value fall each year?`,
            `机器的价值由 $V(t) = ${a}(${(f / 100).toFixed(2)})^t$ 给出，$t$ 以年计。价值每年下降百分之几？`,
          ],
          100 - f,
          [f, 100 - f + 10, 1 + f],
          [`Each year keeps ${f} percent, so ${100 - f} percent is lost.`, `每年保留百分之 ${f}，所以损失百分之 ${100 - f}。`],
        );
      },
    ),
  ],
  "sat-linear-systems-unknown-constants": [
    skill(
      "sat-a-constant-from-a-known-solution",
      ["A constant from a known solution", "由已知解求常数"],
      [
        "A solution of a system satisfies each equation. So substitute the given point into the equation that contains the constant, and solve the resulting equation for that constant.",
        "方程组的解满足每个方程。所以把给定的点代入含常数的方程，解出这个常数。",
      ],
      (rng) => {
        const x = nz(rng, 9);
        const y = nz(rng, 12);
        const k = nz(rng, 8);
        const a = rng.int(1, 6);
        const b = nz(rng, 6);
        return integer(
          [
            `The system $${a}x${signed(b)}y = ${a * x + b * y}$, $kx - y = ${k * x - y}$ has the solution $(${x}, ${y})$. What is the value of the constant $k$?`,
            `方程组 $${a}x${signed(b)}y = ${a * x + b * y}$，$kx - y = ${k * x - y}$ 的解是 $(${x}, ${y})$。常数 $k$ 的值是多少？`,
          ],
          k,
          [-k, k * x, y],
          [`$${paren(x)}k - ${paren(y)} = ${k * x - y}$ gives $k = ${k}$.`, `$${paren(x)}k - ${paren(y)} = ${k * x - y}$，得 $k = ${k}$。`],
        );
      },
    ),
  ],
  "sat-margin-of-error-interpretation": [
    skill(
      "sat-a-plausible-count-in-the-population",
      ["A plausible count in the population", "总体中合理的人数"],
      [
        "A margin of error gives an interval of plausible percents for the whole population. Multiply the top end of the interval by the population size to find the largest plausible count.",
        "误差范围给出总体百分比的合理区间。用区间的上端乘总体大小，就得到合理人数的最大值。",
      ],
      (rng) => {
        const p = rng.int(20, 70);
        const m = rng.int(2, 6);
        const n = rng.int(2, 50) * 1000;
        return integer(
          [
            `A random survey in a city of $${n}$ adults finds that $${p}\\%$ favor a measure, with a margin of error of $${m}$ percentage points. What is the largest plausible number of adults in the city who favor it?`,
            `在有 $${n}$ 名成年人的城市中，随机调查发现 $${p}\\%$ 赞成某项措施，误差范围是 $${m}$ 个百分点。该市赞成的成年人最多合理估计是多少？`,
          ],
          ((p + m) * n) / 100,
          [(p * n) / 100, ((p - m) * n) / 100, ((p + 2 * m) * n) / 100],
          [
            `The largest plausible share is the estimate plus the margin, $${p + m}\\%$, and $${p + m}\\%$ of $${n}$ is $${((p + m) * n) / 100}$.`,
            `最大合理比例是估计值加误差范围，即 $${p + m}\\%$，而 $${n}$ 的 $${p + m}\\%$ 是 $${((p + m) * n) / 100}$。`,
          ],
        );
      },
    ),
  ],
  "sat-quadratic-vertex-and-constants": [
    skill(
      "sat-the-minimum-from-the-zeros",
      ["The minimum from the zeros", "由零点求最小值"],
      [
        "The vertex of a parabola sits halfway between its zeros. So average the zeros to find where the minimum occurs, and substitute that input to find the minimum value.",
        "抛物线的顶点在两个零点的正中间。所以把零点取平均，得到最小值的位置，再代入求最小值。",
      ],
      (rng) => {
        const p = rng.int(-12, 8);
        const d = rng.int(1, 12);
        const q = p + 2 * d;
        return integer(
          [`What is the minimum value of $f(x) = ${factorOf(p)}${factorOf(q)}$?`, `$f(x) = ${factorOf(p)}${factorOf(q)}$ 的最小值是多少？`],
          -d * d,
          [p + d, p * q, d * d],
          [
            `The minimum is at $x = ${p + d}$, where the factors are ${d} and ${-d}.`,
            `最小值在 $x = ${p + d}$ 处，那里两个因式是 ${d} 和 ${-d}。`,
          ],
        );
      },
    ),
  ],
  "scaling-a-mix-after-converting-units": [
    skill(
      "gallons-from-an-amount-of-food",
      ["Gallons from an amount of food", "由肥料量求加仑数"],
      [
        "A mix can also be scaled backward, from the ingredient to the water. Count how many batches the ingredient makes, find the quarts of water, and then divide by 4 to get gallons.",
        "混合也可以反向缩放，由成分求水量。先数这些成分能配几份，求出水的夸脱数，再除以 4 得到加仑数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([1, 2, 4]);
        const g = rng.int(2, 25);
        const batches = (4 * g) / b;
        return integer(
          [
            `A mix uses ${a} ounces of plant food for every ${b} ${b === 1 ? "quart" : "quarts"} of water. How many gallons of water go with ${a * batches} ounces of plant food?`,
            `混合液每 ${b} 夸脱水用 ${a} 盎司肥料。${a * batches} 盎司肥料要配多少加仑水？`,
          ],
          g,
          [4 * g, batches, b * a * batches],
          [
            `That is ${batches} batches, or ${4 * g} quarts, which is ${g} gallons.`,
            `这是 ${batches} 份，即 ${4 * g} 夸脱，也就是 ${g} 加仑。`,
          ],
        );
      },
    ),
  ],
  "selecting-function-models-and-outputs": [
    skill(
      "when-two-plans-cost-the-same",
      ["When two plans cost the same", "两种方案费用相同时"],
      [
        "Two linear models with different starting amounts and rates agree at one input. So set the two expressions equal, and solve for the input where the plans cost the same.",
        "起始量和速率都不同的两个线性模型，在一个输入处相等。所以令两个式子相等，解出费用相同时的输入。",
      ],
      (rng) => {
        const r = rng.int(2, 15);
        const s = r + rng.int(1, 12);
        const t = rng.int(2, 30);
        const b = rng.int(1, 30);
        return integer(
          [
            `Plan A costs ${b + (s - r) * t} dollars plus ${r} dollars per month. Plan B costs ${b} dollars plus ${s} dollars per month. After how many months do they cost the same?`,
            `方案 A 收 ${b + (s - r) * t} 美元，另加每月 ${r} 美元。方案 B 收 ${b} 美元，另加每月 ${s} 美元。多少个月后费用相同？`,
          ],
          t,
          [(s - r) * t, t + 1, Math.floor((b + (s - r) * t) / s)],
          [`The gap of ${(s - r) * t} closes by ${s - r} each month.`, `相差的 ${(s - r) * t} 每月缩小 ${s - r}。`],
        );
      },
    ),
  ],
  "simplifying-exponential-radical-expressions": [
    skill(
      "a-power-times-a-cube-root",
      ["A power times a cube root", "幂乘立方根"],
      [
        "Write the cube root as a power with a fractional exponent. Then multiplying powers of the same base adds the exponents, so put the whole exponent over 3 as well.",
        "把立方根写成分数指数的幂。同底的幂相乘时指数相加，所以把整数指数也写成分母为 3 的分数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 11);
        return fraction(
          [
            `For $x > 0$, the expression $x^{${a}} \\cdot \\sqrt[3]{x^{${b}}}$ equals $x^{k}$. What is $k$?`,
            `当 $x > 0$ 时，$x^{${a}} \\cdot \\sqrt[3]{x^{${b}}}$ 等于 $x^{k}$。$k$ 是多少？`,
          ],
          Q.of(3 * a + b, 3),
          [Q.of(a * b, 3), Q.of(a + b, 3), Q.of(3 * a + b, 2)],
          [
            `A cube root divides the exponent by $3$, and multiplying powers adds exponents: $${a} + \\frac{${b}}{3} = ${Q.of(3 * a + b, 3).toLatex()}$.`,
            `立方根把指数除以 $3$，同底数幂相乘时指数相加：$${a} + \\frac{${b}}{3} = ${Q.of(3 * a + b, 3).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "simplifying-rational-expressions-with-sums-and-differences-of-cubes": [
    skill(
      "cubes-over-the-quadratic-factor",
      ["Cubes over the quadratic factor", "立方和除以二次因式"],
      [
        "A sum of cubes factors into a linear part and a quadratic part. Dividing by the quadratic part leaves the linear one, so the signs in the quadratic must match the factoring pattern.",
        "立方和可以分解成一次部分和二次部分。除以二次部分就剩下一次部分，所以二次式的符号必须符合分解公式。",
      ],
      (rng) => {
        const a = rng.int(1, 20);
        const sum = rng.bool();
        const mid = a === 1 ? "x" : `${a}x`;
        return chooseFilled(
          rng,
          [
            `Simplify $\\dfrac{x^{3} ${sum ? "+" : "-"} ${a ** 3}}{x^{2} ${sum ? "-" : "+"} ${mid} + ${a * a}}$.`,
            `化简 $\\dfrac{x^{3} ${sum ? "+" : "-"} ${a ** 3}}{x^{2} ${sum ? "-" : "+"} ${mid} + ${a * a}}$。`,
          ],
          `x ${sum ? "+" : "-"} ${a}`,
          [`x ${sum ? "-" : "+"} ${a}`, `x^{2} ${sum ? "+" : "-"} ${a * a}`, `x ${sum ? "+" : "-"} ${a * a}`],
          [
            `The numerator factors as $(x ${sum ? "+" : "-"} ${a})(x^{2} ${sum ? "-" : "+"} ${mid} + ${a * a})$.`,
            `分子分解为 $(x ${sum ? "+" : "-"} ${a})(x^{2} ${sum ? "-" : "+"} ${mid} + ${a * a})$。`,
          ],
        );
      },
    ),
  ],
  "slant-asymptotes-of-rational-functions": [
    skill(
      "the-slope-of-a-slant-asymptote",
      ["The slope of a slant asymptote", "斜渐近线的斜率"],
      [
        "For large $x$, a rational function behaves like the ratio of its leading terms. So the slope of a slant asymptote is the leading coefficient on top over the leading coefficient below.",
        "$x$ 很大时，有理函数的行为就像首项之比。所以斜渐近线的斜率是分子首项系数除以分母首项系数。",
      ],
      (rng) => {
        const a = nz(rng, 12);
        const d = rng.int(2, 9);
        const [b, c, e] = [nz(rng, 9), nz(rng, 9), nz(rng, 9)];
        return fraction(
          [
            `The graph of $f(x) = \\frac{${a}x^{2}${signed(b)}x${signed(c)}}{${d}x${signed(e)}}$ has a slant asymptote $y = mx + k$. What is $m$?`,
            `$f(x) = \\frac{${a}x^{2}${signed(b)}x${signed(c)}}{${d}x${signed(e)}}$ 的图象有斜渐近线 $y = mx + k$。$m$ 是多少？`,
          ],
          Q.of(a, d),
          [Q.of(d, a), Q.of(b, d), Q.of(a, e)],
          [
            `The leading terms give $\\frac{${a}x^{2}}{${d}x}$, so the slope is their coefficient.`,
            `首项给出 $\\frac{${a}x^{2}}{${d}x}$，所以斜率是它的系数。`,
          ],
        );
      },
    ),
  ],
  "solving-and-adjusting-a-given-formula": [
    skill(
      "the-effect-of-scaling-in-a-formula",
      ["The effect of scaling in a formula", "公式中缩放的效果"],
      [
        "A formula shows how each change affects the result. In $V = \\pi r^{2}h$ the radius is squared, so multiplying it by $p$ multiplies the volume by $p^{2}$, and the height counts once.",
        "公式显示每个变化如何影响结果。在 $V = \\pi r^{2}h$ 中半径是平方的，所以半径乘 $p$ 时体积乘 $p^{2}$，而高只算一次。",
      ],
      (rng) => {
        const p = rng.int(2, 6);
        const q = rng.int(2, 9);
        return integer(
          [
            `In $V = \\pi r^{2}h$, the radius is multiplied by ${p} and the height is multiplied by ${q}. By what factor is the volume multiplied?`,
            `在 $V = \\pi r^{2}h$ 中，半径乘 ${p}，高乘 ${q}。体积乘多少倍？`,
          ],
          p * p * q,
          [p * q, p * q * q, p + q],
          [
            `The radius is squared and the height is not, so $${p}^{2} \\cdot ${q} = ${p * p * q}$.`,
            `半径要平方，高不用，所以 $${p}^{2} \\cdot ${q} = ${p * p * q}$。`,
          ],
        );
      },
    ),
  ],
  "solving-angle-problems-from-descriptions-of-similar-triangles": [
    skill(
      "angles-in-a-stated-ratio",
      ["Angles in a stated ratio", "按比例给出的角"],
      [
        "Matching angles of similar triangles are equal, so the ratio carries over. The three parts of the ratio share 180 degrees, which gives each angle in either triangle.",
        "相似三角形的对应角相等，所以比例不变。比例的三部分共分 180 度，由此得到任一三角形中的每个角。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick<[number, number, number]>([
          [1, 2, 3],
          [2, 3, 4],
          [1, 3, 5],
          [3, 4, 5],
          [1, 4, 5],
          [2, 3, 5],
          [1, 2, 6],
          [2, 5, 8],
          [3, 5, 7],
          [1, 5, 6],
          [3, 4, 8],
          [1, 2, 9],
          [2, 7, 9],
          [4, 5, 9],
          [1, 3, 8],
          [2, 3, 7],
        ]);
        const [name, value] = rng.pick<[string, number]>([
          ["D", a],
          ["E", b],
          ["F", c],
        ]);
        const unit = 180 / (a + b + c);
        return integer(
          [
            `$\\triangle ABC \\sim \\triangle DEF$, and $\\angle A : \\angle B : \\angle C = ${a} : ${b} : ${c}$. What is the measure of $\\angle ${name}$, in degrees?`,
            `$\\triangle ABC \\sim \\triangle DEF$，$\\angle A : \\angle B : \\angle C = ${a} : ${b} : ${c}$。$\\angle ${name}$ 是多少度？`,
          ],
          value * unit,
          [unit, (a + c + b - value) * unit, 180 - unit],
          [
            `One part is $180 \\div ${a + b + c} = ${unit}$, and $\\angle ${name}$ has ${value} of them.`,
            `一份是 $180 \\div ${a + b + c} = ${unit}$，$\\angle ${name}$ 占 ${value} 份。`,
          ],
        );
      },
    ),
  ],
  "solving-exponential-equations-with-a-quadratic-exponent": [
    skill(
      "the-sum-of-the-solutions",
      ["The sum of the solutions", "解的和"],
      [
        "With equal bases, the exponents must be equal, which gives a quadratic equation. The sum of its solutions is the opposite of the coefficient of $x$, with no need to find them separately.",
        "底数相等时，指数必须相等，这得到一个二次方程。它的解的和是 $x$ 的系数的相反数，不必分别求出。",
      ],
      (rng) => {
        const b = rng.int(2, 7);
        const r = nz(rng, 9);
        let s = nz(rng, 9);
        if (Math.abs(r + s) < 2) s += 3;
        if (s === 0) s = 2;
        const p = -(r + s);
        const q = r * s;
        return integer(
          [
            `What is the sum of the solutions of $${b}^{x^{2}${signed(p)}x} = ${b}^{${-q}}$?`,
            `$${b}^{x^{2}${signed(p)}x} = ${b}^{${-q}}$ 的解的和是多少？`,
          ],
          r + s,
          [p, q, r + s + b],
          [
            `The bases are equal, so the exponents are equal: $x^{2}${signed(p)}x${signed(q)} = 0$. Its solutions are $${r}$ and $${s}$, with sum $${r + s}$.`,
            `底数相同，所以指数相等：$x^{2}${signed(p)}x${signed(q)} = 0$。解是 $${r}$ 和 $${s}$，和为 $${r + s}$。`,
          ],
        );
      },
    ),
  ],
  "solving-for-an-unknown-in-a-logarithm-statement": [
    skill(
      "an-unknown-inside-a-binomial-argument",
      ["An unknown inside a binomial argument", "二项式真数中的未知数"],
      [
        "A logarithm statement can be rewritten as a power. If the argument is a binomial, set it equal to that power, and then solve the resulting linear equation for the unknown.",
        "对数式可以改写成幂。如果真数是二项式，就令它等于这个幂，再解所得的一次方程。",
      ],
      (rng) => {
        const b = rng.int(2, 6);
        const n = rng.int(1, 4);
        const a = nz(rng, 20);
        return integer(
          [`Solve $\\log_{${b}} (x${signed(a)}) = ${n}$.`, `解 $\\log_{${b}} (x${signed(a)}) = ${n}$。`],
          b ** n - a,
          [b ** n + a, b * n - a, b ** n],
          [
            `$x${signed(a)} = ${b}^{${n}} = ${b ** n}$, so $x = ${b ** n - a}$.`,
            `$x${signed(a)} = ${b}^{${n}} = ${b ** n}$，所以 $x = ${b ** n - a}$。`,
          ],
        );
      },
    ),
  ],
  "solving-geometry-problems-by-manipulating-radicals": [
    skill(
      "a-perimeter-with-like-radicals",
      ["A perimeter with like radicals", "同类根式的周长"],
      [
        "Like radicals add just like like terms, so sides sharing a root combine by adding the numbers in front. First simplify any root that contains a perfect square factor.",
        "同类根式像同类项一样相加，所以含相同根号的边，把前面的数相加即可。要先化简含完全平方因数的根式。",
      ],
      (rng) => {
        const n = rng.pick([2, 3, 5, 6, 7, 10]);
        const a = rng.int(1, 9);
        const b = rng.int(2, 5);
        return integer(
          [
            `A rectangle has sides of length $${a === 1 ? "" : a}\\sqrt{${n}}$ and $\\sqrt{${b * b * n}}$. Its perimeter is $k\\sqrt{${n}}$. What is $k$?`,
            `长方形的边长是 $${a === 1 ? "" : a}\\sqrt{${n}}$ 和 $\\sqrt{${b * b * n}}$。周长是 $k\\sqrt{${n}}$。$k$ 是多少？`,
          ],
          2 * (a + b),
          [a + b, 2 * a + b * b * 2, a * b],
          [
            `$\\sqrt{${b * b * n}} = ${b}\\sqrt{${n}}$, so the sides add up to $${a + b}\\sqrt{${n}}$ before doubling.`,
            `$\\sqrt{${b * b * n}} = ${b}\\sqrt{${n}}$，所以两边之和是 $${a + b}\\sqrt{${n}}$，再乘 2。`,
          ],
        );
      },
    ),
  ],
  "solving-linear-equations-containing-binomials": [
    skill(
      "subtracting-a-multiple-of-a-binomial",
      ["Subtracting a multiple of a binomial", "减去二项式的倍数"],
      [
        "A minus sign before a parenthesis acts on each term inside. So distribute the negative multiplier to both terms, changing both signs, before collecting like terms on each side.",
        "括号前的减号作用于里面的每一项。所以把负的乘数分配给两项，两个符号都要改变，然后再在两边合并同类项。",
      ],
      (rng) => {
        const n = nz(rng, 12);
        const k = rng.int(2, 6);
        const m = k + rng.int(1, 4);
        const p = rng.int(1, 9);
        const q = rng.int(1, 9);
        const c = m * (n + q) + k * (n - p);
        return integer(
          [`Solve for $n$: $${c} - ${k}(n - ${p}) = ${m}(n + ${q})$`, `解出 $n$：$${c} - ${k}(n - ${p}) = ${m}(n + ${q})$`],
          n,
          [-n, n + p, Math.trunc((c - k * p - m * q) / (m + k))],
          [
            `Expanding gives $${c} - ${k}n + ${k * p} = ${m}n + ${m * q}$, so $${m + k}n = ${(m + k) * n}$.`,
            `展开得 $${c} - ${k}n + ${k * p} = ${m}n + ${m * q}$，所以 $${m + k}n = ${(m + k) * n}$。`,
          ],
        );
      },
    ),
  ],
  "solving-linear-equations-containing-binomials-by-factoring": [
    skill(
      "a-repeated-binomial-over-denominators",
      ["A repeated binomial over denominators", "分母上重复的二项式"],
      [
        "Treat a repeated binomial as a single unknown, even when it is divided by different numbers. Add the fractions, solve for the binomial, and only then solve for $x$.",
        "把重复的二项式看作一个未知数，即使它除以不同的数。把分数相加，解出这个二项式，然后才解 $x$。",
      ],
      (rng) => {
        const [p, q] = rng.pick<[number, number]>([
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [5, 6],
        ]);
        const t = nz(rng, 8);
        const a = rng.int(1, 20);
        const u = p * q * t;
        return integer(
          [
            `Solve for $x$: $\\frac{x - ${a}}{${p}} + \\frac{x - ${a}}{${q}} = ${(p + q) * t}$`,
            `解出 $x$：$\\frac{x - ${a}}{${p}} + \\frac{x - ${a}}{${q}} = ${(p + q) * t}$`,
          ],
          u + a,
          [u, u - a, (p + q) * t + a],
          [
            `$\\frac{${p + q}}{${p * q}}(x - ${a}) = ${(p + q) * t}$ gives $x - ${a} = ${u}$.`,
            `$\\frac{${p + q}}{${p * q}}(x - ${a}) = ${(p + q) * t}$，得 $x - ${a} = ${u}$。`,
          ],
        );
      },
    ),
  ],
  "solving-many-variable-nonlinear-equations": [
    skill(
      "solving-for-a-cubed-variable",
      ["Solving for a cubed variable", "解立方变量"],
      [
        "Isolate the power first by clearing denominators and dividing by the coefficient. Then undo a cube with a cube root, which applies to the whole of the other side.",
        "先去分母并除以系数，把幂单独放在一边。然后用立方根消去立方，立方根作用于另一边的全部。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const [y, z] = rng.bool() ? ["y", "z"] : ["p", "q"];
        return chooseFilled(
          rng,
          [
            `The positive variables $x$, $${y}$ and $${z}$ satisfy $${y} = \\frac{${a}x^3}{${z}}$. Solve for $x$.`,
            `正变量 $x$、$${y}$、$${z}$ 满足 $${y} = \\frac{${a}x^3}{${z}}$。解出 $x$。`,
          ],
          `x = \\sqrt[3]{\\frac{${y}${z}}{${a}}}`,
          [`x = \\frac{\\sqrt[3]{${y}${z}}}{${a}}`, `x = \\sqrt[3]{\\frac{${a}${y}}{${z}}}`, `x = \\sqrt{\\frac{${y}${z}}{${a}}}`],
          [`$x^{3} = \\frac{${y}${z}}{${a}}$, and the cube root gives $x$.`, `$x^{3} = \\frac{${y}${z}}{${a}}$，开立方得 $x$。`],
        );
      },
    ),
  ],
  "solving-many-variable-rational-equations": [
    skill(
      "the-reciprocal-sum-formula",
      ["The reciprocal sum formula", "倒数和公式"],
      [
        "Formulas such as those for lenses and resistors add reciprocals. Combine the right side over a common denominator, and then flip both sides to solve for the letter on the left.",
        "透镜和电阻的公式都是倒数相加。把右边通分，然后两边同时取倒数，解出左边的字母。",
      ],
      (rng) => {
        const [f, a, b] = rng.sample(["f", "a", "b", "c", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], 3) as [
          string,
          string,
          string,
        ];
        const k = rng.int(1, 9);
        const top = k === 1 ? "" : `${k}`;
        return chooseFilled(
          rng,
          [
            `Solve $\\frac{${top || 1}}{${f}} = \\frac{1}{${a}} + \\frac{1}{${b}}$ for $${f}$.`,
            `解出 $${f}$：$\\frac{${top || 1}}{${f}} = \\frac{1}{${a}} + \\frac{1}{${b}}$。`,
          ],
          `${f} = \\frac{${top}${a}${b}}{${a} + ${b}}`,
          [`${f} = ${a} + ${b}`, `${f} = \\frac{${a} + ${b}}{${top}${a}${b}}`, `${f} = \\frac{${top}${a}${b}}{${a} - ${b}}`],
          [
            `The right side is $\\frac{${a} + ${b}}{${a}${b}}$, and flipping both sides gives the result.`,
            `右边是 $\\frac{${a} + ${b}}{${a}${b}}$，两边取倒数得结果。`,
          ],
        );
      },
    ),
  ],
  "solving-one-and-two-step-money-problems-with-rounded-amounts": [
    skill(
      "the-change-from-a-payment",
      ["The change from a payment", "付款的找零"],
      [
        "Find the exact total by multiplying the price by the quantity, keeping the cents. Then subtract from the amount paid, lining up the decimal points to find the change.",
        "用单价乘数量求出确切的总价，保留分。然后从付款额中减去，小数点对齐，得到找零。",
      ],
      (rng) => {
        const cents = rng.int(105, 895);
        const n = rng.int(2, 6);
        const paid = (Math.floor((n * cents) / 1000) + 1) * 10 + (rng.bool() ? 10 : 0);
        const change = paid * 100 - n * cents;
        return decimal(
          [
            `A shopper buys ${n} items at ${(cents / 100).toFixed(2)} dollars each and pays with ${paid} dollars. How many dollars of change should come back?`,
            `顾客买 ${n} 件商品，每件 ${(cents / 100).toFixed(2)} 美元，付了 ${paid} 美元。应找回多少美元？`,
          ],
          Q.of(change, 100),
          [Q.of(n * cents, 100), Q.of(paid * 100 - cents, 100), Q.of(change + 100, 100)],
          [
            `The total is ${((n * cents) / 100).toFixed(2)} dollars, and subtracting from ${paid} gives the change.`,
            `总价是 ${((n * cents) / 100).toFixed(2)} 美元，从 ${paid} 中减去得到找零。`,
          ],
        );
      },
    ),
  ],
  "solving-parallel-line-problems-from-descriptions": [
    skill(
      "the-other-angle-after-solving",
      ["The other angle after solving", "求解后的另一个角"],
      [
        "Once one equal pair has been solved for $x$, every other angle at the crossing follows. An angle next to it along the transversal is its supplement, so subtract from 180 degrees.",
        "由一对相等的角解出 $x$ 后，交点处其他的角都能得出。沿截线与它相邻的角是它的补角，所以用 180 度减去它。",
      ],
      (rng) => {
        const x = rng.int(8, 20);
        const a = rng.int(2, 5);
        const c = a + rng.int(1, 3);
        const angle = rng.int(Math.max(c * x + 1, 40), 170);
        return integer(
          [
            `Two parallel lines are cut by a transversal. Two corresponding angles measure $(${a}x${signed(angle - a * x)})^\\circ$ and $(${c}x${signed(angle - c * x)})^\\circ$. What is the measure of an angle supplementary to them, in degrees?`,
            `两条平行线被一条截线所截。两个同位角的度数是 $(${a}x${signed(angle - a * x)})^\\circ$ 和 $(${c}x${signed(angle - c * x)})^\\circ$。与它们互补的角是多少度？`,
          ],
          180 - angle,
          [angle, x, 90 - angle > 0 ? 90 - angle : 180 - angle + 10],
          [
            `$x = ${x}$ makes each angle ${angle} degrees, and $180 - ${angle} = ${180 - angle}$.`,
            `$x = ${x}$ 使每个角都是 ${angle} 度，$180 - ${angle} = ${180 - angle}$。`,
          ],
        );
      },
    ),
  ],
  "solving-problems-describing-congruent-triangles": [
    skill(
      "a-perimeter-from-a-congruence",
      ["A perimeter from a congruence", "由全等求周长"],
      [
        "Matching sides of congruent triangles are equal, so solve for the unknown from one such pair. The other sides can then be transferred across, and the two perimeters are the same.",
        "全等三角形的对应边相等，所以由一对对应边解出未知数。其他边可以转移过去，两个三角形的周长相同。",
      ],
      (rng) => {
        const x = rng.int(2, 20);
        const a = rng.int(2, 6);
        const b = rng.int(1, 30);
        const side = a * x + b;
        const other = rng.int(5, 30);
        const third = Math.abs(side - other) + rng.int(1, side + other - Math.abs(side - other) - 1);
        return integer(
          [
            `$\\triangle ABC \\cong \\triangle DEF$, with $AB = ${a}x + ${b}$ and $DE = ${a + 1}x${signed(b - x)}$, $BC = ${other}$ and $DF = ${third}$. What is the perimeter of $\\triangle DEF$?`,
            `$\\triangle ABC \\cong \\triangle DEF$，$AB = ${a}x + ${b}$，$DE = ${a + 1}x${signed(b - x)}$，$BC = ${other}$，$DF = ${third}$。$\\triangle DEF$ 的周长是多少？`,
          ],
          side + other + third,
          [side + other, x + other + third, side + third],
          [`$x = ${x}$ gives $DE = ${side}$, and $EF = BC = ${other}$.`, `$x = ${x}$ 得 $DE = ${side}$，且 $EF = BC = ${other}$。`],
        );
      },
    ),
  ],
  "solving-problems-with-embedded-right-triangles": [
    skill(
      "a-leg-from-the-hypotenuse-segments",
      ["A leg from the hypotenuse segments", "由斜边分段求直角边"],
      [
        "The altitude to the hypotenuse makes triangles similar to the whole. So each leg squared equals the whole hypotenuse times the adjacent segment, which is called the geometric mean relation.",
        "斜边上的高把三角形分成与原三角形相似的两部分。所以每条直角边的平方等于整条斜边乘相邻的一段，这叫几何平均关系。",
      ],
      (rng) => {
        const p = rng.int(1, 4);
        const u = rng.int(1, 4);
        const v = u + rng.int(1, 4);
        return integer(
          [
            `In right triangle $ABC$, the right angle is at $A$ and $\\overline{AD}$ is the altitude to $\\overline{BC}$. If $BD = ${p * u * u}$ and $BC = ${p * v * v}$, what is $AB$?`,
            `在直角三角形 $ABC$ 中，直角在 $A$，$\\overline{AD}$ 是 $\\overline{BC}$ 上的高。若 $BD = ${p * u * u}$，$BC = ${p * v * v}$，$AB$ 是多少？`,
          ],
          p * u * v,
          [p * v * v - p * u * u, p * u * u + p * v, p * u * u * p * v * v],
          [
            `$AB^{2} = ${p * u * u} \\cdot ${p * v * v}$, so $AB = ${p * u * v}$.`,
            `$AB^{2} = ${p * u * u} \\cdot ${p * v * v}$，所以 $AB = ${p * u * v}$。`,
          ],
        );
      },
    ),
  ],
  "solving-quadratic-equations-containing-unknown-parameters": [
    skill(
      "the-gap-between-the-solutions",
      ["The gap between the solutions", "两个解之差"],
      [
        "A parameter can stay in the answer. Factor the quadratic with the parameter included, read off both solutions, and subtract them, using $a > 0$ to decide which one is larger.",
        "参数可以保留在答案里。把含参数的二次式分解，读出两个解并相减，用 $a > 0$ 判断哪个较大。",
      ],
      (rng) => {
        const r = nz(rng, 9);
        let s = nz(rng, 9);
        if (s === r) s = r + 1 === 0 ? r + 2 : r + 1;
        const p = -(r + s);
        const q = r * s;
        const co = (n: number) => (n === 1 ? "" : `${n}`);
        const gap = Math.abs(r - s);
        const mid = p === 0 ? "" : `${p < 0 ? " - " : " + "}${co(Math.abs(p))}ax`;
        return chooseFilled(
          rng,
          [
            `For $a > 0$, what is the positive difference between the solutions of $x^{2}${mid}${q < 0 ? " - " : " + "}${co(Math.abs(q))}a^{2} = 0$?`,
            `当 $a > 0$ 时，$x^{2}${mid}${q < 0 ? " - " : " + "}${co(Math.abs(q))}a^{2} = 0$ 的两个解之差的绝对值是多少？`,
          ],
          `${co(gap)}a`,
          [`${gap + 2}a`, `${co(gap)}a^{2}`, `${gap + 1}a`],
          [
            `Look for two multiples of $a$ with sum $${r + s}a$ and product $${r * s}a^{2}$: the solutions are $${r}a$ and $${s}a$. Their difference is $|${r}a - (${s}a)| = ${co(gap)}a$.`,
            `找 $a$ 的两个倍数，和为 $${r + s}a$，积为 $${r * s}a^{2}$：解是 $${r}a$ 和 $${s}a$。它们的差是 $|${r}a - (${s}a)| = ${co(gap)}a$。`,
          ],
        );
      },
    ),
  ],
  "solving-systems-of-linear-equations-by-identifying-structure": [
    skill(
      "a-difference-of-squares-from-the-system",
      ["A difference of squares from the system", "由方程组求平方差"],
      [
        "Adding and subtracting swapped equations gives the sum and the difference of the unknowns. Their product is the difference of squares, so there is no need to find each unknown.",
        "把系数互换的两个方程相加、相减，得到未知数的和与差。它们的积就是平方差，所以不必求出每个未知数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = a + rng.int(1, 5);
        const s = nz(rng, 9);
        const d = nz(rng, 7);
        const x2 = s + d;
        const y2 = s - d;
        const c = (a * x2 + b * y2) * 1;
        const e = b * x2 + a * y2;
        return fraction(
          [
            `If $${a}x + ${b}y = ${Q.of(c, 2).toLatex()}$ and $${b}x + ${a}y = ${Q.of(e, 2).toLatex()}$, what is the value of $x^{2} - y^{2}$?`,
            `若 $${a}x + ${b}y = ${Q.of(c, 2).toLatex()}$，$${b}x + ${a}y = ${Q.of(e, 2).toLatex()}$，$x^{2} - y^{2}$ 的值是多少？`,
          ],
          Q.of(s * d),
          [Q.of(s + d), Q.of(s - d), Q.of(s * s - d * d)],
          [
            `Here $x + y = ${s}$ and $x - y = ${d}$, whose product is the answer.`,
            `这里 $x + y = ${s}$，$x - y = ${d}$，它们的积就是答案。`,
          ],
        );
      },
    ),
  ],
  "solving-systems-of-nonlinear-equations-by-identifying-structure": [
    skill(
      "the-sum-from-a-difference-of-squares",
      ["The sum from a difference of squares", "由平方差求和"],
      [
        "A difference of squares factors into a sum and a difference. So if the difference of the unknowns is known, dividing gives their sum, without solving for each of them.",
        "平方差可以分解成和与差的积。所以已知未知数的差时，相除就得到它们的和，不必分别解出。",
      ],
      (rng) => {
        const s = nz(rng, 15);
        const d = nz(rng, 9);
        return integer(
          [
            `If $x^{2} - y^{2} = ${s * d}$ and $x - y = ${d}$, what is the value of $x + y$?`,
            `若 $x^{2} - y^{2} = ${s * d}$，$x - y = ${d}$，$x + y$ 的值是多少？`,
          ],
          s,
          [s * d - d, -s, s + d],
          [`$(x + y) \\cdot ${paren(d)} = ${s * d}$, so $x + y = ${s}$.`, `$(x + y) \\cdot ${paren(d)} = ${s * d}$，所以 $x + y = ${s}$。`],
        );
      },
    ),
  ],
  "spheres-and-cubes-inscribed-in-each-other": [
    skill(
      "the-volume-of-the-inscribed-sphere",
      ["The volume of the inscribed sphere", "内切球的体积"],
      [
        "A sphere inscribed in a cube touches each face, so its diameter equals the edge. The radius is half the edge, and the volume uses $\\frac{4}{3}\\pi$ times the cube of the radius.",
        "内切于立方体的球与每个面相切，所以直径等于棱长。半径是棱长的一半，体积是 $\\frac{4}{3}\\pi$ 乘半径的立方。",
      ],
      (rng) => {
        const u = rng.int(1, 10);
        const e = 6 * u;
        const form = rng.pick(["edge", "volume", "surface"] as const);
        const given: [string, string] =
          form === "edge"
            ? [`edge length ${e}`, `棱长为 ${e}`]
            : form === "volume"
              ? [`volume ${e ** 3}`, `体积为 ${e ** 3}`]
              : [`surface area ${6 * e * e}`, `表面积为 ${6 * e * e}`];
        return integer(
          [
            `A sphere is inscribed in a cube with ${given[0]}. The volume of the sphere is $k\\pi$. What is $k$?`,
            `球内切于${given[1]}的立方体。球的体积是 $k\\pi$。$k$ 是多少？`,
          ],
          36 * u ** 3,
          [288 * u ** 3, 216 * u ** 3, 108 * u ** 3],
          [
            `The radius is ${3 * u}, and $\\frac{4}{3} \\cdot ${(3 * u) ** 3} = ${36 * u ** 3}$.`,
            `半径是 ${3 * u}，$\\frac{4}{3} \\cdot ${(3 * u) ** 3} = ${36 * u ** 3}$。`,
          ],
        );
      },
    ),
  ],
  "statistical-effects-of-data-transformations": [
    skill(
      "the-range-under-a-negative-multiplier",
      ["The range under a negative multiplier", "负乘数下的极差"],
      [
        "Adding a constant slides all values together, so it leaves the range alone. Multiplying stretches the gaps by the size of the multiplier, and a range is never negative even when the multiplier is.",
        "加常数使所有的值一起平移，所以极差不变。乘一个数则按乘数的绝对值拉伸间隔，即使乘数为负，极差也不会是负数。",
      ],
      (rng) => {
        const r = rng.int(3, 40);
        const k = nz(rng, 9);
        const c = nz(rng, 30);
        return integer(
          [
            `A data set has a range of ${r}. Each value is multiplied by ${k} and then increased by ${c}. What is the range of the new data set?`,
            `数据组的极差是 ${r}。每个值乘 ${k}，再加上 ${c}。新数据组的极差是多少？`,
          ],
          r * Math.abs(k),
          [k * r + c, Math.abs(k) * r + Math.abs(c), r + Math.abs(c)],
          [
            `Only the size of the multiplier matters, so $${r} \\times ${Math.abs(k)} = ${r * Math.abs(k)}$.`,
            `只有乘数的绝对值起作用，所以 $${r} \\times ${Math.abs(k)} = ${r * Math.abs(k)}$。`,
          ],
        );
      },
    ),
  ],
  "systems-with-a-circle-and-a-line": [
    skill(
      "the-chord-cut-by-a-horizontal-line",
      ["The chord cut by a horizontal line", "水平线截出的弦"],
      [
        "Substituting the height of a horizontal line into the circle gives two values of $x$, one positive and one negative. The distance between those points is twice the positive value.",
        "把水平线的高度代入圆的方程，得到两个 $x$ 值，一正一负。这两点之间的距离是正值的两倍。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const k = rng.int(1, 3);
        const y = (rng.bool() ? 1 : -1) * b * k;
        return integer(
          [
            `The system $x^{2} + y^{2} = ${(c * k) ** 2}$, $y = ${y}$ has two solutions. How far apart are the two points?`,
            `方程组 $x^{2} + y^{2} = ${(c * k) ** 2}$，$y = ${y}$ 有两个解。这两个点相距多远？`,
          ],
          2 * a * k,
          [a * k, 2 * c * k, 2 * b * k],
          [`$x^{2} = ${(a * k) ** 2}$ gives $x = \\pm ${a * k}$.`, `$x^{2} = ${(a * k) ** 2}$，得 $x = \\pm ${a * k}$。`],
        );
      },
    ),
  ],
  "taking-a-part-of-a-converted-duration": [
    skill(
      "the-part-still-to-go",
      ["The part still to go", "还剩的部分"],
      [
        "Convert the whole time to minutes first, since a fraction of hours and minutes is awkward otherwise. The remaining part is one minus the completed fraction, applied to that total.",
        "先把总时间化成分钟，否则小时加分钟的几分之几不好算。剩下的部分是一减去已完成的分数，再乘总时间。",
      ],
      (rng) => {
        const q = rng.pick([3, 4, 5, 6]);
        const p = rng.int(1, q - 1);
        const m = 10 * q * rng.int(1, 12);
        const whole = Math.floor(m / 60);
        const usable = whole === 0 ? m + 60 * q : m;
        const h = Math.floor(usable / 60);
        const l = usable % 60;
        return integer(
          [
            `A trip takes ${h} hours ${l} minutes. After $${Q.of(p, q).toLatex()}$ of it is done, how many minutes are left?`,
            `一段行程需要 ${h} 小时 ${l} 分钟。完成 $${Q.of(p, q).toLatex()}$ 后，还剩多少分钟？`,
          ],
          (usable * (q - p)) / q,
          [(usable * p) / q, usable, Math.floor((usable * (q - p)) / q / 60)],
          [
            `The trip is ${usable} minutes, and $${Q.of(q - p, q).toLatex()}$ of it remains.`,
            `行程是 ${usable} 分钟，还剩 $${Q.of(q - p, q).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "the-zero-product-rule-for-solving-polynomial-equations": [
    skill(
      "counting-the-distinct-solutions",
      ["Counting the distinct solutions", "数不同的解"],
      [
        "Each factor gives its own solutions, but a repeated value only counts once. A difference of squares factor gives two values, a squared factor gives one, and a sum of squares gives no real values.",
        "每个因式给出自己的解，但重复的值只算一次。平方差因式给出两个值，平方因式给出一个值，平方和则没有实数解。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const sumSquare = rng.bool();
        const values = new Set<number>([0, a]);
        if (!sumSquare) {
          values.add(b);
          values.add(-b);
        }
        return integer(
          [
            `How many different real solutions does $x(x - ${a})^{2}(x^{2} ${sumSquare ? "+" : "-"} ${b * b}) = 0$ have?`,
            `$x(x - ${a})^{2}(x^{2} ${sumSquare ? "+" : "-"} ${b * b}) = 0$ 有多少个不同的实数解？`,
          ],
          values.size,
          [5, values.size === 4 ? 3 : 4, 1],
          [
            `The real solutions are ${[...values].sort((p, q) => p - q).join(", ")}.`,
            `实数解是 ${[...values].sort((p, q) => p - q).join("、")}。`,
          ],
        );
      },
    ),
  ],
  "time-shifting-exponential-models": [
    skill(
      "an-earlier-starting-time",
      ["An earlier starting time", "更早的起始时间"],
      [
        "Moving the starting time back means a new variable with $s = t + k$, which is $k$ larger. So the coefficient must be divided by the base to the power $k$ to keep the same values.",
        "把起始时间提前，相当于新变量 $s = t + k$，比原来大 $k$。所以系数要除以底数的 $k$ 次幂，才能保持数值不变。",
      ],
      (rng) => {
        const b = rng.int(2, 4);
        const k = rng.int(1, 3);
        const a = rng.int(2, 30) * 5;
        const year = rng.int(2005, 2025);
        return integer(
          [
            `A population is modeled by $P(t) = ${a * b ** k}(${b})^t$, where $t$ is years since ${year}. Written with $s$, the years since ${year - k}, the model is $P = C(${b})^s$. What is $C$?`,
            `人口模型是 $P(t) = ${a * b ** k}(${b})^t$，$t$ 是 ${year} 年后的年数。用 ${year - k} 年后的年数 $s$ 表示时，模型是 $P = C(${b})^s$。$C$ 是多少？`,
          ],
          a,
          [a * b ** (2 * k), a * b ** k, a * b],
          [
            `$t = s - ${k}$, so $C = ${a * b ** k} \\div ${b ** k} = ${a}$.`,
            `$t = s - ${k}$，所以 $C = ${a * b ** k} \\div ${b ** k} = ${a}$。`,
          ],
        );
      },
    ),
  ],
  "tracking-a-data-change": [
    skill(
      "the-score-needed-for-a-target-mean",
      ["The score needed for a target mean", "达到目标平均分所需的分数"],
      [
        "A target mean fixes the new total, the target times the new count. The score needed is the difference between that total and the current total, which may be larger than expected.",
        "目标平均数决定了新的总和，即目标乘新的个数。需要的分数是这个总和与当前总和的差，它可能比想象的大。",
      ],
      (rng) => {
        const n = rng.int(3, 9);
        const m = rng.int(60, 85);
        // The next score stays at or below 100.
        const d = rng.int(1, Math.min(3, Math.floor((100 - m) / (n + 1))));
        return integer(
          [
            `The mean of ${n} test scores is ${m}. What score on the next test brings the mean to ${m + d}?`,
            `${n} 次测验的平均分是 ${m}。下一次考多少分能使平均分达到 ${m + d}？`,
          ],
          m + (n + 1) * d,
          [m + d, m + n * d, (n + 1) * (m + d)],
          [`The total must be ${(n + 1) * (m + d)}, and it is now ${n * m}.`, `总和必须是 ${(n + 1) * (m + d)}，现在是 ${n * m}。`],
        );
      },
    ),
  ],
  "transformations-of-linear-functions-in-tabular-form": [
    skill(
      "a-reflection-from-a-table",
      ["A reflection from a table", "由表格求反射"],
      [
        "In $g(x) = f(-x) + k$, the input changes sign before the table is used. So look up the opposite of the given input in the table, and then add $k$ to that output.",
        "在 $g(x) = f(-x) + k$ 中，输入要先变号再查表。所以在表中查给定输入的相反数，再把 $k$ 加到输出上。",
      ],
      (rng) => {
        const m = nz(rng, 7);
        const b = rng.int(-9, 9);
        const xs = [-3, -2, -1, 1, 2, 3];
        const a = rng.pick(xs);
        const k = nz(rng, 9);
        return integer(
          [
            `The table shows some values of the linear function $f$, and $g(x) = f(-x)${signed(k)}$. What is $g(${a})$? ${table(
              xs,
              xs.map((x) => m * x + b),
            )}`,
            `表格给出线性函数 $f$ 的一些值，$g(x) = f(-x)${signed(k)}$。求 $g(${a})$。${table(
              xs,
              xs.map((x) => m * x + b),
            )}`,
          ],
          -m * a + b + k,
          [m * a + b + k, -(m * a + b) + k, -m * a + b - k],
          [
            `$f(${-a}) = ${-m * a + b}$, and adding ${k} gives ${-m * a + b + k}.`,
            `$f(${-a}) = ${-m * a + b}$，加 ${k} 得 ${-m * a + b + k}。`,
          ],
        );
      },
    ),
  ],
  "transforming-circles": [
    skill(
      "reflecting-a-circle",
      ["Reflecting a circle", "反射圆"],
      [
        "A reflection moves the center but keeps the radius. Over the $x$-axis the $y$-coordinate of the center changes sign, and over the $y$-axis the $x$-coordinate changes sign.",
        "反射移动圆心而保持半径不变。关于 $x$ 轴反射时，圆心的 $y$ 坐标变号；关于 $y$ 轴反射时，$x$ 坐标变号。",
      ],
      (rng) => {
        const a = nz(rng, 9);
        const b = nz(rng, 9);
        const r = rng.int(2, 30);
        const overX = rng.bool();
        const f = (v: number, n: string) => (v < 0 ? `(${n} + ${-v})` : `(${n} - ${v})`);
        return chooseFilled(
          rng,
          overX
            ? [
                `The circle ${`$${f(a, "x")}^2 + ${f(b, "y")}^2 = ${r}$`} is reflected over the $x$-axis. What is the center of the new circle?`,
                `圆 ${`$${f(a, "x")}^2 + ${f(b, "y")}^2 = ${r}$`} 关于 $x$ 轴反射。新圆的圆心是什么？`,
              ]
            : [
                `The circle ${`$${f(a, "x")}^2 + ${f(b, "y")}^2 = ${r}$`} is reflected over the $y$-axis. What is the center of the new circle?`,
                `圆 ${`$${f(a, "x")}^2 + ${f(b, "y")}^2 = ${r}$`} 关于 $y$ 轴反射。新圆的圆心是什么？`,
              ],
          overX ? `(${a}, ${-b})` : `(${-a}, ${b})`,
          [overX ? `(${-a}, ${b})` : `(${a}, ${-b})`, `(${a}, ${b})`, `(${-a}, ${-b})`],
          [`The center starts at $(${a}, ${b})$, and one coordinate changes sign.`, `圆心原来是 $(${a}, ${b})$，有一个坐标变号。`],
        );
      },
    ),
  ],
  "transforming-polynomial-functions": [
    skill(
      "the-y-intercept-after-a-transformation",
      ["The y-intercept after a transformation", "变换后的 y 轴截距"],
      [
        "The $y$-intercept of $g$ is $g(0)$. With $g(x) = f(x - h) + k$, that means evaluating $f$ at $-h$ and then adding $k$, with no need to expand.",
        "$g$ 的 $y$ 轴截距是 $g(0)$。对于 $g(x) = f(x - h) + k$，就是求 $f$ 在 $-h$ 处的值再加 $k$，不必展开。",
      ],
      (rng) => {
        const a = nz(rng, 6);
        const b = nz(rng, 6);
        const h = nz(rng, 5);
        const k = nz(rng, 9);
        const value = (-h - a) * (-h - b) + k;
        return integer(
          [
            `Let $f(x) = ${factorOf(a)}${factorOf(b)}$ and $g(x) = f(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})${signed(k)}$. What is the $y$-intercept of the graph of $g$?`,
            `设 $f(x) = ${factorOf(a)}${factorOf(b)}$，$g(x) = f(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})${signed(k)}$。$g$ 的图象的 $y$ 轴截距是多少？`,
          ],
          value,
          [a * b + k, (h - a) * (h - b) + k, (-h - a) * (-h - b)],
          [
            `$g(0) = f(${-h})${signed(k)}$, and $f(${-h}) = ${(-h - a) * (-h - b)}$.`,
            `$g(0) = f(${-h})${signed(k)}$，而 $f(${-h}) = ${(-h - a) * (-h - b)}$。`,
          ],
        );
      },
    ),
  ],
  "using-a-circle-with-a-second-condition": [
    skill(
      "a-tangent-from-an-outside-point",
      ["A tangent from an outside point", "由圆外一点作切线"],
      [
        "A tangent meets the radius at a right angle at the point of contact. So the radius, the tangent and the distance to the center form a right triangle, with that distance as the hypotenuse.",
        "切线在切点处与半径垂直。所以半径、切线和到圆心的距离构成直角三角形，到圆心的距离是斜边。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const k = rng.int(1, 7);
        return integer(
          [
            `A circle has area $${(a * k) ** 2}\\pi$. A point is ${c * k} units from its center. How long is a tangent segment from the point to the circle?`,
            `圆的面积是 $${(a * k) ** 2}\\pi$。一点到圆心的距离是 ${c * k}。从该点到圆的切线段有多长？`,
          ],
          b * k,
          [(c - a) * k, (c + a) * k, a * k],
          [
            `The radius is ${a * k}, and $${c * k}^{2} - ${a * k}^{2} = ${b * k}^{2}$.`,
            `半径是 ${a * k}，$${c * k}^{2} - ${a * k}^{2} = ${b * k}^{2}$。`,
          ],
        );
      },
    ),
  ],
  "using-converted-units-of-area": [
    skill(
      "whole-boxes-to-cover-a-floor",
      ["Whole boxes to cover a floor", "铺满地板所需的整箱数"],
      [
        "Convert the floor area to the unit on the box, and divide by the coverage of one box. Boxes come whole, so a remainder means rounding up, not down, to cover the whole floor.",
        "把地板面积化成箱子上的单位，再除以一箱的覆盖面积。箱子只能整箱买，所以有余数时要向上取整，才能铺满地板。",
      ],
      (rng) => {
        const l = 3 * rng.int(3, 12);
        const w = 3 * rng.int(2, 9);
        const c = rng.int(2, 7);
        const yards = (l * w) / 9;
        const boxes = Math.ceil(yards / c);
        return integer(
          [
            `A floor measures ${l} feet by ${w} feet. Each box of tile covers ${c} square yards. How many whole boxes are needed to cover the floor?`,
            `地板长 ${l} 英尺，宽 ${w} 英尺。每箱地砖可铺 ${c} 平方码。铺满地板需要多少整箱？`,
          ],
          boxes,
          [Math.ceil((l * w) / c), boxes + 1, Math.floor(yards / c) === boxes ? boxes - 1 : Math.floor(yards / c)],
          [
            `The floor is ${yards} square yards, and dividing by ${c} and rounding up gives ${boxes}.`,
            `地板是 ${yards} 平方码，除以 ${c} 再向上取整得 ${boxes}。`,
          ],
        );
      },
    ),
  ],
  "using-scientific-notation-with-exponential-values": [
    skill(
      "the-exponent-of-a-quotient",
      ["The exponent of a quotient", "商的指数"],
      [
        "Dividing the numbers in front may give a value below 1. Then the result must be adjusted to scientific notation, which lowers the power of 10 by one.",
        "前面的数相除可能得到小于 1 的值。这时要把结果调整成科学记数法，10 的指数就要减一。",
      ],
      (rng) => {
        const a = rng.pick([2, 3, 4, 5, 6, 8, 9]);
        const b = rng.pick([2, 3, 4, 5, 6, 8, 9].filter((v) => v !== a));
        const m = rng.int(6, 15);
        const n = rng.int(1, 5);
        const answer = a >= b ? m - n : m - n - 1;
        return integer(
          [
            `The value of $\\frac{${a} \\times 10^{${m}}}{${b} \\times 10^{${n}}}$ is written in scientific notation as $d \\times 10^{e}$. What is $e$?`,
            `$\\frac{${a} \\times 10^{${m}}}{${b} \\times 10^{${n}}}$ 写成科学记数法 $d \\times 10^{e}$。$e$ 是多少？`,
          ],
          answer,
          [a >= b ? m - n - 1 : m - n, m + n, answer + 2],
          [
            a >= b
              ? `The quotient of the front numbers is at least 1, so the exponent is ${m - n}.`
              : `The quotient of the front numbers is below 1, so the exponent drops from ${m - n} to ${m - n - 1}.`,
            a >= b ? `前面的数相除不小于 1，所以指数是 ${m - n}。` : `前面的数相除小于 1，所以指数由 ${m - n} 降到 ${m - n - 1}。`,
          ],
        );
      },
    ),
  ],
  "volumes-from-orthographic-views": [
    skill(
      "the-area-of-the-front-view",
      ["The area of the front view", "主视图的面积"],
      [
        "A front view shows only the tallest stack in each column, because shorter stacks hide behind it. So add the greatest height of each column to find how many squares the view shows.",
        "主视图只显示每列最高的一摞，因为矮的被挡在后面。所以把每列的最大高度相加，就得到视图中的方格数。",
      ],
      (rng) => {
        const rows = [0, 1].map(() => [0, 1, 2].map(() => rng.int(1, 6)));
        const r0 = rows[0] as number[];
        const r1 = rows[1] as number[];
        const front = [0, 1, 2].reduce((s, i) => s + Math.max(r0[i] as number, r1[i] as number), 0);
        const all = [...r0, ...r1].reduce((s, v) => s + v, 0);
        return integer(
          [
            `A top view of a stack of cubes has rows of heights $${r0.join(", ")}$ (back) and $${r1.join(", ")}$ (front), in three columns. How many squares appear in the view from the front?`,
            `一堆立方体的俯视图有两行高度：$${r0.join(", ")}$（后）和 $${r1.join(", ")}$（前），共三列。从正面看到多少个方格？`,
          ],
          front,
          [all, front + 1, r1.reduce((s, v) => s + v, 0) === front ? front - 1 : r1.reduce((s, v) => s + v, 0)],
          [`The tallest stacks in the three columns add up to ${front}.`, `三列中最高的几摞加起来是 ${front}。`],
        );
      },
    ),
  ],
  "working-with-descriptions-of-similar-shapes": [
    skill(
      "a-side-from-an-area-ratio",
      ["A side from an area ratio", "由面积比求边长"],
      [
        "Areas of similar shapes are in the square of the ratio of their sides. So take the square root of the area ratio first, and then use it to scale a known side.",
        "相似图形的面积比是边长比的平方。所以先把面积比开平方，再用它缩放已知的边。",
      ],
      (rng) => {
        const p = rng.int(1, 7);
        const q = p + rng.int(1, 5);
        const u = rng.int(1, 9);
        return integer(
          [
            `The areas of two similar pentagons are in the ratio $${p * p} : ${q * q}$. A side of the smaller is ${p * u}. What is the matching side of the larger?`,
            `两个相似五边形的面积比是 $${p * p} : ${q * q}$。较小图形的一边是 ${p * u}。较大图形的对应边是多少？`,
          ],
          q * u,
          [q * q * u, p * u + q * q - p * p, p * q * u],
          [`The side ratio is $${p} : ${q}$, so one part is ${u}.`, `边长比是 $${p} : ${q}$，所以一份是 ${u}。`],
        );
      },
    ),
  ],
  "working-with-descriptions-of-similar-solids": [
    skill(
      "a-length-from-a-volume-ratio",
      ["A length from a volume ratio", "由体积比求长度"],
      [
        "Volumes of similar solids are in the cube of the ratio of their lengths. So take the cube root of the volume ratio, and then use it to scale a known length.",
        "相似立体的体积比是长度比的立方。所以把体积比开立方，再用它缩放已知的长度。",
      ],
      (rng) => {
        const p = rng.int(1, 5);
        const q = p + rng.int(1, 4);
        const u = rng.int(1, 9);
        return integer(
          [
            `The volumes of two similar solids are in the ratio $${p ** 3} : ${q ** 3}$. An edge of the smaller is ${p * u}. What is the matching edge of the larger?`,
            `两个相似立体的体积比是 $${p ** 3} : ${q ** 3}$。较小立体的一条棱是 ${p * u}。较大立体的对应棱是多少？`,
          ],
          q * u,
          [q * q * u, q ** 3 * u, p * q * u],
          [`The length ratio is $${p} : ${q}$, so one part is ${u}.`, `长度比是 $${p} : ${q}$，所以一份是 ${u}。`],
        );
      },
    ),
  ],
  "writing-angles-as-inverse-tangents": [
    skill(
      "the-other-acute-angle",
      ["The other acute angle", "另一个锐角"],
      [
        "From the other acute angle, the opposite and adjacent legs trade places. So its tangent is the reciprocal, and the two inverse tangents add up to 90 degrees.",
        "从另一个锐角看，对边和邻边互换。所以它的正切是倒数，两个反正切之和是 90 度。",
      ],
      (rng) => {
        const [a, b] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 2) as [number, number];
        return chooseFilled(
          rng,
          [
            `In right triangle $ABC$, the right angle is at $C$, $BC = ${a}$ and $AC = ${b}$. Which expression equals the measure of $\\angle B$?`,
            `在直角三角形 $ABC$ 中，直角在 $C$，$BC = ${a}$，$AC = ${b}$。哪个式子等于 $\\angle B$ 的度数？`,
          ],
          `\\tan^{-1}\\left(\\frac{${b}}{${a}}\\right)`,
          [
            `\\tan^{-1}\\left(\\frac{${a}}{${b}}\\right)`,
            `\\tan\\left(\\frac{${b}}{${a}}\\right)`,
            `\\sin^{-1}\\left(\\frac{${b}}{${a}}\\right)`,
          ],
          [
            `The side opposite $B$ is $AC = ${b}$, and the side next to it is $BC = ${a}$.`,
            `$B$ 的对边是 $AC = ${b}$，邻边是 $BC = ${a}$。`,
          ],
        );
      },
    ),
  ],
  "writing-combined-earnings-expressions": [
    skill(
      "items-from-a-known-total",
      ["Items from a known total", "由总收入求件数"],
      [
        "An earnings expression can be solved when the total is known. Subtract the hourly wages from the total, and divide what remains by the payment for each item.",
        "总收入已知时，可以解收入表达式。从总收入中减去小时工资，再把剩下的除以每件的报酬。",
      ],
      (rng) => {
        const w = rng.int(9, 30);
        const h = rng.int(4, 40);
        const p = rng.int(2, 12);
        const n = rng.int(2, 30);
        return integer(
          [
            `A worker earns ${w} dollars per hour plus ${p} dollars for each repair. In ${h} hours the worker earned ${w * h + p * n} dollars. How many repairs were done?`,
            `工人每小时挣 ${w} 美元，每次维修另加 ${p} 美元。${h} 小时共挣 ${w * h + p * n} 美元。做了多少次维修？`,
          ],
          n,
          [Math.floor((w * h + p * n) / p), p * n, n + h],
          [
            `The wages are ${w * h} dollars, which leaves ${p * n} for repairs at ${p} each.`,
            `工资是 ${w * h} 美元，剩下 ${p * n} 美元是维修报酬，每次 ${p} 美元。`,
          ],
        );
      },
    ),
  ],
};

/** deeperSchoolFundamentalsThirdPoints holds these third knowledge points, by topic in the school shard. */
export const deeperSchoolFundamentalsThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "scale-drawings-and-scale-factor": [
    skill(
      "the-scale-from-two-lengths",
      ["The scale from two lengths", "由两个长度求比例尺"],
      [
        "A scale tells how much real length one unit on the drawing stands for. So divide the real length by the drawn length to find it, keeping the units of each.",
        "比例尺表示图上一个单位代表多少实际长度。所以用实际长度除以图上长度，同时保留各自的单位。",
      ],
      (rng) => {
        const d = rng.int(2, 15);
        const u = rng.int(2, 25);
        return integer(
          [
            `A wall ${d * u} m long is drawn ${d} cm long on a plan. How many meters does 1 cm stand for?`,
            `长 ${d * u} 米的墙在图上画成 ${d} 厘米。1 厘米代表多少米？`,
          ],
          u,
          [d * u, d, u + d],
          [
            `Each of the ${d} cm stands for the same length, so $${d * u} \\div ${d} = ${u}$.`,
            `这 ${d} 厘米中每厘米代表相同的长度，所以 $${d * u} \\div ${d} = ${u}$。`,
          ],
        );
      },
    ),
  ],
  "two-way-frequency-tables": [
    skill(
      "a-fraction-within-a-category",
      ["A fraction within a category", "某一类中的比例"],
      [
        "A two-way table supports questions about one group alone. The whole is then the total of that group, not the total of the survey, so divide by the group's total.",
        "双向表可以回答关于某一组的问题。这时整体是这一组的合计，而不是调查的总数，所以要除以这一组的合计。",
      ],
      (rng) => {
        const a = rng.int(5, 40);
        const b = rng.int(5, 40);
        const c = rng.int(5, 40);
        const d = rng.int(5, 40);
        return fraction(
          [
            `In a survey, ${a} students play a sport and an instrument, ${b} play a sport but no instrument, ${c} play an instrument but no sport, and ${d} play neither. What fraction of the students who play a sport also play an instrument?`,
            `调查中，${a} 名学生既运动又演奏乐器，${b} 名运动但不演奏，${c} 名演奏但不运动，${d} 名两者都不做。运动的学生中，也演奏乐器的占几分之几？`,
          ],
          Q.of(a, a + b),
          [Q.of(a, a + c), Q.of(a, a + b + c + d), Q.of(b, a + b)],
          [
            `There are ${a + b} students who play a sport, and ${a} of them also play an instrument.`,
            `运动的学生有 ${a + b} 名，其中 ${a} 名也演奏乐器。`,
          ],
        );
      },
    ),
  ],
};
