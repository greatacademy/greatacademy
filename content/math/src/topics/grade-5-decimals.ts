import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";
import { compareProblem, fr, mathText, pickChoice } from "./grade-4-fractions.ts";
import { wordsEn, wordsZh } from "./grade-4-whole-numbers.ts";

// 5th Grade Math: decimal place value, rounding, the four operations on decimals, and exponents.

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

// ---------------------------------------------------------------------------
// Decimal helpers. A decimal is an integer n and a number of places p: n/10ᵖ.

const pow10 = (k: number) => 10 ** k;

/** D is the value n/10ᵖ. */
const D = (n: number, p: number) => Q.of(n, pow10(p));

/** fix writes n/10ᵖ with exactly p decimal places: fix(5, 2) = "0.05", fix(340, 2) = "3.40". */
function fix(n: number, p: number): string {
  if (p <= 0) return String(n * pow10(-p));
  const s = String(n).padStart(p + 1, "0");
  return `${s.slice(0, -p)}.${s.slice(-p)}`;
}

/** dq writes a terminating rational number as a decimal. */
const dq = (q: Q) => dec(q);

/** randomWithDigits is a random whole number with exactly d digits. */
const randomWithDigits = (rng: Rng, d: number): number => rng.int(pow10(d - 1), pow10(d) - 1);

/** nonZeroEnd draws a whole number with exactly d digits whose last digit is not 0. */
function nonZeroEnd(rng: Rng, d: number): number {
  for (;;) {
    const n = randomWithDigits(rng, d);
    if (n % 10 !== 0) return n;
  }
}

/** roundInt rounds n to the nearest multiple of f, rounding halves up. */
const roundInt = (n: number, f: number) => Math.floor((n + f / 2) / f) * f;

/** truncInt rounds n down to a multiple of f. */
const truncInt = (n: number, f: number) => Math.floor(n / f) * f;

/** placeNames are the names of the places from thousands (−3) to thousandths (3), indexed by k + 3, where a digit at place k is worth 10⁻ᵏ. */
const placeNames: readonly Text[] = [
  t("thousands", "千位"),
  t("hundreds", "百位"),
  t("tens", "十位"),
  t("ones", "个位"),
  t("tenths", "十分位"),
  t("hundredths", "百分位"),
  t("thousandths", "千分位"),
];

/** placeName is the name of place k (0 ones, 1 tenths, 2 hundredths, 3 thousandths, −1 tens). */
const placeName = (k: number) => placeNames[k + 3]!;

/** placeValue is the value of one unit in place k: 10⁻ᵏ. */
const placeValue = (k: number) => (k >= 0 ? D(1, k) : Q.of(pow10(-k)));

/** digitAtPlace is the digit of n/10ᵖ in place k. */
const digitAtPlace = (n: number, p: number, k: number) => Math.floor(n / pow10(p - k)) % 10;

/** decimalWordsEn writes n/10ᵖ in English words: "three and forty-five hundredths". */
function decimalWordsEn(n: number, p: number): string {
  const whole = Math.floor(n / pow10(p));
  const part = n % pow10(p);
  const unit = ["", "tenth", "hundredth", "thousandth"][p]!;
  const frac = part === 0 ? "" : `${wordsEn(part)} ${unit}${part === 1 ? "" : "s"}`;
  if (whole === 0) return frac || "zero";
  return frac ? `${wordsEn(whole)} and ${frac}` : wordsEn(whole);
}

const zhDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** decimalWordsZh writes n/10ᵖ in Chinese: "三点四五". */
function decimalWordsZh(n: number, p: number): string {
  const whole = Math.floor(n / pow10(p));
  const digits = fix(n, p).split(".")[1] ?? "";
  return digits ? `${wordsZh(whole)}点${[...digits].map((c) => zhDigits[Number(c)]).join("")}` : wordsZh(whole);
}

/** decimalWords writes n/10ᵖ in words in both languages. */
const decimalWords = (n: number, p: number): Text => t(decimalWordsEn(n, p), decimalWordsZh(n, p));

/** decProblem asks for a number written as a decimal. */
function decProblem(prompt: Text, answer: Q, wrong: readonly Q[], solution: Text): Problem {
  return numberProblem({ prompt, answer, form: "decimal", wrong: wrong.filter((w) => w.sign() >= 0), solution });
}

/** numberWithDigitOnce draws n/10³ with a whole part of 1 to 99 where the digit at place k is nonzero and appears only once. */
function numberWithDigitOnce(rng: Rng, k: number): { n: number; digit: number } {
  for (;;) {
    const n = rng.int(1000, 99999);
    const s = String(n).replace(/^0+/, "");
    const digit = digitAtPlace(n, 3, k);
    if (n % 10 === 0 || digit === 0 || [...s].filter((c) => Number(c) === digit).length !== 1) continue;
    return { n, digit };
  }
}

// ---------------------------------------------------------------------------
// Decimal place value

export const thePlaceValueSystemWithDecimals = topic(
  "the-place-value-system-with-decimals",
  t("The Place Value System With Decimals", "小数的数位"),
  t(
    "The places to the right of the decimal point are tenths, hundredths and thousandths. Each place is worth 1/10 of the place to its left. In 2.347, the 3 is worth 3 tenths (0.3), the 4 is worth 4 hundredths (0.04) and the 7 is worth 7 thousandths (0.007).",
    "小数点右边的数位依次是十分位、百分位、千分位。每个数位上的计数单位是它左边数位的 1/10。在 2.347 中，3 表示 3 个十分之一（0.3），4 表示 4 个百分之一（0.04），7 表示 7 个千分之一（0.007）。",
  ),
  ["decimal-fractions", "place-value-with-numbers-up-to-seven-digits"],
  ["5.NBT.A.1", "5.NBT.A.3"],
  [
    {
      id: "value-of-a-digit-in-a-decimal",
      title: t("The value of a digit", "数字表示的值"),
      explanation: t(
        "In $8.156$, the digit $5$ is in the hundredths place, so it is worth $0.05$.",
        "在 $8.156$ 中，数字 $5$ 在百分位上，表示 $0.05$。",
      ),
      generate(rng) {
        const k = rng.int(1, 3);
        const { n, digit } = numberWithDigitOnce(rng, k);
        const v = D(digit, k);
        return decProblem(
          t(`What is the value of the digit ${digit} in $${fix(n, 3)}$?`, `$${fix(n, 3)}$ 中的数字 ${digit} 表示多少？`),
          v,
          [D(digit, k - 1), D(digit, k + 1), Q.of(digit)],
          t(
            `The ${digit} is in the ${placeName(k).en} place, so it is worth $${digit} \\times ${dq(placeValue(k))} = ${dq(v)}$.`,
            `${digit} 在${placeName(k)["zh-CN"]}上，表示 $${digit} \\times ${dq(placeValue(k))} = ${dq(v)}$。`,
          ),
        );
      },
    },
    {
      id: "naming-decimal-places",
      title: t("Naming the place of a digit", "说出数字所在的数位"),
      explanation: t(
        "In $40.629$, the $9$ is in the thousandths place and the $6$ is in the tenths place.",
        "在 $40.629$ 中，$9$ 在千分位上，$6$ 在十分位上。",
      ),
      generate(rng) {
        const k = rng.int(-1, 3);
        const { n, digit } = numberWithDigitOnce(rng, k);
        return choiceProblem({
          prompt: t(`In $${fix(n, 3)}$, which place is the digit ${digit} in?`, `在 $${fix(n, 3)}$ 中，数字 ${digit} 在哪个数位上？`),
          options: [-1, 0, 1, 2, 3].map(placeName),
          correct: k + 1,
          solution: t(
            `Counting from the decimal point, the ${digit} is in the ${placeName(k).en} place.`,
            `从小数点开始数，${digit} 在${placeName(k)["zh-CN"]}上。`,
          ),
        });
      },
    },
  ],
);

export const comparingPlaceValuesWithDecimals = topic(
  "comparing-place-values-with-decimals",
  t("Comparing Place Values With Decimals", "比较小数中数位的值"),
  t(
    "A digit is worth 10 times as much as the same digit one place to its right, and 1/10 as much as the same digit one place to its left. So the 6 in 0.6 is worth 10 times the 6 in 0.06 and 100 times the 6 in 0.006. Also 1 tenth = 10 hundredths = 100 thousandths.",
    "同一个数字，在左边一位上表示的值是在右边一位上的 10 倍，在右边一位上表示的值是在左边一位上的 1/10。所以 0.6 中的 6 是 0.06 中的 6 的 10 倍，是 0.006 中的 6 的 100 倍。另外，1 个十分之一 = 10 个百分之一 = 100 个千分之一。",
  ),
  ["the-place-value-system-with-decimals", "comparing-place-values"],
  ["5.NBT.A.1"],
  [
    {
      id: "comparing-values-of-the-same-digit",
      title: t("How many times as much", "是几倍"),
      explanation: t(
        "The $3$ in $2.3$ is worth $0.3$ and the $3$ in $4.503$ is worth $0.003$, so the first is $100$ times the second.",
        "$2.3$ 中的 $3$ 表示 $0.3$，$4.503$ 中的 $3$ 表示 $0.003$，所以前者是后者的 $100$ 倍。",
      ),
      generate(rng) {
        for (;;) {
          const i = rng.int(-1, 2);
          const j = rng.int(i + 1, 3);
          const a = numberWithDigitOnce(rng, i);
          const b = numberWithDigitOnce(rng, j);
          if (a.digit !== b.digit) continue;
          const d = a.digit;
          const times = pow10(j - i);
          return numberProblem({
            prompt: t(
              `The value of the ${d} in $${fix(a.n, 3)}$ is how many times the value of the ${d} in $${fix(b.n, 3)}$?`,
              `$${fix(a.n, 3)}$ 中的 ${d} 表示的值是 $${fix(b.n, 3)}$ 中的 ${d} 表示的值的多少倍？`,
            ),
            answer: times,
            form: "integer",
            wrong: [j - i, times * 10, Q.of(1, times)],
            solution: t(
              `The first ${d} is worth $${dq(D(d, 0).mul(placeValue(i)))}$ and the second $${dq(D(d, 0).mul(placeValue(j)))}$. The first is ${j - i} place${j - i === 1 ? "" : "s"} to the left, so it is worth $${times}$ times as much.`,
              `第一个 ${d} 表示 $${dq(D(d, 0).mul(placeValue(i)))}$，第二个表示 $${dq(D(d, 0).mul(placeValue(j)))}$。第一个在左边 ${j - i} 位，所以是 $${times}$ 倍。`,
            ),
          });
        }
      },
    },
    {
      id: "units-in-a-larger-place",
      title: t("Smaller units in a larger place", "大单位里有多少小单位"),
      explanation: t(
        "$1$ tenth is $10$ hundredths, so $7$ tenths is $70$ hundredths, or $700$ thousandths.",
        "$1$ 个十分之一是 $10$ 个百分之一，所以 $7$ 个十分之一是 $70$ 个百分之一，也就是 $700$ 个千分之一。",
      ),
      generate(rng) {
        const i = rng.int(0, 2);
        const j = rng.int(i + 1, 3);
        const k = rng.int(1, 9);
        const times = pow10(j - i);
        return numberProblem({
          prompt: t(
            `How many ${placeName(j).en} make ${k} ${k === 1 ? placeName(i).en.replace(/s$/, "") : placeName(i).en}?`,
            `${k} 个${unitZh(i)}是多少个${unitZh(j)}？`,
          ),
          answer: k * times,
          form: "integer",
          wrong: [k * times * 10, k * (j - i), times],
          solution: t(
            `Each ${placeName(i).en.replace(/s$/, "")} is $${times}$ ${placeName(j).en}, so ${k} of them make $${k} \\times ${times} = ${k * times}$.`,
            `每个${unitZh(i)}是 $${times}$ 个${unitZh(j)}，所以 ${k} 个是 $${k} \\times ${times} = ${k * times}$ 个。`,
          ),
        });
      },
    },
  ],
);

/** unitZh is the Chinese name of the unit of place k: 一、十分之一… */
function unitZh(k: number): string {
  return ["一", "十分之一", "百分之一", "千分之一"][k]!;
}

export const readingAndWritingDecimalsWrittenInWords = topic(
  "reading-and-writing-decimals-written-in-words",
  t("Reading and Writing Decimals Written in Words", "小数的读法和写法"),
  t(
    'To read a decimal in English, read the whole number, say "and" for the decimal point, then read the digits after the point as a whole number followed by the name of the last place: 3.45 is "three and forty-five hundredths", and 0.007 is "seven thousandths". In Chinese, read the whole part, say 点, then read each digit: 3.45 is 三点四五.',
    '英文读小数时，先读整数部分，小数点读作 "and"，再把小数部分当作整数读，后面加上最后一位的名称：3.45 读作 "three and forty-five hundredths"，0.007 读作 "seven thousandths"。中文读小数时，先读整数部分，小数点读作"点"，再依次读出小数部分的每个数字：3.45 读作三点四五。',
  ),
  ["the-place-value-system-with-decimals", "reading-whole-numbers-written-in-words"],
  ["5.NBT.A.3a"],
  [
    {
      id: "writing-decimals-from-words",
      title: t("From words to digits", "根据读法写小数"),
      explanation: t(
        '"Twelve and six hundredths" is $12.06$: the $6$ goes in the hundredths place.',
        '"十二点零六"写作 $12.06$：$6$ 在百分位上。',
      ),
      generate(rng) {
        const p = rng.int(1, 3);
        const whole = rng.bool(0.3) ? 0 : rng.int(1, 999);
        const part = rng.int(1, pow10(p) - 1);
        if (part % 10 === 0) return this.generate(rng);
        const n = whole * pow10(p) + part;
        return decProblem(
          t(`Write "${decimalWordsEn(n, p)}" as a decimal.`, `把"${decimalWordsZh(n, p)}"写成小数。`),
          D(n, p),
          [Q.of(whole).add(D(part, p - 1)), Q.of(whole).add(D(part, p + 1)), D(whole + part, p)],
          t(
            `The last place named is ${placeName(p).en}, so the ${part} ends in the ${placeName(p).en} place: $${fix(n, p)}$.`,
            `小数部分依次是 ${fix(n, p).split(".")[1]}，所以写作 $${fix(n, p)}$。`,
          ),
        );
      },
    },
    {
      id: "reading-decimals-in-words",
      title: t("From digits to words", "读出小数"),
      explanation: t('$5.072$ is read "five and seventy-two thousandths".', '$5.072$ 读作"五点零七二"。'),
      generate(rng) {
        const p = rng.int(2, 3);
        const whole = rng.int(0, 99);
        const part = rng.int(1, pow10(p - 1) * 9);
        if (part % 10 === 0) return this.generate(rng);
        const n = whole * pow10(p) + part;
        const moved = (q: number) => decimalWords(whole * pow10(q) + part, q);
        return pickChoice(
          rng,
          t(`How is $${fix(n, p)}$ read?`, `$${fix(n, p)}$ 怎么读？`),
          decimalWords(n, p),
          [moved(p - 1), moved(p + 1), decimalWords(whole * pow10(p) + Math.floor(part / 10) + (part % 10) * pow10(p - 1), p)].filter(
            (w) => w.en !== decimalWords(n, p).en,
          ),
          t(
            `The last digit is in the ${placeName(p).en} place, so it is read "${decimalWordsEn(n, p)}".`,
            `整数部分读作${wordsZh(whole)}，小数部分依次读出每个数字："${decimalWordsZh(n, p)}"。`,
          ),
        );
      },
    },
  ],
);

/** expandedSum writes n/10ᵖ in expanded form as a sum of place values: "4 + 0.3 + 0.007". */
function expandedSum(n: number, p: number, shift = 0): string {
  const s = String(n);
  const terms: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const d = Number(s[i]);
    const k = p - (s.length - 1 - i) + shift;
    if (d) terms.push(dq(Q.of(d).mul(placeValue(k))));
  }
  return terms.join(" + ");
}

/** expandedFractions writes n/10ᵖ in expanded form with unit fractions: "4 \times 1 + 3 \times \frac{1}{10}". */
function expandedFractions(n: number, p: number, shift = 0): string {
  const s = String(n);
  const terms: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const d = Number(s[i]);
    const k = p - (s.length - 1 - i) + shift;
    if (d) terms.push(`${d} \\times ${k > 0 ? fr(1, pow10(k)) : pow10(-k)}`);
  }
  return terms.join(" + ");
}

export const convertingDecimalsFromStandardToExpandedForm = topic(
  "converting-decimals-from-standard-to-expanded-form",
  t("Converting Decimals From Standard to Expanded Form", "把小数写成展开式"),
  t(
    "Expanded form writes a number as the sum of the values of its digits. 4.307 = 4 + 0.3 + 0.007, or with fractions, 4 × 1 + 3 × 1/10 + 7 × 1/1000. Digits that are 0 add nothing and can be left out.",
    "展开式把一个数写成各个数位上数字所表示的值的和。4.307 = 4 + 0.3 + 0.007，用分数写是 4 × 1 + 3 × 1/10 + 7 × 1/1000。数字 0 不增加任何值，可以省略。",
  ),
  ["the-place-value-system-with-decimals", "converting-from-standard-form-to-expanded-form"],
  ["5.NBT.A.3a"],
  [
    {
      id: "expanded-form-with-decimals",
      title: t("Expanded form with decimals", "用小数写展开式"),
      explanation: t("$26.04 = 20 + 6 + 0.04$.", "$26.04 = 20 + 6 + 0.04$。"),
      generate(rng) {
        const p = rng.int(2, 3);
        const n = nonZeroEnd(rng, rng.int(p + 1, p + 2));
        return pickChoice(
          rng,
          t(`Which is the expanded form of $${fix(n, p)}$?`, `$${fix(n, p)}$ 的展开式是哪一个？`),
          mathText(expandedSum(n, p)),
          [
            mathText(expandedSum(n, p, 1)),
            mathText(expandedSum(n, p, -1)),
            mathText(expandedSum(Number(String(n).split("").reverse().join("")), p)),
          ],
          t(
            `Write the value of each nonzero digit and add: $${fix(n, p)} = ${expandedSum(n, p)}$.`,
            `写出每个非零数字表示的值，再相加：$${fix(n, p)} = ${expandedSum(n, p)}$。`,
          ),
        );
      },
    },
    {
      id: "expanded-form-with-fractions",
      title: t("Expanded form with fractions", "用分数写展开式"),
      explanation: t(
        "$3.58 = 3 \\times 1 + 5 \\times \\frac{1}{10} + 8 \\times \\frac{1}{100}$.",
        "$3.58 = 3 \\times 1 + 5 \\times \\frac{1}{10} + 8 \\times \\frac{1}{100}$。",
      ),
      generate(rng) {
        const p = rng.int(2, 3);
        const n = nonZeroEnd(rng, rng.int(p + 1, p + 2));
        return pickChoice(
          rng,
          t(`Which is the expanded form of $${fix(n, p)}$?`, `$${fix(n, p)}$ 的展开式是哪一个？`),
          mathText(expandedFractions(n, p)),
          [
            mathText(expandedFractions(n, p, 1)),
            mathText(expandedFractions(n, p, -1)),
            mathText(expandedFractions(Number(String(n).split("").reverse().join("")), p)),
          ],
          t(
            `Each digit times the value of its place: $${fix(n, p)} = ${expandedFractions(n, p)}$.`,
            `每个数字乘它所在数位的计数单位：$${fix(n, p)} = ${expandedFractions(n, p)}$。`,
          ),
        );
      },
    },
  ],
);

