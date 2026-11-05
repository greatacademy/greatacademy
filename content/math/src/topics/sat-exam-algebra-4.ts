import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { cx, mc, mcExact, mod, par, sg, spr, words } from "../exam.ts";
import { linesFigure } from "../exam-figures.ts";

// SAT Math Prep, Algebra: systems of linear equations, special solution counts, and linear inequalities.

const sysTips = mod(
  t(
    "Look at the system before choosing a method. If adding or subtracting the equations gives the requested expression at once, you can skip solving for each variable.",
    "选择方法之前先观察方程组。如果把两个方程相加或相减能直接得到所求式子，就不必分别解出每个变量。",
  ),
  t(
    "Harder systems need one equation scaled first, or ask for a combination such as $x + y$. Decide on the target before you start eliminating.",
    "较难的方程组要先把一个方程乘以某数，或问 $x + y$ 这样的组合。开始消元之前先确定目标。",
  ),
);
const countTips = mod(
  t(
    "Reduce a linear equation to $ax = b$. If $a \\neq 0$ there is one solution; if $a = 0$ and $b = 0$ there are infinitely many; if $a = 0$ and $b \\neq 0$ there are none.",
    "把一次方程化为 $ax = b$。若 $a \\neq 0$，有一个解；若 $a = 0$ 且 $b = 0$，有无穷多解；若 $a = 0$ 且 $b \\neq 0$，无解。",
  ),
  t(
    "For a system, compare the ratios of coefficients: unequal ratios give one solution, equal ratios with an unequal constant ratio give none, and all equal gives infinitely many.",
    "对方程组，比较系数之比：比值不等时有一个解；系数比相等而常数比不等时无解；全部相等时有无穷多解。",
  ),
);
const ineqTips = mod(
  t(
    "Words such as at least and no more than choose the inequality sign. Write the total on one side and the limit on the other before you solve.",
    "“至少”“不超过”这样的词决定不等号。先把总量写在一边、限制写在另一边，再求解。",
  ),
  t(
    "After solving, think about what the variable counts. A count must be a whole number, so a boundary such as $7.5$ rounds in the direction the inequality allows.",
    "求解之后想一想变量在数什么。数量必须是整数，所以 $7.5$ 这样的边界要按不等式允许的方向取整。",
  ),
);
const twoIneqTips = mod(
  t(
    "To test a point, substitute it into every inequality. A point is a solution only when each inequality is true, and a strict sign excludes points on the boundary.",
    "检验一个点时，把它代入每个不等式。只有每个不等式都成立才是解，严格不等号排除边界上的点。",
  ),
  t(
    "In context, each inequality states one constraint. Harder questions fix one variable and ask for the largest or smallest allowed value of the other.",
    "在情境中，每个不等式表示一个约束。较难的题固定一个变量，问另一个变量允许的最大或最小值。",
  ),
);

