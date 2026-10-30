import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, num, Q, q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";

/** terminatingFraction draws a fraction in lowest terms whose denominator divides a power of ten, between 0 and 1. */
function terminatingFraction(rng: Rng): Q {
  for (;;) {
    const d = rng.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]);
    const f = q(rng.int(1, d - 1), d);
    if (f.d === BigInt(d)) return f;
  }
}

/** decimal draws a positive decimal with the given number of decimal places and at most `whole` whole digits. */
function decimal(rng: Rng, places: number, whole = 2): Q {
  const scale = 10 ** places;
  for (;;) {
    const n = rng.int(1, 10 ** whole * scale - 1);
    if (n % 10 !== 0) return q(n, scale);
  }
}

/** places counts the digits after the decimal point of a terminating decimal. */
const places = (v: Q) => (dec(v).split(".")[1] ?? "").length;

/** fixed writes a decimal with exactly k decimal places: fixed(2.5, 2) is "2.50". */
function fixed(v: Q, k: number): string {
  const [whole, frac = ""] = dec(v).split(".");
  return `${whole}.${frac.padEnd(k, "0")}`;
}

/** percent writes a percentage: "12.5\%". */
const pct = (v: Q) => `${dec(v)}\\%`;

export const fractionsAndDecimals: TopicDef = {
  id: "fractions-and-decimals",
  title: t("Fractions and Decimals", "分数与小数"),
  summary: t("Convert terminating decimals to fractions and fractions to decimals.", "有限小数化分数，分数化小数。"),
  prerequisites: ["equivalent-fractions"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.4.NF.C.6", "CCSS.7.NS.A.2.D"],
  knowledgePoints: [
    {
      id: "decimals-to-fractions",
      title: t("Decimals as fractions", "小数化分数"),
      explanation: t(
        "The digits after the decimal point count tenths, hundredths, thousandths, and so on. Read the decimal as a fraction over $10$, $100$ or $1000$, then simplify:\n\n$$0.35 = \\frac{35}{100} = \\frac{7}{20}, \\qquad 2.125 = \\frac{2125}{1000} = \\frac{17}{8}$$\n\nThe number of decimal places is the number of zeros in the denominator.",
        "小数点后的各位依次表示十分之几、百分之几、千分之几……把小数读成分母为 $10$、$100$ 或 $1000$ 的分数，再约分：\n\n$$0.35 = \\frac{35}{100} = \\frac{7}{20}, \\qquad 2.125 = \\frac{2125}{1000} = \\frac{17}{8}$$\n\n小数有几位，分母中就有几个零。",
      ),
      generate(rng) {
        const v = rng.bool(0.3) ? terminatingFraction(rng).add(Q.of(rng.int(1, 5))) : terminatingFraction(rng);
        const k = places(v);
        const scale = 10 ** k;
        const raw = v.mul(Q.of(scale));
        return numberProblem({
          prompt: t(`Write $${dec(v)}$ as a fraction in lowest terms.`, `把 $${dec(v)}$ 写成最简分数。`),
          answer: v,
          form: "fraction",
          wrong: [q(raw.n, 10 ** (k + 1))],
          solution: t(
            `$${dec(v)}$ has ${k} decimal place${k === 1 ? "" : "s"}:${steps(`${dec(v)} = \\frac{${raw.n}}{${scale}} = ${num(v)}`)}`,
            `$${dec(v)}$ 有 ${k} 位小数：${steps(`${dec(v)} = \\frac{${raw.n}}{${scale}} = ${num(v)}`)}`,
          ),
        });
      },
    },
    {
      id: "fractions-to-decimals",
      title: t("Fractions as decimals", "分数化小数"),
      explanation: t(
        "A fraction is a division: $\\frac{3}{8} = 3 \\div 8 = 0.375$. When the denominator divides $10$, $100$ or $1000$, it is quicker to write an equivalent fraction with that denominator:\n\n$$\\frac{7}{25} = \\frac{7 \\cdot 4}{25 \\cdot 4} = \\frac{28}{100} = 0.28$$",
        "分数就是除法：$\\frac{3}{8} = 3 \\div 8 = 0.375$。当分母是 $10$、$100$ 或 $1000$ 的因数时，更快的方法是化成以它们为分母的等值分数：\n\n$$\\frac{7}{25} = \\frac{7 \\cdot 4}{25 \\cdot 4} = \\frac{28}{100} = 0.28$$",
      ),
      generate(rng) {
        const v = terminatingFraction(rng);
        const k = Math.max(1, places(v));
        const scale = 10 ** k;
        const m = scale / Number(v.d);
        return numberProblem({
          prompt: t(`Write $${num(v)}$ as a decimal.`, `把 $${num(v)}$ 写成小数。`),
          answer: v,
          form: "decimal",
          // Writing the numerator and denominator side by side: 3/8 as 3.8.
          wrong: [Q.parse(`${v.n}.${v.d}`)],
          solution: t(
            `${steps(`${num(v)} = \\frac{${v.n} \\cdot ${m}}{${v.d} \\cdot ${m}} = \\frac{${Number(v.n) * m}}{${scale}} = ${dec(v)}`)}`,
            `${steps(`${num(v)} = \\frac{${v.n} \\cdot ${m}}{${v.d} \\cdot ${m}} = \\frac{${Number(v.n) * m}}{${scale}} = ${dec(v)}`)}`,
          ),
        });
      },
    },
  ],
};

export const decimalArithmetic: TopicDef = {
  id: "decimal-arithmetic",
  title: t("Adding, Subtracting and Multiplying Decimals", "小数的加减乘"),
  summary: t("Line up decimal points to add and subtract; count decimal places to multiply.", "加减时对齐小数点；乘法时数小数位数。"),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.6.NS.B.3"],
  knowledgePoints: [
    {
      id: "adding-and-subtracting-decimals",
      title: t("Adding and subtracting decimals", "小数加减法"),
      explanation: t(
        "Write the numbers in a column with the **decimal points lined up**, so that tenths are added to tenths and hundredths to hundredths. Fill empty places with zeros:\n\n$$12.5 - 3.86 = 12.50 - 3.86 = 8.64$$",
        "把数竖着写，**小数点对齐**，这样十分位与十分位相加，百分位与百分位相加。空位补零：\n\n$$12.5 - 3.86 = 12.50 - 3.86 = 8.64$$",
      ),
      generate(rng) {
        let a = decimal(rng, rng.int(1, 2));
        let b = decimal(rng, rng.int(1, 3), 1);
        const add = rng.bool();
        if (!add && a.cmp(b) < 0) [a, b] = [b, a];
        if (a.eq(b)) return this.generate(rng);
        const result = add ? a.add(b) : a.sub(b);
        const op = add ? "+" : "-";
        // Misaligned: treating the digits after the point as whole numbers.
        const k = Math.max(places(a), places(b));
        return numberProblem({
          prompt: t(`Evaluate $${dec(a)} ${op} ${dec(b)}$.`, `计算 $${dec(a)} ${op} ${dec(b)}$。`),
          answer: result,
          form: "decimal",
          wrong: [add ? a.add(b.mul(q(1, 10))) : a.sub(b.mul(q(1, 10))), add ? a.mul(q(1, 10)).add(b) : result.mul(Q.of(10))],
          solution: t(
            `Line up the decimal points, writing both numbers with ${k} decimal places:${steps(`${fixed(a, k)} ${op} ${fixed(b, k)} = ${dec(result)}`)}`,
            `对齐小数点，两个数都写成 ${k} 位小数：${steps(`${fixed(a, k)} ${op} ${fixed(b, k)} = ${dec(result)}`)}`,
          ),
        });
      },
    },
    {
      id: "multiplying-decimals",
      title: t("Multiplying decimals", "小数乘法"),
      explanation: t(
        "Multiply as if there were no decimal points, then place the point so that the product has as many decimal places as the two factors together:\n\n$$2.3 \\cdot 0.15: \\quad 23 \\cdot 15 = 345, \\quad 1 + 2 = 3 \\text{ places}, \\quad \\text{so } 2.3 \\cdot 0.15 = 0.345$$",
        "先忽略小数点，按整数相乘；再点小数点，使积的小数位数等于两个因数的小数位数之和：\n\n$$2.3 \\cdot 0.15: \\quad 23 \\cdot 15 = 345, \\quad 1 + 2 = 3 \\text{ 位}, \\quad \\text{所以 } 2.3 \\cdot 0.15 = 0.345$$",
      ),
      generate(rng) {
        const a = decimal(rng, rng.int(1, 2), 1);
        const b = rng.bool(0.3) ? Q.of(rng.int(2, 30)) : decimal(rng, 1, 1);
        const p = a.mul(b);
        const ka = places(a);
        const kb = places(b);
        const ia = a.mul(Q.of(10 ** ka));
        const ib = b.mul(Q.of(10 ** kb));
        return numberProblem({
          prompt: t(`Evaluate $${dec(a)} \\cdot ${dec(b)}$.`, `计算 $${dec(a)} \\cdot ${dec(b)}$。`),
          answer: p,
          form: "decimal",
          wrong: [p.mul(Q.of(10)), p.mul(q(1, 10))],
          solution: t(
            `${steps(`${ia.n} \\cdot ${ib.n} = ${ia.mul(ib).n}`)}The factors have $${ka} + ${kb} = ${ka + kb}$ decimal places in all, so $${dec(a)} \\cdot ${dec(b)} = ${dec(p)}$.`,
            `${steps(`${ia.n} \\cdot ${ib.n} = ${ia.mul(ib).n}`)}两个因数共有 $${ka} + ${kb} = ${ka + kb}$ 位小数，所以 $${dec(a)} \\cdot ${dec(b)} = ${dec(p)}$。`,
          ),
        });
      },
    },
  ],
};

export const percents: TopicDef = {
  id: "percents",
  title: t("Percents", "百分数"),
  summary: t("Convert between percents, decimals and fractions.", "百分数、小数与分数互化。"),
  prerequisites: ["fractions-and-decimals"],
  encompasses: [{ topic: "fractions-and-decimals", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.6.RP.A.3.C"],
  knowledgePoints: [
    {
      id: "percents-as-decimals-and-fractions",
      title: t("Percents as decimals and fractions", "百分数化小数和分数"),
      explanation: t(
        '**Percent** means "per hundred": $p\\%$ is $\\frac{p}{100}$. To write a percent as a decimal, divide by $100$, moving the decimal point two places to the left: $35\\% = 0.35$, $7\\% = 0.07$, $120\\% = 1.2$.\n\nAs a fraction, write it over $100$ and simplify: $35\\% = \\frac{35}{100} = \\frac{7}{20}$.',
        "**百分数**表示“每一百中有多少”：$p\\%$ 就是 $\\frac{p}{100}$。百分数化小数，除以 $100$，即小数点向左移动两位：$35\\% = 0.35$，$7\\% = 0.07$，$120\\% = 1.2$。\n\n化成分数，写成分母为 $100$ 的分数再约分：$35\\% = \\frac{35}{100} = \\frac{7}{20}$。",
      ),
      generate(rng) {
        const p = rng.bool(0.15) ? Q.of(rng.int(101, 250)) : Q.of(rng.int(1, 99));
        const v = p.div(Q.of(100));
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`Write $${pct(p)}$ as a decimal.`, `把 $${pct(p)}$ 写成小数。`),
            answer: v,
            form: "decimal",
            wrong: [p.div(Q.of(10)), p.div(Q.of(1000))],
            solution: t(
              `Divide by $100$: move the decimal point two places to the left. $${pct(p)} = ${dec(v)}$.`,
              `除以 $100$，即小数点向左移动两位：$${pct(p)} = ${dec(v)}$。`,
            ),
          });
        }
        const line = v.d === 100n ? `${pct(p)} = \\frac{${p.n}}{100}` : `${pct(p)} = \\frac{${p.n}}{100} = ${num(v)}`;
        return numberProblem({
          prompt: t(`Write $${pct(p)}$ as a fraction in lowest terms.`, `把 $${pct(p)}$ 写成最简分数。`),
          answer: v,
          form: "fraction",
          wrong: [p.div(Q.of(10))],
          solution: t(`${steps(line)}`, `${steps(line)}`),
        });
      },
    },
    {
      id: "writing-percents",
      title: t("Writing decimals and fractions as percents", "小数和分数化百分数"),
      explanation: t(
        "To write a number as a percent, multiply it by $100$: $0.625 = 62.5\\%$ and $1.4 = 140\\%$. For a fraction, first write it as a decimal or as a fraction over $100$:\n\n$$\\frac{3}{8} = 0.375 = 37.5\\%, \\qquad \\frac{9}{20} = \\frac{45}{100} = 45\\%$$",
        "把一个数化成百分数，乘 $100$：$0.625 = 62.5\\%$，$1.4 = 140\\%$。分数要先化成小数，或化成分母为 $100$ 的分数：\n\n$$\\frac{3}{8} = 0.375 = 37.5\\%, \\qquad \\frac{9}{20} = \\frac{45}{100} = 45\\%$$",
      ),
      generate(rng) {
        const v = rng.bool() ? terminatingFraction(rng) : decimal(rng, rng.int(1, 3), 1);
        const p = v.mul(Q.of(100));
        const asFraction = !v.mul(Q.of(10)).isInteger() && v.d <= 50n && rng.bool();
        const shown = asFraction ? num(v) : dec(v);
        return numberProblem({
          prompt: t(`Write $${shown}$ as a percent.`, `把 $${shown}$ 写成百分数。`),
          answer: p,
          form: "decimal",
          percent: true,
          wrong: [v.mul(Q.of(10)), v.mul(Q.of(1000))],
          solution: t(
            `${asFraction ? `$${shown} = ${dec(v)}$. ` : ""}Multiply by $100$: $${dec(v)} \\cdot 100 = ${dec(p)}$, so it is $${pct(p)}$.`,
            `${asFraction ? `$${shown} = ${dec(v)}$。` : ""}乘 $100$：$${dec(v)} \\cdot 100 = ${dec(p)}$，所以是 $${pct(p)}$。`,
          ),
        });
      },
    },
  ],
};

