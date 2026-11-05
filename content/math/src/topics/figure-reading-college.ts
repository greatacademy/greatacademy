// Knowledge points that ask a learner to read a drawing, for Number Theory, Real Analysis
// and Partial Differential Equations. See `collegeFigurePoints`.

import type { Figure, KnowledgePointDef, Text } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";

import { arrowLine, drawn, label, node, numeric, pickChoice, ring } from "./figure-reading-more.ts";

/** math writes the same formula as an option in both languages. */
const math = (latex: string): Text => t(`$${latex}$`, `$${latex}$`);

/** isPrime tests a small whole number by trial division. */
function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** tent is the path of a tent with its peak above center, flat at zero across the view. */
const tent = (center: number, halfWidth: number, height: number, xMin: number, xMax: number): Point[] => [
  [xMin, 0],
  [center - halfWidth, 0],
  [center, height],
  [center + halfWidth, 0],
  [xMax, 0],
];

/** ringed draws an accent ring around a node to pick it out. */
const ringed = ([x, y]: Point) => `<circle class="accent" cx="${x}" cy="${y}" r="16" stroke-width="2.5"/>`;

/** grid draws a table of text cells with row and column headings; the cell holding "?" is the one asked about. */
function grid(rowHeads: readonly string[], columnHeads: readonly string[], cells: readonly (readonly string[])[], alt: Text): Figure {
  const [w, h] = [Math.min(40, 280 / (columnHeads.length + 1)), 30];
  const left = 160 - ((columnHeads.length + 1) * w) / 2;
  const parts: string[] = [];
  for (let i = 0; i <= columnHeads.length + 1; i++) {
    const weight = i === 1 ? ' stroke-width="2"' : ' stroke-width="0.8"';
    parts.push(`<line x1="${left + i * w}" y1="6" x2="${left + i * w}" y2="${6 + (rowHeads.length + 1) * h}"${weight}/>`);
  }
  for (let i = 0; i <= rowHeads.length + 1; i++) {
    const weight = i === 1 ? ' stroke-width="2"' : ' stroke-width="0.8"';
    parts.push(`<line x1="${left}" y1="${6 + i * h}" x2="${left + (columnHeads.length + 1) * w}" y2="${6 + i * h}"${weight}/>`);
  }
  columnHeads.forEach((head, j) => {
    parts.push(label(left + (j + 1.5) * w, 6 + 0.5 * h + 4, head));
  });
  rowHeads.forEach((head, i) => {
    parts.push(label(left + 0.5 * w, 6 + (i + 1.5) * h + 4, head));
  });
  cells.forEach((row, i) => {
    row.forEach((cell, j) => {
      const [x, y] = [left + (j + 1.5) * w, 6 + (i + 1.5) * h + 4];
      if (cell === "?") parts.push(`<circle class="accent" cx="${x}" cy="${y - 4}" r="11" stroke-width="2"/>`);
      parts.push(label(x, y, cell));
    });
  });
  return { svg: svgDocument(12 + (rowHeads.length + 1) * h, parts.join("")), alt };
}

// ---------------------------------------------------------------------------
// Number Theory
// ---------------------------------------------------------------------------

const sieveLeftover: KnowledgePointDef = {
  id: "reading-a-partly-finished-sieve",
  title: t("Reading a partly finished sieve", "读未完成的筛表"),
  explanation: t(
    "A number that survives the crossing out of the multiples of 2, 3 and 5 is not yet proved prime. It has no factor among those three, but it may still be a product of larger primes, such as $7 \\times 7$ or $7 \\times 11$. The sieve only finishes once it has used every prime up to the square root of the largest number in the table.",
    "划掉 2、3、5 的倍数后留下的数，还不能说一定是质数。它没有这三个因数，却可能是更大质数的积，比如 $7 \\times 7$ 或 $7 \\times 11$。只有用完不超过表中最大数平方根的所有质数，筛法才算结束。",
  ),
  generate(rng) {
    const start = rng.int(21, 150);
    const numbers = Array.from({ length: 30 }, (_, i) => start + i);
    const crossed = (n: number) => n % 2 === 0 || n % 3 === 0 || n % 5 === 0;
    const standing = numbers.filter((n) => !crossed(n));
    const answer = rng.pick(standing.filter((n) => !isPrime(n)));
    const factor = [7, 11, 13].find((p) => answer % p === 0) as number;
    const cells = numbers.map((n, i) => {
      const [x, y] = [50 + (i % 6) * 44, 20 + Math.floor(i / 6) * 28];
      const strike = crossed(n) ? `<line x1="${x - 15}" y1="${y + 5}" x2="${x + 15}" y2="${y - 9}" stroke-width="1"/>` : "";
      return label(x, y, String(n)) + strike;
    });
    return pickChoice(
      rng,
      t(
        "In this stretch of a sieve, every multiple of 2, 3 and 5 has been crossed out. Which number still standing is not prime?",
        "在筛表的这一段里，2、3、5 的倍数都已划掉。还留着的数中，哪一个不是质数？",
      ),
      math(String(answer)),
      rng.sample(standing.filter(isPrime), 3).map((n) => math(String(n))),
      t(
        `$${answer} = ${factor} \\times ${answer / factor}$. Its smallest prime factor is ${factor}, which is larger than 5, so the sieve has not reached it yet. The other options have no factor other than 1 and themselves.`,
        `$${answer} = ${factor} \\times ${answer / factor}$。它最小的质因数是 ${factor}，比 5 大，所以筛法还没有筛到它。其他选项除了 1 和自身没有别的因数。`,
      ),
      {
        svg: svgDocument(156, cells.join("")),
        alt: t(
          `A table of the whole numbers from ${start} to ${start + 29}, with the multiples of 2, 3 and 5 struck through.`,
          `从 ${start} 到 ${start + 29} 的整数表，2、3、5 的倍数都被划去。`,
        ),
      },
    );
  },
};

const residueClock: KnowledgePointDef = {
  id: "walking-around-a-residue-clock",
  title: t("Walking around a residue clock", "在余数钟面上走"),
  explanation: t(
    "The residues modulo $n$ sit on a circle, because adding $n$ brings you back to where you started. Each full turn of $n$ steps changes nothing, so only the remainder of the step count matters. Moving backward works the same way: the walk simply runs the other way around the clock.",
    "模 $n$ 的余数排在一个圆上，因为加上 $n$ 就回到原处。每走满 $n$ 步一整圈，位置不变，所以只有步数除以 $n$ 的余数起作用。往回走也一样，只是沿钟面反方向走。",
  ),
  generate(rng) {
    const n = rng.int(5, 12);
    const start = rng.int(0, n - 1);
    const steps = rng.int(n + 1, 4 * n);
    const clockwise = rng.bool();
    const answer = (((start + (clockwise ? steps : -steps)) % n) + n) % n;
    const other = (((start + (clockwise ? -steps : steps)) % n) + n) % n;
    const at = ring(n, 85);
    const names = Array.from({ length: n }, (_, i) => String(i));
    return numeric(
      t(
        `The clock shows the residues modulo $${n}$. Start at the ringed ${start} and move ${steps} steps ${clockwise ? "clockwise" : "counterclockwise"}. Which residue do you reach?`,
        `钟面上是模 $${n}$ 的余数。从带圈的 ${start} 出发，沿${clockwise ? "顺" : "逆"}时针走 ${steps} 步。走到哪个余数？`,
      ),
      answer,
      [other, steps % n, start + steps, (answer + 1) % n],
      t(
        `${steps} steps is ${Math.floor(steps / n)} full ${steps < 2 * n ? "turn" : "turns"} and ${steps % n} more, and full turns change nothing. So only the last ${steps % n} of the steps matter, going ${clockwise ? "clockwise" : "counterclockwise"} from ${start}, which ends at ${answer}.`,
        `${steps} 步是 ${Math.floor(steps / n)} 整圈再加 ${steps % n} 步，整圈不改变位置。所以从 ${start} 沿${clockwise ? "顺" : "逆"}时针走 ${steps % n} 步，走到 ${answer}。`,
      ),
      {
        svg: svgDocument(220, ringed(at[start] as Point) + names.map((name, i) => node(at[i] as Point, name)).join("")),
        alt: t(
          `The residues from 0 to ${n - 1} evenly spaced clockwise on a circle, with ${start} ringed.`,
          `0 到 ${n - 1} 的余数沿顺时针均匀排在圆上，${start} 带圈。`,
        ),
      },
      "integer",
    );
  },
};

