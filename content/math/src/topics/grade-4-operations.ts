import type { Figure, Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm } from "@ga/subject-math";
import { type Pair, picked, pickedMath, type Walk } from "./early-grades-more-kit.ts";
import {
  answered,
  areaGridFigure,
  equalTape,
  lineFigure,
  type Miss,
  placeChartFigure,
  placesOf,
  point,
  tapeFigure,
} from "./upper-grades-kit.ts";

// ---------------------------------------------------------------------------
// Helpers

/** fmt writes a whole number in LaTeX with thousands separators: "3{,}400". */
const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** plain writes a whole number for a figure label: "3,400". */
const plain = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);

/** factorsOf lists the factors of n in increasing order. */
function factorsOf(n: number): number[] {
  const out: number[] = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
  return out;
}

/** places splits a whole number into its nonzero place-value parts, largest first: 347 → [300, 40, 7]. */
function places(n: number): number[] {
  const out: number[] = [];
  let p = 1;
  while (p * 10 <= n) p *= 10;
  for (; p >= 1; p /= 10) {
    const d = Math.floor(n / p) % 10;
    if (d) out.push(d * p);
  }
  return out;
}

/** round10 and round100 round to the nearest ten and hundred, halves up. */
const round10 = (n: number) => Math.round(n / 10) * 10;
const round100 = (n: number) => Math.round(n / 100) * 100;

/** noCarry multiplies digit by digit, keeping only the ones digit of each product: the result of forgetting to regroup. */
function noCarry(n: number, a: number): number {
  let out = 0;
  let p = 1;
  for (let m = n; m > 0; m = Math.floor(m / 10), p *= 10) out += ((a * (m % 10)) % 10) * p;
  return out;
}

/** chunks lists the partial quotients of n ÷ d taken greedily by place value: 742 ÷ 7 → [100, 6]. */
function chunks(n: number, d: number): number[] {
  const out: number[] = [];
  let rest = n;
  let p = 1;
  while (p * 10 * d <= n) p *= 10;
  for (; p >= 1; p /= 10) {
    const k = Math.floor(rest / (d * p)) * p;
    if (k > 0) {
      out.push(k);
      rest -= k * d;
    }
  }
  return out;
}

/** partialSteps writes the subtractions of the partial-quotients method for n ÷ d. */
function partialSteps(n: number, d: number): string[] {
  let rest = n;
  return chunks(n, d).map((k) => {
    const line = `${fmt(rest)} - ${fmt(k * d)} = ${fmt(rest - k * d)} \\quad (${d} \\times ${fmt(k)})`;
    rest -= k * d;
    return line;
  });
}

/** quotientLine adds the partial quotients: "100 + 6 = 106". */
const quotientLine = (n: number, d: number) => {
  const ks = chunks(n, d);
  return ks.length === 1 ? fmt(ks[0]!) : `${ks.map(fmt).join(" + ")} = ${fmt(sum(ks))}`;
};

/** context is a situation for a division word problem: n things shared out d at a time. */
interface Context {
  readonly en: (n: number, d: number) => string;
  readonly zh: (n: number, d: number) => string;
}

// ---------------------------------------------------------------------------
// Factors, products and multiples

/** arrayFigure draws a rows-by-columns rectangle with its area inside, the picture of a multiplication fact. */
const arrayFigure = (rows: number, columns: number, inside = String(rows * columns)): Figure =>
  areaGridFigure([String(rows)], [String(columns)], [[inside]], [Math.min(rows, 12)], [Math.min(columns, 12)]);

/** skipFigure draws hops of `step` from 0 on a number line up to `hi`, with an optional point marked. */
const skipFigure = (step: number, hops: number, hi = step * hops, mark?: number): Figure =>
  lineFigure(
    {
      lo: 0,
      hi,
      step: hi > 60 ? step : 1,
      labels: Array.from({ length: hops + 1 }, (_, i) => i * step),
      jumps: Array.from({ length: hops }, (_, i) => [i * step, (i + 1) * step] as const),
      ...(mark !== undefined && { marks: [{ at: mark, text: String(mark), result: true }] }),
    },
    [`A number line with hops of ${step} from 0.`, `一条数轴，从 0 开始每次跳 ${step}。`],
  );

/** factorLineFigure marks every factor of n on a number line from 0 to n. */
const factorLineFigure = (n: number): Figure =>
  lineFigure({ lo: 0, hi: n, step: n > 60 ? 2 : 1, labels: [0, n], marks: factorsOf(n).map((f) => ({ at: f, text: String(f) })) }, [
    `A number line from 0 to ${n} with each factor of ${n} marked.`,
    `一条从 0 到 ${n} 的数轴，标出了 ${n} 的每个因数。`,
  ]);

/** commonFigure draws hops of a on a number line and marks the multiples of b, so the common multiples stand out. */
const commonFigure = (a: number, b: number, hi: number): Figure =>
  lineFigure(
    {
      lo: 0,
      hi,
      step: hi > 60 ? a : 1,
      labels: [0, hi],
      jumps: Array.from({ length: Math.floor(hi / a) }, (_, i) => [i * a, (i + 1) * a] as const),
      marks: Array.from({ length: Math.floor(hi / b) }, (_, i) => ({
        at: (i + 1) * b,
        text: String((i + 1) * b),
        result: ((i + 1) * b) % a === 0,
      })),
    },
    [`Hops of ${a} above a number line, with the multiples of ${b} marked.`, `数轴上方每次跳 ${a}，并标出 ${b} 的倍数。`],
  );

/** groupsBarsFigure draws two bars of a and b cut into pieces of size g. */
const groupsBarsFigure = (a: number, b: number, g: number): Figure =>
  tapeFigure(
    [
      { total: String(a), pieces: Array.from({ length: a / g }, () => ({ size: g, text: String(g) })) },
      { total: String(b), pieces: Array.from({ length: b / g }, () => ({ size: g, text: String(g), lit: true })) },
    ],
    [`Two bars of ${a} and ${b}, both cut into pieces of ${g}.`, `两个长条 ${a} 和 ${b}，都切成每段 ${g}。`],
  );

export const productsAndFactors: TopicDef = {
  id: "products-and-factors",
  title: t("Products and Factors", "积与因数"),
  summary: t(
    "Name the factors and the product of a multiplication, and find a missing factor.",
    "说出乘法算式中的因数和积，并求未知因数。",
  ),
  intro: t(
    "Ana sets out chairs for a show. She makes 6 rows with 8 chairs in each row. That is $6 \\times 8 = 48$ chairs. The 6 and the 8 are the factors. The 48 is the product.\n\nCheck: count by eights, 8, 16, 24, 32, 40, 48. That is 6 eights.\n\nIn this lesson we name the factors and the product and find a missing factor.",
    "安娜为演出摆椅子。她摆了 6 排，每排 8 把，一共 $6 \\times 8 = 48$ 把。6 和 8 是因数，48 是积。\n\n检验：八个八个地数，8、16、24、32、40、48，正好 6 个八。\n\n本课我们认识因数和积，并求未知的因数。",
  ),
  prerequisites: ["division-facts-to-100"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.3.OA.A.4", "CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "naming-factors-and-products",
      ["Factors and products", "因数与积"],
      [
        "In $6 \\times 8 = 48$, the numbers we multiply, 6 and 8, are the factors. The answer, 48, is the product. Written as $48 = 6 \\times 8$, the product is still 48.\n\nCheck: the product is the number the multiplying makes. Here that is 48.\n\n> **Watch out.** The product is not always on the right. Look for the number made by multiplying.",
        "在 $6 \\times 8 = 48$ 中，相乘的 6 和 8 是因数，结果 48 是积。写成 $48 = 6 \\times 8$，积仍然是 48。\n\n检验：积是相乘得到的数，这里是 48。\n\n> **注意。** 积不一定写在右边，要找相乘得到的那个数。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        let b = rng.int(2, 12);
        while (b === a) b = rng.int(2, 12);
        const p = a * b;
        const flip = rng.bool();
        const eq = flip ? `${p} = ${a} \\times ${b}` : `${a} \\times ${b} = ${p}`;
        return pickedMath(
          rng,
          [`Which number is the product in $${eq}$?`, `在 $${eq}$ 中，哪个数是积？`],
          String(p),
          [
            [String(a), `${a} is multiplied, so it is a factor.`, `${a} 是参与相乘的数，是因数。`],
            [String(b), `${b} is multiplied, so it is a factor.`, `${b} 是参与相乘的数，是因数。`],
            [String(a + b), "That is the sum of the factors, which is not in the fact.", "这是两个因数的和，算式里没有它。"],
          ],
          [
            [
              ["Find the numbers multiplied", "找相乘的数"],
              [`${a} and ${b} are multiplied, so they are the factors.`, `${a} 和 ${b} 相乘，它们是因数。`],
            ],
            [
              ["Find the result", "找结果"],
              [`The result of multiplying is ${p}, so ${p} is the product.`, `相乘的结果是 ${p}，所以 ${p} 是积。`],
            ],
          ],
          [`$${a} \\times ${b}$ is ${p}, so ${p} is made by the multiplying.`, `$${a} \\times ${b}$ 得 ${p}，${p} 正是相乘得到的数。`],
          arrayFigure(a, b),
        );
      },
      arrayFigure(6, 8),
    ),
    point(
      "missing-factors",
      ["Missing factors", "求未知因数"],
      [
        "To find a missing factor, ask what number times the known factor gives the product. For $7 \\times \\square = 56$, think of the sevens: $7 \\times 8 = 56$. The missing factor is 8.\n\nCheck: divide. $56 \\div 7 = 8$.\n\n> **Watch out.** Do not subtract. $56 - 7 = 49$ is not a factor here.",
        "求未知因数，就想：哪个数乘已知因数得到积？$7 \\times \\square = 56$，想七的乘法口诀：$7 \\times 8 = 56$，未知因数是 8。\n\n检验：用除法，$56 \\div 7 = 8$。\n\n> **注意。** 不要用减法，$56 - 7 = 49$ 不是这里的因数。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const p = a * b;
        const eq = rng.bool() ? `${a} \\times \\square = ${p}` : `\\square \\times ${a} = ${p}`;
        return answered(
          [`Find the missing factor: $$${eq}$$`, `求未知因数：$$${eq}$$`],
          b,
          [
            [
              ["Think of the facts", "想乘法口诀"],
              [`Which number times ${a} makes ${p}?`, `哪个数乘 ${a} 得 ${p}？`],
            ],
            [["Find it", "找到它"], ["", ""], [`${a} \\times ${b} = ${p}`]],
          ],
          [`Divide the product by the known factor: $${p} \\div ${a} = ${b}$.`, `用积除以已知因数：$${p} \\div ${a} = ${b}$。`],
          [
            [p - a, "That subtracts. A missing factor is found by dividing.", "这是相减。求未知因数要用除法。"],
            [p + a, "That adds. A missing factor is found by dividing.", "这是相加。求未知因数要用除法。"],
            [p, "That is the product, not the missing factor.", "这是积，不是未知因数。"],
            [b + 1, `$${a} \\times ${b + 1} = ${a * (b + 1)}$, which is too big.`, `$${a} \\times ${b + 1} = ${a * (b + 1)}$，太大了。`],
          ],
          { figure: equalTape(a, "?", String(p)) },
        );
      },
      equalTape(7, "?", "56"),
    ),
  ],
};

export const factorsOfANumber: TopicDef = {
  id: "factors-of-a-number",
  title: t("The Factors of a Number", "一个数的因数"),
  summary: t(
    "Tell whether one number is a factor of another, and list all the factors of a number in pairs.",
    "判断一个数是不是另一个数的因数，并成对地找出一个数的所有因数。",
  ),
  intro: t(
    "Leo has 12 stickers to put in equal rows. He can make 1 row of 12, 2 rows of 6 or 3 rows of 4. Every way uses a factor pair of 12. But 5 rows do not work, because 12 does not split into 5 equal rows.\n\nCheck: $1 \\times 12$, $2 \\times 6$ and $3 \\times 4$ all make 12.\n\nIn this lesson we test whether a number is a factor and list all the factors of a number.",
    "利奥有 12 张贴纸，要排成同样多的几行。可以排 1 行 12 张、2 行 6 张或 3 行 4 张，每一种都是 12 的一对因数。可是排 5 行不行，因为 12 不能平均分成 5 行。\n\n检验：$1 \\times 12$、$2 \\times 6$、$3 \\times 4$ 都得 12。\n\n本课我们判断一个数是不是因数，并列出一个数的所有因数。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [{ topic: "products-and-factors", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "is-it-a-factor",
      ["Is it a factor?", "是不是因数"],
      [
        "A number is a factor of another if it divides it with nothing left over. 6 is a factor of 42 because $6 \\times 7 = 42$. 5 is not, because counting by fives goes 40, 45 and skips 42.\n\nCheck: $42 \\div 6 = 7$ with nothing left.\n\n> **Watch out.** Being close is not enough. A factor must land exactly on the number.",
        "一个数能把另一个数分完、没有剩余，它就是那个数的因数。6 是 42 的因数，因为 $6 \\times 7 = 42$。5 不是，五个五个地数，40、45，跳过了 42。\n\n检验：$42 \\div 6 = 7$，没有剩余。\n\n> **注意。** 接近不算数，因数必须正好数到这个数。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const n = rng.bool() ? d * rng.int(2, 12) : rng.int(12, 120);
        const q = Math.floor(n / d);
        const yes = n % d === 0;
        const yesP: Pair = ["Yes", "是"];
        const noP: Pair = ["No", "不是"];
        return picked(
          rng,
          [`Is $${d}$ a factor of $${n}$?`, `$${d}$ 是 $${n}$ 的因数吗？`],
          yes ? yesP : noP,
          [
            yes
              ? [noP, `${d} times ${q} is exactly ${n}, so it is a factor.`, `${d} 乘 ${q} 正好是 ${n}，所以是因数。`]
              : [
                  yesP,
                  `Counting by ${d} goes ${d * q}, ${d * (q + 1)} and skips ${n}.`,
                  `按 ${d} 数，${d * q}、${d * (q + 1)}，跳过了 ${n}。`,
                ],
          ],
          [
            [["Divide", "相除"], ["", ""], [yes ? `${n} \\div ${d} = ${q}` : `${n} \\div ${d} = ${q} \\text{ R } ${n - d * q}`]],
            [
              ["Look at what is left", "看余数"],
              yes
                ? ["Nothing is left, so it is a factor.", "没有剩余，所以是因数。"]
                : [`${n - d * q} is left, so it is not a factor.`, `剩下 ${n - d * q}，所以不是因数。`],
            ],
          ],
          yes
            ? [`Multiply back: $${d} \\times ${q} = ${n}$.`, `乘回去：$${d} \\times ${q} = ${n}$。`]
            : [
                `$${d} \\times ${q} = ${d * q}$ and $${d} \\times ${q + 1} = ${d * (q + 1)}$. Neither is ${n}.`,
                `$${d} \\times ${q} = ${d * q}$，$${d} \\times ${q + 1} = ${d * (q + 1)}$，都不是 ${n}。`,
              ],
          skipFigure(d, Math.min(q + 1, 14), d * Math.min(q + 1, 14), n <= d * Math.min(q + 1, 14) ? n : undefined),
        );
      },
      skipFigure(6, 7, 42, 42),
    ),
    point(
      "factor-pairs",
      ["Factor pairs", "成对的因数"],
      [
        "Factors come in pairs that multiply to the number. For 36, start at 1 and work up: $1 \\times 36$, $2 \\times 18$, $3 \\times 12$, $4 \\times 9$, $6 \\times 6$. Stop when the pairs meet.\n\nCheck: every factor in the list 1, 2, 3, 4, 6, 9, 12, 18, 36 has a partner.\n\n> **Watch out.** Skip numbers that are not factors, like 5. Do not just count up by ones.",
        "因数成对出现，每一对相乘等于这个数。找 36 的因数，从 1 开始往上找：$1 \\times 36$、$2 \\times 18$、$3 \\times 12$、$4 \\times 9$、$6 \\times 6$，两边相遇就停。\n\n检验：1、2、3、4、6、9、12、18、36 中每个因数都有搭档。\n\n> **注意。** 像 5 这样不是因数的数要跳过，不能一个一个往上数。",
      ],
      (rng) => {
        let n = rng.int(12, 100);
        while (factorsOf(n).length < 6) n = rng.int(12, 100);
        const fs = factorsOf(n);
        const hidden = rng.pick(fs.slice(1, -1));
        const partner = n / hidden;
        const list = fs.map((f) => (f === hidden ? "\\square" : String(f))).join(", ");
        const before = fs[fs.indexOf(hidden) - 1]!;
        return answered(
          [
            `The factors of $${n}$ are listed in order. Which factor is missing? $$${list}$$`,
            `按从小到大的顺序列出了 $${n}$ 的因数，缺了哪一个？$$${list}$$`,
          ],
          hidden,
          [
            [
              ["Look between the neighbours", "看两边的数"],
              [
                `The missing factor is between ${before} and ${fs[fs.indexOf(hidden) + 1]}.`,
                `缺少的因数在 ${before} 和 ${fs[fs.indexOf(hidden) + 1]} 之间。`,
              ],
            ],
            [
              ["Find its partner", "找它的搭档"],
              [`${hidden} pairs with ${partner}.`, `${hidden} 和 ${partner} 是一对。`],
              [`${hidden} \\times ${partner} = ${n}`],
            ],
          ],
          [`Divide: $${n} \\div ${hidden} = ${partner}$ with nothing left.`, `用除法：$${n} \\div ${hidden} = ${partner}$，没有剩余。`],
          (
            [
              [hidden + 1, `${n} ÷ ${hidden + 1} leaves a remainder, so it is not a factor.`, `${n} ÷ ${hidden + 1} 有余数，不是因数。`],
              [hidden - 1 > before ? hidden - 1 : hidden + 2, "That number does not divide evenly.", "这个数不能整除。"],
              [
                partner === hidden ? hidden * 2 : partner,
                partner === hidden ? "That is not a factor in the gap." : "That is the partner, already in the list.",
                partner === hidden ? "这不是空缺处的因数。" : "这是它的搭档，已经在列表里。",
              ],
            ] as Miss[]
          ).filter(([v]) => n % Number(v) !== 0 || v === partner),
          { figure: factorLineFigure(n) },
        );
      },
      factorLineFigure(36),
    ),
    point(
      "counting-factors",
      ["Listing all the factors", "列出所有因数"],
      [
        "Find every factor pair, starting from $1 \\times n$, and stop when the pairs meet. Each pair gives two factors, except a pair like $6 \\times 6$, which gives one. 20 has the pairs $1 \\times 20$, $2 \\times 10$ and $4 \\times 5$, so it has 6 factors.\n\nCheck: list them, 1, 2, 4, 5, 10, 20. That is 6.\n\n> **Watch out.** Count the factors, not the pairs.",
        "从 $1 \\times n$ 开始找出所有成对的因数，两边相遇就停。每对给出两个因数，像 $6 \\times 6$ 这样的一对只给出一个。20 的因数对有 $1 \\times 20$、$2 \\times 10$、$4 \\times 5$，所以有 6 个因数。\n\n检验：列出来，1、2、4、5、10、20，正好 6 个。\n\n> **注意。** 要数因数的个数，不是因数对的个数。",
      ],
      (rng) => {
        const n = rng.int(10, 100);
        const fs = factorsOf(n);
        const pairs = fs.filter((f) => f * f <= n).map((f) => `${f} \\times ${n / f}`);
        const square = fs.some((f) => f * f === n);
        return answered(
          [`How many factors does $${n}$ have?`, `$${n}$ 有多少个因数？`],
          fs.length,
          [
            [["Find the pairs", "找因数对"], ["", ""], [pairs.join(", \\quad ")]],
            [
              ["Count the factors", "数因数"],
              [
                square
                  ? `Each pair gives two factors, but the square pair gives one: ${fs.length}.`
                  : `Each pair gives two factors: ${fs.length}.`,
                square ? `每对给出两个因数，但相同的一对只算一个：${fs.length} 个。` : `每对给出两个因数：${fs.length} 个。`,
              ],
            ],
          ],
          [`List them: ${fs.join(", ")}. That is ${fs.length}.`, `列出来：${fs.join("、")}，共 ${fs.length} 个。`],
          [
            [pairs.length, "That counts the pairs. Each pair has two factors.", "这数的是因数对，每对有两个因数。"],
            [fs.length - 2, "That leaves out 1 and the number itself.", "这漏掉了 1 和它本身。"],
            [
              square ? fs.length + 1 : fs.length + 2,
              square ? "That counts the square factor twice." : "That counts a factor that is not there.",
              square ? "这把相同的因数数了两次。" : "这多数了不存在的因数。",
            ],
          ],
          { figure: factorLineFigure(n) },
        );
      },
      factorLineFigure(20),
    ),
  ],
};

export const multiplesOfANumber: TopicDef = {
  id: "multiples-of-a-number",
  title: t("The Multiples of a Number", "一个数的倍数"),
  summary: t(
    "List the multiples of a number and tell whether a number is a multiple of another.",
    "列出一个数的倍数，判断一个数是不是另一个数的倍数。",
  ),
  intro: t(
    "A frog hops along a path. Each hop is 4 steps long. It lands on 4, 8, 12, 16 and so on. These are the multiples of 4. It never lands on 10.\n\nCheck: $4 \\times 3 = 12$, so 12 is a landing spot. 10 is between 8 and 12.\n\nIn this lesson we list multiples, test a number, and count the multiples up to a number.",
    "一只青蛙沿着小路跳，每次跳 4 格。它落在 4、8、12、16……这些是 4 的倍数。它永远不会落在 10 上。\n\n检验：$4 \\times 3 = 12$，所以 12 是落脚点。10 在 8 和 12 中间。\n\n本课我们列出倍数，判断一个数是不是倍数，并数出到某个数为止有几个倍数。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "listing-multiples",
      ["Listing multiples", "列出倍数"],
      [
        "The multiples of a number are what you get when you multiply it by 1, 2, 3 and so on. The multiples of 6 are 6, 12, 18, 24, 30. Each is 6 more than the one before.\n\nCheck: the 5th multiple is $6 \\times 5 = 30$.\n\n> **Watch out.** The first multiple is the number itself, not 0.",
        "一个数的倍数，就是用它分别乘 1、2、3……得到的数。6 的倍数是 6、12、18、24、30，每个都比前一个多 6。\n\n检验：第 5 个倍数是 $6 \\times 5 = 30$。\n\n> **注意。** 第一个倍数是这个数本身，不是 0。",
      ],
      (rng) => {
        const a = rng.int(3, 12);
        const k = rng.int(4, 9);
        return answered(
          [
            `What is the ${k}th multiple of $${a}$? Start counting at $${a}$ as the 1st.`,
            `从 $${a}$ 算作第 1 个，$${a}$ 的第 ${k} 个倍数是多少？`,
          ],
          a * k,
          [
            [["Count by the number", "按这个数数"], ["", ""], [Array.from({ length: k }, (_, i) => a * (i + 1)).join(", ")]],
            [
              ["Take the last", "取最后一个"],
              [`The ${k}th is ${a * k}.`, `第 ${k} 个是 ${a * k}。`],
            ],
          ],
          [`Multiply: $${a} \\times ${k} = ${a * k}$.`, `用乘法：$${a} \\times ${k} = ${a * k}$。`],
          [
            [a * (k - 1), "That starts counting at 0, so it is one multiple short.", "这是从 0 开始数的，少了一个倍数。"],
            [a * (k + 1), "That is one multiple too far.", "这多数了一个倍数。"],
            [a + k, "That adds. Multiples come from multiplying.", "这是相加，倍数要用乘法。"],
          ],
          { figure: skipFigure(a, k) },
        );
      },
      skipFigure(6, 5),
    ),
    point(
      "is-it-a-multiple",
      ["Is it a multiple?", "是不是倍数"],
      [
        "A number is a multiple of 7 if counting by sevens lands on it. Divide to test: $63 \\div 7 = 9$ with nothing left, so 63 is a multiple of 7. $50 \\div 7 = 7$ R 1, so 50 is not.\n\nCheck: $7 \\times 9 = 63$.\n\n> **Watch out.** Ending in 7 does not make a number a multiple of 7. 17 is not one.",
        "按七数能数到的数，就是 7 的倍数。用除法检验：$63 \\div 7 = 9$，没有剩余，63 是 7 的倍数；$50 \\div 7 = 7$ 余 1，50 不是。\n\n检验：$7 \\times 9 = 63$。\n\n> **注意。** 个位是 7 不代表是 7 的倍数，17 就不是。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const yes = rng.bool();
        const q = rng.int(3, 12);
        const n = yes ? a * q : a * q + rng.int(1, a - 1);
        const r = n % a;
        const fq = Math.floor(n / a);
        const yesP: Pair = ["Yes", "是"];
        const noP: Pair = ["No", "不是"];
        return picked(
          rng,
          [`Is $${n}$ a multiple of $${a}$?`, `$${n}$ 是 $${a}$ 的倍数吗？`],
          yes ? yesP : noP,
          [
            yes
              ? [noP, `$${a} \\times ${q} = ${n}$, so counting by ${a} lands on it.`, `$${a} \\times ${q} = ${n}$，按 ${a} 数能数到它。`]
              : [
                  yesP,
                  `Counting by ${a} goes ${a * fq}, ${a * (fq + 1)} and skips ${n}.`,
                  `按 ${a} 数，${a * fq}、${a * (fq + 1)}，跳过了 ${n}。`,
                ],
          ],
          [
            [["Divide", "相除"], ["", ""], [r === 0 ? `${n} \\div ${a} = ${fq}` : `${n} \\div ${a} = ${fq} \\text{ R } ${r}`]],
            [
              ["Decide", "判断"],
              r === 0
                ? ["Nothing is left, so it is a multiple.", "没有剩余，是倍数。"]
                : [`${r} is left, so it is not a multiple.`, `剩下 ${r}，不是倍数。`],
            ],
          ],
          r === 0
            ? [`Multiply back: $${a} \\times ${fq} = ${n}$.`, `乘回去：$${a} \\times ${fq} = ${n}$。`]
            : [
                `The nearest multiples are ${a * fq} and ${a * (fq + 1)}, and ${n} is between them.`,
                `最近的两个倍数是 ${a * fq} 和 ${a * (fq + 1)}，${n} 在它们中间。`,
              ],
          skipFigure(a, fq + 1, a * (fq + 1), n),
        );
      },
      skipFigure(7, 9, 63, 63),
    ),
    point(
      "counting-multiples",
      ["How many multiples?", "有多少个倍数"],
      [
        "To count the multiples of 7 up to 50, find the last one that fits. $7 \\times 7 = 49$ fits, but $7 \\times 8 = 56$ is too big. So there are 7 of them.\n\nCheck: list them, 7, 14, 21, 28, 35, 42, 49. That is 7.\n\n> **Watch out.** The answer is how many, 7, not the last multiple, 49.",
        "数不超过 50 的 7 的倍数，先找最后一个不超过 50 的。$7 \\times 7 = 49$ 可以，$7 \\times 8 = 56$ 太大，所以有 7 个。\n\n检验：列出来，7、14、21、28、35、42、49，共 7 个。\n\n> **注意。** 答案是个数 7，不是最后一个倍数 49。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(3 * d, 12 * d);
        const k = Math.floor(n / d);
        return answered(
          [`How many multiples of $${d}$ are there from $1$ to $${n}$?`, `从 $1$ 到 $${n}$，$${d}$ 的倍数有多少个？`],
          k,
          [
            [
              ["Find the last that fits", "找最后一个"],
              [
                `$${d} \\times ${k} = ${d * k}$ fits, but $${d} \\times ${k + 1} = ${d * (k + 1)}$ is more than ${n}.`,
                `$${d} \\times ${k} = ${d * k}$ 不超过 ${n}，$${d} \\times ${k + 1} = ${d * (k + 1)}$ 超过了。`,
              ],
            ],
            [
              ["Read the count", "读出个数"],
              [`Its partner factor, ${k}, is the count.`, `与它配对的因数 ${k} 就是个数。`],
            ],
          ],
          [
            `Divide: $${n} \\div ${d} = ${k}$${n % d ? ` R ${n % d}` : ""}. The whole part is ${k}.`,
            `用除法：$${n} \\div ${d} = ${k}$${n % d ? ` 余 ${n % d}` : ""}，商是 ${k}。`,
          ],
          [
            [k + 1, "That counts one multiple that is too big.", "这多数了一个超过的倍数。"],
            [d * k, "That is the last multiple, not how many there are.", "这是最后一个倍数，不是个数。"],
            [k - 1, "That misses the first multiple.", "这漏数了第一个倍数。"],
          ],
          { figure: skipFigure(d, k, n) },
        );
      },
      skipFigure(7, 7, 50),
    ),
  ],
};

/** smallPair draws two different numbers from 2 to 12 whose least common multiple is at most 72. */
function smallPair(rng: Rng): [number, number] {
  for (;;) {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    if (a !== b && lcm(a, b) <= 72) return [a, b];
  }
}

/** multiplesUpTo writes the multiples of a up to m: "4, 8, 12". */
const multiplesUpTo = (a: number, m: number) => Array.from({ length: Math.floor(m / a) }, (_, i) => a * (i + 1)).join(", ");

