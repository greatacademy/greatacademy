import type { Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { cx, mc, mod, sg, spr, table, words } from "../exam.ts";

// SAT Math Prep, Algebra: equations with binomials, word problems, two-variable models, linear functions and tables.

/** Plan is a linear cost or quantity in context: a fixed amount plus a rate for each unit. */
interface Plan {
  readonly fixed: Text;
  readonly rate: Text;
  readonly unit: Text;
  readonly one: Text;
}

/** plans are contexts for linear models, in the style of exam questions. */
const plans: readonly Plan[] = [
  {
    fixed: t("a one-time membership fee", "一次性会员费"),
    rate: t("the charge per class", "每节课的费用"),
    unit: t("classes", "节课"),
    one: t("class", "节课"),
  },
  { fixed: t("a delivery fee", "配送费"), rate: t("the price per box", "每箱的价格"), unit: t("boxes", "箱"), one: t("box", "箱") },
  { fixed: t("a rental fee", "租赁费"), rate: t("the charge per hour", "每小时的费用"), unit: t("hours", "小时"), one: t("hour", "小时") },
  { fixed: t("a setup fee", "安装费"), rate: t("the charge per month", "每月的费用"), unit: t("months", "个月"), one: t("month", "个月") },
];

/** Pair is a two-item total: how many of each item were bought at two prices. */
interface Pair {
  readonly a: Text;
  readonly b: Text;
}

/** pairs are contexts for totals of two kinds of items. */
const pairs: readonly Pair[] = [
  { a: t("adult tickets", "成人票"), b: t("student tickets", "学生票") },
  { a: t("large boxes", "大箱"), b: t("small boxes", "小箱") },
  { a: t("notebooks", "笔记本"), b: t("pens", "钢笔") },
  { a: t("shirts", "衬衫"), b: t("hats", "帽子") },
];

const eqTips = mod(
  t(
    "Keep a repeated binomial whole when you can. Treating it as one quantity is faster than distributing, and exam questions are built to reward it.",
    "能把重复的二项式当作整体时就当作整体。这比展开更快，考试题正是为此设计的。",
  ),
  t(
    "Harder questions ask for an expression rather than the variable, so compare what is asked with what is given before you start solving.",
    "较难的题问的是式子而不是变量，所以动手之前先比较所求与已知。",
  ),
);
const wordTips = mod(
  t(
    "Name the unknown, write one equation from the sentences, and answer the exact quantity asked. Wrong options are often correct values of other quantities in the story.",
    "设出未知数，根据句子写出一个方程，并回答题目确切问的量。错误选项常常是故事中其他量的正确值。",
  ),
  t(
    "Harder word problems add a condition or a second step. Translate each sentence on its own, and check units before choosing an option.",
    "较难的应用题多一个条件或一步推理。逐句翻译，并在选择前检查单位。",
  ),
);
const twoVarTips = mod(
  t(
    "In a model such as $ax + by = c$, each term is a part of the total. Ask what one unit of each variable contributes, since this is how meaning questions are answered.",
    "在 $ax + by = c$ 这样的模型中，每一项都是总量的一部分。想一想每个变量的一个单位贡献多少，含义题就这样回答。",
  ),
  t(
    "Harder questions change one quantity and ask for the effect on another. Substitute the known value, then solve for what remains.",
    "较难的题改变一个量，问对另一个量的影响。代入已知值，再解出剩下的量。",
  ),
);
const fnTips = mod(
  t(
    "Read $f(a)$ as the output at input $a$. Decide whether the question gives the input or the output, since confusing them gives a listed wrong option.",
    "把 $f(a)$ 读作输入 $a$ 时的输出。先判断题目给的是输入还是输出，混淆两者就会选中错误选项。",
  ),
  t(
    "Harder questions combine functions or hide a constant. Find the constant from the given point first, and then answer the question.",
    "较难的题会复合函数或隐藏常数。先用给定的点求出常数，再回答问题。",
  ),
);
const tableTips = mod(
  t(
    "A table is linear when equal steps in $x$ give equal steps in $y$. Find the slope from two rows and the intercept from any row.",
    "当 $x$ 的等距变化对应 $y$ 的等距变化时，表格是线性的。用两行求斜率，用任一行求截距。",
  ),
  t(
    "If the $x$ values do not increase by $1$, divide the change in $y$ by the change in $x$. Unknown entries then follow from the same slope.",
    "如果 $x$ 不是每次增加 $1$，就用 $y$ 的变化量除以 $x$ 的变化量。未知项也由同一斜率得出。",
  ),
);

/** linearTable makes rows of y = mx + b at unevenly spaced inputs when hard. */
function linearTable(rng: Rng, hard: boolean): { m: number; b: number; xs: number[]; ys: number[] } {
  const m = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6]);
  const b = rng.int(-9, 12);
  const start = rng.int(0, 3);
  const xs = hard ? [start, start + 2, start + 5, start + 9] : [start, start + 1, start + 2, start + 3];
  return { m, b, xs, ys: xs.map((v) => m * v + b) };
}

