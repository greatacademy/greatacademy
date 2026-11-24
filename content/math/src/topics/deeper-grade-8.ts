// Further knowledge points for topics of 8th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade8Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { numberProblem } from "../problems.ts";

const combinationWithoutSolving: KnowledgePointDef = {
  id: "a-combination-without-solving-the-system",
  title: t("A combination without solving the system", "不解方程组求组合式的值"),
  explanation: t(
    `Sometimes a question asks for $x + y$ or $x - y$ and not for the separate values. Look at the coefficients before solving. If they are swapped between the two equations, adding the equations makes the coefficients of $x$ and $y$ equal, and subtracting makes them equal for the difference. Factoring or dividing then gives the wanted value in one step, without fractions on the way.

Take $5x + 2y = 19$ and $2x + 5y = 16$. Adding gives $7x + 7y = 35$, that is $7(x + y) = 35$, so $x + y = 5$. Subtracting the second from the first gives $3x - 3y = 3$, so $x - y = 1$. Indeed $x = 3$, $y = 2$ fits both: $15 + 4 = 19$ and $6 + 10 = 16$.

> **Watch out.** $35$ is $7(x + y)$, not $x + y$: divide by the common coefficient. For the difference, subtract the second equation from the first, so that the larger coefficient of $x$ comes first; the other order gives $y - x$, the opposite number.`,
    `有时题目问的是 $x + y$ 或 $x - y$，而不是各自的值。解之前先看系数。如果两个方程的系数正好互换，把方程相加会使 $x$ 和 $y$ 的系数相等，相减对差也有同样的效果。接着提取公因数或做除法，一步就得到所要的值，中途也不会出现分数。

看 $5x + 2y = 19$ 和 $2x + 5y = 16$。相加得 $7x + 7y = 35$，即 $7(x + y) = 35$，所以 $x + y = 5$。第一个方程减去第二个方程得 $3x - 3y = 3$，所以 $x - y = 1$。确实，$x = 3$，$y = 2$ 同时满足两个方程：$15 + 4 = 19$，$6 + 10 = 16$。

> **注意。** $35$ 是 $7(x + y)$，不是 $x + y$：要除以公共系数。求差时用第一个方程减去第二个方程，让 $x$ 的较大系数在前；反过来减得到的是 $y - x$，正好是相反数。`,
  ),
  generate(rng) {
    const b = rng.int(2, 6);
    const a = b + rng.int(1, 5);
    const x = rng.int(1, 12);
    const y = rng.pick([...Array(12).keys()].map((i) => i + 1).filter((v) => v !== x));
    const s = a * x + b * y;
    const u = b * x + a * y;
    const asksSum = rng.bool();
    const answer = asksSum ? x + y : x - y;
    const gap = a - b;
    const differenceLeft = gap === 1 ? "x - y" : `${gap}x - ${gap}y`;
    return numberProblem({
      prompt: t(
        `Given $${a}x + ${b}y = ${s}$ and $${b}x + ${a}y = ${u}$, find the value of $${asksSum ? "x + y" : "x - y"}$.`,
        `已知 $${a}x + ${b}y = ${s}$ 和 $${b}x + ${a}y = ${u}$，求 $${asksSum ? "x + y" : "x - y"}$ 的值。`,
      ),
      answer,
      form: "integer",
      wrong: [asksSum ? s + u : s - u, asksSum ? x - y : x + y, x, y, -answer, answer + 1],
      solution: t(
        `${
          asksSum
            ? `**Add the equations.** The coefficients are swapped, so adding makes them equal: $${a + b}x + ${a + b}y = ${s + u}$, that is $${a + b}(x + y) = ${s + u}$.

**Divide.** Dividing by $${a + b}$ gives $x + y = ${answer}$.`
            : `**Subtract the equations.** The coefficients are swapped, so subtracting the second equation from the first makes them equal: $${differenceLeft} = ${s - u}$.

${gap === 1 ? `**Read off.** The left side is already $x - y$, so $x - y = ${answer}$.` : `**Divide.** That is $${gap}(x - y) = ${s - u}$; dividing by $${gap}$ gives $x - y = ${answer}$.`}`
        }

**Check.** Solving fully gives $x = ${x}$, $y = ${y}$, which fits both equations: $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${s}$ and $${b} \\cdot ${x} + ${a} \\cdot ${y} = ${u}$. And $${asksSum ? `${x} + ${y}` : `${x} - ${y}`} = ${answer}$.`,
        `${
          asksSum
            ? `**两个方程相加。** 系数正好互换，相加后系数相等：$${a + b}x + ${a + b}y = ${s + u}$，即 $${a + b}(x + y) = ${s + u}$。

**做除法。** 两边除以 $${a + b}$，得 $x + y = ${answer}$。`
            : `**两个方程相减。** 系数正好互换，第一个方程减去第二个方程后系数相等：$${differenceLeft} = ${s - u}$。

${gap === 1 ? `**直接读出。** 左边已经是 $x - y$，所以 $x - y = ${answer}$。` : `**做除法。** 即 $${gap}(x - y) = ${s - u}$，两边除以 $${gap}$，得 $x - y = ${answer}$。`}`
        }

**检验。** 完整解出来是 $x = ${x}$，$y = ${y}$，两个方程都满足：$${a} \\cdot ${x} + ${b} \\cdot ${y} = ${s}$，$${b} \\cdot ${x} + ${a} \\cdot ${y} = ${u}$。而 $${asksSum ? `${x} + ${y}` : `${x} - ${y}`} = ${answer}$。`,
      ),
    });
  },
};

