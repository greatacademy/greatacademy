import { t } from "@ga/content";

import type { ExamSpec } from "../exam.ts";
import { curveFigure, cx, mc, mcExact, par, sg, spec, spr, step, tx, words, worked } from "../exam.ts";

// SAT Math Prep, Advanced Math: exponential functions and models, nonlinear equations, multivariable equations, graphs and nonlinear systems.

/** satExamAdvanced3 are the exam-style questions on exponential functions, nonlinear equations, multivariable equations, graphs and nonlinear systems. */
export const satExamAdvanced3: ExamSpec[] = [
  spec("Exponential Functions", "指数函数", ["exponential-functions"], (rng, hard) => {
    const [a, b, n] = [rng.int(2, 9), rng.int(2, 4), rng.int(2, 4)];
    const chain = Array.from({ length: n + 1 }, (_, i) => a * b ** i).join(", ");
    if (!hard)
      return mc(
        rng,
        t(`If $f(x) = ${a}(${b})^x$, what is the value of $f(${n})$?`, `若 $f(x) = ${a}(${b})^x$，则 $f(${n})$ 的值是多少？`),
        a * b ** n,
        [(a * b) ** n, a * b * n, a + b ** n],
        worked(
          [
            step(
              "Raise the base to the power",
              "先算幂",
              `Only the base is raised to the power: $${b}^{${n}} = ${b ** n}$.`,
              `只有底数取幂：$${b}^{${n}} = ${b ** n}$。`,
            ),
            step(
              "Multiply by the coefficient",
              "再乘系数",
              `$f(${n}) = ${a} \\times ${b ** n} = ${a * b ** n}$.`,
              `$f(${n}) = ${a} \\times ${b ** n} = ${a * b ** n}$。`,
            ),
          ],
          t(
            `Start from $f(0) = ${a}$ and multiply by $${b}$ once per step: $${chain}$. The last value is $${a * b ** n}$.`,
            `从 $f(0) = ${a}$ 开始，每一步乘以 $${b}$：$${chain}$。最后一个值是 $${a * b ** n}$。`,
          ),
          [
            t(
              `This raises $${a} \\times ${b}$ to the power, but the exponent belongs to the base $${b}$ only.`,
              `这是把 $${a} \\times ${b}$ 整个取幂了，但指数只作用于底数 $${b}$。`,
            ),
            t(
              `This multiplies by the exponent $${n}$ instead of raising $${b}$ to it.`,
              `这是乘以指数 $${n}$，而不是把 $${b}$ 取 $${n}$ 次幂。`,
            ),
            t(`This adds the coefficient $${a}$ instead of multiplying by it.`, `这是加上了系数 $${a}$，而不是乘以它。`),
          ],
        ),
      );
    return spr(
      t(
        `The function $f(x) = ${a}(${b})^x$ satisfies $f(k) = ${a * b ** n}$. What is the value of $k$?`,
        `函数 $f(x) = ${a}(${b})^x$ 满足 $f(k) = ${a * b ** n}$。$k$ 的值是多少？`,
      ),
      n,
      [b ** n, n + 1, a * n],
      worked(
        [
          step(
            "Divide by the coefficient",
            "除以系数",
            `$${a}(${b})^k = ${a * b ** n}$ gives $${b}^k = ${b ** n}$.`,
            `由 $${a}(${b})^k = ${a * b ** n}$ 得 $${b}^k = ${b ** n}$。`,
          ),
          step(
            "Write the number as a power of the base",
            "把这个数写成底数的幂",
            `$${b ** n} = ${b}^{${n}}$, so $k = ${n}$.`,
            `$${b ** n} = ${b}^{${n}}$，所以 $k = ${n}$。`,
          ),
        ],
        t(
          `$f(${n}) = ${a} \\times ${b}^{${n}} = ${a} \\times ${b ** n} = ${a * b ** n}$.`,
          `$f(${n}) = ${a} \\times ${b}^{${n}} = ${a} \\times ${b ** n} = ${a * b ** n}$。`,
        ),
        [
          t(`This is the value of $${b}^k$, not the exponent $k$.`, `这是 $${b}^k$ 的值，不是指数 $k$。`),
          t(
            `This is one step too many: $f(${n + 1}) = ${a * b ** (n + 1)}$, not $${a * b ** n}$.`,
            `这多算了一步：$f(${n + 1}) = ${a * b ** (n + 1)}$，不是 $${a * b ** n}$。`,
          ),
          t(
            `This multiplies the exponent by the coefficient $${a}$; the coefficient only scales the output.`,
            `这是把指数乘以系数 $${a}$；系数只放大输出。`,
          ),
        ],
      ),
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
        worked(
          [
            step(
              "Decide the direction",
              "判断增减",
              `The base $${b}$ is greater than $1$, so $f$ increases and its greatest value is at the right end, $x = ${hi}$.`,
              `底数 $${b}$ 大于 $1$，所以 $f$ 递增，最大值在右端点 $x = ${hi}$ 处。`,
            ),
            step(
              "Evaluate at the right end",
              "求右端点的值",
              `$f(${hi}) = ${a} \\times ${b}^{${hi}} = ${a} \\times ${b ** hi} = ${a * b ** hi}$.`,
              `$f(${hi}) = ${a} \\times ${b}^{${hi}} = ${a} \\times ${b ** hi} = ${a * b ** hi}$。`,
            ),
          ],
          t(
            `At the left end $f(0) = ${a}$, which is smaller, so the greatest value is $${a * b ** hi}$.`,
            `左端点 $f(0) = ${a}$ 更小，所以最大值是 $${a * b ** hi}$。`,
          ),
          [
            t(
              `This is $f(0)$, the least value: the function increases, so the greatest value is at $x = ${hi}$.`,
              `这是 $f(0)$，是最小值：函数递增，最大值在 $x = ${hi}$ 处。`,
            ),
            t(`This is $f(1)$, not the value at the right end $x = ${hi}$.`, `这是 $f(1)$，不是右端点 $x = ${hi}$ 处的值。`),
            t(
              `This raises $${a} \\times ${b}$ to the power, but the exponent belongs to the base $${b}$ only.`,
              `这是把 $${a} \\times ${b}$ 整个取幂了，但指数只作用于底数 $${b}$。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `What is the least value of $f(x) = ${a * b ** hi}\\left(\\frac{1}{${b}}\\right)^x$ for $0 \\le x \\le ${hi}$?`,
        `当 $0 \\le x \\le ${hi}$ 时，$f(x) = ${a * b ** hi}\\left(\\frac{1}{${b}}\\right)^x$ 的最小值是多少？`,
      ),
      a,
      [a * b ** hi, a * b, 0],
      worked(
        [
          step(
            "Decide the direction",
            "判断增减",
            `The base $\\frac{1}{${b}}$ is less than $1$, so $f$ decreases and its least value is at the right end, $x = ${hi}$.`,
            `底数 $\\frac{1}{${b}}$ 小于 $1$，所以 $f$ 递减，最小值在右端点 $x = ${hi}$ 处。`,
          ),
          step(
            "Evaluate at the right end",
            "求右端点的值",
            `$f(${hi}) = ${a * b ** hi} \\times \\frac{1}{${b ** hi}} = ${a}$.`,
            `$f(${hi}) = ${a * b ** hi} \\times \\frac{1}{${b ** hi}} = ${a}$。`,
          ),
        ],
        t(
          `One step earlier, $f(${hi - 1}) = ${a * b}$, which is larger, so the values are still falling at $x = ${hi}$.`,
          `前一步 $f(${hi - 1}) = ${a * b}$ 更大，所以函数值到 $x = ${hi}$ 仍在下降。`,
        ),
        [
          t(
            `This is $f(0)$, the greatest value: the function decreases, so the least value is at $x = ${hi}$.`,
            `这是 $f(0)$，是最大值：函数递减，最小值在 $x = ${hi}$ 处。`,
          ),
          t(`This is $f(${hi - 1})$, one step short of the right end.`, `这是 $f(${hi - 1})$，差一步才到右端点。`),
          t(
            `An exponential function never reaches $0$; on this interval it stops at $f(${hi}) = ${a}$.`,
            `指数函数永远不会等于 $0$；在这个区间上它到 $f(${hi}) = ${a}$ 为止。`,
          ),
        ],
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
          worked(
            [
              step(
                "Substitute the input",
                "代入输入",
                `At $x = 1$: $a \\times ${b} = ${a * b}$.`,
                `当 $x = 1$ 时：$a \\times ${b} = ${a * b}$。`,
              ),
              step("Divide by the base", "除以底数", `$a = \\frac{${a * b}}{${b}} = ${a}$.`, `$a = \\frac{${a * b}}{${b}} = ${a}$。`),
            ],
            t(`$f(1) = ${a} \\times ${b} = ${a * b}$.`, `$f(1) = ${a} \\times ${b} = ${a * b}$。`),
            [
              t(`This is $f(1)$ itself; it still has to be divided by $${b}$.`, `这是 $f(1)$ 本身；还要除以 $${b}$。`),
              t(`This multiplies by $${b}$ instead of dividing by it.`, `这是乘以 $${b}$，而不是除以它。`),
              t(`This is the base, not the coefficient $a$.`, `这是底数，不是系数 $a$。`),
            ],
          ),
        );
      return spr(
        t(
          `The function $f(x) = ab^x$, with $b > 0$, has $f(0) = ${a}$ and $f(2) = ${a * b * b}$. What is the value of $b$?`,
          `函数 $f(x) = ab^x$（$b > 0$）满足 $f(0) = ${a}$，$f(2) = ${a * b * b}$。$b$ 的值是多少？`,
        ),
        b,
        [b * b, a, a * b],
        worked(
          [
            step("Use the value at zero", "利用零处的值", `$b^0 = 1$, so $f(0) = a = ${a}$.`, `$b^0 = 1$，所以 $f(0) = a = ${a}$。`),
            step(
              "Use the second value",
              "利用第二个值",
              `$${a}b^2 = ${a * b * b}$ gives $b^2 = ${b * b}$, and since $b > 0$, $b = ${b}$.`,
              `由 $${a}b^2 = ${a * b * b}$ 得 $b^2 = ${b * b}$，又 $b > 0$，所以 $b = ${b}$。`,
            ),
          ],
          t(
            `$f(2) = ${a} \\times ${b}^2 = ${a} \\times ${b * b} = ${a * b * b}$.`,
            `$f(2) = ${a} \\times ${b}^2 = ${a} \\times ${b * b} = ${a * b * b}$。`,
          ),
          [
            t(`This is $b^2$; take its positive square root.`, `这是 $b^2$；要取它的正平方根。`),
            t(`This is $a = f(0)$, the coefficient, not the base.`, `这是 $a = f(0)$，是系数，不是底数。`),
            t(`This is $f(1) = ab$, a value of the function, not the base.`, `这是 $f(1) = ab$，是函数值，不是底数。`),
          ],
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
          worked(
            [
              step(
                "Find the starting value",
                "找出起始值",
                `After $0$ steps the quantity is $${a}$, so $${a}$ is the coefficient.`,
                `$0$ 步后的量是 $${a}$，所以 $${a}$ 是系数。`,
              ),
              step(
                "Find the repeated factor",
                "找出重复的倍数",
                `Each step multiplies by $${b}$, so after $x$ steps the quantity is $${a}(${b})^x$.`,
                `每一步乘以 $${b}$，所以 $x$ 步后的量是 $${a}(${b})^x$。`,
              ),
            ],
            t(
              `$f(1) = ${a} \\times ${b} = ${a * b}$ and $f(2) = ${a * b} \\times ${b} = ${a * b * b}$: one and two multiplications by $${b}$.`,
              `$f(1) = ${a} \\times ${b} = ${a * b}$，$f(2) = ${a * b} \\times ${b} = ${a * b * b}$：分别乘了一次和两次 $${b}$。`,
            ),
            [
              t(`This swaps the starting value and the factor.`, `这是把起始值和倍数对调了。`),
              t(
                `This adds $${b}$ each step, which is linear growth, not repeated multiplication.`,
                `这是每一步加 $${b}$，是线性增长，不是重复相乘。`,
              ),
              t(`This puts $x$ in the base; the number of steps must be the exponent.`, `这是把 $x$ 放进了底数；步数应当是指数。`),
              t(
                `This multiplies the start into the base, so $f(0)$ would be $1$ instead of $${a}$.`,
                `这是把起始值乘进了底数，那样 $f(0)$ 会是 $1$，而不是 $${a}$。`,
              ),
            ],
          ),
        );
      return mc(
        rng,
        t(
          `A quantity starts at $${a}$ and is multiplied by $${b}$ every $${p}$ hours. Which function gives the quantity after $t$ hours?`,
          `某量从 $${a}$ 开始，每 $${p}$ 小时乘以 $${b}$。哪个函数给出 $t$ 小时后的量？`,
        ),
        `f(t) = ${a}(${b})^{t/${p}}`,
        [`f(t) = ${a}(${b})^{${p}t}`, `f(t) = ${a}(${b * p})^{t}`, `f(t) = ${a}(${b})^{t}`, `f(t) = ${p}(${b})^{t/${a}}`],
        worked(
          [
            step(
              "Count the multiplications",
              "数出相乘的次数",
              `One multiplication happens every $${p}$ hours, so in $t$ hours there are $\\frac{t}{${p}}$ of them.`,
              `每 $${p}$ 小时乘一次，所以 $t$ 小时内乘了 $\\frac{t}{${p}}$ 次。`,
            ),
            step(
              "Write the function",
              "写出函数",
              `The start $${a}$ is the coefficient and $\\frac{t}{${p}}$ is the exponent: $f(t) = ${a}(${b})^{t/${p}}$.`,
              `起始值 $${a}$ 是系数，$\\frac{t}{${p}}$ 是指数：$f(t) = ${a}(${b})^{t/${p}}$。`,
            ),
          ],
          t(
            `At $t = ${p}$ the exponent is $\\frac{${p}}{${p}} = 1$, so the function gives $${a} \\times ${b} = ${a * b}$: exactly one multiplication after $${p}$ hours.`,
            `当 $t = ${p}$ 时指数为 $\\frac{${p}}{${p}} = 1$，函数给出 $${a} \\times ${b} = ${a * b}$：$${p}$ 小时后恰好乘了一次。`,
          ),
          [
            t(
              `This multiplies $${p}$ times every hour, not once every $${p}$ hours.`,
              `这是每小时乘 $${p}$ 次，而不是每 $${p}$ 小时乘一次。`,
            ),
            t(`This multiplies the factor by $${p}$; the period belongs in the exponent.`, `这是把倍数乘以 $${p}$；周期应当放进指数。`),
            t(`This multiplies by $${b}$ every hour, not every $${p}$ hours.`, `这是每小时乘以 $${b}$，而不是每 $${p}$ 小时。`),
            t(`This swaps the starting value $${a}$ and the period $${p}$.`, `这是把起始值 $${a}$ 和周期 $${p}$ 对调了。`),
          ],
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
        worked(
          [
            step(
              "Use the power law",
              "用幂的法则",
              `A product in the exponent is a power of a power: $${b}^{${k}x} = (${b}^{${k}})^x$.`,
              `指数是乘积时，可写成幂的幂：$${b}^{${k}x} = (${b}^{${k}})^x$。`,
            ),
            step(
              "Evaluate the new base",
              "求出新底数",
              `$${b}^{${k}} = ${b ** k}$, so $f(x) = ${a}(${b ** k})^x$.`,
              `$${b}^{${k}} = ${b ** k}$，所以 $f(x) = ${a}(${b ** k})^x$。`,
            ),
          ],
          t(
            `At $x = 1$ the original gives $${a} \\times ${b}^{${k}} = ${a * b ** k}$, and the new form gives $${a} \\times ${b ** k} = ${a * b ** k}$.`,
            `当 $x = 1$ 时原式给出 $${a} \\times ${b}^{${k}} = ${a * b ** k}$，新形式给出 $${a} \\times ${b ** k} = ${a * b ** k}$。`,
          ),
          [
            t(
              `This moves one factor of $${b}$ into the coefficient, which is $${a}(${b})^{x + 1}$, not $${a}(${b})^{${k}x}$.`,
              `这是把一个 $${b}$ 移进了系数，等于 $${a}(${b})^{x + 1}$，不是 $${a}(${b})^{${k}x}$。`,
            ),
            t(
              `This multiplies $${b}$ by $${k}$; the power law gives $${b}^{${k}}$.`,
              `这是用 $${b}$ 乘 $${k}$；幂的法则给出的是 $${b}^{${k}}$。`,
            ),
            t(
              `This raises the coefficient to the power $${k}$, but the exponent applies only to $${b}$.`,
              `这是把系数取了 $${k}$ 次幂，但指数只作用于 $${b}$。`,
            ),
            t(
              `This adds $${k}$ to the base; the power law gives $${b}^{${k}}$.`,
              `这是把 $${k}$ 加到底数上；幂的法则给出的是 $${b}^{${k}}$。`,
            ),
            t(`The base is right, but the coefficient must stay $${a}$.`, `底数对了，但系数应当保持 $${a}$。`),
            t(`The base must be $${b ** k}$, not one more.`, `底数应当是 $${b ** k}$，不是多 $1$。`),
          ],
        ),
      );
    return spr(
      t(
        `The function $f(x) = ${a}(${b})^{x + ${k}}$ can be written as $f(x) = c(${b})^x$. What is the value of $c$?`,
        `函数 $f(x) = ${a}(${b})^{x + ${k}}$ 可写成 $f(x) = c(${b})^x$。$c$ 的值是多少？`,
      ),
      a * b ** k,
      [a, a * k, a + b ** k],
      worked(
        [
          step(
            "Split the exponent",
            "拆开指数",
            `A sum in the exponent is a product of powers: $${b}^{x + ${k}} = ${b}^x \\times ${b}^{${k}} = ${b}^x \\times ${b ** k}$.`,
            `指数是和时，可写成幂的乘积：$${b}^{x + ${k}} = ${b}^x \\times ${b}^{${k}} = ${b}^x \\times ${b ** k}$。`,
          ),
          step(
            "Collect the coefficient",
            "合并系数",
            `$c = ${a} \\times ${b ** k} = ${a * b ** k}$.`,
            `$c = ${a} \\times ${b ** k} = ${a * b ** k}$。`,
          ),
        ],
        t(
          `At $x = 0$ the original gives $${a} \\times ${b}^{${k}} = ${a * b ** k}$, and $c(${b})^0 = c$.`,
          `当 $x = 0$ 时原式给出 $${a} \\times ${b}^{${k}} = ${a * b ** k}$，而 $c(${b})^0 = c$。`,
        ),
        [
          t(`This drops the factor $${b}^{${k}}$ that comes out of the exponent.`, `这是漏掉了从指数中分出来的因数 $${b}^{${k}}$。`),
          t(`This multiplies $${a}$ by $${k}$ instead of by $${b}^{${k}}$.`, `这是用 $${a}$ 乘 $${k}$，而不是乘 $${b}^{${k}}$。`),
          t(`This adds $${b}^{${k}}$ to $${a}$ instead of multiplying.`, `这是把 $${b}^{${k}}$ 加到 $${a}$ 上，而不是相乘。`),
        ],
      ),
    );
  }),
  spec("Constructing Exponential Growth Models", "构造指数增长模型", ["modeling-exponential-growth-with-functions"], (rng, hard) => {
    const a = rng.pick([200, 500, 800, 1000, 1500]);
    const r = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15]);
    const f = (100 + r) / 100;
    const y1 = (a * (100 + r)) / 100;
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
        worked(
          [
            step(
              "Find the growth factor",
              "求增长倍数",
              `Each year keeps $100\\%$ of the population and adds $${r}\\%$, so it is multiplied by $${100 + r}\\% = ${f}$.`,
              `每年保留 $100\\%$ 的人口并增加 $${r}\\%$，所以乘以 $${100 + r}\\% = ${f}$。`,
            ),
            step(
              "Write the model",
              "写出模型",
              `The start $${a}$ is the coefficient and the factor is applied once per year: $P(t) = ${a}(${f})^t$.`,
              `起始值 $${a}$ 是系数，每年乘一次倍数：$P(t) = ${a}(${f})^t$。`,
            ),
          ],
          t(
            `After one year, $${r}\\%$ of $${a}$ is $${(a * r) / 100}$, and $${a} + ${(a * r) / 100} = ${y1}$, which is $${a} \\times ${f}$.`,
            `一年后，$${a}$ 的 $${r}\\%$ 是 $${(a * r) / 100}$，$${a} + ${(a * r) / 100} = ${y1}$，正是 $${a} \\times ${f}$。`,
          ),
          [
            t(
              `This factor is below $1$, so the population would shrink by $${r}\\%$ each year.`,
              `这个倍数小于 $1$，人口会每年减少 $${r}\\%$。`,
            ),
            t(
              `This keeps only the $${r}\\%$ that is added and drops the $100\\%$ already there.`,
              `这是只保留了增加的 $${r}\\%$，漏掉了原有的 $100\\%$。`,
            ),
            t(`This adds $${r}$ residents a year, a linear model, not $${r}\\%$.`, `这是每年增加 $${r}$ 人，是线性模型，不是 $${r}\\%$。`),
            t(
              `This multiplies the population by $${r}$ every year, far more than $${r}\\%$ growth.`,
              `这是每年把人口乘以 $${r}$，远多于 $${r}\\%$ 的增长。`,
            ),
          ],
        ),
      );
    const v2 = (a * (100 + r) ** 2) / 10000;
    return spr(
      t(
        `An account opens with $\\$${a}$ and earns $${r}\\%$ interest per year, compounded yearly. To the nearest dollar, how much is in the account after $2$ years?`,
        `某账户存入 $\\$${a}$，年利率 $${r}\\%$，按年复利。$2$ 年后账户约有多少美元（精确到美元）？`,
      ),
      Math.round(a * f * f),
      [a + 2 * Math.round((a * r) / 100), Math.round(a * f), Math.round(a * f * f) + 10],
      worked(
        [
          step(
            "Find the yearly factor",
            "求每年的倍数",
            `Adding $${r}\\%$ each year multiplies by $${f}$.`,
            `每年增加 $${r}\\%$，相当于乘以 $${f}$。`,
          ),
          step("Apply it for the first year", "算第一年", `$${a} \\times ${f} = ${y1}$.`, `$${a} \\times ${f} = ${y1}$。`),
          step(
            "Apply it again and round",
            "再算一年并取整",
            `$${y1} \\times ${f} = ${v2} \\approx ${Math.round(a * f * f)}$.`,
            `$${y1} \\times ${f} = ${v2} \\approx ${Math.round(a * f * f)}$。`,
          ),
        ],
        t(
          `The interest is $${(a * r) / 100}$ the first year and $${(y1 * r) / 100}$ the second, and $${a} + ${(a * r) / 100} + ${(y1 * r) / 100} = ${v2}$.`,
          `第一年利息 $${(a * r) / 100}$，第二年利息 $${(y1 * r) / 100}$，$${a} + ${(a * r) / 100} + ${(y1 * r) / 100} = ${v2}$。`,
        ),
        [
          t(
            `This adds the first year's interest twice, which is simple interest; compounding also earns interest on the interest.`,
            `这是把第一年的利息加了两次，是单利；复利还要对利息计息。`,
          ),
          t(`This is the amount after $1$ year, not $2$.`, `这是 $1$ 年后的金额，不是 $2$ 年后。`),
          t(`This is $\\$10$ more than $${a}(${f})^2$; recheck the multiplication.`, `这比 $${a}(${f})^2$ 多了 $\\$10$；请重新核对乘法。`),
        ],
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
        worked(
          [
            step(
              "Find the decay factor",
              "求衰减倍数",
              `Losing $${r}\\%$ leaves $100\\% - ${r}\\% = ${100 - r}\\%$ of the value, so the factor is $${f}$.`,
              `减少 $${r}\\%$ 后剩下 $100\\% - ${r}\\% = ${100 - r}\\%$，所以倍数是 $${f}$。`,
            ),
            step(
              "Write the model",
              "写出模型",
              `The start $${a * 10}$ is the coefficient: $V(t) = ${a * 10}(${f})^t$.`,
              `起始值 $${a * 10}$ 是系数：$V(t) = ${a * 10}(${f})^t$。`,
            ),
          ],
          t(
            `After one year the car loses $${(a * 10 * r) / 100}$, leaving $${a * 10} - ${(a * 10 * r) / 100} = ${(a * 10 * (100 - r)) / 100}$, which is $${a * 10} \\times ${f}$.`,
            `一年后汽车贬值 $${(a * 10 * r) / 100}$，剩下 $${a * 10} - ${(a * 10 * r) / 100} = ${(a * 10 * (100 - r)) / 100}$，正是 $${a * 10} \\times ${f}$。`,
          ),
          [
            t(
              `This keeps only the $${r}\\%$ that is lost, not the $${100 - r}\\%$ that is left.`,
              `这是只保留了失去的 $${r}\\%$，而不是剩下的 $${100 - r}\\%$。`,
            ),
            t(`This factor is above $1$, so the value would grow by $${r}\\%$ each year.`, `这个倍数大于 $1$，价值会每年增长 $${r}\\%$。`),
            t(`This subtracts $${r}$ dollars a year, not $${r}\\%$ of the value.`, `这是每年减少 $${r}$ 美元，而不是价值的 $${r}\\%$。`),
            t(`This swaps the starting value and the percent.`, `这是把起始值和百分数对调了。`),
          ],
        ),
      );
    return spr(
      t(
        `A sample of $${a}$ grams has a half-life of $${r}$ days. How many grams remain after $${3 * r}$ days?`,
        `$${a}$ 克样品的半衰期是 $${r}$ 天。$${3 * r}$ 天后还剩多少克？`,
      ),
      a / 8,
      [(3 * a) / 8, a / 2, a / 4],
      worked(
        [
          step(
            "Count the half-lives",
            "数出半衰期的个数",
            `$\\frac{${3 * r}}{${r}} = 3$ half-lives.`,
            `$\\frac{${3 * r}}{${r}} = 3$ 个半衰期。`,
          ),
          step(
            "Halve three times",
            "减半三次",
            `$${a} \\to ${a / 2} \\to ${a / 4} \\to ${a / 8}$.`,
            `$${a} \\to ${a / 2} \\to ${a / 4} \\to ${a / 8}$。`,
          ),
        ],
        t(
          `$${a} \\times \\left(\\frac{1}{2}\\right)^3 = \\frac{${a}}{8} = ${a / 8}$.`,
          `$${a} \\times \\left(\\frac{1}{2}\\right)^3 = \\frac{${a}}{8} = ${a / 8}$。`,
        ),
        [
          t(
            `This takes $3 \\times \\frac{1}{8}$ of the sample; the halving repeats, so $\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}$ of it remains.`,
            `这是取了样品的 $3 \\times \\frac{1}{8}$；减半是重复的，剩下 $\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}$。`,
          ),
          t(`This is what remains after one half-life, $${r}$ days.`, `这是一个半衰期（$${r}$ 天）后剩下的量。`),
          t(`This is what remains after two half-lives, $${2 * r}$ days.`, `这是两个半衰期（$${2 * r}$ 天）后剩下的量。`),
        ],
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
          worked(
            [
              step(
                "Substitute the time",
                "代入时间",
                `At $t = 1$: $a \\times ${b} = ${a * b}$.`,
                `当 $t = 1$ 时：$a \\times ${b} = ${a * b}$。`,
              ),
              step(
                "Divide by the base",
                "除以底数",
                `$a = \\frac{${a * b}}{${b}} = ${a}$, the number at $t = 0$.`,
                `$a = \\frac{${a * b}}{${b}} = ${a}$，即 $t = 0$ 时的数量。`,
              ),
            ],
            t(`$N(1) = ${a} \\times ${b} = ${a * b}$.`, `$N(1) = ${a} \\times ${b} = ${a * b}$。`),
            [
              t(`This is the number after $1$ hour, not at the start.`, `这是 $1$ 小时后的数量，不是开始时的。`),
              t(
                `This multiplies by $${b}$ again instead of dividing; it is the number after $2$ hours.`,
                `这是又乘了 $${b}$ 而不是除以它；这是 $2$ 小时后的数量。`,
              ),
              t(`This is the hourly factor, not the starting number.`, `这是每小时的倍数，不是起始数量。`),
            ],
          ),
        );
      return spr(
        t(
          `A culture modeled by $N(t) = ${a}b^t$ grows from $${a}$ cells to $${a * b * b}$ cells in $2$ hours, with $b > 0$. What is the value of $b$?`,
          `模型 $N(t) = ${a}b^t$ 描述的培养物在 $2$ 小时内从 $${a}$ 个细胞增长到 $${a * b * b}$ 个，$b > 0$。$b$ 的值是多少？`,
        ),
        b,
        [b * b, a, 2 * b],
        worked(
          [
            step(
              "Substitute the time",
              "代入时间",
              `At $t = 2$: $${a}b^2 = ${a * b * b}$, so $b^2 = \\frac{${a * b * b}}{${a}} = ${b * b}$.`,
              `当 $t = 2$ 时：$${a}b^2 = ${a * b * b}$，所以 $b^2 = \\frac{${a * b * b}}{${a}} = ${b * b}$。`,
            ),
            step("Take the positive root", "取正根", `Since $b > 0$, $b = ${b}$.`, `因为 $b > 0$，所以 $b = ${b}$。`),
          ],
          t(
            `$N(2) = ${a} \\times ${b}^2 = ${a} \\times ${b * b} = ${a * b * b}$.`,
            `$N(2) = ${a} \\times ${b}^2 = ${a} \\times ${b * b} = ${a * b * b}$。`,
          ),
          [
            t(`This is $b^2$, the growth over $2$ hours; take its square root.`, `这是 $b^2$，是 $2$ 小时的增长倍数；要开平方。`),
            t(`This is the starting number, not the hourly factor.`, `这是起始数量，不是每小时的倍数。`),
            t(
              `This takes the growth over $2$ hours as $2 \\times b$; the factor is applied twice, giving $b^2$.`,
              `这是把 $2$ 小时的增长当成了 $2 \\times b$；倍数乘了两次，应为 $b^2$。`,
            ),
          ],
        ),
      );
    },
  ),
  spec("Interpreting Exponential Models", "解释指数模型", ["interpreting-exponential-growth"], (rng, hard) => {
    const a = rng.pick([120, 180, 240, 300, 450, 600, 700, 900]);
    const r = rng.pick([4, 6, 8, 12, 20]);
    const f = (100 + r) / 100;
    const [d1, d2] = [(a * r) / 100, (a * (100 + r) * r) / 10000];
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
        worked(
          [
            step(
              "Substitute zero",
              "代入零",
              `At $t = 0$ the power is $(${f})^0 = 1$, so $M(0) = ${a}$.`,
              `当 $t = 0$ 时幂为 $(${f})^0 = 1$，所以 $M(0) = ${a}$。`,
            ),
            step(
              "Interpret",
              "解释含义",
              `$t = 0$ is the year the club opened, so $${a}$ is the number of members then.`,
              `$t = 0$ 是俱乐部成立的那年，所以 $${a}$ 是那时的会员数。`,
            ),
          ],
          t(
            `A year later the model gives $M(1) = ${a} \\times ${f} = ${(a * (100 + r)) / 100}$, already different from $${a}$.`,
            `一年后模型给出 $M(1) = ${a} \\times ${f} = ${(a * (100 + r)) / 100}$，已经不是 $${a}$ 了。`,
          ),
          [
            t(`The yearly change is a percent of the members, $${r}\\%$, not $${a}$.`, `每年的变化是会员数的 $${r}\\%$，不是 $${a}$。`),
            t(`After one year the number is $${a} \\times ${f}$, not $${a}$.`, `一年后的人数是 $${a} \\times ${f}$，不是 $${a}$。`),
            t(
              `The factor $${f}$ is above $1$, so the number keeps growing and $${a}$ is the least value, not the greatest.`,
              `倍数 $${f}$ 大于 $1$，人数一直增长，$${a}$ 是最小值，不是最大值。`,
            ),
          ],
        ),
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
      worked(
        [
          step(
            "Split the factor",
            "拆开倍数",
            `$${f} = 1 + ${r / 100}$: each year keeps $100\\%$ of the members and adds $${r}\\%$.`,
            `$${f} = 1 + ${r / 100}$：每年保留 $100\\%$ 的会员并增加 $${r}\\%$。`,
          ),
          step(
            "Describe the change",
            "描述变化",
            `So membership increases by $${r}\\%$ of its current size each year.`,
            `所以会员数每年增长当前人数的 $${r}\\%$。`,
          ),
        ],
        t(
          `The first year adds $${d1}$ members and the second adds $${d2}$: the amount grows, while the percent stays $${r}\\%$.`,
          `第一年增加 $${d1}$ 人，第二年增加 $${d2}$ 人：增加的人数在变大，百分比保持 $${r}\\%$。`,
        ),
        [
          t(
            `A fixed number of new members is linear growth; here the increase is a percent and grows each year.`,
            `每年增加固定人数是线性增长；这里增加的是百分比，人数逐年变大。`,
          ),
          t(
            `The factor $${f}$ includes the $100\\%$ kept; the increase is only $${r}\\%$.`,
            `倍数 $${f}$ 包含保留的 $100\\%$；增加的只有 $${r}\\%$。`,
          ),
          t(`The factor $${f}$ is above $1$, so membership increases.`, `倍数 $${f}$ 大于 $1$，所以会员数增加。`),
        ],
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
        worked(
          [
            step(
              "Split into two cases",
              "分成两种情况",
              `The expression inside is $${k}$ units from $0$: $x - ${b} = ${k}$ or $x - ${b} = -${k}$.`,
              `绝对值内的式子与 $0$ 相距 $${k}$：$x - ${b} = ${k}$ 或 $x - ${b} = -${k}$。`,
            ),
            step("Solve each case", "分别求解", `$x = ${b + k}$ or $x = ${b - k}$.`, `$x = ${b + k}$ 或 $x = ${b - k}$。`),
          ],
          t(
            `$|${b + k} - ${b}| = ${k}$ and $|${b - k} - ${b}| = |-${k}| = ${k}$.`,
            `$|${b + k} - ${b}| = ${k}$，$|${b - k} - ${b}| = |-${k}| = ${k}$。`,
          ),
          [
            t(
              `This keeps only the case $x - ${b} = ${k}$; the case $x - ${b} = -${k}$ also works.`,
              `这是只保留了 $x - ${b} = ${k}$ 的情况；$x - ${b} = -${k}$ 也成立。`,
            ),
            t(
              `This keeps only the case $x - ${b} = -${k}$; the case $x - ${b} = ${k}$ also works.`,
              `这是只保留了 $x - ${b} = -${k}$ 的情况；$x - ${b} = ${k}$ 也成立。`,
            ),
            t(`These solve $|x + ${b}| = ${k}$: the sign of $${b}$ is flipped.`, `这是 $|x + ${b}| = ${k}$ 的解：把 $${b}$ 的符号弄反了。`),
            t(
              `This takes the center as $-${b}$ instead of $${b}$, and its second value is not $-${b} + ${k}$ either.`,
              `这是把中心当成了 $-${b}$ 而不是 $${b}$，而且第二个值也不是 $-${b} + ${k}$。`,
            ),
          ],
        ),
      );
    return spr(
      t(`What is the sum of the solutions of $${a}|x - ${b}| + 1 = ${a * k + 1}$?`, `$${a}|x - ${b}| + 1 = ${a * k + 1}$ 的解之和是多少？`),
      2 * b,
      [b, 2 * k, 2 * (b + k)],
      worked(
        [
          step(
            "Isolate the absolute value",
            "单独放好绝对值",
            `Subtract $1$: $${a}|x - ${b}| = ${a * k}$. Divide by $${a}$: $|x - ${b}| = ${k}$.`,
            `减去 $1$：$${a}|x - ${b}| = ${a * k}$。除以 $${a}$：$|x - ${b}| = ${k}$。`,
          ),
          step("Solve the two cases", "解两种情况", `$x = ${b + k}$ or $x = ${b - k}$.`, `$x = ${b + k}$ 或 $x = ${b - k}$。`),
          step("Add", "相加", `$${b + k} + ${par(b - k)} = ${2 * b}$.`, `$${b + k} + ${par(b - k)} = ${2 * b}$。`),
        ],
        t(
          `At $x = ${b + k}$: $${a} \\times ${k} + 1 = ${a * k + 1}$. The two solutions sit $${k}$ on either side of $${b}$, so they add to $2 \\times ${b}$.`,
          `当 $x = ${b + k}$ 时：$${a} \\times ${k} + 1 = ${a * k + 1}$。两个解在 $${b}$ 两侧各相距 $${k}$，所以和为 $2 \\times ${b}$。`,
        ),
        [
          t(`This is the midpoint $${b}$ of the two solutions, not their sum.`, `这是两个解的中点 $${b}$，不是它们的和。`),
          t(`This is the distance between the two solutions, not their sum.`, `这是两个解之间的距离，不是它们的和。`),
          t(`This adds $${b + k}$ twice; the other solution is $${b - k}$.`, `这是把 $${b + k}$ 加了两次；另一个解是 $${b - k}$。`),
        ],
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
        worked(
          [
            step("Clear the fraction", "去分母", `Multiply both sides by $m$: $${a * x} = ${a}m$.`, `两边乘以 $m$：$${a * x} = ${a}m$。`),
            step("Divide", "相除", `$m = \\frac{${a * x}}{${a}} = ${x}$.`, `$m = \\frac{${a * x}}{${a}} = ${x}$。`),
          ],
          t(`$\\frac{${a * x}}{${x}} = ${a}$.`, `$\\frac{${a * x}}{${x}} = ${a}$。`),
          [
            t(`This is the right side of the equation, not $m$.`, `这是方程的右边，不是 $m$。`),
            t(`This is the numerator; it still has to be divided by $${a}$.`, `这是分子；还要除以 $${a}$。`),
            t(`This multiplies the numerator by $${a}$ instead of dividing.`, `这是用 $${a}$ 乘分子，而不是相除。`),
          ],
        ),
      );
    const k = a + 1;
    return spr(
      t(
        `What value of $x$ satisfies $\\frac{${a}}{x + ${b}} = \\frac{${a * k}}{${k * (x + b)}}$?`,
        `哪个 $x$ 值满足 $\\frac{${a}}{x + ${b}} = \\frac{${a * k}}{${k * (x + b)}}$？`,
      ),
      x,
      [b, a + b, x + b],
      worked(
        [
          step(
            "Cross-multiply",
            "交叉相乘",
            `$${a} \\times ${k * (x + b)} = ${a * k}(x + ${b})$, so $${a * k * (x + b)} = ${a * k}(x + ${b})$.`,
            `$${a} \\times ${k * (x + b)} = ${a * k}(x + ${b})$，即 $${a * k * (x + b)} = ${a * k}(x + ${b})$。`,
          ),
          step(
            "Divide and solve",
            "相除并求解",
            `Divide by $${a * k}$: $x + ${b} = ${x + b}$, so $x = ${x}$.`,
            `除以 $${a * k}$：$x + ${b} = ${x + b}$，所以 $x = ${x}$。`,
          ),
        ],
        t(
          `At $x = ${x}$ the left side is $\\frac{${a}}{${x + b}}$, and the right side $\\frac{${a * k}}{${k * (x + b)}}$ reduces by $${k}$ to the same fraction.`,
          `当 $x = ${x}$ 时左边是 $\\frac{${a}}{${x + b}}$，右边 $\\frac{${a * k}}{${k * (x + b)}}$ 约去 $${k}$ 后是同一个分数。`,
        ),
        [
          t(`This is the constant in the denominator, not $x$.`, `这是分母中的常数，不是 $x$。`),
          t(
            `This adds the numerator $${a}$ to $${b}$; the numerators only cancel, and the equation fixes $x + ${b} = ${x + b}$.`,
            `这是把分子 $${a}$ 加到 $${b}$ 上；分子只会约去，方程确定的是 $x + ${b} = ${x + b}$。`,
          ),
          t(`This is the value of $x + ${b}$; subtract $${b}$ to get $x$.`, `这是 $x + ${b}$ 的值；还要减去 $${b}$ 才得到 $x$。`),
        ],
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
        worked(
          [
            step("Square both sides", "两边平方", `$x - ${b} = ${k}^2 = ${k * k}$.`, `$x - ${b} = ${k}^2 = ${k * k}$。`),
            step("Solve", "求解", `Add $${b}$: $x = ${k * k + b}$.`, `加上 $${b}$：$x = ${k * k + b}$。`),
          ],
          t(`$\\sqrt{${k * k + b} - ${b}} = \\sqrt{${k * k}} = ${k}$.`, `$\\sqrt{${k * k + b} - ${b}} = \\sqrt{${k * k}} = ${k}$。`),
          [
            t(
              `This adds $${b}$ to $${k}$ without squaring; the square root is undone by squaring.`,
              `这是没有平方就把 $${b}$ 加到 $${k}$ 上；去根号要平方。`,
            ),
            t(`This subtracts $${b}$; undoing $x - ${b}$ means adding $${b}$.`, `这是减去了 $${b}$；要还原 $x - ${b}$ 应当加上 $${b}$。`),
            t(`This doubles $${k}$ instead of squaring it.`, `这是把 $${k}$ 乘以 $2$，而不是平方。`),
          ],
        ),
      );
    return spr(
      t(
        `What value of $x$ satisfies $${a}\\sqrt{x + ${b}} - 1 = ${a * k - 1}$?`,
        `哪个 $x$ 值满足 $${a}\\sqrt{x + ${b}} - 1 = ${a * k - 1}$？`,
      ),
      k * k - b,
      [k * k + b, k - b, a * a * k * k - b],
      worked(
        [
          step(
            "Isolate the root",
            "单独放好根式",
            `Add $1$: $${a}\\sqrt{x + ${b}} = ${a * k}$. Divide by $${a}$: $\\sqrt{x + ${b}} = ${k}$.`,
            `加上 $1$：$${a}\\sqrt{x + ${b}} = ${a * k}$。除以 $${a}$：$\\sqrt{x + ${b}} = ${k}$。`,
          ),
          step(
            "Square and solve",
            "平方并求解",
            `$x + ${b} = ${k * k}$, so $x = ${k * k - b}$.`,
            `$x + ${b} = ${k * k}$，所以 $x = ${k * k - b}$。`,
          ),
        ],
        t(
          `$${a}\\sqrt{${k * k - b} + ${b}} - 1 = ${a} \\times ${k} - 1 = ${a * k - 1}$.`,
          `$${a}\\sqrt{${k * k - b} + ${b}} - 1 = ${a} \\times ${k} - 1 = ${a * k - 1}$。`,
        ),
        [
          t(`This adds $${b}$; undoing $x + ${b}$ means subtracting $${b}$.`, `这是加上了 $${b}$；要还原 $x + ${b}$ 应当减去 $${b}$。`),
          t(`This forgets to square $${k}$ before subtracting $${b}$.`, `这是减去 $${b}$ 之前忘了把 $${k}$ 平方。`),
          t(
            `This squares before dividing by $${a}$, so the $${a}$ is squared into the answer.`,
            `这是先平方再除以 $${a}$，把 $${a}$ 也平方进了答案。`,
          ),
        ],
      ),
    );
  }),
  spec("Equations Containing Multiple Radicals", "含多个根式的方程", ["solving-advanced-radical-equations"], (rng, hard) => {
    const x = rng.int(2, 12);
    const c = rng.int(1, x - 1);
    const a = rng.int(2, 5);
    if (!hard) {
      const off = (w: number) =>
        t(
          `At $x = ${w}$ the left radicand is $${(a + 1) * w - c}$ and the right is $${a * w + x - c}$; they are not equal.`,
          `当 $x = ${w}$ 时左边被开方数是 $${(a + 1) * w - c}$，右边是 $${a * w + x - c}$，二者不相等。`,
        );
      return spr(
        t(
          `What value of $x$ satisfies $\\sqrt{${a + 1}x - ${c}} = \\sqrt{${a}x + ${x - c}}$?`,
          `哪个 $x$ 值满足 $\\sqrt{${a + 1}x - ${c}} = \\sqrt{${a}x + ${x - c}}$？`,
        ),
        x,
        [x + c, x - c, 2 * x],
        worked(
          [
            step(
              "Square both sides",
              "两边平方",
              `Equal square roots have equal radicands: $${a + 1}x - ${c} = ${a}x + ${x - c}$.`,
              `平方根相等，被开方数就相等：$${a + 1}x - ${c} = ${a}x + ${x - c}$。`,
            ),
            step(
              "Solve the linear equation",
              "解一次方程",
              `Subtract $${a}x$ and add $${c}$: $x = ${x - c} + ${c} = ${x}$.`,
              `减去 $${a}x$ 再加上 $${c}$：$x = ${x - c} + ${c} = ${x}$。`,
            ),
          ],
          t(
            `At $x = ${x}$ both radicands are $${(a + 1) * x - c}$, which is positive, so both roots exist and are equal.`,
            `当 $x = ${x}$ 时两个被开方数都是 $${(a + 1) * x - c}$，是正数，所以两个根都存在且相等。`,
          ),
          [off(x + c), t(`This forgets to add back the $${c}$ from the left side.`, `这是忘了把左边的 $${c}$ 加回去。`), off(2 * x)],
        ),
      );
    }
    const r = rng.int(2, 8);
    const q = rng.int(1, 4);
    const n = 2 * r * q + q * q;
    return spr(
      t(
        `What value of $x$ satisfies $\\sqrt{x + ${2 * r * q + q * q}} = \\sqrt{x} + ${q}$?`,
        `哪个 $x$ 值满足 $\\sqrt{x + ${2 * r * q + q * q}} = \\sqrt{x} + ${q}$？`,
      ),
      r * r,
      [r, 2 * r, (r + q) ** 2],
      worked(
        [
          step(
            "Square both sides",
            "两边平方",
            `$x + ${n} = x + ${2 * q}\\sqrt{x} + ${q * q}$.`,
            `$x + ${n} = x + ${2 * q}\\sqrt{x} + ${q * q}$。`,
          ),
          step(
            "Isolate the root",
            "单独放好根式",
            `The $x$ terms cancel: $${2 * q}\\sqrt{x} = ${n} - ${q * q} = ${2 * r * q}$, so $\\sqrt{x} = ${r}$.`,
            `$x$ 项抵消：$${2 * q}\\sqrt{x} = ${n} - ${q * q} = ${2 * r * q}$，所以 $\\sqrt{x} = ${r}$。`,
          ),
          step("Square again", "再平方", `$x = ${r}^2 = ${r * r}$.`, `$x = ${r}^2 = ${r * r}$。`),
        ],
        t(
          `$\\sqrt{${r * r} + ${n}} = \\sqrt{${(r + q) ** 2}} = ${r + q}$, and $\\sqrt{${r * r}} + ${q} = ${r + q}$.`,
          `$\\sqrt{${r * r} + ${n}} = \\sqrt{${(r + q) ** 2}} = ${r + q}$，且 $\\sqrt{${r * r}} + ${q} = ${r + q}$。`,
        ),
        [
          t(`This is $\\sqrt{x}$; square it to get $x$.`, `这是 $\\sqrt{x}$；要平方才得到 $x$。`),
          t(`This doubles $\\sqrt{x}$ instead of squaring it.`, `这是把 $\\sqrt{x}$ 乘以 $2$，而不是平方。`),
          t(`This is the left radicand $x + ${n}$, not $x$.`, `这是左边的被开方数 $x + ${n}$，不是 $x$。`),
        ],
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
    const f = `|x ${sg(-h)}| ${sg(k)}`;
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
        worked(
          [
            step(
              "Read the vertex",
              "读出顶点",
              `The graph opens up and its lowest point is $(${h}, ${k})$.`,
              `图象开口向上，最低点是 $(${h}, ${k})$。`,
            ),
            step(
              "Write the equation",
              "写出方程",
              `$|x - h| + k$ has its vertex at $(h, k)$, so $f(x) = ${f}$.`,
              `$|x - h| + k$ 的顶点在 $(h, k)$，所以 $f(x) = ${f}$。`,
            ),
          ],
          t(
            `At $x = ${h + 1}$ the equation gives $|1| ${sg(k)} = ${k + 1}$, and the graph passes through $(${h + 1}, ${k + 1})$.`,
            `当 $x = ${h + 1}$ 时方程给出 $|1| ${sg(k)} = ${k + 1}$，图象也经过 $(${h + 1}, ${k + 1})$。`,
          ),
          [
            t(
              `This puts the vertex at $x = ${-h}$; $|x - h|$ is smallest at $x = h$.`,
              `这是把顶点放在 $x = ${-h}$；$|x - h|$ 在 $x = h$ 处最小。`,
            ),
            t(
              `This puts the vertex at height $${-k}$, but the lowest point is at height $${k}$.`,
              `这是把顶点放在高度 $${-k}$，但最低点的高度是 $${k}$。`,
            ),
            t(`This flips both coordinates of the vertex.`, `这是把顶点的两个坐标的符号都弄反了。`),
            t(`This graph opens down, but the vertex of the graph shown is its lowest point.`, `这个图象开口向下，但图中顶点是最低点。`),
          ],
        ),
        fig,
      );
    return spr(
      t(
        `The function $f$ is defined by $f(x) = |x ${sg(-h)}| ${sg(k)}$, and $g(x) = f(x) + ${n}$. What is the minimum value of $g(x)$?`,
        `函数 $f$ 定义为 $f(x) = |x ${sg(-h)}| ${sg(k)}$，且 $g(x) = f(x) + ${n}$。$g(x)$ 的最小值是多少？`,
      ),
      k + n,
      [h + n, k, h + k + n + 1],
      worked(
        [
          step(
            "Find the minimum of the inner function",
            "求原函数的最小值",
            `$|x ${sg(-h)}| \\ge 0$, with $0$ at $x = ${h}$, so the least value of $f(x)$ is $${k}$.`,
            `$|x ${sg(-h)}| \\ge 0$，在 $x = ${h}$ 处为 $0$，所以 $f(x)$ 的最小值是 $${k}$。`,
          ),
          step(
            "Shift up",
            "向上平移",
            `Adding $${n}$ raises every value: $${k} + ${n} = ${k + n}$.`,
            `加上 $${n}$ 使每个值都升高：$${k} + ${n} = ${k + n}$。`,
          ),
        ],
        t(
          `$g(${h}) = 0 ${sg(k)} + ${n} = ${k + n}$, and $g(${h + 1}) = ${k + n + 1}$ is larger.`,
          `$g(${h}) = 0 ${sg(k)} + ${n} = ${k + n}$，而 $g(${h + 1}) = ${k + n + 1}$ 更大。`,
        ),
        [
          t(`This uses the $x$-coordinate of the vertex; the minimum value is a height.`, `这是用了顶点的横坐标；最小值是高度。`),
          t(`This is the minimum of $f$, before adding $${n}$.`, `这是 $f$ 的最小值，还没有加上 $${n}$。`),
          t(
            `This mixes in the $x$-coordinate $${h}$; the minimum value is the height $${k + n}$ only.`,
            `这是混进了横坐标 $${h}$；最小值只是高度 $${k + n}$。`,
          ),
        ],
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
        worked(
          [
            step(
              "Set the numerator to zero",
              "令分子为零",
              `A fraction is zero when its numerator is zero: $x - ${r} = 0$, so $x = ${r}$.`,
              `分子为零时分式为零：$x - ${r} = 0$，所以 $x = ${r}$。`,
            ),
            step(
              "Check the denominator",
              "检查分母",
              `At $x = ${r}$ the denominator is $${r} + ${s} = ${r + s}$, not $0$.`,
              `当 $x = ${r}$ 时分母是 $${r} + ${s} = ${r + s}$，不为 $0$。`,
            ),
          ],
          t(`$f(${r}) = \\frac{0}{${r + s}} = 0$.`, `$f(${r}) = \\frac{0}{${r + s}} = 0$。`),
          [
            t(
              `At $x = ${-r}$ the numerator is $${-2 * r}$, not $0$: the sign is flipped.`,
              `当 $x = ${-r}$ 时分子是 $${-2 * r}$，不是 $0$：符号弄反了。`,
            ),
            t(
              `This reads the number in the denominator; only the numerator decides where $f$ is zero.`,
              `这是读了分母中的数；$f$ 在哪里为零只由分子决定。`,
            ),
            t(`This makes the denominator zero, where $f$ is not defined at all.`, `这使分母为零，$f$ 在那里根本没有定义。`),
          ],
        ),
      );
    return spr(
      t(
        `The function $f(x) = \\frac{${r}}{x - ${s}}$ is not defined at $x = c$. What is the value of $c$?`,
        `函数 $f(x) = \\frac{${r}}{x - ${s}}$ 在 $x = c$ 处无定义。$c$ 的值是多少？`,
      ),
      s,
      [-s, r, r + s],
      worked(
        [
          step(
            "Find where the denominator is zero",
            "找出分母为零处",
            `Division by zero is not defined, so solve $x - ${s} = 0$.`,
            `除以零没有定义，所以解 $x - ${s} = 0$。`,
          ),
          step("Solve", "求解", `$x = ${s}$, so $c = ${s}$.`, `$x = ${s}$，所以 $c = ${s}$。`),
        ],
        t(
          `At $x = ${s}$ the fraction is $\\frac{${r}}{0}$, while at $x = ${s + 1}$ it is $\\frac{${r}}{1} = ${r}$, which is defined.`,
          `当 $x = ${s}$ 时分式是 $\\frac{${r}}{0}$，而 $x = ${s + 1}$ 时是 $\\frac{${r}}{1} = ${r}$，有定义。`,
        ),
        [
          t(`This makes $x + ${s}$ zero, but the denominator is $x - ${s}$.`, `这使 $x + ${s}$ 为零，但分母是 $x - ${s}$。`),
          t(`This is the numerator; only a zero denominator leaves the function without a value.`, `这是分子，分子不会使函数无定义。`),
          t(`This adds the numerator to $${s}$; only the denominator matters.`, `这是把分子加到 $${s}$ 上；只有分母有关。`),
        ],
      ),
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
        worked(
          [
            step("Move the other term", "移走另一项", `Subtract $${c}w$: $y - ${c}w = ${a}x$.`, `减去 $${c}w$：$y - ${c}w = ${a}x$。`),
            step(
              "Divide",
              "相除",
              `Divide both sides by $${a}$: $x = \\frac{y - ${c}w}{${a}}$.`,
              `两边除以 $${a}$：$x = \\frac{y - ${c}w}{${a}}$。`,
            ),
          ],
          t(
            `Substituting back: $${a} \\times \\frac{y - ${c}w}{${a}} + ${c}w = y - ${c}w + ${c}w = y$.`,
            `代回：$${a} \\times \\frac{y - ${c}w}{${a}} + ${c}w = y - ${c}w + ${c}w = y$。`,
          ),
          [
            t(`This adds $${c}w$ instead of subtracting it.`, `这是加上了 $${c}w$，而不是减去。`),
            t(
              `This divides only $y$ by $${a}$; all of $y - ${c}w$ must be divided.`,
              `这是只把 $y$ 除以 $${a}$；整个 $y - ${c}w$ 都要除。`,
            ),
            t(`This multiplies by $${a}$ instead of dividing.`, `这是乘以 $${a}$，而不是除以。`),
            t(`This multiplies $${c}$ by $${a}$ and never divides by $${a}$.`, `这是用 $${a}$ 乘 $${c}$，却没有除以 $${a}$。`),
          ],
        ),
      );
    return mc(
      rng,
      t(
        `The formula $${a}A = ${c}h(b + d)$ relates $A$, $h$, $b$ and $d$. Which equation correctly expresses $b$?`,
        `公式 $${a}A = ${c}h(b + d)$ 把 $A$、$h$、$b$、$d$ 联系起来。哪个方程正确表示 $b$？`,
      ),
      `b = \\frac{${a}A}{${c}h} - d`,
      [`b = \\frac{${a}A - d}{${c}h}`, `b = \\frac{${a}A}{${c}h} + d`, `b = \\frac{${c}h}{${a}A} - d`, `b = ${a}A - ${c}h - d`],
      worked(
        [
          step(
            "Divide first",
            "先相除",
            `Divide by $${c}h$: $\\frac{${a}A}{${c}h} = b + d$.`,
            `除以 $${c}h$：$\\frac{${a}A}{${c}h} = b + d$。`,
          ),
          step("Subtract", "再相减", `Subtract $d$: $b = \\frac{${a}A}{${c}h} - d$.`, `减去 $d$：$b = \\frac{${a}A}{${c}h} - d$。`),
        ],
        t(
          `Substituting back: $b + d = \\frac{${a}A}{${c}h}$, and $${c}h \\times \\frac{${a}A}{${c}h} = ${a}A$.`,
          `代回：$b + d = \\frac{${a}A}{${c}h}$，且 $${c}h \\times \\frac{${a}A}{${c}h} = ${a}A$。`,
        ),
        [
          t(
            `This subtracts $d$ before dividing; $d$ is inside the parentheses, so divide by $${c}h$ first.`,
            `这是先减 $d$ 再除；$d$ 在括号内，要先除以 $${c}h$。`,
          ),
          t(`This adds $d$ instead of subtracting it.`, `这是加上了 $d$，而不是减去。`),
          t(`This turns the fraction upside down.`, `这是把分数倒过来了。`),
          t(`This subtracts $${c}h$ instead of dividing by it.`, `这是减去 $${c}h$，而不是除以它。`),
        ],
      ),
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
        worked(
          [
            step("Move the other term", "移走另一项", `Subtract $${a}x$: $${b}y = z - ${a}x$.`, `减去 $${a}x$：$${b}y = z - ${a}x$。`),
            step(
              "Divide",
              "相除",
              `Divide everything by $${b}$: $y = \\frac{z - ${a}x}{${b}}$.`,
              `全部除以 $${b}$：$y = \\frac{z - ${a}x}{${b}}$。`,
            ),
          ],
          t(
            `Substituting back: $${a}x + ${b} \\times \\frac{z - ${a}x}{${b}} = ${a}x + z - ${a}x = z$.`,
            `代回：$${a}x + ${b} \\times \\frac{z - ${a}x}{${b}} = ${a}x + z - ${a}x = z$。`,
          ),
          [
            t(`This adds $${a}x$ instead of subtracting it.`, `这是加上了 $${a}x$，而不是减去。`),
            t(
              `This divides only $${a}x$ by $${b}$; all of $z - ${a}x$ must be divided.`,
              `这是只把 $${a}x$ 除以 $${b}$；整个 $z - ${a}x$ 都要除。`,
            ),
            t(`This turns the fraction upside down.`, `这是把分数倒过来了。`),
            t(`This mixes up the coefficients and divides by their sum.`, `这是把系数弄混了，还除以了它们的和。`),
          ],
        ),
      );
    return mc(
      rng,
      t(
        `If $ax + ${b} = cx + ${b + d}$, where $a \\ne c$, which expression gives $x$?`,
        `若 $ax + ${b} = cx + ${b + d}$，其中 $a \\ne c$，哪个式子给出 $x$？`,
      ),
      `\\frac{${d}}{a - c}`,
      [`\\frac{${d}}{c - a}`, `\\frac{${d}}{a + c}`, `${d}(a - c)`, `\\frac{a - c}{${d}}`],
      worked(
        [
          step(
            "Collect the terms",
            "整理各项",
            `Subtract $cx$ and $${b}$: $ax - cx = ${b + d} - ${b} = ${d}$.`,
            `减去 $cx$ 和 $${b}$：$ax - cx = ${b + d} - ${b} = ${d}$。`,
          ),
          step(
            "Factor and divide",
            "提取公因式并相除",
            `$x(a - c) = ${d}$, and $a - c \\ne 0$, so $x = \\frac{${d}}{a - c}$.`,
            `$x(a - c) = ${d}$，且 $a - c \\ne 0$，所以 $x = \\frac{${d}}{a - c}$。`,
          ),
        ],
        t(
          `The two sides differ by $(a - c)x - ${d}$, and with $x = \\frac{${d}}{a - c}$ this is $${d} - ${d} = 0$.`,
          `两边之差为 $(a - c)x - ${d}$，当 $x = \\frac{${d}}{a - c}$ 时它等于 $${d} - ${d} = 0$。`,
        ),
        [
          t(`This drops a sign: collecting on the right gives $(c - a)x = -${d}$.`, `这是丢了一个负号：移到右边得 $(c - a)x = -${d}$。`),
          t(`This adds $cx$ instead of subtracting it.`, `这是加上了 $cx$，而不是减去。`),
          t(`This multiplies by $a - c$ instead of dividing.`, `这是乘以 $a - c$，而不是除以。`),
          t(`This turns the fraction upside down.`, `这是把分数倒过来了。`),
        ],
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
        worked(
          [
            step(
              "Clear the fraction",
              "去分母",
              `Multiply both sides by $${d}r$: $${d}pr = ${a}q$.`,
              `两边乘以 $${d}r$：$${d}pr = ${a}q$。`,
            ),
            step("Divide", "相除", `Divide by $${d}p$: $r = \\frac{${a}q}{${d}p}$.`, `除以 $${d}p$：$r = \\frac{${a}q}{${d}p}$。`),
          ],
          t(
            `Substituting back: $${d}r = ${d} \\times \\frac{${a}q}{${d}p} = \\frac{${a}q}{p}$, and $\\frac{${a}q}{${a}q / p} = p$.`,
            `代回：$${d}r = ${d} \\times \\frac{${a}q}{${d}p} = \\frac{${a}q}{p}$，而 $\\frac{${a}q}{${a}q / p} = p$。`,
          ),
          [
            t(`This turns the answer upside down.`, `这是把答案倒过来了。`),
            t(`This multiplies by $p$ instead of dividing by it.`, `这是乘以 $p$，而不是除以它。`),
            t(`This swaps the coefficients $${a}$ and $${d}$.`, `这是把系数 $${a}$ 和 $${d}$ 对调了。`),
            t(`This subtracts instead of clearing the fraction.`, `这是用了减法，而不是去分母。`),
          ],
        ),
      );
    return mc(
      rng,
      t(
        `If $\\frac{${d}}{x} + \\frac{${a}}{y} = \\frac{1}{z}$, with all variables positive, which expression gives $z$?`,
        `若 $\\frac{${d}}{x} + \\frac{${a}}{y} = \\frac{1}{z}$，各变量都为正，哪个式子给出 $z$？`,
      ),
      `\\frac{xy}{${d}y + ${a}x}`,
      [`\\frac{x}{${d}} + \\frac{y}{${a}}`, `\\frac{${d}y + ${a}x}{xy}`, `\\frac{xy}{${d}x + ${a}y}`, `\\frac{${a * d}xy}{x + y}`],
      worked(
        [
          step(
            "Use a common denominator",
            "通分",
            `$\\frac{${d}}{x} = \\frac{${d}y}{xy}$ and $\\frac{${a}}{y} = \\frac{${a}x}{xy}$.`,
            `$\\frac{${d}}{x} = \\frac{${d}y}{xy}$，$\\frac{${a}}{y} = \\frac{${a}x}{xy}$。`,
          ),
          step("Add", "相加", `$\\frac{${d}y + ${a}x}{xy} = \\frac{1}{z}$.`, `$\\frac{${d}y + ${a}x}{xy} = \\frac{1}{z}$。`),
          step("Take reciprocals", "取倒数", `$z = \\frac{xy}{${d}y + ${a}x}$.`, `$z = \\frac{xy}{${d}y + ${a}x}$。`),
        ],
        t(
          `Try $x = ${d}$ and $y = ${a}$: the left side is $1 + 1 = 2$, so $z = \\frac{1}{2}$, and the answer gives $\\frac{${a * d}}{${a * d} + ${a * d}} = \\frac{1}{2}$.`,
          `取 $x = ${d}$，$y = ${a}$：左边为 $1 + 1 = 2$，所以 $z = \\frac{1}{2}$，答案给出 $\\frac{${a * d}}{${a * d} + ${a * d}} = \\frac{1}{2}$。`,
        ),
        [
          t(
            `This takes reciprocals term by term; the reciprocal of a sum is not the sum of the reciprocals.`,
            `这是逐项取倒数；和的倒数不等于倒数的和。`,
          ),
          t(`This is $\\frac{1}{z}$, not $z$.`, `这是 $\\frac{1}{z}$，不是 $z$。`),
          t(
            `This pairs each numerator with the wrong variable: $\\frac{${d}}{x}$ becomes $\\frac{${d}y}{xy}$, not $\\frac{${d}x}{xy}$.`,
            `这是把分子配错了变量：$\\frac{${d}}{x}$ 应化为 $\\frac{${d}y}{xy}$，不是 $\\frac{${d}x}{xy}$。`,
          ),
          t(`This multiplies the numerators instead of adding the fractions.`, `这是把分子相乘，而不是把分式相加。`),
        ],
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
        worked(
          [
            step("Subtract the constant", "减去常数", `$V - ${d} = ${a}r^2h$.`, `$V - ${d} = ${a}r^2h$。`),
            step("Divide", "相除", `$r^2 = \\frac{V - ${d}}{${a}h}$.`, `$r^2 = \\frac{V - ${d}}{${a}h}$。`),
            step(
              "Take the positive root",
              "取正根",
              `Since $r > 0$, $r = \\sqrt{\\frac{V - ${d}}{${a}h}}$.`,
              `因为 $r > 0$，$r = \\sqrt{\\frac{V - ${d}}{${a}h}}$。`,
            ),
          ],
          t(
            `Substituting back: $r^2 = \\frac{V - ${d}}{${a}h}$, so $${a}r^2h + ${d} = V - ${d} + ${d} = V$.`,
            `代回：$r^2 = \\frac{V - ${d}}{${a}h}$，所以 $${a}r^2h + ${d} = V - ${d} + ${d} = V$。`,
          ),
          [
            t(`This is $r^2$; the square root is missing.`, `这是 $r^2$；缺了平方根。`),
            t(`This subtracts $${d}$ after taking the root; it must be subtracted first.`, `这是开方后才减 $${d}$；应当先减。`),
            t(`This takes the root of the numerator only.`, `这是只对分子开方。`),
            t(`This multiplies by $${a}h$ instead of dividing.`, `这是乘以 $${a}h$，而不是除以。`),
          ],
        ),
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
      worked(
        [
          step("Divide", "相除", `$\\frac{T}{${a}} = \\sqrt{\\frac{L}{${e}g}}$.`, `$\\frac{T}{${a}} = \\sqrt{\\frac{L}{${e}g}}$。`),
          step("Square", "平方", `$\\frac{T^2}{${a * a}} = \\frac{L}{${e}g}$.`, `$\\frac{T^2}{${a * a}} = \\frac{L}{${e}g}$。`),
          step(
            "Multiply",
            "相乘",
            `Multiply by $${e}g$: $L = \\frac{${e}gT^2}{${a * a}}$.`,
            `乘以 $${e}g$：$L = \\frac{${e}gT^2}{${a * a}}$。`,
          ),
        ],
        t(
          `Substituting back: $\\frac{L}{${e}g} = \\frac{T^2}{${a * a}}$, whose square root is $\\frac{T}{${a}}$, and $${a} \\times \\frac{T}{${a}} = T$.`,
          `代回：$\\frac{L}{${e}g} = \\frac{T^2}{${a * a}}$，其平方根为 $\\frac{T}{${a}}$，而 $${a} \\times \\frac{T}{${a}} = T$。`,
        ),
        [
          t(`This never squares, so the square root is not undone.`, `这是没有平方，根号没有去掉。`),
          t(`This divides by $${e}g$ instead of multiplying by it.`, `这是除以 $${e}g$，而不是乘以它。`),
          t(`This multiplies by $${a * a}$ instead of dividing.`, `这是乘以 $${a * a}$，而不是除以。`),
          t(`This squares $T$ but not $${a}$.`, `这是只把 $T$ 平方，没有把 $${a}$ 平方。`),
        ],
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
      const y0 = -a * r * s;
      const eq = `${a === 1 ? "" : "-"}(x + ${r})(x - ${s})`;
      const up = a > 0;
      const shape = t(
        `The parabola crosses the $x$-axis at $x = ${-r}$ and $x = ${s}$ and opens ${up ? "up" : "down"}, so it is $y = ${eq}$.`,
        `抛物线与 $x$ 轴交于 $x = ${-r}$ 和 $x = ${s}$，开口向${up ? "上" : "下"}，所以它是 $y = ${eq}$。`,
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
          worked(
            [
              step(
                "Find the y-axis",
                "找到纵轴",
                `The $y$-intercept is where the graph meets the $y$-axis, the line $x = 0$.`,
                `$y$ 轴截距是图象与 $y$ 轴（直线 $x = 0$）的交点。`,
              ),
              step(
                "Read the height",
                "读出高度",
                `There the graph is at height $${y0}$, so the $y$-intercept is $(0, ${y0})$.`,
                `图象在那里的高度是 $${y0}$，所以 $y$ 轴截距是 $(0, ${y0})$。`,
              ),
            ],
            t(`${shape.en} At $x = 0$ this is $${y0}$.`, `${shape["zh-CN"]}当 $x = 0$ 时它等于 $${y0}$。`),
            [
              t(`This is an $x$-intercept, where the graph meets the $x$-axis.`, `这是 $x$ 轴截距，是图象与 $x$ 轴的交点。`),
              t(`This is an $x$-intercept, where the graph meets the $x$-axis.`, `这是 $x$ 轴截距，是图象与 $x$ 轴的交点。`),
              t(
                `This adds the distances to the two $x$-intercepts; the height at $x = 0$ is $${y0}$.`,
                `这是把到两个 $x$ 轴截距的距离相加；$x = 0$ 处的高度是 $${y0}$。`,
              ),
              t(
                `This has the right size but the wrong sign: the graph crosses the $y$-axis ${y0 < 0 ? "below" : "above"} the $x$-axis.`,
                `大小对了但符号错了：图象在 $x$ 轴${y0 < 0 ? "下" : "上"}方穿过 $y$ 轴。`,
              ),
            ],
          ),
          fig,
        );
      return spr(
        t(`The graph of $y = f(x)$ is shown. What is the positive $x$-intercept?`, `图中是 $y = f(x)$ 的图象。正的 $x$ 轴截距是多少？`),
        s,
        [-r, r * s, r + s],
        worked(
          [
            step(
              "Find the x-intercepts",
              "找出横轴截距",
              `The graph meets the $x$-axis at $x = ${-r}$ and $x = ${s}$.`,
              `图象与 $x$ 轴交于 $x = ${-r}$ 和 $x = ${s}$。`,
            ),
            step("Pick the positive one", "选出正的那个", `The positive $x$-intercept is $${s}$.`, `正的 $x$ 轴截距是 $${s}$。`),
          ],
          t(`${shape.en} At $x = ${s}$ the factor $x - ${s}$ is $0$.`, `${shape["zh-CN"]}当 $x = ${s}$ 时因式 $x - ${s}$ 为 $0$。`),
          [
            t(`This is the negative $x$-intercept.`, `这是负的 $x$ 轴截距。`),
            t(`This is the size of the $y$-intercept, a height on the $y$-axis.`, `这是 $y$ 轴截距的大小，是 $y$ 轴上的高度。`),
            t(`This adds the distances to both $x$-intercepts.`, `这是把到两个 $x$ 轴截距的距离相加。`),
          ],
        ),
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
      const check = t(
        `The line falls $${full}$ gallons over $${hours}$ hours, $${rate}$ per hour, from $${full}$ at $x = 0$ to $0$ at $x = ${hours}$.`,
        `直线在 $${hours}$ 小时内下降 $${full}$ 加仑，每小时 $${rate}$ 加仑，从 $x = 0$ 时的 $${full}$ 降到 $x = ${hours}$ 时的 $0$。`,
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
          worked(
            [
              step(
                "Read the intercept",
                "读出截距",
                `The graph meets the $y$-axis at $(0, ${full})$.`,
                `图象与 $y$ 轴交于 $(0, ${full})$。`,
              ),
              step(
                "Interpret",
                "解释含义",
                `$x = 0$ means no time has passed, so $${full}$ gallons is the water in the tank before draining starts.`,
                `$x = 0$ 表示还没有经过时间，所以 $${full}$ 加仑是开始排水前水箱中的水量。`,
              ),
            ],
            check,
            [
              t(`The time to empty the tank is the $x$-intercept, $${hours}$ hours.`, `排空所需的时间是 $x$ 轴截距，$${hours}$ 小时。`),
              t(`The rate is the slope of the line, $${rate}$ gallons per hour.`, `速率是直线的斜率，每小时 $${rate}$ 加仑。`),
              t(
                `After one hour the water left is $${full - rate}$ gallons, the height at $x = 1$.`,
                `一小时后剩余 $${full - rate}$ 加仑，是 $x = 1$ 处的高度。`,
              ),
            ],
          ),
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
        worked(
          [
            step(
              "Read the intercept",
              "读出截距",
              `The graph meets the $x$-axis at $(${hours}, 0)$.`,
              `图象与 $x$ 轴交于 $(${hours}, 0)$。`,
            ),
            step(
              "Interpret",
              "解释含义",
              `There the water left is $0$ gallons, so $${hours}$ hours is when the tank becomes empty.`,
              `那里剩余水量为 $0$ 加仑，所以 $${hours}$ 小时是水箱变空的时间。`,
            ),
          ],
          t(
            `${check.en} So $${full}$ gallons last $\\frac{${full}}{${rate}} = ${hours}$ hours.`,
            `${check["zh-CN"]}所以 $${full}$ 加仑可排 $\\frac{${full}}{${rate}} = ${hours}$ 小时。`,
          ),
          [
            t(`The water in the full tank is the $y$-intercept, $${full}$ gallons.`, `满箱时的水量是 $y$ 轴截距，$${full}$ 加仑。`),
            t(`The rate is the slope of the line, $${rate}$ gallons per hour.`, `速率是直线的斜率，每小时 $${rate}$ 加仑。`),
            t(
              `One hour drains $${rate}$ gallons, the drop from $x = 0$ to $x = 1$.`,
              `一小时排出 $${rate}$ 加仑，是从 $x = 0$ 到 $x = 1$ 的下降量。`,
            ),
          ],
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
      const combine = step(
        "Set the right sides equal",
        "令右边相等",
        `$x^2 ${sg(c)} = ${m}x ${sg(c - r * s)}$; the $${c}$ cancels, leaving $x^2 - ${m}x + ${r * s} = 0$.`,
        `$x^2 ${sg(c)} = ${m}x ${sg(c - r * s)}$；$${c}$ 抵消，得 $x^2 - ${m}x + ${r * s} = 0$。`,
      );
      const factor = step(
        "Factor",
        "因式分解",
        `$(x - ${r})(x - ${s}) = 0$, so $x = ${r}$ or $x = ${s}$.`,
        `$(x - ${r})(x - ${s}) = 0$，所以 $x = ${r}$ 或 $x = ${s}$。`,
      );
      if (!hard)
        return mcExact(
          rng,
          t(`Which value of $x$ is part of a solution of the system $${sys(c)}$?`, `哪个 $x$ 值是方程组 $${sys(c)}$ 的解的一部分？`),
          s,
          [-s, m, r === 1 ? -r : r * s],
          worked(
            [combine, factor, step("Match the options", "对照选项", `Of the two, $${s}$ is listed.`, `两个值中，选项里有 $${s}$。`)],
            t(
              `$${s}^2 - ${m} \\times ${s} + ${r * s} = ${s * s} - ${m * s} + ${r * s} = 0$.`,
              `$${s}^2 - ${m} \\times ${s} + ${r * s} = ${s * s} - ${m * s} + ${r * s} = 0$。`,
            ),
            [
              t(
                `This flips the sign: the factors are $x - ${r}$ and $x - ${s}$, so both solutions are positive.`,
                `这是把符号弄反了：因式是 $x - ${r}$ 和 $x - ${s}$，两个解都是正的。`,
              ),
              t(`This is the sum of the two solutions, not a solution.`, `这是两个解之和，不是解。`),
              r === 1
                ? t(`This flips the sign of the solution $1$.`, `这是把解 $1$ 的符号弄反了。`)
                : t(`This is the product of the two solutions, not a solution.`, `这是两个解之积，不是解。`),
            ],
          ),
        );
      return spr(
        t(
          `The system $${sys(c)}$ has solutions $(x_1, y_1)$ and $(x_2, y_2)$. What is the value of $x_1 + x_2$?`,
          `方程组 $${sys(c)}$ 的解为 $(x_1, y_1)$ 和 $(x_2, y_2)$。$x_1 + x_2$ 的值是多少？`,
        ),
        m,
        [r * s, -m, c],
        worked(
          [combine, factor, step("Add", "相加", `$x_1 + x_2 = ${r} + ${s} = ${m}$.`, `$x_1 + x_2 = ${r} + ${s} = ${m}$。`)],
          t(
            `For $x^2 + Bx + C = 0$ the solutions add to $-B$, and here $-B = ${m}$.`,
            `对 $x^2 + Bx + C = 0$，两解之和为 $-B$，这里 $-B = ${m}$。`,
          ),
          [
            t(`This is the product of the solutions, not their sum.`, `这是两个解之积，不是和。`),
            t(
              `This keeps the sign of the $x$ coefficient; the sum of the solutions is its opposite.`,
              `这是保留了一次项系数的符号；解之和是它的相反数。`,
            ),
            t(`This is the constant $${c}$ from the system, which cancels.`, `这是方程组中的常数 $${c}$，它会抵消。`),
          ],
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
      const solve = [
        step(
          "Set the right sides equal",
          "令右边相等",
          `$${a}x^2 + ${c} = ${b}x$, so $${a}x^2 - ${b}x + ${c} = 0$.`,
          `$${a}x^2 + ${c} = ${b}x$，即 $${a}x^2 - ${b}x + ${c} = 0$。`,
        ),
        step(
          "Divide and factor",
          "相除并因式分解",
          `Divide by $${a}$: $x^2 - ${r + s}x + ${r * s} = 0$, so $(x - ${r})(x - ${s}) = 0$ and $x = ${r}$ or $x = ${s}$.`,
          `除以 $${a}$：$x^2 - ${r + s}x + ${r * s} = 0$，即 $(x - ${r})(x - ${s}) = 0$，$x = ${r}$ 或 $x = ${s}$。`,
        ),
      ];
      if (!hard)
        return mc(
          rng,
          t(
            `Which is a solution of the system $y = ${a}x^2 + ${c}$ and $y = ${b}x$?`,
            `哪个是方程组 $y = ${a}x^2 + ${c}$ 和 $y = ${b}x$ 的解？`,
          ),
          `(${r}, ${b * r})`,
          [`(${r}, ${a * r * r})`, `(${-r}, ${-b * r})`, `(${r + s}, ${b * r})`, `(${s}, ${b * r})`],
          worked(
            [
              ...solve,
              step(
                "Find y",
                "求纵坐标",
                `At $x = ${r}$: $y = ${b} \\times ${r} = ${b * r}$.`,
                `当 $x = ${r}$ 时：$y = ${b} \\times ${r} = ${b * r}$。`,
              ),
            ],
            t(
              `The parabola gives $${a} \\times ${r * r} + ${c} = ${a * r * r + c}$ at $x = ${r}$, the same as the line.`,
              `抛物线在 $x = ${r}$ 处给出 $${a} \\times ${r * r} + ${c} = ${a * r * r + c}$，与直线相同。`,
            ),
            [
              t(`This drops the constant $${c}$ when finding $y$ on the parabola.`, `这是在抛物线上求 $y$ 时漏掉了常数 $${c}$。`),
              t(`This flips the signs; both solutions have positive $x$.`, `这是把符号弄反了；两个解的 $x$ 都是正的。`),
              t(`This uses the sum of the two $x$-values as $x$.`, `这是把两个 $x$ 值之和当成了 $x$。`),
              t(
                `$${s}$ is the other $x$-value, but there the line gives $y = ${b * s}$, not $${b * r}$.`,
                `$${s}$ 是另一个 $x$ 值，但直线在那里给出 $y = ${b * s}$，不是 $${b * r}$。`,
              ),
            ],
          ),
        );
      return spr(
        t(
          `The system $y = ${a}x^2 + ${c}$ and $y = ${b}x$ has two solutions. What is the greater value of $y$?`,
          `方程组 $y = ${a}x^2 + ${c}$ 和 $y = ${b}x$ 有两个解。$y$ 的较大值是多少？`,
        ),
        b * s,
        [b * r, s, c],
        worked(
          [
            ...solve,
            step(
              "Find the greater y",
              "求较大的纵坐标",
              `The line rises, so the greater $y$ is at $x = ${s}$: $${b} \\times ${s} = ${b * s}$.`,
              `直线上升，所以较大的 $y$ 在 $x = ${s}$ 处：$${b} \\times ${s} = ${b * s}$。`,
            ),
          ],
          t(
            `The parabola gives $${a} \\times ${s * s} + ${c} = ${a * s * s + c}$ at $x = ${s}$, the same as the line.`,
            `抛物线在 $x = ${s}$ 处给出 $${a} \\times ${s * s} + ${c} = ${a * s * s + c}$，与直线相同。`,
          ),
          [
            t(`This is the $y$-value at $x = ${r}$, the smaller one.`, `这是 $x = ${r}$ 处的 $y$ 值，是较小的。`),
            t(`This is the $x$-value, not $y$.`, `这是 $x$ 值，不是 $y$。`),
            t(`This is the constant $${c}$ of the parabola.`, `这是抛物线的常数 $${c}$。`),
          ],
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
          worked(
            [
              step(
                "Factor the difference of squares",
                "分解平方差",
                `$x^2 - y^2 = (x + y)(x - y)$, so $${p + q}(x - y) = ${(p + q) * u}$.`,
                `$x^2 - y^2 = (x + y)(x - y)$，所以 $${p + q}(x - y) = ${(p + q) * u}$。`,
              ),
              step(
                "Divide",
                "相除",
                `$x - y = \\frac{${(p + q) * u}}{${p + q}} = ${u}$.`,
                `$x - y = \\frac{${(p + q) * u}}{${p + q}} = ${u}$。`,
              ),
            ],
            t(`$${p + q} \\times ${u} = ${(p + q) * u}$.`, `$${p + q} \\times ${u} = ${(p + q) * u}$。`),
            [
              t(`This is $x^2 - y^2$, not $x - y$.`, `这是 $x^2 - y^2$，不是 $x - y$。`),
              t(`This is $x + y$, not $x - y$.`, `这是 $x + y$，不是 $x - y$。`),
              t(`This subtracts $x + y$ instead of dividing by it.`, `这是减去 $x + y$，而不是除以它。`),
            ],
          ),
        );
      return spr(
        t(
          `If $xy = ${p * q}$ and $x + y = ${p + q}$, what is the value of $x^2 + y^2$?`,
          `若 $xy = ${p * q}$，$x + y = ${p + q}$，则 $x^2 + y^2$ 的值是多少？`,
        ),
        p * p + q * q,
        [(p + q) ** 2, (p + q) ** 2 + 2 * p * q, p + q],
        worked(
          [
            step(
              "Expand the square of the sum",
              "展开和的平方",
              `$(x + y)^2 = x^2 + 2xy + y^2$, so $x^2 + y^2 = (x + y)^2 - 2xy$.`,
              `$(x + y)^2 = x^2 + 2xy + y^2$，所以 $x^2 + y^2 = (x + y)^2 - 2xy$。`,
            ),
            step(
              "Substitute",
              "代入",
              `$${p + q}^2 - 2 \\times ${p * q} = ${(p + q) ** 2} - ${2 * p * q} = ${p * p + q * q}$.`,
              `$${p + q}^2 - 2 \\times ${p * q} = ${(p + q) ** 2} - ${2 * p * q} = ${p * p + q * q}$。`,
            ),
          ],
          t(
            `$x = ${p}$ and $y = ${q}$ fit both equations, and $${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${p * p + q * q}$.`,
            `$x = ${p}$，$y = ${q}$ 满足两个方程，且 $${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${p * p + q * q}$。`,
          ),
          [
            t(`This is $(x + y)^2$, which still contains $2xy$.`, `这是 $(x + y)^2$，其中还含有 $2xy$。`),
            t(`This adds $2xy$ instead of subtracting it.`, `这是加上了 $2xy$，而不是减去。`),
            t(`This is $x + y$, not $x^2 + y^2$.`, `这是 $x + y$，不是 $x^2 + y^2$。`),
          ],
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
      if (!hard) {
        const c = d - (m * m) / 4;
        return spr(
          t(
            `The system $y = x^2 + ${d}$ and $y = ${m}x + c$ has exactly one solution, where $c$ is a constant. What is the value of $c$?`,
            `方程组 $y = x^2 + ${d}$ 和 $y = ${m}x + c$ 恰有一个解，其中 $c$ 是常数。$c$ 的值是多少？`,
          ),
          d - (m * m) / 4,
          [d + (m * m) / 4, (m * m) / 4, m + d],
          worked(
            [
              step(
                "Set the right sides equal",
                "令右边相等",
                `$x^2 + ${d} = ${m}x + c$, so $x^2 - ${m}x + ${d} - c = 0$.`,
                `$x^2 + ${d} = ${m}x + c$，即 $x^2 - ${m}x + ${d} - c = 0$。`,
              ),
              step(
                "Make the discriminant zero",
                "令判别式为零",
                `One solution needs $${m}^2 - 4(${d} - c) = 0$, so $${d} - c = \\frac{${m * m}}{4} = ${(m * m) / 4}$.`,
                `恰有一个解要求 $${m}^2 - 4(${d} - c) = 0$，所以 $${d} - c = \\frac{${m * m}}{4} = ${(m * m) / 4}$。`,
              ),
              step("Solve", "求解", `$c = ${d} - ${(m * m) / 4} = ${c}$.`, `$c = ${d} - ${(m * m) / 4} = ${c}$。`),
            ],
            t(
              `With this $c$ the equation is $x^2 - ${m}x + ${(m * m) / 4} = (x - ${m / 2})^2 = 0$, which has the single solution $x = ${m / 2}$.`,
              `取这个 $c$，方程为 $x^2 - ${m}x + ${(m * m) / 4} = (x - ${m / 2})^2 = 0$，只有一个解 $x = ${m / 2}$。`,
            ),
            [
              t(
                `This adds $${(m * m) / 4}$ to $${d}$; solving $${d} - c = ${(m * m) / 4}$ subtracts it.`,
                `这是把 $${(m * m) / 4}$ 加到 $${d}$ 上；由 $${d} - c = ${(m * m) / 4}$ 应当减去它。`,
              ),
              t(`This is $${d} - c$, not $c$.`, `这是 $${d} - c$，不是 $c$。`),
              t(
                `This adds $${m}$ and $${d}$; the condition comes from the discriminant.`,
                `这是把 $${m}$ 和 $${d}$ 相加；条件来自判别式。`,
              ),
            ],
          ),
        );
      }
      const qx = cx(q, "x^2");
      const four = q === 1 ? `4 \\times ${q * a * a}` : `4 \\times ${q} \\times ${q * a * a}`;
      return spr(
        t(
          `The system $y = ${q === 1 ? "" : q}x^2 + ${q * a * a}$ and $y = kx$ has exactly one solution, and $k > 0$. What is the value of $k$?`,
          `方程组 $y = ${q === 1 ? "" : q}x^2 + ${q * a * a}$ 和 $y = kx$ 恰有一个解，且 $k > 0$。$k$ 的值是多少？`,
        ),
        2 * q * a,
        [q * a, q * a * a, 4 * q * q * a * a],
        worked(
          [
            step("Set the right sides equal", "令右边相等", `$${qx} - kx + ${q * a * a} = 0$.`, `$${qx} - kx + ${q * a * a} = 0$。`),
            step(
              "Make the discriminant zero",
              "令判别式为零",
              `$k^2 - ${four} = 0$, so $k^2 = ${4 * q * q * a * a}$.`,
              `$k^2 - ${four} = 0$，所以 $k^2 = ${4 * q * q * a * a}$。`,
            ),
            step("Take the positive root", "取正根", `Since $k > 0$, $k = ${2 * q * a}$.`, `因为 $k > 0$，$k = ${2 * q * a}$。`),
          ],
          t(
            `With $k = ${2 * q * a}$ the equation is $${qx} - ${2 * q * a}x + ${q * a * a} = ${q === 1 ? "" : q}(x - ${a})^2 = 0$, with the single solution $x = ${a}$.`,
            `取 $k = ${2 * q * a}$，方程为 $${qx} - ${2 * q * a}x + ${q * a * a} = ${q === 1 ? "" : q}(x - ${a})^2 = 0$，只有一个解 $x = ${a}$。`,
          ),
          [
            t(
              `This leaves out the factor $2$: $k^2 = ${4 * q * q * a * a}$ gives $k = ${2 * q * a}$.`,
              `这是漏掉了因数 $2$：$k^2 = ${4 * q * q * a * a}$ 得 $k = ${2 * q * a}$。`,
            ),
            t(`This is the constant term, not $k$.`, `这是常数项，不是 $k$。`),
            t(`This is $k^2$; take its positive square root.`, `这是 $k^2$；要取它的正平方根。`),
          ],
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
      const one = (v: number) =>
        t(`At $c = ${v}$ the discriminant is $0$, so the system has one solution.`, `当 $c = ${v}$ 时判别式为 $0$，方程组有一个解。`);
      if (!hard && rng.bool()) {
        const under = d - (m * m) / 4;
        const ans = under - rng.int(1, 4);
        const two = (v: number) =>
          t(
            `At $c = ${v}$, above $${under}$, the discriminant is positive, so there are two solutions.`,
            `当 $c = ${v}$（大于 $${under}$）时判别式为正，有两个解。`,
          );
        return mcExact(
          rng,
          t(
            `For which value of $c$ does the system $y = -x^2 + c$ and $y = ${m}x + ${d}$ have no solution?`,
            `$c$ 取何值时，方程组 $y = -x^2 + c$ 和 $y = ${m}x + ${d}$ 无解？`,
          ),
          ans,
          [under, under + 1, under + 3],
          worked(
            [
              step(
                "Set the right sides equal",
                "令右边相等",
                `$-x^2 + c = ${m}x + ${d}$, so $x^2 + ${m}x + ${d} - c = 0$.`,
                `$-x^2 + c = ${m}x + ${d}$，即 $x^2 + ${m}x + ${d} - c = 0$。`,
              ),
              step(
                "Make the discriminant negative",
                "令判别式为负",
                `$${m}^2 - 4(${d} - c) < 0$ means $${d} - c > ${(m * m) / 4}$, so $c < ${under}$.`,
                `$${m}^2 - 4(${d} - c) < 0$ 即 $${d} - c > ${(m * m) / 4}$，所以 $c < ${under}$。`,
              ),
              step("Match the options", "对照选项", `Only $${ans}$ is less than $${under}$.`, `只有 $${ans}$ 小于 $${under}$。`),
            ],
            t(
              `At $c = ${ans}$ the discriminant is $${m * m} - 4(${d} - ${par(ans)}) = ${m * m - 4 * (d - ans)}$, which is negative.`,
              `当 $c = ${ans}$ 时判别式为 $${m * m} - 4(${d} - ${par(ans)}) = ${m * m - 4 * (d - ans)}$，是负数。`,
            ),
            [one(under), two(under + 1), two(under + 3)],
          ),
        );
      }
      if (!hard) {
        const ans = lim + rng.int(1, 4);
        const two = (v: number) =>
          t(
            `At $c = ${v}$, below $${lim}$, the discriminant is positive, so there are two solutions.`,
            `当 $c = ${v}$（小于 $${lim}$）时判别式为正，有两个解。`,
          );
        return mcExact(
          rng,
          t(
            `For which value of $c$ does the system $y = x^2 + c$ and $y = ${m}x + ${d}$ have no solution?`,
            `$c$ 取何值时，方程组 $y = x^2 + c$ 和 $y = ${m}x + ${d}$ 无解？`,
          ),
          ans,
          [lim, lim - 1, lim - 3],
          worked(
            [
              step(
                "Set the right sides equal",
                "令右边相等",
                `$x^2 + c = ${m}x + ${d}$, so $x^2 - ${m}x + c - ${d} = 0$.`,
                `$x^2 + c = ${m}x + ${d}$，即 $x^2 - ${m}x + c - ${d} = 0$。`,
              ),
              step(
                "Make the discriminant negative",
                "令判别式为负",
                `$${m}^2 - 4(c - ${d}) < 0$ means $c - ${d} > ${(m * m) / 4}$, so $c > ${lim}$.`,
                `$${m}^2 - 4(c - ${d}) < 0$ 即 $c - ${d} > ${(m * m) / 4}$，所以 $c > ${lim}$。`,
              ),
              step("Match the options", "对照选项", `Only $${ans}$ is greater than $${lim}$.`, `只有 $${ans}$ 大于 $${lim}$。`),
            ],
            t(
              `At $c = ${ans}$ the discriminant is $${m * m} - 4(${ans} - ${d}) = ${m * m - 4 * (ans - d)}$, which is negative.`,
              `当 $c = ${ans}$ 时判别式为 $${m * m} - 4(${ans} - ${d}) = ${m * m - 4 * (ans - d)}$，是负数。`,
            ),
            [one(lim), two(lim - 1), two(lim - 3)],
          ),
        );
      }
      return spr(
        t(
          `The system $y = x^2 + c$ and $y = ${m}x + ${d}$ has two solutions, and $c$ is an integer. What is the greatest possible value of $c$?`,
          `方程组 $y = x^2 + c$ 和 $y = ${m}x + ${d}$ 有两个解，且 $c$ 是整数。$c$ 的最大可能值是多少？`,
        ),
        lim - 1,
        [lim, lim + 1, m + d],
        worked(
          [
            step("Set the right sides equal", "令右边相等", `$x^2 - ${m}x + c - ${d} = 0$.`, `$x^2 - ${m}x + c - ${d} = 0$。`),
            step(
              "Make the discriminant positive",
              "令判别式为正",
              `$${m}^2 - 4(c - ${d}) > 0$ means $c - ${d} < ${(m * m) / 4}$, so $c < ${lim}$.`,
              `$${m}^2 - 4(c - ${d}) > 0$ 即 $c - ${d} < ${(m * m) / 4}$，所以 $c < ${lim}$。`,
            ),
            step(
              "Take the greatest integer",
              "取最大整数",
              `The greatest integer below $${lim}$ is $${lim - 1}$.`,
              `小于 $${lim}$ 的最大整数是 $${lim - 1}$。`,
            ),
          ],
          t(
            `At $c = ${lim - 1}$ the discriminant is $${m * m} - 4(${lim - 1} - ${d}) = 4$, positive, while at $c = ${lim}$ it is $0$.`,
            `当 $c = ${lim - 1}$ 时判别式为 $${m * m} - 4(${lim - 1} - ${d}) = 4$，为正；而 $c = ${lim}$ 时为 $0$。`,
          ),
          [
            one(lim),
            t(`At $c = ${lim + 1}$ the discriminant is negative, so there is no solution.`, `当 $c = ${lim + 1}$ 时判别式为负，没有解。`),
            t(`This adds $${m}$ and $${d}$; the boundary comes from the discriminant.`, `这是把 $${m}$ 和 $${d}$ 相加；界限来自判别式。`),
          ],
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
        worked(
          [
            step(
              "Substitute",
              "代入",
              `$x^2 + ${y} = ${x * x + y}$, so $x^2 = ${x * x}$.`,
              `$x^2 + ${y} = ${x * x + y}$，所以 $x^2 = ${x * x}$。`,
            ),
            step("Take the positive root", "取正根", `Since $x > 0$, $x = ${x}$.`, `因为 $x > 0$，$x = ${x}$。`),
          ],
          t(`$${x}^2 + ${y} = ${x * x} + ${y} = ${x * x + y}$.`, `$${x}^2 + ${y} = ${x * x} + ${y} = ${x * x + y}$。`),
          [
            t(`This is $x^2$; take its positive square root.`, `这是 $x^2$；要取它的正平方根。`),
            t(`This is the right side of the first equation, not $x$.`, `这是第一个方程的右边，不是 $x$。`),
            t(`This adds $x$ and $y$.`, `这是把 $x$ 和 $y$ 相加。`),
          ],
        ),
      );
    return spr(
      t(
        `If $y = \\frac{${x * y}}{x}$ and $y = x ${sg(y - x)}$, with $x > 0$, what is the value of $y$?`,
        `若 $y = \\frac{${x * y}}{x}$，$y = x ${sg(y - x)}$，且 $x > 0$，则 $y$ 的值是多少？`,
      ),
      y,
      [x, x * y, x + y],
      worked(
        [
          step(
            "Substitute and clear the fraction",
            "代入并去分母",
            `$x ${sg(y - x)} = \\frac{${x * y}}{x}$, so $x(x ${sg(y - x)}) = ${x * y}$ and $x^2 ${tx(y - x)} - ${x * y} = 0$.`,
            `$x ${sg(y - x)} = \\frac{${x * y}}{x}$，所以 $x(x ${sg(y - x)}) = ${x * y}$，即 $x^2 ${tx(y - x)} - ${x * y} = 0$。`,
          ),
          step(
            "Factor",
            "因式分解",
            `$(x - ${x})(x + ${y}) = 0$, and the positive solution is $x = ${x}$.`,
            `$(x - ${x})(x + ${y}) = 0$，正解为 $x = ${x}$。`,
          ),
          step("Find y", "求纵坐标", `$y = ${x} ${sg(y - x)} = ${y}$.`, `$y = ${x} ${sg(y - x)} = ${y}$。`),
        ],
        t(`$\\frac{${x * y}}{${x}} = ${y}$, which matches.`, `$\\frac{${x * y}}{${x}} = ${y}$，一致。`),
        [
          t(`This is the value of $x$, not $y$.`, `这是 $x$ 的值，不是 $y$。`),
          t(`This is the numerator $xy$, not $y$.`, `这是分子 $xy$，不是 $y$。`),
          t(`This adds $x$ and $y$.`, `这是把 $x$ 和 $y$ 相加。`),
        ],
      ),
    );
  }),
];