export const leastCommonMultipleByListing: TopicDef = {
  id: "least-common-multiple-by-listing",
  title: t("Least Common Multiples by Listing", "列举法求最小公倍数"),
  summary: t(
    "Find common multiples and the least common multiple of two numbers by listing multiples.",
    "通过列出倍数，找出两个数的公倍数和最小公倍数。",
  ),
  intro: t(
    "Mia swims every 4 days and Sam swims every 6 days. They both swim today. Mia swims on days 4, 8, 12. Sam swims on days 6, 12. Day 12 is the first day they swim together again.\n\nCheck: $12 = 4 \\times 3$ and $12 = 6 \\times 2$.\n\nIn this lesson we list multiples to find common multiples and the least common multiple.",
    "米娅每 4 天游一次泳，萨姆每 6 天游一次。今天两人都游。米娅在第 4、8、12 天游，萨姆在第 6、12 天游。第 12 天是他们下一次同一天游泳。\n\n检验：$12 = 4 \\times 3$，$12 = 6 \\times 2$。\n\n本课我们用列举倍数的方法找公倍数和最小公倍数。",
  ),
  prerequisites: ["multiples-of-a-number"],
  encompasses: [{ topic: "multiples-of-a-number", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "common-multiples",
      ["Common multiples", "公倍数"],
      [
        "A common multiple of two numbers is a multiple of both. Multiples of 4: 4, 8, 12, 16, 20, 24. Multiples of 6: 6, 12, 18, 24. So 12 and 24 are common multiples.\n\nCheck: $24 \\div 4 = 6$ and $24 \\div 6 = 4$, nothing left.\n\n> **Watch out.** A multiple of only one of the numbers is not common.",
        "两个数共同的倍数叫公倍数。4 的倍数：4、8、12、16、20、24。6 的倍数：6、12、18、24。所以 12 和 24 是公倍数。\n\n检验：$24 \\div 4 = 6$，$24 \\div 6 = 4$，都没有剩余。\n\n> **注意。** 只是其中一个数的倍数，不是公倍数。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        do [a, b] = smallPair(rng);
        while (a % b === 0 || b % a === 0);
        const l = lcm(a, b);
        const k = rng.int(1, 3);
        const right = l * k;
        const onlyA = Array.from({ length: 12 }, (_, i) => a * (i + 1)).find((v) => v % b !== 0 && v !== right)!;
        const onlyB = Array.from({ length: 12 }, (_, i) => b * (i + 1)).find((v) => v % a !== 0 && v !== right)!;
        return pickedMath(
          rng,
          [`Which number is a common multiple of $${a}$ and $${b}$?`, `哪个数是 $${a}$ 和 $${b}$ 的公倍数？`],
          String(right),
          [
            [String(onlyA), `${onlyA} is a multiple of ${a} but not of ${b}.`, `${onlyA} 是 ${a} 的倍数，但不是 ${b} 的倍数。`],
            [String(onlyB), `${onlyB} is a multiple of ${b} but not of ${a}.`, `${onlyB} 是 ${b} 的倍数，但不是 ${a} 的倍数。`],
            [String(a + b), `${a + b} is the sum, not a common multiple.`, `${a + b} 是和，不是公倍数。`],
          ],
          [
            [["Test the first number", "检验第一个数"], ["", ""], [`${right} \\div ${a} = ${right / a}`]],
            [["Test the second number", "检验第二个数"], ["", ""], [`${right} \\div ${b} = ${right / b}`]],
          ],
          [
            `List the multiples of ${Math.max(a, b)}: ${Array.from({ length: right / Math.max(a, b) }, (_, i) => Math.max(a, b) * (i + 1)).join(", ")}. ${right} is in the list and divides by ${Math.min(a, b)}.`,
            `列出 ${Math.max(a, b)} 的倍数：${Array.from({ length: right / Math.max(a, b) }, (_, i) => Math.max(a, b) * (i + 1)).join("、")}。${right} 在其中，也能被 ${Math.min(a, b)} 整除。`,
          ],
          commonFigure(a, b, Math.max(right, onlyA, onlyB)),
        );
      },
      commonFigure(4, 6, 24),
    ),
    point(
      "least-common-multiple",
      ["The least common multiple", "最小公倍数"],
      [
        "The least common multiple is the smallest number that is a multiple of both. List the multiples of the larger number and stop at the first one the smaller number divides. For 6 and 8: 8, 16, 24. 6 divides 24, so the answer is 24.\n\nCheck: $24 = 6 \\times 4 = 8 \\times 3$.\n\n> **Watch out.** Multiplying the two numbers, $6 \\times 8 = 48$, gives a common multiple, but not always the least.",
        "最小公倍数是两个数公倍数中最小的。列出较大数的倍数，找到第一个能被较小数整除的就停。6 和 8：8、16、24，24 能被 6 整除，所以是 24。\n\n检验：$24 = 6 \\times 4 = 8 \\times 3$。\n\n> **注意。** 两数相乘 $6 \\times 8 = 48$ 是公倍数，但不一定最小。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        do [a, b] = smallPair(rng);
        while (lcm(a, b) === a * b && rng.bool(0.6));
        const l = lcm(a, b);
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        return answered(
          [`What is the least common multiple of $${a}$ and $${b}$?`, `$${a}$ 和 $${b}$ 的最小公倍数是多少？`],
          l,
          [
            [["List multiples of the larger", "列出较大数的倍数"], ["", ""], [multiplesUpTo(big, l)]],
            [
              ["Stop at the first common one", "找第一个公倍数"],
              [`${small} divides ${l} with nothing left.`, `${l} 能被 ${small} 整除。`],
              [`${l} \\div ${small} = ${l / small}`],
            ],
          ],
          [
            `List the multiples of ${small} too: ${multiplesUpTo(small, l)}. ${l} is the first in both lists.`,
            `再列出 ${small} 的倍数：${multiplesUpTo(small, l)}。${l} 是两个列表中第一个相同的数。`,
          ],
          [
            [a * b, `That is a common multiple, but ${l} is smaller.`, `这是公倍数，但 ${l} 更小。`],
            [big, `${big} is not a multiple of ${small}.`, `${big} 不是 ${small} 的倍数。`],
            [l * 2, `That is a common multiple, but ${l} is smaller.`, `这是公倍数，但 ${l} 更小。`],
            [gcd(a, b), "That is the greatest common factor, not a multiple.", "这是最大公因数，不是倍数。"],
          ],
          { figure: commonFigure(big, small, l) },
        );
      },
      commonFigure(8, 6, 24),
    ),
  ],
};

export const connectingFactorsAndMultiples: TopicDef = {
  id: "connecting-factors-and-multiples",
  title: t("Connecting Factors and Multiples", "因数与倍数的关系"),
  summary: t("See that a is a factor of b exactly when b is a multiple of a.", "理解 a 是 b 的因数，恰好意味着 b 是 a 的倍数。"),
  intro: t(
    "Kai packs 42 pencils into boxes of 6. He fills 7 boxes. So 6 is a factor of 42, and 42 is a multiple of 6. Both say the same thing about $6 \\times 7 = 42$.\n\nCheck: $42 \\div 6 = 7$ with nothing left.\n\nIn this lesson we connect factors and multiples and find numbers that are both.",
    "凯把 42 支铅笔装进每盒 6 支的盒子，装满了 7 盒。所以 6 是 42 的因数，42 是 6 的倍数。这两句话说的都是 $6 \\times 7 = 42$。\n\n检验：$42 \\div 6 = 7$，没有剩余。\n\n本课我们把因数和倍数联系起来，并找出既是因数又是倍数的数。",
  ),
  prerequisites: ["factors-of-a-number", "multiples-of-a-number"],
  encompasses: [
    { topic: "factors-of-a-number", weight: 0.4 },
    { topic: "multiples-of-a-number", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "two-ways-to-say-it",
      ["Two ways to say the same thing", "同一件事的两种说法"],
      [
        "The fact $6 \\times 7 = 42$ can be said two ways. 6 is a factor of 42. 42 is a multiple of 6. The smaller number is the factor and the larger number is the multiple.\n\nCheck: $42 \\div 6 = 7$, so 6 fits into 42 exactly.\n\n> **Watch out.** 42 is not a factor of 6. The factor is the smaller one.",
        "$6 \\times 7 = 42$ 可以有两种说法：6 是 42 的因数；42 是 6 的倍数。较小的数是因数，较大的数是倍数。\n\n检验：$42 \\div 6 = 7$，6 正好能分完 42。\n\n> **注意。** 42 不是 6 的因数，因数是较小的那个。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const n = a * b;
        const right: Pair = [`$${n}$ is a multiple of $${a}$.`, `$${n}$ 是 $${a}$ 的倍数。`];
        return picked(
          rng,
          [`$${a} \\times ${b} = ${n}$. Which sentence is true?`, `$${a} \\times ${b} = ${n}$。哪句话是对的？`],
          right,
          (
            [
              [[`$${n}$ is a factor of $${a}$.`, `$${n}$ 是 $${a}$ 的因数。`], "The factor is the smaller number.", "因数是较小的那个数。"],
              [
                [`$${a}$ is a multiple of $${n}$.`, `$${a}$ 是 $${n}$ 的倍数。`],
                "The multiple is the larger number.",
                "倍数是较大的那个数。",
              ],
              [
                [`$${n}$ is a multiple of $${a + 1}$.`, `$${n}$ 是 $${a + 1}$ 的倍数。`],
                `${n} ÷ ${a + 1} does not come out even.`,
                `${n} ÷ ${a + 1} 不能整除。`,
              ],
            ] as [Pair, string, string][]
          ).filter(([, en]) => !(en.startsWith(`${n} ÷`) && n % (a + 1) === 0)),
          [
            [
              ["Find the factor", "找因数"],
              [`${a} is multiplied, so ${a} is a factor of ${n}.`, `${a} 参与相乘，所以 ${a} 是 ${n} 的因数。`],
            ],
            [
              ["Say it the other way", "换一种说法"],
              [`So ${n} is a multiple of ${a}.`, `所以 ${n} 是 ${a} 的倍数。`],
            ],
          ],
          [`Count by ${a}: ${a} times ${b} lands on ${n}.`, `按 ${a} 数，数 ${b} 次正好到 ${n}。`],
          equalTape(b, String(a), String(n)),
        );
      },
      equalTape(7, "6", "42"),
    ),
    point(
      "factor-and-multiple-at-once",
      ["Both a factor and a multiple", "既是因数又是倍数"],
      [
        "Some questions want a number that is a multiple of one number and a factor of another. Test both. Is 12 a multiple of 4 and a factor of 36? $4 \\times 3 = 12$ and $12 \\times 3 = 36$. Yes to both.\n\nCheck: $36 \\div 12 = 3$ with nothing left.\n\n> **Watch out.** Passing one test is not enough. The number must pass both.",
        "有些题要找一个数，它既是某个数的倍数，又是另一个数的因数。两个条件都要检验。12 是 4 的倍数、又是 36 的因数吗？$4 \\times 3 = 12$，$12 \\times 3 = 36$，都满足。\n\n检验：$36 \\div 12 = 3$，没有剩余。\n\n> **注意。** 只满足一个条件不行，两个都要满足。",
      ],
      (rng) => {
        let a: number;
        let k: number;
        let m: number;
        do {
          a = rng.int(2, 6);
          k = rng.int(2, 4);
          m = rng.int(2, 4);
        } while (factorsOf(a * k * m).every((v) => v === 1 || v % a === 0));
        const x = a * k;
        const n = x * m;
        const notMult = Array.from({ length: n }, (_, i) => i + 1).find((v) => n % v === 0 && v % a !== 0 && v > 1)!;
        const notFactor = Array.from({ length: 10 }, (_, i) => a * (i + 1)).find((v) => n % v !== 0)!;
        const neither = Array.from({ length: n }, (_, i) => i + 2).find((v) => n % v !== 0 && v % a !== 0)!;
        return pickedMath(
          rng,
          [`Which number is a multiple of $${a}$ and also a factor of $${n}$?`, `哪个数既是 $${a}$ 的倍数，又是 $${n}$ 的因数？`],
          String(x),
          [
            [
              String(notMult),
              `${notMult} is a factor of ${n}, but not a multiple of ${a}.`,
              `${notMult} 是 ${n} 的因数，但不是 ${a} 的倍数。`,
            ],
            [
              String(notFactor),
              `${notFactor} is a multiple of ${a}, but not a factor of ${n}.`,
              `${notFactor} 是 ${a} 的倍数，但不是 ${n} 的因数。`,
            ],
            [String(neither), `${neither} passes neither test.`, `${neither} 两个条件都不满足。`],
          ],
          [
            [["Test the multiple", "检验倍数"], ["", ""], [`${a} \\times ${k} = ${x}`]],
            [["Test the factor", "检验因数"], ["", ""], [`${x} \\times ${m} = ${n}`]],
          ],
          [
            `Divide both ways: $${x} \\div ${a} = ${k}$ and $${n} \\div ${x} = ${m}$, nothing left.`,
            `两次除法：$${x} \\div ${a} = ${k}$，$${n} \\div ${x} = ${m}$，都没有剩余。`,
          ],
          skipFigure(x, m, n),
        );
      },
      skipFigure(12, 3, 36),
    ),
  ],
};

/** factorPair draws two different numbers up to 60 with a common factor greater than 1. */
function factorPair(rng: Rng): [number, number] {
  for (;;) {
    const g = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
    const a = g * rng.int(1, 8);
    const b = g * rng.int(2, 8);
    if (a !== b && a <= 60 && b <= 60 && a >= 6) return [a, b];
  }
}

export const greatestCommonFactorByListing: TopicDef = {
  id: "greatest-common-factor-by-listing",
  title: t("Greatest Common Factors by Listing", "列举法求最大公因数"),
  summary: t(
    "Find common factors and the greatest common factor of two numbers by listing factors.",
    "通过列出因数，找出两个数的公因数和最大公因数。",
  ),
  intro: t(
    "Zoe has 12 red beads and 18 blue beads. She wants bags that are all the same, with no beads left. 6 bags work: each gets 2 red and 3 blue. 6 is the greatest number that divides both 12 and 18.\n\nCheck: $12 \\div 6 = 2$ and $18 \\div 6 = 3$.\n\nIn this lesson we list factors to find common factors and the greatest common factor.",
    "佐伊有 12 颗红珠子和 18 颗蓝珠子。她想装成一样的几袋，一颗不剩。装 6 袋可以：每袋 2 颗红、3 颗蓝。6 是能同时整除 12 和 18 的最大的数。\n\n检验：$12 \\div 6 = 2$，$18 \\div 6 = 3$。\n\n本课我们列出因数，找公因数和最大公因数。",
  ),
  prerequisites: ["factors-of-a-number"],
  encompasses: [{ topic: "factors-of-a-number", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "common-factors",
      ["Common factors", "公因数"],
      [
        "A common factor of two numbers is a factor of both. Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 20: 1, 2, 4, 5, 10, 20. The common factors are 1, 2 and 4.\n\nCheck: 4 divides both. $12 \\div 4 = 3$ and $20 \\div 4 = 5$.\n\n> **Watch out.** 1 is a common factor of every pair of numbers. Do not forget it.",
        "两个数共同的因数叫公因数。12 的因数：1、2、3、4、6、12。20 的因数：1、2、4、5、10、20。公因数是 1、2、4。\n\n检验：4 能同时整除两个数，$12 \\div 4 = 3$，$20 \\div 4 = 5$。\n\n> **注意。** 1 是任何两个数的公因数，不要漏掉。",
      ],
      (rng) => {
        const [a, b] = factorPair(rng);
        const common = factorsOf(a).filter((f) => b % f === 0);
        const count = common.length;
        return answered(
          [`How many common factors do $${a}$ and $${b}$ have?`, `$${a}$ 和 $${b}$ 有多少个公因数？`],
          count,
          [
            [
              ["List the factors", "列出因数"],
              ["", ""],
              [`${a}: ${factorsOf(a).join(", ")}`, `${b}: ${factorsOf(b).join(", ")}`],
            ],
            [
              ["Find the ones in both", "找共同的"],
              [`In both lists: ${common.join(", ")}.`, `两个列表都有的：${common.join("、")}。`],
            ],
          ],
          [
            `Every common factor divides the greatest one, ${common[count - 1]}. Its factors are ${factorsOf(common[count - 1]!).join(", ")}: ${count} of them.`,
            `每个公因数都是最大公因数 ${common[count - 1]} 的因数。它的因数是 ${factorsOf(common[count - 1]!).join("、")}，共 ${count} 个。`,
          ],
          [
            [count - 1, "That leaves out 1, which divides every number.", "这漏掉了 1，1 能整除任何数。"],
            [factorsOf(a).length, `That counts all the factors of ${a}.`, `这数的是 ${a} 的全部因数。`],
            [count + 1, "That counts a number that divides only one of them.", "这多数了只能整除其中一个数的数。"],
          ],
          { figure: groupsBarsFigure(a, b, common[count - 1]!) },
        );
      },
      groupsBarsFigure(12, 20, 4),
    ),
    point(
      "greatest-common-factor",
      ["The greatest common factor", "最大公因数"],
      [
        "The greatest common factor is the largest number that divides both. List the factors and pick the largest in both lists. Factors of 18: 1, 2, 3, 6, 9, 18. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. The answer is 6.\n\nCheck: $18 \\div 6 = 3$ and $24 \\div 6 = 4$. No larger number divides both.\n\n> **Watch out.** The answer cannot be bigger than the smaller number.",
        "最大公因数是能同时整除两个数的最大的数。列出因数，选两个列表都有的最大的数。18 的因数：1、2、3、6、9、18。24 的因数：1、2、3、4、6、8、12、24。答案是 6。\n\n检验：$18 \\div 6 = 3$，$24 \\div 6 = 4$，没有更大的数能同时整除。\n\n> **注意。** 答案不会比较小的那个数大。",
      ],
      (rng) => {
        const [a, b] = factorPair(rng);
        const g = gcd(a, b);
        const common = factorsOf(a).filter((f) => b % f === 0);
        return answered(
          [`What is the greatest common factor of $${a}$ and $${b}$?`, `$${a}$ 和 $${b}$ 的最大公因数是多少？`],
          g,
          [
            [
              ["List the factors", "列出因数"],
              ["", ""],
              [`${a}: ${factorsOf(a).join(", ")}`, `${b}: ${factorsOf(b).join(", ")}`],
            ],
            [
              ["Pick the largest in both", "选共同的最大数"],
              [`The common factors are ${common.join(", ")}. The largest is ${g}.`, `公因数是 ${common.join("、")}，最大的是 ${g}。`],
            ],
          ],
          [
            `$${a} \\div ${g} = ${a / g}$ and $${b} \\div ${g} = ${b / g}$, and ${a / g} and ${b / g} share no factor but 1.`,
            `$${a} \\div ${g} = ${a / g}$，$${b} \\div ${g} = ${b / g}$，${a / g} 和 ${b / g} 除了 1 没有公因数。`,
          ],
          (
            [
              [
                common.length > 1 ? common[common.length - 2]! : 1,
                `That is a common factor, but ${g} is greater.`,
                `这是公因数，但 ${g} 更大。`,
              ],
              [lcm(a, b), "That is the least common multiple.", "这是最小公倍数。"],
              [Math.min(a, b), `${Math.min(a, b)} does not divide ${Math.max(a, b)}.`, `${Math.min(a, b)} 不能整除 ${Math.max(a, b)}。`],
              [1, `1 is a common factor, but ${g} is greater.`, `1 是公因数，但 ${g} 更大。`],
            ] as Miss[]
          ).filter(([v]) => v !== Math.min(a, b) || Math.max(a, b) % Number(v) !== 0),
          { figure: groupsBarsFigure(a, b, g) },
        );
      },
      groupsBarsFigure(18, 24, 6),
    ),
  ],
};

// ---------------------------------------------------------------------------
// Multiplying whole numbers

/** shiftFigure shows a number and the same digits moved left by `zeros` places, in a place-value chart. */
const shiftFigure = (n: number, zeros: number): Figure => {
  const product = n * 10 ** zeros;
  const len = String(product).length;
  const pad = (v: number) =>
    String(v)
      .padStart(len, " ")
      .split("")
      .map((c) => c.trim());
  return placeChartFigure(placesOf(len), [pad(n), pad(product)]);
};

/** groupsTape draws `count` equal pieces of `each`, with the total over them. */
const groupsTape = (count: number, each: number, total: string, lit = 0): Figure => equalTape(count, String(each), total, lit);

/** fewerTape draws `count` pieces of `each` with the last `less` pieces dashed, the groups taken away. */
const fewerTape = (count: number, each: number, less: number): Figure =>
  tapeFigure(
    [
      {
        total: String(count * each),
        pieces: Array.from({ length: count }, (_, i) => ({
          size: 1,
          text: String(each),
          dashed: i >= count - less,
          lit: i >= count - less,
        })),
      },
    ],
    [`A bar of ${count} pieces of ${each}, with the last ${less} taken away.`, `一个长条有 ${count} 段 ${each}，最后 ${less} 段被拿走。`],
  );

/** estimateFigure marks a product and its estimate on a number line. */
const estimateFigure = (exact: number, estimate: number): Figure => {
  const unit = 10 ** Math.max(1, String(Math.max(exact, estimate)).length - 2);
  const lo = Math.floor(Math.min(exact, estimate) / unit) * unit - unit;
  const hi = Math.ceil(Math.max(exact, estimate) / unit) * unit + unit;
  return lineFigure(
    {
      lo,
      hi,
      step: unit,
      labels: [lo, hi],
      label: plain,
      marks: [
        { at: exact, text: plain(exact) },
        { at: estimate, text: plain(estimate), result: true },
      ],
    },
    [
      `A number line with the exact product ${plain(exact)} and the estimate ${plain(estimate)}.`,
      `一条数轴，标出准确的积 ${plain(exact)} 和估算值 ${plain(estimate)}。`,
    ],
  );
};

