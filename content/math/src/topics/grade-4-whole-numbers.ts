import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";

import { choiceProblem, numberProblem } from "../problems.ts";

// 4th Grade Math: expressions and patterns, place value, comparing and rounding, and adding and subtracting whole numbers.

/** fmt writes a whole number in LaTeX with thousands separators: "3{,}400". */
const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** plain writes a whole number with thousands separators for running text: "3,400". */
const plain = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** digitsOf lists the digits of n from the ones place up. */
const digitsOf = (n: number): number[] => String(n).split("").reverse().map(Number);

/** digitAt is the digit of n in place k (0 for the ones). */
const digitAt = (n: number, k: number): number => Math.floor(n / 10 ** k) % 10;

/** randomWithDigits is a random whole number with exactly d digits. */
const randomWithDigits = (rng: Rng, d: number): number => rng.int(10 ** (d - 1), 10 ** d - 1);

/** placeNames are the names of the places of a whole number, from the ones. */
const placeNames: readonly Text[] = [
  t("ones", "个位"),
  t("tens", "十位"),
  t("hundreds", "百位"),
  t("thousands", "千位"),
  t("ten thousands", "万位"),
  t("hundred thousands", "十万位"),
  t("millions", "百万位"),
];

/** roundNames name rounding to the nearest 10ᵏ. */
const roundNames: readonly Text[] = [
  t("one", "一"),
  t("ten", "十"),
  t("hundred", "百"),
  t("thousand", "千"),
  t("ten thousand", "万"),
  t("hundred thousand", "十万"),
];

const enOnes = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const enTens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** below1000En writes 1 ≤ n < 1000 in English words. */
function below1000En(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const rest = r === 0 ? "" : r < 20 ? enOnes[r]! : `${enTens[Math.floor(r / 10)]}${r % 10 ? `-${enOnes[r % 10]}` : ""}`;
  return [h ? `${enOnes[h]} hundred` : "", rest].filter(Boolean).join(" ");
}

/** wordsEn writes a whole number below a billion in English words: "three thousand, forty-five". */
export function wordsEn(n: number): string {
  if (n === 0) return "zero";
  const groups: [number, string][] = [
    [Math.floor(n / 1e6), " million"],
    [Math.floor(n / 1e3) % 1000, " thousand"],
    [n % 1000, ""],
  ];
  return groups
    .filter(([g]) => g > 0)
    .map(([g, name]) => below1000En(g) + name)
    .join(", ");
}

const zhDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** below10000Zh writes 1 ≤ n < 10000 in Chinese, with 零 for inner gaps. */
function below10000Zh(n: number): string {
  const units = ["", "十", "百", "千"];
  let out = "";
  let gap = false;
  for (let k = 3; k >= 0; k--) {
    const d = digitAt(n, k);
    if (d === 0) {
      if (out) gap = true;
      continue;
    }
    if (gap) out += "零";
    gap = false;
    out += zhDigits[d]! + units[k]!;
  }
  return out;
}

/** wordsZh writes a whole number below a hundred million in Chinese: "三千零四十五". */
export function wordsZh(n: number): string {
  if (n === 0) return "零";
  const high = Math.floor(n / 10000);
  const low = n % 10000;
  let out = high ? `${below10000Zh(high)}万` : "";
  if (low) out += (high && low < 1000 ? "零" : "") + below10000Zh(low);
  return n >= 10 && n < 20 ? out.slice(1) : out;
}

/** words writes a whole number in words in both languages. */
const words = (n: number): Text => t(wordsEn(n), wordsZh(n));

/** pickChoice builds a choice problem from a correct option and distinct wrong ones, keeping at most three wrong ones. */
function pickChoice(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([correct.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))).slice(0, 3);
  const options = rng.shuffle([correct, ...rest]);
  return choiceProblem({ prompt, options, correct: options.indexOf(correct), solution });
}

/** mathText is a choice option made of one LaTeX expression. */
const mathText = (s: string): Text => same(`$${s}$`);

/** noCarrySum adds digit by digit, forgetting to carry. */
function noCarrySum(a: number, b: number): number {
  let out = 0;
  for (let k = 0; k < 8; k++) out += ((digitAt(a, k) + digitAt(b, k)) % 10) * 10 ** k;
  return out;
}

/** smallerFromLarger subtracts the smaller digit from the larger in every place, a typical subtraction slip. */
function smallerFromLarger(a: number, b: number): number {
  let out = 0;
  for (let k = 0; k < 8; k++) out += Math.abs(digitAt(a, k) - digitAt(b, k)) * 10 ** k;
  return out;
}

/** roundTo rounds n to the nearest multiple of 10ᵏ, halves up. */
const roundTo = (n: number, k: number) => Math.round(n / 10 ** k) * 10 ** k;

/** expandedTerms lists the nonzero place-value parts of n, largest first. */
const expandedTerms = (n: number): number[] =>
  digitsOf(n)
    .map((d, k) => d * 10 ** k)
    .filter((x) => x > 0)
    .reverse();

/** expandedTex writes n in expanded form. */
const expandedTex = (n: number) => expandedTerms(n).map(fmt).join(" + ");

/** Context is a word-problem setting: a thing counted, in both languages. */
interface Context {
  readonly en: string;
  readonly zh: string;
}

const things: readonly Context[] = [
  { en: "books", zh: "本书" },
  { en: "stickers", zh: "张贴纸" },
  { en: "apples", zh: "个苹果" },
  { en: "marbles", zh: "颗弹珠" },
  { en: "pencils", zh: "支铅笔" },
  { en: "stamps", zh: "枚邮票" },
  { en: "shells", zh: "个贝壳" },
  { en: "cards", zh: "张卡片" },
];

const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

