import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { Q, svgDocument } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

// 5th Grade Math: whole number expressions, negative numbers, and the standard algorithms for multiplication and division.

/** fmt writes an integer in LaTeX with thousands separators: "3{,}400", "-1{,}200". */
const fmt = (n: number): string => (n < 0 ? `-${fmt(-n)}` : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}"));

/** plain writes an integer with thousands separators for running text and figures: "3,400". */
const plain = (n: number): string => (n < 0 ? `−${plain(-n)}` : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","));

/** mathText is a choice option made of one LaTeX expression. */
const mathText = (s: string): Text => same(`$${s}$`);

/** qr writes a quotient with a remainder: "7 R 5" in English, "7……5" in Chinese. */
const qr = (q: number, r: number) => ({ en: `${fmt(q)} \\text{ R } ${r}`, zh: `${fmt(q)} \\cdots\\cdots ${r}` });

/** qrText writes a quotient with a remainder as a bilingual choice option. */
const qrText = (q: number, r: number): Text => t(`$${qr(q, r).en}$`, `$${qr(q, r).zh}$`);

/** pickChoice builds a choice problem from a correct option and distinct wrong ones, keeping at most three wrong ones. */
function pickChoice(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text, figure?: Figure): Problem {
  const seen = new Set([correct.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))).slice(0, 3);
  const options = rng.shuffle([correct, ...rest]);
  return { ...choiceProblem({ prompt, options, correct: options.indexOf(correct), solution }), ...(figure && { figure }) };
}

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

/** multiplyRows writes the standard algorithm for n × a (a one digit) place by place, carrying into the next place. */
function multiplyRows(n: number, a: number): string[] {
  const rows: string[] = [];
  let carry = 0;
  const digits = String(n).split("").reverse().map(Number);
  digits.forEach((d, i) => {
    const v = a * d + carry;
    const last = i === digits.length - 1;
    rows.push(`${a} \\times ${d}${carry ? ` + ${carry}` : ""} = ${v}${last ? "" : `\\ \\to\\ ${v % 10}, \\ ${Math.floor(v / 10)}`}`);
    carry = Math.floor(v / 10);
  });
  return rows;
}

/** multiplySteps explains the standard algorithm for n × a in both languages. */
function multiplySteps(n: number, a: number): Text {
  const rows = steps(...multiplyRows(n, a));
  return t(
    `Multiply ${a} by each digit of ${plain(n)} from the ones place, writing the ones digit and carrying the tens into the next place (shown after each arrow):${rows}So $${fmt(n)} \\times ${a} = ${fmt(n * a)}$.`,
    `从个位起用 ${a} 依次乘 ${plain(n)} 的每一位，写下积的个位，把十位进到下一位（箭头后依次是写下的数和进位）：${rows}所以 $${fmt(n)} \\times ${a} = ${fmt(n * a)}$。`,
  );
}

/** partialProducts explains the standard algorithm for n × m (m with two or three digits) with its partial products. */
function partialProducts(n: number, m: number): Text {
  const parts = String(m)
    .split("")
    .reverse()
    .map((d, i) => Number(d) * 10 ** i)
    .filter((v) => v > 0);
  const lines = parts.map((v) => `${fmt(n)} \\times ${fmt(v)} = ${fmt(n * v)}`);
  const total = `${parts.map((v) => fmt(n * v)).join(" + ")} = ${fmt(n * m)}`;
  return t(
    `Multiply ${plain(n)} by each digit of ${plain(m)}, keeping its place value, then add the partial products:${steps(...lines, total)}`,
    `用 ${plain(m)} 的每一位（按它的数位）去乘 ${plain(n)}，再把各部分积相加：${steps(...lines, total)}`,
  );
}

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

/** divisionSteps explains long division of n by d in both languages. */
function divisionSteps(n: number, d: number): Text {
  const q = Math.floor(n / d);
  const r = n % d;
  const lines = steps(
    ...longDivision(n, d).map(
      (row) => `${fmt(row.part)} \\div ${d} \\to ${row.digit}, \\quad ${fmt(row.part)} - ${fmt(row.digit * d)} = ${fmt(row.rest)}`,
    ),
  );
  const result =
    r === 0
      ? { en: `${fmt(n)} \\div ${d} = ${fmt(q)}`, zh: `${fmt(n)} \\div ${d} = ${fmt(q)}` }
      : { en: `${fmt(n)} \\div ${d} = ${qr(q, r).en}`, zh: `${fmt(n)} \\div ${d} = ${qr(q, r).zh}` };
  return t(
    `Divide place by place from the left. At each step write the quotient digit, subtract, and bring down the next digit:${lines}So $${result.en}$.`,
    `从高位起逐位去除。每一步写出商的一位，相减，再落下下一位数字：${lines}所以 $${result.zh}$。`,
  );
}

/** relationOptions are the comparison symbols, in the order of relation. */
const relationOptions: readonly Text[] = ["<", "=", ">"].map((s) => same(`$${s}$`));

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
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
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

/** chainSolution explains the order of operations for a chain. */
function chainSolution(nums: readonly number[], ops: readonly Op[], terms: readonly number[], value: number): Text {
  const signs = ops.filter((o) => o === "+" || o === "-");
  const after = terms.map((n, i) => (i === 0 ? fmt(n) : `${opTex[signs[i - 1]!]} ${fmt(n)}`)).join(" ");
  return t(
    `Multiply and divide first, from left to right, then add and subtract from left to right:${steps(chainTex(nums, ops), `= ${after}`, `= ${fmt(value)}`)}`,
    `先按从左到右的顺序算乘除，再从左到右算加减：${steps(chainTex(nums, ops), `= ${after}`, `= ${fmt(value)}`)}`,
  );
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
    {
      id: "expressions-with-two-operations",
      title: t("Two operations", "两步运算"),
      explanation: t(
        "$40 - 6 \\times 5 = 40 - 30 = 10$. The multiplication comes first even though it is written second; working from left to right would give the wrong value $34 \\times 5 = 170$.",
        "$40 - 6 \\times 5 = 40 - 30 = 10$。虽然乘法写在后面，也要先算乘法；如果从左往右算，会得到错误的结果 $34 \\times 5 = 170$。",
      ),
      generate(rng) {
        const { nums, ops, value, terms } = randomChain(rng, 2);
        const ltr = evalLeftToRight(nums, ops);
        return numberProblem({
          prompt: t(`Evaluate $${chainTex(nums, ops)}$.`, `计算 $${chainTex(nums, ops)}$。`),
          answer: value,
          form: "integer",
          wrong: [ltr, value + 1].filter((w) => Number.isInteger(w) && w >= 0),
          solution: chainSolution(nums, ops, terms, value),
        });
      },
    },
    {
      id: "expressions-with-three-or-four-operations",
      title: t("Three or four operations", "三步或四步运算"),
      explanation: t(
        "$36 \\div 4 + 2 \\times 7 - 5 = 9 + 14 - 5 = 18$. First find every product and quotient, then add and subtract the results from left to right.",
        "$36 \\div 4 + 2 \\times 7 - 5 = 9 + 14 - 5 = 18$。先算出所有的积和商，再从左到右加减。",
      ),
      generate(rng) {
        const { nums, ops, value, terms } = randomChain(rng, rng.int(3, 4));
        const ltr = evalLeftToRight(nums, ops);
        return numberProblem({
          prompt: t(`Evaluate $${chainTex(nums, ops)}$.`, `计算 $${chainTex(nums, ops)}$。`),
          answer: value,
          form: "integer",
          wrong: [ltr, value + 2].filter((w) => Number.isInteger(w) && w >= 0),
          solution: chainSolution(nums, ops, terms, value),
        });
      },
    },
  ],
);

/** Bracketed is an expression with grouping symbols, its value, the value a slip gives, and the steps of its evaluation. */
interface Bracketed {
  readonly tex: string;
  readonly value: number;
  readonly slip: number;
  readonly steps: readonly string[];
}

/** oneParenthesis draws an expression with one pair of parentheses. */
function oneParenthesis(rng: Rng): Bracketed {
  for (;;) {
    const [a, b, c] = [rng.int(3, 40), rng.int(2, 30), rng.int(2, 9)];
    const kind = rng.int(0, 4);
    let r: Bracketed;
    if (kind === 0) r = { tex: `(${a} + ${b}) \\times ${c}`, value: (a + b) * c, slip: a + b * c, steps: [`= ${a + b} \\times ${c}`] };
    else if (kind === 1) r = { tex: `${c} \\times (${a} - ${b})`, value: c * (a - b), slip: c * a - b, steps: [`= ${c} \\times ${a - b}`] };
    else if (kind === 2) {
      const s = c * rng.int(3, 12);
      const x = rng.int(1, s - 1);
      r = { tex: `(${s - x} + ${x}) \\div ${c}`, value: s / c, slip: s - x + x / c, steps: [`= ${s} \\div ${c}`] };
    } else if (kind === 3)
      r = { tex: `${a + b + c + 20} - (${b} + ${c})`, value: a + 20, slip: a + 20 + 2 * c, steps: [`= ${a + b + c + 20} - ${b + c}`] };
    else {
      const d = rng.int(2, 9);
      r = {
        tex: `${a} + ${d} \\times (${b + c} - ${c})`,
        value: a + d * b,
        slip: a + d * (b + c) - c,
        steps: [`= ${a} + ${d} \\times ${b}`, `= ${a} + ${d * b}`],
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
        steps: [`= ${a} \\times [${b} - ${c + d}]`, `= ${a} \\times ${inner}`],
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
        steps: [`= [${a + b} \\times ${c} - ${d}] \\div ${e}`, `= [${p} - ${d}] \\div ${e}`, `= ${p - d} \\div ${e}`],
      };
    } else {
      const [a, b, c, d] = [rng.int(10, 60), rng.int(2, 6), rng.int(2, 9), rng.int(2, 9)];
      const inner = c * d + rng.int(1, 9);
      r = {
        tex: `${a} + ${b} \\times [${inner} - ${c} \\times ${d}]`,
        value: a + b * (inner - c * d),
        slip: (a + b) * (inner - c * d),
        steps: [`= ${a} + ${b} \\times [${inner} - ${c * d}]`, `= ${a} + ${b} \\times ${inner - c * d}`, `= ${a} + ${b * (inner - c * d)}`],
      };
    }
    if (r.value < 0 || r.slip === r.value || !Number.isInteger(r.slip) || r.slip < 0) continue;
    return r;
  }
}

