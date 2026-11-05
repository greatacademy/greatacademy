import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { ask, curveFigure, ordinal, sg, spec, words } from "../exam.ts";
import { curvePlot, polyFigure, sasPts } from "../exam-figures.ts";

// ACT Math Prep, Functions: notation, logarithms, graphs and their features, sequences and trigonometric functions.

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
] as const;
const degRad = [
  [30, "\\frac{\\pi}{6}"],
  [45, "\\frac{\\pi}{4}"],
  [60, "\\frac{\\pi}{3}"],
  [90, "\\frac{\\pi}{2}"],
  [120, "\\frac{2\\pi}{3}"],
  [135, "\\frac{3\\pi}{4}"],
  [150, "\\frac{5\\pi}{6}"],
  [180, "\\pi"],
  [210, "\\frac{7\\pi}{6}"],
  [225, "\\frac{5\\pi}{4}"],
  [240, "\\frac{4\\pi}{3}"],
  [270, "\\frac{3\\pi}{2}"],
  [300, "\\frac{5\\pi}{3}"],
  [315, "\\frac{7\\pi}{4}"],
  [330, "\\frac{11\\pi}{6}"],
] as const;

/** actExamFunctions are the exam-style questions of the ACT Functions unit that have no SAT counterpart. */
export const actExamFunctions: ExamSpec[] = [
  spec(
    "Evaluating a Function in Context",
    "在情境中求函数值",
    ["interpreting-rate-of-change-and-initial-value-in-context"],
    (rng, hard) => {
      const [f, r, h, k] = [rng.int(2, 12) * 5, rng.int(5, 25), rng.int(2, 12), rng.int(2, 6)];
      if (!hard)
        return ask(
          rng,
          `The cost in dollars of renting a tool for $h$ hours is $C(h) = ${f} + ${r}h$. What is $C(${h})$?`,
          `租工具 $h$ 小时的费用（美元）为 $C(h) = ${f} + ${r}h$。$C(${h})$ 是多少？`,
          f + r * h,
          [(f + r) * h, r * h, f + h, f + r],
          `$${f} + ${r}(${h}) = ${f + r * h}$.`,
          `$${f} + ${r}(${h}) = ${f + r * h}$。`,
        );
      return ask(
        rng,
        `The cost in dollars of renting a tool for $h$ hours is $C(h) = ${f} + ${r}h$. By how many dollars does the cost increase when the time rises from $${h}$ to $${h + k}$ hours?`,
        `租工具 $h$ 小时的费用（美元）为 $C(h) = ${f} + ${r}h$。时间从 $${h}$ 小时增加到 $${h + k}$ 小时，费用增加多少美元？`,
        r * k,
        [f + r * k, f + r * (h + k), r, r * (h + k)],
        `Only the hourly part changes: $${r}(${k}) = ${r * k}$.`,
        `只有按小时计的部分变化：$${r}(${k}) = ${r * k}$。`,
      );
    },
  ),
  spec("Evaluating a Multivariable Function", "多元函数求值", ["many-variable-equations"], (rng, hard) => {
    const [a, b, x, y] = [rng.int(2, 9), rng.int(2, 9), rng.int(-6, 9), rng.int(-6, 9)];
    if (!hard)
      return ask(
        rng,
        `If $f(x, y) = ${a}x + ${b}y$, what is $f(${x}, ${y})$?`,
        `若 $f(x, y) = ${a}x + ${b}y$，$f(${x}, ${y})$ 是多少？`,
        a * x + b * y,
        [a * y + b * x === a * x + b * y ? a * x + b * y + 1 : a * y + b * x, a * x, b * y, (a + b) * (x + y)],
        `Substitute $x = ${x}$ and $y = ${y}$.`,
        `代入 $x = ${x}$，$y = ${y}$。`,
      );
    return ask(
      rng,
      `If $f(x, y) = x^2 - ${a}xy + y^2$, what is $f(${x}, ${y})$?`,
      `若 $f(x, y) = x^2 - ${a}xy + y^2$，$f(${x}, ${y})$ 是多少？`,
      x * x - a * x * y + y * y,
      [x * x + a * x * y + y * y, x * x - a * x * y - y * y, 2 * x - a * x * y + 2 * y, x * x + y * y],
      `$(${x})^2 - ${a}(${x})(${y}) + (${y})^2$.`,
      `$(${x})^2 - ${a}(${x})(${y}) + (${y})^2$。`,
    );
  }),
  spec("Performing Operations on Functions", "函数的运算", ["arithmetic-of-functions"], (rng, hard) => {
    const [a, b, c, d, x] = [rng.int(2, 9), rng.nonZero(-9, 9), rng.int(2, 9), rng.nonZero(-9, 9), rng.int(1, 6)];
    const dd = b + d === 0 ? b : d;
    const sum = b + dd;
    if (!hard)
      return ask(
        rng,
        `If $f(x) = ${a}x ${sg(b)}$ and $g(x) = ${c}x ${sg(dd)}$, what is $(f + g)(x)$?`,
        `若 $f(x) = ${a}x ${sg(b)}$，$g(x) = ${c}x ${sg(dd)}$，$(f + g)(x)$ 是什么？`,
        `${a + c}x ${sg(sum)}`,
        [
          `${a * c}x ${sg(sum)}`,
          `${a + c}x ${sg(sum + 1)}`,
          `${a + c + 1}x ${sg(sum)}`,
          `${Math.abs(a - c) + 1}x ${sg(sum)}`,
          `${a + c}x^2 ${sg(sum)}`,
        ],
        `Add the $x$ terms and the constants.`,
        `$x$ 项与常数项分别相加。`,
      );
    return ask(
      rng,
      `If $f(x) = ${a}x ${sg(b)}$ and $g(x) = x ${sg(d)}$, what is $(fg)(${x})$?`,
      `若 $f(x) = ${a}x ${sg(b)}$，$g(x) = x ${sg(d)}$，$(fg)(${x})$ 是多少？`,
      (a * x + b) * (x + d),
      [a * x + b + x + d, a * (x + d) + b, a * x * x + b * d, (a * x + b) * (x + d) + 1],
      `$f(${x}) = ${a * x + b}$ and $g(${x}) = ${x + d}$; multiply them.`,
      `$f(${x}) = ${a * x + b}$，$g(${x}) = ${x + d}$，二者相乘。`,
    );
  }),
  spec("Composing Functions Algebraically", "用代数方法复合函数", ["function-composition"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
    if (!hard)
      return ask(
        rng,
        `If $f(x) = x^2$ and $g(x) = ${a}x ${sg(b)}$, what is $f(g(x))$?`,
        `若 $f(x) = x^2$，$g(x) = ${a}x ${sg(b)}$，$f(g(x))$ 是什么？`,
        `(${a}x ${sg(b)})^2`,
        [`${a}x^2 ${sg(b)}`, `${a}x^2 + ${b * b}`, `(${a}x ${sg(-b)})^2`, `${a * a}x^2 ${sg(b)}`],
        `Put $g(x)$ in place of $x$ in $f$.`,
        `把 $f$ 中的 $x$ 换成 $g(x)$。`,
      );
    return ask(
      rng,
      `If $f(x) = ${a}x ${sg(b)}$ and $g(x) = x^2 ${sg(c)}$, what is $f(g(x))$?`,
      `若 $f(x) = ${a}x ${sg(b)}$，$g(x) = x^2 ${sg(c)}$，$f(g(x))$ 是什么？`,
      a * c + b === 0 ? `${a}x^2` : `${a}x^2 ${sg(a * c + b)}`,
      [
        `${a}x^2 ${sg(c + b === 0 ? 1 : c + b)}`,
        `${a * a}x^2 ${sg(a * b + c === 0 ? 2 : a * b + c)}`,
        `x^2 ${sg(a * c + b === 0 ? 3 : a * c + b)}`,
        `${a + 1}x^2 ${sg(a * c + b === 0 ? 4 : a * c + b)}`,
      ],
      `$${a}(x^2 ${sg(c)}) ${sg(b)}$, and distribute.`,
      `$${a}(x^2 ${sg(c)}) ${sg(b)}$，再分配。`,
    );
  }),
  spec("Finding an Inverse Function", "求反函数", ["introduction-to-inverse-functions"], (rng, hard) => {
    const [a, b, x] = [rng.int(2, 9), rng.nonZero(-12, 12), rng.int(1, 12)];
    if (!hard)
      return ask(
        rng,
        `If $f(x) = ${a}x ${sg(b)}$, what is $f^{-1}(${a * x + b})$?`,
        `若 $f(x) = ${a}x ${sg(b)}$，$f^{-1}(${a * x + b})$ 是多少？`,
        x,
        [a * (a * x + b) + b, Q.of(a * x + b, a), x + 1, a * x],
        `The inverse returns the input that gave $${a * x + b}$, which is $${x}$.`,
        `反函数返回得到 $${a * x + b}$ 的输入，即 $${x}$。`,
      );
    return ask(
      rng,
      `If $f(x) = ${a}x ${sg(b)}$, which expression is $f^{-1}(x)$?`,
      `若 $f(x) = ${a}x ${sg(b)}$，哪个式子是 $f^{-1}(x)$？`,
      `\\frac{x ${sg(-b)}}{${a}}`,
      [`\\frac{x ${sg(b)}}{${a}}`, `${a}x ${sg(-b)}`, `\\frac{1}{${a}x ${sg(b)}}`, `\\frac{x}{${a}} ${sg(-b)}`],
      `Solve $y = ${a}x ${sg(b)}$ for $x$, then rename the variables.`,
      `从 $y = ${a}x ${sg(b)}$ 解出 $x$，再交换变量名。`,
    );
  }),
  spec("Identifying Characteristics of Functions", "判断函数的特征", ["representations-of-functions"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 9), rng.int(10, 19), rng.int(20, 29), rng.int(30, 39)];
    if (!hard)
      return words(
        rng,
        t(
          `Which of these sets of ordered pairs, using $${a}$, $${b}$ and $${c}$, is not a function?`,
          `用 $${a}$、$${b}$、$${c}$ 写成的下列有序数对集合中，哪个不是函数？`,
        ),
        t(`$\\{(${a}, ${b}), (${a}, ${c})\\}$`, `$\\{(${a}, ${b}), (${a}, ${c})\\}$`),
        [
          t(`$\\{(${a}, ${b}), (${b}, ${b})\\}$`, `$\\{(${a}, ${b}), (${b}, ${b})\\}$`),
          t(`$\\{(${a}, ${c}), (${b}, ${d})\\}$`, `$\\{(${a}, ${c}), (${b}, ${d})\\}$`),
          t(`$\\{(${b}, ${c}), (${c}, ${b})\\}$`, `$\\{(${b}, ${c}), (${c}, ${b})\\}$`),
        ],
        t(
          `A function gives one output for each input, and here $${a}$ has two outputs.`,
          `函数对每个输入只给一个输出，而这里 $${a}$ 有两个输出。`,
        ),
      );
    return words(
      rng,
      t(
        `The function $f(x) = ${a}x^2 + ${b}$ is compared with $g(x) = ${a}x + ${b}$. Which statement is true?`,
        `比较函数 $f(x) = ${a}x^2 + ${b}$ 与 $g(x) = ${a}x + ${b}$。哪个说法正确？`,
      ),
      t(`$f$ has a least value, and $g$ has none.`, `$f$ 有最小值，$g$ 没有。`),
      [
        t(`$g$ has a least value, and $f$ has none.`, `$g$ 有最小值，$f$ 没有。`),
        t(`Both have a least value.`, `两者都有最小值。`),
        t(`Neither has a least value.`, `两者都没有最小值。`),
      ],
      t(
        `Since $x^2 \\ge 0$, $f$ is least at $x = 0$, while $g$ decreases without bound to the left.`,
        `因为 $x^2 \\ge 0$，$f$ 在 $x = 0$ 处最小，而 $g$ 向左无限减小。`,
      ),
    );
  }),
  spec(
    "Determining Function Outputs",
    "确定函数的输出",
    ["finding-a-function-input-for-a-given-output", "linear-functions-in-tabular-form"],
    (rng, hard) => {
      const [a, b, x] = [rng.int(2, 9), rng.int(-9, 12), rng.int(2, 9)];
      const c = rng.int(2, 5);
      if (!hard)
        return ask(
          rng,
          `For a linear function $f$, $f(0) = ${b}$ and $f(1) = ${a + b}$. What is $f(${x})$?`,
          `线性函数 $f$ 满足 $f(0) = ${b}$，$f(1) = ${a + b}$。$f(${x})$ 是多少？`,
          a * x + b,
          [a * x, (a + b) * x, a + b + x, a * x + b + a],
          `The slope is $${a}$ and the intercept is $${b}$.`,
          `斜率是 $${a}$，截距是 $${b}$。`,
        );
      return ask(
        rng,
        `For a linear function $f$, $f(${x}) = ${a * x + b}$ and $f(${x + c}) = ${a * (x + c) + b}$. What is $f(${x + 2 * c})$?`,
        `线性函数 $f$ 满足 $f(${x}) = ${a * x + b}$，$f(${x + c}) = ${a * (x + c) + b}$。$f(${x + 2 * c})$ 是多少？`,
        a * (x + 2 * c) + b,
        [a * (x + c) + b + a, a * (x + c) + b + c, 2 * (a * (x + c) + b), a * (x + 2 * c) + b + 1],
        `Equal steps in the input give equal changes in the output, here $${a * c}$.`,
        `输入等距变化时输出也等量变化，这里是 $${a * c}$。`,
      );
    },
  ),
  spec(
    "Finding Inputs of Exponential Functions",
    "求指数函数的输入值",
    ["solving-exponential-equations-using-logarithms", "negative-exponents"],
    (rng, hard) => {
      const [a, b, c, x] = [rng.int(2, 9), rng.pick([2, 3, 5]), rng.int(1, 40), rng.int(1, 4)];
      if (!hard) {
        const v = a * b ** x + c;
        return ask(
          rng,
          `The function $f$ is defined by $f(x) = ${a} \\cdot ${b}^x + ${c}$. For what value of $x$ is $f(x) = ${v}$?`,
          `函数 $f$ 定义为 $f(x) = ${a} \\cdot ${b}^x + ${c}$。$x$ 取何值时 $f(x) = ${v}$？`,
          x,
          [x + 1, x + 2, b ** x],
          `Undo the outer steps first: $${a} \\cdot ${b}^x = ${v - c}$, then $${b}^x = ${b ** x}$. So $x = ${x}$.`,
          `先逐步还原外层：$${a} \\cdot ${b}^x = ${v - c}$，再得 $${b}^x = ${b ** x}$。所以 $x = ${x}$。`,
        );
      }
      const [p, q] = [rng.int(1, 5), rng.int(1, 6)];
      const meet = q + 2 * p;
      return ask(
        rng,
        `The graphs of $g(x) = ${b}^{3x - ${q}}$ and $h(x) = ${b * b}^{x + ${p}}$ meet at one point. What is the $x$-coordinate of that point?`,
        `$g(x) = ${b}^{3x - ${q}}$ 与 $h(x) = ${b * b}^{x + ${p}}$ 的图象交于一点。这一点的 $x$ 坐标是多少？`,
        meet,
        [q + p, Q.of(p + q, 2), 2 * meet],
        `Write both with base $${b}$: $${b * b}^{x + ${p}} = ${b}^{2x + ${2 * p}}$. Equal bases need equal exponents: $3x - ${q} = 2x + ${2 * p}$, so $x = ${meet}$.`,
        `都写成底数 $${b}$：$${b * b}^{x + ${p}} = ${b}^{2x + ${2 * p}}$。底数相同则指数相等：$3x - ${q} = 2x + ${2 * p}$，所以 $x = ${meet}$。`,
      );
    },
  ),
  spec("Evaluating Logarithms", "对数求值", ["converting-between-exponential-and-logarithmic-form"], (rng, hard) => {
    const [b, n, m] = [rng.int(2, 7), rng.int(2, 4), rng.int(1, 3)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $\\log_{${b}} ${b ** n} + ${m + 3 * b}$?`,
        `$\\log_{${b}} ${b ** n} + ${m + 3 * b}$ 的值是多少？`,
        n + m + 3 * b,
        [b ** n + m + 3 * b, n, b + m + 3 * b, n + m + 3 * b + 1],
        `$${b}^{${n}} = ${b ** n}$, so the logarithm is $${n}$.`,
        `$${b}^{${n}} = ${b ** n}$，所以对数是 $${n}$。`,
      );
    return ask(
      rng,
      `What is the value of $\\log_{${b}} \\frac{1}{${b ** n}} + \\log_{${b + 1}} ${(b + 1) ** m}$?`,
      `$\\log_{${b}} \\frac{1}{${b ** n}} + \\log_{${b + 1}} ${(b + 1) ** m}$ 的值是多少？`,
      m - n,
      [n + m, n - m === m - n ? n + m + 1 : n - m, m, -n],
      `The first logarithm is $${-n}$ and the second is $${m}$.`,
      `第一个对数是 $${-n}$，第二个是 $${m}$。`,
    );
  }),
  spec("Applying Logarithm Properties", "应用对数性质", ["combining-laws-of-logarithms"], (rng, hard) => {
    const [b, p, q, k] = [rng.int(2, 5), rng.int(1, 4), rng.int(1, 4), rng.int(2, 7)];
    if (!hard)
      return ask(
        rng,
        `What is $\\log_{${b}} ${b ** p * k} - \\log_{${b}} ${k}$?`,
        `$\\log_{${b}} ${b ** p * k} - \\log_{${b}} ${k}$ 等于多少？`,
        p,
        [p + 1, b ** p, p * k, k],
        `A difference of logarithms is the logarithm of a quotient, and the quotient is $${b ** p}$.`,
        `对数之差是商的对数，商为 $${b ** p}$。`,
      );
    return ask(
      rng,
      `If $\\log_{${b}} x = ${p}$ and $\\log_{${b}} y = ${q}$, what is $\\log_{${b}} (x^{${k}}y)$?`,
      `若 $\\log_{${b}} x = ${p}$，$\\log_{${b}} y = ${q}$，$\\log_{${b}} (x^{${k}}y)$ 是多少？`,
      k * p + q,
      [k * p * q, k * (p + q), p + q, k + p + q === k * p + q ? k * p + q + 1 : k + p + q],
      `Bring down $${k}$ and add: $${k}(${p}) + ${q}$.`,
      `把 $${k}$ 提到前面再相加：$${k}(${p}) + ${q}$。`,
    );
  }),
  spec(
    "Relating Exponential and Logarithmic Forms",
    "指数形式与对数形式的关系",
    ["converting-between-exponential-and-logarithmic-form"],
    (rng, hard) => {
      const [b, n, a] = [rng.int(2, 12), rng.int(2, 9), rng.int(2, 30)];
      if (!hard)
        return ask(
          rng,
          `Which equation is equivalent to $${b}^{x} = ${a}$?`,
          `哪个方程与 $${b}^{x} = ${a}$ 等价？`,
          `x = \\log_{${b}} ${a}`,
          [`x = \\log_{${a}} ${b}`, `${b} = \\log_{x} ${a}`, `${a} = \\log_{${b}} x`, `x = ${a}^{${b}}`],
          `The base stays the base, and the logarithm equals the exponent.`,
          `底数不变，对数等于指数。`,
        );
      return ask(
        rng,
        `Which equation is equivalent to $\\log_{${b}} x = ${n}$?`,
        `哪个方程与 $\\log_{${b}} x = ${n}$ 等价？`,
        `x = ${b}^{${n}}`,
        [`x = ${n}^{${b}}`, `${b} = x^{${n}}`, `x = ${b * n}`, `${n} = x^{${b}}`, `x = ${b + n}`, `x = ${b}^{${n + 1}}`],
        `The logarithm $${n}$ is the exponent on the base $${b}$.`,
        `对数 $${n}$ 是底数 $${b}$ 的指数。`,
      );
    },
  ),
  spec("Solving Logarithmic Equations", "解对数方程", ["solving-exponential-equations-using-logarithms"], (rng, hard) => {
    const [b, n, c, a] = [rng.int(2, 5), rng.int(2, 4), rng.int(1, 20), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What value of $x$ satisfies $\\log_{${b}} (x - ${c}) = ${n}$?`,
        `哪个 $x$ 满足 $\\log_{${b}} (x - ${c}) = ${n}$？`,
        b ** n + c,
        [b ** n - c, b * n + c, n + c, b ** n],
        `$x - ${c} = ${b}^{${n}} = ${b ** n}$.`,
        `$x - ${c} = ${b}^{${n}} = ${b ** n}$。`,
      );
    return ask(
      rng,
      `What value of $x$ satisfies $\\log_{${b}} x + \\log_{${b}} ${a} = ${n}$? Give an exact value.`,
      `哪个 $x$ 满足 $\\log_{${b}} x + \\log_{${b}} ${a} = ${n}$？（给出确切值。）`,
      Q.of(b ** n, a),
      [b ** n - a, b ** n, a * b ** n, n - a],
      `Combine to get $${a}x = ${b ** n}$.`,
      `合并得 $${a}x = ${b ** n}$。`,
    );
  }),
  spec("Identifying Features of Logarithmic Functions", "判断对数函数的特征", ["graphing-logarithmic-functions"], (rng, hard) => {
    const [b, c, d] = [rng.int(2, 9), rng.int(1, 12), rng.nonZero(-9, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the domain of $f(x) = \\log_{${b}} (x - ${c})$?`,
        `$f(x) = \\log_{${b}} (x - ${c})$ 的定义域是什么？`,
        `x > ${c}`,
        [`x \\ge ${c}`, `x > ${-c}`, `x > ${b}`, `x < ${c}`, `x > 0`],
        `The input of a logarithm must be positive.`,
        `对数的输入必须为正。`,
      );
    return ask(
      rng,
      `What is the vertical asymptote of the graph of $y = \\log_{${b}} (x + ${c}) ${sg(d)}$?`,
      `$y = \\log_{${b}} (x + ${c}) ${sg(d)}$ 的图像的竖直渐近线是什么？`,
      `x = ${-c}`,
      [`x = ${c}`, `y = ${d}`, `x = ${d}`, `x = ${-c + 1}`],
      `The input is zero at $x = ${-c}$, and the outer constant moves the graph only vertically.`,
      `$x = ${-c}$ 时输入为零，外面的常数只使图像上下平移。`,
    );
  }),
  spec("Determining Domain From an Equation", "由方程确定定义域", ["domain-of-a-function"], (rng, hard) => {
    const [a, c, k] = [rng.int(2, 9), rng.int(1, 15), rng.int(2, 7)];
    if (!hard)
      return ask(
        rng,
        `What is the domain of $f(x) = \\frac{${a}}{x - ${c}}$?`,
        `$f(x) = \\frac{${a}}{x - ${c}}$ 的定义域是什么？`,
        `x \\ne ${c}`,
        [`x \\ne ${-c}`, `x > ${c}`, `x \\ne ${a}`, `\\text{all real numbers}`],
        `The denominator cannot be zero.`,
        `分母不能为零。`,
      );
    return ask(
      rng,
      `What is the domain of $f(x) = \\sqrt{${k}x - ${k * c}}$?`,
      `$f(x) = \\sqrt{${k}x - ${k * c}}$ 的定义域是什么？`,
      `x \\ge ${c}`,
      [`x \\le ${c}`, `x > ${c}`, `x \\ge ${k * c}`, `x \\ge ${-c}`],
      `$${k}x - ${k * c} \\ge 0$ gives $x \\ge ${c}$.`,
      `$${k}x - ${k * c} \\ge 0$ 得 $x \\ge ${c}$。`,
    );
  }),
  spec("Reading Domain From a Graph", "由图像读定义域", ["domain-of-a-function"], (rng, hard) => {
    const [lo, w, m] = [rng.int(-8, -1), rng.int(4, 10), rng.pick([1, 2])];
    const hi = lo + w;
    const f = (x: number) => (x < lo || x > hi ? Number.NaN : m * (x - lo) - 4);
    const fig = curveFigure(
      f,
      { x: [-10, 10], y: [-6, 20], dx: 2, dy: 2 },
      t("A line segment on a coordinate grid.", "坐标网格上的一条线段。"),
    );
    if (!hard)
      return ask(
        rng,
        `The graph of $f$ is the segment shown, including its endpoints. What is the domain of $f$?`,
        `$f$ 的图像是所示线段（含端点）。$f$ 的定义域是什么？`,
        `${lo} \\le x \\le ${hi}`,
        [`-4 \\le x \\le ${m * w - 4}`, `${lo} < x < ${hi}`, `x \\ge ${lo}`, `\\text{all real numbers}`],
        `The domain is the set of $x$-values the graph covers.`,
        `定义域是图像覆盖的 $x$ 值。`,
        fig,
      );
    return ask(
      rng,
      `The graph of $f$ is the segment shown, including its endpoints. What is the range of $f$?`,
      `$f$ 的图像是所示线段（含端点）。$f$ 的值域是什么？`,
      `-4 \\le y \\le ${m * w - 4}`,
      [`${lo} \\le y \\le ${hi}`, `y \\ge -4`, `-4 < y < ${m * w - 4}`, `\\text{all real numbers}`],
      `The range is the set of $y$-values the graph covers.`,
      `值域是图像覆盖的 $y$ 值。`,
      fig,
    );
  }),
  spec("Finding Asymptotes of a Rational Function", "求有理函数的渐近线", ["vertical-asymptotes-of-rational-functions"], (rng, hard) => {
    const [a, c, d] = [rng.int(2, 9), rng.int(1, 12), rng.nonZero(-9, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the vertical asymptote of the graph of $y = \\frac{${a}}{x - ${c}}$?`,
        `$y = \\frac{${a}}{x - ${c}}$ 的图像的竖直渐近线是什么？`,
        `x = ${c}`,
        [`x = ${-c}`, `y = ${c}`, `x = ${a}`, `y = ${a}`, `x = ${c + 1}`],
        `The denominator is zero at $x = ${c}$.`,
        `$x = ${c}$ 时分母为零。`,
      );
    return ask(
      rng,
      `What is the horizontal asymptote of the graph of $y = \\frac{${a}x}{x - ${c}} ${sg(d)}$?`,
      `$y = \\frac{${a}x}{x - ${c}} ${sg(d)}$ 的图像的水平渐近线是什么？`,
      `y = ${a + d}`,
      [`y = ${a}`, `y = ${d}`, `x = ${c}`, `y = ${a + d + 1}`],
      `For large $x$, the fraction approaches $${a}$, and then add the $${d}$.`,
      `$x$ 很大时分式趋近 $${a}$，再加 $${d}$。`,
    );
  }),
  spec("Describing Behavior of a Function Graph", "描述函数图像的行为", ["end-behavior"], (rng, hard) => {
    const [a, n] = [rng.int(1, 30), rng.pick([2, 4, 6])];
    const m = rng.pick([3, 5, 7]);
    if (!hard)
      return words(
        rng,
        t(
          `As $x$ increases without bound, what happens to $f(x) = -${a}x^{${m}}$?`,
          `当 $x$ 无限增大时，$f(x) = -${a}x^{${m}}$ 如何变化？`,
        ),
        t("It decreases without bound.", "无限减小。"),
        [
          t("It increases without bound.", "无限增大。"),
          t("It approaches $0$.", "趋近于 $0$。"),
          t(`It approaches $-${a}$.`, `趋近于 $-${a}$。`),
        ],
        t(
          `A large positive power is positive, and the negative coefficient makes the value very negative.`,
          `正数的高次幂为正，负系数使其值变成很大的负数。`,
        ),
      );
    return words(
      rng,
      t(`Which describes the end behavior of $f(x) = ${a}x^{${n}} - ${m}x$?`, `哪项描述了 $f(x) = ${a}x^{${n}} - ${m}x$ 的端点行为？`),
      t("It rises on both the left and the right.", "左右两端都上升。"),
      [
        t("It falls on both the left and the right.", "左右两端都下降。"),
        t("It falls on the left and rises on the right.", "左端下降，右端上升。"),
        t("It rises on the left and falls on the right.", "左端上升，右端下降。"),
      ],
      t(`The even-degree term with a positive coefficient controls both ends.`, `正系数的偶次项决定两端。`),
    );
  }),
  spec("Determining the Range of a Function", "确定函数的值域", ["range-of-a-function"], (rng, hard) => {
    const [a, c, h] = [rng.int(2, 9), rng.int(-9, 12), rng.nonZero(-6, 6)];
    if (!hard)
      return ask(
        rng,
        `What is the range of $f(x) = ${a}x^2 ${sg(c === 0 ? 1 : c)}$?`,
        `$f(x) = ${a}x^2 ${sg(c === 0 ? 1 : c)}$ 的值域是什么？`,
        `y \\ge ${c === 0 ? 1 : c}`,
        [`y \\le ${c === 0 ? 1 : c}`, `y \\ge ${a}`, `\\text{all real numbers}`, `y > ${c === 0 ? 1 : c}`],
        `Since $x^2 \\ge 0$, the least value occurs at $x = 0$.`,
        `因为 $x^2 \\ge 0$，最小值在 $x = 0$ 处取得。`,
      );
    return ask(
      rng,
      `What is the range of $f(x) = -|x ${sg(h)}| ${sg(c === 0 ? 1 : c)}$?`,
      `$f(x) = -|x ${sg(h)}| ${sg(c === 0 ? 1 : c)}$ 的值域是什么？`,
      `y \\le ${c === 0 ? 1 : c}`,
      [`y \\ge ${c === 0 ? 1 : c}`, `y \\le ${h}`, `y \\le ${-h}`, `\\text{all real numbers}`],
      `The absolute value is at least $0$, so the negative of it is at most $0$.`,
      `绝对值至少为 $0$，其相反数至多为 $0$。`,
    );
  }),
  spec("Translating Function Graphs Vertically", "函数图像的上下平移", ["vertical-translations-of-functions"], (rng, hard) => {
    const [a, b, k] = [rng.int(2, 9), rng.nonZero(-9, 9), rng.int(1, 12)];
    const nb = b + k === 0 ? b + k + 1 : b + k;
    const kk = nb - b;
    if (!hard)
      return ask(
        rng,
        `The graph of $y = ${a}x ${sg(b)}$ is shifted up $${kk}$ units. What is the equation of the new graph?`,
        `$y = ${a}x ${sg(b)}$ 的图像向上平移 $${kk}$ 个单位。新图像的方程是什么？`,
        `y = ${a}x ${sg(nb)}`,
        [
          `y = ${a}x ${sg(b - kk === 0 ? 1 : b - kk)}`,
          `y = ${a + kk}x ${sg(b)}`,
          `y = ${a}(x ${sg(kk)}) ${sg(b)}`,
          `y = ${a}x ${sg(nb + 1)}`,
        ],
        `Add $${kk}$ to the output.`,
        `输出加 $${kk}$。`,
        curvePlot((x) => a * x + b, [-10, 10], [-20, 20]),
      );
    return ask(
      rng,
      `The graph of $y = (x - ${k})^2$ is shifted down $${a * a}$ units. What are the $x$-intercepts of the new graph?`,
      `$y = (x - ${k})^2$ 的图像向下平移 $${a * a}$ 个单位。新图像的 $x$ 轴截距是什么？`,
      `x = ${k - a} \\text{ and } x = ${k + a}`,
      [
        `x = ${k - a * a} \\text{ and } x = ${k + a * a}`,
        `x = ${-k - a} \\text{ and } x = ${-k + a}`,
        `x = ${k} \\text{ only}`,
        `x = ${k + a} \\text{ only}`,
      ],
      `Solve $(x - ${k})^2 = ${a * a}$, so $x - ${k} = \\pm ${a}$.`,
      `解 $(x - ${k})^2 = ${a * a}$，得 $x - ${k} = \\pm ${a}$。`,
      curvePlot((x) => (x - k) ** 2, [k - 6, k + 6], [-4, 36]),
    );
  }),
  spec(
    "Translating Horizontally and Reflecting Graphs",
    "函数图像的左右平移和翻折",
    ["horizontal-translations-of-functions"],
    (rng, hard) => {
      const [h, k, a] = [rng.int(1, 12), rng.nonZero(-9, 9), rng.int(2, 5)];
      if (!hard)
        return ask(
          rng,
          `The graph of $y = ${a}x^2$ is shifted right $${h}$ units. What is the equation of the new graph?`,
          `$y = ${a}x^2$ 的图像向右平移 $${h}$ 个单位。新图像的方程是什么？`,
          `y = ${a}(x - ${h})^2`,
          [`y = ${a}(x + ${h})^2`, `y = ${a}x^2 + ${h}`, `y = ${a}x^2 - ${h}`, `y = ${a}(x - ${h + 1})^2`],
          `Moving right by $${h}$ replaces $x$ with $x - ${h}$.`,
          `向右移 $${h}$ 就是把 $x$ 换成 $x - ${h}$。`,
          curvePlot((x) => a * x * x, [-5, 5], [-5, 50]),
        );
      return ask(
        rng,
        `The graph of $y = (x - ${h})^2 ${sg(k)}$ is reflected across the $x$-axis. What is the vertex of the new graph?`,
        `$y = (x - ${h})^2 ${sg(k)}$ 的图像关于 $x$ 轴翻折。新图像的顶点是什么？`,
        `(${h}, ${-k})`,
        [`(${h}, ${k})`, `(${-h}, ${k})`, `(${-h}, ${-k})`, `(${k}, ${h})`],
        `Reflecting across the $x$-axis negates the $y$-coordinate only.`,
        `关于 $x$ 轴翻折只改变 $y$ 坐标的符号。`,
        curvePlot((x) => (x - h) ** 2 + k, [h - 5, h + 5], [k - 5, k + 25]),
      );
    },
  ),
  spec("Matching a Graph to an Equation", "匹配图像与方程", ["graphs-of-general-quadratic-functions"], (rng, hard) => {
    const [r, s, h, k] = [rng.int(1, 6), rng.int(1, 6), rng.int(-5, 5), rng.int(1, 12)];
    const up = (x: number) => (x + r) * (x - s);
    const figA = curveFigure(
      up,
      { x: [-8, 8], y: [-20, 20], dx: 2, dy: 5 },
      t("A parabola on a coordinate grid.", "坐标网格上的一条抛物线。"),
    );
    const down = (x: number) => -(x - h) * (x - h) + k;
    const figB = curveFigure(
      down,
      { x: [-10, 10], y: [-16, 16], dx: 2, dy: 4 },
      t("A parabola on a coordinate grid.", "坐标网格上的一条抛物线。"),
    );
    if (!hard)
      return ask(
        rng,
        `Which equation could represent the parabola shown?`,
        `哪个方程可以表示所示的抛物线？`,
        `y = (x + ${r})(x - ${s})`,
        [`y = (x - ${r})(x + ${s})`, `y = -(x + ${r})(x - ${s})`, `y = (x + ${r})(x + ${s})`, `y = (x - ${r})(x - ${s})`],
        `The graph opens up and crosses the $x$-axis at $${-r}$ and $${s}$.`,
        `图像开口向上，与 $x$ 轴交于 $${-r}$ 和 $${s}$。`,
        figA,
      );
    return ask(
      rng,
      `Which equation could represent the parabola shown?`,
      `哪个方程可以表示所示的抛物线？`,
      `y = -(x ${h === 0 ? "" : sg(-h)})^2 + ${k}`,
      [
        `y = (x ${h === 0 ? "" : sg(-h)})^2 + ${k}`,
        `y = -(x ${h === 0 ? "+ 1" : sg(h)})^2 + ${k + (h === 0 ? 1 : 0)}`,
        `y = -(x ${h === 0 ? "" : sg(-h)})^2 - ${k}`,
        `y = (x ${h === 0 ? "+ 1" : sg(h)})^2 - ${k}`,
      ],
      `The graph opens down, and its vertex is $(${h}, ${k})$.`,
      `图像开口向下，顶点是 $(${h}, ${k})$。`,
      figB,
    );
  }),
  spec("Interpreting Piecewise Graphs", "解释分段函数图像", ["piecewise-functions"], (rng, hard) => {
    const [c, p, q] = [rng.int(-2, 3), rng.int(-3, 4), rng.int(-4, 6)];
    const x0 = c - rng.int(1, 4);
    const fig = curveFigure(
      (x) => (Math.abs(x - c) < 0.08 ? Number.NaN : x < c ? x + p : q),
      { x: [-8, 8], y: [-12, 12], dx: 1, dy: 1 },
      t("A graph made of two pieces on a coordinate grid.", "坐标网格上由两段组成的图象。"),
    );
    if (!hard)
      return ask(
        rng,
        `The graph of a piecewise function $f$ is shown. What is $f(${x0})$?`,
        `图中是分段函数 $f$ 的图像。$f(${x0})$ 是多少？`,
        x0 + p,
        [q === x0 + p ? q + 2 : q, x0 + p + 1, x0, x0 + p - 1],
        `At $x = ${x0}$, read the height of the slanted piece.`,
        `在 $x = ${x0}$ 处，读斜线段的高度。`,
        fig,
      );
    return ask(
      rng,
      `The graph of a piecewise function $f$ is shown. On which interval is $f$ constant?`,
      `图中是分段函数 $f$ 的图像。$f$ 在哪个区间上是常数？`,
      `x > ${c}`,
      [`x < ${c}`, `x > ${c + 1 === q ? c + 2 : q === c ? c + 1 : q}`, `x < ${q === c ? c + 1 : q}`, `\\text{all real numbers}`],
      `The horizontal piece lies to the right of $x = ${c}$.`,
      `水平部分在 $x = ${c}$ 的右侧。`,
      fig,
    );
  }),
  spec("Working With Arithmetic Sequences", "等差数列", ["arithmetic-sequences"], (rng, hard) => {
    const [a, d, n, k] = [rng.int(-9, 20), rng.int(2, 12), rng.int(3, 9), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `What is the next term of the arithmetic sequence $${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, \\ldots$?`,
        `等差数列 $${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, \\ldots$ 的下一项是什么？`,
        a + 4 * d,
        [a + 3 * d + 1, a + 5 * d, a + 3 * d + 2 * d, 2 * (a + 3 * d)],
        `The common difference is $${d}$.`,
        `公差是 $${d}$。`,
      );
    return ask(
      rng,
      `In an arithmetic sequence, the ${ordinal(n)} term is $${a + (n - 1) * d}$ and the ${ordinal(n + k)} term is $${a + (n + k - 1) * d}$. What is the common difference?`,
      `等差数列第 $${n}$ 项是 $${a + (n - 1) * d}$，第 $${n + k}$ 项是 $${a + (n + k - 1) * d}$。公差是多少？`,
      d,
      [k * d, d + 1, k, Q.of(a + (n + k - 1) * d, n + k)],
      `The terms are $${k}$ places apart and differ by $${k * d}$.`,
      `两项相隔 $${k}$ 个位置，相差 $${k * d}$。`,
    );
  }),
  spec("Finding a Term of a Geometric Sequence", "求等比数列的项", ["nth-term-of-a-geometric-sequence"], (rng, hard) => {
    const [a, r, n] = [rng.int(1, 9), rng.int(2, 5), rng.int(4, 6)];
    if (!hard)
      return ask(
        rng,
        `What is the next term of the geometric sequence $${a}, ${a * r}, ${a * r * r}, \\ldots$?`,
        `等比数列 $${a}, ${a * r}, ${a * r * r}, \\ldots$ 的下一项是什么？`,
        a * r ** 3,
        [a * r * r + a * r, a * r * r + r, a * r ** 4, a * r * r * 2 === a * r ** 3 ? a * r ** 3 + 1 : a * r * r * 2],
        `Multiply by the common ratio $${r}$.`,
        `乘公比 $${r}$。`,
      );
    return ask(
      rng,
      `A geometric sequence has first term $${a}$ and common ratio $${r}$. What is its ${ordinal(n)} term?`,
      `等比数列首项为 $${a}$，公比为 $${r}$。第 $${n}$ 项是多少？`,
      a * r ** (n - 1),
      [a * r ** n, (a * r) ** (n - 1), a + (n - 1) * r, a * r * (n - 1)],
      `$${a}(${r})^{${n - 1}} = ${a * r ** (n - 1)}$.`,
      `$${a}(${r})^{${n - 1}} = ${a * r ** (n - 1)}$。`,
    );
  }),
  spec("Writing an Explicit Formula for a Sequence", "写数列的通项公式", ["nth-term-of-an-arithmetic-sequence"], (rng, hard) => {
    const [a, d, r] = [rng.int(1, 20), rng.int(2, 12), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `Which formula gives the $n$th term of $${a}, ${a + d}, ${a + 2 * d}, \\ldots$?`,
        `哪个公式给出 $${a}, ${a + d}, ${a + 2 * d}, \\ldots$ 的第 $n$ 项？`,
        `a_n = ${a} + ${d}(n - 1)`,
        [`a_n = ${a} + ${d}n`, `a_n = ${d} + ${a}(n - 1)`, `a_n = ${a}(${d})^{n - 1}`, `a_n = ${a + d}n`],
        `Start at $${a}$ and add $${d}$ a total of $n - 1$ times.`,
        `从 $${a}$ 开始，加 $${d}$ 共 $n - 1$ 次。`,
      );
    return ask(
      rng,
      `Which formula gives the $n$th term of $${a}, ${a * r}, ${a * r * r}, \\ldots$?`,
      `哪个公式给出 $${a}, ${a * r}, ${a * r * r}, \\ldots$ 的第 $n$ 项？`,
      `a_n = ${a}(${r})^{n - 1}`,
      [`a_n = ${a}(${r})^{n}`, `a_n = ${r}(${a})^{n - 1}`, `a_n = ${a} + ${r}(n - 1)`, `a_n = ${a * r}^{n - 1}`],
      `Start at $${a}$ and multiply by $${r}$ a total of $n - 1$ times.`,
      `从 $${a}$ 开始，乘 $${r}$ 共 $n - 1$ 次。`,
    );
  }),
  spec("Computing Terms of a Recursive Sequence", "计算递推数列的项", ["recursive-sequences"], (rng, hard) => {
    const [a, b, c] = [rng.int(1, 9), rng.int(2, 4), rng.nonZero(-6, 9)];
    const t2 = b * a + c;
    const t3 = b * t2 + c;
    const t4 = b * t3 + c;
    if (!hard)
      return ask(
        rng,
        `A sequence has $a_1 = ${a}$ and $a_{n+1} = ${b}a_n ${sg(c)}$. What is $a_3$?`,
        `数列满足 $a_1 = ${a}$，$a_{n+1} = ${b}a_n ${sg(c)}$。$a_3$ 是多少？`,
        t3,
        [t2, t4, b * b * a, t3 + c],
        `$a_2 = ${t2}$, and then $a_3 = ${b}(${t2}) ${sg(c)} = ${t3}$.`,
        `$a_2 = ${t2}$，于是 $a_3 = ${b}(${t2}) ${sg(c)} = ${t3}$。`,
      );
    return ask(
      rng,
      `A sequence has $a_1 = ${a}$, $a_2 = ${a + b}$ and $a_{n+2} = a_{n+1} + a_n$. What is $a_5$?`,
      `数列满足 $a_1 = ${a}$，$a_2 = ${a + b}$，$a_{n+2} = a_{n+1} + a_n$。$a_5$ 是多少？`,
      5 * a + 3 * b,
      [3 * a + 2 * b, 2 * a + b, 8 * a + 5 * b, 5 * a + 3 * b + 1],
      `The terms continue $a_3 = ${2 * a + b}$, $a_4 = ${3 * a + 2 * b}$ and $a_5 = ${5 * a + 3 * b}$.`,
      `依次得 $a_3 = ${2 * a + b}$，$a_4 = ${3 * a + 2 * b}$，$a_5 = ${5 * a + 3 * b}$。`,
    );
  }),
  spec("Summing an Arithmetic Series", "求等差数列的和", ["finding-the-sum-of-an-arithmetic-series"], (rng, hard) => {
    const [a, d, n] = [rng.int(1, 15), rng.int(2, 9), rng.int(4, 20)];
    const last = a + (n - 1) * d;
    const sum = (n * (a + last)) / 2;
    if (!hard)
      return ask(
        rng,
        `What is the sum of the first $${n}$ terms of an arithmetic sequence with first term $${a}$ and last term $${last}$?`,
        `首项为 $${a}$、末项为 $${last}$ 的等差数列，前 $${n}$ 项和是多少？`,
        sum,
        [n * last, n * a, a + last, sum + n],
        `$\\frac{${n}(${a} + ${last})}{2} = ${sum}$.`,
        `$\\frac{${n}(${a} + ${last})}{2} = ${sum}$。`,
      );
    return ask(
      rng,
      `What is the sum of the first $${n}$ terms of the arithmetic sequence $${a}, ${a + d}, ${a + 2 * d}, \\ldots$?`,
      `等差数列 $${a}, ${a + d}, ${a + 2 * d}, \\ldots$ 的前 $${n}$ 项和是多少？`,
      sum,
      [n * last, n * (a + d), sum + last, sum - a],
      `The last term is $${last}$, so the sum is $\\frac{${n}(${a} + ${last})}{2}$.`,
      `末项是 $${last}$，所以和为 $\\frac{${n}(${a} + ${last})}{2}$。`,
    );
  }),
  spec("Summing Geometric and Other Series", "求等比数列及其他数列的和", ["the-sum-of-a-finite-geometric-series"], (rng, hard) => {
    const [a, r, n] = [rng.int(1, 9), rng.int(2, 3), rng.int(3, 6)];
    const sum = (a * (r ** n - 1)) / (r - 1);
    const m = rng.int(3, 12);
    if (!hard)
      return ask(
        rng,
        `What is the sum of the first $${n}$ terms of the geometric sequence with first term $${a}$ and common ratio $${r}$?`,
        `首项为 $${a}$、公比为 $${r}$ 的等比数列，前 $${n}$ 项和是多少？`,
        sum,
        [a * r ** (n - 1), a * r ** n, n * a * r, sum + a],
        `Add the terms, or use $\\frac{${a}(${r}^{${n}} - 1)}{${r} - 1}$.`,
        `逐项相加，或用 $\\frac{${a}(${r}^{${n}} - 1)}{${r} - 1}$。`,
      );
    return ask(
      rng,
      `What is the value of $\\sum_{k=1}^{${m}} (${r}k + ${a})$?`,
      `$\\sum_{k=1}^{${m}} (${r}k + ${a})$ 的值是多少？`,
      (r * m * (m + 1)) / 2 + a * m,
      [(r * m * (m + 1)) / 2, (r * m * (m + 1)) / 2 + a, r * m + a, (r * m * (m + 1)) / 2 + a * m + r],
      `$${r}\\left(\\frac{${m}(${m + 1})}{2}\\right) + ${a}(${m})$.`,
      `$${r}\\left(\\frac{${m}(${m + 1})}{2}\\right) + ${a}(${m})$。`,
    );
  }),
  spec("Converting Angle Measures", "换算角度", ["introduction-to-radians"], (rng, hard) => {
    const [d, r] = rng.pick(degRad);
    const k = rng.int(1, 3);
    const others = degRad.filter(([x]) => x !== d).map(([, y]) => y);
    if (!hard)
      return ask(
        rng,
        `What is $${d + 360 * (k - 1)}^\\circ$ in radians, as the equivalent angle between $0$ and $2\\pi$?`,
        `$${d + 360 * (k - 1)}^\\circ$ 换算成 $0$ 到 $2\\pi$ 之间的等价弧度是多少？`,
        r,
        rng.shuffle(others).slice(0, 3),
        `Subtract full turns if needed, then multiply by $\\frac{\\pi}{180}$.`,
        `必要时减去整圈，再乘 $\\frac{\\pi}{180}$。`,
      );
    return ask(
      rng,
      `An angle of $${r}$ radians is increased by $${k * 360}^\\circ$. What is the new measure in degrees?`,
      `$${r}$ 弧度的角增加 $${k * 360}^\\circ$。新角是多少度？`,
      d + k * 360,
      [d, d + k * 180, (k + 1) * d, d + k * 360 + 30],
      `$${r}$ radians is $${d}^\\circ$, and then add $${k * 360}^\\circ$.`,
      `$${r}$ 弧度是 $${d}^\\circ$，再加 $${k * 360}^\\circ$。`,
    );
  }),
  spec("Finding Points in Standard Position", "求标准位置上的点", ["extending-the-pythagorean-identity-to-all-quadrants"], (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const [sx, sy, k] = [rng.pick([-1, 1]), rng.pick([-1, 1]), rng.int(1, 3)];
    const x = sx * p * k;
    const y = sy * q * k;
    if (!hard)
      return ask(
        rng,
        `The terminal side of an angle $\\theta$ in standard position passes through $(${x}, ${y})$. What is $\\cos\\theta$?`,
        `标准位置上的角 $\\theta$ 的终边经过 $(${x}, ${y})$。$\\cos\\theta$ 是多少？`,
        Q.of(sx * p, c),
        [Q.of(-sx * p, c), Q.of(sy * q, c), Q.of(sy * q, sx * p), Q.of(sx * c, p)],
        `The distance from the origin is $${c * k}$, and $\\cos\\theta = \\frac{x}{r}$.`,
        `到原点的距离是 $${c * k}$，$\\cos\\theta = \\frac{x}{r}$。`,
      );
    return ask(
      rng,
      `The terminal side of an angle $\\theta$ in standard position passes through $(${x}, ${y})$. What is $\\tan\\theta$?`,
      `标准位置上的角 $\\theta$ 的终边经过 $(${x}, ${y})$。$\\tan\\theta$ 是多少？`,
      Q.of(sy * q, sx * p),
      [Q.of(sx * p, sy * q), Q.of(-sy * q, sx * p), Q.of(sy * q, c), Q.of(sx * p, c)],
      `$\\tan\\theta = \\frac{y}{x}$.`,
      `$\\tan\\theta = \\frac{y}{x}$。`,
    );
  }),
  spec("Using the Pythagorean Identity", "运用毕达哥拉斯恒等式", ["using-the-pythagorean-identity-in-the-first-quadrant"], (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const [a, b] = [rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $${a}\\sin^2\\theta + ${a}\\cos^2\\theta + ${b}$?`,
        `$${a}\\sin^2\\theta + ${a}\\cos^2\\theta + ${b}$ 的值是多少？`,
        a + b,
        [b, a, 2 * a + b, a * b],
        `Factor out $${a}$, and use $\\sin^2\\theta + \\cos^2\\theta = 1$.`,
        `提出 $${a}$，并用 $\\sin^2\\theta + \\cos^2\\theta = 1$。`,
      );
    return ask(
      rng,
      `If $\\sin^2\\theta = \\frac{${p * p}}{${c * c}}$ and $${a}\\cos^2\\theta = x$, what is the value of $x$?`,
      `若 $\\sin^2\\theta = \\frac{${p * p}}{${c * c}}$，且 $${a}\\cos^2\\theta = x$，$x$ 的值是多少？`,
      Q.of(a * q * q, c * c),
      [Q.of(a * p * p, c * c), Q.of(q * q, c * c), Q.of(a * q, c), a],
      `$\\cos^2\\theta = 1 - \\frac{${p * p}}{${c * c}} = \\frac{${q * q}}{${c * c}}$.`,
      `$\\cos^2\\theta = 1 - \\frac{${p * p}}{${c * c}} = \\frac{${q * q}}{${c * c}}$。`,
    );
  }),
  spec("Finding Cosine From Sine", "由正弦求余弦", ["extending-the-pythagorean-identity-to-all-quadrants"], (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(1, 5);
    if (!hard)
      return ask(
        rng,
        `If $\\sin\\theta = \\frac{${p * k}}{${c * k}}$ and $0 < \\theta < \\frac{\\pi}{2}$, what is $\\cos\\theta$?`,
        `若 $\\sin\\theta = \\frac{${p * k}}{${c * k}}$，且 $0 < \\theta < \\frac{\\pi}{2}$，$\\cos\\theta$ 是多少？`,
        Q.of(q, c),
        [Q.of(-q, c), Q.of(p, q), Q.of(q, p), Q.of(c, q)],
        `Use a right triangle with sides $${p}$, $${q}$ and $${c}$.`,
        `用边长为 $${p}$、$${q}$、$${c}$ 的直角三角形。`,
      );
    return ask(
      rng,
      `If $\\sin\\theta = \\frac{${p * k}}{${c * k}}$ and $\\frac{\\pi}{2} < \\theta < \\pi$, what is $\\cos\\theta$?`,
      `若 $\\sin\\theta = \\frac{${p * k}}{${c * k}}$，且 $\\frac{\\pi}{2} < \\theta < \\pi$，$\\cos\\theta$ 是多少？`,
      Q.of(-q, c),
      [Q.of(q, c), Q.of(-p, c), Q.of(-p, q), Q.of(-c, q)],
      `The size is $\\frac{${q}}{${c}}$, and cosine is negative in the second quadrant.`,
      `大小为 $\\frac{${q}}{${c}}$，第二象限余弦为负。`,
    );
  }),
  spec(
    "Applying Quotient and Angle Identities",
    "应用商数恒等式和角恒等式",
    ["simplifying-expressions-using-basic-trigonometric-identities"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(2, 5);
      if (!hard)
        return ask(
          rng,
          `If $\\sin\\theta = \\frac{${p}}{${c}}$ and $\\cos\\theta = \\frac{${q}}{${c}}$, and $k = ${k}$, what is $k\\tan\\theta$?`,
          `若 $\\sin\\theta = \\frac{${p}}{${c}}$，$\\cos\\theta = \\frac{${q}}{${c}}$，$k = ${k}$，$k\\tan\\theta$ 是多少？`,
          Q.of(k * p, q),
          [Q.of(k * q, p), Q.of(k * p, c), Q.of(k * q, c), Q.of(k * p + 1, q)],
          `$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{${p}}{${q}}$.`,
          `$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{${p}}{${q}}$。`,
        );
      return ask(
        rng,
        `If $\\sin\\theta = \\frac{${p * k}}{${c * k}}$ and $\\cos\\theta = \\frac{${q * k}}{${c * k}}$, what is $\\sin(2\\theta)$?`,
        `若 $\\sin\\theta = \\frac{${p * k}}{${c * k}}$，$\\cos\\theta = \\frac{${q * k}}{${c * k}}$，$\\sin(2\\theta)$ 是多少？`,
        Q.of(2 * p * q, c * c),
        [Q.of(2 * p, c), Q.of(p * q, c * c), Q.of(q * q - p * p, c * c), Q.of(2 * q, c)],
        `$\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$.`,
        `$\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$。`,
      );
    },
  ),
  spec(
    "Identifying Equivalent Trig Representations",
    "判断等价的三角表示",
    ["simplifying-trigonometric-expressions-using-cofunction-identities"],
    (rng, hard) => {
      const a0 = rng.int(5, 85);
      // At 45 degrees the sine and cosine coincide, so two options would be correct.
      const a = a0 === 45 ? 40 : a0;
      const k = rng.int(1, 3);
      if (!hard)
        return ask(
          rng,
          `Which expression is equal to $\\sin ${a}^\\circ$?`,
          `哪个式子等于 $\\sin ${a}^\\circ$？`,
          `\\cos ${90 - a}^\\circ`,
          [`\\cos ${a}^\\circ`, `\\sin ${90 - a}^\\circ`, `\\cos ${180 - a}^\\circ`, `-\\cos ${90 - a}^\\circ`],
          `Sine and cosine of complementary angles are equal.`,
          `互余角的正弦与余弦相等。`,
        );
      return ask(
        rng,
        `Which expression is equal to $\\cos(${a}^\\circ + ${k * 360}^\\circ)$?`,
        `哪个式子等于 $\\cos(${a}^\\circ + ${k * 360}^\\circ)$？`,
        `\\cos ${a}^\\circ`,
        [`-\\cos ${a}^\\circ`, `\\sin ${a}^\\circ`, `\\cos ${a + 180}^\\circ`, `${k + 1}\\cos ${a}^\\circ`],
        `Adding full turns does not change the value of cosine.`,
        `加整圈不改变余弦的值。`,
      );
    },
  ),
  spec(
    "Finding Amplitude, Period, and Range",
    "求振幅、周期和值域",
    ["properties-of-transformed-sine-and-cosine-functions"],
    (rng, hard) => {
      const [a, b, d] = [rng.int(2, 9), rng.int(2, 6), rng.nonZero(-9, 9)];
      if (!hard)
        return ask(
          rng,
          `What is the period of $y = ${a}\\sin(${b}x) ${sg(d)}$?`,
          `$y = ${a}\\sin(${b}x) ${sg(d)}$ 的周期是多少？`,
          `\\frac{2\\pi}{${b}}`,
          [`${b}\\pi`, `${2 * b}\\pi`, `\\frac{\\pi}{${b}}`, `\\frac{2\\pi}{${a}}`],
          `The period is $\\frac{2\\pi}{${b}}$; the amplitude and shift do not affect it.`,
          `周期是 $\\frac{2\\pi}{${b}}$，振幅和平移不影响它。`,
        );
      return ask(
        rng,
        `What is the range of $y = ${a}\\cos(${b}x) ${sg(d)}$?`,
        `$y = ${a}\\cos(${b}x) ${sg(d)}$ 的值域是什么？`,
        `${d - a} \\le y \\le ${d + a}`,
        [
          `${-a} \\le y \\le ${a}`,
          `${d - b} \\le y \\le ${d + b}`,
          `${d - 1} \\le y \\le ${d + 1}`,
          `${d - a - 1} \\le y \\le ${d + a + 1}`,
        ],
        `The center is $${d}$, and the graph reaches $${a}$ above and below it.`,
        `中心是 $${d}$，图像在其上下各达 $${a}$。`,
      );
    },
  ),
  spec(
    "Matching and Transforming Trig Graphs",
    "匹配和变换三角函数图像",
    ["combining-graph-transformations-of-sine-and-cosine"],
    (rng, hard) => {
      const [a, d, b] = [rng.int(1, 6), rng.int(-4, 4), rng.pick([1, 2, 3])];
      const fig = curveFigure(
        (x) => a * Math.sin(b * x) + d,
        { x: [-7, 7], y: [-11, 11], dx: 1, dy: 1 },
        t("A wave on a coordinate grid.", "坐标网格上的一条波形曲线。"),
      );
      const shift = d === 0 ? "" : ` ${sg(d)}`;
      const lead = a === 1 ? "" : `${a}`;
      if (!hard)
        return ask(
          rng,
          `The graph shows a function of the form $y = A\\sin(Bx) + D$. What is its amplitude?`,
          `图中是形如 $y = A\\sin(Bx) + D$ 的函数。它的振幅是多少？`,
          a,
          [2 * a, a + 1, a + 2, d === a ? a + 3 : d],
          `The amplitude is the distance from the center line to a peak.`,
          `振幅是中心线到波峰的距离。`,
          fig,
        );
      return ask(
        rng,
        `Which equation could represent the graph shown?`,
        `哪个方程可以表示所示的图像？`,
        `y = ${lead}\\sin(${b === 1 ? "" : b}x)${shift}`,
        [
          `y = ${lead}\\cos(${b === 1 ? "" : b}x)${shift}`,
          `y = ${a + 1}\\sin(${b === 1 ? "" : b}x)${shift}`,
          `y = ${lead}\\sin(${b + 1}x)${shift}`,
          `y = -${lead}\\sin(${b === 1 ? "" : b}x)${shift}`,
        ],
        `Read the center, the height of a peak and the number of cycles in $2\\pi$.`,
        `读出中心线、波峰高度和 $2\\pi$ 内的周期数。`,
        fig,
      );
    },
  ),
  spec("Finding Triangle Area Using Sine", "用正弦求三角形面积", ["the-area-of-a-general-triangle"], (rng, hard) => {
    const [a, b, n] = [rng.int(1, 8) * 4, rng.int(2, 15), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `A triangle has sides of length $${a}$ and $${b}$ with a $30^\\circ$ angle between them. What is its area?`,
        `三角形两边长为 $${a}$ 和 $${b}$，夹角为 $30^\\circ$。面积是多少？`,
        (a * b) / 4,
        [(a * b) / 2, a * b, a + b, (a * b) / 4 + 1],
        `$\\frac{1}{2}(${a})(${b})\\sin 30^\\circ = \\frac{1}{2}(${a})(${b})\\left(\\frac{1}{2}\\right)$.`,
        `$\\frac{1}{2}(${a})(${b})\\sin 30^\\circ = \\frac{1}{2}(${a})(${b})\\left(\\frac{1}{2}\\right)$。`,
        polyFigure(sasPts(a, b, 30), { a: ["30°", null, null], s: [`${a}`, null, `${b}`] }),
      );
    return ask(
      rng,
      `A triangle has sides of length $${a}$ and $${b}$, and the sine of the angle between them is $\\frac{${n}}{10}$. What is its area?`,
      `三角形两边长为 $${a}$ 和 $${b}$，夹角的正弦是 $\\frac{${n}}{10}$。面积是多少？`,
      Q.of(a * b * n, 20),
      [Q.of(a * b * n, 10), Q.of(a * b, 2), Q.of((a + b) * n, 20), Q.of(a * b * n, 40)],
      `$\\frac{1}{2}(${a})(${b})\\left(\\frac{${n}}{10}\\right)$.`,
      `$\\frac{1}{2}(${a})(${b})\\left(\\frac{${n}}{10}\\right)$。`,
      polyFigure(sasPts(a, b, 55), { a: ["θ", null, null], s: [`${a}`, null, `${b}`] }),
    );
  }),
  spec("Using the Law of Sines", "运用正弦定理", ["the-law-of-sines"], (rng, hard) => {
    const [a, A, C, u] = [rng.int(5, 30), rng.int(20, 70), rng.int(20, 70), rng.int(1, 8)];
    const C2 = A === C ? C + 5 : C;
    if (!hard)
      return ask(
        rng,
        `In triangle $ABC$, $a$ is the side opposite $\\angle A$ and $c$ is the side opposite $\\angle C$. If $a = ${a}$, $\\angle A = ${A}^\\circ$ and $\\angle C = ${C2}^\\circ$, which expression gives $c$?`,
        `在三角形 $ABC$ 中，$a$ 是 $\\angle A$ 的对边，$c$ 是 $\\angle C$ 的对边。若 $a = ${a}$，$\\angle A = ${A}^\\circ$，$\\angle C = ${C2}^\\circ$，哪个式子给出 $c$？`,
        `\\frac{${a}\\sin ${C2}^\\circ}{\\sin ${A}^\\circ}`,
        [
          `\\frac{${a}\\sin ${A}^\\circ}{\\sin ${C2}^\\circ}`,
          `\\frac{\\sin ${C2}^\\circ}{${a}\\sin ${A}^\\circ}`,
          `${a}\\sin ${C2}^\\circ\\sin ${A}^\\circ`,
          `\\frac{${a}\\cos ${C2}^\\circ}{\\cos ${A}^\\circ}`,
        ],
        `$\\frac{c}{\\sin C} = \\frac{a}{\\sin A}$.`,
        `$\\frac{c}{\\sin C} = \\frac{a}{\\sin A}$。`,
      );
    return ask(
      rng,
      `In triangle $ABC$, $\\sin A = \\frac{${u}}{10}$, $\\sin B = \\frac{${u + 1}}{10}$ and side $a$, opposite $\\angle A$, is $${a * u}$. What is side $b$, opposite $\\angle B$?`,
      `在三角形 $ABC$ 中，$\\sin A = \\frac{${u}}{10}$，$\\sin B = \\frac{${u + 1}}{10}$，$\\angle A$ 的对边 $a = ${a * u}$。$\\angle B$ 的对边 $b$ 是多少？`,
      a * (u + 1),
      [a * u + 1, Q.of(a * u * u, u + 1), a * u, a * (u + 2)],
      `$b = a\\cdot\\frac{\\sin B}{\\sin A} = ${a * u}\\cdot\\frac{${u + 1}}{${u}}$.`,
      `$b = a\\cdot\\frac{\\sin B}{\\sin A} = ${a * u}\\cdot\\frac{${u + 1}}{${u}}$。`,
    );
  }),
  spec("Using the Law of Cosines", "运用余弦定理", ["the-law-of-cosines"], (rng, hard) => {
    const [a, b, C] = [rng.int(3, 15), rng.int(3, 15), rng.pick([40, 50, 70, 80, 100, 110])];
    if (!hard)
      return ask(
        rng,
        `In a triangle, two sides have lengths $${a}$ and $${b}$, and the angle between them is $${C}^\\circ$. Which expression gives the square of the third side?`,
        `三角形两边长为 $${a}$ 和 $${b}$，夹角为 $${C}^\\circ$。哪个式子给出第三边的平方？`,
        `${a * a} + ${b * b} - ${2 * a * b}\\cos ${C}^\\circ`,
        [
          `${a * a} + ${b * b} + ${2 * a * b}\\cos ${C}^\\circ`,
          `${a * a} + ${b * b} - ${a * b}\\cos ${C}^\\circ`,
          `${a * a} + ${b * b} - ${2 * a * b}\\sin ${C}^\\circ`,
          `${a * a} + ${b * b}`,
        ],
        `$c^2 = a^2 + b^2 - 2ab\\cos C$.`,
        `$c^2 = a^2 + b^2 - 2ab\\cos C$。`,
      );
    return ask(
      rng,
      `In a triangle, two sides have lengths $${a}$ and $${b}$, and the cosine of the angle between them is $\\frac{1}{2}$. What is the square of the third side?`,
      `三角形两边长为 $${a}$ 和 $${b}$，夹角的余弦是 $\\frac{1}{2}$。第三边的平方是多少？`,
      a * a + b * b - a * b,
      [a * a + b * b + a * b, a * a + b * b, a * a + b * b - 2 * a * b, a * a + b * b - a * b + 1],
      `$${a * a} + ${b * b} - 2(${a})(${b})\\left(\\frac{1}{2}\\right)$.`,
      `$${a * a} + ${b * b} - 2(${a})(${b})\\left(\\frac{1}{2}\\right)$。`,
    );
  }),
  spec(
    "Solving Trig Equations and Inequalities",
    "解三角方程和不等式",
    ["elementary-trigonometric-equations-containing-sine"],
    (rng, hard) => {
      const [a, b] = [rng.int(2, 9), rng.int(1, 15)];
      const v = rng.pick(["x", "\\theta", "t"]);
      if (!hard)
        return ask(
          rng,
          `What is the solution of $${2 * a}\\sin ${v} + ${b} = ${a + b}$ for $0^\\circ < ${v} < 90^\\circ$?`,
          `$${2 * a}\\sin ${v} + ${b} = ${a + b}$ 在 $0^\\circ < ${v} < 90^\\circ$ 内的解是什么？`,
          `${v} = 30^\\circ`,
          [`${v} = 60^\\circ`, `${v} = 45^\\circ`, `${v} = 15^\\circ`, `${v} = 75^\\circ`],
          `The equation reduces to $\\sin ${v} = \\frac{1}{2}$.`,
          `方程化为 $\\sin ${v} = \\frac{1}{2}$。`,
        );
      return ask(
        rng,
        `How many solutions does $${2 * a}\\sin ${v} + ${b} = ${a + b}$ have for $0^\\circ \\le ${v} < 360^\\circ$?`,
        `$${2 * a}\\sin ${v} + ${b} = ${a + b}$ 在 $0^\\circ \\le ${v} < 360^\\circ$ 内有多少个解？`,
        2,
        [0, 1, 4],
        `$\\sin ${v} = \\frac{1}{2}$ at $30^\\circ$ and $150^\\circ$.`,
        `$\\sin ${v} = \\frac{1}{2}$ 在 $30^\\circ$ 和 $150^\\circ$ 处成立。`,
      );
    },
  ),
];
