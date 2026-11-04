import type { Rng } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { cx, mc, mod, sg, spr, tx, words } from "../exam.ts";
import { lineFigure, pointsFigure } from "../exam-figures.ts";

// SAT Math Prep, Algebra: graphs of lines, parallel and perpendicular lines, and modeling with linear functions.

const lineTips = mod(
  t(
    "Rewrite a line in slope-intercept form when you can: $m$ is the change in $y$ for each added $x$, and $b$ is the value at $x = 0$.",
    "尽量把直线改写为斜截式：$m$ 是 $x$ 每增加 1 时 $y$ 的变化量，$b$ 是 $x = 0$ 时的值。",
  ),
  t(
    "Harder questions give the line by two points or in general form. Find the slope first, since everything else follows from it.",
    "较难的题用两点或一般式给出直线。先求斜率，其余都由它得出。",
  ),
);
const parTips = mod(
  t(
    "Parallel lines have equal slopes, and perpendicular slopes multiply to $-1$. Convert the given line to slope-intercept form before comparing.",
    "平行线斜率相等，垂直线斜率之积为 $-1$。比较之前先把给定直线化为斜截式。",
  ),
  t(
    "Harder questions combine the slope condition with a point the new line passes through, so finish by finding the intercept.",
    "较难的题把斜率条件与新直线经过的点结合起来，所以最后要求出截距。",
  ),
);
const modelTips = mod(
  t(
    "In a linear model the starting amount is the constant and the rate multiplies the input. A value that falls over time gives a negative slope.",
    "线性模型中，初始量是常数，变化率乘以输入。随时间下降的量对应负斜率。",
  ),
  t(
    "Harder questions describe the model with two data points. Use them to find the rate first, and watch for units such as minutes and hours.",
    "较难的题用两个数据点描述模型。先用它们求变化率，并注意分钟与小时等单位。",
  ),
);

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
      start: t("the balance when the account was opened", "开户时的余额"),
      up: true,
    },
    {
      en: "the water in a pool, in gallons,",
      zh: "水池中的水量（加仑）",
      tu: t("hour", "小时"),
      tw: t("hours", "小时"),
      start: t("the water in the pool before filling", "注水前水池中的水量"),
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
  lineTips("Interpreting Coefficients of Lines in Slope-Intercept Form", "解释斜截式直线的系数", ["slope-intercept-form"], (rng, hard) => {
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
        t(`At $x = 0$, $y = ${S}$, so this number is the starting value.`, `当 $x = 0$ 时 $y = ${S}$，所以这个数是初始值。`),
      );
    const k = rng.int(2, 6);
    return spr(
      t(
        `${intro.en} By how much does $y$ change over $${k}$ ${c.tw.en}? Give a negative number for a decrease.`,
        `${intro["zh-CN"]}$${k}$ ${c.tw["zh-CN"]}内 $y$ 变化多少？减少时填负数。`,
      ),
      m * k,
      [r, S + m * k, -m * k],
      t(
        `The slope is $${m}$ per ${c.tu.en}, so the change is $${k}(${m}) = ${m * k}$.`,
        `斜率是每${c.tu["zh-CN"]} $${m}$，所以变化量是 $${k}(${m}) = ${m * k}$。`,
      ),
    );
  }),
  lineTips("Finding Equations of Lines Using Slopes and Points", "用斜率和点求直线方程", ["point-slope-form"], (rng, hard) => {
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
    if (!hard)
      return mc(
        rng,
        t(
          `A line has slope $${m}$ and passes through $(${x1}, ${y1})$. Which equation defines the line?`,
          `一条直线斜率为 $${m}$，经过点 $(${x1}, ${y1})$。哪个方程定义这条直线？`,
        ),
        `y = ${cx(m)} ${sg(b)}`,
        wrong,
        t(
          `Substitute the point in $y = ${cx(m)} + b$: $${y1} = ${m}(${x1}) + b$, so $b = ${b}$.`,
          `把点代入 $y = ${cx(m)} + b$：$${y1} = ${m}(${x1}) + b$，所以 $b = ${b}$。`,
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
      t(
        `The slope is $\\frac{${y2} - (${y1})}{${x2} - ${x1}} = ${m}$. Then $${y1} = ${m}(${x1}) + b$ gives $b = ${b}$.`,
        `斜率为 $\\frac{${y2} - (${y1})}{${x2} - ${x1}} = ${m}$。再由 $${y1} = ${m}(${x1}) + b$ 得 $b = ${b}$。`,
      ),
    );
  }),
  lineTips(
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
          t(
            `The slope $${m}$ is ${up ? "positive" : "negative"} and the $y$-intercept $${b}$ is ${pos ? "positive" : "negative"}.`,
            `斜率 $${m}$ 为${up ? "正" : "负"}，$y$ 截距 $${b}$ 为${pos ? "正" : "负"}。`,
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
        t(
          `A shift up adds to the output: the new line is $y = ${cx(m)} ${sg(b + Math.abs(b) + 1)}$. At $x = ${a}$, $k = ${m * a + b + Math.abs(b) + 1}$.`,
          `向上平移是给输出增加：新直线为 $y = ${cx(m)} ${sg(b + Math.abs(b) + 1)}$。当 $x = ${a}$ 时，$k = ${m * a + b + Math.abs(b) + 1}$。`,
        ),
        lineFigure(m, b),
      );
    },
  ),
  lineTips(
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
          t(
            `Solve for $y$: $y = ${m.toLatex()}x ${yInt.sign() > 0 ? "+" : "-"} ${yInt.abs().toLatex()}$, so the coefficient of $x$ is the slope.`,
            `解出 $y$：$y = ${m.toLatex()}x ${yInt.sign() > 0 ? "+" : "-"} ${yInt.abs().toLatex()}$，所以 $x$ 的系数就是斜率。`,
          ),
        );
      return mc(
        rng,
        t(`What is the $y$-coordinate of the $y$-intercept of the line $${eq}$?`, `直线 $${eq}$ 的 $y$ 截距的纵坐标是多少？`),
        yInt,
        [Q.of(c, a), Q.of(-sign * c, b), Q.of(c)],
        t(
          `Set $x = 0$: $${sign > 0 ? "" : "-"}${b}y = ${c}$, so $y = ${yInt.toLatex()}$.`,
          `令 $x = 0$：$${sign > 0 ? "" : "-"}${b}y = ${c}$，所以 $y = ${yInt.toLatex()}$。`,
        ),
      );
    },
  ),
  lineTips(
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
          t(
            `At the $x$-intercept $y = 0$, so $${a}x = ${c}$ and $x = ${b * k}$.`,
            `在 $x$ 截距处 $y = 0$，所以 $${a}x = ${c}$，$x = ${b * k}$。`,
          ),
        );
      return spr(
        t(
          `The line $${eq}$ meets the axes at two points. What is the area of the triangle formed by the line and the two axes?`,
          `直线 $${eq}$ 与两坐标轴交于两点。这条直线与两坐标轴围成的三角形面积是多少？`,
        ),
        Q.of(a * k * b * k, 2),
        [a * k * b * k, a * k + b * k, c],
        t(
          `The intercepts are $x = ${b * k}$ and $y = ${a * k}$, which are the legs of a right triangle. The area is $\\frac{1}{2}(${b * k})(${a * k}) = ${Q.of(a * k * b * k, 2).toLatex()}$.`,
          `截距为 $x = ${b * k}$ 和 $y = ${a * k}$，它们是直角三角形的两条直角边。面积为 $\\frac{1}{2}(${b * k})(${a * k}) = ${Q.of(a * k * b * k, 2).toLatex()}$。`,
        ),
      );
    },
  ),
  lineTips("Analyzing Linear Equations in General Form", "分析一般式一次方程", ["properties-of-lines-in-standard-form"], (rng, hard) => {
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
        t(
          `Multiplying $x$ and $y$ coefficients by the same number keeps the slope $-\\frac{${a}}{${b}}$. The constant must not scale by that number, or the graph would be the same line.`,
          `$x$ 与 $y$ 的系数乘以同一个数，斜率 $-\\frac{${a}}{${b}}$ 不变。常数不能按同一倍数变化，否则是同一条直线。`,
        ),
      );
    return spr(
      t(
        `In the $xy$-plane, the line $${eq}$ passes through $(1, t)$ and $(${1 + b}, s)$. What is the value of $t - s$?`,
        `在 $xy$ 平面中，直线 $${eq}$ 经过 $(1, t)$ 和 $(${1 + b}, s)$。$t - s$ 的值是多少？`,
      ),
      a,
      [-a, b, Q.of(a, b)],
      t(
        `The slope is $-\\frac{${a}}{${b}}$, so a run of $${b}$ changes $y$ by $-${a}$. That means $s = t - ${a}$ and $t - s = ${a}$.`,
        `斜率为 $-\\frac{${a}}{${b}}$，横向变化 $${b}$ 时 $y$ 变化 $-${a}$。所以 $s = t - ${a}$，$t - s = ${a}$。`,
      ),
    );
  }),
  lineTips(
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
          t(
            `$f(0)$ gives the intercept $${b}$. The slope is $\\frac{${fa} - (${b})}{${a}} = ${m}$.`,
            `$f(0)$ 给出截距 $${b}$。斜率为 $\\frac{${fa} - (${b})}{${a}} = ${m}$。`,
          ),
        );
      return spr(
        t(
          `For the linear function $f$, $f(${a}) = ${fa}$ and $f(${c}) = ${fc}$. What is the value of $f(0)$?`,
          `对一次函数 $f$，$f(${a}) = ${fa}$，$f(${c}) = ${fc}$。$f(0)$ 的值是多少？`,
        ),
        b,
        [m, fa - m, fa + m * a],
        t(
          `The slope is $\\frac{${fc} - (${fa})}{${c} - ${a}} = ${m}$. Going back $${a}$ from $x = ${a}$ gives $f(0) = ${fa} - ${a}(${m}) = ${b}$.`,
          `斜率为 $\\frac{${fc} - (${fa})}{${c} - ${a}} = ${m}$。从 $x = ${a}$ 回退 $${a}$，得 $f(0) = ${fa} - ${a}(${m}) = ${b}$。`,
        ),
      );
    },
  ),
  parTips("Parallel Lines", "平行线", ["parallel-lines-in-the-coordinate-plane"], (rng, hard) => {
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
        t(
          `Solving for $y$ shows the slope of the given line is $${m.toLatex()}$, and parallel lines have equal slopes.`,
          `解出 $y$，给定直线的斜率为 $${m.toLatex()}$，平行线斜率相等。`,
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
      t(
        `The slope is $${m.toLatex()}$. Using the point, $${y0} = ${m.toLatex()}(${x0}) + b$, so $b = ${k}$.`,
        `斜率为 $${m.toLatex()}$。代入点，$${y0} = ${m.toLatex()}(${x0}) + b$，所以 $b = ${k}$。`,
      ),
    );
  }),
  parTips("Slopes of Perpendicular Lines", "垂直线的斜率", ["perpendicular-lines-in-the-coordinate-plane"], (rng, hard) => {
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
        t(
          `Perpendicular slopes multiply to $-1$, so take the negative reciprocal of $${m.toLatex()}$.`,
          `垂直直线的斜率之积为 $-1$，所以取 $${m.toLatex()}$ 的负倒数。`,
        ),
      );
    }
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    return mc(
      rng,
      t(
        `What is the slope of a line perpendicular to $${a}x ${s > 0 ? "+" : "-"} ${b}y = ${rng.int(2, 20)}$?`,
        `与直线 $${a}x ${s > 0 ? "+" : "-"} ${b}y = ${rng.int(2, 20)}$ 垂直的直线斜率是多少？`,
      ),
      Q.of(s * b, a),
      [Q.of(-s * a, b), Q.of(s * a, b), Q.of(-s * b, a)],
      t(
        `The given line has slope $${Q.of(-s * a, b).toLatex()}$. Its negative reciprocal is $${Q.of(s * b, a).toLatex()}$.`,
        `给定直线斜率为 $${Q.of(-s * a, b).toLatex()}$。它的负倒数是 $${Q.of(s * b, a).toLatex()}$。`,
      ),
    );
  }),
  parTips("Perpendicular Lines", "垂直线", ["finding-equations-of-perpendicular-lines"], (rng, hard) => {
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
        t(
          `The slope is the negative reciprocal, $${neg.toLatex()}$. Using the point, $${y0} = ${neg.toLatex()}(${x0}) + b$ gives $b = ${k}$.`,
          `斜率是负倒数 $${neg.toLatex()}$。代入点，$${y0} = ${neg.toLatex()}(${x0}) + b$，得 $b = ${k}$。`,
        ),
      );
    return spr(
      t(
        `Line $\\ell$ is perpendicular to $y = ${m}x ${sg(b)}$ and passes through $(${x0}, ${y0})$. If $\\ell$ also passes through $(0, c)$, what is the value of $c$?`,
        `直线 $\\ell$ 与 $y = ${m}x ${sg(b)}$ 垂直，且经过 $(${x0}, ${y0})$。若 $\\ell$ 还经过 $(0, c)$，则 $c$ 的值是多少？`,
      ),
      k,
      [y0, b, y0 - m * x0],
      t(
        `Slope $${neg.toLatex()}$ means a run of $${-x0}$ from $(${x0}, ${y0})$ changes $y$ by $${x0 / m}$, so $c = ${k}$.`,
        `斜率 $${neg.toLatex()}$ 表示从 $(${x0}, ${y0})$ 横向变化 $${-x0}$ 时 $y$ 变化 $${x0 / m}$，所以 $c = ${k}$。`,
      ),
    );
  }),
  modelTips("Modeling With Linear Functions", "用一次函数建模", ["modeling-with-linear-functions"], (rng, hard) => {
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
        t(`Substitute $x = ${x0}$: $${s} ${sg(m)}(${x0}) = ${s + m * x0}$.`, `代入 $x = ${x0}$：$${s} ${sg(m)}(${x0}) = ${s + m * x0}$。`),
      );
    return spr(
      t(
        `The function $${fn}$ models ${c.en} $x$ ${c.tw.en} after a start. After how many ${c.tw.en} is the value $${s + m * x0}$?`,
        `函数 $${fn}$ 表示开始 $x$ ${c.tw["zh-CN"]}后${c.zh}。多少${c.tw["zh-CN"]}后值为 $${s + m * x0}$？`,
      ),
      x0,
      [s + m * x0, m * x0, x0 + 1],
      t(
        `Set $${s} ${sg(m)}x = ${s + m * x0}$. Then $${m}x = ${m * x0}$ and $x = ${x0}$.`,
        `令 $${s} ${sg(m)}x = ${s + m * x0}$。于是 $${m}x = ${m * x0}$，$x = ${x0}$。`,
      ),
    );
  }),
  modelTips("Constructing Models Using Linear Functions", "用一次函数构造模型", ["constructing-linear-functions"], (rng, hard) => {
    const c = runner(rng);
    const r = rng.int(3, 15);
    const s = 10 * rng.int(10, 40);
    const a = rng.int(2, 6);
    const b = a + rng.int(2, 6);
    const m = c.up ? r : -r;
    const good = `f(x) = ${s} ${tx(m)}`;
    const wrong = [`f(x) = ${r} ${tx(c.up ? s : -s)}`, `f(x) = ${s} ${tx(-m)}`, `f(x) = ${s + m} ${tx(m)}`, `f(x) = ${s + m * a} ${tx(m)}`];
    if (!hard)
      return mc(
        rng,
        t(
          `${c.en[0]!.toUpperCase()}${c.en.slice(1, -1)} is $${s}$ at the start and changes by $${m}$ each ${c.tu.en}. Which function gives the value after $x$ ${c.tw.en}?`,
          `${c.zh}开始时为 $${s}$，每${c.tu["zh-CN"]}变化 $${m}$。哪个函数给出 $x$ ${c.tw["zh-CN"]}后的值？`,
        ),
        good,
        wrong,
        t(`The start is the constant, and the change per ${c.tu.en} multiplies $x$.`, `初始值是常数，每${c.tu["zh-CN"]}的变化量乘以 $x$。`),
      );
    return mc(
      rng,
      t(
        `${c.en[0]!.toUpperCase()}${c.en.slice(1, -1)} is $${s + m * a}$ after $${a}$ ${c.tw.en} and $${s + m * b}$ after $${b}$ ${c.tw.en}, changing at a constant rate. Which function gives the value after $x$ ${c.tw.en}?`,
        `${c.zh}在 $${a}$ ${c.tw["zh-CN"]}后为 $${s + m * a}$，在 $${b}$ ${c.tw["zh-CN"]}后为 $${s + m * b}$，以恒定速率变化。哪个函数给出 $x$ ${c.tw["zh-CN"]}后的值？`,
      ),
      good,
      wrong,
      t(
        `The rate is $\\frac{${m * (b - a)}}{${b - a}} = ${m}$. Going back $${a}$ ${c.tw.en} gives the start $${s + m * a} - ${a}(${m}) = ${s}$.`,
        `变化率为 $\\frac{${m * (b - a)}}{${b - a}} = ${m}$。回退 $${a}$ ${c.tw["zh-CN"]}，得初始值 $${s + m * a} - ${a}(${m}) = ${s}$。`,
      ),
    );
  }),
  modelTips(
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
          t(
            `$h$ is in hours, so convert the rate: $${per} \\cdot 60 = ${rate}$ pages per hour. Then add the pages already printed.`,
            `$h$ 的单位是小时，所以换算速率：$${per} \\cdot 60 = ${rate}$ 页每小时。再加上已打印的页数。`,
          ),
        );
      return spr(
        t(
          `A machine has already printed $${s}$ pages and prints $${per}$ pages per minute. How many pages will it have printed in all after $${min}$ minutes and then a further $2$ hours?`,
          `一台机器已打印 $${s}$ 页，每分钟打印 $${per}$ 页。再运行 $${min}$ 分钟，然后再运行 $2$ 小时后，总共打印了多少页？`,
        ),
        s + per * (min + 120),
        [s + per * min, per * (min + 120), s + per * (min + 2)],
        t(
          `The machine runs $${min} + 120 = ${min + 120}$ minutes, printing $${per * (min + 120)}$ pages. With the first $${s}$, the total is $${s + per * (min + 120)}$.`,
          `机器运行 $${min} + 120 = ${min + 120}$ 分钟，打印 $${per * (min + 120)}$ 页。加上最初的 $${s}$ 页，总数为 $${s + per * (min + 120)}$。`,
        ),
      );
    },
  ),
  modelTips(
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
          t(
            `$${r}$ multiplies $x$, so $f$ changes by that amount for each added ${c.tu.en}.`,
            `$${r}$ 乘以 $x$，所以每多一${c.tu["zh-CN"]}，$f$ 变化这么多。`,
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
        t(
          `Consecutive inputs differ by one ${c.tu.en}, and a linear function changes by its slope over that step.`,
          `相邻输入相差一${c.tu["zh-CN"]}，一次函数在这一步变化的量就是斜率。`,
        ),
      );
    },
  ),
  modelTips("Interpreting Graphs of Linear Functions", "解释一次函数的图象", ["analyzing-graphs-of-linear-models"], (rng, hard) => {
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
        t(`The vertical axis is where $x = 0$, the moment of the start.`, `纵轴上 $x = 0$，即开始的时刻。`),
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
      t(
        `The slope is $\\frac{${m * (b - a)}}{${b - a}} = ${m}$. Then $${s + m * a} - ${a}(${m}) = ${s}$.`,
        `斜率为 $\\frac{${m * (b - a)}}{${b - a}} = ${m}$。于是 $${s + m * a} - ${a}(${m}) = ${s}$。`,
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
  modelTips("Modeling Using Slope-Intercept Form", "用斜截式建模", ["modeling-with-two-variable-linear-equations"], (rng, hard) => {
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
        t(
          `The candle starts at $${s + r * n}$ and gets shorter, so the slope is $-${r}$.`,
          `蜡烛从 $${s + r * n}$ 开始变短，所以斜率为 $-${r}$。`,
        ),
      );
    return spr(
      t(
        `A candle is $${s + r * n}$ millimeters tall and burns $${r}$ millimeters per hour. After how many hours will it be $${s}$ millimeters tall?`,
        `一支蜡烛高 $${s + r * n}$ 毫米，每小时燃烧 $${r}$ 毫米。多少小时后它高 $${s}$ 毫米？`,
      ),
      n,
      [Q.of(s, r), Q.of(s + r * n, r), n + 1],
      t(
        `Solve $${s + r * n} - ${r}x = ${s}$: $${r}x = ${r * n}$, so $x = ${n}$.`,
        `解 $${s + r * n} - ${r}x = ${s}$：$${r}x = ${r * n}$，所以 $x = ${n}$。`,
      ),
    );
  }),
];
