// Knowledge points of Number Theory that ask the learner to read a drawing: lattice points, Gaussian integers in the
// plane, residue tables and tilings by squares. See `deeperFiguresNumberTheoryPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd, svgDocument } from "@ga/subject-math";
import { proofDrawings1 } from "../explanation-drawings-methods-of-proof-1.ts";
import { numberTheoryDrawings1 } from "../explanation-drawings-number-theory-1.ts";

import { say, withMistakes } from "../problems.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { drawn, label } from "./figure-reading-more.ts";
import { type Miss, until, worked } from "./number-theory-course.ts";

/** fig draws a plane figure with its description in both locales. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** linear writes $ax + by = c$ without a coefficient of one. */
function linear(a: number, b: number, c: number): string {
  const term = (k: number, name: string) => `${Math.abs(k) === 1 ? "" : Math.abs(k)}${name}`;
  return `${a < 0 ? "-" : ""}${term(a, "x")} ${b < 0 ? "-" : "+"} ${term(b, "y")} = ${c}`;
}

const lineThroughLatticePoints = point(
  "the-equation-of-a-line-through-lattice-points",
  ["The equation of a line through lattice points", "过格点的直线的方程"],
  [
    "The whole-number solutions of $ax + by = c$ are lattice points on a line. When $a$ and $b$ have no common factor, neighboring solutions differ by the step $(b, -a)$. So a drawing gives the coefficients from the step between neighboring marked points, and any one of the marked points then gives the value of $c$.\n\n> **Watch out.** The step $(b, -a)$ puts the coefficient of $y$ first: a step of $3$ across and $2$ down gives $2x + 3y$, not $3x + 2y$.",
    "$ax + by = c$ 的整数解是一条直线上的格点。当 $a$ 和 $b$ 没有公因数时，相邻的解相差步长 $(b, -a)$。所以图中相邻标记点之间的步长给出系数，任何一个标记点再给出 $c$ 的值。\n\n> **注意。** 步长 $(b, -a)$ 中先出现的是 $y$ 的系数：向右 $3$、向下 $2$ 的步长给出 $2x + 3y$，而不是 $3x + 2y$。",
  ],
  (rng) => {
    const [a, b] = rng.pick<Point>([
      [1, 2],
      [2, 1],
      [1, 3],
      [3, 1],
      [2, 3],
      [3, 2],
      [3, 4],
      [4, 3],
      [1, 4],
      [4, 1],
    ]);
    const [x0, y0] = [rng.int(1, 5), rng.int(1, 5)];
    const c = a * x0 + b * y0;
    const marks: PlaneMark[] = [{ kind: "line", a: [x0, y0], b: [x0 + b, y0 - a] }];
    for (let k = -5; k <= 5; k++) {
      const [x, y] = [x0 + k * b, y0 - k * a];
      if (x >= -3 && x <= 12 && y >= -3 && y <= 12) marks.push({ kind: "point", at: [x, y], accent: true });
    }
    const listed = marks.flatMap((m) => (m.kind === "point" ? [`(${m.at[0]}, ${m.at[1]})`] : [])).join(", ");
    const [x1, y1] = [x0 + b, y0 - a];
    const y1s = y1 < 0 ? `(${y1})` : `${y1}`;
    return reasoned(
      choose(
        rng,
        [
          "The marked points are neighboring whole-number solutions on the line. Which equation does the line have?",
          "标记的点是直线上相邻的整数解。这条直线的方程是什么？",
        ],
        same(linear(a, b, c)),
        [same(linear(b, a, c)), same(linear(a, -b, c)), same(linear(a, b, c + 1)), same(linear(a, b, c - 1))],
        [
          `**Step 1: Read the step.** Neighboring points differ by $(${b}, ${-a})$, so the coefficient of $x$ is $${a}$ and the coefficient of $y$ is $${b}$.\n\n**Step 2: Find $c$.** The point $(${x0}, ${y0})$ gives $c = ${a} \\cdot ${x0} + ${b} \\cdot ${y0} = ${c}$.\n\n**Check.** The next point $(${x1}, ${y1})$ gives $${a} \\cdot ${x1} + ${b} \\cdot ${y1s} = ${c}$ as well.`,
          `**第一步：读出步长。** 相邻的点相差 $(${b}, ${-a})$，所以 $x$ 的系数是 $${a}$，$y$ 的系数是 $${b}$。\n\n**第二步：求 $c$。** 点 $(${x0}, ${y0})$ 给出 $c = ${a} \\cdot ${x0} + ${b} \\cdot ${y0} = ${c}$。\n\n**检验。** 下一个点 $(${x1}, ${y1})$ 同样给出 $${a} \\cdot ${x1} + ${b} \\cdot ${y1s} = ${c}$。`,
        ],
        fig({ xMin: -3, xMax: 12, yMin: -3, yMax: 12, xName: "x", yName: "y" }, marks, [
          `A line through the marked lattice points ${listed}.`,
          `过标记格点 ${listed} 的直线。`,
        ]),
      ),
      [
        [
          `$${linear(b, a, c)}$`,
          "That swaps the coefficients: the step across belongs to $y$, the step down to $x$.",
          "这把系数交换了：横向步长对应 $y$，纵向步长对应 $x$。",
        ],
        [
          `$${linear(a, -b, c)}$`,
          "With opposite signs the line would rise to the right, but the points fall.",
          "系数异号时直线向右上升，但这些点是向右下降的。",
        ],
        [
          `$${linear(a, b, c + 1)}$`,
          `The marked point $(${x0}, ${y0})$ gives $${c}$, not $${c + 1}$.`,
          `标记点 $(${x0}, ${y0})$ 给出 $${c}$，而不是 $${c + 1}$。`,
        ],
        [
          `$${linear(a, b, c - 1)}$`,
          `The marked point $(${x0}, ${y0})$ gives $${c}$, not $${c - 1}$.`,
          `标记点 $(${x0}, ${y0})$ 给出 $${c}$，而不是 $${c - 1}$。`,
        ],
      ],
    );
  },
);

