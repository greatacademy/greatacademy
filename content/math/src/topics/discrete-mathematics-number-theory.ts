import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { numberProblem, yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
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

/** expansion writes the place-value sum of a numeral: "1 \cdot 2^{3} + 0 \cdot 2^{2} + …". */
const expansion = (s: string, b: number) =>
  s
    .split("")
    .map((d, i) => `${DIGITS.indexOf(d)} \\cdot ${b}^{${s.length - 1 - i}}`)
    .join(" + ");

/** divisionSteps lists repeated division by b, giving the digits from last to first. */
const divisionSteps = (n: number, b: number) => {
  const out: string[] = [];
  for (let m = n; m > 0; m = Math.floor(m / b)) out.push(`${m} = ${b} \\cdot ${Math.floor(m / b)} + ${m % b}`);
  return out.map((s) => `$${s}$`).join(", ");
};

/** nearby lists plausible wrong values near n: single-bit flips and off-by-one errors. */
const nearby = (rng: Rng, n: number, b: number) => {
  const digits = toBase(n, b).length;
  const place = b ** rng.int(0, digits - 1);
  const reversed = Number.parseInt(toBase(n, b).split("").reverse().join(""), b);
  return [n + place, Math.abs(n - place), n + 1, n - 1, reversed, n + b ** rng.int(0, digits - 1) * (b - 1)].filter(
    (w) => w > 0 && w !== n,
  );
};

/** fracBase writes a fraction num / bᵏ as a numeral in base b with k places: "101.011". */
const fracBase = (num: number, b: number, k: number) => {
  const whole = Math.floor(num / b ** k);
  const frac = (num % b ** k).toString(b).toUpperCase().padStart(k, "0");
  return `${toBase(whole, b)}.${frac}`;
};

/** binaryIntegers converts between binary and decimal. */
export const binaryIntegers: TopicDef = {
  id: "binary-integers",
  title: t("Binary Integers", "二进制整数"),
  summary: t(
    "In binary (base 2) each digit is a bit, 0 or 1, and the places are worth 1, 2, 4, 8, …; repeated division by 2 converts a decimal integer to binary.",
    "二进制（以 2 为基数）中每一位是一个比特 0 或 1，各位的位值依次为 1、2、4、8、…；不断除以 2 即可把十进制整数化为二进制。",
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
        "Each binary digit is worth a power of two, doubling from right to left, so the value is the sum of the powers where the digit is one. Add the place values of the $1$ bits: $\\mathrm{101101}_{2} = 32 + 8 + 4 + 1 = 45$.",
        "每个二进制位代表一个 2 的幂，从右向左依次加倍，所以数值是所有为 1 的位对应的幂之和。把为 $1$ 的位的位值相加：$\\mathrm{101101}_{2} = 32 + 8 + 4 + 1 = 45$。",
      ),
      generate(rng) {
        const n = rng.int(9, 255);
        const s = toBase(n, 2);
        return numberProblem({
          prompt: t(`Write $${numTex(s, 2)}$ in decimal.`, `把 $${numTex(s, 2)}$ 写成十进制数。`),
          answer: n,
          wrong: nearby(rng, n, 2),
          solution: t(`$${numTex(s, 2)} = ${expansion(s, 2)} = ${n}$.`, `$${numTex(s, 2)} = ${expansion(s, 2)} = ${n}$。`),
        });
      },
    },
    {
      id: "decimal-to-binary",
      title: t("Decimal to binary", "十进制化为二进制"),
      explanation: t(
        "Repeated division by two peels off the binary digits from the right, so the remainders read from last to first give the number. Divide by $2$ repeatedly and read the remainders from last to first: $13 = 2 \\cdot 6 + 1$, $6 = 2 \\cdot 3 + 0$, $3 = 2 \\cdot 1 + 1$, $1 = 2 \\cdot 0 + 1$, so $13 = \\mathrm{1101}_{2}$.",
        "反复除以 2 会从右边依次剥出二进制位，所以把余数从最后一个读到第一个就得到这个数。不断除以 $2$，再把余数从后往前读：$13 = 2 \\cdot 6 + 1$，$6 = 2 \\cdot 3 + 0$，$3 = 2 \\cdot 1 + 1$，$1 = 2 \\cdot 0 + 1$，所以 $13 = \\mathrm{1101}_{2}$。",
      ),
      generate(rng) {
        const n = rng.int(9, 200);
        return oneOf(
          rng,
          t(`Write $${n}$ in binary.`, `把 $${n}$ 写成二进制数。`),
          baseOpt(n, 2),
          nearby(rng, n, 2).map((w) => baseOpt(w, 2)),
          t(
            `${divisionSteps(n, 2)}. Reading the remainders upward: $${n} = ${numTex(toBase(n, 2), 2)}$.`,
            `${divisionSteps(n, 2)}。把余数从下往上读：$${n} = ${numTex(toBase(n, 2), 2)}$。`,
          ),
        );
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
  prerequisites: ["binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "adding-binary-integers",
      title: t("Adding binary integers", "二进制整数加法"),
      explanation: t(
        "Binary addition works column by column like decimal addition, except that two ones make ten, so you write zero and carry one. $\\mathrm{1011}_{2} + \\mathrm{0110}_{2}$: from the right, $1 + 0 = 1$; $1 + 1 = 10$, write $0$ carry $1$; $0 + 1 + 1 = 10$, write $0$ carry $1$; $1 + 0 + 1 = 10$. The sum is $\\mathrm{10001}_{2}$, that is, $11 + 6 = 17$.",
        "二进制加法像十进制加法一样逐列进行，只是两个 1 相加得到 10，所以写 0 并进 1。$\\mathrm{1011}_{2} + \\mathrm{0110}_{2}$：从右往左，$1 + 0 = 1$；$1 + 1 = 10$，写 $0$ 进 $1$；$0 + 1 + 1 = 10$，写 $0$ 进 $1$；$1 + 0 + 1 = 10$。和为 $\\mathrm{10001}_{2}$，即 $11 + 6 = 17$。",
      ),
      generate(rng) {
        const a = rng.int(5, 127);
        const b = rng.int(5, 127);
        const sum = a + b;
        return oneOf(
          rng,
          t(
            `Find $${numTex(toBase(a, 2), 2)} + ${numTex(toBase(b, 2), 2)}$.`,
            `求 $${numTex(toBase(a, 2), 2)} + ${numTex(toBase(b, 2), 2)}$。`,
          ),
          baseOpt(sum, 2),
          [a ^ b, a | b, ...nearby(rng, sum, 2)].filter((w) => w !== sum).map((w) => baseOpt(w, 2)),
          t(
            `Add column by column, carrying when a column reaches $2$: $${a} + ${b} = ${sum} = ${numTex(toBase(sum, 2), 2)}$.`,
            `逐列相加，某列达到 $2$ 时进位：$${a} + ${b} = ${sum} = ${numTex(toBase(sum, 2), 2)}$。`,
          ),
        );
      },
    },
    {
      id: "subtracting-binary-integers",
      title: t("Subtracting binary integers", "二进制整数减法"),
      explanation: t(
        "$\\mathrm{10010}_{2} - \\mathrm{0101}_{2}$: borrowing turns a $1$ in the next place into $2$ in this one. The difference is $\\mathrm{1101}_{2}$, that is, $18 - 5 = 13$.",
        "$\\mathrm{10010}_{2} - \\mathrm{0101}_{2}$：借位时把前一位的 $1$ 变成本位的 $2$。差为 $\\mathrm{1101}_{2}$，即 $18 - 5 = 13$。",
      ),
      generate(rng) {
        const b = rng.int(3, 100);
        const a = rng.int(b + 2, 160);
        const diff = a - b;
        return oneOf(
          rng,
          t(
            `Find $${numTex(toBase(a, 2), 2)} - ${numTex(toBase(b, 2), 2)}$.`,
            `求 $${numTex(toBase(a, 2), 2)} - ${numTex(toBase(b, 2), 2)}$。`,
          ),
          baseOpt(diff, 2),
          [a ^ b, ...nearby(rng, diff, 2)].filter((w) => w !== diff && w > 0).map((w) => baseOpt(w, 2)),
          t(
            `Subtract column by column, borrowing $2$ from the next place when needed: $${a} - ${b} = ${diff} = ${numTex(toBase(diff, 2), 2)}$.`,
            `逐列相减，需要时向前一位借 $2$：$${a} - ${b} = ${diff} = ${numTex(toBase(diff, 2), 2)}$。`,
          ),
        );
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
  prerequisites: ["adding-and-subtracting-binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "multiplying-binary-integers",
      title: t("Multiplying binary integers", "二进制整数乘法"),
      explanation: t(
        "Multiplying by a binary number means adding shifted copies of the other number, one copy for each digit that is one. $\\mathrm{1011}_{2} \\times \\mathrm{101}_{2}$: the multiplier has $1$ bits worth $4$ and $1$, so add $\\mathrm{101100}_{2}$ (shifted two places) and $\\mathrm{1011}_{2}$: $\\mathrm{110111}_{2} = 55 = 11 \\times 5$.",
        "乘以一个二进制数，就是把另一个数的移位副本相加，每个为 1 的位对应一个副本。$\\mathrm{1011}_{2} \\times \\mathrm{101}_{2}$：乘数的 $1$ 位的位值是 $4$ 和 $1$，所以把 $\\mathrm{101100}_{2}$（左移两位）与 $\\mathrm{1011}_{2}$ 相加：$\\mathrm{110111}_{2} = 55 = 11 \\times 5$。",
      ),
      generate(rng) {
        const a = rng.int(5, 31);
        const b = rng.int(3, 15);
        const p = a * b;
        return oneOf(
          rng,
          t(
            `Find $${numTex(toBase(a, 2), 2)} \\times ${numTex(toBase(b, 2), 2)}$.`,
            `求 $${numTex(toBase(a, 2), 2)} \\times ${numTex(toBase(b, 2), 2)}$。`,
          ),
          baseOpt(p, 2),
          [a + b, p - a, p + a, ...nearby(rng, p, 2)].filter((w) => w !== p).map((w) => baseOpt(w, 2)),
          t(
            `Add a shifted copy of $${numTex(toBase(a, 2), 2)}$ for each $1$ bit of $${numTex(toBase(b, 2), 2)}$: $${a} \\times ${b} = ${p} = ${numTex(toBase(p, 2), 2)}$.`,
            `对 $${numTex(toBase(b, 2), 2)}$ 的每个 $1$ 位加上 $${numTex(toBase(a, 2), 2)}$ 的一个移位副本：$${a} \\times ${b} = ${p} = ${numTex(toBase(p, 2), 2)}$。`,
          ),
        );
      },
    },
    {
      id: "dividing-binary-integers",
      title: t("Dividing binary integers", "二进制整数除法"),
      explanation: t(
        "$\\mathrm{110111}_{2} \\div \\mathrm{101}_{2}$: at each step, bring down a bit and subtract $\\mathrm{101}_{2}$ if it fits, writing $1$, or else write $0$. The quotient is $\\mathrm{1011}_{2}$, since $55 \\div 5 = 11$.",
        "$\\mathrm{110111}_{2} \\div \\mathrm{101}_{2}$：每一步移下一位，若能减去 $\\mathrm{101}_{2}$ 就减并商 $1$，否则商 $0$。商为 $\\mathrm{1011}_{2}$，因为 $55 \\div 5 = 11$。",
      ),
      generate(rng) {
        const b = rng.int(3, 13);
        const q = rng.int(5, 31);
        const a = b * q;
        return oneOf(
          rng,
          t(
            `Find $${numTex(toBase(a, 2), 2)} \\div ${numTex(toBase(b, 2), 2)}$.`,
            `求 $${numTex(toBase(a, 2), 2)} \\div ${numTex(toBase(b, 2), 2)}$。`,
          ),
          baseOpt(q, 2),
          [q * 2, Math.floor(q / 2), ...nearby(rng, q, 2)].filter((w) => w !== q && w > 0).map((w) => baseOpt(w, 2)),
          t(
            `Long division gives $${numTex(toBase(q, 2), 2)}$; check: $${a} \\div ${b} = ${q}$.`,
            `长除法得 $${numTex(toBase(q, 2), 2)}$；验算：$${a} \\div ${b} = ${q}$。`,
          ),
        );
      },
    },
  ],
};

/** binaryFractions writes non-integers in binary with places worth 1/2, 1/4, 1/8, …. */
export const binaryFractions: TopicDef = {
  id: "binary-fractions",
  title: t("Binary Fractions", "二进制小数"),
  summary: t(
    "After the binary point the places are worth 1/2, 1/4, 1/8, …; repeatedly doubling the fractional part produces the bits.",
    "二进制小数点后各位的位值依次为 1/2、1/4、1/8、…；不断把小数部分乘以 2 就能得到各位。",
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
        "Digits after the binary point are worth halves, quarters, eighths and so on, so add those fractions for the digits that are one. $\\mathrm{10.101}_{2} = 2 + \\frac{1}{2} + \\frac{1}{8} = 2.625$.",
        "二进制小数点后的各位分别代表二分之一、四分之一、八分之一等，所以把为 1 的位对应的分数相加。$\\mathrm{10.101}_{2} = 2 + \\frac{1}{2} + \\frac{1}{8} = 2.625$。",
      ),
      generate(rng) {
        const k = rng.int(2, 4);
        let num: number;
        do num = rng.int(1, 15 * 2 ** k);
        while (num % 2 === 0);
        const s = fracBase(num, 2, k);
        const value = Q.of(num, 2 ** k);
        return numberProblem({
          prompt: t(`Write $${numTex(s, 2)}$ as a decimal number.`, `把 $${numTex(s, 2)}$ 写成十进制数。`),
          answer: value,
          wrong: [Q.of(num, 10 ** k), Q.of(num + 1, 2 ** k), Q.of(num, 2 ** (k + 1))],
          form: "decimal",
          solution: t(
            `The places after the point are worth $\\frac{1}{2}, \\frac{1}{4}, \\dots$: $${numTex(s, 2)} = \\frac{${num}}{${2 ** k}} = ${dec(value)}$.`,
            `小数点后各位的位值为 $\\frac{1}{2}, \\frac{1}{4}, \\dots$：$${numTex(s, 2)} = \\frac{${num}}{${2 ** k}} = ${dec(value)}$。`,
          ),
        });
      },
    },
    {
      id: "decimal-fractions-to-binary",
      title: t("Decimal fractions to binary", "十进制小数化为二进制"),
      explanation: t(
        "Doubling a fraction moves the binary point one place, so the whole number part after each doubling is the next binary digit. For $0.375$: $0.375 \\times 2 = 0.75$ (bit $0$), $0.75 \\times 2 = 1.5$ (bit $1$), $0.5 \\times 2 = 1$ (bit $1$). So $0.375 = \\mathrm{0.011}_{2}$.",
        "把小数加倍相当于把二进制小数点移动一位，所以每次加倍后的整数部分就是下一位二进制数字。对 $0.375$：$0.375 \\times 2 = 0.75$（位 $0$），$0.75 \\times 2 = 1.5$（位 $1$），$0.5 \\times 2 = 1$（位 $1$）。所以 $0.375 = \\mathrm{0.011}_{2}$。",
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
        const wrongs = [
          `${whole}.${frac.split("").reverse().join("")}`,
          fracBase(num + 1, 2, k),
          fracBase(num - 1, 2, k),
          `${toBase(Math.floor(d) + 1, 2)}.${frac}`,
          `${whole}.${toBase(Number.parseInt(decimal.split(".")[1] ?? "0", 10), 2)}`,
        ];
        return oneOf(
          rng,
          t(`Write $${decimal}$ in binary.`, `把 $${decimal}$ 写成二进制数。`),
          opt(right),
          wrongs.filter((w) => w !== right).map(opt),
          t(
            `$${decimal} = ${Math.floor(d)} + \\frac{${num % 2 ** k}}{${2 ** k}}$, and doubling the fractional part gives the bits $${frac}$: $${numTex(right, 2)}$.`,
            `$${decimal} = ${Math.floor(d)} + \\frac{${num % 2 ** k}}{${2 ** k}}$，把小数部分不断乘以 $2$ 得到各位 $${frac}$：$${numTex(right, 2)}$。`,
          ),
        );
      },
    },
  ],
};

/** hexadecimalIntegers converts between hexadecimal and decimal. */
export const hexadecimalIntegers: TopicDef = {
  id: "hexadecimal-integers",
  title: t("Hexadecimal Integers", "十六进制整数"),
  summary: t(
    "Hexadecimal (base 16) uses the digits 0–9 and A–F for 10–15; the places are worth 1, 16, 256, ….",
    "十六进制（以 16 为基数）使用数字 0–9 和 A–F（表示 10–15）；各位的位值依次为 1、16、256、…。",
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
        "Hexadecimal digits are worth powers of sixteen, and the letters from A to F stand for the values ten to fifteen. $\\mathrm{2F}_{16} = 2 \\cdot 16 + 15 = 47$ and $\\mathrm{1A0}_{16} = 1 \\cdot 256 + 10 \\cdot 16 + 0 = 416$.",
        "十六进制的各位代表 16 的幂，字母 A 到 F 表示数值 10 到 15。$\\mathrm{2F}_{16} = 2 \\cdot 16 + 15 = 47$，$\\mathrm{1A0}_{16} = 1 \\cdot 256 + 10 \\cdot 16 + 0 = 416$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(26, 4000);
        while (!/[A-F]/.test(toBase(n, 16)));
        const s = toBase(n, 16);
        return numberProblem({
          prompt: t(`Write $${numTex(s, 16)}$ in decimal.`, `把 $${numTex(s, 16)}$ 写成十进制数。`),
          answer: n,
          wrong: [Number.parseInt(s.replace(/[A-F]/g, "1"), 10), ...nearby(rng, n, 16)],
          solution: t(`$${numTex(s, 16)} = ${expansion(s, 16)} = ${n}$.`, `$${numTex(s, 16)} = ${expansion(s, 16)} = ${n}$。`),
        });
      },
    },
    {
      id: "decimal-to-hexadecimal",
      title: t("Decimal to hexadecimal", "十进制化为十六进制"),
      explanation: t(
        "The same repeated division works with sixteen in place of two, writing remainders from ten to fifteen as letters. Divide by $16$ repeatedly: $700 = 16 \\cdot 43 + 12$, $43 = 16 \\cdot 2 + 11$, $2 = 16 \\cdot 0 + 2$. The remainders $2, 11, 12$ read upward give $700 = \\mathrm{2BC}_{16}$.",
        "同样的反复除法也适用，只需把 2 换成 16，并把 10 到 15 的余数写成字母。不断除以 $16$：$700 = 16 \\cdot 43 + 12$，$43 = 16 \\cdot 2 + 11$，$2 = 16 \\cdot 0 + 2$。余数 $2, 11, 12$ 从下往上读得 $700 = \\mathrm{2BC}_{16}$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(26, 3000);
        while (!/[A-F]/.test(toBase(n, 16)));
        return oneOf(
          rng,
          t(`Write $${n}$ in hexadecimal.`, `把 $${n}$ 写成十六进制数。`),
          baseOpt(n, 16),
          nearby(rng, n, 16).map((w) => baseOpt(w, 16)),
          t(
            `${divisionSteps(n, 16)}. Reading the remainders upward: $${n} = ${numTex(toBase(n, 16), 16)}$.`,
            `${divisionSteps(n, 16)}。把余数从下往上读：$${n} = ${numTex(toBase(n, 16), 16)}$。`,
          ),
        );
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
  prerequisites: ["hexadecimal-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "binary-to-hexadecimal",
      title: t("Binary to hexadecimal", "二进制化为十六进制"),
      explanation: t(
        "Sixteen is two to the fourth power, so each group of four binary digits, counted from the right, becomes one hexadecimal digit. Group from the right: $\\mathrm{1011101}_{2} = \\mathrm{0101\\,1101}_{2}$, and $\\mathrm{0101}_{2} = 5$, $\\mathrm{1101}_{2} = \\mathrm{D}$, so it is $\\mathrm{5D}_{16}$.",
        "16 是 2 的四次方，所以从右边数起，每四个二进制位一组，就变成一个十六进制数字。从右往左分组：$\\mathrm{1011101}_{2} = \\mathrm{0101\\,1101}_{2}$，$\\mathrm{0101}_{2} = 5$，$\\mathrm{1101}_{2} = \\mathrm{D}$，所以是 $\\mathrm{5D}_{16}$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(40, 4095);
        while (!/[A-F]/.test(toBase(n, 16)));
        const groups = nibbles(n);
        const fromLeft = Number.parseInt(toBase(n, 2).padEnd(groups.length * 4, "0"), 2);
        return oneOf(
          rng,
          t(`Write $${numTex(toBase(n, 2), 2)}$ in hexadecimal.`, `把 $${numTex(toBase(n, 2), 2)}$ 写成十六进制数。`),
          baseOpt(n, 16),
          [fromLeft, ...nearby(rng, n, 16)].filter((w) => w !== n).map((w) => baseOpt(w, 16)),
          t(
            `Group the bits in fours from the right: ${groups.map((g) => `$${g} \\to \\mathrm{${toBase(Number.parseInt(g, 2), 16)}}$`).join(", ")}. So $${numTex(toBase(n, 16), 16)}$.`,
            `从右往左每四位一组：${groups.map((g) => `$${g} \\to \\mathrm{${toBase(Number.parseInt(g, 2), 16)}}$`).join("，")}。所以是 $${numTex(toBase(n, 16), 16)}$。`,
          ),
        );
      },
    },
    {
      id: "hexadecimal-to-binary",
      title: t("Hexadecimal to binary", "十六进制化为二进制"),
      explanation: t(
        "Going the other way, replace each hexadecimal digit by its four binary digits, keeping leading zeros inside the number. Replace each digit by four bits: $\\mathrm{A3}_{16}$ is $\\mathrm{1010}$ then $\\mathrm{0011}$, so $\\mathrm{10100011}_{2}$.",
        "反过来，把每个十六进制数字换成它的四个二进制位，数中间的前导零要保留。把每个数字换成四个比特：$\\mathrm{A3}_{16}$ 是 $\\mathrm{1010}$ 接 $\\mathrm{0011}$，所以是 $\\mathrm{10100011}_{2}$。",
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
        return oneOf(
          rng,
          t(`Write $${numTex(s, 16)}$ in binary.`, `把 $${numTex(s, 16)}$ 写成二进制数。`),
          baseOpt(n, 2),
          [unpadded, ...nearby(rng, n, 2)].filter((w) => w !== n).map((w) => baseOpt(w, 2)),
          t(
            `Each digit becomes four bits: ${s
              .split("")
              .map((d) => `$\\mathrm{${d}} \\to ${Number.parseInt(d, 16).toString(2).padStart(4, "0")}$`)
              .join(", ")}. So $${numTex(toBase(n, 2), 2)}$.`,
            `每个数字换成四个比特：${s
              .split("")
              .map((d) => `$\\mathrm{${d}} \\to ${Number.parseInt(d, 16).toString(2).padStart(4, "0")}$`)
              .join("，")}。所以是 $${numTex(toBase(n, 2), 2)}$。`,
          ),
        );
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
  prerequisites: ["hexadecimal-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "base-b-to-decimal",
      title: t("Base b to decimal", "b 进制化为十进制"),
      explanation: t(
        "In any base, each digit is multiplied by a power of the base, starting from the zeroth power on the right. $\\mathrm{2012}_{3} = 2 \\cdot 27 + 0 \\cdot 9 + 1 \\cdot 3 + 2 = 59$.",
        "在任何进制中，每一位都乘以基数的一个幂，从右边的零次幂开始。$\\mathrm{2012}_{3} = 2 \\cdot 27 + 0 \\cdot 9 + 1 \\cdot 3 + 2 = 59$。",
      ),
      generate(rng) {
        const b = rng.pick(BASES);
        const n = rng.int(b * b, Math.min(b ** 4 - 1, 2000));
        const s = toBase(n, b);
        return numberProblem({
          prompt: t(`Write $${numTex(s, b)}$ in decimal.`, `把 $${numTex(s, b)}$ 写成十进制数。`),
          answer: n,
          wrong: [Number.parseInt(s.replace(/[A-Z]/g, "1"), 10), ...nearby(rng, n, b)],
          solution: t(`$${numTex(s, b)} = ${expansion(s, b)} = ${n}$.`, `$${numTex(s, b)} = ${expansion(s, b)} = ${n}$。`),
        });
      },
    },
    {
      id: "decimal-to-base-b",
      title: t("Decimal to base b", "十进制化为 b 进制"),
      explanation: t(
        "Divide by the base repeatedly and read the remainders from last to first, exactly as for binary. To write $59$ in base $3$: $59 = 3 \\cdot 19 + 2$, $19 = 3 \\cdot 6 + 1$, $6 = 3 \\cdot 2 + 0$, $2 = 3 \\cdot 0 + 2$. Reading upward, $59 = \\mathrm{2012}_{3}$.",
        "反复除以基数，再把余数从最后一个读到第一个，与二进制的做法完全一样。把 $59$ 写成三进制：$59 = 3 \\cdot 19 + 2$，$19 = 3 \\cdot 6 + 1$，$6 = 3 \\cdot 2 + 0$，$2 = 3 \\cdot 0 + 2$。从下往上读，$59 = \\mathrm{2012}_{3}$。",
      ),
      generate(rng) {
        const b = rng.pick(BASES);
        const n = rng.int(b * b, Math.min(1500, b ** 4 - 1));
        const reversedDigits = Number.parseInt(toBase(n, b).split("").reverse().join(""), b);
        return oneOf(
          rng,
          t(`Write $${n}$ in base $${b}$.`, `把 $${n}$ 写成 $${b}$ 进制数。`),
          baseOpt(n, b),
          [reversedDigits, ...nearby(rng, n, b)].filter((w) => w !== n).map((w) => baseOpt(w, b)),
          t(
            `${divisionSteps(n, b)}. Reading the remainders upward: $${n} = ${numTex(toBase(n, b), b)}$.`,
            `${divisionSteps(n, b)}。把余数从下往上读：$${n} = ${numTex(toBase(n, b), b)}$。`,
          ),
        );
      },
    },
  ],
};

/** fractionsInArbitraryBases reads fractional numerals in any base and decides when they terminate. */
export const fractionsInArbitraryBases: TopicDef = {
  id: "fractions-in-arbitrary-bases",
  title: t("Fractions in Arbitrary Bases", "任意进制的小数"),
  summary: t(
    "In base b the places after the point are worth 1/b, 1/b², …; a fraction p/q in lowest terms has a terminating expansion in base b exactly when every prime factor of q divides b.",
    "在 b 进制中，小数点后各位的位值依次为 1/b、1/b²、…；最简分数 p/q 在 b 进制下是有限小数，当且仅当 q 的每个质因数都整除 b。",
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
        "Digits after the point are worth negative powers of the base, so add each digit divided by the matching power. $\\mathrm{1.21}_{3} = 1 + \\frac{2}{3} + \\frac{1}{9} = \\frac{16}{9}$.",
        "小数点后的各位代表基数的负幂，所以把每一位除以相应的幂再相加。$\\mathrm{1.21}_{3} = 1 + \\frac{2}{3} + \\frac{1}{9} = \\frac{16}{9}$。",
      ),
      generate(rng) {
        const b = rng.pick(BASES);
        const k = rng.int(1, 2);
        let num: number;
        do num = rng.int(1, 4 * b ** k);
        while (num % b === 0);
        const s = fracBase(num, b, k);
        const value = Q.of(num, b ** k);
        return numberProblem({
          prompt: t(`Write $${numTex(s, b)}$ as a fraction.`, `把 $${numTex(s, b)}$ 写成分数。`),
          answer: value,
          wrong: [Q.of(num, 10 ** k), Q.of(num + 1, b ** k), Q.of(num, b ** (k + 1))],
          solution: t(
            `The places after the point are worth $\\frac{1}{${b}}${k === 2 ? `, \\frac{1}{${b * b}}` : ""}$: $${numTex(s, b)} = \\frac{${num}}{${b ** k}} = ${value.toLatex()}$.`,
            `小数点后各位的位值为 $\\frac{1}{${b}}${k === 2 ? `, \\frac{1}{${b * b}}` : ""}$：$${numTex(s, b)} = \\frac{${num}}{${b ** k}} = ${value.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "terminating-expansions-in-base-b",
      title: t("Terminating expansions", "有限小数"),
      explanation: t(
        "$\\frac{5}{12}$ terminates in base $6$, since $12 = 2^2 \\cdot 3$ and both $2$ and $3$ divide $6$: $\\frac{5}{12} = \\frac{15}{36} = \\mathrm{0.23}_{6}$. It does not terminate in base $10$, since $3 \\nmid 10$.",
        "$\\frac{5}{12}$ 在六进制下是有限小数，因为 $12 = 2^2 \\cdot 3$，而 $2$ 和 $3$ 都整除 $6$：$\\frac{5}{12} = \\frac{15}{36} = \\mathrm{0.23}_{6}$。它在十进制下不是有限小数，因为 $3 \\nmid 10$。",
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
        return oneOf(
          rng,
          t(
            `Does $\\frac{${p}}{${q}}$ have a terminating expansion in base $${b}$?`,
            `$\\frac{${p}}{${q}}$ 在 $${b}$ 进制下是有限小数吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                `Yes: every prime factor of $${q}$ (${primes.map((r) => `$${r}$`).join(", ")}) divides $${b}$.`,
                `是：$${q}$ 的每个质因数（${primes.map((r) => `$${r}$`).join("、")}）都整除 $${b}$。`,
              )
            : t(
                `No: $${q}$ has the prime factor $${bad}$, which does not divide $${b}$.`,
                `不是：$${q}$ 有质因数 $${bad}$，它不整除 $${b}$。`,
              ),
        );
      },
    },
  ],
};

/** PRIMES are small primes used as moduli. */
const PRIMES = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43] as const;

/** fermatsLittleTheorem reduces exponents modulo p − 1. */
export const fermatsLittleTheorem: TopicDef = {
  id: "fermats-little-theorem",
  title: t("Fermat's Little Theorem", "费马小定理"),
  summary: t(
    "If $p$ is prime and $p \\nmid a$, then $a^{p-1} \\equiv 1 \\pmod{p}$. So exponents can be reduced modulo $p - 1$, and $a^{p-2}$ is the inverse of $a$ modulo $p$.",
    "若 $p$ 是质数且 $p \\nmid a$，则 $a^{p-1} \\equiv 1 \\pmod{p}$。因此指数可以对 $p - 1$ 取模，而 $a^{p-2}$ 就是 $a$ 模 $p$ 的逆元。",
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
        "Fermat's little theorem says the power one less than a prime is one modulo that prime, so exponents can be reduced by multiples of it. To find $3^{100} \\bmod 7$: $3^6 \\equiv 1$, and $100 = 6 \\cdot 16 + 4$, so $3^{100} = (3^6)^{16} \\cdot 3^4 \\equiv 3^4 = 81 \\equiv 4 \\pmod 7$.",
        "费马小定理说，素数减 1 次幂模这个素数等于 1，所以指数可以减去它的倍数。求 $3^{100} \\bmod 7$：$3^6 \\equiv 1$，且 $100 = 6 \\cdot 16 + 4$，所以 $3^{100} = (3^6)^{16} \\cdot 3^4 \\equiv 3^4 = 81 \\equiv 4 \\pmod 7$。",
      ),
      generate(rng) {
        const p = rng.pick(PRIMES.slice(0, 7));
        const a = rng.int(2, p - 1);
        const r = rng.int(1, p - 2);
        const e = (p - 1) * rng.int(5, 60) + r;
        const value = modPow(a, e, p);
        return numberProblem({
          prompt: t(`Find the remainder when $${a}^{${e}}$ is divided by $${p}$.`, `求 $${a}^{${e}}$ 除以 $${p}$ 的余数。`),
          answer: value,
          wrong: [modPow(a, e % p, p), modPow(a, r + 1, p), modPow(a, r - 1, p), 1],
          solution: t(
            `By Fermat, $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$. Since $${e} = ${p - 1} \\cdot ${(e - r) / (p - 1)} + ${r}$, $${a}^{${e}} \\equiv ${a}^{${r}} \\equiv ${value} \\pmod{${p}}$.`,
            `由费马小定理，$${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$。因为 $${e} = ${p - 1} \\cdot ${(e - r) / (p - 1)} + ${r}$，所以 $${a}^{${e}} \\equiv ${a}^{${r}} \\equiv ${value} \\pmod{${p}}$。`,
          ),
        });
      },
    },
    {
      id: "inverses-with-fermat",
      title: t("Inverses from Fermat", "用费马小定理求逆元"),
      explanation: t(
        "Since the power one less than the prime is one, the power two less than the prime is an inverse, which can be found by repeated squaring. Since $a \\cdot a^{p-2} = a^{p-1} \\equiv 1$, the inverse of $a$ modulo $p$ is $a^{p-2} \\bmod p$. Modulo $7$: $3^{-1} \\equiv 3^5 = 243 \\equiv 5$, and indeed $3 \\cdot 5 = 15 \\equiv 1$.",
        "由于素数减 1 次幂等于 1，素数减 2 次幂就是逆元，可以用反复平方求出。因为 $a \\cdot a^{p-2} = a^{p-1} \\equiv 1$，所以 $a$ 模 $p$ 的逆元是 $a^{p-2} \\bmod p$。模 $7$：$3^{-1} \\equiv 3^5 = 243 \\equiv 5$，确实 $3 \\cdot 5 = 15 \\equiv 1$。",
      ),
      generate(rng) {
        const p = rng.pick(PRIMES);
        const a = rng.int(2, p - 2);
        const value = inverseMod(a, p);
        return numberProblem({
          prompt: t(
            `Using Fermat's little theorem, find the inverse of $${a}$ modulo $${p}$, as a number from $0$ to $${p - 1}$.`,
            `用费马小定理求 $${a}$ 模 $${p}$ 的逆元，答案取 $0$ 到 $${p - 1}$ 之间的数。`,
          ),
          answer: value,
          wrong: [p - a, modPow(a, p - 3, p), p - value, modPow(a, p - 1, p)],
          solution: t(
            `$${a}^{-1} \\equiv ${a}^{${p - 2}} \\equiv ${value} \\pmod{${p}}$. Check: $${a} \\cdot ${value} = ${a * value} \\equiv 1$.`,
            `$${a}^{-1} \\equiv ${a}^{${p - 2}} \\equiv ${value} \\pmod{${p}}$。验算：$${a} \\cdot ${value} = ${a * value} \\equiv 1$。`,
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

/** eulersTotientFunction counts the integers up to n that are coprime to n. */
export const eulersTotientFunction: TopicDef = {
  id: "eulers-totient-function",
  title: t("Euler's Totient Function", "欧拉函数"),
  summary: t(
    "φ(n) counts the integers 1 ≤ k ≤ n with gcd(k, n) = 1. φ(pᵏ) = pᵏ − pᵏ⁻¹, and φ(mn) = φ(m)φ(n) when gcd(m, n) = 1.",
    "φ(n) 统计满足 gcd(k, n) = 1 的整数 1 ≤ k ≤ n 的个数。φ(pᵏ) = pᵏ − pᵏ⁻¹，且当 gcd(m, n) = 1 时 φ(mn) = φ(m)φ(n)。",
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
        "Among $1, \\dots, p^k$ only the multiples of $p$ share a factor with $p^k$, and there are $p^{k-1}$ of them: $\\varphi(p^k) = p^k - p^{k-1}$. So $\\varphi(7) = 6$ and $\\varphi(27) = 27 - 9 = 18$.",
        "在 $1, \\dots, p^k$ 中，只有 $p$ 的倍数与 $p^k$ 有公因数，共 $p^{k-1}$ 个：$\\varphi(p^k) = p^k - p^{k-1}$。所以 $\\varphi(7) = 6$，$\\varphi(27) = 27 - 9 = 18$。",
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
          wrong: [n - 1, n - p, (p - 1) ** k, n / p],
          solution: t(
            k === 1
              ? `$${n}$ is prime, so every one of $1, \\dots, ${n - 1}$ is coprime to it: $\\varphi(${n}) = ${value}$.`
              : `$${n} = ${p}^{${k}}$, so $\\varphi(${n}) = ${p}^{${k}} - ${p}^{${k - 1}} = ${n} - ${n / p} = ${value}$.`,
            k === 1
              ? `$${n}$ 是质数，所以 $1, \\dots, ${n - 1}$ 都与它互质：$\\varphi(${n}) = ${value}$。`
              : `$${n} = ${p}^{${k}}$，所以 $\\varphi(${n}) = ${p}^{${k}} - ${p}^{${k - 1}} = ${n} - ${n / p} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "totients-of-composite-numbers",
      title: t("Totients of composite numbers", "合数的欧拉函数"),
      explanation: t(
        "Euler's totient is multiplicative over coprime factors, and for a prime power it removes the multiples of the prime. Factor and multiply: $\\varphi(360) = \\varphi(2^3)\\varphi(3^2)\\varphi(5) = 4 \\cdot 6 \\cdot 4 = 96$. Equivalently $\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right)$.",
        "欧拉函数对互素的因数是积性的，对素数的幂，它去掉了该素数的倍数。先分解再相乘：$\\varphi(360) = \\varphi(2^3)\\varphi(3^2)\\varphi(5) = 4 \\cdot 6 \\cdot 4 = 96$。等价地，$\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right)$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 1000);
        while (factorize(n).length < 2);
        const value = phi(n);
        const parts = factorize(n).map(([p, k]) => p ** k);
        return numberProblem({
          prompt: t(`Find $\\varphi(${n})$.`, `求 $\\varphi(${n})$。`),
          answer: value,
          wrong: [n - 1, factorize(n).reduce((acc, [p]) => acc * (p - 1), 1), parts.reduce((acc, m) => acc * (m - 1), 1), value * 2],
          solution: t(
            `$${n} = ${factorTex(n)}$, so $\\varphi(${n}) = ${parts.map((m) => `\\varphi(${m})`).join("")} = ${parts.map(phi).join(" \\cdot ")} = ${value}$.`,
            `$${n} = ${factorTex(n)}$，所以 $\\varphi(${n}) = ${parts.map((m) => `\\varphi(${m})`).join("")} = ${parts.map(phi).join(" \\cdot ")} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** eulersTheorem generalizes Fermat's little theorem to composite moduli. */
export const eulersTheorem: TopicDef = {
  id: "eulers-theorem",
  title: t("Euler's Theorem", "欧拉定理"),
  summary: t(
    "If $\\gcd(a, n) = 1$, then $a^{\\varphi(n)} \\equiv 1 \\pmod{n}$; exponents can be reduced modulo $\\varphi(n)$. Fermat's little theorem is the case $n = p$.",
    "若 $\\gcd(a, n) = 1$，则 $a^{\\varphi(n)} \\equiv 1 \\pmod{n}$；指数可以对 $\\varphi(n)$ 取模。费马小定理是 $n = p$ 的特例。",
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
        "Euler's theorem generalizes Fermat's: when the base is coprime to the modulus, the totient power is one, so exponents reduce modulo the totient. To find $7^{50} \\bmod 15$: $\\varphi(15) = 8$, $\\gcd(7, 15) = 1$ and $50 = 8 \\cdot 6 + 2$, so $7^{50} \\equiv 7^2 = 49 \\equiv 4 \\pmod{15}$.",
        "欧拉定理推广了费马定理：当底数与模互素时，欧拉函数值次幂等于 1，所以指数可以模欧拉函数值约化。求 $7^{50} \\bmod 15$：$\\varphi(15) = 8$，$\\gcd(7, 15) = 1$，且 $50 = 8 \\cdot 6 + 2$，所以 $7^{50} \\equiv 7^2 = 49 \\equiv 4 \\pmod{15}$。",
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
        return numberProblem({
          prompt: t(`Find the remainder when $${a}^{${e}}$ is divided by $${n}$.`, `求 $${a}^{${e}}$ 除以 $${n}$ 的余数。`),
          answer: value,
          wrong: [modPow(a, e % (n - 1), n), modPow(a, r + 1, n), 1, modPow(a, e % n, n)],
          solution: t(
            `$\\varphi(${n}) = ${f}$ and $${e} = ${f} \\cdot ${(e - r) / f} + ${r}$, so $${a}^{${e}} \\equiv ${a}^{${r}} \\equiv ${value} \\pmod{${n}}$.`,
            `$\\varphi(${n}) = ${f}$，且 $${e} = ${f} \\cdot ${(e - r) / f} + ${r}$，所以 $${a}^{${e}} \\equiv ${a}^{${r}} \\equiv ${value} \\pmod{${n}}$。`,
          ),
        });
      },
    },
    {
      id: "last-digits-of-powers",
      title: t("Last digits of powers", "幂的末位数字"),
      explanation: t(
        "The last two digits of a number are its remainder modulo one hundred, so Euler's theorem with that modulus finds them. The last two digits of $3^{2023}$ are $3^{2023} \\bmod 100$. As $\\varphi(100) = 40$ and $2023 = 40 \\cdot 50 + 23$, $3^{2023} \\equiv 3^{23} \\equiv 27 \\pmod{100}$.",
        "一个数的最后两位就是它模 100 的余数，所以用以 100 为模的欧拉定理就能求出它们。$3^{2023}$ 的末两位就是 $3^{2023} \\bmod 100$。因为 $\\varphi(100) = 40$，且 $2023 = 40 \\cdot 50 + 23$，所以 $3^{2023} \\equiv 3^{23} \\equiv 27 \\pmod{100}$。",
      ),
      generate(rng) {
        const two = rng.bool();
        const n = two ? 100 : 10;
        const f = phi(n);
        const a = rng.pick([3, 7, 9, 13, 17, 19, 23, 27, 29, 33, 37, ...(two ? [11, 21, 31] : [])]);
        const e = rng.int(100, 3000);
        const value = modPow(a, e, n);
        return numberProblem({
          prompt: two
            ? t(`Find the number formed by the last two digits of $${a}^{${e}}$.`, `求 $${a}^{${e}}$ 的末两位所组成的数。`)
            : t(`Find the last digit of $${a}^{${e}}$.`, `求 $${a}^{${e}}$ 的个位数字。`),
          answer: value,
          wrong: [modPow(a, e % n, n), modPow(a, (e % f) + 1, n), a % n, 1],
          solution: t(
            `$\\varphi(${n}) = ${f}$ and $${e} \\equiv ${e % f} \\pmod{${f}}$, so $${a}^{${e}} \\equiv ${a}^{${e % f}} \\equiv ${value} \\pmod{${n}}$.`,
            `$\\varphi(${n}) = ${f}$，且 $${e} \\equiv ${e % f} \\pmod{${f}}$，所以 $${a}^{${e}} \\equiv ${a}^{${e % f}} \\equiv ${value} \\pmod{${n}}$。`,
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

/** introductionToCryptography encrypts with shift ciphers. */
export const introductionToCryptography: TopicDef = {
  id: "introduction-to-cryptography",
  title: t("Introduction to Cryptography", "密码学入门"),
  summary: t(
    "A cipher turns plaintext into ciphertext with a key. The shift (Caesar) cipher numbers the letters 0–25 and encrypts x as x + k mod 26; decryption subtracts k.",
    "密码用密钥把明文变成密文。移位（凯撒）密码把字母编号为 0–25，把 x 加密为 x + k mod 26；解密时减去 k。",
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
        "A shift cipher replaces each letter by the one a fixed number of places later, wrapping from the end of the alphabet back to the start. With key $k = 3$: $\\mathrm{X} = 23 \\mapsto 26 \\equiv 0 = \\mathrm{A}$, wrapping around the alphabet. So $\\mathrm{XYZ}$ becomes $\\mathrm{ABC}$.",
        "移位密码把每个字母换成其后固定位数的字母，到字母表末尾时再回到开头。密钥 $k = 3$ 时：$\\mathrm{X} = 23 \\mapsto 26 \\equiv 0 = \\mathrm{A}$，在字母表末尾绕回开头。所以 $\\mathrm{XYZ}$ 变成 $\\mathrm{ABC}$。",
      ),
      generate(rng) {
        const w = rng.pick(WORDS);
        const k = rng.int(2, 24);
        const c = shift(w, k);
        return oneOf(
          rng,
          t(
            `${CODING.en} Encrypt $\\mathrm{${w}}$ with the shift cipher $x \\mapsto x + ${k} \\bmod 26$.`,
            `${CODING["zh-CN"]}用移位密码 $x \\mapsto x + ${k} \\bmod 26$ 加密 $\\mathrm{${w}}$。`,
          ),
          wordText(c),
          [shift(w, -k), shift(w, k + 1), shift(w, k - 1)].map(wordText),
          t(
            `Shift each letter forward by $${k}$, wrapping past $\\mathrm{Z}$: $\\mathrm{${w}} \\mapsto \\mathrm{${c}}$.`,
            `把每个字母向后移 $${k}$ 位，超过 $\\mathrm{Z}$ 时绕回：$\\mathrm{${w}} \\mapsto \\mathrm{${c}}$。`,
          ),
        );
      },
    },
    {
      id: "decrypting-a-shift-cipher",
      title: t("Decrypting a shift cipher", "解密移位密码"),
      explanation: t(
        "Decryption undoes the shift by moving back the same number of places, again wrapping around the alphabet. Decryption subtracts the key: with $k = 5$, $\\mathrm{F} = 5 \\mapsto 0 = \\mathrm{A}$ and $\\mathrm{C} = 2 \\mapsto -3 \\equiv 23 = \\mathrm{X}$.",
        "解密时向回移动同样的位数来撤销移位，同样要在字母表上绕回。解密时减去密钥：$k = 5$ 时，$\\mathrm{F} = 5 \\mapsto 0 = \\mathrm{A}$，$\\mathrm{C} = 2 \\mapsto -3 \\equiv 23 = \\mathrm{X}$。",
      ),
      generate(rng) {
        const w = rng.pick(WORDS);
        const k = rng.int(2, 24);
        const c = shift(w, k);
        return oneOf(
          rng,
          t(
            `${CODING.en} The ciphertext $\\mathrm{${c}}$ was made with the shift cipher $x \\mapsto x + ${k} \\bmod 26$. Decrypt it.`,
            `${CODING["zh-CN"]}密文 $\\mathrm{${c}}$ 由移位密码 $x \\mapsto x + ${k} \\bmod 26$ 得到。请解密。`,
          ),
          wordText(w),
          [shift(c, k), shift(w, 1), shift(w, -1)].map(wordText),
          t(
            `Shift each letter back by $${k}$: $\\mathrm{${c}} \\mapsto \\mathrm{${w}}$.`,
            `把每个字母向前移 $${k}$ 位：$\\mathrm{${c}} \\mapsto \\mathrm{${w}}$。`,
          ),
        );
      },
    },
  ],
};

/** UNITS26 are the multipliers coprime to 26. */
const UNITS26 = [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25] as const;

/** letter names the letter numbered x. */
const letter = (x: number) => String.fromCharCode(65 + x);

/** theLinearCipher encrypts x as ax + b mod 26. */
export const theLinearCipher: TopicDef = {
  id: "the-linear-cipher",
  title: t("The Linear Cipher", "线性密码"),
  summary: t(
    "The linear (affine) cipher encrypts x as y = ax + b mod 26 with gcd(a, 26) = 1; it decrypts with x = a⁻¹(y − b) mod 26.",
    "线性（仿射）密码把 x 加密为 y = ax + b mod 26，其中 gcd(a, 26) = 1；解密公式为 x = a⁻¹(y − b) mod 26。",
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
        "A linear cipher multiplies the letter's number by a key and adds another, then reduces modulo $26$. With $y = 5x + 8 \\bmod 26$, the letter $\\mathrm{K} = 10$ becomes $58 \\equiv 6 = \\mathrm{G}$.",
        "线性密码把字母对应的数乘以一个密钥再加上另一个密钥，然后模 26 约化。用 $y = 5x + 8 \\bmod 26$，字母 $\\mathrm{K} = 10$ 变成 $58 \\equiv 6 = \\mathrm{G}$。",
      ),
      generate(rng) {
        const a = rng.pick(UNITS26);
        const b = rng.int(1, 25);
        const x = rng.int(0, 25);
        const y = (a * x + b) % 26;
        return numberProblem({
          prompt: t(
            `${CODING.en} The linear cipher $y = ${a}x + ${b} \\bmod 26$ encrypts the letter $\\mathrm{${letter(x)}}$. Find the number $y$ of the ciphertext letter.`,
            `${CODING["zh-CN"]}线性密码 $y = ${a}x + ${b} \\bmod 26$ 加密字母 $\\mathrm{${letter(x)}}$。求密文字母的编号 $y$。`,
          ),
          answer: y,
          wrong: [(a * x) % 26, (a * (x + b)) % 26, a * x + b, (b * x + a) % 26],
          solution: t(
            `$\\mathrm{${letter(x)}} = ${x}$, and $${a} \\cdot ${x} + ${b} = ${a * x + b} \\equiv ${y} \\pmod{26}$, the letter $\\mathrm{${letter(y)}}$.`,
            `$\\mathrm{${letter(x)}} = ${x}$，$${a} \\cdot ${x} + ${b} = ${a * x + b} \\equiv ${y} \\pmod{26}$，即字母 $\\mathrm{${letter(y)}}$。`,
          ),
        });
      },
    },
    {
      id: "decrypting-a-linear-cipher",
      title: t("Decrypting", "解密"),
      explanation: t(
        "To decrypt, subtract the added key and multiply by the inverse of the multiplier, which exists only if it is coprime to $26$. For $y = 5x + 8$: $5^{-1} \\equiv 21 \\pmod{26}$ since $5 \\cdot 21 = 105 = 4 \\cdot 26 + 1$. So $x = 21(y - 8) \\bmod 26$, and $\\mathrm{G} = 6$ decrypts to $21 \\cdot (-2) = -42 \\equiv 10 = \\mathrm{K}$.",
        "解密时先减去加上的密钥，再乘以乘数的逆元，只有乘数与 26 互素时逆元才存在。对 $y = 5x + 8$：因为 $5 \\cdot 21 = 105 = 4 \\cdot 26 + 1$，所以 $5^{-1} \\equiv 21 \\pmod{26}$。于是 $x = 21(y - 8) \\bmod 26$，$\\mathrm{G} = 6$ 解密为 $21 \\cdot (-2) = -42 \\equiv 10 = \\mathrm{K}$。",
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
          wrong: [((((y - b) * a) % 26) + 26) % 26, (inv * y - b + 26 * 26) % 26, (inv * (y + b)) % 26, (a * y + b) % 26],
          solution: t(
            `$${a}^{-1} \\equiv ${inv} \\pmod{26}$, so $x = ${inv}(${y} - ${b}) = ${inv * (y - b)} \\equiv ${x} \\pmod{26}$, the letter $\\mathrm{${letter(x)}}$.`,
            `$${a}^{-1} \\equiv ${inv} \\pmod{26}$，所以 $x = ${inv}(${y} - ${b}) = ${inv * (y - b)} \\equiv ${x} \\pmod{26}$，即字母 $\\mathrm{${letter(x)}}$。`,
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

/** theDiffieHellmanProtocol agrees on a shared key over an open channel. */
export const theDiffieHellmanProtocol: TopicDef = {
  id: "the-diffie-hellman-protocol",
  title: t("The Diffie–Hellman Protocol", "迪菲–赫尔曼协议"),
  summary: t(
    "Alice and Bob publicly fix a prime p and a base g. Alice picks a secret a and sends A = gᵃ mod p; Bob picks b and sends B = gᵇ mod p. Both then compute the shared key Bᵃ ≡ Aᵇ ≡ gᵃᵇ (mod p).",
    "爱丽丝和鲍勃公开约定质数 p 和底数 g。爱丽丝选秘密数 a 并发送 A = gᵃ mod p；鲍勃选 b 并发送 B = gᵇ mod p。然后双方都能算出共享密钥 Bᵃ ≡ Aᵇ ≡ gᵃᵇ (mod p)。",
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
        "Each party raises the shared base to a secret power modulo the prime, and repeated squaring keeps the numbers small. With $p = 23$, $g = 5$ and Alice's secret $a = 6$: $A = 5^6 \\bmod 23$. Square repeatedly: $5^2 = 25 \\equiv 2$, $5^4 \\equiv 4$, so $5^6 \\equiv 4 \\cdot 2 = 8$. Alice sends $A = 8$.",
        "每一方都把公共底数模素数地升到一个秘密的幂，反复平方能让数字保持很小。取 $p = 23$，$g = 5$，爱丽丝的秘密数 $a = 6$：$A = 5^6 \\bmod 23$。反复平方：$5^2 = 25 \\equiv 2$，$5^4 \\equiv 4$，所以 $5^6 \\equiv 4 \\cdot 2 = 8$。爱丽丝发送 $A = 8$。",
      ),
      generate(rng) {
        const p = rng.pick(DH_PRIMES);
        const g = primitiveRoot(p);
        const a = rng.int(3, p - 2);
        const value = modPow(g, a, p);
        return numberProblem({
          prompt: t(
            `In Diffie–Hellman with $p = ${p}$ and $g = ${g}$, Alice's secret is $a = ${a}$. What value $A$ does she send?`,
            `在迪菲–赫尔曼协议中，$p = ${p}$，$g = ${g}$，爱丽丝的秘密数为 $a = ${a}$。她发送的值 $A$ 是多少？`,
          ),
          answer: value,
          wrong: [(g * a) % p, modPow(a, g, p), modPow(g, a - 1, p), modPow(g, a + 1, p)],
          solution: t(`$A = ${g}^{${a}} \\bmod ${p} = ${value}$.`, `$A = ${g}^{${a}} \\bmod ${p} = ${value}$。`),
        });
      },
    },
    {
      id: "computing-the-shared-key",
      title: t("The shared key", "共享密钥"),
      explanation: t(
        "Raising the other party's public value to your own secret power gives the same result for both sides, because exponents multiply. Continuing with $p = 23$, $g = 5$, $a = 6$: if Bob sends $B = 19$, Alice computes $19^6 \\bmod 23 = 2$. Bob, from his secret $b$, gets the same $A^b \\equiv g^{ab} \\equiv 2$.",
        "把对方的公开值升到自己的秘密幂，双方得到相同的结果，因为指数相乘。继续取 $p = 23$，$g = 5$，$a = 6$：若鲍勃发送 $B = 19$，爱丽丝计算 $19^6 \\bmod 23 = 2$。鲍勃用他的秘密数 $b$ 也得到同样的 $A^b \\equiv g^{ab} \\equiv 2$。",
      ),
      generate(rng) {
        const p = rng.pick(DH_PRIMES);
        const g = primitiveRoot(p);
        const a = rng.int(3, p - 2);
        const b = rng.int(3, p - 2);
        const B = modPow(g, b, p);
        const value = modPow(B, a, p);
        return numberProblem({
          prompt: t(
            `In Diffie–Hellman with $p = ${p}$ and $g = ${g}$, Alice's secret is $a = ${a}$ and Bob sends $B = ${B}$. What is the shared key?`,
            `在迪菲–赫尔曼协议中，$p = ${p}$，$g = ${g}$，爱丽丝的秘密数为 $a = ${a}$，鲍勃发送 $B = ${B}$。共享密钥是多少？`,
          ),
          answer: value,
          wrong: [modPow(g, a, p), modPow(g, a + b, p), (B * a) % p, modPow(a, B, p)],
          solution: t(
            `Alice computes $B^a = ${B}^{${a}} \\bmod ${p} = ${value}$, which equals $g^{ab}$.`,
            `爱丽丝计算 $B^a = ${B}^{${a}} \\bmod ${p} = ${value}$，它等于 $g^{ab}$。`,
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

/** theRsaCryptosystem encrypts with a public key (n, e) and decrypts with a private exponent d. */
export const theRsaCryptosystem: TopicDef = {
  id: "the-rsa-cryptosystem",
  title: t("The RSA Cryptosystem", "RSA 密码系统"),
  summary: t(
    "RSA picks primes p, q, sets n = pq and φ = (p − 1)(q − 1), and publishes (n, e) with gcd(e, φ) = 1. The private exponent is d ≡ e⁻¹ (mod φ). Encryption is c = mᵉ mod n and decryption is m = cᵈ mod n, by Euler's theorem.",
    "RSA 选取质数 p、q，令 n = pq，φ = (p − 1)(q − 1)，并公开 (n, e)，其中 gcd(e, φ) = 1。私钥指数 d ≡ e⁻¹ (mod φ)。加密为 c = mᵉ mod n，解密为 m = cᵈ mod n，其正确性由欧拉定理保证。",
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
        "The private exponent is the inverse of the public exponent modulo the totient, found with the extended Euclidean algorithm. With $p = 5$, $q = 11$: $n = 55$ and $\\varphi = 4 \\cdot 10 = 40$. For $e = 3$, $d \\equiv 3^{-1} \\pmod{40}$; $3 \\cdot 27 = 81 = 2 \\cdot 40 + 1$, so $d = 27$.",
        "私钥指数是公钥指数模欧拉函数值的逆元，可以用扩展欧几里得算法求出。取 $p = 5$，$q = 11$：$n = 55$，$\\varphi = 4 \\cdot 10 = 40$。对 $e = 3$，$d \\equiv 3^{-1} \\pmod{40}$；$3 \\cdot 27 = 81 = 2 \\cdot 40 + 1$，所以 $d = 27$。",
      ),
      generate(rng) {
        const { p, q, n, f, e, d } = rsaKeys(rng);
        return numberProblem({
          prompt: t(
            `An RSA key uses $p = ${p}$, $q = ${q}$ and public exponent $e = ${e}$. Find the private exponent $d$, with $0 < d < ${f}$.`,
            `某 RSA 密钥取 $p = ${p}$，$q = ${q}$，公钥指数 $e = ${e}$。求私钥指数 $d$，要求 $0 < d < ${f}$。`,
          ),
          answer: d,
          wrong: [inverseMod(e, n) || 1, f - d, d + 1, (n - 1) % e === 0 ? (n - 1) / e : d - 1],
          solution: t(
            `$\\varphi = (${p} - 1)(${q} - 1) = ${f}$, and $${e} \\cdot ${d} = ${e * d} = ${(e * d - 1) / f} \\cdot ${f} + 1$, so $d = ${d}$.`,
            `$\\varphi = (${p} - 1)(${q} - 1) = ${f}$，而 $${e} \\cdot ${d} = ${e * d} = ${(e * d - 1) / f} \\cdot ${f} + 1$，所以 $d = ${d}$。`,
          ),
        });
      },
    },
    {
      id: "encrypting-and-decrypting-with-rsa",
      title: t("Encrypting and decrypting", "加密与解密"),
      explanation: t(
        "Encryption raises the message to the public exponent, and decryption raises the result to the private exponent, which returns the original message. With $n = 55$, $e = 3$, $d = 27$: the message $m = 7$ encrypts to $c = 7^3 = 343 \\equiv 13 \\pmod{55}$, and $13^{27} \\equiv 7 \\pmod{55}$ recovers it.",
        "加密把消息升到公钥指数次幂，解密把结果升到私钥指数次幂，从而还原出原来的消息。取 $n = 55$，$e = 3$，$d = 27$：消息 $m = 7$ 加密为 $c = 7^3 = 343 \\equiv 13 \\pmod{55}$，而 $13^{27} \\equiv 7 \\pmod{55}$ 恢复出原消息。",
      ),
      generate(rng) {
        const { n, e, d } = rsaKeys(rng);
        let m: number;
        do m = rng.int(2, n - 2);
        while (modPow(m, e, n) === m);
        const c = modPow(m, e, n);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `Encrypt the message $m = ${m}$ with the RSA public key $(n, e) = (${n}, ${e})$.`,
              `用 RSA 公钥 $(n, e) = (${n}, ${e})$ 加密消息 $m = ${m}$。`,
            ),
            answer: c,
            wrong: [modPow(m, d, n), (m * e) % n, modPow(e, m, n), modPow(m, e - 1, n)],
            solution: t(`$c = ${m}^{${e}} \\bmod ${n} = ${c}$.`, `$c = ${m}^{${e}} \\bmod ${n} = ${c}$。`),
          });
        }
        return numberProblem({
          prompt: t(
            `The RSA key $(n, e) = (${n}, ${e})$ has private exponent $d = ${d}$. Decrypt the ciphertext $c = ${c}$.`,
            `RSA 密钥 $(n, e) = (${n}, ${e})$ 的私钥指数为 $d = ${d}$。解密密文 $c = ${c}$。`,
          ),
          answer: m,
          wrong: [modPow(c, e, n), (c * d) % n, modPow(d, c, n), modPow(c, d - 1, n)],
          solution: t(`$m = ${c}^{${d}} \\bmod ${n} = ${m}$.`, `$m = ${c}^{${d}} \\bmod ${n} = ${m}$。`),
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