export const multiplyingBy10100And1000: TopicDef = {
  id: "multiplying-by-10-100-and-1000",
  title: t("Multiplying by 10, 100, and 1,000", "乘 10、100 和 1,000"),
  summary: t(
    "Multiply a whole number by 10, 100 or 1,000 by moving its digits to higher places and writing zeros.",
    "把整数乘 10、100 或 1,000：各位数字移到更高的数位，并在末尾添上 0。",
  ),
  intro: t(
    "A box holds 10 crayons. 47 boxes hold $47 \\times 10 = 470$ crayons. Each digit moved one place to the left, and a 0 filled the ones place. With 100 crayons in a box, 47 boxes hold 4,700.\n\nCheck: 47 tens is 470, and 47 hundreds is 4,700.\n\nIn this lesson we multiply by 10, 100 and 1,000 and find which one was used.",
    "一盒有 10 支蜡笔，47 盒有 $47 \\times 10 = 470$ 支。每个数字都向左移了一位，个位补上 0。如果一盒有 100 支，47 盒就有 4,700 支。\n\n检验：47 个十是 470，47 个百是 4,700。\n\n本课我们学习乘 10、100 和 1,000，并判断乘的是哪一个。",
  ),
  prerequisites: ["multiplying-by-multiples-of-10"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.NBT.A.1", "CCSS.5.NBT.A.2"],
  knowledgePoints: [
    point(
      "using-place-value",
      ["Digits move left", "数字向左移"],
      [
        "Multiplying by 10 makes each digit worth ten times as much, so each digit moves one place left. By 100 it moves two places, and by 1,000 three places. In $47 \\times 100 = 4{,}700$ the 4 moves from the tens to the thousands.\n\nCheck: 47 hundreds is 4,700.\n\n> **Watch out.** Fill the empty places on the right with zeros.",
        "乘 10，每个数字表示的值变成 10 倍，所以每个数字向左移一位；乘 100 移两位，乘 1,000 移三位。$47 \\times 100 = 4{,}700$ 中，4 从十位移到了千位。\n\n检验：47 个百是 4,700。\n\n> **注意。** 右边空出的数位要补 0。",
      ],
      (rng) => {
        const n = rng.int(12, 999);
        const z = rng.int(1, 3);
        const f = 10 ** z;
        return answered(
          [`Find $${fmt(n)} \\times ${fmt(f)}$.`, `计算 $${fmt(n)} \\times ${fmt(f)}$。`],
          n * f,
          [
            [
              ["Count the places", "数移几位"],
              [`Times ${plain(f)} moves each digit ${z} place${z > 1 ? "s" : ""} left.`, `乘 ${plain(f)}，每个数字向左移 ${z} 位。`],
            ],
            [["Fill with zeros", "补 0"], ["", ""], [`${fmt(n)} \\times ${fmt(f)} = ${fmt(n * f)}`]],
          ],
          [
            `${plain(n)} ${z === 1 ? "tens" : z === 2 ? "hundreds" : "thousands"} is ${plain(n * f)}.`,
            `${plain(n)} 个${z === 1 ? "十" : z === 2 ? "百" : "千"}是 ${plain(n * f)}。`,
          ],
          [
            [n * f * 10, "That moves the digits one place too many.", "这多移了一位。"],
            [
              z > 1 ? n * 10 ** (z - 1) : n * 100,
              z > 1 ? "That moves the digits one place too few." : "That moves the digits two places.",
              z > 1 ? "这少移了一位。" : "这移了两位。",
            ],
            [n + f, "That adds instead of multiplying.", "这是相加，不是相乘。"],
          ],
          { figure: shiftFigure(n, z) },
        );
      },
      shiftFigure(47, 2),
    ),
    point(
      "pattern-of-zeros",
      ["The pattern of zeros", "末尾 0 的规律"],
      [
        "Because each digit moves left, times 10, 100 or 1,000 writes 1, 2 or 3 zeros at the end. $36 \\times 100 = 3{,}600$. If the number already ends in 0, keep it: $250 \\times 100 = 25{,}000$.\n\nCheck: 250 hundreds is 25,000.\n\n> **Watch out.** Keep the zeros the number already had, then add the new ones.",
        "因为每个数字都向左移，乘 10、100、1,000 就是在末尾添 1、2、3 个 0。$36 \\times 100 = 3{,}600$。如果这个数本来末尾有 0，要保留：$250 \\times 100 = 25{,}000$。\n\n检验：250 个百是 25,000。\n\n> **注意。** 原来末尾的 0 要保留，再添上新的 0。",
      ],
      (rng) => {
        const n = rng.int(2, 99) * 10;
        const z = rng.int(1, 3);
        const f = 10 ** z;
        const zerosInN = String(n).length - String(n).replace(/0+$/, "").length;
        return answered(
          [`Find $${fmt(n)} \\times ${fmt(f)}$.`, `计算 $${fmt(n)} \\times ${fmt(f)}$。`],
          n * f,
          [
            [
              ["Count the zeros", "数 0"],
              [
                `${plain(n)} ends in ${zerosInN} zero${zerosInN > 1 ? "s" : ""} and ${plain(f)} has ${z}.`,
                `${plain(n)} 末尾有 ${zerosInN} 个 0，${plain(f)} 有 ${z} 个 0。`,
              ],
            ],
            [
              ["Write them all", "全部写上"],
              [`So the product ends in ${zerosInN + z} zeros.`, `所以积的末尾有 ${zerosInN + z} 个 0。`],
              [`${fmt(n)} \\times ${fmt(f)} = ${fmt(n * f)}`],
            ],
          ],
          [`Divide back: $${fmt(n * f)} \\div ${fmt(f)} = ${fmt(n)}$.`, `除回去：$${fmt(n * f)} \\div ${fmt(f)} = ${fmt(n)}$。`],
          [
            [(n / 10) * f, "That drops the zero the number already had.", "这丢掉了原来末尾的 0。"],
            [n * f * 10, "That writes one zero too many.", "这多写了一个 0。"],
            [n * 10 ** Math.max(0, z - 1), "That writes one zero too few.", "这少写了一个 0。"],
          ],
          { figure: shiftFigure(n, z) },
        );
      },
      shiftFigure(250, 2),
    ),
    point(
      "which-power-of-ten",
      ["Which power of ten?", "乘的是 10、100 还是 1,000"],
      [
        "To find what a number was multiplied by, count how many places the digits moved. In $52 \\times \\square = 5{,}200$, the 5 moved from the tens to the thousands. That is two places, so the box is 100.\n\nCheck: $52 \\times 100 = 5{,}200$.\n\n> **Watch out.** Count the new zeros, not all the digits.",
        "要知道乘的是几，就数数字移了几位。$52 \\times \\square = 5{,}200$ 中，5 从十位移到千位，移了两位，方框里是 100。\n\n检验：$52 \\times 100 = 5{,}200$。\n\n> **注意。** 数新添的 0，不是数所有的数字。",
      ],
      (rng) => {
        const n = rng.int(11, 99);
        const z = rng.int(1, 3);
        const f = 10 ** z;
        return answered(
          [
            `What number goes in the box? $$${n} \\times \\square = ${fmt(n * f)}$$`,
            `方框里填几？$$${n} \\times \\square = ${fmt(n * f)}$$`,
          ],
          f,
          [
            [
              ["Compare the numbers", "比较两个数"],
              [`${plain(n * f)} is ${n} with ${z} zero${z > 1 ? "s" : ""} after it.`, `${plain(n * f)} 是 ${n} 后面添 ${z} 个 0。`],
            ],
            [
              ["Name the power of ten", "说出乘数"],
              [`${z} new zero${z > 1 ? "s" : ""} means times ${plain(f)}.`, `添 ${z} 个 0 就是乘 ${plain(f)}。`],
            ],
          ],
          [`Divide: $${fmt(n * f)} \\div ${n} = ${fmt(f)}$.`, `用除法：$${fmt(n * f)} \\div ${n} = ${fmt(f)}$。`],
          [
            [f * 10, "That is one zero too many.", "这多了一个 0。"],
            [
              z > 1 ? f / 10 : 100,
              z > 1 ? "That is one zero too few." : "That moves the digits two places.",
              z > 1 ? "这少了一个 0。" : "这会移两位。",
            ],
            [z, "That counts the zeros. The box needs the number with that many zeros.", "这是 0 的个数。方框里要填带这么多个 0 的数。"],
          ],
          { figure: shiftFigure(n, z) },
        );
      },
      shiftFigure(52, 2),
    ),
  ],
};

export const rewritingNumbersEndingInZeros: TopicDef = {
  id: "rewriting-numbers-ending-in-zeros",
  title: t("Rewriting Numbers Ending in Zeros", "改写末尾有 0 的数"),
  summary: t("Rewrite a number ending in zeros as a number of tens, hundreds or thousands.", "把末尾有 0 的数改写成若干个十、百或千。"),
  intro: t(
    "A shop has 3,400 stickers in packs of 100. How many packs? Cover the two zeros: 34 packs. In packs of 10 it would be 340 packs.\n\nCheck: $34 \\times 100 = 3{,}400$ and $340 \\times 10 = 3{,}400$.\n\nIn this lesson we read a number ending in zeros as tens, hundreds or thousands and write it as a product.",
    "商店有 3,400 张贴纸，每包 100 张，有几包？盖住两个 0：34 包。如果每包 10 张，就是 340 包。\n\n检验：$34 \\times 100 = 3{,}400$，$340 \\times 10 = 3{,}400$。\n\n本课我们把末尾有 0 的数看成几个十、几个百或几个千，并写成乘积。",
  ),
  prerequisites: ["multiplying-by-10-100-and-1000"],
  encompasses: [{ topic: "multiplying-by-10-100-and-1000", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.4.NBT.A.1"],
  knowledgePoints: [
    point(
      "counting-tens-and-hundreds",
      ["Counting tens and hundreds", "数有几个十、几个百"],
      [
        "A number ending in zeros can be read as tens or hundreds. Cover the zeros. 3,400 is 340 tens, because $340 \\times 10 = 3{,}400$. It is also 34 hundreds.\n\nCheck: $34 \\times 100 = 3{,}400$.\n\n> **Watch out.** Cover one zero for tens and two zeros for hundreds.",
        "末尾有 0 的数可以看成几个十或几个百，盖住 0 就行。3,400 是 340 个十，因为 $340 \\times 10 = 3{,}400$；它也是 34 个百。\n\n检验：$34 \\times 100 = 3{,}400$。\n\n> **注意。** 看几个十盖一个 0，看几个百盖两个 0。",
      ],
      (rng) => {
        const n = rng.int(11, 99) * 100;
        const tens = rng.bool();
        const u = tens ? 10 : 100;
        return answered(
          tens
            ? [`How many tens are in $${fmt(n)}$?`, `$${fmt(n)}$ 里有多少个十？`]
            : [`How many hundreds are in $${fmt(n)}$?`, `$${fmt(n)}$ 里有多少个百？`],
          n / u,
          [
            [
              ["Cover the zeros", "盖住 0"],
              tens ? ["Tens: cover one zero.", "看几个十：盖住一个 0。"] : ["Hundreds: cover two zeros.", "看几个百：盖住两个 0。"],
            ],
            [["Read what is left", "读剩下的数"], ["", ""], [`${fmt(n)} \\div ${u} = ${fmt(n / u)}`]],
          ],
          [`Multiply back: $${fmt(n / u)} \\times ${u} = ${fmt(n)}$.`, `乘回去：$${fmt(n / u)} \\times ${u} = ${fmt(n)}$。`],
          [
            [
              tens ? n / 100 : n / 10,
              tens ? "That counts hundreds, not tens." : "That counts tens, not hundreds.",
              tens ? "这是百的个数，不是十的个数。" : "这是十的个数，不是百的个数。",
            ],
            [Math.floor(n / 1000), "That is only the thousands digit.", "这只是千位上的数字。"],
            [n, "That is the number itself.", "这是这个数本身。"],
          ],
          { figure: placeChartFigure(placesOf(4), [String(n).split(""), ["", ...String(n / 10).split("")]], tens ? 2 : 1) },
        );
      },
      placeChartFigure(
        placesOf(4),
        [
          ["3", "4", "0", "0"],
          ["", "", "34", "0"],
        ],
        1,
      ),
    ),
    point(
      "rewriting-as-a-product",
      ["Writing it as a product", "写成乘积"],
      [
        "Splitting off the zeros writes a number as a product. $6{,}000 = 6 \\times 1{,}000 = 60 \\times 100 = 600 \\times 10$. Each zero moved into the power of ten is one zero fewer in the other factor.\n\nCheck: every product has three zeros in all.\n\n> **Watch out.** Count the zeros on both sides. They must match.",
        "把末尾的 0 分出来，就能写成乘积。$6{,}000 = 6 \\times 1{,}000 = 60 \\times 100 = 600 \\times 10$。乘数里每多一个 0，另一个因数就少一个 0。\n\n检验：每个乘积里 0 的总数都是 3 个。\n\n> **注意。** 两边 0 的个数要相等。",
      ],
      (rng) => {
        let d = rng.int(2, 99);
        if (d % 10 === 0) d += 1;
        const n = d * 1000;
        const z = rng.int(1, 3);
        const digits = String(n).split("");
        const f = 10 ** z;
        return answered(
          [
            `What number goes in the box? $$${fmt(n)} = \\square \\times ${fmt(f)}$$`,
            `方框里填几？$$${fmt(n)} = \\square \\times ${fmt(f)}$$`,
          ],
          n / f,
          [
            [
              ["Count the zeros", "数 0"],
              [`${plain(n)} has 3 zeros and ${plain(f)} has ${z}.`, `${plain(n)} 有 3 个 0，${plain(f)} 有 ${z} 个。`],
            ],
            [
              ["Give the rest to the box", "剩下的给方框"],
              [`The box keeps ${3 - z} zero${3 - z === 1 ? "" : "s"}: ${plain(n / f)}.`, `方框里的数留 ${3 - z} 个 0：${plain(n / f)}。`],
            ],
          ],
          [`$${fmt(n / f)} \\times ${fmt(f)} = ${fmt(n)}$.`, `$${fmt(n / f)} \\times ${fmt(f)} = ${fmt(n)}$。`],
          [
            [n, "That keeps all the zeros. Some moved into the other factor.", "这保留了所有的 0，可有些 0 已经到另一个因数里了。"],
            [
              z < 3 ? n / f / 10 : (n / f) * 10,
              z < 3 ? "That has one zero too few." : "That has one zero too many.",
              z < 3 ? "这少了一个 0。" : "这多了一个 0。",
            ],
            [(n / f) * 10, "That has one zero too many.", "这多了一个 0。"],
          ],
          { figure: placeChartFigure(placesOf(digits.length), [digits], digits.length - 1 - z) },
        );
      },
      placeChartFigure(placesOf(4), [["6", "0", "0", "0"]], 0),
    ),
    point(
      "equal-or-not",
      ["Equal or not?", "相等吗"],
      [
        "A number can be rewritten many ways as long as the zeros add up. $4{,}200 = 42 \\times 100 = 420 \\times 10$. But $42 \\times 1{,}000 = 42{,}000$, which has one zero too many.\n\nCheck: 4,200 has 2 zeros. $42 \\times 100$ has 2 zeros too.\n\n> **Watch out.** Compare the zeros in the whole product, not in one factor.",
        "只要 0 的总数对，一个数可以有很多种写法。$4{,}200 = 42 \\times 100 = 420 \\times 10$。可是 $42 \\times 1{,}000 = 42{,}000$，多了一个 0。\n\n检验：4,200 有 2 个 0，$42 \\times 100$ 也有 2 个 0。\n\n> **注意。** 要比较整个乘积里 0 的个数，不是只看一个因数。",
      ],
      (rng) => {
        const a = rng.int(11, 99);
        const n = a * 100;
        return pickedMath(
          rng,
          [`Which product equals $${fmt(n)}$?`, `哪个乘积等于 $${fmt(n)}$？`],
          rng.bool() ? `${a} \\times 100` : `${a * 10} \\times 10`,
          [
            [`${a} \\times 1{,}000`, `That is ${plain(a * 1000)}, one zero too many.`, `这是 ${plain(a * 1000)}，多了一个 0。`],
            [`${a} \\times 10`, `That is ${plain(a * 10)}, one zero too few.`, `这是 ${plain(a * 10)}，少了一个 0。`],
            [`${a * 10} \\times 100`, `That is ${plain(a * 1000)}, one zero too many.`, `这是 ${plain(a * 1000)}，多了一个 0。`],
          ],
          [
            [
              ["Count the zeros needed", "数需要几个 0"],
              [`${plain(n)} is ${a} with 2 zeros.`, `${plain(n)} 是 ${a} 后面 2 个 0。`],
            ],
            [
              ["Count each product's zeros", "数每个乘积的 0"],
              ["The right product also gives 2 zeros after the digits.", "对的乘积在数字后面也正好 2 个 0。"],
            ],
          ],
          [
            `$${a} \\times 100 = ${fmt(n)}$ and $${a * 10} \\times 10 = ${fmt(n)}$.`,
            `$${a} \\times 100 = ${fmt(n)}$，$${a * 10} \\times 10 = ${fmt(n)}$。`,
          ],
          shiftFigure(a, 2),
        );
      },
      shiftFigure(42, 2),
    ),
  ],
};

export const multiplyingNumbersEndingInZeros: TopicDef = {
  id: "multiplying-numbers-ending-in-zeros",
  title: t("Multiplying Whole Numbers Ending in Zeros", "末尾有 0 的整数乘法"),
  summary: t(
    "Multiply numbers such as 30 × 400 with a basic fact and the pattern of zeros.",
    "用乘法口诀和添 0 的规律计算 30 × 400 这样的乘法。",
  ),
  intro: t(
    "A farm packs 6 crates with 400 apples each. That is 6 times 4 hundreds, which is 24 hundreds, or 2,400 apples.\n\nCheck: add 400 six times: 400, 800, 1,200, 1,600, 2,000, 2,400.\n\nIn this lesson we multiply the basic fact and then write the zeros.",
    "农场装了 6 箱苹果，每箱 400 个。就是 6 乘 4 个百，等于 24 个百，也就是 2,400 个。\n\n检验：把 400 加 6 次：400、800、1,200、1,600、2,000、2,400。\n\n本课我们先算乘法口诀，再写上 0。",
  ),
  prerequisites: ["rewriting-numbers-ending-in-zeros"],
  encompasses: [
    { topic: "rewriting-numbers-ending-in-zeros", weight: 0.5 },
    { topic: "multiplying-by-10-100-and-1000", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "one-factor-ending-in-zeros",
      ["One factor ending in zeros", "一个因数末尾有 0"],
      [
        "$6 \\times 400$ is 6 times 4 hundreds, which is 24 hundreds. So $6 \\times 400 = 2{,}400$. Multiply the basic fact, then write the zeros.\n\nCheck: $400 + 400 + 400 + 400 + 400 + 400 = 2{,}400$.\n\n> **Watch out.** If the basic fact ends in 0, keep that zero too. $5 \\times 600 = 3{,}000$.",
        "$6 \\times 400$ 是 6 乘 4 个百，等于 24 个百，所以 $6 \\times 400 = 2{,}400$。先算口诀，再写 0。\n\n检验：$400 + 400 + 400 + 400 + 400 + 400 = 2{,}400$。\n\n> **注意。** 如果口诀的积末尾本来有 0，也要保留。$5 \\times 600 = 3{,}000$。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const z = rng.int(1, 3);
        const big = b * 10 ** z;
        const p = a * big;
        return answered(
          [`Find $${a} \\times ${fmt(big)}$.`, `计算 $${a} \\times ${fmt(big)}$。`],
          p,
          [
            [["Use the basic fact", "用口诀"], ["", ""], [`${a} \\times ${b} = ${a * b}`]],
            [
              ["Write the zeros", "写上 0"],
              [`${plain(big)} has ${z} zero${z > 1 ? "s" : ""}.`, `${plain(big)} 有 ${z} 个 0。`],
              [`${a} \\times ${fmt(big)} = ${fmt(p)}`],
            ],
          ],
          [
            `${a} times ${b} ${z === 1 ? "tens" : z === 2 ? "hundreds" : "thousands"} is ${a * b} ${z === 1 ? "tens" : z === 2 ? "hundreds" : "thousands"}, which is ${plain(p)}.`,
            `${a} 乘 ${b} 个${z === 1 ? "十" : z === 2 ? "百" : "千"}是 ${a * b} 个${z === 1 ? "十" : z === 2 ? "百" : "千"}，也就是 ${plain(p)}。`,
          ],
          [
            [
              p / 10,
              (a * b) % 10 === 0 ? "That drops the zero of the basic fact." : "That writes one zero too few.",
              (a * b) % 10 === 0 ? "这丢掉了口诀积末尾的 0。" : "这少写了一个 0。",
            ],
            [p * 10, "That writes one zero too many.", "这多写了一个 0。"],
            [a + big, "That adds instead of multiplying.", "这是相加，不是相乘。"],
          ],
          { figure: groupsTape(a, big, plain(p)) },
        );
      },
      groupsTape(6, 400, "2,400"),
    ),
    point(
      "both-factors-ending-in-zeros",
      ["Both factors ending in zeros", "两个因数末尾都有 0"],
      [
        "When both factors end in zeros, multiply the basic fact and then write all the zeros. $30 \\times 400$: $3 \\times 4 = 12$, and there are 1 + 2 = 3 zeros. So $30 \\times 400 = 12{,}000$.\n\nCheck: $30 \\times 400 = 3 \\times 4 \\times 10 \\times 100 = 12 \\times 1{,}000$.\n\n> **Watch out.** Count the zeros in both factors, not just one.",
        "两个因数末尾都有 0 时，先算口诀，再把两个因数的 0 全部写上。$30 \\times 400$：$3 \\times 4 = 12$，一共有 1 + 2 = 3 个 0，所以 $30 \\times 400 = 12{,}000$。\n\n检验：$30 \\times 400 = 3 \\times 4 \\times 10 \\times 100 = 12 \\times 1{,}000$。\n\n> **注意。** 两个因数的 0 都要数，不能只数一个。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 9);
          b = rng.int(2, 9);
        } while ((a * b) % 10 === 0);
        const za = rng.int(1, 2);
        const zb = rng.int(1, 2);
        const x = a * 10 ** za;
        const y = b * 10 ** zb;
        const p = x * y;
        return answered(
          [`Find $${fmt(x)} \\times ${fmt(y)}$.`, `计算 $${fmt(x)} \\times ${fmt(y)}$。`],
          p,
          [
            [["Use the basic fact", "用口诀"], ["", ""], [`${a} \\times ${b} = ${a * b}`]],
            [
              ["Write all the zeros", "写上所有的 0"],
              [`${za} + ${zb} = ${za + zb} zeros.`, `${za} + ${zb} = ${za + zb} 个 0。`],
              [`${fmt(x)} \\times ${fmt(y)} = ${fmt(p)}`],
            ],
          ],
          [
            `Regroup: $${a} \\times ${b} \\times ${fmt(10 ** (za + zb))} = ${a * b} \\times ${fmt(10 ** (za + zb))} = ${fmt(p)}$.`,
            `换个顺序：$${a} \\times ${b} \\times ${fmt(10 ** (za + zb))} = ${a * b} \\times ${fmt(10 ** (za + zb))} = ${fmt(p)}$。`,
          ],
          [
            [a * b * 10 ** Math.max(za, zb), "That writes the zeros of only one factor.", "这只写了一个因数的 0。"],
            [p * 10, "That writes one zero too many.", "这多写了一个 0。"],
            [a * b, "That leaves out all the zeros.", "这把 0 全丢了。"],
          ],
          { figure: areaGridFigure([plain(x)], [plain(y)], [[plain(p)]]) },
        );
      },
      areaGridFigure(["30"], ["400"], [["12,000"]]),
    ),
    point(
      "facts-ending-in-zero",
      ["When the fact ends in zero", "口诀的积末尾有 0"],
      [
        "Take care when the basic fact itself ends in 0. $5 \\times 4 = 20$. So $50 \\times 400 = 20{,}000$. The product has four zeros: one from 20 and three from the factors.\n\nCheck: $50 \\times 400 = 20 \\times 1{,}000 = 20{,}000$.\n\n> **Watch out.** Do not drop the 0 of the basic fact. 2,000 is ten times too small.",
        "当口诀的积本身末尾有 0 时要小心。$5 \\times 4 = 20$，所以 $50 \\times 400 = 20{,}000$。积有四个 0：一个来自 20，三个来自因数。\n\n检验：$50 \\times 400 = 20 \\times 1{,}000 = 20{,}000$。\n\n> **注意。** 不要丢掉口诀积的 0，2,000 小了十倍。",
      ],
      (rng) => {
        const [a, b] = rng.pick([
          [5, 2],
          [5, 4],
          [5, 6],
          [5, 8],
          [2, 5],
          [4, 5],
          [6, 5],
          [8, 5],
        ] as const);
        const za = rng.int(1, 2);
        const zb = rng.int(1, 2);
        const x = a * 10 ** za;
        const y = b * 10 ** zb;
        const p = x * y;
        const zeros = String(p).length - String(p).replace(/0+$/, "").length;
        return answered(
          [`Find $${fmt(x)} \\times ${fmt(y)}$.`, `计算 $${fmt(x)} \\times ${fmt(y)}$。`],
          p,
          [
            [["Use the basic fact", "用口诀"], [`The fact already ends in 0.`, `口诀的积末尾已经有 0。`], [`${a} \\times ${b} = ${a * b}`]],
            [
              ["Write the factors' zeros", "写上因数的 0"],
              [`Add ${za + zb} more zeros: ${zeros} zeros in all.`, `再添 ${za + zb} 个 0，一共 ${zeros} 个 0。`],
              [`${fmt(x)} \\times ${fmt(y)} = ${fmt(p)}`],
            ],
          ],
          [`$${a * b} \\times ${fmt(10 ** (za + zb))} = ${fmt(p)}$.`, `$${a * b} \\times ${fmt(10 ** (za + zb))} = ${fmt(p)}$。`],
          [
            [p / 10, "That drops the 0 of the basic fact.", "这丢掉了口诀积的 0。"],
            [p * 10, "That writes one zero too many.", "这多写了一个 0。"],
            [a * b * 10 ** Math.max(za, zb), "That writes the zeros of only one factor.", "这只写了一个因数的 0。"],
          ],
          { figure: areaGridFigure([plain(x)], [plain(y)], [[plain(p)]]) },
        );
      },
      areaGridFigure(["50"], ["400"], [["20,000"]]),
    ),
  ],
};

export const multiplyingUsingRepeatedAddition: TopicDef = {
  id: "multiplying-using-repeated-addition",
  title: t("Multiplying Numbers Using Repeated Addition", "用连加做乘法"),
  summary: t(
    "Multiply by adding equal groups, and use a known product to find the next one.",
    "通过把相同的数连加来做乘法，并用已知的积求下一个积。",
  ),
  intro: t(
    "Nina buys 4 bags of marbles. Each bag has 23 marbles. That is 4 groups of 23, so $4 \\times 23 = 23 + 23 + 23 + 23 = 92$.\n\nCheck: $4 \\times 20 = 80$ and $4 \\times 3 = 12$. $80 + 12 = 92$.\n\nIn this lesson we see a product as equal groups and add the groups.",
    "妮娜买了 4 袋弹珠，每袋 23 颗。这是 4 组 23，所以 $4 \\times 23 = 23 + 23 + 23 + 23 = 92$。\n\n检验：$4 \\times 20 = 80$，$4 \\times 3 = 12$，$80 + 12 = 92$。\n\n本课我们把乘法看成几个相同的组，并把这些组加起来。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.3.OA.A.1", "CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "equal-groups",
      ["Equal groups", "相同的组"],
      [
        "Multiplication counts equal groups. $4 \\times 23$ means 4 groups of 23. So it is the same as $23 + 23 + 23 + 23$.\n\nCheck: count the 23s. There are 4 of them.\n\n> **Watch out.** $4 \\times 23$ is not $4 + 23$.",
        "乘法是数相同的组。$4 \\times 23$ 表示 4 组 23，和 $23 + 23 + 23 + 23$ 一样。\n\n检验：数一数有几个 23，正好 4 个。\n\n> **注意。** $4 \\times 23$ 不是 $4 + 23$。",
      ],
      (rng) => {
        const a = rng.int(3, 6);
        const b = rng.int(12, 49);
        return pickedMath(
          rng,
          [`Which sum is the same as $${a} \\times ${b}$?`, `哪个加法算式和 $${a} \\times ${b}$ 相同？`],
          Array(a).fill(b).join(" + "),
          [
            [`${a} + ${b}`, "That adds the two factors once.", "这只把两个因数加了一次。"],
            [
              Array(b > 9 ? a : a)
                .fill(a)
                .join(" + "),
              `That adds ${a} ${a} times. It should add ${b}.`,
              `这把 ${a} 加了 ${a} 次，应该加 ${b}。`,
            ],
            [
              Array(a + 1)
                .fill(b)
                .join(" + "),
              `That is ${a + 1} groups, one too many.`,
              `这是 ${a + 1} 组，多了一组。`,
            ],
          ],
          [
            [
              ["Read the groups", "读出组数"],
              [`${a} groups of ${b}.`, `${a} 组，每组 ${b}。`],
            ],
            [
              ["Write the sum", "写出加法"],
              [`Add ${b} once for each group: ${a} times.`, `每组加一次 ${b}，一共加 ${a} 次。`],
            ],
          ],
          [`Both make $${a * b}$: $${a} \\times ${b} = ${a * b}$.`, `两者都得 $${a * b}$：$${a} \\times ${b} = ${a * b}$。`],
          groupsTape(a, b, "?"),
        );
      },
      groupsTape(4, 23, "?"),
    ),
    point(
      "adding-the-groups",
      ["Adding the groups", "把各组加起来"],
      [
        "To find a product by adding, add the group size once for each group and keep a running total. $3 \\times 27$: $27 + 27 = 54$, then $54 + 27 = 81$.\n\nCheck: $3 \\times 20 = 60$ and $3 \\times 7 = 21$. $60 + 21 = 81$.\n\n> **Watch out.** Count the groups as you add, so you add the right number of times.",
        "用加法求积，每组加一次，边加边记总数。$3 \\times 27$：$27 + 27 = 54$，$54 + 27 = 81$。\n\n检验：$3 \\times 20 = 60$，$3 \\times 7 = 21$，$60 + 21 = 81$。\n\n> **注意。** 边加边数组数，加的次数要对。",
      ],
      (rng) => {
        const a = rng.int(3, 5);
        const b = rng.int(13, 48);
        const totals = Array.from({ length: a }, (_, i) => b * (i + 1));
        return answered(
          [`Find $${a} \\times ${b}$ by adding ${b}s.`, `用连加 ${b} 的方法计算 $${a} \\times ${b}$。`],
          a * b,
          [
            [["Add two groups", "先加两组"], ["", ""], [`${b} + ${b} = ${2 * b}`]],
            [["Keep adding", "继续加"], ["", ""], totals.slice(2).map((v, i) => `${totals[i + 1]} + ${b} = ${v}`)],
          ],
          [
            `Split ${b} into tens and ones: $${a} \\times ${b - (b % 10)} + ${a} \\times ${b % 10} = ${a * (b - (b % 10))} + ${a * (b % 10)} = ${a * b}$.`,
            `把 ${b} 分成整十和一位数：$${a} \\times ${b - (b % 10)} + ${a} \\times ${b % 10} = ${a * (b - (b % 10))} + ${a * (b % 10)} = ${a * b}$。`,
          ],
          [
            [b * (a - 1), "That adds one group too few.", "这少加了一组。"],
            [b * (a + 1), "That adds one group too many.", "这多加了一组。"],
            [a + b, "That adds the factors once.", "这只把两个因数加了一次。"],
          ],
          { figure: groupsTape(a, b, String(a * b)) },
        );
      },
      groupsTape(3, 27, "81"),
    ),
    point(
      "one-more-group",
      ["One more group", "再多一组"],
      [
        "A product you know helps with the next one. One more group means adding one more group. If $5 \\times 18 = 90$, then $6 \\times 18 = 90 + 18 = 108$.\n\nCheck: $6 \\times 18 = 6 \\times 10 + 6 \\times 8 = 60 + 48 = 108$.\n\n> **Watch out.** Add the group, 18, not the 6.",
        "已经知道的积能帮你算下一个。多一组就加一组。如果 $5 \\times 18 = 90$，那么 $6 \\times 18 = 90 + 18 = 108$。\n\n检验：$6 \\times 18 = 6 \\times 10 + 6 \\times 8 = 60 + 48 = 108$。\n\n> **注意。** 要加一组 18，不是加 6。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(12, 49);
        const known = a * b;
        return answered(
          [
            `$${a} \\times ${b} = ${known}$. Use this to find $${a + 1} \\times ${b}$.`,
            `$${a} \\times ${b} = ${known}$。用它求 $${a + 1} \\times ${b}$。`,
          ],
          known + b,
          [
            [
              ["See the change", "看变化"],
              [`${a + 1} groups is one more group of ${b}.`, `${a + 1} 组比 ${a} 组多一组 ${b}。`],
            ],
            [["Add one group", "加一组"], ["", ""], [`${known} + ${b} = ${known + b}`]],
          ],
          [
            `Split ${b}: $${a + 1} \\times ${b - (b % 10)} + ${a + 1} \\times ${b % 10} = ${(a + 1) * (b - (b % 10))} + ${(a + 1) * (b % 10)} = ${known + b}$.`,
            `拆开 ${b}：$${a + 1} \\times ${b - (b % 10)} + ${a + 1} \\times ${b % 10} = ${(a + 1) * (b - (b % 10))} + ${(a + 1) * (b % 10)} = ${known + b}$。`,
          ],
          [
            [known + a + 1, `That adds ${a + 1}. One more group adds ${b}.`, `这加了 ${a + 1}，多一组要加 ${b}。`],
            [known + 1, "That adds 1. One more group adds a whole group.", "这只加了 1，多一组要加整整一组。"],
            [known - b, "That takes a group away.", "这是减少了一组。"],
          ],
          {
            figure: tapeFigure(
              [
                {
                  total: String(known + b),
                  pieces: [
                    { size: a, text: String(known) },
                    { size: 1, text: String(b), lit: true },
                  ],
                },
              ],
              [`A bar of ${known} with one more group of ${b}.`, `一个长条 ${known}，再接上一组 ${b}。`],
            ),
          },
        );
      },
      tapeFigure(
        [
          {
            total: "108",
            pieces: [
              { size: 5, text: "90" },
              { size: 1, text: "18", lit: true },
            ],
          },
        ],
        ["A bar of 90 with one more group of 18.", "一个长条 90，再接上一组 18。"],
      ),
    ),
  ],
};

export const multiplyingUsingRepeatedSubtraction: TopicDef = {
  id: "multiplying-using-repeated-subtraction",
  title: t("Multiplying Numbers Using Repeated Subtraction", "用连减做乘法"),
  summary: t(
    "Multiply by a number just below a ten or hundred by taking away a group: 9 × 24 = 10 × 24 − 24.",
    "乘一个接近整十或整百的数时，先多乘再减去一组：9 × 24 = 10 × 24 − 24。",
  ),
  intro: t(
    "Ben has 10 boxes of 24 pens. He gives one box away. Now he has 9 boxes. $10 \\times 24 = 240$, and one box fewer is $240 - 24 = 216$.\n\nCheck: $9 \\times 24 = 9 \\times 20 + 9 \\times 4 = 180 + 36 = 216$.\n\nIn this lesson we start from an easy product and take groups away.",
    "本有 10 盒笔，每盒 24 支。他送出一盒，还剩 9 盒。$10 \\times 24 = 240$，少一盒就是 $240 - 24 = 216$。\n\n检验：$9 \\times 24 = 9 \\times 20 + 9 \\times 4 = 180 + 36 = 216$。\n\n本课我们从容易算的积开始，再减去几组。",
  ),
  prerequisites: ["multiplying-using-repeated-addition", "multiplying-numbers-ending-in-zeros"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "one-group-fewer",
      ["One group fewer", "少一组"],
      [
        "One group fewer means taking one group away. $10 \\times 24 = 240$, so $9 \\times 24 = 240 - 24 = 216$.\n\nCheck: $9 \\times 24 = 180 + 36 = 216$.\n\n> **Watch out.** Subtract the group, 24, not the 9 or the 10.",
        "少一组就是减去一组。$10 \\times 24 = 240$，所以 $9 \\times 24 = 240 - 24 = 216$。\n\n检验：$9 \\times 24 = 180 + 36 = 216$。\n\n> **注意。** 要减去一组 24，不是减 9 或 10。",
      ],
      (rng) => {
        const a = rng.int(4, 10);
        const b = rng.int(12, 49);
        const known = a * b;
        return answered(
          [
            `$${a} \\times ${b} = ${fmt(known)}$. Use this to find $${a - 1} \\times ${b}$.`,
            `$${a} \\times ${b} = ${fmt(known)}$。用它求 $${a - 1} \\times ${b}$。`,
          ],
          known - b,
          [
            [
              ["See the change", "看变化"],
              [`${a - 1} groups is one group of ${b} fewer.`, `${a - 1} 组比 ${a} 组少一组 ${b}。`],
            ],
            [["Take one group away", "减去一组"], ["", ""], [`${fmt(known)} - ${b} = ${fmt(known - b)}`]],
          ],
          [
            `Split ${b}: $${a - 1} \\times ${b - (b % 10)} + ${a - 1} \\times ${b % 10} = ${(a - 1) * (b - (b % 10))} + ${(a - 1) * (b % 10)} = ${known - b}$.`,
            `拆开 ${b}：$${a - 1} \\times ${b - (b % 10)} + ${a - 1} \\times ${b % 10} = ${(a - 1) * (b - (b % 10))} + ${(a - 1) * (b % 10)} = ${known - b}$。`,
          ],
          [
            [known - a, `That subtracts ${a}. One group fewer subtracts ${b}.`, `这减了 ${a}，少一组要减 ${b}。`],
            [known - 1, "That subtracts 1. One group fewer subtracts a whole group.", "这只减了 1，少一组要减整整一组。"],
            [known + b, "That adds a group.", "这是多加了一组。"],
          ],
          { figure: fewerTape(a, b, 1) },
        );
      },
      fewerTape(10, 24, 1),
    ),
    point(
      "just-below-a-ten",
      ["Just below a ten", "比整十少 1"],
      [
        "A factor such as 19 or 49 is one less than a round number. Multiply by the round number, then take one group away. $19 \\times 6 = 20 \\times 6 - 6 = 120 - 6 = 114$.\n\nCheck: $19 \\times 6 = 10 \\times 6 + 9 \\times 6 = 60 + 54 = 114$.\n\n> **Watch out.** Subtract one group of 6, not 1.",
        "像 19、49 这样的因数比整十数少 1。先乘整十数，再减去一组。$19 \\times 6 = 20 \\times 6 - 6 = 120 - 6 = 114$。\n\n检验：$19 \\times 6 = 10 \\times 6 + 9 \\times 6 = 60 + 54 = 114$。\n\n> **注意。** 要减去一组 6，不是减 1。",
      ],
      (rng) => {
        const r = rng.int(2, 9) * 10;
        const n = r - 1;
        const a = rng.int(3, 9);
        return answered(
          [`Find $${n} \\times ${a}$ by first finding $${r} \\times ${a}$.`, `先算 $${r} \\times ${a}$，再求 $${n} \\times ${a}$。`],
          n * a,
          [
            [["Use the round number", "用整十数"], ["", ""], [`${r} \\times ${a} = ${r * a}`]],
            [
              ["Take one group away", "减去一组"],
              [`${n} is one less than ${r}, so take away one ${a}.`, `${n} 比 ${r} 少 1，所以减去一个 ${a}。`],
              [`${r * a} - ${a} = ${n * a}`],
            ],
          ],
          [
            `Split ${n}: $${r - 10} \\times ${a} + 9 \\times ${a} = ${(r - 10) * a} + ${9 * a} = ${n * a}$.`,
            `拆开 ${n}：$${r - 10} \\times ${a} + 9 \\times ${a} = ${(r - 10) * a} + ${9 * a} = ${n * a}$。`,
          ],
          [
            [r * a - 1, `That takes away 1. It should take away one group of ${a}.`, `这减了 1，应该减去一组 ${a}。`],
            [r * a, "That forgets to take the group away.", "这忘了减去一组。"],
            [r * a + a, "That adds a group instead.", "这反而加了一组。"],
          ],
          {
            figure: tapeFigure(
              [
                {
                  total: String(r * a),
                  pieces: [
                    { size: n, text: String(n * a) },
                    { size: 1, text: String(a), dashed: true, lit: true },
                  ],
                },
              ],
              [`A bar of ${r * a} with one piece of ${a} taken away.`, `一个长条 ${r * a}，拿走一段 ${a}。`],
            ),
          },
        );
      },
      tapeFigure(
        [
          {
            total: "120",
            pieces: [
              { size: 19, text: "114" },
              { size: 1, text: "6", dashed: true, lit: true },
            ],
          },
        ],
        ["A bar of 120 with one piece of 6 taken away.", "一个长条 120，拿走一段 6。"],
      ),
    ),
  ],
};

