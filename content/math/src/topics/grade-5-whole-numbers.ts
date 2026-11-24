import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q, svgDocument } from "@ga/subject-math";
import { numberProblem } from "../problems.ts";
import { type Pair, picked, pickedMath, type Walk, walkThrough } from "./early-grades-more-kit.ts";
import { answered, areaGridFigure, digitsChart, equalTape, grouped, lineFigure, type Miss, point, tapeFigure } from "./upper-grades-kit.ts";

// 5th Grade Math: whole number expressions, negative numbers, and the standard algorithms for multiplication and division.

/** fmt writes an integer in LaTeX with thousands separators: "3{,}400", "-1{,}200". */
const fmt = (n: number): string => (n < 0 ? `-${fmt(-n)}` : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}"));

/** plain writes an integer with thousands separators for running text and figures: "3,400". */
const plain = (n: number): string => (n < 0 ? `−${plain(-n)}` : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","));

/** qr writes a quotient with a remainder: "7 R 5" in English, "7……5" in Chinese. */
const qr = (q: number, r: number) => ({ en: `${fmt(q)} \\text{ R } ${r}`, zh: `${fmt(q)} \\cdots\\cdots ${r}` });

/** randomWithDigits is a random whole number with exactly d digits. */
const randomWithDigits = (rng: Rng, d: number): number => rng.int(10 ** (d - 1), 10 ** d - 1);

/** noCarry multiplies digit by digit, keeping only the ones digit of each product: the result of forgetting to regroup. */
function noCarry(n: number, a: number): number {
  let out = 0;
  let p = 1;
  for (let m = n; m > 0; m = Math.floor(m / 10), p *= 10) out += ((a * (m % 10)) % 10) * p;
  return out;
}

/** dropZeros removes the zeros inside a quotient, the slip of skipping a place in long division: 305 → 35. */
const dropZeros = (q: number): number => Number(String(q).replace(/0/g, "")) || q;

/** forgetPlaces multiplies n by each digit of m and adds, ignoring the place values: the slip of forgetting the zeros. */
const forgetPlaces = (n: number, m: number): number =>
  String(m)
    .split("")
    .reduce((s, d) => s + n * Number(d), 0);

/** DivisionRow is one step of long division: the part divided, its quotient digit and the remainder. */
interface DivisionRow {
  readonly part: number;
  readonly digit: number;
  readonly rest: number;
}

/** longDivision lists the steps of long division of n by d, starting at the first part at least d. */
function longDivision(n: number, d: number): DivisionRow[] {
  const rows: DivisionRow[] = [];
  let cur = 0;
  for (const ch of String(n)) {
    cur = cur * 10 + Number(ch);
    if (rows.length === 0 && cur < d) continue;
    const digit = Math.floor(cur / d);
    rows.push({ part: cur, digit, rest: cur - digit * d });
    cur -= digit * d;
  }
  return rows;
}

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
  intro?: Text,
): TopicDef {
  return {
    id,
    title,
    summary,
    ...(intro && { intro }),
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss(...standards),
    knowledgePoints,
  };
}

const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

// ---------------------------------------------------------------------------
// Whole number expressions

type Op = "+" | "-" | "*" | "/";

const opTex: Record<Op, string> = { "+": "+", "-": "-", "*": "\\times", "/": "\\div" };

/** chainTex writes numbers joined by operations in LaTeX. */
const chainTex = (nums: readonly number[], ops: readonly Op[]) =>
  nums.map((n, i) => (i === 0 ? fmt(n) : `${opTex[ops[i - 1]!]} ${fmt(n)}`)).join(" ");

const apply = (a: number, op: Op, b: number) => (op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b);

/** evalOrder evaluates a chain with the order of operations, or undefined if a step leaves the whole numbers. */
function evalOrder(nums: readonly number[], ops: readonly Op[]): { value: number; terms: number[] } | undefined {
  const terms: number[] = [nums[0]!];
  const signs: Op[] = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i]!;
    const n = nums[i + 1]!;
    if (op === "*" || op === "/") {
      const v = apply(terms[terms.length - 1]!, op, n);
      if (!Number.isInteger(v)) return undefined;
      terms[terms.length - 1] = v;
    } else {
      terms.push(n);
      signs.push(op);
    }
  }
  let value = terms[0]!;
  for (let i = 0; i < signs.length; i++) {
    value = apply(value, signs[i]!, terms[i + 1]!);
    if (value < 0) return undefined;
  }
  return { value, terms };
}

/** evalLeftToRight evaluates a chain from left to right, ignoring the order of operations: a typical slip. */
function evalLeftToRight(nums: readonly number[], ops: readonly Op[]): number {
  let v = nums[0]!;
  ops.forEach((op, i) => {
    v = apply(v, op, nums[i + 1]!);
  });
  return v;
}

/** randomChain draws a chain of `count` operations, with exact divisions, at least one × or ÷, and a whole-number value. */
function randomChain(rng: Rng, count: number): { nums: number[]; ops: Op[]; value: number; terms: number[] } {
  for (;;) {
    const ops: Op[] = Array.from({ length: count }, () => rng.pick(["+", "-", "*", "/"] as const));
    if (!ops.some((o) => o === "*" || o === "/") || !ops.some((o) => o === "+" || o === "-")) continue;
    if (ops.some((o, i) => o === "/" && (ops[i - 1] === "/" || ops[i - 1] === "*"))) continue;
    const nums = Array.from({ length: count + 1 }, (_, i) => {
      const near = [ops[i - 1], ops[i]];
      return near.includes("*") || near.includes("/") ? rng.int(2, 12) : rng.int(5, 60);
    });
    ops.forEach((o, i) => {
      if (o === "/") nums[i] = nums[i + 1]! * rng.int(2, 9);
    });
    const r = evalOrder(nums, ops);
    if (!r || r.value > 400) continue;
    return { nums, ops, ...r };
  }
}

/** chainCheck undoes the adding and subtracting of a chain from the end, which leads back to its first part. */
function chainCheck(terms: readonly number[], signs: readonly Op[], value: number): Pair {
  let line = fmt(value);
  for (let i = signs.length - 1; i >= 0; i--) line += ` ${signs[i] === "+" ? "-" : "+"} ${fmt(terms[i + 1]!)}`;
  const tex = `${line} = ${fmt(terms[0]!)}`;
  return [
    `Undo the adding and subtracting from the end. The result $${tex}$ is the first part again.`,
    `从最后一步倒着算，把加减都撤销：$${tex}$，又回到了第一部分。`,
  ];
}

/** chainProblem asks for the value of a chain of `count` operations, worked as products and quotients first, then sums and differences. */
function chainProblem(rng: Rng, count: number): Problem {
  const { nums, ops, value, terms } = randomChain(rng, count);
  const signs = ops.filter((o) => o === "+" || o === "-");
  const after = terms.map((n, i) => (i === 0 ? fmt(n) : `${opTex[signs[i - 1]!]} ${fmt(n)}`)).join(" ");
  const ltr = evalLeftToRight(nums, ops);
  const misses: Miss[] = [];
  if (Number.isInteger(ltr))
    misses.push([
      ltr,
      "That works from left to right. Multiply and divide before you add and subtract.",
      "这是从左往右依次算的结果。要先算乘除，再算加减。",
    ]);
  if (signs.includes("-"))
    misses.push([
      terms.reduce((s, n) => s + n, 0),
      "That adds every part. A minus sign takes its part away.",
      "这是把每一部分都加起来了。减号后面的部分要减去。",
    ]);
  return answered(
    [`Evaluate $${chainTex(nums, ops)}$.`, `计算 $${chainTex(nums, ops)}$。`],
    value,
    [
      [
        ["Multiply and divide", "先算乘除"],
        ["Work out each product and quotient, from left to right.", "从左到右算出每个积和商。"],
        [chainTex(nums, ops), `= ${after}`],
      ],
      [["Add and subtract", "再算加减"], ["Then add and subtract from left to right.", "再从左到右算加减。"], [`= ${fmt(value)}`]],
    ],
    chainCheck(terms, signs, value),
    misses,
  );
}

/** Bracketed is an expression with grouping symbols, its value, the value a slip gives and why, the steps of its evaluation, and the last step undone. */
interface Bracketed {
  readonly tex: string;
  readonly value: number;
  readonly slip: number;
  readonly why: Pair;
  readonly steps: readonly string[];
  readonly undo: string;
}

/** ignored is the reason for working an expression as if it had no parentheses. */
const ignored: Pair = [
  "That works the expression as if there were no parentheses. Do the part in parentheses first.",
  "这是当作没有括号来算的结果。要先算括号里面的。",
];

/** oneParenthesis draws an expression with one pair of parentheses. */
function oneParenthesis(rng: Rng): Bracketed {
  for (;;) {
    const [a, b, c] = [rng.int(3, 40), rng.int(2, 30), rng.int(2, 9)];
    const kind = rng.int(0, 4);
    let r: Bracketed;
    if (kind === 0)
      r = {
        tex: `(${a} + ${b}) \\times ${c}`,
        value: (a + b) * c,
        slip: a + b * c,
        why: ignored,
        steps: [`= ${a + b} \\times ${c}`],
        undo: `${fmt((a + b) * c)} \\div ${c} = ${a + b} = ${a} + ${b}`,
      };
    else if (kind === 1)
      r = {
        tex: `${c} \\times (${a} - ${b})`,
        value: c * (a - b),
        slip: c * a - b,
        why: ignored,
        steps: [`= ${c} \\times ${a - b}`],
        undo: `${fmt(c * (a - b))} \\div ${c} = ${a - b} = ${a} - ${b}`,
      };
    else if (kind === 2) {
      const s = c * rng.int(3, 12);
      const x = rng.int(1, s - 1);
      r = {
        tex: `(${s - x} + ${x}) \\div ${c}`,
        value: s / c,
        slip: s - x + x / c,
        why: ignored,
        steps: [`= ${s} \\div ${c}`],
        undo: `${s / c} \\times ${c} = ${s} = ${s - x} + ${x}`,
      };
    } else if (kind === 3)
      r = {
        tex: `${a + b + c + 20} - (${b} + ${c})`,
        value: a + 20,
        slip: a + 20 + 2 * c,
        why: ignored,
        steps: [`= ${a + b + c + 20} - ${b + c}`],
        undo: `${a + 20} + ${b + c} = ${a + b + c + 20}`,
      };
    else {
      const d = rng.int(2, 9);
      r = {
        tex: `${a} + ${d} \\times (${b + c} - ${c})`,
        value: a + d * b,
        slip: a + d * (b + c) - c,
        why: ignored,
        steps: [`= ${a} + ${d} \\times ${b}`, `= ${a} + ${d * b}`],
        undo: `${a + d * b} - ${a} = ${d * b} = ${d} \\times ${b}`,
      };
    }
    if (r.value < 0 || r.slip === r.value || !Number.isInteger(r.slip) || r.value > 500) continue;
    return r;
  }
}

/** nestedGroups draws an expression with brackets around parentheses. */
function nestedGroups(rng: Rng): Bracketed {
  for (;;) {
    const kind = rng.int(0, 2);
    let r: Bracketed;
    if (kind === 0) {
      const [a, c, d] = [rng.int(2, 9), rng.int(2, 15), rng.int(2, 15)];
      const b = c + d + rng.int(1, 20);
      const inner = b - (c + d);
      r = {
        tex: `${a} \\times [${b} - (${c} + ${d})]`,
        value: a * inner,
        slip: a * (b - c + d),
        why: [
          `That subtracts only ${c} and then adds ${d}. The whole sum $${c} + ${d}$ is taken away.`,
          `这是只减去 ${c}，又加上了 ${d}。要减去的是整个和 $${c} + ${d}$。`,
        ],
        steps: [`= ${a} \\times [${b} - ${c + d}]`, `= ${a} \\times ${inner}`],
        undo: `${a * inner} \\div ${a} = ${inner}, \\quad ${inner} + ${c + d} = ${b}`,
      };
    } else if (kind === 1) {
      const [a, b, c, e] = [rng.int(2, 20), rng.int(2, 20), rng.int(2, 6), rng.int(2, 9)];
      const p = (a + b) * c;
      const d = p - e * rng.int(1, Math.floor(p / e));
      if (d <= 0 || (p - d) % e !== 0) continue;
      r = {
        tex: `[(${a} + ${b}) \\times ${c} - ${d}] \\div ${e}`,
        value: (p - d) / e,
        slip: (a + b * c - d) / e,
        why: [
          `That multiplies before it adds $${a} + ${b}$. The sum in parentheses comes first.`,
          `这是没先算 $${a} + ${b}$ 就做了乘法。小括号里的和要先算。`,
        ],
        steps: [`= [${a + b} \\times ${c} - ${d}] \\div ${e}`, `= [${p} - ${d}] \\div ${e}`, `= ${p - d} \\div ${e}`],
        undo: `${(p - d) / e} \\times ${e} + ${d} = ${p} = ${a + b} \\times ${c}`,
      };
    } else {
      const [a, b, c, d] = [rng.int(10, 60), rng.int(2, 6), rng.int(2, 9), rng.int(2, 9)];
      const inner = c * d + rng.int(1, 9);
      const v = b * (inner - c * d);
      r = {
        tex: `${a} + ${b} \\times [${inner} - ${c} \\times ${d}]`,
        value: a + v,
        slip: (a + b) * (inner - c * d),
        why: [`That adds ${a} and ${b} first. Multiply before you add.`, `这是先算了 ${a} 加 ${b}。要先乘后加。`],
        steps: [`= ${a} + ${b} \\times [${inner} - ${c * d}]`, `= ${a} + ${b} \\times ${inner - c * d}`, `= ${a} + ${v}`],
        undo: `${a + v} - ${a} = ${v} = ${b} \\times ${inner - c * d}`,
      };
    }
    if (r.value < 0 || r.slip === r.value || !Number.isInteger(r.slip) || r.slip < 0) continue;
    return r;
  }
}

/** bracketedProblem asks for the value of an expression with grouping symbols. */
function bracketedProblem(r: Bracketed): Problem {
  return answered(
    [`Evaluate $${r.tex}$.`, `计算 $${r.tex}$。`],
    r.value,
    [
      [
        ["Work inside first", "先算括号里面"],
        ["Start with the innermost grouping symbols.", "从最里层的括号算起。"],
        [r.tex, ...r.steps],
      ],
      [["Finish", "算完"], ["Then finish what is left.", "再算完剩下的部分。"], [`= ${fmt(r.value)}`]],
    ],
    [`Undo the steps from the outside in: $${r.undo}$.`, `从外往里倒着算回去：$${r.undo}$。`],
    [[r.slip, r.why[0], r.why[1]]],
  );
}

/** Phrase is a calculation described in words: the expression it gives, its value, its two steps, the last step undone, and expressions it might be confused with, each with its value when whole and the reason it does not fit. */
interface Phrase {
  readonly en: string;
  readonly zh: string;
  readonly tex: string;
  readonly value: number;
  readonly first: string;
  readonly second: string;
  readonly undo: string;
  readonly why: Pair;
  readonly wrong: readonly (readonly [tex: string, value: number | undefined, en: string, zh: string])[];
}

/** stepPhrase draws a two-step calculation described as instructions: "add 8 and 7, then multiply by 2". */
function stepPhrase(rng: Rng): Phrase {
  const [a, b, c] = [rng.int(6, 40), rng.int(2, 30), rng.int(2, 9)];
  switch (rng.int(0, 3)) {
    case 0:
      return {
        en: `Add ${a} and ${b}, then multiply by ${c}.`,
        zh: `${a} 加 ${b}，再乘 ${c}。`,
        tex: `(${a} + ${b}) \\times ${c}`,
        value: (a + b) * c,
        first: `${a} + ${b} = ${a + b}`,
        second: `${a + b} \\times ${c} = ${(a + b) * c}`,
        undo: `${(a + b) * c} \\div ${c} = ${a + b}`,
        why: ["The adding comes first, so it goes in parentheses", "先做加法，所以加法要放在括号里"],
        wrong: [
          [
            `${a} + ${b} \\times ${c}`,
            a + b * c,
            "Without parentheses this multiplies first, but the adding comes first.",
            "没有括号就要先乘，可是这里要先加。",
          ],
          [`${a} \\times ${c} + ${b}`, a * c + b, `This multiplies only ${a} by ${c}.`, `这只把 ${a} 乘了 ${c}。`],
          [`${a} + ${b} + ${c}`, a + b + c, `This adds ${c} instead of multiplying by it.`, `这是加 ${c}，而不是乘 ${c}。`],
        ],
      };
    case 1: {
      const big = b + c * rng.int(3, 15);
      return {
        en: `Subtract ${b} from ${big}, then divide by ${c}.`,
        zh: `从 ${big} 中减去 ${b}，再除以 ${c}。`,
        tex: `(${big} - ${b}) \\div ${c}`,
        value: (big - b) / c,
        first: `${big} - ${b} = ${big - b}`,
        second: `${big - b} \\div ${c} = ${(big - b) / c}`,
        undo: `${(big - b) / c} \\times ${c} = ${big - b}`,
        why: ["The subtracting comes first, so it goes in parentheses", "先做减法，所以减法要放在括号里"],
        wrong: [
          [
            `${big} - ${b} \\div ${c}`,
            undefined,
            "Without parentheses this divides first, but the subtracting comes first.",
            "没有括号就要先除，可是这里要先减。",
          ],
          [
            `(${b} - ${big}) \\div ${c}`,
            undefined,
            `This takes ${big} from ${b}, the wrong way round.`,
            `这是从 ${b} 里减 ${big}，减反了。`,
          ],
          [`${big} \\div ${c} - ${b}`, undefined, "This divides before it subtracts.", "这是先除后减，顺序反了。"],
        ],
      };
    }
    case 2:
      return {
        en: `Multiply ${a} by ${c}, then add ${b}.`,
        zh: `${a} 乘 ${c}，再加 ${b}。`,
        tex: `${a} \\times ${c} + ${b}`,
        value: a * c + b,
        first: `${a} \\times ${c} = ${a * c}`,
        second: `${a * c} + ${b} = ${a * c + b}`,
        undo: `${a * c + b} - ${b} = ${a * c}`,
        why: [
          "The multiplying comes first, and it comes first anyway, so no parentheses are needed",
          "先做乘法，本来就先算乘法，所以不用括号",
        ],
        wrong: [
          [
            `${a} \\times (${c} + ${b})`,
            a * (c + b),
            "The parentheses make the adding come first, but the multiplying comes first.",
            "括号让加法先算了，可是这里要先乘。",
          ],
          [
            `${a} + ${c} \\times ${b}`,
            a + c * b,
            `This multiplies ${c} by ${b}, not ${a} by ${c}.`,
            `这是 ${c} 乘 ${b}，不是 ${a} 乘 ${c}。`,
          ],
          [`(${a} + ${b}) \\times ${c}`, (a + b) * c, "This adds before it multiplies.", "这是先加后乘，顺序反了。"],
        ],
      };
    default: {
      const big = c * (b + rng.int(2, 9));
      return {
        en: `Divide ${big} by ${c}, then subtract ${b}.`,
        zh: `${big} 除以 ${c}，再减去 ${b}。`,
        tex: `${big} \\div ${c} - ${b}`,
        value: big / c - b,
        first: `${big} \\div ${c} = ${big / c}`,
        second: `${big / c} - ${b} = ${big / c - b}`,
        undo: `${big / c - b} + ${b} = ${big / c}`,
        why: [
          "The dividing comes first, and it comes first anyway, so no parentheses are needed",
          "先做除法，本来就先算除法，所以不用括号",
        ],
        wrong: [
          [`(${big} - ${b}) \\div ${c}`, undefined, "This subtracts before it divides.", "这是先减后除，顺序反了。"],
          [
            `${b} - ${big} \\div ${c}`,
            undefined,
            `This takes the quotient away from ${b}, the wrong way round.`,
            `这是用 ${b} 减商，减反了。`,
          ],
          [`${c} \\div ${big} - ${b}`, undefined, `This divides ${c} by ${big}, the wrong way round.`, `这是 ${c} 除以 ${big}，除反了。`],
        ],
      };
    }
  }
}

/** termPhrase draws an expression described with the words sum, difference, product and quotient. */
function termPhrase(rng: Rng): Phrase {
  const [a, b, c] = [rng.int(2, 12), rng.int(3, 25), rng.int(2, 25)];
  switch (rng.int(0, 4)) {
    case 0:
      return {
        en: `the product of ${a} and the sum of ${b} and ${c}`,
        zh: `${a} 与 ${b} 和 ${c} 的和的积`,
        tex: `${a} \\times (${b} + ${c})`,
        value: a * (b + c),
        first: `${b} + ${c} = ${b + c}`,
        second: `${a} \\times ${b + c} = ${a * (b + c)}`,
        undo: `${a * (b + c)} \\div ${a} = ${b + c} = ${b} + ${c}`,
        why: [`The words multiply ${a} by the whole sum, so the sum goes in parentheses`, `文字是用 ${a} 乘整个和，所以和要放在括号里`],
        wrong: [
          [
            `${a} \\times ${b} + ${c}`,
            a * b + c,
            `Without parentheses only ${b} is multiplied by ${a}, not the whole sum.`,
            `没有括号，只有 ${b} 乘了 ${a}，不是整个和。`,
          ],
          [
            `${a} + ${b} \\times ${c}`,
            a + b * c,
            "This is a sum with a product in it, not a product of a sum.",
            "这是一个含有积的和，不是和的积。",
          ],
          [
            `${a} \\times ${b} \\times ${c}`,
            a * b * c,
            `This multiplies all three. The sum of ${b} and ${c} is never found.`,
            `这是三个数相乘，没有求 ${b} 与 ${c} 的和。`,
          ],
        ],
      };
    case 1:
      return {
        en: `the sum of ${b} and the product of ${a} and ${c}`,
        zh: `${b} 与 ${a} 和 ${c} 的积的和`,
        tex: `${b} + ${a} \\times ${c}`,
        value: b + a * c,
        first: `${a} \\times ${c} = ${a * c}`,
        second: `${b} + ${a * c} = ${b + a * c}`,
        undo: `${b + a * c} - ${b} = ${a * c} = ${a} \\times ${c}`,
        why: [`The words add ${b} to a product, and the product comes first anyway`, `文字是 ${b} 加上一个积，本来就先算积`],
        wrong: [
          [`(${b} + ${a}) \\times ${c}`, (b + a) * c, "The parentheses make this a product of a sum.", "括号让它变成了和的积。"],
          [
            `${b} \\times ${a} + ${c}`,
            b * a + c,
            `This multiplies ${b} by ${a}, but ${b} is added.`,
            `这是 ${b} 乘 ${a}，可是 ${b} 是要加上去的。`,
          ],
          [`${b} + ${a} + ${c}`, b + a + c, `This adds ${c} instead of multiplying by it.`, `这是加 ${c}，而不是乘 ${c}。`],
        ],
      };
    case 2: {
      const big = a * (c + rng.int(1, 9));
      const top = b + Math.floor(big / a);
      return {
        en: `the difference of ${top} and the quotient of ${big} and ${a}`,
        zh: `${top} 与 ${big} 除以 ${a} 的商的差`,
        tex: `${top} - ${big} \\div ${a}`,
        value: top - big / a,
        first: `${big} \\div ${a} = ${big / a}`,
        second: `${top} - ${big / a} = ${top - big / a}`,
        undo: `${top - big / a} + ${big / a} = ${top}`,
        why: [
          `The words take a quotient away from ${top}, and the quotient comes first anyway`,
          `文字是从 ${top} 里减去一个商，本来就先算商`,
        ],
        wrong: [
          [
            `(${top} - ${big}) \\div ${a}`,
            undefined,
            "This divides a difference. The words subtract a quotient.",
            "这是差除以一个数，文字说的是减去一个商。",
          ],
          [
            `${big} \\div ${a} - ${top}`,
            undefined,
            `This subtracts the wrong way round. ${top} comes first.`,
            `这是减反了，${top} 应该在前面。`,
          ],
          [`${top} - ${a} \\div ${big}`, undefined, `This divides ${a} by ${big}, the wrong way round.`, `这是 ${a} 除以 ${big}，除反了。`],
        ],
      };
    }
    case 3: {
      const s = a * rng.int(3, 12);
      const x = rng.int(1, s - 1);
      return {
        en: `the quotient of the sum of ${s - x} and ${x}, and ${a}`,
        zh: `${s - x} 与 ${x} 的和除以 ${a} 的商`,
        tex: `(${s - x} + ${x}) \\div ${a}`,
        value: s / a,
        first: `${s - x} + ${x} = ${s}`,
        second: `${s} \\div ${a} = ${s / a}`,
        undo: `${s / a} \\times ${a} = ${s}`,
        why: [`The words divide the whole sum by ${a}, so the sum goes in parentheses`, `文字是用整个和除以 ${a}，所以和要放在括号里`],
        wrong: [
          [
            `${s - x} + ${x} \\div ${a}`,
            x % a === 0 ? s - x + x / a : undefined,
            `Without parentheses only ${x} is divided by ${a}.`,
            `没有括号，只有 ${x} 除以了 ${a}。`,
          ],
          [`${a} \\div (${s - x} + ${x})`, undefined, `This divides ${a} by the sum, the wrong way round.`, `这是 ${a} 除以和，除反了。`],
          [`(${s - x} + ${x}) \\times ${a}`, s * a, `This multiplies by ${a}. A quotient means divide.`, `这是乘 ${a}。商表示除法。`],
        ],
      };
    }
    default: {
      const big = b + c + 5;
      return {
        en: `twice the difference of ${big} and ${c}`,
        zh: `${big} 与 ${c} 的差的 2 倍`,
        tex: `2 \\times (${big} - ${c})`,
        value: 2 * (big - c),
        first: `${big} - ${c} = ${big - c}`,
        second: `2 \\times ${big - c} = ${2 * (big - c)}`,
        undo: `${2 * (big - c)} \\div 2 = ${big - c}`,
        why: [
          "Twice means the whole difference is doubled, so the difference goes in parentheses",
          "差的 2 倍是把整个差乘 2，所以差要放在括号里",
        ],
        wrong: [
          [`2 \\times ${big} - ${c}`, 2 * big - c, `Without parentheses only ${big} is doubled.`, `没有括号，只有 ${big} 乘了 2。`],
          [`${big} - 2 \\times ${c}`, big - 2 * c, `This doubles ${c}, not the difference.`, `这是把 ${c} 乘 2，不是把差乘 2。`],
          [`2 + (${big} - ${c})`, 2 + big - c, "This adds 2. Twice means times 2.", "这是加 2。2 倍表示乘 2。"],
        ],
      };
    }
  }
}