const orderFromCycle: KnowledgePointDef = {
  id: "the-order-from-a-cycle-of-arrows",
  title: t("The order from a cycle of arrows", "由箭头环读阶"),
  explanation: t(
    "Repeated multiplication by $a$ modulo a prime walks through residues and eventually returns to 1. The order of $a$ is the number of steps in that closed walk. It counts arrows, not the size of the whole number system, and it always divides $p - 1$, which is a quick check on the count.",
    "模质数反复乘 $a$，会依次走过一些余数，最后回到 1。$a$ 的阶就是这条闭合路线的步数。要数的是箭头，不是整个余数系的大小，而且阶总能整除 $p - 1$，可以用来快速检验。",
  ),
  generate(rng) {
    const p = rng.pick([7, 11, 13, 17]);
    const a = rng.int(2, p - 2);
    const orbit = [1];
    while (((orbit.at(-1) as number) * a) % p !== 1) orbit.push(((orbit.at(-1) as number) * a) % p);
    const order = orbit.length;
    const at = ring(p - 1, 85);
    const names = Array.from({ length: p - 1 }, (_, i) => String(i + 1));
    const arrows = orbit.map((x, i) => arrowLine(at[x - 1] as Point, at[(orbit[(i + 1) % order] as number) - 1] as Point));
    return numeric(
      t(
        `The arrows show repeated multiplication by ${a} modulo ${p}, starting at 1. What is the order of ${a} modulo ${p}?`,
        `箭头表示从 1 出发，模 ${p} 反复乘 ${a}。${a} 模 ${p} 的阶是多少？`,
      ),
      order,
      [p - 1, order + 1, order - 1, a],
      t(
        `The walk goes ${[...orbit, 1].join(", ")}. It first returns to 1 after ${order} arrows, so $${a}^{${order}} \\equiv 1 \\pmod{${p}}$ and no smaller power does.`,
        `路线是 ${[...orbit, 1].join("、")}。走过 ${order} 个箭头后第一次回到 1，所以 $${a}^{${order}} \\equiv 1 \\pmod{${p}}$，更小的乘方都不行。`,
      ),
      {
        svg: svgDocument(220, arrows.join("") + names.map((name, i) => node(at[i] as Point, name)).join("")),
        alt: t(
          `The residues from 1 to ${p - 1} on a circle, with a closed walk of arrows through ${order} of them.`,
          `1 到 ${p - 1} 的余数排在圆上，箭头构成经过其中 ${order} 个数的闭合路线。`,
        ),
      },
      "integer",
    );
  },
};

const remainderTable: KnowledgePointDef = {
  id: "filling-a-remainder-table",
  title: t("Filling a remainder table", "填余数表"),
  explanation: t(
    "Give each number a row by its remainder on one modulus and a column by its remainder on the other. Counting 0, 1, 2, and so on walks diagonally through the table, wrapping at the edges. When the moduli are coprime the walk meets every cell exactly once, which is the Chinese Remainder Theorem seen as a picture.",
    "按一个模的余数给每个数定行，按另一个模的余数定列。从 0、1、2 依次数下去，就沿对角线走过表格，到边上再绕回来。两个模互质时，这条路线每格恰好经过一次，这就是中国剩余定理的图像。",
  ),
  generate(rng) {
    const [m, n] = rng.pick([
      [3, 4],
      [3, 5],
      [4, 5],
      [2, 5],
      [2, 7],
      [3, 7],
      [4, 3],
      [5, 3],
    ] as const);
    const placed = rng.int(Math.floor((m * n) / 3), Math.floor((m * n) / 2));
    const answer = rng.int(placed + 1, m * n - 1);
    const cells = Array.from({ length: m }, (_, r) =>
      Array.from({ length: n }, (_, c) => {
        const x = Array.from({ length: m * n }, (_, v) => v).find((v) => v % m === r && v % n === c) as number;
        if (x === answer) return "?";
        return x <= placed ? String(x) : "";
      }),
    );
    return numeric(
      t(
        `Each whole number $x$ from 0 to ${m * n - 1} belongs in the cell with row $x \\bmod ${m}$ and column $x \\bmod ${n}$. The numbers up to ${placed} are in place. Which number belongs in the ringed cell?`,
        `从 0 到 ${m * n - 1} 的每个整数 $x$ 都放在第 $x \\bmod ${m}$ 行、第 $x \\bmod ${n}$ 列。不超过 ${placed} 的数已经放好。带圈的格子里应放哪个数？`,
      ),
      answer,
      [answer + m, answer + n, Math.abs(answer - m), Math.abs(answer - n), (answer % m) * (answer % n), (answer % m) + (answer % n)],
      t(
        `The ringed cell asks for remainder ${answer % m} on ${m} and remainder ${answer % n} on ${n}. Since ${m} and ${n} are coprime, exactly one number below ${m * n} does both, and it is ${answer}.`,
        `带圈的格子要求除以 ${m} 余 ${answer % m}，除以 ${n} 余 ${answer % n}。${m} 和 ${n} 互质，所以小于 ${m * n} 的数中恰有一个同时满足，就是 ${answer}。`,
      ),
      grid(
        Array.from({ length: m }, (_, i) => String(i)),
        Array.from({ length: n }, (_, i) => String(i)),
        cells,
        t(
          `A table with ${m} rows and ${n} columns holding the numbers up to ${placed}, with one empty cell ringed.`,
          `${m} 行 ${n} 列的表，填有不超过 ${placed} 的数，一个空格带圈。`,
        ),
      ),
      "integer",
    );
  },
};

const latticeOnLine: KnowledgePointDef = {
  id: "the-next-whole-number-point-on-a-line",
  title: t("The next whole-number point on a line", "直线上的下一个整点"),
  explanation: t(
    "All integer solutions of $ax + by = c$ lie evenly spaced along its line. From one solution, the next is found by adding $b / d$ to $x$ and subtracting $a / d$ from $y$, where $d = \\gcd(a, b)$. Forgetting to divide by $d$ still lands on a solution, but it skips the ones in between.",
    "$ax + by = c$ 的所有整数解等距排在这条直线上。从一个解出发，$x$ 加 $b / d$，$y$ 减 $a / d$，就得到下一个解，其中 $d = \\gcd(a, b)$。忘了除以 $d$ 虽然仍落在解上，却跳过了中间的解。",
  ),
  generate(rng) {
    const [a, b] = rng.pick([
      [2, 3],
      [3, 2],
      [1, 2],
      [2, 1],
      [3, 4],
      [4, 3],
      [1, 3],
      [3, 1],
    ] as const);
    const d = rng.pick([1, 1, 2]);
    const [A, B] = [a * d, b * d];
    const x0 = rng.int(0, 3);
    const y0 = a + rng.int(0, 10 - a);
    const c = A * x0 + B * y0;
    const point = (x: number, y: number) => math(`(${x}, ${y})`);
    const lhs = `${A === 1 ? "" : A}x + ${B === 1 ? "" : B}y`;
    return pickChoice(
      rng,
      t(
        `The line $${lhs} = ${c}$ passes through the marked point $(${x0}, ${y0})$. Moving right along the line, which is the next point with whole-number coordinates?`,
        `直线 $${lhs} = ${c}$ 经过标出的点 $(${x0}, ${y0})$。沿直线向右走，下一个坐标都是整数的点是哪个？`,
      ),
      point(x0 + b, y0 - a),
      [point(x0 + B, y0 - A), point(x0 + a, y0 - b), point(x0 + b, y0 + a), point(x0 + a, y0 + b), point(x0 + 1, y0 - 1)],
      t(
        `Here $\\gcd(${A}, ${B}) = ${d}$, so the solutions step by ${b} to the right and ${a} down. That gives $(${x0 + b}, ${y0 - a})$, and indeed $${A} \\cdot ${x0 + b} + ${B} \\cdot ${y0 - a} = ${c}$.`,
        `这里 $\\gcd(${A}, ${B}) = ${d}$，所以解每次向右 ${b}、向下 ${a}。得到 $(${x0 + b}, ${y0 - a})$，验算 $${A} \\cdot ${x0 + b} + ${B} \\cdot ${y0 - a} = ${c}$。`,
      ),
      drawn(
        { xMin: 0, xMax: 12, yMin: 0, yMax: 12, labelEvery: 2 },
        [
          { kind: "line", a: [x0, y0], b: [x0 + b, y0 - a], accent: true },
          { kind: "point", at: [x0, y0] },
        ],
        t(
          `The line $${lhs} = ${c}$ on a square grid, with the point $(${x0}, ${y0})$ marked.`,
          `方格纸上的直线 $${lhs} = ${c}$，标出点 $(${x0}, ${y0})$。`,
        ),
      ),
    );
  },
};

/** euclidPairs are coprime sides whose cutting takes at least two sizes of square. */
const euclidPairs = [
  [7, 3],
  [8, 3],
  [8, 5],
  [7, 5],
  [5, 2],
  [5, 3],
  [7, 2],
  [9, 4],
  [11, 4],
  [12, 5],
  [13, 5],
  [13, 8],
  [10, 3],
  [11, 3],
  [9, 7],
  [11, 7],
  [12, 7],
  [13, 4],
] as const;

/** squaresFigure cuts an a by b rectangle into squares, largest first. */
function squaresFigure(a: number, b: number, alt: Text): Figure {
  const s = Math.min(270 / a, 170 / b);
  const [left, top] = [160 - (a * s) / 2, 22];
  const parts: string[] = [];
  let [x, y, w, h] = [0, 0, a, b];
  while (w > 0 && h > 0) {
    const side = Math.min(w, h);
    parts.push(`<rect x="${left + x * s}" y="${top + y * s}" width="${side * s}" height="${side * s}"/>`);
    if (w >= h) {
      x += side;
      w -= side;
    } else {
      y += side;
      h -= side;
    }
  }
  parts.push(label(160, 14, String(a)));
  parts.push(label(left - 12, top + (b * s) / 2 + 4, String(b)));
  return { svg: svgDocument(top + b * s + 8, parts.join("")), alt };
}

/** quotients lists the quotients of the Euclidean algorithm on a and b. */
function quotients(a: number, b: number): number[] {
  const out: number[] = [];
  let [x, y] = [a, b];
  while (y > 0) {
    out.push(Math.floor(x / y));
    [x, y] = [y, x % y];
  }
  return out;
}

