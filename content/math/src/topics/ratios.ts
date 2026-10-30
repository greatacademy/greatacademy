import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, gcd, num, Q, q } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

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

export const ratios: TopicDef = {
  id: "ratios",
  title: t("Ratios", "比"),
  summary: t("Write ratios in lowest terms and find missing values of equivalent ratios.", "把比化成最简整数比，求等值比中缺少的数。"),
  prerequisites: ["equivalent-fractions"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.6.RP.A.1", "CCSS.6.RP.A.3.A"],
  knowledgePoints: [
    {
      id: "writing-ratios",
      title: t("Writing ratios", "写出比"),
      explanation: t(
        "A **ratio** compares two quantities. If a bag holds $6$ red and $9$ blue marbles, the ratio of red to blue is $6 : 9$, which can also be written as the fraction $\\frac{6}{9}$. The order matters: blue to red is $9 : 6$.\n\nLike a fraction, a ratio can be simplified by dividing both numbers by a common factor: $6 : 9 = 2 : 3$, or $\\frac{2}{3}$.",
        "**比**用来比较两个量。如果袋子里有 $6$ 颗红色弹珠和 $9$ 颗蓝色弹珠，红色与蓝色的比是 $6 : 9$，也可以写成分数 $\\frac{6}{9}$。顺序很重要：蓝色与红色的比是 $9 : 6$。\n\n和分数一样，比的两项可以同时除以公因数来化简：$6 : 9 = 2 : 3$，即 $\\frac{2}{3}$。",
      ),
      generate(rng) {
        const [a, b] = ratioPair(rng);
        const k = rng.int(2, 9);
        const p = rng.pick(pairs);
        const r = q(a, b);
        return numberProblem({
          prompt: t(
            `${capitalize(p.where.en)} has $${a * k}$ ${p.a.en} and $${b * k}$ ${p.b.en}. Write the ratio of ${p.a.en} to ${p.b.en} as a fraction in lowest terms.`,
            `${p.where["zh-CN"]}有 $${a * k}$ ${p.measure}${p.a["zh-CN"]}和 $${b * k}$ ${p.measure}${p.b["zh-CN"]}。把${p.a["zh-CN"]}与${p.b["zh-CN"]}的比写成最简分数。`,
          ),
          answer: r,
          form: "fraction",
          wrong: [q(b, a), q(a, a + b)],
          solution: t(
            `The ratio is $${a * k} : ${b * k}$. Divide both by $${k}$:${steps(`\\frac{${a * k}}{${b * k}} = ${num(r)}`)}`,
            `比是 $${a * k} : ${b * k}$，两项同时除以 $${k}$：${steps(`\\frac{${a * k}}{${b * k}} = ${num(r)}`)}`,
          ),
        });
      },
    },
    {
      id: "equivalent-ratios",
      title: t("Equivalent ratios", "等值比"),
      explanation: t(
        "Multiplying or dividing both terms of a ratio by the same number gives an **equivalent ratio**. To fill in $4 : 7 = 20 : ?$, notice that $4$ was multiplied by $5$ to make $20$, so $7$ is multiplied by $5$ too: $4 : 7 = 20 : 35$.",
        "比的两项同时乘或除以同一个数，得到**等值比**。求 $4 : 7 = 20 : ?$ 时，注意 $4$ 乘 $5$ 得 $20$，所以 $7$ 也乘 $5$：$4 : 7 = 20 : 35$。",
      ),
      generate(rng) {
        const [a, b] = ratioPair(rng);
        const k = rng.int(2, 12);
        return numberProblem({
          prompt: t(`Find the missing number: $$${a} : ${b} = ${a * k} : \\, ?$$`, `求缺少的数：$$${a} : ${b} = ${a * k} : \\, ?$$`),
          answer: b * k,
          form: "integer",
          wrong: [b + (a * k - a), a * k * b],
          solution: t(
            `$${a} \\cdot ${k} = ${a * k}$, so multiply $${b}$ by $${k}$ as well: $${b} \\cdot ${k} = ${b * k}$.`,
            `$${a} \\cdot ${k} = ${a * k}$，所以 $${b}$ 也乘 $${k}$：$${b} \\cdot ${k} = ${b * k}$。`,
          ),
        });
      },
    },
  ],
};

/** money writes an amount of money: whole amounts as integers, others with two decimal places. */
function money(v: Q): string {
  if (v.isInteger()) return dec(v);
  const [whole, frac = ""] = dec(v).split(".");
  return `${whole}.${frac.padEnd(2, "0")}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const unitRates: TopicDef = {
  id: "unit-rates",
  title: t("Unit Rates", "单位率"),
  summary: t("Find a rate per one unit and use unit rates to compare.", "求每一个单位的量，用单位率进行比较。"),
  prerequisites: ["ratios", "decimal-arithmetic"],
  encompasses: [
    { topic: "ratios", weight: 0.4 },
    { topic: "decimal-arithmetic", weight: 0.2 },
  ],
  xp: 10,
  standards: ["CCSS.6.RP.A.2", "CCSS.6.RP.A.3.B"],
  knowledgePoints: [
    {
      id: "finding-unit-rates",
      title: t("Finding a unit rate", "求单位率"),
      explanation: t(
        "A **unit rate** is a rate for one unit of the second quantity: dollars per item, miles per hour. Divide the first quantity by the second. If $6$ notebooks cost $\\$15$, one costs\n\n$$\\frac{\\$15}{6} = \\$2.50 \\text{ per notebook}$$",
        "**单位率**是第二个量取一个单位时第一个量的值：每件多少元、每小时多少千米。用第一个量除以第二个量。如果 $6$ 本笔记本 $15$ 元，每本是\n\n$$\\frac{15}{6} = 2.5 \\text{ 元}$$",
      ),
      generate(rng) {
        const item = rng.pick(items);
        const n = rng.int(2, 12);
        const each = q(rng.int(2, 40) * 25, 100);
        const total = each.mul(Q.of(n));
        return numberProblem({
          prompt: t(
            `$${n}$ ${item.units.en} cost $\\$${money(total)}$. How many dollars does one ${item.unit} cost?`,
            `$${n}$ ${item.units["zh-CN"]}共 $${money(total)}$ 元，每${item.measure}多少元？`,
          ),
          answer: each,
          form: "decimal",
          wrong: [total.mul(Q.of(n)), Q.of(n).div(total)],
          solution: t(
            `Divide the cost by the number of ${item.units.en}: $\\frac{${money(total)}}{${n}} = ${money(each)}$, so one costs $\\$${money(each)}$.`,
            `用总价除以数量：$\\frac{${money(total)}}{${n}} = ${money(each)}$，所以每${item.measure} $${money(each)}$ 元。`,
          ),
        });
      },
    },
    {
      id: "comparing-unit-rates",
      title: t("Comparing unit rates", "比较单位率"),
      explanation: t(
        "To decide which of two packages is the better buy, compare the prices **per unit**. A $4$-pack for $\\$6$ costs $\\$1.50$ each; a $6$-pack for $\\$8.40$ costs $\\$1.40$ each, so the $6$-pack is the better buy even though its total price is higher.",
        "判断两种包装哪种更划算，要比较**每个单位**的价格。$4$ 个装 $6$ 元，每个 $1.5$ 元；$6$ 个装 $8.4$ 元，每个 $1.4$ 元。所以 $6$ 个装更划算，虽然它的总价更高。",
      ),
      generate(rng) {
        const item = rng.pick(items);
        let na = rng.int(2, 8);
        let nb = rng.int(2, 12);
        while (na === nb) nb = rng.int(2, 12);
        const ea = q(rng.int(4, 30) * 10, 100);
        let eb = q(rng.int(4, 30) * 10, 100);
        while (eb.eq(ea)) eb = q(rng.int(4, 30) * 10, 100);
        if (rng.bool()) [na, nb] = [nb, na];
        const ta = ea.mul(Q.of(na));
        const tb = eb.mul(Q.of(nb));
        const correct = ea.cmp(eb) < 0 ? 0 : 1;
        return choiceProblem({
          prompt: t(
            `A store sells ${item.what.en} in two packages: $${na}$ for $\\$${money(ta)}$, or $${nb}$ for $\\$${money(tb)}$. Which is the better buy?`,
            `商店有两种包装的${item.what["zh-CN"]}：$${na}$ 份 $${money(ta)}$ 元，或 $${nb}$ 份 $${money(tb)}$ 元。哪种更划算？`,
          ),
          options: [
            t(`$${na}$ for $\\$${money(ta)}$`, `$${na}$ 份 $${money(ta)}$ 元`),
            t(`$${nb}$ for $\\$${money(tb)}$`, `$${nb}$ 份 $${money(tb)}$ 元`),
          ],
          correct,
          solution: t(
            `Per unit: $\\frac{${money(ta)}}{${na}} = ${money(ea)}$ and $\\frac{${money(tb)}}{${nb}} = ${money(eb)}$. The ${correct === 0 ? "first" : "second"} costs less per unit.`,
            `每份的价格：$\\frac{${money(ta)}}{${na}} = ${money(ea)}$，$\\frac{${money(tb)}}{${nb}} = ${money(eb)}$。第${correct === 0 ? "一" : "二"}种每份更便宜。`,
          ),
        });
      },
    },
  ],
};

export const proportions: TopicDef = {
  id: "proportions",
  title: t("Proportions", "比例"),
  summary: t("Solve proportions by cross-multiplying, and use them in word problems.", "用交叉相乘解比例，并用于应用题。"),
  prerequisites: ["ratios", "one-step-equations-multiplication"],
  encompasses: [
    { topic: "ratios", weight: 0.5 },
    { topic: "one-step-equations-multiplication", weight: 0.4 },
  ],
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
