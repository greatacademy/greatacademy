// A third knowledge point for the first half of the exam fundamentals topics that still had two.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { choose } from "./early-grades-more-kit.ts";
import { chooseFilled, decimal, fraction, integer, signed, skill } from "./third-kit.ts";

/** Rng is the random source a generator receives. */
type Rng = Parameters<KnowledgePointDef["generate"]>[0];

/** nz picks a nonzero integer of size at most n. */
const nz = (rng: Rng, n: number) => rng.int(1, n) * (rng.bool() ? 1 : -1);

/** paren writes a negative number in parentheses. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

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

/** deeperExamFundamentalsThirdPoints holds these third knowledge points, by topic in the exam shard. */
export const deeperExamFundamentalsThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "adding-rational-expressions-using-polynomial-factorization": [
    skill(
      "subtracting-with-a-factored-denominator",
      ["Subtracting with a factored denominator", "分母可分解时的减法"],
      [
        "Subtraction follows the same path as addition. Factor the denominators, rewrite over the common denominator, and look for a factor in the new numerator that cancels with the denominator.",
        "减法与加法的步骤相同。分解分母，通分，再看新分子中有没有能与分母约去的因式。",
      ],
      (rng) => {
        const a = rng.int(1, 40);
        return chooseFilled(
          rng,
          [
            `Write $\\frac{1}{x - ${a}} - \\frac{${2 * a}}{x^2 - ${a * a}}$ as a single fraction in lowest terms.`,
            `把 $\\frac{1}{x - ${a}} - \\frac{${2 * a}}{x^2 - ${a * a}}$ 写成一个最简分式。`,
          ],
          `\\frac{1}{x + ${a}}`,
          [`\\frac{1}{x - ${a}}`, `\\frac{${1 - 2 * a}}{x^2 - ${a * a}}`, `\\frac{x + ${a}}{x^2 - ${a * a}}`],
          [
            `The numerator over the common denominator is $(x + ${a}) - ${2 * a} = x - ${a}$, which cancels.`,
            `通分后的分子是 $(x + ${a}) - ${2 * a} = x - ${a}$，可以约去。`,
          ],
        );
      },
    ),
  ],
  "adjusting-outcomes-to-a-target-probability": [
    skill(
      "removing-to-reach-a-target",
      ["Removing to reach a target", "减少数量以达到目标概率"],
      [
        "Removing only blue marbles leaves the red count unchanged. So the target probability tells you the new total from the red count, and the difference from the old total is what must go.",
        "只拿走蓝球时，红球数不变。所以由目标概率和红球数可以求出新的总数，它与原总数的差就是要拿走的数量。",
      ],
      (rng) => {
        const [p, q] = rng.pick<[number, number]>([
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [2, 5],
          [3, 5],
        ]);
        const k = rng.int(2, 8);
        const n = rng.int(2, 20);
        const blue = (q - p) * k + n;
        return integer(
          [
            `A bag contains ${p * k} red marbles and ${blue} blue marbles. How many blue marbles must be removed so that the probability of drawing red is $\\frac{${p}}{${q}}$?`,
            `袋中有 ${p * k} 个红球和 ${blue} 个蓝球。要拿走多少个蓝球，才能使摸到红球的概率为 $\\frac{${p}}{${q}}$？`,
          ],
          n,
          [q * k, (q - p) * k, n + p * k],
          [
            `The new total must be ${q * k}, so ${(q - p) * k} blue marbles stay and ${n} go.`,
            `新的总数必须是 ${q * k}，所以留下 ${(q - p) * k} 个蓝球，拿走 ${n} 个。`,
          ],
        );
      },
    ),
  ],
  "algebraic-expressions-with-rates-and-ratios": [
    skill(
      "a-cost-with-a-unit-change",
      ["A cost with a unit change", "含单位换算的费用"],
      [
        "Divide to get the rate for one item, multiply by the number of items, and then deal with the units. A cost in cents becomes a cost in dollars by dividing by 100.",
        "先相除得到一件的单价，再乘件数，最后处理单位。以分计的费用除以 100 就变成以元计的费用。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample(["a", "b", "c", "d", "k", "m", "n", "p", "q", "r", "s", "t"], 3) as [string, string, string];
        const per = rng.pick([100, 1000, 60]);
        const unit =
          per === 100
            ? (["cents", "dollars", "分", "元"] as const)
            : per === 1000
              ? (["grams", "kilograms", "克", "千克"] as const)
              : (["seconds", "minutes", "秒", "分钟"] as const);
        return chooseFilled(
          rng,
          [
            `It takes ${unit[0] === "cents" ? `$${a}$ cents to buy` : unit[0] === "grams" ? `$${a}$ grams of metal to make` : `$${a}$ seconds to make`} $${b}$ parts. At this rate, how many ${unit[1]} does it take for $${c}$ parts?`,
            `做 $${b}$ 个零件需要 $${a}$ ${unit[2]}。按此比率，$${c}$ 个零件需要多少${unit[3]}？`,
          ],
          `\\frac{${a}${c}}{${per}${b}}`,
          [`\\frac{${a}${c}}{${b}}`, `\\frac{${per}${a}${c}}{${b}}`, `\\frac{${b}${c}}{${per}${a}}`],
          [
            `One part takes $\\frac{${a}}{${b}}$ ${unit[0]}, so $${c}$ parts take $\\frac{${a}${c}}{${b}}$, and dividing by ${per} changes the unit.`,
            `一个零件需要 $\\frac{${a}}{${b}}$ ${unit[2]}，$${c}$ 个需要 $\\frac{${a}${c}}{${b}}$，除以 ${per} 就换了单位。`,
          ],
        );
      },
    ),
  ],
  "analyzing-linear-functions-in-tabular-form": [
    skill(
      "the-input-for-a-given-output",
      ["The input for a given output", "由输出求输入"],
      [
        "A table may not show the input you need. Find the slope and the rule from two entries, and then set the rule equal to the given output and solve for the input.",
        "表格里可能没有你要的输入。先由两组数据求斜率和解析式，再令解析式等于给定的输出，解出输入。",
      ],
      (rng) => {
        const m = nz(rng, 7);
        const b = rng.int(-12, 12);
        const start = rng.int(-4, 3);
        const xs = [start, start + 2, start + 4, start + 6];
        const answer = start + rng.int(8, 30);
        return integer(
          [
            `The table shows values of a linear function $f$. For what $x$ is $f(x) = ${m * answer + b}$? ${table(
              xs,
              xs.map((x) => m * x + b),
            )}`,
            `表格给出线性函数 $f$ 的一些值。$x$ 为何值时 $f(x) = ${m * answer + b}$？${table(
              xs,
              xs.map((x) => m * x + b),
            )}`,
          ],
          answer,
          [m * answer, answer + 2, answer - m],
          [
            `The rule is $f(x) = ${m}x${signed(b)}$, and solving gives $x = ${answer}$.`,
            `解析式是 $f(x) = ${m}x${signed(b)}$，解得 $x = ${answer}$。`,
          ],
        );
      },
    ),
  ],
  "applying-a-common-multiple": [
    skill(
      "common-multiples-with-binomial-numerators",
      ["Common multiples with binomial numerators", "分子是二项式时的公倍数"],
      [
        "When a numerator has two terms, multiplying by the common multiple keeps them together in parentheses. So expand each product carefully after clearing the denominators, and then collect like terms.",
        "分子有两项时，乘公倍数后要把它们放在括号里。所以去分母之后要仔细展开每个乘积，再合并同类项。",
      ],
      (rng) => {
        const [p, q] = rng.pick<[number, number]>([
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [5, 6],
          [3, 7],
        ]);
        const x = rng.int(1, 30);
        const u = rng.int(1, 9);
        const v = rng.int(1, 9);
        const a = p * u - x === 0 ? p * (u + 1) - x : p * u - x;
        const b = q * v - x === 0 ? q * (v + 1) - x : q * v - x;
        const sum = (x + a) / p + (x + b) / q;
        return integer(
          [
            `Solve $\\frac{x${signed(a)}}{${p}} + \\frac{x${signed(b)}}{${q}} = ${sum}$.`,
            `解 $\\frac{x${signed(a)}}{${p}} + \\frac{x${signed(b)}}{${q}} = ${sum}$。`,
          ],
          x,
          [x + a, x + b, sum],
          [
            `Multiplying by ${p * q} gives $${q}(x${signed(a)}) + ${p}(x${signed(b)}) = ${p * q * sum}$, so $x = ${x}$.`,
            `乘 ${p * q} 得 $${q}(x${signed(a)}) + ${p}(x${signed(b)}) = ${p * q * sum}$，所以 $x = ${x}$。`,
          ],
        );
      },
    ),
  ],
  "applying-converted-lengths": [
    skill(
      "an-area-with-sides-in-two-units",
      ["An area with sides in two units", "边长单位不同时的面积"],
      [
        "An area only makes sense when both sides use the same unit. So convert the yards to feet by multiplying by 3 before multiplying the two sides together.",
        "两条边单位相同，面积才有意义。所以先把码乘 3 化成英尺，再把两条边相乘。",
      ],
      (rng) => {
        const y = rng.int(2, 30);
        const f = rng.int(4, 40);
        return integer(
          [
            `A room is ${y} yards long and ${f} feet wide. What is its area in square feet?`,
            `房间长 ${y} 码，宽 ${f} 英尺。它的面积是多少平方英尺？`,
          ],
          3 * y * f,
          [y * f, 9 * y * f, 2 * (3 * y + f)],
          [
            `The length is ${3 * y} feet, and $${3 * y} \\times ${f} = ${3 * y * f}$.`,
            `长是 ${3 * y} 英尺，$${3 * y} \\times ${f} = ${3 * y * f}$。`,
          ],
        );
      },
    ),
  ],
  "applying-defined-operations": [
    skill(
      "a-nested-defined-operation",
      ["A nested defined operation", "嵌套的定义运算"],
      [
        "A defined operation inside parentheses is worked out first, just like ordinary arithmetic. Its result then becomes one of the inputs of the outer operation, in the correct position because order may matter.",
        "括号里的定义运算要先算，和普通算术一样。它的结果再作为外层运算的一个输入，位置要对，因为顺序可能有影响。",
      ],
      (rng) => {
        const k = rng.int(2, 5);
        const p = nz(rng, 6);
        const q = nz(rng, 6);
        const r = nz(rng, 9);
        const inner = k * p - q;
        return integer(
          [
            `For all numbers $a$ and $b$, let $a \\star b = ${k}a - b$. What is the value of $(${p} \\star ${q}) \\star ${r}$?`,
            `对所有数 $a$、$b$，定义 $a \\star b = ${k}a - b$。求 $(${p} \\star ${q}) \\star ${r}$ 的值。`,
          ],
          k * inner - r,
          [inner - r, k * r - inner, k * p - (k * q - r)],
          [
            `Inside, $${k} \\cdot ${paren(p)} - ${paren(q)} = ${inner}$. Then $${k} \\cdot ${paren(inner)} - ${paren(r)} = ${k * inner - r}$.`,
            `括号内 $${k} \\cdot ${paren(p)} - ${paren(q)} = ${inner}$。然后 $${k} \\cdot ${paren(inner)} - ${paren(r)} = ${k * inner - r}$。`,
          ],
        );
      },
    ),
  ],
  "applying-the-distributive-law-to-exponential-expressions": [
    skill(
      "solving-after-factoring-a-power",
      ["Solving after factoring a power", "提取幂后求解"],
      [
        "Two powers of the same base add up only after a common power is factored out. What remains is an ordinary number, which you divide by to reveal a single power of the base.",
        "同底的两个幂提取公共幂之后才能相加。剩下的是一个普通的数，除以它就得到底数的一个幂。",
      ],
      (rng) => {
        const b = rng.pick([2, 3]);
        const k = rng.int(1, 3);
        const n = rng.int(1, b === 2 ? 9 : 6);
        const m = b ** k + 1;
        return integer(
          [`Solve for $n$: $${b}^{n + ${k}} + ${b}^{n} = ${m * b ** n}$.`, `解出 $n$：$${b}^{n + ${k}} + ${b}^{n} = ${m * b ** n}$。`],
          n,
          [n + k, n + 1 === k ? n + 2 : n + 1, m],
          [
            `The left side is $${m} \\cdot ${b}^{n}$, so $${b}^{n} = ${b ** n}$ and $n = ${n}$.`,
            `左边等于 $${m} \\cdot ${b}^{n}$，所以 $${b}^{n} = ${b ** n}$，$n = ${n}$。`,
          ],
        );
      },
    ),
  ],
  "applying-the-distributive-law-to-radical-expressions": [
    skill(
      "conjugate-pairs",
      ["Conjugate pairs", "共轭式"],
      [
        "Multiplying a sum by the same difference makes the two middle terms cancel. With a surd, this leaves no surd at all, since the square of a square root is the number inside.",
        "和与差相乘时，中间两项互相抵消。含根式时，结果里就没有根式了，因为平方根的平方就是根号内的数。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const c = rng.int(1, 4);
        const b = rng.pick([2, 3, 5, 6, 7, 10, 11]);
        return integer(
          [
            `Expand and simplify $(${a} + ${c === 1 ? "" : c}\\sqrt{${b}})(${a} - ${c === 1 ? "" : c}\\sqrt{${b}})$.`,
            `展开并化简 $(${a} + ${c === 1 ? "" : c}\\sqrt{${b}})(${a} - ${c === 1 ? "" : c}\\sqrt{${b}})$。`,
          ],
          a * a - c * c * b,
          [a * a + c * c * b, a * a - c * b, a * a - b],
          [
            `The middle terms cancel, leaving $${a}^{2} - ${c * c} \\cdot ${b} = ${a * a - c * c * b}$.`,
            `中间两项抵消，剩下 $${a}^{2} - ${c * c} \\cdot ${b} = ${a * a - c * c * b}$。`,
          ],
        );
      },
    ),
  ],
  "areas-of-inscribed-triangles": [
    skill(
      "the-radius-from-the-legs",
      ["The radius from the legs", "由直角边求半径"],
      [
        "A triangle inscribed with one side on a diameter has a right angle opposite that side. So the Pythagorean theorem gives the diameter from the two other sides, and half of that is the radius.",
        "一边在直径上的内接三角形，这条边的对角是直角。所以由另外两条边用勾股定理求出直径，它的一半就是半径。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const k = 2 * rng.int(1, 8);
        return integer(
          [
            `A triangle is inscribed in a circle with one side a diameter. Its other sides are ${a * k} and ${b * k}. What is the radius?`,
            `圆内接三角形的一边是直径，另外两边是 ${a * k} 和 ${b * k}。半径是多少？`,
          ],
          (c * k) / 2,
          [c * k, ((a + b) * k) / 2, (a * b * k * k) / 2],
          [`The diameter is ${c * k}, and half of it is ${(c * k) / 2}.`, `直径是 ${c * k}，它的一半是 ${(c * k) / 2}。`],
        );
      },
    ),
  ],
  "areas-of-regular-polygons": [
    skill(
      "the-apothem-from-the-area",
      ["The apothem from the area", "由面积求边心距"],
      [
        "The area of a regular polygon is half the apothem times the perimeter. Working backward, double the area and divide by the perimeter to find the apothem.",
        "正多边形的面积是边心距与周长乘积的一半。反过来，把面积加倍再除以周长，就得到边心距。",
      ],
      (rng) => {
        const [n, name, most] = rng.pick<[number, [string, string], number]>([
          [5, ["pentagon", "五边形"], 12],
          [6, ["hexagon", "六边形"], 9],
          [8, ["octagon", "八边形"], 7],
          [10, ["decagon", "十边形"], 5],
        ]);
        const half = rng.int(1, most);
        const s = 2 * half;
        // The true apothem of this polygon, to the tenth, so that the side and the area belong together.
        const tenthsOfApothem = Math.round((s / (2 * Math.tan(Math.PI / n))) * 10);
        const a = Q.of(tenthsOfApothem, 10);
        const area = (n * half * tenthsOfApothem) / 10;
        return decimal(
          [
            `A regular ${name[0]} has side length $${s}$ and area $${area}$. What is its apothem?`,
            `正${name[1]}的边长是 $${s}$，面积是 $${area}$。它的边心距是多少？`,
          ],
          a,
          [a.mul(Q.of(2)), a.mul(Q.of(s)), a.mul(Q.of(n))],
          [
            `The area is half the perimeter times the apothem. The perimeter is $${n * s}$, so the apothem is $2 \\cdot ${area} \\div ${n * s} = ${tenthsOfApothem / 10}$.`,
            `面积等于周长的一半乘边心距。周长是 $${n * s}$，所以边心距是 $2 \\cdot ${area} \\div ${n * s} = ${tenthsOfApothem / 10}$。`,
          ],
        );
      },
    ),
  ],
  "areas-of-rhombuses-and-kites": [
    skill(
      "a-missing-diagonal",
      ["A missing diagonal", "缺失的对角线"],
      [
        "The area of a rhombus or a kite is half the product of its diagonals. So with the area and one diagonal, double the area and divide by that diagonal to find the other.",
        "菱形或筝形的面积是两条对角线乘积的一半。所以已知面积和一条对角线时，把面积加倍再除以这条对角线，就得到另一条。",
      ],
      (rng) => {
        const d = rng.int(2, 30);
        const e = 2 * rng.int(1, 15);
        const name = rng.bool() ? ["kite", "筝形"] : ["rhombus", "菱形"];
        return integer(
          [
            `A ${name[0]} has area ${(d * e) / 2}, and one diagonal has length ${e}. What is the length of the other diagonal?`,
            `${name[1]}的面积是 ${(d * e) / 2}，一条对角线长 ${e}。另一条对角线长多少？`,
          ],
          d,
          [d / 2 === Math.floor(d / 2) ? d / 2 : d + 1, 2 * d, (d * e) / 2 - e],
          [
            `The area is half the product of the diagonals, so $2 \\cdot ${(d * e) / 2} \\div ${e} = ${d}$.`,
            `面积是两条对角线之积的一半，所以 $2 \\cdot ${(d * e) / 2} \\div ${e} = ${d}$。`,
          ],
        );
      },
    ),
  ],
  "border-problems": [
    skill(
      "the-outer-perimeter",
      ["The outer perimeter", "外框的周长"],
      [
        "A border of width $x$ adds $x$ on both sides of each dimension, so length and width each grow by $2x$. The outer perimeter is then found from these larger dimensions.",
        "宽度为 $x$ 的边框使每个方向的两侧各增加 $x$，所以长和宽都增加 $2x$。外框的周长由这些较大的尺寸求出。",
      ],
      (rng) => {
        const l = rng.int(4, 30);
        const w = rng.int(3, 20);
        const x = rng.int(1, 6);
        return integer(
          [
            `A rug measuring ${l} ft by ${w} ft has a border ${x} ft wide all around it. What is the perimeter of the outer edge, in feet?`,
            `长 ${l} 英尺、宽 ${w} 英尺的地毯四周有一圈 ${x} 英尺宽的边框。外缘的周长是多少英尺？`,
          ],
          2 * (l + w + 4 * x),
          [2 * (l + w), 2 * (l + w + 2 * x), 2 * (l + w) + x],
          [
            `The outer rug is ${l + 2 * x} by ${w + 2 * x}, so the perimeter is ${2 * (l + w + 4 * x)}.`,
            `外缘是 ${l + 2 * x} 乘 ${w + 2 * x}，所以周长是 ${2 * (l + w + 4 * x)}。`,
          ],
        );
      },
    ),
  ],
  "bounding-statistics-for-grouped-data": [
    skill(
      "the-greatest-possible-range",
      ["The greatest possible range", "可能的最大极差"],
      [
        "Grouped data hide the exact values, but each must lie inside its group. The range is greatest when the largest value is at the top of the highest group and the smallest is at the bottom of the lowest.",
        "分组数据隐藏了确切的值，但每个值都在所在的组内。当最大值在最高组的上端、最小值在最低组的下端时，极差最大。",
      ],
      (rng) => {
        const low = rng.int(1, 20);
        const width = rng.pick([5, 10]);
        const groups = rng.int(3, 6);
        const counts = Array.from({ length: groups }, () => rng.int(1, 12));
        const text = counts.map((c, i) => `${low + i * width}\\text{–}${low + (i + 1) * width - 1}: ${c}`).join(",\\ ");
        const top = low + groups * width - 1;
        return integer(
          [
            `Whole-number scores are grouped as (score range: number of people) $${text}$. What is the greatest possible range of the scores?`,
            `整数分数分组如下（分数段：人数）$${text}$。分数的极差最大可能是多少？`,
          ],
          top - low,
          [top - low - 2 * (width - 1), top - low - width + 1, groups * width],
          [
            `The largest possible value is ${top}, and the smallest possible value is ${low}.`,
            `最大可能值是 ${top}，最小可能值是 ${low}。`,
          ],
        );
      },
    ),
  ],
  "calculating-trigonometric-ratios-from-descriptions": [
    skill(
      "a-ratio-from-a-stated-proportion",
      ["A ratio from a stated proportion", "由给定比例求三角比"],
      [
        "If the legs are only given as a proportion, call them $ak$ and $bk$. The hypotenuse is then a multiple of $k$ too, so $k$ cancels in any trigonometric ratio.",
        "如果只给出两条直角边的比，就设它们为 $ak$ 和 $bk$。斜边也是 $k$ 的倍数，所以任何三角比中 $k$ 都会约去。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples.filter((t) => t[2] % 5 !== 0 || t[0] < 7));
        const g = a === 6 || a === 9 ? (a === 6 ? 2 : 3) : 1;
        const [p, q, r] = [a / g, b / g, c / g];
        const smaller = rng.bool();
        const top = smaller ? p : q;
        const k = rng.int(2, 9);
        return fraction(
          [
            `The legs of a right triangle are in the ratio ${p * k} to ${q * k}. What is the sine of its ${smaller ? "smallest" : "larger acute"} angle?`,
            `直角三角形两条直角边的比是 ${p * k} 比 ${q * k}。它${smaller ? "最小的角" : "较大的锐角"}的正弦是多少？`,
          ],
          Q.of(top, r),
          [Q.of(smaller ? q : p, r), Q.of(p, q), Q.of(top, r + 1)],
          [
            `With legs ${p} and ${q}, the hypotenuse is ${r}, and the sine is the opposite leg over it.`,
            `直角边为 ${p} 和 ${q} 时，斜边是 ${r}，正弦是对边比斜边。`,
          ],
        );
      },
    ),
  ],
  "circles-inscribed-in-equilateral-triangles": [
    skill(
      "the-side-from-the-inradius",
      ["The side from the inradius", "由内切圆半径求边长"],
      [
        "The inradius of an equilateral triangle is one third of its height, and the height is the side times half of root three. So the side is twice root three times the inradius.",
        "等边三角形的内切圆半径是高的三分之一，高是边长乘二分之根号三。所以边长是内切圆半径的二倍根号三。",
      ],
      (rng) => {
        const k = rng.int(1, 25);
        return integer(
          [
            `A circle of radius $${k === 1 ? "" : k}\\sqrt{3}$ is inscribed in an equilateral triangle. What is the side length of the triangle?`,
            `半径为 $${k === 1 ? "" : k}\\sqrt{3}$ 的圆内切于等边三角形。三角形的边长是多少？`,
          ],
          6 * k,
          [3 * k, 2 * k, 9 * k],
          [
            `The height is $3 \\cdot ${k === 1 ? "" : k}\\sqrt{3}$, and the side is $2\\sqrt{3}$ times the radius, which is ${6 * k}.`,
            `高是 $3 \\cdot ${k === 1 ? "" : k}\\sqrt{3}$，边长是半径的 $2\\sqrt{3}$ 倍，即 ${6 * k}。`,
          ],
        );
      },
    ),
  ],
  "classifying-statistical-studies": [
    skill(
      "spotting-the-unbiased-sample",
      ["Spotting the unbiased sample", "找出无偏的样本"],
      [
        "A sample represents a population only if every member had a fair chance of being chosen. Volunteers, friends and people at one place tend to differ from the rest in ways that matter.",
        "只有总体中每个成员都有公平的机会被选中，样本才有代表性。自愿者、朋友和某一地点的人，往往在重要方面与其他人不同。",
      ],
      (rng) => {
        const [en, zh] = rng.pick<[string, string]>([
          ["students at a school", "全校学生"],
          ["residents of a town", "全镇居民"],
          ["employees of a company", "公司员工"],
          ["members of a library", "图书馆会员"],
          ["customers of a store", "商店顾客"],
          ["players in a league", "联赛球员"],
          ["doctors at a hospital", "医院医生"],
          ["subscribers of a magazine", "杂志订户"],
        ]);
        const n = rng.int(4, 40) * 10;
        return choose(
          rng,
          [
            `A survey wants to learn the views of all ${en}, and ${n} responses are planned. Which method of choosing people is best?`,
            `一项调查想了解${zh}的看法，计划收集 ${n} 份回答。哪种选人方法最好？`,
          ],
          [`Choose ${n} at random from a complete list`, `从完整名单中随机选 ${n} 人`],
          [
            [`Ask the first ${n} to volunteer online`, `请最先在网上自愿报名的 ${n} 人回答`],
            [`Ask ${n} friends of the organizer`, `询问组织者的 ${n} 位朋友`],
            [`Ask ${n} people in one location`, `询问同一地点的 ${n} 人`],
          ],
          [`Only a random choice from the full list gives everyone the same chance.`, `只有从完整名单中随机选择，才能让每个人机会相同。`],
        );
      },
    ),
  ],
  "combining-exponential-expressions": [
    skill(
      "a-quotient-with-a-common-base",
      ["A quotient with a common base", "同底的商"],
      [
        "Rewrite each base as a power of the same prime, multiplying exponents as you do. Then products add the exponents and quotients subtract them, which leaves a single power.",
        "把每个底数都写成同一个质数的幂，同时把指数相乘。这样乘积的指数相加，商的指数相减，最后只剩一个幂。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 12);
        const c = rng.int(1, 6);
        const base = rng.pick<[number, number, number]>([
          [2, 4, 8],
          [3, 9, 27],
        ]);
        return integer(
          [
            `Write $\\frac{${base[1]}^{${a}} \\cdot ${base[0]}^{${b}}}{${base[2]}^{${c}}}$ as $${base[0]}^{E}$. What is $E$?`,
            `把 $\\frac{${base[1]}^{${a}} \\cdot ${base[0]}^{${b}}}{${base[2]}^{${c}}}$ 写成 $${base[0]}^{E}$。$E$ 是多少？`,
          ],
          2 * a + b - 3 * c,
          [a + b - c, 2 * a + b + 3 * c, 2 * a * b - 3 * c],
          [
            `The exponents give $${2 * a} + ${b} - ${3 * c} = ${2 * a + b - 3 * c}$.`,
            `指数为 $${2 * a} + ${b} - ${3 * c} = ${2 * a + b - 3 * c}$。`,
          ],
        );
      },
    ),
  ],
  "combining-means": [
    skill(
      "the-size-of-a-group",
      ["The size of a group", "求一组的人数"],
      [
        "The combined mean lies between the two group means, closer to the larger group. So set up total equals total, using the combined mean, and solve for the unknown size.",
        "合并后的平均数介于两组平均数之间，更靠近人数多的一组。所以列出总和相等的方程，用合并平均数表示，解出未知人数。",
      ],
      (rng) => {
        const d = rng.int(1, 6);
        const e = rng.int(1, 6);
        const k = rng.int(1, 6);
        const c = rng.int(50, 90);
        const n = d * k;
        return integer(
          [
            `A class of ${n} students has a mean score of ${c - e}. A second class has a mean score of ${c + d}. Together their mean is ${c}. How many students are in the second class?`,
            `一个班 ${n} 名学生的平均分是 ${c - e}。第二个班的平均分是 ${c + d}。合起来的平均分是 ${c}。第二个班有多少名学生？`,
          ],
          e * k,
          [n, n + e * k, d * e * k + 1],
          [
            `$${n} \\cdot ${e} = m \\cdot ${d}$ balances the gaps from the mean, so $m = ${e * k}$.`,
            `$${n} \\cdot ${e} = m \\cdot ${d}$ 使离平均数的差平衡，所以 $m = ${e * k}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-data-points-to-lines-of-best-fit": [
    skill(
      "the-point-farthest-from-the-line",
      ["The point farthest from the line", "离直线最远的点"],
      [
        "The size of a residual says how far a point lies from the line, measured vertically. To compare several points, find each predicted value and take the absolute difference from the observed value.",
        "残差的大小表示点到直线的竖直距离。要比较几个点，就求每个预测值，再取它与观测值之差的绝对值。",
      ],
      (rng) => {
        const m = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const b = rng.nonZero(-10, 10);
        const xs = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4);
        const rs = rng.sample([-5, -4, -3, -2, 2, 3, 4, 5, 6, -6], 4);
        const pts = xs.map((x, i) => [x, m * x + b + (rs[i] as number)] as const);
        const sizes = rs.map(Math.abs);
        const big = sizes.indexOf(Math.max(...sizes));
        const small = pts.filter((_, i) => i !== big).map((p) => `(${p[0]}, ${p[1]})`);
        const best = pts[big] as readonly [number, number];
        const tied = sizes.filter((s) => s === Math.max(...sizes)).length > 1;
        const y = tied ? best[1] + (rs[big] as number) : best[1];
        const listed = pts
          .map((p, i) => (i === big ? ([p[0], y] as const) : p))
          .sort((p, q) => p[0] - q[0])
          .map((p) => `$(${p[0]}, ${p[1]})$`);
        return chooseFilled(
          rng,
          [
            `The line of best fit is $\\hat{y} = ${m}x${signed(b)}$. Which of these data points is farthest from the line, measured vertically: ${listed.join(", ")}?`,
            `最佳拟合线是 $\\hat{y} = ${m}x${signed(b)}$。这些数据点中哪个离直线的竖直距离最远：${listed.join("，")}？`,
          ],
          `(${best[0]}, ${y})`,
          small,
          [
            `The residual at $x = ${best[0]}$ has the largest size, ${Math.abs(y - m * best[0] - b)}.`,
            `$x = ${best[0]}$ 处残差的绝对值最大，是 ${Math.abs(y - m * best[0] - b)}。`,
          ],
        );
      },
    ),
  ],
  "comparing-effects-of-data-change-on-measures-of-centrality": [
    skill(
      "the-median-after-an-added-value",
      ["The median after an added value", "增加一个值后的中位数"],
      [
        "Adding a value to a list of odd length makes its length even, so the median becomes the average of the two middle values. Which two those are depends on where the new value falls.",
        "奇数个数据增加一个值后个数变成偶数，所以中位数变成中间两个值的平均数。是哪两个，取决于新值落在哪里。",
      ],
      (rng) => {
        const a = rng.int(1, 10);
        const b = a + rng.int(1, 8);
        const c = b + 2 * rng.int(1, 8);
        const d = c + 2 * rng.int(1, 8);
        const e = d + rng.int(1, 9);
        const v = e + rng.int(1, 30);
        return integer(
          [
            `The value ${v} is added to the data set $${a}, ${b}, ${c}, ${d}, ${e}$. What is the new median?`,
            `在数据组 $${a}, ${b}, ${c}, ${d}, ${e}$ 中增加值 ${v}。新的中位数是多少？`,
          ],
          (c + d) / 2,
          [c, d, (b + c) % 2 === 0 ? (b + c) / 2 : b],
          [`The middle two of the six values are ${c} and ${d}.`, `六个值中间的两个是 ${c} 和 ${d}。`],
        );
      },
    ),
  ],
  "comparing-quantities-under-constraints": [
    skill(
      "a-negative-number-of-small-size",
      ["A negative number of small size", "绝对值很小的负数"],
      [
        "For $x$ between $-1$ and 0, even powers are positive and odd powers are negative, while the reciprocal is negative too. So the only positive expression must be the greatest, whatever its coefficient.",
        "当 $x$ 在 $-1$ 和 0 之间时，偶次幂是正的，奇次幂是负的，倒数也是负的。所以唯一为正的式子一定最大，与系数无关。",
      ],
      (rng) => {
        const [a, b, c, d] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 4) as [number, number, number, number];
        return chooseFilled(
          rng,
          [
            `If $-1 < x < 0$, which of these has the greatest value: $${a}x$, $${b}x^{3}$, $\\frac{${c}}{x}$, $${d}x^{2}$?`,
            `若 $-1 < x < 0$，下面哪个的值最大：$${a}x$，$${b}x^{3}$，$\\frac{${c}}{x}$，$${d}x^{2}$？`,
          ],
          `${d}x^{2}`,
          [`${a}x`, `${b}x^{3}`, `\\frac{${c}}{x}`],
          [`Only $${d}x^{2}$ is positive, and the other three are negative.`, `只有 $${d}x^{2}$ 是正的，其他三个都是负的。`],
        );
      },
    ),
  ],
  "comparing-radicals": [
    skill(
      "the-integer-just-below-a-radical",
      ["The integer just below a radical", "根式下方最近的整数"],
      [
        "To compare $a\\sqrt{b}$ with whole numbers, move $a$ under the root by squaring it. Then the greatest integer below is the largest whole number whose square does not go past that value.",
        "要把 $a\\sqrt{b}$ 与整数比较，把 $a$ 平方后移到根号内。这样，下方最大的整数就是平方不超过这个值的最大整数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
        const answer = Math.floor(Math.sqrt(a * a * b));
        return integer(
          [`What is the greatest integer less than $${a}\\sqrt{${b}}$?`, `小于 $${a}\\sqrt{${b}}$ 的最大整数是多少？`],
          answer,
          [answer + 1, a * b, a + b],
          [
            `$${a}\\sqrt{${b}} = \\sqrt{${a * a * b}}$, and $${answer}^{2} = ${answer * answer}$ while $${answer + 1}^{2} = ${(answer + 1) ** 2}$.`,
            `$${a}\\sqrt{${b}} = \\sqrt{${a * a * b}}$，而 $${answer}^{2} = ${answer * answer}$，$${answer + 1}^{2} = ${(answer + 1) ** 2}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-statistics-a-constraint-forces": [
    skill(
      "the-greatest-possible-smallest-value",
      ["The greatest possible smallest value", "最小值的最大可能"],
      [
        "To make the smallest value as large as possible, pack the values as tightly as the rules allow. With different integers and a fixed mean, that means consecutive integers centered on the mean.",
        "要让最小值尽可能大，就让这些值尽量靠拢。整数互不相同且平均数固定时，就是以平均数为中心的连续整数。",
      ],
      (rng) => {
        const n = rng.pick([3, 5, 7, 9]);
        const m = rng.int(n + 1, 50);
        return integer(
          [
            `${n} different integers have a mean of ${m}. What is the greatest possible value of the smallest of them?`,
            `${n} 个互不相同的整数的平均数是 ${m}。其中最小的数最大可能是多少？`,
          ],
          m - (n - 1) / 2,
          [m, m - n, m - (n + 1) / 2],
          [`Consecutive integers centered on ${m} go down to ${m - (n - 1) / 2}.`, `以 ${m} 为中心的连续整数最小到 ${m - (n - 1) / 2}。`],
        );
      },
    ),
  ],
  "composite-solids": [
    skill(
      "a-hemisphere-on-a-cylinder",
      ["A hemisphere on a cylinder", "圆柱上的半球"],
      [
        "A solid made of joined pieces has the sum of their volumes. A hemisphere is half a sphere, so it contributes $\\frac{2}{3}\\pi$ times the cube of the radius, and the cylinder adds its base times its height.",
        "由几部分拼成的立体，体积是各部分之和。半球是半个球，贡献 $\\frac{2}{3}\\pi$ 乘半径的立方；圆柱再加上底面积乘高。",
      ],
      (rng) => {
        const u = rng.int(1, 4);
        const r = 3 * u;
        const h = rng.int(1, 15);
        return integer(
          [
            `A solid is a cylinder of radius ${r} and height ${h} with a hemisphere of the same radius on top. Its volume is $k\\pi$. What is $k$?`,
            `一个立体由半径 ${r}、高 ${h} 的圆柱和其上半径相同的半球组成。体积是 $k\\pi$。$k$ 是多少？`,
          ],
          (2 * r * r * r) / 3 + r * r * h,
          [(4 * r * r * r) / 3 + r * r * h, r * r * h, r * r * h + r * r * r],
          [
            `$\\frac{2}{3} \\cdot ${r * r * r} + ${r * r} \\cdot ${h} = ${(2 * r * r * r) / 3 + r * r * h}$.`,
            `$\\frac{2}{3} \\cdot ${r * r * r} + ${r * r} \\cdot ${h} = ${(2 * r * r * r) / 3 + r * r * h}$。`,
          ],
        );
      },
    ),
  ],
  "computing-terms-from-nonstandard-recurrences": [
    skill(
      "a-far-term-from-a-repeating-pattern",
      ["A far term from a repeating pattern", "由循环求很远的项"],
      [
        "Some recurrences repeat after a while, and the rule $a_n = a_{n-1} - a_{n-2}$ repeats every six terms. So divide the position by the length of the cycle and use the remainder to find the term.",
        "有些递推会循环，规则 $a_n = a_{n-1} - a_{n-2}$ 每六项循环一次。所以用位置除以周期长度，由余数找到这一项。",
      ],
      (rng) => {
        const a = nz(rng, 9);
        const b = nz(rng, 9);
        const n = rng.int(20, 400);
        const cycle = [a, b, b - a, -a, -b, a - b];
        const answer = cycle[(n - 1) % 6] as number;
        return integer(
          [
            `A sequence has $a_{1} = ${a}$, $a_{2} = ${b}$ and $a_{n} = a_{n-1} - a_{n-2}$ for $n \\ge 3$. What is $a_{${n}}$?`,
            `数列满足 $a_{1} = ${a}$，$a_{2} = ${b}$，当 $n \\ge 3$ 时 $a_{n} = a_{n-1} - a_{n-2}$。求 $a_{${n}}$。`,
          ],
          answer,
          [-answer, cycle[n % 6] as number, cycle[(n + 1) % 6] as number],
          [
            `The terms repeat as $${cycle.join(", ")}$, and ${n} leaves remainder ${n % 6} on division by 6.`,
            `各项按 $${cycle.join(", ")}$ 循环，${n} 除以 6 余 ${n % 6}。`,
          ],
        );
      },
    ),
  ],
  "computing-totals-from-stated-rates": [
    skill(
      "a-time-from-two-rates",
      ["A time from two rates", "由两个速率求时间"],
      [
        "Rates working at the same time add together. So divide the total amount by the combined rate to find how long the job takes, as long as the units of time agree.",
        "同时工作的速率可以相加。所以用总量除以合速率，就得到所需时间，前提是时间单位一致。",
      ],
      (rng) => {
        const p = rng.int(2, 30);
        const q = rng.int(2, 30);
        const t = rng.int(3, 40);
        return integer(
          [
            `One pipe adds ${p} liters per minute and another adds ${q} liters per minute. How many minutes do they take together to fill a ${(p + q) * t}-liter tank?`,
            `一根水管每分钟注水 ${p} 升，另一根每分钟注水 ${q} 升。两根一起注满 ${(p + q) * t} 升的水箱要多少分钟？`,
          ],
          t,
          [2 * t, t + p, (p + q) * t - p - q],
          [
            `Together they add ${p + q} liters per minute, and $${(p + q) * t} \\div ${p + q} = ${t}$.`,
            `合起来每分钟注水 ${p + q} 升，$${(p + q) * t} \\div ${p + q} = ${t}$。`,
          ],
        );
      },
    ),
  ],
  "conic-sections-as-slices-of-a-cone": [
    skill(
      "the-angle-that-gives-a-parabola",
      ["The angle that gives a parabola", "得到抛物线的角度"],
      [
        "A plane missing the vertex makes a parabola exactly when it is parallel to a side of the cone. So its angle with the axis must equal the angle between a side and the axis.",
        "不过顶点的平面恰好在与圆锥的一条母线平行时截出抛物线。所以它与轴的夹角必须等于母线与轴的夹角。",
      ],
      (rng) => {
        const a = rng.int(10, 70);
        return integer(
          [
            `In a double cone, two opposite sides meet at the vertex at a $${2 * a}^{\\circ}$ angle, and the axis bisects that angle. What angle with the axis, in degrees, must a plane missing the vertex make to cut a parabola?`,
            `双圆锥中，两条相对的母线在顶点处成 $${2 * a}^{\\circ}$ 角，轴平分这个角。不过顶点的平面与轴成多少度角时，截出的是抛物线？`,
          ],
          a,
          [90 - a, 90, 2 * a],
          [
            `The axis bisects the $${2 * a}^{\\circ}$ angle, so each side makes a $${a}^{\\circ}$ angle with the axis. The plane must be parallel to a side, so its angle with the axis is also $${a}^{\\circ}$.`,
            `轴平分 $${2 * a}^{\\circ}$ 角，所以每条母线与轴成 $${a}^{\\circ}$ 角。平面必须平行于母线，所以它与轴的夹角也是 $${a}^{\\circ}$。`,
          ],
        );
      },
    ),
  ],
  "constructing-functions-representing-properties-of-2d-shapes": [
    skill(
      "area-as-a-function-of-the-perimeter",
      ["Area as a function of the perimeter", "面积作为周长的函数"],
      [
        "If the shape of a rectangle is fixed by a ratio, its perimeter determines everything. Write the width in terms of the perimeter, and then the area is a constant times the square of the perimeter.",
        "如果长方形的形状由比例确定，周长就决定了一切。把宽用周长表示，面积就是一个常数乘周长的平方。",
      ],
      (rng) => {
        const r = rng.int(1, 5);
        const w = rng.int(2, 15);
        const p = 2 * (r + 1) * w;
        return integer(
          [
            `The length of a rectangle is ${r === 1 ? "equal to" : `${r} times`} its width. Its area is a function $A(P)$ of its perimeter $P$. What is $A(${p})$?`,
            `长方形的长${r === 1 ? "等于" : `是宽的 ${r} 倍`}${r === 1 ? "宽" : ""}。面积是周长 $P$ 的函数 $A(P)$。求 $A(${p})$。`,
          ],
          r * w * w,
          [p * p, p, w * w],
          [`The perimeter ${p} gives a width of ${w} and a length of ${r * w}.`, `周长 ${p} 对应宽 ${w}，长 ${r * w}。`],
        );
      },
    ),
  ],
  "constructing-functions-representing-properties-of-rectangular-solids": [
    skill(
      "surface-area-with-a-fixed-volume",
      ["Surface area with a fixed volume", "体积固定时的表面积"],
      [
        "A fixed volume ties the height to the base, since the height is the volume divided by the base area. Substituting this into the surface area leaves a function of one variable.",
        "固定的体积把高与底面联系起来，因为高等于体积除以底面积。把它代入表面积，就得到一元函数。",
      ],
      (rng) => {
        const x = rng.int(2, 10);
        const h = rng.int(1, 12);
        const v = x * x * h;
        return integer(
          [
            `A closed box has a square base of side $x$ and a volume of ${v}. Its surface area is a function $S(x)$. What is $S(${x})$?`,
            `有盖的盒子底面是边长为 $x$ 的正方形，体积是 ${v}。表面积是函数 $S(x)$。求 $S(${x})$。`,
          ],
          2 * x * x + 4 * x * h,
          [x * x + 4 * x * h, 4 * x * h, 2 * x * x + x * h],
          [
            `The height is ${h}, so two bases and four sides give ${2 * x * x} and ${4 * x * h}.`,
            `高是 ${h}，所以两个底面和四个侧面分别是 ${2 * x * x} 和 ${4 * x * h}。`,
          ],
        );
      },
    ),
  ],
  "constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids": [
    skill(
      "height-as-a-function-of-the-radius",
      ["Height as a function of the radius", "高作为半径的函数"],
      [
        "With a fixed volume, a wider cylinder must be shorter. Solving the volume formula for the height gives a function with the square of the radius in its denominator.",
        "体积固定时，圆柱越宽就越矮。从体积公式解出高，得到的函数分母中有半径的平方。",
      ],
      (rng) => {
        const r = rng.int(2, 9);
        const h = rng.int(2, 15);
        return integer(
          [
            `A cylinder has volume $${r * r * h}\\pi$, so its height is a function $h(r)$ of its radius. What is $h(${r})$?`,
            `圆柱的体积是 $${r * r * h}\\pi$，所以高是半径的函数 $h(r)$。求 $h(${r})$。`,
          ],
          h,
          [r * h, r * r * h, h + r],
          [
            `$h(r) = \\frac{${r * r * h}}{r^{2}}$, and dividing by ${r * r} gives ${h}.`,
            `$h(r) = \\frac{${r * r * h}}{r^{2}}$，除以 ${r * r} 得 ${h}。`,
          ],
        );
      },
    ),
  ],
  "constructing-probability-models-from-context": [
    skill(
      "an-expected-count-from-a-model",
      ["An expected count from a model", "由模型求期望次数"],
      [
        "Outcomes in a stated proportion have probabilities equal to their shares of the total. So multiply the probability of an outcome by the number of trials to find how often to expect it.",
        "按给定比例发生的结果，概率等于它们在总量中所占的份额。所以用某个结果的概率乘试验次数，就得到预期发生的次数。",
      ],
      (rng) => {
        const [a, b, c] = rng.sample([1, 2, 3, 4, 5, 6, 7], 3) as [number, number, number];
        const n = (a + b + c) * rng.int(2, 30);
        return integer(
          [
            `A spinner lands on red, blue and green in the ratio $${a} : ${b} : ${c}$. In ${n} spins, how many times would you expect it to land on blue?`,
            `转盘落在红、蓝、绿的比例是 $${a} : ${b} : ${c}$。转 ${n} 次，预计落在蓝色多少次？`,
          ],
          (n * b) / (a + b + c),
          [(n * a) / (a + b + c), (n * c) / (a + b + c), Math.floor(n / 3)],
          [
            `Blue has probability $\\frac{${b}}{${a + b + c}}$, and multiplying by ${n} gives the count.`,
            `蓝色的概率是 $\\frac{${b}}{${a + b + c}}$，乘 ${n} 得到次数。`,
          ],
        );
      },
    ),
  ],
  "converting-between-mixed-units-containing-squares": [
    skill(
      "a-room-priced-by-the-square-yard",
      ["A room priced by the square yard", "按平方码计价的房间"],
      [
        "Since a yard is 3 feet, a square yard is 9 square feet. So divide an area in square feet by 9, not 3, before multiplying by a price per square yard.",
        "因为 1 码等于 3 英尺，所以 1 平方码等于 9 平方英尺。所以要把平方英尺数除以 9，而不是 3，再乘每平方码的价格。",
      ],
      (rng) => {
        const l = 3 * rng.int(2, 10);
        const w = 3 * rng.int(2, 8);
        const p = rng.int(2, 30);
        return integer(
          [
            `Carpet costs ${p} dollars per square yard. How many dollars does it cost to cover a floor ${l} feet by ${w} feet?`,
            `地毯每平方码 ${p} 美元。铺满长 ${l} 英尺、宽 ${w} 英尺的地板要多少美元？`,
          ],
          (p * l * w) / 9,
          [(p * l * w) / 3, p * l * w, p * (l + w)],
          [`The floor is ${(l * w) / 9} square yards, and each costs ${p} dollars.`, `地板是 ${(l * w) / 9} 平方码，每平方码 ${p} 美元。`],
        );
      },
    ),
  ],
  "counting-favorable-outcomes-in-a-constructed-sample-space": [
    skill(
      "pairs-drawn-without-replacement",
      ["Pairs drawn without replacement", "不放回地抽两张"],
      [
        "Drawing two different cards at once gives unordered pairs, so no card pairs with itself and each pair counts once. List the pairs that meet the condition by the smaller card, or use a grid.",
        "同时抽两张不同的牌得到无序对，所以牌不与自身配对，每对只算一次。可以按较小的牌列出满足条件的对，或者用表格。",
      ],
      (rng) => {
        const n = rng.int(6, 12);
        const k = rng.int(5, n + 4);
        let count = 0;
        for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) if (i + j === k) count++;
        const total = (n * (n - 1)) / 2;
        return integer(
          [
            `Two different cards are drawn together from cards numbered 1 to ${n}. How many of the possible pairs have a sum of ${k}?`,
            `从编号 1 到 ${n} 的牌中同时抽两张。可能的牌对中有多少对的和是 ${k}？`,
          ],
          count,
          [k - 1, total, count + 1],
          [
            `Listing by the smaller card gives ${count} ${count === 1 ? "pair" : "pairs"} out of ${total}.`,
            `按较小的牌列举，${total} 对中有 ${count} 对。`,
          ],
        );
      },
    ),
  ],
  "counting-integers-within-bounds": [
    skill(
      "multiples-in-a-range",
      ["Multiples in a range", "范围内的倍数"],
      [
        "The multiples of $k$ up to $b$ number the whole part of $b$ divided by $k$. To count those in a range, subtract the count below the lower bound from the count up to the upper bound.",
        "不超过 $b$ 的 $k$ 的倍数，个数是 $b$ 除以 $k$ 的整数部分。要数某范围内的倍数，就用到上界的个数减去下界以下的个数。",
      ],
      (rng) => {
        const k = rng.int(3, 13);
        const a = rng.int(10, 90);
        const b = a + rng.int(30, 200);
        const count = Math.floor(b / k) - Math.floor((a - 1) / k);
        return integer(
          [
            `How many multiples of ${k} are there from ${a} to ${b}, including those numbers?`,
            `从 ${a} 到 ${b}（含这两个数），${k} 的倍数有多少个？`,
          ],
          count,
          [Math.floor(b / k), Math.floor((b - a) / k) === count ? count + 1 : Math.floor((b - a) / k), count + 2],
          [
            `There are ${Math.floor(b / k)} up to ${b} and ${Math.floor((a - 1) / k)} below ${a}.`,
            `不超过 ${b} 的有 ${Math.floor(b / k)} 个，小于 ${a} 的有 ${Math.floor((a - 1) / k)} 个。`,
          ],
        );
      },
    ),
  ],
  "counting-members-from-venn-data": [
    skill(
      "three-overlapping-groups",
      ["Three overlapping groups", "三个重叠的组"],
      [
        "Adding three groups counts each pairwise overlap twice and the triple overlap three times. So subtract the pairwise overlaps and add back the triple overlap to count each member once.",
        "把三个组相加时，两两的重叠算了两次，三者的重叠算了三次。所以减去两两的重叠，再加回三者的重叠，每个成员就只算一次。",
      ],
      (rng) => {
        const all = rng.int(1, 6);
        const ab = all + rng.int(1, 6);
        const bc = all + rng.int(1, 6);
        const ac = all + rng.int(1, 6);
        const a = ab + ac - all + rng.int(1, 15);
        const b = ab + bc - all + rng.int(1, 15);
        const c = ac + bc - all + rng.int(1, 15);
        const total = a + b + c - ab - bc - ac + all;
        return integer(
          [
            `Among some students, ${a} play soccer, ${b} play tennis and ${c} swim. ${ab} do soccer and tennis, ${bc} do tennis and swimming, ${ac} do soccer and swimming, and ${all} do all three. How many do at least one?`,
            `一些学生中，${a} 人踢足球，${b} 人打网球，${c} 人游泳。足球和网球都做的有 ${ab} 人，网球和游泳都做的有 ${bc} 人，足球和游泳都做的有 ${ac} 人，三项都做的有 ${all} 人。至少做一项的有多少人？`,
          ],
          total,
          [a + b + c, a + b + c - ab - bc - ac, total + all],
          [
            `Add the groups, subtract the pairs and add back the triple: $${a + b + c} - ${ab + bc + ac} + ${all} = ${total}$.`,
            `把各组相加，减去两两重叠，再加回三者重叠：$${a + b + c} - ${ab + bc + ac} + ${all} = ${total}$。`,
          ],
        );
      },
    ),
  ],
  "deciding-which-function-eventually-exceeds-the-others": [
    skill(
      "where-a-steeper-line-overtakes",
      ["Where a steeper line overtakes", "较陡的直线何时超过"],
      [
        "A line with the greater slope eventually passes any other line, however far behind it starts. The first whole input where it leads comes from dividing the head start by the difference in slopes.",
        "斜率较大的直线最终会超过另一条直线，不管起初落后多少。把领先量除以斜率之差，就能找到它开始领先的第一个整数输入。",
      ],
      (rng) => {
        const c = rng.int(1, 9);
        const a = c + rng.int(1, 9);
        const b = rng.int(0, 20);
        const d = b + rng.int(10, 200);
        const answer = Math.floor((d - b) / (a - c)) + 1;
        return integer(
          [
            `Let $f(x) = ${a}x${signed(b)}$ and $g(x) = ${c}x${signed(d)}$. What is the smallest whole number $x$ with $f(x) > g(x)$?`,
            `设 $f(x) = ${a}x${signed(b)}$，$g(x) = ${c}x${signed(d)}$。使 $f(x) > g(x)$ 的最小整数 $x$ 是多少？`,
          ],
          answer,
          [answer + 1, answer - 1, d - b],
          [`The gap is ${d - b}, and it closes by ${a - c} for each unit of $x$.`, `差距是 ${d - b}，$x$ 每增加 1 就缩小 ${a - c}。`],
        );
      },
    ),
  ],
  "deducing-parity-from-an-integer-valued-expression": [
    skill(
      "an-odd-product-forces-both-odd",
      ["An odd product forces both odd", "积为奇数时两数都是奇数"],
      [
        "A product of integers is odd only when every factor is odd. So if $mn$ is odd, both are odd, and then an odd multiple of $m$ plus an odd multiple of $n$ must be even.",
        "整数的积只有在每个因数都是奇数时才是奇数。所以 $mn$ 为奇数时两数都是奇数，这时 $m$ 的奇数倍加 $n$ 的奇数倍一定是偶数。",
      ],
      (rng) => {
        const [a, b] = rng.sample([1, 3, 5, 7, 9, 11, 13, 15], 2) as [number, number];
        const [e, f] = rng.sample([2, 4, 6, 8, 10, 12], 2) as [number, number];
        const co = (n: number) => (n === 1 ? "" : `${n}`);
        return chooseFilled(
          rng,
          [
            `$m$ and $n$ are integers, and $mn$ is odd. Which of the following must be even?`,
            `$m$ 和 $n$ 是整数，$mn$ 是奇数。下面哪个一定是偶数？`,
          ],
          `${co(a)}m + ${co(b)}n`,
          [`${co(a)}m + ${e}n`, `${co(b)}mn`, `mn + ${f}`],
          [
            `Both $m$ and $n$ are odd, so the two terms are odd and their sum is even.`,
            `$m$ 和 $n$ 都是奇数，所以两项都是奇数，和是偶数。`,
          ],
        );
      },
    ),
  ],
  density: [
    skill(
      "the-mass-of-a-block-in-kilograms",
      ["The mass of a block in kilograms", "以千克表示木块质量"],
      [
        "Find the volume in cubic centimeters first, and multiply by the density to get grams. Then divide by 1000, because the question asks for kilograms rather than grams.",
        "先求以立方厘米计的体积，再乘密度得到克数。然后除以 1000，因为题目问的是千克而不是克。",
      ],
      (rng) => {
        const [l, w, h] = [rng.int(2, 20), rng.int(2, 15), rng.int(2, 10)];
        const d = rng.int(2, 11);
        const g = l * w * h * d;
        return decimal(
          [
            `A block measures ${l} cm by ${w} cm by ${h} cm and has a density of ${d} grams per cubic centimeter. What is its mass in kilograms?`,
            `木块长 ${l} 厘米、宽 ${w} 厘米、高 ${h} 厘米，密度是每立方厘米 ${d} 克。它的质量是多少千克？`,
          ],
          Q.of(g, 1000),
          [Q.of(g, 100), Q.of(l * w * h, 1000), Q.of(g, 10000)],
          [
            `$${l * w * h} \\times ${d} = ${g}$ grams, and dividing by 1000 gives kilograms.`,
            `$${l * w * h} \\times ${d} = ${g}$ 克，除以 1000 得千克数。`,
          ],
        );
      },
    ),
  ],
  "determining-unknown-observations-given-statistical-metrics": [
    skill(
      "a-missing-value-from-the-median",
      ["A missing value from the median", "由中位数求缺失值"],
      [
        "With an even number of values, the median is the average of the two middle ones. So twice the median minus the known middle value gives the unknown one, as long as the order is kept.",
        "数据个数为偶数时，中位数是中间两个值的平均数。所以中位数的两倍减去已知的中间值，就得到未知值，前提是次序保持不变。",
      ],
      (rng) => {
        const a = rng.int(1, 15);
        const b = a + rng.int(1, 8);
        const x = b + 2 * rng.int(1, 8);
        const c = x + rng.int(1, 10);
        const m = (b + x) / 2;
        return integer(
          [
            `The values $${a}, ${b}, x, ${c}$ are in increasing order, and their median is ${m}. What is $x$?`,
            `$${a}, ${b}, x, ${c}$ 按从小到大排列，中位数是 ${m}。$x$ 是多少？`,
          ],
          x,
          [m, 2 * m, 4 * m - a - b - c],
          [`$\\frac{${b} + x}{2} = ${m}$ gives $x = ${x}$.`, `$\\frac{${b} + x}{2} = ${m}$，得 $x = ${x}$。`],
        );
      },
    ),
  ],
  "determining-unknown-parameters-in-exponential-functions": [
    skill(
      "the-initial-value-from-two-points",
      ["The initial value from two points", "由两点求初值"],
      [
        "Dividing the two outputs cancels $a$ and leaves a power of $b$. Once $b$ is known, substitute either point back in to find $a$, which is the value of the function at 0.",
        "两个输出相除消去 $a$，剩下 $b$ 的幂。求出 $b$ 后，把任一点代回去求 $a$，它就是函数在 0 处的值。",
      ],
      (rng) => {
        const b = rng.int(2, 5);
        const a = rng.int(2, 15);
        const gap = rng.pick([2, 2, 3]);
        const s = rng.int(1, 2);
        return integer(
          [
            `The graph of $f(x) = a \\cdot b^x$, with $b > 0$, passes through $(${s}, ${a * b ** s})$ and $(${s + gap}, ${a * b ** (s + gap)})$. What is $a$?`,
            `$f(x) = a \\cdot b^x$（$b > 0$）的图象经过 $(${s}, ${a * b ** s})$ 和 $(${s + gap}, ${a * b ** (s + gap)})$。$a$ 是多少？`,
          ],
          a,
          [b, a * b, a + b],
          [
            `The quotient is $${b ** gap} = b^{${gap}}$, so $b = ${b}$ and $a = ${a * b ** s} \\div ${b ** s} = ${a}$.`,
            `商是 $${b ** gap} = b^{${gap}}$，所以 $b = ${b}$，$a = ${a * b ** s} \\div ${b ** s} = ${a}$。`,
          ],
        );
      },
    ),
  ],
  "determining-unknown-parameters-in-quadratic-systems-with-one-intersection-point": [
    skill(
      "a-line-with-an-unknown-slope",
      ["A line with an unknown slope", "斜率未知的直线"],
      [
        "A line through the origin meets $y = x^{2} + c$ where $x^{2} - mx + c = 0$. One intersection means the discriminant is zero, so $m^{2} = 4c$, which has a positive and a negative answer.",
        "过原点的直线与 $y = x^{2} + c$ 相交于 $x^{2} - mx + c = 0$ 的解。只有一个交点意味着判别式为零，所以 $m^{2} = 4c$，有一个正解和一个负解。",
      ],
      (rng) => {
        const s = rng.int(1, 40);
        return integer(
          [
            `The line $y = mx$, with $m > 0$, intersects the parabola $y = x^2 + ${s * s}$ at exactly one point. What is $m$?`,
            `直线 $y = mx$（$m > 0$）与抛物线 $y = x^2 + ${s * s}$ 恰有一个交点。$m$ 是多少？`,
          ],
          2 * s,
          [s, 4 * s * s, s * s],
          [
            `$m^{2} = 4 \\cdot ${s * s} = ${4 * s * s}$, so $m = ${2 * s}$.`,
            `$m^{2} = 4 \\cdot ${s * s} = ${4 * s * s}$，所以 $m = ${2 * s}$。`,
          ],
        );
      },
    ),
  ],
  "determining-unknown-parameters-in-quadratic-systems-with-zero-or-two-intersection-points": [
    skill(
      "the-least-integer-for-two-intersections",
      ["The least integer for two intersections", "有两个交点的最小整数"],
      [
        "Two intersections need a positive discriminant, which gives a strict inequality for the parameter. The boundary value itself gives only one intersection, so the least integer is one step beyond it.",
        "有两个交点要求判别式为正，这给出参数的严格不等式。边界值本身只有一个交点，所以最小整数还要再往外一步。",
      ],
      (rng) => {
        const a = nz(rng, 15);
        return integer(
          [
            `What is the least integer $k$ for which the graphs of $y = x^2$ and $y = ${2 * a}x + k$ have two points of intersection?`,
            `使 $y = x^2$ 和 $y = ${2 * a}x + k$ 的图象有两个交点的最小整数 $k$ 是多少？`,
          ],
          -a * a + 1,
          [-a * a, a * a + 1, -a * a - 1],
          [
            `The discriminant of $x^{2} ${a < 0 ? "+" : "-"} ${2 * Math.abs(a)}x - k = 0$ is positive when $k > ${-a * a}$.`,
            `$x^{2} ${a < 0 ? "+" : "-"} ${2 * Math.abs(a)}x - k = 0$ 的判别式在 $k > ${-a * a}$ 时为正。`,
          ],
        );
      },
    ),
  ],
  "effects-of-data-change-on-the-mean": [
    skill(
      "the-mean-after-adding-a-value",
      ["The mean after adding a value", "增加一个值后的平均数"],
      [
        "Adding a value changes both the total and the count. So find the old total from the mean, add the new value, and divide by the new count rather than the old one.",
        "增加一个值同时改变总和与个数。所以由平均数求出原来的总和，加上新值，再除以新的个数而不是原来的个数。",
      ],
      (rng) => {
        const n = rng.int(3, 12);
        const m = rng.int(20, 90);
        const d = nz(rng, 6);
        const v = m + (n + 1) * d;
        return integer(
          [
            `The mean of ${n} numbers is ${m}. When the number ${v} is added, what is the new mean?`,
            `${n} 个数的平均数是 ${m}。增加数 ${v} 后，新的平均数是多少？`,
          ],
          m + d,
          [Math.round((m + v) / 2), m, m + (n + 1) * d - n],
          [
            `The new total is $${n * m} + ${paren(v)} = ${n * m + v}$, and dividing by ${n + 1} gives ${m + d}.`,
            `新的总和是 $${n * m} + ${paren(v)} = ${n * m + v}$，除以 ${n + 1} 得 ${m + d}。`,
          ],
        );
      },
    ),
  ],
  "equilateral-triangles-inscribed-in-circles": [
    skill(
      "the-perimeter-from-the-radius",
      ["The perimeter from the radius", "由半径求周长"],
      [
        "The side of an inscribed equilateral triangle is the radius times root three. So a radius that already contains root three gives a whole side, and the perimeter is three of those.",
        "内接等边三角形的边长是半径乘根号三。所以半径已含根号三时，边长是整数，周长是它的三倍。",
      ],
      (rng) => {
        const k = rng.int(1, 30);
        return integer(
          [
            `An equilateral triangle is inscribed in a circle of radius $${k === 1 ? "" : k}\\sqrt{3}$. What is the perimeter of the triangle?`,
            `等边三角形内接于半径为 $${k === 1 ? "" : k}\\sqrt{3}$ 的圆。三角形的周长是多少？`,
          ],
          9 * k,
          [3 * k, 6 * k, 18 * k],
          [
            `The side is $${k === 1 ? "" : k}\\sqrt{3} \\cdot \\sqrt{3} = ${3 * k}$, and three sides make ${9 * k}.`,
            `边长是 $${k === 1 ? "" : k}\\sqrt{3} \\cdot \\sqrt{3} = ${3 * k}$，三条边共 ${9 * k}。`,
          ],
        );
      },
    ),
  ],
  "estimating-segment-lengths-from-other-lengths-in-a-figure": [
    skill(
      "scaling-a-measured-segment",
      ["Scaling a measured segment", "按比例换算量出的线段"],
      [
        "In a figure drawn to scale, lengths are in the same ratio as their drawn sizes. So measure both segments with the same ruler, and scale the labeled length by the ratio of the measurements.",
        "按比例绘制的图形中，长度之比等于绘出尺寸之比。所以用同一把尺子量两条线段，再把标注的长度按量出的比例缩放。",
      ],
      (rng) => {
        const p = rng.int(2, 9);
        const u = rng.int(2, 12);
        const q = rng.int(2, 15);
        return integer(
          [
            `In a figure drawn to scale, segment $AB$ is labeled ${p * u} and measures ${p} cm on the page. Segment $CD$ measures ${q} cm on the page. About how long is $CD$?`,
            `按比例绘制的图中，线段 $AB$ 标注为 ${p * u}，在纸上量得 ${p} 厘米。线段 $CD$ 在纸上量得 ${q} 厘米。$CD$ 大约多长？`,
          ],
          q * u,
          [q, p * u + q, q * p],
          [`Each centimeter stands for ${u}, so ${q} cm stands for ${q * u}.`, `每厘米代表 ${u}，所以 ${q} 厘米代表 ${q * u}。`],
        );
      },
    ),
  ],
  "evaluating-mixed-complex-expressions": [
    skill(
      "the-modulus-of-a-product",
      ["The modulus of a product", "积的模"],
      [
        "The modulus of a product is the product of the moduli, so there is no need to multiply the complex numbers first. Each modulus comes from the Pythagorean theorem on its real and imaginary parts.",
        "积的模等于模的积，所以不需要先把复数相乘。每个模都由实部和虚部用勾股定理求出。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const [d, e, f] = rng.pick(triples);
        const s = rng.bool() ? "+" : "-";
        const t = rng.bool() ? "+" : "-";
        return integer(
          [`Find $|(${a} ${s} ${b}i)(${d} ${t} ${e}i)|$.`, `求 $|(${a} ${s} ${b}i)(${d} ${t} ${e}i)|$。`],
          c * f,
          [c + f, (a + b) * (d + e), a * d + b * e],
          [`The moduli are ${c} and ${f}, and their product is ${c * f}.`, `两个模是 ${c} 和 ${f}，积是 ${c * f}。`],
        );
      },
    ),
  ],
  "evaluating-nested-expressions-after-substitution": [
    skill(
      "substituting-into-a-fraction",
      ["Substituting into a fraction", "代入分式"],
      [
        "A fraction bar acts as a grouping symbol, so the top and the bottom are each worked out in full before dividing. Negative values should go in with parentheses to keep their signs right.",
        "分数线相当于括号，所以分子和分母都要完整算出后再相除。负数代入时要加括号，以保证符号正确。",
      ],
      (rng) => {
        const pairs: [number, number][] = [];
        for (let x = -9; x <= 9; x++) {
          for (let y = -9; y <= 9; y++) {
            if (x + y !== 0 && x !== 0 && y !== 0 && (x * x - y) % (x + y) === 0) pairs.push([x, y]);
          }
        }
        const [x, y] = rng.pick(pairs);
        const answer = (x * x - y) / (x + y);
        return integer(
          [
            `What is the value of $\\frac{x^{2} - y}{x + y}$ when $x = ${x}$ and $y = ${y}$?`,
            `当 $x = ${x}$，$y = ${y}$ 时，$\\frac{x^{2} - y}{x + y}$ 的值是多少？`,
          ],
          answer,
          [-answer, x * x - y, x * x + y],
          [`The top is ${x * x - y} and the bottom is ${x + y}.`, `分子是 ${x * x - y}，分母是 ${x + y}。`],
        );
      },
    ),
  ],
  "evaluating-trigonometric-functions-of-inverse-ratios": [
    skill(
      "a-reciprocal-ratio-of-an-inverse",
      ["A reciprocal ratio of an inverse", "反三角值的倒数比"],
      [
        "Draw a right triangle whose sides match the given ratio, and find the third side. The secant is the hypotenuse over the adjacent side, which is the reciprocal of the cosine.",
        "画一个边符合给定比值的直角三角形，求出第三边。正割是斜边比邻边，也就是余弦的倒数。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples.filter((t) => t[0] !== 6 && t[0] !== 9));
        const flip = rng.bool();
        const [o, h] = flip ? [b, a] : [a, b];
        const form = rng.pick(["sec", "csc", "cot"] as const);
        const value = form === "sec" ? Q.of(c, h) : form === "csc" ? Q.of(c, o) : Q.of(h, o);
        const others =
          form === "sec"
            ? [Q.of(h, c), Q.of(c, o), Q.of(o, c)]
            : form === "csc"
              ? [Q.of(o, c), Q.of(c, h), Q.of(h, c)]
              : [Q.of(o, h), Q.of(c, o), Q.of(h, c)];
        return fraction(
          [
            `What is the exact value of $\\${form}\\left(\\tan^{-1} \\frac{${o}}{${h}}\\right)$?`,
            `$\\${form}\\left(\\tan^{-1} \\frac{${o}}{${h}}\\right)$ 的精确值是多少？`,
          ],
          value,
          others,
          [
            `The opposite side is ${o} and the adjacent side is ${h}, so the hypotenuse is ${c}.`,
            `对边是 ${o}，邻边是 ${h}，所以斜边是 ${c}。`,
          ],
        );
      },
    ),
  ],
  "extrema-of-exponential-functions": [
    skill(
      "the-greatest-value-of-a-decaying-function",
      ["The greatest value of a decaying function", "衰减函数的最大值"],
      [
        "With a base between 0 and 1, an exponential function decreases, so its greatest value on an interval is at the left end. A negative exponent there turns the fraction into a whole number.",
        "底数在 0 和 1 之间时，指数函数递减，所以区间上的最大值在左端点。那里的负指数使分数变成整数。",
      ],
      (rng) => {
        const b = rng.pick([2, 3, 4, 5]);
        const p = rng.int(1, b === 2 ? 6 : 3);
        const q = rng.int(0, 3);
        const c = nz(rng, 30);
        return integer(
          [
            `What is the greatest value of $f(x) = \\left(\\frac{1}{${b}}\\right)^{x}${signed(c)}$ for $${-p} \\le x \\le ${q}$?`,
            `当 $${-p} \\le x \\le ${q}$ 时，$f(x) = \\left(\\frac{1}{${b}}\\right)^{x}${signed(c)}$ 的最大值是多少？`,
          ],
          b ** p + c,
          [1 + c, b ** q + c, b ** p],
          [
            `The function decreases, so the greatest value is at $x = ${-p}$, where the power is ${b ** p}.`,
            `函数递减，所以最大值在 $x = ${-p}$ 处，那里的幂是 ${b ** p}。`,
          ],
        );
      },
    ),
  ],
  "factoring-differences-of-squares-using-surds": [
    skill(
      "two-surds-in-the-factors",
      ["Two surds in the factors", "因式中的两个根式"],
      [
        "A coefficient that is not a perfect square also goes under a root, because any positive number is the square of its square root. So both terms of the difference become squares of surds.",
        "不是完全平方数的系数也可以放到根号下，因为任何正数都是其平方根的平方。所以差的两项都成为根式的平方。",
      ],
      (rng) => {
        const [a, b] = rng.sample([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19], 2) as [number, number];
        return chooseFilled(
          rng,
          [`Which expression is equal to $${a}x^{2} - ${b}$?`, `哪个式子等于 $${a}x^{2} - ${b}$？`],
          `(\\sqrt{${a}}x - \\sqrt{${b}})(\\sqrt{${a}}x + \\sqrt{${b}})`,
          [
            `(\\sqrt{${a}}x - \\sqrt{${b}})^{2}`,
            `(${a}x - \\sqrt{${b}})(${a}x + \\sqrt{${b}})`,
            `(\\sqrt{${b}}x - \\sqrt{${a}})(\\sqrt{${b}}x + \\sqrt{${a}})`,
          ],
          [
            `The first term is $(\\sqrt{${a}}x)^{2}$ and the second is $(\\sqrt{${b}})^{2}$.`,
            `第一项是 $(\\sqrt{${a}}x)^{2}$，第二项是 $(\\sqrt{${b}})^{2}$。`,
          ],
        );
      },
    ),
  ],
  "factoring-expressions-containing-binomials": [
    skill(
      "a-common-binomial-factor",
      ["A common binomial factor", "公共的二项式因式"],
      [
        "A binomial can be factored out just like a single number or letter. When two terms share it, what remains from each term forms the other factor, which is usually a binomial too.",
        "二项式可以像单个的数或字母那样被提取。两项都含它时，每项剩下的部分组成另一个因式，通常也是二项式。",
      ],
      (rng) => {
        const a = nz(rng, 12);
        let b = nz(rng, 12);
        if (b === -a) b = -b;
        const f = (n: number) => (n < 0 ? `x - ${-n}` : `x + ${n}`);
        return chooseFilled(
          rng,
          [`Factor $x(${f(a)})${signed(b)}(${f(a)})$.`, `分解因式 $x(${f(a)})${signed(b)}(${f(a)})$。`],
          `(${f(a)})(${f(b)})`,
          [`x(${f(a)})(${f(b)})`, `(${f(a)})^{2}`, `(${f(-a)})(${f(b)})`],
          [`Both terms contain $(${f(a)})$, and what remains is $x${signed(b)}$.`, `两项都含 $(${f(a)})$，剩下的是 $x${signed(b)}$。`],
        );
      },
    ),
  ],
  "factoring-expressions-containing-hidden-factors": [
    skill(
      "a-negative-common-factor",
      ["A negative common factor", "负的公因数"],
      [
        "When the leading term is negative, factor out a negative number so the remaining quadratic starts with a positive $x^{2}$. Every sign inside changes, and then the difference of squares appears.",
        "首项为负时，提取一个负数，使剩下的二次式以正的 $x^{2}$ 开头。括号内每个符号都变了，这时平方差就出现了。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const n = rng.int(1, 12);
        return chooseFilled(
          rng,
          [`Factor $-${k}x^2 + ${k * n * n}$ completely.`, `完全分解 $-${k}x^2 + ${k * n * n}$。`],
          `-${k}(x - ${n})(x + ${n})`,
          [`${k}(x - ${n})(x + ${n})`, `-${k}(x - ${n})^{2}`, `-${k}(x^{2} + ${n * n})`],
          [`Taking out $-${k}$ leaves $x^{2} - ${n * n}$, a difference of squares.`, `提取 $-${k}$ 后剩下 $x^{2} - ${n * n}$，是平方差。`],
        );
      },
    ),
  ],
  "finding-a-coordinate-triangles-area": [
    skill(
      "a-vertex-from-the-area",
      ["A vertex from the area", "由面积求顶点"],
      [
        "With a side along the $x$-axis, the height of the triangle is the $y$-coordinate of the third vertex. So twice the area divided by the base gives that coordinate.",
        "一边在 $x$ 轴上时，三角形的高就是第三个顶点的 $y$ 坐标。所以面积的两倍除以底，就得到这个坐标。",
      ],
      (rng) => {
        const x = rng.int(-8, 8);
        const b = 2 * rng.int(1, 8);
        const y = rng.int(1, 20);
        const p = rng.int(-9, 9);
        return integer(
          [
            `A triangle has vertices $(${x}, 0)$, $(${x + b}, 0)$ and $(${p}, k)$, with $k > 0$, and its area is ${(b * y) / 2}. What is $k$?`,
            `三角形的顶点是 $(${x}, 0)$，$(${x + b}, 0)$，$(${p}, k)$（$k > 0$），面积是 ${(b * y) / 2}。$k$ 是多少？`,
          ],
          y,
          [2 * y, (b * y) / 2 - b, y + b],
          [
            `The base is ${b}, so $k = 2 \\cdot ${(b * y) / 2} \\div ${b} = ${y}$.`,
            `底是 ${b}，所以 $k = 2 \\cdot ${(b * y) / 2} \\div ${b} = ${y}$。`,
          ],
        );
      },
    ),
  ],
  "finding-angles-from-linear-pairs-and-adjacent-angles": [
    skill(
      "vertical-angles-from-expressions",
      ["Vertical angles from expressions", "由式子求对顶角"],
      [
        "Vertical angles are equal, unlike a linear pair, which adds up to 180 degrees. So set the two expressions equal to each other, solve for $x$, and substitute back to find the angle.",
        "对顶角相等，这与和为 180 度的邻补角不同。所以令两个式子相等，解出 $x$，再代回去求角。",
      ],
      (rng) => {
        const x = rng.int(3, 25);
        const a = rng.int(2, 5);
        const c = a + rng.int(1, 3);
        const angle = rng.int(c * x + 1, Math.max(c * x + 2, 170));
        return integer(
          [
            `Two vertical angles measure $(${a}x${signed(angle - a * x)})^{\\circ}$ and $(${c}x${signed(angle - c * x)})^{\\circ}$. What is the measure of each, in degrees?`,
            `两个对顶角的度数是 $(${a}x${signed(angle - a * x)})^{\\circ}$ 和 $(${c}x${signed(angle - c * x)})^{\\circ}$。每个角多少度？`,
          ],
          angle,
          [x, 180 - angle, 2 * angle],
          [
            `Setting them equal gives $x = ${x}$, and then the angle is ${angle} degrees.`,
            `令它们相等得 $x = ${x}$，于是这个角是 ${angle} 度。`,
          ],
        );
      },
    ),
  ],
  "finding-equations-of-translated-functions": [
    skill(
      "where-a-point-moves",
      ["Where a point moves", "点移到哪里"],
      [
        "In $g(x) = f(x - h) + k$, each point of the graph of $f$ moves $h$ units right and $k$ units up. So add $h$ to the input and $k$ to the output of any known point.",
        "在 $g(x) = f(x - h) + k$ 中，$f$ 图象上每个点向右移 $h$ 个单位，向上移 $k$ 个单位。所以把已知点的输入加 $h$，输出加 $k$。",
      ],
      (rng) => {
        const a = nz(rng, 9);
        const b = nz(rng, 9);
        const h = nz(rng, 7);
        const k = nz(rng, 7);
        return chooseFilled(
          rng,
          [
            `The point $(${a}, ${b})$ is on the graph of $f$. Which point must be on the graph of $g(x) = f(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})${signed(k)}$?`,
            `点 $(${a}, ${b})$ 在 $f$ 的图象上。哪个点一定在 $g(x) = f(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})${signed(k)}$ 的图象上？`,
          ],
          `(${a + h}, ${b + k})`,
          [`(${a - h}, ${b + k})`, `(${a + h}, ${b - k})`, `(${a - h}, ${b - k})`],
          [`The input moves by ${h} and the output moves by ${k}.`, `输入移动 ${h}，输出移动 ${k}。`],
        );
      },
    ),
  ],
  "finding-ones-digits-of-powers": [
    skill(
      "counting-powers-with-a-given-digit",
      ["Counting powers with a given digit", "数个位相同的幂"],
      [
        "Ones digits of powers repeat in a cycle, usually of length 4. So count how many complete cycles fit in the range, and then check the leftover exponents one by one.",
        "幂的个位数按周期循环，周期通常是 4。所以数范围内有多少个完整的周期，再逐个检查剩下的指数。",
      ],
      (rng) => {
        const b = rng.pick([2, 3, 7, 8]);
        const m = rng.int(1, 4);
        const d = b ** m % 10;
        const n = rng.int(10, 200);
        let count = 0;
        let v = 1;
        for (let i = 1; i <= n; i++) {
          v = (v * b) % 10;
          if (v === d) count++;
        }
        return integer(
          [
            `For how many whole numbers $n$ from 1 to ${n} does $${b}^{n}$ have a ones digit of ${d}?`,
            `在 1 到 ${n} 的整数 $n$ 中，有多少个使 $${b}^{n}$ 的个位数是 ${d}？`,
          ],
          count,
          [Math.floor(n / 2), n, count + 1],
          [
            `The digit ${d} comes up once in every cycle of 4, starting at $n = ${m}$.`,
            `个位 ${d} 在每 4 个一循环中出现一次，从 $n = ${m}$ 开始。`,
          ],
        );
      },
    ),
  ],
  "finding-terms-and-infinite-sums-of-geometric-sequences": [
    skill(
      "the-ratio-from-the-sum",
      ["The ratio from the sum", "由和求公比"],
      [
        "The formula for an infinite sum links three quantities: the first term, the ratio and the sum. Given the first term and the sum, solve $S(1 - r) = a$ for the ratio.",
        "无穷级数和的公式联系着三个量：首项、公比和总和。已知首项和总和时，由 $S(1 - r) = a$ 解出公比。",
      ],
      (rng) => {
        const q = rng.int(3, 12);
        const p = rng.int(1, q - 1);
        const k = rng.int(2, 8);
        const s = q * k;
        const a = (q - p) * k;
        return fraction(
          [
            `An infinite geometric series has first term ${a} and sum ${s}. What is its common ratio?`,
            `无穷等比级数的首项是 ${a}，和是 ${s}。公比是多少？`,
          ],
          Q.of(p, q),
          [Q.of(a, s), Q.of(q, q + p), Q.of(s - a, a)],
          [
            `$1 - r = \\frac{${a}}{${s}}$, so $r = ${Q.of(p, q).toLatex()}$.`,
            `$1 - r = \\frac{${a}}{${s}}$，所以 $r = ${Q.of(p, q).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "finding-the-area-covered-by-crossing-rectangular-strips": [
    skill(
      "the-width-from-the-area-left",
      ["The width from the area left", "由剩余面积求宽度"],
      [
        "Crossing strips of the same width leave pieces that fit together into a rectangle whose sides are each reduced by that width. So try the factor pairs of the area left, or solve the quadratic.",
        "宽度相同的十字形小路留下的部分可以拼成一个长方形，每边都减少这个宽度。所以可以试剩余面积的因数对，或者解二次方程。",
      ],
      (rng) => {
        const w = rng.int(1, 6);
        const a = rng.int(3, 20);
        const b = rng.int(3, 20);
        return integer(
          [
            `A garden ${a + w} m by ${b + w} m has two crossing paths of the same width, each running parallel to a side and across the whole garden. The area left is ${a * b} square meters. How wide are the paths?`,
            `长 ${a + w} 米、宽 ${b + w} 米的花园有两条宽度相同的十字形小路，分别平行于一边并贯穿花园。剩余面积是 ${a * b} 平方米。路有多宽？`,
          ],
          w,
          [2 * w, w + 1, a + b + 2 * w - 1],
          [
            `$(${a + w} - x)(${b + w} - x) = ${a * b}$ holds with $x = ${w}$.`,
            `$(${a + w} - x)(${b + w} - x) = ${a * b}$ 在 $x = ${w}$ 时成立。`,
          ],
        );
      },
    ),
  ],
  "finding-the-length-of-a-trapezoid-midsegment": [
    skill(
      "a-midsegment-with-expressions",
      ["A midsegment with expressions", "含式子的中位线"],
      [
        "The midsegment is the average of the bases even when they are written with a variable. So add the two expressions, divide by 2, set the result equal to the midsegment, and solve.",
        "即使两底含变量，中位线仍是两底的平均数。所以把两个式子相加，除以 2，令结果等于中位线，再求解。",
      ],
      (rng) => {
        const x = rng.int(2, 20);
        const a = rng.int(1, 12);
        const b = a + 2 * rng.int(0, 6);
        const m = 2 * x + (a + b) / 2;
        return integer(
          [
            `A trapezoid has bases of length $x + ${a}$ and $3x + ${b}$, and its midsegment has length ${m}. What is $x$?`,
            `梯形的两底长为 $x + ${a}$ 和 $3x + ${b}$，中位线长 ${m}。$x$ 是多少？`,
          ],
          x,
          [2 * x, m - a - b > 0 ? m - a - b : x + 1, x + a],
          [`$\\frac{4x + ${a + b}}{2} = ${m}$ gives $2x = ${2 * x}$.`, `$\\frac{4x + ${a + b}}{2} = ${m}$，得 $2x = ${2 * x}$。`],
        );
      },
    ),
  ],
  "fitting-quadratic-functions-to-data-using-vertex-form": [
    skill(
      "the-matching-point-by-symmetry",
      ["The matching point by symmetry", "由对称找对应点"],
      [
        "A parabola is symmetric about the vertical line through its vertex. So a data point on one side has a matching point at the same height, the same distance away on the other side.",
        "抛物线关于过顶点的竖直线对称。所以一侧的数据点在另一侧有一个高度相同、距离相等的对应点。",
      ],
      (rng) => {
        const h = rng.int(-8, 12);
        const d = nz(rng, 9);
        const a = nz(rng, 4);
        const k = rng.int(-9, 30);
        return integer(
          [
            `A quadratic model has its vertex at $(${h}, ${k})$ and passes through $(${h + d}, ${k + a * d * d})$. At what other $x$ does the model give $y = ${k + a * d * d}$?`,
            `二次模型的顶点是 $(${h}, ${k})$，经过 $(${h + d}, ${k + a * d * d})$。在另外哪个 $x$ 处模型给出 $y = ${k + a * d * d}$？`,
          ],
          h - d,
          [h, h + 2 * d, -h - d],
          [
            `The point is ${Math.abs(d)} from $x = ${h}$, so its match is at ${h - d}.`,
            `这个点距 $x = ${h}$ 有 ${Math.abs(d)}，所以对应点在 ${h - d}。`,
          ],
        );
      },
    ),
  ],
  "forming-related-conditional-statements": [
    skill(
      "a-counterexample-to-the-converse",
      ["A counterexample to the converse", "逆命题的反例"],
      [
        "A true statement can have a false converse. To show this, find a case where the old conclusion holds but the old hypothesis does not, which is a counterexample to the converse.",
        "真命题的逆命题可能是假的。要说明这一点，就找一个原结论成立而原假设不成立的例子，它就是逆命题的反例。",
      ],
      (rng) => {
        const k = rng.pick([2, 3, 4, 5, 6, 7]);
        const a = rng.pick([2, 3, 4, 5]);
        const big = a * k;
        const m = 2 * a * rng.int(1, 6) + 1;
        const yes = k * m;
        const notK = big * rng.int(2, 9) + 1;
        const both = big * rng.int(2, 9);
        return chooseFilled(
          rng,
          [
            `The statement "If a whole number is a multiple of ${big}, then it is a multiple of ${k}" is true. Which number shows that its converse is false?`,
            `命题“如果一个整数是 ${big} 的倍数，那么它是 ${k} 的倍数”是真命题。哪个数说明它的逆命题是假的？`,
          ],
          `${yes % big === 0 ? yes + k : yes}`,
          [`${both}`, `${notK}`, `${both * 2}`],
          [`The answer is a multiple of ${k} but not a multiple of ${big}.`, `答案是 ${k} 的倍数，但不是 ${big} 的倍数。`],
        );
      },
    ),
  ],
  "fractions-of-fractions-with-algebraic-expressions": [
    skill(
      "a-sum-on-top-of-a-fraction",
      ["A sum on top of a fraction", "分子是和的繁分式"],
      [
        "Combine the fractions in the top first, since they share a denominator. Then dividing by the bottom fraction is multiplying by its reciprocal, and the common letter cancels.",
        "先合并分子中的分数，因为它们的分母相同。然后除以下面的分数就是乘它的倒数，相同的字母约去。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(1, 12), rng.int(1, 12), rng.int(2, 12)];
        return fraction(
          [
            `For $x \\ne 0$, simplify $\\frac{\\frac{${a}}{x} + \\frac{${b}}{x}}{\\frac{${c}}{x}}$.`,
            `当 $x \\ne 0$ 时，化简 $\\frac{\\frac{${a}}{x} + \\frac{${b}}{x}}{\\frac{${c}}{x}}$。`,
          ],
          Q.of(a + b, c),
          [Q.of(c, a + b), Q.of(a * b, c), Q.of(a + b + c, c)],
          [
            `The top is $\\frac{${a + b}}{x}$, and dividing by $\\frac{${c}}{x}$ cancels $x$.`,
            `分子是 $\\frac{${a + b}}{x}$，除以 $\\frac{${c}}{x}$ 时 $x$ 约去。`,
          ],
        );
      },
    ),
  ],
  "identifying-impossible-cases-of-symbolic-quotients": [
    skill(
      "a-value-a-simplified-quotient-skips",
      ["A value a simplified quotient skips", "化简后的商取不到的值"],
      [
        "Cancelling a factor gives a simpler expression, but the original still forbids the cancelled value. So the output at that forbidden input is a value the original quotient can never take.",
        "约去因式得到较简单的式子，但原式仍不允许被约去的那个值。所以在这个被禁止的输入处的输出，是原来的商永远取不到的值。",
      ],
      (rng) => {
        const k = nz(rng, 20);
        const inner = k < 0 ? `x + ${-k}` : `x - ${k}`;
        return integer(
          [
            `What single value can $\\frac{x^{2} - ${k * k}}{${inner}}$ never take?`,
            `$\\frac{x^{2} - ${k * k}}{${inner}}$ 永远取不到的那一个值是多少？`,
          ],
          2 * k,
          [k, -k, 0],
          [
            `It equals $x${signed(k)}$ except at $x = ${k}$, where this would be ${2 * k}.`,
            `除 $x = ${k}$ 外，它等于 $x${signed(k)}$，而在那里本应是 ${2 * k}。`,
          ],
        );
      },
    ),
  ],
  "identifying-valid-outputs-of-factored-polynomials": [
    skill(
      "counting-integers-where-it-is-negative",
      ["Counting integers where it is negative", "数函数值为负的整数"],
      [
        "A quadratic with positive leading coefficient is negative only strictly between its zeros. So the integers where it is negative are those strictly inside the interval, leaving out both zeros.",
        "首项系数为正的二次函数，只有在两个零点严格之间才为负。所以函数值为负的整数是严格位于区间内的整数，不包括两个零点。",
      ],
      (rng) => {
        const a = rng.int(-12, 6);
        const b = a + rng.int(2, 20);
        const f = (p: number) => (p < 0 ? `(x + ${-p})` : p === 0 ? "x" : `(x - ${p})`);
        return integer(
          [`For how many integers $x$ is $f(x) = ${f(a)}${f(b)}$ negative?`, `$f(x) = ${f(a)}${f(b)}$ 在多少个整数 $x$ 处为负？`],
          b - a - 1,
          [b - a, b - a + 1, b - a - 2],
          [`These are the integers strictly between ${a} and ${b}.`, `这些是严格介于 ${a} 和 ${b} 之间的整数。`],
        );
      },
    ),
  ],
  "interpreting-coefficients-of-two-variable-equations": [
    skill(
      "the-most-of-one-quantity",
      ["The most of one quantity", "某一种的最大数量"],
      [
        "The largest amount of one quantity comes when the other is zero. Since real counts are whole numbers, divide the total by its coefficient and keep only the whole part.",
        "当另一个量为零时，这个量最大。因为实际个数是整数，所以用总量除以它的系数，只取整数部分。",
      ],
      (rng) => {
        const a = rng.int(3, 15);
        const b = rng.int(7, 40);
        const t = rng.int(100, 900);
        return integer(
          [
            `A customer buys $x$ small boxes and $y$ large boxes, where $${a}x + ${b}y \\le ${t}$ gives the budget. What is the greatest whole number of large boxes the customer can buy?`,
            `顾客买 $x$ 个小盒和 $y$ 个大盒，预算满足 $${a}x + ${b}y \\le ${t}$。顾客最多能买多少个大盒？`,
          ],
          Math.floor(t / b),
          [Math.floor(t / a), Math.floor(t / b) + 1, Math.floor(t / (a + b))],
          [
            `With $x = 0$, $y$ can be at most $${t} \\div ${b}$, whose whole part is ${Math.floor(t / b)}.`,
            `$x = 0$ 时 $y$ 至多是 $${t} \\div ${b}$，其整数部分是 ${Math.floor(t / b)}。`,
          ],
        );
      },
    ),
  ],
  "interpreting-completed-two-way-tables": [
    skill(
      "a-percent-of-a-column",
      ["A percent of a column", "某一列中的百分比"],
      [
        "A percent of a column uses the column total as the whole, not the grand total. So find the entry in the row, divide by the column total, and multiply by 100.",
        "某一列中的百分比以这一列的合计为整体，而不是总合计。所以找到该行的数，除以这一列的合计，再乘 100。",
      ],
      (rng) => {
        const total = rng.pick([20, 25, 50, 100]);
        const a = rng.int(1, total - 1);
        const c = rng.int(5, 60);
        const d = rng.int(5, 60);
        const text = `$$\\begin{array}{c|cc|c} & \\text{Bus} & \\text{Car} & \\text{Total} \\\\ \\hline \\text{Grade 9} & ${a} & ${c} & ${a + c} \\\\ \\text{Grade 10} & ${total - a} & ${d} & ${total - a + d} \\\\ \\hline \\text{Total} & ${total} & ${c + d} & ${total + c + d} \\end{array}$$`;
        const textZh = text
          .replace("Bus", "公交")
          .replace("Car", "汽车")
          .replace("Total", "合计")
          .replace("Grade 9", "九年级")
          .replace("Grade 10", "十年级")
          .replace("Total", "合计")
          .replace("Total", "合计")
          .replace("Total", "合计");
        return integer(
          [`What percent of the students who take the bus are in Grade 9?${text}`, `坐公交的学生中，九年级学生占百分之几？${textZh}`],
          (a * 100) / total,
          [100 - (a * 100) / total, a, Math.round((a * 100) / (a + c))],
          [`$${a} \\div ${total}$ is ${(a * 100) / total} percent.`, `$${a} \\div ${total}$ 是百分之 ${(a * 100) / total}。`],
        );
      },
    ),
  ],
  "interpreting-descriptions-of-physical-phenomena": [
    skill(
      "the-time-to-reach-a-level",
      ["The time to reach a level", "达到某水平的时间"],
      [
        "A described model can be run backward. Write the amount as the start plus or minus the rate times the time, set it equal to the target, and solve for the time.",
        "描述出的模型可以反过来用。把数量写成起始值加减速率乘时间，令它等于目标值，再解出时间。",
      ],
      (rng) => {
        const r = rng.int(2, 15);
        const t = rng.int(3, 40);
        const left = rng.int(5, 200);
        return integer(
          [
            `A tank holds ${left + r * t} liters and drains at a constant ${r} liters per minute. After how many minutes does it hold ${left} liters?`,
            `水箱有 ${left + r * t} 升水，以每分钟 ${r} 升的恒定速度排水。多少分钟后还剩 ${left} 升？`,
          ],
          t,
          [Math.floor((left + r * t) / r), t + r, r * t],
          [`$${left + r * t} - ${r}t = ${left}$ gives $t = ${t}$.`, `$${left + r * t} - ${r}t = ${left}$，得 $t = ${t}$。`],
        );
      },
    ),
  ],
  "interpreting-rates-of-change-of-physical-phenomena": [
    skill(
      "predicting-from-a-rate",
      ["Predicting from a rate", "由变化率预测"],
      [
        "A constant rate of change predicts later values from any known one. Multiply the rate by the time that has passed since the measurement, and add this change to the measured value.",
        "恒定的变化率可以由任一已知值预测后来的值。用变化率乘从测量起经过的时间，再把这个变化量加到测量值上。",
      ],
      (rng) => {
        const r = nz(rng, 9);
        const t1 = rng.int(1, 10);
        const t2 = t1 + rng.int(2, 15);
        const v = rng.int(100, 300);
        return integer(
          [
            `A temperature measures ${v} degrees at $t = ${t1}$ minutes and changes at a constant ${r} degrees per minute. What does it measure at $t = ${t2}$?`,
            `某温度在 $t = ${t1}$ 分钟时是 ${v} 度，以每分钟 ${r} 度的恒定速率变化。在 $t = ${t2}$ 时是多少度？`,
          ],
          v + r * (t2 - t1),
          [v + r * t2, v - r * (t2 - t1), v + r],
          [`${t2 - t1} minutes pass, for a change of ${r * (t2 - t1)}.`, `经过 ${t2 - t1} 分钟，变化量是 ${r * (t2 - t1)}。`],
        );
      },
    ),
  ],
  "isosceles-triangles-in-circles": [
    skill(
      "the-distance-from-center-to-chord",
      ["The distance from center to chord", "圆心到弦的距离"],
      [
        "The perpendicular from the center bisects the chord, which splits the isosceles triangle into two right triangles. So half the chord, the distance and the radius satisfy the Pythagorean theorem.",
        "从圆心作的垂线平分弦，把等腰三角形分成两个直角三角形。所以半弦、距离和半径满足勾股定理。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const k = rng.int(1, 7);
        return integer(
          [
            `A chord of length ${2 * a * k} lies in a circle of radius ${c * k}. How far is the chord from the center?`,
            `半径为 ${c * k} 的圆中有一条长 ${2 * a * k} 的弦。弦到圆心的距离是多少？`,
          ],
          b * k,
          [a * k, (c - a) * k, (c + a) * k],
          [
            `Half the chord is ${a * k}, and $${c * k}^{2} - ${a * k}^{2} = ${b * k}^{2}$.`,
            `半弦是 ${a * k}，$${c * k}^{2} - ${a * k}^{2} = ${b * k}^{2}$。`,
          ],
        );
      },
    ),
  ],
  "joint-variation": [
    skill(
      "the-constant-of-variation",
      ["The constant of variation", "比例常数"],
      [
        "A joint variation has the form $z = kxy$ with a single constant $k$. Substituting one complete set of values and solving gives $k$, which then holds for every other set of values.",
        "联合变化的形式是 $z = kxy$，只有一个常数 $k$。代入一组完整的值求出 $k$，它对其他所有的值都成立。",
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const [x, y, w] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 6)];
        return integer(
          [
            `The quantity $z$ varies jointly as $x$ and $y$ and inversely as $w$. When $x = ${x}$, $y = ${y}$ and $w = ${w}$, $z = ${Q.of(k * x * y, w).toLatex()}$. What is the constant of variation?`,
            `$z$ 与 $x$、$y$ 成联合正比，与 $w$ 成反比。当 $x = ${x}$，$y = ${y}$，$w = ${w}$ 时，$z = ${Q.of(k * x * y, w).toLatex()}$。比例常数是多少？`,
          ],
          k,
          [k * w, k * x, x * y],
          [
            `$z = \\frac{kxy}{w}$ becomes $${Q.of(k * x * y, w).toLatex()} = \\frac{${x * y}k}{${w}}$, so $k = ${k}$.`,
            `$z = \\frac{kxy}{w}$ 变成 $${Q.of(k * x * y, w).toLatex()} = \\frac{${x * y}k}{${w}}$，所以 $k = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "judging-evidence-against-a-probability-model": [
    skill(
      "the-gap-from-the-expected-count",
      ["The gap from the expected count", "与期望次数的差距"],
      [
        "A model predicts an expected count, the probability times the number of trials. Evidence against the model starts with how far the observed count is from this prediction, in either direction.",
        "模型预测一个期望次数，即概率乘试验次数。反驳模型的证据，首先看观测次数与这个预测差多远，两个方向都算。",
      ],
      (rng) => {
        const q = rng.pick([2, 3, 4, 5, 6, 10]);
        const n = q * rng.int(4, 30);
        const e = n / q;
        const gap = rng.int(2, Math.min(e, 9));
        const obs = rng.bool() ? e + gap : e - gap;
        return integer(
          [
            `A model says an event has probability $\\frac{1}{${q}}$. In ${n} trials the event happened ${obs} times. By how many does this differ from the expected count?`,
            `模型认为某事件的概率是 $\\frac{1}{${q}}$。${n} 次试验中事件发生了 ${obs} 次。这与期望次数相差多少？`,
          ],
          gap,
          [e, obs, n - obs],
          [`The expected count is ${e}, and the difference from ${obs} is ${gap}.`, `期望次数是 ${e}，与 ${obs} 的差是 ${gap}。`],
        );
      },
    ),
  ],
  "larger-systems-of-equations": [
    skill(
      "one-unknown-from-pairwise-sums",
      ["One unknown from pairwise sums", "由两两之和求一个未知数"],
      [
        "Adding all three pairwise sums counts each unknown twice. So half of that is the total of the three, and subtracting the equation without the wanted unknown leaves it alone.",
        "把三个两两之和相加，每个未知数都算了两次。所以一半就是三者之和，再减去不含所求未知数的那个方程，就只剩下它。",
      ],
      (rng) => {
        const [x, y, z] = [nz(rng, 12), nz(rng, 12), nz(rng, 12)];
        const name = rng.pick(["x", "y", "z"]);
        const answer = name === "x" ? x : name === "y" ? y : z;
        const rest = x + y + z - answer;
        return integer(
          [
            `If $x + y = ${x + y}$, $y + z = ${y + z}$ and $x + z = ${x + z}$, what is the value of $${name}$?`,
            `若 $x + y = ${x + y}$，$y + z = ${y + z}$，$x + z = ${x + z}$，$${name}$ 的值是多少？`,
          ],
          answer,
          [x + y + z, rest, 2 * answer],
          [`The three add up to ${x + y + z}, and the other two add up to ${rest}.`, `三者之和是 ${x + y + z}，另外两个的和是 ${rest}。`],
        );
      },
    ),
  ],
  "linear-functions-in-tabular-form": [
    skill(
      "the-intercept-from-a-table",
      ["The intercept from a table", "由表格求截距"],
      [
        "A table need not include the input 0. Find the slope from two entries, then step backward from a known entry to 0, which gives the $y$-intercept of the graph.",
        "表格不一定含输入 0。由两组数据求斜率，再从已知的一组倒推到 0，就得到图象的 $y$ 轴截距。",
      ],
      (rng) => {
        const m = nz(rng, 7);
        const b = rng.int(-15, 15);
        const s = rng.int(1, 5);
        const gap = rng.int(2, 3);
        const xs = [s, s + gap, s + 2 * gap, s + 3 * gap];
        return integer(
          [
            `The table shows some values of the linear function $f$. What is $f(0)$? ${table(
              xs,
              xs.map((x) => m * x + b),
            )}`,
            `表格给出线性函数 $f$ 的一些值。$f(0)$ 是多少？${table(
              xs,
              xs.map((x) => m * x + b),
            )}`,
          ],
          b,
          [m * s + b, m, b + m],
          [
            `The slope is ${m}, and going back ${s} from $f(${s}) = ${m * s + b}$ gives ${b}.`,
            `斜率是 ${m}，从 $f(${s}) = ${m * s + b}$ 往回 ${s} 步得 ${b}。`,
          ],
        );
      },
    ),
  ],
  "linear-functions-in-tabular-form-containing-unknown-parameters": [
    skill(
      "a-later-value-with-an-unknown-constant",
      ["A later value with an unknown constant", "含未知常数的后续值"],
      [
        "If the slope is known but the constant is not, one table entry is enough to find it. Substitute that entry, solve for the constant, and then the rule gives any later value.",
        "如果斜率已知而常数未知，一组表格数据就足以求出它。代入这组数据解出常数，解析式就能给出后面任何一个值。",
      ],
      (rng) => {
        const m = nz(rng, 8);
        const b = nz(rng, 15);
        const p = rng.int(1, 8);
        const r = p + rng.int(2, 15);
        return integer(
          [
            `The function $f(x) = ${m}x + b$ has $f(${p}) = ${m * p + b}$. What is $f(${r})$?`,
            `函数 $f(x) = ${m}x + b$ 满足 $f(${p}) = ${m * p + b}$。求 $f(${r})$。`,
          ],
          m * r + b,
          [m * r, b, m * (r - p)],
          [`$b = ${b}$, so $f(${r}) = ${m * r}${signed(b)}$.`, `$b = ${b}$，所以 $f(${r}) = ${m * r}${signed(b)}$。`],
        );
      },
    ),
  ],
  "locating-a-radical-among-known-values": [
    skill(
      "integers-between-two-radicals",
      ["Integers between two radicals", "两个根式之间的整数"],
      [
        "An integer lies between two square roots when its square lies between the numbers under them. So find the first and last perfect squares in that range and count the integers between.",
        "整数在两个平方根之间，当且仅当它的平方在根号下两个数之间。所以找出这个范围内第一个和最后一个完全平方数，再数中间的整数。",
      ],
      (rng) => {
        const a = rng.int(2, 60);
        const b = a + rng.int(20, 200);
        let count = 0;
        for (let n = 1; n * n < b; n++) if (n * n > a) count++;
        return integer(
          [
            `How many integers lie strictly between $\\sqrt{${a}}$ and $\\sqrt{${b}}$?`,
            `严格介于 $\\sqrt{${a}}$ 和 $\\sqrt{${b}}$ 之间的整数有多少个？`,
          ],
          count,
          [count + 1, count + 2, b - a],
          [`Counting the perfect squares between ${a} and ${b} gives ${count}.`, `数 ${a} 和 ${b} 之间的完全平方数，得 ${count}。`],
        );
      },
    ),
  ],
  "manipulating-expressions-and-equations": [
    skill(
      "a-ratio-from-an-equation",
      ["A ratio from an equation", "由方程求比值"],
      [
        "An equation with two letters can fix their ratio without fixing either one. Divide both sides by one letter and by the coefficient on the other, leaving the ratio on its own.",
        "含两个字母的方程可以确定它们的比，而不确定其中任何一个。两边同除以一个字母和另一字母的系数，就只剩下比值。",
      ],
      (rng) => {
        const [a, b] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15], 2) as [number, number];
        return fraction(
          [
            `If $${a}x = ${b}y$ and $y \\ne 0$, what is the value of $\\frac{x}{y}$?`,
            `若 $${a}x = ${b}y$，且 $y \\ne 0$，$\\frac{x}{y}$ 的值是多少？`,
          ],
          Q.of(b, a),
          [Q.of(a, b), Q.of(a * b), Q.of(a + b, a)],
          [
            `Dividing both sides by $${a}y$ gives $\\frac{x}{y} = ${Q.of(b, a).toLatex()}$.`,
            `两边同除以 $${a}y$，得 $\\frac{x}{y} = ${Q.of(b, a).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "manipulating-ratios-in-various-contexts": [
    skill(
      "the-amount-from-a-changed-ratio",
      ["The amount from a changed ratio", "由变化后的比求数量"],
      [
        "When only one quantity changes, the other stays fixed in its number of parts. So write both ratios with the unchanged quantity in the same parts, and the extra parts match the added amount.",
        "只有一个量变化时，另一个量的份数不变。所以把两个比中不变的量写成相同的份数，多出的份数就对应增加的量。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const b = rng.int(2, 8);
        const t = rng.int(1, 5);
        const u = rng.int(2, 15);
        return integer(
          [
            `The ratio of red to blue beads in a jar is $${a} : ${b}$. After ${t * u} red beads are added, the ratio is $${a + t} : ${b}$. How many red beads were there at first?`,
            `罐中红珠与蓝珠的比是 $${a} : ${b}$。加入 ${t * u} 颗红珠后，比变成 $${a + t} : ${b}$。原来有多少颗红珠？`,
          ],
          a * u,
          [b * u, (a + t) * u, t * u],
          [
            `${t} extra ${t === 1 ? "part is" : "parts are"} ${t * u} beads, so one part is ${u}.`,
            `多出的 ${t} 份是 ${t * u} 颗，所以一份是 ${u} 颗。`,
          ],
        );
      },
    ),
  ],
  "matching-parts-across-congruence-and-similarity": [
    skill(
      "a-perimeter-from-a-similarity",
      ["A perimeter from a similarity", "由相似求周长"],
      [
        "All lengths of similar triangles scale by the same factor, including their perimeters. So the ratio of perimeters equals the ratio of a pair of matching sides, read from the order of the letters.",
        "相似三角形的所有长度都按相同比例缩放，包括周长。所以周长之比等于一对对应边之比，对应关系由字母顺序读出。",
      ],
      (rng) => {
        const p = rng.int(2, 9);
        const q = p + rng.int(1, 7);
        const u = rng.int(2, 6);
        // A perimeter above twice AB leaves the other two sides long enough to form a triangle.
        const v = 2 * u + rng.int(1, 8);
        return integer(
          [
            `$\\triangle ABC \\sim \\triangle DEF$, with $AB = ${p * u}$ and $DE = ${q * u}$. The perimeter of $\\triangle ABC$ is $${p * v}$. What is the perimeter of $\\triangle DEF$?`,
            `$\\triangle ABC \\sim \\triangle DEF$，$AB = ${p * u}$，$DE = ${q * u}$。$\\triangle ABC$ 的周长是 $${p * v}$。$\\triangle DEF$ 的周长是多少？`,
          ],
          q * v,
          [p * v + (q - p) * u, q * q * v, p * v + q * u],
          [
            `Every length scales by the same ratio, $\\frac{DE}{AB} = \\frac{${q * u}}{${p * u}}$, and so does the perimeter: $${p * v} \\cdot \\frac{${q * u}}{${p * u}} = ${q * v}$.`,
            `所有长度都按同一比例缩放，$\\frac{DE}{AB} = \\frac{${q * u}}{${p * u}}$，周长也一样：$${p * v} \\cdot \\frac{${q * u}}{${p * u}} = ${q * v}$。`,
          ],
        );
      },
    ),
  ],
  "matching-simple-quadratic-inequalities-to-number-lines": [
    skill(
      "counting-integers-in-the-graph",
      ["Counting integers in the graph", "数图中的整数"],
      [
        "A closed interval on a number line includes its end points, while an open one leaves them out. So count the integers between the zeros, adding the two ends only when equality is allowed.",
        "数轴上的闭区间包含端点，开区间不包含。所以数两个零点之间的整数，只有允许取等号时才加上两端。",
      ],
      (rng) => {
        const a = rng.int(-10, 5);
        const b = a + rng.int(2, 14);
        const closed = rng.bool();
        const f = (p: number) => (p < 0 ? `(x + ${-p})` : p === 0 ? "x" : `(x - ${p})`);
        return integer(
          [
            `How many integers are in the solution graph of $${f(a)}${f(b)} ${closed ? "\\le" : "<"} 0$?`,
            `$${f(a)}${f(b)} ${closed ? "\\le" : "<"} 0$ 的解的图象中有多少个整数？`,
          ],
          closed ? b - a + 1 : b - a - 1,
          [closed ? b - a - 1 : b - a + 1, b - a, 2],
          [
            `The solutions lie between ${a} and ${b}, ${closed ? "including" : "leaving out"} both ends.`,
            `解在 ${a} 和 ${b} 之间，${closed ? "包含" : "不包含"}两端。`,
          ],
        );
      },
    ),
  ],
  "matrix-equations": [
    skill(
      "a-matrix-times-a-column-of-unknowns",
      ["A matrix times a column of unknowns", "矩阵乘未知列向量"],
      [
        "A matrix times a column of unknowns stands for a system of equations, with one equation for each row. When a row has a zero, it gives one unknown at once, and the other row gives the rest.",
        "矩阵乘未知数列向量表示一个方程组，每行一个方程。如果某行有零，就立刻得到一个未知数，另一行再给出其余的。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const b = nz(rng, 6);
        const d = rng.int(1, 6);
        const x = nz(rng, 9);
        const y = nz(rng, 9);
        return integer(
          [
            `If $\\begin{bmatrix} ${a} & ${b} \\\\ 0 & ${d} \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} ${a * x + b * y} \\\\ ${d * y} \\end{bmatrix}$, what is $x$?`,
            `若 $\\begin{bmatrix} ${a} & ${b} \\\\ 0 & ${d} \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} ${a * x + b * y} \\\\ ${d * y} \\end{bmatrix}$，$x$ 是多少？`,
          ],
          x,
          [y, a * x + b * y, x + y],
          [`The second row gives $y = ${y}$, and then the first gives $x = ${x}$.`, `第二行得 $y = ${y}$，于是第一行得 $x = ${x}$。`],
        );
      },
    ),
  ],
};

/** deeperAlgebraFundamentalsThirdPoints holds these third knowledge points, by topic in the algebra shard. */
export const deeperAlgebraFundamentalsThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "complementary-and-supplementary-angles": [
    skill(
      "angles-in-a-given-ratio",
      ["Angles in a given ratio", "成给定比例的角"],
      [
        "If two angles add up to a known total and are in a given ratio, each part is the total divided by the number of parts. So multiply that by the larger number in the ratio.",
        "如果两个角的和已知且比例给定，每份就是总和除以份数。所以再乘比中较大的数，就得到较大的角。",
      ],
      (rng) => {
        const [p, q, total, name] = rng.pick<[number, number, number, [string, string]]>([
          [1, 2, 90, ["complementary", "互余"]],
          [2, 3, 90, ["complementary", "互余"]],
          [1, 4, 90, ["complementary", "互余"]],
          [1, 5, 90, ["complementary", "互余"]],
          [4, 5, 90, ["complementary", "互余"]],
          [7, 8, 90, ["complementary", "互余"]],
          [1, 2, 180, ["supplementary", "互补"]],
          [2, 3, 180, ["supplementary", "互补"]],
          [1, 3, 180, ["supplementary", "互补"]],
          [1, 4, 180, ["supplementary", "互补"]],
          [3, 7, 180, ["supplementary", "互补"]],
          [4, 5, 180, ["supplementary", "互补"]],
          [5, 7, 180, ["supplementary", "互补"]],
          [7, 8, 180, ["supplementary", "互补"]],
          [1, 9, 180, ["supplementary", "互补"]],
          [4, 11, 180, ["supplementary", "互补"]],
          [5, 13, 180, ["supplementary", "互补"]],
          [7, 11, 180, ["supplementary", "互补"]],
        ]);
        const unit = total / (p + q);
        const askLarge = rng.bool();
        return integer(
          [
            `Two ${name[0]} angles are in the ratio $${p} : ${q}$. What is the measure of the ${askLarge ? "larger" : "smaller"} angle, in degrees?`,
            `两个${name[1]}的角的比是 $${p} : ${q}$。${askLarge ? "较大" : "较小"}的角是多少度？`,
          ],
          askLarge ? q * unit : p * unit,
          [askLarge ? p * unit : q * unit, unit, total - unit],
          [`One part is $${total} \\div ${p + q} = ${unit}$ degrees.`, `一份是 $${total} \\div ${p + q} = ${unit}$ 度。`],
        );
      },
    ),
  ],
  "mean-of-a-data-set": [
    skill(
      "the-mean-from-a-frequency-list",
      ["The mean from a frequency list", "由频数表求平均数"],
      [
        "A value repeated several times counts that many times toward the total. So multiply each value by its frequency, add these products, and divide by the sum of the frequencies, not by the number of different values.",
        "重复出现的值要按出现次数计入总和。所以把每个值乘它的频数，把乘积相加，再除以频数之和，而不是除以不同值的个数。",
      ],
      (rng) => {
        const m = rng.int(4, 30);
        const d = rng.int(1, 3);
        const f = rng.int(2, 6);
        const g = rng.int(1, 6);
        const total = 2 * f + g;
        return integer(
          [
            `In a data set, the value ${m - d} appears ${f} times, the value ${m} appears ${g} ${g === 1 ? "time" : "times"} and the value ${m + d} appears ${f} times. What is the mean?`,
            `数据组中，值 ${m - d} 出现 ${f} 次，值 ${m} 出现 ${g} 次，值 ${m + d} 出现 ${f} 次。平均数是多少？`,
          ],
          m,
          [m + d, m * total, m + 1 + d],
          [`The total is ${m * total} over ${total} values, which gives ${m}.`, `总和是 ${m * total}，共 ${total} 个值，得 ${m}。`],
        );
      },
    ),
  ],
};