const gcdFromSquares: KnowledgePointDef = {
  id: "the-gcd-from-cutting-squares",
  title: t("The GCD from cutting squares", "切正方形求最大公因数"),
  explanation: t(
    "Cut the largest possible squares from a rectangle, then repeat on the piece left over. Each round is one division in the Euclidean algorithm, since the squares removed are the quotient and the leftover side is the remainder. The last and smallest square has side equal to the greatest common divisor, and it fits evenly into both sides.",
    "从长方形上切下尽可能大的正方形，再对剩下的部分重复。每一轮就是欧几里得算法的一次除法：切下的正方形个数是商，剩下的边是余数。最后最小的正方形边长就是最大公因数，它能整除两条边。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(euclidPairs);
    const g = rng.int(1, 4);
    const [a, b] = [p * g, q * g];
    return numeric(
      t(
        `This ${a} by ${b} rectangle has been cut into squares, always taking the largest that fits. What is the side of the smallest square?`,
        `这个 ${a} 乘 ${b} 的长方形被切成正方形，每次都切下能放下的最大的正方形。最小的正方形边长是多少？`,
      ),
      g,
      [a % b, b, a - b, g + 1, b - (a % b)],
      t(
        `The cutting follows the Euclidean algorithm on ${a} and ${b}, and it stops at the greatest common divisor. Since $\\gcd(${a}, ${b}) = ${g}$, the smallest square has side ${g}.`,
        `切法就是对 ${a} 和 ${b} 做欧几里得算法，结束时得到最大公因数。因为 $\\gcd(${a}, ${b}) = ${g}$，所以最小的正方形边长是 ${g}。`,
      ),
      squaresFigure(
        a,
        b,
        t(`A ${a} by ${b} rectangle cut into squares of decreasing size.`, `${a} 乘 ${b} 的长方形被切成一个比一个小的正方形。`),
      ),
      "integer",
    );
  },
};