/** standardsOf is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

// ---------------------------------------------------------------------------
// Expressions, comparison and patterns

/** evaluatingExpressionsInvolvingAdditionAndMultiplication applies the order of operations to + and ×. */
export const evaluatingExpressionsInvolvingAdditionAndMultiplication: TopicDef = {
  id: "evaluating-expressions-involving-addition-and-multiplication",
  title: t("Evaluating Expressions Involving Addition and Multiplication", "计算含加法和乘法的算式"),
  summary: t(
    "In an expression with addition and multiplication, multiply first and then add, unless parentheses say otherwise: 4 + 3 × 5 = 4 + 15 = 19, but (4 + 3) × 5 = 7 × 5 = 35.",
    "在含加法和乘法的算式中，先乘后加，除非括号另有规定：4 + 3 × 5 = 4 + 15 = 19，而 (4 + 3) × 5 = 7 × 5 = 35。",
  ),
  prerequisites: ["products-and-factors", "adding-two-digit-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    {
      id: "multiplying-before-adding",
      title: t("Multiply before adding", "先乘后加"),
      explanation: t(
        "$6 + 4 \\times 3$: multiply first, $4 \\times 3 = 12$, then add: $6 + 12 = 18$. Adding first would give the wrong answer $30$.",
        "$6 + 4 \\times 3$：先乘，$4 \\times 3 = 12$，再加：$6 + 12 = 18$。先加会得到错误答案 $30$。",
      ),
      generate(rng) {
        const [a, b, c] = [rng.int(2, 30), rng.int(2, 9), rng.int(2, 9)];
        const multFirst = rng.bool();
        const tex = multFirst ? `${b} \\times ${c} + ${a}` : `${a} + ${b} \\times ${c}`;
        const value = a + b * c;
        return numberProblem({
          prompt: t(`Evaluate $${tex}$.`, `计算 $${tex}$。`),
          answer: value,
          form: "integer",
          wrong: [(a + b) * c, multFirst ? b * (c + a) : value + 1],
          solution: t(
            `Multiply first: $${b} \\times ${c} = ${b * c}$. Then add: $${b * c} + ${a} = ${value}$.`,
            `先乘：$${b} \\times ${c} = ${b * c}$。再加：$${b * c} + ${a} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "parentheses-with-addition-and-multiplication",
      title: t("Parentheses first", "先算括号"),
      explanation: t(
        "$(6 + 4) \\times 3$: work out the parentheses first, $6 + 4 = 10$, then multiply: $10 \\times 3 = 30$.",
        "$(6 + 4) \\times 3$：先算括号，$6 + 4 = 10$，再乘：$10 \\times 3 = 30$。",
      ),
      generate(rng) {
        const [a, b, c] = [rng.int(2, 20), rng.int(2, 20), rng.int(2, 9)];
        const left = rng.bool();
        const tex = left ? `(${a} + ${b}) \\times ${c}` : `${c} \\times (${a} + ${b})`;
        const value = (a + b) * c;
        return numberProblem({
          prompt: t(`Evaluate $${tex}$.`, `计算 $${tex}$。`),
          answer: value,
          form: "integer",
          wrong: [left ? a + b * c : c * a + b, a * b * c],
          solution: t(
            `Parentheses first: $${a} + ${b} = ${a + b}$. Then $${a + b} \\times ${c} = ${value}$.`,
            `先算括号：$${a} + ${b} = ${a + b}$。再算 $${a + b} \\times ${c} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** evaluatingExpressionsContainingMultiplicationAndDivision works left to right with × and ÷ and mixes all four operations. */
export const evaluatingExpressionsContainingMultiplicationAndDivision: TopicDef = {
  id: "evaluating-expressions-containing-multiplication-and-division",
  title: t("Evaluating Expressions Containing Multiplication and Division", "计算含乘法和除法的算式"),
  summary: t(
    "Multiplication and division have the same priority, so do them from left to right: 24 ÷ 4 × 2 = 6 × 2 = 12. Both come before addition and subtraction: 20 − 12 ÷ 3 = 20 − 4 = 16.",
    "乘法与除法同级，从左往右计算：24 ÷ 4 × 2 = 6 × 2 = 12。它们都先于加法和减法：20 − 12 ÷ 3 = 20 − 4 = 16。",
  ),
  prerequisites: ["evaluating-expressions-involving-addition-and-multiplication", "relationship-between-multiplication-and-division"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    {
      id: "multiplying-and-dividing-left-to-right",
      title: t("Left to right", "从左往右"),
      explanation: t(
        "$36 \\div 6 \\times 3 = 6 \\times 3 = 18$, not $36 \\div 18 = 2$.",
        "$36 \\div 6 \\times 3 = 6 \\times 3 = 18$，而不是 $36 \\div 18 = 2$。",
      ),
      generate(rng) {
        const b = rng.int(2, 6);
        const c = rng.pick([2, 3, 4, 6].filter((x) => x !== b));
        const q = rng.int(2, 9);
        const a = b * c * q;
        const value = (a / b) * c;
        return numberProblem({
          prompt: t(`Evaluate $${a} \\div ${b} \\times ${c}$.`, `计算 $${a} \\div ${b} \\times ${c}$。`),
          answer: value,
          form: "integer",
          wrong: [a / (b * c), a / b + c],
          solution: t(
            `Work from left to right: $${a} \\div ${b} = ${a / b}$, then $${a / b} \\times ${c} = ${value}$.`,
            `从左往右：$${a} \\div ${b} = ${a / b}$，再算 $${a / b} \\times ${c} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "mixing-the-four-operations",
      title: t("All four operations", "四则混合运算"),
      explanation: t("$30 - 18 \\div 3 = 30 - 6 = 24$: divide before subtracting.", "$30 - 18 \\div 3 = 30 - 6 = 24$：先除后减。"),
      generate(rng) {
        const c = rng.int(2, 9);
        const b = c * rng.int(2, 9);
        const a = rng.int(b / c + 1, 80);
        const op = rng.pick(["+", "-"]);
        const value = op === "+" ? a + b / c : a - b / c;
        const wrongLeft = op === "+" ? (a + b) / c : (a - b) / c;
        return numberProblem({
          prompt: t(`Evaluate $${a} ${op} ${b} \\div ${c}$.`, `计算 $${a} ${op} ${b} \\div ${c}$。`),
          answer: value,
          form: "integer",
          wrong: [Number.isInteger(wrongLeft) ? wrongLeft : value + c, op === "+" ? a - b / c : a + b / c],
          solution: t(
            `Divide first: $${b} \\div ${c} = ${b / c}$. Then $${a} ${op} ${b / c} = ${value}$.`,
            `先除：$${b} \\div ${c} = ${b / c}$。再算 $${a} ${op} ${b / c} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** solvingMultistepWordProblemsUsingNumberOperations solves two-step word problems. */
export const solvingMultistepWordProblemsUsingNumberOperations: TopicDef = {
  id: "solving-multistep-word-problems-using-number-operations",
  title: t("Solving Multistep Word Problems Using Number Operations", "用四则运算解多步应用题"),
  summary: t(
    "A multistep word problem is solved one step at a time: decide what each step finds, choose its operation, and use its result in the next step.",
    "多步应用题要一步一步地解：确定每一步求什么、用哪种运算，再把它的结果用到下一步。",
  ),
  prerequisites: ["evaluating-expressions-containing-multiplication-and-division", "subtracting-three-digit-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    {
      id: "groups-then-subtract",
      title: t("Multiply, then subtract", "先乘再减"),
      explanation: t(
        "A shop has $6$ boxes of $24$ pencils and sells $50$ pencils. It had $6 \\times 24 = 144$ pencils, so $144 - 50 = 94$ are left.",
        "商店有 $6$ 盒铅笔，每盒 $24$ 支，卖出 $50$ 支。原有 $6 \\times 24 = 144$ 支，所以还剩 $144 - 50 = 94$ 支。",
      ),
      generate(rng) {
        const th = rng.pick(things);
        const name = rng.pick(names);
        const a = rng.int(3, 9);
        const b = rng.int(12, 48);
        const c = rng.int(5, a * b - 5);
        const value = a * b - c;
        return numberProblem({
          prompt: t(
            `${name} has ${a} boxes with ${b} ${th.en} in each box and gives away ${c} ${th.en}. How many ${th.en} does ${name} have left?`,
            `${name} 有 ${a} 盒，每盒 ${b} ${th.zh}，送出 ${c} ${th.zh}。${name} 还剩多少${th.zh}？`,
          ),
          answer: value,
          form: "integer",
          wrong: [a * b + c, a * b, a * b - c - 10].filter((x) => x > 0 && x !== value),
          solution: t(
            `${name} starts with $${a} \\times ${b} = ${a * b}$ ${th.en}, and $${a * b} - ${c} = ${value}$ are left.`,
            `原有 $${a} \\times ${b} = ${a * b}$，还剩 $${a * b} - ${c} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "add-then-multiply",
      title: t("Add, then multiply", "先加再乘"),
      explanation: t(
        "A ticket costs $\\$8$ for a child and $\\$12$ for an adult. For $5$ pairs of a child and an adult: $(8 + 12) \\times 5 = \\$100$.",
        "儿童票 $8$ 元，成人票 $12$ 元。$5$ 对儿童和成人共需 $(8 + 12) \\times 5 = 100$ 元。",
      ),
      generate(rng) {
        const a = rng.int(3, 15);
        const b = rng.int(a + 1, 25);
        const n = rng.int(3, 12);
        const value = (a + b) * n;
        return numberProblem({
          prompt: t(
            `A notebook costs $${a} and a pen costs $${b}. How many dollars do ${n} notebooks and ${n} pens cost in total?`,
            `一本笔记本 ${a} 元，一支钢笔 ${b} 元。${n} 本笔记本和 ${n} 支钢笔一共多少元？`,
          ),
          answer: value,
          form: "integer",
          wrong: [a + b * n, a * n + b, a + b + n],
          solution: t(
            `One notebook and one pen cost $${a} + ${b} = ${a + b}$ dollars, so ${n} of each cost $${a + b} \\times ${n} = ${value}$ dollars.`,
            `一本笔记本和一支钢笔共 $${a} + ${b} = ${a + b}$ 元，所以各 ${n} 件共 $${a + b} \\times ${n} = ${value}$ 元。`,
          ),
        });
      },
    },
  ],
};

/** furtherSolvingMultistepWordProblemsUsingTheFourOperations solves word problems with division and remainders. */
export const furtherSolvingMultistepWordProblemsUsingTheFourOperations: TopicDef = {
  id: "further-solving-multistep-word-problems-using-the-four-operations",
  title: t("Further Solving Multistep Word Problems Using the Four Operations", "用四则运算解多步应用题（进阶）"),
  summary: t(
    "Multistep problems may need division, and a remainder must be interpreted: if 27 people ride in cars that hold 4, then 27 ÷ 4 = 6 R 3, so 7 cars are needed.",
    "多步应用题可能需要除法，而余数要结合情境解释：27 人乘坐每辆可坐 4 人的汽车，27 ÷ 4 = 6……3，所以需要 7 辆车。",
  ),
  prerequisites: ["solving-multistep-word-problems-using-number-operations", "interpreting-remainders-in-context"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    {
      id: "rounding-a-quotient-up-in-context",
      title: t("How many groups are needed?", "需要多少组"),
      explanation: t(
        "$3$ classes of $26$ students go on a trip in buses that hold $20$ students. There are $78$ students, and $78 \\div 20 = 3 \\text{ R } 18$, so $4$ buses are needed.",
        "$3$ 个班，每班 $26$ 名学生，乘坐每辆可坐 $20$ 人的大巴出游。共 $78$ 人，$78 \\div 20 = 3 \\cdots\\cdots 18$，所以需要 $4$ 辆大巴。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        do {
          a = rng.int(2, 6);
          b = rng.int(15, 35);
          c = rng.int(4, 12);
        } while ((a * b) % c === 0);
        const total = a * b;
        const value = Math.ceil(total / c);
        return numberProblem({
          prompt: t(
            `${a} teams of ${b} players each travel in vans that hold ${c} players. How many vans are needed?`,
            `${a} 支队伍，每队 ${b} 名队员，乘坐每辆可坐 ${c} 人的面包车。需要多少辆面包车？`,
          ),
          answer: value,
          form: "integer",
          wrong: [Math.floor(total / c), total % c, value + 1],
          solution: t(
            `There are $${a} \\times ${b} = ${total}$ players, and $${total} \\div ${c} = ${Math.floor(total / c)} \\text{ R } ${total % c}$. The remaining ${total % c} players need one more van: ${value} vans.`,
            `共 $${a} \\times ${b} = ${total}$ 人，$${total} \\div ${c} = ${Math.floor(total / c)} \\cdots\\cdots ${total % c}$。剩下的 ${total % c} 人还需要一辆车：共 ${value} 辆。`,
          ),
        });
      },
    },
    {
      id: "three-step-word-problems",
      title: t("Three steps", "三步计算"),
      explanation: t(
        "A baker makes $12$ trays of $8$ muffins, packs them in bags of $6$, and sells $10$ bags. There are $96$ muffins, $16$ bags, and $16 - 10 = 6$ bags left.",
        "面包师做了 $12$ 盘松饼，每盘 $8$ 个，每 $6$ 个装一袋，卖出 $10$ 袋。共 $96$ 个松饼，$16$ 袋，还剩 $16 - 10 = 6$ 袋。",
      ),
      generate(rng) {
        const per = rng.int(3, 8);
        const bags = rng.int(6, 20);
        const total = per * bags;
        const trayOpts = [2, 3, 4, 5, 6, 8, 10, 12].filter((x) => total % x === 0 && total / x >= 4);
        const trays = trayOpts.length > 0 ? rng.pick(trayOpts) : 1;
        const perTray = total / trays;
        const sold = rng.int(1, bags - 1);
        const value = bags - sold;
        return numberProblem({
          prompt: t(
            `A baker makes ${trays} trays of ${perTray} muffins, packs them in bags of ${per}, and sells ${sold} bags. How many bags are left?`,
            `面包师做了 ${trays} 盘松饼，每盘 ${perTray} 个，每 ${per} 个装一袋，卖出 ${sold} 袋。还剩多少袋？`,
          ),
          answer: value,
          form: "integer",
          wrong: [bags, total - sold, total - sold * per],
          solution: t(
            `There are $${trays} \\times ${perTray} = ${total}$ muffins in $${total} \\div ${per} = ${bags}$ bags, so $${bags} - ${sold} = ${value}$ bags are left.`,
            `共 $${trays} \\times ${perTray} = ${total}$ 个松饼，装成 $${total} \\div ${per} = ${bags}$ 袋，所以还剩 $${bags} - ${sold} = ${value}$ 袋。`,
          ),
        });
      },
    },
  ],
};

/** interpretingMultiplicationEquationsAsAComparison reads a × b = c as "c is a times as many as b". */
export const interpretingMultiplicationEquationsAsAComparison: TopicDef = {
  id: "interpreting-multiplication-equations-as-a-comparison",
  title: t("Interpreting Multiplication Equations as a Comparison", "把乘法算式理解为比较"),
  summary: t(
    "A multiplication equation can compare two amounts: 35 = 5 × 7 says that 35 is 5 times as many as 7, and also 7 times as many as 5.",
    "乘法算式可以表示两个量的比较：35 = 5 × 7 表示 35 是 7 的 5 倍，也是 5 的 7 倍。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.1"),
  knowledgePoints: [
    {
      id: "reading-multiplicative-comparisons",
      title: t("How many times as many?", "是几倍"),
      explanation: t("$42 = 6 \\times 7$ means $42$ is $6$ times as many as $7$.", "$42 = 6 \\times 7$ 表示 $42$ 是 $7$ 的 $6$ 倍。"),
      generate(rng) {
        const a = rng.int(2, 12);
        let b: number;
        do b = rng.int(2, 12);
        while (b === a);
        const c = a * b;
        return numberProblem({
          prompt: t(
            `$${c} = ${a} \\times ${b}$. Fill in the blank: $${c}$ is ___ times as many as $${b}$.`,
            `$${c} = ${a} \\times ${b}$。填空：$${c}$ 是 $${b}$ 的 ___ 倍。`,
          ),
          answer: a,
          form: "integer",
          wrong: [b, c - b, c],
          solution: t(
            `$${c} = ${a} \\times ${b}$ says $${c}$ is $${a}$ times as many as $${b}$.`,
            `$${c} = ${a} \\times ${b}$ 表示 $${c}$ 是 $${b}$ 的 $${a}$ 倍。`,
          ),
        });
      },
    },
    {
      id: "choosing-the-equation-for-a-comparison",
      title: t("Choosing the equation", "选出算式"),
      explanation: t(
        '"$48$ is $6$ times as many as $8$" is the equation $48 = 6 \\times 8$.',
        '"$48$ 是 $8$ 的 $6$ 倍"就是算式 $48 = 6 \\times 8$。',
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        let b: number;
        do b = rng.int(2, 12);
        while (b === a);
        const c = a * b;
        return pickChoice(
          rng,
          t(`Which equation says "$${c}$ is $${a}$ times as many as $${b}$"?`, `哪个算式表示"$${c}$ 是 $${b}$ 的 $${a}$ 倍"？`),
          mathText(`${c} = ${a} \\times ${b}`),
          [
            mathText(`${c} = ${a} + ${b}`),
            mathText(`${b} = ${a} \\times ${c}`),
            mathText(`${a} = ${c} \\times ${b}`),
            mathText(`${c} + ${a} = ${b}`),
          ],
          t(`"Times as many as" means multiply: $${c} = ${a} \\times ${b}$.`, `"是……的几倍"表示乘法：$${c} = ${a} \\times ${b}$。`),
        );
      },
    },
  ],
};

/** representingComparisonStatementsAsEquations writes comparison statements as equations and solves for an unknown factor. */
export const representingComparisonStatementsAsEquations: TopicDef = {
  id: "representing-comparison-statements-as-equations",
  title: t("Representing Comparison Statements as Equations", "用算式表示比较语句"),
  summary: t(
    '"A is 4 times as many as B" becomes the equation A = 4 × B; "A is 4 more than B" becomes A = B + 4. An unknown can stand for any of the amounts: "48 is 6 times as many as n" is 48 = 6 × n, so n = 8.',
    '"A 是 B 的 4 倍"写成算式 A = 4 × B；"A 比 B 多 4"写成 A = B + 4。未知数可以表示其中任何一个量："48 是 n 的 6 倍"即 48 = 6 × n，所以 n = 8。',
  ),
  prerequisites: ["interpreting-multiplication-equations-as-a-comparison"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.1", "4.OA.A.2"),
  knowledgePoints: [
    {
      id: "writing-comparison-equations",
      title: t("Writing the equation", "写出算式"),
      explanation: t(
        "Mia has $3$ times as many shells as Leo, who has $9$. With $m$ for Mia's shells: $m = 3 \\times 9$.",
        "米娅的贝壳数是利奥的 $3$ 倍，利奥有 $9$ 个。用 $m$ 表示米娅的贝壳数：$m = 3 \\times 9$。",
      ),
      generate(rng) {
        const [p, q] = rng.sample(names, 2);
        const th = rng.pick(things);
        const k = rng.int(2, 9);
        const b = rng.int(3, 15);
        const times = rng.bool();
        const right = times ? `m = ${k} \\times ${b}` : `m = ${b} + ${k}`;
        return pickChoice(
          rng,
          times
            ? t(
                `${p} has ${k} times as many ${th.en} as ${q}. ${q} has ${b}. Which equation gives ${p}'s number $m$?`,
                `${p} 的${th.zh.slice(1)}数是 ${q} 的 ${k} 倍。${q} 有 ${b} ${th.zh}。哪个算式能求出 ${p} 的数量 $m$？`,
              )
            : t(
                `${p} has ${k} more ${th.en} than ${q}. ${q} has ${b}. Which equation gives ${p}'s number $m$?`,
                `${p} 的${th.zh.slice(1)}比 ${q} 多 ${k} ${th.zh.slice(0, 1)}。${q} 有 ${b} ${th.zh}。哪个算式能求出 ${p} 的数量 $m$？`,
              ),
          mathText(right),
          [
            mathText(times ? `m = ${b} + ${k}` : `m = ${k} \\times ${b}`),
            mathText(`${b} = ${k} \\times m`),
            mathText(`m = ${b} - ${k}`),
            mathText(`m = ${b} \\div ${k}`),
          ],
          times
            ? t(
                `"${k} times as many" means multiply ${q}'s number by ${k}: $${right}$.`,
                `"${k} 倍"表示用 ${q} 的数量乘 ${k}：$${right}$。`,
              )
            : t(`"${k} more" means add ${k} to ${q}'s number: $${right}$.`, `"多 ${k}"表示在 ${q} 的数量上加 ${k}：$${right}$。`),
        );
      },
    },
    {
      id: "solving-for-an-unknown-factor",
      title: t("Unknown factors", "求未知因数"),
      explanation: t(
        '"$56$ is $7$ times as many as $n$": $56 = 7 \\times n$, so $n = 56 \\div 7 = 8$.',
        '"$56$ 是 $n$ 的 $7$ 倍"：$56 = 7 \\times n$，所以 $n = 56 \\div 7 = 8$。',
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const n = rng.int(2, 12);
        const c = k * n;
        return numberProblem({
          prompt: t(`$${c}$ is $${k}$ times as many as $n$. Find $n$.`, `$${c}$ 是 $n$ 的 $${k}$ 倍。求 $n$。`),
          answer: n,
          form: "integer",
          wrong: [c * k, c - k, c + k],
          solution: t(
            `$${c} = ${k} \\times n$, so $n = ${c} \\div ${k} = ${n}$.`,
            `$${c} = ${k} \\times n$，所以 $n = ${c} \\div ${k} = ${n}$。`,
          ),
        });
      },
    },
  ],
};

/** wordProblemsInvolvingAdditiveAndMultiplicativeComparison tells "times as many" from "more than". */
export const wordProblemsInvolvingAdditiveAndMultiplicativeComparison: TopicDef = {
  id: "word-problems-involving-additive-and-multiplicative-comparison",
  title: t("Word Problems Involving Additive and Multiplicative Comparison", "关于相差与倍数比较的应用题"),
  summary: t(
    '"How many more" compares by subtraction; "how many times as many" compares by division. A red ribbon of 24 cm and a blue one of 6 cm: the red one is 24 − 6 = 18 cm longer, and 24 ÷ 6 = 4 times as long.',
    '"多多少"用减法比较；"是几倍"用除法比较。红丝带长 24 厘米，蓝丝带长 6 厘米：红丝带长 24 − 6 = 18 厘米，是蓝丝带的 24 ÷ 6 = 4 倍。',
  ),
  prerequisites: ["representing-comparison-statements-as-equations", "relationship-between-multiplication-and-division"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.2"),
  knowledgePoints: [
    {
      id: "finding-an-amount-from-a-comparison",
      title: t("Finding the larger or smaller amount", "求较大量或较小量"),
      explanation: t(
        "A dog weighs $5$ times as much as a cat of $4$ kg, so the dog weighs $5 \\times 4 = 20$ kg. If a box holds $36$ pens, $4$ times as many as a cup, the cup holds $36 \\div 4 = 9$.",
        "狗的体重是 $4$ 千克的猫的 $5$ 倍，所以狗重 $5 \\times 4 = 20$ 千克。一个盒子装 $36$ 支笔，是一个杯子的 $4$ 倍，所以杯子装 $36 \\div 4 = 9$ 支。",
      ),
      generate(rng) {
        const [p, q] = rng.sample(names, 2);
        const th = rng.pick(things);
        const k = rng.int(2, 9);
        const b = rng.int(3, 20);
        const findLarger = rng.bool();
        return numberProblem({
          prompt: findLarger
            ? t(
                `${q} has ${b} ${th.en}. ${p} has ${k} times as many. How many ${th.en} does ${p} have?`,
                `${q} 有 ${b} ${th.zh}。${p} 的数量是 ${q} 的 ${k} 倍。${p} 有多少${th.zh}？`,
              )
            : t(
                `${p} has ${k * b} ${th.en}, which is ${k} times as many as ${q}. How many ${th.en} does ${q} have?`,
                `${p} 有 ${k * b} ${th.zh}，是 ${q} 的 ${k} 倍。${q} 有多少${th.zh}？`,
              ),
          answer: findLarger ? k * b : b,
          form: "integer",
          wrong: findLarger ? [k + b, b] : [k * b - k, k * b * k],
          solution: findLarger
            ? t(`$${k} \\times ${b} = ${k * b}$.`, `$${k} \\times ${b} = ${k * b}$。`)
            : t(`$${k * b} \\div ${k} = ${b}$.`, `$${k * b} \\div ${k} = ${b}$。`),
        });
      },
    },
    {
      id: "more-than-versus-times-as-many",
      title: t("How many more or how many times?", "多多少还是几倍"),
      explanation: t(
        "$35$ and $7$: $35$ is $35 - 7 = 28$ more than $7$, and $35 \\div 7 = 5$ times as many.",
        "$35$ 与 $7$：$35$ 比 $7$ 多 $35 - 7 = 28$，是 $7$ 的 $35 \\div 7 = 5$ 倍。",
      ),
      generate(rng) {
        const [p, q] = rng.sample(names, 2);
        const k = rng.int(2, 9);
        const b = rng.int(3, 15);
        const a = k * b;
        const askTimes = rng.bool();
        return numberProblem({
          prompt: askTimes
            ? t(
                `${p} read ${a} pages and ${q} read ${b} pages. How many times as many pages did ${p} read?`,
                `${p} 读了 ${a} 页，${q} 读了 ${b} 页。${p} 读的页数是 ${q} 的几倍？`,
              )
            : t(
                `${p} read ${a} pages and ${q} read ${b} pages. How many more pages did ${p} read?`,
                `${p} 读了 ${a} 页，${q} 读了 ${b} 页。${p} 比 ${q} 多读了多少页？`,
              ),
          answer: askTimes ? k : a - b,
          form: "integer",
          wrong: askTimes ? [a - b, a + b] : [k, a + b],
          solution: askTimes
            ? t(`Divide: $${a} \\div ${b} = ${k}$.`, `用除法：$${a} \\div ${b} = ${k}$。`)
            : t(`Subtract: $${a} - ${b} = ${a - b}$.`, `用减法：$${a} - ${b} = ${a - b}$。`),
        });
      },
    },
  ],
};

/** generatingPatterns generates terms of a pattern from a rule. */
export const generatingPatterns: TopicDef = {
  id: "generating-patterns",
  title: t("Generating Patterns", "按规则生成数列"),
  summary: t(
    'A rule such as "start at 5 and add 4" generates the pattern 5, 9, 13, 17, …. Rules can also multiply, or combine two steps, such as "multiply by 2, then add 1".',
    '像"从 5 开始，每次加 4"这样的规则生成数列 5, 9, 13, 17, …。规则也可以是乘法，或者两步组合，比如"乘 2，再加 1"。',
  ),
  prerequisites: ["adding-two-digit-whole-numbers", "products-and-factors"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.C.5"),
  knowledgePoints: [
    {
      id: "terms-of-a-pattern-from-a-rule",
      title: t("Following a one-step rule", "按一步规则"),
      explanation: t(
        "Start at $7$ and add $5$: $7, 12, 17, 22, 27$. The $5$th number is $27 = 7 + 4 \\times 5$.",
        "从 $7$ 开始，每次加 $5$：$7, 12, 17, 22, 27$。第 $5$ 个数是 $27 = 7 + 4 \\times 5$。",
      ),
      generate(rng) {
        const mult = rng.bool(0.3);
        const a = mult ? rng.int(1, 5) : rng.int(1, 30);
        const d = mult ? rng.int(2, 3) : rng.int(2, 12);
        const n = mult ? rng.int(4, 6) : rng.int(5, 10);
        const value = mult ? a * d ** (n - 1) : a + (n - 1) * d;
        return numberProblem({
          prompt: mult
            ? t(
                `A pattern starts at $${a}$, and the rule is "multiply by $${d}$". What is the ${n}th number?`,
                `一个数列从 $${a}$ 开始，规则是"乘 $${d}$"。第 ${n} 个数是多少？`,
              )
            : t(
                `A pattern starts at $${a}$, and the rule is "add $${d}$". What is the ${n}th number?`,
                `一个数列从 $${a}$ 开始，规则是"加 $${d}$"。第 ${n} 个数是多少？`,
              ),
          answer: value,
          form: "integer",
          wrong: mult ? [a * d ** n, a * d * n] : [a + n * d, a * n + d],
          solution: mult
            ? t(
                `The numbers are $${range0(n)
                  .map((i) => a * d ** i)
                  .join(", ")}$.`,
                `各数依次为 $${range0(n)
                  .map((i) => a * d ** i)
                  .join(", ")}$。`,
              )
            : t(
                `The numbers are $${range0(n)
                  .map((i) => a + i * d)
                  .join(", ")}$.`,
                `各数依次为 $${range0(n)
                  .map((i) => a + i * d)
                  .join(", ")}$。`,
              ),
        });
      },
    },
    {
      id: "patterns-from-two-step-rules",
      title: t("Following a two-step rule", "按两步规则"),
      explanation: t(
        'Start at $1$ with the rule "multiply by $2$, then add $1$": $1, 3, 7, 15$.',
        '从 $1$ 开始，规则为"乘 $2$，再加 $1$"：$1, 3, 7, 15$。',
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const m = rng.int(2, 3);
        const c = rng.int(1, 5);
        const terms = [a];
        while (terms.length < 4) terms.push(terms[terms.length - 1]! * m + c);
        const value = terms[3]!;
        return numberProblem({
          prompt: t(
            `A pattern starts at $${a}$, and the rule is "multiply by $${m}$, then add $${c}$". What is the 4th number?`,
            `一个数列从 $${a}$ 开始，规则是"乘 $${m}$，再加 $${c}$"。第 4 个数是多少？`,
          ),
          answer: value,
          form: "integer",
          wrong: [terms[2]!, terms[2]! * m, (terms[2]! + c) * m],
          solution: t(`The numbers are $${terms.join(", ")}$.`, `各数依次为 $${terms.join(", ")}$。`),
        });
      },
    },
  ],
};

/** range0 lists 0, 1, …, n − 1. */
const range0 = (n: number) => Array.from({ length: n }, (_, i) => i);

/** identifyingPatterns finds the rule of a pattern and continues it. */
export const identifyingPatterns: TopicDef = {
  id: "identifying-patterns",
  title: t("Identifying Patterns", "找出数列的规律"),
  summary: t(
    "To find the rule of a pattern, compare neighboring numbers: if the difference is always the same, the rule adds it; if each number is the same multiple of the one before, the rule multiplies.",
    "要找出数列的规律，就比较相邻的数：如果差总是相同，规则就是加上这个差；如果每个数都是前一个数的同一倍数，规则就是乘法。",
  ),
  prerequisites: ["generating-patterns"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.C.5"),
  knowledgePoints: [
    {
      id: "continuing-a-pattern",
      title: t("The next number", "下一个数"),
      explanation: t(
        "In $4, 11, 18, 25$ each number is $7$ more than the one before, so the next number is $32$.",
        "在 $4, 11, 18, 25$ 中，每个数都比前一个多 $7$，所以下一个数是 $32$。",
      ),
      generate(rng) {
        const mult = rng.bool(0.3);
        const a = mult ? rng.int(1, 6) : rng.int(1, 40);
        const d = mult ? rng.int(2, 4) : rng.int(3, 15);
        const terms = range0(5).map((i) => (mult ? a * d ** i : a + i * d));
        const value = terms[4]!;
        return numberProblem({
          prompt: t(
            `What is the next number in the pattern $${terms.slice(0, 4).join(", ")}, \\dots$?`,
            `数列 $${terms.slice(0, 4).join(", ")}, \\dots$ 的下一个数是多少？`,
          ),
          answer: value,
          form: "integer",
          wrong: [terms[3]! + (terms[3]! - terms[2]!) + 1, terms[3]! + d, terms[3]! * 2].filter((x) => x !== value),
          solution: mult
            ? t(
                `Each number is $${d}$ times the one before, so the next is $${terms[3]} \\times ${d} = ${value}$.`,
                `每个数都是前一个数的 $${d}$ 倍，所以下一个数是 $${terms[3]} \\times ${d} = ${value}$。`,
              )
            : t(
                `Each number is $${d}$ more than the one before, so the next is $${terms[3]} + ${d} = ${value}$.`,
                `每个数都比前一个多 $${d}$，所以下一个数是 $${terms[3]} + ${d} = ${value}$。`,
              ),
        });
      },
    },
    {
      id: "finding-a-missing-number-in-a-pattern",
      title: t("A missing number", "缺少的数"),
      explanation: t(
        "In $9, 15, \\square, 27, 33$ the step is $6$, so the missing number is $21$.",
        "在 $9, 15, \\square, 27, 33$ 中，每次加 $6$，所以缺少的数是 $21$。",
      ),
      generate(rng) {
        const a = rng.int(1, 50);
        const d = rng.int(2, 25);
        const terms = range0(5).map((i) => a + i * d);
        const gap = rng.int(1, 3);
        const shown = terms.map((x, i) => (i === gap ? "\\square" : String(x)));
        return numberProblem({
          prompt: t(`Find the missing number in the pattern $${shown.join(", ")}$.`, `求数列 $${shown.join(", ")}$ 中缺少的数。`),
          answer: terms[gap]!,
          form: "integer",
          wrong: [terms[gap]! + 1, terms[gap]! - d + 1, terms[gap]! + d],
          solution: t(
            `The numbers go up by $${d}$, so the missing number is $${terms[gap - 1]} + ${d} = ${terms[gap]}$.`,
            `每次增加 $${d}$，所以缺少的数是 $${terms[gap - 1]} + ${d} = ${terms[gap]}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Place value

/** placeValueKPs are the knowledge points of a place value topic for numbers with lo to hi digits. */
function placeValueKPs(lo: number, hi: number): KnowledgePointDef[] {
  return [
    {
      id: `digits-in-places-${hi}`,
      title: t("The digit in a place", "某一位上的数字"),
      explanation: t(
        hi <= 4
          ? "In $5{,}382$, the $5$ is in the thousands place, the $3$ in the hundreds place, the $8$ in the tens place and the $2$ in the ones place."
          : "In $4{,}706{,}215$, the $4$ is in the millions place, the $7$ in the hundred thousands place, the $0$ in the ten thousands place, and the $6$ in the thousands place.",
        hi <= 4
          ? "在 $5{,}382$ 中，$5$ 在千位，$3$ 在百位，$8$ 在十位，$2$ 在个位。"
          : "在 $4{,}706{,}215$ 中，$4$ 在百万位，$7$ 在十万位，$0$ 在万位，$6$ 在千位。",
      ),
      generate(rng) {
        const n = randomWithDigits(rng, rng.int(lo, hi));
        const len = String(n).length;
        const k = rng.int(hi <= 4 ? 0 : 3, len - 1);
        const d = digitAt(n, k);
        return numberProblem({
          prompt: t(
            `Which digit is in the ${placeNames[k]!.en} place of $${fmt(n)}$?`,
            `$${fmt(n)}$ 的${placeNames[k]!["zh-CN"]}上是哪个数字？`,
          ),
          answer: d,
          form: "integer",
          wrong: [digitAt(n, k + 1), digitAt(n, Math.max(0, k - 1)), digitAt(n, len - 1 - k)].filter((x) => x !== d),
          solution: t(
            `Counting places from the right in $${fmt(n)}$, the ${placeNames[k]!.en} digit is $${d}$.`,
            `在 $${fmt(n)}$ 中从右往左数，${placeNames[k]!["zh-CN"]}上的数字是 $${d}$。`,
          ),
        });
      },
    },
    {
      id: `values-of-digits-${hi}`,
      title: t("The value of a digit", "数字表示的值"),
      explanation: t(
        hi <= 4
          ? "A digit's value is the digit times its place: in $5{,}382$ the $3$ is worth $300$."
          : "A digit's value is the digit times its place: in $4{,}706{,}215$ the $7$ is worth $700{,}000$.",
        hi <= 4
          ? "数字表示的值等于数字乘它所在数位的单位：$5{,}382$ 中的 $3$ 表示 $300$。"
          : "数字表示的值等于数字乘它所在数位的单位：$4{,}706{,}215$ 中的 $7$ 表示 $700{,}000$。",
      ),
      generate(rng) {
        let n: number;
        let k: number;
        do {
          n = randomWithDigits(rng, rng.int(lo, hi));
          k = rng.int(hi <= 4 ? 0 : 2, String(n).length - 1);
        } while (digitAt(n, k) === 0 || digitsOf(n).filter((x) => x === digitAt(n, k)).length > 1);
        const d = digitAt(n, k);
        const value = d * 10 ** k;
        return numberProblem({
          prompt: t(`What is the value of the digit $${d}$ in $${fmt(n)}$?`, `$${fmt(n)}$ 中的数字 $${d}$ 表示多少？`),
          answer: value,
          form: "integer",
          wrong: [d, d * 10 ** (k + 1), k > 0 ? d * 10 ** (k - 1) : d * 100],
          solution: t(
            `The $${d}$ is in the ${placeNames[k]!.en} place, so it is worth $${d} \\times ${fmt(10 ** k)} = ${fmt(value)}$.`,
            `$${d}$ 在${placeNames[k]!["zh-CN"]}上，表示 $${d} \\times ${fmt(10 ** k)} = ${fmt(value)}$。`,
          ),
        });
      },
    },
  ];
}

/** placeValueWithNumbersUpToFourDigits names digits and their values in numbers up to 9,999. */
export const placeValueWithNumbersUpToFourDigits: TopicDef = {
  id: "place-value-with-numbers-up-to-four-digits",
  title: t("Place Value With Numbers Up to Four Digits", "四位数以内的数位"),
  summary: t(
    "The places of a four-digit number are, from the right, the ones, tens, hundreds and thousands. Each place is worth ten times the place to its right, so the value of a digit is the digit times 1, 10, 100 or 1,000.",
    "四位数的数位从右往左依次是个位、十位、百位和千位。每一位的单位是它右边一位的十倍，所以一个数字表示的值等于这个数字乘 1、10、100 或 1,000。",
  ),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1", "4.NBT.A.2"),
  knowledgePoints: placeValueKPs(3, 4),
};

/** placeValueWithNumbersUpToSevenDigits extends place value to the millions. */
export const placeValueWithNumbersUpToSevenDigits: TopicDef = {
  id: "place-value-with-numbers-up-to-seven-digits",
  title: t("Place Value With Numbers Up to Seven Digits", "七位数以内的数位"),
  summary: t(
    "After the thousands come the ten thousands, hundred thousands and millions places. Commas separate the digits into groups of three: 4,706,215.",
    "千位之后是万位、十万位和百万位。逗号把数字从右往左每三位分成一组：4,706,215。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-four-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1", "4.NBT.A.2"),
  knowledgePoints: placeValueKPs(5, 7),
};

/** confusableNumbers are numbers a reader might confuse with n: zeros dropped or added, and neighboring digits swapped. */
function confusableNumbers(n: number): number[] {
  const s = String(n);
  const out = new Set<number>();
  const zeroIdx = [...s].map((c, i) => (c === "0" ? i : -1)).filter((i) => i >= 0);
  for (const i of zeroIdx) out.add(Number(s.slice(0, i) + s.slice(i + 1)));
  const firstNonzeroInner = [...s].findIndex((c, i) => i > 0 && c !== "0");
  if (firstNonzeroInner > 0) out.add(Number(`${s.slice(0, firstNonzeroInner)}0${s.slice(firstNonzeroInner)}`));
  for (let i = 0; i + 1 < s.length; i++) {
    if (s[i] !== s[i + 1] && !(i === 0 && s[1] === "0")) out.add(Number(s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2)));
  }
  out.add(n * 10);
  out.delete(n);
  return [...out];
}

/** numberWithZeros is a random number of d digits with at least one inner zero. */
function numberWithZeros(rng: Rng, d: number): number {
  for (;;) {
    const digits = [rng.int(1, 9), ...range0(d - 1).map(() => (rng.bool(0.4) ? 0 : rng.int(1, 9)))];
    if (digits.slice(1).includes(0)) return Number(digits.join(""));
  }
}

/** wordFormKP builds a knowledge point that converts between numbers and words. */
function wordFormKP(id: string, lo: number, hi: number, toWords: boolean): KnowledgePointDef {
  const sample = hi <= 4 ? 3045 : 2006300;
  return {
    id,
    title: hi <= 4 ? t("Numbers up to 9,999", "9,999 以内的数") : t("Numbers up to millions", "百万级的数"),
    explanation: t(
      `$${fmt(sample)}$ is written "${wordsEn(sample)}". Each group of three digits is read as a number from one to nine hundred ninety-nine, followed by "million" or "thousand"; groups of zeros are not read.`,
      `$${fmt(sample)}$ 读作"${wordsZh(sample)}"。中文按万为一级读数，中间连续的 0 只读一个"零"，末尾的 0 不读。`,
    ),
    generate(rng) {
      const n = numberWithZeros(rng, rng.int(lo, hi));
      const wrongNums = confusableNumbers(n);
      if (toWords) {
        return pickChoice(
          rng,
          t(`How is $${fmt(n)}$ written in words?`, `$${fmt(n)}$ 怎么读？`),
          words(n),
          rng.shuffle(wrongNums).map(words),
          t(`$${fmt(n)}$ is "${wordsEn(n)}".`, `$${fmt(n)}$ 读作"${wordsZh(n)}"。`),
        );
      }
      return numberProblem({
        prompt: t(`Write the number in digits: ${wordsEn(n)}.`, `用数字写出：${wordsZh(n)}。`),
        answer: n,
        form: "integer",
        wrong: wrongNums.slice(0, 3),
        solution: t(`"${wordsEn(n)}" is $${fmt(n)}$.`, `"${wordsZh(n)}"写作 $${fmt(n)}$。`),
      });
    },
  };
}

/** writingWholeNumbersInWords chooses the word form of a number. */
export const writingWholeNumbersInWords: TopicDef = {
  id: "writing-whole-numbers-in-words",
  title: t("Writing Whole Numbers in Words", "用文字写整数"),
  summary: t(
    'To write a number in words, read each group of three digits and name the group: 2,006,300 is "two million, six thousand, three hundred". Zeros are not read, but they decide which places the other digits are in.',
    '把整数写成文字时，按数级读出每一级再加上级名：2,006,300 读作"二百万六千三百"。0 不单独读出（中间的 0 读作"零"），但它决定了其他数字所在的数位。',
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    wordFormKP("writing-four-digit-numbers-in-words", 4, 4, true),
    wordFormKP("writing-large-numbers-in-words", 5, 7, true),
  ],
};

/** readingWholeNumbersWrittenInWords writes numbers given in words as digits. */
export const readingWholeNumbersWrittenInWords: TopicDef = {
  id: "reading-whole-numbers-written-in-words",
  title: t("Reading Whole Numbers Written in Words", "读懂用文字表示的整数"),
  summary: t(
    'To write a number given in words, write each group and fill the places nobody mentions with zeros: "five thousand, twenty" is 5,020.',
    '把用文字表示的数写成数字时，写出每一级，没有提到的数位用 0 补上："五千零二十"写作 5,020。',
  ),
  prerequisites: ["writing-whole-numbers-in-words"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    wordFormKP("reading-four-digit-numbers-written-in-words", 4, 4, false),
    wordFormKP("reading-large-numbers-written-in-words", 5, 7, false),
  ],
};

/** convertingFromStandardFormToExpandedForm writes numbers in expanded form. */
export const convertingFromStandardFormToExpandedForm: TopicDef = {
  id: "converting-from-standard-form-to-expanded-form",
  title: t("Converting From Standard Form to Expanded Form", "把标准形式改写成展开形式"),
  summary: t(
    "The expanded form of a number is the sum of the values of its digits: 40,605 = 40,000 + 600 + 5. Zeros contribute nothing and are left out.",
    "一个数的展开形式是各个数字所表示的值之和：40,605 = 40,000 + 600 + 5。0 不表示任何值，可以省略。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    {
      id: "choosing-the-expanded-form",
      title: t("Choosing the expanded form", "选出展开形式"),
      explanation: t(
        "$7{,}308 = 7{,}000 + 300 + 8$, not $7{,}000 + 300 + 80$.",
        "$7{,}308 = 7{,}000 + 300 + 8$，而不是 $7{,}000 + 300 + 80$。",
      ),
      generate(rng) {
        const n = numberWithZeros(rng, rng.int(4, 6));
        const terms = expandedTerms(n);
        const shiftLast = terms.map((x, i) => (i === terms.length - 1 ? x * 10 : x));
        const digitsOnly = digitsOf(n)
          .reverse()
          .filter((d) => d > 0);
        const wrong = [
          mathText(shiftLast.map(fmt).join(" + ")),
          mathText(digitsOnly.join(" + ")),
          mathText(terms.map((x) => fmt(x / 10 >= 1 ? x / 10 : x * 10)).join(" + ")),
          ...confusableNumbers(n).map((m) => mathText(expandedTex(m))),
        ];
        return pickChoice(
          rng,
          t(`Which is the expanded form of $${fmt(n)}$?`, `$${fmt(n)}$ 的展开形式是哪一个？`),
          mathText(expandedTex(n)),
          wrong,
          t(
            `Write the value of each nonzero digit: $${fmt(n)} = ${expandedTex(n)}$.`,
            `写出每个非零数字表示的值：$${fmt(n)} = ${expandedTex(n)}$。`,
          ),
        );
      },
    },
    {
      id: "missing-terms-of-expanded-forms",
      title: t("A missing term", "缺少的加数"),
      explanation: t(
        "$52{,}074 = 50{,}000 + 2{,}000 + \\square + 4$: the missing term is the value of the $7$, which is $70$.",
        "$52{,}074 = 50{,}000 + 2{,}000 + \\square + 4$：缺少的是 $7$ 表示的值 $70$。",
      ),
      generate(rng) {
        const n = numberWithZeros(rng, rng.int(4, 7));
        const terms = expandedTerms(n);
        const gap = rng.int(0, terms.length - 1);
        const shown = terms.map((x, i) => (i === gap ? "\\square" : fmt(x)));
        const value = terms[gap]!;
        const lead = Number(String(value)[0]);
        return numberProblem({
          prompt: t(`Find the missing number: $${fmt(n)} = ${shown.join(" + ")}$.`, `求方框中的数：$${fmt(n)} = ${shown.join(" + ")}$。`),
          answer: value,
          form: "integer",
          wrong: [lead, value * 10, value >= 10 ? value / 10 : value * 100],
          solution: t(
            `The missing term is the value of the digit $${lead}$, which is $${fmt(value)}$.`,
            `缺少的是数字 $${lead}$ 表示的值，即 $${fmt(value)}$。`,
          ),
        });
      },
    },
  ],
};

/** convertingFromExpandedFormToStandardForm adds the terms of expanded forms. */
export const convertingFromExpandedFormToStandardForm: TopicDef = {
  id: "converting-from-expanded-form-to-standard-form",
  title: t("Converting From Expanded Form to Standard Form", "把展开形式改写成标准形式"),
  summary: t(
    "To write an expanded form as a number, put each digit in its place and write zeros in the places that are missing: 6,000 + 50 + 3 = 6,053. The terms may come in any order.",
    "把展开形式写成一个数时，把每个数字放到它的数位上，缺少的数位写 0：6,000 + 50 + 3 = 6,053。各项可以按任意顺序给出。",
  ),
  prerequisites: ["converting-from-standard-form-to-expanded-form"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    {
      id: "writing-expanded-forms-as-numbers",
      title: t("Terms in order", "按顺序的展开形式"),
      explanation: t(
        "$30{,}000 + 400 + 7 = 30{,}407$: there are no thousands and no tens, so those places get zeros.",
        "$30{,}000 + 400 + 7 = 30{,}407$：没有千和十，所以这两位写 $0$。",
      ),
      generate(rng) {
        const n = numberWithZeros(rng, rng.int(4, 7));
        const squash = Number(
          digitsOf(n)
            .reverse()
            .filter((d) => d > 0)
            .join(""),
        );
        return numberProblem({
          prompt: t(`Write $${expandedTex(n)}$ as a number.`, `把 $${expandedTex(n)}$ 写成一个数。`),
          answer: n,
          form: "integer",
          wrong: [squash, ...confusableNumbers(n).slice(0, 2)],
          solution: t(
            `Put each digit in its place, with zeros in the empty places: $${fmt(n)}$.`,
            `把每个数字放到它的数位上，空着的数位写 $0$：$${fmt(n)}$。`,
          ),
        });
      },
    },
    {
      id: "writing-scrambled-expanded-forms-as-numbers",
      title: t("Terms in any order", "打乱顺序的展开形式"),
      explanation: t(
        "$8 + 500 + 20{,}000 = 20{,}508$: sort the terms by place first.",
        "$8 + 500 + 20{,}000 = 20{,}508$：先按数位整理各项。",
      ),
      generate(rng) {
        let n: number;
        do n = numberWithZeros(rng, rng.int(4, 7));
        while (expandedTerms(n).length < 3);
        const terms = rng.shuffle(expandedTerms(n));
        const squash = Number(terms.map((x) => String(x)[0]).join(""));
        return numberProblem({
          prompt: t(`Write $${terms.map(fmt).join(" + ")}$ as a number.`, `把 $${terms.map(fmt).join(" + ")}$ 写成一个数。`),
          answer: n,
          form: "integer",
          wrong: [squash, ...confusableNumbers(n).slice(0, 2)],
          solution: t(
            `In place order the terms are $${expandedTex(n)}$, so the number is $${fmt(n)}$.`,
            `按数位整理为 $${expandedTex(n)}$，所以这个数是 $${fmt(n)}$。`,
          ),
        });
      },
    },
  ],
};

/** equivalentPlaceValueRepresentations counts the tens, hundreds or thousands in a number. */
export const equivalentPlaceValueRepresentations: TopicDef = {
  id: "equivalent-place-value-representations",
  title: t("Equivalent Place Value Representations", "等值的数位表示"),
  summary: t(
    "A number can be described in different units: 3,400 is 3 thousands 4 hundreds, but also 34 hundreds or 340 tens, since 1 thousand = 10 hundreds and 1 hundred = 10 tens.",
    "一个数可以用不同的计数单位来描述：3,400 是 3 个千和 4 个百，也是 34 个百或 340 个十，因为 1 个千 = 10 个百，1 个百 = 10 个十。",
  ),
  prerequisites: ["converting-from-expanded-form-to-standard-form"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1"),
  knowledgePoints: [
    {
      id: "counting-units-in-round-numbers",
      title: t("How many hundreds?", "有多少个百"),
      explanation: t(
        "$5{,}600 = 56$ hundreds, since $56 \\times 100 = 5{,}600$.",
        "$5{,}600 = 56$ 个百，因为 $56 \\times 100 = 5{,}600$。",
      ),
      generate(rng) {
        const k = rng.int(1, 3);
        const q = rng.int(11, 999);
        const n = q * 10 ** k;
        return numberProblem({
          prompt: t(`$${fmt(n)}$ is how many ${placeNames[k]!.en}?`, `$${fmt(n)}$ 是多少个${roundNames[k]!["zh-CN"]}？`),
          answer: q,
          form: "integer",
          wrong: [digitAt(n, k), q * 10, Math.floor(q / 10)],
          solution: t(
            `$${fmt(q)} \\times ${fmt(10 ** k)} = ${fmt(n)}$, so $${fmt(n)}$ is $${fmt(q)}$ ${placeNames[k]!.en}.`,
            `$${fmt(q)} \\times ${fmt(10 ** k)} = ${fmt(n)}$，所以 $${fmt(n)}$ 是 $${fmt(q)}$ 个${roundNames[k]!["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "counting-whole-units-in-a-number",
      title: t("Whole tens in a number", "一个数中有多少个整十"),
      explanation: t(
        "$4{,}237$ contains $423$ whole tens ($4{,}230$) and $7$ ones; the tens digit alone is only $3$.",
        "$4{,}237$ 中有 $423$ 个十（即 $4{,}230$）和 $7$ 个一；十位上的数字只是 $3$。",
      ),
      generate(rng) {
        const n = randomWithDigits(rng, rng.int(4, 5));
        const k = rng.int(1, 2);
        const value = Math.floor(n / 10 ** k);
        return numberProblem({
          prompt: t(`How many whole ${placeNames[k]!.en} are in $${fmt(n)}$?`, `$${fmt(n)}$ 中一共有多少个${roundNames[k]!["zh-CN"]}？`),
          answer: value,
          form: "integer",
          wrong: [digitAt(n, k), Math.round(n / 10 ** k) === value ? value + 1 : Math.round(n / 10 ** k), Math.floor(n / 10 ** (k + 1))],
          solution: t(
            `$${fmt(value * 10 ** k)} = ${fmt(value)} \\times ${fmt(10 ** k)}$, and the rest, $${n - value * 10 ** k}$, is less than one ${roundNames[k]!.en}. So there are $${fmt(value)}$.`,
            `$${fmt(value * 10 ** k)} = ${fmt(value)} \\times ${fmt(10 ** k)}$，剩下的 $${n - value * 10 ** k}$ 不够一个${roundNames[k]!["zh-CN"]}。所以一共有 $${fmt(value)}$ 个。`,
          ),
        });
      },
    },
  ],
};

/** moreOnEquivalentPlaceValueRepresentations combines units given with more than nine of a kind. */
export const moreOnEquivalentPlaceValueRepresentations: TopicDef = {
  id: "more-on-equivalent-place-value-representations",
  title: t("More on Equivalent Place Value Representations", "等值的数位表示（进阶）"),
  summary: t(
    "When a description has ten or more of a unit, regroup them into the next unit: 5 thousands + 23 tens = 5,000 + 230 = 5,230.",
    "当某种计数单位有十个或更多时，把它们合并成更大的单位：5 个千 + 23 个十 = 5,000 + 230 = 5,230。",
  ),
  prerequisites: ["equivalent-place-value-representations"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1"),
  knowledgePoints: [
    {
      id: "combining-units-with-regrouping",
      title: t("Combining units", "合并计数单位"),
      explanation: t(
        "$3$ thousands $+ 14$ hundreds $= 3{,}000 + 1{,}400 = 4{,}400$.",
        "$3$ 个千 $+ 14$ 个百 $= 3{,}000 + 1{,}400 = 4{,}400$。",
      ),
      generate(rng) {
        const hiK = rng.int(2, 3);
        const loK = hiK - rng.int(1, 2);
        const a = rng.int(1, 9);
        const b = rng.int(10, 99);
        const value = a * 10 ** hiK + b * 10 ** loK;
        return numberProblem({
          prompt: t(
            `Write as a number: $${a}$ ${placeNames[hiK]!.en} $+$ $${b}$ ${placeNames[loK]!.en}.`,
            `写成一个数：$${a}$ 个${roundNames[hiK]!["zh-CN"]} $+$ $${b}$ 个${roundNames[loK]!["zh-CN"]}。`,
          ),
          answer: value,
          form: "integer",
          wrong: [Number(`${a}${b}${"0".repeat(loK)}`), a * 10 ** hiK + b, a * 10 ** hiK + b * 10 ** (loK + 1)].filter((x) => x !== value),
          solution: t(
            `$${fmt(a * 10 ** hiK)} + ${fmt(b * 10 ** loK)} = ${fmt(value)}$.`,
            `$${fmt(a * 10 ** hiK)} + ${fmt(b * 10 ** loK)} = ${fmt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "combining-three-kinds-of-units",
      title: t("Three kinds of units", "三种计数单位"),
      explanation: t(
        "$2$ hundreds $+ 15$ tens $+ 12$ ones $= 200 + 150 + 12 = 362$.",
        "$2$ 个百 $+ 15$ 个十 $+ 12$ 个一 $= 200 + 150 + 12 = 362$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(10, 30);
        const c = rng.int(10, 30);
        const value = a * 100 + b * 10 + c;
        return numberProblem({
          prompt: t(
            `Write as a number: $${a}$ hundreds $+$ $${b}$ tens $+$ $${c}$ ones.`,
            `写成一个数：$${a}$ 个百 $+$ $${b}$ 个十 $+$ $${c}$ 个一。`,
          ),
          answer: value,
          form: "integer",
          wrong: [Number(`${a}${b}${c}`), a * 100 + b + c, a + b + c],
          solution: t(`$${a * 100} + ${b * 10} + ${c} = ${value}$.`, `$${a * 100} + ${b * 10} + ${c} = ${value}$。`),
        });
      },
    },
  ],
};

/** equivalentPlaceValueRepresentationsAndBorrowing regroups one unit into ten of the next smaller unit. */
export const equivalentPlaceValueRepresentationsAndBorrowing: TopicDef = {
  id: "equivalent-place-value-representations-and-borrowing",
  title: t("Equivalent Place Value Representations and Borrowing", "等值的数位表示与借位"),
  summary: t(
    "Regrouping also works the other way: one hundred can be traded for ten tens. So 4,302 = 4 thousands + 3 hundreds + 0 tens + 2 ones = 4 thousands + 2 hundreds + 10 tens + 2 ones. Subtraction uses this to borrow.",
    "反过来也可以拆分：一个百可以换成十个十。所以 4,302 = 4 个千 + 3 个百 + 0 个十 + 2 个一 = 4 个千 + 2 个百 + 10 个十 + 2 个一。减法中的借位就是这样做的。",
  ),
  prerequisites: ["more-on-equivalent-place-value-representations"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.B.4"),
  knowledgePoints: [
    {
      id: "breaking-a-hundred-into-tens",
      title: t("Trading one for ten", "一换十"),
      explanation: t(
        "$652 = 6$ hundreds $+ 4$ tens $+ \\square$ ones: one ten was traded for ten ones, so $\\square = 12$.",
        "$652 = 6$ 个百 $+ 4$ 个十 $+ \\square$ 个一：拿一个十换成十个一，所以 $\\square = 12$。",
      ),
      generate(rng) {
        let n: number;
        let k: number;
        do {
          n = randomWithDigits(rng, rng.int(3, 4));
          k = rng.int(1, String(n).length - 1);
        } while (digitAt(n, k) === 0);
        const len = String(n).length;
        const parts = range0(len)
          .reverse()
          .map((p) => {
            const d = digitAt(n, p) - (p === k ? 1 : 0) + (p === k - 1 ? 10 : 0);
            return { p, d };
          });
        const value = parts.find((x) => x.p === k - 1)!.d;
        const shownEn = parts.map((x) => `${x.p === k - 1 ? "\\square" : `${x.d}`}\\text{ ${placeNames[x.p]!.en}}`).join(" + ");
        const shownZh = parts.map((x) => `${x.p === k - 1 ? "\\square" : `${x.d}`}\\text{ 个${roundNames[x.p]!["zh-CN"]}}`).join(" + ");
        return numberProblem({
          prompt: t(`Fill in the box: $${fmt(n)} = ${shownEn}$`, `填空：$${fmt(n)} = ${shownZh}$`),
          answer: value,
          form: "integer",
          wrong: [value - 10, value + 1, 10],
          solution: t(
            `One ${roundNames[k]!.en} was traded for ten ${placeNames[k - 1]!.en}: $${digitAt(n, k - 1)} + 10 = ${value}$.`,
            `拿一个${roundNames[k]!["zh-CN"]}换成十个${roundNames[k - 1]!["zh-CN"]}：$${digitAt(n, k - 1)} + 10 = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "borrowing-across-zeros",
      title: t("Borrowing across a zero", "隔着 0 借位"),
      explanation: t(
        "To take ones from $4{,}302$ when there are no tens, trade a hundred for ten tens, then a ten for ten ones: $4{,}302 = 4$ thousands $+ 2$ hundreds $+ 9$ tens $+ 12$ ones.",
        "要从 $4{,}302$ 中拿出一个十来换一，而十位是 $0$ 时，先拿一个百换成十个十，再拿一个十换成十个一：$4{,}302 = 4$ 个千 $+ 2$ 个百 $+ 9$ 个十 $+ 12$ 个一。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(0, 8);
        const n = a * 1000 + b * 100 + c;
        const askTens = rng.bool();
        return numberProblem({
          prompt: askTens
            ? t(
                `$${fmt(n)} = ${a}$ thousands $+ ${b - 1}$ hundreds $+ \\square$ tens $+ ${c + 10}$ ones. Find the number in the box.`,
                `$${fmt(n)} = ${a}$ 个千 $+ ${b - 1}$ 个百 $+ \\square$ 个十 $+ ${c + 10}$ 个一。求方框中的数。`,
              )
            : t(
                `$${fmt(n)} = ${a}$ thousands $+ ${b - 1}$ hundreds $+ 9$ tens $+ \\square$ ones. Find the number in the box.`,
                `$${fmt(n)} = ${a}$ 个千 $+ ${b - 1}$ 个百 $+ 9$ 个十 $+ \\square$ 个一。求方框中的数。`,
              ),
          answer: askTens ? 9 : c + 10,
          form: "integer",
          wrong: askTens ? [10, 0] : [c, c + 9, 10],
          solution: t(
            `Trade one hundred for ten tens, then one of those tens for ten ones: $${b - 1}$ hundreds, $9$ tens and $${c} + 10 = ${c + 10}$ ones.`,
            `拿一个百换成十个十，再拿其中一个十换成十个一：$${b - 1}$ 个百、$9$ 个十、$${c} + 10 = ${c + 10}$ 个一。`,
          ),
        });
      },
    },
  ],
};

/** comparingPlaceValues compares the values of the same digit in different places. */
export const comparingPlaceValues: TopicDef = {
  id: "comparing-place-values",
  title: t("Comparing Place Values", "比较数位的值"),
  summary: t(
    "A digit in one place is worth ten times what it is worth in the place to its right. In 7,770 the first 7 is worth 7,000, which is 10 times the 700 of the second 7 and 100 times the 70 of the third.",
    "同一个数字在某一位上表示的值，是它在右边一位上所表示的值的十倍。在 7,770 中，第一个 7 表示 7,000，是第二个 7 所表示的 700 的 10 倍，是第三个 7 所表示的 70 的 100 倍。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1"),
  knowledgePoints: [
    {
      id: "comparing-a-digit-in-two-numbers",
      title: t("The same digit in two numbers", "两个数中的同一个数字"),
      explanation: t(
        "The $6$ in $46{,}213$ is worth $6{,}000$; the $6$ in $3{,}562$ is worth $60$. $6{,}000$ is $100$ times $60$.",
        "$46{,}213$ 中的 $6$ 表示 $6{,}000$；$3{,}562$ 中的 $6$ 表示 $60$。$6{,}000$ 是 $60$ 的 $100$ 倍。",
      ),
      generate(rng) {
        const d = rng.int(1, 9);
        const i = rng.int(2, 5);
        const j = i - rng.int(1, 2);
        const make = (k: number) => {
          for (;;) {
            const n = randomWithDigits(rng, rng.int(k + 1, k + 2));
            const ds = digitsOf(n);
            ds[k] = d;
            const m = Number(ds.reverse().join(""));
            if (digitsOf(m).filter((x) => x === d).length === 1 && String(m).length === String(n).length) return m;
          }
        };
        const a = make(i);
        const b = make(j);
        const value = 10 ** (i - j);
        return numberProblem({
          prompt: t(
            `The value of the $${d}$ in $${fmt(a)}$ is how many times the value of the $${d}$ in $${fmt(b)}$?`,
            `$${fmt(a)}$ 中的 $${d}$ 表示的值是 $${fmt(b)}$ 中的 $${d}$ 表示的值的多少倍？`,
          ),
          answer: value,
          form: "integer",
          wrong: [i - j, value * 10, value === 10 ? 100 : 10],
          solution: t(
            `They are worth $${fmt(d * 10 ** i)}$ and $${fmt(d * 10 ** j)}$, and $${fmt(d * 10 ** i)} \\div ${fmt(d * 10 ** j)} = ${fmt(value)}$.`,
            `它们分别表示 $${fmt(d * 10 ** i)}$ 和 $${fmt(d * 10 ** j)}$，$${fmt(d * 10 ** i)} \\div ${fmt(d * 10 ** j)} = ${fmt(value)}$。`,
          ),
        });
      },
    },
    {
      id: "comparing-a-repeated-digit",
      title: t("A repeated digit", "重复出现的数字"),
      explanation: t(
        "In $5{,}352$ the first $5$ is worth $5{,}000$ and the second $50$; the first is $100$ times the second.",
        "在 $5{,}352$ 中，第一个 $5$ 表示 $5{,}000$，第二个表示 $50$；前者是后者的 $100$ 倍。",
      ),
      generate(rng) {
        const d = rng.int(1, 9);
        const len = rng.int(4, 7);
        const i = rng.int(2, len - 1);
        const j = rng.int(Math.max(0, i - 3), i - 1);
        const ds = range0(len).map((k) =>
          k === i || k === j ? d : rng.pick(range0(10).filter((x) => x !== d && (k !== len - 1 || x > 0))),
        );
        const n = Number(ds.reverse().join(""));
        const value = 10 ** (i - j);
        return numberProblem({
          prompt: t(
            `In $${fmt(n)}$, the $${d}$ in the ${placeNames[i]!.en} place is worth how many times the $${d}$ in the ${placeNames[j]!.en} place?`,
            `在 $${fmt(n)}$ 中，${placeNames[i]!["zh-CN"]}上的 $${d}$ 表示的值是${placeNames[j]!["zh-CN"]}上的 $${d}$ 的多少倍？`,
          ),
          answer: value,
          form: "integer",
          wrong: [i - j, value * 10, d],
          solution: t(
            `It is $${i - j}$ place${i - j > 1 ? "s" : ""} further left, so it is worth $${fmt(value)}$ times as much.`,
            `它向左多了 $${i - j}$ 位，所以表示的值是 $${fmt(value)}$ 倍。`,
          ),
        });
      },
    },
  ],
};

/** relationOptions are the comparison symbols. */
const relationOptions: readonly Text[] = [mathText("<"), mathText("="), mathText(">")];

/** comparingWholeNumbers compares two whole numbers with <, = or >. */
export const comparingWholeNumbers: TopicDef = {
  id: "comparing-whole-numbers",
  title: t("Comparing Whole Numbers", "比较整数的大小"),
  summary: t(
    "A whole number with more digits is greater. With the same number of digits, compare from the left: the first place where the digits differ decides. The symbols < (less than), > (greater than) and = record the result.",
    "位数多的整数较大。位数相同时，从左往右比较：第一个数字不同的数位决定大小。用符号 <（小于）、>（大于）和 = 记录结果。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    {
      id: "comparing-numbers-with-different-numbers-of-digits",
      title: t("Different numbers of digits", "位数不同"),
      explanation: t(
        "$9{,}876 < 10{,}002$: a five-digit number is greater than any four-digit number.",
        "$9{,}876 < 10{,}002$：五位数比任何四位数都大。",
      ),
      generate(rng) {
        const da = rng.int(3, 6);
        const a = randomWithDigits(rng, da);
        const b = randomWithDigits(rng, da + (rng.bool() ? 1 : -1));
        const rel = a < b ? 0 : 2;
        return choiceProblem({
          prompt: t(
            `Which symbol makes this true? $$${fmt(a)} \\ \\square \\ ${fmt(b)}$$`,
            `方框中应填哪个符号？$$${fmt(a)} \\ \\square \\ ${fmt(b)}$$`,
          ),
          options: relationOptions,
          correct: rel,
          solution: t(
            `$${fmt(a)}$ has ${String(a).length} digits and $${fmt(b)}$ has ${String(b).length}, so $${fmt(a)} ${rel === 0 ? "<" : ">"} ${fmt(b)}$.`,
            `$${fmt(a)}$ 是 ${String(a).length} 位数，$${fmt(b)}$ 是 ${String(b).length} 位数，所以 $${fmt(a)} ${rel === 0 ? "<" : ">"} ${fmt(b)}$。`,
          ),
        });
      },
    },
    {
      id: "comparing-numbers-with-the-same-number-of-digits",
      title: t("The same number of digits", "位数相同"),
      explanation: t(
        "$47{,}312$ and $47{,}298$ first differ in the hundreds place: $3 > 2$, so $47{,}312 > 47{,}298$.",
        "$47{,}312$ 与 $47{,}298$ 第一个不同的数位是百位：$3 > 2$，所以 $47{,}312 > 47{,}298$。",
      ),
      generate(rng) {
        const len = rng.int(4, 7);
        const a = randomWithDigits(rng, len);
        const equal = rng.bool(0.15);
        let b = a;
        let k = 0;
        if (!equal) {
          k = rng.int(0, len - 2);
          const ds = digitsOf(a);
          let nd: number;
          do nd = rng.int(0, 9);
          while (nd === ds[k]);
          ds[k] = nd;
          for (let i = 0; i < k; i++) ds[i] = rng.int(0, 9);
          b = Number(ds.reverse().join(""));
        }
        const rel = a < b ? 0 : a === b ? 1 : 2;
        const sym = ["<", "=", ">"][rel];
        return choiceProblem({
          prompt: t(
            `Which symbol makes this true? $$${fmt(a)} \\ \\square \\ ${fmt(b)}$$`,
            `方框中应填哪个符号？$$${fmt(a)} \\ \\square \\ ${fmt(b)}$$`,
          ),
          options: relationOptions,
          correct: rel,
          solution: equal
            ? t("All the digits are the same, so the numbers are equal.", "所有数字都相同，所以两数相等。")
            : t(
                `The numbers first differ in the ${placeNames[k]!.en} place: $${digitAt(a, k)}$ and $${digitAt(b, k)}$. So $${fmt(a)} ${sym} ${fmt(b)}$.`,
                `两数第一个不同的数位是${placeNames[k]!["zh-CN"]}：$${digitAt(a, k)}$ 与 $${digitAt(b, k)}$。所以 $${fmt(a)} ${sym} ${fmt(b)}$。`,
              ),
        });
      },
    },
  ],
};

/** comparingWholeNumbersUsingPlaceValue picks the greatest number and finds missing digits in comparisons. */
export const comparingWholeNumbersUsingPlaceValue: TopicDef = {
  id: "comparing-whole-numbers-using-place-value",
  title: t("Comparing Whole Numbers Using Place Value", "利用数位比较整数"),
  summary: t(
    "Comparing place by place from the left also orders several numbers and decides which digits can fill a gap: 3,□52 < 3,652 holds for □ = 0, 1, …, 5.",
    "从左往右逐位比较，也可以给几个数排序，并确定空缺处可以填哪些数字：3,□52 < 3,652 在 □ = 0, 1, …, 5 时成立。",
  ),
  prerequisites: ["comparing-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    {
      id: "finding-the-greatest-number",
      title: t("The greatest number", "最大的数"),
      explanation: t(
        "Of $52{,}318$, $52{,}381$, $52{,}183$ and $51{,}832$, the greatest is $52{,}381$: compare the thousands, then the hundreds, then the tens.",
        "$52{,}318$、$52{,}381$、$52{,}183$ 和 $51{,}832$ 中最大的是 $52{,}381$：依次比较千位、百位、十位。",
      ),
      generate(rng) {
        const len = rng.int(4, 6);
        const base = digitsOf(randomWithDigits(rng, len)).reverse();
        const nums = new Set<number>([Number(base.join(""))]);
        while (nums.size < 4) {
          const ds = rng.shuffle([...base]);
          if (ds[0] !== 0) nums.add(Number(ds.join("")));
          if (nums.size < 4 && rng.bool(0.3)) {
            const v = [...base];
            const i = rng.int(1, len - 1);
            v[i] = rng.int(0, 9);
            nums.add(Number(v.join("")));
          }
        }
        const list = [...nums];
        const max = Math.max(...list);
        const asc = rng.bool(0.3);
        const target = asc ? Math.min(...list) : max;
        return pickChoice(
          rng,
          asc
            ? t(`Which number is the least: $${list.map(fmt).join("$, $")}$?`, `$${list.map(fmt).join("$、$")}$ 中哪个数最小？`)
            : t(`Which number is the greatest: $${list.map(fmt).join("$, $")}$?`, `$${list.map(fmt).join("$、$")}$ 中哪个数最大？`),
          mathText(fmt(target)),
          list.filter((x) => x !== target).map((x) => mathText(fmt(x))),
          t(
            `Compare place by place from the left: in order, $${[...list]
              .sort((a, b) => a - b)
              .map(fmt)
              .join(" < ")}$.`,
            `从左往右逐位比较：$${[...list]
              .sort((a, b) => a - b)
              .map(fmt)
              .join(" < ")}$。`,
          ),
        );
      },
    },
    {
      id: "missing-digits-in-comparisons",
      title: t("A missing digit", "缺少的数字"),
      explanation: t(
        "For $3{,}\\square52 < 3{,}652$: with $\\square = 6$ we would compare $52$ with $52$ and get equality, so the greatest digit that works is $5$.",
        "对于 $3{,}\\square52 < 3{,}652$：若 $\\square = 6$，接下来比较 $52$ 与 $52$，两数相等，所以能填的最大数字是 $5$。",
      ),
      generate(rng) {
        let b: number;
        let k: number;
        let a: number;
        const len = rng.int(4, 6);
        do {
          b = randomWithDigits(rng, len);
          k = rng.int(1, len - 2);
          const ds = digitsOf(b);
          for (let i = 0; i < k; i++) ds[i] = rng.int(0, 9);
          a = Number(ds.reverse().join(""));
        } while (digitAt(b, k) === 0 || digitAt(b, k) === 9 || a % 10 ** k === b % 10 ** k);
        const lowerLess = a % 10 ** k < b % 10 ** k;
        const value = lowerLess ? digitAt(b, k) : digitAt(b, k) - 1;
        const aTex = fmt(a).split("");
        // Replace the digit of a in place k by a box; the LaTeX has "{,}" separators, so walk the digits.
        let seen = 0;
        const target = String(a).length - 1 - k;
        const boxed = aTex
          .map((c) => {
            if (/\d/.test(c)) {
              const out = seen === target ? "\\square" : c;
              seen++;
              return out;
            }
            return c;
          })
          .join("");
        return numberProblem({
          prompt: t(
            `What is the greatest digit that can go in the box? $$${boxed} < ${fmt(b)}$$`,
            `方框中最大能填几？$$${boxed} < ${fmt(b)}$$`,
          ),
          answer: value,
          form: "integer",
          wrong: [lowerLess ? value - 1 : value + 1, 9, digitAt(b, k) + 1].filter((x) => x !== value),
          solution: lowerLess
            ? t(
                `With the digit $${digitAt(b, k)}$ the numbers agree up to that place, and then $${a % 10 ** k}$ is less than $${b % 10 ** k}$; a larger digit makes the number too big. So the answer is $${value}$.`,
                `填 $${digitAt(b, k)}$ 时两数到这一位都相同，接下来 $${a % 10 ** k}$ 小于 $${b % 10 ** k}$；更大的数字会使这个数过大。所以答案是 $${value}$。`,
              )
            : t(
                `With the digit $${digitAt(b, k)}$ the numbers agree up to that place, and then $${a % 10 ** k}$ is not less than $${b % 10 ** k}$. So the digit must be smaller: $${value}$.`,
                `填 $${digitAt(b, k)}$ 时两数到这一位都相同，接下来 $${a % 10 ** k}$ 不小于 $${b % 10 ** k}$。所以要填更小的数字：$${value}$。`,
              ),
        });
      },
    },
  ],
};

/** RoundingMode is the kind of rounding a topic practices. */
type RoundingMode = "down" | "up" | "nine" | "mixed";

/** roundingNumber is a number whose rounding to the nearest 10ᵏ is of the given kind. */
function roundingNumber(rng: Rng, k: number, mode: RoundingMode): number {
  for (;;) {
    const n = randomWithDigits(rng, rng.int(k + 2, Math.min(7, k + 4)));
    const next = digitAt(n, k - 1);
    const here = digitAt(n, k);
    if (mode === "down" && next < 5 && n % 10 ** k !== 0) return n;
    if (mode === "up" && next >= 5 && here !== 9) return n;
    if (mode === "nine" && next >= 5 && here === 9) return n;
    if (mode === "mixed" && here !== 9 && n % 10 ** k !== 0) return n;
  }
}

/** roundingKP builds a rounding knowledge point for the places in ks. */
function roundingKP(id: string, title: Text, mode: RoundingMode, ks: readonly number[], explanation: Text): KnowledgePointDef {
  return {
    id,
    title,
    explanation,
    generate(rng) {
      const k = rng.pick(ks);
      const n = roundingNumber(rng, k, mode);
      const value = roundTo(n, k);
      const down = Math.floor(n / 10 ** k) * 10 ** k;
      const up = down + 10 ** k;
      const next = digitAt(n, k - 1);
      return numberProblem({
        prompt: t(`Round $${fmt(n)}$ to the nearest ${roundNames[k]!.en}.`, `把 $${fmt(n)}$ 四舍五入到${placeNames[k]!["zh-CN"]}。`),
        answer: value,
        form: "integer",
        wrong: [value === down ? up : down, roundTo(n, k + 1), roundTo(n, k - 1)].filter((x) => x !== value),
        solution: t(
          `Look at the digit to the right of the ${placeNames[k]!.en} place: it is $${next}$, ${next >= 5 ? "5 or more, so round up" : "less than 5, so round down"}. $${fmt(n)}$ rounds to $${fmt(value)}$.`,
          `看${placeNames[k]!["zh-CN"]}右边一位上的数字：是 $${next}$，${next >= 5 ? "大于或等于 5，所以进一" : "小于 5，所以舍去"}。$${fmt(n)}$ 约等于 $${fmt(value)}$。`,
        ),
      });
    },
  };
}

/** roundingDownWholeNumbers rounds numbers whose next digit is less than 5. */
export const roundingDownWholeNumbers: TopicDef = {
  id: "rounding-down-whole-numbers",
  title: t("Rounding Down Whole Numbers", "整数的舍去"),
  summary: t(
    "To round to a place, look at the digit just to its right. If it is less than 5, round down: keep the digit in the rounding place and replace every digit to its right by 0. So 4,327 rounded to the nearest hundred is 4,300.",
    "把一个数四舍五入到某一位时，看这一位右边的数字。如果它小于 5，就舍去：保留这一位上的数字，把它右边的各位都改成 0。所以 4,327 四舍五入到百位是 4,300。",
  ),
  prerequisites: ["comparing-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    roundingKP(
      "rounding-down-to-tens-and-hundreds",
      t("Tens and hundreds", "到十位和百位"),
      "down",
      [1, 2],
      t(
        "$632$ to the nearest ten: the ones digit $2$ is less than $5$, so $630$.",
        "$632$ 四舍五入到十位：个位是 $2$，小于 $5$，所以是 $630$。",
      ),
    ),
    roundingKP(
      "rounding-down-to-thousands-and-beyond",
      t("Thousands and beyond", "到千位及以上"),
      "down",
      [3, 4, 5],
      t(
        "$58{,}412$ to the nearest thousand: the hundreds digit $4$ is less than $5$, so $58{,}000$.",
        "$58{,}412$ 四舍五入到千位：百位是 $4$，小于 $5$，所以是 $58{,}000$。",
      ),
    ),
  ],
};

/** roundingUpWholeNumbers rounds numbers whose next digit is 5 or more. */
export const roundingUpWholeNumbers: TopicDef = {
  id: "rounding-up-whole-numbers",
  title: t("Rounding Up Whole Numbers", "整数的进一"),
  summary: t(
    "If the digit to the right of the rounding place is 5 or more, round up: add 1 to the digit in the rounding place and replace every digit to its right by 0. So 4,372 rounded to the nearest hundred is 4,400.",
    "如果这一位右边的数字大于或等于 5，就进一：把这一位上的数字加 1，并把它右边的各位都改成 0。所以 4,372 四舍五入到百位是 4,400。",
  ),
  prerequisites: ["rounding-down-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    roundingKP(
      "rounding-up-to-tens-and-hundreds",
      t("Tens and hundreds", "到十位和百位"),
      "up",
      [1, 2],
      t(
        "$647$ to the nearest ten: the ones digit $7$ is $5$ or more, so $650$.",
        "$647$ 四舍五入到十位：个位是 $7$，大于或等于 $5$，所以是 $650$。",
      ),
    ),
    roundingKP(
      "mixed-rounding-to-larger-places",
      t("Up or down", "进一还是舍去"),
      "mixed",
      [3, 4, 5],
      t(
        "$58{,}612$ to the nearest thousand: the hundreds digit is $6$, so $59{,}000$; $58{,}412$ would give $58{,}000$.",
        "$58{,}612$ 四舍五入到千位：百位是 $6$，所以是 $59{,}000$；$58{,}412$ 则是 $58{,}000$。",
      ),
    ),
  ],
};

/** roundingUpTheDigit9 rounds up when the rounding digit is 9, carrying into the next place. */
export const roundingUpTheDigit9: TopicDef = {
  id: "rounding-up-the-digit-9",
  title: t("Rounding Up the Digit 9", "数字 9 的进一"),
  summary: t(
    "When the digit in the rounding place is 9 and we round up, it becomes 10: write 0 and carry 1 to the place on its left. So 3,961 rounded to the nearest hundred is 4,000, and 29,95x rounds to 30,000 at the tens.",
    "当这一位上的数字是 9 而需要进一时，它变成 10：写 0 并向左边一位进 1。所以 3,961 四舍五入到百位是 4,000。",
  ),
  prerequisites: ["rounding-up-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    roundingKP(
      "rounding-up-a-9-to-tens-and-hundreds",
      t("Tens and hundreds", "到十位和百位"),
      "nine",
      [1, 2],
      t(
        "$596$ to the nearest ten: $9$ tens plus one more ten is $10$ tens, so $600$.",
        "$596$ 四舍五入到十位：$9$ 个十再加一个十是 $10$ 个十，所以是 $600$。",
      ),
    ),
    roundingKP(
      "rounding-up-a-9-to-larger-places",
      t("Thousands and beyond", "到千位及以上"),
      "nine",
      [3, 4],
      t(
        "$49{,}712$ to the nearest thousand: $9$ thousands round up to $10$ thousands, so $50{,}000$.",
        "$49{,}712$ 四舍五入到千位：$9$ 个千进一成 $10$ 个千，所以是 $50{,}000$。",
      ),
    ),
  ],
};

// ---------------------------------------------------------------------------
// Addition and subtraction

/** Sizes chooses the numbers of an addition or subtraction exercise. */
type Sizes = (rng: Rng) => number[];

/** additionTopic builds an addition topic: compute the sum, then solve a word problem. */
function additionTopic(id: string, title: Text, summary: Text, prerequisites: string[], sizes: Sizes, example: [string, string]): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss("4.NBT.B.4"),
    knowledgePoints: [
      {
        id: `${id}-computing`,
        title: t("Finding the sum", "求和"),
        explanation: t(
          `Line up the digits by place and add from the right, carrying when a column reaches $10$ or more: ${example[0]}`,
          `把数位对齐，从右往左相加，某一列满 $10$ 就向前一位进 $1$：${example[1]}`,
        ),
        generate(rng) {
          const ns = sizes(rng);
          const s = ns.reduce((a, b) => a + b, 0);
          const tex = ns.map(fmt).join(" + ");
          return numberProblem({
            prompt: t(`Find $${tex}$.`, `计算 $${tex}$。`),
            answer: s,
            form: "integer",
            wrong: [ns.reduce(noCarrySum), s + 10, s - 10, s + 100].filter((x) => x !== s),
            solution: t(`Adding column by column with carrying: $${tex} = ${fmt(s)}$.`, `逐列相加并进位：$${tex} = ${fmt(s)}$。`),
          });
        },
      },
      {
        id: `${id}-word-problems`,
        title: t("Word problems", "应用题"),
        explanation: t('"How many in all" and "how many altogether" ask for a sum.', '"一共有多少"求的是和。'),
        generate(rng) {
          const ns = sizes(rng);
          const s = ns.reduce((a, b) => a + b, 0);
          const days = [t("Monday", "星期一"), t("Tuesday", "星期二"), t("Wednesday", "星期三")];
          const partsEn = ns.map((n, i) => `${plain(n)}${i === 0 ? " visitors" : ""} on ${days[i]!.en}`);
          const listEn = ns.length === 3 ? `${partsEn[0]}, ${partsEn[1]}, and ${partsEn[2]}` : partsEn.join(" and ");
          const listZh = ns.map((n, i) => `${days[i]!["zh-CN"]} ${plain(n)} 人`).join("，");
          return numberProblem({
            prompt: t(
              `A museum had ${listEn}. How many visitors did it have in all?`,
              `一家博物馆的参观人数：${listZh}。一共有多少人参观？`,
            ),
            answer: s,
            form: "integer",
            wrong: [ns.reduce(noCarrySum), s + 10, s - 100].filter((x) => x !== s),
            solution: t(`$${ns.map(fmt).join(" + ")} = ${fmt(s)}$.`, `$${ns.map(fmt).join(" + ")} = ${fmt(s)}$。`),
          });
        },
      },
    ],
  };
}

/** carrySizes picks numbers of the given digit counts whose sum carries at least once. */
const carrySizes =
  (...lens: number[]): Sizes =>
  (rng) => {
    for (;;) {
      const ns = lens.map((d) => randomWithDigits(rng, d));
      if (ns.reduce(noCarrySum) !== ns.reduce((a, b) => a + b, 0)) return ns;
    }
  };

export const addingTwoDigitWholeNumbers = additionTopic(
  "adding-two-digit-whole-numbers",
  t("Adding Two-Digit Whole Numbers", "两位数加法"),
  t(
    "Add two-digit numbers by adding the ones, carrying a ten if the ones make 10 or more, and then adding the tens: 47 + 38 = 85.",
    "两位数相加：先加个位，满十向十位进一，再加十位：47 + 38 = 85。",
  ),
  ["place-value-with-numbers-up-to-four-digits"],
  carrySizes(2, 2),
  [
    "$47 + 38$: $7 + 8 = 15$, write $5$ and carry $1$; $4 + 3 + 1 = 8$. So $85$.",
    "$47 + 38$：$7 + 8 = 15$，写 $5$ 进 $1$；$4 + 3 + 1 = 8$。所以是 $85$。",
  ],
);

export const addingThreeDigitAndTwoDigitNumbers = additionTopic(
  "adding-three-digit-and-two-digit-numbers",
  t("Adding Three-Digit and Two-Digit Numbers", "三位数加两位数"),
  t(
    "Line up the ones under the ones: 368 + 57 = 425. A carry from the tens goes into the hundreds.",
    "个位对齐个位：368 + 57 = 425。十位满十要向百位进一。",
  ),
  ["adding-two-digit-whole-numbers"],
  carrySizes(3, 2),
  [
    "$368 + 57$: $8 + 7 = 15$, carry $1$; $6 + 5 + 1 = 12$, carry $1$; $3 + 1 = 4$. So $425$.",
    "$368 + 57$：$8 + 7 = 15$，进 $1$；$6 + 5 + 1 = 12$，进 $1$；$3 + 1 = 4$。所以是 $425$。",
  ],
);

export const addingThreeDigitNumbers = additionTopic(
  "adding-three-digit-numbers",
  t("Adding Three-Digit Numbers", "三位数加法"),
  t(
    "Add three-digit numbers column by column from the ones: 476 + 358 = 834. A carry from the hundreds makes a four-digit sum.",
    "三位数相加，从个位起逐列相加：476 + 358 = 834。百位满十会得到四位数的和。",
  ),
  ["adding-three-digit-and-two-digit-numbers"],
  carrySizes(3, 3),
  [
    "$476 + 358$: $6 + 8 = 14$; $7 + 5 + 1 = 13$; $4 + 3 + 1 = 8$. So $834$.",
    "$476 + 358$：$6 + 8 = 14$；$7 + 5 + 1 = 13$；$4 + 3 + 1 = 8$。所以是 $834$。",
  ],
);

export const addingNumbersUpToFiveDigits = additionTopic(
  "adding-numbers-up-to-five-digits",
  t("Adding Numbers Up to Five Digits", "五位数以内的加法"),
  t(
    "The same column method works for numbers of four and five digits: 36,478 + 8,965 = 45,443.",
    "四位数和五位数也用同样的竖式方法相加：36,478 + 8,965 = 45,443。",
  ),
  ["adding-three-digit-numbers", "place-value-with-numbers-up-to-seven-digits"],
  (rng) => carrySizes(rng.int(4, 5), rng.int(3, 5))(rng),
  ["$36{,}478 + 8{,}965 = 45{,}443$, carrying in every column.", "$36{,}478 + 8{,}965 = 45{,}443$，每一列都要进位。"],
);

export const addingNumbersUpToSevenDigits = additionTopic(
  "adding-numbers-up-to-seven-digits",
  t("Adding Numbers Up to Seven Digits", "七位数以内的加法"),
  t(
    "Numbers in the millions are added the same way, keeping the digits lined up by place: 2,406,758 + 897,465 = 3,304,223.",
    "百万级的数也同样相加，注意数位对齐：2,406,758 + 897,465 = 3,304,223。",
  ),
  ["adding-numbers-up-to-five-digits"],
  (rng) => carrySizes(rng.int(6, 7), rng.int(5, 7))(rng),
  ["$2{,}406{,}758 + 897{,}465 = 3{,}304{,}223$.", "$2{,}406{,}758 + 897{,}465 = 3{,}304{,}223$。"],
);

export const addingThreeMultiDigitNumbers = additionTopic(
  "adding-three-multi-digit-numbers",
  t("Adding Three Multi-Digit Numbers", "三个多位数相加"),
  t(
    "With three numbers, a column can sum to 20 or more, so the carry can be 2: 478 + 365 + 289 = 1,132.",
    "三个数相加时，某一列的和可能达到 20 或更多，进位可能是 2：478 + 365 + 289 = 1,132。",
  ),
  ["adding-numbers-up-to-five-digits"],
  (rng) => carrySizes(rng.int(3, 4), rng.int(3, 4), rng.int(2, 4))(rng),
  [
    "$478 + 365 + 289$: $8 + 5 + 9 = 22$, write $2$ and carry $2$; then $7 + 6 + 8 + 2 = 23$; then $4 + 3 + 2 + 2 = 11$. So $1{,}132$.",
    "$478 + 365 + 289$：$8 + 5 + 9 = 22$，写 $2$ 进 $2$；$7 + 6 + 8 + 2 = 23$；$4 + 3 + 2 + 2 = 11$。所以是 $1{,}132$。",
  ],
);

/** estimatingKP builds an estimation knowledge point rounding each number to the nearest 10ᵏ. */
function estimatingKP(id: string, k: number, subtract: boolean): KnowledgePointDef {
  return {
    id,
    title: t(`Rounding to the nearest ${roundNames[k]!.en}`, `四舍五入到${placeNames[k]!["zh-CN"]}`),
    explanation: subtract
      ? t(
          k === 2 ? "$823 - 368 \\approx 800 - 400 = 400$." : "$7{,}812 - 2{,}456 \\approx 8{,}000 - 2{,}000 = 6{,}000$.",
          k === 2 ? "$823 - 368 \\approx 800 - 400 = 400$。" : "$7{,}812 - 2{,}456 \\approx 8{,}000 - 2{,}000 = 6{,}000$。",
        )
      : t(
          k === 2 ? "$468 + 237 \\approx 500 + 200 = 700$." : "$4{,}612 + 2{,}391 \\approx 5{,}000 + 2{,}000 = 7{,}000$.",
          k === 2 ? "$468 + 237 \\approx 500 + 200 = 700$。" : "$4{,}612 + 2{,}391 \\approx 5{,}000 + 2{,}000 = 7{,}000$。",
        ),
    generate(rng) {
      let a: number;
      let b: number;
      do {
        a = randomWithDigits(rng, k + 1);
        b = randomWithDigits(rng, k + 1);
        if (subtract && b > a) [a, b] = [b, a];
      } while (
        a === b ||
        roundTo(a, k) === roundTo(b, k) ||
        roundTo(subtract ? a - b : a + b, k) === (subtract ? roundTo(a, k) - roundTo(b, k) : roundTo(a, k) + roundTo(b, k)) ||
        a % 10 ** k === 0
      );
      const [ra, rb] = [roundTo(a, k), roundTo(b, k)];
      const value = subtract ? ra - rb : ra + rb;
      const exact = subtract ? a - b : a + b;
      const op = subtract ? "-" : "+";
      return numberProblem({
        prompt: t(
          `Estimate $${fmt(a)} ${op} ${fmt(b)}$ by first rounding each number to the nearest ${roundNames[k]!.en}.`,
          `先把每个数四舍五入到${placeNames[k]!["zh-CN"]}，再估算 $${fmt(a)} ${op} ${fmt(b)}$。`,
        ),
        answer: value,
        form: "integer",
        wrong: [exact, roundTo(exact, k), subtract ? ra + rb : ra - rb].filter((x) => x > 0 && x !== value),
        solution: t(
          `$${fmt(a)} \\approx ${fmt(ra)}$ and $${fmt(b)} \\approx ${fmt(rb)}$, so the estimate is $${fmt(ra)} ${op} ${fmt(rb)} = ${fmt(value)}$.`,
          `$${fmt(a)} \\approx ${fmt(ra)}$，$${fmt(b)} \\approx ${fmt(rb)}$，所以估算结果为 $${fmt(ra)} ${op} ${fmt(rb)} = ${fmt(value)}$。`,
        ),
      });
    },
  };
}

/** estimatingMultiDigitAddition estimates sums by rounding first. */
export const estimatingMultiDigitAddition: TopicDef = {
  id: "estimating-multi-digit-addition",
  title: t("Estimating Multi-Digit Addition", "多位数加法的估算"),
  summary: t(
    "To estimate a sum, round each number first and add the rounded numbers: 4,612 + 2,391 ≈ 5,000 + 2,000 = 7,000. Estimates check whether an exact answer is reasonable.",
    "估算和时，先把每个数四舍五入，再把近似数相加：4,612 + 2,391 ≈ 5,000 + 2,000 = 7,000。估算可以检验精确答案是否合理。",
  ),
  prerequisites: ["adding-numbers-up-to-five-digits", "rounding-up-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [estimatingKP("estimating-sums-to-hundreds", 2, false), estimatingKP("estimating-sums-to-thousands", 3, false)],
};

/** subtractionTopic builds a subtraction topic: compute the difference, then solve a word problem. */
function subtractionTopic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  lens: (rng: Rng) => [number, number],
  example: [string, string],
): TopicDef {
  const pair = (rng: Rng): [number, number] => {
    for (;;) {
      const [la, lb] = lens(rng);
      const a = randomWithDigits(rng, la);
      const b = randomWithDigits(rng, lb);
      if (a > b && smallerFromLarger(a, b) !== a - b) return [a, b];
    }
  };
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss("4.NBT.B.4"),
    knowledgePoints: [
      {
        id: `${id}-computing`,
        title: t("Finding the difference", "求差"),
        explanation: t(
          `Line up the digits by place and subtract from the right; when a digit on top is too small, borrow from the next place: ${example[0]}`,
          `把数位对齐，从右往左相减；被减数某一位不够减时，向前一位借一：${example[1]}`,
        ),
        generate(rng) {
          const [a, b] = pair(rng);
          return numberProblem({
            prompt: t(`Find $${fmt(a)} - ${fmt(b)}$.`, `计算 $${fmt(a)} - ${fmt(b)}$。`),
            answer: a - b,
            form: "integer",
            wrong: [smallerFromLarger(a, b), a - b + 10, a - b - 10, a + b],
            solution: t(
              `Subtracting column by column with borrowing: $${fmt(a)} - ${fmt(b)} = ${fmt(a - b)}$. Check: $${fmt(a - b)} + ${fmt(b)} = ${fmt(a)}$.`,
              `逐列相减并借位：$${fmt(a)} - ${fmt(b)} = ${fmt(a - b)}$。验算：$${fmt(a - b)} + ${fmt(b)} = ${fmt(a)}$。`,
            ),
          });
        },
      },
      {
        id: `${id}-word-problems`,
        title: t("Word problems", "应用题"),
        explanation: t(
          '"How many are left", "how many more" and "how much farther" ask for a difference.',
          '"还剩多少""多多少""还要走多远"求的都是差。',
        ),
        generate(rng) {
          const [a, b] = pair(rng);
          const kind = rng.int(0, 2);
          const prompts: Text[] = [
            t(
              `A library has ${plain(a)} books and lends out ${plain(b)} of them. How many books are still in the library?`,
              `图书馆有 ${plain(a)} 本书，借出了 ${plain(b)} 本。馆里还有多少本书？`,
            ),
            t(
              `A stadium has ${plain(a)} seats. ${plain(b)} people are already seated. How many seats are empty?`,
              `体育场有 ${plain(a)} 个座位，已经坐了 ${plain(b)} 人。还有多少个空座位？`,
            ),
            t(
              `A mountain is ${plain(a)} feet tall and a hill is ${plain(b)} feet tall. How many feet taller is the mountain?`,
              `一座山高 ${plain(a)} 英尺，一座小山高 ${plain(b)} 英尺。大山比小山高多少英尺？`,
            ),
          ];
          return numberProblem({
            prompt: prompts[kind]!,
            answer: a - b,
            form: "integer",
            wrong: [smallerFromLarger(a, b), a + b, a - b + 10],
            solution: t(`$${fmt(a)} - ${fmt(b)} = ${fmt(a - b)}$.`, `$${fmt(a)} - ${fmt(b)} = ${fmt(a - b)}$。`),
          });
        },
      },
    ],
  };
}

export const subtractingTwoDigitNumbers = subtractionTopic(
  "subtracting-two-digit-numbers",
  t("Subtracting Two-Digit Numbers", "两位数减法"),
  t(
    "When the ones digit on top is smaller, borrow a ten: 72 − 38: 12 − 8 = 4 and 6 − 3 = 3, so 34.",
    "被减数个位不够减时，从十位借一：72 − 38：12 − 8 = 4，6 − 3 = 3，所以是 34。",
  ),
  ["adding-two-digit-whole-numbers"],
  () => [2, 2],
  [
    "$72 - 38$: $2 < 8$, so borrow: $12 - 8 = 4$, $6 - 3 = 3$. So $34$.",
    "$72 - 38$：$2 < 8$，借一：$12 - 8 = 4$，$6 - 3 = 3$。所以是 $34$。",
  ],
);

export const subtractingTwoDigitNumbersFromThreeDigitNumbers = subtractionTopic(
  "subtracting-two-digit-numbers-from-three-digit-numbers",
  t("Subtracting Two-Digit Numbers From Three-Digit Numbers", "三位数减两位数"),
  t(
    "Line up the ones under the ones. Borrowing may reach the hundreds: 405 − 68 = 337.",
    "个位对齐个位。借位可能要从百位借：405 − 68 = 337。",
  ),
  ["subtracting-two-digit-numbers", "equivalent-place-value-representations-and-borrowing"],
  () => [3, 2],
  [
    "$405 - 68$: borrow across the zero, $405 = 3$ hundreds $+ 9$ tens $+ 15$ ones; then $15 - 8 = 7$, $9 - 6 = 3$, $3$. So $337$.",
    "$405 - 68$：隔着 0 借位，$405 = 3$ 个百 $+ 9$ 个十 $+ 15$ 个一；$15 - 8 = 7$，$9 - 6 = 3$，百位 $3$。所以是 $337$。",
  ],
);

export const subtractingThreeDigitNumbers = subtractionTopic(
  "subtracting-three-digit-numbers",
  t("Subtracting Three-Digit Numbers", "三位数减法"),
  t(
    "Subtract three-digit numbers column by column, borrowing where needed: 724 − 386 = 338.",
    "三位数相减，逐列计算，需要时借位：724 − 386 = 338。",
  ),
  ["subtracting-two-digit-numbers-from-three-digit-numbers"],
  () => [3, 3],
  [
    "$724 - 386$: $14 - 6 = 8$; $11 - 8 = 3$; $6 - 3 = 3$. So $338$.",
    "$724 - 386$：$14 - 6 = 8$；$11 - 8 = 3$；$6 - 3 = 3$。所以是 $338$。",
  ],
);

export const subtractingNumbersUpToFiveDigits = subtractionTopic(
  "subtracting-numbers-up-to-five-digits",
  t("Subtracting Numbers Up to Five Digits", "五位数以内的减法"),
  t(
    "Numbers of four and five digits are subtracted the same way: 50,312 − 7,648 = 42,664.",
    "四位数和五位数也同样相减：50,312 − 7,648 = 42,664。",
  ),
  ["subtracting-three-digit-numbers"],
  (rng) => [rng.int(4, 5), rng.int(3, 5)],
  [
    "$50{,}312 - 7{,}648 = 42{,}664$. Check: $42{,}664 + 7{,}648 = 50{,}312$.",
    "$50{,}312 - 7{,}648 = 42{,}664$。验算：$42{,}664 + 7{,}648 = 50{,}312$。",
  ],
);

export const subtractingNumbersUpToSevenDigits = subtractionTopic(
  "subtracting-numbers-up-to-seven-digits",
  t("Subtracting Numbers Up to Seven Digits", "七位数以内的减法"),
  t(
    "Numbers in the millions are subtracted the same way: 3,005,120 − 1,467,385 = 1,537,735.",
    "百万级的数也同样相减：3,005,120 − 1,467,385 = 1,537,735。",
  ),
  ["subtracting-numbers-up-to-five-digits"],
  (rng) => [rng.int(6, 7), rng.int(5, 7)],
  ["$3{,}005{,}120 - 1{,}467{,}385 = 1{,}537{,}735$.", "$3{,}005{,}120 - 1{,}467{,}385 = 1{,}537{,}735$。"],
);

/** estimatingMultiDigitSubtraction estimates differences by rounding first. */
export const estimatingMultiDigitSubtraction: TopicDef = {
  id: "estimating-multi-digit-subtraction",
  title: t("Estimating Multi-Digit Subtraction", "多位数减法的估算"),
  summary: t(
    "To estimate a difference, round each number first and subtract the rounded numbers: 7,812 − 2,456 ≈ 8,000 − 2,000 = 6,000.",
    "估算差时，先把每个数四舍五入，再把近似数相减：7,812 − 2,456 ≈ 8,000 − 2,000 = 6,000。",
  ),
  prerequisites: ["subtracting-numbers-up-to-five-digits", "estimating-multi-digit-addition"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    estimatingKP("estimating-differences-to-hundreds", 2, true),
    estimatingKP("estimating-differences-to-thousands", 3, true),
  ],
};

/** grade4WholeNumberTopics are the 4th Grade Math topics on expressions, patterns, place value, rounding, addition and subtraction. */
export const grade4WholeNumberTopics: readonly TopicDef[] = [
  placeValueWithNumbersUpToFourDigits,
  placeValueWithNumbersUpToSevenDigits,
  writingWholeNumbersInWords,
  readingWholeNumbersWrittenInWords,
  convertingFromStandardFormToExpandedForm,
  convertingFromExpandedFormToStandardForm,
  equivalentPlaceValueRepresentations,
  moreOnEquivalentPlaceValueRepresentations,
  equivalentPlaceValueRepresentationsAndBorrowing,
  comparingPlaceValues,
  comparingWholeNumbers,
  comparingWholeNumbersUsingPlaceValue,
  roundingDownWholeNumbers,
  roundingUpWholeNumbers,
  roundingUpTheDigit9,
  addingTwoDigitWholeNumbers,
  addingThreeDigitAndTwoDigitNumbers,
  addingThreeDigitNumbers,
  addingNumbersUpToFiveDigits,
  addingNumbersUpToSevenDigits,
  addingThreeMultiDigitNumbers,
  estimatingMultiDigitAddition,
  subtractingTwoDigitNumbers,
  subtractingTwoDigitNumbersFromThreeDigitNumbers,
  subtractingThreeDigitNumbers,
  subtractingNumbersUpToFiveDigits,
  subtractingNumbersUpToSevenDigits,
  estimatingMultiDigitSubtraction,
  evaluatingExpressionsInvolvingAdditionAndMultiplication,
  evaluatingExpressionsContainingMultiplicationAndDivision,
  solvingMultistepWordProblemsUsingNumberOperations,
  furtherSolvingMultistepWordProblemsUsingTheFourOperations,
  interpretingMultiplicationEquationsAsAComparison,
  representingComparisonStatementsAsEquations,
  wordProblemsInvolvingAdditiveAndMultiplicativeComparison,
  generatingPatterns,
  identifyingPatterns,
];
