import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, lcm, type Mark, type Point, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps, yesNo } from "../problems.ts";

// ---------------------------------------------------------------------------
// Helpers

/** fmt writes a whole number in LaTeX with thousands separators: "3{,}400". */
const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** plain writes a whole number for a figure label: "3,400". */
const plain = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** math is a choice option made of one LaTeX expression, the same in every locale. */
const math = (s: string): Text => same(`$${s}$`);

const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

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

/** shuffled puts the correct option among the wrong ones in random order, dropping repeats. */
function shuffled(rng: Rng, correct: Text, wrong: readonly Text[]): { options: Text[]; correct: number } {
  const seen = new Set([correct.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en)));
  const all = rng.shuffle([correct, ...rest]);
  return { options: all, correct: all.indexOf(correct) };
}

/** qr writes a quotient with a remainder: "7 R 5" in English, "7……5" in Chinese. */
const qr = (q: number, r: number) => ({ en: `${fmt(q)} \\text{ R } ${r}`, zh: `${fmt(q)} \\cdots\\cdots ${r}` });

/** divText writes "n ÷ d = q R r" as a bilingual text in math mode. */
const divText = (n: number, d: number, q: number, r: number): Text =>
  t(`$${fmt(n)} \\div ${d} = ${qr(q, r).en}$`, `$${fmt(n)} \\div ${d} = ${qr(q, r).zh}$`);

/** round10 and round100 round to the nearest ten and hundred, halves up. */
const round10 = (n: number) => Math.round(n / 10) * 10;
const round100 = (n: number) => Math.round(n / 100) * 100;

/** placeNames are the names of the places of a whole number, from the ones. */
const placeNames: readonly Text[] = [
  t("ones", "个位"),
  t("tens", "十位"),
  t("hundreds", "百位"),
  t("thousands", "千位"),
  t("ten thousands", "万位"),
];

/**
 * areaModel draws a rectangle split into columns and rows, with the column
 * lengths on top, the row lengths on the left and a text in each cell. Widths
 * follow cols and rows loosely, so that small parts stay wide enough to label.
 */
function areaModel(
  cols: readonly number[],
  rows: readonly number[],
  top: readonly string[],
  left: readonly string[],
  cells: readonly (readonly string[])[],
): Mark[] {
  const ws = cols.map((v) => 2.4 + (8 * v) / sum(cols));
  const hs = rows.length === 1 ? [4] : rows.map((v) => 2.2 + (5 * v) / sum(rows));
  const [W, H] = [sum(ws), sum(hs)];
  const xs = ws.map((_, i) => sum(ws.slice(0, i)));
  const ys = hs.map((_, j) => H - sum(hs.slice(0, j)));
  const marks: Mark[] = [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [W, 0],
        [W, H],
        [0, H],
      ],
    },
  ];
  xs.slice(1).forEach((x) => {
    marks.push({ kind: "segment", a: [x, 0], b: [x, H] });
  });
  ys.slice(1).forEach((y) => {
    marks.push({ kind: "segment", a: [0, y], b: [W, y] });
  });
  ws.forEach((w, i) => {
    marks.push({ kind: "label", at: [xs[i]! + w / 2, H], text: top[i]!, dir: "n" });
  });
  hs.forEach((h, j) => {
    marks.push({ kind: "label", at: [0, ys[j]! - h / 2], text: left[j]!, dir: "w" });
    ws.forEach((w, i) => {
      const text = cells[j]?.[i];
      if (text) marks.push({ kind: "label", at: [xs[i]! + w / 2, ys[j]! - h / 2], text, dir: "n" });
    });
  });
  return marks;
}

/** groupsFigure draws q boxed groups of g counters, then r loose counters. */
function groupsFigure(g: number, q: number, r: number): Mark[] {
  const marks: Mark[] = [];
  for (let i = 0; i < q; i++) {
    const x = i * 1.6;
    const box: Point[] = [
      [x - 0.5, 0.5],
      [x + 0.5, 0.5],
      [x + 0.5, 0.5 - g],
      [x - 0.5, 0.5 - g],
    ];
    marks.push({ kind: "polygon", points: box });
    for (let j = 0; j < g; j++) marks.push({ kind: "dot", at: [x, -j] });
  }
  for (let j = 0; j < r; j++) marks.push({ kind: "dot", at: [q * 1.6 + 0.4, -j] });
  return marks;
}

/** rowsOfTen draws n counters in rows of ten. */
function rowsOfTen(n: number): Mark[] {
  return Array.from({ length: n }, (_, i): Mark => ({ kind: "dot", at: [i % 10, -Math.floor(i / 10)] }));
}

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

export const productsAndFactors: TopicDef = {
  id: "products-and-factors",
  title: t("Products and Factors", "积与因数"),
  summary: t(
    "Name the factors and the product of a multiplication, and find a missing factor.",
    "说出乘法算式中的因数和积，并求未知因数。",
  ),
  prerequisites: [],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.3.OA.A.4", "CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "naming-factors-and-products",
      title: t("Factors and products", "因数与积"),
      explanation: t(
        "In a multiplication such as $6 \\times 8 = 48$, the numbers being multiplied, $6$ and $8$, are the **factors**. The answer, $48$, is the **product**.\n\nThe same fact can be written the other way round, $48 = 6 \\times 8$. The product is still $48$.",
        "在乘法算式 $6 \\times 8 = 48$ 中，相乘的两个数 $6$ 和 $8$ 叫作**因数**，结果 $48$ 叫作**积**。\n\n同一个算式也可以反过来写成 $48 = 6 \\times 8$，积仍然是 $48$。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        let b = rng.int(2, 12);
        while (b === a) b = rng.int(2, 12);
        const p = a * b;
        const eq = rng.bool() ? `${a} \\times ${b} = ${p}` : `${p} = ${a} \\times ${b}`;
        const solution = t(
          `$${a}$ and $${b}$ are multiplied, so they are the factors. The result, $${p}$, is the product.`,
          `$${a}$ 和 $${b}$ 相乘，它们是因数；结果 $${p}$ 是积。`,
        );
        if (rng.bool()) {
          return choiceProblem({
            prompt: t(`Which number is the product in $${eq}$?`, `在 $${eq}$ 中，哪个数是积？`),
            options: [math(String(a)), math(String(b)), math(String(p))],
            correct: 2,
            solution,
          });
        }
        return choiceProblem({
          prompt: t(`In $${eq}$, what are $${a}$ and $${b}$ called?`, `在 $${eq}$ 中，$${a}$ 和 $${b}$ 叫作什么？`),
          options: [t("Factors", "因数"), t("Products", "积"), t("Sums", "和")],
          correct: 0,
          solution,
        });
      },
    },
    {
      id: "missing-factors",
      title: t("Missing factors", "求未知因数"),
      explanation: t(
        "To find a missing factor, ask: *what number times the known factor gives the product?*\n\nFor $7 \\times \\square = 56$, count by sevens or recall the facts: $7 \\times 8 = 56$, so the missing factor is $8$.",
        "求未知因数时，想一想：*哪个数与已知因数相乘得到积？*\n\n例如 $7 \\times \\square = 56$，可以七个七个地数，或回忆乘法口诀：$7 \\times 8 = 56$，所以未知因数是 $8$。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const p = a * b;
        const eq = rng.bool() ? `${a} \\times \\square = ${p}` : `\\square \\times ${a} = ${p}`;
        return numberProblem({
          prompt: t(`Find the missing factor: $$${eq}$$`, `求未知因数：$$${eq}$$`),
          answer: b,
          form: "integer",
          wrong: [p - a, p + a, p, a],
          solution: t(
            `Which number times $${a}$ makes $${p}$? $${a} \\times ${b} = ${p}$, so the missing factor is $${b}$.`,
            `哪个数乘 $${a}$ 得 $${p}$？$${a} \\times ${b} = ${p}$，所以未知因数是 $${b}$。`,
          ),
        });
      },
    },
  ],
};