const isoscelesExterior: KnowledgePointDef = {
  id: "an-exterior-angle-of-an-isosceles-triangle",
  figure: gradeDrawings5["exterior-angles-of-triangles#an-exterior-angle-of-an-isosceles-triangle"],
  title: t("An exterior angle of an isosceles triangle", "等腰三角形的外角"),
  explanation: t(
    "An exterior angle equals the sum of the two interior angles that are not next to it. In an isosceles triangle, this has a useful form. At the apex, the two opposite angles are the equal base angles, so the exterior angle is twice one of them. At a base vertex, the exterior angle is next to one base angle, which is found first, and the base angles then give the apex by the angle sum.",
    "外角等于和它不相邻的两个内角之和。在等腰三角形中，这有一个很有用的形式。在顶点处，不相邻的两个角是相等的底角，所以外角是一个底角的两倍。在底角的顶点处，外角和一个底角相邻，先求出这个底角，再由内角和从两个底角求出顶角。",
  ),
  generate(rng) {
    const atApex = rng.bool();
    const exterior = atApex ? 2 * rng.int(20, 85) : 2 * rng.int(48, 85);
    const answer = atApex ? exterior / 2 : 2 * exterior - 180;
    return numberProblem({
      prompt: atApex
        ? t(
            `An exterior angle at the apex of an isosceles triangle measures $${exterior}^\\circ$. What is each base angle, in degrees?`,
            `等腰三角形顶角处的一个外角是 $${exterior}^\\circ$。每个底角是多少度？`,
          )
        : t(
            `An exterior angle at a base vertex of an isosceles triangle measures $${exterior}^\\circ$. What is the apex angle, in degrees?`,
            `等腰三角形一个底角处的外角是 $${exterior}^\\circ$。顶角是多少度？`,
          ),
      answer,
      form: "integer",
      wrong: [180 - exterior, exterior, atApex ? (180 - exterior) / 2 + 45 : exterior - 90, answer + 10, 360 - exterior],
      solution: t(
        atApex
          ? `The exterior angle equals the sum of the two equal base angles, so each is $${exterior}^\\circ \\div 2 = ${answer}^\\circ$.`
          : `Each base angle is $180^\\circ - ${exterior}^\\circ = ${180 - exterior}^\\circ$. So the apex is $180^\\circ - 2 \\times ${180 - exterior}^\\circ = ${answer}^\\circ$.`,
        atApex
          ? `外角等于两个相等的底角之和，所以每个底角是 $${exterior}^\\circ \\div 2 = ${answer}^\\circ$。`
          : `每个底角是 $180^\\circ - ${exterior}^\\circ = ${180 - exterior}^\\circ$。所以顶角是 $180^\\circ - 2 \\times ${180 - exterior}^\\circ = ${answer}^\\circ$。`,
      ),
    });
  },
};

/** deeperGrade8Points maps topics of 8th Grade Math to further knowledge points. */
export const deeperGrade8Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "introduction-to-elimination": [combinationWithoutSolving],
  "exterior-angles-of-triangles": [isoscelesExterior],
};