/** sharedPart compares an expression built from a sum with the sum itself, without computing either: what it does to the sum, the true statement, and the others with the reason each fails. */
function sharedPart(rng: Rng): {
  a: string;
  b: string;
  did: Pair;
  correct: Pair;
  wrong: [Pair, string, string][];
  small: number;
  smallValue: number;
} {
  const [x, y] = [rng.int(120, 2400), rng.int(30, 900)];
  const k = rng.int(2, 9);
  const base = `${fmt(x)} + ${fmt(y)}`;
  const share = ["half", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"][k - 2]!;
  const statements: Pair[] = [
    [`It is ${k} times as large.`, `它是后者的 ${k} 倍。`],
    [`It is ${k} more.`, `它比后者大 ${k}。`],
    [`It is ${k} less.`, `它比后者小 ${k}。`],
    [`It is one ${share} as large.`, `它是后者的 ${k} 分之一。`],
  ];
  const doesEn = [`multiplies the sum by ${k}`, `adds ${k} to the sum`, `takes ${k} away from the sum`, `divides the sum by ${k}`];
  const doesZh = [`把和乘 ${k}`, `在和上加 ${k}`, `从和中减去 ${k}`, `把和除以 ${k}`];
  const notEn = [`multiply it by ${k}`, `add ${k}`, `take ${k} away`, `divide it by ${k}`];
  const tex = [`${k} \\times (${base})`, `(${base}) + ${k}`, `(${base}) - ${k}`, `(${base}) \\div ${k}`];
  const i = rng.int(0, 3);
  const small = 10 * k;
  return {
    a: tex[i]!,
    b: base,
    did: [`The first expression ${doesEn[i]}.`, `第一个算式${doesZh[i]}。`],
    correct: statements[i]!,
    wrong: statements
      .map(
        (s, j) =>
          [s, `The expression ${doesEn[i]}. It does not ${notEn[j]}.`, `这个算式是${doesZh[i]}，不是${doesZh[j]}。`] as [
            Pair,
            string,
            string,
          ],
      )
      .filter((_, j) => j !== i),
    small,
    smallValue: [small * k, small + k, small - k, small / k][i]!,
  };
}

export const evaluatingWholeNumberExpressions = topic(
  "evaluating-whole-number-expressions",
  t("Evaluating Whole Number Expressions", "整数四则混合运算"),
  t(
    "In an expression with several operations, multiply and divide first, working from left to right, and then add and subtract from left to right: 20 − 12 ÷ 3 × 2 + 5 = 20 − 8 + 5 = 17.",
    "在含有多种运算的算式中，先从左到右算乘除，再从左到右算加减：20 − 12 ÷ 3 × 2 + 5 = 20 − 8 + 5 = 17。",
  ),
  ["evaluating-expressions-containing-multiplication-and-division"],
  ["5.OA.A.1"],
  [
    point(
      "expressions-with-two-operations",
      ["Two operations", "两步运算"],
      [
        "In $40 - 6 \\times 5$, multiply first: $6 \\times 5 = 30$. Then subtract: $40 - 30 = 10$.\n\nCheck: add the product back, $10 + 30 = 40$.\n\n> **Watch out.** Do not work from left to right. $40 - 6 = 34$ and then $34 \\times 5 = 170$ is wrong.",
        "计算 $40 - 6 \\times 5$，先算乘法：$6 \\times 5 = 30$，再算减法：$40 - 30 = 10$。\n\n检验：把积加回去，$10 + 30 = 40$。\n\n> **注意。** 不要从左往右算。先算 $40 - 6 = 34$，再算 $34 \\times 5 = 170$，是错的。",
      ],
      (rng) => chainProblem(rng, 2),
      tapeFigure(
        [
          {
            total: "40",
            pieces: [
              { size: 30, text: "6 × 5 = 30", lit: true },
              { size: 10, text: "10" },
            ],
          },
        ],
        [
          "A bar of 40 split into the product 6 × 5 = 30, shaded, and the 10 left.",
          "长度为 40 的长条分成两段：涂色的积 6 × 5 = 30，和剩下的 10。",
        ],
      ),
    ),
    point(
      "expressions-with-three-or-four-operations",
      ["Three or four operations", "三步或四步运算"],
      [
        "In $36 \\div 4 + 2 \\times 7 - 5$, first find $36 \\div 4 = 9$ and $2 \\times 7 = 14$. Then go from left to right: $9 + 14 - 5 = 18$.\n\nCheck: undo from the end, $18 + 5 - 14 = 9$, which is $36 \\div 4$.\n\n> **Watch out.** Find every product and quotient before any adding. Do not add $4 + 2$ first.",
        "计算 $36 \\div 4 + 2 \\times 7 - 5$，先算 $36 \\div 4 = 9$ 和 $2 \\times 7 = 14$，再从左往右算：$9 + 14 - 5 = 18$。\n\n检验：从最后一步倒着算，$18 + 5 - 14 = 9$，正是 $36 \\div 4$。\n\n> **注意。** 先把所有的积和商都算出来，再做加减。不要先算 $4 + 2$。",
      ],
      (rng) => chainProblem(rng, rng.int(3, 4)),
      tapeFigure(
        [
          {
            total: "23",
            pieces: [
              { size: 9, text: "9" },
              { size: 14, text: "14" },
            ],
          },
          {
            pieces: [
              { size: 18, text: "18", lit: true },
              { size: 5, text: "5", dashed: true },
            ],
          },
        ],
        [
          "One bar made of 9 and 14, which is 23; below it, the same length cut into 18, shaded, and 5 taken away.",
          "上面的长条由 9 和 14 组成，共 23；下面同样长，分成涂色的 18 和去掉的 5。",
        ],
      ),
    ),
  ],
  t(
    "Mia buys 3 packs of 4 stickers and 5 loose stickers. That is $5 + 3 \\times 4$. The packs come first: $3 \\times 4 = 12$. Then $5 + 12 = 17$ stickers.\n\nCheck: count the packs, 4, 8, 12, and go on with the loose ones, 13, 14, 15, 16, 17.\n\nIn this lesson we multiply and divide before we add and subtract.",
    "米娅买了 3 包贴纸，每包 4 张，又买了 5 张散的。列式是 $5 + 3 \\times 4$。先算包里的：$3 \\times 4 = 12$，再算 $5 + 12 = 17$ 张。\n\n检验：先数包里的 4、8、12，再接着数散的 13、14、15、16、17。\n\n本课我们先算乘除，再算加减。",
  ),
);

export const evaluatingWholeNumberExpressionsWithParentheses = topic(
  "evaluating-whole-number-expressions-with-parentheses",
  t("Evaluating Whole Number Expressions With Parentheses", "含括号的整数运算"),
  t(
    "Operations inside parentheses come first: (8 + 4) × 3 = 12 × 3 = 36, while 8 + 4 × 3 = 20. Brackets group parts that contain parentheses; work from the innermost group outward: 2 × [15 − (3 + 4)] = 2 × [15 − 7] = 2 × 8 = 16.",
    "先算括号里面的：(8 + 4) × 3 = 12 × 3 = 36，而 8 + 4 × 3 = 20。中括号里可以再含小括号；从最里层的括号向外算：2 × [15 − (3 + 4)] = 2 × [15 − 7] = 2 × 8 = 16。",
  ),
  ["evaluating-whole-number-expressions"],
  ["5.OA.A.1"],
  [
    point(
      "one-pair-of-parentheses",
      ["One pair of parentheses", "一对小括号"],
      [
        "In $(17 + 8) \\times 4$, the sum is in parentheses, so add first: $17 + 8 = 25$. Then $25 \\times 4 = 100$.\n\nCheck: multiply each part, $17 \\times 4 + 8 \\times 4 = 68 + 32 = 100$.\n\n> **Watch out.** Do not multiply first when the sum is in parentheses. $17 + 8 \\times 4 = 49$ is a different expression.",
        "$(17 + 8) \\times 4$ 中的和在括号里，所以先加：$17 + 8 = 25$，再算 $25 \\times 4 = 100$。\n\n检验：分别乘，$17 \\times 4 + 8 \\times 4 = 68 + 32 = 100$。\n\n> **注意。** 和在括号里时不要先乘。$17 + 8 \\times 4 = 49$ 是另一个算式。",
      ],
      (rng) => bracketedProblem(oneParenthesis(rng)),
      areaGridFigure(["4"], ["17", "8"], [["68", "32"]], [1], [17, 8]),
    ),
    point(
      "brackets-and-parentheses",
      ["Brackets and parentheses", "中括号和小括号"],
      [
        "In $3 \\times [20 - (4 + 9)]$, work from the inside out. First $4 + 9 = 13$. Then $20 - 13 = 7$. Last, $3 \\times 7 = 21$.\n\nCheck: undo from the outside, $21 \\div 3 = 7$ and $7 + 13 = 20$.\n\n> **Watch out.** The brackets take away the whole sum $4 + 9$. Do not subtract 4 and then add 9.",
        "计算 $3 \\times [20 - (4 + 9)]$，要从里往外算：先算 $4 + 9 = 13$，再算 $20 - 13 = 7$，最后 $3 \\times 7 = 21$。\n\n检验：从外往里倒着算，$21 \\div 3 = 7$，$7 + 13 = 20$。\n\n> **注意。** 中括号里减去的是整个和 $4 + 9$。不要减去 4 后又加上 9。",
      ],
      (rng) => bracketedProblem(nestedGroups(rng)),
      tapeFigure(
        [
          {
            total: "20",
            pieces: [
              { size: 13, text: "4 + 9 = 13", dashed: true },
              { size: 7, text: "7", lit: true },
            ],
          },
        ],
        ["A bar of 20 with 4 + 9 = 13 taken away and 7 left, shaded.", "长度为 20 的长条去掉 4 + 9 = 13，剩下涂色的 7。"],
      ),
    ),
  ],
  t(
    "Each bracelet needs 17 red beads and 8 blue beads. Leo makes 4 bracelets. All the beads are $(17 + 8) \\times 4 = 25 \\times 4 = 100$.\n\nCheck: 4 groups of 17 red is 68, 4 groups of 8 blue is 32, and $68 + 32 = 100$.\n\nIn this lesson we work inside parentheses and brackets first.",
    "每条手链要用 17 颗红珠子和 8 颗蓝珠子。利奥做了 4 条。一共用珠子 $(17 + 8) \\times 4 = 25 \\times 4 = 100$ 颗。\n\n检验：红珠子 4 个 17 是 68，蓝珠子 4 个 8 是 32，$68 + 32 = 100$。\n\n本课我们先算小括号和中括号里面的。",
  ),
);

export const creatingAndInterpretingWholeNumberExpressions = topic(
  "creating-and-interpreting-whole-number-expressions",
  t("Creating and Interpreting Whole Number Expressions", "列出并理解整数算式"),
  t(
    '"Add 8 and 7, then multiply by 2" is written (8 + 7) × 2: parentheses make the addition come first. Expressions can be compared without computing them: 3 × (18,932 + 921) is three times as large as 18,932 + 921.',
    '"8 加 7，再乘 2" 写成 (8 + 7) × 2：括号让加法先算。有些算式不用计算也能比较：3 × (18,932 + 921) 是 18,932 + 921 的 3 倍。',
  ),
  ["evaluating-whole-number-expressions-with-parentheses"],
  ["5.OA.A.2"],
  [
    point(
      "writing-expressions-for-calculations",
      ["Writing an expression for a calculation", "为计算过程列式"],
      [
        '"Subtract 5 from 30, then divide by 5" is $(30 - 5) \\div 5$. The subtracting comes first, so it goes in parentheses. The value is $25 \\div 5 = 5$.\n\nCheck: undo the steps, $5 \\times 5 = 25$ and $25 + 5 = 30$.\n\n> **Watch out.** $30 - 5 \\div 5$ divides first. Without parentheses the steps happen in the wrong order.',
        '"从 30 中减去 5，再除以 5" 写成 $(30 - 5) \\div 5$。先做减法，所以减法放在括号里。结果是 $25 \\div 5 = 5$。\n\n检验：倒着算，$5 \\times 5 = 25$，$25 + 5 = 30$。\n\n> **注意。** $30 - 5 \\div 5$ 会先算除法。不加括号，步骤的顺序就错了。',
      ],
      (rng) => {
        const p = stepPhrase(rng);
        return pickedMath(
          rng,
          [`Which expression matches this calculation? ${p.en}`, `哪个算式表示下面的计算过程？${p.zh}`],
          p.tex,
          p.wrong.map(([tex, , en, zh]) => [tex, en, zh] as const),
          [
            [
              ["Find the first step", "找第一步"],
              [`${p.why[0]}.`, `${p.why[1]}。`],
            ],
            [["Write the expression", "列式"], ["So the expression is", "所以算式是"], [p.tex]],
          ],
          [
            `Work it out. The steps $${p.first}$ and then $${p.second}$ follow the words in order.`,
            `算一算：先算 $${p.first}$，再算 $${p.second}$，和文字的顺序一样。`,
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "30",
            pieces: [
              { size: 25, text: "25", lit: true },
              { size: 5, text: "5", dashed: true },
            ],
          },
          { pieces: Array.from({ length: 5 }, () => ({ size: 5, text: "5" })) },
        ],
        [
          "A bar of 30 with 5 taken away leaves 25, shaded; below, 25 is cut into 5 equal parts of 5.",
          "长度为 30 的长条去掉 5，剩下涂色的 25；下面把 25 平均分成 5 份，每份 5。",
        ],
      ),
    ),
    point(
      "interpreting-expressions-without-evaluating",
      ["Interpreting an expression without evaluating it", "不计算，理解算式"],
      [
        "$4 \\times (1{,}250 + 368)$ is 4 groups of $1{,}250 + 368$, which is $1{,}618$. So it is 4 times as large as $1{,}250 + 368$. No working out is needed.\n\nCheck: try a small sum. If the sum were 10, the expression would be $4 \\times 10 = 40$, which is 4 times 10.\n\n> **Watch out.** $4 \\times (\\ldots)$ is not 4 more. Each of the 4 groups is the whole sum.",
        "$4 \\times (1{,}250 + 368)$ 是 4 个 $1{,}250 + 368$，也就是 4 个 $1{,}618$。所以它是 $1{,}250 + 368$ 的 4 倍，不用计算。\n\n检验：用小数试一试。如果和是 10，这个算式就是 $4 \\times 10 = 40$，正是 10 的 4 倍。\n\n> **注意。** $4 \\times (\\ldots)$ 不是多 4。4 份中的每一份都是整个和。",
      ],
      (rng) => {
        const c = sharedPart(rng);
        return picked(
          rng,
          [`How does $${c.a}$ compare with $${c.b}$?`, `$${c.a}$ 与 $${c.b}$ 相比怎样？`],
          c.correct,
          c.wrong,
          [
            [
              ["Find the shared part", "找相同的部分"],
              [`Both expressions use the sum $${c.b}$.`, `两个算式都用到了和 $${c.b}$。`],
            ],
            [["See what is done to it", "看对它做了什么"], c.did],
          ],
          [
            `Try a small sum instead. If the sum were ${c.small}, the first expression would be ${c.smallValue}. ${c.correct[0]}`,
            `用小数试一试：如果和是 ${c.small}，第一个算式就是 ${c.smallValue}。${c.correct[1]}`,
          ],
        );
      },
      equalTape(4, "1,618", "4 × 1,618"),
    ),
  ],
  t(
    "Sam adds 8 and 7, then doubles the result. He writes $(8 + 7) \\times 2 = 30$. The parentheses show that the adding comes first.\n\nCheck: double each number and add, $16 + 14 = 30$.\n\nIn this lesson we write expressions for steps in words and read expressions without working them out.",
    "萨姆先把 8 和 7 相加，再把结果乘 2。他写成 $(8 + 7) \\times 2 = 30$。括号表示先做加法。\n\n检验：把每个数都乘 2 再相加，$16 + 14 = 30$。\n\n本课我们为文字描述的步骤列式，并且不计算也能读懂算式。",
  ),
);

export const creatingWholeNumberExpressionsFromTerminology = topic(
  "creating-whole-number-expressions-from-terminology",
  t("Creating Whole Number Expressions From Terminology", "根据数学术语列式"),
  t(
    'The sum, difference, product and quotient are the results of +, −, × and ÷. "The product of 6 and the sum of 4 and 9" multiplies 6 by a sum, so the sum goes in parentheses: 6 × (4 + 9).',
    '和、差、积、商分别是加、减、乘、除的结果。"6 与 4 和 9 的和的积" 是用 6 去乘一个和，所以这个和要加括号：6 × (4 + 9)。',
  ),
  ["creating-and-interpreting-whole-number-expressions"],
  ["5.OA.A.2"],
  [
    point(
      "choosing-the-expression-for-a-description",
      ["Choosing the expression", "选出算式"],
      [
        '"The product of 3 and the sum of 5 and 8" multiplies 3 by a sum, so it is $3 \\times (5 + 8)$. "The sum of 5 and the product of 3 and 8" adds 5 to a product, so it is $5 + 3 \\times 8$.\n\nCheck: $3 \\times (5 + 8) = 3 \\times 13 = 39$, and $3 \\times 5 + 3 \\times 8 = 15 + 24 = 39$ too.\n\n> **Watch out.** "The product of 3 and the sum" needs parentheses. $3 \\times 5 + 8$ only multiplies the 5.',
        '"3 与 5 和 8 的和的积" 是用 3 乘一个和，所以是 $3 \\times (5 + 8)$。"5 与 3 和 8 的积的和" 是 5 加上一个积，所以是 $5 + 3 \\times 8$。\n\n检验：$3 \\times (5 + 8) = 3 \\times 13 = 39$，$3 \\times 5 + 3 \\times 8 = 15 + 24 = 39$，也一样。\n\n> **注意。** "3 与和的积" 要加括号。$3 \\times 5 + 8$ 只把 5 乘了 3。',
      ],
      (rng) => {
        const p = termPhrase(rng);
        return pickedMath(
          rng,
          [`Which expression is ${p.en}?`, `哪个算式表示"${p.zh}"？`],
          p.tex,
          p.wrong.map(([tex, , en, zh]) => [tex, en, zh] as const),
          [
            [
              ["Find the last step", "找最后一步"],
              [`${p.why[0]}.`, `${p.why[1]}。`],
            ],
            [["Write the expression", "列式"], ["So the expression is", "所以算式是"], [p.tex]],
          ],
          [
            `Work it out. First $${p.first}$, then $${p.second}$, just as the words say.`,
            `算一算：先算 $${p.first}$，再算 $${p.second}$，和文字说的一样。`,
          ],
        );
      },
      areaGridFigure(["3"], ["5", "8"], [["15", "24"]], [1], [5, 8]),
    ),
    point(
      "evaluating-a-description",
      ["Evaluating a description", "按描述计算"],
      [
        '"Twice the difference of 20 and 6" is $2 \\times (20 - 6)$. Find the difference first, $20 - 6 = 14$. Then $2 \\times 14 = 28$.\n\nCheck: halve the answer, $28 \\div 2 = 14$, and $14 + 6 = 20$.\n\n> **Watch out.** Find the difference before doubling. $2 \\times 20 - 6 = 34$ doubles only the 20.',
        '"20 与 6 的差的 2 倍" 是 $2 \\times (20 - 6)$。先求差，$20 - 6 = 14$，再算 $2 \\times 14 = 28$。\n\n检验：把答案除以 2，$28 \\div 2 = 14$，$14 + 6 = 20$。\n\n> **注意。** 先求差，再乘 2。$2 \\times 20 - 6 = 34$ 只把 20 乘了 2。',
      ],
      (rng) => {
        const p = termPhrase(rng);
        const misses: Miss[] = p.wrong.flatMap(([tex, v, en, zh]) =>
          v === undefined ? [] : [[v, `That is $${tex}$. ${en}`, `这是 $${tex}$ 的值。${zh}`] as const],
        );
        return answered(
          [`Find ${p.en}.`, `求 ${p.zh}。`],
          p.value,
          [
            [["Write the expression", "列式"], [`${p.why[0]}:`, `${p.why[1]}：`], [p.tex]],
            [
              ["Work it out", "计算"],
              ["Do the first step, then the second.", "先做第一步，再做第二步。"],
              [p.first, p.second],
            ],
          ],
          [`Undo the last step: $${p.undo}$.`, `把最后一步倒过来算：$${p.undo}$。`],
          misses,
        );
      },
      tapeFigure(
        [
          {
            total: "20",
            pieces: [
              { size: 14, text: "14", lit: true },
              { size: 6, text: "6", dashed: true },
            ],
          },
          {
            total: "28",
            pieces: [
              { size: 14, text: "14", lit: true },
              { size: 14, text: "14", lit: true },
            ],
          },
        ],
        [
          "A bar of 20 with 6 taken away leaves 14; below, two bars of 14 make 28.",
          "长度为 20 的长条去掉 6，剩下 14；下面两个 14 合起来是 28。",
        ],
      ),
    ),
  ],
  t(
    "A riddle says: find the sum of 4 and 9, then the product of 6 and that sum. That is $6 \\times (4 + 9) = 6 \\times 13 = 78$.\n\nCheck: $6 \\times 4 + 6 \\times 9 = 24 + 54 = 78$.\n\nIn this lesson we turn the words sum, difference, product and quotient into expressions.",
    "一个谜语说：先求 4 与 9 的和，再求 6 与这个和的积。列式是 $6 \\times (4 + 9) = 6 \\times 13 = 78$。\n\n检验：$6 \\times 4 + 6 \\times 9 = 24 + 54 = 78$。\n\n本课我们把和、差、积、商这些词写成算式。",
  ),
);

/** bigExpression draws an expression too long to compute in one's head, with its value. */
function bigExpression(rng: Rng): { tex: string; value: number } {
  const [a, b] = [rng.int(120, 980), rng.int(12, 99)];
  return rng.bool() ? { tex: `${fmt(a)} \\times ${b}`, value: a * b } : { tex: `${fmt(a * 10)} + ${fmt(b * 37)}`, value: a * 10 + b * 37 };
}

export const additiveComparisonsOfWholeNumberExpressions = topic(
  "additive-comparisons-of-whole-number-expressions",
  t("Additive Comparisons of Whole Number Expressions", "整数算式的相差比较"),
  t(
    "Adding k to an expression makes it k greater; subtracting k makes it k less. So 348 × 27 + 15 is 15 greater than 348 × 27, which can be seen without computing either.",
    "一个算式加上 k，结果就大 k；减去 k，结果就小 k。所以 348 × 27 + 15 比 348 × 27 大 15，不用计算就能看出来。",
  ),
  ["creating-and-interpreting-whole-number-expressions"],
  ["5.OA.A.2"],
  [
    point(
      "how-much-greater",
      ["How much greater", "大多少"],
      [
        "$(512 \\times 46) + 30$ is $512 \\times 46$ with 30 more. So it is 30 greater than $512 \\times 46$, whatever that product is.\n\nCheck: if the shared part were 1,000, the two would be 1,030 and 1,000. They differ by 30.\n\n> **Watch out.** You do not need to work out $512 \\times 46$. The shared part is the same on both sides.",
        "$(512 \\times 46) + 30$ 是在 $512 \\times 46$ 上再加 30，所以无论这个积是多少，它都比 $512 \\times 46$ 大 30。\n\n检验：如果相同的部分是 1,000，两个数就是 1,030 和 1,000，相差 30。\n\n> **注意。** 不必算出 $512 \\times 46$。两边相同的部分一样大。",
      ],
      (rng) => {
        const e = bigExpression(rng);
        const k = rng.int(5, 199);
        const up = rng.bool();
        const [A, B] = up ? [`(${e.tex}) + ${k}`, e.tex] : [e.tex, `(${e.tex}) - ${k}`];
        const [hiA, loB] = up ? [1000 + k, 1000] : [1000, 1000 - k];
        return answered(
          [`How much greater is $${A}$ than $${B}$?`, `$${A}$ 比 $${B}$ 大多少？`],
          k,
          [
            [
              ["Find the shared part", "找相同的部分"],
              [`Both expressions are built from $${e.tex}$.`, `两个算式都由 $${e.tex}$ 组成。`],
            ],
            [
              ["See what is different", "看不同的部分"],
              [
                up
                  ? `The first one adds ${k} to it, so it is ${k} greater.`
                  : `The second one takes ${k} from it, so the first is ${k} greater.`,
                up ? `第一个在它上面加了 ${k}，所以大 ${k}。` : `第二个从它里面减去了 ${k}，所以第一个大 ${k}。`,
              ],
            ],
          ],
          [
            `Try a small shared part. If it were 1,000, the two would be ${grouped(hiA)} and ${grouped(loB)}, which differ by ${k}.`,
            `用小数试一试：如果相同的部分是 1,000，两个数就是 ${grouped(hiA)} 和 ${grouped(loB)}，相差 ${k}。`,
          ],
          [
            [
              up ? e.value + k : e.value,
              "That is the value of the larger expression, not how much greater it is.",
              "这是较大算式的值，不是大多少。",
            ],
            [2 * k, `That counts the ${k} twice. It is added or taken away only once.`, `这是把 ${k} 算了两次。它只加或减了一次。`],
          ],
        );
      },
      tapeFigure(
        [
          {
            pieces: [
              { size: 5, text: "512 × 46" },
              { size: 1, text: "30", lit: true },
            ],
          },
          { pieces: [{ size: 5, text: "512 × 46" }] },
        ],
        [
          "Two bars with the same part 512 × 46; the top bar has an extra 30, shaded.",
          "两个长条有相同的部分 512 × 46，上面的长条多出涂色的 30。",
        ],
      ),
    ),
    point(
      "comparing-sums-of-the-same-parts",
      ["Sums with a common part", "含有相同部分的和"],
      [
        "$A = 1{,}362 + 485 + 70$ and $B = 1{,}362 + 485$ both contain $1{,}362 + 485$. Only $A$ has the extra 70, so $A$ is 70 greater than $B$.\n\nCheck: if the shared part were 1,000, $A$ would be 1,070 and $B$ would be 1,000.\n\n> **Watch out.** Cross out the shared part before you compare. Adding up both sums is slow and easy to get wrong.",
        "$A = 1{,}362 + 485 + 70$ 和 $B = 1{,}362 + 485$ 都含有 $1{,}362 + 485$，只有 $A$ 多了 70，所以 $A$ 比 $B$ 大 70。\n\n检验：如果相同的部分是 1,000，$A$ 就是 1,070，$B$ 就是 1,000。\n\n> **注意。** 先划掉相同的部分再比较。把两个和都算出来既慢又容易错。",
      ],
      (rng) => {
        const [x, y, k] = [rng.int(1000, 9000), rng.int(100, 900), rng.int(5, 95)];
        const bigger = rng.bool();
        const A = bigger ? `${fmt(x)} + ${y} + ${k}` : `${fmt(x)} + ${y} - ${k}`;
        const B = `${fmt(x)} + ${y}`;
        const greater: Pair = [`$A$ is ${k} greater than $B$.`, `$A$ 比 $B$ 大 ${k}。`];
        const less: Pair = [`$A$ is ${k} less than $B$.`, `$A$ 比 $B$ 小 ${k}。`];
        const doEn = bigger ? "adds" : "subtracts";
        const doZh = bigger ? "加上" : "减去";
        return picked(
          rng,
          [`$A = ${A}$ and $B = ${B}$. Which statement is true?`, `$A = ${A}$，$B = ${B}$。下面哪种说法正确？`],
          bigger ? greater : less,
          [
            [bigger ? less : greater, `$A$ ${doEn} ${k}, so it goes the other way.`, `$A$ 是${doZh} ${k}，方向正好相反。`],
            [
              [`$A$ is ${k} times as large as $B$.`, `$A$ 是 $B$ 的 ${k} 倍。`],
              `$A$ only ${doEn} ${k}. Nothing is multiplied.`,
              `$A$ 只是${doZh} ${k}，没有乘法。`,
            ],
            [
              ["$A$ and $B$ are equal.", "$A$ 与 $B$ 相等。"],
              `$A$ has the parts of $B$ and also ${doEn} ${k}, so they are not equal.`,
              `$A$ 含有 $B$ 的部分，还${doZh}了 ${k}，所以不相等。`,
            ],
          ],
          [
            [
              ["Cross out the shared part", "划掉相同的部分"],
              [`Both sums contain $${B}$.`, `两个式子都含有 $${B}$。`],
            ],
            [
              ["Look at what is left", "看剩下的部分"],
              [
                `Only $A$ ${doEn} ${k}, so $A$ is ${k} ${bigger ? "greater" : "less"}.`,
                `只有 $A$ ${doZh}了 ${k}，所以 $A$ ${bigger ? "大" : "小"} ${k}。`,
              ],
            ],
          ],
          [
            `Try a small shared part. If it were 1,000, $A$ would be ${grouped(bigger ? 1000 + k : 1000 - k)} and $B$ would be 1,000.`,
            `用小数试一试：如果相同的部分是 1,000，$A$ 就是 ${grouped(bigger ? 1000 + k : 1000 - k)}，$B$ 就是 1,000。`,
          ],
        );
      },
      tapeFigure(
        [
          {
            pieces: [
              { size: 5, text: "1,362 + 485" },
              { size: 1, text: "70", lit: true },
            ],
          },
          { pieces: [{ size: 5, text: "1,362 + 485" }] },
        ],
        [
          "Bar A is 1,362 + 485 and an extra 70, shaded; bar B is 1,362 + 485.",
          "长条 A 是 1,362 + 485 再加涂色的 70；长条 B 是 1,362 + 485。",
        ],
      ),
    ),
  ],
  t(
    "A farm packs $348 \\times 27$ eggs on Monday. On Tuesday it packs the same and 15 more, which is $348 \\times 27 + 15$. Tuesday is 15 eggs more, and we never multiply.\n\nCheck: take the 15 extra eggs away and the two days are the same.\n\nIn this lesson we compare expressions by finding the part they share.",
    "一个农场星期一装了 $348 \\times 27$ 个鸡蛋。星期二装的一样多，还多装了 15 个，就是 $348 \\times 27 + 15$。星期二多 15 个，根本不用算乘法。\n\n检验：去掉多装的 15 个，两天就一样多了。\n\n本课我们找出两个算式相同的部分，再比较它们。",
  ),
);

export const multiplicativeComparisonsOfWholeNumberExpressions = topic(
  "multiplicative-comparisons-of-whole-number-expressions",
  t("Multiplicative Comparisons of Whole Number Expressions", "整数算式的倍数比较"),
  t(
    "Multiplying an expression by k makes it k times as large. So 6 × (148 + 239) is 6 times as large as 148 + 239, and it is 3 times as large as 2 × (148 + 239).",
    "一个算式乘 k，结果就是原来的 k 倍。所以 6 × (148 + 239) 是 148 + 239 的 6 倍，是 2 × (148 + 239) 的 3 倍。",
  ),
  ["creating-and-interpreting-whole-number-expressions"],
  ["5.OA.A.2"],
  [
    point(
      "how-many-times-as-large",
      ["How many times as large", "是几倍"],
      [
        "$8 \\times (325 + 49)$ is 8 groups of $325 + 49$. $2 \\times (325 + 49)$ is 2 groups. Since $8 \\div 2 = 4$, the first is 4 times as large.\n\nCheck: 4 times 2 groups is $4 \\times 2 = 8$ groups.\n\n> **Watch out.** It is not 8 times as large. The second expression has 2 groups, not 1.",
        "$8 \\times (325 + 49)$ 是 8 个 $325 + 49$，$2 \\times (325 + 49)$ 是 2 个。因为 $8 \\div 2 = 4$，前者是后者的 4 倍。\n\n检验：2 个的 4 倍是 $4 \\times 2 = 8$ 个。\n\n> **注意。** 不是 8 倍。第二个算式有 2 个，不是 1 个。",
      ],
      (rng) => {
        const [x, y] = [rng.int(100, 999), rng.int(10, 99)];
        const base = `${x} + ${y}`;
        const m = rng.int(1, 4);
        const k = rng.int(2, 9);
        const A = `${k * m} \\times (${base})`;
        const B = m === 1 ? base : `${m} \\times (${base})`;
        return answered(
          [`How many times as large as $${B}$ is $${A}$?`, `$${A}$ 是 $${B}$ 的几倍？`],
          k,
          [
            [
              ["Count the groups", "数一数有几个"],
              [`The first has ${k * m} groups of $${base}$ and the second has ${m}.`, `第一个有 ${k * m} 个 $${base}$，第二个有 ${m} 个。`],
            ],
            [["Divide the counts", "用除法"], ["Compare the numbers of groups.", "比较两个的个数。"], [`${k * m} \\div ${m} = ${k}`]],
          ],
          [
            `Multiply back: $${k} \\times ${m} = ${k * m}$, the groups in the first.`,
            `乘回去：$${k} \\times ${m} = ${k * m}$，正是第一个的个数。`,
          ],
          [
            [k * m, `That compares with one group, but the second has ${m} groups.`, `这是和 1 个比，可是第二个有 ${m} 个。`],
            [k * m - m, "That subtracts the counts. Times as large means divide.", "这是用减法。求几倍要用除法。"],
            [m, "That is the number of groups in the second expression.", "这是第二个算式的个数。"],
          ],
          {
            figure: tapeFigure(
              [
                { pieces: Array.from({ length: k * m }, (_, i) => ({ size: 1, text: "", lit: i < m })) },
                { pieces: Array.from({ length: m }, () => ({ size: 1, text: "", lit: true })) },
              ],
              [
                `A bar of ${k * m} equal groups above a bar of ${m} of the same groups.`,
                `上面的长条有 ${k * m} 个相同的部分，下面的长条有 ${m} 个同样的部分。`,
              ],
            ),
          },
        );
      },
      tapeFigure(
        [
          { pieces: Array.from({ length: 8 }, (_, i) => ({ size: 1, text: "374", lit: i < 2 })) },
          { pieces: Array.from({ length: 2 }, () => ({ size: 1, text: "374", lit: true })) },
        ],
        ["Eight equal parts of 374 above two equal parts of 374.", "上面是 8 个 374，下面是 2 个 374。"],
      ),
    ),
    point(
      "choosing-the-comparison",
      ["Choosing the comparison", "选择正确的比较"],
      [
        "$A = 12 \\times (40 + 7)$ and $B = 4 \\times (40 + 7)$. $A$ has 12 groups and $B$ has 4, so $A$ is $12 \\div 4 = 3$ times as large.\n\nCheck: 3 copies of $B$ have $3 \\times 4 = 12$ groups, the same as $A$.\n\n> **Watch out.** $A$ is not 8 more. Each group is 47, not 1.",
        "$A = 12 \\times (40 + 7)$，$B = 4 \\times (40 + 7)$。$A$ 有 12 个，$B$ 有 4 个，所以 $A$ 是 $B$ 的 $12 \\div 4 = 3$ 倍。\n\n检验：3 个 $B$ 一共有 $3 \\times 4 = 12$ 个，和 $A$ 一样。\n\n> **注意。** $A$ 不是比 $B$ 多 8。每一个是 47，不是 1。",
      ],
      (rng) => {
        const [x, y] = [rng.int(50, 900), rng.int(10, 99)];
        const k = rng.int(2, 6);
        const m = rng.int(2, 5);
        const A = `${k * m} \\times (${x} + ${y})`;
        const B = `${m} \\times (${x} + ${y})`;
        return picked(
          rng,
          [`$A = ${A}$ and $B = ${B}$. Which statement is true?`, `$A = ${A}$，$B = ${B}$。下面哪种说法正确？`],
          [`$A$ is ${k} times as large as $B$.`, `$A$ 是 $B$ 的 ${k} 倍。`],
          [
            [
              [`$A$ is ${k * m - m} more than $B$.`, `$A$ 比 $B$ 多 ${k * m - m}。`],
              `That counts each group as 1. Each group is $${x} + ${y}$.`,
              `这是把每一个都当作 1。每一个是 $${x} + ${y}$。`,
            ],
            [
              [`$A$ is ${k * m} times as large as $B$.`, `$A$ 是 $B$ 的 ${k * m} 倍。`],
              `That compares $A$ with one group, but $B$ has ${m} groups.`,
              `这是拿 $A$ 和 1 个比，可是 $B$ 有 ${m} 个。`,
            ],
            [
              [`$B$ is ${k} times as large as $A$.`, `$B$ 是 $A$ 的 ${k} 倍。`],
              "That is the wrong way round. $A$ has more groups.",
              "这说反了，$A$ 的个数更多。",
            ],
          ],
          [
            [
              ["Count the groups", "数一数有几个"],
              [`$A$ has ${k * m} groups of $${x} + ${y}$ and $B$ has ${m}.`, `$A$ 有 ${k * m} 个 $${x} + ${y}$，$B$ 有 ${m} 个。`],
            ],
            [["Divide the counts", "用除法"], ["Compare the numbers of groups.", "比较两个的个数。"], [`${k * m} \\div ${m} = ${k}`]],
          ],
          [
            `${k} copies of $B$ have $${k} \\times ${m} = ${k * m}$ groups, just like $A$.`,
            `${k} 个 $B$ 一共有 $${k} \\times ${m} = ${k * m}$ 个，和 $A$ 一样。`,
          ],
        );
      },
      tapeFigure(
        [
          { pieces: Array.from({ length: 12 }, (_, i) => ({ size: 1, text: "47", lit: i < 4 })) },
          { pieces: Array.from({ length: 4 }, () => ({ size: 1, text: "47", lit: true })) },
        ],
        ["Twelve equal parts of 47 above four equal parts of 47.", "上面是 12 个 47，下面是 4 个 47。"],
      ),
    ),
  ],
  t(
    "A box holds $148 + 239$ crayons. Ella has 6 boxes and Max has 2. Ella has $6 \\times (148 + 239)$ crayons. That is 3 times what Max has, since $6 = 3 \\times 2$.\n\nCheck: 3 sets of Max's 2 boxes make 6 boxes.\n\nIn this lesson we find how many times as large one expression is as another.",
    "一盒有 $148 + 239$ 支蜡笔。埃拉有 6 盒，马克斯有 2 盒。埃拉有 $6 \\times (148 + 239)$ 支，是马克斯的 3 倍，因为 $6 = 3 \\times 2$。\n\n检验：3 份马克斯的 2 盒，正好是 6 盒。\n\n本课我们求一个算式是另一个算式的几倍。",
  ),
);

// ---------------------------------------------------------------------------
// Negative numbers

/** integerLine draws a number line from `from` to `to` with every integer ticked, numbers at multiples of `every`, and a labeled point. */
function integerLine(from: number, to: number, every: number, point: number, label: string): Figure {
  const x = (k: number) => Math.round((20 + ((k - from) / (to - from)) * 280) * 100) / 100;
  const y = 40;
  let body = `<line x1="${x(from)}" y1="${y}" x2="${x(to)}" y2="${y}"/>`;
  for (let k = from; k <= to; k++) {
    const big = k % every === 0;
    body += `<line x1="${x(k)}" y1="${y - (big ? 7 : 4)}" x2="${x(k)}" y2="${y + (big ? 7 : 4)}"/>`;
    if (big) body += `<text x="${x(k)}" y="${y + 22}" stroke="none" fill="currentColor">${plain(k)}</text>`;
  }
  body += `<circle class="accent" cx="${x(point)}" cy="${y}" r="4.5" fill="currentColor" stroke="none"/>`;
  body += `<text class="accent" x="${x(point)}" y="${y - 12}" stroke="none" fill="currentColor" font-style="italic">${label}</text>`;
  return {
    svg: svgDocument(70, body),
    alt: t(
      `A number line from ${plain(from)} to ${plain(to)} with a tick at every whole number and numbers every ${every}; point ${label} is on a tick.`,
      `一条从 ${plain(from)} 到 ${plain(to)} 的数轴，每个整数处有刻度，每隔 ${every} 标一个数；点 ${label} 在刻度上。`,
    ),
  };
}

/** Situation is a quantity described in words that a signed number records. */
interface Situation {
  readonly en: (n: number) => string;
  readonly zh: (n: number) => string;
  readonly negative: boolean;
  readonly zero: Pair;
}

const situations: readonly Situation[] = [
  {
    en: (n) => `The temperature is ${n} degrees below zero.`,
    zh: (n) => `气温是零下 ${n} 度。`,
    negative: true,
    zero: ["zero degrees", "零度"],
  },
  {
    en: (n) => `A diver is ${n} meters below sea level.`,
    zh: (n) => `潜水员在海平面以下 ${n} 米。`,
    negative: true,
    zero: ["sea level", "海平面"],
  },
  {
    en: (n) => `A bank account is overdrawn by ${n} dollars.`,
    zh: (n) => `银行账户透支了 ${n} 元。`,
    negative: true,
    zero: ["an empty account", "账户里一分钱也没有"],
  },
  {
    en: (n) => `A team lost ${n} yards on a play.`,
    zh: (n) => `一支球队在一次进攻中后退了 ${n} 码。`,
    negative: true,
    zero: ["where the play started", "这次进攻开始的位置"],
  },
  {
    en: (n) => `A kite flies ${n} meters above the ground.`,
    zh: (n) => `风筝飞在离地面 ${n} 米高的地方。`,
    negative: false,
    zero: ["the ground", "地面"],
  },
  {
    en: (n) => `The temperature is ${n} degrees above zero.`,
    zh: (n) => `气温是零上 ${n} 度。`,
    negative: false,
    zero: ["zero degrees", "零度"],
  },
  {
    en: (n) => `A store earned a profit of ${n} dollars.`,
    zh: (n) => `一家商店盈利 ${n} 元。`,
    negative: false,
    zero: ["breaking even", "不赚不亏"],
  },
];

/** minus writes a whole number for a drawing, with a true minus sign when it is negative. */
const minus = (v: number): string => (v < 0 ? `−${grouped(-v)}` : grouped(v));

/** signedLine draws a number line around 0 with the given numbers marked; `lit` is drawn as the answer. */
function signedLine(values: readonly number[], lit?: number): Figure {
  const lo0 = Math.min(...values, 0);
  const hi0 = Math.max(...values, 0);
  const step = hi0 - lo0 > 24 ? 5 : 1;
  const lo = Math.floor((lo0 - 1) / step) * step;
  const hi = Math.ceil((hi0 + 1) / step) * step;
  return lineFigure(
    {
      lo,
      hi,
      step,
      labels: [...new Set([lo, 0, hi])],
      label: minus,
      marks: values.map((v) => ({ at: v, text: minus(v), result: v === lit })),
    },
    [
      `A number line from ${minus(lo)} to ${minus(hi)} with 0 marked and points at ${values.map(minus).join(", ")}.`,
      `一条从 ${minus(lo)} 到 ${minus(hi)} 的数轴，标出 0，并在 ${values.map(minus).join("、")} 处画点。`,
    ],
  );
}

/** signed asks for a whole number that may be negative, works it in labelled steps with a check, and answers each distinct wrong value with its reason. */
function signed(
  prompt: Pair,
  answer: number,
  walk: readonly Walk[],
  check: Pair,
  misses: readonly (readonly [number, string, string])[],
  figure?: Figure,
): Problem {
  const kept = misses.filter(([v], i) => v !== answer && misses.findIndex(([w]) => w === v) === i);
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    mistakes: kept.map(([value, en, zh]) => ({ value, why: t(en, zh) })),
    solution: walkThrough(walk, check),
  });
  return figure ? { ...problem, figure } : problem;
}

/** placeNames are the names of the places of a whole number, from the ones. */
const placeNames: readonly Pair[] = [
  ["ones", "个位"],
  ["tens", "十位"],
  ["hundreds", "百位"],
  ["thousands", "千位"],
  ["ten thousands", "万位"],
  ["hundred thousands", "十万位"],
];