/** bracketedProblem asks for the value of an expression with grouping symbols. */
function bracketedProblem(r: Bracketed): Problem {
  const lines = steps(r.tex, ...r.steps, `= ${fmt(r.value)}`);
  return numberProblem({
    prompt: t(`Evaluate $${r.tex}$.`, `计算 $${r.tex}$。`),
    answer: r.value,
    form: "integer",
    wrong: [r.slip, r.value + 1],
    solution: t(`Work inside the grouping symbols first, innermost first:${lines}`, `先算括号里面的，从最里层算起：${lines}`),
  });
}

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
    {
      id: "one-pair-of-parentheses",
      title: t("One pair of parentheses", "一对小括号"),
      explanation: t(
        "Parentheses mark the part to work out first, even when it is an addition and the rest is a multiplication. Find the value inside the parentheses, then finish the expression:\n\n$$(17 + 8) \\times 4 = 25 \\times 4 = 100.$$\n\nWithout the parentheses the multiplication would come first: $17 + 8 \\times 4 = 17 + 32 = 49$, a different answer.",
        "小括号表示要先算的部分，即使括号里是加法、括号外是乘法，也要先算括号里面。先求出括号里的值，再算完整个算式：\n\n$$(17 + 8) \\times 4 = 25 \\times 4 = 100$$\n\n如果没有括号，就要先算乘法：$17 + 8 \\times 4 = 17 + 32 = 49$，结果不一样。",
      ),
      generate: (rng) => bracketedProblem(oneParenthesis(rng)),
    },
    {
      id: "brackets-and-parentheses",
      title: t("Brackets and parentheses", "中括号和小括号"),
      explanation: t(
        "When parentheses sit inside brackets, work from the inside out: first the parentheses, then the rest of the brackets, then everything outside. Inside each grouping, multiplication and division still come before addition and subtraction.\n\n$$3 \\times [20 - (4 + 9)] = 3 \\times [20 - 13] = 3 \\times 7 = 21.$$",
        "中括号里套着小括号时，要从里往外算：先算小括号，再算中括号里剩下的部分，最后算括号外面。在每一层括号里，仍然先乘除、后加减。\n\n$$3 \\times [20 - (4 + 9)] = 3 \\times [20 - 13] = 3 \\times 7 = 21$$",
      ),
      generate: (rng) => bracketedProblem(nestedGroups(rng)),
    },
  ],
);

/** Phrase is a calculation described in words, the expression it gives and expressions it might be confused with. */
interface Phrase {
  readonly en: string;
  readonly zh: string;
  readonly tex: string;
  readonly value: number;
  readonly wrong: readonly string[];
  /** slip is the value of the first wrong expression, when it is a whole number. */
  readonly slip?: number;
  /** why says which operation the description names last, so where the parentheses go. */
  readonly why?: { readonly en: string; readonly zh: string };
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
        wrong: [`${a} + ${b} \\times ${c}`, `${a} \\times ${c} + ${b}`, `${a} + ${b} + ${c}`],
      };
    case 1: {
      const big = b + c * rng.int(3, 15);
      return {
        en: `Subtract ${b} from ${big}, then divide by ${c}.`,
        zh: `从 ${big} 中减去 ${b}，再除以 ${c}。`,
        tex: `(${big} - ${b}) \\div ${c}`,
        value: (big - b) / c,
        wrong: [`${big} - ${b} \\div ${c}`, `(${b} - ${big}) \\div ${c}`, `${b} - ${big} \\div ${c}`],
      };
    }
    case 2:
      return {
        en: `Multiply ${a} by ${c}, then add ${b}.`,
        zh: `${a} 乘 ${c}，再加 ${b}。`,
        tex: `${a} \\times ${c} + ${b}`,
        value: a * c + b,
        wrong: [`${a} \\times (${c} + ${b})`, `${a} + ${c} \\times ${b}`, `(${a} + ${b}) \\times ${c}`],
      };
    default: {
      const big = c * (b + rng.int(2, 9));
      return {
        en: `Divide ${big} by ${c}, then subtract ${b}.`,
        zh: `${big} 除以 ${c}，再减去 ${b}。`,
        tex: `${big} \\div ${c} - ${b}`,
        value: big / c - b,
        wrong: [`${big} \\div (${c} - ${b})`, `${b} - ${big} \\div ${c}`, `${c} \\div ${big} - ${b}`],
      };
    }
  }
}

/** Comparison is a statement comparing an expression with a simpler one, without computing either. */
interface Comparison {
  readonly a: string;
  readonly b: string;
  readonly correct: Text;
  readonly wrong: readonly Text[];
  readonly why: Text;
}

/** comparisonOf compares an expression built from (x + y) with x + y itself. */
function comparisonOf(rng: Rng): Comparison {
  const [x, y] = [rng.int(120, 2400), rng.int(30, 900)];
  const k = rng.int(2, 9);
  const base = `${fmt(x)} + ${fmt(y)}`;
  const timesLarge = t(`It is ${k} times as large.`, `它是后者的 ${k} 倍。`);
  const more = t(`It is ${k} more.`, `它比后者大 ${k}。`);
  const less = t(`It is ${k} less.`, `它比后者小 ${k}。`);
  const part = t(
    `It is one ${k === 2 ? "half" : `${k === 3 ? "third" : k === 4 ? "fourth" : `${["fifth", "sixth", "seventh", "eighth", "ninth"][k - 5]}`}`} as large.`,
    `它是后者的 ${k} 分之一。`,
  );
  switch (rng.int(0, 3)) {
    case 0:
      return {
        a: `${k} \\times (${base})`,
        b: base,
        correct: timesLarge,
        wrong: [more, less, part],
        why: t(`It is ${k} groups of $${base}$.`, `它是 ${k} 个 $${base}$。`),
      };
    case 1:
      return {
        a: `(${base}) + ${k}`,
        b: base,
        correct: more,
        wrong: [timesLarge, less, part],
        why: t(`It adds ${k} to $${base}$.`, `它在 $${base}$ 的基础上加了 ${k}。`),
      };
    case 2:
      return {
        a: `(${base}) - ${k}`,
        b: base,
        correct: less,
        wrong: [timesLarge, more, part],
        why: t(`It takes ${k} away from $${base}$.`, `它从 $${base}$ 中减去了 ${k}。`),
      };
    default:
      return {
        a: `(${base}) \\div ${k}`,
        b: base,
        correct: part,
        wrong: [timesLarge, more, less],
        why: t(`It splits $${base}$ into ${k} equal parts and keeps one.`, `它把 $${base}$ 平均分成 ${k} 份，取其中一份。`),
      };
  }
}

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
    {
      id: "writing-expressions-for-calculations",
      title: t("Writing an expression for a calculation", "为计算过程列式"),
      explanation: t(
        '"Subtract 5 from 30, then divide by 5" is $(30 - 5) \\div 5$. The step done first goes in parentheses when it would otherwise come later.',
        '"从 30 中减去 5，再除以 5" 写成 $(30 - 5) \\div 5$。如果先做的那一步按运算顺序本来会后算，就要给它加上括号。',
      ),
      generate(rng) {
        const p = stepPhrase(rng);
        return pickChoice(
          rng,
          t(`Which expression matches this calculation? ${p.en}`, `哪个算式表示下面的计算过程？${p.zh}`),
          mathText(p.tex),
          p.wrong.map(mathText),
          t(`The calculation is $${p.tex} = ${fmt(p.value)}$.`, `这个计算过程是 $${p.tex} = ${fmt(p.value)}$。`),
        );
      },
    },
    {
      id: "interpreting-expressions-without-evaluating",
      title: t("Interpreting an expression without evaluating it", "不计算，理解算式"),
      explanation: t(
        "$4 \\times (1{,}250 + 368)$ is four groups of $1{,}250 + 368$, so it is four times as large as $1{,}250 + 368$. No calculation is needed.",
        "$4 \\times (1{,}250 + 368)$ 是 4 个 $1{,}250 + 368$，所以它是 $1{,}250 + 368$ 的 4 倍，不需要计算。",
      ),
      generate(rng) {
        const c = comparisonOf(rng);
        return pickChoice(rng, t(`How does $${c.a}$ compare with $${c.b}$?`, `$${c.a}$ 与 $${c.b}$ 相比怎样？`), c.correct, c.wrong, c.why);
      },
    },
  ],
);

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
        wrong: [`${a} \\times ${b} + ${c}`, `${a} + ${b} \\times ${c}`, `${a} \\times ${b} \\times ${c}`],
        slip: a * b + c,
        why: {
          en: `"The product of ${a} and the sum" multiplies ${a} by the whole sum, so the sum needs parentheses`,
          zh: `"${a} 与和的积"是用 ${a} 乘整个和，所以和要加括号`,
        },
      };
    case 1:
      return {
        en: `the sum of ${b} and the product of ${a} and ${c}`,
        zh: `${b} 与 ${a} 和 ${c} 的积的和`,
        tex: `${b} + ${a} \\times ${c}`,
        value: b + a * c,
        wrong: [`(${b} + ${a}) \\times ${c}`, `${b} \\times ${a} + ${c}`, `${b} + ${a} + ${c}`],
        slip: (b + a) * c,
        why: {
          en: `"The sum of ${b} and the product" adds ${b} to a product, and multiplication comes first without parentheses`,
          zh: `"${b} 与积的和"是把 ${b} 加上一个积，不加括号时乘法先算`,
        },
      };
    case 2: {
      const big = a * (c + rng.int(1, 9));
      const top = b + Math.floor(big / a);
      return {
        en: `the difference of ${top} and the quotient of ${big} and ${a}`,
        zh: `${top} 与 ${big} 除以 ${a} 的商的差`,
        tex: `${top} - ${big} \\div ${a}`,
        value: top - big / a,
        wrong: [`(${top} - ${big}) \\div ${a}`, `${big} \\div ${a} - ${top}`, `${top} - ${a} \\div ${big}`],
        why: {
          en: `"The difference of ${top} and the quotient" subtracts the quotient $${big} \\div ${a}$ from ${top}, and division comes first without parentheses`,
          zh: `"${top} 与商的差"是用 ${top} 减去商 $${big} \\div ${a}$，不加括号时除法先算`,
        },
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
        wrong: [`${s - x} + ${x} \\div ${a}`, `${a} \\div (${s - x} + ${x})`, `(${s - x} + ${x}) \\times ${a}`],
        why: {
          en: `"The quotient of the sum and ${a}" divides the whole sum by ${a}, so the sum needs parentheses`,
          zh: `"和除以 ${a} 的商"是用整个和除以 ${a}，所以和要加括号`,
        },
      };
    }
    default: {
      const big = b + c + 5;
      return {
        en: `twice the difference of ${big} and ${c}`,
        zh: `${big} 与 ${c} 的差的 2 倍`,
        tex: `2 \\times (${big} - ${c})`,
        value: 2 * (big - c),
        wrong: [`2 \\times ${big} - ${c}`, `${big} - 2 \\times ${c}`, `2 + (${big} - ${c})`],
        slip: 2 * big - c,
        why: {
          en: `"Twice the difference" doubles the whole difference, so the difference needs parentheses`,
          zh: `"差的 2 倍"是把整个差乘 2，所以差要加括号`,
        },
      };
    }
  }
}

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
    {
      id: "choosing-the-expression-for-a-description",
      title: t("Choosing the expression", "选出算式"),
      explanation: t(
        '"The sum of 5 and the product of 3 and 8" adds 5 to a product: $5 + 3 \\times 8$. "The product of 3 and the sum of 5 and 8" multiplies 3 by a sum: $3 \\times (5 + 8)$.',
        '"5 与 3 和 8 的积的和" 是 5 加上一个积：$5 + 3 \\times 8$。"3 与 5 和 8 的和的积" 是 3 乘一个和：$3 \\times (5 + 8)$。',
      ),
      generate(rng) {
        const p = termPhrase(rng);
        return pickChoice(
          rng,
          t(`Which expression is ${p.en}?`, `哪个算式表示"${p.zh}"？`),
          mathText(p.tex),
          p.wrong.map(mathText),
          t(`${p.why?.en ?? "Translate the words in order"}: $${p.tex}$.`, `${p.why?.zh ?? "按文字顺序列式"}：$${p.tex}$。`),
        );
      },
    },
    {
      id: "evaluating-a-description",
      title: t("Evaluating a description", "按描述计算"),
      explanation: t(
        'Turn the words into an expression first, then evaluate it. "Sum" means add, "difference" means subtract, "product" means multiply and "quotient" means divide. When a description says "twice the difference", the difference must be found first, so it goes in parentheses:\n\n$$2 \\times (20 - 6) = 2 \\times 14 = 28.$$',
        '先把文字改写成算式，再计算。"和"表示加，"差"表示减，"积"表示乘，"商"表示除。像"差的 2 倍"这样的说法，要先求差，所以差要放在括号里：\n\n$$2 \\times (20 - 6) = 2 \\times 14 = 28$$',
      ),
      generate(rng) {
        const p = termPhrase(rng);
        return numberProblem({
          prompt: t(`Find ${p.en}.`, `求${p.zh}。`),
          answer: p.value,
          form: "integer",
          wrong: [p.value + 1, ...(p.slip === undefined ? [] : [p.slip])],
          solution: t(`The expression is $${p.tex} = ${fmt(p.value)}$.`, `列式为 $${p.tex} = ${fmt(p.value)}$。`),
        });
      },
    },
  ],
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
    {
      id: "how-much-greater",
      title: t("How much greater", "大多少"),
      explanation: t(
        "You can compare two expressions without calculating them when they share a part. Look for the part they have in common and see what one adds on top of it. $(512 \\times 46) + 30$ is $512 \\times 46$ with $30$ more, so it is $30$ greater, whatever $512 \\times 46$ equals.",
        "两个算式含有相同的部分时，不必算出结果也能比较。先找出共同的部分，再看其中一个在它的基础上多加了什么。$(512 \\times 46) + 30$ 是在 $512 \\times 46$ 上再加 $30$，所以无论 $512 \\times 46$ 等于多少，它都大 $30$。",
      ),
      generate(rng) {
        const e = bigExpression(rng);
        const k = rng.int(5, 199);
        const [A, B] = rng.bool() ? [`(${e.tex}) + ${k}`, e.tex] : [e.tex, `(${e.tex}) - ${k}`];
        return numberProblem({
          prompt: t(`How much greater is $${A}$ than $${B}$?`, `$${A}$ 比 $${B}$ 大多少？`),
          answer: k,
          form: "integer",
          wrong: [2 * k, e.value, e.value + k],
          solution: t(
            `Both expressions are built from $${e.tex}$. One adds or keeps $${k}$ more than the other, so the difference is $${k}$.`,
            `两个算式都由 $${e.tex}$ 构成，一个比另一个多 $${k}$，所以相差 $${k}$。`,
          ),
        });
      },
    },
    {
      id: "comparing-sums-of-the-same-parts",
      title: t("Sums with a common part", "含有相同部分的和"),
      explanation: t(
        "When two sums share the same parts, cross out what they have in common and compare what is left. $A = 1{,}362 + 485 + 70$ and $B = 1{,}362 + 485$ both contain $1{,}362 + 485$. Only $A$ has the extra $70$, so $A$ is $70$ greater than $B$. There is no need to add up either sum.",
        "两个和含有相同的部分时，把共同的部分划掉，比较剩下的部分。$A = 1{,}362 + 485 + 70$ 和 $B = 1{,}362 + 485$ 都含有 $1{,}362 + 485$，只有 $A$ 多了一个 $70$，所以 $A$ 比 $B$ 大 $70$。两个和都不必算出来。",
      ),
      generate(rng) {
        const [x, y, k] = [rng.int(1000, 9000), rng.int(100, 900), rng.int(5, 95)];
        const bigger = rng.bool();
        const A = bigger ? `${fmt(x)} + ${y} + ${k}` : `${fmt(x)} + ${y} - ${k}`;
        const B = `${fmt(x)} + ${y}`;
        const greater = t(`$A$ is ${k} greater than $B$.`, `$A$ 比 $B$ 大 ${k}。`);
        const lessT = t(`$A$ is ${k} less than $B$.`, `$A$ 比 $B$ 小 ${k}。`);
        const times = t(`$A$ is ${k} times as large as $B$.`, `$A$ 是 $B$ 的 ${k} 倍。`);
        const eq = t("$A$ and $B$ are equal.", "$A$ 与 $B$ 相等。");
        return pickChoice(
          rng,
          t(`$A = ${A}$ and $B = ${B}$. Which statement is true?`, `$A = ${A}$，$B = ${B}$。下面哪种说法正确？`),
          bigger ? greater : lessT,
          [bigger ? lessT : greater, times, eq],
          t(
            `Both sums contain $${B}$. $A$ then ${bigger ? "adds" : "subtracts"} $${k}$, so $A$ is $B$ ${bigger ? "plus" : "minus"} $${k}$: it is ${k} ${bigger ? "greater" : "less"} than $B$.`,
            `两个式子都含有 $${B}$。$A$ 又${bigger ? "加上" : "减去"}了 $${k}$，所以 $A$ 等于 $B$ ${bigger ? "加" : "减"} $${k}$，即 $A$ 比 $B$ ${bigger ? "大" : "小"} ${k}。`,
          ),
        );
      },
    },
  ],
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
    {
      id: "how-many-times-as-large",
      title: t("How many times as large", "是几倍"),
      explanation: t(
        "$8 \\times (325 + 49)$ is $8$ groups of $325 + 49$, and $2 \\times (325 + 49)$ is $2$ groups. Since $8 = 4 \\times 2$, the first is $4$ times as large as the second.",
        "$8 \\times (325 + 49)$ 是 8 个 $325 + 49$，$2 \\times (325 + 49)$ 是 2 个。因为 $8 = 4 \\times 2$，前者是后者的 4 倍。",
      ),
      generate(rng) {
        const [x, y] = [rng.int(100, 999), rng.int(10, 99)];
        const base = `${x} + ${y}`;
        const m = rng.int(1, 4);
        const k = rng.int(2, 9);
        const A = `${k * m} \\times (${base})`;
        const B = m === 1 ? base : `${m} \\times (${base})`;
        return numberProblem({
          prompt: t(`How many times as large as $${B}$ is $${A}$?`, `$${A}$ 是 $${B}$ 的几倍？`),
          answer: k,
          form: "integer",
          wrong: [k * m, k * m - m, m],
          solution: t(
            `$${A}$ is ${k * m} groups of $${base}$ and $${B}$ is ${m}. Since $${k * m} = ${k} \\times ${m}$, it is ${k} times as large.`,
            `$${A}$ 是 ${k * m} 个 $${base}$，$${B}$ 是 ${m} 个。因为 $${k * m} = ${k} \\times ${m}$，所以是 ${k} 倍。`,
          ),
        });
      },
    },
    {
      id: "choosing-the-comparison",
      title: t("Choosing the comparison", "选择正确的比较"),
      explanation: t(
        '$A = 12 \\times (40 + 7)$ and $B = 4 \\times (40 + 7)$. $A$ is $3$ times as large as $B$; it is not "$8$ more", because each group is $47$, not $1$.',
        '$A = 12 \\times (40 + 7)$，$B = 4 \\times (40 + 7)$。$A$ 是 $B$ 的 3 倍；不是"多 8"，因为每组是 47 而不是 1。',
      ),
      generate(rng) {
        const [x, y] = [rng.int(50, 900), rng.int(10, 99)];
        const k = rng.int(2, 6);
        const m = rng.int(2, 5);
        const A = `${k * m} \\times (${x} + ${y})`;
        const B = `${m} \\times (${x} + ${y})`;
        return pickChoice(
          rng,
          t(`$A = ${A}$ and $B = ${B}$. Which statement is true?`, `$A = ${A}$，$B = ${B}$。下面哪种说法正确？`),
          t(`$A$ is ${k} times as large as $B$.`, `$A$ 是 $B$ 的 ${k} 倍。`),
          [
            t(`$A$ is ${k * m - m} more than $B$.`, `$A$ 比 $B$ 多 ${k * m - m}。`),
            t(`$A$ is ${k * m} times as large as $B$.`, `$A$ 是 $B$ 的 ${k * m} 倍。`),
            t(`$B$ is ${k} times as large as $A$.`, `$B$ 是 $A$ 的 ${k} 倍。`),
          ],
          t(
            `$A$ has ${k * m} groups of $${x} + ${y}$ and $B$ has ${m}, and $${k * m} \\div ${m} = ${k}$.`,
            `$A$ 有 ${k * m} 个 $${x} + ${y}$，$B$ 有 ${m} 个，$${k * m} \\div ${m} = ${k}$。`,
          ),
        );
      },
    },
  ],
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
}

