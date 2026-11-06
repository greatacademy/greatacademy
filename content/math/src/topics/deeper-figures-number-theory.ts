// Knowledge points of Number Theory that ask the learner to read a drawing: lattice points, Gaussian integers in the
// plane, residue tables and tilings by squares. See `deeperFiguresNumberTheoryPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd, svgDocument } from "@ga/subject-math";
import { proofDrawings1 } from "../explanation-drawings-methods-of-proof-1.ts";
import { numberTheoryDrawings1 } from "../explanation-drawings-number-theory-1.ts";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { drawn, label } from "./figure-reading-more.ts";

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
    "The whole-number solutions of $ax + by = c$ are lattice points on a line. When $a$ and $b$ have no common factor, neighboring solutions differ by the step $(b, -a)$. So a drawing gives the coefficients from the step between neighboring marked points, and any one of the marked points then gives the value of $c$.",
    "$ax + by = c$ 的整数解是一条直线上的格点。当 $a$ 和 $b$ 没有公因数时，相邻的解相差步长 $(b, -a)$。所以图中相邻标记点之间的步长给出系数，任何一个标记点再给出 $c$ 的值。",
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
    return choose(
      rng,
      [
        "The marked points are neighboring whole-number solutions on the line. Which equation does the line have?",
        "标记的点是直线上相邻的整数解。这条直线的方程是什么？",
      ],
      same(linear(a, b, c)),
      [same(linear(b, a, c)), same(linear(a, -b, c)), same(linear(a, b, c + 1)), same(linear(a, b, c - 1))],
      [
        `Neighboring points differ by the step $(${b}, ${-a})$, so the coefficients of $x$ and $y$ are $${a}$ and $${b}$. The point $(${x0}, ${y0})$ then gives $c = ${c}$.`,
        `相邻的点相差步长 $(${b}, ${-a})$，所以 $x$ 和 $y$ 的系数是 $${a}$ 和 $${b}$。点 $(${x0}, ${y0})$ 再给出 $c = ${c}$。`,
      ],
      fig({ xMin: -3, xMax: 12, yMin: -3, yMax: 12, xName: "x", yName: "y" }, marks, [
        `A line through the marked lattice points ${listed}.`,
        `过标记格点 ${listed} 的直线。`,
      ]),
    );
  },
);

