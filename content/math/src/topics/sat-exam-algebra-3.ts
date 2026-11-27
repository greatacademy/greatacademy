import type { Rng } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { cx, mc, par, sg, spec, spr, step, tx, words, worked } from "../exam.ts";
import { lineFigure, pointsFigure } from "../exam-figures.ts";

// SAT Math Prep, Algebra: graphs of lines, parallel and perpendicular lines, and modeling with linear functions.

/** qx writes a rational coefficient before a variable, so that a slope of $1$ or $-1$ shows as $x$ or $-x$. */
function qx(q: Q, v = "x"): string {
  const s = q.toLatex();
  return s === "1" ? v : s === "-1" ? `-${v}` : `${s}${v}`;
}

/** lineSetup picks a line with a nonzero integer slope and a nonzero intercept. */
function lineSetup(rng: Rng): { m: number; b: number } {
  return { m: rng.nonZero(-6, 6), b: rng.nonZero(-9, 9) };
}

/** runner picks a context in which a quantity grows or falls steadily with time. */
function runner(rng: Rng) {
  return rng.pick([
    {
      en: "the height of a plant, in centimeters,",
      zh: "植物的高度（厘米）",
      tu: t("week", "周"),
      tw: t("weeks", "周"),
      start: t("the height when first measured", "首次测量时的高度"),
      up: true,
    },
    {
      en: "the balance in a savings account, in dollars,",
      zh: "储蓄账户余额（美元）",
      tu: t("month", "月"),
      tw: t("months", "个月"),
      start: t("The balance when the account was opened", "开户时的余额"),
      up: true,
    },
    {
      en: "the water in a pool, in gallons,",
      zh: "水池中的水量（加仑）",
      tu: t("hour", "小时"),
      tw: t("hours", "小时"),
      start: t("The water in the pool before filling", "注水前水池中的水量"),
      up: true,
    },
    {
      en: "the fuel in a tank, in liters,",
      zh: "油箱中的燃料（升）",
      tu: t("hour", "小时"),
      tw: t("hours", "小时"),
      start: t("the fuel before the engine started", "发动机启动前的燃料量"),
      up: false,
    },
  ] as const);
}

