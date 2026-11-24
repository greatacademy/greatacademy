// Further knowledge points for topics of 8th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade8Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { numberProblem } from "../problems.ts";
import { drawn, lesson, valued } from "./grade-6-kit.ts";

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

const isoscelesExterior: KnowledgePointDef = lesson(
  "an-exterior-angle-of-an-isosceles-triangle",
  ["An exterior angle of an isosceles triangle", "等腰三角形的外角"],
  [
    [
      "An exterior angle equals the sum of the two interior angles that are not next to it. In an isosceles triangle, this has a useful form. At the apex, the two opposite angles are the equal base angles, so the exterior angle is twice one of them. At a base vertex, the exterior angle is next to one base angle, which is found first, and the base angles then give the apex by the angle sum.\n\nAn exterior angle of $110^\\circ$ at the apex gives base angles of $55^\\circ$. An exterior angle of $110^\\circ$ at a base vertex gives base angles of $70^\\circ$ and an apex of $40^\\circ$.",
      "外角等于和它不相邻的两个内角之和。在等腰三角形中，这有一个很有用的形式。在顶点处，不相邻的两个角是相等的底角，所以外角是一个底角的两倍。在底角的顶点处，外角和一个底角相邻，先求出这个底角，再由内角和从两个底角求出顶角。\n\n顶点处的外角是 $110^\\circ$，则底角是 $55^\\circ$。底角顶点处的外角是 $110^\\circ$，则底角是 $70^\\circ$，顶角是 $40^\\circ$。",
    ],
    [
      "At a base vertex, the exterior angle is the apex plus the other base angle: $40 + 70 = 110$.",
      "在底角顶点处，外角等于顶角加另一个底角：$40 + 70 = 110$。",
    ],
    [
      "Notice where the exterior angle is. Halving it gives a base angle only when it is at the apex.",
      "注意外角在哪个顶点。只有外角在顶点（顶角处）时，把它减半才得到底角。",
    ],
  ],
  (rng) => {
    if (rng.bool()) {
      const exterior = 2 * rng.int(20, 85);
      const base = exterior / 2;
      return valued(
        [
          `An exterior angle at the apex of an isosceles triangle measures $${exterior}^\\circ$. What is each base angle, in degrees?`,
          `等腰三角形顶角处的一个外角是 $${exterior}^\\circ$。每个底角是多少度？`,
        ],
        base,
        [
          [
            ["Find the remote angles", "找出不相邻的内角"],
            [
              "The two interior angles not next to the apex are the base angles, and they are equal. So the exterior angle is twice a base angle.",
              "与顶点不相邻的两个内角是两个底角，它们相等。所以外角是底角的两倍。",
            ],
          ],
          [["Halve it", "减半"], ["Share the exterior angle equally:", "把外角平均分成两份："], [`${exterior} \\div 2 = ${base}`]],
        ],
        [
          `The apex angle is $180 - ${exterior} = ${180 - exterior}$, and the base angles share the rest: $(180 - ${180 - exterior}) \\div 2 = ${base}$.`,
          `顶角是 $180 - ${exterior} = ${180 - exterior}$，两个底角平分剩下的部分：$(180 - ${180 - exterior}) \\div 2 = ${base}$。`,
        ],
        [
          [
            180 - exterior,
            "That is the apex angle, beside the exterior angle. The base angles are the remote ones.",
            "这是与外角相邻的顶角。底角是与外角不相邻的角。",
          ],
          [exterior, "That is both base angles together. Each base angle is half of it.", "这是两个底角的和。每个底角是它的一半。"],
          [180 - base, "That is the exterior angle at a base vertex, not the base angle itself.", "这是底角顶点处的外角，不是底角本身。"],
        ],
        { form: "integer", unit: "°" },
      );
    }
    const exterior = 2 * rng.int(48, 85);
    const base = 180 - exterior;
    const answer = 2 * exterior - 180;
    return valued(
      [
        `An exterior angle at a base vertex of an isosceles triangle measures $${exterior}^\\circ$. What is the apex angle, in degrees?`,
        `等腰三角形一个底角处的外角是 $${exterior}^\\circ$。顶角是多少度？`,
      ],
      answer,
      [
        [
          ["Find a base angle", "求底角"],
          ["The base angle next to the exterior angle forms a linear pair with it:", "与外角相邻的底角和它组成邻补角："],
          [`180 - ${exterior} = ${base}`],
        ],
        [
          ["Use the angle sum", "用内角和"],
          ["Both base angles are equal, so take two of them from $180$:", "两个底角相等，从 $180$ 中减去两个底角："],
          [`180 - 2 \\cdot ${base} = ${answer}`],
        ],
      ],
      [
        `The exterior angle equals the apex plus the other base angle: $${answer} + ${base} = ${exterior}$.`,
        `外角等于顶角加另一个底角：$${answer} + ${base} = ${exterior}$。`,
      ],
      [
        [base, "That is a base angle. The question asks for the apex.", "这是底角。题目问的是顶角。"],
        [
          exterior / 2,
          "You halved the exterior angle. That works only for an exterior angle at the apex.",
          "你把外角减半了。只有顶点处的外角才能这样做。",
        ],
        [
          exterior,
          "You took only one base angle from $180$, which gives back the exterior angle. Both base angles come off.",
          "你只从 $180$ 中减去了一个底角，结果又回到外角。两个底角都要减去。",
        ],
      ],
      { form: "integer", unit: "°" },
    );
  },
  drawn(gradeDrawings5["exterior-angles-of-triangles#an-exterior-angle-of-an-isosceles-triangle"]),
);

/** deeperGrade8Points maps topics of 8th Grade Math to further knowledge points. */
export const deeperGrade8Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "introduction-to-elimination": [combinationWithoutSolving],
  "exterior-angles-of-triangles": [isoscelesExterior],
};