/** satExamAlgebra4 finishes the SAT Algebra unit. */
export const satExamAlgebra4: ExamSpec[] = [
  sysTips("Solving Simple Systems of Linear Equations", "解简单的二元一次方程组", ["systems-of-linear-equations"], (rng, hard) => {
    const x0 = rng.int(1, 9);
    const m = rng.int(2, 6);
    const b = rng.int(-6, 9);
    const y0 = m * x0 + b;
    const c = rng.int(2, 5);
    const T = c * x0 + y0;
    const sys = `\\begin{cases} y = ${m}x ${sg(b)} \\\\ ${c}x + y = ${T} \\end{cases}`;
    if (!hard)
      return mc(
        rng,
        t(`What is the solution $(x, y)$ to the system?\n$$${sys}$$`, `方程组的解 $(x, y)$ 是什么？\n$$${sys}$$`),
        `(${x0}, ${y0})`,
        [`(${y0}, ${x0})`, `(${x0}, ${T - y0})`, `(${x0 + 1}, ${y0})`, `(${x0}, ${y0 + 1})`, `(${x0 + 1}, ${y0 + 2})`],
        t(
          `Substitute $y$: $${c}x + ${m}x ${sg(b)} = ${T}$, so $x = ${x0}$ and $y = ${y0}$.`,
          `代入 $y$：$${c}x + ${m}x ${sg(b)} = ${T}$，所以 $x = ${x0}$，$y = ${y0}$。`,
        ),
      );
    return spr(
      t(
        `If $(x, y)$ is the solution to the system, what is the value of $x + y$?\n$$${sys}$$`,
        `若 $(x, y)$ 是方程组的解，则 $x + y$ 的值是多少？\n$$${sys}$$`,
      ),
      x0 + y0,
      [x0, y0, T],
      t(
        `Substitute $y$ in the second equation to get $x = ${x0}$, then $y = ${y0}$, so the sum is $${x0 + y0}$.`,
        `把 $y$ 代入第二个方程得 $x = ${x0}$，于是 $y = ${y0}$，和为 $${x0 + y0}$。`,
      ),
    );
  }),
  sysTips(
    "Identifying Structure in Systems of Linear Equations",
    "识别线性方程组的结构",
    ["solving-systems-of-linear-equations-by-identifying-structure"],
    (rng, hard) => {
      const x0 = rng.int(1, 9);
      const y0 = rng.int(1, 9);
      const a = rng.int(2, 7);
      const b = a + rng.int(1, 4);
      const p = a * x0 + b * y0;
      const q = b * x0 + a * y0;
      const sys = `\\begin{cases} ${a}x + ${b}y = ${p} \\\\ ${b}x + ${a}y = ${q} \\end{cases}`;
      if (!hard)
        return mc(
          rng,
          t(`Given the system, what is the value of $x + y$?\n$$${sys}$$`, `已知方程组，$x + y$ 的值是多少？\n$$${sys}$$`),
          x0 + y0,
          [p + q, x0, Q.of(p + q, a)],
          t(
            `Add the equations: $${a + b}x + ${a + b}y = ${p + q}$. Divide by $${a + b}$ to get $x + y = ${x0 + y0}$.`,
            `两式相加：$${a + b}x + ${a + b}y = ${p + q}$。除以 $${a + b}$ 得 $x + y = ${x0 + y0}$。`,
          ),
        );
      return spr(
        t(`Given the system, what is the value of $x - y$?\n$$${sys}$$`, `已知方程组，$x - y$ 的值是多少？\n$$${sys}$$`),
        x0 - y0,
        [y0 - x0, x0 + y0, q - p],
        t(
          `Subtract the first from the second: $${b - a}x - ${b - a}y = ${q - p}$. Divide by $${b - a}$ to get $${x0 - y0}$.`,
          `第二式减第一式：$${b - a}x - ${b - a}y = ${q - p}$。除以 $${b - a}$ 得 $${x0 - y0}$。`,
        ),
      );
    },
  ),
  sysTips(
    "Solving Systems of Equations Using Addition or Subtraction",
    "用加减法解方程组",
    ["introduction-to-elimination"],
    (rng, hard) => {
      const x0 = rng.int(1, 9);
      const y0 = rng.int(-5, 9);
      const a = rng.int(2, 6);
      const b = rng.int(2, 6);
      const c = rng.int(1, 5);
      const sys = hard
        ? `\\begin{cases} ${a + c}x + ${b}y = ${(a + c) * x0 + b * y0} \\\\ ${a}x + ${b}y = ${a * x0 + b * y0} \\end{cases}`
        : `\\begin{cases} ${a}x + ${b}y = ${a * x0 + b * y0} \\\\ ${c}x - ${b}y = ${c * x0 - b * y0} \\end{cases}`;
      if (!hard)
        return mc(
          rng,
          t(`What is the value of $x$ in the solution to the system?\n$$${sys}$$`, `方程组解中 $x$ 的值是多少？\n$$${sys}$$`),
          x0,
          [y0 === x0 ? x0 + 2 : y0, x0 + 1, x0 - 1],
          t(
            `Adding the equations cancels $y$: $${a + c}x = ${(a + c) * x0}$, so $x = ${x0}$.`,
            `两式相加消去 $y$：$${a + c}x = ${(a + c) * x0}$，所以 $x = ${x0}$。`,
          ),
        );
      return spr(
        t(
          `If $(x, y)$ satisfies the system, what is the value of $y$?\n$$${sys}$$`,
          `若 $(x, y)$ 满足方程组，则 $y$ 的值是多少？\n$$${sys}$$`,
        ),
        y0,
        [x0, y0 + 1, -y0],
        t(
          `Subtract the second equation to cancel $y$: $${c}x = ${c * x0}$, so $x = ${x0}$. Then $${a}(${x0}) + ${b}y = ${a * x0 + b * y0}$ gives $y = ${y0}$.`,
          `第一式减第二式消去 $y$：$${c}x = ${c * x0}$，所以 $x = ${x0}$。再由 $${a}(${x0}) + ${b}y = ${a * x0 + b * y0}$ 得 $y = ${y0}$。`,
        ),
      );
    },
  ),
  sysTips("Solving Systems of Equations Using Elimination", "用消元法解方程组", ["elimination-with-two-transformations"], (rng, hard) => {
    const x0 = rng.int(-4, 8);
    const y0 = rng.int(-4, 8);
    const a = rng.pick([2, 3, 5]);
    const b = rng.pick([3, 4, 7]);
    const c = hard ? rng.pick([3, 4, 7].filter((v) => v !== a)) : 1;
    const d0 = hard ? rng.pick([2, 5]) : rng.int(1, 3);
    const d = a * d0 === b * c ? d0 + 1 : d0;
    const sys = `\\begin{cases} ${a}x + ${b}y = ${a * x0 + b * y0} \\\\ ${cx(c)} + ${cx(d, "y")} = ${c * x0 + d * y0} \\end{cases}`;
    const det = a * d - b * c;
    return spr(
      t(
        `The solution to the system is $(x, y)$. What is the value of $x$?\n$$${sys}$$`,
        `方程组的解为 $(x, y)$。$x$ 的值是多少？\n$$${sys}$$`,
      ),
      x0,
      [y0 === x0 ? x0 + 1 : y0, x0 + 1, -x0 === x0 ? x0 + 2 : -x0],
      t(
        `Match the $y$ coefficients: ${d === 1 ? `multiply the second equation by $${b}$` : `multiply the first equation by $${d}$ and the second by $${b}$`}. Subtracting gives $${cx(det)} = ${det * x0}$${det === 1 ? "" : `, so $x = ${x0}$`}.`,
        `让 $y$ 系数相同：${d === 1 ? `第二式乘 $${b}$` : `第一式乘 $${d}$，第二式乘 $${b}$`}。相减得 $${cx(det)} = ${det * x0}$${det === 1 ? "" : `，所以 $x = ${x0}$`}。`,
      ),
    );
  }),
  sysTips("Modeling Word Problems With Systems of Linear Equations", "用方程组为应用题建模", ["modeling-with-systems"], (rng, hard) => {
    const a = rng.int(6, 15);
    const b = rng.int(2, a - 2);
    const n = rng.int(20, 60);
    const x0 = rng.int(5, n - 5);
    const T = a * x0 + b * (n - x0);
    const good = `\\begin{cases} x + y = ${n} \\\\ ${a}x + ${b}y = ${T} \\end{cases}`;
    const wrong = [
      `\\begin{cases} x + y = ${T} \\\\ ${a}x + ${b}y = ${n} \\end{cases}`,
      `\\begin{cases} x + y = ${n} \\\\ ${b}x + ${a}y = ${T} \\end{cases}`,
      `\\begin{cases} ${a}x + y = ${n} \\\\ x + ${b}y = ${T} \\end{cases}`,
    ];
    const en = hard
      ? `A school sold $${n}$ tickets: $x$ adult tickets at $\\$${a}$ each and $y$ student tickets at $\\$${b}$ each. It collected $\\$${T}$. How many adult tickets were sold?`
      : `A school sold $${n}$ tickets: $x$ adult tickets at $\\$${a}$ each and $y$ student tickets at $\\$${b}$ each, collecting $\\$${T}$. Which system represents this?`;
    const zh = hard
      ? `学校卖出 $${n}$ 张票：成人票 $x$ 张，每张 $${a}$ 美元；学生票 $y$ 张，每张 $${b}$ 美元。共收入 $${T}$ 美元。卖出多少张成人票？`
      : `学校卖出 $${n}$ 张票：成人票 $x$ 张，每张 $${a}$ 美元；学生票 $y$ 张，每张 $${b}$ 美元，共收入 $${T}$ 美元。哪个方程组表示这一情况？`;
    if (!hard)
      return mc(
        rng,
        t(en, zh),
        good,
        wrong,
        t(
          `One equation counts tickets and the other counts dollars, each dollar term being a price times a count.`,
          `一个方程计票数，另一个计金额，金额项是单价乘以数量。`,
        ),
      );
    return spr(
      t(en, zh),
      x0,
      [n - x0, Q.of(T, a), Q.of(T, a + b)],
      t(
        `Substitute $y = ${n} - x$ in $${a}x + ${b}y = ${T}$: $${a - b}x = ${T - b * n}$, so $x = ${x0}$.`,
        `把 $y = ${n} - x$ 代入 $${a}x + ${b}y = ${T}$：$${a - b}x = ${T - b * n}$，所以 $x = ${x0}$。`,
      ),
    );
  }),
  sysTips("Solving Problems With Systems of Linear Equations", "用方程组解决问题", ["modeling-with-systems"], (rng, hard) => {
    const p = rng.int(3, 12);
    const q = rng.int(2, 9);
    const a = rng.int(2, 5);
    const b = rng.int(1, 4);
    const c = a + rng.int(1, 3);
    const d = b + rng.int(0, 2);
    const T1 = a * p + b * q;
    const T2 = c * p + d * q;
    const det = a * d - b * c;
    if (det === 0 && hard)
      return spr(
        t(
          `Two pens and one eraser cost $\\$${2 * p + q}$. Three pens and one eraser cost $\\$${3 * p + q}$. What is the total price of one pen and one eraser, in dollars?`,
          `两支钢笔和一块橡皮共 $${2 * p + q}$ 美元。三支钢笔和一块橡皮共 $${3 * p + q}$ 美元。一支钢笔和一块橡皮共多少美元？`,
        ),
        p + q,
        [p, q, 2 * p + q],
        t(
          `The second purchase has one more pen, so a pen costs $\\$${p}$. Then the eraser costs $\\$${q}$, and together they cost $\\$${p + q}$.`,
          `第二次购买多一支钢笔，所以钢笔 $${p}$ 美元。于是橡皮 $${q}$ 美元，两者共 $${p + q}$ 美元。`,
        ),
      );
    if (det === 0)
      return spr(
        t(
          `Two pens and one eraser cost $\\$${2 * p + q}$. Three pens and one eraser cost $\\$${3 * p + q}$. What is the price of one pen, in dollars?`,
          `两支钢笔和一块橡皮共 $${2 * p + q}$ 美元。三支钢笔和一块橡皮共 $${3 * p + q}$ 美元。一支钢笔多少美元？`,
        ),
        p,
        [q, p + q, 2 * p],
        t(
          `The second purchase has exactly one more pen, so a pen costs the difference, $\\$${p}$.`,
          `第二次购买只多一支钢笔，所以钢笔的价格就是差额 $${p}$ 美元。`,
        ),
      );
    const en = `A customer buys $${a}$ pens and $${b}$ erasers for $\\$${T1}$. Another buys $${c}$ pens and $${d}$ erasers for $\\$${T2}$.`;
    const zh = `一位顾客买 $${a}$ 支钢笔和 $${b}$ 块橡皮共 $${T1}$ 美元。另一位买 $${c}$ 支钢笔和 $${d}$ 块橡皮共 $${T2}$ 美元。`;
    if (!hard)
      return spr(
        t(`${en} What is the price of one pen, in dollars?`, `${zh}一支钢笔多少美元？`),
        p,
        [q, p + q, T2 - T1],
        t(
          `Eliminate the erasers: $${d}$ times the first minus $${b}$ times the second gives $${det}p = ${det * p}$, so a pen costs $\\$${p}$.`,
          `消去橡皮：第一式乘 $${d}$ 减第二式乘 $${b}$，得 $${det}p = ${det * p}$，所以钢笔 $${p}$ 美元。`,
        ),
      );
    return spr(
      t(`${en} What is the total price of one pen and one eraser, in dollars?`, `${zh}一支钢笔和一块橡皮共多少美元？`),
      p + q,
      [p, q, T2 - T1],
      t(
        `Solving the system gives a pen at $\\$${p}$ and an eraser at $\\$${q}$, so together they cost $\\$${p + q}$.`,
        `解方程组得钢笔 $${p}$ 美元、橡皮 $${q}$ 美元，所以合计 $${p + q}$ 美元。`,
      ),
    );
  }),
  sysTips(
    "Solving Problems With Systems of Linear Equations in Standard Form",
    "解一般式方程组问题",
    ["elimination-with-two-transformations"],
    (rng, hard) => {
      const x0 = rng.int(1, 8);
      const y0 = rng.int(1, 8);
      const a = rng.int(2, 5);
      const b = rng.int(2, 5);
      const k = rng.int(2, 4);
      const c = k * a + 1;
      const d = k * b;
      const p = a * x0 + b * y0;
      const q = c * x0 + d * y0;
      const sys = `\\begin{cases} ${a}x + ${b}y = ${p} \\\\ ${c}x + ${d}y = ${q} \\end{cases}`;
      if (!hard)
        return mc(
          rng,
          t(`What is the value of $x$ in the solution to the system?\n$$${sys}$$`, `方程组解中 $x$ 的值是多少？\n$$${sys}$$`),
          x0,
          [q - p, x0 + y0, y0 === x0 ? x0 + 1 : y0],
          t(
            `Multiply the first equation by $${k}$ and subtract it from the second: the $y$ terms cancel and $x = ${q} - ${k * p} = ${x0}$.`,
            `第一式乘 $${k}$ 再从第二式中减去：$y$ 项相消，$x = ${q} - ${k * p} = ${x0}$。`,
          ),
        );
      return spr(
        t(
          `If $(x, y)$ is the solution to the system, what is the value of $${a}x + ${2 * b}y$?\n$$${sys}$$`,
          `若 $(x, y)$ 是方程组的解，则 $${a}x + ${2 * b}y$ 的值是多少？\n$$${sys}$$`,
        ),
        a * x0 + 2 * b * y0,
        [p, q, 2 * p],
        t(
          `Subtracting $${k}$ times the first equation from the second gives $x = ${x0}$; then $y = ${y0}$. Substitute: $${a}(${x0}) + ${2 * b}(${y0}) = ${a * x0 + 2 * b * y0}$.`,
          `第二式减第一式的 $${k}$ 倍得 $x = ${x0}$，于是 $y = ${y0}$。代入：$${a}(${x0}) + ${2 * b}(${y0}) = ${a * x0 + 2 * b * y0}$。`,
        ),
      );
    },
  ),
  sysTips("The Intersection of Two Lines", "两直线的交点", ["intersection-of-two-lines"], (rng, hard) => {
    const x0 = rng.int(-5, 8);
    const m1 = rng.int(1, 6);
    const m2 = -rng.int(1, 5);
    const y0 = rng.int(-6, 9);
    const b1 = y0 - m1 * x0;
    const b2 = y0 - m2 * x0;
    const lines = `$y = ${cx(m1)} ${sg(b1)}$ and $y = ${cx(m2)} ${sg(b2)}$`;
    const zh = `$y = ${cx(m1)} ${sg(b1)}$ 和 $y = ${cx(m2)} ${sg(b2)}$`;
    if (!hard)
      return mc(
        rng,
        t(`At what point do the lines ${lines} intersect?`, `直线 ${zh} 相交于哪一点？`),
        `(${x0}, ${y0})`,
        [`(${y0}, ${x0})`, `(${x0 + 1}, ${y0})`, `(${x0}, ${b1})`, `(${x0}, ${b2})`, `(${x0}, ${y0 + 1})`, `(${x0 - 1}, ${y0})`],
        t(
          `Set the right sides equal: $${m1 - m2}x = ${b2 - b1}$, so $x = ${x0}$ and $y = ${y0}$.`,
          `令右边相等：$${m1 - m2}x = ${b2 - b1}$，所以 $x = ${x0}$，$y = ${y0}$。`,
        ),
      );
    return spr(
      t(`The lines ${lines} intersect at $(a, b)$. What is the value of $a + b$?`, `直线 ${zh} 相交于 $(a, b)$。$a + b$ 的值是多少？`),
      x0 + y0,
      [x0, y0, x0 - y0],
      t(
        `Setting the right sides equal gives $x = ${x0}$, and then $y = ${y0}$, so the sum is $${x0 + y0}$.`,
        `令右边相等得 $x = ${x0}$，于是 $y = ${y0}$，和为 $${x0 + y0}$。`,
      ),
    );
  }),
  sysTips(
    "The Relationship Between Systems of Linear Equations and Graphs",
    "方程组与图象的关系",
    ["intersection-of-two-lines", "consistency-and-dependency"],
    (rng, hard) => {
      const m = rng.nonZero(-5, 5);
      const b = rng.int(1, 8);
      const k = rng.int(2, 4);
      if (!hard) {
        const kind = rng.int(0, 2);
        const sec =
          kind === 0
            ? `y = ${cx(m)} ${sg(b + 2)}`
            : kind === 1
              ? `${k}y = ${cx(k * m)} ${sg(k * b)}`
              : `y = ${cx(m + (m === -1 ? 2 : 1))} ${sg(b)}`;
        const ans = [
          t("The lines are parallel and do not meet", "两直线平行，不相交"),
          t("The lines are the same line", "两直线重合"),
          t("The lines cross at exactly one point", "两直线恰好交于一点"),
        ];
        return words(
          rng,
          t(
            `Which statement describes the graphs of $y = ${cx(m)} ${sg(b)}$ and $${sec}$?`,
            `哪个陈述描述了 $y = ${cx(m)} ${sg(b)}$ 与 $${sec}$ 的图象？`,
          ),
          ans[kind]!,
          [...ans.filter((_, i) => i !== kind), t("The lines are perpendicular", "两直线垂直")],
          t(
            `Write both lines in slope-intercept form and compare slopes and intercepts: ${kind === 0 ? "same slope, different intercept" : kind === 1 ? "same slope and same intercept" : "different slopes"}.`,
            `把两直线都写成斜截式，比较斜率和截距：${kind === 0 ? "斜率相同、截距不同" : kind === 1 ? "斜率和截距都相同" : "斜率不同"}。`,
          ),
        );
      }
      const y1 = rng.int(2, 9);
      const x0 = rng.int(1, 5);
      return spr(
        t(
          `A system of two linear equations is graphed. One line is $y = ${y1}$ and the other is $y = ${cx(m)} ${sg(y1 - m * x0)}$. What is the $x$-coordinate of the solution of the system?`,
          `两个一次方程组成的方程组的图象中，一条直线是 $y = ${y1}$，另一条是 $y = ${cx(m)} ${sg(y1 - m * x0)}$。方程组解的横坐标是多少？`,
        ),
        x0,
        [y1, m, y1 - m * x0].filter((v) => v !== x0),
        t(
          `The solution is the crossing point: $${cx(m)} ${sg(y1 - m * x0)} = ${y1}$ gives $x = ${x0}$.`,
          `解就是交点：$${cx(m)} ${sg(y1 - m * x0)} = ${y1}$ 得 $x = ${x0}$。`,
        ),
        linesFigure([0, y1], [m, y1 - m * x0]),
      );
    },
  ),
  countTips(
    "Determining the Number of Solutions to a Linear Equation",
    "判断一次方程解的个数",
    ["determining-the-number-of-solutions-of-a-linear-equation"],
    (rng, hard) => {
      const a = rng.int(2, 7);
      const b = rng.int(1, 9);
      const kind = rng.int(0, 2);
      const d = kind === 0 ? a * b : kind === 1 ? a * b + rng.int(1, 5) : a * b - 1;
      const co = kind === 2 ? a + 1 : a;
      const ans = [t("Infinitely many", "无穷多个"), t("Zero", "零个"), t("Exactly one", "恰好一个")];
      const inner = hard ? `${a}(x + ${b}) - ${co === a ? 0 : 1}x` : `${a}(x + ${b})`;
      const prompt = hard ? `${inner.replace(" - 0x", "")} = ${kind === 2 ? `${2 * a}x` : `${a}x`} + ${d}` : `${inner} = ${co}x + ${d}`;
      return words(
        rng,
        t(`How many solutions does the equation $${prompt}$ have?`, `方程 $${prompt}$ 有多少个解？`),
        ans[kind]!,
        [...ans.filter((_, i) => i !== kind), t("Exactly two", "恰好两个")],
        t(
          `Distribute and compare both sides. ${kind === 0 ? "The two sides are identical, so every $x$ works." : kind === 1 ? "The $x$ terms cancel and two different constants remain, so no $x$ works." : "The $x$ coefficients differ, so one value of $x$ works."}`,
          `展开后比较两边。${kind === 0 ? "两边完全相同，所以任何 $x$ 都成立。" : kind === 1 ? "$x$ 项相消，留下两个不同的常数，所以没有 $x$ 成立。" : "$x$ 的系数不同，所以恰有一个 $x$ 成立。"}`,
        ),
      );
    },
  ),
  countTips(
    "Linear Equations With Infinitely Many Solutions",
    "有无穷多解的一次方程",
    ["linear-equations-with-infinitely-many-solutions"],
    (rng, hard) => {
      const a = rng.int(2, 7);
      const b = rng.int(1, 9);
      const k = rng.int(2, 5);
      if (!hard)
        return spr(
          t(
            `In the equation $${a}(x + ${b}) = ${a}x + c$, $c$ is a constant. If the equation has infinitely many solutions, what is the value of $c$?`,
            `在方程 $${a}(x + ${b}) = ${a}x + c$ 中，$c$ 是常数。若方程有无穷多解，$c$ 的值是多少？`,
          ),
          a * b,
          [b, a + b, 0],
          t(
            `Both sides must be identical, and the left side is $${a}x + ${a * b}$, so $c = ${a * b}$.`,
            `两边必须完全相同，左边为 $${a}x + ${a * b}$，所以 $c = ${a * b}$。`,
          ),
        );
      return spr(
        t(
          `In the equation $${k}(${a}x + ${b}) = px + q$, $p$ and $q$ are constants. If the equation has infinitely many solutions, what is the value of $p + q$?`,
          `在方程 $${k}(${a}x + ${b}) = px + q$ 中，$p$、$q$ 是常数。若方程有无穷多解，$p + q$ 的值是多少？`,
        ),
        k * a + k * b,
        [a + b, k * a, k * b],
        t(
          `The left side is $${k * a}x + ${k * b}$, so $p = ${k * a}$ and $q = ${k * b}$, and the sum is $${k * a + k * b}$.`,
          `左边为 $${k * a}x + ${k * b}$，所以 $p = ${k * a}$，$q = ${k * b}$，和为 $${k * a + k * b}$。`,
        ),
      );
    },
  ),
  countTips("Linear Equations With No Solutions", "无解的一次方程", ["linear-equations-with-no-solutions"], (rng, hard) => {
    const a = rng.int(2, 7);
    const b = rng.int(1, 9);
    const k = rng.int(2, 5);
    if (!hard)
      return spr(
        t(
          `In the equation $${a}(x + ${b}) = cx + ${a * b + k}$, $c$ is a constant. If the equation has no solution, what is the value of $c$?`,
          `在方程 $${a}(x + ${b}) = cx + ${a * b + k}$ 中，$c$ 是常数。若方程无解，$c$ 的值是多少？`,
        ),
        a,
        [b, a * b, k],
        t(
          `No solution requires equal $x$ coefficients with different constants. The left coefficient is $${a}$, and $${a * b} \\neq ${a * b + k}$, so $c = ${a}$.`,
          `无解要求 $x$ 系数相等而常数不同。左边系数为 $${a}$，且 $${a * b} \\neq ${a * b + k}$，所以 $c = ${a}$。`,
        ),
      );
    return mc(
      rng,
      t(
        `The equation $${k * a}x + ${b} = r(${a}x + ${b + 1})$ has no solution, where $r$ is a constant. What is the value of $r$?`,
        `方程 $${k * a}x + ${b} = r(${a}x + ${b + 1})$ 无解，其中 $r$ 是常数。$r$ 的值是多少？`,
      ),
      k,
      [Q.of(b, b + 1), k * a, Q.of(k, a)],
      t(
        `Matching the $x$ coefficients: $${k * a} = ${a}r$, so $r = ${k}$. Then the constants $${b}$ and $${k * (b + 1)}$ differ, so there is no solution.`,
        `令 $x$ 系数相等：$${k * a} = ${a}r$，所以 $r = ${k}$。此时常数 $${b}$ 和 $${k * (b + 1)}$ 不同，所以无解。`,
      ),
    );
  }),
  countTips(
    "Determining the Number of Solutions to a Linear System",
    "判断线性方程组解的个数",
    ["consistency-and-dependency"],
    (rng, hard) => {
      const a = rng.int(2, 6);
      const b = rng.int(2, 6);
      const c = rng.int(3, 12);
      const k = rng.int(2, 4);
      const kind = rng.int(0, 2);
      const sec =
        kind === 0
          ? `${k * a}x + ${k * b}y = ${k * c}`
          : kind === 1
            ? `${k * a}x + ${k * b}y = ${k * c + 1}`
            : `${k * a + 1}x + ${k * b}y = ${k * c}`;
      const first = hard ? `y = ${Q.of(-a, b).toLatex()}x + ${Q.of(c, b).toLatex()}` : `${a}x + ${b}y = ${c}`;
      const ans = [t("Infinitely many", "无穷多个"), t("Zero", "零个"), t("Exactly one", "恰好一个")];
      return words(
        rng,
        t(
          `How many solutions does the system have?\n$$\\begin{cases} ${first} \\\\ ${sec} \\end{cases}$$`,
          `方程组有多少个解？\n$$\\begin{cases} ${first} \\\\ ${sec} \\end{cases}$$`,
        ),
        ans[kind]!,
        [...ans.filter((_, i) => i !== kind), t("Exactly two", "恰好两个")],
        t(
          `${hard ? `The first line is $${a}x + ${b}y = ${c}$. ` : ""}${kind === 0 ? `The second equation is $${k}$ times the first, so they are the same line.` : kind === 1 ? `The left side of the second is $${k}$ times the first, but its constant is not, so the lines are parallel.` : "The coefficient ratios differ, so the lines have different slopes and cross once."}`,
          `${hard ? `第一条直线即 $${a}x + ${b}y = ${c}$。` : ""}${kind === 0 ? `第二式是第一式的 $${k}$ 倍，所以是同一条直线。` : kind === 1 ? `第二式左边是第一式左边的 $${k}$ 倍，但常数不是，所以两线平行。` : "系数比不同，所以斜率不同，交于一点。"}`,
        ),
      );
    },
  ),
  countTips(
    "Linear Systems With Infinitely Many Solutions",
    "有无穷多解的线性方程组",
    ["systems-with-no-solution-or-infinitely-many-solutions"],
    (rng, hard) => {
      const a = rng.int(2, 6);
      const b = rng.int(2, 6);
      const c = rng.int(3, 12);
      const k = rng.int(2, 5);
      if (!hard)
        return spr(
          t(
            `The system has infinitely many solutions, where $q$ is a constant. What is the value of $q$?\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ ${k * a}x + ${k * b}y = q \\end{cases}$$`,
            `方程组有无穷多解，其中 $q$ 是常数。$q$ 的值是多少？\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ ${k * a}x + ${k * b}y = q \\end{cases}$$`,
          ),
          k * c,
          [c, k + c, k * a],
          t(
            `The second equation must be $${k}$ times the first, so $q = ${k}(${c}) = ${k * c}$.`,
            `第二式必须是第一式的 $${k}$ 倍，所以 $q = ${k}(${c}) = ${k * c}$。`,
          ),
        );
      return spr(
        t(
          `The system has infinitely many solutions, where $p$ and $q$ are constants. What is the value of $p + q$?\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ px + ${k * b}y = q \\end{cases}$$`,
          `方程组有无穷多解，其中 $p$、$q$ 是常数。$p + q$ 的值是多少？\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ px + ${k * b}y = q \\end{cases}$$`,
        ),
        k * a + k * c,
        [a + c, k * a, k * c],
        t(
          `The $y$ coefficients show the multiplier is $${k}$. So $p = ${k * a}$ and $q = ${k * c}$, with sum $${k * a + k * c}$.`,
          `由 $y$ 系数知倍数是 $${k}$。所以 $p = ${k * a}$，$q = ${k * c}$，和为 $${k * a + k * c}$。`,
        ),
      );
    },
  ),
  countTips(
    "Parametrizing Systems of Linear Equations",
    "线性方程组的参数化",
    ["parametrizing-systems-with-infinitely-many-solutions"],
    (rng, hard) => {
      const m = rng.int(2, 6);
      const b = rng.int(1, 9);
      const k = rng.int(2, 4);
      const s = rng.int(1, 9);
      const sys = `\\begin{cases} y - ${m}x = ${b} \\\\ ${k}y - ${k * m}x = ${k * b} \\end{cases}`;
      if (!hard)
        return mc(
          rng,
          t(
            `The system has infinitely many solutions. Which pair $(x, y)$ describes all of them, for every number $t$?\n$$${sys}$$`,
            `方程组有无穷多解。对任意实数 $t$，哪个数对 $(x, y)$ 表示全部的解？\n$$${sys}$$`,
          ),
          `(t, ${m}t + ${b})`,
          [`(${m}t + ${b}, t)`, `(t, ${m}t - ${b})`, `(t, ${b}t + ${m})`, `(t, -${m}t + ${b})`],
          t(
            `The second equation is $${k}$ times the first, so only $y = ${m}x + ${b}$ matters. Setting $x = t$ gives $y = ${m}t + ${b}$.`,
            `第二式是第一式的 $${k}$ 倍，所以只需 $y = ${m}x + ${b}$。令 $x = t$，得 $y = ${m}t + ${b}$。`,
          ),
        );
      return spr(
        t(
          `The solutions of the system can be written $(t, ${m}t + c)$ for every number $t$. If $(${s}, r)$ is a solution, what is the value of $r$?\n$$${sys}$$`,
          `方程组的解可写成 $(t, ${m}t + c)$，$t$ 为任意实数。若 $(${s}, r)$ 是解，则 $r$ 的值是多少？\n$$${sys}$$`,
        ),
        m * s + b,
        [m * s, s + b, m + b],
        t(
          `The first equation gives $c = ${b}$. With $t = ${s}$, $r = ${m}(${s}) + ${b} = ${m * s + b}$.`,
          `第一式给出 $c = ${b}$。令 $t = ${s}$，得 $r = ${m}(${s}) + ${b} = ${m * s + b}$。`,
        ),
      );
    },
  ),
  countTips("Linear Systems With No Solution", "无解的线性方程组", ["sat-linear-systems-unknown-constants"], (rng, hard) => {
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const c = rng.int(3, 12);
    const k = rng.int(2, 5);
    const d = k * c + rng.pick([-2, -1, 1, 2]);
    if (!hard)
      return spr(
        t(
          `The system has no solution, where $p$ is a constant. What is the value of $p$?\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ px + ${k * b}y = ${d} \\end{cases}$$`,
          `方程组无解，其中 $p$ 是常数。$p$ 的值是多少？\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ px + ${k * b}y = ${d} \\end{cases}$$`,
        ),
        k * a,
        [a, k * b, d],
        t(
          `The left sides must be proportional with the multiplier $${k}$ set by the $y$ terms, so $p = ${k * a}$. The constants do not follow it, so the lines are parallel.`,
          `左边必须成比例，$y$ 项给出倍数 $${k}$，所以 $p = ${k * a}$。常数不按此比例，所以两线平行。`,
        ),
      );
    return words(
      rng,
      t(
        `For which value of $n$ does the system have no solution?\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ ${k * a}x + ${k * b}y = n \\end{cases}$$`,
        `$n$ 取何值时方程组无解？\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ ${k * a}x + ${k * b}y = n \\end{cases}$$`,
      ),
      t(`Any value except $n = ${k * c}$`, `除 $n = ${k * c}$ 外的任何值`),
      [t(`Only $n = ${k * c}$`, `仅 $n = ${k * c}$`), t(`Only $n = ${c}$`, `仅 $n = ${c}$`), t("No value of $n$", "没有这样的 $n$")],
      t(
        `The left sides are proportional, so the lines are parallel unless $n = ${k}(${c}) = ${k * c}$, which would make them the same line.`,
        `左边成比例，所以两线平行，除非 $n = ${k}(${c}) = ${k * c}$，那时它们是同一条直线。`,
      ),
    );
  }),
  ineqTips(
    "Constructing Models With One-Variable Linear Inequalities",
    "构造一元一次不等式模型",
    ["introduction-to-modeling-with-inequalities"],
    (rng, hard) => {
      const f = 5 * rng.int(2, 9);
      const r = rng.int(3, 12);
      const T = 10 * rng.int(10, 40);
      const atLeast = rng.bool();
      const sym = atLeast ? "\\ge" : "\\le";
      const w = atLeast ? t("at least", "至少") : t("at most", "至多");
      const flip = atLeast ? "\\le" : "\\ge";
      if (!hard)
        return mc(
          rng,
          t(
            `A club has $\\$${f}$ and earns $\\$${r}$ for each item it sells. It wants to have ${w.en} $\\$${T}$ in all. Which inequality represents this, where $n$ is the number of items sold?`,
            `某社团有 $${f}$ 美元，每卖一件物品赚 $${r}$ 美元。它希望总共${w["zh-CN"]}有 $${T}$ 美元。设卖出 $n$ 件，哪个不等式表示这一情况？`,
          ),
          `${f} + ${r}n ${sym} ${T}`,
          [`${f} + ${r}n ${flip} ${T}`, `${r} + ${f}n ${sym} ${T}`, `${f}n + ${r} ${flip} ${T}`, `${f + r}n ${sym} ${T}`],
          t(
            `The money so far plus the earnings is $${f} + ${r}n$, and ${w.en} gives $${sym}$.`,
            `已有的钱加上收入是 $${f} + ${r}n$，“${w["zh-CN"]}”对应 $${sym}$。`,
          ),
        );
      const w2 = rng.int(100, 200);
      return mc(
        rng,
        t(
          `An elevator can carry at most $${10 * T}$ pounds. A $${w2}$-pound operator rides with $b$ boxes of $${r * 5}$ pounds each. Which inequality gives the allowed values of $b$?`,
          `电梯最多载重 $${10 * T}$ 磅。一位 $${w2}$ 磅的操作员带着 $b$ 个箱子，每箱 $${r * 5}$ 磅。哪个不等式给出 $b$ 的允许值？`,
        ),
        `${w2} + ${r * 5}b \\le ${10 * T}`,
        [`${w2} + ${r * 5}b \\ge ${10 * T}`, `${r * 5} + ${w2}b \\le ${10 * T}`, `${r * 5}b \\le ${w2}`],
        t(`The total load is the operator plus the boxes, and at most means $\\le$.`, `总载重是操作员加箱子，“最多”对应 $\\le$。`),
      );
    },
  ),
  ineqTips(
    "Modeling and Solving With One-Variable Linear Inequalities",
    "用一元不等式建模并求解",
    ["modeling-with-one-step-inequalities", "modeling-real-world-problems-using-inequalities"],
    (rng, hard) => {
      const f = 5 * rng.int(2, 9);
      const r = rng.int(3, 12);
      const n = rng.int(6, 25);
      const extra = rng.int(1, r - 1);
      if (!hard) {
        const T = f + r * n + extra;
        return spr(
          t(
            `A plan costs $\\$${f}$ plus $\\$${r}$ per day. What is the greatest number of whole days a customer can use the plan with a budget of $\\$${T}$?`,
            `一个方案收费 $${f}$ 美元，另加每天 $${r}$ 美元。预算为 $${T}$ 美元时，顾客最多能用多少整天？`,
          ),
          n,
          [n + 1, Q.of(T, r), n - 1],
          t(
            `Solve $${f} + ${r}d \\le ${T}$: $d \\le \\frac{${T - f}}{${r}}$, which lies between $${n}$ and $${n + 1}$, so the greatest whole number of days is $${n}$.`,
            `解 $${f} + ${r}d \\le ${T}$：$d \\le \\frac{${T - f}}{${r}}$，它在 $${n}$ 与 $${n + 1}$ 之间，所以最多 $${n}$ 整天。`,
          ),
        );
      }
      const T = f + r * n - extra;
      return spr(
        t(
          `A club has $\\$${f}$ and earns $\\$${r}$ per item sold. What is the least whole number of items it must sell to have at least $\\$${T}$?`,
          `某社团有 $${f}$ 美元，每卖一件赚 $${r}$ 美元。要至少有 $${T}$ 美元，至少要卖多少件（整数）？`,
        ),
        n,
        [n - 1, n + 1, Q.of(T, r)],
        t(
          `Solve $${f} + ${r}n \\ge ${T}$: $n \\ge \\frac{${T - f}}{${r}}$, which lies between $${n - 1}$ and $${n}$, so round up to $${n}$.`,
          `解 $${f} + ${r}n \\ge ${T}$：$n \\ge \\frac{${T - f}}{${r}}$，它在 $${n - 1}$ 与 $${n}$ 之间，所以向上取整为 $${n}$。`,
        ),
      );
    },
  ),
  ineqTips(
    "Modeling and Solving With One-Variable Linear Inequalities: Advanced Cases",
    "一元不等式建模求解：进阶情形",
    ["modeling-real-world-problems-using-inequalities"],
    (rng, hard) => {
      const a = rng.int(2, 6);
      const b = a + rng.int(2, 6);
      const n = rng.int(5, 20);
      const gap = (b - a) * n - rng.int(1, b - a > 1 ? b - a - 1 : 1) + (b - a > 1 ? 0 : 1);
      if (!hard)
        return spr(
          t(
            `Plan A costs $\\$${gap}$ plus $\\$${a}$ per use. Plan B costs $\\$${b}$ per use with no fee. What is the least whole number of uses for which plan A costs less than plan B?`,
            `方案 A 收费 $${gap}$ 美元，另加每次 $${a}$ 美元。方案 B 每次 $${b}$ 美元，无其他费用。至少使用多少次（整数）时方案 A 比方案 B 便宜？`,
          ),
          Math.floor(gap / (b - a)) + 1,
          [Math.floor(gap / (b - a)), Math.floor(gap / (b - a)) + 2, gap],
          t(
            `Solve $${gap} + ${a}n < ${b}n$: $n > \\frac{${gap}}{${b - a}}$. The next whole number is $${Math.floor(gap / (b - a)) + 1}$.`,
            `解 $${gap} + ${a}n < ${b}n$：$n > \\frac{${gap}}{${b - a}}$。下一个整数是 $${Math.floor(gap / (b - a)) + 1}$。`,
          ),
        );
      const box = rng.int(3, 8) * rng.int(5, 9);
      const m = rng.int(6, 12);
      const tools = 10 * rng.int(4, 12);
      const limit = tools + box * m + rng.int(1, box - 1);
      const ignored = Math.floor(limit / box);
      return spr(
        t(
          `A truck can carry at most $${limit}$ kilograms and already holds $${tools}$ kilograms of tools. Crates weigh $${box}$ kilograms each. What is the greatest number of crates that can be added?`,
          `一辆卡车最多载重 $${limit}$ 千克，车上已有 $${tools}$ 千克工具。每个板条箱重 $${box}$ 千克。最多还能装多少个板条箱？`,
        ),
        m,
        [m + 1, ignored === m ? m - 1 : ignored, Q.of(limit - tools, box)],
        t(
          `The tools and the crates share the limit. Solve $${tools} + ${box}c \\le ${limit}$ to get $c \\le \\frac{${limit - tools}}{${box}}$, and round down to $${m}$, since only whole crates can be added.`,
          `工具和板条箱共用载重上限。解 $${tools} + ${box}c \\le ${limit}$ 得 $c \\le \\frac{${limit - tools}}{${box}}$，只能装整箱，所以向下取整为 $${m}$。`,
        ),
      );
    },
  ),
  ineqTips("Compound Inequalities", "复合不等式", ["compound-inequalities"], (rng, hard) => {
    const a = rng.int(2, 5);
    const b = rng.int(1, 9);
    const lo = rng.int(-3, 3);
    const hi = lo + rng.int(3, 6);
    const inside = rng.int(lo + 1, hi - 1);
    if (!hard)
      return mcExact(
        rng,
        t(
          `Which value of $x$ satisfies $${a * lo + b} < ${a}x + ${b} < ${a * hi + b}$?`,
          `哪个 $x$ 的值满足 $${a * lo + b} < ${a}x + ${b} < ${a * hi + b}$？`,
        ),
        inside,
        rng.bool() ? [lo, hi, hi + 1] : [lo - 1, lo, hi],
        t(
          `Subtract $${b}$ and divide by $${a}$: $${lo} < x < ${hi}$. Only $${inside}$ lies strictly between, and the endpoints are excluded.`,
          `减 $${b}$ 再除以 $${a}$：$${lo} < x < ${hi}$。只有 $${inside}$ 严格在其间，端点不包括在内。`,
        ),
      );
    const count = hi - lo + 1;
    return spr(
      t(
        `How many integers $x$ satisfy $${a * lo + b} \\le ${a}x + ${b} \\le ${a * hi + b}$?`,
        `有多少个整数 $x$ 满足 $${a * lo + b} \\le ${a}x + ${b} \\le ${a * hi + b}$？`,
      ),
      count,
      [count - 1, count - 2, hi],
      t(
        `Simplify to $${lo} \\le x \\le ${hi}$. Both ends count, so there are $${hi} - ${par(lo)} + 1 = ${count}$ integers.`,
        `化简为 $${lo} \\le x \\le ${hi}$。两端都计入，所以共 $${hi} - ${par(lo)} + 1 = ${count}$ 个整数。`,
      ),
    );
  }),
  ineqTips("Constructing Models With Compound Inequalities", "构造复合不等式模型", ["compound-inequalities"], (rng, hard) => {
    const lo = 5 * rng.int(4, 10);
    const hi = lo + 5 * rng.int(2, 8);
    const f = rng.int(5, 15);
    const r = rng.int(2, 8);
    if (!hard)
      return mc(
        rng,
        t(
          `A recipe needs between $${lo}$ and $${hi}$ grams of salt, inclusive. Which inequality represents the amount $s$ of salt, in grams?`,
          `一个配方需要 $${lo}$ 到 $${hi}$ 克盐（含端点）。哪个不等式表示盐量 $s$（克）？`,
        ),
        `${lo} \\le s \\le ${hi}`,
        [`${lo} < s < ${hi}`, `s \\le ${lo} \\text{ or } s \\ge ${hi}`, `${hi} \\le s \\le ${lo}`],
        t(`Inclusive means both ends are allowed, so both signs are $\\le$.`, `“含端点”表示两端都允许，所以两个符号都是 $\\le$。`),
      );
    return mc(
      rng,
      t(
        `A student wants to spend at least $\\$${lo}$ and at most $\\$${hi}$. There is a $\\$${f}$ fee and each item costs $\\$${r}$. Which inequality represents the number $n$ of items?`,
        `一名学生想花至少 $${lo}$ 美元、至多 $${hi}$ 美元。手续费 $${f}$ 美元，每件 $${r}$ 美元。哪个不等式表示件数 $n$？`,
      ),
      `${lo} \\le ${f} + ${r}n \\le ${hi}`,
      [
        `${lo} \\le ${r} + ${f}n \\le ${hi}`,
        `${lo} < ${f} + ${r}n < ${hi}`,
        `${lo} \\le ${r}n \\le ${hi}`,
        `${lo} \\le ${f} + ${r}n \\le ${hi + 5}`,
      ],
      t(
        `The amount spent is $${f} + ${r}n$, and it must lie between the two limits, inclusive.`,
        `花费是 $${f} + ${r}n$，它必须在两个限度之间（含端点）。`,
      ),
    );
  }),
  twoIneqTips(
    "Solutions of Two-Variable Linear Inequalities",
    "二元一次不等式的解",
    ["graphing-strict-linear-inequalities"],
    (rng, hard) => {
      const a = rng.int(2, 6);
      const b = rng.int(2, 6);
      const c = rng.int(10, 30);
      const x0 = rng.int(0, 2);
      const y0 = rng.int(0, 1);
      const fine = `(${x0}, ${y0})`;
      const big = (k: number) => `(${Math.ceil(c / a) + k}, ${Math.ceil(c / b) + k})`;
      const safe = a * x0 + b * y0 < c;
      if (!hard)
        return mc(
          rng,
          t(`Which point is a solution of $${a}x + ${b}y < ${c}$?`, `哪个点是 $${a}x + ${b}y < ${c}$ 的解？`),
          safe ? fine : "(0, 0)",
          [big(0), big(1), big(2)],
          t(
            `Substitute each point. Only the correct point gives a value below $${c}$; the others are too large.`,
            `逐点代入。只有正确的点给出小于 $${c}$ 的值，其他点都太大。`,
          ),
        );
      const k = rng.int(1, 5);
      const lim = a * k + b * y0;
      return spr(
        t(
          `The point $(x, ${y0})$ is a solution of $${a}x + ${b}y \\le ${lim}$. What is the greatest possible value of $x$?`,
          `点 $(x, ${y0})$ 是 $${a}x + ${b}y \\le ${lim}$ 的解。$x$ 的最大可能值是多少？`,
        ),
        k,
        [k + 1, lim, y0 + k + 1],
        t(
          `Substitute $y = ${y0}$: $${a}x + ${b * y0} \\le ${lim}$, so $${a}x \\le ${a * k}$ and $x \\le ${k}$.`,
          `代入 $y = ${y0}$：$${a}x + ${b * y0} \\le ${lim}$，所以 $${a}x \\le ${a * k}$，$x \\le ${k}$。`,
        ),
      );
    },
  ),
  twoIneqTips(
    "Modeling With Two-Variable Linear Inequalities",
    "用二元不等式建模",
    ["modeling-with-two-variable-inequalities"],
    (rng, hard) => {
      const a = rng.int(5, 15);
      const b = rng.int(2, a - 1);
      const T = 10 * rng.int(10, 50);
      if (!hard)
        return mc(
          rng,
          t(
            `Pizzas cost $\\$${a}$ and salads cost $\\$${b}$. A group can spend at most $\\$${T}$. Which inequality represents $p$ pizzas and $s$ salads within the budget?`,
            `比萨 $${a}$ 美元，沙拉 $${b}$ 美元。一个小组最多花 $${T}$ 美元。哪个不等式表示预算内的 $p$ 个比萨和 $s$ 份沙拉？`,
          ),
          `${a}p + ${b}s \\le ${T}`,
          [`${a}p + ${b}s \\ge ${T}`, `${b}p + ${a}s \\le ${T}`, `p + s \\le ${T}`],
          t(`The cost is price times count for each item, and at most means $\\le$.`, `每种费用是单价乘以数量，“最多”对应 $\\le$。`),
        );
      const k = rng.int(5, 12);
      return mc(
        rng,
        t(
          `A worker earns $\\$${a}$ per hour tutoring and $\\$${b}$ per hour at a shop. Each week the worker tutors for $t$ hours, which must be at least $${k}$, and works $h$ hours at the shop, and wants to earn at least $\\$${T}$. Which inequality gives the earnings condition?`,
          `一名员工做家教每小时赚 $${a}$ 美元，在商店每小时赚 $${b}$ 美元，每周做家教 $t$ 小时（至少 $${k}$ 小时），在商店工作 $h$ 小时，目标是至少赚 $${T}$ 美元。哪个不等式给出收入条件？`,
        ),
        `${a}t + ${b}h \\ge ${T}`,
        [`${a}t + ${b}h \\le ${T}`, `t + h \\ge ${T}`, `${b}t + ${a}h \\ge ${T}`],
        t(
          `The earnings add the two jobs, and at least means $\\ge$. The minimum of $${k}$ tutoring hours is a separate condition on $t$.`,
          `收入是两份工作之和，“至少”对应 $\\ge$。至少 $${k}$ 小时家教是关于 $t$ 的另一个条件。`,
        ),
      );
    },
  ),
  twoIneqTips(
    "Modeling and Solving Two-Variable Linear Inequalities",
    "二元不等式建模并求解",
    ["modeling-with-two-variable-inequalities"],
    (rng, hard) => {
      const a = rng.int(5, 15);
      const b = rng.int(2, a - 1);
      const p = rng.int(2, 8);
      const s = rng.int(4, 15);
      const T = a * p + b * s + rng.int(0, b - 1);
      if (!hard)
        return spr(
          t(
            `Pizzas cost $\\$${a}$ and salads cost $\\$${b}$. A group has $\\$${T}$ and buys $${p}$ pizzas. What is the greatest number of salads it can buy?`,
            `比萨 $${a}$ 美元，沙拉 $${b}$ 美元。一个小组有 $${T}$ 美元，买了 $${p}$ 个比萨。最多还能买多少份沙拉？`,
          ),
          s,
          [s + 1, Q.of(T, b), T - a * p],
          t(
            `Solve $${a}(${p}) + ${b}s \\le ${T}$: $${b}s \\le ${T - a * p}$, and rounding down gives $${s}$ salads.`,
            `解 $${a}(${p}) + ${b}s \\le ${T}$：$${b}s \\le ${T - a * p}$，向下取整得 $${s}$ 份。`,
          ),
        );
      const need = a * p + b * s - rng.int(0, b - 1);
      return spr(
        t(
          `A store earns $\\$${a}$ per large item and $\\$${b}$ per small item, and it has sold $${p}$ large items. What is the least number of small items it must sell to earn at least $\\$${need}$ in all?`,
          `商店每件大商品赚 $${a}$ 美元，每件小商品赚 $${b}$ 美元，已卖出 $${p}$ 件大商品。要总共至少赚 $${need}$ 美元，至少要卖多少件小商品？`,
        ),
        s,
        [s - 1, s + 1, Q.of(need, b)],
        t(
          `The large items brought $${a * p}$ dollars. Solve $${a * p} + ${b}s \\ge ${need}$, and round up to $${s}$.`,
          `大商品带来 $${a * p}$ 美元。解 $${a * p} + ${b}s \\ge ${need}$，向上取整得 $${s}$。`,
        ),
      );
    },
  ),
  twoIneqTips("Systems of Two-Variable Inequalities", "二元不等式组", ["systems-of-linear-inequalities"], (rng, hard) => {
    const m = rng.int(1, 4);
    const b = rng.int(1, 6);
    const x0 = rng.int(1, 3);
    const y0 = m * x0 + b + 1;
    const lim = x0 + y0 + rng.int(1, 3);
    const sys = `\\begin{cases} y > ${cx(m)} ${sg(b)} \\\\ x + y < ${lim} \\end{cases}`;
    if (!hard)
      return mc(
        rng,
        t(`Which point is a solution of the system?\n$$${sys}$$`, `哪个点是不等式组的解？\n$$${sys}$$`),
        `(${x0}, ${y0})`,
        [`(${x0}, ${m * x0 + b})`, `(${x0}, ${lim - x0})`, `(${x0 + lim}, ${y0})`, `(${x0}, ${m * x0 + b - 1})`],
        t(
          `The point must be strictly above the line and strictly below $x + y = ${lim}$. Substituting shows only $(${x0}, ${y0})$ satisfies both.`,
          `这个点必须严格在直线上方，且严格在 $x + y = ${lim}$ 下方。代入可知只有 $(${x0}, ${y0})$ 同时满足。`,
        ),
      );
    return spr(
      t(
        `If $x = ${x0}$, what is the greatest integer value of $y$ that satisfies the system?\n$$${sys}$$`,
        `若 $x = ${x0}$，满足不等式组的 $y$ 的最大整数值是多少？\n$$${sys}$$`,
      ),
      lim - x0 - 1,
      [lim - x0, m * x0 + b, m * x0 + b + 1 === lim - x0 - 1 ? lim : m * x0 + b + 1],
      t(
        `At $x = ${x0}$, the system says $${m * x0 + b} < y < ${lim - x0}$, so the greatest integer is $${lim - x0 - 1}$.`,
        `当 $x = ${x0}$ 时，不等式组给出 $${m * x0 + b} < y < ${lim - x0}$，所以最大整数是 $${lim - x0 - 1}$。`,
      ),
    );
  }),
  twoIneqTips("Modeling With Systems of Inequalities", "用不等式组建模", ["modeling-with-systems-of-inequalities"], (rng, hard) => {
    const a = rng.int(5, 15);
    const b = rng.int(2, a - 1);
    const T = 10 * rng.int(10, 50);
    const n = rng.int(20, 60);
    const min = rng.int(3, 9);
    const good = hard
      ? `\\begin{cases} ${a}x + ${b}y \\le ${T} \\\\ x + y \\ge ${n} \\\\ x \\ge ${min} \\end{cases}`
      : `\\begin{cases} ${a}x + ${b}y \\le ${T} \\\\ x + y \\ge ${n} \\end{cases}`;
    const wrong = hard
      ? [
          `\\begin{cases} ${a}x + ${b}y \\ge ${T} \\\\ x + y \\ge ${n} \\\\ x \\ge ${min} \\end{cases}`,
          `\\begin{cases} ${a}x + ${b}y \\le ${T} \\\\ x + y \\le ${n} \\\\ x \\ge ${min} \\end{cases}`,
          `\\begin{cases} ${a}x + ${b}y \\le ${T} \\\\ x + y \\ge ${n} \\\\ x \\le ${min} \\end{cases}`,
        ]
      : [
          `\\begin{cases} ${a}x + ${b}y \\ge ${T} \\\\ x + y \\ge ${n} \\end{cases}`,
          `\\begin{cases} ${a}x + ${b}y \\le ${T} \\\\ x + y \\le ${n} \\end{cases}`,
          `\\begin{cases} x + y \\le ${T} \\\\ ${a}x + ${b}y \\ge ${n} \\end{cases}`,
        ];
    return mc(
      rng,
      t(
        `A planner buys $x$ large chairs at $\\$${a}$ each and $y$ small chairs at $\\$${b}$ each. The budget is at most $\\$${T}$, and at least $${n}$ chairs are needed${hard ? `, including at least $${min}$ large chairs` : ""}. Which system represents this?`,
        `一位策划人买 $x$ 把大椅子，每把 $${a}$ 美元；$y$ 把小椅子，每把 $${b}$ 美元。预算最多 $${T}$ 美元，至少需要 $${n}$ 把椅子${hard ? `，其中大椅子至少 $${min}$ 把` : ""}。哪个不等式组表示这一情况？`,
      ),
      good,
      wrong,
      t(
        `Translate each condition: at most gives $\\le$ on the cost and at least gives $\\ge$ on the count${hard ? " and on the large chairs" : ""}.`,
        `逐条翻译：“最多”对成本给出 $\\le$，“至少”对数量给出 $\\ge$${hard ? "，对大椅子也是" : ""}。`,
      ),
    );
  }),
  twoIneqTips(
    "Modeling and Solving Systems of Linear Inequalities",
    "不等式组建模并求解",
    ["modeling-with-systems-of-inequalities"],
    (rng, hard) => {
      const a = rng.int(6, 15);
      const b = rng.int(2, a - 2);
      const x0 = rng.int(3, 10);
      const y0 = rng.int(3, 15);
      const T = a * x0 + b * y0;
      const n = x0 + y0;
      if (!hard)
        return spr(
          t(
            `A planner buys large chairs at $\\$${a}$ each and small chairs at $\\$${b}$ each, and needs at least $${n}$ chairs for at most $\\$${T}$. What is the greatest number of large chairs possible?`,
            `一位策划人以每把 $${a}$ 美元买大椅子，每把 $${b}$ 美元买小椅子，至少需要 $${n}$ 把椅子，最多花 $${T}$ 美元。大椅子最多能买多少把？`,
          ),
          x0,
          [y0, n, Q.of(T, a)],
          t(
            `Use as few chairs as allowed, $${n}$, to leave money for large ones. With $x$ large and $${n} - x$ small: $${a}x + ${b}(${n} - x) \\le ${T}$ gives $${a - b}x \\le ${T - b * n}$, so $x \\le ${x0}$.`,
            `用尽量少的 $${n}$ 把椅子，把钱留给大椅子。设大椅子 $x$ 把，小椅子 $${n} - x$ 把：$${a}x + ${b}(${n} - x) \\le ${T}$ 得 $${a - b}x \\le ${T - b * n}$，所以 $x \\le ${x0}$。`,
          ),
        );
      return spr(
        t(
          `A planner buys large chairs at $\\$${a}$ each and small chairs at $\\$${b}$ each, for at most $\\$${T}$. What is the greatest number of chairs in total if at least $${x0}$ must be large?`,
          `一位策划人以每把 $${a}$ 美元买大椅子，每把 $${b}$ 美元买小椅子，最多花 $${T}$ 美元。若至少 $${x0}$ 把必须是大椅子，椅子总数最多是多少？`,
        ),
        n,
        [y0, Q.of(T, a + b), Q.of(T, b)],
        t(
          `Small chairs are cheaper, so buy only the required $${x0}$ large ones: $${a * x0}$ dollars. The remaining $${b * y0}$ dollars buy $${y0}$ small chairs, for $${n}$ in all.`,
          `小椅子更便宜，所以只买必需的 $${x0}$ 把大椅子：$${a * x0}$ 美元。剩下的 $${b * y0}$ 美元买 $${y0}$ 把小椅子，共 $${n}$ 把。`,
        ),
      );
    },
  ),
];
