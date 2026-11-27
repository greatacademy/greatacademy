import type { Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { cx, mc, par, sg, spec, spr, step, table, words, worked } from "../exam.ts";

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
  spec(
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
      const fu = r - k === 1 ? u : `${r - k}${u}`;
      const split = r - k === 1 ? `${value}` : `${value} \\div ${r - k} = ${a * v + c}`;
      const back = `${r} \\times ${a * v + c} - ${k} \\times ${a * v + c} = ${r * (a * v + c)} - ${k * (a * v + c)} = ${value}`;
      if (!hard)
        return mc(
          rng,
          t(
            `If $${r}${u} - ${k}${u} = ${value}$, what is the value of $${a}x ${sg(c)}$?`,
            `若 $${r}${u} - ${k}${u} = ${value}$，则 $${a}x ${sg(c)}$ 的值是多少？`,
          ),
          a * v + c,
          [v, value, Q.of(value, r + k)],
          worked(
            [
              step(
                "Factor out the binomial",
                "提出二项式",
                `Both terms contain $${u}$, so the left side is $(${r} - ${k})${u} = ${fu}$.`,
                `两项都含 $${u}$，所以左边等于 $(${r} - ${k})${u} = ${fu}$。`,
              ),
              step("Divide", "两边相除", `$${a}x ${sg(c)} = ${split}$.`, `$${a}x ${sg(c)} = ${split}$。`),
            ],
            t(`$${back}$.`, `$${back}$。`),
            [
              t(`This is $x$, not the binomial $${a}x ${sg(c)}$ the question asks for.`, `这是 $x$，不是题目问的二项式 $${a}x ${sg(c)}$。`),
              t(`This is the whole left side; it still has to be divided by $${r - k}$.`, `这是整个左边的值，还要除以 $${r - k}$。`),
              t(
                `This adds the coefficients $${r}$ and $${k}$ instead of subtracting them.`,
                `这是把系数 $${r}$ 和 $${k}$ 相加了，而不是相减。`,
              ),
            ],
          ),
        );
      return spr(
        t(`If $${r}${u} - ${k}${u} = ${value}$, what is the value of $x$?`, `若 $${r}${u} - ${k}${u} = ${value}$，则 $x$ 的值是多少？`),
        v,
        [a * v + c, a * v, Q.of(value, r - k)],
        worked(
          [
            step(
              "Factor out the binomial",
              "提出二项式",
              `$${fu} = ${value}$, so $${a}x ${sg(c)} = ${split}$.`,
              `$${fu} = ${value}$，所以 $${a}x ${sg(c)} = ${split}$。`,
            ),
            step(
              "Solve for x",
              "解出未知数",
              `$${a}x = ${a * v + c} - ${c} = ${a * v}$, so $x = ${v}$.`,
              `$${a}x = ${a * v + c} - ${c} = ${a * v}$，所以 $x = ${v}$。`,
            ),
          ],
          t(`At $x = ${v}$ the binomial is $${a * v + c}$, and $${back}$.`, `$x = ${v}$ 时二项式等于 $${a * v + c}$，而 $${back}$。`),
          [
            t(`This is the binomial $${a}x ${sg(c)}$, not $x$.`, `这是二项式 $${a}x ${sg(c)}$ 的值，不是 $x$。`),
            t(`This is $${a}x$; it still has to be divided by $${a}$.`, `这是 $${a}x$，还要除以 $${a}$。`),
            t(
              `This divides the total by $${r - k}$ and stops at the binomial before solving it.`,
              `这是只把总数除以 $${r - k}$，停在了二项式上，没有继续解。`,
            ),
          ],
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step("Distribute", "去括号", `$${a}x + ${a * b} = ${c}x + ${c * d}$.`, `$${a}x + ${a * b} = ${c}x + ${c * d}$。`),
              step(
                "Collect and solve",
                "合并并求解",
                `Subtract $${c}x$ and $${a * b}$: $${cx(a - c)} = ${c * d - a * b}$, so $x = ${v}$.`,
                `两边减去 $${c}x$ 和 $${a * b}$：$${cx(a - c)} = ${c * d - a * b}$，所以 $x = ${v}$。`,
              ),
            ],
            t(
              `$${a} \\times ${par(v + b)} = ${a * (v + b)}$ and $${c} \\times ${par(v + d)} = ${c * (v + d)}$.`,
              `$${a} \\times ${par(v + b)} = ${a * (v + b)}$，$${c} \\times ${par(v + d)} = ${c * (v + d)}$。`,
            ),
            [
              t(`This is one more than the solution; the two sides differ there.`, `它比解大 $1$；代入后两边不相等。`),
              t(`This is one less than the solution; the two sides differ there.`, `它比解小 $1$；代入后两边不相等。`),
              t(`This is two more than the solution; the two sides differ there.`, `它比解大 $2$；代入后两边不相等。`),
            ],
          ),
        );
      if (!hard)
        return mc(
          rng,
          t(`What value of $x$ satisfies $${eq}$?`, `哪个 $x$ 的值满足 $${eq}$？`),
          v,
          [Q.of(c * d + e + a * b, a - c), Q.of(c * d + e - a * b, a + c), v + 1],
          worked(
            [
              step(
                "Distribute",
                "去括号",
                `$${a}x + ${a * b} = ${c}x + ${c * d} ${sg(e)}$.`,
                `$${a}x + ${a * b} = ${c}x + ${c * d} ${sg(e)}$。`,
              ),
              step(
                "Collect and solve",
                "合并并求解",
                `Subtract $${c}x$ and $${a * b}$ from both sides: $${cx(a - c)} = ${(a - c) * v}$, so $x = ${v}$.`,
                `两边减去 $${c}x$ 和 $${a * b}$：$${cx(a - c)} = ${(a - c) * v}$，所以 $x = ${v}$。`,
              ),
            ],
            t(
              `Left: $${a} \\times ${par(v + b)} = ${a * (v + b)}$. Right: $${c} \\times ${par(v + d)} ${sg(e)} = ${c * (v + d) + e}$.`,
              `左边：$${a} \\times ${par(v + b)} = ${a * (v + b)}$。右边：$${c} \\times ${par(v + d)} ${sg(e)} = ${c * (v + d) + e}$。`,
            ),
            [
              t(`This adds $${a * b}$ to the right side instead of subtracting it.`, `这是把 $${a * b}$ 加到右边，而不是减去。`),
              t(`This adds $${c}x$ to the left side instead of subtracting it.`, `这是把 $${c}x$ 加到左边，而不是减去。`),
              t(`This is one more than the solution; the two sides differ there.`, `它比解大 $1$；代入后两边不相等。`),
            ],
          ),
        );
      const k = rng.int(2, 5);
      return spr(
        t(`If $${eq}$, what is the value of $${k}x + 1$?`, `若 $${eq}$，则 $${k}x + 1$ 的值是多少？`),
        k * v + 1,
        [v, k * v, k * (v + 1)],
        worked(
          [
            step(
              "Solve for x",
              "解出未知数",
              `Distribute: $${a}x + ${a * b} = ${c}x + ${c * d} ${sg(e)}$. Collect: $${cx(a - c)} = ${(a - c) * v}$, so $x = ${v}$.`,
              `展开：$${a}x + ${a * b} = ${c}x + ${c * d} ${sg(e)}$。合并：$${cx(a - c)} = ${(a - c) * v}$，所以 $x = ${v}$。`,
            ),
            step("Evaluate", "求值", `$${k} \\times ${par(v)} + 1 = ${k * v + 1}$.`, `$${k} \\times ${par(v)} + 1 = ${k * v + 1}$。`),
          ],
          t(
            `At $x = ${v}$ both sides equal $${a * (v + b)}$, so $x = ${v}$ is right.`,
            `$x = ${v}$ 时两边都等于 $${a * (v + b)}$，所以 $x = ${v}$ 正确。`,
          ),
          [
            t(`This is $x$, not $${k}x + 1$.`, `这是 $x$，不是 $${k}x + 1$。`),
            t(`This is $${k}x$; it forgets to add $1$.`, `这是 $${k}x$，忘了加 $1$。`),
            t(`This adds $1$ to $x$ before multiplying by $${k}$.`, `这是先给 $x$ 加 $1$，再乘以 $${k}$。`),
          ],
        ),
      );
    },
  ),
  spec(
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
        worked(
          [
            step(
              "Sort the amounts",
              "区分两种金额",
              `The $\\$${f}$ fee is paid once, so it is the constant. The rate${hard ? ` after the coupon is $${m} - ${d} = ${r}$ dollars, and it` : ` of $\\$${r}$`} is paid for each of the $n$ ${p.unit.en}, so it multiplies $n$.`,
              `$${f}$ 美元的费用只付一次，是常数。${hard ? `优惠后的单价是 $${m} - ${d} = ${r}$ 美元，` : `单价 $${r}$ 美元`}每${p.one["zh-CN"]}都要付，所以乘以 $n$。`,
            ),
            step("Write the total", "写出总额", `$${f} + ${r}n = ${T}$.`, `$${f} + ${r}n = ${T}$。`),
          ],
          t(
            `With no ${p.unit.en} at all the cost is just the fee, $\\$${f}$, and each ${p.one.en} adds $\\$${r}$, which is what $${f} + ${r}n$ says.`,
            `一${p.one["zh-CN"]}都没有时只付费用 $${f}$ 美元，每多一${p.one["zh-CN"]}多付 $${r}$ 美元，正是 $${f} + ${r}n$ 的意思。`,
          ),
          [
            t(
              `This swaps the roles: it charges the fee for each ${p.one.en} and the rate once.`,
              `这是把两者弄反了：费用按每${p.one["zh-CN"]}收，单价只收一次。`,
            ),
            t(
              `This adds the one-time fee to the rate, as if it were paid for each ${p.one.en}.`,
              `这是把一次性费用加进单价，好像每${p.one["zh-CN"]}都要付一样。`,
            ),
            t(`This multiplies the fee by $n$ and subtracts the rate.`, `这是把费用乘以 $n$，又减去了单价。`),
            t(`This uses a rate of $\\$${r + 1}$, not $\\$${r}$.`, `这是用了 $${r + 1}$ 美元的单价，而不是 $${r}$ 美元。`),
          ],
        ),
      );
    },
  ),
  spec("Modeling and Solving Problems Using Linear Equations", "用一次方程建模并求解", ["modeling-with-linear-equations"], (rng, hard) => {
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
        worked(
          [
            step(
              "Write the equation",
              "列方程",
              `The total is the fee plus the rate times $n$: $${f} + ${r}n = ${f + r * n}$.`,
              `总额是费用加上单价乘以 $n$：$${f} + ${r}n = ${f + r * n}$。`,
            ),
            step(
              "Solve",
              "解方程",
              `$${r}n = ${f + r * n} - ${f} = ${r * n}$, so $n = ${n}$.`,
              `$${r}n = ${f + r * n} - ${f} = ${r * n}$，所以 $n = ${n}$。`,
            ),
          ],
          t(
            `$${f} + ${r} \\times ${n} = ${f} + ${r * n} = ${f + r * n}$.`,
            `$${f} + ${r} \\times ${n} = ${f} + ${r * n} = ${f + r * n}$。`,
          ),
          [
            t(
              `This divides the whole charge by $${r}$ without taking off the $\\$${f}$ fee first.`,
              `这是没有先减去 $${f}$ 美元的费用，就把总额除以 $${r}$。`,
            ),
            t(`This is one ${p.one.en} too many; it would cost $\\$${r}$ more.`, `这多了一${p.one["zh-CN"]}，总额会多 $${r}$ 美元。`),
            t(
              `This divides by the fee plus the rate, as if the fee were paid for each ${p.one.en}.`,
              `这是除以费用与单价之和，好像每${p.one["zh-CN"]}都要付费用一样。`,
            ),
          ],
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
      worked(
        [
          step("Set the totals equal", "令总额相等", `$${f} + ${r}n = ${gg} + ${cx(s, "n")}$.`, `$${f} + ${r}n = ${gg} + ${cx(s, "n")}$。`),
          step(
            "Solve",
            "解方程",
            `Subtract $${cx(s, "n")}$ and $${f}$: ${c === 1 ? `$n = ${nn}$` : `$${c}n = ${gg - f}$, so $n = ${nn}$`}.`,
            `两边减去 $${cx(s, "n")}$ 和 $${f}$：${c === 1 ? `$n = ${nn}$` : `$${c}n = ${gg - f}$，所以 $n = ${nn}$`}。`,
          ),
        ],
        t(
          `Company A: $${f} + ${r} \\times ${nn} = ${f + r * nn}$. Company B: $${gg} + ${s} \\times ${nn} = ${gg + s * nn}$.`,
          `A 公司：$${f} + ${r} \\times ${nn} = ${f + r * nn}$。B 公司：$${gg} + ${s} \\times ${nn} = ${gg + s * nn}$。`,
        ),
        [
          t(`This adds $${cx(s, "n")}$ to the left side instead of subtracting it.`, `这是把 $${cx(s, "n")}$ 加到左边，而不是减去。`),
          t(`This adds $${f}$ to $${gg}$ instead of subtracting it.`, `这是把 $${f}$ 加到 $${gg}$ 上，而不是减去。`),
          t(`At one more ${p.one.en}, Company A already charges more.`, `再多一${p.one["zh-CN"]}时，A 公司的收费已经更高。`),
        ],
      ),
    );
  }),
  spec("Solving Two-Variable Linear Models", "求解二元一次模型", ["modeling-with-two-variable-linear-equations"], (rng, hard) => {
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
        worked(
          [
            step(
              "Substitute",
              "代入",
              `Put $x = ${x0}$ into the equation: $${a * x0} + ${b}y = ${T}$.`,
              `把 $x = ${x0}$ 代入方程：$${a * x0} + ${b}y = ${T}$。`,
            ),
            step(
              "Solve",
              "解方程",
              `$${b}y = ${T} - ${a * x0} = ${b * y0}$, so $y = ${y0}$.`,
              `$${b}y = ${T} - ${a * x0} = ${b * y0}$，所以 $y = ${y0}$。`,
            ),
          ],
          t(
            `$${a} \\times ${x0} + ${b} \\times ${y0} = ${a * x0} + ${b * y0} = ${T}$.`,
            `$${a} \\times ${x0} + ${b} \\times ${y0} = ${a * x0} + ${b * y0} = ${T}$。`,
          ),
          [
            t(`This is the number of ${p.a.en}, which was given.`, `这是题目已给出的${p.a["zh-CN"]}数量。`),
            t(
              `This divides the whole total by $${b}$, leaving in the sales of ${p.a.en}.`,
              `这是把整个总额除以 $${b}$，没有减去${p.a["zh-CN"]}的收入。`,
            ),
            t(`This swaps the prices, dividing by $${a}$ instead of $${b}$.`, `这是把两个单价弄反了，除以了 $${a}$ 而不是 $${b}$。`),
          ],
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
      worked(
        [
          step(
            "Find the extra money",
            "求多出的收入",
            `The extra sales bring $${a} \\times ${more} = ${a * more}$ dollars, so with the total fixed, the ${p.b.en} must bring $${a * more}$ dollars less.`,
            `多卖带来 $${a} \\times ${more} = ${a * more}$ 美元；总收入不变，所以${p.b["zh-CN"]}要少带来 $${a * more}$ 美元。`,
          ),
          step(
            "Convert to a count",
            "换算成数量",
            `Each one of the ${p.b.en} is worth $${b}$ dollars, so $y$ falls by $${a * more} \\div ${b} = ${(a * more) / b}$.`,
            `${p.b["zh-CN"]}每件值 $${b}$ 美元，所以 $y$ 减少 $${a * more} \\div ${b} = ${(a * more) / b}$。`,
          ),
        ],
        t(
          `The change in the total is $${a} \\times ${more} - ${b} \\times ${(a * more) / b} = 0$.`,
          `总收入的变化是 $${a} \\times ${more} - ${b} \\times ${(a * more) / b} = 0$。`,
        ),
        [
          t(`This trades the items one for one, ignoring that their prices differ.`, `这是按一件换一件来算，忽略了两者价格不同。`),
          t(
            `With the total fixed, more of one item means fewer of the other, so $y$ cannot increase.`,
            `总收入不变时，一种多卖，另一种就要少卖，所以 $y$ 不会增加。`,
          ),
          t(`This is the change in dollars, not in the number of ${p.b.en}.`, `这是收入的变化（美元），而不是${p.b["zh-CN"]}数量的变化。`),
        ],
      ),
    );
  }),
  spec(
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
        worked(
          [
            step(
              "Write each part",
              "写出每一部分",
              `Each kind contributes its ${hard ? "minutes" : "price"} times its count: $${A}x$ for the ${p.a.en} and $${B}y$ for the ${p.b.en}.`,
              `每一种的贡献是${hard ? "单件用时" : "单价"}乘以数量：${p.a["zh-CN"]}是 $${A}x$，${p.b["zh-CN"]}是 $${B}y$。`,
            ),
            step(
              "Match the total",
              "对应总量",
              hard
                ? `The parts are in minutes, so the total must be too: $${T} \\times 60 = ${R}$. So $${A}x + ${B}y = ${R}$.`
                : `The two parts add up to the total: $${A}x + ${B}y = ${R}$.`,
              hard
                ? `各部分以分钟计，总量也要化成分钟：$${T} \\times 60 = ${R}$。所以 $${A}x + ${B}y = ${R}$。`
                : `两部分之和等于总额：$${A}x + ${B}y = ${R}$。`,
            ),
          ],
          t(
            hard
              ? `Units: minutes per item times items is minutes, and $${R}$ minutes is $${R} \\div 60 = ${T}$ hours.`
              : `Units: dollars per item times items is dollars, matching the $\\$${R}$ total.`,
            hard
              ? `单位：每件分钟数乘以件数得分钟数，而 $${R}$ 分钟是 $${R} \\div 60 = ${T}$ 小时。`
              : `单位：每件的美元数乘以件数得美元数，与总额 $${R}$ 美元一致。`,
          ),
          [
            t(`This attaches each ${hard ? "time" : "price"} to the wrong item.`, `这是把${hard ? "用时" : "单价"}与商品对应错了。`),
            hard
              ? t(`This leaves the total in hours while the parts are in minutes.`, `这是总量仍用小时，而各部分用的是分钟。`)
              : t(`This total is $${A}$ too large; sales were $\\$${R}$.`, `这个总额多了 $${A}$；销售额是 $${R}$ 美元。`),
            t(
              `This only counts the items and ignores their ${hard ? "times" : "prices"}.`,
              `这是只数了件数，忽略了${hard ? "用时" : "单价"}。`,
            ),
          ],
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step(
                "Read each factor",
                "读出每个因数",
                `$${a}$ is the price of one of the ${p.a.en} in dollars, and $x$ is how many were sold.`,
                `$${a}$ 是一件${p.a["zh-CN"]}的价格（美元），$x$ 是卖出的数量。`,
              ),
              step(
                "Read the product",
                "读出乘积",
                `Price times number sold is the money taken in from the ${p.a.en}.`,
                `单价乘以数量就是${p.a["zh-CN"]}带来的收入。`,
              ),
            ],
            t(
              `Units: dollars per item times items gives dollars, and $${a}x$ plus the other item's $${b}y$ makes the $\\$${T}$ total.`,
              `单位：每件的美元数乘以件数得美元数，$${a}x$ 加上另一种的 $${b}y$ 就是总额 $${T}$ 美元。`,
            ),
            [
              t(`That is $x$ alone; $${a}x$ multiplies it by the price.`, `那只是 $x$；$${a}x$ 还乘了单价。`),
              t(`That is the coefficient $${a}$ alone, not the product.`, `那只是系数 $${a}$，不是乘积。`),
              t(`The total is the whole left side, $${a}x + ${b}y$.`, `总销售额是整个左边 $${a}x + ${b}y$。`),
            ],
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
        worked(
          [
            step("Read y = 0", "理解零销量", `$y = 0$ means no ${p.b.en} are sold.`, `$y = 0$ 表示一件${p.b["zh-CN"]}也没卖。`),
            step(
              "Solve for x",
              "求出另一个量",
              `Then $${a}x = ${T}$, so $x = \\frac{${T}}{${a}}$ is how many ${p.a.en} alone reach the total.`,
              `于是 $${a}x = ${T}$，$x = \\frac{${T}}{${a}}$ 是仅靠${p.a["zh-CN"]}达到总额所需的数量。`,
            ),
          ],
          t(
            `The point lies on the $x$-axis of the graph, where all the sales come from ${p.a.en}.`,
            `这个解是图像与横轴的交点，此时全部收入都来自${p.a["zh-CN"]}。`,
          ),
          [
            t(`That is the solution with $x = 0$, where no ${p.a.en} are sold.`, `那是 $x = 0$ 时的解，此时不卖${p.a["zh-CN"]}。`),
            t(`The price is the coefficient $${a}$, which does not depend on $y$.`, `单价是系数 $${a}$，与 $y$ 无关。`),
            t(`That is the coefficient $${b}$, not a solution of the equation.`, `那是系数 $${b}$，不是方程的解。`),
          ],
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step("Find what it multiplies", "看它乘以什么", `$${s}$ multiplies $x$, the number of hours.`, `$${s}$ 乘以小时数 $x$。`),
              step(
                "Read the rate",
                "读出变化率",
                `Each added hour subtracts another $${s}$ liters from $y$, so $${s}$ is the fuel used per hour.`,
                `每多运行 $1$ 小时，$y$ 就再减少 $${s}$ 升，所以 $${s}$ 是每小时的耗油量。`,
              ),
            ],
            t(
              `At $x = 0$, $y = ${start}$; at $x = 1$, $y = ${start - s}$, which is $${s}$ liters less.`,
              `$x = 0$ 时 $y = ${start}$；$x = 1$ 时 $y = ${start - s}$，少了 $${s}$ 升。`,
            ),
            [
              t(
                `The starting amount is the constant $${start}$, the value of $y$ at $x = 0$.`,
                `初始量是常数 $${start}$，即 $x = 0$ 时 $y$ 的值。`,
              ),
              t(`The hours are $x$, which can be any value; $${s}$ stays fixed.`, `运行时间是 $x$，可以取任意值；$${s}$ 是固定的。`),
              t(`The amount left depends on $x$; it is $y$, not $${s}$.`, `剩余量随 $x$ 变化，是 $y$，不是 $${s}$。`),
            ],
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
        worked(
          [
            step(
              "Read the rate",
              "读出变化率",
              `The coefficient of $x$ says each hour uses $${s}$ liters, whatever the starting amount.`,
              `$x$ 的系数表示每小时消耗 $${s}$ 升，与初始量无关。`,
            ),
            step(
              "Multiply",
              "相乘",
              `$${h}$ hours use $${h} \\times ${s} = ${s * h}$ liters.`,
              `$${h}$ 小时消耗 $${h} \\times ${s} = ${s * h}$ 升。`,
            ),
          ],
          t(
            `From $x = 0$ to $x = ${h}$, $y$ goes from $${start}$ to $${start - s * h}$, a drop of $${s * h}$.`,
            `从 $x = 0$ 到 $x = ${h}$，$y$ 从 $${start}$ 降到 $${start - s * h}$，减少了 $${s * h}$。`,
          ),
          [
            t(`This is the fuel left after the first $${h}$ hours, not the fuel used.`, `这是前 $${h}$ 小时后剩下的油量，不是消耗量。`),
            t(`This is the use in one hour only.`, `这只是 $1$ 小时的消耗量。`),
            t(`This is the starting amount of fuel.`, `这是初始油量。`),
          ],
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step(
                "Write each part",
                "写出每一部分",
                `The ${p.a.en} bring $${a}x$ dollars and the ${p.b.en} bring $${b}y$ dollars.`,
                `${p.a["zh-CN"]}带来 $${a}x$ 美元，${p.b["zh-CN"]}带来 $${b}y$ 美元。`,
              ),
              step(
                "Add the parts",
                "两部分相加",
                `Together they make the total: $${a}x + ${b}y = ${T}$.`,
                `两者之和等于总额：$${a}x + ${b}y = ${T}$。`,
              ),
            ],
            t(
              `For instance, $x = ${x0}$ and $y = ${y0}$ fit: $${a * x0} + ${b * y0} = ${T}$.`,
              `例如 $x = ${x0}$、$y = ${y0}$ 符合：$${a * x0} + ${b * y0} = ${T}$。`,
            ),
            [
              t(`This puts each price with the wrong item.`, `这是把单价与商品对应错了。`),
              t(`This counts items, not dollars, so it cannot equal a sales total.`, `这是数件数而不是算钱，不可能等于销售总额。`),
              t(`This charges every item the sum of both prices.`, `这是让每件商品都按两个单价之和收费。`),
            ],
          ),
        );
      return spr(
        t(
          `A store sold ${p.a.en} at $\\$${a}$ each and ${p.b.en} at $\\$${b}$ each, for $\\$${T}$ in all. If $${x0 + y0}$ items were sold, how many were ${p.a.en}?`,
          `商店以每件 $${a}$ 美元卖${p.a["zh-CN"]}，以每件 $${b}$ 美元卖${p.b["zh-CN"]}，共收入 $${T}$ 美元。若共卖出 $${x0 + y0}$ 件，其中${p.a["zh-CN"]}有多少件？`,
        ),
        x0,
        [y0, Q.of(T, a), x0 + y0],
        worked(
          [
            step(
              "Use one unknown",
              "只设一个未知数",
              `With $x$ ${p.a.en}, the rest are ${p.b.en}: $y = ${x0 + y0} - x$. So $${a}x + ${b}(${x0 + y0} - x) = ${T}$.`,
              `设${p.a["zh-CN"]}有 $x$ 件，其余是${p.b["zh-CN"]}：$y = ${x0 + y0} - x$。所以 $${a}x + ${b}(${x0 + y0} - x) = ${T}$。`,
            ),
            step(
              "Solve",
              "解方程",
              `$${a}x + ${b * (x0 + y0)} - ${b}x = ${T}$, so $${cx(a - b)} = ${T - b * (x0 + y0)}$ and $x = ${x0}$.`,
              `$${a}x + ${b * (x0 + y0)} - ${b}x = ${T}$，所以 $${cx(a - b)} = ${T - b * (x0 + y0)}$，$x = ${x0}$。`,
            ),
          ],
          t(
            `$${x0}$ ${p.a.en} and $${y0}$ ${p.b.en} make $${x0 + y0}$ items and $${a * x0} + ${b * y0} = ${T}$ dollars.`,
            `$${x0}$ 件${p.a["zh-CN"]}和 $${y0}$ 件${p.b["zh-CN"]}共 $${x0 + y0}$ 件，收入 $${a * x0} + ${b * y0} = ${T}$ 美元。`,
          ),
          [
            t(`This is the number of ${p.b.en}, the other item.`, `这是另一种商品${p.b["zh-CN"]}的数量。`),
            t(
              `This divides the whole total by $${a}$, as if no ${p.b.en} were sold.`,
              `这是把总额全部除以 $${a}$，好像没有卖出${p.b["zh-CN"]}。`,
            ),
            t(`This is the total number of items, not the number of ${p.a.en}.`, `这是商品的总件数，不是${p.a["zh-CN"]}的数量。`),
          ],
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step(
                "Write the perimeter",
                "写出周长",
                `With width $w$, the length is $${k}w + ${d}$, so $2(w + ${k}w + ${d}) = ${P}$.`,
                `设宽为 $w$，则长为 $${k}w + ${d}$，所以 $2(w + ${k}w + ${d}) = ${P}$。`,
              ),
              step(
                "Solve",
                "解方程",
                `Halve: $${k + 1}w + ${d} = ${P / 2}$, so $${k + 1}w = ${P / 2 - d}$ and $w = ${w}$.`,
                `两边除以 $2$：$${k + 1}w + ${d} = ${P / 2}$，所以 $${k + 1}w = ${P / 2 - d}$，$w = ${w}$。`,
              ),
            ],
            t(
              `The length is $${k} \\times ${w} + ${d} = ${l}$, and $2(${w} + ${l}) = ${P}$.`,
              `长为 $${k} \\times ${w} + ${d} = ${l}$，而 $2(${w} + ${l}) = ${P}$。`,
            ),
            [
              t(`This is the length, not the width.`, `这是长，不是宽。`),
              t(`This is half the perimeter, the length and width together.`, `这是周长的一半，即长与宽之和。`),
              t(`This treats the perimeter as if it were the length.`, `这是把周长当成了长来算。`),
            ],
          ),
        );
      return spr(
        t(
          `The length of a rectangle is $${d}$ more than $${k}$ times its width. The perimeter is $${P}$. What is the area of the rectangle?`,
          `长方形的长比宽的 $${k}$ 倍多 $${d}$。周长是 $${P}$。长方形的面积是多少？`,
        ),
        w * l,
        [w, l, P],
        worked(
          [
            step(
              "Find the sides",
              "求边长",
              `From $2(w + ${k}w + ${d}) = ${P}$: $${k + 1}w = ${P / 2 - d}$, so $w = ${w}$ and the length is $${k} \\times ${w} + ${d} = ${l}$.`,
              `由 $2(w + ${k}w + ${d}) = ${P}$：$${k + 1}w = ${P / 2 - d}$，所以 $w = ${w}$，长为 $${k} \\times ${w} + ${d} = ${l}$。`,
            ),
            step("Multiply", "求面积", `The area is $${w} \\times ${l} = ${w * l}$.`, `面积是 $${w} \\times ${l} = ${w * l}$。`),
          ],
          t(
            `The perimeter of a $${w}$ by $${l}$ rectangle is $2(${w} + ${l}) = ${P}$.`,
            `宽 $${w}$、长 $${l}$ 的长方形周长是 $2(${w} + ${l}) = ${P}$。`,
          ),
          [
            t(`This is the width; the question asks for the area.`, `这是宽；题目问的是面积。`),
            t(`This is the length; the question asks for the area.`, `这是长；题目问的是面积。`),
            t(`This is the perimeter, which was given.`, `这是题目给出的周长。`),
          ],
        ),
      );
    },
  ),
  spec("Evaluating Linear Functions", "求一次函数的值", ["introduction-to-functions"], (rng, hard) => {
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
        worked(
          [
            step(
              "Substitute",
              "代入",
              `Replace $x$ with $${a}$: $f(${a}) = ${m} \\times ${a} ${sg(b)}$.`,
              `用 $${a}$ 替换 $x$：$f(${a}) = ${m} \\times ${a} ${sg(b)}$。`,
            ),
            step("Compute", "计算", `$${m * a} ${sg(b)} = ${m * a + b}$.`, `$${m * a} ${sg(b)} = ${m * a + b}$。`),
          ],
          t(
            `Going back, ${b === 0 ? "" : `$${m * a + b} ${sg(-b)} = ${m * a}$ and `}$${m * a} \\div ${par(m)} = ${a}$, the input.`,
            `倒推：${b === 0 ? "" : `$${m * a + b} ${sg(-b)} = ${m * a}$，而 `}$${m * a} \\div ${par(m)} = ${a}$，正是输入。`,
          ),
          [
            t(`This adds $${m}$ and $${a}$ instead of multiplying them.`, `这是把 $${m}$ 和 $${a}$ 相加了，而不是相乘。`),
            t(`This uses the constant with the opposite sign.`, `这是把常数的符号弄反了。`),
            (a - b) / m === Math.floor((a - b) / m)
              ? t(`This solves $f(x) = ${a}$ instead of putting $${a}$ in for $x$.`, `这是解了 $f(x) = ${a}$，而不是把 $${a}$ 代入 $x$。`)
              : t(`This leaves out the constant.`, `这是漏掉了常数项。`),
          ],
        ),
      );
    const c = a + rng.int(1, 5);
    return spr(
      t(
        `The function $f$ is defined by $${f}$. What is the value of $f(${c}) - f(${a})$?`,
        `函数 $f$ 定义为 $${f}$。$f(${c}) - f(${a})$ 的值是多少？`,
      ),
      m * (c - a),
      [m * c + b, c - a, m * (c - a) + b],
      worked(
        [
          step(
            "Subtract the outputs",
            "两个输出相减",
            `$f(${c}) - f(${a}) = (${m} \\times ${c} ${sg(b)}) - (${m} \\times ${a} ${sg(b)})$, and the constant cancels.`,
            `$f(${c}) - f(${a}) = (${m} \\times ${c} ${sg(b)}) - (${m} \\times ${a} ${sg(b)})$，常数相消。`,
          ),
          step(
            "Use the slope",
            "用斜率",
            `What is left is the slope times the change in input: $${m} \\times (${c} - ${a}) = ${m * (c - a)}$.`,
            `剩下的是斜率乘以输入的变化量：$${m} \\times (${c} - ${a}) = ${m * (c - a)}$。`,
          ),
        ],
        t(
          `$f(${c}) = ${m * c + b}$ and $f(${a}) = ${m * a + b}$, and $${m * c + b} - ${par(m * a + b)} = ${m * (c - a)}$.`,
          `$f(${c}) = ${m * c + b}$，$f(${a}) = ${m * a + b}$，而 $${m * c + b} - ${par(m * a + b)} = ${m * (c - a)}$。`,
        ),
        [
          t(`This is $f(${c})$ alone, without subtracting $f(${a})$.`, `这只是 $f(${c})$，没有减去 $f(${a})$。`),
          t(`This is the change in input; it still has to be multiplied by the slope $${m}$.`, `这是输入的变化量，还要乘以斜率 $${m}$。`),
          t(`This keeps the constant, which cancels in the difference.`, `这是保留了常数，而它在相减时已经抵消。`),
        ],
      ),
    );
  }),
  spec("Working With Function Composition", "函数复合运算", ["function-composition"], (rng, hard) => {
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
        worked(
          [
            step(
              "Work from the inside",
              "由内向外",
              `$g(${a}) = ${n} \\times ${a} ${sg(c)} = ${inner}$.`,
              `$g(${a}) = ${n} \\times ${a} ${sg(c)} = ${inner}$。`,
            ),
            step(
              "Apply f",
              "再代入外层函数",
              `$f(${inner}) = ${m} \\times ${par(inner)} ${sg(b)} = ${ans}$.`,
              `$f(${inner}) = ${m} \\times ${par(inner)} ${sg(b)} = ${ans}$。`,
            ),
          ],
          t(
            `The formula $f(g(x)) = ${m * n}x ${sg(m * c + b)}$ at $x = ${a}$ gives $${m * n * a} ${sg(m * c + b)} = ${ans}$.`,
            `由公式 $f(g(x)) = ${m * n}x ${sg(m * c + b)}$，$x = ${a}$ 时得 $${m * n * a} ${sg(m * c + b)} = ${ans}$。`,
          ),
          [
            t(`This is $g(f(${a}))$: the functions are applied in the wrong order.`, `这是 $g(f(${a}))$：两个函数的顺序弄反了。`),
            t(`This adds $f(${a})$ and $g(${a})$ instead of composing.`, `这是把 $f(${a})$ 与 $g(${a})$ 相加，而不是复合。`),
            t(`This is $g(${a})$; $f$ still has to be applied to it.`, `这是 $g(${a})$，还要再代入 $f$。`),
          ],
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
      worked(
        [
          step(
            "Substitute",
            "代入",
            `Put $g(x)$ in for $x$ in $f$: $f(g(x)) = ${m}(${n}x ${sg(c)}) ${sg(b)}$.`,
            `把 $f$ 中的 $x$ 换成 $g(x)$：$f(g(x)) = ${m}(${n}x ${sg(c)}) ${sg(b)}$。`,
          ),
          step(
            "Distribute and combine",
            "展开并合并",
            `$${out}x ${sg(m * c)} ${sg(b)} = ${out}x ${sg(cst)}$.`,
            `$${out}x ${sg(m * c)} ${sg(b)} = ${out}x ${sg(cst)}$。`,
          ),
        ],
        t(
          `At $x = 0$: $g(0) = ${c}$ and $f(${c}) = ${m} \\times ${par(c)} ${sg(b)} = ${cst}$, the constant term.`,
          `取 $x = 0$：$g(0) = ${c}$，而 $f(${c}) = ${m} \\times ${par(c)} ${sg(b)} = ${cst}$，正是常数项。`,
        ),
        [
          t(`This is $g(f(x))$, which applies the functions in the other order.`, `这是 $g(f(x))$，两个函数的顺序反了。`),
          t(`This adds $f(x)$ and $g(x)$ instead of composing them.`, `这是把 $f(x)$ 与 $g(x)$ 相加，而不是复合。`),
          t(`This forgets to multiply the $${c}$ inside by $${m}$.`, `这是忘了把括号里的 $${c}$ 乘以 $${m}$。`),
          t(
            `The constant is one off: $${m} \\times ${par(c)} ${sg(b)} = ${cst}$.`,
            `常数项差了 $1$：$${m} \\times ${par(c)} ${sg(b)} = ${cst}$。`,
          ),
          t(`This adds the slopes $${m}$ and $${n}$; composing multiplies them.`, `这是把斜率 $${m}$ 和 $${n}$ 相加了；复合时应相乘。`),
          t(
            `The slope of a composition is the product $${m} \\times ${n} = ${out}$.`,
            `复合函数的斜率是乘积 $${m} \\times ${n} = ${out}$。`,
          ),
          t(`Both parts are off: the slope is $${out}$ and the constant $${cst}$.`, `两部分都不对：斜率是 $${out}$，常数是 $${cst}$。`),
        ],
      ),
    );
  }),
  spec(
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
        worked(
          [
            step(
              "Substitute the inputs",
              "代入输入值",
              `For $x = ${xs[0]}$, $y = ${good[0]}$, and for $x = ${xs[1]}$, $y = ${good[1]}$.`,
              `$x = ${xs[0]}$ 时 $y = ${good[0]}$，$x = ${xs[1]}$ 时 $y = ${good[1]}$。`,
            ),
            step(
              "Compare the tables",
              "比较各表",
              `Only one table has these outputs, and its other entries $${good[2]}$ and $${good[3]}$ fit too.`,
              `只有一个表格有这些输出，它的另外两个值 $${good[2]}$ 和 $${good[3]}$ 也符合。`,
            ),
          ],
          t(
            `In that table $y$ changes by $${m * (xs[1]! - xs[0]!)}$ when $x$ goes from $${xs[0]}$ to $${xs[1]}$, which is the slope $${m}$ times $${xs[1]! - xs[0]!}$.`,
            `在该表中，$x$ 从 $${xs[0]}$ 变到 $${xs[1]}$ 时 $y$ 变化 $${m * (xs[1]! - xs[0]!)}$，正是斜率 $${m}$ 乘以 $${xs[1]! - xs[0]!}$。`,
          ),
          [
            t(`This table uses the constant with the opposite sign, shifted by one.`, `这个表格把常数的符号弄反了，还差了 $1$。`),
            t(`This table has the slope with the opposite sign.`, `这个表格的斜率符号反了。`),
            t(`This table has a slope of $${m + 1}$ instead of $${m}$.`, `这个表格的斜率是 $${m + 1}$，而不是 $${m}$。`),
          ],
        ),
      );
    },
  ),
  spec(
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
        worked(
          [
            step(
              "Find the slope",
              "求斜率",
              `Between the first two columns, $\\frac{${ys[1]!} - ${par(ys[0]!)}}{${xs[1]!} - ${xs[0]!}} = ${m}$.`,
              `由前两列，$\\frac{${ys[1]!} - ${par(ys[0]!)}}{${xs[1]!} - ${xs[0]!}} = ${m}$。`,
            ),
            step(
              "Find the intercept",
              "求截距",
              `Using the first column, $b = ${ys[0]} - ${par(m)} \\times ${xs[0]} = ${b}$.`,
              `用第一列，$b = ${ys[0]} - ${par(m)} \\times ${xs[0]} = ${b}$。`,
            ),
          ],
          t(
            `The last column fits: $${par(m)} \\times ${xs[3]} ${sg(b)} = ${ys[3]}$.`,
            `最后一列也符合：$${par(m)} \\times ${xs[3]} ${sg(b)} = ${ys[3]}$。`,
          ),
          [
            t(
              `This has the slope with the opposite sign; the outputs ${m > 0 ? "rise" : "fall"} as $x$ grows.`,
              `这个斜率符号反了；$x$ 增大时输出${m > 0 ? "增大" : "减小"}。`,
            ),
            t(
              `This adds the slope to the intercept; at $x = 0$ the output is $${b}$.`,
              `这是把斜率加到了截距上；$x = 0$ 时输出是 $${b}$。`,
            ),
            t(`This slope is off: each step of $1$ in $x$ changes $f$ by $${m}$.`, `这个斜率不对：$x$ 每增加 $1$，$f$ 变化 $${m}$。`),
            t(`This intercept is one off: $b = ${b}$.`, `这个截距差了 $1$：$b = ${b}$。`),
            t(`Both the sign of the slope and the intercept are off.`, `斜率的符号和截距都不对。`),
          ],
        ),
      );
    },
  ),
  spec("Analyzing Functions in Tabular Form", "分析表格形式的函数", ["analyzing-linear-functions-in-tabular-form"], (rng, hard) => {
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
        worked(
          [
            step(
              "Read the rate",
              "读出变化率",
              `Each step of $1$ in $x$ changes $f$ by $${ys[1]! - ys[0]!}$, so the slope is $${m}$.`,
              `$x$ 每增加 $1$，$f$ 变化 $${ys[1]! - ys[0]!}$，所以斜率是 $${m}$。`,
            ),
            step(
              "Extend the table",
              "延伸表格",
              `From $x = ${xs[3]}$ to $x = ${a}$ is $${a - xs[3]!}$ ${a - xs[3]! === 1 ? "step" : "steps"}: $f(${a}) = ${ys[3]} + ${a - xs[3]!} \\times ${par(m)} = ${m * a + b}$.`,
              `从 $x = ${xs[3]}$ 到 $x = ${a}$ 共 $${a - xs[3]!}$ 步：$f(${a}) = ${ys[3]} + ${a - xs[3]!} \\times ${par(m)} = ${m * a + b}$。`,
            ),
          ],
          t(
            `The rule is $f(x) = ${cx(m)} ${sg(b)}$, and $${par(m)} \\times ${a} ${sg(b)} = ${m * a + b}$.`,
            `规则是 $f(x) = ${cx(m)} ${sg(b)}$，而 $${par(m)} \\times ${a} ${sg(b)} = ${m * a + b}$。`,
          ),
          [
            t(`This uses the slope but leaves out the starting value $${b}$.`, `这是只用了斜率，漏掉了初始值 $${b}$。`),
            t(`This takes only one step past the table, not $${a - xs[3]!}$.`, `这是只往后走了一步，而不是 $${a - xs[3]!}$ 步。`),
            t(`This adds the input to the intercept instead of multiplying it by the slope.`, `这是把输入加到截距上，而不是乘以斜率。`),
          ],
        ),
      );
    return spr(
      t(
        `The table shows values of the linear function $f$. For what value of $x$ does $f(x) = ${m * a + b}$?\n${table("x", "f(x)", xs, ys)}`,
        `表格给出一次函数 $f$ 的一些值。$x$ 为何值时 $f(x) = ${m * a + b}$？\n${table("x", "f(x)", xs, ys)}`,
      ),
      a,
      [m * a + b, a + 1, xs[3]!],
      worked(
        [
          step(
            "Find the rule",
            "求出规则",
            `The slope is $\\frac{${ys[1]!} - ${par(ys[0]!)}}{${xs[1]!} - ${xs[0]!}} = ${m}$, and $b = ${ys[0]} - ${par(m)} \\times ${xs[0]} = ${b}$, so $f(x) = ${cx(m)} ${sg(b)}$.`,
            `斜率为 $\\frac{${ys[1]!} - ${par(ys[0]!)}}{${xs[1]!} - ${xs[0]!}} = ${m}$，$b = ${ys[0]} - ${par(m)} \\times ${xs[0]} = ${b}$，所以 $f(x) = ${cx(m)} ${sg(b)}$。`,
          ),
          step(
            "Solve",
            "解方程",
            `$${cx(m)} ${sg(b)} = ${m * a + b}$ gives $${cx(m)} = ${m * a}$, so $x = ${a}$.`,
            `由 $${cx(m)} ${sg(b)} = ${m * a + b}$ 得 $${cx(m)} = ${m * a}$，所以 $x = ${a}$。`,
          ),
        ],
        t(`$f(${a}) = ${par(m)} \\times ${a} ${sg(b)} = ${m * a + b}$.`, `$f(${a}) = ${par(m)} \\times ${a} ${sg(b)} = ${m * a + b}$。`),
        [
          t(`This is the output; the question asks for the input $x$.`, `这是输出值；题目问的是输入 $x$。`),
          t(
            `At this input the output is $${m * (a + 1) + b}$, one slope away from the target.`,
            `这个输入对应的输出是 $${m * (a + 1) + b}$，与目标差一个斜率。`,
          ),
          t(`This is the last input in the table, where the output is $${ys[3]}$.`, `这是表中最后一个输入，它的输出是 $${ys[3]}$。`),
        ],
      ),
    );
  }),
  spec(
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
          worked(
            [
              step(
                "Find the step",
                "求每步的变化",
                `The inputs go up by $1$, so the outputs change by the same amount each time: $${ys[1]} - ${par(ys[0]!)} = ${m}$.`,
                `输入每次增加 $1$，输出每次变化相同：$${ys[1]} - ${par(ys[0]!)} = ${m}$。`,
              ),
              step("Fill the gap", "补上空缺", `$k = ${ys[1]} ${sg(m)} = ${ys[2]}$.`, `$k = ${ys[1]} ${sg(m)} = ${ys[2]}$。`),
            ],
            t(
              `One more step reaches the last entry: $${ys[2]} ${sg(m)} = ${ys[3]}$.`,
              `再走一步就到最后一个值：$${ys[2]} ${sg(m)} = ${ys[3]}$。`,
            ),
            [
              t(
                `This adds $1$ to the previous output, the step in $x$ rather than in $y$.`,
                `这是给前一个输出加 $1$，用的是 $x$ 的步长而不是 $y$ 的。`,
              ),
              t(
                `This subtracts $1$ from the next output instead of the step $${m}$.`,
                `这是从后一个输出减 $1$，而不是减去每步的变化 $${m}$。`,
              ),
              t(`This multiplies the slope by the input but leaves out the intercept.`, `这是用斜率乘以输入，却漏掉了截距。`),
            ],
          ),
        );
      return spr(
        t(
          `The table shows values of a linear function. What is the value of $k$?\n${table("x", "y", xs, show)}`,
          `表格给出一个一次函数的一些值。$k$ 的值是多少？\n${table("x", "y", xs, show)}`,
        ),
        ys[2]!,
        [ys[1]! + m, Q.of(ys[1]! + ys[3]!, 2), m * xs[2]!],
        worked(
          [
            step(
              "Find the slope",
              "求斜率",
              `The inputs are not evenly spaced, so use the slope: $\\frac{${ys[1]!} - ${par(ys[0]!)}}{${xs[1]!} - ${xs[0]!}} = ${m}$.`,
              `输入不等距，所以用斜率：$\\frac{${ys[1]!} - ${par(ys[0]!)}}{${xs[1]!} - ${xs[0]!}} = ${m}$。`,
            ),
            step(
              "Move along the line",
              "沿直线移动",
              `From $x = ${xs[1]}$ to $x = ${xs[2]}$ the output changes by $${xs[2]! - xs[1]!} \\times ${par(m)} = ${(xs[2]! - xs[1]!) * m}$, so $k = ${ys[1]} ${sg((xs[2]! - xs[1]!) * m)} = ${ys[2]}$.`,
              `从 $x = ${xs[1]}$ 到 $x = ${xs[2]}$，输出变化 $${xs[2]! - xs[1]!} \\times ${par(m)} = ${(xs[2]! - xs[1]!) * m}$，所以 $k = ${ys[1]} ${sg((xs[2]! - xs[1]!) * m)} = ${ys[2]}$。`,
            ),
          ],
          t(
            `From $k$ to the last entry: $${ys[2]} + ${xs[3]! - xs[2]!} \\times ${par(m)} = ${ys[3]}$.`,
            `从 $k$ 到最后一个值：$${ys[2]} + ${xs[3]! - xs[2]!} \\times ${par(m)} = ${ys[3]}$。`,
          ),
          [
            t(
              `This moves one slope from the previous entry, as if the inputs were evenly spaced.`,
              `这是从前一个值只加了一个斜率，好像输入是等距的。`,
            ),
            t(`This averages the neighbors, which works only for evenly spaced inputs.`, `这是取相邻两值的平均数，只有输入等距时才成立。`),
            t(`This multiplies the slope by the input but leaves out the intercept.`, `这是用斜率乘以输入，却漏掉了截距。`),
          ],
        ),
      );
    },
  ),
];
