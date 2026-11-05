import { t } from "@ga/content";

import type { ExamSpec } from "../exam.ts";
import { curveFigure, mc, mcExact, sg, spec, spr, words } from "../exam.ts";

// SAT Math Prep, Advanced Math: exponential functions and models, nonlinear equations, multivariable equations, graphs and nonlinear systems.

/** satExamAdvanced3 are the exam-style questions on exponential functions, nonlinear equations, multivariable equations, graphs and nonlinear systems. */
export const satExamAdvanced3: ExamSpec[] = [
  spec("Exponential Functions", "指数函数", ["exponential-functions"], (rng, hard) => {
    const [a, b, n] = [rng.int(2, 9), rng.int(2, 4), rng.int(2, 4)];
    if (!hard)
      return mc(
        rng,
        t(`If $f(x) = ${a}(${b})^x$, what is the value of $f(${n})$?`, `若 $f(x) = ${a}(${b})^x$，则 $f(${n})$ 的值是多少？`),
        a * b ** n,
        [(a * b) ** n, a * b * n, a + b ** n],
        t(
          `Apply the power before multiplying: $${a} \\cdot ${b ** n} = ${a * b ** n}$.`,
          `先算幂再相乘：$${a} \\cdot ${b ** n} = ${a * b ** n}$。`,
        ),
      );
    return spr(
      t(
        `The function $f(x) = ${a}(${b})^x$ satisfies $f(k) = ${a * b ** n}$. What is the value of $k$?`,
        `函数 $f(x) = ${a}(${b})^x$ 满足 $f(k) = ${a * b ** n}$。$k$ 的值是多少？`,
      ),
      n,
      [b ** n, n + 1, a * n],
      t(`Divide by $${a}$: $${b}^k = ${b ** n}$, so $k = ${n}$.`, `除以 $${a}$：$${b}^k = ${b ** n}$，所以 $k = ${n}$。`),
    );
  }),
  spec("Maxima and Minima of Exponential Functions", "指数函数的最大值和最小值", ["extrema-of-exponential-functions"], (rng, hard) => {
    const [a, b, lo, hi] = [rng.int(2, 6), rng.int(2, 3), 0, rng.int(2, 4)];
    if (!hard)
      return mc(
        rng,
        t(
          `What is the greatest value of $f(x) = ${a}(${b})^x$ for $${lo} \\le x \\le ${hi}$?`,
          `当 $${lo} \\le x \\le ${hi}$ 时，$f(x) = ${a}(${b})^x$ 的最大值是多少？`,
        ),
        a * b ** hi,
        [a, a * b, (a * b) ** hi],
        t(
          `With $${b} > 1$ the function increases, so the greatest value is at $x = ${hi}$: $${a * b ** hi}$.`,
          `因为 $${b} > 1$，函数递增，所以最大值在 $x = ${hi}$ 处：$${a * b ** hi}$。`,
        ),
      );
    return spr(
      t(
        `What is the least value of $f(x) = ${a * b ** hi}\\left(\\frac{1}{${b}}\\right)^x$ for $0 \\le x \\le ${hi}$?`,
        `当 $0 \\le x \\le ${hi}$ 时，$f(x) = ${a * b ** hi}\\left(\\frac{1}{${b}}\\right)^x$ 的最小值是多少？`,
      ),
      a,
      [a * b ** hi, a * b, 0],
      t(
        `With a base below 1 the function decreases, so the least value is at $x = ${hi}$: $\\frac{${a * b ** hi}}{${b ** hi}} = ${a}$.`,
        `底数小于 1 时函数递减，所以最小值在 $x = ${hi}$ 处：$\\frac{${a * b ** hi}}{${b ** hi}} = ${a}$。`,
      ),
    );
  }),
  spec(
    "Exponential Functions Containing Unknown Parameters",
    "含未知参数的指数函数",
    ["determining-unknown-parameters-in-exponential-functions"],
    (rng, hard) => {
      const [a, b] = [rng.int(2, 9), rng.int(2, 5)];
      if (!hard)
        return spr(
          t(
            `The function $f(x) = a(${b})^x$ has $f(1) = ${a * b}$, where $a$ is a constant. What is the value of $a$?`,
            `函数 $f(x) = a(${b})^x$ 满足 $f(1) = ${a * b}$，其中 $a$ 是常数。$a$ 的值是多少？`,
          ),
          a,
          [a * b, a * b * b, b],
          t(`Substitute: $a \\cdot ${b} = ${a * b}$, so $a = ${a}$.`, `代入：$a \\cdot ${b} = ${a * b}$，所以 $a = ${a}$。`),
        );
      return spr(
        t(
          `The function $f(x) = ab^x$, with $b > 0$, has $f(0) = ${a}$ and $f(2) = ${a * b * b}$. What is the value of $b$?`,
          `函数 $f(x) = ab^x$（$b > 0$）满足 $f(0) = ${a}$，$f(2) = ${a * b * b}$。$b$ 的值是多少？`,
        ),
        b,
        [b * b, a, a * b],
        t(
          `$f(0) = a = ${a}$. Then $${a}b^2 = ${a * b * b}$ gives $b^2 = ${b * b}$, so $b = ${b}$.`,
          `$f(0) = a = ${a}$。于是 $${a}b^2 = ${a * b * b}$ 得 $b^2 = ${b * b}$，所以 $b = ${b}$。`,
        ),
      );
    },
  ),
  spec(
    "Constructing Exponential Functions From Descriptions",
    "根据描述构造指数函数",
    ["modeling-exponential-growth-with-functions"],
    (rng, hard) => {
      const [a, b] = [rng.int(2, 20), rng.int(2, 5)];
      const p = rng.pick([2, 3, 4, 5]);
      if (!hard)
        return mc(
          rng,
          t(
            `A quantity starts at $${a}$ and is multiplied by $${b}$ each step. Which function gives the quantity after $x$ steps?`,
            `某量从 $${a}$ 开始，每一步乘以 $${b}$。哪个函数给出 $x$ 步后的量？`,
          ),
          `f(x) = ${a}(${b})^x`,
          [`f(x) = ${b}(${a})^x`, `f(x) = ${a} + ${b}x`, `f(x) = ${a}x^${b}`, `f(x) = (${a * b})^x`],
          t(`The start is the coefficient and the repeated factor is the base.`, `起始值是系数，重复的倍数是底数。`),
        );
      return mc(
        rng,
        t(
          `A quantity starts at $${a}$ and is multiplied by $${b}$ every $${p}$ hours. Which function gives the quantity after $t$ hours?`,
          `某量从 $${a}$ 开始，每 $${p}$ 小时乘以 $${b}$。哪个函数给出 $t$ 小时后的量？`,
        ),
        `f(t) = ${a}(${b})^{t/${p}}`,
        [`f(t) = ${a}(${b})^{${p}t}`, `f(t) = ${a}(${b * p})^{t}`, `f(t) = ${a}(${b})^{t}`, `f(t) = ${p}(${b})^{t/${a}}`],
        t(
          `The number of multiplications after $t$ hours is $\\frac{t}{${p}}$, so that is the exponent.`,
          `$t$ 小时内乘了 $\\frac{t}{${p}}$ 次，所以这就是指数。`,
        ),
      );
    },
  ),
  spec("Exponential Functions Expressed in Equivalent Forms", "指数函数的等价形式", ["sat-exponential-model-rewriting"], (rng, hard) => {
    const [a, b, k] = [rng.int(2, 9), rng.int(2, 5), rng.int(2, 4)];
    if (!hard)
      return mc(
        rng,
        t(`Which function is equivalent to $f(x) = ${a}(${b})^{${k}x}$?`, `哪个函数与 $f(x) = ${a}(${b})^{${k}x}$ 等价？`),
        `f(x) = ${a}(${b ** k})^x`,
        [
          `f(x) = ${a * b}(${b})^{x}`,
          `f(x) = ${a}(${b * k})^x`,
          `f(x) = ${a ** k}(${b})^x`,
          `f(x) = ${a}(${b + k})^x`,
          `f(x) = ${a + 1}(${b ** k})^x`,
          `f(x) = ${a}(${b ** k + 1})^x`,
        ],
        t(
          `By the power law, $${b}^{${k}x} = (${b}^{${k}})^x = ${b ** k}^x$.`,
          `由幂的法则，$${b}^{${k}x} = (${b}^{${k}})^x = ${b ** k}^x$。`,
        ),
      );
    return spr(
      t(
        `The function $f(x) = ${a}(${b})^{x + ${k}}$ can be written as $f(x) = c(${b})^x$. What is the value of $c$?`,
        `函数 $f(x) = ${a}(${b})^{x + ${k}}$ 可写成 $f(x) = c(${b})^x$。$c$ 的值是多少？`,
      ),
      a * b ** k,
      [a, a * k, a + b ** k],
      t(
        `Split the exponent: $${b}^{x + ${k}} = ${b}^x \\cdot ${b ** k}$. So $c = ${a} \\cdot ${b ** k} = ${a * b ** k}$.`,
        `拆开指数：$${b}^{x + ${k}} = ${b}^x \\cdot ${b ** k}$。所以 $c = ${a} \\cdot ${b ** k} = ${a * b ** k}$。`,
      ),
    );
  }),
  spec("Constructing Exponential Growth Models", "构造指数增长模型", ["modeling-exponential-growth-with-functions"], (rng, hard) => {
    const a = rng.pick([200, 500, 800, 1000, 1500]);
    const r = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15]);
    const f = (100 + r) / 100;
    if (!hard)
      return mc(
        rng,
        t(
          `A town has $${a}$ residents, and its population grows by $${r}\\%$ per year. Which function gives the population $t$ years from now?`,
          `某镇有 $${a}$ 名居民，人口每年增长 $${r}\\%$。哪个函数给出 $t$ 年后的人口？`,
        ),
        `P(t) = ${a}(${f})^t`,
        [
          `P(t) = ${a}(${(100 - r) / 100})^t`,
          `P(t) = ${a}(0.${String(r).padStart(2, "0")})^t`,
          `P(t) = ${a} + ${r}t`,
          `P(t) = ${a}(${r})^t`,
        ],
        t(`Keeping the whole and adding $${r}\\%$ multiplies by $${f}$ each year.`, `保留全部再增加 $${r}\\%$，相当于每年乘以 $${f}$。`),
      );
    return spr(
      t(
        `An account opens with $\\$${a}$ and earns $${r}\\%$ interest per year, compounded yearly. To the nearest dollar, how much is in the account after $2$ years?`,
        `某账户存入 $\\$${a}$，年利率 $${r}\\%$，按年复利。$2$ 年后账户约有多少美元（精确到美元）？`,
      ),
      Math.round(a * f * f),
      [a + 2 * Math.round((a * r) / 100), Math.round(a * f), Math.round(a * f * f) + 10],
      t(
        `Multiply by $${f}$ twice: $${a}(${f})^2 \\approx ${Math.round(a * f * f)}$.`,
        `乘以 $${f}$ 两次：$${a}(${f})^2 \\approx ${Math.round(a * f * f)}$。`,
      ),
    );
  }),
  spec("Constructing Exponential Decay Models", "构造指数衰减模型", ["modeling-exponential-decay-with-functions"], (rng, hard) => {
    const a = rng.pick([400, 800, 1600, 2400, 3200]);
    const r = rng.pick([5, 10, 15, 20, 25, 30]);
    const f = (100 - r) / 100;
    if (!hard)
      return mc(
        rng,
        t(
          `A car worth $\\$${a * 10}$ loses $${r}\\%$ of its value each year. Which function gives its value $t$ years from now?`,
          `一辆价值 $\\$${a * 10}$ 的汽车每年贬值 $${r}\\%$。哪个函数给出 $t$ 年后的价值？`,
        ),
        `V(t) = ${a * 10}(${f})^t`,
        [
          `V(t) = ${a * 10}(0.${String(r).padStart(2, "0")})^t`,
          `V(t) = ${a * 10}(${(100 + r) / 100})^t`,
          `V(t) = ${a * 10} - ${r}t`,
          `V(t) = ${r}(${a * 10})^t`,
        ],
        t(
          `Losing $${r}\\%$ leaves $${100 - r}\\%$, so the factor is $${f}$.`,
          `减少 $${r}\\%$ 后剩下 $${100 - r}\\%$，所以倍数是 $${f}$。`,
        ),
      );
    return spr(
      t(
        `A sample of $${a}$ grams has a half-life of $${r}$ days. How many grams remain after $${3 * r}$ days?`,
        `$${a}$ 克样品的半衰期是 $${r}$ 天。$${3 * r}$ 天后还剩多少克？`,
      ),
      a / 8,
      [(3 * a) / 8, a / 2, a / 4],
      t(
        `$${3 * r}$ days is $3$ half-lives: $${a} \\cdot \\left(\\frac{1}{2}\\right)^3 = ${a / 8}$.`,
        `$${3 * r}$ 天是 $3$ 个半衰期：$${a} \\cdot \\left(\\frac{1}{2}\\right)^3 = ${a / 8}$。`,
      ),
    );
  }),
  spec(
    "Determining Unknown Parameters in Exponential Models",
    "确定指数模型中的未知参数",
    ["solving-exponential-growth-problems"],
    (rng, hard) => {
      const [a, b] = [rng.int(1, 12) * 50, rng.int(2, 4)];
      if (!hard)
        return spr(
          t(
            `A culture modeled by $N(t) = a(${b})^t$ has $${a * b}$ cells after $1$ hour. How many cells did it start with?`,
            `模型 $N(t) = a(${b})^t$ 描述的细菌培养物 $1$ 小时后有 $${a * b}$ 个细胞。开始时有多少个细胞？`,
          ),
          a,
          [a * b, a * b * b, b],
          t(`Substitute: $a \\cdot ${b} = ${a * b}$, so $a = ${a}$.`, `代入：$a \\cdot ${b} = ${a * b}$，所以 $a = ${a}$。`),
        );
      return spr(
        t(
          `A culture modeled by $N(t) = ${a}b^t$ grows from $${a}$ cells to $${a * b * b}$ cells in $2$ hours, with $b > 0$. What is the value of $b$?`,
          `模型 $N(t) = ${a}b^t$ 描述的培养物在 $2$ 小时内从 $${a}$ 个细胞增长到 $${a * b * b}$ 个，$b > 0$。$b$ 的值是多少？`,
        ),
        b,
        [b * b, a, 2 * b],
        t(
          `$${a}b^2 = ${a * b * b}$ gives $b^2 = ${b * b}$, so $b = ${b}$.`,
          `$${a}b^2 = ${a * b * b}$ 得 $b^2 = ${b * b}$，所以 $b = ${b}$。`,
        ),
      );
    },
  ),
  spec("Interpreting Exponential Models", "解释指数模型", ["interpreting-exponential-growth"], (rng, hard) => {
    const a = rng.pick([120, 180, 240, 300, 450, 600, 700, 900]);
    const r = rng.pick([4, 6, 8, 12, 20]);
    const f = (100 + r) / 100;
    if (!hard)
      return words(
        rng,
        t(
          `The number of members of a club $t$ years after it opened is $M(t) = ${a}(${f})^t$. What does $${a}$ represent?`,
          `某俱乐部成立 $t$ 年后的会员数为 $M(t) = ${a}(${f})^t$。$${a}$ 表示什么？`,
        ),
        t("The number of members when the club opened", "俱乐部成立时的会员数"),
        [
          t(`The number of new members each year`, "每年新增的会员数"),
          t("The number of members after one year", "一年后的会员数"),
          t("The greatest number of members", "最多的会员数"),
        ],
        t(`At $t = 0$ the power equals $1$, so $M(0) = ${a}$.`, `当 $t = 0$ 时幂等于 $1$，所以 $M(0) = ${a}$。`),
      );
    return words(
      rng,
      t(
        `The number of members of a club $t$ years after it opened is $M(t) = ${a}(${f})^t$. Which statement describes the change in membership?`,
        `某俱乐部成立 $t$ 年后的会员数为 $M(t) = ${a}(${f})^t$。哪个说法描述了会员数的变化？`,
      ),
      t(`It increases by $${r}\\%$ each year.`, `每年增长 $${r}\\%$。`),
      [
        t(`It increases by $${r}$ members each year.`, `每年增加 $${r}$ 名会员。`),
        t(`It increases by $${100 + r}\\%$ each year.`, `每年增长 $${100 + r}\\%$。`),
        t(`It decreases by $${r}\\%$ each year.`, `每年减少 $${r}\\%$。`),
      ],
      t(
        `A factor of $${f}$ keeps $100\\%$ and adds $${r}\\%$, so the change is a percent of the current number.`,
        `倍数 $${f}$ 保留 $100\\%$ 并增加 $${r}\\%$，所以变化是当前数量的百分比。`,
      ),
    );
  }),
  spec("Absolute Value Equations", "绝对值方程", ["absolute-value-equations"], (rng, hard) => {
    const [b, k, a] = [rng.int(1, 9), rng.int(2, 12), rng.int(2, 5)];
    if (!hard)
      return mc(
        rng,
        t(`What are the solutions of $|x - ${b}| = ${k}$?`, `$|x - ${b}| = ${k}$ 的解是什么？`),
        `x = ${b - k}, x = ${b + k}`,
        [`x = ${b + k}`, `x = ${b - k}`, `x = ${k - b}, x = ${-k - b}`, `x = ${-b - k}, x = ${-b + k + 1}`],
        t(
          `The expression inside is $${k}$ or $-${k}$, so $x = ${b + k}$ or $x = ${b - k}$.`,
          `绝对值内的式子是 $${k}$ 或 $-${k}$，所以 $x = ${b + k}$ 或 $x = ${b - k}$。`,
        ),
      );
    return spr(
      t(`What is the sum of the solutions of $${a}|x - ${b}| + 1 = ${a * k + 1}$?`, `$${a}|x - ${b}| + 1 = ${a * k + 1}$ 的解之和是多少？`),
      2 * b,
      [b, 2 * k, 2 * (b + k)],
      t(
        `Isolate: $|x - ${b}| = ${k}$. The solutions are $${b} \\pm ${k}$, so the sum is $${2 * b}$.`,
        `单独放好：$|x - ${b}| = ${k}$。解为 $${b} \\pm ${k}$，所以和为 $${2 * b}$。`,
      ),
    );
  }),
  spec("Rational Equations", "分式方程", ["rational-equations-using-cross-multiplication"], (rng, hard) => {
    const [x, a, b] = [rng.int(2, 9), rng.int(2, 6), rng.int(1, 6)];
    if (!hard)
      return spr(
        t(`What value of $m$ satisfies $\\frac{${a * x}}{m} = ${a}$?`, `哪个 $m$ 值满足 $\\frac{${a * x}}{m} = ${a}$？`),
        x,
        [a, a * x, a * a * x],
        t(`Multiply by $m$ and divide by $${a}$: $m = ${x}$.`, `两边乘以 $m$ 再除以 $${a}$：$m = ${x}$。`),
      );
    const k = a + 1;
    return spr(
      t(
        `What value of $x$ satisfies $\\frac{${a}}{x + ${b}} = \\frac{${a * k}}{${k * (x + b)}}$?`,
        `哪个 $x$ 值满足 $\\frac{${a}}{x + ${b}} = \\frac{${a * k}}{${k * (x + b)}}$？`,
      ),
      x,
      [b, a + b, x + b],
      t(
        `Cross-multiply: $${a}(${k * (x + b)}) = ${a * k}(x + ${b})$, so $x + ${b} = ${x + b}$ and $x = ${x}$.`,
        `交叉相乘：$${a}(${k * (x + b)}) = ${a * k}(x + ${b})$，所以 $x + ${b} = ${x + b}$，$x = ${x}$。`,
      ),
    );
  }),
  spec("Radical Equations", "根式方程", ["solving-radical-equations"], (rng, hard) => {
    const [k, b, a] = [rng.int(2, 9), rng.int(1, 9), rng.int(2, 5)];
    if (!hard)
      return mc(
        rng,
        t(`What value of $x$ satisfies $\\sqrt{x - ${b}} = ${k}$?`, `哪个 $x$ 值满足 $\\sqrt{x - ${b}} = ${k}$？`),
        k * k + b,
        [k + b, k * k - b, 2 * k + b],
        t(`Square both sides: $x - ${b} = ${k * k}$, so $x = ${k * k + b}$.`, `两边平方：$x - ${b} = ${k * k}$，所以 $x = ${k * k + b}$。`),
      );
    return spr(
      t(
        `What value of $x$ satisfies $${a}\\sqrt{x + ${b}} - 1 = ${a * k - 1}$?`,
        `哪个 $x$ 值满足 $${a}\\sqrt{x + ${b}} - 1 = ${a * k - 1}$？`,
      ),
      k * k - b,
      [k * k + b, k - b, a * a * k * k - b],
      t(
        `Isolate the root: $\\sqrt{x + ${b}} = ${k}$. Squaring gives $x = ${k * k - b}$.`,
        `单独放好根式：$\\sqrt{x + ${b}} = ${k}$。平方得 $x = ${k * k - b}$。`,
      ),
    );
  }),
  spec("Equations Containing Multiple Radicals", "含多个根式的方程", ["solving-advanced-radical-equations"], (rng, hard) => {
    const x = rng.int(2, 12);
    const c = rng.int(1, x - 1);
    const a = rng.int(2, 5);
    if (!hard)
      return spr(
        t(
          `What value of $x$ satisfies $\\sqrt{${a + 1}x - ${c}} = \\sqrt{${a}x + ${x - c}}$?`,
          `哪个 $x$ 值满足 $\\sqrt{${a + 1}x - ${c}} = \\sqrt{${a}x + ${x - c}}$？`,
        ),
        x,
        [x + c, x - c, 2 * x],
        t(
          `Square both sides and solve the linear equation: $${a + 1}x - ${c} = ${a}x + ${x - c}$ gives $x = ${x}$.`,
          `两边平方后解一次方程：$${a + 1}x - ${c} = ${a}x + ${x - c}$ 得 $x = ${x}$。`,
        ),
      );
    const r = rng.int(2, 8);
    const q = rng.int(1, 4);
    return spr(
      t(
        `What value of $x$ satisfies $\\sqrt{x + ${2 * r * q + q * q}} = \\sqrt{x} + ${q}$?`,
        `哪个 $x$ 值满足 $\\sqrt{x + ${2 * r * q + q * q}} = \\sqrt{x} + ${q}$？`,
      ),
      r * r,
      [r, 2 * r, (r + q) ** 2],
      t(
        `Square both sides: $x + ${2 * r * q + q * q} = x + ${2 * q}\\sqrt{x} + ${q * q}$. So $\\sqrt{x} = ${r}$ and $x = ${r * r}$.`,
        `两边平方：$x + ${2 * r * q + q * q} = x + ${2 * q}\\sqrt{x} + ${q * q}$。所以 $\\sqrt{x} = ${r}$，$x = ${r * r}$。`,
      ),
    );
  }),
  spec("Absolute Value Functions", "绝对值函数", ["absolute-value-graphs"], (rng, hard) => {
    const [h, k, n] = [rng.nonZero(-4, 4), rng.nonZero(-5, 5), rng.int(1, 4)];
    const fig = curveFigure(
      (x) => Math.abs(x - h) + k,
      { x: [h - 5, h + 5], y: [k - 2, k + 6], dx: 1, dy: 2 },
      t("A graph on a coordinate grid.", "坐标网格上的一个图象。"),
    );
    if (!hard)
      return mc(
        rng,
        t(
          `The graph of an absolute value function $f$ is shown. Which equation could define $f$?`,
          `图中是绝对值函数 $f$ 的图象。哪个方程可能定义 $f$？`,
        ),
        `f(x) = |x ${sg(-h)}| ${sg(k)}`,
        [
          `f(x) = |x ${sg(h)}| ${sg(k)}`,
          `f(x) = |x ${sg(-h)}| ${sg(-k)}`,
          `f(x) = |x ${sg(h)}| ${sg(-k)}`,
          `f(x) = -|x ${sg(-h)}| ${sg(k)}`,
        ],
        t(`The lowest point $(${h}, ${k})$ gives $|x ${sg(-h)}| ${sg(k)}$.`, `最低点 $(${h}, ${k})$ 给出 $|x ${sg(-h)}| ${sg(k)}$。`),
        fig,
      );
    return spr(
      t(
        `The function $f$ is defined by $f(x) = |x ${sg(-h)}| ${sg(k)}$, and $g(x) = f(x) + ${n}$. What is the minimum value of $g(x)$?`,
        `函数 $f$ 定义为 $f(x) = |x ${sg(-h)}| ${sg(k)}$，且 $g(x) = f(x) + ${n}$。$g(x)$ 的最小值是多少？`,
      ),
      k + n,
      [h + n, k, h + k + n + 1],
      t(
        `The absolute value is at least $0$, so the least value of $f(x)$ is $${k}$. Adding $${n}$ raises it to $${k + n}$.`,
        `绝对值至少为 $0$，所以 $f(x)$ 的最小值是 $${k}$。加上 $${n}$ 后变为 $${k + n}$。`,
      ),
    );
  }),
  spec("Rational Functions", "有理函数", ["roots-of-rational-functions"], (rng, hard) => {
    const [r, s] = [rng.int(1, 8), rng.int(1, 8)];
    if (!hard)
      return mc(
        rng,
        t(
          `For what value of $x$ is $f(x) = \\frac{x - ${r}}{x + ${s}}$ equal to $0$?`,
          `$x$ 取何值时，$f(x) = \\frac{x - ${r}}{x + ${s}}$ 等于 $0$？`,
        ),
        r,
        [-r, s, -s],
        t(
          `A fraction is zero when its numerator is zero and its denominator is not, so $x = ${r}$.`,
          `分子为零且分母不为零时分式为零，所以 $x = ${r}$。`,
        ),
      );
    return spr(
      t(
        `The function $f(x) = \\frac{${r}}{x - ${s}}$ is not defined at $x = c$. What is the value of $c$?`,
        `函数 $f(x) = \\frac{${r}}{x - ${s}}$ 在 $x = c$ 处无定义。$c$ 的值是多少？`,
      ),
      s,
      [-s, r, r + s],
      t(`The function is not defined where the denominator is zero: $c = ${s}$.`, `分母为零处函数无定义：$c = ${s}$。`),
    );
  }),
  spec("Solving Multivariable Equations", "解多元方程", ["many-variable-equations"], (rng, hard) => {
    const [a, c] = [rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return mc(
        rng,
        t(
          `The equation $y = ${a}x + ${c}w$ relates $x$, $y$ and $w$. Which equation correctly expresses $x$?`,
          `方程 $y = ${a}x + ${c}w$ 把 $x$、$y$、$w$ 联系起来。哪个方程正确表示 $x$？`,
        ),
        `x = \\frac{y - ${c}w}{${a}}`,
        [`x = \\frac{y + ${c}w}{${a}}`, `x = \\frac{y}{${a}} - ${c}w`, `x = ${a}(y - ${c}w)`, `x = y - ${a * c}w`],
        t(`Subtract $${c}w$, then divide by $${a}$.`, `先减去 $${c}w$，再除以 $${a}$。`),
      );
    return mc(
      rng,
      t(
        `The formula $${a}A = ${c}h(b + d)$ relates $A$, $h$, $b$ and $d$. Which equation correctly expresses $b$?`,
        `公式 $${a}A = ${c}h(b + d)$ 把 $A$、$h$、$b$、$d$ 联系起来。哪个方程正确表示 $b$？`,
      ),
      `b = \\frac{${a}A}{${c}h} - d`,
      [`b = \\frac{${a}A - d}{${c}h}`, `b = \\frac{${a}A}{${c}h} + d`, `b = \\frac{${c}h}{${a}A} - d`, `b = ${a}A - ${c}h - d`],
      t(`Divide by $${c}h$ first, then subtract $d$.`, `先除以 $${c}h$，再减去 $d$。`),
    );
  }),
  spec("Further Multivariable Equations", "进一步的多元方程", ["rearranging-formulas"], (rng, hard) => {
    const [a, b, d] = [rng.int(2, 7), rng.int(2, 7), rng.int(2, 7)];
    if (!hard)
      return mc(
        rng,
        t(
          `If $${a}x + ${b}y = z$, which expression gives $y$ in terms of $x$ and $z$?`,
          `若 $${a}x + ${b}y = z$，哪个式子用 $x$ 和 $z$ 表示 $y$？`,
        ),
        `\\frac{z - ${a}x}{${b}}`,
        [`\\frac{z + ${a}x}{${b}}`, `z - \\frac{${a}x}{${b}}`, `\\frac{${b}}{z - ${a}x}`, `\\frac{z - ${b}x}{${a + b}}`],
        t(`Subtract $${a}x$, then divide everything by $${b}$.`, `减去 $${a}x$，再把全部除以 $${b}$。`),
      );
    return mc(
      rng,
      t(
        `If $ax + ${b} = cx + ${b + d}$, where $a \\ne c$, which expression gives $x$?`,
        `若 $ax + ${b} = cx + ${b + d}$，其中 $a \\ne c$，哪个式子给出 $x$？`,
      ),
      `\\frac{${d}}{a - c}`,
      [`\\frac{${d}}{c - a}`, `\\frac{${d}}{a + c}`, `${d}(a - c)`, `\\frac{a - c}{${d}}`],
      t(
        `Collect the $x$ terms on the left and the numbers on the right: $x(a - c) = ${d}$. Divide by $a - c$.`,
        `把含 $x$ 的项移到左边，数移到右边：$x(a - c) = ${d}$。除以 $a - c$。`,
      ),
    );
  }),
  spec("Solving Multivariable Rational Equations", "解多元分式方程", ["solving-many-variable-rational-equations"], (rng, hard) => {
    const a = rng.int(2, 9);
    let d = rng.int(2, 9);
    if (d === a) d = a === 9 ? 2 : a + 1;
    if (!hard)
      return mc(
        rng,
        t(
          `If $p = \\frac{${a}q}{${d}r}$, with $p$, $q$ and $r$ nonzero, which equation correctly expresses $r$?`,
          `若 $p = \\frac{${a}q}{${d}r}$，其中 $p$、$q$、$r$ 不为零，哪个方程正确表示 $r$？`,
        ),
        `r = \\frac{${a}q}{${d}p}`,
        [`r = \\frac{${d}p}{${a}q}`, `r = \\frac{${a}pq}{${d}}`, `r = \\frac{${d}q}{${a}p}`, `r = p - \\frac{${a}q}{${d}}`],
        t(`Multiply by $${d}r$, then divide by $${d}p$.`, `乘以 $${d}r$，再除以 $${d}p$。`),
      );
    return mc(
      rng,
      t(
        `If $\\frac{${d}}{x} + \\frac{${a}}{y} = \\frac{1}{z}$, with all variables positive, which expression gives $z$?`,
        `若 $\\frac{${d}}{x} + \\frac{${a}}{y} = \\frac{1}{z}$，各变量都为正，哪个式子给出 $z$？`,
      ),
      `\\frac{xy}{${d}y + ${a}x}`,
      [`\\frac{x}{${d}} + \\frac{y}{${a}}`, `\\frac{${d}y + ${a}x}{xy}`, `\\frac{xy}{${d}x + ${a}y}`, `\\frac{${a * d}xy}{x + y}`],
      t(
        `Add the fractions: $\\frac{${d}y + ${a}x}{xy} = \\frac{1}{z}$. Then take reciprocals.`,
        `分式相加：$\\frac{${d}y + ${a}x}{xy} = \\frac{1}{z}$。再取倒数。`,
      ),
    );
  }),
  spec("Solving Multivariable Nonlinear Equations", "解多元非线性方程", ["solving-many-variable-nonlinear-equations"], (rng, hard) => {
    const [a, d] = [rng.int(2, 9), rng.int(2, 7)];
    if (!hard)
      return mc(
        rng,
        t(
          `If $V = ${a}r^2h + ${d}$, with $r > 0$, $h > 0$ and $V > ${d}$, which equation correctly expresses $r$?`,
          `若 $V = ${a}r^2h + ${d}$，其中 $r > 0$，$h > 0$，$V > ${d}$，哪个方程正确表示 $r$？`,
        ),
        `r = \\sqrt{\\frac{V - ${d}}{${a}h}}`,
        [
          `r = \\frac{V - ${d}}{${a}h}`,
          `r = \\sqrt{\\frac{V}{${a}h}} - ${d}`,
          `r = \\frac{\\sqrt{V - ${d}}}{${a}h}`,
          `r = \\sqrt{${a}h(V - ${d})}`,
        ],
        t(`Subtract $${d}$, divide by $${a}h$, then take the positive square root.`, `减去 $${d}$，除以 $${a}h$，再取正平方根。`),
      );
    // The denominator stays coprime to the coefficient, so the answer needs no reducing.
    const e = rng.pick(
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((v) => {
        let [p, q] = [v, a];
        while (q !== 0) [p, q] = [q, p % q];
        return p === 1;
      }),
    );
    return mc(
      rng,
      t(
        `If $T = ${a}\\sqrt{\\frac{L}{${e}g}}$, with all variables positive, which equation correctly expresses $L$?`,
        `若 $T = ${a}\\sqrt{\\frac{L}{${e}g}}$，各变量都为正，哪个方程正确表示 $L$？`,
      ),
      `L = \\frac{${e}gT^2}{${a * a}}`,
      [`L = \\frac{${e}gT}{${a}}`, `L = \\frac{T^2}{${a * a * e}g}`, `L = ${a * a * e}gT^2`, `L = \\frac{${e}gT^2}{${a}}`],
      t(
        `Divide by $${a}$ and square: $\\frac{T^2}{${a * a}} = \\frac{L}{${e}g}$. Multiply by $${e}g$.`,
        `除以 $${a}$ 再平方：$\\frac{T^2}{${a * a}} = \\frac{L}{${e}g}$。再乘以 $${e}g$。`,
      ),
    );
  }),
  spec(
    "Identifying Intercepts of Functions From Graphs",
    "从图象识别函数的截距",
    ["interpreting-descriptions-of-physical-phenomena"],
    (rng, hard) => {
      const r = rng.int(1, 6);
      const s = rng.int(1, Math.min(6, Math.floor(12 / r)));
      const a = rng.pick([1, -1]);
      const fig = curveFigure(
        (x) => a * (x + r) * (x - s),
        { x: [-7, 7], y: [-14, 14], dx: 1, dy: 2 },
        t("A parabola on a coordinate grid.", "坐标网格上的一条抛物线。"),
      );
      if (!hard)
        return mc(
          rng,
          t(
            `The graph of $y = f(x)$ is shown. What is the $y$-intercept of the graph?`,
            `图中是 $y = f(x)$ 的图象。图象的 $y$ 轴截距是什么？`,
          ),
          `(0, ${-a * r * s})`,
          [`(${s}, 0)`, `(${-r}, 0)`, `(0, ${r + s})`, `(0, ${a * r * s})`],
          t(`The graph meets the $y$-axis at height $${-a * r * s}$.`, `图象在高度 $${-a * r * s}$ 处与 $y$ 轴相交。`),
          fig,
        );
      return spr(
        t(`The graph of $y = f(x)$ is shown. What is the positive $x$-intercept?`, `图中是 $y = f(x)$ 的图象。正的 $x$ 轴截距是多少？`),
        s,
        [-r, r * s, r + s],
        t(`The graph crosses the $x$-axis on the positive side at $x = ${s}$.`, `图象在正半轴的 $x = ${s}$ 处穿过 $x$ 轴。`),
        fig,
      );
    },
  ),
  spec(
    "Interpreting Graph Properties in Modeling Contexts",
    "在建模情境中解释图象性质",
    ["interpreting-rates-of-change-of-physical-phenomena"],
    (rng, hard) => {
      const [full, rate] = [rng.int(2, 10) * 4, rng.pick([1, 2, 4])];
      const hours = full / rate;
      const fig = curveFigure(
        (x) => full - rate * x,
        { x: [0, hours + 2], y: [0, full + 4], dx: Math.ceil(hours / 6) || 1, dy: 4 },
        t(`A line falling from $(0, ${full})$ to $(${hours}, 0)$.`, `从 $(0, ${full})$ 下降到 $(${hours}, 0)$ 的直线。`),
      );
      if (!hard)
        return words(
          rng,
          t(
            `The graph shows the gallons of water left in a tank $x$ hours after it starts draining. What does the $y$-intercept represent?`,
            `图中是水箱开始排水 $x$ 小时后剩余的水量（加仑）。$y$ 轴截距表示什么？`,
          ),
          t("The amount of water in the tank before draining starts", "开始排水前水箱中的水量"),
          [
            t("The time it takes to empty the tank", "排空水箱所需的时间"),
            t("The rate at which the tank drains", "水箱排水的速率"),
            t("The amount of water left after one hour", "一小时后剩余的水量"),
          ],
          t(`The $y$-intercept is the amount at $x = 0$, before any time has passed.`, `$y$ 轴截距是 $x = 0$ 时的量，此时还没有经过时间。`),
          fig,
        );
      return words(
        rng,
        t(
          `The graph shows the gallons of water left in a tank $x$ hours after it starts draining. What does the $x$-intercept represent?`,
          `图中是水箱开始排水 $x$ 小时后剩余的水量（加仑）。$x$ 轴截距表示什么？`,
        ),
        t("The time at which the tank becomes empty", "水箱变空的时间"),
        [
          t("The amount of water in the full tank", "满箱时的水量"),
          t("The rate at which the tank drains", "水箱排水的速率"),
          t("The amount of water drained in one hour", "一小时排出的水量"),
        ],
        t(
          `At the $x$-intercept the water left is zero, so that time is when the tank is empty.`,
          `在 $x$ 轴截距处剩余水量为零，所以这是水箱变空的时间。`,
        ),
        fig,
      );
    },
  ),
  spec(
    "Solving Linear-Quadratic Systems of Equations",
    "解一次-二次方程组",
    ["finding-intersections-of-lines-and-quadratic-functions"],
    (rng, hard) => {
      const r = rng.int(1, 6);
      const s = r + rng.int(1, 5);
      const m = r + s;
      const sys = (c: number) => `y = x^2 ${sg(c)} \\text{ and } y = ${m}x ${sg(c - r * s)}`;
      const c = rng.nonZero(-5, 5);
      if (!hard)
        return mcExact(
          rng,
          t(`Which value of $x$ is part of a solution of the system $${sys(c)}$?`, `哪个 $x$ 值是方程组 $${sys(c)}$ 的解的一部分？`),
          s,
          [-s, m, r === 1 ? -r : r * s],
          t(
            `Set the right sides equal: $x^2 - ${m}x + ${r * s} = 0$, so $x = ${r}$ or $x = ${s}$.`,
            `令右边相等：$x^2 - ${m}x + ${r * s} = 0$，所以 $x = ${r}$ 或 $x = ${s}$。`,
          ),
        );
      return spr(
        t(
          `The system $${sys(c)}$ has solutions $(x_1, y_1)$ and $(x_2, y_2)$. What is the value of $x_1 + x_2$?`,
          `方程组 $${sys(c)}$ 的解为 $(x_1, y_1)$ 和 $(x_2, y_2)$。$x_1 + x_2$ 的值是多少？`,
        ),
        m,
        [r * s, -m, c],
        t(
          `The combined equation is $x^2 - ${m}x + ${r * s} = 0$, so the sum of the solutions is $${m}$.`,
          `合并后的方程是 $x^2 - ${m}x + ${r * s} = 0$，所以解之和为 $${m}$。`,
        ),
      );
    },
  ),
  spec(
    "Solving Challenging Linear-Quadratic Systems of Equations",
    "解较难的一次-二次方程组",
    ["intersections-of-parabolas-with-lines"],
    (rng, hard) => {
      const [a, r] = [rng.int(2, 4), rng.int(1, 5)];
      const s = r + rng.int(1, 4);
      const c = a * r * s;
      const b = a * (r + s);
      if (!hard)
        return mc(
          rng,
          t(
            `Which is a solution of the system $y = ${a}x^2 + ${c}$ and $y = ${b}x$?`,
            `哪个是方程组 $y = ${a}x^2 + ${c}$ 和 $y = ${b}x$ 的解？`,
          ),
          `(${r}, ${b * r})`,
          [`(${r}, ${a * r * r})`, `(${-r}, ${-b * r})`, `(${r + s}, ${b * r})`, `(${s}, ${b * r})`],
          t(
            `Equate: $${a}x^2 - ${b}x + ${c} = 0$, so $x^2 - ${r + s}x + ${r * s} = 0$ and $x = ${r}$ or $${s}$. Then $y = ${b}x$.`,
            `令相等：$${a}x^2 - ${b}x + ${c} = 0$，即 $x^2 - ${r + s}x + ${r * s} = 0$，$x = ${r}$ 或 $${s}$。再由 $y = ${b}x$ 求 $y$。`,
          ),
        );
      return spr(
        t(
          `The system $y = ${a}x^2 + ${c}$ and $y = ${b}x$ has two solutions. What is the greater value of $y$?`,
          `方程组 $y = ${a}x^2 + ${c}$ 和 $y = ${b}x$ 有两个解。$y$ 的较大值是多少？`,
        ),
        b * s,
        [b * r, s, c],
        t(
          `The $x$-values are $${r}$ and $${s}$. The greater $y$ is $${b}(${s}) = ${b * s}$.`,
          `$x$ 的值为 $${r}$ 和 $${s}$。较大的 $y$ 为 $${b}(${s}) = ${b * s}$。`,
        ),
      );
    },
  ),
  spec(
    "Exploiting Structure to Solve Nonlinear Systems of Equations",
    "利用结构解非线性方程组",
    ["solving-systems-of-nonlinear-equations-by-identifying-structure"],
    (rng, hard) => {
      const [p, q] = [rng.int(2, 9), rng.int(2, 9)];
      const u = p + q + rng.int(1, 5);
      if (!hard)
        return spr(
          t(
            `If $x + y = ${p + q}$ and $x^2 - y^2 = ${(p + q) * u}$, what is the value of $x - y$?`,
            `若 $x + y = ${p + q}$，$x^2 - y^2 = ${(p + q) * u}$，则 $x - y$ 的值是多少？`,
          ),
          u,
          [(p + q) * u, p + q, u - p - q],
          t(`Since $x^2 - y^2 = (x + y)(x - y)$, divide: $x - y = ${u}$.`, `因为 $x^2 - y^2 = (x + y)(x - y)$，相除得 $x - y = ${u}$。`),
        );
      return spr(
        t(
          `If $xy = ${p * q}$ and $x + y = ${p + q}$, what is the value of $x^2 + y^2$?`,
          `若 $xy = ${p * q}$，$x + y = ${p + q}$，则 $x^2 + y^2$ 的值是多少？`,
        ),
        p * p + q * q,
        [(p + q) ** 2, (p + q) ** 2 + 2 * p * q, p + q],
        t(
          `$x^2 + y^2 = (x + y)^2 - 2xy = ${(p + q) ** 2} - ${2 * p * q} = ${p * p + q * q}$.`,
          `$x^2 + y^2 = (x + y)^2 - 2xy = ${(p + q) ** 2} - ${2 * p * q} = ${p * p + q * q}$。`,
        ),
      );
    },
  ),
  spec(
    "Linear-Quadratic Systems With One Solution",
    "恰有一个解的一次-二次方程组",
    ["determining-unknown-parameters-in-quadratic-systems-with-one-intersection-point"],
    (rng, hard) => {
      const m = rng.int(1, 6) * 2;
      const d = rng.int(1, 9);
      const [q, a] = [rng.int(1, 3), rng.int(2, 12)];
      if (!hard)
        return spr(
          t(
            `The system $y = x^2 + ${d}$ and $y = ${m}x + c$ has exactly one solution, where $c$ is a constant. What is the value of $c$?`,
            `方程组 $y = x^2 + ${d}$ 和 $y = ${m}x + c$ 恰有一个解，其中 $c$ 是常数。$c$ 的值是多少？`,
          ),
          d - (m * m) / 4,
          [d + (m * m) / 4, (m * m) / 4, m + d],
          t(
            `$x^2 - ${m}x + ${d} - c = 0$ needs discriminant zero: $${m * m} - 4(${d} - c) = 0$, so $c = ${d - (m * m) / 4}$.`,
            `$x^2 - ${m}x + ${d} - c = 0$ 的判别式必须为零：$${m * m} - 4(${d} - c) = 0$，所以 $c = ${d - (m * m) / 4}$。`,
          ),
        );
      return spr(
        t(
          `The system $y = ${q === 1 ? "" : q}x^2 + ${q * a * a}$ and $y = kx$ has exactly one solution, and $k > 0$. What is the value of $k$?`,
          `方程组 $y = ${q === 1 ? "" : q}x^2 + ${q * a * a}$ 和 $y = kx$ 恰有一个解，且 $k > 0$。$k$ 的值是多少？`,
        ),
        2 * q * a,
        [q * a, q * a * a, 4 * q * q * a * a],
        t(
          `$${q === 1 ? "" : q}x^2 - kx + ${q * a * a} = 0$ needs $k^2 = ${4 * q * q * a * a}$, so the positive value is $k = ${2 * q * a}$.`,
          `$${q === 1 ? "" : q}x^2 - kx + ${q * a * a} = 0$ 要求 $k^2 = ${4 * q * q * a * a}$，所以正值 $k = ${2 * q * a}$。`,
        ),
      );
    },
  ),
  spec(
    "Linear-Quadratic Systems With Zero or Two Solutions",
    "有零个或两个解的一次-二次方程组",
    ["determining-unknown-parameters-in-quadratic-systems-with-zero-or-two-intersection-points"],
    (rng, hard) => {
      const m = rng.int(1, 5) * 2;
      const d = rng.int(1, 9);
      const lim = (m * m) / 4 + d;
      if (!hard && rng.bool()) {
        const under = d - (m * m) / 4;
        return mcExact(
          rng,
          t(
            `For which value of $c$ does the system $y = -x^2 + c$ and $y = ${m}x + ${d}$ have no solution?`,
            `$c$ 取何值时，方程组 $y = -x^2 + c$ 和 $y = ${m}x + ${d}$ 无解？`,
          ),
          under - rng.int(1, 4),
          [under, under + 1, under + 3],
          t(
            `$x^2 + ${m}x + ${d} - c = 0$ has discriminant $${m * m} - 4(${d} - c)$, which is negative when $c < ${under}$.`,
            `$x^2 + ${m}x + ${d} - c = 0$ 的判别式为 $${m * m} - 4(${d} - c)$，当 $c < ${under}$ 时为负。`,
          ),
        );
      }
      if (!hard)
        return mcExact(
          rng,
          t(
            `For which value of $c$ does the system $y = x^2 + c$ and $y = ${m}x + ${d}$ have no solution?`,
            `$c$ 取何值时，方程组 $y = x^2 + c$ 和 $y = ${m}x + ${d}$ 无解？`,
          ),
          lim + rng.int(1, 4),
          [lim, lim - 1, lim - 3],
          t(
            `$x^2 - ${m}x + c - ${d} = 0$ has discriminant $${m * m} - 4(c - ${d})$, which is negative when $c > ${lim}$.`,
            `$x^2 - ${m}x + c - ${d} = 0$ 的判别式为 $${m * m} - 4(c - ${d})$，当 $c > ${lim}$ 时为负。`,
          ),
        );
      return spr(
        t(
          `The system $y = x^2 + c$ and $y = ${m}x + ${d}$ has two solutions, and $c$ is an integer. What is the greatest possible value of $c$?`,
          `方程组 $y = x^2 + c$ 和 $y = ${m}x + ${d}$ 有两个解，且 $c$ 是整数。$c$ 的最大可能值是多少？`,
        ),
        lim - 1,
        [lim, lim + 1, m + d],
        t(
          `The discriminant $${m * m} - 4(c - ${d})$ must be positive, so $c < ${lim}$, and the greatest integer is $${lim - 1}$.`,
          `判别式 $${m * m} - 4(c - ${d})$ 必须为正，所以 $c < ${lim}$，最大整数是 $${lim - 1}$。`,
        ),
      );
    },
  ),
  spec("Other Systems of Nonlinear Equations", "其他非线性方程组", ["solving-systems-of-nonlinear-equations"], (rng, hard) => {
    const x = rng.int(2, 8);
    const y = x + rng.pick([1, 2, 3, 4]) * (x > 5 ? -1 : 1);
    if (!hard)
      return mc(
        rng,
        t(
          `If $x^2 + y = ${x * x + y}$ and $y = ${y}$, and $x > 0$, what is the value of $x$?`,
          `若 $x^2 + y = ${x * x + y}$，$y = ${y}$，且 $x > 0$，则 $x$ 的值是多少？`,
        ),
        x,
        [x * x, x * x + y, x + y],
        t(`Substitute: $x^2 = ${x * x}$, and the positive root is $${x}$.`, `代入：$x^2 = ${x * x}$，正根为 $${x}$。`),
      );
    return spr(
      t(
        `If $y = \\frac{${x * y}}{x}$ and $y = x ${sg(y - x)}$, with $x > 0$, what is the value of $y$?`,
        `若 $y = \\frac{${x * y}}{x}$，$y = x ${sg(y - x)}$，且 $x > 0$，则 $y$ 的值是多少？`,
      ),
      y,
      [x, x * y, x + y],
      t(
        `Substitute and clear the fraction: $x(x ${sg(y - x)}) = ${x * y}$. The positive solution is $x = ${x}$, so $y = ${y}$.`,
        `代入并去分母：$x(x ${sg(y - x)}) = ${x * y}$。正解为 $x = ${x}$，所以 $y = ${y}$。`,
      ),
    );
  }),
];