/** carrySteps tells the standard algorithm for n × a place by place from the ones, with each digit written and each carry. */
function carrySteps(n: number, a: number): Pair {
  const digits = String(n).split("").reverse().map(Number);
  let carry = 0;
  const en: string[] = [];
  const zh: string[] = [];
  digits.forEach((d, i) => {
    const v = a * d + carry;
    const last = i === digits.length - 1;
    const tex = `$${a} \\times ${d}${carry ? ` + ${carry}` : ""} = ${v}$`;
    const [pe, pz] = placeNames[i]!;
    const head = pe.charAt(0).toUpperCase() + pe.slice(1);
    const up = Math.floor(v / 10);
    en.push(last ? `${head}: ${tex}, so write ${v}.` : `${head}: ${tex}, so write ${v % 10}${up ? ` and carry ${up}` : ""}.`);
    zh.push(last ? `${pz}：${tex}，写 ${v}。` : `${pz}：${tex}，写 ${v % 10}${up ? `，进 ${up}` : ""}。`);
    carry = up;
  });
  return [en.join(" "), zh.join("")];
}

/** placeParts splits a whole number into its nonzero place values: 406 → [400, 6]. */
const placeParts = (n: number): number[] =>
  String(n)
    .split("")
    .map((d, i, s) => Number(d) * 10 ** (s.length - 1 - i))
    .filter((v) => v > 0);

/** byPlaces multiplies each place value of n by m and adds, in LaTeX: 58 × 7 → 50 × 7 + 8 × 7 = 350 + 56 = 406. */
const byPlaces = (n: number, m: number): string => {
  const parts = placeParts(n);
  return `${parts.map((p) => `${fmt(p)} \\times ${fmt(m)}`).join(" + ")} = ${parts.map((p) => fmt(p * m)).join(" + ")} = ${fmt(n * m)}`;
};

/** sideBySide writes the product of each digit whole, side by side, the slip of never carrying: 58 × 7 → 3556. */
const sideBySide = (n: number, a: number): number =>
  Number(
    String(n)
      .split("")
      .map((d) => String(a * Number(d)))
      .join(""),
  );

/** productByOneDigit asks for n × a and works it with the standard algorithm; a story adds a step that finds the equal groups. */
function productByOneDigit(n: number, a: number, story?: Story): Problem {
  const walk: Walk[] = [];
  if (story)
    walk.push([
      ["Find the equal groups", "找相同的组"],
      [`There are ${a} groups of ${grouped(n)}, so multiply.`, `有 ${a} 组，每组 ${grouped(n)}，所以用乘法。`],
      [`${fmt(n)} \\times ${a}`],
    ]);
  walk.push([["Multiply place by place", "逐位相乘"], carrySteps(n, a)]);
  walk.push([
    ["Read the product", "读出积"],
    ["The digits written, read from left to right, give the product.", "把写下的数字从左往右读，就是积。"],
    [`${fmt(n)} \\times ${a} = ${fmt(n * a)}`],
  ]);
  const misses: Miss[] = [
    [noCarry(n, a), "That forgets to add the carried digits.", "这是忘了加进位。"],
    [sideBySide(n, a), "That writes each whole product side by side instead of carrying.", "这是把每一位的积整个并排写下，没有进位。"],
  ];
  if (story) misses.push([n + a, "That adds. Equal groups mean multiply.", "这是相加了。几个相同的组要用乘法。"]);
  return answered(
    story ? [story.en(n, a), story.zh(n, a)] : [`Find $${fmt(n)} \\times ${a}$.`, `计算 $${fmt(n)} \\times ${a}$。`],
    n * a,
    walk,
    [`Multiply each place value and add: $${byPlaces(n, a)}$.`, `按数位分别乘再相加：$${byPlaces(n, a)}$。`],
    misses,
    story ? { figure: equalTape(a, grouped(n), "?") } : {},
  );
}

/** oneDigitProduct asks for n × a with the standard algorithm, n having `digits` digits. */
const oneDigitProduct = (rng: Rng, digits: number): Problem => productByOneDigit(randomWithDigits(rng, digits), rng.int(3, 9));

/** multiDigitProduct asks for n × m with a partial product for each digit of m, and checks by splitting n instead. */
function multiDigitProduct(n: number, m: number): Problem {
  const parts = placeParts(m);
  const ones = m % 10;
  return answered(
    [`Find $${fmt(n)} \\times ${fmt(m)}$.`, `计算 $${fmt(n)} \\times ${fmt(m)}$。`],
    n * m,
    [
      [
        ["Split the second factor", "拆开第二个因数"],
        [
          `Split ${grouped(m)} by place value: ${parts.map(grouped).join(" + ")}.`,
          `把 ${grouped(m)} 按数位拆开：${parts.map(grouped).join(" + ")}。`,
        ],
      ],
      [
        ["Find the partial products", "求部分积"],
        ["Multiply the first factor by each part.", "用第一个因数分别乘每一部分。"],
        parts.map((p) => `${fmt(n)} \\times ${fmt(p)} = ${fmt(n * p)}`),
      ],
      [["Add", "相加"], ["Add the partial products.", "把部分积相加。"], [`${parts.map((p) => fmt(n * p)).join(" + ")} = ${fmt(n * m)}`]],
    ],
    [`Split the first factor instead: $${byPlaces(n, m)}$.`, `也可以拆开第一个因数：$${byPlaces(n, m)}$。`],
    [
      [
        forgetPlaces(n, m),
        "That forgets the zeros of the partial products for the tens and hundreds.",
        "这是忘了十位、百位部分积末尾的 0。",
      ],
      [
        n * (m - ones),
        "That is only the partial product for the tens and above. Add the one for the ones digit too.",
        "这只是十位以上的部分积，还要加上个位的部分积。",
      ],
      [n * ones, "That is only the partial product for the ones digit.", "这只是个位的部分积。"],
    ],
    { figure: areaGridFigure([grouped(n)], parts.map(grouped), [parts.map((p) => grouped(n * p))]) },
  );
}

export const negativeNumbers = topic(
  "negative-numbers",
  t("Negative Numbers", "负数"),
  t(
    "Numbers less than zero are negative and are written with a minus sign: −3 is 3 steps to the left of 0 on the number line. Negative numbers describe quantities below a starting level, such as 5 degrees below zero (−5 °C) or 20 meters below sea level (−20 m).",
    "小于零的数是负数，前面写负号：−3 在数轴上 0 的左边 3 格处。负数可以表示低于某个起点的量，例如零下 5 度（−5 °C）、海平面以下 20 米（−20 米）。",
  ),
  ["comparing-whole-numbers"],
  ["6.NS.C.5", "6.NS.C.6"],
  [
    point(
      "reading-negative-numbers-on-number-lines",
      ["Reading negative numbers on a number line", "在数轴上读负数"],
      [
        "Numbers to the left of 0 are negative. On a line marked in ones, the point 4 marks to the left of 0 is $-4$.\n\nCheck: count back from 0: $-1$, $-2$, $-3$, $-4$. That is 4 steps.\n\n> **Watch out.** The point is left of 0, so it is $-4$, not $4$. The number $4$ is 4 marks to the right.",
        "0 左边的数是负数。在每格表示 1 的数轴上，0 左边 4 格的点表示 $-4$。\n\n检验：从 0 往回数：$-1$、$-2$、$-3$、$-4$，正好 4 步。\n\n> **注意。** 这个点在 0 的左边，是 $-4$ 而不是 $4$。$4$ 在 0 右边 4 格。",
      ],
      (rng) => {
        const every = rng.pick([2, 5]);
        const from = -every * rng.int(2, 4);
        const to = from + every * (every === 2 ? 6 : 4);
        let p: number;
        do p = rng.int(from + 1, Math.min(to - 1, -1));
        while (p % every === 0);
        const near = Math.round(p / every) * every + 0;
        const gap = p - near;
        return signed(
          ["What number is at point $P$?", "点 $P$ 表示什么数？"],
          p,
          [
            [
              ["Find the size of a tick", "看每格表示多少"],
              [`Each tick is 1, and a number is written every ${every} ticks.`, `每格表示 1，每隔 ${every} 格写一个数。`],
            ],
            [
              ["Count from 0", "从 0 数起"],
              [
                `Point $P$ is ${-p} ticks to the left of 0. Left of 0 is negative, so $P$ is at $${p}$.`,
                `点 $P$ 在 0 左边 ${-p} 格。0 左边是负数，所以 $P$ 表示 $${p}$。`,
              ],
            ],
          ],
          [
            `Start at the written number $${near}$ and count ${Math.abs(gap)} tick${Math.abs(gap) === 1 ? "" : "s"} ${gap > 0 ? "right" : "left"}. You land on $${p}$.`,
            `从标着的数 $${near}$ 开始，向${gap > 0 ? "右" : "左"}数 ${Math.abs(gap)} 格，正好到 $${p}$。`,
          ],
          [
            [-p, "That is the same distance to the right of 0. Left of 0 is negative.", "这是 0 右边同样远的数。0 左边是负数。"],
            [p - 1, "That counts one tick too many.", "这是多数了一格。"],
            [p + 1, "That counts one tick too few.", "这是少数了一格。"],
          ],
          integerLine(from, to, every, p, "P"),
        );
      },
      signedLine([-4]),
    ),
    point(
      "negative-numbers-in-context",
      ["Negative numbers in context", "生活中的负数"],
      [
        "Sea level is 0. A diver 12 meters below sea level is at $-12$ meters. A bird 12 meters above sea level is at $12$ meters.\n\nCheck: the diver must rise 12 meters to get back to sea level, so the diver is 12 below 0.\n\n> **Watch out.** Below the starting level is negative. Do not drop the minus sign.",
        "海平面是 0。潜水员在海平面以下 12 米，记作 $-12$ 米；鸟在海平面以上 12 米，记作 $12$ 米。\n\n检验：潜水员要上升 12 米才能回到海平面，所以在 0 以下 12 米。\n\n> **注意。** 低于起点的量是负数，不要漏掉负号。",
      ],
      (rng) => {
        const s = rng.pick(situations);
        const n = rng.int(2, 60);
        const v = s.negative ? -n : n;
        return signed(
          [`${s.en(n)} Write this amount as a positive or negative number.`, `${s.zh(n)}用正数或负数表示这个量。`],
          v,
          [
            [
              ["Find zero", "找到 0"],
              [`The starting level, 0, is ${s.zero[0]}.`, `起点 0 是${s.zero[1]}。`],
            ],
            [
              ["Choose the sign", "定正负"],
              s.negative
                ? [`The amount is ${n} below that, so it is negative: $${v}$.`, `这个量比它低 ${n}，所以是负数：$${v}$。`]
                : [`The amount is ${n} above that, so it is positive: $${v}$.`, `这个量比它高 ${n}，所以是正数：$${v}$。`],
            ],
          ],
          [
            `From $${v}$, going ${n} ${s.negative ? "up" : "down"} brings you back to the starting level, 0.`,
            `从 $${v}$ ${s.negative ? "往上" : "往下"}走 ${n}，正好回到起点 0。`,
          ],
          [
            [
              -v,
              s.negative
                ? "That is above the starting level. This amount is below it."
                : "That is below the starting level. This amount is above it.",
              s.negative ? "这是高于起点的量，可这个量低于起点。" : "这是低于起点的量，可这个量高于起点。",
            ],
          ],
          signedLine([v], v),
        );
      },
      signedLine([-12, 12], -12),
    ),
  ],
  t(
    "In the morning it is 3 degrees below zero. The thermometer shows $-3$, three marks below 0.\n\nCheck: warm up 3 degrees from there and you reach 0.\n\nIn this lesson we read negative numbers on a number line and use them for amounts below zero.",
    "早上气温是零下 3 度，温度计上显示 $-3$，在 0 下面 3 格。\n\n检验：从那里升高 3 度，正好到 0。\n\n本课我们在数轴上读负数，并用负数表示低于 0 的量。",
  ),
);

export const comparingNegativeNumbers = topic(
  "comparing-negative-numbers",
  t("Comparing Negative Numbers", "比较负数的大小"),
  t(
    "On a number line, numbers increase from left to right. Every negative number is less than 0 and every positive number. Of two negative numbers, the one farther from 0 is less: −8 < −3, since −8 lies to the left of −3.",
    "在数轴上，从左到右的数越来越大。负数都小于 0，也小于所有正数。两个负数比较，离 0 越远的越小：−8 < −3，因为 −8 在 −3 的左边。",
  ),
  ["negative-numbers"],
  ["6.NS.C.7"],
  [
    point(
      "comparing-two-signed-numbers",
      ["Comparing two numbers", "比较两个数"],
      [
        "Compare $-15$ and $-9$. On a number line $-15$ is farther left, so $-15 < -9$. Also $-2 < 1$, since every negative number is less than every positive number.\n\nCheck: $-15$ is 15 below zero and $-9$ is only 9 below zero, so $-15$ is lower.\n\n> **Watch out.** $15 > 9$, but $-15 < -9$. Below zero, the bigger digits mean farther down.",
        "比较 $-15$ 和 $-9$。在数轴上 $-15$ 更靠左，所以 $-15 < -9$。又如 $-2 < 1$，因为负数都小于正数。\n\n检验：$-15$ 在 0 以下 15，$-9$ 只在 0 以下 9，所以 $-15$ 更低。\n\n> **注意。** $15 > 9$，但 $-15 < -9$。在 0 以下，负号后面的数越大，位置越低。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        do {
          a = -rng.int(1, 40);
          b = rng.bool() ? -rng.int(1, 40) : rng.int(0, 40);
        } while (a === b);
        if (rng.bool()) [a, b] = [b, a];
        const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
        const rel = a < b ? "<" : ">";
        const flip = a < b ? ">" : "<";
        return picked(
          rng,
          [`Which is true?`, "哪个是对的？"],
          [`$${a} ${rel} ${b}$`, `$${a} ${rel} ${b}$`],
          [
            [
              [`$${a} ${flip} ${b}$`, `$${a} ${flip} ${b}$`],
              `On a number line $${lo}$ is to the left of $${hi}$, so it is the smaller one.`,
              `在数轴上 $${lo}$ 在 $${hi}$ 的左边，它更小。`,
            ],
            [
              [`$${a} = ${b}$`, `$${a} = ${b}$`],
              "The numbers are at different points, so they are not equal.",
              "两个数在不同的点上，不相等。",
            ],
          ],
          [
            [
              ["Place them on a number line", "画在数轴上"],
              [`On a number line, $${lo}$ is to the left of $${hi}$.`, `在数轴上，$${lo}$ 在 $${hi}$ 的左边。`],
            ],
            [
              ["Compare", "比较"],
              [`Numbers to the left are less, so $${a} ${rel} ${b}$.`, `越靠左的数越小，所以 $${a} ${rel} ${b}$。`],
            ],
          ],
          hi < 0
            ? [
                `The number $${lo}$ is ${-lo} below zero, and $${hi}$ is only ${-hi} below zero, so $${lo}$ is less.`,
                `$${lo}$ 在 0 以下 ${-lo}，$${hi}$ 只在 0 以下 ${-hi}，所以 $${lo}$ 更小。`,
              ]
            : [
                `The number $${lo}$ is below zero and $${hi}$ is not, so $${lo}$ is less.`,
                `$${lo}$ 在 0 以下，$${hi}$ 不在 0 以下，所以 $${lo}$ 更小。`,
              ],
          signedLine([a, b]),
        );
      },
      signedLine([-15, -9]),
    ),
    point(
      "finding-the-least-and-greatest",
      ["The least and the greatest", "最小和最大"],
      [
        "Of $-7$, $3$, $-12$ and $0$, the least is the one farthest left on a number line, $-12$. The greatest is the one farthest right, $3$.\n\nCheck: in order, $-12 < -7 < 0 < 3$.\n\n> **Watch out.** $-7$ is not less than $-12$. It is closer to zero, so it is greater.",
        "在 $-7$、$3$、$-12$、$0$ 中，最小的是数轴上最靠左的 $-12$，最大的是最靠右的 $3$。\n\n检验：从小到大排列：$-12 < -7 < 0 < 3$。\n\n> **注意。** $-7$ 不比 $-12$ 小。它离 0 更近，所以更大。",
      ],
      (rng) => {
        let xs: number[];
        do {
          const set = new Set<number>();
          while (set.size < 4) set.add(rng.int(-30, 15));
          xs = [...set];
        } while (xs.filter((x) => x < 0).length < 2);
        const least = rng.bool();
        const v = least ? Math.min(...xs) : Math.max(...xs);
        const sorted = [...xs].sort((p, q) => p - q);
        const why = (x: number): [string, string] => {
          if (least)
            return x >= 0
              ? [`$${x}$ is not below zero, so it is greater than $${v}$.`, `$${x}$ 不在 0 以下，比 $${v}$ 大。`]
              : [
                  `$${x}$ is only ${-x} below zero, but $${v}$ is ${-v} below zero.`,
                  `$${x}$ 只在 0 以下 ${-x}，而 $${v}$ 在 0 以下 ${-v}。`,
                ];
          if (x < 0 && v >= 0) return [`$${x}$ is below zero, so it is less than $${v}$.`, `$${x}$ 在 0 以下，比 $${v}$ 小。`];
          if (x < 0) return [`$${x}$ is ${-x} below zero, farther down than $${v}$.`, `$${x}$ 在 0 以下 ${-x}，比 $${v}$ 更低。`];
          return [`$${x}$ is less than $${v}$.`, `$${x}$ 比 $${v}$ 小。`];
        };
        return pickedMath(
          rng,
          least
            ? [`Which number is the least: $${xs.join(", ")}$?`, `${xs.map((x) => `$${x}$`).join("、")} 中哪个数最小？`]
            : [`Which number is the greatest: $${xs.join(", ")}$?`, `${xs.map((x) => `$${x}$`).join("、")} 中哪个数最大？`],
          String(v),
          xs.filter((x) => x !== v).map((x) => [String(x), ...why(x)] as const),
          [
            [["Put them in order", "排序"], ["Order them from least to greatest.", "从小到大排列。"], [sorted.join(" < ")]],
            [
              ["Pick the end", "取一端"],
              least ? ["The least is the first one.", "最小的是第一个。"] : ["The greatest is the last one.", "最大的是最后一个。"],
            ],
          ],
          [
            `On a number line, $${v}$ is the point farthest to the ${least ? "left" : "right"}.`,
            `在数轴上，$${v}$ 是最靠${least ? "左" : "右"}的点。`,
          ],
          signedLine(xs),
        );
      },
      signedLine([-7, 3, -12, 0], -12),
    ),
  ],
  t(
    "Oslo is at $-8$ degrees and Rome is at $-3$ degrees. On a thermometer $-8$ is lower, so Oslo is colder: $-8 < -3$.\n\nCheck: $-8$ is 8 below zero, and $-3$ is only 3 below zero.\n\nIn this lesson we compare and order numbers below and above zero.",
    "奥斯陆的气温是 $-8$ 度，罗马是 $-3$ 度。在温度计上 $-8$ 更低，所以奥斯陆更冷：$-8 < -3$。\n\n检验：$-8$ 在零下 8 度，$-3$ 只在零下 3 度。\n\n本课我们比较零以下和零以上的数，并给它们排序。",
  ),
);

// ---------------------------------------------------------------------------
// Multiplying whole numbers

export const multiplyingNumbersByPowersOfTenUsingPlaceValue = topic(
  "multiplying-numbers-by-powers-of-ten-using-place-value",
  t("Multiplying Numbers by Powers of Ten Using Place Value", "用数位理解乘 10 的幂"),
  t(
    "Multiplying by 10 moves every digit one place to the left, multiplying by 100 two places, and by 1,000 three places; the empty places fill with zeros. So 3,407 × 100 = 340,700.",
    "乘 10，每个数字都向左移动一位；乘 100 移动两位；乘 1,000 移动三位；空出的数位补 0。所以 3,407 × 100 = 340,700。",
  ),
  ["multiplying-by-10-100-and-1000"],
  ["5.NBT.A.2"],
  [
    point(
      "multiplying-by-a-power-of-ten",
      ["Multiplying by 10, 100 or 1,000", "乘 10、100 或 1,000"],
      [
        "$3{,}407 \\times 100 = 340{,}700$. Each digit moves two places to the left, and two zeros fill the empty places.\n\nCheck: $3{,}407 \\times 10 = 34{,}070$, and $34{,}070 \\times 10 = 340{,}700$.\n\n> **Watch out.** Keep the zero inside 3,407. Add zeros only at the right end, and do not drop any digit.",
        "$3{,}407 \\times 100 = 340{,}700$。每个数字都向左移动两位，空出的两位补 0。\n\n检验：$3{,}407 \\times 10 = 34{,}070$，$34{,}070 \\times 10 = 340{,}700$。\n\n> **注意。** 3,407 中间的 0 要保留。只在右端添 0，不要丢掉任何一个数字。",
      ],
      (rng) => {
        const n = rng.bool() ? randomWithDigits(rng, rng.int(2, 4)) : randomWithDigits(rng, rng.int(1, 3)) * 10;
        const k = rng.int(1, 3);
        const p = 10 ** k;
        const ladder = Array.from({ length: k + 1 }, (_, i) => fmt(n * 10 ** i)).join(" \\to ");
        return answered(
          [`Find $${fmt(n)} \\times ${fmt(p)}$.`, `计算 $${fmt(n)} \\times ${fmt(p)}$。`],
          n * p,
          [
            [
              ["Count the zeros", "数 0 的个数"],
              [
                `${grouped(p)} has ${k} zero${k > 1 ? "s" : ""}, so each digit moves ${k} place${k > 1 ? "s" : ""} to the left.`,
                `${grouped(p)} 有 ${k} 个 0，所以每个数字向左移动 ${k} 位。`,
              ],
            ],
            [
              ["Move the digits", "移动数字"],
              ["Fill the empty places with zeros.", "空出的数位补 0。"],
              [`${fmt(n)} \\times ${fmt(p)} = ${fmt(n * p)}`],
            ],
          ],
          [`Multiply by 10 one step at a time: $${ladder}$.`, `一次乘一个 10：$${ladder}$。`],
          [
            [n * p * 10, "That adds one zero too many.", "这是多添了一个 0。"],
            [
              n * (p / 10),
              k === 1 ? "That leaves the number as it was." : "That adds one zero too few.",
              k === 1 ? "这是没有变化的原数。" : "这是少添了一个 0。",
            ],
            [n + p, "That adds instead of multiplying.", "这是用了加法，不是乘法。"],
          ],
          { figure: digitsChart([n, n * p], 0) },
        );
      },
      digitsChart([3407, 340700], 0),
    ),
    point(
      "finding-the-missing-factor",
      ["Finding the missing factor", "求未知因数"],
      [
        "In $56 \\times \\square = 56{,}000$, the digits 5 and 6 moved three places to the left. Each place is one factor of 10, so $\\square = 1{,}000$.\n\nCheck: $56 \\times 1{,}000 = 56{,}000$.\n\n> **Watch out.** Count the places the digits moved, not every zero you see. In $50 \\times \\square = 5{,}000$ the box is 100, not 1,000.",
        "在 $56 \\times \\square = 56{,}000$ 中，数字 5 和 6 向左移动了三位。每移动一位就是乘一个 10，所以 $\\square = 1{,}000$。\n\n检验：$56 \\times 1{,}000 = 56{,}000$。\n\n> **注意。** 要数数字移动了几位，而不是数看到的所有 0。在 $50 \\times \\square = 5{,}000$ 中，方框里是 100，不是 1,000。",
      ],
      (rng) => {
        const n = randomWithDigits(rng, rng.int(2, 4));
        const k = rng.int(1, 3);
        const p = 10 ** k;
        const moved: Pair = [
          `The digits of ${grouped(n)} moved ${k} place${k > 1 ? "s" : ""} to the left.`,
          `${grouped(n)} 的数字向左移动了 ${k} 位。`,
        ];
        const check: Pair = [
          `Multiply back: $${fmt(n)} \\times ${fmt(p)} = ${fmt(n * p)}$.`,
          `乘回去：$${fmt(n)} \\times ${fmt(p)} = ${fmt(n * p)}$。`,
        ];
        if (rng.bool())
          return answered(
            [
              `Find the missing number: $${fmt(n)} \\times \\square = ${fmt(n * p)}$.`,
              `求方框中的数：$${fmt(n)} \\times \\square = ${fmt(n * p)}$。`,
            ],
            p,
            [
              [["Compare the numbers", "比较前后两个数"], moved],
              [
                ["Name the factor", "写出因数"],
                [`Each place is one factor of 10, so the box is ${grouped(p)}.`, `每移动一位就是乘一个 10，所以方框里是 ${grouped(p)}。`],
              ],
            ],
            check,
            [
              [p * 10, "That moves the digits one place too many.", "这会让数字多移动一位。"],
              [
                p / 10,
                k === 1 ? "That would leave the number as it was." : "That moves the digits one place too few.",
                k === 1 ? "乘它数不会变。" : "这会让数字少移动一位。",
              ],
              [k, "That counts the places. The factor is a power of ten.", "这是移动的位数，因数应该是 10 的幂。"],
            ],
            { figure: digitsChart([n, n * p], 0) },
          );
        return answered(
          [
            `Find the missing number: $\\square \\times ${fmt(p)} = ${fmt(n * p)}$.`,
            `求方框中的数：$\\square \\times ${fmt(p)} = ${fmt(n * p)}$。`,
          ],
          n,
          [
            [
              ["Count the zeros", "数 0 的个数"],
              [`${grouped(p)} moves digits ${k} place${k > 1 ? "s" : ""} to the left.`, `乘 ${grouped(p)} 会让数字向左移动 ${k} 位。`],
            ],
            [
              ["Move them back", "移回去"],
              [
                `Move the digits of ${grouped(n * p)} back ${k} place${k > 1 ? "s" : ""} to the right.`,
                `把 ${grouped(n * p)} 的数字向右移回 ${k} 位。`,
              ],
              [`\\square = ${fmt(n)}`],
            ],
          ],
          check,
          [
            [n * 10, "That moves the digits back one place too few.", "这是少移回了一位。"],
            ...(n % 10 === 0 ? ([[n / 10, "That moves the digits back one place too many.", "这是多移回了一位。"]] as const) : []),
            [n * p, "That is the product, not the missing factor.", "这是积，不是未知因数。"],
          ],
          { figure: digitsChart([n, n * p], 0) },
        );
      },
      digitsChart([56, 56000], 0),
    ),
  ],
  t(
    "A shop orders 34 boxes of 100 pencils. That is $34 \\times 100 = 3{,}400$ pencils. Each digit moves two places to the left.\n\nCheck: 10 boxes hold 1,000 pencils, so 30 boxes hold 3,000, and 4 more boxes hold 400.\n\nIn this lesson we multiply by 10, 100 and 1,000 using place value.",
    "商店订了 34 盒铅笔，每盒 100 支，一共 $34 \\times 100 = 3{,}400$ 支。每个数字都向左移动了两位。\n\n检验：10 盒是 1,000 支，30 盒是 3,000 支，再加 4 盒 400 支。\n\n本课我们用数位来理解乘 10、100 和 1,000。",
  ),
);

/** Story is a word problem setting for a multiplication of groups. */
interface Story {
  readonly en: (n: number, a: number) => string;
  readonly zh: (n: number, a: number) => string;
}

const productStories: readonly Story[] = [
  {
    en: (n, a) => `A box holds ${plain(n)} paper clips. How many paper clips are in ${a} boxes?`,
    zh: (n, a) => `一盒有 ${plain(n)} 枚回形针。${a} 盒一共有多少枚？`,
  },
  {
    en: (n, a) => `A train travels ${plain(n)} kilometers each week. How far does it travel in ${a} weeks?`,
    zh: (n, a) => `一列火车每周行驶 ${plain(n)} 千米。${a} 周一共行驶多少千米？`,
  },
  {
    en: (n, a) => `A concert hall sells ${plain(n)} tickets for each show. How many tickets does it sell for ${a} shows?`,
    zh: (n, a) => `音乐厅每场演出售出 ${plain(n)} 张票。${a} 场一共售出多少张？`,
  },
  {
    en: (n, a) => `Each crate holds ${plain(n)} apples. How many apples are in ${a} crates?`,
    zh: (n, a) => `每个板条箱装 ${plain(n)} 个苹果。${a} 个板条箱一共装多少个？`,
  },
];

export const twoDigitByOneDigitMultiplication = topic(
  "two-digit-by-one-digit-multiplication",
  t("Two-Digit by One-Digit Multiplication", "两位数乘一位数"),
  t(
    "The standard algorithm multiplies from the ones place: for 47 × 6, 6 × 7 = 42, so write 2 and carry 4 tens; then 6 × 4 = 24 tens, plus the 4 carried gives 28 tens. So 47 × 6 = 282.",
    "竖式乘法从个位乘起：计算 47 × 6，6 × 7 = 42，写 2，向十位进 4；再算 6 × 4 = 24 个十，加上进位的 4 得 28 个十。所以 47 × 6 = 282。",
  ),
  ["two-digit-by-one-digit-multiplication-using-place-value"],
  ["4.NBT.B.5"],
  [
    point(
      "multiplying-with-the-standard-algorithm",
      ["The standard algorithm", "竖式计算"],
      [
        "For $58 \\times 7$, start with the ones: $7 \\times 8 = 56$. Write 6 and carry 5. Then the tens: $7 \\times 5 = 35$, and the carried 5 makes 40. So $58 \\times 7 = 406$.\n\nCheck: $50 \\times 7 + 8 \\times 7 = 350 + 56 = 406$.\n\n> **Watch out.** Add the carried digit. Forgetting it gives 356.",
        "计算 $58 \\times 7$，先乘个位：$7 \\times 8 = 56$，写 6，进 5。再乘十位：$7 \\times 5 = 35$，加上进位的 5 得 40。所以 $58 \\times 7 = 406$。\n\n检验：$50 \\times 7 + 8 \\times 7 = 350 + 56 = 406$。\n\n> **注意。** 别忘了加进位。忘了加就会得到 356。",
      ],
      (rng) => oneDigitProduct(rng, 2),
      areaGridFigure(["7"], ["50", "8"], [["350", "56"]], [1], [5, 2]),
    ),
    point(
      "two-digit-by-one-digit-word-problems",
      ["Word problems", "应用题"],
      [
        "A hall has 8 rows of 36 chairs. The rows are equal groups, so multiply: $36 \\times 8$. Ones: $8 \\times 6 = 48$, write 8 and carry 4. Tens: $8 \\times 3 + 4 = 28$. So there are 288 chairs.\n\nCheck: $30 \\times 8 + 6 \\times 8 = 240 + 48 = 288$.\n\n> **Watch out.** Do not add 36 and 8. There are 8 groups of 36.",
        "礼堂有 8 排椅子，每排 36 把。每排一样多，所以用乘法：$36 \\times 8$。个位：$8 \\times 6 = 48$，写 8，进 4。十位：$8 \\times 3 + 4 = 28$。所以一共 288 把。\n\n检验：$30 \\times 8 + 6 \\times 8 = 240 + 48 = 288$。\n\n> **注意。** 不要把 36 和 8 相加。这是 8 个 36。",
      ],
      (rng) => productByOneDigit(rng.int(12, 99), rng.int(3, 9), rng.pick(productStories)),
      equalTape(8, "36", "?"),
    ),
  ],
  t(
    "A bus has 47 seats, and the school fills 6 buses. That is $47 \\times 6$. Six times 7 ones is 42, so write 2 and carry 4 tens. Six times 4 tens is 24 tens, and the 4 carried makes 28 tens. So there are 282 seats.\n\nCheck: $6 \\times 40 + 6 \\times 7 = 240 + 42 = 282$.\n\nIn this lesson we multiply a two-digit number by a one-digit number with the standard algorithm.",
    "一辆大巴有 47 个座位，学校坐满了 6 辆，就是 $47 \\times 6$。6 乘 7 个一是 42，写 2，向十位进 4。6 乘 4 个十是 24 个十，加上进位的 4 得 28 个十。所以一共 282 个座位。\n\n检验：$6 \\times 40 + 6 \\times 7 = 240 + 42 = 282$。\n\n本课我们用竖式计算两位数乘一位数。",
  ),
);

export const threeAndFourDigitByOneDigitMultiplication = topic(
  "three-and-four-digit-by-one-digit-multiplication",
  t("Three- and Four-Digit by One-Digit Multiplication", "三、四位数乘一位数"),
  t(
    "The standard algorithm works the same way for longer numbers: multiply each digit from the ones place, write the ones digit of each product, and add the carried digit to the next product. For 2,347 × 4: 28, write 8 carry 2; 16 + 2 = 18, write 8 carry 1; 12 + 1 = 13, write 3 carry 1; 8 + 1 = 9. So 2,347 × 4 = 9,388.",
    "位数更多的数，竖式乘法的方法也一样：从个位起依次相乘，写下积的个位，把进位加到下一位的积上。计算 2,347 × 4：28，写 8 进 2；16 + 2 = 18，写 8 进 1；12 + 1 = 13，写 3 进 1；8 + 1 = 9。所以 2,347 × 4 = 9,388。",
  ),
  ["two-digit-by-one-digit-multiplication", "multi-digit-by-one-digit-multiplication-using-place-value"],
  ["4.NBT.B.5"],
  [
    point(
      "three-digit-by-one-digit",
      ["Three-digit numbers", "三位数乘一位数"],
      [
        "For $436 \\times 7$: ones, $7 \\times 6 = 42$, write 2 and carry 4. Tens, $7 \\times 3 + 4 = 25$, write 5 and carry 2. Hundreds, $7 \\times 4 + 2 = 30$. So $436 \\times 7 = 3{,}052$.\n\nCheck: $400 \\times 7 + 30 \\times 7 + 6 \\times 7 = 2{,}800 + 210 + 42 = 3{,}052$.\n\n> **Watch out.** Add each carry after you multiply, not before. $7 \\times (3 + 4)$ would be wrong.",
        "计算 $436 \\times 7$：个位，$7 \\times 6 = 42$，写 2，进 4；十位，$7 \\times 3 + 4 = 25$，写 5，进 2；百位，$7 \\times 4 + 2 = 30$。所以 $436 \\times 7 = 3{,}052$。\n\n检验：$400 \\times 7 + 30 \\times 7 + 6 \\times 7 = 2{,}800 + 210 + 42 = 3{,}052$。\n\n> **注意。** 进位要在乘完以后再加，不是先加。$7 \\times (3 + 4)$ 是错的。",
      ],
      (rng) => oneDigitProduct(rng, 3),
      areaGridFigure(["7"], ["400", "30", "6"], [["2,800", "210", "42"]]),
    ),
    point(
      "four-digit-by-one-digit",
      ["Four-digit numbers", "四位数乘一位数"],
      [
        "For $5{,}208 \\times 6$: ones, $6 \\times 8 = 48$, write 8 and carry 4. Tens, $6 \\times 0 + 4 = 4$. Hundreds, $6 \\times 2 = 12$, write 2 and carry 1. Thousands, $6 \\times 5 + 1 = 31$. So the product is $31{,}248$.\n\nCheck: $5{,}000 \\times 6 + 200 \\times 6 + 8 \\times 6 = 30{,}000 + 1{,}200 + 48 = 31{,}248$.\n\n> **Watch out.** A zero digit still needs the carry. $6 \\times 0$ is 0, but the 4 carried must be written there.",
        "计算 $5{,}208 \\times 6$：个位，$6 \\times 8 = 48$，写 8，进 4；十位，$6 \\times 0 + 4 = 4$；百位，$6 \\times 2 = 12$，写 2，进 1；千位，$6 \\times 5 + 1 = 31$。所以积是 $31{,}248$。\n\n检验：$5{,}000 \\times 6 + 200 \\times 6 + 8 \\times 6 = 30{,}000 + 1{,}200 + 48 = 31{,}248$。\n\n> **注意。** 遇到 0 也要加进位。$6 \\times 0$ 得 0，但进上来的 4 要写在这一位上。",
      ],
      (rng) => oneDigitProduct(rng, 4),
      areaGridFigure(["6"], ["5,000", "200", "8"], [["30,000", "1,200", "48"]]),
    ),
  ],
  t(
    "Each box holds 2,347 pins, and a shop buys 4 boxes. For $2{,}347 \\times 4$, start at the ones: $4 \\times 7 = 28$, write 8 and carry 2. Keep going one place at a time. The product is 9,388 pins.\n\nCheck: $2{,}000 \\times 4 + 347 \\times 4 = 8{,}000 + 1{,}388 = 9{,}388$.\n\nIn this lesson we multiply three- and four-digit numbers by a one-digit number.",
    "每盒有 2,347 枚别针，商店买了 4 盒。计算 $2{,}347 \\times 4$，从个位乘起：$4 \\times 7 = 28$，写 8，进 2。再一位一位地往下乘，积是 9,388 枚。\n\n检验：$2{,}000 \\times 4 + 347 \\times 4 = 8{,}000 + 1{,}388 = 9{,}388$。\n\n本课我们计算三位数、四位数乘一位数。",
  ),
);