export const convertingDecimalsFromExpandedToStandardForm = topic(
  "converting-decimals-from-expanded-to-standard-form",
  t("Converting Decimals From Expanded to Standard Form", "把展开式写成小数"),
  t(
    "To write an expanded form as a decimal, put each digit in its place and fill the empty places with 0: 5 + 0.03 + 0.008 = 5.038, since there are no tenths.",
    "把展开式写成小数时，把每个数字写在它的数位上，空着的数位补 0：5 + 0.03 + 0.008 = 5.038，因为十分位上没有数。",
  ),
  ["converting-decimals-from-standard-to-expanded-form", "converting-from-expanded-form-to-standard-form"],
  ["5.NBT.A.3a"],
  [
    {
      id: "standard-form-from-expanded-decimals",
      title: t("Every place filled", "每个数位都有数"),
      explanation: t("$7 + 0.2 + 0.06 + 0.001 = 7.261$.", "$7 + 0.2 + 0.06 + 0.001 = 7.261$。"),
      generate(rng) {
        for (;;) {
          const p = rng.int(2, 3);
          const n = randomWithDigits(rng, p + rng.int(1, 2));
          if (String(n).includes("0")) continue;
          return decProblem(
            t(`Write $${expandedSum(n, p)}$ as a decimal.`, `把 $${expandedSum(n, p)}$ 写成小数。`),
            D(n, p),
            [D(n, p - 1), D(n, p + 1)],
            t(`Put each digit in its place: $${fix(n, p)}$.`, `把每个数字写在它的数位上：$${fix(n, p)}$。`),
          );
        }
      },
    },
    {
      id: "standard-form-with-missing-places",
      title: t("Missing places and mixed order", "缺少数位或顺序打乱"),
      explanation: t(
        "$0.009 + 6 + 0.4 = 6.409$: there are no hundredths, so that place is $0$.",
        "$0.009 + 6 + 0.4 = 6.409$：百分位上没有数，所以写 $0$。",
      ),
      generate(rng) {
        for (;;) {
          const p = 3;
          const n = randomWithDigits(rng, rng.int(4, 5));
          const s = String(n);
          if (n % 10 === 0 || !s.slice(1).includes("0") || s.slice(1).split("0").length > 2) continue;
          const terms = rng.shuffle(expandedSum(n, p).split(" + "));
          const squeezed = Number(s.replace(/0/g, ""));
          return decProblem(
            t(`Write $${terms.join(" + ")}$ as a decimal.`, `把 $${terms.join(" + ")}$ 写成小数。`),
            D(n, p),
            [D(squeezed, p - 1), D(squeezed, p)],
            t(
              `Put each digit in its place and write $0$ in the empty place: $${fix(n, p)}$.`,
              `把每个数字写在它的数位上，空着的数位写 $0$：$${fix(n, p)}$。`,
            ),
          );
        }
      },
    },
  ],
);

export const equivalentDecimals = topic(
  "equivalent-decimals",
  t("Equivalent Decimals", "相等的小数"),
  t(
    "Writing zeros at the end of a decimal does not change its value: 0.4 = 0.40 = 0.400, since 4 tenths = 40 hundredths = 400 thousandths. A zero between the decimal point and a digit does change it: 0.04 is not 0.4.",
    "在小数的末尾添上 0，小数的大小不变：0.4 = 0.40 = 0.400，因为 4 个十分之一 = 40 个百分之一 = 400 个千分之一。但在小数点和数字之间添 0 会改变大小：0.04 不等于 0.4。",
  ),
  ["comparing-place-values-with-decimals", "comparing-decimals-up-to-hundredths"],
  ["5.NBT.A.3"],
  [
    {
      id: "recognizing-equivalent-decimals",
      title: t("Recognizing equal decimals", "判断相等的小数"),
      explanation: t("$2.5 = 2.50$, but $2.5 \\ne 2.05$.", "$2.5 = 2.50$，但 $2.5 \\ne 2.05$。"),
      generate(rng) {
        const p = rng.int(1, 2);
        const n = nonZeroEnd(rng, p + rng.int(0, 2));
        const s = fix(n, p);
        const [w, f] = s.split(".") as [string, string];
        return pickChoice(
          rng,
          t(`Which decimal is equal to $${s}$?`, `哪个小数等于 $${s}$？`),
          mathText(`${s}0`),
          [mathText(`${w}.0${f}`), mathText(fix(n * 10, p)), mathText(fix(n, p + 1))],
          t(`Writing a zero at the end does not change the value: $${s} = ${s}0$.`, `在小数末尾添 0，大小不变：$${s} = ${s}0$。`),
        );
      },
    },
    {
      id: "rewriting-in-smaller-units",
      title: t("Rewriting in thousandths", "改写成千分之几"),
      explanation: t("$0.7 = 0.700 = \\frac{700}{1000}$.", "$0.7 = 0.700 = \\frac{700}{1000}$。"),
      generate(rng) {
        const p = rng.int(1, 2);
        const n = nonZeroEnd(rng, rng.int(1, p));
        const m = n * pow10(3 - p);
        return numberProblem({
          prompt: t(
            `Find the missing number: $${fix(n, p)} = ${fr("\\square", 1000)}$.`,
            `求方框中的数：$${fix(n, p)} = ${fr("\\square", 1000)}$。`,
          ),
          answer: m,
          form: "integer",
          wrong: [n, n * 10 === m ? n * 100 : n * 10],
          solution: t(
            `Write zeros to get thousandths: $${fix(n, p)} = ${fix(m, 3)} = ${fr(m, 1000)}$.`,
            `末尾添 0 化成千分位：$${fix(n, p)} = ${fix(m, 3)} = ${fr(m, 1000)}$。`,
          ),
        });
      },
    },
  ],
);

export const comparingDecimals = topic(
  "comparing-decimals",
  t("Comparing Decimals", "比较小数的大小"),
  t(
    "To compare decimals, compare the whole parts first; if they are equal, compare digit by digit from the tenths place, writing zeros at the end so both have the same number of places. 0.45 > 0.405, since 0.450 has 5 hundredths and 0.405 has 0. A longer decimal is not always greater.",
    "比较小数时，先比较整数部分；整数部分相同，就从十分位起逐位比较，可以在末尾添 0 让两个数的位数相同。0.45 > 0.405，因为 0.450 的百分位是 5，0.405 的百分位是 0。位数多的小数不一定大。",
  ),
  ["equivalent-decimals"],
  ["5.NBT.A.3b"],
  [
    {
      id: "comparing-two-decimals",
      title: t("Comparing two decimals", "比较两个小数"),
      explanation: t(
        "$3.09 < 3.1$, because $3.09$ has $0$ tenths and $3.10$ has $1$.",
        "$3.09 < 3.1$，因为 $3.09$ 的十分位是 $0$，$3.10$ 的十分位是 $1$。",
      ),
      generate(rng) {
        const w = rng.int(0, 20);
        const pa = rng.int(1, 3);
        const pb = rng.int(1, 3);
        let a = w * 1000 + rng.int(1, 999);
        let b = w * 1000 + rng.int(1, 999);
        a = truncInt(a, pow10(3 - pa)) + (a % pow10(3 - pa) === 0 ? 0 : 0);
        b = truncInt(b, pow10(3 - pb));
        if (rng.bool(0.15)) b = a;
        const as = dq(D(a, 3));
        const bs = rng.bool(0.5) && a === b ? fix(b, 3) : dq(D(b, 3));
        const rel = Math.sign(a - b) + 1;
        const P = 3;
        return compareProblem(
          as,
          bs,
          rel,
          t(
            `Write both with three decimal places: $${fix(a, P)}$ and $${fix(b, P)}$. Compare digit by digit: $${as} ${["<", "=", ">"][rel]} ${bs}$.`,
            `都写成三位小数：$${fix(a, P)}$ 和 $${fix(b, P)}$。逐位比较：$${as} ${["<", "=", ">"][rel]} ${bs}$。`,
          ),
        );
      },
    },
    {
      id: "greatest-and-least-decimal",
      title: t("The greatest or least decimal", "最大或最小的小数"),
      explanation: t(
        "Of $0.6$, $0.58$, $0.605$ and $0.06$, the greatest is $0.605$.",
        "在 $0.6$、$0.58$、$0.605$、$0.06$ 中，最大的是 $0.605$。",
      ),
      generate(rng) {
        const w = rng.int(0, 9);
        const d = rng.int(1, 9);
        const e = rng.int(1, 9);
        const vals = [w * 1000 + d * 100, w * 1000 + d * 100 + e, w * 1000 + d * 10, w * 1000 + (d - 1) * 100 + rng.int(10, 99)].filter(
          (v, i, arr) => arr.indexOf(v) === i && v > 0,
        );
        const greatest = rng.bool();
        const target = greatest ? Math.max(...vals) : Math.min(...vals);
        const texts = vals.map((v) => dq(D(v, 3)));
        return pickChoice(
          rng,
          greatest
            ? t(`Which is the greatest: ${texts.map((s) => `$${s}$`).join(", ")}?`, `哪个最大：${texts.map((s) => `$${s}$`).join("、")}？`)
            : t(`Which is the least: ${texts.map((s) => `$${s}$`).join(", ")}?`, `哪个最小：${texts.map((s) => `$${s}$`).join("、")}？`),
          mathText(dq(D(target, 3))),
          vals.filter((v) => v !== target).map((v) => mathText(dq(D(v, 3)))),
          t(
            `Write all with three decimal places: ${vals.map((v) => `$${fix(v, 3)}$`).join(", ")}. The ${greatest ? "greatest" : "least"} is $${dq(D(target, 3))}$.`,
            `都写成三位小数：${vals.map((v) => `$${fix(v, 3)}$`).join("、")}。${greatest ? "最大" : "最小"}的是 $${dq(D(target, 3))}$。`,
          ),
        );
      },
    },
  ],
);

/** roundTo rounds n/10ᵖ to place k (0 ones, 1 tenths, 2 hundredths), as a value. */
const roundTo = (n: number, p: number, k: number) => D(roundInt(n, pow10(p - k)), p);

/** truncTo cuts n/10ᵖ off after place k. */
const truncTo = (n: number, p: number, k: number) => D(truncInt(n, pow10(p - k)), p);

/** placeTarget names the place to round to: "the nearest whole number", "the nearest tenth"… */
const placeTarget = (k: number): Text =>
  [t("the nearest whole number", "个位（取整数）"), t("the nearest tenth", "十分位"), t("the nearest hundredth", "百分位")][k]!;

/** roundingSolution explains rounding n/10ᵖ to place k. */
function roundingSolution(n: number, p: number, k: number): Text {
  const next = digitAtPlace(n, p, k + 1);
  const r = roundTo(n, p, k);
  const up = next >= 5;
  return t(
    `Look at the digit after the ${k === 0 ? "ones" : placeName(k).en} place: ${next}. It is ${up ? "5 or more, so round up" : "less than 5, so round down"}: $${fix(n, p)} \\approx ${k > 0 ? fix(Number(r.mul(Q.of(pow10(k))).toString()), k) : dq(r)}$.`,
    `看${k === 0 ? "个位" : placeName(k)["zh-CN"]}后面一位的数字：${next}。它${up ? "大于或等于 5，所以进一" : "小于 5，所以舍去"}：$${fix(n, p)} \\approx ${k > 0 ? fix(Number(r.mul(Q.of(pow10(k))).toString()), k) : dq(r)}$。`,
  );
}

/** roundingProblem asks to round n/10ᵖ to place k. */
function roundingProblem(n: number, p: number, k: number): Problem {
  const up = digitAtPlace(n, p, k + 1) >= 5;
  return decProblem(
    t(`Round $${fix(n, p)}$ to ${placeTarget(k).en}.`, `把 $${fix(n, p)}$ 四舍五入到${placeTarget(k)["zh-CN"]}。`),
    roundTo(n, p, k),
    [up ? truncTo(n, p, k) : truncTo(n, p, k).add(placeValue(k)), roundTo(n, p, Math.min(k + 1, p)), roundTo(n, p, Math.max(k - 1, 0))],
    roundingSolution(n, p, k),
  );
}

/** decimalToRound draws n/10³ whose digit after place k is below 5 (down) or at least 5 (up). */
function decimalToRound(rng: Rng, k: number, up: boolean, nines = false): number {
  for (;;) {
    const n = rng.int(1000, 99999);
    const next = digitAtPlace(n, 3, k + 1);
    if (n % 10 === 0 || next >= 5 !== up) continue;
    if (nines !== (digitAtPlace(n, 3, k) === 9)) continue;
    return n;
  }
}

export const roundingDownDecimals = topic(
  "rounding-down-decimals",
  t("Rounding Down Decimals", "小数的四舍（舍去）"),
  t(
    "To round a decimal to a place, look at the digit just to its right. If it is less than 5, round down: keep the digit in the rounding place and drop everything after it. 4.731 rounded to the nearest tenth is 4.7, and 12.48 rounded to the nearest whole number is 12.",
    "把小数四舍五入到某一位，要看它右边一位的数字。如果小于 5，就舍去：保留这一位上的数字，去掉后面的所有数位。4.731 四舍五入到十分位是 4.7，12.48 四舍五入到个位是 12。",
  ),
  ["the-place-value-system-with-decimals", "rounding-down-whole-numbers"],
  ["5.NBT.A.4"],
  [
    {
      id: "rounding-down-to-whole-numbers-and-tenths",
      title: t("To a whole number or a tenth", "到个位或十分位"),
      explanation: t(
        "$8.342 \\approx 8.3$ to the nearest tenth, since the hundredths digit $4$ is less than $5$.",
        "$8.342$ 四舍五入到十分位约是 $8.3$，因为百分位上的 $4$ 小于 $5$。",
      ),
      generate(rng) {
        const k = rng.int(0, 1);
        return roundingProblem(decimalToRound(rng, k, false), 3, k);
      },
    },
    {
      id: "rounding-down-to-hundredths",
      title: t("To a hundredth", "到百分位"),
      explanation: t("$0.563 \\approx 0.56$ to the nearest hundredth.", "$0.563$ 四舍五入到百分位约是 $0.56$。"),
      generate: (rng) => roundingProblem(decimalToRound(rng, 2, false), 3, 2),
    },
  ],
);

export const roundingUpDecimals = topic(
  "rounding-up-decimals",
  t("Rounding Up Decimals", "小数的五入（进一）"),
  t(
    "If the digit to the right of the rounding place is 5 or more, round up: add 1 to the digit in the rounding place and drop everything after it. 6.258 to the nearest hundredth is 6.26. When the rounding digit is 9, the 1 carries: 3.96 to the nearest tenth is 4.0.",
    "如果要保留的数位右边一位的数字大于或等于 5，就进一：在保留的数位上加 1，去掉后面的所有数位。6.258 四舍五入到百分位是 6.26。保留的数位上是 9 时要继续进位：3.96 四舍五入到十分位是 4.0。",
  ),
  ["rounding-down-decimals", "rounding-up-whole-numbers"],
  ["5.NBT.A.4"],
  [
    {
      id: "rounding-up-to-a-place",
      title: t("Rounding up", "进一"),
      explanation: t(
        "$2.375 \\approx 2.38$ to the nearest hundredth, since the thousandths digit is $5$.",
        "$2.375$ 四舍五入到百分位约是 $2.38$，因为千分位上是 $5$。",
      ),
      generate(rng) {
        const k = rng.int(0, 2);
        return roundingProblem(decimalToRound(rng, k, true), 3, k);
      },
    },
    {
      id: "rounding-up-through-nines",
      title: t("Rounding up a 9", "保留位是 9 时进一"),
      explanation: t(
        "$5.97 \\approx 6.0$ to the nearest tenth: $9$ tenths plus $1$ tenth make a whole.",
        "$5.97$ 四舍五入到十分位约是 $6.0$：$9$ 个十分之一加 $1$ 个十分之一满一。",
      ),
      generate(rng) {
        const k = rng.int(0, 2);
        return roundingProblem(decimalToRound(rng, k, true, true), 3, k);
      },
    },
  ],
);

/** sigRound rounds the whole number n to s significant figures. */
function sigRound(n: number, s: number): number {
  const len = String(n).length;
  return len <= s ? n : roundInt(n, pow10(len - s));
}

/** sigFigures writes "1 significant figure" or "3 significant figures". */
const sigFigures = (s: number): Text => t(`${s} significant figure${s === 1 ? "" : "s"}`, `${s} 位有效数字`);

export const significantFigures = topic(
  "significant-figures",
  t("Significant Figures", "有效数字"),
  t(
    "The significant figures of a number are its digits starting from the first nonzero digit. To round to s significant figures, round to the place of the s-th significant figure: 48,372 to 1 significant figure is 50,000, and to 3 significant figures is 48,400.",
    "一个数从左边第一个不是 0 的数字起的各个数字，叫作它的有效数字。保留 s 位有效数字，就是四舍五入到第 s 个有效数字所在的数位：48,372 保留 1 位有效数字是 50,000，保留 3 位有效数字是 48,400。",
  ),
  ["rounding-up-whole-numbers"],
  [],
  [
    {
      id: "rounding-to-one-significant-figure",
      title: t("One significant figure", "保留 1 位有效数字"),
      explanation: t(
        "$7{,}462 \\approx 7{,}000$ to $1$ significant figure, and $865 \\approx 900$.",
        "$7{,}462$ 保留 $1$ 位有效数字约是 $7{,}000$，$865$ 约是 $900$。",
      ),
      generate(rng) {
        const n = randomWithDigits(rng, rng.int(3, 5));
        const v = sigRound(n, 1);
        const len = String(n).length;
        return numberProblem({
          prompt: t(`Round ${n} to 1 significant figure.`, `把 ${n} 保留 1 位有效数字。`),
          answer: v,
          form: "integer",
          wrong: [
            truncInt(n, pow10(len - 1)) === v ? v + pow10(len - 1) : truncInt(n, pow10(len - 1)),
            sigRound(n, 2),
            Math.floor(n / pow10(len - 1)) || 1,
          ],
          solution: t(
            `The first significant figure is in the ${["", "", "hundreds", "thousands", "ten thousands"][len - 1]} place; round there: ${n} ≈ ${v}.`,
            `第一个有效数字在${["", "", "百位", "千位", "万位"][len - 1]}上，四舍五入到这一位：${n} ≈ ${v}。`,
          ),
        });
      },
    },
    {
      id: "rounding-to-several-significant-figures",
      title: t("Two or three significant figures", "保留 2 或 3 位有效数字"),
      explanation: t(
        "$36{,}281 \\approx 36{,}000$ to $2$ significant figures and $36{,}300$ to $3$.",
        "$36{,}281$ 保留 $2$ 位有效数字约是 $36{,}000$，保留 $3$ 位约是 $36{,}300$。",
      ),
      generate(rng) {
        const s = rng.int(2, 3);
        const n = randomWithDigits(rng, rng.int(s + 1, 6));
        const v = sigRound(n, s);
        const len = String(n).length;
        return numberProblem({
          prompt: t(`Round ${n} to ${sigFigures(s).en}.`, `把 ${n} 保留 ${s} 位有效数字。`),
          answer: v,
          form: "integer",
          wrong: [
            truncInt(n, pow10(len - s)) === v ? v + pow10(len - s) : truncInt(n, pow10(len - s)),
            sigRound(n, s - 1),
            sigRound(n, s + 1),
          ],
          solution: t(
            `Keep the first ${s} digits and round at the ${s === 2 ? "second" : "third"} one: ${n} ≈ ${v}.`,
            `保留前 ${s} 个数字，在第 ${s} 个数字处四舍五入：${n} ≈ ${v}。`,
          ),
        });
      },
    },
  ],
);