export const estimatingMultiDigitMultiplication: TopicDef = {
  id: "estimating-multi-digit-multiplication",
  title: t("Estimating Multi-Digit Multiplication", "估算多位数乘法"),
  summary: t("Estimate a product by rounding the factors and multiplying the rounded numbers.", "把因数取近似数再相乘，估算乘积。"),
  intro: t(
    "A school orders 6 boxes of 47 pencils. About how many is that? 47 is close to 50, and $50 \\times 6 = 300$. So about 300 pencils.\n\nCheck: the exact answer is $47 \\times 6 = 282$, which is close to 300.\n\nIn this lesson we round factors to estimate products.",
    "学校订了 6 盒铅笔，每盒 47 支，大约有多少支？47 接近 50，$50 \\times 6 = 300$，所以大约 300 支。\n\n检验：准确的是 $47 \\times 6 = 282$，接近 300。\n\n本课我们把因数凑成整数来估算积。",
  ),
  prerequisites: ["multiplying-numbers-ending-in-zeros"],
  encompasses: [{ topic: "multiplying-numbers-ending-in-zeros", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.NBT.B.5", "CCSS.4.OA.A.3"],
  knowledgePoints: [
    point(
      "rounding-one-factor",
      ["Rounding one factor", "把一个因数凑整"],
      [
        "To estimate $47 \\times 6$, round 47 to the nearest ten, 50, and multiply: $50 \\times 6 = 300$. The exact product, 282, is close to 300.\n\nCheck: 47 is 3 less than 50, so the estimate is $3 \\times 6 = 18$ too big.\n\n> **Watch out.** Round to the nearest ten. 47 rounds to 50, not 40.",
        "估算 $47 \\times 6$，把 47 四舍五入到整十 50，再乘：$50 \\times 6 = 300$。准确的积 282 接近 300。\n\n检验：47 比 50 少 3，估算值多了 $3 \\times 6 = 18$。\n\n> **注意。** 要四舍五入到最近的整十，47 约是 50，不是 40。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(12, 98);
        while (n % 10 === 5 || n % 10 === 0);
        const a = rng.int(3, 9);
        const r = round10(n);
        return answered(
          [`Estimate $${n} \\times ${a}$ by rounding $${n}$ to the nearest ten.`, `把 $${n}$ 四舍五入到整十，估算 $${n} \\times ${a}$。`],
          r * a,
          [
            [
              ["Round", "四舍五入"],
              [`${n} rounds to ${r}.`, `${n} 约等于 ${r}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${r} \\times ${a} = ${r * a}`]],
          ],
          [
            `The exact product is $${n} \\times ${a} = ${n * a}$, close to ${r * a}.`,
            `准确的积是 $${n} \\times ${a} = ${n * a}$，接近 ${r * a}。`,
          ],
          [
            [n * a, "That is the exact product, not the estimate.", "这是准确的积，不是估算值。"],
            [(r === n - (n % 10) ? r + 10 : n - (n % 10)) * a, `That rounds ${n} the wrong way.`, `这把 ${n} 凑错了方向。`],
            [r + a, "That adds instead of multiplying.", "这是相加，不是相乘。"],
          ],
          { figure: estimateFigure(n * a, r * a) },
        );
      },
      estimateFigure(282, 300),
    ),
    point(
      "rounding-both-factors",
      ["Rounding both factors", "两个因数都凑整"],
      [
        "When both factors have two digits, round each to the nearest ten. $38 \\times 52 \\approx 40 \\times 50 = 2{,}000$. The exact product, 1,976, is close.\n\nCheck: $4 \\times 5 = 20$, and two zeros make 2,000.\n\n> **Watch out.** Round both factors before you multiply.",
        "两个因数都是两位数时，把每个都四舍五入到整十。$38 \\times 52 \\approx 40 \\times 50 = 2{,}000$，准确的积 1,976 很接近。\n\n检验：$4 \\times 5 = 20$，再添两个 0，得 2,000。\n\n> **注意。** 两个因数都要先凑整再相乘。",
      ],
      (rng) => {
        let x: number;
        let y: number;
        do {
          x = rng.int(12, 98);
          y = rng.int(12, 98);
        } while (x % 10 === 5 || y % 10 === 5 || x % 10 === 0 || y % 10 === 0);
        const [rx, ry] = [round10(x), round10(y)];
        return answered(
          [
            `Estimate $${x} \\times ${y}$ by rounding each factor to the nearest ten.`,
            `把两个因数都四舍五入到整十，估算 $${x} \\times ${y}$。`,
          ],
          rx * ry,
          [
            [
              ["Round both", "两个都凑整"],
              [`${x} rounds to ${rx} and ${y} rounds to ${ry}.`, `${x} 约等于 ${rx}，${y} 约等于 ${ry}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${rx} \\times ${ry} = ${fmt(rx * ry)}`]],
          ],
          [
            `The fact is $${rx / 10} \\times ${ry / 10} = ${(rx * ry) / 100}$, then two zeros: ${plain(rx * ry)}.`,
            `口诀是 $${rx / 10} \\times ${ry / 10} = ${(rx * ry) / 100}$，再添两个 0：${plain(rx * ry)}。`,
          ],
          [
            [x * y, "That is the exact product, not the estimate.", "这是准确的积，不是估算值。"],
            [rx * y, "That rounds only the first factor.", "这只把第一个因数凑了整。"],
            [(rx * ry) / 10, "That writes one zero too few.", "这少写了一个 0。"],
          ],
          { figure: estimateFigure(x * y, rx * ry) },
        );
      },
      estimateFigure(1976, 2000),
    ),
    point(
      "rounding-to-hundreds",
      ["Rounding to hundreds", "凑成整百"],
      [
        "For a three-digit factor, round it to the nearest hundred. Keep the one-digit factor. $412 \\times 7 \\approx 400 \\times 7 = 2{,}800$.\n\nCheck: $4 \\times 7 = 28$, then two zeros make 2,800.\n\n> **Watch out.** Round to hundreds, not tens, when the question says hundreds.",
        "三位数的因数，四舍五入到整百；一位数的因数不变。$412 \\times 7 \\approx 400 \\times 7 = 2{,}800$。\n\n检验：$4 \\times 7 = 28$，再添两个 0，得 2,800。\n\n> **注意。** 题目说凑成整百，就不要凑成整十。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(110, 980);
        while (n % 100 === 50 || n % 100 === 0 || round10(n) === round100(n));
        const a = rng.int(3, 9);
        const r = round100(n);
        return answered(
          [
            `Estimate $${n} \\times ${a}$ by rounding $${n}$ to the nearest hundred.`,
            `把 $${n}$ 四舍五入到整百，估算 $${n} \\times ${a}$。`,
          ],
          r * a,
          [
            [
              ["Round", "四舍五入"],
              [`${n} rounds to ${r}.`, `${n} 约等于 ${r}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${r} \\times ${a} = ${fmt(r * a)}`]],
          ],
          [
            `The exact product is $${n} \\times ${a} = ${fmt(n * a)}$, close to ${plain(r * a)}.`,
            `准确的积是 $${n} \\times ${a} = ${fmt(n * a)}$，接近 ${plain(r * a)}。`,
          ],
          [
            [n * a, "That is the exact product.", "这是准确的积。"],
            [round10(n) * a, "That rounds to the nearest ten.", "这是凑成了整十。"],
            [(r === n - (n % 100) ? r + 100 : n - (n % 100)) * a, `That rounds ${n} the wrong way.`, `这把 ${n} 凑错了方向。`],
          ],
          { figure: estimateFigure(n * a, r * a) },
        );
      },
      estimateFigure(2884, 2800),
    ),
  ],
};

// ---------------------------------------------------------------------------
// Multiplying with models and place value

/** splitModel draws a one-row area model of a × n with n split into its place parts, `hide` marking a cell shown as "?". */
const splitModel = (a: number, n: number, hide = -1, total = false): Figure => {
  const parts = places(n);
  return areaGridFigure(
    [String(a)],
    parts.map(plain),
    [parts.map((v, i) => (i === hide ? "?" : total ? plain(a * v) : plain(a * v)))],
    [1],
    parts.map((v) => Math.max(v, n / 6)),
  );
};

/** fourModel draws the four-part area model of x × y, `hide` marking a cell shown as "?". */
const fourModel = (x: number, y: number, hide = -1): Figure => {
  const xs = places(x);
  const ys = places(y);
  let k = -1;
  return areaGridFigure(
    xs.map(plain),
    ys.map(plain),
    xs.map((r) => ys.map((c) => (++k === hide ? "?" : plain(r * c)))),
    xs.map((v) => Math.max(v, x / 5)),
    ys.map((v) => Math.max(v, y / 5)),
  );
};

/** columnFigure writes n, the one-digit factor a and the product in a place-value chart, the way the standard algorithm lines them up. */
const columnFigure = (n: number, a: number, lit = -1): Figure => {
  const len = String(n * a).length;
  const pad = (v: number) =>
    String(v)
      .padStart(len, " ")
      .split("")
      .map((c) => c.trim());
  return placeChartFigure(placesOf(len), [pad(n), pad(a), pad(n * a)], lit);
};

/** partialList writes the partial products of a × n, one per place of n. */
const partialList = (a: number, n: number): string[] => places(n).map((v) => `${a} \\times ${fmt(v)} = ${fmt(a * v)}`);

export const twoDigitByOneDigitMultiplicationUsingAreaModels: TopicDef = {
  id: "two-digit-by-one-digit-multiplication-using-area-models",
  title: t("Two-Digit by One-Digit Multiplication Using Area Models", "用面积模型计算两位数乘一位数"),
  summary: t(
    "Multiply a two-digit number by a one-digit number by splitting a rectangle into tens and ones.",
    "把长方形分成整十部分和个位部分，计算两位数乘一位数。",
  ),
  intro: t(
    "A garden bed is 4 rows of 23 plants. Split 23 into 20 and 3. The bed becomes two smaller beds: $4 \\times 20 = 80$ and $4 \\times 3 = 12$. Together they have $80 + 12 = 92$ plants.\n\nCheck: $23 + 23 + 23 + 23 = 92$.\n\nIn this lesson we split a rectangle by place value to multiply.",
    "一块花圃有 4 行，每行 23 棵。把 23 分成 20 和 3，花圃就变成两小块：$4 \\times 20 = 80$，$4 \\times 3 = 12$。合起来是 $80 + 12 = 92$ 棵。\n\n检验：$23 + 23 + 23 + 23 = 92$。\n\n本课我们按数位把长方形分开来做乘法。",
  ),
  prerequisites: ["multiplying-numbers-ending-in-zeros"],
  encompasses: [{ topic: "multiplying-numbers-ending-in-zeros", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "parts-of-the-model",
      ["The parts of the model", "面积模型的各部分"],
      [
        "To multiply $4 \\times 23$, split 23 into 20 and 3. The rectangle splits into two parts. One part is $4 \\times 20 = 80$. The other is $4 \\times 3 = 12$.\n\nCheck: each part's area is its side times its side.\n\n> **Watch out.** Use the tens value, 20, not the digit 2.",
        "计算 $4 \\times 23$，把 23 分成 20 和 3，长方形也分成两部分：一部分是 $4 \\times 20 = 80$，另一部分是 $4 \\times 3 = 12$。\n\n检验：每部分的面积都是两条边相乘。\n\n> **注意。** 要用十位表示的 20，不是数字 2。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(12, 98);
        while (n % 10 === 0);
        const a = rng.int(3, 9);
        const hide = rng.int(0, 1);
        const side = places(n)[hide]!;
        return answered(
          [
            `The area model shows $${a} \\times ${n}$. What is the area of the part marked ?`,
            `面积模型表示 $${a} \\times ${n}$。标着 ? 的部分面积是多少？`,
          ],
          a * side,
          [
            [
              ["Read its sides", "读出两条边"],
              [`That part is ${a} by ${side}.`, `这一部分的两条边是 ${a} 和 ${side}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${a} \\times ${side} = ${a * side}`]],
          ],
          [
            `The two parts add to the whole: $${a * places(n)[0]!} + ${a * places(n)[1]!} = ${a * n}$, and $${a} \\times ${n} = ${a * n}$.`,
            `两部分合起来是整体：$${a * places(n)[0]!} + ${a * places(n)[1]!} = ${a * n}$，$${a} \\times ${n} = ${a * n}$。`,
          ],
          [
            [
              hide === 0 ? a * Math.floor(n / 10) : a * places(n)[0]!,
              hide === 0 ? "That uses the tens digit, not the tens value." : "That is the other part.",
              hide === 0 ? "这用了十位上的数字，不是它表示的值。" : "这是另一部分。",
            ],
            [a + side, "That adds the sides. Area multiplies them.", "这是把两条边相加，面积要相乘。"],
            [a * n, "That is the whole product, not one part.", "这是整个乘积，不是一部分。"],
          ],
          { figure: splitModel(a, n, hide) },
        );
      },
      splitModel(4, 23),
    ),
    point(
      "adding-the-parts",
      ["Adding the parts", "把各部分加起来"],
      [
        "Add the parts of the area model to get the whole product. $6 \\times 37$: $6 \\times 30 = 180$ and $6 \\times 7 = 42$. $180 + 42 = 222$.\n\nCheck: $6 \\times 37$ is close to $6 \\times 40 = 240$, and 222 is a little less.\n\n> **Watch out.** Add both parts. One part alone is not the product.",
        "把面积模型的各部分加起来就是整个积。$6 \\times 37$：$6 \\times 30 = 180$，$6 \\times 7 = 42$，$180 + 42 = 222$。\n\n检验：$6 \\times 37$ 接近 $6 \\times 40 = 240$，222 比它小一点。\n\n> **注意。** 两部分都要加上，只算一部分不是积。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(12, 98);
        while (n % 10 === 0);
        const a = rng.int(3, 9);
        const [t0, o0] = places(n) as [number, number];
        return answered(
          [`Use an area model to find $${a} \\times ${n}$.`, `用面积模型计算 $${a} \\times ${n}$。`],
          a * n,
          [
            [["Find the parts", "求各部分"], ["", ""], partialList(a, n)],
            [["Add them", "相加"], ["", ""], [`${a * t0} + ${a * o0} = ${a * n}`]],
          ],
          [
            `Add ${n} ${a} times: the total is ${a * n}. Or estimate: $${a} \\times ${round10(n)} = ${a * round10(n)}$ is close.`,
            `把 ${n} 加 ${a} 次，总数是 ${a * n}；也可以估算：$${a} \\times ${round10(n)} = ${a * round10(n)}$，很接近。`,
          ],
          [
            [a * t0, "That is only the tens part.", "这只是十位那一部分。"],
            [a * t0 + o0, "That forgets to multiply the ones.", "这忘了把个位也乘上。"],
            [a * Math.floor(n / 10) + a * o0, "That uses the tens digit, not the tens value.", "这用了十位上的数字，不是它表示的值。"],
          ],
          { figure: splitModel(a, n) },
        );
      },
      splitModel(6, 37),
    ),
  ],
};

export const multiDigitByOneDigitMultiplicationUsingAreaModels: TopicDef = {
  id: "multi-digit-by-one-digit-multiplication-using-area-models",
  title: t("Multi-Digit by One-Digit Multiplication Using Area Models", "用面积模型计算多位数乘一位数"),
  summary: t("Multiply a three- or four-digit number by a one-digit number with an area model.", "用面积模型计算三位数或四位数乘一位数。"),
  intro: t(
    "A theater has 3 floors with 245 seats on each. Split 245 into 200, 40 and 5. The parts are $3 \\times 200 = 600$, $3 \\times 40 = 120$ and $3 \\times 5 = 15$. In all, $600 + 120 + 15 = 735$ seats.\n\nCheck: $245 + 245 + 245 = 735$.\n\nIn this lesson we split bigger numbers into hundreds, tens and ones to multiply.",
    "剧院有 3 层，每层 245 个座位。把 245 分成 200、40 和 5，各部分是 $3 \\times 200 = 600$、$3 \\times 40 = 120$、$3 \\times 5 = 15$。一共 $600 + 120 + 15 = 735$ 个座位。\n\n检验：$245 + 245 + 245 = 735$。\n\n本课我们把较大的数分成百、十、一来做乘法。",
  ),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-area-models"],
  encompasses: [{ topic: "two-digit-by-one-digit-multiplication-using-area-models", weight: 0.8 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "hundreds-tens-and-ones",
      ["Hundreds, tens and ones", "百、十和一"],
      [
        "To multiply $3 \\times 245$, split 245 into 200, 40 and 5. Each part of the model is 3 times its piece: 600, 120 and 15.\n\nCheck: the pieces 200, 40 and 5 add back to 245.\n\n> **Watch out.** Multiply by the value of each digit: 40, not 4.",
        "计算 $3 \\times 245$，把 245 分成 200、40 和 5。模型的每部分是 3 乘对应的数：600、120 和 15。\n\n检验：200、40、5 合起来还是 245。\n\n> **注意。** 要乘每个数字表示的值：是 40，不是 4。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(112, 989);
        while (places(n).length < 3);
        const a = rng.int(3, 9);
        const hide = rng.int(0, 2);
        const side = places(n)[hide]!;
        const digit = side / 10 ** (2 - hide);
        return answered(
          [
            `The area model shows $${a} \\times ${n}$. What is the area of the part marked ?`,
            `面积模型表示 $${a} \\times ${n}$。标着 ? 的部分面积是多少？`,
          ],
          a * side,
          [
            [
              ["Read its sides", "读出两条边"],
              [`That part is ${a} by ${side}.`, `这一部分的两条边是 ${a} 和 ${side}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${a} \\times ${side} = ${fmt(a * side)}`]],
          ],
          [
            `All three parts add to the whole: $${places(n)
              .map((v) => fmt(a * v))
              .join(" + ")} = ${fmt(a * n)}$.`,
            `三部分合起来是整体：$${places(n)
              .map((v) => fmt(a * v))
              .join(" + ")} = ${fmt(a * n)}$。`,
          ],
          [
            [a * digit, "That uses the digit, not its value.", "这用了数字本身，不是它表示的值。"],
            [a + side, "That adds the sides. Area multiplies them.", "这是把两条边相加，面积要相乘。"],
            [a * n, "That is the whole product, not one part.", "这是整个乘积，不是一部分。"],
          ],
          { figure: splitModel(a, n, hide) },
        );
      },
      splitModel(3, 245),
    ),
    point(
      "multi-digit-products",
      ["Finding the whole product", "求出整个乘积"],
      [
        "Find each part, then add them all. $4 \\times 1{,}326$: the parts are 4,000, 1,200, 80 and 24. $4{,}000 + 1{,}200 + 80 + 24 = 5{,}304$.\n\nCheck: $4 \\times 1{,}326$ is close to $4 \\times 1{,}300 = 5{,}200$.\n\n> **Watch out.** Line up the parts by place when you add.",
        "先求出每一部分，再全部加起来。$4 \\times 1{,}326$：各部分是 4,000、1,200、80 和 24，$4{,}000 + 1{,}200 + 80 + 24 = 5{,}304$。\n\n检验：$4 \\times 1{,}326$ 接近 $4 \\times 1{,}300 = 5{,}200$。\n\n> **注意。** 相加时各部分要按数位对齐。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(112, 4999);
        while (places(n).length < 3);
        const a = rng.int(3, 9);
        const parts = places(n).map((v) => a * v);
        return answered(
          [`Use an area model to find $${a} \\times ${fmt(n)}$.`, `用面积模型计算 $${a} \\times ${fmt(n)}$。`],
          a * n,
          [
            [["Find the parts", "求各部分"], ["", ""], partialList(a, n)],
            [["Add them", "相加"], ["", ""], [`${parts.map(fmt).join(" + ")} = ${fmt(a * n)}`]],
          ],
          [
            `Estimate: $${a} \\times ${fmt(round100(n))} = ${fmt(a * round100(n))}$, close to ${plain(a * n)}.`,
            `估算：$${a} \\times ${fmt(round100(n))} = ${fmt(a * round100(n))}$，接近 ${plain(a * n)}。`,
          ],
          [
            [a * n - parts[parts.length - 1]!, "That leaves out the last part.", "这漏了最后一部分。"],
            [parts[0]!, "That is only the first part.", "这只是第一部分。"],
            [a * n + 10 * a, "One part is ten times too big.", "有一部分大了十倍。"],
          ],
          { figure: splitModel(a, n) },
        );
      },
      splitModel(4, 1326),
    ),
  ],
};

export const twoDigitByOneDigitMultiplicationUsingPlaceValue: TopicDef = {
  id: "two-digit-by-one-digit-multiplication-using-place-value",
  title: t("Two-Digit by One-Digit Multiplication Using Place Value", "用数位计算两位数乘一位数"),
  summary: t(
    "Multiply a two-digit number by a one-digit number with partial products and the standard algorithm.",
    "用部分积和竖式计算两位数乘一位数。",
  ),
  intro: t(
    "A baker makes 6 trays of 34 rolls. $6 \\times 30 = 180$ and $6 \\times 4 = 24$. So there are $180 + 24 = 204$ rolls. The standard way writes this in columns and carries the 2 tens from 24.\n\nCheck: $6 \\times 34$ is close to $6 \\times 30 = 180$, and a bit more.\n\nIn this lesson we multiply with partial products and with the standard algorithm.",
    "面包师做了 6 盘面包，每盘 34 个。$6 \\times 30 = 180$，$6 \\times 4 = 24$，一共 $180 + 24 = 204$ 个。竖式计算时，把 24 中的 2 个十进到十位。\n\n检验：$6 \\times 34$ 比 $6 \\times 30 = 180$ 多一点。\n\n本课我们用部分积和竖式来做乘法。",
  ),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-area-models"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "partial-products",
      ["Partial products", "部分积"],
      [
        "Multiply each place of the two-digit number by the one-digit number. These are the partial products. $6 \\times 34$: the tens give $6 \\times 30 = 180$ and the ones give $6 \\times 4 = 24$.\n\nCheck: $180 + 24 = 204 = 6 \\times 34$.\n\n> **Watch out.** The tens partial product uses 30, not 3.",
        "用一位数分别乘两位数的每一位，得到的就是部分积。$6 \\times 34$：十位得 $6 \\times 30 = 180$，个位得 $6 \\times 4 = 24$。\n\n检验：$180 + 24 = 204 = 6 \\times 34$。\n\n> **注意。** 十位的部分积要用 30，不是 3。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(12, 98);
        while (n % 10 === 0);
        const a = rng.int(3, 9);
        const tens = n - (n % 10);
        return answered(
          [
            `To find $${a} \\times ${n}$ with partial products, what is the partial product for the tens digit?`,
            `用部分积计算 $${a} \\times ${n}$，十位的部分积是多少？`,
          ],
          a * tens,
          [
            [
              ["Find the tens value", "找十位表示的值"],
              [`The tens digit of ${n} is worth ${tens}.`, `${n} 的十位表示 ${tens}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${a} \\times ${tens} = ${a * tens}`]],
          ],
          [
            `With the ones part $${a} \\times ${n % 10} = ${a * (n % 10)}$, the total is $${a * tens} + ${a * (n % 10)} = ${a * n} = ${a} \\times ${n}$.`,
            `加上个位部分 $${a} \\times ${n % 10} = ${a * (n % 10)}$，总数 $${a * tens} + ${a * (n % 10)} = ${a * n} = ${a} \\times ${n}$。`,
          ],
          [
            [a * (tens / 10), "That uses the digit, not its value.", "这用了数字本身，不是它表示的值。"],
            [a * (n % 10), "That is the ones partial product.", "这是个位的部分积。"],
            [a * n, "That is the whole product.", "这是整个乘积。"],
          ],
          { figure: splitModel(a, n, 0) },
        );
      },
      splitModel(6, 34, 0),
    ),
    point(
      "regrouping",
      ["Regrouping in the standard algorithm", "竖式中的进位"],
      [
        "In the standard algorithm, multiply the ones first. $6 \\times 34$: $6 \\times 4 = 24$. Write 4 in the ones and carry the 2 tens to the tens column.\n\nCheck: 24 is 2 tens and 4 ones.\n\n> **Watch out.** Carry the tens digit, not the ones digit.",
        "竖式计算时先乘个位。$6 \\times 34$：$6 \\times 4 = 24$，个位写 4，把 2 个十进到十位。\n\n检验：24 是 2 个十和 4 个一。\n\n> **注意。** 进位的是十位上的数字，不是个位上的。",
      ],
      (rng) => {
        let a: number;
        let n: number;
        let ones: number;
        do {
          n = rng.int(12, 98);
          a = rng.int(3, 9);
          ones = n % 10;
        } while (a * ones < 10 || (a * ones) % 10 === Math.floor((a * ones) / 10));
        const p = a * ones;
        return answered(
          [
            `In the standard algorithm for $${a} \\times ${n}$, you first find $${a} \\times ${ones} = ${p}$. What digit do you regroup to the tens column?`,
            `用竖式计算 $${a} \\times ${n}$，先算 $${a} \\times ${ones} = ${p}$。向十位进几？`,
          ],
          Math.floor(p / 10),
          [
            [
              ["Split the product", "拆开这个积"],
              [`${p} is ${Math.floor(p / 10)} tens and ${p % 10} ones.`, `${p} 是 ${Math.floor(p / 10)} 个十和 ${p % 10} 个一。`],
            ],
            [
              ["Write and carry", "写下并进位"],
              [
                `Write ${p % 10} in the ones. Carry ${Math.floor(p / 10)} to the tens.`,
                `个位写 ${p % 10}，向十位进 ${Math.floor(p / 10)}。`,
              ],
            ],
          ],
          [`$${Math.floor(p / 10)} \\times 10 + ${p % 10} = ${p}$.`, `$${Math.floor(p / 10)} \\times 10 + ${p % 10} = ${p}$。`],
          [
            [p % 10, "That is the ones digit, which stays in the ones column.", "这是个位数字，留在个位。"],
            [p, "That is the whole product of the ones.", "这是个位相乘的整个积。"],
            [Math.floor(n / 10), "That is the tens digit of the factor.", "这是因数十位上的数字。"],
          ],
          { figure: columnFigure(n, a, String(a * n).length - 2) },
        );
      },
      columnFigure(34, 6, 1),
    ),
    point(
      "standard-algorithm",
      ["The standard algorithm", "竖式计算"],
      [
        "Multiply the ones, write the ones digit and carry the tens. Then multiply the tens and add the carry. $6 \\times 34$: $6 \\times 4 = 24$, write 4, carry 2. $6 \\times 3 = 18$, and $18 + 2 = 20$. The product is 204.\n\nCheck: partial products give $180 + 24 = 204$.\n\n> **Watch out.** Add the carry after you multiply the tens, not before.",
        "先乘个位，写下个位数字，把十进上去；再乘十位，加上进位。$6 \\times 34$：$6 \\times 4 = 24$，写 4 进 2；$6 \\times 3 = 18$，$18 + 2 = 20$。积是 204。\n\n检验：用部分积，$180 + 24 = 204$。\n\n> **注意。** 先乘十位，再加进位，不能先加再乘。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(12, 98);
        while (n % 10 === 0);
        const a = rng.int(3, 9);
        const o = n % 10;
        const tn = Math.floor(n / 10);
        const carry = Math.floor((a * o) / 10);
        return answered(
          [`Use the standard algorithm to find $${a} \\times ${n}$.`, `用竖式计算 $${a} \\times ${n}$。`],
          a * n,
          [
            [
              ["Multiply the ones", "乘个位"],
              [`Write ${(a * o) % 10}, carry ${carry}.`, `写 ${(a * o) % 10}，进 ${carry}。`],
              [`${a} \\times ${o} = ${a * o}`],
            ],
            [
              ["Multiply the tens", "乘十位"],
              [`Add the carry: ${a * tn} + ${carry} = ${a * tn + carry}.`, `加上进位：${a * tn} + ${carry} = ${a * tn + carry}。`],
              [`${a} \\times ${tn} = ${a * tn}`],
            ],
          ],
          [`Partial products: $${a * tn * 10} + ${a * o} = ${a * n}$.`, `用部分积：$${a * tn * 10} + ${a * o} = ${a * n}$。`],
          [
            [
              carry > 0 ? a * n - carry * 10 : a * n + 10,
              carry > 0 ? "That forgets the carry." : "That carries 1 that is not there.",
              carry > 0 ? "这忘了加进位。" : "这多进了 1。",
            ],
            [a * (tn + carry) * 10 + ((a * o) % 10), "That adds the carry before multiplying the tens.", "这是先加进位再乘十位。"],
            [a * tn * 10 + a * o * 10, "That puts the ones product in the tens.", "这把个位的积写到了十位。"],
          ],
          { figure: columnFigure(n, a) },
        );
      },
      columnFigure(34, 6),
    ),
  ],
};