export const fiveAndSixDigitByOneDigitMultiplication = topic(
  "five-and-six-digit-by-one-digit-multiplication",
  t("Five- and Six-Digit by One-Digit Multiplication", "五、六位数乘一位数"),
  t(
    "Large numbers are multiplied by a one-digit number exactly as smaller ones are, one place at a time from the ones, carrying as needed: 42,316 × 3 = 126,948.",
    "多位数乘一位数的方法和较小的数一样：从个位起逐位相乘，需要时进位：42,316 × 3 = 126,948。",
  ),
  ["three-and-four-digit-by-one-digit-multiplication"],
  ["5.NBT.B.5"],
  [
    point(
      "five-digit-by-one-digit",
      ["Five-digit numbers", "五位数乘一位数"],
      [
        "For $30{,}457 \\times 8$: ones, $8 \\times 7 = 56$, write 6 and carry 5. Tens, $8 \\times 5 + 5 = 45$, write 5 and carry 4. Hundreds, $8 \\times 4 + 4 = 36$, write 6 and carry 3. Thousands, $8 \\times 0 + 3 = 3$. Ten thousands, $8 \\times 3 = 24$. So the product is $243{,}656$.\n\nCheck: $30{,}000 \\times 8 + 457 \\times 8 = 240{,}000 + 3{,}656 = 243{,}656$.\n\n> **Watch out.** Keep the places lined up. Each carry goes into the very next place.",
        "计算 $30{,}457 \\times 8$：个位，$8 \\times 7 = 56$，写 6，进 5；十位，$8 \\times 5 + 5 = 45$，写 5，进 4；百位，$8 \\times 4 + 4 = 36$，写 6，进 3；千位，$8 \\times 0 + 3 = 3$；万位，$8 \\times 3 = 24$。所以积是 $243{,}656$。\n\n检验：$30{,}000 \\times 8 + 457 \\times 8 = 240{,}000 + 3{,}656 = 243{,}656$。\n\n> **注意。** 数位要对齐。每次的进位只加到紧挨着的下一位。",
      ],
      (rng) => oneDigitProduct(rng, 5),
      areaGridFigure(["8"], ["30,000", "457"], [["240,000", "3,656"]]),
    ),
    point(
      "six-digit-by-one-digit",
      ["Six-digit numbers", "六位数乘一位数"],
      [
        "For $215{,}806 \\times 4$, take six steps, one for each digit: 24, write 4 and carry 2. Then $0 + 2 = 2$. Then 32, write 2 and carry 3. Then $20 + 3 = 23$, write 3 and carry 2. Then $4 + 2 = 6$. Then 8. So the product is $863{,}224$.\n\nCheck: $215{,}000 \\times 4 + 806 \\times 4 = 860{,}000 + 3{,}224 = 863{,}224$.\n\n> **Watch out.** A zero digit passes its carry along. Do not skip that place.",
        "计算 $215{,}806 \\times 4$，每一位乘一次，共六步：24，写 4，进 2；$0 + 2 = 2$；32，写 2，进 3；$20 + 3 = 23$，写 3，进 2；$4 + 2 = 6$；8。所以积是 $863{,}224$。\n\n检验：$215{,}000 \\times 4 + 806 \\times 4 = 860{,}000 + 3{,}224 = 863{,}224$。\n\n> **注意。** 遇到 0 也要把进位写上，不要跳过这一位。",
      ],
      (rng) => oneDigitProduct(rng, 6),
      areaGridFigure(["4"], ["215,000", "806"], [["860,000", "3,224"]]),
    ),
  ],
  t(
    "A factory fills 42,316 bottles a day. In 3 days it fills $42{,}316 \\times 3$ bottles. We multiply one place at a time from the ones, and get 126,948.\n\nCheck: $42{,}000 \\times 3 = 126{,}000$, and $316 \\times 3 = 948$.\n\nIn this lesson we multiply five- and six-digit numbers by a one-digit number.",
    "一家工厂每天灌装 42,316 瓶，3 天灌装 $42{,}316 \\times 3$ 瓶。从个位起一位一位地乘，得 126,948。\n\n检验：$42{,}000 \\times 3 = 126{,}000$，$316 \\times 3 = 948$。\n\n本课我们计算五位数、六位数乘一位数。",
  ),
);

/** twoDigitNoZero draws a two-digit number whose digits are both nonzero. */
const twoDigitNoZero = (rng: Rng) => rng.int(1, 9) * 10 + rng.int(1, 9);

export const twoDigitByTwoDigitMultiplication = topic(
  "two-digit-by-two-digit-multiplication",
  t("Two-Digit by Two-Digit Multiplication", "两位数乘两位数"),
  t(
    "To find 47 × 36 with the standard algorithm, multiply 47 by the ones digit (47 × 6 = 282), then by the tens digit as tens (47 × 30 = 1,410, written with a 0 in the ones place), and add the partial products: 282 + 1,410 = 1,692.",
    "用竖式计算 47 × 36：先用个位上的 6 乘 47（47 × 6 = 282），再用十位上的 3 乘 47，得到的是 141 个十（47 × 30 = 1,410，个位写 0），最后把两部分积相加：282 + 1,410 = 1,692。",
  ),
  ["two-digit-by-one-digit-multiplication", "two-digit-by-two-digit-multiplication-using-place-value"],
  ["5.NBT.B.5"],
  [
    point(
      "partial-product-of-the-tens-digit",
      ["The partial product of the tens digit", "十位数字的部分积"],
      [
        "In $64 \\times 27$, the 2 means 20. Its partial product is $64 \\times 20 = 1{,}280$.\n\nCheck: $64 \\times 2 = 128$, and 10 times that is $1{,}280$.\n\n> **Watch out.** Do not write 128 in that row. The tens digit stands for tens, so the row ends in a zero.",
        "在 $64 \\times 27$ 中，2 表示 20，它的部分积是 $64 \\times 20 = 1{,}280$。\n\n检验：$64 \\times 2 = 128$，再乘 10 是 $1{,}280$。\n\n> **注意。** 这一行不要写 128。十位上的数表示几个十，所以这一行末尾有一个 0。",
      ],
      (rng) => {
        const n = twoDigitNoZero(rng);
        const m = twoDigitNoZero(rng);
        const tens = Math.floor(m / 10);
        return answered(
          [
            `In the standard algorithm for $${n} \\times ${m}$, what is the partial product for the tens digit of ${m}?`,
            `用竖式计算 $${n} \\times ${m}$ 时，${m} 十位上的数字对应的部分积是多少？`,
          ],
          n * tens * 10,
          [
            [
              ["Find what the digit means", "看数字表示多少"],
              [`The tens digit ${tens} stands for ${tens * 10}.`, `十位上的 ${tens} 表示 ${tens * 10}。`],
            ],
            [
              ["Multiply", "相乘"],
              [`Multiply ${n} by ${tens * 10}.`, `用 ${n} 乘 ${tens * 10}。`],
              [`${n} \\times ${tens * 10} = ${fmt(n * tens * 10)}`],
            ],
          ],
          [
            `Multiply by ${tens}, then by 10: $${n} \\times ${tens} = ${n * tens}$ and $${n * tens} \\times 10 = ${fmt(n * tens * 10)}$.`,
            `先乘 ${tens} 再乘 10：$${n} \\times ${tens} = ${n * tens}$，$${n * tens} \\times 10 = ${fmt(n * tens * 10)}$。`,
          ],
          [
            [
              n * tens,
              `That forgets the zero. The digit ${tens} stands for ${tens * 10}.`,
              `这是漏掉了 0。数字 ${tens} 表示 ${tens * 10}。`,
            ],
            [n * (m % 10), "That is the partial product for the ones digit.", "这是个位数字的部分积。"],
            [n * m, "That is the whole product, not one partial product.", "这是整个积，不是一个部分积。"],
          ],
          { figure: areaGridFigure([String(n)], [String(tens * 10), String(m % 10)], [["?", String(n * (m % 10))]]) },
        );
      },
      areaGridFigure(["64"], ["20", "7"], [["1,280", "448"]]),
    ),
    point(
      "multiplying-two-digit-numbers",
      ["Finding the product", "求积"],
      [
        "For $38 \\times 45$, split 45 into 40 and 5. Then $38 \\times 5 = 190$ and $38 \\times 40 = 1{,}520$. Add: $190 + 1{,}520 = 1{,}710$.\n\nCheck: split 38 instead. $30 \\times 45 + 8 \\times 45 = 1{,}350 + 360 = 1{,}710$.\n\n> **Watch out.** Remember the zero in the tens row. $38 \\times 4 = 152$ is not the partial product for the 4 tens.",
        "计算 $38 \\times 45$，把 45 拆成 40 和 5。$38 \\times 5 = 190$，$38 \\times 40 = 1{,}520$，相加：$190 + 1{,}520 = 1{,}710$。\n\n检验：改拆 38：$30 \\times 45 + 8 \\times 45 = 1{,}350 + 360 = 1{,}710$。\n\n> **注意。** 十位那一行别忘了 0。$38 \\times 4 = 152$ 不是 4 个十的部分积。",
      ],
      (rng) => multiDigitProduct(rng.int(12, 99), twoDigitNoZero(rng)),
      areaGridFigure(["38"], ["40", "5"], [["1,520", "190"]]),
    ),
  ],
  t(
    "A theater has 36 rows of 47 seats. For $47 \\times 36$, first $47 \\times 6 = 282$. Then $47 \\times 30 = 1{,}410$. Add the two parts: $282 + 1{,}410 = 1{,}692$ seats.\n\nCheck: $40 \\times 36 + 7 \\times 36 = 1{,}440 + 252 = 1{,}692$.\n\nIn this lesson we multiply two-digit numbers with partial products.",
    "剧场有 36 排，每排 47 个座位。计算 $47 \\times 36$，先算 $47 \\times 6 = 282$，再算 $47 \\times 30 = 1{,}410$，两部分相加：$282 + 1{,}410 = 1{,}692$ 个座位。\n\n检验：$40 \\times 36 + 7 \\times 36 = 1{,}440 + 252 = 1{,}692$。\n\n本课我们用部分积计算两位数乘两位数。",
  ),
);

export const multiDigitByTwoDigitMultiplication = topic(
  "multi-digit-by-two-digit-multiplication",
  t("Multi-Digit by Two-Digit Multiplication", "多位数乘两位数"),
  t(
    "To multiply a three- or four-digit number by a two-digit number, find the partial products for the ones digit and the tens digit and add them: 352 × 24 = 352 × 4 + 352 × 20 = 1,408 + 7,040 = 8,448.",
    "三位数或四位数乘两位数，分别求出个位数字和十位数字的部分积再相加：352 × 24 = 352 × 4 + 352 × 20 = 1,408 + 7,040 = 8,448。",
  ),
  ["two-digit-by-two-digit-multiplication", "three-and-four-digit-by-one-digit-multiplication"],
  ["5.NBT.B.5"],
  [
    point(
      "three-digit-by-two-digit",
      ["Three-digit by two-digit", "三位数乘两位数"],
      [
        "For $407 \\times 36$, find $407 \\times 6 = 2{,}442$ and $407 \\times 30 = 12{,}210$. Add: $2{,}442 + 12{,}210 = 14{,}652$.\n\nCheck: split 407 instead. $400 \\times 36 + 7 \\times 36 = 14{,}400 + 252 = 14{,}652$.\n\n> **Watch out.** The zero in 407 still gets its carry in each row.",
        "计算 $407 \\times 36$，先算 $407 \\times 6 = 2{,}442$ 和 $407 \\times 30 = 12{,}210$，再相加：$2{,}442 + 12{,}210 = 14{,}652$。\n\n检验：改拆 407：$400 \\times 36 + 7 \\times 36 = 14{,}400 + 252 = 14{,}652$。\n\n> **注意。** 每一行里，407 中 0 那一位都别忘了加进位。",
      ],
      (rng) => multiDigitProduct(randomWithDigits(rng, 3), twoDigitNoZero(rng)),
      areaGridFigure(["407"], ["30", "6"], [["12,210", "2,442"]]),
    ),
    point(
      "four-digit-by-two-digit",
      ["Four-digit by two-digit", "四位数乘两位数"],
      [
        "For $2{,}315 \\times 42$, find $2{,}315 \\times 2 = 4{,}630$ and $2{,}315 \\times 40 = 92{,}600$. Add: $4{,}630 + 92{,}600 = 97{,}230$.\n\nCheck: split 2,315 instead. $2{,}000 \\times 42 + 315 \\times 42 = 84{,}000 + 13{,}230 = 97{,}230$.\n\n> **Watch out.** There are still only two partial products, one for each digit of 42. Line up the places before you add.",
        "计算 $2{,}315 \\times 42$，先算 $2{,}315 \\times 2 = 4{,}630$ 和 $2{,}315 \\times 40 = 92{,}600$，再相加：$4{,}630 + 92{,}600 = 97{,}230$。\n\n检验：改拆 2,315：$2{,}000 \\times 42 + 315 \\times 42 = 84{,}000 + 13{,}230 = 97{,}230$。\n\n> **注意。** 仍然只有两个部分积，42 的每一位各一个。相加前先把数位对齐。",
      ],
      (rng) => multiDigitProduct(randomWithDigits(rng, 4), twoDigitNoZero(rng)),
      areaGridFigure(["2,315"], ["40", "2"], [["92,600", "4,630"]]),
    ),
  ],
  t(
    "A farm packs 352 boxes a day for 24 days. For $352 \\times 24$, find $352 \\times 4 = 1{,}408$ and $352 \\times 20 = 7{,}040$. Together that is $8{,}448$ boxes.\n\nCheck: $350 \\times 24 = 8{,}400$, and $2 \\times 24 = 48$ more makes $8{,}448$.\n\nIn this lesson we multiply three- and four-digit numbers by two-digit numbers.",
    "一个农场每天装 352 箱，装了 24 天。计算 $352 \\times 24$，先算 $352 \\times 4 = 1{,}408$ 和 $352 \\times 20 = 7{,}040$，合起来是 $8{,}448$ 箱。\n\n检验：$350 \\times 24 = 8{,}400$，再加 $2 \\times 24 = 48$，得 $8{,}448$。\n\n本课我们计算三位数、四位数乘两位数。",
  ),
);

export const threeDigitByThreeDigitMultiplication = topic(
  "three-digit-by-three-digit-multiplication",
  t("Three-Digit by Three-Digit Multiplication", "三位数乘三位数"),
  t(
    "A three-digit multiplier gives three partial products, one for each digit, with zeros for the tens and hundreds: 214 × 135 = 214 × 5 + 214 × 30 + 214 × 100 = 1,070 + 6,420 + 21,400 = 28,890.",
    "乘数是三位数时有三个部分积，每一位数字各一个，十位和百位的部分积末尾分别补 0：214 × 135 = 214 × 5 + 214 × 30 + 214 × 100 = 1,070 + 6,420 + 21,400 = 28,890。",
  ),
  ["multi-digit-by-two-digit-multiplication"],
  ["5.NBT.B.5"],
  [
    point(
      "partial-product-of-the-hundreds-digit",
      ["The partial product of the hundreds digit", "百位数字的部分积"],
      [
        "In $326 \\times 241$, the 2 means 200. Its partial product is $326 \\times 200 = 65{,}200$.\n\nCheck: $326 \\times 2 = 652$, and 100 times that is $65{,}200$.\n\n> **Watch out.** That row ends in two zeros. Writing 652 there makes it 100 times too small.",
        "在 $326 \\times 241$ 中，2 表示 200，它的部分积是 $326 \\times 200 = 65{,}200$。\n\n检验：$326 \\times 2 = 652$，再乘 100 是 $65{,}200$。\n\n> **注意。** 这一行末尾有两个 0。写成 652 就小了 100 倍。",
      ],
      (rng) => {
        const n = randomWithDigits(rng, 3);
        const m = randomWithDigits(rng, 3);
        const h = Math.floor(m / 100);
        return answered(
          [
            `In the standard algorithm for $${n} \\times ${m}$, what is the partial product for the hundreds digit of ${m}?`,
            `用竖式计算 $${n} \\times ${m}$ 时，${m} 百位上的数字对应的部分积是多少？`,
          ],
          n * h * 100,
          [
            [
              ["Find what the digit means", "看数字表示多少"],
              [`The hundreds digit ${h} stands for ${h * 100}.`, `百位上的 ${h} 表示 ${h * 100}。`],
            ],
            [
              ["Multiply", "相乘"],
              [`Multiply ${n} by ${h * 100}.`, `用 ${n} 乘 ${h * 100}。`],
              [`${n} \\times ${h * 100} = ${fmt(n * h * 100)}`],
            ],
          ],
          [
            `Multiply by ${h}, then by 100: $${n} \\times ${h} = ${fmt(n * h)}$ and $${fmt(n * h)} \\times 100 = ${fmt(n * h * 100)}$.`,
            `先乘 ${h} 再乘 100：$${n} \\times ${h} = ${fmt(n * h)}$，$${fmt(n * h)} \\times 100 = ${fmt(n * h * 100)}$。`,
          ],
          [
            [n * h, "That forgets both zeros.", "这是漏掉了两个 0。"],
            [n * h * 10, "That has only one zero. The hundreds digit stands for hundreds.", "这里只有一个 0。百位上的数表示几个百。"],
            [n * m, "That is the whole product, not one partial product.", "这是整个积，不是一个部分积。"],
          ],
        );
      },
      areaGridFigure(["326"], ["200", "40", "1"], [["65,200", "13,040", "326"]]),
    ),
    point(
      "multiplying-three-digit-numbers",
      ["Finding the product", "求积"],
      [
        "For $152 \\times 304$, the ones give $152 \\times 4 = 608$. The tens digit is 0, so that row is 0. The hundreds give $152 \\times 300 = 45{,}600$. Add: $608 + 45{,}600 = 46{,}208$.\n\nCheck: split 152 instead. $100 \\times 304 + 50 \\times 304 + 2 \\times 304 = 30{,}400 + 15{,}200 + 608 = 46{,}208$.\n\n> **Watch out.** The 3 in 304 means 300, not 30. Count the places from the right.",
        "计算 $152 \\times 304$，个位得 $152 \\times 4 = 608$；十位是 0，这一行是 0；百位得 $152 \\times 300 = 45{,}600$。相加：$608 + 45{,}600 = 46{,}208$。\n\n检验：改拆 152：$100 \\times 304 + 50 \\times 304 + 2 \\times 304 = 30{,}400 + 15{,}200 + 608 = 46{,}208$。\n\n> **注意。** 304 中的 3 表示 300，不是 30。要从右往左数数位。",
      ],
      (rng) => multiDigitProduct(randomWithDigits(rng, 3), randomWithDigits(rng, 3)),
      areaGridFigure(["152"], ["300", "4"], [["45,600", "608"]]),
    ),
  ],
  t(
    "A stadium has 135 sections with 214 seats each. For $214 \\times 135$ there are three partial products: $214 \\times 5 = 1{,}070$, $214 \\times 30 = 6{,}420$ and $214 \\times 100 = 21{,}400$. They add up to $28{,}890$ seats.\n\nCheck: $200 \\times 135 + 14 \\times 135 = 27{,}000 + 1{,}890 = 28{,}890$.\n\nIn this lesson we multiply three-digit numbers by three-digit numbers.",
    "体育场有 135 个看台区，每区 214 个座位。计算 $214 \\times 135$ 有三个部分积：$214 \\times 5 = 1{,}070$，$214 \\times 30 = 6{,}420$，$214 \\times 100 = 21{,}400$，合起来是 $28{,}890$ 个座位。\n\n检验：$200 \\times 135 + 14 \\times 135 = 27{,}000 + 1{,}890 = 28{,}890$。\n\n本课我们计算三位数乘三位数。",
  ),
);

// ---------------------------------------------------------------------------
// Dividing whole numbers

/** dividend draws a dividend for divisor d with `digits` digits, exact or with a nonzero remainder. */
function dividend(rng: Rng, d: number, digits: number, exact: boolean): number {
  for (;;) {
    const q = rng.int(Math.ceil(10 ** (digits - 1) / d), Math.floor((10 ** digits - 1) / d));
    if (q < 2) continue;
    const r = exact ? 0 : rng.int(1, d - 1);
    const n = q * d + r;
    if (n >= 10 ** (digits - 1) && n < 10 ** digits) return n;
  }
}

/** fracTex writes a fraction in LaTeX. */
const fracTex = (a: number, b: number): string => `\\frac{${a}}{${b}}`;

/** divisionLines writes each step of the long division of n by d as a line of LaTeX. */
const divisionLines = (n: number, d: number): string[] =>
  longDivision(n, d).map(
    (row) => `${fmt(row.part)} \\div ${d} \\to ${row.digit}, \\quad ${fmt(row.part)} - ${fmt(row.digit * d)} = ${fmt(row.rest)}`,
  );

/** quotientPair writes n ÷ d = q, or with a remainder as "q R r" in English and "q……r" in Chinese. */
function quotientPair(n: number, d: number): Pair {
  const q = Math.floor(n / d);
  const r = n % d;
  return r
    ? [`${fmt(n)} \\div ${d} = ${qr(q, r).en}`, `${fmt(n)} \\div ${d} = ${qr(q, r).zh}`]
    : [`${fmt(n)} \\div ${d} = ${fmt(q)}`, `${fmt(n)} \\div ${d} = ${fmt(q)}`];
}

/** longWalk works n ÷ d by long division in two labelled steps. */
function longWalk(n: number, d: number): Walk[] {
  const q = Math.floor(n / d);
  const r = n % d;
  const [en, zh] = quotientPair(n, d);
  const first = longDivision(n, d)[0]!.part;
  return [
    [
      ["Divide place by place", "逐位去除"],
      [
        `Start with ${grouped(first)}, the first part that is at least ${d}. Divide, multiply, subtract, then bring down the next digit.`,
        `先看 ${grouped(first)}，这是最前面不比 ${d} 小的部分。除、乘、减，再落下下一位。`,
      ],
      divisionLines(n, d),
    ],
    [
      ["Read the quotient", "读出商"],
      r
        ? [
            `The quotient digits make ${grouped(q)}, and ${r} is left over: $${en}$.`,
            `商的各位合起来是 ${grouped(q)}，还剩 ${r}：$${zh}$。`,
          ]
        : [`The quotient digits make ${grouped(q)}: $${en}$.`, `商的各位合起来是 ${grouped(q)}：$${zh}$。`],
    ],
  ];
}

/** checkBack multiplies the quotient by the divisor and adds the remainder to get back to n. */
function checkBack(n: number, d: number): Pair {
  const q = Math.floor(n / d);
  const r = n % d;
  const tex = `${fmt(q)} \\times ${d}${r ? ` + ${r}` : ""} = ${fmt(n)}`;
  return [`Multiply back: $${tex}$.`, `乘回去验算：$${tex}$。`];
}

/** exactQuotient asks for n ÷ d, which leaves no remainder, worked by `walk` (long division unless given). */
function exactQuotient(n: number, d: number, walk: readonly Walk[] = longWalk(n, d), how?: Pair): Problem {
  const q = n / d;
  return answered(how ?? [`Find $${fmt(n)} \\div ${d}$.`, `计算 $${fmt(n)} \\div ${d}$。`], q, walk, checkBack(n, d), [
    [
      dropZeros(q),
      "That leaves out a 0 in the quotient. Write 0 for a place that is too small to divide.",
      "这是漏写了商里的 0。某一位不够除时要写 0。",
    ],
    [
      q + 1,
      `That is one too many: $${fmt(q + 1)} \\times ${d} = ${fmt((q + 1) * d)}$, more than ${grouped(n)}.`,
      `多了 1：$${fmt(q + 1)} \\times ${d} = ${fmt((q + 1) * d)}$，比 ${grouped(n)} 大。`,
    ],
    [
      q - 1,
      `That is one too few: $${fmt(q - 1)} \\times ${d} = ${fmt((q - 1) * d)}$, and one more ${d} still fits.`,
      `少了 1：$${fmt(q - 1)} \\times ${d} = ${fmt((q - 1) * d)}$，还能再放一个 ${d}。`,
    ],
  ]);
}

/** remainderQuotient asks for n ÷ d with a remainder as a choice of quotient and remainder, worked by `walk` (long division unless given). */
function remainderQuotient(rng: Rng, n: number, d: number, walk: readonly Walk[] = longWalk(n, d), how?: Pair): Problem {
  const q = Math.floor(n / d);
  const r = n % d;
  const opt = (a: number, b: number): Pair => [`$${qr(a, b).en}$`, `$${qr(a, b).zh}$`];
  const wrong: [Pair, string, string][] = [];
  if (q > 1)
    wrong.push([
      opt(q - 1, r + d),
      `The remainder ${r + d} is not less than ${d}, so one more ${d} fits.`,
      `余数 ${r + d} 不比 ${d} 小，还能再分出一个 ${d}。`,
    ]);
  wrong.push([
    opt(q + 1, r),
    `Check it: $${fmt(q + 1)} \\times ${d} + ${r} = ${fmt((q + 1) * d + r)}$, not ${grouped(n)}.`,
    `验算：$${fmt(q + 1)} \\times ${d} + ${r} = ${fmt((q + 1) * d + r)}$，不是 ${grouped(n)}。`,
  ]);
  if (dropZeros(q) !== q) wrong.push([opt(dropZeros(q), r), "That leaves out a 0 in the quotient.", "这是漏写了商里的 0。"]);
  if (wrong.length < 3 && d - r !== r)
    wrong.push([
      opt(q, d - r),
      `${d - r} is how many more would make another group, not what is left.`,
      `${d - r} 是再凑一组还差的数，不是剩下的数。`,
    ]);
  return picked(rng, how ?? [`Find $${fmt(n)} \\div ${d}$.`, `计算 $${fmt(n)} \\div ${d}$。`], opt(q, r), wrong, walk, checkBack(n, d));
}

/** remainderTape draws n as `q` equal pieces of d and a shaded piece for the remainder. */
function remainderTape(n: number, d: number): Figure {
  const q = Math.floor(n / d);
  const r = n % d;
  return tapeFigure(
    [
      {
        total: grouped(n),
        pieces: [
          ...Array.from({ length: q }, () => ({ size: d, text: String(d) })),
          ...(r ? [{ size: r, text: String(r), lit: true }] : []),
        ],
      },
    ],
    [
      `A bar of ${grouped(n)} cut into ${q} pieces of ${d}${r ? ` and a shaded piece of ${r} left over` : ""}.`,
      `一个长 ${grouped(n)} 的长条，分成 ${q} 段 ${d}${r ? `，还剩涂色的一段 ${r}` : ""}。`,
    ],
  );
}

/** partialWalk works n ÷ d by taking away easy groups of d by place value, then adding the partial quotients. */
function partialWalk(n: number, d: number): Walk[] {
  let rest = n;
  const ks = chunksOf(n, d);
  const lines = ks.map((k) => {
    const line = `${fmt(rest)} - ${fmt(k * d)} = ${fmt(rest - k * d)} \\quad (${fmt(k)} \\times ${d})`;
    rest -= k * d;
    return line;
  });
  const q = ks.reduce((a, b) => a + b, 0);
  return [
    [
      ["Take away easy groups", "减去好算的组"],
      [`Subtract big, easy groups of ${d} until less than ${d} is left.`, `一次减去好算的若干个 ${d}，直到剩下的比 ${d} 小。`],
      lines,
    ],
    [
      ["Add the partial quotients", "把部分商相加"],
      rest
        ? [
            `The partial quotients add up to the quotient, and the ${rest} left is the remainder.`,
            `各部分商的和就是商，剩下的 ${rest} 是余数。`,
          ]
        : ["The partial quotients add up to the quotient.", "各部分商的和就是商。"],
      [ks.length > 1 ? `${ks.map(fmt).join(" + ")} = ${fmt(q)}` : fmt(q)],
    ],
  ];
}

/** roundedQuotient asks for n ÷ d rounded to the nearest whole number, the prompt given or plain. */
function roundedQuotient(n: number, d: number, prompt?: Pair): Problem {
  const q = Math.floor(n / d);
  const r = n % d;
  const up = 2 * r > d;
  const near = up ? q + 1 : q;
  const [en, zh] = quotientPair(n, d);
  return answered(
    prompt ?? [`Find $${fmt(n)} \\div ${d}$, rounded to the nearest whole number.`, `计算 $${fmt(n)} \\div ${d}$，结果四舍五入到整数。`],
    near,
    [
      [
        ["Divide", "做除法"],
        [`Long division gives $${en}$.`, `用竖式计算：$${zh}$。`],
      ],
      [
        ["Compare with half", "和一半比较"],
        [
          `Half of ${d} is $${fracTex(d, 2)}$. The remainder ${r} is ${up ? "more" : "less"} than that, so round ${up ? "up" : "down"} to ${near}.`,
          `${d} 的一半是 $${fracTex(d, 2)}$。余数 ${r} 比它${up ? "大" : "小"}，所以约为 ${near}。`,
        ],
      ],
    ],
    [
      `Multiply: $${q} \\times ${d} = ${fmt(q * d)}$ is ${n - q * d} away from ${grouped(n)}, and $${q + 1} \\times ${d} = ${fmt((q + 1) * d)}$ is ${(q + 1) * d - n} away. So ${near} is closer.`,
      `乘一乘：$${q} \\times ${d} = ${fmt(q * d)}$ 和 ${grouped(n)} 相差 ${n - q * d}，$${q + 1} \\times ${d} = ${fmt((q + 1) * d)}$ 相差 ${(q + 1) * d - n}。所以 ${near} 更接近。`,
    ],
    [
      [
        up ? q : q + 1,
        `That rounds the wrong way. The remainder ${r} is ${up ? "more" : "less"} than half of ${d}.`,
        `这是取反了。余数 ${r} ${up ? "大于" : "小于"} ${d} 的一半。`,
      ],
      [r, "That is the remainder, not the rounded quotient.", "这是余数，不是商的近似值。"],
    ],
  );
}

/** remainderReasons says why each answer of a remainder story is wrong, for the kind of story whose answer is right. */
function remainderReasons(use: RemainderUse, q: number, r: number): Record<RemainderUse, Pair> {
  return {
    up:
      use === "drop"
        ? ["Only complete groups count. The last group would not be complete.", "只算完整的组，最后一组凑不满。"]
        : ["The question asks how many are left, not how many groups.", "问题问的是剩下多少，不是有几组。"],
    drop:
      use === "up"
        ? [
            `Then ${r} would be left out. Everything must be included, so one more group is needed.`,
            `那样会有 ${r} 个没地方放。所有的都要包括进去，所以还要再加一组。`,
          ]
        : [`That is the number of full groups, ${q}. The question asks what is left.`, `这是装满的组数 ${q}，问题问的是剩下多少。`],
    remainder: ["The remainder is what is left over, but the question asks how many groups.", "余数是剩下的数，可问题问的是有几组。"],
  };
}

/** remainderCheck checks the answer of a remainder story by multiplying. */
function remainderCheck(use: RemainderUse, n: number, d: number): Pair {
  const q = Math.floor(n / d);
  const r = n % d;
  if (use === "up")
    return [
      `${q} groups hold only $${q} \\times ${d} = ${fmt(q * d)}$, fewer than ${grouped(n)}, while ${q + 1} groups hold $${fmt((q + 1) * d)}$, enough.`,
      `${q} 组只能装 $${q} \\times ${d} = ${fmt(q * d)}$，不到 ${grouped(n)}；${q + 1} 组能装 $${fmt((q + 1) * d)}$，够了。`,
    ];
  if (use === "drop")
    return [
      `${q} groups use $${q} \\times ${d} = ${fmt(q * d)}$, and ${q + 1} groups would need $${fmt((q + 1) * d)}$, more than ${grouped(n)}.`,
      `${q} 组用去 $${q} \\times ${d} = ${fmt(q * d)}$，${q + 1} 组要 $${fmt((q + 1) * d)}$，比 ${grouped(n)} 多。`,
    ];
  return [
    `${q} full groups use $${q} \\times ${d} = ${fmt(q * d)}$, and $${fmt(n)} - ${fmt(q * d)} = ${r}$ are left.`,
    `${q} 个整组用去 $${q} \\times ${d} = ${fmt(q * d)}$，剩下 $${fmt(n)} - ${fmt(q * d)} = ${r}$。`,
  ];
}

/** remainderAnswer says what the remainder means in a story, as a step. */
function remainderAnswer(use: RemainderUse, q: number, r: number): Pair {
  if (use === "up")
    return [
      `Everything must be included, so the ${r} left need one more group: ${q + 1}.`,
      `所有的都要包括进去，剩下的 ${r} 个还要再加一组：${q + 1}。`,
    ];
  if (use === "drop")
    return [`Only complete groups count, so the ${r} left are dropped: ${q}.`, `只算完整的组，剩下的 ${r} 个舍去：${q}。`];
  return [`The question asks how many are left over, which is the remainder: ${r}.`, `问题问剩下多少，就是余数：${r}。`];
}