const circleThroughLatticePoint = {
  ...point(
    "the-sum-of-two-squares-on-a-circle",
    ["The sum of two squares on a circle", "圆上的两平方和"],
    [
      "Writing $n = a^2 + b^2$ means that the circle of radius $\\sqrt{n}$ around the origin passes through the lattice point $(a, b)$. So a lattice point on such a circle shows at once which number the circle stands for. Signs and the order of the coordinates do not change the sum, which is why these points come in symmetric groups. The circle of radius $\\sqrt{13}$ passes through $(2, 3)$, since $2^2 + 3^2 = 4 + 9 = 13$, so it stands for $13$.\n\nCheck: changing signs and swapping the coordinates gives the eight points $(\\pm 2, \\pm 3)$ and $(\\pm 3, \\pm 2)$, and each of them gives $4 + 9 = 13$.\n\n> **Watch out.** Square each coordinate before adding: $(2 + 3)^2 = 25$ is not $2^2 + 3^2$, and a negative coordinate squares to a positive number.",
      "写成 $n = a^2 + b^2$ 意味着以原点为中心、半径为 $\\sqrt{n}$ 的圆经过格点 $(a, b)$。所以这样的圆上的一个格点立即说明这个圆代表哪个数。符号和坐标的顺序不改变和，所以这些点成对称的组出现。半径为 $\\sqrt{13}$ 的圆经过 $(2, 3)$，因为 $2^2 + 3^2 = 4 + 9 = 13$，所以它代表 $13$。\n\n检验：改变符号和交换坐标得到八个点 $(\\pm 2, \\pm 3)$ 和 $(\\pm 3, \\pm 2)$，每一个都给出 $4 + 9 = 13$。\n\n> **注意。** 先把每个坐标平方再相加：$(2 + 3)^2 = 25$ 不等于 $2^2 + 3^2$，而负坐标的平方是正数。",
    ],
    (rng) => {
      const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
      const [sx, sy] = [rng.sign(), rng.sign()];
      const n = a * a + b * b;
      const big = Math.max(a, b);
      const misses: Miss[] = [
        [a + b, "That adds the coordinates without squaring them.", "那是把坐标直接相加，没有平方。"],
        [
          (a + b) * (a + b),
          `That squares the sum: $(${a} + ${b})^2$ also contains the cross term $2 \\cdot ${a} \\cdot ${b} = ${2 * a * b}$.`,
          `那是把和平方了：$(${a} + ${b})^2$ 还含有交叉项 $2 \\cdot ${a} \\cdot ${b} = ${2 * a * b}$。`,
        ],
        [
          big * big,
          `That squares only the larger coordinate, $${big}$; both coordinates count.`,
          `那只平方了较大的坐标 $${big}$；两个坐标都要算。`,
        ],
      ];
      return until(() =>
        worked(
          [
            "The circle around the origin passes through the marked lattice point. For which whole number $n$ is it the circle $x^2 + y^2 = n$?",
            "以原点为中心的圆经过标记的格点。它是哪个整数 $n$ 对应的圆 $x^2 + y^2 = n$？",
          ],
          n,
          misses,
          [
            [
              ["Read the point", "读出格点"],
              [`The marked point is $(${sx * a}, ${sy * b})$.`, `标记点是 $(${sx * a}, ${sy * b})$。`],
            ],
            [
              ["Square and add", "平方后相加"],
              [
                `$(${sx * a})^2 + (${sy * b})^2 = ${a * a} + ${b * b} = ${n}$.`,
                `$(${sx * a})^2 + (${sy * b})^2 = ${a * a} + ${b * b} = ${n}$。`,
              ],
            ],
          ],
          [
            `The circle crosses the $x$-axis at about $\\pm ${Math.sqrt(n).toFixed(2)}$, and $${Math.sqrt(n).toFixed(2)}^2 \\approx ${n}$, as the radius $\\sqrt{${n}}$ requires.`,
            `圆与 $x$ 轴大约交于 $\\pm ${Math.sqrt(n).toFixed(2)}$，而 $${Math.sqrt(n).toFixed(2)}^2 \\approx ${n}$，正符合半径 $\\sqrt{${n}}$。`,
          ],
          fig(
            { xMin: -9, xMax: 9, yMin: -9, yMax: 9, xName: "x", yName: "y" },
            [
              { kind: "circle", center: [0, 0], r: Math.sqrt(n) },
              { kind: "point", at: [sx * a, sy * b], accent: true },
            ],
            [
              `A circle around the origin through the lattice point (${sx * a}, ${sy * b}).`,
              `以原点为中心、过格点 (${sx * a}, ${sy * b}) 的圆。`,
            ],
          ),
        ),
      );
    },
  ),
  figure: numberTheoryDrawings1["sums-of-two-squares#the-sum-of-two-squares-on-a-circle"],
};