export const multiDigitByOneDigitMultiplicationUsingPlaceValue: TopicDef = {
  id: "multi-digit-by-one-digit-multiplication-using-place-value",
  title: t("Multi-Digit by One-Digit Multiplication Using Place Value", "用数位计算多位数乘一位数"),
  summary: t(
    "Multiply a three- or four-digit number by a one-digit number with the standard algorithm.",
    "用竖式计算三位数或四位数乘一位数。",
  ),
  intro: t(
    "A bus company drives 3 buses, each 1,264 km a month. In the standard algorithm, start with the ones: $3 \\times 4 = 12$, write 2, carry 1. Keep going place by place. The total is 3,792 km.\n\nCheck: $3 \\times 1{,}264$ is close to $3 \\times 1{,}300 = 3{,}900$.\n\nIn this lesson we use the standard algorithm with three-digit and four-digit numbers.",
    "一家公司有 3 辆公交车，每辆一个月跑 1,264 千米。竖式计算从个位开始：$3 \\times 4 = 12$，写 2 进 1，一位一位往左算，一共 3,792 千米。\n\n检验：$3 \\times 1{,}264$ 接近 $3 \\times 1{,}300 = 3{,}900$。\n\n本课我们用竖式计算三位数、四位数乘一位数。",
  ),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-place-value"],
  encompasses: [{ topic: "two-digit-by-one-digit-multiplication-using-place-value", weight: 0.8 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "three-digit-numbers",
      ["Three-digit numbers", "三位数乘一位数"],
      [
        "Work from right to left. Multiply each digit and add the carry from the place before. $4 \\times 237$: $4 \\times 7 = 28$, write 8, carry 2. $4 \\times 3 + 2 = 14$, write 4, carry 1. $4 \\times 2 + 1 = 9$. The product is 948.\n\nCheck: $800 + 120 + 28 = 948$.\n\n> **Watch out.** Each place may have its own carry. Do not reuse an old one.",
        "从右往左算，每一位相乘后加上前一位的进位。$4 \\times 237$：$4 \\times 7 = 28$，写 8 进 2；$4 \\times 3 + 2 = 14$，写 4 进 1；$4 \\times 2 + 1 = 9$。积是 948。\n\n检验：$800 + 120 + 28 = 948$。\n\n> **注意。** 每一位都有自己的进位，不要用错。",
      ],
      (rng) => {
        let n: number;
        do n = rng.int(112, 989);
        while (n % 10 === 0);
        const a = rng.int(3, 9);
        const parts = places(n).map((v) => a * v);
        return answered(
          [`Find $${a} \\times ${n}$.`, `计算 $${a} \\times ${n}$。`],
          a * n,
          [
            [["Multiply place by place", "一位一位地乘"], ["", ""], partialList(a, n)],
            [["Add", "相加"], ["", ""], [`${parts.map(fmt).join(" + ")} = ${fmt(a * n)}`]],
          ],
          [
            `Estimate: $${a} \\times ${round100(n)} = ${fmt(a * round100(n))}$, close to ${plain(a * n)}.`,
            `估算：$${a} \\times ${round100(n)} = ${fmt(a * round100(n))}$，接近 ${plain(a * n)}。`,
          ],
          [
            [noCarry(n, a), "That writes each product without carrying.", "这没有进位，直接写下每一位的积。"],
            [a * n - parts[parts.length - 1]!, "That leaves out the ones.", "这漏了个位。"],
            [a * n + 100, "That adds a carry twice.", "这把一个进位加了两次。"],
          ],
          { figure: columnFigure(n, a) },
        );
      },
      columnFigure(237, 4),
    ),
    point(
      "four-digit-numbers",
      ["Four-digit numbers", "四位数乘一位数"],
      [
        "A four-digit number works the same way, with one more place. $3 \\times 1{,}264$: ones $12$, write 2 carry 1. Tens $18 + 1 = 19$, write 9 carry 1. Hundreds $6 + 1 = 7$. Thousands $3$. The product is 3,792.\n\nCheck: $3{,}000 + 600 + 180 + 12 = 3{,}792$.\n\n> **Watch out.** When a place gives 0, still write the 0.",
        "四位数也一样，只是多一位。$3 \\times 1{,}264$：个位得 12，写 2 进 1；十位 $18 + 1 = 19$，写 9 进 1；百位 $6 + 1 = 7$；千位 3。积是 3,792。\n\n检验：$3{,}000 + 600 + 180 + 12 = 3{,}792$。\n\n> **注意。** 某一位得 0 时，也要写上 0。",
      ],
      (rng) => {
        const n = rng.int(1012, 2499);
        const a = rng.int(3, 9);
        const parts = places(n).map((v) => a * v);
        return answered(
          [`Find $${a} \\times ${fmt(n)}$.`, `计算 $${a} \\times ${fmt(n)}$。`],
          a * n,
          [
            [["Multiply place by place", "一位一位地乘"], ["", ""], partialList(a, n)],
            [["Add", "相加"], ["", ""], [`${parts.map(fmt).join(" + ")} = ${fmt(a * n)}`]],
          ],
          [
            `Estimate: $${a} \\times ${fmt(round100(n))} = ${fmt(a * round100(n))}$, close to ${plain(a * n)}.`,
            `估算：$${a} \\times ${fmt(round100(n))} = ${fmt(a * round100(n))}$，接近 ${plain(a * n)}。`,
          ],
          [
            [noCarry(n, a), "That writes each product without carrying.", "这没有进位，直接写下每一位的积。"],
            [a * n - parts[0]!, "That leaves out the thousands.", "这漏了千位。"],
            [a * n + 1000, "That adds a carry twice.", "这把一个进位加了两次。"],
          ],
          { figure: columnFigure(n, a) },
        );
      },
      columnFigure(1264, 3),
    ),
  ],
};

export const twoDigitByTwoDigitMultiplicationUsingAreaModels: TopicDef = {
  id: "two-digit-by-two-digit-multiplication-using-area-models",
  title: t("Two-Digit by Two-Digit Multiplication Using Area Models", "用面积模型计算两位数乘两位数"),
  summary: t("Multiply two two-digit numbers with an area model split into four parts.", "用分成四部分的面积模型计算两位数乘两位数。"),
  intro: t(
    "A wall has 23 rows of 14 tiles. Split both numbers: 23 is 20 and 3, and 14 is 10 and 4. The wall becomes four smaller parts: 200, 80, 30 and 12. In all, $200 + 80 + 30 + 12 = 322$ tiles.\n\nCheck: $23 \\times 14$ is close to $20 \\times 15 = 300$.\n\nIn this lesson we split both factors to make four parts.",
    "一面墙有 23 行瓷砖，每行 14 块。把两个数都分开：23 是 20 和 3，14 是 10 和 4。墙分成四小块：200、80、30 和 12。一共 $200 + 80 + 30 + 12 = 322$ 块。\n\n检验：$23 \\times 14$ 接近 $20 \\times 15 = 300$。\n\n本课我们把两个因数都分开，得到四部分。",
  ),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-area-models"],
  encompasses: [
    { topic: "two-digit-by-one-digit-multiplication-using-area-models", weight: 0.6 },
    { topic: "multiplying-numbers-ending-in-zeros", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "four-parts",
      ["Four parts", "四个部分"],
      [
        "Split both factors by place value. $23 \\times 14$: rows of 20 and 3, columns of 10 and 4. The four parts are $20 \\times 10 = 200$, $20 \\times 4 = 80$, $3 \\times 10 = 30$ and $3 \\times 4 = 12$.\n\nCheck: each part is its row times its column.\n\n> **Watch out.** There are four parts, not two. Each piece of one factor meets each piece of the other.",
        "把两个因数按数位分开。$23 \\times 14$：行分成 20 和 3，列分成 10 和 4。四部分是 $20 \\times 10 = 200$、$20 \\times 4 = 80$、$3 \\times 10 = 30$、$3 \\times 4 = 12$。\n\n检验：每部分都是它所在的行乘列。\n\n> **注意。** 是四部分，不是两部分。一个因数的每一块都要和另一个因数的每一块相乘。",
      ],
      (rng) => {
        let x: number;
        let y: number;
        do {
          x = rng.int(12, 98);
          y = rng.int(12, 98);
        } while (x % 10 === 0 || y % 10 === 0);
        const hide = rng.int(0, 3);
        const r = places(x)[Math.floor(hide / 2)]!;
        const c = places(y)[hide % 2]!;
        return answered(
          [
            `The area model shows $${x} \\times ${y}$. What is the area of the part marked ?`,
            `面积模型表示 $${x} \\times ${y}$。标着 ? 的部分面积是多少？`,
          ],
          r * c,
          [
            [
              ["Read its row and column", "读出所在的行和列"],
              [`The part is ${r} by ${c}.`, `这一部分是 ${r} 乘 ${c}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${r} \\times ${c} = ${fmt(r * c)}`]],
          ],
          [`All four parts add to $${x} \\times ${y} = ${fmt(x * y)}$.`, `四部分合起来是 $${x} \\times ${y} = ${fmt(x * y)}$。`],
          [
            [r + c, "That adds the sides. Area multiplies them.", "这是把两条边相加，面积要相乘。"],
            [
              (r >= 10 ? r / 10 : r) * (c >= 10 ? c / 10 : c),
              "That uses the digits, not their values.",
              "这用了数字本身，不是它们表示的值。",
            ],
            [x * y, "That is the whole product.", "这是整个乘积。"],
          ],
          { figure: fourModel(x, y, hide) },
        );
      },
      fourModel(23, 14),
    ),
    point(
      "adding-four-parts",
      ["Adding the four parts", "四部分相加"],
      [
        "Add all four parts to get the product. $23 \\times 14$: $200 + 80 + 30 + 12 = 322$.\n\nCheck: $23 \\times 14 = 23 \\times 10 + 23 \\times 4 = 230 + 92 = 322$.\n\n> **Watch out.** Add all four parts. Leaving out the small one, 12, is a common slip.",
        "把四部分都加起来就是积。$23 \\times 14$：$200 + 80 + 30 + 12 = 322$。\n\n检验：$23 \\times 14 = 23 \\times 10 + 23 \\times 4 = 230 + 92 = 322$。\n\n> **注意。** 四部分都要加上，最容易漏掉的是最小的 12。",
      ],
      (rng) => {
        let x: number;
        let y: number;
        do {
          x = rng.int(12, 98);
          y = rng.int(12, 98);
        } while (x % 10 === 0 || y % 10 === 0);
        const [xt, xo] = places(x) as [number, number];
        const [yt, yo] = places(y) as [number, number];
        const parts = [xt * yt, xt * yo, xo * yt, xo * yo];
        return answered(
          [`Use an area model to find $${x} \\times ${y}$.`, `用面积模型计算 $${x} \\times ${y}$。`],
          x * y,
          [
            [
              ["Find the four parts", "求四部分"],
              ["", ""],
              [
                `${xt} \\times ${yt} = ${fmt(parts[0]!)}`,
                `${xt} \\times ${yo} = ${parts[1]}`,
                `${xo} \\times ${yt} = ${parts[2]}`,
                `${xo} \\times ${yo} = ${parts[3]}`,
              ],
            ],
            [["Add them", "相加"], ["", ""], [`${parts.map(fmt).join(" + ")} = ${fmt(x * y)}`]],
          ],
          [
            `Split only one factor: $${x} \\times ${yt} + ${x} \\times ${yo} = ${fmt(x * yt)} + ${fmt(x * yo)} = ${fmt(x * y)}$.`,
            `只拆一个因数：$${x} \\times ${yt} + ${x} \\times ${yo} = ${fmt(x * yt)} + ${fmt(x * yo)} = ${fmt(x * y)}$。`,
          ],
          [
            [x * y - parts[3]!, "That leaves out the ones times ones part.", "这漏了个位乘个位那部分。"],
            [parts[0]! + parts[3]!, "That adds only two parts: tens times tens and ones times ones.", "这只加了两部分：十乘十和一乘一。"],
            [x * y - parts[1]!, "That leaves out one of the middle parts.", "这漏了中间的一部分。"],
          ],
          { figure: fourModel(x, y) },
        );
      },
      fourModel(23, 14),
    ),
  ],
};

export const twoDigitByTwoDigitMultiplicationUsingPlaceValue: TopicDef = {
  id: "two-digit-by-two-digit-multiplication-using-place-value",
  title: t("Two-Digit by Two-Digit Multiplication Using Place Value", "用数位计算两位数乘两位数"),
  summary: t(
    "Multiply two two-digit numbers by adding two partial products, as in the standard algorithm.",
    "像竖式那样，把两个部分积相加，计算两位数乘两位数。",
  ),
  intro: t(
    "A box has 36 rows of 24 beads. Split 24 into 20 and 4. $36 \\times 20 = 720$ and $36 \\times 4 = 144$. So the box has $720 + 144 = 864$ beads.\n\nCheck: $36 \\times 24$ is close to $40 \\times 20 = 800$.\n\nIn this lesson we multiply by the tens, multiply by the ones and add the partial products.",
    "一盒珠子有 36 行，每行 24 颗。把 24 分成 20 和 4：$36 \\times 20 = 720$，$36 \\times 4 = 144$。一共 $720 + 144 = 864$ 颗。\n\n检验：$36 \\times 24$ 接近 $40 \\times 20 = 800$。\n\n本课我们分别乘十位和个位，再把部分积相加。",
  ),
  prerequisites: ["two-digit-by-two-digit-multiplication-using-area-models", "two-digit-by-one-digit-multiplication-using-place-value"],
  encompasses: [{ topic: "two-digit-by-one-digit-multiplication-using-place-value", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    point(
      "multiplying-by-the-tens",
      ["Multiplying by the tens", "乘十位上的数"],
      [
        "To multiply by a two-digit number, split it into tens and ones. For $36 \\times 24$, first find $36 \\times 20$. That is $36 \\times 2 = 72$, then times 10: 720.\n\nCheck: $36 \\times 20 = 720$ and $720 \\div 20 = 36$.\n\n> **Watch out.** Multiply by 20, not 2. The answer ends in 0.",
        "乘两位数时，把它分成十位和个位。计算 $36 \\times 24$，先算 $36 \\times 20$：$36 \\times 2 = 72$，再乘 10，得 720。\n\n检验：$36 \\times 20 = 720$，$720 \\div 20 = 36$。\n\n> **注意。** 要乘 20，不是 2，积的末尾是 0。",
      ],
      (rng) => {
        let x: number;
        let y: number;
        do {
          x = rng.int(12, 98);
          y = rng.int(21, 98);
        } while (y % 10 === 0);
        const tens = y - (y % 10);
        return answered(
          [
            `To find $${x} \\times ${y}$, you add $${x} \\times ${tens}$ and $${x} \\times ${y % 10}$. What is $${x} \\times ${tens}$?`,
            `计算 $${x} \\times ${y}$ 时，要把 $${x} \\times ${tens}$ 和 $${x} \\times ${y % 10}$ 相加。$${x} \\times ${tens}$ 是多少？`,
          ],
          x * tens,
          [
            [["Use the digit", "先乘数字"], ["", ""], [`${x} \\times ${tens / 10} = ${x * (tens / 10)}`]],
            [["Times ten", "再乘 10"], ["", ""], [`${x * (tens / 10)} \\times 10 = ${fmt(x * tens)}`]],
          ],
          [`Divide back: $${fmt(x * tens)} \\div ${tens} = ${x}$.`, `除回去：$${fmt(x * tens)} \\div ${tens} = ${x}$。`],
          [
            [x * (tens / 10), "That multiplies by the digit, not by the tens.", "这只乘了数字，没乘十位表示的值。"],
            [x * (y % 10), "That is the ones partial product.", "这是个位的部分积。"],
            [x * y, "That is the whole product.", "这是整个乘积。"],
          ],
          {
            figure: areaGridFigure(
              [String(x)],
              [String(tens), String(y % 10)],
              [["?", plain(x * (y % 10))]],
              [1],
              [tens, Math.max(y % 10, tens / 4)],
            ),
          },
        );
      },
      areaGridFigure(["36"], ["20", "4"], [["720", "144"]], [1], [20, 5]),
    ),
    point(
      "adding-partial-products",
      ["Adding the partial products", "部分积相加"],
      [
        "Find both partial products and add them. $36 \\times 24$: $36 \\times 20 = 720$ and $36 \\times 4 = 144$. $720 + 144 = 864$.\n\nCheck: $36 \\times 24$ is close to $40 \\times 20 = 800$.\n\n> **Watch out.** The tens partial product ends in 0. Line it up by place before adding.",
        "求出两个部分积再相加。$36 \\times 24$：$36 \\times 20 = 720$，$36 \\times 4 = 144$，$720 + 144 = 864$。\n\n检验：$36 \\times 24$ 接近 $40 \\times 20 = 800$。\n\n> **注意。** 十位的部分积末尾是 0，相加前要按数位对齐。",
      ],
      (rng) => {
        let x: number;
        let y: number;
        do {
          x = rng.int(12, 98);
          y = rng.int(12, 98);
        } while (y % 10 === 0 || x % 10 === 0);
        const tens = y - (y % 10);
        const o = y % 10;
        return answered(
          [`Find $${x} \\times ${y}$.`, `计算 $${x} \\times ${y}$。`],
          x * y,
          [
            [
              ["Find the partial products", "求部分积"],
              ["", ""],
              [`${x} \\times ${tens} = ${fmt(x * tens)}`, `${x} \\times ${o} = ${x * o}`],
            ],
            [["Add", "相加"], ["", ""], [`${fmt(x * tens)} + ${x * o} = ${fmt(x * y)}`]],
          ],
          [
            `Swap the factors: $${y} \\times ${x - (x % 10)} + ${y} \\times ${x % 10} = ${fmt(y * (x - (x % 10)))} + ${y * (x % 10)} = ${fmt(x * y)}$.`,
            `交换因数：$${y} \\times ${x - (x % 10)} + ${y} \\times ${x % 10} = ${fmt(y * (x - (x % 10)))} + ${y * (x % 10)} = ${fmt(x * y)}$。`,
          ],
          [
            [x * (tens / 10) + x * o, "That multiplies by the tens digit, not the tens.", "这只乘了十位的数字，没乘十位表示的值。"],
            [x * tens, "That leaves out the ones partial product.", "这漏了个位的部分积。"],
            [(x - (x % 10)) * tens + (x % 10) * o, "That multiplies tens by tens and ones by ones only.", "这只算了十乘十和一乘一。"],
          ],
          {
            figure: areaGridFigure(
              [String(x)],
              [String(tens), String(o)],
              [[plain(x * tens), plain(x * o)]],
              [1],
              [tens, Math.max(o, tens / 4)],
            ),
          },
        );
      },
      areaGridFigure(["36"], ["20", "4"], [["720", "144"]], [1], [20, 5]),
    ),
  ],
};

// ---------------------------------------------------------------------------
// Dividing whole numbers

/** shareTape draws n cut into q pieces of d and a leftover piece of r, `lit` shading the asked part. */
const shareTape = (n: number, d: number, q: number, r: number, total = String(n)): Figure => {
  const shown = Math.min(q, 10);
  return tapeFigure(
    [
      {
        total,
        pieces: [
          ...Array.from({ length: shown }, () => ({ size: d, text: String(d) })),
          ...(q > shown ? [{ size: d * (q - shown), text: "…" }] : []),
          ...(r > 0 ? [{ size: Math.max(r, d / 3), text: String(r), lit: true }] : []),
        ],
      },
    ],
    [
      `A bar of ${n} cut into ${q} pieces of ${d}${r ? ` and a piece of ${r} left over` : ""}.`,
      `一个长条 ${n}，分成 ${q} 段 ${d}${r ? `，还剩一段 ${r}` : ""}。`,
    ],
  );
};

/** remainderLine marks n on a number line with hops of d, so the last multiple and the leftover show. */
const remainderLine = (n: number, d: number): Figure =>
  skipFigure(d, Math.floor(n / d) + (n % d ? 1 : 0), d * (Math.floor(n / d) + (n % d ? 1 : 0)), n);

export const relationshipBetweenMultiplicationAndDivision: TopicDef = {
  id: "relationship-between-multiplication-and-division",
  title: t("The Relationship Between Multiplication and Division", "乘法与除法的关系"),
  summary: t("Use fact families and multiplication facts to divide.", "利用一组相关的乘除算式和乘法口诀做除法。"),
  intro: t(
    "Sara puts 24 apples into 4 bags, the same number in each. How many in a bag? Think: 4 times what is 24? $4 \\times 6 = 24$, so each bag gets 6.\n\nCheck: $6 + 6 + 6 + 6 = 24$.\n\nIn this lesson we use multiplication facts to divide.",
    "萨拉把 24 个苹果平均装进 4 个袋子，每袋几个？想：4 乘几得 24？$4 \\times 6 = 24$，所以每袋 6 个。\n\n检验：$6 + 6 + 6 + 6 = 24$。\n\n本课我们用乘法口诀做除法。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.3.OA.B.6", "CCSS.3.OA.C.7"],
  knowledgePoints: [
    point(
      "fact-families",
      ["Fact families", "相关的乘除算式"],
      [
        "One multiplication fact gives two division facts. From $6 \\times 7 = 42$ we get $42 \\div 6 = 7$ and $42 \\div 7 = 6$. The product becomes the number we divide.\n\nCheck: in each fact, the same three numbers 6, 7 and 42 appear.\n\n> **Watch out.** In a division fact, the biggest number comes first.",
        "一个乘法算式能写出两个除法算式。由 $6 \\times 7 = 42$ 得到 $42 \\div 6 = 7$ 和 $42 \\div 7 = 6$。积变成了被除数。\n\n检验：每个算式里都是 6、7、42 这三个数。\n\n> **注意。** 除法算式里，最大的数写在最前面。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        let b = rng.int(2, 12);
        while (b === a) b = rng.int(2, 12);
        const p = a * b;
        return pickedMath(
          rng,
          [
            `$${a} \\times ${b} = ${p}$. Which division fact is in the same fact family?`,
            `$${a} \\times ${b} = ${p}$。哪个除法算式和它是一家？`,
          ],
          rng.bool() ? `${p} \\div ${a} = ${b}` : `${p} \\div ${b} = ${a}`,
          [
            [`${a} \\div ${b} = ${p}`, "That divides the small numbers. The product comes first.", "这是用小数除，积应该写在前面。"],
            [`${p} \\div ${a} = ${b + 1}`, `$${a} \\times ${b + 1}$ is not ${p}.`, `$${a} \\times ${b + 1}$ 不是 ${p}。`],
            [`${p} \\div ${b} = ${a + 1}`, `$${b} \\times ${a + 1}$ is not ${p}.`, `$${b} \\times ${a + 1}$ 不是 ${p}。`],
          ],
          [
            [
              ["Start from the product", "从积开始"],
              [`${p} is the product, so it is the number we divide.`, `${p} 是积，所以它是被除数。`],
            ],
            [
              ["Divide by a factor", "除以一个因数"],
              [`Dividing by one factor gives the other.`, `除以一个因数，得到另一个因数。`],
              [`${p} \\div ${a} = ${b}`],
            ],
          ],
          [`Multiply back: $${b} \\times ${a} = ${p}$.`, `乘回去：$${b} \\times ${a} = ${p}$。`],
          equalTape(a, String(b), String(p)),
        );
      },
      equalTape(6, "7", "42"),
    ),
    point(
      "dividing-with-multiplication-facts",
      ["Dividing with multiplication facts", "用乘法口诀做除法"],
      [
        "To find $56 \\div 8$, ask: 8 times what is 56? $8 \\times 7 = 56$. So $56 \\div 8 = 7$.\n\nCheck: $7 + 7 + 7 + 7 + 7 + 7 + 7 + 7 = 56$.\n\n> **Watch out.** The answer is the missing factor, not the product.",
        "计算 $56 \\div 8$，想：8 乘几得 56？$8 \\times 7 = 56$，所以 $56 \\div 8 = 7$。\n\n检验：8 个 7 相加是 56。\n\n> **注意。** 答案是未知的因数，不是积。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const q = rng.int(2, 12);
        const p = d * q;
        return answered(
          [`Find $${p} \\div ${d}$.`, `计算 $${p} \\div ${d}$。`],
          q,
          [
            [
              ["Ask the fact", "想口诀"],
              [`${d} times what is ${p}?`, `${d} 乘几得 ${p}？`],
            ],
            [["Find it", "找到它"], ["", ""], [`${d} \\times ${q} = ${p}`]],
          ],
          [`Count by ${d}s: ${q} hops reach ${p}.`, `按 ${d} 数，数 ${q} 次正好到 ${p}。`],
          [
            [q + 1, `$${d} \\times ${q + 1} = ${d * (q + 1)}$, too big.`, `$${d} \\times ${q + 1} = ${d * (q + 1)}$，太大了。`],
            [q - 1, `$${d} \\times ${q - 1} = ${d * (q - 1)}$, too small.`, `$${d} \\times ${q - 1} = ${d * (q - 1)}$，太小了。`],
            [p - d, "That subtracts instead of dividing.", "这是减法，不是除法。"],
          ],
          { figure: equalTape(d, "?", String(p)) },
        );
      },
      equalTape(8, "?", "56"),
    ),
    point(
      "missing-dividends",
      ["Missing numbers in division", "除法中的未知数"],
      [
        "In $\\square \\div 6 = 9$, the box is shared into 6 equal parts of 9. So the box is $6 \\times 9 = 54$.\n\nCheck: $54 \\div 6 = 9$.\n\n> **Watch out.** Multiply to find the number divided. Do not divide 9 by 6.",
        "$\\square \\div 6 = 9$ 表示方框里的数平均分成 6 份，每份 9。所以方框里是 $6 \\times 9 = 54$。\n\n检验：$54 \\div 6 = 9$。\n\n> **注意。** 求被除数要用乘法，不要用 9 除以 6。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const q = rng.int(2, 12);
        return answered(
          [`Find the missing number: $$\\square \\div ${d} = ${q}$$`, `求方框中的数：$$\\square \\div ${d} = ${q}$$`],
          d * q,
          [
            [
              ["See the parts", "看各份"],
              [`The box makes ${d} equal parts of ${q}.`, `方框里的数分成 ${d} 份，每份 ${q}。`],
            ],
            [["Multiply", "相乘"], ["", ""], [`${d} \\times ${q} = ${d * q}`]],
          ],
          [`Divide back: $${d * q} \\div ${d} = ${q}$.`, `除回去：$${d * q} \\div ${d} = ${q}$。`],
          [
            [d + q, "That adds. The number divided is the product.", "这是相加。被除数是两数的积。"],
            [Math.abs(q - d), "That subtracts. The number divided is the product.", "这是相减。被除数是两数的积。"],
            [d * (q + 1), "That is one part too many.", "这多了一份。"],
          ],
          { figure: equalTape(d, String(q), "?") },
        );
      },
      equalTape(6, "9", "?"),
    ),
  ],
};

export const understandingRemaindersUsingModels: TopicDef = {
  id: "understanding-remainders-using-models",
  title: t("Understanding Remainders Using Models", "用模型理解余数"),
  summary: t("Share counters into equal groups and see what is left over.", "把圆片平均分成若干组，看看剩下多少。"),
  intro: t(
    "Tom has 17 cookies and puts them on plates of 5. He fills 3 plates, using 15 cookies. 2 cookies are left over. They are not enough for another plate. The 2 is the remainder.\n\nCheck: $3 \\times 5 + 2 = 17$.\n\nIn this lesson we use pictures of equal groups to see the remainder.",
    "汤姆有 17 块饼干，每盘放 5 块。他放满了 3 盘，用了 15 块，还剩 2 块，不够再放一盘。这 2 块就是余数。\n\n检验：$3 \\times 5 + 2 = 17$。\n\n本课我们用平均分组的图来认识余数。",
  ),
  prerequisites: ["relationship-between-multiplication-and-division"],
  encompasses: [{ topic: "relationship-between-multiplication-and-division", weight: 0.3 }],
  xp: 8,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "reading-a-model",
      ["Reading a model", "看懂模型"],
      [
        "A picture of 17 split into groups of 5 shows 3 full groups and 2 left over. It shows $17 \\div 5 = 3$ R 2.\n\nCheck: 3 groups of 5 is 15, and 15 + 2 = 17.\n\n> **Watch out.** The group size is the number we divide by, not the number of groups.",
        "把 17 分成每组 5 的图，有 3 个满组，还剩 2 个，表示 $17 \\div 5 = 3$ 余 2。\n\n检验：3 组 5 是 15，15 + 2 = 17。\n\n> **注意。** 每组的个数是除数，不是组数。",
      ],
      (rng) => {
        const g = rng.int(3, 8);
        const q = rng.int(2, 6);
        const r = rng.int(1, g - 1);
        const n = g * q + r;
        return pickedMath(
          rng,
          [
            `${n} is put into groups of ${g}, as the bar shows. Which division does it show?`,
            `把 ${n} 每 ${g} 个分成一组，如图所示。它表示哪个除法？`,
          ],
          `${n} \\div ${g} = ${q} \\text{ R } ${r}`,
          [
            [
              `${n} \\div ${q} = ${g} \\text{ R } ${r}`,
              "That swaps the group size and the number of groups.",
              "这把每组个数和组数弄反了。",
            ],
            [`${n} \\div ${g} = ${q + 1}`, `The last group has only ${r}, so it is not full.`, `最后一组只有 ${r} 个，不是满组。`],
            [`${n} \\div ${g} = ${q} \\text{ R } ${g - r}`, `${r} are left, not ${g - r}.`, `剩下的是 ${r} 个，不是 ${g - r} 个。`],
          ],
          [
            [
              ["Count the full groups", "数满组"],
              [`There are ${q} full groups of ${g}.`, `有 ${q} 个满组，每组 ${g}。`],
            ],
            [
              ["Count the leftover", "数剩下的"],
              [`${r} are left over.`, `剩下 ${r} 个。`],
            ],
          ],
          [`$${q} \\times ${g} + ${r} = ${n}$.`, `$${q} \\times ${g} + ${r} = ${n}$。`],
          shareTape(n, g, q, r),
        );
      },
      shareTape(17, 5, 3, 2),
    ),
    point(
      "making-groups",
      ["Making equal groups", "平均分组"],
      [
        "Make groups of 4 from 23 counters. 5 groups use 20. 3 counters are left, too few for another group. So the remainder is 3.\n\nCheck: $5 \\times 4 + 3 = 23$.\n\n> **Watch out.** The leftover must be less than the group size, or you could make another group.",
        "把 23 个圆片每 4 个分一组。5 组用了 20 个，剩下 3 个，不够再分一组。所以余数是 3。\n\n检验：$5 \\times 4 + 3 = 23$。\n\n> **注意。** 剩下的一定比每组的个数少，不然还能再分一组。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(2, 8);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return answered(
          [`Put ${n} counters into groups of ${d}. How many counters are left over?`, `把 ${n} 个圆片每 ${d} 个分成一组。还剩几个？`],
          r,
          [
            [
              ["Make full groups", "分满组"],
              [`${q} groups of ${d} use ${d * q}.`, `${q} 组用了 ${d * q} 个。`],
              [`${q} \\times ${d} = ${d * q}`],
            ],
            [["Find what is left", "求剩下的"], ["", ""], [`${n} - ${d * q} = ${r}`]],
          ],
          [
            `${r} is less than ${d}, so no more groups can be made, and $${q} \\times ${d} + ${r} = ${n}$.`,
            `${r} 比 ${d} 小，不能再分一组，并且 $${q} \\times ${d} + ${r} = ${n}$。`,
          ],
          [
            [q, "That is the number of groups, not the leftover.", "这是组数，不是剩下的。"],
            [r + d, "That leftover is big enough for one more group.", "剩这么多还能再分一组。"],
            [d - r, "That is how many more would make another group.", "这是再要几个才能凑一组。"],
          ],
          { figure: shareTape(n, d, q, r) },
        );
      },
      shareTape(23, 4, 5, 3),
    ),
  ],
};

