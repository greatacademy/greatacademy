import { t } from "@ga/content";

import type { ExamSpec } from "../exam.ts";
import { ask, cx, sg, tx, words } from "../exam.ts";
import { regionFigure } from "../exam-figures.ts";

// ACT Math Prep, questions of its own for the topics it shares with SAT Math Prep: expressions, linear equations, inequalities and systems.

const lin = (a: number, b: number): string => `${cx(a)} ${sg(b)}`.trim();
const quad = (a: number, b: number, c: number): string => `${cx(a, "x^2")} ${tx(b)} ${sg(c)}`.trim();

/** actOwnAlgebra1 are the question generators of ACT topics on expressions, linear equations, inequalities and systems, by title. */
export const actOwnAlgebra1: Record<string, ExamSpec["make"]> = {
  "Combining Like Terms": (rng, hard) => {
    const [a, b, c, d] = [rng.int(5, 12), rng.int(2, 9), rng.int(1, 4), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `For all real numbers $x$, the expression $(${quad(a, b, 0)}) - (${quad(c, -d, 0)})$ is equivalent to which of the following?`,
        `对所有实数 $x$，式子 $(${quad(a, b, 0)}) - (${quad(c, -d, 0)})$ 与下列哪一项等价？`,
        quad(a - c, b + d, 0),
        [quad(a - c, b - d, 0), quad(a + c, b + d, 0), quad(a - c, -b - d, 0)],
        `Subtracting changes the sign of each term in the second group, so $-(-${d}x)$ becomes $+${d}x$. That gives $${quad(a - c, b + d, 0)}$.`,
        `减号使第二组每一项变号，所以 $-(-${d}x)$ 变为 $+${d}x$，结果是 $${quad(a - c, b + d, 0)}$。`,
      );
    const [e, f] = [rng.int(2, 7), rng.int(1, 9)];
    return ask(
      rng,
      `The sides of a triangle have lengths $${lin(a, b)}$, $${lin(c + 1, -d)}$ and $${lin(e, f)}$ inches. Which expression gives the perimeter, in inches?`,
      `一个三角形三边长为 $${lin(a, b)}$、$${lin(c + 1, -d)}$ 和 $${lin(e, f)}$ 英寸。哪个式子表示其周长（英寸）？`,
      lin(a + c + 1 + e, b - d + f),
      [lin(a + c + 1 + e, b + d + f), lin(a + c + e, b - d + f), lin(a + c + 1 + e, b - d - f)],
      `Add the $x$ terms and the constants separately: $${a} + ${c + 1} + ${e} = ${a + c + 1 + e}$, and $${b} - ${d} + ${f} = ${b - d + f}$.`,
      `分别把 $x$ 项和常数相加：$${a} + ${c + 1} + ${e} = ${a + c + 1 + e}$，$${b} - ${d} + ${f} = ${b - d + f}$。`,
    );
  },
  "Distributing Over Binomials": (rng, hard) => {
    const [a, b, c, d, e] = [rng.int(2, 9), rng.int(2, 9), rng.int(1, 9), rng.int(2, 6), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `Which expression is equivalent to $${a}(${lin(b, -c)}) - ${d}(x + ${e})$ for all real $x$?`,
        `对所有实数 $x$，哪个式子与 $${a}(${lin(b, -c)}) - ${d}(x + ${e})$ 等价？`,
        lin(a * b - d, -a * c - d * e),
        [lin(a * b - d, -a * c + d * e), lin(a * b + d, -a * c - d * e), lin(a * b, -a * c - d * e)],
        `Distribute both factors, keeping the minus sign on both terms of the second: $${a * b}x - ${a * c} - ${d}x - ${d * e}$, which is $${lin(a * b - d, -a * c - d * e)}$.`,
        `两个因数都要分配，第二项的负号作用于其中两项：$${a * b}x - ${a * c} - ${d}x - ${d * e}$，即 $${lin(a * b - d, -a * c - d * e)}$。`,
      );
    return ask(
      rng,
      `When $${a}(x - ${c}) + ${d}(${b}x + ${e})$ is simplified, what is the constant term?`,
      `化简 $${a}(x - ${c}) + ${d}(${b}x + ${e})$ 后，常数项是多少？`,
      d * e - a * c,
      [d * e + a * c, e - c, a * d - c * e],
      `The constants are $${a}(-${c}) = ${-a * c}$ and $${d}(${e}) = ${d * e}$, and they add to $${d * e - a * c}$.`,
      `常数项来自 $${a}(-${c}) = ${-a * c}$ 和 $${d}(${e}) = ${d * e}$，相加得 $${d * e - a * c}$。`,
    );
  },
  "Expanding Products of Binomials": (rng, hard) => {
    const a = rng.int(2, 12);
    const b = a + rng.int(1, 6);
    if (!hard)
      return ask(
        rng,
        `Which of the following is equivalent to $(x + ${a})(x - ${b})$?`,
        `下列哪一项与 $(x + ${a})(x - ${b})$ 等价？`,
        quad(1, a - b, -a * b),
        [quad(1, b - a, -a * b), quad(1, a - b, a * b), quad(1, 0, -a * b)],
        `Multiply each term by each term: $x^2 - ${b}x + ${a}x - ${a * b}$. The middle terms combine to $${cx(a - b)}$.`,
        `逐项相乘：$x^2 - ${b}x + ${a}x - ${a * b}$，中间两项合并为 $${cx(a - b)}$。`,
      );
    const [c, d] = [rng.int(2, 7), rng.int(2, 7)];
    return ask(
      rng,
      `When $(${c}x + ${a})(${d}x - ${b})$ is multiplied out and like terms are combined, what is the coefficient of $x$?`,
      `展开 $(${c}x + ${a})(${d}x - ${b})$ 并合并同类项后，$x$ 的系数是多少？`,
      a * d - b * c,
      [a * d + b * c, a - b, c * d],
      `The $x$ terms come from the outer and inner products: $-${b * c}x$ and $${a * d}x$, which add to $${a * d - b * c}x$.`,
      `$x$ 项来自外项积和内项积：$-${b * c}x$ 和 $${a * d}x$，相加得 $${a * d - b * c}x$。`,
    );
  },
  "Factoring Algebraic Expressions": (rng, hard) => {
    const [g, m, n] = [rng.int(2, 9), rng.int(2, 7), rng.pick([3, 5, 7, 11, 13])];
    if (!hard)
      return ask(
        rng,
        `Which of the following is a factored form of $${g * m}x^2 - ${g * n}x$?`,
        `下列哪一项是 $${g * m}x^2 - ${g * n}x$ 的因式分解？`,
        `${g}x(${m}x - ${n})`,
        [`${g}x(${m}x + ${n})`, `${g}(${m}x - ${n})`, `${g}x(${m}x^2 - ${n}x)`],
        `Both terms contain $${g}x$. Dividing it out leaves $${m}x$ and $-${n}$.`,
        `两项都含 $${g}x$，提出后剩下 $${m}x$ 和 $-${n}$。`,
      );
    return ask(
      rng,
      `The expression $${g * m}x^2y + ${g * n}xy^2$ equals $${g}xy \\cdot Q$. What is $Q$?`,
      `式子 $${g * m}x^2y + ${g * n}xy^2$ 等于 $${g}xy \\cdot Q$。$Q$ 是什么？`,
      `${m}x + ${n}y`,
      [`${m}x^2 + ${n}y^2`, `${m}y + ${n}x`, `${m}x + ${n}`],
      `Divide each term by $${g}xy$: $${g * m}x^2y$ gives $${m}x$ and $${g * n}xy^2$ gives $${n}y$.`,
      `每项除以 $${g}xy$：$${g * m}x^2y$ 得 $${m}x$，$${g * n}xy^2$ 得 $${n}y$。`,
    );
  },
  "Simplifying by Canceling Factors": (rng, hard) => {
    const [a, b, k] = [rng.int(2, 12), rng.int(1, 9), rng.int(1, 12)];
    if (!hard) {
      const m = rng.int(2, 6);
      return ask(
        rng,
        `For $x \\ne ${a}$, the expression $\\frac{${m}x^2 - ${m * a * a}}{x - ${a}}$ simplifies to which of the following?`,
        `当 $x \\ne ${a}$ 时，$\\frac{${m}x^2 - ${m * a * a}}{x - ${a}}$ 化简后是下列哪一项？`,
        `${m}x + ${m * a}`,
        [`${m}x - ${m * a}`, `x + ${m * a}`, `${m}x + ${a}`],
        `Take out the common factor and use the difference of squares: $${m}(x - ${a})(x + ${a})$. The factor $x - ${a}$ cancels and leaves $${m}(x + ${a})$.`,
        `提出公因数并用平方差：$${m}(x - ${a})(x + ${a})$。约去 $x - ${a}$，剩下 $${m}(x + ${a})$。`,
      );
    }
    return ask(
      rng,
      `What is the value of $\\frac{x^2 + ${a + b}x + ${a * b}}{x + ${a}}$ when $x = ${k}$?`,
      `当 $x = ${k}$ 时，$\\frac{x^2 + ${a + b}x + ${a * b}}{x + ${a}}$ 的值是多少？`,
      k + b,
      [k + a, k + a + b, k * b],
      `The numerator factors as $(x + ${a})(x + ${b})$, so the expression equals $x + ${b}$, which is $${k + b}$ at $x = ${k}$.`,
      `分子分解为 $(x + ${a})(x + ${b})$，所以式子等于 $x + ${b}$，当 $x = ${k}$ 时为 $${k + b}$。`,
    );
  },
  "Evaluating Algebraic Expressions": (rng, hard) => {
    const [x, y, a, b] = [-rng.int(2, 7), rng.int(2, 9), rng.int(2, 5), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $${a}x^2 - ${b}y$ when $x = ${x}$ and $y = ${y}$?`,
        `当 $x = ${x}$，$y = ${y}$ 时，$${a}x^2 - ${b}y$ 的值是多少？`,
        a * x * x - b * y,
        [-a * x * x - b * y, a * x * x + b * y, a * 2 * x - b * y],
        `Square first, and the square of a negative is positive: $${a}(${x * x}) - ${b * y} = ${a * x * x - b * y}$.`,
        `先算平方，负数的平方是正数：$${a}(${x * x}) - ${b * y} = ${a * x * x - b * y}$。`,
      );
    const z = rng.int(1, 6);
    return ask(
      rng,
      `If $x = ${x}$, $y = ${y}$ and $z = ${z}$, what is the value of $x(y - z)^2 + yz$?`,
      `若 $x = ${x}$，$y = ${y}$，$z = ${z}$，则 $x(y - z)^2 + yz$ 的值是多少？`,
      x * (y - z) ** 2 + y * z,
      [(x * (y - z)) ** 2 + y * z, x * (y - z) + y * z, x * (y - z) ** 2 - y * z],
      `Work inside the parentheses first: $y - z = ${y - z}$, whose square is $${(y - z) ** 2}$. Then $${x}(${(y - z) ** 2}) + ${y * z} = ${x * (y - z) ** 2 + y * z}$.`,
      `先算括号内：$y - z = ${y - z}$，平方为 $${(y - z) ** 2}$。于是 $${x}(${(y - z) ** 2}) + ${y * z} = ${x * (y - z) ** 2 + y * z}$。`,
    );
  },
  "Solving Linear Equations": (rng, hard) => {
    const [x, c, b] = [rng.int(-9, 12), rng.int(1, 5), rng.int(1, 15)];
    const a = c + rng.int(1, 6);
    const d = (a - c) * x + b;
    if (!hard)
      return ask(
        rng,
        `What value of $x$ satisfies $${a}x ${sg(b)} = ${cx(c)} ${sg(d)}$?`,
        `哪个 $x$ 值满足 $${a}x ${sg(b)} = ${cx(c)} ${sg(d)}$？`,
        x,
        [x + 2, -x + 1, d + b],
        `Collect the $x$ terms on one side and the constants on the other: $${a - c}x = ${d - b}$, so $x = ${x}$.`,
        `把 $x$ 项移到一边、常数移到另一边：$${a - c}x = ${d - b}$，所以 $x = ${x}$。`,
      );
    const k = rng.int(2, 4);
    return ask(
      rng,
      `If $${a}x - ${b} = ${a * x - b}$, what is the value of $${k * a}x + ${c}$?`,
      `若 $${a}x - ${b} = ${a * x - b}$，则 $${k * a}x + ${c}$ 的值是多少？`,
      k * a * x + c,
      [x, a * x + c, k * (a * x - b) + c],
      `Adding $${b}$ gives $${a}x = ${a * x}$. Then $${k * a}x = ${k}(${a * x}) = ${k * a * x}$, and adding $${c}$ gives $${k * a * x + c}$.`,
      `两边加 $${b}$ 得 $${a}x = ${a * x}$。于是 $${k * a}x = ${k}(${a * x}) = ${k * a * x}$，再加 $${c}$ 得 $${k * a * x + c}$。`,
    );
  },
  "Solving Linear Equations With Parentheses": (rng, hard) => {
    const [x, c, k, b] = [rng.int(1, 12), rng.int(2, 5), rng.int(2, 3), rng.int(1, 9)];
    const a = c * k;
    const d = k * (x - b) - x;
    if (!hard)
      return ask(
        rng,
        `What is the solution of the equation $${a}(x - ${b}) = ${c}(x ${sg(d)})$?`,
        `方程 $${a}(x - ${b}) = ${c}(x ${sg(d)})$ 的解是什么？`,
        x,
        [x + 1, x - b, x + b],
        `Distribute: $${a}x - ${a * b} = ${c}x ${sg(c * d)}$. Collecting terms gives $${a - c}x = ${c * d + a * b}$, so $x = ${x}$.`,
        `展开：$${a}x - ${a * b} = ${c}x ${sg(c * d)}$。移项得 $${a - c}x = ${c * d + a * b}$，所以 $x = ${x}$。`,
      );
    const e = c * (2 * x - b) - (x + k);
    return ask(
      rng,
      `If $${c}(2x - ${b}) - (x + ${k}) = ${e}$, what is $x$?`,
      `若 $${c}(2x - ${b}) - (x + ${k}) = ${e}$，$x$ 是多少？`,
      x,
      [x + k, x + 2, x + b],
      `The minus sign applies to both $x$ and $${k}$: $${2 * c}x - ${c * b} - x - ${k} = ${e}$. So $${2 * c - 1}x = ${e + c * b + k}$ and $x = ${x}$.`,
      `负号作用于 $x$ 和 $${k}$：$${2 * c}x - ${c * b} - x - ${k} = ${e}$。于是 $${2 * c - 1}x = ${e + c * b + k}$，$x = ${x}$。`,
    );
  },
  "Solving Literal Equations": (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.pick([2, 3, 5, 7]), rng.int(1, 20)];
    if (!hard)
      return ask(
        rng,
        `If $${a}x - ${b}y = ${c}$, which of the following expresses $y$ in terms of $x$?`,
        `若 $${a}x - ${b}y = ${c}$，下列哪一项用 $x$ 表示 $y$？`,
        `\\frac{${a}x - ${c}}{${b}}`,
        [`\\frac{${c} - ${a}x}{${b}}`, `\\frac{${a}x + ${c}}{${b}}`, `${a}x - ${c + b}`],
        `Subtract $${a}x$ to get $-${b}y = ${c} - ${a}x$, then divide by $-${b}$: $y = \\frac{${a}x - ${c}}{${b}}$.`,
        `减去 $${a}x$ 得 $-${b}y = ${c} - ${a}x$，再除以 $-${b}$：$y = \\frac{${a}x - ${c}}{${b}}$。`,
      );
    return ask(
      rng,
      `A shop's charge, $C$ dollars, for a repair of $h$ hours is $C = ${c} + ${a}h$. Which equation gives $h$ in terms of $C$?`,
      `一家店修理 $h$ 小时收费 $C$ 美元，$C = ${c} + ${a}h$。哪个等式用 $C$ 表示 $h$？`,
      `h = \\frac{C - ${c}}{${a}}`,
      [`h = \\frac{C + ${c}}{${a}}`, `h = \\frac{C}{${a}} - ${c}`, `h = ${a}C - ${c}`],
      `Subtract the fixed charge first, $C - ${c} = ${a}h$, and then divide the whole difference by $${a}$.`,
      `先减去固定收费，$C - ${c} = ${a}h$，再把整个差除以 $${a}$。`,
    );
  },
  "Identifying Characteristics of Linear Equations": (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(1, 40)];
    if (!hard) {
      const kind = rng.int(0, 2);
      const right = kind === 0 ? `${a}x + ${a * b}` : kind === 1 ? `${a}x + ${a * b + c}` : `${a + 1}x + ${a * b}`;
      const none = t("No real solution", "没有实数解");
      const one = t("Exactly 1 real solution", "恰有 1 个实数解");
      const many = t("Infinitely many real solutions", "有无穷多个实数解");
      const two = t("Exactly 2 real solutions", "恰有 2 个实数解");
      const answer = kind === 0 ? many : kind === 1 ? none : one;
      return words(
        rng,
        t(`How many real solutions does $${a}(x + ${b}) = ${right}$ have?`, `$${a}(x + ${b}) = ${right}$ 有多少个实数解？`),
        answer,
        [many, none, one, two].filter((o) => o !== answer),
        t(
          `The left side is $${a}x + ${a * b}$. Compare the two sides: the same $x$ term and constant give every $x$, the same $x$ term alone gives none, and different $x$ terms give one.`,
          `左边是 $${a}x + ${a * b}$。比较两边：$x$ 项和常数都相同时任何 $x$ 都成立，只有 $x$ 项相同时无解，$x$ 项不同时有一个解。`,
        ),
      );
    }
    return ask(
      rng,
      `For what value of $k$ does the equation $kx + ${b} = ${a}x + ${b + c}$ have no solution?`,
      `$k$ 为何值时，方程 $kx + ${b} = ${a}x + ${b + c}$ 无解？`,
      a,
      [c, b, a + b],
      `With equal $x$ coefficients the $x$ terms cancel and leave a false statement, because the constants differ. So $k = ${a}$.`,
      `$x$ 系数相等时 $x$ 项消去，因常数不同而得到矛盾。所以 $k = ${a}$。`,
    );
  },
  "Writing Linear Inequalities": (rng, hard) => {
    const [s, r, g] = [rng.int(50, 200), rng.int(8, 40), rng.int(300, 900)];
    if (!hard)
      return ask(
        rng,
        `Noor has saved $\\$${s}$ and adds $\\$${r}$ each week. Which inequality can be used to find the number of weeks, $w$, until Noor has at least $\\$${g}$?`,
        `Noor 已存 $\\$${s}$，每周再存 $\\$${r}$。哪个不等式可用来求至少存到 $\\$${g}$ 所需的周数 $w$？`,
        `${s} + ${r}w \\ge ${g}`,
        [`${s} + ${r}w \\le ${g}`, `${r} + ${s}w \\ge ${g}`, `${s}w + ${r}w \\ge ${g}`],
        `The savings after $w$ weeks are $${s} + ${r}w$, and "at least" means this is greater than or equal to the goal.`,
        `$w$ 周后的存款为 $${s} + ${r}w$，“至少”表示它大于或等于目标。`,
      );
    const [d, b, p] = [rng.int(140, 220), rng.int(15, 60), rng.int(1000, 3000)];
    return ask(
      rng,
      `An elevator holds at most $${p}$ pounds. A $${d}$-pound operator rides with boxes of $${b}$ pounds each. Which inequality describes the number of boxes, $n$, the elevator can carry?`,
      `一部电梯最多载重 $${p}$ 磅。一名 $${d}$ 磅的操作员与每箱 $${b}$ 磅的箱子同乘。哪个不等式描述电梯能运的箱数 $n$？`,
      `${d} + ${b}n \\le ${p}`,
      [`${d} + ${b}n \\ge ${p}`, `${b} + ${d}n \\le ${p}`, `${d}n + ${b}n \\le ${p}`],
      `The load is the operator plus $${b}n$ pounds of boxes, and "at most" means the load is less than or equal to $${p}$.`,
      `载重是操作员加上 $${b}n$ 磅箱子，“最多”表示载重小于或等于 $${p}$。`,
    );
  },
  "Finding a Threshold From a Linear Inequality": (rng, hard) => {
    const [f, r, n] = [rng.int(15, 60), rng.int(2, 9), rng.int(8, 40)];
    if (!hard) {
      const budget = f + r * n + rng.int(0, r - 1);
      return ask(
        rng,
        `A gym charges a $\\$${f}$ sign-up fee and $\\$${r}$ per visit. What is the greatest number of visits Sam can pay for with $\\$${budget}$?`,
        `一家健身房收 $\\$${f}$ 注册费，每次 $\\$${r}$。Sam 用 $\\$${budget}$ 最多能支付多少次？`,
        n,
        [n + 1, n - 1, Math.floor(budget / r)],
        `Solve $${f} + ${r}v \\le ${budget}$: $v \\le ${budget - f} / ${r}$. Only whole visits count, so round down to $${n}$.`,
        `解 $${f} + ${r}v \\le ${budget}$：$v \\le ${budget - f} / ${r}$。次数必须是整数，向下取整得 $${n}$。`,
      );
    }
    const goal = f + r * n - rng.int(0, r - 1);
    return ask(
      rng,
      `A school club has $\\$${f}$ and sells cards for $\\$${r}$ each. What is the least number of cards it must sell to have at least $\\$${goal}$?`,
      `一个学校社团有 $\\$${f}$，每张卡片卖 $\\$${r}$。要拥有至少 $\\$${goal}$，最少要卖多少张？`,
      n,
      [n + 1, n - 1, Math.ceil(goal / r)],
      `Solve $${f} + ${r}c \\ge ${goal}$: $c \\ge ${goal - f} / ${r}$. Only whole cards can be sold, so round up to $${n}$.`,
      `解 $${f} + ${r}c \\ge ${goal}$：$c \\ge ${goal - f} / ${r}$。卡片数必须是整数，向上取整得 $${n}$。`,
    );
  },
  "Graphing Linear Inequalities": (rng, hard) => {
    const [m, b] = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.int(-5, 6)];
    const above = rng.int(0, 1) === 1;
    const line = lin(m, b);
    if (!hard) {
      const sign = above ? ">" : "<";
      const other = above ? "<" : ">";
      return ask(
        rng,
        `Which inequality is shown by the graph, where the boundary line is dashed and the solutions are shaded?`,
        `图中边界线为虚线，解的区域画有阴影。这是哪个不等式的图象？`,
        `y ${sign} ${line}`,
        [`y ${other} ${line}`, `y ${sign} ${lin(-m, b)}`, `y ${sign} ${lin(m, b === 0 ? 1 : -b)}`],
        `The line has slope $${m}$ and $y$-intercept $${b}$, so it is $y = ${line}$. The shading is ${above ? "above" : "below"} it, and a dashed line means strict inequality.`,
        `直线斜率为 $${m}$，$y$ 轴截距为 $${b}$，即 $y = ${line}$。阴影在其${above ? "上方" : "下方"}，虚线表示严格不等号。`,
        regionFigure(m, b, above),
      );
    }
    const x = rng.int(-3, 3);
    const on = m * x + b;
    const inside = `(${x}, ${above ? on + 2 : on - 2})`;
    return ask(
      rng,
      `The graph shows the solutions of $y ${above ? ">" : "<"} ${line}$. Which point is a solution?`,
      `图中是 $y ${above ? ">" : "<"} ${line}$ 的解。哪个点是解？`,
      inside,
      [`(${x}, ${on})`, `(${x}, ${above ? on - 2 : on + 2})`, `(${x}, ${above ? on - 5 : on + 5})`],
      `At $x = ${x}$ the line is at $y = ${on}$. A point on a dashed line is not a solution, and the solutions lie ${above ? "above" : "below"} it.`,
      `当 $x = ${x}$ 时直线上 $y = ${on}$。虚线上的点不是解，解在其${above ? "上方" : "下方"}。`,
      regionFigure(m, b, above),
    );
  },
  "Using Systems of Linear Inequalities": (rng, hard) => {
    const [x, y, a, b] = [rng.int(1, 8), rng.int(1, 9), rng.int(1, 4), rng.int(2, 5)];
    const low = y - a * x - rng.int(1, 5);
    const high = y + b * x + rng.int(1, 5);
    if (!hard)
      return ask(
        rng,
        `Which point lies in the solution set of the system $y > ${lin(a, low)}$ and $y < ${lin(-b, high + 2 * b * x)}$?`,
        `哪个点在不等式组 $y > ${lin(a, low)}$ 且 $y < ${lin(-b, high + 2 * b * x)}$ 的解集中？`,
        `(${x}, ${y})`,
        [`(${x}, ${a * x + low})`, `(${x}, ${a * x + low - 3})`, `(${x}, ${-b * x + high + 2 * b * x + 3})`],
        `Substitute $x = ${x}$: the point must have $y$ above $${a * x + low}$ and below $${-b * x + high + 2 * b * x}$. Only $y = ${y}$ fits both.`,
        `代入 $x = ${x}$：$y$ 必须大于 $${a * x + low}$ 且小于 $${-b * x + high + 2 * b * x}$。只有 $y = ${y}$ 同时满足。`,
      );
    const [p, q] = [rng.int(20, 60), rng.int(3, 9)];
    const most = rng.int(4, 12);
    return ask(
      rng,
      `A student works $x$ hours at $\\$${q}$ per hour and spends $y$ hours in practice, with $x + y \\le ${most + p}$ and $y \\ge ${p}$. What is the greatest amount the student can earn?`,
      `一名学生打工 $x$ 小时，每小时 $\\$${q}$，练习 $y$ 小时，且 $x + y \\le ${most + p}$，$y \\ge ${p}$。这名学生最多能挣多少？`,
      q * most,
      [q * (most + p), q * p, most + q],
      `Earnings grow with $x$, so make $y$ as small as allowed: $y = ${p}$ leaves $x = ${most}$, and $${q}(${most}) = ${q * most}$.`,
      `收入随 $x$ 增加，所以让 $y$ 取最小值：$y = ${p}$ 时 $x = ${most}$，$${q}(${most}) = ${q * most}$。`,
    );
  },
  "Solving Linear Systems": (rng, hard) => {
    const [x, y] = [rng.int(-6, 12), rng.int(-6, 12)];
    if (!hard)
      return ask(
        rng,
        `If $x + y = ${x + y}$ and $x - y = ${x - y}$, what is the value of $x$?`,
        `若 $x + y = ${x + y}$ 且 $x - y = ${x - y}$，$x$ 的值是多少？`,
        x,
        [y, x + y, x - y === x ? x + 1 : x - y],
        `Adding the equations cancels $y$: $2x = ${2 * x}$, so $x = ${x}$.`,
        `两式相加消去 $y$：$2x = ${2 * x}$，所以 $x = ${x}$。`,
      );
    const [a, c] = [rng.int(2, 6), rng.int(2, 6)];
    const b = y - a * x;
    return ask(
      rng,
      `Given $y = ${lin(a, b)}$ and $${c}x + y = ${c * x + y}$, what is the value of $y$?`,
      `已知 $y = ${lin(a, b)}$ 且 $${c}x + y = ${c * x + y}$，$y$ 的值是多少？`,
      y,
      [x, y + a, c * x + y],
      `Substitute for $y$ in the second equation: $${a + c}x ${sg(b)} = ${c * x + y}$, so $x = ${x}$. Then $y = ${a}(${x}) ${sg(b)} = ${y}$.`,
      `把 $y$ 代入第二个方程：$${a + c}x ${sg(b)} = ${c * x + y}$，所以 $x = ${x}$。于是 $y = ${a}(${x}) ${sg(b)} = ${y}$。`,
    );
  },
  "Solving Systems by Elimination": (rng, hard) => {
    const [x, y, a, b, c] = [rng.int(-5, 9), rng.int(-5, 9), rng.int(2, 7), rng.int(2, 5), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $y$ in the solution of the system $${a}x + ${b}y = ${a * x + b * y}$ and $${a}x - ${c}y = ${a * x - c * y}$?`,
        `方程组 $${a}x + ${b}y = ${a * x + b * y}$，$${a}x - ${c}y = ${a * x - c * y}$ 的解中，$y$ 的值是多少？`,
        y,
        [x, y + 1, b + c],
        `Subtract the second equation from the first to cancel $x$: $${b + c}y = ${(b + c) * y}$, so $y = ${y}$.`,
        `第一式减第二式消去 $x$：$${b + c}y = ${(b + c) * y}$，所以 $y = ${y}$。`,
      );
    const d = a + 1;
    return ask(
      rng,
      `If $${a}x + ${b}y = ${a * x + b * y}$ and $${d}x - ${b}y = ${d * x - b * y}$, what is the value of $x + y$?`,
      `若 $${a}x + ${b}y = ${a * x + b * y}$ 且 $${d}x - ${b}y = ${d * x - b * y}$，$x + y$ 的值是多少？`,
      x + y,
      [x, y, x - y === x + y ? x + y + 1 : x - y],
      `Adding cancels $y$: $${a + d}x = ${(a + d) * x}$, so $x = ${x}$. Substituting gives $y = ${y}$, and the sum is $${x + y}$.`,
      `相加消去 $y$：$${a + d}x = ${(a + d) * x}$，所以 $x = ${x}$。代入得 $y = ${y}$，和为 $${x + y}$。`,
    );
  },
  "Determining How Many Solutions a System Has": (rng, hard) => {
    const [a, b, c, k] = [rng.int(2, 7), rng.int(2, 7), rng.int(1, 9), rng.int(2, 4)];
    if (!hard) {
      const kind = rng.int(0, 2);
      const second =
        kind === 0
          ? `${k * a}x + ${k * b}y = ${k * c}`
          : kind === 1
            ? `${k * a}x + ${k * b}y = ${k * c + 1}`
            : `${k * a + 1}x + ${k * b}y = ${k * c}`;
      const many = t("Infinitely many", "无穷多个");
      const none = t("None", "没有");
      const one = t("Exactly 1", "恰好 1 个");
      const two = t("Exactly 2", "恰好 2 个");
      const answer = kind === 0 ? many : kind === 1 ? none : one;
      return words(
        rng,
        t(
          `How many solutions does the system $${a}x + ${b}y = ${c}$ and $${second}$ have?`,
          `方程组 $${a}x + ${b}y = ${c}$，$${second}$ 有多少个解？`,
        ),
        answer,
        [many, none, one, two].filter((o) => o !== answer),
        t(
          `Multiply the first equation by $${k}$ and compare it with the second. The same line has infinitely many solutions, parallel lines have none, and lines with different slopes have one.`,
          `把第一个方程乘以 $${k}$ 再与第二个比较。同一直线有无穷多个解，平行线没有解，斜率不同的直线有一个解。`,
        ),
      );
    }
    return ask(
      rng,
      `For what value of $m$ does the system $y = ${lin(a, c)}$ and $${k}y = mx + ${k * c + 1}$ have no solution?`,
      `$m$ 为何值时，方程组 $y = ${lin(a, c)}$，$${k}y = mx + ${k * c + 1}$ 无解？`,
      k * a,
      [a, k + a, k * c],
      `No solution means parallel lines. Dividing the second equation by $${k}$ shows its slope is $\\frac{m}{${k}}$, so $\\frac{m}{${k}} = ${a}$ and $m = ${k * a}$.`,
      `无解意味着两直线平行。第二个方程除以 $${k}$ 后斜率为 $\\frac{m}{${k}}$，所以 $\\frac{m}{${k}} = ${a}$，$m = ${k * a}$。`,
    );
  },
  "Modeling Word Problems With Systems": (rng, hard) => {
    const [p, q] = [rng.int(8, 20), rng.int(3, 7)];
    const [u, v] = [rng.int(20, 90), rng.int(20, 90)];
    if (!hard)
      return ask(
        rng,
        `A theater sold $${u + v}$ tickets. Adult tickets cost $\\$${p}$ and student tickets cost $\\$${q}$, and sales totaled $\\$${p * u + q * v}$. How many adult tickets were sold?`,
        `一家剧院售出 $${u + v}$ 张票。成人票 $\\$${p}$，学生票 $\\$${q}$，总收入 $\\$${p * u + q * v}$。售出多少张成人票？`,
        u,
        [v === u ? u + 1 : v, u + 5, u + v - 5 === u ? u + 7 : u + v - 5],
        `Let $a$ be adult tickets. Then $${p}a + ${q}(${u + v} - a) = ${p * u + q * v}$, so $${p - q}a = ${(p - q) * u}$ and $a = ${u}$.`,
        `设成人票为 $a$ 张，则 $${p}a + ${q}(${u + v} - a) = ${p * u + q * v}$，所以 $${p - q}a = ${(p - q) * u}$，$a = ${u}$。`,
      );
    return ask(
      rng,
      `A band's merchandise table sells shirts and caps. One sale of $3$ shirts and $2$ caps costs $\\$${3 * p + 2 * q}$, and another of $2$ shirts and $3$ caps costs $\\$${2 * p + 3 * q}$. What is the price of $1$ shirt and $1$ cap together?`,
      `一支乐队的摊位卖衬衫和帽子。一笔 $3$ 件衬衫加 $2$ 顶帽子为 $\\$${3 * p + 2 * q}$，另一笔 $2$ 件衬衫加 $3$ 顶帽子为 $\\$${2 * p + 3 * q}$。$1$ 件衬衫加 $1$ 顶帽子一共多少钱？`,
      p + q,
      [p, q, 5 * p + 5 * q],
      `Adding the two sales gives $5$ shirts and $5$ caps for $\\$${5 * (p + q)}$. Dividing by $5$ gives $\\$${p + q}$, without finding either price.`,
      `两笔相加是 $5$ 件衬衫和 $5$ 顶帽子，共 $\\$${5 * (p + q)}$。除以 $5$ 得 $\\$${p + q}$，不必分别求价格。`,
    );
  },
  "Using a System Solution": (rng, hard) => {
    const [s, d] = [rng.int(4, 20), rng.int(2, 12)];
    if (!hard)
      return ask(
        rng,
        `If $x + y = ${s}$ and $x - y = ${d}$, what is the value of $x^2 - y^2$?`,
        `若 $x + y = ${s}$ 且 $x - y = ${d}$，$x^2 - y^2$ 的值是多少？`,
        s * d,
        [s + d, s * s - d * d, (s - d) * (s - d)],
        `Factor it as $(x + y)(x - y)$ and use the given values: $${s}(${d}) = ${s * d}$.`,
        `分解为 $(x + y)(x - y)$ 并代入：$${s}(${d}) = ${s * d}$。`,
      );
    const [x, y] = [rng.int(1, 15), rng.int(1, 15)];
    return ask(
      rng,
      `If $2x + y = ${2 * x + y}$ and $x + 2y = ${x + 2 * y}$, what is the value of $x + y$?`,
      `若 $2x + y = ${2 * x + y}$ 且 $x + 2y = ${x + 2 * y}$，$x + y$ 的值是多少？`,
      x + y,
      [3 * (x + y), 2 * (x + y), x + y + 3],
      `Adding the equations gives $3x + 3y = ${3 * (x + y)}$, and dividing by $3$ gives $x + y = ${x + y}$.`,
      `两式相加得 $3x + 3y = ${3 * (x + y)}$，除以 $3$ 得 $x + y = ${x + y}$。`,
    );
  },
};
