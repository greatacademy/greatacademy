import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { explainedChoice, numberProblem, why, yesNo } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { isPrimeNumber, range } from "./methods-of-proof-common.ts";
import { inverseMod, modPow } from "./methods-of-proof-congruence.ts";
import { factorize, gcd } from "./methods-of-proof-number-theory.ts";

// Discrete Mathematics unit 2: number bases, Fermat's and Euler's theorems, and cryptography.

/** DIGITS are the digit symbols of bases up to 36. */
const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** toBase writes a non-negative integer in base b. */
export const toBase = (n: number, b: number) => n.toString(b).toUpperCase();

/** numTex writes a numeral with its base as a subscript: "\mathrm{1011}_{2}". */
export const numTex = (s: string, b: number) => `\\mathrm{${s}}_{${b}}`;

/** baseOpt writes the numeral of n in base b as an option. */
const baseOpt = (n: number, b: number) => t(`$${numTex(toBase(n, b), b)}$`, `$${numTex(toBase(n, b), b)}$`);

/** powTex writes a power, leaving out an exponent of one: "2^{7}", "16". */
const powTex = (base: number, e: number) => (e === 1 ? `${base}` : `${base}^{${e}}`);

/** placeTerm writes the digit d in the place worth bᵏ: "2^{7}", "3 \cdot 16^{2}", "5". */
const placeTerm = (d: number, b: number, k: number) => {
  if (k === 0) return `${d}`;
  return d === 1 ? powTex(b, k) : `${d} \\cdot ${powTex(b, k)}`;
};

/** valueChain writes the value of a numeral as a chain, leaving out zero digits: "2^{7} + 2 = 128 + 2 = 130". */
const valueChain = (s: string, b: number) => {
  const terms = s
    .split("")
    .map((c, i) => [DIGITS.indexOf(c), s.length - 1 - i] as const)
    .filter(([d]) => d !== 0);
  const sides = [
    terms.map(([d, k]) => placeTerm(d, b, k)).join(" + "),
    terms.map(([d, k]) => d * b ** k).join(" + "),
    `${Number.parseInt(s, b)}`,
  ];
  return sides.filter((x, i) => x !== sides[i - 1]).join(" = ");
};

/** divisionSteps lists repeated division by b, giving the digits from last to first. */
const divisionSteps = (n: number, b: number) => {
  const out: string[] = [];
  for (let m = n; m > 0; m = Math.floor(m / b)) out.push(`${m} = ${b} \\cdot ${Math.floor(m / b)} + ${m % b}`);
  return out.map((s) => `$${s}$`).join(", ");
};

/** Slip is a wrong value with what is wrong with it. */
interface Slip {
  readonly value: number;
  readonly why: Text;
}

/** Wrong is a wrong option with what is wrong with it. */
interface Wrong {
  readonly option: Text;
  readonly why: Text;
}

/** slip pairs a wrong value with what is wrong with it. */
const slip = (value: number, en: string, zh: string): Slip => ({ value, why: t(en, zh) });

/** asOptions writes slips as numerals in base b. */
const asOptions = (slips: readonly Slip[], b: number): Wrong[] => slips.map((s) => ({ option: baseOpt(s.value, b), why: s.why }));

/** firstThree keeps the first three wrong options that differ from the right one and from each other, as oneOf showed them. */
function firstThree(right: Text, wrong: readonly Wrong[]): Wrong[] {
  const seen = new Set([right.en]);
  const kept: Wrong[] = [];
  for (const w of wrong) {
    if (seen.has(w.option.en)) continue;
    seen.add(w.option.en);
    kept.push(w);
  }
  return kept.slice(0, 3);
}

/** distinct drops the mistakes that give the answer or repeat an earlier value. */
const distinct = <M extends { readonly value: unknown }>(answer: unknown, ms: readonly M[]) =>
  ms.filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i);

/** nearby lists plausible wrong values near n with what each gets wrong: a place off by one digit, an off-by-one, reversed digits. */
const nearby = (rng: Rng, n: number, b: number): Slip[] => {
  const s = toBase(n, b);
  const place = b ** rng.int(0, s.length - 1);
  const reversed = Number.parseInt(s.split("").reverse().join(""), b);
  const low = b ** rng.int(0, s.length - 1);
  return [
    slip(
      n + place,
      `This is $${place}$ too much, as if the digit in the place worth $${place}$ were one larger.`,
      `这个数多了 $${place}$，相当于位值为 $${place}$ 的那一位大了一。`,
    ),
    slip(
      Math.abs(n - place),
      `This is $${place}$ too little, as if the digit in the place worth $${place}$ were one smaller.`,
      `这个数少了 $${place}$，相当于位值为 $${place}$ 的那一位小了一。`,
    ),
    slip(n + 1, "This is $1$ too much, as if the units digit were one larger.", "这个数多了 $1$，相当于个位大了一。"),
    slip(n - 1, "This is $1$ too little, as if the units digit were one smaller.", "这个数少了 $1$，相当于个位小了一。"),
    slip(
      reversed,
      "This has the digits in reverse order, as if the last digit were the leading one.",
      "这把各位的顺序弄反了，好像最后一位是最高位。",
    ),
    slip(
      n + low * (b - 1),
      `This is $${b * low} - ${low} = ${low * (b - 1)}$ too much, as if a $1$ in the place worth $${low}$ had moved one place to the left.`,
      `这个数多了 $${b * low} - ${low} = ${low * (b - 1)}$，相当于把位值为 $${low}$ 的一个 $1$ 左移了一位。`,
    ),
  ].filter((w) => w.value > 0 && w.value !== n);
};

/** fracBase writes a fraction num / bᵏ as a numeral in base b with k places: "101.011". */
const fracBase = (num: number, b: number, k: number) => {
  const whole = Math.floor(num / b ** k);
  const frac = (num % b ** k).toString(b).toUpperCase().padStart(k, "0");
  return `${toBase(whole, b)}.${frac}`;
};

/** ones counts the 1 bits of a non-negative integer. */
const ones = (n: number) => toBase(n, 2).split("0").join("").length;