/** satExamAlgebra2 continues the SAT Algebra unit through functions in tables. */
export const satExamAlgebra2: ExamSpec[] = [
  eqTips(
    "Solving Linear Equations Containing Binomials by Factoring",
    "用提公因式解含二项式的一次方程",
    ["solving-linear-equations-containing-binomials-by-factoring"],
    (rng, hard) => {
      const k = rng.int(2, 6);
      const v = rng.int(2, 9);
      const c = rng.int(1, 9);
      const a = rng.int(2, 5);
      const r = rng.int(k + 1, k + 6);
      const value = (r - k) * (a * v + c);
      const u = `(${a}x ${sg(c)})`;
      if (!hard)
        return mc(
          rng,
          t(
            `If $${r}${u} - ${k}${u} = ${value}$, what is the value of $${a}x ${sg(c)}$?`,
            `若 $${r}${u} - ${k}${u} = ${value}$，则 $${a}x ${sg(c)}$ 的值是多少？`,
          ),
          a * v + c,
          [v, value, Q.of(value, r + k)],
          t(
            `The binomial is a common factor, so the left side is $${r - k}${u}$. Dividing by $${r - k}$ gives $${a * v + c}$.`,
            `二项式是公因式，所以左边等于 $${r - k}${u}$。除以 $${r - k}$ 得 $${a * v + c}$。`,
          ),
        );
      return spr(
        t(`If $${r}${u} - ${k}${u} = ${value}$, what is the value of $x$?`, `若 $${r}${u} - ${k}${u} = ${value}$，则 $x$ 的值是多少？`),
        v,
        [a * v + c, a * v, Q.of(value, r - k)],
        t(
          `Factor out the binomial: $${r - k}${u} = ${value}$, so $${a}x ${sg(c)} = ${a * v + c}$. Then $${a}x = ${a * v}$ and $x = ${v}$.`,
          `提出二项式：$${r - k}${u} = ${value}$，所以 $${a}x ${sg(c)} = ${a * v + c}$。于是 $${a}x = ${a * v}$，$x = ${v}$。`,
        ),
      );
    },
  ),
  eqTips(
    "Solving Linear Equations With Binomials on Both Sides",
    "解两边都有二项式的一次方程",
    ["equations-with-parentheses"],
    (rng, hard) => {
      const v = rng.int(-4, 9);
      const a = rng.int(4, 8);
      const c = rng.int(2, a - 1);
      const b = rng.int(1, 7);
      const d = rng.int(1, 7);
      const e = a * (v + b) - c * (v + d);
      const eq = `${a}(x + ${b}) = ${c}(x + ${d}) ${sg(e)}`;
      if (e === 0)
        return mc(
          rng,
          t(`What value of $x$ satisfies $${a}(x + ${b}) = ${c}(x + ${d})$?`, `哪个 $x$ 的值满足 $${a}(x + ${b}) = ${c}(x + ${d})$？`),
          v,
          [v + 1, v - 1, v + 2],
          t(
            `Distribute and collect: $${a - c}x = ${c * d - a * b}$, so $x = ${v}$.`,
            `展开并合并：$${a - c}x = ${c * d - a * b}$，所以 $x = ${v}$。`,
          ),
        );
      if (!hard)
        return mc(
          rng,
          t(`What value of $x$ satisfies $${eq}$?`, `哪个 $x$ 的值满足 $${eq}$？`),
          v,
          [Q.of(c * d + e + a * b, a - c), Q.of(c * d + e - a * b, a + c), v + 1],
          t(
            `Distribute: $${a}x + ${a * b} = ${c}x + ${c * d} ${sg(e)}$. Collect terms: $${a - c}x = ${(a - c) * v}$, so $x = ${v}$.`,
            `展开：$${a}x + ${a * b} = ${c}x + ${c * d} ${sg(e)}$。合并：$${a - c}x = ${(a - c) * v}$，所以 $x = ${v}$。`,
          ),
        );
      const k = rng.int(2, 5);
      return spr(
        t(`If $${eq}$, what is the value of $${k}x + 1$?`, `若 $${eq}$，则 $${k}x + 1$ 的值是多少？`),
        k * v + 1,
        [v, k * v, k * (v + 1)],
        t(
          `Distribute and collect: $${a - c}x = ${(a - c) * v}$, so $x = ${v}$. Then $${k}(${v}) + 1 = ${k * v + 1}$.`,
          `展开并合并：$${a - c}x = ${(a - c) * v}$，所以 $x = ${v}$。于是 $${k}(${v}) + 1 = ${k * v + 1}$。`,
        ),
      );
    },
  ),
  wordTips(
    "Constructing Models With One-Variable Linear Equations",
    "构造一元一次方程模型",
    ["modeling-with-linear-equations"],
    (rng, hard) => {
      const p = rng.pick(plans);
      const f = 5 * rng.int(2, 12);
      const r = rng.int(3, 15);
      const T = f + r * rng.int(3, 12);
      const d = rng.int(2, 5);
      const pr = hard ? t(` A coupon takes $\\$${d}$ off ${p.rate.en}.`, `一张优惠券使${p.rate["zh-CN"]}减少 $${d}$ 美元。`) : t("", "");
      const m = hard ? r + d : r;
      return mc(
        rng,
        t(
          `A customer pays ${p.fixed.en} of $\\$${f}$ plus $\\$${m}$ per ${p.one.en}.${pr.en} The customer pays $\\$${T}$ in all for $n$ ${p.unit.en}. Which equation represents this situation?`,
          `顾客支付${p.fixed["zh-CN"]} $${f}$ 美元，每${p.one["zh-CN"]}另付 $${m}$ 美元。${pr["zh-CN"]}顾客对 $n$ ${p.unit["zh-CN"]}共支付 $${T}$ 美元。哪个方程表示这一情境？`,
        ),
        `${f} + ${r}n = ${T}`,
        [`${r} + ${f}n = ${T}`, `${f + r}n = ${T}`, `${f}n - ${r} = ${T}`, `${f} + ${r + 1}n = ${T}`],
        t(
          `The fee is paid once, so it is the constant. The rate${hard ? ` after the coupon is $${m} - ${d} = ${r}$ and it` : ""} multiplies $n$. Hence $${f} + ${r}n = ${T}$.`,
          `费用只付一次，所以是常数。${hard ? `优惠后的单价是 $${m} - ${d} = ${r}$，` : ""}单价乘以 $n$。因此 $${f} + ${r}n = ${T}$。`,
        ),
      );
    },
  ),
  wordTips(
    "Modeling and Solving Problems Using Linear Equations",
    "用一次方程建模并求解",
    ["modeling-with-linear-equations"],
    (rng, hard) => {
      const p = rng.pick(plans);
      const f = 5 * rng.int(2, 12);
      const r = rng.int(3, 15);
      const n = rng.int(4, 14);
      if (!hard)
        return spr(
          t(
            `A company charges ${p.fixed.en} of $\\$${f}$ and $\\$${r}$ per ${p.one.en}. A customer was charged $\\$${f + r * n}$. How many ${p.unit.en} did the customer pay for?`,
            `某公司收取${p.fixed["zh-CN"]} $${f}$ 美元，每${p.one["zh-CN"]}收 $${r}$ 美元。一位顾客被收取 $${f + r * n}$ 美元。这位顾客购买了多少${p.unit["zh-CN"]}？`,
          ),
          n,
          [Q.of(f + r * n, r), n + 1, Q.of(f + r * n, f + r)],
          t(
            `Solve $${f} + ${r}n = ${f + r * n}$: $${r}n = ${r * n}$, so $n = ${n}$.`,
            `解 $${f} + ${r}n = ${f + r * n}$：$${r}n = ${r * n}$，所以 $n = ${n}$。`,
          ),
        );
      const s = r - rng.int(1, r > 4 ? 3 : 2);
      const c = r - s;
      const nn = c * rng.int(2, 5);
      const gg = f + (r - s) * nn;
      return mc(
        rng,
        t(
          `Company A charges $\\$${f}$ plus $\\$${r}$ per ${p.one.en}. Company B charges $\\$${gg}$ plus $\\$${s}$ per ${p.one.en}. For how many ${p.unit.en} do the two companies charge the same total?`,
          `A 公司收 $${f}$ 美元，并按每${p.one["zh-CN"]}收 $${r}$ 美元。B 公司收 $${gg}$ 美元，每${p.one["zh-CN"]}收 $${s}$ 美元。多少${p.unit["zh-CN"]}时两家公司总收费相同？`,
        ),
        nn,
        [Q.of(gg - f, r + s), Q.of(gg + f, r - s), nn + 1],
        t(
          `Set the totals equal: $${f} + ${r}n = ${gg} + ${s}n$. Then ${c === 1 ? `$n = ${nn}$` : `$${c}n = ${gg - f}$, so $n = ${nn}$`}.`,
          `令总额相等：$${f} + ${r}n = ${gg} + ${s}n$。于是 ${c === 1 ? `$n = ${nn}$` : `$${c}n = ${gg - f}$，所以 $n = ${nn}$`}。`,
        ),
      );
    },
  ),
  twoVarTips("Solving Two-Variable Linear Models", "求解二元一次模型", ["modeling-with-two-variable-linear-equations"], (rng, hard) => {
    const p = rng.pick(pairs);
    const a = rng.int(3, 12);
    const b = rng.int(2, a - 1 || 2);
    const x0 = rng.int(4, 20);
    const y0 = rng.int(3, 15);
    const T = a * x0 + b * y0;
    const prompt = t(
      `The equation $${a}x + ${b}y = ${T}$ gives the total sales, in dollars, from $x$ ${p.a.en} and $y$ ${p.b.en}.`,
      `方程 $${a}x + ${b}y = ${T}$ 表示卖出 $x$ 张（件）${p.a["zh-CN"]}和 $y$ 张（件）${p.b["zh-CN"]}的总收入（美元）。`,
    );
    if (!hard)
      return spr(
        t(
          `${prompt.en} If $${x0}$ ${p.a.en} were sold, how many ${p.b.en} were sold?`,
          `${prompt["zh-CN"]}若卖出 $${x0}$ 张（件）${p.a["zh-CN"]}，则卖出多少张（件）${p.b["zh-CN"]}？`,
        ),
        y0,
        [x0, Q.of(T, b), Q.of(T - b * x0, a)],
        t(
          `Substitute $x = ${x0}$: $${a * x0} + ${b}y = ${T}$. Then $${b}y = ${b * y0}$, so $y = ${y0}$.`,
          `代入 $x = ${x0}$：$${a * x0} + ${b}y = ${T}$。于是 $${b}y = ${b * y0}$，所以 $y = ${y0}$。`,
        ),
      );
    const more = b * rng.int(1, 3);
    return mc(
      rng,
      t(
        `${prompt.en} If $${more}$ more ${p.a.en} are sold while the total stays the same, how does $y$ change?`,
        `${prompt["zh-CN"]}若多卖出 $${more}$ 张（件）${p.a["zh-CN"]}而总收入不变，则 $y$ 如何变化？`,
      ),
      `y \\text{ decreases by } ${(a * more) / b}`,
      [`y \\text{ decreases by } ${more}`, `y \\text{ increases by } ${(a * more) / b}`, `y \\text{ decreases by } ${a * more}`],
      t(
        `The extra sales bring $${a} \\cdot ${more} = ${a * more}$ dollars, so the other item must bring that much less. Each ${p.b.en.replace(/s$/, "")} is worth $${b}$ dollars, so $y$ falls by $${(a * more) / b}$.`,
        `多卖带来 $${a} \\cdot ${more} = ${a * more}$ 美元，所以另一种商品要少带来这么多。它每件值 $${b}$ 美元，所以 $y$ 减少 $${(a * more) / b}$。`,
      ),
    );
  }),
  twoVarTips(
    "Constructing Models With Two-Variable Linear Equations",
    "构造二元一次方程模型",
    ["modeling-with-two-variable-linear-equations"],
    (rng, hard) => {
      const p = rng.pick(pairs);
      const a = rng.int(4, 15);
      const b = rng.int(2, a - 1);
      const T = 10 * rng.int(20, 90);
      const hours = hard ? rng.int(2, 5) : 1;
      const en = hard
        ? `A workshop makes ${p.a.en} and ${p.b.en}. Each of the ${p.a.en} takes $${a * hours}$ minutes and each of the ${p.b.en} takes $${b * hours}$ minutes. In all, the workshop uses $${T}$ hours. If $x$ is the number of ${p.a.en} and $y$ the number of ${p.b.en}, which equation represents this?`
        : `A store sells ${p.a.en} for $\\$${a}$ each and ${p.b.en} for $\\$${b}$ each. Sales total $\\$${T}$. If $x$ is the number of ${p.a.en} and $y$ the number of ${p.b.en}, which equation represents this?`;
      const zh = hard
        ? `某工坊生产${p.a["zh-CN"]}和${p.b["zh-CN"]}。每件${p.a["zh-CN"]}用时 $${a * hours}$ 分钟，每件${p.b["zh-CN"]}用时 $${b * hours}$ 分钟。总共用时 $${T}$ 小时。设 $x$ 为${p.a["zh-CN"]}的数量，$y$ 为${p.b["zh-CN"]}的数量，哪个方程表示这一情况？`
        : `商店以每件 $${a}$ 美元卖${p.a["zh-CN"]}，每件 $${b}$ 美元卖${p.b["zh-CN"]}。销售总额为 $${T}$ 美元。设 $x$ 为${p.a["zh-CN"]}的数量，$y$ 为${p.b["zh-CN"]}的数量，哪个方程表示这一情况？`;
      const A = hard ? a * hours : a;
      const B = hard ? b * hours : b;
      const R = hard ? 60 * T : T;
      return mc(
        rng,
        t(en, zh),
        `${A}x + ${B}y = ${R}`,
        [`${B}x + ${A}y = ${R}`, `${A}x + ${B}y = ${hard ? T : R + A}`, `x + y = ${R}`],
        t(
          `Each kind contributes its amount times its count${hard ? `, and the total must be in minutes: $${T} \\cdot 60 = ${R}$` : ""}. So $${A}x + ${B}y = ${R}$.`,
          `每一种的贡献是单位量乘以数量${hard ? `，总量必须化为分钟：$${T} \\cdot 60 = ${R}$` : ""}。所以 $${A}x + ${B}y = ${R}$。`,
        ),
      );
    },
  ),
  twoVarTips(
    "Interpreting Two-Variable Linear Equations",
    "解释二元一次方程",
    ["interpreting-coefficients-of-two-variable-equations"],
    (rng, hard) => {
      const p = rng.pick(pairs);
      const a = rng.int(4, 15);
      const b = rng.int(2, a - 1);
      const T = 10 * rng.int(20, 90);
      const intro = t(
        `A store sells ${p.a.en} and ${p.b.en}. The equation $${a}x + ${b}y = ${T}$ relates the numbers $x$ of ${p.a.en} and $y$ of ${p.b.en} sold on a day when sales were $\\$${T}$.`,
        `商店卖${p.a["zh-CN"]}和${p.b["zh-CN"]}。方程 $${a}x + ${b}y = ${T}$ 表示某天销售额为 $${T}$ 美元时，卖出的${p.a["zh-CN"]}数量 $x$ 和${p.b["zh-CN"]}数量 $y$ 之间的关系。`,
      );
      if (!hard)
        return words(
          rng,
          t(`${intro.en} What does $${a}x$ represent?`, `${intro["zh-CN"]}$${a}x$ 表示什么？`),
          t(`The sales from ${p.a.en}, in dollars`, `${p.a["zh-CN"]}的销售额（美元）`),
          [
            t(`The number of ${p.a.en} sold`, `卖出的${p.a["zh-CN"]}数量`),
            t(`The price of one of the ${p.a.en}, in dollars`, `一件${p.a["zh-CN"]}的价格（美元）`),
            t("The total sales, in dollars", "总销售额（美元）"),
          ],
          t(
            `$${a}$ is the price of one and $x$ is the number sold, so their product is the money from that item.`,
            `$${a}$ 是单价，$x$ 是卖出数量，所以乘积是这种商品带来的收入。`,
          ),
        );
      return words(
        rng,
        t(`${intro.en} What does the solution with $y = 0$ represent?`, `${intro["zh-CN"]}$y = 0$ 时的解表示什么？`),
        t(
          `The number of ${p.a.en} needed to reach the total with no ${p.b.en} sold`,
          `不卖${p.b["zh-CN"]}时达到总额所需的${p.a["zh-CN"]}数量`,
        ),
        [
          t(
            `The number of ${p.b.en} needed to reach the total with no ${p.a.en} sold`,
            `不卖${p.a["zh-CN"]}时达到总额所需的${p.b["zh-CN"]}数量`,
          ),
          t(`The price of one of the ${p.a.en}`, `一件${p.a["zh-CN"]}的价格`),
          t(`The extra sales from each of the ${p.b.en}`, `每件${p.b["zh-CN"]}增加的销售额`),
        ],
        t(
          `With $y = 0$, no ${p.b.en} are sold, and $x = \\frac{${T}}{${a}}$ is how many ${p.a.en} alone reach the total.`,
          `$y = 0$ 表示不卖${p.b["zh-CN"]}，$x = \\frac{${T}}{${a}}$ 是仅靠${p.a["zh-CN"]}达到总额的数量。`,
        ),
      );
    },
  ),
  twoVarTips(
    "Interpreting Coefficients of Two-Variable Linear Equations",
    "解释二元一次方程的系数",
    ["interpreting-coefficients-of-two-variable-equations"],
    (rng, hard) => {
      const s = rng.int(2, 9);
      const start = 10 * rng.int(20, 60);
      const eq = `y = ${start} - ${s}x`;
      const intro = t(
        `The equation $${eq}$ gives the amount of fuel $y$, in liters, left in a tank after a generator runs for $x$ hours.`,
        `方程 $${eq}$ 表示发电机运行 $x$ 小时后，油箱中剩余的燃料量 $y$（升）。`,
      );
      if (!hard)
        return words(
          rng,
          t(
            `${intro.en} What is the best interpretation of $${s}$ in this context?`,
            `${intro["zh-CN"]}在此情境中，$${s}$ 的最佳解释是什么？`,
          ),
          t("The generator uses this many liters each hour", "发电机每小时消耗这么多升"),
          [
            t("The tank starts with this many liters", "油箱最初有这么多升"),
            t("The generator runs for this many hours", "发电机运行这么多小时"),
            t("The tank has this many liters left at the end", "最后油箱剩这么多升"),
          ],
          t(
            `$${s}$ multiplies the hours, and $y$ falls by $${s}$ for each added hour, so it is the hourly use.`,
            `$${s}$ 乘以小时数，每多 1 小时 $y$ 减少 $${s}$，所以它是每小时的消耗量。`,
          ),
        );
      const h = rng.int(2, 8);
      return spr(
        t(
          `${intro.en} How many liters does the generator use over any period of $${h}$ hours?`,
          `${intro["zh-CN"]}发电机在任意 $${h}$ 小时内消耗多少升？`,
        ),
        s * h,
        [start - s * h, s, start],
        t(
          `Each hour uses $${s}$ liters, whatever the starting amount, so $${h}$ hours use $${h} \\cdot ${s} = ${s * h}$ liters.`,
          `每小时消耗 $${s}$ 升，与初始量无关，所以 $${h}$ 小时消耗 $${h} \\cdot ${s} = ${s * h}$ 升。`,
        ),
      );
    },
  ),
  twoVarTips(
    "Modeling Totals Using Two-Variable Linear Equations",
    "用二元一次方程为总量建模",
    ["modeling-totals-with-two-variable-equations"],
    (rng, hard) => {
      const a = rng.int(4, 15);
      const b = rng.int(2, a - 1);
      const x0 = rng.int(5, 30);
      const y0 = rng.int(5, 30);
      const T = a * x0 + b * y0;
      const p = rng.pick(pairs);
      if (!hard)
        return mc(
          rng,
          t(
            `A store sold ${p.a.en} at $\\$${a}$ each and ${p.b.en} at $\\$${b}$ each, for $\\$${T}$ in all. Which equation relates the numbers $x$ and $y$ sold of these items?`,
            `商店以每件 $${a}$ 美元卖${p.a["zh-CN"]}，以每件 $${b}$ 美元卖${p.b["zh-CN"]}，共收入 $${T}$ 美元。哪个方程表示它们的销售数量 $x$ 和 $y$ 的关系？`,
          ),
          `${a}x + ${b}y = ${T}`,
          [`${b}x + ${a}y = ${T}`, `x + y = ${T}`, `${a + b}(x + y) = ${T}`],
          t(
            `Each item's sales are its price times its count, and the two parts add up to the total.`,
            `每种商品的销售额是单价乘以数量，两部分之和等于总额。`,
          ),
        );
      return spr(
        t(
          `A store sold ${p.a.en} at $\\$${a}$ each and ${p.b.en} at $\\$${b}$ each, for $\\$${T}$ in all. If $${x0 + y0}$ items were sold, how many were ${p.a.en}?`,
          `商店以每件 $${a}$ 美元卖${p.a["zh-CN"]}，以每件 $${b}$ 美元卖${p.b["zh-CN"]}，共收入 $${T}$ 美元。若共卖出 $${x0 + y0}$ 件，其中${p.a["zh-CN"]}有多少件？`,
        ),
        x0,
        [y0, Q.of(T, a), x0 + y0],
        t(
          `With $x$ of the first item, $${a}x + ${b}(${x0 + y0} - x) = ${T}$, so $${a - b}x = ${T - b * (x0 + y0)}$ and $x = ${x0}$.`,
          `设第一种有 $x$ 件，则 $${a}x + ${b}(${x0 + y0} - x) = ${T}$，所以 $${a - b}x = ${T - b * (x0 + y0)}$，$x = ${x0}$。`,
        ),
      );
    },
  ),
  wordTips(
    "Modeling Geometry Problems Using Linear Equations",
    "用一次方程为几何问题建模",
    ["modeling-with-linear-equations", "perimeter"],
    (rng, hard) => {
      const w = rng.int(3, 20);
      const k = rng.int(2, 4);
      const d = rng.int(1, 9);
      const l = k * w + d;
      const P = 2 * (w + l);
      if (!hard)
        return spr(
          t(
            `The length of a rectangle is $${d}$ more than $${k}$ times its width. The perimeter is $${P}$. What is the width?`,
            `长方形的长比宽的 $${k}$ 倍多 $${d}$。周长是 $${P}$。宽是多少？`,
          ),
          w,
          [l, Q.of(P, 2), Q.of(P - d, k)],
          t(
            `Write $2(w + ${k}w + ${d}) = ${P}$. Then $${k + 1}w + ${d} = ${P / 2}$, so $w = ${w}$.`,
            `写出 $2(w + ${k}w + ${d}) = ${P}$。于是 $${k + 1}w + ${d} = ${P / 2}$，所以 $w = ${w}$。`,
          ),
        );
      return spr(
        t(
          `The length of a rectangle is $${d}$ more than $${k}$ times its width. The perimeter is $${P}$. What is the area of the rectangle?`,
          `长方形的长比宽的 $${k}$ 倍多 $${d}$。周长是 $${P}$。长方形的面积是多少？`,
        ),
        w * l,
        [w, l, P],
        t(
          `From $2(w + ${k}w + ${d}) = ${P}$, $w = ${w}$ and the length is $${l}$, so the area is $${w} \\cdot ${l} = ${w * l}$.`,
          `由 $2(w + ${k}w + ${d}) = ${P}$ 得 $w = ${w}$，长为 $${l}$，所以面积是 $${w} \\cdot ${l} = ${w * l}$。`,
        ),
      );
    },
  ),
  fnTips("Evaluating Linear Functions", "求一次函数的值", ["introduction-to-functions"], (rng, hard) => {
    const m = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
    const b = rng.int(-9, 12);
    const a = rng.int(2, 9);
    const f = `f(x) = ${cx(m)} ${sg(b)}`;
    if (!hard)
      return mc(
        rng,
        t(`The function $f$ is defined by $${f}$. What is the value of $f(${a})$?`, `函数 $f$ 定义为 $${f}$。$f(${a})$ 的值是多少？`),
        m * a + b,
        [m + a + b, m * a - b, (a - b) / m === Math.floor((a - b) / m) ? (a - b) / m : m * a],
        t(`Replace $x$ with $${a}$: $${m}(${a}) ${sg(b)} = ${m * a + b}$.`, `用 $${a}$ 替换 $x$：$${m}(${a}) ${sg(b)} = ${m * a + b}$。`),
      );
    const c = a + rng.int(1, 5);
    return spr(
      t(
        `The function $f$ is defined by $${f}$. What is the value of $f(${c}) - f(${a})$?`,
        `函数 $f$ 定义为 $${f}$。$f(${c}) - f(${a})$ 的值是多少？`,
      ),
      m * (c - a),
      [m * c + b, c - a, m * (c - a) + b],
      t(
        `The constant cancels, and the difference is the slope times the change in input: $${m}(${c} - ${a}) = ${m * (c - a)}$.`,
        `常数相消，差等于斜率乘以输入的变化量：$${m}(${c} - ${a}) = ${m * (c - a)}$。`,
      ),
    );
  }),
  fnTips("Working With Function Composition", "函数复合运算", ["function-composition"], (rng, hard) => {
    const m = rng.int(2, 6);
    const b0 = rng.nonZero(-6, 8);
    const n = rng.int(2, 5);
    const c = rng.nonZero(-5, 6);
    const a = rng.int(1, 5);
    const b = m * c + b0 === 0 ? b0 + 1 : b0;
    const f = `f(x) = ${m}x ${sg(b)}`;
    const g = `g(x) = ${n}x ${sg(c)}`;
    const inner = n * a + c;
    const ans = m * inner + b;
    if (!hard)
      return mc(
        rng,
        t(`If $${f}$ and $${g}$, what is the value of $f(g(${a}))$?`, `若 $${f}$，$${g}$，则 $f(g(${a}))$ 的值是多少？`),
        ans,
        [n * (m * a + b) + c, m * a + b + inner, inner],
        t(
          `Work from the inside: $g(${a}) = ${inner}$. Then $f(${inner}) = ${m}(${inner}) ${sg(b)} = ${ans}$.`,
          `从内向外：$g(${a}) = ${inner}$。于是 $f(${inner}) = ${m}(${inner}) ${sg(b)} = ${ans}$。`,
        ),
      );
    const out = m * n;
    const cst = m * c + b;
    return mc(
      rng,
      t(`If $${f}$ and $${g}$, which expression equals $f(g(x))$?`, `若 $${f}$，$${g}$，哪个式子等于 $f(g(x))$？`),
      `${out}x ${sg(cst)}`,
      [
        `${out}x ${sg(n * b + c)}`,
        `${m + n}x ${sg(b + c)}`,
        `${out}x ${sg(c + b)}`,
        `${out}x ${sg(cst + 1)}`,
        `${m + n}x ${sg(cst)}`,
        `${out + 1}x ${sg(cst)}`,
        `${out + 2}x ${sg(cst + 2)}`,
      ],
      t(
        `Substitute: $f(g(x)) = ${m}(${n}x ${sg(c)}) ${sg(b)} = ${out}x ${sg(m * c)} ${sg(b)} = ${out}x ${sg(cst)}$.`,
        `代入：$f(g(x)) = ${m}(${n}x ${sg(c)}) ${sg(b)} = ${out}x ${sg(m * c)} ${sg(b)} = ${out}x ${sg(cst)}$。`,
      ),
    );
  }),
  tableTips(
    "Identifying Tables Corresponding to Linear Functions",
    "识别对应一次函数的表格",
    ["linear-functions-in-tabular-form"],
    (rng, hard) => {
      const { m, b, xs } = linearTable(rng, hard);
      const row = (ys: number[]) => `\\begin{array}{c|cccc} x & ${xs.join(" & ")} \\\\ \\hline y & ${ys.join(" & ")} \\end{array}`;
      const good = xs.map((v) => m * v + b);
      return mc(
        rng,
        t(`Which table gives values of the function $y = ${cx(m)} ${sg(b)}$?`, `哪个表格给出函数 $y = ${cx(m)} ${sg(b)}$ 的值？`),
        row(good),
        [row(xs.map((v) => m * v - b + 1)), row(xs.map((v) => -m * v + b)), row(xs.map((v) => (m + 1) * v + b))],
        t(
          `Substitute the inputs: for $x = ${xs[0]}$, $y = ${good[0]}$, and for $x = ${xs[1]}$, $y = ${good[1]}$. Only one table has every row on the line.`,
          `代入输入值：$x = ${xs[0]}$ 时 $y = ${good[0]}$，$x = ${xs[1]}$ 时 $y = ${good[1]}$。只有一个表格的每一行都在直线上。`,
        ),
      );
    },
  ),
  tableTips(
    "Identifying Linear Functions Corresponding to Tables",
    "识别对应表格的一次函数",
    ["linear-functions-in-tabular-form"],
    (rng, hard) => {
      const { m, b, xs, ys } = linearTable(rng, hard);
      return mc(
        rng,
        t(
          `The table shows values of the linear function $f$. Which equation defines $f$?\n${table("x", "f(x)", xs, ys)}`,
          `表格给出一次函数 $f$ 的一些值。哪个方程定义了 $f$？\n${table("x", "f(x)", xs, ys)}`,
        ),
        `f(x) = ${cx(m)} ${sg(b)}`,
        [
          `f(x) = ${cx(-m)} ${sg(b)}`,
          `f(x) = ${cx(m)} ${sg(b + m)}`,
          `f(x) = ${cx(m + 1 === 0 ? m + 2 : m + 1)} ${sg(b)}`,
          `f(x) = ${cx(m)} ${sg(b + 1)}`,
          `f(x) = ${cx(-m)} ${sg(b + 1)}`,
        ],
        t(
          `The slope is $\\frac{${ys[1]! - ys[0]!}}{${xs[1]! - xs[0]!}} = ${m}$. Using the first row, $b = ${ys[0]} - (${m})(${xs[0]}) = ${b}$.`,
          `斜率为 $\\frac{${ys[1]! - ys[0]!}}{${xs[1]! - xs[0]!}} = ${m}$。用第一行，$b = ${ys[0]} - (${m})(${xs[0]}) = ${b}$。`,
        ),
      );
    },
  ),
  tableTips("Analyzing Functions in Tabular Form", "分析表格形式的函数", ["analyzing-linear-functions-in-tabular-form"], (rng, hard) => {
    const { m, b, xs, ys } = linearTable(rng, hard);
    const a = xs[3]! + rng.int(1, 6);
    if (!hard)
      return spr(
        t(
          `The table shows values of the linear function $f$. What is the value of $f(${a})$?\n${table("x", "f(x)", xs, ys)}`,
          `表格给出一次函数 $f$ 的一些值。$f(${a})$ 的值是多少？\n${table("x", "f(x)", xs, ys)}`,
        ),
        m * a + b,
        [m * a, ys[3]! + m, a + b],
        t(
          `Each step of $1$ in $x$ changes $f$ by $${m}$. So $f(${a}) = ${ys[3]} + ${a - xs[3]!}(${m}) = ${m * a + b}$.`,
          `$x$ 每增加 $1$，$f$ 变化 $${m}$。所以 $f(${a}) = ${ys[3]} + (${a - xs[3]!})(${m}) = ${m * a + b}$。`,
        ),
      );
    return spr(
      t(
        `The table shows values of the linear function $f$. For what value of $x$ does $f(x) = ${m * a + b}$?\n${table("x", "f(x)", xs, ys)}`,
        `表格给出一次函数 $f$ 的一些值。$x$ 为何值时 $f(x) = ${m * a + b}$？\n${table("x", "f(x)", xs, ys)}`,
      ),
      a,
      [m * a + b, a + 1, xs[3]!],
      t(
        `The slope is $\\frac{${ys[1]! - ys[0]!}}{${xs[1]! - xs[0]!}} = ${m}$, and the intercept is $${b}$. Solve $${m}x ${sg(b)} = ${m * a + b}$ to get $x = ${a}$.`,
        `斜率为 $\\frac{${ys[1]! - ys[0]!}}{${xs[1]! - xs[0]!}} = ${m}$，截距为 $${b}$。解 $${m}x ${sg(b)} = ${m * a + b}$ 得 $x = ${a}$。`,
      ),
    );
  }),
  tableTips(
    "Function Tables Containing Unknown Parameters",
    "含未知参数的函数表格",
    ["linear-functions-in-tabular-form-containing-unknown-parameters"],
    (rng, hard) => {
      const { m, xs, ys } = linearTable(rng, hard);
      const show = [ys[0]!, ys[1]!, "k", ys[3]!];
      if (!hard)
        return spr(
          t(
            `The table shows values of a linear function. What is the value of $k$?\n${table("x", "y", xs, show)}`,
            `表格给出一个一次函数的一些值。$k$ 的值是多少？\n${table("x", "y", xs, show)}`,
          ),
          ys[2]!,
          [ys[1]! + 1, ys[3]! - 1, m * xs[2]!],
          t(
            `Equal steps in $x$ give equal steps in $y$ of $${m}$, so $k = ${ys[1]} ${sg(m)} = ${ys[2]}$.`,
            `$x$ 等距变化时 $y$ 每步变化 $${m}$，所以 $k = ${ys[1]} ${sg(m)} = ${ys[2]}$。`,
          ),
        );
      return spr(
        t(
          `The table shows values of a linear function. What is the value of $k$?\n${table("x", "y", xs, show)}`,
          `表格给出一个一次函数的一些值。$k$ 的值是多少？\n${table("x", "y", xs, show)}`,
        ),
        ys[2]!,
        [ys[1]! + m, Q.of(ys[1]! + ys[3]!, 2), m * xs[2]!],
        t(
          `The inputs are not evenly spaced, so use the slope $\\frac{${ys[1]! - ys[0]!}}{${xs[1]! - xs[0]!}} = ${m}$. From $x = ${xs[1]}$ to $x = ${xs[2]}$ the output changes by $${(xs[2]! - xs[1]!) * m}$, so $k = ${ys[2]}$.`,
          `输入不等距，所以用斜率 $\\frac{${ys[1]! - ys[0]!}}{${xs[1]! - xs[0]!}} = ${m}$。从 $x = ${xs[1]}$ 到 $x = ${xs[2]}$ 输出变化 $${(xs[2]! - xs[1]!) * m}$，所以 $k = ${ys[2]}$。`,
        ),
      );
    },
  ),
];
