import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, gcd, num, Q, q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { tableFigure } from "./early-grades-more-kit.ts";
import { chosen, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { equalTape, tapeFigure } from "./upper-grades-kit.ts";

/** Pair is a pair of countable things for ratio word problems, in both languages. */
interface Pair {
  readonly a: Text;
  readonly b: Text;
  readonly where: Text;
  /** measure is the Chinese measure word for both things, as in 颗弹珠. */
  readonly measure: string;
}

const pairs: readonly Pair[] = [
  { a: t("red marbles", "红色弹珠"), b: t("blue marbles", "蓝色弹珠"), where: t("a bag", "一个袋子里"), measure: "颗" },
  { a: t("boys", "男生"), b: t("girls", "女生"), where: t("a class", "一个年级里"), measure: "名" },
  { a: t("cats", "猫"), b: t("dogs", "狗"), where: t("a shelter", "一个收容所里"), measure: "只" },
  { a: t("apples", "苹果"), b: t("oranges", "橙子"), where: t("a basket", "一个篮子里"), measure: "个" },
  { a: t("fiction books", "小说"), b: t("nonfiction books", "非虚构类图书"), where: t("a library", "一个图书馆里"), measure: "本" },
];

/** ratioPair draws a ratio in lowest terms, a : b with a ≠ b, both in [1, 9]. */
function ratioPair(rng: Rng): [number, number] {
  for (;;) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    if (a !== b && gcd(a, b) === 1) return [a, b];
  }
}

/** Item is something sold by the unit, for unit-rate problems. */
interface Item {
  /** unit is one unit in English; measure is its Chinese measure word, as in 每本. */
  readonly unit: string;
  readonly measure: string;
  readonly units: Text;
  readonly what: Text;
}

const items: readonly Item[] = [
  { unit: "notebook", measure: "本", units: t("notebooks", "本笔记本"), what: t("notebooks", "笔记本") },
  { unit: "pound of apples", measure: "磅", units: t("pounds of apples", "磅苹果"), what: t("apples", "苹果") },
  { unit: "bottle of water", measure: "瓶", units: t("bottles of water", "瓶水"), what: t("water", "水") },
  { unit: "pen", measure: "支", units: t("pens", "支笔"), what: t("pens", "笔") },
];