export const twoDigitByOneDigitDivision = topic(
  "two-digit-by-one-digit-division",
  t("Two-Digit by One-Digit Division", "两位数除以一位数"),
  t(
    "Long division divides one place at a time from the left. For 84 ÷ 3: 8 ÷ 3 gives 2 with 2 left over; bring down the 4 to make 24; 24 ÷ 3 = 8. So 84 ÷ 3 = 28.",
    "竖式除法从高位起逐位去除。计算 84 ÷ 3：8 ÷ 3 商 2 余 2；落下 4，得 24；24 ÷ 3 = 8。所以 84 ÷ 3 = 28。",
  ),
  ["two-digit-by-one-digit-division-using-partial-quotients", "division-with-remainders"],
  ["4.NBT.B.6"],
  [
    point(
      "two-digit-dividends-without-remainders",
      ["Without a remainder", "没有余数"],
      [
        "For $96 \\div 4$, start with the tens: $9 \\div 4$ is 2, and $9 - 8 = 1$ ten is left. Bring down the 6 to make 16. Then $16 \\div 4 = 4$. So $96 \\div 4 = 24$.\n\nCheck: $24 \\times 4 = 80 + 16 = 96$.\n\n> **Watch out.** Do not drop the 1 ten that is left. It joins the 6 to make 16.",
        "计算 $96 \\div 4$，先除十位：$9 \\div 4$ 商 2，$9 - 8 = 1$，剩 1 个十。落下 6 得 16，$16 \\div 4 = 4$。所以 $96 \\div 4 = 24$。\n\n检验：$24 \\times 4 = 80 + 16 = 96$。\n\n> **注意。** 剩下的 1 个十不能丢，它和 6 合成 16。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        return exactQuotient(dividend(rng, d, 2, true), d);
      },
      areaGridFigure(["4"], ["20", "4"], [["80", "16"]]),
    ),
    point(
      "two-digit-dividends-with-remainders",
      ["With a remainder", "有余数"],
      [
        "For $79 \\div 3$: $7 \\div 3$ is 2, and 1 ten is left. Bring down the 9 to make 19. Then $19 \\div 3$ is 6, and $19 - 18 = 1$ is left. So $79 \\div 3 = 26 \\text{ R } 1$.\n\nCheck: $26 \\times 3 + 1 = 78 + 1 = 79$.\n\n> **Watch out.** The remainder must be less than 3. If it is 3 or more, the quotient is too small.",
        "计算 $79 \\div 3$：$7 \\div 3$ 商 2，剩 1 个十。落下 9 得 19，$19 \\div 3$ 商 6，$19 - 18 = 1$。所以 $79 \\div 3 = 26 \\cdots\\cdots 1$。\n\n检验：$26 \\times 3 + 1 = 78 + 1 = 79$。\n\n> **注意。** 余数一定比 3 小。如果余数是 3 或更大，说明商小了。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        return remainderQuotient(rng, dividend(rng, d, 2, false), d);
      },
      remainderTape(79, 26),
    ),
  ],
  t(
    "Mr. Lee shares 84 crayons among 3 tables. First each table gets 2 tens, and 2 tens are left. Those 20 and the 4 ones make 24, so each table gets 8 more. That is 28 crayons each.\n\nCheck: $28 \\times 3 = 60 + 24 = 84$.\n\nIn this lesson we divide two-digit numbers by one-digit numbers, one place at a time.",
    "李老师把 84 支蜡笔平均分给 3 张桌子。先每张分 2 个十，还剩 2 个十。这 20 和 4 个一合成 24，每张再分 8 支。所以每张桌子 28 支。\n\n检验：$28 \\times 3 = 60 + 24 = 84$。\n\n本课我们一位一位地计算两位数除以一位数。",
  ),
);

export const threeDigitByOneDigitDivision = topic(
  "three-digit-by-one-digit-division",
  t("Three-Digit by One-Digit Division", "三位数除以一位数"),
  t(
    "Long division of a three-digit number starts with the hundreds, or with the first two digits if the hundreds digit is smaller than the divisor. When a part is too small to divide, the quotient gets a 0 in that place: 624 ÷ 6 = 104.",
    "三位数除以一位数，从百位除起；如果百位上的数比除数小，就从前两位除起。某一步不够除时，要在商的这一位上写 0：624 ÷ 6 = 104。",
  ),
  ["two-digit-by-one-digit-division"],
  ["4.NBT.B.6"],
  [
    point(
      "three-digit-dividends-without-remainders",
      ["Without a remainder", "没有余数"],
      [
        "For $728 \\div 7$: $7 \\div 7$ is 1. Next, $2 \\div 7$ is 0, so write 0 in the tens place. Bring down the 8 to make 28, and $28 \\div 7 = 4$. So $728 \\div 7 = 104$.\n\nCheck: $104 \\times 7 = 700 + 28 = 728$.\n\n> **Watch out.** Do not skip the 0. The answer 14 is far too small, since $14 \\times 7 = 98$.",
        "计算 $728 \\div 7$：$7 \\div 7$ 商 1。再看 2，$2 \\div 7$ 不够商 1，十位写 0。落下 8 得 28，$28 \\div 7 = 4$。所以 $728 \\div 7 = 104$。\n\n检验：$104 \\times 7 = 700 + 28 = 728$。\n\n> **注意。** 不要漏写 0。14 太小了，因为 $14 \\times 7 = 98$。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        return exactQuotient(dividend(rng, d, 3, true), d);
      },
      areaGridFigure(["7"], ["100", "4"], [["700", "28"]]),
    ),
    point(
      "three-digit-dividends-with-remainders",
      ["With a remainder", "有余数"],
      [
        "For $457 \\div 6$: 4 is less than 6, so start with 45. $45 \\div 6$ is 7, and $45 - 42 = 3$. Bring down the 7 to make 37. $37 \\div 6$ is 6, and $37 - 36 = 1$. So $457 \\div 6 = 76 \\text{ R } 1$.\n\nCheck: $76 \\times 6 + 1 = 456 + 1 = 457$.\n\n> **Watch out.** The quotient has no hundreds digit here, because 4 hundreds cannot be shared by 6.",
        "计算 $457 \\div 6$：4 比 6 小，先看 45。$45 \\div 6$ 商 7，$45 - 42 = 3$。落下 7 得 37，$37 \\div 6$ 商 6，$37 - 36 = 1$。所以 $457 \\div 6 = 76 \\cdots\\cdots 1$。\n\n检验：$76 \\times 6 + 1 = 456 + 1 = 457$。\n\n> **注意。** 这里商没有百位，因为 4 个百不够分成 6 份。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        return remainderQuotient(rng, dividend(rng, d, 3, false), d);
      },
      areaGridFigure(["6"], ["70", "6"], [["420", "36"]]),
    ),
  ],
  t(
    "A farm packs 624 eggs into 6 crates. Six hundreds shared by 6 is 1 hundred each. The 2 tens cannot go to 6 crates, so write 0 tens. Then 24 ones shared by 6 is 4 each. Each crate gets 104 eggs.\n\nCheck: $104 \\times 6 = 600 + 24 = 624$.\n\nIn this lesson we divide three-digit numbers by one-digit numbers.",
    "农场把 624 个鸡蛋平均装进 6 个箱子。6 个百平均分成 6 份，每份 1 个百。2 个十不够分给 6 个箱子，十位写 0。再把 24 个一分成 6 份，每份 4 个。所以每箱 104 个。\n\n检验：$104 \\times 6 = 600 + 24 = 624$。\n\n本课我们计算三位数除以一位数。",
  ),
);

export const fourDigitByOneDigitDivision = topic(
  "four-digit-by-one-digit-division",
  t("Four-Digit by One-Digit Division", "四位数除以一位数"),
  t(
    "Four-digit dividends are divided the same way, place by place from the left, bringing down one digit at a time: 5,736 ÷ 8 = 717.",
    "四位数除以一位数也一样，从高位起逐位去除，每次落下一位数字：5,736 ÷ 8 = 717。",
  ),
  ["three-digit-by-one-digit-division"],
  ["4.NBT.B.6"],
  [
    point(
      "four-digit-dividends-without-remainders",
      ["Without a remainder", "没有余数"],
      [
        "For $4{,}235 \\div 5$: 4 is less than 5, so start with 42. $42 \\div 5$ is 8, and 2 is left. Bring down 3: $23 \\div 5$ is 4, and 3 is left. Bring down 5: $35 \\div 5 = 7$. So $4{,}235 \\div 5 = 847$.\n\nCheck: $847 \\times 5 = 4{,}000 + 200 + 35 = 4{,}235$.\n\n> **Watch out.** The quotient starts in the hundreds place. It has three digits, not four.",
        "计算 $4{,}235 \\div 5$：4 比 5 小，先看 42。$42 \\div 5$ 商 8，余 2。落下 3，$23 \\div 5$ 商 4，余 3。落下 5，$35 \\div 5 = 7$。所以 $4{,}235 \\div 5 = 847$。\n\n检验：$847 \\times 5 = 4{,}000 + 200 + 35 = 4{,}235$。\n\n> **注意。** 商从百位开始，是三位数，不是四位数。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        return exactQuotient(dividend(rng, d, 4, true), d);
      },
      areaGridFigure(["5"], ["800", "40", "7"], [["4,000", "200", "35"]]),
    ),
    point(
      "four-digit-dividends-with-remainders",
      ["With a remainder", "有余数"],
      [
        "For $6{,}053 \\div 4$: $6 \\div 4$ is 1, and 2 is left. Bring down 0: $20 \\div 4 = 5$. Bring down 5: $5 \\div 4$ is 1, and 1 is left. Bring down 3: $13 \\div 4$ is 3, and 1 is left. So $6{,}053 \\div 4 = 1{,}513 \\text{ R } 1$.\n\nCheck: $1{,}513 \\times 4 + 1 = 6{,}052 + 1 = 6{,}053$.\n\n> **Watch out.** Bring down every digit, even the 0 in 6,053. Each one gives a digit of the quotient.",
        "计算 $6{,}053 \\div 4$：$6 \\div 4$ 商 1，余 2。落下 0，$20 \\div 4 = 5$。落下 5，$5 \\div 4$ 商 1，余 1。落下 3，$13 \\div 4$ 商 3，余 1。所以 $6{,}053 \\div 4 = 1{,}513 \\cdots\\cdots 1$。\n\n检验：$1{,}513 \\times 4 + 1 = 6{,}052 + 1 = 6{,}053$。\n\n> **注意。** 每一位都要落下，6,053 里的 0 也一样。每落下一位，商就多一位。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        return remainderQuotient(rng, dividend(rng, d, 4, false), d);
      },
      areaGridFigure(["4"], ["1,000", "500", "10", "3"], [["4,000", "2,000", "40", "12"]]),
    ),
  ],
  t(
    "A library puts 5,736 books on 8 floors, the same number on each floor. $57 \\div 8$ is 7 with 1 left. $13 \\div 8$ is 1 with 5 left. $56 \\div 8 = 7$. So each floor has 717 books.\n\nCheck: $717 \\times 8 = 5{,}600 + 136 = 5{,}736$.\n\nIn this lesson we divide four-digit numbers by one-digit numbers.",
    "图书馆把 5,736 本书平均放在 8 层楼。$57 \\div 8$ 商 7 余 1，$13 \\div 8$ 商 1 余 5，$56 \\div 8 = 7$。所以每层 717 本。\n\n检验：$717 \\times 8 = 5{,}600 + 136 = 5{,}736$。\n\n本课我们计算四位数除以一位数。",
  ),
);

/** gcdOf is the greatest common divisor of two whole numbers. */
const gcdOf = (a: number, b: number): number => (b === 0 ? a : gcdOf(b, a % b));

/** mixedTex writes a/b as a mixed number in LaTeX. */
const mixedTex = (a: number, b: number) => `${Math.floor(a / b) || ""}\\frac{${a % b}}{${b}}`;

export const usingFractionsToRepresentDivisionOfWholeNumbers = topic(
  "using-fractions-to-represent-division-of-whole-numbers",
  t("Using Fractions to Represent Division of Whole Numbers", "用分数表示整数除法"),
  t(
    "A division of whole numbers can be written as a fraction: a ÷ b = a/b. When a is greater than b, the fraction is improper and can be written as a mixed number: 17 ÷ 5 = 17/5 = 3 2/5. The whole number is the quotient and the remainder gives the numerator.",
    "整数除法可以写成分数：a ÷ b = a/b。当 a 大于 b 时，这个分数是假分数，可以写成带分数：17 ÷ 5 = 17/5 = 3 2/5。整数部分是商，余数是分子。",
  ),
  ["interpreting-division-problems-as-mixed-numbers"],
  ["5.NF.B.3"],
  [
    point(
      "quotients-as-mixed-numbers",
      ["Writing a quotient as a mixed number", "把商写成带分数"],
      [
        "$23 \\div 4 = \\frac{23}{4}$. Four fits into 23 five times, because $4 \\times 5 = 20$, and 3 is left. So $23 \\div 4 = 5\\frac{3}{4}$.\n\nCheck: $5\\frac{3}{4} = \\frac{20}{4} + \\frac{3}{4} = \\frac{23}{4}$.\n\n> **Watch out.** The divisor 4 is the denominator. Do not write $\\frac{4}{23}$.",
        "$23 \\div 4 = \\frac{23}{4}$。23 里有 5 个 4，因为 $4 \\times 5 = 20$，还剩 3。所以 $23 \\div 4 = 5\\frac{3}{4}$。\n\n检验：$5\\frac{3}{4} = \\frac{20}{4} + \\frac{3}{4} = \\frac{23}{4}$。\n\n> **注意。** 除数 4 是分母，不要写成 $\\frac{4}{23}$。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        do {
          b = rng.int(2, 12);
          a = rng.int(b + 1, 9 * b);
        } while (a % b === 0 || gcdOf(a % b, b) !== 1);
        const q = Math.floor(a / b);
        const r = a % b;
        return answered(
          [`Write $${a} \\div ${b}$ as a mixed number.`, `把 $${a} \\div ${b}$ 写成带分数。`],
          Q.of(a, b),
          [
            [
              ["Find the wholes", "求整数部分"],
              [
                `There are ${q} groups of ${b} in ${a}, because $${b} \\times ${q} = ${b * q}$.`,
                `${a} 里有 ${q} 个 ${b}，因为 $${b} \\times ${q} = ${b * q}$。`,
              ],
            ],
            [
              ["Find the part left", "求剩下的部分"],
              [`The part left is $${a} - ${b * q} = ${r}$, out of ${b}.`, `剩下 $${a} - ${b * q} = ${r}$，以 ${b} 为分母。`],
              [`${a} \\div ${b} = ${mixedTex(a, b)}`],
            ],
          ],
          [
            `Turn it back into a fraction: $${q} \\times ${b} + ${r} = ${a}$, so $${mixedTex(a, b)} = ${fracTex(a, b)}$.`,
            `化回分数：$${q} \\times ${b} + ${r} = ${a}$，所以 $${mixedTex(a, b)} = ${fracTex(a, b)}$。`,
          ],
          [
            [
              Q.of(b, a),
              `That divides the other way, ${b} by ${a}. The divisor ${b} is the denominator.`,
              `这是反过来用 ${b} 除以 ${a}。除数 ${b} 应该是分母。`,
            ],
            [q, "That drops the part left over.", "这是丢掉了剩下的部分。"],
            ...(b < 10
              ? ([
                  [
                    Q.of(q * 10 + r, 10),
                    `That writes the remainder as tenths. The ${r} left is out of ${b}, not out of 10.`,
                    `这是把余数当成了十分之几。剩下的 ${r} 是以 ${b} 为分母，不是 10。`,
                  ],
                ] as const)
              : []),
          ],
          { form: "mixed" },
        );
      },
      lineFigure({ lo: 0, hi: 6, step: 0.25, labels: [0, 1, 2, 3, 4, 5, 6], marks: [{ at: 5.75, result: true }] }, [
        "A number line from 0 to 6 in quarters with a point at 23 quarters.",
        "一条从 0 到 6、每格四分之一的数轴，在第 23 格处画点。",
      ]),
    ),
    point(
      "fair-shares-as-fractions-or-mixed-numbers",
      ["Fair shares", "平均分"],
      [
        "Four friends share 7 pizzas equally. Each gets $7 \\div 4 = \\frac{7}{4} = 1\\frac{3}{4}$ pizzas.\n\nCheck: 4 shares of $1\\frac{3}{4}$ make $4 + \\frac{12}{4} = 4 + 3 = 7$ pizzas.\n\n> **Watch out.** Divide what is shared by the number of people. $\\frac{4}{7}$ would be 7 people sharing 4 pizzas.",
        "四个朋友平分 7 个比萨饼，每人得到 $7 \\div 4 = \\frac{7}{4} = 1\\frac{3}{4}$ 个。\n\n检验：4 份 $1\\frac{3}{4}$ 合起来是 $4 + \\frac{12}{4} = 4 + 3 = 7$ 个。\n\n> **注意。** 要用被分的总量除以人数。$\\frac{4}{7}$ 是 7 个人分 4 个比萨饼的结果。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        do {
          b = rng.int(2, 10);
          a = rng.int(1, 4 * b);
        } while (a % b === 0 || gcdOf(a, b) !== 1);
        const name = rng.pick(names);
        const item = rng.pick([
          { en: "pizzas", zh: "个比萨饼" },
          { en: "pounds of rice", zh: "磅大米" },
          { en: "liters of juice", zh: "升果汁" },
          { en: "yards of ribbon", zh: "码丝带" },
        ]);
        const q = Math.floor(a / b);
        const answerTex = a > b ? `${fracTex(a, b)} = ${mixedTex(a, b)}` : fracTex(a, b);
        return answered(
          [
            `${name} shares ${a} ${item.en} equally among ${b} people. How much does each person get?`,
            `${name} 把 ${a} ${item.zh}平均分给 ${b} 个人，每人分得多少？`,
          ],
          Q.of(a, b),
          [
            [
              ["Write the division", "写出除法"],
              [`Share ${a} among ${b} people, so divide ${a} by ${b}.`, `把 ${a} 平均分给 ${b} 个人，就用 ${a} 除以 ${b}。`],
            ],
            [
              ["Write it as a fraction", "写成分数"],
              a > b
                ? [`The quotient is a fraction, and it is more than 1 whole.`, "商可以写成分数，而且比 1 大。"]
                : [
                    `The quotient is a fraction, less than 1 whole, since there are fewer than ${b}.`,
                    `商可以写成分数。总量比 ${b} 少，所以每人不到 1。`,
                  ],
              [`${a} \\div ${b} = ${answerTex}`],
            ],
          ],
          [
            `Put the ${b} shares back together: $${b} \\times ${fracTex(a, b)} = ${fracTex(a * b, b)} = ${a}$.`,
            `把 ${b} 份合起来：$${b} \\times ${fracTex(a, b)} = ${fracTex(a * b, b)} = ${a}$。`,
          ],
          [
            [
              Q.of(b, a),
              `That divides the other way. That would be ${a} people sharing ${b}.`,
              `这是除反了，那是 ${a} 个人分 ${b} 的结果。`,
            ],
            ...(a > b ? ([[q, "That drops the part left over.", "这是丢掉了剩下的部分。"]] as const) : []),
            [
              Q.of(1, b),
              `That is one part out of ${b}. There are ${a} to share, so each gets ${a} such parts.`,
              `这只是 $${fracTex(1, b)}$。一共要分 ${a}，每人应得 ${a} 个这样的一份。`,
            ],
          ],
          { form: "mixed", figure: equalTape(b, "?", String(a)) },
        );
      },
      equalTape(4, "?", "7"),
    ),
  ],
  t(
    "Three friends share 2 sandwiches. Cut each sandwich into 3 equal parts. Each friend gets one part of each sandwich, so 2 thirds: $2 \\div 3 = \\frac{2}{3}$.\n\nCheck: 3 friends with $\\frac{2}{3}$ each have $\\frac{6}{3} = 2$ sandwiches.\n\nIn this lesson we write a division as a fraction or a mixed number.",
    "三个朋友平分 2 个三明治。把每个三明治切成 3 等份，每人从每个三明治各拿 1 份，一共 2 个三分之一：$2 \\div 3 = \\frac{2}{3}$。\n\n检验：3 个人每人 $\\frac{2}{3}$，合起来是 $\\frac{6}{3} = 2$ 个三明治。\n\n本课我们把除法写成分数或带分数。",
  ),
);

export const dividingNumbersByOneDigitNumbersWithRounding = topic(
  "dividing-numbers-by-one-digit-numbers-with-rounding",
  t("Dividing Numbers by One-Digit Numbers With Rounding", "除以一位数并取近似值"),
  t(
    "To round a quotient to the nearest whole number, compare the remainder with half the divisor. If the remainder is less than half the divisor, round down to the quotient; if it is more, round up. For 47 ÷ 6 = 7 R 5: 5 is more than 3, so 47 ÷ 6 ≈ 8.",
    "把商四舍五入到整数时，用余数与除数的一半比较：余数小于除数的一半，就取商；大于一半，就把商加 1。47 ÷ 6 = 7……5：5 大于 3，所以 47 ÷ 6 ≈ 8。",
  ),
  ["three-digit-by-one-digit-division"],
  ["4.NBT.B.6"],
  [
    point(
      "rounding-a-quotient-to-a-whole-number",
      ["Rounding a quotient", "商取整数近似值"],
      [
        "$250 \\div 7 = 35 \\text{ R } 5$. Half of 7 is $3\\frac{1}{2}$, and the remainder 5 is more than that. So the quotient is closer to 36: $250 \\div 7 \\approx 36$.\n\nCheck: $36 \\times 7 = 252$ is 2 away from 250, and $35 \\times 7 = 245$ is 5 away.\n\n> **Watch out.** The answer is the rounded quotient, 36. It is not the remainder 5.",
        "$250 \\div 7 = 35 \\cdots\\cdots 5$。7 的一半是 $3\\frac{1}{2}$，余数 5 比它大，所以商更接近 36：$250 \\div 7 \\approx 36$。\n\n检验：$36 \\times 7 = 252$，和 250 差 2；$35 \\times 7 = 245$，差 5。\n\n> **注意。** 答案是商的近似值 36，不是余数 5。",
      ],
      (rng) => {
        let n: number;
        let d: number;
        do {
          d = rng.int(3, 9);
          n = rng.int(30, 999);
        } while (n % d === 0 || 2 * (n % d) === d);
        return roundedQuotient(n, d);
      },
      lineFigure({ lo: 35, hi: 36, step: 1 / 7, labels: [35, 36], marks: [{ at: 35 + 5 / 7, result: true }] }, [
        "A number line from 35 to 36 in sevenths with a point 5 sevenths past 35.",
        "一条从 35 到 36、每格七分之一的数轴，在 35 右边第 5 格处画点。",
      ]),
    ),
    point(
      "rounded-quotients-in-word-problems",
      ["Word problems", "应用题"],
      [
        "A 130-gram bag of nuts is split evenly into 3 jars. $130 \\div 3 = 43 \\text{ R } 1$. The 1 left is less than half of 3, so each jar holds about 43 grams.\n\nCheck: $43 \\times 3 = 129$ is only 1 gram from 130.\n\n> **Watch out.** Divide first, then round. Rounding 130 to 100 first gives a much worse answer.",
        "一袋 130 克的坚果平均装进 3 个罐子。$130 \\div 3 = 43 \\cdots\\cdots 1$。剩下的 1 比 3 的一半小，所以每罐约 43 克。\n\n检验：$43 \\times 3 = 129$，和 130 只差 1 克。\n\n> **注意。** 先除，再取近似值。先把 130 看成 100 会差得很远。",
      ],
      (rng) => {
        let n: number;
        let d: number;
        do {
          d = rng.int(3, 9);
          n = rng.int(40, 900);
        } while (n % d === 0 || 2 * (n % d) === d);
        const s = rng.pick([
          {
            en: `A cyclist rides ${n} kilometers in ${d} days, the same distance each day. About how many kilometers is that each day, to the nearest kilometer?`,
            zh: `一位骑行者 ${d} 天骑了 ${n} 千米，每天骑的路程相同。每天大约骑多少千米（四舍五入到整千米）？`,
          },
          {
            en: `A ${n}-gram bag of flour is split evenly into ${d} jars. About how many grams go into each jar, to the nearest gram?`,
            zh: `一袋 ${n} 克的面粉平均装进 ${d} 个罐子。每个罐子大约装多少克（四舍五入到整克）？`,
          },
          {
            en: `A ${n}-minute movie marathon has ${d} movies of equal length. About how long is each movie, to the nearest minute?`,
            zh: `一场 ${n} 分钟的电影马拉松放映 ${d} 部同样长的电影。每部电影大约多少分钟（四舍五入到整分钟）？`,
          },
        ]);
        return roundedQuotient(n, d, [s.en, s.zh]);
      },
      lineFigure({ lo: 43, hi: 44, step: 1 / 3, labels: [43, 44], marks: [{ at: 43 + 1 / 3, result: true }] }, [
        "A number line from 43 to 44 in thirds with a point 1 third past 43.",
        "一条从 43 到 44、每格三分之一的数轴，在 43 右边第 1 格处画点。",
      ]),
    ),
  ],
  t(
    "A 95-kilometer bike trip takes 4 days. $95 \\div 4 = 23 \\text{ R } 3$. The 3 left is more than half of 4, so each day is about 24 kilometers.\n\nCheck: $24 \\times 4 = 96$ is only 1 away from 95, but $23 \\times 4 = 92$ is 3 away.\n\nIn this lesson we round a quotient to the nearest whole number.",
    "一段 95 千米的骑行用了 4 天。$95 \\div 4 = 23 \\cdots\\cdots 3$。剩下的 3 比 4 的一半大，所以每天约骑 24 千米。\n\n检验：$24 \\times 4 = 96$，和 95 只差 1；$23 \\times 4 = 92$，差 3。\n\n本课我们把商四舍五入到整数。",
  ),
);

/** RemainderUse says what a remainder means in a word problem. */
type RemainderUse = "up" | "drop" | "remainder";

/** RemainderStory is a division word problem whose answer depends on the remainder. */
interface RemainderStory {
  readonly use: RemainderUse;
  readonly en: (n: number, d: number) => string;
  readonly zh: (n: number, d: number) => string;
}

const remainderStories: readonly RemainderStory[] = [
  {
    use: "up",
    en: (n, d) => `${plain(n)} students go on a trip in vans that seat ${d} each. How many vans are needed?`,
    zh: (n, d) => `${plain(n)} 名学生乘面包车出游，每辆车坐 ${d} 人。需要多少辆车？`,
  },
  {
    use: "up",
    en: (n, d) => `${plain(n)} books are packed in boxes that hold ${d} books each. How many boxes are needed for all the books?`,
    zh: (n, d) => `把 ${plain(n)} 本书装箱，每箱装 ${d} 本。装下所有的书需要多少个箱子？`,
  },
  {
    use: "drop",
    en: (n, d) => `A baker has ${plain(n)} eggs. Each cake needs ${d} eggs. How many cakes can the baker make?`,
    zh: (n, d) => `面包师有 ${plain(n)} 个鸡蛋，每个蛋糕要用 ${d} 个。最多能做多少个蛋糕？`,
  },
  {
    use: "drop",
    en: (n, d) => `A ribbon is ${plain(n)} inches long. How many ${d}-inch pieces can be cut from it?`,
    zh: (n, d) => `一根丝带长 ${plain(n)} 英寸。最多能剪成多少段 ${d} 英寸长的丝带？`,
  },
  {
    use: "remainder",
    en: (n, d) => `${plain(n)} stickers are shared equally among ${d} children, as many as possible each. How many stickers are left over?`,
    zh: (n, d) => `把 ${plain(n)} 张贴纸尽量多地平均分给 ${d} 个孩子。还剩多少张？`,
  },
  {
    use: "remainder",
    en: (n, d) => `${plain(n)} marbles are put into bags of ${d}. How many marbles are left out of the full bags?`,
    zh: (n, d) => `把 ${plain(n)} 颗弹珠装袋，每袋 ${d} 颗。装满袋子后还剩多少颗？`,
  },
];

export const dividingNumbersByOneDigitNumbersInterpretingTheRemainder = topic(
  "dividing-numbers-by-one-digit-numbers-interpreting-the-remainder",
  t("Dividing Numbers by One-Digit Numbers: Interpreting the Remainder", "除以一位数：理解余数"),
  t(
    "In a word problem the remainder must be interpreted. If everything must be included, round the quotient up (130 students in vans of 8 need 17 vans). If only complete groups count, drop the remainder (130 eggs make 16 boxes of 8). Sometimes the remainder itself is the answer (2 eggs are left over).",
    "在应用题中要根据情境理解余数。如果所有的都要包含进去，商要加 1（130 名学生坐每辆 8 人的车需要 17 辆）；如果只算完整的组，就舍去余数（130 个鸡蛋可以装满 16 盒，每盒 8 个）；有时余数本身就是答案（剩下 2 个鸡蛋）。",
  ),
  ["four-digit-by-one-digit-division", "interpreting-remainders-in-context"],
  ["4.OA.A.3"],
  [
    point(
      "deciding-what-to-do-with-the-remainder",
      ["Deciding what to do with the remainder", "决定怎样处理余数"],
      [
        'Read the question before you use the remainder. In $26 \\div 8 = 3 \\text{ R } 2$, "How many vans are needed?" means round up to 4. "How many full vans?" means drop the remainder: 3. "How many students are left?" means the remainder: 2.\n\nCheck: picture the vans. With 3 vans, 2 students would still be waiting.\n\n> **Watch out.** Do not always drop the remainder. For vans, the students left still need a seat.',
        '用余数之前先读问题。在 $26 \\div 8 = 3 \\cdots\\cdots 2$ 中，"需要几辆车"要把商加 1，得 4；"能坐满几辆车"要舍去余数，得 3；"剩下几名学生"就是余数 2。\n\n检验：想一想车的情形。只有 3 辆车，还有 2 名学生在等。\n\n> **注意。** 不要总是舍去余数。坐车时，剩下的学生也要有座位。',
      ],
      (rng) => {
        const s = rng.pick(remainderStories);
        const d = rng.int(3, 9);
        const n = dividend(rng, d, 3, false);
        const q = Math.floor(n / d);
        const r = n % d;
        const options: Record<RemainderUse, Pair> = {
          up: [`Round up: ${q + 1}`, `商加 1：${q + 1}`],
          drop: [`Drop the remainder: ${q}`, `舍去余数：${q}`],
          remainder: [`Use the remainder: ${r}`, `取余数：${r}`],
        };
        const why = remainderReasons(s.use, q, r);
        const others = (["up", "drop", "remainder"] as const).filter((u) => u !== s.use);
        const [en, zh] = quotientPair(n, d);
        return picked(
          rng,
          [`${s.en(n, d)} Since $${en}$, what is the answer?`, `${s.zh(n, d)}因为 $${zh}$，答案是什么？`],
          options[s.use],
          others.map((u) => [options[u], why[u][0], why[u][1]] as const),
          [
            [
              ["Divide", "做除法"],
              [`The division gives ${q} full groups of ${d} and ${r} left over.`, `除法得到 ${q} 个整组 ${d}，还剩 ${r}。`],
            ],
            [["Read the question", "读问题"], remainderAnswer(s.use, q, r)],
          ],
          remainderCheck(s.use, n, d),
        );
      },
      tapeFigure(
        [
          {
            total: "26",
            pieces: [
              { size: 8, text: "8" },
              { size: 8, text: "8" },
              { size: 8, text: "8" },
              { size: 2, text: "2", lit: true },
            ],
          },
        ],
        ["A bar of 26 cut into three pieces of 8 and a shaded piece of 2.", "一个长 26 的长条，分成三段 8 和涂色的一段 2。"],
      ),
    ),
    point(
      "solving-remainder-word-problems",
      ["Solving the problem", "解答应用题"],
      [
        "A baker has 50 eggs, and each cake needs 6. $50 \\div 6 = 8 \\text{ R } 2$. The 2 eggs left cannot make a cake, so the baker makes 8 cakes.\n\nCheck: 8 cakes use 48 eggs, and 9 cakes would need 54.\n\n> **Watch out.** Do not round up here. A 9th cake would need more eggs than the baker has.",
        "面包师有 50 个鸡蛋，每个蛋糕要 6 个。$50 \\div 6 = 8 \\cdots\\cdots 2$。剩下的 2 个鸡蛋做不成一个蛋糕，所以能做 8 个。\n\n检验：8 个蛋糕用 48 个鸡蛋，9 个要 54 个。\n\n> **注意。** 这里不能把商加 1。做第 9 个蛋糕的鸡蛋不够。",
      ],
      (rng) => {
        const s = rng.pick(remainderStories);
        const d = rng.int(3, 9);
        const n = dividend(rng, d, rng.int(3, 4), false);
        const q = Math.floor(n / d);
        const r = n % d;
        const values: Record<RemainderUse, number> = { up: q + 1, drop: q, remainder: r };
        const why = remainderReasons(s.use, q, r);
        const [en, zh] = quotientPair(n, d);
        return answered(
          [s.en(n, d), s.zh(n, d)],
          values[s.use],
          [
            [
              ["Divide", "做除法"],
              [`Long division gives $${en}$.`, `用竖式计算：$${zh}$。`],
            ],
            [["Read the question", "读问题"], remainderAnswer(s.use, q, r)],
          ],
          remainderCheck(s.use, n, d),
          (["up", "drop", "remainder"] as const).filter((u) => u !== s.use).map((u) => [values[u], why[u][0], why[u][1]] as const),
        );
      },
      remainderTape(50, 6),
    ),
  ],
  t(
    "26 students ride in vans that hold 8 each. $26 \\div 8 = 3 \\text{ R } 2$. Three vans leave 2 students behind, so the class needs 4 vans.\n\nCheck: 4 vans hold 32, enough for 26, but 3 vans hold only 24.\n\nIn this lesson we decide what a remainder means in a story.",
    "26 名学生坐面包车，每辆坐 8 人。$26 \\div 8 = 3 \\cdots\\cdots 2$。3 辆车还剩 2 名学生没座位，所以要 4 辆车。\n\n检验：4 辆车能坐 32 人，够 26 人坐；3 辆车只能坐 24 人。\n\n本课我们根据故事决定怎样处理余数。",
  ),
);