const situations: readonly Situation[] = [
  { en: (n) => `The temperature is ${n} degrees below zero.`, zh: (n) => `气温是零下 ${n} 度。`, negative: true },
  { en: (n) => `A diver is ${n} meters below sea level.`, zh: (n) => `潜水员在海平面以下 ${n} 米。`, negative: true },
  { en: (n) => `A bank account is overdrawn by ${n} dollars.`, zh: (n) => `银行账户透支了 ${n} 元。`, negative: true },
  { en: (n) => `A team lost ${n} yards on a play.`, zh: (n) => `一支球队在一次进攻中后退了 ${n} 码。`, negative: true },
  { en: (n) => `A kite flies ${n} meters above the ground.`, zh: (n) => `风筝飞在离地面 ${n} 米高的地方。`, negative: false },
  { en: (n) => `The temperature is ${n} degrees above zero.`, zh: (n) => `气温是零上 ${n} 度。`, negative: false },
  { en: (n) => `A store earned a profit of ${n} dollars.`, zh: (n) => `一家商店盈利 ${n} 元。`, negative: false },
];

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
    {
      id: "reading-negative-numbers-on-number-lines",
      title: t("Reading negative numbers on a number line", "在数轴上读负数"),
      explanation: t(
        "Numbers to the left of $0$ are negative. A point $4$ ticks to the left of $0$, where each tick is $1$, is at $-4$.",
        "$0$ 左边的数是负数。每格表示 $1$ 时，在 $0$ 左边 $4$ 格处的点表示 $-4$。",
      ),
      generate(rng) {
        const every = rng.pick([2, 5]);
        const from = -every * rng.int(2, 4);
        const to = from + every * (every === 2 ? 6 : 4);
        let p: number;
        do p = rng.int(from + 1, Math.min(to - 1, -1));
        while (p % every === 0);
        return {
          ...numberProblem({
            prompt: t("What number is at point $P$?", "点 $P$ 表示什么数？"),
            answer: p,
            form: "integer",
            wrong: [-p, p + 1, p - 1],
            solution: t(
              `Point $P$ is ${-p} tick${p === -1 ? "" : "s"} to the left of $0$, and each tick is $1$, so $P$ is at $${p}$.`,
              `点 $P$ 在 $0$ 左边 ${-p} 格处，每格表示 $1$，所以 $P$ 表示 $${p}$。`,
            ),
          }),
          figure: integerLine(from, to, every, p, "P"),
        };
      },
    },
    {
      id: "negative-numbers-in-context",
      title: t("Negative numbers in context", "生活中的负数"),
      explanation: t(
        '"$12$ meters below sea level" is $-12$ meters, with sea level as $0$. "$12$ meters above sea level" is $+12$, or simply $12$.',
        '以海平面为 $0$，"海平面以下 $12$ 米" 记作 $-12$ 米，"海平面以上 $12$ 米" 记作 $+12$ 米，也就是 $12$ 米。',
      ),
      generate(rng) {
        const s = rng.pick(situations);
        const n = rng.int(2, 60);
        const v = s.negative ? -n : n;
        return numberProblem({
          prompt: t(`${s.en(n)} Write this quantity as a positive or negative number.`, `${s.zh(n)}用正数或负数表示这个量。`),
          answer: v,
          form: "integer",
          wrong: [-v, v + (v > 0 ? 1 : -1)],
          solution: s.negative
            ? t(`It is below the starting level of $0$, so it is negative: $${v}$.`, `它低于起点 $0$，所以是负数：$${v}$。`)
            : t(`It is above the starting level of $0$, so it is positive: $${v}$.`, `它高于起点 $0$，所以是正数：$${v}$。`),
        });
      },
    },
  ],
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
    {
      id: "comparing-two-signed-numbers",
      title: t("Comparing two numbers", "比较两个数"),
      explanation: t(
        "$-15 < -9$: both are negative, and $-15$ is farther from $0$, so it lies farther to the left. Also $-2 < 1$, since any negative number is less than any positive number.",
        "$-15 < -9$：两个都是负数，$-15$ 离 $0$ 更远，在更左边。又如 $-2 < 1$，因为负数都小于正数。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = -rng.int(1, 40);
          b = rng.bool() ? -rng.int(1, 40) : rng.int(0, 40);
        } while (a === b);
        if (rng.bool()) [a, b] = [b, a];
        const rel = Math.sign(a - b) + 1;
        return choiceProblem({
          prompt: t(`Which symbol makes this true? $$${a} \\ \\square \\ ${b}$$`, `方框中应填哪个符号？$$${a} \\ \\square \\ ${b}$$`),
          options: relationOptions,
          correct: rel,
          solution: t(
            `On a number line, $${Math.min(a, b)}$ lies to the left of $${Math.max(a, b)}$, so $${a} ${["<", "=", ">"][rel]} ${b}$.`,
            `在数轴上，$${Math.min(a, b)}$ 在 $${Math.max(a, b)}$ 的左边，所以 $${a} ${["<", "=", ">"][rel]} ${b}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-least-and-greatest",
      title: t("The least and the greatest", "最小和最大"),
      explanation: t(
        "On a number line, numbers grow from left to right, so the least number is the one farthest left and the greatest is the one farthest right. Every negative number is less than $0$, and among negative numbers the one with the larger digits is farther left. Of $-7$, $3$, $-12$ and $0$, the least is $-12$ and the greatest is $3$. A common mistake is to pick $-7$ as less than $-12$ because $7 < 12$.",
        "在数轴上，数从左往右越来越大，所以最小的数在最左边，最大的数在最右边。负数都比 $0$ 小；在负数中，负号后面的数越大，位置越靠左。在 $-7$、$3$、$-12$、$0$ 中，最小的是 $-12$，最大的是 $3$。常见的错误是因为 $7 < 12$ 就认为 $-7$ 比 $-12$ 小。",
      ),
      generate(rng) {
        let xs: number[];
        do {
          const set = new Set<number>();
          while (set.size < 4) set.add(rng.int(-30, 15));
          xs = [...set];
        } while (xs.filter((x) => x < 0).length < 2);
        const least = rng.bool();
        const v = least ? Math.min(...xs) : Math.max(...xs);
        const options = xs.map((x) => mathText(String(x)));
        return choiceProblem({
          prompt: least
            ? t(`Which number is the least: $${xs.join(", ")}$?`, `$${xs.join(", ")}$ 中哪个数最小？`)
            : t(`Which number is the greatest: $${xs.join(", ")}$?`, `$${xs.join(", ")}$ 中哪个数最大？`),
          options,
          correct: xs.indexOf(v),
          solution: t(
            `In order from least to greatest: $${[...xs].sort((a, b) => a - b).join(", ")}$.`,
            `从小到大排列：$${[...xs].sort((a, b) => a - b).join(", ")}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "multiplying-by-a-power-of-ten",
      title: t("Multiplying by 10, 100 or 1,000", "乘 10、100 或 1,000"),
      explanation: t(
        "Multiplying by $10$ makes each digit worth ten times as much, so every digit moves one place to the left and a zero fills the ones place. Multiplying by $100$ moves the digits two places, and by $1{,}000$ three places. So $4{,}050 \\times 1{,}000 = 4{,}050{,}000$: the digits $4$, $0$, $5$, $0$ keep their order and three zeros are added on the right.",
        "乘 $10$ 时，每个数字表示的值都变成原来的十倍，所以每个数字都向左移动一位，个位补一个 $0$。乘 $100$ 向左移两位，乘 $1{,}000$ 向左移三位。所以 $4{,}050 \\times 1{,}000 = 4{,}050{,}000$：数字 $4$、$0$、$5$、$0$ 的顺序不变，右边添上三个 $0$。",
      ),
      generate(rng) {
        const n = rng.bool() ? randomWithDigits(rng, rng.int(2, 4)) : randomWithDigits(rng, rng.int(1, 3)) * 10;
        const k = rng.int(1, 3);
        const p = 10 ** k;
        return numberProblem({
          prompt: t(`Find $${fmt(n)} \\times ${fmt(p)}$.`, `计算 $${fmt(n)} \\times ${fmt(p)}$。`),
          answer: n * p,
          form: "integer",
          wrong: [n * p * 10, n * (p / 10 || 1), n + p],
          solution: t(
            `Multiplying by $${fmt(p)}$ moves every digit ${k} place${k > 1 ? "s" : ""} to the left: $${fmt(n)} \\times ${fmt(p)} = ${fmt(n * p)}$.`,
            `乘 $${fmt(p)}$，每个数字向左移动 ${k} 位：$${fmt(n)} \\times ${fmt(p)} = ${fmt(n * p)}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-missing-factor",
      title: t("Finding the missing factor", "求未知因数"),
      explanation: t(
        "Compare the number before and after to see how many places the digits moved. Each place is one factor of $10$. In $56 \\times \\square = 56{,}000$ the digits $56$ moved three places to the left, so $\\square = 1{,}000$. If the power of ten is given instead, move the digits back: $\\square \\times 100 = 7{,}300$ means $\\square$ is $7{,}300$ with the digits moved two places right, which is $73$.",
        "比较乘之前和乘之后的数，看数字移动了几位，每移动一位就是乘一个 $10$。在 $56 \\times \\square = 56{,}000$ 中，数字 $56$ 向左移动了三位，所以 $\\square = 1{,}000$。如果已知的是 10 的幂，就把数字移回去：$\\square \\times 100 = 7{,}300$，把 $7{,}300$ 的数字向右移两位，得 $\\square = 73$。",
      ),
      generate(rng) {
        const n = randomWithDigits(rng, rng.int(2, 4));
        const k = rng.int(1, 3);
        const p = 10 ** k;
        if (rng.bool())
          return numberProblem({
            prompt: t(
              `Find the missing number: $${fmt(n)} \\times \\square = ${fmt(n * p)}$.`,
              `求方框中的数：$${fmt(n)} \\times \\square = ${fmt(n * p)}$。`,
            ),
            answer: p,
            form: "integer",
            wrong: [p * 10, p / 10 === 1 ? 100 : p / 10, k],
            solution: t(
              `The digits of $${fmt(n)}$ moved ${k} place${k > 1 ? "s" : ""} left, so the factor is $${fmt(p)}$.`,
              `$${fmt(n)}$ 的数字向左移动了 ${k} 位，所以因数是 $${fmt(p)}$。`,
            ),
          });
        return numberProblem({
          prompt: t(
            `Find the missing number: $\\square \\times ${fmt(p)} = ${fmt(n * p)}$.`,
            `求方框中的数：$\\square \\times ${fmt(p)} = ${fmt(n * p)}$。`,
          ),
          answer: n,
          form: "integer",
          wrong: [n * 10, Math.floor(n / 10), n * p],
          solution: t(
            `Move the digits of $${fmt(n * p)}$ back ${k} place${k > 1 ? "s" : ""} to the right: $${fmt(n)}$.`,
            `把 $${fmt(n * p)}$ 的数字向右移回 ${k} 位：$${fmt(n)}$。`,
          ),
        });
      },
    },
  ],
);

/** oneDigitProduct asks for n × a with the standard algorithm, n having `digits` digits. */
function oneDigitProduct(rng: Rng, digits: number): Problem {
  const n = randomWithDigits(rng, digits);
  const a = rng.int(3, 9);
  return numberProblem({
    prompt: t(`Find $${fmt(n)} \\times ${a}$.`, `计算 $${fmt(n)} \\times ${a}$。`),
    answer: n * a,
    form: "integer",
    wrong: [noCarry(n, a), n * a + 10 ** (digits - 1), n * (a - 1)],
    solution: multiplySteps(n, a),
  });
}

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
    {
      id: "multiplying-with-the-standard-algorithm",
      title: t("The standard algorithm", "竖式计算"),
      explanation: t(
        "In the standard algorithm, multiply the ones digit first. Write the ones digit of that product and carry the tens to the next column. Then multiply the tens digit and add the carry.\n\nFor $58 \\times 7$: $7 \\times 8 = 56$, write $6$ and carry $5$. Then $7 \\times 5 = 35$, plus the carried $5$ is $40$. So $58 \\times 7 = 406$. Forgetting to add the carry would give $356$.",
        "用竖式计算时，先用一位数乘个位，把积的个位写下来，十位上的数进到下一位；再乘十位，并加上进位。\n\n计算 $58 \\times 7$：$7 \\times 8 = 56$，写 $6$ 进 $5$；$7 \\times 5 = 35$，加上进位的 $5$ 得 $40$。所以 $58 \\times 7 = 406$。如果忘了加进位，就会错算成 $356$。",
      ),
      generate: (rng) => oneDigitProduct(rng, 2),
    },
    {
      id: "two-digit-by-one-digit-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "When a problem has equal groups, multiply the size of one group by the number of groups. Find the two numbers first: here $8$ rows is the number of groups and $36$ chairs is the size of each row. Then multiply: $36 \\times 8 = 288$ chairs in all.",
        "题目里有几个相同的组时，用每组的数量乘组数。先找出这两个数：$8$ 排是组数，每排 $36$ 把是每组的数量。再相乘：一共 $36 \\times 8 = 288$ 把椅子。",
      ),
      generate(rng) {
        const n = rng.int(12, 99);
        const a = rng.int(3, 9);
        const s = rng.pick(productStories);
        return numberProblem({
          prompt: t(s.en(n, a), s.zh(n, a)),
          answer: n * a,
          form: "integer",
          wrong: [n + a, noCarry(n, a), n * (a + 1)],
          solution: multiplySteps(n, a),
        });
      },
    },
  ],
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
    {
      id: "three-digit-by-one-digit",
      title: t("Three-digit numbers", "三位数乘一位数"),
      explanation: t(
        "Multiply each digit by the one-digit number, from right to left. After each step, write one digit and carry the rest to the next column, where it is added after multiplying.\n\nFor $436 \\times 7$: $7 \\times 6 = 42$, write $2$ carry $4$. $7 \\times 3 = 21$, plus $4$ is $25$, write $5$ carry $2$. $7 \\times 4 = 28$, plus $2$ is $30$. So $436 \\times 7 = 3{,}052$.",
        "从右往左，用一位数依次乘每一位。每一步写下一个数字，其余进到下一位，乘完下一位后再加上。\n\n计算 $436 \\times 7$：$7 \\times 6 = 42$，写 $2$ 进 $4$；$7 \\times 3 = 21$，加 $4$ 得 $25$，写 $5$ 进 $2$；$7 \\times 4 = 28$，加 $2$ 得 $30$。所以 $436 \\times 7 = 3{,}052$。",
      ),
      generate: (rng) => oneDigitProduct(rng, 3),
    },
    {
      id: "four-digit-by-one-digit",
      title: t("Four-digit numbers", "四位数乘一位数"),
      explanation: t(
        "A four-digit number is multiplied the same way, one column at a time from the right, carrying as you go. Be careful with a zero digit: its product is $0$, but the carry from the column before must still be added.\n\nFor $5{,}208 \\times 6$: $6 \\times 8 = 48$, write $8$ carry $4$. $6 \\times 0 + 4 = 4$. $6 \\times 2 = 12$, write $2$ carry $1$. $6 \\times 5 + 1 = 31$. So $5{,}208 \\times 6 = 31{,}248$.",
        "四位数乘一位数也是从右往左一位一位地乘，边乘边进位。遇到 $0$ 要小心：$0$ 乘任何数都得 $0$，但前一位的进位仍要加上。\n\n计算 $5{,}208 \\times 6$：$6 \\times 8 = 48$，写 $8$ 进 $4$；$6 \\times 0 + 4 = 4$；$6 \\times 2 = 12$，写 $2$ 进 $1$；$6 \\times 5 + 1 = 31$。所以 $5{,}208 \\times 6 = 31{,}248$。",
      ),
      generate: (rng) => oneDigitProduct(rng, 4),
    },
  ],
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
    {
      id: "five-digit-by-one-digit",
      title: t("Five-digit numbers", "五位数乘一位数"),
      explanation: t(
        "Longer numbers use the same steps as shorter ones: multiply each digit from right to left, write one digit and carry the rest. Keep the columns lined up and add every carry.\n\nFor $30{,}457 \\times 8$: $8 \\times 7 = 56$ (write $6$, carry $5$); $8 \\times 5 + 5 = 45$ (write $5$, carry $4$); $8 \\times 4 + 4 = 36$ (write $6$, carry $3$); $8 \\times 0 + 3 = 3$; $8 \\times 3 = 24$. So $30{,}457 \\times 8 = 243{,}656$.",
        "位数多的数，乘法步骤和位数少时一样：从右往左依次乘每一位，写下一个数字，其余进位。注意数位要对齐，每次的进位都要加上。\n\n计算 $30{,}457 \\times 8$：$8 \\times 7 = 56$（写 $6$ 进 $5$）；$8 \\times 5 + 5 = 45$（写 $5$ 进 $4$）；$8 \\times 4 + 4 = 36$（写 $6$ 进 $3$）；$8 \\times 0 + 3 = 3$；$8 \\times 3 = 24$。所以 $30{,}457 \\times 8 = 243{,}656$。",
      ),
      generate: (rng) => oneDigitProduct(rng, 5),
    },
    {
      id: "six-digit-by-one-digit",
      title: t("Six-digit numbers", "六位数乘一位数"),
      explanation: t(
        "A six-digit number takes six steps, one for each digit, but each step is the same: multiply, add the carry, write one digit, carry the rest. A zero digit still passes its carry along.\n\nFor $215{,}806 \\times 4$: $24$ (write $4$, carry $2$); $0 + 2 = 2$; $32$ (write $2$, carry $3$); $20 + 3 = 23$ (write $3$, carry $2$); $4 + 2 = 6$; $8$. So $215{,}806 \\times 4 = 863{,}224$. Estimate to check: $200{,}000 \\times 4 = 800{,}000$ is close.",
        "六位数要乘六次，每一位乘一次，但每一步都一样：相乘，加进位，写下一个数字，其余进位。遇到 $0$ 时也要把进位传下去。\n\n计算 $215{,}806 \\times 4$：$24$（写 $4$ 进 $2$）；$0 + 2 = 2$；$32$（写 $2$ 进 $3$）；$20 + 3 = 23$（写 $3$ 进 $2$）；$4 + 2 = 6$；$8$。所以 $215{,}806 \\times 4 = 863{,}224$。可以用估算检查：$200{,}000 \\times 4 = 800{,}000$，结果接近。",
      ),
      generate: (rng) => oneDigitProduct(rng, 6),
    },
  ],
);

/** twoDigitNoZero draws a two-digit number whose digits are both nonzero. */
const twoDigitNoZero = (rng: Rng) => rng.int(1, 9) * 10 + rng.int(1, 9);

/** multiDigitProduct asks for n × m with partial products. */
function multiDigitProduct(n: number, m: number): Problem {
  return numberProblem({
    prompt: t(`Find $${fmt(n)} \\times ${fmt(m)}$.`, `计算 $${fmt(n)} \\times ${fmt(m)}$。`),
    answer: n * m,
    form: "integer",
    wrong: [forgetPlaces(n, m), n * m + 10 * n, n * m - n],
    solution: partialProducts(n, m),
  });
}

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
    {
      id: "partial-product-of-the-tens-digit",
      title: t("The partial product of the tens digit", "十位数字的部分积"),
      explanation: t(
        "In the standard algorithm, each digit of the second factor gives its own partial product. The tens digit stands for tens, so multiply by its full value. In $64 \\times 27$ the $2$ means $20$, and its partial product is $64 \\times 20 = 1{,}280$. That is why the second row of the algorithm starts with a $0$ in the ones place. Writing $64 \\times 2 = 128$ without the zero is the most common mistake.",
        "用竖式计算时，第二个因数的每一位都会得到一个部分积。十位上的数表示几个十，所以要乘它实际表示的值。在 $64 \\times 27$ 中，$2$ 表示 $20$，它的部分积是 $64 \\times 20 = 1{,}280$。所以竖式第二行的个位要写 $0$（或空出来）。最常见的错误是写成 $64 \\times 2 = 128$，漏掉了 $0$。",
      ),
      generate(rng) {
        const n = twoDigitNoZero(rng);
        const m = twoDigitNoZero(rng);
        const tens = Math.floor(m / 10);
        return numberProblem({
          prompt: t(
            `In the standard algorithm for $${n} \\times ${m}$, what is the partial product for the tens digit of $${m}$?`,
            `用竖式计算 $${n} \\times ${m}$ 时，$${m}$ 十位上的数字对应的部分积是多少？`,
          ),
          answer: n * tens * 10,
          form: "integer",
          wrong: [n * tens, n * (m % 10), n * m],
          solution: t(
            `The tens digit ${tens} stands for ${tens * 10}: $${n} \\times ${tens * 10} = ${fmt(n * tens * 10)}$.`,
            `十位上的 ${tens} 表示 ${tens * 10}：$${n} \\times ${tens * 10} = ${fmt(n * tens * 10)}$。`,
          ),
        });
      },
    },
    {
      id: "multiplying-two-digit-numbers",
      title: t("Finding the product", "求积"),
      explanation: t(
        "Split the second factor into tens and ones, find a partial product for each, and add them.\n\nFor $38 \\times 45$: the ones give $38 \\times 5 = 190$ and the tens give $38 \\times 40 = 1{,}520$. Adding the partial products, $38 \\times 45 = 190 + 1{,}520 = 1{,}710$. To check, estimate $40 \\times 45 = 1{,}800$, which is close.",
        "把第二个因数分成几个十和几个一，分别求出部分积，再把它们相加。\n\n计算 $38 \\times 45$：个位得 $38 \\times 5 = 190$，十位得 $38 \\times 40 = 1{,}520$。把部分积相加，$38 \\times 45 = 190 + 1{,}520 = 1{,}710$。可以估算检查：$40 \\times 45 = 1{,}800$，结果接近。",
      ),
      generate: (rng) => multiDigitProduct(rng.int(12, 99), twoDigitNoZero(rng)),
    },
  ],
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
    {
      id: "three-digit-by-two-digit",
      title: t("Three-digit by two-digit", "三位数乘两位数"),
      explanation: t(
        "Multiply the whole first number by the ones digit, then by the tens digit (which stands for tens), and add the two partial products.\n\nFor $407 \\times 36$: $407 \\times 6 = 2{,}442$ and $407 \\times 30 = 12{,}210$. So $407 \\times 36 = 2{,}442 + 12{,}210 = 14{,}652$. The zero in $407$ still needs its carry in each row.",
        "先用个位上的数去乘整个第一个数，再用十位上的数（表示几个十）去乘，最后把两个部分积相加。\n\n计算 $407 \\times 36$：$407 \\times 6 = 2{,}442$，$407 \\times 30 = 12{,}210$。所以 $407 \\times 36 = 2{,}442 + 12{,}210 = 14{,}652$。每一行中，$407$ 里的 $0$ 那一位都别忘了加进位。",
      ),
      generate: (rng) => multiDigitProduct(randomWithDigits(rng, 3), twoDigitNoZero(rng)),
    },
    {
      id: "four-digit-by-two-digit",
      title: t("Four-digit by two-digit", "四位数乘两位数"),
      explanation: t(
        "A four-digit number times a two-digit number still has two partial products: one for the ones digit and one for the tens digit. Line up the columns and add.\n\nFor $2{,}315 \\times 42$: $2{,}315 \\times 2 = 4{,}630$ and $2{,}315 \\times 40 = 92{,}600$. So $2{,}315 \\times 42 = 4{,}630 + 92{,}600 = 97{,}230$. Estimate to check: $2{,}000 \\times 40 = 80{,}000$, so the answer is near $100{,}000$, not near $10{,}000$.",
        "四位数乘两位数，仍然只有两个部分积：一个来自个位，一个来自十位。数位对齐后相加。\n\n计算 $2{,}315 \\times 42$：$2{,}315 \\times 2 = 4{,}630$，$2{,}315 \\times 40 = 92{,}600$。所以 $2{,}315 \\times 42 = 4{,}630 + 92{,}600 = 97{,}230$。可以估算检查：$2{,}000 \\times 40 = 80{,}000$，结果应接近 $100{,}000$，而不是 $10{,}000$。",
      ),
      generate: (rng) => multiDigitProduct(randomWithDigits(rng, 4), twoDigitNoZero(rng)),
    },
  ],
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
    {
      id: "partial-product-of-the-hundreds-digit",
      title: t("The partial product of the hundreds digit", "百位数字的部分积"),
      explanation: t(
        "The hundreds digit stands for hundreds, so its partial product is the first factor times that many hundreds. In $326 \\times 241$ the $2$ means $200$, and its partial product is $326 \\times 200 = 65{,}200$. In the algorithm this row ends in two zeros. Writing $326 \\times 2 = 652$ in that row would be off by a factor of $100$.",
        "百位上的数表示几个百，所以它的部分积是第一个因数乘这么多个百。在 $326 \\times 241$ 中，$2$ 表示 $200$，部分积是 $326 \\times 200 = 65{,}200$。在竖式里，这一行末尾有两个 $0$。如果这一行写成 $326 \\times 2 = 652$，就小了 $100$ 倍。",
      ),
      generate(rng) {
        const n = randomWithDigits(rng, 3);
        const m = randomWithDigits(rng, 3);
        const h = Math.floor(m / 100);
        return numberProblem({
          prompt: t(
            `In the standard algorithm for $${n} \\times ${m}$, what is the partial product for the hundreds digit of $${m}$?`,
            `用竖式计算 $${n} \\times ${m}$ 时，$${m}$ 百位上的数字对应的部分积是多少？`,
          ),
          answer: n * h * 100,
          form: "integer",
          wrong: [n * h, n * h * 10, n * m],
          solution: t(
            `The hundreds digit ${h} stands for ${h * 100}: $${n} \\times ${h * 100} = ${fmt(n * h * 100)}$.`,
            `百位上的 ${h} 表示 ${h * 100}：$${n} \\times ${h * 100} = ${fmt(n * h * 100)}$。`,
          ),
        });
      },
    },
    {
      id: "multiplying-three-digit-numbers",
      title: t("Finding the product", "求积"),
      explanation: t(
        "Find one partial product for each digit of the second factor (ones, tens, hundreds) and add them. A zero digit gives a partial product of $0$, so that row can be skipped.\n\nFor $152 \\times 304$: the ones give $152 \\times 4 = 608$, the tens give $0$, and the hundreds give $152 \\times 300 = 45{,}600$. So $152 \\times 304 = 608 + 45{,}600 = 46{,}208$.",
        "第二个因数的每一位（个位、十位、百位）各得到一个部分积，再把它们相加。某一位是 $0$ 时，部分积是 $0$，这一行可以省去。\n\n计算 $152 \\times 304$：个位得 $152 \\times 4 = 608$，十位得 $0$，百位得 $152 \\times 300 = 45{,}600$。所以 $152 \\times 304 = 608 + 45{,}600 = 46{,}208$。",
      ),
      generate: (rng) => multiDigitProduct(randomWithDigits(rng, 3), randomWithDigits(rng, 3)),
    },
  ],
);

// ---------------------------------------------------------------------------
// Dividing whole numbers

/** exactDivision asks for n ÷ d where the division is exact, using long division in the solution. */
function exactDivision(n: number, d: number): Problem {
  const q = n / d;
  return numberProblem({
    prompt: t(`Find $${fmt(n)} \\div ${d}$.`, `计算 $${fmt(n)} \\div ${d}$。`),
    answer: q,
    form: "integer",
    wrong: [dropZeros(q), q + 1, q * 10],
    solution: divisionSteps(n, d),
  });
}

/** remainderDivision asks for n ÷ d, with a remainder, as a choice of quotient and remainder. */
function remainderDivision(rng: Rng, n: number, d: number): Problem {
  const q = Math.floor(n / d);
  const r = n % d;
  return pickChoice(
    rng,
    t(`Find $${fmt(n)} \\div ${d}$.`, `计算 $${fmt(n)} \\div ${d}$。`),
    qrText(q, r),
    [qrText(q - 1, r + d), qrText(q + 1, r), qrText(dropZeros(q), r), qrText(q, (r + 1) % d || 1)],
    divisionSteps(n, d),
  );
}

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
    {
      id: "two-digit-dividends-without-remainders",
      title: t("Without a remainder", "没有余数"),
      explanation: t(
        "Long division works one digit at a time from the left. Divide, multiply, subtract, then bring down the next digit and repeat.\n\nFor $96 \\div 4$: $9 \\div 4$ is $2$, and $9 - 8 = 1$. Bring down $6$ to make $16$; $16 \\div 4 = 4$. So $96 \\div 4 = 24$. Check by multiplying: $24 \\times 4 = 96$.",
        "除法竖式从最高位开始，一位一位地除：除、乘、减，再落下下一位，重复这几步。\n\n计算 $96 \\div 4$：$9 \\div 4$ 商 $2$，$9 - 8 = 1$；落下 $6$ 得 $16$，$16 \\div 4 = 4$。所以 $96 \\div 4 = 24$。用乘法验算：$24 \\times 4 = 96$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        return exactDivision(dividend(rng, d, 2, true), d);
      },
    },
    {
      id: "two-digit-dividends-with-remainders",
      title: t("With a remainder", "有余数"),
      explanation: t(
        "Divide the same way as without a remainder. When no digits are left to bring down, whatever is left after the last subtraction is the remainder. It must be less than the divisor.\n\nFor $79 \\div 3$: $7 \\div 3$ is $2$, $7 - 6 = 1$; bring down $9$ to make $19$; $19 \\div 3$ is $6$, $19 - 18 = 1$. So $79 \\div 3 = 26 \\text{ R } 1$. Check: $26 \\times 3 + 1 = 79$.",
        "和没有余数时一样地除。没有数位可以落下时，最后一次相减剩下的数就是余数，余数一定比除数小。\n\n计算 $79 \\div 3$：$7 \\div 3$ 商 $2$，$7 - 6 = 1$；落下 $9$ 得 $19$，$19 \\div 3$ 商 $6$，$19 - 18 = 1$。所以 $79 \\div 3 = 26 \\cdots\\cdots 1$。验算：$26 \\times 3 + 1 = 79$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        return remainderDivision(rng, dividend(rng, d, 2, false), d);
      },
    },
  ],
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
    {
      id: "three-digit-dividends-without-remainders",
      title: t("Without a remainder", "没有余数"),
      explanation: t(
        "Divide digit by digit from the left. If a step's number is smaller than the divisor, write $0$ in the quotient for that place and bring down the next digit. Skipping that $0$ is the most common mistake.\n\nFor $728 \\div 7$: $7 \\div 7$ is $1$. Then $2 \\div 7$ is $0$, so write $0$. Bring down $8$ to make $28$; $28 \\div 7 = 4$. So $728 \\div 7 = 104$, not $14$.",
        "从最高位起一位一位地除。如果某一步的数比除数小，就在商的这一位写 $0$，再落下下一位。漏写这个 $0$ 是最常见的错误。\n\n计算 $728 \\div 7$：$7 \\div 7$ 商 $1$；$2 \\div 7$ 不够商 1，商 $0$；落下 $8$ 得 $28$，$28 \\div 7 = 4$。所以 $728 \\div 7 = 104$，而不是 $14$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        return exactDivision(dividend(rng, d, 3, true), d);
      },
    },
    {
      id: "three-digit-dividends-with-remainders",
      title: t("With a remainder", "有余数"),
      explanation: t(
        "If the first digit is smaller than the divisor, start with the first two digits. Then divide, multiply, subtract and bring down as usual. What is left at the end is the remainder.\n\nFor $457 \\div 6$: $4$ is less than $6$, so start with $45$. $45 \\div 6$ is $7$, $45 - 42 = 3$. Bring down $7$ to make $37$; $37 \\div 6$ is $6$, $37 - 36 = 1$. So $457 \\div 6 = 76 \\text{ R } 1$.",
        "如果最高位比除数小，就先用前两位去除。然后照常除、乘、减、落下，最后剩下的就是余数。\n\n计算 $457 \\div 6$：$4$ 比 $6$ 小，先看 $45$。$45 \\div 6$ 商 $7$，$45 - 42 = 3$；落下 $7$ 得 $37$，$37 \\div 6$ 商 $6$，$37 - 36 = 1$。所以 $457 \\div 6 = 76 \\cdots\\cdots 1$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        return remainderDivision(rng, dividend(rng, d, 3, false), d);
      },
    },
  ],
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
    {
      id: "four-digit-dividends-without-remainders",
      title: t("Without a remainder", "没有余数"),
      explanation: t(
        "A four-digit dividend uses the same steps, repeated once more: divide, multiply, subtract, bring down.\n\nFor $4{,}235 \\div 5$: $4$ is less than $5$, so start with $42$. $42 \\div 5$ is $8$, $42 - 40 = 2$. Bring down $3$: $23 \\div 5$ is $4$, $23 - 20 = 3$. Bring down $5$: $35 \\div 5 = 7$. So $4{,}235 \\div 5 = 847$. Check: $847 \\times 5 = 4{,}235$.",
        "被除数是四位数时，步骤相同，只是多重复一次：除、乘、减、落下。\n\n计算 $4{,}235 \\div 5$：$4$ 比 $5$ 小，先看 $42$。$42 \\div 5$ 商 $8$，$42 - 40 = 2$；落下 $3$，$23 \\div 5$ 商 $4$，$23 - 20 = 3$；落下 $5$，$35 \\div 5 = 7$。所以 $4{,}235 \\div 5 = 847$。验算：$847 \\times 5 = 4{,}235$。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        return exactDivision(dividend(rng, d, 4, true), d);
      },
    },
    {
      id: "four-digit-dividends-with-remainders",
      title: t("With a remainder", "有余数"),
      explanation: t(
        "Divide step by step, and remember to write $0$ in the quotient whenever a step is too small to divide. The amount left after the last digit is the remainder.\n\nFor $6{,}053 \\div 4$: $6 \\div 4$ is $1$, remainder $2$. Bring down $0$: $20 \\div 4 = 5$. Bring down $5$: $5 \\div 4$ is $1$, remainder $1$. Bring down $3$: $13 \\div 4$ is $3$, remainder $1$. So $6{,}053 \\div 4 = 1{,}513 \\text{ R } 1$. Check: $1{,}513 \\times 4 + 1 = 6{,}053$.",
        "一步一步地除，某一步不够除时记得在商的这一位写 $0$。除完最后一位后剩下的就是余数。\n\n计算 $6{,}053 \\div 4$：$6 \\div 4$ 商 $1$ 余 $2$；落下 $0$，$20 \\div 4 = 5$；落下 $5$，$5 \\div 4$ 商 $1$ 余 $1$；落下 $3$，$13 \\div 4$ 商 $3$ 余 $1$。所以 $6{,}053 \\div 4 = 1{,}513 \\cdots\\cdots 1$。验算：$1{,}513 \\times 4 + 1 = 6{,}053$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        return remainderDivision(rng, dividend(rng, d, 4, false), d);
      },
    },
  ],
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
    {
      id: "quotients-as-mixed-numbers",
      title: t("Writing a quotient as a mixed number", "把商写成带分数"),
      explanation: t(
        "A division can be written as a fraction: $23 \\div 4 = \\frac{23}{4}$. To write it as a mixed number, find how many whole times the divisor fits and what is left. The remainder becomes the numerator, and the divisor stays as the denominator.\n\n$4 \\times 5 = 20$ and $23 - 20 = 3$, so $23 \\div 4 = 5\\frac{3}{4}$.",
        "除法可以写成分数：$23 \\div 4 = \\frac{23}{4}$。要写成带分数，先看除数能整除几次、还剩多少：余数作分子，除数作分母。\n\n$4 \\times 5 = 20$，$23 - 20 = 3$，所以 $23 \\div 4 = 5\\frac{3}{4}$。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          b = rng.int(2, 12);
          a = rng.int(b + 1, 9 * b);
        } while (a % b === 0 || gcdOf(a % b, b) !== 1);
        const q = Math.floor(a / b);
        return numberProblem({
          prompt: t(`Write $${a} \\div ${b}$ as a mixed number.`, `把 $${a} \\div ${b}$ 写成带分数。`),
          answer: Q.of(a, b),
          form: "mixed",
          wrong: [Q.of(b, a), Q.of(q * b + (a % b), b * b), q, Q.of(q * 10 + (a % b), 10)],
          solution: t(
            `$${b} \\times ${q} = ${b * q}$ and $${a} - ${b * q} = ${a % b}$ are left, so $${a} \\div ${b} = ${mixedTex(a, b)}$.`,
            `$${b} \\times ${q} = ${b * q}$，还剩 $${a} - ${b * q} = ${a % b}$，所以 $${a} \\div ${b} = ${mixedTex(a, b)}$。`,
          ),
        });
      },
    },
    {
      id: "fair-shares-as-fractions-or-mixed-numbers",
      title: t("Fair shares", "平均分"),
      explanation: t(
        "Sharing equally is division. The amount being shared is divided by the number of people, and the answer can be a fraction or a mixed number. When $4$ friends share $7$ pizzas, each gets $7 \\div 4 = \\frac{7}{4} = 1\\frac{3}{4}$ pizzas: one whole pizza and three quarters of another. Be careful not to flip it: $\\frac{4}{7}$ would be the share if $7$ people shared $4$ pizzas.",
        "平均分就是除法：用要分的总量除以人数，结果可以是分数或带分数。$4$ 个朋友平均分 $7$ 个比萨饼，每人分得 $7 \\div 4 = \\frac{7}{4} = 1\\frac{3}{4}$ 个，也就是一整个再加另一个的四分之三。注意不要颠倒：$\\frac{4}{7}$ 是 $7$ 个人分 $4$ 个比萨饼时每人分到的量。",
      ),
      generate(rng) {
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
        const answerTex = a > b ? `\\frac{${a}}{${b}} = ${mixedTex(a, b)}` : `\\frac{${a}}{${b}}`;
        return numberProblem({
          prompt: t(
            `${name} shares ${a} ${item.en} equally among ${b} people. How much does each person get?`,
            `${name} 把 ${a} ${item.zh}平均分给 ${b} 个人，每人分得多少？`,
          ),
          answer: Q.of(a, b),
          form: "mixed",
          wrong: [Q.of(b, a), Math.floor(a / b) || 1, Q.of(a, b * 2)],
          solution: t(`Each person gets $${a} \\div ${b} = ${answerTex}$.`, `每人分得 $${a} \\div ${b} = ${answerTex}$。`),
        });
      },
    },
  ],
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
    {
      id: "rounding-a-quotient-to-a-whole-number",
      title: t("Rounding a quotient", "商取整数近似值"),
      explanation: t(
        "To round a quotient to the nearest whole number, look at the remainder. If it is less than half the divisor, keep the quotient. If it is half or more, round up by $1$.\n\n$250 \\div 7 = 35 \\text{ R } 5$. Half of $7$ is $3\\frac{1}{2}$, and $5$ is more than that, so the quotient is closer to $36$. Rounded, $250 \\div 7 \\approx 36$.",
        "把商四舍五入到整数时，要看余数：余数小于除数的一半，商不变；余数等于或大于除数的一半，商加 $1$。\n\n$250 \\div 7 = 35 \\cdots\\cdots 5$。$7$ 的一半是 $3\\frac{1}{2}$，$5$ 比它大，所以商更接近 $36$。四舍五入后 $250 \\div 7 \\approx 36$。",
      ),
      generate(rng) {
        let n: number;
        let d: number;
        do {
          d = rng.int(3, 9);
          n = rng.int(30, 999);
        } while (n % d === 0 || 2 * (n % d) === d);
        const q = Math.floor(n / d);
        const r = n % d;
        const up = 2 * r > d;
        return numberProblem({
          prompt: t(
            `Find $${fmt(n)} \\div ${d}$, rounded to the nearest whole number.`,
            `计算 $${fmt(n)} \\div ${d}$，结果四舍五入到整数。`,
          ),
          answer: up ? q + 1 : q,
          form: "integer",
          wrong: [up ? q : q + 1, r, q - 1],
          solution: t(
            `$${fmt(n)} \\div ${d} = ${qr(q, r).en}$. The remainder ${r} is ${up ? "more" : "less"} than half of ${d}, so round ${up ? "up to" : "down to"} $${up ? q + 1 : q}$.`,
            `$${fmt(n)} \\div ${d} = ${qr(q, r).zh}$。余数 ${r} ${up ? "大于" : "小于"} ${d} 的一半，所以结果约为 $${up ? q + 1 : q}$。`,
          ),
        });
      },
    },
    {
      id: "rounded-quotients-in-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "A $95$-kilometer trip takes $4$ days. Each day covers about $95 \\div 4 = 23 \\text{ R } 3$, so about $24$ kilometers to the nearest kilometer.",
        "$95$ 千米的路程走了 $4$ 天，平均每天约走 $95 \\div 4 = 23 \\cdots\\cdots 3$，四舍五入约为 $24$ 千米。",
      ),
      generate(rng) {
        let n: number;
        let d: number;
        do {
          d = rng.int(3, 9);
          n = rng.int(40, 900);
        } while (n % d === 0 || 2 * (n % d) === d);
        const q = Math.floor(n / d);
        const r = n % d;
        const up = 2 * r > d;
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
        return numberProblem({
          prompt: t(s.en, s.zh),
          answer: up ? q + 1 : q,
          form: "integer",
          wrong: [up ? q : q + 1, r, n - d],
          solution: t(
            `$${n} \\div ${d} = ${qr(q, r).en}$, and ${r} is ${up ? "more" : "less"} than half of ${d}, so the answer is about $${up ? q + 1 : q}$.`,
            `$${n} \\div ${d} = ${qr(q, r).zh}$，${r} ${up ? "大于" : "小于"} ${d} 的一半，所以约为 $${up ? q + 1 : q}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "deciding-what-to-do-with-the-remainder",
      title: t("Deciding what to do with the remainder", "决定怎样处理余数"),
      explanation: t(
        '"How many vans are needed?" means everyone must ride, so a remainder needs one more van. "How many cakes can be made?" counts only complete cakes, so the remainder is dropped.',
        '"需要多少辆车？" 意味着每个人都要坐上车，所以有余数时要多加一辆车。"能做多少个蛋糕？" 只算完整的蛋糕，所以舍去余数。',
      ),
      generate(rng) {
        const s = rng.pick(remainderStories);
        const d = rng.int(3, 9);
        const n = dividend(rng, d, 3, false);
        const q = Math.floor(n / d);
        const r = n % d;
        const options = [
          t(`Round up: ${q + 1}`, `商加 1：${q + 1}`),
          t(`Drop the remainder: ${q}`, `舍去余数：${q}`),
          t(`Use the remainder: ${r}`, `取余数：${r}`),
        ];
        const correct = s.use === "up" ? 0 : s.use === "drop" ? 1 : 2;
        return choiceProblem({
          prompt: t(
            `${s.en(n, d)} Since $${n} \\div ${d} = ${qr(q, r).en}$, what is the answer?`,
            `${s.zh(n, d)}因为 $${n} \\div ${d} = ${qr(q, r).zh}$，答案是什么？`,
          ),
          options,
          correct,
          solution: [
            t(
              `Everything must be included, so one more group is needed for the ${r} left over: ${q + 1}.`,
              `所有的都要包含进去，剩下的 ${r} 个还需要再加一组：${q + 1}。`,
            ),
            t(`Only complete groups count, so the ${r} left over are dropped: ${q}.`, `只算完整的组，剩下的 ${r} 个舍去：${q}。`),
            t(`The question asks how many are left over, which is the remainder: ${r}.`, `问题问的是剩下多少，就是余数：${r}。`),
          ][correct]!,
        });
      },
    },
    {
      id: "solving-remainder-word-problems",
      title: t("Solving the problem", "解答应用题"),
      explanation: t(
        "In a word problem, decide what the remainder means before answering. If everyone must be carried, the leftover people need one more trip, so round up. If the question asks how many complete groups can be made, the leftover is not enough for another group, so drop it.\n\n$1{,}250$ people ride a ferry that carries $8$ at a time: $1{,}250 \\div 8 = 156 \\text{ R } 2$. The $2$ people left still need a trip, so $157$ trips are needed.",
        "在应用题中，先想清楚余数表示什么，再作答。如果所有人都要运走，剩下的人还需要再运一趟，就要把商加 1；如果问最多能组成几个完整的组，剩下的不够再组成一组，就把余数舍去。\n\n$1{,}250$ 人乘渡船，每次能载 $8$ 人：$1{,}250 \\div 8 = 156 \\cdots\\cdots 2$。剩下的 $2$ 人还要再运一趟，所以需要 $157$ 趟。",
      ),
      generate(rng) {
        const s = rng.pick(remainderStories);
        const d = rng.int(3, 9);
        const n = dividend(rng, d, rng.int(3, 4), false);
        const q = Math.floor(n / d);
        const r = n % d;
        const answer = s.use === "up" ? q + 1 : s.use === "drop" ? q : r;
        return numberProblem({
          prompt: t(s.en(n, d), s.zh(n, d)),
          answer,
          form: "integer",
          wrong: [q, q + 1, r].filter((w) => w !== answer),
          solution: t(
            `$${fmt(n)} \\div ${d} = ${qr(q, r).en}$. ${s.use === "up" ? `The ${r} left over need one more: $${fmt(q + 1)}$.` : s.use === "drop" ? `Only complete groups count: $${fmt(q)}$.` : `The remainder is the number left over: $${r}$.`}`,
            `$${fmt(n)} \\div ${d} = ${qr(q, r).zh}$。${s.use === "up" ? `剩下的 ${r} 个还要再加一组：$${fmt(q + 1)}$。` : s.use === "drop" ? `只算完整的组：$${fmt(q)}$。` : `剩下的数就是余数：$${r}$。`}`,
          ),
        });
      },
    },
  ],
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
    {
      id: "using-a-multiplication-fact",
      title: t("Using a multiplication fact", "利用乘法算式"),
      explanation: t(
        "Multiplication and division undo each other. A multiplication fact gives two division facts: divide the product by either factor to get the other factor. Since $34 \\times 6 = 204$, we know $204 \\div 34 = 6$ and $204 \\div 6 = 34$.",
        "乘法和除法互为逆运算。由一个乘法算式可以得到两个除法算式：用积除以其中一个因数，就得到另一个因数。因为 $34 \\times 6 = 204$，所以 $204 \\div 34 = 6$，$204 \\div 6 = 34$。",
      ),
      generate(rng) {
        const d = rng.int(11, 99);
        const q = rng.int(2, 9);
        const flip = rng.bool();
        return numberProblem({
          prompt: t(
            `Use $${d} \\times ${q} = ${fmt(d * q)}$ to find $${fmt(d * q)} \\div ${flip ? q : d}$.`,
            `利用 $${d} \\times ${q} = ${fmt(d * q)}$，求 $${fmt(d * q)} \\div ${flip ? q : d}$。`,
          ),
          answer: flip ? d : q,
          form: "integer",
          wrong: [flip ? q : d, d * q, (flip ? d : q) + 1],
          solution: t(
            `Division undoes multiplication: $${fmt(d * q)} \\div ${flip ? q : d} = ${flip ? d : q}$.`,
            `除法是乘法的逆运算：$${fmt(d * q)} \\div ${flip ? q : d} = ${flip ? d : q}$。`,
          ),
        });
      },
    },
    {
      id: "finding-a-one-digit-quotient",
      title: t("Finding a one-digit quotient", "求一位数的商"),
      explanation: t(
        "To divide by a two-digit number, estimate the quotient with rounded numbers, then check it by multiplying. If the product is too big, try one less; if the difference is still at least the divisor, try one more.\n\nFor $312 \\div 52$: $300 \\div 50 = 6$, and $52 \\times 6 = 312$ exactly. So $312 \\div 52 = 6$.",
        "除数是两位数时，先把数取整估算商，再用乘法验证。如果乘积太大，就把商减 1；如果相减后剩下的数仍不小于除数，就把商加 1。\n\n计算 $312 \\div 52$：$300 \\div 50 = 6$，验证 $52 \\times 6 = 312$，正好相等。所以 $312 \\div 52 = 6$。",
      ),
      generate(rng) {
        const d = rng.int(12, 98);
        const q = rng.int(3, 9);
        return numberProblem({
          prompt: t(`Find $${fmt(d * q)} \\div ${d}$.`, `计算 $${fmt(d * q)} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [q + 1, q - 1, q * 10],
          solution: t(
            `Try multiples of ${d}: $${d} \\times ${q} = ${fmt(d * q)}$, so the quotient is $${q}$.`,
            `试除数 ${d} 的倍数：$${d} \\times ${q} = ${fmt(d * q)}$，所以商是 $${q}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "greatest-multiple-that-fits",
      title: t("The greatest multiple that fits", "不超过被除数的最大倍数"),
      explanation: t(
        "To find the greatest multiple of a number that fits under a limit, try multiples until one goes over, then step back one. For $26$ and $190$: $26 \\times 7 = 182$ is not more than $190$, but $26 \\times 8 = 208$ is too big. So the greatest multiple of $26$ that is at most $190$ is $182$. This is the step that gives the quotient in a division.",
        "要找不超过某个数的最大倍数，就逐个试倍数，直到超过为止，再退回一个。对于 $26$ 和 $190$：$26 \\times 7 = 182$ 不超过 $190$，而 $26 \\times 8 = 208$ 太大了。所以不超过 $190$ 的 $26$ 的最大倍数是 $182$。除法求商时用的正是这一步。",
      ),
      generate(rng) {
        const d = rng.int(12, 98);
        const q = rng.int(2, 9);
        const n = d * q + rng.int(1, d - 1);
        return numberProblem({
          prompt: t(
            `What is the greatest multiple of $${d}$ that is less than or equal to $${fmt(n)}$?`,
            `不超过 $${fmt(n)}$ 的 $${d}$ 的最大倍数是多少？`,
          ),
          answer: d * q,
          form: "integer",
          wrong: [d * (q + 1), q, d * (q - 1)],
          solution: t(
            `$${d} \\times ${q} = ${fmt(d * q)}$ is at most $${fmt(n)}$, but $${d} \\times ${q + 1} = ${fmt(d * (q + 1))}$ is greater.`,
            `$${d} \\times ${q} = ${fmt(d * q)}$ 不超过 $${fmt(n)}$，而 $${d} \\times ${q + 1} = ${fmt(d * (q + 1))}$ 超过了。`,
          ),
        });
      },
    },
    {
      id: "quotient-and-remainder-for-two-digit-divisors",
      title: t("The quotient and the remainder", "商和余数"),
      explanation: t(
        "The quotient is how many times the divisor fits, and the remainder is what is left over. Find the greatest multiple of the divisor that fits into the dividend, then subtract.\n\nFor $190 \\div 26$: $26 \\times 7 = 182$ fits but $26 \\times 8 = 208$ does not. $190 - 182 = 8$, so $190 \\div 26 = 7 \\text{ R } 8$. The remainder must be less than $26$; if it is not, the quotient is too small.",
        "商是除数能放进被除数的次数，余数是剩下的部分。先找出不超过被除数的除数的最大倍数，再相减。\n\n计算 $190 \\div 26$：$26 \\times 7 = 182$ 不超过 $190$，而 $26 \\times 8 = 208$ 超过了。$190 - 182 = 8$，所以 $190 \\div 26 = 7 \\cdots\\cdots 8$。余数必须小于 $26$；如果不是，说明商小了。",
      ),
      generate(rng) {
        const d = rng.int(12, 98);
        const q = rng.int(2, 9);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return pickChoice(
          rng,
          t(`Find $${fmt(n)} \\div ${d}$.`, `计算 $${fmt(n)} \\div ${d}$。`),
          qrText(q, r),
          [qrText(q - 1, r + d), qrText(q + 1, r), qrText(q, d - r)],
          t(
            `$${d} \\times ${q} = ${fmt(d * q)}$ and $${fmt(n)} - ${fmt(d * q)} = ${r}$, which is less than ${d}. So $${fmt(n)} \\div ${d} = ${qr(q, r).en}$.`,
            `$${d} \\times ${q} = ${fmt(d * q)}$，$${fmt(n)} - ${fmt(d * q)} = ${r}$，比 ${d} 小。所以 $${fmt(n)} \\div ${d} = ${qr(q, r).zh}$。`,
          ),
        );
      },
    },
  ],
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

/** partialQuotientSteps explains the partial quotients method for n ÷ d. */
function partialQuotientSteps(n: number, d: number): Text {
  let rest = n;
  const ks = chunksOf(n, d);
  const lines = ks.map((k) => {
    const line = `${fmt(rest)} - ${fmt(k * d)} = ${fmt(rest - k * d)} \\quad (${d} \\times ${fmt(k)})`;
    rest -= k * d;
    return line;
  });
  const q = ks.reduce((a, b) => a + b, 0);
  const sum = ks.length > 1 ? `${ks.map(fmt).join(" + ")} = ${fmt(q)}` : fmt(q);
  return t(
    `Subtract easy multiples of ${d}:${steps(...lines)}The quotient is the sum of the partial quotients, $${sum}$${rest ? `, and the remainder is $${rest}$` : ""}.`,
    `依次减去 ${d} 的容易计算的倍数：${steps(...lines)}商是各部分商的和 $${sum}$${rest ? `，余数是 $${rest}$` : ""}。`,
  );
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
    {
      id: "partial-quotients-without-remainders",
      title: t("Without a remainder", "没有余数"),
      explanation: t(
        "With partial quotients, take away easy multiples of the divisor (such as $10$, $20$ or $30$ times it) until nothing is left, then add up how many times you took it away.\n\nFor $936 \\div 24$: take away $24 \\times 30 = 720$, leaving $216$; then take away $24 \\times 9 = 216$, leaving $0$. The quotient is $30 + 9 = 39$.",
        "用部分商法时，从被除数中一次次减去除数的简单倍数（比如 $10$ 倍、$20$ 倍、$30$ 倍），直到减完，再把每次减去的倍数加起来。\n\n计算 $936 \\div 24$：先减去 $24 \\times 30 = 720$，剩 $216$；再减去 $24 \\times 9 = 216$，剩 $0$。商是 $30 + 9 = 39$。",
      ),
      generate(rng) {
        const d = rng.int(11, 45);
        const n = d * rng.int(12, 250);
        return numberProblem({
          prompt: t(`Use partial quotients to find $${fmt(n)} \\div ${d}$.`, `用部分商的方法计算 $${fmt(n)} \\div ${d}$。`),
          answer: n / d,
          form: "integer",
          wrong: [n / d + 1, dropZeros(n / d), n / d - 10],
          solution: partialQuotientSteps(n, d),
        });
      },
    },
    {
      id: "partial-quotients-with-remainders",
      title: t("With a remainder", "有余数"),
      explanation: t(
        "Take away multiples of the divisor until what is left is smaller than the divisor. That leftover is the remainder, and the sum of the multiples is the quotient.\n\nFor $1{,}000 \\div 32$: take away $32 \\times 30 = 960$, leaving $40$; take away $32 \\times 1 = 32$, leaving $8$. Since $8 < 32$, stop. So $1{,}000 \\div 32 = 31 \\text{ R } 8$.",
        "一次次减去除数的倍数，直到剩下的数比除数小。剩下的就是余数，减去的倍数之和就是商。\n\n计算 $1{,}000 \\div 32$：减去 $32 \\times 30 = 960$，剩 $40$；减去 $32 \\times 1 = 32$，剩 $8$。因为 $8 < 32$，就停下。所以 $1{,}000 \\div 32 = 31 \\cdots\\cdots 8$。",
      ),
      generate(rng) {
        const d = rng.int(11, 45);
        const q = rng.int(12, 250);
        const r = rng.int(1, d - 1);
        const n = d * q + r;
        return pickChoice(
          rng,
          t(`Use partial quotients to find $${fmt(n)} \\div ${d}$.`, `用部分商的方法计算 $${fmt(n)} \\div ${d}$。`),
          qrText(q, r),
          [qrText(q - 1, r + d), qrText(q + 1, r), qrText(dropZeros(q), r), qrText(q + 10, r)],
          partialQuotientSteps(n, d),
        );
      },
    },
  ],
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
    {
      id: "three-digit-by-two-digit-without-remainders",
      title: t("Without a remainder", "没有余数"),
      explanation: t(
        "With a two-digit divisor, start with the first two digits of the dividend (or three, if two are too small). Estimate each digit of the quotient, multiply, subtract and bring down.\n\nFor $672 \\div 21$: $67 \\div 21$ is $3$, and $67 - 63 = 4$. Bring down $2$ to make $42$; $42 \\div 21 = 2$. So $672 \\div 21 = 32$. Check: $32 \\times 21 = 672$.",
        "除数是两位数时，先看被除数的前两位（不够除就看前三位）。逐位估商，再乘、减、落下。\n\n计算 $672 \\div 21$：$67 \\div 21$ 商 $3$，$67 - 63 = 4$；落下 $2$ 得 $42$，$42 \\div 21 = 2$。所以 $672 \\div 21 = 32$。验算：$32 \\times 21 = 672$。",
      ),
      generate(rng) {
        const d = rng.int(11, 99);
        return exactDivision(dividend(rng, d, 3, true), d);
      },
    },
    {
      id: "three-digit-by-two-digit-with-remainders",
      title: t("With a remainder", "有余数"),
      explanation: t(
        "Divide as usual. If after bringing down a digit the number is still smaller than the divisor, write $0$ in the quotient; that number is then the remainder.\n\nFor $700 \\div 23$: $70 \\div 23$ is $3$, and $70 - 69 = 1$. Bring down $0$ to make $10$, which is less than $23$, so the next quotient digit is $0$. So $700 \\div 23 = 30 \\text{ R } 10$, not $3 \\text{ R } 10$.",
        "照常去除。如果落下一位后，这个数仍比除数小，就在商的这一位写 $0$，这个数就是余数。\n\n计算 $700 \\div 23$：$70 \\div 23$ 商 $3$，$70 - 69 = 1$；落下 $0$ 得 $10$，比 $23$ 小，商的这一位写 $0$。所以 $700 \\div 23 = 30 \\cdots\\cdots 10$，而不是 $3 \\cdots\\cdots 10$。",
      ),
      generate(rng) {
        const d = rng.int(11, 99);
        return remainderDivision(rng, dividend(rng, d, 3, false), d);
      },
    },
  ],
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
    {
      id: "four-digit-by-two-digit-without-remainders",
      title: t("Without a remainder", "没有余数"),
      explanation: t(
        "A four-digit dividend divided by a two-digit number follows the same cycle: estimate a quotient digit, multiply, subtract, bring down the next digit.\n\nFor $5{,}658 \\div 23$: $56 \\div 23$ is $2$, $56 - 46 = 10$. Bring down $5$: $105 \\div 23$ is $4$, $105 - 92 = 13$. Bring down $8$: $138 \\div 23 = 6$. So $5{,}658 \\div 23 = 246$.",
        '四位数除以两位数，同样按"估商、乘、减、落下"的顺序循环进行。\n\n计算 $5{,}658 \\div 23$：$56 \\div 23$ 商 $2$，$56 - 46 = 10$；落下 $5$，$105 \\div 23$ 商 $4$，$105 - 92 = 13$；落下 $8$，$138 \\div 23 = 6$。所以 $5{,}658 \\div 23 = 246$。',
      ),
      generate(rng) {
        const d = rng.int(11, 99);
        return exactDivision(dividend(rng, d, 4, true), d);
      },
    },
    {
      id: "four-digit-by-two-digit-with-remainders",
      title: t("With a remainder", "有余数"),
      explanation: t(
        "Work through every digit of the dividend. When a step is too small to divide, write $0$ in the quotient. What is left at the end is the remainder, and it must be less than the divisor.\n\nFor $8{,}000 \\div 47$: $80 \\div 47$ is $1$, $80 - 47 = 33$. Bring down $0$: $330 \\div 47$ is $7$, $330 - 329 = 1$. Bring down $0$: $10$ is less than $47$, so write $0$. So $8{,}000 \\div 47 = 170 \\text{ R } 10$.",
        "被除数的每一位都要除到。某一步不够除时，商的这一位写 $0$。最后剩下的就是余数，余数必须小于除数。\n\n计算 $8{,}000 \\div 47$：$80 \\div 47$ 商 $1$，$80 - 47 = 33$；落下 $0$，$330 \\div 47$ 商 $7$，$330 - 329 = 1$；落下 $0$ 得 $10$，比 $47$ 小，商写 $0$。所以 $8{,}000 \\div 47 = 170 \\cdots\\cdots 10$。",
      ),
      generate(rng) {
        const d = rng.int(11, 99);
        return remainderDivision(rng, dividend(rng, d, 4, false), d);
      },
    },
  ],
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