/** gaussian writes the Gaussian integer $x + yi$. */
function gaussian(x: number, y: number): string {
  if (y === 0) return String(x);
  const unit = `${Math.abs(y) === 1 ? "" : Math.abs(y)}i`;
  if (x === 0) return `${y < 0 ? "-" : ""}${unit}`;
  return `${x} ${y < 0 ? "-" : "+"} ${unit}`;
}

const gaussianQuotient = point(
  "a-gaussian-quotient-from-two-points",
  ["A Gaussian quotient from two points", "由两点读高斯整数的商"],
  [
    "A Gaussian integer $a + bi$ is a lattice point of the complex plane, and $\\alpha$ divides $\\beta$ when $\\beta$ equals $\\alpha$ times another Gaussian integer. To find that quotient, read both points from the drawing, multiply the top and the bottom by the conjugate of $\\alpha$, and then divide by the norm of $\\alpha$.",
    "高斯整数 $a + bi$ 是复平面上的格点，当 $\\beta$ 等于 $\\alpha$ 乘以另一个高斯整数时，$\\alpha$ 整除 $\\beta$。要求这个商，就从图中读出两个点，分子分母同乘 $\\alpha$ 的共轭，再除以 $\\alpha$ 的范数。",
  ],
  (rng) => {
    const [a, b] = [rng.int(1, 2) * rng.sign(), rng.int(1, 2) * rng.sign()];
    const [c, d] = [rng.int(1, 3) * rng.sign(), rng.int(1, 2) * rng.sign()];
    const [x, y] = [a * c - b * d, a * d + b * c];
    const reach = Math.max(5, Math.abs(x) + 1, Math.abs(y) + 1);
    return choose(
      rng,
      [
        "The points $\\alpha$ and $\\beta$ are Gaussian integers in the complex plane. What is $\\beta / \\alpha$?",
        "点 $\\alpha$ 和 $\\beta$ 是复平面上的高斯整数。$\\beta / \\alpha$ 是多少？",
      ],
      same(gaussian(c, d)),
      [same(gaussian(c, -d)), same(gaussian(-c, -d)), same(gaussian(-d, c)), same(gaussian(d, c)), same(gaussian(c + 1, d))],
      [
        `The drawing shows $\\alpha = ${gaussian(a, b)}$ and $\\beta = ${gaussian(x, y)}$. Multiplying back confirms it, since $(${gaussian(a, b)})(${gaussian(c, d)}) = ${gaussian(x, y)}$.`,
        `图中 $\\alpha = ${gaussian(a, b)}$，$\\beta = ${gaussian(x, y)}$。乘回去可以验证，因为 $(${gaussian(a, b)})(${gaussian(c, d)}) = ${gaussian(x, y)}$。`,
      ],
      fig(
        { xMin: -reach, xMax: reach, yMin: -reach, yMax: reach, labelEvery: reach > 7 ? 2 : 1, xName: "Re", yName: "Im" },
        [
          { kind: "point", at: [a, b], label: "α", dir: "ne", accent: true },
          { kind: "point", at: [x, y], label: "β", dir: "ne", accent: true },
        ],
        [`The complex plane with alpha at (${a}, ${b}) and beta at (${x}, ${y}).`, `复平面，alpha 在 (${a}, ${b})，beta 在 (${x}, ${y})。`],
      ),
    );
  },
);

