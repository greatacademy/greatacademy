import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q, svgDocument } from "@ga/subject-math";

import { compared, type MathWrong, type Pair, picked, pickedMath, type Wrong } from "./early-grades-more-kit.ts";
import { fr } from "./grade-4-fractions.ts";
import { wordsEn, wordsZh } from "./grade-4-whole-numbers.ts";
import {
  answered,
  areaGridFigure,
  digitsChart,
  equalTape,
  grouped,
  lineFigure,
  type Miss,
  point,
  stripsFigure,
  tapeFigure,
} from "./upper-grades-kit.ts";

// 5th Grade Math: decimal place value, rounding, the four operations on decimals, and exponents.

/** texCommas writes a whole number with thousands separators for math. */
const texCommas = (n: number) => String(n).replace(/\\B(?=(\\d{3})+$)/g, "{,}");
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
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss(...standards),
    knowledgePoints,
    ...(intro && { intro }),
  };
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

/** decText writes a number as a short decimal: 0.25, 3. */
const decText = (v: number): string => (Number.isInteger(v) && v >= 10000 ? v.toLocaleString("en-US") : String(Number(v.toFixed(8))));

/** decLine draws a number line from lo to hi with ticks every step, the ends and the marked points labeled, and jumps drawn as arcs. */
function decLine(
  lo: number,
  hi: number,
  step: number,
  marks: readonly number[],
  jumps: readonly (readonly [number, number])[] = [],
): Figure {
  const shown = marks.map(decText).join(" and ");
  return lineFigure({ lo, hi, step, labels: [lo, hi, ...marks], label: decText, marks: marks.map((at) => ({ at })), jumps }, [
    `A number line from ${decText(lo)} to ${decText(hi)}${marks.length ? ` with ${shown} marked` : ""}.`,
    `一条从 ${decText(lo)} 到 ${decText(hi)} 的数轴${marks.length ? `，标出了 ${marks.map(decText).join(" 和 ")}` : ""}。`,
  ]);
}

/** decimalLine draws a short number line around two decimals given in hundredths. */
function decimalLine(a: number, b: number): Figure {
  const lo = Math.floor(a / 10) * 10;
  const hi = Math.max(Math.ceil(b / 10) * 10, lo + 10);
  return decLine(lo / 100, hi / 100, hi - lo > 40 ? 0.1 : 0.01, a === b ? [a / 100] : [a / 100, b / 100]);
}

/** cellText draws text centered on x with its baseline at y. */
const cellText = (x: number, y: number, s: string, size = 14) =>
  `<text x="${x.toFixed(1)}" y="${y}" text-anchor="middle" stroke="none" fill="currentColor" font-size="${size}">${s}</text>`;

/** decimalChart draws a place-value chart from place `first` (−1 tens, 0 ones) to place `last` (3 thousandths) with one row for each number n/10ᵖ, the point after the ones and the column of place `lit` shaded. */
function decimalChart(rows: readonly (readonly [n: number, p: number])[], first = 0, last = 3, lit = Number.NaN): Figure {
  const ks = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const w = 280 / ks.length;
  let body = "";
  ks.forEach((k, i) => {
    const x = 20 + i * w;
    if (k === lit)
      body += `<rect x="${x.toFixed(1)}" y="4" width="${w.toFixed(1)}" height="${24 + 26 * rows.length}" class="accent" fill="currentColor" fill-opacity="0.2" stroke="none"/>`;
    body += `<rect x="${x.toFixed(1)}" y="4" width="${w.toFixed(1)}" height="24"/>${cellText(x + w / 2, 21, dq(placeValue(k)), 12)}`;
    rows.forEach(([n, p], r) => {
      const whole = String(Math.floor(n / pow10(p))).length;
      const digit = k <= p && k > -whole ? cellText(x + w / 2, 46 + 26 * r, String(digitAtPlace(n, p, k)), 15) : "";
      body += `<rect x="${x.toFixed(1)}" y="${28 + 26 * r}" width="${w.toFixed(1)}" height="26"/>${digit}`;
    });
  });
  if (first <= 0 && last >= 1) {
    const dot = 20 + (1 - first) * w;
    rows.forEach((_, r) => {
      body += `<circle cx="${dot.toFixed(1)}" cy="${48 + 26 * r}" r="2.5" stroke="none" fill="currentColor"/>`;
    });
  }
  const written = rows.map(([n, p]) => fix(n, p));
  return {
    svg: svgDocument(36 + 26 * rows.length, body),
    alt: t(
      `A place-value chart from the ${placeName(first).en} to the ${placeName(last).en} with ${written.join(" and ")} written in it.`,
      `一张从${placeName(first)["zh-CN"]}到${placeName(last)["zh-CN"]}的数位表，里面写着 ${written.join(" 和 ")}。`,
    ),
  };
}

/** hundredthsGrid draws a square cut into 100 small squares and shades the first `shaded` of them column by column, so each full column is one tenth. */
function hundredthsGrid(shaded: number): Figure {
  let body = "";
  for (let c = 0; c < 10; c++) {
    for (let r = 0; r < 10; r++) {
      if (c * 10 + r < shaded)
        body += `<rect x="${110 + c * 10}" y="${6 + r * 10}" width="10" height="10" class="accent" fill="currentColor" fill-opacity="0.45"/>`;
      body += `<rect x="${110 + c * 10}" y="${6 + r * 10}" width="10" height="10"/>`;
    }
  }
  const cols = Math.floor(shaded / 10);
  const rest = shaded % 10;
  return {
    svg: svgDocument(112, body),
    alt: t(
      `A square cut into 100 small squares with ${shaded} shaded: ${cols} full column${cols === 1 ? "" : "s"}${rest ? ` and ${rest} more` : ""}.`,
      `一个平均分成 100 个小方格的正方形，涂了 ${shaded} 格：${cols} 整列${rest ? `又 ${rest} 格` : ""}。`,
    ),
  };
}

/** placeAfterPoint says where place k is: "the 2nd place after the point", or "the ones place". */
const placeWhere = (k: number): Pair =>
  k >= 1
    ? [
        `It is the ${["", "first", "second", "third"][k]} place after the point, the ${placeName(k).en} place.`,
        `它是小数点后第${["", "一", "二", "三"][k]}位，也就是${placeName(k)["zh-CN"]}。`,
      ]
    : [
        `It is the ${k === 0 ? "first" : "second"} place left of the point, the ${placeName(k).en} place.`,
        `它是小数点左边第${k === 0 ? "一" : "二"}位，也就是${placeName(k)["zh-CN"]}。`,
      ];

/** sameDigitTwice draws n/10³ with a whole part of 1 to 99 whose digit d sits in places i and j and nowhere else. */
function sameDigitTwice(rng: Rng, d: number, i: number, j: number): number {
  for (;;) {
    const n = rng.int(1000, 99999);
    let m = 0;
    for (let k = -1; k <= 3; k++) {
      const x = k === i || k === j ? d : digitAtPlace(n, 3, k) === d ? (d % 9) + 1 : digitAtPlace(n, 3, k);
      m = m * 10 + x;
    }
    if (m % 10 !== 0 && m >= 1000) return m;
  }
}

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
    point(
      "value-of-a-digit-in-a-decimal",
      ["The value of a digit", "数字表示的值"],
      [
        "In $8.156$ the 5 is in the hundredths place, so it is worth $5 \\times 0.01 = 0.05$.\n\nCheck: the hundredths place is the second place after the point, and $0.05$ has its 5 there too.\n\n> **Watch out.** Count the places from the point. The 5 is worth $0.05$, not $0.5$.",
        "在 $8.156$ 中，5 在百分位上，表示 $5 \\times 0.01 = 0.05$。\n\n检验：百分位是小数点后第二位，$0.05$ 的 5 也在这一位。\n\n> **注意。** 要从小数点开始数位。这个 5 表示 $0.05$，不是 $0.5$。",
      ],
      (rng) => {
        const k = rng.int(1, 3);
        const { n, digit } = numberWithDigitOnce(rng, k);
        const v = D(digit, k);
        return answered(
          [`What is the value of the digit ${digit} in $${fix(n, 3)}$?`, `$${fix(n, 3)}$ 中的数字 ${digit} 表示多少？`],
          v,
          [
            [["Find the place", "找数位"], placeWhere(k)],
            [
              ["Multiply", "相乘"],
              [`Multiply the digit by the value of its place.`, `用这个数字乘它所在数位的计数单位。`],
              [`${digit} \\times ${dq(placeValue(k))} = ${dq(v)}`],
            ],
          ],
          [
            `In $${dq(v)}$ the digit ${digit} is also the ${["", "first", "second", "third"][k]} place after the point.`,
            `在 $${dq(v)}$ 中，${digit} 也在小数点后第${["", "一", "二", "三"][k]}位。`,
          ],
          [
            [D(digit, k - 1), "That is one place too far left.", "这往左多移了一位。"],
            [D(digit, k + 1), "That is one place too far right.", "这往右多移了一位。"],
            [digit, "That is the digit, not what it is worth.", "这是数字本身，不是它表示的值。"],
          ],
          { form: "decimal", figure: decimalChart([[n, 3]], -1, 3, k) },
        );
      },
      decimalChart([[8156, 3]], 0, 3, 2),
    ),
    point(
      "naming-decimal-places",
      ["Naming the place of a digit", "说出数字所在的数位"],
      [
        "In $40.629$ the 6 is the first digit after the point, so it is in the tenths place. The 9 is third, in the thousandths place.\n\nCheck: the 6 is worth $0.6$, which is 6 tenths.\n\n> **Watch out.** Tens are left of the point and tenths are right of it. The names sound alike.",
        "在 $40.629$ 中，6 是小数点后第一位，在十分位上。9 是第三位，在千分位上。\n\n检验：这个 6 表示 $0.6$，也就是 6 个十分之一。\n\n> **注意。** 十位在小数点左边，十分位在小数点右边。两个名字很像。",
      ],
      (rng) => {
        const k = rng.int(-1, 3);
        const { n, digit } = numberWithDigitOnce(rng, k);
        const others = [-1, 0, 1, 2, 3]
          .filter((j) => j !== k)
          .sort((a, b) => Math.abs(a - k) - Math.abs(b - k))
          .slice(0, 3);
        const name = (j: number): Pair => [placeName(j).en, placeName(j)["zh-CN"]];
        return picked(
          rng,
          [`In $${fix(n, 3)}$, which place is the digit ${digit} in?`, `在 $${fix(n, 3)}$ 中，数字 ${digit} 在哪个数位上？`],
          name(k),
          others.map((j) => [
            name(j),
            j < k ? `That place is ${k - j} to the left of the ${digit}.` : `That place is ${j - k} to the right of the ${digit}.`,
            j < k ? `这个数位在 ${digit} 左边 ${k - j} 位。` : `这个数位在 ${digit} 右边 ${j - k} 位。`,
          ]),
          [
            [
              ["Find the point", "找小数点"],
              [`Start at the decimal point of $${fix(n, 3)}$.`, `从 $${fix(n, 3)}$ 的小数点开始。`],
            ],
            [["Count the places", "数位数"], placeWhere(k)],
          ],
          [
            `The ${digit} is worth $${dq(Q.of(digit).mul(placeValue(k)))}$, and $${dq(Q.of(digit).mul(placeValue(k)))}$ has its ${digit} in the ${placeName(k).en} place too.`,
            `这个 ${digit} 表示 $${dq(Q.of(digit).mul(placeValue(k)))}$，$${dq(Q.of(digit).mul(placeValue(k)))}$ 的 ${digit} 也在${placeName(k)["zh-CN"]}上。`,
          ],
          decimalChart([[n, 3]], -1, 3, k),
        );
      },
      decimalChart([[40629, 3]], -1, 3, 1),
    ),
  ],
  t(
    "A ladybug is $0.6$ cm long. The 6 is right after the point, in the tenths place, so it means 6 tenths.\n\nCheck: 6 tenths is $6 \\times 0.1 = 0.6$.\n\nIn this lesson we name the places after the decimal point and find what each digit is worth.",
    "一只瓢虫长 $0.6$ 厘米。6 紧挨着小数点，在十分位上，表示 6 个十分之一。\n\n检验：6 个十分之一是 $6 \\times 0.1 = 0.6$。\n\n本课我们认识小数点后面的数位，并求出每个数字表示多少。",
  ),
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
    point(
      "comparing-values-of-the-same-digit",
      ["How many times as much", "是几倍"],
      [
        "The 3 in $2.3$ is worth $0.3$ and the 3 in $4.503$ is worth $0.003$. It is 2 places further left, so it is $10 \\times 10 = 100$ times as much.\n\nCheck: $0.003 \\times 100 = 0.3$.\n\n> **Watch out.** Two places means $10 \\times 10 = 100$ times, not 2 times or 20 times.",
        "$2.3$ 中的 3 表示 $0.3$，$4.503$ 中的 3 表示 $0.003$。它往左多 2 位，所以是 $10 \\times 10 = 100$ 倍。\n\n检验：$0.003 \\times 100 = 0.3$。\n\n> **注意。** 相差两位是 $10 \\times 10 = 100$ 倍，不是 2 倍，也不是 20 倍。",
      ],
      (rng) => {
        for (;;) {
          const i = rng.int(-1, 2);
          const j = rng.int(i + 1, 3);
          const a = numberWithDigitOnce(rng, i);
          const b = numberWithDigitOnce(rng, j);
          if (a.digit !== b.digit) continue;
          const d = a.digit;
          const times = pow10(j - i);
          const [va, vb] = [dq(D(d, 0).mul(placeValue(i))), dq(D(d, 0).mul(placeValue(j)))];
          return answered(
            [
              `The value of the ${d} in $${fix(a.n, 3)}$ is how many times the value of the ${d} in $${fix(b.n, 3)}$?`,
              `$${fix(a.n, 3)}$ 中的 ${d} 表示的值是 $${fix(b.n, 3)}$ 中的 ${d} 表示的值的多少倍？`,
            ],
            times,
            [
              [
                ["Find both values", "求两个值"],
                [`The first ${d} is worth $${va}$ and the second is worth $${vb}$.`, `第一个 ${d} 表示 $${va}$，第二个表示 $${vb}$。`],
              ],
              [
                ["Count the places", "数相差几位"],
                [
                  `The first is ${j - i} place${j - i === 1 ? "" : "s"} further left, and each place is 10 times.`,
                  `第一个往左多 ${j - i} 位，每多一位是 10 倍。`,
                ],
                [
                  `${Array(j - i)
                    .fill("10")
                    .join(" \\times ")} = ${times}`,
                ],
              ],
            ],
            [`Multiply back: $${vb} \\times ${times} = ${va}$.`, `乘回去：$${vb} \\times ${times} = ${va}$。`],
            [
              [j - i, "That counts the places, but each place is 10 times.", "这只数了相差几位，每一位是 10 倍。"],
              [times * 10, "That is one place too many.", "这多算了一位。"],
              [10 * (j - i), "That adds 10 for each place. Each place multiplies by 10.", "这是每差一位加 10，其实每差一位要乘 10。"],
            ],
            {
              figure: decimalChart(
                [
                  [a.n, 3],
                  [b.n, 3],
                ],
                -1,
                3,
              ),
            },
          );
        }
      },
      decimalChart(
        [
          [23, 1],
          [4503, 3],
        ],
        0,
        3,
      ),
    ),
    point(
      "units-in-a-larger-place",
      ["Smaller units in a larger place", "大单位里有多少小单位"],
      [
        "1 tenth is 10 hundredths, so 7 tenths is $7 \\times 10 = 70$ hundredths: $0.7 = 0.70$.\n\nCheck: in a square of 100 small squares, 7 full columns hold 70 small squares.\n\n> **Watch out.** Going to a smaller unit gives more units. 7 tenths is 70 hundredths, not 7.",
        "1 个十分之一是 10 个百分之一，所以 7 个十分之一是 $7 \\times 10 = 70$ 个百分之一：$0.7 = 0.70$。\n\n检验：在 100 个小方格的正方形里，7 整列一共 70 个小方格。\n\n> **注意。** 换成更小的单位，个数会变多。7 个十分之一是 70 个百分之一，不是 7 个。",
      ],
      (rng) => {
        const i = rng.int(0, 2);
        const j = rng.int(i + 1, 3);
        const k = rng.int(2, 9);
        const times = pow10(j - i);
        const unitEn = (p: number, many: boolean) => (many ? placeName(p).en : placeName(p).en.replace(/s$/, ""));
        return answered(
          [`How many ${placeName(j).en} make ${k} ${unitEn(i, true)}?`, `${k} 个${unitZh(i)}是多少个${unitZh(j)}？`],
          k * times,
          [
            [
              ["One unit", "一个单位"],
              [`One ${unitEn(i, false)} is ${times} ${placeName(j).en}.`, `1 个${unitZh(i)}是 ${times} 个${unitZh(j)}。`],
            ],
            [
              ["Multiply", "相乘"],
              [`${k} of them make ${k} times as many.`, `${k} 个就是 ${k} 倍。`],
              [`${k} \\times ${times} = ${k * times}`],
            ],
          ],
          [
            `Both name the same amount: $${dq(D(k, i))} = ${fix(k * times, j)}$.`,
            `两种说法是同一个数：$${dq(D(k, i))} = ${fix(k * times, j)}$。`,
          ],
          [
            [k, "That keeps the count the same. Smaller units need more of them.", "个数没变。单位变小，个数要变多。"],
            [k * times * 10, "That is one place too many.", "这多算了一位。"],
            [times, "That is one unit, not all of them.", "这只是 1 个单位的，不是全部。"],
          ],
          {
            figure: decimalChart(
              [
                [k, i],
                [k * times, j],
              ],
              0,
              3,
              j,
            ),
          },
        );
      },
      hundredthsGrid(70),
    ),
  ],
  t(
    "Sam has $0.6$ L of juice and Lee has $0.06$ L. Both have a 6, but Sam's 6 is one place further left, so it is worth 10 times as much.\n\nCheck: $0.06 \\times 10 = 0.6$.\n\nIn this lesson we compare what the same digit is worth in different places.",
    "小山有 $0.6$ 升果汁，小李有 $0.06$ 升。两个数里都有 6，但小山的 6 往左多一位，所以它表示的值是 10 倍。\n\n检验：$0.06 \\times 10 = 0.6$。\n\n本课我们比较同一个数字在不同数位上表示的值。",
  ),
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
    point(
      "writing-decimals-from-words",
      ["Writing decimals from words", "根据读法写小数"],
      [
        "Thirty-four and twenty-one hundredths is $34.21$. The whole part comes before the point, and hundredths means two places after it.\n\nCheck: read $34.21$ aloud and you get the same words.\n\n> **Watch out.** Hundredths needs two places after the point, so it is not $34.021$.",
        "三十四点二一写作 $34.21$。整数部分写在小数点前面，小数部分依次写在后面。\n\n检验：把 $34.21$ 读出来，和原来的读法一样。\n\n> **注意。** 小数部分有几个数字就写几位，不能写成 $34.021$。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const n = rng.int(1, 99) * pow10(p) + nonZeroEnd(rng, p);
        const words = decimalWords(n, p);
        return answered(
          [`Write as a decimal: ${words.en}.`, `把下面的读法写成小数：${words["zh-CN"]}。`],
          D(n, p),
          [
            [
              ["The whole part", "整数部分"],
              [`The words before "and" give ${Math.floor(n / pow10(p))}.`, `“点”前面是 ${Math.floor(n / pow10(p))}。`],
            ],
            [
              ["The part after the point", "小数部分"],
              [
                `The last word names the ${placeName(p).en}, so use ${p} place${p === 1 ? "" : "s"}.`,
                `“点”后面有 ${p} 个数字，就写 ${p} 位小数。`,
              ],
              [fix(n, p)],
            ],
          ],
          [`Read $${fix(n, p)}$ aloud: ${words.en}.`, `把 $${fix(n, p)}$ 读出来：${words["zh-CN"]}。`],
          [
            [D(n, p + 1), "That puts the last digit one place too far right.", "最后一个数字往右多移了一位。"],
            [D(n, p - 1), "That puts the last digit one place too far left.", "最后一个数字往左多移了一位。"],
            [n, "That leaves out the decimal point.", "这里漏掉了小数点。"],
          ],
          { form: "decimal", figure: decimalChart([[n, p]], -1, 3) },
        );
      },
      decimalChart([[3421, 2]], -1, 2),
    ),
    point(
      "reading-decimals-in-words",
      ["Reading decimals in words", "读小数"],
      [
        "$5.07$ is read five and seven hundredths, because the 7 is in the hundredths place.\n\nCheck: write five and seven hundredths back as a number and you get $5.07$.\n\n> **Watch out.** The last digit names the place. $5.07$ is not five and seven tenths.",
        "$5.07$ 读作五点零七。小数部分要按顺序把每个数字读出来，0 也要读。\n\n检验：把五点零七写回数字，得到 $5.07$。\n\n> **注意。** 小数点后的 0 也要读出来。$5.07$ 不是五点七。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const n = rng.int(1, 99) * pow10(p) + nonZeroEnd(rng, p);
        const say = (m: number, q: number): Pair => [decimalWordsEn(m, q), decimalWordsZh(m, q)];
        const wrong: Wrong[] = [[say(n, 0), "That leaves out the decimal point.", "这里漏掉了小数点。"]];
        if (p < 3)
          wrong.push([
            say(n, p + 1),
            "That is ten times too small: the last digit moves one place right.",
            "这小了 10 倍：最后一个数字往右移了一位。",
          ]);
        if (p > 1)
          wrong.push([
            say(n, p - 1),
            "That is ten times too large: the last digit moves one place left.",
            "这大了 10 倍：最后一个数字往左移了一位。",
          ]);
        return picked(
          rng,
          [`How is $${fix(n, p)}$ read?`, `$${fix(n, p)}$ 怎么读？`],
          say(n, p),
          wrong,
          [
            [
              ["The whole part", "整数部分"],
              [`Read ${Math.floor(n / pow10(p))} before the point and say "and".`, `先读整数部分 ${Math.floor(n / pow10(p))}，再读“点”。`],
            ],
            [
              ["The part after the point", "小数部分"],
              [
                `Read the digits after the point as one number, then the name of the last place: ${placeName(p).en}.`,
                `再把小数点后的数字按顺序一个一个读出来。`,
              ],
            ],
          ],
          [`Write the words back as a number: $${fix(n, p)}$.`, `把读法写回数字：$${fix(n, p)}$。`],
          decimalChart([[n, p]], -1, 3),
        );
      },
      decimalChart([[507, 2]], 0, 2),
    ),
  ],
  t(
    "A sign at the pool says the water is two and five tenths meters deep. Write it as $2.5$: the whole number, the point, then 5 in the tenths place.\n\nCheck: $2.5$ is read as two and five tenths.\n\nIn this lesson we read decimals in words and write words as decimals.",
    "泳池边的牌子上写着水深“二点五米”。写成 $2.5$：先写整数部分，再写小数点，十分位上写 5。\n\n检验：$2.5$ 读作二点五。\n\n本课我们读小数，也把读出来的小数写成数字。",
  ),
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
    point(
      "expanded-form-with-decimals",
      ["Expanded form with decimals", "用小数写展开式"],
      [
        "$4.36 = 4 + 0.3 + 0.06$. The 3 is in the tenths place, so it is $0.3$; the 6 is in the hundredths place, so it is $0.06$.\n\nCheck: add them back: $4 + 0.3 + 0.06 = 4.36$.\n\n> **Watch out.** Write each digit at its value. $4 + 3 + 6$ loses the places.",
        "$4.36 = 4 + 0.3 + 0.06$。3 在十分位上，是 $0.3$；6 在百分位上，是 $0.06$。\n\n检验：加回去：$4 + 0.3 + 0.06 = 4.36$。\n\n> **注意。** 每个数字要写成它表示的值。写成 $4 + 3 + 6$ 就丢了数位。",
      ],
      (rng) => {
        const p = rng.int(2, 3);
        let n = rng.int(1, 9) * pow10(p + 1) + rng.int(1, 9) * pow10(p);
        for (let k = 1; k <= p; k++) n += rng.int(1, 9) * pow10(p - k);
        return pickedMath(
          rng,
          [`Which is the expanded form of $${fix(n, p)}$?`, `$${fix(n, p)}$ 的展开式是哪一个？`],
          expandedSum(n, p),
          [
            [expandedSum(n, p, 1), "Every digit is one place too far right.", "每个数字都往右多移了一位。"],
            [expandedSum(n, p, -1), "Every digit is one place too far left.", "每个数字都往左多移了一位。"],
            [
              [...String(n)].filter((c) => c !== "0").join(" + "),
              "That writes the digits but not their values.",
              "这只写了数字，没写它们表示的值。",
            ],
          ],
          [
            [
              ["Read the places", "看数位"],
              [`Find the place of each digit of $${fix(n, p)}$.`, `找出 $${fix(n, p)}$ 每个数字所在的数位。`],
            ],
            [
              ["Write each value", "写出每个值"],
              ["Write each digit at its value and add them.", "把每个数字写成它表示的值，再相加。"],
              [`${fix(n, p)} = ${expandedSum(n, p)}`],
            ],
          ],
          [`Add the parts back and you get $${fix(n, p)}$.`, `把各部分加回去，得到 $${fix(n, p)}$。`],
          decimalChart([[n, p]], -1, 3),
        );
      },
      decimalChart([[436, 2]], 0, 2),
    ),
    point(
      "expanded-form-with-fractions",
      ["Expanded form with fractions", "用分数写展开式"],
      [
        "$2.57 = 2 \\times 1 + 5 \\times \\frac{1}{10} + 7 \\times \\frac{1}{100}$. Tenths are $\\frac{1}{10}$ and hundredths are $\\frac{1}{100}$.\n\nCheck: $5 \\times \\frac{1}{10} = 0.5$ and $7 \\times \\frac{1}{100} = 0.07$, so the sum is $2.57$.\n\n> **Watch out.** The second place after the point is hundredths, so the 7 goes with $\\frac{1}{100}$, not $\\frac{1}{10}$.",
        "$2.57 = 2 \\times 1 + 5 \\times \\frac{1}{10} + 7 \\times \\frac{1}{100}$。十分位的计数单位是 $\\frac{1}{10}$，百分位的是 $\\frac{1}{100}$。\n\n检验：$5 \\times \\frac{1}{10} = 0.5$，$7 \\times \\frac{1}{100} = 0.07$，加起来是 $2.57$。\n\n> **注意。** 小数点后第二位是百分位，7 要乘 $\\frac{1}{100}$，不是 $\\frac{1}{10}$。",
      ],
      (rng) => {
        const p = rng.int(2, 3);
        const n = rng.int(1, 9) * pow10(p) + nonZeroEnd(rng, p);
        return pickedMath(
          rng,
          [`Which is $${fix(n, p)}$ in expanded form with fractions?`, `$${fix(n, p)}$ 用分数写成展开式是哪一个？`],
          expandedFractions(n, p),
          [
            [expandedFractions(n, p, 1), "Every digit is one place too far right.", "每个数字都往右多移了一位。"],
            [expandedFractions(n, p, -1), "Every digit is one place too far left.", "每个数字都往左多移了一位。"],
          ],
          [
            [
              ["Read the places", "看数位"],
              [`Find the place of each digit of $${fix(n, p)}$.`, `找出 $${fix(n, p)}$ 每个数字所在的数位。`],
            ],
            [
              ["Use the unit fractions", "用分数单位"],
              [
                "Tenths are $\\frac{1}{10}$, hundredths $\\frac{1}{100}$, thousandths $\\frac{1}{1000}$.",
                "十分之一是 $\\frac{1}{10}$，百分之一是 $\\frac{1}{100}$，千分之一是 $\\frac{1}{1000}$。",
              ],
              [expandedFractions(n, p)],
            ],
          ],
          [
            `Each term is a digit at its value: $${expandedSum(n, p)} = ${fix(n, p)}$.`,
            `每一项都是一个数字表示的值：$${expandedSum(n, p)} = ${fix(n, p)}$。`,
          ],
          decimalChart([[n, p]], 0, 3),
        );
      },
      decimalChart([[257, 2]], 0, 2),
    ),
  ],
  t(
    "A bottle holds $1.25$ L. Split it by place: $1 + 0.2 + 0.05$. Each part is one digit at its own value.\n\nCheck: $1 + 0.2 + 0.05 = 1.25$.\n\nIn this lesson we write decimals in expanded form, with decimals and with fractions.",
    "一个瓶子装 $1.25$ 升。按数位拆开：$1 + 0.2 + 0.05$。每一项是一个数字在它自己数位上的值。\n\n检验：$1 + 0.2 + 0.05 = 1.25$。\n\n本课我们把小数写成展开式，用小数写，也用分数写。",
  ),
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
    point(
      "standard-form-from-expanded-decimals",
      ["Standard form from expanded form", "由展开式写出小数"],
      [
        "$6 + 0.7 + 0.03 = 6.73$: 6 ones, 7 tenths and 3 hundredths.\n\nCheck: split $6.73$ by place and you get the same three parts.\n\n> **Watch out.** Put each digit in its own place. $0.03$ is 3 hundredths, so the 3 goes in the second place after the point.",
        "$6 + 0.7 + 0.03 = 6.73$：6 个一、7 个十分之一和 3 个百分之一。\n\n检验：把 $6.73$ 按数位拆开，正好是这三部分。\n\n> **注意。** 每个数字要放在自己的数位上。$0.03$ 是 3 个百分之一，3 要写在小数点后第二位。",
      ],
      (rng) => {
        const p = rng.int(2, 3);
        let n = rng.int(1, 99) * pow10(p);
        for (let k = 1; k <= p; k++) n += rng.int(1, 9) * pow10(p - k);
        return answered(
          [`Write as one decimal: $${expandedSum(n, p)}$.`, `写成一个小数：$${expandedSum(n, p)}$。`],
          D(n, p),
          [
            [
              ["Read each term", "看每一项"],
              ["Each term tells one digit and its place.", "每一项告诉我们一个数字和它的数位。"],
            ],
            [
              ["Put the digits in place", "放进数位"],
              ["Write the digits in their places.", "把数字写进对应的数位。"],
              [`${expandedSum(n, p)} = ${fix(n, p)}`],
            ],
          ],
          [`Split $${fix(n, p)}$ by place and you get the same terms back.`, `把 $${fix(n, p)}$ 按数位拆开，得到的正好是原来各项。`],
          [
            [D(n, p + 1), "Every digit is one place too far right.", "每个数字都往右多移了一位。"],
            [D(n, p - 1), "Every digit is one place too far left.", "每个数字都往左多移了一位。"],
          ],
          { form: "decimal", figure: decimalChart([[n, p]], -1, 3) },
        );
      },
      decimalChart([[673, 2]], 0, 2),
    ),
    point(
      "standard-form-with-missing-places",
      ["Standard form with a missing place", "有空位的展开式"],
      [
        "$5 + 0.03 = 5.03$. There are no tenths, so a 0 holds the tenths place.\n\nCheck: in $5.03$ the 3 is in the hundredths place, worth $0.03$.\n\n> **Watch out.** Do not skip the empty place. $5.3$ would mean 3 tenths.",
        "$5 + 0.03 = 5.03$。没有十分之一，所以十分位上写 0 占位。\n\n检验：在 $5.03$ 中，3 在百分位上，表示 $0.03$。\n\n> **注意。** 空着的数位不能跳过。$5.3$ 表示 3 个十分之一。",
      ],
      (rng) => {
        const p = rng.int(2, 3);
        const gap = rng.int(1, p - 1);
        let n = rng.int(1, 99) * pow10(p);
        for (let k = 1; k <= p; k++) if (k !== gap) n += rng.int(1, 9) * pow10(p - k);
        const closed = Number(String(n).slice(0, -(p - gap + 1)) + String(n).slice(-(p - gap)));
        return answered(
          [`Write as one decimal: $${expandedSum(n, p)}$.`, `写成一个小数：$${expandedSum(n, p)}$。`],
          D(n, p),
          [
            [
              ["Find the empty place", "找空位"],
              [
                `There is no ${placeName(gap).en.replace(/s$/, "")} term, so that place gets a 0.`,
                `没有${placeName(gap)["zh-CN"]}上的项，这一位写 0。`,
              ],
            ],
            [
              ["Put the digits in place", "放进数位"],
              ["Write each digit in its place.", "把每个数字写进对应的数位。"],
              [`${expandedSum(n, p)} = ${fix(n, p)}`],
            ],
          ],
          [
            `Split $${fix(n, p)}$ by place: the 0 adds nothing and the other terms come back.`,
            `把 $${fix(n, p)}$ 按数位拆开：0 不加任何值，其余各项和原来一样。`,
          ],
          [
            [
              D(closed, p - 1),
              `That skips the empty ${placeName(gap).en} place, so the digits after it move left.`,
              `这里跳过了空着的${placeName(gap)["zh-CN"]}，后面的数字都往左移了。`,
            ],
          ],
          { form: "decimal", figure: decimalChart([[n, p]], -1, 3, gap) },
        );
      },
      decimalChart([[503, 2]], 0, 2, 1),
    ),
  ],
  t(
    "A recipe uses $3 + 0.4 + 0.02$ kg of flour. Put each digit in its place: 3 ones, 4 tenths, 2 hundredths. That is $3.42$ kg.\n\nCheck: $3.42 = 3 + 0.4 + 0.02$.\n\nIn this lesson we turn an expanded form back into one decimal.",
    "一份食谱要用 $3 + 0.4 + 0.02$ 千克面粉。把每个数字放进它的数位：3 个一、4 个十分之一、2 个百分之一，就是 $3.42$ 千克。\n\n检验：$3.42 = 3 + 0.4 + 0.02$。\n\n本课我们把展开式写回一个小数。",
  ),
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
    point(
      "recognizing-equivalent-decimals",
      ["Recognizing equivalent decimals", "认识相等的小数"],
      [
        "$0.4 = 0.40 = 0.400$. A zero at the far right adds no value.\n\nCheck: 4 tenths fill 4 columns of a hundredths square, which is 40 small squares: $0.40$.\n\n> **Watch out.** A zero right after the point changes the number. $0.04$ is not $0.4$.",
        "$0.4 = 0.40 = 0.400$。在小数末尾添上 0，大小不变。\n\n检验：4 个十分之一是百格图的 4 整列，也就是 40 个小方格：$0.40$。\n\n> **注意。** 紧挨着小数点添 0 会改变大小。$0.04$ 不等于 $0.4$。",
      ],
      (rng) => {
        const w = rng.int(0, 9);
        const d = rng.int(1, 9);
        const n = w * 10 + d;
        return pickedMath(
          rng,
          [`Which decimal is equal to $${fix(n, 1)}$?`, `哪个小数等于 $${fix(n, 1)}$？`],
          fix(n * 10, 2),
          [
            [
              fix(w * 100 + d, 2),
              "The zero right after the point moves the digit to the hundredths.",
              "紧挨着小数点的 0 把数字挤到了百分位。",
            ],
            [fix(n, 0), "That drops the point, so the number is 10 times as large.", "这里去掉了小数点，数变成了 10 倍。"],
            [fix(w * 1000 + d, 3), "Two zeros after the point move the digit to the thousandths.", "小数点后的两个 0 把数字挤到了千分位。"],
          ],
          [
            [
              ["Look at the zeros", "看 0 的位置"],
              ["A zero at the far right adds nothing.", "末尾的 0 不改变大小。"],
            ],
            [
              ["Compare the places", "比较数位"],
              [`The ${d} stays in the tenths place.`, `${d} 仍然在十分位上。`],
              [`${fix(n, 1)} = ${fix(n * 10, 2)}`],
            ],
          ],
          [
            `$${fix(n * 10, 2)}$ is ${n * 10} hundredths, which is ${n} tenths.`,
            `$${fix(n * 10, 2)}$ 是 ${n * 10} 个百分之一，也就是 ${n} 个十分之一。`,
          ],
          hundredthsGrid(d * 10),
        );
      },
      hundredthsGrid(40),
    ),
    point(
      "rewriting-in-smaller-units",
      ["Rewriting in smaller units", "换成更小的单位"],
      [
        "$0.6$ is 6 tenths. Each tenth is 10 hundredths, so $0.6$ is 60 hundredths: $0.6 = 0.60$.\n\nCheck: 6 columns of a hundredths square hold $6 \\times 10 = 60$ small squares.\n\n> **Watch out.** It is 60 hundredths, not 6. Smaller units need more of them.",
        "$0.6$ 是 6 个十分之一。1 个十分之一是 10 个百分之一，所以 $0.6$ 是 60 个百分之一：$0.6 = 0.60$。\n\n检验：百格图的 6 整列有 $6 \\times 10 = 60$ 个小方格。\n\n> **注意。** 是 60 个百分之一，不是 6 个。单位变小，个数变多。",
      ],
      (rng) => {
        if (rng.bool(0.3)) {
          const h = rng.int(11, 99);
          return answered(
            [`$${fix(h, 2)}$ is how many thousandths?`, `$${fix(h, 2)}$ 是多少个千分之一？`],
            h * 10,
            [
              [
                ["Count the hundredths", "数百分之一"],
                [`$${fix(h, 2)}$ is ${h} hundredths.`, `$${fix(h, 2)}$ 是 ${h} 个百分之一。`],
              ],
              [
                ["Change the unit", "换单位"],
                ["Each hundredth is 10 thousandths.", "1 个百分之一是 10 个千分之一。"],
                [`${h} \\times 10 = ${h * 10}`],
              ],
            ],
            [`Write it with more places: $${fix(h, 2)} = ${fix(h * 10, 3)}$.`, `添上 0：$${fix(h, 2)} = ${fix(h * 10, 3)}$。`],
            [
              [h, "That keeps the count the same. Smaller units need more of them.", "个数没变。单位变小，个数要变多。"],
              [h * 100, "That is one place too many.", "这多算了一位。"],
              [10, "That is one hundredth, not all of them.", "这只是 1 个百分之一的。"],
            ],
            { figure: hundredthsGrid(h) },
          );
        }
        const d = rng.int(1, 9);
        const thousandths = rng.bool(0.3);
        const [k, unit, unitZhName] = thousandths ? ([100, "thousandths", "千分之一"] as const) : ([10, "hundredths", "百分之一"] as const);
        return answered(
          [`$${fix(d, 1)}$ is how many ${unit}?`, `$${fix(d, 1)}$ 是多少个${unitZhName}？`],
          d * k,
          [
            [
              ["Count the tenths", "数十分之一"],
              [`$${fix(d, 1)}$ is ${d} tenths.`, `$${fix(d, 1)}$ 是 ${d} 个十分之一。`],
            ],
            [
              ["Change the unit", "换单位"],
              [`Each tenth is ${k} ${unit}.`, `1 个十分之一是 ${k} 个${unitZhName}。`],
              [`${d} \\times ${k} = ${d * k}`],
            ],
          ],
          [
            `Write it with more places: $${fix(d, 1)} = ${fix(d * k, thousandths ? 3 : 2)}$.`,
            `添上 0：$${fix(d, 1)} = ${fix(d * k, thousandths ? 3 : 2)}$。`,
          ],
          [
            [d, "That keeps the count the same. Smaller units need more of them.", "个数没变。单位变小，个数要变多。"],
            [d * k * 10, "That is one place too many.", "这多算了一位。"],
            [k, "That is one tenth, not all of them.", "这只是 1 个十分之一的。"],
          ],
          { figure: hundredthsGrid(d * 10) },
        );
      },
      hundredthsGrid(60),
    ),
  ],
  t(
    "Ana runs $0.5$ km and Ben runs $0.50$ km. On a hundredths square, 5 columns is the same as 50 small squares, so they run the same distance.\n\nCheck: $0.50 = \\frac{50}{100} = \\frac{5}{10} = 0.5$.\n\nIn this lesson we see which decimals are equal and rewrite decimals in smaller units.",
    "安娜跑了 $0.5$ 千米，小本跑了 $0.50$ 千米。在百格图上，5 整列就是 50 个小方格，所以他们跑得一样远。\n\n检验：$0.50 = \\frac{50}{100} = \\frac{5}{10} = 0.5$。\n\n本课我们判断哪些小数相等，并把小数换成更小的单位。",
  ),
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
    point(
      "comparing-two-decimals",
      ["Comparing two decimals", "比较两个小数"],
      [
        "Compare $0.7$ and $0.65$. Write $0.7$ as $0.70$. The tenths differ: 7 tenths is more than 6 tenths, so $0.7 > 0.65$.\n\nCheck: on a number line, $0.7$ is to the right of $0.65$.\n\n> **Watch out.** More digits does not mean larger. $0.65$ is less than $0.7$.",
        "比较 $0.7$ 和 $0.65$。把 $0.7$ 写成 $0.70$。十分位不同：7 个十分之一比 6 个十分之一多，所以 $0.7 > 0.65$。\n\n检验：在数轴上，$0.7$ 在 $0.65$ 的右边。\n\n> **注意。** 位数多的小数不一定大。$0.65$ 比 $0.7$ 小。",
      ],
      (rng) => {
        const w = rng.int(0, 9);
        const x = rng.int(1, 9);
        const y = rng.bool(0.15) ? x * 10 : rng.int(10, 99);
        const swap = rng.bool();
        const [a, pa, b, pb] = swap ? [w * 100 + y, 2, w * 10 + x, 1] : [w * 10 + x, 1, w * 100 + y, 2];
        const [ha, hb] = [a * pow10(2 - pa), b * pow10(2 - pb)];
        const rel = ha < hb ? 0 : ha === hb ? 1 : 2;
        const [longer, shorter] = [fix(w * 100 + y, 2), fix(w * 10 + x, 1)];
        return compared(
          fix(a, pa),
          fix(b, pb),
          rel,
          [
            [
              ["Use the same places", "补成同样的位数"],
              ["Write both with two places after the point.", "把两个数都写成两位小数。"],
              [`${fix(ha, 2)},\\quad ${fix(hb, 2)}`],
            ],
            [
              ["Compare the hundredths", "比较百分之一的个数"],
              [
                `The whole parts are both ${w}. Compare ${ha % 100} hundredths with ${hb % 100} hundredths.`,
                `整数部分都是 ${w}，比较 ${ha % 100} 个和 ${hb % 100} 个百分之一。`,
              ],
            ],
          ],
          [
            rel === 1
              ? "On a number line the two numbers are the same point."
              : `On a number line, $${fix(rel === 0 ? b : a, rel === 0 ? pb : pa)}$ is to the right.`,
            rel === 1 ? "在数轴上，两个数是同一个点。" : `在数轴上，$${fix(rel === 0 ? b : a, rel === 0 ? pb : pa)}$ 在右边。`,
          ],
          [
            [
              `$${fix(a, pa)}$ is not less. Fill in zeros so both have two places and compare again.`,
              `$${fix(a, pa)}$ 并不小。补 0 使两个数位数相同，再比较。`,
            ],
            [`$${longer}$ and $${shorter}$ are not the same amount.`, `$${longer}$ 和 $${shorter}$ 大小不同。`],
            [
              `$${fix(a, pa)}$ is not greater. Having more digits does not make a decimal larger.`,
              `$${fix(a, pa)}$ 并不大。小数的位数多，不一定就大。`,
            ],
          ],
          decimalLine(Math.min(ha, hb), Math.max(ha, hb)),
        );
      },
      decLine(0.6, 0.75, 0.05, [0.65, 0.7]),
    ),
    point(
      "greatest-and-least-decimal",
      ["The greatest and least decimal", "找最大和最小的小数"],
      [
        "Of $3.09$, $3.9$, $3.19$ and $3.091$, the greatest is $3.9$: it has 9 tenths, and the others have 0 or 1 tenth.\n\nCheck: write them with three places: $3.090$, $3.900$, $3.190$, $3.091$. $3.900$ is the largest.\n\n> **Watch out.** Compare the tenths first. A longer decimal is not larger.",
        "$3.09$、$3.9$、$3.19$、$3.091$ 中最大的是 $3.9$：它的十分位是 9，其他数的十分位是 0 或 1。\n\n检验：都写成三位小数：$3.090$、$3.900$、$3.190$、$3.091$。$3.900$ 最大。\n\n> **注意。** 先比较十分位。位数多的小数不一定大。",
      ],
      (rng) => {
        const w = rng.int(0, 9);
        const [x, y] = [rng.int(1, 8), rng.int(1, 9)];
        const greatest = rng.bool();
        const nums: [number, number][] = [
          [w * 10 + x + 1, 1],
          [w * 100 + x * 10 + y, 2],
          [w * 1000 + x * 100 + y * 10 + rng.int(1, 9), 3],
          [w * 100 + y, 2],
        ];
        const values = nums.map(([n, p]) => D(n, p));
        const best = values.reduce((m, v, i) => ((greatest ? v.cmp(values[m]!) > 0 : v.cmp(values[m]!) < 0) ? i : m), 0);
        const pick = nums[best]!;
        const rest = nums.filter((_, i) => i !== best);
        return pickedMath(
          rng,
          [greatest ? "Which decimal is the greatest?" : "Which decimal is the least?", greatest ? "哪个小数最大？" : "哪个小数最小？"],
          fix(pick[0], pick[1]),
          rest.map(([n, p]) => [
            fix(n, p),
            greatest
              ? `$${fix(n, p)}$ is less than $${fix(pick[0], pick[1])}$. Compare tenths first, then hundredths.`
              : `$${fix(n, p)}$ is greater than $${fix(pick[0], pick[1])}$. Compare tenths first, then hundredths.`,
            greatest
              ? `$${fix(n, p)}$ 比 $${fix(pick[0], pick[1])}$ 小。先比十分位，再比百分位。`
              : `$${fix(n, p)}$ 比 $${fix(pick[0], pick[1])}$ 大。先比十分位，再比百分位。`,
          ]),
          [
            [
              ["Use the same places", "补成同样的位数"],
              ["Write each with three places after the point.", "把每个数都写成三位小数。"],
              [nums.map(([n, p]) => fix(n * pow10(3 - p), 3)).join(", ")],
            ],
            [
              ["Compare place by place", "逐位比较"],
              [`The whole parts are all ${w}, so compare the thousandths counts.`, `整数部分都是 ${w}，比较千分之一的个数。`],
            ],
          ],
          [
            `On a number line, $${fix(pick[0], pick[1])}$ is farthest to the ${greatest ? "right" : "left"}.`,
            `在数轴上，$${fix(pick[0], pick[1])}$ 在最${greatest ? "右" : "左"}边。`,
          ],
          decLine(
            w,
            w + 1,
            0.1,
            values.map((v) => Number(dq(v))),
          ),
        );
      },
      decLine(3, 4, 0.1, [3.09, 3.19, 3.9]),
    ),
  ],
  t(
    "Mia jumps $1.45$ m and Leo jumps $1.5$ m. Write $1.5$ as $1.50$: then 50 hundredths beat 45 hundredths, so Leo jumps farther.\n\nCheck: on a number line, $1.5$ is to the right of $1.45$.\n\nIn this lesson we compare decimals place by place and order them.",
    "米娅跳了 $1.45$ 米，小乐跳了 $1.5$ 米。把 $1.5$ 写成 $1.50$：50 个百分之一比 45 个百分之一多，所以小乐跳得远。\n\n检验：在数轴上，$1.5$ 在 $1.45$ 的右边。\n\n本课我们按数位比较小数，并把小数排序。",
  ),
);

/** roundTo rounds n/10ᵖ to place k (0 ones, 1 tenths, 2 hundredths), as a value. */
const roundTo = (n: number, p: number, k: number) => D(roundInt(n, pow10(p - k)), p);

/** truncTo cuts n/10ᵖ off after place k. */
const truncTo = (n: number, p: number, k: number) => D(truncInt(n, pow10(p - k)), p);

/** placeTarget names the place to round to: "the nearest whole number", "the nearest tenth"… */
const placeTarget = (k: number): Text =>
  [t("the nearest whole number", "个位（取整数）"), t("the nearest tenth", "十分位"), t("the nearest hundredth", "百分位")][k]!;

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

/** roundedText writes n/10ᵖ rounded to place k with exactly k places: 6.0, 2.38. */
const roundedText = (n: number, p: number, k: number) => fix(roundInt(n, pow10(p - k)) / pow10(p - k), k);

/** roundLine draws the stretch of number line from n/10ᵖ cut down to place k up to one unit of that place more, with n marked. */
function roundLine(n: number, p: number, k: number): Figure {
  const lo = Number(dq(truncTo(n, p, k)));
  const u = Number(dq(placeValue(k)));
  return decLine(lo, lo + u, u / 10, [Number(dq(D(n, p)))]);
}

/** roundingAnswer asks to round n/10ᵖ to place k, works it in two labelled steps, checks it on a number line and gives the usual slips with their reasons. */
function roundingAnswer(n: number, p: number, k: number): Problem {
  const next = digitAtPlace(n, p, k + 1);
  const up = next >= 5;
  const r = roundTo(n, p, k);
  const down = truncTo(n, p, k);
  const other = up ? down : down.add(placeValue(k));
  const nines = up && digitAtPlace(n, p, k) === 9 && k >= 1;
  const misses: Miss[] = [
    [
      other,
      up ? "That drops the digits but forgets to round up." : "That rounds up, but the next digit is less than 5.",
      up ? "这只是去掉了后面的数字，忘了进一。" : "这是进一了，但下一位小于 5。",
    ],
  ];
  if (k + 1 <= p) misses.push([roundTo(n, p, k + 1), "That rounds to one place too many.", "这多保留了一位。"]);
  if (k >= 1) misses.push([roundTo(n, p, k - 1), "That rounds to one place too few.", "这少保留了一位。"]);
  if (nines)
    misses.push([
      truncTo(n, p, k - 1).add(placeValue(k)),
      "That writes 10 in one place instead of carrying 1 to the left.",
      "这是把 10 写进了一个数位，没有向左进 1。",
    ]);
  const place = k === 0 ? "ones" : placeName(k).en;
  const placeZh = k === 0 ? "个位" : placeName(k)["zh-CN"];
  return answered(
    [`Round $${fix(n, p)}$ to ${placeTarget(k).en}.`, `把 $${fix(n, p)}$ 四舍五入到${placeTarget(k)["zh-CN"]}。`],
    r,
    [
      [
        ["Find the place", "找保留的数位"],
        [`The ${place} digit is ${digitAtPlace(n, p, k)}.`, `${placeZh}上是 ${digitAtPlace(n, p, k)}。`],
      ],
      [
        ["Look at the next digit", "看下一位"],
        [
          `The next digit is ${next}, which is ${up ? "5 or more, so round up" : "less than 5, so round down"}.`,
          `下一位是 ${next}，${up ? "大于或等于 5，所以进一" : "小于 5，所以舍去"}。`,
        ],
        [`${fix(n, p)} \\approx ${roundedText(n, p, k)}`],
      ],
    ],
    [
      `On the number line, $${fix(n, p)}$ is closer to $${dq(r)}$ than to $${dq(other)}$.`,
      `在数轴上，$${fix(n, p)}$ 离 $${dq(r)}$ 比离 $${dq(other)}$ 近。`,
    ],
    misses,
    { form: "decimal", figure: roundLine(n, p, k) },
  );
}

/** sigPlace is the exponent of the place of the s-th significant figure of n/10ᵖ, as a power of ten. */
const sigPlace = (n: number, p: number, s: number) => String(n).length - s - p;

/** sigLine draws the stretch of number line between the two values of n/10ᵖ with s significant figures, with n marked. */
function sigLine(n: number, p: number, s: number): Figure {
  const e = sigPlace(n, p, s);
  const u = 10 ** e;
  const v = n / pow10(p);
  const lo = Math.floor(v / u + 1e-9) * u;
  return decLine(Number(lo.toFixed(8)), Number((lo + u).toFixed(8)), u / 10, [v]);
}

/** sigAnswer asks to round n/10ᵖ to s significant figures with the usual slips and their reasons. */
function sigAnswer(n: number, p: number, s: number, extra: readonly Miss[]): Problem {
  const len = String(n).length;
  const f = pow10(len - s);
  const r = D(roundInt(n, f), p);
  const cut = D(truncInt(n, f), p);
  const up = Number(String(n)[s]) >= 5;
  const shown = (q: Q) => (q.isInteger() ? texCommas(Number(q.toString())) : dq(q));
  const digits = String(n).slice(0, s).split("").join(", ");
  return answered(
    [
      `Round $${p === 0 ? texCommas(n) : fix(n, p)}$ to ${sigFigures(s).en}.`,
      `把 $${p === 0 ? texCommas(n) : fix(n, p)}$ 保留 ${s} 位有效数字。`,
    ],
    r,
    [
      [
        ["Find the significant figures", "找有效数字"],
        s === 1
          ? [`Start at the first nonzero digit, ${digits}.`, `从第一个非零数字 ${digits} 开始。`]
          : [
              `Start at the first nonzero digit. The first ${s} are ${digits}.`,
              `从第一个非零数字数起，前 ${s} 个是 ${digits.replace(/, /g, "、")}。`,
            ],
      ],
      [
        ["Round", "四舍五入"],
        [`The next digit is ${String(n)[s]}, so round ${up ? "up" : "down"}.`, `下一位是 ${String(n)[s]}，所以${up ? "进一" : "舍去"}。`],
        [`${p === 0 ? texCommas(n) : fix(n, p)} \\approx ${shown(r)}`],
      ],
    ],
    [
      `On the number line, $${p === 0 ? texCommas(n) : fix(n, p)}$ is closer to $${shown(r)}$ than to $${shown(up ? cut : cut.add(D(f, p)))}$.`,
      `在数轴上，$${p === 0 ? texCommas(n) : fix(n, p)}$ 离 $${shown(r)}$ 比离 $${shown(up ? cut : cut.add(D(f, p)))}$ 近。`,
    ],
    [
      [
        up ? cut : cut.add(D(f, p)),
        up ? "That forgets to round up." : "That rounds up, but the next digit is less than 5.",
        up ? "这里忘了进一。" : "这是进一了，但下一位小于 5。",
      ],
      ...extra,
    ],
    { form: p === 0 ? "integer" : "decimal", figure: sigLine(n, p, s) },
  );
}

/** roundWhole rounds n/10ᵖ to the nearest whole number. */
const roundWhole = (n: number, p: number) => roundInt(n, pow10(p)) / pow10(p);

/** estimateTape draws a bar model of two decimals with their rounded values written in the pieces. */
function estimateTape(a: number, pa: number, b: number, pb: number, sum: boolean): Figure {
  const [va, vb] = [a / pow10(pa), b / pow10(pb)];
  const tapes = sum
    ? [
        {
          total: `≈ ${roundWhole(a, pa) + roundWhole(b, pb)}`,
          pieces: [
            { size: va, text: `≈ ${roundWhole(a, pa)}` },
            { size: vb, text: `≈ ${roundWhole(b, pb)}`, lit: true },
          ],
        },
      ]
    : [
        {
          total: `${fix(a, pa)} ≈ ${roundWhole(a, pa)}`,
          pieces: [
            { size: vb, text: `≈ ${roundWhole(b, pb)}`, lit: true },
            { size: va - vb, text: "?", dashed: true },
          ],
        },
      ];
  return tapeFigure(tapes, [
    sum
      ? `A bar made of ${fix(a, pa)} and ${fix(b, pb)}, each with its nearest whole number written in it.`
      : `A bar of ${fix(a, pa)} with ${fix(b, pb)} shaded and the rest marked with a question mark.`,
    sum
      ? `一个长条由 ${fix(a, pa)} 和 ${fix(b, pb)} 组成，每段里写着它最接近的整数。`
      : `一个表示 ${fix(a, pa)} 的长条，其中 ${fix(b, pb)} 涂了颜色，剩下的部分标着问号。`,
  ]);
}

/** sumChart draws two decimals and their sum or difference lined up at the point in a place-value chart. */
const sumChart = (a: number, pa: number, b: number, pb: number, r: number, pr: number) =>
  decimalChart(
    [
      [a, pa],
      [b, pb],
      [r, pr],
    ],
    Math.max(a / pow10(pa), b / pow10(pb), r / pow10(pr)) >= 10 ? -1 : 0,
    Math.max(pa, pb, 1),
  );

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
    point(
      "rounding-down-to-whole-numbers-and-tenths",
      ["Rounding down to whole numbers and tenths", "四舍到整数和十分位"],
      [
        "$8.342$ to the nearest tenth: the next digit is the 4 in the hundredths place. 4 is less than 5, so keep the 3 and drop the rest: $8.342 \\approx 8.3$.\n\nCheck: on a number line, $8.342$ is closer to $8.3$ than to $8.4$.\n\n> **Watch out.** Rounding down keeps the digit. It does not take 1 away, so the answer is not $8.2$.",
        "把 $8.342$ 四舍五入到十分位：看百分位上的 4。4 小于 5，所以 3 不变，后面的数字去掉：$8.342 \\approx 8.3$。\n\n检验：在数轴上，$8.342$ 离 $8.3$ 比离 $8.4$ 近。\n\n> **注意。** 舍去时保留的数字不变，不是减 1，所以不是 $8.2$。",
      ],
      (rng) => {
        const k = rng.int(0, 1);
        return roundingAnswer(decimalToRound(rng, k, false), 3, k);
      },
      decLine(8.3, 8.4, 0.01, [8.342]),
    ),
    point(
      "rounding-down-to-hundredths",
      ["Rounding down to hundredths", "四舍到百分位"],
      [
        "$0.563$ to the nearest hundredth: look at the thousandths digit, 3. It is less than 5, so $0.563 \\approx 0.56$.\n\nCheck: on a number line, $0.563$ is closer to $0.56$ than to $0.57$.\n\n> **Watch out.** For hundredths, look at the third place after the point, not the second.",
        "把 $0.563$ 四舍五入到百分位：看千分位上的 3。它小于 5，所以 $0.563 \\approx 0.56$。\n\n检验：在数轴上，$0.563$ 离 $0.56$ 比离 $0.57$ 近。\n\n> **注意。** 保留到百分位要看小数点后第三位，不是第二位。",
      ],
      (rng) => roundingAnswer(decimalToRound(rng, 2, false), 3, 2),
      decLine(0.56, 0.57, 0.001, [0.563]),
    ),
  ],
  t(
    "A ribbon is $4.32$ m long. To the nearest tenth, look at the 2 in the hundredths place. It is less than 5, so the ribbon is about $4.3$ m.\n\nCheck: on a number line, $4.32$ is closer to $4.3$ than to $4.4$.\n\nIn this lesson we round decimals down to whole numbers, tenths and hundredths.",
    "一根丝带长 $4.32$ 米。保留到十分位，看百分位上的 2。它小于 5，所以丝带大约长 $4.3$ 米。\n\n检验：在数轴上，$4.32$ 离 $4.3$ 比离 $4.4$ 近。\n\n本课我们把小数四舍到整数、十分位和百分位。",
  ),
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
    point(
      "rounding-up-to-a-place",
      ["Rounding up to a place", "五入到某一位"],
      [
        "$2.375$ to the nearest hundredth: the thousandths digit is 5, so add 1 to the 7: $2.375 \\approx 2.38$.\n\nCheck: $2.375$ is exactly halfway, and halfway rounds up.\n\n> **Watch out.** Add 1 to the rounding digit before you drop the rest. Just dropping gives $2.37$.",
        "把 $2.375$ 四舍五入到百分位：千分位是 5，所以 7 加 1：$2.375 \\approx 2.38$。\n\n检验：$2.375$ 正好在中间，正中间要进一。\n\n> **注意。** 先给保留的数字加 1，再去掉后面的数字。只去掉会得到 $2.37$。",
      ],
      (rng) => {
        const k = rng.int(0, 2);
        return roundingAnswer(decimalToRound(rng, k, true), 3, k);
      },
      decLine(2.37, 2.38, 0.001, [2.375]),
    ),
    point(
      "rounding-up-through-nines",
      ["Rounding up through nines", "遇 9 进位"],
      [
        "$5.97$ to the nearest tenth: the 7 rounds the 9 up to 10. Write 0 in the tenths and carry 1 to the ones: $5.97 \\approx 6.0$.\n\nCheck: on a number line, $5.97$ is closer to $6.0$ than to $5.9$.\n\n> **Watch out.** 10 cannot sit in one place. $5.10$ is wrong; carry the 1.",
        "把 $5.97$ 四舍五入到十分位：7 使十分位的 9 变成 10。十分位写 0，向个位进 1：$5.97 \\approx 6.0$。\n\n检验：在数轴上，$5.97$ 离 $6.0$ 比离 $5.9$ 近。\n\n> **注意。** 一个数位放不下 10。写成 $5.10$ 是错的，要进位。",
      ],
      (rng) => {
        const k = rng.int(0, 2);
        return roundingAnswer(decimalToRound(rng, k, true, true), 3, k);
      },
      decLine(5.9, 6, 0.01, [5.97]),
    ),
  ],
  t(
    "A pumpkin weighs $6.28$ kg. To the nearest tenth, look at the 8. It is 5 or more, so add 1 to the tenths: about $6.3$ kg.\n\nCheck: on a number line, $6.28$ is closer to $6.3$ than to $6.2$.\n\nIn this lesson we round decimals up, even when a 9 has to carry.",
    "一个南瓜重 $6.28$ 千克。保留到十分位，看 8。它大于或等于 5，所以十分位加 1：大约 $6.3$ 千克。\n\n检验：在数轴上，$6.28$ 离 $6.3$ 比离 $6.2$ 近。\n\n本课我们学习小数的五入，也包括 9 要进位的情况。",
  ),
);

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
    point(
      "rounding-to-one-significant-figure",
      ["Rounding to 1 significant figure", "保留 1 位有效数字"],
      [
        "$7{,}640$ to 1 significant figure: keep the first digit, 7, and look at the next, 6. Round up: $8{,}000$.\n\nCheck: $7{,}640$ is closer to $8{,}000$ than to $7{,}000$.\n\n> **Watch out.** Keep the zeros that hold the places. The answer is $8{,}000$, not 8.",
        "把 $7{,}640$ 保留 1 位有效数字：保留第一个数字 7，看下一位 6，进一：$8{,}000$。\n\n检验：$7{,}640$ 离 $8{,}000$ 比离 $7{,}000$ 近。\n\n> **注意。** 占位的 0 要保留。答案是 $8{,}000$，不是 8。",
      ],
      (rng) => {
        let n = rng.int(110, 99999);
        while (String(n)[1] === "5" || Math.round(n / pow10(String(n).length - 1)) >= 10) n = rng.int(110, 99999);
        const len = String(n).length;
        const lead = Math.round(n / pow10(len - 1));
        return sigAnswer(n, 0, 1, [
          [lead, "That keeps the digit but drops the zeros that hold the places.", "这保留了数字，却去掉了占位的 0。"],
        ]);
      },
      sigLine(7640, 0, 1),
    ),
    point(
      "rounding-to-several-significant-figures",
      ["Rounding to several significant figures", "保留几位有效数字"],
      [
        "$48{,}372$ to 3 significant figures: keep 4, 8, 3 and look at the 7. Round up: $48{,}400$.\n\nCheck: $48{,}372$ is closer to $48{,}400$ than to $48{,}300$.\n\n> **Watch out.** Count significant figures from the first digit. Rounding to the hundreds here, not to 3 zeros.",
        "把 $48{,}372$ 保留 3 位有效数字：保留 4、8、3，看下一位 7，进一：$48{,}400$。\n\n检验：$48{,}372$ 离 $48{,}400$ 比离 $48{,}300$ 近。\n\n> **注意。** 有效数字从第一个数字开始数。这里是保留到百位，不是末尾写 3 个 0。",
      ],
      (rng) => {
        const s = rng.int(2, 3);
        let n = rng.int(10000, 999999);
        while ("05".includes(String(n)[s] ?? "")) n = rng.int(10000, 999999);
        const len = String(n).length;
        return sigAnswer(n, 0, s, [
          [
            roundInt(n, 1000),
            "That rounds to the thousands, not to the place of the last significant figure.",
            "这是保留到千位，不是保留到最后一个有效数字所在的位。",
          ],
          [roundInt(n, pow10(len - s + 1)), "That keeps one significant figure too few.", "这少保留了一位有效数字。"],
        ]);
      },
      sigLine(48372, 0, 3),
    ),
  ],
  t(
    "A town has $48{,}372$ people. A news report says about $48{,}000$: it keeps the 2 most important digits, 4 and 8, and fills the rest with zeros.\n\nCheck: $48{,}372$ is closer to $48{,}000$ than to $49{,}000$.\n\nIn this lesson we round whole numbers to a number of significant figures.",
    "一个小镇有 $48{,}372$ 人。新闻说大约 $48{,}000$ 人：保留最重要的两位数字 4 和 8，其余写 0。\n\n检验：$48{,}372$ 离 $48{,}000$ 比离 $49{,}000$ 近。\n\n本课我们把整数保留几位有效数字。",
  ),
);

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
    point(
      "significant-figures-of-small-decimals",
      ["Decimals less than 1", "小于 1 的小数"],
      [
        "$0.00586$ to 2 significant figures: skip the zeros in front. The first two are 5 and 8, and the next digit 6 rounds the 8 up: $0.0059$.\n\nCheck: on a number line, $0.00586$ is closer to $0.0059$ than to $0.0058$.\n\n> **Watch out.** Zeros in front do not count. Keeping 2 places after the point would give $0.01$.",
        "把 $0.00586$ 保留 2 位有效数字：前面的 0 不算。前两个是 5 和 8，下一位 6，所以 8 进一：$0.0059$。\n\n检验：在数轴上，$0.00586$ 离 $0.0059$ 比离 $0.0058$ 近。\n\n> **注意。** 前面的 0 不是有效数字。保留两位小数会得到 $0.01$。",
      ],
      (rng) => {
        const zeros = rng.int(1, 2);
        const len = rng.int(3, 4);
        let n = nonZeroEnd(rng, len);
        while (String(n)[2] === "5") n = nonZeroEnd(rng, len);
        const p = zeros + len;
        const s = rng.int(1, 2);
        return sigAnswer(n, p, s, [
          [
            roundTo(n, p, s),
            `That keeps ${s} place${s === 1 ? "" : "s"} after the point, not ${s} significant figure${s === 1 ? "" : "s"}.`,
            `这是保留了 ${s} 位小数，不是 ${s} 位有效数字。`,
          ],
        ]);
      },
      sigLine(586, 5, 2),
    ),
    point(
      "significant-figures-of-larger-decimals",
      ["Decimals greater than 1", "大于 1 的小数"],
      [
        "$14.276$ to 3 significant figures: the first three are 1, 4 and 2, and the next digit 7 rounds the 2 up: $14.3$.\n\nCheck: on a number line, $14.276$ is closer to $14.3$ than to $14.2$.\n\n> **Watch out.** The digits before the point count too. Keeping 3 places after the point would give $14.276$.",
        "把 $14.276$ 保留 3 位有效数字：前三个是 1、4、2，下一位 7，所以 2 进一：$14.3$。\n\n检验：在数轴上，$14.276$ 离 $14.3$ 比离 $14.2$ 近。\n\n> **注意。** 小数点前面的数字也是有效数字。保留三位小数还是 $14.276$。",
      ],
      (rng) => {
        const p = rng.int(2, 3);
        let n = rng.int(10, 99) * pow10(p) + nonZeroEnd(rng, p);
        const s = rng.int(2, 3);
        while (String(n)[s] === "5") n = rng.int(10, 99) * pow10(p) + nonZeroEnd(rng, p);
        return sigAnswer(
          n,
          p,
          s,
          s < p
            ? [
                [
                  roundTo(n, p, s),
                  `That keeps ${s} places after the point, not ${s} significant figures.`,
                  `这是保留了 ${s} 位小数，不是 ${s} 位有效数字。`,
                ],
              ]
            : [],
        );
      },
      sigLine(14276, 3, 3),
    ),
  ],
  t(
    "A grain of sand is $0.0473$ cm wide. The zeros in front only show the place, so the significant figures are 4, 7 and 3. To 2 significant figures it is about $0.047$ cm.\n\nCheck: on a number line, $0.0473$ is closer to $0.047$ than to $0.048$.\n\nIn this lesson we round decimals to a number of significant figures.",
    "一粒沙宽 $0.0473$ 厘米。前面的 0 只用来占位，所以有效数字是 4、7、3。保留 2 位有效数字，大约是 $0.047$ 厘米。\n\n检验：在数轴上，$0.0473$ 离 $0.047$ 比离 $0.048$ 近。\n\n本课我们把小数保留几位有效数字。",
  ),
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
    point(
      "estimating-decimal-sums",
      ["Estimating sums", "估算和"],
      [
        "$7.62 + 15.3 \\approx 8 + 15 = 23$. Round each number to the nearest whole number, then add.\n\nCheck: the exact sum is $22.92$, which is close to 23.\n\n> **Watch out.** Round each number by its own tenths digit. $7.62$ rounds to 8, not 7.",
        "$7.62 + 15.3 \\approx 8 + 15 = 23$。先把每个数四舍五入到整数，再相加。\n\n检验：准确的和是 $22.92$，接近 23。\n\n> **注意。** 每个数看自己的十分位。$7.62$ 约是 8，不是 7。",
      ],
      (rng) => {
        const pa = rng.int(1, 2);
        const pb = rng.int(1, 2);
        const a = decimalNotHalf(rng, 1, 60, pa);
        const b = decimalNotHalf(rng, 1, 60, pb);
        const [ra, rb] = [roundWhole(a, pa), roundWhole(b, pb)];
        const exact = D(a, pa).add(D(b, pb));
        const [fa, fb] = [Math.floor(a / pow10(pa)), Math.floor(b / pow10(pb))];
        return answered(
          [
            `Estimate $${fix(a, pa)} + ${fix(b, pb)}$ by rounding each number to the nearest whole number.`,
            `把每个数四舍五入到整数，估算 $${fix(a, pa)} + ${fix(b, pb)}$。`,
          ],
          ra + rb,
          [
            [
              ["Round each number", "取近似数"],
              ["Look at each tenths digit.", "看每个数的十分位。"],
              [`${fix(a, pa)} \\approx ${ra}`, `${fix(b, pb)} \\approx ${rb}`],
            ],
            [["Add", "相加"], ["Add the rounded numbers.", "把近似数相加。"], [`${ra} + ${rb} = ${ra + rb}`]],
          ],
          [`The exact sum is $${dq(exact)}$, which is close to ${ra + rb}.`, `准确的和是 $${dq(exact)}$，接近 ${ra + rb}。`],
          [
            [fa + fb, "That drops the decimal parts instead of rounding.", "这是直接去掉了小数部分，没有四舍五入。"],
            [exact, "That is the exact sum. An estimate uses the rounded numbers.", "这是准确的和。估算要用近似数。"],
          ],
          { figure: estimateTape(a, pa, b, pb, true) },
        );
      },
      estimateTape(762, 2, 153, 1, true),
    ),
    point(
      "estimating-decimal-differences",
      ["Estimating differences", "估算差"],
      [
        "$52.18 - 9.7 \\approx 52 - 10 = 42$. Round each number to the nearest whole number, then subtract.\n\nCheck: the exact difference is $42.48$, which is close to 42.\n\n> **Watch out.** Round each number on its own. $9.7$ rounds to 10, not 9.",
        "$52.18 - 9.7 \\approx 52 - 10 = 42$。先把每个数四舍五入到整数，再相减。\n\n检验：准确的差是 $42.48$，接近 42。\n\n> **注意。** 每个数单独取近似值。$9.7$ 约是 10，不是 9。",
      ],
      (rng) => {
        for (;;) {
          const pa = rng.int(1, 2);
          const pb = rng.int(1, 2);
          const a = decimalNotHalf(rng, 20, 90, pa);
          const b = decimalNotHalf(rng, 2, 19, pb);
          const [ra, rb] = [roundWhole(a, pa), roundWhole(b, pb)];
          const [fa, fb] = [Math.floor(a / pow10(pa)), Math.floor(b / pow10(pb))];
          if (fa - fb === ra - rb) continue;
          const exact = D(a, pa).sub(D(b, pb));
          return answered(
            [
              `Estimate $${fix(a, pa)} - ${fix(b, pb)}$ by rounding each number to the nearest whole number.`,
              `把每个数四舍五入到整数，估算 $${fix(a, pa)} - ${fix(b, pb)}$。`,
            ],
            ra - rb,
            [
              [
                ["Round each number", "取近似数"],
                ["Look at each tenths digit.", "看每个数的十分位。"],
                [`${fix(a, pa)} \\approx ${ra}`, `${fix(b, pb)} \\approx ${rb}`],
              ],
              [["Subtract", "相减"], ["Subtract the rounded numbers.", "用近似数相减。"], [`${ra} - ${rb} = ${ra - rb}`]],
            ],
            [`The exact difference is $${dq(exact)}$, which is close to ${ra - rb}.`, `准确的差是 $${dq(exact)}$，接近 ${ra - rb}。`],
            [
              [fa - fb, "That drops the decimal parts instead of rounding.", "这是直接去掉了小数部分，没有四舍五入。"],
              [exact, "That is the exact difference. An estimate uses the rounded numbers.", "这是准确的差。估算要用近似数。"],
              [ra + rb, "That adds instead of subtracting.", "这是做成加法了。"],
            ],
            { figure: estimateTape(a, pa, b, pb, false) },
          );
        }
      },
      estimateTape(5218, 2, 97, 1, false),
    ),
  ],
  t(
    "Lin buys a book for $23.80$ yuan and a pen for $6.35$ yuan. Round each to the nearest whole number: $24 + 6 = 30$. She needs about 30 yuan.\n\nCheck: the exact total $30.15$ is close to 30.\n\nIn this lesson we estimate sums and differences of decimals by rounding first.",
    "小林买一本书花 $23.80$ 元，买一支笔花 $6.35$ 元。把每个数四舍五入到整数：$24 + 6 = 30$。她大约要 30 元。\n\n检验：准确的总价 $30.15$ 接近 30。\n\n本课我们先取近似数，再估算小数的和与差。",
  ),
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
    point(
      "adding-tenths",
      ["Adding tenths", "十分位的加法"],
      [
        "$3.7 + 2.5$: the tenths make $7 + 5 = 12$ tenths. Write 2 in the tenths and carry 1 to the ones: $3 + 2 + 1 = 6$. So $3.7 + 2.5 = 6.2$.\n\nCheck: $6.2 - 2.5 = 3.7$.\n\n> **Watch out.** 12 tenths is 1 whole and 2 tenths. Writing $5.12$ forgets the carry.",
        "$3.7 + 2.5$：十分位上 $7 + 5 = 12$ 个十分之一。十分位写 2，向个位进 1：$3 + 2 + 1 = 6$。所以 $3.7 + 2.5 = 6.2$。\n\n检验：$6.2 - 2.5 = 3.7$。\n\n> **注意。** 12 个十分之一是 1 个一和 2 个十分之一。写成 $5.12$ 是忘了进位。",
      ],
      (rng) => {
        let [a, b] = [rng.int(11, 199), rng.int(11, 199)];
        while (a % 10 === 0 || b % 10 === 0 || (a % 10) + (b % 10) < 10) [a, b] = [rng.int(11, 199), rng.int(11, 199)];
        return answered(
          [`Find $${fix(a, 1)} + ${fix(b, 1)}$.`, `计算 $${fix(a, 1)} + ${fix(b, 1)}$。`],
          D(a + b, 1),
          [
            [
              ["Add the tenths", "十分位相加"],
              [
                `${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)} tenths: write ${((a % 10) + (b % 10)) % 10} and carry 1.`,
                `${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)} 个十分之一：写 ${((a % 10) + (b % 10)) % 10}，进 1。`,
              ],
            ],
            [
              ["Add the wholes", "整数部分相加"],
              ["Add the whole parts and the carry.", "整数部分相加，再加上进的 1。"],
              [
                `${Math.floor(a / 10)} + ${Math.floor(b / 10)} + 1 = ${Math.floor((a + b) / 10)}`,
                `${fix(a, 1)} + ${fix(b, 1)} = ${fix(a + b, 1)}`,
              ],
            ],
          ],
          [
            `Subtract back: $${fix(a + b, 1)} - ${fix(b, 1)} = ${fix(a, 1)}$.`,
            `减回去：$${fix(a + b, 1)} - ${fix(b, 1)} = ${fix(a, 1)}$。`,
          ],
          [
            [D(noCarrySum(a, b), 1), "That forgets to carry the 1 to the ones.", "这里忘了向个位进 1。"],
            [
              D((Math.floor(a / 10) + Math.floor(b / 10)) * 100 + (a % 10) + (b % 10), 2),
              "That writes the tenths sum as hundredths instead of carrying.",
              "这是把十分位的和写成了两位小数，没有进位。",
            ],
            [D(a + b, 2), "That puts the point in the wrong place.", "小数点的位置错了。"],
          ],
          { form: "decimal", figure: sumChart(a, 1, b, 1, a + b, 1) },
        );
      },
      decimalChart(
        [
          [37, 1],
          [25, 1],
          [62, 1],
        ],
        0,
        1,
      ),
    ),
    point(
      "adding-hundredths",
      ["Adding hundredths", "百分位的加法"],
      [
        "$4.38 + 1.56$: hundredths $8 + 6 = 14$, write 4 and carry 1. Tenths $3 + 5 + 1 = 9$. Ones $4 + 1 = 5$. So the sum is $5.94$.\n\nCheck: $5.94 - 1.56 = 4.38$.\n\n> **Watch out.** Carry from the hundredths to the tenths. $5.814$ writes 14 in one place.",
        "$4.38 + 1.56$：百分位 $8 + 6 = 14$，写 4 进 1。十分位 $3 + 5 + 1 = 9$。个位 $4 + 1 = 5$。所以和是 $5.94$。\n\n检验：$5.94 - 1.56 = 4.38$。\n\n> **注意。** 百分位满十要向十分位进 1。写成 $5.814$ 是把 14 写进了一个数位。",
      ],
      (rng) => {
        let a = rng.int(101, 1999);
        let b = rng.int(101, 1999);
        while (a % 10 === 0 || b % 10 === 0 || noCarrySum(a, b) === a + b) {
          a = rng.int(101, 1999);
          b = rng.int(101, 1999);
        }
        return answered(
          [`Find $${fix(a, 2)} + ${fix(b, 2)}$.`, `计算 $${fix(a, 2)} + ${fix(b, 2)}$。`],
          D(a + b, 2),
          [
            [
              ["Line up the points", "对齐小数点"],
              ["Add hundredths to hundredths and tenths to tenths.", "百分位和百分位相加，十分位和十分位相加。"],
            ],
            [
              ["Add from the right", "从右往左加"],
              ["Carry 1 whenever a place makes 10 or more.", "哪一位满十，就向前一位进 1。"],
              [`${fix(a, 2)} + ${fix(b, 2)} = ${fix(a + b, 2)}`],
            ],
          ],
          [
            `Subtract back: $${fix(a + b, 2)} - ${fix(b, 2)} = ${fix(a, 2)}$.`,
            `减回去：$${fix(a + b, 2)} - ${fix(b, 2)} = ${fix(a, 2)}$。`,
          ],
          [
            [D(noCarrySum(a, b), 2), "That forgets to carry.", "这里忘了进位。"],
            [D(a + b, 1), "That puts the point in the wrong place.", "小数点的位置错了。"],
          ],
          { form: "decimal", figure: sumChart(a, 2, b, 2, a + b, 2) },
        );
      },
      decimalChart(
        [
          [438, 2],
          [156, 2],
          [594, 2],
        ],
        0,
        2,
      ),
    ),
  ],
  t(
    "Ella walks $1.6$ km to the park and $0.8$ km to the shop. Line up the points and add the tenths: 6 tenths and 8 tenths make 14 tenths, which is 1 whole and 4 tenths. She walks $2.4$ km.\n\nCheck: $2.4 - 0.8 = 1.6$.\n\nIn this lesson we add decimals with the same number of places.",
    "艾拉走 $1.6$ 千米到公园，又走 $0.8$ 千米到商店。小数点对齐，十分位相加：6 个十分之一加 8 个十分之一是 14 个十分之一，也就是 1 个一和 4 个十分之一。她一共走了 $2.4$ 千米。\n\n检验：$2.4 - 0.8 = 1.6$。\n\n本课我们计算位数相同的小数加法。",
  ),
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
    point(
      "adding-decimals-with-different-places",
      ["Adding decimals with different places", "位数不同的小数相加"],
      [
        "$3.4 + 1.25$: write $3.4$ as $3.40$, then add place by place: $3.40 + 1.25 = 4.65$.\n\nCheck: $4.65 - 1.25 = 3.4$.\n\n> **Watch out.** Line up the points, not the last digits. Lining up the 4 with the 5 gives $1.59$.",
        "$3.4 + 1.25$：把 $3.4$ 写成 $3.40$，再按数位相加：$3.40 + 1.25 = 4.65$。\n\n检验：$4.65 - 1.25 = 3.4$。\n\n> **注意。** 要对齐小数点，不是对齐末位。把 4 和 5 对齐会得到 $1.59$。",
      ],
      (rng) => {
        const pa = 1;
        const pb = rng.int(2, 3);
        let a = rng.int(11, 199);
        while (a % 10 === 0) a = rng.int(11, 199);
        const b = nonZeroEnd(rng, pb + 1);
        const A = a * pow10(pb - pa);
        const [x, y] = rng.bool()
          ? [
              [a, pa],
              [b, pb],
            ]
          : [
              [b, pb],
              [a, pa],
            ];
        return answered(
          [`Find $${fix(x[0]!, x[1]!)} + ${fix(y[0]!, y[1]!)}$.`, `计算 $${fix(x[0]!, x[1]!)} + ${fix(y[0]!, y[1]!)}$。`],
          D(A + b, pb),
          [
            [
              ["Fill in zeros", "补 0"],
              [
                `Write $${fix(a, pa)}$ as $${fix(A, pb)}$ so both have ${pb} places.`,
                `把 $${fix(a, pa)}$ 写成 $${fix(A, pb)}$，两个数都是 ${pb} 位小数。`,
              ],
            ],
            [
              ["Add", "相加"],
              ["Add place by place with the points lined up.", "小数点对齐，按数位相加。"],
              [`${fix(A, pb)} + ${fix(b, pb)} = ${fix(A + b, pb)}`],
            ],
          ],
          [
            `Subtract back: $${fix(A + b, pb)} - ${fix(b, pb)} = ${fix(a, pa)}$.`,
            `减回去：$${fix(A + b, pb)} - ${fix(b, pb)} = ${fix(a, pa)}$。`,
          ],
          [
            [D(a + b, pb), "That lines up the last digits instead of the points.", "这是对齐了末位，没有对齐小数点。"],
            [D(noCarrySum(A, b), pb), "That forgets to carry.", "这里忘了进位。"],
          ],
          { form: "decimal", figure: sumChart(A, pb, b, pb, A + b, pb) },
        );
      },
      decimalChart(
        [
          [340, 2],
          [125, 2],
          [465, 2],
        ],
        0,
        2,
      ),
    ),
    point(
      "adding-whole-numbers-and-decimals",
      ["Adding whole numbers and decimals", "整数加小数"],
      [
        "$7 + 2.35$: 7 is $7.00$, so add it to the ones: $7.00 + 2.35 = 9.35$.\n\nCheck: $9.35 - 7 = 2.35$.\n\n> **Watch out.** A whole number has its point after the ones. Adding 7 to the last digit gives $2.42$.",
        "$7 + 2.35$：7 就是 $7.00$，所以加在个位上：$7.00 + 2.35 = 9.35$。\n\n检验：$9.35 - 7 = 2.35$。\n\n> **注意。** 整数的小数点在个位后面。把 7 加到末位会得到 $2.42$。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const w = rng.int(2, 40);
        const b = rng.int(1, 30) * pow10(p) + nonZeroEnd(rng, p);
        const W = w * pow10(p);
        return answered(
          [`Find $${w} + ${fix(b, p)}$.`, `计算 $${w} + ${fix(b, p)}$。`],
          D(W + b, p),
          [
            [
              ["Write the point", "写出小数点"],
              [`$${w} = ${fix(W, p)}$, so the ${w} lines up with the ones.`, `$${w} = ${fix(W, p)}$，${w} 要和个位对齐。`],
            ],
            [
              ["Add", "相加"],
              ["Add the whole parts; the decimal part stays.", "整数部分相加，小数部分不变。"],
              [`${fix(W, p)} + ${fix(b, p)} = ${fix(W + b, p)}`],
            ],
          ],
          [`Subtract back: $${fix(W + b, p)} - ${w} = ${fix(b, p)}$.`, `减回去：$${fix(W + b, p)} - ${w} = ${fix(b, p)}$。`],
          [
            [D(b + w, p), "That adds the whole number to the last digit.", "这是把整数加到了末位上。"],
            [D(b + w * pow10(p - 1), p), "That adds the whole number to the tenths.", "这是把整数加到了十分位上。"],
          ],
          { form: "decimal", figure: sumChart(W, p, b, p, W + b, p) },
        );
      },
      decimalChart(
        [
          [700, 2],
          [235, 2],
          [935, 2],
        ],
        0,
        2,
      ),
    ),
  ],
  t(
    "A jar holds $2.5$ kg of rice and Ken adds $1.25$ kg. Write $2.5$ as $2.50$ so both have hundredths, then add: $2.50 + 1.25 = 3.75$ kg.\n\nCheck: $3.75 - 1.25 = 2.5$.\n\nIn this lesson we add decimals with different numbers of places, and whole numbers and decimals.",
    "罐子里有 $2.5$ 千克米，小肯又加了 $1.25$ 千克。把 $2.5$ 写成 $2.50$，两个数都有百分位，再相加：$2.50 + 1.25 = 3.75$ 千克。\n\n检验：$3.75 - 1.25 = 2.5$。\n\n本课我们计算位数不同的小数加法，以及整数加小数。",
  ),
);

/** pairOf writes a terminating decimal q as n/10ᵖ, the form the place-value chart takes. */
function pairOf(q: Q): [number, number] {
  const s = dq(q);
  const p = s.includes(".") ? s.length - s.indexOf(".") - 1 : 0;
  return [Number(s.replace(".", "")), p];
}

/** shiftChart draws a number and the number moved k places (left when k > 0) in one place-value chart. */
function shiftChart(n: number, p: number, k: number): Figure {
  const from = D(n, p);
  const to = from.mul(k >= 0 ? Q.of(pow10(k)) : Q.of(1, pow10(-k)));
  const rows = [pairOf(from), pairOf(to)];
  const whole = Math.max(...[from, to].map((q) => String(Math.floor(q.toNumber())).length));
  const last = Math.max(1, ...rows.map(([, q]) => q));
  return decimalChart(rows, Math.max(-3, 1 - whole), Math.min(last, 3));
}

/** shifted is n/10ᵖ multiplied by 10ᵏ (divided when k < 0). */
const shifted = (n: number, p: number, k: number): Q => D(n, p).mul(k >= 0 ? Q.of(pow10(k)) : Q.of(1, pow10(-k)));

/** benchLine draws a number line through the numbers in `values` with ticks every half, or every whole when the stretch is long. */
function benchLine(values: readonly number[]): Figure {
  const lo = Math.floor(Math.min(...values));
  const hi = Math.max(Math.ceil(Math.max(...values)), lo + 1);
  return decLine(lo, hi, hi - lo > 8 ? 1 : hi - lo > 2 ? 0.5 : 0.1, values);
}

/** half is the nearest whole number or half to n/100. */
const half = (n: number) => Math.round(n / 50) / 2;

/** productArea draws an area model with the two factors on its sides and the text inside. */
const productArea = (a: string, b: string, inside: string) => areaGridFigure([a], [b], [[inside]]);

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
    point(
      "subtracting-tenths",
      ["Subtracting tenths", "十分位的减法"],
      [
        "$6.3 - 2.8$: 3 tenths is less than 8 tenths, so trade 1 whole for 10 tenths: $13 - 8 = 5$ tenths, and $5 - 2 = 3$ ones. So $6.3 - 2.8 = 3.5$.\n\nCheck: $3.5 + 2.8 = 6.3$.\n\n> **Watch out.** Do not take the smaller digit from the larger. $8 - 3$ gives the wrong answer $4.5$.",
        "$6.3 - 2.8$：3 个十分之一不够减 8 个十分之一，从个位退 1 当作 10 个十分之一：$13 - 8 = 5$ 个十分之一，个位 $5 - 2 = 3$。所以 $6.3 - 2.8 = 3.5$。\n\n检验：$3.5 + 2.8 = 6.3$。\n\n> **注意。** 不能用大数字减小数字。算 $8 - 3$ 会得到错误的 $4.5$。",
      ],
      (rng) => {
        let [a, b] = [rng.int(21, 199), rng.int(11, 99)];
        while (a % 10 >= b % 10 || b % 10 === 0 || a <= b) [a, b] = [rng.int(21, 199), rng.int(11, 99)];
        return answered(
          [`Find $${fix(a, 1)} - ${fix(b, 1)}$.`, `计算 $${fix(a, 1)} - ${fix(b, 1)}$。`],
          D(a - b, 1),
          [
            [
              ["Trade a whole", "退 1 作 10"],
              [
                `${a % 10} tenths is less than ${b % 10} tenths, so trade 1 whole for 10 tenths.`,
                `${a % 10} 个十分之一不够减 ${b % 10} 个，从个位退 1 当作 10 个十分之一。`,
              ],
              [`${(a % 10) + 10} - ${b % 10} = ${(a % 10) + 10 - (b % 10)}`],
            ],
            [
              ["Subtract the wholes", "整数部分相减"],
              ["The whole part has 1 less now.", "整数部分少了 1。"],
              [
                `${Math.floor(a / 10) - 1} - ${Math.floor(b / 10)} = ${Math.floor((a - b) / 10)}`,
                `${fix(a, 1)} - ${fix(b, 1)} = ${fix(a - b, 1)}`,
              ],
            ],
          ],
          [`Add back: $${fix(a - b, 1)} + ${fix(b, 1)} = ${fix(a, 1)}$.`, `加回去：$${fix(a - b, 1)} + ${fix(b, 1)} = ${fix(a, 1)}$。`],
          [
            [
              D(noBorrowDifference(a, b), 1),
              "That takes the smaller digit from the larger instead of trading.",
              "这是用大数字减小数字，没有退位。",
            ],
            [D(a - b + 10, 1), "That trades a whole but forgets to take it from the ones.", "这里退了位，但个位忘了减 1。"],
          ],
          { form: "decimal", figure: sumChart(a, 1, b, 1, a - b, 1) },
        );
      },
      decimalChart(
        [
          [63, 1],
          [28, 1],
          [35, 1],
        ],
        0,
        1,
      ),
    ),
    point(
      "subtracting-hundredths",
      ["Subtracting hundredths", "百分位的减法"],
      [
        "$7.42 - 3.18$: 2 hundredths is less than 8, so trade 1 tenth for 10 hundredths: $12 - 8 = 4$. Then $3 - 1 = 2$ tenths and $7 - 3 = 4$ ones. So the difference is $4.24$.\n\nCheck: $4.24 + 3.18 = 7.42$.\n\n> **Watch out.** After trading, the tenths digit is 1 less: 3 tenths, not 4.",
        "$7.42 - 3.18$：2 个百分之一不够减 8 个，从十分位退 1 当作 10 个百分之一：$12 - 8 = 4$。十分位 $3 - 1 = 2$，个位 $7 - 3 = 4$。所以差是 $4.24$。\n\n检验：$4.24 + 3.18 = 7.42$。\n\n> **注意。** 退位后，十分位要少 1：是 3 个十分之一，不是 4 个。",
      ],
      (rng) => {
        let [a, b] = [rng.int(201, 1999), rng.int(101, 999)];
        while (a <= b || b % 10 === 0 || noBorrowDifference(a, b) === a - b) [a, b] = [rng.int(201, 1999), rng.int(101, 999)];
        return answered(
          [`Find $${fix(a, 2)} - ${fix(b, 2)}$.`, `计算 $${fix(a, 2)} - ${fix(b, 2)}$。`],
          D(a - b, 2),
          [
            [
              ["Line up the points", "对齐小数点"],
              ["Subtract hundredths from hundredths and tenths from tenths.", "百分位减百分位，十分位减十分位。"],
            ],
            [
              ["Subtract from the right", "从右往左减"],
              ["When a digit is too small, trade 1 from the place to its left.", "哪一位不够减，就从前一位退 1。"],
              [`${fix(a, 2)} - ${fix(b, 2)} = ${fix(a - b, 2)}`],
            ],
          ],
          [`Add back: $${fix(a - b, 2)} + ${fix(b, 2)} = ${fix(a, 2)}$.`, `加回去：$${fix(a - b, 2)} + ${fix(b, 2)} = ${fix(a, 2)}$。`],
          [
            [
              D(noBorrowDifference(a, b), 2),
              "That takes the smaller digit from the larger instead of trading.",
              "这是用大数字减小数字，没有退位。",
            ],
            [D(a - b, 1), "That puts the point in the wrong place.", "小数点的位置错了。"],
          ],
          { form: "decimal", figure: sumChart(a, 2, b, 2, a - b, 2) },
        );
      },
      decimalChart(
        [
          [742, 2],
          [318, 2],
          [424, 2],
        ],
        0,
        2,
      ),
    ),
  ],
  t(
    "Zoe has $5.2$ m of string and cuts off $1.7$ m. There are not enough tenths: trade 1 whole for 10 tenths, so 12 tenths take away 7 tenths leaves 5 tenths. She has $3.5$ m left.\n\nCheck: $3.5 + 1.7 = 5.2$.\n\nIn this lesson we subtract decimals with the same number of places.",
    "佐伊有 $5.2$ 米绳子，剪掉 $1.7$ 米。十分位不够减：从个位退 1 当作 10 个十分之一，12 个十分之一减 7 个十分之一剩 5 个十分之一。她还剩 $3.5$ 米。\n\n检验：$3.5 + 1.7 = 5.2$。\n\n本课我们计算位数相同的小数减法。",
  ),
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
    point(
      "subtracting-decimals-with-different-places",
      ["Subtracting decimals with different places", "位数不同的小数相减"],
      [
        "$5.3 - 2.47$: write $5.3$ as $5.30$. Now subtract place by place, trading where needed: $5.30 - 2.47 = 2.83$.\n\nCheck: $2.83 + 2.47 = 5.3$.\n\n> **Watch out.** The empty hundredths place is a 0, and $0 - 7$ needs a trade. It is not $7 - 0$.",
        "$5.3 - 2.47$：把 $5.3$ 写成 $5.30$，再按数位相减，不够减就退位：$5.30 - 2.47 = 2.83$。\n\n检验：$2.83 + 2.47 = 5.3$。\n\n> **注意。** 空着的百分位是 0，$0 - 7$ 要退位，不是 $7 - 0$。",
      ],
      (rng) => {
        let [a, b] = [rng.int(21, 199), rng.int(101, 999)];
        while (a % 10 === 0 || b % 10 === 0 || a * 10 <= b) [a, b] = [rng.int(21, 199), rng.int(101, 999)];
        const A = a * 10;
        return answered(
          [`Find $${fix(a, 1)} - ${fix(b, 2)}$.`, `计算 $${fix(a, 1)} - ${fix(b, 2)}$。`],
          D(A - b, 2),
          [
            [
              ["Fill in a zero", "补 0"],
              [`Write $${fix(a, 1)}$ as $${fix(A, 2)}$.`, `把 $${fix(a, 1)}$ 写成 $${fix(A, 2)}$。`],
            ],
            [
              ["Subtract", "相减"],
              ["Subtract place by place, trading where needed.", "按数位相减，不够减就退位。"],
              [`${fix(A, 2)} - ${fix(b, 2)} = ${fix(A - b, 2)}`],
            ],
          ],
          [`Add back: $${fix(A - b, 2)} + ${fix(b, 2)} = ${fix(A, 2)}$.`, `加回去：$${fix(A - b, 2)} + ${fix(b, 2)} = ${fix(A, 2)}$。`],
          [
            [
              D(noBorrowDifference(A, b), 2),
              "That takes the smaller digit from the larger instead of trading from the empty place.",
              "这是用大数字减小数字，没有从空位退位。",
            ],
            [D(Math.abs(b - a), 2), "That lines up the last digits instead of the points.", "这是对齐了末位，没有对齐小数点。"],
          ],
          { form: "decimal", figure: sumChart(A, 2, b, 2, A - b, 2) },
        );
      },
      decimalChart(
        [
          [530, 2],
          [247, 2],
          [283, 2],
        ],
        0,
        2,
      ),
    ),
    point(
      "subtracting-decimals-from-whole-numbers",
      ["Subtracting decimals from whole numbers", "整数减小数"],
      [
        "$8 - 3.46$: write 8 as $8.00$, then trade: $8.00 - 3.46 = 4.54$.\n\nCheck: $4.54 + 3.46 = 8$.\n\n> **Watch out.** The zeros after the point must be traded for. Keeping the $.46$ gives $5.46$, which is wrong.",
        "$8 - 3.46$：把 8 写成 $8.00$，再退位相减：$8.00 - 3.46 = 4.54$。\n\n检验：$4.54 + 3.46 = 8$。\n\n> **注意。** 小数点后的 0 也要参与退位。直接保留 $.46$ 会得到错误的 $5.46$。",
      ],
      (rng) => {
        const p = rng.int(1, 2);
        const w = rng.int(3, 30);
        const b = rng.int(1, w - 1) * pow10(p) + nonZeroEnd(rng, p);
        const W = w * pow10(p);
        return answered(
          [`Find $${w} - ${fix(b, p)}$.`, `计算 $${w} - ${fix(b, p)}$。`],
          D(W - b, p),
          [
            [
              ["Write the zeros", "写出 0"],
              [`$${w} = ${fix(W, p)}$.`, `$${w} = ${fix(W, p)}$。`],
            ],
            [
              ["Subtract", "相减"],
              ["Trade from the ones to fill the empty places.", "从个位退位，给空着的数位补上。"],
              [`${fix(W, p)} - ${fix(b, p)} = ${fix(W - b, p)}`],
            ],
          ],
          [`Add back: $${fix(W - b, p)} + ${fix(b, p)} = ${w}$.`, `加回去：$${fix(W - b, p)} + ${fix(b, p)} = ${w}$。`],
          [
            [
              D(noBorrowDifference(W, b), p),
              "That keeps the decimal part instead of trading for it.",
              "这里直接保留了小数部分，没有退位。",
            ],
            [w - Math.floor(b / pow10(p)), "That subtracts only the whole parts.", "这只减了整数部分。"],
          ],
          { form: "decimal", figure: sumChart(W, p, b, p, W - b, p) },
        );
      },
      decimalChart(
        [
          [800, 2],
          [346, 2],
          [454, 2],
        ],
        0,
        2,
      ),
    ),
  ],
  t(
    "A bottle holds $2$ L of water and Tom drinks $0.75$ L. Write $2$ as $2.00$, then subtract: $2.00 - 0.75 = 1.25$ L are left.\n\nCheck: $1.25 + 0.75 = 2$.\n\nIn this lesson we subtract decimals with different numbers of places, and decimals from whole numbers.",
    "一瓶水有 $2$ 升，小汤喝了 $0.75$ 升。把 $2$ 写成 $2.00$，再相减：$2.00 - 0.75 = 1.25$，还剩 1.25 升。\n\n检验：$1.25 + 0.75 = 2$。\n\n本课我们计算位数不同的小数减法，以及整数减小数。",
  ),
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
    point(
      "adding-decimals-near-benchmarks",
      ["Benchmarks 0, 0.5 and 1", "基准数 0、0.5、1"],
      [
        "$0.07 + 0.52 \\approx 0 + 0.5 = 0.5$: $0.07$ is close to 0 and $0.52$ is close to $0.5$.\n\nCheck: the exact sum $0.59$ is close to $0.5$.\n\n> **Watch out.** Pick the closest benchmark for each number. $0.07$ is close to 0, not to $0.5$.",
        "$0.07 + 0.52 \\approx 0 + 0.5 = 0.5$：$0.07$ 接近 0，$0.52$ 接近 $0.5$。\n\n检验：准确的和 $0.59$ 接近 $0.5$。\n\n> **注意。** 每个数都要选离它最近的基准数。$0.07$ 接近 0，不是 $0.5$。",
      ],
      (rng) => {
        const k1 = rng.int(0, 2);
        const k2 = k1 === 0 ? rng.int(1, 2) : rng.int(0, 2);
        const [a, b] = [nearHalf(rng, 0, k1), nearHalf(rng, 0, k2)];
        const est = Q.of(k1 + k2, 2);
        return answered(
          [
            `Estimate $${fix(a, 2)} + ${fix(b, 2)}$ using the benchmarks $0$, $0.5$ and $1$.`,
            `用基准数 $0$、$0.5$、$1$ 估算 $${fix(a, 2)} + ${fix(b, 2)}$。`,
          ],
          est,
          [
            [
              ["Pick the benchmarks", "选基准数"],
              ["Find the closest of 0, 0.5 and 1 to each number.", "找出离每个数最近的基准数。"],
              [`${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}`, `${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}`],
            ],
            [["Add", "相加"], ["Add the benchmarks.", "把基准数相加。"], [`${dq(Q.of(k1, 2))} + ${dq(Q.of(k2, 2))} = ${dq(est)}`]],
          ],
          [`The exact sum $${fix(a + b, 2)}$ is close to $${dq(est)}$.`, `准确的和 $${fix(a + b, 2)}$ 接近 $${dq(est)}$。`],
          [
            [D(a + b, 2), "That is the exact sum. The estimate adds the benchmarks.", "这是准确的和。估算要把基准数相加。"],
            [est.add(Q.of(1, 2)), "That rounds a number up to the next benchmark.", "这把一个数取到了更大的基准数。"],
            [est.sub(Q.of(1, 2)), "That rounds a number down to the benchmark below.", "这把一个数取到了更小的基准数。"],
          ],
          { form: "decimal", figure: decLine(0, 1, 0.1, [a / 100, b / 100]) },
        );
      },
      decLine(0, 1, 0.1, [0.07, 0.52]),
    ),
    point(
      "adding-decimals-to-the-nearest-half",
      ["Rounding to the nearest half", "近似到最接近的“几点五”"],
      [
        "$6.53 + 2.96 \\approx 6.5 + 3 = 9.5$. Round each number to the closest whole number or half.\n\nCheck: the exact sum $9.49$ is close to $9.5$.\n\n> **Watch out.** $6.53$ is closest to $6.5$, not 7. Use halves as well as wholes.",
        "$6.53 + 2.96 \\approx 6.5 + 3 = 9.5$。把每个数取到离它最近的整数或“几点五”。\n\n检验：准确的和 $9.49$ 接近 $9.5$。\n\n> **注意。** $6.53$ 最接近 $6.5$，不是 7。“几点五”也可以用。",
      ],
      (rng) => {
        const [k1, k2] = [rng.int(0, 2), rng.int(0, 2)];
        const [w1, w2] = [rng.int(1, 20), rng.int(1, 20)];
        const [a, b] = [nearHalf(rng, w1, k1), nearHalf(rng, w2, k2)];
        const [ea, eb] = [half(a), half(b)];
        return answered(
          [
            `Estimate $${fix(a, 2)} + ${fix(b, 2)}$ by rounding each number to the nearest half.`,
            `把每个数近似到最接近的整数或“几点五”，估算 $${fix(a, 2)} + ${fix(b, 2)}$。`,
          ],
          Q.of(Math.round((ea + eb) * 2), 2),
          [
            [
              ["Round to halves", "取到半个"],
              ["Find the closest whole number or half.", "找出离它最近的整数或“几点五”。"],
              [`${fix(a, 2)} \\approx ${decText(ea)}`, `${fix(b, 2)} \\approx ${decText(eb)}`],
            ],
            [["Add", "相加"], ["Add the rounded numbers.", "把近似数相加。"], [`${decText(ea)} + ${decText(eb)} = ${decText(ea + eb)}`]],
          ],
          [
            `The exact sum $${fix(a + b, 2)}$ is close to $${decText(ea + eb)}$.`,
            `准确的和 $${fix(a + b, 2)}$ 接近 $${decText(ea + eb)}$。`,
          ],
          [
            [Math.round(a / 100) + Math.round(b / 100), "That rounds to whole numbers only.", "这只取到了整数。"],
            [D(a + b, 2), "That is the exact sum, not an estimate.", "这是准确的和，不是估算。"],
            [w1 + w2, "That drops the decimal parts.", "这是直接去掉了小数部分。"],
          ],
          { form: "decimal", figure: benchLine([a / 100, b / 100]) },
        );
      },
      decLine(2, 7, 0.5, [2.96, 6.53]),
    ),
  ],
  t(
    "Ivy drinks $0.48$ L of milk and $0.93$ L of juice. $0.48$ is close to $0.5$ and $0.93$ is close to 1, so she drinks about $0.5 + 1 = 1.5$ L.\n\nCheck: the exact total $1.41$ is close to $1.5$.\n\nIn this lesson we estimate sums with the benchmarks 0, $0.5$ and 1, and with the nearest half.",
    "小艾喝了 $0.48$ 升牛奶和 $0.93$ 升果汁。$0.48$ 接近 $0.5$，$0.93$ 接近 1，所以她大约喝了 $0.5 + 1 = 1.5$ 升。\n\n检验：准确的总量 $1.41$ 接近 $1.5$。\n\n本课我们用基准数 0、$0.5$、1，或者最接近的“几点五”来估算和。",
  ),
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
    point(
      "subtracting-decimals-near-benchmarks",
      ["Benchmarks 0, 0.5 and 1", "基准数 0、0.5、1"],
      [
        "$0.96 - 0.53 \\approx 1 - 0.5 = 0.5$: $0.96$ is close to 1 and $0.53$ is close to $0.5$.\n\nCheck: the exact difference $0.43$ is close to $0.5$.\n\n> **Watch out.** Each number gets its own benchmark. $0.53$ is close to $0.5$, not to 1.",
        "$0.96 - 0.53 \\approx 1 - 0.5 = 0.5$：$0.96$ 接近 1，$0.53$ 接近 $0.5$。\n\n检验：准确的差 $0.43$ 接近 $0.5$。\n\n> **注意。** 每个数选自己的基准数。$0.53$ 接近 $0.5$，不是 1。",
      ],
      (rng) => {
        for (;;) {
          const k1 = rng.int(1, 2);
          const k2 = rng.int(0, k1 - 1);
          const [a, b] = [nearHalf(rng, 0, k1), nearHalf(rng, 0, k2)];
          if (a <= b) continue;
          const est = Q.of(k1 - k2, 2);
          return answered(
            [
              `Estimate $${fix(a, 2)} - ${fix(b, 2)}$ using the benchmarks $0$, $0.5$ and $1$.`,
              `用基准数 $0$、$0.5$、$1$ 估算 $${fix(a, 2)} - ${fix(b, 2)}$。`,
            ],
            est,
            [
              [
                ["Pick the benchmarks", "选基准数"],
                ["Find the closest of 0, 0.5 and 1 to each number.", "找出离每个数最近的基准数。"],
                [`${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}`, `${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}`],
              ],
              [
                ["Subtract", "相减"],
                ["Subtract the benchmarks.", "用基准数相减。"],
                [`${dq(Q.of(k1, 2))} - ${dq(Q.of(k2, 2))} = ${dq(est)}`],
              ],
            ],
            [`The exact difference $${fix(a - b, 2)}$ is close to $${dq(est)}$.`, `准确的差 $${fix(a - b, 2)}$ 接近 $${dq(est)}$。`],
            [
              [D(a - b, 2), "That is the exact difference, not an estimate.", "这是准确的差，不是估算。"],
              [Q.of(k1 + k2, 2), "That adds instead of subtracting.", "这是做成加法了。"],
              [est.add(Q.of(1, 2)), "That rounds a number to the wrong benchmark.", "这把一个数取错了基准数。"],
            ],
            { form: "decimal", figure: decLine(0, 1, 0.1, [b / 100, a / 100]) },
          );
        }
      },
      decLine(0, 1, 0.1, [0.53, 0.96]),
    ),
    point(
      "subtracting-decimals-to-the-nearest-half",
      ["Rounding to the nearest half", "近似到最接近的“几点五”"],
      [
        "$8.04 - 2.53 \\approx 8 - 2.5 = 5.5$. Round each number to the closest whole number or half, then subtract.\n\nCheck: the exact difference $5.51$ is close to $5.5$.\n\n> **Watch out.** $2.53$ is closest to $2.5$, not 3. Rounding it to 3 gives 5.",
        "$8.04 - 2.53 \\approx 8 - 2.5 = 5.5$。把每个数取到离它最近的整数或“几点五”，再相减。\n\n检验：准确的差 $5.51$ 接近 $5.5$。\n\n> **注意。** $2.53$ 最接近 $2.5$，不是 3。取成 3 会得到 5。",
      ],
      (rng) => {
        const [k1, k2] = [rng.int(0, 2), rng.int(0, 2)];
        const w2 = rng.int(1, 12);
        const w1 = rng.int(w2 + 2, 25);
        const [a, b] = [nearHalf(rng, w1, k1), nearHalf(rng, w2, k2)];
        const [ea, eb] = [half(a), half(b)];
        return answered(
          [
            `Estimate $${fix(a, 2)} - ${fix(b, 2)}$ by rounding each number to the nearest half.`,
            `把每个数近似到最接近的整数或“几点五”，估算 $${fix(a, 2)} - ${fix(b, 2)}$。`,
          ],
          Q.of(Math.round((ea - eb) * 2), 2),
          [
            [
              ["Round to halves", "取到半个"],
              ["Find the closest whole number or half.", "找出离它最近的整数或“几点五”。"],
              [`${fix(a, 2)} \\approx ${decText(ea)}`, `${fix(b, 2)} \\approx ${decText(eb)}`],
            ],
            [
              ["Subtract", "相减"],
              ["Subtract the rounded numbers.", "用近似数相减。"],
              [`${decText(ea)} - ${decText(eb)} = ${decText(ea - eb)}`],
            ],
          ],
          [
            `The exact difference $${fix(a - b, 2)}$ is close to $${decText(ea - eb)}$.`,
            `准确的差 $${fix(a - b, 2)}$ 接近 $${decText(ea - eb)}$。`,
          ],
          [
            [Math.round(a / 100) - Math.round(b / 100), "That rounds to whole numbers only.", "这只取到了整数。"],
            [D(a - b, 2), "That is the exact difference, not an estimate.", "这是准确的差，不是估算。"],
            [w1 - w2, "That drops the decimal parts.", "这是直接去掉了小数部分。"],
          ],
          { form: "decimal", figure: benchLine([b / 100, a / 100]) },
        );
      },
      decLine(2, 9, 1, [2.53, 8.04]),
    ),
  ],
  t(
    "A glass holds $0.91$ L and Max drinks $0.47$ L. That is about $1 - 0.5 = 0.5$ L left.\n\nCheck: the exact amount left, $0.44$ L, is close to $0.5$.\n\nIn this lesson we estimate differences with benchmarks and with the nearest half.",
    "一个杯子里有 $0.91$ 升，小马喝了 $0.47$ 升。大约还剩 $1 - 0.5 = 0.5$ 升。\n\n检验：准确剩下 $0.44$ 升，接近 $0.5$。\n\n本课我们用基准数和最接近的“几点五”估算差。",
  ),
);

// ---------------------------------------------------------------------------
// Multiplying decimals

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
    point(
      "multiplying-decimals-by-ten",
      ["Multiplying by 10", "乘 10"],
      [
        "$4.27 \\times 10 = 42.7$: each digit moves one place to the left, so the 4 ones become 4 tens.\n\nCheck: $42.7 \\div 10 = 4.27$.\n\n> **Watch out.** Writing a 0 at the end of a decimal does not multiply it. $4.270$ is still $4.27$.",
        "$4.27 \\times 10 = 42.7$：每个数字都往左移一位，4 个一变成 4 个十。\n\n检验：$42.7 \\div 10 = 4.27$。\n\n> **注意。** 在小数末尾添 0 并不是乘 10。$4.270$ 还是 $4.27$。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const n = rng.int(1, 99) * pow10(p) + nonZeroEnd(rng, p);
        const r = shifted(n, p, 1);
        return answered(
          [`Find $${fix(n, p)} \\times 10$.`, `计算 $${fix(n, p)} \\times 10$。`],
          r,
          [
            [
              ["Move each digit", "移动数字"],
              ["Times 10 moves every digit one place to the left.", "乘 10，每个数字都往左移一位。"],
            ],
            [
              ["Read the result", "读出结果"],
              [
                `The ${digitAtPlace(n, p, 1)} in the tenths becomes ${digitAtPlace(n, p, 1)} ones.`,
                `十分位上的 ${digitAtPlace(n, p, 1)} 移到了个位。`,
              ],
              [`${fix(n, p)} \\times 10 = ${dq(r)}`],
            ],
          ],
          [`Divide back: $${dq(r)} \\div 10 = ${fix(n, p)}$.`, `除回去：$${dq(r)} \\div 10 = ${fix(n, p)}$。`],
          [
            [D(n, p), "That adds a 0 at the end, which does not change a decimal.", "这只是在末尾添 0，小数的大小不变。"],
            [shifted(n, p, 2), "That moves two places, which is times 100.", "这移了两位，是乘 100。"],
            [shifted(n, p, -1), "That moves the wrong way, which divides by 10.", "这往反方向移了，是除以 10。"],
          ],
          { form: "decimal", figure: shiftChart(n, p, 1) },
        );
      },
      shiftChart(427, 2, 1),
    ),
    point(
      "multiplying-decimals-by-hundred-and-thousand",
      ["Multiplying by 100 and 1,000", "乘 100 和 1000"],
      [
        "$0.058 \\times 100 = 5.8$: times 100 moves each digit two places to the left, so the 5 hundredths become 5 ones.\n\nCheck: $5.8 \\div 100 = 0.058$.\n\n> **Watch out.** Move one place for each zero in 100 or 1,000. Times 100 is two places, not one.",
        "$0.058 \\times 100 = 5.8$：乘 100，每个数字往左移两位，5 个百分之一变成 5 个一。\n\n检验：$5.8 \\div 100 = 0.058$。\n\n> **注意。** 100 或 1000 有几个 0，就移几位。乘 100 要移两位，不是一位。",
      ],
      (rng) => {
        const k = rng.int(2, 3);
        const p = rng.int(1, 3);
        const n = rng.int(0, k === 3 ? 9 : 99) * pow10(p) + nonZeroEnd(rng, p);
        const r = shifted(n, p, k);
        const f = pow10(k);
        return answered(
          [`Find $${fix(n, p)} \\times ${texCommas(f)}$.`, `计算 $${fix(n, p)} \\times ${texCommas(f)}$。`],
          r,
          [
            [
              ["Count the zeros", "数 0 的个数"],
              [
                `$${texCommas(f)}$ has ${k} zeros, so move every digit ${k} places to the left.`,
                `$${texCommas(f)}$ 有 ${k} 个 0，每个数字往左移 ${k} 位。`,
              ],
            ],
            [
              ["Read the result", "读出结果"],
              ["Fill empty places before the point with zeros.", "小数点前空着的数位补 0。"],
              [`${fix(n, p)} \\times ${texCommas(f)} = ${dq(r)}`],
            ],
          ],
          [`Divide back: $${dq(r)} \\div ${texCommas(f)} = ${fix(n, p)}$.`, `除回去：$${dq(r)} \\div ${texCommas(f)} = ${fix(n, p)}$。`],
          [
            [shifted(n, p, k - 1), "That moves one place too few.", "这少移了一位。"],
            [shifted(n, p, k + 1), "That moves one place too many.", "这多移了一位。"],
            [shifted(n, p, -k), "That moves the wrong way, which divides.", "这往反方向移了，是除法。"],
          ],
          { form: "decimal", figure: shiftChart(n, p, k) },
        );
      },
      shiftChart(58, 3, 2),
    ),
  ],
  t(
    "One sticker costs $0.35$ yuan, so 10 stickers cost $0.35 \\times 10$. Each digit moves one place left: 3 tenths become 3 ones, 5 hundredths become 5 tenths. That is $3.5$ yuan.\n\nCheck: $3.5 \\div 10 = 0.35$.\n\nIn this lesson we multiply decimals by 10, 100 and 1,000 by moving digits to bigger places.",
    "一张贴纸 $0.35$ 元，10 张就是 $0.35 \\times 10$。每个数字都往左移一位：3 个十分之一变成 3 个一，5 个百分之一变成 5 个十分之一，就是 $3.5$ 元。\n\n检验：$3.5 \\div 10 = 0.35$。\n\n本课我们把数字移到更大的数位，计算小数乘 10、100、1000。",
  ),
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
    point(
      "moving-the-decimal-point-to-multiply",
      ["Moving the point to multiply", "移动小数点做乘法"],
      [
        "$3.06 \\times 1{,}000$: 1,000 has 3 zeros, so move the point 3 places to the right. There are only 2 digits after it, so write one 0: $3{,}060$.\n\nCheck: $3{,}060 \\div 1{,}000 = 3.06$.\n\n> **Watch out.** When you run out of digits, fill with zeros. The answer is $3{,}060$, not 306.",
        "$3.06 \\times 1000$：1000 有 3 个 0，把小数点向右移三位。小数点后只有两个数字，要补一个 0：$3060$。\n\n检验：$3060 \\div 1000 = 3.06$。\n\n> **注意。** 数字不够时要补 0。答案是 $3060$，不是 306。",
      ],
      (rng) => {
        const k = rng.int(1, 3);
        const p = rng.int(1, 3);
        const n = rng.int(1, 9) * pow10(p) + nonZeroEnd(rng, p);
        const r = shifted(n, p, k);
        const f = pow10(k);
        return answered(
          [
            `Find $${fix(n, p)} \\times ${texCommas(f)}$ by moving the decimal point.`,
            `移动小数点，计算 $${fix(n, p)} \\times ${texCommas(f)}$。`,
          ],
          r,
          [
            [
              ["How far", "移几位"],
              [
                `Times ${texCommas(f)}: move the point ${k} place${k === 1 ? "" : "s"} to the right.`,
                `乘 ${texCommas(f)}：小数点向右移 ${k} 位。`,
              ],
            ],
            [
              ["Move the point", "移动小数点"],
              [
                k > p ? "Write zeros where there are no digits left." : "Write the point in its new place.",
                k > p ? "数字不够的地方补 0。" : "在新的位置点上小数点。",
              ],
              [`${fix(n, p)} \\times ${texCommas(f)} = ${r.isInteger() ? texCommas(r.toNumber()) : dq(r)}`],
            ],
          ],
          [
            `Estimate: $${fix(n, p)}$ is about ${Math.round(n / pow10(p))}, and ${Math.round(n / pow10(p))} times ${texCommas(f)} is about $${texCommas(Math.round(n / pow10(p)) * f)}$.`,
            `估算：$${fix(n, p)}$ 约是 ${Math.round(n / pow10(p))}，乘 ${texCommas(f)} 约是 $${texCommas(Math.round(n / pow10(p)) * f)}$。`,
          ],
          [
            [
              k > p ? Q.of(n) : shifted(n, p, k - 1),
              k > p ? "That runs out of digits and forgets the zeros." : "That moves the point one place too few.",
              k > p ? "数字不够时忘了补 0。" : "小数点少移了一位。",
            ],
            [shifted(n, p, k + 1), "That moves the point one place too many.", "小数点多移了一位。"],
            [shifted(n, p, -k), "That moves the point to the left, which divides.", "小数点向左移了，是除法。"],
          ],
          { form: "decimal", figure: shiftChart(n, p, k) },
        );
      },
      shiftChart(306, 2, 3),
    ),
    point(
      "finding-the-power-of-ten-in-a-product",
      ["Finding the power of ten", "求乘的是 10 的几次方"],
      [
        "$0.47 \\times \\square = 47$. The point moved 2 places to the right, so $\\square = 100$.\n\nCheck: $0.47 \\times 100 = 47$.\n\n> **Watch out.** Two places means 100, not 2 and not 20.",
        "$0.47 \\times \\square = 47$。小数点向右移了两位，所以 $\\square = 100$。\n\n检验：$0.47 \\times 100 = 47$。\n\n> **注意。** 移两位是乘 100，不是 2，也不是 20。",
      ],
      (rng) => {
        const k = rng.int(1, 3);
        const p = rng.int(1, 3);
        const n = rng.int(0, 9) * pow10(p) + nonZeroEnd(rng, p);
        const r = shifted(n, p, k);
        const f = pow10(k);
        const shown = r.isInteger() ? texCommas(r.toNumber()) : dq(r);
        return answered(
          [
            `Find the missing number: $${fix(n, p)} \\times \\square = ${shown}$.`,
            `求方框里的数：$${fix(n, p)} \\times \\square = ${shown}$。`,
          ],
          f,
          [
            [
              ["Count the places", "数移了几位"],
              [`The point moved ${k} place${k === 1 ? "" : "s"} to the right.`, `小数点向右移了 ${k} 位。`],
            ],
            [
              ["Name the power of ten", "写出 10 的幂"],
              [`Each place is one factor of 10.`, `每移一位就乘一个 10。`],
              [`\\square = ${texCommas(f)}`],
            ],
          ],
          [`Multiply: $${fix(n, p)} \\times ${texCommas(f)} = ${shown}$.`, `乘一乘：$${fix(n, p)} \\times ${texCommas(f)} = ${shown}$。`],
          [
            [k, "That is the number of places, not the number to multiply by.", "这是移动的位数，不是乘的数。"],
            [f * 10, "That is one place too many.", "这多了一位。"],
            [k * 10, "That writes 10 for each place but adds them.", "这是每一位写一个 10，却把它们加起来了。"],
          ],
          { figure: shiftChart(n, p, k) },
        );
      },
      shiftChart(47, 2, 2),
    ),
  ],
  t(
    "A worm is $0.125$ m long. In centimeters that is $0.125 \\times 100$. Move the point 2 places to the right: $12.5$ cm.\n\nCheck: $12.5 \\div 100 = 0.125$.\n\nIn this lesson we multiply by powers of ten by moving the decimal point, and find the missing power of ten.",
    "一条虫长 $0.125$ 米，换成厘米就是 $0.125 \\times 100$。把小数点向右移两位：$12.5$ 厘米。\n\n检验：$12.5 \\div 100 = 0.125$。\n\n本课我们用移动小数点的方法乘 10 的幂，并求出缺少的 10 的幂。",
  ),
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
    point(
      "estimating-a-decimal-times-a-whole-number",
      ["A decimal times a whole number", "小数乘整数"],
      [
        "$8.7 \\times 6 \\approx 9 \\times 6 = 54$. Round the decimal to the nearest whole number, then multiply.\n\nCheck: the exact product $52.2$ is close to 54.\n\n> **Watch out.** Round, do not just drop the decimal part. $8 \\times 6 = 48$ is further off.",
        "$8.7 \\times 6 \\approx 9 \\times 6 = 54$。把小数四舍五入到整数，再相乘。\n\n检验：准确的积 $52.2$ 接近 54。\n\n> **注意。** 要四舍五入，不能直接去掉小数部分。$8 \\times 6 = 48$ 差得更远。",
      ],
      (rng) => {
        const p = rng.int(1, 2);
        const a = decimalNotHalf(rng, 1, 15, p);
        let w = rng.int(3, 9);
        if (Math.floor(a / pow10(p)) === roundWhole(a, p)) w = rng.int(3, 9);
        const ra = roundWhole(a, p);
        const exact = D(a, p).mul(Q.of(w));
        return answered(
          [
            `Estimate $${fix(a, p)} \\times ${w}$ by rounding the decimal to the nearest whole number.`,
            `把小数四舍五入到整数，估算 $${fix(a, p)} \\times ${w}$。`,
          ],
          ra * w,
          [
            [["Round", "取整"], ["Look at the tenths digit.", "看十分位。"], [`${fix(a, p)} \\approx ${ra}`]],
            [["Multiply", "相乘"], ["Multiply the rounded number.", "用近似数相乘。"], [`${ra} \\times ${w} = ${ra * w}`]],
          ],
          [`The exact product $${dq(exact)}$ is close to ${ra * w}.`, `准确的积 $${dq(exact)}$ 接近 ${ra * w}。`],
          [
            [Math.floor(a / pow10(p)) * w, "That drops the decimal part instead of rounding.", "这是直接去掉了小数部分，没有四舍五入。"],
            [exact, "That is the exact product, not an estimate.", "这是准确的积，不是估算。"],
            [ra + w, "That adds instead of multiplying.", "这是做成加法了。"],
          ],
          { figure: productArea(fix(a, p), String(w), `≈ ${ra} × ${w}`) },
        );
      },
      productArea("8.7", "6", "≈ 9 × 6"),
    ),
    point(
      "estimating-a-decimal-times-a-decimal",
      ["A decimal times a decimal", "小数乘小数"],
      [
        "$5.3 \\times 2.8 \\approx 5 \\times 3 = 15$. Round both factors to the nearest whole number, then multiply.\n\nCheck: the exact product $14.84$ is close to 15.\n\n> **Watch out.** Round each factor by its own tenths digit. $2.8$ rounds to 3, not 2.",
        "$5.3 \\times 2.8 \\approx 5 \\times 3 = 15$。把两个因数都四舍五入到整数，再相乘。\n\n检验：准确的积 $14.84$ 接近 15。\n\n> **注意。** 每个因数看自己的十分位。$2.8$ 约是 3，不是 2。",
      ],
      (rng) => {
        const [pa, pb] = [rng.int(1, 2), 1];
        const a = decimalNotHalf(rng, 1, 12, pa);
        const b = decimalNotHalf(rng, 1, 9, pb);
        const [ra, rb] = [roundWhole(a, pa), roundWhole(b, pb)];
        const exact = D(a, pa).mul(D(b, pb));
        return answered(
          [
            `Estimate $${fix(a, pa)} \\times ${fix(b, pb)}$ by rounding each factor to the nearest whole number.`,
            `把每个因数四舍五入到整数，估算 $${fix(a, pa)} \\times ${fix(b, pb)}$。`,
          ],
          ra * rb,
          [
            [
              ["Round both", "都取整"],
              ["Look at each tenths digit.", "看每个数的十分位。"],
              [`${fix(a, pa)} \\approx ${ra}`, `${fix(b, pb)} \\approx ${rb}`],
            ],
            [["Multiply", "相乘"], ["Multiply the rounded factors.", "用近似数相乘。"], [`${ra} \\times ${rb} = ${ra * rb}`]],
          ],
          [`The exact product $${dq(exact)}$ is close to ${ra * rb}.`, `准确的积 $${dq(exact)}$ 接近 ${ra * rb}。`],
          [
            [
              Math.floor(a / pow10(pa)) * Math.floor(b / pow10(pb)),
              "That drops the decimal parts instead of rounding.",
              "这是直接去掉了小数部分，没有四舍五入。",
            ],
            [exact, "That is the exact product, not an estimate.", "这是准确的积，不是估算。"],
            [ra + rb, "That adds instead of multiplying.", "这是做成加法了。"],
          ],
          { figure: productArea(fix(a, pa), fix(b, pb), `≈ ${ra} × ${rb}`) },
        );
      },
      productArea("5.3", "2.8", "≈ 5 × 3"),
    ),
  ],
  t(
    "One kilogram of apples costs $4.8$ yuan. For 7 kg, round $4.8$ to 5: about $5 \\times 7 = 35$ yuan.\n\nCheck: the exact cost $33.6$ yuan is close to 35.\n\nIn this lesson we estimate products of decimals by rounding to whole numbers.",
    "苹果每千克 $4.8$ 元。买 7 千克，把 $4.8$ 看作 5：大约 $5 \\times 7 = 35$ 元。\n\n检验：准确的价钱 $33.6$ 元接近 35。\n\n本课我们把小数取整，估算小数的积。",
  ),
);

/** placeParts splits n/10ᵖ into the values of its nonzero digits: 3.6 into 3 and 0.6. */
const placeParts = (n: number, p: number): Q[] =>
  [...String(n)].map((c, i, s) => D(Number(c) * pow10(s.length - 1 - i), p)).filter((q) => q.sign() !== 0);

/** splitArea draws the area model of n/10ᵖ × m/10^q with each factor split by place value. */
function splitArea(n: number, p: number, m: number, q: number): Figure {
  const columns = placeParts(n, p);
  const rows = placeParts(m, q);
  return areaGridFigure(
    rows.map(dq),
    columns.map(dq),
    rows.map((r) => columns.map((c) => dq(r.mul(c)))),
  );
}

/** areaSum adds the parts of the area model of n/10ᵖ × m/10^q: "2.4 + 0.48 = 2.88". */
function areaSum(n: number, p: number, m: number, q: number): string {
  const cells = placeParts(m, q).flatMap((r) => placeParts(n, p).map((c) => r.mul(c)));
  return `${cells.map(dq).join(" + ")} = ${dq(D(n * m, p + q))}`;
}

/** trailingZeros counts the zeros at the end of a whole number. */
function trailingZeros(n: number): number {
  let z = 0;
  while (n > 0 && n % 10 === 0) [n, z] = [n / 10, z + 1];
  return z;
}

/** productAnswer asks for n/10ᵖ × m/10^q, multiplying as whole numbers and placing the point, checked with the area model. */
function productAnswer(n: number, p: number, m: number, q: number): Problem {
  const P = p + q;
  const nm = n * m;
  const v = D(nm, P);
  const exact = fix(nm, P);
  const shown = exact !== dq(v) ? `${exact} = ${dq(v)}` : exact;
  const mt = q === 0 ? String(m) : fix(m, q);
  const z = trailingZeros(nm);
  const misses: Miss[] = [
    ...(q > 0
      ? [[D(nm, Math.max(p, q)), "That counts the decimal places of only one factor.", "这只数了一个因数的小数位数。"] as Miss]
      : []),
    [D(nm, P - 1), "That has one decimal place too few.", "小数位数少了一位。"],
    [D(nm, P + 1), "That has one decimal place too many.", "小数位数多了一位。"],
    ...(z > 0
      ? [[D(nm / pow10(z), P), "That drops the zeros at the end before placing the point.", "这是先去掉末尾的 0，再点小数点。"] as Miss]
      : []),
  ];
  return answered(
    [`Find $${fix(n, p)} \\times ${mt}$.`, `计算 $${fix(n, p)} \\times ${mt}$。`],
    v,
    [
      [
        ["Multiply as whole numbers", "按整数相乘"],
        ["Leave out the point for now.", "先不看小数点。"],
        [`${n} \\times ${m} = ${texCommas(nm)}`],
      ],
      [
        ["Place the point", "点小数点"],
        q === 0
          ? [
              `$${fix(n, p)}$ has ${p} decimal place${p === 1 ? "" : "s"}, so the product has ${p}.`,
              `$${fix(n, p)}$ 有 ${p} 位小数，积也有 ${p} 位小数。`,
            ]
          : [
              `The factors have $${p} + ${q} = ${P}$ decimal places, so the product has ${P}.`,
              `两个因数共有 $${p} + ${q} = ${P}$ 位小数，积也有 ${P} 位小数。`,
            ],
        [`${fix(n, p)} \\times ${mt} = ${shown}`],
      ],
    ],
    [`Add the parts of the area model: $${areaSum(n, p, m, q)}$.`, `把面积模型的各部分相加：$${areaSum(n, p, m, q)}$。`],
    misses,
    { form: "decimal", figure: splitArea(n, p, m, q) },
  );
}

/** placeChart draws a place-value chart wide enough for every row n/10ᵖ. */
function placeChart(rows: readonly (readonly [number, number])[]): Figure {
  const whole = Math.max(...rows.map(([n, p]) => String(Math.floor(n / pow10(p))).length));
  const last = Math.max(1, ...rows.map(([, p]) => p));
  return decimalChart(rows, Math.max(-3, 1 - whole), Math.min(last, 3));
}

/** divTape draws a bar for `total` cut into d equal parts, each marked with `each`. */
const divTape = (total: string, d: number, each: string): Figure =>
  tapeFigure(
    [{ total, pieces: Array.from({ length: d }, () => ({ size: 1, text: each })) }],
    [`A bar for ${total} cut into ${d} equal parts.`, `一个表示 ${total} 的长条，平均分成 ${d} 份。`],
  );

/** lead rounds a positive number to its first digit: 2.45 to 2, 13.2 to 10. */
const lead = (v: number): number => Number(v.toPrecision(1));

/** changeAnswer asks for the change from paying `pay` (in fen) for k items at `price` fen each. */
function changeAnswer(k: number, price: number, pay: number, item: Pair): Problem {
  const cost = k * price;
  const change = pay - cost;
  return answered(
    [
      `Lily buys ${k} ${item[0]} at $${fix(price, 2)}$ yuan each and pays ${pay / 100} yuan. How much change does she get?`,
      `莉莉买了 ${k} ${item[1]}，每个 $${fix(price, 2)}$ 元，付了 ${pay / 100} 元。应找回多少元？`,
    ],
    D(change, 2),
    [
      [
        ["Find the cost", "先算总价"],
        ["Multiply the price by the number of items.", "单价乘数量。"],
        [`${k} \\times ${fix(price, 2)} = ${fix(cost, 2)}`],
      ],
      [
        ["Find the change", "再算找零"],
        ["Subtract the cost from what she pays.", "用付的钱减去总价。"],
        [`${pay / 100} - ${fix(cost, 2)} = ${fix(change, 2)}`],
      ],
    ],
    [`Add back: $${fix(change, 2)} + ${fix(cost, 2)} = ${pay / 100}$.`, `加回去：$${fix(change, 2)} + ${fix(cost, 2)} = ${pay / 100}$。`],
    [
      [D(cost, 2), "That is the cost, not the change.", "这是总价，不是找零。"],
      [D(pay - price, 2), "That pays for only one item.", "这只算了一件的价钱。"],
      [D(change + 100, 2), "That forgets to trade 1 from the ones when subtracting.", "减的时候个位忘了退位。"],
    ],
    {
      form: "decimal",
      figure: tapeFigure(
        [
          {
            total: `${pay / 100}`,
            pieces: [
              { size: cost, text: fix(cost, 2), lit: true },
              { size: Math.max(change, pay / 12), text: "?", dashed: true },
            ],
          },
        ],
        [
          `A bar for ${pay / 100} yuan with the cost ${fix(cost, 2)} shaded and the change marked with a question mark.`,
          `一个表示 ${pay / 100} 元的长条，总价 ${fix(cost, 2)} 涂了颜色，找零标着问号。`,
        ],
      ),
    },
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
    point(
      "tenths-times-one-digit",
      ["Tenths times a one-digit number", "一位小数乘一位数"],
      [
        "$3.6 \\times 7$: $36 \\times 7 = 252$. $3.6$ has one decimal place, so the product is $25.2$.\n\nCheck: $3 \\times 7 + 0.6 \\times 7 = 21 + 4.2 = 25.2$.\n\n> **Watch out.** Count the places in $3.6$ only: one place gives $25.2$, not $2.52$.",
        "$3.6 \\times 7$：$36 \\times 7 = 252$。$3.6$ 有一位小数，所以积是 $25.2$。\n\n检验：$3 \\times 7 + 0.6 \\times 7 = 21 + 4.2 = 25.2$。\n\n> **注意。** 只数 $3.6$ 的小数位数：一位，所以是 $25.2$，不是 $2.52$。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, rng.int(2, 3)), 1, rng.int(2, 9), 0),
      splitArea(36, 1, 7, 0),
    ),
    point(
      "hundredths-times-one-digit",
      ["Hundredths and thousandths times a one-digit number", "两三位小数乘一位数"],
      [
        "$0.48 \\times 6$: $48 \\times 6 = 288$. $0.48$ has two decimal places, so the product is $2.88$.\n\nCheck: $0.4 \\times 6 + 0.08 \\times 6 = 2.4 + 0.48 = 2.88$.\n\n> **Watch out.** $0.48$ has two places, so the product has two: $2.88$, not $28.8$.",
        "$0.48 \\times 6$：$48 \\times 6 = 288$。$0.48$ 有两位小数，所以积是 $2.88$。\n\n检验：$0.4 \\times 6 + 0.08 \\times 6 = 2.4 + 0.48 = 2.88$。\n\n> **注意。** $0.48$ 有两位小数，积也有两位：是 $2.88$，不是 $28.8$。",
      ],
      (rng) => {
        const p = rng.int(2, 3);
        return productAnswer(nonZeroEnd(rng, rng.int(2, p + 1)), p, rng.int(2, 9), 0);
      },
      splitArea(48, 2, 6, 0),
    ),
  ],
  t(
    "A pencil costs $2.35$ yuan. Four pencils cost $2.35 \\times 4$. Work out $235 \\times 4 = 940$, then give it two decimal places like $2.35$: $9.40$, which is $9.4$ yuan.\n\nCheck: $2 \\times 4 + 0.3 \\times 4 + 0.05 \\times 4 = 8 + 1.2 + 0.2 = 9.4$.\n\nIn this lesson we multiply a decimal by a one-digit number.",
    "一支铅笔 $2.35$ 元，4 支就是 $2.35 \\times 4$。先算 $235 \\times 4 = 940$，再像 $2.35$ 一样点出两位小数：$9.40$，也就是 $9.4$ 元。\n\n检验：$2 \\times 4 + 0.3 \\times 4 + 0.05 \\times 4 = 8 + 1.2 + 0.2 = 9.4$。\n\n本课我们计算小数乘一位数。",
  ),
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
    point(
      "decimal-times-two-digit-number",
      ["Times a two-digit number", "乘两位数"],
      [
        "$1.25 \\times 16$: $125 \\times 16 = 2000$. Two decimal places give $20.00$, which is $20$.\n\nCheck: $1 \\times 16 + 0.2 \\times 16 + 0.05 \\times 16 = 16 + 3.2 + 0.8 = 20$.\n\n> **Watch out.** Place the point first, then drop the zeros at the end. Dropping them first gives $0.2$.",
        "$1.25 \\times 16$：$125 \\times 16 = 2000$。点出两位小数是 $20.00$，也就是 $20$。\n\n检验：$1 \\times 16 + 0.2 \\times 16 + 0.05 \\times 16 = 16 + 3.2 + 0.8 = 20$。\n\n> **注意。** 先点小数点，再去掉末尾的 0。先去掉 0 会得到 $0.2$。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, rng.int(2, 3)), rng.int(1, 2), rng.int(11, 99), 0),
      splitArea(125, 2, 16, 0),
    ),
    point(
      "decimal-times-three-digit-number",
      ["Times a three-digit number", "乘三位数"],
      [
        "$0.36 \\times 125$: $36 \\times 125 = 4500$. Two decimal places give $45.00$, which is $45$.\n\nCheck: $0.3 \\times 125 + 0.06 \\times 125 = 37.5 + 7.5 = 45$.\n\n> **Watch out.** Count places from the right of $4500$, zeros included: $45.00$, not $0.45$.",
        "$0.36 \\times 125$：$36 \\times 125 = 4500$。点出两位小数是 $45.00$，也就是 $45$。\n\n检验：$0.3 \\times 125 + 0.06 \\times 125 = 37.5 + 7.5 = 45$。\n\n> **注意。** 从 $4500$ 的右边数位数，0 也要数：是 $45.00$，不是 $0.45$。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, rng.int(2, 3)), rng.int(1, 3), rng.int(101, 999), 0),
      splitArea(36, 2, 125, 0),
    ),
  ],
  t(
    "A bus ticket costs $3.6$ yuan, and 24 children ride. $36 \\times 24 = 864$, and one decimal place gives $86.4$ yuan.\n\nCheck: $3 \\times 24 + 0.6 \\times 24 = 72 + 14.4 = 86.4$.\n\nIn this lesson we multiply a decimal by a two-digit or three-digit number.",
    "一张车票 $3.6$ 元，24 个孩子坐车。$36 \\times 24 = 864$，点出一位小数是 $86.4$ 元。\n\n检验：$3 \\times 24 + 0.6 \\times 24 = 72 + 14.4 = 86.4$。\n\n本课我们计算小数乘两位数或三位数。",
  ),
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
    point(
      "tenths-times-tenths",
      ["Tenths times tenths", "一位小数乘一位小数"],
      [
        "$4.5 \\times 1.2$: $45 \\times 12 = 540$. There are $1 + 1 = 2$ decimal places, so the product is $5.40 = 5.4$.\n\nCheck: $4 + 0.5 + 0.8 + 0.1 = 5.4$ from the area model.\n\n> **Watch out.** Count the places of both factors. One place would give $54$, which is far too big.",
        "$4.5 \\times 1.2$：$45 \\times 12 = 540$。共有 $1 + 1 = 2$ 位小数，所以积是 $5.40 = 5.4$。\n\n检验：由面积模型，$4 + 0.5 + 0.8 + 0.1 = 5.4$。\n\n> **注意。** 两个因数的小数位数都要数。只点一位会得到 $54$，大太多了。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, 2), 1, nonZeroEnd(rng, rng.int(1, 2)), 1),
      splitArea(45, 1, 12, 1),
    ),
    point(
      "hundredths-times-tenths",
      ["Hundredths times tenths", "两位小数乘一位小数"],
      [
        "$0.25 \\times 0.6$: $25 \\times 6 = 150$. There are $2 + 1 = 3$ decimal places, so the product is $0.150 = 0.15$.\n\nCheck: $0.2 \\times 0.6 + 0.05 \\times 0.6 = 0.12 + 0.03 = 0.15$.\n\n> **Watch out.** Three places are needed, so write a 0 in front: $0.150$, not $1.50$.",
        "$0.25 \\times 0.6$：$25 \\times 6 = 150$。共有 $2 + 1 = 3$ 位小数，所以积是 $0.150 = 0.15$。\n\n检验：$0.2 \\times 0.6 + 0.05 \\times 0.6 = 0.12 + 0.03 = 0.15$。\n\n> **注意。** 要点出三位小数，位数不够在前面补 0：是 $0.150$，不是 $1.50$。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, 2), 2, nonZeroEnd(rng, rng.int(1, 2)), 1),
      splitArea(25, 2, 6, 1),
    ),
  ],
  t(
    "A garden bed is $2.3$ m long and $1.6$ m wide. Its area is $2.3 \\times 1.6$: $23 \\times 16 = 368$, and $1 + 1 = 2$ places give $3.68$ square meters.\n\nCheck: the four parts of the area model are $2 + 0.3 + 1.2 + 0.18 = 3.68$.\n\nIn this lesson we multiply two decimals.",
    "一块菜地长 $2.3$ 米，宽 $1.6$ 米，面积是 $2.3 \\times 1.6$：$23 \\times 16 = 368$，$1 + 1 = 2$ 位小数，所以是 $3.68$ 平方米。\n\n检验：面积模型的四块是 $2 + 0.3 + 1.2 + 0.18 = 3.68$。\n\n本课我们计算两个小数相乘。",
  ),
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
    point(
      "three-digit-decimal-times-tenths",
      ["Times tenths", "乘一位小数"],
      [
        "$3.14 \\times 2.5$: $314 \\times 25 = 7850$. There are $2 + 1 = 3$ decimal places, so the product is $7.850 = 7.85$.\n\nCheck: $3 \\times 2.5 = 7.5$ is close to $7.85$.\n\n> **Watch out.** Add the places of both factors: 3 places, not just the 2 in $3.14$.",
        "$3.14 \\times 2.5$：$314 \\times 25 = 7850$。共有 $2 + 1 = 3$ 位小数，所以积是 $7.850 = 7.85$。\n\n检验：$3 \\times 2.5 = 7.5$，接近 $7.85$。\n\n> **注意。** 两个因数的小数位数要加起来：是 3 位，不只是 $3.14$ 的 2 位。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, 3), rng.int(1, 2), nonZeroEnd(rng, 2), 1),
      splitArea(314, 2, 25, 1),
    ),
    point(
      "three-digit-decimal-times-hundredths",
      ["Times hundredths", "乘两位小数"],
      [
        "$12.6 \\times 0.35$: $126 \\times 35 = 4410$. There are $1 + 2 = 3$ decimal places, so the product is $4.410 = 4.41$.\n\nCheck: times $0.35$, which is less than 1, the product must be less than $12.6$, and $4.41$ is.\n\n> **Watch out.** Multiplying by a number less than 1 makes the product smaller, not bigger.",
        "$12.6 \\times 0.35$：$126 \\times 35 = 4410$。共有 $1 + 2 = 3$ 位小数，所以积是 $4.410 = 4.41$。\n\n检验：乘小于 1 的 $0.35$，积一定比 $12.6$ 小，$4.41$ 确实更小。\n\n> **注意。** 乘一个小于 1 的数，积会变小，不会变大。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, 3), rng.int(1, 3), nonZeroEnd(rng, 2), 2),
      splitArea(126, 1, 35, 2),
    ),
  ],
  t(
    "A ribbon is $4.25$ m long. Mia needs a ribbon $1.3$ times as long. $425 \\times 13 = 5525$, and $2 + 1 = 3$ places give $5.525$ m.\n\nCheck: $4.25 \\times 1 + 4.25 \\times 0.3 = 4.25 + 1.275 = 5.525$.\n\nIn this lesson we multiply longer decimals.",
    "一条丝带长 $4.25$ 米，米娅需要的丝带是它的 $1.3$ 倍。$425 \\times 13 = 5525$，$2 + 1 = 3$ 位小数，所以是 $5.525$ 米。\n\n检验：$4.25 \\times 1 + 4.25 \\times 0.3 = 4.25 + 1.275 = 5.525$。\n\n本课我们计算位数更多的小数乘法。",
  ),
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
    point(
      "three-digit-decimals-with-two-places",
      ["Both with two decimal places", "都是两位小数"],
      [
        "$1.25 \\times 2.08$: $125 \\times 208 = 26{,}000$. There are $2 + 2 = 4$ decimal places, so the product is $2.6000 = 2.6$.\n\nCheck: $1.25 \\times 2 = 2.5$, close to $2.6$.\n\n> **Watch out.** Place the point first: four places from the right of $26{,}000$. Dropping the zeros first gives $0.0026$.",
        "$1.25 \\times 2.08$：$125 \\times 208 = 26000$。共有 $2 + 2 = 4$ 位小数，所以积是 $2.6000 = 2.6$。\n\n检验：$1.25 \\times 2 = 2.5$，接近 $2.6$。\n\n> **注意。** 先点小数点：从 $26000$ 的右边数四位。先去掉 0 会得到 $0.0026$。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, 3), 2, nonZeroEnd(rng, 3), 2),
      splitArea(125, 2, 208, 2),
    ),
    point(
      "three-digit-decimals-with-mixed-places",
      ["Different decimal places", "小数位数不同"],
      [
        "$0.125 \\times 3.44$: $125 \\times 344 = 43{,}000$. There are $3 + 2 = 5$ decimal places, so the product is $0.43000 = 0.43$.\n\nCheck: $0.125$ is one eighth, and one eighth of $3.44$ is $0.43$.\n\n> **Watch out.** Add the two different counts, $3 + 2$. Using only the 3 places of $0.125$ gives $43$.",
        "$0.125 \\times 3.44$：$125 \\times 344 = 43000$。共有 $3 + 2 = 5$ 位小数，所以积是 $0.43000 = 0.43$。\n\n检验：$0.125$ 是八分之一，$3.44$ 的八分之一是 $0.43$。\n\n> **注意。** 两个不同的位数要相加，$3 + 2$。只用 $0.125$ 的 3 位会得到 $43$。",
      ],
      (rng) => productAnswer(nonZeroEnd(rng, 3), rng.int(1, 3), nonZeroEnd(rng, 3), rng.int(1, 3)),
      splitArea(125, 3, 344, 2),
    ),
  ],
  t(
    "A card is $2.45$ cm by $1.32$ cm. $245 \\times 132 = 32{,}340$, and $2 + 2 = 4$ places give $3.2340 = 3.234$ square centimeters.\n\nCheck: $2.5 \\times 1.3$ is about 3, close to $3.234$.\n\nIn this lesson we multiply two decimals that each have three digits.",
    "一张卡片长 $2.45$ 厘米，宽 $1.32$ 厘米。$245 \\times 132 = 32340$，$2 + 2 = 4$ 位小数，所以是 $3.2340 = 3.234$ 平方厘米。\n\n检验：$2.5 \\times 1.3$ 约是 3，接近 $3.234$。\n\n本课我们计算两个三位数字的小数相乘。",
  ),
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
    point(
      "dividing-decimals-by-ten",
      ["Dividing by 10", "除以 10"],
      [
        "$6.2 \\div 10 = 0.62$: each digit moves one place to the right, so 6 ones become 6 tenths and 2 tenths become 2 hundredths.\n\nCheck: $0.62 \\times 10 = 6.2$.\n\n> **Watch out.** Dividing makes the number smaller. Moving the digits left gives $62$, which is times 10.",
        "$6.2 \\div 10 = 0.62$：每个数字都往右移一位，6 个一变成 6 个十分之一，2 个十分之一变成 2 个百分之一。\n\n检验：$0.62 \\times 10 = 6.2$。\n\n> **注意。** 除法会让数变小。数字往左移得到 $62$，那是乘 10。",
      ],
      (rng) => {
        const p = rng.int(0, 2);
        const n = nonZeroEnd(rng, rng.int(2, 3));
        const r = shifted(n, p, -1);
        return answered(
          [`Find $${fix(n, p)} \\div 10$.`, `计算 $${fix(n, p)} \\div 10$。`],
          r,
          [
            [
              ["Move each digit", "移动数字"],
              ["Divided by 10, every digit moves one place to the right.", "除以 10，每个数字都往右移一位。"],
            ],
            [
              ["Read the result", "读出结果"],
              ["Write a 0 in the ones place if it is empty.", "个位空了就写 0。"],
              [`${fix(n, p)} \\div 10 = ${dq(r)}`],
            ],
          ],
          [`Multiply back: $${dq(r)} \\times 10 = ${fix(n, p)}$.`, `乘回去：$${dq(r)} \\times 10 = ${fix(n, p)}$。`],
          [
            [shifted(n, p, 1), "That moves the digits left, which multiplies by 10.", "数字往左移了，是乘 10。"],
            [shifted(n, p, -2), "That moves two places, which divides by 100.", "这移了两位，是除以 100。"],
          ],
          { form: "decimal", figure: shiftChart(n, p, -1) },
        );
      },
      shiftChart(62, 1, -1),
    ),
    point(
      "dividing-decimals-by-hundred-and-thousand",
      ["Dividing by 100 and 1,000", "除以 100 和 1000"],
      [
        "$45.3 \\div 100 = 0.453$: each digit moves two places to the right, so the 4 tens become 4 tenths.\n\nCheck: $0.453 \\times 100 = 45.3$.\n\n> **Watch out.** Move one place for each zero: 100 is two places, so not $4.53$.",
        "$45.3 \\div 100 = 0.453$：每个数字都往右移两位，4 个十变成 4 个十分之一。\n\n检验：$0.453 \\times 100 = 45.3$。\n\n> **注意。** 有几个 0 就移几位：100 要移两位，所以不是 $4.53$。",
      ],
      (rng) => {
        const k = rng.int(2, 3);
        const p = rng.int(0, 3 - k);
        const n = nonZeroEnd(rng, rng.int(2, 3));
        const r = shifted(n, p, -k);
        const f = pow10(k);
        return answered(
          [`Find $${fix(n, p)} \\div ${texCommas(f)}$.`, `计算 $${fix(n, p)} \\div ${texCommas(f)}$。`],
          r,
          [
            [
              ["Count the zeros", "数 0 的个数"],
              [
                `$${texCommas(f)}$ has ${k} zeros, so every digit moves ${k} places to the right.`,
                `$${texCommas(f)}$ 有 ${k} 个 0，每个数字往右移 ${k} 位。`,
              ],
            ],
            [
              ["Read the result", "读出结果"],
              ["Fill empty places after the point with zeros.", "小数点后空着的数位补 0。"],
              [`${fix(n, p)} \\div ${texCommas(f)} = ${dq(r)}`],
            ],
          ],
          [
            `Multiply back: $${dq(r)} \\times ${texCommas(f)} = ${fix(n, p)}$.`,
            `乘回去：$${dq(r)} \\times ${texCommas(f)} = ${fix(n, p)}$。`,
          ],
          [
            [shifted(n, p, 1 - k), "That moves one place too few.", "这少移了一位。"],
            [shifted(n, p, -k - 1), "That moves one place too many.", "这多移了一位。"],
            [shifted(n, p, k), "That moves the digits left, which multiplies.", "数字往左移了，是乘法。"],
          ],
          { form: "decimal", figure: shiftChart(n, p, -k) },
        );
      },
      shiftChart(453, 1, -2),
    ),
  ],
  t(
    "A rope $34.7$ m long is cut into 10 equal pieces. Each piece is $34.7 \\div 10$: every digit moves one place to the right, so 3 tens become 3 ones. Each piece is $3.47$ m.\n\nCheck: $3.47 \\times 10 = 34.7$.\n\nIn this lesson we divide decimals by 10, 100 and 1,000 by moving digits to smaller places.",
    "一根 $34.7$ 米长的绳子平均剪成 10 段，每段是 $34.7 \\div 10$：每个数字都往右移一位，3 个十变成 3 个一。每段长 $3.47$ 米。\n\n检验：$3.47 \\times 10 = 34.7$。\n\n本课我们把数字移到更小的数位，计算小数除以 10、100、1000。",
  ),
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
    point(
      "moving-the-decimal-point-to-divide",
      ["Moving the point to divide", "移动小数点做除法"],
      [
        "$8.6 \\div 100$: 100 has 2 zeros, so move the point 2 places to the left. There is only one digit in front of it, so write a 0: $0.086$.\n\nCheck: $0.086 \\times 100 = 8.6$.\n\n> **Watch out.** When you run out of digits, fill with zeros: $0.086$, not $0.86$.",
        "$8.6 \\div 100$：100 有 2 个 0，把小数点向左移两位。小数点前只有一个数字，要补一个 0：$0.086$。\n\n检验：$0.086 \\times 100 = 8.6$。\n\n> **注意。** 数字不够时要补 0：是 $0.086$，不是 $0.86$。",
      ],
      (rng) => {
        const k = rng.int(1, 3);
        const p = rng.int(0, 3 - k);
        const n = nonZeroEnd(rng, rng.int(1, 3));
        const r = shifted(n, p, -k);
        const f = pow10(k);
        return answered(
          [
            `Find $${fix(n, p)} \\div ${texCommas(f)}$ by moving the decimal point.`,
            `移动小数点，计算 $${fix(n, p)} \\div ${texCommas(f)}$。`,
          ],
          r,
          [
            [
              ["How far", "移几位"],
              [
                `Divided by ${texCommas(f)}: move the point ${k} place${k === 1 ? "" : "s"} to the left.`,
                `除以 ${texCommas(f)}：小数点向左移 ${k} 位。`,
              ],
            ],
            [
              ["Move the point", "移动小数点"],
              ["Write zeros in front where there are no digits left.", "数字不够的地方在前面补 0。"],
              [`${fix(n, p)} \\div ${texCommas(f)} = ${dq(r)}`],
            ],
          ],
          [
            `Multiply back: $${dq(r)} \\times ${texCommas(f)} = ${fix(n, p)}$.`,
            `乘回去：$${dq(r)} \\times ${texCommas(f)} = ${fix(n, p)}$。`,
          ],
          [
            [shifted(n, p, 1 - k), "That moves the point one place too few.", "小数点少移了一位。"],
            [shifted(n, p, -k - 1), "That moves the point one place too many.", "小数点多移了一位。"],
            [shifted(n, p, k), "That moves the point to the right, which multiplies.", "小数点向右移了，是乘法。"],
          ],
          { form: "decimal", figure: shiftChart(n, p, -k) },
        );
      },
      shiftChart(86, 1, -2),
    ),
    point(
      "finding-the-power-of-ten-in-a-quotient",
      ["Finding the power of ten", "求除以的是 10 的几次方"],
      [
        "$52 \\div \\square = 0.052$. The point moved 3 places to the left, so $\\square = 1{,}000$.\n\nCheck: $52 \\div 1{,}000 = 0.052$.\n\n> **Watch out.** Three places means 1,000, not 3 and not 100.",
        "$52 \\div \\square = 0.052$。小数点向左移了三位，所以 $\\square = 1000$。\n\n检验：$52 \\div 1000 = 0.052$。\n\n> **注意。** 移三位是除以 1000，不是 3，也不是 100。",
      ],
      (rng) => {
        const k = rng.int(1, 3);
        const p = rng.int(0, 3 - k);
        const n = nonZeroEnd(rng, rng.int(1, 3));
        const r = shifted(n, p, -k);
        const f = pow10(k);
        return answered(
          [
            `Find the missing number: $${fix(n, p)} \\div \\square = ${dq(r)}$.`,
            `求方框里的数：$${fix(n, p)} \\div \\square = ${dq(r)}$。`,
          ],
          f,
          [
            [
              ["Count the places", "数移了几位"],
              [`The point moved ${k} place${k === 1 ? "" : "s"} to the left.`, `小数点向左移了 ${k} 位。`],
            ],
            [
              ["Name the power of ten", "写出 10 的幂"],
              ["Each place is one factor of 10.", "每移一位就除以一个 10。"],
              [`\\square = ${texCommas(f)}`],
            ],
          ],
          [`Divide: $${fix(n, p)} \\div ${texCommas(f)} = ${dq(r)}$.`, `除一除：$${fix(n, p)} \\div ${texCommas(f)} = ${dq(r)}$。`],
          [
            [k, "That is the number of places, not the number to divide by.", "这是移动的位数，不是除数。"],
            [f * 10, "That is one place too many.", "这多了一位。"],
            [f / 10, "That is one place too few.", "这少了一位。"],
          ],
          { figure: shiftChart(n, p, -k) },
        );
      },
      shiftChart(52, 0, -3),
    ),
  ],
  t(
    "A pack of 100 stickers weighs $54$ g. One sticker weighs $54 \\div 100$. Move the point 2 places to the left: $0.54$ g.\n\nCheck: $0.54 \\times 100 = 54$.\n\nIn this lesson we divide by powers of ten by moving the decimal point, and find the missing power of ten.",
    "一包 100 张贴纸重 $54$ 克，一张重 $54 \\div 100$。把小数点向左移两位：$0.54$ 克。\n\n检验：$0.54 \\times 100 = 54$。\n\n本课我们用移动小数点的方法除以 10 的幂，并求出缺少的 10 的幂。",
  ),
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
    point(
      "estimating-a-decimal-divided-by-a-whole-number",
      ["Dividing by a whole number", "除以整数"],
      [
        "$55.3 \\div 7 \\approx 56 \\div 7 = 8$, because $56$ is close to $55.3$ and $7 \\times 8 = 56$.\n\nCheck: $8 \\times 7 = 56$, close to $55.3$.\n\n> **Watch out.** Pick a number the divisor goes into evenly. Rounding to $55$ does not help, since 7 does not divide 55.",
        "$55.3 \\div 7 \\approx 56 \\div 7 = 8$，因为 $56$ 接近 $55.3$，而且 $7 \\times 8 = 56$。\n\n检验：$8 \\times 7 = 56$，接近 $55.3$。\n\n> **注意。** 要选能被除数整除的数。取成 $55$ 没有用，因为 55 不能被 7 整除。",
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const q = rng.int(3, 12);
        let off = rng.int(-9, 9);
        if (off === 0) off = 4;
        const n = q * d * 10 + off;
        return answered(
          [`Estimate $${fix(n, 1)} \\div ${d}$ using compatible numbers.`, `用相容数估算 $${fix(n, 1)} \\div ${d}$。`],
          q,
          [
            [
              ["Find a compatible number", "找相容数"],
              [`The multiple of ${d} closest to $${fix(n, 1)}$ is ${q * d}.`, `最接近 $${fix(n, 1)}$ 的 ${d} 的倍数是 ${q * d}。`],
            ],
            [["Divide", "相除"], ["Use the basic fact.", "用乘法口诀。"], [`${q * d} \\div ${d} = ${q}`]],
          ],
          [
            `Multiply back: $${q} \\times ${d} = ${q * d}$, close to $${fix(n, 1)}$.`,
            `乘回去：$${q} \\times ${d} = ${q * d}$，接近 $${fix(n, 1)}$。`,
          ],
          [
            [q * 10, "That is 10 times too large: the point was dropped.", "这大了 10 倍：小数点被丢掉了。"],
            [
              q + 1,
              `That uses ${(q + 1) * d}, which is further from $${fix(n, 1)}$ than ${q * d}.`,
              `这用的是 ${(q + 1) * d}，比 ${q * d} 离 $${fix(n, 1)}$ 更远。`,
            ],
            [
              q - 1,
              `That uses ${(q - 1) * d}, which is further from $${fix(n, 1)}$ than ${q * d}.`,
              `这用的是 ${(q - 1) * d}，比 ${q * d} 离 $${fix(n, 1)}$ 更远。`,
            ],
          ],
          { figure: divTape(fix(n, 1), d, "?") },
        );
      },
      divTape("55.3", 7, "≈ 8"),
    ),
    point(
      "estimating-a-decimal-divided-by-a-decimal",
      ["Dividing by a decimal", "除以小数"],
      [
        "$35.6 \\div 4.1 \\approx 36 \\div 4 = 9$. Round the divisor to 4 first, then pick a multiple of 4 near $35.6$.\n\nCheck: $9 \\times 4.1 = 36.9$, close to $35.6$.\n\n> **Watch out.** Look for a multiple of the rounded divisor, 4. Rounding $35.6$ to 40 is further away than 36.",
        "$35.6 \\div 4.1 \\approx 36 \\div 4 = 9$。先把除数看作 4，再找一个接近 $35.6$ 的 4 的倍数。\n\n检验：$9 \\times 4.1 = 36.9$，接近 $35.6$。\n\n> **注意。** 要找取整后除数 4 的倍数。把 $35.6$ 看作 40，比 36 离得远。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const q = rng.int(2, 12);
        const e = d * 10 + rng.pick([-2, -1, 1, 2]);
        const n = q * d * 10 + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        return answered(
          [`Estimate $${fix(n, 1)} \\div ${fix(e, 1)}$ using compatible numbers.`, `用相容数估算 $${fix(n, 1)} \\div ${fix(e, 1)}$。`],
          q,
          [
            [
              ["Round the divisor", "先看除数"],
              [`$${fix(e, 1)}$ is about ${d}.`, `$${fix(e, 1)}$ 约是 ${d}。`],
            ],
            [
              ["Find a compatible number", "找相容数"],
              [`The multiple of ${d} closest to $${fix(n, 1)}$ is ${q * d}.`, `最接近 $${fix(n, 1)}$ 的 ${d} 的倍数是 ${q * d}。`],
              [`${q * d} \\div ${d} = ${q}`],
            ],
          ],
          [
            `Multiply back: $${q} \\times ${fix(e, 1)} = ${dq(D(q * e, 1))}$, close to $${fix(n, 1)}$.`,
            `乘回去：$${q} \\times ${fix(e, 1)} = ${dq(D(q * e, 1))}$，接近 $${fix(n, 1)}$。`,
          ],
          [
            [q * 10, "That is 10 times too large: the point in the divisor was dropped.", "这大了 10 倍：除数的小数点被丢掉了。"],
            [q + 1, "That picks a multiple further from the dividend.", "这选的倍数离被除数更远。"],
            [q - 1, "That picks a multiple further from the dividend.", "这选的倍数离被除数更远。"],
          ],
          { figure: divTape(fix(n, 1), d, "?") },
        );
      },
      divTape("35.6", 4, "≈ 9"),
    ),
  ],
  t(
    "Four friends share $41.7$ yuan. $41.7$ is close to 40, and $40 \\div 4 = 10$, so each gets about 10 yuan.\n\nCheck: $10 \\times 4 = 40$, close to $41.7$.\n\nIn this lesson we estimate quotients with compatible numbers: numbers close by that divide easily.",
    "四个朋友平分 $41.7$ 元。$41.7$ 接近 40，$40 \\div 4 = 10$，所以每人大约 10 元。\n\n检验：$10 \\times 4 = 40$，接近 $41.7$。\n\n本课我们用相容数估算商：找一个相近、又容易除的数。",
  ),
);

/** divArea draws a division as an area model: one side and the area are known, the other side is the quotient. */
const divArea = (side: string, area: string): Figure => areaGridFigure([side], ["?"], [[area]]);

/** unitsAnswer asks for n/10ᵖ ÷ d by counting the decimal as tenths or hundredths. */
function unitsAnswer(n: number, p: number, d: number): Problem {
  const q = n / d;
  const unitEn = ["ones", "tenths", "hundredths"][p]!;
  return answered(
    [`Find $${fix(n, p)} \\div ${d}$.`, `计算 $${fix(n, p)} \\div ${d}$。`],
    D(q, p),
    [
      [
        [`See it as ${unitEn}`, `看作${unitZh(p)}`],
        [`$${fix(n, p)}$ is ${n} ${unitEn}.`, `$${fix(n, p)}$ 是 ${n} 个${unitZh(p)}。`],
      ],
      [
        ["Divide", "相除"],
        [`$${n} \\div ${d} = ${q}$, so the answer is ${q} ${unitEn}.`, `$${n} \\div ${d} = ${q}$，所以得数是 ${q} 个${unitZh(p)}。`],
        [`${fix(n, p)} \\div ${d} = ${dq(D(q, p))}`],
      ],
    ],
    [`Multiply back: $${dq(D(q, p))} \\times ${d} = ${fix(n, p)}$.`, `乘回去：$${dq(D(q, p))} \\times ${d} = ${fix(n, p)}$。`],
    [
      [Q.of(q), `That forgets the answer is in ${unitEn}.`, `这忘了得数是${unitZh(p)}的个数。`],
      [D(q, p + 1), "That has one decimal place too many.", "小数位数多了一位。"],
      [D(q, p - 1), "That has one decimal place too few.", "小数位数少了一位。"],
    ],
    { form: "decimal", figure: divTape(fix(n, p), d, "?") },
  );
}

/** wholeQuotientAnswer asks for n ÷ d written as a terminating decimal, continuing the division past the point. */
function wholeQuotientAnswer(n: number, d: number): Problem {
  const v = Q.of(n, d);
  const k = placesOf(v);
  const [q, r] = [Math.floor(n / d), n % d];
  return answered(
    [`Find $${n} \\div ${d}$. Write the answer as a decimal.`, `计算 $${n} \\div ${d}$，结果写成小数。`],
    v,
    [
      [
        ["Divide the whole numbers", "先按整数除"],
        [`${n} divided by ${d} is ${q} with ${r} left over.`, `${n} 除以 ${d} 商 ${q}，余 ${r}。`],
        [`${n} = ${q} \\times ${d} + ${r}`],
      ],
      [
        ["Keep dividing after the point", "在小数点后继续除"],
        [
          `Write ${n} as $${n}.${"0".repeat(k)}$ and divide the remainder as tenths and hundredths.`,
          `把 ${n} 写成 $${n}.${"0".repeat(k)}$，把余数当作十分之几、百分之几继续除。`,
        ],
        [`${n} \\div ${d} = ${dq(v)}`],
      ],
    ],
    [`Multiply back: $${dq(v)} \\times ${d} = ${n}$.`, `乘回去：$${dq(v)} \\times ${d} = ${n}$。`],
    [
      [Q.of(q).add(D(r, r < 10 ? 1 : 2)), "That writes the remainder as the decimal part.", "这是把余数当成了小数部分。"],
      [Q.of(q), "That stops at the remainder instead of dividing it.", "这是除到余数就停下了。"],
      [v.mul(Q.of(10)), "That puts the point one place too far right.", "小数点的位置往右偏了一位。"],
    ],
    { form: "decimal", figure: d < 10 ? divTape(String(n), d, "?") : divArea(String(d), String(n)) },
  );
}

/** roundedQuotientAnswer asks for n ÷ d rounded to k decimal places. */
function roundedQuotientAnswer(n: number, d: number, k: number): Problem {
  const v = roundQuotient(n, d, k);
  const cut = Q.of(Math.floor((n * pow10(k)) / d), pow10(k));
  const more = Math.floor((n * pow10(k + 1)) / d);
  const next = more % 10;
  const place: Pair = k === 1 ? ["tenth", "十分位"] : ["hundredth", "百分位"];
  const lo = Math.floor((n * pow10(k)) / d) / pow10(k);
  return answered(
    [`Find $${n} \\div ${d}$, rounded to the nearest ${place[0]}.`, `计算 $${n} \\div ${d}$，结果保留${k === 1 ? "一" : "两"}位小数。`],
    v,
    [
      [
        ["Divide one place more", "多除一位"],
        [`Divide to ${k + 1} decimal places.`, `除到第 ${k + 1} 位小数。`],
        [`${n} \\div ${d} = ${dq(Q.of(more, pow10(k + 1)))}\\ldots`],
      ],
      [
        ["Round", "四舍五入"],
        next >= 5
          ? [`The next digit is ${next}, which is 5 or more, so round up.`, `下一位是 ${next}，大于或等于 5，要进一。`]
          : [`The next digit is ${next}, which is less than 5, so round down.`, `下一位是 ${next}，小于 5，要舍去。`],
        [`${n} \\div ${d} \\approx ${dq(v)}`],
      ],
    ],
    [
      `Multiply back: $${dq(v)} \\times ${d} = ${dq(v.mul(Q.of(d)))}$, close to ${n}.`,
      `乘回去：$${dq(v)} \\times ${d} = ${dq(v.mul(Q.of(d)))}$，接近 ${n}。`,
    ],
    [
      cut.eq(v)
        ? [cut.add(D(1, k)), "That rounds up though the next digit is less than 5.", "下一位小于 5，却进了一。"]
        : [cut, "That cuts off the digits instead of rounding.", "这是直接截去，没有四舍五入。"],
      [roundQuotient(n, d, k === 1 ? 2 : 1), `That rounds to the wrong place.`, "这保留的位数不对。"],
      [Q.of(Math.floor(n / d)).add(D(n % d, k)), "That writes the remainder as the decimal part.", "这是把余数当成了小数部分。"],
    ],
    { form: "decimal", figure: decLine(lo, lo + 1 / pow10(k), 1 / pow10(k + 1), [more / pow10(k + 1)]) },
  );
}

/** pointAboveAnswer asks for n/10ᵖ ÷ d with long division, the point in the quotient above the point in the dividend. */
function pointAboveAnswer(q: number, p: number, d: number): Problem {
  const n = q * d;
  const plain = Number(String(q).replace(/0/g, ""));
  return answered(
    [`Find $${fix(n, p)} \\div ${d}$.`, `计算 $${fix(n, p)} \\div ${d}$。`],
    D(q, p),
    [
      [
        ["Divide as whole numbers", "按整数除"],
        ["Long divide, writing a 0 for any place that gives nothing.", "列竖式除，哪一位不够商 1 就写 0。"],
        [`${n} \\div ${d} = ${q}`],
      ],
      [
        ["Place the point", "点小数点"],
        ["Put the point in the quotient right above the point in the dividend.", "商的小数点和被除数的小数点对齐。"],
        [`${fix(n, p)} \\div ${d} = ${dq(D(q, p))}`],
      ],
    ],
    [`Multiply back: $${dq(D(q, p))} \\times ${d} = ${fix(n, p)}$.`, `乘回去：$${dq(D(q, p))} \\times ${d} = ${fix(n, p)}$。`],
    [
      [D(q, p - 1), "That puts the point one place too far right.", "小数点往右偏了一位。"],
      [D(q, p + 1), "That puts the point one place too far left.", "小数点往左偏了一位。"],
      ...(plain !== q ? [[D(plain, p), "That leaves out a 0 in the quotient.", "商中间漏写了 0。"] as Miss] : []),
    ],
    { form: "decimal", figure: d < 10 ? divTape(fix(n, p), d, "?") : divArea(String(d), fix(n, p)) },
  );
}

/** decimalDivisorAnswer asks for a/10ᵖᵃ ÷ e/10ᵖᵉ by first making the divisor a whole number. */
function decimalDivisorAnswer(a: number, pa: number, e: number, pe: number, q: Q): Problem {
  const A = D(a, pa).mul(Q.of(pow10(pe)));
  const f = pow10(pe);
  return answered(
    [`Find $${fix(a, pa)} \\div ${fix(e, pe)}$.`, `计算 $${fix(a, pa)} \\div ${fix(e, pe)}$。`],
    q,
    [
      [
        ["Make the divisor whole", "把除数变成整数"],
        [
          `$${fix(e, pe)}$ has ${pe} decimal place${pe === 1 ? "" : "s"}, so multiply both numbers by ${f}.`,
          `$${fix(e, pe)}$ 有 ${pe} 位小数，所以两个数都乘 ${f}。`,
        ],
        [`${fix(a, pa)} \\div ${fix(e, pe)} = ${dq(A)} \\div ${e}`],
      ],
      [
        ["Divide", "相除"],
        ["Long divide and put the point above the new point.", "列竖式除，商的小数点对齐新的小数点。"],
        [`${dq(A)} \\div ${e} = ${dq(q)}`],
      ],
    ],
    [`Multiply back: $${dq(q)} \\times ${fix(e, pe)} = ${fix(a, pa)}$.`, `乘回去：$${dq(q)} \\times ${fix(e, pe)} = ${fix(a, pa)}$。`],
    [
      [q.mul(Q.of(10)), "That is 10 times too large: the point is one place too far right.", "这大了 10 倍：小数点往右偏了一位。"],
      [q.mul(Q.of(1, 10)), "That is 10 times too small: the point is one place too far left.", "这小了 10 倍：小数点往左偏了一位。"],
      [q.mul(Q.of(100)), "That is 100 times too large.", "这大了 100 倍。"],
    ],
    { form: "decimal", figure: divArea(fix(e, pe), fix(a, pa)) },
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
    point(
      "dividing-tenths",
      ["Dividing tenths", "除十分之几"],
      [
        "$4.8 \\div 8$: $4.8$ is 48 tenths, and 48 tenths $\\div 8 = 6$ tenths. So $4.8 \\div 8 = 0.6$.\n\nCheck: $0.6 \\times 8 = 4.8$.\n\n> **Watch out.** The answer counts tenths: 6 tenths is $0.6$, not 6.",
        "$4.8 \\div 8$：$4.8$ 是 48 个十分之一，48 个十分之一 $\\div 8 = 6$ 个十分之一。所以 $4.8 \\div 8 = 0.6$。\n\n检验：$0.6 \\times 8 = 4.8$。\n\n> **注意。** 得数是十分之一的个数：6 个十分之一是 $0.6$，不是 6。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(2, 9);
          const n = rng.int(1, 12) * d;
          if (n % 10 !== 0) return unitsAnswer(n, 1, d);
        }
      },
      divTape("4.8", 8, "0.6"),
    ),
    point(
      "dividing-hundredths",
      ["Dividing hundredths", "除百分之几"],
      [
        "$0.63 \\div 9$: $0.63$ is 63 hundredths, and 63 hundredths $\\div 9 = 7$ hundredths. So $0.63 \\div 9 = 0.07$.\n\nCheck: $0.07 \\times 9 = 0.63$.\n\n> **Watch out.** 7 hundredths is $0.07$. Writing $0.7$ means 7 tenths, which is 10 times too large.",
        "$0.63 \\div 9$：$0.63$ 是 63 个百分之一，63 个百分之一 $\\div 9 = 7$ 个百分之一。所以 $0.63 \\div 9 = 0.07$。\n\n检验：$0.07 \\times 9 = 0.63$。\n\n> **注意。** 7 个百分之一是 $0.07$。写成 $0.7$ 就是 7 个十分之一，大了 10 倍。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(2, 9);
          const n = rng.int(1, 12) * d;
          if (n % 10 !== 0) return unitsAnswer(n, 2, d);
        }
      },
      divTape("0.63", 9, "0.07"),
    ),
  ],
  t(
    "Six friends share $2.4$ L of juice. $2.4$ L is 24 tenths of a liter, and 24 tenths $\\div 6 = 4$ tenths. Each gets $0.4$ L.\n\nCheck: $0.4 \\times 6 = 2.4$.\n\nIn this lesson we divide decimals by thinking of them as tenths or hundredths.",
    "六个朋友平分 $2.4$ 升果汁。$2.4$ 升是 24 个十分之一升，24 个十分之一 $\\div 6 = 4$ 个十分之一。每人分到 $0.4$ 升。\n\n检验：$0.4 \\times 6 = 2.4$。\n\n本课我们把小数看作十分之几或百分之几来做除法。",
  ),
);

/** placesOf is the number of decimal places of a terminating rational number. */
function placesOf(q: Q): number {
  const s = dq(q);
  return s.includes(".") ? s.length - s.indexOf(".") - 1 : 0;
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
    point(
      "decimal-quotients-with-one-digit-divisors",
      ["One-digit divisors", "除数是一位数"],
      [
        "$23 \\div 8$: $23 = 2 \\times 8 + 7$. Write $23.000$ and keep going: $70 \\div 8 = 8$ R 6, $60 \\div 8 = 7$ R 4, $40 \\div 8 = 5$. So $23 \\div 8 = 2.875$.\n\nCheck: $2.875 \\times 8 = 23$.\n\n> **Watch out.** The remainder is not the decimal part. $2.7$ is wrong.",
        "$23 \\div 8$：$23 = 2 \\times 8 + 7$。写成 $23.000$ 继续除：$70 \\div 8$ 商 8 余 6，$60 \\div 8$ 商 7 余 4，$40 \\div 8 = 5$。所以 $23 \\div 8 = 2.875$。\n\n检验：$2.875 \\times 8 = 23$。\n\n> **注意。** 余数不是小数部分。$2.7$ 是错的。",
      ],
      (rng) => {
        const d = rng.pick([2, 4, 5, 8]);
        let n = rng.int(3, 200);
        while (n % d === 0) n++;
        return wholeQuotientAnswer(n, d);
      },
      divTape("23", 8, "?"),
    ),
    point(
      "decimal-quotients-with-two-digit-divisors",
      ["Two-digit divisors", "除数是两位数"],
      [
        "$63 \\div 12$: $63 = 5 \\times 12 + 3$. Then $30 \\div 12 = 2$ R 6 and $60 \\div 12 = 5$. So $63 \\div 12 = 5.25$.\n\nCheck: $5.25 \\times 12 = 63$.\n\n> **Watch out.** The point goes right after the whole-number part: $5.25$, not $52.5$.",
        "$63 \\div 12$：$63 = 5 \\times 12 + 3$。再算 $30 \\div 12$ 商 2 余 6，$60 \\div 12 = 5$。所以 $63 \\div 12 = 5.25$。\n\n检验：$5.25 \\times 12 = 63$。\n\n> **注意。** 小数点紧跟在整数部分后面：是 $5.25$，不是 $52.5$。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(12, 50);
          const n = rng.int(d + 1, 20 * d);
          const v = Q.of(n, d);
          if (n % d === 0) continue;
          let den = v.d;
          while (den % 2n === 0n) den /= 2n;
          while (den % 5n === 0n) den /= 5n;
          if (den !== 1n || placesOf(v) > 3) continue;
          return wholeQuotientAnswer(n, d);
        }
      },
      divArea("12", "63"),
    ),
  ],
  t(
    "Four children share 7 m of ribbon. $7 \\div 4 = 1$ with 3 left over. Write 7 as $7.00$ and keep going: 30 tenths $\\div 4 = 7$ tenths with 2 tenths left, and 20 hundredths $\\div 4 = 5$ hundredths. Each gets $1.75$ m.\n\nCheck: $1.75 \\times 4 = 7$.\n\nIn this lesson we keep dividing past the decimal point when whole numbers do not divide evenly.",
    "四个孩子平分 7 米丝带。$7 \\div 4$ 商 1 余 3。把 7 写成 $7.00$ 继续除：30 个十分之一 $\\div 4$ 商 7 个十分之一，余 2 个十分之一；20 个百分之一 $\\div 4$ 商 5 个百分之一。每人 $1.75$ 米。\n\n检验：$1.75 \\times 4 = 7$。\n\n本课我们在整数除不尽时，在小数点后继续除。",
  ),
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
    point(
      "rounding-quotients-to-tenths",
      ["To the nearest tenth", "保留一位小数"],
      [
        "$17 \\div 3 = 5.66\\ldots \\approx 5.7$, because the hundredths digit 6 is 5 or more.\n\nCheck: $5.7 \\times 3 = 17.1$, close to 17.\n\n> **Watch out.** Round, do not just cut off. Cutting gives $5.6$, which is further from $5.66\\ldots$.",
        "$17 \\div 3 = 5.66\\cdots \\approx 5.7$，因为百分位上的 6 大于或等于 5。\n\n检验：$5.7 \\times 3 = 17.1$，接近 17。\n\n> **注意。** 要四舍五入，不能直接截去。截去得 $5.6$，离 $5.66\\cdots$ 更远。",
      ],
      (rng) => {
        const d = rng.pick([3, 6, 7, 9, 11, 12]);
        let n = rng.int(2, 150);
        while (n % d === 0) n++;
        return roundedQuotientAnswer(n, d, 1);
      },
      decLine(5.6, 5.7, 0.01, [5.66]),
    ),
    point(
      "rounding-quotients-to-hundredths",
      ["To the nearest hundredth", "保留两位小数"],
      [
        "$2 \\div 7 = 0.285\\ldots \\approx 0.29$, because the thousandths digit 5 is 5 or more.\n\nCheck: $0.29 \\times 7 = 2.03$, close to 2.\n\n> **Watch out.** Look at the thousandths digit only. Rounding to $0.3$ first and then writing $0.30$ is wrong.",
        "$2 \\div 7 = 0.285\\cdots \\approx 0.29$，因为千分位上的 5 大于或等于 5。\n\n检验：$0.29 \\times 7 = 2.03$，接近 2。\n\n> **注意。** 只看千分位。先取成 $0.3$ 再写成 $0.30$ 是错的。",
      ],
      (rng) => {
        const d = rng.pick([3, 6, 7, 9, 11, 12, 13]);
        let n = rng.int(1, 100);
        while (n % d === 0) n++;
        return roundedQuotientAnswer(n, d, 2);
      },
      decLine(0.28, 0.29, 0.001, [0.285]),
    ),
  ],
  t(
    "Three friends share 10 yuan. $10 \\div 3 = 3.333\\ldots$, and it never ends. Divide to the thousandths and round to the hundredths: each gets about $3.33$ yuan.\n\nCheck: $3.33 \\times 3 = 9.99$, close to 10.\n\nIn this lesson we round quotients that do not come out even.",
    "三个朋友平分 10 元。$10 \\div 3 = 3.333\\cdots$，永远除不尽。除到千分位，再四舍五入到百分位：每人大约 $3.33$ 元。\n\n检验：$3.33 \\times 3 = 9.99$，接近 10。\n\n本课我们对除不尽的商四舍五入。",
  ),
);

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
    point(
      "decimal-divided-by-one-digit-number",
      ["One-digit divisors", "除数是一位数"],
      [
        "$8.24 \\div 4$: $8 \\div 4 = 2$. Then 2 tenths is less than 4, so write 0 in the tenths. Then 24 hundredths $\\div 4 = 6$ hundredths. So $8.24 \\div 4 = 2.06$.\n\nCheck: $2.06 \\times 4 = 8.24$.\n\n> **Watch out.** Write the 0 in the tenths place. Leaving it out gives $2.6$.",
        "$8.24 \\div 4$：$8 \\div 4 = 2$。十分位上的 2 不够除以 4，商写 0。再算 24 个百分之一 $\\div 4 = 6$ 个百分之一。所以 $8.24 \\div 4 = 2.06$。\n\n检验：$2.06 \\times 4 = 8.24$。\n\n> **注意。** 十分位上要写 0。漏写会得到 $2.6$。",
      ],
      (rng) => pointAboveAnswer(nonZeroEnd(rng, rng.int(2, 3)), rng.int(1, 2), rng.int(2, 9)),
      divTape("8.24", 4, "?"),
    ),
    point(
      "decimal-divided-by-two-digit-number",
      ["Two-digit divisors", "除数是两位数"],
      [
        "$31.2 \\div 12$: $31 = 2 \\times 12 + 7$. Bring down the 2 to get 72, and $72 \\div 12 = 6$. So $31.2 \\div 12 = 2.6$.\n\nCheck: $2.6 \\times 12 = 31.2$.\n\n> **Watch out.** Put the point in the quotient above the point in $31.2$: $2.6$, not 26.",
        "$31.2 \\div 12$：$31 = 2 \\times 12 + 7$。落下 2 得 72，$72 \\div 12 = 6$。所以 $31.2 \\div 12 = 2.6$。\n\n检验：$2.6 \\times 12 = 31.2$。\n\n> **注意。** 商的小数点要和 $31.2$ 的小数点对齐：是 $2.6$，不是 26。",
      ],
      (rng) => pointAboveAnswer(nonZeroEnd(rng, rng.int(2, 3)), rng.int(1, 2), rng.int(11, 40)),
      divArea("12", "31.2"),
    ),
  ],
  t(
    "Four children share $9.36$ yuan. Divide as with whole numbers and put the point in the quotient right above the point in $9.36$: each gets $2.34$ yuan.\n\nCheck: $2.34 \\times 4 = 9.36$.\n\nIn this lesson we divide a decimal by a whole number with long division.",
    "四个孩子平分 $9.36$ 元。像整数一样除，商的小数点和 $9.36$ 的小数点对齐：每人 $2.34$ 元。\n\n检验：$2.34 \\times 4 = 9.36$。\n\n本课我们用竖式计算小数除以整数。",
  ),
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
    point(
      "making-the-divisor-a-whole-number",
      ["Making the divisor whole", "把除数变成整数"],
      [
        "$0.756 \\div 0.36$: the divisor has two places, so multiply both numbers by 100: $75.6 \\div 36$. The quotient stays the same, $2.1$.\n\nCheck: $2.1 \\times 0.36 = 0.756$.\n\n> **Watch out.** Move both points. Moving only the divisor's point makes the quotient 100 times too large.",
        "$0.756 \\div 0.36$：除数有两位小数，所以两个数都乘 100：$75.6 \\div 36$。商不变，是 $2.1$。\n\n检验：$2.1 \\times 0.36 = 0.756$。\n\n> **注意。** 两个小数点都要移。只移除数的小数点，商会大 100 倍。",
      ],
      (rng) => {
        const { a, pa, e, pe, q } = decimalQuotient(rng, 2, [3]);
        const A = D(a, pa).mul(Q.of(pow10(pe)));
        const f = pow10(pe);
        return pickedMath(
          rng,
          [
            `Which division has the same quotient as $${fix(a, pa)} \\div ${fix(e, pe)}$ and a whole-number divisor?`,
            `哪个除法算式与 $${fix(a, pa)} \\div ${fix(e, pe)}$ 的商相同，并且除数是整数？`,
          ],
          `${dq(A)} \\div ${e}`,
          [
            [`${fix(a, pa)} \\div ${e}`, "That moves only the divisor's point.", "这只移动了除数的小数点。"],
            [`${dq(A.mul(Q.of(10)))} \\div ${e}`, "That moves the dividend's point one place too far.", "被除数的小数点多移了一位。"],
            [`${dq(A.mul(Q.of(1, 10)))} \\div ${e}`, "That moves the dividend's point one place too few.", "被除数的小数点少移了一位。"],
          ],
          [
            [
              ["How far", "移几位"],
              [
                `$${fix(e, pe)}$ has ${pe} decimal place${pe === 1 ? "" : "s"}, so multiply by ${f}.`,
                `$${fix(e, pe)}$ 有 ${pe} 位小数，所以乘 ${f}。`,
              ],
            ],
            [
              ["Multiply both", "两个数都乘"],
              [`Both numbers times ${f}.`, `两个数都乘 ${f}。`],
              [`${fix(a, pa)} \\div ${fix(e, pe)} = ${dq(A)} \\div ${e}`],
            ],
          ],
          [
            `Both give the same quotient: $${dq(A)} \\div ${e} = ${dq(q)}$, and $${dq(q)} \\times ${fix(e, pe)} = ${fix(a, pa)}$.`,
            `商相同：$${dq(A)} \\div ${e} = ${dq(q)}$，而且 $${dq(q)} \\times ${fix(e, pe)} = ${fix(a, pa)}$。`,
          ],
          divArea(fix(e, pe), fix(a, pa)),
        );
      },
      divArea("0.36", "0.756"),
    ),
    point(
      "dividing-by-a-two-digit-decimal",
      ["Finding the quotient", "求商"],
      [
        "$9.12 \\div 2.4 = 91.2 \\div 24$. Then $91 = 3 \\times 24 + 19$, bring down the 2 to get 192, and $192 \\div 24 = 8$. So the quotient is $3.8$.\n\nCheck: $3.8 \\times 2.4 = 9.12$.\n\n> **Watch out.** Put the point above the new point in $91.2$: $3.8$, not 38.",
        "$9.12 \\div 2.4 = 91.2 \\div 24$。$91 = 3 \\times 24 + 19$，落下 2 得 192，$192 \\div 24 = 8$。所以商是 $3.8$。\n\n检验：$3.8 \\times 2.4 = 9.12$。\n\n> **注意。** 商的小数点对齐 $91.2$ 新的小数点：是 $3.8$，不是 38。",
      ],
      (rng) => {
        const { a, pa, e, pe, q } = decimalQuotient(rng, 2, [3]);
        return decimalDivisorAnswer(a, pa, e, pe, q);
      },
      divArea("2.4", "9.12"),
    ),
  ],
  t(
    "How many times as long as $2.4$ m is $8.64$ m? Find $8.64 \\div 2.4$. Multiply both numbers by 10 so the divisor is whole: $86.4 \\div 24 = 3.6$.\n\nCheck: $3.6 \\times 2.4 = 8.64$.\n\nIn this lesson we divide by a decimal by first making the divisor a whole number.",
    "$8.64$ 米是 $2.4$ 米的几倍？计算 $8.64 \\div 2.4$。两个数都乘 10，使除数变成整数：$86.4 \\div 24 = 3.6$。\n\n检验：$3.6 \\times 2.4 = 8.64$。\n\n本课我们先把除数变成整数，再除以小数。",
  ),
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
    point(
      "dividing-four-digit-decimals",
      ["Four-digit dividends", "被除数是四位数字"],
      [
        "$20.16 \\div 0.48$: $0.48$ has two places, so multiply both by 100: $2016 \\div 48 = 42$.\n\nCheck: $42 \\times 0.48 = 20.16$.\n\n> **Watch out.** Count the places in the divisor, not the dividend, to decide how far to move.",
        "$20.16 \\div 0.48$：$0.48$ 有两位小数，两个数都乘 100：$2016 \\div 48 = 42$。\n\n检验：$42 \\times 0.48 = 20.16$。\n\n> **注意。** 移几位要看除数的小数位数，不看被除数。",
      ],
      (rng) => {
        const { a, pa, e, pe, q } = decimalQuotient(rng, 2, [4]);
        return decimalDivisorAnswer(a, pa, e, pe, q);
      },
      divArea("0.48", "20.16"),
    ),
    point(
      "dividing-five-digit-decimals",
      ["Five-digit dividends", "被除数是五位数字"],
      [
        "$148.35 \\div 4.3 = 1483.5 \\div 43$. Then $148 = 3 \\times 43 + 19$, $193 = 4 \\times 43 + 21$, and $215 \\div 43 = 5$. So the quotient is $34.5$.\n\nCheck: $34.5 \\times 4.3 = 148.35$.\n\n> **Watch out.** $4.3$ has only one place, so multiply by 10, not 100.",
        "$148.35 \\div 4.3 = 1483.5 \\div 43$。$148 = 3 \\times 43 + 19$，$193 = 4 \\times 43 + 21$，$215 \\div 43 = 5$。所以商是 $34.5$。\n\n检验：$34.5 \\times 4.3 = 148.35$。\n\n> **注意。** $4.3$ 只有一位小数，所以乘 10，不是乘 100。",
      ],
      (rng) => {
        const { a, pa, e, pe, q } = decimalQuotient(rng, rng.int(2, 3), [5]);
        return decimalDivisorAnswer(a, pa, e, pe, q);
      },
      divArea("4.3", "148.35"),
    ),
  ],
  t(
    "A tank holds $45.36$ L and a cup holds $0.36$ L. How many cups fill the tank? $45.36 \\div 0.36 = 4536 \\div 36 = 126$ cups.\n\nCheck: $126 \\times 0.36 = 45.36$.\n\nIn this lesson we divide longer decimals the same way: make the divisor whole, then long divide.",
    "一个水箱装 $45.36$ 升，一杯是 $0.36$ 升。几杯能装满水箱？$45.36 \\div 0.36 = 4536 \\div 36 = 126$ 杯。\n\n检验：$126 \\times 0.36 = 45.36$。\n\n本课我们用同样的方法除位数更多的小数：先把除数变成整数，再列竖式。",
  ),
);

// ---------------------------------------------------------------------------
// Exponents

/** power is bᵉ as a LaTeX string, with the base in parentheses when it is a fraction or a decimal. */
const powTex = (base: string, e: number, paren = false) => `${paren ? `\\left(${base}\\right)` : base}^{${e}}`;

/** big writes an integer with LaTeX thousands separators. */
const big = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** repeated writes b × b × … × b with e factors. */
const repeated = (b: string, e: number) => Array(e).fill(b).join(" \\times ");

/** growthLine draws a number line from 0 to bᵉ with the powers of b marked and a jump for each further factor of b; `hidden` writes ? at bᵉ, and `extra` marks one more number. */
function growthLine(b: number, e: number, hidden = false, extra?: number): Figure {
  const hi = b ** e;
  const powers = Array.from({ length: e }, (_, i) => b ** (i + 1));
  const x = (v: number) => (v / hi) * 280;
  const labels = [0];
  for (const v of powers) if (x(v) - x(labels[labels.length - 1] ?? 0) >= 30) labels.push(v);
  const jumps = powers
    .slice(1)
    .map((v, i): [number, number] => [powers[i] ?? 0, v])
    .filter(([a, c]) => x(c) - x(a) >= 10);
  const marks = [...powers.map((at) => ({ at })), ...(extra === undefined ? [] : [{ at: extra, text: grouped(extra), result: true }])];
  const end = hidden ? "?" : grouped(hi);
  return lineFigure({ lo: 0, hi, step: hi / b, labels, label: (v) => (hidden && v === hi ? "?" : grouped(v)), marks, jumps }, [
    `A number line from 0 to ${end} with the powers of ${b} marked; each jump multiplies by ${b}.`,
    `一条从 0 到 ${end} 的数轴，标出了 ${b} 的各次方；每跳一次就乘 ${b}。`,
  ]);
}

/** squareFigure draws a square of side b as an area model, split into tens and ones when b has both, with ? in each part. */
function squareFigure(b: number): Figure {
  const [tens, ones] = [b - (b % 10), b % 10];
  if (b < 10 || ones === 0) return areaGridFigure([String(b)], [String(b)], [["?"]]);
  return areaGridFigure(
    [String(tens), String(ones)],
    [String(tens), String(ones)],
    [
      ["?", "?"],
      ["?", "?"],
    ],
    [tens, ones],
    [tens, ones],
  );
}

/** powerAnswer asks for the value of bᵉ, multiplying one factor at a time. */
function powerAnswer(b: number, e: number): Problem {
  const v = b ** e;
  const run = Array.from({ length: e }, (_, i) => b ** (i + 1));
  const figure = e === 2 ? squareFigure(b) : v < 100000 ? growthLine(b, e, true) : undefined;
  return answered(
    [`Find $${powTex(String(b), e)}$.`, `计算 $${powTex(String(b), e)}$。`],
    v,
    [
      [
        ["Write it out", "写成连乘"],
        [`The base ${b} is used as a factor ${e} times.`, `底数 ${b} 作为因数用了 ${e} 次。`],
        [`${powTex(String(b), e)} = ${repeated(String(b), e)}`],
      ],
      [
        ["Multiply one factor at a time", "一次乘一个因数"],
        [`Each step multiplies by ${b}.`, `每一步都乘 ${b}。`],
        [run.map(big).join(",\\ ")],
      ],
    ],
    e === 2
      ? [`Divide back: $${big(v)} \\div ${b} = ${b}$, the other factor.`, `除回去：$${big(v)} \\div ${b} = ${b}$，正是另一个因数。`]
      : [
          `Divide back: $${big(v)} \\div ${b} = ${big(v / b)}$, which is $${powTex(String(b), e - 1)}$.`,
          `除回去：$${big(v)} \\div ${b} = ${big(v / b)}$，正是 $${powTex(String(b), e - 1)}$。`,
        ],
    [
      [b * e, `That multiplies ${b} by ${e} instead of using ${e} factors of ${b}.`, `这是用 ${b} 乘 ${e}，而不是 ${e} 个 ${b} 相乘。`],
      [b ** (e - 1), `That uses one factor of ${b} too few.`, `这少乘了一个 ${b}。`],
      b <= 6
        ? [e ** b, "That swaps the base and the exponent.", "这把底数和指数弄反了。"]
        : [v * b, `That uses one factor of ${b} too many.`, `这多乘了一个 ${b}。`],
    ],
    { figure },
  );
}

/** qPow is q raised to the whole-number power e. */
const qPow = (q: Q, e: number): Q => Array.from({ length: e }, () => q).reduce((s, f) => s.mul(f), Q.of(1));

/** takeChain is n, then a/b of it, then a/b of that, e times over, as a LaTeX chain. */
const takeChain = (n: number, a: number, b: number, e: number) =>
  Array.from({ length: e + 1 }, (_, i) => big((n * a ** i) / b ** i)).join(" \\to ");

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
    point(
      "evaluating-and-writing-powers-of-ten",
      ["Powers of ten and their values", "10 的乘方与它的值"],
      [
        "The power $10^4$ means four tens multiplied together: $10^4 = 10 \\times 10 \\times 10 \\times 10 = 10{,}000$. Four tens, so four zeros after the 1.\n\nCheck: multiply one ten at a time: $10 \\times 10 = 100$, $100 \\times 10 = 1{,}000$, $1{,}000 \\times 10 = 10{,}000$.\n\n> **Watch out.** $10^4$ is not $10 \\times 4 = 40$.",
        "乘方 $10^4$ 表示四个 10 相乘：$10^4 = 10 \\times 10 \\times 10 \\times 10 = 10{,}000$。四个 10，所以 1 后面有四个 0。\n\n检验：一次乘一个 10：$10 \\times 10 = 100$，$100 \\times 10 = 1{,}000$，$1{,}000 \\times 10 = 10{,}000$。\n\n> **注意。** $10^4$ 不是 $10 \\times 4 = 40$。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const kind = rng.int(0, 2);
        const value = big(pow10(k));
        const figure = k <= 6 ? digitsChart([pow10(k)]) : undefined;
        if (kind === 0)
          return answered(
            [`What is the value of $10^{${k}}$?`, `$10^{${k}}$ 的值是多少？`],
            pow10(k),
            [
              [
                ["Count the tens", "数 10 的个数"],
                [`The exponent ${k} means ${k} tens are multiplied.`, `指数 ${k} 表示 ${k} 个 10 相乘。`],
              ],
              [
                ["Write the zeros", "写 0"],
                [`Each 10 adds one zero, so write 1 and then ${k} zeros.`, `每乘一个 10 就多一个 0，所以写 1，后面跟 ${k} 个 0。`],
                [`10^{${k}} = ${value}`],
              ],
            ],
            [`Count the zeros in $${value}$: there are ${k}.`, `数一数 $${value}$ 中的 0：有 ${k} 个。`],
            [
              [10 * k, `That multiplies 10 by ${k}.`, `这是用 10 乘 ${k}。`],
              [pow10(k + 1), "That writes one zero too many.", "这多写了一个 0。"],
              [pow10(k - 1), "That writes one zero too few.", "这少写了一个 0。"],
            ],
          );
        const shown = kind === 1 ? repeated("10", k) : value;
        return answered(
          [`Find the exponent: $${shown} = 10^{\\square}$.`, `求指数：$${shown} = 10^{\\square}$。`],
          k,
          [
            kind === 1
              ? [
                  ["Count the tens", "数 10 的个数"],
                  [`There are ${k} factors of 10.`, `一共有 ${k} 个 10 相乘。`],
                ]
              : [
                  ["Count the zeros", "数 0 的个数"],
                  [`$${value}$ has ${k} zeros after the 1.`, `$${value}$ 的 1 后面有 ${k} 个 0。`],
                ],
            [["Write the exponent", "写出指数"], ["The exponent is that count.", "指数就是这个个数。"], [`${shown} = 10^{${k}}`]],
          ],
          kind === 1
            ? [
                `Write $10^{${k}}$ out: 1 with ${k} zeros is $${value}$, the same as the product of ${k} tens.`,
                `把 $10^{${k}}$ 写出来：1 后面跟 ${k} 个 0 是 $${value}$，和 ${k} 个 10 相乘一样。`,
              ]
            : k === 1
              ? ["A single 10 is 10 itself.", "一个 10 就是 10。"]
              : [`Multiply ${k} tens one by one: the last product is $${value}$.`, `把 ${k} 个 10 一个一个乘起来，最后的积是 $${value}$。`],
          [
            [
              k + 1,
              kind === 1 ? "That counts one ten too many." : "That counts the 1 as well as the zeros.",
              kind === 1 ? "这多数了一个 10。" : "这把 1 也数进去了。",
            ],
            [k - 1, "That counts one too few.", "这少数了一个。"],
            [pow10(k), "That is the value, not the exponent.", "这是值，不是指数。"],
          ],
          { figure },
        );
      },
      digitsChart([10, 100, 1000, 10000]),
    ),
    point(
      "comparing-powers-of-ten",
      ["How many times as large", "是几倍"],
      [
        "$10^5$ has 2 more tens than $10^3$, since $5 - 3 = 2$. So $10^5$ is $10^2 = 100$ times as large as $10^3$.\n\nCheck: $1{,}000 \\times 100 = 100{,}000$.\n\n> **Watch out.** The answer is 100, not 2. 2 only counts the extra tens.",
        "$10^5$ 比 $10^3$ 多 2 个 10，因为 $5 - 3 = 2$。所以 $10^5$ 是 $10^3$ 的 $10^2 = 100$ 倍。\n\n检验：$1{,}000 \\times 100 = 100{,}000$。\n\n> **注意。** 答案是 100，不是 2。2 只是多出来的 10 的个数。",
      ],
      (rng) => {
        const b = rng.int(1, 6);
        const a = rng.int(b + 1, 7);
        const times = pow10(a - b);
        return answered(
          rng.bool()
            ? [`$10^{${a}}$ is how many times as large as $10^{${b}}$?`, `$10^{${a}}$ 是 $10^{${b}}$ 的多少倍？`]
            : [`How many groups of $10^{${b}}$ make $10^{${a}}$?`, `$10^{${a}}$ 里有多少个 $10^{${b}}$？`],
          times,
          [
            [
              ["Count the extra tens", "数多出来的 10"],
              [`$10^{${a}}$ has ${a - b} more factor${a - b === 1 ? "" : "s"} of 10.`, `$10^{${a}}$ 多 ${a - b} 个因数 10。`],
              [`${a} - ${b} = ${a - b}`],
            ],
            [
              ["Multiply the extra tens", "把多出来的 10 乘起来"],
              [`${a - b} tens multiplied make $10^{${a - b}}$.`, `${a - b} 个 10 相乘是 $10^{${a - b}}$。`],
              [`10^{${a - b}} = ${big(times)}`],
            ],
          ],
          [`$${big(pow10(b))} \\times ${big(times)} = ${big(pow10(a))}$.`, `$${big(pow10(b))} \\times ${big(times)} = ${big(pow10(a))}$。`],
          [
            [a - b, "That counts the extra tens but does not multiply them.", "这只数了多出来的 10，没有把它们乘起来。"],
            [pow10(a) - pow10(b), "That is how much larger, not how many times as large.", "这是大多少，不是几倍。"],
            [pow10(a - b + 1), "That has one zero too many.", "这多了一个 0。"],
          ],
          { figure: digitsChart([pow10(a), pow10(b)]) },
        );
      },
      digitsChart([100000, 1000]),
    ),
  ],
  t(
    "A shop sells pencils in packs of 10. Ten packs make 100 pencils, and ten of those make 1,000. So $1{,}000 = 10 \\times 10 \\times 10$, which we write $10^3$. The small 3 is the exponent: it counts the tens.\n\nCheck: $10^3 = 1{,}000$ has 3 zeros after the 1, one for each 10.\n\nIn this lesson we write and read powers of ten.",
    "商店里的铅笔 10 支一盒。10 盒是 100 支，10 个 100 支是 1,000 支。所以 $1{,}000 = 10 \\times 10 \\times 10$，写作 $10^3$。右上角的 3 叫指数，表示有几个 10 相乘。\n\n检验：$10^3 = 1{,}000$，1 后面有 3 个 0，一个 10 对应一个 0。\n\n本课我们学习读写 10 的乘方。",
  ),
);

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
    point(
      "whole-number-times-a-power-of-ten",
      ["Finding the product", "求积"],
      [
        "$604 \\times 10^2$: $10^2 = 100$, so write 2 zeros after 604. The product is $60{,}400$.\n\nCheck: $60{,}400 \\div 100 = 604$.\n\n> **Watch out.** $10^2$ is 100, not 20. $604 \\times 20$ is a different product.",
        "$604 \\times 10^2$：$10^2 = 100$，所以在 604 后面添 2 个 0。积是 $60{,}400$。\n\n检验：$60{,}400 \\div 100 = 604$。\n\n> **注意。** $10^2$ 是 100，不是 20。$604 \\times 20$ 是另一个积。",
      ],
      (rng) => {
        const n = rng.int(2, 999);
        const k = rng.int(1, 5);
        const product = n * pow10(k);
        return answered(
          [`Find $${n} \\times 10^{${k}}$.`, `计算 $${n} \\times 10^{${k}}$。`],
          product,
          [
            [
              ["Find the power", "先算乘方"],
              [`$10^{${k}}$ is 1 with ${k} zero${k === 1 ? "" : "s"}.`, `$10^{${k}}$ 是 1 后面跟 ${k} 个 0。`],
              [`10^{${k}} = ${big(pow10(k))}`],
            ],
            [
              ["Write the zeros", "添 0"],
              [`Write ${k} zero${k === 1 ? "" : "s"} after ${n}.`, `在 ${n} 后面添 ${k} 个 0。`],
              [`${n} \\times 10^{${k}} = ${big(product)}`],
            ],
          ],
          [`Divide back: $${big(product)} \\div ${big(pow10(k))} = ${n}$.`, `除回去：$${big(product)} \\div ${big(pow10(k))} = ${n}$。`],
          [
            [n * 10 * k, `That uses 10 × ${k} instead of ${k} tens multiplied.`, `这是用 10 × ${k}，而不是 ${k} 个 10 相乘。`],
            [n * pow10(k + 1), "That writes one zero too many.", "这多写了一个 0。"],
            [n * pow10(k - 1), "That writes one zero too few.", "这少写了一个 0。"],
          ],
          { figure: product < 10000000 ? digitsChart([n, product]) : undefined },
        );
      },
      digitsChart([604, 60400]),
    ),
    point(
      "finding-the-exponent-in-a-product",
      ["Finding the exponent", "求指数"],
      [
        "$48 \\times 10^{\\square} = 480{,}000$: $480{,}000$ is 48 followed by 4 zeros, so the exponent is 4.\n\nCheck: $10^4 = 10{,}000$, and $48 \\times 10{,}000 = 480{,}000$.\n\n> **Watch out.** The answer is the exponent 4, not $10{,}000$.",
        "$48 \\times 10^{\\square} = 480{,}000$：$480{,}000$ 是 48 后面跟 4 个 0，所以指数是 4。\n\n检验：$10^4 = 10{,}000$，$48 \\times 10{,}000 = 480{,}000$。\n\n> **注意。** 答案是指数 4，不是 $10{,}000$。",
      ],
      (rng) => {
        const n = nonZeroEnd(rng, rng.int(1, 3));
        const k = rng.int(1, 6);
        const product = n * pow10(k);
        return answered(
          [
            `Find the exponent: $${n} \\times 10^{\\square} = ${big(product)}$.`,
            `求指数：$${n} \\times 10^{\\square} = ${big(product)}$。`,
          ],
          k,
          [
            [
              ["Compare with the start", "和原来的数比较"],
              [`$${big(product)}$ is ${n} followed by zeros.`, `$${big(product)}$ 是 ${n} 后面跟着一些 0。`],
            ],
            [
              ["Count the zeros", "数 0"],
              [`There are ${k} zero${k === 1 ? "" : "s"} after ${n}, one for each 10.`, `${n} 后面有 ${k} 个 0，一个 10 对应一个 0。`],
              [`${n} \\times 10^{${k}} = ${big(product)}`],
            ],
          ],
          [
            `Multiply out: $10^{${k}} = ${big(pow10(k))}$, and $${n} \\times ${big(pow10(k))} = ${big(product)}$.`,
            `乘出来：$10^{${k}} = ${big(pow10(k))}$，$${n} \\times ${big(pow10(k))} = ${big(product)}$。`,
          ],
          [
            [pow10(k), "That is the power of ten, not the exponent.", "这是 10 的乘方的值，不是指数。"],
            [k + 1, "That counts one zero too many.", "这多数了一个 0。"],
            [k - 1, "That counts one zero too few.", "这少数了一个 0。"],
          ],
          { figure: product < 10000000 ? digitsChart([n, product]) : undefined },
        );
      },
      digitsChart([48, 480000]),
    ),
  ],
  t(
    "A box holds 24 pencils, and a store has $10^3$ boxes. $10^3 = 1{,}000$, so the store has $24 \\times 10^3 = 24{,}000$ pencils: write 3 zeros after 24.\n\nCheck: $24{,}000 \\div 1{,}000 = 24$.\n\nIn this lesson we multiply whole numbers by powers of ten written with exponents.",
    "一盒有 24 支铅笔，商店里有 $10^3$ 盒。$10^3 = 1{,}000$，所以一共有 $24 \\times 10^3 = 24{,}000$ 支：在 24 后面添 3 个 0。\n\n检验：$24{,}000 \\div 1{,}000 = 24$。\n\n本课我们用整数乘写成乘方形式的 10 的乘方。",
  ),
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
    point(
      "decimal-times-a-power-of-ten-with-an-exponent",
      ["Finding the product", "求积"],
      [
        "$2.85 \\times 10^4$: move the point 4 places to the right. After the 8 and the 5 there are no digits left, so write two zeros: $28{,}500$.\n\nCheck: $2.85 \\times 100 = 285$, and $285 \\times 100 = 28{,}500$.\n\n> **Watch out.** Fill the empty places with zeros. Stopping at $285$ moves the point only 2 places.",
        "$2.85 \\times 10^4$：小数点向右移动 4 位。移过 8 和 5 后没有数字了，就添两个 0：$28{,}500$。\n\n检验：$2.85 \\times 100 = 285$，$285 \\times 100 = 28{,}500$。\n\n> **注意。** 空出的数位要补 0。停在 $285$ 只移动了 2 位。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const n = nonZeroEnd(rng, rng.int(Math.max(1, p - 1), p + 2));
        const k = rng.int(1, 5);
        const v = shifted(n, p, k);
        const shown = v.isInteger() ? big(Number(v.n)) : dq(v);
        const zeros = Math.max(0, k - p);
        return answered(
          [`Find $${fix(n, p)} \\times 10^{${k}}$.`, `计算 $${fix(n, p)} \\times 10^{${k}}$。`],
          v,
          [
            [
              ["How far", "移几位"],
              [
                `The exponent is ${k}, so the point moves ${k} place${k === 1 ? "" : "s"} to the right.`,
                `指数是 ${k}，所以小数点向右移动 ${k} 位。`,
              ],
            ],
            [
              ["Move the point", "移动小数点"],
              zeros > 0
                ? [
                    `There are only ${p} digit${p === 1 ? "" : "s"} after the point, so write ${zeros} zero${zeros === 1 ? "" : "s"} at the end.`,
                    `小数点后只有 ${p} 位数字，所以末尾添 ${zeros} 个 0。`,
                  ]
                : ["Count the places and write the point there.", "数好位数，点上小数点。"],
              [`${fix(n, p)} \\times 10^{${k}} = ${shown}`],
            ],
          ],
          [
            `Move the point back ${k} place${k === 1 ? "" : "s"} to the left: $${shown}$ becomes $${fix(n, p)}$ again.`,
            `把小数点向左移回 ${k} 位：$${shown}$ 又变回 $${fix(n, p)}$。`,
          ],
          [
            [v.mul(Q.of(10)), "That moves the point one place too far.", "小数点多移了一位。"],
            [v.mul(Q.of(1, 10)), "That moves the point one place too few.", "小数点少移了一位。"],
            [D(n, p).mul(Q.of(10 * k)), `That multiplies by 10 × ${k} instead of ${k} tens.`, `这是乘 10 × ${k}，而不是 ${k} 个 10 相乘。`],
          ],
          { form: "decimal", figure: v.toNumber() < 10000 ? shiftChart(n, p, k) : undefined },
        );
      },
      shiftChart(285, 2, 3),
    ),
    point(
      "finding-the-exponent-for-a-decimal",
      ["Finding the exponent", "求指数"],
      [
        "$0.072 \\times 10^{\\square} = 720$: the point moves past the 0, the 7, the 2 and one more place to reach $720$. That is 4 places, so the exponent is 4.\n\nCheck: $10^4 = 10{,}000$, and $0.072 \\times 10{,}000 = 720$.\n\n> **Watch out.** Count the places the point moved, not the zeros in 720: 1 is wrong.",
        "$0.072 \\times 10^{\\square} = 720$：小数点移过 0、7、2，再移一位，才得到 $720$。一共移了 4 位，所以指数是 4。\n\n检验：$10^4 = 10{,}000$，$0.072 \\times 10{,}000 = 720$。\n\n> **注意。** 要数小数点移动的位数，不是数 720 里的 0：1 是错的。",
      ],
      (rng) => {
        const p = rng.int(1, 3);
        const n = nonZeroEnd(rng, rng.int(Math.max(1, p - 1), p + 2));
        const k = rng.int(1, 5);
        const v = shifted(n, p, k);
        const shown = v.isInteger() ? big(Number(v.n)) : dq(v);
        const zeros = Math.max(0, k - p);
        return answered(
          [
            `Find the exponent: $${fix(n, p)} \\times 10^{\\square} = ${shown}$.`,
            `求指数：$${fix(n, p)} \\times 10^{\\square} = ${shown}$。`,
          ],
          k,
          [
            [
              ["Find the point", "找小数点"],
              [
                `Find where the point is in $${fix(n, p)}$ and where it is in $${shown}$.`,
                `找出 $${fix(n, p)}$ 和 $${shown}$ 中小数点的位置。`,
              ],
            ],
            [
              ["Count the places", "数位数"],
              [`The point moved ${k} place${k === 1 ? "" : "s"} to the right.`, `小数点向右移动了 ${k} 位。`],
              [`${fix(n, p)} \\times 10^{${k}} = ${shown}`],
            ],
          ],
          [
            `Multiply out: $10^{${k}} = ${big(pow10(k))}$, and $${fix(n, p)} \\times ${big(pow10(k))} = ${shown}$.`,
            `乘出来：$10^{${k}} = ${big(pow10(k))}$，$${fix(n, p)} \\times ${big(pow10(k))} = ${shown}$。`,
          ],
          [
            [k + 1, "That counts one place too many.", "这多数了一位。"],
            [k - 1, "That counts one place too few.", "这少数了一位。"],
            ...(zeros > 0 && zeros !== k ? [[zeros, "That counts only the zeros at the end.", "这只数了末尾的 0。"] as Miss] : []),
            [pow10(k), "That is the power of ten, not the exponent.", "这是 10 的乘方的值，不是指数。"],
          ],
          { figure: v.toNumber() < 10000 ? shiftChart(n, p, k) : undefined },
        );
      },
      shiftChart(72, 3, 4),
    ),
  ],
  t(
    "A grain of rice weighs about $0.02$ g. $10^3$ grains weigh $0.02 \\times 10^3$ g. The exponent 3 moves the point 3 places to the right: $20$ g.\n\nCheck: $0.02$ is 2 hundredths, and 2 hundredths $\\times 1{,}000 = 2{,}000$ hundredths $= 20$.\n\nIn this lesson we multiply decimals by powers of ten written with exponents.",
    "一粒米大约重 $0.02$ 克。$10^3$ 粒米重 $0.02 \\times 10^3$ 克。指数 3 让小数点向右移动 3 位：$20$ 克。\n\n检验：$0.02$ 是 2 个百分之一，2 个百分之一 $\\times 1{,}000 = 2{,}000$ 个百分之一 $= 20$。\n\n本课我们用小数乘写成乘方形式的 10 的乘方。",
  ),
);

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
    point(
      "writing-repeated-multiplication-as-a-power",
      ["Writing a product as a power", "把连乘写成乘方"],
      [
        "$7 \\times 7 \\times 7 = 7^3$: the base 7 is the number multiplied, and the exponent 3 counts the 7s.\n\nCheck: $7^3$ means three 7s multiplied, which is $7 \\times 7 \\times 7$ again.\n\n> **Watch out.** $7^3$ is not $7 \\times 3$. The exponent counts the factors; it is not a factor.",
        "$7 \\times 7 \\times 7 = 7^3$：底数 7 是相乘的数，指数 3 表示有几个 7。\n\n检验：$7^3$ 表示三个 7 相乘，正是 $7 \\times 7 \\times 7$。\n\n> **注意。** $7^3$ 不是 $7 \\times 3$。指数表示因数的个数，它本身不是因数。",
      ],
      (rng) => {
        const b = rng.int(2, 12);
        let e = rng.int(2, 6);
        if (e === b) e = b === 2 ? 3 : 2;
        const power = powTex(String(b), e);
        return pickedMath(
          rng,
          [`Which is equal to $${repeated(String(b), e)}$?`, `哪个等于 $${repeated(String(b), e)}$？`],
          power,
          [
            [powTex(String(e), b), "That swaps the base and the exponent.", "这把底数和指数弄反了。"],
            [`${b} \\times ${e}`, "That multiplies by the count instead of writing a power.", "这是乘个数，而不是写成乘方。"],
            [powTex(String(b), e + 1), `That counts one ${b} too many.`, `这多数了一个 ${b}。`],
          ],
          [
            [
              ["Find the base", "找底数"],
              [`The number multiplied is ${b}.`, `相乘的数是 ${b}。`],
            ],
            [
              ["Count the factors", "数因数"],
              [`${b} appears ${e} times.`, `${b} 出现了 ${e} 次。`],
              [`${repeated(String(b), e)} = ${power}`],
            ],
          ],
          [`Write $${power}$ out again: ${e} factors of ${b}.`, `把 $${power}$ 再写成连乘：${e} 个 ${b}。`],
          b ** e < 100000 ? growthLine(b, e) : undefined,
        );
      },
      growthLine(7, 3),
    ),
    point(
      "expanding-a-power",
      ["Writing a power as a product", "把乘方写成连乘"],
      [
        "$4^5 = 4 \\times 4 \\times 4 \\times 4 \\times 4$: write the base 4 five times, with × between.\n\nCheck: count the 4s. There are 5, the same as the exponent.\n\n> **Watch out.** $4^5$ is not $5 \\times 5 \\times 5 \\times 5$. The base is the number written; the exponent says how many times.",
        "$4^5 = 4 \\times 4 \\times 4 \\times 4 \\times 4$：把底数 4 写五次，中间用乘号连接。\n\n检验：数一数有几个 4。有 5 个，和指数一样。\n\n> **注意。** $4^5$ 不是 $5 \\times 5 \\times 5 \\times 5$。底数是要写的数，指数表示写几次。",
      ],
      (rng) => {
        const b = rng.int(2, 12);
        let e = rng.int(2, 6);
        if (e === b) e = b === 2 ? 3 : 2;
        const power = powTex(String(b), e);
        return pickedMath(
          rng,
          [`Which is equal to $${power}$?`, `哪个等于 $${power}$？`],
          repeated(String(b), e),
          [
            [`${b} \\times ${e}`, "That multiplies the base by the exponent.", "这是用底数乘指数。"],
            [repeated(String(e), b), "That swaps the base and the exponent.", "这把底数和指数弄反了。"],
            [Array(e).fill(String(b)).join(" + "), "That adds instead of multiplying.", "这是相加，不是相乘。"],
          ],
          [
            [
              ["Read the power", "读乘方"],
              [`The base is ${b} and the exponent is ${e}.`, `底数是 ${b}，指数是 ${e}。`],
            ],
            [
              ["Write it out", "写成连乘"],
              [`Write ${b} as a factor ${e} times.`, `把 ${b} 作为因数写 ${e} 次。`],
              [`${power} = ${repeated(String(b), e)}`],
            ],
          ],
          [`Count the ${b}s in the product: there are ${e}, the exponent.`, `数一数积里有几个 ${b}：有 ${e} 个，正是指数。`],
          b ** e < 100000 ? growthLine(b, e) : undefined,
        );
      },
      growthLine(4, 5),
    ),
  ],
  t(
    "A shelf has 3 boxes, each box holds 3 bags, and each bag holds 3 balls. There are $3 \\times 3 \\times 3$ balls. We write this as $3^3$: the 3 below is the base, and the small 3 is the exponent, which counts how many 3s are multiplied.\n\nCheck: $3 \\times 3 = 9$ bags, and $9 \\times 3 = 27$ balls, so $3^3 = 27$.\n\nIn this lesson we write repeated multiplication as a power, and a power as repeated multiplication.",
    "架子上有 3 个箱子，每个箱子装 3 个袋子，每个袋子装 3 个球。一共有 $3 \\times 3 \\times 3$ 个球，写作 $3^3$：下面的 3 叫底数，右上角的 3 叫指数，表示有几个 3 相乘。\n\n检验：$3 \\times 3 = 9$ 个袋子，$9 \\times 3 = 27$ 个球，所以 $3^3 = 27$。\n\n本课我们把连乘写成乘方，也把乘方写成连乘。",
  ),
);

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
    point(
      "evaluating-squares-and-cubes",
      ["Squares and cubes", "平方和立方"],
      [
        "A square multiplies a number by itself: $12^2 = 12 \\times 12 = 144$. A cube uses the number three times: $4^3 = 4 \\times 4 \\times 4$, so first $4 \\times 4 = 16$, then $16 \\times 4 = 64$.\n\nCheck: a 12 by 12 square splits into $10 \\times 12 + 2 \\times 12 = 120 + 24 = 144$.\n\n> **Watch out.** $4^3$ is not $4 \\times 3 = 12$.",
        "平方是一个数乘它自己：$12^2 = 12 \\times 12 = 144$。立方是三个同样的数相乘：$4^3 = 4 \\times 4 \\times 4$，先算 $4 \\times 4 = 16$，再算 $16 \\times 4 = 64$。\n\n检验：边长 12 的正方形可以分成 $10 \\times 12 + 2 \\times 12 = 120 + 24 = 144$。\n\n> **注意。** $4^3$ 不是 $4 \\times 3 = 12$。",
      ],
      (rng) => (rng.bool(0.65) ? powerAnswer(rng.int(2, 20), 2) : powerAnswer(rng.int(2, 10), 3)),
      areaGridFigure(["10", "2"], ["12"], [["120"], ["24"]], [10, 2]),
    ),
    point(
      "evaluating-small-powers",
      ["Other small powers", "其他较小的乘方"],
      [
        "$3^4 = 3 \\times 3 \\times 3 \\times 3$: 3, 9, 27, 81. A number to the first power is itself: $8^1 = 8$. And $1^6 = 1$, since 1 times 1 is always 1.\n\nCheck: $81 \\div 3 = 27$, $27 \\div 3 = 9$, $9 \\div 3 = 3$: back to one 3.\n\n> **Watch out.** $1^6$ is 1, not 6.",
        "$3^4 = 3 \\times 3 \\times 3 \\times 3$：3，9，27，81。一个数的 1 次方就是它本身：$8^1 = 8$。$1^6 = 1$，因为 1 乘 1 总是 1。\n\n检验：$81 \\div 3 = 27$，$27 \\div 3 = 9$，$9 \\div 3 = 3$：回到一个 3。\n\n> **注意。** $1^6$ 是 1，不是 6。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const b = rng.int(2, 5);
          return powerAnswer(b, rng.int(4, b === 2 ? 6 : 4));
        }
        if (kind === 1) {
          const b = rng.int(2, 20);
          return answered(
            [`Find $${b}^{1}$.`, `计算 $${b}^{1}$。`],
            b,
            [
              [
                ["Read the exponent", "读指数"],
                [`The exponent 1 means ${b} is used as a factor once.`, `指数 1 表示 ${b} 作为因数只用一次。`],
              ],
              [
                ["Nothing to multiply", "没有别的因数"],
                [`With one factor there is nothing to multiply it by, so the value is ${b}.`, `只有一个因数，不用再乘，所以值是 ${b}。`],
                [`${b}^{1} = ${b}`],
              ],
            ],
            [
              `Start from $${b}^{2} = ${b * b}$: dividing by ${b} once gives $${b}$.`,
              `从 $${b}^{2} = ${b * b}$ 出发：除以一次 ${b} 得 $${b}$。`,
            ],
            [
              [1, "That is the exponent, not the value.", "这是指数，不是值。"],
              [b * b, `That is $${b}^{2}$.`, `这是 $${b}^{2}$。`],
            ],
            { figure: growthLine(b, 1, true) },
          );
        }
        const e = rng.int(2, 9);
        return answered(
          [`Find $1^{${e}}$.`, `计算 $1^{${e}}$。`],
          1,
          [
            [["Write it out", "写成连乘"], [`The base 1 is used ${e} times.`, `底数 1 用了 ${e} 次。`], [`1^{${e}} = ${repeated("1", e)}`]],
            [["Multiply", "相乘"], ["1 times 1 is 1, again and again.", "1 乘 1 得 1，一直乘下去还是 1。"], [`1^{${e}} = 1`]],
          ],
          [`One factor fewer, $1^{${e - 1}}$, is 1 too, and $1 \\times 1 = 1$.`, `少一个因数的 $1^{${e - 1}}$ 也是 1，$1 \\times 1 = 1$。`],
          [
            [e, "That is the exponent, not the value.", "这是指数，不是值。"],
            [0, "Multiplying 1s never gives 0.", "1 连乘不会得 0。"],
          ],
          {
            figure: lineFigure({ lo: 0, hi: 2, step: 1, labels: [0, 2], marks: [{ at: 1, text: "?" }] }, [
              "A number line from 0 to 2 with one point marked.",
              "一条从 0 到 2 的数轴，标出了一个点。",
            ]),
          },
        );
      },
      growthLine(3, 4),
    ),
  ],
  t(
    "A square garden is 6 m on each side. Its area is $6 \\times 6 = 6^2 = 36$ square meters. That is why $6^2$ is read as 6 squared.\n\nCheck: 6 rows of 6 squares: $6 + 6 + 6 + 6 + 6 + 6 = 36$.\n\nIn this lesson we find the values of squares, cubes and other small powers.",
    "一块正方形菜地边长 6 米，面积是 $6 \\times 6 = 6^2 = 36$ 平方米。所以 $6^2$ 也叫 6 的平方。\n\n检验：6 行，每行 6 个方格：$6 + 6 + 6 + 6 + 6 + 6 = 36$。\n\n本课我们计算平方、立方和其他较小的乘方。",
  ),
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
    point(
      "evaluating-larger-powers-of-small-bases",
      ["Larger exponents", "较大的指数"],
      [
        "$2^8$: keep doubling and count the steps: 2, 4, 8, 16, 32, 64, 128, 256. Eight numbers for eight 2s, so $2^8 = 256$.\n\nCheck: split the eight 2s into two groups of four. Each group is 16, and $16 \\times 16 = 256$.\n\n> **Watch out.** Count the numbers you write. Stopping one step early gives $128$, which is $2^7$.",
        "$2^8$：不断乘 2 并数步数：2，4，8，16，32，64，128，256。八个 2 相乘，正好写出八个数，所以 $2^8 = 256$。\n\n检验：把八个 2 分成两组，每组四个。每组是 16，$16 \\times 16 = 256$。\n\n> **注意。** 要数清写了几个数。少乘一步会得到 $128$，那是 $2^7$。",
      ],
      (rng) => {
        const [b, e] = rng.pick(largePowers);
        return powerAnswer(b, e);
      },
      growthLine(2, 8),
    ),
    point(
      "evaluating-powers-of-two-digit-bases",
      ["Two-digit bases", "底数是两位数"],
      [
        "Write the base as many times as the exponent says, then multiply two numbers at a time: $25^2 = 25 \\times 25 = 625$, and $12^3 = 12 \\times 12 \\times 12 = 144 \\times 12 = 1{,}728$.\n\nCheck: split one 25 into 20 and 5: $20 \\times 25 + 5 \\times 25 = 500 + 125 = 625$.\n\n> **Watch out.** $25^2$ is not $25 \\times 2 = 50$.",
        "指数是几，就把底数写几遍，再两个两个地乘：$25^2 = 25 \\times 25 = 625$，$12^3 = 12 \\times 12 \\times 12 = 144 \\times 12 = 1{,}728$。\n\n检验：把一个 25 拆成 20 和 5：$20 \\times 25 + 5 \\times 25 = 500 + 125 = 625$。\n\n> **注意。** $25^2$ 不是 $25 \\times 2 = 50$。",
      ],
      (rng) => (rng.bool(0.7) ? powerAnswer(rng.int(11, 30), 2) : powerAnswer(rng.int(11, 15), 3)),
      areaGridFigure(
        ["20", "5"],
        ["20", "5"],
        [
          ["400", "100"],
          ["100", "25"],
        ],
        [20, 5],
        [20, 5],
      ),
    ),
  ],
  t(
    "A cell splits in two every hour, so the number of cells doubles. After 6 hours there are $2^6$ cells: 2, 4, 8, 16, 32, 64.\n\nCheck: halve 64 six times: 32, 16, 8, 4, 2, 1. Back to the one cell at the start.\n\nIn this lesson we find larger powers by multiplying one step at a time.",
    "一个细胞每小时分裂成两个，所以细胞数每小时翻一倍。6 小时后有 $2^6$ 个细胞：2，4，8，16，32，64。\n\n检验：把 64 连续除以 2 六次：32，16，8，4，2，1。回到最开始的一个细胞。\n\n本课我们一步一步地乘，计算较大的乘方。",
  ),
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
    point(
      "powers-of-fractions",
      ["Powers of fractions", "分数的乘方"],
      [
        "$\\left(\\frac{3}{4}\\right)^2 = \\frac{3}{4} \\times \\frac{3}{4} = \\frac{3 \\times 3}{4 \\times 4} = \\frac{9}{16}$.\n\nCheck: $\\frac{3}{4}$ of 16 is 12, and $\\frac{3}{4}$ of 12 is 9. So it is 9 parts out of 16.\n\n> **Watch out.** Raise the denominator too. Squaring only the top gives $\\frac{9}{4}$, which is more than 2.",
        "$\\left(\\frac{3}{4}\\right)^2 = \\frac{3}{4} \\times \\frac{3}{4} = \\frac{3 \\times 3}{4 \\times 4} = \\frac{9}{16}$。\n\n检验：16 的 $\\frac{3}{4}$ 是 12，12 的 $\\frac{3}{4}$ 是 9。所以是 16 份中的 9 份。\n\n> **注意。** 分母也要乘方。只把分子平方会得到 $\\frac{9}{4}$，比 2 还大。",
      ],
      (rng) => {
        for (;;) {
          const b = rng.int(2, 10);
          const a = rng.int(1, b - 1);
          const e = rng.int(2, b <= 5 ? 3 : 2);
          if (Q.of(a, b).d !== BigInt(b)) continue;
          const v = Q.of(a ** e, b ** e);
          const power = powTex(fr(a, b), e, true);
          return answered(
            [`Find $${power}$.`, `计算 $${power}$。`],
            v,
            [
              [
                ["Write it out", "写成连乘"],
                [`Use $${fr(a, b)}$ as a factor ${e} times.`, `把 $${fr(a, b)}$ 作为因数用 ${e} 次。`],
                [`${power} = ${repeated(fr(a, b), e)}`],
              ],
              [
                ["Multiply tops and bottoms", "分子乘分子，分母乘分母"],
                [`The numerator is $${a}^{${e}}$ and the denominator is $${b}^{${e}}$.`, `分子是 $${a}^{${e}}$，分母是 $${b}^{${e}}$。`],
                [`${power} = ${fr(`${a}^{${e}}`, `${b}^{${e}}`)} = ${v.toLatex()}`],
              ],
            ],
            [
              `Take $${fr(a, b)}$ of ${b ** e}, ${e} times over: $${takeChain(b ** e, a, b, e)}$. That is ${a ** e} parts out of ${b ** e}.`,
              `从 ${b ** e} 开始，连续取 ${e} 次 $${fr(a, b)}$：$${takeChain(b ** e, a, b, e)}$。正是 ${b ** e} 份中的 ${a ** e} 份。`,
            ],
            [
              [Q.of(a ** e, b), "That raises only the numerator.", "这只把分子乘方了。"],
              [Q.of(a * e, b * e), "That multiplies by the exponent instead of raising to the power.", "这是乘指数，不是乘方。"],
              [Q.of(a, b ** e), "That raises only the denominator.", "这只把分母乘方了。"],
            ],
            {
              form: "fraction",
              figure:
                b ** e <= 64
                  ? stripsFigure([
                      { parts: b, shaded: a, text: `${a}/${b}` },
                      { parts: b ** e, shaded: 0, text: "?" },
                    ])
                  : undefined,
            },
          );
        }
      },
      stripsFigure([
        { parts: 4, shaded: 3, text: "3/4" },
        { parts: 16, shaded: 9, text: "9/16" },
      ]),
    ),
    point(
      "products-with-powers-of-fractions",
      ["A whole number times a power of a fraction", "整数乘分数的乘方"],
      [
        "$18 \\times \\left(\\frac{1}{3}\\right)^2$: the power first, $\\left(\\frac{1}{3}\\right)^2 = \\frac{1}{9}$. Then $18 \\times \\frac{1}{9} = 18 \\div 9 = 2$.\n\nCheck: a third of 18 is 6, and a third of 6 is 2.\n\n> **Watch out.** Do the power before multiplying. $\\left(18 \\times \\frac{1}{3}\\right)^2 = 36$ is a different problem.",
        "$18 \\times \\left(\\frac{1}{3}\\right)^2$：先算乘方，$\\left(\\frac{1}{3}\\right)^2 = \\frac{1}{9}$。再算 $18 \\times \\frac{1}{9} = 18 \\div 9 = 2$。\n\n检验：18 的三分之一是 6，6 的三分之一是 2。\n\n> **注意。** 先算乘方，再算乘法。$\\left(18 \\times \\frac{1}{3}\\right)^2 = 36$ 是另一道题。",
      ],
      (rng) => {
        for (;;) {
          const b = rng.int(2, 6);
          const a = rng.int(1, b - 1);
          const e = rng.int(2, b <= 3 ? 3 : 2);
          if (Q.of(a, b).d !== BigInt(b)) continue;
          const n = rng.int(1, 6) * b ** e;
          const p = Q.of(a ** e, b ** e);
          const v = p.mul(Q.of(n));
          const power = powTex(fr(a, b), e, true);
          return answered(
            [`Find $${n} \\times ${power}$.`, `计算 $${n} \\times ${power}$。`],
            v,
            [
              [["The power first", "先算乘方"], ["Raise the top and the bottom.", "分子、分母分别乘方。"], [`${power} = ${p.toLatex()}`]],
              [
                ["Then multiply", "再相乘"],
                a ** e === 1
                  ? [`Multiplying by $${p.toLatex()}$ divides by ${b ** e}.`, `乘 $${p.toLatex()}$ 就是除以 ${b ** e}。`]
                  : [`Divide ${n} by ${b ** e}, then multiply by ${a ** e}.`, `用 ${n} 除以 ${b ** e}，再乘 ${a ** e}。`],
                [`${n} \\times ${p.toLatex()} = ${v.toLatex()}`],
              ],
            ],
            [
              `Take $${fr(a, b)}$ of ${n}, ${e} times over: $${takeChain(n, a, b, e)}$.`,
              `从 ${n} 开始，连续取 ${e} 次 $${fr(a, b)}$：$${takeChain(n, a, b, e)}$。`,
            ],
            [
              [qPow(Q.of(n * a, b), e), "That multiplies before raising to the power.", "这是先乘后乘方了。"],
              [Q.of(n * a * e, b), "That multiplies by the exponent instead of raising to the power.", "这是乘指数，不是乘方。"],
              [Q.of(n * a ** e, b), "That raises only the numerator.", "这只把分子乘方了。"],
            ],
            { form: "mixed", figure: b ** e <= 16 ? equalTape(b ** e, "?", String(n), a ** e) : undefined },
          );
        }
      },
      divTape("18", 9, "2"),
    ),
  ],
  t(
    "Half a cake is left, and you eat half of that. You eat $\\frac{1}{2} \\times \\frac{1}{2} = \\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4}$ of the cake.\n\nCheck: cut the cake into 4 equal pieces. Half the cake is 2 pieces, and half of that is 1 piece, $\\frac{1}{4}$.\n\nIn this lesson we find powers of fractions.",
    "剩下半个蛋糕，你吃了其中的一半。你吃了整个蛋糕的 $\\frac{1}{2} \\times \\frac{1}{2} = \\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4}$。\n\n检验：把蛋糕平均切成 4 块。半个蛋糕是 2 块，它的一半是 1 块，即 $\\frac{1}{4}$。\n\n本课我们计算分数的乘方。",
  ),
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
    point(
      "powers-of-decimals-less-than-one",
      ["Decimals less than 1", "小于 1 的小数"],
      [
        "$0.4^2 = 0.4 \\times 0.4$: $4 \\times 4 = 16$, and two factors with one place each give two places: $0.16$.\n\nCheck: $0.4$ is less than half, so $0.4$ of $0.4$ is less than half of $0.4$, which is $0.2$. $0.16$ fits.\n\n> **Watch out.** Count the places of every factor. $1.6$ has only one place.",
        "$0.4^2 = 0.4 \\times 0.4$：$4 \\times 4 = 16$，两个一位小数相乘，积有两位小数：$0.16$。\n\n检验：$0.4$ 不到一半，所以 $0.4$ 的 $0.4$ 倍比 $0.4$ 的一半（$0.2$）还小。$0.16$ 符合。\n\n> **注意。** 每个因数的小数位数都要数。$1.6$ 只有一位小数。",
      ],
      (rng) => {
        const p = rng.bool(0.7) ? 1 : 2;
        const n = rng.int(1, 9);
        const e = rng.int(2, p === 1 ? 3 : 2);
        const v = D(n ** e, p * e);
        const base = fix(n, p);
        const back = e === 2 ? base : dq(D(n ** (e - 1), p * (e - 1)));
        return answered(
          [`Find $${powTex(base, e)}$.`, `计算 $${powTex(base, e)}$。`],
          v,
          [
            [
              ["Multiply as whole numbers", "按整数相乘"],
              ["Leave out the point for now.", "先不看小数点。"],
              [`${powTex(String(n), e)} = ${n ** e}`],
            ],
            [
              ["Count the places", "数小数位数"],
              [
                `${e} factors with ${p} place${p === 1 ? "" : "s"} each give ${p * e} places.`,
                `${e} 个因数各有 ${p} 位小数，积有 ${p * e} 位小数。`,
              ],
              [`${powTex(base, e)} = ${dq(v)}`],
            ],
          ],
          [`Divide back: $${dq(v)} \\div ${base} = ${back}$.`, `除回去：$${dq(v)} \\div ${base} = ${back}$。`],
          [
            [D(n ** e, p), "That counts the places of only one factor.", "这只数了一个因数的小数位数。"],
            [D(n * e, p), "That multiplies by the exponent instead of raising to the power.", "这是乘指数，不是乘方。"],
            [D(n ** e, p * e - 1), "That has one decimal place too few.", "小数位数少了一位。"],
          ],
          { form: "decimal", figure: e === 2 ? productArea(base, base, "?") : undefined },
        );
      },
      productArea("0.4", "0.4", "0.16"),
    ),
    point(
      "powers-of-decimals-greater-than-one",
      ["Decimals greater than 1", "大于 1 的小数"],
      [
        "Multiply as if there were no point, then place it: $1.5^2 = 1.5 \\times 1.5$ and $15 \\times 15 = 225$. Each factor has one decimal place, so the answer has two: $2.25$.\n\nCheck: split $1.5$ into $1$ and $0.5$: $1 \\times 1.5 + 0.5 \\times 1.5 = 1.5 + 0.75 = 2.25$.\n\n> **Watch out.** $1.5^2$ is not $1.5 \\times 2 = 3$.",
        "先不看小数点去乘，再点上小数点：$1.5^2 = 1.5 \\times 1.5$，$15 \\times 15 = 225$。每个因数有一位小数，所以积有两位：$2.25$。\n\n检验：把 $1.5$ 拆成 $1$ 和 $0.5$：$1 \\times 1.5 + 0.5 \\times 1.5 = 1.5 + 0.75 = 2.25$。\n\n> **注意。** $1.5^2$ 不是 $1.5 \\times 2 = 3$。",
      ],
      (rng) => {
        const n = nonZeroEnd(rng, 2);
        const e = n <= 13 ? rng.int(2, 3) : 2;
        const v = D(n ** e, e);
        const base = fix(n, 1);
        const back = e === 2 ? base : dq(D(n ** (e - 1), e - 1));
        const [w, d] = [Math.floor(n / 10), n % 10];
        return answered(
          [`Find $${powTex(base, e)}$.`, `计算 $${powTex(base, e)}$。`],
          v,
          [
            [
              ["Multiply as whole numbers", "按整数相乘"],
              ["Leave out the point for now.", "先不看小数点。"],
              [`${powTex(String(n), e)} = ${big(n ** e)}`],
            ],
            [
              ["Count the places", "数小数位数"],
              [`${e} factors with one place each give ${e} places.`, `${e} 个一位小数相乘，积有 ${e} 位小数。`],
              [`${powTex(base, e)} = ${dq(v)}`],
            ],
          ],
          [`Divide back: $${dq(v)} \\div ${base} = ${back}$.`, `除回去：$${dq(v)} \\div ${base} = ${back}$。`],
          [
            [D(n ** e, 1), "That has only one decimal place.", "这只有一位小数。"],
            [D(n * e, 1), "That multiplies by the exponent instead of raising to the power.", "这是乘指数，不是乘方。"],
            [D(n ** e, e - 1), "That has one decimal place too few.", "小数位数少了一位。"],
          ],
          {
            form: "decimal",
            figure:
              e === 2
                ? areaGridFigure(
                    [String(w), fix(d, 1)],
                    [String(w), fix(d, 1)],
                    [
                      ["?", "?"],
                      ["?", "?"],
                    ],
                    [w * 10, d],
                    [w * 10, d],
                  )
                : undefined,
          },
        );
      },
      areaGridFigure(
        ["1", "0.5"],
        ["1", "0.5"],
        [
          ["1", "0.5"],
          ["0.5", "0.25"],
        ],
        [2, 1],
        [2, 1],
      ),
    ),
  ],
  t(
    "A square tile is $0.3$ m on each side. Its area is $0.3^2 = 0.3 \\times 0.3$. $3 \\times 3 = 9$, and two factors with one place each give two places: $0.09$ square meters.\n\nCheck: $0.3$ m is 30 cm, and $30 \\times 30 = 900$ square centimeters. A square meter is $10{,}000$ square centimeters, so 900 is $0.09$ of it.\n\nIn this lesson we find powers of decimals.",
    "一块正方形瓷砖边长 $0.3$ 米，面积是 $0.3^2 = 0.3 \\times 0.3$。$3 \\times 3 = 9$，两个一位小数相乘，积有两位小数：$0.09$ 平方米。\n\n检验：$0.3$ 米是 30 厘米，$30 \\times 30 = 900$ 平方厘米。1 平方米是 $10{,}000$ 平方厘米，所以 900 平方厘米是 $0.09$ 平方米。\n\n本课我们计算小数的乘方。",
  ),
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
    point(
      "comparing-two-powers",
      ["Comparing two powers", "比较两个乘方"],
      [
        "$3^4$ or $4^3$? $3^4 = 81$ and $4^3 = 64$, so $3^4 > 4^3$.\n\nCheck: on a number line, 81 is to the right of 64.\n\n> **Watch out.** The larger base does not always win. Here $4^3$ has the larger base but the smaller value.",
        "$3^4$ 和 $4^3$ 哪个大？$3^4 = 81$，$4^3 = 64$，所以 $3^4 > 4^3$。\n\n检验：在数轴上，81 在 64 的右边。\n\n> **注意。** 底数大的不一定大。这里 $4^3$ 底数大，值却小。",
      ],
      (rng) => {
        let [a, b, c, d] = [2, 3, 3, 2];
        if (rng.bool()) {
          a = rng.int(2, 6);
          b = rng.int(2, 6);
          if (a === b) b = a === 2 ? 5 : 2;
          [c, d] = [b, a];
        } else {
          [a, b, c, d] = [rng.int(2, 9), rng.int(2, 4), rng.int(2, 9), rng.int(2, 4)];
          if (a === c && b === d) c = a === 9 ? 8 : a + 1;
        }
        const [x, y] = [a ** b, c ** d];
        const [A, B] = [powTex(String(a), b), powTex(String(c), d)];
        const rel = Math.sign(x - y) + 1;
        return compared(
          A,
          B,
          rel,
          [
            [["Find the first value", "求第一个值"], [`Multiply ${b} factors of ${a}.`, `${b} 个 ${a} 相乘。`], [`${A} = ${big(x)}`]],
            [["Find the second value", "求第二个值"], [`Multiply ${d} factors of ${c}.`, `${d} 个 ${c} 相乘。`], [`${B} = ${big(y)}`]],
          ],
          rel === 1
            ? [`The two values are both ${grouped(x)}: the same point on a number line.`, `两个值都是 ${grouped(x)}：在数轴上是同一个点。`]
            : [
                `On a number line, ${grouped(Math.max(x, y))} is to the right of ${grouped(Math.min(x, y))}.`,
                `在数轴上，${grouped(Math.max(x, y))} 在 ${grouped(Math.min(x, y))} 的右边。`,
              ],
          [
            [`$${A}$ is not less: ${grouped(x)} is not less than ${grouped(y)}.`, `$${A}$ 并不小：${grouped(x)} 不小于 ${grouped(y)}。`],
            [
              `$${A}$ and $${B}$ are not equal: ${grouped(x)} and ${grouped(y)} are different.`,
              `$${A}$ 和 $${B}$ 不相等：${grouped(x)} 和 ${grouped(y)} 不同。`,
            ],
            [
              `$${A}$ is not greater: ${grouped(x)} is not greater than ${grouped(y)}.`,
              `$${A}$ 并不大：${grouped(x)} 不大于 ${grouped(y)}。`,
            ],
          ],
        );
      },
      lineFigure(
        {
          lo: 0,
          hi: 90,
          step: 10,
          labels: [0, 30, 60, 90],
          marks: [
            { at: 64, text: "4³" },
            { at: 81, text: "3⁴" },
          ],
        },
        ["A number line from 0 to 90 with 4³ and 3⁴ marked; 3⁴ is further right.", "一条从 0 到 90 的数轴，标出了 4³ 和 3⁴；3⁴ 在更右边。"],
      ),
    ),
    point(
      "greatest-of-several-powers",
      ["The greatest power", "最大的乘方"],
      [
        "Of $4^3$, $2^5$ and $3^3$: the values are 64, 32 and 27, so $4^3$ is the greatest.\n\nCheck: $64 - 32 = 32$ and $64 - 27 = 37$, both more than 0.\n\n> **Watch out.** The largest exponent does not decide it. $2^5$ has the largest exponent, but $4^3$ is greater.",
        "$4^3$、$2^5$、$3^3$ 的值是 64、32、27，所以 $4^3$ 最大。\n\n检验：$64 - 32 = 32$，$64 - 27 = 37$，都比 0 大。\n\n> **注意。** 指数最大的不一定最大。$2^5$ 的指数最大，但 $4^3$ 更大。",
      ],
      (rng) => {
        for (;;) {
          const ps: [number, number][] = [0, 1, 2].map(() => [rng.int(2, 9), rng.int(2, 4)]);
          const vals = ps.map(([b, e]) => b ** e);
          const max = Math.max(...vals);
          if (vals.filter((v) => v === max).length !== 1 || new Set(vals).size < 3) continue;
          const texts = ps.map(([b, e]) => powTex(String(b), e));
          const k = vals.indexOf(max);
          return pickedMath(
            rng,
            [`Which is the greatest: ${texts.map((s) => `$${s}$`).join(", ")}?`, `哪个最大：${texts.map((s) => `$${s}$`).join("、")}？`],
            texts[k] ?? "",
            texts
              .map(
                (s, i): MathWrong => [
                  s,
                  `$${s} = ${big(vals[i] ?? 0)}$, less than ${grouped(max)}.`,
                  `$${s} = ${big(vals[i] ?? 0)}$，比 ${grouped(max)} 小。`,
                ],
              )
              .filter((_, i) => i !== k),
            [
              [
                ["Find each value", "求出每个值"],
                ["Multiply out each power.", "把每个乘方算出来。"],
                texts.map((s, i) => `${s} = ${big(vals[i] ?? 0)}`),
              ],
              [
                ["Pick the greatest", "找出最大的"],
                [`${grouped(max)} is the greatest value.`, `${grouped(max)} 是最大的值。`],
              ],
            ],
            [
              `${grouped(max)} minus each other value is more than 0: ${vals
                .filter((v) => v !== max)
                .map((v) => `$${big(max)} - ${big(v)} = ${big(max - v)}$`)
                .join(", ")}.`,
              `${grouped(max)} 减去其他的值都比 0 大：${vals
                .filter((v) => v !== max)
                .map((v) => `$${big(max)} - ${big(v)} = ${big(max - v)}$`)
                .join("，")}。`,
            ],
          );
        }
      },
      lineFigure(
        {
          lo: 0,
          hi: 70,
          step: 10,
          labels: [0, 20, 40, 60],
          marks: [
            { at: 27, text: "3³" },
            { at: 32, text: "2⁵" },
            { at: 64, text: "4³" },
          ],
        },
        [
          "A number line from 0 to 70 with 3³, 2⁵ and 4³ marked; 4³ is furthest right.",
          "一条从 0 到 70 的数轴，标出了 3³、2⁵ 和 4³；4³ 在最右边。",
        ],
      ),
    ),
  ],
  t(
    "Mia says $2^5$ is larger; Leo says $5^2$ is. Work both out: $2^5 = 32$ and $5^2 = 25$. Mia is right: $2^5 > 5^2$.\n\nCheck: $32 - 25 = 7$, more than 0.\n\nIn this lesson we compare powers by finding their values.",
    "小美说 $2^5$ 大，小乐说 $5^2$ 大。都算出来：$2^5 = 32$，$5^2 = 25$。小美说得对：$2^5 > 5^2$。\n\n检验：$32 - 25 = 7$，比 0 大。\n\n本课我们先求出乘方的值，再比较大小。",
  ),
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
    point(
      "exponents-in-the-order-of-operations",
      ["Exponents before multiplying", "先算乘方"],
      [
        "$40 - 3^2 \\times 4$: first $3^2 = 9$, then $9 \\times 4 = 36$, then $40 - 36 = 4$.\n\nCheck: $3^2 \\times 4$ is four 9s, $9 + 9 + 9 + 9 = 36$, and $36 + 4 = 40$.\n\n> **Watch out.** Do not start with $40 - 3$. The exponent and the multiplication come before the subtraction.",
        "$40 - 3^2 \\times 4$：先算 $3^2 = 9$，再算 $9 \\times 4 = 36$，最后 $40 - 36 = 4$。\n\n检验：$3^2 \\times 4$ 是四个 9，$9 + 9 + 9 + 9 = 36$，$36 + 4 = 40$。\n\n> **注意。** 不能先算 $40 - 3$。乘方和乘法都在减法之前。",
      ],
      (rng) => {
        const b = rng.int(2, 6);
        const e = rng.int(2, b <= 3 ? 4 : 2);
        const c = rng.int(2, 9);
        const p = b ** e;
        const add = rng.bool();
        const a = add ? rng.int(1, 50) : p * c + rng.int(1, 50);
        const v = add ? a + p * c : a - p * c;
        const op = add ? "+" : "-";
        const power = powTex(String(b), e);
        return answered(
          [`Find $${a} ${op} ${power} \\times ${c}$.`, `计算 $${a} ${op} ${power} \\times ${c}$。`],
          v,
          [
            [["The exponent", "先算乘方"], [`$${power}$ comes first.`, `先算 $${power}$。`], [`${power} = ${p}`]],
            [
              ["Then multiply", "再算乘法"],
              ["Multiplication comes before addition and subtraction.", "乘法在加减之前。"],
              [`${p} \\times ${c} = ${p * c}`],
            ],
            [
              [add ? "Then add" : "Then subtract", add ? "最后相加" : "最后相减"],
              ["Now only one step is left.", "只剩最后一步。"],
              [`${a} ${op} ${p * c} = ${v}`],
            ],
          ],
          add
            ? [`Subtract back: $${v} - ${p * c} = ${a}$.`, `减回去：$${v} - ${p * c} = ${a}$。`]
            : [`Add back: $${v} + ${p * c} = ${a}$.`, `加回去：$${v} + ${p * c} = ${a}$。`],
          [
            [add ? a + b * e * c : a - b * e * c, `That uses ${b} × ${e} for the power.`, `这把乘方算成了 ${b} × ${e}。`],
            [
              add ? (a + p) * c : (a - p) * c,
              `That ${add ? "adds" : "subtracts"} before multiplying.`,
              `这是先${add ? "加" : "减"}后乘了。`,
            ],
          ],
          {
            figure: tapeFigure(
              add
                ? [
                    {
                      total: "?",
                      pieces: [
                        { size: a, text: String(a) },
                        { size: p * c, text: `${p} × ${c}`, lit: true },
                      ],
                    },
                  ]
                : [
                    {
                      total: String(a),
                      pieces: [
                        { size: p * c, text: `${p} × ${c}`, lit: true },
                        { size: v, text: "?" },
                      ],
                    },
                  ],
              add
                ? [`A bar made of ${a} and ${p} × ${c}, with the whole unknown.`, `一个长条由 ${a} 和 ${p} × ${c} 组成，总数未知。`]
                : [`A bar for ${a} made of ${p} × ${c} and an unknown part.`, `一个表示 ${a} 的长条，由 ${p} × ${c} 和未知的一段组成。`],
            ),
          },
        );
      },
      tapeFigure(
        [
          {
            total: "40",
            pieces: [
              { size: 36, text: "3² × 4 = 36", lit: true },
              { size: 4, text: "4" },
            ],
          },
        ],
        ["A bar for 40 made of 3² × 4 = 36 and 4.", "一个表示 40 的长条，由 3² × 4 = 36 和 4 组成。"],
      ),
    ),
    point(
      "exponents-with-parentheses",
      ["Parentheses and exponents", "括号与乘方"],
      [
        "$(4 + 2)^2 + 10$: parentheses first, $4 + 2 = 6$; then $6^2 = 36$; then $36 + 10 = 46$.\n\nCheck: a square with side $4 + 2$ splits into $16 + 8 + 8 + 4 = 36$, and $36 + 10 = 46$.\n\n> **Watch out.** Do not square 4 and 2 on their own: $16 + 4 = 20$ leaves out the two 8s.",
        "$(4 + 2)^2 + 10$：先算括号，$4 + 2 = 6$；再算 $6^2 = 36$；最后 $36 + 10 = 46$。\n\n检验：边长为 $4 + 2$ 的正方形可以分成 $16 + 8 + 8 + 4 = 36$，$36 + 10 = 46$。\n\n> **注意。** 不能把 4 和 2 分别平方：$16 + 4 = 20$ 漏掉了两个 8。",
      ],
      (rng) => {
        const x = rng.int(1, 6);
        const y = rng.int(1, 6);
        const e = x + y <= 5 ? rng.int(2, 3) : 2;
        const c = rng.int(1, 30);
        const s = (x + y) ** e;
        const v = s + c;
        return answered(
          [`Find $(${x} + ${y})^{${e}} + ${c}$.`, `计算 $(${x} + ${y})^{${e}} + ${c}$。`],
          v,
          [
            [["Parentheses first", "先算括号"], ["Add inside the parentheses.", "先把括号里的加起来。"], [`${x} + ${y} = ${x + y}`]],
            [
              ["Then the exponent", "再算乘方"],
              [`The exponent applies to the whole ${x + y}.`, `指数作用于整个 ${x + y}。`],
              [`${powTex(String(x + y), e)} = ${s}`],
            ],
            [["Then add", "最后相加"], ["Add the last number.", "加上最后的数。"], [`${s} + ${c} = ${v}`]],
          ],
          e === 2
            ? [
                `Split the square of side $${x} + ${y}$: $${x * x} + ${x * y} + ${x * y} + ${y * y} = ${s}$, and $${s} + ${c} = ${v}$.`,
                `把边长为 $${x} + ${y}$ 的正方形分开：$${x * x} + ${x * y} + ${x * y} + ${y * y} = ${s}$，$${s} + ${c} = ${v}$。`,
              ]
            : [
                `Subtract back: $${v} - ${c} = ${s}$, and $${s} \\div ${x + y} \\div ${x + y} \\div ${x + y} = 1$.`,
                `减回去：$${v} - ${c} = ${s}$，$${s} \\div ${x + y} \\div ${x + y} \\div ${x + y} = 1$。`,
              ],
          [
            [x ** e + y ** e + c, "That raises each number on its own instead of the sum.", "这是把两个数分别乘方，而不是把和乘方。"],
            [x + y ** e + c, `That raises only ${y}.`, `这只把 ${y} 乘方了。`],
            [(x + y) * e + c, "That multiplies by the exponent instead of raising to the power.", "这是乘指数，不是乘方。"],
          ],
          {
            figure:
              e === 2
                ? areaGridFigure(
                    [String(x), String(y)],
                    [String(x), String(y)],
                    [
                      ["?", "?"],
                      ["?", "?"],
                    ],
                    [x, y],
                    [x, y],
                  )
                : undefined,
          },
        );
      },
      areaGridFigure(
        ["4", "2"],
        ["4", "2"],
        [
          ["16", "8"],
          ["8", "4"],
        ],
        [4, 2],
        [4, 2],
      ),
    ),
  ],
  t(
    "Lily has 5 stickers and buys 3 sheets with $2^3$ stickers on each. She has $5 + 2^3 \\times 3 = 5 + 8 \\times 3 = 5 + 24 = 29$ stickers.\n\nCheck: count by sheets: 8, 16, 24, then the 5 she had: 29.\n\nIn this lesson we work in order: parentheses, then exponents, then multiplication and division, then addition and subtraction.",
    "莉莉有 5 张贴纸，又买了 3 版，每版 $2^3$ 张。她一共有 $5 + 2^3 \\times 3 = 5 + 8 \\times 3 = 5 + 24 = 29$ 张。\n\n检验：一版一版地数：8，16，24，再加上原来的 5 张：29。\n\n本课我们按顺序计算：先算括号，再算乘方，然后算乘除，最后算加减。",
  ),
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

/** howManyTimesAsLargeADigitIs compares the values of one digit written twice in the same decimal. */
export const howManyTimesAsLargeADigitIs = point(
  "how-many-times-as-large-a-digit-is",
  ["How many times as large a digit is", "同一数字的值相差多少倍"],
  [
    "In $5.55$ the first 5 is worth 5 and the last 5 is worth $0.05$. It is 2 places further left, so it is $10 \\times 10 = 100$ times as large.\n\nCheck: $0.05 \\times 100 = 5$.\n\n> **Watch out.** The decimal point does not change the rule. Each place to the left is still 10 times.",
    "在 $5.55$ 中，第一个 5 表示 5，最后一个 5 表示 $0.05$。它往左多 2 位，所以是 $10 \\times 10 = 100$ 倍。\n\n检验：$0.05 \\times 100 = 5$。\n\n> **注意。** 隔着小数点，规律也不变。每往左一位还是 10 倍。",
  ],
  (rng) => {
    const d = rng.int(1, 9);
    const i = rng.int(-1, 1);
    const j = rng.int(i + 1, 3);
    const n = sameDigitTwice(rng, d, i, j);
    const times = pow10(j - i);
    const [va, vb] = [dq(D(d, 0).mul(placeValue(i))), dq(D(d, 0).mul(placeValue(j)))];
    return answered(
      [
        `In $${fix(n, 3)}$, the ${d} in the ${placeName(i).en} place is worth how many times the ${d} in the ${placeName(j).en} place?`,
        `在 $${fix(n, 3)}$ 中，${placeName(i)["zh-CN"]}上的 ${d} 表示的值是${placeName(j)["zh-CN"]}上的 ${d} 的多少倍？`,
      ],
      times,
      [
        [
          ["Find both values", "求两个值"],
          [`They are worth $${va}$ and $${vb}$.`, `它们分别表示 $${va}$ 和 $${vb}$。`],
        ],
        [
          ["Count the places", "数相差几位"],
          [`The first is ${j - i} place${j - i === 1 ? "" : "s"} further left.`, `第一个往左多 ${j - i} 位。`],
          [
            `${Array(j - i)
              .fill("10")
              .join(" \\times ")} = ${times}`,
          ],
        ],
      ],
      [`Multiply back: $${vb} \\times ${times} = ${va}$.`, `乘回去：$${vb} \\times ${times} = ${va}$。`],
      [
        [j - i, "That counts the places, but each place is 10 times.", "这只数了相差几位，每一位是 10 倍。"],
        [times * 10, "That is one place too many.", "这多算了一位。"],
        [times / 10, "That is one place too few.", "这少算了一位。"],
      ],
      { figure: decimalChart([[n, 3]], -1, 3) },
    );
  },
  decimalChart([[555, 2]], 0, 2),
);

/** aDigitTenTimesAsGreat finds what a digit is worth after it moves one or two places. */
export const aDigitTenTimesAsGreat = point(
  "how-many-times-as-great-a-decimal-digit-is",
  ["How many times as great a decimal digit is", "小数中一个数字的值是另一个的多少倍"],
  [
    "A 4 worth $0.04$ moves one place left. Now it is worth $0.04 \\times 10 = 0.4$.\n\nCheck: $0.4 \\div 10 = 0.04$.\n\n> **Watch out.** One place left is 10 times, two places left is 100 times. Moving right makes the value smaller.",
    "一个表示 $0.04$ 的 4 往左移一位，就表示 $0.04 \\times 10 = 0.4$。\n\n检验：$0.4 \\div 10 = 0.04$。\n\n> **注意。** 往左移一位是 10 倍，移两位是 100 倍。往右移，值会变小。",
  ],
  (rng) => {
    const d = rng.int(1, 9);
    const k = rng.int(1, 3);
    const s = rng.pick([-2, -1, 1].filter((m) => k + m >= -1 && k + m <= 3));
    const j = k + s;
    const v = D(d, k);
    const w = D(d, 0).mul(placeValue(j));
    const left = s < 0;
    const f = pow10(Math.abs(s));
    return answered(
      [
        `A ${d} in the ${placeName(k).en} place is worth $${dq(v)}$. What is a ${d} worth ${Math.abs(s)} place${Math.abs(s) === 1 ? "" : "s"} to its ${left ? "left" : "right"}?`,
        `${placeName(k)["zh-CN"]}上的 ${d} 表示 $${dq(v)}$。在它${left ? "左" : "右"}边 ${Math.abs(s)} 位的 ${d} 表示多少？`,
      ],
      w,
      [
        [
          ["Times or divide", "乘还是除"],
          [
            left
              ? `Each place to the left is 10 times, so ${Math.abs(s)} place${Math.abs(s) === 1 ? "" : "s"} is ${f} times.`
              : "One place to the right is a tenth as much.",
            left ? `往左每一位是 10 倍，${Math.abs(s)} 位是 ${f} 倍。` : "往右一位是原来的十分之一。",
          ],
        ],
        [
          ["Work it out", "算出来"],
          [`The ${d} is now in the ${placeName(j).en} place.`, `这个 ${d} 现在在${placeName(j)["zh-CN"]}上。`],
          [left ? `${dq(v)} \\times ${f} = ${dq(w)}` : `${dq(v)} \\div 10 = ${dq(w)}`],
        ],
      ],
      [
        left ? `Divide back: $${dq(w)} \\div ${f} = ${dq(v)}$.` : `Multiply back: $${dq(w)} \\times 10 = ${dq(v)}$.`,
        left ? `除回去：$${dq(w)} \\div ${f} = ${dq(v)}$。` : `乘回去：$${dq(w)} \\times 10 = ${dq(v)}$。`,
      ],
      [
        [D(d, 0).mul(placeValue(k - s)), "That moves the digit the wrong way.", "这把数字往反方向移了。"],
        [v, "That is the value before it moves.", "这是移动之前的值。"],
        [D(d, 0).mul(placeValue(j + (left ? -1 : 1))), "That moves one place too far.", "这多移了一位。"],
      ],
      { form: "decimal", figure: decimalChart([[d, k], j >= 0 ? [d, j] : [d * 10, 0]], Math.min(0, j), 3, j) },
    );
  },
  decimalChart(
    [
      [4, 2],
      [4, 1],
    ],
    0,
    2,
    1,
  ),
);

/** writingDecimalsWithZerosFromWords writes a decimal from words that need zeros held in places after the point. */
export const writingDecimalsWithZerosFromWords = point(
  "and-marks-the-point",
  ["The word and marks the point", "“又”标出小数点"],
  [
    "Twelve and six thousandths is $12.006$. The word and is the point, and thousandths means three places, so zeros hold the tenths and hundredths.\n\nCheck: in $12.006$ the 6 is in the third place after the point.\n\n> **Watch out.** Fill the empty places with zeros. $12.6$ would be twelve and six tenths.",
    "英语读法里的 and 就是小数点。中文读作十二点零零六的数是 $12.006$：“点”就是小数点，读到的“零”都要写出来。\n\n检验：在 $12.006$ 中，6 在小数点后第三位。\n\n> **注意。** 空着的数位要写 0。$12.6$ 是十二点六。",
  ],
  (rng) => {
    const p = rng.int(2, 3);
    const w = rng.int(1, 99);
    const part = rng.int(1, pow10(p - 1) - 1);
    const n = w * pow10(p) + part;
    const words = decimalWords(n, p);
    const short = Number(`${w}${part}`);
    const shortP = String(part).length;
    return answered(
      [`Write as a decimal: ${words.en}.`, `把下面的读法写成小数：${words["zh-CN"]}。`],
      D(n, p),
      [
        [
          ["Find the point", "找小数点"],
          [`The word "and" marks the point. Before it: ${w}.`, `“点”前面是整数部分：${w}。`],
        ],
        [
          ["Fill the places", "填数位"],
          [
            `The last word is ${placeName(p).en}, so use ${p} places and fill the gaps with zeros.`,
            `“点”后面的每个字都占一位，“零”写成 0。`,
          ],
          [fix(n, p)],
        ],
      ],
      [`Read $${fix(n, p)}$ aloud: ${words.en}.`, `把 $${fix(n, p)}$ 读出来：${words["zh-CN"]}。`],
      [
        [D(short, shortP), "That leaves out the zeros that hold the empty places.", "这里漏掉了占位的 0。"],
        [D(n, p + 1), "That uses one place too many.", "这多写了一位。"],
      ],
      { form: "decimal", figure: decimalChart([[n, p]], -1, 3, p) },
    );
  },
  decimalChart([[12006, 3]], -1, 3, 3),
);

/** aMissingTermOfAnExpandedDecimal finds the term an expanded form of a decimal leaves out. */
export const aMissingTermOfAnExpandedDecimal = point(
  "a-missing-term-of-an-expanded-decimal",
  ["A missing term of an expanded decimal", "小数展开式中缺少的项"],
  [
    "$4.375 = 4 + 0.3 + \\square + 0.005$. The missing place is the hundredths, which holds a 7, so $\\square = 0.07$.\n\nCheck: $4 + 0.3 + 0.07 + 0.005 = 4.375$.\n\n> **Watch out.** Write the digit at its value. The missing term is $0.07$, not 7.",
    "$4.375 = 4 + 0.3 + \\square + 0.005$。缺的是百分位，那一位是 7，所以 $\\square = 0.07$。\n\n检验：$4 + 0.3 + 0.07 + 0.005 = 4.375$。\n\n> **注意。** 要写出数字表示的值。缺的项是 $0.07$，不是 7。",
  ],
  (rng) => {
    let n = rng.int(1, 9) * 1000;
    for (let k = 1; k <= 3; k++) n += rng.int(1, 9) * pow10(3 - k);
    const k = rng.int(1, 3);
    const d = digitAtPlace(n, 3, k);
    const terms = [0, 1, 2, 3].map((j) => (j === k ? "\\square" : dq(D(digitAtPlace(n, 3, j), j))));
    return answered(
      [`Find the missing term: $${fix(n, 3)} = ${terms.join(" + ")}$.`, `求缺少的项：$${fix(n, 3)} = ${terms.join(" + ")}$。`],
      D(d, k),
      [
        [
          ["Find the missing place", "找缺少的数位"],
          [`The terms skip the ${placeName(k).en}.`, `展开式里缺的是${placeName(k)["zh-CN"]}。`],
        ],
        [
          ["Read the digit", "读出这一位"],
          [`$${fix(n, 3)}$ has a ${d} there, worth ${d} ${placeName(k).en}.`, `$${fix(n, 3)}$ 这一位是 ${d}，表示 ${d} 个${unitZh(k)}。`],
          [`\\square = ${dq(D(d, k))}`],
        ],
      ],
      [`Add all four terms: they make $${fix(n, 3)}$.`, `把四项加起来，正好是 $${fix(n, 3)}$。`],
      [
        [d, "That is the digit, not what it is worth.", "这是数字本身，不是它表示的值。"],
        [D(d, k - 1), "That is one place too far left.", "这往左多移了一位。"],
        [D(d, k + 1), "That is one place too far right.", "这往右多移了一位。"],
      ],
      { form: "decimal", figure: decimalChart([[n, 3]], 0, 3, k) },
    );
  },
  decimalChart([[4375, 3]], 0, 3, 2),
);

/** regroupingTenthsInAnExpandedForm writes a decimal from an expanded form with ten or more tenths. */
export const regroupingTenthsInAnExpandedForm = point(
  "regrouping-tenths-in-an-expanded-form",
  ["Regrouping tenths", "把十分之几重新组合"],
  [
    "$3 + 14 \\times 0.1 + 5 \\times 0.01$. 14 tenths is 1 whole and 4 tenths, so the sum is $4 + 0.4 + 0.05 = 4.45$.\n\nCheck: $14 \\times 0.1 = 1.4$ and $3 + 1.4 + 0.05 = 4.45$.\n\n> **Watch out.** 14 cannot sit in one place. Writing $3.145$ puts the 1 in the wrong place.",
    "$3 + 14 \\times 0.1 + 5 \\times 0.01$。14 个十分之一是 1 个一和 4 个十分之一，所以和是 $4 + 0.4 + 0.05 = 4.45$。\n\n检验：$14 \\times 0.1 = 1.4$，$3 + 1.4 + 0.05 = 4.45$。\n\n> **注意。** 一个数位上放不下 14。写成 $3.145$ 就把 1 放错了位置。",
  ],
  (rng) => {
    const w = rng.int(1, 9);
    const tenths = rng.int(11, 19);
    const h = rng.int(1, 9);
    const n = w * 100 + tenths * 10 + h;
    return answered(
      [
        `Write as one decimal: $${w} + ${tenths} \\times 0.1 + ${h} \\times 0.01$.`,
        `写成一个小数：$${w} + ${tenths} \\times 0.1 + ${h} \\times 0.01$。`,
      ],
      D(n, 2),
      [
        [
          ["Trade ten tenths", "十个十分之一换成一"],
          [`${tenths} tenths is 1 whole and ${tenths - 10} tenths.`, `${tenths} 个十分之一是 1 个一和 ${tenths - 10} 个十分之一。`],
          [`${tenths} \\times 0.1 = ${fix(tenths, 1)}`],
        ],
        [["Add", "相加"], ["Add the parts.", "把各部分相加。"], [`${w} + ${fix(tenths, 1)} + ${fix(h, 2)} = ${fix(n, 2)}`]],
      ],
      [
        `Split $${fix(n, 2)}$ by place: $${w + 1} + ${fix(tenths - 10, 1)} + ${fix(h, 2)}$, the same amount.`,
        `把 $${fix(n, 2)}$ 按数位拆开：$${w + 1} + ${fix(tenths - 10, 1)} + ${fix(h, 2)}$，大小相同。`,
      ],
      [
        [D(w * 1000 + tenths * 10 + h, 3), `That writes ${tenths} in one place.`, `这把 ${tenths} 写进了一个数位。`],
        [D(w * 100 + (tenths - 10) * 10 + h, 2), "That drops the whole made from ten tenths.", "这里丢了十个十分之一换成的 1。"],
      ],
      { form: "decimal", figure: decimalChart([[n, 2]], 0, 2, 0) },
    );
  },
  decimalChart([[445, 2]], 0, 2, 0),
);

/** theDecimalThatIsNotEqual picks the one decimal that a zero right after the point makes different. */
export const theDecimalThatIsNotEqual = point(
  "the-decimal-that-is-not-equal",
  ["The decimal that is not equal", "不相等的小数"],
  [
    "$8.5 = 8.50 = 8.500$, but $8.05$ is different: the zero after the point moves the 5 to the hundredths.\n\nCheck: $8.05$ is 5 hundredths more than 8, while $8.5$ is 50 hundredths more.\n\n> **Watch out.** Only zeros at the far right change nothing.",
    "$8.5 = 8.50 = 8.500$，但 $8.05$ 不同：小数点后的 0 把 5 挤到了百分位。\n\n检验：$8.05$ 比 8 多 5 个百分之一，$8.5$ 比 8 多 50 个百分之一。\n\n> **注意。** 只有末尾的 0 不改变大小。",
  ],
  (rng) => {
    const w = rng.int(1, 19);
    const d = rng.int(1, 9);
    const n = w * 10 + d;
    return pickedMath(
      rng,
      [`Which decimal is not equal to $${fix(n, 1)}$?`, `哪个小数不等于 $${fix(n, 1)}$？`],
      fix(w * 100 + d, 2),
      [
        [fix(n * 10, 2), "It is equal: a zero at the far right changes nothing.", "它相等：末尾添 0 大小不变。"],
        [fix(n * 100, 3), "It is equal: zeros at the far right change nothing.", "它相等：末尾添 0 大小不变。"],
      ],
      [
        [
          ["Look at the zeros", "看 0 的位置"],
          ["Zeros at the far right change nothing.", "末尾的 0 不改变大小。"],
        ],
        [
          ["Find the moved digit", "找被挪动的数字"],
          [
            `In $${fix(w * 100 + d, 2)}$ the ${d} is in the hundredths place, not the tenths.`,
            `在 $${fix(w * 100 + d, 2)}$ 中，${d} 在百分位上，不在十分位上。`,
          ],
        ],
      ],
      [
        `$${fix(w * 100 + d, 2)}$ is ${d} hundredths past ${w}, but $${fix(n, 1)}$ is ${d * 10} hundredths past ${w}.`,
        `$${fix(w * 100 + d, 2)}$ 比 ${w} 多 ${d} 个百分之一，$${fix(n, 1)}$ 比 ${w} 多 ${d * 10} 个百分之一。`,
      ],
      hundredthsGrid(d * 10),
    );
  },
  hundredthsGrid(50),
);

/** countingDecimalsBetweenTwoDecimals counts the decimals with two places strictly between two decimals. */
export const countingDecimalsBetweenTwoDecimals = point(
  "counting-decimals-between-two-decimals",
  ["Counting decimals between two decimals", "数两个小数之间的小数"],
  [
    "How many decimals with two places lie between $3.4$ and $3.52$? Write $3.4$ as $3.40$. From 340 to 352 hundredths is 12 steps, and 11 numbers lie strictly between.\n\nCheck: they are $3.41, 3.42, \\dots, 3.51$, which is 11 numbers.\n\n> **Watch out.** Do not count the two ends. 12 is the number of steps.",
    "两位小数中，严格在 $3.4$ 和 $3.52$ 之间的有几个？把 $3.4$ 写成 $3.40$。从 340 个到 352 个百分之一是 12 步，中间严格夹着 11 个数。\n\n检验：它们是 $3.41, 3.42, \\dots, 3.51$，共 11 个。\n\n> **注意。** 两端的数不算。12 是步数。",
  ],
  (rng) => {
    const low = rng.int(11, 89) * 10;
    const high = low + rng.int(5, 25);
    const gap = high - low;
    return answered(
      [
        `How many decimals with exactly two places lie strictly between $${fix(low / 10, 1)}$ and $${fix(high, 2)}$?`,
        `恰好两位的小数中，严格在 $${fix(low / 10, 1)}$ 和 $${fix(high, 2)}$ 之间的有多少个？`,
      ],
      gap - 1,
      [
        [
          ["Use hundredths", "化成百分之一"],
          [
            `Write $${fix(low / 10, 1)}$ as $${fix(low, 2)}$: that is ${low} hundredths, and $${fix(high, 2)}$ is ${high} hundredths.`,
            `把 $${fix(low / 10, 1)}$ 写成 $${fix(low, 2)}$：它是 ${low} 个百分之一，$${fix(high, 2)}$ 是 ${high} 个百分之一。`,
          ],
        ],
        [
          ["Count between", "数中间的数"],
          ["The numbers strictly between are one fewer than the steps.", "严格夹在中间的数比步数少 1。"],
          [`${high} - ${low} - 1 = ${gap - 1}`],
        ],
      ],
      [
        `List the ends of the run: $${fix(low + 1, 2)}$ to $${fix(high - 1, 2)}$, which is $${high - 1} - ${low + 1} + 1 = ${gap - 1}$ numbers.`,
        `列出首尾：$${fix(low + 1, 2)}$ 到 $${fix(high - 1, 2)}$，共 $${high - 1} - ${low + 1} + 1 = ${gap - 1}$ 个。`,
      ],
      [
        [gap, "That is the number of steps. It counts one end.", "这是步数，多算了一端。"],
        [gap + 1, "That counts both ends.", "这把两端都算进去了。"],
        [
          Math.abs((high % 100) - ((low / 10) % 10)),
          "That compares the digits after the point without lining up the places.",
          "这是没有对齐数位就比较小数点后的数字。",
        ],
      ],
      { figure: decLine(low / 100, (Math.ceil(high / 10) * 10) / 100, 0.01, [low / 100, high / 100]) },
    );
  },
  decLine(3.4, 3.6, 0.01, [3.4, 3.52]),
);

/** theLargestDecimalThatRoundsDown finds the largest decimal with one place that rounds down to a whole number. */
export const theLargestDecimalThatRoundsDown = point(
  "the-largest-decimal-that-rounds-down",
  ["The largest decimal that rounds down", "能舍去的最大小数"],
  [
    "Which decimal with one place is the largest that rounds to 7? $7.4$: its tenths digit 4 is less than 5, so it rounds down. $7.5$ would round up to 8.\n\nCheck: on a number line, $7.4$ is closer to 7 than to 8.\n\n> **Watch out.** $7.5$ is exactly halfway, and halfway rounds up.",
    "四舍五入到整数是 7 的一位小数中，最大的是哪个？$7.4$：十分位上的 4 小于 5，所以舍去。$7.5$ 会进一成为 8。\n\n检验：在数轴上，$7.4$ 离 7 比离 8 近。\n\n> **注意。** $7.5$ 正好在中间，正中间要进一。",
  ],
  (rng) => {
    const w = rng.int(1, 60);
    const hundredths = rng.bool(0.4);
    const p = hundredths ? 2 : 1;
    const top = hundredths ? w * 100 + 49 : w * 10 + 4;
    return answered(
      [
        `What is the largest decimal with ${hundredths ? "two places" : "one place"} that rounds to ${w} when rounded to the nearest whole number?`,
        `四舍五入到整数是 ${w} 的${hundredths ? "两" : "一"}位小数中，最大的是多少？`,
      ],
      D(top, p),
      [
        [
          ["Round down", "舍去"],
          [`To round down to ${w}, the tenths digit must be less than 5.`, `要舍去成 ${w}，十分位必须小于 5。`],
        ],
        [
          ["Take the largest", "取最大的"],
          [
            `The largest such tenths digit is 4${hundredths ? ", then 9 in the hundredths" : ""}.`,
            `这样的十分位最大是 4${hundredths ? "，百分位再取 9" : ""}。`,
          ],
          [fix(top, p)],
        ],
      ],
      [
        `On the number line, $${fix(top, p)}$ is closer to ${w} than to ${w + 1}, and the next decimal $${fix(top + 1, p)}$ rounds up.`,
        `在数轴上，$${fix(top, p)}$ 离 ${w} 比离 ${w + 1} 近，下一个小数 $${fix(top + 1, p)}$ 就要进一了。`,
      ],
      [
        [D(top + 1, p), "That is exactly halfway, which rounds up.", "这正好在中间，要进一。"],
        [D(w * pow10(p) + pow10(p) - 1, p), "That rounds up to the next whole number.", "这会进一成为下一个整数。"],
        [w, "That is the rounded number, not the largest decimal.", "这是近似数，不是最大的小数。"],
      ],
      { form: "decimal", figure: decLine(w, w + 1, 0.1, [w + 0.4]) },
    );
  },
  decLine(7, 8, 0.1, [7.4]),
);

/** theEndsOfARoundedDecimal finds the smallest or largest decimal with two places that rounds to a given tenth. */
export const theEndsOfARoundedDecimal = point(
  "the-ends-of-a-rounded-decimal",
  ["The ends of a rounded decimal", "舍入后的小数的两端"],
  [
    "Which two-place decimals round to $3.6$? The smallest is $3.55$, because halfway rounds up. The largest is $3.64$, because $3.65$ rounds up to $3.7$.\n\nCheck: $3.55$ and $3.64$ are both closer to $3.6$ than to its neighbors.\n\n> **Watch out.** $3.54$ rounds down to $3.5$, and $3.65$ rounds up to $3.7$.",
    "哪些两位小数四舍五入到十分位是 $3.6$？最小的是 $3.55$，因为正中间要进一。最大的是 $3.64$，因为 $3.65$ 会进一成为 $3.7$。\n\n检验：$3.55$ 和 $3.64$ 都离 $3.6$ 最近。\n\n> **注意。** $3.54$ 会舍去成 $3.5$，$3.65$ 会进一成 $3.7$。",
  ],
  (rng) => {
    const value = rng.int(1, 30) * 100 + rng.int(1, 9) * 10;
    const smallest = rng.bool();
    const end = smallest ? value - 5 : value + 4;
    return answered(
      [
        `A decimal with two places rounds to $${fix(value / 10, 1)}$ to the nearest tenth. What is the ${smallest ? "smallest" : "largest"} it can be?`,
        `一个两位小数四舍五入到十分位是 $${fix(value / 10, 1)}$。它${smallest ? "最小" : "最大"}是多少？`,
      ],
      D(end, 2),
      [
        [
          ["Find the halfway points", "找中点"],
          [
            `Halfway down is $${fix(value - 5, 2)}$ and halfway up is $${fix(value + 5, 2)}$.`,
            `往下的中点是 $${fix(value - 5, 2)}$，往上的中点是 $${fix(value + 5, 2)}$。`,
          ],
        ],
        [
          ["Halfway rounds up", "正中间进一"],
          smallest
            ? [
                `$${fix(value - 5, 2)}$ rounds up to $${fix(value / 10, 1)}$, so it is the smallest.`,
                `$${fix(value - 5, 2)}$ 进一成为 $${fix(value / 10, 1)}$，所以它最小。`,
              ]
            : [
                `$${fix(value + 5, 2)}$ rounds up past it, so the largest is $${fix(value + 4, 2)}$.`,
                `$${fix(value + 5, 2)}$ 会进一成为下一个十分位，所以最大是 $${fix(value + 4, 2)}$。`,
              ],
          [fix(end, 2)],
        ],
      ],
      [
        smallest
          ? `The decimal just below, $${fix(value - 6, 2)}$, rounds down to $${fix(value / 10 - 1, 1)}$.`
          : `The decimal just above, $${fix(value + 5, 2)}$, rounds up to $${fix(value / 10 + 1, 1)}$.`,
        smallest
          ? `比它小一点的 $${fix(value - 6, 2)}$ 会舍去成 $${fix(value / 10 - 1, 1)}$。`
          : `比它大一点的 $${fix(value + 5, 2)}$ 会进一成 $${fix(value / 10 + 1, 1)}$。`,
      ],
      [
        [
          D(smallest ? value - 4 : value + 5, 2),
          smallest ? "That is not the smallest: halfway also rounds up." : "That is halfway, which rounds up to the next tenth.",
          smallest ? "这不是最小的：正中间也会进一。" : "这正好在中间，会进一成为下一个十分位。",
        ],
        [
          D(smallest ? value - 9 : value + 9, 2),
          smallest ? "That rounds down to the tenth below." : "That rounds up to the tenth above.",
          smallest ? "这会舍去成下面的十分位。" : "这会进一成上面的十分位。",
        ],
        [D(value, 2), "That is the rounded value itself, not an end.", "这是近似数本身，不是端点。"],
      ],
      {
        form: "decimal",
        figure: decLine((value - 10) / 100, (value + 10) / 100, 0.01, [(value - 5) / 100, value / 100, (value + 4) / 100]),
      },
    );
  },
  decLine(3.5, 3.7, 0.01, [3.55, 3.6, 3.64]),
);

/** countingSignificantFiguresInAWholeNumber counts the significant figures of a whole number with zeros between its digits. */
export const countingSignificantFiguresInAWholeNumber = point(
  "counting-significant-figures",
  ["Counting significant figures", "数有效数字"],
  [
    "$40{,}507$ has 5 significant figures: 4, 0, 5, 0, 7. Zeros between other digits count.\n\nCheck: rounding to 5 significant figures leaves $40{,}507$ unchanged, so all 5 digits matter.\n\n> **Watch out.** Do not skip the zeros in the middle. Counting only 4, 5 and 7 gives 3.",
    "$40{,}507$ 有 5 位有效数字：4、0、5、0、7。夹在其他数字中间的 0 也算。\n\n检验：保留 5 位有效数字后 $40{,}507$ 不变，说明 5 个数字都有用。\n\n> **注意。** 中间的 0 不能跳过。只数 4、5、7 会得到 3。",
  ],
  (rng) => {
    const len = rng.int(4, 6);
    let n = nonZeroEnd(rng, len);
    while (!String(n).slice(1, -1).includes("0")) n = nonZeroEnd(rng, len);
    const nonzero = [...String(n)].filter((c) => c !== "0").length;
    return answered(
      [`How many significant figures does $${texCommas(n)}$ have?`, `$${texCommas(n)}$ 有几位有效数字？`],
      len,
      [
        [
          ["Find the first digit", "找第一个数字"],
          [`Start at the first nonzero digit, ${String(n)[0]}.`, `从第一个非零数字 ${String(n)[0]} 开始数。`],
        ],
        [
          ["Count every digit after it", "数后面所有数字"],
          ["Zeros between digits count too.", "夹在中间的 0 也算。"],
          [`${[...String(n)].join(",\\ ")} \\to ${len}`],
        ],
      ],
      [
        `Rounding $${texCommas(n)}$ to ${len} significant figures leaves it unchanged, but to ${len - 1} changes it.`,
        `把 $${texCommas(n)}$ 保留 ${len} 位有效数字不变，保留 ${len - 1} 位就变了。`,
      ],
      [
        [nonzero, "That skips the zeros between digits, but they count.", "这跳过了中间的 0，但它们也算。"],
        [len - 1, "That leaves out one digit.", "这少数了一个数字。"],
        [len + 1, "That counts one digit too many.", "这多数了一个数字。"],
      ],
      { figure: digitsChart([n]) },
    );
  },
  digitsChart([40507]),
);

/** countingSignificantFiguresInADecimal counts the significant figures of a small decimal with zeros in front. */
export const countingSignificantFiguresInADecimal = point(
  "counting-significant-figures",
  ["Counting significant figures", "数有效数字的个数"],
  [
    "$0.0305$ has 3 significant figures: 3, 0, 5. The zeros in front only show the place; the zero between 3 and 5 counts.\n\nCheck: without the zeros in front the digits are 305, which has 3 digits.\n\n> **Watch out.** Zeros before the first nonzero digit do not count. Counting them gives 5.",
    "$0.0305$ 有 3 位有效数字：3、0、5。前面的 0 只用来占位，3 和 5 中间的 0 要算。\n\n检验：去掉前面占位的 0 后，剩下的数字是 3、0、5，共 3 个。\n\n> **注意。** 第一个非零数字前面的 0 不算。把它们也数进去会得到 5。",
  ],
  (rng) => {
    const leading = rng.int(1, 2);
    const answer = rng.int(2, 4);
    const digits: number[] = [rng.int(1, 9)];
    for (let i = 1; i < answer - 1; i++) digits.push(rng.int(0, 9));
    digits.push(rng.int(1, 9));
    const text = `0.${"0".repeat(leading)}${digits.join("")}`;
    const nonzero = digits.filter((v) => v !== 0).length;
    const n = Number(digits.join(""));
    return answered(
      [`How many significant figures does $${text}$ have?`, `$${text}$ 有几位有效数字？`],
      answer,
      [
        [
          ["Skip the zeros in front", "跳过前面的 0"],
          [`The zeros before ${digits[0]} only show the place.`, `${digits[0]} 前面的 0 只用来占位。`],
        ],
        [
          ["Count from the first nonzero digit", "从第一个非零数字数起"],
          [`Count ${digits.join(", ")}.`, `数 ${digits.join("、")}。`],
          [`${answer}`],
        ],
      ],
      [
        `Without the zeros in front, the digits are ${digits.join("")}, which has ${answer} digits.`,
        `去掉前面的 0，剩下 ${digits.join("")}，共 ${answer} 个数字。`,
      ],
      [
        [answer + leading + 1, "That counts the zeros in front as well.", "这把前面的 0 也算进去了。"],
        [
          nonzero === answer ? answer + leading : nonzero,
          nonzero === answer ? "That counts some zeros in front." : "That skips the zero between digits, but it counts.",
          nonzero === answer ? "这把前面的一些 0 算进去了。" : "这跳过了中间的 0，但它要算。",
        ],
        [answer - 1, "That leaves out one digit.", "这少数了一个数字。"],
      ],
      { figure: sigLine(n, leading + answer, answer - 1) },
    );
  },
  sigLine(305, 4, 2),
);

/** whetherAnEstimateIsTooHigh tells from the rounding whether an estimated sum is above or below the exact sum. */
export const whetherAnEstimateIsTooHigh = point(
  "whether-an-estimate-is-too-high",
  ["Whether an estimate is too high", "估算值是否偏大"],
  [
    "Estimate $3.7 + 5.8$ as $4 + 6 = 10$. Both numbers were rounded up, so the estimate is too high.\n\nCheck: the exact sum is $9.5$, which is less than 10.\n\n> **Watch out.** Rounding up makes each number bigger, so the sum is bigger too.",
    "把 $3.7 + 5.8$ 估算成 $4 + 6 = 10$。两个数都是进一，所以估算值偏大。\n\n检验：准确的和是 $9.5$，比 10 小。\n\n> **注意。** 进一使每个数都变大，和也就变大了。",
  ],
  (rng) => {
    const high = rng.bool();
    const make = () => rng.int(1, 30) * 10 + (high ? rng.int(6, 9) : rng.int(1, 4));
    const [a, b] = [make(), make()];
    const [ra, rb] = [roundWhole(a, 1), roundWhole(b, 1)];
    const exact = D(a + b, 1);
    const yes: Pair = ["too high", "偏大"];
    const no: Pair = ["too low", "偏小"];
    return picked(
      rng,
      [
        `Estimate $${fix(a, 1)} + ${fix(b, 1)}$ by rounding each number to the nearest whole number. Is the estimate too high or too low?`,
        `把每个数四舍五入到整数来估算 $${fix(a, 1)} + ${fix(b, 1)}$。估算值偏大还是偏小？`,
      ],
      high ? yes : no,
      [
        [
          high ? no : yes,
          high ? "Both numbers were rounded up, so the estimate is larger." : "Both numbers were rounded down, so the estimate is smaller.",
          high ? "两个数都进一了，估算值更大。" : "两个数都舍去了，估算值更小。",
        ],
        [
          ["exactly right", "正好相等"],
          "Rounding changed both numbers, so the estimate is not exact.",
          "两个数都被取了近似值，估算值不会正好相等。",
        ],
      ],
      [
        [
          ["Round", "取近似数"],
          [
            `$${fix(a, 1)} \\approx ${ra}$ and $${fix(b, 1)} \\approx ${rb}$: both rounded ${high ? "up" : "down"}.`,
            `$${fix(a, 1)} \\approx ${ra}$，$${fix(b, 1)} \\approx ${rb}$：两个都${high ? "进一" : "舍去"}了。`,
          ],
        ],
        [
          ["Decide", "判断"],
          [`So the estimate $${ra + rb}$ is ${high ? "too high" : "too low"}.`, `所以估算值 $${ra + rb}$ ${high ? "偏大" : "偏小"}。`],
        ],
      ],
      [
        `The exact sum is $${dq(exact)}$, which is ${high ? "less" : "more"} than ${ra + rb}.`,
        `准确的和是 $${dq(exact)}$，比 ${ra + rb} ${high ? "小" : "大"}。`,
      ],
      estimateTape(a, 1, b, 1, true),
    );
  },
  estimateTape(37, 1, 58, 1, true),
);

/** theDecimalThatMakesAWhole finds the decimal that brings a decimal up to the next whole number. */
export const theDecimalThatMakesAWhole = point(
  "the-decimal-that-makes-a-whole",
  ["The decimal that makes a whole", "凑成整数的小数"],
  [
    "$3.47 + \\square = 4$. The hundredths must make 10: $7 + 3$. Then the tenths, with the carry, must make 10: $4 + 5 + 1$. So $\\square = 0.53$.\n\nCheck: $3.47 + 0.53 = 4.00$.\n\n> **Watch out.** Making each digit up to 10 gives $0.63$, which is too much once you carry.",
    "$3.47 + \\square = 4$。百分位要凑成 10：$7 + 3$。十分位加上进的 1 也要凑成 10：$4 + 5 + 1$。所以 $\\square = 0.53$。\n\n检验：$3.47 + 0.53 = 4.00$。\n\n> **注意。** 每一位都凑成 10 会得到 $0.63$，进位后就多了。",
  ],
  (rng) => {
    const w = rng.int(0, 20);
    const x = rng.int(1, 8);
    const y = rng.int(1, 9);
    const a = w * 100 + x * 10 + y;
    const answer = 100 - x * 10 - y;
    return answered(
      [`Find the missing number: $${fix(a, 2)} + \\square = ${w + 1}$.`, `求方框里的数：$${fix(a, 2)} + \\square = ${w + 1}$。`],
      D(answer, 2),
      [
        [
          ["The hundredths make 10", "百分位凑 10"],
          [`${y} + ${10 - y} = 10: write 0 and carry 1.`, `${y} + ${10 - y} = 10：写 0，进 1。`],
        ],
        [
          ["The tenths make 10", "十分位凑 10"],
          [`${x} + ${9 - x} + 1 = 10, which carries to the ones.`, `${x} + ${9 - x} + 1 = 10，再向个位进 1。`],
          [`\\square = ${fix(answer, 2)}`],
        ],
      ],
      [
        `Add: $${fix(a, 2)} + ${fix(answer, 2)} = ${fix((w + 1) * 100, 2)}$.`,
        `相加：$${fix(a, 2)} + ${fix(answer, 2)} = ${fix((w + 1) * 100, 2)}$。`,
      ],
      [
        [D((10 - x) * 10 + (10 - y), 2), "That makes each digit up to 10 and forgets the carry.", "这是把每一位都凑成 10，忘了进位。"],
        [D((9 - x) * 10 + (9 - y), 2), "That makes each digit up to 9, so it falls short.", "这是把每一位凑成 9，还差一点。"],
        [
          D(w + 1, 0)
            .sub(D(a, 2))
            .add(D(1, 0)),
          "That makes the next whole number after that.",
          "这凑到了再下一个整数。",
        ],
      ],
      { form: "decimal", figure: decLine(w, w + 1, 0.1, [a / 100], [[a / 100, w + 1]]) },
    );
  },
  decLine(3, 4, 0.1, [3.47], [[3.47, 4]]),
);

/** liningUpThePoints corrects a sum worked with the last digits lined up instead of the points. */
export const liningUpThePoints = point(
  "lining-up-the-points",
  ["Lining up the points", "小数点对齐"],
  [
    "Max added $4.6 + 2.35$ with the last digits lined up and got $2.81$. Line up the points instead: $4.60 + 2.35 = 6.95$.\n\nCheck: $4.6$ is more than 4 and $2.35$ is more than 2, so the sum must be more than 6.\n\n> **Watch out.** Fill the shorter decimal with zeros so tenths add to tenths.",
    "小马计算 $4.6 + 2.35$ 时把末位对齐，得到 $2.81$。应该对齐小数点：$4.60 + 2.35 = 6.95$。\n\n检验：$4.6$ 比 4 大，$2.35$ 比 2 大，所以和一定比 6 大。\n\n> **注意。** 位数少的小数后面补 0，十分位才能和十分位相加。",
  ],
  (rng) => {
    let [a, b] = [rng.int(11, 99), rng.int(101, 999)];
    while (a % 10 === 0 || b % 10 === 0) [a, b] = [rng.int(11, 99), rng.int(101, 999)];
    const A = a * 10;
    const wrong = a + b;
    return answered(
      [
        `Max added $${fix(a, 1)} + ${fix(b, 2)}$ with the last digits lined up and got $${fix(wrong, 2)}$. What is the correct sum?`,
        `小马计算 $${fix(a, 1)} + ${fix(b, 2)}$ 时把末位对齐，得到 $${fix(wrong, 2)}$。正确的和是多少？`,
      ],
      D(A + b, 2),
      [
        [
          ["Fill in a zero", "补 0"],
          [`Write $${fix(a, 1)}$ as $${fix(A, 2)}$.`, `把 $${fix(a, 1)}$ 写成 $${fix(A, 2)}$。`],
        ],
        [
          ["Add with the points lined up", "对齐小数点相加"],
          ["Now tenths add to tenths.", "这样十分位就和十分位相加了。"],
          [`${fix(A, 2)} + ${fix(b, 2)} = ${fix(A + b, 2)}`],
        ],
      ],
      [
        `The whole parts alone give $${Math.floor(a / 10)} + ${Math.floor(b / 100)} = ${Math.floor(a / 10) + Math.floor(b / 100)}$, so the sum must be more than that.`,
        `只看整数部分 $${Math.floor(a / 10)} + ${Math.floor(b / 100)} = ${Math.floor(a / 10) + Math.floor(b / 100)}$，和一定比它大。`,
      ],
      [
        [D(wrong, 2), "That is Max's answer, with the last digits lined up.", "这是小马的答案，对齐的是末位。"],
        [D(noCarrySum(A, b), 2), "That forgets to carry.", "这里忘了进位。"],
      ],
      { form: "decimal", figure: sumChart(A, 2, b, 2, A + b, 2) },
    );
  },
  decimalChart(
    [
      [460, 2],
      [235, 2],
      [695, 2],
    ],
    0,
    2,
  ),
);

/** theRestOfADecimalTotal finds what is left of a whole-number total after two decimal amounts are taken. */
export const theRestOfADecimalTotal = point(
  "the-rest-of-a-decimal-total",
  ["The rest of a decimal total", "小数总量剩下的部分"],
  [
    "Mom has 20 yuan and spends $6.45$ and $3.8$ yuan. Add what she spends: $6.45 + 3.80 = 10.25$. Then $20.00 - 10.25 = 9.75$ yuan is left.\n\nCheck: $20 - 6.45 = 13.55$, and $13.55 - 3.8 = 9.75$.\n\n> **Watch out.** Write 20 as $20.00$ so every place has a digit to trade.",
    "妈妈有 20 元，花了 $6.45$ 元和 $3.8$ 元。先算花了多少：$6.45 + 3.80 = 10.25$。再算 $20.00 - 10.25 = 9.75$，还剩 9.75 元。\n\n检验：$20 - 6.45 = 13.55$，$13.55 - 3.8 = 9.75$。\n\n> **注意。** 把 20 写成 $20.00$，每一位都有数字可以退位。",
  ],
  (rng) => {
    const total = rng.pick([10, 20, 50]);
    let [a, b] = [rng.int(101, total * 40), rng.int(11, total * 4) * 10];
    while (a % 10 === 0 || (b / 10) % 10 === 0) [a, b] = [rng.int(101, total * 40), rng.int(11, total * 4) * 10];
    const spent = a + b;
    const left = total * 100 - spent;
    return answered(
      [
        `Mom has ${total} yuan. She spends $${fix(a, 2)}$ yuan and $${fix(b / 10, 1)}$ yuan. How much is left?`,
        `妈妈有 ${total} 元，花了 $${fix(a, 2)}$ 元和 $${fix(b / 10, 1)}$ 元。还剩多少元？`,
      ],
      D(left, 2),
      [
        [
          ["Add what she spends", "先算花了多少"],
          [`Write $${fix(b / 10, 1)}$ as $${fix(b, 2)}$ and add.`, `把 $${fix(b / 10, 1)}$ 写成 $${fix(b, 2)}$ 再相加。`],
          [`${fix(a, 2)} + ${fix(b, 2)} = ${fix(spent, 2)}`],
        ],
        [
          ["Subtract from the total", "从总数里减去"],
          [`Write ${total} as $${fix(total * 100, 2)}$.`, `把 ${total} 写成 $${fix(total * 100, 2)}$。`],
          [`${fix(total * 100, 2)} - ${fix(spent, 2)} = ${fix(left, 2)}`],
        ],
      ],
      [
        `Subtract one at a time: $${total} - ${fix(a, 2)} = ${fix(total * 100 - a, 2)}$, then $${fix(total * 100 - a, 2)} - ${fix(b / 10, 1)} = ${fix(left, 2)}$.`,
        `一个一个减：$${total} - ${fix(a, 2)} = ${fix(total * 100 - a, 2)}$，再算 $${fix(total * 100 - a, 2)} - ${fix(b / 10, 1)} = ${fix(left, 2)}$。`,
      ],
      [
        [D(spent, 2), "That is what she spends, not what is left.", "这是花掉的钱，不是剩下的钱。"],
        [D(total * 100 - a - b / 10, 2), "That lines up the last digits of the one-place amount.", "这是把一位小数的末位和百分位对齐了。"],
        [
          D(noBorrowDifference(total * 100, spent), 2),
          "That keeps digits instead of trading from the whole number.",
          "这里没有从整数退位。",
        ],
      ],
      {
        form: "decimal",
        figure: tapeFigure(
          [
            {
              total: `${total}`,
              pieces: [
                { size: a, text: fix(a, 2), lit: true },
                { size: b, text: fix(b / 10, 1), lit: true },
                { size: left, text: "?", dashed: true },
              ],
            },
          ],
          [
            `A bar for ${total} yuan with ${fix(a, 2)} and ${fix(b / 10, 1)} shaded and the rest marked with a question mark.`,
            `一个表示 ${total} 元的长条，${fix(a, 2)} 和 ${fix(b / 10, 1)} 涂了颜色，剩下的部分标着问号。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [
      {
        total: "20",
        pieces: [
          { size: 645, text: "6.45", lit: true },
          { size: 380, text: "3.8", lit: true },
          { size: 975, text: "?", dashed: true },
        ],
      },
    ],
    [
      "A bar for 20 yuan with 6.45 and 3.8 shaded and the rest marked with a question mark.",
      "一个表示 20 元的长条，6.45 和 3.8 涂了颜色，剩下的部分标着问号。",
    ],
  ),
);

/** theDecimalThatCompletesAWholeNumber finds what a decimal needs to reach a whole number by subtracting. */
export const theDecimalThatCompletesAWholeNumber = point(
  "the-decimal-that-completes-a-whole-number",
  ["The decimal that completes a whole number", "凑成整数的小数"],
  [
    "What must be added to $6.38$ to make 10? Subtract: $10.00 - 6.38 = 3.62$.\n\nCheck: $6.38 + 3.62 = 10.00$; the hundredths $8 + 2$ make 10 and the tenths $3 + 6 + 1$ make 10.\n\n> **Watch out.** Write 10 as $10.00$. Taking only the whole parts gives 4, which is too much.",
    "$6.38$ 加上多少等于 10？用减法：$10.00 - 6.38 = 3.62$。\n\n检验：$6.38 + 3.62 = 10.00$；百分位 $8 + 2$ 凑成 10，十分位 $3 + 6 + 1$ 也凑成 10。\n\n> **注意。** 把 10 写成 $10.00$。只看整数部分会得到 4，多了。",
  ],
  (rng) => {
    const w = rng.pick([1, 5, 10, 20]);
    let a = rng.int(1, w * 100 - 1);
    while (a % 10 === 0 || a < 10) a = rng.int(1, w * 100 - 1);
    const answer = w * 100 - a;
    return answered(
      [`What must be added to $${fix(a, 2)}$ to make ${w}?`, `$${fix(a, 2)}$ 加上多少等于 ${w}？`],
      D(answer, 2),
      [
        [
          ["Write the zeros", "写出 0"],
          [`Write ${w} as $${fix(w * 100, 2)}$.`, `把 ${w} 写成 $${fix(w * 100, 2)}$。`],
        ],
        [
          ["Subtract", "相减"],
          ["Subtract, trading from the ones.", "从个位退位相减。"],
          [`${fix(w * 100, 2)} - ${fix(a, 2)} = ${fix(answer, 2)}`],
        ],
      ],
      [`Add: $${fix(a, 2)} + ${fix(answer, 2)} = ${fix(w * 100, 2)}$.`, `相加：$${fix(a, 2)} + ${fix(answer, 2)} = ${fix(w * 100, 2)}$。`],
      [
        [w - Math.floor(a / 100), "That subtracts only the whole parts.", "这只减了整数部分。"],
        [D(noBorrowDifference(w * 100, a), 2), "That keeps digits instead of trading.", "这里没有退位。"],
        [D(answer + 10, 2), "That makes each digit up to 10 and forgets the carry.", "这是把每一位都凑成 10，忘了进位。"],
      ],
      { form: "decimal", figure: decLine(Math.floor(a / 100), w, w - Math.floor(a / 100) > 2 ? 1 : 0.1, [a / 100], [[a / 100, w]]) },
    );
  },
  decLine(6, 10, 1, [6.38], [[6.38, 10]]),
);

/** whetherASumIsAboveOne decides with the benchmark 0.5 whether two decimals add to more or less than 1. */
export const whetherASumIsAboveOne = point(
  "the-sum-that-is-above-one",
  ["The sum that is above one", "大于 1 的和"],
  [
    "Is $0.58 + 0.67$ more or less than 1? Both are more than $0.5$, so the sum is more than $0.5 + 0.5 = 1$.\n\nCheck: the exact sum is $1.25$, which is more than 1.\n\n> **Watch out.** Compare each number with $0.5$; you do not need the exact sum.",
    "$0.58 + 0.67$ 比 1 大还是比 1 小？两个数都比 $0.5$ 大，所以和比 $0.5 + 0.5 = 1$ 大。\n\n检验：准确的和是 $1.25$，比 1 大。\n\n> **注意。** 把每个数和 $0.5$ 比较就行，不用算出准确的和。",
  ],
  (rng) => {
    const above = rng.bool();
    const make = () => (above ? rng.int(51, 99) : rng.int(1, 49));
    const [a, b] = [make(), make()];
    const more: Pair = ["more than 1", "比 1 大"];
    const less: Pair = ["less than 1", "比 1 小"];
    return picked(
      rng,
      [`Is $${fix(a, 2)} + ${fix(b, 2)}$ more or less than 1?`, `$${fix(a, 2)} + ${fix(b, 2)}$ 比 1 大还是比 1 小？`],
      above ? more : less,
      [
        [
          above ? less : more,
          above
            ? "Both numbers are more than 0.5, so the sum is more than 1."
            : "Both numbers are less than 0.5, so the sum is less than 1.",
          above ? "两个数都比 0.5 大，和一定比 1 大。" : "两个数都比 0.5 小，和一定比 1 小。",
        ],
        [
          ["equal to 1", "等于 1"],
          "Neither number is exactly 0.5, so the sum cannot be exactly 1 this way.",
          "两个数都不正好是 0.5，和不会正好等于 1。",
        ],
      ],
      [
        [
          ["Compare with 0.5", "和 0.5 比较"],
          [`Both are ${above ? "more" : "less"} than $0.5$.`, `两个数都比 $0.5$ ${above ? "大" : "小"}。`],
        ],
        [
          ["Decide", "判断"],
          [`So the sum is ${above ? "more" : "less"} than $0.5 + 0.5 = 1$.`, `所以和比 $0.5 + 0.5 = 1$ ${above ? "大" : "小"}。`],
        ],
      ],
      [`The exact sum is $${fix(a + b, 2)}$.`, `准确的和是 $${fix(a + b, 2)}$。`],
      decLine(0, 1, 0.1, [a / 100, b / 100]),
    );
  },
  decLine(0, 1, 0.1, [0.58, 0.67]),
);

/** theDifferenceCloseToOneHalf picks the benchmark a difference of two decimals is closest to. */
export const theDifferenceCloseToOneHalf = point(
  "the-difference-close-to-one-half",
  ["The difference close to one half", "接近二分之一的差"],
  [
    "$0.91 - 0.47$ is about $1 - 0.5 = 0.5$. But $0.93 - 0.89$ is about $1 - 1 = 0$, because both are near the same benchmark.\n\nCheck: $0.91 - 0.47 = 0.44$, close to $0.5$.\n\n> **Watch out.** Two numbers near the same benchmark differ by almost 0.",
    "$0.91 - 0.47$ 约是 $1 - 0.5 = 0.5$。而 $0.93 - 0.89$ 约是 $1 - 1 = 0$，因为两个数接近同一个基准数。\n\n检验：$0.91 - 0.47 = 0.44$，接近 $0.5$。\n\n> **注意。** 两个数接近同一个基准数时，差接近 0。",
  ],
  (rng) => {
    for (;;) {
      const k1 = rng.int(0, 2);
      const k2 = rng.int(0, k1);
      const [a, b] = [nearHalf(rng, 0, k1), nearHalf(rng, 0, k2)];
      if (a <= b) continue;
      const est = Q.of(k1 - k2, 2);
      const all = [Q.of(0), Q.of(1, 2), Q.of(1)];
      return pickedMath(
        rng,
        [`Which benchmark is $${fix(a, 2)} - ${fix(b, 2)}$ closest to?`, `$${fix(a, 2)} - ${fix(b, 2)}$ 最接近哪个基准数？`],
        dq(est),
        all
          .filter((q) => !q.eq(est))
          .map(
            (q): MathWrong => [
              dq(q),
              `The difference is about $${dq(Q.of(k1, 2))} - ${dq(Q.of(k2, 2))} = ${dq(est)}$, not $${dq(q)}$.`,
              `差约是 $${dq(Q.of(k1, 2))} - ${dq(Q.of(k2, 2))} = ${dq(est)}$，不是 $${dq(q)}$。`,
            ],
          ),
        [
          [
            ["Pick the benchmarks", "选基准数"],
            [
              `$${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}$ and $${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}$.`,
              `$${fix(a, 2)} \\approx ${dq(Q.of(k1, 2))}$，$${fix(b, 2)} \\approx ${dq(Q.of(k2, 2))}$。`,
            ],
          ],
          [["Subtract", "相减"], ["Subtract the benchmarks.", "用基准数相减。"], [`${dq(Q.of(k1, 2))} - ${dq(Q.of(k2, 2))} = ${dq(est)}`]],
        ],
        [`The exact difference $${fix(a - b, 2)}$ is closest to $${dq(est)}$.`, `准确的差 $${fix(a - b, 2)}$ 最接近 $${dq(est)}$。`],
        decLine(0, 1, 0.1, [b / 100, a / 100]),
      );
    }
  },
  decLine(0, 1, 0.1, [0.47, 0.91]),
);

/** whereADigitLandsAfterMultiplying names the place a digit moves to when a decimal is multiplied by a power of ten. */
export const whereADigitLandsAfterMultiplying = point(
  "where-a-digit-lands-after-multiplying",
  ["Where a digit lands after multiplying", "乘后数字落在哪一位"],
  [
    "In $0.372 \\times 100$, the 7 is in the hundredths. Times 100 moves it 2 places left, to the ones: $37.2$.\n\nCheck: in $37.2$ the 7 is in the ones place.\n\n> **Watch out.** The digit moves left by one place for each zero.",
    "在 $0.372 \\times 100$ 中，7 在百分位上。乘 100 使它往左移两位，到了个位：$37.2$。\n\n检验：在 $37.2$ 中，7 在个位上。\n\n> **注意。** 有几个 0，数字就往左移几位。",
  ],
  (rng) => {
    const k = rng.int(1, 2);
    const from = rng.int(k, 3);
    const to = from - k;
    const { n, digit } = numberWithDigitOnce(rng, from);
    const name = (j: number): Pair => [`the ${placeName(j).en}`, placeName(j)["zh-CN"]];
    const others = [from, to + 1, to - 1, to - 2, to + 2]
      .filter((j, i, xs) => j >= -2 && j <= 3 && j !== to && xs.indexOf(j) === i)
      .slice(0, 3);
    return picked(
      rng,
      [
        `In $${fix(n, 3)} \\times ${pow10(k)}$, which place does the ${digit} move to?`,
        `计算 $${fix(n, 3)} \\times ${pow10(k)}$ 时，数字 ${digit} 移到了哪一位？`,
      ],
      name(to),
      others.map(
        (j): Wrong => [
          name(j),
          j === from
            ? "That is where the digit starts."
            : j > from
              ? "That moves the digit to the right, which divides."
              : `That moves ${from - j} place${from - j === 1 ? "" : "s"}, not ${k}.`,
          j === from ? "这是数字原来的数位。" : j > from ? "这是往右移了，是除法。" : `这是移了 ${from - j} 位，不是 ${k} 位。`,
        ],
      ),
      [
        [
          ["Find the place", "找原来的数位"],
          [`The ${digit} is in the ${placeName(from).en} place.`, `${digit} 在${placeName(from)["zh-CN"]}上。`],
        ],
        [
          ["Move it", "移动"],
          [`Times ${pow10(k)} moves it ${k} place${k === 1 ? "" : "s"} to the left.`, `乘 ${pow10(k)}，它往左移 ${k} 位。`],
        ],
      ],
      [
        `Work it out: $${fix(n, 3)} \\times ${pow10(k)} = ${dq(shifted(n, 3, k))}$, with the ${digit} in the ${placeName(to).en} place.`,
        `算一算：$${fix(n, 3)} \\times ${pow10(k)} = ${dq(shifted(n, 3, k))}$，${digit} 在${placeName(to)["zh-CN"]}上。`,
      ],
      shiftChart(n, 3, k),
    );
  },
  shiftChart(372, 3, 2),
);

/** theNumberBeforeMultiplying finds the decimal that a power of ten turned into a given product. */
export const theNumberBeforeMultiplying = point(
  "the-number-before-multiplying",
  ["The number before multiplying", "乘之前的数"],
  [
    "$\\square \\times 100 = 52.3$. Undo it by moving the point 2 places back to the left: $\\square = 0.523$.\n\nCheck: $0.523 \\times 100 = 52.3$.\n\n> **Watch out.** To find the number before, move the point the other way. $5{,}230$ moves it the wrong way.",
    "$\\square \\times 100 = 52.3$。倒过来，把小数点向左移回两位：$\\square = 0.523$。\n\n检验：$0.523 \\times 100 = 52.3$。\n\n> **注意。** 求乘之前的数，小数点要往反方向移。$5230$ 是移错了方向。",
  ],
  (rng) => {
    const p = rng.int(1, 2);
    const k = rng.int(1, 3 - p);
    const n = rng.int(1, 99) * pow10(p) + nonZeroEnd(rng, p);
    const r = D(n, p);
    const before = shifted(n, p, -k);
    const f = pow10(k);
    return answered(
      [
        `Find the missing number: $\\square \\times ${texCommas(f)} = ${fix(n, p)}$.`,
        `求方框里的数：$\\square \\times ${texCommas(f)} = ${fix(n, p)}$。`,
      ],
      before,
      [
        [
          ["Undo the multiplying", "倒过来想"],
          [
            `Times ${texCommas(f)} moved the point ${k} place${k === 1 ? "" : "s"} right, so move it back left.`,
            `乘 ${texCommas(f)} 使小数点右移 ${k} 位，所以要左移回去。`,
          ],
        ],
        [["Move the point", "移动小数点"], ["Write zeros in front if needed.", "需要时在前面补 0。"], [`\\square = ${dq(before)}`]],
      ],
      [`Multiply: $${dq(before)} \\times ${texCommas(f)} = ${dq(r)}$.`, `乘一乘：$${dq(before)} \\times ${texCommas(f)} = ${dq(r)}$。`],
      [
        [shifted(n, p, k), "That moves the point the wrong way.", "小数点移错了方向。"],
        [shifted(n, p, -k + 1), "That moves the point one place too few.", "小数点少移了一位。"],
        [shifted(n, p, -k - 1), "That moves the point one place too many.", "小数点多移了一位。"],
      ],
      { form: "decimal", figure: shiftChart(Number(pairOf(before)[0]), pairOf(before)[1], k) },
    );
  },
  shiftChart(523, 3, 2),
);

/** theProductOfAboutTheRightSize places the point in a product by estimating. */
export const theProductOfAboutTheRightSize = point(
  "the-product-of-about-the-right-size",
  ["The product of about the right size", "大小合适的积"],
  [
    "$4.8 \\times 6.1$ is about $5 \\times 6 = 30$, so of $2.928$, $29.28$ and $292.8$, the product is $29.28$.\n\nCheck: $29.28$ is close to the estimate 30.\n\n> **Watch out.** The digits are the same in every choice. Only the estimate tells where the point goes.",
    "$4.8 \\times 6.1$ 约是 $5 \\times 6 = 30$，所以在 $2.928$、$29.28$、$292.8$ 中，积是 $29.28$。\n\n检验：$29.28$ 接近估算值 30。\n\n> **注意。** 几个选项的数字都一样，只有估算才能确定小数点的位置。",
  ],
  (rng) => {
    const a = decimalNotHalf(rng, 2, 12, 1);
    const b = decimalNotHalf(rng, 2, 12, 1);
    const exact = D(a * b, 2);
    const [ra, rb] = [roundWhole(a, 1), roundWhole(b, 1)];
    return pickedMath(
      rng,
      [`Which is the value of $${fix(a, 1)} \\times ${fix(b, 1)}$?`, `$${fix(a, 1)} \\times ${fix(b, 1)}$ 的值是哪一个？`],
      dq(exact),
      [
        [dq(D(a * b, 3)), `That is 10 times too small: the estimate is ${ra * rb}.`, `这小了 10 倍：估算值是 ${ra * rb}。`],
        [dq(D(a * b, 1)), `That is 10 times too large: the estimate is ${ra * rb}.`, `这大了 10 倍：估算值是 ${ra * rb}。`],
        [dq(D(a * b, 4)), `That is 100 times too small: the estimate is ${ra * rb}.`, `这小了 100 倍：估算值是 ${ra * rb}。`],
      ],
      [
        [["Estimate", "估算"], ["Round both factors to whole numbers.", "把两个因数都取整。"], [`${ra} \\times ${rb} = ${ra * rb}`]],
        [
          ["Place the point", "确定小数点"],
          [`Pick the choice close to ${ra * rb}.`, `选接近 ${ra * rb} 的那个。`],
        ],
      ],
      [
        `Each factor has one place after the point, so the product has two: $${dq(exact)}$.`,
        `每个因数都是一位小数，所以积是两位小数：$${dq(exact)}$。`,
      ],
      productArea(fix(a, 1), fix(b, 1), `≈ ${ra * rb}`),
    );
  },
  productArea("4.8", "6.1", "≈ 30"),
);

/** changeFromAPurchase finds the change after buying a few items at a decimal price. */
export const changeFromAPurchase = point(
  "change-from-a-purchase",
  ["Change from a purchase", "购物找零"],
  [
    "Lily buys 3 notebooks at $4.25$ yuan each and pays 20 yuan. Cost: $3 \\times 4.25 = 12.75$. Change: $20 - 12.75 = 7.25$ yuan.\n\nCheck: $7.25 + 12.75 = 20$.\n\n> **Watch out.** Multiply first to get the cost. Subtracting the price of one notebook gives the wrong change.",
    "莉莉买了 3 本笔记本，每本 $4.25$ 元，付了 20 元。总价：$3 \\times 4.25 = 12.75$。找零：$20 - 12.75 = 7.25$ 元。\n\n检验：$7.25 + 12.75 = 20$。\n\n> **注意。** 先用乘法算总价。只减一本的价钱，找零就错了。",
  ],
  (rng) => {
    const price = nonZeroEnd(rng, 3);
    const k = rng.int(2, 9);
    const pay = (Math.floor((k * price) / 1000) + 1) * 1000;
    return changeAnswer(k, price, pay, ["notebooks", "本笔记本"]);
  },
  tapeFigure(
    [
      {
        total: "20",
        pieces: [
          { size: 1275, text: "12.75", lit: true },
          { size: 725, text: "?", dashed: true },
        ],
      },
    ],
    [
      "A bar for 20 yuan with the cost 12.75 shaded and the change marked with a question mark.",
      "一个表示 20 元的长条，总价 12.75 涂了颜色，找零标着问号。",
    ],
  ),
);

/** changeFromABulkPurchase finds the change after buying many items at a decimal price. */
export const changeFromABulkPurchase = point(
  "change-from-a-bulk-purchase",
  ["Change from a bulk purchase", "批量购买的找零"],
  [
    "A class buys 24 pens at $1.35$ yuan each and pays 50 yuan. Cost: $24 \\times 1.35 = 32.4$. Change: $50 - 32.40 = 17.6$ yuan.\n\nCheck: estimate $24 \\times 1.35$ as about $24 \\times 1.5 = 36$, so the change is a bit more than 14.\n\n> **Watch out.** Write the cost with two places, $32.40$, before subtracting.",
    "一个班买了 24 支笔，每支 $1.35$ 元，付了 50 元。总价：$24 \\times 1.35 = 32.4$。找零：$50 - 32.40 = 17.6$ 元。\n\n检验：$24 \\times 1.35$ 约是 $24 \\times 1.5 = 36$，所以找零比 14 多一些。\n\n> **注意。** 相减前把总价写成两位小数 $32.40$。",
  ],
  (rng) => {
    const k = rng.int(11, 28);
    const price = rng.int(26, 95) * 5;
    const pay = (Math.floor((k * price) / 5000) + 1) * 5000;
    return changeAnswer(k, price, pay, ["pens", "支笔"]);
  },
  tapeFigure(
    [
      {
        total: "50",
        pieces: [
          { size: 3240, text: "32.4", lit: true },
          { size: 1760, text: "?", dashed: true },
        ],
      },
    ],
    [
      "A bar for 50 yuan with the cost 32.4 shaded and the change marked with a question mark.",
      "一个表示 50 元的长条，总价 32.4 涂了颜色，找零标着问号。",
    ],
  ),
);

/** aDecimalProductFromAWholeNumberProduct places the point in a decimal product given the whole-number product. */
export const aDecimalProductFromAWholeNumberProduct = point(
  "a-decimal-product-from-a-whole-number-product",
  ["A decimal product from a whole-number product", "由整数的积求小数的积"],
  [
    "Given $23 \\times 16 = 368$, find $2.3 \\times 0.16$. The factors have $1 + 2 = 3$ places, so the product is $0.368$.\n\nCheck: $2 \\times 0.16 = 0.32$ is close to $0.368$.\n\n> **Watch out.** The digits stay 3, 6, 8. Only the point moves.",
    "已知 $23 \\times 16 = 368$，求 $2.3 \\times 0.16$。两个因数共有 $1 + 2 = 3$ 位小数，所以积是 $0.368$。\n\n检验：$2 \\times 0.16 = 0.32$，接近 $0.368$。\n\n> **注意。** 数字还是 3、6、8，只是小数点的位置变了。",
  ],
  (rng) => {
    let [a, b] = [rng.int(11, 99), rng.int(11, 99)];
    while (a % 10 === 0 || b % 10 === 0) [a, b] = [rng.int(11, 99), rng.int(11, 99)];
    const [p, q] = [rng.int(1, 2), rng.int(1, 2)];
    const P = p + q;
    const v = D(a * b, P);
    return answered(
      [
        `Given $${a} \\times ${b} = ${texCommas(a * b)}$, find $${fix(a, p)} \\times ${fix(b, q)}$.`,
        `已知 $${a} \\times ${b} = ${texCommas(a * b)}$，求 $${fix(a, p)} \\times ${fix(b, q)}$。`,
      ],
      v,
      [
        [
          ["Count the places", "数小数位数"],
          [`The factors have $${p} + ${q} = ${P}$ decimal places.`, `两个因数共有 $${p} + ${q} = ${P}$ 位小数。`],
        ],
        [
          ["Place the point", "点小数点"],
          [`Count ${P} places from the right of ${a * b}.`, `从 ${a * b} 的右边数出 ${P} 位。`],
          [`${fix(a, p)} \\times ${fix(b, q)} = ${dq(v)}`],
        ],
      ],
      [`Add the parts of the area model: $${areaSum(a, p, b, q)}$.`, `把面积模型的各部分相加：$${areaSum(a, p, b, q)}$。`],
      [
        [D(a * b, P - 1), "That has one decimal place too few.", "小数位数少了一位。"],
        [D(a * b, P + 1), "That has one decimal place too many.", "小数位数多了一位。"],
        [D(a * b, Math.max(p, q)), "That counts the places of only one factor.", "这只数了一个因数的小数位数。"],
      ],
      { form: "decimal", figure: splitArea(a, p, b, q) },
    );
  },
  splitArea(23, 1, 16, 2),
);

/** decimalPlacesInAProduct counts the decimal places of a product before final zeros are dropped. */
export const decimalPlacesInAProduct = point(
  "decimal-places-in-a-product",
  ["Decimal places in a product", "积的小数位数"],
  [
    "How many decimal places does $3.14 \\times 0.6$ have? $2 + 1 = 3$: the product is $1.884$.\n\nCheck: $314 \\times 6 = 1884$, and 3 places give $1.884$.\n\n> **Watch out.** Add the places, do not multiply them: $2 + 1 = 3$, not $2 \\times 1 = 2$.",
    "$3.14 \\times 0.6$ 的积有几位小数？$2 + 1 = 3$ 位：积是 $1.884$。\n\n检验：$314 \\times 6 = 1884$，点出 3 位小数是 $1.884$。\n\n> **注意。** 小数位数要相加，不是相乘：$2 + 1 = 3$，不是 $2 \\times 1 = 2$。",
  ],
  (rng) => {
    const p = rng.int(1, 2);
    const q = rng.int(1, 3 - p);
    const a = rng.int(11, 99) * 10 + rng.int(1, 9);
    const b = nonZeroEnd(rng, 2);
    const P = p + q;
    return answered(
      [
        `How many decimal places does $${fix(a, p)} \\times ${fix(b, q)}$ have, before any zeros at the end are dropped?`,
        `$${fix(a, p)} \\times ${fix(b, q)}$ 的积在去掉末尾的 0 之前有几位小数？`,
      ],
      P,
      [
        [
          ["Count each factor", "数每个因数"],
          [`$${fix(a, p)}$ has ${p} and $${fix(b, q)}$ has ${q}.`, `$${fix(a, p)}$ 有 ${p} 位，$${fix(b, q)}$ 有 ${q} 位。`],
        ],
        [["Add", "相加"], ["Add the two counts.", "把两个位数相加。"], [`${p} + ${q} = ${P}`]],
      ],
      [
        `Work it out: $${a} \\times ${b} = ${texCommas(a * b)}$, and ${P} places give $${fix(a * b, P)}$.`,
        `算一算：$${a} \\times ${b} = ${texCommas(a * b)}$，点出 ${P} 位小数是 $${fix(a * b, P)}$。`,
      ],
      [
        [Math.max(p, q), "That counts only the factor with more places.", "这只数了位数多的那个因数。"],
        [p * q, "That multiplies the counts instead of adding them.", "这是把位数相乘了，应该相加。"],
        [P + 1, "That counts one place too many.", "这多数了一位。"],
      ],
      {
        figure: placeChart([
          [a, p],
          [b, q],
          [a * b, P],
        ]),
      },
    );
  },
  placeChart([
    [314, 2],
    [6, 1],
    [1884, 3],
  ]),
);

/** usingAWholeNumberProduct picks the decimal product that matches a whole-number product. */
export const usingAWholeNumberProduct = point(
  "using-a-whole-number-product",
  ["Using a whole-number product", "利用整数的积"],
  [
    "Given $245 \\times 132 = 32{,}340$, then $2.45 \\times 1.32$ has $2 + 2 = 4$ places: $3.2340 = 3.234$.\n\nCheck: $2 \\times 1 = 2$ and $3 \\times 1 = 3$, so the product is between 2 and 4, and $3.234$ is.\n\n> **Watch out.** Count the 0 at the end of $32{,}340$ when placing the point, and drop it afterwards.",
    "已知 $245 \\times 132 = 32340$，$2.45 \\times 1.32$ 有 $2 + 2 = 4$ 位小数：$3.2340 = 3.234$。\n\n检验：$2 \\times 1 = 2$，$3 \\times 1 = 3$，所以积在 2 和 4 之间，$3.234$ 正好在这里。\n\n> **注意。** 点小数点时，$32340$ 末尾的 0 也要数，点好后再去掉。",
  ],
  (rng) => {
    const [a, b] = [rng.int(101, 999), rng.int(101, 999)];
    const [p, q] = [rng.int(1, 2), rng.int(1, 2)];
    const P = p + q;
    const product = a * b;
    const [x, y] = [a / pow10(p), b / pow10(q)];
    const est = lead(x) * lead(y);
    return pickedMath(
      rng,
      [
        `Given $${a} \\times ${b} = ${texCommas(product)}$, which is $${fix(a, p)} \\times ${fix(b, q)}$?`,
        `已知 $${a} \\times ${b} = ${texCommas(product)}$，$${fix(a, p)} \\times ${fix(b, q)}$ 等于哪一个？`,
      ],
      dq(D(product, P)),
      [
        [dq(D(product, P + 1)), "That has one decimal place too many.", "小数位数多了一位。"],
        [dq(D(product, P - 1)), "That has one decimal place too few.", "小数位数少了一位。"],
        [dq(D(product, P + 2)), "That has two decimal places too many.", "小数位数多了两位。"],
      ],
      [
        [
          ["Count the places", "数小数位数"],
          [`$${p} + ${q} = ${P}$ decimal places.`, `共 $${p} + ${q} = ${P}$ 位小数。`],
        ],
        [
          ["Place the point", "点小数点"],
          [`Count ${P} places from the right of $${texCommas(product)}$.`, `从 $${texCommas(product)}$ 的右边数出 ${P} 位。`],
          [`${fix(a, p)} \\times ${fix(b, q)} = ${dq(D(product, P))}`],
        ],
      ],
      [
        `Estimate: $${fix(a, p)} \\approx ${lead(x)}$ and $${fix(b, q)} \\approx ${lead(y)}$, so the product is about ${est}.`,
        `估算：$${fix(a, p)} \\approx ${lead(x)}$，$${fix(b, q)} \\approx ${lead(y)}$，所以积约是 ${est}。`,
      ],
      productArea(fix(a, p), fix(b, q), `≈ ${est}`),
    );
  },
  productArea("2.45", "1.32", "≈ 3"),
);

/** whereADigitLandsAfterDividing names the place a digit moves to when a decimal is divided by a power of ten. */
export const whereADigitLandsAfterDividing = point(
  "where-a-digit-lands-after-dividing",
  ["Where a digit lands after dividing", "除后数字落在哪一位"],
  [
    "In $485.2 \\div 100$, the 8 is in the tens place. Divided by 100 it moves 2 places to the right, to the tenths: $4.852$.\n\nCheck: in $4.852$ the 8 is in the tenths place.\n\n> **Watch out.** Dividing moves digits to the right, toward the smaller places.",
    "在 $485.2 \\div 100$ 中，8 在十位上。除以 100 使它往右移两位，到了十分位：$4.852$。\n\n检验：在 $4.852$ 中，8 在十分位上。\n\n> **注意。** 除法使数字往右移，移到更小的数位。",
  ],
  (rng) => {
    for (;;) {
      const k = rng.int(1, 2);
      const from = rng.int(-2, 0);
      const to = from + k;
      const n = rng.int(1001, 9999);
      const digit = digitAtPlace(n, 1, from);
      if (n % 10 === 0 || digit === 0 || [...String(n)].filter((c) => Number(c) === digit).length !== 1) continue;
      const name = (j: number): Pair => [`the ${placeName(j).en}`, placeName(j)["zh-CN"]];
      const others = [from, to - 1, to + 1, to + 2].filter((j, i, xs) => j >= -2 && j <= 3 && j !== to && xs.indexOf(j) === i).slice(0, 3);
      return picked(
        rng,
        [
          `In $${fix(n, 1)} \\div ${pow10(k)}$, which place does the ${digit} move to?`,
          `计算 $${fix(n, 1)} \\div ${pow10(k)}$ 时，数字 ${digit} 移到了哪一位？`,
        ],
        name(to),
        others.map(
          (j): Wrong => [
            name(j),
            j === from
              ? "That is where the digit starts."
              : j < from
                ? "That moves the digit to the left, which multiplies."
                : `That moves ${j - from} place${j - from === 1 ? "" : "s"}, not ${k}.`,
            j === from ? "这是数字原来的数位。" : j < from ? "这是往左移了，是乘法。" : `这是移了 ${j - from} 位，不是 ${k} 位。`,
          ],
        ),
        [
          [
            ["Find the place", "找原来的数位"],
            [`The ${digit} is in the ${placeName(from).en} place.`, `${digit} 在${placeName(from)["zh-CN"]}上。`],
          ],
          [
            ["Move it", "移动"],
            [`Divided by ${pow10(k)}, it moves ${k} place${k === 1 ? "" : "s"} to the right.`, `除以 ${pow10(k)}，它往右移 ${k} 位。`],
          ],
        ],
        [
          `Work it out: $${fix(n, 1)} \\div ${pow10(k)} = ${dq(shifted(n, 1, -k))}$, with the ${digit} in the ${placeName(to).en} place.`,
          `算一算：$${fix(n, 1)} \\div ${pow10(k)} = ${dq(shifted(n, 1, -k))}$，${digit} 在${placeName(to)["zh-CN"]}上。`,
        ],
        shiftChart(n, 1, -k),
      );
    }
  },
  shiftChart(4852, 1, -2),
);

/** theNumberBeforeDividing finds the decimal that a power of ten divided into a given quotient. */
export const theNumberBeforeDividing = point(
  "the-number-before-dividing",
  ["The number before dividing", "除之前的数"],
  [
    "$\\square \\div 100 = 0.36$. Undo it by moving the point 2 places back to the right: $\\square = 36$.\n\nCheck: $36 \\div 100 = 0.36$.\n\n> **Watch out.** To find the number before, move the point the other way. $0.0036$ moves it the wrong way.",
    "$\\square \\div 100 = 0.36$。倒过来，把小数点向右移回两位：$\\square = 36$。\n\n检验：$36 \\div 100 = 0.36$。\n\n> **注意。** 求除之前的数，小数点要往反方向移。$0.0036$ 是移错了方向。",
  ],
  (rng) => {
    const p = rng.int(1, 3);
    const n = nonZeroEnd(rng, rng.int(2, 3));
    const k = rng.int(1, Math.min(3, 4 - String(n).length + p));
    const before = shifted(n, p, k);
    const f = pow10(k);
    const shown = before.isInteger() ? texCommas(before.toNumber()) : dq(before);
    const [bn, bp] = pairOf(before);
    return answered(
      [
        `Find the missing number: $\\square \\div ${texCommas(f)} = ${fix(n, p)}$.`,
        `求方框里的数：$\\square \\div ${texCommas(f)} = ${fix(n, p)}$。`,
      ],
      before,
      [
        [
          ["Undo the dividing", "倒过来想"],
          [
            `Dividing by ${texCommas(f)} moved the point ${k} place${k === 1 ? "" : "s"} left, so move it back right.`,
            `除以 ${texCommas(f)} 使小数点左移 ${k} 位，所以要右移回去。`,
          ],
        ],
        [["Move the point", "移动小数点"], ["Write zeros at the end if needed.", "需要时在末尾补 0。"], [`\\square = ${shown}`]],
      ],
      [`Divide: $${shown} \\div ${texCommas(f)} = ${fix(n, p)}$.`, `除一除：$${shown} \\div ${texCommas(f)} = ${fix(n, p)}$。`],
      [
        [shifted(n, p, -k), "That moves the point the wrong way.", "小数点移错了方向。"],
        [shifted(n, p, k - 1), "That moves the point one place too few.", "小数点少移了一位。"],
        [shifted(n, p, k + 1), "That moves the point one place too many.", "小数点多移了一位。"],
      ],
      { form: "decimal", figure: shiftChart(bn, bp, -k) },
    );
  },
  shiftChart(36, 0, -2),
);

/** theQuotientOfAboutTheRightSize picks the quotient that compatible numbers say is about a given size. */
export const theQuotientOfAboutTheRightSize = point(
  "the-quotient-of-about-the-right-size",
  ["The quotient of about the right size", "大小合适的商"],
  [
    "Which is about 6: $23.8 \\div 3.9$ or $2.38 \\div 3.9$? $23.8 \\div 3.9 \\approx 24 \\div 4 = 6$, while $2.38 \\div 3.9$ is less than 1.\n\nCheck: $6 \\times 3.9 = 23.4$, close to $23.8$.\n\n> **Watch out.** Moving the point in either number changes the quotient ten times. Estimate each one.",
    "哪个约是 6：$23.8 \\div 3.9$ 还是 $2.38 \\div 3.9$？$23.8 \\div 3.9 \\approx 24 \\div 4 = 6$，而 $2.38 \\div 3.9$ 比 1 还小。\n\n检验：$6 \\times 3.9 = 23.4$，接近 $23.8$。\n\n> **注意。** 任何一个数的小数点移动一位，商就变化 10 倍。每个都要估算。",
  ],
  (rng) => {
    const q = rng.int(3, 9);
    const d = rng.int(2, 9);
    const dd = d * 10 + rng.pick([-1, 1, 2]);
    const nn = q * d * 10 + rng.pick([-2, -1, 1, 2]);
    return pickedMath(
      rng,
      [`Which quotient is about ${q}?`, `哪个商约是 ${q}？`],
      `${fix(nn, 1)} \\div ${fix(dd, 1)}`,
      [
        [
          `${fix(nn, 2)} \\div ${fix(dd, 1)}`,
          `That is about $${dq(D(q * d, 1))} \\div ${d}$, which is 10 times too small.`,
          `它约是 $${dq(D(q * d, 1))} \\div ${d}$，小了 10 倍。`,
        ],
        [
          `${nn} \\div ${fix(dd, 1)}`,
          `That is about $${q * d * 10} \\div ${d}$, which is 10 times too large.`,
          `它约是 $${q * d * 10} \\div ${d}$，大了 10 倍。`,
        ],
        [
          `${fix(nn, 1)} \\div ${fix(dd, 2)}`,
          `That divides by about $${dq(D(d, 1))}$, so it is 10 times too large.`,
          `它除以的约是 $${dq(D(d, 1))}$，所以大了 10 倍。`,
        ],
      ],
      [
        [
          ["Compatible numbers", "找相容数"],
          [
            `$${fix(dd, 1)} \\approx ${d}$ and $${fix(nn, 1)} \\approx ${q * d}$.`,
            `$${fix(dd, 1)} \\approx ${d}$，$${fix(nn, 1)} \\approx ${q * d}$。`,
          ],
        ],
        [["Divide", "相除"], ["Use the basic fact.", "用乘法口诀。"], [`${q * d} \\div ${d} = ${q}`]],
      ],
      [
        `Multiply back: $${q} \\times ${fix(dd, 1)} = ${dq(D(q * dd, 1))}$, close to $${fix(nn, 1)}$.`,
        `乘回去：$${q} \\times ${fix(dd, 1)} = ${dq(D(q * dd, 1))}$，接近 $${fix(nn, 1)}$。`,
      ],
      divTape(`≈ ${q * d}`, d, "?"),
    );
  },
  divTape("≈ 24", 4, "6"),
);

/** piecesMeasuredInASmallerUnit divides a length in meters and gives each piece in centimeters. */
export const piecesMeasuredInASmallerUnit = point(
  "pieces-measured-in-a-smaller-unit",
  ["Pieces measured in a smaller unit", "用较小单位表示每段长度"],
  [
    "A rope $1.35$ m long is cut into 3 equal pieces. $1.35$ m is 135 cm, and $135 \\div 3 = 45$, so each piece is 45 cm.\n\nCheck: $1.35 \\div 3 = 0.45$ m, which is 45 cm.\n\n> **Watch out.** 1 m is 100 cm, so $1.35$ m is 135 cm, not $13.5$ cm.",
    "一根 $1.35$ 米的绳子平均剪成 3 段。$1.35$ 米是 135 厘米，$135 \\div 3 = 45$，所以每段 45 厘米。\n\n检验：$1.35 \\div 3 = 0.45$ 米，也就是 45 厘米。\n\n> **注意。** 1 米是 100 厘米，所以 $1.35$ 米是 135 厘米，不是 $13.5$ 厘米。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const each = rng.int(2, 40) * 5;
    const total = k * each;
    return answered(
      [
        `A rope $${fix(total, 2)}$ m long is cut into ${k} equal pieces. How many centimeters long is each piece?`,
        `一根 $${fix(total, 2)}$ 米长的绳子平均剪成 ${k} 段。每段多少厘米？`,
      ],
      each,
      [
        [
          ["Change to centimeters", "换成厘米"],
          ["1 m is 100 cm.", "1 米是 100 厘米。"],
          [`${fix(total, 2)}\\text{ m} = ${total}\\text{ cm}`],
        ],
        [["Divide", "相除"], ["Share the centimeters equally.", "把厘米数平均分。"], [`${total} \\div ${k} = ${each}`]],
      ],
      [
        `Divide in meters: $${fix(total, 2)} \\div ${k} = ${dq(D(each, 2))}$ m, which is ${each} cm.`,
        `用米来除：$${fix(total, 2)} \\div ${k} = ${dq(D(each, 2))}$ 米，也就是 ${each} 厘米。`,
      ],
      [
        [D(each, 2), "That is the answer in meters, not centimeters.", "这是以米为单位的答案，不是厘米。"],
        [total, "That is the whole rope, not one piece.", "这是整根绳子，不是一段。"],
        [each * 10, "That uses 1,000 cm in a meter.", "这是把 1 米当成了 1000 厘米。"],
      ],
      { figure: divTape(`${fix(total, 2)} m`, k, "?") },
    );
  },
  divTape("1.35 m", 3, "45 cm"),
);

/** aFractionAsATerminatingDecimal writes a fraction as a decimal by dividing the top by the bottom. */
export const aFractionAsATerminatingDecimal = point(
  "a-fraction-as-a-terminating-decimal",
  ["A fraction as a decimal", "把分数写成小数"],
  [
    "$\\frac{3}{8}$ means $3 \\div 8$. Write $3.000$ and divide: $3 \\div 8 = 0.375$.\n\nCheck: $0.375 \\times 8 = 3$.\n\n> **Watch out.** Divide the top by the bottom. Writing the top as $0.3$ is wrong.",
    "$\\frac{3}{8}$ 就是 $3 \\div 8$。写成 $3.000$ 再除：$3 \\div 8 = 0.375$。\n\n检验：$0.375 \\times 8 = 3$。\n\n> **注意。** 用分子除以分母。直接写成 $0.3$ 是错的。",
  ],
  (rng) => {
    const d = rng.pick([4, 8, 8, 16, 20, 25, 40]);
    const n = rng.int(1, d - 1);
    const v = Q.of(n, d);
    const k = placesOf(v);
    return answered(
      [`Write $\\frac{${n}}{${d}}$ as a decimal.`, `把 $\\frac{${n}}{${d}}$ 写成小数。`],
      v,
      [
        [
          ["Write a division", "写成除法"],
          ["The fraction bar means divide.", "分数线表示除法。"],
          [`\\frac{${n}}{${d}} = ${n} \\div ${d}`],
        ],
        [
          ["Divide", "相除"],
          [
            `Write ${n} as $${n}.${"0".repeat(k)}$ and keep dividing after the point.`,
            `把 ${n} 写成 $${n}.${"0".repeat(k)}$，在小数点后继续除。`,
          ],
          [`${n} \\div ${d} = ${dq(v)}`],
        ],
      ],
      [`Multiply back: $${dq(v)} \\times ${d} = ${n}$.`, `乘回去：$${dq(v)} \\times ${d} = ${n}$。`],
      [
        [Q.of(n, 10), "That writes the top as tenths.", "这是把分子当成了十分之几。"],
        [Q.of(n, 100), "That writes the top as hundredths.", "这是把分子当成了百分之几。"],
        [v.mul(Q.of(10)), "That puts the point one place too far right.", "小数点往右偏了一位。"],
      ],
      { form: "decimal", figure: decLine(0, 1, d > 20 ? 0.1 : 1 / d, [n / d]) },
    );
  },
  decLine(0, 1, 0.125, [0.375]),
);

/** aBillToTheNearestCent splits a bill equally and rounds each share to the nearest hundredth of a yuan. */
export const aBillToTheNearestCent = point(
  "a-bill-to-the-nearest-cent",
  ["A bill to the nearest cent", "账单精确到分"],
  [
    "Seven friends split a bill of 50 yuan. $50 \\div 7 = 7.142\\ldots$. The thousandths digit is 2, so each pays about $7.14$ yuan.\n\nCheck: $7.14 \\times 7 = 49.98$, close to 50.\n\n> **Watch out.** Money is rounded to the hundredths, so look at the third decimal place.",
    "七个朋友平分 50 元的账单。$50 \\div 7 = 7.142\\cdots$。千分位是 2，所以每人约付 $7.14$ 元。\n\n检验：$7.14 \\times 7 = 49.98$，接近 50。\n\n> **注意。** 钱要精确到分，也就是百分位，所以要看第三位小数。",
  ],
  (rng) => {
    const k = rng.pick([3, 7, 9, 11, 13]);
    let bill = rng.int(10, 120);
    if (bill % k === 0) bill += 1;
    const cents = Math.round((bill * 100) / k);
    const cut = Math.floor((bill * 100) / k);
    const more = Math.floor((bill * 1000) / k);
    return answered(
      [
        `${k} friends split a bill of ${bill} yuan equally. To the nearest hundredth of a yuan, how much does each pay?`,
        `${k} 个朋友平分 ${bill} 元的账单。精确到分，每人付多少元？`,
      ],
      D(cents, 2),
      [
        [
          ["Divide to the thousandths", "除到千分位"],
          ["Go one place past the hundredths.", "比百分位多除一位。"],
          [`${bill} \\div ${k} = ${fix(more, 3)}\\ldots`],
        ],
        [
          ["Round to the hundredths", "四舍五入到百分位"],
          [`The thousandths digit is ${more % 10}.`, `千分位是 ${more % 10}。`],
          [`${bill} \\div ${k} \\approx ${fix(cents, 2)}`],
        ],
      ],
      [
        `Multiply back: $${fix(cents, 2)} \\times ${k} = ${fix(cents * k, 2)}$, close to ${bill}.`,
        `乘回去：$${fix(cents, 2)} \\times ${k} = ${fix(cents * k, 2)}$，接近 ${bill}。`,
      ],
      [
        cut === cents
          ? [D(cents + 1, 2), "That rounds up though the next digit is less than 5.", "下一位小于 5，却进了一。"]
          : [D(cut, 2), "That cuts off instead of rounding.", "这是直接截去，没有四舍五入。"],
        [D(Math.round(cents / 10), 1), "That rounds to the tenths, not the hundredths.", "这是保留到十分位，不是百分位。"],
        [Q.of(Math.floor(bill / k)).add(D(bill % k, 2)), "That writes the remainder as the decimal part.", "这是把余数当成了小数部分。"],
      ],
      { form: "decimal", figure: divTape(`${bill}`, k, "?") },
    );
  },
  divTape("50", 7, "?"),
);

/** comparingUnitPrices finds the lower price of one item from two packs of different sizes. */
export const comparingUnitPrices = point(
  "comparing-unit-prices",
  ["Comparing unit prices", "比较单价"],
  [
    "4 pens cost $6.20$ yuan and 6 pens cost $8.70$ yuan. One pen: $6.20 \\div 4 = 1.55$ and $8.70 \\div 6 = 1.45$. The pack of 6 is cheaper per pen, at $1.45$ yuan.\n\nCheck: $1.45 \\times 6 = 8.70$.\n\n> **Watch out.** Compare the price of one pen, not the price of the packs.",
    "4 支笔 $6.20$ 元，6 支笔 $8.70$ 元。一支的价钱：$6.20 \\div 4 = 1.55$，$8.70 \\div 6 = 1.45$。6 支装每支更便宜，是 $1.45$ 元。\n\n检验：$1.45 \\times 6 = 8.70$。\n\n> **注意。** 要比较一支笔的价钱，不是比较整包的价钱。",
  ],
  (rng) => {
    const [n1, n2] = rng.sample([3, 4, 5, 6, 8], 2) as [number, number];
    const u1 = rng.int(11, 59) * 5;
    let u2 = rng.int(11, 59) * 5;
    if (u2 === u1) u2 += 15;
    const low = Math.min(u1, u2);
    const pen = (n: number, u: number) => [`${fix(n * u, 2)} \\div ${n} = ${fix(u, 2)}`];
    return answered(
      [
        `A pack of ${n1} pens costs $${fix(n1 * u1, 2)}$ yuan, and a pack of ${n2} pens costs $${fix(n2 * u2, 2)}$ yuan. What is the lower price for one pen, in yuan?`,
        `${n1} 支装的笔卖 $${fix(n1 * u1, 2)}$ 元，${n2} 支装的卖 $${fix(n2 * u2, 2)}$ 元。较低的每支单价是多少元？`,
      ],
      D(low, 2),
      [
        [
          ["Find each unit price", "求每种的单价"],
          ["Divide the pack price by the number of pens.", "用整包的价钱除以支数。"],
          [...pen(n1, u1), ...pen(n2, u2)],
        ],
        [
          ["Compare", "比较"],
          ["The smaller one is the lower price.", "小的那个就是较低的单价。"],
          [`${fix(low, 2)} < ${fix(Math.max(u1, u2), 2)}`],
        ],
      ],
      [
        `Multiply back: $${fix(low, 2)} \\times ${low === u1 ? n1 : n2} = ${fix(low === u1 ? n1 * u1 : n2 * u2, 2)}$.`,
        `乘回去：$${fix(low, 2)} \\times ${low === u1 ? n1 : n2} = ${fix(low === u1 ? n1 * u1 : n2 * u2, 2)}$。`,
      ],
      [
        [D(Math.max(u1, u2), 2), "That is the higher unit price.", "这是较高的单价。"],
        [D(Math.min(n1 * u1, n2 * u2), 2), "That is the cheaper pack, not the price of one pen.", "这是较便宜的一整包，不是一支的价钱。"],
        [D(Math.abs(u1 - u2), 2), "That is the difference between the unit prices.", "这是两个单价的差。"],
      ],
      {
        form: "decimal",
        figure: tapeFigure(
          [
            { total: fix(n1 * u1, 2), pieces: Array.from({ length: n1 }, () => ({ size: u1, text: "?" })) },
            { total: fix(n2 * u2, 2), pieces: Array.from({ length: n2 }, () => ({ size: u2, text: "?" })) },
          ],
          [`Two bars for the two packs, cut into ${n1} and ${n2} equal parts.`, `两个长条表示两包，分别平均分成 ${n1} 份和 ${n2} 份。`],
        ),
      },
    );
  },
  tapeFigure(
    [
      { total: "6.20", pieces: Array.from({ length: 4 }, () => ({ size: 155, text: "1.55" })) },
      { total: "8.70", pieces: Array.from({ length: 6 }, () => ({ size: 145, text: "1.45" })) },
    ],
    ["Two bars for the two packs, cut into 4 and 6 equal parts.", "两个长条表示两包，分别平均分成 4 份和 6 份。"],
  ),
);

/** aDecimalQuotientFromAWholeNumberQuotient reuses a whole-number quotient when the numbers are divided by powers of ten. */
export const aDecimalQuotientFromAWholeNumberQuotient = point(
  "a-decimal-quotient-from-a-whole-number-quotient",
  ["A decimal quotient from a whole-number quotient", "由整数的商求小数的商"],
  [
    "Given $1288 \\div 23 = 56$, find $12.88 \\div 2.3$. Multiply both by 10: $128.8 \\div 23$. The dividend is now 10 times smaller than 1288, so the quotient is $5.6$.\n\nCheck: $5.6 \\times 2.3 = 12.88$.\n\n> **Watch out.** Dividing the divisor by 10 makes the quotient 10 times larger, not smaller.",
    "已知 $1288 \\div 23 = 56$，求 $12.88 \\div 2.3$。两个数都乘 10：$128.8 \\div 23$。被除数比 1288 小了 10 倍，所以商是 $5.6$。\n\n检验：$5.6 \\times 2.3 = 12.88$。\n\n> **注意。** 除数缩小 10 倍，商会扩大 10 倍，不是缩小。",
  ],
  (rng) => {
    const q = rng.int(12, 96);
    const d = rng.pick([...Array(40).keys()].map((i) => 11 + i).filter((v) => v % 10 !== 0));
    const n = q * d;
    const [sN, sD] = [rng.int(0, 2), rng.int(1, 2)];
    const answer = Q.of(q).mul(Q.of(pow10(sD), pow10(sN)));
    const [dn, dd] = [dq(D(n, sN)), dq(D(d, sD))];
    const m = pow10(sD);
    const newN = dq(D(n, sN).mul(Q.of(m)));
    return answered(
      [`Given $${n} \\div ${d} = ${q}$, find $${dn} \\div ${dd}$.`, `已知 $${n} \\div ${d} = ${q}$，求 $${dn} \\div ${dd}$。`],
      answer,
      [
        [
          ["Make the divisor whole", "把除数变成整数"],
          [`Multiply both numbers by ${m}.`, `两个数都乘 ${m}。`],
          [`${dn} \\div ${dd} = ${newN} \\div ${d}`],
        ],
        [
          ["Compare with the known division", "和已知的除法比较"],
          sN === sD
            ? [`The dividend is ${n} again, so the quotient is ${q}.`, `被除数又是 ${n}，所以商是 ${q}。`]
            : [
                `$${newN}$ is ${n} with the point moved ${Math.abs(sN - sD)} place${Math.abs(sN - sD) === 1 ? "" : "s"}, so the quotient ${q} moves the same way.`,
                `$${newN}$ 是 ${n} 的小数点移动了 ${Math.abs(sN - sD)} 位，所以商 ${q} 也同样移动。`,
              ],
          [`${newN} \\div ${d} = ${dq(answer)}`],
        ],
      ],
      [`Multiply back: $${dq(answer)} \\times ${dd} = ${dn}$.`, `乘回去：$${dq(answer)} \\times ${dd} = ${dn}$。`],
      [
        [answer.mul(Q.of(10)), "That is 10 times too large.", "这大了 10 倍。"],
        [answer.mul(Q.of(1, 10)), "That is 10 times too small.", "这小了 10 倍。"],
        [answer.mul(Q.of(100)), "That is 100 times too large.", "这大了 100 倍。"],
        [answer.mul(Q.of(1, 100)), "That is 100 times too small.", "这小了 100 倍。"],
      ],
      { form: "decimal", figure: divArea(dd, dn) },
    );
  },
  divArea("2.3", "12.88"),
);

/** theWholeNumberDivisorVersion picks the division with a whole-number divisor and the same quotient. */
export const theWholeNumberDivisorVersion = point(
  "the-whole-number-divisor-version",
  ["The version with a whole-number divisor", "把除数变成整数"],
  [
    "$37.45 \\div 0.7$: multiply both by 10 to get $374.5 \\div 7$. The quotient is the same.\n\nCheck: $374.5 \\div 7 = 53.5$ and $53.5 \\times 0.7 = 37.45$.\n\n> **Watch out.** Moving only the divisor's point changes the quotient.",
    "$37.45 \\div 0.7$：两个数都乘 10，得 $374.5 \\div 7$，商不变。\n\n检验：$374.5 \\div 7 = 53.5$，$53.5 \\times 0.7 = 37.45$。\n\n> **注意。** 只移动除数的小数点，商就变了。",
  ],
  (rng) => {
    let [a, b] = [rng.int(1001, 9999), rng.int(11, 99)];
    while (a % 10 === 0 || b % 10 === 0) [a, b] = [rng.int(1001, 9999), rng.int(11, 99)];
    const p = rng.int(1, 2);
    return pickedMath(
      rng,
      [
        `Which division has the same quotient as $${fix(a, p)} \\div ${fix(b, 1)}$ and a whole-number divisor?`,
        `哪个除法与 $${fix(a, p)} \\div ${fix(b, 1)}$ 的商相同，并且除数是整数？`,
      ],
      `${fix(a, p - 1)} \\div ${b}`,
      [
        [`${fix(a, p)} \\div ${b}`, "That moves only the divisor's point.", "这只移动了除数的小数点。"],
        [`${fix(a, p + 1)} \\div ${b}`, "That moves the dividend's point the wrong way.", "被除数的小数点移错了方向。"],
        [
          `${a} \\div ${fix(b, 1)}`,
          "That moves only the dividend's point, and the divisor is still a decimal.",
          "这只移动了被除数的小数点，除数还是小数。",
        ],
      ],
      [
        [
          ["How far", "移几位"],
          [`$${fix(b, 1)}$ has one decimal place, so multiply by 10.`, `$${fix(b, 1)}$ 有一位小数，所以乘 10。`],
        ],
        [
          ["Multiply both", "两个数都乘"],
          ["Both points move one place to the right.", "两个小数点都向右移一位。"],
          [`${fix(a, p)} \\div ${fix(b, 1)} = ${fix(a, p - 1)} \\div ${b}`],
        ],
      ],
      [
        `Both numbers are multiplied by 10: $${fix(b, 1)} \\times 10 = ${b}$ and $${fix(a, p)} \\times 10 = ${fix(a, p - 1)}$.`,
        `两个数都乘 10：$${fix(b, 1)} \\times 10 = ${b}$，$${fix(a, p)} \\times 10 = ${fix(a, p - 1)}$。`,
      ],
      divArea(fix(b, 1), fix(a, p)),
    );
  },
  divArea("0.7", "37.45"),
);

/** zerosInAProductOfPowersOfTen asks how many zeros a product of two powers of ten has. */
export const zerosInAProductOfPowersOfTen = point(
  "zeros-in-a-product-of-powers-of-ten",
  ["Zeros in a product of powers of ten", "10 的乘方相乘，积有几个 0"],
  [
    "$10^2 \\times 10^3 = 100 \\times 1{,}000 = 100{,}000$: 2 zeros and 3 zeros make 5 zeros.\n\nCheck: count the tens. Two tens and three tens make five tens multiplied, and $10^5 = 100{,}000$.\n\n> **Watch out.** Add the exponents, do not multiply them: 6 zeros is wrong.",
    "$10^2 \\times 10^3 = 100 \\times 1{,}000 = 100{,}000$：2 个 0 和 3 个 0 合起来是 5 个 0。\n\n检验：数一数 10 的个数。两个 10 和三个 10，一共五个 10 相乘，$10^5 = 100{,}000$。\n\n> **注意。** 指数要相加，不是相乘：6 个 0 是错的。",
  ],
  (rng) => {
    const [a, b] = [rng.int(1, 6), rng.int(1, 6)];
    return answered(
      [`How many zeros does $10^{${a}} \\times 10^{${b}}$ have when written out?`, `把 $10^{${a}} \\times 10^{${b}}$ 写出来，有几个 0？`],
      a + b,
      [
        [
          ["Count each power's zeros", "数每个乘方的 0"],
          [`$10^{${a}}$ has ${a} and $10^{${b}}$ has ${b}.`, `$10^{${a}}$ 有 ${a} 个，$10^{${b}}$ 有 ${b} 个。`],
        ],
        [
          ["Put them together", "合起来"],
          ["Every factor of 10 adds one zero to the product.", "每个因数 10 都给积添一个 0。"],
          [`${a} + ${b} = ${a + b}`],
        ],
      ],
      [
        `Count the tens instead: ${a} tens and ${b} tens make $10^{${a + b}}$, which is 1 with ${a + b} zeros.`,
        `换个方法数 10 的个数：${a} 个 10 和 ${b} 个 10 合起来是 $10^{${a + b}}$，即 1 后面跟 ${a + b} 个 0。`,
      ],
      [
        [a * b, "That multiplies the exponents instead of adding them.", "这是把指数相乘，不是相加。"],
        [Math.max(a, b), "That counts the zeros of only one power.", "这只数了一个乘方的 0。"],
        [a + b + 1, "That counts the 1 as well.", "这把 1 也数进去了。"],
      ],
      { figure: a + b <= 6 ? digitsChart([pow10(a), pow10(b)]) : undefined },
    );
  },
  digitsChart([100, 1000, 100000]),
);

/** findingAMissingBase asks for the base that gives a power its value. */
export const findingAMissingBase = point(
  "finding-a-missing-base",
  ["Finding a missing base", "求缺少的底数"],
  [
    "$\\square^3 = 64$: try bases. $3^3 = 27$ is too small, and $4^3 = 64$. The base is 4.\n\nCheck: $64 \\div 4 = 16$, $16 \\div 4 = 4$, $4 \\div 4 = 1$: three 4s.\n\n> **Watch out.** Do not divide by the exponent. $64 \\div 3$ is not the base.",
    "$\\square^3 = 64$：试一试。$3^3 = 27$ 太小，$4^3 = 64$。底数是 4。\n\n检验：$64 \\div 4 = 16$，$16 \\div 4 = 4$，$4 \\div 4 = 1$：正好三个 4。\n\n> **注意。** 不能用指数去除。$64 \\div 3$ 不是底数。",
  ],
  (rng) => {
    const e = rng.int(2, 4);
    const answer = rng.int(2, e === 2 ? 25 : e === 3 ? 12 : 7);
    const value = answer ** e;
    const below = (answer - 1) ** e;
    const chain = Array.from({ length: e }, (_, i) => `${big(value / answer ** i)} \\div ${answer} = ${big(value / answer ** (i + 1))}`);
    return answered(
      [
        `What whole number makes this true? $\\square^{${e}} = ${big(value)}$`,
        `什么整数使下面的式子成立？$\\square^{${e}} = ${big(value)}$`,
      ],
      answer,
      [
        [
          ["Try a base", "试一个底数"],
          [
            `$${powTex(String(answer - 1), e)} = ${big(below)}$ is too small.`,
            `$${powTex(String(answer - 1), e)} = ${big(below)}$，太小了。`,
          ],
        ],
        [["Try the next one", "试下一个"], ["One more works.", "再大一点就对了。"], [`${powTex(String(answer), e)} = ${big(value)}`]],
      ],
      [
        `Divide by ${answer} ${e === 2 ? "twice" : `${e} times`}: $${chain.join(",\\ ")}$.`,
        `用 ${answer} 连除 ${e} 次：$${chain.join(",\\ ")}$。`,
      ],
      [
        ...(value % e === 0 ? [[value / e, "That divides by the exponent.", "这是用指数去除。"] as Miss] : []),
        [
          answer + 1,
          `That is too big: $${powTex(String(answer + 1), e)} = ${big((answer + 1) ** e)}$.`,
          `太大了：$${powTex(String(answer + 1), e)} = ${big((answer + 1) ** e)}$。`,
        ],
        [
          answer - 1,
          `That is too small: $${powTex(String(answer - 1), e)} = ${big(below)}$.`,
          `太小了：$${powTex(String(answer - 1), e)} = ${big(below)}$。`,
        ],
      ],
      { figure: e === 2 ? areaGridFigure(["?"], ["?"], [[grouped(value)]]) : undefined },
    );
  },
  growthLine(4, 3),
);

/** zerosAtTheEndOfAPowerOfAMultipleOfTen asks how many zeros end a power of a number like 30 or 700. */
export const zerosAtTheEndOfAPowerOfAMultipleOfTen = point(
  "zeros-at-the-end-of-a-power-of-a-multiple-of-ten",
  ["Zeros at the end of a power of a multiple of ten", "整十数的乘方末尾的 0"],
  [
    "$30^4 = 30 \\times 30 \\times 30 \\times 30$. Each 30 brings one zero, so there are 4 zeros: $3^4 = 81$, and $30^4 = 810{,}000$.\n\nCheck: $30^2 = 900$ has 2 zeros, and $900 \\times 900 = 810{,}000$ has $2 + 2 = 4$.\n\n> **Watch out.** 30 has 1 zero, but the power has 4. Answering 1 counts only one 30.",
    "$30^4 = 30 \\times 30 \\times 30 \\times 30$。每个 30 带一个 0，所以一共 4 个 0：$3^4 = 81$，$30^4 = 810{,}000$。\n\n检验：$30^2 = 900$ 有 2 个 0，$900 \\times 900 = 810{,}000$ 有 $2 + 2 = 4$ 个 0。\n\n> **注意。** 30 只有 1 个 0，但它的 4 次方有 4 个。答 1 只数了一个 30。",
  ],
  (rng) => {
    const digit = rng.pick([2, 3, 6, 7, 9]);
    const zeros = rng.int(1, 2);
    const e = rng.int(2, 5);
    const base = digit * pow10(zeros);
    const answer = zeros * e;
    return answered(
      [
        `When $${powTex(String(base), e)}$ is written out, how many zeros does it end with?`,
        `$${powTex(String(base), e)}$ 写出来后，末尾有几个 0？`,
      ],
      answer,
      [
        [
          ["Split the base", "拆开底数"],
          [
            `$${base} = ${digit} \\times ${big(pow10(zeros))}$, with ${zeros} zero${zeros === 1 ? "" : "s"}.`,
            `$${base} = ${digit} \\times ${big(pow10(zeros))}$，有 ${zeros} 个 0。`,
          ],
        ],
        [
          ["Count all the zeros", "数所有的 0"],
          [`Each of the ${e} factors brings ${zeros}.`, `${e} 个因数各带 ${zeros} 个。`],
          [`${e} \\times ${zeros} = ${answer}`],
        ],
      ],
      [
        `Group the parts: the power is $${powTex(String(digit), e)} \\times 10^{${answer}}$. Since $${powTex(String(digit), e)} = ${digit ** e}$ does not end in 0, all ${answer} zeros come from $10^{${answer}}$.`,
        `把各部分合起来：这个乘方等于 $${powTex(String(digit), e)} \\times 10^{${answer}}$。因为 $${powTex(String(digit), e)} = ${digit ** e}$ 末尾不是 0，所以 ${answer} 个 0 全部来自 $10^{${answer}}$。`,
      ],
      [
        [zeros, `That counts the zeros of only one ${base}.`, `这只数了一个 ${base} 的 0。`],
        [e, "That is the exponent.", "这是指数。"],
        [zeros + e, "That adds the exponent instead of multiplying.", "这是加指数，不是乘指数。"],
      ],
      { figure: base ** e < 10000000 ? digitsChart([base, base ** e]) : undefined },
    );
  },
  digitsChart([30, 810000]),
);

/** theMissingExponent asks for the exponent that gives a power its value. */
export const theMissingExponent = point(
  "the-missing-exponent",
  ["The missing exponent", "缺少的指数"],
  [
    "$2^{\\square} = 32$: keep doubling and count: 2, 4, 8, 16, 32. That is five 2s, so the exponent is 5.\n\nCheck: halve 32 until you reach 1: 16, 8, 4, 2, 1. Five halvings.\n\n> **Watch out.** Count the 2s, not the numbers after 1: 4 is one too few.",
    "$2^{\\square} = 32$：不断乘 2 并数一数：2，4，8，16，32。一共五个 2，所以指数是 5。\n\n检验：把 32 不断除以 2，直到得 1：16，8，4，2，1。除了五次。\n\n> **注意。** 要数 2 的个数：4 少了一个。",
  ],
  (rng) => {
    const base = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const answer = rng.int(2, base <= 3 ? 10 : base <= 6 ? 6 : 5);
    const value = base ** answer;
    const run = Array.from({ length: answer }, (_, i) => big(base ** (i + 1)));
    const halves = Array.from({ length: answer }, (_, i) => big(value / base ** (i + 1)));
    return answered(
      [`Find the missing exponent: $${base}^{\\square} = ${big(value)}$`, `求缺少的指数：$${base}^{\\square} = ${big(value)}$`],
      answer,
      [
        [
          ["Multiply by the base", "不断乘底数"],
          [`Keep multiplying by ${base} until you reach $${big(value)}$.`, `不断乘 ${base}，直到得到 $${big(value)}$。`],
          [run.join(",\\ ")],
        ],
        [
          ["Count the factors", "数因数"],
          [`That is ${answer} factors of ${base}.`, `一共 ${answer} 个 ${base}。`],
          [`${base}^{${answer}} = ${big(value)}`],
        ],
      ],
      [
        `Divide by ${base} until you reach 1: $${halves.join(",\\ ")}$. That is ${answer} divisions.`,
        `不断除以 ${base}，直到得 1：$${halves.join(",\\ ")}$。一共除了 ${answer} 次。`,
      ],
      [
        [answer - 1, `That is one ${base} too few.`, `这少数了一个 ${base}。`],
        [answer + 1, `That is one ${base} too many.`, `这多数了一个 ${base}。`],
        [value / base, "That is a value, not the exponent.", "这是一个值，不是指数。"],
      ],
    );
  },
  growthLine(2, 5),
);

/** theLastDigitOfALargePower asks for the ones digit of a power too large to work out. */
export const theLastDigitOfALargePower = point(
  "the-last-digit-of-a-large-power",
  ["The last digit of a large power", "很大的乘方的个位数字"],
  [
    "The ones digits of $3^1, 3^2, 3^3, \\ldots$ are 3, 9, 7, 1, 3, 9, 7, 1, …: they repeat every 4. For $3^{10}$: $10 = 2 \\times 4 + 2$, so take the 2nd digit, 9.\n\nCheck: $3^{10} = 59{,}049$, which ends in 9.\n\n> **Watch out.** A remainder of 0 means the last digit of the cycle, not the first.",
    "$3^1, 3^2, 3^3, \\ldots$ 的个位数字是 3，9，7，1，3，9，7，1，……：每 4 个重复一次。求 $3^{10}$：$10 = 2 \\times 4 + 2$，所以取第 2 个数字，9。\n\n检验：$3^{10} = 59{,}049$，个位是 9。\n\n> **注意。** 余数是 0 时，取一轮中的最后一个数字，不是第一个。",
  ],
  (rng) => {
    const base = rng.pick([2, 3, 4, 7, 8, 9]);
    const exponent = rng.int(10, 60);
    const cycle: number[] = [];
    let last = base;
    while (!cycle.includes(last)) {
      cycle.push(last);
      last = (last * base) % 10;
    }
    const len = cycle.length;
    const r = exponent % len;
    const answer = cycle[(exponent - 1) % len] ?? 0;
    const step = r === 0 ? len : r;
    const shown = Array.from({ length: 2 * len }, (_, i) => cycle[i % len] ?? 0);
    return answered(
      [`What is the ones digit of $${base}^{${exponent}}$?`, `$${base}^{${exponent}}$ 的个位数字是多少？`],
      answer,
      [
        [
          ["List the ones digits", "列出个位数字"],
          [`The ones digits of the powers of ${base} repeat every ${len}.`, `${base} 的各次方的个位数字每 ${len} 个重复一次。`],
          [`${shown.join(",\\ ")},\\ \\ldots`],
        ],
        [
          ["Use the remainder", "用余数"],
          r === 0
            ? [
                `${exponent} ÷ ${len} leaves 0, so take the last digit of the cycle.`,
                `${exponent} ÷ ${len} 余 0，所以取一轮中的最后一个数字。`,
              ]
            : [`${exponent} ÷ ${len} leaves ${r}, so take digit number ${r}.`, `${exponent} ÷ ${len} 余 ${r}，所以取第 ${r} 个数字。`],
          [`\\text{ones digit} = ${answer}`],
        ],
      ],
      [
        `The power $${base}^{${exponent}}$ ends like $${base}^{${step}}$, since ${exponent} − ${step} is a multiple of ${len}; and $${base}^{${step}} = ${base ** step}$ ends in ${answer}.`,
        `乘方 $${base}^{${exponent}}$ 的个位和 $${base}^{${step}}$ 一样，因为 ${exponent} − ${step} 是 ${len} 的倍数；$${base}^{${step}} = ${base ** step}$，个位是 ${answer}。`,
      ],
      [
        [cycle[exponent % len] ?? 0, "That is the next digit in the cycle, one step too far.", "这是一轮中的下一个数字，多走了一步。"],
        [cycle[0] ?? 0, "That starts the cycle over instead of using the remainder.", "这是从头开始，没有用余数。"],
        [exponent % 10, "That is the ones digit of the exponent.", "这是指数的个位数字。"],
      ],
      {
        figure: tapeFigure(
          [{ pieces: shown.map((d, i) => ({ size: 1, text: String(d), lit: i < len })) }],
          [
            `A bar of the ones digits of the first ${2 * len} powers of ${base}, with one cycle shaded.`,
            `一个长条，写着 ${base} 的前 ${2 * len} 个乘方的个位数字，一轮涂了颜色。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [{ pieces: [3, 9, 7, 1, 3, 9, 7, 1].map((d, i) => ({ size: 1, text: String(d), lit: i < 4 })) }],
    [
      "A bar of the ones digits of the first 8 powers of 3, with one cycle shaded.",
      "一个长条，写着 3 的前 8 个乘方的个位数字，一轮涂了颜色。",
    ],
  ),
);

/** theDecimalBeforeThePower asks for the decimal that a power of ten turns into a given number. */
export const theDecimalBeforeThePower = point(
  "the-decimal-before-the-power",
  ["The decimal before the power", "乘 10 的乘方之前的小数"],
  [
    "$\\square \\times 10^3 = 4{,}500$: the point moved 3 places to the right, so move it back 3 places to the left: $4.5$.\n\nCheck: $4.5 \\times 1{,}000 = 4{,}500$.\n\n> **Watch out.** Move back exactly 3 places. $0.45$ moves the point 4 places.",
    "$\\square \\times 10^3 = 4{,}500$：小数点向右移动了 3 位，所以向左移回 3 位：$4.5$。\n\n检验：$4.5 \\times 1{,}000 = 4{,}500$。\n\n> **注意。** 正好移回 3 位。$0.45$ 移了 4 位。",
  ],
  (rng) => {
    const n = nonZeroEnd(rng, 2);
    const e = rng.int(1, 4);
    const value = n * pow10(e - 1);
    return answered(
      [`Find the missing number: $\\square \\times 10^{${e}} = ${big(value)}$`, `求缺少的数：$\\square \\times 10^{${e}} = ${big(value)}$`],
      D(n, 1),
      [
        [
          ["Which way", "往哪边移"],
          ["Undo the multiplying: move the point to the left.", "倒回去：小数点向左移。"],
        ],
        [
          ["How far", "移几位"],
          [
            `$10^{${e}}$ moved it ${e} place${e === 1 ? "" : "s"}, so move it back ${e}.`,
            `$10^{${e}}$ 让它移了 ${e} 位，所以移回 ${e} 位。`,
          ],
          [`${big(value)} \\div 10^{${e}} = ${fix(n, 1)}`],
        ],
      ],
      [`$${fix(n, 1)} \\times ${big(pow10(e))} = ${big(value)}$.`, `$${fix(n, 1)} \\times ${big(pow10(e))} = ${big(value)}$。`],
      [
        [D(n, 2), "That moves the point one place too far.", "小数点多移了一位。"],
        [Q.of(n), "That moves the point one place too few.", "小数点少移了一位。"],
        [D(n, 3), "That moves the point two places too far.", "小数点多移了两位。"],
      ],
      { form: "decimal" },
    );
  },
  shiftChart(45, 1, 3),
);

/** decimalPlacesInAPower asks how many decimal places a power of a one-place decimal has. */
export const decimalPlacesInAPower = point(
  "decimal-places-in-a-power",
  ["Decimal places in a power", "小数乘方的小数位数"],
  [
    "$0.3^4 = 0.3 \\times 0.3 \\times 0.3 \\times 0.3$. Each factor has one place, so the power has 4: $3^4 = 81$, and $0.3^4 = 0.0081$.\n\nCheck: $0.3^2 = 0.09$ has 2 places, and $0.09 \\times 0.09 = 0.0081$ has $2 + 2 = 4$.\n\n> **Watch out.** The answer is 4, not 1: every factor adds its own place.",
    "$0.3^4 = 0.3 \\times 0.3 \\times 0.3 \\times 0.3$。每个因数有一位小数，所以乘方有 4 位：$3^4 = 81$，$0.3^4 = 0.0081$。\n\n检验：$0.3^2 = 0.09$ 有 2 位小数，$0.09 \\times 0.09 = 0.0081$ 有 $2 + 2 = 4$ 位。\n\n> **注意。** 答案是 4，不是 1：每个因数都带来一位小数。",
  ],
  (rng) => {
    const w = rng.int(0, 2);
    const d = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]);
    const e = rng.int(2, 6);
    const n = w * 10 + d;
    const base = fix(n, 1);
    return answered(
      [`How many decimal places does $${powTex(base, e)}$ have, written out in full?`, `$${powTex(base, e)}$ 完整写出后有几位小数？`],
      e,
      [
        [
          ["Places in each factor", "每个因数的小数位数"],
          [`$${base}$ has one decimal place.`, `$${base}$ 有一位小数。`],
        ],
        [
          ["Add them up", "加起来"],
          [
            `${e} factors give ${e} places, and the last digit, from $${d}^{${e}}$, is not 0.`,
            `${e} 个因数一共 ${e} 位，最后一位来自 $${d}^{${e}}$，不是 0。`,
          ],
          [`1 \\times ${e} = ${e}`],
        ],
      ],
      [
        `Work it out: $${powTex(base, e)} = ${dq(D(n ** e, e))}$, with ${e} digits after the point.`,
        `算出来：$${powTex(base, e)} = ${dq(D(n ** e, e))}$，小数点后有 ${e} 位。`,
      ],
      [
        [1, "That counts the places of only one factor.", "这只数了一个因数的小数位数。"],
        [e + 1, "That counts one place too many.", "这多数了一位。"],
        [2 * e, "That gives each factor two places.", "这给每个因数算了两位。"],
      ],
      { figure: e === 2 ? productArea(base, base, "?") : undefined },
    );
  },
  productArea("0.3", "0.3", "0.09"),
);

/** aSquaredSumVersusASumOfSquares asks how much greater the square of a sum is than the sum of the squares. */
export const aSquaredSumVersusASumOfSquares = point(
  "a-squared-sum-versus-a-sum-of-squares",
  ["A squared sum and a sum of squares", "和的平方与平方的和"],
  [
    "$(3 + 4)^2 = 7^2 = 49$, but $3^2 + 4^2 = 9 + 16 = 25$. The difference is $49 - 25 = 24$.\n\nCheck: in a square of side $3 + 4$, the two $3 \\times 4$ rectangles are left over: $12 + 12 = 24$.\n\n> **Watch out.** $(3 + 4)^2$ is not $3^2 + 4^2$; that leaves out the two rectangles.",
    "$(3 + 4)^2 = 7^2 = 49$，而 $3^2 + 4^2 = 9 + 16 = 25$。相差 $49 - 25 = 24$。\n\n检验：在边长为 $3 + 4$ 的正方形里，多出来的是两个 $3 \\times 4$ 的长方形：$12 + 12 = 24$。\n\n> **注意。** $(3 + 4)^2$ 不等于 $3^2 + 4^2$；那样漏掉了两个长方形。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    const whole = (a + b) ** 2;
    const parts = a * a + b * b;
    return answered(
      [`How much greater is $(${a} + ${b})^{2}$ than $${a}^{2} + ${b}^{2}$?`, `$(${a} + ${b})^{2}$ 比 $${a}^{2} + ${b}^{2}$ 大多少？`],
      whole - parts,
      [
        [
          ["Square the sum", "先求和的平方"],
          ["Add first, then square.", "先加，再平方。"],
          [`(${a} + ${b})^{2} = ${a + b}^{2} = ${whole}`],
        ],
        [
          ["Add the squares", "再求平方的和"],
          ["Square each number, then add.", "分别平方，再相加。"],
          [`${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${parts}`],
        ],
        [["Subtract", "相减"], ["Find the difference.", "求差。"], [`${whole} - ${parts} = ${whole - parts}`]],
      ],
      [
        `In the square of side $${a} + ${b}$, the two $${a} \\times ${b}$ rectangles are left over: $${a * b} + ${a * b} = ${2 * a * b}$.`,
        `在边长为 $${a} + ${b}$ 的正方形里，多出来的是两个 $${a} \\times ${b}$ 的长方形：$${a * b} + ${a * b} = ${2 * a * b}$。`,
      ],
      [
        [a * b, "That counts only one of the two rectangles.", "这只算了一个长方形。"],
        [0, "The two are not equal.", "两个结果并不相等。"],
        [whole, "That is the squared sum, not the difference.", "这是和的平方，不是差。"],
      ],
      {
        figure: areaGridFigure(
          [String(a), String(b)],
          [String(a), String(b)],
          [
            [String(a * a), "?"],
            ["?", String(b * b)],
          ],
          [a, b],
          [a, b],
        ),
      },
    );
  },
  areaGridFigure(
    ["3", "4"],
    ["3", "4"],
    [
      ["9", "12"],
      ["12", "16"],
    ],
    [3, 4],
    [3, 4],
  ),
);

/** theFirstPowerAboveANumber asks for the smallest exponent that takes a power past a number. */
export const theFirstPowerAboveANumber = point(
  "the-first-power-above-a-number",
  ["The first power above a number", "第一个超过某数的乘方"],
  [
    "Smallest $n$ with $3^n > 100$: $3^1 = 3$, $3^2 = 9$, $3^3 = 27$, $3^4 = 81$, $3^5 = 243$. 81 is not more than 100, but 243 is, so $n = 5$.\n\nCheck: $100 \\div 3 \\div 3 \\div 3 \\div 3$ is still more than 1, so four 3s are not enough.\n\n> **Watch out.** The answer is the exponent 5, not the value 243.",
    "使 $3^n > 100$ 的最小的 $n$：$3^1 = 3$，$3^2 = 9$，$3^3 = 27$，$3^4 = 81$，$3^5 = 243$。81 不大于 100，243 大于 100，所以 $n = 5$。\n\n检验：$100 \\div 3 \\div 3 \\div 3 \\div 3$ 还比 1 大，所以四个 3 不够。\n\n> **注意。** 答案是指数 5，不是值 243。",
  ],
  (rng) => {
    const base = rng.pick([2, 3, 4, 5, 6, 7]);
    const k = rng.int(2, base === 2 ? 12 : base === 3 ? 8 : 5);
    const low = base ** k;
    const high = base ** (k + 1);
    const n = rng.int(low, high - 1);
    const list = Array.from({ length: k + 1 }, (_, i) => `${base}^{${i + 1}} = ${big(base ** (i + 1))}`);
    return answered(
      [
        `What is the smallest whole number $n$ for which $${base}^n > ${big(n)}$?`,
        `使 $${base}^n > ${big(n)}$ 成立的最小整数 $n$ 是多少？`,
      ],
      k + 1,
      [
        [
          ["List the powers", "列出各次方"],
          [`Multiply by ${base} each time; the last powers are these.`, `每次乘 ${base}；最后几个乘方是这些。`],
          list.slice(-3),
        ],
        [
          ["Find the first one past", "找第一个超过的"],
          [
            `$${base}^{${k}} = ${big(low)}$ is not more than ${grouped(n)}, but $${base}^{${k + 1}} = ${big(high)}$ is.`,
            `$${base}^{${k}} = ${big(low)}$ 不大于 ${grouped(n)}，$${base}^{${k + 1}} = ${big(high)}$ 大于它。`,
          ],
        ],
      ],
      [
        `$${base}^{${k}} = ${big(low)} \\le ${big(n)} < ${big(high)} = ${base}^{${k + 1}}$.`,
        `$${base}^{${k}} = ${big(low)} \\le ${big(n)} < ${big(high)} = ${base}^{${k + 1}}$。`,
      ],
      [
        [k, `$${base}^{${k}} = ${big(low)}$ is not more than ${grouped(n)}.`, `$${base}^{${k}} = ${big(low)}$ 不大于 ${grouped(n)}。`],
        [high, "That is the value of the power, not the exponent.", "这是乘方的值，不是指数。"],
        [k + 2, "That goes one power too far.", "这多走了一次。"],
      ],
      { figure: high < 100000 ? growthLine(base, k + 1, true, n) : undefined },
    );
  },
  growthLine(3, 5, false, 100),
);

/** theMissingExponentOfAFraction asks for the exponent that gives a power of a fraction its value. */
export const theMissingExponentOfAFraction = point(
  "the-missing-exponent-of-a-fraction",
  ["The missing exponent of a fraction", "分数乘方中缺少的指数"],
  [
    "$\\left(\\frac{2}{3}\\right)^{\\square} = \\frac{8}{27}$: the top is $2 \\times 2 \\times 2 = 8$, three 2s. So the exponent is 3.\n\nCheck: the bottom is $3 \\times 3 \\times 3 = 27$, also three 3s.\n\n> **Watch out.** When the top is 1, count in the bottom. 1 to any power is 1, so the top cannot tell you the exponent.",
    "$\\left(\\frac{2}{3}\\right)^{\\square} = \\frac{8}{27}$：分子 $2 \\times 2 \\times 2 = 8$，是三个 2。所以指数是 3。\n\n检验：分母 $3 \\times 3 \\times 3 = 27$，也是三个 3。\n\n> **注意。** 分子是 1 时，要看分母。1 的任何次方都是 1，看分子看不出指数。",
  ],
  (rng) => {
    const [p, q] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 2],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [5, 2],
      [4, 3],
    ]) as [number, number];
    const answer = rng.int(2, 5);
    const [top, bottom] = [p ** answer, q ** answer];
    const fraction = fr(p, q);
    return answered(
      [
        `Find the missing exponent: $\\left(${fraction}\\right)^{\\square} = ${fr(big(top), big(bottom))}$`,
        `求缺少的指数：$\\left(${fraction}\\right)^{\\square} = ${fr(big(top), big(bottom))}$`,
      ],
      answer,
      [
        [
          ["Look at the bottom", "看分母"],
          [`$${big(bottom)}$ should be ${q} multiplied some number of times.`, `$${big(bottom)}$ 应该是若干个 ${q} 相乘。`],
          [`${repeated(String(q), answer)} = ${big(bottom)}`],
        ],
        [["Count the factors", "数因数"], [`There are ${answer} factors of ${q}.`, `一共有 ${answer} 个 ${q}。`], [`\\square = ${answer}`]],
      ],
      p === 1
        ? [
            `The top stays 1, and $\\left(${fraction}\\right)^{${answer}} = ${fr(1, big(bottom))}$.`,
            `分子还是 1，$\\left(${fraction}\\right)^{${answer}} = ${fr(1, big(bottom))}$。`,
          ]
        : [
            `The top: $${repeated(String(p), answer)} = ${big(top)}$, also ${answer} factors.`,
            `看分子：$${repeated(String(p), answer)} = ${big(top)}$，也是 ${answer} 个因数。`,
          ],
      [
        [answer - 1, `That is one factor of ${q} too few.`, `这少数了一个 ${q}。`],
        [answer + 1, `That is one factor of ${q} too many.`, `这多数了一个 ${q}。`],
        [2 * answer, "That counts the factors in the top and the bottom together.", "这把分子和分母的因数加在一起数了。"],
      ],
    );
  },
  stripsFigure([
    { parts: 3, shaded: 2, text: "2/3" },
    { parts: 27, shaded: 8, text: "8/27" },
  ]),
);