export const ratios: TopicDef = withIntro(
  {
    id: "ratios",
    title: t("Ratios", "比"),
    summary: t("Write ratios in lowest terms and find missing values of equivalent ratios.", "把比化成最简整数比，求等值比中缺少的数。"),
    prerequisites: ["equivalent-fractions"],
    encompasses: [{ topic: "equivalent-fractions", weight: 0.4 }],
    xp: 10,
    standards: ["CCSS.6.RP.A.1", "CCSS.6.RP.A.3.A"],
    knowledgePoints: [
      lesson(
        "writing-ratios",
        ["Writing ratios", "写出比"],
        [
          [
            "A **ratio** compares two amounts, in the order the words give. A bag with $6$ red and $9$ blue marbles has red to blue $6 : 9$, also written $\\frac{6}{9}$. Divide both numbers by a common factor to simplify: $6 : 9 = 2 : 3$, or $\\frac{2}{3}$.",
            "**比**用来比较两个量，顺序按题目里的先后。袋子里有 $6$ 颗红色弹珠和 $9$ 颗蓝色弹珠，红色与蓝色的比是 $6 : 9$，也写成 $\\frac{6}{9}$。两项同时除以公因数来化简：$6 : 9 = 2 : 3$，即 $\\frac{2}{3}$。",
          ],
          [
            "$2 \\times 3 = 6$ and $3 \\times 3 = 9$, so $2 : 3$ scales back to $6 : 9$.",
            "$2 \\times 3 = 6$，$3 \\times 3 = 9$，所以 $2 : 3$ 放大后又是 $6 : 9$。",
          ],
          [
            "Order matters. Blue to red is $9 : 6 = 3 : 2$, a different ratio.",
            "顺序很重要。蓝色与红色的比是 $9 : 6 = 3 : 2$，是另一个比。",
          ],
        ],
        (rng) => {
          const [a, b] = ratioPair(rng);
          const k = rng.int(2, 9);
          const p = rng.pick(pairs);
          const r = q(a, b);
          return valued(
            [
              `${capitalize(p.where.en)} has $${a * k}$ ${p.a.en} and $${b * k}$ ${p.b.en}. Write the ratio of ${p.a.en} to ${p.b.en} as a fraction in lowest terms.`,
              `${p.where["zh-CN"]}有 $${a * k}$ ${p.measure}${p.a["zh-CN"]}和 $${b * k}$ ${p.measure}${p.b["zh-CN"]}。把${p.a["zh-CN"]}与${p.b["zh-CN"]}的比写成最简分数。`,
            ],
            r,
            [
              [
                ["Write the ratio", "写出比"],
                [`${capitalize(p.a.en)} first, then ${p.b.en}:`, `${p.a["zh-CN"]}在前，${p.b["zh-CN"]}在后：`],
                [`${a * k} : ${b * k} = \\frac{${a * k}}{${b * k}}`],
              ],
              [["Simplify", "化简"], [`Divide both by $${k}$:`, `两项同时除以 $${k}$：`], [`\\frac{${a * k}}{${b * k}} = ${num(r)}`]],
            ],
            [
              `$${a} \\times ${k} = ${a * k}$ and $${b} \\times ${k} = ${b * k}$.`,
              `$${a} \\times ${k} = ${a * k}$，$${b} \\times ${k} = ${b * k}$。`,
            ],
            [
              [q(b, a), `That is ${p.b.en} to ${p.a.en}, the wrong order.`, `这是${p.b["zh-CN"]}与${p.a["zh-CN"]}的比，顺序反了。`],
              [
                q(a, a + b),
                `That compares the ${p.a.en} with all of them, not with the ${p.b.en}.`,
                `这是${p.a["zh-CN"]}和总数的比，不是和${p.b["zh-CN"]}的比。`,
              ],
              [q(b, a + b), `That is the ${p.b.en} out of all of them.`, `这是${p.b["zh-CN"]}占总数的分数。`],
            ],
            { form: "fraction" },
          );
        },
        tapeFigure(
          [
            { total: "6", pieces: [0, 1].map(() => ({ size: 3, text: "3", lit: true })) },
            { total: "9", pieces: [0, 1, 2].map(() => ({ size: 3, text: "3" })) },
          ],
          ["6 : 9 in groups of 3 is 2 groups to 3 groups, so 2 : 3.", "6 : 9 按每组 3 个分，是 2 组比 3 组，所以是 2 : 3。"],
        ),
      ),
      lesson(
        "equivalent-ratios",
        ["Equivalent ratios", "等值比"],
        [
          [
            "Multiplying or dividing both numbers of a ratio by the same number gives an **equivalent ratio**. To fill in $4 : 7 = 20 : ?$, see that $4$ was multiplied by $5$ to make $20$, so multiply $7$ by $5$ too: $4 : 7 = 20 : 35$.",
            "比的两项同时乘或除以同一个数，得到**等值比**。求 $4 : 7 = 20 : ?$ 时，看出 $4$ 乘 $5$ 得 $20$，所以 $7$ 也乘 $5$：$4 : 7 = 20 : 35$。",
          ],
          ["$\\frac{20}{35}$ simplifies by $5$ to $\\frac{4}{7}$.", "$\\frac{20}{35}$ 约去 $5$ 得 $\\frac{4}{7}$。"],
          [
            "Multiply, do not add. $4 + 16 = 20$, but $7 + 16 = 23$ gives a different ratio.",
            "要乘，不是加。$4 + 16 = 20$，但 $7 + 16 = 23$ 得到的是另一个比。",
          ],
        ],
        (rng) => {
          const [a, b] = ratioPair(rng);
          const k = rng.int(2, 12);
          return valued(
            [`Find the missing number: $$${a} : ${b} = ${a * k} : \\, ?$$`, `求缺少的数：$$${a} : ${b} = ${a * k} : \\, ?$$`],
            b * k,
            [
              [
                ["Find the multiplier", "求倍数"],
                [`What turns $${a}$ into $${a * k}$:`, `$${a}$ 乘几得 $${a * k}$：`],
                [`${a * k} \\div ${a} = ${k}`],
              ],
              [
                ["Multiply the other number", "另一项也乘"],
                [`Multiply $${b}$ by $${k}$ too:`, `$${b}$ 也乘 $${k}$：`],
                [`${b} \\times ${k} = ${b * k}`],
              ],
            ],
            [
              `$\\frac{${a * k}}{${b * k}}$ divided by $${k}$ top and bottom is $\\frac{${a}}{${b}}$.`,
              `$\\frac{${a * k}}{${b * k}}$ 分子分母同除以 $${k}$ 得 $\\frac{${a}}{${b}}$。`,
            ],
            [
              [b + (a * k - a), `That adds $${a * k - a}$ instead of multiplying by $${k}$.`, `这是加了 $${a * k - a}$，而不是乘 $${k}$。`],
              [a * k * b, `That multiplies $${b}$ by $${a * k}$, not by $${k}$.`, `这是 $${b}$ 乘 $${a * k}$，而不是乘 $${k}$。`],
              [k, "That is the multiplier, not the missing number.", "这是倍数，不是缺少的数。"],
            ],
          );
        },
        tableFigure(["4", "20"], [7, 35]),
      ),
    ],
  },
  [
    "A recipe uses $2$ cups of rice for every $3$ cups of water. Comparing the two amounts like this is a ratio, written $2 : 3$.",
    "一份食谱每用 $2$ 杯米就用 $3$ 杯水。这样比较两个量就是比，写作 $2 : 3$。",
  ],
  ["$6$ cups of rice need $9$ cups of water, and $6 : 9$ simplifies to $2 : 3$.", "$6$ 杯米要 $9$ 杯水，而 $6 : 9$ 化简后是 $2 : 3$。"],
  [
    "write ratios in the right order, simplify them, fill in equivalent ratios and turn a ratio into a fraction of the whole.",
    "按正确的顺序写比，化简比，求等值比中缺少的数，再把比化成部分占整体的分数。",
  ],
);

