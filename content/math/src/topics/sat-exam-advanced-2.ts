import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { curveFigure, cx, mc, par, sg, spec, spr, step, table, tx, words, worked } from "../exam.ts";

// SAT Math Prep, Advanced Math: quadratic functions, quadratic models and polynomials.

const parabolaFig = (a: number, h: number, k: number) =>
  curveFigure(
    (x) => a * (x - h) * (x - h) + k,
    { x: [h - 5, h + 5], y: [Math.min(k, k + a * 9) - 2, Math.max(k, k + a * 9) + 2], dx: 1, dy: Math.ceil(Math.abs(a * 9) / 6) || 1 },
    t("A parabola on a coordinate grid.", "坐标网格上的一条抛物线。"),
  );

/** joined writes the terms of a sum that are not empty, one space apart. */
const joined = (...parts: string[]): string => parts.filter(Boolean).join(" ");

/** times writes a coefficient times a quantity, leaving out a coefficient of one. */
const times = (a: number, q: string): string => (a === 1 ? q : `${a} \\times ${q}`);

/** satExamAdvanced2 are the exam-style questions on quadratic functions, quadratic models and polynomials. */
export const satExamAdvanced2: ExamSpec[] = [
  spec("Quadratic Functions", "二次函数", ["graphs-of-general-quadratic-functions"], (rng, hard) => {
    const [a, b, c, k] = [rng.int(2, 5), rng.nonZero(-6, 6), rng.nonZero(-9, 9), rng.int(1, 5)];
    const f = `${a}x^2 ${tx(b)} ${sg(c)}`;
    if (!hard) {
      const v = a * k * k + b * k + c;
      return mc(
        rng,
        t(
          `The function $f$ is defined by $f(x) = ${f}$. What is the value of $f(${k})$?`,
          `函数 $f$ 定义为 $f(x) = ${f}$。$f(${k})$ 的值是多少？`,
        ),
        v,
        [a * k + b * k + c, a * k * k + b * k, (a * k) ** 2 + b * k + c],
        worked(
          [
            step("Square the input", "先算平方", `$${k}^2 = ${k * k}$.`, `$${k}^2 = ${k * k}$。`),
            step(
              "Substitute",
              "代入",
              `$f(${k}) = ${a} \\times ${k * k} ${sg(b)} \\times ${k} ${sg(c)} = ${joined(`${a * k * k}`, sg(b * k), sg(c))} = ${v}$.`,
              `$f(${k}) = ${a} \\times ${k * k} ${sg(b)} \\times ${k} ${sg(c)} = ${joined(`${a * k * k}`, sg(b * k), sg(c))} = ${v}$。`,
            ),
          ],
          t(
            `Written as $f(x) = x(${a}x ${sg(b)}) ${sg(c)}$, the value is $${k} \\times ${par(a * k + b)} ${sg(c)} = ${v}$ as well.`,
            `写成 $f(x) = x(${a}x ${sg(b)}) ${sg(c)}$，值为 $${k} \\times ${par(a * k + b)} ${sg(c)} = ${v}$，结果相同。`,
          ),
          [
            t(`This multiplies $${a}$ by $${k}$ instead of by $${k}^2$.`, `这是用 $${a}$ 乘 $${k}$，而不是乘 $${k}^2$。`),
            t(`This leaves out the constant term $${c}$.`, `这是漏掉了常数项 $${c}$。`),
            t(
              `This squares $${a} \\times ${k}$, but only the input is squared: the first term is $${a} \\times ${k * k}$.`,
              `这是把 $${a} \\times ${k}$ 整个平方了，但只有输入要平方：第一项是 $${a} \\times ${k * k}$。`,
            ),
          ],
        ),
      );
    }
    const v = a * k * k - b * k + c;
    return spr(
      t(`For the function $f(x) = ${f}$, what is the value of $f(${-k})$?`, `对函数 $f(x) = ${f}$，$f(${-k})$ 的值是多少？`),
      v,
      [-a * k * k - b * k + c, a * k * k + b * k + c, a * k - b * k + c],
      worked(
        [
          step("Square the negative input", "负数平方", `$(-${k})^2 = ${k * k}$, which is positive.`, `$(-${k})^2 = ${k * k}$，是正数。`),
          step(
            "Substitute",
            "代入",
            `$f(-${k}) = ${a} \\times ${k * k} ${sg(b)} \\times (-${k}) ${sg(c)} = ${joined(`${a * k * k}`, sg(-b * k), sg(c))} = ${v}$.`,
            `$f(-${k}) = ${a} \\times ${k * k} ${sg(b)} \\times (-${k}) ${sg(c)} = ${joined(`${a * k * k}`, sg(-b * k), sg(c))} = ${v}$。`,
          ),
        ],
        t(
          `Written as $f(x) = x(${a}x ${sg(b)}) ${sg(c)}$, the value is $(-${k}) \\times ${par(b - a * k)} ${sg(c)} = ${v}$ as well.`,
          `写成 $f(x) = x(${a}x ${sg(b)}) ${sg(c)}$，值为 $(-${k}) \\times ${par(b - a * k)} ${sg(c)} = ${v}$，结果相同。`,
        ),
        [
          t(
            `This takes $(-${k})^2$ as $-${k * k}$, but the square of a negative number is positive.`,
            `这是把 $(-${k})^2$ 算成了 $-${k * k}$，但负数的平方是正数。`,
          ),
          t(`This is $f(${k})$; the negative input changes the sign of the $x$ term.`, `这是 $f(${k})$；输入为负会改变一次项的符号。`),
          t(`This multiplies $${a}$ by $${k}$ instead of by $${k}^2$.`, `这是用 $${a}$ 乘 $${k}$，而不是乘 $${k}^2$。`),
        ],
      ),
    );
  }),
  spec("Graphs of Quadratic Functions", "二次函数的图象", ["graphs-of-general-quadratic-functions"], (rng, hard) => {
    const a = rng.pick([1, -1]);
    const [h, k] = [rng.nonZero(-4, 4), rng.nonZero(-6, 6)];
    const fig = parabolaFig(a, h, k);
    const up = a > 0;
    const read = step(
      "Read the vertex",
      "读出顶点",
      `The graph opens ${up ? "up" : "down"}, so the vertex is its ${up ? "lowest" : "highest"} point: $${Math.abs(h)}$ units ${h > 0 ? "right" : "left"} of the $y$-axis and $${Math.abs(k)}$ units ${k > 0 ? "above" : "below"} the $x$-axis, at $(${h}, ${k})$.`,
      `图象开口向${up ? "上" : "下"}，顶点是它的最${up ? "低" : "高"}点：在 $y$ 轴${h > 0 ? "右" : "左"}侧 $${Math.abs(h)}$ 个单位、$x$ 轴${k > 0 ? "上" : "下"}方 $${Math.abs(k)}$ 个单位，即 $(${h}, ${k})$。`,
    );
    if (!hard)
      return mc(
        rng,
        t(
          `The graph of $y = f(x)$ is shown, where $f$ is a quadratic function. What are the coordinates of its vertex?`,
          `图中是二次函数 $y = f(x)$ 的图象。它的顶点坐标是什么？`,
        ),
        `(${h}, ${k})`,
        [`(${k}, ${h})`, `(${-h}, ${k})`, `(${h}, ${-k})`, `(${-h}, ${-k})`],
        worked(
          [read],
          t(
            `The points $(${h - 1}, ${k + a})$ and $(${h + 1}, ${k + a})$ on the graph are at the same height, so the graph is symmetric about $x = ${h}$.`,
            `图象上的点 $(${h - 1}, ${k + a})$ 和 $(${h + 1}, ${k + a})$ 高度相同，所以图象关于 $x = ${h}$ 对称。`,
          ),
          [
            t(`This swaps the coordinates; the $x$-coordinate comes first.`, `这是把坐标顺序弄反了；横坐标在前。`),
            t(
              `The vertex is ${h > 0 ? "right" : "left"} of the $y$-axis, at $x = ${h}$, not $${-h}$.`,
              `顶点在 $y$ 轴${h > 0 ? "右" : "左"}侧，$x = ${h}$，不是 $${-h}$。`,
            ),
            t(
              `The vertex is ${k > 0 ? "above" : "below"} the $x$-axis, at height $${k}$, not $${-k}$.`,
              `顶点在 $x$ 轴${k > 0 ? "上" : "下"}方，高度为 $${k}$，不是 $${-k}$。`,
            ),
            t(`Both signs are flipped; the vertex is at $(${h}, ${k})$.`, `两个符号都弄反了；顶点在 $(${h}, ${k})$。`),
          ],
        ),
        fig,
      );
    const lead = a < 0 ? "-" : "";
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
      worked(
        [
          read,
          step(
            "Write vertex form",
            "写出顶点式",
            `A vertex $(${h}, ${k})$ gives $(x ${sg(-h)})^2 ${sg(k)}$, and opening ${up ? "up" : "down"} makes the leading sign ${up ? "positive" : "negative"}: $f(x) = ${lead}(x ${sg(-h)})^2 ${sg(k)}$.`,
            `顶点 $(${h}, ${k})$ 给出 $(x ${sg(-h)})^2 ${sg(k)}$，开口向${up ? "上" : "下"}说明首项为${up ? "正" : "负"}：$f(x) = ${lead}(x ${sg(-h)})^2 ${sg(k)}$。`,
          ),
        ],
        t(
          `At $x = ${h}$ the square is $0$ and $f(${h}) = ${k}$; at $x = ${h + 1}$, $f = ${k + a}$, one unit ${up ? "above" : "below"} the vertex, as on the graph.`,
          `$x = ${h}$ 时平方为 $0$，$f(${h}) = ${k}$；$x = ${h + 1}$ 时 $f = ${k + a}$，比顶点${up ? "高" : "低"}一个单位，与图象一致。`,
        ),
        [
          t(
            `This has its vertex at $x = ${-h}$: $(x - p)^2$ puts the vertex at $x = p$, so $x = ${h}$ needs $(x ${sg(-h)})^2$.`,
            `它的顶点在 $x = ${-h}$：$(x - p)^2$ 的顶点在 $x = p$，所以 $x = ${h}$ 需要 $(x ${sg(-h)})^2$。`,
          ),
          t(
            `This parabola opens ${up ? "down" : "up"}, but the graph opens ${up ? "up" : "down"}.`,
            `这条抛物线开口向${up ? "下" : "上"}，但图象开口向${up ? "上" : "下"}。`,
          ),
          t(
            `This has its vertex at height $${-k}$, but the graph's vertex is at height $${k}$.`,
            `它的顶点高度为 $${-k}$，但图象的顶点高度是 $${k}$。`,
          ),
          t(`This opens the wrong way and has its vertex at $x = ${-h}$.`, `它开口方向错了，顶点也在 $x = ${-h}$。`),
        ],
      ),
      fig,
    );
  }),
  spec(
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
          worked(
            [
              step(
                "Look at the square",
                "看平方项",
                `$(x ${sg(-h)})^2 \\geq 0$ and $${a} > 0$, so $${a}(x ${sg(-h)})^2 \\geq 0$ and $f(x) \\geq ${k}$.`,
                `$(x ${sg(-h)})^2 \\geq 0$ 且 $${a} > 0$，所以 $${a}(x ${sg(-h)})^2 \\geq 0$，$f(x) \\geq ${k}$。`,
              ),
              step(
                "Reach the bound",
                "取到下界",
                `The square is $0$ at $x = ${h}$, so the minimum value is $${k}$.`,
                `$x = ${h}$ 时平方为 $0$，所以最小值是 $${k}$。`,
              ),
            ],
            t(
              `$f(${h}) = ${k}$, while $f(${h + 1}) = f(${h - 1}) = ${a + k}$ is greater.`,
              `$f(${h}) = ${k}$，而 $f(${h + 1}) = f(${h - 1}) = ${a + k}$ 更大。`,
            ),
            [
              t(
                `This is the input $x = ${h}$ where the minimum occurs, not the minimum value.`,
                `这是取得最小值的输入 $x = ${h}$，不是最小值。`,
              ),
              t(
                `The constant of the vertex form is the minimum itself, sign included: $${k}$, not $${-k}$.`,
                `顶点式中的常数就是最小值，符号也一样：是 $${k}$，不是 $${-k}$。`,
              ),
              t(`$${a}$ only stretches the graph; it is not an output of $f$.`, `$${a}$ 只是让图象伸缩，不是 $f$ 的输出。`),
              t(`This is $f(${h + 1})$, the value one unit from the vertex.`, `这是 $f(${h + 1})$，即离顶点一个单位处的值。`),
            ],
          ),
        );
      return spr(
        t(
          `The function $g(x) = -${a}(x ${sg(-h)})^2 ${sg(k)}$ reaches its maximum at $x = m$. What is the value of $m$?`,
          `函数 $g(x) = -${a}(x ${sg(-h)})^2 ${sg(k)}$ 在 $x = m$ 处取得最大值。$m$ 的值是多少？`,
        ),
        h,
        [-h, k, -a],
        worked(
          [
            step(
              "Look at the square",
              "看平方项",
              `$-${a}(x ${sg(-h)})^2 \\leq 0$, so $g(x) \\leq ${k}$.`,
              `$-${a}(x ${sg(-h)})^2 \\leq 0$，所以 $g(x) \\leq ${k}$。`,
            ),
            step(
              "Find where it is zero",
              "找出平方为零处",
              `The square is $0$ when $x ${sg(-h)} = 0$, that is, at $x = ${h}$, so $m = ${h}$.`,
              `当 $x ${sg(-h)} = 0$，即 $x = ${h}$ 时平方为 $0$，所以 $m = ${h}$。`,
            ),
          ],
          t(
            `$g(${h}) = ${k}$, while $g(${h + 1}) = g(${h - 1}) = ${k - a}$ is less.`,
            `$g(${h}) = ${k}$，而 $g(${h + 1}) = g(${h - 1}) = ${k - a}$ 更小。`,
          ),
          [
            t(
              `Solving $x ${sg(-h)} = 0$ gives $x = ${h}$; the number in the parentheses has the opposite sign.`,
              `解 $x ${sg(-h)} = 0$ 得 $x = ${h}$；括号里的数与它符号相反。`,
            ),
            t(`This is the maximum value $${k}$, not the input where it occurs.`, `这是最大值 $${k}$，不是取得最大值的输入。`),
            t(
              `The leading coefficient $-${a}$ makes the graph open down; it does not locate the vertex.`,
              `首项系数 $-${a}$ 使图象开口向下，它不决定顶点的位置。`,
            ),
          ],
        ),
      );
    },
  ),
  spec(
    "Using Standard and Factored Forms to Reason About Quadratic Functions",
    "用一般式和因式式分析二次函数",
    ["reasoning-about-coefficients-of-quadratics-using-standard-and-factored-forms"],
    (rng, hard) => {
      const [a, r] = [rng.int(2, 5), rng.nonZero(-7, 7)];
      let s = rng.nonZero(-7, 7);
      if (s === r) s = r + 1 === 0 ? r + 2 : r + 1;
      const f = `${a}(x ${sg(-r)})(x ${sg(-s)})`;
      const B = -a * (r + s);
      const standard = joined(`${a}x^2`, tx(B), sg(a * r * s));
      if (!hard)
        return mc(
          rng,
          t(`The function $f(x) = ${f}$ has what $y$-intercept?`, `函数 $f(x) = ${f}$ 的 $y$ 轴截距是什么？`),
          `(0, ${a * r * s})`,
          [`(0, ${r * s})`, `(0, ${-a * r * s})`, `(${r}, 0)`, `(0, ${a})`],
          worked(
            [
              step(
                "Set x to zero",
                "令自变量为零",
                `$f(0) = ${a}(0 ${sg(-r)})(0 ${sg(-s)}) = ${a} \\times ${par(-r)} \\times ${par(-s)} = ${a * r * s}$.`,
                `$f(0) = ${a}(0 ${sg(-r)})(0 ${sg(-s)}) = ${a} \\times ${par(-r)} \\times ${par(-s)} = ${a * r * s}$。`,
              ),
              step(
                "Write the point",
                "写出点",
                `The graph meets the $y$-axis at $(0, ${a * r * s})$.`,
                `图象与 $y$ 轴交于 $(0, ${a * r * s})$。`,
              ),
            ],
            t(
              `Expanded, $f(x) = ${standard}$, whose constant term is $${a * r * s}$.`,
              `展开得 $f(x) = ${standard}$，常数项是 $${a * r * s}$。`,
            ),
            [
              t(`This forgets the factor $${a}$.`, `这是忘了因数 $${a}$。`),
              t(
                `The sign is wrong: $${a} \\times ${par(-r)} \\times ${par(-s)} = ${a * r * s}$.`,
                `符号错了：$${a} \\times ${par(-r)} \\times ${par(-s)} = ${a * r * s}$。`,
              ),
              t(
                `$(${r}, 0)$ is an $x$-intercept, where the graph meets the $x$-axis.`,
                `$(${r}, 0)$ 是 $x$ 轴截距，是图象与 $x$ 轴的交点。`,
              ),
              t(`$${a}$ is the leading coefficient, not $f(0)$.`, `$${a}$ 是首项系数，不是 $f(0)$。`),
            ],
          ),
        );
      return spr(
        t(
          `When $f(x) = ${f}$ is written as $ax^2 + bx + c$, what is the value of $b$?`,
          `把 $f(x) = ${f}$ 写成 $ax^2 + bx + c$ 时，$b$ 的值是多少？`,
        ),
        B,
        [a * (r + s), -(r + s), a * r * s],
        worked(
          [
            step(
              "Multiply the factors",
              "两个因式相乘",
              `$(x ${sg(-r)})(x ${sg(-s)}) = ${joined("x^2", tx(-(r + s)), sg(r * s))}$.`,
              `$(x ${sg(-r)})(x ${sg(-s)}) = ${joined("x^2", tx(-(r + s)), sg(r * s))}$。`,
            ),
            step(
              "Multiply by the leading coefficient",
              "乘以首项系数",
              `$${a}(${joined("x^2", tx(-(r + s)), sg(r * s))}) = ${standard}$, so $b = ${B}$.`,
              `$${a}(${joined("x^2", tx(-(r + s)), sg(r * s))}) = ${standard}$，所以 $b = ${B}$。`,
            ),
          ],
          t(
            `At $x = 1$: $f(1) = ${a} \\times ${par(1 - r)} \\times ${par(1 - s)} = ${a * (1 - r) * (1 - s)}$, and $a + b + c = ${joined(`${a}`, sg(B), sg(a * r * s))} = ${a + B + a * r * s}$.`,
            `$x = 1$ 时：$f(1) = ${a} \\times ${par(1 - r)} \\times ${par(1 - s)} = ${a * (1 - r) * (1 - s)}$，而 $a + b + c = ${joined(`${a}`, sg(B), sg(a * r * s))} = ${a + B + a * r * s}$。`,
          ),
          [
            t(
              `The $x$ coefficient of the product of the factors is $-(${r} ${sg(s)})$; this drops the minus sign.`,
              `两个因式之积的一次项系数是 $-(${r} ${sg(s)})$；这是丢了负号。`,
            ),
            t(`This forgets to multiply by $${a}$.`, `这是忘了乘以 $${a}$。`),
            t(`This is the constant term $c$, not $b$.`, `这是常数项 $c$，不是 $b$。`),
          ],
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step(
                "Pair the points",
                "配对两点",
                `Equal outputs lie symmetrically about the axis, so the axis is halfway between $${h - d}$ and $${h + d}$.`,
                `输出相等的两点关于对称轴对称，所以对称轴在 $${h - d}$ 与 $${h + d}$ 的正中间。`,
              ),
              step(
                "Average",
                "求平均",
                `$\\frac{${h - d} + ${par(h + d)}}{2} = \\frac{${2 * h}}{2} = ${h}$, and the vertex lies on the axis.`,
                `$\\frac{${h - d} + ${par(h + d)}}{2} = \\frac{${2 * h}}{2} = ${h}$，顶点在对称轴上。`,
              ),
            ],
            t(
              `$${h} - ${par(h - d)} = ${d}$ and $${h + d} - ${par(h)} = ${d}$: both inputs are $${d}$ from $x = ${h}$.`,
              `$${h} - ${par(h - d)} = ${d}$，$${h + d} - ${par(h)} = ${d}$：两个输入到 $x = ${h}$ 的距离都是 $${d}$。`,
            ),
            [
              t(`This is the shared output $${y}$, not an $x$-coordinate.`, `这是共同的输出 $${y}$，不是横坐标。`),
              t(`This is the distance from each input to the axis, not the axis itself.`, `这是每个输入到对称轴的距离，不是对称轴本身。`),
              t(`This adds the two inputs but does not divide by $2$.`, `这是把两个输入相加，却没有除以 $2$。`),
            ],
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
        worked(
          [
            step(
              "Measure the distance",
              "量距离",
              `$${h} - ${par(h - e)} = ${e}$, so the point is $${e}$ units left of the axis.`,
              `$${h} - ${par(h - e)} = ${e}$，所以该点在对称轴左侧 $${e}$ 个单位。`,
            ),
            step(
              "Reflect",
              "作对称",
              `Its mirror image is $${e}$ units right of the axis: $${h} + ${e} = ${h + e}$.`,
              `它的对称点在对称轴右侧 $${e}$ 个单位：$${h} + ${e} = ${h + e}$。`,
            ),
          ],
          t(
            `$\\frac{${h - e} + ${par(h + e)}}{2} = ${h}$, so the two inputs are symmetric about the axis.`,
            `$\\frac{${h - e} + ${par(h + e)}}{2} = ${h}$，所以两个输入关于对称轴对称。`,
          ),
          [
            t(`This is the given input; the question asks for the other one.`, `这是已知的输入；题目问的是另一个。`),
            t(`This is the axis itself, where only the vertex lies.`, `这是对称轴本身，那里只有顶点。`),
            t(`This is the output, not an input.`, `这是输出，不是输入。`),
          ],
        ),
      );
    },
  ),
  spec(
    "Identifying Quadratic Functions From Tabular Data",
    "由表格识别二次函数",
    ["fitting-quadratic-functions-to-data-using-vertex-form"],
    (rng, hard) => {
      const [a, h, k] = [rng.int(1, 4), rng.nonZero(-3, 3), rng.nonZero(-5, 8)];
      const xs = [h - 2, h - 1, h, h + 1, h + 2];
      const ys = xs.map((x) => a * (x - h) ** 2 + k);
      const tb = table("x", "f(x)", xs, ys);
      const lead = a === 1 ? "" : `${a}`;
      const vertex = step(
        "Find the vertex",
        "找顶点",
        `The outputs are symmetric about $x = ${h}$, where the least output $${k}$ occurs, so the vertex is $(${h}, ${k})$.`,
        `输出关于 $x = ${h}$ 对称，最小输出 $${k}$ 出现在那里，所以顶点是 $(${h}, ${k})$。`,
      );
      const coefficient = step(
        "Find the leading coefficient",
        "求首项系数",
        `One step from the vertex the output is $${a + k}$, which is $${a}$ more than $${k}$, so the leading coefficient is $${a}$.`,
        `离顶点一步时输出为 $${a + k}$，比 $${k}$ 大 $${a}$，所以首项系数是 $${a}$。`,
      );
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
          worked(
            [vertex, coefficient],
            t(
              `Two steps away: $${times(a, "4")} ${sg(k)} = ${4 * a + k}$, matching $f(${h + 2})$ in the table.`,
              `离顶点两步：$${times(a, "4")} ${sg(k)} = ${4 * a + k}$，与表中的 $f(${h + 2})$ 一致。`,
            ),
            [
              t(
                `This puts the vertex at $x = ${-h}$, but the least output in the table is at $x = ${h}$.`,
                `它的顶点在 $x = ${-h}$，但表中最小输出在 $x = ${h}$。`,
              ),
              t(
                `This gives $f(${h + 1}) = ${a + 1 + k}$, but the table shows $${a + k}$.`,
                `它给出 $f(${h + 1}) = ${a + 1 + k}$，但表中是 $${a + k}$。`,
              ),
              t(
                `This gives $f(${h}) = ${Math.abs(k) + a + 9}$, but the table shows $${k}$.`,
                `它给出 $f(${h}) = ${Math.abs(k) + a + 9}$，但表中是 $${k}$。`,
              ),
              t(`This has the wrong vertex and the wrong leading coefficient.`, `它的顶点和首项系数都不对。`),
            ],
          ),
        );
      return spr(
        t(
          `The table shows values of a quadratic function $f$. What is the value of $f(${h + 3})$?\n\n${tb}`,
          `表格给出二次函数 $f$ 的一些值。$f(${h + 3})$ 的值是多少？\n\n${tb}`,
        ),
        9 * a + k,
        [3 * a + k, 6 * a + k, 5 * a + k],
        worked(
          [
            vertex,
            coefficient,
            step(
              "Go three steps",
              "走三步",
              `$f(${h + 3}) = ${times(a, "3^2")} ${sg(k)} = ${9 * a + k}$.`,
              `$f(${h + 3}) = ${times(a, "3^2")} ${sg(k)} = ${9 * a + k}$。`,
            ),
          ],
          t(
            `Going right from the vertex the outputs rise by $${a}$ and then $${3 * a}$, so the next rise is $${5 * a}$: $${4 * a + k} + ${5 * a} = ${9 * a + k}$.`,
            `从顶点向右，输出先增加 $${a}$，再增加 $${3 * a}$，所以下一次增加 $${5 * a}$：$${4 * a + k} + ${5 * a} = ${9 * a + k}$。`,
          ),
          [
            t(`This multiplies $${a}$ by $3$ instead of by $3^2$.`, `这是用 $${a}$ 乘 $3$，而不是乘 $3^2$。`),
            t(`This multiplies $${a}$ by $2 \\times 3$ instead of by $3^2$.`, `这是用 $${a}$ 乘 $2 \\times 3$，而不是乘 $3^2$。`),
            t(
              `This adds the third rise, $${5 * a}$, to $f(${h})$ instead of to $f(${h + 2})$.`,
              `这是把第三次的增加量 $${5 * a}$ 加到了 $f(${h})$ 上，而不是 $f(${h + 2})$ 上。`,
            ),
          ],
        ),
      );
    },
  ),
  spec("Modeling Number Problems With Quadratic Equations", "用二次方程解数字问题", ["modeling-with-quadratic-equations"], (rng, hard) => {
    const n = rng.int(3, 15);
    const d = rng.int(1, 6);
    const P = n * (n + d);
    if (!hard)
      return mc(
        rng,
        t(
          `The product of a positive number $x$ and a number $${d}$ greater than $x$ is $${n * (n + d)}$. Which equation represents this situation?`,
          `一个正数 $x$ 与比 $x$ 大 $${d}$ 的数之积为 $${n * (n + d)}$。哪个方程表示这个情形？`,
        ),
        `x(x + ${d}) = ${n * (n + d)}`,
        [`x + (x + ${d}) = ${n * (n + d)}`, `${d}x = ${n * (n + d)}`, `x^2 + ${d} = ${n * (n + d)}`, `x(x - ${d}) = ${n * (n + d)}`],
        worked(
          [
            step("Name the numbers", "表示两个数", `The numbers are $x$ and $x + ${d}$.`, `两个数是 $x$ 和 $x + ${d}$。`),
            step(
              "Write the product",
              "写出乘积",
              `"Product" means multiply: $x(x + ${d}) = ${P}$.`,
              `“积”表示相乘：$x(x + ${d}) = ${P}$。`,
            ),
          ],
          t(
            `The positive solution $x = ${n}$ fits: $${n} \\times ${n + d} = ${P}$.`,
            `正解 $x = ${n}$ 符合题意：$${n} \\times ${n + d} = ${P}$。`,
          ),
          [
            t(`This adds the two numbers; a product multiplies them.`, `这是把两个数相加；积要相乘。`),
            t(`This multiplies $x$ by the difference $${d}$, not by the second number.`, `这是用 $x$ 乘差 $${d}$，而不是乘第二个数。`),
            t(
              `This adds $${d}$ to $x^2$, but $x(x + ${d}) = x^2 + ${cx(d)}$.`,
              `这是给 $x^2$ 加上 $${d}$，但 $x(x + ${d}) = x^2 + ${cx(d)}$。`,
            ),
            t(
              `The second number is $${d}$ greater, so it is $x + ${d}$, not $x - ${d}$.`,
              `第二个数大 $${d}$，所以是 $x + ${d}$，不是 $x - ${d}$。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `Two positive integers differ by $${d}$ and have a product of $${n * (n + d)}$. What is the greater integer?`,
        `两个正整数相差 $${d}$，积为 $${n * (n + d)}$。较大的整数是多少？`,
      ),
      n + d,
      [n, 2 * n + d, n + 2 * d],
      worked(
        [
          step(
            "Write an equation",
            "列方程",
            `If the smaller integer is $x$, then $x(x + ${d}) = ${P}$, or $x^2 + ${cx(d)} - ${P} = 0$.`,
            `设较小的整数为 $x$，则 $x(x + ${d}) = ${P}$，即 $x^2 + ${cx(d)} - ${P} = 0$。`,
          ),
          step(
            "Factor",
            "分解",
            `$(x - ${n})(x + ${n + d}) = 0$, since $${n} \\times ${n + d} = ${P}$ and $${n + d} - ${n} = ${d}$.`,
            `$(x - ${n})(x + ${n + d}) = 0$，因为 $${n} \\times ${n + d} = ${P}$，$${n + d} - ${n} = ${d}$。`,
          ),
          step(
            "Answer",
            "作答",
            `The positive solution is $x = ${n}$, so the greater integer is $${n} + ${d} = ${n + d}$.`,
            `正解为 $x = ${n}$，所以较大的整数是 $${n} + ${d} = ${n + d}$。`,
          ),
        ],
        t(`$${n + d} - ${n} = ${d}$ and $${n + d} \\times ${n} = ${P}$.`, `$${n + d} - ${n} = ${d}$，$${n + d} \\times ${n} = ${P}$。`),
        [
          t(`This is the smaller integer.`, `这是较小的整数。`),
          t(`This is the sum of the two integers.`, `这是两个整数之和。`),
          t(`This adds the difference $${d}$ twice.`, `这是把差 $${d}$ 加了两次。`),
        ],
      ),
    );
  }),
  spec("Solving Border Problems With Quadratic Equations", "解边框问题", ["border-problems"], (rng, hard) => {
    const [w, l, b] = [rng.int(4, 12), rng.int(13, 22), rng.int(1, 4)];
    const area = (l + 2 * b) * (w + 2 * b);
    const outer = step(
      "Find the outer dimensions",
      "求外围尺寸",
      `The border adds $x$ on both sides, so the outer rectangle is $${l} + 2x$ by $${w} + 2x$.`,
      `边框在两侧各加 $x$，所以外围矩形是 $${l} + 2x$ 乘 $${w} + 2x$。`,
    );
    if (!hard)
      return mc(
        rng,
        t(
          `A rectangular photo $${l}$ inches by $${w}$ inches has a frame of uniform width $x$ inches around it. The total area of the photo and frame is $${area}$ square inches. Which equation can be used to find $x$?`,
          `一张长 $${l}$ 英寸、宽 $${w}$ 英寸的矩形照片四周有宽度均为 $x$ 英寸的边框。照片和边框的总面积为 $${area}$ 平方英寸。哪个方程可用于求 $x$？`,
        ),
        `(${l} + 2x)(${w} + 2x) = ${area}`,
        [`(${l} + x)(${w} + x) = ${area}`, `${l * w} + 2x = ${area}`, `(${l} - 2x)(${w} - 2x) = ${area}`, `2(${l} + ${w}) + 4x = ${area}`],
        worked(
          [
            outer,
            step(
              "Use the area",
              "用面积",
              `Length times width is the total area: $(${l} + 2x)(${w} + 2x) = ${area}$.`,
              `长乘宽就是总面积：$(${l} + 2x)(${w} + 2x) = ${area}$。`,
            ),
          ],
          t(
            `With $x = ${b}$ the outer rectangle is $${l + 2 * b}$ by $${w + 2 * b}$, and $${l + 2 * b} \\times ${w + 2 * b} = ${area}$, so the equation has a sensible solution.`,
            `取 $x = ${b}$，外围矩形是 $${l + 2 * b}$ 乘 $${w + 2 * b}$，而 $${l + 2 * b} \\times ${w + 2 * b} = ${area}$，方程有合理的解。`,
          ),
          [
            t(`This adds $x$ only once to each dimension, but the frame is on both sides.`, `这是每边只加了一个 $x$，但边框在两侧都有。`),
            t(`This adds a length to an area; the frame changes both dimensions.`, `这是把长度加到面积上；边框改变的是长和宽。`),
            t(`This shrinks the photo, but a frame around it makes each side longer.`, `这是把照片缩小了，但四周的边框会让每条边变长。`),
            t(`This is a perimeter, not an area.`, `这是周长，不是面积。`),
          ],
        ),
      );
    return spr(
      t(
        `A rectangular garden $${l}$ feet by $${w}$ feet is surrounded by a path of uniform width. The garden and path together cover $${area}$ square feet. What is the width of the path, in feet?`,
        `一块长 $${l}$ 英尺、宽 $${w}$ 英尺的矩形花园四周有一条宽度均匀的小路。花园和小路共占 $${area}$ 平方英尺。小路的宽度是多少英尺？`,
      ),
      b,
      [2 * b, b + 1, area - l * w],
      worked(
        [
          outer,
          step(
            "Expand",
            "展开",
            `$(${l} + 2x)(${w} + 2x) = ${area}$ gives $4x^2 + ${2 * (l + w)}x + ${l * w} = ${area}$, so $2x^2 + ${l + w}x - ${(area - l * w) / 2} = 0$.`,
            `由 $(${l} + 2x)(${w} + 2x) = ${area}$ 得 $4x^2 + ${2 * (l + w)}x + ${l * w} = ${area}$，即 $2x^2 + ${l + w}x - ${(area - l * w) / 2} = 0$。`,
          ),
          step(
            "Factor",
            "分解",
            `$(x - ${b})(2x + ${l + w + 2 * b}) = 0$. A width is positive, so $x = ${b}$.`,
            `$(x - ${b})(2x + ${l + w + 2 * b}) = 0$。宽度为正，所以 $x = ${b}$。`,
          ),
        ],
        t(`$${l + 2 * b} \\times ${w + 2 * b} = ${area}$.`, `$${l + 2 * b} \\times ${w + 2 * b} = ${area}$。`),
        [
          t(
            `This is $2x$, what the path adds to each dimension, not the width $x$.`,
            `这是 $2x$，即小路使长和宽各增加的量，不是宽度 $x$。`,
          ),
          t(
            `With a width of $${b + 1}$ the total area would be $${(l + 2 * b + 2) * (w + 2 * b + 2)}$, too large.`,
            `宽度为 $${b + 1}$ 时总面积为 $${(l + 2 * b + 2) * (w + 2 * b + 2)}$，太大了。`,
          ),
          t(`This is the area of the path, not its width.`, `这是小路的面积，不是宽度。`),
        ],
      ),
    );
  }),
  spec(
    "Interpreting Quadratic Functions in Modeling Contexts",
    "在建模情境中解释二次函数",
    ["revenue-cost-and-profit-functions"],
    (rng, hard) => {
      const [a, h, k] = [rng.pick([2, 4, 5]), rng.int(2, 8), rng.pick([100, 150, 180, 240])];
      const f = `-${a}(t - ${h})^2 + ${k}`;
      const square = step(
        "Look at the squared term",
        "看平方项",
        `$-${a}(t - ${h})^2$ is never positive, so $P(t) \\leq ${k}$, and it is $0$ only at $t = ${h}$.`,
        `$-${a}(t - ${h})^2$ 永远不为正，所以 $P(t) \\leq ${k}$，且只在 $t = ${h}$ 时为 $0$。`,
      );
      const near = t(
        `$P(${h}) = ${k}$, while $P(${h - 1}) = P(${h + 1}) = ${k - a}$ is less.`,
        `$P(${h}) = ${k}$，而 $P(${h - 1}) = P(${h + 1}) = ${k - a}$ 更小。`,
      );
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
          worked(
            [
              square,
              step(
                "Interpret",
                "解释",
                `At $t = ${h}$ the profit is $${k}$ dollars, and no price change gives more, so $${k}$ is the greatest possible daily profit.`,
                `$t = ${h}$ 时利润为 $${k}$ 美元，任何价格变动都不会更多，所以 $${k}$ 是可能的最大日利润。`,
              ),
            ],
            near,
            [
              t(`That price change is $${h}$, where the squared term is zero.`, `那个价格变动是 $${h}$，即平方项为零处。`),
              t(
                `With no price change, $P(0) = ${k} - ${a} \\times ${h * h} = ${k - a * h * h}$, not $${k}$.`,
                `价格不变时 $P(0) = ${k} - ${a} \\times ${h * h} = ${k - a * h * h}$，不是 $${k}$。`,
              ),
              t(
                `$${k}$ is an output of $P$, an amount of profit, not a rate of change.`,
                `$${k}$ 是 $P$ 的输出，是利润的数额，不是变化率。`,
              ),
            ],
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
        worked(
          [
            square,
            step(
              "Interpret",
              "解释",
              `The vertex is $(${h}, ${k})$: a price change of $${h}$ dollars gives the greatest profit.`,
              `顶点是 $(${h}, ${k})$：价格变动 $${h}$ 美元时利润最大。`,
            ),
          ],
          near,
          [
            t(`The greatest profit is the output $${k}$; $${h}$ is an input.`, `最大利润是输出 $${k}$；$${h}$ 是输入。`),
            t(`At $t = ${h}$ the profit is $${k}$, its greatest value, not zero.`, `$t = ${h}$ 时利润为 $${k}$，是最大值，不是零。`),
            t(
              `The profit does not change at a constant rate; $${h}$ is where its vertex is.`,
              `利润不是匀速变化的；$${h}$ 是顶点所在的位置。`,
            ),
          ],
        ),
      );
    },
  ),
  spec(
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
      const symmetric = t(
        `The graph is symmetric about $x = ${h}$: it meets the ground at $0$ and at $${2 * h}$, and the peak $(${h}, ${k})$ is halfway between.`,
        `图象关于 $x = ${h}$ 对称：它在 $0$ 和 $${2 * h}$ 处与地面相交，最高点 $(${h}, ${k})$ 正在两者中间。`,
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
          worked(
            [
              step("Find the peak", "找最高点", `The highest point of the graph is at $x = ${h}$.`, `图象的最高点在 $x = ${h}$ 处。`),
              step(
                "Read its height",
                "读高度",
                `Its height is $${k}$, so the greatest height is $${k}$ feet.`,
                `它的高度是 $${k}$，所以最大高度是 $${k}$ 英尺。`,
              ),
            ],
            symmetric,
            [
              t(`This is the time of the peak, $${h}$ seconds, not its height.`, `这是到达最高点的时间 $${h}$ 秒，不是高度。`),
              t(`This is the landing time, $${2 * h}$ seconds.`, `这是落地时间 $${2 * h}$ 秒。`),
              t(`This adds the time of the peak to its height.`, `这是把到达最高点的时间加到了高度上。`),
            ],
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
        worked(
          [
            step(
              "Find where the height is zero",
              "找高度为零处",
              `The ball starts at height $0$ at $x = 0$ and lands where the graph meets the $x$-axis again.`,
              `球在 $x = 0$ 时高度为 $0$，再次与 $x$ 轴相交时落地。`,
            ),
            step(
              "Read the time",
              "读时间",
              `That is at $x = ${2 * h}$, so the ball lands after $${2 * h}$ seconds.`,
              `那是 $x = ${2 * h}$，所以球在 $${2 * h}$ 秒后落地。`,
            ),
          ],
          symmetric,
          [
            t(`This is when the ball is highest, halfway through its flight.`, `这是球最高的时刻，在飞行过程的中间。`),
            t(`This is the greatest height, not a time.`, `这是最大高度，不是时间。`),
            t(`At $x = ${h + 1}$ the ball is still in the air, at height $${k - a}$.`, `$x = ${h + 1}$ 时球还在空中，高度为 $${k - a}$。`),
          ],
        ),
        fig,
      );
    },
  ),
  spec("Modeling Planar Motion Using Quadratic Functions", "用二次函数为平面运动建模", ["vertical-motion"], (rng, hard) => {
    const v = rng.pick([16, 32, 48, 64, 80, 96, 112]);
    const s = rng.pick([0, 16, 32, 48]);
    const h = `-16t^2 + ${v}t${s ? ` + ${s}` : ""}`;
    const top = v / 32;
    const tq = Q.of(v, 32).toLatex();
    const vertex = step(
      "Use the vertex formula",
      "用顶点公式",
      `With $a = -16$ and $b = ${v}$: $t = -\\frac{b}{2a} = -\\frac{${v}}{2 \\times (-16)} = \\frac{${v}}{32} = ${tq}$.`,
      `其中 $a = -16$，$b = ${v}$：$t = -\\frac{b}{2a} = -\\frac{${v}}{2 \\times (-16)} = \\frac{${v}}{32} = ${tq}$。`,
    );
    if (!hard)
      return spr(
        t(
          `A ball's height, in feet, $t$ seconds after it is thrown is $h(t) = ${h}$. How many seconds after it is thrown does it reach its greatest height?`,
          `一个球被抛出 $t$ 秒后的高度（英尺）为 $h(t) = ${h}$。抛出后多少秒达到最大高度？`,
        ),
        Q.of(v, 32),
        [Q.of(v, 16), v, 16],
        worked(
          [
            step(
              "Read the coefficients",
              "读系数",
              `The coefficient of $t^2$ is $-16$, so the graph opens down and its vertex is the highest point.`,
              `$t^2$ 的系数是 $-16$，图象开口向下，顶点就是最高点。`,
            ),
            vertex,
          ],
          t(
            `The ball is at height $${s}$ at $t = 0$ and again at $t = ${Q.of(v, 16).toLatex()}$, and the peak is halfway between, at $t = ${tq}$.`,
            `球在 $t = 0$ 和 $t = ${Q.of(v, 16).toLatex()}$ 时高度都是 $${s}$，最高点在两者正中间，即 $t = ${tq}$。`,
          ),
          [
            t(
              `This divides by $16$ instead of by $2 \\times 16 = 32$; it is when the ball is back at its starting height.`,
              `这是除以 $16$，而不是除以 $2 \\times 16 = 32$；那是球回到起始高度的时刻。`,
            ),
            t(`This is the coefficient $b$, the initial speed, not a time.`, `这是系数 $b$，即初速度，不是时间。`),
            t(`This is the size of the coefficient $-16$, not a time.`, `这是系数 $-16$ 的大小，不是时间。`),
          ],
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
      worked(
        [
          vertex,
          step(
            "Substitute",
            "代入",
            `$h(${tq}) = -16 \\times \\left(${tq}\\right)^2 + ${v} \\times ${tq}${s ? ` + ${s}` : ""} = -${(v * v) / 64} + ${(v * v) / 32}${s ? ` + ${s}` : ""} = ${(v * v) / 64 + s}$.`,
            `$h(${tq}) = -16 \\times \\left(${tq}\\right)^2 + ${v} \\times ${tq}${s ? ` + ${s}` : ""} = -${(v * v) / 64} + ${(v * v) / 32}${s ? ` + ${s}` : ""} = ${(v * v) / 64 + s}$。`,
          ),
        ],
        t(
          `The greatest value of $at^2 + bt + c$ with $a < 0$ is also $c - \\frac{b^2}{4a} = ${s} + \\frac{${v * v}}{64} = ${(v * v) / 64 + s}$.`,
          `当 $a < 0$ 时 $at^2 + bt + c$ 的最大值也等于 $c - \\frac{b^2}{4a} = ${s} + \\frac{${v * v}}{64} = ${(v * v) / 64 + s}$。`,
        ),
        [
          t(`This is the starting height, $h(0)$.`, `这是起始高度 $h(0)$。`),
          t(`This is the coefficient of $t$, an initial speed, not a height.`, `这是 $t$ 的系数，即初速度，不是高度。`),
          t(
            `This keeps only the term $${v}t$ at the peak and leaves out $-16t^2$${s ? " and the starting height" : ""}.`,
            `这是只算了最高点处的 $${v}t$ 一项，漏掉了 $-16t^2$${s ? "和起始高度" : ""}。`,
          ),
        ],
      ),
    );
  }),
  spec("Elementary Cubic Functions", "基本三次函数", ["graphing-elementary-cubic-functions"], (rng, hard) => {
    const [a, k, c] = [rng.int(2, 12), rng.int(2, 4), rng.nonZero(-9, 9)];
    const k3 = k ** 3;
    if (!hard)
      return mc(
        rng,
        t(`If $f(x) = ${a}x^3 ${sg(c)}$, what is the value of $f(${-k})$?`, `若 $f(x) = ${a}x^3 ${sg(c)}$，则 $f(${-k})$ 的值是多少？`),
        -a * k ** 3 + c,
        [a * k ** 3 + c, -3 * a * k + c, -a * k ** 3 - c],
        worked(
          [
            step(
              "Cube the input",
              "求立方",
              `$(-${k})^3 = -${k3}$, since a negative number cubed is negative.`,
              `$(-${k})^3 = -${k3}$，因为负数的立方是负数。`,
            ),
            step(
              "Substitute",
              "代入",
              `$f(-${k}) = ${a} \\times (-${k3}) ${sg(c)} = ${-a * k3} ${sg(c)} = ${-a * k3 + c}$.`,
              `$f(-${k}) = ${a} \\times (-${k3}) ${sg(c)} = ${-a * k3} ${sg(c)} = ${-a * k3 + c}$。`,
            ),
          ],
          t(
            `$f(${k}) = ${a * k3} ${sg(c)}$; negating the input negates only the cubed term, which gives $${-a * k3} ${sg(c)} = ${-a * k3 + c}$.`,
            `$f(${k}) = ${a * k3} ${sg(c)}$；输入变号只改变立方项的符号，得 $${-a * k3} ${sg(c)} = ${-a * k3 + c}$。`,
          ),
          [
            t(`A negative number cubed stays negative: $(-${k})^3 = -${k3}$.`, `负数的立方仍是负数：$(-${k})^3 = -${k3}$。`),
            t(`This multiplies $-${k}$ by $3$ instead of cubing it.`, `这是用 $3$ 乘 $-${k}$，而不是求立方。`),
            t(`This changes the sign of the constant too, but only the input is negative.`, `这是把常数的符号也改了，但只有输入是负的。`),
          ],
        ),
      );
    return spr(
      t(`If $${a}x^3 = ${a * k ** 3}$, what is the value of $x$?`, `若 $${a}x^3 = ${a * k ** 3}$，则 $x$ 的值是多少？`),
      k,
      [k ** 3, a * k, 3 * k],
      worked(
        [
          step("Divide", "相除", `$x^3 = \\frac{${a * k3}}{${a}} = ${k3}$.`, `$x^3 = \\frac{${a * k3}}{${a}} = ${k3}$。`),
          step(
            "Take the cube root",
            "开立方",
            `$x = \\sqrt[3]{${k3}} = ${k}$, since $${k}^3 = ${k3}$.`,
            `$x = \\sqrt[3]{${k3}} = ${k}$，因为 $${k}^3 = ${k3}$。`,
          ),
        ],
        t(`$${a} \\times ${k}^3 = ${a} \\times ${k3} = ${a * k3}$.`, `$${a} \\times ${k}^3 = ${a} \\times ${k3} = ${a * k3}$。`),
        [
          t(`This is $x^3$; the cube root is still needed.`, `这是 $x^3$；还要开立方。`),
          t(`This multiplies the root $${k}$ by $${a}$, but $${a}$ was divided out.`, `这是用 $${a}$ 乘根 $${k}$，但 $${a}$ 已经除掉了。`),
          t(
            `This treats $x^3$ as $3x$: $${k}^3 = ${k3}$, while $3 \\times ${k} = ${3 * k}$.`,
            `这是把 $x^3$ 当成了 $3x$：$${k}^3 = ${k3}$，而 $3 \\times ${k} = ${3 * k}$。`,
          ),
        ],
      ),
    );
  }),
  spec("Higher-Degree Polynomials", "高次多项式", ["end-behavior"], (rng, hard) => {
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
        worked(
          [
            step(
              "Set each factor to zero",
              "令每个因式为零",
              `$x = 0$, $x - ${r} = 0$ or $x + ${s} = 0$, so the zeros are $0$, $${r}$ and $${-s}$.`,
              `$x = 0$、$x - ${r} = 0$ 或 $x + ${s} = 0$，所以零点是 $0$、$${r}$ 和 $${-s}$。`,
            ),
            step(
              "Count",
              "计数",
              `The squared factor repeats $${-s}$ but adds no new zero, so there are $3$ distinct zeros.`,
              `平方因式重复了 $${-s}$，但没有新的零点，所以共有 $3$ 个不同的零点。`,
            ),
          ],
          t(
            `$f$ has degree $4$, and counting $${-s}$ twice for its square gives $1 + 1 + 2 = 4$ zeros with multiplicity.`,
            `$f$ 是 $4$ 次的，平方使 $${-s}$ 算两次，按重数共 $1 + 1 + 2 = 4$ 个零点。`,
          ),
          [
            t(`This leaves out the factor $x$, whose zero is $0$.`, `这是漏掉了因式 $x$，它的零点是 $0$。`),
            t(`This counts $${-s}$ twice, but a distinct zero is counted once.`, `这是把 $${-s}$ 算了两次，但不同的零点只算一次。`),
            t(`Each factor gives its own zero, and there are three different ones.`, `每个因式各给出一个零点，共有三个不同的零点。`),
          ],
        ),
      );
    return spr(
      t(
        `What is the sum of the distinct zeros of $f(x) = (x - ${r})^2(x + ${s})(x - ${r + s})$?`,
        `$f(x) = (x - ${r})^2(x + ${s})(x - ${r + s})$ 的不同零点之和是多少？`,
      ),
      2 * r,
      [3 * r, r + s, 2 * r + s],
      worked(
        [
          step(
            "List the zeros",
            "列出零点",
            `$${r}$ from $(x - ${r})^2$, $${-s}$ from $x + ${s}$ and $${r + s}$ from $x - ${r + s}$.`,
            `$(x - ${r})^2$ 给出 $${r}$，$x + ${s}$ 给出 $${-s}$，$x - ${r + s}$ 给出 $${r + s}$。`,
          ),
          step("Add", "相加", `$${r} + (${-s}) + ${r + s} = ${2 * r}$.`, `$${r} + (${-s}) + ${r + s} = ${2 * r}$。`),
        ],
        t(
          `The three zeros are different, since $${-s} < 0 < ${r} < ${r + s}$, so each is counted once.`,
          `三个零点互不相同，因为 $${-s} < 0 < ${r} < ${r + s}$，所以每个只算一次。`,
        ),
        [
          t(`This counts $${r}$ twice, but a distinct zero is counted once.`, `这是把 $${r}$ 算了两次，但不同的零点只算一次。`),
          t(
            `This is only the zero $${r + s}$; the zeros $${r}$ and $${-s}$ are added too.`,
            `这只是零点 $${r + s}$；零点 $${r}$ 和 $${-s}$ 也要加上。`,
          ),
          t(`This leaves out the zero $${-s}$.`, `这是漏掉了零点 $${-s}$。`),
        ],
      ),
    );
  }),
  spec("Graphs of Higher-Degree Polynomials", "高次多项式的图象", ["graphing-general-polynomials"], (rng, hard) => {
    const r = rng.int(1, 3);
    const s = rng.int(1, 3);
    const scale = rng.pick([0.25, 0.5, 0.75]);
    const f = (x: number) => scale * (x + r) * x * (x - s);
    const fig = curveFigure(f, { x: [-4, 4], y: [-8, 8], dx: 1, dy: 2 }, t("A curve on a coordinate grid.", "坐标网格上的一条曲线。"));
    const zeros = step(
      "Read the zeros",
      "读出零点",
      `The graph crosses the $x$-axis at $${-r}$, $0$ and $${s}$.`,
      `图象在 $${-r}$、$0$ 和 $${s}$ 处穿过 $x$ 轴。`,
    );
    const notZero = (z: number) =>
      t(
        `This factor is zero at $x = ${z}$, but the graph does not cross the $x$-axis there.`,
        `这个因式在 $x = ${z}$ 时为零，但图象并不在那里穿过 $x$ 轴。`,
      );
    if (!hard)
      return mc(
        rng,
        t(
          `The graph of a polynomial function $f$ is shown. Which expression is a factor of $f(x)$?`,
          `图中是多项式函数 $f$ 的图象。哪个式子是 $f(x)$ 的因式？`,
        ),
        `x - ${s}`,
        [`x + ${s + 4}`, `x - ${r + 4}`, `x - ${s + 5}`, `x + ${r + 5}`],
        worked(
          [
            zeros,
            step(
              "Use the factor theorem",
              "用因式定理",
              `A zero at $${s}$ means $x - ${s}$ is a factor.`,
              `$${s}$ 是零点，说明 $x - ${s}$ 是因式。`,
            ),
          ],
          t(
            `$x - ${s}$ is $0$ at $x = ${s}$, exactly where the graph meets the $x$-axis.`,
            `$x - ${s}$ 在 $x = ${s}$ 时为 $0$，正是图象与 $x$ 轴的交点。`,
          ),
          [notZero(-(s + 4)), notZero(r + 4), notZero(s + 5), notZero(-(r + 5))],
        ),
        fig,
      );
    return spr(
      t(
        `The graph of the polynomial function $f$ is shown. What is the sum of its zeros?`,
        `图中是多项式函数 $f$ 的图象。它的零点之和是多少？`,
      ),
      s - r,
      [s + r, r - s, 0 === s - r ? 1 : 0],
      worked(
        [zeros, step("Add", "相加", `$${-r} + 0 + ${s} = ${s - r}$.`, `$${-r} + 0 + ${s} = ${s - r}$。`)],
        t(
          `The zeros fit $x(x + ${r})(x - ${s}) = ${joined("x^3", tx(r - s, "x^2"), tx(-r * s))}$, and the zeros of a cubic $x^3 + px^2 + \\ldots$ add to $-p = ${s - r}$.`,
          `这些零点对应 $x(x + ${r})(x - ${s}) = ${joined("x^3", tx(r - s, "x^2"), tx(-r * s))}$，而三次式 $x^3 + px^2 + \\ldots$ 的零点之和为 $-p = ${s - r}$。`,
        ),
        [
          t(`This adds the distances from $0$, but the zero $${-r}$ is negative.`, `这是把到 $0$ 的距离相加，但零点 $${-r}$ 是负的。`),
          t(
            `The signs are reversed: the zeros are $${-r}$ and $${s}$, not $${r}$ and $${-s}$.`,
            `符号反了：零点是 $${-r}$ 和 $${s}$，不是 $${r}$ 和 $${-s}$。`,
          ),
          s === r
            ? t(`The zeros $${-r}$ and $${s}$ cancel, so the sum is $0$, not $1$.`, `零点 $${-r}$ 与 $${s}$ 相消，所以和为 $0$，不是 $1$。`)
            : t(`The zeros are not symmetric about $0$, so they do not add to $0$.`, `这些零点并不关于 $0$ 对称，所以和不为 $0$。`),
        ],
      ),
      fig,
    );
  }),
  spec("Polynomial Transformations", "多项式变换", ["horizontal-translations-of-functions"], (rng, hard) => {
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
        worked(
          [
            step(
              "Shift right",
              "向右平移",
              `Replace $x$ with $x - ${h}$: $y = (x - ${h})^3$.`,
              `把 $x$ 换成 $x - ${h}$：$y = (x - ${h})^3$。`,
            ),
            step(
              "Shift up",
              "向上平移",
              `Add $${k}$ to the output: $y = (x - ${h})^3 + ${k}$.`,
              `给输出加上 $${k}$：$y = (x - ${h})^3 + ${k}$。`,
            ),
          ],
          t(
            `The point $(0, 0)$ on $y = x^3$ should move to $(${h}, ${k})$, and $(${h} - ${h})^3 + ${k} = ${k}$.`,
            `$y = x^3$ 上的点 $(0, 0)$ 应移到 $(${h}, ${k})$，而 $(${h} - ${h})^3 + ${k} = ${k}$。`,
          ),
          [
            t(`Shifting right uses $x - ${h}$; $x + ${h}$ shifts left.`, `右移用 $x - ${h}$；$x + ${h}$ 是左移。`),
            t(`Shifting up adds $${k}$; subtracting it moves the graph down.`, `上移是加 $${k}$；减去它是下移。`),
            t(
              `This mixes up the shifts: $${h}$ is horizontal and $${k}$ is vertical.`,
              `这是把两个平移弄混了：$${h}$ 是水平的，$${k}$ 是竖直的。`,
            ),
            t(
              `Subtracting $${h}$ outside moves the graph down, not right; the shift must go inside the cube.`,
              `在外面减 $${h}$ 是下移，不是右移；水平平移要放进立方里面。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `The function $f$ has $f(${h}) = ${k}$, and $g(x) = f(x - ${k}) + ${h}$. What is the value of $g(${h + k})$?`,
        `函数 $f$ 满足 $f(${h}) = ${k}$，且 $g(x) = f(x - ${k}) + ${h}$。$g(${h + k})$ 的值是多少？`,
      ),
      h + k,
      [k, h, 2 * k],
      worked(
        [
          step(
            "Find the input of f",
            "求内层输入",
            `$g(${h + k}) = f(${h + k} - ${k}) + ${h} = f(${h}) + ${h}$.`,
            `$g(${h + k}) = f(${h + k} - ${k}) + ${h} = f(${h}) + ${h}$。`,
          ),
          step(
            "Use the given value",
            "用已知值",
            `$f(${h}) = ${k}$, so $g(${h + k}) = ${k} + ${h} = ${h + k}$.`,
            `$f(${h}) = ${k}$，所以 $g(${h + k}) = ${k} + ${h} = ${h + k}$。`,
          ),
        ],
        t(
          `The graph of $g$ is the graph of $f$ moved right $${k}$ and up $${h}$, so the point $(${h}, ${k})$ moves to $(${h + k}, ${h + k})$.`,
          `$g$ 的图象是把 $f$ 的图象右移 $${k}$、上移 $${h}$ 得到的，所以点 $(${h}, ${k})$ 移到 $(${h + k}, ${h + k})$。`,
        ),
        [
          t(`This is $f(${h})$; $g$ also adds $${h}$.`, `这是 $f(${h})$；$g$ 还要加上 $${h}$。`),
          t(`This adds $${h}$ but forgets the value $f(${h}) = ${k}$.`, `这是加了 $${h}$，却忘了 $f(${h}) = ${k}$。`),
          t(`This adds $${k}$ outside, but $g$ adds $${h}$.`, `这是在外面加了 $${k}$，但 $g$ 加的是 $${h}$。`),
        ],
      ),
    );
  }),
  spec("Further Polynomial Transformations", "进一步的多项式变换", ["horizontal-translations-of-functions"], (rng, hard) => {
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
        worked(
          [
            step(
              "Match the inside",
              "让内层等于零点",
              `$g(x) = 0$ when $f(x - ${s}) = 0$, which happens when $x - ${s} = ${r}$.`,
              `当 $f(x - ${s}) = 0$，即 $x - ${s} = ${r}$ 时，$g(x) = 0$。`,
            ),
            step(
              "Solve",
              "求解",
              `$x = ${r} + ${s} = ${r + s}$; the factor $${a}$ outside does not change where $g$ is zero.`,
              `$x = ${r} + ${s} = ${r + s}$；外面的因数 $${a}$ 不改变 $g$ 的零点。`,
            ),
          ],
          t(`$g(${r + s}) = ${a}f(${r}) = ${a} \\times 0 = 0$.`, `$g(${r + s}) = ${a}f(${r}) = ${a} \\times 0 = 0$。`),
          [
            t(`Replacing $x$ with $x - ${s}$ shifts the graph right, so add $${s}$.`, `把 $x$ 换成 $x - ${s}$ 是右移，所以要加 $${s}$。`),
            t(`The factor $${a}$ stretches the outputs; it does not move the zeros.`, `因数 $${a}$ 只伸缩输出，不移动零点。`),
            t(`This shifts correctly but also multiplies the zero by $${a}$.`, `这是平移对了，却又把零点乘了 $${a}$。`),
          ],
        ),
      );
    const top = a * (r + 4) - r;
    return spr(
      t(
        `The function $f$ has a maximum value of $${r + 4}$. What is the maximum value of $g(x) = ${a}f(x + ${s}) - ${r}$?`,
        `函数 $f$ 的最大值为 $${r + 4}$。$g(x) = ${a}f(x + ${s}) - ${r}$ 的最大值是多少？`,
      ),
      a * (r + 4) - r,
      [a * (r + 4), r + 4 - r, a * (r + 4) + s],
      worked(
        [
          step(
            "Shift left",
            "左移",
            `Replacing $x$ with $x + ${s}$ moves the graph left and keeps its outputs, so $f(x + ${s})$ still has maximum $${r + 4}$.`,
            `把 $x$ 换成 $x + ${s}$ 使图象左移，输出不变，所以 $f(x + ${s})$ 的最大值仍是 $${r + 4}$。`,
          ),
          step(
            "Stretch",
            "伸缩",
            `Multiplying by $${a}$ gives maximum $${a} \\times ${r + 4} = ${a * (r + 4)}$.`,
            `乘以 $${a}$ 后最大值为 $${a} \\times ${r + 4} = ${a * (r + 4)}$。`,
          ),
          step(
            "Shift down",
            "下移",
            `Subtracting $${r}$ gives $${a * (r + 4)} - ${r} = ${top}$.`,
            `再减去 $${r}$ 得 $${a * (r + 4)} - ${r} = ${top}$。`,
          ),
        ],
        t(
          `If $f(c) = ${r + 4}$, then $g(c - ${s}) = ${a} \\times ${r + 4} - ${r} = ${top}$, and no output of $g$ is larger because $f$ never exceeds $${r + 4}$.`,
          `若 $f(c) = ${r + 4}$，则 $g(c - ${s}) = ${a} \\times ${r + 4} - ${r} = ${top}$；又因为 $f$ 不超过 $${r + 4}$，$g$ 的输出不会更大。`,
        ),
        [
          t(`This forgets to subtract $${r}$.`, `这是忘了减去 $${r}$。`),
          t(`This forgets to multiply by $${a}$.`, `这是忘了乘以 $${a}$。`),
          t(
            `The horizontal shift $${s}$ does not change the outputs, and $${r}$ is subtracted.`,
            `水平平移 $${s}$ 不改变输出，而且 $${r}$ 是要减去的。`,
          ),
        ],
      ),
    );
  }),
  spec(
    "Using the Factor Theorem to Reason About Polynomials",
    "用因式定理分析多项式",
    ["reasoning-about-coefficients-in-quadratic-equations-using-the-factor-theorem"],
    (rng, hard) => {
      const [r, b, c] = [rng.int(1, 5), rng.int(1, 6), rng.int(1, 9)];
      const z = rng.int(1, 15);
      const zero = rng.pick([z, -z]);
      if (!hard) {
        // A zero of -1 would make the shifted distractors x + 0, so they move one step further.
        const off = zero === -1 ? zero - 1 : zero + 1;
        const bad = (root: number) =>
          t(`This factor is zero at $x = ${root}$, not at $x = ${zero}$.`, `这个因式在 $x = ${root}$ 时为零，而不是在 $x = ${zero}$ 时。`);
        return mc(
          rng,
          t(
            `For a polynomial $p$, $p(${zero}) = 0$. Which must be a factor of $p(x)$?`,
            `多项式 $p$ 满足 $p(${zero}) = 0$。哪个一定是 $p(x)$ 的因式？`,
          ),
          `x ${sg(-zero)}`,
          [`x ${sg(zero)}`, cx(z), `x ${sg(-off)}`, `x ${sg(off)}`],
          worked(
            [
              step(
                "Use the factor theorem",
                "用因式定理",
                `If $p(${zero}) = 0$, then $x - ${par(zero)}$ is a factor of $p(x)$.`,
                `若 $p(${zero}) = 0$，则 $x - ${par(zero)}$ 是 $p(x)$ 的因式。`,
              ),
              step("Simplify", "化简", `$x - ${par(zero)} = x ${sg(-zero)}$.`, `$x - ${par(zero)} = x ${sg(-zero)}$。`),
            ],
            t(
              `At $x = ${zero}$ the factor $x ${sg(-zero)}$ is $0$, so any polynomial with this factor has $p(${zero}) = 0$.`,
              `$x = ${zero}$ 时因式 $x ${sg(-zero)}$ 为 $0$，所以含有这个因式的多项式都满足 $p(${zero}) = 0$。`,
            ),
            [bad(-zero), bad(0), bad(off), bad(-off)],
          ),
        );
      }
      const k = -(r ** 3 + b * r * r + c * r);
      return spr(
        t(
          `If $x - ${r}$ is a factor of $x^3 + ${b}x^2 + ${c}x + k$, where $k$ is a constant, what is the value of $k$?`,
          `若 $x - ${r}$ 是 $x^3 + ${b}x^2 + ${c}x + k$ 的因式，其中 $k$ 是常数，则 $k$ 的值是多少？`,
        ),
        k,
        [-k, -(r ** 3), -(b * r * r + c * r)],
        worked(
          [
            step(
              "Use the factor theorem",
              "用因式定理",
              `$x - ${r}$ is a factor exactly when the polynomial is $0$ at $x = ${r}$.`,
              `$x - ${r}$ 是因式，当且仅当多项式在 $x = ${r}$ 时为 $0$。`,
            ),
            step(
              "Substitute",
              "代入",
              `At $x = ${r}$ the first three terms are $${r ** 3}$, $${b * r * r}$ and $${c * r}$, so $${r ** 3} + ${b * r * r} + ${c * r} + k = 0$.`,
              `$x = ${r}$ 时前三项分别是 $${r ** 3}$、$${b * r * r}$ 和 $${c * r}$，所以 $${r ** 3} + ${b * r * r} + ${c * r} + k = 0$。`,
            ),
            step("Solve", "求解", `$${-k} + k = 0$, so $k = ${k}$.`, `$${-k} + k = 0$，所以 $k = ${k}$。`),
          ],
          t(`With $k = ${k}$ the value at $x = ${r}$ is $${-k} - ${-k} = 0$.`, `取 $k = ${k}$，$x = ${r}$ 时的值为 $${-k} - ${-k} = 0$。`),
          [
            t(
              `This is the sum of the other terms at $x = ${r}$; $k$ must cancel it, so it is negative.`,
              `这是 $x = ${r}$ 时其余各项之和；$k$ 要把它抵消，所以是负的。`,
            ),
            t(`This cancels only the term $x^3$ and leaves out the others.`, `这只抵消了 $x^3$ 一项，漏掉了其他项。`),
            t(`This leaves out the term $x^3 = ${r ** 3}$.`, `这是漏掉了 $x^3 = ${r ** 3}$ 这一项。`),
          ],
        ),
      );
    },
  ),
];
