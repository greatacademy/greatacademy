import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { mc, par, sg, spec, spr, step, worked } from "../exam.ts";

// SAT Math Prep, Algebra: linear equations, word problems, two-variable models and linear functions.

/** satExamAlgebra1 are the exam-style questions of the first modules of the SAT Algebra unit. */
export const satExamAlgebra1: ExamSpec[] = [
  spec("Evaluating Expressions", "求代数式的值", ["evaluating-expressions"], (rng, hard) => {
    const a = rng.int(2, 6);
    const c = rng.int(2, 9);
    if (!hard) {
      const v = rng.int(2, 6);
      const b = rng.int(2, 5);
      const ans = b * v * v - c;
      return mc(
        rng,
        t(`What is the value of $${b}x^2 - ${c}$ when $x = ${v}$?`, `当 $x = ${v}$ 时，$${b}x^2 - ${c}$ 的值是多少？`),
        ans,
        [(b * v) ** 2 - c, 2 * b * v - c, b * v * v + c],
        worked(
          [
            step(
              "Square first",
              "先平方",
              `Put $${v}$ in for $x$. The exponent belongs to $x$ alone, so $(${v})^2 = ${v * v}$.`,
              `把 $x$ 换成 $${v}$。指数只作用于 $x$，所以 $(${v})^2 = ${v * v}$。`,
            ),
            step(
              "Multiply, then subtract",
              "再乘，后减",
              `$${b} \\times ${v * v} - ${c} = ${b * v * v} - ${c} = ${ans}$.`,
              `$${b} \\times ${v * v} - ${c} = ${b * v * v} - ${c} = ${ans}$。`,
            ),
          ],
          t(
            `Add $${c}$ back: $${ans} + ${c} = ${b * v * v}$, and $${b * v * v} \\div ${b} = ${v * v} = ${v}^2$.`,
            `加回 $${c}$：$${ans} + ${c} = ${b * v * v}$，而 $${b * v * v} \\div ${b} = ${v * v} = ${v}^2$。`,
          ),
          [
            t(
              `This squares $${b} \\times ${v}$ together; only $x$ is squared.`,
              `这是把 $${b} \\times ${v}$ 一起平方了；只有 $x$ 要平方。`,
            ),
            t(`This doubles $${v}$ instead of squaring it.`, `这是把 $${v}$ 乘以 $2$，而不是平方。`),
            t(`This adds $${c}$ instead of subtracting it.`, `这是加上了 $${c}$，而不是减去。`),
          ],
        ),
      );
    }
    const v = rng.int(2, 7);
    const k = rng.int(2, 4);
    const d = rng.int(1, 9);
    const lhs = a * v - c;
    const ans = k * lhs + d;
    return mc(
      rng,
      t(
        `If $${a}x - ${c} = ${lhs}$, what is the value of $${k * a}x - ${k * c} ${sg(d)}$?`,
        `若 $${a}x - ${c} = ${lhs}$，则 $${k * a}x - ${k * c} ${sg(d)}$ 的值是多少？`,
      ),
      ans,
      [k * lhs, lhs + d, k * a * v + d],
      worked(
        [
          step(
            "Spot the multiple",
            "找出倍数关系",
            `$${k * a}x - ${k * c} = ${k}(${a}x - ${c})$, so it is $${k}$ times the known expression: $${k} \\times ${lhs} = ${k * lhs}$.`,
            `$${k * a}x - ${k * c} = ${k}(${a}x - ${c})$，是已知式子的 $${k}$ 倍：$${k} \\times ${lhs} = ${k * lhs}$。`,
          ),
          step(
            "Add the constant",
            "加上常数",
            `$${k * lhs} + ${d} = ${ans}$, without solving for $x$.`,
            `$${k * lhs} + ${d} = ${ans}$，无需解出 $x$。`,
          ),
        ],
        t(
          `Solve instead: $${a}x = ${lhs + c}$ gives $x = ${v}$, and $${k * a} \\times ${v} - ${k * c} + ${d} = ${ans}$.`,
          `换一种方法：由 $${a}x = ${lhs + c}$ 得 $x = ${v}$，而 $${k * a} \\times ${v} - ${k * c} + ${d} = ${ans}$。`,
        ),
        [
          t(`This stops before adding $${d}$.`, `这是忘了加上 $${d}$。`),
          t(
            `This adds $${d}$ to $${lhs}$ without multiplying by $${k}$ first.`,
            `这是没有先乘以 $${k}$，就直接把 $${d}$ 加到 $${lhs}$ 上。`,
          ),
          t(`This uses $${k * a}x$ but drops the $-${k * c}$.`, `这是只算了 $${k * a}x$，漏掉了 $-${k * c}$。`),
        ],
      ),
    );
  }),
  spec("Solving One-Step Addition Equations", "解一步加减方程", ["one-step-equations-addition"], (rng, hard) => {
    const a = rng.int(6, 40);
    const b = rng.int(45, 120);
    const k = rng.int(2, 9);
    if (!hard) {
      const ans = b - a + k;
      return mc(
        rng,
        t(`If $x + ${a} = ${b}$, what is the value of $x + ${a + k}$?`, `若 $x + ${a} = ${b}$，则 $x + ${a + k}$ 的值是多少？`),
        b + k,
        [ans, b - a, b + a + k],
        worked(
          [
            step(
              "Compare the expressions",
              "比较两个式子",
              `$x + ${a + k} = (x + ${a}) + ${k}$, so it is $${k}$ more than $x + ${a}$.`,
              `$x + ${a + k} = (x + ${a}) + ${k}$，比 $x + ${a}$ 大 $${k}$。`,
            ),
            step("Add", "相加", `$${b} + ${k} = ${b + k}$.`, `$${b} + ${k} = ${b + k}$。`),
          ],
          t(
            `Solve first: $x = ${b} - ${a} = ${b - a}$, and $${b - a} + ${a + k} = ${b + k}$.`,
            `先解方程：$x = ${b} - ${a} = ${b - a}$，而 $${b - a} + ${a + k} = ${b + k}$。`,
          ),
          [
            t(`This is $x + ${k}$, not $x + ${a + k}$: it leaves out the $${a}$.`, `这是 $x + ${k}$，不是 $x + ${a + k}$：漏掉了 $${a}$。`),
            t(`This is $x$ itself, not the expression asked for.`, `这是 $x$ 本身，而不是题目要求的式子。`),
            t(`This adds $${a}$ to $${b}$ when solving, instead of subtracting it.`, `这是解方程时把 $${a}$ 加到 $${b}$ 上，而不是减去。`),
          ],
        ),
      );
    }
    const ans = b - a;
    return spr(
      t(
        `A tank held some water. After $${a}$ liters were added, it held $${b}$ liters. Then $${k}$ liters were removed. How many liters more does the tank hold now than it held at the start?`,
        `水箱里原有一些水。加入 $${a}$ 升后，水箱有 $${b}$ 升。然后又放出 $${k}$ 升。现在水箱里的水比最初多多少升？`,
      ),
      a - k,
      [ans, ans - k, a + k],
      worked(
        [
          step(
            "Find the start",
            "求最初的水量",
            `The start $s$ satisfies $s + ${a} = ${b}$, so $s = ${ans}$ liters.`,
            `设最初为 $s$ 升，则 $s + ${a} = ${b}$，所以 $s = ${ans}$。`,
          ),
          step(
            "Compare now with the start",
            "比较现在与最初",
            `Now the tank holds $${b} - ${k} = ${b - k}$ liters, which is $${b - k} - ${ans} = ${a - k}$ liters more.`,
            `现在水箱有 $${b} - ${k} = ${b - k}$ 升，比最初多 $${b - k} - ${ans} = ${a - k}$ 升。`,
          ),
        ],
        t(
          `The net change is $${a}$ liters in and $${k}$ out: $${a} - ${k} = ${a - k}$.`,
          `净变化是加入 $${a}$ 升、放出 $${k}$ 升：$${a} - ${k} = ${a - k}$。`,
        ),
        [
          t(`This is the amount at the start, not how much more there is now.`, `这是最初的水量，而不是现在比最初多的量。`),
          t(`This subtracts the $${k}$ liters from the start amount.`, `这是从最初的水量里减去了 $${k}$ 升。`),
          t(`This adds the $${k}$ liters removed instead of subtracting them.`, `这是把放出的 $${k}$ 升加上了，而不是减去。`),
        ],
      ),
    );
  }),
  spec("Solving One-Step Multiplication Equations", "解一步乘除方程", ["one-step-equations-multiplication"], (rng, hard) => {
    const a = rng.int(3, 9);
    const v = rng.int(3, 15);
    if (!hard) {
      const k = rng.int(2, 5);
      return mc(
        rng,
        t(`If $${a}x = ${a * v}$, what is the value of $${k * a}x$?`, `若 $${a}x = ${a * v}$，则 $${k * a}x$ 的值是多少？`),
        k * a * v,
        [v, k * v, a * v + k],
        worked(
          [
            step("Spot the multiple", "找出倍数关系", `$${k * a}x = ${k} \\times ${a}x$.`, `$${k * a}x = ${k} \\times ${a}x$。`),
            step("Multiply", "相乘", `$${k} \\times ${a * v} = ${k * a * v}$.`, `$${k} \\times ${a * v} = ${k * a * v}$。`),
          ],
          t(
            `Solve first: $x = ${a * v} \\div ${a} = ${v}$, and $${k * a} \\times ${v} = ${k * a * v}$.`,
            `先解方程：$x = ${a * v} \\div ${a} = ${v}$，而 $${k * a} \\times ${v} = ${k * a * v}$。`,
          ),
          [
            t(`This is $x$ itself, not $${k * a}x$.`, `这是 $x$ 本身，不是 $${k * a}x$。`),
            t(`This is $${k}x$: it multiplies $x$ by $${k}$ but not by $${a}$.`, `这是 $${k}x$：只乘了 $${k}$，没有乘 $${a}$。`),
            t(`This adds $${k}$ to $${a * v}$ instead of multiplying by it.`, `这是把 $${k}$ 加到 $${a * v}$ 上，而不是相乘。`),
          ],
        ),
      );
    }
    const d = rng.pick([3, 4, 5, 7]);
    const n = rng.int(2, d - 1);
    const m = rng.int(2, 8);
    const ans = d * m;
    return spr(
      t(`If $\\frac{${n}}{${d}}x = ${n * m}$, what is the value of $x$?`, `若 $\\frac{${n}}{${d}}x = ${n * m}$，则 $x$ 的值是多少？`),
      ans,
      [n * m * n, m, Q.of(n * m * n, d)],
      worked(
        [
          step(
            "Use the reciprocal",
            "乘以倒数",
            `The reciprocal of $\\frac{${n}}{${d}}$ is $\\frac{${d}}{${n}}$; multiplying both sides by it leaves $x$ alone.`,
            `$\\frac{${n}}{${d}}$ 的倒数是 $\\frac{${d}}{${n}}$；两边同乘它，左边只剩 $x$。`,
          ),
          step(
            "Multiply",
            "计算",
            `$x = ${n * m} \\times \\frac{${d}}{${n}} = ${m} \\times ${d} = ${ans}$.`,
            `$x = ${n * m} \\times \\frac{${d}}{${n}} = ${m} \\times ${d} = ${ans}$。`,
          ),
        ],
        t(
          `$\\frac{${n}}{${d}} \\times ${ans} = ${n} \\times ${m} = ${n * m}$, the right side.`,
          `$\\frac{${n}}{${d}} \\times ${ans} = ${n} \\times ${m} = ${n * m}$，正是右边。`,
        ),
        [
          t(`This multiplies by $${n}$, the numerator, instead of by the reciprocal.`, `这是乘以了分子 $${n}$，而不是乘以倒数。`),
          t(`This divides by $${n}$ but forgets to multiply by $${d}$.`, `这是除以了 $${n}$，却忘了乘以 $${d}$。`),
          t(
            `This multiplies by $\\frac{${n}}{${d}}$ itself instead of its reciprocal.`,
            `这是乘以了 $\\frac{${n}}{${d}}$ 本身，而不是它的倒数。`,
          ),
        ],
      ),
    );
  }),
  spec("Solving Multistep Linear Equations", "解多步一次方程", ["equations-with-variables-on-both-sides"], (rng, hard) => {
    const v = rng.int(2, 9);
    const a = rng.int(5, 9);
    const c = rng.int(2, a - 2);
    const b = rng.int(2, 15);
    const d = (a - c) * v + b;
    const eq = `${a}x + ${b} = ${c}x + ${d}`;
    if (!hard)
      return mc(
        rng,
        t(`What value of $x$ satisfies $${eq}$?`, `哪个 $x$ 的值满足 $${eq}$？`),
        v,
        [Q.of(d + b, a - c), Q.of(d - b, a + c), v + 1],
        worked(
          [
            step(
              "Gather the terms",
              "移项",
              `Subtract $${c}x$ and $${b}$ from both sides: $${a - c}x = ${d - b}$.`,
              `两边同减 $${c}x$ 和 $${b}$：$${a - c}x = ${d - b}$。`,
            ),
            step("Divide", "两边相除", `$x = ${d - b} \\div ${a - c} = ${v}$.`, `$x = ${d - b} \\div ${a - c} = ${v}$。`),
          ],
          t(
            `Both sides at $x = ${v}$: $${a * v} + ${b} = ${a * v + b}$ and $${c * v} + ${d} = ${c * v + d}$.`,
            `代入 $x = ${v}$：左边 $${a * v} + ${b} = ${a * v + b}$，右边 $${c * v} + ${d} = ${c * v + d}$。`,
          ),
          [
            t(`This adds $${b}$ to the right side instead of subtracting it.`, `这是把 $${b}$ 加到右边，而不是减去。`),
            t(`This adds $${c}x$ to the left side instead of subtracting it.`, `这是把 $${c}x$ 加到左边，而不是减去。`),
            t(`This is one more than the solution; the check fails for it.`, `它比解大 $1$；代入检验不成立。`),
          ],
        ),
      );
    const k = rng.int(2, 6);
    const ans = k * v - 1;
    return spr(
      t(`If $${eq}$, what is the value of $${k}x - 1$?`, `若 $${eq}$，则 $${k}x - 1$ 的值是多少？`),
      ans,
      [v, k * v, k * (v - 1)],
      worked(
        [
          step(
            "Solve for x",
            "解出未知数",
            `Subtract $${c}x$ and $${b}$: $${a - c}x = ${d - b}$, so $x = ${v}$.`,
            `两边同减 $${c}x$ 和 $${b}$：$${a - c}x = ${d - b}$，所以 $x = ${v}$。`,
          ),
          step("Evaluate", "求值", `$${k} \\times ${v} - 1 = ${ans}$.`, `$${k} \\times ${v} - 1 = ${ans}$。`),
        ],
        t(
          `At $x = ${v}$ both sides of the equation are $${a * v + b}$, so $x = ${v}$ is right, and $${ans} + 1 = ${k * v}$ is $${k}$ times $${v}$.`,
          `$x = ${v}$ 时方程两边都等于 $${a * v + b}$，解正确；而 $${ans} + 1 = ${k * v}$ 正是 $${v}$ 的 $${k}$ 倍。`,
        ),
        [
          t(`This is $x$, not $${k}x - 1$.`, `这是 $x$，不是 $${k}x - 1$。`),
          t(`This is $${k}x$; it forgets to subtract $1$.`, `这是 $${k}x$，忘了减去 $1$。`),
          t(`This subtracts $1$ from $x$ before multiplying by $${k}$.`, `这是先从 $x$ 减去 $1$，再乘以 $${k}$。`),
        ],
      ),
    );
  }),
  spec(
    "Solving Equations With Fractional Coefficients",
    "解分数系数方程",
    ["solving-linear-equations-with-fractional-coefficients"],
    (rng, hard) => {
      const d = rng.pick([2, 3, 4, 5]);
      const v = d * rng.int(2, 8);
      const b = rng.int(1, 9);
      if (!hard) {
        const r = v / d + b;
        return mc(
          rng,
          t(`If $\\frac{x}{${d}} + ${b} = ${r}$, what is the value of $x$?`, `若 $\\frac{x}{${d}} + ${b} = ${r}$，则 $x$ 的值是多少？`),
          v,
          [r * d, r - b, (r + b) * d],
          worked(
            [
              step(
                "Subtract",
                "两边相减",
                `Subtract $${b}$: $\\frac{x}{${d}} = ${r - b}$.`,
                `两边减去 $${b}$：$\\frac{x}{${d}} = ${r - b}$。`,
              ),
              step(
                "Clear the fraction",
                "去分母",
                `Multiply by $${d}$: $x = ${r - b} \\times ${d} = ${v}$.`,
                `两边乘以 $${d}$：$x = ${r - b} \\times ${d} = ${v}$。`,
              ),
            ],
            t(`$\\frac{${v}}{${d}} + ${b} = ${v / d} + ${b} = ${r}$.`, `$\\frac{${v}}{${d}} + ${b} = ${v / d} + ${b} = ${r}$。`),
            [
              t(`This multiplies by $${d}$ before taking away $${b}$.`, `这是还没减去 $${b}$ 就乘以了 $${d}$。`),
              t(
                `This is $\\frac{x}{${d}}$, not $x$: it forgets to multiply by $${d}$.`,
                `这是 $\\frac{x}{${d}}$，不是 $x$：忘了乘以 $${d}$。`,
              ),
              t(`This adds $${b}$ instead of subtracting it.`, `这是加上了 $${b}$，而不是减去。`),
            ],
          ),
        );
      }
      const [p, q] = rng.pick([
        [3, 4],
        [2, 3],
        [2, 5],
        [3, 5],
        [4, 5],
      ] as const);
      const k = rng.int(1, 6);
      const w = p * q * k;
      const c = k * (q - p);
      return mc(
        rng,
        t(
          `If $\\frac{x}{${p}} = \\frac{x}{${q}} + ${c}$, what is the value of $x$?`,
          `若 $\\frac{x}{${p}} = \\frac{x}{${q}} + ${c}$，则 $x$ 的值是多少？`,
        ),
        w,
        [(p + q) * c, c, p * c],
        worked(
          [
            step(
              "Clear the fractions",
              "去分母",
              `Multiply every term by $${p * q}$, the common denominator: $${q}x = ${p}x + ${p * q * c}$.`,
              `每一项乘以公分母 $${p * q}$：$${q}x = ${p}x + ${p * q * c}$。`,
            ),
            step(
              "Solve",
              "解方程",
              `Subtract $${p}x$: ${q - p === 1 ? `$x = ${w}$` : `$${q - p}x = ${p * q * c}$, so $x = ${w}$`}.`,
              `两边减去 $${p}x$：${q - p === 1 ? `$x = ${w}$` : `$${q - p}x = ${p * q * c}$，所以 $x = ${w}$`}。`,
            ),
          ],
          t(
            `$\\frac{${w}}{${p}} = ${q * k}$ and $\\frac{${w}}{${q}} + ${c} = ${p * k} + ${c} = ${q * k}$.`,
            `$\\frac{${w}}{${p}} = ${q * k}$，而 $\\frac{${w}}{${q}} + ${c} = ${p * k} + ${c} = ${q * k}$。`,
          ),
          [
            t(
              `This multiplies $${c}$ by $${p} + ${q}$ instead of by $${p * q}$.`,
              `这是把 $${c}$ 乘以 $${p} + ${q}$，而不是乘以 $${p * q}$。`,
            ),
            t(`This is the constant $${c}$, which still has to be multiplied by the denominators.`, `这是常数 $${c}$，它还要乘以分母。`),
            t(`This multiplies $${c}$ by $${p}$ only, clearing just one denominator.`, `这是只把 $${c}$ 乘以 $${p}$，只去掉了一个分母。`),
          ],
        ),
      );
    },
  ),
  spec("Solving Linear Equations Containing Binomials", "解含二项式的一次方程", ["equations-with-parentheses"], (rng, hard) => {
    const a = rng.int(2, 6);
    const v = rng.int(2, 9);
    const b = rng.int(1, 8);
    if (!hard) {
      const r = a * (v + b);
      return mc(
        rng,
        t(`If $${a}(x + ${b}) = ${r}$, what is the value of $x + ${b}$?`, `若 $${a}(x + ${b}) = ${r}$，则 $x + ${b}$ 的值是多少？`),
        v + b,
        [v, r - b, r],
        worked(
          [
            step(
              "Keep the binomial whole",
              "把二项式看作整体",
              `The question asks for $x + ${b}$, which already appears inside the parentheses, so there is no need to find $x$.`,
              `题目问的是 $x + ${b}$，它正是括号里的式子，所以不必求出 $x$。`,
            ),
            step(
              "Divide",
              "两边相除",
              `Divide both sides by $${a}$: $x + ${b} = ${r} \\div ${a} = ${v + b}$.`,
              `两边除以 $${a}$：$x + ${b} = ${r} \\div ${a} = ${v + b}$。`,
            ),
          ],
          t(`$${a} \\times ${v + b} = ${r}$.`, `$${a} \\times ${v + b} = ${r}$。`),
          [
            t(`This is $x$, not $x + ${b}$.`, `这是 $x$，不是 $x + ${b}$。`),
            t(`This subtracts $${b}$ from $${r}$ without dividing by $${a}$.`, `这是从 $${r}$ 减去 $${b}$，却没有除以 $${a}$。`),
            t(`This is $${a}(x + ${b})$, the whole left side.`, `这是整个左边 $${a}(x + ${b})$ 的值。`),
          ],
        ),
      );
    }
    const c = rng.int(2, a + 1);
    const d = rng.int(1, 8);
    const sub = c + rng.int(1, 3);
    const value = a * (v + b) + sub * v - c * (v - d);
    return mc(
      rng,
      t(
        `What value of $x$ satisfies $${a}(x + ${b}) + ${sub}x - ${c}(x - ${d}) = ${value}$?`,
        `哪个 $x$ 的值满足 $${a}(x + ${b}) + ${sub}x - ${c}(x - ${d}) = ${value}$？`,
      ),
      v,
      [Q.of(value - a * b + c * d, a + sub - c), Q.of(value - a * b - c * d, a + sub + c), v + 2],
      worked(
        [
          step(
            "Distribute",
            "去括号",
            `$${a}x + ${a * b} + ${sub}x - ${c}x + ${c * d} = ${value}$, since $(-${c}) \\times (-${d}) = ${c * d}$.`,
            `$${a}x + ${a * b} + ${sub}x - ${c}x + ${c * d} = ${value}$，因为 $(-${c}) \\times (-${d}) = ${c * d}$。`,
          ),
          step(
            "Collect and solve",
            "合并并求解",
            `$${a + sub - c}x + ${a * b + c * d} = ${value}$, so $${a + sub - c}x = ${value - a * b - c * d}$ and $x = ${v}$.`,
            `$${a + sub - c}x + ${a * b + c * d} = ${value}$，所以 $${a + sub - c}x = ${value - a * b - c * d}$，$x = ${v}$。`,
          ),
        ],
        t(
          `At $x = ${v}$ the three parts are $${a} \\times ${v + b} = ${a * (v + b)}$, $${sub} \\times ${v} = ${sub * v}$ and $${c} \\times ${par(v - d)} = ${c * (v - d)}$, and $${a * (v + b)} + ${sub * v} - ${par(c * (v - d))} = ${value}$.`,
          `$x = ${v}$ 时三部分分别是 $${a} \\times ${v + b} = ${a * (v + b)}$、$${sub} \\times ${v} = ${sub * v}$ 和 $${c} \\times ${par(v - d)} = ${c * (v - d)}$，而 $${a * (v + b)} + ${sub * v} - ${par(c * (v - d))} = ${value}$。`,
        ),
        [
          t(
            `This writes $-${c}(x - ${d})$ as $-${c}x - ${c * d}$, missing the sign change.`,
            `这是把 $-${c}(x - ${d})$ 写成了 $-${c}x - ${c * d}$，漏掉了变号。`,
          ),
          t(`This adds $${c}x$ instead of subtracting it.`, `这是把 $${c}x$ 加上了，而不是减去。`),
          t(`This is two more than the solution; the check fails for it.`, `它比解大 $2$；代入检验不成立。`),
        ],
      ),
    );
  }),
];