/** percentPair draws a percentage and a whole whose part is a whole number or has one decimal place. */
function percentPair(rng: Rng): { p: Q; whole: Q; part: Q } {
  for (;;) {
    const p = Q.of(rng.pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 75, 80, 90, 120, 150]));
    const whole = Q.of(rng.int(2, 80) * rng.pick([2, 4, 5, 10]));
    const part = p.mul(whole).div(Q.of(100));
    if (part.mul(Q.of(10)).isInteger()) return { p, whole, part };
  }
}

export const percentOfANumber: TopicDef = {
  id: "percent-of-a-number",
  title: t("Percent of a Number", "求一个数的百分之几"),
  summary: t(
    "Find a part from a whole and a percent, a percent from a part and a whole, and a whole from a part and a percent.",
    "已知整体和百分比求部分，已知部分和整体求百分比，已知部分和百分比求整体。",
  ),
  prerequisites: ["percents", "decimal-arithmetic", "multiplying-fractions"],
  encompasses: [
    { topic: "percents", weight: 0.5 },
    { topic: "decimal-arithmetic", weight: 0.3 },
    { topic: "multiplying-fractions", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.6.RP.A.3.C"],
  knowledgePoints: [
    {
      id: "finding-the-part",
      title: t("Finding the part", "求部分"),
      explanation: t(
        "To find $p\\%$ of a number, write the percent as a decimal or fraction and multiply:\n\n$$35\\% \\text{ of } 60 = 0.35 \\cdot 60 = 21$$\n\nUseful shortcuts: $10\\%$ of a number is a tenth of it, $50\\%$ is half, $25\\%$ is a quarter.",
        "求一个数的 $p\\%$，把百分数写成小数或分数再相乘：\n\n$$60 \\text{ 的 } 35\\% = 0.35 \\cdot 60 = 21$$\n\n常用的捷径：一个数的 $10\\%$ 是它的十分之一，$50\\%$ 是一半，$25\\%$ 是四分之一。",
      ),
      generate(rng) {
        const { p, whole, part } = percentPair(rng);
        return numberProblem({
          prompt: t(`What is $${pct(p)}$ of $${dec(whole)}$?`, `$${dec(whole)}$ 的 $${pct(p)}$ 是多少？`),
          answer: part,
          form: "decimal",
          wrong: [p.mul(whole), whole.div(p).mul(Q.of(100))],
          solution: t(
            `${steps(`${pct(p)} \\cdot ${dec(whole)} = ${dec(p.div(Q.of(100)))} \\cdot ${dec(whole)} = ${dec(part)}`)}`,
            `${steps(`${pct(p)} \\cdot ${dec(whole)} = ${dec(p.div(Q.of(100)))} \\cdot ${dec(whole)} = ${dec(part)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-percent",
      title: t("Finding the percent", "求百分比"),
      explanation: t(
        'To find what percent a part is of a whole, divide the part by the whole and write the result as a percent:\n\n$$\\frac{18}{24} = 0.75 = 75\\%$$\n\nThe whole is the number after "of": "$18$ is what percent of $24$?"',
        "求部分占整体的百分之几，用部分除以整体，再把结果写成百分数：\n\n$$\\frac{18}{24} = 0.75 = 75\\%$$\n\n“$18$ 是 $24$ 的百分之几？”中，整体是“的”前面的 $24$。",
      ),
      generate(rng) {
        const { p, whole, part } = percentPair(rng);
        if (!part.isInteger()) return this.generate(rng);
        return numberProblem({
          prompt: t(`$${dec(part)}$ is what percent of $${dec(whole)}$?`, `$${dec(part)}$ 是 $${dec(whole)}$ 的百分之几？`),
          answer: p,
          form: "decimal",
          percent: true,
          wrong: [whole.div(part).mul(Q.of(100)), part.div(whole)],
          solution: t(
            `Divide the part by the whole:${steps(`\\frac{${dec(part)}}{${dec(whole)}} = ${dec(p.div(Q.of(100)))} = ${pct(p)}`)}`,
            `用部分除以整体：${steps(`\\frac{${dec(part)}}{${dec(whole)}} = ${dec(p.div(Q.of(100)))} = ${pct(p)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-whole",
      title: t("Finding the whole", "求整体"),
      explanation: t(
        "If $p\\%$ of a number is known, the number is the part divided by the percent written as a decimal. If $40\\%$ of a number is $18$:\n\n$$0.4 \\cdot n = 18, \\qquad n = \\frac{18}{0.4} = 45$$\n\nCheck: $40\\%$ of $45$ is $18$.",
        "已知一个数的 $p\\%$ 是多少，求这个数：用部分除以百分数（写成小数）。如果一个数的 $40\\%$ 是 $18$：\n\n$$0.4 \\cdot n = 18, \\qquad n = \\frac{18}{0.4} = 45$$\n\n检验：$45$ 的 $40\\%$ 是 $18$。",
      ),
      generate(rng) {
        const { p, whole, part } = percentPair(rng);
        return numberProblem({
          prompt: t(
            `$${pct(p)}$ of a number is $${dec(part)}$. What is the number?`,
            `一个数的 $${pct(p)}$ 是 $${dec(part)}$，这个数是多少？`,
          ),
          answer: whole,
          form: "decimal",
          wrong: [part.mul(p).div(Q.of(100))],
          solution: t(
            `${steps(`${dec(p.div(Q.of(100)))} \\cdot n = ${dec(part)}`, `n = \\frac{${dec(part)}}{${dec(p.div(Q.of(100)))}} = ${dec(whole)}`)}Check: $${pct(p)}$ of $${dec(whole)}$ is $${dec(part)}$.`,
            `${steps(`${dec(p.div(Q.of(100)))} \\cdot n = ${dec(part)}`, `n = \\frac{${dec(part)}}{${dec(p.div(Q.of(100)))}} = ${dec(whole)}`)}检验：$${dec(whole)}$ 的 $${pct(p)}$ 是 $${dec(part)}$。`,
          ),
        });
      },
    },
  ],
};

export const percentChange: TopicDef = {
  id: "percent-change",
  title: t("Percent Increase and Decrease", "百分比的增加与减少"),
  summary: t(
    "Apply a percent increase or decrease, and find the percent change between two values.",
    "按百分比增加或减少，求两个值之间的百分比变化。",
  ),
  prerequisites: ["percent-of-a-number"],
  encompasses: [{ topic: "percent-of-a-number", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.7.RP.A.3"],
  knowledgePoints: [
    {
      id: "applying-percent-changes",
      title: t("Applying an increase or decrease", "按百分比增减"),
      explanation: t(
        "An increase of $p\\%$ multiplies a value by $1 + \\frac{p}{100}$; a decrease of $p\\%$ multiplies it by $1 - \\frac{p}{100}$. A price of $80$ after a $15\\%$ discount is\n\n$$80 \\cdot (1 - 0.15) = 80 \\cdot 0.85 = 68$$\n\nThis is the same as finding $15\\%$ of $80$, which is $12$, and subtracting it.",
        "增加 $p\\%$ 就是乘 $1 + \\frac{p}{100}$；减少 $p\\%$ 就是乘 $1 - \\frac{p}{100}$。原价 $80$ 打八五折（减少 $15\\%$）后是\n\n$$80 \\cdot (1 - 0.15) = 80 \\cdot 0.85 = 68$$\n\n这与先求 $80$ 的 $15\\%$（即 $12$）再减去它是一样的。",
      ),
      generate(rng) {
        const { p, whole, part } = percentPair(rng);
        const up = p.cmp(Q.of(100)) > 0 ? true : rng.bool();
        const result = up ? whole.add(part) : whole.sub(part);
        return numberProblem({
          prompt: up
            ? t(`Increase $${dec(whole)}$ by $${pct(p)}$.`, `把 $${dec(whole)}$ 增加 $${pct(p)}$。`)
            : t(`Decrease $${dec(whole)}$ by $${pct(p)}$.`, `把 $${dec(whole)}$ 减少 $${pct(p)}$。`),
          answer: result,
          form: "decimal",
          wrong: [part, up ? whole.sub(part) : whole.add(part)],
          solution: t(
            `${steps(`${dec(whole)} \\cdot (1 ${up ? "+" : "-"} ${dec(p.div(Q.of(100)))}) = ${dec(whole)} \\cdot ${dec(up ? Q.one.add(p.div(Q.of(100))) : Q.one.sub(p.div(Q.of(100))))} = ${dec(result)}`)}`,
            `${steps(`${dec(whole)} \\cdot (1 ${up ? "+" : "-"} ${dec(p.div(Q.of(100)))}) = ${dec(whole)} \\cdot ${dec(up ? Q.one.add(p.div(Q.of(100))) : Q.one.sub(p.div(Q.of(100))))} = ${dec(result)}`)}`,
          ),
        });
      },
    },
    {
      id: "calculating-percent-change",
      title: t("Calculating the percent change", "求百分比变化"),
      explanation: t(
        "The percent change from an old value to a new value is the change divided by the **old** value:\n\n$$\\text{percent change} = \\frac{\\text{new} - \\text{old}}{\\text{old}} \\cdot 100\\%$$\n\nFrom $40$ to $50$ is a $25\\%$ increase, but from $50$ to $40$ is a $20\\%$ decrease: the old values differ.",
        "从旧值变为新值的百分比变化，是变化量除以**旧值**：\n\n$$\\text{百分比变化} = \\frac{\\text{新值} - \\text{旧值}}{\\text{旧值}} \\cdot 100\\%$$\n\n从 $40$ 到 $50$ 增加了 $25\\%$，但从 $50$ 到 $40$ 减少了 $20\\%$：旧值不同。",
      ),
      generate(rng) {
        const { p, whole, part } = percentPair(rng);
        if (!part.isInteger() || p.cmp(Q.of(100)) >= 0) return this.generate(rng);
        const up = rng.bool();
        const now = up ? whole.add(part) : whole.sub(part);
        return numberProblem({
          prompt: t(
            `A value changes from $${dec(whole)}$ to $${dec(now)}$. By what percent did it ${up ? "increase" : "decrease"}?`,
            `一个量从 $${dec(whole)}$ 变为 $${dec(now)}$，它${up ? "增加" : "减少"}了百分之几？`,
          ),
          answer: p,
          form: "decimal",
          percent: true,
          wrong: [part.div(now).mul(Q.of(100)), part],
          solution: t(
            `The change is $${dec(part)}$; divide by the old value:${steps(`\\frac{${dec(part)}}{${dec(whole)}} = ${dec(p.div(Q.of(100)))} = ${pct(p)}`)}`,
            `变化量是 $${dec(part)}$，除以旧值：${steps(`\\frac{${dec(part)}}{${dec(whole)}} = ${dec(p.div(Q.of(100)))} = ${pct(p)}`)}`,
          ),
        });
      },
    },
  ],
};

/** decimalAndPercentTopics are the topics on decimals and percents. */
export const decimalAndPercentTopics: readonly TopicDef[] = [
  fractionsAndDecimals,
  decimalArithmetic,
  percents,
  percentOfANumber,
  percentChange,
];