/** money writes an amount of money: whole amounts as integers, others with two decimal places. */
function money(v: Q): string {
  if (v.isInteger()) return dec(v);
  const [whole, frac = ""] = dec(v).split(".");
  return `${whole}.${frac.padEnd(2, "0")}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const unitRates: TopicDef = withIntro(
  {
    id: "unit-rates",
    title: t("Unit Rates", "单位率"),
    summary: t("Find a rate per one unit and use unit rates to compare.", "求每一个单位的量，用单位率进行比较。"),
    prerequisites: ["ratios", "decimal-arithmetic"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.6.RP.A.2", "CCSS.6.RP.A.3.B"],
    knowledgePoints: [
      lesson(
        "finding-unit-rates",
        ["Finding a unit rate", "求单位率"],
        [
          [
            "A **unit rate** is the amount for one unit of the second quantity: dollars per item, miles per hour. Divide the first quantity by the second. If $6$ notebooks cost $\\$15$, one costs $15 \\div 6 = \\$2.50$.",
            "**单位率**是第二个量取一个单位时第一个量的值：每件多少元、每小时多少千米。用第一个量除以第二个量。如果 $6$ 本笔记本 $15$ 元，每本是 $15 \\div 6 = 2.5$ 元。",
          ],
          ["$6 \\times 2.50 = 15$.", "$6 \\times 2.5 = 15$。"],
          [
            "Divide the cost by the number of items, not the other way round. $6 \\div 15 = 0.4$ is notebooks per dollar.",
            "要用总价除以数量，不能反过来。$6 \\div 15 = 0.4$ 是每元能买的本数。",
          ],
        ],
        (rng) => {
          const item = rng.pick(items);
          const n = rng.int(2, 12);
          const each = q(rng.int(2, 40) * 25, 100);
          const total = each.mul(Q.of(n));
          return valued(
            [
              `$${n}$ ${item.units.en} cost $\\$${money(total)}$. How many dollars does one ${item.unit} cost?`,
              `$${n}$ ${item.units["zh-CN"]}共 $${money(total)}$ 元，每${item.measure}多少元？`,
            ],
            each,
            [
              [["Set up the rate", "列出比率"], ["Dollars per item:", "每份多少元："], [`\\frac{${money(total)}}{${n}}`]],
              [["Divide", "相除"], ["Share the cost equally:", "把总价平均分："], [`${money(total)} \\div ${n} = ${money(each)}`]],
            ],
            [`$${n} \\times ${money(each)} = ${money(total)}$.`, `$${n} \\times ${money(each)} = ${money(total)}$。`],
            [
              [total.mul(Q.of(n)), `That multiplies by $${n}$ instead of dividing.`, `这是乘 $${n}$，而不是除以 $${n}$。`],
              [Q.of(n).div(total), "That divides the number by the cost, upside down.", "这是用数量除以总价，颠倒了。"],
              [total, "That is the cost of all of them.", "这是全部的总价。"],
            ],
            { form: "decimal" },
          );
        },
        equalTape(6, "2.50", "15", 1),
      ),
      lesson(
        "comparing-unit-rates",
        ["Comparing unit rates", "比较单位率"],
        [
          [
            "To find the better buy, compare the prices **per unit**. A $4$-pack for $\\$6$ costs $\\$1.50$ each; a $6$-pack for $\\$8.40$ costs $\\$1.40$ each, so the $6$-pack is the better buy even though it costs more in total.",
            "判断哪种更划算，要比较**每个单位**的价格。$4$ 个装 $6$ 元，每个 $1.5$ 元；$6$ 个装 $8.4$ 元，每个 $1.4$ 元。所以 $6$ 个装更划算，虽然它的总价更高。",
          ],
          [
            "$12$ items would cost $3 \\times 6 = 18$ in $4$-packs and $2 \\times 8.40 = 16.80$ in $6$-packs.",
            "买 $12$ 个：按 $4$ 个装要 $3 \\times 6 = 18$ 元，按 $6$ 个装要 $2 \\times 8.4 = 16.8$ 元。",
          ],
          ["A lower total price is not always the better buy. Compare the price of one.", "总价低不一定更划算。要比较单价。"],
        ],
        (rng) => {
          const item = rng.pick(items);
          let na = rng.int(2, 8);
          let nb = rng.int(2, 12);
          while (na === nb) nb = rng.int(2, 12);
          const ea = q(rng.int(4, 30) * 10, 100);
          let eb = q(rng.int(4, 30) * 10, 100);
          while (eb.eq(ea)) eb = q(rng.int(4, 30) * 10, 100);
          if (rng.bool(0.2)) eb = ea;
          if (rng.bool()) [na, nb] = [nb, na];
          const ta = ea.mul(Q.of(na));
          const tb = eb.mul(Q.of(nb));
          const order = ea.cmp(eb);
          const correct = order < 0 ? 0 : order > 0 ? 1 : 2;
          const options: [string, string][] = [
            [`$${na}$ for $\\$${money(ta)}$`, `$${na}$ 份 $${money(ta)}$ 元`],
            [`$${nb}$ for $\\$${money(tb)}$`, `$${nb}$ 份 $${money(tb)}$ 元`],
            ["They cost the same per unit", "每份的价格相同"],
          ];
          const reasons: [string, string][] = [
            [
              `One of the first costs $\\$${money(ea)}$, more than $\\$${money(eb)}$.`,
              `第一种每份 $${money(ea)}$ 元，比 $${money(eb)}$ 元贵。`,
            ],
            [
              `One of the second costs $\\$${money(eb)}$, more than $\\$${money(ea)}$.`,
              `第二种每份 $${money(eb)}$ 元，比 $${money(ea)}$ 元贵。`,
            ],
            [
              `The prices per unit are $\\$${money(ea)}$ and $\\$${money(eb)}$, not the same.`,
              `每份的价格是 $${money(ea)}$ 元和 $${money(eb)}$ 元，不相同。`,
            ],
          ];
          const wrong = [0, 1, 2]
            .filter((i) => i !== correct)
            .map((i) => [options[i] as [string, string], ...(reasons[i] as [string, string])] as const);
          return chosen(
            rng,
            [
              `A store sells ${item.what.en} in two packages: $${na}$ for $\\$${money(ta)}$, or $${nb}$ for $\\$${money(tb)}$. Which is the better buy?`,
              `商店有两种包装的${item.what["zh-CN"]}：$${na}$ 份 $${money(ta)}$ 元，或 $${nb}$ 份 $${money(tb)}$ 元。哪种更划算？`,
            ],
            options[correct] as [string, string],
            [
              ...wrong,
              [
                ["It cannot be determined, because the packages have different sizes", "无法判断，因为两种包装的份数不同"],
                "Different sizes can be compared by the price of one.",
                "份数不同也能比较，看每份的价格就行。",
              ],
            ],
            [
              [
                ["Price of one in the first", "第一种的单价"],
                ["Divide the cost by the number:", "总价除以份数："],
                [`${money(ta)} \\div ${na} = ${money(ea)}`],
              ],
              [["Price of one in the second", "第二种的单价"], ["Do the same:", "同样计算："], [`${money(tb)} \\div ${nb} = ${money(eb)}`]],
            ],
            correct === 2
              ? [
                  `$${na} \\times ${money(ea)} = ${money(ta)}$ and $${nb} \\times ${money(ea)} = ${money(tb)}$: one price fits both.`,
                  `$${na} \\times ${money(ea)} = ${money(ta)}$，$${nb} \\times ${money(ea)} = ${money(tb)}$：同一个单价对两种都成立。`,
                ]
              : [
                  `At $\\$${money(correct === 0 ? ea : eb)}$ each, $${correct === 0 ? nb : na}$ would cost $\\$${money((correct === 0 ? ea : eb).mul(Q.of(correct === 0 ? nb : na)))}$, less than $\\$${money(correct === 0 ? tb : ta)}$.`,
                  `按每份 $${money(correct === 0 ? ea : eb)}$ 元，$${correct === 0 ? nb : na}$ 份只要 $${money((correct === 0 ? ea : eb).mul(Q.of(correct === 0 ? nb : na)))}$ 元，比 $${money(correct === 0 ? tb : ta)}$ 元少。`,
                ],
          );
        },
        tableFigure(["6 / 4", "8.40 / 6"], [1.5, 1.4]),
      ),
    ],
  },
  [
    "A pack of $4$ juice boxes costs $\\$6$, and a pack of $6$ costs $\\$8.40$. The bigger pack costs more, but is it the better deal?",
    "$4$ 盒装的果汁 $6$ 元，$6$ 盒装的 $8.4$ 元。大包装更贵，但它更划算吗？",
  ],
  [
    "One box costs $6 \\div 4 = 1.50$ in the small pack and $8.40 \\div 6 = 1.40$ in the big one, so the big pack is cheaper per box.",
    "小包装每盒 $6 \\div 4 = 1.5$ 元，大包装每盒 $8.4 \\div 6 = 1.4$ 元，所以大包装每盒更便宜。",
  ],
  [
    "find the amount for one unit, use it to compare deals, and change the units of a rate.",
    "求一个单位的量，用它比较哪种更划算，并换算比率的单位。",
  ],
);
export const proportions: TopicDef = {
  id: "proportions",
  title: t("Proportions", "比例"),
  summary: t("Solve proportions by cross-multiplying, and use them in word problems.", "用交叉相乘解比例，并用于应用题。"),
  prerequisites: ["ratios", "one-step-equations-multiplication"],
  encompasses: [{ topic: "one-step-equations-multiplication", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.7.RP.A.2.C"],
  knowledgePoints: [
    {
      id: "solving-proportions",
      title: t("Solving proportions", "解比例"),
      explanation: t(
        "A **proportion** says that two ratios are equal. In $\\frac{a}{b} = \\frac{c}{d}$, the **cross products** are equal: $a \\cdot d = b \\cdot c$. To solve for an unknown, cross-multiply and divide:\n\n$$\\frac{x}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad 4x = 60 \\quad\\Rightarrow\\quad x = 15$$",
        "**比例**表示两个比相等。在 $\\frac{a}{b} = \\frac{c}{d}$ 中，**交叉相乘**的积相等：$a \\cdot d = b \\cdot c$。求未知数时，交叉相乘再相除：\n\n$$\\frac{x}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad 4x = 60 \\quad\\Rightarrow\\quad x = 15$$",
      ),
      keyPrerequisites: ["one-step-equations-multiplication"],
      generate(rng) {
        const b = rng.int(2, 15);
        const c = rng.int(1, 20);
        const d = rng.int(2, 15);
        if (b === d) return this.generate(rng);
        const x = q(b * c, d);
        const top = rng.bool();
        // x / b = c / d, or b / x = d / c: both give x = bc / d.
        const prompt = top ? `\\frac{x}{${b}} = \\frac{${c}}{${d}}` : `\\frac{${b}}{x} = \\frac{${d}}{${c}}`;
        return numberProblem({
          prompt: t(`Solve for $x$: $$${prompt}$$`, `解关于 $x$ 的比例：$$${prompt}$$`),
          answer: x,
          solveFor: "x",
          wrong: [q(c * d, b), q(b * d, c)],
          solution: t(
            `Cross-multiply:${steps(`${d}x = ${b} \\cdot ${c} = ${b * c}`, `x = \\frac{${b * c}}{${d}}${x.d === BigInt(d) ? "" : ` = ${num(x)}`}`)}`,
            `交叉相乘：${steps(`${d}x = ${b} \\cdot ${c} = ${b * c}`, `x = \\frac{${b * c}}{${d}}${x.d === BigInt(d) ? "" : ` = ${num(x)}`}`)}`,
          ),
        });
      },
    },
    {
      id: "proportion-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "When two quantities grow at the same rate, set up a proportion with the same units in the same positions. If $3$ pounds of apples cost $\\$4.50$, then for $8$ pounds:\n\n$$\\frac{3}{4.50} = \\frac{8}{x} \\quad\\Rightarrow\\quad 3x = 36 \\quad\\Rightarrow\\quad x = 12$$\n\nso $8$ pounds cost $\\$12$.",
        "两个量按相同的比率变化时，列比例，相同单位的量放在相同的位置。如果 $3$ 磅苹果 $4.5$ 元，那么 $8$ 磅：\n\n$$\\frac{3}{4.5} = \\frac{8}{x} \\quad\\Rightarrow\\quad 3x = 36 \\quad\\Rightarrow\\quad x = 12$$\n\n所以 $8$ 磅是 $12$ 元。",
      ),
      generate(rng) {
        const item = rng.pick(items);
        const n1 = rng.int(2, 9);
        let n2 = rng.int(2, 20);
        while (n2 === n1) n2 = rng.int(2, 20);
        const each = q(rng.int(2, 24) * 25, 100);
        const c1 = each.mul(Q.of(n1));
        const c2 = each.mul(Q.of(n2));
        return numberProblem({
          prompt: t(
            `$${n1}$ ${item.units.en} cost $\\$${money(c1)}$. At the same price, how many dollars do $${n2}$ ${item.units.en} cost?`,
            `$${n1}$ ${item.units["zh-CN"]}共 $${money(c1)}$ 元。按同样的价格，$${n2}$ ${item.units["zh-CN"]}多少元？`,
          ),
          answer: c2,
          form: "decimal",
          wrong: [c1.mul(Q.of(n2)), c1.div(Q.of(n2)).mul(Q.of(n1))],
          solution: t(
            `${steps(`\\frac{${n1}}{${money(c1)}} = \\frac{${n2}}{x}`, `${n1}x = ${money(c1)} \\cdot ${n2} = ${money(c1.mul(Q.of(n2)))}`, `x = ${money(c2)}`)}So $${n2}$ ${item.units.en} cost $\\$${money(c2)}$.`,
            `${steps(`\\frac{${n1}}{${money(c1)}} = \\frac{${n2}}{x}`, `${n1}x = ${money(c1)} \\cdot ${n2} = ${money(c1.mul(Q.of(n2)))}`, `x = ${money(c2)}`)}所以 $${n2}$ ${item.units["zh-CN"]}是 $${money(c2)}$ 元。`,
          ),
        });
      },
    },
  ],
};

/** ratioTopics are the topics on ratios, rates and proportions. */
export const ratioTopics: readonly TopicDef[] = [ratios, unitRates, proportions];