export const findingRemainders: TopicDef = {
  id: "finding-remainders",
  title: t("Finding Remainders", "求余数"),
  summary: t(
    "Find the remainder of a division with the largest multiple of the divisor that fits.",
    "找出不超过被除数的除数的最大倍数，求出余数。",
  ),
  intro: t(
    "A ribbon is 38 cm long. Lily cuts pieces of 6 cm. $6 \\times 6 = 36$ fits, but $6 \\times 7 = 42$ is too long. So she cuts 6 pieces, and 2 cm are left.\n\nCheck: $36 + 2 = 38$.\n\nIn this lesson we find the largest multiple that fits and the remainder.",
    "一条丝带长 38 厘米，莉莉每 6 厘米剪一段。$6 \\times 6 = 36$ 不超过，$6 \\times 7 = 42$ 太长了。所以她剪了 6 段，还剩 2 厘米。\n\n检验：$36 + 2 = 38$。\n\n本课我们找不超过一个数的最大倍数，并求余数。",
  ),
  prerequisites: ["understanding-remainders-using-models"],
  encompasses: [{ topic: "understanding-remainders-using-models", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "largest-multiple-that-fits",
      ["The largest multiple that fits", "不超过它的最大倍数"],
      [
        "To divide 38 by 6, first find the largest multiple of 6 that is not more than 38. $6 \\times 6 = 36$ fits. $6 \\times 7 = 42$ is too big. So the answer is 36.\n\nCheck: $38 - 36 = 2$, which is less than 6.\n\n> **Watch out.** The multiple cannot be bigger than the number. 42 is too big.",
        "38 除以 6，先找不超过 38 的 6 的最大倍数。$6 \\times 6 = 36$ 可以，$6 \\times 7 = 42$ 太大。所以是 36。\n\n检验：$38 - 36 = 2$，比 6 小。\n\n> **注意。** 倍数不能比这个数大，42 太大了。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 11);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return answered(
          [`What is the largest multiple of $${d}$ that is not more than $${n}$?`, `不超过 $${n}$ 的 $${d}$ 的最大倍数是多少？`],
          d * q,
          [
            [
              ["Try the facts", "试口诀"],
              [
                `$${d} \\times ${q} = ${d * q}$ fits, but $${d} \\times ${q + 1} = ${d * (q + 1)}$ is more than ${n}.`,
                `$${d} \\times ${q} = ${d * q}$ 不超过，$${d} \\times ${q + 1} = ${d * (q + 1)}$ 超过了 ${n}。`,
              ],
            ],
            [
              ["Pick the largest", "选最大的"],
              [`So the largest is ${d * q}.`, `所以最大的是 ${d * q}。`],
            ],
          ],
          [
            `$${n} - ${d * q} = ${r}$, and ${r} is less than ${d}, so no bigger multiple fits.`,
            `$${n} - ${d * q} = ${r}$，${r} 比 ${d} 小，所以放不下更大的倍数。`,
          ],
          [
            [d * (q + 1), `That is more than ${n}.`, `这比 ${n} 大。`],
            [d * (q - 1), `That fits, but ${d * q} is larger and still fits.`, `这不超过，但 ${d * q} 更大也不超过。`],
            [q, "That is how many times, not the multiple.", "这是倍数的个数，不是那个倍数。"],
          ],
          { figure: remainderLine(n, d) },
        );
      },
      remainderLine(38, 6),
    ),
    point(
      "the-remainder",
      ["The remainder", "余数"],
      [
        "The remainder is what is left after the largest multiple that fits. 38 divided by 6: the largest multiple is 36, so the remainder is $38 - 36 = 2$.\n\nCheck: $6 \\times 6 + 2 = 38$.\n\n> **Watch out.** A remainder is always less than the number you divide by.",
        "余数是减去最大的倍数后剩下的数。38 除以 6：最大倍数是 36，余数是 $38 - 36 = 2$。\n\n检验：$6 \\times 6 + 2 = 38$。\n\n> **注意。** 余数一定比除数小。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 11);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return answered(
          [`What is the remainder when $${n}$ is divided by $${d}$?`, `$${n}$ 除以 $${d}$ 的余数是多少？`],
          r,
          [
            [["Find the largest multiple", "找最大倍数"], ["", ""], [`${d} \\times ${q} = ${d * q}`]],
            [["Subtract", "相减"], ["", ""], [`${n} - ${d * q} = ${r}`]],
          ],
          [`$${d} \\times ${q} + ${r} = ${n}$, and ${r} is less than ${d}.`, `$${d} \\times ${q} + ${r} = ${n}$，并且 ${r} 比 ${d} 小。`],
          [
            [q, "That is the quotient, not the remainder.", "这是商，不是余数。"],
            [r + d, `That is not less than ${d}. One more group fits.`, `这不比 ${d} 小，还能再分一组。`],
            [d - r, "That is how far it is to the next multiple.", "这是离下一个倍数还差多少。"],
          ],
          { figure: remainderLine(n, d) },
        );
      },
      remainderLine(38, 6),
    ),
  ],
};

export const dividendsDivisorsQuotientsAndRemainders: TopicDef = {
  id: "dividends-divisors-quotients-and-remainders",
  title: t("Dividends, Divisors, Quotients, and Remainders", "被除数、除数、商和余数"),
  summary: t(
    "Name the parts of a division and use dividend = divisor × quotient + remainder.",
    "说出除法各部分的名称，并运用 被除数 = 除数 × 商 + 余数。",
  ),
  intro: t(
    "Max shares 29 stickers among 4 friends. Each gets 7, and 1 is left. We write $29 \\div 4 = 7$ R 1. 29 is the dividend, 4 is the divisor, 7 is the quotient and 1 is the remainder.\n\nCheck: $4 \\times 7 + 1 = 29$.\n\nIn this lesson we name the parts of a division and use them to check it.",
    "马克斯把 29 张贴纸分给 4 个朋友，每人 7 张，还剩 1 张，写作 $29 \\div 4 = 7$ 余 1。29 是被除数，4 是除数，7 是商，1 是余数。\n\n检验：$4 \\times 7 + 1 = 29$。\n\n本课我们认识除法各部分的名称，并用它们检验除法。",
  ),
  prerequisites: ["finding-remainders"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "naming-the-parts",
      ["Naming the parts", "各部分的名称"],
      [
        "In $29 \\div 4 = 7$ R 1, the number shared, 29, is the dividend. The number we divide by, 4, is the divisor. The answer, 7, is the quotient. What is left, 1, is the remainder.\n\nCheck: dividend = divisor × quotient + remainder: $4 \\times 7 + 1 = 29$.\n\n> **Watch out.** The divisor comes after the ÷ sign, not before.",
        "在 $29 \\div 4 = 7$ 余 1 中，被分的 29 是被除数，用来除的 4 是除数，结果 7 是商，剩下的 1 是余数。\n\n检验：被除数 = 除数 × 商 + 余数：$4 \\times 7 + 1 = 29$。\n\n> **注意。** 除数在除号后面，不在前面。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        let q = rng.int(3, 12);
        while (q === d) q = rng.int(3, 12);
        let r = rng.int(1, d - 1);
        while (r === q || r === d) r = rng.int(1, d - 1);
        const n = d * q + r;
        const roles: [Pair, number][] = [
          [["dividend", "被除数"], n],
          [["divisor", "除数"], d],
          [["quotient", "商"], q],
          [["remainder", "余数"], r],
        ];
        const k = rng.int(0, 3);
        const [name, value] = roles[k]!;
        const why: Record<number, Pair> = {
          [n]: ["That is the dividend, the number shared.", "这是被除数，被分的数。"],
          [d]: ["That is the divisor, after the ÷ sign.", "这是除数，在除号后面。"],
          [q]: ["That is the quotient, the answer.", "这是商，是结果。"],
          [r]: ["That is the remainder, what is left.", "这是余数，是剩下的。"],
        };
        return pickedMath(
          rng,
          [
            `In $${n} \\div ${d} = ${q} \\text{ R } ${r}$, which number is the ${name[0]}?`,
            `在 $${n} \\div ${d} = ${q} \\cdots\\cdots ${r}$ 中，哪个数是${name[1]}？`,
          ],
          String(value),
          roles.filter((_, i) => i !== k).map(([, v]): [string, string, string] => [String(v), why[v]![0], why[v]![1]]),
          [
            [
              ["Find the ÷ sign", "找除号"],
              ["The dividend is before it, the divisor after it.", "除号前是被除数，除号后是除数。"],
            ],
            [
              ["Read the answer side", "看等号右边"],
              ["The quotient comes first, then the remainder.", "先是商，再是余数。"],
            ],
          ],
          [
            `$${d} \\times ${q} + ${r} = ${n}$: divisor times quotient plus remainder is the dividend.`,
            `$${d} \\times ${q} + ${r} = ${n}$：除数乘商加余数等于被除数。`,
          ],
          shareTape(n, d, q, r),
        );
      },
      shareTape(29, 4, 7, 1),
    ),
    point(
      "finding-the-dividend",
      ["Finding the dividend", "求被除数"],
      [
        "The dividend is the divisor times the quotient, plus the remainder. Divisor 6, quotient 8, remainder 5: $6 \\times 8 + 5 = 53$.\n\nCheck: $53 \\div 6 = 8$ R 5.\n\n> **Watch out.** Do not forget to add the remainder.",
        "被除数 = 除数 × 商 + 余数。除数 6，商 8，余数 5：$6 \\times 8 + 5 = 53$。\n\n检验：$53 \\div 6 = 8$ 余 5。\n\n> **注意。** 别忘了加上余数。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 15);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return answered(
          [
            `A division has divisor $${d}$, quotient $${q}$ and remainder $${r}$. What is the dividend?`,
            `一个除法算式，除数是 $${d}$，商是 $${q}$，余数是 $${r}$。被除数是多少？`,
          ],
          n,
          [
            [["Multiply", "相乘"], ["", ""], [`${d} \\times ${q} = ${d * q}`]],
            [["Add the remainder", "加余数"], ["", ""], [`${d * q} + ${r} = ${n}`]],
          ],
          [`Divide back: $${n} \\div ${d} = ${q}$ R ${r}.`, `除回去：$${n} \\div ${d} = ${q}$ 余 ${r}。`],
          [
            [d * q, "That forgets the remainder.", "这忘了加余数。"],
            [d * q - r, "That subtracts the remainder instead of adding it.", "这减去了余数，应该加上。"],
            [d * (q + r), "That multiplies the remainder too.", "这把余数也乘了。"],
          ],
          { figure: shareTape(n, d, q, r, "?") },
        );
      },
      shareTape(53, 6, 8, 5, "?"),
    ),
    point(
      "checking-a-division",
      ["Checking a division", "检验除法"],
      [
        "To check a division, multiply the quotient by the divisor and add the remainder. You should get the dividend. Is $45 \\div 7 = 6$ R 3 right? $7 \\times 6 + 3 = 45$. Yes.\n\nCheck: the remainder 3 is less than 7, too.\n\n> **Watch out.** Also check that the remainder is less than the divisor.",
        "检验除法：用商乘除数，再加余数，应该等于被除数。$45 \\div 7 = 6$ 余 3 对吗？$7 \\times 6 + 3 = 45$，对。\n\n检验：余数 3 也比 7 小。\n\n> **注意。** 还要看余数是否比除数小。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        const kind = rng.int(0, 2);
        const [sq, sr] = kind === 0 ? [q, r] : kind === 1 ? [q, r + 1 < d ? r + 1 : r - 1] : [q - 1, r + d];
        const right = kind === 0;
        const yesP: Pair = ["Yes", "对"];
        const noP: Pair = ["No", "不对"];
        const back = d * sq + sr;
        return picked(
          rng,
          [
            `Is this division correct? $${n} \\div ${d} = ${sq} \\text{ R } ${sr}$`,
            `这个除法算式正确吗？$${n} \\div ${d} = ${sq} \\cdots\\cdots ${sr}$`,
          ],
          right ? yesP : noP,
          [
            right
              ? [
                  noP,
                  `$${d} \\times ${sq} + ${sr} = ${n}$, and ${sr} is less than ${d}.`,
                  `$${d} \\times ${sq} + ${sr} = ${n}$，并且 ${sr} 比 ${d} 小。`,
                ]
              : kind === 1
                ? [yesP, `$${d} \\times ${sq} + ${sr} = ${back}$, not ${n}.`, `$${d} \\times ${sq} + ${sr} = ${back}$，不是 ${n}。`]
                : [yesP, `The remainder ${sr} is not less than ${d}.`, `余数 ${sr} 不比 ${d} 小。`],
          ],
          [
            [["Multiply and add", "乘再加"], ["", ""], [`${d} \\times ${sq} + ${sr} = ${back}`]],
            [
              ["Compare", "比较"],
              right
                ? [`That is ${n}, and ${sr} < ${d}. It is correct.`, `正是 ${n}，且 ${sr} < ${d}，正确。`]
                : kind === 1
                  ? [`That is not ${n}. It is wrong.`, `不是 ${n}，不正确。`]
                  : [`It makes ${n}, but ${sr} is not less than ${d}. It is wrong.`, `虽然得 ${n}，但 ${sr} 不比 ${d} 小，不正确。`],
            ],
          ],
          [`Divide: $${n} \\div ${d} = ${q}$ R ${r}.`, `直接除：$${n} \\div ${d} = ${q}$ 余 ${r}。`],
          shareTape(n, d, q, r),
        );
      },
      shareTape(45, 7, 6, 3),
    ),
  ],
};

export const divisionWithRemainders: TopicDef = {
  id: "division-with-remainders",
  title: t("Division With Remainders", "有余数的除法"),
  summary: t("Find the quotient and the remainder of a division by a one-digit number.", "求除数是一位数的除法的商和余数。"),
  intro: t(
    "47 children line up in teams of 5. $5 \\times 9 = 45$, so there are 9 teams. 2 children are left over. We write $47 \\div 5 = 9$ R 2.\n\nCheck: $5 \\times 9 + 2 = 47$.\n\nIn this lesson we find the quotient and the remainder of a division.",
    "47 个孩子每 5 人一队。$5 \\times 9 = 45$，所以有 9 队，还剩 2 个孩子，写作 $47 \\div 5 = 9$ 余 2。\n\n检验：$5 \\times 9 + 2 = 47$。\n\n本课我们求除法的商和余数。",
  ),
  prerequisites: ["dividends-divisors-quotients-and-remainders"],
  encompasses: [
    { topic: "dividends-divisors-quotients-and-remainders", weight: 0.2 },
    { topic: "finding-remainders", weight: 0.8 },
  ],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "finding-the-quotient",
      ["Finding the quotient", "求商"],
      [
        "The quotient is how many full groups fit. $47 \\div 5$: $5 \\times 9 = 45$ fits, $5 \\times 10 = 50$ is too big. The quotient is 9.\n\nCheck: $47 - 45 = 2$, less than 5.\n\n> **Watch out.** Do not round up. 10 groups of 5 would need 50.",
        "商是能分出几个满组。$47 \\div 5$：$5 \\times 9 = 45$ 不超过，$5 \\times 10 = 50$ 太大，商是 9。\n\n检验：$47 - 45 = 2$，比 5 小。\n\n> **注意。** 不要往大里凑，10 组要 50 个。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return answered(
          [`What is the quotient of $${n} \\div ${d}$? (There is a remainder.)`, `$${n} \\div ${d}$ 的商是多少？（有余数。）`],
          q,
          [
            [
              ["Find the largest multiple", "找最大倍数"],
              [
                `$${d} \\times ${q} = ${d * q}$ fits. $${d} \\times ${q + 1} = ${d * (q + 1)}$ is too big.`,
                `$${d} \\times ${q} = ${d * q}$ 不超过，$${d} \\times ${q + 1} = ${d * (q + 1)}$ 太大。`,
              ],
            ],
            [
              ["Read the quotient", "读出商"],
              [`The quotient is ${q}.`, `商是 ${q}。`],
            ],
          ],
          [`$${d} \\times ${q} + ${r} = ${n}$ with remainder ${r} < ${d}.`, `$${d} \\times ${q} + ${r} = ${n}$，余数 ${r} < ${d}。`],
          [
            [q + 1, `$${d} \\times ${q + 1}$ is more than ${n}.`, `$${d} \\times ${q + 1}$ 比 ${n} 大。`],
            [r, "That is the remainder.", "这是余数。"],
            [d * q, "That is the multiple, not the quotient.", "这是倍数，不是商。"],
          ],
          { figure: shareTape(n, d, q, r) },
        );
      },
      shareTape(47, 5, 9, 2),
    ),
    point(
      "quotient-and-remainder",
      ["The quotient and the remainder", "商和余数"],
      [
        "Find the quotient, then the remainder. $47 \\div 5$: the quotient is 9, using 45. The remainder is $47 - 45 = 2$. So $47 \\div 5 = 9$ R 2.\n\nCheck: $5 \\times 9 + 2 = 47$.\n\n> **Watch out.** If the remainder is as big as the divisor, the quotient is too small.",
        "先求商，再求余数。$47 \\div 5$：商是 9，用了 45；余数是 $47 - 45 = 2$。所以 $47 \\div 5 = 9$ 余 2。\n\n检验：$5 \\times 9 + 2 = 47$。\n\n> **注意。** 如果余数和除数一样大或更大，说明商小了。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return pickedMath(
          rng,
          [`Find $${n} \\div ${d}$.`, `计算 $${n} \\div ${d}$。`],
          `${q} \\text{ R } ${r}`,
          [
            [`${q - 1} \\text{ R } ${r + d}`, `The remainder ${r + d} is not less than ${d}.`, `余数 ${r + d} 不比 ${d} 小。`],
            [`${q + 1} \\text{ R } ${r}`, `$${d} \\times ${q + 1}$ is more than ${n}.`, `$${d} \\times ${q + 1}$ 比 ${n} 大。`],
            [`${q} \\text{ R } ${d - r}`, `$${d} \\times ${q} + ${d - r}$ is not ${n}.`, `$${d} \\times ${q} + ${d - r}$ 不是 ${n}。`],
          ].filter(([s]) => s !== `${q} \\text{ R } ${r}`) as [string, string, string][],
          [
            [["Find the quotient", "求商"], ["", ""], [`${d} \\times ${q} = ${d * q}`]],
            [["Find the remainder", "求余数"], ["", ""], [`${n} - ${d * q} = ${r}`]],
          ],
          [`$${d} \\times ${q} + ${r} = ${n}$, and ${r} < ${d}.`, `$${d} \\times ${q} + ${r} = ${n}$，${r} < ${d}。`],
          shareTape(n, d, q, r),
        );
      },
      shareTape(47, 5, 9, 2),
    ),
  ],
};

const roundUpContexts: readonly Context[] = [
  {
    en: (n, d) =>
      `$${n}$ students are going on a trip. Each car can carry $${d}$ students. How many cars are needed to carry all the students?`,
    zh: (n, d) => `$${n}$ 名学生去郊游，每辆车最多坐 $${d}$ 名学生。至少需要多少辆车才能坐下所有学生？`,
  },
  {
    en: (n, d) => `A class has $${n}$ books to pack. Each box holds $${d}$ books. How many boxes are needed to pack all the books?`,
    zh: (n, d) => `班里有 $${n}$ 本书要装箱，每个箱子最多装 $${d}$ 本。至少需要多少个箱子才能装下所有的书？`,
  },
  {
    en: (n, d) => `$${n}$ people come to a party. Each table seats $${d}$ people. How many tables are needed so that everyone has a seat?`,
    zh: (n, d) => `$${n}$ 人参加聚会，每张桌子坐 $${d}$ 人。至少需要多少张桌子才能让每个人都有座位？`,
  },
];

const dropContexts: readonly Context[] = [
  {
    en: (n, d) => `A baker has $${n}$ muffins and puts $${d}$ in each box. How many boxes can she fill?`,
    zh: (n, d) => `面包师有 $${n}$ 个松饼，每盒装 $${d}$ 个。她能装满多少盒？`,
  },
  {
    en: (n, d) => `A ribbon is $${n}$ cm long. Leo cuts pieces $${d}$ cm long from it. How many whole pieces can Leo cut?`,
    zh: (n, d) => `一根丝带长 $${n}$ 厘米，小乐从中剪下每段长 $${d}$ 厘米的丝带。最多能剪出多少整段？`,
  },
  {
    en: (n, d) => `Mia has $${n}$ dollars. A ticket costs $${d}$ dollars. How many tickets can she buy?`,
    zh: (n, d) => `米娅有 $${n}$ 元，一张票 $${d}$ 元。她最多能买多少张票？`,
  },
];

const leftoverContexts: readonly Context[] = [
  {
    en: (n, d) => `$${n}$ stickers are shared equally among $${d}$ friends, as many as possible each. How many stickers are left over?`,
    zh: (n, d) => `$${n}$ 张贴纸平均分给 $${d}$ 个朋友，每人尽量多分。还剩多少张？`,
  },
  {
    en: (n, d) =>
      `A farmer puts $${n}$ eggs into cartons of $${d}$. How many eggs are left over after filling as many cartons as possible?`,
    zh: (n, d) => `农夫把 $${n}$ 个鸡蛋装进每盒 $${d}$ 个的蛋盒，尽量装满。装完后还剩多少个鸡蛋？`,
  },
  {
    en: (n, d) => `$${n}$ players are split into teams of $${d}$. How many players are left without a full team?`,
    zh: (n, d) => `$${n}$ 名队员每 $${d}$ 人组成一队，组不成整队的有多少人？`,
  },
];

/** remainderProblem draws n = d·q + r with a nonzero remainder for a word problem. */
function remainderProblem(rng: Rng): [number, number, number, number] {
  const d = rng.int(3, 9);
  const q = rng.int(3, 12);
  const r = rng.int(1, d - 1);
  return [d * q + r, d, q, r];
}

export const interpretingRemaindersInContext: TopicDef = {
  id: "interpreting-remainders-in-context",
  title: t("Interpreting Remainders in Context", "根据情境理解余数"),
  summary: t(
    "Decide whether a word problem needs the quotient, the quotient plus one, or the remainder.",
    "判断应用题的答案是商、商加一，还是余数。",
  ),
  intro: t(
    "26 students go on a trip in cars of 4. $26 \\div 4 = 6$ R 2. 6 cars carry 24 students, but 2 still need a ride. So 7 cars are needed. The story tells us what to do with the remainder.\n\nCheck: $7 \\times 4 = 28$, enough for 26.\n\nIn this lesson we decide whether the answer is the quotient, one more, or the remainder.",
    "26 名学生坐车去郊游，每辆车坐 4 人。$26 \\div 4 = 6$ 余 2。6 辆车坐 24 人，还有 2 人没车坐，所以要 7 辆车。余数怎么用，要看题目说的事情。\n\n检验：$7 \\times 4 = 28$，够坐 26 人。\n\n本课我们判断答案是商、商加一，还是余数。",
  ),
  prerequisites: ["division-with-remainders"],
  encompasses: [{ topic: "division-with-remainders", weight: 0.7 }],
  xp: 12,
  standards: ["CCSS.4.OA.A.3"],
  knowledgePoints: [
    point(
      "rounding-the-quotient-up",
      ["When to round up", "什么时候要加一"],
      [
        "26 students ride in cars of 4. $26 \\div 4 = 6$ R 2. The 2 left over still need a car. So 7 cars are needed.\n\nCheck: 6 cars hold only 24, fewer than 26.\n\n> **Watch out.** When everything must fit, the leftover needs one more group.",
        "26 名学生坐车，每辆坐 4 人。$26 \\div 4 = 6$ 余 2，剩下的 2 人也要坐车，所以要 7 辆。\n\n检验：6 辆只能坐 24 人，不够 26 人。\n\n> **注意。** 全部都要装下时，剩下的还要再加一组。",
      ],
      (rng) => {
        const [n, d, q, r] = remainderProblem(rng);
        const c = rng.pick(roundUpContexts);
        return answered(
          [c.en(n, d), c.zh(n, d)],
          q + 1,
          [
            [["Divide", "相除"], ["", ""], [`${n} \\div ${d} = ${q} \\text{ R } ${r}`]],
            [
              ["Fit the leftover", "装下剩下的"],
              [
                `${q} groups hold ${d * q}. The other ${r} need one more: ${q + 1}.`,
                `${q} 组装 ${d * q}，剩下的 ${r} 还要一组：${q + 1}。`,
              ],
            ],
          ],
          [
            `${q + 1} groups hold $${q + 1} \\times ${d} = ${(q + 1) * d}$, enough for ${n}. ${q} would hold only ${d * q}.`,
            `${q + 1} 组能装 $${q + 1} \\times ${d} = ${(q + 1) * d}$，够装 ${n}；${q} 组只能装 ${d * q}。`,
          ],
          [
            [q, `That leaves ${r} without a place.`, `这样有 ${r} 个没地方放。`],
            [r, "That is the remainder, not the number of groups.", "这是余数，不是组数。"],
            [q + r, "That adds the remainder to the quotient.", "这把余数加到了商上。"],
          ],
          { figure: shareTape(n, d, q, r) },
        );
      },
      shareTape(26, 4, 6, 2),
    ),
    point(
      "ignoring-the-remainder",
      ["When to ignore the remainder", "什么时候不管余数"],
      [
        "A bag of beads makes necklaces of 8. With 30 beads, $30 \\div 8 = 3$ R 6. Only 3 whole necklaces can be made. The 6 extra beads are not enough for one more.\n\nCheck: a 4th necklace would need 32 beads.\n\n> **Watch out.** When the question asks for full groups, drop the remainder.",
        "每条项链要 8 颗珠子。30 颗珠子：$30 \\div 8 = 3$ 余 6，只能串 3 条完整的项链，多出的 6 颗不够再串一条。\n\n检验：串第 4 条要 32 颗。\n\n> **注意。** 问能做成几个完整的，就不管余数。",
      ],
      (rng) => {
        const [n, d, q, r] = remainderProblem(rng);
        const c = rng.pick(dropContexts);
        return answered(
          [c.en(n, d), c.zh(n, d)],
          q,
          [
            [["Divide", "相除"], ["", ""], [`${n} \\div ${d} = ${q} \\text{ R } ${r}`]],
            [
              ["Count the full groups", "数完整的组"],
              [`The ${r} left over cannot make a full group, so the answer is ${q}.`, `剩下的 ${r} 不够一组，所以答案是 ${q}。`],
            ],
          ],
          [
            `One more would need $${q + 1} \\times ${d} = ${(q + 1) * d}$, more than ${n}.`,
            `再多一组要 $${q + 1} \\times ${d} = ${(q + 1) * d}$，比 ${n} 多。`,
          ],
          [
            [q + 1, `The last group would have only ${r}.`, `最后一组只有 ${r}。`],
            [r, "That is the remainder, not the number of groups.", "这是余数，不是组数。"],
            [q + r, "That adds the remainder to the quotient.", "这把余数加到了商上。"],
          ],
          { figure: shareTape(n, d, q, r) },
        );
      },
      shareTape(30, 8, 3, 6),
    ),
    point(
      "the-remainder-is-the-answer",
      ["When the remainder is the answer", "什么时候答案是余数"],
      [
        "Sometimes the question asks what is left. 30 cards are dealt equally to 4 players, as many as possible each. $30 \\div 4 = 7$ R 2. Each gets 7, and 2 are left. The answer is 2.\n\nCheck: $4 \\times 7 + 2 = 30$.\n\n> **Watch out.** Read the question. If it asks what is left, the answer is the remainder.",
        "有时题目问的是剩下多少。30 张卡片平均发给 4 人，每人尽量多。$30 \\div 4 = 7$ 余 2，每人 7 张，剩 2 张。答案是 2。\n\n检验：$4 \\times 7 + 2 = 30$。\n\n> **注意。** 读清问题。问剩下多少，答案就是余数。",
      ],
      (rng) => {
        const [n, d, q, r] = remainderProblem(rng);
        const c = rng.pick(leftoverContexts);
        return answered(
          [c.en(n, d), c.zh(n, d)],
          r,
          [
            [["Divide", "相除"], ["", ""], [`${n} \\div ${d} = ${q} \\text{ R } ${r}`]],
            [
              ["Read the question", "读问题"],
              [`It asks what is left, so the answer is the remainder, ${r}.`, `问的是剩下多少，所以答案是余数 ${r}。`],
            ],
          ],
          [`$${d} \\times ${q} = ${d * q}$ and $${n} - ${d * q} = ${r}$.`, `$${d} \\times ${q} = ${d * q}$，$${n} - ${d * q} = ${r}$。`],
          [
            [q, "That is the quotient, not what is left.", "这是商，不是剩下的。"],
            [q + 1, "That rounds the quotient up.", "这是商加一。"],
            [d - r, "That is how many more would make another group.", "这是再要几个才能凑一组。"],
          ],
          { figure: shareTape(n, d, q, r) },
        );
      },
      shareTape(30, 4, 7, 2),
    ),
  ],
};

