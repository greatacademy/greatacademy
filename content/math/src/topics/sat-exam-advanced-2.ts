import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { curveFigure, mc, mod, sg, spr, table, tx, words } from "../exam.ts";

// SAT Math Prep, Advanced Math: quadratic functions, quadratic models and polynomials.

const fnTips = mod(
  t(
    "Each form of a quadratic shows something at once: vertex form the extreme point, factored form the zeros, and standard form the $y$-intercept.",
    "二次函数的每种形式都直接显示某个特征：顶点式显示极值点，因式式显示零点，一般式显示 $y$ 轴截距。",
  ),
  t(
    "A parabola is symmetric about the vertical line through its vertex, so two points with equal outputs have the axis halfway between them.",
    "抛物线关于过顶点的竖直线对称，所以输出相等的两点，其对称轴在它们的正中间。",
  ),
);
const modelTips = mod(
  t(
    "Say what the variable stands for before you write the equation, and check that the answer makes sense in the situation. A negative length or time gets rejected.",
    "列方程前先说清变量的含义，并检查答案是否符合情境。负的长度或时间要舍去。",
  ),
  t(
    "In a quadratic model, the constant term is the starting value and the vertex gives the greatest or least value, and when it occurs.",
    "在二次模型中，常数项是起始值，顶点给出最大或最小值及其出现的时间。",
  ),
);
const polyTips = mod(
  t(
    "A zero $r$ of a polynomial means $x - r$ is a factor, and the graph crosses or touches the $x$-axis there. A squared factor touches without crossing.",
    "多项式的零点 $r$ 表示 $x - r$ 是因式，图象在该处穿过或接触 $x$ 轴。平方因式只接触不穿过。",
  ),
  t(
    "Replacing $x$ by $x - h$ moves a graph right by $h$, and adding $k$ moves it up by $k$. Multiplying the output stretches it vertically.",
    "把 $x$ 换成 $x - h$ 使图象右移 $h$，加上 $k$ 使其上移 $k$。输出乘以一个数使图象竖直伸缩。",
  ),
);

const parabolaFig = (a: number, h: number, k: number) =>
  curveFigure(
    (x) => a * (x - h) * (x - h) + k,
    { x: [h - 5, h + 5], y: [Math.min(k, k + a * 9) - 2, Math.max(k, k + a * 9) + 2], dx: 1, dy: Math.ceil(Math.abs(a * 9) / 6) || 1 },
    t("A parabola on a coordinate grid.", "坐标网格上的一条抛物线。"),
  );