const gaussianNorm = point(
  "the-norm-from-a-lattice-of-multiples",
  ["The norm from a lattice of multiples", "由倍数格读范数"],
  [
    "The multiples of a Gaussian integer $\\alpha$ form a tilted square lattice, because multiplying by $i$ turns $\\alpha$ by a quarter turn. Each cell of this lattice is a square with side $\\alpha$. So the area of a cell equals the norm $a^2 + b^2$, which is also the number of residue classes modulo $\\alpha$.",
    "高斯整数 $\\alpha$ 的倍数构成倾斜的正方形格，因为乘以 $i$ 把 $\\alpha$ 转四分之一圈。这个格的每个单元是以 $\\alpha$ 为边的正方形。所以单元的面积等于范数 $a^2 + b^2$，它也是模 $\\alpha$ 的剩余类的个数。",
  ],
  (rng) => {
    const [a, b] = [rng.int(1, 3) * rng.sign(), rng.int(1, 3) * rng.sign()];
    const norm = a * a + b * b;
    const marks: PlaneMark[] = [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [a, b],
          [a - b, a + b],
          [-b, a],
        ],
      },
    ];
    for (let m = -6; m <= 6; m++) {
      for (let n = -6; n <= 6; n++) {
        const [x, y] = [m * a - n * b, m * b + n * a];
        if (Math.abs(x) <= 8 && Math.abs(y) <= 8 && !(x === a && y === b)) marks.push({ kind: "point", at: [x, y] });
      }
    }
    marks.push({ kind: "point", at: [a, b], label: "α", dir: "ne", accent: true });
    return ask(
      [
        "The dots are the Gaussian integer multiples of $\\alpha$, and the shaded square is one cell of this lattice. What is the norm of $\\alpha$?",
        "这些点是 $\\alpha$ 的高斯整数倍，阴影正方形是这个格的一个单元。$\\alpha$ 的范数是多少？",
      ],
      norm,
      [Math.abs(a) + Math.abs(b), (Math.abs(a) + Math.abs(b)) ** 2, 2 * norm, norm + 1],
      [
        `The drawing shows $\\alpha = ${gaussian(a, b)}$, so its norm is $${a * a} + ${b * b} = ${norm}$, which is also the area of the shaded cell.`,
        `图中 $\\alpha = ${gaussian(a, b)}$，所以范数是 $${a * a} + ${b * b} = ${norm}$，它也是阴影单元的面积。`,
      ],
      fig({ xMin: -9, xMax: 9, yMin: -9, yMax: 9, xName: "Re", yName: "Im" }, marks, [
        `A tilted square lattice of multiples of alpha, which lies at (${a}, ${b}), with the cell at the origin shaded.`,
        `alpha 的倍数构成的倾斜正方形格，alpha 在 (${a}, ${b})，原点处的单元有阴影。`,
      ]),
    );
  },
);