export const dividingBy10100And1000: TopicDef = {
  id: "dividing-by-10-100-and-1000",
  title: t("Dividing by 10, 100, and 1,000 Using the Pattern of Zeros", "用 0 的规律除以 10、100 和 1000"),
  summary: t(
    "Divide numbers ending in zeros by 10, 100 and 1,000, and by numbers such as 60 and 400.",
    "用末尾有 0 的数除以 10、100、1,000，以及除以 60、400 这样的数。",
  ),
  intro: t(
    "A shop has 4,500 buttons in bags of 100. How many bags? Dividing by 100 moves each digit two places right. 4,500 becomes 45. So there are 45 bags.\n\nCheck: $45 \\times 100 = 4{,}500$.\n\nIn this lesson we divide numbers ending in zeros by 10, 100 and 1,000 and use basic facts.",
    "商店有 4,500 颗纽扣，每袋 100 颗，有几袋？除以 100，每个数字向右移两位，4,500 变成 45。所以有 45 袋。\n\n检验：$45 \\times 100 = 4{,}500$。\n\n本课我们学习末尾有 0 的数除以 10、100、1,000，并用口诀做除法。",
  ),
  prerequisites: ["multiplying-by-10-100-and-1000", "relationship-between-multiplication-and-division"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6", "CCSS.5.NBT.A.2"],
  knowledgePoints: [
    point(
      "removing-zeros",
      ["Removing zeros", "去掉末尾的 0"],
      [
        "Dividing by 10, 100 or 1,000 moves each digit 1, 2 or 3 places right. For numbers ending in zeros, remove that many zeros. $4{,}500 \\div 100 = 45$.\n\nCheck: $45 \\times 100 = 4{,}500$.\n\n> **Watch out.** Remove as many zeros as the divisor has, no more.",
        "除以 10、100、1,000，每个数字向右移 1、2、3 位。末尾有 0 的数，就去掉同样多个 0。$4{,}500 \\div 100 = 45$。\n\n检验：$45 \\times 100 = 4{,}500$。\n\n> **注意。** 除数有几个 0，就去掉几个 0，不能多去。",
      ],
      (rng) => {
        const z = rng.int(1, 3);
        const m = 10 ** z;
        const q = rng.int(2, 99) * rng.pick([1, 10]);
        const n = q * m;
        return answered(
          [`Find $${fmt(n)} \\div ${fmt(m)}$.`, `计算 $${fmt(n)} \\div ${fmt(m)}$。`],
          q,
          [
            [
              ["Count the divisor's zeros", "数除数的 0"],
              [`${plain(m)} has ${z} zero${z > 1 ? "s" : ""}.`, `${plain(m)} 有 ${z} 个 0。`],
            ],
            [["Remove them", "去掉同样多的 0"], ["", ""], [`${fmt(n)} \\div ${fmt(m)} = ${fmt(q)}`]],
          ],
          [`Multiply back: $${fmt(q)} \\times ${fmt(m)} = ${fmt(n)}$.`, `乘回去：$${fmt(q)} \\times ${fmt(m)} = ${fmt(n)}$。`],
          [
            [q * 10, "That removes one zero too few.", "这少去了一个 0。"],
            [
              q % 10 === 0 ? q / 10 : q * 100,
              q % 10 === 0 ? "That removes one zero too many." : "That removes two zeros too few.",
              q % 10 === 0 ? "这多去了一个 0。" : "这少去了两个 0。",
            ],
            [n * m, "That multiplies instead of dividing.", "这是乘法，不是除法。"],
          ],
          {
            figure: placeChartFigure(placesOf(String(n).length), [
              String(n).split(""),
              String(q)
                .padStart(String(n).length, " ")
                .split("")
                .map((c) => c.trim()),
            ]),
          },
        );
      },
      placeChartFigure(placesOf(4), [
        ["4", "5", "0", "0"],
        ["", "", "4", "5"],
      ]),
    ),
    point(
      "basic-facts-with-zeros",
      ["Basic facts with zeros", "带 0 的口诀除法"],
      [
        "$2{,}400 \\div 60$: remove one zero from each. That gives $240 \\div 6$. Then $24 \\div 6 = 4$, so $240 \\div 6 = 40$.\n\nCheck: $60 \\times 40 = 2{,}400$.\n\n> **Watch out.** Remove the same number of zeros from both numbers.",
        "$2{,}400 \\div 60$：两个数各去掉一个 0，变成 $240 \\div 6$。$24 \\div 6 = 4$，所以 $240 \\div 6 = 40$。\n\n检验：$60 \\times 40 = 2{,}400$。\n\n> **注意。** 两个数要去掉同样多个 0。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const zd = rng.int(1, 2);
        const zq = rng.int(0, 2);
        const divisor = a * 10 ** zd;
        const quotient = b * 10 ** zq;
        const n = divisor * quotient;
        return answered(
          [`Find $${fmt(n)} \\div ${fmt(divisor)}$.`, `计算 $${fmt(n)} \\div ${fmt(divisor)}$。`],
          quotient,
          [
            [
              ["Remove the same zeros", "去掉同样多的 0"],
              [`Remove ${zd} zero${zd > 1 ? "s" : ""} from both.`, `两个数各去掉 ${zd} 个 0。`],
              [`${fmt(n / 10 ** zd)} \\div ${a}`],
            ],
            [
              ["Use the fact", "用口诀"],
              [`${a * b} ÷ ${a} = ${b}, then write the zeros left.`, `${a * b} ÷ ${a} = ${b}，再写上剩下的 0。`],
              [`${fmt(n / 10 ** zd)} \\div ${a} = ${fmt(quotient)}`],
            ],
          ],
          [
            `Multiply back: $${fmt(divisor)} \\times ${fmt(quotient)} = ${fmt(n)}$.`,
            `乘回去：$${fmt(divisor)} \\times ${fmt(quotient)} = ${fmt(n)}$。`,
          ],
          [
            [quotient * 10 ** zd, "That removes zeros only from the divisor.", "这只去掉了除数的 0。"],
            [
              zq > 0 ? quotient / 10 : quotient * 100,
              zq > 0 ? "That removes one zero too many." : "That keeps two zeros too many.",
              zq > 0 ? "这多去了一个 0。" : "这多留了两个 0。",
            ],
            [
              b,
              zq > 0 ? "That drops all the zeros of the answer." : "That is the basic fact, and it is right only with no zeros.",
              zq > 0 ? "这把答案的 0 全去掉了。" : "这只是口诀的商。",
            ],
          ],
          { figure: equalTape(Math.min(a, 9), plain(quotient), plain(n)) },
        );
      },
      equalTape(6, "40", "240"),
    ),
  ],
};

/** divGrid draws the one-row area model of a division: the divisor down the side, the quotient's parts on top and their areas inside. */
const divGrid = (d: number, lengths: readonly number[], top: readonly string[]): Figure => {
  const q = sum(lengths);
  return areaGridFigure(
    [String(d)],
    top,
    [lengths.map((l) => plain(d * l))],
    [1],
    lengths.map((l) => Math.max(l, q / 5)),
  );
};

/** chunkTape draws n as the groups the partial quotients take away, the remainder lit. */
const chunkTape = (n: number, d: number): Figure => {
  const ks = chunks(n, d);
  const r = n - d * sum(ks);
  return tapeFigure(
    [
      {
        total: plain(n),
        pieces: [
          ...ks.map((k) => ({ size: Math.max(k * d, n / 8), text: plain(k * d) })),
          ...(r ? [{ size: n / 10, text: String(r), lit: true }] : []),
        ],
      },
    ],
    [
      `A bar of ${plain(n)} cut into ${ks.map((k) => plain(k * d)).join(", ")}${r ? ` and ${r} left over` : ""}.`,
      `一个长条 ${plain(n)}，分成 ${ks.map((k) => plain(k * d)).join("、")}${r ? `，还剩 ${r}` : ""}。`,
    ],
  );
};

/** compatibleLine marks n on a number line between the multiples c - step, c and c + step. */
const compatibleLine = (n: number, c: number, step: number): Figure =>
  lineFigure({ lo: c - step, hi: c + step, step: step / 2, labels: [c - step, c, c + step], marks: [{ at: n, text: plain(n) }] }, [
    `A number line with ${plain(n)} marked near ${plain(c)}.`,
    `一条数轴，${plain(n)} 在 ${plain(c)} 附近。`,
  ]);

/** modelSide asks for one part of the quotient in a division area model. */
const modelSide = (rng: Rng, d: number, q: number): Problem => {
  const lengths = places(q);
  const ask = rng.int(0, lengths.length - 1);
  const part = lengths[ask]!;
  return answered(
    [
      `The area model shows $${fmt(d * q)} \\div ${d}$. What length goes in place of ?`,
      `面积模型表示 $${fmt(d * q)} \\div ${d}$。? 处的长度是多少？`,
    ],
    part,
    [
      [
        ["Read the part", "看这一部分"],
        [`That part has area ${plain(d * part)} and side ${d}.`, `这一部分面积是 ${plain(d * part)}，一条边是 ${d}。`],
      ],
      [["Divide", "相除"], ["", ""], [`${fmt(d * part)} \\div ${d} = ${fmt(part)}`]],
    ],
    [`Multiply back: $${d} \\times ${fmt(part)} = ${fmt(d * part)}$.`, `乘回去：$${d} \\times ${fmt(part)} = ${fmt(d * part)}$。`],
    [
      [d * part, "That is the area, not the length.", "这是面积，不是长。"],
      [part * 10, "That is ten times too big.", "这大了十倍。"],
      [part + d, "That adds the side instead of dividing.", "这是加上边长，应该用除法。"],
    ],
    {
      figure: divGrid(
        d,
        lengths,
        lengths.map((l, i) => (i === ask ? "?" : plain(l))),
      ),
    },
  );
};

/** modelWhole asks for the whole quotient of a division area model. */
const modelWhole = (d: number, q: number): Problem => {
  const lengths = places(q);
  return answered(
    [`Use the area model to find $${fmt(d * q)} \\div ${d}$.`, `用面积模型计算 $${fmt(d * q)} \\div ${d}$。`],
    q,
    [
      [["Divide each part", "每部分分别除"], ["", ""], lengths.map((l) => `${fmt(d * l)} \\div ${d} = ${fmt(l)}`)],
      [["Add the lengths", "把长相加"], ["", ""], [`${lengths.map(fmt).join(" + ")} = ${fmt(q)}`]],
    ],
    [`Multiply back: $${d} \\times ${fmt(q)} = ${fmt(d * q)}$.`, `乘回去：$${d} \\times ${fmt(q)} = ${fmt(d * q)}$。`],
    [
      [q - lengths[lengths.length - 1]!, "That leaves out the last part.", "这漏掉了最后一部分。"],
      [q + 10, "One of the parts was divided wrongly.", "有一部分除错了。"],
      [lengths[0]!, "That is only the first part.", "这只是第一部分。"],
    ],
    {
      figure: divGrid(
        d,
        lengths,
        lengths.map(() => "?"),
      ),
    },
  );
};

/** twoDigitModel draws d and a two-digit quotient whose parts may or may not stay in their places. */
const twoDigitModel = (rng: Rng): [number, number] => {
  const d = rng.int(2, 8);
  return [d, quotientParts(rng, d, 2, d <= 4 && rng.bool())];
};

/** threeDigitModel draws d and a quotient for a dividend of three or four digits. */
const threeDigitModel = (rng: Rng, aligned: boolean): [number, number] => {
  const digits = aligned || rng.bool(0.7) ? 3 : 2;
  const d = rng.int(aligned ? 2 : 3, aligned ? 4 : digits === 2 ? 8 : 9);
  return [d, quotientParts(rng, d, digits, aligned)];
};

/** partialWalk is the walk of the partial-quotients method for n ÷ d. */
const partialWalk = (n: number, d: number): Walk[] => [
  [
    ["Take away groups", "去掉若干组"],
    ["Take away easy groups of the divisor until less than it is left.", "一次去掉容易算的若干组除数，直到剩下的比除数小。"],
    partialSteps(n, d),
  ],
  [["Add the partial quotients", "把部分商相加"], ["", ""], [quotientLine(n, d)]],
];

export const dividingByOneDigitNumbersUsingMultiplication: TopicDef = {
  id: "dividing-by-one-digit-numbers-using-multiplication",
  title: t("Dividing by One-Digit Numbers by Connecting Multiplication and Division", "联系乘法和除法除以一位数"),
  summary: t("Divide a two-digit number by a one-digit number by finding the missing factor.", "通过求未知因数，计算两位数除以一位数。"),
  intro: t(
    "84 chairs are set in 7 equal rows. How many in a row? 7 times what is 84? 10 rows of 7 is 70, and 14 is left. That is 2 more rows of 7. So $84 \\div 7 = 12$.\n\nCheck: $7 \\times 12 = 84$.\n\nIn this lesson we divide past the facts by finding the missing factor in parts.",
    "84 把椅子平均摆成 7 排，每排几把？7 乘几得 84？7 乘 10 是 70，还剩 14，14 是 2 个 7。所以 $84 \\div 7 = 12$。\n\n检验：$7 \\times 12 = 84$。\n\n本课我们分几步求未知因数，做超出口诀的除法。",
  ),
  prerequisites: ["relationship-between-multiplication-and-division", "two-digit-by-one-digit-multiplication-using-place-value"],
  encompasses: [
    { topic: "relationship-between-multiplication-and-division", weight: 0.5 },
    { topic: "two-digit-by-one-digit-multiplication-using-place-value", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "missing-factors-beyond-the-facts",
      ["Missing factors beyond the facts", "超出口诀的未知因数"],
      [
        "For $7 \\times \\square = 84$, start with 10: $7 \\times 10 = 70$. That leaves $84 - 70 = 14$, and $7 \\times 2 = 14$. So the box is $10 + 2 = 12$.\n\nCheck: $7 \\times 12 = 70 + 14 = 84$.\n\n> **Watch out.** Add the 10 and the 2. The answer is not just 2.",
        "求 $7 \\times \\square = 84$，先想 10：$7 \\times 10 = 70$，还剩 $84 - 70 = 14$，而 $7 \\times 2 = 14$。所以方框里是 $10 + 2 = 12$。\n\n检验：$7 \\times 12 = 70 + 14 = 84$。\n\n> **注意。** 要把 10 和 2 加起来，答案不只是 2。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(11, Math.min(19, Math.floor(99 / d)));
        const n = d * q;
        return answered(
          [`Find the missing number: $$${d} \\times \\square = ${n}$$`, `求方框中的数：$$${d} \\times \\square = ${n}$$`],
          q,
          [
            [
              ["Start with 10", "先想 10"],
              ["", ""],
              [`${d} \\times 10 = ${10 * d}`, `${n} - ${10 * d} = ${n - 10 * d}`],
            ],
            [
              ["Find the rest", "再求剩下的"],
              [
                `${n - 10 * d} is ${q - 10} groups of ${d}, so the box is 10 + ${q - 10} = ${q}.`,
                `${n - 10 * d} 是 ${q - 10} 个 ${d}，所以方框里是 10 + ${q - 10} = ${q}。`,
              ],
            ],
          ],
          [`$${d} \\times ${q} = ${n}$.`, `$${d} \\times ${q} = ${n}$。`],
          [
            [q - 10, "That is only the part after the 10.", "这只是 10 以外的部分。"],
            [n - d, "That subtracts instead of dividing.", "这是减法，不是除法。"],
            [q + 1, `$${d} \\times ${q + 1}$ is more than ${n}.`, `$${d} \\times ${q + 1}$ 比 ${n} 大。`],
          ],
          { figure: areaGridFigure([String(d)], ["10", "?"], [[plain(10 * d), plain(n - 10 * d)]], [1], [10, Math.max(q - 10, 3)]) },
        );
      },
      areaGridFigure(["7"], ["10", "?"], [["70", "14"]], [1], [10, 3]),
    ),
    point(
      "dividing-two-digit-numbers",
      ["Dividing two-digit numbers", "两位数除以一位数"],
      [
        "For $96 \\div 4$, think $4 \\times \\square = 96$. Try tens first: $4 \\times 20 = 80$, leaving 16. $4 \\times 4 = 16$. So $96 \\div 4 = 20 + 4 = 24$.\n\nCheck: $4 \\times 24 = 96$.\n\n> **Watch out.** Try the biggest tens that fit, then divide what is left.",
        "计算 $96 \\div 4$，想 $4 \\times \\square = 96$。先试整十：$4 \\times 20 = 80$，还剩 16，$4 \\times 4 = 16$。所以 $96 \\div 4 = 20 + 4 = 24$。\n\n检验：$4 \\times 24 = 96$。\n\n> **注意。** 先试能用的最大整十，再除剩下的。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        let q = rng.int(11, Math.floor(99 / d));
        while (q % 10 === 0) q = rng.int(11, Math.floor(99 / d));
        const n = d * q;
        const tens = Math.floor(q / 10) * 10;
        return answered(
          [`Find $${n} \\div ${d}$.`, `计算 $${n} \\div ${d}$。`],
          q,
          [
            [
              ["Try tens", "先试整十"],
              ["", ""],
              [`${d} \\times ${tens} = ${d * tens}`, `${n} - ${d * tens} = ${n - d * tens}`],
            ],
            [
              ["Divide the rest", "除剩下的"],
              ["", ""],
              [`${n - d * tens} \\div ${d} = ${q - tens}`, `${tens} + ${q - tens} = ${q}`],
            ],
          ],
          [`Multiply back: $${d} \\times ${q} = ${n}$.`, `乘回去：$${d} \\times ${q} = ${n}$。`],
          [
            [q + 1, `$${d} \\times ${q + 1}$ is more than ${n}.`, `$${d} \\times ${q + 1}$ 比 ${n} 大。`],
            [q - 1, `$${d} \\times ${q - 1}$ is less than ${n}.`, `$${d} \\times ${q - 1}$ 比 ${n} 小。`],
            [q - tens, `That leaves out the ${tens}.`, `这漏掉了 ${tens}。`],
            [tens, "That leaves out what is left after the tens.", "这漏掉了整十以外剩下的部分。"],
          ],
          {
            figure: areaGridFigure(
              [String(d)],
              [String(tens), "?"],
              [[plain(d * tens), plain(n - d * tens)]],
              [1],
              [tens, Math.max(q - tens, tens / 4)],
            ),
          },
        );
      },
      areaGridFigure(["4"], ["20", "?"], [["80", "16"]], [1], [20, 5]),
    ),
  ],
};

export const dividingUsingPlaceValueStrategies: TopicDef = {
  id: "dividing-using-place-value-strategies",
  title: t("Dividing Numbers Using Place-Value Strategies", "用位值策略做除法"),
  summary: t(
    "Divide a multi-digit number by a one-digit number by splitting the dividend into parts that divide evenly.",
    "把被除数拆成能整除的几部分，计算多位数除以一位数。",
  ),
  intro: t(
    "A farmer shares 684 eggs among 2 shops. Share each place: 6 hundreds, 8 tens and 4 ones. Each shop gets 3 hundreds, 4 tens and 2 ones, which is 342.\n\nCheck: $342 \\times 2 = 684$.\n\nIn this lesson we divide one place at a time, or split the number into friendly parts.",
    "农场主把 684 个鸡蛋平均分给 2 家商店。按数位分：6 个百、8 个十、4 个一。每家得到 3 个百、4 个十、2 个一，就是 342 个。\n\n检验：$342 \\times 2 = 684$。\n\n本课我们按数位逐位除，或者把数拆成好除的几部分。",
  ),
  prerequisites: ["dividing-by-one-digit-numbers-using-multiplication", "dividing-by-10-100-and-1000"],
  encompasses: [{ topic: "dividing-by-one-digit-numbers-using-multiplication", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "dividing-each-place",
      ["Dividing each place", "逐位相除"],
      [
        "When every digit divides evenly, divide each place. $684 \\div 2$: 6 hundreds ÷ 2 = 3 hundreds, 8 tens ÷ 2 = 4 tens, 4 ones ÷ 2 = 2 ones. So the answer is 342.\n\nCheck: $2 \\times 342 = 684$.\n\n> **Watch out.** Keep each digit in its place. 3 hundreds is 300, not 3.",
        "每一位都能整除时，就逐位相除。$684 \\div 2$：6 个百 ÷ 2 = 3 个百，8 个十 ÷ 2 = 4 个十，4 个一 ÷ 2 = 2 个一。所以得 342。\n\n检验：$2 \\times 342 = 684$。\n\n> **注意。** 每个数字要留在原来的数位上，3 个百是 300，不是 3。",
      ],
      (rng) => {
        const d = rng.int(2, 4);
        const len = rng.bool(0.3) ? 4 : 3;
        const digits = Array.from({ length: len }, (_, i) => d * rng.int(i === 0 ? 1 : 0, Math.floor(9 / d)));
        if (digits[len - 1] === 0) digits[len - 1] = d;
        const n = Number(digits.join(""));
        const parts = places(n);
        const q = n / d;
        const qDigits = digits.map((x) => String(x / d));
        return answered(
          [`Find $${fmt(n)} \\div ${d}$.`, `计算 $${fmt(n)} \\div ${d}$。`],
          q,
          [
            [["Divide each place", "逐位相除"], ["", ""], parts.map((p) => `${fmt(p)} \\div ${d} = ${fmt(p / d)}`)],
            [["Put the places together", "合起来"], ["", ""], [`${parts.map((p) => fmt(p / d)).join(" + ")} = ${fmt(q)}`]],
          ],
          [`Multiply back: $${d} \\times ${fmt(q)} = ${fmt(n)}$.`, `乘回去：$${d} \\times ${fmt(q)} = ${fmt(n)}$。`],
          [
            [q * 10, "That puts a digit one place too far left.", "这把数字向左多移了一位。"],
            [n - d, "That subtracts instead of dividing.", "这是减法，不是除法。"],
            [Number(qDigits.join("")) + 1, "One of the places was divided wrongly.", "有一位除错了。"],
          ],
          { figure: placeChartFigure(placesOf(len), [digits.map(String), qDigits]) },
        );
      },
      placeChartFigure(placesOf(3), [
        ["6", "8", "4"],
        ["3", "4", "2"],
      ]),
    ),
    point(
      "splitting-into-friendly-parts",
      ["Splitting into friendly parts", "拆成好除的部分"],
      [
        "Sometimes a place does not divide evenly. Split the number into parts that do. $972 \\div 4$: split 972 into 800 and 172. $800 \\div 4 = 200$ and $172 \\div 4 = 43$. So the answer is 243.\n\nCheck: $4 \\times 243 = 972$.\n\n> **Watch out.** Each part must divide evenly by the divisor.",
        "有时某一位不能整除，就把数拆成能整除的几部分。$972 \\div 4$：把 972 拆成 800 和 172。$800 \\div 4 = 200$，$172 \\div 4 = 43$，所以得 243。\n\n检验：$4 \\times 243 = 972$。\n\n> **注意。** 拆出的每一部分都要能被除数整除。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const h = rng.int(1, Math.floor(9 / d));
        const k = rng.int(11, Math.floor(99 / d));
        const n = d * (100 * h + k);
        const big = 100 * h * d;
        const rest = d * k;
        const q = 100 * h + k;
        return answered(
          [`Find $${n} \\div ${d}$.`, `计算 $${n} \\div ${d}$。`],
          q,
          [
            [
              ["Split", "拆开"],
              [`Split ${n} into ${big} and ${rest}. Both divide by ${d}.`, `把 ${n} 拆成 ${big} 和 ${rest}，两部分都能被 ${d} 整除。`],
            ],
            [
              ["Divide and add", "分别除再相加"],
              ["", ""],
              [`${big} \\div ${d} = ${100 * h}`, `${rest} \\div ${d} = ${k}`, `${100 * h} + ${k} = ${q}`],
            ],
          ],
          [`Multiply back: $${d} \\times ${q} = ${n}$.`, `乘回去：$${d} \\times ${q} = ${n}$。`],
          [
            [100 * h, `That leaves out ${rest} ÷ ${d}.`, `这漏掉了 ${rest} ÷ ${d}。`],
            [q + 10, `$${d} \\times ${q + 10}$ is more than ${n}.`, `$${d} \\times ${q + 10}$ 比 ${n} 大。`],
            [10 * h + k, `${big} ÷ ${d} is ${100 * h}, not ${10 * h}.`, `${big} ÷ ${d} 是 ${100 * h}，不是 ${10 * h}。`],
          ],
          {
            figure: tapeFigure(
              [
                {
                  total: String(n),
                  pieces: [
                    { size: big, text: String(big) },
                    { size: Math.max(rest, n / 5), text: String(rest) },
                  ],
                },
              ],
              [`A bar of ${n} split into ${big} and ${rest}.`, `一个长条 ${n}，拆成 ${big} 和 ${rest}。`],
            ),
          },
        );
      },
      tapeFigure(
        [
          {
            total: "972",
            pieces: [
              { size: 800, text: "800" },
              { size: 200, text: "172" },
            ],
          },
        ],
        ["A bar of 972 split into 800 and 172.", "一个长条 972，拆成 800 和 172。"],
      ),
    ),
  ],
};

export const estimatingMultiDigitDivision: TopicDef = {
  id: "estimating-multi-digit-division",
  title: t("Estimating Multi-Digit Division", "估算多位数除法"),
  summary: t(
    "Estimate a quotient with compatible numbers: a nearby dividend that divides easily.",
    "用相容数估算商：把被除数换成附近一个容易整除的数。",
  ),
  intro: t(
    "A class of 6 has to read 1,180 pages. About how many pages each? 1,180 is close to 1,200, and 12 hundreds ÷ 6 = 2 hundreds. So about 200 pages each.\n\nCheck: $6 \\times 200 = 1{,}200$, close to 1,180.\n\nIn this lesson we pick compatible numbers to estimate a quotient.",
    "6 个同学要读 1,180 页书，每人大约读几页？1,180 接近 1,200，12 个百 ÷ 6 = 2 个百。所以每人大约 200 页。\n\n检验：$6 \\times 200 = 1{,}200$，接近 1,180。\n\n本课我们用相容数来估算商。",
  ),
  prerequisites: ["dividing-by-10-100-and-1000"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "choosing-compatible-numbers",
      ["Choosing compatible numbers", "选择相容数"],
      [
        "A compatible number is close to the dividend and easy to divide. For $1{,}180 \\div 6$, use 1,200, because $12 \\div 6 = 2$.\n\nCheck: 1,200 is only 20 away from 1,180.\n\n> **Watch out.** Rounding alone may not help. Look for a number that the divisor goes into evenly.",
        "相容数是接近被除数、又好除的数。计算 $1{,}180 \\div 6$，用 1,200，因为 $12 \\div 6 = 2$。\n\n检验：1,200 和 1,180 只差 20。\n\n> **注意。** 只按四舍五入不一定好除，要找除数口诀里的数。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const unit = rng.bool() ? 10 : 100;
        const step = d * unit;
        const k = rng.int(2, 9);
        const c = step * k;
        const n = c + rng.int(1, Math.floor(step / 3)) * rng.sign();
        const rounded = unit === 10 ? round10(n) : round100(n);
        const near = rounded === c ? c + unit : rounded;
        return pickedMath(
          rng,
          [`Which is the best way to estimate $${fmt(n)} \\div ${d}$?`, `估算 $${fmt(n)} \\div ${d}$，哪个最合适？`],
          `${fmt(c)} \\div ${d}`,
          [
            [
              `${fmt(near)} \\div ${d}`,
              `${plain(near)} is close, but it does not divide evenly by ${d}.`,
              `${plain(near)} 虽然接近，但不能被 ${d} 整除。`,
            ],
            [
              `${fmt(c + step)} \\div ${d}`,
              `That divides easily, but ${plain(c)} is closer to ${plain(n)}.`,
              `这也好除，但 ${plain(c)} 离 ${plain(n)} 更近。`,
            ],
            [
              `${fmt(c - step)} \\div ${d}`,
              `That divides easily, but ${plain(c)} is closer to ${plain(n)}.`,
              `这也好除，但 ${plain(c)} 离 ${plain(n)} 更近。`,
            ],
          ],
          [
            [
              ["Look at the divisor", "看除数"],
              [`Look for a multiple of ${d} near ${plain(n)}.`, `在 ${plain(n)} 附近找 ${d} 的倍数。`],
            ],
            [
              ["Pick the closest", "选最近的"],
              [
                `${plain(c)} is ${c / unit} ${unit === 10 ? "tens" : "hundreds"}, and ${d} divides ${c / unit}.`,
                `${plain(c)} 是 ${c / unit} 个${unit === 10 ? "十" : "百"}，${c / unit} 能被 ${d} 整除。`,
              ],
            ],
          ],
          [
            `${plain(c)} is ${plain(Math.abs(n - c))} away from ${plain(n)}, the nearest such multiple.`,
            `${plain(c)} 和 ${plain(n)} 只差 ${plain(Math.abs(n - c))}，是最近的这种倍数。`,
          ],
          compatibleLine(n, c, step),
        );
      },
      compatibleLine(1180, 1200, 600),
    ),
    point(
      "estimating-the-quotient",
      ["Estimating the quotient", "估算商"],
      [
        "Change the dividend to a compatible number, then divide with a fact. $1{,}180 \\div 6$ is about $1{,}200 \\div 6 = 200$.\n\nCheck: $6 \\times 200 = 1{,}200$, close to 1,180.\n\n> **Watch out.** Count the zeros. 12 hundreds ÷ 6 is 2 hundreds, not 20.",
        "把被除数换成相容数，再用口诀除。$1{,}180 \\div 6$ 约等于 $1{,}200 \\div 6 = 200$。\n\n检验：$6 \\times 200 = 1{,}200$，接近 1,180。\n\n> **注意。** 数清 0 的个数。12 个百 ÷ 6 是 2 个百，不是 20。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const unit = rng.bool() ? 10 : 100;
        const step = d * unit;
        const c = step * rng.int(2, 9);
        const n = c + rng.int(1, Math.floor(step / 3)) * rng.sign();
        const est = c / d;
        return answered(
          [`Estimate $${fmt(n)} \\div ${d}$ by using a compatible number.`, `用相容数估算 $${fmt(n)} \\div ${d}$。`],
          est,
          [
            [
              ["Pick a compatible number", "选相容数"],
              [`${plain(c)} is close to ${plain(n)} and divides by ${d}.`, `${plain(c)} 接近 ${plain(n)}，并且能被 ${d} 整除。`],
            ],
            [["Divide", "相除"], ["", ""], [`${fmt(c)} \\div ${d} = ${fmt(est)}`]],
          ],
          [`$${d} \\times ${fmt(est)} = ${fmt(c)}$, close to ${plain(n)}.`, `$${d} \\times ${fmt(est)} = ${fmt(c)}$，接近 ${plain(n)}。`],
          [
            [est * 10, "That has one zero too many.", "这多了一个 0。"],
            [est / 10, "That has one zero too few.", "这少了一个 0。"],
            [c - d, "That subtracts instead of dividing.", "这是减法，不是除法。"],
          ],
          { figure: compatibleLine(n, c, step) },
        );
      },
      compatibleLine(1180, 1200, 600),
    ),
  ],
};