const circleThroughLatticePoint = {
  ...point(
    "the-sum-of-two-squares-on-a-circle",
    ["The sum of two squares on a circle", "圆上的两平方和"],
    [
      "Writing $n = a^2 + b^2$ means that the circle of radius $\\sqrt{n}$ around the origin passes through the lattice point $(a, b)$. So a lattice point on such a circle shows at once which number the circle stands for. Signs and the order of the coordinates do not change the sum, which is why these points come in symmetric groups.",
      "写成 $n = a^2 + b^2$ 意味着以原点为中心、半径为 $\\sqrt{n}$ 的圆经过格点 $(a, b)$。所以这样的圆上的一个格点立即说明这个圆代表哪个数。符号和坐标的顺序不改变和，所以这些点成对称的组出现。",
    ],
    (rng) => {
      const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
      const [sx, sy] = [rng.sign(), rng.sign()];
      const n = a * a + b * b;
      return ask(
        [
          "The circle around the origin passes through the marked lattice point. For which whole number $n$ is it the circle $x^2 + y^2 = n$?",
          "以原点为中心的圆经过标记的格点。它是哪个整数 $n$ 对应的圆 $x^2 + y^2 = n$？",
        ],
        n,
        [a + b, (a + b) * (a + b), n + 1, Math.max(a, b) * Math.max(a, b)],
        [
          `The marked point has coordinates $(${sx * a}, ${sy * b})$, and the point lies on the circle, so $n = ${a}^2 + ${b}^2 = ${n}$.`,
          `标记点的坐标是 $(${sx * a}, ${sy * b})$，它在圆上，所以 $n = ${a}^2 + ${b}^2 = ${n}$。`,
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
    "A multiplication table modulo $n$ shows every inverse at a glance. The inverse of $a$ is the number whose column meets the row of $a$ at the entry $1$. So one finds the $1$ in that row and reads the header of its column. A row without any $1$ belongs to a residue that has no inverse at all.",
    "模 $n$ 的乘法表一眼显示所有的逆元。$a$ 的逆元是这样的数：它的列与 $a$ 的行相交处的元素是 $1$。所以在这一行中找到 $1$，再读它所在列的表头。没有 $1$ 的行属于没有逆元的剩余。",
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
    return ask(
      [
        "The table shows products of nonzero residues modulo a whole number. What is the multiplicative inverse of the residue whose row is highlighted?",
        "表中是模某个整数的非零剩余的乘积。高亮行对应的剩余的乘法逆元是多少？",
      ],
      inverse,
      [n - inverse, a, (a * a) % n, (inverse % (n - 1)) + 1],
      [
        `The highlighted row belongs to $${a}$, and its entry $1$ lies in the column headed $${inverse}$, so $${a} \\cdot ${inverse} \\equiv 1 \\pmod{${n}}$.`,
        `高亮行属于 $${a}$，它的元素 $1$ 在表头为 $${inverse}$ 的列，所以 $${a} \\cdot ${inverse} \\equiv 1 \\pmod{${n}}$。`,
      ],
      {
        svg: svgDocument(n * cell + 16, body),
        alt: t(`The multiplication table modulo ${n} with the row of ${a} highlighted.`, `模 ${n} 的乘法表，${a} 所在的行高亮。`),
      },
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
      "The Euclidean algorithm can be drawn on a rectangle. Cut off as many squares as fit along the long side, and then repeat with the leftover rectangle. The number of squares at each stage is a quotient of the algorithm. The final squares fill the last leftover exactly, and their side is the greatest common divisor of the two sides.",
      "欧几里得算法可以画在矩形上。沿长边切下尽可能多的正方形，再对剩下的矩形重复。每一阶段正方形的个数是算法的一个商。最后的正方形恰好填满最后剩下的部分，它们的边长是两条边的最大公因数。",
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
      return ask(
        asksGcd
          ? [
              "The rectangle is cut into squares by the Euclidean algorithm, with its sides labeled. What is the greatest common divisor of the two sides?",
              "矩形按欧几里得算法切成正方形，边长已标出。两条边的最大公因数是多少？",
            ]
          : [
              "The rectangle is cut into squares by the Euclidean algorithm, with its sides labeled. What is the first quotient of the algorithm on the two sides?",
              "矩形按欧几里得算法切成正方形，边长已标出。对这两条边做算法时，第一个商是多少？",
            ],
        asksGcd ? g : quotient,
        asksGcd ? [h, w - h, 2 * g, g + 1] : [quotient + 1, q, p, h],
        asksGcd
          ? [
              `The shaded squares are the last ones cut, and they fill the leftover exactly. There are $${w / g}$ of their sides along the top, which has length $${w}$, so their side is $${g}$.`,
              `阴影正方形是最后切下的，它们恰好填满剩下的部分。上边长度为 $${w}$，相当于 $${w / g}$ 个边长，所以边长是 $${g}$。`,
            ]
          : [
              `The largest squares have side $${h}$, and $${quotient}$ of them fit along the side of length $${w}$. So the first division is $${w} = ${quotient} \\cdot ${h} + ${w - quotient * h}$.`,
              `最大的正方形边长为 $${h}$，长度为 $${w}$ 的边上能放 $${quotient}$ 个。所以第一步除法是 $${w} = ${quotient} \\cdot ${h} + ${w - quotient * h}$。`,
            ],
        {
          svg: svgDocument(Math.ceil(h * scale) + 36, body),
          alt: t(
            `A rectangle with sides ${w} and ${h} cut into squares; the smallest squares, of side ${g}, are shaded.`,
            `边长为 ${w} 和 ${h} 的矩形切成正方形；最小的正方形边长为 ${g}，有阴影。`,
          ),
        },
      );
    },
  ),
  figure: proofDrawings1["the-euclidean-algorithm#the-euclidean-algorithm-as-a-tiling-by-squares"],
};

const congruenceInRows = point(
  "a-congruence-read-from-rows-of-integers",
  ["A congruence read from rows of integers", "由整数排成的行读同余"],
  [
    "Writing the integers in rows of length $n$ sorts them by their remainder modulo $n$. Two numbers are congruent modulo $n$ exactly when they fall in the same column, since moving down one row adds $n$. So the row length is the modulus, and the first row lists the remainders from zero up to one less than the modulus.",
    "把整数写成长度为 $n$ 的行，就按模 $n$ 的余数把它们分类。两个数模 $n$ 同余恰好当它们在同一列，因为向下移动一行就加上 $n$。所以行长就是模，第一行列出从零到模减一的余数。",
  ],
  (rng) => {
    const n = rng.int(5, 10);
    const rows = rng.int(3, 5);
    const value = rng.int(0, n * rows - 1);
    const remainder = value % n;
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
      return ask(
        [
          "The integers are written in rows of equal length, which is the modulus. What is the remainder of the highlighted number?",
          "整数写成等长的行，行长就是模。高亮的数的余数是多少？",
        ],
        remainder,
        [Math.floor(value / n), (remainder + 1) % n, n - remainder === remainder ? n - 1 : n - remainder, value % (n + 1)],
        [
          `Each row has $${n}$ numbers, and the highlighted $${value}$ is in the column headed by $${remainder}$, so its remainder modulo $${n}$ is $${remainder}$.`,
          `每行有 $${n}$ 个数，高亮的 $${value}$ 在以 $${remainder}$ 开头的列，所以它模 $${n}$ 的余数是 $${remainder}$。`,
        ],
        svg,
      );
    }
    const answer = value + rng.int(4, 9) * n;
    const offsets = rng.sample(
      Array.from({ length: n - 1 }, (_, i) => i + 1),
      3,
    );
    return choose(
      rng,
      [
        "The integers are written in rows of equal length, which is the modulus. Which number is congruent to the highlighted one?",
        "整数写成等长的行，行长就是模。哪个数与高亮的数同余？",
      ],
      same(String(answer)),
      offsets.map((d) => same(String(answer + d))),
      [
        `Each row has $${n}$ numbers, so the modulus is $${n}$. The highlighted $${value}$ has remainder $${remainder}$, and so does $${answer}$, because the difference is a multiple of $${n}$.`,
        `每行有 $${n}$ 个数，所以模是 $${n}$。高亮的 $${value}$ 余数是 $${remainder}$，$${answer}$ 也是，因为差是 $${n}$ 的倍数。`,
      ],
      svg,
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