const inverseInTable = point(
  "an-inverse-read-from-a-multiplication-table",
  ["An inverse read from a multiplication table", "由乘法表读逆元"],
  [
    "A multiplication table modulo $n$ shows every inverse at a glance. The inverse of $a$ is the number whose column meets the row of $a$ at the entry $1$. So one finds the $1$ in that row and reads the header of its column. A row without any $1$ belongs to a residue that has no inverse at all.\n\n> **Watch out.** The answer is a column header, not an entry of the table and not the row's own header. The entry $n - 1$ marks the column where the product is $-1$, not $1$.",
    "模 $n$ 的乘法表一眼显示所有的逆元。$a$ 的逆元是这样的数：它的列与 $a$ 的行相交处的元素是 $1$。所以在这一行中找到 $1$，再读它所在列的表头。没有 $1$ 的行属于没有逆元的剩余。\n\n> **注意。** 答案是列的表头，不是表中的元素，也不是这一行自己的表头。元素 $n - 1$ 所在的列使乘积为 $-1$，而不是 $1$。",
  ],
  (rng) => {
    const n = rng.pick([5, 7, 8, 9, 10, 11, 12]);
    const units = Array.from({ length: n - 2 }, (_, i) => i + 2).filter((v) => gcd(v, n) === 1);
    const a = rng.pick(units);
    const inverse = Array.from({ length: n - 1 }, (_, i) => i + 1).find((v) => (a * v) % n === 1) as number;
    const cell = 24;
    const [left, top] = [160 - (n * cell) / 2, 8];
    const center = (i: number) => [left + cell * i + cell / 2, top + cell * i + cell / 2] as const;
    let body = `<rect class="accent" fill="currentColor" fill-opacity="0.25" stroke="none" x="${left + cell}" y="${top + cell * a}" width="${cell * (n - 1)}" height="${cell}"/>`;
    body += `<line x1="${left}" y1="${top + cell}" x2="${left + n * cell}" y2="${top + cell}"/><line x1="${left + cell}" y1="${top}" x2="${left + cell}" y2="${top + n * cell}"/>`;
    for (let i = 1; i < n; i++) {
      const [x, y] = center(i);
      body += label(x, top + cell / 2 + 4, String(i)) + label(left + cell / 2, y + 4, String(i));
      for (let j = 1; j < n; j++) body += label(center(j)[0], y + 4, String((i * j) % n));
    }
    const row = Array.from({ length: n - 1 }, (_, j) => (a * (j + 1)) % n);
    const seen = new Set([String(inverse)]);
    const mistakes = [
      say(
        String(n - inverse),
        `In that column the row of $${a}$ shows $${n - 1}$, which is $-1$, not $1$.`,
        `在这一列中，$${a}$ 的行显示 $${n - 1}$，即 $-1$，而不是 $1$。`,
      ),
      say(
        String(a),
        "That is the header of the row; the inverse is the header of the column where the $1$ lies.",
        "这是行的表头；逆元是 $1$ 所在列的表头。",
      ),
      say(
        String((a * a) % n),
        `That is the entry in column $${a}$; read the header of the column holding $1$, not an entry.`,
        `这是第 $${a}$ 列的元素；要读出 $1$ 所在列的表头，而不是某个元素。`,
      ),
    ].filter((m) => !seen.has(m.response) && Boolean(seen.add(m.response)));
    return withMistakes(
      ask(
        [
          "The table shows products of nonzero residues modulo a whole number. What is the multiplicative inverse of the residue whose row is highlighted?",
          "表中是模某个整数的非零剩余的乘积。高亮行对应的剩余的乘法逆元是多少？",
        ],
        inverse,
        [n - inverse, a, (a * a) % n, (inverse % (n - 1)) + 1],
        [
          `**Step 1: Read the row.** The highlighted row belongs to $${a}$, and its entries are $${row.join(", ")}$.\n\n**Step 2: Find the 1.** The entry $1$ lies in the column headed $${inverse}$, so the inverse of $${a}$ modulo $${n}$ is $${inverse}$.\n\n**Check.** $${a} \\cdot ${inverse} = ${a * inverse} = ${n} \\cdot ${(a * inverse - 1) / n} + 1$, so $${a} \\cdot ${inverse} \\equiv 1 \\pmod{${n}}$.`,
          `**第一步：读出这一行。** 高亮行属于 $${a}$，它的元素是 $${row.join(", ")}$。\n\n**第二步：找到 1。** 元素 $1$ 在表头为 $${inverse}$ 的列，所以 $${a}$ 模 $${n}$ 的逆元是 $${inverse}$。\n\n**检验。** $${a} \\cdot ${inverse} = ${a * inverse} = ${n} \\cdot ${(a * inverse - 1) / n} + 1$，所以 $${a} \\cdot ${inverse} \\equiv 1 \\pmod{${n}}$。`,
        ],
        {
          svg: svgDocument(n * cell + 16, body),
          alt: t(`The multiplication table modulo ${n} with the row of ${a} highlighted.`, `模 ${n} 的乘法表，${a} 所在的行高亮。`),
        },
      ),
      mistakes,
    );
  },
);

