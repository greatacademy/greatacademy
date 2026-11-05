import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { mc, spec, spr } from "../exam.ts";

// SAT Math Prep, Problem-Solving and Data Analysis: percentages, percentage change, unit conversions, ratios and rates.

const items = [
  ["jacket", "夹克"],
  ["bicycle", "自行车"],
  ["printer", "打印机"],
  ["backpack", "背包"],
] as const;

/** satExamData2 are the exam-style questions on percentages, percentage change, unit conversions, ratios and rates. */
export const satExamData2: ExamSpec[] = [
  spec(
    "Finding Parts of Numbers From Percentages",
    "由百分比求数的一部分",
    ["finding-part-of-a-number-given-a-whole-and-a-percentage"],
    (rng, hard) => {
      const [p, n] = [rng.int(1, 19) * 5, rng.int(2, 40) * 20];
      const part = (p * n) / 100;
      if (!hard)
        return mc(
          rng,
          t(`What is $${p}\\%$ of $${n}$?`, `$${n}$ 的 $${p}\\%$ 是多少？`),
          part,
          [n - part + 1, p + n, part + 10],
          t(`$\\frac{${p}}{100}(${n}) = ${part}$.`, `$\\frac{${p}}{100}(${n}) = ${part}$。`),
        );
      return spr(
        t(
          `In a school of $${n}$ students, $${p}\\%$ walk to school. How many students do not walk to school?`,
          `一所有 $${n}$ 名学生的学校中，$${p}\\%$ 的学生步行上学。有多少学生不步行上学？`,
        ),
        n - part,
        [part, n, 100 - p],
        t(
          `$${part}$ students walk, leaving $${n} - ${part} = ${n - part}$.`,
          `$${part}$ 名学生步行，剩下 $${n} - ${part} = ${n - part}$ 名。`,
        ),
      );
    },
  ),
  spec("Expressing Ratios of Numbers as Percentages", "把数的比表示为百分比", ["finding-a-percentage-given-two-numbers"], (rng, hard) => {
    const [b, k] = [rng.pick([20, 40, 60, 80, 100, 200, 300, 400]), rng.int(1, 19)];
    const a = (b * k * 5) / 100;
    if (!hard)
      return mc(
        rng,
        t(`$${a}$ is what percent of $${b}$?`, `$${a}$ 是 $${b}$ 的百分之几？`),
        `${k * 5}\\%`,
        [`${100 - k * 5}\\%`, `${k * 5 + 10}\\%`, `${k * 5 + 5}\\%`, `${Math.max(1, k * 5 - 3)}\\%`],
        t(`$\\frac{${a}}{${b}} \\times 100 = ${k * 5}$.`, `$\\frac{${a}}{${b}} \\times 100 = ${k * 5}$。`),
      );
    return spr(
      t(
        `A team won $${a}$ of its $${b}$ games and lost the rest. What percent of its games did it lose? Give the number without the percent sign.`,
        `一支球队 $${b}$ 场比赛赢了 $${a}$ 场，其余都输了。它输了百分之几的比赛？（只填数字，不写百分号。）`,
      ),
      100 - k * 5,
      [k * 5, b - a, a],
      t(
        `It lost $${b - a}$ of $${b}$ games, which is $${100 - k * 5}\\%$.`,
        `它输了 $${b}$ 场中的 $${b - a}$ 场，即 $${100 - k * 5}\\%$。`,
      ),
    );
  }),
  spec("Finding Totals From Percentages", "由百分比求总数", ["finding-a-total-given-a-part-and-a-percentage"], (rng, hard) => {
    const [p, n] = [rng.int(1, 19) * 5, rng.int(2, 40) * 20];
    const part = (p * n) / 100;
    if (!hard)
      return mc(
        rng,
        t(`$${part}$ is $${p}\\%$ of what number?`, `$${part}$ 是哪个数的 $${p}\\%$？`),
        n,
        [(part * p) / 100 === n ? n + 1 : Q.of(part * p, 100), part + p, n + 20],
        t(`$\\frac{${part}}{${p}/100} = ${n}$.`, `$\\frac{${part}}{${p}/100} = ${n}$。`),
      );
    return spr(
      t(
        `In a survey, $${part}$ people, or $${p}\\%$ of those asked, said yes. How many people did not say yes?`,
        `调查中有 $${part}$ 人（占被调查者的 $${p}\\%$）回答“是”。有多少人没有回答“是”？`,
      ),
      n - part,
      [n, part, 100 - p],
      t(`The total is $${n}$, so $${n} - ${part} = ${n - part}$ did not.`, `总数是 $${n}$，所以 $${n} - ${part} = ${n - part}$ 人没有。`),
    );
  }),
  spec("Applying Percentages in Succession", "连续应用百分比", ["finding-part-of-a-number-given-a-whole-and-a-percentage"], (rng, hard) => {
    const [p, q, n] = [rng.int(1, 9) * 10, rng.int(1, 9) * 10, rng.int(1, 12) * 100];
    const a = (p * n) / 100;
    const b = (q * a) / 100;
    if (!hard)
      return mc(
        rng,
        t(`What is $${q}\\%$ of $${p}\\%$ of $${n}$?`, `$${n}$ 的 $${p}\\%$ 的 $${q}\\%$ 是多少？`),
        Q.of(p * q * n, 10000),
        [Q.of((p + q) * n, 100), a, Q.of(q * n, 100).add(Q.of(1))],
        t(
          `$${p}\\%$ of $${n}$ is $${a}$, and $${q}\\%$ of that is $${Q.of(p * q * n, 10000).toLatex()}$.`,
          `$${n}$ 的 $${p}\\%$ 是 $${a}$，再取 $${q}\\%$ 得 $${Q.of(p * q * n, 10000).toLatex()}$。`,
        ),
      );
    return spr(
      t(
        `Of $${n}$ applicants, $${p}\\%$ pass a first test, and $${q}\\%$ of those pass a second test. How many pass the first test but not the second? Give an exact value.`,
        `$${n}$ 名申请者中，$${p}\\%$ 通过第一次测试，其中 $${q}\\%$ 通过第二次测试。有多少人通过第一次但未通过第二次？（给出确切值。）`,
      ),
      Q.of(p * (100 - q) * n, 10000),
      [Q.of(p * q * n, 10000), a, n - a],
      t(
        `$${a}$ pass the first test, and $${100 - q}\\%$ of them fail the second: $${Q.of(p * (100 - q) * n, 10000).toLatex()}$. (That is $${a} - ${Q.of(Math.round(b * 100), 100).toLatex()}$.)`,
        `$${a}$ 人通过第一次，其中 $${100 - q}\\%$ 未通过第二次：$${Q.of(p * (100 - q) * n, 10000).toLatex()}$。（即 $${a} - ${Q.of(Math.round(b * 100), 100).toLatex()}$。）`,
      ),
    );
  }),
  spec("Expressing Percentage Change Using Decimals", "用小数表示百分比变化", ["percent-change"], (rng, hard) => {
    const p = rng.int(1, 45) * 2;
    const dec = (100 + p) / 100;
    const down = (100 - p) / 100;
    const x = rng.pick(["x", "p", "c", "v"]);
    if (!hard)
      return mc(
        rng,
        t(`A value $${x}$ increases by $${p}\\%$. Which expression gives the new value?`, `某值 $${x}$ 增加 $${p}\\%$。哪个式子给出新值？`),
        `${dec.toFixed(2)}${x}`,
        [`${(p / 100).toFixed(2)}${x}`, `${(p + 1).toFixed(0)}${x}`, `${down.toFixed(2)}${x}`, `${x} + ${p}`],
        t(`Multiply by $1 + ${(p / 100).toFixed(2)} = ${dec.toFixed(2)}$.`, `乘 $1 + ${(p / 100).toFixed(2)} = ${dec.toFixed(2)}$。`),
      );
    return mc(
      rng,
      t(`A value $${x}$ decreases by $${p}\\%$. Which expression gives the new value?`, `某值 $${x}$ 减少 $${p}\\%$。哪个式子给出新值？`),
      `${down.toFixed(2)}${x}`,
      [`${(p / 100).toFixed(2)}${x}`, `${dec.toFixed(2)}${x}`, `${x} - ${p}`, `-${(p / 100).toFixed(2)}${x}`],
      t(`Multiply by $1 - ${(p / 100).toFixed(2)} = ${down.toFixed(2)}$.`, `乘 $1 - ${(p / 100).toFixed(2)} = ${down.toFixed(2)}$。`),
    );
  }),
  spec("Calculating Percentage Change", "计算百分比变化", ["percent-change"], (rng, hard) => {
    const [a, k] = [rng.pick([20, 40, 60, 80, 100, 120, 200, 300, 400]), rng.int(1, 16)];
    const d = (a * k * 5) / 100;
    if (!hard)
      return spr(
        t(
          `The price of an item rises from $\\$${a}$ to $\\$${a + d}$. What is the percent increase? Give the number without the percent sign.`,
          `某商品价格从 $\\$${a}$ 涨到 $\\$${a + d}$。上涨了百分之几？（只填数字，不写百分号。）`,
        ),
        k * 5,
        [d, Q.of(d * 100, a + d), a + d],
        t(
          `The change is $${d}$, and $\\frac{${d}}{${a}} \\times 100 = ${k * 5}$.`,
          `变化量为 $${d}$，$\\frac{${d}}{${a}} \\times 100 = ${k * 5}$。`,
        ),
      );
    const b = a + d;
    return spr(
      t(
        `A town's population falls from $${b}$ to $${a}$. What is the percent decrease? Give the number without the percent sign.`,
        `某镇人口从 $${b}$ 降到 $${a}$。下降了百分之几？（只填数字，不写百分号。）`,
      ),
      Q.of(d * 100, b),
      [k * 5, d, Q.of(a * 100, b)],
      t(`Divide the change by the original value: $\\frac{${d}}{${b}} \\times 100$.`, `变化量除以原值：$\\frac{${d}}{${b}} \\times 100$。`),
    );
  }),
  spec("Applying Percentage Change", "应用百分比变化", ["applying-percentage-increases"], (rng, hard) => {
    const [item, itemZh] = rng.pick(items);
    const [p, a] = [rng.int(1, 9) * 10, rng.int(2, 30) * 10];
    if (!hard)
      return mc(
        rng,
        t(
          `A ${item} costs $\\$${a}$ and is on sale for $${p}\\%$ off. What is the sale price, in dollars?`,
          `一件${itemZh}售价 $\\$${a}$，打折 $${p}\\%$。折后价是多少美元？`,
        ),
        (a * (100 - p)) / 100,
        [(a * p) / 100 === (a * (100 - p)) / 100 ? a : (a * p) / 100, a - p, a + (a * p) / 100],
        t(`Multiply by $1 - ${p / 100}$, which keeps $${100 - p}\\%$ of the price.`, `乘 $1 - ${p / 100}$，即保留价格的 $${100 - p}\\%$。`),
      );
    const q = rng.int(1, 5) * 2;
    return spr(
      t(
        `A ${item} costs $\\$${a}$. It is marked up by $${p}\\%$, and then a sales tax of $${q}\\%$ is added to the marked-up price. What is the final price, in dollars?`,
        `一件${itemZh}成本 $\\$${a}$。先加价 $${p}\\%$，再按加价后的价格加 $${q}\\%$ 的销售税。最终价格是多少美元？`,
      ),
      Q.of(a * (100 + p) * (100 + q), 10000),
      [Q.of(a * (100 + p + q), 100), Q.of(a * (100 + p), 100), a + p + q],
      t(
        `$${a}\\left(1 + ${p / 100}\\right)\\left(1 + ${q / 100}\\right)$.`,
        `$${a}\\left(1 + ${p / 100}\\right)\\left(1 + ${q / 100}\\right)$。`,
      ),
    );
  }),
  spec(
    "Finding Original Values From Percentage Change",
    "由百分比变化求原值",
    ["finding-original-values-from-percentage-increases"],
    (rng, hard) => {
      const [item, itemZh] = rng.pick(items);
      const [p, a] = [rng.pick([10, 20, 25, 50]), rng.int(2, 40) * 20];
      const up = (a * (100 + p)) / 100;
      const q = rng.pick([10, 20, 25, 40, 50]);
      const down = (a * (100 - q)) / 100;
      if (!hard)
        return mc(
          rng,
          t(
            `After a $${p}\\%$ increase, a value is $${up}$. What was the original value?`,
            `增加 $${p}\\%$ 后某值为 $${up}$。原值是多少？`,
          ),
          a,
          [up - p, Q.of(up * (100 - p), 100), up + p],
          t(
            `Divide by $${(100 + p) / 100}$: $\\frac{${up}}{${(100 + p) / 100}} = ${a}$.`,
            `除以 $${(100 + p) / 100}$：$\\frac{${up}}{${(100 + p) / 100}} = ${a}$。`,
          ),
        );
      return spr(
        t(
          `The sale price of a ${item} is $\\$${down}$ after a $${q}\\%$ discount. What was the original price, in dollars?`,
          `一件${itemZh}打折 $${q}\\%$ 后售价 $\\$${down}$。原价是多少美元？`,
        ),
        a,
        [Q.of(down * (100 + q), 100), down + q, Q.of(down * q, 100)],
        t(
          `The sale price is $${100 - q}\\%$ of the original, so divide by $${(100 - q) / 100}$.`,
          `折后价是原价的 $${100 - q}\\%$，所以除以 $${(100 - q) / 100}$。`,
        ),
      );
    },
  ),
  spec("Applying Successive Percentage Changes", "应用连续百分比变化", ["percent-applications-interest-and-discounts"], (rng, hard) => {
    const [p, q, a] = [rng.int(1, 8) * 10, rng.int(1, 8) * 10, rng.int(1, 20) * 100];
    if (!hard)
      return mc(
        rng,
        t(
          `A value of $${a}$ is increased by $${p}\\%$, and the result is decreased by $${q}\\%$. What is the final value?`,
          `值 $${a}$ 先增加 $${p}\\%$，结果再减少 $${q}\\%$。最终值是多少？`,
        ),
        Q.of(a * (100 + p) * (100 - q), 10000),
        [Q.of(a * (100 + p - q), 100), Q.of(a * (100 + p), 100), Q.of(a * (100 - p) * (100 + q), 10000), a],
        t(
          `$${a}\\left(1 + ${p / 100}\\right)\\left(1 - ${q / 100}\\right)$.`,
          `$${a}\\left(1 + ${p / 100}\\right)\\left(1 - ${q / 100}\\right)$。`,
        ),
      );
    return spr(
      t(
        `A price of $\\$${a}$ is increased by $${p}\\%$, and then the new price is decreased by $${p}\\%$. What is the final price, in dollars?`,
        `价格 $\\$${a}$ 先涨 $${p}\\%$，新价格再降 $${p}\\%$。最终价格是多少美元？`,
      ),
      Q.of(a * (10000 - p * p), 10000),
      [a, Q.of(a * (100 - p), 100), Q.of(a * (100 + p), 100)],
      t(
        `$${a}(1 + ${p / 100})(1 - ${p / 100})$, and the two changes do not cancel.`,
        `$${a}(1 + ${p / 100})(1 - ${p / 100})$，两次变化不会抵消。`,
      ),
    );
  }),
  spec("Multistep Percentage Problems", "多步百分比问题", ["percent-applications-interest-and-discounts"], (rng, hard) => {
    const [n, p, q] = [rng.int(2, 15) * 100, rng.int(1, 9) * 10, rng.int(1, 9) * 10];
    const A = (n * p) / 100;
    if (!hard)
      return spr(
        t(
          `A store had $${n}$ items. It sold $${p}\\%$ of them in the morning and $${q}\\%$ of the remaining items in the afternoon. How many items were left? Give an exact value.`,
          `商店有 $${n}$ 件商品。上午卖出 $${p}\\%$，下午卖出剩余商品的 $${q}\\%$。还剩多少件？（给出确切值。）`,
        ),
        Q.of((n - A) * (100 - q), 100),
        [Q.of(n * (100 - p - q), 100), n - A, Q.of((n - A) * q, 100)],
        t(
          `$${n - A}$ remain after the morning, and $${100 - q}\\%$ of those remain after the afternoon.`,
          `上午后剩 $${n - A}$ 件，下午后剩其中的 $${100 - q}\\%$。`,
        ),
      );
    return spr(
      t(
        `A company's revenue was $\\$${n}$ thousand. Costs were $${p}\\%$ of revenue, and $${q}\\%$ of what was left was paid in tax. What amount was left after costs and tax, in thousands of dollars? Give an exact value.`,
        `某公司收入为 $${n}$ 千美元。成本占收入的 $${p}\\%$，余额的 $${q}\\%$ 用于缴税。扣除成本和税后还剩多少千美元？（给出确切值。）`,
      ),
      Q.of((n - A) * (100 - q), 100),
      [Q.of((n - A) * q, 100), n - A, Q.of(n * (100 - q), 100)],
      t(
        `After costs, $${n - A}$ remains, and keeping $${100 - q}\\%$ of it gives the answer.`,
        `扣除成本后剩 $${n - A}$，保留其 $${100 - q}\\%$ 即为答案。`,
      ),
    );
  }),
  spec(
    "Unit Conversions to Smaller Units of Length",
    "换算成更小的长度单位",
    ["unit-conversions-using-base-units-of-length"],
    (rng, hard) => {
      const [a, b] = [rng.int(2, 40), rng.int(2, 11)];
      if (!hard)
        return mc(
          rng,
          t(`How many inches are in $${a}$ feet? ($1$ foot $= 12$ inches)`, `$${a}$ 英尺是多少英寸？（$1$ 英尺 $= 12$ 英寸）`),
          12 * a,
          [a + 12, Q.of(a, 12), 3 * a],
          t(`$${a}(12) = ${12 * a}$.`, `$${a}(12) = ${12 * a}$。`),
        );
      return spr(
        t(
          `A rope is $${a}$ meters and $${b * 5}$ centimeters long. What is its length in centimeters? ($1$ meter $= 100$ centimeters)`,
          `一根绳子长 $${a}$ 米 $${b * 5}$ 厘米。它长多少厘米？（$1$ 米 $= 100$ 厘米）`,
        ),
        100 * a + b * 5,
        [10 * a + b * 5, a + b * 5, 1000 * a + b * 5],
        t(`$${a}(100) + ${b * 5} = ${100 * a + b * 5}$.`, `$${a}(100) + ${b * 5} = ${100 * a + b * 5}$。`),
      );
    },
  ),
  spec(
    "Unit Conversions to Larger Units of Length",
    "换算成更大的长度单位",
    ["converting-metric-units-of-length-to-larger-units"],
    (rng, hard) => {
      const [a, b] = [rng.int(2, 60), rng.int(2, 9)];
      if (!hard)
        return mc(
          rng,
          t(
            `How many meters are in $${a * 100}$ centimeters? ($1$ meter $= 100$ centimeters)`,
            `$${a * 100}$ 厘米是多少米？（$1$ 米 $= 100$ 厘米）`,
          ),
          a,
          [a * 10, a * 1000, a * 10000],
          t(`$\\frac{${a * 100}}{100} = ${a}$.`, `$\\frac{${a * 100}}{100} = ${a}$。`),
        );
      return spr(
        t(
          `A trail is $${a * 1000 + b * 100}$ meters long. What is its length in kilometers? ($1$ kilometer $= 1{,}000$ meters)`,
          `一条小路长 $${a * 1000 + b * 100}$ 米。它长多少千米？（$1$ 千米 $= 1{,}000$ 米）`,
        ),
        Q.of(a * 10 + b, 10),
        [a * 10 + b, a * 100 + b * 10, Q.of(a * 10 + b, 100)],
        t(`Divide by $1{,}000$.`, `除以 $1{,}000$。`),
      );
    },
  ),
  spec(
    "Unit Conversions Between Units of Mass and Volume",
    "质量和体积单位换算",
    ["unit-conversions-using-base-units-of-mass"],
    (rng, hard) => {
      const [a, n] = [rng.int(2, 60), rng.int(2, 40)];
      if (!hard)
        return mc(
          rng,
          t(`How many grams are in $${a}$ kilograms? ($1$ kilogram $= 1{,}000$ grams)`, `$${a}$ 千克是多少克？（$1$ 千克 $= 1{,}000$ 克）`),
          a * 1000,
          [a * 100, a * 10, a * 10000],
          t(`$${a}(1{,}000) = ${a * 1000}$.`, `$${a}(1{,}000) = ${a * 1000}$。`),
        );
      const size = [100, 125, 200, 250, 500][n % 5]!;
      return spr(
        t(
          `A dispenser holds $${a}$ liters of juice. How many servings of $${size}$ milliliters does it fill? ($1$ liter $= 1{,}000$ milliliters)`,
          `一个饮料桶装有 $${a}$ 升果汁。它能装满多少份 $${size}$ 毫升？（$1$ 升 $= 1{,}000$ 毫升）`,
        ),
        (a * 1000) / size,
        [Q.of(a * 100, size), a * 1000, Q.of(a, size)],
        t(
          `$${a}$ liters is $${a * 1000}$ milliliters, and $\\frac{${a * 1000}}{${size}} = ${(a * 1000) / size}$ servings.`,
          `$${a}$ 升是 $${a * 1000}$ 毫升，$\\frac{${a * 1000}}{${size}} = ${(a * 1000) / size}$ 份。`,
        ),
      );
    },
  ),
  spec("Two-Step Unit Conversions", "两步单位换算", ["two-step-unit-conversions"], (rng, hard) => {
    const [a, b] = [rng.int(2, 40), rng.int(2, 12)];
    if (!hard)
      return mc(
        rng,
        t(`How many seconds are in $${a}$ hours?`, `$${a}$ 小时是多少秒？`),
        a * 3600,
        [a * 60, a * 600, a * 36000],
        t(`$${a}(60)(60) = ${a * 3600}$.`, `$${a}(60)(60) = ${a * 3600}$。`),
      );
    return spr(
      t(
        `A garden hose fills a tank at $${b}$ gallons per minute. How many quarts does it deliver in $${a}$ minutes? ($1$ gallon $= 4$ quarts)`,
        `水管以每分钟 $${b}$ 加仑的速度向水箱注水。$${a}$ 分钟输送多少夸脱？（$1$ 加仑 $= 4$ 夸脱）`,
      ),
      4 * a * b,
      [a * b, 4 * a + b, 4 * b],
      t(`$${b}(${a})(4) = ${4 * a * b}$.`, `$${b}(${a})(4) = ${4 * a * b}$。`),
    );
  }),
  spec("Unit Conversions Between Mixed Units", "混合单位换算", ["mixed-units"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 20), rng.int(1, 11), rng.int(1, 59)];
    if (!hard)
      return mc(
        rng,
        t(`What is $${a}$ feet $${b}$ inches in inches?`, `$${a}$ 英尺 $${b}$ 英寸是多少英寸？`),
        12 * a + b,
        [a + b, 10 * a + b, 12 * (a + b)],
        t(`$${a}(12) + ${b} = ${12 * a + b}$.`, `$${a}(12) + ${b} = ${12 * a + b}$。`),
      );
    return spr(
      t(
        `A road trip lasts $${a}$ hours $${c}$ minutes. What is its length in minutes?`,
        `一次公路旅行历时 $${a}$ 小时 $${c}$ 分钟。它是多少分钟？`,
      ),
      60 * a + c,
      [100 * a + c, a + c, 60 * (a + c)],
      t(`$${a}(60) + ${c} = ${60 * a + c}$.`, `$${a}(60) + ${c} = ${60 * a + c}$。`),
    );
  }),
  spec(
    "Converting Between Mixed Units Containing Squares",
    "换算含平方的混合单位",
    ["converting-between-mixed-units-containing-squares"],
    (rng, hard) => {
      const [a, b] = [rng.int(2, 40), rng.int(2, 30)];
      if (!hard)
        return mc(
          rng,
          t(
            `How many square inches are in $${a}$ square feet? ($1$ foot $= 12$ inches)`,
            `$${a}$ 平方英尺是多少平方英寸？（$1$ 英尺 $= 12$ 英寸）`,
          ),
          144 * a,
          [12 * a, 24 * a, a + 144],
          t(`A square foot is $12^2 = 144$ square inches, so multiply by $144$.`, `$1$ 平方英尺是 $12^2 = 144$ 平方英寸，所以乘 $144$。`),
        );
      return spr(
        t(
          `A floor has an area of $${b}$ square yards. What is its area in square feet? ($1$ yard $= 3$ feet)`,
          `一块地面的面积是 $${b}$ 平方码。它是多少平方英尺？（$1$ 码 $= 3$ 英尺）`,
        ),
        9 * b,
        [3 * b, 6 * b, b + 9],
        t(`A square yard is $3^2 = 9$ square feet, so multiply by $9$.`, `$1$ 平方码是 $3^2 = 9$ 平方英尺，所以乘 $9$。`),
      );
    },
  ),
  spec("Ratios", "比", ["ratios"], (rng, hard) => {
    const [a, b, k] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 15)];
    if (!hard)
      return mc(
        rng,
        t(
          `A class has $${a * k}$ girls and $${b * k}$ boys. What is the ratio of girls to all students?`,
          `一个班有 $${a * k}$ 名女生和 $${b * k}$ 名男生。女生与全班学生的比是多少？`,
        ),
        Q.of(a, a + b),
        [Q.of(a, b), Q.of(b, a + b), Q.of(a + b, a), Q.of(a + b, b)],
        t(`The ratio is $\\frac{${a * k}}{${(a + b) * k}}$.`, `比为 $\\frac{${a * k}}{${(a + b) * k}}$。`),
      );
    return spr(
      t(
        `The ratio of $x$ to $y$ is $${a}:${b}$, and $x = ${a * k}$. What is the value of $y$?`,
        `$x$ 与 $y$ 的比是 $${a}:${b}$，且 $x = ${a * k}$。$y$ 的值是多少？`,
      ),
      b * k,
      [a * k, k, (a + b) * k],
      t(`The scale is $${k}$, so $y = ${b}(${k}) = ${b * k}$.`, `倍数是 $${k}$，所以 $y = ${b}(${k}) = ${b * k}$。`),
    );
  }),
  spec("Applying Ratios", "应用比", ["manipulating-ratios-in-various-contexts"], (rng, hard) => {
    const [a, b, k] = [rng.int(2, 9), rng.int(2, 9), rng.int(3, 20)];
    if (!hard)
      return mc(
        rng,
        t(
          `Red and white paint are mixed in the ratio $${a}:${b}$. If $${(a + b) * k}$ liters are made in total, how many liters are red?`,
          `红漆和白漆按 $${a}:${b}$ 混合。若总共配成 $${(a + b) * k}$ 升，其中红漆多少升？`,
        ),
        a * k,
        [b * k + (a === b ? 1 : 0), a + k, (a + b) * k - 1],
        t(
          `One part is $\\frac{${(a + b) * k}}{${a + b}} = ${k}$ liters, so red is $${a * k}$.`,
          `一份是 $\\frac{${(a + b) * k}}{${a + b}} = ${k}$ 升，红漆是 $${a * k}$ 升。`,
        ),
      );
    return spr(
      t(
        `Red and white paint are mixed in the ratio $${a}:${b}$. A batch uses $${a * k}$ liters of red. What is the total amount of paint in the batch, in liters?`,
        `红漆和白漆按 $${a}:${b}$ 混合。一批用了 $${a * k}$ 升红漆。这批漆共多少升？`,
      ),
      (a + b) * k,
      [b * k, a * k + b, a * k],
      t(
        `The scale is $${k}$, so the total is $${a + b}(${k}) = ${(a + b) * k}$.`,
        `倍数是 $${k}$，总量是 $${a + b}(${k}) = ${(a + b) * k}$。`,
      ),
    );
  }),
  spec("Working With Ratios in Various Settings", "在各种情境中运用比", ["manipulating-ratios-in-various-contexts"], (rng, hard) => {
    const [a, b, c, k] = [rng.int(2, 7), rng.int(2, 7), rng.int(2, 7), rng.int(2, 12)];
    if (!hard)
      return spr(
        t(
          `On a map, $${a}$ centimeters represents $${a * k * 5}$ kilometers. How many kilometers does $${b}$ centimeters represent?`,
          `地图上 $${a}$ 厘米代表 $${a * k * 5}$ 千米。$${b}$ 厘米代表多少千米？`,
        ),
        b * k * 5,
        [a * k * 5, b * k, k * 5],
        t(`Each centimeter represents $${k * 5}$ kilometers.`, `每厘米代表 $${k * 5}$ 千米。`),
      );
    const m = rng.int(2, 3);
    const [bm, top] = [b * m, a === b ? a + 1 : a];
    return spr(
      t(
        `The ratio of $a$ to $b$ is $${top}:${b}$, and the ratio of $b$ to $c$ is $${bm}:${c}$. If $c = ${c * k}$, what is the value of $a$?`,
        `$a$ 与 $b$ 的比是 $${top}:${b}$，$b$ 与 $c$ 的比是 $${bm}:${c}$。若 $c = ${c * k}$，$a$ 的值是多少？`,
      ),
      top * m * k,
      [bm * k, top * k, top * c * k],
      t(
        `Since $c = ${c * k}$ is $${k}$ times $${c}$, $b = ${k}(${bm}) = ${bm * k}$. Then $a = \\frac{${top}}{${b}}(${bm * k}) = ${top * m * k}$.`,
        `因为 $c = ${c * k}$ 是 $${c}$ 的 $${k}$ 倍，所以 $b = ${k}(${bm}) = ${bm * k}$。于是 $a = \\frac{${top}}{${b}}(${bm * k}) = ${top * m * k}$。`,
      ),
    );
  }),
  spec("Rate Problems", "速率问题", ["unit-prices-and-speed"], (rng, hard) => {
    const [r, h, u] = [rng.int(2, 25), rng.int(2, 12), rng.int(2, 9)];
    if (!hard)
      return mc(
        rng,
        t(
          `A printer prints $${r}$ pages per minute. How many pages does it print in $${h}$ minutes?`,
          `打印机每分钟打印 $${r}$ 页。$${h}$ 分钟打印多少页？`,
        ),
        r * h,
        [r + h, Q.of(r, h), r * h + r],
        t(`$${r}(${h}) = ${r * h}$.`, `$${r}(${h}) = ${r * h}$。`),
      );
    return spr(
      t(
        `A worker earns $\\$${r * u}$ for $${u}$ hours of work. At this rate, how much does the worker earn for $${h}$ hours, in dollars?`,
        `一名工人工作 $${u}$ 小时挣 $\\$${r * u}$。按此速率，工作 $${h}$ 小时挣多少美元？`,
      ),
      r * h,
      [r * u * h, r, r * u + h],
      t(`The hourly rate is $\\$${r}$, so $${r}(${h}) = ${r * h}$.`, `每小时 $\\$${r}$，所以 $${r}(${h}) = ${r * h}$。`),
    );
  }),
  spec("Multistep Rate Problems", "多步速率问题", ["solving-multi-step-unit-price-problems"], (rng, hard) => {
    const [r, h, p, q] = [rng.int(2, 9) * 5, rng.int(2, 12), rng.int(2, 9), rng.int(2, 8)];
    if (!hard)
      return spr(
        t(
          `A machine fills $${r}$ bottles per hour. Each case holds $${q}$ bottles and sells for $\\$${p * q}$. How many dollars' worth of cases does the machine fill in $${h}$ hours? Partial cases count proportionally.`,
          `机器每小时灌装 $${r}$ 瓶。每箱装 $${q}$ 瓶，售价 $\\$${p * q}$。机器 $${h}$ 小时灌装的产品价值多少美元？（不满一箱的按比例计算。）`,
        ),
        r * h * p,
        [r * h, r * h * p * q, r * p],
        t(
          `Each bottle is worth $\\$${p}$, and $${r}(${h}) = ${r * h}$ bottles are filled.`,
          `每瓶价值 $\\$${p}$，共灌装 $${r}(${h}) = ${r * h}$ 瓶。`,
        ),
      );
    return spr(
      t(
        `Pump A delivers $${r}$ liters per minute and pump B delivers $${r + p}$ liters per minute. Working together, how many minutes do they take to deliver $${(2 * r + p) * h}$ liters?`,
        `A 泵每分钟输送 $${r}$ 升，B 泵每分钟输送 $${r + p}$ 升。两台一起工作，输送 $${(2 * r + p) * h}$ 升需要多少分钟？`,
      ),
      h,
      [2 * h, Q.of((2 * r + p) * h, r), h + p],
      t(`Together they deliver $${2 * r + p}$ liters per minute.`, `两台合起来每分钟输送 $${2 * r + p}$ 升。`),
    );
  }),
  spec("Speed Problems", "速度问题", ["unit-prices-and-speed"], (rng, hard) => {
    const [v, h, w, g] = [rng.int(5, 14) * 5, rng.int(2, 8), rng.int(3, 16) * 5, rng.int(2, 8)];
    if (!hard)
      return mc(
        rng,
        t(
          `A car travels at $${v}$ miles per hour for $${h}$ hours. How far does it travel, in miles?`,
          `汽车以每小时 $${v}$ 英里行驶 $${h}$ 小时。它行驶了多少英里？`,
        ),
        v * h,
        [v + h, Q.of(v, h), v * h + v],
        t(`$${v}(${h}) = ${v * h}$.`, `$${v}(${h}) = ${v * h}$。`),
      );
    return spr(
      t(
        `A car travels at $${v}$ miles per hour for $${h}$ hours and then at $${w}$ miles per hour for $${g}$ hours. What is its average speed for the whole trip, in miles per hour?`,
        `汽车先以每小时 $${v}$ 英里行驶 $${h}$ 小时，再以每小时 $${w}$ 英里行驶 $${g}$ 小时。全程平均速度是每小时多少英里？`,
      ),
      Q.of(v * h + w * g, h + g),
      [Q.of(v + w, 2), v * h + w * g, Q.of(v * h + w * g, 2)],
      t(
        `The distance is $${v * h + w * g}$ miles and the time is $${h + g}$ hours.`,
        `路程是 $${v * h + w * g}$ 英里，时间是 $${h + g}$ 小时。`,
      ),
    );
  }),
  spec("Solving Equations Describing Proportional Relationships", "解描述比例关系的方程", ["ratios"], (rng, hard) => {
    const [k, a, b] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 15)];
    if (!hard)
      return mc(
        rng,
        t(
          `$y$ is directly proportional to $x$, and $y = ${k * a}$ when $x = ${a}$. What is $y$ when $x = ${b}$?`,
          `$y$ 与 $x$ 成正比，$x = ${a}$ 时 $y = ${k * a}$。$x = ${b}$ 时 $y$ 是多少？`,
        ),
        k * b,
        [k + b, k * a + b, k * (a + b)],
        t(`The constant is $k = ${k}$, so $y = ${k}(${b})$.`, `常数 $k = ${k}$，所以 $y = ${k}(${b})$。`),
      );
    return spr(
      t(`Solve for $x$: $\\frac{x}{${a}} = \\frac{${k * b}}{${b}}$.`, `解 $x$：$\\frac{x}{${a}} = \\frac{${k * b}}{${b}}$。`),
      k * a,
      [k, k * b, a * b],
      t(`The right side is $${k}$, so $x = ${k}(${a}) = ${k * a}$.`, `右边等于 $${k}$，所以 $x = ${k}(${a}) = ${k * a}$。`),
    );
  }),
  spec("Calculating Density", "计算密度", ["density"], (rng, hard) => {
    const [d, v, s] = [rng.int(2, 19), rng.int(3, 30), rng.int(2, 6)];
    if (!hard)
      return mc(
        rng,
        t(
          `An object has a mass of $${d * v}$ grams and a volume of $${v}$ cubic centimeters. What is its density, in grams per cubic centimeter?`,
          `一个物体的质量为 $${d * v}$ 克，体积为 $${v}$ 立方厘米。它的密度是多少克每立方厘米？`,
        ),
        d,
        [d * v + v, d * v - v, d + v],
        t(`$\\frac{${d * v}}{${v}} = ${d}$.`, `$\\frac{${d * v}}{${v}} = ${d}$。`),
      );
    return spr(
      t(
        `A cube with side length $${s}$ centimeters has a density of $${d}$ grams per cubic centimeter. What is its mass, in grams?`,
        `一个边长为 $${s}$ 厘米的立方体密度为 $${d}$ 克每立方厘米。它的质量是多少克？`,
      ),
      d * s ** 3,
      [d * s, d * s * s, s ** 3],
      t(
        `The volume is $${s}^3 = ${s ** 3}$, and the mass is $${d}(${s ** 3}) = ${d * s ** 3}$.`,
        `体积为 $${s}^3 = ${s ** 3}$，质量为 $${d}(${s ** 3}) = ${d * s ** 3}$。`,
      ),
    );
  }),
  spec("Descriptions of Physical Phenomena", "描述物理现象", ["interpreting-descriptions-of-physical-phenomena"], (rng, hard) => {
    const [g, k, f] = [rng.int(2, 9), rng.int(2, 12), rng.int(2, 6)];
    if (!hard)
      return mc(
        rng,
        t(
          `The energy of a moving object is given by $E = ${k}v^2$, where $v$ is its speed. If the speed is multiplied by $${f}$, by what factor is the energy multiplied?`,
          `运动物体的能量为 $E = ${k}v^2$，其中 $v$ 是速度。若速度乘以 $${f}$，能量乘以多少？`,
        ),
        f * f,
        [f, 2 * f + 1, f * f + f],
        t(`The speed is squared, so the factor is $${f}^2 = ${f * f}$.`, `速度被平方，所以倍数是 $${f}^2 = ${f * f}$。`),
      );
    return spr(
      t(
        `The pressure of a gas at constant temperature is $P = \\frac{${g * k * f}}{V}$, where $V$ is its volume. When $V$ changes from $${g}$ to $${g * f}$, what is the new pressure?`,
        `恒温下气体的压强为 $P = \\frac{${g * k * f}}{V}$，其中 $V$ 是体积。当 $V$ 由 $${g}$ 变为 $${g * f}$ 时，新的压强是多少？`,
      ),
      k,
      [k * f, g * k * f, k + f],
      t(`$\\frac{${g * k * f}}{${g * f}} = ${k}$.`, `$\\frac{${g * k * f}}{${g * f}} = ${k}$。`),
    );
  }),
];
