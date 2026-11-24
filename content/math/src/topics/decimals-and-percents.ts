import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, num, Q, q } from "@ga/subject-math";

import { tableFigure } from "./early-grades-more-kit.ts";
import { lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

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

export const fractionsAndDecimals: TopicDef = withIntro(
  {
    id: "fractions-and-decimals",
    title: t("Fractions and Decimals", "分数与小数"),
    summary: t("Convert terminating decimals to fractions and fractions to decimals.", "有限小数化分数，分数化小数。"),
    prerequisites: ["equivalent-fractions"],
    encompasses: [{ topic: "equivalent-fractions", weight: 0.4 }],
    xp: 10,
    standards: ["CCSS.4.NF.C.6", "CCSS.7.NS.A.2.D"],
    knowledgePoints: [
      lesson(
        "decimals-to-fractions",
        ["Decimals as fractions", "小数化分数"],
        [
          [
            "The places after the point count tenths, hundredths and thousandths. Read the decimal as a fraction over $10$, $100$ or $1000$, then simplify: $0.35 = \\frac{35}{100} = \\frac{7}{20}$. The number of decimal places is the number of zeros in the denominator.",
            "小数点后的各位依次表示十分之几、百分之几、千分之几。把小数读成分母是 $10$、$100$ 或 $1000$ 的分数，再约分：$0.35 = \\frac{35}{100} = \\frac{7}{20}$。小数有几位，分母就有几个零。",
          ],
          ["$7 \\div 20 = 0.35$.", "$7 \\div 20 = 0.35$。"],
          [
            "Count the places. $0.35$ has two, so it is over $100$, not $10$ or $1000$.",
            "数清小数位数。$0.35$ 有两位，所以分母是 $100$，不是 $10$ 或 $1000$。",
          ],
        ],
        (rng) => {
          const v = rng.bool(0.3) ? terminatingFraction(rng).add(Q.of(rng.int(1, 5))) : terminatingFraction(rng);
          const k = places(v);
          const scale = 10 ** k;
          const raw = v.mul(Q.of(scale));
          const g = Number(raw.n) / Number(v.n);
          const offs: Off[] = [
            [q(raw.n, 10 ** (k + 1)), "That has one zero too many in the denominator.", "这个分母多了一个零。"],
            [q(raw.n, 10 ** (k - 1)), "That has one zero too few in the denominator.", "这个分母少了一个零。"],
          ];
          if (v.cmp(Q.one) > 0)
            offs.push([v.sub(Q.of(Math.floor(Number(v.n) / Number(v.d)))), "That drops the whole number part.", "这丢掉了整数部分。"]);
          else offs.push([q(v.d, v.n), "That is upside down.", "这颠倒了。"]);
          return valued(
            [`Write $${dec(v)}$ as a fraction in lowest terms.`, `把 $${dec(v)}$ 写成最简分数。`],
            v,
            [
              [
                ["Write over a power of ten", "写成分母是 10 的幂的分数"],
                [`$${dec(v)}$ has $${k}$ decimal place${k === 1 ? "" : "s"}:`, `$${dec(v)}$ 有 $${k}$ 位小数：`],
                [`${dec(v)} = \\frac{${raw.n}}{${scale}}`],
              ],
              [
                ["Simplify", "约分"],
                g > 1 ? [`Divide both by $${g}$:`, `分子分母同除以 $${g}$：`] : ["It is already in lowest terms:", "它已经是最简分数："],
                [`\\frac{${raw.n}}{${scale}} = ${num(v)}`],
              ],
            ],
            [`$${v.n} \\div ${v.d} = ${dec(v)}$.`, `$${v.n} \\div ${v.d} = ${dec(v)}$。`],
            offs,
            { form: "fraction" },
          );
        },
        tapeFigure(
          [
            {
              total: "100",
              pieces: [
                { size: 35, text: "35", lit: true },
                { size: 65, text: "65" },
              ],
            },
          ],
          ["0.35 is 35 of 100 equal parts, which is 7/20.", "0.35 是 100 等份中的 35 份，即 7/20。"],
        ),
      ),
      lesson(
        "fractions-to-decimals",
        ["Fractions as decimals", "分数化小数"],
        [
          [
            "When the denominator divides $10$, $100$ or $1000$, write an equivalent fraction with that denominator and read off the decimal: $\\frac{7}{25} = \\frac{28}{100} = 0.28$. Any fraction is also a division: $\\frac{3}{8} = 3 \\div 8 = 0.375$.",
            "当分母是 $10$、$100$ 或 $1000$ 的因数时，化成以它为分母的等值分数，再读出小数：$\\frac{7}{25} = \\frac{28}{100} = 0.28$。分数也就是除法：$\\frac{3}{8} = 3 \\div 8 = 0.375$。",
          ],
          ["$0.28 \\times 25 = 7$.", "$0.28 \\times 25 = 7$。"],
          [
            "A fraction is not its two numbers joined by a point. $\\frac{3}{8}$ is $0.375$, not $3.8$.",
            "分数不是把两个数用小数点连起来。$\\frac{3}{8}$ 是 $0.375$，不是 $3.8$。",
          ],
        ],
        (rng) => {
          const v = terminatingFraction(rng);
          const k = Math.max(1, places(v));
          const scale = 10 ** k;
          const m = scale / Number(v.d);
          return valued(
            [`Write $${num(v)}$ as a decimal.`, `把 $${num(v)}$ 写成小数。`],
            v,
            [
              [
                ["Scale the denominator", "把分母变成 10 的幂"],
                [`Multiply top and bottom by $${m}$:`, `分子分母同乘 $${m}$：`],
                [`${num(v)} = \\frac{${v.n} \\times ${m}}{${v.d} \\times ${m}} = \\frac{${Number(v.n) * m}}{${scale}}`],
              ],
              [
                ["Read the decimal", "读出小数"],
                [`Over $${scale}$ means $${k}$ decimal place${k === 1 ? "" : "s"}:`, `分母是 $${scale}$，就是 $${k}$ 位小数：`],
                [`\\frac{${Number(v.n) * m}}{${scale}} = ${dec(v)}`],
              ],
            ],
            [`$${dec(v)} \\times ${v.d} = ${v.n}$.`, `$${dec(v)} \\times ${v.d} = ${v.n}$。`],
            [
              [Q.parse(`${v.n}.${v.d}`), "That writes the two numbers with a point between them.", "这是把两个数用小数点连了起来。"],
              [v.mul(Q.of(10)), "The point is one place too far right.", "小数点向右多移了一位。"],
              [v.div(Q.of(10)), "The point is one place too far left.", "小数点向左多移了一位。"],
            ],
            { form: "decimal" },
          );
        },
        lineFigure({ lo: 0, hi: 1, step: 0.125, marks: [{ at: 0.375, text: "0.375", result: true }] }, [
          "3/8 sits three eighths of the way from 0 to 1, at 0.375.",
          "3/8 位于 0 到 1 的八分之三处，即 0.375。",
        ]),
      ),
    ],
  },
  [
    "A recipe asks for $\\frac{3}{4}$ cup of milk, but the measuring jug is marked $0.25$, $0.5$, $0.75$ and $1$.",
    "食谱要 $\\frac{3}{4}$ 杯牛奶，但量杯上的刻度是 $0.25$、$0.5$、$0.75$ 和 $1$。",
  ],
  [
    "$\\frac{3}{4} = \\frac{75}{100} = 0.75$, so fill to the $0.75$ mark.",
    "$\\frac{3}{4} = \\frac{75}{100} = 0.75$，所以倒到 $0.75$ 的刻度。",
  ],
  [
    "turn decimals into fractions and fractions into decimals, and find a far digit of a repeating decimal.",
    "把小数化成分数、分数化成小数，并求循环小数中很远的一位。",
  ],
);

export const decimalArithmetic: TopicDef = withIntro(
  {
    id: "decimal-arithmetic",
    title: t("Adding, Subtracting and Multiplying Decimals", "小数的加减乘"),
    summary: t("Line up decimal points to add and subtract; count decimal places to multiply.", "加减时对齐小数点；乘法时数小数位数。"),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.6.NS.B.3"],
    knowledgePoints: [
      lesson(
        "adding-and-subtracting-decimals",
        ["Adding and subtracting decimals", "小数加减法"],
        [
          [
            "Write the numbers with the **decimal points lined up**, so tenths go with tenths and hundredths with hundredths. Fill empty places with zeros: $12.5 - 3.86 = 12.50 - 3.86 = 8.64$.",
            "把数写成**小数点对齐**，这样十分位和十分位相加减，百分位和百分位相加减。空位补零：$12.5 - 3.86 = 12.50 - 3.86 = 8.64$。",
          ],
          ["$8.64 + 3.86 = 12.50$.", "$8.64 + 3.86 = 12.50$。"],
          [
            "Line up the points, not the last digits. Lining up $5$ with $6$ treats tenths as hundredths.",
            "要对齐小数点，不是对齐末位。把 $5$ 和 $6$ 对齐，就把十分位当成了百分位。",
          ],
        ],
        (rng) => {
          let a = decimal(rng, rng.int(1, 2));
          let b = decimal(rng, rng.int(1, 3), 1);
          const add = rng.bool();
          while (a.eq(b)) b = decimal(rng, rng.int(1, 3), 1);
          if (!add && a.cmp(b) < 0) [a, b] = [b, a];
          const result = add ? a.add(b) : a.sub(b);
          const op = add ? "+" : "-";
          const back = add ? "-" : "+";
          const k = Math.max(places(a), places(b));
          return valued(
            [`Evaluate $${dec(a)} ${op} ${dec(b)}$.`, `计算 $${dec(a)} ${op} ${dec(b)}$。`],
            result,
            [
              [
                ["Line up the points", "对齐小数点"],
                [`Write both with $${k}$ decimal place${k === 1 ? "" : "s"}:`, `都写成 $${k}$ 位小数：`],
                [`${fixed(a, k)} ${op} ${fixed(b, k)}`],
              ],
              [
                [add ? "Add" : "Subtract", add ? "相加" : "相减"],
                ["Place by place, as with whole numbers:", "像整数一样按位计算："],
                [`${fixed(a, k)} ${op} ${fixed(b, k)} = ${dec(result)}`],
              ],
            ],
            [`$${dec(result)} ${back} ${dec(b)} = ${dec(a)}$.`, `$${dec(result)} ${back} ${dec(b)} = ${dec(a)}$。`],
            [
              [
                add ? a.add(b.mul(q(1, 10))) : a.sub(b.mul(q(1, 10))),
                `That shifts $${dec(b)}$ one place to the right before ${add ? "adding" : "subtracting"}.`,
                `这是把 $${dec(b)}$ 错移了一位再${add ? "加" : "减"}。`,
              ],
              [add ? a.mul(q(1, 10)).add(b) : result.mul(Q.of(10)), "The decimal point is in the wrong place.", "小数点的位置错了。"],
              [
                add ? (a.cmp(b) >= 0 ? a.sub(b) : b.sub(a)) : a.add(b),
                add ? "That subtracts instead of adding." : "That adds instead of subtracting.",
                add ? "这是减，不是加。" : "这是加，不是减。",
              ],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["12.50", "3.86", "8.64"], [1250, 386, 864]),
      ),
      lesson(
        "multiplying-decimals",
        ["Multiplying decimals", "小数乘法"],
        [
          [
            "Multiply as if there were no points, then place the point so the product has as many decimal places as the two factors together. $2.3 \\times 0.15$: $23 \\times 15 = 345$, and $1 + 2 = 3$ places, so $2.3 \\times 0.15 = 0.345$.",
            "先不看小数点，按整数相乘；再点小数点，使积的小数位数等于两个因数的小数位数之和。$2.3 \\times 0.15$：$23 \\times 15 = 345$，$1 + 2 = 3$ 位，所以 $2.3 \\times 0.15 = 0.345$。",
          ],
          ["Estimate: $2 \\times 0.15 = 0.3$, close to $0.345$.", "估算：$2 \\times 0.15 = 0.3$，接近 $0.345$。"],
          [
            "Count the places of both factors. $2.3 \\times 0.15$ is not $3.45$ or $0.0345$.",
            "两个因数的小数位数都要数。$2.3 \\times 0.15$ 不是 $3.45$，也不是 $0.0345$。",
          ],
        ],
        (rng) => {
          const a = decimal(rng, rng.int(1, 2), 1);
          const b = rng.bool(0.3) ? Q.of(rng.int(2, 30)) : decimal(rng, 1, 1);
          const p = a.mul(b);
          const ka = places(a);
          const kb = places(b);
          const ia = a.mul(Q.of(10 ** ka));
          const ib = b.mul(Q.of(10 ** kb));
          return valued(
            [`Evaluate $${dec(a)} \\times ${dec(b)}$.`, `计算 $${dec(a)} \\times ${dec(b)}$。`],
            p,
            [
              [
                ["Multiply whole numbers", "按整数相乘"],
                ["Ignore the points:", "先不看小数点："],
                [`${ia.n} \\times ${ib.n} = ${ia.mul(ib).n}`],
              ],
              [
                ["Place the point", "点小数点"],
                [`The factors have $${ka} + ${kb} = ${ka + kb}$ decimal places:`, `两个因数共有 $${ka} + ${kb} = ${ka + kb}$ 位小数：`],
                [`${dec(a)} \\times ${dec(b)} = ${dec(p)}`],
              ],
            ],
            [`$${dec(p)} \\div ${dec(b)} = ${dec(a)}$.`, `$${dec(p)} \\div ${dec(b)} = ${dec(a)}$。`],
            [
              [p.mul(Q.of(10)), "That has one decimal place too few.", "小数位数少了一位。"],
              [p.mul(q(1, 10)), "That has one decimal place too many.", "小数位数多了一位。"],
              [a.add(b), "That adds the numbers instead of multiplying.", "这是加，不是乘。"],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["23 x 15", "2.3 x 0.15"], [345, 0.345]),
      ),
    ],
  },
  [
    "Mia buys a pen for $\\$1.25$ and a notebook for $\\$2.40$, then buys $3$ more pens.",
    "米娅买了一支 $1.25$ 美元的笔和一本 $2.40$ 美元的笔记本，然后又买了 $3$ 支笔。",
  ],
  [
    "$1.25 + 2.40 = 3.65$, and $3 \\times 1.25 = 3.75$, so she spends $\\$7.40$ in all.",
    "$1.25 + 2.40 = 3.65$，$3 \\times 1.25 = 3.75$，所以她一共花了 $7.40$ 美元。",
  ],
  [
    "add and subtract decimals with the points lined up, multiply decimals by counting places, and divide by a decimal.",
    "对齐小数点做小数加减法，数小数位数做小数乘法，并学会除以小数。",
  ],
);

export const percents: TopicDef = withIntro(
  {
    id: "percents",
    title: t("Percents", "百分数"),
    summary: t("Convert between percents, decimals and fractions.", "百分数、小数与分数互化。"),
    prerequisites: ["fractions-and-decimals"],
    encompasses: [{ topic: "fractions-and-decimals", weight: 0.4 }],
    xp: 10,
    standards: ["CCSS.6.RP.A.3.C"],
    knowledgePoints: [
      lesson(
        "percents-as-decimals-and-fractions",
        ["Percents as decimals and fractions", "百分数化小数和分数"],
        [
          [
            '**Percent** means "per hundred": $p\\%$ is $\\frac{p}{100}$. As a decimal, divide by $100$ by moving the point two places left: $35\\% = 0.35$, $7\\% = 0.07$, $120\\% = 1.2$. As a fraction, write it over $100$ and simplify: $35\\% = \\frac{35}{100} = \\frac{7}{20}$.',
            "**百分数**表示“每一百中有多少”：$p\\%$ 就是 $\\frac{p}{100}$。化成小数要除以 $100$，即小数点向左移两位：$35\\% = 0.35$，$7\\% = 0.07$，$120\\% = 1.2$。化成分数就写成分母是 $100$ 的分数再约分：$35\\% = \\frac{35}{100} = \\frac{7}{20}$。",
          ],
          ["$\\frac{7}{20} = 0.35$, the same as the decimal.", "$\\frac{7}{20} = 0.35$，和小数一样。"],
          ["Move the point two places, not one. $7\\%$ is $0.07$, not $0.7$.", "小数点要移两位，不是一位。$7\\%$ 是 $0.07$，不是 $0.7$。"],
        ],
        (rng) => {
          const p = rng.bool(0.15) ? Q.of(rng.int(101, 250)) : Q.of(rng.int(1, 99));
          const v = p.div(Q.of(100));
          if (rng.bool()) {
            return valued(
              [`Write $${pct(p)}$ as a decimal.`, `把 $${pct(p)}$ 写成小数。`],
              v,
              [
                [["Divide by 100", "除以 100"], ["Percent means hundredths:", "百分数表示百分之几："], [`${pct(p)} = ${dec(p)} \\div 100`]],
                [["Move the point", "移动小数点"], ["Two places to the left:", "向左移两位："], [`${dec(p)} \\div 100 = ${dec(v)}`]],
              ],
              [`$${dec(v)} \\times 100 = ${dec(p)}$.`, `$${dec(v)} \\times 100 = ${dec(p)}$。`],
              [
                [p.div(Q.of(10)), "That moves the point only one place.", "这只把小数点移了一位。"],
                [p.div(Q.of(1000)), "That moves the point three places.", "这把小数点移了三位。"],
                [p, "That drops the percent sign without dividing by $100$.", "这只是去掉了百分号，没有除以 $100$。"],
              ],
              { form: "decimal" },
            );
          }
          const g = 100 / Number(v.d);
          return valued(
            [`Write $${pct(p)}$ as a fraction in lowest terms.`, `把 $${pct(p)}$ 写成最简分数。`],
            v,
            [
              [
                ["Write over 100", "写成分母 100"],
                ["Percent means hundredths:", "百分数表示百分之几："],
                [`${pct(p)} = \\frac{${p.n}}{100}`],
              ],
              [
                ["Simplify", "约分"],
                g > 1 ? [`Divide both by $${g}$:`, `分子分母同除以 $${g}$：`] : ["It is already in lowest terms:", "它已经是最简分数："],
                [`\\frac{${p.n}}{100} = ${num(v)}`],
              ],
            ],
            [`$${v.n} \\div ${v.d} = ${dec(v)}$, which is $${pct(p)}$.`, `$${v.n} \\div ${v.d} = ${dec(v)}$，就是 $${pct(p)}$。`],
            [
              [p.div(Q.of(10)), "That puts the number over $10$. Percent means over $100$.", "这是写在 $10$ 上面。百分数的分母是 $100$。"],
              [p.div(Q.of(1000)), "That puts the number over $1000$.", "这是写在 $1000$ 上面。"],
              [Q.of(100).div(p), "That is upside down.", "这颠倒了。"],
            ],
            { form: "fraction" },
          );
        },
        tableFigure(["35%", "7%", "120%"], [0.35, 0.07, 1.2]),
      ),
      lesson(
        "writing-percents",
        ["Writing decimals and fractions as percents", "小数和分数化百分数"],
        [
          [
            "To write a number as a percent, multiply it by $100$: $0.625 = 62.5\\%$ and $1.4 = 140\\%$. For a fraction, first write it as a decimal: $\\frac{3}{8} = 0.375 = 37.5\\%$.",
            "把一个数化成百分数，就乘 $100$：$0.625 = 62.5\\%$，$1.4 = 140\\%$。分数要先化成小数：$\\frac{3}{8} = 0.375 = 37.5\\%$。",
          ],
          ["$37.5\\% = 37.5 \\div 100 = 0.375$.", "$37.5\\% = 37.5 \\div 100 = 0.375$。"],
          [
            "Multiply by $100$, not $10$. $0.625$ is $62.5\\%$, not $6.25\\%$.",
            "要乘 $100$，不是乘 $10$。$0.625$ 是 $62.5\\%$，不是 $6.25\\%$。",
          ],
        ],
        (rng) => {
          const v = rng.bool() ? terminatingFraction(rng) : decimal(rng, rng.int(1, 3), 1);
          const p = v.mul(Q.of(100));
          const asFraction = !v.mul(Q.of(10)).isInteger() && v.d <= 50n && rng.bool();
          const shown = asFraction ? num(v) : dec(v);
          return valued(
            [`Write $${shown}$ as a percent.`, `把 $${shown}$ 写成百分数。`],
            p,
            [
              asFraction
                ? [
                    ["Write a decimal", "化成小数"],
                    ["Divide the top by the bottom:", "分子除以分母："],
                    [`${shown} = ${v.n} \\div ${v.d} = ${dec(v)}`],
                  ]
                : [["Read the decimal", "读出小数"], ["It is already a decimal:", "它已经是小数："], [`${dec(v)}`]],
              [
                ["Multiply by 100", "乘 100"],
                ["Move the point two places right:", "小数点向右移两位："],
                [`${dec(v)} \\times 100 = ${dec(p)}`],
              ],
            ],
            [`$${pct(p)} = ${dec(p)} \\div 100 = ${dec(v)}$.`, `$${pct(p)} = ${dec(p)} \\div 100 = ${dec(v)}$。`],
            [
              [v.mul(Q.of(10)), "That multiplies by $10$, not $100$.", "这是乘 $10$，不是乘 $100$。"],
              [v.mul(Q.of(1000)), "That multiplies by $1000$, not $100$.", "这是乘 $1000$，不是乘 $100$。"],
              [v, "That puts a percent sign on without multiplying by $100$.", "这只是加上百分号，没有乘 $100$。"],
            ],
            { form: "decimal", percent: true },
          );
        },
        tableFigure(["0.625", "1.4", "3/8"], [62.5, 140, 37.5]),
      ),
    ],
  },
  [
    "A sign says $25\\%$ of the seats are taken. Another says $\\frac{1}{4}$ are taken, and a third says $0.25$.",
    "一块牌子写着 $25\\%$ 的座位有人坐，另一块写着 $\\frac{1}{4}$，第三块写着 $0.25$。",
  ],
  [
    "$25\\% = \\frac{25}{100} = \\frac{1}{4} = 0.25$, so all three signs say the same thing.",
    "$25\\% = \\frac{25}{100} = \\frac{1}{4} = 0.25$，所以三块牌子说的是同一件事。",
  ],
  [
    "turn percents into decimals and fractions, and decimals and fractions into percents.",
    "把百分数化成小数和分数，再把小数和分数化成百分数。",
  ],
);

/** percentPair draws a percentage and a whole whose part is a whole number or has one decimal place. */
function percentPair(rng: Rng): { p: Q; whole: Q; part: Q } {
  for (;;) {
    const p = Q.of(rng.pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 75, 80, 90, 120, 150]));
    const whole = Q.of(rng.int(2, 80) * rng.pick([2, 4, 5, 10]));
    const part = p.mul(whole).div(Q.of(100));
    if (part.mul(Q.of(10)).isInteger()) return { p, whole, part };
  }
}

export const percentOfANumber: TopicDef = withIntro(
  {
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
      lesson(
        "finding-the-part",
        ["Finding the part", "求部分"],
        [
          [
            "To find $p\\%$ of a number, write the percent as a decimal and multiply: $35\\%$ of $60$ is $0.35 \\times 60 = 21$. Shortcuts help: $10\\%$ is a tenth, $50\\%$ is half, $25\\%$ is a quarter.",
            "求一个数的 $p\\%$，把百分数写成小数再相乘：$60$ 的 $35\\%$ 是 $0.35 \\times 60 = 21$。捷径很有用：$10\\%$ 是十分之一，$50\\%$ 是一半，$25\\%$ 是四分之一。",
          ],
          [
            "$10\\%$ of $60$ is $6$ and $5\\%$ is $3$, so $35\\% = 3 \\times 6 + 3 = 21$.",
            "$60$ 的 $10\\%$ 是 $6$，$5\\%$ 是 $3$，所以 $35\\%$ 是 $3 \\times 6 + 3 = 21$。",
          ],
          [
            "Write the percent as a decimal first. $35 \\times 60 = 2100$ is far too big.",
            "先把百分数写成小数。$35 \\times 60 = 2100$ 太大了。",
          ],
        ],
        (rng) => {
          const { p, whole, part } = percentPair(rng);
          const one = whole.div(Q.of(100));
          return valued(
            [`What is $${pct(p)}$ of $${dec(whole)}$?`, `$${dec(whole)}$ 的 $${pct(p)}$ 是多少？`],
            part,
            [
              [
                ["Write a decimal", "化成小数"],
                ["Divide the percent by $100$:", "百分数除以 $100$："],
                [`${pct(p)} = ${dec(p.div(Q.of(100)))}`],
              ],
              [
                ["Multiply", "相乘"],
                ["A part of a number means multiply:", "求一个数的几分之几用乘法："],
                [`${dec(p.div(Q.of(100)))} \\times ${dec(whole)} = ${dec(part)}`],
              ],
            ],
            [
              `$1\\%$ of $${dec(whole)}$ is $${dec(one)}$, and $${dec(p)} \\times ${dec(one)} = ${dec(part)}$.`,
              `$${dec(whole)}$ 的 $1\\%$ 是 $${dec(one)}$，$${dec(p)} \\times ${dec(one)} = ${dec(part)}$。`,
            ],
            [
              [
                p.mul(whole),
                "That uses the percent as a whole number. Write it as a decimal first.",
                "这是把百分数当成了整数。应先写成小数。",
              ],
              [
                whole.div(p).mul(Q.of(100)),
                "That divides by the percent. To find a part of a number, multiply.",
                "这是除以百分数。求一个数的一部分要用乘法。",
              ],
              [whole.sub(part), "That is what is left after taking the part away.", "这是去掉这部分后剩下的。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "60",
              pieces: [
                { size: 35, text: "21", lit: true },
                { size: 65, text: "39" },
              ],
            },
          ],
          ["35% of a bar of 60 is 21.", "长度为 60 的长条的 35% 是 21。"],
        ),
      ),
      lesson(
        "finding-the-percent",
        ["Finding the percent", "求百分比"],
        [
          [
            'To find what percent a part is of a whole, divide the part by the whole and multiply by $100$: $\\frac{18}{24} = 0.75 = 75\\%$. The whole is the number after "of": "$18$ is what percent of $24$?"',
            "求部分占整体的百分之几，用部分除以整体再乘 $100$：$\\frac{18}{24} = 0.75 = 75\\%$。“$18$ 是 $24$ 的百分之几？”中，整体是 $24$。",
          ],
          ["$75\\%$ of $24$ is $0.75 \\times 24 = 18$.", "$24$ 的 $75\\%$ 是 $0.75 \\times 24 = 18$。"],
          [
            "Part over whole, not whole over part. $\\frac{24}{18}$ is more than $100\\%$.",
            "是部分除以整体，不是整体除以部分。$\\frac{24}{18}$ 超过了 $100\\%$。",
          ],
        ],
        (rng) => {
          let pick = percentPair(rng);
          while (!pick.part.isInteger()) pick = percentPair(rng);
          const { p, whole, part } = pick;
          return valued(
            [`$${dec(part)}$ is what percent of $${dec(whole)}$?`, `$${dec(part)}$ 是 $${dec(whole)}$ 的百分之几？`],
            p,
            [
              [
                ["Divide", "相除"],
                ["Part over whole:", "部分除以整体："],
                [`\\frac{${dec(part)}}{${dec(whole)}} = ${dec(p.div(Q.of(100)))}`],
              ],
              [
                ["Write a percent", "化成百分数"],
                ["Multiply by $100$:", "乘 $100$："],
                [`${dec(p.div(Q.of(100)))} \\times 100 = ${dec(p)}`],
              ],
            ],
            [
              `$${pct(p)}$ of $${dec(whole)}$ is $${dec(p.div(Q.of(100)))} \\times ${dec(whole)} = ${dec(part)}$.`,
              `$${dec(whole)}$ 的 $${pct(p)}$ 是 $${dec(p.div(Q.of(100)))} \\times ${dec(whole)} = ${dec(part)}$。`,
            ],
            [
              [
                whole.div(part).mul(Q.of(100)),
                "That divides the whole by the part. The percent is part over whole.",
                "这是用整体除以部分。百分比是部分除以整体。",
              ],
              [part.div(whole), "That is the decimal. Multiply by $100$ to write it as a percent.", "这是小数，还要乘 $100$ 才是百分数。"],
              [part, "That is the part itself, not its percent.", "这是部分本身，不是它的百分比。"],
            ],
            { form: "decimal", percent: true },
          );
        },
        tapeFigure(
          [
            {
              total: "24",
              pieces: [
                { size: 18, text: "18", lit: true },
                { size: 6, text: "6" },
              ],
            },
          ],
          ["18 of a bar of 24 is three quarters, 75%.", "长度为 24 的长条中的 18 是四分之三，即 75%。"],
        ),
      ),
      lesson(
        "finding-the-whole",
        ["Finding the whole", "求整体"],
        [
          [
            "If $p\\%$ of a number is known, divide that part by the percent written as a decimal. If $40\\%$ of a number is $18$, then $0.4 \\times n = 18$ and $n = 18 \\div 0.4 = 45$.",
            "已知一个数的 $p\\%$ 是多少，求这个数：用这部分除以写成小数的百分数。如果一个数的 $40\\%$ 是 $18$，那么 $0.4 \\times n = 18$，$n = 18 \\div 0.4 = 45$。",
          ],
          ["$40\\%$ of $45$ is $0.4 \\times 45 = 18$.", "$45$ 的 $40\\%$ 是 $0.4 \\times 45 = 18$。"],
          [
            "The given number is already the part. Taking $40\\%$ of $18$ goes the wrong way.",
            "已知的数已经是部分了。求 $18$ 的 $40\\%$ 方向反了。",
          ],
        ],
        (rng) => {
          const { p, whole, part } = percentPair(rng);
          const r = p.div(Q.of(100));
          return valued(
            [`$${pct(p)}$ of a number is $${dec(part)}$. What is the number?`, `一个数的 $${pct(p)}$ 是 $${dec(part)}$，这个数是多少？`],
            whole,
            [
              [
                ["Write the equation", "列方程"],
                ["The percent as a decimal times the number:", "百分数写成小数，乘这个数："],
                [`${dec(r)} \\times n = ${dec(part)}`],
              ],
              [
                ["Divide", "相除"],
                [`Divide both sides by $${dec(r)}$:`, `两边同除以 $${dec(r)}$：`],
                [`n = ${dec(part)} \\div ${dec(r)} = ${dec(whole)}`],
              ],
            ],
            [
              `$${pct(p)}$ of $${dec(whole)}$ is $${dec(r)} \\times ${dec(whole)} = ${dec(part)}$.`,
              `$${dec(whole)}$ 的 $${pct(p)}$ 是 $${dec(r)} \\times ${dec(whole)} = ${dec(part)}$。`,
            ],
            [
              [
                part.mul(r),
                "That takes the percent of the part. The given number is already the part.",
                "这是求已知数的百分之几。已知数本身就是部分。",
              ],
              [part.div(p), "That divides by the percent without writing it as a decimal first.", "这是直接除以百分数，没有先化成小数。"],
              [part.add(p), "That adds the percent to the part.", "这是把百分数加到部分上。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "45",
              pieces: [
                { size: 9, text: "9", lit: true },
                { size: 9, text: "9", lit: true },
                { size: 9, text: "9" },
                { size: 9, text: "9" },
                { size: 9, text: "9" },
              ],
            },
          ],
          [
            "40% is two fifths, shaded, and holds 18; each fifth is 9, so the whole is 45.",
            "40% 是五分之二（涂色部分），等于 18；每一份是 9，所以整体是 45。",
          ],
        ),
      ),
    ],
  },
  [
    "A jacket costs $\\$60$ and is $35\\%$ off. Mia wants to know how many dollars she saves.",
    "一件夹克 $60$ 美元，打六五折（减 $35\\%$）。米娅想知道能省多少美元。",
  ],
  [
    "$10\\%$ of $60$ is $6$, so $30\\%$ is $18$, $5\\%$ is $3$, and $35\\%$ is $21$ dollars.",
    "$60$ 的 $10\\%$ 是 $6$，所以 $30\\%$ 是 $18$，$5\\%$ 是 $3$，$35\\%$ 是 $21$ 美元。",
  ],
  [
    "find a percent of a number, find what percent one number is of another, and find the whole from a part.",
    "求一个数的百分之几，求一个数是另一个数的百分之几，并由部分求整体。",
  ],
);
export const percentChange: TopicDef = withIntro(
  {
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
      lesson(
        "applying-percent-changes",
        ["Applying an increase or decrease", "按百分比增减"],
        [
          [
            "An increase of $p\\%$ multiplies a value by $1 + \\frac{p}{100}$; a decrease of $p\\%$ multiplies it by $1 - \\frac{p}{100}$. A price of $80$ after a $15\\%$ discount is $80 \\times (1 - 0.15) = 80 \\times 0.85 = 68$.",
            "增加 $p\\%$ 就是乘 $1 + \\frac{p}{100}$；减少 $p\\%$ 就是乘 $1 - \\frac{p}{100}$。原价 $80$ 减少 $15\\%$ 后是 $80 \\times (1 - 0.15) = 80 \\times 0.85 = 68$。",
          ],
          ["$15\\%$ of $80$ is $12$, and $80 - 12 = 68$.", "$80$ 的 $15\\%$ 是 $12$，$80 - 12 = 68$。"],
          ["$12$ is only the amount taken off; the answer is what is left, $68$.", "$12$ 只是减掉的量；答案是剩下的 $68$。"],
        ],
        (rng) => {
          const { p, whole, part } = percentPair(rng);
          const up = p.cmp(Q.of(100)) > 0 ? true : rng.bool();
          const result = up ? whole.add(part) : whole.sub(part);
          const r = p.div(Q.of(100));
          const m = up ? Q.one.add(r) : Q.one.sub(r);
          return valued(
            up
              ? [`Increase $${dec(whole)}$ by $${pct(p)}$.`, `把 $${dec(whole)}$ 增加 $${pct(p)}$。`]
              : [`Decrease $${dec(whole)}$ by $${pct(p)}$.`, `把 $${dec(whole)}$ 减少 $${pct(p)}$。`],
            result,
            [
              [
                ["The multiplier", "倍数"],
                [`${up ? "Add" : "Subtract"} $${dec(r)}$ ${up ? "to" : "from"} $1$:`, `用 $1$ ${up ? "加" : "减"} $${dec(r)}$：`],
                [`1 ${up ? "+" : "-"} ${dec(r)} = ${dec(m)}`],
              ],
              [
                ["Multiply", "相乘"],
                [`Multiply $${dec(whole)}$ by it:`, `用 $${dec(whole)}$ 乘它：`],
                [`${dec(whole)} \\times ${dec(m)} = ${dec(result)}`],
              ],
            ],
            [
              `$${pct(p)}$ of $${dec(whole)}$ is $${dec(part)}$, and $${dec(whole)} ${up ? "+" : "-"} ${dec(part)} = ${dec(result)}$.`,
              `$${dec(whole)}$ 的 $${pct(p)}$ 是 $${dec(part)}$，$${dec(whole)} ${up ? "+" : "-"} ${dec(part)} = ${dec(result)}$。`,
            ],
            [
              [
                part,
                `That is only the ${up ? "increase" : "decrease"}, not the new value.`,
                `这只是${up ? "增加" : "减少"}的量，不是新的值。`,
              ],
              [
                up ? whole.sub(part) : whole.add(part),
                `That ${up ? "decreases" : "increases"} instead of ${up ? "increasing" : "decreasing"}.`,
                `这是${up ? "减少" : "增加"}了，方向反了。`,
              ],
              [
                up ? whole.add(p) : whole.sub(p),
                `That ${up ? "adds" : "subtracts"} the number $${dec(p)}$, not $${pct(p)}$ of $${dec(whole)}$.`,
                `这是${up ? "加" : "减"}了数 $${dec(p)}$，而不是 $${dec(whole)}$ 的 $${pct(p)}$。`,
              ],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "80",
              pieces: [
                { size: 68, text: "68", lit: true },
                { size: 12, text: "12", dashed: true },
              ],
            },
          ],
          ["A bar of 80 with 12 taken away, 15 percent of 80, leaving 68.", "长条 80 去掉它的 15%，即 12，剩下 68。"],
        ),
      ),
      lesson(
        "calculating-percent-change",
        ["Calculating the percent change", "求百分比变化"],
        [
          [
            "The percent change is the change divided by the old value. From $40$ to $50$ the change is $10$, and $\\frac{10}{40} = 25\\%$, an increase. From $50$ to $40$ the change is also $10$, but $\\frac{10}{50} = 20\\%$, a decrease: the old values differ.",
            "百分比变化是变化量除以旧值。从 $40$ 到 $50$，变化量是 $10$，$\\frac{10}{40} = 25\\%$，是增加。从 $50$ 到 $40$，变化量也是 $10$，但 $\\frac{10}{50} = 20\\%$，是减少：旧值不同。",
          ],
          ["$40 \\times 1.25 = 50$ and $50 \\times 0.8 = 40$.", "$40 \\times 1.25 = 50$，$50 \\times 0.8 = 40$。"],
          ["Divide by the old value, not the new one.", "要除以旧值，不是新值。"],
        ],
        (rng) => {
          let pick = percentPair(rng);
          while (!pick.part.isInteger() || pick.p.cmp(Q.of(100)) >= 0) pick = percentPair(rng);
          const { p, whole, part } = pick;
          const up = rng.bool();
          const now = up ? whole.add(part) : whole.sub(part);
          const r = p.div(Q.of(100));
          const m = up ? Q.one.add(r) : Q.one.sub(r);
          return valued(
            [
              `A value changes from $${dec(whole)}$ to $${dec(now)}$. By what percent did it ${up ? "increase" : "decrease"}?`,
              `一个量从 $${dec(whole)}$ 变为 $${dec(now)}$，它${up ? "增加" : "减少"}了百分之几？`,
            ],
            p,
            [
              [
                ["The change", "变化量"],
                ["Subtract the smaller value from the larger:", "用大的值减去小的值："],
                [`${dec(up ? now : whole)} - ${dec(up ? whole : now)} = ${dec(part)}`],
              ],
              [
                ["Divide by the old value", "除以旧值"],
                [`Divide by the old value, $${dec(whole)}$:`, `除以旧值 $${dec(whole)}$：`],
                [`\\frac{${dec(part)}}{${dec(whole)}} = ${dec(r)} = ${pct(p)}`],
              ],
            ],
            [
              `$${dec(whole)} \\times ${dec(m)} = ${dec(now)}$, the new value.`,
              `$${dec(whole)} \\times ${dec(m)} = ${dec(now)}$，正是新值。`,
            ],
            [
              [part.div(now).mul(Q.of(100)), "That divides by the new value; divide by the old value.", "这是除以新值；应该除以旧值。"],
              [part, "That is the change itself, not a percent.", "这是变化量本身，不是百分比。"],
              [
                now.div(whole).mul(Q.of(100)),
                "That is the new value as a percent of the old, not the change.",
                "这是新值占旧值的百分比，不是变化的百分比。",
              ],
            ],
            { form: "decimal", percent: true },
          );
        },
        tapeFigure(
          [
            {
              total: "50",
              pieces: [
                { size: 40, text: "40" },
                { size: 10, text: "10", lit: true },
              ],
            },
          ],
          ["A bar of 40 with 10 more, making 50; the 10 is compared with the old 40.", "长条 40 再加 10，共 50；用 10 和旧值 40 比较。"],
        ),
      ),
    ],
  },
  ["A $\\$80$ jacket is $15\\%$ off. What does it cost now?", "一件 $\\$80$ 的夹克减价 $15\\%$。现在要多少钱？"],
  [
    "$80 \\times 0.85 = \\$68$; and $15\\%$ of $80$ is $12$, $80 - 12 = 68$.",
    "$80 \\times 0.85 = \\$68$；而 $80$ 的 $15\\%$ 是 $12$，$80 - 12 = 68$。",
  ],
  [
    "increase or decrease a value by a percent, and find the percent change from an old value to a new one.",
    "按百分比增加或减少一个值，并求从旧值到新值的百分比变化。",
  ],
);

/** decimalAndPercentTopics are the topics on decimals and percents. */
export const decimalAndPercentTopics: readonly TopicDef[] = [
  fractionsAndDecimals,
  decimalArithmetic,
  percents,
  percentOfANumber,
  percentChange,
];