const fractionFromSquares: KnowledgePointDef = {
  id: "a-continued-fraction-from-squares",
  title: t("A continued fraction from squares", "由正方形读连分数"),
  explanation: t(
    "Cutting a rectangle into the largest possible squares reads off a continued fraction. The number of squares of the largest size is the first entry, the number of the next size is the second entry, and so on. In the notation $[q_0; q_1, q_2]$ the first entry is the whole part of the ratio of the sides.",
    "把长方形切成尽可能大的正方形，就能读出连分数。最大一种正方形的个数是第一项，次大一种的个数是第二项，依此类推。在记号 $[q_0; q_1, q_2]$ 中，第一项是两边之比的整数部分。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(euclidPairs);
    const g = rng.int(1, 3);
    const [a, b] = [p * g, q * g];
    const qs = quotients(a, b);
    const cf = (list: readonly number[]) => math(`[${list[0]}; ${list.slice(1).join(", ")}]`);
    const [first, ...rest] = qs as [number, ...number[]];
    return pickChoice(
      rng,
      t(
        `This ${a} by ${b} rectangle has been cut into squares, always taking the largest that fits. Which continued fraction equals $\\frac{${a}}{${b}}$?`,
        `这个 ${a} 乘 ${b} 的长方形被切成正方形，每次都切下能放下的最大的正方形。哪个连分数等于 $\\frac{${a}}{${b}}$？`,
      ),
      cf(qs),
      [
        cf([...qs].reverse()),
        cf([first + 1, ...rest]),
        cf([first, ...rest.map((v, i) => (i === 0 ? v + 1 : v))]),
        cf([first, ...rest.map((v, i) => (i === rest.length - 1 ? v + 1 : v))]),
      ],
      t(
        `Reading the sizes from largest to smallest, the numbers of squares are ${qs.join(", ")}. These are the quotients of the Euclidean algorithm, so $\\frac{${a}}{${b}} = [${first}; ${rest.join(", ")}]$.`,
        `从大到小，各种正方形的个数依次是 ${qs.join("、")}。这些正是欧几里得算法的商，所以 $\\frac{${a}}{${b}} = [${first}; ${rest.join(", ")}]$。`,
      ),
      squaresFigure(
        a,
        b,
        t(`A ${a} by ${b} rectangle cut into squares of decreasing size.`, `${a} 乘 ${b} 的长方形被切成一个比一个小的正方形。`),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Real Analysis
// ---------------------------------------------------------------------------

/** bandCases are the choices of c and epsilon where the term that enters the band of a limit is clear in a drawing. */
const bandCases = [2, 3].flatMap((epsilon) =>
  Array.from({ length: 20 }, (_, i) => i + 11)
    .map((c) => ({ c, epsilon, entry: Math.floor(c / epsilon) + 1 }))
    .filter(({ c, epsilon: e, entry }) => entry <= 13 && c / (entry - 1) - e >= 0.3 && e - c / entry >= 0.2),
);

const epsilonBand: KnowledgePointDef = {
  id: "the-index-that-enters-an-epsilon-band",
  title: t("The index that enters an epsilon band", "进入 epsilon 带的下标"),
  explanation: t(
    "The definition of a limit says that for each $\\varepsilon$ there is an $N$ past which every term stays within $\\varepsilon$ of the limit. In a plot this is a horizontal band around the limit. The point is the word every: a term inside the band proves nothing if a later term leaves, so read from the right and find the last term outside.",
    "极限的定义说：对每个 $\\varepsilon$，都有一个 $N$，此后的每一项与极限的距离都小于 $\\varepsilon$。在图上这是绕着极限的一条水平带。关键在于“每一项”：某一项在带内并不说明什么，如果后面还有项跑出去。所以要从右往左读，找到最后一个在带外的项。",
  ),
  generate(rng) {
    const { c, epsilon, entry } = rng.pick(bandCases);
    const limit = rng.int(5, 9);
    const alternating = rng.bool();
    const sign = rng.pick([1, -1]);
    const term = (n: number) => limit + (alternating && n % 2 === 1 ? -sign : sign) * (c / n);
    const dots: PlaneMark[] = Array.from({ length: 14 }, (_, i) => i + 1)
      .filter((n) => term(n) >= 0 && term(n) <= 14)
      .map((n) => ({ kind: "point", at: [n, term(n)] }));
    return numeric(
      t(
        `The dots show the terms $a_n$ of a sequence with limit ${limit}, and the dashed lines are ${limit} $\\pm$ ${epsilon}. What is the smallest $N$ such that $a_n$ lies inside the band for every $n \\ge N$?`,
        `圆点是极限为 ${limit} 的数列的项 $a_n$，虚线是 ${limit} $\\pm$ ${epsilon}。使得对每个 $n \\ge N$，$a_n$ 都在带内的最小 $N$ 是多少？`,
      ),
      entry,
      [entry - 1, entry + 1, entry - 2, epsilon],
      t(
        `The last term outside the band is $a_{${entry - 1}}$, and every term after it stays inside. So the smallest such $N$ is ${entry}.`,
        `最后一个在带外的项是 $a_{${entry - 1}}$，它之后的每一项都在带内。所以最小的 $N$ 是 ${entry}。`,
      ),
      drawn(
        { xMin: 0, xMax: 14, yMin: 0, yMax: 14, labelEvery: 2, xName: "n", yName: "a" },
        [
          { kind: "line", a: [0, limit + epsilon], b: [1, limit + epsilon], dashed: true },
          { kind: "line", a: [0, limit - epsilon], b: [1, limit - epsilon], dashed: true },
          ...dots,
        ],
        t(
          `Terms of a sequence for $n$ up to 14, closing in on ${limit}, between two dashed horizontal lines.`,
          `$n$ 到 14 的数列各项，逐渐接近 ${limit}，图中有两条水平虚线。`,
        ),
      ),
      "integer",
    );
  },
};

const limsupFromPlot: KnowledgePointDef = {
  id: "limsup-and-liminf-from-a-plot",
  title: t("Limit superior and inferior from a plot", "由图读上极限和下极限"),
  explanation: t(
    "The limit superior is the largest value that some subsequence approaches, and the limit inferior is the smallest. Neither is the largest or smallest term of the sequence: early terms may stick out past them and then never return. Look at where the dots settle on the far right of the plot, ignoring the first few.",
    "上极限是某个子列趋近的最大值，下极限是最小值。它们都不是数列的最大项或最小项：前面的项可能超出去，之后再也不回来。要看图最右边圆点稳定在哪里，不管开头那几项。",
  ),
  generate(rng) {
    const upper = rng.int(6, 10);
    const lower = rng.int(1, 4);
    const c = rng.pick([4, 6, 8]);
    const outward = rng.bool();
    const term = (n: number) => (n % 2 === 0 ? upper + (outward ? c / n : -c / n) : lower + (outward ? -c / n : c / n));
    const dots: PlaneMark[] = Array.from({ length: 24 }, (_, i) => i + 1)
      .filter((n) => term(n) >= -3 && term(n) <= 15)
      .map((n) => ({ kind: "point", at: [n, term(n)] }));
    const askUpper = rng.bool();
    const answer = askUpper ? upper : lower;
    const name = askUpper ? "\\limsup" : "\\liminf";
    return numeric(
      t(
        `The dots show the terms $a_n$ of a sequence, and the pattern continues. What is $${name}_{n \\to \\infty} a_n$?`,
        `圆点是数列的项 $a_n$，规律一直延续。$${name}_{n \\to \\infty} a_n$ 是多少？`,
      ),
      answer,
      [askUpper ? lower : upper, askUpper ? upper + c / 2 : lower - c, Q.of(upper + lower, 2), askUpper ? upper - c / 2 : lower + c],
      t(
        `The even terms approach ${upper} and the odd terms approach ${lower}, and these are the only values a subsequence can approach. The ${askUpper ? "largest" : "smallest"} of them is ${answer}, whatever the first few terms do.`,
        `偶数项趋近 ${upper}，奇数项趋近 ${lower}，子列只可能趋近这两个值。其中${askUpper ? "最大" : "最小"}的是 ${answer}，与开头几项无关。`,
      ),
      drawn(
        { xMin: 0, xMax: 24, yMin: -3, yMax: 15, step: 1, labelEvery: 2, xName: "n", yName: "a" },
        dots,
        t("Terms of a sequence for $n$ up to 24, alternating between two levels.", "$n$ 到 24 的数列各项，在两个高度之间交替。"),
      ),
      "integer",
    );
  },
};

const continuityFailure: KnowledgePointDef = {
  id: "which-condition-of-continuity-fails",
  title: t("Which condition of continuity fails", "连续性的哪个条件不成立"),
  explanation: t(
    "Continuity at $a$ has three parts: $f(a)$ is defined, the limit at $a$ exists, and the two are equal. A hollow dot with no solid dot means no value. Two sides heading to different heights means no limit. A hollow dot with a solid dot elsewhere means a limit and a value that disagree. Name the first part that fails.",
    "在 $a$ 处连续有三个条件：$f(a)$ 有定义，$a$ 处的极限存在，两者相等。只有空心点没有实心点，说明没有函数值。两侧趋向不同高度，说明极限不存在。空心点之外另有实心点，说明极限和函数值不相等。要说出最先不成立的条件。",
  ),
  generate(rng) {
    const a = rng.int(3, 5);
    const level = rng.int(3, 5);
    const [m1, m2] = [rng.pick([-1, -0.5, 0.5, 1]), rng.pick([-1, -0.5, 0.5, 1])];
    const kind = rng.pick(["continuous", "hole", "jump", "moved"] as const);
    const right = kind === "jump" ? level + rng.pick([-2, 2]) : level;
    const marks: PlaneMark[] = [
      { kind: "curve", f: (x) => level + m1 * (x - a), from: 0, to: a, accent: true },
      { kind: "curve", f: (x) => right + m2 * (x - a), from: a, to: 8, accent: true },
    ];
    if (kind === "continuous") marks.push({ kind: "point", at: [a, level], accent: true });
    if (kind === "hole") marks.push({ kind: "point", at: [a, level], open: true, accent: true });
    if (kind === "jump") {
      marks.push({ kind: "point", at: [a, level], accent: true });
      marks.push({ kind: "point", at: [a, right], open: true, accent: true });
    }
    let moved = level;
    if (kind === "moved") {
      moved = level + rng.pick([-2, 2]);
      marks.push({ kind: "point", at: [a, level], open: true, accent: true });
      marks.push({ kind: "point", at: [a, moved], accent: true });
    }
    const options = {
      continuous: t(`$f$ is continuous at $x = ${a}$`, `$f$ 在 $x = ${a}$ 处连续`),
      hole: t(`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`),
      jump: t(`$\\lim_{x \\to ${a}} f(x)$ does not exist`, `$\\lim_{x \\to ${a}} f(x)$ 不存在`),
      moved: t(`The limit at ${a} exists but differs from $f(${a})$`, `${a} 处的极限存在，但不等于 $f(${a})$`),
    };
    const why = {
      continuous: t(
        `Both sides approach ${level} and the solid dot gives $f(${a}) = ${level}$, so all three conditions hold.`,
        `两侧都趋近 ${level}，实心点给出 $f(${a}) = ${level}$，所以三个条件都成立。`,
      ),
      hole: t(
        `Both sides approach ${level}, so the limit exists, but there is only a hollow dot at $x = ${a}$ and no value of $f$ there.`,
        `两侧都趋近 ${level}，极限存在，但 $x = ${a}$ 处只有空心点，$f$ 在那里没有值。`,
      ),
      jump: t(
        `The left side approaches ${level} and the right side approaches ${right}. The one-sided limits differ, so the limit does not exist.`,
        `左侧趋近 ${level}，右侧趋近 ${right}。两个单侧极限不同，所以极限不存在。`,
      ),
      moved: t(
        `Both sides approach ${level}, so the limit is ${level}, but the solid dot says $f(${a}) = ${moved}$. The two disagree.`,
        `两侧都趋近 ${level}，极限是 ${level}，但实心点说 $f(${a}) = ${moved}$。两者不相等。`,
      ),
    };
    const { [kind]: correct, ...others } = options;
    return pickChoice(
      rng,
      t(`Which statement describes this function at $x = ${a}$?`, `哪句话描述了这个函数在 $x = ${a}$ 处的情况？`),
      correct,
      Object.values(others),
      why[kind],
      drawn(
        { xMin: 0, xMax: 8, yMin: 0, yMax: 8 },
        marks,
        t(
          `The graph of a function made of two pieces that meet or break at $x = ${a}$.`,
          `由两段组成的函数图像，两段在 $x = ${a}$ 处相接或断开。`,
        ),
      ),
    );
  },
};

const deltaFromLine: KnowledgePointDef = {
  id: "reading-delta-from-a-line",
  title: t("Reading delta from a line", "由直线读 delta"),
  explanation: t(
    "For a line through $(a, L)$ with slope $m$, the height differs from $L$ by exactly $|m|$ times the horizontal distance from $a$. So staying within $\\varepsilon$ of $L$ means staying within $\\varepsilon / |m|$ of $a$. A steep line needs a small $\\delta$, and a shallow line allows a large one, because $\\delta$ is measured across and $\\varepsilon$ up.",
    "对经过 $(a, L)$、斜率为 $m$ 的直线，高度与 $L$ 的差恰好是水平距离的 $|m|$ 倍。所以要与 $L$ 相差不到 $\\varepsilon$，就要与 $a$ 相差不到 $\\varepsilon / |m|$。直线越陡，$\\delta$ 越小；越平，$\\delta$ 越大，因为 $\\delta$ 是横向量的，$\\varepsilon$ 是纵向量的。",
  ),
  generate(rng) {
    const [mn, md, epsilonDoubled] = rng.pick([
      [2, 1, 4],
      [2, 1, 6],
      [2, 1, 8],
      [3, 1, 6],
      [3, 1, 9],
      [1, 2, 2],
      [1, 2, 3],
      [1, 1, 2],
      [1, 1, 4],
      [3, 2, 6],
    ] as const);
    const sign = rng.pick([1, -1]);
    const slope = Q.of(sign * mn, md);
    const m = (sign * mn) / md;
    const epsilon = Q.of(epsilonDoubled, 2);
    const eps = epsilonDoubled / 2;
    const delta = epsilon.div(Q.of(mn, md));
    const a = rng.int(4, 6);
    const L = rng.int(4, 6);
    return numeric(
      t(
        `The line passes through $(${a}, ${L})$, and the dashed lines are at $y = ${L} \\pm ${epsilon.toLatex()}$. What is the largest $\\delta$ such that $|x - ${a}| < \\delta$ keeps the line between the dashed lines?`,
        `直线经过 $(${a}, ${L})$，虚线在 $y = ${L} \\pm ${epsilon.toLatex()}$ 处。使 $|x - ${a}| < \\delta$ 时直线都在虚线之间的最大 $\\delta$ 是多少？`,
      ),
      delta,
      [epsilon, epsilon.mul(Q.of(mn, md)), delta.div(Q.of(2, 1)), delta.mul(Q.of(2, 1)), Q.of(mn, md)],
      t(
        `The grid shows slope $${slope.toLatex()}$. The line leaves the band when its height has changed by $${epsilon.toLatex()}$, which takes a horizontal distance of $${epsilon.toLatex()} \\div ${Q.of(mn, md).toLatex()} = ${delta.toLatex()}$.`,
        `由方格读出斜率是 $${slope.toLatex()}$。高度变化 $${epsilon.toLatex()}$ 时直线离开带，这需要的水平距离是 $${epsilon.toLatex()} \\div ${Q.of(mn, md).toLatex()} = ${delta.toLatex()}$。`,
      ),
      drawn(
        { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
        [
          { kind: "curve", f: (x) => L + m * (x - a), accent: true },
          { kind: "line", a: [0, L + eps], b: [1, L + eps], dashed: true },
          { kind: "line", a: [0, L - eps], b: [1, L - eps], dashed: true },
          { kind: "point", at: [a, L] },
        ],
        t(
          `A straight line through the marked point $(${a}, ${L})$ crossing two horizontal dashed lines.`,
          `一条直线经过标出的点 $(${a}, ${L})$，穿过两条水平虚线。`,
        ),
      ),
    );
  },
};

const secantSlope: KnowledgePointDef = {
  id: "the-slope-guaranteed-by-a-graph",
  title: t("The slope the theorem guarantees", "定理保证的斜率"),
  explanation: t(
    "The Mean Value Theorem promises a point between $a$ and $b$ where the tangent is parallel to the chord joining the endpoints. So the guaranteed derivative is the chord's slope: rise over run between the two endpoints only. What the curve does in between does not change this value, though it may change how many such points there are.",
    "中值定理保证 $a$ 和 $b$ 之间有一点，那里的切线平行于连接两端点的弦。所以定理保证的导数值就是弦的斜率：只看两端点之间的升高除以水平距离。曲线中间怎么走不改变这个值，只可能改变这样的点有几个。",
  ),
  generate(rng) {
    const a = rng.int(1, 3);
    const b = a + rng.int(2, 5);
    const ya = rng.int(3, 7);
    let yb = rng.int(3, 7);
    if (yb === ya) yb = ya + 1;
    const slope = Q.of(yb - ya, b - a);
    const s = (yb - ya) / (b - a);
    const k = rng.pick([-0.25, 0.25]);
    const f = (x: number) => ya + s * (x - a) + k * (x - a) * (x - b);
    return numeric(
      t(
        `The curve is the graph of a differentiable function $f$, with the endpoints at $x = ${a}$ and $x = ${b}$ marked. The Mean Value Theorem guarantees a point $c$ between them with $f'(c)$ equal to what number?`,
        `曲线是可导函数 $f$ 的图像，$x = ${a}$ 和 $x = ${b}$ 处的端点已标出。中值定理保证两点之间有一点 $c$，使 $f'(c)$ 等于多少？`,
      ),
      slope,
      [Q.of(yb - ya, 1), Q.of(b - a, yb - ya), slope.neg(), Q.of(yb + ya, 2)],
      t(
        `The endpoints are $(${a}, ${ya})$ and $(${b}, ${yb})$, so the chord has slope $\\frac{${yb} - ${ya}}{${b} - ${a}} = ${slope.toLatex()}$. The theorem guarantees a tangent with that same slope.`,
        `端点是 $(${a}, ${ya})$ 和 $(${b}, ${yb})$，所以弦的斜率是 $\\frac{${yb} - ${ya}}{${b} - ${a}} = ${slope.toLatex()}$。定理保证有一条切线的斜率与它相同。`,
      ),
      drawn(
        { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
        [
          { kind: "curve", f, from: a, to: b, accent: true },
          { kind: "point", at: [a, ya] },
          { kind: "point", at: [b, yb] },
        ],
        t(
          `A smooth curve between the marked points $(${a}, ${ya})$ and $(${b}, ${yb})$.`,
          `一条光滑曲线，连接标出的点 $(${a}, ${ya})$ 和 $(${b}, ${yb})$。`,
        ),
      ),
    );
  },
};

const darbouxFromDrawing: KnowledgePointDef = {
  id: "darboux-sums-from-a-drawing",
  title: t("Darboux sums from a drawing", "由图算达布和"),
  explanation: t(
    "On each piece of a partition, the upper sum uses the largest value of the function and the lower sum uses the smallest. For a monotonic function these lie at the ends of the piece. The pieces need not have equal widths, so multiply each height by its own width. The upper sum minus the lower sum measures the gap left by the partition.",
    "在分割的每一段上，上和取函数的最大值，下和取最小值。单调函数的最大值和最小值都在这一段的端点上。各段宽度不一定相等，所以每个高度要乘自己那一段的宽度。上和减下和就是这个分割留下的差距。",
  ),
  generate(rng) {
    const points = rng.pick([
      [0, 2, 4, 6],
      [0, 2, 6],
      [0, 4, 6],
    ]);
    const offset = rng.int(0, 3);
    const increasing = rng.bool();
    const f = (x: number) => (increasing ? offset + (x * x) / 4 : offset + 9 - (x * x) / 4);
    const pieces = points.slice(1).map((end, i) => {
      const start = points[i] as number;
      return { start, end, width: end - start, high: Math.max(f(start), f(end)), low: Math.min(f(start), f(end)) };
    });
    const upper = pieces.reduce((sum, p) => sum + p.width * p.high, 0);
    const lower = pieces.reduce((sum, p) => sum + p.width * p.low, 0);
    const ask = rng.pick(["upper", "lower", "gap"] as const);
    const answer = ask === "upper" ? upper : ask === "lower" ? lower : upper - lower;
    const question = {
      upper: t("the upper sum $U(P)$", "上和 $U(P)$"),
      lower: t("the lower sum $L(P)$", "下和 $L(P)$"),
      gap: t("$U(P) - L(P)$", "$U(P) - L(P)$"),
    }[ask];
    const shaded: PlaneMark[] = pieces.map((p) => ({
      kind: "polygon",
      points: [
        [p.start, 0],
        [p.end, 0],
        [p.end, p.low],
        [p.start, p.low],
      ],
    }));
    const tall: PlaneMark[] = pieces.map((p) => ({
      kind: "path",
      points: [
        [p.start, 0],
        [p.start, p.high],
        [p.end, p.high],
        [p.end, 0],
      ],
      dashed: true,
    }));
    const sum = (key: "high" | "low") => pieces.map((p) => `${p.width} \\cdot ${p[key]}`).join(" + ");
    return numeric(
      t(
        `The curve is a monotonic function $f$ on $[0, 6]$. The shaded rectangles are the lower sum and the dashed rectangles are the upper sum of a partition $P$. Find ${question.en}.`,
        `曲线是 $[0, 6]$ 上的单调函数 $f$。对分割 $P$，阴影矩形是下和，虚线矩形是上和。求${question["zh-CN"]}。`,
      ),
      answer,
      [upper, lower, upper - lower, upper + lower, pieces.reduce((s, p) => s + p.high, 0), pieces.reduce((s, p) => s + p.low, 0)],
      t(
        `Reading the widths and heights, $U(P) = ${sum("high")} = ${upper}$ and $L(P) = ${sum("low")} = ${lower}$. So ${question.en} is ${answer}.`,
        `读出宽和高，$U(P) = ${sum("high")} = ${upper}$，$L(P) = ${sum("low")} = ${lower}$。所以${question["zh-CN"]}是 ${answer}。`,
      ),
      drawn(
        { xMin: -1, xMax: 7, yMin: -1, yMax: 13 },
        [...shaded, ...tall, { kind: "curve", f, from: 0, to: 6, accent: true }],
        t(
          "A monotonic curve over a partition, with shaded rectangles under it and dashed rectangles over it.",
          "分割上的单调曲线，下方是阴影矩形，上方是虚线矩形。",
        ),
      ),
      "integer",
    );
  },
};

const stepGap: KnowledgePointDef = {
  id: "the-gap-at-a-jump",
  title: t("The gap at a jump", "跳跃处的差距"),
  explanation: t(
    "A function with one jump is still Riemann integrable. On every piece of a partition that misses the jump, the largest and smallest values agree and contribute nothing to the upper sum minus the lower sum. Only the piece holding the jump contributes: its width times the size of the jump, and this shrinks to zero as the partition gets finer.",
    "只有一个跳跃的函数仍然黎曼可积。分割中不含跳跃的每一段上，最大值和最小值相同，对上和减下和没有贡献。只有含跳跃的那一段有贡献：它的宽度乘跳跃的大小，分割越细，这个值越趋近于零。",
  ),
  generate(rng) {
    const width = rng.pick([1, 2, 4]);
    const jumpAt = width * rng.int(0, 8 / width - 1) + width / 2;
    const left = rng.int(1, 7);
    let right = rng.int(1, 7);
    if (right === left) right = left === 7 ? 1 : left + 1;
    const size = Math.abs(right - left);
    const cuts: PlaneMark[] = Array.from({ length: 8 / width + 1 }, (_, i) => ({
      kind: "segment",
      a: [i * width, 0],
      b: [i * width, 8],
      dashed: true,
    }));
    return numeric(
      t(
        `The step function on $[0, 8]$ jumps once, and the dashed lines mark a partition $P$. What is $U(P) - L(P)$?`,
        `$[0, 8]$ 上的阶梯函数跳跃一次，虚线标出分割 $P$。$U(P) - L(P)$ 是多少？`,
      ),
      size * width,
      [size, 8 * size, width, (left + right) * width],
      t(
        `Away from the jump the largest and smallest values on a piece agree. The piece holding the jump has width ${width} and values ${left} and ${right}, so it contributes $${width} \\cdot ${size} = ${size * width}$.`,
        `离开跳跃处，每一段上的最大值和最小值相同。含跳跃的那一段宽 ${width}，函数值是 ${left} 和 ${right}，所以贡献 $${width} \\cdot ${size} = ${size * width}$。`,
      ),
      drawn(
        { xMin: 0, xMax: 8, yMin: 0, yMax: 8 },
        [
          ...cuts,
          { kind: "segment", a: [0, left], b: [jumpAt, left], accent: true },
          { kind: "segment", a: [jumpAt, right], b: [8, right], accent: true },
          { kind: "point", at: [jumpAt, left], accent: true },
          { kind: "point", at: [jumpAt, right], open: true, accent: true },
        ],
        t(
          "A step function with one jump, crossed by the dashed vertical lines of a partition.",
          "只跳跃一次的阶梯函数，竖直虚线标出分割。",
        ),
      ),
      "integer",
    );
  },
};

const convergenceFromGraphs: KnowledgePointDef = {
  id: "the-kind-of-convergence-from-graphs",
  title: t("The kind of convergence from graphs", "由图判断收敛类型"),
  explanation: t(
    "Pointwise convergence fixes one $x$ and watches the values $f_n(x)$. Uniform convergence asks that the largest distance from the limit, over all $x$ at once, go to zero. A hump of fixed height that slides away passes every fixed point in the end, so it converges pointwise, but its height never shrinks, so the convergence is not uniform.",
    "逐点收敛是固定一个 $x$，看 $f_n(x)$ 的值。一致收敛要求对所有 $x$ 同时取的最大距离趋于零。高度不变、不断滑走的驼峰，最后会离开每个固定点，所以逐点收敛；但它的高度不减小，所以不是一致收敛。",
  ),
  generate(rng) {
    const height = rng.int(4, 6);
    const center = rng.int(3, 5);
    const half = rng.int(2, 3);
    const kind = rng.pick(["slide", "shrink", "flip"] as const);
    const shapes = {
      slide: [
        { n: "1", at: center, w: half, h: height },
        { n: "2", at: center / 2, w: half / 2, h: height },
        { n: "4", at: center / 4, w: half / 4, h: height },
      ],
      shrink: [
        { n: "1", at: center, w: half, h: height },
        { n: "2", at: center, w: half, h: height / 2 },
        { n: "4", at: center, w: half, h: height / 4 },
      ],
      flip: [
        { n: "1", at: center, w: half, h: height },
        { n: "2", at: center, w: half, h: -height },
        { n: "3", at: center, w: half, h: height },
      ],
    }[kind];
    const marks: PlaneMark[] = shapes.flatMap((s, i) => {
      const path: PlaneMark = { kind: "path", points: tent(s.at, s.w, s.h, 0, 8), accent: i === 0 };
      if (kind === "flip" && i === 2) return [];
      const name = kind === "flip" ? (i === 0 ? "1, 3" : "2, 4") : s.n;
      const tag: PlaneMark = { kind: "label", at: [s.at, s.h], text: name, dir: s.h > 0 ? "n" : "s" };
      return [path, tag];
    });
    const options = {
      slide: t("They converge to 0 at every point, but not uniformly", "它们在每一点都收敛到 0，但不是一致收敛"),
      shrink: t("They converge uniformly to 0", "它们一致收敛到 0"),
      flip: t("They fail to converge at some points", "它们在某些点上不收敛"),
    };
    const why = {
      slide: t(
        `The hump keeps its height ${height} while sliding toward 0. Any fixed $x > 0$ is left behind in the end, and $f_n(0) = 0$, so the limit is 0 at every point. But the largest distance from 0 stays ${height}, so the convergence is not uniform.`,
        `驼峰保持高度 ${height}，向 0 滑去。任何固定的 $x > 0$ 最后都会被甩在后面，而 $f_n(0) = 0$，所以每一点的极限都是 0。但与 0 的最大距离一直是 ${height}，所以不是一致收敛。`,
      ),
      shrink: t(
        `The height halves each time $n$ doubles, so the largest distance from 0 over all $x$ goes to 0. That is exactly uniform convergence.`,
        `$n$ 每翻一倍，高度就减半，所以对所有 $x$ 取的最大距离趋于 0。这正是一致收敛。`,
      ),
      flip: t(
        `At $x = ${center}$ the values alternate between ${height} and ${-height}, so that sequence of numbers has no limit.`,
        `在 $x = ${center}$ 处，函数值在 ${height} 和 ${-height} 之间交替，这个数列没有极限。`,
      ),
    };
    const { [kind]: correct, ...others } = options;
    return pickChoice(
      rng,
      t(
        "The graphs show some of the functions $f_n$ on $[0, 8]$, each labelled with its $n$, and the pattern continues as $n$ grows. What can you say about the sequence?",
        "图中是 $[0, 8]$ 上的一部分函数 $f_n$，每个图像标有它的 $n$，随着 $n$ 增大规律一直延续。关于这个函数列，可以得出什么结论？",
      ),
      correct,
      Object.values(others),
      why[kind],
      drawn(
        { xMin: 0, xMax: 8, yMin: kind === "flip" ? -7 : -1, yMax: 7 },
        marks,
        t("Tent-shaped graphs of several functions in a sequence, labelled by $n$.", "函数列中几个函数的帐篷形图像，标有 $n$。"),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Partial Differential Equations
// ---------------------------------------------------------------------------

const speedFromSnapshots: KnowledgePointDef = {
  id: "the-speed-from-two-snapshots",
  title: t("The speed from two snapshots", "由两张快照读速度"),
  explanation: t(
    "The solution of $u_t + c u_x = 0$ is the initial shape sliding without change at speed $c$. Compare the same feature, such as the peak, in two snapshots: the speed is the distance moved divided by the time elapsed. A move to the right means $c > 0$ and a move to the left means $c < 0$.",
    "$u_t + c u_x = 0$ 的解是初始形状以速度 $c$ 平移，形状不变。在两张快照中比较同一个特征，比如峰顶：速度等于移动的距离除以经过的时间。向右移动说明 $c > 0$，向左移动说明 $c < 0$。",
  ),
  generate(rng) {
    const shift = rng.pick([-6, -4, -3, -2, 2, 3, 4, 6]);
    const time = rng.pick([1, 2, 3, 4]);
    const start = shift > 0 ? rng.int(2, 3) : rng.int(9, 10);
    const height = rng.int(2, 4);
    const speed = Q.of(shift, time);
    return numeric(
      t(
        `The dashed curve is a solution of $u_t + c u_x = 0$ at $t = 0$, and the solid curve is the same solution at $t = ${time}$. What is $c$?`,
        `虚线是 $u_t + c u_x = 0$ 的解在 $t = 0$ 时的图像，实线是同一个解在 $t = ${time}$ 时的图像。$c$ 是多少？`,
      ),
      speed,
      [speed.neg(), Q.of(shift, 1), Q.of(time, shift), Q.of(-shift, 1)],
      t(
        `The peak moves from $x = ${start}$ to $x = ${start + shift}$ in time ${time}. So $c = ${shift} \\div ${time} = ${speed.toLatex()}$, and the sign records the direction.`,
        `峰顶在时间 ${time} 内从 $x = ${start}$ 移到 $x = ${start + shift}$。所以 $c = ${shift} \\div ${time} = ${speed.toLatex()}$，符号表示方向。`,
      ),
      drawn(
        { xMin: 0, xMax: 12, yMin: -1, yMax: 6, yName: "u" },
        [
          { kind: "path", points: tent(start, 2, height, 0, 12), dashed: true },
          { kind: "path", points: tent(start + shift, 2, height, 0, 12), accent: true },
        ],
        t("A dashed tent-shaped profile and a solid copy of it moved along the axis.", "虚线的帐篷形曲线，以及沿轴平移后的实线曲线。"),
      ),
    );
  },
};

const traceCharacteristic: KnowledgePointDef = {
  id: "tracing-a-characteristic-back",
  title: t("Tracing a characteristic back", "沿特征线回溯"),
  explanation: t(
    "A solution of $u_t + c u_x = 0$ is constant along each characteristic line. To find $u$ at a point, follow the line through it down to $t = 0$ and read the initial data at the foot. Do not put the $x$ of the point itself into the initial data: that would ignore the distance the data has travelled.",
    "$u_t + c u_x = 0$ 的解沿每条特征线不变。要求某点的 $u$，就沿经过它的直线走到 $t = 0$，在落点处读初始数据。不要把这一点自己的 $x$ 代入初始数据，那样就忽略了数据走过的距离。",
  ),
  generate(rng) {
    const [cn, cd] = rng.pick([
      [1, 1],
      [2, 1],
      [-1, 1],
      [-2, 1],
      [1, 2],
      [-1, 2],
    ] as const);
    const c = cn / cd;
    const time = cd === 2 ? rng.pick([2, 4]) : rng.int(1, 3);
    const foot = cn > 0 ? rng.int(1, 3) : rng.int(7, 9);
    const px = foot + c * time;
    const data = rng.pick([
      { en: "x^2", f: (x: number) => x * x },
      { en: "2x + 1", f: (x: number) => 2 * x + 1 },
      { en: "10 - x", f: (x: number) => 10 - x },
      { en: "x^2 - x", f: (x: number) => x * x - x },
    ]);
    const lines: PlaneMark[] = [-4, -2, 2, 4].map(
      (d): PlaneMark => ({ kind: "line", a: [foot + d, 0], b: [foot + d + c, 1], dashed: true }),
    );
    return numeric(
      t(
        `The lines are the characteristics of $u_t + c u_x = 0$ in the plane with $x$ across and $t$ up, and $u(x, 0) = ${data.en}$. Find $u$ at the marked point.`,
        `图中直线是 $u_t + c u_x = 0$ 的特征线，横轴是 $x$，纵轴是 $t$，且 $u(x, 0) = ${data.en}$。求标出的点处的 $u$。`,
      ),
      data.f(foot),
      [data.f(px), data.f(px + c * time), data.f(time), px],
      t(
        `The solid characteristic through $(${px}, ${time})$ meets $t = 0$ at $x = ${foot}$, and $u$ does not change along it. So $u = u(${foot}, 0) = ${data.f(foot)}$.`,
        `经过 $(${px}, ${time})$ 的实线特征线与 $t = 0$ 交于 $x = ${foot}$，$u$ 沿它不变。所以 $u = u(${foot}, 0) = ${data.f(foot)}$。`,
      ),
      drawn(
        { xMin: 0, xMax: 10, yMin: 0, yMax: 6, yName: "t" },
        [...lines, { kind: "line", a: [foot, 0], b: [foot + c, 1], accent: true }, { kind: "point", at: [px, time], accent: true }],
        t(
          `Parallel straight characteristics in the $x$, $t$ plane, with a point on the solid one at $(${px}, ${time})$.`,
          `$x$、$t$ 平面上互相平行的特征线，实线上标出点 $(${px}, ${time})$。`,
        ),
      ),
      "integer",
    );
  },
};

const heatOrder: KnowledgePointDef = {
  id: "ordering-heat-profiles-in-time",
  title: t("Ordering heat profiles in time", "按时间排列温度曲线"),
  explanation: t(
    "With both ends of a rod held at zero, heat drains out and a single sine mode keeps its shape while its height falls steadily. It never changes sign and never grows back, because the solution is $e^{-\\lambda t}$ times the mode. So among profiles of one rod, the taller curve is always the earlier one.",
    "杆的两端保持为零时，热量不断流失，单个正弦模态形状不变，高度持续下降。它不会变号，也不会再升高，因为解是 $e^{-\\lambda t}$ 乘这个模态。所以同一根杆的几条曲线中，较高的总是较早的。",
  ),
  generate(rng) {
    const mode = rng.pick([1, 1, 2]);
    const heights = [rng.int(5, 6), rng.int(3, 4), rng.pick([1, 2])] as const;
    const names = rng.shuffle(["A", "B", "C"]);
    const latest = rng.bool();
    const answer = names[latest ? 2 : 0] as string;
    const name = (s: string) => t(`Curve ${s}`, `曲线 ${s}`);
    const curves: PlaneMark[] = heights.flatMap((h, i): PlaneMark[] => [
      { kind: "curve", f: (x) => h * Math.sin((mode * Math.PI * x) / 8), from: 0, to: 8, accent: i === 0 },
      { kind: "label", at: [4 / mode, h], text: names[i] as string, dir: "n" },
    ]);
    return pickChoice(
      rng,
      t(
        `The curves show the temperature of one rod at three times, with both ends held at 0. Which curve is the ${latest ? "latest" : "earliest"}?`,
        `这些曲线是同一根杆在三个时刻的温度，两端保持为 0。哪条曲线的时刻${latest ? "最晚" : "最早"}？`,
      ),
      name(answer),
      names.filter((s) => s !== answer).map(name),
      t(
        `The mode keeps its shape and its height only falls, so the ${latest ? "lowest" : "tallest"} curve, ${answer}, is the ${latest ? "latest" : "earliest"}.`,
        `模态形状不变，高度只会下降，所以${latest ? "最低" : "最高"}的曲线 ${answer} 时刻${latest ? "最晚" : "最早"}。`,
      ),
      drawn(
        { xMin: 0, xMax: 8, yMin: mode === 2 ? -7 : -1, yMax: 7, yName: "u" },
        curves,
        t(
          "Three sine-shaped temperature curves of different heights, labelled A, B and C.",
          "三条高度不同的正弦形温度曲线，标为 A、B、C。",
        ),
      ),
    );
  },
};

const insulatedMean: KnowledgePointDef = {
  id: "the-final-temperature-of-an-insulated-rod",
  title: t("The final temperature of an insulated rod", "绝热杆的最终温度"),
  explanation: t(
    "With insulated ends no heat escapes, so the total heat in the rod never changes while the temperature evens out. The final uniform temperature must carry the same total, so it is the average of the initial temperature over the length. A longer stretch counts for more, which is why the average of the heights alone is wrong.",
    "两端绝热时热量不会散失，温度趋于均匀的过程中，杆里的总热量不变。最终的均匀温度必须对应同样的总热量，所以它是初始温度沿长度的平均值。长的一段权重更大，所以只平均高度是错的。",
  ),
  generate(rng) {
    const length = rng.pick([6, 8, 10]);
    const cut = rng.int(1, length - 1);
    const pieces = rng.bool()
      ? [
          { from: 0, to: cut, u: rng.int(1, 9) },
          { from: cut, to: length, u: rng.int(1, 9) },
        ]
      : [
          { from: 0, to: 2, u: rng.int(1, 9) },
          { from: 2, to: 4, u: rng.int(1, 9) },
          { from: 4, to: length, u: rng.int(1, 9) },
        ];
    if (new Set(pieces.map((p) => p.u)).size === 1)
      (pieces[0] as { u: number }).u = (pieces[1] as { u: number }).u === 9 ? 1 : (pieces[1] as { u: number }).u + 1;
    const total = pieces.reduce((sum, p) => sum + (p.to - p.from) * p.u, 0);
    const answer = Q.of(total, length);
    const plain = pieces.reduce((sum, p) => sum + p.u, 0);
    const parts = pieces.map((p) => `${p.to - p.from} \\cdot ${p.u}`).join(" + ");
    return numeric(
      t(
        `The graph shows the initial temperature of a rod of length ${length} whose ends are insulated. What uniform temperature does the rod approach as $t \\to \\infty$?`,
        `图中是长度为 ${length}、两端绝热的杆的初始温度。当 $t \\to \\infty$ 时，杆趋近于什么均匀温度？`,
      ),
      answer,
      [Q.of(plain, pieces.length), Q.of(total, 1), Q.of(0, 1), Q.of(Math.max(...pieces.map((p) => p.u)), 1)],
      t(
        `No heat leaves, so the final temperature is the average over the length: $\\frac{${parts}}{${length}} = ${answer.toLatex()}$.`,
        `热量不会散失，所以最终温度是沿长度的平均值：$\\frac{${parts}}{${length}} = ${answer.toLatex()}$。`,
      ),
      drawn(
        { xMin: 0, xMax: length, yMin: 0, yMax: 10, yName: "u" },
        pieces.map((p): PlaneMark => ({ kind: "segment", a: [p.from, p.u], b: [p.to, p.u], accent: true })),
        t(`A piecewise constant temperature over a rod of length ${length}.`, `长度为 ${length} 的杆上分段为常数的温度。`),
      ),
    );
  },
};

const standingWave: KnowledgePointDef = {
  id: "the-period-of-a-standing-wave",
  title: t("The period of a standing wave", "驻波的周期"),
  explanation: t(
    "A string fixed at both ends vibrates in modes $\\sin(n \\pi x / L)$, and $n$ is the number of loops you can count between the ends. Each mode oscillates in time with angular frequency $n \\pi c / L$, so its period is $2L / (nc)$. More loops mean a faster vibration, which is why a harmonic sounds higher than the fundamental.",
    "两端固定的弦按 $\\sin(n \\pi x / L)$ 的模态振动，$n$ 就是两端之间能数出的波腹个数。每个模态随时间振动的角频率是 $n \\pi c / L$，所以周期是 $2L / (nc)$。波腹越多，振动越快，所以泛音比基音高。",
  ),
  generate(rng) {
    const n = rng.int(1, 5);
    const length = rng.pick([4, 6, 8, 10]);
    const c = rng.int(1, 3);
    const answer = Q.of(2 * length, n * c);
    return numeric(
      t(
        `A string of length ${length}, fixed at both ends with wave speed ${c}, vibrates in the standing wave shown at its two extremes. What is the period of the vibration?`,
        `长度为 ${length}、两端固定、波速为 ${c} 的弦按图中的驻波振动，图中画出了两个极端位置。振动周期是多少？`,
      ),
      answer,
      [Q.of(2 * length, c), Q.of(length, n * c), Q.of(n * c, 2 * length), Q.of(2 * length, (n + 1) * c)],
      t(
        `The drawing has ${n} ${n === 1 ? "loop" : "loops"}, so this is mode $n = ${n}$. Its period is $\\frac{2L}{nc} = ${2 * length} \\div ${n * c} = ${answer.toLatex()}$.`,
        `图中有 ${n} 个波腹，所以这是 $n = ${n}$ 的模态。周期是 $\\frac{2L}{nc} = ${2 * length} \\div ${n * c} = ${answer.toLatex()}$。`,
      ),
      drawn(
        { xMin: 0, xMax: length, yMin: -2, yMax: 2, labelEvery: length > 6 ? 2 : 1, yName: "u" },
        [
          { kind: "curve", f: (x) => 1.6 * Math.sin((n * Math.PI * x) / length), from: 0, to: length, accent: true },
          { kind: "curve", f: (x) => -1.6 * Math.sin((n * Math.PI * x) / length), from: 0, to: length, dashed: true },
        ],
        t(
          `A standing wave on a string of length ${length}, drawn at its two extremes.`,
          `长度为 ${length} 的弦上的驻波，画出了两个极端位置。`,
        ),
      ),
    );
  },
};

const splitPulse: KnowledgePointDef = {
  id: "the-value-of-a-splitting-pulse",
  title: t("The value of a splitting pulse", "分裂脉冲的值"),
  explanation: t(
    "When a string starts at rest, d'Alembert's formula reads $u(x, t) = \\frac{1}{2} \\left[ f(x - ct) + f(x + ct) \\right]$. The initial shape splits into two half-height copies moving in opposite directions at speed $c$. To find a value, look back a distance $ct$ on each side, read the initial shape at both places, and average the two readings.",
    "弦从静止开始时，达朗贝尔公式是 $u(x, t) = \\frac{1}{2} \\left[ f(x - ct) + f(x + ct) \\right]$。初始形状分裂成两个一半高的副本，以速度 $c$ 向相反方向移动。求某点的值，就在两侧各退后距离 $ct$，读出那两处的初始形状，再取平均。",
  ),
  generate(rng) {
    const [half, height] = rng.pick([
      [2, 4],
      [4, 4],
      [3, 6],
    ] as const);
    const f = (x: number) => Math.max(0, height * (1 - Math.abs(x) / half));
    const c = rng.int(1, 2);
    const time = rng.int(1, 3);
    const reach = c * time;
    const offset = rng.int(1 - half, half - 1);
    const x = rng.pick([1, -1]) * reach + offset;
    const [behind, ahead] = [f(x - reach), f(x + reach)];
    const answer = Q.of(behind + ahead, 2);
    return numeric(
      t(
        `A string starts at rest with the shape $u(x, 0)$ shown, and it obeys $u_{tt} = ${c * c === 1 ? "" : c * c} u_{xx}$ on the whole line. Find $u(${x}, ${time})$.`,
        `弦从静止开始，初始形状 $u(x, 0)$ 如图，满足整条直线上的 $u_{tt} = ${c * c === 1 ? "" : c * c} u_{xx}$。求 $u(${x}, ${time})$。`,
      ),
      answer,
      [Q.of(behind + ahead, 1), Q.of(f(x), 1), Q.of(f(x), 2), Q.of(behind, 1), Q.of(ahead, 1), Q.of(height, 2)],
      t(
        `Here $c = ${c}$, so $ct = ${reach}$. The shape at $x = ${x - reach}$ is ${behind} and at $x = ${x + reach}$ is ${ahead}, and d'Alembert's formula averages them to $${answer.toLatex()}$.`,
        `这里 $c = ${c}$，所以 $ct = ${reach}$。形状在 $x = ${x - reach}$ 处是 ${behind}，在 $x = ${x + reach}$ 处是 ${ahead}，达朗贝尔公式取平均得 $${answer.toLatex()}$。`,
      ),
      drawn(
        { xMin: -8, xMax: 8, yMin: -1, yMax: 7, labelEvery: 2, yName: "u" },
        [{ kind: "path", points: tent(0, half, height, -8, 8), accent: true }],
        t(
          `A tent-shaped initial position centered at 0, of height ${height} and half-width ${half}.`,
          `以 0 为中心的帐篷形初始位置，高 ${height}，半宽 ${half}。`,
        ),
      ),
    );
  },
};

const stencilStep: KnowledgePointDef = {
  id: "one-step-on-a-difference-grid",
  title: t("One step on a difference grid", "差分网格上走一步"),
  explanation: t(
    "The explicit scheme for the heat equation is $u_j^{n+1} = u_j^n + r \\left( u_{j-1}^n - 2 u_j^n + u_{j+1}^n \\right)$, where $r = \\alpha \\Delta t / (\\Delta x)^2$. It uses three neighbouring values in the row below to compute one value in the next row. A point lower than the average of its neighbours warms up, and a higher one cools down.",
    "热方程的显式格式是 $u_j^{n+1} = u_j^n + r \\left( u_{j-1}^n - 2 u_j^n + u_{j+1}^n \\right)$，其中 $r = \\alpha \\Delta t / (\\Delta x)^2$。它用下面一行相邻的三个值算出上一行的一个值。比两邻平均值低的点会升温，高的点会降温。",
  ),
  generate(rng) {
    const values = Array.from({ length: 5 }, () => rng.int(1, 9) * rng.pick([2, 4]));
    const r = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(1, 8)]);
    const [left, here, right] = [values[1] as number, values[2] as number, values[3] as number];
    const change = Q.of(left - 2 * here + right, 1);
    const answer = Q.of(here, 1).add(r.mul(change));
    const name = "j";
    return numeric(
      t(
        `The bottom row holds the values $u_j^n$ of the explicit heat scheme with $r = ${r.toLatex()}$. Find the value in the ringed cell of the row above, at time level $n + 1$.`,
        `下面一行是显式热方程格式的值 $u_j^n$，$r = ${r.toLatex()}$。求上面一行（时间层 $n + 1$）带圈格子里的值。`,
      ),
      answer,
      [r.mul(change), Q.of(here, 1).add(r.mul(Q.of(left + 2 * here + right, 1))), Q.of(left + right, 2), Q.of(here, 1).sub(r.mul(change))],
      t(
        `Using the three cells below it: $${here} + ${r.toLatex()} \\left( ${left} - 2 \\cdot ${here} + ${right} \\right) = ${answer.toLatex()}$.`,
        `用它下方的三个格子：$${here} + ${r.toLatex()} \\left( ${left} - 2 \\cdot ${here} + ${right} \\right) = ${answer.toLatex()}$。`,
      ),
      grid(
        ["n+1", "n"],
        [`${name}-2`, `${name}-1`, name, `${name}+1`, `${name}+2`],
        [["", "", "?", "", ""], values.map(String)],
        t(
          "A grid with five values in the bottom row and one ringed empty cell in the middle of the row above.",
          "网格的下面一行有五个值，上面一行中间有一个带圈的空格。",
        ),
      ),
    );
  },
};

const fivePoint: KnowledgePointDef = {
  id: "the-five-point-average",
  title: t("The five-point average", "五点平均"),
  explanation: t(
    "On a square grid, the discrete form of Laplace's equation says that each interior value is the average of its four neighbours. This is the grid version of the mean value property, and it is why a harmonic function has no interior peaks: a point cannot be higher than all of its neighbours if it equals their average.",
    "在正方形网格上，拉普拉斯方程的离散形式是：每个内部点的值等于四个相邻点的平均值。这是平均值性质的网格版本，也说明调和函数内部没有峰值：一个点如果等于相邻点的平均值，就不可能比它们都高。",
  ),
  generate(rng) {
    const center = rng.int(10, 16);
    const others = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)].map((d) => center + d);
    const fourth = 4 * center - (others[0] as number) - (others[1] as number) - (others[2] as number);
    const askCenter = rng.bool();
    const positions: Point[] = [
      [160, 26],
      [240, 96],
      [160, 166],
      [80, 96],
    ];
    const missing = rng.int(0, 3);
    const around = rng.shuffle([...others, fourth]);
    const hidden = around[missing] as number;
    const answer = askCenter ? center : hidden;
    const known = around.filter((_, i) => i !== missing);
    const sum3 = known.reduce((a, b) => a + b, 0);
    const spokes: readonly (readonly [number, number, number, number])[] = [
      [160, 80, 160, 38],
      [176, 96, 228, 96],
      [160, 112, 160, 154],
      [144, 96, 92, 96],
    ];
    const lines = spokes.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join("");
    const nodes = positions.map((p, i) => (!askCenter && i === missing ? ringed(p) + node(p, "?") : node(p, String(around[i])))).join("");
    const middle = askCenter ? ringed([160, 96]) + node([160, 96], "?") : node([160, 96], String(center));
    const solution = askCenter
      ? t(
          `The center is the average of its four neighbours: $\\frac{${around.join(" + ")}}{4} = ${center}$.`,
          `中心等于四个相邻点的平均值：$\\frac{${around.join(" + ")}}{4} = ${center}$。`,
        )
      : t(
          `The four neighbours must add up to $4 \\cdot ${center} = ${4 * center}$. The three known ones add up to ${sum3}, so the last is ${hidden}.`,
          `四个相邻点的和必须是 $4 \\cdot ${center} = ${4 * center}$。已知的三个之和是 ${sum3}，所以最后一个是 ${hidden}。`,
        );
    return numeric(
      t(
        "These five grid values satisfy the discrete Laplace equation at the center. Which number belongs in the ringed node?",
        "这五个网格值在中心处满足离散拉普拉斯方程。带圈的结点应填哪个数？",
      ),
      answer,
      askCenter
        ? [
            around.reduce((a, b) => a + b, 0),
            center + 1,
            Q.of(
              known.reduce((a, b) => a + b, 0),
              3,
            ),
            Math.max(...around),
          ]
        : [Q.of(sum3, 3), center, 4 * center + sum3, hidden + 1, sum3 - center],
      solution,
      {
        svg: svgDocument(192, lines + nodes + middle),
        alt: t(
          "A center node joined to four neighbours, with one node ringed and unknown.",
          "中心结点与四个相邻结点相连，其中一个结点带圈且未知。",
        ),
      },
    );
  },
};

/** collegeFigurePoints holds the drawing-reading knowledge points of Number Theory, Real Analysis and Partial Differential Equations, by topic id. */
export const collegeFigurePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-sieve-of-eratosthenes": [sieveLeftover],
  "modular-congruence": [residueClock],
  "the-order-of-an-integer-modulo-n": [orderFromCycle],
  "the-chinese-remainder-theorem": [remainderTable],
  "linear-diophantine-equations": [latticeOnLine],
  "the-euclidean-algorithm": [gcdFromSquares],
  "continued-fractions": [fractionFromSquares],
  "the-epsilon-definition-for-sequences": [epsilonBand],
  "limit-superior-and-limit-inferior": [limsupFromPlot],
  "defining-continuity-at-a-point": [continuityFailure],
  "epsilon-delta-proofs-of-limits": [deltaFromLine],
  "bounds-from-the-mean-value-theorem": [secantSlope],
  "upper-and-lower-darboux-sums": [darbouxFromDrawing],
  "riemann-integrability": [stepGap],
  "pointwise-and-uniform-convergence": [convergenceFromGraphs],
  "the-transport-equation": [speedFromSnapshots],
  "the-method-of-characteristics": [traceCharacteristic],
  "the-heat-equation": [heatOrder],
  "the-heat-equation-with-insulated-ends": [insulatedMean],
  "the-wave-equation-on-a-finite-string": [standingWave],
  "dalemberts-formula": [splitPulse],
  "finite-differences-for-the-heat-equation": [stencilStep],
  "laplaces-equation": [fivePoint],
};