export const dividingByTwoDigitNumbersByConnectingMultiplicationAndDivision = topic(
  "dividing-by-two-digit-numbers-by-connecting-multiplication-and-division",
  t("Dividing by Two-Digit Numbers by Connecting Multiplication and Division", "用乘除关系除以两位数"),
  t(
    "Division undoes multiplication: since 23 × 4 = 92, 92 ÷ 23 = 4. To divide by a two-digit number, find the multiple of the divisor that equals the dividend, estimating with rounded numbers first: 216 ÷ 27 is about 210 ÷ 30 = 7, and 27 × 8 = 216, so 216 ÷ 27 = 8.",
    "除法是乘法的逆运算：因为 23 × 4 = 92，所以 92 ÷ 23 = 4。除以两位数时，先用近似数估商，再找除数的哪个倍数等于被除数：216 ÷ 27 大约是 210 ÷ 30 = 7，而 27 × 8 = 216，所以 216 ÷ 27 = 8。",
  ),
  ["two-digit-by-two-digit-multiplication", "relationship-between-multiplication-and-division"],
  ["5.NBT.B.6"],
  [
    point(
      "using-a-multiplication-fact",
      ["Using a multiplication fact", "利用乘法算式"],
      [
        "From $36 \\times 8 = 288$ we get two divisions: $288 \\div 36 = 8$ and $288 \\div 8 = 36$.\n\nCheck: 8 groups of 36 make 288, so 288 shared into 8 groups gives 36 each.\n\n> **Watch out.** The quotient is the other factor. It is not the product 288.",
        "由 $36 \\times 8 = 288$ 可以得到两个除法：$288 \\div 36 = 8$，$288 \\div 8 = 36$。\n\n检验：8 个 36 是 288，所以把 288 平均分成 8 份，每份 36。\n\n> **注意。** 商是另一个因数，不是积 288。",
      ],
      (rng) => {
        const d = rng.int(11, 99);
        const q = rng.int(2, 9);
        const flip = rng.bool();
        const by = flip ? q : d;
        const ans = flip ? d : q;
        const P = d * q;
        return answered(
          [
            `Use $${d} \\times ${q} = ${fmt(P)}$ to find $${fmt(P)} \\div ${by}$.`,
            `利用 $${d} \\times ${q} = ${fmt(P)}$，求 $${fmt(P)} \\div ${by}$。`,
          ],
          ans,
          [
            [
              ["Find the factors", "找因数"],
              [`In the fact, ${grouped(P)} is the product of ${d} and ${q}.`, `在这个乘法算式中，${grouped(P)} 是 ${d} 和 ${q} 的积。`],
            ],
            [
              ["Undo it", "倒过来想"],
              [`Dividing by one factor gives the other factor.`, "积除以一个因数，得到另一个因数。"],
              [`${fmt(P)} \\div ${by} = ${ans}`],
            ],
          ],
          [`Multiply back: $${ans} \\times ${by} = ${fmt(P)}$.`, `乘回去验算：$${ans} \\times ${by} = ${fmt(P)}$。`],
          [
            [by, "That is the number you divide by. The quotient is the other factor.", "这是除数，商应该是另一个因数。"],
            [P, "That is the product from the fact. Divide it, do not copy it.", "这是乘法算式里的积，要除，不是照抄。"],
            [
              ans + 1,
              `Check it: $${ans + 1} \\times ${by} = ${fmt((ans + 1) * by)}$, not ${grouped(P)}.`,
              `验算：$${ans + 1} \\times ${by} = ${fmt((ans + 1) * by)}$，不是 ${grouped(P)}。`,
            ],
          ],
          { figure: equalTape(q, String(d), grouped(P)) },
        );
      },
      equalTape(8, "36", "288"),
    ),
    point(
      "finding-a-one-digit-quotient",
      ["Finding a one-digit quotient", "求一位数的商"],
      [
        "For $312 \\div 52$, think of 52 as about 50. Since $300 \\div 50 = 6$, try 6: $52 \\times 6 = 312$. So the quotient is 6.\n\nCheck: $50 \\times 6 + 2 \\times 6 = 300 + 12 = 312$.\n\n> **Watch out.** An estimate is only a first try. Multiply to test it before you write it.",
        "计算 $312 \\div 52$，把 52 看成 50。因为 $300 \\div 50 = 6$，试商 6：$52 \\times 6 = 312$。所以商是 6。\n\n检验：$50 \\times 6 + 2 \\times 6 = 300 + 12 = 312$。\n\n> **注意。** 估出来的商只是试一试，要先乘一乘再写。",
      ],
      (rng) => {
        const d = rng.int(1, 9) * 10 + rng.int(1, 9);
        const q = rng.int(3, 9);
        const P = d * q;
        const tens = d - (d % 10);
        return answered(
          [`Find $${fmt(P)} \\div ${d}$.`, `计算 $${fmt(P)} \\div ${d}$。`],
          q,
          [
            [
              ["Try multiples", "试乘"],
              [`Multiply ${d} by small numbers until you reach ${grouped(P)}.`, `用 ${d} 去乘几个小的数，直到得到 ${grouped(P)}。`],
              [`${d} \\times ${q - 1} = ${fmt(d * (q - 1))}`, `${d} \\times ${q} = ${fmt(P)}`],
            ],
            [
              ["Read the quotient", "读出商"],
              [
                `Exactly ${q} groups of ${d} make ${grouped(P)}, so the quotient is ${q}.`,
                `正好 ${q} 个 ${d} 是 ${grouped(P)}，所以商是 ${q}。`,
              ],
            ],
          ],
          [
            `Split the divisor: $${tens} \\times ${q} + ${d % 10} \\times ${q} = ${tens * q} + ${(d % 10) * q} = ${fmt(P)}$.`,
            `把除数拆开：$${tens} \\times ${q} + ${d % 10} \\times ${q} = ${tens * q} + ${(d % 10) * q} = ${fmt(P)}$。`,
          ],
          [
            [
              q + 1,
              `That is too big: $${d} \\times ${q + 1} = ${fmt(d * (q + 1))}$, more than ${grouped(P)}.`,
              `大了：$${d} \\times ${q + 1} = ${fmt(d * (q + 1))}$，比 ${grouped(P)} 大。`,
            ],
            [
              q - 1,
              `That is too small: $${d} \\times ${q - 1} = ${fmt(d * (q - 1))}$, and one more ${d} still fits.`,
              `小了：$${d} \\times ${q - 1} = ${fmt(d * (q - 1))}$，还能再放一个 ${d}。`,
            ],
            [
              q * 10,
              `That is 10 times too big: $${d} \\times ${q * 10} = ${fmt(P * 10)}$.`,
              `大了 10 倍：$${d} \\times ${q * 10} = ${fmt(P * 10)}$。`,
            ],
          ],
        );
      },
      equalTape(6, "52", "312"),
    ),
  ],
  t(
    "A box holds 24 markers. How many boxes hold 168 markers? We know $24 \\times 7 = 168$, so $168 \\div 24 = 7$ boxes.\n\nCheck: $20 \\times 7 + 4 \\times 7 = 140 + 28 = 168$.\n\nIn this lesson we divide by two-digit numbers using multiplication.",
    "一盒装 24 支马克笔。168 支要装几盒？因为 $24 \\times 7 = 168$，所以 $168 \\div 24 = 7$ 盒。\n\n检验：$20 \\times 7 + 4 \\times 7 = 140 + 28 = 168$。\n\n本课我们用乘法来做除以两位数的除法。",
  ),
);

export const dividingByTwoDigitNumbersWithRemaindersByConnectingMultiplicationAndDivision = topic(
  "dividing-by-two-digit-numbers-with-remainders-by-connecting-multiplication-and-division",
  t("Dividing by Two-Digit Numbers With Remainders by Connecting Multiplication and Division", "用乘除关系做有余数的除以两位数"),
  t(
    "To divide 250 by 34, find the greatest multiple of 34 that is at most 250: 34 × 7 = 238 fits and 34 × 8 = 272 does not. So the quotient is 7 and the remainder is 250 − 238 = 12: 250 ÷ 34 = 7 R 12.",
    "计算 250 ÷ 34，先找不超过 250 的 34 的最大倍数：34 × 7 = 238 不超过，34 × 8 = 272 超过了。所以商是 7，余数是 250 − 238 = 12：250 ÷ 34 = 7……12。",
  ),
  ["dividing-by-two-digit-numbers-by-connecting-multiplication-and-division"],
  ["5.NBT.B.6"],
  [
    point(
      "greatest-multiple-that-fits",
      ["The greatest multiple that fits", "不超过被除数的最大倍数"],
      [
        "The greatest multiple of 23 up to 150: $23 \\times 6 = 138$ and $23 \\times 7 = 161$. 161 is more than 150, so the answer is 138.\n\nCheck: $150 - 138 = 12$, which is less than 23, so no more 23 fits.\n\n> **Watch out.** The multiple must not go past 150. 161 is the nearest multiple, but it is too big.",
        "不超过 150 的 23 的最大倍数：$23 \\times 6 = 138$，$23 \\times 7 = 161$。161 比 150 大，所以答案是 138。\n\n检验：$150 - 138 = 12$，比 23 小，再也放不下一个 23。\n\n> **注意。** 倍数不能超过 150。161 虽然离得近，但太大了。",
      ],
      (rng) => {
        const d = rng.int(12, 98);
        const q = rng.int(2, 9);
        const n = d * q + rng.int(1, d - 1);
        return answered(
          [
            `What is the greatest multiple of ${d} that is less than or equal to ${grouped(n)}?`,
            `不超过 ${grouped(n)} 的 ${d} 的最大倍数是多少？`,
          ],
          d * q,
          [
            [
              ["Try multiples", "试乘"],
              [`Multiply ${d} by small numbers.`, `用 ${d} 去乘几个小的数。`],
              [`${d} \\times ${q} = ${fmt(d * q)}`, `${d} \\times ${q + 1} = ${fmt(d * (q + 1))}`],
            ],
            [
              ["Pick the greatest that fits", "取不超过的最大倍数"],
              [
                `The multiple ${grouped(d * (q + 1))} is more than ${grouped(n)}, so the answer is ${grouped(d * q)}.`,
                `${grouped(d * (q + 1))} 比 ${grouped(n)} 大，所以答案是 ${grouped(d * q)}。`,
              ],
            ],
          ],
          [
            `What is left, $${fmt(n)} - ${fmt(d * q)} = ${n - d * q}$, is less than ${d}, so no more ${d} fits.`,
            `剩下 $${fmt(n)} - ${fmt(d * q)} = ${n - d * q}$，比 ${d} 小，再也放不下一个 ${d}。`,
          ],
          [
            [d * (q + 1), `That is more than ${grouped(n)}.`, `这比 ${grouped(n)} 大。`],
            [q, `That is how many ${d}s fit, not the multiple itself.`, `这是能放几个 ${d}，不是倍数本身。`],
            [d * (q - 1), `A bigger multiple, ${grouped(d * q)}, still fits.`, `更大的倍数 ${grouped(d * q)} 也不超过。`],
          ],
        );
      },
      lineFigure(
        {
          lo: 115,
          hi: 161,
          step: 23,
          labels: [115, 138, 161],
          marks: [
            { at: 138, result: true },
            { at: 150, text: "150" },
          ],
        },
        [
          "A number line with the multiples 115, 138 and 161 of 23, and 150 between 138 and 161.",
          "一条数轴，标出 23 的倍数 115、138、161，150 在 138 和 161 之间。",
        ],
      ),
    ),
    point(
      "quotient-and-remainder-for-two-digit-divisors",
      ["The quotient and the remainder", "商和余数"],
      [
        "For $200 \\div 32$: $32 \\times 6 = 192$ and $32 \\times 7 = 224$. So the quotient is 6, and $200 - 192 = 8$ is left: $200 \\div 32 = 6 \\text{ R } 8$.\n\nCheck: $6 \\times 32 + 8 = 192 + 8 = 200$.\n\n> **Watch out.** The remainder must be less than 32. If it is not, the quotient is too small.",
        "计算 $200 \\div 32$：$32 \\times 6 = 192$，$32 \\times 7 = 224$。所以商是 6，还剩 $200 - 192 = 8$：$200 \\div 32 = 6 \\cdots\\cdots 8$。\n\n检验：$6 \\times 32 + 8 = 192 + 8 = 200$。\n\n> **注意。** 余数一定比 32 小。如果不是，说明商小了。",
      ],
      (rng) => {
        const d = rng.int(12, 98);
        const q = rng.int(2, 9);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return remainderQuotient(rng, n, d, [
          [
            ["Try multiples", "试乘"],
            [`Find the greatest multiple of ${d} that fits in ${grouped(n)}.`, `找出不超过 ${grouped(n)} 的 ${d} 的最大倍数。`],
            [`${d} \\times ${q} = ${fmt(d * q)}`, `${d} \\times ${q + 1} = ${fmt(d * (q + 1))}`],
          ],
          [
            ["Find what is left", "求剩下的数"],
            [
              `The quotient is ${q}, and $${fmt(n)} - ${fmt(d * q)} = ${r}$ is left, less than ${d}.`,
              `商是 ${q}，剩下 $${fmt(n)} - ${fmt(d * q)} = ${r}$，比 ${d} 小。`,
            ],
          ],
        ]);
      },
      remainderTape(200, 32),
    ),
  ],
  t(
    "A coach puts 100 balls into bags of 15. $15 \\times 6 = 90$ fits, but $15 \\times 7 = 105$ is too many. So 6 bags are full and 10 balls are left: $100 \\div 15 = 6 \\text{ R } 10$.\n\nCheck: $6 \\times 15 + 10 = 90 + 10 = 100$.\n\nIn this lesson we divide by two-digit numbers when something is left over.",
    "教练把 100 个球装进袋子，每袋 15 个。$15 \\times 6 = 90$ 装得下，$15 \\times 7 = 105$ 就太多了。所以装满 6 袋，还剩 10 个：$100 \\div 15 = 6 \\cdots\\cdots 10$。\n\n检验：$6 \\times 15 + 10 = 90 + 10 = 100$。\n\n本课我们计算有余数的除以两位数。",
  ),
);

