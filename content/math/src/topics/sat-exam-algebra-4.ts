import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { cx, mc, mcExact, par, sg, spec, spr, step, words, worked } from "../exam.ts";
import { linesFigure } from "../exam-figures.ts";

// SAT Math Prep, Algebra: systems of linear equations, special solution counts, and linear inequalities.

/** satExamAlgebra4 finishes the SAT Algebra unit. */
export const satExamAlgebra4: ExamSpec[] = [
  spec("Solving Simple Systems of Linear Equations", "解简单的二元一次方程组", ["systems-of-linear-equations"], (rng, hard) => {
    const x0 = rng.int(1, 9);
    const m = rng.int(2, 6);
    const b = rng.int(-6, 9);
    const y0 = m * x0 + b;
    const c = rng.int(2, 5);
    const T = c * x0 + y0;
    const sys = `\\begin{cases} y = ${m}x ${sg(b)} \\\\ ${c}x + y = ${T} \\end{cases}`;
    const solveX = step(
      "Substitute",
      "代入",
      `The first equation gives $y$ directly, so replace $y$ in the second: $${c}x + ${b === 0 ? `${m}x` : `(${m}x ${sg(b)})`} = ${T}$, which is $${c + m}x ${sg(b)} = ${T}$. ${b === 0 ? "So " : `Then $${c + m}x = ${T - b}$ and `}$x = ${x0}$.`,
      `第一个方程直接给出 $y$，把它代入第二个：$${c}x + ${b === 0 ? `${m}x` : `(${m}x ${sg(b)})`} = ${T}$，即 $${c + m}x ${sg(b)} = ${T}$。${b === 0 ? "所以 " : `于是 $${c + m}x = ${T - b}$，`}$x = ${x0}$。`,
    );
    const backY = step(
      "Find y",
      "求另一个未知数",
      `Put $x = ${x0}$ into the first equation: $y = ${m} \\times ${x0} ${sg(b)} = ${y0}$, so the solution is $(${x0}, ${y0})$.`,
      `把 $x = ${x0}$ 代入第一个方程：$y = ${m} \\times ${x0} ${sg(b)} = ${y0}$，所以解是 $(${x0}, ${y0})$。`,
    );
    const check = t(
      `In the second equation, $${c} \\times ${x0} + ${par(y0)} = ${T}$.`,
      `代入第二个方程，$${c} \\times ${x0} + ${par(y0)} = ${T}$。`,
    );
    if (!hard)
      return mc(
        rng,
        t(`What is the solution $(x, y)$ to the system?\n$$${sys}$$`, `方程组的解 $(x, y)$ 是什么？\n$$${sys}$$`),
        `(${x0}, ${y0})`,
        [`(${y0}, ${x0})`, `(${x0}, ${T - y0})`, `(${x0 + 1}, ${y0})`, `(${x0}, ${y0 + 1})`, `(${x0 + 1}, ${y0 + 2})`],
        worked([solveX, backY], check, [
          t(`This swaps the coordinates; the pair is written $(x, y)$.`, `这是把坐标写反了；数对的顺序是 $(x, y)$。`),
          t(
            `This $y$-value is the term $${c}x = ${c * x0}$, not $y$; the first equation gives $y = ${y0}$ at $x = ${x0}$.`,
            `这个 $y$ 值是 $${c}x = ${c * x0}$ 这一项，不是 $y$；第一个方程在 $x = ${x0}$ 时给出 $y = ${y0}$。`,
          ),
          t(
            `At $x = ${x0 + 1}$ the first equation gives $y = ${y0 + m}$, not $${y0}$.`,
            `$x = ${x0 + 1}$ 时第一个方程给出 $y = ${y0 + m}$，而不是 $${y0}$。`,
          ),
          t(
            `At $x = ${x0}$ the first equation gives $y = ${y0}$, not $${y0 + 1}$.`,
            `$x = ${x0}$ 时第一个方程给出 $y = ${y0}$，而不是 $${y0 + 1}$。`,
          ),
          t(
            `In the second equation this gives $${c} \\times ${x0 + 1} + ${par(y0 + 2)} = ${T + c + 2}$, not $${T}$.`,
            `代入第二个方程得 $${c} \\times ${x0 + 1} + ${par(y0 + 2)} = ${T + c + 2}$，而不是 $${T}$。`,
          ),
        ]),
      );
    return spr(
      t(
        `If $(x, y)$ is the solution to the system, what is the value of $x + y$?\n$$${sys}$$`,
        `若 $(x, y)$ 是方程组的解，则 $x + y$ 的值是多少？\n$$${sys}$$`,
      ),
      x0 + y0,
      [x0, y0, T],
      worked(
        [
          solveX,
          step(
            "Add the values",
            "求和",
            `Then $y = ${m} \\times ${x0} ${sg(b)} = ${y0}$, and $x + y = ${x0} + ${par(y0)} = ${x0 + y0}$.`,
            `于是 $y = ${m} \\times ${x0} ${sg(b)} = ${y0}$，$x + y = ${x0} + ${par(y0)} = ${x0 + y0}$。`,
          ),
        ],
        check,
        [
          t(`This is $x$ alone; the question asks for $x + y$.`, `这只是 $x$；题目问的是 $x + y$。`),
          t(`This is $y$ alone; the question asks for $x + y$.`, `这只是 $y$；题目问的是 $x + y$。`),
          t(
            `This is the right side of the second equation, $${c}x + y$, not $x + y$.`,
            `这是第二个方程的右边，即 $${c}x + y$，不是 $x + y$。`,
          ),
        ],
      ),
    );
  }),
  spec(
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
          worked(
            [
              step(
                "Add the equations",
                "两式相加",
                `The coefficients are swapped between the equations, so adding them gives each variable the same coefficient: $${a + b}x + ${a + b}y = ${p} + ${q} = ${p + q}$.`,
                `两个方程的系数互换，相加后两个变量的系数相同：$${a + b}x + ${a + b}y = ${p} + ${q} = ${p + q}$。`,
              ),
              step(
                "Divide",
                "两边相除",
                `Factor out $${a + b}$: $${a + b}(x + y) = ${p + q}$, so $x + y = \\frac{${p + q}}{${a + b}} = ${x0 + y0}$.`,
                `提出 $${a + b}$：$${a + b}(x + y) = ${p + q}$，所以 $x + y = \\frac{${p + q}}{${a + b}} = ${x0 + y0}$。`,
              ),
            ],
            t(
              `The system is solved by $x = ${x0}$, $y = ${y0}$: $${a} \\times ${x0} + ${b} \\times ${y0} = ${p}$ and $${b} \\times ${x0} + ${a} \\times ${y0} = ${q}$, and $${x0} + ${y0} = ${x0 + y0}$.`,
              `方程组的解是 $x = ${x0}$，$y = ${y0}$：$${a} \\times ${x0} + ${b} \\times ${y0} = ${p}$，$${b} \\times ${x0} + ${a} \\times ${y0} = ${q}$，而 $${x0} + ${y0} = ${x0 + y0}$。`,
            ),
            [
              t(`This is the sum of the equations before dividing by $${a + b}$.`, `这是两式之和，还没有除以 $${a + b}$。`),
              t(`This is the value of $x$ alone, not $x + y$.`, `这只是 $x$ 的值，不是 $x + y$。`),
              t(
                `This divides by $${a}$, one coefficient, instead of by the sum $${a + b}$.`,
                `这是除以了一个系数 $${a}$，而不是系数之和 $${a + b}$。`,
              ),
            ],
          ),
        );
      return spr(
        t(`Given the system, what is the value of $x - y$?\n$$${sys}$$`, `已知方程组，$x - y$ 的值是多少？\n$$${sys}$$`),
        x0 - y0,
        [y0 - x0, x0 + y0, q - p],
        worked(
          [
            step(
              "Subtract the equations",
              "两式相减",
              `Subtract the first equation from the second, term by term: $${cx(b - a)} ${b - a === 1 ? "- y" : `- ${b - a}y`} = ${q} - ${p} = ${q - p}$.`,
              `用第二个方程逐项减去第一个：$${cx(b - a)} ${b - a === 1 ? "- y" : `- ${b - a}y`} = ${q} - ${p} = ${q - p}$。`,
            ),
            step(
              "Divide",
              "两边相除",
              b - a === 1
                ? `The left side is already $x - y$, so $x - y = ${q - p}$.`
                : `Factor out $${b - a}$: $${b - a}(x - y) = ${q - p}$, so $x - y = \\frac{${q - p}}{${b - a}} = ${x0 - y0}$.`,
              b - a === 1
                ? `左边已经是 $x - y$，所以 $x - y = ${q - p}$。`
                : `提出 $${b - a}$：$${b - a}(x - y) = ${q - p}$，所以 $x - y = \\frac{${q - p}}{${b - a}} = ${x0 - y0}$。`,
            ),
          ],
          t(
            `The system is solved by $x = ${x0}$, $y = ${y0}$: $${a} \\times ${x0} + ${b} \\times ${y0} = ${p}$ and $${b} \\times ${x0} + ${a} \\times ${y0} = ${q}$, and $${x0} - ${y0} = ${x0 - y0}$.`,
            `方程组的解是 $x = ${x0}$，$y = ${y0}$：$${a} \\times ${x0} + ${b} \\times ${y0} = ${p}$，$${b} \\times ${x0} + ${a} \\times ${y0} = ${q}$，而 $${x0} - ${y0} = ${x0 - y0}$。`,
          ),
          [
            t(`This is $y - x$; subtracting in the other order flips the sign.`, `这是 $y - x$；反过来相减符号就反了。`),
            t(`Adding the equations gives $x + y$, not $x - y$.`, `两式相加得到的是 $x + y$，不是 $x - y$。`),
            t(`This is the difference of the equations before dividing by $${b - a}$.`, `这是两式之差，还没有除以 $${b - a}$。`),
          ],
        ),
      );
    },
  ),
  spec("Solving Systems of Equations Using Addition or Subtraction", "用加减法解方程组", ["introduction-to-elimination"], (rng, hard) => {
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
        worked(
          [
            step(
              "Add the equations",
              "两式相加",
              `The $y$ terms are $+${b}y$ and $-${b}y$, opposites, so adding the equations cancels them: $${a + c}x = ${a * x0 + b * y0} + ${par(c * x0 - b * y0)} = ${(a + c) * x0}$.`,
              `$y$ 项是 $+${b}y$ 和 $-${b}y$，互为相反数，两式相加就消去了：$${a + c}x = ${a * x0 + b * y0} + ${par(c * x0 - b * y0)} = ${(a + c) * x0}$。`,
            ),
            step("Divide", "两边相除", `Divide by $${a + c}$: $x = ${x0}$.`, `两边除以 $${a + c}$：$x = ${x0}$。`),
          ],
          t(
            `With $x = ${x0}$, the first equation gives $${b}y = ${b * y0}$, so $y = ${y0}$, and $${c} \\times ${x0} - ${b} \\times ${par(y0)} = ${c * x0 - b * y0}$.`,
            `由 $x = ${x0}$，第一个方程得 $${b}y = ${b * y0}$，所以 $y = ${y0}$，而 $${c} \\times ${x0} - ${b} \\times ${par(y0)} = ${c * x0 - b * y0}$。`,
          ),
          [
            t(
              y0 === x0 ? `This is two more than the value of $x$; the check rules it out.` : `This is the value of $y$, not $x$.`,
              y0 === x0 ? `这比 $x$ 的值大 $2$；检验排除了它。` : `这是 $y$ 的值，不是 $x$ 的值。`,
            ),
            t(`This is one more than the quotient; the check rules it out.`, `这比商大 $1$；检验排除了它。`),
            t(`This is one less than the quotient; the check rules it out.`, `这比商小 $1$；检验排除了它。`),
          ],
        ),
      );
    return spr(
      t(
        `If $(x, y)$ satisfies the system, what is the value of $y$?\n$$${sys}$$`,
        `若 $(x, y)$ 满足方程组，则 $y$ 的值是多少？\n$$${sys}$$`,
      ),
      y0,
      [x0, y0 + 1, -y0],
      worked(
        [
          step(
            "Subtract the equations",
            "两式相减",
            `Both equations have $${b}y$, so subtracting the second from the first cancels $y$: $${cx(c)} = ${(a + c) * x0 + b * y0} - ${par(a * x0 + b * y0)} = ${c * x0}$${c === 1 ? "" : `, so $x = ${x0}$`}.`,
            `两个方程都有 $${b}y$，用第一个减去第二个就消去了 $y$：$${cx(c)} = ${(a + c) * x0 + b * y0} - ${par(a * x0 + b * y0)} = ${c * x0}$${c === 1 ? "" : `，所以 $x = ${x0}$`}。`,
          ),
          step(
            "Find y",
            "求另一个未知数",
            `Put $x = ${x0}$ into the second equation: $${a} \\times ${x0} + ${b}y = ${a * x0 + b * y0}$, so $${b}y = ${b * y0}$ and $y = ${y0}$.`,
            `把 $x = ${x0}$ 代入第二个方程：$${a} \\times ${x0} + ${b}y = ${a * x0 + b * y0}$，所以 $${b}y = ${b * y0}$，$y = ${y0}$。`,
          ),
        ],
        t(
          `In the first equation, $${a + c} \\times ${x0} + ${b} \\times ${par(y0)} = ${(a + c) * x0 + b * y0}$.`,
          `代入第一个方程，$${a + c} \\times ${x0} + ${b} \\times ${par(y0)} = ${(a + c) * x0 + b * y0}$。`,
        ),
        [
          t(`This is the value of $x$; the question asks for $y$.`, `这是 $x$ 的值；题目问的是 $y$。`),
          t(`This is one more than the value of $y$; the check rules it out.`, `这比 $y$ 的值大 $1$；检验排除了它。`),
          t(`This has the wrong sign: $${b}y = ${b * y0}$ gives $y = ${y0}$.`, `符号错了：$${b}y = ${b * y0}$ 得 $y = ${y0}$。`),
        ],
      ),
    );
  }),
  spec("Solving Systems of Equations Using Elimination", "用消元法解方程组", ["elimination-with-two-transformations"], (rng, hard) => {
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
      worked(
        [
          step(
            "Match the y terms",
            "让含纵坐标的项相同",
            d === 1
              ? `Multiply every term of the second equation by $${b}$: $${b * c}x + ${b}y = ${b * (c * x0 + d * y0)}$. Now both equations have $${b}y$.`
              : `Multiply the first equation by $${d}$ and the second by $${b}$: $${a * d}x + ${b * d}y = ${d * (a * x0 + b * y0)}$ and $${b * c}x + ${b * d}y = ${b * (c * x0 + d * y0)}$. Now both have $${b * d}y$.`,
            d === 1
              ? `把第二个方程的每一项乘 $${b}$：$${b * c}x + ${b}y = ${b * (c * x0 + d * y0)}$。现在两个方程都有 $${b}y$。`
              : `第一个方程乘 $${d}$，第二个乘 $${b}$：$${a * d}x + ${b * d}y = ${d * (a * x0 + b * y0)}$，$${b * c}x + ${b * d}y = ${b * (c * x0 + d * y0)}$。现在两者都有 $${b * d}y$。`,
          ),
          step(
            "Subtract",
            "两式相减",
            `Subtracting cancels $y$: $${cx(det)} = ${d * (a * x0 + b * y0)} - ${par(b * (c * x0 + d * y0))} = ${det * x0}$${det === 1 ? "" : `, so $x = ${x0}$`}.`,
            `相减消去 $y$：$${cx(det)} = ${d * (a * x0 + b * y0)} - ${par(b * (c * x0 + d * y0))} = ${det * x0}$${det === 1 ? "" : `，所以 $x = ${x0}$`}。`,
          ),
        ],
        t(
          `With $x = ${x0}$, either equation gives $y = ${y0}$, and $${a} \\times ${par(x0)} + ${b} \\times ${par(y0)} = ${a * x0 + b * y0}$, $${c} \\times ${par(x0)} + ${d} \\times ${par(y0)} = ${c * x0 + d * y0}$.`,
          `由 $x = ${x0}$，任一方程都得 $y = ${y0}$，且 $${a} \\times ${par(x0)} + ${b} \\times ${par(y0)} = ${a * x0 + b * y0}$，$${c} \\times ${par(x0)} + ${d} \\times ${par(y0)} = ${c * x0 + d * y0}$。`,
        ),
        [
          t(
            y0 === x0
              ? `This is one more than the value of $x$; the check rules it out.`
              : `This is the value of $y$; the question asks for $x$.`,
            y0 === x0 ? `这比 $x$ 的值大 $1$；检验排除了它。` : `这是 $y$ 的值；题目问的是 $x$。`,
          ),
          t(`This is one more than the value of $x$; the check rules it out.`, `这比 $x$ 的值大 $1$；检验排除了它。`),
          t(
            -x0 === x0
              ? `This is two more than the value of $x$; the check rules it out.`
              : `This has the wrong sign, as when the subtraction is done in the opposite order on one side only.`,
            -x0 === x0 ? `这比 $x$ 的值大 $2$；检验排除了它。` : `符号错了，就像只在一边把相减的顺序弄反了。`,
          ),
        ],
      ),
    );
  }),
  spec("Modeling Word Problems With Systems of Linear Equations", "用方程组为应用题建模", ["modeling-with-systems"], (rng, hard) => {
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
        worked(
          [
            step(
              "Count the tickets",
              "数票数",
              `There are $x$ adult and $y$ student tickets, $${n}$ in all, so $x + y = ${n}$.`,
              `成人票 $x$ 张，学生票 $y$ 张，共 $${n}$ 张，所以 $x + y = ${n}$。`,
            ),
            step(
              "Count the dollars",
              "算金额",
              `Each adult ticket brings $\\$${a}$, so the adult tickets bring $${a}x$ dollars; the student tickets bring $${b}y$. The total is $${a}x + ${b}y = ${T}$.`,
              `每张成人票 $${a}$ 美元，成人票共 $${a}x$ 美元；学生票共 $${b}y$ 美元。总额为 $${a}x + ${b}y = ${T}$。`,
            ),
          ],
          t(
            `For example, $${x0}$ adult and $${n - x0}$ student tickets satisfy both: $${x0} + ${n - x0} = ${n}$ and $${a} \\times ${x0} + ${b} \\times ${n - x0} = ${T}$.`,
            `例如 $${x0}$ 张成人票和 $${n - x0}$ 张学生票同时满足两式：$${x0} + ${n - x0} = ${n}$，$${a} \\times ${x0} + ${b} \\times ${n - x0} = ${T}$。`,
          ),
          [
            t(
              `This swaps the totals: $${n}$ counts tickets, and $${T}$ counts dollars.`,
              `这是把两个总数交换了：$${n}$ 是票数，$${T}$ 是金额。`,
            ),
            t(`This swaps the prices: adult tickets, $x$, cost $\\$${a}$.`, `这是把单价交换了：成人票 $x$ 每张 $${a}$ 美元。`),
            t(
              `This puts each price in the wrong equation; the ticket count has no prices in it.`,
              `这是把单价放错了方程；票数方程里不应有单价。`,
            ),
          ],
        ),
      );
    return spr(
      t(en, zh),
      x0,
      [n - x0, Q.of(T, a), Q.of(T, a + b)],
      worked(
        [
          step(
            "Write the system",
            "列方程组",
            `The tickets give $x + y = ${n}$ and the dollars give $${a}x + ${b}y = ${T}$. From the first, $y = ${n} - x$.`,
            `由票数得 $x + y = ${n}$，由金额得 $${a}x + ${b}y = ${T}$。由第一个方程，$y = ${n} - x$。`,
          ),
          step(
            "Substitute and solve",
            "代入求解",
            `$${a}x + ${b}(${n} - x) = ${T}$ becomes $${a - b}x + ${b * n} = ${T}$, so $${a - b}x = ${T - b * n}$ and $x = ${x0}$ adult tickets.`,
            `$${a}x + ${b}(${n} - x) = ${T}$ 化为 $${a - b}x + ${b * n} = ${T}$，所以 $${a - b}x = ${T - b * n}$，$x = ${x0}$ 张成人票。`,
          ),
        ],
        t(
          `With $${n - x0}$ student tickets: $${a} \\times ${x0} + ${b} \\times ${n - x0} = ${a * x0} + ${b * (n - x0)} = ${T}$.`,
          `学生票 $${n - x0}$ 张：$${a} \\times ${x0} + ${b} \\times ${n - x0} = ${a * x0} + ${b * (n - x0)} = ${T}$。`,
        ),
        [
          t(`This is the number of student tickets, $y$.`, `这是学生票的张数 $y$。`),
          t(
            `This divides all the money by the adult price, as if every ticket were an adult ticket.`,
            `这是把全部金额除以成人票价，好像每张都是成人票。`,
          ),
          t(`This divides the money by the sum of the prices, which has no meaning here.`, `这是把金额除以两个票价之和，在这里没有意义。`),
        ],
      ),
    );
  }),
  spec("Solving Problems With Systems of Linear Equations", "用方程组解决问题", ["modeling-with-systems"], (rng, hard) => {
    const p = rng.int(3, 12);
    const q = rng.int(2, 9);
    const a = rng.int(2, 5);
    const b = rng.int(1, 4);
    const c = a + rng.int(1, 3);
    const d = b + rng.int(0, 2);
    const T1 = a * p + b * q;
    const T2 = c * p + d * q;
    const det = a * d - b * c;
    const onePen = step(
      "Subtract the purchases",
      "两次购买相减",
      `The extra pen is the only difference, so one pen costs $${3 * p + q} - ${2 * p + q} = ${p}$ dollars.`,
      `多出的一支钢笔是唯一的差别，所以一支钢笔 $${3 * p + q} - ${2 * p + q} = ${p}$ 美元。`,
    );
    const check0 = t(
      `With a pen at $${p}$ and an eraser at $${q}$ dollars: $2 \\times ${p} + ${q} = ${2 * p + q}$ and $3 \\times ${p} + ${q} = ${3 * p + q}$.`,
      `钢笔 $${p}$ 美元、橡皮 $${q}$ 美元时：$2 \\times ${p} + ${q} = ${2 * p + q}$，$3 \\times ${p} + ${q} = ${3 * p + q}$。`,
    );
    const elim =
      d === b
        ? step(
            "Subtract the purchases",
            "两次购买相减",
            `Let $p$ be the price of a pen and $e$ of an eraser: $${cx(a, "p")} + ${cx(b, "e")} = ${T1}$ and $${cx(c, "p")} + ${cx(d, "e")} = ${T2}$. Both have $${cx(b, "e")}$, so subtracting the first from the second leaves $${cx(c - a, "p")} = ${T2 - T1}$, and $p = ${p}$.`,
            `设钢笔每支 $p$ 美元、橡皮每块 $e$ 美元：$${cx(a, "p")} + ${cx(b, "e")} = ${T1}$，$${cx(c, "p")} + ${cx(d, "e")} = ${T2}$。两式都有 $${cx(b, "e")}$，第二式减第一式得 $${cx(c - a, "p")} = ${T2 - T1}$，$p = ${p}$。`,
          )
        : step(
            "Eliminate the erasers",
            "消去橡皮",
            `Let $p$ be the price of a pen and $e$ of an eraser: $${cx(a, "p")} + ${cx(b, "e")} = ${T1}$ and $${cx(c, "p")} + ${cx(d, "e")} = ${T2}$. Multiply the first by $${d}$ and the second by $${b}$ so both have $${cx(b * d, "e")}$: $${a * d}p + ${cx(b * d, "e")} = ${d * T1}$ and $${b * c}p + ${cx(b * d, "e")} = ${b * T2}$. Subtracting gives $${cx(det, "p")} = ${det * p}$, so $p = ${p}$.`,
            `设钢笔每支 $p$ 美元、橡皮每块 $e$ 美元：$${cx(a, "p")} + ${cx(b, "e")} = ${T1}$，$${cx(c, "p")} + ${cx(d, "e")} = ${T2}$。第一式乘 $${d}$、第二式乘 $${b}$，使两式都有 $${cx(b * d, "e")}$：$${a * d}p + ${cx(b * d, "e")} = ${d * T1}$，$${b * c}p + ${cx(b * d, "e")} = ${b * T2}$。相减得 $${cx(det, "p")} = ${det * p}$，所以 $p = ${p}$。`,
          );
    const checkT = t(
      `With $p = ${p}$ and $e = ${q}$: $${a} \\times ${p} + ${b} \\times ${q} = ${T1}$ and $${c} \\times ${p} + ${d} \\times ${q} = ${T2}$.`,
      `当 $p = ${p}$，$e = ${q}$ 时：$${a} \\times ${p} + ${b} \\times ${q} = ${T1}$，$${c} \\times ${p} + ${d} \\times ${q} = ${T2}$。`,
    );
    const diffWhy = t(
      `This is the difference of the two totals, which pays for $${c - a}$ more ${c - a === 1 ? "pen" : "pens"}${d > b ? ` and $${d - b}$ more ${d - b === 1 ? "eraser" : "erasers"}` : ""}, not for one pen.`,
      `这是两个总价之差，买的是多出的 $${c - a}$ 支钢笔${d > b ? `和 $${d - b}$ 块橡皮` : ""}，而不是一支钢笔。`,
    );
    if (det === 0 && hard)
      return spr(
        t(
          `Two pens and one eraser cost $\\$${2 * p + q}$. Three pens and one eraser cost $\\$${3 * p + q}$. What is the total price of one pen and one eraser, in dollars?`,
          `两支钢笔和一块橡皮共 $${2 * p + q}$ 美元。三支钢笔和一块橡皮共 $${3 * p + q}$ 美元。一支钢笔和一块橡皮共多少美元？`,
        ),
        p + q,
        [p, q, 2 * p + q],
        worked(
          [
            onePen,
            step(
              "Find the eraser",
              "求橡皮的价格",
              `Two pens cost $2 \\times ${p} = ${2 * p}$, so the eraser costs $${2 * p + q} - ${2 * p} = ${q}$ dollars. One pen and one eraser cost $${p} + ${q} = ${p + q}$ dollars.`,
              `两支钢笔 $2 \\times ${p} = ${2 * p}$ 美元，所以橡皮 $${2 * p + q} - ${2 * p} = ${q}$ 美元。一支钢笔和一块橡皮共 $${p} + ${q} = ${p + q}$ 美元。`,
            ),
          ],
          check0,
          [
            t(`This is the price of the pen alone.`, `这只是钢笔的价格。`),
            t(`This is the price of the eraser alone.`, `这只是橡皮的价格。`),
            t(`This is the cost of the first purchase, two pens and an eraser.`, `这是第一次购买的总价，即两支钢笔和一块橡皮。`),
          ],
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
        worked(
          [
            step(
              "Compare the purchases",
              "比较两次购买",
              `Both purchases include one eraser; the second has one more pen than the first.`,
              `两次购买都有一块橡皮；第二次比第一次多一支钢笔。`,
            ),
            onePen,
          ],
          check0,
          [
            t(`This is the price of the eraser, not the pen.`, `这是橡皮的价格，不是钢笔的价格。`),
            t(`This is one pen and one eraser together.`, `这是一支钢笔和一块橡皮的合计。`),
            t(`This is the price of two pens.`, `这是两支钢笔的价格。`),
          ],
        ),
      );
    const en = `A customer buys $${a}$ pens and $${b}$ erasers for $\\$${T1}$. Another buys $${c}$ pens and $${d}$ erasers for $\\$${T2}$.`;
    const zh = `一位顾客买 $${a}$ 支钢笔和 $${b}$ 块橡皮共 $${T1}$ 美元。另一位买 $${c}$ 支钢笔和 $${d}$ 块橡皮共 $${T2}$ 美元。`;
    if (!hard)
      return spr(
        t(`${en} What is the price of one pen, in dollars?`, `${zh}一支钢笔多少美元？`),
        p,
        [q, p + q, T2 - T1],
        worked(
          [
            elim,
            step(
              "Answer",
              "作答",
              `A pen costs $${p}$ dollars. As a sanity step, the first purchase leaves $${T1} - ${a} \\times ${p} = ${b * q}$ dollars for its ${b === 1 ? "eraser" : `$${b}$ erasers, $${q}$ each`}, a sensible price.`,
              `钢笔每支 $${p}$ 美元。顺带看一下：第一次购买中橡皮共 $${T1} - ${a} \\times ${p} = ${b * q}$ 美元${b === 1 ? "" : `，每块 $${q}$ 美元`}，价格合理。`,
            ),
          ],
          checkT,
          [
            t(`This is the price of an eraser, not a pen.`, `这是橡皮的价格，不是钢笔的价格。`),
            t(`This is one pen and one eraser together.`, `这是一支钢笔和一块橡皮的合计。`),
            diffWhy,
          ],
        ),
      );
    return spr(
      t(`${en} What is the total price of one pen and one eraser, in dollars?`, `${zh}一支钢笔和一块橡皮共多少美元？`),
      p + q,
      [p, q, T2 - T1],
      worked(
        [
          elim,
          step(
            "Find the eraser and add",
            "求橡皮并相加",
            `From the first purchase, $${cx(b, "e")} = ${T1} - ${a} \\times ${p} = ${b * q}$, so $e = ${q}$. Together, $p + e = ${p} + ${q} = ${p + q}$ dollars.`,
            `由第一次购买，$${cx(b, "e")} = ${T1} - ${a} \\times ${p} = ${b * q}$，所以 $e = ${q}$。合计 $p + e = ${p} + ${q} = ${p + q}$ 美元。`,
          ),
        ],
        checkT,
        [
          t(`This is the price of the pen alone.`, `这只是钢笔的价格。`),
          t(`This is the price of the eraser alone.`, `这只是橡皮的价格。`),
          t(
            `This is the difference of the two totals, which pays for the extra items in the second purchase, not for one pen and one eraser.`,
            `这是两个总价之差，买的是第二次多出的物品，而不是一支钢笔和一块橡皮。`,
          ),
        ],
      ),
    );
  }),
  spec(
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
      const scale = step(
        "Scale the first equation",
        "放大第一个方程",
        `The second equation has $${d}y$, which is $${k}$ times $${b}y$. Multiply every term of the first by $${k}$: $${k * a}x + ${d}y = ${k * p}$.`,
        `第二个方程含 $${d}y$，是 $${b}y$ 的 $${k}$ 倍。把第一个方程的每一项乘 $${k}$：$${k * a}x + ${d}y = ${k * p}$。`,
      );
      const cancel = step(
        "Subtract",
        "两式相减",
        `Subtract it from the second: $(${c} - ${k * a})x = ${q} - ${k * p}$, so $x = ${x0}$.`,
        `用第二个方程减去它：$(${c} - ${k * a})x = ${q} - ${k * p}$，所以 $x = ${x0}$。`,
      );
      const check = t(
        `With $y = ${y0}$: $${a} \\times ${x0} + ${b} \\times ${y0} = ${p}$ and $${c} \\times ${x0} + ${d} \\times ${y0} = ${q}$.`,
        `取 $y = ${y0}$：$${a} \\times ${x0} + ${b} \\times ${y0} = ${p}$，$${c} \\times ${x0} + ${d} \\times ${y0} = ${q}$。`,
      );
      if (!hard)
        return mc(
          rng,
          t(`What is the value of $x$ in the solution to the system?\n$$${sys}$$`, `方程组解中 $x$ 的值是多少？\n$$${sys}$$`),
          x0,
          [q - p, x0 + y0, y0 === x0 ? x0 + 1 : y0],
          worked([scale, cancel], check, [
            t(
              `This subtracts the equations without scaling, so the $y$ terms do not cancel.`,
              `这是没有放大就直接相减，$y$ 项并没有消去。`,
            ),
            t(`This is $x + y$, not $x$.`, `这是 $x + y$，不是 $x$。`),
            t(
              y0 === x0 ? `This is one more than the value of $x$; the check rules it out.` : `This is the value of $y$, not $x$.`,
              y0 === x0 ? `这比 $x$ 的值大 $1$；检验排除了它。` : `这是 $y$ 的值，不是 $x$ 的值。`,
            ),
          ]),
        );
      return spr(
        t(
          `If $(x, y)$ is the solution to the system, what is the value of $${a}x + ${2 * b}y$?\n$$${sys}$$`,
          `若 $(x, y)$ 是方程组的解，则 $${a}x + ${2 * b}y$ 的值是多少？\n$$${sys}$$`,
        ),
        a * x0 + 2 * b * y0,
        [p, q, 2 * p],
        worked(
          [
            scale,
            cancel,
            step(
              "Find y and evaluate",
              "求另一个未知数并代入",
              `Then $${b}y = ${p} - ${a} \\times ${x0} = ${b * y0}$, so $y = ${y0}$, and $${a}x + ${2 * b}y = ${a} \\times ${x0} + ${2 * b} \\times ${y0} = ${a * x0 + 2 * b * y0}$.`,
              `于是 $${b}y = ${p} - ${a} \\times ${x0} = ${b * y0}$，所以 $y = ${y0}$，$${a}x + ${2 * b}y = ${a} \\times ${x0} + ${2 * b} \\times ${y0} = ${a * x0 + 2 * b * y0}$。`,
            ),
          ],
          t(
            `Another way: $${a}x + ${2 * b}y$ is the first equation's $${p}$ plus $${b}y = ${b * y0}$, and $${p} + ${b * y0} = ${a * x0 + 2 * b * y0}$.`,
            `另一种算法：$${a}x + ${2 * b}y$ 等于第一个方程的 $${p}$ 再加 $${b}y = ${b * y0}$，而 $${p} + ${b * y0} = ${a * x0 + 2 * b * y0}$。`,
          ),
          [
            t(
              `This is the value of $${a}x + ${b}y$, from the first equation, with only $${b}y$.`,
              `这是第一个方程中 $${a}x + ${b}y$ 的值，只含 $${b}y$。`,
            ),
            t(`This is the value of the second equation's left side, a different expression.`, `这是第二个方程左边的值，是另一个式子。`),
            t(`This doubles the whole first equation, which doubles $${a}x$ as well.`, `这是把整个第一个方程加倍，连 $${a}x$ 也加倍了。`),
          ],
        ),
      );
    },
  ),
  spec("The Intersection of Two Lines", "两直线的交点", ["intersection-of-two-lines"], (rng, hard) => {
    const x0 = rng.int(-5, 8);
    const m1 = rng.int(1, 6);
    const m2 = -rng.int(1, 5);
    const y0 = rng.int(-6, 9);
    const b1 = y0 - m1 * x0;
    const b2 = y0 - m2 * x0;
    const lines = `$y = ${cx(m1)} ${sg(b1)}$ and $y = ${cx(m2)} ${sg(b2)}$`;
    const zh = `$y = ${cx(m1)} ${sg(b1)}$ 和 $y = ${cx(m2)} ${sg(b2)}$`;
    const meet = step(
      "Set the heights equal",
      "令高度相等",
      `Where the lines meet they have the same $y$, so $${cx(m1)} ${sg(b1)} = ${cx(m2)} ${sg(b2)}$. Collect terms: $${m1 - m2}x = ${b2 - b1}$, so $x = ${x0}$.`,
      `两直线相交处 $y$ 相同，所以 $${cx(m1)} ${sg(b1)} = ${cx(m2)} ${sg(b2)}$。整理得 $${m1 - m2}x = ${b2 - b1}$，所以 $x = ${x0}$。`,
    );
    const backY = step(
      "Find the height",
      "求高度",
      `Put $x = ${x0}$ into the first line: $y = ${m1} \\times ${par(x0)} ${sg(b1)} = ${y0}$.`,
      `把 $x = ${x0}$ 代入第一条直线：$y = ${m1} \\times ${par(x0)} ${sg(b1)} = ${y0}$。`,
    );
    const check = t(
      `The second line gives the same height: $${m2} \\times ${par(x0)} ${sg(b2)} = ${y0}$.`,
      `第二条直线给出相同的高度：$${m2} \\times ${par(x0)} ${sg(b2)} = ${y0}$。`,
    );
    if (!hard)
      return mc(
        rng,
        t(`At what point do the lines ${lines} intersect?`, `直线 ${zh} 相交于哪一点？`),
        `(${x0}, ${y0})`,
        [`(${y0}, ${x0})`, `(${x0 + 1}, ${y0})`, `(${x0}, ${b1})`, `(${x0}, ${b2})`, `(${x0}, ${y0 + 1})`, `(${x0 - 1}, ${y0})`],
        worked([meet, backY], check, [
          t(`This swaps the coordinates; the point is written $(x, y)$.`, `这是把坐标写反了；点的顺序是 $(x, y)$。`),
          t(
            `At $x = ${x0 + 1}$ the two lines have different heights, so this is not on both.`,
            `$x = ${x0 + 1}$ 时两条直线高度不同，这个点不同时在两条线上。`,
          ),
          t(
            `This $y$-value is the intercept of the first line, its height at $x = 0$.`,
            `这个 $y$ 值是第一条直线的截距，即它在 $x = 0$ 处的高度。`,
          ),
          t(
            `This $y$-value is the intercept of the second line, its height at $x = 0$.`,
            `这个 $y$ 值是第二条直线的截距，即它在 $x = 0$ 处的高度。`,
          ),
          t(
            `At $x = ${x0}$ both lines have height $${y0}$, not $${y0 + 1}$.`,
            `$x = ${x0}$ 时两条直线高度都是 $${y0}$，而不是 $${y0 + 1}$。`,
          ),
          t(
            `At $x = ${x0 - 1}$ the two lines have different heights, so this is not on both.`,
            `$x = ${x0 - 1}$ 时两条直线高度不同，这个点不同时在两条线上。`,
          ),
        ]),
      );
    return spr(
      t(`The lines ${lines} intersect at $(a, b)$. What is the value of $a + b$?`, `直线 ${zh} 相交于 $(a, b)$。$a + b$ 的值是多少？`),
      x0 + y0,
      [x0, y0, x0 - y0],
      worked(
        [meet, backY, step("Add", "相加", `$a + b = ${x0} + ${par(y0)} = ${x0 + y0}$.`, `$a + b = ${x0} + ${par(y0)} = ${x0 + y0}$。`)],
        check,
        [
          t(`This is $a$ alone, the $x$-coordinate.`, `这只是 $a$，即横坐标。`),
          t(`This is $b$ alone, the $y$-coordinate.`, `这只是 $b$，即纵坐标。`),
          t(`This subtracts the coordinates instead of adding them.`, `这是把两个坐标相减了，而应相加。`),
        ],
      ),
    );
  }),
  spec(
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
              : `y = ${cx(m === -1 ? 2 : m + 1)} ${sg(b)}`;
        const m2 = kind === 2 ? (m === -1 ? 2 : m + 1) : m;
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
          worked(
            [
              step(
                "Use slope-intercept form",
                "化为斜截式",
                kind === 1
                  ? `Divide $${sec}$ by $${k}$: $y = ${cx(m)} ${sg(b)}$. The first line is $y = ${cx(m)} ${sg(b)}$ already.`
                  : `Both equations are already in the form $y = mx + b$: slopes $${m}$ and $${m2}$, intercepts $${b}$ and $${kind === 0 ? b + 2 : b}$.`,
                kind === 1
                  ? `把 $${sec}$ 除以 $${k}$：$y = ${cx(m)} ${sg(b)}$。第一条直线本来就是 $y = ${cx(m)} ${sg(b)}$。`
                  : `两个方程都已是 $y = mx + b$ 的形式：斜率为 $${m}$ 和 $${m2}$，截距为 $${b}$ 和 $${kind === 0 ? b + 2 : b}$。`,
              ),
              step(
                "Compare",
                "比较",
                kind === 0
                  ? `The slopes are equal and the intercepts differ, so the lines are parallel and never meet.`
                  : kind === 1
                    ? `Slope and intercept both match, so the two equations describe the same line.`
                    : `The slopes $${m}$ and $${m2}$ differ, so the lines cross at exactly one point.`,
                kind === 0
                  ? `斜率相等而截距不同，所以两直线平行，永不相交。`
                  : kind === 1
                    ? `斜率和截距都相同，所以两个方程表示同一条直线。`
                    : `斜率 $${m}$ 与 $${m2}$ 不同，所以两直线恰好交于一点。`,
              ),
            ],
            kind === 0
              ? t(
                  `At every $x$ the second line is exactly $2$ higher than the first, for example $${b}$ and $${b + 2}$ at $x = 0$.`,
                  `在每个 $x$ 处，第二条直线都比第一条高 $2$，例如 $x = 0$ 时分别为 $${b}$ 和 $${b + 2}$。`,
                )
              : kind === 1
                ? t(
                    `At $x = 0$ both give $${b}$, and at $x = 1$ both give $${m + b}$.`,
                    `$x = 0$ 时两者都得 $${b}$，$x = 1$ 时两者都得 $${m + b}$。`,
                  )
                : t(
                    `Both lines pass through $(0, ${b})$, and at $x = 1$ they give $${m + b}$ and $${m2 + b}$, so they share only that one point.`,
                    `两直线都经过 $(0, ${b})$，而 $x = 1$ 时分别得 $${m + b}$ 和 $${m2 + b}$，所以只有这一个公共点。`,
                  ),
            [0, 1, 2, 3]
              .filter((i) => i !== kind)
              .map((i) =>
                i === 0
                  ? kind === 1
                    ? t(
                        `The intercepts are equal too, so the lines coincide; they are not separate parallel lines.`,
                        `截距也相等，所以两直线重合，不是两条分开的平行线。`,
                      )
                    : t(
                        `Parallel lines need equal slopes, and $${m}$ and $${m2}$ differ.`,
                        `平行线的斜率必须相等，而 $${m}$ 与 $${m2}$ 不同。`,
                      )
                  : i === 1
                    ? kind === 0
                      ? t(
                          `The same line needs the same intercept too, and $${b} \\neq ${b + 2}$.`,
                          `同一条直线的截距也必须相同，而 $${b} \\neq ${b + 2}$。`,
                        )
                      : t(`The slopes differ, so the lines cannot be the same.`, `斜率不同，所以不可能是同一条直线。`)
                    : i === 2
                      ? kind === 0
                        ? t(`Lines with equal slopes and different intercepts never cross.`, `斜率相等、截距不同的直线永不相交。`)
                        : t(`The lines share every point, not exactly one.`, `两直线有所有的公共点，而不是恰好一个。`)
                      : t(
                          `Perpendicular slopes multiply to $-1$, but here the product is $${m} \\times ${par(m2)} = ${m * m2}$.`,
                          `垂直直线的斜率之积为 $-1$，而这里的积是 $${m} \\times ${par(m2)} = ${m * m2}$。`,
                        ),
              ),
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
        worked(
          [
            step(
              "Set the heights equal",
              "令高度相等",
              `The solution of the system is where the lines cross, so the second line's height equals $${y1}$ there: $${cx(m)} ${sg(y1 - m * x0)} = ${y1}$.`,
              `方程组的解就是两直线的交点，那里第二条直线的高度等于 $${y1}$：$${cx(m)} ${sg(y1 - m * x0)} = ${y1}$。`,
            ),
            step(
              "Solve",
              "求解",
              `${y1 - m * x0 === 0 ? "" : `Subtract $${y1 - m * x0}$: `}$${cx(m)} = ${m * x0}$, so $x = ${x0}$.`,
              `${y1 - m * x0 === 0 ? "" : `两边减去 $${y1 - m * x0}$：`}$${cx(m)} = ${m * x0}$，所以 $x = ${x0}$。`,
            ),
          ],
          t(
            `At $x = ${x0}$: $${m} \\times ${x0} ${sg(y1 - m * x0)} = ${y1}$, the height of the line $y = ${y1}$.`,
            `$x = ${x0}$ 时：$${m} \\times ${x0} ${sg(y1 - m * x0)} = ${y1}$，正是直线 $y = ${y1}$ 的高度。`,
          ),
          [
            t(`This is the $y$-coordinate of the solution, not the $x$-coordinate.`, `这是解的纵坐标，不是横坐标。`),
            t(`This is the slope of the second line.`, `这是第二条直线的斜率。`),
            t(`This is the $y$-intercept of the second line, where $x = 0$.`, `这是第二条直线的 $y$ 截距，即 $x = 0$ 处。`),
          ].filter((_, i) => [y1, m, y1 - m * x0][i] !== x0),
        ),
        linesFigure([0, y1], [m, y1 - m * x0]),
      );
    },
  ),
  spec(
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
      const L = hard && kind === 2 ? a - 1 : a;
      const R = hard ? (kind === 2 ? 2 * a : a) : co;
      const left = `${cx(L)} + ${a * b}`;
      const right = `${cx(R)} + ${d}`;
      const xs = L === R ? Q.of(0) : Q.of(d - a * b, L - R);
      return words(
        rng,
        t(`How many solutions does the equation $${prompt}$ have?`, `方程 $${prompt}$ 有多少个解？`),
        ans[kind]!,
        [...ans.filter((_, i) => i !== kind), t("Exactly two", "恰好两个")],
        worked(
          [
            step(
              "Simplify each side",
              "化简两边",
              `Distribute: the left side is $${left}$ and the right side is $${right}$.`,
              `展开：左边为 $${left}$，右边为 $${right}$。`,
            ),
            step(
              "Compare",
              "比较",
              kind === 0
                ? `The two sides are identical, so every value of $x$ makes the equation true.`
                : kind === 1
                  ? `The $x$ terms are equal and cancel, leaving $${a * b} = ${d}$, which is false. No value of $x$ works.`
                  : `The coefficients of $x$ differ, $${L}$ and $${R}$, so collecting terms gives $${cx(L - R)} = ${d - a * b}$ and exactly one value, $x = ${xs.toLatex()}$.`,
              kind === 0
                ? `两边完全相同，所以任何 $x$ 都使方程成立。`
                : kind === 1
                  ? `$x$ 项相等而相消，剩下 $${a * b} = ${d}$，这是错的。没有 $x$ 能成立。`
                  : `$x$ 的系数 $${L}$ 与 $${R}$ 不同，整理得 $${cx(L - R)} = ${d - a * b}$，恰有一个值 $x = ${xs.toLatex()}$。`,
            ),
          ],
          kind === 0
            ? t(
                `Both $x = 0$ and $x = 1$ work: each side gives $${a * b}$ and then $${a + a * b}$.`,
                `$x = 0$ 和 $x = 1$ 都成立：两边分别都得 $${a * b}$ 和 $${a + a * b}$。`,
              )
            : kind === 1
              ? t(
                  `At $x = 0$ the sides are $${a * b}$ and $${d}$, and they always differ by the same $${d - a * b}$.`,
                  `$x = 0$ 时两边为 $${a * b}$ 和 $${d}$，而且它们总是相差同一个 $${d - a * b}$。`,
                )
              : t(
                  `At $x = ${xs.toLatex()}$ both sides equal $${Q.of(L)
                    .mul(xs)
                    .add(Q.of(a * b))
                    .toLatex()}$.`,
                  `$x = ${xs.toLatex()}$ 时两边都等于 $${Q.of(L)
                    .mul(xs)
                    .add(Q.of(a * b))
                    .toLatex()}$。`,
                ),
          [0, 1, 2, 3]
            .filter((i) => i !== kind)
            .map((i) =>
              i === 3
                ? t(
                    `A linear equation simplifies to one of three cases, one solution, none, or every number, so it never has exactly two.`,
                    `一次方程化简后只有三种情况：一个解、无解或任何数都是解，所以不可能恰好有两个解。`,
                  )
                : i === 0
                  ? t(
                      `Infinitely many solutions needs identical sides, and here the sides differ.`,
                      `无穷多解要求两边完全相同，而这里两边不同。`,
                    )
                  : i === 1
                    ? t(
                        `No solution needs equal $x$ coefficients with different constants, which is not the case here.`,
                        `无解要求 $x$ 系数相等而常数不同，这里不是这种情况。`,
                      )
                    : t(
                        `Exactly one solution needs different $x$ coefficients, and here they are equal.`,
                        `恰有一个解要求 $x$ 系数不同，而这里它们相等。`,
                      ),
            ),
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step(
                "Distribute",
                "展开",
                `The left side is $${a}(x + ${b}) = ${a}x + ${a * b}$.`,
                `左边为 $${a}(x + ${b}) = ${a}x + ${a * b}$。`,
              ),
              step(
                "Match the sides",
                "让两边相同",
                `Infinitely many solutions means the two sides are the same expression. The $x$ terms already match, $${a}x$ on each side, so the constants must match too: $c = ${a * b}$.`,
                `无穷多解意味着两边是同一个式子。两边的 $x$ 项已经都是 $${a}x$，所以常数也必须相同：$c = ${a * b}$。`,
              ),
            ],
            t(
              `With $c = ${a * b}$, any $x$ works; for $x = 1$, both sides equal $${a + a * b}$.`,
              `取 $c = ${a * b}$ 时任何 $x$ 都成立；例如 $x = 1$ 时两边都等于 $${a + a * b}$。`,
            ),
            [
              t(`This forgets to multiply $${b}$ by $${a}$ when distributing.`, `这是展开时忘了把 $${b}$ 乘以 $${a}$。`),
              t(`This adds $${a}$ and $${b}$ instead of multiplying.`, `这是把 $${a}$ 和 $${b}$ 相加了，而应相乘。`),
              t(
                `With $c = 0$ the constants differ, $${a * b}$ and $0$, so there would be no solution.`,
                `取 $c = 0$ 时常数 $${a * b}$ 与 $0$ 不同，方程将无解。`,
              ),
            ],
          ),
        );
      return spr(
        t(
          `In the equation $${k}(${a}x + ${b}) = px + q$, $p$ and $q$ are constants. If the equation has infinitely many solutions, what is the value of $p + q$?`,
          `在方程 $${k}(${a}x + ${b}) = px + q$ 中，$p$、$q$ 是常数。若方程有无穷多解，$p + q$ 的值是多少？`,
        ),
        k * a + k * b,
        [a + b, k * a, k * b],
        worked(
          [
            step(
              "Distribute",
              "展开",
              `The left side is $${k}(${a}x + ${b}) = ${k * a}x + ${k * b}$.`,
              `左边为 $${k}(${a}x + ${b}) = ${k * a}x + ${k * b}$。`,
            ),
            step(
              "Match the sides",
              "让两边相同",
              `For infinitely many solutions $px + q$ must be the same expression, so $p = ${k * a}$ and $q = ${k * b}$. Then $p + q = ${k * a + k * b}$.`,
              `要有无穷多解，$px + q$ 必须是同一个式子，所以 $p = ${k * a}$，$q = ${k * b}$。于是 $p + q = ${k * a + k * b}$。`,
            ),
          ],
          t(
            `At $x = 1$ the left side is $${k} \\times ${a + b} = ${k * (a + b)}$, and $p + q$ is the right side at $x = 1$.`,
            `$x = 1$ 时左边为 $${k} \\times ${a + b} = ${k * (a + b)}$，而 $p + q$ 正是右边在 $x = 1$ 时的值。`,
          ),
          [
            t(`This forgets to multiply by $${k}$ when distributing.`, `这是展开时忘了乘 $${k}$。`),
            t(`This is $p$ alone.`, `这只是 $p$。`),
            t(`This is $q$ alone.`, `这只是 $q$。`),
          ],
        ),
      );
    },
  ),
  spec("Linear Equations With No Solutions", "无解的一次方程", ["linear-equations-with-no-solutions"], (rng, hard) => {
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
        worked(
          [
            step(
              "Distribute",
              "展开",
              `The left side is $${a}(x + ${b}) = ${a}x + ${a * b}$, so the equation is $${a}x + ${a * b} = cx + ${a * b + k}$.`,
              `左边为 $${a}(x + ${b}) = ${a}x + ${a * b}$，方程即 $${a}x + ${a * b} = cx + ${a * b + k}$。`,
            ),
            step(
              "Make the x terms cancel",
              "让含变量的项相消",
              `If $c \\neq ${a}$, the equation has exactly one solution. If $c = ${a}$, the $x$ terms cancel and leave $${a * b} = ${a * b + k}$, which is false, so there is no solution. Hence $c = ${a}$.`,
              `若 $c \\neq ${a}$，方程恰有一个解。若 $c = ${a}$，$x$ 项相消，剩下 $${a * b} = ${a * b + k}$，这是错的，所以无解。因此 $c = ${a}$。`,
            ),
          ],
          t(
            `With $c = ${a}$ the two sides always differ by $${k}$: for example, at $x = 0$ they are $${a * b}$ and $${a * b + k}$.`,
            `取 $c = ${a}$ 时两边总是相差 $${k}$：例如 $x = 0$ 时分别是 $${a * b}$ 和 $${a * b + k}$。`,
          ),
          [
            t(`This is the number inside the parentheses, not the coefficient of $x$.`, `这是括号里的数，不是 $x$ 的系数。`),
            t(
              `This is the constant on the left after distributing, not the coefficient of $x$.`,
              `这是展开后左边的常数，不是 $x$ 的系数。`,
            ),
            t(`This is the gap between the constants, not the coefficient of $x$.`, `这是两个常数之差，不是 $x$ 的系数。`),
          ],
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
      worked(
        [
          step(
            "Distribute",
            "展开",
            `The right side is $r(${a}x + ${b + 1}) = ${a}rx + ${b + 1}r$.`,
            `右边为 $r(${a}x + ${b + 1}) = ${a}rx + ${b + 1}r$。`,
          ),
          step(
            "Match the x coefficients",
            "让变量的系数相等",
            `No solution needs equal $x$ coefficients with different constants. So $${a}r = ${k * a}$, which gives $r = ${k}$. Then the constants are $${b}$ and $${b + 1} \\times ${k} = ${k * (b + 1)}$, which differ.`,
            `无解要求 $x$ 系数相等而常数不同。所以 $${a}r = ${k * a}$，得 $r = ${k}$。此时常数为 $${b}$ 和 $${b + 1} \\times ${k} = ${k * (b + 1)}$，二者不同。`,
          ),
        ],
        t(
          `With $r = ${k}$ the equation is $${k * a}x + ${b} = ${k * a}x + ${k * (b + 1)}$; subtracting $${k * a}x$ leaves $${b} = ${k * (b + 1)}$, which is false.`,
          `取 $r = ${k}$，方程为 $${k * a}x + ${b} = ${k * a}x + ${k * (b + 1)}$；两边减去 $${k * a}x$ 剩下 $${b} = ${k * (b + 1)}$，这是错的。`,
        ),
        [
          t(
            `This matches the constants instead, which makes the equation have one solution, $x = 0$.`,
            `这是让常数相等，结果方程恰有一个解 $x = 0$。`,
          ),
          t(`This is the coefficient of $x$ on the left, not the multiplier $r$.`, `这是左边 $x$ 的系数，不是倍数 $r$。`),
          t(
            `This divides $${k}$ by $${a}$ instead of dividing $${k * a}$ by $${a}$.`,
            `这是用 $${k}$ 除以 $${a}$，而应用 $${k * a}$ 除以 $${a}$。`,
          ),
        ],
      ),
    );
  }),
  spec("Determining the Number of Solutions to a Linear System", "判断线性方程组解的个数", ["consistency-and-dependency"], (rng, hard) => {
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
      worked(
        [
          step(
            hard ? "Use the same form" : "Scale the first equation",
            hard ? "化为同一形式" : "放大第一个方程",
            `${hard ? `Multiply the first equation by $${b}$ and move the $x$ term: $${a}x + ${b}y = ${c}$. ` : ""}Multiplying $${a}x + ${b}y = ${c}$ by $${k}$ gives $${k * a}x + ${k * b}y = ${k * c}$.`,
            `${hard ? `把第一个方程乘 $${b}$ 并移项：$${a}x + ${b}y = ${c}$。` : ""}把 $${a}x + ${b}y = ${c}$ 乘 $${k}$，得 $${k * a}x + ${k * b}y = ${k * c}$。`,
          ),
          step(
            "Compare with the second",
            "与第二个方程比较",
            kind === 0
              ? `This is exactly the second equation, so both describe the same line and every point on it is a solution.`
              : kind === 1
                ? `The second equation has the same left side but the constant $${k * c + 1}$, not $${k * c}$. The lines are parallel and never meet.`
                : `The second equation has $${k * a + 1}x$, not $${k * a}x$, so its slope differs and the lines cross at exactly one point.`,
            kind === 0
              ? `这正是第二个方程，所以两者表示同一条直线，直线上每一点都是解。`
              : kind === 1
                ? `第二个方程左边相同，但常数是 $${k * c + 1}$ 而不是 $${k * c}$。两直线平行，永不相交。`
                : `第二个方程是 $${k * a + 1}x$ 而不是 $${k * a}x$，所以斜率不同，两直线恰好交于一点。`,
          ),
        ],
        kind === 0
          ? t(
              `The point $\\left(0, ${Q.of(c, b).toLatex()}\\right)$ satisfies both: $${b} \\times ${Q.of(c, b).toLatex()} = ${c}$ and $${k * b} \\times ${Q.of(c, b).toLatex()} = ${k * c}$.`,
              `点 $\\left(0, ${Q.of(c, b).toLatex()}\\right)$ 同时满足两式：$${b} \\times ${Q.of(c, b).toLatex()} = ${c}$，$${k * b} \\times ${Q.of(c, b).toLatex()} = ${k * c}$。`,
            )
          : kind === 1
            ? t(
                `A common solution would make $${k * a}x + ${k * b}y$ equal both $${k * c}$ and $${k * c + 1}$, which is impossible.`,
                `若有公共解，$${k * a}x + ${k * b}y$ 就要同时等于 $${k * c}$ 和 $${k * c + 1}$，这不可能。`,
              )
            : t(
                `Subtracting the scaled first equation from the second gives $x = 0$, and then $y = ${Q.of(c, b).toLatex()}$: one point.`,
                `用第二个方程减去放大后的第一个方程得 $x = 0$，于是 $y = ${Q.of(c, b).toLatex()}$：只有一个点。`,
              ),
        [0, 1, 2, 3]
          .filter((i) => i !== kind)
          .map((i) =>
            i === 3
              ? t(
                  `Two lines meet in no point, one point or every point; lines sharing two points are the same line.`,
                  `两条直线要么不相交，要么交于一点，要么完全重合；有两个公共点的直线就是同一条直线。`,
                )
              : i === 0
                ? t(
                    `Infinitely many solutions needs one equation to be a multiple of the other, constants included.`,
                    `无穷多解要求一个方程是另一个的倍数，常数也包括在内。`,
                  )
                : i === 1
                  ? t(
                      `No solution needs proportional left sides with a constant that breaks the proportion.`,
                      `无解要求左边成比例，而常数不成比例。`,
                    )
                  : t(
                      `Exactly one solution needs different slopes, and these left sides are proportional.`,
                      `恰有一个解要求斜率不同，而这两个左边成比例。`,
                    ),
          ),
      ),
    );
  }),
  spec(
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
          worked(
            [
              step(
                "Find the multiplier",
                "求倍数",
                `Infinitely many solutions means the two equations describe the same line, so the second is a multiple of the first. Its coefficients are $${k * a} = ${k} \\times ${a}$ and $${k * b} = ${k} \\times ${b}$, so the multiplier is $${k}$.`,
                `无穷多解意味着两个方程表示同一条直线，所以第二个是第一个的倍数。它的系数 $${k * a} = ${k} \\times ${a}$，$${k * b} = ${k} \\times ${b}$，所以倍数是 $${k}$。`,
              ),
              step(
                "Scale the constant",
                "放大常数",
                `The constant must follow the same multiplier: $q = ${k} \\times ${c} = ${k * c}$.`,
                `常数也必须按同一倍数放大：$q = ${k} \\times ${c} = ${k * c}$。`,
              ),
            ],
            t(
              `With $q = ${k * c}$, dividing the second equation by $${k}$ gives $${a}x + ${b}y = ${c}$, the first equation.`,
              `取 $q = ${k * c}$，把第二个方程除以 $${k}$ 得 $${a}x + ${b}y = ${c}$，正是第一个方程。`,
            ),
            [
              t(
                `This keeps the constant unscaled, which makes the lines parallel with no solution.`,
                `这是常数没有放大，两直线会平行而无解。`,
              ),
              t(`This adds the multiplier to the constant instead of multiplying.`, `这是把倍数加到常数上，而应相乘。`),
              t(`This is the scaled coefficient of $x$, not the scaled constant.`, `这是放大后 $x$ 的系数，不是放大后的常数。`),
            ],
          ),
        );
      return spr(
        t(
          `The system has infinitely many solutions, where $p$ and $q$ are constants. What is the value of $p + q$?\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ px + ${k * b}y = q \\end{cases}$$`,
          `方程组有无穷多解，其中 $p$、$q$ 是常数。$p + q$ 的值是多少？\n$$\\begin{cases} ${a}x + ${b}y = ${c} \\\\ px + ${k * b}y = q \\end{cases}$$`,
        ),
        k * a + k * c,
        [a + c, k * a, k * c],
        worked(
          [
            step(
              "Find the multiplier",
              "求倍数",
              `The equations must describe the same line, so the second is a multiple of the first. The $y$ coefficients give the multiplier: $\\frac{${k * b}}{${b}} = ${k}$.`,
              `两个方程必须表示同一条直线，所以第二个是第一个的倍数。由 $y$ 的系数得倍数：$\\frac{${k * b}}{${b}} = ${k}$。`,
            ),
            step(
              "Scale the rest",
              "放大其余各项",
              `Then $p = ${k} \\times ${a} = ${k * a}$ and $q = ${k} \\times ${c} = ${k * c}$, so $p + q = ${k * a + k * c}$.`,
              `于是 $p = ${k} \\times ${a} = ${k * a}$，$q = ${k} \\times ${c} = ${k * c}$，所以 $p + q = ${k * a + k * c}$。`,
            ),
          ],
          t(
            `The second equation is $${k * a}x + ${k * b}y = ${k * c}$, which is $${k}$ times $${a}x + ${b}y = ${c}$.`,
            `第二个方程是 $${k * a}x + ${k * b}y = ${k * c}$，正是 $${a}x + ${b}y = ${c}$ 的 $${k}$ 倍。`,
          ),
          [
            t(`This adds the first equation's numbers without scaling them by $${k}$.`, `这是把第一个方程的数直接相加，没有乘以 $${k}$。`),
            t(`This is $p$ alone.`, `这只是 $p$。`),
            t(`This is $q$ alone.`, `这只是 $q$。`),
          ],
        ),
      );
    },
  ),
  spec(
    "Parametrizing Systems of Linear Equations",
    "线性方程组的参数化",
    ["parametrizing-systems-with-infinitely-many-solutions"],
    (rng, hard) => {
      const m = rng.int(2, 6);
      const b = rng.int(1, 9);
      const k = rng.int(2, 4);
      const s = rng.int(1, 9);
      const sys = `\\begin{cases} y - ${m}x = ${b} \\\\ ${k}y - ${k * m}x = ${k * b} \\end{cases}`;
      const same = step(
        "Spot the repeated equation",
        "发现重复的方程",
        `The second equation is $${k}$ times the first, so the system is really the one equation $y - ${m}x = ${b}$, that is, $y = ${m}x + ${b}$.`,
        `第二个方程是第一个的 $${k}$ 倍，所以方程组实际上只有一个方程 $y - ${m}x = ${b}$，即 $y = ${m}x + ${b}$。`,
      );
      if (!hard)
        return mc(
          rng,
          t(
            `The system has infinitely many solutions. Which pair $(x, y)$ describes all of them, for every number $t$?\n$$${sys}$$`,
            `方程组有无穷多解。对任意实数 $t$，哪个数对 $(x, y)$ 表示全部的解？\n$$${sys}$$`,
          ),
          `(t, ${m}t + ${b})`,
          [`(${m}t + ${b}, t)`, `(t, ${m}t - ${b})`, `(t, ${b}t + ${m})`, `(t, -${m}t + ${b})`],
          worked(
            [
              same,
              step(
                "Name the free variable",
                "设自由变量",
                `Let $x = t$, any number. Then $y = ${m}t + ${b}$, so every solution is $(t, ${m}t + ${b})$.`,
                `令 $x = t$，$t$ 可取任意数。于是 $y = ${m}t + ${b}$，每个解都是 $(t, ${m}t + ${b})$。`,
              ),
            ],
            t(
              `In the first equation, $(${m}t + ${b}) - ${m}t = ${b}$ for every $t$.`,
              `代入第一个方程，对每个 $t$ 都有 $(${m}t + ${b}) - ${m}t = ${b}$。`,
            ),
            [
              t(`This swaps the coordinates: the expression in $t$ belongs to $y$.`, `这是把坐标写反了：含 $t$ 的式子应是 $y$。`),
              t(
                `This has the wrong sign on the constant: $y - ${m}x = ${b}$ gives $y = ${m}x + ${b}$.`,
                `常数的符号错了：$y - ${m}x = ${b}$ 得 $y = ${m}x + ${b}$。`,
              ),
              t(`This swaps the slope and the constant.`, `这是把斜率和常数交换了。`),
              t(`This misses the sign change when $-${m}x$ moves across.`, `这是移项 $-${m}x$ 时漏了变号。`),
            ],
          ),
        );
      return spr(
        t(
          `The solutions of the system can be written $(t, ${m}t + c)$ for every number $t$. If $(${s}, r)$ is a solution, what is the value of $r$?\n$$${sys}$$`,
          `方程组的解可写成 $(t, ${m}t + c)$，$t$ 为任意实数。若 $(${s}, r)$ 是解，则 $r$ 的值是多少？\n$$${sys}$$`,
        ),
        m * s + b,
        [m * s, s + b, m + b],
        worked(
          [
            same,
            step(
              "Use the parameter",
              "代入参数",
              `So $c = ${b}$ and the solutions are $(t, ${m}t + ${b})$. The point $(${s}, r)$ has $t = ${s}$, so $r = ${m} \\times ${s} + ${b} = ${m * s + b}$.`,
              `所以 $c = ${b}$，解为 $(t, ${m}t + ${b})$。点 $(${s}, r)$ 对应 $t = ${s}$，所以 $r = ${m} \\times ${s} + ${b} = ${m * s + b}$。`,
            ),
          ],
          t(
            `In the first equation, $${m * s + b} - ${m} \\times ${s} = ${b}$, and the second is $${k}$ times it.`,
            `代入第一个方程，$${m * s + b} - ${m} \\times ${s} = ${b}$，而第二个方程是它的 $${k}$ 倍。`,
          ),
          [
            t(`This leaves out the constant $c = ${b}$.`, `这是漏掉了常数 $c = ${b}$。`),
            t(`This adds $t$ to the constant without multiplying by $${m}$.`, `这是把 $t$ 直接加到常数上，没有乘以 $${m}$。`),
            t(`This uses $t = 1$ instead of $t = ${s}$.`, `这是用了 $t = 1$，而不是 $t = ${s}$。`),
          ],
        ),
      );
    },
  ),
  spec("Linear Systems With No Solution", "无解的线性方程组", ["sat-linear-systems-unknown-constants"], (rng, hard) => {
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
        worked(
          [
            step(
              "Find the multiplier",
              "求倍数",
              `No solution means parallel lines: the left sides are proportional but the constants are not. The $y$ coefficients give the multiplier $\\frac{${k * b}}{${b}} = ${k}$.`,
              `无解意味着两直线平行：左边成比例而常数不成比例。由 $y$ 的系数得倍数 $\\frac{${k * b}}{${b}} = ${k}$。`,
            ),
            step(
              "Scale the x coefficient",
              "放大变量的系数",
              `So $p = ${k} \\times ${a} = ${k * a}$. The constant $${d}$ is not $${k} \\times ${c} = ${k * c}$, so the lines are parallel, not the same.`,
              `所以 $p = ${k} \\times ${a} = ${k * a}$。常数 $${d}$ 不等于 $${k} \\times ${c} = ${k * c}$，所以两直线平行而不重合。`,
            ),
          ],
          t(
            `With $p = ${k * a}$, $${k}$ times the first equation is $${k * a}x + ${k * b}y = ${k * c}$, which cannot also equal $${d}$.`,
            `取 $p = ${k * a}$，第一个方程的 $${k}$ 倍是 $${k * a}x + ${k * b}y = ${k * c}$，不可能同时等于 $${d}$。`,
          ),
          [
            t(
              `This copies the first coefficient without scaling it by $${k}$, so the slopes differ and the lines cross.`,
              `这是照抄了第一个系数，没有乘以 $${k}$，斜率不同，两直线会相交。`,
            ),
            t(
              `This is the $y$ coefficient of the second equation, not the $x$ coefficient.`,
              `这是第二个方程中 $y$ 的系数，不是 $x$ 的系数。`,
            ),
            t(`This is the constant of the second equation.`, `这是第二个方程的常数。`),
          ],
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
      worked(
        [
          step(
            "Compare the left sides",
            "比较左边",
            `The second left side, $${k * a}x + ${k * b}y$, is $${k}$ times the first, so the lines have the same slope.`,
            `第二个方程的左边 $${k * a}x + ${k * b}y$ 是第一个的 $${k}$ 倍，所以两直线斜率相同。`,
          ),
          step(
            "Compare the constants",
            "比较常数",
            `If $n = ${k} \\times ${c} = ${k * c}$, the second equation is $${k}$ times the first and the lines coincide. For any other $n$ they are parallel and never meet, so there is no solution.`,
            `若 $n = ${k} \\times ${c} = ${k * c}$，第二个方程是第一个的 $${k}$ 倍，两直线重合。$n$ 取其他任何值时两直线平行、永不相交，所以无解。`,
          ),
        ],
        t(
          `For example, $n = ${k * c + 1}$: a common solution would make $${k * a}x + ${k * b}y$ equal both $${k * c}$ and $${k * c + 1}$, which is impossible.`,
          `例如 $n = ${k * c + 1}$：若有公共解，$${k * a}x + ${k * b}y$ 就要同时等于 $${k * c}$ 和 $${k * c + 1}$，这不可能。`,
        ),
        [
          t(
            `With $n = ${k * c}$ the lines are the same, so there are infinitely many solutions.`,
            `取 $n = ${k * c}$ 时两直线重合，有无穷多解。`,
          ),
          t(
            `With $n = ${c}$ the lines are parallel, but so they are for every other value except $${k * c}$.`,
            `取 $n = ${c}$ 时两直线确实平行，但除 $${k * c}$ 外的其他值也都一样。`,
          ),
          t(
            `Every value except $${k * c}$ gives parallel lines, so such values exist.`,
            `除 $${k * c}$ 外的每个值都使两直线平行，所以这样的值是存在的。`,
          ),
        ],
      ),
    );
  }),
  spec(
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
          worked(
            [
              step(
                "Write the total",
                "写出总额",
                `The club starts with $${f}$ dollars and adds $${r}$ for each of the $n$ items, so its total is $${f} + ${r}n$.`,
                `社团原有 $${f}$ 美元，$n$ 件物品每件再加 $${r}$ 美元，所以总额为 $${f} + ${r}n$。`,
              ),
              step(
                "Choose the symbol",
                "选择符号",
                `"${w.en[0]!.toUpperCase()}${w.en.slice(1)}" $${T}$ means the total may equal $${T}$ or be ${atLeast ? "more" : "less"}, so the symbol is $${sym}$: $${f} + ${r}n ${sym} ${T}$.`,
                `“${w["zh-CN"]}” $${T}$ 表示总额可以等于 $${T}$，也可以${atLeast ? "更多" : "更少"}，所以符号是 $${sym}$：$${f} + ${r}n ${sym} ${T}$。`,
              ),
            ],
            t(
              `At $n = 0$ the total is $${f}$, and each item adds $${r}$, matching the left side; a total of exactly $${T}$ is allowed by $${sym}$.`,
              `$n = 0$ 时总额为 $${f}$，每件再加 $${r}$，与左边相符；总额恰为 $${T}$ 时 $${sym}$ 也允许。`,
            ),
            [
              t(`This reverses the inequality: ${w.en} $${T}$ needs $${sym}$.`, `这是把不等号弄反了：${w["zh-CN"]} $${T}$ 要用 $${sym}$。`),
              t(`This swaps the starting money and the earnings per item.`, `这是把原有的钱和每件的收入交换了。`),
              t(`This swaps the amounts and also reverses the inequality.`, `这是把两个数交换了，还把不等号弄反了。`),
              t(
                `This multiplies the starting money by $n$ as if it were earned per item.`,
                `这是把原有的钱也乘了 $n$，好像它是每件的收入。`,
              ),
            ],
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
        worked(
          [
            step(
              "Write the load",
              "写出载重",
              `The operator weighs $${w2}$ pounds and each of the $b$ boxes weighs $${r * 5}$, so the load is $${w2} + ${r * 5}b$ pounds.`,
              `操作员重 $${w2}$ 磅，$b$ 个箱子每个重 $${r * 5}$ 磅，所以载重为 $${w2} + ${r * 5}b$ 磅。`,
            ),
            step(
              "Choose the symbol",
              "选择符号",
              `"At most $${10 * T}$" means the load may equal $${10 * T}$ or be less: $${w2} + ${r * 5}b \\le ${10 * T}$.`,
              `“最多 $${10 * T}$”表示载重可以等于 $${10 * T}$，也可以更少：$${w2} + ${r * 5}b \\le ${10 * T}$。`,
            ),
          ],
          t(
            `With no boxes the load is $${w2} \\le ${10 * T}$, which is allowed, as it must be.`,
            `没有箱子时载重为 $${w2} \\le ${10 * T}$，是允许的，本该如此。`,
          ),
          [
            t(`This reverses the inequality: at most needs $\\le$.`, `这是把不等号弄反了：“最多”要用 $\\le$。`),
            t(`This swaps the operator's weight and the weight per box.`, `这是把操作员的体重和每箱的重量交换了。`),
            t(
              `This compares the boxes with the operator's weight instead of with the limit.`,
              `这是把箱子的重量和操作员的体重比较，而应和上限比较。`,
            ),
          ],
        ),
      );
    },
  ),
  spec(
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
          worked(
            [
              step(
                "Write the inequality",
                "列不等式",
                `For $d$ days the cost is $${f} + ${r}d$, and it must stay within the budget: $${f} + ${r}d \\le ${T}$.`,
                `用 $d$ 天的费用是 $${f} + ${r}d$，不能超出预算：$${f} + ${r}d \\le ${T}$。`,
              ),
              step(
                "Solve and round down",
                "求解并向下取整",
                `Subtract $${f}$: $${r}d \\le ${T - f}$, so $d \\le \\frac{${T - f}}{${r}}$, which is between $${n}$ and $${n + 1}$. A whole number of days that does not exceed it is at most $${n}$.`,
                `两边减去 $${f}$：$${r}d \\le ${T - f}$，所以 $d \\le \\frac{${T - f}}{${r}}$，它在 $${n}$ 与 $${n + 1}$ 之间。不超过它的整天数最多是 $${n}$。`,
              ),
            ],
            t(
              `$${n}$ days cost $${f} + ${r} \\times ${n} = ${f + r * n} \\le ${T}$, but $${n + 1}$ days cost $${f + r * (n + 1)} > ${T}$.`,
              `$${n}$ 天花费 $${f} + ${r} \\times ${n} = ${f + r * n} \\le ${T}$，而 $${n + 1}$ 天花费 $${f + r * (n + 1)} > ${T}$。`,
            ),
            [
              t(
                `This rounds up; $${n + 1}$ days cost $${f + r * (n + 1)}$, over the budget.`,
                `这是向上取整了；$${n + 1}$ 天要花 $${f + r * (n + 1)}$，超出预算。`,
              ),
              t(
                `This divides the whole budget by the daily rate and forgets the fixed $${f}$ dollars.`,
                `这是把全部预算除以每天的费用，忘了固定的 $${f}$ 美元。`,
              ),
              t(`This is one day fewer than the budget allows.`, `这比预算允许的少了一天。`),
            ],
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
        worked(
          [
            step(
              "Write the inequality",
              "列不等式",
              `After selling $n$ items the club has $${f} + ${r}n$ dollars, and it needs at least $${T}$: $${f} + ${r}n \\ge ${T}$.`,
              `卖出 $n$ 件后社团有 $${f} + ${r}n$ 美元，至少需要 $${T}$ 美元：$${f} + ${r}n \\ge ${T}$。`,
            ),
            step(
              "Solve and round up",
              "求解并向上取整",
              `Subtract $${f}$: $${r}n \\ge ${T - f}$, so $n \\ge \\frac{${T - f}}{${r}}$, which is between $${n - 1}$ and $${n}$. The least whole number that reaches it is $${n}$.`,
              `两边减去 $${f}$：$${r}n \\ge ${T - f}$，所以 $n \\ge \\frac{${T - f}}{${r}}$，它在 $${n - 1}$ 与 $${n}$ 之间。达到它的最小整数是 $${n}$。`,
            ),
          ],
          t(
            `$${n}$ items give $${f} + ${r} \\times ${n} = ${f + r * n} \\ge ${T}$, but $${n - 1}$ give only $${f + r * (n - 1)} < ${T}$.`,
            `卖 $${n}$ 件得 $${f} + ${r} \\times ${n} = ${f + r * n} \\ge ${T}$，而 $${n - 1}$ 件只有 $${f + r * (n - 1)} < ${T}$。`,
          ),
          [
            t(
              `This rounds down; $${n - 1}$ items bring only $${f + r * (n - 1)}$, short of $${T}$.`,
              `这是向下取整了；$${n - 1}$ 件只有 $${f + r * (n - 1)}$ 美元，不足 $${T}$。`,
            ),
            t(`This is one more item than needed.`, `这比需要的多了一件。`),
            t(
              `This divides the whole goal by the price and forgets the $${f}$ dollars the club already has.`,
              `这是把整个目标除以单价，忘了社团已有的 $${f}$ 美元。`,
            ),
          ],
        ),
      );
    },
  ),
  spec(
    "Modeling and Solving With One-Variable Linear Inequalities: Advanced Cases",
    "一元不等式建模求解：进阶情形",
    ["modeling-real-world-problems-using-inequalities"],
    (rng, hard) => {
      const a = rng.int(2, 6);
      const b = a + rng.int(2, 6);
      const n = rng.int(5, 20);
      const gap = (b - a) * n - rng.int(1, b - a > 1 ? b - a - 1 : 1) + (b - a > 1 ? 0 : 1);
      const N = Math.floor(gap / (b - a)) + 1;
      if (!hard)
        return spr(
          t(
            `Plan A costs $\\$${gap}$ plus $\\$${a}$ per use. Plan B costs $\\$${b}$ per use with no fee. What is the least whole number of uses for which plan A costs less than plan B?`,
            `方案 A 收费 $${gap}$ 美元，另加每次 $${a}$ 美元。方案 B 每次 $${b}$ 美元，无其他费用。至少使用多少次（整数）时方案 A 比方案 B 便宜？`,
          ),
          Math.floor(gap / (b - a)) + 1,
          [Math.floor(gap / (b - a)), Math.floor(gap / (b - a)) + 2, gap],
          worked(
            [
              step(
                "Write the inequality",
                "列不等式",
                `For $n$ uses, plan A costs $${gap} + ${a}n$ and plan B costs $${b}n$. Plan A is cheaper when $${gap} + ${a}n < ${b}n$.`,
                `使用 $n$ 次时，方案 A 花费 $${gap} + ${a}n$，方案 B 花费 $${b}n$。方案 A 更便宜即 $${gap} + ${a}n < ${b}n$。`,
              ),
              step(
                "Solve and take the next whole number",
                "求解并取下一个整数",
                `Subtract $${a}n$: $${gap} < ${cx(b - a, "n")}$, so $n > ${Q.of(gap, b - a).toLatex()}$. The inequality is strict, so the least whole number is $${N}$.`,
                `两边减去 $${a}n$：$${gap} < ${cx(b - a, "n")}$，所以 $n > ${Q.of(gap, b - a).toLatex()}$。不等号是严格的，所以最小整数是 $${N}$。`,
              ),
            ],
            t(
              `At $${N}$ uses, A costs $${gap + a * N}$ and B costs $${b * N}$, so A is cheaper; at $${N - 1}$ uses, A costs $${gap + a * (N - 1)}$ and B costs $${b * (N - 1)}$, so it is not.`,
              `使用 $${N}$ 次时 A 花费 $${gap + a * N}$，B 花费 $${b * N}$，A 更便宜；使用 $${N - 1}$ 次时 A 花费 $${gap + a * (N - 1)}$，B 花费 $${b * (N - 1)}$，A 并不更便宜。`,
            ),
            [
              t(
                `At $${N - 1}$ uses plan A is not cheaper: it costs $${gap + a * (N - 1)}$ against $${b * (N - 1)}$.`,
                `使用 $${N - 1}$ 次时方案 A 并不更便宜：它花费 $${gap + a * (N - 1)}$，而 B 是 $${b * (N - 1)}$。`,
              ),
              t(`Plan A is already cheaper one use earlier, at $${N}$.`, `早一次，即 $${N}$ 次时，方案 A 就已经更便宜了。`),
              t(`This is the fee of plan A, not a number of uses.`, `这是方案 A 的固定费用，不是使用次数。`),
            ],
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
        worked(
          [
            step(
              "Write the inequality",
              "列不等式",
              `The tools and the $c$ crates share the limit: $${tools} + ${box}c \\le ${limit}$.`,
              `工具和 $c$ 个板条箱共用载重上限：$${tools} + ${box}c \\le ${limit}$。`,
            ),
            step(
              "Solve and round down",
              "求解并向下取整",
              `Subtract $${tools}$: $${box}c \\le ${limit - tools}$, so $c \\le ${Q.of(limit - tools, box).toLatex()}$, which is between $${m}$ and $${m + 1}$. Only whole crates can be added, so at most $${m}$.`,
              `两边减去 $${tools}$：$${box}c \\le ${limit - tools}$，所以 $c \\le ${Q.of(limit - tools, box).toLatex()}$，它在 $${m}$ 与 $${m + 1}$ 之间。只能装整箱，所以最多 $${m}$ 个。`,
            ),
          ],
          t(
            `$${m}$ crates give $${tools} + ${box} \\times ${m} = ${tools + box * m} \\le ${limit}$, but $${m + 1}$ give $${tools + box * (m + 1)} > ${limit}$.`,
            `$${m}$ 个板条箱时 $${tools} + ${box} \\times ${m} = ${tools + box * m} \\le ${limit}$，而 $${m + 1}$ 个时为 $${tools + box * (m + 1)} > ${limit}$。`,
          ),
          [
            t(
              `This rounds up; $${m + 1}$ crates bring the load to $${tools + box * (m + 1)}$, over the limit.`,
              `这是向上取整了；$${m + 1}$ 个板条箱使载重达到 $${tools + box * (m + 1)}$，超过上限。`,
            ),
            t(
              ignored === m
                ? `This is one crate fewer than the truck can take.`
                : `This ignores the $${tools}$ kilograms of tools already on the truck.`,
              ignored === m ? `这比卡车能装的少了一个。` : `这是忽略了车上已有的 $${tools}$ 千克工具。`,
            ),
            t(`This is not a whole number of crates; it must be rounded down.`, `这不是整箱数，必须向下取整。`),
          ],
        ),
      );
    },
  ),
  spec("Compound Inequalities", "复合不等式", ["compound-inequalities"], (rng, hard) => {
    const a = rng.int(2, 5);
    const b = rng.int(1, 9);
    const lo = rng.int(-3, 3);
    const hi = lo + rng.int(3, 6);
    const inside = rng.int(lo + 1, hi - 1);
    const isolate = step(
      "Isolate x",
      "分离变量",
      `Subtract $${b}$ from all three parts: $${a * lo} < ${a}x < ${a * hi}$. Divide all three by $${a}$, which is positive, so the signs stay: $${lo} < x < ${hi}$.`,
      `三部分都减去 $${b}$：$${a * lo} < ${a}x < ${a * hi}$。三部分都除以正数 $${a}$，不等号方向不变：$${lo} < x < ${hi}$。`,
    );
    if (!hard) {
      const ws = rng.bool() ? [lo, hi, hi + 1] : [lo - 1, lo, hi];
      return mcExact(
        rng,
        t(
          `Which value of $x$ satisfies $${a * lo + b} < ${a}x + ${b} < ${a * hi + b}$?`,
          `哪个 $x$ 的值满足 $${a * lo + b} < ${a}x + ${b} < ${a * hi + b}$？`,
        ),
        inside,
        ws,
        worked(
          [
            isolate,
            step(
              "Test the choices",
              "检验各选项",
              `The value must lie strictly between $${lo}$ and $${hi}$; the endpoints themselves are excluded. Only $${inside}$ does.`,
              `这个值必须严格在 $${lo}$ 与 $${hi}$ 之间，端点本身不包括在内。只有 $${inside}$ 满足。`,
            ),
          ],
          t(
            `At $x = ${inside}$: $${a} \\times ${par(inside)} + ${b} = ${a * inside + b}$, and $${a * lo + b} < ${a * inside + b} < ${a * hi + b}$.`,
            `$x = ${inside}$ 时：$${a} \\times ${par(inside)} + ${b} = ${a * inside + b}$，且 $${a * lo + b} < ${a * inside + b} < ${a * hi + b}$。`,
          ),
          ws.map((w) =>
            w === lo || w === hi
              ? t(
                  `At $x = ${w}$ the middle equals $${a * w + b}$, an endpoint, and the inequality is strict.`,
                  `$x = ${w}$ 时中间等于端点 $${a * w + b}$，而不等号是严格的。`,
                )
              : t(
                  `At $x = ${w}$ the middle is $${a * w + b}$, outside the range from $${a * lo + b}$ to $${a * hi + b}$.`,
                  `$x = ${w}$ 时中间为 $${a * w + b}$，在 $${a * lo + b}$ 到 $${a * hi + b}$ 的范围之外。`,
                ),
          ),
        ),
      );
    }
    const count = hi - lo + 1;
    return spr(
      t(
        `How many integers $x$ satisfy $${a * lo + b} \\le ${a}x + ${b} \\le ${a * hi + b}$?`,
        `有多少个整数 $x$ 满足 $${a * lo + b} \\le ${a}x + ${b} \\le ${a * hi + b}$？`,
      ),
      count,
      [count - 1, count - 2, hi],
      worked(
        [
          step(
            "Isolate x",
            "分离变量",
            `Subtract $${b}$ from all three parts and divide by $${a}$: $${lo} \\le x \\le ${hi}$.`,
            `三部分都减去 $${b}$，再除以 $${a}$：$${lo} \\le x \\le ${hi}$。`,
          ),
          step(
            "Count the integers",
            "数整数",
            `Both ends are included, so the integers run from $${lo}$ to $${hi}$: there are $${hi} - ${par(lo)} + 1 = ${count}$ of them.`,
            `两端都包括在内，所以整数从 $${lo}$ 到 $${hi}$，共 $${hi} - ${par(lo)} + 1 = ${count}$ 个。`,
          ),
        ],
        t(
          `The ends work: $x = ${lo}$ gives $${a * lo + b}$ and $x = ${hi}$ gives $${a * hi + b}$, while $${lo - 1}$ and $${hi + 1}$ give values outside.`,
          `两端成立：$x = ${lo}$ 得 $${a * lo + b}$，$x = ${hi}$ 得 $${a * hi + b}$，而 $${lo - 1}$ 和 $${hi + 1}$ 的值在范围之外。`,
        ),
        [
          t(`This leaves out one endpoint; with $\\le$ both ends count.`, `这是漏掉了一个端点；用 $\\le$ 时两端都要算。`),
          t(`This leaves out both endpoints, as if the signs were $<$.`, `这是把两个端点都漏掉了，好像符号是 $<$。`),
          t(`This is the largest solution, not the number of solutions.`, `这是最大的解，不是解的个数。`),
        ],
      ),
    );
  }),
  spec("Constructing Models With Compound Inequalities", "构造复合不等式模型", ["compound-inequalities"], (rng, hard) => {
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
        worked(
          [
            step(
              "Read between",
              "理解“之间”",
              `Between $${lo}$ and $${hi}$ means $s$ is at least $${lo}$ and at most $${hi}$, so one compound inequality with $s$ in the middle: $${lo} \\ldots s \\ldots ${hi}$.`,
              `在 $${lo}$ 到 $${hi}$ 之间表示 $s$ 至少为 $${lo}$、至多为 $${hi}$，所以写成 $s$ 居中的一个复合不等式：$${lo} \\ldots s \\ldots ${hi}$。`,
            ),
            step(
              "Choose the symbols",
              "选择符号",
              `Inclusive means both ends are allowed, so both signs are $\\le$: $${lo} \\le s \\le ${hi}$.`,
              `“含端点”表示两端都允许，所以两个符号都是 $\\le$：$${lo} \\le s \\le ${hi}$。`,
            ),
          ],
          t(
            `$s = ${lo}$ and $s = ${hi}$ satisfy it, as an inclusive range requires, and $s = ${hi + 5}$ does not.`,
            `$s = ${lo}$ 和 $s = ${hi}$ 都满足，符合含端点的要求；而 $s = ${hi + 5}$ 不满足。`,
          ),
          [
            t(`This excludes the endpoints, but inclusive means they are allowed.`, `这排除了端点，而“含端点”表示端点是允许的。`),
            t(`This describes amounts outside the range, not between the limits.`, `这描述的是范围之外的量，而不是两个限度之间。`),
            t(`This reverses the limits, so no amount satisfies it.`, `这是把两个限度倒过来了，没有任何量满足它。`),
          ],
        ),
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
      worked(
        [
          step(
            "Write the amount spent",
            "写出花费",
            `The fee is paid once and each of the $n$ items adds $${r}$, so the amount spent is $${f} + ${r}n$.`,
            `手续费只付一次，$n$ 件物品每件再加 $${r}$ 美元，所以花费为 $${f} + ${r}n$。`,
          ),
          step(
            "Place it between the limits",
            "放在两个限度之间",
            `At least $${lo}$ and at most $${hi}$ are both inclusive: $${lo} \\le ${f} + ${r}n \\le ${hi}$.`,
            `“至少 $${lo}$”和“至多 $${hi}$”都含端点：$${lo} \\le ${f} + ${r}n \\le ${hi}$。`,
          ),
        ],
        t(
          `Spending exactly $${lo}$ or exactly $${hi}$ dollars is allowed by $\\le$ on both sides, and the fee is counted once.`,
          `恰好花 $${lo}$ 或 $${hi}$ 美元时，两边的 $\\le$ 都允许，手续费也只算一次。`,
        ),
        [
          t(`This swaps the fee and the price per item.`, `这是把手续费和每件的价格交换了。`),
          t(
            `This excludes spending exactly $${lo}$ or $${hi}$, which at least and at most allow.`,
            `这排除了恰好花 $${lo}$ 或 $${hi}$ 美元，而“至少”“至多”是允许的。`,
          ),
          t(`This leaves out the $${f}$ dollar fee.`, `这是漏掉了 $${f}$ 美元的手续费。`),
          t(`This changes the upper limit; it is $${hi}$, not $${hi + 5}$.`, `这改变了上限；上限是 $${hi}$，不是 $${hi + 5}$。`),
        ],
      ),
    );
  }),
  spec("Solutions of Two-Variable Linear Inequalities", "二元一次不等式的解", ["graphing-strict-linear-inequalities"], (rng, hard) => {
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const c = rng.int(10, 30);
    const x0 = rng.int(0, 2);
    const y0 = rng.int(0, 1);
    const fine = `(${x0}, ${y0})`;
    const big = (k: number) => `(${Math.ceil(c / a) + k}, ${Math.ceil(c / b) + k})`;
    const safe = a * x0 + b * y0 < c;
    const [px, py] = safe ? [x0, y0] : [0, 0];
    const pt = `(${px}, ${py})`;
    if (!hard)
      return mc(
        rng,
        t(`Which point is a solution of $${a}x + ${b}y < ${c}$?`, `哪个点是 $${a}x + ${b}y < ${c}$ 的解？`),
        safe ? fine : "(0, 0)",
        [big(0), big(1), big(2)],
        worked(
          [
            step(
              "Substitute",
              "代入",
              `A point is a solution when $${a}x + ${b}y$ comes out below $${c}$. For $${pt}$: $${a} \\times ${px} + ${b} \\times ${py} = ${a * px + b * py}$.`,
              `一个点是解，当且仅当 $${a}x + ${b}y$ 的值小于 $${c}$。对 $${pt}$：$${a} \\times ${px} + ${b} \\times ${py} = ${a * px + b * py}$。`,
            ),
            step(
              "Compare",
              "比较",
              `$${a * px + b * py} < ${c}$, so $${pt}$ is a solution.`,
              `$${a * px + b * py} < ${c}$，所以 $${pt}$ 是解。`,
            ),
          ],
          t(
            `The other points sit far from the origin: each has $x \\ge ${Math.ceil(c / a)}$, so $${a}x$ alone is already at least $${c}$.`,
            `其他点离原点很远：每个点都有 $x \\ge ${Math.ceil(c / a)}$，所以单是 $${a}x$ 就至少是 $${c}$。`,
          ),
          [0, 1, 2].map((k) => {
            const X = Math.ceil(c / a) + k;
            const Y = Math.ceil(c / b) + k;
            return t(
              `Here $${a} \\times ${X} + ${b} \\times ${Y} = ${a * X + b * Y}$, which is not less than $${c}$.`,
              `这里 $${a} \\times ${X} + ${b} \\times ${Y} = ${a * X + b * Y}$，不小于 $${c}$。`,
            );
          }),
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
      worked(
        [
          step(
            "Substitute",
            "代入",
            `Put $y = ${y0}$ into the inequality: $${a}x + ${b} \\times ${y0} \\le ${lim}$, that is, $${a}x${y0 === 0 ? "" : ` + ${b * y0}`} \\le ${lim}$.`,
            `把 $y = ${y0}$ 代入不等式：$${a}x + ${b} \\times ${y0} \\le ${lim}$，即 $${a}x${y0 === 0 ? "" : ` + ${b * y0}`} \\le ${lim}$。`,
          ),
          step(
            "Solve",
            "求解",
            `${y0 === 0 ? "" : `Subtract $${b * y0}$: $${a}x \\le ${a * k}$. `}Divide by $${a}$: $x \\le ${k}$, so the greatest value is $${k}$.`,
            `${y0 === 0 ? "" : `两边减去 $${b * y0}$：$${a}x \\le ${a * k}$。`}两边除以 $${a}$：$x \\le ${k}$，所以最大值是 $${k}$。`,
          ),
        ],
        t(
          `At $x = ${k}$: $${a} \\times ${k} + ${b} \\times ${y0} = ${lim} \\le ${lim}$, and at $x = ${k + 1}$ the value $${lim + a}$ is too large.`,
          `$x = ${k}$ 时：$${a} \\times ${k} + ${b} \\times ${y0} = ${lim} \\le ${lim}$；而 $x = ${k + 1}$ 时值为 $${lim + a}$，太大了。`,
        ),
        [
          t(
            `At $x = ${k + 1}$ the left side is $${lim + a}$, more than $${lim}$.`,
            `$x = ${k + 1}$ 时左边为 $${lim + a}$，大于 $${lim}$。`,
          ),
          t(`This is the bound on $${a}x + ${b}y$, not on $x$.`, `这是 $${a}x + ${b}y$ 的上限，不是 $x$ 的上限。`),
          t(
            `At $x = ${y0 + k + 1}$ the left side is $${a * (y0 + k + 1) + b * y0}$, more than $${lim}$.`,
            `$x = ${y0 + k + 1}$ 时左边为 $${a * (y0 + k + 1) + b * y0}$，大于 $${lim}$。`,
          ),
        ],
      ),
    );
  }),
  spec("Modeling With Two-Variable Linear Inequalities", "用二元不等式建模", ["modeling-with-two-variable-inequalities"], (rng, hard) => {
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
        worked(
          [
            step(
              "Write the cost",
              "写出费用",
              `$p$ pizzas cost $${a}p$ dollars and $s$ salads cost $${b}s$, so the total is $${a}p + ${b}s$.`,
              `$p$ 个比萨花 $${a}p$ 美元，$s$ 份沙拉花 $${b}s$ 美元，总费用为 $${a}p + ${b}s$。`,
            ),
            step(
              "Choose the symbol",
              "选择符号",
              `At most $${T}$ means the total may equal $${T}$ or be less: $${a}p + ${b}s \\le ${T}$.`,
              `最多 $${T}$ 表示总费用可以等于 $${T}$，也可以更少：$${a}p + ${b}s \\le ${T}$。`,
            ),
          ],
          t(
            `Buying nothing costs $0 \\le ${T}$, which must be allowed, and one pizza adds exactly $${a}$ to the left side.`,
            `什么都不买花 $0 \\le ${T}$，这必须是允许的；多一个比萨，左边正好增加 $${a}$。`,
          ),
          [
            t(`This reverses the inequality: at most needs $\\le$.`, `这是把不等号弄反了：“最多”要用 $\\le$。`),
            t(`This swaps the prices: pizzas cost $${a}$ each.`, `这是把单价交换了：比萨每个 $${a}$ 美元。`),
            t(`This counts items instead of dollars; the prices are missing.`, `这是在数件数而不是算金额；缺了单价。`),
          ],
        ),
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
      worked(
        [
          step(
            "Write the earnings",
            "写出收入",
            `Tutoring pays $${a}t$ dollars and the shop pays $${b}h$, so the week's earnings are $${a}t + ${b}h$.`,
            `家教收入 $${a}t$ 美元，商店收入 $${b}h$ 美元，所以每周收入为 $${a}t + ${b}h$。`,
          ),
          step(
            "Choose the symbol",
            "选择符号",
            `At least $${T}$ means $\\ge$: $${a}t + ${b}h \\ge ${T}$. The rule $t \\ge ${k}$ is a separate condition on the hours, not part of the earnings condition.`,
            `至少 $${T}$ 对应 $\\ge$：$${a}t + ${b}h \\ge ${T}$。$t \\ge ${k}$ 是关于小时数的另一个条件，不属于收入条件。`,
          ),
        ],
        t(
          `One hour of tutoring adds $${a}$ to the left side and one shop hour adds $${b}$, matching the two pay rates.`,
          `多一小时家教，左边增加 $${a}$；多一小时商店工作，左边增加 $${b}$，与两种时薪相符。`,
        ),
        [
          t(`This reverses the inequality: at least needs $\\ge$.`, `这是把不等号弄反了：“至少”要用 $\\ge$。`),
          t(`This counts hours instead of dollars; the pay rates are missing.`, `这是在数小时而不是算金额；缺了时薪。`),
          t(`This swaps the pay rates: tutoring pays $${a}$ per hour.`, `这是把时薪交换了：家教每小时 $${a}$ 美元。`),
        ],
      ),
    );
  }),
  spec(
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
          worked(
            [
              step(
                "Write the inequality",
                "列不等式",
                `The pizzas cost $${a} \\times ${p} = ${a * p}$ dollars, so with $s$ salads the spending is $${a * p} + ${b}s \\le ${T}$.`,
                `比萨花 $${a} \\times ${p} = ${a * p}$ 美元，所以买 $s$ 份沙拉时花费满足 $${a * p} + ${b}s \\le ${T}$。`,
              ),
              step(
                "Solve and round down",
                "求解并向下取整",
                `Subtract $${a * p}$: $${b}s \\le ${T - a * p}$, so $s \\le ${Q.of(T - a * p, b).toLatex()}$. Salads come whole, so at most $${s}$.`,
                `两边减去 $${a * p}$：$${b}s \\le ${T - a * p}$，所以 $s \\le ${Q.of(T - a * p, b).toLatex()}$。沙拉只能整份买，所以最多 $${s}$ 份。`,
              ),
            ],
            t(
              `$${s}$ salads bring the total to $${a * p + b * s} \\le ${T}$, but $${s + 1}$ would make it $${a * p + b * (s + 1)} > ${T}$.`,
              `$${s}$ 份沙拉时总额为 $${a * p + b * s} \\le ${T}$，而 $${s + 1}$ 份会达到 $${a * p + b * (s + 1)} > ${T}$。`,
            ),
            [
              t(
                `This rounds up; $${s + 1}$ salads bring the total to $${a * p + b * (s + 1)}$, over $${T}$.`,
                `这是向上取整了；$${s + 1}$ 份沙拉使总额达到 $${a * p + b * (s + 1)}$，超过 $${T}$。`,
              ),
              t(`This spends the whole $${T}$ on salads and forgets the pizzas.`, `这是把 $${T}$ 美元全花在沙拉上，忘了比萨。`),
              t(`This is the money left after the pizzas, not a number of salads.`, `这是买完比萨后剩下的钱，不是沙拉的份数。`),
            ],
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
        worked(
          [
            step(
              "Write the inequality",
              "列不等式",
              `The large items brought $${a} \\times ${p} = ${a * p}$ dollars, so with $s$ small items the earnings satisfy $${a * p} + ${b}s \\ge ${need}$.`,
              `大商品带来 $${a} \\times ${p} = ${a * p}$ 美元，所以卖 $s$ 件小商品时收入满足 $${a * p} + ${b}s \\ge ${need}$。`,
            ),
            step(
              "Solve and round up",
              "求解并向上取整",
              `Subtract $${a * p}$: $${b}s \\ge ${need - a * p}$, so $s \\ge ${Q.of(need - a * p, b).toLatex()}$. The least whole number that reaches it is $${s}$.`,
              `两边减去 $${a * p}$：$${b}s \\ge ${need - a * p}$，所以 $s \\ge ${Q.of(need - a * p, b).toLatex()}$。达到它的最小整数是 $${s}$。`,
            ),
          ],
          t(
            `$${s}$ small items bring the total to $${a * p + b * s} \\ge ${need}$, but $${s - 1}$ give only $${a * p + b * (s - 1)} < ${need}$.`,
            `卖 $${s}$ 件小商品时总额为 $${a * p + b * s} \\ge ${need}$，而 $${s - 1}$ 件只有 $${a * p + b * (s - 1)} < ${need}$。`,
          ),
          [
            t(
              `This rounds down; $${s - 1}$ small items leave the total at $${a * p + b * (s - 1)}$, short of $${need}$.`,
              `这是向下取整了；$${s - 1}$ 件小商品时总额只有 $${a * p + b * (s - 1)}$，不足 $${need}$。`,
            ),
            t(`This is one more small item than needed.`, `这比需要的多了一件小商品。`),
            t(
              `This divides the whole goal by the small price and forgets the large items already sold.`,
              `这是把整个目标除以小商品的单价，忘了已卖出的大商品。`,
            ),
          ],
        ),
      );
    },
  ),
  spec("Systems of Two-Variable Inequalities", "二元不等式组", ["systems-of-linear-inequalities"], (rng, hard) => {
    const m = rng.int(1, 4);
    const b = rng.int(1, 6);
    const x0 = rng.int(1, 3);
    const y0 = m * x0 + b + 1;
    const lim = x0 + y0 + rng.int(1, 3);
    const sys = `\\begin{cases} y > ${cx(m)} ${sg(b)} \\\\ x + y < ${lim} \\end{cases}`;
    const bounds = step(
      "Bound y at this x",
      "在这个横坐标处限定纵坐标",
      `At $x = ${x0}$ the first inequality says $y > ${m} \\times ${x0} ${sg(b)} = ${m * x0 + b}$, and the second says $y < ${lim} - ${x0} = ${lim - x0}$. So $${m * x0 + b} < y < ${lim - x0}$.`,
      `$x = ${x0}$ 时，第一个不等式给出 $y > ${m} \\times ${x0} ${sg(b)} = ${m * x0 + b}$，第二个给出 $y < ${lim} - ${x0} = ${lim - x0}$。所以 $${m * x0 + b} < y < ${lim - x0}$。`,
    );
    if (!hard)
      return mc(
        rng,
        t(`Which point is a solution of the system?\n$$${sys}$$`, `哪个点是不等式组的解？\n$$${sys}$$`),
        `(${x0}, ${y0})`,
        [`(${x0}, ${m * x0 + b})`, `(${x0}, ${lim - x0})`, `(${x0 + lim}, ${y0})`, `(${x0}, ${m * x0 + b - 1})`],
        worked(
          [
            bounds,
            step(
              "Test the point",
              "检验这个点",
              `Every choice but one has $x = ${x0}$, so $y$ must be a number strictly between $${m * x0 + b}$ and $${lim - x0}$. Of the choices, only $(${x0}, ${y0})$ has such a $y$.`,
              `除一个选项外都有 $x = ${x0}$，所以 $y$ 必须严格在 $${m * x0 + b}$ 与 $${lim - x0}$ 之间。各选项中只有 $(${x0}, ${y0})$ 的 $y$ 满足。`,
            ),
          ],
          t(
            `$${y0} > ${m} \\times ${x0} ${sg(b)} = ${m * x0 + b}$ and $${x0} + ${y0} = ${x0 + y0} < ${lim}$.`,
            `$${y0} > ${m} \\times ${x0} ${sg(b)} = ${m * x0 + b}$，且 $${x0} + ${y0} = ${x0 + y0} < ${lim}$。`,
          ),
          [
            t(
              `This point is on the line $y = ${cx(m)} ${sg(b)}$, and the inequality $>$ is strict.`,
              `这个点在直线 $y = ${cx(m)} ${sg(b)}$ 上，而 $>$ 是严格的。`,
            ),
            t(`Here $x + y = ${lim}$ exactly, and the inequality $<$ is strict.`, `这里 $x + y$ 恰好等于 $${lim}$，而 $<$ 是严格的。`),
            t(`Here $x + y = ${x0 + lim + y0}$, far more than $${lim}$.`, `这里 $x + y = ${x0 + lim + y0}$，远大于 $${lim}$。`),
            t(
              `This point is below the line $y = ${cx(m)} ${sg(b)}$, not above it.`,
              `这个点在直线 $y = ${cx(m)} ${sg(b)}$ 下方，而不是上方。`,
            ),
          ],
        ),
      );
    return spr(
      t(
        `If $x = ${x0}$, what is the greatest integer value of $y$ that satisfies the system?\n$$${sys}$$`,
        `若 $x = ${x0}$，满足不等式组的 $y$ 的最大整数值是多少？\n$$${sys}$$`,
      ),
      lim - x0 - 1,
      [lim - x0, m * x0 + b, m * x0 + b + 1 === lim - x0 - 1 ? lim : m * x0 + b + 1],
      worked(
        [
          bounds,
          step(
            "Take the greatest integer",
            "取最大整数",
            `$y$ must be less than $${lim - x0}$, strictly, so the greatest integer is $${lim - x0 - 1}$, and it is above $${m * x0 + b}$ as required.`,
            `$y$ 必须严格小于 $${lim - x0}$，所以最大整数是 $${lim - x0 - 1}$，它也满足大于 $${m * x0 + b}$。`,
          ),
        ],
        t(
          `$${lim - x0 - 1} > ${m * x0 + b}$ and $${x0} + ${lim - x0 - 1} = ${lim - 1} < ${lim}$, while $y = ${lim - x0}$ would give $x + y = ${lim}$.`,
          `$${lim - x0 - 1} > ${m * x0 + b}$，且 $${x0} + ${lim - x0 - 1} = ${lim - 1} < ${lim}$；而 $y = ${lim - x0}$ 会使 $x + y = ${lim}$。`,
        ),
        [
          t(`This makes $x + y$ equal $${lim}$, but the inequality $<$ is strict.`, `这会使 $x + y$ 等于 $${lim}$，而 $<$ 是严格的。`),
          t(`This is the lower boundary, and $y$ must be strictly above it.`, `这是下边界，$y$ 必须严格大于它。`),
          m * x0 + b + 1 === lim - x0 - 1
            ? t(`This is the bound on $x + y$, not on $y$.`, `这是 $x + y$ 的上限，不是 $y$ 的上限。`)
            : t(`This is the least integer that works, not the greatest.`, `这是满足条件的最小整数，不是最大整数。`),
        ],
      ),
    );
  }),
  spec("Modeling With Systems of Inequalities", "用不等式组建模", ["modeling-with-systems-of-inequalities"], (rng, hard) => {
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
      worked(
        [
          step(
            "Translate the budget",
            "翻译预算条件",
            `The chairs cost $${a}x + ${b}y$ dollars, and at most $${T}$ gives $${a}x + ${b}y \\le ${T}$.`,
            `椅子共花 $${a}x + ${b}y$ 美元，“最多 $${T}$”给出 $${a}x + ${b}y \\le ${T}$。`,
          ),
          step(
            "Translate the counts",
            "翻译数量条件",
            `There are $x + y$ chairs, and at least $${n}$ gives $x + y \\ge ${n}$.${hard ? ` At least $${min}$ large chairs gives $x \\ge ${min}$.` : ""}`,
            `椅子共 $x + y$ 把，“至少 $${n}$”给出 $x + y \\ge ${n}$。${hard ? `“大椅子至少 $${min}$ 把”给出 $x \\ge ${min}$。` : ""}`,
          ),
        ],
        t(
          `Each inequality uses $\\le$ exactly where the story says at most and $\\ge$ where it says at least, and the prices multiply the chair counts.`,
          `每个不等式在“最多”处用 $\\le$，在“至少”处用 $\\ge$，单价乘以椅子数量。`,
        ),
        hard
          ? [
              t(`This reverses the budget: at most needs $\\le$.`, `这是把预算条件弄反了：“最多”要用 $\\le$。`),
              t(`This reverses the count: at least $${n}$ chairs needs $\\ge$.`, `这是把数量条件弄反了：“至少 $${n}$ 把”要用 $\\ge$。`),
              t(
                `This reverses the condition on large chairs: at least $${min}$ needs $\\ge$.`,
                `这是把大椅子的条件弄反了：“至少 $${min}$ 把”要用 $\\ge$。`,
              ),
            ]
          : [
              t(`This reverses the budget: at most needs $\\le$.`, `这是把预算条件弄反了：“最多”要用 $\\le$。`),
              t(`This reverses the count: at least $${n}$ chairs needs $\\ge$.`, `这是把数量条件弄反了：“至少 $${n}$ 把”要用 $\\ge$。`),
              t(
                `This mixes up the conditions: the prices belong with the budget $${T}$, and the count with $${n}$.`,
                `这是把条件搞混了：单价应与预算 $${T}$ 对应，数量应与 $${n}$ 对应。`,
              ),
            ],
      ),
    );
  }),
  spec(
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
          worked(
            [
              step(
                "Use the fewest chairs",
                "用最少的椅子",
                `Every extra chair costs money, so to fit the most large chairs, buy exactly $${n}$ chairs: $x$ large and $${n} - x$ small.`,
                `多一把椅子就多花钱，所以要让大椅子尽量多，就恰好买 $${n}$ 把：大椅子 $x$ 把，小椅子 $${n} - x$ 把。`,
              ),
              step(
                "Apply the budget",
                "代入预算",
                `$${a}x + ${b}(${n} - x) \\le ${T}$ becomes $${a - b}x + ${b * n} \\le ${T}$, so $${a - b}x \\le ${T - b * n}$ and $x \\le ${x0}$.`,
                `$${a}x + ${b}(${n} - x) \\le ${T}$ 化为 $${a - b}x + ${b * n} \\le ${T}$，所以 $${a - b}x \\le ${T - b * n}$，$x \\le ${x0}$。`,
              ),
            ],
            t(
              `$${x0}$ large and $${y0}$ small chairs make $${n}$ chairs for $${a} \\times ${x0} + ${b} \\times ${y0} = ${T}$ dollars; one more large chair in place of a small one would cost $${a - b}$ more.`,
              `$${x0}$ 把大椅子和 $${y0}$ 把小椅子共 $${n}$ 把，花 $${a} \\times ${x0} + ${b} \\times ${y0} = ${T}$ 美元；再把一把小椅子换成大椅子就要多花 $${a - b}$ 美元。`,
            ),
            [
              t(`This is the number of small chairs in the best plan.`, `这是最佳方案中小椅子的数量。`),
              t(`This is the total number of chairs; not all of them can be large.`, `这是椅子总数；不可能全是大椅子。`),
              t(
                `This spends the whole budget on large chairs and ignores the $${n}$-chair minimum.`,
                `这是把全部预算都用来买大椅子，忽略了至少 $${n}$ 把的要求。`,
              ),
            ],
          ),
        );
      return spr(
        t(
          `A planner buys large chairs at $\\$${a}$ each and small chairs at $\\$${b}$ each, for at most $\\$${T}$. What is the greatest number of chairs in total if at least $${x0}$ must be large?`,
          `一位策划人以每把 $${a}$ 美元买大椅子，每把 $${b}$ 美元买小椅子，最多花 $${T}$ 美元。若至少 $${x0}$ 把必须是大椅子，椅子总数最多是多少？`,
        ),
        n,
        [y0, Q.of(T, a + b), Q.of(T, b)],
        worked(
          [
            step(
              "Buy only the required large chairs",
              "只买必需的大椅子",
              `Small chairs are cheaper, so every dollar beyond the requirement should go to small chairs. The $${x0}$ large chairs cost $${a} \\times ${x0} = ${a * x0}$ dollars.`,
              `小椅子更便宜，所以满足要求后的每一美元都应买小椅子。$${x0}$ 把大椅子花 $${a} \\times ${x0} = ${a * x0}$ 美元。`,
            ),
            step(
              "Spend the rest on small chairs",
              "余下的钱买小椅子",
              `$${T} - ${a * x0} = ${b * y0}$ dollars remain, which buy $\\frac{${b * y0}}{${b}} = ${y0}$ small chairs. In all, $${x0} + ${y0} = ${n}$ chairs.`,
              `剩下 $${T} - ${a * x0} = ${b * y0}$ 美元，可买 $\\frac{${b * y0}}{${b}} = ${y0}$ 把小椅子。共 $${x0} + ${y0} = ${n}$ 把。`,
            ),
          ],
          t(
            `The plan costs $${a} \\times ${x0} + ${b} \\times ${y0} = ${T}$ dollars, within the budget, and any extra large chair would replace more than one small chair.`,
            `这个方案花 $${a} \\times ${x0} + ${b} \\times ${y0} = ${T}$ 美元，在预算内；多买一把大椅子就要少买不止一把小椅子。`,
          ),
          [
            t(`This counts only the small chairs and leaves out the $${x0}$ large ones.`, `这只算了小椅子，漏掉了 $${x0}$ 把大椅子。`),
            t(
              `This divides the budget by the cost of one chair of each kind, which is not a chair count.`,
              `这是用预算除以两种椅子各一把的价钱，这不是椅子的数量。`,
            ),
            t(
              `This spends the whole budget on small chairs and ignores the required large ones.`,
              `这是把全部预算都买了小椅子，忽略了必需的大椅子。`,
            ),
          ],
        ),
      );
    },
  ),
];