/** squareTiling cuts a rectangle into largest squares, as the Euclidean algorithm does. */
function squareTiling(w: number, h: number): { x: number; y: number; side: number }[] {
  const out: { x: number; y: number; side: number }[] = [];
  let [x, y, restW, restH] = [0, 0, w, h];
  for (let i = 0; i < 40 && restW > 0 && restH > 0; i++) {
    if (restW >= restH) {
      out.push({ x, y, side: restH });
      x += restH;
      restW -= restH;
    } else {
      out.push({ x, y, side: restW });
      y += restW;
      restH -= restW;
    }
  }
  return out;
}

const euclidInSquares = {
  ...point(
    "the-euclidean-algorithm-as-a-tiling-by-squares",
    ["The Euclidean algorithm as a tiling by squares", "用正方形铺满表示欧几里得算法"],
    [
      "The Euclidean algorithm can be drawn on a rectangle. Cut off as many squares as fit along the long side, and then repeat with the leftover rectangle. The number of squares at each stage is a quotient of the algorithm. The final squares fill the last leftover exactly, and their side is the greatest common divisor of the two sides.\n\n> **Watch out.** The greatest common divisor is the side of the smallest squares, not the shorter side of the rectangle. The first quotient counts only the largest squares.",
      "欧几里得算法可以画在矩形上。沿长边切下尽可能多的正方形，再对剩下的矩形重复。每一阶段正方形的个数是算法的一个商。最后的正方形恰好填满最后剩下的部分，它们的边长是两条边的最大公因数。\n\n> **注意。** 最大公因数是最小正方形的边长，而不是矩形的短边。第一个商只数最大的正方形。",
    ],
    (rng) => {
      const [p, q] = rng.pick<Point>([
        [5, 2],
        [5, 3],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [8, 3],
        [8, 5],
        [9, 2],
        [9, 4],
        [9, 5],
        [9, 7],
        [11, 3],
        [11, 4],
      ]);
      const g = rng.int(2, 6);
      const [w, h] = [p * g, q * g];
      const scale = 270 / w;
      const asksGcd = rng.bool();
      let body = label(30 + 135, 16, String(w)) + label(16, 24 + (h * scale) / 2 + 4, String(h));
      for (const { x, y, side } of squareTiling(w, h)) {
        const accent = side === g ? 'class="accent" fill="currentColor" fill-opacity="0.25" stroke="currentColor"' : 'fill="none"';
        body += `<rect ${accent} x="${30 + x * scale}" y="${24 + y * scale}" width="${side * scale}" height="${side * scale}"/>`;
      }
      const quotient = Math.floor(w / h);
      const left = w - quotient * h;
      const lines: string[] = [];
      for (let x = w, y = h; y !== 0; [x, y] = [y, x % y]) lines.push(`$$${x} = ${y} \\cdot ${Math.floor(x / y)} + ${x % y}$$`);
      const answer = asksGcd ? g : quotient;
      const mistakes = (
        asksGcd
          ? [
              say(String(h), "That is the shorter side, the side of the largest squares.", "这是短边，即最大的正方形的边长。"),
              say(String(w - h), "That is the leftover after one square is cut.", "这是切下一个正方形后剩下的边。"),
            ]
          : [
              say(
                String(quotient + 1),
                `That many squares of side $${h}$ would need $${(quotient + 1) * h}$, more than $${w}$.`,
                `这么多边长为 $${h}$ 的正方形需要 $${(quotient + 1) * h}$，超过了 $${w}$。`,
              ),
              say(String(h), "That is the side of the largest squares, not how many fit.", "这是最大的正方形的边长，而不是能放下的个数。"),
            ]
      ).filter((m) => m.response !== String(answer));
      return withMistakes(
        ask(
          asksGcd
            ? [
                "The rectangle is cut into squares by the Euclidean algorithm, with its sides labeled. What is the greatest common divisor of the two sides?",
                "矩形按欧几里得算法切成正方形，边长已标出。两条边的最大公因数是多少？",
              ]
            : [
                "The rectangle is cut into squares by the Euclidean algorithm, with its sides labeled. What is the first quotient of the algorithm on the two sides?",
                "矩形按欧几里得算法切成正方形，边长已标出。对这两条边做算法时，第一个商是多少？",
              ],
          answer,
          asksGcd ? [h, w - h, 2 * g, g + 1] : [quotient + 1, q, p, h],
          asksGcd
            ? [
                `**Step 1: Follow the cuts.** Each stage is one division:\n\n${lines.join("\n\n")}\n\n**Step 2: Read the last squares.** The shaded squares are the last ones cut and fill the leftover exactly, so the greatest common divisor is their side, $${g}$.\n\n**Check.** $${g}$ divides both sides: $${w} = ${g} \\cdot ${p}$ and $${h} = ${g} \\cdot ${q}$.`,
                `**第一步：跟着切法走。** 每个阶段是一次除法：\n\n${lines.join("\n\n")}\n\n**第二步：读出最后的正方形。** 阴影正方形是最后切下的，恰好填满剩下的部分，所以最大公因数是它们的边长 $${g}$。\n\n**检验。** $${g}$ 整除两条边：$${w} = ${g} \\cdot ${p}$，$${h} = ${g} \\cdot ${q}$。`,
              ]
            : [
                `**Step 1: Find the largest squares.** The largest squares have side $${h}$, the shorter side.\n\n**Step 2: Count them.** ${quotient === 1 ? "Only one fits" : `$${quotient}$ of them fit`} along the side of length $${w}$, so the first division is $${w} = ${quotient} \\cdot ${h} + ${left}$ and the first quotient is $${quotient}$.\n\n**Check.** The leftover $${left}$ is less than $${h}$, so no further square of side $${h}$ fits.`,
                `**第一步：找出最大的正方形。** 最大的正方形边长为 $${h}$，即短边。\n\n**第二步：数一数。** 长度为 $${w}$ 的边上能放 $${quotient}$ 个，所以第一步除法是 $${w} = ${quotient} \\cdot ${h} + ${left}$，第一个商是 $${quotient}$。\n\n**检验。** 剩下的 $${left}$ 小于 $${h}$，所以再也放不下边长为 $${h}$ 的正方形。`,
              ],
          {
            svg: svgDocument(Math.ceil(h * scale) + 36, body),
            alt: t(
              `A rectangle with sides ${w} and ${h} cut into squares; the smallest squares, of side ${g}, are shaded.`,
              `边长为 ${w} 和 ${h} 的矩形切成正方形；最小的正方形边长为 ${g}，有阴影。`,
            ),
          },
        ),
        mistakes,
      );
    },
  ),
  figure: proofDrawings1["the-euclidean-algorithm#the-euclidean-algorithm-as-a-tiling-by-squares"],
};