/** satExamAlgebra3 continues the SAT Algebra unit through graphs and linear models. */
export const satExamAlgebra3: ExamSpec[] = [
  spec("Interpreting Coefficients of Lines in Slope-Intercept Form", "解释斜截式直线的系数", ["slope-intercept-form"], (rng, hard) => {
    const c = runner(rng);
    const r = rng.int(2, 15);
    const s = rng.int(20, 90);
    const m = c.up ? r : -r;
    const eq = `y = ${c.up ? `${r}x + ${s}` : `${s * 5} - ${r}x`}`;
    const S = c.up ? s : s * 5;
    const intro = t(
      `The equation $${eq}$ models ${c.en} $x$ ${c.tw.en} after a start.`,
      `方程 $${eq}$ 表示开始 $x$ ${c.tw["zh-CN"]}后${c.zh}。`,
    );
    if (!hard)
      return words(
        rng,
        t(`${intro.en} What does the number $${S}$ represent?`, `${intro["zh-CN"]}数字 $${S}$ 表示什么？`),
        c.start,
        [
          t(`The change for each ${c.tu.en}`, `每${c.tu["zh-CN"]}的变化量`),
          t(`The value after one ${c.tu.en}`, `一${c.tu["zh-CN"]}后的值`),
          t("The number of time units elapsed", "经过的时间单位数"),
        ],
        worked(
          [
            step("Find its role", "看它的作用", `$${S}$ is the constant term; it does not multiply $x$.`, `$${S}$ 是常数项，不乘以 $x$。`),
            step(
              "Read it at the start",
              "读出起点",
              `At $x = 0$, no time has passed and $y = ${S}$, so $${S}$ is the starting value.`,
              `$x = 0$ 时还没有经过时间，$y = ${S}$，所以 $${S}$ 是初始值。`,
            ),
          ],
          t(
            `After one ${c.tu.en}, $y = ${S + m}$, which differs from $${S}$ by the rate $${r}$.`,
            `$1$ ${c.tw["zh-CN"]}后 $y = ${S + m}$，与 $${S}$ 相差变化率 $${r}$。`,
          ),
          [
            t(`The change for each ${c.tu.en} is the coefficient of $x$, $${r}$.`, `每${c.tu["zh-CN"]}的变化量是 $x$ 的系数 $${r}$。`),
            t(`After one ${c.tu.en} the value is $${S + m}$, not $${S}$.`, `$1$ ${c.tw["zh-CN"]}后的值是 $${S + m}$，不是 $${S}$。`),
            t(`The time elapsed is $x$, which varies.`, `经过的时间是 $x$，它是变化的。`),
          ],
        ),
      );
    const k = rng.int(2, 6);
    return spr(
      t(
        `${intro.en} By how much does $y$ change over $${k}$ ${c.tw.en}? Give a negative number for a decrease.`,
        `${intro["zh-CN"]}$${k}$ ${c.tw["zh-CN"]}内 $y$ 变化多少？减少时填负数。`,
      ),
      m * k,
      [r, S + m * k, -m * k],
      worked(
        [
          step(
            "Read the slope",
            "读出斜率",
            `The coefficient of $x$ is $${m}$, so $y$ changes by $${m}$ each ${c.tu.en}.`,
            `$x$ 的系数是 $${m}$，所以每${c.tu["zh-CN"]} $y$ 变化 $${m}$。`,
          ),
          step(
            "Multiply",
            "相乘",
            `Over $${k}$ ${c.tw.en} the change is $${k} \\times ${par(m)} = ${m * k}$.`,
            `$${k}$ ${c.tw["zh-CN"]}内变化 $${k} \\times ${par(m)} = ${m * k}$。`,
          ),
        ],
        t(
          `From $x = 0$ to $x = ${k}$, $y$ goes from $${S}$ to $${S + m * k}$, and $${S + m * k} - ${S} = ${m * k}$.`,
          `从 $x = 0$ 到 $x = ${k}$，$y$ 从 $${S}$ 变到 $${S + m * k}$，而 $${S + m * k} - ${S} = ${m * k}$。`,
        ),
        [
          t(
            `This is the change in one ${c.tu.en}${c.up ? "" : ", without its minus sign"}.`,
            `这是 $1$ ${c.tw["zh-CN"]}的变化量${c.up ? "" : "，还丢了负号"}。`,
          ),
          t(`This is the value of $y$ after $${k}$ ${c.tw.en}, not the change.`, `这是 $${k}$ ${c.tw["zh-CN"]}后 $y$ 的值，不是变化量。`),
          t(`This has the wrong sign: $y$ ${c.up ? "grows" : "falls"} over time.`, `符号反了：$y$ 随时间${c.up ? "增加" : "减少"}。`),
        ],
      ),
    );
  }),
  spec("Finding Equations of Lines Using Slopes and Points", "用斜率和点求直线方程", ["point-slope-form"], (rng, hard) => {
    const { m, b } = lineSetup(rng);
    const x1 = rng.int(1, 6);
    const y1 = m * x1 + b;
    const x2 = x1 + rng.int(1, 4);
    const y2 = m * x2 + b;
    const wrong = [
      `y = ${cx(m)} ${sg(y1)}`,
      `y = ${cx(-m)} ${sg(b)}`,
      `y = ${cx(m)} ${sg(-b)}`,
      `y = ${cx(m)} ${sg(b + 1)}`,
      `y = ${cx(m)} ${sg(b + 2)}`,
    ];
    const why = [
      t(`This uses the $y$-coordinate $${y1}$ of the point as the intercept.`, `这是把点的纵坐标 $${y1}$ 当成了截距。`),
      t(`This line has slope $${-m}$, not $${m}$.`, `这条直线的斜率是 $${-m}$，不是 $${m}$。`),
      t(`This intercept has the wrong sign; the point is not on this line.`, `截距的符号反了；点不在这条直线上。`),
      t(`At $x = ${x1}$ this line gives $${y1 + 1}$, not $${y1}$.`, `$x = ${x1}$ 时这条直线给出 $${y1 + 1}$，不是 $${y1}$。`),
      t(`At $x = ${x1}$ this line gives $${y1 + 2}$, not $${y1}$.`, `$x = ${x1}$ 时这条直线给出 $${y1 + 2}$，不是 $${y1}$。`),
    ];
    const intercept = step(
      "Find the intercept",
      "求截距",
      `Put the point into $y = ${cx(m)} + b$: $${y1} = ${m * x1} + b$, so $b = ${y1} - ${par(m * x1)} = ${b}$.`,
      `把点代入 $y = ${cx(m)} + b$：$${y1} = ${m * x1} + b$，所以 $b = ${y1} - ${par(m * x1)} = ${b}$。`,
    );
    const check = t(
      `$${par(m)} \\times ${x1} ${sg(b)} = ${y1}$, so $(${x1}, ${y1})$ is on $y = ${cx(m)} ${sg(b)}$.`,
      `$${par(m)} \\times ${x1} ${sg(b)} = ${y1}$，所以 $(${x1}, ${y1})$ 在 $y = ${cx(m)} ${sg(b)}$ 上。`,
    );
    if (!hard)
      return mc(
        rng,
        t(
          `A line has slope $${m}$ and passes through $(${x1}, ${y1})$. Which equation defines the line?`,
          `一条直线斜率为 $${m}$，经过点 $(${x1}, ${y1})$。哪个方程定义这条直线？`,
        ),
        `y = ${cx(m)} ${sg(b)}`,
        wrong,
        worked(
          [
            step(
              "Use the slope",
              "代入斜率",
              `Slope-intercept form with slope $${m}$ is $y = ${cx(m)} + b$.`,
              `斜率为 $${m}$ 的斜截式是 $y = ${cx(m)} + b$。`,
            ),
            intercept,
          ],
          check,
          why,
        ),
      );
    return mc(
      rng,
      t(
        `A line passes through $(${x1}, ${y1})$ and $(${x2}, ${y2})$. Which equation defines the line?`,
        `一条直线经过 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$。哪个方程定义这条直线？`,
      ),
      `y = ${cx(m)} ${sg(b)}`,
      wrong,
      worked(
        [
          step(
            "Find the slope",
            "求斜率",
            `$\\frac{${y2} - ${par(y1)}}{${x2} - ${x1}} = ${x2 - x1 === 1 ? "" : `\\frac{${y2 - y1}}{${x2 - x1}} = `}${m}$.`,
            `$\\frac{${y2} - ${par(y1)}}{${x2} - ${x1}} = ${x2 - x1 === 1 ? "" : `\\frac{${y2 - y1}}{${x2 - x1}} = `}${m}$。`,
          ),
          intercept,
        ],
        t(
          `${check.en.replace(/\.$/, "")}, and the second point fits too: $${par(m)} \\times ${x2} ${sg(b)} = ${y2}$.`,
          `${check["zh-CN"].replace(/。$/, "")}；第二个点也符合：$${par(m)} \\times ${x2} ${sg(b)} = ${y2}$。`,
        ),
        why,
      ),
    );
  }),
  spec(
    "Graphs of Linear Equations in Slope-Intercept Form",
    "斜截式直线的图象",
    ["properties-of-lines-in-slope-intercept-form"],
    (rng, hard) => {
      const { m, b } = lineSetup(rng);
      const eq = `y = ${cx(m)} ${sg(b)}`;
      if (!hard) {
        const up = m > 0;
        const pos = b > 0;
        const d = (u: boolean, p: boolean) =>
          t(
            `It ${u ? "rises" : "falls"} from left to right and crosses the $y$-axis ${p ? "above" : "below"} the origin.`,
            `它从左到右${u ? "上升" : "下降"}，并在原点${p ? "上方" : "下方"}与 $y$ 轴相交。`,
          );
        return words(
          rng,
          t(`Which statement describes the graph of $${eq}$ in the $xy$-plane?`, `在 $xy$ 平面中，哪个陈述描述了 $${eq}$ 的图象？`),
          d(up, pos),
          [d(!up, pos), d(up, !pos), d(!up, !pos)],
          worked(
            [
              step(
                "Read the slope",
                "看斜率",
                `The slope $${m}$ is ${up ? "positive" : "negative"}, so the line ${up ? "rises" : "falls"} from left to right.`,
                `斜率 $${m}$ 为${up ? "正" : "负"}，所以直线从左到右${up ? "上升" : "下降"}。`,
              ),
              step(
                "Read the intercept",
                "看截距",
                `The $y$-intercept $${b}$ is ${pos ? "positive" : "negative"}, so the line crosses the $y$-axis ${pos ? "above" : "below"} the origin.`,
                `$y$ 截距 $${b}$ 为${pos ? "正" : "负"}，所以直线在原点${pos ? "上方" : "下方"}与 $y$ 轴相交。`,
              ),
            ],
            t(
              `Two points: $(0, ${b})$ and $(1, ${m + b})$; the second is ${up ? "higher" : "lower"} than the first.`,
              `取两点：$(0, ${b})$ 和 $(1, ${m + b})$；后者比前者${up ? "高" : "低"}。`,
            ),
            [
              t(
                `This gets the direction wrong: the slope $${m}$ is ${up ? "positive" : "negative"}.`,
                `方向错了：斜率 $${m}$ 为${up ? "正" : "负"}。`,
              ),
              t(`This gets the crossing wrong: at $x = 0$, $y = ${b}$.`, `交点位置错了：$x = 0$ 时 $y = ${b}$。`),
              t(`This gets both the direction and the crossing wrong.`, `方向和交点位置都错了。`),
            ],
          ),
        );
      }
      const a = rng.int(2, 8);
      return spr(
        t(
          `The point $(${a}, k)$ lies on the graph of $${eq}$ shifted up $${Math.abs(b) + 1}$ units. What is the value of $k$?`,
          `点 $(${a}, k)$ 在 $${eq}$ 向上平移 $${Math.abs(b) + 1}$ 个单位后的图象上。$k$ 的值是多少？`,
        ),
        m * a + b + Math.abs(b) + 1,
        [m * a + b, m * a + b - Math.abs(b) - 1, m * (a + Math.abs(b) + 1) + b],
        worked(
          [
            step(
              "Shift the line",
              "平移直线",
              `A shift up adds $${Math.abs(b) + 1}$ to every output: $y = ${cx(m)} ${sg(b)} + ${Math.abs(b) + 1} = ${cx(m)} ${sg(b + Math.abs(b) + 1)}$.`,
              `向上平移使每个输出增加 $${Math.abs(b) + 1}$：$y = ${cx(m)} ${sg(b)} + ${Math.abs(b) + 1} = ${cx(m)} ${sg(b + Math.abs(b) + 1)}$。`,
            ),
            step(
              "Evaluate",
              "求值",
              `At $x = ${a}$: $k = ${par(m)} \\times ${a} ${sg(b + Math.abs(b) + 1)} = ${m * a + b + Math.abs(b) + 1}$.`,
              `$x = ${a}$ 时：$k = ${par(m)} \\times ${a} ${sg(b + Math.abs(b) + 1)} = ${m * a + b + Math.abs(b) + 1}$。`,
            ),
          ],
          t(
            `On the original line the point at $x = ${a}$ has $y = ${m * a + b}$, and $${m * a + b} + ${Math.abs(b) + 1} = ${m * a + b + Math.abs(b) + 1}$.`,
            `原直线上 $x = ${a}$ 处 $y = ${m * a + b}$，而 $${m * a + b} + ${Math.abs(b) + 1} = ${m * a + b + Math.abs(b) + 1}$。`,
          ),
          [
            t(`This is the value on the original line, before the shift.`, `这是平移前原直线上的值。`),
            t(`This shifts the line down instead of up.`, `这是向下平移，而不是向上。`),
            t(`This shifts the input instead of the output, which moves the line sideways.`, `这是平移了输入而不是输出，相当于左右平移。`),
          ],
        ),
        lineFigure(m, b),
      );
    },
  ),
  spec(
    "Constructing and Analyzing Slope-Intercept Equations",
    "构造并分析斜截式方程",
    ["analyzing-graphs-of-linear-models"],
    (rng, hard) => {
      const a = rng.int(2, 6);
      const b = rng.int(2, 6);
      const c = a * b * rng.int(1, 4);
      const sign = rng.sign();
      const eq = `${a}x ${sign > 0 ? "+" : "-"} ${b}y = ${c}`;
      const m = Q.of(-sign * a, b);
      const yInt = Q.of(sign * c, b);
      if (!hard)
        return mc(
          rng,
          t(`What is the slope of the line $${eq}$?`, `直线 $${eq}$ 的斜率是多少？`),
          m,
          [Q.of(sign * a, b), Q.of(-sign * b, a), Q.of(a, 1)],
          worked(
            [
              step(
                "Isolate the y term",
                "移项",
                `Subtract $${a}x$ from both sides: $${sign > 0 ? "" : "-"}${b}y = -${a}x + ${c}$.`,
                `两边减去 $${a}x$：$${sign > 0 ? "" : "-"}${b}y = -${a}x + ${c}$。`,
              ),
              step(
                "Divide",
                "两边相除",
                `Divide by $${sign > 0 ? "" : "-"}${b}$: $y = ${qx(m)} ${yInt.sign() > 0 ? "+" : "-"} ${yInt.abs().toLatex()}$, and the coefficient of $x$ is the slope.`,
                `两边除以 $${sign > 0 ? "" : "-"}${b}$：$y = ${qx(m)} ${yInt.sign() > 0 ? "+" : "-"} ${yInt.abs().toLatex()}$，$x$ 的系数就是斜率。`,
              ),
            ],
            t(
              `Two points on the line are $(0, ${yInt.toLatex()})$ and $(${b}, ${yInt.add(m.mul(Q.of(b))).toLatex()})$; the rise $${m.mul(Q.of(b)).toLatex()}$ over the run $${b}$ is $${m.toLatex()}$.`,
              `直线上两点 $(0, ${yInt.toLatex()})$ 和 $(${b}, ${yInt.add(m.mul(Q.of(b))).toLatex()})$；纵向变化 $${m.mul(Q.of(b)).toLatex()}$ 除以横向变化 $${b}$ 得 $${m.toLatex()}$。`,
            ),
            [
              t(`This misses the sign change when the $x$ term moves across.`, `这是移项时漏了变号。`),
              t(
                `This flips the ratio of the coefficients; the coefficient of $x$ goes on top.`,
                `这是把两个系数的比倒过来了；$x$ 的系数应在分子。`,
              ),
              t(`This is the coefficient of $x$ before solving for $y$.`, `这是解出 $y$ 之前 $x$ 的系数。`),
            ],
          ),
        );
      return mc(
        rng,
        t(`What is the $y$-coordinate of the $y$-intercept of the line $${eq}$?`, `直线 $${eq}$ 的 $y$ 截距的纵坐标是多少？`),
        yInt,
        [Q.of(c, a), Q.of(-sign * c, b), Q.of(c)],
        worked(
          [
            step(
              "Set x to zero",
              "令横坐标为零",
              `The $y$-intercept is where $x = 0$: $${sign > 0 ? "" : "-"}${b}y = ${c}$.`,
              `$y$ 截距处 $x = 0$：$${sign > 0 ? "" : "-"}${b}y = ${c}$。`,
            ),
            step(
              "Divide",
              "两边相除",
              `$y = \\frac{${c}}{${sign > 0 ? "" : "-"}${b}} = ${yInt.toLatex()}$.`,
              `$y = \\frac{${c}}{${sign > 0 ? "" : "-"}${b}} = ${yInt.toLatex()}$。`,
            ),
          ],
          t(
            `At $(0, ${yInt.toLatex()})$: $${a} \\times 0 ${sign > 0 ? "+" : "-"} ${b} \\times ${yInt.sign() < 0 ? `(${yInt.toLatex()})` : yInt.toLatex()} = ${c}$.`,
            `代入 $(0, ${yInt.toLatex()})$：$${a} \\times 0 ${sign > 0 ? "+" : "-"} ${b} \\times ${yInt.sign() < 0 ? `(${yInt.toLatex()})` : yInt.toLatex()} = ${c}$。`,
          ),
          [
            t(`This is the $x$-intercept, where $y = 0$.`, `这是 $x$ 截距，即 $y = 0$ 处。`),
            t(
              `This has the wrong sign: divide by $${sign > 0 ? "" : "-"}${b}$, sign included.`,
              `符号错了：要连同符号除以 $${sign > 0 ? "" : "-"}${b}$。`,
            ),
            t(`This forgets to divide by the coefficient of $y$.`, `这是忘了除以 $y$ 的系数。`),
          ],
        ),
      );
    },
  ),
  spec(
    "Properties of Lines Given in Standard or General Form",
    "一般式直线的性质",
    ["properties-of-lines-in-standard-form"],
    (rng, hard) => {
      const a = rng.int(2, 7);
      const b = rng.int(2, 7);
      const k = rng.int(2, 9);
      const c = a * b * k;
      const eq = `${a}x + ${b}y = ${c}`;
      if (!hard)
        return mc(
          rng,
          t(`What is the $x$-intercept of the line $${eq}$?`, `直线 $${eq}$ 的 $x$ 截距是什么？`),
          `(${b * k}, 0)`,
          [`(${a * k}, 0)`, `(0, ${b * k})`, `(0, ${a * k})`, `(${c}, 0)`, `(${b * k + 1}, 0)`],
          worked(
            [
              step(
                "Set y to zero",
                "令纵坐标为零",
                `The $x$-intercept is where the line crosses the $x$-axis, so $y = 0$ there: $${a}x + ${b} \\times 0 = ${c}$, which is $${a}x = ${c}$.`,
                `$x$ 截距是直线与 $x$ 轴的交点，那里 $y = 0$：$${a}x + ${b} \\times 0 = ${c}$，即 $${a}x = ${c}$。`,
              ),
              step(
                "Divide",
                "两边相除",
                `Divide by $${a}$: $x = \\frac{${c}}{${a}} = ${b * k}$, so the intercept is the point $(${b * k}, 0)$.`,
                `两边除以 $${a}$：$x = \\frac{${c}}{${a}} = ${b * k}$，所以截距点是 $(${b * k}, 0)$。`,
              ),
            ],
            t(
              `At $(${b * k}, 0)$: $${a} \\times ${b * k} + ${b} \\times 0 = ${c}$.`,
              `代入 $(${b * k}, 0)$：$${a} \\times ${b * k} + ${b} \\times 0 = ${c}$。`,
            ),
            [
              t(`This divides by the coefficient of $y$ instead of the coefficient of $x$.`, `这是除以了 $y$ 的系数，而不是 $x$ 的系数。`),
              t(
                `This puts the right number on the wrong axis; the $x$-intercept has $y = 0$, not $x = 0$.`,
                `数对了但坐标轴错了；$x$ 截距处 $y = 0$，而不是 $x = 0$。`,
              ),
              t(`This is the $y$-intercept, where $x = 0$.`, `这是 $y$ 截距，即 $x = 0$ 处。`),
              t(`This forgets to divide by the coefficient of $x$.`, `这是忘了除以 $x$ 的系数。`),
              t(`This is one more than the quotient; the check rules it out.`, `这比商大 $1$，检验排除了它。`),
            ],
          ),
        );
      return spr(
        t(
          `The line $${eq}$ meets the axes at two points. What is the area of the triangle formed by the line and the two axes?`,
          `直线 $${eq}$ 与两坐标轴交于两点。这条直线与两坐标轴围成的三角形面积是多少？`,
        ),
        Q.of(a * k * b * k, 2),
        [a * k * b * k, a * k + b * k, c],
        worked(
          [
            step(
              "Find both intercepts",
              "求两个截距",
              `With $y = 0$, $${a}x = ${c}$ gives $x = ${b * k}$. With $x = 0$, $${b}y = ${c}$ gives $y = ${a * k}$.`,
              `令 $y = 0$，$${a}x = ${c}$ 得 $x = ${b * k}$。令 $x = 0$，$${b}y = ${c}$ 得 $y = ${a * k}$。`,
            ),
            step(
              "Use the legs",
              "用两条直角边",
              `The triangle has its right angle at the origin, with legs $${b * k}$ and $${a * k}$ along the axes. The area is $\\frac{1}{2} \\times ${b * k} \\times ${a * k} = ${Q.of(a * k * b * k, 2).toLatex()}$.`,
              `三角形的直角在原点，两条直角边沿坐标轴，长 $${b * k}$ 和 $${a * k}$。面积为 $\\frac{1}{2} \\times ${b * k} \\times ${a * k} = ${Q.of(a * k * b * k, 2).toLatex()}$。`,
            ),
          ],
          t(
            `Both points lie on the line: $${a} \\times ${b * k} = ${c}$ and $${b} \\times ${a * k} = ${c}$.`,
            `两个点都在直线上：$${a} \\times ${b * k} = ${c}$，$${b} \\times ${a * k} = ${c}$。`,
          ),
          [
            t(`This forgets the $\\frac{1}{2}$ in the area of a triangle.`, `这是忘了三角形面积公式中的 $\\frac{1}{2}$。`),
            t(`This adds the legs instead of multiplying them.`, `这是把两条直角边相加了，而不是相乘。`),
            t(`This is the constant of the equation, not an area.`, `这是方程的常数项，不是面积。`),
          ],
        ),
      );
    },
  ),
  spec("Analyzing Linear Equations in General Form", "分析一般式一次方程", ["properties-of-lines-in-standard-form"], (rng, hard) => {
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const k = rng.int(2, 5);
    const c = rng.int(5, 40);
    const eq = `${a}x + ${b}y = ${c}`;
    if (!hard)
      return mc(
        rng,
        t(`Which equation has the same slope as $${eq}$ but a different graph?`, `哪个方程与 $${eq}$ 斜率相同但图象不同？`),
        `${k * a}x + ${k * b}y = ${k * c + 1}`,
        [`${k * a}x + ${k * b}y = ${k * c}`, `${b}x + ${a}y = ${c}`, `${a}x - ${b}y = ${c}`, `${k * b}x + ${k * a}y = ${k * c + 1}`],
        worked(
          [
            step(
              "Read the slope",
              "读出斜率",
              `For $Ax + By = C$ the slope is $-\\frac{A}{B}$, so $${eq}$ has slope $-\\frac{${a}}{${b}}$.`,
              `对 $Ax + By = C$，斜率为 $-\\frac{A}{B}$，所以 $${eq}$ 的斜率是 $-\\frac{${a}}{${b}}$。`,
            ),
            step(
              "Scale only the left side",
              "只放大左边",
              `$${k * a}x + ${k * b}y$ is $${k}$ times $${a}x + ${b}y$, so the slope stays $-\\frac{${k * a}}{${k * b}} = -\\frac{${a}}{${b}}$. The constant $${k * c + 1}$ is not $${k} \\times ${c} = ${k * c}$, so this is a different, parallel line.`,
              `$${k * a}x + ${k * b}y$ 是 $${a}x + ${b}y$ 的 $${k}$ 倍，斜率仍为 $-\\frac{${k * a}}{${k * b}} = -\\frac{${a}}{${b}}$。常数 $${k * c + 1}$ 不等于 $${k} \\times ${c} = ${k * c}$，所以这是另一条平行直线。`,
            ),
          ],
          t(
            `Dividing $${k * a}x + ${k * b}y = ${k * c + 1}$ by $${k}$ gives $${a}x + ${b}y = \\frac{${k * c + 1}}{${k}}$, the same left side with a different constant.`,
            `把 $${k * a}x + ${k * b}y = ${k * c + 1}$ 除以 $${k}$，得 $${a}x + ${b}y = \\frac{${k * c + 1}}{${k}}$：左边相同，常数不同。`,
          ),
          [
            t(
              `This is $${k}$ times the whole equation, so it is the same line, not a different graph.`,
              `这是整个方程乘以 $${k}$，是同一条直线，图象并不不同。`,
            ),
            t(`Swapping the coefficients changes the slope to $-\\frac{${b}}{${a}}$.`, `交换系数后斜率变为 $-\\frac{${b}}{${a}}$。`),
            t(
              `Changing the sign of the $y$ term changes the slope to $\\frac{${a}}{${b}}$.`,
              `改变 $y$ 项的符号，斜率变为 $\\frac{${a}}{${b}}$。`,
            ),
            t(`The coefficients are swapped, so the slope is $-\\frac{${b}}{${a}}$.`, `系数交换了，斜率是 $-\\frac{${b}}{${a}}$。`),
          ],
        ),
      );
    return spr(
      t(
        `In the $xy$-plane, the line $${eq}$ passes through $(1, t)$ and $(${1 + b}, s)$. What is the value of $t - s$?`,
        `在 $xy$ 平面中，直线 $${eq}$ 经过 $(1, t)$ 和 $(${1 + b}, s)$。$t - s$ 的值是多少？`,
      ),
      a,
      [-a, b, Q.of(a, b)],
      worked(
        [
          step(
            "Read the slope",
            "读出斜率",
            `Solving $${eq}$ for $y$ gives slope $-\\frac{${a}}{${b}}$.`,
            `把 $${eq}$ 解出 $y$，斜率为 $-\\frac{${a}}{${b}}$。`,
          ),
          step(
            "Move along the line",
            "沿直线移动",
            `From $x = 1$ to $x = ${1 + b}$ the run is $${b}$, so $y$ changes by $-\\frac{${a}}{${b}} \\times ${b} = -${a}$. That means $s = t - ${a}$, and $t - s = ${a}$.`,
            `从 $x = 1$ 到 $x = ${1 + b}$，横向变化 $${b}$，所以 $y$ 变化 $-\\frac{${a}}{${b}} \\times ${b} = -${a}$。即 $s = t - ${a}$，$t - s = ${a}$。`,
          ),
        ],
        t(
          `Subtract the two equations $${a} \\times 1 + ${b}t = ${c}$ and $${a} \\times ${1 + b} + ${b}s = ${c}$: $${b}(t - s) = ${a * b}$, so $t - s = ${a}$.`,
          `把 $${a} \\times 1 + ${b}t = ${c}$ 与 $${a} \\times ${1 + b} + ${b}s = ${c}$ 相减：$${b}(t - s) = ${a * b}$，所以 $t - s = ${a}$。`,
        ),
        [
          t(`This is $s - t$; the line falls, so $t$ is the larger value.`, `这是 $s - t$；直线下降，$t$ 才是较大的值。`),
          t(`This is the run between the points, not the change in $y$.`, `这是两点间的横向变化，不是 $y$ 的变化。`),
          t(`This is the size of the slope, the change in $y$ for a run of $1$ only.`, `这是斜率的大小，只是横向变化 $1$ 时 $y$ 的变化。`),
        ],
      ),
    );
  }),
  spec(
    "Constructing Linear Functions Using Slope-Intercept Form",
    "用斜截式构造一次函数",
    ["constructing-linear-functions"],
    (rng, hard) => {
      const { m, b } = lineSetup(rng);
      const a = rng.int(1, 5);
      const c = a + rng.int(1, 4);
      const fa = m * a + b;
      const fc = m * c + b;
      const wrong = [
        `f(x) = ${cx(m)} ${sg(-b)}`,
        `f(x) = ${cx(-m)} ${sg(b)}`,
        `f(x) = ${cx(m)} ${sg(fa)}`,
        `f(x) = ${cx(m)} ${sg(b + 1)}`,
        `f(x) = ${cx(-m)} ${sg(b + 1)}`,
      ];
      if (!hard)
        return mc(
          rng,
          t(
            `For the linear function $f$, $f(0) = ${b}$ and $f(${a}) = ${fa}$. Which equation defines $f$?`,
            `对一次函数 $f$，$f(0) = ${b}$，$f(${a}) = ${fa}$。哪个方程定义 $f$？`,
          ),
          `f(x) = ${cx(m)} ${sg(b)}`,
          wrong,
          worked(
            [
              step(
                "Read the intercept",
                "读出截距",
                `$f(0)$ is the value at $x = 0$, which is the intercept: $${b}$.`,
                `$f(0)$ 是 $x = 0$ 处的值，也就是截距：$${b}$。`,
              ),
              step(
                "Find the slope",
                "求斜率",
                `From $(0, ${b})$ to $(${a}, ${fa})$ the slope is $\\frac{${fa} - ${par(b)}}{${a} - 0} = ${m}$, so $f(x) = ${cx(m)} ${sg(b)}$.`,
                `从 $(0, ${b})$ 到 $(${a}, ${fa})$，斜率为 $\\frac{${fa} - ${par(b)}}{${a} - 0} = ${m}$，所以 $f(x) = ${cx(m)} ${sg(b)}$。`,
              ),
            ],
            t(`$f(${a}) = ${m} \\times ${a} ${sg(b)} = ${fa}$.`, `$f(${a}) = ${m} \\times ${a} ${sg(b)} = ${fa}$。`),
            [
              t(`This flips the sign of the intercept; $f(0) = ${b}$.`, `这是把截距的符号弄反了；$f(0) = ${b}$。`),
              t(`This flips the sign of the slope.`, `这是把斜率的符号弄反了。`),
              t(`This uses $f(${a})$ as the intercept, but the intercept is $f(0)$.`, `这是把 $f(${a})$ 当成了截距，而截距是 $f(0)$。`),
              t(`This intercept is one off; it gives $f(0) = ${b + 1}$.`, `这个截距差了 $1$；它给出 $f(0) = ${b + 1}$。`),
              t(`This flips the slope and is one off in the intercept.`, `这是斜率符号反了，截距也差了 $1$。`),
            ],
          ),
        );
      return spr(
        t(
          `For the linear function $f$, $f(${a}) = ${fa}$ and $f(${c}) = ${fc}$. What is the value of $f(0)$?`,
          `对一次函数 $f$，$f(${a}) = ${fa}$，$f(${c}) = ${fc}$。$f(0)$ 的值是多少？`,
        ),
        b,
        [m, fa - m, fa + m * a],
        worked(
          [
            step(
              "Find the slope",
              "求斜率",
              `The slope is $\\frac{${fc} - ${par(fa)}}{${c} - ${a}} = ${c - a > 1 ? `\\frac{${fc - fa}}{${c - a}} = ` : ""}${m}$.`,
              `斜率为 $\\frac{${fc} - ${par(fa)}}{${c} - ${a}} = ${c - a > 1 ? `\\frac{${fc - fa}}{${c - a}} = ` : ""}${m}$。`,
            ),
            step(
              "Step back to zero",
              "退回到零",
              `Going from $x = ${a}$ back to $x = 0$ is a run of $-${a}$, so $f(0) = ${fa} - ${a} \\times ${par(m)} = ${b}$.`,
              `从 $x = ${a}$ 退回 $x = 0$，横向变化 $-${a}$，所以 $f(0) = ${fa} - ${a} \\times ${par(m)} = ${b}$。`,
            ),
          ],
          t(
            `With $f(x) = ${cx(m)} ${sg(b)}$: $f(${c}) = ${m} \\times ${c} ${sg(b)} = ${fc}$.`,
            `由 $f(x) = ${cx(m)} ${sg(b)}$：$f(${c}) = ${m} \\times ${c} ${sg(b)} = ${fc}$。`,
          ),
          [
            t(`This is the slope, not the value at $x = 0$.`, `这是斜率，不是 $x = 0$ 处的值。`),
            t(`This steps back only one unit, to $f(${a - 1})$.`, `这只退回了一个单位，得到的是 $f(${a - 1})$。`),
            t(`This moves the wrong way, to $f(${2 * a})$.`, `这是朝反方向移动，得到的是 $f(${2 * a})$。`),
          ],
        ),
      );
    },
  ),
  spec("Parallel Lines", "平行线", ["parallel-lines-in-the-coordinate-plane"], (rng, hard) => {
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const c = rng.int(3, 20);
    const m = Q.of(-a, b);
    if (!hard)
      return mc(
        rng,
        t(
          `Line $\\ell$ is parallel to the line $${a}x + ${b}y = ${c}$. What is the slope of line $\\ell$?`,
          `直线 $\\ell$ 与直线 $${a}x + ${b}y = ${c}$ 平行。直线 $\\ell$ 的斜率是多少？`,
        ),
        m,
        [Q.of(a, b), Q.of(b, a), Q.of(-b, a)],
        worked(
          [
            step(
              "Solve for y",
              "解出纵坐标",
              `Subtract $${a}x$ and divide by $${b}$: $y = ${qx(m)} + ${Q.of(c, b).toLatex()}$. The slope of the given line is $${m.toLatex()}$.`,
              `移项 $${a}x$ 再除以 $${b}$：$y = ${qx(m)} + ${Q.of(c, b).toLatex()}$。给定直线的斜率为 $${m.toLatex()}$。`,
            ),
            step(
              "Match the slope",
              "斜率相同",
              `Parallel lines rise at the same rate, so line $\\ell$ also has slope $${m.toLatex()}$.`,
              `平行线的倾斜程度相同，所以直线 $\\ell$ 的斜率也是 $${m.toLatex()}$。`,
            ),
          ],
          t(
            `Moving $${b}$ right on the given line changes $y$ by $${m.toLatex()} \\times ${b} = -${a}$, and $${a}(x + ${b}) + ${b}(y - ${a}) = ${a}x + ${b}y$.`,
            `在给定直线上向右移动 $${b}$，$y$ 变化 $${m.toLatex()} \\times ${b} = -${a}$，而 $${a}(x + ${b}) + ${b}(y - ${a}) = ${a}x + ${b}y$。`,
          ),
          [
            t(`This misses the sign change when $${a}x$ moves across the equals sign.`, `这是移项 $${a}x$ 时漏了变号。`),
            t(`This is the negative reciprocal, the slope of a perpendicular line.`, `这是负倒数，是垂线的斜率。`),
            t(
              `This flips the ratio of the coefficients; the coefficient of $x$ goes on top.`,
              `这是把两个系数的比倒过来了；$x$ 的系数应在分子。`,
            ),
          ],
        ),
      );
    const k = rng.nonZero(-6, 8);
    const x0 = b * rng.int(1, 3);
    const y0 = (-a * x0) / b + k;
    return spr(
      t(
        `Line $\\ell$ is parallel to $${a}x + ${b}y = ${c}$ and passes through $(${x0}, ${y0})$. What is the $y$-coordinate of the $y$-intercept of line $\\ell$?`,
        `直线 $\\ell$ 与 $${a}x + ${b}y = ${c}$ 平行，且经过 $(${x0}, ${y0})$。直线 $\\ell$ 的 $y$ 截距的纵坐标是多少？`,
      ),
      k,
      [y0, Q.of(c, b), y0 - (a * x0) / b],
      worked(
        [
          step(
            "Take the slope",
            "取斜率",
            `The given line has slope $-\\frac{${a}}{${b}}$, so the parallel line $\\ell$ is $y = ${qx(m)} + b$.`,
            `给定直线的斜率为 $-\\frac{${a}}{${b}}$，所以平行线 $\\ell$ 为 $y = ${qx(m)} + b$。`,
          ),
          step(
            "Use the point",
            "代入点",
            `Substitute $(${x0}, ${y0})$: $${y0} = ${m.toLatex()} \\times ${x0} + b = ${(-a * x0) / b} + b$, so $b = ${y0} - ${par((-a * x0) / b)} = ${k}$.`,
            `代入 $(${x0}, ${y0})$：$${y0} = ${m.toLatex()} \\times ${x0} + b = ${(-a * x0) / b} + b$，所以 $b = ${y0} - ${par((-a * x0) / b)} = ${k}$。`,
          ),
        ],
        t(
          `$${m.toLatex()} \\times ${x0} + ${par(k)} = ${y0}$, so $(${x0}, ${y0})$ lies on $y = ${qx(m)} ${sg(k)}$.`,
          `$${m.toLatex()} \\times ${x0} + ${par(k)} = ${y0}$，所以 $(${x0}, ${y0})$ 在 $y = ${qx(m)} ${sg(k)}$ 上。`,
        ),
        [
          t(`This is the $y$-coordinate of the given point, not of the intercept.`, `这是已知点的纵坐标，不是截距的纵坐标。`),
          t(`This is the intercept of the given line, not of line $\\ell$.`, `这是给定直线的截距，不是直线 $\\ell$ 的截距。`),
          t(`This adds the slope term instead of subtracting it.`, `这是把斜率项加上了，而应减去。`),
        ],
      ),
    );
  }),
  spec("Slopes of Perpendicular Lines", "垂直线的斜率", ["perpendicular-lines-in-the-coordinate-plane"], (rng, hard) => {
    const p = rng.int(1, 7);
    const q = rng.int(2, 7);
    const s = rng.sign();
    if (!hard) {
      const m = Q.of(s * p, q);
      return mc(
        rng,
        t(
          `Line $\\ell$ has slope $${m.toLatex()}$. What is the slope of a line perpendicular to $\\ell$?`,
          `直线 $\\ell$ 的斜率为 $${m.toLatex()}$。与 $\\ell$ 垂直的直线斜率是多少？`,
        ),
        Q.of(-s * q, p),
        [Q.of(s * q, p), m.mul(Q.of(-1)), m],
        worked(
          [
            step(
              "Take the reciprocal",
              "取倒数",
              `Slopes of perpendicular lines multiply to $-1$, so the new slope is $-1 \\div ${s < 0 ? `\\left(${m.toLatex()}\\right)` : m.toLatex()}$. Dividing by $${m.toLatex()}$ means multiplying by its reciprocal, $${Q.of(s * q, p).toLatex()}$.`,
              `互相垂直的直线斜率之积为 $-1$，所以新斜率是 $-1 \\div ${s < 0 ? `\\left(${m.toLatex()}\\right)` : m.toLatex()}$。除以 $${m.toLatex()}$ 就是乘它的倒数：倒数为 $${Q.of(s * q, p).toLatex()}$。`,
            ),
            step(
              "Change the sign",
              "改变符号",
              `Multiplying by $-1$ changes the sign, so the perpendicular slope is $${Q.of(-s * q, p).toLatex()}$.`,
              `再乘以 $-1$ 改变符号，所以垂线的斜率是 $${Q.of(-s * q, p).toLatex()}$。`,
            ),
          ],
          t(
            `$${m.toLatex()} \\times ${Q.of(-s * q, p).sign() < 0 ? `\\left(${Q.of(-s * q, p).toLatex()}\\right)` : Q.of(-s * q, p).toLatex()} = -1$.`,
            `$${m.toLatex()} \\times ${Q.of(-s * q, p).sign() < 0 ? `\\left(${Q.of(-s * q, p).toLatex()}\\right)` : Q.of(-s * q, p).toLatex()} = -1$。`,
          ),
          [
            t(
              `This is the reciprocal without the sign change; the product would be $1$, not $-1$.`,
              `这是倒数但没变号；乘积会是 $1$，而不是 $-1$。`,
            ),
            t(`This changes the sign but does not take the reciprocal.`, `这是变了号但没取倒数。`),
            t(`This is the slope of $\\ell$ itself, the slope of a parallel line.`, `这是 $\\ell$ 本身的斜率，即平行线的斜率。`),
          ],
        ),
      );
    }
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const rhs = rng.int(2, 20);
    return mc(
      rng,
      t(
        `What is the slope of a line perpendicular to $${a}x ${s > 0 ? "+" : "-"} ${b}y = ${rhs}$?`,
        `与直线 $${a}x ${s > 0 ? "+" : "-"} ${b}y = ${rhs}$ 垂直的直线斜率是多少？`,
      ),
      Q.of(s * b, a),
      [Q.of(-s * a, b), Q.of(s * a, b), Q.of(-s * b, a)],
      worked(
        [
          step(
            "Solve for y",
            "解出纵坐标",
            `Move $${a}x$ across and divide by $${s > 0 ? "" : "-"}${b}$: $y = ${qx(Q.of(-s * a, b))} ${s > 0 ? "+" : "-"} ${Q.of(rhs, b).toLatex()}$. The given line has slope $${Q.of(-s * a, b).toLatex()}$.`,
            `移项 $${a}x$ 再除以 $${s > 0 ? "" : "-"}${b}$：$y = ${qx(Q.of(-s * a, b))} ${s > 0 ? "+" : "-"} ${Q.of(rhs, b).toLatex()}$。给定直线的斜率为 $${Q.of(-s * a, b).toLatex()}$。`,
          ),
          step(
            "Take the negative reciprocal",
            "取负倒数",
            `Flip $${Q.of(-s * a, b).toLatex()}$ and change its sign: the perpendicular slope is $${Q.of(s * b, a).toLatex()}$.`,
            `把 $${Q.of(-s * a, b).toLatex()}$ 倒过来再变号：垂线的斜率是 $${Q.of(s * b, a).toLatex()}$。`,
          ),
        ],
        t(
          `$${Q.of(-s * a, b).toLatex()} \\times ${s < 0 ? `\\left(${Q.of(s * b, a).toLatex()}\\right)` : Q.of(s * b, a).toLatex()} = -1$.`,
          `$${Q.of(-s * a, b).toLatex()} \\times ${s < 0 ? `\\left(${Q.of(s * b, a).toLatex()}\\right)` : Q.of(s * b, a).toLatex()} = -1$。`,
        ),
        [
          t(`This is the slope of the given line, so it describes a parallel line.`, `这是给定直线的斜率，对应的是平行线。`),
          t(
            `This misses the sign change when $${a}x$ moves across, and is still not a negative reciprocal.`,
            `这是移项 $${a}x$ 时漏了变号，而且也不是负倒数。`,
          ),
          t(`This takes the reciprocal of the slope but keeps its sign.`, `这是取了斜率的倒数，但没有变号。`),
        ],
      ),
    );
  }),
  spec("Perpendicular Lines", "垂直线", ["finding-equations-of-perpendicular-lines"], (rng, hard) => {
    const m = rng.pick([2, 3, 4, 5, -2, -3, -4, -5]);
    const x0 = m * rng.int(1, 3);
    const k = rng.nonZero(-6, 8);
    const y0 = -(x0 / m) + k;
    const b = rng.nonZero(-6, 6);
    const neg = Q.of(-1, m);
    if (!hard)
      return mc(
        rng,
        t(
          `Line $\\ell$ is perpendicular to $y = ${m}x ${sg(b)}$ and passes through $(${x0}, ${y0})$. Which equation defines line $\\ell$?`,
          `直线 $\\ell$ 与 $y = ${m}x ${sg(b)}$ 垂直，且经过 $(${x0}, ${y0})$。哪个方程定义直线 $\\ell$？`,
        ),
        `y = ${neg.toLatex()}x ${sg(k)}`,
        [
          `y = ${neg.toLatex()}x ${sg(y0)}`,
          `y = ${m}x ${sg(y0 - m * x0)}`,
          `y = ${Q.of(1, m).toLatex()}x ${sg(k)}`,
          `y = ${neg.toLatex()}x ${sg(k + 1)}`,
        ],
        worked(
          [
            step(
              "Find the slope",
              "求斜率",
              `The given line has slope $${m}$. A perpendicular slope is its negative reciprocal, $${neg.toLatex()}$.`,
              `给定直线的斜率为 $${m}$。垂线的斜率是它的负倒数 $${neg.toLatex()}$。`,
            ),
            step(
              "Use the point",
              "代入点",
              `Write $y = ${neg.toLatex()}x + b$ and substitute $(${x0}, ${y0})$: $${y0} = ${neg.toLatex()} \\times ${par(x0)} + b = ${-x0 / m} + b$, so $b = ${k}$.`,
              `设 $y = ${neg.toLatex()}x + b$，代入 $(${x0}, ${y0})$：$${y0} = ${neg.toLatex()} \\times ${par(x0)} + b = ${-x0 / m} + b$，所以 $b = ${k}$。`,
            ),
          ],
          t(
            `$${m} \\times \\left(${neg.toLatex()}\\right) = -1$, and $${neg.toLatex()} \\times ${par(x0)} + ${par(k)} = ${y0}$.`,
            `$${m} \\times \\left(${neg.toLatex()}\\right) = -1$，且 $${neg.toLatex()} \\times ${par(x0)} + ${par(k)} = ${y0}$。`,
          ),
          [
            t(
              `This uses the $y$-coordinate of the point as the intercept; the point is not on the $y$-axis.`,
              `这是把点的纵坐标当成了截距；这个点不在 $y$ 轴上。`,
            ),
            t(
              `This line has the same slope as the given line, so it is parallel, not perpendicular.`,
              `这条直线与给定直线斜率相同，是平行而不是垂直。`,
            ),
            t(`This takes the reciprocal but forgets to change the sign.`, `这是取了倒数但忘了变号。`),
            t(`This intercept is one off, so the line misses $(${x0}, ${y0})$.`, `这个截距差了 $1$，直线不经过 $(${x0}, ${y0})$。`),
          ],
        ),
      );
    return spr(
      t(
        `Line $\\ell$ is perpendicular to $y = ${m}x ${sg(b)}$ and passes through $(${x0}, ${y0})$. If $\\ell$ also passes through $(0, c)$, what is the value of $c$?`,
        `直线 $\\ell$ 与 $y = ${m}x ${sg(b)}$ 垂直，且经过 $(${x0}, ${y0})$。若 $\\ell$ 还经过 $(0, c)$，则 $c$ 的值是多少？`,
      ),
      k,
      [y0, b, y0 - m * x0],
      worked(
        [
          step(
            "Find the slope",
            "求斜率",
            `Line $\\ell$ is perpendicular to a line of slope $${m}$, so its slope is the negative reciprocal, $${neg.toLatex()}$.`,
            `直线 $\\ell$ 与斜率为 $${m}$ 的直线垂直，所以它的斜率是负倒数 $${neg.toLatex()}$。`,
          ),
          step(
            "Move to the y-axis",
            "移到纵轴",
            `From $(${x0}, ${y0})$ to $(0, c)$ the run is $${-x0}$, so $y$ changes by $${neg.toLatex()} \\times ${par(-x0)} = ${x0 / m}$. Then $c = ${y0} ${sg(x0 / m)} = ${k}$.`,
            `从 $(${x0}, ${y0})$ 到 $(0, c)$，横向变化 $${-x0}$，所以 $y$ 变化 $${neg.toLatex()} \\times ${par(-x0)} = ${x0 / m}$。于是 $c = ${y0} ${sg(x0 / m)} = ${k}$。`,
          ),
        ],
        t(
          `The slope from $(0, ${k})$ to $(${x0}, ${y0})$ is $\\frac{${y0} - ${par(k)}}{${x0}} = ${neg.toLatex()}$, and $${m} \\times \\left(${neg.toLatex()}\\right) = -1$.`,
          `从 $(0, ${k})$ 到 $(${x0}, ${y0})$ 的斜率为 $\\frac{${y0} - ${par(k)}}{${x0}} = ${neg.toLatex()}$，且 $${m} \\times \\left(${neg.toLatex()}\\right) = -1$。`,
        ),
        [
          t(`This is the $y$-coordinate of the given point, which is not on the $y$-axis.`, `这是已知点的纵坐标，而这个点不在 $y$ 轴上。`),
          t(`This is the intercept of the given line, not of line $\\ell$.`, `这是给定直线的截距，不是直线 $\\ell$ 的截距。`),
          t(
            `This uses the slope $${m}$ of the given line, which describes a parallel line.`,
            `这是用了给定直线的斜率 $${m}$，对应的是平行线。`,
          ),
        ],
      ),
    );
  }),
  spec("Modeling With Linear Functions", "用一次函数建模", ["modeling-with-linear-functions"], (rng, hard) => {
    const c = runner(rng);
    const r = rng.int(3, 15);
    const s = 10 * rng.int(10, 40);
    const x0 = rng.int(3, 12);
    const m = c.up ? r : -r;
    const fn = `f(x) = ${c.up ? `${s} + ${r}x` : `${s} - ${r}x`}`;
    if (!hard)
      return spr(
        t(
          `The function $${fn}$ models ${c.en} $x$ ${c.tw.en} after a start. What is the value after $${x0}$ ${c.tw.en}?`,
          `函数 $${fn}$ 表示开始 $x$ ${c.tw["zh-CN"]}后${c.zh}。$${x0}$ ${c.tw["zh-CN"]}后的值是多少？`,
        ),
        s + m * x0,
        [s, m * x0, s - m * x0],
        worked(
          [
            step(
              "Substitute",
              "代入",
              `The input $x$ counts ${c.tw.en}, so put $x = ${x0}$ into the function: $f(${x0}) = ${s} ${sg(m)} \\times ${x0}$.`,
              `输入 $x$ 是${c.tw["zh-CN"]}数，所以把 $x = ${x0}$ 代入函数：$f(${x0}) = ${s} ${sg(m)} \\times ${x0}$。`,
            ),
            step(
              "Compute",
              "计算",
              `$${r} \\times ${x0} = ${r * x0}$, so $f(${x0}) = ${s} ${sg(m * x0)} = ${s + m * x0}$.`,
              `$${r} \\times ${x0} = ${r * x0}$，所以 $f(${x0}) = ${s} ${sg(m * x0)} = ${s + m * x0}$。`,
            ),
          ],
          t(
            `The value ${c.up ? "rises" : "falls"} by $${r}$ each ${c.tu.en} from $${s}$; after $${x0}$ ${c.tw.en} that is $${r * x0}$ in all, and $${s} ${sg(m * x0)} = ${s + m * x0}$.`,
            `值从 $${s}$ 起每${c.tu["zh-CN"]}${c.up ? "增加" : "减少"} $${r}$；$${x0}$ ${c.tw["zh-CN"]}共${c.up ? "增加" : "减少"} $${r * x0}$，$${s} ${sg(m * x0)} = ${s + m * x0}$。`,
          ),
          [
            t(`This is the starting value, at $x = 0$.`, `这是初始值，即 $x = 0$ 时的值。`),
            t(`This is only the change, without the starting value.`, `这只是变化量，没有加上初始值。`),
            t(`This applies the change in the wrong direction.`, `这是把变化的方向弄反了。`),
          ],
        ),
      );
    return spr(
      t(
        `The function $${fn}$ models ${c.en} $x$ ${c.tw.en} after a start. After how many ${c.tw.en} is the value $${s + m * x0}$?`,
        `函数 $${fn}$ 表示开始 $x$ ${c.tw["zh-CN"]}后${c.zh}。多少${c.tw["zh-CN"]}后值为 $${s + m * x0}$？`,
      ),
      x0,
      [s + m * x0, m * x0, x0 + 1],
      worked(
        [
          step(
            "Set up the equation",
            "列方程",
            `The value is the output, so set $${s} ${sg(m)}x = ${s + m * x0}$.`,
            `值是输出，所以令 $${s} ${sg(m)}x = ${s + m * x0}$。`,
          ),
          step(
            "Solve",
            "求解",
            `Subtract $${s}$: $${m}x = ${m * x0}$. Divide by $${m}$: $x = ${x0}$ ${c.tw.en}.`,
            `两边减去 $${s}$：$${m}x = ${m * x0}$。两边除以 $${m}$：$x = ${x0}$ ${c.tw["zh-CN"]}。`,
          ),
        ],
        t(`$f(${x0}) = ${s} ${sg(m)} \\times ${x0} = ${s + m * x0}$.`, `$f(${x0}) = ${s} ${sg(m)} \\times ${x0} = ${s + m * x0}$。`),
        [
          t(`This is the given value, the output, not the number of ${c.tw.en}.`, `这是给出的值，即输出，不是${c.tw["zh-CN"]}数。`),
          t(`This is the change from the start, not the time it takes.`, `这是相对初始值的变化量，不是所用的时间。`),
          t(`This is one ${c.tu.en} too many; the check rules it out.`, `这多了 $1$ ${c.tw["zh-CN"]}；检验排除了它。`),
        ],
      ),
    );
  }),
  spec("Constructing Models Using Linear Functions", "用一次函数构造模型", ["constructing-linear-functions"], (rng, hard) => {
    const c = runner(rng);
    const r = rng.int(3, 15);
    const s = 10 * rng.int(10, 40);
    const a = rng.int(2, 6);
    const b = a + rng.int(2, 6);
    const m = c.up ? r : -r;
    const good = `f(x) = ${s} ${tx(m)}`;
    const wrong = [`f(x) = ${r} ${tx(c.up ? s : -s)}`, `f(x) = ${s} ${tx(-m)}`, `f(x) = ${s + m} ${tx(m)}`, `f(x) = ${s + m * a} ${tx(m)}`];
    const why = [
      t(`This swaps the start and the rate.`, `这是把初始值和变化率交换了。`),
      t(`This changes in the wrong direction.`, `这是变化方向反了。`),
      t(`This starts one ${c.tu.en} late: $${s + m}$ is the value at $x = 1$.`, `这晚了一步：$${s + m}$ 是 $x = 1$ 时的值。`),
      t(
        `This starts from $${s + m * a}$, the value after $${a}$ ${c.tw.en}, not the value at $x = 0$.`,
        `这是从 $${s + m * a}$ 开始，那是 $${a}$ ${c.tw["zh-CN"]}后的值，不是 $x = 0$ 时的值。`,
      ),
    ];
    if (!hard)
      return mc(
        rng,
        t(
          `${c.en[0]!.toUpperCase()}${c.en.slice(1)} is $${s}$ at the start and changes by $${m}$ each ${c.tu.en}. Which function gives the value after $x$ ${c.tw.en}?`,
          `${c.zh}开始时为 $${s}$，每${c.tu["zh-CN"]}变化 $${m}$。哪个函数给出 $x$ ${c.tw["zh-CN"]}后的值？`,
        ),
        good,
        wrong,
        worked(
          [
            step(
              "Find the constant",
              "找常数项",
              `At the start $x = 0$, and the value is $${s}$, so $f(0) = ${s}$ is the constant term.`,
              `开始时 $x = 0$，值为 $${s}$，所以常数项是 $f(0) = ${s}$。`,
            ),
            step(
              "Find the rate",
              "找变化率",
              `Each ${c.tu.en} changes the value by $${m}$, so after $x$ ${c.tw.en} the change is $${m}x$. Together, $${good}$.`,
              `每${c.tu["zh-CN"]}变化 $${m}$，所以 $x$ ${c.tw["zh-CN"]}后变化 $${m}x$。合起来，$${good}$。`,
            ),
          ],
          t(
            `$f(0) = ${s}$ and $f(1) = ${s + m}$, a change of $${m}$ in one ${c.tu.en}.`,
            `$f(0) = ${s}$，$f(1) = ${s + m}$，一${c.tu["zh-CN"]}变化 $${m}$。`,
          ),
          why,
        ),
      );
    return mc(
      rng,
      t(
        `${c.en[0]!.toUpperCase()}${c.en.slice(1)} is $${s + m * a}$ after $${a}$ ${c.tw.en} and $${s + m * b}$ after $${b}$ ${c.tw.en}, changing at a constant rate. Which function gives the value after $x$ ${c.tw.en}?`,
        `${c.zh}在 $${a}$ ${c.tw["zh-CN"]}后为 $${s + m * a}$，在 $${b}$ ${c.tw["zh-CN"]}后为 $${s + m * b}$，以恒定速率变化。哪个函数给出 $x$ ${c.tw["zh-CN"]}后的值？`,
      ),
      good,
      wrong,
      worked(
        [
          step(
            "Find the rate",
            "求变化率",
            `From $${a}$ to $${b}$ ${c.tw.en} the value changes by $${s + m * b} - ${par(s + m * a)} =${m * (b - a)}$ over $${b - a}$ ${c.tw.en}, so the rate is $\\frac{${m * (b - a)}}{${b - a}} = ${m}$.`,
            `从 $${a}$ 到 $${b}$ ${c.tw["zh-CN"]}，值变化 $${s + m * b} - ${par(s + m * a)} =${m * (b - a)}$，历时 $${b - a}$ ${c.tw["zh-CN"]}，所以变化率为 $\\frac{${m * (b - a)}}{${b - a}} = ${m}$。`,
          ),
          step(
            "Go back to the start",
            "回到开始",
            `Going back $${a}$ ${c.tw.en} from $x = ${a}$ undoes $${a} \\times ${par(m)} = ${a * m}$, so the start is $${s + m * a} - ${par(a * m)} = ${s}$ and $${good}$.`,
            `从 $x = ${a}$ 回退 $${a}$ ${c.tw["zh-CN"]}，要去掉 $${a} \\times ${par(m)} = ${a * m}$，所以初始值是 $${s + m * a} - ${par(a * m)} = ${s}$，$${good}$。`,
          ),
        ],
        t(
          `$f(${a}) = ${s} ${sg(m)} \\times ${a} = ${s + m * a}$ and $f(${b}) = ${s} ${sg(m)} \\times ${b} = ${s + m * b}$.`,
          `$f(${a}) = ${s} ${sg(m)} \\times ${a} = ${s + m * a}$，$f(${b}) = ${s} ${sg(m)} \\times ${b} = ${s + m * b}$。`,
        ),
        why,
      ),
    );
  }),
  spec(
    "Further Constructing Models Using Linear Functions",
    "进一步用一次函数构造模型",
    ["further-modeling-with-two-variable-equations"],
    (rng, hard) => {
      const per = rng.int(2, 9);
      const min = 5 * rng.int(2, 6);
      const s = 10 * rng.int(4, 20);
      const rate = per * 60;
      if (!hard)
        return mc(
          rng,
          t(
            `A machine has already printed $${s}$ pages and prints $${per}$ pages per minute. Which function gives the total pages after $h$ hours?`,
            `一台机器已打印 $${s}$ 页，每分钟打印 $${per}$ 页。哪个函数给出 $h$ 小时后的总页数？`,
          ),
          `P(h) = ${s} + ${rate}h`,
          [`P(h) = ${s} + ${per}h`, `P(h) = ${s}h + ${rate}`, `P(h) = ${s + rate}h`, `P(h) = ${rate} + ${s}h`],
          worked(
            [
              step(
                "Convert the rate",
                "换算速率",
                `$h$ counts hours, but the rate is per minute. An hour has $60$ minutes, so the machine prints $${per} \\times 60 = ${rate}$ pages per hour, and $${rate}h$ pages in $h$ hours.`,
                `$h$ 以小时计，而速率是每分钟。$1$ 小时有 $60$ 分钟，所以机器每小时打印 $${per} \\times 60 = ${rate}$ 页，$h$ 小时打印 $${rate}h$ 页。`,
              ),
              step(
                "Add the start",
                "加上已有的",
                `The $${s}$ pages already printed do not depend on $h$, so they are the constant: $P(h) = ${s} + ${rate}h$.`,
                `已打印的 $${s}$ 页与 $h$ 无关，是常数项：$P(h) = ${s} + ${rate}h$。`,
              ),
            ],
            t(
              `After $1$ hour, $P(1) = ${s + rate}$, which is $${s}$ plus $60$ minutes of $${per}$ pages each.`,
              `$1$ 小时后 $P(1) = ${s + rate}$，即 $${s}$ 加上 $60$ 分钟、每分钟 $${per}$ 页。`,
            ),
            [
              t(`This uses the rate per minute although $h$ counts hours.`, `这是用了每分钟的速率，而 $h$ 以小时计。`),
              t(
                `This swaps the roles: the pages already printed do not grow with $h$.`,
                `这是把两者的作用弄反了：已打印的页数不随 $h$ 增加。`,
              ),
              t(
                `This multiplies everything by $h$, so at $h = 0$ it gives $0$ pages instead of $${s}$.`,
                `这是把所有项都乘了 $h$，$h = 0$ 时得 $0$ 页而不是 $${s}$ 页。`,
              ),
              t(`This makes the $${s}$ pages already printed grow every hour.`, `这是让已打印的 $${s}$ 页每小时都在增加。`),
            ],
          ),
        );
      return spr(
        t(
          `A machine has already printed $${s}$ pages and prints $${per}$ pages per minute. How many pages will it have printed in all after $${min}$ minutes and then a further $2$ hours?`,
          `一台机器已打印 $${s}$ 页，每分钟打印 $${per}$ 页。再运行 $${min}$ 分钟，然后再运行 $2$ 小时后，总共打印了多少页？`,
        ),
        s + per * (min + 120),
        [s + per * min, per * (min + 120), s + per * (min + 2)],
        worked(
          [
            step(
              "Use one unit",
              "统一单位",
              `$2$ hours is $2 \\times 60 = 120$ minutes, so the machine runs $${min} + 120 = ${min + 120}$ minutes in all.`,
              `$2$ 小时是 $2 \\times 60 = 120$ 分钟，所以机器共运行 $${min} + 120 = ${min + 120}$ 分钟。`,
            ),
            step(
              "Count the pages",
              "计算页数",
              `In that time it prints $${per} \\times ${min + 120} = ${per * (min + 120)}$ pages. With the $${s}$ already printed, the total is $${s} + ${per * (min + 120)} = ${s + per * (min + 120)}$.`,
              `这段时间打印 $${per} \\times ${min + 120} = ${per * (min + 120)}$ 页。加上已打印的 $${s}$ 页，总数为 $${s} + ${per * (min + 120)} = ${s + per * (min + 120)}$。`,
            ),
          ],
          t(
            `Separately: $${per} \\times ${min} = ${per * min}$ pages in $${min}$ minutes and $${rate} \\times 2 = ${rate * 2}$ in $2$ hours, and $${s} + ${per * min} + ${rate * 2} = ${s + per * (min + 120)}$.`,
            `分开算：$${min}$ 分钟打印 $${per} \\times ${min} = ${per * min}$ 页，$2$ 小时打印 $${rate} \\times 2 = ${rate * 2}$ 页，$${s} + ${per * min} + ${rate * 2} = ${s + per * (min + 120)}$。`,
          ),
          [
            t(`This leaves out the $2$ hours.`, `这是漏掉了那 $2$ 小时。`),
            t(`This leaves out the $${s}$ pages already printed.`, `这是漏掉了已打印的 $${s}$ 页。`),
            t(`This counts the $2$ hours as $2$ minutes.`, `这是把 $2$ 小时当成了 $2$ 分钟。`),
          ],
        ),
      );
    },
  ),
  spec(
    "Interpreting Coefficients of Linear Functions in Context",
    "解释情境中一次函数的系数",
    ["interpreting-coefficients-of-two-variable-equations"],
    (rng, hard) => {
      const c = runner(rng);
      const r = rng.int(3, 15);
      const s = 10 * rng.int(10, 40);
      const eq = c.up ? `f(x) = ${r}x + ${s}` : `f(x) = ${s} - ${r}x`;
      const intro = t(
        `The function $${eq}$ models ${c.en} $x$ ${c.tw.en} after a start.`,
        `函数 $${eq}$ 表示开始 $x$ ${c.tw["zh-CN"]}后${c.zh}。`,
      );
      if (!hard)
        return words(
          rng,
          t(`${intro.en} What does $${r}$ represent?`, `${intro["zh-CN"]}$${r}$ 表示什么？`),
          t(`The amount of change each ${c.tu.en}`, `每${c.tu["zh-CN"]}的变化量`),
          [
            c.start,
            t(`The value after $${r}$ ${c.tw.en}`, `$${r}$ ${c.tw["zh-CN"]}后的值`),
            t(`The number of ${c.tw.en} until the end`, `到结束为止的${c.tw["zh-CN"]}数`),
          ],
          worked(
            [
              step(
                "Find what multiplies x",
                "看乘以变量的数",
                `In $${eq}$, the number $${r}$ multiplies $x$, the number of ${c.tw.en}; the other number, $${s}$, stands alone.`,
                `在 $${eq}$ 中，$${r}$ 乘以 $x$，即${c.tw["zh-CN"]}数；另一个数 $${s}$ 单独出现。`,
              ),
              step(
                "Read it as a rate",
                "理解为变化率",
                `Each time $x$ goes up by $1$, $f$ ${c.up ? "rises" : "falls"} by $${r}$. So $${r}$ is the amount of change each ${c.tu.en}.`,
                `$x$ 每增加 $1$，$f$ 就${c.up ? "增加" : "减少"} $${r}$。所以 $${r}$ 是每${c.tu["zh-CN"]}的变化量。`,
              ),
            ],
            t(
              `$f(1) - f(0) = ${c.up ? `${s + r} - ${s}` : `${s - r} - ${s}`} = ${c.up ? r : -r}$, a change of $${r}$ in one ${c.tu.en}.`,
              `$f(1) - f(0) = ${c.up ? `${s + r} - ${s}` : `${s - r} - ${s}`} = ${c.up ? r : -r}$，一${c.tu["zh-CN"]}变化 $${r}$。`,
            ),
            [
              t(`The starting value is $f(0) = ${s}$, the number that stands alone.`, `初始值是 $f(0) = ${s}$，即单独出现的那个数。`),
              t(
                `The value after $${r}$ ${c.tw.en} is $f(${r})$, an output, not a coefficient.`,
                `$${r}$ ${c.tw["zh-CN"]}后的值是 $f(${r})$，是输出而不是系数。`,
              ),
              t(
                `Nothing in the model says when it ends; $${r}$ is tied to each single ${c.tu.en}.`,
                `模型没有说何时结束；$${r}$ 对应的是每一${c.tu["zh-CN"]}。`,
              ),
            ],
          ),
        );
      const a = rng.int(2, 9);
      return words(
        rng,
        t(`${intro.en} What does $f(${a + 1}) - f(${a})$ represent?`, `${intro["zh-CN"]}$f(${a + 1}) - f(${a})$ 表示什么？`),
        t(`The change during one ${c.tu.en}, which is $${c.up ? r : -r}$`, `一${c.tu["zh-CN"]}内的变化量，即 $${c.up ? r : -r}$`),
        [
          t(
            `The value after $${a}$ ${c.tw.en}, which is $${c.up ? s + r * a : s - r * a}$`,
            `$${a}$ ${c.tw["zh-CN"]}后的值，即 $${c.up ? s + r * a : s - r * a}$`,
          ),
          t(
            `The change during $${a}$ ${c.tw.en}, which is $${(c.up ? r : -r) * a}$`,
            `$${a}$ ${c.tw["zh-CN"]}内的变化量，即 $${(c.up ? r : -r) * a}$`,
          ),
          t(`The starting value, which is $${s}$`, `初始值，即 $${s}$`),
        ],
        worked(
          [
            step(
              "Compare the inputs",
              "比较输入",
              `The inputs $${a + 1}$ and $${a}$ differ by $1$, so $f(${a + 1}) - f(${a})$ is the change over one ${c.tu.en}.`,
              `输入 $${a + 1}$ 与 $${a}$ 相差 $1$，所以 $f(${a + 1}) - f(${a})$ 是一${c.tu["zh-CN"]}内的变化量。`,
            ),
            step(
              "Use the slope",
              "用斜率",
              `A linear function changes by its slope over a step of $1$, so the difference is $${c.up ? r : -r}$.`,
              `一次函数在输入增加 $1$ 时变化的量就是斜率，所以差为 $${c.up ? r : -r}$。`,
            ),
          ],
          t(
            `$f(${a + 1}) = ${c.up ? s + r * (a + 1) : s - r * (a + 1)}$ and $f(${a}) = ${c.up ? s + r * a : s - r * a}$, which differ by $${c.up ? r : -r}$.`,
            `$f(${a + 1}) = ${c.up ? s + r * (a + 1) : s - r * (a + 1)}$，$f(${a}) = ${c.up ? s + r * a : s - r * a}$，相差 $${c.up ? r : -r}$。`,
          ),
          [
            t(`That is $f(${a})$ alone; subtracting it leaves only the change.`, `那只是 $f(${a})$；减去它后只剩变化量。`),
            t(`The inputs differ by $1$, not by $${a}$.`, `两个输入相差 $1$，而不是 $${a}$。`),
            t(`The starting value $f(0)$ cancels when the two outputs are subtracted.`, `两个输出相减时，初始值 $f(0)$ 被消去了。`),
          ],
        ),
      );
    },
  ),
  spec("Interpreting Graphs of Linear Functions", "解释一次函数的图象", ["analyzing-graphs-of-linear-models"], (rng, hard) => {
    const c = runner(rng);
    const r = rng.int(2, 9);
    const s = 10 * rng.int(4, 20);
    const a = rng.int(2, 6);
    const b = a + rng.int(2, 6);
    const m = c.up ? r : -r;
    const pts = `$(${a}, ${s + m * a})$`;
    const pts2 = `$(${b}, ${s + m * b})$`;
    if (!hard)
      return words(
        rng,
        t(
          `The graph of a line modeling ${c.en} $x$ ${c.tw.en} after a start crosses the vertical axis at $(0, ${s})$. What does this point represent?`,
          `表示开始 $x$ ${c.tw["zh-CN"]}后${c.zh}的直线与纵轴交于 $(0, ${s})$。这个点表示什么？`,
        ),
        c.start,
        [
          t(`The change each ${c.tu.en}`, `每${c.tu["zh-CN"]}的变化量`),
          t(`The time when the value is zero`, `值为零的时刻`),
          t(`The value after one ${c.tu.en}`, `一${c.tu["zh-CN"]}后的值`),
        ],
        worked(
          [
            step(
              "Read the coordinates",
              "读坐标",
              `The point $(0, ${s})$ has $x = 0$ and value $${s}$. Here $x$ counts ${c.tw.en} after the start.`,
              `点 $(0, ${s})$ 的 $x = 0$，值为 $${s}$。这里 $x$ 是开始后的${c.tw["zh-CN"]}数。`,
            ),
            step(
              "Interpret",
              "解释含义",
              `$x = 0$ means no time has passed yet, so $${s}$ is ${c.start.en[0]!.toLowerCase()}${c.start.en.slice(1)}.`,
              `$x = 0$ 表示还没有经过时间，所以 $${s}$ 是${c.start["zh-CN"]}。`,
            ),
          ],
          t(
            `Every point on the vertical axis has $x = 0$, so this point describes the start, not a change.`,
            `纵轴上每个点都有 $x = 0$，所以这个点描述的是开始，而不是变化。`,
          ),
          [
            t(
              `The change each ${c.tu.en} is the slope, read from two points, not from one.`,
              `每${c.tu["zh-CN"]}的变化量是斜率，要由两个点读出，而不是一个点。`,
            ),
            t(
              `The value is zero where the line meets the horizontal axis, not the vertical one.`,
              `值为零的点在直线与横轴的交点，而不是纵轴。`,
            ),
            t(`The value after one ${c.tu.en} is at $x = 1$, not $x = 0$.`, `一${c.tu["zh-CN"]}后的值在 $x = 1$ 处，而不是 $x = 0$。`),
          ],
        ),
        pointsFigure(
          [
            [0, s],
            [b, s + m * b],
          ],
          [
            [0, s],
            [b, s + m * b],
          ],
        ),
      );
    return spr(
      t(
        `The graph of a line modeling ${c.en} $x$ ${c.tw.en} after a start passes through ${pts} and ${pts2}. What is the value at $x = 0$?`,
        `表示开始 $x$ ${c.tw["zh-CN"]}后${c.zh}的直线经过 ${pts} 和 ${pts2}。$x = 0$ 时的值是多少？`,
      ),
      s,
      [s + m, r, s + m * a],
      worked(
        [
          step(
            "Find the slope",
            "求斜率",
            `Between the points the value changes by $${s + m * b} - ${par(s + m * a)} = ${m * (b - a)}$ over a run of $${b - a}$, so the slope is $\\frac{${m * (b - a)}}{${b - a}} = ${m}$.`,
            `两点之间值变化 $${s + m * b} - ${par(s + m * a)} = ${m * (b - a)}$，横向变化 $${b - a}$，所以斜率为 $\\frac{${m * (b - a)}}{${b - a}} = ${m}$。`,
          ),
          step(
            "Go back to zero",
            "退回到零",
            `From $x = ${a}$ back to $x = 0$ undoes $${a} \\times ${par(m)} = ${a * m}$, so the value at $x = 0$ is $${s + m * a} - ${par(a * m)} = ${s}$.`,
            `从 $x = ${a}$ 退回 $x = 0$，要去掉 $${a} \\times ${par(m)} = ${a * m}$，所以 $x = 0$ 时的值是 $${s + m * a} - ${par(a * m)} = ${s}$。`,
          ),
        ],
        t(
          `$${s} ${sg(m)} \\times ${a} = ${s + m * a}$ and $${s} ${sg(m)} \\times ${b} = ${s + m * b}$, matching both points.`,
          `$${s} ${sg(m)} \\times ${a} = ${s + m * a}$，$${s} ${sg(m)} \\times ${b} = ${s + m * b}$，与两点相符。`,
        ),
        [
          t(`This is the value at $x = 1$, one step past the start.`, `这是 $x = 1$ 时的值，比开始多了一步。`),
          t(
            `This is the size of the slope, the change per ${c.tu.en}, not a value.`,
            `这是斜率的大小，即每${c.tu["zh-CN"]}的变化量，不是一个值。`,
          ),
          t(`This is the value at $x = ${a}$, read from the first point.`, `这是 $x = ${a}$ 时的值，直接读自第一个点。`),
        ],
      ),
      pointsFigure(
        [
          [a, s + m * a],
          [b, s + m * b],
        ],
        [
          [a, s + m * a],
          [b, s + m * b],
        ],
      ),
    );
  }),
  spec("Modeling Using Slope-Intercept Form", "用斜截式建模", ["modeling-with-two-variable-linear-equations"], (rng, hard) => {
    const r = rng.int(2, 9);
    const s = rng.int(10, 50);
    const n = rng.int(5, 25);
    if (!hard)
      return mc(
        rng,
        t(
          `A candle is $${s + r * n}$ millimeters tall and burns $${r}$ millimeters per hour. Which equation gives its height $y$ after $x$ hours?`,
          `一支蜡烛高 $${s + r * n}$ 毫米，每小时燃烧 $${r}$ 毫米。哪个方程给出 $x$ 小时后的高度 $y$？`,
        ),
        `y = ${s + r * n} - ${r}x`,
        [`y = ${s + r * n} + ${r}x`, `y = ${r} - ${s + r * n}x`, `y = ${s + r * n}x - ${r}`],
        worked(
          [
            step(
              "Find the intercept",
              "找截距",
              `At $x = 0$ no time has passed, so the height is the starting $${s + r * n}$ millimeters. That is the constant term.`,
              `$x = 0$ 时还没有经过时间，高度是最初的 $${s + r * n}$ 毫米，这是常数项。`,
            ),
            step(
              "Find the slope",
              "找斜率",
              `The candle loses $${r}$ millimeters each hour, so the slope is $-${r}$ and $y = ${s + r * n} - ${r}x$.`,
              `蜡烛每小时减少 $${r}$ 毫米，所以斜率为 $-${r}$，$y = ${s + r * n} - ${r}x$。`,
            ),
          ],
          t(
            `After $1$ hour, $y = ${s + r * n} - ${r} = ${s + r * n - r}$, which is $${r}$ millimeters shorter.`,
            `$1$ 小时后 $y = ${s + r * n} - ${r} = ${s + r * n - r}$，短了 $${r}$ 毫米。`,
          ),
          [
            t(`This makes the candle grow; burning makes it shorter.`, `这是让蜡烛变高了；燃烧会让它变短。`),
            t(`This swaps the starting height and the rate.`, `这是把初始高度和燃烧速率交换了。`),
            t(
              `This multiplies the starting height by $x$, so at $x = 0$ the candle would have height $-${r}$.`,
              `这是把初始高度乘以 $x$，$x = 0$ 时高度会是 $-${r}$。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `A candle is $${s + r * n}$ millimeters tall and burns $${r}$ millimeters per hour. After how many hours will it be $${s}$ millimeters tall?`,
        `一支蜡烛高 $${s + r * n}$ 毫米，每小时燃烧 $${r}$ 毫米。多少小时后它高 $${s}$ 毫米？`,
      ),
      n,
      [Q.of(s, r), Q.of(s + r * n, r), n + 1],
      worked(
        [
          step(
            "Set up the equation",
            "列方程",
            `The height after $x$ hours is $${s + r * n} - ${r}x$. Set it equal to $${s}$: $${s + r * n} - ${r}x = ${s}$.`,
            `$x$ 小时后的高度为 $${s + r * n} - ${r}x$。令它等于 $${s}$：$${s + r * n} - ${r}x = ${s}$。`,
          ),
          step(
            "Solve",
            "求解",
            `The candle must lose $${s + r * n} - ${s} = ${r * n}$ millimeters, so $${r}x = ${r * n}$ and $x = ${n}$ hours.`,
            `蜡烛要减少 $${s + r * n} - ${s} = ${r * n}$ 毫米，所以 $${r}x = ${r * n}$，$x = ${n}$ 小时。`,
          ),
        ],
        t(`$${s + r * n} - ${r} \\times ${n} = ${s}$.`, `$${s + r * n} - ${r} \\times ${n} = ${s}$。`),
        [
          t(`This divides the final height by the rate instead of the height lost.`, `这是用最终高度除以速率，而应除以减少的高度。`),
          t(`This is the time to burn down completely, not to $${s}$ millimeters.`, `这是完全烧完所需的时间，而不是烧到 $${s}$ 毫米。`),
          t(`This is one hour too many; the check rules it out.`, `这多了 $1$ 小时；检验排除了它。`),
        ],
      ),
    );
  }),
];