/** chunksOf lists partial quotients of n ÷ d taken by place value: 7,412 ÷ 34 → [200, 10, 8]. */
function chunksOf(n: number, d: number): number[] {
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

export const multiDigitByTwoDigitDivisionUsingPartialQuotients = topic(
  "multi-digit-by-two-digit-division-using-partial-quotients",
  t("Multi-Digit by Two-Digit Division Using Partial Quotients", "用部分商做多位数除以两位数"),
  t(
    "With partial quotients, subtract easy multiples of the divisor until what is left is less than the divisor: for 7,412 ÷ 34, subtract 34 × 200 = 6,800, then 34 × 10 = 340, then 34 × 8 = 272. The quotient is 200 + 10 + 8 = 218, and nothing is left.",
    "用部分商的方法，依次减去除数的容易计算的倍数，直到剩下的数小于除数：计算 7,412 ÷ 34，先减去 34 × 200 = 6,800，再减去 34 × 10 = 340，最后减去 34 × 8 = 272。商是 200 + 10 + 8 = 218，没有余数。",
  ),
  [
    "dividing-by-two-digit-numbers-with-remainders-by-connecting-multiplication-and-division",
    "multi-digit-by-one-digit-division-using-partial-quotients",
  ],
  ["5.NBT.B.6"],
  [
    point(
      "partial-quotients-without-remainders",
      ["Without a remainder", "没有余数"],
      [
        "For $1{,}035 \\div 23$, take away easy groups of 23. Forty groups use 920, leaving 115. Five groups use 115, leaving 0. The quotient is $40 + 5 = 45$.\n\nCheck: $45 \\times 23 = 900 + 135 = 1{,}035$.\n\n> **Watch out.** Add the partial quotients 40 and 5. Do not add the amounts 920 and 115.",
        "计算 $1{,}035 \\div 23$，减去好算的若干个 23。40 个 23 是 920，剩 115；5 个 23 是 115，剩 0。商是 $40 + 5 = 45$。\n\n检验：$45 \\times 23 = 900 + 135 = 1{,}035$。\n\n> **注意。** 要把部分商 40 和 5 相加，不是把 920 和 115 相加。",
      ],
      (rng) => {
        const d = rng.int(11, 45);
        const n = d * rng.int(12, 250);
        return exactQuotient(n, d, partialWalk(n, d), [
          `Use partial quotients to find $${fmt(n)} \\div ${d}$.`,
          `用部分商的方法计算 $${fmt(n)} \\div ${d}$。`,
        ]);
      },
      areaGridFigure(["23"], ["40", "5"], [["920", "115"]], [1], [8, 3]),
    ),
    point(
      "partial-quotients-with-remainders",
      ["With a remainder", "有余数"],
      [
        "For $1{,}000 \\div 32$: thirty groups use 960, leaving 40. One more group uses 32, leaving 8. Eight is less than 32, so stop. The quotient is $30 + 1 = 31$ and the remainder is 8.\n\nCheck: $31 \\times 32 + 8 = 992 + 8 = 1{,}000$.\n\n> **Watch out.** Stop only when less than 32 is left. That last amount is the remainder.",
        "计算 $1{,}000 \\div 32$：30 个 32 是 960，剩 40；再减 1 个 32，剩 8。8 比 32 小，停下来。商是 $30 + 1 = 31$，余数是 8。\n\n检验：$31 \\times 32 + 8 = 992 + 8 = 1{,}000$。\n\n> **注意。** 剩下的比 32 小时才停下，最后剩下的就是余数。",
      ],
      (rng) => {
        const d = rng.int(11, 45);
        const q = rng.int(12, 250);
        const n = d * q + rng.int(1, d - 1);
        return remainderQuotient(rng, n, d, partialWalk(n, d), [
          `Use partial quotients to find $${fmt(n)} \\div ${d}$.`,
          `用部分商的方法计算 $${fmt(n)} \\div ${d}$。`,
        ]);
      },
      areaGridFigure(["32"], ["30", "1"], [["960", "32"]], [1], [5, 2]),
    ),
  ],
  t(
    "A theater sells 4,416 tickets for 24 shows, the same number for each show. Take away 100 groups of 24, then 80 groups, then 4 groups. That is $100 + 80 + 4 = 184$ tickets for each show.\n\nCheck: $184 \\times 24 = 3{,}680 + 736 = 4{,}416$.\n\nIn this lesson we divide by two-digit numbers with partial quotients.",
    "剧院为 24 场演出卖出 4,416 张票，每场一样多。先减去 100 个 24，再减去 80 个 24，最后减去 4 个 24，所以每场 $100 + 80 + 4 = 184$ 张。\n\n检验：$184 \\times 24 = 3{,}680 + 736 = 4{,}416$。\n\n本课我们用部分商计算除以两位数。",
  ),
);

export const threeDigitByTwoDigitDivision = topic(
  "three-digit-by-two-digit-division",
  t("Three-Digit by Two-Digit Division", "三位数除以两位数"),
  t(
    "Long division by a two-digit number works like division by a one-digit number, but each quotient digit is found by estimating: for 851 ÷ 37, 85 ÷ 37 is about 2 (37 × 2 = 74, 85 − 74 = 11); bring down the 1 to make 111; 111 ÷ 37 = 3. So 851 ÷ 37 = 23.",
    "除以两位数的竖式除法和除以一位数的方法相同，只是每一位商都要先估算：计算 851 ÷ 37，85 ÷ 37 约商 2（37 × 2 = 74，85 − 74 = 11）；落下 1 得 111；111 ÷ 37 = 3。所以 851 ÷ 37 = 23。",
  ),
  ["multi-digit-by-two-digit-division-using-partial-quotients", "three-digit-by-one-digit-division"],
  ["5.NBT.B.6"],
  [
    point(
      "three-digit-by-two-digit-without-remainders",
      ["Without a remainder", "没有余数"],
      [
        "For $864 \\div 32$: 8 is less than 32, so start with 86. $86 \\div 32$ is 2, and $86 - 64 = 22$. Bring down the 4 to make 224. $224 \\div 32 = 7$. So $864 \\div 32 = 27$.\n\nCheck: $27 \\times 32 = 640 + 224 = 864$.\n\n> **Watch out.** The quotient starts in the tens place, above the 6. It has two digits.",
        "计算 $864 \\div 32$：8 比 32 小，先看 86。$86 \\div 32$ 商 2，$86 - 64 = 22$。落下 4 得 224，$224 \\div 32 = 7$。所以 $864 \\div 32 = 27$。\n\n检验：$27 \\times 32 = 640 + 224 = 864$。\n\n> **注意。** 商从十位开始写，在 6 的上面，是两位数。",
      ],
      (rng) => {
        const d = rng.int(11, 99);
        return exactQuotient(dividend(rng, d, 3, true), d);
      },
      areaGridFigure(["32"], ["20", "7"], [["640", "224"]]),
    ),
    point(
      "three-digit-by-two-digit-with-remainders",
      ["With a remainder", "有余数"],
      [
        "For $745 \\div 28$: start with 74. $74 \\div 28$ is 2, and $74 - 56 = 18$. Bring down the 5 to make 185. $185 \\div 28$ is 6, and $185 - 168 = 17$. So $745 \\div 28 = 26 \\text{ R } 17$.\n\nCheck: $26 \\times 28 + 17 = 728 + 17 = 745$.\n\n> **Watch out.** If a step leaves 28 or more, the quotient digit is too small. Try one more.",
        "计算 $745 \\div 28$：先看 74。$74 \\div 28$ 商 2，$74 - 56 = 18$。落下 5 得 185，$185 \\div 28$ 商 6，$185 - 168 = 17$。所以 $745 \\div 28 = 26 \\cdots\\cdots 17$。\n\n检验：$26 \\times 28 + 17 = 728 + 17 = 745$。\n\n> **注意。** 如果某一步剩下的不比 28 小，说明这一位商小了，要再加 1。",
      ],
      (rng) => {
        const d = rng.int(11, 99);
        return remainderQuotient(rng, dividend(rng, d, 3, false), d);
      },
      areaGridFigure(["28"], ["20", "6"], [["560", "168"]]),
    ),
  ],
  t(
    "A baker puts 672 rolls into bags of 21. $67 \\div 21$ is 3 with 4 left. Bring down the 2 to make 42, and $42 \\div 21 = 2$. So there are 32 bags.\n\nCheck: $32 \\times 21 = 630 + 42 = 672$.\n\nIn this lesson we divide three-digit numbers by two-digit numbers.",
    "面包师把 672 个面包装袋，每袋 21 个。$67 \\div 21$ 商 3 余 4，落下 2 得 42，$42 \\div 21 = 2$。所以一共 32 袋。\n\n检验：$32 \\times 21 = 630 + 42 = 672$。\n\n本课我们计算三位数除以两位数。",
  ),
);

export const fourDigitByTwoDigitDivision = topic(
  "four-digit-by-two-digit-division",
  t("Four-Digit by Two-Digit Division", "四位数除以两位数"),
  t(
    "Four-digit dividends are divided by two-digit numbers place by place, estimating each quotient digit and bringing down one digit at a time: 9,483 ÷ 29 = 327.",
    "四位数除以两位数，同样逐位去除，每一位商都先估算，每次落下一位数字：9,483 ÷ 29 = 327。",
  ),
  ["three-digit-by-two-digit-division", "four-digit-by-one-digit-division"],
  ["5.NBT.B.6"],
  [
    point(
      "four-digit-by-two-digit-without-remainders",
      ["Without a remainder", "没有余数"],
      [
        "For $3{,}672 \\div 17$: $36 \\div 17$ is 2, and 2 is left. Bring down 7: $27 \\div 17$ is 1, and 10 is left. Bring down 2: $102 \\div 17 = 6$. So $3{,}672 \\div 17 = 216$.\n\nCheck: $216 \\times 17 = 2{,}160 + 1{,}512 = 3{,}672$.\n\n> **Watch out.** Write a quotient digit each time you bring down a digit, even when it is 0.",
        "计算 $3{,}672 \\div 17$：$36 \\div 17$ 商 2，余 2。落下 7，$27 \\div 17$ 商 1，余 10。落下 2，$102 \\div 17 = 6$。所以 $3{,}672 \\div 17 = 216$。\n\n检验：$216 \\times 17 = 2{,}160 + 1{,}512 = 3{,}672$。\n\n> **注意。** 每落下一位，就要写一位商，商是 0 也要写。",
      ],
      (rng) => {
        const d = rng.int(11, 99);
        return exactQuotient(dividend(rng, d, 4, true), d);
      },
      areaGridFigure(["17"], ["200", "10", "6"], [["3,400", "170", "102"]]),
    ),
    point(
      "four-digit-by-two-digit-with-remainders",
      ["With a remainder", "有余数"],
      [
        "For $7{,}250 \\div 24$: $72 \\div 24 = 3$, and nothing is left. Bring down 5: 5 is less than 24, so write 0. Bring down 0: $50 \\div 24$ is 2, and 2 is left. So $7{,}250 \\div 24 = 302 \\text{ R } 2$.\n\nCheck: $302 \\times 24 + 2 = 7{,}248 + 2 = 7{,}250$.\n\n> **Watch out.** Do not skip the 0. Writing 32 R 2 is far too small, since $32 \\times 24$ is only 768.",
        "计算 $7{,}250 \\div 24$：$72 \\div 24 = 3$，没有剩余。落下 5，5 比 24 小，商写 0。落下 0，$50 \\div 24$ 商 2，余 2。所以 $7{,}250 \\div 24 = 302 \\cdots\\cdots 2$。\n\n检验：$302 \\times 24 + 2 = 7{,}248 + 2 = 7{,}250$。\n\n> **注意。** 不要漏写 0。写成 32 余 2 就太小了，因为 $32 \\times 24$ 只有 768。",
      ],
      (rng) => {
        const d = rng.int(11, 99);
        return remainderQuotient(rng, dividend(rng, d, 4, false), d);
      },
      areaGridFigure(["24"], ["300", "2"], [["7,200", "48"]], [1], [5, 1]),
    ),
  ],
  t(
    "A company packs 5,658 cans into cartons of 23. $56 \\div 23$ is 2 with 10 left. $105 \\div 23$ is 4 with 13 left. $138 \\div 23 = 6$. So there are 246 cartons.\n\nCheck: $246 \\times 23 = 4{,}920 + 738 = 5{,}658$.\n\nIn this lesson we divide four-digit numbers by two-digit numbers.",
    "一家公司把 5,658 罐饮料装箱，每箱 23 罐。$56 \\div 23$ 商 2 余 10，$105 \\div 23$ 商 4 余 13，$138 \\div 23 = 6$。所以一共 246 箱。\n\n检验：$246 \\times 23 = 4{,}920 + 738 = 5{,}658$。\n\n本课我们计算四位数除以两位数。",
  ),
);

/** grade5WholeNumberTopics lists the 5th grade topics on whole number expressions, negative numbers, multiplication and division. */
export const grade5WholeNumberTopics: readonly TopicDef[] = [
  evaluatingWholeNumberExpressions,
  evaluatingWholeNumberExpressionsWithParentheses,
  creatingAndInterpretingWholeNumberExpressions,
  creatingWholeNumberExpressionsFromTerminology,
  additiveComparisonsOfWholeNumberExpressions,
  multiplicativeComparisonsOfWholeNumberExpressions,
  negativeNumbers,
  comparingNegativeNumbers,
  multiplyingNumbersByPowersOfTenUsingPlaceValue,
  twoDigitByOneDigitMultiplication,
  threeAndFourDigitByOneDigitMultiplication,
  fiveAndSixDigitByOneDigitMultiplication,
  twoDigitByTwoDigitMultiplication,
  multiDigitByTwoDigitMultiplication,
  threeDigitByThreeDigitMultiplication,
  twoDigitByOneDigitDivision,
  threeDigitByOneDigitDivision,
  fourDigitByOneDigitDivision,
  usingFractionsToRepresentDivisionOfWholeNumbers,
  dividingNumbersByOneDigitNumbersWithRounding,
  dividingNumbersByOneDigitNumbersInterpretingTheRemainder,
  dividingByTwoDigitNumbersByConnectingMultiplicationAndDivision,
  dividingByTwoDigitNumbersWithRemaindersByConnectingMultiplicationAndDivision,
  multiDigitByTwoDigitDivisionUsingPartialQuotients,
  threeDigitByTwoDigitDivision,
  fourDigitByTwoDigitDivision,
];

/** whereTheParenthesesGo asks which placement of parentheses gives a value. */
export const whereTheParenthesesGo = point(
  "where-the-parentheses-go",
  ["Where the parentheses go", "括号放在哪里"],
  [
    "Which has the value 35, $(2 + 5) \\times 5$ or $2 + 5 \\times 5$? Work out each one. $(2 + 5) \\times 5 = 7 \\times 5 = 35$, but $2 + 5 \\times 5 = 2 + 25 = 27$. So it is the first.\n\nCheck: $2 \\times 5 + 5 \\times 5 = 10 + 25 = 35$.\n\n> **Watch out.** Both have the same numbers. Only the parentheses tell you which step comes first.",
    "$(2 + 5) \\times 5$ 和 $2 + 5 \\times 5$，哪个的值是 35？每个都算一算。$(2 + 5) \\times 5 = 7 \\times 5 = 35$，而 $2 + 5 \\times 5 = 2 + 25 = 27$。所以是第一个。\n\n检验：$2 \\times 5 + 5 \\times 5 = 10 + 25 = 35$。\n\n> **注意。** 两个算式的数字一样，只有括号决定先算哪一步。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    let c = rng.int(2, 9);
    while (c === b) c = rng.int(2, 9);
    const value = (a + b) * c;
    return pickedMath(
      rng,
      [`Which expression has the value ${value}?`, `哪个算式的值是 ${value}？`],
      `(${a} + ${b}) \\times ${c}`,
      [
        [
          `${a} + (${b} \\times ${c})`,
          `This multiplies first and gives $${a} + ${b * c} = ${a + b * c}$.`,
          `这是先乘，得 $${a} + ${b * c} = ${a + b * c}$。`,
        ],
        [
          `(${a} \\times ${c}) + ${b}`,
          `This multiplies only ${a} and gives $${a * c} + ${b} = ${a * c + b}$.`,
          `这只乘了 ${a}，得 $${a * c} + ${b} = ${a * c + b}$。`,
        ],
        [
          `(${a} + ${c}) \\times ${b}`,
          `This adds ${c}, not ${b}, and gives $${a + c} \\times ${b} = ${(a + c) * b}$.`,
          `这是加 ${c} 而不是加 ${b}，得 $${a + c} \\times ${b} = ${(a + c) * b}$。`,
        ],
      ],
      [
        [
          ["Work out the parentheses", "先算括号"],
          [`The sum in parentheses is ${a + b}.`, `括号里的和是 ${a + b}。`],
          [`${a} + ${b} = ${a + b}`],
        ],
        [["Multiply", "再乘"], ["Then multiply by the number outside.", "再乘括号外的数。"], [`${a + b} \\times ${c} = ${value}`]],
      ],
      [
        `Multiply each part instead: $${a} \\times ${c} + ${b} \\times ${c} = ${a * c} + ${b * c} = ${value}$.`,
        `也可以分别乘：$${a} \\times ${c} + ${b} \\times ${c} = ${a * c} + ${b * c} = ${value}$。`,
      ],
    );
  },
  areaGridFigure(["5"], ["2", "5"], [["10", "25"]], [1], [2, 5]),
);

/** howMuchParenthesesChange asks how much greater a sum in parentheses times a number is than the same numbers without them. */
export const howMuchParenthesesChange = point(
  "how-much-parentheses-change-a-value",
  ["How much parentheses change a value", "括号使结果改变多少"],
  [
    "$(2 + 6) \\times 4 = 32$ and $2 + 6 \\times 4 = 26$. The parentheses make it $32 - 26 = 6$ greater.\n\nCheck: with the parentheses the 2 is multiplied by 4 too. It counts 4 times instead of once, which is 3 more twos, and $3 \\times 2 = 6$.\n\n> **Watch out.** Find both values before you subtract. Do not just subtract the numbers you see.",
    "$(2 + 6) \\times 4 = 32$，$2 + 6 \\times 4 = 26$。加上括号后大了 $32 - 26 = 6$。\n\n检验：加上括号后，2 也乘了 4。它从算 1 次变成算 4 次，多了 3 个 2，$3 \\times 2 = 6$。\n\n> **注意。** 先算出两个值，再相减。不要直接用看到的数相减。",
  ],
  (rng) => {
    const a = rng.int(2, 20);
    const b = rng.int(2, 15);
    const c = rng.int(2, 12);
    const loose = a + b * c;
    const tight = (a + b) * c;
    return answered(
      [
        `How much greater is $(${a} + ${b}) \\times ${c}$ than $${a} + ${b} \\times ${c}$?`,
        `$(${a} + ${b}) \\times ${c}$ 比 $${a} + ${b} \\times ${c}$ 大多少？`,
      ],
      tight - loose,
      [
        [
          ["Find both values", "算出两个值"],
          ["Work out each expression.", "分别计算两个算式。"],
          [`(${a} + ${b}) \\times ${c} = ${a + b} \\times ${c} = ${tight}`, `${a} + ${b} \\times ${c} = ${a} + ${b * c} = ${loose}`],
        ],
        [["Subtract", "相减"], ["Then find the difference.", "再求差。"], [`${tight} - ${loose} = ${tight - loose}`]],
      ],
      [
        `With the parentheses ${a} is multiplied by ${c} too, so it counts ${c - 1} more times: $${c - 1} \\times ${a} = ${tight - loose}$.`,
        `加上括号后 ${a} 也乘了 ${c}，多算了 ${c - 1} 次：$${c - 1} \\times ${a} = ${tight - loose}$。`,
      ],
      [
        [tight, "That is the value with parentheses, not how much greater it is.", "这是带括号的算式的值，不是大多少。"],
        [loose, "That is the value without parentheses, not how much greater the other is.", "这是不带括号的算式的值，不是大多少。"],
        [
          a * c,
          `That counts ${a} times ${c}, but ${a} is already counted once without the parentheses.`,
          `这是 ${a} 乘 ${c}，可是不带括号时 ${a} 已经算过一次了。`,
        ],
      ],
    );
  },
  areaGridFigure(["4"], ["2", "6"], [["8", "24"]], [1], [2, 6]),
);

/** anExpressionForAStory asks which expression tells how many remain after equal packs are bought and some are given away. */
export const anExpressionForAStory = point(
  "an-expression-for-a-story",
  ["An expression for a story", "为故事写算式"],
  [
    "Zoe buys 3 packs of 12 pens and gives away 5 pens. All the pens are $3 \\times 12 = 36$. The 5 come off once: $3 \\times 12 - 5 = 31$.\n\nCheck: take the 5 from one pack, leaving 7. Then $12 + 12 + 7 = 31$.\n\n> **Watch out.** $3 \\times (12 - 5)$ takes 5 from every pack. The 5 pens are given away only once.",
    "佐伊买了 3 包笔，每包 12 支，送出 5 支。所有的笔是 $3 \\times 12 = 36$ 支，送出的 5 支只减一次：$3 \\times 12 - 5 = 31$。\n\n检验：从一包里拿走 5 支，这包剩 7 支，$12 + 12 + 7 = 31$。\n\n> **注意。** $3 \\times (12 - 5)$ 是每包都拿走 5 支。可是 5 支笔只送出了一次。",
  ],
  (rng) => {
    const who = rng.pick(names);
    const p = rng.int(3, 9);
    const n = rng.int(6, 24);
    const g = rng.int(2, n - 1);
    return pickedMath(
      rng,
      [
        `${who} buys ${p} packs of ${n} pens and gives away ${g} pens. Which expression gives the pens that are left?`,
        `${who} 买了 ${p} 包笔，每包 ${n} 支，送出 ${g} 支。哪个算式表示剩下的笔数？`,
      ],
      `${p} \\times ${n} - ${g}`,
      [
        [
          `${p} \\times (${n} - ${g})`,
          `This takes ${g} from every pack. The ${g} pens are given away only once.`,
          `这是每包都拿走 ${g} 支，可是 ${g} 支只送出一次。`,
        ],
        [
          `${p} + ${n} - ${g}`,
          `This adds the packs to the pens. There are ${p} groups of ${n}.`,
          `这是把包数和支数相加了。其实是 ${p} 个 ${n}。`,
        ],
        [`${g} - ${p} \\times ${n}`, `This takes all the pens away from ${g}, the wrong way round.`, `这是用 ${g} 减所有的笔，减反了。`],
      ],
      [
        [
          ["Find all the pens", "求所有的笔"],
          [`There are ${p} packs of ${n}.`, `一共有 ${p} 包，每包 ${n} 支。`],
          [`${p} \\times ${n} = ${p * n}`],
        ],
        [["Give some away", "送出一些"], ["The pens given away come off once.", "送出的笔只减一次。"], [`${p * n} - ${g} = ${p * n - g}`]],
      ],
      [
        `Take the ${g} from one pack, leaving ${n - g}. With the other ${p - 1} packs that is $${(p - 1) * n} + ${n - g} = ${p * n - g}$.`,
        `从一包里拿走 ${g} 支，这包剩 ${n - g} 支。加上另外 ${p - 1} 包：$${(p - 1) * n} + ${n - g} = ${p * n - g}$。`,
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "3 × 12",
        pieces: [
          { size: 12, text: "12" },
          { size: 12, text: "12" },
          { size: 7, text: "7" },
          { size: 5, text: "5", lit: true, dashed: true },
        ],
      },
    ],
    ["Three packs of 12 in a row; 5 at the end of the last pack are given away.", "三包各 12 支排成一行，最后一包末尾的 5 支被送出。"],
  ),
);

/** theWordsForAnExpression asks which description in words matches a sum in parentheses divided by a number. */
export const theWordsForAnExpression = point(
  "the-words-for-an-expression",
  ["The words for an expression", "算式的文字说法"],
  [
    "$(12 + 8) \\div 4$ is the sum of 12 and 8, divided by 4. The last step is the division, so it is a quotient of a sum.\n\nCheck: $(12 + 8) \\div 4 = 20 \\div 4 = 5$, while $12 + 8 \\div 4 = 14$ is a different number.\n\n> **Watch out.** $12 + 8 \\div 4$ is a sum, not a quotient. Without parentheses only the 8 is divided.",
    "$(12 + 8) \\div 4$ 是 12 与 8 的和除以 4。最后一步是除法，所以它是一个和的商。\n\n检验：$(12 + 8) \\div 4 = 20 \\div 4 = 5$，而 $12 + 8 \\div 4 = 14$，是另一个数。\n\n> **注意。** $12 + 8 \\div 4$ 是和，不是商。没有括号时只有 8 被除。",
  ],
  (rng) => {
    const c = rng.int(2, 9);
    const a = rng.int(10, 90);
    const b = c * rng.int(5, 20) - (a % c);
    return picked(
      rng,
      [`Which description matches $(${a} + ${b}) \\div ${c}$?`, `哪种说法与 $(${a} + ${b}) \\div ${c}$ 相符？`],
      [`the sum of ${a} and ${b}, divided by ${c}`, `${a} 与 ${b} 的和除以 ${c}`],
      [
        [
          [`${a} plus the quotient of ${b} and ${c}`, `${a} 加上 ${b} 除以 ${c} 的商`],
          `That would be $${a} + ${b} \\div ${c}$, with no parentheses.`,
          `那是 $${a} + ${b} \\div ${c}$，没有括号。`,
        ],
        [
          [`the sum of ${a} and ${b}, times ${c}`, `${a} 与 ${b} 的和乘 ${c}`],
          `The last step divides by ${c}. It does not multiply.`,
          `最后一步是除以 ${c}，不是乘。`,
        ],
        [
          [`${c} divided by the sum of ${a} and ${b}`, `${c} 除以 ${a} 与 ${b} 的和`],
          `That would be $${c} \\div (${a} + ${b})$, the wrong way round.`,
          `那是 $${c} \\div (${a} + ${b})$，除反了。`,
        ],
      ],
      [
        [
          ["Look inside the parentheses", "看括号里"],
          [`The parentheses hold the sum of ${a} and ${b}.`, `括号里是 ${a} 与 ${b} 的和。`],
        ],
        [
          ["Find the last step", "找最后一步"],
          [`Then the sum is divided by ${c}.`, `然后用这个和除以 ${c}。`],
        ],
      ],
      [
        `Work it out: $${a + b} \\div ${c} = ${(a + b) / c}$. The quotient comes last, so it names the expression.`,
        `算一算：$${a + b} \\div ${c} = ${(a + b) / c}$。最后算的是商，所以这个算式是一个商。`,
      ],
    );
  },
  equalTape(4, "5", "12 + 8"),
);

/** twoChangesAtOnce asks how much a sum grows when one part rises and the other falls. */
export const twoChangesAtOnce = point(
  "two-changes-at-once",
  ["Two changes at once", "同时有两处变化"],
  [
    "Compare $3{,}040 + 1{,}990$ with $3{,}000 + 2{,}000$. The first number is 40 more. The second is 10 less. So the sum is $40 - 10 = 30$ more.\n\nCheck: $3{,}040 + 1{,}990 = 5{,}030$ and $3{,}000 + 2{,}000 = 5{,}000$. The gap is 30.\n\n> **Watch out.** Do not add the two changes. One goes up and one goes down, so take the smaller from the larger.",
    "比较 $3{,}040 + 1{,}990$ 和 $3{,}000 + 2{,}000$。第一个数多 40，第二个数少 10，所以和多 $40 - 10 = 30$。\n\n检验：$3{,}040 + 1{,}990 = 5{,}030$，$3{,}000 + 2{,}000 = 5{,}000$，相差 30。\n\n> **注意。** 不要把两个变化加起来。一个增加、一个减少，要用大的减小的。",
  ],
  (rng) => {
    const x = rng.int(1000, 4000);
    const y = rng.int(1000, 4000);
    const down = rng.int(5, 90);
    const up = down + rng.int(5, 90);
    return answered(
      [
        `How much greater is $${fmt(x + up)} + ${fmt(y - down)}$ than $${fmt(x)} + ${fmt(y)}$?`,
        `$${fmt(x + up)} + ${fmt(y - down)}$ 比 $${fmt(x)} + ${fmt(y)}$ 大多少？`,
      ],
      up - down,
      [
        [
          ["Compare the first numbers", "比较第一个数"],
          [
            `The first number goes from ${grouped(x)} to ${grouped(x + up)}, up ${up}.`,
            `第一个数从 ${grouped(x)} 变成 ${grouped(x + up)}，增加 ${up}。`,
          ],
        ],
        [
          ["Compare the second numbers", "比较第二个数"],
          [
            `The second goes from ${grouped(y)} to ${grouped(y - down)}, down ${down}.`,
            `第二个数从 ${grouped(y)} 变成 ${grouped(y - down)}，减少 ${down}。`,
          ],
        ],
        [
          ["Put the changes together", "合起来"],
          ["The rise and the fall partly cancel.", "增加和减少会部分抵消。"],
          [`${up} - ${down} = ${up - down}`],
        ],
      ],
      [
        `Add both sums: $${fmt(x + y + up - down)} - ${fmt(x + y)} = ${up - down}$.`,
        `把两个和都算出来：$${fmt(x + y + up - down)} - ${fmt(x + y)} = ${up - down}$。`,
      ],
      [
        [
          up + down,
          "That adds both changes. The second number went down, so take its change away.",
          "这是把两个变化相加了。第二个数是减少的，要减去它的变化。",
        ],
        [up, "That counts only the rise of the first number.", "这只算了第一个数的增加。"],
        [down, "That counts only the fall of the second number.", "这只算了第二个数的减少。"],
      ],
    );
  },
  lineFigure(
    {
      lo: 4980,
      hi: 5050,
      step: 10,
      labels: [5000, 5030],
      marks: [{ at: 5000 }, { at: 5030, result: true }],
      jumps: [
        [5000, 5040],
        [5040, 5030],
      ],
    },
    [
      "A number line from 4,980 to 5,050: a jump up 40 from 5,000, then back 10, ending at 5,030.",
      "一条从 4,980 到 5,050 的数轴：从 5,000 向右跳 40，再向左跳 10，停在 5,030。",
    ],
  ),
);

/** theFactorThatScales asks for the factor that makes a product a given number of times as large. */
export const theFactorThatScales = point(
  "the-factor-that-scales",
  ["The factor that scales", "放大的因数"],
  [
    "$\\square \\times (30 + 5)$ is 3 times as large as $4 \\times (30 + 5)$. Both have the factor $30 + 5$, so the box is $4 \\times 3 = 12$.\n\nCheck: $12 \\div 4 = 3$, so 12 groups is 3 times 4 groups.\n\n> **Watch out.** Do not add. $4 + 3 = 7$ groups is not 3 times 4 groups.",
    "$\\square \\times (30 + 5)$ 是 $4 \\times (30 + 5)$ 的 3 倍。两个都有因数 $30 + 5$，所以方框里是 $4 \\times 3 = 12$。\n\n检验：$12 \\div 4 = 3$，12 个正是 4 个的 3 倍。\n\n> **注意。** 不要用加法。$4 + 3 = 7$ 个不是 4 个的 3 倍。",
  ],
  (rng) => {
    const k = rng.int(2, 12);
    const n = rng.int(2, 9);
    const x = rng.int(100, 400);
    const y = rng.int(10, 90);
    return answered(
      [
        `$\\square \\times (${x} + ${y})$ is ${n} times as large as $${k} \\times (${x} + ${y})$. What number goes in the box?`,
        `$\\square \\times (${x} + ${y})$ 是 $${k} \\times (${x} + ${y})$ 的 ${n} 倍。方框里填几？`,
      ],
      k * n,
      [
        [
          ["Look at the shared factor", "看相同的因数"],
          [`Both have the factor $(${x} + ${y})$, so compare the other factors.`, `两个都有因数 $(${x} + ${y})$，所以只比较另一个因数。`],
        ],
        [
          ["Scale the other factor", "放大另一个因数"],
          [`It must be ${n} times ${k}.`, `它必须是 ${k} 的 ${n} 倍。`],
          [`${k} \\times ${n} = ${k * n}`],
        ],
      ],
      [
        `Divide back: $${k * n} \\div ${k} = ${n}$, so the new product is ${n} times as large.`,
        `除回去：$${k * n} \\div ${k} = ${n}$，新的积正是 ${n} 倍。`,
      ],
      [
        [k + n, `That adds ${n}. ${n} times as large means multiply.`, `这是加 ${n}。${n} 倍要用乘法。`],
        [k, "That is the same as the second product, not larger.", "这和第二个积一样大，没有放大。"],
        [n, `That uses only the ${n}. It must be ${n} times ${k} groups.`, `这只用了 ${n}。要的是 ${k} 个的 ${n} 倍。`],
      ],
    );
  },
  tapeFigure(
    [
      { pieces: Array.from({ length: 12 }, (_, i) => ({ size: 1, text: "35", lit: i < 4 })) },
      { pieces: Array.from({ length: 4 }, () => ({ size: 1, text: "35", lit: true })) },
    ],
    ["Twelve equal parts of 35 above four equal parts of 35.", "上面是 12 个 35，下面是 4 个 35。"],
  ),
);

/** theGapAcrossZero asks how far a temperature falls from above zero to below zero. */
export const theGapAcrossZero = point(
  "the-gap-across-zero",
  ["The gap across zero", "跨过零的差距"],
  [
    "At noon it is 8 degrees. At night it is $-6$ degrees. From 8 down to 0 is 8 degrees, and from 0 down to $-6$ is 6 more. So it drops $8 + 6 = 14$ degrees.\n\nCheck: count up from $-6$. Six degrees reach 0, and 8 more reach 8. That is 14 again.\n\n> **Watch out.** Do not subtract $8 - 6$. The path goes through zero, so add the two distances.",
    "中午气温是 8 度，夜里是 $-6$ 度。从 8 降到 0 是 8 度，从 0 降到 $-6$ 又是 6 度，所以一共下降了 $8 + 6 = 14$ 度。\n\n检验：从 $-6$ 往上数，6 度到 0，再 8 度到 8，又是 14 度。\n\n> **注意。** 不要算 $8 - 6$。要经过 0，所以把两段距离相加。",
  ],
  (rng) => {
    const a = rng.int(2, 15);
    let b = rng.int(2, 15);
    while (b === a) b = rng.int(2, 15);
    return answered(
      [
        `At noon it was ${a} degrees. At night it was $-${b}$ degrees. How many degrees did it drop?`,
        `中午气温是 ${a} 度，夜里是 $-${b}$ 度。气温下降了多少度？`,
      ],
      a + b,
      [
        [
          ["Down to zero", "降到 0"],
          [`From ${a} down to 0 is ${a} degrees.`, `从 ${a} 降到 0 是 ${a} 度。`],
        ],
        [
          ["Below zero", "降到 0 以下"],
          [`From 0 down to $-${b}$ is ${b} more degrees.`, `从 0 降到 $-${b}$ 又是 ${b} 度。`],
        ],
        [["Add", "相加"], ["The path goes through zero, so add the two parts.", "要经过 0，所以把两段相加。"], [`${a} + ${b} = ${a + b}`]],
      ],
      [
        `Count up from $-${b}$: ${b} degrees reach 0, and ${a} more reach ${a}. That is ${a + b} degrees.`,
        `从 $-${b}$ 往上数：${b} 度到 0，再 ${a} 度到 ${a}，一共 ${a + b} 度。`,
      ],
      [
        [
          Math.abs(a - b),
          "That subtracts the distances. The path goes through zero, so add them.",
          "这是把两段距离相减了。要经过 0，所以应该相加。",
        ],
        [a, "That only counts the drop down to zero.", "这只算了降到 0 的那一段。"],
        [b, "That only counts the part below zero.", "这只算了 0 以下的那一段。"],
      ],
      {
        figure: lineFigure(
          {
            lo: -b - 1,
            hi: a + 1,
            step: 1,
            labels: [-b, 0, a],
            label: minus,
            marks: [{ at: a }, { at: -b, result: true }],
            jumps: [
              [a, 0],
              [0, -b],
            ],
          },
          [
            `A number line from ${minus(-b - 1)} to ${a + 1}: a jump from ${a} down to 0, then down to ${minus(-b)}.`,
            `一条从 ${minus(-b - 1)} 到 ${a + 1} 的数轴：从 ${a} 跳到 0，再跳到 ${minus(-b)}。`,
          ],
        ),
      },
    );
  },
  lineFigure(
    {
      lo: -7,
      hi: 9,
      step: 1,
      labels: [-6, 0, 8],
      label: minus,
      marks: [{ at: 8 }, { at: -6, result: true }],
      jumps: [
        [8, 0],
        [0, -6],
      ],
    },
    ["A number line from −7 to 9: a jump from 8 down to 0, then down to −6.", "一条从 −7 到 9 的数轴：从 8 跳到 0，再跳到 −6。"],
  ),
);

/** howFarApartTwoTemperatures asks how much colder one temperature below zero is than another. */
export const howFarApartTwoTemperatures = point(
  "how-far-apart-two-temperatures-are",
  ["How far apart two temperatures are", "两个温度相差多少"],
  [
    "One town is at $-4$ degrees and another at $-11$ degrees. The temperature $-11$ is farther below zero, so that town is colder, by $11 - 4 = 7$ degrees.\n\nCheck: count up from $-11$. Seven steps reach $-4$.\n\n> **Watch out.** Both are below zero, so do not add 4 and 11. Subtract the distances.",
    "一个城镇气温 $-4$ 度，另一个 $-11$ 度。$-11$ 离 0 更远，所以那个城镇更冷，冷 $11 - 4 = 7$ 度。\n\n检验：从 $-11$ 往上数 7 格，正好到 $-4$。\n\n> **注意。** 两个都在 0 以下，不要把 4 和 11 相加，要把两段距离相减。",
  ],
  (rng) => {
    const a = rng.int(2, 20);
    const b = a + rng.int(2, 15);
    return answered(
      [
        `One town is at $-${a}$ degrees and another is at $-${b}$ degrees. How many degrees colder is the colder town?`,
        `一个城镇的气温是 $-${a}$ 度，另一个是 $-${b}$ 度。较冷的城镇冷多少度？`,
      ],
      b - a,
      [
        [
          ["Find the colder one", "找出更冷的"],
          [`The temperature $-${b}$ is farther below zero, so that town is colder.`, `$-${b}$ 离 0 更远，所以那个城镇更冷。`],
        ],
        [
          ["Find the gap", "求相差多少"],
          ["Both are below zero, so subtract the distances.", "两个都在 0 以下，所以把距离相减。"],
          [`${b} - ${a} = ${b - a}`],
        ],
      ],
      [`Count up from $-${b}$: ${b - a} steps bring you to $-${a}$.`, `从 $-${b}$ 往上数 ${b - a} 格，正好到 $-${a}$。`],
      [
        [a + b, "That adds the distances. Both are below zero, so subtract them.", "这是把距离相加了。两个都在 0 以下，应该相减。"],
        [b, "That is how far the colder town is below zero.", "这是更冷的城镇离 0 的距离。"],
        [a, "That is how far the warmer town is below zero.", "这是较暖的城镇离 0 的距离。"],
      ],
      { figure: signedLine([-a, -b]) },
    );
  },
  lineFigure(
    { lo: -12, hi: 1, step: 1, labels: [-11, -4, 0], label: minus, marks: [{ at: -11 }, { at: -4, result: true }], jumps: [[-11, -4]] },
    ["A number line from −12 to 1 with a jump of 7 from −11 up to −4.", "一条从 −12 到 1 的数轴，从 −11 向右跳 7 到 −4。"],
  ),
);

/** zerosAtTheEndOfAProduct asks how many zeros end a number that already ends in zeros times a power of ten. */
export const zerosAtTheEndOfAProduct = point(
  "zeros-at-the-end-of-a-product",
  ["Zeros at the end of a product", "积末尾的零"],
  [
    "$50 \\times 1{,}000$: 50 ends in one zero, and 1,000 has three. So the product ends in $1 + 3 = 4$ zeros. It is $50{,}000$.\n\nCheck: $5 \\times 10{,}000 = 50{,}000$, which has four zeros.\n\n> **Watch out.** Do not forget the zero already in 50. The answer is four zeros, not three.",
    "$50 \\times 1{,}000$：50 末尾有一个 0，1,000 有三个 0，所以积末尾有 $1 + 3 = 4$ 个 0，是 $50{,}000$。\n\n检验：$5 \\times 10{,}000 = 50{,}000$，有四个 0。\n\n> **注意。** 别忘了 50 本身的 0。答案是四个 0，不是三个。",
  ],
  (rng) => {
    let m = rng.int(2, 99);
    while (m % 10 === 0) m = rng.int(2, 99);
    const z = rng.int(1, 2);
    const k = rng.int(1, 3);
    const n = m * 10 ** z;
    const p = 10 ** k;
    return answered(
      [`How many zeros are at the end of $${fmt(n)} \\times ${fmt(p)}$?`, `$${fmt(n)} \\times ${fmt(p)}$ 的积末尾有几个 0？`],
      z + k,
      [
        [
          ["Count the zeros of the number", "数这个数末尾的 0"],
          [`${grouped(n)} ends in ${z} zero${z > 1 ? "s" : ""}.`, `${grouped(n)} 末尾有 ${z} 个 0。`],
        ],
        [
          ["Count the zeros of the power", "数 10 的幂的 0"],
          [`${grouped(p)} has ${k} zero${k > 1 ? "s" : ""}.`, `${grouped(p)} 有 ${k} 个 0。`],
        ],
        [
          ["Add", "相加"],
          ["Both sets of zeros end up at the end of the product.", "这两部分 0 都会出现在积的末尾。"],
          [`${z} + ${k} = ${z + k}`],
        ],
      ],
      [`Write the product: $${fmt(n * p)}$, which ends in ${z + k} zeros.`, `写出积：$${fmt(n * p)}$，末尾有 ${z + k} 个 0。`],
      [
        [
          k,
          "That counts only the zeros of the power of ten. The number already ends in zeros too.",
          "这只数了 10 的幂的 0，这个数本身末尾也有 0。",
        ],
        [z, "That counts only the zeros of the first number.", "这只数了第一个数的 0。"],
        [
          z * k,
          "That multiplies the counts. Each zero moves the digits once, so add them.",
          "这是把个数相乘了。每个 0 都让数字移动一位，所以要相加。",
        ],
      ],
      { figure: digitsChart([n, n * p], 0) },
    );
  },
  digitsChart([50, 50000], 0),
);

/** theMissingDigitOfAFactor asks for a hidden digit of a two-digit factor, found by dividing the product by the other factor. */
export const theMissingDigitOfAFactor = point(
  "the-missing-digit-of-a-factor",
  ["The missing digit of a factor", "因数中缺少的数字"],
  [
    "In $4\\square \\times 6 = 282$, undo the multiplication: $282 \\div 6 = 47$. So the factor is 47, and the missing digit is 7.\n\nCheck: $47 \\times 6 = 240 + 42 = 282$.\n\n> **Watch out.** Do not copy a digit from the product. The 2 at the end of 282 is not the missing digit.",
    "在 $4\\square \\times 6 = 282$ 中，用除法倒推：$282 \\div 6 = 47$。所以这个因数是 47，缺少的数字是 7。\n\n检验：$47 \\times 6 = 240 + 42 = 282$。\n\n> **注意。** 不要照抄积里的数字。282 末尾的 2 不是缺少的数字。",
  ],
  (rng) => {
    const tens = rng.int(1, 9);
    const ones = rng.int(1, 9);
    const n = tens * 10 + ones;
    const a = rng.int(3, 9);
    const P = n * a;
    const hideOnes = rng.bool();
    const shown = hideOnes ? `${tens}\\square` : `\\square ${ones}`;
    const digit = hideOnes ? ones : tens;
    const other = hideOnes ? tens : ones;
    const misses: Miss[] = [[other, "That is the other digit of the factor.", "这是因数的另一个数字。"]];
    if (digit < 9) {
      const m = hideOnes ? n + 1 : n + 10;
      misses.push([
        digit + 1,
        `With ${digit + 1} the factor is ${m}, and $${m} \\times ${a} = ${m * a}$, not ${P}.`,
        `填 ${digit + 1}，因数是 ${m}，$${m} \\times ${a} = ${m * a}$，不是 ${P}。`,
      ]);
    }
    misses.push([P % 10, "That copies the ones digit of the product.", "这是照抄了积的个位。"]);
    return answered(
      [`What digit goes in the box? $$${shown} \\times ${a} = ${fmt(P)}$$`, `方框里填几？$$${shown} \\times ${a} = ${fmt(P)}$$`],
      digit,
      [
        [["Undo the multiplication", "用除法倒推"], [`Divide the product by ${a}.`, `用积除以 ${a}。`], [`${fmt(P)} \\div ${a} = ${n}`]],
        [
          ["Read the digit", "读出数字"],
          [`So the factor is ${n}, and the missing digit is ${digit}.`, `所以因数是 ${n}，缺少的数字是 ${digit}。`],
        ],
      ],
      [
        `Multiply: $${n} \\times ${a} = ${tens * 10 * a} + ${ones * a} = ${fmt(P)}$.`,
        `乘一乘：$${n} \\times ${a} = ${tens * 10 * a} + ${ones * a} = ${fmt(P)}$。`,
      ],
      misses,
      {
        figure: areaGridFigure([String(a)], hideOnes ? [String(tens * 10), "?"] : ["?", String(ones)], [
          hideOnes ? [String(tens * 10 * a), "?"] : ["?", String(ones * a)],
        ]),
      },
    );
  },
  areaGridFigure(["6"], ["40", "7"], [["240", "42"]]),
);

/** theOnesDigitOfAProduct asks for the ones digit of a product, found from the ones digits of the factors. */
export const theOnesDigitOfAProduct = point(
  "the-ones-digit-of-a-product",
  ["The ones digit of a product", "积的个位数字"],
  [
    "The ones digit of $4{,}327 \\times 6$ comes only from $7 \\times 6 = 42$. So the product ends in 2.\n\nCheck: $4{,}327 \\times 6 = 25{,}962$, which ends in 2.\n\n> **Watch out.** The carry 4 goes to the tens place. It is not the ones digit.",
    "$4{,}327 \\times 6$ 的个位只由 $7 \\times 6 = 42$ 决定，所以积的个位是 2。\n\n检验：$4{,}327 \\times 6 = 25{,}962$，个位是 2。\n\n> **注意。** 进位的 4 进到十位，不是个位数字。",
  ],
  (rng) => {
    const n = randomWithDigits(rng, rng.int(3, 4));
    const a = rng.int(3, 9);
    const u = n % 10;
    const lead = Number(String(n)[0]);
    return answered(
      [`What is the ones digit of $${fmt(n)} \\times ${a}$?`, `$${fmt(n)} \\times ${a}$ 的积的个位是几？`],
      (u * a) % 10,
      [
        [
          ["Look at the ones digits", "看个位"],
          [`Only the ones digits ${u} and ${a} reach the ones place.`, `只有个位上的 ${u} 和 ${a} 影响积的个位。`],
          [`${u} \\times ${a} = ${u * a}`],
        ],
        [
          ["Take its ones digit", "取个位"],
          [`The ones digit of ${u * a} is ${(u * a) % 10}.`, `${u * a} 的个位是 ${(u * a) % 10}。`],
        ],
      ],
      [
        `Work out the whole product: $${fmt(n)} \\times ${a} = ${fmt(n * a)}$, which ends in ${(u * a) % 10}.`,
        `算出整个积：$${fmt(n)} \\times ${a} = ${fmt(n * a)}$，个位是 ${(u * a) % 10}。`,
      ],
      [
        [Math.floor((u * a) / 10), "That is the carry, which goes to the tens place.", "这是进位，它进到十位。"],
        [u, "That is the ones digit of the first factor, not of the product.", "这是第一个因数的个位，不是积的个位。"],
        [(lead * a) % 10, "That uses the leading digit, not the ones digit.", "这用的是最高位，不是个位。"],
      ],
    );
  },
  areaGridFigure(["6"], ["4,320", "7"], [["25,920", "42"]]),
);

/** howManyDigitsTheProductHas asks how many digits a product of a long number and a one-digit number has. */
export const howManyDigitsTheProductHas = point(
  "how-many-digits-the-product-has",
  ["How many digits the product has", "积有几位"],
  [
    "How many digits does $3{,}812 \\times 4$ have? The number is between 3,000 and 4,000. Times 4 that is between 12,000 and 16,000. So the product has 5 digits.\n\nCheck: $3{,}812 \\times 4 = 15{,}248$, which has 5 digits.\n\n> **Watch out.** A product can have one more digit than the long factor. Here 4 digits became 5.",
    "$3{,}812 \\times 4$ 的积有几位？这个数在 3,000 和 4,000 之间，乘 4 后在 12,000 和 16,000 之间，所以积是 5 位数。\n\n检验：$3{,}812 \\times 4 = 15{,}248$，是 5 位数。\n\n> **注意。** 积可能比长的那个因数多一位。这里 4 位变成了 5 位。",
  ],
  (rng) => {
    let n: number;
    let a: number;
    let lead: number;
    const d = rng.int(3, 5);
    do {
      n = randomWithDigits(rng, d);
      a = rng.int(2, 9);
      lead = Math.floor(n / 10 ** (d - 1));
    } while (!(lead * a >= 10 || (lead + 1) * a <= 10));
    const lo = lead * 10 ** (d - 1);
    const hi = (lead + 1) * 10 ** (d - 1);
    const count = String(n * a).length;
    return answered(
      [
        `Without working it out, how many digits does $${fmt(n)} \\times ${a}$ have?`,
        `不用算出结果，$${fmt(n)} \\times ${a}$ 的积有几位？`,
      ],
      count,
      [
        [
          ["Look at the leading digit", "看最高位"],
          [
            `The number ${grouped(n)} is between ${grouped(lo)} and ${grouped(hi)}.`,
            `${grouped(n)} 在 ${grouped(lo)} 和 ${grouped(hi)} 之间。`,
          ],
        ],
        [
          ["Multiply the ends", "乘两端"],
          [`Multiply both ends by ${a}.`, `把两端都乘 ${a}。`],
          [`${fmt(lo)} \\times ${a} = ${fmt(lo * a)}`, `${fmt(hi)} \\times ${a} = ${fmt(hi * a)}`],
        ],
        [
          ["Count the digits", "数位数"],
          [`The product is between them, so it has ${count} digits.`, `积在它们之间，所以是 ${count} 位数。`],
        ],
      ],
      [
        `Work it out: $${fmt(n)} \\times ${a} = ${fmt(n * a)}$, which has ${count} digits.`,
        `算一算：$${fmt(n)} \\times ${a} = ${fmt(n * a)}$，是 ${count} 位数。`,
      ],
      [
        count === d
          ? [
              d + 1,
              `That adds a digit, but ${lead} times ${a} with any carry stays under 10.`,
              `这是多了一位，可是 ${lead} 乘 ${a} 加上进位也不满 10。`,
            ]
          : [
              d,
              `That keeps the length of ${grouped(n)}, but ${lead} times ${a} carries into a new place.`,
              `这是和 ${grouped(n)} 一样的位数，可是 ${lead} 乘 ${a} 会进到新的一位。`,
            ],
      ],
    );
  },
  lineFigure(
    { lo: 10000, hi: 18000, step: 1000, labels: [10000, 12000, 16000], marks: [{ at: 12000 }, { at: 16000 }, { at: 15248, result: true }] },
    [
      "A number line from 10,000 to 18,000 with 12,000 and 16,000 marked and the product between them.",
      "一条从 10,000 到 18,000 的数轴，标出 12,000 和 16,000，积在它们之间。",
    ],
  ),
);

/** aNewProductFromAKnownProduct asks for a product one or two groups away from a known product. */
export const aNewProductFromAKnownProduct = point(
  "a-new-product-from-a-known-product",
  ["A new product from a known product", "由已知的积求新的积"],
  [
    "$24 \\times 15 = 360$. Then $24 \\times 16$ is one more group of 24: $360 + 24 = 384$.\n\nCheck: $24 \\times 16 = 24 \\times 10 + 24 \\times 6 = 240 + 144 = 384$.\n\n> **Watch out.** Add a whole group of 24, not just 1. $360 + 1 = 361$ is wrong.",
    "$24 \\times 15 = 360$。那么 $24 \\times 16$ 就是多一个 24：$360 + 24 = 384$。\n\n检验：$24 \\times 16 = 24 \\times 10 + 24 \\times 6 = 240 + 144 = 384$。\n\n> **注意。** 要加一整组 24，而不是加 1。$360 + 1 = 361$ 是错的。",
  ],
  (rng) => {
    const n = rng.int(12, 99);
    const m = rng.int(12, 49);
    const j = rng.pick([1, 2, -1, -2]);
    const P = n * m;
    const k = Math.abs(j);
    const more = j > 0;
    return answered(
      [
        `$${n} \\times ${m} = ${fmt(P)}$. Use this to find $${n} \\times ${m + j}$.`,
        `$${n} \\times ${m} = ${fmt(P)}$。用它求 $${n} \\times ${m + j}$。`,
      ],
      n * (m + j),
      [
        [
          ["Compare the factors", "比较因数"],
          [
            `${m + j} is ${k} ${more ? "more" : "less"} than ${m}, so there ${k === 1 ? "is" : "are"} ${k} ${k === 1 ? "group" : "groups"} of ${n} ${more ? "more" : "fewer"}.`,
            `${m + j} 比 ${m} ${more ? "多" : "少"} ${k}，所以${more ? "多" : "少"} ${k} 个 ${n}。`,
          ],
        ],
        [
          ["Adjust the product", "调整积"],
          [
            `${more ? "Add" : "Take away"} ${k === 1 ? `one group of ${n}` : `$${k} \\times ${n} = ${k * n}$`}.`,
            `${more ? "加上" : "减去"} ${k === 1 ? `一个 ${n}` : `$${k} \\times ${n} = ${k * n}$`}。`,
          ],
          [`${fmt(P)} ${more ? "+" : "-"} ${k * n} = ${fmt(n * (m + j))}`],
        ],
      ],
      [`Multiply directly: $${byPlaces(m + j, n)}$.`, `直接乘：$${byPlaces(m + j, n)}$。`],
      [
        [
          P + j,
          `That ${more ? "adds" : "takes away"} ${k}, not ${k} ${k === 1 ? "group" : "groups"} of ${n}.`,
          `这是${more ? "加" : "减"} ${k}，而不是${more ? "加" : "减"} ${k} 个 ${n}。`,
        ],
        [
          more ? P - k * n : P + k * n,
          `That goes the wrong way. ${m + j} is ${more ? "more" : "less"} than ${m}.`,
          `方向反了。${m + j} 比 ${m} ${more ? "大" : "小"}。`,
        ],
        [P, "That is the known product, unchanged.", "这是已知的积，没有改变。"],
      ],
    );
  },
  areaGridFigure(["24"], ["15", "1"], [["360", "24"]], [1], [4, 1]),
);

/** aProductFromANearbyProduct asks for a product just below a round product, found by taking away a few groups. */
export const aProductFromANearbyProduct = point(
  "a-product-from-a-nearby-product",
  ["A product from a nearby product", "由相近的积求积"],
  [
    "$312 \\times 29$ is one group of 312 less than $312 \\times 30 = 9{,}360$. So it is $9{,}360 - 312 = 9{,}048$.\n\nCheck: $312 \\times 20 + 312 \\times 9 = 6{,}240 + 2{,}808 = 9{,}048$.\n\n> **Watch out.** Take away a whole group of 312, not just 1.",
    "$312 \\times 29$ 比 $312 \\times 30 = 9{,}360$ 少一个 312，所以是 $9{,}360 - 312 = 9{,}048$。\n\n检验：$312 \\times 20 + 312 \\times 9 = 6{,}240 + 2{,}808 = 9{,}048$。\n\n> **注意。** 要减去一整组 312，而不是减 1。",
  ],
  (rng) => {
    const n = rng.int(102, 989);
    const r = rng.int(2, 9) * 10;
    const j = rng.int(1, 2);
    const R = n * r;
    return answered(
      [
        `Find $${n} \\times ${r - j}$ by starting from $${n} \\times ${r} = ${fmt(R)}$.`,
        `从 $${n} \\times ${r} = ${fmt(R)}$ 出发，求 $${n} \\times ${r - j}$。`,
      ],
      n * (r - j),
      [
        [
          ["Start from the round product", "从整十的积出发"],
          [`The round product is ${grouped(R)}.`, `整十的积是 ${grouped(R)}。`],
          [`${n} \\times ${r} = ${fmt(R)}`],
        ],
        [
          ["Take away the extra groups", "减去多的组"],
          [
            `${r - j} is ${j} less than ${r}, so take away ${j === 1 ? `one group of ${n}` : `two groups of ${n}`}.`,
            `${r - j} 比 ${r} 少 ${j}，所以减去 ${j} 个 ${n}。`,
          ],
          [`${fmt(R)} - ${fmt(n * j)} = ${fmt(n * (r - j))}`],
        ],
      ],
      [`Use partial products: $${byPlaces(r - j, n)}$.`, `用部分积：$${byPlaces(r - j, n)}$。`],
      [
        [R - j, `That takes away ${j}, not ${j} ${j === 1 ? "group" : "groups"} of ${n}.`, `这是减 ${j}，而不是减 ${j} 个 ${n}。`],
        [R + n * j, `That adds the groups, but ${r - j} is less than ${r}.`, `这是加上了，可是 ${r - j} 比 ${r} 小。`],
        [R, "That is the round product itself.", "这是整十的积本身。"],
      ],
    );
  },
  areaGridFigure(["312"], ["29", "1"], [["9,048", "312"]], [1], [5, 1]),
);

/** theNumberOfDigitsInAProduct asks how many digits a product of two three-digit numbers has, from the leading digits. */
export const theNumberOfDigitsInAProduct = point(
  "the-number-of-digits-in-a-product",
  ["The number of digits in a product", "积的位数"],
  [
    "$612 \\times 287$ is between $600 \\times 200 = 120{,}000$ and $700 \\times 300 = 210{,}000$. Both have 6 digits, so the product has 6 digits.\n\nCheck: $612 \\times 287 = 175{,}644$, which has 6 digits.\n\n> **Watch out.** Three digits times three digits is not always six digits. $112 \\times 301 = 33{,}712$ has five.",
    "$612 \\times 287$ 在 $600 \\times 200 = 120{,}000$ 和 $700 \\times 300 = 210{,}000$ 之间，两端都是 6 位数，所以积是 6 位数。\n\n检验：$612 \\times 287 = 175{,}644$，是 6 位数。\n\n> **注意。** 三位数乘三位数不一定是六位数。$112 \\times 301 = 33{,}712$ 只有五位。",
  ],
  (rng) => {
    let a: number;
    let b: number;
    let la: number;
    let lb: number;
    do {
      a = rng.int(101, 999);
      b = rng.int(101, 999);
      la = Math.floor(a / 100);
      lb = Math.floor(b / 100);
    } while (!(la * lb >= 10 || (la + 1) * (lb + 1) <= 10));
    const count = String(a * b).length;
    const [lo, hi] = [la * lb * 10000, (la + 1) * (lb + 1) * 10000];
    return answered(
      [`Without working it out, how many digits does $${a} \\times ${b}$ have?`, `不用算出结果，$${a} \\times ${b}$ 的积有几位？`],
      count,
      [
        [
          ["Round down and up", "向下、向上取整百"],
          [
            `${a} is between ${la * 100} and ${(la + 1) * 100}, and ${b} is between ${lb * 100} and ${(lb + 1) * 100}.`,
            `${a} 在 ${la * 100} 和 ${(la + 1) * 100} 之间，${b} 在 ${lb * 100} 和 ${(lb + 1) * 100} 之间。`,
          ],
        ],
        [
          ["Multiply the ends", "乘两端"],
          ["Multiply the small ends and the big ends.", "小的和小的相乘，大的和大的相乘。"],
          [`${la * 100} \\times ${lb * 100} = ${fmt(lo)}`, `${(la + 1) * 100} \\times ${(lb + 1) * 100} = ${fmt(hi)}`],
        ],
        [
          ["Count the digits", "数位数"],
          [`The product is between them, so it has ${count} digits.`, `积在它们之间，所以是 ${count} 位数。`],
        ],
      ],
      [
        `Work it out: $${a} \\times ${b} = ${fmt(a * b)}$, which has ${count} digits.`,
        `算一算：$${a} \\times ${b} = ${fmt(a * b)}$，是 ${count} 位数。`,
      ],
      [
        count === 6
          ? [5, "That is too few. Even the small ends give a six-digit product.", "少了。连两个小端的积都是六位数。"]
          : [6, "That is too many. Even the big ends give less than 100,000.", "多了。连两个大端的积都不到 100,000。"],
        [4, "That is far too small. Hundreds times hundreds is at least ten thousand.", "太小了。几百乘几百至少是一万。"],
      ],
    );
  },
  lineFigure(
    {
      lo: 100000,
      hi: 220000,
      step: 10000,
      labels: [120000, 210000],
      marks: [{ at: 120000 }, { at: 210000 }, { at: 175644, result: true }],
    },
    [
      "A number line from 100,000 to 220,000 with 120,000 and 210,000 marked and the product between them.",
      "一条从 100,000 到 220,000 的数轴，标出 120,000 和 210,000，积在它们之间。",
    ],
  ),
);

/** howMuchMoreToDivideEvenly asks for the least number to add to a two-digit number so that a one-digit number divides it. */
export const howMuchMoreToDivideEvenly = point(
  "how-much-more-to-divide-evenly",
  ["How much more to divide evenly", "再加多少能整除"],
  [
    "What is the least number to add to 47 so that 6 divides it evenly? $47 \\div 6 = 7 \\text{ R } 5$. The next multiple of 6 is $8 \\times 6 = 48$, so add 1.\n\nCheck: $48 \\div 6 = 8$ with nothing left.\n\n> **Watch out.** Adding the remainder 5 does not work: $52 \\div 6$ still leaves 4.",
    "47 至少加几，才能被 6 整除？$47 \\div 6 = 7 \\cdots\\cdots 5$。6 的下一个倍数是 $8 \\times 6 = 48$，所以加 1。\n\n检验：$48 \\div 6 = 8$，没有余数。\n\n> **注意。** 加上余数 5 不对：$52 \\div 6$ 还余 4。",
  ],
  (rng) => {
    const d = rng.int(3, 9);
    const n = dividend(rng, d, 2, false);
    const q = Math.floor(n / d);
    const r = n % d;
    const [en, zh] = quotientPair(n, d);
    return answered(
      [`What is the least whole number you can add to ${n} so that ${d} divides it evenly?`, `${n} 至少加上几，才能被 ${d} 整除？`],
      d - r,
      [
        [
          ["Divide", "做除法"],
          [`Long division gives $${en}$.`, `用竖式计算：$${zh}$。`],
        ],
        [
          ["Find the next multiple", "找下一个倍数"],
          [`The next multiple of ${d} is ${(q + 1) * d}, so add the gap.`, `${d} 的下一个倍数是 ${(q + 1) * d}，加上差的数。`],
          [`${(q + 1) * d} - ${n} = ${d - r}`],
        ],
      ],
      [
        `Divide the new number: $${(q + 1) * d} \\div ${d} = ${q + 1}$ with nothing left.`,
        `用新数去除：$${(q + 1) * d} \\div ${d} = ${q + 1}$，没有余数。`,
      ],
      [
        [r, `Adding ${r} gives ${n + r}, which still leaves ${(n + r) % d}.`, `加上 ${r} 得 ${n + r}，还余 ${(n + r) % d}。`],
        [d, `Adding ${d} gives ${n + d}, which still leaves ${r}.`, `加上 ${d} 得 ${n + d}，还余 ${r}。`],
      ],
      {
        figure: lineFigure(
          {
            lo: q * d,
            hi: (q + 1) * d,
            step: 1,
            labels: [q * d, (q + 1) * d],
            marks: [
              { at: n, text: String(n) },
              { at: (q + 1) * d, result: true },
            ],
            jumps: [[n, (q + 1) * d]],
          },
          [
            `A number line from ${q * d} to ${(q + 1) * d} with a jump from ${n} up to ${(q + 1) * d}.`,
            `一条从 ${q * d} 到 ${(q + 1) * d} 的数轴，从 ${n} 跳到 ${(q + 1) * d}。`,
          ],
        ),
      },
    );
  },
  lineFigure(
    {
      lo: 42,
      hi: 48,
      step: 1,
      labels: [42, 48],
      marks: [
        { at: 47, text: "47" },
        { at: 48, result: true },
      ],
      jumps: [[47, 48]],
    },
    ["A number line from 42 to 48 with a jump from 47 up to 48.", "一条从 42 到 48 的数轴，从 47 跳到 48。"],
  ),
);

/** howManyDigitsTheQuotientHas asks how many digits a three-digit number divided by a one-digit number gives. */
export const howManyDigitsTheQuotientHas = point(
  "how-many-digits-the-quotient-has",
  ["How many digits the quotient has", "商有几位"],
  [
    "How many digits does $328 \\div 4$ have? The 3 hundreds is less than 4, so there is no hundreds digit. Start with 32 tens. The quotient has 2 digits.\n\nCheck: $328 \\div 4 = 82$, which has 2 digits.\n\n> **Watch out.** A three-digit number divided by a one-digit number can have only two digits. Look at the first digit.",
    "$328 \\div 4$ 的商有几位？3 个百比 4 小，商没有百位，从 32 个十除起，所以商是两位数。\n\n检验：$328 \\div 4 = 82$，是两位数。\n\n> **注意。** 三位数除以一位数，商可能只有两位。要先看最高位。",
  ],
  (rng) => {
    const d = rng.int(2, 9);
    const n = rng.int(100, 999);
    const lead = Math.floor(n / 100);
    const count = String(Math.floor(n / d)).length;
    const [en, zh] = quotientPair(n, d);
    return answered(
      [
        `Without working it out, how many digits does the quotient of $${n} \\div ${d}$ have?`,
        `不用算出结果，$${n} \\div ${d}$ 的商有几位？`,
      ],
      count,
      [
        [
          ["Look at the hundreds", "看百位"],
          lead >= d
            ? [`The ${lead} hundreds is at least ${d}, so the quotient has a hundreds digit.`, `${lead} 个百不比 ${d} 小，所以商有百位。`]
            : [
                `The ${lead} hundreds is less than ${d}, so there is no hundreds digit. Start with ${Math.floor(n / 10)} tens.`,
                `${lead} 个百比 ${d} 小，商没有百位，从 ${Math.floor(n / 10)} 个十除起。`,
              ],
        ],
        [
          ["Count the digits", "数位数"],
          [`So the quotient has ${count} digits.`, `所以商是 ${count} 位数。`],
        ],
      ],
      [
        `Work it out: $${en}$, and ${grouped(Math.floor(n / d))} has ${count} digits.`,
        `算一算：$${zh}$，${grouped(Math.floor(n / d))} 是 ${count} 位数。`,
      ],
      [
        count === 3
          ? [2, `That is too few. The ${lead} hundreds can be shared by ${d}.`, `少了。${lead} 个百够分成 ${d} 份。`]
          : [3, `That is too many. The ${lead} hundreds cannot be shared by ${d}.`, `多了。${lead} 个百不够分成 ${d} 份。`],
        [1, `That is too few. Even $100 \\div 9$ is more than 10.`, `少了。$100 \\div 9$ 也比 10 大。`],
      ],
    );
  },
  areaGridFigure(["4"], ["80", "2"], [["320", "8"]]),
);

/** aZeroInsideTheQuotient asks for a quotient that has a zero digit in the middle. */
export const aZeroInsideTheQuotient = point(
  "a-zero-inside-the-quotient",
  ["A zero inside the quotient", "商中间的零"],
  [
    "For $6{,}036 \\div 6$: $6 \\div 6 = 1$. Next, $0 \\div 6 = 0$, so write 0. Then 3 is less than 6, so write 0 again. Bring down 6 to make 36, and $36 \\div 6 = 6$. So the quotient is $1{,}006$.\n\nCheck: $1{,}006 \\times 6 = 6{,}000 + 36 = 6{,}036$.\n\n> **Watch out.** Writing 16 skips two places. $16 \\times 6$ is only 96.",
    "计算 $6{,}036 \\div 6$：$6 \\div 6 = 1$。再看 0，$0 \\div 6 = 0$，写 0。3 比 6 小，再写 0。落下 6 得 36，$36 \\div 6 = 6$。所以商是 $1{,}006$。\n\n检验：$1{,}006 \\times 6 = 6{,}000 + 36 = 6{,}036$。\n\n> **注意。** 写成 16 就跳过了两位。$16 \\times 6$ 只有 96。",
  ],
  (rng) => {
    let q: number;
    let d: number;
    do {
      const a = rng.int(1, 9);
      const b = rng.int(1, 9);
      const c = rng.int(1, 9);
      q = rng.pick([a * 100 + c, a * 1000 + b * 10 + c, a * 1000 + b * 100 + c, a * 1000 + c]);
      d = rng.int(2, 9);
    } while (q * d < 1000 || q * d > 9999);
    return exactQuotient(q * d, d);
  },
  areaGridFigure(["6"], ["1,000", "6"], [["6,000", "36"]], [1], [4, 1]),
);

/** theTotalFromOneShare asks for the amount shared when each of d people got a mixed number with denominator d. */
export const theTotalFromOneShare = point(
  "the-total-from-one-share",
  ["The total from one share", "由一份求总数"],
  [
    "Some ribbon is shared by 3 people, and each gets $2\\frac{1}{3}$ yards. Then $2\\frac{1}{3} = \\frac{7}{3}$, and $3 \\times \\frac{7}{3} = 7$. So 7 yards were shared.\n\nCheck: the 3 people have 2 whole yards each, which is 6, and three thirds make 1 more. That is 7.\n\n> **Watch out.** Do not forget the fraction part. $3 \\times 2 = 6$ is not the whole amount.",
    "一些丝带平均分给 3 个人，每人 $2\\frac{1}{3}$ 码。$2\\frac{1}{3} = \\frac{7}{3}$，$3 \\times \\frac{7}{3} = 7$。所以一共分了 7 码。\n\n检验：3 个人每人 2 整码，合起来 6 码，再加 3 个三分之一是 1 码，一共 7 码。\n\n> **注意。** 别忘了分数部分。$3 \\times 2 = 6$ 不是全部。",
  ],
  (rng) => {
    const d = rng.int(2, 12);
    const a = rng.int(1, 9);
    const n = rng.int(1, d - 1);
    const who = rng.pick(names);
    const total = a * d + n;
    return answered(
      [
        `${who} shared some ribbon equally among ${d} people, and each got $${a}${fracTex(n, d)}$ yards. How many yards were shared?`,
        `${who} 把一些丝带平均分给 ${d} 个人，每人得到 $${a}${fracTex(n, d)}$ 码。一共分了多少码？`,
      ],
      total,
      [
        [
          ["Write the share as a fraction", "把每份化成假分数"],
          [`Each share is ${a} wholes and ${n} more parts of ${d}.`, `每份是 ${a} 个整数再加 ${n} 个 $${fracTex(1, d)}$。`],
          [`${a}${fracTex(n, d)} = ${fracTex(total, d)}`],
        ],
        [
          ["Multiply by the number of people", "乘人数"],
          ["The total is one share times the number of people.", "总数等于每份乘人数。"],
          [`${d} \\times ${fracTex(total, d)} = ${total}`],
        ],
      ],
      [
        `Add the parts: the wholes make $${d} \\times ${a} = ${a * d}$, and the fractions make $${d} \\times ${fracTex(n, d)} = ${n}$. That is ${total}.`,
        `分开加：整数部分是 $${d} \\times ${a} = ${a * d}$，分数部分是 $${d} \\times ${fracTex(n, d)} = ${n}$，一共 ${total}。`,
      ],
      [
        [a * d, "That forgets the fraction part of each share.", "这是忘了每份里的分数部分。"],
        [a + n, "That adds the whole number and the numerator of one share.", "这是把一份里的整数和分子相加了。"],
        [
          total + 1,
          `That is one too many. The ${d} fraction parts make ${n}, not ${n + 1}.`,
          `多了 1。${d} 个分数部分合起来是 ${n}，不是 ${n + 1}。`,
        ],
      ],
      { figure: equalTape(d, `${a} ${n}/${d}`, "?") },
    );
  },
  equalTape(3, "2 1/3", "?"),
);

/** theSmallestNumberThatRoundsToAQuotient asks for the least whole number whose quotient by d rounds to q. */
export const theSmallestNumberThatRoundsToAQuotient = point(
  "the-smallest-number-that-rounds-to-a-quotient",
  ["The smallest number with a rounded quotient", "商四舍五入后的最小被除数"],
  [
    "A number divided by 4 rounds to 20. The quotient must be at least $19\\frac{1}{2}$, and $4 \\times 19\\frac{1}{2} = 78$. So the smallest number is 78.\n\nCheck: $78 \\div 4 = 19 \\text{ R } 2$, and 2 is half of 4, so it rounds up to 20. But $77 \\div 4 = 19 \\text{ R } 1$ rounds down to 19.\n\n> **Watch out.** The answer is not $4 \\times 20 = 80$. Smaller numbers also round to 20.",
    "一个数除以 4，商四舍五入后是 20。商至少是 $19\\frac{1}{2}$，$4 \\times 19\\frac{1}{2} = 78$。所以这个数最小是 78。\n\n检验：$78 \\div 4 = 19 \\cdots\\cdots 2$，2 是 4 的一半，商约为 20。而 $77 \\div 4 = 19 \\cdots\\cdots 1$，商约为 19。\n\n> **注意。** 答案不是 $4 \\times 20 = 80$。比 80 小的数也能得到 20。",
  ],
  (rng) => {
    const d = rng.pick([2, 4, 6, 8]);
    const q = rng.int(11, 95);
    const n = d * q - d / 2;
    return answered(
      [
        `Dividing a whole number by ${d} gives a quotient that rounds to ${q} at the nearest whole number. What is the smallest the number could be?`,
        `一个整数除以 ${d}，商四舍五入到整数后是 ${q}。这个整数最小是多少？`,
      ],
      n,
      [
        [
          ["Find the smallest quotient", "找最小的商"],
          [
            `A quotient rounds to ${q} when it is at least $${q - 1}${fracTex(1, 2)}$.`,
            `商不小于 $${q - 1}${fracTex(1, 2)}$ 时，约为 ${q}。`,
          ],
        ],
        [
          ["Multiply by the divisor", "乘除数"],
          ["The number is that quotient times the divisor.", "这个数等于商乘除数。"],
          [`${d} \\times ${q - 1}${fracTex(1, 2)} = ${n}`],
        ],
      ],
      [
        `Divide: $${n} \\div ${d} = ${q - 1}$ with ${d / 2} left, which is half of ${d}, so it rounds up to ${q}. One less leaves less than half.`,
        `除一除：$${n} \\div ${d}$ 商 ${q - 1} 余 ${d / 2}，正好是 ${d} 的一半，所以约为 ${q}。再小 1 余数就不到一半了。`,
      ],
      [
        [d * q, `That gives exactly ${q}, but smaller numbers also round to ${q}.`, `这正好得 ${q}，可比它小的数也能约成 ${q}。`],
        [d * q - d, `That gives exactly ${q - 1}, which rounds to ${q - 1}.`, `这正好得 ${q - 1}，约成的是 ${q - 1}。`],
        [
          n - 1,
          `That leaves a remainder less than half of ${d}, so it rounds down to ${q - 1}.`,
          `这样余数不到 ${d} 的一半，约成的是 ${q - 1}。`,
        ],
      ],
    );
  },
  lineFigure({ lo: 76, hi: 82, step: 1, labels: [76, 78, 80, 82], marks: [{ at: 78, result: true }, { at: 80 }] }, [
    "A number line from 76 to 82 with points at 78 and 80.",
    "一条从 76 到 82 的数轴，在 78 和 80 处画点。",
  ]),
);

/** howManyMoreToFillTheLastBox asks how many more items would fill the last, partly filled box. */
export const howManyMoreToFillTheLastBox = point(
  "how-many-more-to-fill-the-last-box",
  ["How many more to fill the last box", "还差多少装满最后一盒"],
  [
    "30 cookies go into boxes of 8. $30 \\div 8 = 3 \\text{ R } 6$. The last box has 6 cookies, so it needs $8 - 6 = 2$ more.\n\nCheck: with 2 more there are 32 cookies, and $32 \\div 8 = 4$ boxes with nothing left.\n\n> **Watch out.** The remainder 6 is what is in the last box. The question asks how many are missing.",
    "把 30 块饼干装盒，每盒 8 块。$30 \\div 8 = 3 \\cdots\\cdots 6$。最后一盒有 6 块，还差 $8 - 6 = 2$ 块。\n\n检验：再加 2 块是 32 块，$32 \\div 8 = 4$ 盒，正好装完。\n\n> **注意。** 余数 6 是最后一盒里已有的，问题问的是还差几块。",
  ],
  (rng) => {
    const d = rng.int(3, 9);
    const n = dividend(rng, d, rng.int(2, 3), false);
    const q = Math.floor(n / d);
    const r = n % d;
    const [en, zh] = quotientPair(n, d);
    return answered(
      [
        `${grouped(n)} cookies go into boxes of ${d}. How many more cookies would fill the last box?`,
        `把 ${grouped(n)} 块饼干装盒，每盒 ${d} 块。最后一盒还差几块才装满？`,
      ],
      d - r,
      [
        [
          ["Divide", "做除法"],
          [`Long division gives $${en}$, so the last box has ${r}.`, `用竖式计算：$${zh}$，最后一盒有 ${r} 块。`],
        ],
        [["Find the gap", "求还差多少"], [`A full box holds ${d}.`, `一盒装满是 ${d} 块。`], [`${d} - ${r} = ${d - r}`]],
      ],
      [
        `With ${d - r} more there are ${grouped(n + d - r)} cookies, and $${fmt(n + d - r)} \\div ${d} = ${q + 1}$ with nothing left.`,
        `再加 ${d - r} 块是 ${grouped(n + d - r)} 块，$${fmt(n + d - r)} \\div ${d} = ${q + 1}$，正好装完。`,
      ],
      [
        [r, "That is how many are already in the last box.", "这是最后一盒里已有的块数。"],
        [q + 1, "That is the number of boxes, not the cookies missing.", "这是盒数，不是还差的块数。"],
        [d, "That is a whole box. The last box is not empty.", "这是一整盒，可最后一盒不是空的。"],
      ],
      { figure: remainderTape(n, d) },
    );
  },
  tapeFigure(
    [
      {
        pieces: [
          { size: 8, text: "8" },
          { size: 8, text: "8" },
          { size: 8, text: "8" },
          { size: 6, text: "6", lit: true },
          { size: 2, text: "?", dashed: true },
        ],
      },
    ],
    [
      "Three pieces of 8, a shaded piece of 6 and a dashed piece marked with a question mark.",
      "三段 8，涂色的一段 6，还有一段虚线标着问号。",
    ],
  ),
);

/** estimatingWithARoundDivisor asks for the estimate of a quotient when the divisor is rounded to tens. */
export const estimatingWithARoundDivisor = point(
  "estimating-with-a-round-divisor",
  ["Estimating with a round divisor", "把除数凑整来估算"],
  [
    "Estimate $248 \\div 31$. Round 31 to 30. Then $30 \\times 8 = 240$, close to 248, so the estimate is 8.\n\nCheck: $31 \\times 8 = 248$, so here the estimate is exactly right.\n\n> **Watch out.** 30 is 3 tens. Think of 24 tens divided by 3 tens, which is 8, not 80.",
    "估算 $248 \\div 31$。把 31 看成 30，$30 \\times 8 = 240$，接近 248，所以估商 8。\n\n检验：$31 \\times 8 = 248$，这里估得正好。\n\n> **注意。** 30 是 3 个十。想 24 个十除以 3 个十，得 8，不是 80。",
  ],
  (rng) => {
    let R: number;
    let e: number;
    let q: number;
    do {
      R = rng.int(2, 9) * 10;
      e = rng.pick([-2, -1, 1, 2]);
      q = rng.int(3, 9);
    } while (2 * Math.abs(e * q) >= R);
    const d = R + e;
    const n = d * q;
    return answered(
      [
        `Estimate $${n} \\div ${d}$ by rounding ${d} to ${R}. What is the estimate?`,
        `把 ${d} 看成 ${R}，估算 $${n} \\div ${d}$。估商是多少？`,
      ],
      q,
      [
        [
          ["Round the divisor", "把除数凑整"],
          [`${d} is close to ${R}, which is ${R / 10} tens.`, `${d} 接近 ${R}，也就是 ${R / 10} 个十。`],
        ],
        [
          ["Use a fact", "用乘法口诀"],
          [`Find a multiple of ${R} close to ${n}.`, `找一个接近 ${n} 的 ${R} 的倍数。`],
          [`${R} \\times ${q} = ${R * q}`],
        ],
      ],
      [
        `Multiply the real divisor: $${d} \\times ${q} = ${n}$, so the estimate ${q} is right.`,
        `用原来的除数乘一乘：$${d} \\times ${q} = ${n}$，估商 ${q} 正确。`,
      ],
      [
        [
          q * 10,
          `That treats ${R} as ${R / 10}. Since ${R} is ${R / 10} tens, the estimate is ${q}.`,
          `这是把 ${R} 当成了 ${R / 10}。${R} 是 ${R / 10} 个十，估商是 ${q}。`,
        ],
        [
          q + 1,
          `$${R} \\times ${q + 1} = ${R * (q + 1)}$ is farther from ${n}.`,
          `$${R} \\times ${q + 1} = ${R * (q + 1)}$ 离 ${n} 更远。`,
        ],
        [
          q - 1,
          `$${R} \\times ${q - 1} = ${R * (q - 1)}$ is farther from ${n}.`,
          `$${R} \\times ${q - 1} = ${R * (q - 1)}$ 离 ${n} 更远。`,
        ],
      ],
    );
  },
  equalTape(8, "31", "248"),
);

/** aRemainderThatIsTooBig asks for the right remainder when a division was written with a remainder at least the divisor. */
export const aRemainderThatIsTooBig = point(
  "a-remainder-that-is-too-big",
  ["A remainder that is too big", "余数太大"],
  [
    "Sam writes $200 \\div 32 = 5 \\text{ R } 40$. But 40 is more than 32, so one more 32 fits. Take it out: $40 - 32 = 8$, and the quotient becomes 6. So $200 \\div 32 = 6 \\text{ R } 8$.\n\nCheck: $6 \\times 32 + 8 = 192 + 8 = 200$.\n\n> **Watch out.** A remainder must always be less than the divisor.",
    "小山写了 $200 \\div 32 = 5 \\cdots\\cdots 40$。可是 40 比 32 大，还能再分出一个 32。去掉它：$40 - 32 = 8$，商变成 6。所以 $200 \\div 32 = 6 \\cdots\\cdots 8$。\n\n检验：$6 \\times 32 + 8 = 192 + 8 = 200$。\n\n> **注意。** 余数一定要比除数小。",
  ],
  (rng) => {
    const d = rng.int(12, 45);
    const q = rng.int(3, 9);
    const r = rng.int(1, d - 1);
    const n = d * q + r;
    const who = rng.pick(names);
    return answered(
      [
        `${who} writes $${fmt(n)} \\div ${d} = ${qr(q - 1, r + d).en}$. What is the correct remainder?`,
        `${who} 写了 $${fmt(n)} \\div ${d} = ${qr(q - 1, r + d).zh}$。正确的余数是多少？`,
      ],
      r,
      [
        [
          ["Spot the problem", "找出问题"],
          [`The remainder ${r + d} is not less than ${d}, so one more ${d} fits.`, `余数 ${r + d} 不比 ${d} 小，还能再分出一个 ${d}。`],
        ],
        [
          ["Take out one more group", "再分出一组"],
          [`Add 1 to the quotient, making ${q}, and take ${d} from the remainder.`, `商加 1 变成 ${q}，余数减去 ${d}。`],
          [`${r + d} - ${d} = ${r}`],
        ],
      ],
      [
        `Multiply back: $${q} \\times ${d} + ${r} = ${fmt(n)}$, and ${r} is less than ${d}.`,
        `乘回去验算：$${q} \\times ${d} + ${r} = ${fmt(n)}$，而且 ${r} 比 ${d} 小。`,
      ],
      [
        [r + d, "That is the remainder that is too big.", "这就是那个太大的余数。"],
        [d - r, "That is how many more would make another group.", "这是再凑一组还差的数。"],
        [q, "That is the correct quotient, not the remainder.", "这是正确的商，不是余数。"],
      ],
    );
  },
  remainderTape(200, 32),
);

/** theFirstPartialQuotient asks for the first partial quotient taken by place value. */
export const theFirstPartialQuotient = point(
  "the-first-partial-quotient",
  ["The first partial quotient", "第一个部分商"],
  [
    "For $4{,}416 \\div 24$, try groups of 24 by place value. 100 groups use 2,400, which fits. 200 groups would use 4,800, which is too much. So the first partial quotient is 100.\n\nCheck: $4{,}416 - 2{,}400 = 2{,}016$ is left, and less than 100 groups of 24 fit in it.\n\n> **Watch out.** Use the biggest place that fits. 10 groups fit too, but that is not the first step.",
    "计算 $4{,}416 \\div 24$，按数位试 24 的组数。100 个 24 是 2,400，够减；200 个 24 是 4,800，太多了。所以第一个部分商是 100。\n\n检验：$4{,}416 - 2{,}400 = 2{,}016$，里面不到 100 个 24。\n\n> **注意。** 要从最大的、够减的数位开始。10 个也够减，但那不是第一步。",
  ],
  (rng) => {
    const d = rng.int(11, 45);
    const n = d * rng.int(100, 399) + rng.int(0, d - 1);
    let p = 1;
    while (p * 10 * d <= n) p *= 10;
    const first = chunksOf(n, d)[0]!;
    return answered(
      [
        `Using partial quotients by place value, what is the first partial quotient for $${fmt(n)} \\div ${d}$?`,
        `按数位用部分商计算 $${fmt(n)} \\div ${d}$，第一个部分商是多少？`,
      ],
      first,
      [
        [
          ["Find the biggest place", "找最大的数位"],
          [
            `${grouped(p)} groups of ${d} fit, but ${grouped(p * 10)} groups do not.`,
            `${grouped(p)} 个 ${d} 够减，${grouped(p * 10)} 个不够。`,
          ],
          [`${d} \\times ${fmt(p)} = ${fmt(d * p)}`],
        ],
        [
          ["Take as many as fit", "取尽量多"],
          [`Use the most ${grouped(p)}s of groups that fit.`, `取尽量多个 ${grouped(p)}。`],
          [`${d} \\times ${fmt(first)} = ${fmt(d * first)}`, `${d} \\times ${fmt(first + p)} = ${fmt(d * (first + p))}`],
        ],
      ],
      [
        `What is left, $${fmt(n)} - ${fmt(d * first)} = ${fmt(n - d * first)}$, holds fewer than ${grouped(p)} groups of ${d}.`,
        `剩下 $${fmt(n)} - ${fmt(d * first)} = ${fmt(n - d * first)}$，里面不到 ${grouped(p)} 个 ${d}。`,
      ],
      [
        [
          first + p,
          `That is too many: $${d} \\times ${fmt(first + p)} = ${fmt(d * (first + p))}$, more than ${grouped(n)}.`,
          `太多了：$${d} \\times ${fmt(first + p)} = ${fmt(d * (first + p))}$，比 ${grouped(n)} 大。`,
        ],
        [
          first / 10,
          "That fits, but it is a smaller place. Start with the biggest place that fits.",
          "这也够减，但数位小了。要从最大的、够减的数位开始。",
        ],
        [
          first * 10,
          `That is too many: ${grouped(first * 10)} groups of ${d} are far more than ${grouped(n)}.`,
          `太多了：${grouped(first * 10)} 个 ${d} 远比 ${grouped(n)} 大。`,
        ],
      ],
    );
  },
  areaGridFigure(["24"], ["100", "?"], [["2,400", "2,016"]], [1], [5, 4]),
);

/** theDivisorFromAQuotientAndRemainder asks for a divisor from the dividend, the quotient and the remainder. */
export const theDivisorFromAQuotientAndRemainder = point(
  "the-divisor-from-a-quotient-and-remainder",
  ["The divisor from a quotient and remainder", "由商和余数求除数"],
  [
    "347 divided by a number is 12 with 11 left. Take away the remainder: $347 - 11 = 336$. That is 12 equal groups, so the number is $336 \\div 12 = 28$.\n\nCheck: $12 \\times 28 + 11 = 336 + 11 = 347$, and 11 is less than 28.\n\n> **Watch out.** Take away the remainder first. $347 \\div 12$ does not divide evenly.",
    "347 除以一个数，商 12 余 11。先去掉余数：$347 - 11 = 336$，这是 12 个相同的组，所以这个数是 $336 \\div 12 = 28$。\n\n检验：$12 \\times 28 + 11 = 336 + 11 = 347$，而且 11 比 28 小。\n\n> **注意。** 要先去掉余数。$347 \\div 12$ 除不尽。",
  ],
  (rng) => {
    let d: number;
    let q: number;
    let r: number;
    do {
      d = rng.int(12, 45);
      q = rng.int(4, 30);
      r = rng.int(1, d - 1);
    } while (d * q + r < 100 || d * q + r > 999);
    const n = d * q + r;
    return answered(
      [
        `When ${n} is divided by a number, the quotient is ${q} and the remainder is ${r}. What is the number?`,
        `${n} 除以一个数，商是 ${q}，余数是 ${r}。这个数是多少？`,
      ],
      d,
      [
        [
          ["Take away the remainder", "去掉余数"],
          ["What is left is made of equal groups.", "剩下的部分由相同的组组成。"],
          [`${n} - ${r} = ${d * q}`],
        ],
        [
          ["Divide by the quotient", "除以商"],
          [`There are ${q} equal groups, so divide by ${q}.`, `有 ${q} 个相同的组，所以除以 ${q}。`],
          [`${d * q} \\div ${q} = ${d}`],
        ],
      ],
      [
        `Multiply back: $${q} \\times ${d} + ${r} = ${n}$, and ${r} is less than ${d}.`,
        `乘回去验算：$${q} \\times ${d} + ${r} = ${n}$，而且 ${r} 比 ${d} 小。`,
      ],
      [
        [
          Math.floor(n / q) === d ? d + 1 : Math.floor(n / q),
          "That divides without taking away the remainder first.",
          "这是没有先去掉余数就去除了。",
        ],
        [q, "That is the quotient, not the divisor.", "这是商，不是除数。"],
        [d + r, "That adds the remainder to the divisor.", "这是把余数加到除数上了。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "347",
        pieces: [
          { size: 336, text: "12 × ?" },
          { size: 11, text: "11", lit: true },
        ],
      },
    ],
    [
      "A bar of 347: a long piece of 12 equal groups of an unknown size, and a shaded piece of 11.",
      "一个长 347 的长条：一大段是 12 个大小未知的相同组，还有涂色的一段 11。",
    ],
  ),
);

/** theLeastToAddForAMultiple asks how many more students fill every row when they sit in rows of a two-digit number. */
export const theLeastToAddForAMultiple = point(
  "the-least-to-add-for-a-multiple",
  ["The least to add for a multiple", "加多少才成为倍数"],
  [
    "1,000 students sit in rows of 24. $1{,}000 \\div 24 = 41 \\text{ R } 16$, so the last row has 16. It needs $24 - 16 = 8$ more students.\n\nCheck: $1{,}008 \\div 24 = 42$ with nothing left.\n\n> **Watch out.** The remainder 16 is who is in the last row. The question asks how many are missing.",
    "1,000 名学生坐成每排 24 人。$1{,}000 \\div 24 = 41 \\cdots\\cdots 16$，最后一排有 16 人，还差 $24 - 16 = 8$ 人。\n\n检验：$1{,}008 \\div 24 = 42$，没有余数。\n\n> **注意。** 余数 16 是最后一排已有的人数，问题问的是还差几人。",
  ],
  (rng) => {
    let d: number;
    let q: number;
    let r: number;
    do {
      d = rng.int(12, 48);
      r = rng.int(1, d - 1);
      q = rng.int(25, 400);
    } while (q * d + r < 1000 || q * d + r > 9999);
    const n = q * d + r;
    const [en, zh] = quotientPair(n, d);
    return answered(
      [
        `A school has ${grouped(n)} students and seats them in rows of ${d}. What is the least number of extra students needed so that every row is full?`,
        `学校有 ${grouped(n)} 名学生，每排坐 ${d} 人。至少再来多少名学生，才能使每排都坐满？`,
      ],
      d - r,
      [
        [
          ["Divide", "做除法"],
          [`Long division gives $${en}$, so the last row has ${r}.`, `用竖式计算：$${zh}$，最后一排有 ${r} 人。`],
        ],
        [["Find the gap", "求还差多少"], [`A full row has ${d}.`, `一排坐满是 ${d} 人。`], [`${d} - ${r} = ${d - r}`]],
      ],
      [
        `With ${d - r} more there are ${grouped(n + d - r)} students, and $${fmt(n + d - r)} \\div ${d} = ${q + 1}$ with nothing left.`,
        `再来 ${d - r} 人是 ${grouped(n + d - r)} 人，$${fmt(n + d - r)} \\div ${d} = ${q + 1}$，正好坐满。`,
      ],
      [
        [r, "That is how many sit in the last row already.", "这是最后一排已有的人数。"],
        [d, "That is a whole new row. The last row is not empty.", "这是一整排，可最后一排不是空的。"],
        [q + 1, "That is the number of rows.", "这是排数。"],
      ],
    );
  },
  lineFigure(
    {
      lo: 984,
      hi: 1008,
      step: 4,
      labels: [984, 1008],
      marks: [
        { at: 1000, text: "1,000" },
        { at: 1008, result: true },
      ],
      jumps: [[1000, 1008]],
    },
    ["A number line from 984 to 1,008 with a jump from 1,000 up to 1,008.", "一条从 984 到 1,008 的数轴，从 1,000 跳到 1,008。"],
  ),
);