/** sigDecimal rounds n/10ᵖ to s significant figures, as a value. */
function sigDecimal(n: number, p: number, s: number): Q {
  const len = String(n).length;
  return len <= s ? D(n, p) : D(roundInt(n, pow10(len - s)), p);
}

export const significantFiguresWithDecimals = topic(
  "significant-figures-with-decimals",
  t("Significant Figures With Decimals", "小数的有效数字"),
  t(
    "In a decimal, zeros before the first nonzero digit are not significant: 0.0473 has 3 significant figures, 4, 7 and 3. Rounding 0.0473 to 2 significant figures gives 0.047, and rounding 25.68 to 3 significant figures gives 25.7.",
    "在小数中，第一个非零数字前面的 0 不是有效数字：0.0473 有 3 位有效数字，即 4、7、3。0.0473 保留 2 位有效数字是 0.047，25.68 保留 3 位有效数字是 25.7。",
  ),
  ["significant-figures", "rounding-up-decimals"],
  [],
  [
    {
      id: "significant-figures-of-small-decimals",
      title: t("Decimals less than 1", "小于 1 的小数"),
      explanation: t(
        "$0.00586 \\approx 0.0059$ to $2$ significant figures: the zeros in front are not counted.",
        "$0.00586$ 保留 $2$ 位有效数字约是 $0.0059$：前面的 0 不算有效数字。",
      ),
      generate(rng) {
        const s = rng.int(1, 3);
        const n = nonZeroEnd(rng, s + rng.int(1, 2));
        const p = String(n).length + rng.int(1, 2);
        const v = sigDecimal(n, p, s);
        const len = String(n).length;
        return decProblem(
          t(`Round $${fix(n, p)}$ to ${sigFigures(s).en}.`, `把 $${fix(n, p)}$ 保留 ${s} 位有效数字。`),
          v,
          [D(truncInt(n, pow10(len - s)), p), sigDecimal(n, p, s + 1), roundTo(n, p, s)],
          t(
            `The significant figures start at the first nonzero digit. Round at the ${s === 1 ? "first" : s === 2 ? "second" : "third"} of them: $${fix(n, p)} \\approx ${dq(v)}$.`,
            `有效数字从第一个非零数字算起。在第 ${s} 个有效数字处四舍五入：$${fix(n, p)} \\approx ${dq(v)}$。`,
          ),
        );
      },
    },
    {
      id: "significant-figures-of-larger-decimals",
      title: t("Decimals greater than 1", "大于 1 的小数"),
      explanation: t("$14.276 \\approx 14.3$ to $3$ significant figures.", "$14.276$ 保留 $3$ 位有效数字约是 $14.3$。"),
      generate(rng) {
        const s = rng.int(2, 4);
        const p = rng.int(2, 3);
        const n = nonZeroEnd(rng, Math.max(s + 1, p + 1) + rng.int(0, 1));
        const v = sigDecimal(n, p, s);
        const len = String(n).length;
        return decProblem(
          t(`Round $${fix(n, p)}$ to ${sigFigures(s).en}.`, `把 $${fix(n, p)}$ 保留 ${s} 位有效数字。`),
          v,
          [D(truncInt(n, pow10(len - s)), p), sigDecimal(n, p, s + 1), sigDecimal(n, p, s - 1)],
          t(
            `Count ${s} digits from the first nonzero digit and round there: $${fix(n, p)} \\approx ${dq(v)}$.`,
            `从第一个非零数字起数 ${s} 位，在那一位四舍五入：$${fix(n, p)} \\approx ${dq(v)}$。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Adding and subtracting decimals

/** decimalNotHalf draws n/10ᵖ (whole part lo to hi) whose fractional part is not exactly one half. */
function decimalNotHalf(rng: Rng, lo: number, hi: number, p: number): number {
  for (;;) {
    const n = rng.int(lo * pow10(p), hi * pow10(p));
    if (n % 10 === 0 || n % pow10(p) === pow10(p) / 2) continue;
    return n;
  }
}

export const estimatingDecimalAdditionAndSubtraction = topic(
  "estimating-decimal-addition-and-subtraction",
  t("Estimating Decimal Addition and Subtraction", "估算小数加减法"),
  t(
    "To estimate a sum or difference of decimals, round each number to the nearest whole number first: 23.8 + 6.35 ≈ 24 + 6 = 30, and 41.2 − 17.71 ≈ 41 − 18 = 23.",
    "估算小数的和或差时，先把每个数四舍五入到整数：23.8 + 6.35 ≈ 24 + 6 = 30，41.2 − 17.71 ≈ 41 − 18 = 23。",
  ),
  ["rounding-up-decimals", "estimating-multi-digit-subtraction"],
  ["5.NBT.A.4"],
  [
    {
      id: "estimating-decimal-sums",
      title: t("Estimating sums", "估算和"),
      explanation: t("$7.62 + 15.3 \\approx 8 + 15 = 23$.", "$7.62 + 15.3 \\approx 8 + 15 = 23$。"),
      generate(rng) {
        const pa = rng.int(1, 2);
        const pb = rng.int(1, 2);
        const a = decimalNotHalf(rng, 1, 60, pa);
        const b = decimalNotHalf(rng, 1, 60, pb);
        const ra = roundInt(a, pow10(pa)) / pow10(pa);
        const rb = roundInt(b, pow10(pb)) / pow10(pb);
        return numberProblem({
          prompt: t(
            `Estimate $${fix(a, pa)} + ${fix(b, pb)}$ by rounding each number to the nearest whole number.`,
            `把每个数四舍五入到整数，估算 $${fix(a, pa)} + ${fix(b, pb)}$。`,
          ),
          answer: ra + rb,
          form: "integer",
          wrong: [Math.floor(a / pow10(pa)) + Math.floor(b / pow10(pb)), ra + rb + 1, ra + rb - 1],
          solution: t(
            `$${fix(a, pa)} \\approx ${ra}$ and $${fix(b, pb)} \\approx ${rb}$, so the sum is about $${ra} + ${rb} = ${ra + rb}$.`,
            `$${fix(a, pa)} \\approx ${ra}$，$${fix(b, pb)} \\approx ${rb}$，所以和约是 $${ra} + ${rb} = ${ra + rb}$。`,
          ),
        });
      },
    },
    {
      id: "estimating-decimal-differences",
      title: t("Estimating differences", "估算差"),
      explanation: t("$52.18 - 9.7 \\approx 52 - 10 = 42$.", "$52.18 - 9.7 \\approx 52 - 10 = 42$。"),
      generate(rng) {
        const pa = rng.int(1, 2);
        const pb = rng.int(1, 2);
        const a = decimalNotHalf(rng, 20, 90, pa);
        const b = decimalNotHalf(rng, 1, 19, pb);
        const ra = roundInt(a, pow10(pa)) / pow10(pa);
        const rb = roundInt(b, pow10(pb)) / pow10(pb);
        return numberProblem({
          prompt: t(
            `Estimate $${fix(a, pa)} - ${fix(b, pb)}$ by rounding each number to the nearest whole number.`,
            `把每个数四舍五入到整数，估算 $${fix(a, pa)} - ${fix(b, pb)}$。`,
          ),
          answer: ra - rb,
          form: "integer",
          wrong: [Math.floor(a / pow10(pa)) - Math.floor(b / pow10(pb)), ra + rb, ra - rb + 1],
          solution: t(
            `$${fix(a, pa)} \\approx ${ra}$ and $${fix(b, pb)} \\approx ${rb}$, so the difference is about $${ra} - ${rb} = ${ra - rb}$.`,
            `$${fix(a, pa)} \\approx ${ra}$，$${fix(b, pb)} \\approx ${rb}$，所以差约是 $${ra} - ${rb} = ${ra - rb}$。`,
          ),
        });
      },
    },
  ],
);

/** noCarrySum adds digit by digit, keeping only the ones digit of each column: the slip of forgetting to regroup. */
function noCarrySum(a: number, b: number): number {
  let out = 0;
  for (let f = 1; f <= Math.max(a, b); f *= 10) out += ((Math.floor(a / f) + Math.floor(b / f)) % 10) * f;
  return out;
}

/** noBorrowDifference subtracts the smaller digit from the larger in each column: the slip of not regrouping. */
function noBorrowDifference(a: number, b: number): number {
  let out = 0;
  for (let f = 1; f <= Math.max(a, b); f *= 10) out += Math.abs((Math.floor(a / f) % 10) - (Math.floor(b / f) % 10)) * f;
  return out;
}

/** columnSteps lines up two decimals at the decimal point, writing zeros so both have p places, and adds or subtracts. */
function columnSteps(a: number, pa: number, b: number, pb: number, sub: boolean): Text {
  const p = Math.max(pa, pb);
  const A = a * pow10(p - pa);
  const B = b * pow10(p - pb);
  const r = sub ? A - B : A + B;
  const op = sub ? "-" : "+";
  const pad =
    pa !== pb ? t(` Write zeros so both have ${p} decimal place${p === 1 ? "" : "s"}.`, `末尾添 0，使两个数都有 ${p} 位小数。`) : t("", "");
  const line = steps(`${fix(A, p)} ${op} ${fix(B, p)} = ${fix(r, p)}${r % 10 === 0 && p > 0 ? ` = ${dq(D(r, p))}` : ""}`);
  return t(
    `Line up the decimal points.${pad.en} Then ${sub ? "subtract" : "add"} as with whole numbers:${line}`,
    `把小数点对齐。${pad["zh-CN"]}再像整数一样${sub ? "相减" : "相加"}：${line}`,
  );
}

export const addingDecimals = topic(
  "adding-decimals",
  t("Adding Decimals", "小数加法"),
  t(
    "To add decimals, line up the decimal points so that digits in the same place are in the same column, add as with whole numbers, regrouping 10 tenths as 1 one and 10 hundredths as 1 tenth, and put the decimal point in the sum directly below the others: 3.48 + 2.75 = 6.23.",
    "小数相加时，把小数点对齐，使相同数位上的数字在同一列，然后像整数一样相加，10 个百分之一进 1 个十分之一，10 个十分之一进 1 个一，和的小数点与上面的小数点对齐：3.48 + 2.75 = 6.23。",
  ),
  ["adding-decimal-fractions", "equivalent-decimals", "adding-numbers-up-to-five-digits"],
  ["5.NBT.B.7"],
  [
    {
      id: "adding-tenths",
      title: t("Adding tenths", "一位小数相加"),
      explanation: t(
        "$4.7 + 2.6 = 7.3$: $7$ tenths and $6$ tenths make $13$ tenths, which is $1$ one and $3$ tenths.",
        "$4.7 + 2.6 = 7.3$：$7$ 个十分之一加 $6$ 个十分之一是 $13$ 个十分之一，即 $1$ 个一和 $3$ 个十分之一。",
      ),
      generate(rng) {
        const a = nonZeroEnd(rng, rng.int(2, 3));
        const b = nonZeroEnd(rng, rng.int(2, 3));
        return decProblem(
          t(`Find $${fix(a, 1)} + ${fix(b, 1)}$.`, `计算 $${fix(a, 1)} + ${fix(b, 1)}$。`),
          D(a + b, 1),
          [D(noCarrySum(a, b), 1), D(a + b, 2), D(a + b, 0)],
          columnSteps(a, 1, b, 1, false),
        );
      },
    },
    {
      id: "adding-hundredths",
      title: t("Adding hundredths", "两位小数相加"),
      explanation: t("$12.58 + 6.67 = 19.25$.", "$12.58 + 6.67 = 19.25$。"),
      generate(rng) {
        const a = nonZeroEnd(rng, rng.int(3, 4));
        const b = nonZeroEnd(rng, rng.int(3, 4));
        return decProblem(
          t(`Find $${fix(a, 2)} + ${fix(b, 2)}$.`, `计算 $${fix(a, 2)} + ${fix(b, 2)}$。`),
          D(a + b, 2),
          [D(noCarrySum(a, b), 2), D(a + b, 1), D(a + b, 3)],
          columnSteps(a, 2, b, 2, false),
        );
      },
    },
  ],
);

export const additionWithUnequalNumbersOfDecimals = topic(
  "addition-with-unequal-numbers-of-decimals",
  t("Addition With Unequal Numbers of Decimals", "小数位数不同的加法"),
  t(
    "When the numbers have different numbers of decimal places, line up the decimal points, not the last digits. Writing zeros at the end helps: 3.4 + 2.57 = 3.40 + 2.57 = 5.97. A whole number has its decimal point after the ones digit: 5 + 0.36 = 5.00 + 0.36 = 5.36.",
    "小数位数不同时，要对齐小数点，而不是对齐最后一位。在末尾添 0 会更清楚：3.4 + 2.57 = 3.40 + 2.57 = 5.97。整数的小数点在个位后面：5 + 0.36 = 5.00 + 0.36 = 5.36。",
  ),
  ["adding-decimals"],
  ["5.NBT.B.7"],
  [
    {
      id: "adding-decimals-with-different-places",
      title: t("Different numbers of decimal places", "小数位数不同"),
      explanation: t("$6.5 + 1.238 = 6.500 + 1.238 = 7.738$.", "$6.5 + 1.238 = 6.500 + 1.238 = 7.738$。"),
      generate(rng) {
        const pa = rng.int(1, 2);
        const pb = rng.int(pa + 1, 3);
        const a = nonZeroEnd(rng, pa + rng.int(1, 2));
        const b = nonZeroEnd(rng, pb + rng.int(0, 1));
        const [x, px, y, py] = rng.bool() ? [a, pa, b, pb] : [b, pb, a, pa];
        return decProblem(
          t(`Find $${fix(x, px)} + ${fix(y, py)}$.`, `计算 $${fix(x, px)} + ${fix(y, py)}$。`),
          D(x, px).add(D(y, py)),
          [D(a + b, pb), D(a + b, pa)],
          columnSteps(x, px, y, py, false),
        );
      },
    },
    {
      id: "adding-whole-numbers-and-decimals",
      title: t("A whole number and a decimal", "整数加小数"),
      explanation: t("$14 + 2.09 = 14.00 + 2.09 = 16.09$.", "$14 + 2.09 = 14.00 + 2.09 = 16.09$。"),
      generate(rng) {
        const w = rng.int(2, 60);
        const p = rng.int(1, 3);
        const b = nonZeroEnd(rng, p + rng.int(0, 1));
        return decProblem(
          t(`Find $${w} + ${fix(b, p)}$.`, `计算 $${w} + ${fix(b, p)}$。`),
          Q.of(w).add(D(b, p)),
          [D(w + b, p), D(w * 10 + b, p)],
          columnSteps(w, 0, b, p, false),
        );
      },
    },
  ],
);

export const subtractingDecimals = topic(
  "subtracting-decimals",
  t("Subtracting Decimals", "小数减法"),
  t(
    "To subtract decimals, line up the decimal points, subtract as with whole numbers, and regroup when a digit on top is too small: 1 one is 10 tenths, and 1 tenth is 10 hundredths. So 7.32 − 4.58 = 2.74.",
    "小数相减时，把小数点对齐，然后像整数一样相减；某一位不够减时向前一位借：1 个一是 10 个十分之一，1 个十分之一是 10 个百分之一。所以 7.32 − 4.58 = 2.74。",
  ),
  ["adding-decimals", "subtracting-numbers-up-to-five-digits"],
  ["5.NBT.B.7"],
  [
    {
      id: "subtracting-tenths",
      title: t("Subtracting tenths", "一位小数相减"),
      explanation: t("$8.2 - 3.6 = 4.6$: regroup $1$ one as $10$ tenths.", "$8.2 - 3.6 = 4.6$：从个位借 $1$ 当作 $10$ 个十分之一。"),
      generate(rng) {
        const a = nonZeroEnd(rng, rng.int(2, 3));
        const b = nonZeroEnd(rng, 2);
        if (b >= a) return this.generate(rng);
        return decProblem(
          t(`Find $${fix(a, 1)} - ${fix(b, 1)}$.`, `计算 $${fix(a, 1)} - ${fix(b, 1)}$。`),
          D(a - b, 1),
          [D(noBorrowDifference(a, b), 1), D(a - b, 2), D(a + b, 1)],
          columnSteps(a, 1, b, 1, true),
        );
      },
    },
    {
      id: "subtracting-hundredths",
      title: t("Subtracting hundredths", "两位小数相减"),
      explanation: t("$15.03 - 6.48 = 8.55$.", "$15.03 - 6.48 = 8.55$。"),
      generate(rng) {
        const a = nonZeroEnd(rng, rng.int(3, 4));
        const b = nonZeroEnd(rng, 3);
        if (b >= a) return this.generate(rng);
        return decProblem(
          t(`Find $${fix(a, 2)} - ${fix(b, 2)}$.`, `计算 $${fix(a, 2)} - ${fix(b, 2)}$。`),
          D(a - b, 2),
          [D(noBorrowDifference(a, b), 2), D(a - b, 1), D(a - b + 100, 2)],
          columnSteps(a, 2, b, 2, true),
        );
      },
    },
  ],
);

export const subtractionWithUnequalNumbersOfDecimals = topic(
  "subtraction-with-unequal-numbers-of-decimals",
  t("Subtraction With Unequal Numbers of Decimals", "小数位数不同的减法"),
  t(
    "When the numbers have different numbers of decimal places, write zeros so both have the same number of places, then subtract with regrouping: 5.2 − 1.75 = 5.20 − 1.75 = 3.45, and 9 − 3.48 = 9.00 − 3.48 = 5.52.",
    "小数位数不同时，先在末尾添 0 使位数相同，再相减（不够减时退位）：5.2 − 1.75 = 5.20 − 1.75 = 3.45，9 − 3.48 = 9.00 − 3.48 = 5.52。",
  ),
  ["subtracting-decimals", "addition-with-unequal-numbers-of-decimals"],
  ["5.NBT.B.7"],
  [
    {
      id: "subtracting-decimals-with-different-places",
      title: t("Different numbers of decimal places", "小数位数不同"),
      explanation: t("$6.4 - 2.83 = 6.40 - 2.83 = 3.57$.", "$6.4 - 2.83 = 6.40 - 2.83 = 3.57$。"),
      generate(rng) {
        for (;;) {
          const pa = rng.int(1, 2);
          const pb = rng.int(pa + 1, 3);
          const a = nonZeroEnd(rng, pa + rng.int(1, 2));
          const b = nonZeroEnd(rng, pb + rng.int(0, 1));
          const A = a * pow10(pb - pa);
          if (A <= b) continue;
          return decProblem(
            t(`Find $${fix(a, pa)} - ${fix(b, pb)}$.`, `计算 $${fix(a, pa)} - ${fix(b, pb)}$。`),
            D(A - b, pb),
            [D(noBorrowDifference(A, b), pb), D(Math.abs(a - b), pb), D(Math.abs(a - b), pa)],
            columnSteps(a, pa, b, pb, true),
          );
        }
      },
    },
    {
      id: "subtracting-decimals-from-whole-numbers",
      title: t("A whole number minus a decimal", "整数减小数"),
      explanation: t("$12 - 4.37 = 12.00 - 4.37 = 7.63$.", "$12 - 4.37 = 12.00 - 4.37 = 7.63$。"),
      generate(rng) {
        const p = rng.int(1, 2);
        const b = nonZeroEnd(rng, p + 1);
        const w = rng.int(Math.ceil(b / pow10(p)) + 1, 40);
        const W = w * pow10(p);
        return decProblem(
          t(`Find $${w} - ${fix(b, p)}$.`, `计算 $${w} - ${fix(b, p)}$。`),
          D(W - b, p),
          [D(noBorrowDifference(W, b), p), Q.of(w - Math.floor(b / pow10(p))).add(D(b % pow10(p), p)), D(W - b + pow10(p), p)],
          columnSteps(w, 0, b, p, true),
        );
      },
    },
  ],
);

const halfBenchmarks = [0, 50, 100];

/** nearHalf draws a decimal in hundredths within 0.09 of one of 0, 0.5, 1 (index k), with a whole part w. */
function nearHalf(rng: Rng, w: number, k: number): number {
  for (;;) {
    const off = rng.int(-9, 9);
    const v = halfBenchmarks[k]! + off;
    if (off === 0 || v <= 0 || v >= 100 || v % 10 === 0) continue;
    return w * 100 + v;
  }
}

const halfOptions = [0, 1, 2, 3, 4].map((h) => Q.of(h, 2));

export const estimatingDecimalAdditionWithBenchmarks = topic(
  "estimating-decimal-addition-with-benchmarks",
  t("Estimating Decimal Addition With Benchmarks", "用基准数估算小数加法"),
  t(
    "Decimals can be estimated with the benchmarks 0, 0.5 and 1, or with the nearest half: 0.48 is close to 0.5 and 0.93 is close to 1, so 0.48 + 0.93 ≈ 0.5 + 1 = 1.5. Likewise 3.47 + 2.04 ≈ 3.5 + 2 = 5.5.",
    '可以用基准数 0、0.5、1（或最接近的"几点五"）来估算小数：0.48 接近 0.5，0.93 接近 1，所以 0.48 + 0.93 ≈ 0.5 + 1 = 1.5。同样，3.47 + 2.04 ≈ 3.5 + 2 = 5.5。',
  ),
  ["estimating-decimal-addition-and-subtraction", "comparing-decimals"],
  ["5.NBT.B.7"],
  [
    {
      id: "adding-decimals-near-benchmarks",
      title: t("Benchmarks 0, 0.5 and 1", "基准数 0、0.5、1"),
      explanation: t("$0.07 + 0.52 \\approx 0 + 0.5 = 0.5$.", "$0.07 + 0.52 \\approx 0 + 0.5 = 0.5$。"),
      generate(rng) {
        const k1 = rng.int(0, 2);
        const k2 = rng.int(0, 2);
        const a = nearHalf(rng, 0, k1);
        const b = nearHalf(rng, 0, k2);
        const est = Q.of(k1 + k2, 2);
        return choiceProblem({
          prompt: t(
            `Estimate $${fix(a, 2)} + ${fix(b, 2)}$ using the benchmarks $0$, $0.5$ and $1$.`,
            `用基准数 $0$、$0.5$、$1$ 估算 $${fix(a, 2)} + ${fix(b, 2)}$。`,
          ),
          options: halfOptions.map((q) => mathText(dq(q))),
          correct: k1 + k2,
          solution: t(
            `$${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}$ and $${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}$, so the sum is about $${dq(est)}$.`,
            `$${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}$，$${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}$，所以和约是 $${dq(est)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-decimals-to-the-nearest-half",
      title: t("Rounding to the nearest half", '近似到最接近的"几点五"'),
      explanation: t("$6.53 + 2.96 \\approx 6.5 + 3 = 9.5$.", "$6.53 + 2.96 \\approx 6.5 + 3 = 9.5$。"),
      generate(rng) {
        const k1 = rng.int(0, 2);
        const k2 = rng.int(0, 2);
        const w1 = rng.int(1, 20);
        const w2 = rng.int(1, 20);
        const a = nearHalf(rng, w1, k1);
        const b = nearHalf(rng, w2, k2);
        const ea = Q.of(w1).add(Q.of(k1, 2));
        const eb = Q.of(w2).add(Q.of(k2, 2));
        return decProblem(
          t(
            `Estimate $${fix(a, 2)} + ${fix(b, 2)}$ by rounding each number to the nearest half.`,
            `把每个数近似到最接近的整数或"几点五"，估算 $${fix(a, 2)} + ${fix(b, 2)}$。`,
          ),
          ea.add(eb),
          [Q.of(w1 + w2), ea.add(eb).add(Q.of(1, 2)), D(a + b, 2)],
          t(
            `$${fix(a, 2)} \\approx ${dq(ea)}$ and $${fix(b, 2)} \\approx ${dq(eb)}$, so the sum is about $${dq(ea.add(eb))}$.`,
            `$${fix(a, 2)} \\approx ${dq(ea)}$，$${fix(b, 2)} \\approx ${dq(eb)}$，所以和约是 $${dq(ea.add(eb))}$。`,
          ),
        );
      },
    },
  ],
);

export const estimatingDecimalSubtractionWithBenchmarks = topic(
  "estimating-decimal-subtraction-with-benchmarks",
  t("Estimating Decimal Subtraction With Benchmarks", "用基准数估算小数减法"),
  t(
    "Differences of decimals can be estimated the same way: 0.91 − 0.47 ≈ 1 − 0.5 = 0.5, and 8.04 − 2.53 ≈ 8 − 2.5 = 5.5.",
    "小数的差也可以这样估算：0.91 − 0.47 ≈ 1 − 0.5 = 0.5，8.04 − 2.53 ≈ 8 − 2.5 = 5.5。",
  ),
  ["estimating-decimal-addition-with-benchmarks"],
  ["5.NBT.B.7"],
  [
    {
      id: "subtracting-decimals-near-benchmarks",
      title: t("Benchmarks 0, 0.5 and 1", "基准数 0、0.5、1"),
      explanation: t("$0.96 - 0.08 \\approx 1 - 0 = 1$.", "$0.96 - 0.08 \\approx 1 - 0 = 1$。"),
      generate(rng) {
        let k1 = rng.int(0, 2);
        let k2 = rng.int(0, 2);
        if (k1 < k2) [k1, k2] = [k2, k1];
        let a = nearHalf(rng, 0, k1);
        let b = nearHalf(rng, 0, k2);
        if (a < b) [a, b] = [b, a];
        const est = Q.of(k1 - k2, 2);
        return choiceProblem({
          prompt: t(
            `Estimate $${fix(a, 2)} - ${fix(b, 2)}$ using the benchmarks $0$, $0.5$ and $1$.`,
            `用基准数 $0$、$0.5$、$1$ 估算 $${fix(a, 2)} - ${fix(b, 2)}$。`,
          ),
          options: halfOptions.slice(0, 3).map((q) => mathText(dq(q))),
          correct: k1 - k2,
          solution: t(
            `$${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}$ and $${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}$, so the difference is about $${dq(est)}$.`,
            `$${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}$，$${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}$，所以差约是 $${dq(est)}$。`,
          ),
        });
      },
    },
    {
      id: "subtracting-decimals-to-the-nearest-half",
      title: t("Rounding to the nearest half", '近似到最接近的"几点五"'),
      explanation: t("$12.47 - 3.98 \\approx 12.5 - 4 = 8.5$.", "$12.47 - 3.98 \\approx 12.5 - 4 = 8.5$。"),
      generate(rng) {
        const k1 = rng.int(0, 2);
        const k2 = rng.int(0, 2);
        const w2 = rng.int(1, 15);
        const w1 = w2 + rng.int(2, 20);
        const a = nearHalf(rng, w1, k1);
        const b = nearHalf(rng, w2, k2);
        const ea = Q.of(w1).add(Q.of(k1, 2));
        const eb = Q.of(w2).add(Q.of(k2, 2));
        return decProblem(
          t(
            `Estimate $${fix(a, 2)} - ${fix(b, 2)}$ by rounding each number to the nearest half.`,
            `把每个数近似到最接近的整数或"几点五"，估算 $${fix(a, 2)} - ${fix(b, 2)}$。`,
          ),
          ea.sub(eb),
          [Q.of(w1 - w2), ea.sub(eb).add(Q.of(1, 2)), D(a - b, 2)],
          t(
            `$${fix(a, 2)} \\approx ${dq(ea)}$ and $${fix(b, 2)} \\approx ${dq(eb)}$, so the difference is about $${dq(ea.sub(eb))}$.`,
            `$${fix(a, 2)} \\approx ${dq(ea)}$，$${fix(b, 2)} \\approx ${dq(eb)}$，所以差约是 $${dq(ea.sub(eb))}$。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Multiplying decimals

/** powerOfTen draws 10, 100 or 1000 as an exponent k. */
const powerOfTen = (rng: Rng, lo = 1, hi = 3) => rng.int(lo, hi);

/** shiftSolution explains multiplying or dividing n/10ᵖ by 10ᵏ by moving digits k places. */
function shiftSolution(n: number, p: number, k: number, times: boolean, byPoint: boolean): Text {
  const v = times ? D(n, p).mul(Q.of(pow10(k))) : D(n, p).div(Q.of(pow10(k)));
  const dir = times ? t("left", "左") : t("right", "右");
  const op = times ? "\\times" : "\\div";
  if (byPoint)
    return t(
      `${pow10(k)} has ${k} zero${k === 1 ? "" : "s"}, so move the decimal point ${k} place${k === 1 ? "" : "s"} to the ${times ? "right" : "left"}, writing zeros where needed: $${fix(n, p)} ${op} ${pow10(k)} = ${dq(v)}$.`,
      `${pow10(k)} 有 ${k} 个 0，所以把小数点向${times ? "右" : "左"}移动 ${k} 位，位数不够时补 0：$${fix(n, p)} ${op} ${pow10(k)} = ${dq(v)}$。`,
    );
  return t(
    `${times ? "Multiplying" : "Dividing"} by ${pow10(k)} moves every digit ${k} place${k === 1 ? "" : "s"} to the ${dir.en}, so each digit is worth ${pow10(k)} times ${times ? "more" : "less"}: $${fix(n, p)} ${op} ${pow10(k)} = ${dq(v)}$.`,
    `${times ? "乘" : "除以"} ${pow10(k)}，每个数字都向${dir["zh-CN"]}移动 ${k} 位，表示的值${times ? "扩大" : "缩小"}到原来的${times ? ` ${pow10(k)} 倍` : ` 1/${pow10(k)}`}：$${fix(n, p)} ${op} ${pow10(k)} = ${dq(v)}$。`,
  );
}

/** shiftProblem asks for n/10ᵖ × 10ᵏ or ÷ 10ᵏ. */
function shiftProblem(n: number, p: number, k: number, times: boolean, byPoint: boolean): Problem {
  const x = D(n, p);
  const f = Q.of(pow10(k));
  const v = times ? x.mul(f) : x.div(f);
  return decProblem(
    t(
      `Find $${fix(n, p)} ${times ? "\\times" : "\\div"} ${pow10(k)}$.`,
      `计算 $${fix(n, p)} ${times ? "\\times" : "\\div"} ${pow10(k)}$。`,
    ),
    v,
    [
      times ? x.div(f) : x.mul(f),
      times ? x.mul(Q.of(pow10(k + 1))) : x.div(Q.of(pow10(k + 1))),
      times ? x.mul(Q.of(pow10(k - 1))) : x.div(Q.of(pow10(k - 1))),
    ],
    shiftSolution(n, p, k, times, byPoint),
  );
}

/** missingPowerProblem asks for the power of ten in n/10ᵖ × □ = result (or ÷). */
function missingPowerProblem(n: number, p: number, k: number, times: boolean): Problem {
  const x = D(n, p);
  const v = times ? x.mul(Q.of(pow10(k))) : x.div(Q.of(pow10(k)));
  const op = times ? "\\times" : "\\div";
  return numberProblem({
    prompt: t(
      `Find the missing number: $${fix(n, p)} ${op} \\square = ${dq(v)}$.`,
      `求方框中的数：$${fix(n, p)} ${op} \\square = ${dq(v)}$。`,
    ),
    answer: pow10(k),
    form: "integer",
    wrong: [pow10(k + 1), pow10(k - 1) === 1 ? 1000 : pow10(k - 1), k],
    solution: t(
      `The decimal point moved ${k} place${k === 1 ? "" : "s"} to the ${times ? "right" : "left"}, so the number was ${times ? "multiplied" : "divided"} by $${pow10(k)}$.`,
      `小数点向${times ? "右" : "左"}移动了 ${k} 位，所以${times ? "乘" : "除以"}的是 $${pow10(k)}$。`,
    ),
  });
}

export const multiplyingDecimalsByPowersOfTenUsingPlaceValue = topic(
  "multiplying-decimals-by-powers-of-ten-using-place-value",
  t("Multiplying Decimals by Powers of Ten Using Place Value", "用数位理解小数乘 10、100、1000"),
  t(
    "Multiplying by 10 makes every digit worth 10 times as much, so each digit moves one place to the left: 3.47 × 10 = 34.7. Multiplying by 100 moves the digits two places and by 1000 three places: 3.47 × 100 = 347 and 3.47 × 1000 = 3470.",
    "乘 10，每个数字表示的值都扩大到原来的 10 倍，所以每个数字都向左移动一位：3.47 × 10 = 34.7。乘 100 向左移动两位，乘 1000 向左移动三位：3.47 × 100 = 347，3.47 × 1000 = 3470。",
  ),
  ["multiplying-numbers-by-powers-of-ten-using-place-value", "comparing-place-values-with-decimals"],
  ["5.NBT.A.2"],
  [
    {
      id: "multiplying-decimals-by-ten",
      title: t("Multiplying by 10", "乘 10"),
      explanation: t(
        "$0.58 \\times 10 = 5.8$: $5$ tenths become $5$ ones and $8$ hundredths become $8$ tenths.",
        "$0.58 \\times 10 = 5.8$：$5$ 个十分之一变成 $5$ 个一，$8$ 个百分之一变成 $8$ 个十分之一。",
      ),
      generate(rng) {
        const p = rng.int(1, 3);
        return shiftProblem(nonZeroEnd(rng, rng.int(Math.max(2, p), p + 2)), p, 1, true, false);
      },
    },
    {
      id: "multiplying-decimals-by-hundred-and-thousand",
      title: t("Multiplying by 100 and 1000", "乘 100 和 1000"),
      explanation: t(
        "$2.6 \\times 1000 = 2600$: each digit moves three places to the left.",
        "$2.6 \\times 1000 = 2600$：每个数字都向左移动三位。",
      ),
      generate(rng) {
        const p = rng.int(1, 3);
        return shiftProblem(nonZeroEnd(rng, rng.int(Math.max(2, p), p + 2)), p, powerOfTen(rng, 2, 3), true, false);
      },
    },
  ],
);

export const multiplyingDecimalsByPowersOfTenUsingDecimalPointPlacement = topic(
  "multiplying-decimals-by-powers-of-ten-using-decimal-point-placement",
  t("Multiplying Decimals by Powers of Ten Using Decimal Point Placement", "移动小数点做小数乘 10、100、1000"),
  t(
    "Moving every digit left is the same as moving the decimal point right. To multiply by 10, 100 or 1000, move the decimal point as many places to the right as there are zeros, writing zeros if needed: 0.054 × 100 = 5.4 and 1.2 × 1000 = 1200.",
    "每个数字向左移动，相当于小数点向右移动。乘 10、100 或 1000 时，有几个 0，就把小数点向右移动几位，位数不够时补 0：0.054 × 100 = 5.4，1.2 × 1000 = 1200。",
  ),
  ["multiplying-decimals-by-powers-of-ten-using-place-value"],
  ["5.NBT.A.2"],
  [
    {
      id: "moving-the-decimal-point-to-multiply",
      title: t("Moving the decimal point", "移动小数点"),
      explanation: t("$0.0365 \\times 1000 = 36.5$.", "$0.0365 \\times 1000 = 36.5$。"),
      generate(rng) {
        const p = rng.int(1, 4);
        return shiftProblem(nonZeroEnd(rng, rng.int(Math.max(1, p - 1), p + 2)), p, powerOfTen(rng), true, true);
      },
    },
    {
      id: "finding-the-power-of-ten-in-a-product",
      title: t("Finding the power of ten", "求乘的是 10、100 还是 1000"),
      explanation: t(
        "$0.072 \\times \\square = 72$: the point moved three places, so the missing number is $1000$.",
        "$0.072 \\times \\square = 72$：小数点移动了三位，所以方框中是 $1000$。",
      ),
      generate(rng) {
        const p = rng.int(1, 3);
        return missingPowerProblem(nonZeroEnd(rng, rng.int(Math.max(1, p - 1), p + 2)), p, powerOfTen(rng), true);
      },
    },
  ],
);

export const estimatingDecimalMultiplication = topic(
  "estimating-decimal-multiplication",
  t("Estimating Decimal Multiplication", "估算小数乘法"),
  t(
    "To estimate a product of decimals, round each decimal to the nearest whole number and multiply: 4.8 × 7 ≈ 5 × 7 = 35, and 6.2 × 3.9 ≈ 6 × 4 = 24. An estimate helps check where the decimal point goes in the exact product.",
    "估算小数的积时，把每个小数四舍五入到整数再相乘：4.8 × 7 ≈ 5 × 7 = 35，6.2 × 3.9 ≈ 6 × 4 = 24。估算可以帮助检查准确的积中小数点的位置。",
  ),
  ["estimating-decimal-addition-and-subtraction", "estimating-multi-digit-multiplication"],
  ["5.NBT.B.7"],
  [
    {
      id: "estimating-a-decimal-times-a-whole-number",
      title: t("A decimal times a whole number", "小数乘整数"),
      explanation: t("$8.7 \\times 6 \\approx 9 \\times 6 = 54$.", "$8.7 \\times 6 \\approx 9 \\times 6 = 54$。"),
      generate(rng) {
        const a = decimalNotHalf(rng, 1, 12, 1);
        const w = rng.int(2, 12);
        const ra = roundInt(a, 10) / 10;
        return numberProblem({
          prompt: t(
            `Estimate $${fix(a, 1)} \\times ${w}$ by rounding the decimal to the nearest whole number.`,
            `把小数四舍五入到整数，估算 $${fix(a, 1)} \\times ${w}$。`,
          ),
          answer: ra * w,
          form: "integer",
          wrong: [Math.floor(a / 10) * w === ra * w ? (ra + 1) * w : Math.floor(a / 10) * w, ra + w, ra * w * 10],
          solution: t(
            `$${fix(a, 1)} \\approx ${ra}$, so the product is about $${ra} \\times ${w} = ${ra * w}$.`,
            `$${fix(a, 1)} \\approx ${ra}$，所以积约是 $${ra} \\times ${w} = ${ra * w}$。`,
          ),
        });
      },
    },
    {
      id: "estimating-a-decimal-times-a-decimal",
      title: t("A decimal times a decimal", "小数乘小数"),
      explanation: t("$5.3 \\times 2.8 \\approx 5 \\times 3 = 15$.", "$5.3 \\times 2.8 \\approx 5 \\times 3 = 15$。"),
      generate(rng) {
        const pa = rng.int(1, 2);
        const a = decimalNotHalf(rng, 1, 12, pa);
        const b = decimalNotHalf(rng, 1, 9, 1);
        const ra = roundInt(a, pow10(pa)) / pow10(pa);
        const rb = roundInt(b, 10) / 10;
        return numberProblem({
          prompt: t(
            `Estimate $${fix(a, pa)} \\times ${fix(b, 1)}$ by rounding each number to the nearest whole number.`,
            `把每个数四舍五入到整数，估算 $${fix(a, pa)} \\times ${fix(b, 1)}$。`,
          ),
          answer: ra * rb,
          form: "integer",
          wrong: [Math.floor(a / pow10(pa)) * Math.floor(b / 10), ra + rb, ra * rb * 10],
          solution: t(
            `$${fix(a, pa)} \\approx ${ra}$ and $${fix(b, 1)} \\approx ${rb}$, so the product is about $${ra} \\times ${rb} = ${ra * rb}$.`,
            `$${fix(a, pa)} \\approx ${ra}$，$${fix(b, 1)} \\approx ${rb}$，所以积约是 $${ra} \\times ${rb} = ${ra * rb}$。`,
          ),
        });
      },
    },
  ],
);

/** productSteps explains multiplying n/10ᵖ by m/10^q as whole numbers and placing the decimal point. */
function productSteps(n: number, p: number, m: number, q: number): Text {
  const P = p + q;
  const v = D(n * m, P);
  const places = (k: number, en: boolean) => (en ? `${k} decimal place${k === 1 ? "" : "s"}` : `${k} 位小数`);
  const factors =
    q === 0 ? `$${fix(n, p)}$ has ${places(p, true)}` : `$${fix(n, p)}$ and $${fix(m, q)}$ have ${p} + ${q} = ${P} decimal places in all`;
  const factorsZh = q === 0 ? `$${fix(n, p)}$ 有 ${p} 位小数` : `$${fix(n, p)}$ 和 $${fix(m, q)}$ 共有 ${p} + ${q} = ${P} 位小数`;
  return t(
    `Multiply as whole numbers: $${n} \\times ${m} = ${n * m}$. ${factors}, so the product has ${places(P, true)}: $${fix(n * m, P)}${fix(n * m, P) !== dq(v) ? ` = ${dq(v)}` : ""}$.`,
    `先按整数相乘：$${n} \\times ${m} = ${n * m}$。${factorsZh}，所以积有 ${P} 位小数：$${fix(n * m, P)}${fix(n * m, P) !== dq(v) ? ` = ${dq(v)}` : ""}$。`,
  );
}

/** productProblem asks for n/10ᵖ × m/10^q. */
function productProblem(n: number, p: number, m: number, q: number): Problem {
  const P = p + q;
  return decProblem(
    t(`Find $${fix(n, p)} \\times ${fix(m, q)}$.`, `计算 $${fix(n, p)} \\times ${fix(m, q)}$。`),
    D(n * m, P),
    [D(n * m, P - 1), D(n * m, P + 1), D(n * m, Math.max(p, q))],
    productSteps(n, p, m, q),
  );
}

export const multiplyingADecimalByAOneDigitWholeNumber = topic(
  "multiplying-a-decimal-by-a-one-digit-whole-number",
  t("Multiplying a Decimal by a One-Digit Whole Number", "小数乘一位数"),
  t(
    "To multiply a decimal by a whole number, multiply as if both were whole numbers, then give the product as many decimal places as the decimal has: 2.35 × 4: 235 × 4 = 940, and 2.35 has 2 decimal places, so 2.35 × 4 = 9.40 = 9.4.",
    "小数乘整数，先按整数乘法算出积，再看小数有几位小数，就从积的右边数出几位点上小数点：2.35 × 4：235 × 4 = 940，2.35 有 2 位小数，所以 2.35 × 4 = 9.40 = 9.4。",
  ),
  ["estimating-decimal-multiplication", "three-and-four-digit-by-one-digit-multiplication"],
  ["5.NBT.B.7"],
  [
    {
      id: "tenths-times-one-digit",
      title: t("Tenths times a one-digit number", "一位小数乘一位数"),
      explanation: t(
        "$3.6 \\times 7$: $36 \\times 7 = 252$, so the product is $25.2$.",
        "$3.6 \\times 7$：$36 \\times 7 = 252$，所以积是 $25.2$。",
      ),
      generate: (rng) => productProblem(nonZeroEnd(rng, rng.int(2, 3)), 1, rng.int(2, 9), 0),
    },
    {
      id: "hundredths-times-one-digit",
      title: t("Hundredths and thousandths times a one-digit number", "两三位小数乘一位数"),
      explanation: t(
        "$0.48 \\times 6$: $48 \\times 6 = 288$, so the product is $2.88$.",
        "$0.48 \\times 6$：$48 \\times 6 = 288$，所以积是 $2.88$。",
      ),
      generate(rng) {
        const p = rng.int(2, 3);
        return productProblem(nonZeroEnd(rng, rng.int(2, p + 1)), p, rng.int(2, 9), 0);
      },
    },
  ],
);

export const multiplyingADecimalByAMultiDigitWholeNumber = topic(
  "multiplying-a-decimal-by-a-multi-digit-whole-number",
  t("Multiplying a Decimal by a Multi-Digit Whole Number", "小数乘多位数"),
  t(
    "Multiplying a decimal by a multi-digit whole number works the same way: 3.6 × 24: 36 × 24 = 864, and 3.6 has 1 decimal place, so 3.6 × 24 = 86.4. An estimate (4 × 24 ≈ 100) confirms the decimal point.",
    "小数乘多位数的方法相同：3.6 × 24：36 × 24 = 864，3.6 有 1 位小数，所以 3.6 × 24 = 86.4。估算（4 × 24 ≈ 100）可以检验小数点的位置。",
  ),
  ["multiplying-a-decimal-by-a-one-digit-whole-number", "multi-digit-by-two-digit-multiplication"],
  ["5.NBT.B.7"],
  [
    {
      id: "decimal-times-two-digit-number",
      title: t("Times a two-digit number", "乘两位数"),
      explanation: t(
        "$1.25 \\times 16$: $125 \\times 16 = 2000$, so the product is $20.00 = 20$.",
        "$1.25 \\times 16$：$125 \\times 16 = 2000$，所以积是 $20.00 = 20$。",
      ),
      generate(rng) {
        const p = rng.int(1, 2);
        return productProblem(nonZeroEnd(rng, rng.int(2, 3)), p, rng.int(11, 99), 0);
      },
    },
    {
      id: "decimal-times-three-digit-number",
      title: t("Times a three-digit number", "乘三位数"),
      explanation: t(
        "$0.36 \\times 125$: $36 \\times 125 = 4500$, so the product is $45.00 = 45$.",
        "$0.36 \\times 125$：$36 \\times 125 = 4500$，所以积是 $45.00 = 45$。",
      ),
      generate(rng) {
        const p = rng.int(1, 3);
        return productProblem(nonZeroEnd(rng, rng.int(2, 3)), p, rng.int(101, 999), 0);
      },
    },
  ],
);

export const multiplyingTwoDigitDecimals = topic(
  "multiplying-two-digit-decimals",
  t("Multiplying Two-Digit Decimals", "两位数字的小数相乘"),
  t(
    "To multiply two decimals, multiply as whole numbers and give the product as many decimal places as both factors have together: 2.3 × 1.6: 23 × 16 = 368, and 1 + 1 = 2 places, so the product is 3.68. Likewise 0.4 × 0.7 = 0.28, since tenths times tenths are hundredths.",
    "两个小数相乘，先按整数相乘，再看两个因数一共有几位小数，积就有几位小数：2.3 × 1.6：23 × 16 = 368，1 + 1 = 2 位，所以积是 3.68。同样，0.4 × 0.7 = 0.28，因为十分之几乘十分之几得百分之几。",
  ),
  ["multiplying-a-decimal-by-a-multi-digit-whole-number"],
  ["5.NBT.B.7"],
  [
    {
      id: "tenths-times-tenths",
      title: t("Tenths times tenths", "一位小数乘一位小数"),
      explanation: t(
        "$4.5 \\times 1.2$: $45 \\times 12 = 540$, so the product is $5.40 = 5.4$.",
        "$4.5 \\times 1.2$：$45 \\times 12 = 540$，所以积是 $5.40 = 5.4$。",
      ),
      generate: (rng) => productProblem(nonZeroEnd(rng, 2), 1, nonZeroEnd(rng, rng.int(1, 2)), 1),
    },
    {
      id: "hundredths-times-tenths",
      title: t("Hundredths times tenths", "两位小数乘一位小数"),
      explanation: t(
        "$0.25 \\times 0.6$: $25 \\times 6 = 150$, so the product is $0.150 = 0.15$.",
        "$0.25 \\times 0.6$：$25 \\times 6 = 150$，所以积是 $0.150 = 0.15$。",
      ),
      generate: (rng) => productProblem(nonZeroEnd(rng, 2), 2, nonZeroEnd(rng, rng.int(1, 2)), 1),
    },
  ],
);

export const multiplyingTwoDigitDecimalsByThreeDigitDecimals = topic(
  "multiplying-two-digit-decimals-by-three-digit-decimals",
  t("Multiplying Two-Digit Decimals by Three-Digit Decimals", "两位数字与三位数字的小数相乘"),
  t(
    "The same rule works for longer decimals: 4.25 × 1.3: 425 × 13 = 5525, and 2 + 1 = 3 decimal places, so 4.25 × 1.3 = 5.525.",
    "位数更多的小数也用同样的方法：4.25 × 1.3：425 × 13 = 5525，2 + 1 = 3 位小数，所以 4.25 × 1.3 = 5.525。",
  ),
  ["multiplying-two-digit-decimals"],
  ["5.NBT.B.7"],
  [
    {
      id: "three-digit-decimal-times-tenths",
      title: t("Times tenths", "乘一位小数"),
      explanation: t(
        "$3.14 \\times 2.5$: $314 \\times 25 = 7850$, so the product is $7.850 = 7.85$.",
        "$3.14 \\times 2.5$：$314 \\times 25 = 7850$，所以积是 $7.850 = 7.85$。",
      ),
      generate: (rng) => productProblem(nonZeroEnd(rng, 3), rng.int(1, 2), nonZeroEnd(rng, 2), 1),
    },
    {
      id: "three-digit-decimal-times-hundredths",
      title: t("Times hundredths", "乘两位小数"),
      explanation: t(
        "$12.6 \\times 0.35$: $126 \\times 35 = 4410$, so the product is $4.410 = 4.41$.",
        "$12.6 \\times 0.35$：$126 \\times 35 = 4410$，所以积是 $4.410 = 4.41$。",
      ),
      generate: (rng) => productProblem(nonZeroEnd(rng, 3), rng.int(1, 3), nonZeroEnd(rng, 2), 2),
    },
  ],
);

export const multiplyingThreeDigitDecimals = topic(
  "multiplying-three-digit-decimals",
  t("Multiplying Three-Digit Decimals", "三位数字的小数相乘"),
  t(
    "To multiply 2.45 × 1.32, multiply 245 × 132 = 32,340 and count 2 + 2 = 4 decimal places: 2.45 × 1.32 = 3.2340 = 3.234. Estimating 2 × 1 = 2 or 2.5 × 1.3 ≈ 3 confirms the size.",
    "计算 2.45 × 1.32，先算 245 × 132 = 32,340，再数小数位数 2 + 2 = 4 位：2.45 × 1.32 = 3.2340 = 3.234。估算 2.5 × 1.3 ≈ 3 可以检验结果的大小。",
  ),
  ["multiplying-two-digit-decimals-by-three-digit-decimals", "three-digit-by-three-digit-multiplication"],
  ["5.NBT.B.7"],
  [
    {
      id: "three-digit-decimals-with-two-places",
      title: t("Both with two decimal places", "都是两位小数"),
      explanation: t(
        "$1.25 \\times 2.08$: $125 \\times 208 = 26000$, so the product is $2.6000 = 2.6$.",
        "$1.25 \\times 2.08$：$125 \\times 208 = 26000$，所以积是 $2.6000 = 2.6$。",
      ),
      generate: (rng) => productProblem(nonZeroEnd(rng, 3), 2, nonZeroEnd(rng, 3), 2),
    },
    {
      id: "three-digit-decimals-with-mixed-places",
      title: t("Different decimal places", "小数位数不同"),
      explanation: t(
        "$0.125 \\times 3.44$: $125 \\times 344 = 43000$, so the product is $0.43000 = 0.43$.",
        "$0.125 \\times 3.44$：$125 \\times 344 = 43000$，所以积是 $0.43000 = 0.43$。",
      ),
      generate: (rng) => productProblem(nonZeroEnd(rng, 3), rng.int(1, 3), nonZeroEnd(rng, 3), rng.int(1, 3)),
    },
  ],
);

// ---------------------------------------------------------------------------
// Dividing decimals

export const dividingDecimalsByPowersOfTenUsingPlaceValue = topic(
  "dividing-decimals-by-powers-of-ten-using-place-value",
  t("Dividing Decimals by Powers of Ten Using Place Value", "用数位理解小数除以 10、100、1000"),
  t(
    "Dividing by 10 makes every digit worth 1/10 as much, so each digit moves one place to the right: 34.7 ÷ 10 = 3.47. Dividing by 100 moves the digits two places and by 1000 three places: 34.7 ÷ 100 = 0.347 and 34.7 ÷ 1000 = 0.0347.",
    "除以 10，每个数字表示的值都缩小到原来的 1/10，所以每个数字都向右移动一位：34.7 ÷ 10 = 3.47。除以 100 向右移动两位，除以 1000 向右移动三位：34.7 ÷ 100 = 0.347，34.7 ÷ 1000 = 0.0347。",
  ),
  ["multiplying-decimals-by-powers-of-ten-using-place-value", "dividing-by-10-100-and-1000"],
  ["5.NBT.A.2"],
  [
    {
      id: "dividing-decimals-by-ten",
      title: t("Dividing by 10", "除以 10"),
      explanation: t(
        "$6.2 \\div 10 = 0.62$: $6$ ones become $6$ tenths and $2$ tenths become $2$ hundredths.",
        "$6.2 \\div 10 = 0.62$：$6$ 个一变成 $6$ 个十分之一，$2$ 个十分之一变成 $2$ 个百分之一。",
      ),
      generate(rng) {
        const p = rng.int(0, 2);
        return shiftProblem(nonZeroEnd(rng, rng.int(2, 4)), p, 1, false, false);
      },
    },
    {
      id: "dividing-decimals-by-hundred-and-thousand",
      title: t("Dividing by 100 and 1000", "除以 100 和 1000"),
      explanation: t(
        "$45.3 \\div 100 = 0.453$: each digit moves two places to the right.",
        "$45.3 \\div 100 = 0.453$：每个数字都向右移动两位。",
      ),
      generate(rng) {
        const p = rng.int(0, 2);
        return shiftProblem(nonZeroEnd(rng, rng.int(2, 4)), p, powerOfTen(rng, 2, 3), false, false);
      },
    },
  ],
);

export const dividingDecimalsByPowersOfTenUsingDecimalPointPlacement = topic(
  "dividing-decimals-by-powers-of-ten-using-decimal-point-placement",
  t("Dividing Decimals by Powers of Ten Using Decimal Point Placement", "移动小数点做小数除以 10、100、1000"),
  t(
    "To divide by 10, 100 or 1000, move the decimal point as many places to the left as there are zeros, writing zeros in front if needed: 5.4 ÷ 100 = 0.054 and 73 ÷ 1000 = 0.073.",
    "除以 10、100 或 1000 时，有几个 0，就把小数点向左移动几位，位数不够时在前面补 0：5.4 ÷ 100 = 0.054，73 ÷ 1000 = 0.073。",
  ),
  ["dividing-decimals-by-powers-of-ten-using-place-value", "multiplying-decimals-by-powers-of-ten-using-decimal-point-placement"],
  ["5.NBT.A.2"],
  [
    {
      id: "moving-the-decimal-point-to-divide",
      title: t("Moving the decimal point", "移动小数点"),
      explanation: t("$8.6 \\div 1000 = 0.0086$.", "$8.6 \\div 1000 = 0.0086$。"),
      generate(rng) {
        const p = rng.int(0, 2);
        return shiftProblem(nonZeroEnd(rng, rng.int(1, 4)), p, powerOfTen(rng), false, true);
      },
    },
    {
      id: "finding-the-power-of-ten-in-a-quotient",
      title: t("Finding the power of ten", "求除以的是 10、100 还是 1000"),
      explanation: t(
        "$52 \\div \\square = 0.052$: the point moved three places, so the missing number is $1000$.",
        "$52 \\div \\square = 0.052$：小数点移动了三位，所以方框中是 $1000$。",
      ),
      generate(rng) {
        const p = rng.int(0, 2);
        return missingPowerProblem(nonZeroEnd(rng, rng.int(1, 4)), p, powerOfTen(rng), false);
      },
    },
  ],
);

export const estimatingDecimalDivision = topic(
  "estimating-decimal-division",
  t("Estimating Decimal Division", "估算小数除法"),
  t(
    "To estimate a quotient, replace the numbers with nearby compatible numbers that divide easily: 41.7 ÷ 6 ≈ 42 ÷ 6 = 7, and 26.8 ÷ 2.9 ≈ 27 ÷ 3 = 9.",
    "估算商时，把数换成相近的、容易整除的相容数：41.7 ÷ 6 ≈ 42 ÷ 6 = 7，26.8 ÷ 2.9 ≈ 27 ÷ 3 = 9。",
  ),
  ["estimating-decimal-multiplication", "estimating-multi-digit-division"],
  ["5.NBT.B.7"],
  [
    {
      id: "estimating-a-decimal-divided-by-a-whole-number",
      title: t("Dividing by a whole number", "除以整数"),
      explanation: t("$55.3 \\div 7 \\approx 56 \\div 7 = 8$.", "$55.3 \\div 7 \\approx 56 \\div 7 = 8$。"),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        let off = rng.int(-9, 9);
        if (off === 0) off = 4;
        const n = q * d * 10 + off;
        return numberProblem({
          prompt: t(`Estimate $${fix(n, 1)} \\div ${d}$ using compatible numbers.`, `用相容数估算 $${fix(n, 1)} \\div ${d}$。`),
          answer: q,
          form: "integer",
          wrong: [q * 10, q + 1, q - 1],
          solution: t(
            `$${fix(n, 1)}$ is close to $${q * d}$, which divides evenly by ${d}: $${q * d} \\div ${d} = ${q}$.`,
            `$${fix(n, 1)}$ 接近 $${q * d}$，而 $${q * d}$ 能被 ${d} 整除：$${q * d} \\div ${d} = ${q}$。`,
          ),
        });
      },
    },
    {
      id: "estimating-a-decimal-divided-by-a-decimal",
      title: t("Dividing by a decimal", "除以小数"),
      explanation: t("$35.6 \\div 4.1 \\approx 36 \\div 4 = 9$.", "$35.6 \\div 4.1 \\approx 36 \\div 4 = 9$。"),
      generate(rng) {
        const d = rng.int(2, 9);
        const q = rng.int(2, 12);
        const e = d * 10 + rng.pick([-2, -1, 1, 2]);
        const n = q * d * 10 + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        return numberProblem({
          prompt: t(
            `Estimate $${fix(n, 1)} \\div ${fix(e, 1)}$ using compatible numbers.`,
            `用相容数估算 $${fix(n, 1)} \\div ${fix(e, 1)}$。`,
          ),
          answer: q,
          form: "integer",
          wrong: [q * 10, q + 1, Math.max(1, q - 1)],
          solution: t(
            `Round the divisor to $${d}$ and the dividend to $${q * d}$: $${q * d} \\div ${d} = ${q}$.`,
            `把除数看作 $${d}$，被除数看作 $${q * d}$：$${q * d} \\div ${d} = ${q}$。`,
          ),
        });
      },
    },
  ],
);

/** unitsSolution explains dividing n/10ᵖ by d by dividing a number of units (tenths, hundredths) by d. */
function unitsSolution(n: number, p: number, d: number): Text {
  const q = n / d;
  const unitEn = ["ones", "tenths", "hundredths", "thousandths"][p]!;
  return t(
    `$${fix(n, p)}$ is ${n} ${unitEn}. $${n} \\div ${d} = ${q}$, so the quotient is ${q} ${unitEn}: $${dq(D(q, p))}$.`,
    `$${fix(n, p)}$ 是 ${n} 个${unitZh(p)}。$${n} \\div ${d} = ${q}$，所以商是 ${q} 个${unitZh(p)}：$${dq(D(q, p))}$。`,
  );
}

export const dividingDecimalsUsingPlaceValueStrategies = topic(
  "dividing-decimals-using-place-value-strategies",
  t("Dividing Decimals Using Place Value Strategies", "用数位策略做小数除法"),
  t(
    "A decimal can be thought of as a number of tenths or hundredths. 2.4 ÷ 6: 2.4 is 24 tenths, and 24 tenths ÷ 6 = 4 tenths, so 2.4 ÷ 6 = 0.4. Likewise 0.56 ÷ 8: 56 hundredths ÷ 8 = 7 hundredths = 0.07.",
    "可以把小数看作若干个十分之一或百分之一。2.4 ÷ 6：2.4 是 24 个十分之一，24 个十分之一 ÷ 6 = 4 个十分之一，所以 2.4 ÷ 6 = 0.4。同样，0.56 ÷ 8：56 个百分之一 ÷ 8 = 7 个百分之一 = 0.07。",
  ),
  ["dividing-using-place-value-strategies", "comparing-place-values-with-decimals"],
  ["5.NBT.B.7"],
  [
    {
      id: "dividing-tenths",
      title: t("Dividing tenths", "除十分之几"),
      explanation: t(
        "$4.8 \\div 8 = 0.6$, since $48$ tenths $\\div 8 = 6$ tenths.",
        "$4.8 \\div 8 = 0.6$，因为 $48$ 个十分之一 $\\div 8 = 6$ 个十分之一。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const q = rng.int(1, 12);
        const n = q * d;
        if (n % 10 === 0) return this.generate(rng);
        return decProblem(
          t(`Find $${fix(n, 1)} \\div ${d}$.`, `计算 $${fix(n, 1)} \\div ${d}$。`),
          D(q, 1),
          [Q.of(q), D(q, 2), D(n * d, 1)],
          unitsSolution(n, 1, d),
        );
      },
    },
    {
      id: "dividing-hundredths",
      title: t("Dividing hundredths", "除百分之几"),
      explanation: t(
        "$0.63 \\div 9 = 0.07$, since $63$ hundredths $\\div 9 = 7$ hundredths.",
        "$0.63 \\div 9 = 0.07$，因为 $63$ 个百分之一 $\\div 9 = 7$ 个百分之一。",
      ),
      generate(rng) {
        const d = rng.int(2, 9);
        const q = rng.int(1, 12);
        const n = q * d;
        if (n % 10 === 0) return this.generate(rng);
        return decProblem(
          t(`Find $${fix(n, 2)} \\div ${d}$.`, `计算 $${fix(n, 2)} \\div ${d}$。`),
          D(q, 2),
          [D(q, 1), D(q, 3), Q.of(q)],
          unitsSolution(n, 2, d),
        );
      },
    },
  ],
);

/** placesOf is the number of decimal places of a terminating rational number. */
function placesOf(q: Q): number {
  const s = dq(q);
  return s.includes(".") ? s.length - s.indexOf(".") - 1 : 0;
}

/** wholeDivisionSolution explains a whole-number division continued past the decimal point. */
function wholeDivisionSolution(n: number, d: number): Text {
  const v = Q.of(n, d);
  const k = placesOf(v);
  const zeros = "0".repeat(k);
  return t(
    `Write $${n}$ as $${n}.${zeros}$ and keep dividing after the decimal point: $${n} \\div ${d} = ${dq(v)}$. Check: $${dq(v)} \\times ${d} = ${n}$.`,
    `把 $${n}$ 写成 $${n}.${zeros}$，在小数点后继续除：$${n} \\div ${d} = ${dq(v)}$。检验：$${dq(v)} \\times ${d} = ${n}$。`,
  );
}

export const divisionOfWholeNumbersWithDecimalQuotients = topic(
  "division-of-whole-numbers-with-decimal-quotients",
  t("Division of Whole Numbers With Decimal Quotients", "商是小数的整数除法"),
  t(
    "When a division of whole numbers leaves a remainder, writing zeros after the decimal point lets the division continue: 7 ÷ 4 = 7.00 ÷ 4 = 1.75. The remainder 3 is 30 tenths, which gives 7 tenths with 2 tenths left, and 20 hundredths give 5 hundredths.",
    "整数除法有余数时，可以在被除数的小数点后添 0 继续除：7 ÷ 4 = 7.00 ÷ 4 = 1.75。余数 3 是 30 个十分之一，商 7 个十分之一还余 2 个十分之一，20 个百分之一再商 5 个百分之一。",
  ),
  ["four-digit-by-one-digit-division", "equivalent-decimals", "dividing-decimals-using-place-value-strategies"],
  ["5.NBT.B.7"],
  [
    {
      id: "decimal-quotients-with-one-digit-divisors",
      title: t("One-digit divisors", "除数是一位数"),
      explanation: t("$23 \\div 8 = 2.875$.", "$23 \\div 8 = 2.875$。"),
      generate(rng) {
        const d = rng.pick([2, 4, 5, 8]);
        let n = rng.int(3, 200);
        while (n % d === 0) n++;
        const v = Q.of(n, d);
        const q = Math.floor(n / d);
        return decProblem(
          t(`Find $${n} \\div ${d}$. Write the answer as a decimal.`, `计算 $${n} \\div ${d}$，结果写成小数。`),
          v,
          [Q.of(q).add(D(n % d, 1)), Q.of(q).add(D(n % d, 2)), Q.of(q)],
          wholeDivisionSolution(n, d),
        );
      },
    },
    {
      id: "decimal-quotients-with-two-digit-divisors",
      title: t("Two-digit divisors", "除数是两位数"),
      explanation: t("$63 \\div 12 = 5.25$.", "$63 \\div 12 = 5.25$。"),
      generate(rng) {
        for (;;) {
          const d = rng.int(12, 50);
          const n = rng.int(d + 1, 20 * d);
          const v = Q.of(n, d);
          if (n % d === 0) continue;
          let den = v.d;
          while (den % 2n === 0n) den /= 2n;
          while (den % 5n === 0n) den /= 5n;
          if (den !== 1n || placesOf(v) > 3) continue;
          const q = Math.floor(n / d);
          return decProblem(
            t(`Find $${n} \\div ${d}$. Write the answer as a decimal.`, `计算 $${n} \\div ${d}$，结果写成小数。`),
            v,
            [Q.of(q).add(D(n % d, 2)), Q.of(q), v.mul(Q.of(10))],
            wholeDivisionSolution(n, d),
          );
        }
      },
    },
  ],
);

/** roundQuotient rounds n/d to k decimal places, rounding halves up. */
const roundQuotient = (n: number, d: number, k: number) => Q.of(Math.floor((2 * n * pow10(k) + d) / (2 * d)), pow10(k));

export const divisionOfWholeNumbersWithDecimalQuotientsAndRounding = topic(
  "division-of-whole-numbers-with-decimal-quotients-and-rounding",
  t("Division of Whole Numbers With Decimal Quotients and Rounding", "商是小数的整数除法与四舍五入"),
  t(
    "Some divisions never end: 10 ÷ 3 = 3.333… Then divide to one place past the place asked for and round: to the nearest hundredth, 10 ÷ 3 ≈ 3.33, and 5 ÷ 7 = 0.714… ≈ 0.71.",
    "有些除法永远除不尽：10 ÷ 3 = 3.333……这时要比要求的数位多除一位，再四舍五入：保留两位小数，10 ÷ 3 ≈ 3.33，5 ÷ 7 = 0.714…… ≈ 0.71。",
  ),
  ["division-of-whole-numbers-with-decimal-quotients", "rounding-up-decimals"],
  ["5.NBT.B.7"],
  [
    {
      id: "rounding-quotients-to-tenths",
      title: t("To the nearest tenth", "保留一位小数"),
      explanation: t("$17 \\div 6 = 2.83\\ldots \\approx 2.8$.", "$17 \\div 6 = 2.83\\cdots \\approx 2.8$。"),
      generate(rng) {
        const d = rng.pick([3, 6, 7, 9, 11, 12]);
        let n = rng.int(2, 150);
        while (n % d === 0) n++;
        const v = roundQuotient(n, d, 1);
        const cut = Q.of(Math.floor((n * 10) / d), 10);
        return decProblem(
          t(`Find $${n} \\div ${d}$, rounded to the nearest tenth.`, `计算 $${n} \\div ${d}$，结果保留一位小数。`),
          v,
          [cut.eq(v) ? cut.add(D(1, 1)) : cut, roundQuotient(n, d, 2), Q.of(Math.floor(n / d)).add(D(n % d, 1))],
          t(
            `Divide to the hundredths: $${n} \\div ${d} = ${dq(Q.of(Math.floor((n * 100) / d), 100))}\\ldots$, then round to the tenths: $${dq(v)}$.`,
            `除到百分位：$${n} \\div ${d} = ${dq(Q.of(Math.floor((n * 100) / d), 100))}\\cdots$，再四舍五入到十分位：$${dq(v)}$。`,
          ),
        );
      },
    },
    {
      id: "rounding-quotients-to-hundredths",
      title: t("To the nearest hundredth", "保留两位小数"),
      explanation: t("$5 \\div 7 = 0.714\\ldots \\approx 0.71$.", "$5 \\div 7 = 0.714\\cdots \\approx 0.71$。"),
      generate(rng) {
        const d = rng.pick([3, 6, 7, 9, 11, 12, 13]);
        let n = rng.int(1, 100);
        while (n % d === 0) n++;
        const v = roundQuotient(n, d, 2);
        const cut = Q.of(Math.floor((n * 100) / d), 100);
        return decProblem(
          t(`Find $${n} \\div ${d}$, rounded to the nearest hundredth.`, `计算 $${n} \\div ${d}$，结果保留两位小数。`),
          v,
          [cut.eq(v) ? cut.add(D(1, 2)) : cut, roundQuotient(n, d, 1), roundQuotient(n, d, 3)],
          t(
            `Divide to the thousandths: $${n} \\div ${d} = ${dq(Q.of(Math.floor((n * 1000) / d), 1000))}\\ldots$, then round to the hundredths: $${dq(v)}$.`,
            `除到千分位：$${n} \\div ${d} = ${dq(Q.of(Math.floor((n * 1000) / d), 1000))}\\cdots$，再四舍五入到百分位：$${dq(v)}$。`,
          ),
        );
      },
    },
  ],
);

/** decimalDivisionSolution explains n/10ᵖ ÷ d (d a whole number) with the standard algorithm, by place value. */
function decimalDivisionSolution(n: number, p: number, d: number): Text {
  const q = D(n, p).div(Q.of(d));
  return t(
    `Divide as with whole numbers and put the decimal point in the quotient directly above the one in the dividend: $${fix(n, p)} \\div ${d} = ${dq(q)}$. Check: $${dq(q)} \\times ${d} = ${fix(n, p)}$.`,
    `像整数一样除，商的小数点要和被除数的小数点对齐：$${fix(n, p)} \\div ${d} = ${dq(q)}$。检验：$${dq(q)} \\times ${d} = ${fix(n, p)}$。`,
  );
}

export const dividingDecimalsUsingTheStandardAlgorithm = topic(
  "dividing-decimals-using-the-standard-algorithm",
  t("Dividing Decimals Using the Standard Algorithm", "用竖式做小数除以整数"),
  t(
    "To divide a decimal by a whole number, use long division as with whole numbers and put the decimal point in the quotient directly above the decimal point in the dividend: 9.36 ÷ 4 = 2.34. When a place gives no digit, write 0 in the quotient: 8.24 ÷ 4 = 2.06.",
    "小数除以整数，按整数除法的方法用竖式计算，商的小数点要和被除数的小数点对齐：9.36 ÷ 4 = 2.34。某一位不够商 1 时，要在商的这一位上写 0：8.24 ÷ 4 = 2.06。",
  ),
  ["division-of-whole-numbers-with-decimal-quotients", "dividing-by-two-digit-numbers-by-connecting-multiplication-and-division"],
  ["5.NBT.B.7"],
  [
    {
      id: "decimal-divided-by-one-digit-number",
      title: t("One-digit divisors", "除数是一位数"),
      explanation: t("$17.5 \\div 7 = 2.5$.", "$17.5 \\div 7 = 2.5$。"),
      generate(rng) {
        const d = rng.int(2, 9);
        const p = rng.int(1, 2);
        const q = nonZeroEnd(rng, rng.int(2, 3));
        const n = q * d;
        return decProblem(
          t(`Find $${fix(n, p)} \\div ${d}$.`, `计算 $${fix(n, p)} \\div ${d}$。`),
          D(q, p),
          [D(q, p - 1), D(q, p + 1), D(Number(String(q).replace(/0/g, "")), p)],
          decimalDivisionSolution(n, p, d),
        );
      },
    },
    {
      id: "decimal-divided-by-two-digit-number",
      title: t("Two-digit divisors", "除数是两位数"),
      explanation: t("$31.2 \\div 12 = 2.6$.", "$31.2 \\div 12 = 2.6$。"),
      generate(rng) {
        const d = rng.int(11, 40);
        const p = rng.int(1, 2);
        const q = nonZeroEnd(rng, rng.int(2, 3));
        const n = q * d;
        return decProblem(
          t(`Find $${fix(n, p)} \\div ${d}$.`, `计算 $${fix(n, p)} \\div ${d}$。`),
          D(q, p),
          [D(q, p - 1), D(q, p + 1), D(q + 1, p)],
          decimalDivisionSolution(n, p, d),
        );
      },
    },
  ],
);

/** decimalDivisor draws a decimal divisor e/10ᵉᵖ with a quotient q/10^qp such that the dividend has exactly `digits` digits. */
function decimalQuotient(
  rng: Rng,
  divisorDigits: number,
  dividendDigits: readonly number[],
): { a: number; pa: number; e: number; pe: number; q: Q } {
  for (;;) {
    const pe = rng.int(1, 2);
    const e = nonZeroEnd(rng, divisorDigits);
    const qp = rng.int(0, 1);
    const qn = nonZeroEnd(rng, rng.int(1, 3));
    const prod = e * qn;
    const pa = pe + qp;
    if (!dividendDigits.includes(String(prod).replace(/0+$/, "").length)) continue;
    let a = prod;
    let p = pa;
    while (p > 0 && a % 10 === 0) {
      a /= 10;
      p--;
    }
    if (String(a).length !== String(prod).replace(/0+$/, "").length) continue;
    return { a, pa: p, e, pe, q: D(qn, qp) };
  }
}

/** shiftedDivisionSteps explains dividing by a decimal by multiplying both numbers by a power of ten. */
function shiftedDivisionSteps(a: number, pa: number, e: number, pe: number, q: Q): Text {
  const A = D(a, pa).mul(Q.of(pow10(pe)));
  return t(
    `Multiply both numbers by $${pow10(pe)}$ so the divisor is a whole number: $${fix(a, pa)} \\div ${fix(e, pe)} = ${dq(A)} \\div ${e} = ${dq(q)}$. Check: $${dq(q)} \\times ${fix(e, pe)} = ${fix(a, pa)}$.`,
    `把被除数和除数都乘 $${pow10(pe)}$，使除数变成整数：$${fix(a, pa)} \\div ${fix(e, pe)} = ${dq(A)} \\div ${e} = ${dq(q)}$。检验：$${dq(q)} \\times ${fix(e, pe)} = ${fix(a, pa)}$。`,
  );
}

export const dividingThreeDigitDecimalsByTwoDigitDecimals = topic(
  "dividing-three-digit-decimals-by-two-digit-decimals",
  t("Dividing Three-Digit Decimals by Two-Digit Decimals", "三位数字的小数除以两位数字的小数"),
  t(
    "To divide by a decimal, multiply the dividend and the divisor by the same power of ten so that the divisor becomes a whole number; the quotient does not change. 8.64 ÷ 2.4 = 86.4 ÷ 24 = 3.6.",
    "除数是小数时，把被除数和除数同时乘同一个 10、100……使除数变成整数，商不变。8.64 ÷ 2.4 = 86.4 ÷ 24 = 3.6。",
  ),
  ["dividing-decimals-using-the-standard-algorithm", "multiplying-two-digit-decimals"],
  ["6.NS.B.3"],
  [
    {
      id: "making-the-divisor-a-whole-number",
      title: t("Making the divisor whole", "把除数变成整数"),
      explanation: t(
        "$0.756 \\div 0.36 = 75.6 \\div 36$: both numbers are multiplied by $100$.",
        "$0.756 \\div 0.36 = 75.6 \\div 36$：两个数都乘 $100$。",
      ),
      generate(rng) {
        const { a, pa, e, pe } = decimalQuotient(rng, 2, [3]);
        const A = D(a, pa).mul(Q.of(pow10(pe)));
        return pickChoice(
          rng,
          t(
            `Which division has the same quotient as $${fix(a, pa)} \\div ${fix(e, pe)}$ and a whole-number divisor?`,
            `哪个除法算式与 $${fix(a, pa)} \\div ${fix(e, pe)}$ 的商相同，并且除数是整数？`,
          ),
          mathText(`${dq(A)} \\div ${e}`),
          [
            mathText(`${fix(a, pa)} \\div ${e}`),
            mathText(`${dq(A.mul(Q.of(10)))} \\div ${e}`),
            mathText(`${dq(A.div(Q.of(10)))} \\div ${e}`),
          ],
          t(
            `Multiply both numbers by $${pow10(pe)}$: $${fix(a, pa)} \\div ${fix(e, pe)} = ${dq(A)} \\div ${e}$.`,
            `两个数都乘 $${pow10(pe)}$：$${fix(a, pa)} \\div ${fix(e, pe)} = ${dq(A)} \\div ${e}$。`,
          ),
        );
      },
    },
    {
      id: "dividing-by-a-two-digit-decimal",
      title: t("Finding the quotient", "求商"),
      explanation: t("$9.12 \\div 2.4 = 91.2 \\div 24 = 3.8$.", "$9.12 \\div 2.4 = 91.2 \\div 24 = 3.8$。"),
      generate(rng) {
        const { a, pa, e, pe, q } = decimalQuotient(rng, 2, [3]);
        return decProblem(
          t(`Find $${fix(a, pa)} \\div ${fix(e, pe)}$.`, `计算 $${fix(a, pa)} \\div ${fix(e, pe)}$。`),
          q,
          [q.mul(Q.of(10)), q.div(Q.of(10)), q.mul(Q.of(100))],
          shiftedDivisionSteps(a, pa, e, pe, q),
        );
      },
    },
  ],
);

export const dividingFourDigitAndFiveDigitDecimals = topic(
  "dividing-four-digit-and-five-digit-decimals",
  t("Dividing Four-Digit and Five-Digit Decimals", "四五位数字的小数除法"),
  t(
    "Longer decimals are divided the same way: make the divisor a whole number, then use long division. 45.36 ÷ 0.36 = 4536 ÷ 36 = 126, and 123.75 ÷ 2.5 = 1237.5 ÷ 25 = 49.5.",
    "位数更多的小数除法方法相同：先把除数变成整数，再用竖式计算。45.36 ÷ 0.36 = 4536 ÷ 36 = 126，123.75 ÷ 2.5 = 1237.5 ÷ 25 = 49.5。",
  ),
  ["dividing-three-digit-decimals-by-two-digit-decimals", "four-digit-by-two-digit-division"],
  ["6.NS.B.3"],
  [
    {
      id: "dividing-four-digit-decimals",
      title: t("Four-digit dividends", "被除数是四位数字"),
      explanation: t("$20.16 \\div 0.48 = 2016 \\div 48 = 42$.", "$20.16 \\div 0.48 = 2016 \\div 48 = 42$。"),
      generate(rng) {
        const { a, pa, e, pe, q } = decimalQuotient(rng, 2, [4]);
        return decProblem(
          t(`Find $${fix(a, pa)} \\div ${fix(e, pe)}$.`, `计算 $${fix(a, pa)} \\div ${fix(e, pe)}$。`),
          q,
          [q.mul(Q.of(10)), q.div(Q.of(10)), q.div(Q.of(100))],
          shiftedDivisionSteps(a, pa, e, pe, q),
        );
      },
    },
    {
      id: "dividing-five-digit-decimals",
      title: t("Five-digit dividends", "被除数是五位数字"),
      explanation: t("$148.35 \\div 4.3 = 1483.5 \\div 43 = 34.5$.", "$148.35 \\div 4.3 = 1483.5 \\div 43 = 34.5$。"),
      generate(rng) {
        const { a, pa, e, pe, q } = decimalQuotient(rng, rng.int(2, 3), [5]);
        return decProblem(
          t(`Find $${fix(a, pa)} \\div ${fix(e, pe)}$.`, `计算 $${fix(a, pa)} \\div ${fix(e, pe)}$。`),
          q,
          [q.mul(Q.of(10)), q.div(Q.of(10)), q.div(Q.of(100))],
          shiftedDivisionSteps(a, pa, e, pe, q),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Exponents

/** power is bᵉ as a LaTeX string, with the base in parentheses when it is a fraction or a decimal. */
const powTex = (base: string, e: number, paren = false) => `${paren ? `\\left(${base}\\right)` : base}^{${e}}`;

export const powersOfTen = topic(
  "powers-of-ten",
  t("Powers of Ten", "10 的乘方"),
  t(
    "A power of ten is 10 multiplied by itself some number of times. It is written with an exponent that counts the tens: 10³ = 10 × 10 × 10 = 1000. The exponent is the number of zeros after the 1: 10⁶ = 1,000,000.",
    "10 的乘方是若干个 10 相乘，用指数表示 10 的个数：10³ = 10 × 10 × 10 = 1000。指数等于 1 后面 0 的个数：10⁶ = 1,000,000。",
  ),
  ["multiplying-decimals-by-powers-of-ten-using-place-value"],
  ["5.NBT.A.2"],
  [
    {
      id: "evaluating-and-writing-powers-of-ten",
      title: t("Powers of ten and their values", "10 的乘方与它的值"),
      explanation: t("$10^4 = 10{,}000$, and $10 \\times 10 \\times 10 = 10^3$.", "$10^4 = 10{,}000$，$10 \\times 10 \\times 10 = 10^3$。"),
      generate(rng) {
        const k = rng.int(1, 9);
        const kind = rng.int(0, 2);
        if (kind === 0)
          return numberProblem({
            prompt: t(`What is the value of $10^{${k}}$?`, `$10^{${k}}$ 的值是多少？`),
            answer: pow10(k),
            form: "integer",
            wrong: [10 * k, pow10(k + 1), pow10(k - 1)],
            solution: t(
              `$10^{${k}}$ is $1$ followed by ${k} zero${k === 1 ? "" : "s"}: $${pow10(k)}$.`,
              `$10^{${k}}$ 是 $1$ 后面跟 ${k} 个 0：$${pow10(k)}$。`,
            ),
          });
        const shown = kind === 1 ? Array(k).fill("10").join(" \\times ") : String(pow10(k)).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");
        return numberProblem({
          prompt: t(`Find the exponent: $${shown} = 10^{\\square}$.`, `求指数：$${shown} = 10^{\\square}$。`),
          answer: k,
          form: "integer",
          wrong: [k + 1, k - 1, pow10(k)],
          solution:
            kind === 1
              ? t(`There are ${k} factors of 10, so the exponent is $${k}$.`, `一共有 ${k} 个 10 相乘，所以指数是 $${k}$。`)
              : t(
                  `$${shown}$ has ${k} zeros after the 1, so it is $10^{${k}}$.`,
                  `$${shown}$ 的 1 后面有 ${k} 个 0，所以它是 $10^{${k}}$。`,
                ),
        });
      },
    },
    {
      id: "comparing-powers-of-ten",
      title: t("How many times as large", "是几倍"),
      explanation: t("$10^5$ is $10^2 = 100$ times as large as $10^3$.", "$10^5$ 是 $10^3$ 的 $10^2 = 100$ 倍。"),
      generate(rng) {
        const b = rng.int(1, 7);
        const a = rng.int(b + 1, 8);
        return numberProblem({
          prompt: t(`$10^{${a}}$ is how many times as large as $10^{${b}}$?`, `$10^{${a}}$ 是 $10^{${b}}$ 的多少倍？`),
          answer: pow10(a - b),
          form: "integer",
          wrong: [a - b, pow10(a - b + 1), pow10(a) - pow10(b)],
          solution: t(
            `$10^{${a}}$ has ${a - b} more factor${a - b === 1 ? "" : "s"} of 10 than $10^{${b}}$, so it is $10^{${a - b}} = ${pow10(a - b)}$ times as large.`,
            `$10^{${a}}$ 比 $10^{${b}}$ 多 ${a - b} 个因数 10，所以是 $10^{${a - b}} = ${pow10(a - b)}$ 倍。`,
          ),
        });
      },
    },
  ],
);

/** big writes an integer with LaTeX thousands separators. */
const big = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

export const multiplyingNumbersByPowersOfTenWithExponents = topic(
  "multiplying-numbers-by-powers-of-ten-with-exponents",
  t("Multiplying Numbers by Powers of Ten With Exponents", "整数乘 10 的乘方"),
  t(
    "Multiplying a whole number by 10ᵏ writes k zeros after it: 37 × 10³ = 37,000, since 10³ = 1000. Conversely, 5,200,000 = 52 × 10⁵.",
    "整数乘 10ᵏ，就在它后面添上 k 个 0：37 × 10³ = 37,000，因为 10³ = 1000。反过来，5,200,000 = 52 × 10⁵。",
  ),
  ["powers-of-ten"],
  ["5.NBT.A.2"],
  [
    {
      id: "whole-number-times-a-power-of-ten",
      title: t("Finding the product", "求积"),
      explanation: t("$604 \\times 10^2 = 60{,}400$.", "$604 \\times 10^2 = 60{,}400$。"),
      generate(rng) {
        const n = rng.int(2, 999);
        const k = rng.int(1, 5);
        return numberProblem({
          prompt: t(`Find $${n} \\times 10^{${k}}$.`, `计算 $${n} \\times 10^{${k}}$。`),
          answer: n * pow10(k),
          form: "integer",
          wrong: [n * 10 * k, n * pow10(k + 1), n * pow10(k - 1)],
          solution: t(
            `$10^{${k}} = ${big(pow10(k))}$, so write ${k} zero${k === 1 ? "" : "s"} after ${n}: $${big(n * pow10(k))}$.`,
            `$10^{${k}} = ${big(pow10(k))}$，所以在 ${n} 后面添 ${k} 个 0：$${big(n * pow10(k))}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-exponent-in-a-product",
      title: t("Finding the exponent", "求指数"),
      explanation: t(
        "$48 \\times 10^{\\square} = 480{,}000$: four zeros were written, so the exponent is $4$.",
        "$48 \\times 10^{\\square} = 480{,}000$：添了四个 0，所以指数是 $4$。",
      ),
      generate(rng) {
        const n = nonZeroEnd(rng, rng.int(1, 3));
        const k = rng.int(1, 6);
        return numberProblem({
          prompt: t(
            `Find the exponent: $${n} \\times 10^{\\square} = ${big(n * pow10(k))}$.`,
            `求指数：$${n} \\times 10^{\\square} = ${big(n * pow10(k))}$。`,
          ),
          answer: k,
          form: "integer",
          wrong: [k + 1, k - 1, pow10(k)],
          solution: t(
            `$${big(n * pow10(k))}$ is ${n} followed by ${k} zero${k === 1 ? "" : "s"}, so the exponent is $${k}$.`,
            `$${big(n * pow10(k))}$ 是 ${n} 后面跟 ${k} 个 0，所以指数是 $${k}$。`,
          ),
        });
      },
    },
  ],
);

export const multiplyingDecimalsByPowersOfTenWithExponents = topic(
  "multiplying-decimals-by-powers-of-ten-with-exponents",
  t("Multiplying Decimals by Powers of Ten With Exponents", "小数乘 10 的乘方"),
  t(
    "Multiplying a decimal by 10ᵏ moves the decimal point k places to the right: 4.7 × 10² = 470 and 0.0356 × 10³ = 35.6.",
    "小数乘 10ᵏ，就把小数点向右移动 k 位：4.7 × 10² = 470，0.0356 × 10³ = 35.6。",
  ),
  ["multiplying-numbers-by-powers-of-ten-with-exponents", "multiplying-decimals-by-powers-of-ten-using-decimal-point-placement"],
  ["5.NBT.A.2"],
  [
    {
      id: "decimal-times-a-power-of-ten-with-an-exponent",
      title: t("Finding the product", "求积"),
      explanation: t("$2.85 \\times 10^4 = 28{,}500$.", "$2.85 \\times 10^4 = 28{,}500$。"),
      generate(rng) {
        const p = rng.int(1, 3);
        const n = nonZeroEnd(rng, rng.int(Math.max(1, p - 1), p + 2));
        const k = rng.int(1, 5);
        const v = D(n, p).mul(Q.of(pow10(k)));
        return decProblem(
          t(`Find $${fix(n, p)} \\times 10^{${k}}$.`, `计算 $${fix(n, p)} \\times 10^{${k}}$。`),
          v,
          [v.mul(Q.of(10)), v.div(Q.of(10)), D(n, p).mul(Q.of(10 * k))],
          t(
            `Move the decimal point ${k} place${k === 1 ? "" : "s"} to the right: $${fix(n, p)} \\times 10^{${k}} = ${v.isInteger() ? big(Number(v.n)) : dq(v)}$.`,
            `把小数点向右移动 ${k} 位：$${fix(n, p)} \\times 10^{${k}} = ${v.isInteger() ? big(Number(v.n)) : dq(v)}$。`,
          ),
        );
      },
    },
    {
      id: "finding-the-exponent-for-a-decimal",
      title: t("Finding the exponent", "求指数"),
      explanation: t(
        "$0.072 \\times 10^{\\square} = 720$: the point moved four places, so the exponent is $4$.",
        "$0.072 \\times 10^{\\square} = 720$：小数点移动了四位，所以指数是 $4$。",
      ),
      generate(rng) {
        const p = rng.int(1, 3);
        const n = nonZeroEnd(rng, rng.int(Math.max(1, p - 1), p + 2));
        const k = rng.int(1, 5);
        const v = D(n, p).mul(Q.of(pow10(k)));
        return numberProblem({
          prompt: t(
            `Find the exponent: $${fix(n, p)} \\times 10^{\\square} = ${v.isInteger() ? big(Number(v.n)) : dq(v)}$.`,
            `求指数：$${fix(n, p)} \\times 10^{\\square} = ${v.isInteger() ? big(Number(v.n)) : dq(v)}$。`,
          ),
          answer: k,
          form: "integer",
          wrong: [k + 1, k - 1, pow10(k)],
          solution: t(
            `The decimal point moved ${k} place${k === 1 ? "" : "s"} to the right, so the exponent is $${k}$.`,
            `小数点向右移动了 ${k} 位，所以指数是 $${k}$。`,
          ),
        });
      },
    },
  ],
);

/** repeated writes b × b × … × b with e factors. */
const repeated = (b: string, e: number) => Array(e).fill(b).join(" \\times ");

export const introductionToExponents = topic(
  "introduction-to-exponents",
  t("Introduction to Exponents", "认识乘方"),
  t(
    'An exponent tells how many times a number, the base, is used as a factor: 5⁴ = 5 × 5 × 5 × 5, with base 5 and exponent 4. It is read "5 to the fourth power". A number to the second power is its square and to the third power its cube. Note that 5⁴ is not 5 × 4.',
    '指数表示底数作为因数出现的次数：5⁴ = 5 × 5 × 5 × 5，底数是 5，指数是 4，读作"5 的 4 次方"。一个数的 2 次方也叫平方，3 次方也叫立方。注意 5⁴ 不是 5 × 4。',
  ),
  ["powers-of-ten"],
  ["6.EE.A.1"],
  [
    {
      id: "writing-repeated-multiplication-as-a-power",
      title: t("Writing a product as a power", "把连乘写成乘方"),
      explanation: t("$7 \\times 7 \\times 7 = 7^3$.", "$7 \\times 7 \\times 7 = 7^3$。"),
      generate(rng) {
        const b = rng.int(2, 12);
        const e = rng.int(2, 6);
        if (b === e) return this.generate(rng);
        return pickChoice(
          rng,
          t(`Which is equal to $${repeated(String(b), e)}$?`, `哪个等于 $${repeated(String(b), e)}$？`),
          mathText(powTex(String(b), e)),
          [mathText(powTex(String(e), b)), mathText(`${b} \\times ${e}`), mathText(powTex(String(b), e + 1))],
          t(
            `$${b}$ is used as a factor ${e} times, so the base is ${b} and the exponent is ${e}: $${powTex(String(b), e)}$.`,
            `$${b}$ 作为因数出现了 ${e} 次，所以底数是 ${b}，指数是 ${e}：$${powTex(String(b), e)}$。`,
          ),
        );
      },
    },
    {
      id: "expanding-a-power",
      title: t("Writing a power as a product", "把乘方写成连乘"),
      explanation: t("$4^5 = 4 \\times 4 \\times 4 \\times 4 \\times 4$.", "$4^5 = 4 \\times 4 \\times 4 \\times 4 \\times 4$。"),
      generate(rng) {
        const b = rng.int(2, 12);
        const e = rng.int(2, 6);
        if (b === e) return this.generate(rng);
        return pickChoice(
          rng,
          t(`Which is equal to $${powTex(String(b), e)}$?`, `哪个等于 $${powTex(String(b), e)}$？`),
          mathText(repeated(String(b), e)),
          [mathText(`${b} \\times ${e}`), mathText(repeated(String(e), b)), mathText(Array(e).fill(String(b)).join(" + "))],
          t(`The exponent ${e} says to use ${b} as a factor ${e} times.`, `指数 ${e} 表示 ${b} 作为因数出现 ${e} 次。`),
        );
      },
    },
  ],
);

/** powerProblem asks for the value of bᵉ (b a whole number). */
function powerProblem(b: number, e: number): Problem {
  const v = b ** e;
  return numberProblem({
    prompt: t(`Find $${powTex(String(b), e)}$.`, `计算 $${powTex(String(b), e)}$。`),
    answer: v,
    form: "integer",
    wrong: [b * e, b ** (e - 1), b <= 6 ? e ** b : v * b],
    solution: t(
      `$${powTex(String(b), e)} = ${repeated(String(b), e)} = ${big(v)}$.`,
      `$${powTex(String(b), e)} = ${repeated(String(b), e)} = ${big(v)}$。`,
    ),
  });
}

export const evaluatingExponents = topic(
  "evaluating-exponents",
  t("Evaluating Exponents", "计算乘方"),
  t(
    "To evaluate a power, multiply the base by itself as many times as the exponent says: 6² = 6 × 6 = 36 and 2⁴ = 2 × 2 × 2 × 2 = 16. A number to the first power is itself, 9¹ = 9, and 1 to any power is 1.",
    "计算乘方时，把底数按指数的次数连乘：6² = 6 × 6 = 36，2⁴ = 2 × 2 × 2 × 2 = 16。一个数的 1 次方就是它本身，9¹ = 9；1 的任何次方都是 1。",
  ),
  ["introduction-to-exponents", "two-digit-by-one-digit-multiplication"],
  ["6.EE.A.1"],
  [
    {
      id: "evaluating-squares-and-cubes",
      title: t("Squares and cubes", "平方和立方"),
      explanation: t("$12^2 = 144$ and $4^3 = 64$.", "$12^2 = 144$，$4^3 = 64$。"),
      generate(rng) {
        if (rng.bool(0.65)) return powerProblem(rng.int(2, 20), 2);
        return powerProblem(rng.int(2, 10), 3);
      },
    },
    {
      id: "evaluating-small-powers",
      title: t("Other small powers", "其他较小的乘方"),
      explanation: t("$3^4 = 81$, $8^1 = 8$ and $1^6 = 1$.", "$3^4 = 81$，$8^1 = 8$，$1^6 = 1$。"),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const b = rng.int(2, 5);
          return powerProblem(b, rng.int(4, b === 2 ? 6 : 4));
        }
        if (kind === 1) {
          const b = rng.int(2, 40);
          return numberProblem({
            prompt: t(`Find $${b}^{1}$.`, `计算 $${b}^{1}$。`),
            answer: b,
            form: "integer",
            wrong: [1, b * b, 0],
            solution: t(`A number to the first power is itself: $${b}^{1} = ${b}$.`, `一个数的 1 次方就是它本身：$${b}^{1} = ${b}$。`),
          });
        }
        const e = rng.int(2, 12);
        return numberProblem({
          prompt: t(`Find $1^{${e}}$.`, `计算 $1^{${e}}$。`),
          answer: 1,
          form: "integer",
          wrong: [e, 0, 2],
          solution: t(`$1$ times itself any number of times is $1$: $1^{${e}} = 1$.`, `$1$ 连乘多少次都是 $1$：$1^{${e}} = 1$。`),
        });
      },
    },
  ],
);

const largePowers: readonly [number, number][] = [
  ...[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((e): [number, number] => [2, e]),
  ...[3, 4, 5, 6, 7, 8].map((e): [number, number] => [3, e]),
  ...[3, 4, 5, 6].map((e): [number, number] => [4, e]),
  ...[3, 4, 5].map((e): [number, number] => [5, e]),
  [6, 3],
  [6, 4],
  [7, 3],
  [7, 4],
  [8, 3],
  [9, 3],
];

export const evaluatingLargerExponents = topic(
  "evaluating-larger-exponents",
  t("Evaluating Larger Exponents", "计算较大的乘方"),
  t(
    "For larger exponents, multiply step by step, using each result for the next: 3⁵ = 3 × 3 × 3 × 3 × 3: 9, 27, 81, 243. For a two-digit base, multiply as with whole numbers: 15² = 225 and 11³ = 1331.",
    "指数较大时，一步一步地乘，每一步都用上一步的结果：3⁵ = 3 × 3 × 3 × 3 × 3：9、27、81、243。底数是两位数时，按整数乘法计算：15² = 225，11³ = 1331。",
  ),
  ["evaluating-exponents", "multi-digit-by-two-digit-multiplication"],
  ["6.EE.A.1"],
  [
    {
      id: "evaluating-larger-powers-of-small-bases",
      title: t("Larger exponents", "较大的指数"),
      explanation: t("$2^8 = 256$: $2, 4, 8, 16, 32, 64, 128, 256$.", "$2^8 = 256$：$2, 4, 8, 16, 32, 64, 128, 256$。"),
      generate(rng) {
        const [b, e] = rng.pick(largePowers);
        return powerProblem(b, e);
      },
    },
    {
      id: "evaluating-powers-of-two-digit-bases",
      title: t("Two-digit bases", "底数是两位数"),
      explanation: t("$25^2 = 625$ and $12^3 = 1728$.", "$25^2 = 625$，$12^3 = 1728$。"),
      generate(rng) {
        if (rng.bool(0.7)) return powerProblem(rng.int(11, 30), 2);
        return powerProblem(rng.int(11, 15), 3);
      },
    },
  ],
);

export const evaluatingExponentsWithFractionalBases = topic(
  "evaluating-exponents-with-fractional-bases",
  t("Evaluating Exponents With Fractional Bases", "分数的乘方"),
  t(
    "A power of a fraction multiplies the fraction by itself, so both the numerator and the denominator are raised to the power: (2/3)² = 2/3 × 2/3 = 4/9 and (1/2)³ = 1/8. The parentheses matter: 2²/3 is 4/3, not 4/9.",
    "分数的乘方就是把这个分数连乘，所以分子和分母都乘方：(2/3)² = 2/3 × 2/3 = 4/9，(1/2)³ = 1/8。括号很重要：2²/3 是 4/3，不是 4/9。",
  ),
  ["evaluating-exponents", "multiplying-fractions"],
  ["6.EE.A.1"],
  [
    {
      id: "powers-of-fractions",
      title: t("Powers of fractions", "分数的乘方"),
      explanation: t("$\\left(\\frac{3}{4}\\right)^2 = \\frac{9}{16}$.", "$\\left(\\frac{3}{4}\\right)^2 = \\frac{9}{16}$。"),
      generate(rng) {
        for (;;) {
          const b = rng.int(2, 10);
          const a = rng.int(1, b - 1);
          const e = rng.int(2, b <= 5 ? 3 : 2);
          if (Q.of(a, b).d !== BigInt(b)) continue;
          const v = Q.of(a ** e, b ** e);
          return numberProblem({
            prompt: t(`Find $${powTex(fr(a, b), e, true)}$.`, `计算 $${powTex(fr(a, b), e, true)}$。`),
            answer: v,
            form: "fraction",
            wrong: [Q.of(a ** e, b), Q.of(a * e, b * e), Q.of(a, b ** e)],
            solution: t(
              `$${powTex(fr(a, b), e, true)} = ${repeated(fr(a, b), e)} = ${fr(`${a}^{${e}}`, `${b}^{${e}}`)} = ${v.toLatex()}$.`,
              `$${powTex(fr(a, b), e, true)} = ${repeated(fr(a, b), e)} = ${fr(`${a}^{${e}}`, `${b}^{${e}}`)} = ${v.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "products-with-powers-of-fractions",
      title: t("A whole number times a power of a fraction", "整数乘分数的乘方"),
      explanation: t(
        "$18 \\times \\left(\\frac{1}{3}\\right)^2 = 18 \\times \\frac{1}{9} = 2$.",
        "$18 \\times \\left(\\frac{1}{3}\\right)^2 = 18 \\times \\frac{1}{9} = 2$。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.int(2, 6);
          const a = rng.int(1, b - 1);
          const e = rng.int(2, b <= 3 ? 3 : 2);
          if (Q.of(a, b).d !== BigInt(b)) continue;
          const n = rng.int(1, 6) * b ** e;
          const p = Q.of(a ** e, b ** e);
          const v = p.mul(Q.of(n));
          return numberProblem({
            prompt: t(`Find $${n} \\times ${powTex(fr(a, b), e, true)}$.`, `计算 $${n} \\times ${powTex(fr(a, b), e, true)}$。`),
            answer: v,
            form: "mixed",
            wrong: [Q.of(n * a, b).mul(Q.of(n * a, b)), Q.of(n * a * e, b), Q.of(n * a ** e, b)],
            solution: t(
              `First the power: $${powTex(fr(a, b), e, true)} = ${p.toLatex()}$. Then multiply: $${n} \\times ${p.toLatex()} = ${v.toLatex()}$.`,
              `先算乘方：$${powTex(fr(a, b), e, true)} = ${p.toLatex()}$。再相乘：$${n} \\times ${p.toLatex()} = ${v.toLatex()}$。`,
            ),
          });
        }
      },
    },
  ],
);

export const evaluatingExponentsWithDecimalBases = topic(
  "evaluating-exponents-with-decimal-bases",
  t("Evaluating Exponents With Decimal Bases", "小数的乘方"),
  t(
    "To find a power of a decimal, multiply as with whole numbers and count decimal places: 0.3² = 0.3 × 0.3 = 0.09 (two places), 1.2² = 1.44 and 0.2³ = 0.008. A common slip is 0.3² = 0.9.",
    "计算小数的乘方，按整数相乘再数小数位数：0.3² = 0.3 × 0.3 = 0.09（两位小数），1.2² = 1.44，0.2³ = 0.008。常见的错误是把 0.3² 算成 0.9。",
  ),
  ["evaluating-exponents", "multiplying-two-digit-decimals"],
  ["6.EE.A.1"],
  [
    {
      id: "powers-of-decimals-less-than-one",
      title: t("Decimals less than 1", "小于 1 的小数"),
      explanation: t("$0.4^2 = 0.16$ and $0.1^3 = 0.001$.", "$0.4^2 = 0.16$，$0.1^3 = 0.001$。"),
      generate(rng) {
        const p = rng.bool(0.7) ? 1 : 2;
        const n = rng.int(1, 9);
        const e = rng.int(2, p === 1 ? 3 : 2);
        const v = D(n ** e, p * e);
        return decProblem(
          t(`Find $${powTex(fix(n, p), e)}$.`, `计算 $${powTex(fix(n, p), e)}$。`),
          v,
          [D(n ** e, p), D(n * e, p), D(n ** e, p * e - 1)],
          t(
            `$${n}^{${e}} = ${n ** e}$, and $${repeated(fix(n, p), e)}$ has ${p * e} decimal places: $${powTex(fix(n, p), e)} = ${dq(v)}$.`,
            `$${n}^{${e}} = ${n ** e}$，而 $${repeated(fix(n, p), e)}$ 共有 ${p * e} 位小数：$${powTex(fix(n, p), e)} = ${dq(v)}$。`,
          ),
        );
      },
    },
    {
      id: "powers-of-decimals-greater-than-one",
      title: t("Decimals greater than 1", "大于 1 的小数"),
      explanation: t("$1.5^2 = 2.25$ and $1.1^3 = 1.331$.", "$1.5^2 = 2.25$，$1.1^3 = 1.331$。"),
      generate(rng) {
        const n = nonZeroEnd(rng, 2);
        const e = n <= 13 ? rng.int(2, 3) : 2;
        const v = D(n ** e, e);
        return decProblem(
          t(`Find $${powTex(fix(n, 1), e)}$.`, `计算 $${powTex(fix(n, 1), e)}$。`),
          v,
          [D(n ** e, 1), D(n * e, 1), D(n ** e, e - 1)],
          t(
            `$${n}^{${e}} = ${n ** e}$, and the product has ${e} decimal places: $${powTex(fix(n, 1), e)} = ${dq(v)}$.`,
            `$${n}^{${e}} = ${n ** e}$，积有 ${e} 位小数：$${powTex(fix(n, 1), e)} = ${dq(v)}$。`,
          ),
        );
      },
    },
  ],
);

export const comparingExponents = topic(
  "comparing-exponents",
  t("Comparing Exponents", "比较乘方的大小"),
  t(
    "To compare powers, evaluate them: 2⁵ = 32 and 5² = 25, so 2⁵ > 5². Swapping the base and the exponent usually changes the value. With the same base greater than 1, a larger exponent gives a larger value; with the same exponent, a larger base gives a larger value.",
    "比较乘方的大小，可以先算出它们的值：2⁵ = 32，5² = 25，所以 2⁵ > 5²。交换底数和指数，值通常会改变。底数相同（大于 1）时，指数大的值大；指数相同时，底数大的值大。",
  ),
  ["evaluating-larger-exponents"],
  ["6.EE.A.1"],
  [
    {
      id: "comparing-two-powers",
      title: t("Comparing two powers", "比较两个乘方"),
      explanation: t("$3^4 = 81 > 4^3 = 64$.", "$3^4 = 81 > 4^3 = 64$。"),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        if (rng.bool()) {
          a = rng.int(2, 6);
          b = rng.int(2, 6);
          [c, d] = [b, a];
          if (a === b) return this.generate(rng);
        } else {
          a = rng.int(2, 9);
          b = rng.int(2, 4);
          c = rng.int(2, 9);
          d = rng.int(2, 4);
          if (a === c && b === d) return this.generate(rng);
        }
        const x = a ** b;
        const y = c ** d;
        const rel = Math.sign(x - y) + 1;
        return compareProblem(
          powTex(String(a), b),
          powTex(String(c), d),
          rel,
          t(
            `$${powTex(String(a), b)} = ${x}$ and $${powTex(String(c), d)} = ${y}$, so $${powTex(String(a), b)} ${["<", "=", ">"][rel]} ${powTex(String(c), d)}$.`,
            `$${powTex(String(a), b)} = ${x}$，$${powTex(String(c), d)} = ${y}$，所以 $${powTex(String(a), b)} ${["<", "=", ">"][rel]} ${powTex(String(c), d)}$。`,
          ),
        );
      },
    },
    {
      id: "greatest-of-several-powers",
      title: t("The greatest power", "最大的乘方"),
      explanation: t(
        "Of $2^6$, $6^2$ and $4^3$: $64$, $36$ and $64$, so $2^6$ and $4^3$ are equal and greatest.",
        "$2^6$、$6^2$、$4^3$ 的值是 $64$、$36$、$64$，所以 $2^6$ 和 $4^3$ 相等且最大。",
      ),
      generate(rng) {
        for (;;) {
          const ps: [number, number][] = [0, 1, 2].map(() => [rng.int(2, 9), rng.int(2, 4)]);
          const vals = ps.map(([b, e]) => b ** e);
          const max = Math.max(...vals);
          if (vals.filter((v) => v === max).length !== 1 || new Set(vals).size < 3) continue;
          const texts = ps.map(([b, e]) => powTex(String(b), e));
          const k = vals.indexOf(max);
          return choiceProblem({
            prompt: t(
              `Which is the greatest: ${texts.map((s) => `$${s}$`).join(", ")}?`,
              `哪个最大：${texts.map((s) => `$${s}$`).join("、")}？`,
            ),
            options: texts.map(mathText),
            correct: k,
            solution: t(
              `The values are ${vals.join(", ")}, so the greatest is $${texts[k]}$.`,
              `它们的值是 ${vals.join("、")}，所以最大的是 $${texts[k]}$。`,
            ),
          });
        }
      },
    },
  ],
);

export const evaluatingWholeNumberExpressionsContainingExponents = topic(
  "evaluating-whole-number-expressions-containing-exponents",
  t("Evaluating Whole Number Expressions Containing Exponents", "含乘方的整数运算"),
  t(
    "In the order of operations, exponents come after parentheses and before multiplication and division: 3 + 2³ × 4 = 3 + 8 × 4 = 3 + 32 = 35. Parentheses come first: (2 + 3)² = 5² = 25, but 2 + 3² = 2 + 9 = 11.",
    "运算顺序中，乘方在括号之后、乘除之前：3 + 2³ × 4 = 3 + 8 × 4 = 3 + 32 = 35。括号最先算：(2 + 3)² = 5² = 25，而 2 + 3² = 2 + 9 = 11。",
  ),
  ["evaluating-exponents", "evaluating-whole-number-expressions-with-parentheses"],
  ["6.EE.A.1"],
  [
    {
      id: "exponents-in-the-order-of-operations",
      title: t("Exponents before multiplying", "先算乘方"),
      explanation: t("$40 - 3^2 \\times 4 = 40 - 9 \\times 4 = 40 - 36 = 4$.", "$40 - 3^2 \\times 4 = 40 - 9 \\times 4 = 40 - 36 = 4$。"),
      generate(rng) {
        const b = rng.int(2, 6);
        const e = rng.int(2, b <= 3 ? 4 : 2);
        const c = rng.int(2, 9);
        const p = b ** e;
        const add = rng.bool();
        const a = add ? rng.int(1, 50) : p * c + rng.int(1, 50);
        const v = add ? a + p * c : a - p * c;
        const op = add ? "+" : "-";
        return numberProblem({
          prompt: t(`Find $${a} ${op} ${powTex(String(b), e)} \\times ${c}$.`, `计算 $${a} ${op} ${powTex(String(b), e)} \\times ${c}$。`),
          answer: v,
          form: "integer",
          wrong: [add ? a + b * e * c : a - b * e * c, add ? (a + p) * c : (a - p) * c].filter((x) => x >= 0),
          solution: t(
            `Exponent first, then multiply, then ${add ? "add" : "subtract"}:${steps(`${a} ${op} ${powTex(String(b), e)} \\times ${c} = ${a} ${op} ${p} \\times ${c}`, `= ${a} ${op} ${p * c} = ${v}`)}`,
            `先算乘方，再算乘法，最后算${add ? "加法" : "减法"}：${steps(`${a} ${op} ${powTex(String(b), e)} \\times ${c} = ${a} ${op} ${p} \\times ${c}`, `= ${a} ${op} ${p * c} = ${v}`)}`,
          ),
        });
      },
    },
    {
      id: "exponents-with-parentheses",
      title: t("Parentheses and exponents", "括号与乘方"),
      explanation: t("$(4 + 2)^2 - 10 = 6^2 - 10 = 36 - 10 = 26$.", "$(4 + 2)^2 - 10 = 6^2 - 10 = 36 - 10 = 26$。"),
      generate(rng) {
        const x = rng.int(1, 6);
        const y = rng.int(1, 6);
        const e = x + y <= 5 ? rng.int(2, 3) : 2;
        const c = rng.int(1, 30);
        const s = (x + y) ** e;
        const v = s + c;
        return numberProblem({
          prompt: t(`Find $(${x} + ${y})^{${e}} + ${c}$.`, `计算 $(${x} + ${y})^{${e}} + ${c}$。`),
          answer: v,
          form: "integer",
          wrong: [x ** e + y ** e + c, x + y ** e + c, (x + y) * e + c],
          solution: t(
            `Parentheses first, then the exponent, then add:${steps(`(${x} + ${y})^{${e}} + ${c} = ${x + y}^{${e}} + ${c}`, `= ${s} + ${c} = ${v}`)}`,
            `先算括号，再算乘方，最后相加：${steps(`(${x} + ${y})^{${e}} + ${c} = ${x + y}^{${e}} + ${c}`, `= ${s} + ${c} = ${v}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade5DecimalTopics lists the 5th grade topics on decimals and exponents. */
export const grade5DecimalTopics: readonly TopicDef[] = [
  thePlaceValueSystemWithDecimals,
  comparingPlaceValuesWithDecimals,
  readingAndWritingDecimalsWrittenInWords,
  convertingDecimalsFromStandardToExpandedForm,
  convertingDecimalsFromExpandedToStandardForm,
  equivalentDecimals,
  comparingDecimals,
  roundingDownDecimals,
  roundingUpDecimals,
  significantFigures,
  significantFiguresWithDecimals,
  estimatingDecimalAdditionAndSubtraction,
  addingDecimals,
  additionWithUnequalNumbersOfDecimals,
  subtractingDecimals,
  subtractionWithUnequalNumbersOfDecimals,
  estimatingDecimalAdditionWithBenchmarks,
  estimatingDecimalSubtractionWithBenchmarks,
  multiplyingDecimalsByPowersOfTenUsingPlaceValue,
  multiplyingDecimalsByPowersOfTenUsingDecimalPointPlacement,
  estimatingDecimalMultiplication,
  multiplyingADecimalByAOneDigitWholeNumber,
  multiplyingADecimalByAMultiDigitWholeNumber,
  multiplyingTwoDigitDecimals,
  multiplyingTwoDigitDecimalsByThreeDigitDecimals,
  multiplyingThreeDigitDecimals,
  dividingDecimalsByPowersOfTenUsingPlaceValue,
  dividingDecimalsByPowersOfTenUsingDecimalPointPlacement,
  estimatingDecimalDivision,
  dividingDecimalsUsingPlaceValueStrategies,
  divisionOfWholeNumbersWithDecimalQuotients,
  divisionOfWholeNumbersWithDecimalQuotientsAndRounding,
  dividingDecimalsUsingTheStandardAlgorithm,
  dividingThreeDigitDecimalsByTwoDigitDecimals,
  dividingFourDigitAndFiveDigitDecimals,
  powersOfTen,
  multiplyingNumbersByPowersOfTenWithExponents,
  multiplyingDecimalsByPowersOfTenWithExponents,
  introductionToExponents,
  evaluatingExponents,
  evaluatingLargerExponents,
  evaluatingExponentsWithFractionalBases,
  evaluatingExponentsWithDecimalBases,
  comparingExponents,
  evaluatingWholeNumberExpressionsContainingExponents,
];
