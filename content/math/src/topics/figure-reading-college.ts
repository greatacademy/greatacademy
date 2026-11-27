// Knowledge points that ask a learner to read a drawing, for Number Theory, Real Analysis
// and Partial Differential Equations. See `collegeFigurePoints`.

import type { Figure, KnowledgePointDef, Text } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { dec, Q, svgDocument } from "@ga/subject-math";
import { proofDrawings1 } from "../explanation-drawings-methods-of-proof-1.ts";
import { numberTheoryDrawings1 } from "../explanation-drawings-number-theory-1.ts";
import { analysisDrawings1 } from "../explanation-drawings-real-analysis-1.ts";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { table } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { arrowLine, drawn, label, node, numeric, pickChoice, ring } from "./figure-reading-more.ts";
import { chosen, type Miss, type Slip, until, type Walk, worked } from "./number-theory-course.ts";

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
    "A number that survives the crossing out of the multiples of 2, 3 and 5 is not yet proved prime. It has no factor among those three, but it may still be a product of larger primes, such as $7 \\times 7$ or $7 \\times 11$. The sieve only finishes once it has used every prime up to the square root of the largest number in the table. From $41$ to $50$, the numbers left standing are $41, 43, 47, 49$, and $49 = 7 \\times 7$ is not prime.\n\nCheck: $\\sqrt{50} < 8$, so crossing out the multiples of $7$ as well finishes the sieve there; it removes only $49$, and $41, 43, 47$ are prime.\n\n> **Watch out.** Surviving 2, 3 and 5 is not the same as being prime: the first such survivors that are composite are $49 = 7 \\times 7$, $77 = 7 \\times 11$ and $91 = 7 \\times 13$.",
    "划掉 2、3、5 的倍数后留下的数，还不能说一定是质数。它没有这三个因数，却可能是更大质数的积，比如 $7 \\times 7$ 或 $7 \\times 11$。只有用完不超过表中最大数平方根的所有质数，筛法才算结束。从 $41$ 到 $50$，留下的数是 $41, 43, 47, 49$，而 $49 = 7 \\times 7$ 不是质数。\n\n检验：$\\sqrt{50} < 8$，所以再划掉 $7$ 的倍数，那一段的筛法就结束了；它只划掉 $49$，而 $41, 43, 47$ 都是质数。\n\n> **注意。** 没被 2、3、5 筛掉并不等于是质数：这样留下的合数中，最先出现的是 $49 = 7 \\times 7$、$77 = 7 \\times 11$ 和 $91 = 7 \\times 13$。",
  ),
  generate(rng) {
    const start = rng.int(21, 150);
    const numbers = Array.from({ length: 30 }, (_, i) => start + i);
    const crossed = (n: number) => n % 2 === 0 || n % 3 === 0 || n % 5 === 0;
    const standing = numbers.filter((n) => !crossed(n));
    const composites = standing.filter((n) => !isPrime(n));
    const answer = rng.pick(composites);
    const factor = [7, 11, 13].find((p) => answer % p === 0) as number;
    const cells = numbers.map((n, i) => {
      const [x, y] = [50 + (i % 6) * 44, 20 + Math.floor(i / 6) * 28];
      const strike = crossed(n) ? `<line x1="${x - 15}" y1="${y + 5}" x2="${x + 15}" y2="${y - 9}" stroke-width="1"/>` : "";
      return label(x, y, String(n)) + strike;
    });
    const small = (n: number) => [7, 11, 13].filter((p) => p * p <= n);
    const wrong: Slip[] = rng.sample(standing.filter(isPrime), 3).map((n): Slip => {
      const tests = small(n);
      return [
        [`$${n}$`, `$${n}$`],
        tests.length === 0
          ? `$${n}$ is prime: it is below $49 = 7 \\times 7$, so a factor would have to be 2, 3 or 5, and those are crossed out.`
          : `$${n}$ is prime: besides 2, 3 and 5, the primes up to $\\sqrt{${n}}$ are $${tests.join(", ")}$, and none of them divides it.`,
        tests.length === 0
          ? `$${n}$ 是质数：它小于 $49 = 7 \\times 7$，所以因数只能是 2、3 或 5，而这些的倍数都已划掉。`
          : `$${n}$ 是质数：除了 2、3、5，不超过 $\\sqrt{${n}}$ 的质数是 $${tests.join(", ")}$，它们都不整除它。`,
      ];
    });
    return chosen(
      rng,
      [
        "In this stretch of a sieve, every multiple of 2, 3 and 5 has been crossed out. Which number still standing is not prime?",
        "在筛表的这一段里，2、3、5 的倍数都已划掉。还留着的数中，哪一个不是质数？",
      ],
      [`$${answer}$`, `$${answer}$`],
      wrong,
      [
        [
          ["Read the survivors", "读出留下的数"],
          [
            `The numbers left standing are $${standing.join(", ")}$; none has a factor 2, 3 or 5.`,
            `留下的数是 $${standing.join(", ")}$；它们都没有因数 2、3、5。`,
          ],
        ],
        [
          ["Test the next primes", "用后面的质数检验"],
          [
            `Trying 7, 11 and 13 finds $${answer} = ${factor} \\times ${answer / factor}$, so its smallest prime factor is ${factor}, larger than 5, and the sieve has not reached it yet.`,
            `用 7、11、13 去试，得到 $${answer} = ${factor} \\times ${answer / factor}$，所以它最小的质因数是 ${factor}，比 5 大，筛法还没有筛到它。`,
          ],
        ],
      ],
      [
        `$14 \\times 14 = 196 > ${start + 29}$, so crossing out the multiples of 7, 11 and 13 finishes the sieve; it removes $${composites.join(", ")}$ and nothing else.`,
        `$14 \\times 14 = 196 > ${start + 29}$，所以再划掉 7、11、13 的倍数，筛法就结束了；它划掉的是 $${composites.join(", ")}$，没有别的。`,
      ],
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
  figure: proofDrawings1["modular-congruence#walking-around-a-residue-clock"],
  title: t("Walking around a residue clock", "在余数钟面上走"),
  explanation: t(
    "The residues modulo $n$ sit on a circle, because adding $n$ brings you back to where you started. Each full turn of $n$ steps changes nothing, so only the remainder of the step count matters. Moving backward works the same way: the walk simply runs the other way around the clock.\n\n> **Watch out.** The answer is where the walk ends, not the remainder of the step count alone: add that remainder to the starting residue, or take it away when the walk runs counterclockwise.",
    "模 $n$ 的余数排在一个圆上，因为加上 $n$ 就回到原处。每走满 $n$ 步一整圈，位置不变，所以只有步数除以 $n$ 的余数起作用。往回走也一样，只是沿钟面反方向走。\n\n> **注意。** 答案是走到的位置，而不只是步数的余数：要把这个余数加到起点上，逆时针走时则从起点减去。",
  ),
  generate(rng) {
    const n = rng.int(5, 12);
    const start = rng.int(0, n - 1);
    const steps = rng.int(n + 1, 4 * n);
    const clockwise = rng.bool();
    const answer = (((start + (clockwise ? steps : -steps)) % n) + n) % n;
    const other = (((start + (clockwise ? -steps : steps)) % n) + n) % n;
    const r = steps % n;
    const at = ring(n, 85);
    const names = Array.from({ length: n }, (_, i) => String(i));
    const sign = clockwise ? "+" : "-";
    return numeric(
      t(
        `The clock shows the residues modulo $${n}$. Start at the ringed ${start} and move ${steps} steps ${clockwise ? "clockwise" : "counterclockwise"}. Which residue do you reach?`,
        `钟面上是模 $${n}$ 的余数。从带圈的 ${start} 出发，沿${clockwise ? "顺" : "逆"}时针走 ${steps} 步。走到哪个余数？`,
      ),
      answer,
      [other, r, start + steps, (answer + 1) % n],
      walked(
        [
          [
            ["Drop the full turns", "去掉整圈"],
            t(
              `$${steps} = ${n} \\cdot ${Math.floor(steps / n)} + ${r}$, and each full turn of $${n}$ steps changes nothing, so only $${r}$ steps matter.`,
              `$${steps} = ${n} \\cdot ${Math.floor(steps / n)} + ${r}$，每走满 $${n}$ 步一圈位置不变，所以只有 $${r}$ 步起作用。`,
            ),
          ],
          [
            ["Take the remaining steps", "走剩下的步数"],
            t(
              `${clockwise ? "Clockwise" : "Counterclockwise"} from ${start}: $${start} ${sign} ${r} \\equiv ${answer} \\pmod{${n}}$.`,
              `从 ${start} 沿${clockwise ? "顺" : "逆"}时针走：$${start} ${sign} ${r} \\equiv ${answer} \\pmod{${n}}$。`,
            ),
          ],
        ],
        t(
          `$${start} ${sign} ${steps} = ${clockwise ? start + steps : start - steps}$, which leaves remainder $${answer}$ on division by $${n}$, the same residue.`,
          `$${start} ${sign} ${steps} = ${clockwise ? start + steps : start - steps}$，除以 $${n}$ 的余数是 $${answer}$，是同一个余数。`,
        ),
      ),
      {
        svg: svgDocument(220, ringed(at[start] as Point) + names.map((name, i) => node(at[i] as Point, name)).join("")),
        alt: t(
          `The residues from 0 to ${n - 1} evenly spaced clockwise on a circle, with ${start} ringed.`,
          `0 到 ${n - 1} 的余数沿顺时针均匀排在圆上，${start} 带圈。`,
        ),
      },
      "integer",
      [
        why(
          other,
          `That walks the other way around the clock; the walk goes ${clockwise ? "clockwise" : "counterclockwise"}.`,
          `这是朝钟面的另一个方向走；应沿${clockwise ? "顺" : "逆"}时针走。`,
        ),
        why(
          r,
          `$${r}$ is the remainder of the step count; the walk starts at ${start}, not at $0$.`,
          `$${r}$ 是步数的余数；起点是 ${start}，不是 $0$。`,
        ),
        why(
          start + steps,
          `$${start + steps}$ is not a residue on the clock; reduce it modulo $${n}$.`,
          `$${start + steps}$ 不是钟面上的余数；要对 $${n}$ 取模。`,
        ),
        why(
          (answer + 1) % n,
          "That is the residue next to where the walk ends; count the remaining steps again.",
          "这是终点旁边的余数；把剩下的步数重新数一遍。",
        ),
      ],
    );
  },
};

const orderFromCycle: KnowledgePointDef = {
  id: "the-order-from-a-cycle-of-arrows",
  title: t("The order from a cycle of arrows", "由箭头环读阶"),
  explanation: t(
    "Repeated multiplication by $a$ modulo a prime walks through residues and eventually returns to 1. The order of $a$ is the number of steps in that closed walk. It counts arrows, not the size of the whole number system, and it always divides $p - 1$, which is a quick check on the count. Modulo $13$, multiplying by $3$ walks $1 \\to 3 \\to 9 \\to 1$, three arrows, so the order of $3$ is $3$.\n\nCheck: $3^{3} = 27 = 2 \\times 13 + 1$, and $3$ divides $12$.\n\n> **Watch out.** Count the arrows of the closed walk, not the residues on the whole circle, and do not count the $1$ at the start and the $1$ at the end as two stops.",
    "模质数反复乘 $a$，会依次走过一些余数，最后回到 1。$a$ 的阶就是这条闭合路线的步数。要数的是箭头，不是整个余数系的大小，而且阶总能整除 $p - 1$，可以用来快速检验。模 $13$ 时，反复乘 $3$ 走过 $1 \\to 3 \\to 9 \\to 1$，共三个箭头，所以 $3$ 的阶是 $3$。\n\n检验：$3^{3} = 27 = 2 \\times 13 + 1$，而 $3$ 整除 $12$。\n\n> **注意。** 数的是闭合路线上的箭头，而不是整个圆上的余数；也不要把起点的 $1$ 和终点的 $1$ 算成两站。",
  ),
  generate(rng) {
    return until(() => {
      const p = rng.pick([7, 11, 13, 17]);
      const a = rng.int(2, p - 2);
      const orbit = [1];
      while (((orbit.at(-1) as number) * a) % p !== 1) orbit.push(((orbit.at(-1) as number) * a) % p);
      const order = orbit.length;
      const last = orbit.at(-1) as number;
      const at = ring(p - 1, 85);
      const names = Array.from({ length: p - 1 }, (_, i) => String(i + 1));
      const arrows = orbit.map((x, i) => arrowLine(at[x - 1] as Point, at[(orbit[(i + 1) % order] as number) - 1] as Point));
      const misses: Miss[] = [
        [
          p - 1,
          `$${p - 1}$ is the number of residues on the circle; the walk passes through only $${order}$ of them.`,
          `$${p - 1}$ 是圆上余数的个数；路线只经过其中 $${order}$ 个。`,
        ],
        [order + 1, "That counts the $1$ at the start and the $1$ at the end as two stops.", "那把起点的 $1$ 和终点的 $1$ 算成了两站。"],
        [order - 1, "That leaves out the last arrow, the one that leads back to $1$.", "那漏掉了最后一个箭头，即回到 $1$ 的那一个。"],
        [a, `$${a}$ is the multiplier, not the number of arrows.`, `$${a}$ 是乘数，不是箭头的个数。`],
      ];
      return worked(
        [
          `The arrows show repeated multiplication by ${a} modulo ${p}, starting at 1. What is the order of ${a} modulo ${p}?`,
          `箭头表示从 1 出发，模 ${p} 反复乘 ${a}。${a} 模 ${p} 的阶是多少？`,
        ],
        order,
        misses,
        [
          [
            ["Follow the arrows", "沿箭头走"],
            [`The walk goes $${[...orbit, 1].join(" \\to ")}$.`, `路线是 $${[...orbit, 1].join(" \\to ")}$。`],
          ],
          [
            ["Count the arrows", "数箭头"],
            [
              `It first returns to $1$ after $${order}$ arrows, so the order is $${order}$.`,
              `走过 $${order}$ 个箭头后第一次回到 $1$，所以阶是 $${order}$。`,
            ],
          ],
        ],
        [
          `The last arrow is $${last} \\times ${a} = ${last * a} = ${Math.floor((last * a) / p)} \\times ${p} + 1$, so $${a}^{${order}} \\equiv 1$; and $${order}$ divides $${p - 1}$, as an order must.`,
          `最后一个箭头是 $${last} \\times ${a} = ${last * a} = ${Math.floor((last * a) / p)} \\times ${p} + 1$，所以 $${a}^{${order}} \\equiv 1$；而 $${order}$ 整除 $${p - 1}$，阶理应如此。`,
        ],
        {
          svg: svgDocument(220, arrows.join("") + names.map((name, i) => node(at[i] as Point, name)).join("")),
          alt: t(
            `The residues from 1 to ${p - 1} on a circle, with a closed walk of arrows starting at 1.`,
            `1 到 ${p - 1} 的余数排在圆上，箭头构成从 1 出发的闭合路线。`,
          ),
        },
      );
    });
  },
};

const remainderTable: KnowledgePointDef = {
  id: "filling-a-remainder-table",
  title: t("Filling a remainder table", "填余数表"),
  explanation: t(
    "Give each number a row by its remainder on one modulus and a column by its remainder on the other. Counting 0, 1, 2, and so on walks diagonally through the table, wrapping at the edges. When the moduli are coprime the walk meets every cell exactly once, which is the Chinese Remainder Theorem seen as a picture.\n\n> **Watch out.** A cell's number is not built from its row and column by adding or multiplying them. It is the one number below $mn$ with both remainders, so search one row's numbers for the right column.",
    "按一个模的余数给每个数定行，按另一个模的余数定列。从 0、1、2 依次数下去，就沿对角线走过表格，到边上再绕回来。两个模互质时，这条路线每格恰好经过一次，这就是中国剩余定理的图像。\n\n> **注意。** 格子里的数不是把行号和列号相加或相乘得到的。它是小于 $mn$ 且同时有这两个余数的那个数，所以要在一行的数里找出列号对的那个。",
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
    const row = answer % m;
    const column = answer % n;
    const inRow = Array.from({ length: n }, (_, k) => row + k * m);
    const cells = Array.from({ length: m }, (_, r) =>
      Array.from({ length: n }, (_, c) => {
        const x = Array.from({ length: m * n }, (_, v) => v).find((v) => v % m === r && v % n === c) as number;
        if (x === answer) return "?";
        return x <= placed ? String(x) : "";
      }),
    );
    const off = (x: number): [string, string] =>
      x >= m * n
        ? [
            `$${x}$ is beyond the table, which holds the numbers from $0$ to $${m * n - 1}$.`,
            `$${x}$ 超出了表格，表中只有 $0$ 到 $${m * n - 1}$ 的数。`,
          ]
        : [
            `$${x}$ belongs in row $${x % m}$, column $${x % n}$, not in the ringed cell.`,
            `$${x}$ 应放在第 $${x % m}$ 行、第 $${x % n}$ 列，不在带圈的格子里。`,
          ];
    return numeric(
      t(
        `Each whole number $x$ from 0 to ${m * n - 1} belongs in the cell with row $x \\bmod ${m}$ and column $x \\bmod ${n}$. The numbers up to ${placed} are in place. Which number belongs in the ringed cell?`,
        `从 0 到 ${m * n - 1} 的每个整数 $x$ 都放在第 $x \\bmod ${m}$ 行、第 $x \\bmod ${n}$ 列。不超过 ${placed} 的数已经放好。带圈的格子里应放哪个数？`,
      ),
      answer,
      [answer + m, answer + n, Math.abs(answer - m), Math.abs(answer - n), row * column, row + column],
      walked(
        [
          [
            ["Read the cell", "读出格子"],
            t(
              `The ringed cell is in row $${row}$ and column $${column}$: remainder $${row}$ on $${m}$ and $${column}$ on $${n}$.`,
              `带圈的格子在第 $${row}$ 行、第 $${column}$ 列：除以 $${m}$ 余 $${row}$，除以 $${n}$ 余 $${column}$。`,
            ),
          ],
          [
            ["Search the row", "在这一行中查找"],
            t(
              `The numbers below $${m * n}$ in row $${row}$ are $${inRow.join(", ")}$, and the one that leaves $${column}$ on division by $${n}$ is $${answer}$.`,
              `第 $${row}$ 行中小于 $${m * n}$ 的数是 $${inRow.join(", ")}$，其中除以 $${n}$ 余 $${column}$ 的是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer} = ${m} \\cdot ${Math.floor(answer / m)} + ${row}$ and $${answer} = ${n} \\cdot ${Math.floor(answer / n)} + ${column}$. Since $${m}$ and $${n}$ are coprime, no other number below $${m * n}$ shares both remainders.`,
          `$${answer} = ${m} \\cdot ${Math.floor(answer / m)} + ${row}$，$${answer} = ${n} \\cdot ${Math.floor(answer / n)} + ${column}$。$${m}$ 和 $${n}$ 互质，所以小于 $${m * n}$ 的数中没有别的数同时有这两个余数。`,
        ),
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
      [
        why(
          row * column,
          "That multiplies the row and column numbers; the cell holds the number with those two remainders.",
          "这是把行号和列号相乘；格子里放的是有这两个余数的数。",
        ),
        why(
          row + column,
          "That adds the row and column numbers; the cell holds the number with those two remainders.",
          "这是把行号和列号相加；格子里放的是有这两个余数的数。",
        ),
        why(answer + m, ...off(answer + m)),
        why(answer + n, ...off(answer + n)),
        why(Math.abs(answer - m), ...off(Math.abs(answer - m))),
        why(Math.abs(answer - n), ...off(Math.abs(answer - n))),
      ],
    );
  },
};

const latticeOnLine: KnowledgePointDef = {
  id: "the-next-whole-number-point-on-a-line",
  title: t("The next whole-number point on a line", "直线上的下一个整点"),
  explanation: t(
    "All integer solutions of $ax + by = c$ lie evenly spaced along its line. From one solution, the next is found by adding $b / d$ to $x$ and subtracting $a / d$ from $y$, where $d = \\gcd(a, b)$. Forgetting to divide by $d$ still lands on a solution, but it skips the ones in between.\n\n> **Watch out.** $x$ moves by the reduced coefficient of $y$, and $y$ by the reduced coefficient of $x$, in opposite directions. Swapping them, or moving both the same way, leaves the line.",
    "$ax + by = c$ 的所有整数解等距排在这条直线上。从一个解出发，$x$ 加 $b / d$，$y$ 减 $a / d$，就得到下一个解，其中 $d = \\gcd(a, b)$。忘了除以 $d$ 虽然仍落在解上，却跳过了中间的解。\n\n> **注意。** $x$ 按 $y$ 的约简系数移动，$y$ 按 $x$ 的约简系数移动，方向相反。把它们交换，或者朝同一方向移动，都会离开这条直线。",
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
    const key = (x: number, y: number) => `$(${x}, ${y})$`;
    const lhs = `${A === 1 ? "" : A}x + ${B === 1 ? "" : B}y`;
    const off = A * (x0 + 1) + B * (y0 - 1);
    const problem = pickChoice(
      rng,
      t(
        `The line $${lhs} = ${c}$ passes through the marked point $(${x0}, ${y0})$. Moving right along the line, which is the next point with whole-number coordinates?`,
        `直线 $${lhs} = ${c}$ 经过标出的点 $(${x0}, ${y0})$。沿直线向右走，下一个坐标都是整数的点是哪个？`,
      ),
      point(x0 + b, y0 - a),
      [point(x0 + B, y0 - A), point(x0 + a, y0 - b), point(x0 + b, y0 + a), point(x0 + a, y0 + b), point(x0 + 1, y0 - 1)],
      walked(
        [
          [
            ["Find the step", "求步长"],
            t(
              `$\\gcd(${A}, ${B}) = ${d}$, so the reduced coefficients are $${a}$ and $${b}$: each solution is the last one with $${b}$ added to $x$ and $${a}$ taken from $y$.`,
              `$\\gcd(${A}, ${B}) = ${d}$，所以约简后的系数是 $${a}$ 和 $${b}$：每个解都是上一个解的 $x$ 加 $${b}$、$y$ 减 $${a}$。`,
            ),
          ],
          [
            ["Take one step", "走一步"],
            t(`From $(${x0}, ${y0})$ this gives $(${x0 + b}, ${y0 - a})$.`, `从 $(${x0}, ${y0})$ 出发得到 $(${x0 + b}, ${y0 - a})$。`),
          ],
        ],
        t(
          `$${A} \\cdot ${x0 + b} + ${B} \\cdot ${y0 - a < 0 ? `(${y0 - a})` : y0 - a} = ${A * (x0 + b)} ${y0 - a < 0 ? "-" : "+"} ${Math.abs(B * (y0 - a))} = ${c}$, so the point is on the line.`,
          `$${A} \\cdot ${x0 + b} + ${B} \\cdot ${y0 - a < 0 ? `(${y0 - a})` : y0 - a} = ${A * (x0 + b)} ${y0 - a < 0 ? "-" : "+"} ${Math.abs(B * (y0 - a))} = ${c}$，所以这个点在直线上。`,
        ),
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
    return reasoned(problem, [
      ...(d > 1
        ? [
            [
              key(x0 + B, y0 - A),
              `That steps by the full coefficients; dividing them by the gcd $${d}$ gives a shorter step, and this point skips one solution.`,
              `这是按完整的系数走的；除以最大公因数 $${d}$ 后步长更短，这个点跳过了一个解。`,
            ] as const,
          ]
        : []),
      [
        key(x0 + a, y0 - b),
        "That swaps the steps: $x$ moves by the coefficient of $y$, not of $x$.",
        "这把步长交换了：$x$ 应按 $y$ 的系数移动，而不是按 $x$ 的系数。",
      ],
      [
        key(x0 + b, y0 + a),
        "The line falls to the right, so $y$ must go down as $x$ goes up.",
        "直线向右下降，所以 $x$ 增大时 $y$ 必须减小。",
      ],
      [
        key(x0 + a, y0 + b),
        "That swaps the steps and goes up; the line falls to the right.",
        "这既交换了步长，又向上走了；而直线向右下降。",
      ],
      [
        key(x0 + 1, y0 - 1),
        `That point is off the line: it gives $${off}$, not $${c}$.`,
        `这个点不在直线上：它给出 $${off}$，而不是 $${c}$。`,
      ],
    ]);
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
  figure: proofDrawings1["the-euclidean-algorithm#the-gcd-from-cutting-squares"],
  title: t("The GCD from cutting squares", "切正方形求最大公因数"),
  explanation: t(
    "Cut the largest possible squares from a rectangle, then repeat on the piece left over. Each round is one division in the Euclidean algorithm, since the squares removed are the quotient and the leftover side is the remainder. The last and smallest square has side equal to the greatest common divisor, and it fits evenly into both sides.\n\n> **Watch out.** The leftover after the first round is a remainder, not the answer. Keep cutting until the squares fill the last piece exactly.",
    "从长方形上切下尽可能大的正方形，再对剩下的部分重复。每一轮就是欧几里得算法的一次除法：切下的正方形个数是商，剩下的边是余数。最后最小的正方形边长就是最大公因数，它能整除两条边。\n\n> **注意。** 第一轮后剩下的边是余数，不是答案。要一直切，直到正方形恰好填满最后一块。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(euclidPairs);
    const g = rng.int(1, 4);
    const [a, b] = [p * g, q * g];
    const lines: string[] = [];
    for (let x = a, y = b; y !== 0; [x, y] = [y, x % y]) lines.push(`${x} = ${y} \\cdot ${Math.floor(x / y)} + ${x % y}`);
    return {
      ...numberProblem({
        prompt: t(
          `This ${a} by ${b} rectangle has been cut into squares, always taking the largest that fits. What is the side of the smallest square?`,
          `这个 ${a} 乘 ${b} 的长方形被切成正方形，每次都切下能放下的最大的正方形。最小的正方形边长是多少？`,
        ),
        answer: g,
        form: "integer",
        wrong: [a - b, g + 1, b - (a % b)],
        mistakes: [
          why(a % b, "That is the leftover after the first round of squares; keep cutting.", "这是第一轮切完后剩下的边；还要继续切。"),
          why(b, "That is the side of the largest squares.", "这是最大的正方形的边长。"),
        ],
        solution: walked(
          [
            [
              ["Follow the cuts", "跟着切法走"],
              t("Each round cuts as many squares as fit, one division each:", "每一轮切下尽可能多的正方形，对应一次除法："),
              lines,
            ],
            [
              ["Read the smallest square", "读出最小的正方形"],
              t(
                `The last division leaves nothing, so the smallest squares have side $${g}$.`,
                `最后一次除法没有剩余，所以最小的正方形边长是 $${g}$。`,
              ),
            ],
          ],
          t(
            `$${g}$ fits evenly into both sides: $${a} = ${g} \\cdot ${p}$ and $${b} = ${g} \\cdot ${q}$.`,
            `$${g}$ 能整除两条边：$${a} = ${g} \\cdot ${p}$，$${b} = ${g} \\cdot ${q}$。`,
          ),
        ),
      }),
      figure: squaresFigure(
        a,
        b,
        t(`A ${a} by ${b} rectangle cut into squares of decreasing size.`, `${a} 乘 ${b} 的长方形被切成一个比一个小的正方形。`),
      ),
    };
  },
};

const fractionFromSquares: KnowledgePointDef = {
  id: "a-continued-fraction-from-squares",
  figure: numberTheoryDrawings1["continued-fractions#a-continued-fraction-from-squares"],
  title: t("A continued fraction from squares", "由正方形读连分数"),
  explanation: t(
    "Cutting a rectangle into the largest possible squares reads off a continued fraction. The number of squares of the largest size is the first entry, the number of the next size is the second entry, and so on. In the notation $[q_0; q_1, q_2]$ the first entry is the whole part of the ratio of the sides. A 30 by 13 rectangle holds 2 squares of side 13, then 3 of side 4, then 4 of side 1, so $\\frac{30}{13} = [2; 3, 4]$.\n\nCheck: $2 + \\frac{1}{3 + \\frac{1}{4}} = 2 + \\frac{4}{13} = \\frac{30}{13}$.\n\n> **Watch out.** Read the sizes from the largest down: the first entry counts the largest squares and is the whole part of the ratio, here $2$, since $26 \\le 30 < 39$.",
    "把长方形切成尽可能大的正方形，就能读出连分数。最大一种正方形的个数是第一项，次大一种的个数是第二项，依此类推。在记号 $[q_0; q_1, q_2]$ 中，第一项是两边之比的整数部分。30 乘 13 的长方形放下 2 个边长 13 的正方形，然后 3 个边长 4 的，再然后 4 个边长 1 的，所以 $\\frac{30}{13} = [2; 3, 4]$。\n\n检验：$2 + \\frac{1}{3 + \\frac{1}{4}} = 2 + \\frac{4}{13} = \\frac{30}{13}$。\n\n> **注意。** 要从最大的正方形读起：第一项数的是最大的正方形，它是两边之比的整数部分，这里是 $2$，因为 $26 \\le 30 < 39$。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(euclidPairs);
    const g = rng.int(1, 3);
    const [a, b] = [p * g, q * g];
    const qs = quotients(a, b);
    const cf = (list: readonly number[]): [string, string] => {
      const s = `$[${list[0]}; ${list.slice(1).join(", ")}]$`;
      return [s, s];
    };
    const [first, ...rest] = qs as [number, ...number[]];
    const lines: string[] = [];
    for (let [x, y] = [a, b]; y > 0; [x, y] = [y, x % y]) lines.push(`${x} = ${Math.floor(x / y)} \\times ${y} + ${x % y}`);
    const back = qs.slice(0, -1).reduceRight((v, k) => Q.of(k).add(Q.one.div(v)), Q.of(qs[qs.length - 1] as number));
    const seen = new Set([cf(qs)[0]]);
    const wrong: Slip[] = (
      [
        [
          cf([...qs].reverse()),
          "That reads the squares from the smallest to the largest; the first entry counts the largest squares.",
          "那是从最小的正方形读到最大的；第一项数的是最大的正方形。",
        ],
        [
          cf([first + 1, ...rest]),
          `That counts one more of the largest squares than fit: only $${first}$ squares of side $${b}$ fit along $${a}$.`,
          `那多数了一个最大的正方形：沿 $${a}$ 只能放下 $${first}$ 个边长 $${b}$ 的正方形。`,
        ],
        [
          cf([first, ...rest.map((v, i) => (i === 0 ? v + 1 : v))]),
          "That counts one more square of the second size than the drawing shows.",
          "那比图中多数了一个第二种大小的正方形。",
        ],
        [
          cf([first, ...rest.map((v, i) => (i === rest.length - 1 ? v + 1 : v))]),
          "That counts one more of the smallest squares than the drawing shows.",
          "那比图中多数了一个最小的正方形。",
        ],
      ] as Slip[]
    ).filter(([[en]]) => !seen.has(en) && Boolean(seen.add(en)));
    return chosen(
      rng,
      [
        `This ${a} by ${b} rectangle has been cut into squares, always taking the largest that fits. Which continued fraction equals $\\frac{${a}}{${b}}$?`,
        `这个 ${a} 乘 ${b} 的长方形被切成正方形，每次都切下能放下的最大的正方形。哪个连分数等于 $\\frac{${a}}{${b}}$？`,
      ],
      cf(qs),
      wrong,
      [
        [
          ["Cut the squares", "切正方形"],
          [`Each round is one division: $${lines.join("$, $")}$.`, `每一轮对应一次除法：$${lines.join("$，$")}$。`],
        ],
        [
          ["Read the counts", "读出个数"],
          [
            `From the largest size to the smallest, the numbers of squares are ${qs.join(", ")}, so $\\frac{${a}}{${b}} = [${first}; ${rest.join(", ")}]$.`,
            `从大到小，各种正方形的个数依次是 ${qs.join("、")}，所以 $\\frac{${a}}{${b}} = [${first}; ${rest.join(", ")}]$。`,
          ],
        ],
      ],
      [
        `Working the continued fraction back from its last entry gives $${back.toLatex()}$${g > 1 ? `, and $\\frac{${a}}{${b}} = ${back.toLatex()}$ after cancelling $${g}$` : ""}.`,
        `从最后一项往回算连分数，得到 $${back.toLatex()}$${g > 1 ? `，而 $\\frac{${a}}{${b}}$ 约去 $${g}$ 后正是 $${back.toLatex()}$` : ""}。`,
      ],
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
    "The definition of a limit says that for each $\\varepsilon$ there is an $N$ past which every term stays within $\\varepsilon$ of the limit. In a plot this is a horizontal band around the limit. The point is the word every: a term inside the band proves nothing if a later term leaves, so read from the right and find the last term outside.\n\nFor $a_n = 5 + \\frac{12}{n}$ and $\\varepsilon = 2$, the band runs from 3 to 7. The term $a_6 = 7$ sits on the upper edge, not inside, and $a_7 = 5 + \\frac{12}{7} \\approx 6.71$ is inside, so $N = 7$.\n\nCheck: the distance $\\frac{12}{n}$ only shrinks as $n$ grows, so every term after $a_7$ is closer to 5 than $a_7$ is.\n\n> **Watch out.** The answer is the index after the last term outside the band, not that term's own index, and a term inside the band counts for nothing if a later term leaves it.",
    "极限的定义说：对每个 $\\varepsilon$，都有一个 $N$，此后的每一项与极限的距离都小于 $\\varepsilon$。在图上这是绕着极限的一条水平带。关键在于“每一项”：某一项在带内并不说明什么，如果后面还有项跑出去。所以要从右往左读，找到最后一个在带外的项。\n\n对 $a_n = 5 + \\frac{12}{n}$ 和 $\\varepsilon = 2$，带从 3 到 7。$a_6 = 7$ 在上边缘上而不在带内，$a_7 = 5 + \\frac{12}{7} \\approx 6.71$ 在带内，所以 $N = 7$。\n\n检验：距离 $\\frac{12}{n}$ 随 $n$ 增大只会减小，所以 $a_7$ 之后的每一项都比 $a_7$ 更接近 5。\n\n> **注意。** 答案是最后一个带外项之后的下标，而不是那一项本身的下标；如果后面还有项跑出带外，某一项在带内也不算数。",
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
      [],
      walked(
        [
          [
            ["Read from the right", "从右往左读"],
            t(
              `Far to the right the dots crowd around ${limit}, well inside the band from ${limit - epsilon} to ${limit + epsilon}.`,
              `在最右边，圆点聚集在 ${limit} 附近，都在从 ${limit - epsilon} 到 ${limit + epsilon} 的带内。`,
            ),
          ],
          [
            ["Find the last dot outside", "找最后一个带外的点"],
            t(
              `Moving left, the first dot outside the band is $a_{${entry - 1}}$, at height about ${term(entry - 1).toFixed(2)}, ${term(entry - 1) > limit ? "above" : "below"} the line at ${term(entry - 1) > limit ? limit + epsilon : limit - epsilon}.`,
              `向左看，第一个在带外的点是 $a_{${entry - 1}}$，高度约为 ${term(entry - 1).toFixed(2)}，在 ${term(entry - 1) > limit ? limit + epsilon : limit - epsilon} 那条线的${term(entry - 1) > limit ? "上方" : "下方"}。`,
            ),
          ],
          [
            ["Take the next index", "取下一个下标"],
            t(
              `Every term from $a_{${entry}}$ on stays inside, so the smallest such $N$ is ${entry}.`,
              `从 $a_{${entry}}$ 起每一项都在带内，所以最小的 $N$ 是 ${entry}。`,
            ),
          ],
        ],
        t(
          `The distance from ${limit} shrinks as $n$ grows: $a_{${entry - 1}}$ is about ${(c / (entry - 1)).toFixed(2)} away, more than ${epsilon}, and $a_{${entry}}$ is about ${(c / entry).toFixed(2)} away, less than ${epsilon}.`,
          `与 ${limit} 的距离随 $n$ 增大而减小：$a_{${entry - 1}}$ 约相距 ${(c / (entry - 1)).toFixed(2)}，大于 ${epsilon}；$a_{${entry}}$ 约相距 ${(c / entry).toFixed(2)}，小于 ${epsilon}。`,
        ),
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
      [
        why(
          entry - 1,
          `That is the index of the last term outside the band; $a_{${entry - 1}}$ itself is outside, so $N$ is the next index.`,
          `这是最后一个带外项的下标；$a_{${entry - 1}}$ 本身在带外，所以 $N$ 是下一个下标。`,
        ),
        why(
          entry + 1,
          `That is one index too late; $a_{${entry}}$ already lies inside the band, and so does every later term.`,
          `这晚了一个下标；$a_{${entry}}$ 已经在带内，之后的每一项也都在。`,
        ),
        why(
          entry - 2,
          `That is too early; from $n = ${entry - 2}$ on, the term $a_{${entry - 1}}$ still lies outside the band.`,
          `这太早了；从 $n = ${entry - 2}$ 起，$a_{${entry - 1}}$ 仍在带外。`,
        ),
        why(
          epsilon,
          `That is the half-width $\\varepsilon = ${epsilon}$ of the band, not an index of the sequence.`,
          `这是带的半宽 $\\varepsilon = ${epsilon}$，而不是数列的下标。`,
        ),
      ],
    );
  },
};

const limsupFromPlot: KnowledgePointDef = {
  id: "limsup-and-liminf-from-a-plot",
  title: t("Limit superior and inferior from a plot", "由图读上极限和下极限"),
  explanation: t(
    "The limit superior is the largest value that some subsequence approaches, and the limit inferior is the smallest. Neither is the largest or smallest term of the sequence: early terms may stick out past them and then never return. Look at where the dots settle on the far right of the plot, ignoring the first few.\n\nSuppose the even terms are $8 + \\frac{6}{n}$ and the odd terms are $3 - \\frac{4}{n}$. Then $a_2 = 11$ and $a_1 = -1$ stick out, but the even dots settle at 8 and the odd dots at 3, so the limit superior is 8 and the limit inferior is 3.\n\nCheck: $a_{20} = 8.3$ and $a_{21} = 3 - \\frac{4}{21} \\approx 2.81$, already close to the two levels.\n\n> **Watch out.** Do not read off the highest or lowest dot. Those are early terms, and the limit superior and inferior depend only on where the dots end up.",
    "上极限是某个子列趋近的最大值，下极限是最小值。它们都不是数列的最大项或最小项：前面的项可能超出去，之后再也不回来。要看图最右边圆点稳定在哪里，不管开头那几项。\n\n设偶数项是 $8 + \\frac{6}{n}$，奇数项是 $3 - \\frac{4}{n}$。那么 $a_2 = 11$ 和 $a_1 = -1$ 超了出去，但偶数项的圆点稳定在 8，奇数项的圆点稳定在 3，所以上极限是 8，下极限是 3。\n\n检验：$a_{20} = 8.3$，$a_{21} = 3 - \\frac{4}{21} \\approx 2.81$，已经接近这两个高度。\n\n> **注意。** 不要读最高或最低的圆点。那些是开头的项，上极限和下极限只取决于圆点最后停在哪里。",
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
      [],
      walked(
        [
          [
            ["Split even and odd terms", "把偶数项和奇数项分开"],
            t(
              `The even terms settle at ${upper} and the odd terms at ${lower}; these are the only values a subsequence can approach.`,
              `偶数项稳定在 ${upper}，奇数项稳定在 ${lower}；子列只可能趋近这两个值。`,
            ),
          ],
          [
            ["Ignore the early terms", "不管开头的项"],
            t(
              `The first dots, such as $a_1$ and $a_2$, lie away from these levels, but finitely many terms do not change a limit.`,
              `开头的圆点，例如 $a_1$ 和 $a_2$，离这两个高度较远，但有限个项不改变极限。`,
            ),
          ],
          [
            [`Take the ${askUpper ? "larger" : "smaller"} level`, askUpper ? "取较大的高度" : "取较小的高度"],
            t(
              `The ${askUpper ? "limit superior is the larger" : "limit inferior is the smaller"} of the two, ${answer}.`,
              `${askUpper ? "上极限是两者中较大的" : "下极限是两者中较小的"}，即 ${answer}。`,
            ),
          ],
        ],
        t(
          `Far to the right, $a_{24}$ is about ${term(24).toFixed(2)} and $a_{23}$ about ${term(23).toFixed(2)}, close to ${upper} and ${lower}, and the ${askUpper ? "larger" : "smaller"} of these levels is ${answer}.`,
          `在最右边，$a_{24}$ 约为 ${term(24).toFixed(2)}，$a_{23}$ 约为 ${term(23).toFixed(2)}，接近 ${upper} 和 ${lower}，其中较${askUpper ? "大" : "小"}的高度是 ${answer}。`,
        ),
      ),
      drawn(
        { xMin: 0, xMax: 24, yMin: -3, yMax: 15, step: 1, labelEvery: 2, xName: "n", yName: "a" },
        dots,
        t("Terms of a sequence for $n$ up to 24, alternating between two levels.", "$n$ 到 24 的数列各项，在两个高度之间交替。"),
      ),
      "integer",
      [
        why(
          askUpper ? lower : upper,
          `That is the limit ${askUpper ? "inferior" : "superior"}, where the ${askUpper ? "odd" : "even"} terms settle; the ${askUpper ? "larger" : "smaller"} level is wanted.`,
          `这是${askUpper ? "下" : "上"}极限，即${askUpper ? "奇" : "偶"}数项稳定的高度；题目要的是较${askUpper ? "大" : "小"}的高度。`,
        ),
        askUpper
          ? why(
              upper + c / 2,
              outward
                ? `That is $a_2$, the highest dot; the even terms come down to ${upper} and never return to it.`
                : `That is not where the even terms settle; they rise toward ${upper} from below and stay below it.`,
              outward
                ? `这是最高的圆点 $a_2$；偶数项降到 ${upper}，再也不回到那里。`
                : `偶数项不是稳定在这里；它们从下方升向 ${upper}，并一直在它下面。`,
            )
          : why(
              lower - c,
              outward
                ? `That is $a_1$, the lowest term; the odd terms rise back to ${lower} and never return to it.`
                : `That is not where the odd terms settle; they fall toward ${lower} from above and stay above it.`,
              outward
                ? `这是最低的项 $a_1$；奇数项回升到 ${lower}，再也不回到那里。`
                : `奇数项不是稳定在这里；它们从上方降向 ${lower}，并一直在它上面。`,
            ),
        why(
          Q.of(upper + lower, 2),
          "That is the midpoint of the two levels; the terms keep jumping between the levels, so no subsequence approaches it.",
          "这是两个高度的中点；各项一直在两个高度之间跳动，所以没有子列趋近它。",
        ),
        askUpper
          ? why(
              upper - c / 2,
              outward
                ? `That is not where the even terms settle; they come down toward ${upper} from above and stay above it.`
                : `That is $a_2$, the first even term; the even terms keep rising toward ${upper}.`,
              outward
                ? `偶数项不是稳定在这里；它们从上方降向 ${upper}，并一直在它上面。`
                : `这是第一个偶数项 $a_2$；偶数项一直升向 ${upper}。`,
            )
          : why(
              lower + c,
              outward
                ? `That is not where the odd terms settle; they rise toward ${lower} from below and stay below it.`
                : `That is $a_1$, the first odd term; the odd terms keep falling toward ${lower}.`,
              outward
                ? `奇数项不是稳定在这里；它们从下方升向 ${lower}，并一直在它下面。`
                : `这是第一个奇数项 $a_1$；奇数项一直降向 ${lower}。`,
            ),
      ],
    );
  },
};

const continuityFailure: KnowledgePointDef = {
  id: "which-condition-of-continuity-fails",
  title: t("Which condition of continuity fails", "连续性的哪个条件不成立"),
  explanation: t(
    "Continuity at $a$ has three parts: $f(a)$ is defined, the limit at $a$ exists, and the two are equal. A hollow dot with no solid dot means no value. Two sides heading to different heights means no limit. A hollow dot with a solid dot elsewhere means a limit and a value that disagree. Name the first part that fails.\n\nFor example, if both pieces run into a hollow dot at $(2, 3)$ and a solid dot sits at $(2, 5)$, the value $f(2) = 5$ is defined and the limit $3$ exists, so the third part fails.\n\nCheck: the heights just beside $x = 2$, such as at $1.99$ and $2.01$, are close to $3$, not to $5$.\n\n> **Watch out.** Name the first part that fails. With a hollow dot and no solid dot, the value is missing even though the limit exists.",
    "在 $a$ 处连续有三个条件：$f(a)$ 有定义，$a$ 处的极限存在，两者相等。只有空心点没有实心点，说明没有函数值。两侧趋向不同高度，说明极限不存在。空心点之外另有实心点，说明极限和函数值不相等。要说出最先不成立的条件。\n\n例如，若两段都通向 $(2, 3)$ 处的空心点，而实心点在 $(2, 5)$，那么函数值 $f(2) = 5$ 有定义，极限 $3$ 存在，不成立的是第三个条件。\n\n检验：$x = 2$ 两旁的高度，例如在 $1.99$ 和 $2.01$ 处，都接近 $3$ 而不是 $5$。\n\n> **注意。** 要说出最先不成立的条件。只有空心点而没有实心点时，即使极限存在，函数值也是缺失的。",
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
    const value = kind === "hole" ? undefined : kind === "moved" ? moved : level;
    const notThis: Record<typeof kind, Text> = {
      continuous:
        kind === "hole"
          ? t(`There is no solid dot at $x = ${a}$, so $f(${a})$ is not defined.`, `$x = ${a}$ 处没有实心点，所以 $f(${a})$ 没有定义。`)
          : kind === "jump"
            ? t(`The two sides approach ${level} and ${right}, so there is no limit.`, `两侧分别趋近 ${level} 和 ${right}，所以没有极限。`)
            : t(`The value $f(${a}) = ${moved}$ differs from the limit ${level}.`, `函数值 $f(${a}) = ${moved}$ 与极限 ${level} 不相等。`),
      hole: t(`The solid dot gives a value, $f(${a}) = ${value}$.`, `实心点给出了函数值 $f(${a}) = ${value}$。`),
      jump: kind === "jump" ? t("", "") : t(`Both sides approach ${level}, so the limit exists.`, `两侧都趋近 ${level}，所以极限存在。`),
      moved:
        kind === "continuous"
          ? t(`The limit ${level} equals $f(${a}) = ${level}$.`, `极限 ${level} 等于 $f(${a}) = ${level}$。`)
          : kind === "hole"
            ? t(
                "There is no value to compare with the limit; the first condition already fails.",
                "没有函数值可与极限比较；第一个条件就已经不成立。",
              )
            : t(
                `The sides approach ${level} and ${right}, so the limit does not exist.`,
                `两侧分别趋近 ${level} 和 ${right}，所以极限不存在。`,
              ),
    };
    const xs = [a - 0.01, a - 0.001, a + 0.001, a + 0.01].map((x) => Math.round(x * 1000) / 1000);
    const height = (x: number) => (x < a ? level + m1 * (x - a) : right + m2 * (x - a));
    const rows = table(
      ["$x$", ...xs.map((x) => `$${x}$`)],
      ["$f(x)$", ...xs.map((x) => `$${dec(Q.of(Math.round(height(x) * 1000), 1000))}$`)],
    );
    const side = (zh: boolean) =>
      kind === "jump"
        ? zh
          ? `左侧的高度趋近 $${level}$，右侧的趋近 $${right}$，所以极限不存在。`
          : `The left heights approach $${level}$ and the right heights $${right}$, so there is no limit.`
        : zh
          ? `两侧的高度都趋近 $${level}$，${value === undefined ? "但没有函数值与之比较" : value === level ? `与 $f(${a}) = ${level}$ 相等` : `与 $f(${a}) = ${value}$ 不相等`}。`
          : `Both sides approach $${level}$, ${value === undefined ? "but there is no value to match" : value === level ? `which matches $f(${a}) = ${level}$` : `which does not match $f(${a}) = ${value}$`}.`;
    const step1 = stepLabel(1, "Read the value", "读出函数值");
    const step2 = stepLabel(2, "Read the limit", "读出极限");
    const step3 = stepLabel(3, "Compare", "比较");
    const solution = t(
      `${step1.en} ${value === undefined ? `There is only a hollow dot at $x = ${a}$, so $f(${a})$ is not defined.` : `The solid dot gives $f(${a}) = ${value}$.`}\n\n${step2.en} ${kind === "jump" ? `The left piece heads to ${level} and the right piece to ${right}.` : `Both pieces head to ${level}, so the limit is ${level}.`}\n\n${step3.en} ${why[kind].en}\n\n**Check.** Read the heights of the pieces just beside $x = ${a}$:\n\n${rows}\n\n${side(false)}`,
      `${step1["zh-CN"]} ${value === undefined ? `$x = ${a}$ 处只有空心点，所以 $f(${a})$ 没有定义。` : `实心点给出 $f(${a}) = ${value}$。`}\n\n${step2["zh-CN"]} ${kind === "jump" ? `左段趋向 ${level}，右段趋向 ${right}。` : `两段都趋向 ${level}，所以极限是 ${level}。`}\n\n${step3["zh-CN"]} ${why[kind]["zh-CN"]}\n\n**检验。** 读出两段在 $x = ${a}$ 两旁的高度：\n\n${rows}\n\n${side(true)}`,
    );
    return explainedChoice(rng, {
      prompt: t(`Which statement describes this function at $x = ${a}$?`, `哪句话描述了这个函数在 $x = ${a}$ 处的情况？`),
      correct: options[kind],
      wrong: (["continuous", "hole", "jump", "moved"] as const)
        .filter((k) => k !== kind)
        .map((k) => ({ option: options[k], why: notThis[k] })),
      solution,
      figure: drawn(
        { xMin: 0, xMax: 8, yMin: 0, yMax: 8 },
        marks,
        t(
          `The graph of a function made of two pieces that meet or break at $x = ${a}$.`,
          `由两段组成的函数图像，两段在 $x = ${a}$ 处相接或断开。`,
        ),
      ),
    });
  },
};

const deltaFromLine: KnowledgePointDef = {
  id: "reading-delta-from-a-line",
  title: t("Reading delta from a line", "由直线读 delta"),
  explanation: t(
    "For a line through $(a, L)$ with slope $m$, the height differs from $L$ by exactly $|m|$ times the horizontal distance from $a$. So staying within $\\varepsilon$ of $L$ means staying within $\\varepsilon / |m|$ of $a$. A steep line needs a small $\\delta$, and a shallow line allows a large one, because $\\delta$ is measured across and $\\varepsilon$ up.\n\nFor the line through $(5, 4)$ with slope $2$ and $\\varepsilon = 3$, the largest $\\delta$ is $\\frac{3}{2}$.\n\nCheck: at $x = 5 + \\frac{3}{2}$ the height is $4 + 2 \\cdot \\frac{3}{2} = 7$, exactly on the upper dashed line $y = 4 + 3$.\n\n> **Watch out.** Divide $\\varepsilon$ by the steepness; do not multiply. A slope of $-2$ gives the same $\\delta$ as a slope of $2$, since only $|m|$ matters.",
    "对经过 $(a, L)$、斜率为 $m$ 的直线，高度与 $L$ 的差恰好是水平距离的 $|m|$ 倍。所以要与 $L$ 相差不到 $\\varepsilon$，就要与 $a$ 相差不到 $\\varepsilon / |m|$。直线越陡，$\\delta$ 越小；越平，$\\delta$ 越大，因为 $\\delta$ 是横向量的，$\\varepsilon$ 是纵向量的。\n\n对经过 $(5, 4)$、斜率为 $2$ 的直线和 $\\varepsilon = 3$，最大的 $\\delta$ 是 $\\frac{3}{2}$。\n\n检验：在 $x = 5 + \\frac{3}{2}$ 处高度是 $4 + 2 \\cdot \\frac{3}{2} = 7$，恰好在上面的虚线 $y = 4 + 3$ 上。\n\n> **注意。** 要用 $\\varepsilon$ 除以陡度，而不是乘。斜率 $-2$ 与斜率 $2$ 给出相同的 $\\delta$，因为只有 $|m|$ 起作用。",
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
      [],
      walked(
        [
          [
            ["Read the slope", "读出斜率"],
            t(
              `The grid shows slope $${slope.toLatex()}$, so the height changes by $${Q.of(mn, md).toLatex()}$ for each unit across.`,
              `由方格读出斜率是 $${slope.toLatex()}$，所以每向右一个单位，高度变化 $${Q.of(mn, md).toLatex()}$。`,
            ),
          ],
          [
            ["Divide the tolerance by the steepness", "用误差除以陡度"],
            t(
              `The line leaves the band when its height has changed by $${epsilon.toLatex()}$, which takes a horizontal distance of $${epsilon.toLatex()} \\div ${Q.of(mn, md).toLatex()} = ${delta.toLatex()}$.`,
              `高度变化 $${epsilon.toLatex()}$ 时直线离开带，这需要的水平距离是 $${epsilon.toLatex()} \\div ${Q.of(mn, md).toLatex()} = ${delta.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `At $x = ${a} + ${delta.toLatex()}$ the height of the line is $${Q.of(L).add(slope.mul(delta)).toLatex()}$, exactly on a dashed line, and every $x$ closer to ${a} keeps the line strictly between.`,
          `在 $x = ${a} + ${delta.toLatex()}$ 处直线的高度是 $${Q.of(L).add(slope.mul(delta)).toLatex()}$，恰好在一条虚线上；更接近 ${a} 的每个 $x$ 都使直线严格在两线之间。`,
        ),
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
      "number",
      [
        why(
          epsilon,
          `That is $\\varepsilon$ itself; $\\delta$ is measured across, and the line rises or falls $${Q.of(mn, md).toLatex()}$ for each unit across, so divide by it.`,
          `这是 $\\varepsilon$ 本身；$\\delta$ 是横向量的，而直线每向右一个单位升降 $${Q.of(mn, md).toLatex()}$，所以要除以它。`,
        ),
        why(
          epsilon.mul(Q.of(mn, md)),
          "That multiplies $\\varepsilon$ by the steepness instead of dividing by it.",
          "这把 $\\varepsilon$ 乘以陡度，而不是除以它。",
        ),
        why(
          delta.div(Q.of(2, 1)),
          `That is half of the largest $\\delta$; it works, but a $\\delta$ up to $${delta.toLatex()}$ works too.`,
          `这是最大 $\\delta$ 的一半；它可以，但直到 $${delta.toLatex()}$ 的 $\\delta$ 也都可以。`,
        ),
        why(
          delta.mul(Q.of(2, 1)),
          "That uses the full width $2\\varepsilon$ of the band; the line may move only $\\varepsilon$ up or down from its height at the marked point.",
          "这用了带的全宽 $2\\varepsilon$；直线从标出点的高度只能向上或向下移动 $\\varepsilon$。",
        ),
        why(
          Q.of(mn, md),
          "That is the steepness of the line, a rise per unit across, not a horizontal distance.",
          "这是直线的陡度，即每横向一个单位的升降，而不是水平距离。",
        ),
      ],
    );
  },
};

const secantSlope: KnowledgePointDef = {
  id: "the-slope-guaranteed-by-a-graph",
  figure: analysisDrawings1["bounds-from-the-mean-value-theorem#the-slope-guaranteed-by-a-graph"],
  title: t("The slope the theorem guarantees", "定理保证的斜率"),
  explanation: t(
    "The Mean Value Theorem promises a point between $a$ and $b$ where the tangent is parallel to the chord joining the endpoints. So the guaranteed derivative is the chord's slope: rise over run between the two endpoints only. What the curve does in between does not change this value, though it may change how many such points there are.\n\nIf the endpoints are $(1, 2)$ and $(5, 8)$, the chord has slope $\\frac{8 - 2}{5 - 1} = \\frac{3}{2}$, so some $c$ between 1 and 5 has $f'(c) = \\frac{3}{2}$.\n\nCheck: starting at height 2 and going 4 across at slope $\\frac{3}{2}$ reaches $2 + \\frac{3}{2} \\cdot 4 = 8$, the other endpoint.\n\n> **Watch out.** Use the two endpoints only. The highest point of the curve, or a slope read somewhere in the middle, is not what the theorem guarantees.",
    "中值定理保证 $a$ 和 $b$ 之间有一点，那里的切线平行于连接两端点的弦。所以定理保证的导数值就是弦的斜率：只看两端点之间的升高除以水平距离。曲线中间怎么走不改变这个值，只可能改变这样的点有几个。\n\n若端点是 $(1, 2)$ 和 $(5, 8)$，弦的斜率是 $\\frac{8 - 2}{5 - 1} = \\frac{3}{2}$，所以 1 和 5 之间有某个 $c$ 使 $f'(c) = \\frac{3}{2}$。\n\n检验：从高度 2 出发，以斜率 $\\frac{3}{2}$ 横向走 4，到达 $2 + \\frac{3}{2} \\cdot 4 = 8$，正是另一个端点。\n\n> **注意。** 只用两个端点。曲线的最高点，或在中间某处读出的斜率，都不是定理所保证的。",
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
      [],
      walked(
        [
          [
            ["Read the endpoints", "读出端点"],
            t(`The marked endpoints are $(${a}, ${ya})$ and $(${b}, ${yb})$.`, `标出的端点是 $(${a}, ${ya})$ 和 $(${b}, ${yb})$。`),
          ],
          [
            ["Take the slope of the chord", "求弦的斜率"],
            t(
              `The chord has slope $\\frac{${yb} - ${ya}}{${b} - ${a}} = ${slope.toLatex()}$, and the theorem guarantees a tangent with that same slope.`,
              `弦的斜率是 $\\frac{${yb} - ${ya}}{${b} - ${a}} = ${slope.toLatex()}$，定理保证有一条切线的斜率与它相同。`,
            ),
          ],
        ],
        t(
          `Going ${b - a} across at slope $${slope.toLatex()}$ changes the height by ${yb - ya}, from ${ya} to ${yb}, so the chord does join the two endpoints.`,
          `以斜率 $${slope.toLatex()}$ 横向走 ${b - a}，高度改变 ${yb - ya}，从 ${ya} 到 ${yb}，所以这条弦确实连接两个端点。`,
        ),
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
      "number",
      [
        why(
          Q.of(yb - ya, 1),
          `That is the rise alone; divide it by the run $${b} - ${a} = ${b - a}$.`,
          `这只是升高量；要除以水平距离 $${b} - ${a} = ${b - a}$。`,
        ),
        why(
          Q.of(b - a, yb - ya),
          "That is run over rise, upside down; slope is rise over run.",
          "这是水平距离除以升高，颠倒了；斜率是升高除以水平距离。",
        ),
        why(
          slope.neg(),
          `That has the wrong sign; the curve goes from height ${ya} ${yb > ya ? "up" : "down"} to ${yb}.`,
          `这符号错了；曲线从高度 ${ya} ${yb > ya ? "升" : "降"}到 ${yb}。`,
        ),
        why(
          Q.of(yb + ya, 2),
          "That is the average height of the endpoints, a value of $f$, not a slope.",
          "这是两端点高度的平均值，是 $f$ 的值，而不是斜率。",
        ),
      ],
    );
  },
};

const darbouxFromDrawing: KnowledgePointDef = {
  id: "darboux-sums-from-a-drawing",
  title: t("Darboux sums from a drawing", "由图算达布和"),
  explanation: t(
    "On each piece of a partition, the upper sum uses the largest value of the function and the lower sum uses the smallest. For a monotonic function these lie at the ends of the piece. The pieces need not have equal widths, so multiply each height by its own width. The upper sum minus the lower sum measures the gap left by the partition.\n\nFor an increasing $f$ with $f(0) = 2$, $f(2) = 3$ and $f(6) = 11$, the partition $0, 2, 6$ gives $U(P) = 2 \\times 3 + 4 \\times 11 = 50$ and $L(P) = 2 \\times 2 + 4 \\times 3 = 16$, so $U(P) - L(P) = 34$.\n\nCheck: for an increasing function the gap is a sum of width times rise, $2 \\times (3 - 2) + 4 \\times (11 - 3) = 34$.\n\n> **Watch out.** Multiply each height by the width of its own piece. Adding the heights alone, or using one common width, gives a wrong sum when the pieces differ in width.",
    "在分割的每一段上，上和取函数的最大值，下和取最小值。单调函数的最大值和最小值都在这一段的端点上。各段宽度不一定相等，所以每个高度要乘自己那一段的宽度。上和减下和就是这个分割留下的差距。\n\n对递增的 $f$，$f(0) = 2$，$f(2) = 3$，$f(6) = 11$，分割 $0, 2, 6$ 给出 $U(P) = 2 \\times 3 + 4 \\times 11 = 50$，$L(P) = 2 \\times 2 + 4 \\times 3 = 16$，所以 $U(P) - L(P) = 34$。\n\n检验：对递增函数，差距是各段宽度乘升高之和，$2 \\times (3 - 2) + 4 \\times (11 - 3) = 34$。\n\n> **注意。** 每个高度要乘它自己那一段的宽度。只把高度相加，或者用同一个宽度，在各段宽度不同时都会算错。",
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
    const sum = (key: "high" | "low") => pieces.map((p) => `${p.width} \\times ${p[key]}`).join(" + ");
    const widths = pieces.map((p) => p.width).join(", ");
    const rise = pieces.map((p) => `${p.width} \\times ${p.high - p.low}`).join(" + ");
    const highs = pieces.reduce((s, p) => s + p.high, 0);
    const lows = pieces.reduce((s, p) => s + p.low, 0);
    const named = {
      upper: ["the upper sum $U(P)$", "上和 $U(P)$"],
      lower: ["the lower sum $L(P)$", "下和 $L(P)$"],
      gap: ["the gap $U(P) - L(P)$", "差 $U(P) - L(P)$"],
    } as const;
    const instead = (other: keyof typeof named) =>
      why(
        { upper, lower, gap: upper - lower }[other],
        `That is ${named[other][0]}, not ${question.en}.`,
        `这是${named[other][1]}，而不是${question["zh-CN"]}。`,
      );
    return numeric(
      t(
        `The curve is a monotonic function $f$ on $[0, 6]$. The shaded rectangles are the lower sum and the dashed rectangles are the upper sum of a partition $P$. Find ${question.en}.`,
        `曲线是 $[0, 6]$ 上的单调函数 $f$。对分割 $P$，阴影矩形是下和，虚线矩形是上和。求${question["zh-CN"]}。`,
      ),
      answer,
      [],
      walked(
        [
          [
            ["Read the pieces", "读出各段"],
            t(
              `The partition cuts $[0, 6]$ at $${points.join(", ")}$, so the widths are $${widths}$. Since $f$ is ${increasing ? "increasing" : "decreasing"}, its largest value on each piece is at the ${increasing ? "right" : "left"} end.`,
              `分割在 $${points.join(", ")}$ 处切开 $[0, 6]$，所以各段宽度是 $${widths}$。因为 $f$ ${increasing ? "递增" : "递减"}，它在每段上的最大值在${increasing ? "右" : "左"}端。`,
            ),
          ],
          [
            ["Add the dashed rectangles", "把虚线矩形加起来"],
            t(`$U(P) = ${sum("high")} = ${upper}$.`, `$U(P) = ${sum("high")} = ${upper}$。`),
          ],
          [
            ["Add the shaded rectangles", "把阴影矩形加起来"],
            t(
              `$L(P) = ${sum("low")} = ${lower}$${ask === "gap" ? `, so $U(P) - L(P) = ${upper} - ${lower} = ${answer}$` : ""}.`,
              `$L(P) = ${sum("low")} = ${lower}$${ask === "gap" ? `，所以 $U(P) - L(P) = ${upper} - ${lower} = ${answer}$` : ""}。`,
            ),
          ],
        ],
        t(
          `The gap is also width times rise on each piece, $${rise} = ${upper - lower}$, which matches $${upper} - ${lower}$. So ${question.en} is ${answer}.`,
          `差距也等于各段宽度乘升降之和，$${rise} = ${upper - lower}$，与 $${upper} - ${lower}$ 一致。所以${question["zh-CN"]}是 ${answer}。`,
        ),
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
      [
        ...(["upper", "lower", "gap"] as const).filter((k) => k !== ask).map(instead),
        why(
          upper + lower,
          "That adds the two sums; the upper and lower sums are separate estimates of the area, and their gap is a difference.",
          "这把两个和加了起来；上和与下和是面积的两个估计，差距是它们的差。",
        ),
        why(
          highs,
          `That adds the largest heights without multiplying each by the width of its piece, $${widths}$.`,
          `这只把最大高度相加，没有乘各自那一段的宽度 $${widths}$。`,
        ),
        why(
          lows,
          `That adds the smallest heights without multiplying each by the width of its piece, $${widths}$.`,
          `这只把最小高度相加，没有乘各自那一段的宽度 $${widths}$。`,
        ),
      ],
    );
  },
};

const stepGap: KnowledgePointDef = {
  id: "the-gap-at-a-jump",
  title: t("The gap at a jump", "跳跃处的差距"),
  explanation: t(
    "A function with one jump is still Riemann integrable. On every piece of a partition that misses the jump, the largest and smallest values agree and contribute nothing to the upper sum minus the lower sum. Only the piece holding the jump contributes: its width times the size of the jump, and this shrinks to zero as the partition gets finer.\n\nLet $f = 2$ on $[0, 3)$ and $f = 5$ on $[3, 8]$, with a partition into pieces of width 2. Only the piece $[2, 4]$ holds the jump, and it contributes $2 \\times (5 - 2) = 6$, so $U(P) - L(P) = 6$.\n\nCheck: on $[2, 4]$ the upper sum uses 5 and the lower sum uses 2, giving $2 \\times 5 - 2 \\times 2 = 6$, and every other piece gives the same value to both sums.\n\n> **Watch out.** Multiply the width of the one piece by the size of the jump, the difference of the two values. Neither the sum of the values nor the whole length of the interval enters.",
    "只有一个跳跃的函数仍然黎曼可积。分割中不含跳跃的每一段上，最大值和最小值相同，对上和减下和没有贡献。只有含跳跃的那一段有贡献：它的宽度乘跳跃的大小，分割越细，这个值越趋近于零。\n\n设 $f$ 在 $[0, 3)$ 上等于 2，在 $[3, 8]$ 上等于 5，分割的每段宽 2。只有 $[2, 4]$ 这一段含跳跃，它贡献 $2 \\times (5 - 2) = 6$，所以 $U(P) - L(P) = 6$。\n\n检验：在 $[2, 4]$ 上，上和用 5，下和用 2，得 $2 \\times 5 - 2 \\times 2 = 6$；其他每一段给两个和的值相同。\n\n> **注意。** 要用那一段的宽度乘跳跃的大小，即两个函数值之差。函数值之和与整个区间的长度都不参与计算。",
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
      [],
      walked(
        [
          [
            ["Pieces away from the jump", "不含跳跃的段"],
            t(
              "On every piece that misses the jump the function is constant, so its largest and smallest values agree and the piece adds nothing to $U(P) - L(P)$.",
              "在不含跳跃的每一段上函数是常数，所以最大值和最小值相同，这一段对 $U(P) - L(P)$ 没有贡献。",
            ),
          ],
          [
            ["The piece holding the jump", "含跳跃的那一段"],
            t(
              `That piece has width ${width} and values ${left} and ${right}, so the jump has size $${Math.max(left, right)} - ${Math.min(left, right)} = ${size}$.`,
              `那一段宽 ${width}，函数值是 ${left} 和 ${right}，所以跳跃的大小是 $${Math.max(left, right)} - ${Math.min(left, right)} = ${size}$。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t(
              `It contributes $${width} \\times ${size} = ${size * width}$, and this is $U(P) - L(P)$.`,
              `它贡献 $${width} \\times ${size} = ${size * width}$，这就是 $U(P) - L(P)$。`,
            ),
          ],
        ],
        t(
          `With pieces of half the width, ${width / 2}, the gap would be ${(width / 2) * size}: it shrinks with the width, as it must for an integrable function.`,
          `如果每段宽度减半为 ${width / 2}，差距就是 ${(width / 2) * size}：它随宽度一起缩小，可积函数理应如此。`,
        ),
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
      [
        why(
          size,
          `That is the size of the jump alone; multiply it by the width ${width} of the piece holding it.`,
          `这只是跳跃的大小；要乘含跳跃那一段的宽度 ${width}。`,
        ),
        why(
          8 * size,
          "That multiplies by the whole length 8; only the one piece holding the jump contributes.",
          "这乘了整个长度 8；只有含跳跃的那一段有贡献。",
        ),
        why(width, `That is the width alone; multiply it by the size ${size} of the jump.`, `这只是宽度；要乘跳跃的大小 ${size}。`),
        why(
          (left + right) * width,
          `That adds the two values; the contribution uses their difference, ${size}, not their sum.`,
          `这把两个函数值相加；贡献用的是它们的差 ${size}，而不是和。`,
        ),
      ],
    );
  },
};

const convergenceFromGraphs: KnowledgePointDef = {
  id: "the-kind-of-convergence-from-graphs",
  figure: analysisDrawings1["pointwise-and-uniform-convergence#the-kind-of-convergence-from-graphs"],
  title: t("The kind of convergence from graphs", "由图判断收敛类型"),
  explanation: t(
    "Pointwise convergence fixes one $x$ and watches the values $f_n(x)$. Uniform convergence asks that the largest distance from the limit, over all $x$ at once, go to zero. A hump of fixed height that slides away passes every fixed point in the end, so it converges pointwise, but its height never shrinks, so the convergence is not uniform.\n\nFor $f_n(x) = \\frac{x}{n}$ on $[0, 8]$, the largest distance from 0 is $\\frac{8}{n}$, which tends to 0, so the convergence is uniform. For a hump of height 5 that slides toward 0, the largest distance stays 5, so that convergence is only pointwise.\n\nCheck: $f_{100}(8) = 0.08$, and every other value of $f_{100}$ is smaller, so all values are small at once.\n\n> **Watch out.** Converging at every point does not make the convergence uniform. Look at the largest distance over all $x$ for each $n$, not at one $x$ at a time.",
    "逐点收敛是固定一个 $x$，看 $f_n(x)$ 的值。一致收敛要求对所有 $x$ 同时取的最大距离趋于零。高度不变、不断滑走的驼峰，最后会离开每个固定点，所以逐点收敛；但它的高度不减小，所以不是一致收敛。\n\n对 $[0, 8]$ 上的 $f_n(x) = \\frac{x}{n}$，与 0 的最大距离是 $\\frac{8}{n}$，它趋于 0，所以一致收敛。对高度为 5、向 0 滑去的驼峰，最大距离一直是 5，所以只是逐点收敛。\n\n检验：$f_{100}(8) = 0.08$，$f_{100}$ 的其他值都更小，所以所有的值同时都很小。\n\n> **注意。** 在每一点都收敛并不意味着一致收敛。对每个 $n$ 要看所有 $x$ 上的最大距离，而不是一次只看一个 $x$。",
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
    const walks = {
      slide: walked(
        [
          [
            ["Fix a point", "固定一点"],
            t(
              `The hump keeps its height ${height} while sliding toward 0. Any fixed $x > 0$ is left behind in the end, and $f_n(0) = 0$, so the limit is 0 at every point.`,
              `驼峰保持高度 ${height}，向 0 滑去。任何固定的 $x > 0$ 最后都会被甩在后面，而 $f_n(0) = 0$，所以每一点的极限都是 0。`,
            ),
          ],
          [
            ["Find the largest distance", "求最大距离"],
            t(
              `But the largest distance from 0 over all $x$ stays ${height}, so it does not tend to 0, and the convergence is not uniform.`,
              `但对所有 $x$ 取的与 0 的最大距离一直是 ${height}，不趋于 0，所以不是一致收敛。`,
            ),
          ],
        ],
        t(
          `For each $n$ the point under the peak, $x = \\frac{${center}}{n}$, has $f_n(x) = ${height}$, so no single $n$ makes every value small at once.`,
          `对每个 $n$，峰顶下方的点 $x = \\frac{${center}}{n}$ 满足 $f_n(x) = ${height}$，所以没有哪个 $n$ 能使所有的值同时变小。`,
        ),
      ),
      shrink: walked(
        [
          [
            ["Fix a point", "固定一点"],
            t(
              "At each $x$ the value halves each time $n$ doubles, so it tends to 0.",
              "在每个 $x$ 处，$n$ 每翻一倍，函数值就减半，所以它趋于 0。",
            ),
          ],
          [
            ["Find the largest distance", "求最大距离"],
            t(
              `The largest value is the peak, $\\frac{${height}}{n}$, which tends to 0. So the largest distance from 0 over all $x$ goes to 0, and that is exactly uniform convergence.`,
              `最大值是峰顶 $\\frac{${height}}{n}$，它趋于 0。所以对所有 $x$ 取的与 0 的最大距离趋于 0，这正是一致收敛。`,
            ),
          ],
        ],
        t(
          `For $n = 4$ the peak is already $${Q.of(height, 4).toLatex()}$, and every value of $f_4$ lies below it.`,
          `$n = 4$ 时峰顶已经是 $${Q.of(height, 4).toLatex()}$，$f_4$ 的每个值都在它之下。`,
        ),
      ),
      flip: walked(
        [
          [
            ["Fix the center", "固定中心点"],
            t(
              `At $x = ${center}$ the values are ${height}, ${-height}, ${height}, and so on, alternating.`,
              `在 $x = ${center}$ 处，函数值依次是 ${height}，${-height}，${height}，如此交替。`,
            ),
          ],
          [
            ["Decide about the limit", "判断极限"],
            t(
              "A sequence of numbers that keeps jumping between two different values has no limit, so the functions do not converge at that point.",
              "在两个不同的值之间来回跳动的数列没有极限，所以函数列在该点不收敛。",
            ),
          ],
        ],
        t(
          `The odd functions have $f_n(${center}) = ${height}$ and the even ones $f_n(${center}) = ${-height}$; the difference ${2 * height} between neighbours never shrinks.`,
          `奇数号函数满足 $f_n(${center}) = ${height}$，偶数号函数满足 $f_n(${center}) = ${-height}$；相邻两项的差 ${2 * height} 从不缩小。`,
        ),
      ),
    };
    const reasons = {
      slide: [
        [
          options.shrink.en,
          `The height does not shrink; it stays ${height}, so the largest distance from 0 never goes to 0.`,
          `高度没有缩小；它一直是 ${height}，所以与 0 的最大距离不趋于 0。`,
        ],
        [
          options.flip.en,
          "The hump passes every fixed point in the end, so the values there settle at 0; nothing keeps oscillating.",
          "驼峰最后会离开每个固定点，所以那里的值稳定在 0；没有一直振荡的点。",
        ],
      ],
      shrink: [
        [
          options.slide.en,
          `The hump does not slide away; it shrinks in place, and its height $\\frac{${height}}{n}$ goes to 0 everywhere at once.`,
          `驼峰没有滑走；它在原地缩小，高度 $\\frac{${height}}{n}$ 在各处同时趋于 0。`,
        ],
        [options.flip.en, "At each point the values shrink toward 0; they do not alternate.", "在每一点函数值都缩小趋于 0；它们并不交替。"],
      ],
      flip: [
        [
          options.slide.en,
          `The values at $x = ${center}$ alternate between ${height} and ${-height}, so they do not converge to 0 there.`,
          `$x = ${center}$ 处的值在 ${height} 和 ${-height} 之间交替，所以在那里不收敛到 0。`,
        ],
        [
          options.shrink.en,
          `The height stays ${height} and only flips sign, so the functions do not even converge at $x = ${center}$.`,
          `高度一直是 ${height}，只是变号，所以函数列在 $x = ${center}$ 处甚至不收敛。`,
        ],
      ],
    } as const;
    const { [kind]: correct, ...others } = options;
    return reasoned(
      pickChoice(
        rng,
        t(
          "The graphs show some of the functions $f_n$ on $[0, 8]$, each labelled with its $n$, and the pattern continues as $n$ grows. What can you say about the sequence?",
          "图中是 $[0, 8]$ 上的一部分函数 $f_n$，每个图像标有它的 $n$，随着 $n$ 增大规律一直延续。关于这个函数列，可以得出什么结论？",
        ),
        correct,
        Object.values(others),
        walks[kind],
        drawn(
          { xMin: 0, xMax: 8, yMin: kind === "flip" ? -7 : -1, yMax: 7 },
          marks,
          t("Tent-shaped graphs of several functions in a sequence, labelled by $n$.", "函数列中几个函数的帐篷形图像，标有 $n$。"),
        ),
      ),
      reasons[kind],
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
    "The solution of $u_t + c u_x = 0$ is the initial shape sliding without change at speed $c$. Compare the same feature, such as the peak, in two snapshots: the speed is the distance moved divided by the time elapsed. A move to the right means $c > 0$ and a move to the left means $c < 0$. For example, if the peak sits at $x = 2$ at $t = 0$ and at $x = 8$ at $t = 3$, then $c = 6 \\div 3 = 2$.\n\nCheck: the solution is $f(x - 2t)$, and at the later peak $x - 2t = 8 - 2 \\cdot 3 = 2$, the same as at the start.\n\n> **Watch out.** Divide the distance by the time, not the time by the distance, and give $c$ a minus sign when the shape moves to the left.",
    "$u_t + c u_x = 0$ 的解是初始形状以速度 $c$ 平移，形状不变。在两张快照中比较同一个特征，比如峰顶：速度等于移动的距离除以经过的时间。向右移动说明 $c > 0$，向左移动说明 $c < 0$。例如，峰顶在 $t = 0$ 时位于 $x = 2$，在 $t = 3$ 时位于 $x = 8$，那么 $c = 6 \\div 3 = 2$。\n\n检验：解是 $f(x - 2t)$，在后来的峰顶处 $x - 2t = 8 - 2 \\cdot 3 = 2$，与开始时相同。\n\n> **注意。** 要用距离除以时间，而不是时间除以距离；形状向左移动时，$c$ 要带负号。",
  ),
  generate(rng) {
    return until(() => {
      const shift = rng.pick([-6, -4, -3, -2, 2, 3, 4, 6]);
      const time = rng.pick([1, 2, 3, 4]);
      const start = shift > 0 ? rng.int(2, 3) : rng.int(9, 10);
      const height = rng.int(2, 4);
      const speed = Q.of(shift, time);
      const right = shift > 0;
      const back = speed.sign() < 0 ? `\\left(${speed.toLatex()}\\right)` : speed.toLatex();
      const misses: Miss[] = [
        [
          speed.neg(),
          `That has the wrong sign: the shape moved to the ${right ? "right" : "left"}, so $c$ is ${right ? "positive" : "negative"}.`,
          `符号错了：形状向${right ? "右" : "左"}移动，所以 $c$ 是${right ? "正" : "负"}的。`,
        ],
        [
          Q.of(shift, 1),
          `$${shift}$ is the displacement; it still has to be divided by the time ${time}.`,
          `$${shift}$ 是位移，还要除以时间 ${time}。`,
        ],
        [
          Q.of(time, shift),
          "That divides the time by the distance; speed is distance over time.",
          "那是用时间除以距离；速度是距离除以时间。",
        ],
      ];
      return worked(
        [
          `The dashed curve is a solution of $u_t + c u_x = 0$ at $t = 0$, and the solid curve is the same solution at $t = ${time}$. What is $c$?`,
          `虚线是 $u_t + c u_x = 0$ 的解在 $t = 0$ 时的图像，实线是同一个解在 $t = ${time}$ 时的图像。$c$ 是多少？`,
        ],
        speed,
        misses,
        [
          [
            ["Read the peaks", "读出峰顶"],
            [
              `The dashed peak is at $x = ${start}$ and the solid peak at $x = ${start + shift}$, so the shape moved ${Math.abs(shift)} to the ${right ? "right" : "left"}.`,
              `虚线的峰顶在 $x = ${start}$，实线的峰顶在 $x = ${start + shift}$，所以形状向${right ? "右" : "左"}移动了 ${Math.abs(shift)}。`,
            ],
          ],
          [
            ["Divide by the time", "除以时间"],
            [
              `$c = ${shift} \\div ${time} = ${speed.toLatex()}$, and the sign records the direction.`,
              `$c = ${shift} \\div ${time} = ${speed.toLatex()}$，符号表示方向。`,
            ],
          ],
        ],
        [
          `The solution is $f(x - ct)$, and at the solid peak $x - ct = ${start + shift} - ${back} \\cdot ${time} = ${start}$, where the dashed peak was.`,
          `解是 $f(x - ct)$，在实线的峰顶处 $x - ct = ${start + shift} - ${back} \\cdot ${time} = ${start}$，正是虚线峰顶的位置。`,
        ],
        drawn(
          { xMin: 0, xMax: 12, yMin: -1, yMax: 6, yName: "u" },
          [
            { kind: "path", points: tent(start, 2, height, 0, 12), dashed: true },
            { kind: "path", points: tent(start + shift, 2, height, 0, 12), accent: true },
          ],
          t("A dashed tent-shaped profile and a solid copy of it moved along the axis.", "虚线的帐篷形曲线，以及沿轴平移后的实线曲线。"),
        ),
      );
    });
  },
};

const traceCharacteristic: KnowledgePointDef = {
  id: "tracing-a-characteristic-back",
  title: t("Tracing a characteristic back", "沿特征线回溯"),
  explanation: t(
    "A solution of $u_t + c u_x = 0$ is constant along each characteristic line. To find $u$ at a point, follow the line through it down to $t = 0$ and read the initial data at the foot. Do not put the $x$ of the point itself into the initial data: that would ignore the distance the data has travelled. For example, with $c = 2$ and $u(x, 0) = x^2$, the characteristic through $(8, 2)$ is $x - 2t = 4$, so its foot is $x = 4$ and $u(8, 2) = 4^2 = 16$.\n\nCheck: the solution is $u = (x - 2t)^2$, and $(8 - 2 \\cdot 2)^2 = 16$.\n\n> **Watch out.** The foot lies at $x - ct$, behind the point: for $c > 0$ it is to the left. Going the other way, to $x + ct$, reads the data at the wrong place.",
    "$u_t + c u_x = 0$ 的解沿每条特征线不变。要求某点的 $u$，就沿经过它的直线走到 $t = 0$，在落点处读初始数据。不要把这一点自己的 $x$ 代入初始数据，那样就忽略了数据走过的距离。例如，$c = 2$、$u(x, 0) = x^2$ 时，经过 $(8, 2)$ 的特征线是 $x - 2t = 4$，所以落点是 $x = 4$，$u(8, 2) = 4^2 = 16$。\n\n检验：解是 $u = (x - 2t)^2$，而 $(8 - 2 \\cdot 2)^2 = 16$。\n\n> **注意。** 落点在 $x - ct$，在这一点的后方：$c > 0$ 时它在左边。反方向走到 $x + ct$，读到的就是错误位置的数据。",
  ),
  generate(rng) {
    return until(() => {
      const [cn, cd] = rng.pick([
        [1, 1],
        [2, 1],
        [-1, 1],
        [-2, 1],
        [1, 2],
        [-1, 2],
      ] as const);
      const c = cn / cd;
      const cl = cd === 2 ? `${cn < 0 ? "-" : ""}\\frac{1}{2}` : `${cn}`;
      const time = cd === 2 ? rng.pick([2, 4]) : rng.int(1, 3);
      const foot = cn > 0 ? rng.int(1, 3) : rng.int(7, 9);
      const px = foot + c * time;
      const data = rng.pick([
        { en: "x^2", f: (x: number) => x * x, at: (x: number) => `${x}^2` },
        { en: "2x + 1", f: (x: number) => 2 * x + 1, at: (x: number) => `2 \\cdot ${x} + 1` },
        { en: "10 - x", f: (x: number) => 10 - x, at: (x: number) => `10 - ${x}` },
        { en: "x^2 - x", f: (x: number) => x * x - x, at: (x: number) => `${x}^2 - ${x}` },
      ]);
      const lines: PlaneMark[] = [-4, -2, 2, 4].map(
        (d): PlaneMark => ({ kind: "line", a: [foot + d, 0], b: [foot + d + c, 1], dashed: true }),
      );
      const misses: Miss[] = [
        [
          data.f(px),
          `That reads the initial data at the point's own $x = ${px}$ and ignores how far the data has travelled.`,
          `那是在这一点自己的 $x = ${px}$ 处读初始数据，忽略了数据走过的距离。`,
        ],
        [
          data.f(px + c * time),
          `That follows the line the wrong way, to $x = ${px + c * time}$; the foot is at $x - ct$.`,
          `那是沿直线走反了方向，走到 $x = ${px + c * time}$；落点在 $x - ct$。`,
        ],
        [
          data.f(time),
          `That puts $t = ${time}$ into the initial data instead of the foot of the line.`,
          `那是把 $t = ${time}$ 代入了初始数据，而不是直线的落点。`,
        ],
        [px, `$${px}$ is the $x$ of the marked point, not the value of $u$ there.`, `$${px}$ 是标出点的 $x$，不是那里 $u$ 的值。`],
      ];
      return worked(
        [
          `The lines are the characteristics of $u_t + c u_x = 0$ in the plane with $x$ across and $t$ up, and $u(x, 0) = ${data.en}$. Find $u$ at the marked point.`,
          `图中直线是 $u_t + c u_x = 0$ 的特征线，横轴是 $x$，纵轴是 $t$，且 $u(x, 0) = ${data.en}$。求标出的点处的 $u$。`,
        ],
        data.f(foot),
        misses,
        [
          [
            ["Find the foot", "找出落点"],
            [
              `Here $c = ${cl}$, and the solid characteristic through $(${px}, ${time})$ is $x - ct = ${foot}$, so it meets $t = 0$ at $x = ${foot}$.`,
              `这里 $c = ${cl}$，经过 $(${px}, ${time})$ 的实线特征线是 $x - ct = ${foot}$，所以它与 $t = 0$ 交于 $x = ${foot}$。`,
            ],
          ],
          [
            ["Read the data there", "在落点读数据"],
            [
              `$u$ does not change along the line, so $u = u(${foot}, 0) = ${data.at(foot)} = ${data.f(foot)}$.`,
              `$u$ 沿直线不变，所以 $u = u(${foot}, 0) = ${data.at(foot)} = ${data.f(foot)}$。`,
            ],
          ],
        ],
        [
          `Starting at $x = ${foot}$ and moving at speed $${cl}$ for time ${time} gives $x = ${foot} ${c * time < 0 ? "-" : "+"} ${Math.abs(c * time)} = ${px}$, which is the marked point.`,
          `从 $x = ${foot}$ 出发，以速度 $${cl}$ 走时间 ${time}，得到 $x = ${foot} ${c * time < 0 ? "-" : "+"} ${Math.abs(c * time)} = ${px}$，正是标出的点。`,
        ],
        drawn(
          { xMin: 0, xMax: 10, yMin: 0, yMax: 6, yName: "t" },
          [...lines, { kind: "line", a: [foot, 0], b: [foot + c, 1], accent: true }, { kind: "point", at: [px, time], accent: true }],
          t(
            `Parallel straight characteristics in the $x$, $t$ plane, with a point on the solid one at $(${px}, ${time})$.`,
            `$x$、$t$ 平面上互相平行的特征线，实线上标出点 $(${px}, ${time})$。`,
          ),
        ),
      );
    });
  },
};

const heatOrder: KnowledgePointDef = {
  id: "ordering-heat-profiles-in-time",
  title: t("Ordering heat profiles in time", "按时间排列温度曲线"),
  explanation: t(
    "With both ends of a rod held at zero, heat drains out and a single sine mode keeps its shape while its height falls steadily. It never changes sign and never grows back, because the solution is $e^{-\\lambda t}$ times the mode. So among profiles of one rod, the taller curve is always the earlier one. For example, the profiles $5 \\sin(\\pi x / 8)$ and $2 \\sin(\\pi x / 8)$ of one rod come in that order: the first is taller, so it is earlier.\n\nCheck: the height is $h_0 e^{-\\lambda t}$ with $\\lambda > 0$, which only falls as $t$ grows, so the height $5$ comes before the height $2$.\n\n> **Watch out.** Compare the curves at their peaks, not at the ends: every profile is $0$ at both ends, because the ends are held at zero.",
    "杆的两端保持为零时，热量不断流失，单个正弦模态形状不变，高度持续下降。它不会变号，也不会再升高，因为解是 $e^{-\\lambda t}$ 乘这个模态。所以同一根杆的几条曲线中，较高的总是较早的。例如，同一根杆的曲线 $5 \\sin(\\pi x / 8)$ 和 $2 \\sin(\\pi x / 8)$ 按这个顺序出现：前者较高，所以较早。\n\n检验：高度是 $h_0 e^{-\\lambda t}$，其中 $\\lambda > 0$，它随 $t$ 增大只会下降，所以高度 $5$ 在高度 $2$ 之前。\n\n> **注意。** 要在峰顶比较曲线，而不是在两端：两端保持为零，每条曲线在两端都是 $0$。",
  ),
  generate(rng) {
    const mode = rng.pick([1, 1, 2]);
    const heights = [rng.int(5, 6), rng.int(3, 4), rng.pick([1, 2])] as const;
    const names = rng.shuffle(["A", "B", "C"]);
    const [first, middle, last] = names as [string, string, string];
    const latest = rng.bool();
    const answer = latest ? last : first;
    const name = (s: string): readonly [string, string] => [`Curve ${s}`, `曲线 ${s}`];
    const curves: PlaneMark[] = heights.flatMap((h, i): PlaneMark[] => [
      { kind: "curve", f: (x) => h * Math.sin((mode * Math.PI * x) / 8), from: 0, to: 8, accent: i === 0 },
      { kind: "label", at: [4 / mode, h], text: names[i] as string, dir: "n" },
    ]);
    const slips: Slip[] = latest
      ? [
          [
            name(first),
            `${first} is the tallest curve, so it is the earliest, not the latest.`,
            `${first} 是最高的曲线，所以时刻最早，而不是最晚。`,
          ],
          [name(middle), `${middle} is taller than ${last}, so it comes before ${last}.`, `${middle} 比 ${last} 高，所以在 ${last} 之前。`],
        ]
      : [
          [
            name(last),
            `${last} is the lowest curve, so it is the latest, not the earliest.`,
            `${last} 是最低的曲线，所以时刻最晚，而不是最早。`,
          ],
          [
            name(middle),
            `${middle} is lower than ${first}, so it comes after ${first}.`,
            `${middle} 比 ${first} 低，所以在 ${first} 之后。`,
          ],
        ];
    return chosen(
      rng,
      [
        `The curves show the temperature of one rod at three times, with both ends held at 0. Which curve is the ${latest ? "latest" : "earliest"}?`,
        `这些曲线是同一根杆在三个时刻的温度，两端保持为 0。哪条曲线的时刻${latest ? "最晚" : "最早"}？`,
      ],
      name(answer),
      slips,
      [
        [
          ["Read the heights", "读出高度"],
          [
            `The peaks of ${first}, ${middle} and ${last} reach ${heights[0]}, ${heights[1]} and ${heights[2]}.`,
            `${first}、${middle}、${last} 的峰顶分别达到 ${heights[0]}、${heights[1]}、${heights[2]}。`,
          ],
        ],
        [
          ["Order them in time", "按时间排列"],
          [
            `The height is $h_0 e^{-\\lambda t}$ and only falls, so the order in time is ${first}, ${middle}, ${last}, and the ${latest ? "latest" : "earliest"} is ${answer}.`,
            `高度是 $h_0 e^{-\\lambda t}$，只会下降，所以时间顺序是 ${first}、${middle}、${last}，时刻${latest ? "最晚" : "最早"}的是 ${answer}。`,
          ],
        ],
      ],
      [
        `The ratios $\\frac{${heights[1]}}{${heights[0]}}$ and $\\frac{${heights[2]}}{${heights[1]}}$ are both below 1, as a factor $e^{-\\lambda \\Delta t}$ with $\\Delta t > 0$ must be; the reverse order would need factors above 1.`,
        `比值 $\\frac{${heights[1]}}{${heights[0]}}$ 和 $\\frac{${heights[2]}}{${heights[1]}}$ 都小于 1，$\\Delta t > 0$ 时的因子 $e^{-\\lambda \\Delta t}$ 正应如此；相反的顺序需要大于 1 的因子。`,
      ],
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
    "With insulated ends no heat escapes, so the total heat in the rod never changes while the temperature evens out. The final uniform temperature must carry the same total, so it is the average of the initial temperature over the length. A longer stretch counts for more, which is why the average of the heights alone is wrong. For example, a rod of length $6$ at temperature $2$ on its first $4$ units and $8$ on the last $2$ settles at $\\frac{4 \\cdot 2 + 2 \\cdot 8}{6} = 4$.\n\nCheck: the total heat starts as $4 \\cdot 2 + 2 \\cdot 8 = 24$ and ends as $6 \\cdot 4 = 24$.\n\n> **Watch out.** Averaging the two heights gives $\\frac{2 + 8}{2} = 5$, which ignores that the cooler piece is twice as long as the hotter one.",
    "两端绝热时热量不会散失，温度趋于均匀的过程中，杆里的总热量不变。最终的均匀温度必须对应同样的总热量，所以它是初始温度沿长度的平均值。长的一段权重更大，所以只平均高度是错的。例如，长度为 $6$ 的杆，前 $4$ 个单位温度是 $2$，后 $2$ 个单位是 $8$，最终温度是 $\\frac{4 \\cdot 2 + 2 \\cdot 8}{6} = 4$。\n\n检验：总热量开始是 $4 \\cdot 2 + 2 \\cdot 8 = 24$，最后是 $6 \\cdot 4 = 24$。\n\n> **注意。** 只平均两个高度得到 $\\frac{2 + 8}{2} = 5$，忽略了较冷的一段是较热一段的两倍长。",
  ),
  generate(rng) {
    return until(() => {
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
      const hottest = Math.max(...pieces.map((p) => p.u));
      return worked(
        [
          `The graph shows the initial temperature of a rod of length ${length} whose ends are insulated. What uniform temperature does the rod approach as $t \\to \\infty$?`,
          `图中是长度为 ${length}、两端绝热的杆的初始温度。当 $t \\to \\infty$ 时，杆趋近于什么均匀温度？`,
        ],
        answer,
        [
          [
            Q.of(plain, pieces.length),
            "That averages the heights alone; each piece has to be weighted by its length.",
            "那只平均了高度；每一段都要按长度加权。",
          ],
          [
            Q.of(total, 1),
            `$${total}$ is the total heat; it still has to be spread over the length ${length}.`,
            `$${total}$ 是总热量，还要分摊到长度 ${length} 上。`,
          ],
          [
            0,
            "That is the limit when the ends are held at 0; insulated ends keep the heat in.",
            "那是两端保持为 0 时的极限；两端绝热时热量留在杆里。",
          ],
          [
            hottest,
            `$${hottest}$ is the temperature of the hottest piece; its heat spreads into the cooler pieces, so it cools down.`,
            `$${hottest}$ 是最热一段的温度；它的热量会流向较冷的部分，所以它会降温。`,
          ],
        ],
        [
          [
            ["Find the total heat", "求总热量"],
            [`Length times temperature on each piece: $${parts} = ${total}$.`, `每一段的长度乘温度：$${parts} = ${total}$。`],
          ],
          [
            ["Spread it over the rod", "分摊到整根杆"],
            [
              `No heat leaves, so the final temperature is $${total} \\div ${length} = ${answer.toLatex()}$.`,
              `热量不会散失，所以最终温度是 $${total} \\div ${length} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `A uniform temperature $${answer.toLatex()}$ over length ${length} holds $${length} \\cdot ${answer.toLatex()} = ${total}$, the same total as at the start.`,
          `长度 ${length} 上均匀的温度 $${answer.toLatex()}$ 对应 $${length} \\cdot ${answer.toLatex()} = ${total}$，与开始时的总量相同。`,
        ],
        drawn(
          { xMin: 0, xMax: length, yMin: 0, yMax: 10, yName: "u" },
          pieces.map((p): PlaneMark => ({ kind: "segment", a: [p.from, p.u], b: [p.to, p.u], accent: true })),
          t(`A piecewise constant temperature over a rod of length ${length}.`, `长度为 ${length} 的杆上分段为常数的温度。`),
        ),
      );
    });
  },
};

const standingWave: KnowledgePointDef = {
  id: "the-period-of-a-standing-wave",
  title: t("The period of a standing wave", "驻波的周期"),
  explanation: t(
    "A string fixed at both ends vibrates in modes $\\sin(n \\pi x / L)$, and $n$ is the number of loops you can count between the ends. Each mode oscillates in time with angular frequency $n \\pi c / L$, so its period is $2L / (nc)$. More loops mean a faster vibration, which is why a harmonic sounds higher than the fundamental. For example, a string of length $6$ with wave speed $2$ showing $3$ loops is in mode $n = 3$, so its period is $\\frac{2 \\cdot 6}{3 \\cdot 2} = 2$.\n\nCheck: the angular frequency is $\\frac{3 \\pi \\cdot 2}{6} = \\pi$, and $\\frac{2 \\pi}{\\pi} = 2$.\n\n> **Watch out.** The period $\\frac{2L}{c}$ belongs to the fundamental, with one loop; with $n$ loops divide it by $n$. And $\\frac{L}{nc}$ is only half a period, the time from one extreme to the other.",
    "两端固定的弦按 $\\sin(n \\pi x / L)$ 的模态振动，$n$ 就是两端之间能数出的波腹个数。每个模态随时间振动的角频率是 $n \\pi c / L$，所以周期是 $2L / (nc)$。波腹越多，振动越快，所以泛音比基音高。例如，长度为 $6$、波速为 $2$ 的弦显示 $3$ 个波腹，就是 $n = 3$ 的模态，周期是 $\\frac{2 \\cdot 6}{3 \\cdot 2} = 2$。\n\n检验：角频率是 $\\frac{3 \\pi \\cdot 2}{6} = \\pi$，而 $\\frac{2 \\pi}{\\pi} = 2$。\n\n> **注意。** 周期 $\\frac{2L}{c}$ 属于只有一个波腹的基音；有 $n$ 个波腹时要再除以 $n$。而 $\\frac{L}{nc}$ 只是半个周期，即从一个极端位置到另一个的时间。",
  ),
  generate(rng) {
    return until(() => {
      const n = rng.int(1, 5);
      const length = rng.pick([4, 6, 8, 10]);
      const c = rng.int(1, 3);
      const answer = Q.of(2 * length, n * c);
      const omega = Q.of(n * c, length);
      const omegaL = omega.eq(Q.of(1, 1)) ? "\\pi" : `${omega.toLatex()} \\pi`;
      return worked(
        [
          `A string of length ${length}, fixed at both ends with wave speed ${c}, vibrates in the standing wave shown at its two extremes. What is the period of the vibration?`,
          `长度为 ${length}、两端固定、波速为 ${c} 的弦按图中的驻波振动，图中画出了两个极端位置。振动周期是多少？`,
        ],
        answer,
        [
          [
            Q.of(2 * length, c),
            `That is the period of the fundamental, with one loop; this string shows ${n} loops, so divide by ${n}.`,
            `那是只有一个波腹的基音的周期；这根弦有 ${n} 个波腹，要再除以 ${n}。`,
          ],
          [
            Q.of(length, n * c),
            "That is half a period: the time to swing from one extreme to the other.",
            "那是半个周期：从一个极端位置摆到另一个的时间。",
          ],
          [
            Q.of(n * c, 2 * length),
            "That is the number of vibrations per unit time, the frequency, not the period.",
            "那是单位时间内的振动次数，即频率，而不是周期。",
          ],
          [
            Q.of(2 * length, (n + 1) * c),
            `That uses $n = ${n + 1}$, the number of points that stay still, ends included; $n$ counts the loops.`,
            `那用了 $n = ${n + 1}$，即包括两端在内不动的点数；$n$ 数的是波腹。`,
          ],
        ],
        [
          [
            ["Count the loops", "数波腹"],
            [
              `The drawing has ${n} ${n === 1 ? "loop" : "loops"} between the fixed ends, so this is mode $n = ${n}$.`,
              `图中两个固定端之间有 ${n} 个波腹，所以这是 $n = ${n}$ 的模态。`,
            ],
          ],
          [
            ["Use the period of the mode", "用模态的周期"],
            [
              `$T = \\frac{2L}{nc} = ${2 * length} \\div ${n * c} = ${answer.toLatex()}$.`,
              `$T = \\frac{2L}{nc} = ${2 * length} \\div ${n * c} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The angular frequency is $\\omega = \\frac{n \\pi c}{L} = ${omegaL}$, and $\\frac{2 \\pi}{\\omega} = ${answer.toLatex()}$, the time for $\\cos(\\omega t)$ to make one full cycle.`,
          `角频率是 $\\omega = \\frac{n \\pi c}{L} = ${omegaL}$，而 $\\frac{2 \\pi}{\\omega} = ${answer.toLatex()}$，正是 $\\cos(\\omega t)$ 完成一个周期的时间。`,
        ],
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
    });
  },
};

const splitPulse: KnowledgePointDef = {
  id: "the-value-of-a-splitting-pulse",
  title: t("The value of a splitting pulse", "分裂脉冲的值"),
  explanation: t(
    "When a string starts at rest, d'Alembert's formula reads $u(x, t) = \\frac{1}{2} \\left[ f(x - ct) + f(x + ct) \\right]$. The initial shape splits into two half-height copies moving in opposite directions at speed $c$. To find a value, look back a distance $ct$ on each side, read the initial shape at both places, and average the two readings. For example, if $f$ is a tent of height $4$ and half-width $2$ centered at $0$, and $c = 1$, then $u(2, 1) = \\frac{1}{2} \\left[ f(1) + f(3) \\right] = \\frac{1}{2} (2 + 0) = 1$.\n\nCheck: at $t = 1$ the right-moving copy, of height $2$, has its peak at $x = 1$ and falls to $1$ at $x = 2$, while the left-moving copy is centered at $x = -1$ and is $0$ there.\n\n> **Watch out.** Do not forget the factor $\\frac{1}{2}$, and do not read $f$ at $x$ itself: the two readings come from $x - ct$ and $x + ct$.",
    "弦从静止开始时，达朗贝尔公式是 $u(x, t) = \\frac{1}{2} \\left[ f(x - ct) + f(x + ct) \\right]$。初始形状分裂成两个一半高的副本，以速度 $c$ 向相反方向移动。求某点的值，就在两侧各退后距离 $ct$，读出那两处的初始形状，再取平均。例如，$f$ 是以 $0$ 为中心、高 $4$、半宽 $2$ 的帐篷形，$c = 1$，那么 $u(2, 1) = \\frac{1}{2} \\left[ f(1) + f(3) \\right] = \\frac{1}{2} (2 + 0) = 1$。\n\n检验：$t = 1$ 时向右移动的副本高 $2$，峰顶在 $x = 1$，到 $x = 2$ 处降到 $1$；向左移动的副本以 $x = -1$ 为中心，在那里是 $0$。\n\n> **注意。** 不要忘记因子 $\\frac{1}{2}$，也不要在 $x$ 本身读 $f$：两个读数来自 $x - ct$ 和 $x + ct$。",
  ),
  generate(rng) {
    return until(() => {
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
      const wave = c * c === 1 ? "u_{xx}" : `${c * c} u_{xx}`;
      const [rightPart, leftPart] = [Q.of(behind, 2).toLatex(), Q.of(ahead, 2).toLatex()];
      return worked(
        [
          `A string starts at rest with the shape $u(x, 0)$ shown, and it obeys $u_{tt} = ${wave}$ on the whole line. Find $u(${x}, ${time})$.`,
          `弦从静止开始，初始形状 $u(x, 0)$ 如图，满足整条直线上的 $u_{tt} = ${wave}$。求 $u(${x}, ${time})$。`,
        ],
        answer,
        [
          [
            Q.of(behind + ahead, 1),
            "That adds the two readings but leaves out the factor $\\frac{1}{2}$.",
            "那把两个读数相加了，却漏掉了因子 $\\frac{1}{2}$。",
          ],
          [
            Q.of(f(x), 1),
            `That reads the initial shape at $x = ${x}$ itself, as if the string had not moved.`,
            `那是在 $x = ${x}$ 本身读初始形状，好像弦没有动过。`,
          ],
          [
            Q.of(f(x), 2),
            `That halves the initial shape at $x = ${x}$ but does not move the two copies apart.`,
            `那把 $x = ${x}$ 处的初始形状减半了，却没有让两个副本分开移动。`,
          ],
          [
            Q.of(behind, 1),
            `That is $f(x - ct)$ alone, without the other reading and without the factor $\\frac{1}{2}$.`,
            `那只是 $f(x - ct)$，漏掉了另一个读数和因子 $\\frac{1}{2}$。`,
          ],
          [
            Q.of(ahead, 1),
            `That is $f(x + ct)$ alone, without the other reading and without the factor $\\frac{1}{2}$.`,
            `那只是 $f(x + ct)$，漏掉了另一个读数和因子 $\\frac{1}{2}$。`,
          ],
          [
            Q.of(height, 2),
            "That is the height of each copy at its peak, not its value at this point.",
            "那是每个副本峰顶的高度，而不是它在这一点的值。",
          ],
        ],
        [
          [
            ["Look back on both sides", "向两侧回看"],
            [
              `Here $c = ${c}$ and $t = ${time}$, so $ct = ${reach}$. The shape at $x = ${x} - ${reach} = ${x - reach}$ is ${behind}, and at $x = ${x} + ${reach} = ${x + reach}$ it is ${ahead}.`,
              `这里 $c = ${c}$，$t = ${time}$，所以 $ct = ${reach}$。形状在 $x = ${x} - ${reach} = ${x - reach}$ 处是 ${behind}，在 $x = ${x} + ${reach} = ${x + reach}$ 处是 ${ahead}。`,
            ],
          ],
          [
            ["Average the readings", "取平均"],
            [
              `$u(${x}, ${time}) = \\frac{1}{2} (${behind} + ${ahead}) = ${answer.toLatex()}$.`,
              `$u(${x}, ${time}) = \\frac{1}{2} (${behind} + ${ahead}) = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        [
          `The copy moving right is centered at $x = ${reach}$ and gives $${rightPart}$ here; the copy moving left is centered at $x = -${reach}$ and gives $${leftPart}$; together they make $${answer.toLatex()}$.`,
          `向右移动的副本以 $x = ${reach}$ 为中心，在这里给出 $${rightPart}$；向左移动的副本以 $x = -${reach}$ 为中心，给出 $${leftPart}$；合起来是 $${answer.toLatex()}$。`,
        ],
        drawn(
          { xMin: -8, xMax: 8, yMin: -1, yMax: 7, labelEvery: 2, yName: "u" },
          [{ kind: "path", points: tent(0, half, height, -8, 8), accent: true }],
          t(
            `A tent-shaped initial position centered at 0, of height ${height} and half-width ${half}.`,
            `以 0 为中心的帐篷形初始位置，高 ${height}，半宽 ${half}。`,
          ),
        ),
      );
    });
  },
};

const stencilStep: KnowledgePointDef = {
  id: "one-step-on-a-difference-grid",
  title: t("One step on a difference grid", "差分网格上走一步"),
  explanation: t(
    "The explicit scheme for the heat equation is $u_j^{n+1} = u_j^n + r \\left( u_{j-1}^n - 2 u_j^n + u_{j+1}^n \\right)$, where $r = \\alpha \\Delta t / (\\Delta x)^2$. It uses three neighbouring values in the row below to compute one value in the next row. A point lower than the average of its neighbours warms up, and a higher one cools down. For example, with $r = \\frac{1}{4}$ and the values $4, 2, 8$ in a row, the new middle value is $2 + \\frac{1}{4} (4 - 2 \\cdot 2 + 8) = 4$.\n\nCheck: the middle $2$ was below its neighbours' average $6$, and it rose to $4$, toward that average.\n\n> **Watch out.** The middle value enters twice: as $-2 u_j^n$ inside the bracket, and as the $u_j^n$ the update is added to. Leaving out either one gives a wrong value.",
    "热方程的显式格式是 $u_j^{n+1} = u_j^n + r \\left( u_{j-1}^n - 2 u_j^n + u_{j+1}^n \\right)$，其中 $r = \\alpha \\Delta t / (\\Delta x)^2$。它用下面一行相邻的三个值算出上一行的一个值。比两邻平均值低的点会升温，高的点会降温。例如，$r = \\frac{1}{4}$，一行中相邻的值是 $4, 2, 8$，新的中间值是 $2 + \\frac{1}{4} (4 - 2 \\cdot 2 + 8) = 4$。\n\n检验：中间的 $2$ 低于两邻的平均值 $6$，它升到了 $4$，向那个平均值靠近。\n\n> **注意。** 中间值出现两次：括号里的 $-2 u_j^n$，以及更新量要加上的 $u_j^n$。漏掉任何一个都会算错。",
  ),
  generate(rng) {
    return until(() => {
      const values = Array.from({ length: 5 }, () => rng.int(1, 9) * rng.pick([2, 4]));
      const r = rng.pick([Q.of(1, 4), Q.of(1, 2), Q.of(1, 8)]);
      const [left, here, right] = [values[1] as number, values[2] as number, values[3] as number];
      const change = Q.of(left - 2 * here + right, 1);
      const step = r.mul(change);
      const answer = Q.of(here, 1).add(step);
      const stepL = step.sign() < 0 ? `\\left(${step.toLatex()}\\right)` : step.toLatex();
      const middle = Q.of(1, 1).sub(r.mul(Q.of(2, 1)));
      const name = "j";
      return worked(
        [
          `The bottom row holds the values $u_j^n$ of the explicit heat scheme with $r = ${r.toLatex()}$. Find the value in the ringed cell of the row above, at time level $n + 1$.`,
          `下面一行是显式热方程格式的值 $u_j^n$，$r = ${r.toLatex()}$。求上面一行（时间层 $n + 1$）带圈格子里的值。`,
        ],
        answer,
        [
          [
            step,
            `That is only the update $r(\\dots)$; it still has to be added to $u_j^n = ${here}$.`,
            `那只是更新量 $r(\\dots)$，还要加到 $u_j^n = ${here}$ 上。`,
          ],
          [
            Q.of(here, 1).add(r.mul(Q.of(left + 2 * here + right, 1))),
            "That adds the middle value inside the bracket; it enters as $-2 u_j^n$.",
            "那在括号里加上了中间值；它应以 $-2 u_j^n$ 出现。",
          ],
          [
            Q.of(left + right, 2),
            "That is the average of the two neighbours, not one step of the scheme.",
            "那是两邻的平均值，而不是格式走的一步。",
          ],
          [
            Q.of(here, 1).sub(step),
            "That subtracts the update; the scheme adds $r(\\dots)$ to $u_j^n$.",
            "那减去了更新量；格式是把 $r(\\dots)$ 加到 $u_j^n$ 上。",
          ],
        ],
        [
          [
            ["Pick the stencil", "取出模板"],
            [
              `The ringed cell sits above $u_j^n = ${here}$, whose neighbours are ${left} and ${right}.`,
              `带圈的格子在 $u_j^n = ${here}$ 的上方，它的两邻是 ${left} 和 ${right}。`,
            ],
          ],
          [
            ["Apply the scheme", "代入格式"],
            [
              `$${here} + ${r.toLatex()} \\left( ${left} - 2 \\cdot ${here} + ${right} \\right) = ${here} + ${stepL} = ${answer.toLatex()}$.`,
              `$${here} + ${r.toLatex()} \\left( ${left} - 2 \\cdot ${here} + ${right} \\right) = ${here} + ${stepL} = ${answer.toLatex()}$。`,
            ],
          ],
        ],
        middle.isZero()
          ? [
              `With $r = \\frac{1}{2}$ the middle value drops out and the scheme is the neighbours' average: $\\frac{${left} + ${right}}{2} = ${answer.toLatex()}$.`,
              `$r = \\frac{1}{2}$ 时中间值消去，格式就是两邻的平均值：$\\frac{${left} + ${right}}{2} = ${answer.toLatex()}$。`,
            ]
          : [
              `Written as a weighted average, the step is $${middle.toLatex()} \\cdot ${here} + ${r.toLatex()} \\cdot (${left} + ${right}) = ${answer.toLatex()}$, with weight $${middle.toLatex()}$ on the middle and $${r.toLatex()}$ on each neighbour.`,
              `写成加权平均，这一步是 $${middle.toLatex()} \\cdot ${here} + ${r.toLatex()} \\cdot (${left} + ${right}) = ${answer.toLatex()}$，中间的权重是 $${middle.toLatex()}$，每个邻点的权重是 $${r.toLatex()}$。`,
            ],
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
    });
  },
};

const fivePoint: KnowledgePointDef = {
  id: "the-five-point-average",
  title: t("The five-point average", "五点平均"),
  explanation: t(
    "On a square grid, the discrete form of Laplace's equation says that each interior value is the average of its four neighbours. This is the grid version of the mean value property, and it is why a harmonic function has no interior peaks: a point cannot be higher than all of its neighbours if it equals their average. For example, if the neighbours are $10, 12, 13$ and $13$, the center is $\\frac{48}{4} = 12$.\n\nCheck: $12$ lies between the smallest neighbour $10$ and the largest $13$, as an average must.\n\n> **Watch out.** Average only the four neighbours: the center is not one of them, so divide by $4$, not $5$. A missing neighbour is $4$ times the center minus the other three.",
    "在正方形网格上，拉普拉斯方程的离散形式是：每个内部点的值等于四个相邻点的平均值。这是平均值性质的网格版本，也说明调和函数内部没有峰值：一个点如果等于相邻点的平均值，就不可能比它们都高。例如，相邻点是 $10, 12, 13$ 和 $13$ 时，中心是 $\\frac{48}{4} = 12$。\n\n检验：$12$ 在最小的相邻点 $10$ 和最大的 $13$ 之间，平均值理应如此。\n\n> **注意。** 只平均四个相邻点：中心不是其中之一，所以除以 $4$，而不是 $5$。缺少的相邻点等于中心的 $4$ 倍减去另外三个。",
  ),
  generate(rng) {
    return until(() => {
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
      const sum4 = sum3 + hidden;
      const [low, high] = [Math.min(...around), Math.max(...around)];
      const misses: Miss[] = askCenter
        ? [
            [
              sum4,
              "That is the sum of the four neighbours; the center is their average, so divide by 4.",
              "那是四个相邻点的和；中心是它们的平均值，要除以 4。",
            ],
            [
              Q.of(sum4, 5),
              "That divides by 5, as if the center were one of its own neighbours.",
              "那是除以 5，好像中心也是它自己的相邻点。",
            ],
            [
              high,
              `$${high}$ is the largest neighbour; an average lies between the smallest and the largest.`,
              `$${high}$ 是最大的相邻点；平均值在最小值和最大值之间。`,
            ],
            [
              low,
              `$${low}$ is the smallest neighbour; an average lies between the smallest and the largest.`,
              `$${low}$ 是最小的相邻点；平均值在最小值和最大值之间。`,
            ],
          ]
        : [
            [
              Q.of(sum3, 3),
              "That averages the three known neighbours; it is the center that must equal the average of all four.",
              "那是三个已知相邻点的平均值；要等于四个相邻点平均值的是中心。",
            ],
            [
              center,
              "That copies the center; a neighbour need not equal it, only the four together must average to it.",
              "那是照抄中心；相邻点不必等于它，只要四个合起来的平均值等于它。",
            ],
            [
              5 * center - sum3,
              "That counts the center as a fifth value, making all five add up to 5 times the center.",
              "那把中心也算作第五个值，让五个数之和等于中心的 5 倍。",
            ],
            [
              sum3 - center,
              "That subtracts the center from the known three; the four neighbours add up to 4 times the center.",
              "那是用已知三个之和减去中心；四个相邻点之和等于中心的 4 倍。",
            ],
          ];
      const steps: Walk[] = askCenter
        ? [
            [
              ["Add the neighbours", "把相邻点相加"],
              [`$${around.join(" + ")} = ${sum4}$.`, `$${around.join(" + ")} = ${sum4}$。`],
            ],
            [
              ["Divide by 4", "除以 4"],
              [`The center is their average: $${sum4} \\div 4 = ${center}$.`, `中心是它们的平均值：$${sum4} \\div 4 = ${center}$。`],
            ],
          ]
        : [
            [
              ["Use the average", "用平均值"],
              [
                `The center is the average, so the four neighbours add up to $4 \\cdot ${center} = ${4 * center}$.`,
                `中心是平均值，所以四个相邻点之和是 $4 \\cdot ${center} = ${4 * center}$。`,
              ],
            ],
            [
              ["Subtract the known three", "减去已知的三个"],
              [
                `The known ones add up to $${known.join(" + ")} = ${sum3}$, so the last is $${4 * center} - ${sum3} = ${hidden}$.`,
                `已知的三个之和是 $${known.join(" + ")} = ${sum3}$，所以最后一个是 $${4 * center} - ${sum3} = ${hidden}$。`,
              ],
            ],
          ];
      const check: readonly [string, string] = askCenter
        ? [
            `$${center}$ lies between the smallest neighbour ${low} and the largest ${high}, and $4 \\cdot ${center} = ${sum4}$.`,
            `$${center}$ 在最小的相邻点 ${low} 和最大的 ${high} 之间，而且 $4 \\cdot ${center} = ${sum4}$。`,
          ]
        : [
            `With ${hidden} filled in, $\\frac{${around.join(" + ")}}{4} = ${center}$, the value at the center.`,
            `填入 ${hidden} 后，$\\frac{${around.join(" + ")}}{4} = ${center}$，正是中心的值。`,
          ];
      return worked(
        [
          "These five grid values satisfy the discrete Laplace equation at the center. Which number belongs in the ringed node?",
          "这五个网格值在中心处满足离散拉普拉斯方程。带圈的结点应填哪个数？",
        ],
        answer,
        misses,
        steps,
        check,
        {
          svg: svgDocument(192, lines + nodes + middle),
          alt: t(
            "A center node joined to four neighbours, with one node ringed and unknown.",
            "中心结点与四个相邻结点相连，其中一个结点带圈且未知。",
          ),
        },
      );
    });
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