export const factorsOfANumber: TopicDef = {
  id: "factors-of-a-number",
  title: t("The Factors of a Number", "一个数的因数"),
  summary: t(
    "Tell whether one number is a factor of another, and list all the factors of a number in pairs.",
    "判断一个数是不是另一个数的因数，并成对地找出一个数的所有因数。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [{ topic: "products-and-factors", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "is-it-a-factor",
      title: t("Is it a factor?", "是不是因数"),
      explanation: t(
        "A number is a **factor** of another number if it divides it with nothing left over. $6$ is a factor of $42$ because $6 \\times 7 = 42$.\n\n$5$ is not a factor of $42$: counting by fives goes $40, 45$ and skips over $42$.",
        "如果一个数能把另一个数分完、没有剩余，它就是那个数的**因数**。$6$ 是 $42$ 的因数，因为 $6 \\times 7 = 42$。\n\n$5$ 不是 $42$ 的因数：五个五个地数，$40, 45$，跳过了 $42$。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const n = rng.bool() ? d * rng.int(2, 12) : rng.int(12, 120);
        const q = Math.floor(n / d);
        const yes = n % d === 0;
        return choiceProblem({
          prompt: t(`Is $${d}$ a factor of $${n}$?`, `$${d}$ 是 $${n}$ 的因数吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `$${d} \\times ${q} = ${n}$, so $${d}$ is a factor of $${n}$.`,
                `$${d} \\times ${q} = ${n}$，所以 $${d}$ 是 $${n}$ 的因数。`,
              )
            : t(
                `$${d} \\times ${q} = ${d * q}$ and $${d} \\times ${q + 1} = ${d * (q + 1)}$: counting by $${d}$ skips over $${n}$, so $${d}$ is not a factor of $${n}$.`,
                `$${d} \\times ${q} = ${d * q}$，$${d} \\times ${q + 1} = ${d * (q + 1)}$：按 $${d}$ 数会跳过 $${n}$，所以 $${d}$ 不是 $${n}$ 的因数。`,
              ),
        });
      },
    },
    {
      id: "factor-pairs",
      title: t("Factor pairs", "成对的因数"),
      explanation: t(
        "Factors come in **pairs** whose product is the number. To list all the factors of $36$, start at $1$ and work up:\n\n$$1 \\times 36, \\quad 2 \\times 18, \\quad 3 \\times 12, \\quad 4 \\times 9, \\quad 6 \\times 6$$\n\n$5$ is skipped because it is not a factor. Stop when the pairs meet. The factors of $36$ are $1, 2, 3, 4, 6, 9, 12, 18, 36$.",
        "因数是**成对**出现的，每一对的积都等于这个数。要列出 $36$ 的所有因数，从 $1$ 开始往上找：\n\n$$1 \\times 36, \\quad 2 \\times 18, \\quad 3 \\times 12, \\quad 4 \\times 9, \\quad 6 \\times 6$$\n\n$5$ 不是因数，跳过。两边相遇时停止。$36$ 的因数是 $1, 2, 3, 4, 6, 9, 12, 18, 36$。",
      ),
      generate(rng) {
        let n = rng.int(12, 100);
        while (factorsOf(n).length < 6) n = rng.int(12, 100);
        const fs = factorsOf(n);
        const hidden = rng.pick(fs.slice(1, -1));
        const partner = n / hidden;
        const list = fs.map((f) => (f === hidden ? "\\square" : String(f))).join(", ");
        return numberProblem({
          prompt: t(
            `The factors of $${n}$ are listed in order. Which factor is missing? $$${list}$$`,
            `按从小到大的顺序列出了 $${n}$ 的因数，缺了哪一个？$$${list}$$`,
          ),
          answer: hidden,
          form: "integer",
          wrong: [hidden + 1, hidden - 1, partner === hidden ? hidden * 2 : partner + 1],
          solution: t(
            `$${hidden}$ pairs with $${partner}$: $${hidden} \\times ${partner} = ${n}$. So the missing factor is $${hidden}$.`,
            `$${hidden}$ 与 $${partner}$ 配对：$${hidden} \\times ${partner} = ${n}$。所以缺少的因数是 $${hidden}$。`,
          ),
        });
      },
    },
    {
      id: "counting-factors",
      title: t("Listing all the factors", "列出所有因数"),
      explanation: t(
        "Find every factor pair, starting from $1 \\times n$, and stop when the pairs meet. Then count the factors. Each pair gives two factors, except a pair like $6 \\times 6$, which gives only one.\n\n$20$: $1 \\times 20$, $2 \\times 10$, $4 \\times 5$. So $20$ has $6$ factors: $1, 2, 4, 5, 10, 20$.",
        "从 $1 \\times n$ 开始找出所有成对的因数，两边相遇时停止，再数一数因数的个数。每一对给出两个因数，但像 $6 \\times 6$ 这样的一对只给出一个。\n\n$20$：$1 \\times 20$，$2 \\times 10$，$4 \\times 5$。所以 $20$ 有 $6$ 个因数：$1, 2, 4, 5, 10, 20$。",
      ),
      generate(rng) {
        const n = rng.int(10, 100);
        const fs = factorsOf(n);
        const pairs = fs.filter((f) => f * f <= n).map((f) => `${f} \\times ${n / f}`);
        return numberProblem({
          prompt: t(`How many factors does $${n}$ have?`, `$${n}$ 有多少个因数？`),
          answer: fs.length,
          form: "integer",
          wrong: [pairs.length, fs.length - 2, fs.length + 1],
          solution: t(
            `The factor pairs are ${pairs.map((p) => `$${p}$`).join(", ")}. The factors are $${fs.join(", ")}$: there are $${fs.length}$.`,
            `成对的因数是 ${pairs.map((p) => `$${p}$`).join("、")}。因数有 $${fs.join(", ")}$，共 $${fs.length}$ 个。`,
          ),
        });
      },
    },
  ],
};

export const multiplesOfANumber: TopicDef = {
  id: "multiples-of-a-number",
  title: t("The Multiples of a Number", "一个数的倍数"),
  summary: t(
    "List the multiples of a number and tell whether a number is a multiple of another.",
    "列出一个数的倍数，判断一个数是不是另一个数的倍数。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [{ topic: "products-and-factors", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "listing-multiples",
      title: t("Listing multiples", "列出倍数"),
      explanation: t(
        "The **multiples** of a number are the products of that number with $1, 2, 3, \\dots$. You get them by counting by that number.\n\nThe multiples of $6$ are $6, 12, 18, 24, 30, \\dots$ The list never ends.",
        "一个数的**倍数**是这个数与 $1, 2, 3, \\dots$ 相乘的积，也就是按这个数一份一份地数出来的数。\n\n$6$ 的倍数是 $6, 12, 18, 24, 30, \\dots$，这个列表没有尽头。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const k = rng.int(1, 8);
        const terms = [k, k + 1, k + 2, k + 3].map((i) => d * i);
        const hide = rng.int(1, 3);
        const list = terms.map((v, i) => (i === hide ? "\\square" : String(v))).join(", ");
        const answer = terms[hide]!;
        return numberProblem({
          prompt: t(
            `These are multiples of $${d}$ in order. What is the missing number? $$${list}$$`,
            `这些是按顺序排列的 $${d}$ 的倍数，缺少的数是多少？$$${list}$$`,
          ),
          answer,
          form: "integer",
          wrong: [answer + 1, answer - 1, answer + d],
          solution: t(
            `Count by $${d}$: each multiple is $${d}$ more than the one before. The missing number is $${d} \\times ${k + hide} = ${answer}$.`,
            `按 $${d}$ 数：每个倍数都比前一个多 $${d}$。缺少的数是 $${d} \\times ${k + hide} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "is-it-a-multiple",
      title: t("Is it a multiple?", "是不是倍数"),
      explanation: t(
        "A number is a multiple of $d$ if it appears when you count by $d$, that is, if it equals $d$ times a whole number.\n\n$56$ is a multiple of $8$ because $8 \\times 7 = 56$. $50$ is not: counting by eights goes $48, 56$ and skips $50$.",
        "如果按 $d$ 数时能数到一个数，也就是这个数等于 $d$ 乘一个整数，它就是 $d$ 的倍数。\n\n$56$ 是 $8$ 的倍数，因为 $8 \\times 7 = 56$。$50$ 不是：八个八个地数，$48, 56$，跳过了 $50$。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const n = rng.bool() ? d * rng.int(3, 12) : rng.int(20, 144);
        const q = Math.floor(n / d);
        const yes = n % d === 0;
        return choiceProblem({
          prompt: t(`Is $${n}$ a multiple of $${d}$?`, `$${n}$ 是 $${d}$ 的倍数吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `$${d} \\times ${q} = ${n}$, so $${n}$ is a multiple of $${d}$.`,
                `$${d} \\times ${q} = ${n}$，所以 $${n}$ 是 $${d}$ 的倍数。`,
              )
            : t(
                `Counting by $${d}$ goes $${d * q}, ${d * (q + 1)}$ and skips $${n}$, so $${n}$ is not a multiple of $${d}$.`,
                `按 $${d}$ 数：$${d * q}, ${d * (q + 1)}$，跳过了 $${n}$，所以 $${n}$ 不是 $${d}$ 的倍数。`,
              ),
        });
      },
    },
    {
      id: "counting-multiples",
      title: t("How many multiples?", "有多少个倍数"),
      explanation: t(
        "To count the multiples of $d$ up to a number, find the last multiple that is not too big. Its partner factor tells you how many there are.\n\nMultiples of $7$ up to $50$: $7 \\times 7 = 49$ fits but $7 \\times 8 = 56$ is too big, so there are $7$ of them: $7, 14, 21, 28, 35, 42, 49$.",
        "要数出不超过某个数的 $d$ 的倍数有几个，先找出不超过它的最后一个倍数，与它配对的因数就是个数。\n\n不超过 $50$ 的 $7$ 的倍数：$7 \\times 7 = 49$ 不超过 $50$，而 $7 \\times 8 = 56$ 太大，所以共 $7$ 个：$7, 14, 21, 28, 35, 42, 49$。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const n = rng.int(3 * d, 12 * d);
        const k = Math.floor(n / d);
        return numberProblem({
          prompt: t(`How many multiples of $${d}$ are there from $1$ to $${n}$?`, `从 $1$ 到 $${n}$，$${d}$ 的倍数有多少个？`),
          answer: k,
          form: "integer",
          wrong: [k + 1, d * k, k - 1],
          solution: t(
            `$${d} \\times ${k} = ${d * k}$ is at most $${n}$, but $${d} \\times ${k + 1} = ${d * (k + 1)}$ is more than $${n}$. So there are $${k}$ multiples.`,
            `$${d} \\times ${k} = ${d * k}$ 不超过 $${n}$，而 $${d} \\times ${k + 1} = ${d * (k + 1)}$ 超过了 $${n}$。所以共有 $${k}$ 个倍数。`,
          ),
        });
      },
    },
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
  prerequisites: ["multiples-of-a-number"],
  encompasses: [{ topic: "multiples-of-a-number", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "common-multiples",
      title: t("Common multiples", "公倍数"),
      explanation: t(
        "A **common multiple** of two numbers is a multiple of both. List the multiples of each and look for numbers in both lists:\n\n- multiples of $4$: $4, 8, \\mathbf{12}, 16, 20, \\mathbf{24}, \\dots$\n- multiples of $6$: $6, \\mathbf{12}, 18, \\mathbf{24}, \\dots$\n\n$12$ and $24$ are common multiples of $4$ and $6$.",
        "两个数的**公倍数**是它们共同的倍数。分别列出它们的倍数，找出两个列表中都有的数：\n\n- $4$ 的倍数：$4, 8, \\mathbf{12}, 16, 20, \\mathbf{24}, \\dots$\n- $6$ 的倍数：$6, \\mathbf{12}, 18, \\mathbf{24}, \\dots$\n\n$12$ 和 $24$ 都是 $4$ 和 $6$ 的公倍数。",
      ),
      generate(rng) {
        const [a, b] = smallPair(rng);
        const m = lcm(a, b);
        const correct = m * rng.int(1, 2);
        const onlyA = [2, 3, 4, 5, 6, 7].map((k) => a * k).filter((v) => v % b !== 0);
        const onlyB = [2, 3, 4, 5, 6, 7].map((k) => b * k).filter((v) => v % a !== 0);
        const neither = [a + b, m + 1, m - 1].filter((v) => v % a !== 0 && v % b !== 0);
        const wrong = [onlyA[0] ?? a + 1, onlyB[0] ?? b + 1, neither[0] ?? m + 1].map(String).map(math);
        const { options, correct: index } = shuffled(rng, math(String(correct)), wrong);
        return choiceProblem({
          prompt: t(`Which number is a common multiple of $${a}$ and $${b}$?`, `哪个数是 $${a}$ 和 $${b}$ 的公倍数？`),
          options,
          correct: index,
          solution: t(
            `$${correct} = ${a} \\times ${correct / a}$ and $${correct} = ${b} \\times ${correct / b}$, so $${correct}$ is a multiple of both. Each of the other numbers is missing from at least one list of multiples.`,
            `$${correct} = ${a} \\times ${correct / a}$，$${correct} = ${b} \\times ${correct / b}$，所以 $${correct}$ 是两个数共同的倍数。其他的数至少不在其中一个倍数列表里。`,
          ),
        });
      },
    },
    {
      id: "least-common-multiple",
      title: t("The least common multiple", "最小公倍数"),
      explanation: t(
        "The **least common multiple** of two numbers is the smallest number that is a multiple of both. List the multiples of the larger number and stop at the first one the smaller number divides.\n\nFor $6$ and $8$: multiples of $8$ are $8, 16, 24$. $6$ does not divide $8$ or $16$, but $6 \\times 4 = 24$. The least common multiple is $24$.",
        "两个数的**最小公倍数**是它们公倍数中最小的一个。列出较大的数的倍数，找到第一个能被较小的数整除的倍数就停下。\n\n例如 $6$ 和 $8$：$8$ 的倍数是 $8, 16, 24$。$8$ 和 $16$ 都不能被 $6$ 整除，而 $6 \\times 4 = 24$。最小公倍数是 $24$。",
      ),
      generate(rng) {
        const [a, b] = smallPair(rng);
        const m = lcm(a, b);
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        return numberProblem({
          prompt: t(`Find the least common multiple of $${a}$ and $${b}$.`, `求 $${a}$ 和 $${b}$ 的最小公倍数。`),
          answer: m,
          form: "integer",
          wrong: [a * b, big, 2 * m, gcd(a, b)],
          solution: t(
            `Multiples of $${big}$: $${multiplesUpTo(big, m)}$. The first one that is also a multiple of $${small}$ is $${m} = ${small} \\times ${m / small}$. The least common multiple is $${m}$.`,
            `$${big}$ 的倍数：$${multiplesUpTo(big, m)}$。其中第一个也是 $${small}$ 的倍数的是 $${m} = ${small} \\times ${m / small}$。最小公倍数是 $${m}$。`,
          ),
        });
      },
    },
  ],
};

export const connectingFactorsAndMultiples: TopicDef = {
  id: "connecting-factors-and-multiples",
  title: t("Connecting Factors and Multiples", "因数与倍数的关系"),
  summary: t("See that a is a factor of b exactly when b is a multiple of a.", "理解 a 是 b 的因数，恰好意味着 b 是 a 的倍数。"),
  prerequisites: ["factors-of-a-number", "multiples-of-a-number"],
  encompasses: [
    { topic: "factors-of-a-number", weight: 0.4 },
    { topic: "multiples-of-a-number", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "two-ways-to-say-it",
      title: t("Two ways to say the same thing", "同一件事的两种说法"),
      explanation: t(
        "The fact $6 \\times 7 = 42$ can be described in two ways:\n\n- $6$ (and $7$) is a **factor** of $42$;\n- $42$ is a **multiple** of $6$ (and of $7$).\n\nThe smaller number is the factor; the larger number is the multiple.",
        "$6 \\times 7 = 42$ 这个事实可以有两种说法：\n\n- $6$（以及 $7$）是 $42$ 的**因数**；\n- $42$ 是 $6$（以及 $7$）的**倍数**。\n\n较小的数是因数，较大的数是倍数。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const n = a * rng.int(2, 12);
        const givenFactor = rng.bool();
        const options = givenFactor
          ? [
              t(`$${n}$ is a multiple of $${a}$.`, `$${n}$ 是 $${a}$ 的倍数。`),
              t(`$${a}$ is a multiple of $${n}$.`, `$${a}$ 是 $${n}$ 的倍数。`),
              t(`$${n}$ is a factor of $${a}$.`, `$${n}$ 是 $${a}$ 的因数。`),
            ]
          : [
              t(`$${a}$ is a factor of $${n}$.`, `$${a}$ 是 $${n}$ 的因数。`),
              t(`$${n}$ is a factor of $${a}$.`, `$${n}$ 是 $${a}$ 的因数。`),
              t(`$${a}$ is a multiple of $${n}$.`, `$${a}$ 是 $${n}$ 的倍数。`),
            ];
        const { options: shuffledOptions, correct } = shuffled(rng, options[0]!, options.slice(1));
        return choiceProblem({
          prompt: givenFactor
            ? t(`$${a}$ is a factor of $${n}$. Which statement is also true?`, `$${a}$ 是 $${n}$ 的因数。下面哪句话也正确？`)
            : t(`$${n}$ is a multiple of $${a}$. Which statement is also true?`, `$${n}$ 是 $${a}$ 的倍数。下面哪句话也正确？`),
          options: shuffledOptions,
          correct,
          solution: t(
            `$${a} \\times ${n / a} = ${n}$. So $${a}$ is a factor of $${n}$, and $${n}$ is a multiple of $${a}$.`,
            `$${a} \\times ${n / a} = ${n}$。所以 $${a}$ 是 $${n}$ 的因数，$${n}$ 是 $${a}$ 的倍数。`,
          ),
        });
      },
    },
    {
      id: "factor-and-multiple-at-once",
      title: t("Both a factor and a multiple", "既是因数又是倍数"),
      explanation: t(
        "Some questions ask for a number that is a multiple of one number and a factor of another. Check both conditions for each choice.\n\nIs $12$ a multiple of $4$ and a factor of $36$? $4 \\times 3 = 12$, and $12 \\times 3 = 36$: yes to both.",
        "有些题目要找一个数，它既是某个数的倍数，又是另一个数的因数。对每个选项，两个条件都要检查。\n\n$12$ 是 $4$ 的倍数、又是 $36$ 的因数吗？$4 \\times 3 = 12$，$12 \\times 3 = 36$：两个条件都满足。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 6);
          const n = a * rng.int(4, 12);
          const good = factorsOf(n).filter((f) => f % a === 0 && f !== a && f !== n);
          const factorOnly = factorsOf(n).filter((f) => f % a !== 0 && f > 1);
          const multipleOnly = [2, 3, 4, 5, 6, 7, 8, 9].map((k) => a * k).filter((v) => n % v !== 0);
          const neither = [n - 1, n + 1, a + 1, 2 * a + 1].filter((v) => v > 1 && v % a !== 0 && n % v !== 0);
          if (good.length === 0 || factorOnly.length === 0 || multipleOnly.length === 0 || neither.length === 0) continue;
          const c = rng.pick(good);
          const fo = rng.pick(factorOnly);
          const mo = rng.pick(multipleOnly);
          const ne = rng.pick(neither);
          const { options, correct } = shuffled(rng, math(String(c)), [fo, mo, ne].map(String).map(math));
          return choiceProblem({
            prompt: t(
              `Which number is a multiple of $${a}$ and also a factor of $${n}$?`,
              `哪个数既是 $${a}$ 的倍数，又是 $${n}$ 的因数？`,
            ),
            options,
            correct,
            solution: t(
              `$${c} = ${a} \\times ${c / a}$ is a multiple of $${a}$, and $${c} \\times ${n / c} = ${n}$, so it is a factor of $${n}$. $${fo}$ is not a multiple of $${a}$, $${mo}$ is not a factor of $${n}$, and $${ne}$ is neither.`,
              `$${c} = ${a} \\times ${c / a}$ 是 $${a}$ 的倍数，$${c} \\times ${n / c} = ${n}$，所以它是 $${n}$ 的因数。$${fo}$ 不是 $${a}$ 的倍数，$${mo}$ 不是 $${n}$ 的因数，$${ne}$ 两者都不是。`,
            ),
          });
        }
      },
    },
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
  prerequisites: ["factors-of-a-number"],
  encompasses: [{ topic: "factors-of-a-number", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "common-factors",
      title: t("Common factors", "公因数"),
      explanation: t(
        "A **common factor** of two numbers is a factor of both. List the factors of each and look for numbers in both lists:\n\n- factors of $12$: $\\mathbf{1}, \\mathbf{2}, 3, \\mathbf{4}, 6, 12$\n- factors of $20$: $\\mathbf{1}, \\mathbf{2}, \\mathbf{4}, 5, 10, 20$\n\nThe common factors of $12$ and $20$ are $1$, $2$ and $4$.",
        "两个数的**公因数**是它们共同的因数。分别列出它们的因数，找出两个列表中都有的数：\n\n- $12$ 的因数：$\\mathbf{1}, \\mathbf{2}, 3, \\mathbf{4}, 6, 12$\n- $20$ 的因数：$\\mathbf{1}, \\mathbf{2}, \\mathbf{4}, 5, 10, 20$\n\n$12$ 和 $20$ 的公因数是 $1$、$2$ 和 $4$。",
      ),
      generate(rng) {
        for (;;) {
          const [a, b] = factorPair(rng);
          const common = factorsOf(gcd(a, b)).filter((f) => f > 1);
          const onlyA = factorsOf(a).filter((f) => b % f !== 0);
          const onlyB = factorsOf(b).filter((f) => a % f !== 0);
          const neither = [5, 7, 8, 9, 11, 13].filter((f) => a % f !== 0 && b % f !== 0);
          if (onlyA.length === 0 || onlyB.length === 0 || neither.length === 0) continue;
          const c = rng.pick(common);
          const [fa, fb, ne] = [rng.pick(onlyA), rng.pick(onlyB), rng.pick(neither)];
          const { options, correct } = shuffled(rng, math(String(c)), [fa, fb, ne].map(String).map(math));
          return choiceProblem({
            prompt: t(`Which number is a common factor of $${a}$ and $${b}$?`, `哪个数是 $${a}$ 和 $${b}$ 的公因数？`),
            options,
            correct,
            solution: t(
              `$${a} = ${c} \\times ${a / c}$ and $${b} = ${c} \\times ${b / c}$, so $${c}$ is a factor of both. $${fa}$ is not a factor of $${b}$, $${fb}$ is not a factor of $${a}$, and $${ne}$ is a factor of neither.`,
              `$${a} = ${c} \\times ${a / c}$，$${b} = ${c} \\times ${b / c}$，所以 $${c}$ 是两个数的因数。$${fa}$ 不是 $${b}$ 的因数，$${fb}$ 不是 $${a}$ 的因数，$${ne}$ 两个数的因数都不是。`,
            ),
          });
        }
      },
    },
    {
      id: "greatest-common-factor",
      title: t("The greatest common factor", "最大公因数"),
      explanation: t(
        "The **greatest common factor** of two numbers is the largest number that is a factor of both. List the factors of each number and pick the largest one in both lists.\n\nFactors of $18$: $1, 2, 3, 6, 9, 18$. Factors of $24$: $1, 2, 3, 4, 6, 8, 12, 24$. The greatest common factor is $6$.",
        "两个数的**最大公因数**是它们公因数中最大的一个。分别列出两个数的因数，选出两个列表中都有的最大的数。\n\n$18$ 的因数：$1, 2, 3, 6, 9, 18$。$24$ 的因数：$1, 2, 3, 4, 6, 8, 12, 24$。最大公因数是 $6$。",
      ),
      generate(rng) {
        const [a, b] = factorPair(rng);
        const g = gcd(a, b);
        const common = factorsOf(g);
        return numberProblem({
          prompt: t(`Find the greatest common factor of $${a}$ and $${b}$.`, `求 $${a}$ 和 $${b}$ 的最大公因数。`),
          answer: g,
          form: "integer",
          wrong: [lcm(a, b), common.length > 2 ? common[common.length - 2]! : 1, Math.min(a, b) === g ? Math.max(a, b) : Math.min(a, b)],
          solution: t(
            `Factors of $${a}$: $${factorsOf(a).join(", ")}$. Factors of $${b}$: $${factorsOf(b).join(", ")}$. The common factors are $${common.join(", ")}$, and the greatest is $${g}$.`,
            `$${a}$ 的因数：$${factorsOf(a).join(", ")}$。$${b}$ 的因数：$${factorsOf(b).join(", ")}$。公因数是 $${common.join(", ")}$，其中最大的是 $${g}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Multiplying whole numbers

const powersOfTen = [10, 100, 1000] as const;

export const multiplyingBy10100And1000: TopicDef = {
  id: "multiplying-by-10-100-and-1000",
  title: t("Multiplying by 10, 100, and 1,000", "乘 10、100 和 1,000"),
  summary: t(
    "Multiply a whole number by 10, 100 or 1,000 by moving its digits to higher places and writing zeros.",
    "把整数乘 10、100 或 1,000：各位数字移到更高的数位，并在末尾添上 0。",
  ),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.NBT.A.1", "CCSS.5.NBT.A.2"],
  knowledgePoints: [
    {
      id: "using-place-value",
      title: t("Using place value", "利用数位"),
      explanation: t(
        "Multiplying by $10$ makes each digit worth ten times as much, so every digit moves **one place to the left**. Multiplying by $100$ moves every digit two places, and by $1{,}000$ three places.\n\nIn $47 \\times 100 = 4{,}700$, the $4$ moves from the tens place to the thousands place, and the $7$ from the ones place to the hundreds place.",
        "乘 $10$ 时，每个数字表示的值都变成原来的十倍，所以每个数字都向左移**一位**。乘 $100$ 时向左移两位，乘 $1{,}000$ 时向左移三位。\n\n在 $47 \\times 100 = 4{,}700$ 中，$4$ 从十位移到千位，$7$ 从个位移到百位。",
      ),
      generate(rng) {
        const tens = rng.int(1, 9);
        let ones = rng.int(1, 9);
        while (ones === tens) ones = rng.int(1, 9);
        const n = 10 * tens + ones;
        const k = rng.int(1, 3);
        const m = 10 ** k;
        const askTens = rng.bool();
        const [digit, from] = askTens ? [tens, 1] : [ones, 0];
        const to = from + k;
        return choiceProblem({
          prompt: t(
            `In $${n} \\times ${fmt(m)} = ${fmt(n * m)}$, the digit $${digit}$ moves to which place?`,
            `在 $${n} \\times ${fmt(m)} = ${fmt(n * m)}$ 中，数字 $${digit}$ 移到了哪一位？`,
          ),
          options: placeNames.slice(1, 5),
          correct: to - 1,
          solution: t(
            `Multiplying by $${fmt(m)}$ moves every digit ${k} place${k > 1 ? "s" : ""} to the left. The $${digit}$ was in the ${placeNames[from]!.en} place, so it moves to the ${placeNames[to]!.en} place.`,
            `乘 $${fmt(m)}$ 时，每个数字都向左移 ${k} 位。$${digit}$ 原来在${placeNames[from]!["zh-CN"]}，所以移到了${placeNames[to]!["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "pattern-of-zeros",
      title: t("The pattern of zeros", "末尾添 0 的规律"),
      explanation: t(
        "Because each digit moves left, multiplying a whole number by $10$, $100$ or $1{,}000$ is the same as writing $1$, $2$ or $3$ zeros at its end:\n\n$$36 \\times 10 = 360, \\quad 36 \\times 100 = 3{,}600, \\quad 36 \\times 1{,}000 = 36{,}000$$\n\nIf the number already ends in zeros, keep them: $250 \\times 100 = 25{,}000$.",
        "因为每个数字都向左移，所以整数乘 $10$、$100$ 或 $1{,}000$，就相当于在它的末尾添上 $1$、$2$ 或 $3$ 个 $0$：\n\n$$36 \\times 10 = 360, \\quad 36 \\times 100 = 3{,}600, \\quad 36 \\times 1{,}000 = 36{,}000$$\n\n如果这个数末尾本来就有 $0$，要保留：$250 \\times 100 = 25{,}000$。",
      ),
      generate(rng) {
        const n = rng.bool(0.25) ? 10 * rng.int(2, 99) : rng.int(2, 999);
        const m = rng.pick(powersOfTen);
        const p = n * m;
        return numberProblem({
          prompt: t(`Find $${fmt(n)} \\times ${fmt(m)}$.`, `计算 $${fmt(n)} \\times ${fmt(m)}$。`),
          answer: p,
          form: "integer",
          wrong: [p / 10, p * 10, n + m],
          solution: t(
            `Write ${String(m).length - 1} zero${m > 10 ? "s" : ""} at the end of $${fmt(n)}$: $${fmt(n)} \\times ${fmt(m)} = ${fmt(p)}$.`,
            `在 $${fmt(n)}$ 的末尾添上 ${String(m).length - 1} 个 $0$：$${fmt(n)} \\times ${fmt(m)} = ${fmt(p)}$。`,
          ),
        });
      },
    },
    {
      id: "which-power-of-ten",
      title: t("Which power of ten?", "乘的是哪一个"),
      explanation: t(
        "To find what a number was multiplied by, count how many places its digits moved. $52 \\times \\square = 5{,}200$: the digits moved two places, so $\\square = 100$.",
        "要找出一个数乘了多少，就数一数它的数字向左移了几位。$52 \\times \\square = 5{,}200$：数字向左移了两位，所以 $\\square = 100$。",
      ),
      generate(rng) {
        const n = rng.int(2, 999);
        const m = rng.pick(powersOfTen);
        const p = n * m;
        return numberProblem({
          prompt: t(
            `Find the missing number: $$${fmt(n)} \\times \\square = ${fmt(p)}$$`,
            `求方框中的数：$$${fmt(n)} \\times \\square = ${fmt(p)}$$`,
          ),
          answer: m,
          form: "integer",
          wrong: powersOfTen.filter((v) => v !== m),
          solution: t(
            `The digits of $${fmt(n)}$ moved ${String(m).length - 1} place${m > 10 ? "s" : ""} to the left, so the missing number is $${fmt(m)}$.`,
            `$${fmt(n)}$ 的数字向左移了 ${String(m).length - 1} 位，所以方框中的数是 $${fmt(m)}$。`,
          ),
        });
      },
    },
  ],
};

export const rewritingNumbersEndingInZeros: TopicDef = {
  id: "rewriting-numbers-ending-in-zeros",
  title: t("Rewriting Numbers Ending in Zeros", "改写末尾有 0 的数"),
  summary: t("Rewrite a number ending in zeros as a number of tens, hundreds or thousands.", "把末尾有 0 的数改写成若干个十、百或千。"),
  prerequisites: ["multiplying-by-10-100-and-1000"],
  encompasses: [{ topic: "multiplying-by-10-100-and-1000", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.4.NBT.A.1"],
  knowledgePoints: [
    {
      id: "counting-tens-and-hundreds",
      title: t("How many tens or hundreds?", "有多少个十或百"),
      explanation: t(
        "A number ending in zeros can be read as a number of tens, hundreds or thousands. Cover the zeros:\n\n- $3{,}400$ is $340$ tens, because $340 \\times 10 = 3{,}400$;\n- $3{,}400$ is $34$ hundreds, because $34 \\times 100 = 3{,}400$.",
        "末尾有 $0$ 的数可以看成若干个十、百或千。遮住末尾的 $0$ 来读：\n\n- $3{,}400$ 是 $340$ 个十，因为 $340 \\times 10 = 3{,}400$；\n- $3{,}400$ 是 $34$ 个百，因为 $34 \\times 100 = 3{,}400$。",
      ),
      generate(rng) {
        const unit = rng.pick([10, 100, 1000] as const);
        const count = rng.bool(0.3) ? 10 * rng.int(2, 30) : rng.int(2, 99);
        const n = unit * count;
        const name = { 10: t("tens", "十"), 100: t("hundreds", "百"), 1000: t("thousands", "千") }[unit];
        return numberProblem({
          prompt: t(`How many ${name.en} are in $${fmt(n)}$?`, `$${fmt(n)}$ 里有多少个${name["zh-CN"]}？`),
          answer: count,
          form: "integer",
          wrong: [count * 10, ...(count % 10 === 0 ? [count / 10] : []), n],
          solution: t(
            `$${fmt(count)} \\times ${fmt(unit)} = ${fmt(n)}$, so $${fmt(n)}$ is $${fmt(count)}$ ${name.en}.`,
            `$${fmt(count)} \\times ${fmt(unit)} = ${fmt(n)}$，所以 $${fmt(n)}$ 里有 $${fmt(count)}$ 个${name["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "rewriting-as-a-product",
      title: t("Rewriting as a product", "改写成乘法"),
      explanation: t(
        "Splitting off the zeros writes a number as a product: $6{,}000 = 6 \\times 1{,}000 = 60 \\times 100 = 600 \\times 10$.\n\nEach zero moved into the power of ten is one zero fewer in the other factor.",
        "把末尾的 $0$ 拆出来，就能把一个数写成乘法：$6{,}000 = 6 \\times 1{,}000 = 60 \\times 100 = 600 \\times 10$。\n\n10、100、1,000 中每多一个 $0$，另一个因数就少一个 $0$。",
      ),
      generate(rng) {
        const unit = rng.pick([10, 100, 1000] as const);
        const count = rng.bool(0.4) ? 10 * rng.int(2, 30) : rng.int(2, 99);
        const n = unit * count;
        return numberProblem({
          prompt: t(
            `Find the missing number: $$${fmt(n)} = \\square \\times ${fmt(unit)}$$`,
            `求方框中的数：$$${fmt(n)} = \\square \\times ${fmt(unit)}$$`,
          ),
          answer: count,
          form: "integer",
          wrong: [count * 10, ...(count % 10 === 0 ? [count / 10] : []), n - unit],
          solution: t(
            `$${fmt(unit)}$ takes ${String(unit).length - 1} zero${unit > 10 ? "s" : ""} from $${fmt(n)}$, which leaves $${fmt(count)}$: $${fmt(n)} = ${fmt(count)} \\times ${fmt(unit)}$.`,
            `$${fmt(unit)}$ 拿走了 $${fmt(n)}$ 末尾的 ${String(unit).length - 1} 个 $0$，剩下 $${fmt(count)}$：$${fmt(n)} = ${fmt(count)} \\times ${fmt(unit)}$。`,
          ),
        });
      },
    },
    {
      id: "equal-or-not",
      title: t("Which product is different?", "哪个乘法不相等"),
      explanation: t(
        "The same number can be rewritten in several ways, as long as the zeros add up. $4{,}200 = 42 \\times 100 = 420 \\times 10 = 42 \\times 10 \\times 10$.\n\nBut $42 \\times 1{,}000 = 42{,}000$, which has one zero too many.",
        "同一个数可以有几种改写方法，只要 $0$ 的个数合起来不变。$4{,}200 = 42 \\times 100 = 420 \\times 10 = 42 \\times 10 \\times 10$。\n\n但 $42 \\times 1{,}000 = 42{,}000$，多了一个 $0$。",
      ),
      generate(rng) {
        let a = rng.int(2, 99);
        while (a % 10 === 0) a = rng.int(2, 99);
        const n = 100 * a;
        const equal = [`${a} \\times 100`, `${fmt(10 * a)} \\times 10`, `${a} \\times 10 \\times 10`];
        const odd = rng.pick([`${a} \\times 1{,}000`, `${fmt(10 * a)} \\times 100`, `${a} \\times 10`]);
        const { options, correct } = shuffled(rng, math(odd), equal.map(math));
        return choiceProblem({
          prompt: t(`Which product is **not** equal to $${fmt(n)}$?`, `哪个乘法的结果**不**等于 $${fmt(n)}$？`),
          options,
          correct,
          solution: t(
            `$${fmt(n)}$ is $${a}$ followed by two zeros. $${odd}$ gives $${a}$ followed by a different number of zeros, so it is not equal to $${fmt(n)}$.`,
            `$${fmt(n)}$ 是 $${a}$ 后面跟两个 $0$。$${odd}$ 得到的是 $${a}$ 后面跟不同个数的 $0$，所以不等于 $${fmt(n)}$。`,
          ),
        });
      },
    },
  ],
};

/** endsInZeroFacts are basic facts whose product ends in zero. */
const endsInZeroFacts = [
  [2, 5],
  [4, 5],
  [5, 6],
  [5, 8],
  [5, 4],
  [6, 5],
  [8, 5],
  [5, 2],
] as const;

export const multiplyingNumbersEndingInZeros: TopicDef = {
  id: "multiplying-numbers-ending-in-zeros",
  title: t("Multiplying Numbers Ending in Zeros", "末尾有 0 的数相乘"),
  summary: t(
    "Multiply numbers such as 30 × 400 with a basic fact and the pattern of zeros.",
    "用乘法口诀和添 0 的规律计算 30 × 400 这样的乘法。",
  ),
  prerequisites: ["rewriting-numbers-ending-in-zeros"],
  encompasses: [
    { topic: "rewriting-numbers-ending-in-zeros", weight: 0.5 },
    { topic: "multiplying-by-10-100-and-1000", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "one-factor-ending-in-zeros",
      title: t("One factor ending in zeros", "一个因数末尾有 0"),
      explanation: t(
        "$6 \\times 400$ is $6$ times $4$ hundreds, which is $24$ hundreds:\n\n$$6 \\times 400 = 6 \\times 4 \\times 100 = 24 \\times 100 = 2{,}400$$\n\nMultiply the basic fact, then write the zeros.",
        "$6 \\times 400$ 是 $6$ 乘 $4$ 个百，等于 $24$ 个百：\n\n$$6 \\times 400 = 6 \\times 4 \\times 100 = 24 \\times 100 = 2{,}400$$\n\n先用口诀算出乘积，再添上末尾的 $0$。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const m = rng.pick(powersOfTen);
        const p = a * b * m;
        return numberProblem({
          prompt: t(`Find $${a} \\times ${fmt(b * m)}$.`, `计算 $${a} \\times ${fmt(b * m)}$。`),
          answer: p,
          form: "integer",
          wrong: [p / 10, p * 10, a + b * m],
          solution: t(
            `${steps(`${a} \\times ${fmt(b * m)} = ${a} \\times ${b} \\times ${fmt(m)} = ${a * b} \\times ${fmt(m)} = ${fmt(p)}`)}`,
            `${steps(`${a} \\times ${fmt(b * m)} = ${a} \\times ${b} \\times ${fmt(m)} = ${a * b} \\times ${fmt(m)} = ${fmt(p)}`)}`,
          ),
        });
      },
    },
    {
      id: "both-factors-ending-in-zeros",
      title: t("Both factors ending in zeros", "两个因数末尾都有 0"),
      explanation: t(
        "When both factors end in zeros, multiply the basic fact and then write **all** the zeros from both factors:\n\n$$30 \\times 400 = 3 \\times 4 \\times 10 \\times 100 = 12 \\times 1{,}000 = 12{,}000$$\n\nThere is one zero in $30$ and two in $400$, so the product ends in three zeros after $12$.",
        "两个因数末尾都有 $0$ 时，先用口诀算出乘积，再添上两个因数末尾**所有**的 $0$：\n\n$$30 \\times 400 = 3 \\times 4 \\times 10 \\times 100 = 12 \\times 1{,}000 = 12{,}000$$\n\n$30$ 末尾有一个 $0$，$400$ 末尾有两个，所以在 $12$ 后面添三个 $0$。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const j = rng.int(1, 2);
        const k = rng.int(1, 3 - j);
        const [x, y] = [a * 10 ** j, b * 10 ** k];
        const p = x * y;
        return numberProblem({
          prompt: t(`Find $${fmt(x)} \\times ${fmt(y)}$.`, `计算 $${fmt(x)} \\times ${fmt(y)}$。`),
          answer: p,
          form: "integer",
          wrong: [p / 10, p * 10, a * b * 10 ** Math.max(j, k)],
          solution: t(
            `The basic fact is $${a} \\times ${b} = ${a * b}$. The factors have ${j + k} zeros in all, so write ${j + k} zeros after $${a * b}$: $${fmt(x)} \\times ${fmt(y)} = ${fmt(p)}$.`,
            `口诀 $${a} \\times ${b} = ${a * b}$。两个因数末尾共有 ${j + k} 个 $0$，所以在 $${a * b}$ 后面添 ${j + k} 个 $0$：$${fmt(x)} \\times ${fmt(y)} = ${fmt(p)}$。`,
          ),
        });
      },
    },
    {
      id: "facts-ending-in-zero",
      title: t("When the basic fact ends in zero", "口诀的积末尾有 0"),
      explanation: t(
        "Be careful when the basic fact itself ends in zero: $5 \\times 4 = 20$. Then\n\n$$50 \\times 400 = 20 \\times 1{,}000 = 20{,}000$$\n\nThe product has **four** zeros: one from $20$ and three from the factors.",
        "当口诀的积本身末尾有 $0$ 时要小心：$5 \\times 4 = 20$。于是\n\n$$50 \\times 400 = 20 \\times 1{,}000 = 20{,}000$$\n\n积的末尾有**四个** $0$：一个来自 $20$，三个来自两个因数。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(endsInZeroFacts);
        const j = rng.int(0, 2);
        const k = rng.int(j === 0 ? 1 : 0, 3 - j);
        const [x, y] = [a * 10 ** j, b * 10 ** k];
        const p = x * y;
        return numberProblem({
          prompt: t(`Find $${fmt(x)} \\times ${fmt(y)}$.`, `计算 $${fmt(x)} \\times ${fmt(y)}$。`),
          answer: p,
          form: "integer",
          wrong: [p / 10, p * 10],
          solution: t(
            `$${a} \\times ${b} = ${a * b}$, and the factors have ${j + k} zero${j + k > 1 ? "s" : ""} in all: $${fmt(x)} \\times ${fmt(y)} = ${a * b} \\times ${fmt(10 ** (j + k))} = ${fmt(p)}$.`,
            `$${a} \\times ${b} = ${a * b}$，两个因数末尾共有 ${j + k} 个 $0$：$${fmt(x)} \\times ${fmt(y)} = ${a * b} \\times ${fmt(10 ** (j + k))} = ${fmt(p)}$。`,
          ),
        });
      },
    },
  ],
};

export const multiplyingUsingRepeatedAddition: TopicDef = {
  id: "multiplying-using-repeated-addition",
  title: t("Multiplying Using Repeated Addition", "用连加做乘法"),
  summary: t(
    "Multiply by adding equal groups, and use a known product to find the next one.",
    "通过把相同的数连加来做乘法，并用已知的积求下一个积。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [{ topic: "products-and-factors", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.3.OA.A.1", "CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "equal-groups",
      title: t("Multiplication as equal groups", "乘法就是几个相同的数相加"),
      explanation: t(
        "$4 \\times 23$ means $4$ groups of $23$. So it is the same as adding $23$ four times:\n\n$$4 \\times 23 = 23 + 23 + 23 + 23$$",
        "$4 \\times 23$ 表示 $4$ 个 $23$，所以它等于把 $23$ 加四次：\n\n$$4 \\times 23 = 23 + 23 + 23 + 23$$",
      ),
      generate(rng) {
        const a = rng.int(3, 5);
        const b = rng.int(11, 49);
        const rep = (x: number, k: number) => Array.from({ length: k }, () => String(x)).join(" + ");
        const { options, correct } = shuffled(rng, math(rep(b, a)), [math(rep(b, a - 1)), math(rep(b, a + 1)), math(`${a} + ${b}`)]);
        return choiceProblem({
          prompt: t(`Which addition has the same value as $${a} \\times ${b}$?`, `哪个加法算式与 $${a} \\times ${b}$ 的值相等？`),
          options,
          correct,
          solution: t(
            `$${a} \\times ${b}$ means $${a}$ groups of $${b}$: $${rep(b, a)}$.`,
            `$${a} \\times ${b}$ 表示 $${a}$ 个 $${b}$：$${rep(b, a)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-the-groups",
      title: t("Adding the groups", "把各组加起来"),
      explanation: t(
        "To find $3 \\times 27$, add three $27$s, one at a time:\n\n$$27 + 27 = 54, \\quad 54 + 27 = 81$$\n\nSo $3 \\times 27 = 81$.",
        "求 $3 \\times 27$，就把三个 $27$ 一个一个加起来：\n\n$$27 + 27 = 54, \\quad 54 + 27 = 81$$\n\n所以 $3 \\times 27 = 81$。",
      ),
      generate(rng) {
        const a = rng.int(2, 4);
        const b = rng.int(12, 99);
        const p = a * b;
        const partial = Array.from({ length: a - 1 }, (_, i) => `${fmt(b * (i + 1))} + ${b} = ${fmt(b * (i + 2))}`);
        return numberProblem({
          prompt: t(`Use repeated addition to find $${a} \\times ${b}$.`, `用连加计算 $${a} \\times ${b}$。`),
          answer: p,
          form: "integer",
          wrong: [p - b, p + b, a + b, p - 10],
          solution: t(
            `Add $${b}$ ${a} times:${steps(...partial)}So $${a} \\times ${b} = ${fmt(p)}$.`,
            `把 $${b}$ 加 ${a} 次：${steps(...partial)}所以 $${a} \\times ${b} = ${fmt(p)}$。`,
          ),
        });
      },
    },
    {
      id: "one-more-group",
      title: t("One more group", "再加一组"),
      explanation: t(
        "If you know $5 \\times 18 = 90$, then $6 \\times 18$ is one more group of $18$:\n\n$$6 \\times 18 = 5 \\times 18 + 18 = 90 + 18 = 108$$\n\nAdd the group, $18$, not the $6$.",
        "如果知道 $5 \\times 18 = 90$，那么 $6 \\times 18$ 就是再多一组 $18$：\n\n$$6 \\times 18 = 5 \\times 18 + 18 = 90 + 18 = 108$$\n\n要加的是一组 $18$，而不是 $6$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 5, 10, 10, 20]);
        const b = rng.int(12, 49);
        const known = a * b;
        const p = known + b;
        return numberProblem({
          prompt: t(
            `Use $${a} \\times ${b} = ${fmt(known)}$ to find $${a + 1} \\times ${b}$.`,
            `利用 $${a} \\times ${b} = ${fmt(known)}$ 求 $${a + 1} \\times ${b}$。`,
          ),
          answer: p,
          form: "integer",
          wrong: [known + a + 1, known + 1, known + 2 * b, known],
          solution: t(
            `$${a + 1} \\times ${b}$ is one more group of $${b}$ than $${a} \\times ${b}$:${steps(`${a + 1} \\times ${b} = ${fmt(known)} + ${b} = ${fmt(p)}`)}`,
            `$${a + 1} \\times ${b}$ 比 $${a} \\times ${b}$ 多一组 $${b}$：${steps(`${a + 1} \\times ${b} = ${fmt(known)} + ${b} = ${fmt(p)}`)}`,
          ),
        });
      },
    },
  ],
};

export const multiplyingUsingRepeatedSubtraction: TopicDef = {
  id: "multiplying-using-repeated-subtraction",
  title: t("Multiplying Using Repeated Subtraction", "用减去一组的方法做乘法"),
  summary: t(
    "Multiply by a number just below a ten or hundred by taking away a group: 9 × 24 = 10 × 24 − 24.",
    "乘一个接近整十或整百的数时，先多乘再减去一组：9 × 24 = 10 × 24 − 24。",
  ),
  prerequisites: ["multiplying-using-repeated-addition", "multiplying-numbers-ending-in-zeros"],
  encompasses: [
    { topic: "multiplying-using-repeated-addition", weight: 0.4 },
    { topic: "multiplying-numbers-ending-in-zeros", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "one-group-fewer",
      title: t("One group fewer", "少一组"),
      explanation: t(
        "$9 \\times 24$ is one group of $24$ fewer than $10 \\times 24$:\n\n$$9 \\times 24 = 10 \\times 24 - 24 = 240 - 24 = 216$$\n\nSubtract the group, $24$, not the $9$ or the $10$.",
        "$9 \\times 24$ 比 $10 \\times 24$ 少一组 $24$：\n\n$$9 \\times 24 = 10 \\times 24 - 24 = 240 - 24 = 216$$\n\n要减去的是一组 $24$，而不是 $9$ 或 $10$。",
      ),
      generate(rng) {
        const a = rng.pick([10, 10, 5, 20]);
        const b = rng.int(12, 49);
        const known = a * b;
        const p = known - b;
        return numberProblem({
          prompt: t(
            `Use $${a} \\times ${b} = ${fmt(known)}$ to find $${a - 1} \\times ${b}$.`,
            `利用 $${a} \\times ${b} = ${fmt(known)}$ 求 $${a - 1} \\times ${b}$。`,
          ),
          answer: p,
          form: "integer",
          wrong: [known - (a - 1), known - a, known + b, known - 1],
          solution: t(
            `$${a - 1} \\times ${b}$ is one group of $${b}$ fewer than $${a} \\times ${b}$:${steps(`${a - 1} \\times ${b} = ${fmt(known)} - ${b} = ${fmt(p)}`)}`,
            `$${a - 1} \\times ${b}$ 比 $${a} \\times ${b}$ 少一组 $${b}$：${steps(`${a - 1} \\times ${b} = ${fmt(known)} - ${b} = ${fmt(p)}`)}`,
          ),
        });
      },
    },
    {
      id: "just-below-a-ten",
      title: t("Factors just below a ten or a hundred", "接近整十或整百的因数"),
      explanation: t(
        "A factor such as $19$, $49$ or $99$ is one less than a number ending in zero. Multiply by the round number, then subtract one group:\n\n$$19 \\times 6 = 20 \\times 6 - 6 = 120 - 6 = 114$$",
        "像 $19$、$49$、$99$ 这样的因数，比一个末尾是 $0$ 的数少 $1$。先乘这个整数，再减去一组：\n\n$$19 \\times 6 = 20 \\times 6 - 6 = 120 - 6 = 114$$",
      ),
      generate(rng) {
        const round = rng.pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 200]);
        const a = rng.int(3, 9);
        const n = round - 1;
        const p = n * a;
        const product = rng.bool() ? `${n} \\times ${a}` : `${a} \\times ${n}`;
        return numberProblem({
          prompt: t(`Find $${product}$ by first multiplying by $${round}$.`, `先乘 $${round}$，再计算 $${product}$。`),
          answer: p,
          form: "integer",
          wrong: [round * a - 1, round * a, round * a + a],
          solution: t(
            `$${n}$ is $1$ less than $${round}$, so take away one group of $${a}$:${steps(`${round} \\times ${a} - ${a} = ${fmt(round * a)} - ${a} = ${fmt(p)}`)}`,
            `$${n}$ 比 $${round}$ 少 $1$，所以减去一组 $${a}$：${steps(`${round} \\times ${a} - ${a} = ${fmt(round * a)} - ${a} = ${fmt(p)}`)}`,
          ),
        });
      },
    },
  ],
};

export const estimatingMultiDigitMultiplication: TopicDef = {
  id: "estimating-multi-digit-multiplication",
  title: t("Estimating Multi-Digit Multiplication", "估算多位数乘法"),
  summary: t("Estimate a product by rounding the factors and multiplying the rounded numbers.", "把因数取近似数再相乘，估算乘积。"),
  prerequisites: ["multiplying-numbers-ending-in-zeros"],
  encompasses: [{ topic: "multiplying-numbers-ending-in-zeros", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.NBT.B.5", "CCSS.4.OA.A.3"],
  knowledgePoints: [
    {
      id: "rounding-one-factor",
      title: t("Rounding one factor", "把一个因数取近似数"),
      explanation: t(
        "To estimate $47 \\times 6$, round $47$ to the nearest ten, $50$, and multiply: $50 \\times 6 = 300$. The exact product, $282$, is close to $300$.",
        "估算 $47 \\times 6$ 时，把 $47$ 四舍五入到整十数 $50$，再相乘：$50 \\times 6 = 300$。准确的积 $282$ 接近 $300$。",
      ),
      generate(rng) {
        let n = rng.int(12, 98);
        while (n % 10 === 0) n = rng.int(12, 98);
        const a = rng.int(3, 9);
        const r = round10(n);
        const other = r === Math.floor(n / 10) * 10 ? r + 10 : r - 10;
        return numberProblem({
          prompt: t(
            `Estimate $${n} \\times ${a}$ by rounding $${n}$ to the nearest ten.`,
            `把 $${n}$ 四舍五入到整十数，估算 $${n} \\times ${a}$。`,
          ),
          answer: r * a,
          form: "integer",
          wrong: [n * a, other * a, r + a],
          solution: t(
            `$${n}$ rounds to $${r}$:${steps(`${n} \\times ${a} \\approx ${r} \\times ${a} = ${fmt(r * a)}`)}`,
            `$${n}$ 约等于 $${r}$：${steps(`${n} \\times ${a} \\approx ${r} \\times ${a} = ${fmt(r * a)}`)}`,
          ),
        });
      },
    },
    {
      id: "rounding-both-factors",
      title: t("Rounding both factors", "把两个因数都取近似数"),
      explanation: t(
        "When both factors have two digits, round each to the nearest ten:\n\n$$38 \\times 52 \\approx 40 \\times 50 = 2{,}000$$",
        "两个因数都是两位数时，把它们都四舍五入到整十数：\n\n$$38 \\times 52 \\approx 40 \\times 50 = 2{,}000$$",
      ),
      generate(rng) {
        const pick = () => {
          let n = rng.int(12, 98);
          while (n % 10 === 0) n = rng.int(12, 98);
          return n;
        };
        const [x, y] = [pick(), pick()];
        const [rx, ry] = [round10(x), round10(y)];
        return numberProblem({
          prompt: t(
            `Estimate $${x} \\times ${y}$ by rounding each factor to the nearest ten.`,
            `把两个因数都四舍五入到整十数，估算 $${x} \\times ${y}$。`,
          ),
          answer: rx * ry,
          form: "integer",
          wrong: [x * y, rx * y, (rx * ry) / 10, Math.floor(x / 10) * 10 * Math.floor(y / 10) * 10],
          solution: t(
            `$${x}$ rounds to $${rx}$ and $${y}$ rounds to $${ry}$:${steps(`${x} \\times ${y} \\approx ${rx} \\times ${ry} = ${fmt(rx * ry)}`)}`,
            `$${x}$ 约等于 $${rx}$，$${y}$ 约等于 $${ry}$：${steps(`${x} \\times ${y} \\approx ${rx} \\times ${ry} = ${fmt(rx * ry)}`)}`,
          ),
        });
      },
    },
    {
      id: "rounding-to-hundreds",
      title: t("Rounding to the nearest hundred", "取整百数"),
      explanation: t(
        "For a three-digit factor, round to the nearest hundred:\n\n$$412 \\times 7 \\approx 400 \\times 7 = 2{,}800$$",
        "三位数的因数可以四舍五入到整百数：\n\n$$412 \\times 7 \\approx 400 \\times 7 = 2{,}800$$",
      ),
      generate(rng) {
        let n = rng.int(110, 949);
        while (n % 100 === 0 || n % 100 === 50) n = rng.int(110, 949);
        const a = rng.int(3, 9);
        const r = round100(n);
        const other = r === Math.floor(n / 100) * 100 ? r + 100 : r - 100;
        return numberProblem({
          prompt: t(
            `Estimate $${n} \\times ${a}$ by rounding $${n}$ to the nearest hundred.`,
            `把 $${n}$ 四舍五入到整百数，估算 $${n} \\times ${a}$。`,
          ),
          answer: r * a,
          form: "integer",
          wrong: [n * a, other * a, round10(n) * a],
          solution: t(
            `$${n}$ rounds to $${r}$:${steps(`${n} \\times ${a} \\approx ${r} \\times ${a} = ${fmt(r * a)}`)}`,
            `$${n}$ 约等于 $${r}$：${steps(`${n} \\times ${a} \\approx ${r} \\times ${a} = ${fmt(r * a)}`)}`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Multiplying with models and place value

/** twoDigit draws a two-digit number whose ones digit is not zero. */
function twoDigit(rng: Rng, lo = 12, hi = 99): number {
  for (;;) {
    const n = rng.int(lo, hi);
    if (n % 10 !== 0) return n;
  }
}

/** oneRowModel draws the area model of a × n with the parts of n on top and the given cell texts. */
const oneRowModel = (a: number, parts: readonly number[], cells: readonly string[]) =>
  areaModel(parts, [a], parts.map(plain), [String(a)], [cells]);

export const twoDigitByOneDigitMultiplicationUsingAreaModels: TopicDef = {
  id: "two-digit-by-one-digit-multiplication-using-area-models",
  title: t("Two-Digit by One-Digit Multiplication Using Area Models", "用面积模型计算两位数乘一位数"),
  summary: t(
    "Multiply a two-digit number by a one-digit number by splitting a rectangle into tens and ones.",
    "把长方形分成整十部分和个位部分，计算两位数乘一位数。",
  ),
  prerequisites: ["multiplying-numbers-ending-in-zeros"],
  encompasses: [{ topic: "multiplying-numbers-ending-in-zeros", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "parts-of-the-model",
      title: t("The parts of an area model", "面积模型的各部分"),
      explanation: t(
        "A rectangle that is $6$ wide and $47$ long has area $6 \\times 47$. Split the long side into tens and ones, $47 = 40 + 7$, to make two smaller rectangles:\n\n- the tens part has area $6 \\times 40 = 240$;\n- the ones part has area $6 \\times 7 = 42$.",
        "宽 $6$、长 $47$ 的长方形，面积是 $6 \\times 47$。把长边分成整十和个位，$47 = 40 + 7$，就得到两个小长方形：\n\n- 整十部分的面积是 $6 \\times 40 = 240$；\n- 个位部分的面积是 $6 \\times 7 = 42$。",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        const n = twoDigit(rng);
        const parts = places(n);
        const ask = rng.int(0, 1);
        const part = parts[ask]!;
        const cells = parts.map((_, i) => (i === ask ? "?" : ""));
        return {
          ...numberProblem({
            prompt: t(
              `The area model shows $${a} \\times ${n}$. What is the area of the part marked ?`,
              `面积模型表示 $${a} \\times ${n}$。标有 ? 的部分面积是多少？`,
            ),
            answer: a * part,
            form: "integer",
            wrong: [ask === 0 ? (a * part) / 10 : a * parts[0]!, a + part, a * n],
            solution: t(
              `That part is $${a}$ by $${part}$: its area is $${a} \\times ${part} = ${a * part}$.`,
              `这一部分宽 $${a}$、长 $${part}$，面积是 $${a} \\times ${part} = ${a * part}$。`,
            ),
          }),
          figure: figure(
            oneRowModel(a, parts, cells),
            `A rectangle ${a} tall, split into widths ${parts.join(" and ")}.`,
            `一个高 ${a} 的长方形，分成宽 ${parts.join(" 和 ")} 的两部分。`,
          ),
        };
      },
    },
    {
      id: "adding-the-parts",
      title: t("Adding the parts", "把各部分相加"),
      explanation: t(
        "The whole area is the sum of the parts:\n\n$$6 \\times 47 = 6 \\times 40 + 6 \\times 7 = 240 + 42 = 282$$",
        "整个长方形的面积等于各部分面积之和：\n\n$$6 \\times 47 = 6 \\times 40 + 6 \\times 7 = 240 + 42 = 282$$",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        const n = twoDigit(rng);
        const [tens, ones] = places(n) as [number, number];
        const p = a * n;
        return {
          ...numberProblem({
            prompt: t(`Use the area model to find $${a} \\times ${n}$.`, `用面积模型计算 $${a} \\times ${n}$。`),
            answer: p,
            form: "integer",
            wrong: [a * (tens / 10) + a * ones, a * tens + ones, a * tens, noCarry(n, a)],
            solution: t(
              `${steps(`${a} \\times ${tens} = ${a * tens}`, `${a} \\times ${ones} = ${a * ones}`, `${a * tens} + ${a * ones} = ${p}`)}So $${a} \\times ${n} = ${p}$.`,
              `${steps(`${a} \\times ${tens} = ${a * tens}`, `${a} \\times ${ones} = ${a * ones}`, `${a * tens} + ${a * ones} = ${p}`)}所以 $${a} \\times ${n} = ${p}$。`,
            ),
          }),
          figure: figure(
            oneRowModel(a, [tens, ones], ["", ""]),
            `A rectangle ${a} tall, split into widths ${tens} and ${ones}.`,
            `一个高 ${a} 的长方形，分成宽 ${tens} 和 ${ones} 的两部分。`,
          ),
        };
      },
    },
  ],
};

export const multiDigitByOneDigitMultiplicationUsingAreaModels: TopicDef = {
  id: "multi-digit-by-one-digit-multiplication-using-area-models",
  title: t("Multi-Digit by One-Digit Multiplication Using Area Models", "用面积模型计算多位数乘一位数"),
  summary: t("Multiply a three- or four-digit number by a one-digit number with an area model.", "用面积模型计算三位数或四位数乘一位数。"),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-area-models"],
  encompasses: [{ topic: "two-digit-by-one-digit-multiplication-using-area-models", weight: 0.8 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "hundreds-tens-and-ones",
      title: t("Hundreds, tens and ones", "百、十和一"),
      explanation: t(
        "Split a three-digit number into hundreds, tens and ones, and the area model has three parts. For $4 \\times 326$, split $326 = 300 + 20 + 6$:\n\n$$4 \\times 300 = 1{,}200, \\quad 4 \\times 20 = 80, \\quad 4 \\times 6 = 24$$",
        "把三位数分成百、十和一，面积模型就有三部分。计算 $4 \\times 326$ 时，把它分成 $326 = 300 + 20 + 6$：\n\n$$4 \\times 300 = 1{,}200, \\quad 4 \\times 20 = 80, \\quad 4 \\times 6 = 24$$",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        let n = rng.int(111, 999);
        while (places(n).length < 3) n = rng.int(111, 999);
        const parts = places(n);
        const ask = rng.int(0, 2);
        const part = parts[ask]!;
        const cells = parts.map((p, i) => (i === ask ? "?" : plain(a * p)));
        return {
          ...numberProblem({
            prompt: t(
              `The area model shows $${a} \\times ${n}$. What is the area of the part marked ?`,
              `面积模型表示 $${a} \\times ${n}$。标有 ? 的部分面积是多少？`,
            ),
            answer: a * part,
            form: "integer",
            wrong: [ask < 2 ? (a * part) / 10 : a * part * 10, a + part, a * n],
            solution: t(
              `That part is $${a}$ by $${part}$: $${a} \\times ${part} = ${fmt(a * part)}$.`,
              `这一部分宽 $${a}$、长 $${part}$：$${a} \\times ${part} = ${fmt(a * part)}$。`,
            ),
          }),
          figure: figure(
            oneRowModel(a, parts, cells),
            `A rectangle ${a} tall, split into widths ${parts.join(", ")}.`,
            `一个高 ${a} 的长方形，分成宽 ${parts.join("、")} 的几部分。`,
          ),
        };
      },
    },
    {
      id: "multi-digit-products",
      title: t("Finding the whole product", "求出整个乘积"),
      explanation: t(
        "Add the areas of all the parts. For $4 \\times 2{,}315$, split $2{,}315 = 2{,}000 + 300 + 10 + 5$:\n\n$$8{,}000 + 1{,}200 + 40 + 20 = 9{,}260$$",
        "把所有部分的面积相加。计算 $4 \\times 2{,}315$ 时，把它分成 $2{,}315 = 2{,}000 + 300 + 10 + 5$：\n\n$$8{,}000 + 1{,}200 + 40 + 20 = 9{,}260$$",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        const n = rng.bool() ? rng.int(101, 999) : rng.int(1001, 9999);
        const parts = places(n);
        const p = a * n;
        return {
          ...numberProblem({
            prompt: t(`Use an area model to find $${a} \\times ${fmt(n)}$.`, `用面积模型计算 $${a} \\times ${fmt(n)}$。`),
            answer: p,
            form: "integer",
            wrong: [noCarry(n, a), p - a * parts[parts.length - 1]!, p + 10 * a],
            solution: t(
              `${steps(...parts.map((q) => `${a} \\times ${fmt(q)} = ${fmt(a * q)}`), `${parts.map((q) => fmt(a * q)).join(" + ")} = ${fmt(p)}`)}`,
              `${steps(...parts.map((q) => `${a} \\times ${fmt(q)} = ${fmt(a * q)}`), `${parts.map((q) => fmt(a * q)).join(" + ")} = ${fmt(p)}`)}`,
            ),
          }),
          figure: figure(
            oneRowModel(
              a,
              parts,
              parts.map(() => ""),
            ),
            `A rectangle ${a} tall, split into widths ${parts.join(", ")}.`,
            `一个高 ${a} 的长方形，分成宽 ${parts.join("、")} 的几部分。`,
          ),
        };
      },
    },
  ],
};

export const twoDigitByOneDigitMultiplicationUsingPlaceValue: TopicDef = {
  id: "two-digit-by-one-digit-multiplication-using-place-value",
  title: t("Two-Digit by One-Digit Multiplication Using Place Value", "用数位计算两位数乘一位数"),
  summary: t(
    "Multiply a two-digit number by a one-digit number with partial products and the standard algorithm.",
    "用部分积和竖式计算两位数乘一位数。",
  ),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-area-models"],
  encompasses: [{ topic: "two-digit-by-one-digit-multiplication-using-area-models", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "partial-products",
      title: t("Partial products", "部分积"),
      explanation: t(
        "Without drawing the rectangle, multiply each place of the two-digit number separately. These are the **partial products**:\n\n$$6 \\times 47: \\quad 6 \\times 7 = 42, \\quad 6 \\times 40 = 240$$\n\nThe $4$ in $47$ means $40$, so its partial product is $240$, not $24$.",
        "不画长方形，也可以把两位数的每一位分别相乘，得到的积叫作**部分积**：\n\n$$6 \\times 47: \\quad 6 \\times 7 = 42, \\quad 6 \\times 40 = 240$$\n\n$47$ 中的 $4$ 表示 $40$，所以它的部分积是 $240$，而不是 $24$。",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        const n = twoDigit(rng, 21);
        const [tens, ones] = places(n) as [number, number];
        return numberProblem({
          prompt: t(
            `To find $${a} \\times ${n}$ with partial products, what is the partial product for the tens digit?`,
            `用部分积计算 $${a} \\times ${n}$ 时，十位上的数字对应的部分积是多少？`,
          ),
          answer: a * tens,
          form: "integer",
          wrong: [(a * tens) / 10, a * ones, a * n],
          solution: t(
            `The tens digit of $${n}$ stands for $${tens}$, so the partial product is $${a} \\times ${tens} = ${a * tens}$.`,
            `$${n}$ 十位上的数字表示 $${tens}$，所以部分积是 $${a} \\times ${tens} = ${a * tens}$。`,
          ),
        });
      },
    },
    {
      id: "regrouping",
      title: t("Regrouping in the standard algorithm", "竖式中的进位"),
      explanation: t(
        "The **standard algorithm** multiplies the ones first. For $6 \\times 47$: $6 \\times 7 = 42$. Write the $2$ in the ones column and **regroup** the $4$ tens: carry it to the tens column.\n\nThen multiply the tens, $6 \\times 4 = 24$, and add the carried $4$: $24 + 4 = 28$ tens. So $6 \\times 47 = 282$.",
        "**竖式**从个位乘起。计算 $6 \\times 47$：$6 \\times 7 = 42$，在个位写 $2$，把 $4$ 个十**进位**到十位。\n\n再乘十位：$6 \\times 4 = 24$，加上进上来的 $4$，得 $24 + 4 = 28$ 个十。所以 $6 \\times 47 = 282$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(3, 9);
          const n = twoDigit(rng, 21);
          const ones = n % 10;
          const carry = Math.floor((a * ones) / 10);
          if (carry === 0 || carry === (a * ones) % 10) continue;
          return numberProblem({
            prompt: t(
              `In the standard algorithm for $${a} \\times ${n}$, you first find $${a} \\times ${ones} = ${a * ones}$. What digit do you regroup to the tens column?`,
              `用竖式计算 $${a} \\times ${n}$ 时，先算 $${a} \\times ${ones} = ${a * ones}$。要向十位进几？`,
            ),
            answer: carry,
            form: "integer",
            wrong: [(a * ones) % 10, a * ones],
            solution: t(
              `$${a * ones}$ is $${carry}$ tens and $${(a * ones) % 10}$ ones. Write the $${(a * ones) % 10}$ in the ones column and regroup the $${carry}$ tens.`,
              `$${a * ones}$ 是 $${carry}$ 个十和 $${(a * ones) % 10}$ 个一。在个位写 $${(a * ones) % 10}$，向十位进 $${carry}$。`,
            ),
          });
        }
      },
    },
    {
      id: "standard-algorithm",
      title: t("The standard algorithm", "竖式计算"),
      explanation: t(
        "Multiply the ones, write the ones digit and regroup the tens. Then multiply the tens and add the regrouped tens.\n\n$$7 \\times 38: \\quad 7 \\times 8 = 56, \\text{ write } 6, \\text{ regroup } 5; \\quad 7 \\times 3 + 5 = 26$$\n\nSo $7 \\times 38 = 266$.",
        "先乘个位，写下个位数字，把十位数字进上去；再乘十位，加上进上来的数。\n\n$$7 \\times 38: \\quad 7 \\times 8 = 56, \\text{ 写 } 6, \\text{ 进 } 5; \\quad 7 \\times 3 + 5 = 26$$\n\n所以 $7 \\times 38 = 266$。",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        const n = twoDigit(rng, 13);
        const [tensDigit, ones] = [Math.floor(n / 10), n % 10];
        const carry = Math.floor((a * ones) / 10);
        const p = a * n;
        return numberProblem({
          prompt: t(`Find $${a} \\times ${n}$.`, `计算 $${a} \\times ${n}$。`),
          answer: p,
          form: "integer",
          wrong: [
            noCarry(n, a),
            a * tensDigit * 10 + ((a * ones) % 10),
            a * (tensDigit + carry) * 10 + ((a * ones) % 10),
            Number(`${a * tensDigit}${a * ones}`),
          ],
          solution: t(
            `Ones: $${a} \\times ${ones} = ${a * ones}$; write $${(a * ones) % 10}$${carry ? ` and regroup $${carry}$` : ""}. Tens: $${a} \\times ${tensDigit}${carry ? ` + ${carry}` : ""} = ${a * tensDigit + carry}$. So $${a} \\times ${n} = ${p}$.`,
            `个位：$${a} \\times ${ones} = ${a * ones}$，写 $${(a * ones) % 10}$${carry ? `，进 $${carry}$` : ""}。十位：$${a} \\times ${tensDigit}${carry ? ` + ${carry}` : ""} = ${a * tensDigit + carry}$。所以 $${a} \\times ${n} = ${p}$。`,
          ),
        });
      },
    },
  ],
};

/** algorithmSteps describes the standard algorithm for a × n column by column, in English and Chinese. */
function algorithmSteps(n: number, a: number): { en: string; zh: string } {
  const digits = [...String(n)].reverse().map(Number);
  const names = placeNames;
  const en: string[] = [];
  const zh: string[] = [];
  let carry = 0;
  digits.forEach((d, i) => {
    const v = a * d + carry;
    const expr = `${a} \\times ${d}${carry ? ` + ${carry}` : ""} = ${v}`;
    const last = i === digits.length - 1;
    const next = last ? 0 : Math.floor(v / 10);
    en.push(`${names[i]!.en}: $${expr}$${last ? "" : `, write $${v % 10}$${next ? `, regroup $${next}$` : ""}`}`);
    zh.push(`${names[i]!["zh-CN"]}：$${expr}$${last ? "" : `，写 $${v % 10}$${next ? `，进 $${next}$` : ""}`}`);
    carry = next;
  });
  return { en: en.join("; "), zh: zh.join("；") };
}

export const multiDigitByOneDigitMultiplicationUsingPlaceValue: TopicDef = {
  id: "multi-digit-by-one-digit-multiplication-using-place-value",
  title: t("Multi-Digit by One-Digit Multiplication Using Place Value", "用数位计算多位数乘一位数"),
  summary: t(
    "Multiply a three- or four-digit number by a one-digit number with the standard algorithm.",
    "用竖式计算三位数或四位数乘一位数。",
  ),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-place-value"],
  encompasses: [{ topic: "two-digit-by-one-digit-multiplication-using-place-value", weight: 0.8 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "three-digit-numbers",
      title: t("Three-digit numbers", "三位数乘一位数"),
      explanation: t(
        "Work from right to left: ones, then tens, then hundreds. At each step, multiply, add what was regrouped, write one digit and regroup the rest.\n\n$4 \\times 357$: ones $4 \\times 7 = 28$, write $8$, regroup $2$; tens $4 \\times 5 + 2 = 22$, write $2$, regroup $2$; hundreds $4 \\times 3 + 2 = 14$. So $4 \\times 357 = 1{,}428$.",
        "从右往左算：先个位，再十位，再百位。每一步都先乘，再加上进上来的数，写下一位数字，把其余的进到下一位。\n\n$4 \\times 357$：个位 $4 \\times 7 = 28$，写 $8$，进 $2$；十位 $4 \\times 5 + 2 = 22$，写 $2$，进 $2$；百位 $4 \\times 3 + 2 = 14$。所以 $4 \\times 357 = 1{,}428$。",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        const n = rng.int(102, 999);
        const p = a * n;
        const s = algorithmSteps(n, a);
        return numberProblem({
          prompt: t(`Find $${a} \\times ${n}$.`, `计算 $${a} \\times ${n}$。`),
          answer: p,
          form: "integer",
          wrong: [noCarry(n, a), p - 100, p + 10],
          solution: t(`${s.en}. So $${a} \\times ${n} = ${fmt(p)}$.`, `${s.zh}。所以 $${a} \\times ${n} = ${fmt(p)}$。`),
        });
      },
    },
    {
      id: "four-digit-numbers",
      title: t("Four-digit numbers", "四位数乘一位数"),
      explanation: t(
        "A four-digit number takes one more step, the thousands. A zero digit still needs its step: in $3 \\times 2{,}045$, the tens step is $3 \\times 4 + 1 = 13$ and the hundreds step is $3 \\times 0 + 1 = 1$.",
        "四位数要多算一步：千位。数字是 $0$ 的数位也要算：在 $3 \\times 2{,}045$ 中，十位是 $3 \\times 4 + 1 = 13$，百位是 $3 \\times 0 + 1 = 1$。",
      ),
      generate(rng) {
        const a = rng.int(3, 9);
        const n = rng.int(1002, 9999);
        const p = a * n;
        const s = algorithmSteps(n, a);
        return numberProblem({
          prompt: t(`Find $${a} \\times ${fmt(n)}$.`, `计算 $${a} \\times ${fmt(n)}$。`),
          answer: p,
          form: "integer",
          wrong: [noCarry(n, a), p - 1000, p + 100],
          solution: t(`${s.en}. So $${a} \\times ${fmt(n)} = ${fmt(p)}$.`, `${s.zh}。所以 $${a} \\times ${fmt(n)} = ${fmt(p)}$。`),
        });
      },
    },
  ],
};

export const twoDigitByTwoDigitMultiplicationUsingAreaModels: TopicDef = {
  id: "two-digit-by-two-digit-multiplication-using-area-models",
  title: t("Two-Digit by Two-Digit Multiplication Using Area Models", "用面积模型计算两位数乘两位数"),
  summary: t("Multiply two two-digit numbers with an area model split into four parts.", "用分成四部分的面积模型计算两位数乘两位数。"),
  prerequisites: ["two-digit-by-one-digit-multiplication-using-area-models"],
  encompasses: [
    { topic: "two-digit-by-one-digit-multiplication-using-area-models", weight: 0.6 },
    { topic: "multiplying-numbers-ending-in-zeros", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "four-parts",
      title: t("The four parts", "四个部分"),
      explanation: t(
        "For $23 \\times 45$, split both numbers into tens and ones: $23 = 20 + 3$ and $45 = 40 + 5$. The rectangle splits into four parts:\n\n$$20 \\times 40 = 800, \\quad 20 \\times 5 = 100, \\quad 3 \\times 40 = 120, \\quad 3 \\times 5 = 15$$\n\nTens times tens gives hundreds: $20 \\times 40 = 800$, not $80$.",
        "计算 $23 \\times 45$ 时，把两个数都分成整十和个位：$23 = 20 + 3$，$45 = 40 + 5$。长方形被分成四部分：\n\n$$20 \\times 40 = 800, \\quad 20 \\times 5 = 100, \\quad 3 \\times 40 = 120, \\quad 3 \\times 5 = 15$$\n\n整十乘整十得到整百：$20 \\times 40 = 800$，而不是 $80$。",
      ),
      generate(rng) {
        const x = twoDigit(rng);
        const y = twoDigit(rng);
        const cols = places(x);
        const rows = places(y);
        const [i, j] = [rng.int(0, 1), rng.int(0, 1)];
        const [c, r] = [cols[i]!, rows[j]!];
        const cells = rows.map((rv, jj) => cols.map((cv, ii) => (ii === i && jj === j ? "?" : plain(rv * cv))));
        const wrongs = [
          i === 0 && j === 0 ? (c * r) / 100 : c * r * 10,
          c + r,
          i + j > 0 && (c * r) % 10 === 0 ? (c * r) / 10 : c * r + 10,
        ];
        return {
          ...numberProblem({
            prompt: t(
              `The area model shows $${x} \\times ${y}$. What is the area of the part marked ?`,
              `面积模型表示 $${x} \\times ${y}$。标有 ? 的部分面积是多少？`,
            ),
            answer: c * r,
            form: "integer",
            wrong: wrongs,
            solution: t(
              `That part is $${r}$ by $${c}$: $${r} \\times ${c} = ${fmt(r * c)}$.`,
              `这一部分宽 $${r}$、长 $${c}$：$${r} \\times ${c} = ${fmt(r * c)}$。`,
            ),
          }),
          figure: figure(
            areaModel(cols, rows, cols.map(plain), rows.map(plain), cells),
            `A rectangle split into widths ${cols.join(" and ")} and heights ${rows.join(" and ")}.`,
            `一个长方形，横向分成 ${cols.join(" 和 ")}，纵向分成 ${rows.join(" 和 ")}。`,
          ),
        };
      },
    },
    {
      id: "adding-four-parts",
      title: t("Adding the four parts", "四部分相加"),
      explanation: t(
        "The product is the sum of the four parts:\n\n$$23 \\times 45 = 800 + 100 + 120 + 15 = 1{,}035$$",
        "乘积等于四部分面积之和：\n\n$$23 \\times 45 = 800 + 100 + 120 + 15 = 1{,}035$$",
      ),
      generate(rng) {
        const x = twoDigit(rng);
        const y = twoDigit(rng);
        const [cols, rows] = [places(x), places(y)];
        const parts = rows.flatMap((r) => cols.map((c) => r * c));
        const p = x * y;
        return {
          ...numberProblem({
            prompt: t(`Use the area model to find $${x} \\times ${y}$.`, `用面积模型计算 $${x} \\times ${y}$。`),
            answer: p,
            form: "integer",
            wrong: [cols[0]! * rows[0]! + cols[1]! * rows[1]!, p - parts[1]!, p - parts[2]!],
            solution: t(
              `${steps(...rows.flatMap((r) => cols.map((c) => `${r} \\times ${c} = ${fmt(r * c)}`)), `${parts.map(fmt).join(" + ")} = ${fmt(p)}`)}`,
              `${steps(...rows.flatMap((r) => cols.map((c) => `${r} \\times ${c} = ${fmt(r * c)}`)), `${parts.map(fmt).join(" + ")} = ${fmt(p)}`)}`,
            ),
          }),
          figure: figure(
            areaModel(cols, rows, cols.map(plain), rows.map(plain), []),
            `A rectangle split into widths ${cols.join(" and ")} and heights ${rows.join(" and ")}.`,
            `一个长方形，横向分成 ${cols.join(" 和 ")}，纵向分成 ${rows.join(" 和 ")}。`,
          ),
        };
      },
    },
  ],
};

export const twoDigitByTwoDigitMultiplicationUsingPlaceValue: TopicDef = {
  id: "two-digit-by-two-digit-multiplication-using-place-value",
  title: t("Two-Digit by Two-Digit Multiplication Using Place Value", "用数位计算两位数乘两位数"),
  summary: t(
    "Multiply two two-digit numbers by adding two partial products, as in the standard algorithm.",
    "像竖式那样，把两个部分积相加，计算两位数乘两位数。",
  ),
  prerequisites: ["two-digit-by-two-digit-multiplication-using-area-models", "two-digit-by-one-digit-multiplication-using-place-value"],
  encompasses: [
    { topic: "two-digit-by-two-digit-multiplication-using-area-models", weight: 0.6 },
    { topic: "two-digit-by-one-digit-multiplication-using-place-value", weight: 0.7 },
  ],
  xp: 15,
  standards: ["CCSS.4.NBT.B.5"],
  knowledgePoints: [
    {
      id: "multiplying-by-the-tens",
      title: t("Multiplying by the tens", "乘十位上的数"),
      explanation: t(
        "To find $23 \\times 45$, split only the second factor: $45 = 40 + 5$. Then\n\n$$23 \\times 45 = 23 \\times 40 + 23 \\times 5 = 920 + 115$$\n\nThe tens digit $4$ means $40$, so that partial product ends in zero: $23 \\times 40 = 23 \\times 4 \\times 10 = 920$.",
        "计算 $23 \\times 45$ 时，只拆第二个因数：$45 = 40 + 5$。于是\n\n$$23 \\times 45 = 23 \\times 40 + 23 \\times 5 = 920 + 115$$\n\n十位上的 $4$ 表示 $40$，所以这个部分积末尾有 $0$：$23 \\times 40 = 23 \\times 4 \\times 10 = 920$。",
      ),
      generate(rng) {
        const x = twoDigit(rng);
        const y = twoDigit(rng, 21);
        const tens = Math.floor(y / 10) * 10;
        const v = x * tens;
        return numberProblem({
          prompt: t(
            `To find $${x} \\times ${y}$, you add $${x} \\times ${tens}$ and $${x} \\times ${y % 10}$. What is $${x} \\times ${tens}$?`,
            `计算 $${x} \\times ${y}$ 时，要把 $${x} \\times ${tens}$ 和 $${x} \\times ${y % 10}$ 相加。$${x} \\times ${tens}$ 等于多少？`,
          ),
          answer: v,
          form: "integer",
          wrong: [v / 10, v * 10, noCarry(x, tens / 10) * 10],
          solution: t(
            `${steps(`${x} \\times ${tens} = ${x} \\times ${tens / 10} \\times 10 = ${x * (tens / 10)} \\times 10 = ${fmt(v)}`)}`,
            `${steps(`${x} \\times ${tens} = ${x} \\times ${tens / 10} \\times 10 = ${x * (tens / 10)} \\times 10 = ${fmt(v)}`)}`,
          ),
        });
      },
    },
    {
      id: "adding-partial-products",
      title: t("Adding the partial products", "部分积相加"),
      explanation: t(
        "The standard algorithm writes the two partial products under each other and adds them:\n\n$$\\begin{aligned} 23 \\times 5 &= 115 \\\\ 23 \\times 40 &= 920 \\\\ 115 + 920 &= 1{,}035 \\end{aligned}$$\n\nA common mistake is to forget the zero in the second partial product and add $92$ instead of $920$.",
        "竖式把两个部分积上下对齐写好，再相加：\n\n$$\\begin{aligned} 23 \\times 5 &= 115 \\\\ 23 \\times 40 &= 920 \\\\ 115 + 920 &= 1{,}035 \\end{aligned}$$\n\n常见的错误是忘了第二个部分积末尾的 $0$，把 $920$ 当成 $92$ 来加。",
      ),
      generate(rng) {
        const x = twoDigit(rng);
        const y = twoDigit(rng);
        const [tens, ones] = [Math.floor(y / 10) * 10, y % 10];
        const [p1, p2] = [x * ones, x * tens];
        const p = x * y;
        return numberProblem({
          prompt: t(`Find $${x} \\times ${y}$.`, `计算 $${x} \\times ${y}$。`),
          answer: p,
          form: "integer",
          wrong: [p1 + p2 / 10, Math.floor(x / 10) * tens * 10 + (x % 10) * ones, p + 10, p - 100],
          solution: t(
            `${steps(`${x} \\times ${ones} = ${fmt(p1)}`, `${x} \\times ${tens} = ${fmt(p2)}`, `${fmt(p1)} + ${fmt(p2)} = ${fmt(p)}`)}So $${x} \\times ${y} = ${fmt(p)}$.`,
            `${steps(`${x} \\times ${ones} = ${fmt(p1)}`, `${x} \\times ${tens} = ${fmt(p2)}`, `${fmt(p1)} + ${fmt(p2)} = ${fmt(p)}`)}所以 $${x} \\times ${y} = ${fmt(p)}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Dividing whole numbers

export const relationshipBetweenMultiplicationAndDivision: TopicDef = {
  id: "relationship-between-multiplication-and-division",
  title: t("The Relationship Between Multiplication and Division", "乘法与除法的关系"),
  summary: t("Use fact families and multiplication facts to divide.", "利用一组相关的乘除算式和乘法口诀做除法。"),
  prerequisites: ["products-and-factors"],
  encompasses: [{ topic: "products-and-factors", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.3.OA.B.6", "CCSS.3.OA.C.7"],
  knowledgePoints: [
    {
      id: "fact-families",
      title: t("Fact families", "相关的乘除算式"),
      explanation: t(
        "Multiplication and division undo each other. The three numbers $6$, $8$ and $48$ make a **fact family**:\n\n$$6 \\times 8 = 48, \\quad 8 \\times 6 = 48, \\quad 48 \\div 6 = 8, \\quad 48 \\div 8 = 6$$\n\nIn the division facts, the product $48$ comes first.",
        "乘法和除法互为逆运算。$6$、$8$、$48$ 这三个数可以组成一组**相关的乘除算式**：\n\n$$6 \\times 8 = 48, \\quad 8 \\times 6 = 48, \\quad 48 \\div 6 = 8, \\quad 48 \\div 8 = 6$$\n\n在除法算式中，积 $48$ 写在最前面。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        let b = rng.int(2, 12);
        while (b === a) b = rng.int(2, 12);
        const p = a * b;
        const [d, q] = rng.bool() ? [a, b] : [b, a];
        const { options, correct } = shuffled(rng, math(`${p} \\div ${d} = ${q}`), [
          math(`${d} \\div ${q} = ${p}`),
          math(`${q} \\div ${p} = ${d}`),
          math(`${p} \\div ${d} = ${p - d}`),
        ]);
        return choiceProblem({
          prompt: t(
            `$${a} \\times ${b} = ${p}$. Which division fact is in the same fact family?`,
            `$${a} \\times ${b} = ${p}$。哪个除法算式与它是相关的乘除算式？`,
          ),
          options,
          correct,
          solution: t(
            `Start with the product: $${d} \\times ${q} = ${p}$, so $${p} \\div ${d} = ${q}$.`,
            `从积开始：$${d} \\times ${q} = ${p}$，所以 $${p} \\div ${d} = ${q}$。`,
          ),
        });
      },
    },
    {
      id: "dividing-with-multiplication-facts",
      title: t("Dividing with multiplication facts", "用乘法口诀做除法"),
      explanation: t(
        "To find $56 \\div 7$, think of multiplication: $7 \\times \\square = 56$. Since $7 \\times 8 = 56$, $56 \\div 7 = 8$.",
        "求 $56 \\div 7$ 时，想乘法：$7 \\times \\square = 56$。因为 $7 \\times 8 = 56$，所以 $56 \\div 7 = 8$。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const q = rng.int(2, 12);
        const p = d * q;
        return numberProblem({
          prompt: t(`Find $${p} \\div ${d}$.`, `计算 $${p} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [p - d, q + 1, q - 1],
          solution: t(
            `$${d} \\times ${q} = ${p}$, so $${p} \\div ${d} = ${q}$.`,
            `$${d} \\times ${q} = ${p}$，所以 $${p} \\div ${d} = ${q}$。`,
          ),
        });
      },
    },
    {
      id: "missing-dividends",
      title: t("Missing numbers in division", "除法中的未知数"),
      explanation: t(
        "In $\\square \\div 6 = 9$, the missing number is the one you start with. Undo the division with multiplication: $\\square = 6 \\times 9 = 54$.",
        "在 $\\square \\div 6 = 9$ 中，方框里是被分的那个数。用乘法还原：$\\square = 6 \\times 9 = 54$。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const q = rng.int(2, 12);
        const p = d * q;
        return numberProblem({
          prompt: t(`Find the missing number: $$\\square \\div ${d} = ${q}$$`, `求方框中的数：$$\\square \\div ${d} = ${q}$$`),
          answer: p,
          form: "integer",
          wrong: [d + q, q, d],
          solution: t(
            `Multiply to undo the division: $${d} \\times ${q} = ${p}$. Check: $${p} \\div ${d} = ${q}$.`,
            `用乘法还原：$${d} \\times ${q} = ${p}$。检验：$${p} \\div ${d} = ${q}$。`,
          ),
        });
      },
    },
  ],
};

export const understandingRemaindersUsingModels: TopicDef = {
  id: "understanding-remainders-using-models",
  title: t("Understanding Remainders Using Models", "用模型理解余数"),
  summary: t("Share counters into equal groups and see what is left over.", "把圆片平均分成若干组，看看剩下多少。"),
  prerequisites: ["relationship-between-multiplication-and-division"],
  encompasses: [{ topic: "relationship-between-multiplication-and-division", weight: 0.3 }],
  xp: 8,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "reading-a-model",
      title: t("Reading a model", "看懂模型"),
      explanation: t(
        "When $17$ counters are put into groups of $5$, there are $3$ full groups and $2$ counters left over. The counters left over are the **remainder**:\n\n$$17 \\div 5 = 3 \\text{ R } 2$$\n\nThe remainder is always less than the group size; otherwise you could make another group.",
        "把 $17$ 个圆片每 $5$ 个分成一组，可以分成 $3$ 组，还剩 $2$ 个。剩下的部分叫作**余数**：\n\n$$17 \\div 5 = 3 \\cdots\\cdots 2$$\n\n余数总是比每组的个数小，否则还能再分出一组。",
      ),
      generate(rng) {
        for (;;) {
          const g = rng.int(2, 6);
          const q = rng.int(2, 6);
          const r = rng.int(1, g - 1);
          if (r === q || g === 1) continue;
          const n = g * q + r;
          const { options, correct } = shuffled(rng, divText(n, g, q, r), [
            divText(n, g, r, q),
            divText(n, g, q + 1, r),
            divText(n - r, g, q, r),
          ]);
          return {
            ...choiceProblem({
              prompt: t(
                `The counters are put into groups of $${g}$. Which division does the picture show?`,
                `这些圆片每 $${g}$ 个分成一组。图表示的是哪个除法算式？`,
              ),
              options,
              correct,
              solution: t(
                `There are $${n}$ counters: $${q}$ full groups of $${g}$ and $${r}$ left over. So $${n} \\div ${g} = ${qr(q, r).en}$.`,
                `共有 $${n}$ 个圆片：分成 $${q}$ 组，每组 $${g}$ 个，还剩 $${r}$ 个。所以 $${n} \\div ${g} = ${qr(q, r).zh}$。`,
              ),
            }),
            figure: figure(
              groupsFigure(g, q, r),
              `${q} boxed groups of ${g} counters and ${r} counters outside the boxes.`,
              `${q} 个方框，每个方框里有 ${g} 个圆片，方框外还有 ${r} 个圆片。`,
            ),
          };
        }
      },
    },
    {
      id: "making-groups",
      title: t("Making equal groups", "平均分组"),
      explanation: t(
        "To share counters into groups of a given size, count them, then make as many full groups as you can. The ones that cannot fill a group are left over.\n\n$23$ counters in groups of $4$: $5$ groups use $20$ counters, and $3$ are left over.",
        "要把圆片按每组一定的个数分组，先数出一共有多少个，再尽量多地分出整组，凑不满一组的就是剩下的。\n\n$23$ 个圆片每 $4$ 个一组：分 $5$ 组用去 $20$ 个，还剩 $3$ 个。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        let n = rng.int(11, 49);
        while (n % d === 0) n = rng.int(11, 49);
        const [q, r] = [Math.floor(n / d), n % d];
        return {
          ...numberProblem({
            prompt: t(
              `Put these counters into groups of $${d}$. How many counters are left over?`,
              `把这些圆片每 $${d}$ 个分成一组，还剩多少个？`,
            ),
            answer: r,
            form: "integer",
            wrong: [q, d - r, n - d * q + d],
            solution: t(
              `There are $${n}$ counters. $${q}$ groups of $${d}$ use $${d * q}$ counters, and $${n} - ${d * q} = ${r}$ are left over.`,
              `共有 $${n}$ 个圆片。分成 $${q}$ 组，每组 $${d}$ 个，用去 $${d * q}$ 个，还剩 $${n} - ${d * q} = ${r}$ 个。`,
            ),
          }),
          figure: figure(rowsOfTen(n), `${n} counters in rows of ten.`, `${n} 个圆片，每行十个。`),
        };
      },
    },
  ],
};

export const findingRemainders: TopicDef = {
  id: "finding-remainders",
  title: t("Finding Remainders", "求余数"),
  summary: t(
    "Find the remainder of a division with the largest multiple of the divisor that fits.",
    "找出不超过被除数的除数的最大倍数，求出余数。",
  ),
  prerequisites: ["understanding-remainders-using-models"],
  encompasses: [{ topic: "understanding-remainders-using-models", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "largest-multiple-that-fits",
      title: t("The largest multiple that fits", "不超过它的最大倍数"),
      explanation: t(
        "To divide $47$ by $6$ without counters, find the largest multiple of $6$ that is not more than $47$. Count by sixes: $\\dots, 36, 42, 48$. $48$ is too big, so the largest multiple that fits is $42 = 6 \\times 7$.",
        "不用圆片计算 $47 \\div 6$ 时，先找出不超过 $47$ 的 $6$ 的最大倍数。按 $6$ 数：$\\dots, 36, 42, 48$。$48$ 太大了，所以最大的是 $42 = 6 \\times 7$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(2, 9);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return numberProblem({
          prompt: t(`What is the largest multiple of $${d}$ that is not more than $${n}$?`, `不超过 $${n}$ 的 $${d}$ 的最大倍数是多少？`),
          answer: d * q,
          form: "integer",
          wrong: [d * (q + 1), n, d * (q - 1)],
          solution: t(
            `$${d} \\times ${q} = ${d * q}$ is not more than $${n}$, but $${d} \\times ${q + 1} = ${d * (q + 1)}$ is. The largest multiple is $${d * q}$.`,
            `$${d} \\times ${q} = ${d * q}$ 不超过 $${n}$，而 $${d} \\times ${q + 1} = ${d * (q + 1)}$ 超过了。最大的倍数是 $${d * q}$。`,
          ),
        });
      },
    },
    {
      id: "the-remainder",
      title: t("The remainder", "余数"),
      explanation: t(
        "The remainder is what is left after taking away the largest multiple that fits. For $47 \\div 6$: $47 - 42 = 5$, so the remainder is $5$ and $47 \\div 6 = 7 \\text{ R } 5$.\n\nCheck that the remainder is less than $6$.",
        "从被除数中去掉不超过它的最大倍数，剩下的就是余数。计算 $47 \\div 6$：$47 - 42 = 5$，所以余数是 $5$，$47 \\div 6 = 7 \\cdots\\cdots 5$。\n\n检查余数是否比 $6$ 小。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(2, 9);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return numberProblem({
          prompt: t(`What is the remainder when $${n}$ is divided by $${d}$?`, `$${n}$ 除以 $${d}$ 的余数是多少？`),
          answer: r,
          form: "integer",
          wrong: [q, d - r, r + d],
          solution: t(
            `The largest multiple of $${d}$ that fits is $${d} \\times ${q} = ${d * q}$, and $${n} - ${d * q} = ${r}$. The remainder is $${r}$.`,
            `不超过 $${n}$ 的 $${d}$ 的最大倍数是 $${d} \\times ${q} = ${d * q}$，$${n} - ${d * q} = ${r}$。余数是 $${r}$。`,
          ),
        });
      },
    },
  ],
};

export const dividendsDivisorsQuotientsAndRemainders: TopicDef = {
  id: "dividends-divisors-quotients-and-remainders",
  title: t("Dividends, Divisors, Quotients, and Remainders", "被除数、除数、商和余数"),
  summary: t(
    "Name the parts of a division and use dividend = divisor × quotient + remainder.",
    "说出除法各部分的名称，并运用 被除数 = 除数 × 商 + 余数。",
  ),
  prerequisites: ["finding-remainders"],
  encompasses: [{ topic: "finding-remainders", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "naming-the-parts",
      title: t("Naming the parts", "各部分的名称"),
      explanation: t(
        "In $47 \\div 6 = 7 \\text{ R } 5$:\n\n- $47$, the number being divided, is the **dividend**;\n- $6$, the number you divide by, is the **divisor**;\n- $7$ is the **quotient**;\n- $5$ is the **remainder**.",
        "在 $47 \\div 6 = 7 \\cdots\\cdots 5$ 中：\n\n- 被分的数 $47$ 是**被除数**；\n- 用来除的数 $6$ 是**除数**；\n- $7$ 是**商**；\n- $5$ 是**余数**。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 9);
          const q = rng.int(2, 12);
          const r = rng.int(1, d - 1);
          if (q === d || r === q) continue;
          const n = d * q + r;
          const roles = [t("dividend", "被除数"), t("divisor", "除数"), t("quotient", "商"), t("remainder", "余数")];
          const k = rng.int(0, 3);
          return choiceProblem({
            prompt: t(
              `In $${n} \\div ${d} = ${qr(q, r).en}$, which number is the ${roles[k]!.en}?`,
              `在 $${n} \\div ${d} = ${qr(q, r).zh}$ 中，哪个数是${roles[k]!["zh-CN"]}？`,
            ),
            options: [n, d, q, r].map((v) => math(String(v))),
            correct: k,
            solution: t(
              `$${n}$ is the dividend, $${d}$ the divisor, $${q}$ the quotient and $${r}$ the remainder.`,
              `$${n}$ 是被除数，$${d}$ 是除数，$${q}$ 是商，$${r}$ 是余数。`,
            ),
          });
        }
      },
    },
    {
      id: "finding-the-dividend",
      title: t("Finding the dividend", "求被除数"),
      explanation: t(
        "The parts of a division fit together like this:\n\n$$\\text{dividend} = \\text{divisor} \\times \\text{quotient} + \\text{remainder}$$\n\nFor $47 \\div 6 = 7 \\text{ R } 5$: $6 \\times 7 + 5 = 47$.",
        "除法的各部分之间有这样的关系：\n\n$$\\text{被除数} = \\text{除数} \\times \\text{商} + \\text{余数}$$\n\n例如 $47 \\div 6 = 7 \\cdots\\cdots 5$：$6 \\times 7 + 5 = 47$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(2, 12);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return numberProblem({
          prompt: t(
            `A division has divisor $${d}$, quotient $${q}$ and remainder $${r}$. What is the dividend?`,
            `一个除法算式的除数是 $${d}$，商是 $${q}$，余数是 $${r}$。被除数是多少？`,
          ),
          answer: n,
          form: "integer",
          wrong: [d * q, d * q - r, d + q + r, d * (q + r)],
          solution: t(
            `${steps(`${d} \\times ${q} + ${r} = ${d * q} + ${r} = ${n}`)}The dividend is $${n}$.`,
            `${steps(`${d} \\times ${q} + ${r} = ${d * q} + ${r} = ${n}`)}被除数是 $${n}$。`,
          ),
        });
      },
    },
    {
      id: "checking-a-division",
      title: t("Checking a division", "检验除法"),
      explanation: t(
        "To check $n \\div d = q \\text{ R } r$, make sure that\n\n1. $d \\times q + r = n$, and\n2. the remainder $r$ is less than the divisor $d$.\n\n$50 \\div 6 = 7 \\text{ R } 8$ passes the first test, $6 \\times 7 + 8 = 50$, but fails the second: $8$ is not less than $6$. The answer is $8 \\text{ R } 2$.",
        "检验 $n \\div d = q \\cdots\\cdots r$ 时，要确认：\n\n1. $d \\times q + r = n$；\n2. 余数 $r$ 比除数 $d$ 小。\n\n$50 \\div 6 = 7 \\cdots\\cdots 8$ 满足第一条，$6 \\times 7 + 8 = 50$，但不满足第二条：$8$ 不比 $6$ 小。正确答案是 $8 \\cdots\\cdots 2$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        const kind = rng.int(0, 2);
        const [sq, sr] = kind === 0 ? [q, r] : kind === 1 ? [q - 1, r + d] : [q, r === 1 ? 2 : r - 1];
        const ok = kind === 0;
        const shown = t(`$${n} \\div ${d} = ${qr(sq, sr).en}$`, `$${n} \\div ${d} = ${qr(sq, sr).zh}$`);
        const why =
          kind === 0
            ? t(
                `$${d} \\times ${q} + ${r} = ${n}$ and $${r}$ is less than $${d}$, so it is correct.`,
                `$${d} \\times ${q} + ${r} = ${n}$，且 $${r}$ 比 $${d}$ 小，所以正确。`,
              )
            : kind === 1
              ? t(
                  `$${d} \\times ${sq} + ${sr} = ${n}$, but the remainder $${sr}$ is not less than $${d}$: one more group fits. The answer is $${qr(q, r).en}$.`,
                  `$${d} \\times ${sq} + ${sr} = ${n}$，但余数 $${sr}$ 不比 $${d}$ 小，还能再分一组。正确答案是 $${qr(q, r).zh}$。`,
                )
              : t(
                  `$${d} \\times ${sq} + ${sr} = ${d * sq + sr}$, not $${n}$. The answer is $${qr(q, r).en}$.`,
                  `$${d} \\times ${sq} + ${sr} = ${d * sq + sr}$，不等于 $${n}$。正确答案是 $${qr(q, r).zh}$。`,
                );
        return choiceProblem({
          prompt: t(`Is this division correct? ${shown.en}`, `这个除法算式正确吗？${shown["zh-CN"]}`),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: why,
        });
      },
    },
  ],
};

export const divisionWithRemainders: TopicDef = {
  id: "division-with-remainders",
  title: t("Division With Remainders", "有余数的除法"),
  summary: t("Find the quotient and the remainder of a division by a one-digit number.", "求除数是一位数的除法的商和余数。"),
  prerequisites: ["dividends-divisors-quotients-and-remainders"],
  encompasses: [
    { topic: "dividends-divisors-quotients-and-remainders", weight: 0.5 },
    { topic: "finding-remainders", weight: 0.8 },
  ],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "finding-the-quotient",
      title: t("Finding the quotient", "求商"),
      explanation: t(
        "The quotient is the number of full groups: the partner of the largest multiple of the divisor that fits. For $58 \\div 7$: $7 \\times 8 = 56$ fits and $7 \\times 9 = 63$ does not, so the quotient is $8$ (with remainder $2$).",
        "商就是能分成的整组数，也就是不超过被除数的除数的最大倍数所对应的那个因数。计算 $58 \\div 7$：$7 \\times 8 = 56$ 不超过 $58$，$7 \\times 9 = 63$ 超过了，所以商是 $8$（余数是 $2$）。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return numberProblem({
          prompt: t(`What is the quotient of $${n} \\div ${d}$? (There is a remainder.)`, `$${n} \\div ${d}$ 的商是多少？（有余数。）`),
          answer: q,
          form: "integer",
          wrong: [q + 1, r, q - 1],
          solution: t(
            `$${d} \\times ${q} = ${d * q}$ fits in $${n}$, but $${d} \\times ${q + 1} = ${d * (q + 1)}$ does not. So $${n} \\div ${d} = ${qr(q, r).en}$: the quotient is $${q}$.`,
            `$${d} \\times ${q} = ${d * q}$ 不超过 $${n}$，而 $${d} \\times ${q + 1} = ${d * (q + 1)}$ 超过了。所以 $${n} \\div ${d} = ${qr(q, r).zh}$，商是 $${q}$。`,
          ),
        });
      },
    },
    {
      id: "quotient-and-remainder",
      title: t("The quotient and the remainder", "商和余数"),
      explanation: t(
        "A complete answer gives both the quotient and the remainder: $58 \\div 7 = 8 \\text{ R } 2$. Check it: $7 \\times 8 + 2 = 58$, and $2$ is less than $7$.",
        "完整的答案要同时写出商和余数：$58 \\div 7 = 8 \\cdots\\cdots 2$。检验：$7 \\times 8 + 2 = 58$，且 $2$ 比 $7$ 小。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        const answer = t(`$${qr(q, r).en}$`, `$${qr(q, r).zh}$`);
        const wrongs = [
          [q - 1, r + d],
          [q + 1, r],
          [q, r === d - 1 ? r - 1 : r + 1],
          [r, q],
        ].map(([a, b]) => t(`$${qr(a!, b!).en}$`, `$${qr(a!, b!).zh}$`));
        const { options, correct } = shuffled(rng, answer, wrongs.slice(0, 3));
        return choiceProblem({
          prompt: t(`Find $${n} \\div ${d}$.`, `计算 $${n} \\div ${d}$。`),
          options,
          correct,
          solution: t(
            `$${d} \\times ${q} = ${d * q}$ and $${n} - ${d * q} = ${r}$, which is less than $${d}$. So $${n} \\div ${d} = ${qr(q, r).en}$.`,
            `$${d} \\times ${q} = ${d * q}$，$${n} - ${d * q} = ${r}$，比 $${d}$ 小。所以 $${n} \\div ${d} = ${qr(q, r).zh}$。`,
          ),
        });
      },
    },
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
    en: (n, d) => `A ribbon is $${n}$ cm long. Leo cuts pieces $${d}$ cm long from it. How many whole pieces can he cut?`,
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
  prerequisites: ["division-with-remainders"],
  encompasses: [{ topic: "division-with-remainders", weight: 0.7 }],
  xp: 12,
  standards: ["CCSS.4.OA.A.3"],
  knowledgePoints: [
    {
      id: "rounding-the-quotient-up",
      title: t("When to round up", "什么时候要加一"),
      explanation: t(
        "$26$ students ride in cars that carry $4$ each. $26 \\div 4 = 6 \\text{ R } 2$: $6$ cars carry $24$ students, but $2$ students still need a ride. So $7$ cars are needed.\n\nWhen **everything** must fit, the leftover needs one more group.",
        "$26$ 名学生坐车，每辆车坐 $4$ 人。$26 \\div 4 = 6 \\cdots\\cdots 2$：$6$ 辆车坐 $24$ 人，还有 $2$ 人没车坐，所以需要 $7$ 辆车。\n\n当**全部**都要装下时，剩下的部分还需要再加一组。",
      ),
      generate(rng) {
        const [n, d, q, r] = remainderProblem(rng);
        const c = rng.pick(roundUpContexts);
        return numberProblem({
          prompt: t(c.en(n, d), c.zh(n, d)),
          answer: q + 1,
          form: "integer",
          wrong: [q, r, q + r],
          solution: t(
            `$${n} \\div ${d} = ${qr(q, r).en}$. $${q}$ groups hold $${d * q}$, and the other $${r}$ need one more, so the answer is $${q + 1}$.`,
            `$${n} \\div ${d} = ${qr(q, r).zh}$。$${q}$ 组能装 $${d * q}$，剩下的 $${r}$ 还需要再加一组，所以答案是 $${q + 1}$。`,
          ),
        });
      },
    },
    {
      id: "ignoring-the-remainder",
      title: t("When to ignore the remainder", "什么时候不管余数"),
      explanation: t(
        "A baker puts $30$ muffins into boxes of $8$. $30 \\div 8 = 3 \\text{ R } 6$: she can fill $3$ boxes. The $6$ muffins left over do not fill another box.\n\nWhen the question asks for **full** groups, the answer is the quotient.",
        "面包师把 $30$ 个松饼装进每盒 $8$ 个的盒子。$30 \\div 8 = 3 \\cdots\\cdots 6$：她能装满 $3$ 盒，剩下的 $6$ 个装不满一盒。\n\n当问题问的是**装满**的组数时，答案就是商。",
      ),
      generate(rng) {
        const [n, d, q, r] = remainderProblem(rng);
        const c = rng.pick(dropContexts);
        return numberProblem({
          prompt: t(c.en(n, d), c.zh(n, d)),
          answer: q,
          form: "integer",
          wrong: [q + 1, r, q + r],
          solution: t(
            `$${n} \\div ${d} = ${qr(q, r).en}$. The $${r}$ left over is not enough for another one, so the answer is $${q}$.`,
            `$${n} \\div ${d} = ${qr(q, r).zh}$。剩下的 $${r}$ 不够再组成一个，所以答案是 $${q}$。`,
          ),
        });
      },
    },
    {
      id: "the-remainder-is-the-answer",
      title: t("When the remainder is the answer", "什么时候答案是余数"),
      explanation: t(
        "$20$ stickers are shared equally among $6$ friends. $20 \\div 6 = 3 \\text{ R } 2$: each friend gets $3$, and $2$ stickers are left over.\n\nWhen the question asks **how many are left**, the answer is the remainder.",
        "$20$ 张贴纸平均分给 $6$ 个朋友。$20 \\div 6 = 3 \\cdots\\cdots 2$：每人分到 $3$ 张，还剩 $2$ 张。\n\n当问题问的是**还剩多少**时，答案就是余数。",
      ),
      generate(rng) {
        const [n, d, q, r] = remainderProblem(rng);
        const c = rng.pick(leftoverContexts);
        return numberProblem({
          prompt: t(c.en(n, d), c.zh(n, d)),
          answer: r,
          form: "integer",
          wrong: [q, q + 1, d - r],
          solution: t(
            `$${n} \\div ${d} = ${qr(q, r).en}$: after $${q}$ full groups of $${d}$, $${r}$ are left over.`,
            `$${n} \\div ${d} = ${qr(q, r).zh}$：分成 $${q}$ 组、每组 $${d}$ 个后，还剩 $${r}$。`,
          ),
        });
      },
    },
  ],
};

export const dividingBy10100And1000: TopicDef = {
  id: "dividing-by-10-100-and-1000",
  title: t("Dividing by 10, 100, and 1,000", "除以 10、100 和 1,000"),
  summary: t(
    "Divide numbers ending in zeros by 10, 100 and 1,000, and by numbers such as 60 and 400.",
    "用末尾有 0 的数除以 10、100、1,000，以及除以 60、400 这样的数。",
  ),
  prerequisites: ["multiplying-by-10-100-and-1000", "relationship-between-multiplication-and-division"],
  encompasses: [
    { topic: "multiplying-by-10-100-and-1000", weight: 0.4 },
    { topic: "relationship-between-multiplication-and-division", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6", "CCSS.5.NBT.A.2"],
  knowledgePoints: [
    {
      id: "removing-zeros",
      title: t("Removing zeros", "去掉末尾的 0"),
      explanation: t(
        "Dividing undoes multiplying. Since $45 \\times 100 = 4{,}500$, we have $4{,}500 \\div 100 = 45$: the digits move two places to the right, and two zeros disappear from the end.\n\nDividing by $10$ removes one zero, by $100$ two zeros, by $1{,}000$ three zeros.",
        "除法是乘法的逆运算。因为 $45 \\times 100 = 4{,}500$，所以 $4{,}500 \\div 100 = 45$：各位数字向右移两位，末尾去掉两个 $0$。\n\n除以 $10$ 去掉一个 $0$，除以 $100$ 去掉两个 $0$，除以 $1{,}000$ 去掉三个 $0$。",
      ),
      generate(rng) {
        const m = rng.pick(powersOfTen);
        const q = rng.bool(0.3) ? 10 * rng.int(2, 50) : rng.int(2, 999);
        const n = q * m;
        return numberProblem({
          prompt: t(`Find $${fmt(n)} \\div ${fmt(m)}$.`, `计算 $${fmt(n)} \\div ${fmt(m)}$。`),
          answer: q,
          form: "integer",
          wrong: [q * 10, n, n * m],
          solution: t(
            `$${fmt(q)} \\times ${fmt(m)} = ${fmt(n)}$, so $${fmt(n)} \\div ${fmt(m)} = ${fmt(q)}$.`,
            `$${fmt(q)} \\times ${fmt(m)} = ${fmt(n)}$，所以 $${fmt(n)} \\div ${fmt(m)} = ${fmt(q)}$。`,
          ),
        });
      },
    },
    {
      id: "basic-facts-with-zeros",
      title: t("Basic facts with zeros", "带 0 的口诀除法"),
      explanation: t(
        "Use a basic fact and count zeros:\n\n- $3{,}600 \\div 9$: $36$ hundreds $\\div 9 = 4$ hundreds, so the answer is $400$;\n- $2{,}400 \\div 60$: $240$ tens $\\div 6$ tens; cross off one zero from each, $240 \\div 6 = 40$.\n\nCheck by multiplying: $60 \\times 40 = 2{,}400$.",
        "利用口诀，再数一数 $0$ 的个数：\n\n- $3{,}600 \\div 9$：$36$ 个百 $\\div 9 = 4$ 个百，所以答案是 $400$；\n- $2{,}400 \\div 60$：两个数各划去一个 $0$，变成 $240 \\div 6 = 40$。\n\n用乘法检验：$60 \\times 40 = 2{,}400$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const q = rng.int(2, 9);
        const fact = d * q;
        const j = rng.int(0, 1);
        const k = rng.int(1, 3 - j);
        const divisor = d * 10 ** j;
        const quotient = q * 10 ** k;
        const n = divisor * quotient;
        return numberProblem({
          prompt: t(`Find $${fmt(n)} \\div ${fmt(divisor)}$.`, `计算 $${fmt(n)} \\div ${fmt(divisor)}$。`),
          answer: quotient,
          form: "integer",
          wrong: [quotient * 10, quotient / 10, q],
          solution: t(
            `The basic fact is $${fact} \\div ${d} = ${q}$. Check: $${fmt(divisor)} \\times ${fmt(quotient)} = ${fmt(n)}$, so $${fmt(n)} \\div ${fmt(divisor)} = ${fmt(quotient)}$.`,
            `口诀是 $${fact} \\div ${d} = ${q}$。检验：$${fmt(divisor)} \\times ${fmt(quotient)} = ${fmt(n)}$，所以 $${fmt(n)} \\div ${fmt(divisor)} = ${fmt(quotient)}$。`,
          ),
        });
      },
    },
  ],
};

export const dividingByOneDigitNumbersUsingMultiplication: TopicDef = {
  id: "dividing-by-one-digit-numbers-using-multiplication",
  title: t("Dividing by One-Digit Numbers Using Multiplication", "用乘法做一位数除法"),
  summary: t("Divide a two-digit number by a one-digit number by finding the missing factor.", "通过求未知因数，计算两位数除以一位数。"),
  prerequisites: ["relationship-between-multiplication-and-division", "two-digit-by-one-digit-multiplication-using-place-value"],
  encompasses: [
    { topic: "relationship-between-multiplication-and-division", weight: 0.5 },
    { topic: "two-digit-by-one-digit-multiplication-using-place-value", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "missing-factors-beyond-the-facts",
      title: t("Missing factors beyond the facts", "超出口诀的未知因数"),
      explanation: t(
        "To solve $7 \\times \\square = 84$, start with ten groups: $7 \\times 10 = 70$. That leaves $84 - 70 = 14$, and $7 \\times 2 = 14$. So $\\square = 10 + 2 = 12$.",
        "求 $7 \\times \\square = 84$ 时，先想十组：$7 \\times 10 = 70$，还剩 $84 - 70 = 14$，而 $7 \\times 2 = 14$。所以 $\\square = 10 + 2 = 12$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(11, Math.min(19, Math.floor(99 / d)));
        const n = d * q;
        return numberProblem({
          prompt: t(`Find the missing number: $$${d} \\times \\square = ${n}$$`, `求方框中的数：$$${d} \\times \\square = ${n}$$`),
          answer: q,
          form: "integer",
          wrong: [q - 10, n - d, q + 1],
          solution: t(
            `$${d} \\times 10 = ${10 * d}$, and $${n} - ${10 * d} = ${n - 10 * d} = ${d} \\times ${q - 10}$. So the missing number is $10 + ${q - 10} = ${q}$.`,
            `$${d} \\times 10 = ${10 * d}$，$${n} - ${10 * d} = ${n - 10 * d} = ${d} \\times ${q - 10}$。所以方框中的数是 $10 + ${q - 10} = ${q}$。`,
          ),
        });
      },
    },
    {
      id: "dividing-two-digit-numbers",
      title: t("Dividing two-digit numbers", "两位数除以一位数"),
      explanation: t(
        "To find $96 \\div 4$, think $4 \\times \\square = 96$. Try tens first: $4 \\times 20 = 80$, leaving $16 = 4 \\times 4$. So $96 \\div 4 = 24$.\n\nCheck by multiplying: $4 \\times 24 = 96$.",
        "求 $96 \\div 4$ 时，想 $4 \\times \\square = 96$。先试整十：$4 \\times 20 = 80$，还剩 $16 = 4 \\times 4$。所以 $96 \\div 4 = 24$。\n\n用乘法检验：$4 \\times 24 = 96$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const q = rng.int(11, Math.floor(99 / d));
        const n = d * q;
        const tens = Math.floor(q / 10) * 10;
        return numberProblem({
          prompt: t(`Find $${n} \\div ${d}$.`, `计算 $${n} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [q + 1, q - 1, q - tens, tens],
          solution: t(
            `$${d} \\times ${tens} = ${d * tens}$ and $${n} - ${d * tens} = ${n - d * tens} = ${d} \\times ${q - tens}$. So $${n} \\div ${d} = ${q}$. Check: $${d} \\times ${q} = ${n}$.`,
            `$${d} \\times ${tens} = ${d * tens}$，$${n} - ${d * tens} = ${n - d * tens} = ${d} \\times ${q - tens}$。所以 $${n} \\div ${d} = ${q}$。检验：$${d} \\times ${q} = ${n}$。`,
          ),
        });
      },
    },
  ],
};

export const dividingUsingPlaceValueStrategies: TopicDef = {
  id: "dividing-using-place-value-strategies",
  title: t("Dividing Using Place-Value Strategies", "用数位策略做除法"),
  summary: t(
    "Divide a multi-digit number by a one-digit number by splitting the dividend into parts that divide evenly.",
    "把被除数拆成能整除的几部分，计算多位数除以一位数。",
  ),
  prerequisites: ["dividing-by-one-digit-numbers-using-multiplication", "dividing-by-10-100-and-1000"],
  encompasses: [
    { topic: "dividing-by-one-digit-numbers-using-multiplication", weight: 0.6 },
    { topic: "dividing-by-10-100-and-1000", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "dividing-each-place",
      title: t("Dividing each place", "每一位分别除"),
      explanation: t(
        "When every digit of the dividend divides evenly, divide each place on its own:\n\n$$639 \\div 3 = 600 \\div 3 + 30 \\div 3 + 9 \\div 3 = 200 + 10 + 3 = 213$$",
        "当被除数的每一位都能被整除时，可以每一位分别除：\n\n$$639 \\div 3 = 600 \\div 3 + 30 \\div 3 + 9 \\div 3 = 200 + 10 + 3 = 213$$",
      ),
      generate(rng) {
        const d = rng.int(2, 4);
        const len = rng.bool(0.3) ? 4 : 3;
        const digits = Array.from({ length: len }, (_, i) => d * rng.int(i === 0 ? 1 : 0, Math.floor(9 / d)));
        if (digits.slice(1).every((x) => x === 0)) digits[len - 1] = d;
        const n = Number(digits.join(""));
        const parts = places(n);
        const q = n / d;
        return numberProblem({
          prompt: t(`Find $${fmt(n)} \\div ${d}$.`, `计算 $${fmt(n)} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [q - parts[parts.length - 1]! / d, q * 10, n - d],
          solution: t(
            `${steps(`${fmt(n)} \\div ${d} = ${parts.map((p) => `${fmt(p)} \\div ${d}`).join(" + ")}`, `= ${parts.map((p) => fmt(p / d)).join(" + ")} = ${fmt(q)}`)}`,
            `${steps(`${fmt(n)} \\div ${d} = ${parts.map((p) => `${fmt(p)} \\div ${d}`).join(" + ")}`, `= ${parts.map((p) => fmt(p / d)).join(" + ")} = ${fmt(q)}`)}`,
          ),
        });
      },
    },
    {
      id: "splitting-into-friendly-parts",
      title: t("Splitting into friendly parts", "拆成便于计算的部分"),
      explanation: t(
        "If a digit does not divide evenly, split the dividend differently. For $852 \\div 4$, split $852$ into $800$ and $52$, which both divide by $4$:\n\n$$852 \\div 4 = 800 \\div 4 + 52 \\div 4 = 200 + 13 = 213$$",
        "如果某一位不能整除，就换一种拆法。计算 $852 \\div 4$ 时，把 $852$ 拆成 $800$ 和 $52$，它们都能被 $4$ 整除：\n\n$$852 \\div 4 = 800 \\div 4 + 52 \\div 4 = 200 + 13 = 213$$",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 9);
          const h = rng.int(1, Math.floor(9 / d));
          const k = rng.int(11, Math.floor(99 / d));
          const n = d * (100 * h + k);
          const rest = d * k;
          if (Math.floor(rest / 10) % d === 0) continue;
          const q = 100 * h + k;
          return numberProblem({
            prompt: t(`Find $${n} \\div ${d}$.`, `计算 $${n} \\div ${d}$。`),
            answer: q,
            form: "integer",
            wrong: [100 * h, q + 10, q - 1, 10 * h + k],
            solution: t(
              `Split $${n}$ into $${100 * h * d}$ and $${rest}$:${steps(`${n} \\div ${d} = ${100 * h * d} \\div ${d} + ${rest} \\div ${d} = ${100 * h} + ${k} = ${q}`)}`,
              `把 $${n}$ 拆成 $${100 * h * d}$ 和 $${rest}$：${steps(`${n} \\div ${d} = ${100 * h * d} \\div ${d} + ${rest} \\div ${d} = ${100 * h} + ${k} = ${q}`)}`,
            ),
          });
        }
      },
    },
  ],
};

export const estimatingMultiDigitDivision: TopicDef = {
  id: "estimating-multi-digit-division",
  title: t("Estimating Multi-Digit Division", "估算多位数除法"),
  summary: t(
    "Estimate a quotient with compatible numbers: a nearby dividend that divides easily.",
    "用相容数估算商：把被除数换成附近一个容易整除的数。",
  ),
  prerequisites: ["dividing-by-10-100-and-1000"],
  encompasses: [{ topic: "dividing-by-10-100-and-1000", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "choosing-compatible-numbers",
      title: t("Choosing compatible numbers", "选择相容数"),
      explanation: t(
        "**Compatible numbers** are numbers that divide easily, using a basic fact and zeros. To estimate $2{,}780 \\div 4$, look for a number close to $2{,}780$ that $4$ divides easily: $2{,}800$, because $28 \\div 4 = 7$.\n\n$2{,}780 \\div 4 \\approx 2{,}800 \\div 4 = 700$.",
        "**相容数**是指可以用口诀和添 $0$ 轻松相除的数。估算 $2{,}780 \\div 4$ 时，找一个接近 $2{,}780$、又容易被 $4$ 整除的数：$2{,}800$，因为 $28 \\div 4 = 7$。\n\n$2{,}780 \\div 4 \\approx 2{,}800 \\div 4 = 700$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 9);
          const unit = rng.bool() ? 10 : 100;
          const step = d * unit;
          const k = rng.int(2, 9);
          const c = step * k;
          const delta = rng.int(1, Math.floor(step / 3)) * rng.sign();
          const n = c + delta;
          const rounded = unit === 10 ? round10(n) : round100(n);
          if (n < 100 || rounded % d === 0) continue;
          const { options, correct } = shuffled(rng, math(`${fmt(c)} \\div ${d}`), [
            math(`${fmt(rounded)} \\div ${d}`),
            math(`${fmt(c + step)} \\div ${d}`),
            math(`${fmt(c - step)} \\div ${d}`),
          ]);
          return choiceProblem({
            prompt: t(
              `Which uses the best compatible numbers to estimate $${fmt(n)} \\div ${d}$?`,
              `估算 $${fmt(n)} \\div ${d}$ 时，用哪一组相容数最好？`,
            ),
            options,
            correct,
            solution: t(
              `$${fmt(c)}$ is close to $${fmt(n)}$ and divides easily: $${fmt(c)} \\div ${d} = ${fmt(c / d)}$. $${fmt(rounded)}$ does not divide evenly by $${d}$, and $${fmt(c + step)}$ and $${fmt(c - step)}$ are farther from $${fmt(n)}$.`,
              `$${fmt(c)}$ 接近 $${fmt(n)}$，而且容易整除：$${fmt(c)} \\div ${d} = ${fmt(c / d)}$。$${fmt(rounded)}$ 不能被 $${d}$ 整除，$${fmt(c + step)}$ 和 $${fmt(c - step)}$ 离 $${fmt(n)}$ 更远。`,
            ),
          });
        }
      },
    },
    {
      id: "estimating-the-quotient",
      title: t("Estimating the quotient", "估算商"),
      explanation: t(
        "Once you have compatible numbers, divide with a basic fact and zeros: $4{,}150 \\div 6 \\approx 4{,}200 \\div 6 = 700$, because $42 \\div 6 = 7$.",
        "找到相容数后，用口诀和添 $0$ 的方法相除：$4{,}150 \\div 6 \\approx 4{,}200 \\div 6 = 700$，因为 $42 \\div 6 = 7$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const unit = rng.bool() ? 10 : 100;
        const step = d * unit;
        const c = step * rng.int(2, 9);
        const n = c + rng.int(1, Math.floor(step / 3)) * rng.sign();
        const est = c / d;
        return numberProblem({
          prompt: t(
            `Estimate $${fmt(n)} \\div ${d}$ by using $${fmt(c)}$ in place of $${fmt(n)}$.`,
            `用 $${fmt(c)}$ 代替 $${fmt(n)}$，估算 $${fmt(n)} \\div ${d}$。`,
          ),
          answer: est,
          form: "integer",
          wrong: [est * 10, est / 10, c - d],
          solution: t(
            `$${fmt(c)} \\div ${d} = ${fmt(est)}$, because $${d} \\times ${fmt(est)} = ${fmt(c)}$. So $${fmt(n)} \\div ${d} \\approx ${fmt(est)}$.`,
            `$${fmt(c)} \\div ${d} = ${fmt(est)}$，因为 $${d} \\times ${fmt(est)} = ${fmt(c)}$。所以 $${fmt(n)} \\div ${d} \\approx ${fmt(est)}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Dividing with models

/** divisionModel draws the area model of n ÷ d: d on the left, the parts of the quotient on top (or "?"), and the areas inside. */
function divisionModel(d: number, lengths: readonly number[], top: readonly string[], cells: readonly string[]): Mark[] {
  return areaModel(lengths, [d], top, [String(d)], [cells]);
}

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
  prerequisites: ["dividing-by-one-digit-numbers-using-multiplication"],
  encompasses: [
    { topic: "dividing-by-one-digit-numbers-using-multiplication", weight: 0.6 },
    { topic: "two-digit-by-one-digit-multiplication-using-area-models", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "missing-side-lengths",
      title: t("Missing side lengths", "未知的边长"),
      explanation: t(
        "In division, the area model shows the total area (the dividend) and one side (the divisor). The other side is the quotient.\n\nFor $72 \\div 6$, split $72$ into $60 + 12$. The part with area $60$ has length $60 \\div 6 = 10$, and the part with area $12$ has length $12 \\div 6 = 2$.",
        "做除法时，面积模型给出总面积（被除数）和一条边（除数），另一条边就是商。\n\n计算 $72 \\div 6$ 时，把 $72$ 拆成 $60 + 12$。面积是 $60$ 的部分长 $60 \\div 6 = 10$，面积是 $12$ 的部分长 $12 \\div 6 = 2$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const q = quotientParts(rng, d, 2, d * Math.floor(rng.int(11, 99) / 10) < 10 && rng.bool());
        const lengths = places(q);
        const ask = rng.int(0, lengths.length - 1);
        const top = lengths.map((l, i) => (i === ask ? "?" : String(l)));
        const cells = lengths.map((l) => plain(d * l));
        const part = lengths[ask]!;
        return {
          ...numberProblem({
            prompt: t(
              `The area model shows $${d * q} \\div ${d}$. What length goes in place of ?`,
              `面积模型表示 $${d * q} \\div ${d}$。? 处的长度是多少？`,
            ),
            answer: part,
            form: "integer",
            wrong: [d * part, part + d, ask === 0 ? part / 10 : part * 10],
            solution: t(
              `That part has area $${d * part}$ and width $${d}$, so its length is $${d * part} \\div ${d} = ${part}$.`,
              `这一部分面积是 $${d * part}$，宽是 $${d}$，所以长是 $${d * part} \\div ${d} = ${part}$。`,
            ),
          }),
          figure: figure(
            divisionModel(d, lengths, top, cells),
            `A rectangle ${d} tall made of parts with areas ${lengths.map((l) => d * l).join(" and ")}.`,
            `一个高 ${d} 的长方形，各部分面积是 ${lengths.map((l) => d * l).join(" 和 ")}。`,
          ),
        };
      },
    },
    {
      id: "finding-the-quotient-from-a-model",
      title: t("Finding the quotient", "求出商"),
      explanation: t(
        "The whole length of the rectangle is the quotient: add the lengths of the parts. For $72 \\div 6$: $10 + 2 = 12$, so $72 \\div 6 = 12$.",
        "长方形的总长就是商：把各部分的长相加。计算 $72 \\div 6$：$10 + 2 = 12$，所以 $72 \\div 6 = 12$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const q = quotientParts(rng, d, 2, rng.bool());
        const lengths = places(q);
        const areas = lengths.map((l) => d * l);
        return {
          ...numberProblem({
            prompt: t(`Use the area model to find $${d * q} \\div ${d}$.`, `用面积模型计算 $${d * q} \\div ${d}$。`),
            answer: q,
            form: "integer",
            wrong: [lengths[0]!, q + 1, areas[1] ?? q - 1],
            solution: t(
              `${steps(...areas.map((a, i) => `${a} \\div ${d} = ${lengths[i]}`), `${lengths.join(" + ")} = ${q}`)}So $${d * q} \\div ${d} = ${q}$.`,
              `${steps(...areas.map((a, i) => `${a} \\div ${d} = ${lengths[i]}`), `${lengths.join(" + ")} = ${q}`)}所以 $${d * q} \\div ${d} = ${q}$。`,
            ),
          }),
          figure: figure(
            divisionModel(
              d,
              lengths,
              lengths.map(() => "?"),
              areas.map(plain),
            ),
            `A rectangle ${d} tall made of parts with areas ${areas.join(" and ")}.`,
            `一个高 ${d} 的长方形，各部分面积是 ${areas.join(" 和 ")}。`,
          ),
        };
      },
    },
  ],
};

/** modelProblem builds the two knowledge-point generators of a division area model with quotients of the given number of digits. */
function modelGenerators(digits: () => (rng: Rng) => number, aligned: boolean) {
  const draw = (rng: Rng): [number, number, number[]] => {
    const n = digits()(rng);
    // A two-digit dividend has no unaligned quotient for d = 9: 99 ÷ 9 = 11.
    const d = rng.int(aligned ? 2 : 3, aligned ? 4 : n === 2 ? 8 : 9);
    const q = quotientParts(rng, d, n, aligned);
    return [d, q, places(q)];
  };
  return {
    side(rng: Rng) {
      const [d, q, lengths] = draw(rng);
      const ask = rng.int(0, lengths.length - 1);
      const part = lengths[ask]!;
      const top = lengths.map((l, i) => (i === ask ? "?" : plain(l)));
      const areas = lengths.map((l) => d * l);
      return {
        ...numberProblem({
          prompt: t(
            `The area model shows $${fmt(d * q)} \\div ${d}$. What length goes in place of ?`,
            `面积模型表示 $${fmt(d * q)} \\div ${d}$。? 处的长度是多少？`,
          ),
          answer: part,
          form: "integer",
          wrong: [d * part, part * 10, part >= 10 ? part / 10 : part + d],
          solution: t(
            `That part has area $${fmt(d * part)}$ and width $${d}$: $${fmt(d * part)} \\div ${d} = ${fmt(part)}$.`,
            `这一部分面积是 $${fmt(d * part)}$，宽是 $${d}$：$${fmt(d * part)} \\div ${d} = ${fmt(part)}$。`,
          ),
        }),
        figure: figure(
          divisionModel(d, lengths, top, areas.map(plain)),
          `A rectangle ${d} tall made of parts with areas ${areas.join(", ")}.`,
          `一个高 ${d} 的长方形，各部分面积是 ${areas.join("、")}。`,
        ),
      };
    },
    whole(rng: Rng) {
      const [d, q, lengths] = draw(rng);
      const areas = lengths.map((l) => d * l);
      return {
        ...numberProblem({
          prompt: t(`Use the area model to find $${fmt(d * q)} \\div ${d}$.`, `用面积模型计算 $${fmt(d * q)} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [q - lengths[lengths.length - 1]!, q + 10, lengths[0]!],
          solution: t(
            `${steps(...areas.map((a, i) => `${fmt(a)} \\div ${d} = ${fmt(lengths[i]!)}`), `${lengths.map(fmt).join(" + ")} = ${fmt(q)}`)}So $${fmt(d * q)} \\div ${d} = ${fmt(q)}$.`,
            `${steps(...areas.map((a, i) => `${fmt(a)} \\div ${d} = ${fmt(lengths[i]!)}`), `${lengths.map(fmt).join(" + ")} = ${fmt(q)}`)}所以 $${fmt(d * q)} \\div ${d} = ${fmt(q)}$。`,
          ),
        }),
        figure: figure(
          divisionModel(
            d,
            lengths,
            lengths.map(() => "?"),
            areas.map(plain),
          ),
          `A rectangle ${d} tall made of parts with areas ${areas.join(", ")}.`,
          `一个高 ${d} 的长方形，各部分面积是 ${areas.join("、")}。`,
        ),
      };
    },
  };
}

const alignedModels = modelGenerators(() => () => 3, true);
const unalignedModels = modelGenerators(() => (rng) => (rng.bool(0.7) ? 3 : 2), false);

export const multiDigitByOneDigitDivisionUsingAreaModels: TopicDef = {
  id: "multi-digit-by-one-digit-division-using-area-models",
  title: t("Multi-Digit by One-Digit Division Using Area Models", "用面积模型计算多位数除以一位数"),
  summary: t(
    "Divide a three-digit number by a one-digit number with an area model of hundreds, tens and ones.",
    "用分成百、十、一三部分的面积模型计算三位数除以一位数。",
  ),
  prerequisites: ["two-digit-by-one-digit-division-using-area-models", "dividing-by-10-100-and-1000"],
  encompasses: [
    { topic: "two-digit-by-one-digit-division-using-area-models", weight: 0.8 },
    { topic: "dividing-by-10-100-and-1000", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "three-part-models",
      title: t("Models with three parts", "三部分的模型"),
      explanation: t(
        "For $963 \\div 3$, split $963 = 900 + 60 + 3$. Each part divides by $3$:\n\n$$900 \\div 3 = 300, \\quad 60 \\div 3 = 20, \\quad 3 \\div 3 = 1$$\n\nThese are the lengths of the three parts.",
        "计算 $963 \\div 3$ 时，把它拆成 $963 = 900 + 60 + 3$，每一部分都能被 $3$ 整除：\n\n$$900 \\div 3 = 300, \\quad 60 \\div 3 = 20, \\quad 3 \\div 3 = 1$$\n\n这就是三部分各自的长。",
      ),
      generate: alignedModels.side,
    },
    {
      id: "three-part-quotients",
      title: t("Finding the quotient", "求出商"),
      explanation: t(
        "Add the lengths of the parts: $963 \\div 3 = 300 + 20 + 1 = 321$.",
        "把各部分的长相加：$963 \\div 3 = 300 + 20 + 1 = 321$。",
      ),
      generate: alignedModels.whole,
    },
  ],
};

export const moreMultiDigitByOneDigitDivisionUsingAreaModels: TopicDef = {
  id: "more-multi-digit-by-one-digit-division-using-area-models",
  title: t("More Multi-Digit by One-Digit Division Using Area Models", "用面积模型计算多位数除以一位数（进阶）"),
  summary: t(
    "Use area models whose parts are not single places, such as 744 = 600 + 120 + 24 for 744 ÷ 6.",
    "使用各部分不是单个数位的面积模型，例如计算 744 ÷ 6 时把 744 拆成 600 + 120 + 24。",
  ),
  prerequisites: ["multi-digit-by-one-digit-division-using-area-models"],
  encompasses: [{ topic: "multi-digit-by-one-digit-division-using-area-models", weight: 0.8 }],
  xp: 14,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "parts-that-cross-places",
      title: t("Parts that cross places", "跨数位的部分"),
      explanation: t(
        "Often a digit of the dividend does not divide evenly. For $744 \\div 6$, the parts are chosen so each divides by $6$:\n\n$$744 = 600 + 120 + 24$$\n\nTheir lengths are $600 \\div 6 = 100$, $120 \\div 6 = 20$ and $24 \\div 6 = 4$.",
        "被除数的某一位常常不能整除。计算 $744 \\div 6$ 时，选取能被 $6$ 整除的几部分：\n\n$$744 = 600 + 120 + 24$$\n\n它们的长分别是 $600 \\div 6 = 100$，$120 \\div 6 = 20$，$24 \\div 6 = 4$。",
      ),
      generate: unalignedModels.side,
    },
    {
      id: "quotients-from-friendly-parts",
      title: t("Finding the quotient", "求出商"),
      explanation: t(
        "Add the lengths: $744 \\div 6 = 100 + 20 + 4 = 124$. Check: $6 \\times 124 = 744$.",
        "把各部分的长相加：$744 \\div 6 = 100 + 20 + 4 = 124$。检验：$6 \\times 124 = 744$。",
      ),
      generate: unalignedModels.whole,
    },
  ],
};

export const twoDigitByOneDigitDivisionUsingPartialQuotients: TopicDef = {
  id: "two-digit-by-one-digit-division-using-partial-quotients",
  title: t("Two-Digit by One-Digit Division Using Partial Quotients", "用部分商计算两位数除以一位数"),
  summary: t(
    "Divide by taking away groups of the divisor, such as 10 groups at a time, and adding the partial quotients.",
    "一次去掉若干组除数（例如 10 组），再把各部分商相加。",
  ),
  prerequisites: ["two-digit-by-one-digit-division-using-area-models"],
  encompasses: [{ topic: "two-digit-by-one-digit-division-using-area-models", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "taking-away-groups",
      title: t("Taking away groups", "去掉若干组"),
      explanation: t(
        "The **partial quotients** method takes away easy groups of the divisor. For $84 \\div 6$, take away $10$ groups of $6$:\n\n$$84 - 60 = 24$$\n\n$24$ is still left to divide.",
        "**部分商**的方法是一次去掉容易计算的若干组除数。计算 $84 \\div 6$ 时，先去掉 $10$ 组 $6$：\n\n$$84 - 60 = 24$$\n\n还剩 $24$ 要继续除。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const q = rng.int(11, Math.floor(99 / d));
        const n = d * q;
        return numberProblem({
          prompt: t(
            `To find $${n} \\div ${d}$, take away $10$ groups of $${d}$. How much is left?`,
            `计算 $${n} \\div ${d}$ 时，先去掉 $10$ 组 $${d}$。还剩多少？`,
          ),
          answer: n - 10 * d,
          form: "integer",
          wrong: [n - 10, n - d, q - 10],
          solution: t(
            `$10$ groups of $${d}$ are $${10 * d}$, and $${n} - ${10 * d} = ${n - 10 * d}$.`,
            `$10$ 组 $${d}$ 是 $${10 * d}$，$${n} - ${10 * d} = ${n - 10 * d}$。`,
          ),
        });
      },
    },
    {
      id: "adding-partial-quotients",
      title: t("Adding the partial quotients", "把部分商相加"),
      explanation: t(
        "Keep taking away groups until nothing is left, then add up how many groups you took:\n\n$$84 - 60 = 24 \\quad (10 \\text{ groups}), \\qquad 24 - 24 = 0 \\quad (4 \\text{ groups})$$\n\n$84 \\div 6 = 10 + 4 = 14$.",
        "不断去掉若干组，直到不剩，再把去掉的组数相加：\n\n$$84 - 60 = 24 \\quad (10 \\text{ 组}), \\qquad 24 - 24 = 0 \\quad (4 \\text{ 组})$$\n\n$84 \\div 6 = 10 + 4 = 14$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const q = rng.int(11, Math.floor(99 / d));
        const n = d * q;
        return numberProblem({
          prompt: t(`Use partial quotients to find $${n} \\div ${d}$.`, `用部分商计算 $${n} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [chunks(n, d)[0]!, q + 1, n - 10 * d],
          solution: t(
            `${steps(...partialSteps(n, d))}Add the partial quotients: $${quotientLine(n, d)}$.`,
            `${steps(...partialSteps(n, d))}把部分商相加：$${quotientLine(n, d)}$。`,
          ),
        });
      },
    },
  ],
};

export const twoDigitByOneDigitDivisionWithRemaindersUsingPartialQuotients: TopicDef = {
  id: "two-digit-by-one-digit-division-with-remainders-using-partial-quotients",
  title: t("Two-Digit by One-Digit Division With Remainders Using Partial Quotients", "用部分商计算有余数的两位数除以一位数"),
  summary: t("Use partial quotients when the division leaves a remainder.", "在有余数的除法中使用部分商。"),
  prerequisites: ["two-digit-by-one-digit-division-using-partial-quotients", "division-with-remainders"],
  encompasses: [
    { topic: "two-digit-by-one-digit-division-using-partial-quotients", weight: 0.8 },
    { topic: "division-with-remainders", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.4.NBT.B.6"],
  knowledgePoints: [
    {
      id: "partial-quotients-with-a-remainder",
      title: t("The quotient", "商"),
      explanation: t(
        "Take away groups as before. Stop when what is left is less than the divisor: that is the remainder.\n\n$$89 - 60 = 29 \\quad (6 \\times 10), \\qquad 29 - 24 = 5 \\quad (6 \\times 4)$$\n\n$5$ is less than $6$, so $89 \\div 6 = 14 \\text{ R } 5$.",
        "像前面一样去掉若干组，当剩下的数比除数小时停止，剩下的就是余数。\n\n$$89 - 60 = 29 \\quad (6 \\times 10), \\qquad 29 - 24 = 5 \\quad (6 \\times 4)$$\n\n$5$ 比 $6$ 小，所以 $89 \\div 6 = 14 \\cdots\\cdots 5$。",
      ),
      generate(rng) {
        const d = rng.int(3, 8);
        const r = rng.int(1, d - 1);
        const q = rng.int(11, Math.floor((99 - r) / d));
        const n = d * q + r;
        return numberProblem({
          prompt: t(`What is the quotient of $${n} \\div ${d}$? (There is a remainder.)`, `$${n} \\div ${d}$ 的商是多少？（有余数。）`),
          answer: q,
          form: "integer",
          wrong: [q + 1, chunks(n, d)[0]!, r],
          solution: t(
            `${steps(...partialSteps(n, d))}$${r}$ is less than $${d}$, so stop. The quotient is $${quotientLine(n, d)}$, with remainder $${r}$.`,
            `${steps(...partialSteps(n, d))}$${r}$ 比 $${d}$ 小，停止。商是 $${quotientLine(n, d)}$，余数是 $${r}$。`,
          ),
        });
      },
    },
    {
      id: "remainders-from-partial-quotients",
      title: t("The remainder", "余数"),
      explanation: t(
        "The remainder is the amount left after the last subtraction. Check it is less than the divisor; if not, another group can be taken away.",
        "余数是最后一次相减后剩下的数。检查它是否比除数小；如果不比除数小，还能再去掉一组。",
      ),
      generate(rng) {
        const d = rng.int(3, 8);
        const r = rng.int(1, d - 1);
        const q = rng.int(11, Math.floor((99 - r) / d));
        const n = d * q + r;
        return numberProblem({
          prompt: t(`Use partial quotients to find the remainder of $${n} \\div ${d}$.`, `用部分商求 $${n} \\div ${d}$ 的余数。`),
          answer: r,
          form: "integer",
          wrong: [q, r + d, d - r],
          solution: t(
            `${steps(...partialSteps(n, d))}$${r}$ is less than $${d}$, so $${n} \\div ${d} = ${qr(q, r).en}$. The remainder is $${r}$.`,
            `${steps(...partialSteps(n, d))}$${r}$ 比 $${d}$ 小，所以 $${n} \\div ${d} = ${qr(q, r).zh}$。余数是 $${r}$。`,
          ),
        });
      },
    },
  ],
};

export const multiDigitByOneDigitDivisionUsingPartialQuotients: TopicDef = {
  id: "multi-digit-by-one-digit-division-using-partial-quotients",
  title: t("Multi-Digit by One-Digit Division Using Partial Quotients", "用部分商计算多位数除以一位数"),
  summary: t(
    "Divide three- and four-digit numbers by a one-digit number with partial quotients, with or without a remainder.",
    "用部分商计算三位数、四位数除以一位数，包括有余数的情况。",
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
    {
      id: "three-digit-dividends",
      title: t("Three-digit dividends", "三位数被除数"),
      explanation: t(
        "With larger numbers, take away $100$ groups at a time first, then $10$ groups, then single groups:\n\n$$742 - 700 = 42 \\quad (7 \\times 100), \\qquad 42 - 42 = 0 \\quad (7 \\times 6)$$\n\n$742 \\div 7 = 100 + 6 = 106$.",
        "数比较大时，先一次去掉 $100$ 组，再去掉 $10$ 组，最后一组一组地去掉：\n\n$$742 - 700 = 42 \\quad (7 \\times 100), \\qquad 42 - 42 = 0 \\quad (7 \\times 6)$$\n\n$742 \\div 7 = 100 + 6 = 106$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(Math.ceil(100 / d) + 1, Math.floor(999 / d));
        const n = d * q;
        const ks = chunks(n, d);
        return numberProblem({
          prompt: t(`Use partial quotients to find $${n} \\div ${d}$.`, `用部分商计算 $${n} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [q - ks[ks.length - 1]!, ks[0]!, q + 10],
          solution: t(
            `${steps(...partialSteps(n, d))}Add the partial quotients: $${quotientLine(n, d)}$.`,
            `${steps(...partialSteps(n, d))}把部分商相加：$${quotientLine(n, d)}$。`,
          ),
        });
      },
    },
    {
      id: "multi-digit-quotients-with-remainders",
      title: t("Quotients with remainders", "有余数的商"),
      explanation: t(
        "When the last amount left is less than the divisor but not zero, it is the remainder:\n\n$$1{,}000 - 800 = 200 \\quad (8 \\times 100), \\qquad 200 - 160 = 40 \\quad (8 \\times 20), \\qquad 40 - 40 = 0 \\quad (8 \\times 5)$$\n\nso $1{,}000 \\div 8 = 125$, while $1{,}003 \\div 8 = 125 \\text{ R } 3$.",
        "当最后剩下的数比除数小但不是 $0$ 时，它就是余数：\n\n$$1{,}000 - 800 = 200 \\quad (8 \\times 100), \\qquad 200 - 160 = 40 \\quad (8 \\times 20), \\qquad 40 - 40 = 0 \\quad (8 \\times 5)$$\n\n所以 $1{,}000 \\div 8 = 125$，而 $1{,}003 \\div 8 = 125 \\cdots\\cdots 3$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const r = rng.int(1, d - 1);
        const q = rng.int(Math.ceil(100 / d) + 1, Math.floor((rng.bool(0.3) ? 9999 : 999) / d) - 1);
        const n = d * q + r;
        const ks = chunks(n, d);
        return numberProblem({
          prompt: t(
            `What is the quotient of $${fmt(n)} \\div ${d}$? (There is a remainder.)`,
            `$${fmt(n)} \\div ${d}$ 的商是多少？（有余数。）`,
          ),
          answer: q,
          form: "integer",
          wrong: [q + 1, q - ks[ks.length - 1]!, ks[0]!],
          solution: t(
            `${steps(...partialSteps(n, d))}$${r}$ is less than $${d}$, so stop. The quotient is $${quotientLine(n, d)}$, with remainder $${r}$.`,
            `${steps(...partialSteps(n, d))}$${r}$ 比 $${d}$ 小，停止。商是 $${quotientLine(n, d)}$，余数是 $${r}$。`,
          ),
        });
      },
    },
    {
      id: "multi-digit-remainders",
      title: t("Finding the remainder", "求余数"),
      explanation: t(
        "The remainder is what is left after the last group is taken away. It must be less than the divisor. Check with $\\text{divisor} \\times \\text{quotient} + \\text{remainder} = \\text{dividend}$.",
        "余数是去掉最后一组后剩下的数，它必须比除数小。可以用 $\\text{除数} \\times \\text{商} + \\text{余数} = \\text{被除数}$ 来检验。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const r = rng.int(1, d - 1);
        const q = rng.int(Math.ceil(100 / d) + 1, Math.floor(999 / d) - 1);
        const n = d * q + r;
        return numberProblem({
          prompt: t(`Find the remainder of $${n} \\div ${d}$.`, `求 $${n} \\div ${d}$ 的余数。`),
          answer: r,
          form: "integer",
          wrong: [d - r, r + d, q % 10],
          solution: t(
            `${steps(...partialSteps(n, d))}So $${n} \\div ${d} = ${qr(q, r).en}$. Check: $${d} \\times ${q} + ${r} = ${n}$.`,
            `${steps(...partialSteps(n, d))}所以 $${n} \\div ${d} = ${qr(q, r).zh}$。检验：$${d} \\times ${q} + ${r} = ${n}$。`,
          ),
        });
      },
    },
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