const congruenceInRows = point(
  "a-congruence-read-from-rows-of-integers",
  ["A congruence read from rows of integers", "由整数排成的行读同余"],
  [
    "Writing the integers in rows of length $n$ sorts them by their remainder modulo $n$. Two numbers are congruent modulo $n$ exactly when they fall in the same column, since moving down one row adds $n$. So the row length is the modulus, and the first row lists the remainders from zero up to one less than the modulus.\n\n> **Watch out.** The column gives the remainder and the row gives the quotient. Columns start at remainder $0$, not $1$.",
    "把整数写成长度为 $n$ 的行，就按模 $n$ 的余数把它们分类。两个数模 $n$ 同余恰好当它们在同一列，因为向下移动一行就加上 $n$。所以行长就是模，第一行列出从零到模减一的余数。\n\n> **注意。** 列给出余数，行给出商。列从余数 $0$ 开始，而不是从 $1$ 开始。",
  ],
  (rng) => {
    const n = rng.int(5, 10);
    const rows = rng.int(3, 5);
    const value = rng.int(0, n * rows - 1);
    const remainder = value % n;
    const quotient = Math.floor(value / n);
    const cell = 30;
    const left = 160 - (n * cell) / 2;
    let body = `<rect class="accent" fill="currentColor" fill-opacity="0.3" stroke="none" x="${left + (value % n) * cell}" y="${8 + Math.floor(value / n) * cell}" width="${cell}" height="${cell}"/>`;
    for (let i = 0; i < n * rows; i++) {
      const [x, y] = [left + (i % n) * cell, 8 + Math.floor(i / n) * cell];
      body += `<rect fill="none" x="${x}" y="${y}" width="${cell}" height="${cell}"/>${label(x + cell / 2, y + cell / 2 + 4, String(i))}`;
    }
    const svg = {
      svg: svgDocument(rows * cell + 16, body),
      alt: t(`The integers from 0 written in rows of ${n}, with ${value} highlighted.`, `从 0 开始的整数，每行 ${n} 个，${value} 高亮。`),
    };
    if (rng.bool()) {
      const back = n - remainder === remainder ? n - 1 : n - remainder;
      const seen = new Set([String(remainder)]);
      const mistakes = [
        say(
          String(quotient),
          "That is the row the number sits in, which counts the quotient; the column gives the remainder.",
          "这是数所在的行，数的是商；列才给出余数。",
        ),
        say(
          String((remainder + 1) % n),
          "That counts the columns from $1$; the first column holds remainder $0$.",
          "这是从 $1$ 开始数列；第一列的余数是 $0$。",
        ),
        say(String(back), "That counts the columns from the right-hand end of the row.", "这是从行的右端开始数列。"),
        say(
          String(value % (n + 1)),
          `That divides by $${n + 1}$; each row has $${n}$ numbers.`,
          `这是除以 $${n + 1}$；每行只有 $${n}$ 个数。`,
        ),
      ].filter((m) => !seen.has(m.response) && Boolean(seen.add(m.response)));
      return withMistakes(
        ask(
          [
            "The integers are written in rows of equal length, which is the modulus. What is the remainder of the highlighted number?",
            "整数写成等长的行，行长就是模。高亮的数的余数是多少？",
          ],
          remainder,
          [quotient, (remainder + 1) % n, back, value % (n + 1)],
          [
            `**Step 1: Read the modulus.** Each row has $${n}$ numbers, so the modulus is $${n}$.\n\n**Step 2: Read the column.** The highlighted $${value}$ is in the column headed by $${remainder}$, so its remainder modulo $${n}$ is $${remainder}$.\n\n**Check.** $${value} = ${n} \\cdot ${quotient} + ${remainder}$: the quotient $${quotient}$ counts the rows above it, and $0 \\le ${remainder} < ${n}$.`,
            `**第一步：读出模。** 每行有 $${n}$ 个数，所以模是 $${n}$。\n\n**第二步：读出列。** 高亮的 $${value}$ 在以 $${remainder}$ 开头的列，所以它模 $${n}$ 的余数是 $${remainder}$。\n\n**检验。** $${value} = ${n} \\cdot ${quotient} + ${remainder}$：商 $${quotient}$ 是它上面的行数，且 $0 \\le ${remainder} < ${n}$。`,
          ],
          svg,
        ),
        mistakes,
      );
    }
    const k = rng.int(4, 9);
    const answer = value + k * n;
    const offsets = rng.sample(
      Array.from({ length: n - 1 }, (_, i) => i + 1),
      3,
    );
    const problem = choose(
      rng,
      [
        "The integers are written in rows of equal length, which is the modulus. Which number is congruent to the highlighted one?",
        "整数写成等长的行，行长就是模。哪个数与高亮的数同余？",
      ],
      same(String(answer)),
      offsets.map((d) => same(String(answer + d))),
      [
        `**Step 1: Read the modulus.** Each row has $${n}$ numbers, so the modulus is $${n}$, and the highlighted $${value}$ has remainder $${remainder}$.\n\n**Step 2: Compare the remainders.** $${answer} = ${n} \\cdot ${Math.floor(answer / n)} + ${remainder}$ has the same remainder, so it falls in the same column.\n\n**Check.** $${answer} - ${value} = ${k * n} = ${n} \\cdot ${k}$, a multiple of $${n}$.`,
        `**第一步：读出模。** 每行有 $${n}$ 个数，所以模是 $${n}$，高亮的 $${value}$ 余数是 $${remainder}$。\n\n**第二步：比较余数。** $${answer} = ${n} \\cdot ${Math.floor(answer / n)} + ${remainder}$ 的余数相同，所以它在同一列。\n\n**检验。** $${answer} - ${value} = ${k * n} = ${n} \\cdot ${k}$，是 $${n}$ 的倍数。`,
      ],
      svg,
    );
    return reasoned(
      problem,
      offsets.map((d) => [
        `$${answer + d}$`,
        `$${answer + d} - ${value} = ${answer + d - value}$, which is not a multiple of $${n}$: it has remainder $${(remainder + d) % n}$, not $${remainder}$.`,
        `$${answer + d} - ${value} = ${answer + d - value}$，不是 $${n}$ 的倍数：它的余数是 $${(remainder + d) % n}$，而不是 $${remainder}$。`,
      ]),
    );
  },
);

/** deeperFiguresNumberTheoryPoints adds knowledge points of Number Theory that are answered by reading a drawing. */
export const deeperFiguresNumberTheoryPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "linear-diophantine-equations": [lineThroughLatticePoints],
  "sums-of-two-squares": [circleThroughLatticePoint],
  "gaussian-integers": [gaussianQuotient, gaussianNorm],
  "multiplicative-inverses-modulo-n": [inverseInTable],
  "the-euclidean-algorithm": [euclidInSquares],
  "modular-congruence": [congruenceInRows],
};