/** satExamAdvanced2 are the exam-style questions on quadratic functions, quadratic models and polynomials. */
export const satExamAdvanced2: ExamSpec[] = [
  fnTips("Quadratic Functions", "二次函数", ["graphs-of-general-quadratic-functions"], (rng, hard) => {
    const [a, b, c, k] = [rng.int(2, 5), rng.nonZero(-6, 6), rng.nonZero(-9, 9), rng.int(1, 5)];
    const f = `${a}x^2 ${tx(b)} ${sg(c)}`;
    if (!hard)
      return mc(
        rng,
        t(
          `The function $f$ is defined by $f(x) = ${f}$. What is the value of $f(${k})$?`,
          `函数 $f$ 定义为 $f(x) = ${f}$。$f(${k})$ 的值是多少？`,
        ),
        a * k * k + b * k + c,
        [a * k + b * k + c, a * k * k + b * k, (a * k) ** 2 + b * k + c],
        t(
          `Square first: $${a}(${k * k}) ${sg(b)}(${k}) ${sg(c)} = ${a * k * k + b * k + c}$.`,
          `先平方：$${a}(${k * k}) ${sg(b)}(${k}) ${sg(c)} = ${a * k * k + b * k + c}$。`,
        ),
      );
    return spr(
      t(`For the function $f(x) = ${f}$, what is the value of $f(${-k})$?`, `对函数 $f(x) = ${f}$，$f(${-k})$ 的值是多少？`),
      a * k * k - b * k + c,
      [-a * k * k - b * k + c, a * k * k + b * k + c, a * k - b * k + c],
      t(
        `A negative input squared is positive: $${a}(${k * k}) ${sg(-b * k)} ${sg(c)} = ${a * k * k - b * k + c}$.`,
        `负数的平方是正数：$${a}(${k * k}) ${sg(-b * k)} ${sg(c)} = ${a * k * k - b * k + c}$。`,
      ),
    );
  }),
  fnTips("Graphs of Quadratic Functions", "二次函数的图象", ["graphs-of-general-quadratic-functions"], (rng, hard) => {
    const a = rng.pick([1, -1]);
    const [h, k] = [rng.nonZero(-4, 4), rng.nonZero(-6, 6)];
    const fig = parabolaFig(a, h, k);
    if (!hard)
      return mc(
        rng,
        t(
          `The graph of $y = f(x)$ is shown, where $f$ is a quadratic function. What are the coordinates of its vertex?`,
          `图中是二次函数 $y = f(x)$ 的图象。它的顶点坐标是什么？`,
        ),
        `(${h}, ${k})`,
        [`(${k}, ${h})`, `(${-h}, ${k})`, `(${h}, ${-k})`, `(${-h}, ${-k})`],
        t(
          `The vertex is the ${a > 0 ? "lowest" : "highest"} point of the graph, at $(${h}, ${k})$.`,
          `顶点是图象的最${a > 0 ? "低" : "高"}点，在 $(${h}, ${k})$。`,
        ),
        fig,
      );
    return mc(
      rng,
      t(`The graph of $y = f(x)$ is shown. Which equation could define $f$?`, `图中是 $y = f(x)$ 的图象。哪个方程可能定义 $f$？`),
      `f(x) = ${a < 0 ? "-" : ""}(x ${sg(-h)})^2 ${sg(k)}`,
      [
        `f(x) = ${a < 0 ? "-" : ""}(x ${sg(h)})^2 ${sg(k)}`,
        `f(x) = ${a < 0 ? "" : "-"}(x ${sg(-h)})^2 ${sg(k)}`,
        `f(x) = ${a < 0 ? "-" : ""}(x ${sg(-h)})^2 ${sg(-k)}`,
        `f(x) = ${a < 0 ? "" : "-"}(x ${sg(h)})^2 ${sg(k)}`,
      ],
      t(
        `The vertex $(${h}, ${k})$ gives $(x ${sg(-h)})^2 ${sg(k)}$, and the graph opens ${a > 0 ? "up" : "down"}, so the leading sign is ${a > 0 ? "positive" : "negative"}.`,
        `顶点 $(${h}, ${k})$ 给出 $(x ${sg(-h)})^2 ${sg(k)}$，图象开口向${a > 0 ? "上" : "下"}，所以首项为${a > 0 ? "正" : "负"}。`,
      ),
      fig,
    );
  }),
  fnTips(
    "Finding Extreme Values of Quadratic Functions in Vertex Form",
    "由顶点式求二次函数的极值",
    ["the-vertex-form-of-a-parabola"],
    (rng, hard) => {
      const [a, h, k] = [rng.int(2, 6), rng.nonZero(-8, 8), rng.nonZero(-9, 9)];
      if (!hard)
        return mc(
          rng,
          t(
            `What is the minimum value of $f(x) = ${a}(x ${sg(-h)})^2 ${sg(k)}$?`,
            `$f(x) = ${a}(x ${sg(-h)})^2 ${sg(k)}$ 的最小值是多少？`,
          ),
          k,
          [h, -k, a, a + k],
          t(
            `A square is never negative, so the least output occurs at $x = ${h}$ and equals $${k}$.`,
            `平方不会为负，所以最小输出出现在 $x = ${h}$，等于 $${k}$。`,
          ),
        );
      return spr(
        t(
          `The function $g(x) = -${a}(x ${sg(-h)})^2 ${sg(k)}$ reaches its maximum at $x = m$. What is the value of $m$?`,
          `函数 $g(x) = -${a}(x ${sg(-h)})^2 ${sg(k)}$ 在 $x = m$ 处取得最大值。$m$ 的值是多少？`,
        ),
        h,
        [-h, k, -a],
        t(
          `The squared term is zero when $x = ${h}$, and any other input lowers the value. So $m = ${h}$.`,
          `当 $x = ${h}$ 时平方项为零，其他输入都会使值变小。所以 $m = ${h}$。`,
        ),
      );
    },
  ),
  fnTips(
    "Using Standard and Factored Forms to Reason About Quadratic Functions",
    "用一般式和因式式分析二次函数",
    ["reasoning-about-coefficients-of-quadratics-using-standard-and-factored-forms"],
    (rng, hard) => {
      const [a, r] = [rng.int(2, 5), rng.nonZero(-7, 7)];
      let s = rng.nonZero(-7, 7);
      if (s === r) s = r + 1 === 0 ? r + 2 : r + 1;
      const f = `${a}(x ${sg(-r)})(x ${sg(-s)})`;
      if (!hard)
        return mc(
          rng,
          t(`The function $f(x) = ${f}$ has what $y$-intercept?`, `函数 $f(x) = ${f}$ 的 $y$ 轴截距是什么？`),
          `(0, ${a * r * s})`,
          [`(0, ${r * s})`, `(0, ${-a * r * s})`, `(${r}, 0)`, `(0, ${a})`],
          t(`Set $x = 0$: $${a}(${-r})(${-s}) = ${a * r * s}$.`, `令 $x = 0$：$${a}(${-r})(${-s}) = ${a * r * s}$。`),
        );
      return spr(
        t(
          `When $f(x) = ${f}$ is written as $ax^2 + bx + c$, what is the value of $b$?`,
          `把 $f(x) = ${f}$ 写成 $ax^2 + bx + c$ 时，$b$ 的值是多少？`,
        ),
        -a * (r + s),
        [a * (r + s), -(r + s), a * r * s],
        t(
          `The $x$ coefficient of the product is $-(${r} ${sg(s)})$. Multiplying by $${a}$ gives $${-a * (r + s)}$.`,
          `乘积中 $x$ 的系数是 $-(${r} ${sg(s)})$。乘以 $${a}$ 得 $${-a * (r + s)}$。`,
        ),
      );
    },
  ),
  fnTips(
    "Using Symmetry to Reason About Quadratic Functions",
    "用对称性分析二次函数",
    ["reasoning-about-coefficients-of-quadratics-using-symmetry"],
    (rng, hard) => {
      const h = rng.nonZero(-6, 6);
      const d = rng.int(1, 6);
      const y = rng.int(2, 20);
      if (!hard)
        return spr(
          t(
            `For a quadratic function $f$, $f(${h - d}) = ${y}$ and $f(${h + d}) = ${y}$. What is the $x$-coordinate of the vertex of the graph of $f$?`,
            `对二次函数 $f$，$f(${h - d}) = ${y}$，$f(${h + d}) = ${y}$。$f$ 的图象顶点的横坐标是多少？`,
          ),
          h,
          [y, d, 2 * h],
          t(
            `Equal outputs lie symmetrically about the axis, which is halfway between: $\\frac{${h - d} ${sg(h + d)}}{2} = ${h}$.`,
            `输出相等的点关于对称轴对称，对称轴在正中间：$\\frac{${h - d} ${sg(h + d)}}{2} = ${h}$。`,
          ),
        );
      const e = d + rng.int(1, 4);
      return spr(
        t(
          `The graph of a quadratic function has axis of symmetry $x = ${h}$ and passes through $(${h - e}, ${y})$. What other value of $x$ gives an output of $${y}$?`,
          `二次函数图象的对称轴为 $x = ${h}$，且过点 $(${h - e}, ${y})$。另一个使输出为 $${y}$ 的 $x$ 值是多少？`,
        ),
        h + e,
        [h - e, h, y],
        t(
          `The point is $${e}$ left of the axis, so its mirror image is $${e}$ right of it, at $${h + e}$.`,
          `该点在对称轴左侧 $${e}$ 处，所以其镜像在右侧 $${e}$ 处，即 $${h + e}$。`,
        ),
      );
    },
  ),
  fnTips(
    "Identifying Quadratic Functions From Tabular Data",
    "由表格识别二次函数",
    ["fitting-quadratic-functions-to-data-using-vertex-form"],
    (rng, hard) => {
      const [a, h, k] = [rng.int(1, 4), rng.nonZero(-3, 3), rng.nonZero(-5, 8)];
      const xs = [h - 2, h - 1, h, h + 1, h + 2];
      const ys = xs.map((x) => a * (x - h) ** 2 + k);
      const tb = table("x", "f(x)", xs, ys);
      const lead = a === 1 ? "" : `${a}`;
      if (!hard)
        return mc(
          rng,
          t(
            `The table shows values of a quadratic function $f$. Which equation defines $f$?\n\n${tb}`,
            `表格给出二次函数 $f$ 的一些值。哪个方程定义了 $f$？\n\n${tb}`,
          ),
          `f(x) = ${lead}(x ${sg(-h)})^2 ${sg(k)}`,
          [
            `f(x) = ${lead}(x ${sg(h)})^2 ${sg(k)}`,
            `f(x) = ${a + 1}(x ${sg(-h)})^2 ${sg(k)}`,
            `f(x) = ${lead}(x ${sg(-h)})^2 + ${Math.abs(k) + a + 9}`,
            `f(x) = ${a + 1}(x ${sg(h)})^2 ${sg(k)}`,
          ],
          t(
            `The outputs are symmetric about $x = ${h}$, so the vertex is $(${h}, ${k})$. One step from it adds $${a}$, so the leading coefficient is $${a}$.`,
            `输出关于 $x = ${h}$ 对称，所以顶点是 $(${h}, ${k})$。离开顶点一步增加 $${a}$，所以首项系数是 $${a}$。`,
          ),
        );
      return spr(
        t(
          `The table shows values of a quadratic function $f$. What is the value of $f(${h + 3})$?\n\n${tb}`,
          `表格给出二次函数 $f$ 的一些值。$f(${h + 3})$ 的值是多少？\n\n${tb}`,
        ),
        9 * a + k,
        [3 * a + k, 6 * a + k, 5 * a + k],
        t(
          `The vertex is $(${h}, ${k})$ and the leading coefficient is $${a}$, so the value three steps away is $${a}(9) ${sg(k)} = ${9 * a + k}$.`,
          `顶点是 $(${h}, ${k})$，首项系数是 $${a}$，所以离顶点三步处的值为 $${a}(9) ${sg(k)} = ${9 * a + k}$。`,
        ),
      );
    },
  ),
  modelTips(
    "Modeling Number Problems With Quadratic Equations",
    "用二次方程解数字问题",
    ["modeling-with-quadratic-equations"],
    (rng, hard) => {
      const n = rng.int(3, 15);
      const d = rng.int(1, 6);
      if (!hard)
        return mc(
          rng,
          t(
            `The product of a positive number $x$ and a number $${d}$ greater than $x$ is $${n * (n + d)}$. Which equation represents this situation?`,
            `一个正数 $x$ 与比 $x$ 大 $${d}$ 的数之积为 $${n * (n + d)}$。哪个方程表示这个情形？`,
          ),
          `x(x + ${d}) = ${n * (n + d)}`,
          [`x + (x + ${d}) = ${n * (n + d)}`, `${d}x = ${n * (n + d)}`, `x^2 + ${d} = ${n * (n + d)}`, `x(x - ${d}) = ${n * (n + d)}`],
          t(`The second number is $x + ${d}$, and "product" means multiply.`, `第二个数是 $x + ${d}$，“积”表示相乘。`),
        );
      return spr(
        t(
          `Two positive integers differ by $${d}$ and have a product of $${n * (n + d)}$. What is the greater integer?`,
          `两个正整数相差 $${d}$，积为 $${n * (n + d)}$。较大的整数是多少？`,
        ),
        n + d,
        [n, 2 * n + d, n + 2 * d],
        t(
          `Solve $x(x + ${d}) = ${n * (n + d)}$. The positive solution is $x = ${n}$, so the greater integer is $${n + d}$.`,
          `解 $x(x + ${d}) = ${n * (n + d)}$。正解为 $x = ${n}$，所以较大的整数是 $${n + d}$。`,
        ),
      );
    },
  ),
  modelTips("Solving Border Problems With Quadratic Equations", "解边框问题", ["border-problems"], (rng, hard) => {
    const [w, l, b] = [rng.int(4, 12), rng.int(13, 22), rng.int(1, 4)];
    const area = (l + 2 * b) * (w + 2 * b);
    if (!hard)
      return mc(
        rng,
        t(
          `A rectangular photo $${l}$ inches by $${w}$ inches has a frame of uniform width $x$ inches around it. The total area of the photo and frame is $${area}$ square inches. Which equation can be used to find $x$?`,
          `一张长 $${l}$ 英寸、宽 $${w}$ 英寸的矩形照片四周有宽度均为 $x$ 英寸的边框。照片和边框的总面积为 $${area}$ 平方英寸。哪个方程可用于求 $x$？`,
        ),
        `(${l} + 2x)(${w} + 2x) = ${area}`,
        [`(${l} + x)(${w} + x) = ${area}`, `${l * w} + 2x = ${area}`, `(${l} - 2x)(${w} - 2x) = ${area}`, `2(${l} + ${w}) + 4x = ${area}`],
        t(`The frame adds $x$ on each side, so each dimension grows by $2x$.`, `边框在每边增加 $x$，所以长和宽都增加 $2x$。`),
      );
    return spr(
      t(
        `A rectangular garden $${l}$ feet by $${w}$ feet is surrounded by a path of uniform width. The garden and path together cover $${area}$ square feet. What is the width of the path, in feet?`,
        `一块长 $${l}$ 英尺、宽 $${w}$ 英尺的矩形花园四周有一条宽度均匀的小路。花园和小路共占 $${area}$ 平方英尺。小路的宽度是多少英尺？`,
      ),
      b,
      [2 * b, b + 1, area - l * w],
      t(
        `Solve $(${l} + 2x)(${w} + 2x) = ${area}$. The positive solution is $x = ${b}$.`,
        `解 $(${l} + 2x)(${w} + 2x) = ${area}$。正解为 $x = ${b}$。`,
      ),
    );
  }),
  modelTips(
    "Interpreting Quadratic Functions in Modeling Contexts",
    "在建模情境中解释二次函数",
    ["revenue-cost-and-profit-functions"],
    (rng, hard) => {
      const [a, h, k] = [rng.pick([2, 4, 5]), rng.int(2, 8), rng.pick([100, 150, 180, 240])];
      const f = `-${a}(t - ${h})^2 + ${k}`;
      if (!hard)
        return words(
          rng,
          t(
            `A company's daily profit, in dollars, after a price change of $t$ dollars is $P(t) = ${f}$. What does $${k}$ represent?`,
            `某公司价格变动 $t$ 美元后的日利润（美元）为 $P(t) = ${f}$。$${k}$ 表示什么？`,
          ),
          t("The greatest possible daily profit", "可能的最大日利润"),
          [
            t("The price change that gives the greatest profit", "使利润最大的价格变动"),
            t("The daily profit with no price change", "价格不变时的日利润"),
            t("The increase in profit for each dollar of price change", "价格每变动一美元利润的增加量"),
          ],
          t(
            `The squared term is at most zero, so the output is greatest when it vanishes, and that output is $${k}$.`,
            `平方项最大为零，所以它为零时输出最大，这个输出就是 $${k}$。`,
          ),
        );
      return words(
        rng,
        t(
          `A company's daily profit, in dollars, after a price change of $t$ dollars is $P(t) = ${f}$. What does $${h}$ represent?`,
          `某公司价格变动 $t$ 美元后的日利润（美元）为 $P(t) = ${f}$。$${h}$ 表示什么？`,
        ),
        t("The price change that gives the greatest profit", "使利润最大的价格变动"),
        [
          t("The greatest possible daily profit", "可能的最大日利润"),
          t("The price change at which the profit is zero", "利润为零时的价格变动"),
          t("The decrease in profit per dollar of price change", "价格每变动一美元利润的减少量"),
        ],
        t(
          `The vertex is at $t = ${h}$, so that price change makes the profit greatest.`,
          `顶点在 $t = ${h}$，所以这个价格变动使利润最大。`,
        ),
      );
    },
  ),
  modelTips(
    "Interpreting Graphs of Quadratic Functions in Modeling Contexts",
    "在建模情境中解释二次函数图象",
    ["maximizing-profit-and-break-even-points"],
    (rng, hard) => {
      const h = rng.int(2, 6);
      const a = rng.int(1, 5);
      const k = h * h * a;
      const fig = curveFigure(
        (x) => -a * (x - h) * (x - h) + k,
        { x: [0, 2 * h + 1], y: [0, k + a * h], dx: 1, dy: a * h },
        t("A parabola on a coordinate grid.", "坐标网格上的一条抛物线。"),
      );
      if (!hard)
        return mc(
          rng,
          t(
            `The graph shows the height, in feet, of a ball $x$ seconds after it is hit from the ground. What is the greatest height of the ball, in feet?`,
            `图中是一个球从地面被击出 $x$ 秒后的高度（英尺）。球的最大高度是多少英尺？`,
          ),
          k,
          [h, 2 * h, k + h],
          t(
            `The peak of the graph is at $(${h}, ${k})$, so the greatest height is $${k}$ feet.`,
            `图象的最高点在 $(${h}, ${k})$，所以最大高度是 $${k}$ 英尺。`,
          ),
          fig,
        );
      return spr(
        t(
          `The graph shows the height, in feet, of a ball $x$ seconds after it is hit from the ground. How many seconds after being hit does the ball land?`,
          `图中是一个球从地面被击出 $x$ 秒后的高度（英尺）。球被击出后多少秒落地？`,
        ),
        2 * h,
        [h, k, h + 1],
        t(`The ball lands where the height returns to zero, at $x = ${2 * h}$.`, `球在高度回到零时落地，即 $x = ${2 * h}$。`),
        fig,
      );
    },
  ),
  modelTips("Modeling Planar Motion Using Quadratic Functions", "用二次函数为平面运动建模", ["vertical-motion"], (rng, hard) => {
    const v = rng.pick([16, 32, 48, 64, 80, 96, 112]);
    const s = rng.pick([0, 16, 32, 48]);
    const h = `-16t^2 + ${v}t${s ? ` + ${s}` : ""}`;
    const top = v / 32;
    if (!hard)
      return spr(
        t(
          `A ball's height, in feet, $t$ seconds after it is thrown is $h(t) = ${h}$. How many seconds after it is thrown does it reach its greatest height?`,
          `一个球被抛出 $t$ 秒后的高度（英尺）为 $h(t) = ${h}$。抛出后多少秒达到最大高度？`,
        ),
        Q.of(v, 32),
        [Q.of(v, 16), v, 16],
        t(
          `The vertex is at $t = -\\frac{b}{2a} = \\frac{${v}}{32} = ${Q.of(v, 32).toLatex()}$.`,
          `顶点在 $t = -\\frac{b}{2a} = \\frac{${v}}{32} = ${Q.of(v, 32).toLatex()}$。`,
        ),
      );
    const peak = -16 * top * top + v * top + s;
    return spr(
      t(
        `A ball's height, in feet, $t$ seconds after it is thrown is $h(t) = ${h}$. What is the ball's greatest height, in feet?`,
        `一个球被抛出 $t$ 秒后的高度（英尺）为 $h(t) = ${h}$。球的最大高度是多少英尺？`,
      ),
      Q.of(Math.round(peak * 4), 4),
      [s, v, Q.of(v * v, 32)],
      t(
        `The vertex is at $t = ${Q.of(v, 32).toLatex()}$. Substituting gives $h = ${Q.of(Math.round(peak * 4), 4).toLatex()}$.`,
        `顶点在 $t = ${Q.of(v, 32).toLatex()}$。代入得 $h = ${Q.of(Math.round(peak * 4), 4).toLatex()}$。`,
      ),
    );
  }),
  polyTips("Elementary Cubic Functions", "基本三次函数", ["graphing-elementary-cubic-functions"], (rng, hard) => {
    const [a, k, c] = [rng.int(2, 12), rng.int(2, 4), rng.nonZero(-9, 9)];
    if (!hard)
      return mc(
        rng,
        t(`If $f(x) = ${a}x^3 ${sg(c)}$, what is the value of $f(${-k})$?`, `若 $f(x) = ${a}x^3 ${sg(c)}$，则 $f(${-k})$ 的值是多少？`),
        -a * k ** 3 + c,
        [a * k ** 3 + c, -3 * a * k + c, -a * k ** 3 - c],
        t(
          `A negative number cubed is negative: $${a}(${-(k ** 3)}) ${sg(c)} = ${-a * k ** 3 + c}$.`,
          `负数的立方为负：$${a}(${-(k ** 3)}) ${sg(c)} = ${-a * k ** 3 + c}$。`,
        ),
      );
    return spr(
      t(`If $${a}x^3 = ${a * k ** 3}$, what is the value of $x$?`, `若 $${a}x^3 = ${a * k ** 3}$，则 $x$ 的值是多少？`),
      k,
      [k ** 3, a * k, 3 * k],
      t(`Dividing by $${a}$ gives $x^3 = ${k ** 3}$, so $x = ${k}$.`, `除以 $${a}$ 得 $x^3 = ${k ** 3}$，所以 $x = ${k}$。`),
    );
  }),
  polyTips("Higher-Degree Polynomials", "高次多项式", ["end-behavior"], (rng, hard) => {
    const [r, s] = [rng.int(1, 5), rng.int(1, 6)];
    if (!hard)
      return mc(
        rng,
        t(
          `How many distinct real zeros does $f(x) = x(x - ${r})(x + ${s})^2$ have?`,
          `$f(x) = x(x - ${r})(x + ${s})^2$ 有多少个不同的实数零点？`,
        ),
        3,
        [2, 4, 1],
        t(
          `The zeros are $0$, $${r}$ and $${-s}$. The squared factor counts only once.`,
          `零点是 $0$、$${r}$ 和 $${-s}$。平方因式只算一个零点。`,
        ),
      );
    return spr(
      t(
        `What is the sum of the distinct zeros of $f(x) = (x - ${r})^2(x + ${s})(x - ${r + s})$?`,
        `$f(x) = (x - ${r})^2(x + ${s})(x - ${r + s})$ 的不同零点之和是多少？`,
      ),
      2 * r,
      [3 * r, r + s, 2 * r + s],
      t(
        `The distinct zeros are $${r}$, $${-s}$ and $${r + s}$, whose sum is $${2 * r}$.`,
        `不同的零点是 $${r}$、$${-s}$ 和 $${r + s}$，和为 $${2 * r}$。`,
      ),
    );
  }),
  polyTips("Graphs of Higher-Degree Polynomials", "高次多项式的图象", ["graphing-general-polynomials"], (rng, hard) => {
    const r = rng.int(1, 3);
    const s = rng.int(1, 3);
    const scale = rng.pick([0.25, 0.5, 0.75]);
    const f = (x: number) => scale * (x + r) * x * (x - s);
    const fig = curveFigure(f, { x: [-4, 4], y: [-8, 8], dx: 1, dy: 2 }, t("A curve on a coordinate grid.", "坐标网格上的一条曲线。"));
    if (!hard)
      return mc(
        rng,
        t(
          `The graph of a polynomial function $f$ is shown. Which expression is a factor of $f(x)$?`,
          `图中是多项式函数 $f$ 的图象。哪个式子是 $f(x)$ 的因式？`,
        ),
        `x - ${s}`,
        [`x + ${s + 4}`, `x - ${r + 4}`, `x - ${s + 5}`, `x + ${r + 5}`],
        t(`The graph crosses the $x$-axis at $${s}$, so $x - ${s}$ is a factor.`, `图象在 $${s}$ 处穿过 $x$ 轴，所以 $x - ${s}$ 是因式。`),
        fig,
      );
    return spr(
      t(
        `The graph of the polynomial function $f$ is shown. What is the sum of its zeros?`,
        `图中是多项式函数 $f$ 的图象。它的零点之和是多少？`,
      ),
      s - r,
      [s + r, r - s, 0 === s - r ? 1 : 0],
      t(`The zeros are $${-r}$, $0$ and $${s}$, whose sum is $${s - r}$.`, `零点是 $${-r}$、$0$ 和 $${s}$，和为 $${s - r}$。`),
      fig,
    );
  }),
  polyTips("Polynomial Transformations", "多项式变换", ["horizontal-translations-of-functions"], (rng, hard) => {
    const [h, k] = [rng.int(1, 7), rng.int(1, 9)];
    if (!hard)
      return mc(
        rng,
        t(
          `The graph of $y = x^3$ is shifted right $${h}$ units and up $${k}$ units. Which equation represents the new graph?`,
          `把 $y = x^3$ 的图象向右平移 $${h}$ 个单位，向上平移 $${k}$ 个单位。哪个方程表示新图象？`,
        ),
        `y = (x - ${h})^3 + ${k}`,
        [`y = (x + ${h})^3 + ${k}`, `y = (x - ${h})^3 - ${k}`, `y = (x + ${k})^3 - ${h}`, `y = x^3 - ${h} + ${k}`],
        t(`A shift right replaces $x$ with $x - ${h}$, and a shift up adds $${k}$.`, `右移把 $x$ 换成 $x - ${h}$，上移加上 $${k}$。`),
      );
    return spr(
      t(
        `The function $f$ has $f(${h}) = ${k}$, and $g(x) = f(x - ${k}) + ${h}$. What is the value of $g(${h + k})$?`,
        `函数 $f$ 满足 $f(${h}) = ${k}$，且 $g(x) = f(x - ${k}) + ${h}$。$g(${h + k})$ 的值是多少？`,
      ),
      h + k,
      [k, h, 2 * k],
      t(
        `The input is $${h + k} - ${k} = ${h}$, so $g = f(${h}) + ${h} = ${h + k}$.`,
        `输入为 $${h + k} - ${k} = ${h}$，所以 $g = f(${h}) + ${h} = ${h + k}$。`,
      ),
    );
  }),
  polyTips("Further Polynomial Transformations", "进一步的多项式变换", ["horizontal-translations-of-functions"], (rng, hard) => {
    const [a, r, s] = [rng.int(2, 6), rng.int(1, 6), rng.int(1, 7)];
    if (!hard)
      return mc(
        rng,
        t(
          `The function $f$ has a zero at $x = ${r}$. At which $x$ does $g(x) = ${a}f(x - ${s})$ have a zero?`,
          `函数 $f$ 在 $x = ${r}$ 处有零点。$g(x) = ${a}f(x - ${s})$ 在哪个 $x$ 处有零点？`,
        ),
        r + s,
        [r - s, a * r, a * r + s],
        t(
          `We need $x - ${s} = ${r}$, so $x = ${r + s}$. The outside factor $${a}$ does not move zeros.`,
          `需要 $x - ${s} = ${r}$，所以 $x = ${r + s}$。外面的因数 $${a}$ 不改变零点。`,
        ),
      );
    return spr(
      t(
        `The function $f$ has a maximum value of $${r + 4}$. What is the maximum value of $g(x) = ${a}f(x + ${s}) - ${r}$?`,
        `函数 $f$ 的最大值为 $${r + 4}$。$g(x) = ${a}f(x + ${s}) - ${r}$ 的最大值是多少？`,
      ),
      a * (r + 4) - r,
      [a * (r + 4), r + 4 - r, a * (r + 4) + s],
      t(
        `The horizontal shift leaves outputs alone. The maximum becomes $${a}(${r + 4}) - ${r} = ${a * (r + 4) - r}$.`,
        `水平平移不改变输出。最大值变为 $${a}(${r + 4}) - ${r} = ${a * (r + 4) - r}$。`,
      ),
    );
  }),
  polyTips(
    "Using the Factor Theorem to Reason About Polynomials",
    "用因式定理分析多项式",
    ["reasoning-about-coefficients-in-quadratic-equations-using-the-factor-theorem"],
    (rng, hard) => {
      const [r, b, c] = [rng.int(1, 5), rng.int(1, 6), rng.int(1, 9)];
      const z = rng.int(1, 15);
      const zero = rng.pick([z, -z]);
      if (!hard)
        return mc(
          rng,
          t(
            `For a polynomial $p$, $p(${zero}) = 0$. Which must be a factor of $p(x)$?`,
            `多项式 $p$ 满足 $p(${zero}) = 0$。哪个一定是 $p(x)$ 的因式？`,
          ),
          `x ${sg(-zero)}`,
          [`x ${sg(zero)}`, `${z}x`, `x ${sg(-zero - 1)}`, `x ${sg(zero + 1)}`],
          t(
            `By the factor theorem, a zero at $${zero}$ means $x ${sg(-zero)}$ is a factor.`,
            `由因式定理，$${zero}$ 是零点意味着 $x ${sg(-zero)}$ 是因式。`,
          ),
        );
      const k = -(r ** 3 + b * r * r + c * r);
      return spr(
        t(
          `If $x - ${r}$ is a factor of $x^3 + ${b}x^2 + ${c}x + k$, where $k$ is a constant, what is the value of $k$?`,
          `若 $x - ${r}$ 是 $x^3 + ${b}x^2 + ${c}x + k$ 的因式，其中 $k$ 是常数，则 $k$ 的值是多少？`,
        ),
        k,
        [-k, -(r ** 3), -(b * r * r + c * r)],
        t(
          `Substitute $x = ${r}$ and set the result to zero: $${-k} + k = 0$, so $k = ${k}$.`,
          `代入 $x = ${r}$ 并令结果为零：$${-k} + k = 0$，所以 $k = ${k}$。`,
        ),
      );
    },
  ),
];