// ---------------------------------------------------------------------------
// Dividing with models

/** quotientWithParts draws a quotient whose place-value parts, times d, give the dividend; aligned asks every part to stay in its place. */
function quotientParts(rng: Rng, d: number, digits: number, aligned: boolean): number {
  for (;;) {
    const q = rng.int(10 ** (digits - 1) + 1, 10 ** digits - 1);
    const ds = [...String(q)].map(Number);
    if (ds.at(-1) === 0) continue;
    const fits = ds.every((x) => d * x < 10);
    if (aligned === fits && (digits === 2 ? d * q < 100 : true)) return q;
  }
}

export const twoDigitByOneDigitDivisionUsingAreaModels: TopicDef = {
  id: "two-digit-by-one-digit-division-using-area-models",
  title: t("Two-Digit by One-Digit Division Using Area Models", "用面积模型计算两位数除以一位数"),
  summary: t(
    "Divide a two-digit number by a one-digit number by finding the missing side of a rectangle.",
    "通过求长方形的未知边长，计算两位数除以一位数。",
  ),
  intro: t(
    "A garden has an area of 72 square meters and is 6 meters wide. How long is it? Split 72 into 60 and 12. $60 \\div 6 = 10$ and $12 \\div 6 = 2$. So it is 12 meters long.\n\nCheck: $6 \\times 12 = 72$.\n\nIn this lesson we divide with an area model: the area is the dividend, one side is the divisor.",
    "一块菜地面积 72 平方米，宽 6 米，长多少米？把 72 拆成 60 和 12。$60 \\div 6 = 10$，$12 \\div 6 = 2$。所以长 12 米。\n\n检验：$6 \\times 12 = 72$。\n\n本课我们用面积模型做除法：面积是被除数，一条边是除数。",
  ),
  prerequisites: ["dividing-by-one-digit-numbers-using-multiplication"],
  encompasses: [{ topic: "dividing-by-one-digit-numbers-using-multiplication", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "missing-side-lengths",
      ["Missing side lengths", "求缺少的边长"],
      [
        "Each part of the model has an area and a side of 6. Its other side is the area ÷ 6. For the part with area 60, the length is $60 \\div 6 = 10$.\n\nCheck: $6 \\times 10 = 60$.\n\n> **Watch out.** The number inside is the area. The length is the area ÷ the side.",
        "模型的每一部分都有面积，一条边是 6，另一条边就是面积 ÷ 6。面积 60 的部分，长是 $60 \\div 6 = 10$。\n\n检验：$6 \\times 10 = 60$。\n\n> **注意。** 里面的数是面积，长等于面积除以边。",
      ],
      (rng) => {
        const [d, q] = twoDigitModel(rng);
        return modelSide(rng, d, q);
      },
      divGrid(6, [10, 2], ["?", "2"]),
    ),
    point(
      "finding-the-quotient-from-a-model",
      ["Finding the quotient from a model", "从模型求商"],
      [
        "The whole length of the model is the quotient. Add the lengths of the parts. For $72 \\div 6$: $10 + 2 = 12$.\n\nCheck: $6 \\times 12 = 72$.\n\n> **Watch out.** Add the lengths, not the areas.",
        "模型的总长就是商，把各部分的长相加。计算 $72 \\div 6$：$10 + 2 = 12$。\n\n检验：$6 \\times 12 = 72$。\n\n> **注意。** 加的是长，不是面积。",
      ],
      (rng) => {
        const [d, q] = twoDigitModel(rng);
        return modelWhole(d, q);
      },
      divGrid(6, [10, 2], ["?", "?"]),
    ),
  ],
};

export const multiDigitByOneDigitDivisionUsingAreaModels: TopicDef = {
  id: "multi-digit-by-one-digit-division-using-area-models",
  title: t("Multi-Digit by One-Digit Division Using Area Models", "用面积模型计算多位数除以一位数"),
  summary: t(
    "Divide a three-digit number by a one-digit number with an area model of hundreds, tens and ones.",
    "用分成百、十、一三部分的面积模型计算三位数除以一位数。",
  ),
  intro: t(
    "A wall of 963 tiles is 3 tiles high. How many tiles long? Split 963 into 900, 60 and 3. Each part ÷ 3 gives 300, 20 and 1. So it is 321 tiles long.\n\nCheck: $3 \\times 321 = 963$.\n\nIn this lesson we use area models with three parts: hundreds, tens and ones.",
    "一面墙贴了 963 块瓷砖，高 3 块，长几块？把 963 拆成 900、60 和 3，每部分除以 3 得 300、20 和 1。所以长 321 块。\n\n检验：$3 \\times 321 = 963$。\n\n本课我们用百、十、一三部分的面积模型做除法。",
  ),
  prerequisites: ["two-digit-by-one-digit-division-using-area-models", "dividing-by-10-100-and-1000"],
  encompasses: [{ topic: "two-digit-by-one-digit-division-using-area-models", weight: 0.8 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "three-part-models",
      ["Models with three parts", "三部分的模型"],
      [
        "Split the area into hundreds, tens and ones. For $963 \\div 3$: $900 \\div 3 = 300$, $60 \\div 3 = 20$, $3 \\div 3 = 1$. These are the three lengths.\n\nCheck: $3 \\times 20 = 60$, the area of the middle part.\n\n> **Watch out.** 900 ÷ 3 is 300, not 3. Keep the zeros.",
        "把面积拆成百、十、一。计算 $963 \\div 3$：$900 \\div 3 = 300$，$60 \\div 3 = 20$，$3 \\div 3 = 1$。这是三部分的长。\n\n检验：$3 \\times 20 = 60$，正是中间部分的面积。\n\n> **注意。** 900 ÷ 3 是 300，不是 3，别丢掉 0。",
      ],
      (rng) => {
        const [d, q] = threeDigitModel(rng, true);
        return modelSide(rng, d, q);
      },
      divGrid(3, [300, 20, 1], ["300", "?", "1"]),
    ),
    point(
      "three-part-quotients",
      ["Finding the quotient", "求出商"],
      [
        "Add the three lengths to get the quotient. $963 \\div 3 = 300 + 20 + 1 = 321$.\n\nCheck: $3 \\times 321 = 963$.\n\n> **Watch out.** Do not leave out the ones part.",
        "把三部分的长加起来就是商。$963 \\div 3 = 300 + 20 + 1 = 321$。\n\n检验：$3 \\times 321 = 963$。\n\n> **注意。** 别漏掉个位那一部分。",
      ],
      (rng) => {
        const [d, q] = threeDigitModel(rng, true);
        return modelWhole(d, q);
      },
      divGrid(3, [300, 20, 1], ["?", "?", "?"]),
    ),
  ],
};

export const moreMultiDigitByOneDigitDivisionUsingAreaModels: TopicDef = {
  id: "more-multi-digit-by-one-digit-division-using-area-models",
  title: t("More Multi-Digit by One-Digit Division Using Area Models", "用面积模型计算多位数除以一位数（进阶）"),
  summary: t(
    "Use area models whose parts are not single places, such as 744 = 600 + 120 + 24 for 744 ÷ 6.",
    "使用各部分不是单个数位的面积模型，例如计算 744 ÷ 6 时把 744 拆成 600 + 120 + 24。",
  ),
  intro: t(
    "Ben packs 744 pens into 6 boxes. 7 hundreds do not split evenly into 6, so he splits 744 into 600, 120 and 24. Each ÷ 6 gives 100, 20 and 4. So each box has 124 pens.\n\nCheck: $6 \\times 124 = 744$.\n\nIn this lesson we use area models whose parts cross places.",
    "本把 744 支笔平均装进 6 个盒子。7 个百不能平均分成 6 份，所以他把 744 拆成 600、120 和 24，每部分除以 6 得 100、20 和 4。所以每盒 124 支。\n\n检验：$6 \\times 124 = 744$。\n\n本课我们用跨数位拆分的面积模型做除法。",
  ),
  prerequisites: ["multi-digit-by-one-digit-division-using-area-models"],
  encompasses: [{ topic: "multi-digit-by-one-digit-division-using-area-models", weight: 0.8 }],
  xp: 14,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "parts-that-cross-places",
      ["Parts that cross places", "跨数位的部分"],
      [
        "If a digit does not divide evenly, choose parts that do. $744 = 600 + 120 + 24$. Their lengths are $600 \\div 6 = 100$, $120 \\div 6 = 20$ and $24 \\div 6 = 4$.\n\nCheck: $600 + 120 + 24 = 744$.\n\n> **Watch out.** A part like 120 crosses the hundreds and tens. That is fine.",
        "某一位不能整除时，就选能整除的部分。$744 = 600 + 120 + 24$。它们的长是 $600 \\div 6 = 100$，$120 \\div 6 = 20$，$24 \\div 6 = 4$。\n\n检验：$600 + 120 + 24 = 744$。\n\n> **注意。** 像 120 这样跨百位和十位的部分是可以的。",
      ],
      (rng) => {
        const [d, q] = threeDigitModel(rng, false);
        return modelSide(rng, d, q);
      },
      divGrid(6, [100, 20, 4], ["100", "?", "4"]),
    ),
    point(
      "quotients-from-friendly-parts",
      ["Finding the quotient", "求出商"],
      [
        "Divide each friendly part, then add the lengths. $744 \\div 6 = 100 + 20 + 4 = 124$.\n\nCheck: $6 \\times 124 = 744$.\n\n> **Watch out.** The parts of the dividend must add up to the whole dividend.",
        "每个好除的部分分别除，再把长相加。$744 \\div 6 = 100 + 20 + 4 = 124$。\n\n检验：$6 \\times 124 = 744$。\n\n> **注意。** 拆出的各部分加起来要等于整个被除数。",
      ],
      (rng) => {
        const [d, q] = threeDigitModel(rng, false);
        return modelWhole(d, q);
      },
      divGrid(6, [100, 20, 4], ["?", "?", "?"]),
    ),
  ],
};

export const twoDigitByOneDigitDivisionUsingPartialQuotients: TopicDef = {
  id: "two-digit-by-one-digit-division-using-partial-quotients",
  title: t("Two-Digit by One-Digit Division Using Partial Quotients", "用部分商计算两位数除以一位数"),
  summary: t(
    "Divide by taking away groups of the divisor, such as 10 groups at a time, and adding the partial quotients.",
    "一次去掉若干组除数（例如 10 组），再把各部分商相加。",
  ),
  intro: t(
    "Mia has 84 stickers to put on pages of 6. She fills 10 pages, using 60. 24 are left, enough for 4 more pages. So she fills $10 + 4 = 14$ pages.\n\nCheck: $6 \\times 14 = 84$.\n\nIn this lesson we divide by taking away easy groups and adding the partial quotients.",
    "米娅有 84 张贴纸，每页贴 6 张。她先贴满 10 页，用了 60 张，还剩 24 张，正好再贴 4 页。所以一共贴 $10 + 4 = 14$ 页。\n\n检验：$6 \\times 14 = 84$。\n\n本课我们用部分商做除法：一次去掉容易算的若干组，再把部分商相加。",
  ),
  prerequisites: ["two-digit-by-one-digit-division-using-area-models"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "taking-away-groups",
      ["Taking away groups", "去掉若干组"],
      [
        "Start by taking away 10 groups of the divisor. For $84 \\div 6$, 10 groups of 6 is 60, and $84 - 60 = 24$ is left.\n\nCheck: $60 + 24 = 84$.\n\n> **Watch out.** Take away 10 groups of 6, which is 60, not 10.",
        "先去掉 10 组除数。计算 $84 \\div 6$，10 组 6 是 60，$84 - 60 = 24$，还剩 24。\n\n检验：$60 + 24 = 84$。\n\n> **注意。** 去掉的是 10 组 6，也就是 60，不是 10。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const q = rng.int(11, Math.floor(99 / d));
        const n = d * q;
        return answered(
          [
            `To find $${n} \\div ${d}$, take away 10 groups of $${d}$. How much is left?`,
            `计算 $${n} \\div ${d}$ 时，先去掉 10 组 $${d}$。还剩多少？`,
          ],
          n - 10 * d,
          [
            [["Find 10 groups", "求 10 组"], ["", ""], [`10 \\times ${d} = ${10 * d}`]],
            [["Take them away", "去掉"], ["", ""], [`${n} - ${10 * d} = ${n - 10 * d}`]],
          ],
          [`Add back: $${10 * d} + ${n - 10 * d} = ${n}$.`, `加回去：$${10 * d} + ${n - 10 * d} = ${n}$。`],
          [
            [n - 10, `That takes away 10, not 10 groups of ${d}.`, `这只去掉了 10，不是 10 组 ${d}。`],
            [n - d, `That takes away only 1 group of ${d}.`, `这只去掉了 1 组 ${d}。`],
            [10 * d, "That is what was taken away, not what is left.", "这是去掉的部分，不是剩下的。"],
          ],
          {
            figure: tapeFigure(
              [
                {
                  total: String(n),
                  pieces: [
                    { size: 10 * d, text: String(10 * d) },
                    { size: Math.max(n - 10 * d, n / 6), text: "?", lit: true },
                  ],
                },
              ],
              [`A bar of ${n} with ${10 * d} taken away.`, `一个长条 ${n}，去掉 ${10 * d}。`],
            ),
          },
        );
      },
      tapeFigure(
        [
          {
            total: "84",
            pieces: [
              { size: 60, text: "60" },
              { size: 24, text: "?", lit: true },
            ],
          },
        ],
        ["A bar of 84 with 60 taken away.", "一个长条 84，去掉 60。"],
      ),
    ),
    point(
      "adding-partial-quotients",
      ["Adding partial quotients", "把部分商相加"],
      [
        "Keep taking away groups until nothing is left. Then add how many groups you took. $84 \\div 6$: 10 groups, then 4 groups. $10 + 4 = 14$.\n\nCheck: $6 \\times 14 = 84$.\n\n> **Watch out.** Add the numbers of groups, not the amounts taken away.",
        "不断去掉若干组，直到不剩。再把去掉的组数加起来。$84 \\div 6$：先 10 组，再 4 组，$10 + 4 = 14$。\n\n检验：$6 \\times 14 = 84$。\n\n> **注意。** 加的是组数，不是去掉的数量。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const q = rng.int(11, Math.floor(99 / d));
        const n = d * q;
        return answered(
          [`Use partial quotients to find $${n} \\div ${d}$.`, `用部分商计算 $${n} \\div ${d}$。`],
          q,
          partialWalk(n, d),
          [`Multiply back: $${d} \\times ${q} = ${n}$.`, `乘回去：$${d} \\times ${q} = ${n}$。`],
          [
            [chunks(n, d)[0]!, "That is only the first partial quotient.", "这只是第一个部分商。"],
            [q + 1, `$${d} \\times ${q + 1}$ is more than ${n}.`, `$${d} \\times ${q + 1}$ 比 ${n} 大。`],
            [n - 10 * d, "That is what is left after 10 groups, not the quotient.", "这是去掉 10 组后剩下的，不是商。"],
          ],
          { figure: chunkTape(n, d) },
        );
      },
      chunkTape(84, 6),
    ),
  ],
};

export const twoDigitByOneDigitDivisionWithRemaindersUsingPartialQuotients: TopicDef = {
  id: "two-digit-by-one-digit-division-with-remainders-using-partial-quotients",
  title: t("Two-Digit by One-Digit Division With Remainders Using Partial Quotients", "用部分商计算有余数的两位数除以一位数"),
  summary: t("Use partial quotients when the division leaves a remainder.", "在有余数的除法中使用部分商。"),
  intro: t(
    "Leo has 89 marbles and puts 7 in each bag. 10 bags use 70, leaving 19. 2 more bags use 14, leaving 5. 5 is too few for a bag. So he fills 12 bags with 5 left over.\n\nCheck: $7 \\times 12 + 5 = 89$.\n\nIn this lesson we use partial quotients when there is a remainder.",
    "利奥有 89 颗弹珠，每袋装 7 颗。10 袋用了 70 颗，剩 19 颗；再装 2 袋用 14 颗，剩 5 颗，不够再装一袋。所以装了 12 袋，剩 5 颗。\n\n检验：$7 \\times 12 + 5 = 89$。\n\n本课我们用部分商做有余数的除法。",
  ),
  prerequisites: ["two-digit-by-one-digit-division-using-partial-quotients", "division-with-remainders"],
  encompasses: [
    { topic: "two-digit-by-one-digit-division-using-partial-quotients", weight: 0.8 },
    { topic: "division-with-remainders", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "partial-quotients-with-a-remainder",
      ["Partial quotients with a remainder", "有余数的部分商"],
      [
        "Stop taking away groups when what is left is less than the divisor. $89 \\div 7$: take 10 groups (70), then 2 groups (14). 5 is left. The quotient is $10 + 2 = 12$.\n\nCheck: $7 \\times 12 + 5 = 89$.\n\n> **Watch out.** Stop only when what is left is less than the divisor.",
        "剩下的比除数小时，就不再去掉。$89 \\div 7$：先去掉 10 组（70），再去掉 2 组（14），剩 5。商是 $10 + 2 = 12$。\n\n检验：$7 \\times 12 + 5 = 89$。\n\n> **注意。** 剩下的比除数小时才能停。",
      ],
      (rng) => {
        const d = rng.int(3, 8);
        const r = rng.int(1, d - 1);
        const q = rng.int(11, Math.floor((99 - r) / d));
        const n = d * q + r;
        return answered(
          [`What is the quotient of $${n} \\div ${d}$? (There is a remainder.)`, `$${n} \\div ${d}$ 的商是多少？（有余数。）`],
          q,
          partialWalk(n, d),
          [`$${d} \\times ${q} + ${r} = ${n}$, and ${r} is less than ${d}.`, `$${d} \\times ${q} + ${r} = ${n}$，${r} 比 ${d} 小。`],
          [
            [q + 1, `$${d} \\times ${q + 1}$ is more than ${n}.`, `$${d} \\times ${q + 1}$ 比 ${n} 大。`],
            [chunks(n, d)[0]!, "That is only the first partial quotient.", "这只是第一个部分商。"],
            [r, "That is the remainder, not the quotient.", "这是余数，不是商。"],
          ],
          { figure: chunkTape(n, d) },
        );
      },
      chunkTape(89, 7),
    ),
    point(
      "remainders-from-partial-quotients",
      ["Remainders from partial quotients", "从部分商求余数"],
      [
        "The remainder is what is left at the end. $89 \\div 7$: $89 - 70 = 19$, $19 - 14 = 5$. 5 is less than 7, so the remainder is 5.\n\nCheck: $7 \\times 12 + 5 = 89$.\n\n> **Watch out.** If what is left is 7 or more, take away another group first.",
        "最后剩下的数就是余数。$89 \\div 7$：$89 - 70 = 19$，$19 - 14 = 5$。5 比 7 小，所以余数是 5。\n\n检验：$7 \\times 12 + 5 = 89$。\n\n> **注意。** 如果剩下的不比 7 小，还要再去掉一组。",
      ],
      (rng) => {
        const d = rng.int(3, 8);
        const r = rng.int(1, d - 1);
        const q = rng.int(11, Math.floor((99 - r) / d));
        const n = d * q + r;
        return answered(
          [`Use partial quotients to find the remainder of $${n} \\div ${d}$.`, `用部分商求 $${n} \\div ${d}$ 的余数。`],
          r,
          [
            [["Take away groups", "去掉若干组"], ["", ""], partialSteps(n, d)],
            [
              ["Read what is left", "看剩下的"],
              [`${r} is less than ${d}, so the remainder is ${r}.`, `${r} 比 ${d} 小，所以余数是 ${r}。`],
            ],
          ],
          [`$${d} \\times ${q} + ${r} = ${n}$.`, `$${d} \\times ${q} + ${r} = ${n}$。`],
          [
            [q, "That is the quotient, not the remainder.", "这是商，不是余数。"],
            [r + d, `That is not less than ${d}. One more group fits.`, `这不比 ${d} 小，还能再去掉一组。`],
            [d - r, "That is how many more would make another group.", "这是再要几个才能凑一组。"],
          ],
          { figure: chunkTape(n, d) },
        );
      },
      chunkTape(89, 7),
    ),
  ],
};

export const multiDigitByOneDigitDivisionUsingPartialQuotients: TopicDef = {
  id: "multi-digit-by-one-digit-division-using-partial-quotients",
  title: t("Multi-Digit by One-Digit Division Using Partial Quotients", "用部分商计算多位数除以一位数"),
  summary: t(
    "Divide three- and four-digit numbers by a one-digit number with partial quotients, with or without a remainder.",
    "用部分商计算三位数、四位数除以一位数，包括有余数的情况。",
  ),
  intro: t(
    "A bakery bakes 742 rolls and packs 7 in a bag. 100 bags use 700, leaving 42. 6 more bags use 42. So there are $100 + 6 = 106$ bags.\n\nCheck: $7 \\times 106 = 742$.\n\nIn this lesson we use partial quotients for three- and four-digit dividends.",
    "面包店烤了 742 个面包，每袋装 7 个。100 袋用了 700 个，剩 42 个；再装 6 袋正好用完。所以一共 $100 + 6 = 106$ 袋。\n\n检验：$7 \\times 106 = 742$。\n\n本课我们用部分商计算三位数和四位数除以一位数。",
  ),
  prerequisites: [
    "two-digit-by-one-digit-division-with-remainders-using-partial-quotients",
    "multi-digit-by-one-digit-division-using-area-models",
  ],
  encompasses: [
    { topic: "two-digit-by-one-digit-division-with-remainders-using-partial-quotients", weight: 0.8 },
    { topic: "dividing-using-place-value-strategies", weight: 0.5, nonAncestor: true },
  ],
  xp: 15,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    point(
      "three-digit-dividends",
      ["Three-digit dividends", "三位数被除数"],
      [
        "With bigger numbers, take away 100 groups or 10 groups at a time. $742 \\div 7$: take 100 groups (700), leaving 42. Take 6 groups (42), leaving 0. The quotient is $100 + 6 = 106$.\n\nCheck: $7 \\times 106 = 742$.\n\n> **Watch out.** Take the biggest easy groups first, or the steps get long.",
        "数大时，可以一次去掉 100 组或 10 组。$742 \\div 7$：先去掉 100 组（700），剩 42；再去掉 6 组（42），剩 0。商是 $100 + 6 = 106$。\n\n检验：$7 \\times 106 = 742$。\n\n> **注意。** 先去掉最大的整组，步骤才不会太长。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(Math.ceil(100 / d) + 1, Math.floor(999 / d));
        const n = d * q;
        const ks = chunks(n, d);
        return answered(
          [`Use partial quotients to find $${n} \\div ${d}$.`, `用部分商计算 $${n} \\div ${d}$。`],
          q,
          partialWalk(n, d),
          [`Multiply back: $${d} \\times ${q} = ${n}$.`, `乘回去：$${d} \\times ${q} = ${n}$。`],
          [
            [q - ks[ks.length - 1]!, "That leaves out the last partial quotient.", "这漏掉了最后一个部分商。"],
            [ks[0]!, "That is only the first partial quotient.", "这只是第一个部分商。"],
            [q + 10, `$${d} \\times ${q + 10}$ is more than ${n}.`, `$${d} \\times ${q + 10}$ 比 ${n} 大。`],
          ],
          { figure: chunkTape(n, d) },
        );
      },
      chunkTape(742, 7),
    ),
    point(
      "multi-digit-quotients-with-remainders",
      ["Quotients with remainders", "有余数的商"],
      [
        "Take away groups until less than the divisor is left. $927 \\div 4$: 200 groups (800) leaves 127. 30 groups (120) leaves 7. 1 group (4) leaves 3. The quotient is $200 + 30 + 1 = 231$, remainder 3.\n\nCheck: $4 \\times 231 + 3 = 927$.\n\n> **Watch out.** The quotient is the sum of the groups, not what is left.",
        "一直去掉若干组，直到剩下的比除数小。$927 \\div 4$：去掉 200 组（800）剩 127，去掉 30 组（120）剩 7，去掉 1 组（4）剩 3。商是 $200 + 30 + 1 = 231$，余数是 3。\n\n检验：$4 \\times 231 + 3 = 927$。\n\n> **注意。** 商是各组数的和，不是剩下的数。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const r = rng.int(1, d - 1);
        const q = rng.int(Math.ceil(100 / d) + 1, Math.floor((rng.bool(0.3) ? 9999 : 999) / d) - 1);
        const n = d * q + r;
        const ks = chunks(n, d);
        return answered(
          [`What is the quotient of $${fmt(n)} \\div ${d}$? (There is a remainder.)`, `$${fmt(n)} \\div ${d}$ 的商是多少？（有余数。）`],
          q,
          partialWalk(n, d),
          [
            `$${d} \\times ${fmt(q)} + ${r} = ${fmt(n)}$, and ${r} is less than ${d}.`,
            `$${d} \\times ${fmt(q)} + ${r} = ${fmt(n)}$，${r} 比 ${d} 小。`,
          ],
          [
            [q + 1, `$${d} \\times ${fmt(q + 1)}$ is more than $${fmt(n)}$.`, `$${d} \\times ${fmt(q + 1)}$ 比 $${fmt(n)}$ 大。`],
            [q - ks[ks.length - 1]!, "That leaves out the last partial quotient.", "这漏掉了最后一个部分商。"],
            [ks[0]!, "That is only the first partial quotient.", "这只是第一个部分商。"],
          ],
          { figure: chunkTape(n, d) },
        );
      },
      chunkTape(927, 4),
    ),
    point(
      "multi-digit-remainders",
      ["Multi-digit remainders", "多位数除法的余数"],
      [
        "The remainder is what is left after the last group. In $927 \\div 4$, 3 is left after taking 231 groups of 4. So the remainder is 3.\n\nCheck: $927 - 4 \\times 231 = 927 - 924 = 3$.\n\n> **Watch out.** The remainder must be less than the divisor.",
        "去掉最后一组后剩下的就是余数。$927 \\div 4$ 去掉 231 组 4 以后剩 3，所以余数是 3。\n\n检验：$927 - 4 \\times 231 = 927 - 924 = 3$。\n\n> **注意。** 余数一定比除数小。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const r = rng.int(1, d - 1);
        const q = rng.int(Math.ceil(100 / d) + 1, Math.floor(999 / d) - 1);
        const n = d * q + r;
        return answered(
          [`Find the remainder of $${n} \\div ${d}$.`, `求 $${n} \\div ${d}$ 的余数。`],
          r,
          [
            [["Take away groups", "去掉若干组"], ["", ""], partialSteps(n, d)],
            [
              ["Read what is left", "看剩下的"],
              [`${r} is less than ${d}, so the remainder is ${r}.`, `${r} 比 ${d} 小，所以余数是 ${r}。`],
            ],
          ],
          [`$${n} - ${d} \\times ${q} = ${n} - ${d * q} = ${r}$.`, `$${n} - ${d} \\times ${q} = ${n} - ${d * q} = ${r}$。`],
          [
            [d - r, "That is how many more would make another group.", "这是再要几个才能凑一组。"],
            [r + d, `That is not less than ${d}. One more group fits.`, `这不比 ${d} 小，还能再去掉一组。`],
            [q % 10, "That is the last digit of the quotient.", "这是商的个位。"],
          ],
          { figure: chunkTape(n, d) },
        );
      },
      chunkTape(927, 4),
    ),
  ],
};

/** grade4OperationTopics are the 4th-grade topics on factors, multiples, multi-digit multiplication and division, in teaching order. */
export const grade4OperationTopics: readonly TopicDef[] = [
  productsAndFactors,
  factorsOfANumber,
  multiplesOfANumber,
  leastCommonMultipleByListing,
  connectingFactorsAndMultiples,
  greatestCommonFactorByListing,
  multiplyingBy10100And1000,
  rewritingNumbersEndingInZeros,
  multiplyingNumbersEndingInZeros,
  multiplyingUsingRepeatedAddition,
  multiplyingUsingRepeatedSubtraction,
  estimatingMultiDigitMultiplication,
  twoDigitByOneDigitMultiplicationUsingAreaModels,
  multiDigitByOneDigitMultiplicationUsingAreaModels,
  twoDigitByOneDigitMultiplicationUsingPlaceValue,
  multiDigitByOneDigitMultiplicationUsingPlaceValue,
  twoDigitByTwoDigitMultiplicationUsingAreaModels,
  twoDigitByTwoDigitMultiplicationUsingPlaceValue,
  relationshipBetweenMultiplicationAndDivision,
  understandingRemaindersUsingModels,
  findingRemainders,
  dividendsDivisorsQuotientsAndRemainders,
  divisionWithRemainders,
  interpretingRemaindersInContext,
  dividingBy10100And1000,
  dividingByOneDigitNumbersUsingMultiplication,
  dividingUsingPlaceValueStrategies,
  estimatingMultiDigitDivision,
  twoDigitByOneDigitDivisionUsingAreaModels,
  multiDigitByOneDigitDivisionUsingAreaModels,
  moreMultiDigitByOneDigitDivisionUsingAreaModels,
  twoDigitByOneDigitDivisionUsingPartialQuotients,
  twoDigitByOneDigitDivisionWithRemaindersUsingPartialQuotients,
  multiDigitByOneDigitDivisionUsingPartialQuotients,
];