/** binaryIntegers converts between binary and decimal. */
export const binaryIntegers: TopicDef = {
  id: "binary-integers",
  title: t("Binary Integers", "二进制整数"),
  summary: t(
    "In binary (base 2) each digit is a bit, 0 or 1, and the places are worth 1, 2, 4, 8, …; repeated division by 2 converts a decimal integer to binary.",
    "二进制（以 2 为基数）中每一位是一个比特 0 或 1，各位的位值依次为 1、2、4、8、…；不断除以 2 即可把十进制整数化为二进制。",
  ),
  intro: t(
    "The binary numeral $\\mathrm{100101100}_{2}$ has $1$ bits in the places worth $256$, $32$, $8$ and $4$, so it stands for $256 + 32 + 8 + 4 = 300$.\n\nCheck: dividing $300$ by $2$ again and again leaves the remainders $0, 0, 1, 1, 0, 1, 0, 0, 1$, and read from the last to the first they spell $100101100$ again.\n\nIn this lesson we convert integers from binary to decimal and back, and count the binary integers with a given number of digits and ones.",
    "二进制数 $\\mathrm{100101100}_{2}$ 在位值为 $256$、$32$、$8$、$4$ 的位上是 $1$，所以它表示 $256 + 32 + 8 + 4 = 300$。\n\n检验：把 $300$ 不断除以 $2$，余数依次为 $0, 0, 1, 1, 0, 1, 0, 0, 1$，从最后一个读到第一个，又得到 $100101100$。\n\n本课我们把整数从二进制化为十进制、再化回来，并统计给定位数和 1 的个数的二进制整数。",
  ),
  prerequisites: ["powers-of-integers", "division-with-remainders"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "binary-to-decimal",
      title: t("Binary to decimal", "二进制化为十进制"),
      explanation: t(
        "Each binary digit is worth a power of two, doubling from right to left, so the value is the sum of the powers where the digit is one. In $\\mathrm{110000011}_{2}$ the $1$ bits sit in the places worth $256$, $128$, $2$ and $1$, so it is $256 + 128 + 2 + 1 = 387$.\n\n> **Watch out.** The rightmost place is worth $1 = 2^0$, not $2$: count the places from zero at the right, and skip the places that hold $0$.",
        "每个二进制位代表一个 2 的幂，从右向左依次加倍，所以数值是所有为 1 的位对应的幂之和。$\\mathrm{110000011}_{2}$ 中为 $1$ 的位的位值是 $256$、$128$、$2$、$1$，所以它等于 $256 + 128 + 2 + 1 = 387$。\n\n> **注意。** 最右边一位的位值是 $1 = 2^0$，不是 $2$：位要从右边的第零位数起，值为 $0$ 的位跳过。",
      ),
      generate(rng) {
        const n = rng.int(9, 255);
        const s = toBase(n, 2);
        const places = s
          .split("")
          .map((d, i) => (d === "1" ? 2 ** (s.length - 1 - i) : 0))
          .filter((v) => v > 0);
        return numberProblem({
          prompt: t(`Write $${numTex(s, 2)}$ in decimal.`, `把 $${numTex(s, 2)}$ 写成十进制数。`),
          answer: n,
          mistakes: distinct(n, nearby(rng, n, 2)),
          solution: walked(
            [
              [
                ["Find the places of the ones", "找出 1 所在的位"],
                t(
                  `The $1$ bits of $${numTex(s, 2)}$ sit in the places worth ${places.map((v) => `$${v}$`).join(", ")}.`,
                  `$${numTex(s, 2)}$ 中为 $1$ 的位的位值是 ${places.map((v) => `$${v}$`).join("、")}。`,
                ),
              ],
              [
                ["Add the place values", "把位值相加"],
                t(`$${numTex(s, 2)} = ${valueChain(s, 2)}$.`, `$${numTex(s, 2)} = ${valueChain(s, 2)}$。`),
              ],
            ],
            t(
              `The numeral has $${s.length}$ digits and $${2 ** (s.length - 1)} \\le ${n} < ${2 ** s.length}$; and $${n}$ is ${n % 2 ? "odd" : "even"}, matching the last digit $${n % 2}$.`,
              `这个数有 $${s.length}$ 位，且 $${2 ** (s.length - 1)} \\le ${n} < ${2 ** s.length}$；$${n}$ 是${n % 2 ? "奇数" : "偶数"}，与末位 $${n % 2}$ 相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "decimal-to-binary",
      title: t("Decimal to binary", "十进制化为二进制"),
      explanation: t(
        "Repeated division by two peels off the binary digits from the right, so the remainders read from last to first give the number. For $230$: $230 = 2 \\cdot 115 + 0$, $115 = 2 \\cdot 57 + 1$, $57 = 2 \\cdot 28 + 1$, $28 = 2 \\cdot 14 + 0$, $14 = 2 \\cdot 7 + 0$, $7 = 2 \\cdot 3 + 1$, $3 = 2 \\cdot 1 + 1$, $1 = 2 \\cdot 0 + 1$. Read upward, $230 = \\mathrm{11100110}_{2}$.\n\n> **Watch out.** The first remainder is the last digit, not the first: read the remainders from the bottom up.",
        "反复除以 2 会从右边依次剥出二进制位，所以把余数从最后一个读到第一个就得到这个数。对 $230$：$230 = 2 \\cdot 115 + 0$，$115 = 2 \\cdot 57 + 1$，$57 = 2 \\cdot 28 + 1$，$28 = 2 \\cdot 14 + 0$，$14 = 2 \\cdot 7 + 0$，$7 = 2 \\cdot 3 + 1$，$3 = 2 \\cdot 1 + 1$，$1 = 2 \\cdot 0 + 1$。从下往上读，$230 = \\mathrm{11100110}_{2}$。\n\n> **注意。** 第一个余数是最后一位，而不是第一位：余数要从下往上读。",
      ),
      generate(rng) {
        const n = rng.int(9, 200);
        const s = toBase(n, 2);
        const right = baseOpt(n, 2);
        return explainedChoice(rng, {
          prompt: t(`Write $${n}$ in binary.`, `把 $${n}$ 写成二进制数。`),
          correct: right,
          wrong: firstThree(right, asOptions(nearby(rng, n, 2), 2)),
          solution: walked(
            [
              [["Divide by 2 repeatedly", "不断除以 2"], t(`${divisionSteps(n, 2)}.`, `${divisionSteps(n, 2)}。`)],
              [["Read the remainders upward", "从下往上读余数"], t(`$${n} = ${numTex(s, 2)}$.`, `$${n} = ${numTex(s, 2)}$。`)],
            ],
            t(`$${numTex(s, 2)} = ${valueChain(s, 2)}$.`, `$${numTex(s, 2)} = ${valueChain(s, 2)}$。`),
          ),
        });
      },
    },
  ],
};

/** addingAndSubtractingBinaryIntegers adds and subtracts in base 2. */
export const addingAndSubtractingBinaryIntegers: TopicDef = {
  id: "adding-and-subtracting-binary-integers",
  title: t("Adding and Subtracting Binary Integers", "二进制整数的加减法"),
  summary: t(
    "Binary addition works column by column like decimal addition, with 1 + 1 = 10₂ carrying 1; subtraction borrows 2 from the next place.",
    "二进制加法与十进制一样逐列进行，1 + 1 = 10₂ 时向前进 1；减法向前一位借 2。",
  ),
  intro: t(
    "To add $\\mathrm{11001000}_{2} + \\mathrm{1011010}_{2}$, work from the right, writing $0$ and carrying $1$ whenever a column reaches $2$. The sum is $\\mathrm{100100010}_{2}$, which is $200 + 90 = 290$.\n\nCheck: subtracting back, $\\mathrm{100100010}_{2} - \\mathrm{1011010}_{2} = \\mathrm{11001000}_{2}$, which is $290 - 90 = 200$.\n\nIn this lesson we add and subtract binary integers column by column, with carries and borrows, and read negative integers written in two's complement.",
    "计算 $\\mathrm{11001000}_{2} + \\mathrm{1011010}_{2}$ 时从右往左做，某列达到 $2$ 就写 $0$ 并进 $1$。和是 $\\mathrm{100100010}_{2}$，即 $200 + 90 = 290$。\n\n检验：减回去，$\\mathrm{100100010}_{2} - \\mathrm{1011010}_{2} = \\mathrm{11001000}_{2}$，即 $290 - 90 = 200$。\n\n本课我们逐列进位、借位来做二进制整数的加减法，并读出用补码表示的负整数。",
  ),
  prerequisites: ["binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "adding-binary-integers",
      title: t("Adding binary integers", "二进制整数加法"),
      explanation: t(
        "Binary addition works column by column like decimal addition, except that two ones make ten, so you write zero and carry one. For $\\mathrm{1011}_{2} + \\mathrm{11}_{2}$, from the right: $1 + 1 = \\mathrm{10}_{2}$, write $0$ carry $1$; $1 + 1 + 1 = \\mathrm{11}_{2}$, write $1$ carry $1$; $0 + 1 = 1$; then $1$. The sum is $\\mathrm{1110}_{2}$, that is, $11 + 3 = 14$.\n\n> **Watch out.** A column with two $1$s and a carry holds $1 + 1 + 1 = \\mathrm{11}_{2}$: write $1$ and carry $1$, not $0$.",
        "二进制加法像十进制加法一样逐列进行，只是两个 1 相加得到 10，所以写 0 并进 1。计算 $\\mathrm{1011}_{2} + \\mathrm{11}_{2}$，从右往左：$1 + 1 = \\mathrm{10}_{2}$，写 $0$ 进 $1$；$1 + 1 + 1 = \\mathrm{11}_{2}$，写 $1$ 进 $1$；$0 + 1 = 1$；最后是 $1$。和为 $\\mathrm{1110}_{2}$，即 $11 + 3 = 14$。\n\n> **注意。** 一列里有两个 $1$ 再加进位时是 $1 + 1 + 1 = \\mathrm{11}_{2}$：写 $1$ 进 $1$，而不是写 $0$。",
      ),
      generate(rng) {
        const a = rng.int(5, 127);
        const b = rng.int(5, 127);
        const sum = a + b;
        const right = baseOpt(sum, 2);
        const carries = ones(a) + ones(b) - ones(sum);
        const slips = [
          slip(
            a ^ b,
            "This adds each column but drops the carries, which gives the XOR of the two numbers.",
            "这是各列相加却丢掉了进位，得到的是两数的异或。",
          ),
          slip(
            a | b,
            "This writes $1$ in every column that has a $1$ and ignores the carries, which gives the OR of the two numbers.",
            "这是凡有 $1$ 的列都写 $1$ 而忽略进位，得到的是两数的或。",
          ),
          ...nearby(rng, sum, 2),
        ].filter((w) => w.value !== sum);
        return explainedChoice(rng, {
          prompt: t(
            `Find $${numTex(toBase(a, 2), 2)} + ${numTex(toBase(b, 2), 2)}$.`,
            `求 $${numTex(toBase(a, 2), 2)} + ${numTex(toBase(b, 2), 2)}$。`,
          ),
          correct: right,
          wrong: firstThree(right, asOptions(slips, 2)),
          solution: walked(
            [
              [
                ["Add column by column", "逐列相加"],
                t(
                  `From the right, a column that reaches $2$ gives $0$ carry $1$, and one that reaches $3$ gives $1$ carry $1$; this gives $${numTex(toBase(sum, 2), 2)}$.`,
                  `从右往左，某列达到 $2$ 就写 $0$ 进 $1$，达到 $3$ 就写 $1$ 进 $1$；得到 $${numTex(toBase(sum, 2), 2)}$。`,
                ),
              ],
              [
                ["Count the carries", "数进位"],
                carries === 0
                  ? t("No column produces a carry.", "没有一列产生进位。")
                  : t(
                      `$${carries}$ ${carries === 1 ? "column produces a carry" : "columns produce a carry"}: the sum has $${ones(a)} + ${ones(b)} - ${carries} = ${ones(sum)}$ ones, since each carry turns two ones into one.`,
                      `有 $${carries}$ 列产生进位：和中有 $${ones(a)} + ${ones(b)} - ${carries} = ${ones(sum)}$ 个 $1$，因为每次进位都把两个 $1$ 变成一个。`,
                    ),
              ],
            ],
            t(
              `In decimal $${a} + ${b} = ${sum}$, and $${valueChain(toBase(sum, 2), 2)}$.`,
              `十进制下 $${a} + ${b} = ${sum}$，而 $${valueChain(toBase(sum, 2), 2)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "subtracting-binary-integers",
      title: t("Subtracting binary integers", "二进制整数减法"),
      explanation: t(
        "Binary subtraction works column by column; when the top digit is smaller, borrow from the next place, where a $1$ is worth $2$ in this column. In $\\mathrm{10000}_{2} - \\mathrm{1}_{2}$ the borrow has to travel: the leading $1$ lends to the place on its right, each $0$ on the way becomes $\\mathrm{10}_{2} = 2$ and passes $1$ on, and the result is $\\mathrm{1111}_{2}$, that is, $16 - 1 = 15$.\n\n> **Watch out.** A borrowed $1$ is worth $2$ in the column it lands in, not $10$; and every $0$ it passes through ends up as $1$.",
        "二进制减法逐列进行；上面的数字较小时向前一位借位，前一位的 $1$ 在本列值 $2$。在 $\\mathrm{10000}_{2} - \\mathrm{1}_{2}$ 中借位要一路传下去：最高位的 $1$ 借给右边一位，途经的每个 $0$ 变成 $\\mathrm{10}_{2} = 2$ 再借出 $1$，结果是 $\\mathrm{1111}_{2}$，即 $16 - 1 = 15$。\n\n> **注意。** 借来的 $1$ 在它落到的那一列值 $2$，不是 $10$；它途经的每个 $0$ 最后都变成 $1$。",
      ),
      generate(rng) {
        const b = rng.int(3, 100);
        const a = rng.int(b + 2, 160);
        const diff = a - b;
        const right = baseOpt(diff, 2);
        const borrows = ones(b) + ones(diff) - ones(a);
        const slips = [
          slip(
            a ^ b,
            "This subtracts each column but never borrows, which gives the XOR of the two numbers.",
            "这是各列相减却从不借位，得到的是两数的异或。",
          ),
          ...nearby(rng, diff, 2),
        ].filter((w) => w.value !== diff && w.value > 0);
        return explainedChoice(rng, {
          prompt: t(
            `Find $${numTex(toBase(a, 2), 2)} - ${numTex(toBase(b, 2), 2)}$.`,
            `求 $${numTex(toBase(a, 2), 2)} - ${numTex(toBase(b, 2), 2)}$。`,
          ),
          correct: right,
          wrong: firstThree(right, asOptions(slips, 2)),
          solution: walked(
            [
              [
                ["Subtract column by column", "逐列相减"],
                t(
                  `From the right, borrow $2$ from the next place whenever the top digit is smaller; this gives $${numTex(toBase(diff, 2), 2)}$.`,
                  `从右往左，上面的数字较小时就向前一位借 $2$；得到 $${numTex(toBase(diff, 2), 2)}$。`,
                ),
              ],
              [
                ["Count the borrows", "数借位"],
                borrows === 0
                  ? t("No column needs a borrow.", "没有一列需要借位。")
                  : t(
                      `$${borrows}$ ${borrows === 1 ? "column needs a borrow" : "columns need a borrow"}, as many as the carries when the difference is added back.`,
                      `有 $${borrows}$ 列需要借位，与把差加回去时的进位次数一样多。`,
                    ),
              ],
            ],
            t(
              `Adding back, $${b} + ${diff} = ${a}$, so $${numTex(toBase(b, 2), 2)} + ${numTex(toBase(diff, 2), 2)} = ${numTex(toBase(a, 2), 2)}$.`,
              `加回去，$${b} + ${diff} = ${a}$，所以 $${numTex(toBase(b, 2), 2)} + ${numTex(toBase(diff, 2), 2)} = ${numTex(toBase(a, 2), 2)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** multiplyingAndDividingBinaryIntegers multiplies by shifting and adding, and divides by long division. */
export const multiplyingAndDividingBinaryIntegers: TopicDef = {
  id: "multiplying-and-dividing-binary-integers",
  title: t("Multiplying and Dividing Binary Integers", "二进制整数的乘除法"),
  summary: t(
    "Multiplying by 10₂ shifts the bits left; a binary product is a sum of shifted copies, one for each 1 bit of the multiplier. Long division in binary only ever asks whether the divisor fits once.",
    "乘以 10₂ 就是把各位左移一位；二进制乘积是若干左移副本之和，乘数的每个 1 位对应一个副本。二进制长除法每一步只需判断除数能否减一次。",
  ),
  intro: t(
    "To multiply $\\mathrm{1101}_{2}$ by $\\mathrm{100101}_{2}$, add a copy of $\\mathrm{1101}_{2}$ for each $1$ bit of the multiplier, shifted left by $5$, $2$ and $0$ places: $\\mathrm{110100000}_{2} + \\mathrm{110100}_{2} + \\mathrm{1101}_{2} = \\mathrm{111100001}_{2}$.\n\nCheck: in decimal the copies are $416 + 52 + 13 = 481$, and indeed $13 \\times 37 = 481$.\n\nIn this lesson we multiply binary integers by shifting and adding, and divide them by long division and by shifting to the right.",
    "计算 $\\mathrm{1101}_{2}$ 乘以 $\\mathrm{100101}_{2}$ 时，乘数的每个 $1$ 位对应一个 $\\mathrm{1101}_{2}$ 的副本，分别左移 $5$、$2$、$0$ 位：$\\mathrm{110100000}_{2} + \\mathrm{110100}_{2} + \\mathrm{1101}_{2} = \\mathrm{111100001}_{2}$。\n\n检验：十进制下这些副本是 $416 + 52 + 13 = 481$，确实 $13 \\times 37 = 481$。\n\n本课我们用移位相加做二进制整数乘法，用长除法和右移做除法。",
  ),
  prerequisites: ["adding-and-subtracting-binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "multiplying-binary-integers",
      title: t("Multiplying binary integers", "二进制整数乘法"),
      explanation: t(
        "Multiplying by a binary number means adding shifted copies of the other number, one copy for each digit that is one. For $\\mathrm{101}_{2} \\times \\mathrm{10001}_{2}$ the multiplier has $1$ bits worth $16$ and $1$, so add $\\mathrm{1010000}_{2}$ (shifted four places) and $\\mathrm{101}_{2}$: $\\mathrm{1010101}_{2} = 85 = 5 \\times 17$.\n\n> **Watch out.** Shift each copy by the place of its $1$ bit, counting from $0$ at the right: the copy for the units bit is not shifted at all.",
        "乘以一个二进制数，就是把另一个数的移位副本相加，每个为 1 的位对应一个副本。计算 $\\mathrm{101}_{2} \\times \\mathrm{10001}_{2}$：乘数的 $1$ 位的位值是 $16$ 和 $1$，所以把 $\\mathrm{1010000}_{2}$（左移四位）与 $\\mathrm{101}_{2}$ 相加：$\\mathrm{1010101}_{2} = 85 = 5 \\times 17$。\n\n> **注意。** 每个副本按它的 $1$ 位所在的位置移位，位置从右边的 $0$ 数起：个位对应的副本根本不移位。",
      ),
      generate(rng) {
        const a = rng.int(5, 31);
        const b = rng.int(3, 15);
        const p = a * b;
        const A = numTex(toBase(a, 2), 2);
        const right = baseOpt(p, 2);
        const shifts = range(0, 3)
          .filter((k) => (b >> k) & 1)
          .reverse();
        const copies = shifts.map((k) => numTex(toBase(a * 2 ** k, 2), 2)).join(" + ");
        const slips = [
          slip(a + b, "This adds the two numbers instead of multiplying them.", "这是把两数相加，而不是相乘。"),
          slip(
            p - a,
            `This is one copy of $${A}$ short, as if the multiplier were one smaller.`,
            `这少了一个 $${A}$ 的副本，相当于乘数小了一。`,
          ),
          slip(
            p + a,
            `This has one copy of $${A}$ too many, as if the multiplier were one larger.`,
            `这多了一个 $${A}$ 的副本，相当于乘数大了一。`,
          ),
          ...nearby(rng, p, 2),
        ].filter((w) => w.value !== p);
        return explainedChoice(rng, {
          prompt: t(`Find $${A} \\times ${numTex(toBase(b, 2), 2)}$.`, `求 $${A} \\times ${numTex(toBase(b, 2), 2)}$。`),
          correct: right,
          wrong: firstThree(right, asOptions(slips, 2)),
          solution: walked(
            [
              [
                ["Find the 1 bits of the multiplier", "找出乘数的 1 位"],
                shifts.length === 1
                  ? t(
                      `$${numTex(toBase(b, 2), 2)}$ has a single $1$ bit, worth $${b}$, so $${A}$ is shifted $${shifts[0]}$ places.`,
                      `$${numTex(toBase(b, 2), 2)}$ 只有一个 $1$ 位，位值为 $${b}$，所以把 $${A}$ 左移 $${shifts[0]}$ 位。`,
                    )
                  : t(
                      `$${numTex(toBase(b, 2), 2)}$ has $1$ bits worth ${shifts.map((k) => `$${2 ** k}$`).join(", ")}, so copies of $${A}$ are shifted left ${shifts
                        .map((k) => `by $${k}$ places`)
                        .join(", ")
                        .replace(/, (?=[^,]*$)/, " and ")}.`,
                      `$${numTex(toBase(b, 2), 2)}$ 的 $1$ 位的位值是 ${shifts.map((k) => `$${2 ** k}$`).join("、")}，所以把 $${A}$ 分别左移 ${shifts.map((k) => `$${k}$`).join("、")} 位。`,
                    ),
              ],
              [
                ["Add the shifted copies", "把移位副本相加"],
                shifts.length === 1
                  ? t(`The product is $${copies}$.`, `乘积是 $${copies}$。`)
                  : t(`$${copies} = ${numTex(toBase(p, 2), 2)}$.`, `$${copies} = ${numTex(toBase(p, 2), 2)}$。`),
              ],
            ],
            t(
              `In decimal $${a} \\times ${b} = ${p}$, and $${valueChain(toBase(p, 2), 2)}$.`,
              `十进制下 $${a} \\times ${b} = ${p}$，而 $${valueChain(toBase(p, 2), 2)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "dividing-binary-integers",
      title: t("Dividing binary integers", "二进制整数除法"),
      explanation: t(
        "Long division in binary is simpler than in decimal: at each step the divisor either fits once or not at all. For $\\mathrm{1011010}_{2} \\div \\mathrm{1111}_{2}$, take bits until the part reaches $\\mathrm{10110}_{2} = 22 \\ge 15$, subtract to leave $\\mathrm{111}_{2}$ and write $1$; bring down $1$, and $\\mathrm{1111}_{2}$ fits exactly, so write $1$; bring down $0$, which is too small, so write $0$. The quotient is $\\mathrm{110}_{2}$, and $90 = 15 \\cdot 6$.\n\n> **Watch out.** After the first subtraction, write a quotient digit for every bit brought down, including a $0$ each time the divisor does not fit.",
        "二进制长除法比十进制简单：每一步除数要么减一次，要么一次也减不了。计算 $\\mathrm{1011010}_{2} \\div \\mathrm{1111}_{2}$：取若干位直到部分达到 $\\mathrm{10110}_{2} = 22 \\ge 15$，减去后剩 $\\mathrm{111}_{2}$，商 $1$；移下 $1$，$\\mathrm{1111}_{2}$ 恰好能减，商 $1$；移下 $0$，不够减，商 $0$。商为 $\\mathrm{110}_{2}$，且 $90 = 15 \\cdot 6$。\n\n> **注意。** 第一次相减之后，每移下一位都要写一位商，除数不够减时也要写 $0$。",
      ),
      generate(rng) {
        const b = rng.int(3, 13);
        const q = rng.int(5, 31);
        const a = b * q;
        const sa = toBase(a, 2);
        const right = baseOpt(q, 2);
        const first = range(1, sa.length).find((L) => Number.parseInt(sa.slice(0, L), 2) >= b) ?? sa.length;
        const slips = [
          slip(
            q * 2,
            "This has an extra $0$ at the end, as if one more bit had been brought down; it is twice the quotient.",
            "这在末尾多了一个 $0$，好像多移下了一位；它是商的两倍。",
          ),
          slip(Math.floor(q / 2), "This drops the last digit of the quotient.", "这丢掉了商的最后一位。"),
          ...nearby(rng, q, 2),
        ].filter((w) => w.value !== q && w.value > 0);
        return explainedChoice(rng, {
          prompt: t(
            `Find $${numTex(sa, 2)} \\div ${numTex(toBase(b, 2), 2)}$.`,
            `求 $${numTex(sa, 2)} \\div ${numTex(toBase(b, 2), 2)}$。`,
          ),
          correct: right,
          wrong: firstThree(right, asOptions(slips, 2)),
          solution: walked(
            [
              [
                ["Find where the divisor first fits", "找出除数第一次够减的位置"],
                t(
                  `The first $${first}$ bits, $${numTex(sa.slice(0, first), 2)} = ${Number.parseInt(sa.slice(0, first), 2)}$, are the first part at least $${b}$, so the quotient has $${sa.length} - ${first} + 1 = ${sa.length - first + 1}$ digits.`,
                  `前 $${first}$ 位 $${numTex(sa.slice(0, first), 2)} = ${Number.parseInt(sa.slice(0, first), 2)}$ 是第一个不小于 $${b}$ 的部分，所以商有 $${sa.length} - ${first} + 1 = ${sa.length - first + 1}$ 位。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `Bringing down the remaining bits one at a time gives the quotient $${numTex(toBase(q, 2), 2)}$ with remainder $0$; in decimal, $${a} \\div ${b} = ${q}$.`,
                  `逐位移下其余各位，得到商 $${numTex(toBase(q, 2), 2)}$，余数为 $0$；十进制下 $${a} \\div ${b} = ${q}$。`,
                ),
              ],
            ],
            t(
              `Multiplying back, $${b} \\times ${q} = ${a}$, and $${valueChain(toBase(q, 2), 2)}$.`,
              `乘回去，$${b} \\times ${q} = ${a}$，而 $${valueChain(toBase(q, 2), 2)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** doublings lists the doublings of the fraction r / 2ᵏ that give its bits: "$0.75 \times 2 = 1.5$, bit $1$". */
const doublings = (r: number, k: number, zh: boolean) => {
  const out: string[] = [];
  let f = r / 2 ** k;
  for (let i = 0; i < k; i++) {
    const g = f * 2;
    const bit = Math.floor(g);
    out.push(`$${f} \\times 2 = ${g}$${zh ? "，位" : ", bit"} $${bit}$`);
    f = g - bit;
  }
  return out.join(zh ? "；" : "; ");
};

/** binaryFractions writes non-integers in binary with places worth 1/2, 1/4, 1/8, …. */
export const binaryFractions: TopicDef = {
  id: "binary-fractions",
  title: t("Binary Fractions", "二进制小数"),
  summary: t(
    "After the binary point the places are worth 1/2, 1/4, 1/8, …; repeatedly doubling the fractional part produces the bits.",
    "二进制小数点后各位的位值依次为 1/2、1/4、1/8、…；不断把小数部分乘以 2 就能得到各位。",
  ),
  intro: t(
    "$\\mathrm{0.01101}_{2}$ has $1$ bits in the places worth $\\frac{1}{4}$, $\\frac{1}{8}$ and $\\frac{1}{32}$, so it is $\\frac{8 + 4 + 1}{32} = \\frac{13}{32} = 0.40625$.\n\nCheck: doubling the fractional part of $0.40625$ five times gives $0.8125$, $1.625$, $1.25$, $0.5$ and $1$, whose whole parts $0, 1, 1, 0, 1$ are the bits again.\n\nIn this lesson we convert binary fractions to decimals and back, and find the length of the repeating block of a binary fraction.",
    "$\\mathrm{0.01101}_{2}$ 在位值为 $\\frac{1}{4}$、$\\frac{1}{8}$、$\\frac{1}{32}$ 的位上是 $1$，所以它等于 $\\frac{8 + 4 + 1}{32} = \\frac{13}{32} = 0.40625$。\n\n检验：把 $0.40625$ 的小数部分连续加倍五次，得到 $0.8125$、$1.625$、$1.25$、$0.5$、$1$，它们的整数部分 $0, 1, 1, 0, 1$ 又是原来的各位。\n\n本课我们把二进制小数化为十进制小数、再化回来，并求二进制循环小数的循环节长度。",
  ),
  prerequisites: ["binary-integers", "fractions-and-decimals"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "binary-fractions-to-decimal",
      title: t("Binary fractions to decimal", "二进制小数化为十进制"),
      explanation: t(
        "Digits after the binary point are worth halves, quarters, eighths and so on, so add those fractions for the digits that are one. $\\mathrm{1.00011}_{2} = 1 + \\frac{1}{16} + \\frac{1}{32} = 1 + \\frac{3}{32} = 1.09375$.\n\n> **Watch out.** The first place after the point is worth $\\frac{1}{2}$, not $\\frac{1}{10}$: a binary fraction is not read like a decimal one.",
        "二进制小数点后的各位分别代表二分之一、四分之一、八分之一等，所以把为 1 的位对应的分数相加。$\\mathrm{1.00011}_{2} = 1 + \\frac{1}{16} + \\frac{1}{32} = 1 + \\frac{3}{32} = 1.09375$。\n\n> **注意。** 小数点后第一位的位值是 $\\frac{1}{2}$，不是 $\\frac{1}{10}$：二进制小数不能像十进制小数那样读。",
      ),
      generate(rng) {
        const k = rng.int(2, 4);
        let num: number;
        do num = rng.int(1, 15 * 2 ** k);
        while (num % 2 === 0);
        const s = fracBase(num, 2, k);
        const value = Q.of(num, 2 ** k);
        const whole = Math.floor(num / 2 ** k);
        return numberProblem({
          prompt: t(`Write $${numTex(s, 2)}$ as a decimal number.`, `把 $${numTex(s, 2)}$ 写成十进制数。`),
          answer: value,
          mistakes: [
            why(
              Q.of(num, 10 ** k),
              `This keeps the numerator $${num}$ but divides by $${10 ** k}$ instead of $${2 ** k}$, as if the places were tenths.`,
              `这保留了分子 $${num}$，却除以 $${10 ** k}$ 而不是 $${2 ** k}$，好像各位是十分位。`,
            ),
            why(
              Q.of(num + 1, 2 ** k),
              `This is $\\frac{1}{${2 ** k}}$ too much, one more in the last place.`,
              `这多了 $\\frac{1}{${2 ** k}}$，即最后一位多了一。`,
            ),
            why(
              Q.of(num, 2 ** (k + 1)),
              `This divides by $2^{${k + 1}}$, counting one place too many after the point; it is half the value.`,
              `这除以 $2^{${k + 1}}$，把小数点后的位数多数了一位；它只有原值的一半。`,
            ),
          ],
          form: "decimal",
          solution: walked(
            [
              [
                ["Write it over a power of two", "写成分母为 2 的幂的分数"],
                t(
                  `There are $${k}$ places after the point, so the numeral is $\\frac{${num}}{2^{${k}}}$, where $${num} = ${numTex(toBase(num, 2), 2)}$ is the digits read without the point.`,
                  `小数点后有 $${k}$ 位，所以这个数是 $\\frac{${num}}{2^{${k}}}$，其中 $${num} = ${numTex(toBase(num, 2), 2)}$ 是去掉小数点后读出的数。`,
                ),
              ],
              [["Divide", "相除"], t(`$\\frac{${num}}{${2 ** k}} = ${dec(value)}$.`, `$\\frac{${num}}{${2 ** k}} = ${dec(value)}$。`)],
            ],
            t(
              `The whole part of $${dec(value)}$ is $${whole}$, which is $${numTex(toBase(whole, 2), 2)}$, the digits before the point; and $${dec(value)} \\times ${2 ** k} = ${num}$.`,
              `$${dec(value)}$ 的整数部分是 $${whole}$，即 $${numTex(toBase(whole, 2), 2)}$，与小数点前的数字一致；且 $${dec(value)} \\times ${2 ** k} = ${num}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "decimal-fractions-to-binary",
      title: t("Decimal fractions to binary", "十进制小数化为二进制"),
      explanation: t(
        "Doubling a fraction moves the binary point one place, so the whole number part after each doubling is the next binary digit. For $0.6875$: $0.6875 \\times 2 = 1.375$ (bit $1$), $0.375 \\times 2 = 0.75$ (bit $0$), $0.75 \\times 2 = 1.5$ (bit $1$), $0.5 \\times 2 = 1$ (bit $1$). So $0.6875 = \\mathrm{0.1011}_{2}$.\n\n> **Watch out.** Keep the bits in the order they appear: the first doubling gives the first bit after the point, the one worth $\\frac{1}{2}$. And double only the fractional part each time.",
        "把小数加倍相当于把二进制小数点移动一位，所以每次加倍后的整数部分就是下一位二进制数字。对 $0.6875$：$0.6875 \\times 2 = 1.375$（位 $1$），$0.375 \\times 2 = 0.75$（位 $0$），$0.75 \\times 2 = 1.5$（位 $1$），$0.5 \\times 2 = 1$（位 $1$）。所以 $0.6875 = \\mathrm{0.1011}_{2}$。\n\n> **注意。** 各位按出现的顺序排列：第一次加倍得到小数点后的第一位，即位值为 $\\frac{1}{2}$ 的那一位。每次只把小数部分加倍。",
      ),
      generate(rng) {
        const k = rng.int(2, 3);
        let num: number;
        do num = rng.int(1, 12 * 2 ** k);
        while (num % 2 === 0);
        const d = num / 2 ** k;
        const decimal = `${d}`;
        const right = fracBase(num, 2, k);
        const opt = (s: string) => t(`$${numTex(s, 2)}$`, `$${numTex(s, 2)}$`);
        const frac = right.split(".")[1]!;
        const whole = right.split(".")[0]!;
        const W = Math.floor(d);
        const r = num % 2 ** k;
        const digits = decimal.split(".")[1] ?? "0";
        const wrongs: Wrong[] = [
          {
            option: opt(`${whole}.${frac.split("").reverse().join("")}`),
            why: t("This writes the bits after the point in reverse order.", "这把小数点后的各位顺序写反了。"),
          },
          {
            option: opt(fracBase(num + 1, 2, k)),
            why: t(`This is $\\frac{1}{${2 ** k}}$ too much.`, `这多了 $\\frac{1}{${2 ** k}}$。`),
          },
          {
            option: opt(fracBase(num - 1, 2, k)),
            why: t(`This is $\\frac{1}{${2 ** k}}$ too little.`, `这少了 $\\frac{1}{${2 ** k}}$。`),
          },
          {
            option: opt(`${toBase(W + 1, 2)}.${frac}`),
            why: t(`This makes the whole part $${W + 1}$ instead of $${W}$.`, `这把整数部分写成了 $${W + 1}$ 而不是 $${W}$。`),
          },
          {
            option: opt(`${whole}.${toBase(Number.parseInt(digits, 10), 2)}`),
            why: t(
              `This converts the decimal digits $${digits}$ after the point as if they were a whole number, but they stand for a fraction.`,
              `这把小数点后的十进制数字 $${digits}$ 当作整数来转换，但它们表示的是一个分数。`,
            ),
          },
        ];
        return explainedChoice(rng, {
          prompt: t(`Write $${decimal}$ in binary.`, `把 $${decimal}$ 写成二进制数。`),
          correct: opt(right),
          wrong: firstThree(opt(right), wrongs),
          solution: walked(
            [
              [
                ["Split off the whole part", "分出整数部分"],
                W === 0
                  ? t(`The whole part is $0$ and the fractional part is $${r / 2 ** k}$.`, `整数部分是 $0$，小数部分是 $${r / 2 ** k}$。`)
                  : t(
                      `$${decimal} = ${W} + ${r / 2 ** k}$, and $${W} = ${numTex(whole, 2)}$.`,
                      `$${decimal} = ${W} + ${r / 2 ** k}$，且 $${W} = ${numTex(whole, 2)}$。`,
                    ),
              ],
              [["Double the fractional part", "把小数部分加倍"], t(`${doublings(r, k, false)}.`, `${doublings(r, k, true)}。`)],
              [
                ["Read the bits in order", "按顺序读出各位"],
                t(`$${decimal} = ${numTex(right, 2)}$.`, `$${decimal} = ${numTex(right, 2)}$。`),
              ],
            ],
            t(
              `$${numTex(right, 2)} = \\frac{${num}}{${2 ** k}}$, since $${numTex(toBase(num, 2), 2)} = ${num}$, and $\\frac{${num}}{${2 ** k}} = ${decimal}$.`,
              `$${numTex(right, 2)} = \\frac{${num}}{${2 ** k}}$，因为 $${numTex(toBase(num, 2), 2)} = ${num}$，而 $\\frac{${num}}{${2 ** k}} = ${decimal}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** letterValues lists the letter digits of a numeral with their values: "$\mathrm{A} = 10$, $\mathrm{F} = 15$". */
const letterValues = (s: string, zh: boolean) =>
  [...new Set(s.split("").filter((c) => /[A-Z]/.test(c)))]
    .sort()
    .map((c) => `$\\mathrm{${c}} = ${DIGITS.indexOf(c)}$`)
    .join(zh ? "，" : ", ");

/** lastDigitCheck checks a numeral's last digit against the remainder on division by its base. */
const lastDigitCheck = (n: number, b: number) => {
  const last = toBase(n % b, b);
  return t(
    `$${n} = ${b} \\cdot ${Math.floor(n / b)} + ${n % b}$, and the remainder $${n % b}$ is the last digit $\\mathrm{${last}}$.`,
    `$${n} = ${b} \\cdot ${Math.floor(n / b)} + ${n % b}$，余数 $${n % b}$ 正是末位 $\\mathrm{${last}}$。`,
  );
};

/** hexadecimalIntegers converts between hexadecimal and decimal. */
export const hexadecimalIntegers: TopicDef = {
  id: "hexadecimal-integers",
  title: t("Hexadecimal Integers", "十六进制整数"),
  summary: t(
    "Hexadecimal (base 16) uses the digits 0–9 and A–F for 10–15; the places are worth 1, 16, 256, ….",
    "十六进制（以 16 为基数）使用数字 0–9 和 A–F（表示 10–15）；各位的位值依次为 1、16、256、…。",
  ),
  intro: t(
    "In $\\mathrm{C0DE}_{16}$ the letters stand for $\\mathrm{C} = 12$, $\\mathrm{D} = 13$ and $\\mathrm{E} = 14$, and the places are worth $4096$, $256$, $16$ and $1$, so it is $12 \\cdot 4096 + 13 \\cdot 16 + 14 = 49374$.\n\nCheck: dividing $49374$ by $16$ again and again leaves the remainders $14, 13, 0, 12$, which read upward spell $\\mathrm{C0DE}$.\n\nIn this lesson we convert integers between hexadecimal and decimal, and count the ones in the binary form of a hexadecimal number.",
    "在 $\\mathrm{C0DE}_{16}$ 中，字母表示 $\\mathrm{C} = 12$、$\\mathrm{D} = 13$、$\\mathrm{E} = 14$，各位的位值是 $4096$、$256$、$16$、$1$，所以它等于 $12 \\cdot 4096 + 13 \\cdot 16 + 14 = 49374$。\n\n检验：把 $49374$ 不断除以 $16$，余数依次为 $14, 13, 0, 12$，从下往上读正是 $\\mathrm{C0DE}$。\n\n本课我们在十六进制与十进制之间转换整数，并数出十六进制数的二进制形式中 1 的个数。",
  ),
  prerequisites: ["binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "hexadecimal-to-decimal",
      title: t("Hexadecimal to decimal", "十六进制化为十进制"),
      explanation: t(
        "Hexadecimal digits are worth powers of sixteen, and the letters from A to F stand for the values ten to fifteen. $\\mathrm{1F4A}_{16} = 4096 + 15 \\cdot 256 + 4 \\cdot 16 + 10 = 4096 + 3840 + 64 + 10 = 8010$.\n\n> **Watch out.** Each place is worth $16$ times the one on its right, so the third place from the right is worth $256$, not $100$; and a letter is a single digit worth $10$ to $15$.",
        "十六进制的各位代表 16 的幂，字母 A 到 F 表示数值 10 到 15。$\\mathrm{1F4A}_{16} = 4096 + 15 \\cdot 256 + 4 \\cdot 16 + 10 = 4096 + 3840 + 64 + 10 = 8010$。\n\n> **注意。** 每一位的位值是右边一位的 $16$ 倍，所以右起第三位的位值是 $256$，不是 $100$；一个字母是一位数字，值为 $10$ 到 $15$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(26, 4000);
        while (!/[A-F]/.test(toBase(n, 16)));
        const s = toBase(n, 16);
        return numberProblem({
          prompt: t(`Write $${numTex(s, 16)}$ in decimal.`, `把 $${numTex(s, 16)}$ 写成十进制数。`),
          answer: n,
          mistakes: distinct(n, [
            slip(
              Number.parseInt(s.replace(/[A-F]/g, "1"), 10),
              "This takes each letter as the digit $1$ and reads the result as a decimal numeral, ignoring the base.",
              "这把每个字母当作数字 $1$，再把结果当作十进制数来读，忽略了基数。",
            ),
            ...nearby(rng, n, 16),
          ]),
          solution: walked(
            [
              [["Replace the letters", "换掉字母"], t(`${letterValues(s, false)}.`, `${letterValues(s, true)}。`)],
              [
                ["Add the place values", "把位值相加"],
                t(`$${numTex(s, 16)} = ${valueChain(s, 16)}$.`, `$${numTex(s, 16)} = ${valueChain(s, 16)}$。`),
              ],
            ],
            lastDigitCheck(n, 16),
          ),
        });
      },
    },
    {
      id: "decimal-to-hexadecimal",
      title: t("Decimal to hexadecimal", "十进制化为十六进制"),
      explanation: t(
        "The same repeated division works with sixteen in place of two, writing remainders from ten to fifteen as letters. Divide by $16$ repeatedly: $7000 = 16 \\cdot 437 + 8$, $437 = 16 \\cdot 27 + 5$, $27 = 16 \\cdot 1 + 11$, $1 = 16 \\cdot 0 + 1$. The remainders $1, 11, 5, 8$ read upward give $7000 = \\mathrm{1B58}_{16}$.\n\n> **Watch out.** A remainder from $10$ to $15$ is one digit, written as a letter: $11$ is $\\mathrm{B}$, not the two digits $1, 1$.",
        "同样的反复除法也适用，只需把 2 换成 16，并把 10 到 15 的余数写成字母。不断除以 $16$：$7000 = 16 \\cdot 437 + 8$，$437 = 16 \\cdot 27 + 5$，$27 = 16 \\cdot 1 + 11$，$1 = 16 \\cdot 0 + 1$。余数 $1, 11, 5, 8$ 从下往上读得 $7000 = \\mathrm{1B58}_{16}$。\n\n> **注意。** $10$ 到 $15$ 的余数是一位数字，要写成字母：$11$ 是 $\\mathrm{B}$，不是两位数字 $1, 1$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(26, 3000);
        while (!/[A-F]/.test(toBase(n, 16)));
        const s = toBase(n, 16);
        const right = baseOpt(n, 16);
        return explainedChoice(rng, {
          prompt: t(`Write $${n}$ in hexadecimal.`, `把 $${n}$ 写成十六进制数。`),
          correct: right,
          wrong: firstThree(right, asOptions(nearby(rng, n, 16), 16)),
          solution: walked(
            [
              [["Divide by 16 repeatedly", "不断除以 16"], t(`${divisionSteps(n, 16)}.`, `${divisionSteps(n, 16)}。`)],
              [
                ["Read the remainders upward", "从下往上读余数"],
                t(
                  `Writing ${letterValues(s, false)}, $${n} = ${numTex(s, 16)}$.`,
                  `把 ${letterValues(s, true)} 写成字母，$${n} = ${numTex(s, 16)}$。`,
                ),
              ],
            ],
            t(`$${numTex(s, 16)} = ${valueChain(s, 16)}$.`, `$${numTex(s, 16)} = ${valueChain(s, 16)}$。`),
          ),
        });
      },
    },
  ],
};

/** nibbles splits a binary numeral into groups of four bits from the right. */
const nibbles = (n: number) => {
  const s = toBase(n, 2);
  const padded = s.padStart(Math.ceil(s.length / 4) * 4, "0");
  return range(0, padded.length / 4 - 1).map((i) => padded.slice(4 * i, 4 * i + 4));
};

/** convertingBetweenBinaryAndHexadecimalIntegers converts four bits at a time. */
export const convertingBetweenBinaryAndHexadecimalIntegers: TopicDef = {
  id: "converting-between-binary-and-hexadecimal-integers",
  title: t("Converting Between Binary and Hexadecimal Integers", "二进制与十六进制整数的互化"),
  summary: t(
    "Since 16 = 2⁴, each hexadecimal digit stands for exactly four bits: group the bits in fours from the right.",
    "因为 16 = 2⁴，每个十六进制数字恰好对应四个比特：从右往左每四位一组。",
  ),
  intro: t(
    "Group $\\mathrm{11101011110111}_{2}$ in fours from the right: $\\mathrm{11}$, $\\mathrm{1010}$, $\\mathrm{1111}$, $\\mathrm{0111}$. These are $3$, $\\mathrm{A}$, $\\mathrm{F}$ and $7$, so the number is $\\mathrm{3AF7}_{16}$.\n\nCheck: writing each hexadecimal digit back as four bits gives $0011\\,1010\\,1111\\,0111$, the same bits with two leading zeros.\n\nIn this lesson we convert between binary and hexadecimal four bits at a time, and count the bits of a hexadecimal integer.",
    "把 $\\mathrm{11101011110111}_{2}$ 从右往左每四位一组：$\\mathrm{11}$、$\\mathrm{1010}$、$\\mathrm{1111}$、$\\mathrm{0111}$。它们是 $3$、$\\mathrm{A}$、$\\mathrm{F}$、$7$，所以这个数是 $\\mathrm{3AF7}_{16}$。\n\n检验：把每个十六进制数字写回四个比特，得到 $0011\\,1010\\,1111\\,0111$，正是原来的各位，只多了两个前导零。\n\n本课我们每次四位地在二进制与十六进制之间转换，并数出十六进制整数的二进制位数。",
  ),
  prerequisites: ["hexadecimal-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "binary-to-hexadecimal",
      title: t("Binary to hexadecimal", "二进制化为十六进制"),
      explanation: t(
        "Sixteen is two to the fourth power, so each group of four binary digits, counted from the right, becomes one hexadecimal digit. Group from the right: $\\mathrm{1110010100001}_{2} = \\mathrm{1\\,1100\\,1010\\,0001}_{2}$, and the groups are $1$, $\\mathrm{C}$, $\\mathrm{A}$ and $1$, so it is $\\mathrm{1CA1}_{16}$.\n\n> **Watch out.** Group from the right, so that only the leftmost group can be short; grouping from the left shifts every digit.",
        "16 是 2 的四次方，所以从右边数起，每四个二进制位一组，就变成一个十六进制数字。从右往左分组：$\\mathrm{1110010100001}_{2} = \\mathrm{1\\,1100\\,1010\\,0001}_{2}$，各组是 $1$、$\\mathrm{C}$、$\\mathrm{A}$、$1$，所以是 $\\mathrm{1CA1}_{16}$。\n\n> **注意。** 要从右边开始分组，这样只有最左边一组可能不满四位；从左边分组会让每一位都错位。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(40, 4095);
        while (!/[A-F]/.test(toBase(n, 16)));
        const groups = nibbles(n);
        const fromLeft = Number.parseInt(toBase(n, 2).padEnd(groups.length * 4, "0"), 2);
        const right = baseOpt(n, 16);
        const slips = [
          slip(
            fromLeft,
            "This groups the bits in fours from the left, padding zeros at the right end, which multiplies the value by a power of two.",
            "这是从左往右四位一组，在右端补零，相当于把数值乘以了 2 的幂。",
          ),
          ...nearby(rng, n, 16),
        ].filter((w) => w.value !== n);
        const mapped = (zh: boolean) =>
          groups.map((g) => `$${g} \\to \\mathrm{${toBase(Number.parseInt(g, 2), 16)}}$`).join(zh ? "，" : ", ");
        return explainedChoice(rng, {
          prompt: t(`Write $${numTex(toBase(n, 2), 2)}$ in hexadecimal.`, `把 $${numTex(toBase(n, 2), 2)}$ 写成十六进制数。`),
          correct: right,
          wrong: firstThree(right, asOptions(slips, 16)),
          solution: walked(
            [
              [
                ["Group the bits in fours from the right", "从右往左每四位一组"],
                t(
                  `$${numTex(toBase(n, 2), 2)} = \\mathrm{${groups.join("\\,")}}_{2}$, with zeros added at the front to fill the first group.`,
                  `$${numTex(toBase(n, 2), 2)} = \\mathrm{${groups.join("\\,")}}_{2}$，最前面补零把第一组补满。`,
                ),
              ],
              [
                ["Write each group as one digit", "每组写成一位数字"],
                t(`${mapped(false)}, so $${numTex(toBase(n, 16), 16)}$.`, `${mapped(true)}，所以是 $${numTex(toBase(n, 16), 16)}$。`),
              ],
            ],
            t(
              `$${numTex(toBase(n, 16), 16)} = ${valueChain(toBase(n, 16), 16)}$, and $${numTex(toBase(n, 2), 2)} = ${n}$ as well.`,
              `$${numTex(toBase(n, 16), 16)} = ${valueChain(toBase(n, 16), 16)}$，而 $${numTex(toBase(n, 2), 2)}$ 也等于 $${n}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "hexadecimal-to-binary",
      title: t("Hexadecimal to binary", "十六进制化为二进制"),
      explanation: t(
        "Going the other way, replace each hexadecimal digit by its four binary digits, keeping leading zeros inside the number. $\\mathrm{4E07}_{16}$ is $\\mathrm{0100}$, $\\mathrm{1110}$, $\\mathrm{0000}$, $\\mathrm{0111}$, so it is $\\mathrm{100111000000111}_{2}$ once the leading $0$ is dropped.\n\n> **Watch out.** Write every digit after the first with all four bits, so $7$ is $\\mathrm{0111}$ and $0$ is $\\mathrm{0000}$; only zeros at the very front may be dropped.",
        "反过来，把每个十六进制数字换成它的四个二进制位，数中间的前导零要保留。$\\mathrm{4E07}_{16}$ 是 $\\mathrm{0100}$、$\\mathrm{1110}$、$\\mathrm{0000}$、$\\mathrm{0111}$，去掉最前面的 $0$ 后是 $\\mathrm{100111000000111}_{2}$。\n\n> **注意。** 第一位之后的每个数字都要写满四位，所以 $7$ 是 $\\mathrm{0111}$，$0$ 是 $\\mathrm{0000}$；只有最前面的零可以去掉。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(40, 4095);
        while (!/[A-F]/.test(toBase(n, 16)));
        const s = toBase(n, 16);
        // Forgetting to pad a digit to four bits is the classic slip.
        const unpadded = Number.parseInt(
          s
            .split("")
            .map((d) => Number.parseInt(d, 16).toString(2))
            .join(""),
          2,
        );
        const right = baseOpt(n, 2);
        const slips = [
          slip(
            unpadded,
            "This writes some digits with fewer than four bits, dropping zeros inside the number.",
            "这把某些数字写成了不足四位，丢掉了数中间的零。",
          ),
          ...nearby(rng, n, 2),
        ].filter((w) => w.value !== n);
        const four = s
          .split("")
          .map((d) => Number.parseInt(d, 16).toString(2).padStart(4, "0"))
          .join("\\,");
        return explainedChoice(rng, {
          prompt: t(`Write $${numTex(s, 16)}$ in binary.`, `把 $${numTex(s, 16)}$ 写成二进制数。`),
          correct: right,
          wrong: firstThree(right, asOptions(slips, 2)),
          solution: walked(
            [
              [
                ["Write each digit as four bits", "每个数字写成四个比特"],
                t(
                  `${s
                    .split("")
                    .map((d) => `$\\mathrm{${d}} \\to ${Number.parseInt(d, 16).toString(2).padStart(4, "0")}$`)
                    .join(", ")}.`,
                  `${s
                    .split("")
                    .map((d) => `$\\mathrm{${d}} \\to ${Number.parseInt(d, 16).toString(2).padStart(4, "0")}$`)
                    .join("，")}。`,
                ),
              ],
              [
                ["Join the groups", "把各组连起来"],
                t(
                  `$\\mathrm{${four}}$ without its leading zeros is $${numTex(toBase(n, 2), 2)}$.`,
                  `$\\mathrm{${four}}$ 去掉前导零后是 $${numTex(toBase(n, 2), 2)}$。`,
                ),
              ],
            ],
            t(
              `Grouping $${numTex(toBase(n, 2), 2)}$ in fours from the right gives $\\mathrm{${nibbles(n).join("\\,")}}$, which is $${numTex(s, 16)}$ again.`,
              `把 $${numTex(toBase(n, 2), 2)}$ 从右往左每四位一组，得到 $\\mathrm{${nibbles(n).join("\\,")}}$，又是 $${numTex(s, 16)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** BASES are the bases used for arbitrary-base problems. */
const BASES = [3, 4, 5, 6, 7, 8, 9, 12] as const;

/** integersInArbitraryBases converts integers between base 10 and any base. */
export const integersInArbitraryBases: TopicDef = {
  id: "integers-in-arbitrary-bases",
  title: t("Integers in Arbitrary Bases", "任意进制的整数"),
  summary: t(
    "In base b the digits run from 0 to b − 1 and the places are worth 1, b, b², …; repeated division by b converts from decimal.",
    "在 b 进制中，数字从 0 到 b − 1，各位的位值依次为 1、b、b²、…；不断除以 b 即可从十进制转换过来。",
  ),
  intro: t(
    "In base $11$ the digits run from $0$ to $10$, with $\\mathrm{A}$ for ten, and the places are worth $1$, $11$, $121$, …; so $\\mathrm{3A5}_{11} = 3 \\cdot 121 + 10 \\cdot 11 + 5 = 478$.\n\nCheck: $478 = 11 \\cdot 43 + 5$, $43 = 11 \\cdot 3 + 10$ and $3 = 11 \\cdot 0 + 3$, and the remainders read upward give $\\mathrm{3A5}_{11}$ back.\n\nIn this lesson we convert integers between decimal and any base, and find remainders from digit sums.",
    "在十一进制中，数字从 $0$ 到 $10$，用 $\\mathrm{A}$ 表示十，各位的位值是 $1$、$11$、$121$、…；所以 $\\mathrm{3A5}_{11} = 3 \\cdot 121 + 10 \\cdot 11 + 5 = 478$。\n\n检验：$478 = 11 \\cdot 43 + 5$，$43 = 11 \\cdot 3 + 10$，$3 = 11 \\cdot 0 + 3$，余数从下往上读又得到 $\\mathrm{3A5}_{11}$。\n\n本课我们在十进制与任意进制之间转换整数，并由数字和求余数。",
  ),
  prerequisites: ["hexadecimal-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "base-b-to-decimal",
      title: t("Base b to decimal", "b 进制化为十进制"),
      explanation: t(
        "In any base, each digit is multiplied by a power of the base, starting from the zeroth power on the right. $\\mathrm{10203}_{7} = 7^4 + 2 \\cdot 7^2 + 3 = 2401 + 98 + 3 = 2502$.\n\n> **Watch out.** The places are powers of the base, not of ten: in base $7$ the third place from the right is worth $49$. A digit $0$ adds nothing but still holds its place.",
        "在任何进制中，每一位都乘以基数的一个幂，从右边的零次幂开始。$\\mathrm{10203}_{7} = 7^4 + 2 \\cdot 7^2 + 3 = 2401 + 98 + 3 = 2502$。\n\n> **注意。** 位值是基数的幂，不是十的幂：七进制中右起第三位的位值是 $49$。数字 $0$ 不贡献数值，但仍占着它的位置。",
      ),
      generate(rng) {
        const b = rng.pick(BASES);
        const n = rng.int(b * b, Math.min(b ** 4 - 1, 2000));
        const s = toBase(n, b);
        const letters = /[A-Z]/.test(s);
        const places = range(0, s.length - 1)
          .reverse()
          .map((k) => `$${b ** k}$`);
        return numberProblem({
          prompt: t(`Write $${numTex(s, b)}$ in decimal.`, `把 $${numTex(s, b)}$ 写成十进制数。`),
          answer: n,
          mistakes: distinct(n, [
            slip(
              Number.parseInt(s.replace(/[A-Z]/g, "1"), 10),
              letters
                ? "This takes each letter as the digit $1$ and reads the digits as a decimal numeral, ignoring the base."
                : "This reads the digits as a decimal numeral, ignoring the base.",
              letters ? "这把每个字母当作数字 $1$，再把各位当作十进制数来读，忽略了基数。" : "这把各位当作十进制数来读，忽略了基数。",
            ),
            ...nearby(rng, n, b),
          ]),
          solution: walked(
            [
              [
                ["List the place values", "列出位值"],
                t(
                  `In base $${b}$ the $${s.length}$ places are worth ${places.join(", ")}.`,
                  `在 $${b}$ 进制中，这 $${s.length}$ 位的位值是 ${places.join("、")}。`,
                ),
              ],
              [
                ["Multiply and add", "相乘再相加"],
                t(`$${numTex(s, b)} = ${valueChain(s, b)}$.`, `$${numTex(s, b)} = ${valueChain(s, b)}$。`),
              ],
            ],
            lastDigitCheck(n, b),
          ),
        });
      },
    },
    {
      id: "decimal-to-base-b",
      title: t("Decimal to base b", "十进制化为 b 进制"),
      explanation: t(
        "Divide by the base repeatedly and read the remainders from last to first, exactly as for binary. To write $3000$ in base $9$: $3000 = 9 \\cdot 333 + 3$, $333 = 9 \\cdot 37 + 0$, $37 = 9 \\cdot 4 + 1$, $4 = 9 \\cdot 0 + 4$. Reading upward, $3000 = \\mathrm{4103}_{9}$.\n\n> **Watch out.** Every remainder is less than the base, so it is a single digit; and the remainders are read from the last one up, not in the order they were found.",
        "反复除以基数，再把余数从最后一个读到第一个，与二进制的做法完全一样。把 $3000$ 写成九进制：$3000 = 9 \\cdot 333 + 3$，$333 = 9 \\cdot 37 + 0$，$37 = 9 \\cdot 4 + 1$，$4 = 9 \\cdot 0 + 4$。从下往上读，$3000 = \\mathrm{4103}_{9}$。\n\n> **注意。** 每个余数都小于基数，所以是一位数字；余数要从最后一个往上读，而不是按求出的顺序读。",
      ),
      generate(rng) {
        const b = rng.pick(BASES);
        const n = rng.int(b * b, Math.min(1500, b ** 4 - 1));
        const reversedDigits = Number.parseInt(toBase(n, b).split("").reverse().join(""), b);
        const right = baseOpt(n, b);
        const slips = [
          slip(
            reversedDigits,
            "This writes the remainders in the order they were found, which reverses the digits.",
            "这是按求出的顺序写余数，把各位顺序弄反了。",
          ),
          ...nearby(rng, n, b),
        ].filter((w) => w.value !== n);
        const s = toBase(n, b);
        return explainedChoice(rng, {
          prompt: t(`Write $${n}$ in base $${b}$.`, `把 $${n}$ 写成 $${b}$ 进制数。`),
          correct: right,
          wrong: firstThree(right, asOptions(slips, b)),
          solution: walked(
            [
              [[`Divide by $${b}$ repeatedly`, `不断除以 $${b}$`], t(`${divisionSteps(n, b)}.`, `${divisionSteps(n, b)}。`)],
              [
                ["Read the remainders upward", "从下往上读余数"],
                /[A-Z]/.test(s)
                  ? t(
                      `Writing ${letterValues(s, false)}, $${n} = ${numTex(s, b)}$.`,
                      `把 ${letterValues(s, true)} 写成字母，$${n} = ${numTex(s, b)}$。`,
                    )
                  : t(`$${n} = ${numTex(s, b)}$.`, `$${n} = ${numTex(s, b)}$。`),
              ],
            ],
            t(`$${numTex(s, b)} = ${valueChain(s, b)}$.`, `$${numTex(s, b)} = ${valueChain(s, b)}$。`),
          ),
        });
      },
    },
  ],
};

/** phi computes Euler's totient function. */
export const phi = (n: number) => factorize(n).reduce((acc, [p, k]) => acc * (p - 1) * p ** (k - 1), 1);

/** factorTex writes a prime factorization: "2^{3} \cdot 5". */
const factorTex = (n: number) =>
  factorize(n)
    .map(([p, k]) => (k === 1 ? `${p}` : `${p}^{${k}}`))
    .join(" \\cdot ");

/** primeList writes the distinct prime factors of n: "$2$, $3$". */
const primeList = (n: number, zh: boolean) =>
  factorize(n)
    .map(([r]) => `$${r}$`)
    .join(zh ? "、" : ", ");

/** fractionsInArbitraryBases reads fractional numerals in any base and decides when they terminate. */
export const fractionsInArbitraryBases: TopicDef = {
  id: "fractions-in-arbitrary-bases",
  title: t("Fractions in Arbitrary Bases", "任意进制的小数"),
  summary: t(
    "In base b the places after the point are worth 1/b, 1/b², …; a fraction p/q in lowest terms has a terminating expansion in base b exactly when every prime factor of q divides b.",
    "在 b 进制中，小数点后各位的位值依次为 1/b、1/b²、…；最简分数 p/q 在 b 进制下是有限小数，当且仅当 q 的每个质因数都整除 b。",
  ),
  intro: t(
    "In base $5$ the places after the point are worth $\\frac{1}{5}$, $\\frac{1}{25}$, $\\frac{1}{125}$, …; so $\\mathrm{0.132}_{5} = \\frac{1}{5} + \\frac{3}{25} + \\frac{2}{125} = \\frac{25 + 15 + 2}{125} = \\frac{42}{125}$.\n\nCheck: $\\frac{42}{125} = 0.336$, and multiplying by $5$ again and again gives $1.68$, $3.4$ and $2$, whose whole parts $1, 3, 2$ are the digits again.\n\nIn this lesson we read fractions written in any base, decide when a fraction has a terminating expansion, and count its places in bases four and eight.",
    "在五进制中，小数点后各位的位值是 $\\frac{1}{5}$、$\\frac{1}{25}$、$\\frac{1}{125}$、…；所以 $\\mathrm{0.132}_{5} = \\frac{1}{5} + \\frac{3}{25} + \\frac{2}{125} = \\frac{25 + 15 + 2}{125} = \\frac{42}{125}$。\n\n检验：$\\frac{42}{125} = 0.336$，不断乘以 $5$ 并取小数部分，得到 $1.68$、$3.4$、$2$，它们的整数部分 $1, 3, 2$ 又是原来的各位。\n\n本课我们读出用任意进制写的小数，判断分数何时是有限小数，并数出它在四进制和八进制下的位数。",
  ),
  prerequisites: ["integers-in-arbitrary-bases", "binary-fractions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "base-b-fractions-to-fractions",
      title: t("Reading base-b fractions", "读 b 进制小数"),
      explanation: t(
        "Digits after the point are worth negative powers of the base, so add each digit divided by the matching power. $\\mathrm{2.105}_{6} = 2 + \\frac{1}{6} + \\frac{0}{36} + \\frac{5}{216} = \\frac{432 + 36 + 5}{216} = \\frac{473}{216}$.\n\n> **Watch out.** The first place after the point is worth $\\frac{1}{b}$ and the next $\\frac{1}{b^2}$; over the common denominator $b^k$ the numerator is the digits read as a base-$b$ integer, not as a decimal one.",
        "小数点后的各位代表基数的负幂，所以把每一位除以相应的幂再相加。$\\mathrm{2.105}_{6} = 2 + \\frac{1}{6} + \\frac{0}{36} + \\frac{5}{216} = \\frac{432 + 36 + 5}{216} = \\frac{473}{216}$。\n\n> **注意。** 小数点后第一位的位值是 $\\frac{1}{b}$，下一位是 $\\frac{1}{b^2}$；通分到分母 $b^k$ 后，分子是把各位当作 $b$ 进制整数读出的值，而不是当作十进制数。",
      ),
      generate(rng) {
        const b = rng.pick(BASES);
        const k = rng.int(1, 2);
        let num: number;
        do num = rng.int(1, 4 * b ** k);
        while (num % b === 0);
        const s = fracBase(num, b, k);
        const value = Q.of(num, b ** k);
        const den = powTex(b, k);
        return numberProblem({
          prompt: t(`Write $${numTex(s, b)}$ as a fraction.`, `把 $${numTex(s, b)}$ 写成分数。`),
          answer: value,
          mistakes: [
            why(
              Q.of(num, 10 ** k),
              `This keeps the numerator $${num}$ but divides by $${10 ** k}$ instead of $${b ** k}$, as if the places were tenths.`,
              `这保留了分子 $${num}$，却除以 $${10 ** k}$ 而不是 $${b ** k}$，好像各位是十分位。`,
            ),
            why(
              Q.of(num + 1, b ** k),
              `This is $\\frac{1}{${b ** k}}$ too much, as if the last digit were one larger.`,
              `这多了 $\\frac{1}{${b ** k}}$，相当于最后一位大了一。`,
            ),
            why(
              Q.of(num, b ** (k + 1)),
              `This divides by $${b}^{${k + 1}}$, one power of $${b}$ too many.`,
              `这除以了 $${b}^{${k + 1}}$，多除了一个 $${b}$。`,
            ),
          ],
          solution: walked(
            [
              [
                ["Use the common denominator", "通分"],
                t(
                  `With $${k}$ ${k === 1 ? "place" : "places"} after the point, $${numTex(s, b)} = \\frac{${num}}{${den}}$, where $${num} = ${numTex(toBase(num, b), b)}$ is the digits read without the point.`,
                  `小数点后有 $${k}$ 位，所以 $${numTex(s, b)} = \\frac{${num}}{${den}}$，其中 $${num} = ${numTex(toBase(num, b), b)}$ 是去掉小数点后读出的数。`,
                ),
              ],
              [
                ["Simplify", "化简"],
                gcd(num, b ** k) === 1
                  ? t(`$\\frac{${num}}{${b ** k}}$ is already in lowest terms.`, `$\\frac{${num}}{${b ** k}}$ 已经是最简分数。`)
                  : t(
                      `Dividing top and bottom by $${gcd(num, b ** k)}$, $\\frac{${num}}{${b ** k}} = ${value.toLatex()}$.`,
                      `分子分母同除以 $${gcd(num, b ** k)}$，$\\frac{${num}}{${b ** k}} = ${value.toLatex()}$。`,
                    ),
              ],
            ],
            t(`The numerator checks out: $${valueChain(toBase(num, b), b)}$.`, `分子无误：$${valueChain(toBase(num, b), b)}$。`),
          ),
        });
      },
    },
    {
      id: "terminating-expansions-in-base-b",
      title: t("Terminating expansions", "有限小数"),
      explanation: t(
        "A fraction terminates in base $b$ when it can be written over a power of $b$, which happens exactly when every prime factor of the denominator divides $b$. $\\frac{7}{90}$ terminates in base $30$, since $90 = 2 \\cdot 3^2 \\cdot 5$ and $2$, $3$, $5$ all divide $30$: $\\frac{7}{90} = \\frac{70}{900} = \\frac{2 \\cdot 30 + 10}{30^2} = \\mathrm{0.2A}_{30}$. It does not terminate in base $10$, since $3 \\nmid 10$.\n\n> **Watch out.** Reduce the fraction to lowest terms first, then test every prime factor of the denominator. A prime that divides $b$ only once is still enough, because higher powers of $b$ supply more copies of it.",
        "分数在 $b$ 进制下是有限小数，就是它能写成分母为 $b$ 的幂的分数，这恰好在分母的每个质因数都整除 $b$ 时发生。$\\frac{7}{90}$ 在三十进制下是有限小数，因为 $90 = 2 \\cdot 3^2 \\cdot 5$，而 $2$、$3$、$5$ 都整除 $30$：$\\frac{7}{90} = \\frac{70}{900} = \\frac{2 \\cdot 30 + 10}{30^2} = \\mathrm{0.2A}_{30}$。它在十进制下不是有限小数，因为 $3 \\nmid 10$。\n\n> **注意。** 先把分数化为最简，再检查分母的每个质因数。一个质数即使只整除 $b$ 一次也够了，因为 $b$ 的更高次幂能提供更多个它。",
      ),
      generate(rng) {
        const b = rng.pick([...BASES, 2, 10]);
        let p: number;
        let q: number;
        do {
          q = rng.int(3, 60);
          p = rng.int(1, q - 1);
        } while (gcd(p, q) !== 1);
        const primes = factorize(q).map(([r]) => r);
        const value = primes.every((r) => b % r === 0);
        const bad = primes.find((r) => b % r !== 0);
        const j = value ? range(1, 8).find((i) => b ** i % q === 0)! : 0;
        return explainedChoice(rng, {
          prompt: t(
            `Does $\\frac{${p}}{${q}}$ have a terminating expansion in base $${b}$?`,
            `$\\frac{${p}}{${q}}$ 在 $${b}$ 进制下是有限小数吗？`,
          ),
          correct: yesNo[value ? 0 : 1]!,
          wrong: [
            {
              option: yesNo[value ? 1 : 0]!,
              why: value
                ? t(
                    `Every prime factor of $${q}$ divides $${b}$, so the power ${j === 1 ? `$${b}$` : `$${powTex(b, j)} = ${b ** j}$`} is already a multiple of $${q}$ and the expansion stops after $${j}$ ${j === 1 ? "place" : "places"}.`,
                    `$${q}$ 的每个质因数都整除 $${b}$，所以幂 ${j === 1 ? `$${b}$` : `$${powTex(b, j)} = ${b ** j}$`} 已是 $${q}$ 的倍数，展开在 $${j}$ 位后终止。`,
                  )
                : t(
                    `$${q}$ has the prime factor $${bad}$, which divides no power of $${b}$, so no denominator $${b}^k$ can be reached and the expansion never stops.`,
                    `$${q}$ 有质因数 $${bad}$，它不整除 $${b}$ 的任何次幂，所以无法化成分母为 $${b}^k$ 的分数，展开永不终止。`,
                  ),
            },
          ],
          solution: walked(
            [
              [
                ["Factor the denominator", "分解分母"],
                isPrimeNumber(q)
                  ? t(
                      `$\\frac{${p}}{${q}}$ is in lowest terms, and its denominator $${q}$ is itself prime.`,
                      `$\\frac{${p}}{${q}}$ 已是最简分数，分母 $${q}$ 本身是质数。`,
                    )
                  : t(
                      `$\\frac{${p}}{${q}}$ is in lowest terms, and $${q} = ${factorTex(q)}$ has the prime ${primes.length === 1 ? "factor" : "factors"} ${primeList(q, false)}.`,
                      `$\\frac{${p}}{${q}}$ 已是最简分数，$${q} = ${factorTex(q)}$ 的质因数是 ${primeList(q, true)}。`,
                    ),
              ],
              [
                ["Compare with the base", "与基数比较"],
                value
                  ? primes.length === 1
                    ? t(`$${primes[0]}$ divides $${b}$, so the answer is yes.`, `$${primes[0]}$ 整除 $${b}$，所以答案是“是”。`)
                    : t(`Each of them divides $${b}$, so the answer is yes.`, `它们都整除 $${b}$，所以答案是“是”。`)
                  : t(`$${bad}$ does not divide $${b}$, so the answer is no.`, `$${bad}$ 不整除 $${b}$，所以答案是“否”。`),
              ],
            ],
            value
              ? b ** j === q
                ? t(
                    j === 1
                      ? `The denominator is the base $${b}$ itself, so $\\frac{${p}}{${q}} = \\mathrm{0.${DIGITS[p]}}_{${b}}$ has $1$ place.`
                      : `The denominator $${q}$ is itself $${powTex(b, j)}$, so $\\frac{${p}}{${q}}$ has $${j}$ places in base $${b}$.`,
                    j === 1
                      ? `分母就是基数 $${b}$ 本身，所以 $\\frac{${p}}{${q}} = \\mathrm{0.${DIGITS[p]}}_{${b}}$ 有 $1$ 位。`
                      : `分母 $${q}$ 本身就是 $${powTex(b, j)}$，所以 $\\frac{${p}}{${q}}$ 在 $${b}$ 进制下有 $${j}$ 位。`,
                  )
                : t(
                    `$${j === 1 ? `${b}` : `${powTex(b, j)} = ${b ** j}`} = ${q} \\cdot ${b ** j / q}$, so $\\frac{${p}}{${q}} = \\frac{${p * (b ** j / q)}}{${powTex(b, j)}}$ has $${j}$ ${j === 1 ? "place" : "places"} in base $${b}$.`,
                    `$${j === 1 ? `${b}` : `${powTex(b, j)} = ${b ** j}`} = ${q} \\cdot ${b ** j / q}$，所以 $\\frac{${p}}{${q}} = \\frac{${p * (b ** j / q)}}{${powTex(b, j)}}$ 在 $${b}$ 进制下有 $${j}$ 位。`,
                  )
              : bad === q
                ? t(
                    `Every power of $${b}$ has only the prime factors of $${b}$, so none is divisible by $${q}$.`,
                    `$${b}$ 的每个幂只含 $${b}$ 的质因数，所以没有一个能被 $${q}$ 整除。`,
                  )
                : t(
                    `Every power of $${b}$ has only the prime factors of $${b}$, so none is divisible by $${bad}$, let alone by $${q}$.`,
                    `$${b}$ 的每个幂只含 $${b}$ 的质因数，所以没有一个能被 $${bad}$ 整除，更不能被 $${q}$ 整除。`,
                  ),
          ),
        });
      },
    },
  ],
};

/** PRIMES are small primes used as moduli. */
const PRIMES = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43] as const;

/** times writes the multiple k of m, leaving out a factor of one: "29 \cdot 3", "29". */
const times = (m: number, k: number) => (k === 1 ? `${m}` : `${m} \\cdot ${k}`);

/** smallPower works out aʳ modulo n: directly for r = 1, by repeated squaring otherwise. */
const smallPower = (a: number, r: number, n: number) => {
  if (r === 1) return { en: `The power left is $${a}$ itself.`, zh: `剩下的幂就是 $${a}$ 本身。` };
  return squaringWork(a, r, n);
};

/** inverseCheck checks aʳ against a^(f − r): their product must be a^f ≡ 1 modulo n. */
const inverseCheck = (a: number, r: number, f: number, n: number, theorem: Text) => {
  const value = modPow(a, r, n);
  const s = modPow(a, f - r, n);
  return t(
    `$${value} \\cdot ${s} = ${value * s} \\equiv 1 \\pmod{${n}}$, where $${s} \\equiv ${powTex(a, f - r)}$; so the result times $${powTex(a, f - r)}$ is $${powTex(a, f)} \\equiv 1$, as ${theorem.en} requires.`,
    `$${value} \\cdot ${s} = ${value * s} \\equiv 1 \\pmod{${n}}$，其中 $${s} \\equiv ${powTex(a, f - r)}$；所以结果乘以 $${powTex(a, f - r)}$ 是 $${powTex(a, f)} \\equiv 1$，正如${theorem["zh-CN"]}所要求的。`,
  );
};

/** FERMAT names Fermat's little theorem. */
const FERMAT = t("Fermat's little theorem", "费马小定理");

/** fermatsLittleTheorem reduces exponents modulo p − 1. */
export const fermatsLittleTheorem: TopicDef = {
  id: "fermats-little-theorem",
  title: t("Fermat's Little Theorem", "费马小定理"),
  summary: t(
    "If $p$ is prime and $p \\nmid a$, then $a^{p-1} \\equiv 1 \\pmod{p}$. So exponents can be reduced modulo $p - 1$, and $a^{p-2}$ is the inverse of $a$ modulo $p$.",
    "若 $p$ 是质数且 $p \\nmid a$，则 $a^{p-1} \\equiv 1 \\pmod{p}$。因此指数可以对 $p - 1$ 取模，而 $a^{p-2}$ 就是 $a$ 模 $p$ 的逆元。",
  ),
  intro: t(
    "Since $41$ is prime and $41 \\nmid 3$, Fermat's little theorem gives $3^{40} \\equiv 1 \\pmod{41}$. As $203 = 40 \\cdot 5 + 3$, $3^{203} = (3^{40})^5 \\cdot 3^3 \\equiv 27 \\pmod{41}$.\n\nCheck: $3^4 = 81 = 2 \\cdot 41 - 1 \\equiv -1$, so $3^8 \\equiv 1$; as $203 = 8 \\cdot 25 + 3$, again $3^{203} \\equiv 3^3 = 27$.\n\nIn this lesson we use Fermat's little theorem to reduce large powers modulo a prime, to find inverses, and to prove that a number is composite without finding a factor.",
    "因为 $41$ 是质数且 $41 \\nmid 3$，由费马小定理得 $3^{40} \\equiv 1 \\pmod{41}$。由于 $203 = 40 \\cdot 5 + 3$，$3^{203} = (3^{40})^5 \\cdot 3^3 \\equiv 27 \\pmod{41}$。\n\n检验：$3^4 = 81 = 2 \\cdot 41 - 1 \\equiv -1$，所以 $3^8 \\equiv 1$；由于 $203 = 8 \\cdot 25 + 3$，同样得 $3^{203} \\equiv 3^3 = 27$。\n\n本课我们用费马小定理化简模质数的大次幂、求逆元，并在不找出因数的情况下证明一个数是合数。",
  ),
  prerequisites: ["multiplicative-inverses-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reducing-powers-with-fermat",
      title: t("Reducing large powers", "化简大次幂"),
      explanation: t(
        "Fermat's little theorem says the power one less than a prime is one modulo that prime, so exponents can be reduced by multiples of it. To find $2^{100} \\bmod 29$: $2^{28} \\equiv 1$ and $100 = 28 \\cdot 3 + 16$, so $2^{100} \\equiv 2^{16}$; with $2^5 = 32 \\equiv 3$, $2^{16} = (2^5)^3 \\cdot 2 \\equiv 27 \\cdot 2 = 54 \\equiv 25 \\pmod{29}$.\n\n> **Watch out.** Reduce the exponent modulo $p - 1$, not modulo $p$; and the remainder of the exponent, not its quotient, is the power that is left.",
        "费马小定理说，素数减 1 次幂模这个素数等于 1，所以指数可以减去它的倍数。求 $2^{100} \\bmod 29$：$2^{28} \\equiv 1$，且 $100 = 28 \\cdot 3 + 16$，所以 $2^{100} \\equiv 2^{16}$；由 $2^5 = 32 \\equiv 3$，$2^{16} = (2^5)^3 \\cdot 2 \\equiv 27 \\cdot 2 = 54 \\equiv 25 \\pmod{29}$。\n\n> **注意。** 指数要对 $p - 1$ 取模，而不是对 $p$；剩下的幂是指数除法的余数，而不是商。",
      ),
      generate(rng) {
        const p = rng.pick(PRIMES.slice(0, 7));
        const a = rng.int(2, p - 1);
        const r = rng.int(1, p - 2);
        const e = (p - 1) * rng.int(5, 60) + r;
        const value = modPow(a, e, p);
        const work = smallPower(a, r, p);
        return numberProblem({
          prompt: t(`Find the remainder when $${a}^{${e}}$ is divided by $${p}$.`, `求 $${a}^{${e}}$ 除以 $${p}$ 的余数。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              modPow(a, e % p, p),
              `This reduces the exponent modulo $${p}$ instead of $${p - 1}$.`,
              `这把指数对 $${p}$ 取模，而不是对 $${p - 1}$。`,
            ),
            why(
              modPow(a, r + 1, p),
              `This keeps one factor $${a}$ too many: the exponent left over is $${r}$, not $${r + 1}$.`,
              `这多留了一个因数 $${a}$：剩下的指数是 $${r}$，不是 $${r + 1}$。`,
            ),
            why(
              modPow(a, r - 1, p),
              `This keeps one factor $${a}$ too few: the exponent left over is $${r}$, not $${r - 1}$.`,
              `这少留了一个因数 $${a}$：剩下的指数是 $${r}$，不是 $${r - 1}$。`,
            ),
            why(
              1,
              `This takes the whole power to be $1$, but $${e}$ is not a multiple of $${p - 1}$, so $${powTex(a, r)}$ is left over.`,
              `这把整个幂当作 $1$，但 $${e}$ 不是 $${p - 1}$ 的倍数，还剩下 $${powTex(a, r)}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply Fermat's little theorem", "应用费马小定理"],
                t(
                  `$${p}$ is prime and does not divide $${a}$, so $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$.`,
                  `$${p}$ 是质数且不整除 $${a}$，所以 $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$。`,
                ),
              ],
              [
                ["Reduce the exponent", "化简指数"],
                t(
                  `$${e} = ${p - 1} \\cdot ${(e - r) / (p - 1)} + ${r}$, so $${a}^{${e}} = (${a}^{${p - 1}})^{${(e - r) / (p - 1)}} \\cdot ${powTex(a, r)} \\equiv ${powTex(a, r)}$.`,
                  `$${e} = ${p - 1} \\cdot ${(e - r) / (p - 1)} + ${r}$，所以 $${a}^{${e}} = (${a}^{${p - 1}})^{${(e - r) / (p - 1)}} \\cdot ${powTex(a, r)} \\equiv ${powTex(a, r)}$。`,
                ),
              ],
              [
                ["Work out the small power", "算出小次幂"],
                t(`${work.en} So the remainder is $${value}$.`, `${work.zh}所以余数是 $${value}$。`),
              ],
            ],
            inverseCheck(a, r, p - 1, p, FERMAT),
          ),
        });
      },
    },
    {
      id: "inverses-with-fermat",
      title: t("Inverses from Fermat", "用费马小定理求逆元"),
      explanation: t(
        "Since the power one less than the prime is one, the power two less than the prime is an inverse, which can be found by repeated squaring: $a \\cdot a^{p-2} = a^{p-1} \\equiv 1$. Modulo $47$, $5^{-1} \\equiv 5^{45}$, and repeated squaring gives $5^{45} \\equiv 19$; indeed $5 \\cdot 19 = 95 = 2 \\cdot 47 + 1$.\n\n> **Watch out.** The inverse is $a^{p-2}$, not $a^{p-1}$, which is always $1$; and it is not $p - a$, which is the negative of $a$.",
        "由于素数减 1 次幂等于 1，素数减 2 次幂就是逆元，可以用反复平方求出：$a \\cdot a^{p-2} = a^{p-1} \\equiv 1$。模 $47$ 时 $5^{-1} \\equiv 5^{45}$，反复平方得 $5^{45} \\equiv 19$；确实 $5 \\cdot 19 = 95 = 2 \\cdot 47 + 1$。\n\n> **注意。** 逆元是 $a^{p-2}$，不是总等于 $1$ 的 $a^{p-1}$；它也不是 $p - a$，那是 $a$ 的相反数。",
      ),
      generate(rng) {
        const p = rng.pick(PRIMES);
        const a = rng.int(2, p - 2);
        const value = inverseMod(a, p);
        const work = squaringWork(a, p - 2, p);
        return numberProblem({
          prompt: t(
            `Using Fermat's little theorem, find the inverse of $${a}$ modulo $${p}$, as a number from $0$ to $${p - 1}$.`,
            `用费马小定理求 $${a}$ 模 $${p}$ 的逆元，答案取 $0$ 到 $${p - 1}$ 之间的数。`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              p - a,
              `This is $-${a}$ modulo $${p}$, the additive inverse; the multiplicative inverse times $${a}$ must leave $1$.`,
              `这是 $-${a}$ 模 $${p}$，即加法逆元；乘法逆元与 $${a}$ 相乘必须余 $1$。`,
            ),
            why(
              modPow(a, p - 3, p),
              `This is $${a}^{${p - 3}}$; the exponent should be $p - 2 = ${p - 2}$.`,
              `这是 $${a}^{${p - 3}}$；指数应是 $p - 2 = ${p - 2}$。`,
            ),
            why(
              p - value,
              `This is the negative of the inverse: $${a}$ times it leaves $${p - 1}$, not $1$.`,
              `这是逆元的相反数：$${a}$ 乘以它余 $${p - 1}$，不是 $1$。`,
            ),
            why(
              modPow(a, p - 1, p),
              `This is $${a}^{${p - 1}}$, which Fermat's little theorem makes $1$ for every $a$; the inverse is one power lower.`,
              `这是 $${a}^{${p - 1}}$，由费马小定理它对任何 $a$ 都等于 $1$；逆元要低一次幂。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Use Fermat's little theorem", "用费马小定理"],
                t(
                  `$${a} \\cdot ${a}^{${p - 2}} = ${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$, so $${a}^{-1} \\equiv ${a}^{${p - 2}}$.`,
                  `$${a} \\cdot ${a}^{${p - 2}} = ${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$，所以 $${a}^{-1} \\equiv ${a}^{${p - 2}}$。`,
                ),
              ],
              [
                ["Compute the power", "计算这个幂"],
                t(`${work.en} So $${a}^{-1} \\equiv ${value}$.`, `${work.zh}所以 $${a}^{-1} \\equiv ${value}$。`),
              ],
            ],
            t(
              `$${a} \\cdot ${value} = ${a * value} = ${times(p, (a * value - 1) / p)} + 1$.`,
              `$${a} \\cdot ${value} = ${a * value} = ${times(p, (a * value - 1) / p)} + 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** eulersTotientFunction counts the integers up to n that are coprime to n. */
export const eulersTotientFunction: TopicDef = {
  id: "eulers-totient-function",
  title: t("Euler's Totient Function", "欧拉函数"),
  summary: t(
    "φ(n) counts the integers 1 ≤ k ≤ n with gcd(k, n) = 1. φ(pᵏ) = pᵏ − pᵏ⁻¹, and φ(mn) = φ(m)φ(n) when gcd(m, n) = 1.",
    "φ(n) 统计满足 gcd(k, n) = 1 的整数 1 ≤ k ≤ n 的个数。φ(pᵏ) = pᵏ − pᵏ⁻¹，且当 gcd(m, n) = 1 时 φ(mn) = φ(m)φ(n)。",
  ),
  intro: t(
    "$1001 = 7 \\cdot 11 \\cdot 13$, so $\\varphi(1001) = 6 \\cdot 10 \\cdot 12 = 720$ of the integers from $1$ to $1001$ are coprime to it.\n\nCheck: counting the others by inclusion and exclusion, there are $143 + 91 + 77 - 13 - 11 - 7 + 1 = 281$ multiples of $7$, $11$ or $13$ up to $1001$, and $1001 - 281 = 720$.\n\nIn this lesson we compute Euler's totient of prime powers and of composite numbers, and count the integers in a range that are coprime to a given number.",
    "$1001 = 7 \\cdot 11 \\cdot 13$，所以从 $1$ 到 $1001$ 的整数中有 $\\varphi(1001) = 6 \\cdot 10 \\cdot 12 = 720$ 个与它互质。\n\n检验：用容斥原理数其余的数，不超过 $1001$ 的 $7$、$11$ 或 $13$ 的倍数有 $143 + 91 + 77 - 13 - 11 - 7 + 1 = 281$ 个，而 $1001 - 281 = 720$。\n\n本课我们计算质数幂和合数的欧拉函数值，并数出一个区间内与给定数互质的整数。",
  ),
  prerequisites: ["greatest-common-factor"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "totients-of-prime-powers",
      title: t("Totients of prime powers", "质数幂的欧拉函数"),
      explanation: t(
        "Among $1, \\dots, p^k$ only the multiples of $p$ share a factor with $p^k$, and there are $p^{k-1}$ of them: $\\varphi(p^k) = p^k - p^{k-1}$. So $\\varphi(37) = 36$ and $\\varphi(3^8) = 6561 - 2187 = 4374$.\n\n> **Watch out.** Subtract $p^{k-1}$, the number of multiples of $p$, not $p$ itself and not $1$; only for a prime, $k = 1$, does this leave $p - 1$.",
        "在 $1, \\dots, p^k$ 中，只有 $p$ 的倍数与 $p^k$ 有公因数，共 $p^{k-1}$ 个：$\\varphi(p^k) = p^k - p^{k-1}$。所以 $\\varphi(37) = 36$，$\\varphi(3^8) = 6561 - 2187 = 4374$。\n\n> **注意。** 要减去 $p^{k-1}$，即 $p$ 的倍数的个数，而不是减去 $p$ 或 $1$；只有质数本身（$k = 1$）才得到 $p - 1$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);
        const kMax = Math.max(1, Math.floor(Math.log(3000) / Math.log(p)));
        const k = rng.int(1, Math.min(kMax, 6));
        const n = p ** k;
        const value = phi(n);
        return numberProblem({
          prompt: t(`Find $\\varphi(${n})$.`, `求 $\\varphi(${n})$。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              n - 1,
              `This counts every integer below $${n}$ as coprime, but the multiples of $${p}$ are not.`,
              `这把小于 $${n}$ 的整数都算作互质，但 $${p}$ 的倍数不是。`,
            ),
            why(
              n - p,
              k === 1
                ? `This removes $${p}$ integers, but only $${p}$ itself shares a factor with $${p}$.`
                : `This removes only $${p}$ integers, but there are $${p}^{${k - 1}} = ${n / p}$ multiples of $${p}$ up to $${n}$.`,
              k === 1
                ? `这去掉了 $${p}$ 个整数，但只有 $${p}$ 本身与 $${p}$ 有公因数。`
                : `这只去掉了 $${p}$ 个整数，但不超过 $${n}$ 的 $${p}$ 的倍数有 $${p}^{${k - 1}} = ${n / p}$ 个。`,
            ),
            why(
              (p - 1) ** k,
              `This raises $${p - 1}$ to the power $${k}$, but $\\varphi(p^k) = p^{k-1}(p - 1)$, not $(p - 1)^k$.`,
              `这把 $${p - 1}$ 升到 $${k}$ 次幂，但 $\\varphi(p^k) = p^{k-1}(p - 1)$，而不是 $(p - 1)^k$。`,
            ),
            why(
              n / p,
              "This is the number of multiples of $p$, the integers to remove, not the ones that remain.",
              "这是 $p$ 的倍数的个数，即要去掉的数，而不是剩下的数。",
            ),
          ]),
          solution:
            k === 1
              ? walked(
                  [
                    [["Recognize a prime", "认出质数"], t(`$${n}$ is prime.`, `$${n}$ 是质数。`)],
                    [
                      ["Count the coprime integers", "数互质的整数"],
                      t(
                        `Only $${n}$ itself shares a factor with $${n}$, so every one of $1, \\dots, ${n - 1}$ is coprime to it: $\\varphi(${n}) = ${value}$.`,
                        `只有 $${n}$ 本身与 $${n}$ 有公因数，所以 $1, \\dots, ${n - 1}$ 都与它互质：$\\varphi(${n}) = ${value}$。`,
                      ),
                    ],
                  ],
                  t(
                    `The formula $p^k - p^{k-1}$ with $k = 1$ gives $${n} - 1 = ${value}$.`,
                    `公式 $p^k - p^{k-1}$ 取 $k = 1$ 得 $${n} - 1 = ${value}$。`,
                  ),
                )
              : walked(
                  [
                    [["Write it as a prime power", "写成质数幂"], t(`$${n} = ${p}^{${k}}$.`, `$${n} = ${p}^{${k}}$。`)],
                    [
                      [`Remove the multiples of $${p}$`, `去掉 $${p}$ 的倍数`],
                      t(
                        `There are $${k === 2 ? `${p}` : `${powTex(p, k - 1)} = ${n / p}`}$ multiples of $${p}$ up to $${n}$, so $\\varphi(${n}) = ${n} - ${n / p} = ${value}$.`,
                        `不超过 $${n}$ 的 $${p}$ 的倍数有 $${k === 2 ? `${p}` : `${powTex(p, k - 1)} = ${n / p}`}$ 个，所以 $\\varphi(${n}) = ${n} - ${n / p} = ${value}$。`,
                      ),
                    ],
                  ],
                  p === 2
                    ? t(
                        `$p^{k-1}(p - 1) = ${k === 2 ? "2" : `2^{${k - 1}} = ${value}`}$, since $p - 1 = 1$.`,
                        `$p^{k-1}(p - 1) = ${k === 2 ? "2" : `2^{${k - 1}} = ${value}`}$，因为 $p - 1 = 1$。`,
                      )
                    : t(
                        `$p^{k-1}(p - 1) = ${n / p} \\cdot ${p - 1} = ${value}$.`,
                        `$p^{k-1}(p - 1) = ${n / p} \\cdot ${p - 1} = ${value}$。`,
                      ),
                ),
        });
      },
    },
    {
      id: "totients-of-composite-numbers",
      title: t("Totients of composite numbers", "合数的欧拉函数"),
      explanation: t(
        "Euler's totient is multiplicative over coprime factors, and for a prime power it removes the multiples of the prime. Factor and multiply: $\\varphi(1960) = \\varphi(2^3)\\varphi(5)\\varphi(7^2) = 4 \\cdot 4 \\cdot 42 = 672$. Equivalently $\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right)$.\n\n> **Watch out.** Use $\\varphi(p^k) = p^k - p^{k-1}$ for each prime power, not $p^k - 1$; and multiply over the prime-power factors, not over the primes alone.",
        "欧拉函数对互素的因数是积性的，对素数的幂，它去掉了该素数的倍数。先分解再相乘：$\\varphi(1960) = \\varphi(2^3)\\varphi(5)\\varphi(7^2) = 4 \\cdot 4 \\cdot 42 = 672$。等价地，$\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right)$。\n\n> **注意。** 每个质数幂要用 $\\varphi(p^k) = p^k - p^{k-1}$，而不是 $p^k - 1$；要对质数幂因数相乘，而不只是对质数本身。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 1000);
        while (factorize(n).length < 2);
        const value = phi(n);
        const factors = factorize(n);
        const parts = factors.map(([p, k]) => p ** k);
        return numberProblem({
          prompt: t(`Find $\\varphi(${n})$.`, `求 $\\varphi(${n})$。`),
          answer: value,
          mistakes: distinct(value, [
            why(n - 1, `This treats $${n}$ as if it were prime.`, `这把 $${n}$ 当成了质数。`),
            why(
              factors.reduce((acc, [p]) => acc * (p - 1), 1),
              "This multiplies $p - 1$ over the primes but drops the factor $p^{k-1}$ of each repeated prime.",
              "这对各质数乘以 $p - 1$，却丢掉了重复质数的因子 $p^{k-1}$。",
            ),
            why(
              parts.reduce((acc, m) => acc * (m - 1), 1),
              "This uses $p^k - 1$ for each prime power instead of $p^k - p^{k-1}$.",
              "这对每个质数幂用了 $p^k - 1$，而不是 $p^k - p^{k-1}$。",
            ),
            why(
              value * 2,
              "This is twice the totient, as if one of the factors $\\varphi(p^k)$ had been doubled.",
              "这是欧拉函数值的两倍，好像某个因子 $\\varphi(p^k)$ 被加倍了。",
            ),
          ]),
          solution: walked(
            [
              [["Factor", "分解质因数"], t(`$${n} = ${factorTex(n)}$.`, `$${n} = ${factorTex(n)}$。`)],
              [
                ["Take the totient of each prime power", "求每个质数幂的欧拉函数值"],
                t(
                  `${parts.map((m) => `$\\varphi(${m}) = ${phi(m)}$`).join(", ")}.`,
                  `${parts.map((m) => `$\\varphi(${m}) = ${phi(m)}$`).join("，")}。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$\\varphi(${n}) = ${parts.map(phi).join(" \\cdot ")} = ${value}$.`,
                  `$\\varphi(${n}) = ${parts.map(phi).join(" \\cdot ")} = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${n} \\prod_{p \\mid ${n}} \\left(1 - \\frac{1}{p}\\right) = ${n} \\cdot ${factors.map(([p]) => `\\frac{${p - 1}}{${p}}`).join(" \\cdot ")} = ${value}$.`,
              `$${n} \\prod_{p \\mid ${n}} \\left(1 - \\frac{1}{p}\\right) = ${n} \\cdot ${factors.map(([p]) => `\\frac{${p - 1}}{${p}}`).join(" \\cdot ")} = ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** EULER names Euler's theorem. */
const EULER = t("Euler's theorem", "欧拉定理");

/** eulersTheorem generalizes Fermat's little theorem to composite moduli. */
export const eulersTheorem: TopicDef = {
  id: "eulers-theorem",
  title: t("Euler's Theorem", "欧拉定理"),
  summary: t(
    "If $\\gcd(a, n) = 1$, then $a^{\\varphi(n)} \\equiv 1 \\pmod{n}$; exponents can be reduced modulo $\\varphi(n)$. Fermat's little theorem is the case $n = p$.",
    "若 $\\gcd(a, n) = 1$，则 $a^{\\varphi(n)} \\equiv 1 \\pmod{n}$；指数可以对 $\\varphi(n)$ 取模。费马小定理是 $n = p$ 的特例。",
  ),
  intro: t(
    "$\\gcd(2, 77) = 1$ and $\\varphi(77) = 6 \\cdot 10 = 60$, so $2^{60} \\equiv 1 \\pmod{77}$. As $1000 = 60 \\cdot 16 + 40$, $2^{1000} \\equiv 2^{40}$; squaring from $2^{10} = 1024 \\equiv 23$ gives $2^{20} \\equiv 67$ and $2^{40} \\equiv 23 \\pmod{77}$.\n\nCheck: modulo $7$, $2^3 \\equiv 1$ and $1000 = 3 \\cdot 333 + 1$, so $2^{1000} \\equiv 2$, and $23 = 3 \\cdot 7 + 2$; modulo $11$, $2^{10} \\equiv 1$, so $2^{1000} \\equiv 1$, and $23 = 2 \\cdot 11 + 1$.\n\nIn this lesson we use Euler's theorem to reduce powers modulo any $n$, find the last digits of powers, and find the order of a number modulo $n$.",
    "$\\gcd(2, 77) = 1$ 且 $\\varphi(77) = 6 \\cdot 10 = 60$，所以 $2^{60} \\equiv 1 \\pmod{77}$。由于 $1000 = 60 \\cdot 16 + 40$，$2^{1000} \\equiv 2^{40}$；从 $2^{10} = 1024 \\equiv 23$ 开始平方，得 $2^{20} \\equiv 67$，$2^{40} \\equiv 23 \\pmod{77}$。\n\n检验：模 $7$ 时 $2^3 \\equiv 1$，且 $1000 = 3 \\cdot 333 + 1$，所以 $2^{1000} \\equiv 2$，而 $23 = 3 \\cdot 7 + 2$；模 $11$ 时 $2^{10} \\equiv 1$，所以 $2^{1000} \\equiv 1$，而 $23 = 2 \\cdot 11 + 1$。\n\n本课我们用欧拉定理化简模任意 $n$ 的幂，求幂的末位数字，并求一个数模 $n$ 的阶。",
  ),
  prerequisites: ["fermats-little-theorem", "eulers-totient-function"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reducing-powers-with-euler",
      title: t("Reducing powers modulo n", "模 n 化简幂"),
      explanation: t(
        "Euler's theorem generalizes Fermat's: when the base is coprime to the modulus, the totient power is one, so exponents reduce modulo the totient. To find $3^{100} \\bmod 65$: $\\gcd(3, 65) = 1$, $\\varphi(65) = 4 \\cdot 12 = 48$ and $100 = 48 \\cdot 2 + 4$, so $3^{100} \\equiv 3^4 = 81 \\equiv 16 \\pmod{65}$.\n\n> **Watch out.** Reduce the exponent modulo $\\varphi(n)$, not modulo $n - 1$ as for a prime; and the theorem needs $\\gcd(a, n) = 1$.",
        "欧拉定理推广了费马定理：当底数与模互素时，欧拉函数值次幂等于 1，所以指数可以模欧拉函数值约化。求 $3^{100} \\bmod 65$：$\\gcd(3, 65) = 1$，$\\varphi(65) = 4 \\cdot 12 = 48$，且 $100 = 48 \\cdot 2 + 4$，所以 $3^{100} \\equiv 3^4 = 81 \\equiv 16 \\pmod{65}$。\n\n> **注意。** 指数要对 $\\varphi(n)$ 取模，而不是像质数那样对 $n - 1$ 取模；定理要求 $\\gcd(a, n) = 1$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(10, 60);
        while (isPrimeNumber(n));
        let a: number;
        do a = rng.int(2, n - 1);
        while (gcd(a, n) !== 1);
        const f = phi(n);
        const r = rng.int(1, f - 1);
        const e = f * rng.int(4, 40) + r;
        const value = modPow(a, e, n);
        const work = smallPower(a, r, n);
        return numberProblem({
          prompt: t(`Find the remainder when $${a}^{${e}}$ is divided by $${n}$.`, `求 $${a}^{${e}}$ 除以 $${n}$ 的余数。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              modPow(a, e % (n - 1), n),
              `This reduces the exponent modulo $${n - 1}$, as if $${n}$ were prime; for this $n$ use $\\varphi(${n}) = ${f}$.`,
              `这把指数对 $${n - 1}$ 取模，好像 $${n}$ 是质数；这里应该用 $\\varphi(${n}) = ${f}$。`,
            ),
            why(
              modPow(a, r + 1, n),
              `This keeps one factor $${a}$ too many: the exponent left over is $${r}$, not $${r + 1}$.`,
              `这多留了一个因数 $${a}$：剩下的指数是 $${r}$，不是 $${r + 1}$。`,
            ),
            why(
              1,
              `This takes the whole power to be $1$, but $${e}$ is not a multiple of $${f}$, so $${powTex(a, r)}$ is left over.`,
              `这把整个幂当作 $1$，但 $${e}$ 不是 $${f}$ 的倍数，还剩下 $${powTex(a, r)}$。`,
            ),
            why(
              modPow(a, e % n, n),
              `This reduces the exponent modulo $${n}$ instead of $\\varphi(${n}) = ${f}$.`,
              `这把指数对 $${n}$ 取模，而不是对 $\\varphi(${n}) = ${f}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the totient", "求欧拉函数值"],
                t(
                  `$${n} = ${factorTex(n)}$, so $\\varphi(${n}) = ${f}$; and $\\gcd(${a}, ${n}) = 1$, so $${a}^{${f}} \\equiv 1 \\pmod{${n}}$.`,
                  `$${n} = ${factorTex(n)}$，所以 $\\varphi(${n}) = ${f}$；又 $\\gcd(${a}, ${n}) = 1$，所以 $${a}^{${f}} \\equiv 1 \\pmod{${n}}$。`,
                ),
              ],
              [
                ["Reduce the exponent", "化简指数"],
                t(
                  `$${e} = ${f} \\cdot ${(e - r) / f} + ${r}$, so $${a}^{${e}} \\equiv ${powTex(a, r)}$.`,
                  `$${e} = ${f} \\cdot ${(e - r) / f} + ${r}$，所以 $${a}^{${e}} \\equiv ${powTex(a, r)}$。`,
                ),
              ],
              [
                ["Work out the small power", "算出小次幂"],
                t(`${work.en} So the remainder is $${value}$.`, `${work.zh}所以余数是 $${value}$。`),
              ],
            ],
            inverseCheck(a, r, f, n, EULER),
          ),
        });
      },
    },
    {
      id: "last-digits-of-powers",
      title: t("Last digits of powers", "幂的末位数字"),
      explanation: t(
        "The last two digits of a number are its remainder modulo one hundred, so Euler's theorem with that modulus finds them. The last two digits of $3^{3205}$ are $3^{3205} \\bmod 100$. As $\\varphi(100) = 40$ and $3205 = 40 \\cdot 80 + 5$, $3^{3205} \\equiv 3^5 = 243 \\equiv 43 \\pmod{100}$, so they are $43$.\n\n> **Watch out.** Reduce the exponent modulo $\\varphi(100) = 40$, or $\\varphi(10) = 4$ for the last digit alone, not modulo $100$ or $10$; this needs the base to be coprime to $10$.",
        "一个数的最后两位就是它模 100 的余数，所以用以 100 为模的欧拉定理就能求出它们。$3^{3205}$ 的末两位就是 $3^{3205} \\bmod 100$。因为 $\\varphi(100) = 40$，且 $3205 = 40 \\cdot 80 + 5$，所以 $3^{3205} \\equiv 3^5 = 243 \\equiv 43 \\pmod{100}$，末两位是 $43$。\n\n> **注意。** 指数要对 $\\varphi(100) = 40$ 取模（只求个位时对 $\\varphi(10) = 4$），而不是对 $100$ 或 $10$；这要求底数与 $10$ 互质。",
      ),
      generate(rng) {
        const two = rng.bool();
        const n = two ? 100 : 10;
        const f = phi(n);
        const a = rng.pick([3, 7, 9, 13, 17, 19, 23, 27, 29, 33, 37, ...(two ? [11, 21, 31] : [])]);
        const e = rng.int(100, 3000);
        const value = modPow(a, e, n);
        const r = e % f;
        const work = r === 0 ? { en: "", zh: "" } : smallPower(a, r, n);
        const cycle = range(1, 4).map((i) => modPow(a, i, 10));
        const R = ((e - 1) % 4) + 1;
        return numberProblem({
          prompt: two
            ? t(`Find the number formed by the last two digits of $${a}^{${e}}$.`, `求 $${a}^{${e}}$ 的末两位所组成的数。`)
            : t(`Find the last digit of $${a}^{${e}}$.`, `求 $${a}^{${e}}$ 的个位数字。`),
          answer: value,
          mistakes: distinct(value, [
            why(
              modPow(a, e % n, n),
              `This reduces the exponent modulo $${n}$ instead of $\\varphi(${n}) = ${f}$.`,
              `这把指数对 $${n}$ 取模，而不是对 $\\varphi(${n}) = ${f}$。`,
            ),
            why(
              modPow(a, r + 1, n),
              `This keeps one factor $${a}$ too many: the exponent left over is $${r}$, not $${r + 1}$.`,
              `这多留了一个因数 $${a}$：剩下的指数是 $${r}$，不是 $${r + 1}$。`,
            ),
            why(
              a % n,
              two
                ? "These are the last two digits of the base itself; raising it to a power changes them."
                : "This is the last digit of the base itself; raising it to a power changes it.",
              two ? "这是底数本身的末两位；升幂后它们会改变。" : "这是底数本身的个位；升幂后它会改变。",
            ),
            why(
              1,
              `This takes the power to be $1$ modulo $${n}$, but $${e}$ is not a multiple of $${f}$.`,
              `这把幂当作模 $${n}$ 余 $1$，但 $${e}$ 不是 $${f}$ 的倍数。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Choose the modulus", "确定模"],
                two
                  ? t(
                      "The last two digits are the remainder modulo $100$, and $\\varphi(100) = 40$.",
                      "末两位就是模 $100$ 的余数，而 $\\varphi(100) = 40$。",
                    )
                  : t(
                      "The last digit is the remainder modulo $10$, and $\\varphi(10) = 4$.",
                      "个位就是模 $10$ 的余数，而 $\\varphi(10) = 4$。",
                    ),
              ],
              [
                ["Reduce the exponent", "化简指数"],
                r === 0
                  ? t(
                      `$${e} = ${f} \\cdot ${e / f}$, so $${a}^{${e}} = (${a}^{${f}})^{${e / f}} \\equiv 1 \\pmod{${n}}$.`,
                      `$${e} = ${f} \\cdot ${e / f}$，所以 $${a}^{${e}} = (${a}^{${f}})^{${e / f}} \\equiv 1 \\pmod{${n}}$。`,
                    )
                  : t(
                      `$${e} = ${f} \\cdot ${(e - r) / f} + ${r}$, so $${a}^{${e}} \\equiv ${powTex(a, r)} \\pmod{${n}}$.`,
                      `$${e} = ${f} \\cdot ${(e - r) / f} + ${r}$，所以 $${a}^{${e}} \\equiv ${powTex(a, r)} \\pmod{${n}}$。`,
                    ),
              ],
              [
                ["Work out the small power", "算出小次幂"],
                r === 0
                  ? t(`The remainder is $${value}$.`, `余数是 $${value}$。`)
                  : t(`${work.en} So the answer is $${value}$.`, `${work.zh}所以答案是 $${value}$。`),
              ],
            ],
            t(
              `The last digits of $${a}, ${a}^{2}, ${a}^{3}, ${a}^{4}$ are $${cycle.join(", ")}$ and repeat every $4$ powers; $${e} = 4 \\cdot ${(e - R) / 4} + ${R}$ picks entry $${R}$, ${two ? `which is $${value % 10}$, the last digit of $${value}$` : `which is $${value}$`}.`,
              `$${a}, ${a}^{2}, ${a}^{3}, ${a}^{4}$ 的个位是 $${cycle.join(", ")}$，每 $4$ 次幂循环一次；$${e} = 4 \\cdot ${(e - R) / 4} + ${R}$ 对应第 $${R}$ 项，${two ? `即 $${value % 10}$，正是 $${value}$ 的个位` : `即 $${value}$`}。`,
            ),
          ),
        });
      },
    },
  ],
};

/** WORDS are plaintext words for ciphers. */
const WORDS = [
  "MATH",
  "CODE",
  "PRIME",
  "SECRET",
  "CIPHER",
  "LOGIC",
  "GRAPH",
  "PROOF",
  "NUMBER",
  "MODULO",
  "KEY",
  "ATTACK",
  "DAWN",
  "RIVER",
  "BRIDGE",
  "SIGNAL",
  "PUZZLE",
  "ZEBRA",
  "QUIET",
  "WINTER",
];

/** shift applies a Caesar shift to an uppercase word. */
const shift = (w: string, k: number) =>
  w
    .split("")
    .map((c) => String.fromCharCode(65 + ((((c.charCodeAt(0) - 65 + k) % 26) + 26) % 26)))
    .join("");

/** wordText writes a word as an option. */
const wordText = (w: string) => t(`$\\mathrm{${w}}$`, `$\\mathrm{${w}}$`);

/** CODING explains the numbering of letters. */
const CODING = t(
  "Number the letters $\\mathrm{A} = 0, \\mathrm{B} = 1, \\dots, \\mathrm{Z} = 25$.",
  "把字母编号为 $\\mathrm{A} = 0, \\mathrm{B} = 1, \\dots, \\mathrm{Z} = 25$。",
);

/** letter names the letter numbered x. */
const letter = (x: number) => String.fromCharCode(65 + x);

/** cong writes v ≡ r, or just v when they are the same number. */
const cong = (v: number, r: number) => (v === r ? `${v}` : `${v} \\equiv ${r}`);

/** shiftWork shows each letter of a word moved by k places: "$\mathrm{Y} = 24 \mapsto 24 + 3 = 27 \equiv 1 = \mathrm{B}$". */
const shiftWork = (w: string, k: number, zh: boolean) =>
  w
    .split("")
    .map((c) => {
      const x = c.charCodeAt(0) - 65;
      const r = (((x + k) % 26) + 26) % 26;
      return `$\\mathrm{${c}} = ${x} \\mapsto ${x} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${cong(x + k, r)} = \\mathrm{${letter(r)}}$`;
    })
    .join(zh ? "，" : ", ");

/** introductionToCryptography encrypts with shift ciphers. */
export const introductionToCryptography: TopicDef = {
  id: "introduction-to-cryptography",
  title: t("Introduction to Cryptography", "密码学入门"),
  summary: t(
    "A cipher turns plaintext into ciphertext with a key. The shift (Caesar) cipher numbers the letters 0–25 and encrypts x as x + k mod 26; decryption subtracts k.",
    "密码用密钥把明文变成密文。移位（凯撒）密码把字母编号为 0–25，把 x 加密为 x + k mod 26；解密时减去 k。",
  ),
  intro: t(
    "With the key $k = 13$, each letter moves $13$ places forward: $\\mathrm{H} = 7 \\mapsto 20 = \\mathrm{U}$, $\\mathrm{E} = 4 \\mapsto 17 = \\mathrm{R}$, $\\mathrm{L} = 11 \\mapsto 24 = \\mathrm{Y}$ and $\\mathrm{O} = 14 \\mapsto 27 \\equiv 1 = \\mathrm{B}$, so $\\mathrm{HELLO}$ becomes $\\mathrm{URYYB}$.\n\nCheck: shifting $\\mathrm{URYYB}$ back by $13$ gives $\\mathrm{HELLO}$ again; for this key, encrypting twice shifts by $26 \\equiv 0$ and changes nothing.\n\nIn this lesson we encrypt and decrypt with shift ciphers, and decrypt single letters of an affine cipher.",
    "密钥 $k = 13$ 时，每个字母向后移 $13$ 位：$\\mathrm{H} = 7 \\mapsto 20 = \\mathrm{U}$，$\\mathrm{E} = 4 \\mapsto 17 = \\mathrm{R}$，$\\mathrm{L} = 11 \\mapsto 24 = \\mathrm{Y}$，$\\mathrm{O} = 14 \\mapsto 27 \\equiv 1 = \\mathrm{B}$，所以 $\\mathrm{HELLO}$ 变成 $\\mathrm{URYYB}$。\n\n检验：把 $\\mathrm{URYYB}$ 向回移 $13$ 位又得到 $\\mathrm{HELLO}$；对这个密钥，加密两次相当于移动 $26 \\equiv 0$ 位，什么也不变。\n\n本课我们用移位密码加密和解密，并解密仿射密码的单个字母。",
  ),
  prerequisites: ["modular-congruence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "encrypting-with-a-shift-cipher",
      title: t("Encrypting with a shift cipher", "用移位密码加密"),
      explanation: t(
        "A shift cipher replaces each letter by the one a fixed number of places later, wrapping from the end of the alphabet back to the start. With key $k = 3$: $\\mathrm{X} = 23 \\mapsto 26 \\equiv 0 = \\mathrm{A}$, wrapping around the alphabet. So $\\mathrm{XYZ}$ becomes $\\mathrm{ABC}$.\n\n> **Watch out.** Encryption shifts forward, adding $k$; a sum of $26$ or more wraps around to the start, so subtract $26$.",
        "移位密码把每个字母换成其后固定位数的字母，到字母表末尾时再回到开头。密钥 $k = 3$ 时：$\\mathrm{X} = 23 \\mapsto 26 \\equiv 0 = \\mathrm{A}$，在字母表末尾绕回开头。所以 $\\mathrm{XYZ}$ 变成 $\\mathrm{ABC}$。\n\n> **注意。** 加密是向后移，加上 $k$；和达到 $26$ 或更多时要绕回开头，即减去 $26$。",
      ),
      generate(rng) {
        const w = rng.pick(WORDS);
        const k = rng.int(2, 24);
        const c = shift(w, k);
        const y0 = c.charCodeAt(0) - 65;
        const x0 = w.charCodeAt(0) - 65;
        return explainedChoice(rng, {
          prompt: t(
            `${CODING.en} Encrypt $\\mathrm{${w}}$ with the shift cipher $x \\mapsto x + ${k} \\bmod 26$.`,
            `${CODING["zh-CN"]}用移位密码 $x \\mapsto x + ${k} \\bmod 26$ 加密 $\\mathrm{${w}}$。`,
          ),
          correct: wordText(c),
          wrong: firstThree(wordText(c), [
            {
              option: wordText(shift(w, -k)),
              why: t(`This shifts back by $${k}$, which decrypts instead of encrypting.`, `这是向回移 $${k}$ 位，那是解密而不是加密。`),
            },
            {
              option: wordText(shift(w, k + 1)),
              why: t(`This shifts by $${k + 1}$, one place too far.`, `这移了 $${k + 1}$ 位，多移了一位。`),
            },
            {
              option: wordText(shift(w, k - 1)),
              why: t(`This shifts by $${k - 1}$, one place short.`, `这移了 $${k - 1}$ 位，少移了一位。`),
            },
          ]),
          solution: walked(
            [
              [[`Add $${k}$ to each letter`, `每个字母加 $${k}$`], t(`${shiftWork(w, k, false)}.`, `${shiftWork(w, k, true)}。`)],
              [
                ["Read off the ciphertext", "读出密文"],
                t(`$\\mathrm{${w}} \\mapsto \\mathrm{${c}}$.`, `$\\mathrm{${w}} \\mapsto \\mathrm{${c}}$。`),
              ],
            ],
            t(
              `Shifting back undoes it: the first letter $\\mathrm{${c[0]}} = ${y0}$ gives $${y0} - ${k} = ${cong(y0 - k, x0)} = \\mathrm{${w[0]}}$.`,
              `向回移就能还原：第一个字母 $\\mathrm{${c[0]}} = ${y0}$ 给出 $${y0} - ${k} = ${cong(y0 - k, x0)} = \\mathrm{${w[0]}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "decrypting-a-shift-cipher",
      title: t("Decrypting a shift cipher", "解密移位密码"),
      explanation: t(
        "Decryption undoes the shift by moving back the same number of places, again wrapping around the alphabet. Decryption subtracts the key: with $k = 5$, $\\mathrm{F} = 5 \\mapsto 0 = \\mathrm{A}$ and $\\mathrm{C} = 2 \\mapsto -3 \\equiv 23 = \\mathrm{X}$.\n\n> **Watch out.** Decryption subtracts the key; adding it again shifts twice as far. A negative difference wraps around: add $26$.",
        "解密时向回移动同样的位数来撤销移位，同样要在字母表上绕回。解密时减去密钥：$k = 5$ 时，$\\mathrm{F} = 5 \\mapsto 0 = \\mathrm{A}$，$\\mathrm{C} = 2 \\mapsto -3 \\equiv 23 = \\mathrm{X}$。\n\n> **注意。** 解密是减去密钥；再加一次密钥会移两倍的距离。差为负数时要绕回：加上 $26$。",
      ),
      generate(rng) {
        const w = rng.pick(WORDS);
        const k = rng.int(2, 24);
        const c = shift(w, k);
        const x0 = w.charCodeAt(0) - 65;
        const y0 = c.charCodeAt(0) - 65;
        return explainedChoice(rng, {
          prompt: t(
            `${CODING.en} The ciphertext $\\mathrm{${c}}$ was made with the shift cipher $x \\mapsto x + ${k} \\bmod 26$. Decrypt it.`,
            `${CODING["zh-CN"]}密文 $\\mathrm{${c}}$ 由移位密码 $x \\mapsto x + ${k} \\bmod 26$ 得到。请解密。`,
          ),
          correct: wordText(w),
          wrong: firstThree(wordText(w), [
            {
              option: wordText(shift(c, k)),
              why: t(`This shifts forward by $${k}$ again instead of back.`, `这是再向后移 $${k}$ 位，而不是向回移。`),
            },
            {
              option: wordText(shift(w, 1)),
              why: t(`This shifts back by only $${k - 1}$, one place short.`, `这只向回移了 $${k - 1}$ 位，少移了一位。`),
            },
            {
              option: wordText(shift(w, -1)),
              why: t(`This shifts back by $${k + 1}$, one place too far.`, `这向回移了 $${k + 1}$ 位，多移了一位。`),
            },
          ]),
          solution: walked(
            [
              [[`Subtract $${k}$ from each letter`, `每个字母减 $${k}$`], t(`${shiftWork(c, -k, false)}.`, `${shiftWork(c, -k, true)}。`)],
              [
                ["Read off the plaintext", "读出明文"],
                t(`$\\mathrm{${c}} \\mapsto \\mathrm{${w}}$.`, `$\\mathrm{${c}} \\mapsto \\mathrm{${w}}$。`),
              ],
            ],
            t(
              `Encrypting again gives the ciphertext back: $\\mathrm{${w[0]}} = ${x0}$ gives $${x0} + ${k} = ${cong(x0 + k, y0)} = \\mathrm{${c[0]}}$.`,
              `再加密一次就回到密文：$\\mathrm{${w[0]}} = ${x0}$ 给出 $${x0} + ${k} = ${cong(x0 + k, y0)} = \\mathrm{${c[0]}}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** UNITS26 are the multipliers coprime to 26. */
const UNITS26 = [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25] as const;

/** SYMBOLS29 describes the alphabet of 29 symbols used in the examples of linear ciphers. */
const SYMBOLS29 = t(
  "the $29$ symbols $\\mathrm{A}$ to $\\mathrm{Z}$, a space, a full stop and a question mark, numbered $0$ to $28$",
  "$29$ 个符号 $\\mathrm{A}$ 到 $\\mathrm{Z}$、空格、句号和问号，编号为 $0$ 到 $28$",
);

/** theLinearCipher encrypts x as ax + b mod 26. */
export const theLinearCipher: TopicDef = {
  id: "the-linear-cipher",
  title: t("The Linear Cipher", "线性密码"),
  summary: t(
    "The linear (affine) cipher encrypts x as y = ax + b mod 26 with gcd(a, 26) = 1; it decrypts with x = a⁻¹(y − b) mod 26.",
    "线性（仿射）密码把 x 加密为 y = ax + b mod 26，其中 gcd(a, 26) = 1；解密公式为 x = a⁻¹(y − b) mod 26。",
  ),
  intro: t(
    `On ${SYMBOLS29.en}, the linear cipher $y = 4x + 9 \\bmod 29$ sends $\\mathrm{H} = 7$ to $37 \\equiv 8 = \\mathrm{I}$ and $\\mathrm{I} = 8$ to $41 \\equiv 12 = \\mathrm{M}$, so $\\mathrm{HI}$ becomes $\\mathrm{IM}$.\n\nCheck: $4^{-1} \\equiv 22 \\pmod{29}$, since $4 \\cdot 22 = 88 = 3 \\cdot 29 + 1$, and decrypting with $x = 22(y - 9)$ gives $22 \\cdot (-1) = -22 \\equiv 7 = \\mathrm{H}$ and $22 \\cdot 3 = 66 \\equiv 8 = \\mathrm{I}$.\n\nIn this lesson we encrypt and decrypt with linear ciphers $y = ax + b$, and count their keys.`,
    `在${SYMBOLS29["zh-CN"]}上，线性密码 $y = 4x + 9 \\bmod 29$ 把 $\\mathrm{H} = 7$ 变成 $37 \\equiv 8 = \\mathrm{I}$，把 $\\mathrm{I} = 8$ 变成 $41 \\equiv 12 = \\mathrm{M}$，所以 $\\mathrm{HI}$ 变成 $\\mathrm{IM}$。\n\n检验：因为 $4 \\cdot 22 = 88 = 3 \\cdot 29 + 1$，所以 $4^{-1} \\equiv 22 \\pmod{29}$，用 $x = 22(y - 9)$ 解密得 $22 \\cdot (-1) = -22 \\equiv 7 = \\mathrm{H}$ 和 $22 \\cdot 3 = 66 \\equiv 8 = \\mathrm{I}$。\n\n本课我们用线性密码 $y = ax + b$ 加密和解密，并数出它的密钥个数。`,
  ),
  prerequisites: ["introduction-to-cryptography", "multiplicative-inverses-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "encrypting-with-a-linear-cipher",
      title: t("Encrypting", "加密"),
      explanation: t(
        `A linear cipher multiplies the letter's number by a key $a$, adds a key $b$ and reduces modulo the number of symbols. On ${SYMBOLS29.en}, the cipher $y = 6x + 11 \\bmod 29$ sends $\\mathrm{T} = 19$ to $6 \\cdot 19 + 11 = 125 = 4 \\cdot 29 + 9$, that is, to $9 = \\mathrm{J}$.\n\n> **Watch out.** Multiply first and then add $b$, reducing at the end; $a(x + b)$ is a different cipher.`,
        `线性密码把字母的编号乘以密钥 $a$，加上密钥 $b$，再对符号个数取模。在${SYMBOLS29["zh-CN"]}上，密码 $y = 6x + 11 \\bmod 29$ 把 $\\mathrm{T} = 19$ 变成 $6 \\cdot 19 + 11 = 125 = 4 \\cdot 29 + 9$，即 $9 = \\mathrm{J}$。\n\n> **注意。** 先乘再加 $b$，最后取模；$a(x + b)$ 是另一种密码。`,
      ),
      generate(rng) {
        const a = rng.pick(UNITS26);
        const b = rng.int(1, 25);
        const x = rng.int(0, 25);
        const y = (a * x + b) % 26;
        const inv = inverseMod(a, 26);
        const raw = a * x + b;
        return numberProblem({
          prompt: t(
            `${CODING.en} The linear cipher $y = ${a}x + ${b} \\bmod 26$ encrypts the letter $\\mathrm{${letter(x)}}$. Find the number $y$ of the ciphertext letter.`,
            `${CODING["zh-CN"]}线性密码 $y = ${a}x + ${b} \\bmod 26$ 加密字母 $\\mathrm{${letter(x)}}$。求密文字母的编号 $y$。`,
          ),
          answer: y,
          mistakes: distinct(y, [
            why((a * x) % 26, `This forgets to add $${b}$.`, `这忘了加 $${b}$。`),
            why(
              (a * (x + b)) % 26,
              `This adds $${b}$ before multiplying, which computes $${a}(x + ${b})$.`,
              `这在乘之前先加了 $${b}$，算的是 $${a}(x + ${b})$。`,
            ),
            why(raw, "This forgets to reduce modulo $26$.", "这忘了对 $26$ 取模。"),
            why((b * x + a) % 26, "This swaps the roles of $a$ and $b$.", "这把 $a$ 和 $b$ 的作用弄反了。"),
          ]),
          solution: walked(
            [
              [["Number the letter", "写出字母编号"], t(`$\\mathrm{${letter(x)}} = ${x}$.`, `$\\mathrm{${letter(x)}} = ${x}$。`)],
              [["Multiply and add", "先乘后加"], t(`$${a} \\cdot ${x} + ${b} = ${raw}$.`, `$${a} \\cdot ${x} + ${b} = ${raw}$。`)],
              [
                ["Reduce modulo $26$", "对 $26$ 取模"],
                raw < 26
                  ? t(
                      `$${raw}$ is already below $26$, so $y = ${y}$, the letter $\\mathrm{${letter(y)}}$.`,
                      `$${raw}$ 已经小于 $26$，所以 $y = ${y}$，即字母 $\\mathrm{${letter(y)}}$。`,
                    )
                  : t(
                      `$${raw} = ${times(26, Math.floor(raw / 26))} + ${y}$, so $y = ${y}$, the letter $\\mathrm{${letter(y)}}$.`,
                      `$${raw} = ${times(26, Math.floor(raw / 26))} + ${y}$，所以 $y = ${y}$，即字母 $\\mathrm{${letter(y)}}$。`,
                    ),
              ],
            ],
            t(
              `Decrypting gives the letter back: $${a}^{-1} \\equiv ${inv} \\pmod{26}$, and $${inv}(${y} - ${b}) = ${cong(inv * (y - b), x)} \\pmod{26}$.`,
              `解密可以还原字母：$${a}^{-1} \\equiv ${inv} \\pmod{26}$，且 $${inv}(${y} - ${b}) = ${cong(inv * (y - b), x)} \\pmod{26}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "decrypting-a-linear-cipher",
      title: t("Decrypting", "解密"),
      explanation: t(
        `To decrypt, subtract the added key and multiply by the inverse of the multiplier, which exists only if the multiplier is coprime to the number of symbols. On ${SYMBOLS29.en}, undo $y = 6x + 11 \\bmod 29$: $6^{-1} \\equiv 5$, since $6 \\cdot 5 = 30 = 29 + 1$, so $x = 5(y - 11) \\bmod 29$, and $\\mathrm{J} = 9$ gives $5 \\cdot (-2) = -10 \\equiv 19 = \\mathrm{T}$.\n\n> **Watch out.** Subtract $b$ first and then multiply by $a^{-1}$: the other order undoes the steps the wrong way round. And $a^{-1}$ is an inverse modulo the number of symbols, not the fraction $\\frac{1}{a}$.`,
        `解密时先减去加上的密钥，再乘以乘数的逆元，只有乘数与符号个数互素时逆元才存在。在${SYMBOLS29["zh-CN"]}上撤销 $y = 6x + 11 \\bmod 29$：因为 $6 \\cdot 5 = 30 = 29 + 1$，所以 $6^{-1} \\equiv 5$，于是 $x = 5(y - 11) \\bmod 29$，$\\mathrm{J} = 9$ 给出 $5 \\cdot (-2) = -10 \\equiv 19 = \\mathrm{T}$。\n\n> **注意。** 先减 $b$ 再乘 $a^{-1}$：反过来做就把步骤的顺序弄反了。$a^{-1}$ 是模符号个数的逆元，不是分数 $\\frac{1}{a}$。`,
      ),
      generate(rng) {
        const a = rng.pick(UNITS26);
        const b = rng.int(1, 25);
        const x = rng.int(0, 25);
        const y = (a * x + b) % 26;
        const inv = inverseMod(a, 26);
        return numberProblem({
          prompt: t(
            `${CODING.en} A message was encrypted with $y = ${a}x + ${b} \\bmod 26$. Decrypt the ciphertext letter $\\mathrm{${letter(y)}}$: find the number $x$ of the plaintext letter.`,
            `${CODING["zh-CN"]}一条消息用 $y = ${a}x + ${b} \\bmod 26$ 加密。解密密文字母 $\\mathrm{${letter(y)}}$：求明文字母的编号 $x$。`,
          ),
          answer: x,
          mistakes: distinct(x, [
            why(
              ((((y - b) * a) % 26) + 26) % 26,
              `This multiplies by $${a}$ instead of by its inverse $${inv}$.`,
              `这乘的是 $${a}$，而不是它的逆元 $${inv}$。`,
            ),
            why(
              (inv * y - b + 26 * 26) % 26,
              `This multiplies by $${inv}$ before subtracting $${b}$, undoing the steps in the wrong order.`,
              `这在减 $${b}$ 之前先乘了 $${inv}$，把撤销步骤的顺序弄反了。`,
            ),
            why((inv * (y + b)) % 26, `This adds $${b}$ instead of subtracting it.`, `这是加上 $${b}$，而不是减去它。`),
            why((a * y + b) % 26, "This encrypts the ciphertext again instead of decrypting it.", "这是把密文再加密一次，而不是解密。"),
          ]),
          solution: walked(
            [
              [
                [`Find the inverse of $${a}$`, `求 $${a}$ 的逆元`],
                t(
                  `$${a} \\cdot ${inv} = ${a * inv} = ${times(26, (a * inv - 1) / 26)} + 1$, so $${a}^{-1} \\equiv ${inv} \\pmod{26}$.`,
                  `$${a} \\cdot ${inv} = ${a * inv} = ${times(26, (a * inv - 1) / 26)} + 1$，所以 $${a}^{-1} \\equiv ${inv} \\pmod{26}$。`,
                ),
              ],
              [
                ["Subtract, then multiply", "先减后乘"],
                t(
                  `$\\mathrm{${letter(y)}} = ${y}$, so $x = ${inv}(${y} - ${b}) = ${cong(inv * (y - b), x)} \\pmod{26}$, the letter $\\mathrm{${letter(x)}}$.`,
                  `$\\mathrm{${letter(y)}} = ${y}$，所以 $x = ${inv}(${y} - ${b}) = ${cong(inv * (y - b), x)} \\pmod{26}$，即字母 $\\mathrm{${letter(x)}}$。`,
                ),
              ],
            ],
            t(
              `Encrypting $x = ${x}$ gives $${a} \\cdot ${x} + ${b} = ${cong(a * x + b, y)} \\pmod{26}$, the ciphertext letter again.`,
              `加密 $x = ${x}$ 得 $${a} \\cdot ${x} + ${b} = ${cong(a * x + b, y)} \\pmod{26}$，又是密文字母。`,
            ),
          ),
        });
      },
    },
  ],
};

/** primitiveRoot finds the smallest generator modulo a prime p. */
const primitiveRoot = (p: number) => range(2, p - 1).find((g) => factorize(p - 1).every(([q]) => modPow(g, (p - 1) / q, p) !== 1))!;

/** DH_PRIMES are primes for Diffie–Hellman exercises. */
const DH_PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97] as const;

/** squaringWork shows g^e mod p by repeated squaring: the powers, then the product of those that make up e. */
function squaringWork(g: number, e: number, p: number): { en: string; zh: string } {
  const rows: string[] = [];
  const parts: number[] = [];
  const values: number[] = [];
  let current = g % p;
  for (let b = 1; b <= e; b *= 2) {
    rows.push(`${g}${b === 1 ? "" : `^{${b}}`} \\equiv ${current}`);
    if (Math.floor(e / b) % 2 === 1) {
      parts.push(b);
      values.push(current);
    }
    current = (current * current) % p;
  }
  const table = `$${rows.join(", \\; ")} \\pmod{${p}}$`;
  if (values.length === 1) return { en: `Repeated squaring gives ${table}.`, zh: `反复平方得 ${table}。` };
  const sum = parts.join(" + ");
  const kept = values.filter((v) => v !== 1);
  const product = kept.length > 1 ? `$${kept.join(" \\cdot ")} \\equiv ${modPow(g, e, p)}$` : `$${kept.length === 1 ? kept[0] : 1}$`;
  return {
    en: `Repeated squaring gives ${table}. Since $${e} = ${sum}$, the result is ${product}.`,
    zh: `反复平方得 ${table}。因为 $${e} = ${sum}$，结果为 ${product}。`,
  };
}

/** theDiffieHellmanProtocol agrees on a shared key over an open channel. */
export const theDiffieHellmanProtocol: TopicDef = {
  id: "the-diffie-hellman-protocol",
  title: t("The Diffie–Hellman Protocol", "迪菲–赫尔曼协议"),
  summary: t(
    "Alice and Bob publicly fix a prime p and a base g. Alice picks a secret a and sends A = gᵃ mod p; Bob picks b and sends B = gᵇ mod p. Both then compute the shared key Bᵃ ≡ Aᵇ ≡ gᵃᵇ (mod p).",
    "爱丽丝和鲍勃公开约定质数 p 和底数 g。爱丽丝选秘密数 a 并发送 A = gᵃ mod p；鲍勃选 b 并发送 B = gᵇ mod p。然后双方都能算出共享密钥 Bᵃ ≡ Aᵇ ≡ gᵃᵇ (mod p)。",
  ),
  intro: t(
    "With the public prime $p = 101$ and base $g = 2$, Alice keeps $a = 3$ and sends $A = 2^3 = 8$; Bob keeps $b = 5$ and sends $B = 2^5 = 32$. Alice computes $B^a = 32^3 = 32768 = 324 \\cdot 101 + 44$, so the key is $44$.\n\nCheck: Bob computes $A^b = 8^5 = 32768$ as well, since both are $2^{15}$, and gets the same key $44$.\n\nIn this lesson we compute public values and shared keys in the Diffie–Hellman protocol, and see how a small prime lets an eavesdropper find a private exponent by search.",
    "公开的质数 $p = 101$，底数 $g = 2$，爱丽丝保留 $a = 3$ 并发送 $A = 2^3 = 8$；鲍勃保留 $b = 5$ 并发送 $B = 2^5 = 32$。爱丽丝计算 $B^a = 32^3 = 32768 = 324 \\cdot 101 + 44$，所以密钥是 $44$。\n\n检验：鲍勃计算 $A^b = 8^5$，同样是 $32768$，因为两者都是 $2^{15}$，所以得到同一个密钥 $44$。\n\n本课我们计算迪菲–赫尔曼协议中的公开值和共享密钥，并看到质数很小时窃听者如何通过搜索找出私有指数。",
  ),
  prerequisites: ["introduction-to-cryptography", "fermats-little-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-a-public-value",
      title: t("Public values", "公开值"),
      explanation: t(
        "Each party raises the shared base to a secret power modulo the prime, and repeated squaring keeps the numbers small. With $p = 101$, $g = 2$ and Alice's secret $a = 12$: square repeatedly, $2^4 = 16$ and $2^8 = 256 \\equiv 54$, then $2^{12} = 2^8 \\cdot 2^4 \\equiv 54 \\cdot 16 = 864 \\equiv 56$. Alice sends $A = 56$.\n\n> **Watch out.** The public value is the power $g^a \\bmod p$, not the product $ga$; and reduce after each squaring so that the numbers stay small.",
        "每一方都把公共底数模素数地升到一个秘密的幂，反复平方能让数字保持很小。取 $p = 101$，$g = 2$，爱丽丝的秘密数 $a = 12$：反复平方，$2^4 = 16$，$2^8 = 256 \\equiv 54$，于是 $2^{12} = 2^8 \\cdot 2^4 \\equiv 54 \\cdot 16 = 864 \\equiv 56$。爱丽丝发送 $A = 56$。\n\n> **注意。** 公开值是幂 $g^a \\bmod p$，不是乘积 $ga$；每次平方后都要取模，让数字保持很小。",
      ),
      generate(rng) {
        const p = rng.pick(DH_PRIMES);
        const g = primitiveRoot(p);
        const a = rng.int(3, p - 2);
        const value = modPow(g, a, p);
        const work = squaringWork(g, a, p);
        return numberProblem({
          prompt: t(
            `In Diffie–Hellman with $p = ${p}$ and $g = ${g}$, Alice's secret is $a = ${a}$. What value $A$ does she send?`,
            `在迪菲–赫尔曼协议中，$p = ${p}$，$g = ${g}$，爱丽丝的秘密数为 $a = ${a}$。她发送的值 $A$ 是多少？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              (g * a) % p,
              `This multiplies $${g}$ by $${a}$ instead of raising $${g}$ to the power $${a}$.`,
              `这是把 $${g}$ 乘以 $${a}$，而不是求 $${g}$ 的 $${a}$ 次幂。`,
            ),
            why(
              modPow(a, g, p),
              `This raises $${a}$ to the power $${g}$, swapping the base and the exponent.`,
              `这是求 $${a}$ 的 $${g}$ 次幂，把底数和指数弄反了。`,
            ),
            why(
              modPow(g, a - 1, p),
              `This has one factor $${g}$ too few: it is $${g}^{${a - 1}}$.`,
              `这少乘了一个因数 $${g}$：它是 $${g}^{${a - 1}}$。`,
            ),
            why(
              modPow(g, a + 1, p),
              `This has one factor $${g}$ too many: it is $${g}^{${a + 1}}$.`,
              `这多乘了一个因数 $${g}$：它是 $${g}^{${a + 1}}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Set up the power", "列出幂"], t(`$A = ${g}^{${a}} \\bmod ${p}$.`, `$A = ${g}^{${a}} \\bmod ${p}$。`)],
              [["Square repeatedly", "反复平方"], t(`${work.en} So $A = ${value}$.`, `${work.zh}所以 $A = ${value}$。`)],
            ],
            t(
              `By Fermat's little theorem $A \\cdot ${powTex(g, p - 1 - a)} \\equiv ${g}^{${p - 1}} \\equiv 1$, and indeed $${value} \\cdot ${modPow(g, p - 1 - a, p)} = ${value * modPow(g, p - 1 - a, p)} \\equiv 1 \\pmod{${p}}$, where $${powTex(g, p - 1 - a)} \\equiv ${modPow(g, p - 1 - a, p)}$.`,
              `由费马小定理 $A \\cdot ${powTex(g, p - 1 - a)} \\equiv ${g}^{${p - 1}} \\equiv 1$，确实 $${value} \\cdot ${modPow(g, p - 1 - a, p)} = ${value * modPow(g, p - 1 - a, p)} \\equiv 1 \\pmod{${p}}$，其中 $${powTex(g, p - 1 - a)} \\equiv ${modPow(g, p - 1 - a, p)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "computing-the-shared-key",
      title: t("The shared key", "共享密钥"),
      explanation: t(
        "Raising the other party's public value to your own secret power gives the same result for both sides, because exponents multiply. Continuing with $p = 101$, $g = 2$ and $a = 12$: if Bob sends $B = 27$, Alice computes $27^{12} \\bmod 101 = 31$. Bob, from his secret $b = 7$, computes $A^b = 56^7 \\bmod 101$ and gets the same $31$, since both are $2^{84}$.\n\n> **Watch out.** Raise the other party's public value to your own secret: $g^a$ is your own public value, and $g^{a + b}$ adds the exponents where they should multiply.",
        "把对方的公开值升到自己的秘密幂，双方得到相同的结果，因为指数相乘。继续取 $p = 101$，$g = 2$，$a = 12$：若鲍勃发送 $B = 27$，爱丽丝计算 $27^{12} \\bmod 101 = 31$。鲍勃用他的秘密数 $b = 7$ 计算 $A^b = 56^7 \\bmod 101$，也得到 $31$，因为两者都是 $2^{84}$。\n\n> **注意。** 要把对方的公开值升到自己的秘密幂：$g^a$ 是自己的公开值，而 $g^{a + b}$ 把本该相乘的指数相加了。",
      ),
      generate(rng) {
        const p = rng.pick(DH_PRIMES);
        const g = primitiveRoot(p);
        const a = rng.int(3, p - 2);
        const b = rng.int(3, p - 2);
        const B = modPow(g, b, p);
        const value = modPow(B, a, p);
        const work = squaringWork(B, a, p);
        const A = modPow(g, a, p);
        return numberProblem({
          prompt: t(
            `In Diffie–Hellman with $p = ${p}$ and $g = ${g}$, Alice's secret is $a = ${a}$ and Bob sends $B = ${B}$. What is the shared key?`,
            `在迪菲–赫尔曼协议中，$p = ${p}$，$g = ${g}$，爱丽丝的秘密数为 $a = ${a}$，鲍勃发送 $B = ${B}$。共享密钥是多少？`,
          ),
          answer: value,
          mistakes: distinct(value, [
            why(
              A,
              `This is Alice's own public value $A = ${g}^{${a}}$, not the key.`,
              `这是爱丽丝自己的公开值 $A = ${g}^{${a}}$，不是密钥。`,
            ),
            why(
              modPow(g, a + b, p),
              "This adds the exponents; the key is $g^{ab}$, with the exponents multiplied.",
              "这把指数相加了；密钥是 $g^{ab}$，指数要相乘。",
            ),
            why(
              (B * a) % p,
              `This multiplies $${B}$ by $${a}$ instead of raising $${B}$ to the power $${a}$.`,
              `这是把 $${B}$ 乘以 $${a}$，而不是求 $${B}$ 的 $${a}$ 次幂。`,
            ),
            why(
              modPow(a, B, p),
              `This raises $${a}$ to the power $${B}$, swapping the base and the exponent.`,
              `这是求 $${a}$ 的 $${B}$ 次幂，把底数和指数弄反了。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Set up the power", "列出幂"],
                t(
                  `Alice computes $B^a = ${B}^{${a}} \\bmod ${p}$, which equals $g^{ab}$.`,
                  `爱丽丝计算 $B^a = ${B}^{${a}} \\bmod ${p}$，它等于 $g^{ab}$。`,
                ),
              ],
              [["Square repeatedly", "反复平方"], t(`${work.en} So the key is $${value}$.`, `${work.zh}所以密钥是 $${value}$。`)],
            ],
            t(
              `Bob's secret here is $b = ${b}$; he receives $A = ${g}^{${a}} \\equiv ${A}$ and computes $${A}^{${b}} \\equiv ${modPow(A, b, p)} \\pmod{${p}}$, the same key.`,
              `这里鲍勃的秘密数是 $b = ${b}$；他收到 $A = ${g}^{${a}} \\equiv ${A}$，计算 $${A}^{${b}} \\equiv ${modPow(A, b, p)} \\pmod{${p}}$，是同一个密钥。`,
            ),
          ),
        });
      },
    },
  ],
};

/** RSA_PRIMES are small primes for RSA exercises. */
const RSA_PRIMES = [5, 7, 11, 13, 17, 19, 23, 29] as const;

/** rsaKeys picks p ≠ q and a public exponent e with gcd(e, φ) = 1, e ≠ d, and e not fixing every message. */
function rsaKeys(rng: Rng) {
  for (;;) {
    const [p, q] = rng.sample([...RSA_PRIMES], 2) as [number, number];
    const f = (p - 1) * (q - 1);
    // e ≡ 1 modulo lcm(p − 1, q − 1) would leave every message unchanged.
    const lambda = f / gcd(p - 1, q - 1);
    const es = range(3, Math.min(f - 1, 40)).filter((e) => gcd(e, f) === 1 && e % lambda !== 1);
    if (es.length === 0) continue;
    const e = rng.pick(es);
    const d = inverseMod(e, f);
    if (d !== e) return { p, q, n: p * q, f, e, d };
  }
}

/** euclidSteps lists the divisions of the Euclidean algorithm on m and e, down to the remainder 1. */
const euclidSteps = (m: number, e: number) => {
  const out: string[] = [];
  let x = m;
  let y = e;
  for (;;) {
    const q = Math.floor(x / y);
    const r = x % y;
    out.push(`$${x} = ${q === 1 ? `${y}` : `${q} \\cdot ${y}`} + ${r}$`);
    if (r <= 1) return out;
    x = y;
    y = r;
  }
};

/** theRsaCryptosystem encrypts with a public key (n, e) and decrypts with a private exponent d. */
export const theRsaCryptosystem: TopicDef = {
  id: "the-rsa-cryptosystem",
  title: t("The RSA Cryptosystem", "RSA 密码系统"),
  summary: t(
    "RSA picks primes p, q, sets n = pq and φ = (p − 1)(q − 1), and publishes (n, e) with gcd(e, φ) = 1. The private exponent is d ≡ e⁻¹ (mod φ). Encryption is c = mᵉ mod n and decryption is m = cᵈ mod n, by Euler's theorem.",
    "RSA 选取质数 p、q，令 n = pq，φ = (p − 1)(q − 1)，并公开 (n, e)，其中 gcd(e, φ) = 1。私钥指数 d ≡ e⁻¹ (mod φ)。加密为 c = mᵉ mod n，解密为 m = cᵈ mod n，其正确性由欧拉定理保证。",
  ),
  intro: t(
    "With $p = 31$ and $q = 37$, $n = 1147$ and $\\varphi = 30 \\cdot 36 = 1080$. The public exponent $e = 7$ is coprime to $1080$, the extended Euclidean algorithm gives the private exponent $d = 463$, and the message $m = 2$ encrypts to $c = 2^7 = 128$.\n\nCheck: $7 \\cdot 463 = 3241 = 3 \\cdot 1080 + 1$, so $d$ is the inverse of $e$ modulo $\\varphi$; and decrypting, $128^{463} = 2^{3241} = 2 \\cdot (2^{1080})^3 \\equiv 2 \\pmod{1147}$ by Euler's theorem.\n\nIn this lesson we find RSA private exponents, encrypt and decrypt with RSA, and see why the totient of the modulus must stay secret.",
    "取 $p = 31$，$q = 37$，则 $n = 1147$，$\\varphi = 30 \\cdot 36 = 1080$。公钥指数 $e = 7$ 与 $1080$ 互质，用扩展欧几里得算法得私钥指数 $d = 463$，消息 $m = 2$ 加密为 $c = 2^7 = 128$。\n\n检验：$7 \\cdot 463 = 3241 = 3 \\cdot 1080 + 1$，所以 $d$ 是 $e$ 模 $\\varphi$ 的逆元；解密时，由欧拉定理 $128^{463} = 2^{3241} = 2 \\cdot (2^{1080})^3 \\equiv 2 \\pmod{1147}$。\n\n本课我们求 RSA 的私钥指数，用 RSA 加密和解密，并看到模数的欧拉函数值为什么必须保密。",
  ),
  prerequisites: ["eulers-theorem", "the-linear-cipher"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-the-private-exponent",
      title: t("The private exponent", "私钥指数"),
      explanation: t(
        "The private exponent is the inverse of the public exponent modulo the totient, found with the extended Euclidean algorithm. With $p = 41$ and $q = 7$: $n = 287$ and $\\varphi = 40 \\cdot 6 = 240$. For $e = 7$, divide: $240 = 34 \\cdot 7 + 2$ and $7 = 3 \\cdot 2 + 1$; working back, $1 = 7 - 3 \\cdot 2 = 103 \\cdot 7 - 3 \\cdot 240$, so $d = 103$.\n\n> **Watch out.** Invert $e$ modulo $\\varphi = (p - 1)(q - 1)$, not modulo $n = pq$; and $d$ is a multiplicative inverse, not $\\varphi - e$ or $\\varphi - d$.",
        "私钥指数是公钥指数模欧拉函数值的逆元，可以用扩展欧几里得算法求出。取 $p = 41$，$q = 7$：$n = 287$，$\\varphi = 40 \\cdot 6 = 240$。对 $e = 7$ 做除法：$240 = 34 \\cdot 7 + 2$，$7 = 3 \\cdot 2 + 1$；往回代，$1 = 7 - 3 \\cdot 2 = 103 \\cdot 7 - 3 \\cdot 240$，所以 $d = 103$。\n\n> **注意。** 要对 $\\varphi = (p - 1)(q - 1)$ 求 $e$ 的逆元，而不是对 $n = pq$；$d$ 是乘法逆元，不是 $\\varphi - e$ 或 $\\varphi - d$。",
      ),
      generate(rng) {
        const { p, q, n, f, e, d } = rsaKeys(rng);
        const k = (e * d - 1) / f;
        return numberProblem({
          prompt: t(
            `An RSA key uses $p = ${p}$, $q = ${q}$ and public exponent $e = ${e}$. Find the private exponent $d$, with $0 < d < ${f}$.`,
            `某 RSA 密钥取 $p = ${p}$，$q = ${q}$，公钥指数 $e = ${e}$。求私钥指数 $d$，要求 $0 < d < ${f}$。`,
          ),
          answer: d,
          mistakes: distinct(d, [
            ...(gcd(e, n) === 1
              ? [
                  why(
                    inverseMod(e, n),
                    `This inverts $${e}$ modulo $n = ${n}$ instead of modulo $\\varphi = ${f}$.`,
                    `这是求 $${e}$ 模 $n = ${n}$ 的逆元，而不是模 $\\varphi = ${f}$。`,
                  ),
                ]
              : []),
            why(
              f - d,
              `This is $\\varphi - d$, the negative of the inverse: $${e}$ times it leaves $${f - 1}$ modulo $${f}$, not $1$.`,
              `这是 $\\varphi - d$，即逆元的相反数：$${e}$ 乘以它模 $${f}$ 余 $${f - 1}$，不是 $1$。`,
            ),
            why(
              d + 1,
              `This is one more than the inverse: $${e}$ times it leaves $${(e * (d + 1)) % f}$ modulo $${f}$, not $1$.`,
              `这比逆元大一：$${e}$ 乘以它模 $${f}$ 余 $${(e * (d + 1)) % f}$，不是 $1$。`,
            ),
            ...((n - 1) % e === 0
              ? [
                  why(
                    (n - 1) / e,
                    `This solves $${e}d = n - 1$, using $n$ in place of $\\varphi$.`,
                    `这是解 $${e}d = n - 1$，用 $n$ 代替了 $\\varphi$。`,
                  ),
                ]
              : [
                  why(
                    d - 1,
                    `This is one less than the inverse: $${e}$ times it leaves $${(((e * (d - 1)) % f) + f) % f}$ modulo $${f}$, not $1$.`,
                    `这比逆元小一：$${e}$ 乘以它模 $${f}$ 余 $${(((e * (d - 1)) % f) + f) % f}$，不是 $1$。`,
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Compute the totient", "计算欧拉函数值"],
                t(`$\\varphi = (${p} - 1)(${q} - 1) = ${f}$.`, `$\\varphi = (${p} - 1)(${q} - 1) = ${f}$。`),
              ],
              [
                [`Invert $${e}$ modulo $${f}$`, `求 $${e}$ 模 $${f}$ 的逆元`],
                t(
                  `The Euclidean algorithm gives ${euclidSteps(f, e).join(", ")}; working back from the remainder $1$ gives $d = ${d}$.`,
                  `欧几里得算法给出 ${euclidSteps(f, e).join("，")}；从余数 $1$ 往回代得 $d = ${d}$。`,
                ),
              ],
            ],
            t(
              `$${e} \\cdot ${d} = ${e * d} = ${times(f, k)} + 1$, so $${e}d \\equiv 1 \\pmod{${f}}$.`,
              `$${e} \\cdot ${d} = ${e * d} = ${times(f, k)} + 1$，所以 $${e}d \\equiv 1 \\pmod{${f}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "encrypting-and-decrypting-with-rsa",
      title: t("Encrypting and decrypting", "加密与解密"),
      explanation: t(
        "Encryption raises the message to the public exponent, and decryption raises the result to the private exponent, which returns the original message. With $n = 287$, $e = 7$ and $d = 103$, the message $m = 3$ encrypts to $3^7 = 2187 = 7 \\cdot 287 + 178$, so $c = 178$, and $178^{103} \\equiv 3 \\pmod{287}$ recovers it.\n\n> **Watch out.** Encrypt with the public exponent $e$ and decrypt with the private exponent $d$; using the same exponent twice undoes nothing. And each step is a power, not a product.",
        "加密把消息升到公钥指数次幂，解密把结果升到私钥指数次幂，从而还原出原来的消息。取 $n = 287$，$e = 7$，$d = 103$：消息 $m = 3$ 加密为 $3^7 = 2187 = 7 \\cdot 287 + 178$，所以 $c = 178$，而 $178^{103} \\equiv 3 \\pmod{287}$ 恢复出原消息。\n\n> **注意。** 用公钥指数 $e$ 加密，用私钥指数 $d$ 解密；同一个指数用两次什么也撤销不了。而且每一步都是求幂，不是相乘。",
      ),
      generate(rng) {
        const { n, e, d } = rsaKeys(rng);
        let m: number;
        do m = rng.int(2, n - 2);
        while (modPow(m, e, n) === m);
        const c = modPow(m, e, n);
        if (rng.bool()) {
          const work = squaringWork(m, e, n);
          return numberProblem({
            prompt: t(
              `Encrypt the message $m = ${m}$ with the RSA public key $(n, e) = (${n}, ${e})$.`,
              `用 RSA 公钥 $(n, e) = (${n}, ${e})$ 加密消息 $m = ${m}$。`,
            ),
            answer: c,
            mistakes: distinct(c, [
              why(
                modPow(m, d, n),
                `This uses the private exponent $${d}$; encryption uses the public exponent $${e}$.`,
                `这用了私钥指数 $${d}$；加密要用公钥指数 $${e}$。`,
              ),
              why(
                (m * e) % n,
                `This multiplies $${m}$ by $${e}$ instead of raising it to the power $${e}$.`,
                `这是把 $${m}$ 乘以 $${e}$，而不是求它的 $${e}$ 次幂。`,
              ),
              why(
                modPow(e, m, n),
                `This raises $${e}$ to the power $${m}$, swapping the base and the exponent.`,
                `这是求 $${e}$ 的 $${m}$ 次幂，把底数和指数弄反了。`,
              ),
              why(
                modPow(m, e - 1, n),
                `This has one factor $${m}$ too few: it is $${m}^{${e - 1}}$.`,
                `这少乘了一个因数 $${m}$：它是 $${m}^{${e - 1}}$。`,
              ),
            ]),
            solution: walked(
              [
                [["Set up the power", "列出幂"], t(`$c = ${m}^{${e}} \\bmod ${n}$.`, `$c = ${m}^{${e}} \\bmod ${n}$。`)],
                [["Square repeatedly", "反复平方"], t(`${work.en} So $c = ${c}$.`, `${work.zh}所以 $c = ${c}$。`)],
              ],
              t(
                `The private exponent of this key is $d = ${d}$, and $${c}^{${d}} \\equiv ${modPow(c, d, n)} \\pmod{${n}}$ is the message again.`,
                `这个密钥的私钥指数是 $d = ${d}$，而 $${c}^{${d}} \\equiv ${modPow(c, d, n)} \\pmod{${n}}$ 又是原消息。`,
              ),
            ),
          });
        }
        const work = squaringWork(c, d, n);
        return numberProblem({
          prompt: t(
            `The RSA key $(n, e) = (${n}, ${e})$ has private exponent $d = ${d}$. Decrypt the ciphertext $c = ${c}$.`,
            `RSA 密钥 $(n, e) = (${n}, ${e})$ 的私钥指数为 $d = ${d}$。解密密文 $c = ${c}$。`,
          ),
          answer: m,
          mistakes: distinct(m, [
            why(
              modPow(c, e, n),
              `This raises $${c}$ to the public exponent $${e}$, encrypting again instead of decrypting.`,
              `这是求 $${c}$ 的公钥指数 $${e}$ 次幂，又加密了一次而不是解密。`,
            ),
            why(
              (c * d) % n,
              `This multiplies $${c}$ by $${d}$ instead of raising it to the power $${d}$.`,
              `这是把 $${c}$ 乘以 $${d}$，而不是求它的 $${d}$ 次幂。`,
            ),
            why(
              modPow(d, c, n),
              `This raises $${d}$ to the power $${c}$, swapping the base and the exponent.`,
              `这是求 $${d}$ 的 $${c}$ 次幂，把底数和指数弄反了。`,
            ),
            why(
              modPow(c, d - 1, n),
              `This has one factor $${c}$ too few: it is $${c}^{${d - 1}}$.`,
              `这少乘了一个因数 $${c}$：它是 $${c}^{${d - 1}}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Set up the power", "列出幂"], t(`$m = ${c}^{${d}} \\bmod ${n}$.`, `$m = ${c}^{${d}} \\bmod ${n}$。`)],
              [["Square repeatedly", "反复平方"], t(`${work.en} So $m = ${m}$.`, `${work.zh}所以 $m = ${m}$。`)],
            ],
            t(
              `Encrypting back, $${m}^{${e}} \\equiv ${modPow(m, e, n)} \\pmod{${n}}$, the ciphertext.`,
              `再加密回去，$${m}^{${e}} \\equiv ${modPow(m, e, n)} \\pmod{${n}}$，正是密文。`,
            ),
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsNumberTheoryTopics are the new topics of Discrete Mathematics unit 2. */
export const discreteMathematicsNumberTheoryTopics: readonly TopicDef[] = [
  binaryIntegers,
  addingAndSubtractingBinaryIntegers,
  multiplyingAndDividingBinaryIntegers,
  binaryFractions,
  hexadecimalIntegers,
  convertingBetweenBinaryAndHexadecimalIntegers,
  integersInArbitraryBases,
  fractionsInArbitraryBases,
  fermatsLittleTheorem,
  eulersTotientFunction,
  eulersTheorem,
  introductionToCryptography,
  theLinearCipher,
  theDiffieHellmanProtocol,
  theRsaCryptosystem,
];
