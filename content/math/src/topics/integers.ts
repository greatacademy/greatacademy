import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { num, paren } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

const abs = Math.abs;

export const integersAndOpposites: TopicDef = {
  id: "integers-and-opposites",
  title: t("Integers and Opposites", "整数与相反数"),
  summary: t("Place integers on the number line, find opposites, and compare integers.", "在数轴上表示整数，求相反数，比较整数大小。"),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.6.NS.C.5", "CCSS.6.NS.C.6", "CCSS.6.NS.C.7"],
  knowledgePoints: [
    {
      id: "opposites",
      title: t("Opposites", "相反数"),
      explanation: t(
        "The **integers** are the whole numbers $0, 1, 2, 3, \\dots$ together with their negatives $-1, -2, -3, \\dots$. On a number line, negative numbers lie to the left of $0$.\n\nTwo numbers are **opposites** if they are the same distance from $0$ on opposite sides. The opposite of $a$ is written $-a$. For example, the opposite of $5$ is $-5$, and the opposite of $-5$ is $-(-5) = 5$. The opposite of $0$ is $0$.",
        "**整数**由自然数 $0, 1, 2, 3, \\dots$ 和它们的相反数 $-1, -2, -3, \\dots$ 组成。在数轴上，负数位于 $0$ 的左边。\n\n如果两个数到 $0$ 的距离相等且位于 $0$ 的两侧，它们就互为**相反数**。$a$ 的相反数记作 $-a$。例如 $5$ 的相反数是 $-5$，$-5$ 的相反数是 $-(-5) = 5$。$0$ 的相反数是 $0$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-40, 40);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`What is the opposite of $${num(a)}$?`, `$${num(a)}$ 的相反数是多少？`),
            answer: -a,
            wrong: [a],
            solution: t(
              `$${num(-a)}$ is the same distance from $0$ as $${num(a)}$, on the other side, so the opposite of $${num(a)}$ is $${num(-a)}$.`,
              `$${num(-a)}$ 与 $${num(a)}$ 到 $0$ 的距离相等，且位于 $0$ 的另一侧，所以 $${num(a)}$ 的相反数是 $${num(-a)}$。`,
            ),
          });
        }
        const b = abs(a);
        return numberProblem({
          prompt: t(`Evaluate $-(-${b})$.`, `计算 $-(-${b})$。`),
          answer: b,
          wrong: [-b],
          solution: t(`$-(-${b})$ is the opposite of $-${b}$, which is $${b}$.`, `$-(-${b})$ 是 $-${b}$ 的相反数，即 $${b}$。`),
        });
      },
    },
    {
      id: "comparing-integers",
      title: t("Comparing integers", "比较整数大小"),
      explanation: t(
        "On a number line, numbers increase from left to right. Of two integers, the one further to the right is greater.\n\nSo every positive number is greater than every negative number, and among negative numbers, the one closer to $0$ is greater: $-2 > -7$ because $-2$ lies to the right of $-7$.",
        "在数轴上，数从左到右逐渐增大。两个整数中，位置更靠右的那个更大。\n\n因此，正数都大于负数；在负数之间，离 $0$ 越近的越大：$-2 > -7$，因为 $-2$ 在 $-7$ 的右边。",
      ),
      generate(rng) {
        const a = rng.int(-30, 30);
        const b = rng.bool(0.1) ? a : rng.bool(0.6) ? -rng.int(1, 30) : rng.int(-30, 30);
        const correct = a < b ? 0 : a > b ? 1 : 2;
        const reason =
          a === b
            ? t(`The two numbers are equal.`, `两个数相等。`)
            : a < b
              ? t(`$${num(a)}$ lies to the left of $${num(b)}$ on the number line.`, `在数轴上，$${num(a)}$ 位于 $${num(b)}$ 的左边。`)
              : t(`$${num(a)}$ lies to the right of $${num(b)}$ on the number line.`, `在数轴上，$${num(a)}$ 位于 $${num(b)}$ 的右边。`);
        const symbol = ["<", ">", "="][correct];
        return choiceProblem({
          prompt: t(
            `Which symbol makes the statement true? $$${num(a)} \\;\\square\\; ${num(b)}$$`,
            `哪个符号能使下式成立？$$${num(a)} \\;\\square\\; ${num(b)}$$`,
          ),
          options: [t("$<$", "$<$"), t("$>$", "$>$"), t("$=$", "$=$")],
          correct,
          solution: t(`${reason.en} So $${num(a)} ${symbol} ${num(b)}$.`, `${reason["zh-CN"]}所以 $${num(a)} ${symbol} ${num(b)}$。`),
        });
      },
    },
  ],
};

export const absoluteValue: TopicDef = {
  id: "absolute-value",
  title: t("Absolute Value", "绝对值"),
  summary: t("Find the distance of an integer from zero.", "求整数到零的距离。"),
  prerequisites: ["integers-and-opposites"],
  encompasses: [{ topic: "integers-and-opposites", weight: 0.3 }],
  xp: 8,
  standards: ["CCSS.6.NS.C.7.C"],
  knowledgePoints: [
    {
      id: "evaluating-absolute-values",
      title: t("Evaluating absolute values", "求绝对值"),
      explanation: t(
        "The **absolute value** of a number is its distance from $0$ on the number line, written $|a|$. A distance is never negative, so $|7| = 7$ and $|-7| = 7$. In general, $|a| = a$ when $a \\ge 0$, and $|a| = -a$ when $a < 0$.",
        "一个数的**绝对值**是它在数轴上到 $0$ 的距离，记作 $|a|$。距离不可能是负数，所以 $|7| = 7$，$|-7| = 7$。一般地，当 $a \\ge 0$ 时 $|a| = a$，当 $a < 0$ 时 $|a| = -a$。",
      ),
      generate(rng) {
        const a = rng.bool(0.75) ? -rng.int(1, 60) : rng.int(0, 60);
        return numberProblem({
          prompt: t(`Evaluate $|${num(a)}|$.`, `计算 $|${num(a)}|$。`),
          answer: abs(a),
          wrong: [-abs(a)],
          solution: t(
            `$${num(a)}$ is $${abs(a)}$ units from $0$, so $|${num(a)}| = ${abs(a)}$.`,
            `$${num(a)}$ 到 $0$ 的距离是 $${abs(a)}$，所以 $|${num(a)}| = ${abs(a)}$。`,
          ),
        });
      },
    },
    {
      id: "expressions-with-absolute-values",
      title: t("Expressions with absolute values", "含绝对值的式子"),
      explanation: t(
        "Treat absolute value bars like parentheses: evaluate each absolute value first, then do the remaining operations. A minus sign outside the bars applies after the absolute value is taken, so $-|-4| = -4$.",
        "绝对值符号的作用类似括号：先求出每个绝对值，再进行其余运算。绝对值符号外面的负号要在求出绝对值之后再作用，所以 $-|-4| = -4$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-25, 25);
        const b = rng.nonZero(-25, 25);
        switch (rng.int(0, 2)) {
          case 0:
            return numberProblem({
              prompt: t(`Evaluate $-|${num(a)}|$.`, `计算 $-|${num(a)}|$。`),
              answer: -abs(a),
              wrong: [abs(a)],
              solution: t(
                `First $|${num(a)}| = ${abs(a)}$, then take the opposite: $-|${num(a)}| = ${num(-abs(a))}$.`,
                `先求 $|${num(a)}| = ${abs(a)}$，再取相反数：$-|${num(a)}| = ${num(-abs(a))}$。`,
              ),
            });
          case 1:
            return numberProblem({
              prompt: t(`Evaluate $|${num(a)}| + |${num(b)}|$.`, `计算 $|${num(a)}| + |${num(b)}|$。`),
              answer: abs(a) + abs(b),
              wrong: [a + b, abs(a + b)],
              solution: t(
                `$|${num(a)}| + |${num(b)}| = ${abs(a)} + ${abs(b)} = ${abs(a) + abs(b)}$.`,
                `$|${num(a)}| + |${num(b)}| = ${abs(a)} + ${abs(b)} = ${abs(a) + abs(b)}$。`,
              ),
            });
          default:
            return numberProblem({
              prompt: t(`Evaluate $|${num(a)}| - |${num(b)}|$.`, `计算 $|${num(a)}| - |${num(b)}|$。`),
              answer: abs(a) - abs(b),
              wrong: [a - b, abs(a - b), abs(b) - abs(a)],
              solution: t(
                `$|${num(a)}| - |${num(b)}| = ${abs(a)} - ${abs(b)} = ${num(abs(a) - abs(b))}$.`,
                `$|${num(a)}| - |${num(b)}| = ${abs(a)} - ${abs(b)} = ${num(abs(a) - abs(b))}$。`,
              ),
            });
        }
      },
    },
  ],
};

export const addingIntegers: TopicDef = {
  id: "adding-integers",
  title: t("Adding Integers", "整数加法"),
  summary: t("Add integers with the same sign and with different signs.", "同号整数相加与异号整数相加。"),
  prerequisites: ["absolute-value"],
  encompasses: [{ topic: "absolute-value", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.7.NS.A.1"],
  knowledgePoints: [
    {
      id: "same-signs",
      title: t("Adding integers with the same sign", "同号整数相加"),
      explanation: t(
        "To add two integers with the **same sign**, add their absolute values and keep the common sign. For example, $(-6) + (-9)$: the absolute values add to $6 + 9 = 15$, and both numbers are negative, so the sum is $-15$.\n\nOn the number line: starting at $-6$ and moving $9$ more units to the left lands on $-15$.",
        "**同号**两数相加，把它们的绝对值相加，并保留共同的符号。例如 $(-6) + (-9)$：绝对值之和为 $6 + 9 = 15$，两个数都是负数，所以和为 $-15$。\n\n在数轴上看：从 $-6$ 出发再向左移动 $9$ 个单位，到达 $-15$。",
      ),
      keyPrerequisites: ["absolute-value"],
      generate(rng) {
        const s = rng.bool(0.8) ? -1 : 1;
        const a = s * rng.int(2, 60);
        const b = s * rng.int(2, 60);
        const sum = a + b;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} + ${paren(b)}$.`, `计算 $${num(a)} + ${paren(b)}$。`),
          answer: sum,
          wrong: [-sum, a - b],
          solution: t(
            `Both numbers are ${s < 0 ? "negative" : "positive"}. Add the absolute values, $${abs(a)} + ${abs(b)} = ${abs(sum)}$, and keep the sign: $${num(a)} + ${paren(b)} = ${num(sum)}$.`,
            `两个数都是${s < 0 ? "负数" : "正数"}。把绝对值相加：$${abs(a)} + ${abs(b)} = ${abs(sum)}$，并保留符号：$${num(a)} + ${paren(b)} = ${num(sum)}$。`,
          ),
        });
      },
    },
    {
      id: "different-signs",
      title: t("Adding integers with different signs", "异号整数相加"),
      explanation: t(
        "To add two integers with **different signs**, subtract the smaller absolute value from the larger one, and give the result the sign of the number with the larger absolute value. For example, $(-11) + 4$: $11 - 4 = 7$, and $-11$ has the larger absolute value, so the sum is $-7$.\n\nOn the number line: starting at $-11$ and moving $4$ units to the right lands on $-7$. A number plus its opposite is $0$.",
        "**异号**两数相加，用较大的绝对值减去较小的绝对值，结果取绝对值较大的那个数的符号。例如 $(-11) + 4$：$11 - 4 = 7$，$-11$ 的绝对值较大，所以和为 $-7$。\n\n在数轴上看：从 $-11$ 出发向右移动 $4$ 个单位，到达 $-7$。一个数与它的相反数相加得 $0$。",
      ),
      keyPrerequisites: ["absolute-value"],
      generate(rng) {
        let a = rng.int(1, 60);
        let b = rng.int(1, 60);
        while (a === b) b = rng.int(1, 60);
        if (rng.bool()) a = -a;
        else b = -b;
        const sum = a + b;
        const [big, small] = abs(a) > abs(b) ? [a, b] : [b, a];
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} + ${paren(b)}$.`, `计算 $${num(a)} + ${paren(b)}$。`),
          answer: sum,
          wrong: [-sum, abs(a) + abs(b), -(abs(a) + abs(b))],
          solution: t(
            `The signs differ. Subtract the absolute values: $${abs(big)} - ${abs(small)} = ${abs(sum)}$. The number with the larger absolute value, $${num(big)}$, is ${big < 0 ? "negative" : "positive"}, so $${num(a)} + ${paren(b)} = ${num(sum)}$.`,
            `两数异号。绝对值相减：$${abs(big)} - ${abs(small)} = ${abs(sum)}$。绝对值较大的数 $${num(big)}$ 是${big < 0 ? "负数" : "正数"}，所以 $${num(a)} + ${paren(b)} = ${num(sum)}$。`,
          ),
        });
      },
    },
  ],
};

export const subtractingIntegers: TopicDef = {
  id: "subtracting-integers",
  title: t("Subtracting Integers", "整数减法"),
  summary: t("Subtract integers by adding the opposite.", "把减法化为加上相反数来计算整数减法。"),
  prerequisites: ["adding-integers"],
  encompasses: [{ topic: "adding-integers", weight: 1 }],
  xp: 12,
  standards: ["CCSS.7.NS.A.1.C"],
  knowledgePoints: [
    {
      id: "subtracting-a-positive",
      title: t("Subtracting a positive integer", "减去正整数"),
      explanation: t(
        "Subtracting a number is the same as adding its opposite: $a - b = a + (-b)$. For example, $3 - 8 = 3 + (-8) = -5$, and $-4 - 6 = -4 + (-6) = -10$.",
        "减去一个数，等于加上这个数的相反数：$a - b = a + (-b)$。例如 $3 - 8 = 3 + (-8) = -5$，$-4 - 6 = -4 + (-6) = -10$。",
      ),
      keyPrerequisites: ["adding-integers"],
      generate(rng) {
        const b = rng.int(2, 50);
        const a = rng.bool(0.5) ? rng.int(0, b - 1) : -rng.int(1, 50);
        const d = a - b;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} - ${b}$.`, `计算 $${num(a)} - ${b}$。`),
          answer: d,
          wrong: [b - a, a + b, -(a + b)],
          solution: t(
            `Add the opposite: ${steps(`${num(a)} - ${b} = ${num(a)} + (-${b}) = ${num(d)}`)}`,
            `加上相反数：${steps(`${num(a)} - ${b} = ${num(a)} + (-${b}) = ${num(d)}`)}`,
          ),
        });
      },
    },
    {
      id: "subtracting-a-negative",
      title: t("Subtracting a negative integer", "减去负整数"),
      explanation: t(
        "To subtract a negative number, add its opposite, which is positive: $a - (-b) = a + b$. For example, $-9 - (-4) = -9 + 4 = -5$.",
        "减去一个负数，等于加上它的相反数（一个正数）：$a - (-b) = a + b$。例如 $-9 - (-4) = -9 + 4 = -5$。",
      ),
      keyPrerequisites: ["adding-integers"],
      generate(rng) {
        const a = rng.nonZero(-50, 50);
        const b = rng.int(2, 50);
        const d = a + b;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} - (-${b})$.`, `计算 $${num(a)} - (-${b})$。`),
          answer: d,
          wrong: [a - b, -a - b, -d],
          solution: t(
            `Add the opposite of $-${b}$, which is $${b}$: ${steps(`${num(a)} - (-${b}) = ${num(a)} + ${b} = ${num(d)}`)}`,
            `加上 $-${b}$ 的相反数 $${b}$：${steps(`${num(a)} - (-${b}) = ${num(a)} + ${b} = ${num(d)}`)}`,
          ),
        });
      },
    },
  ],
};

export const multiplyingIntegers: TopicDef = {
  id: "multiplying-integers",
  title: t("Multiplying Integers", "整数乘法"),
  summary: t("Multiply integers using the sign rules.", "运用符号法则做整数乘法。"),
  prerequisites: ["integers-and-opposites"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.7.NS.A.2"],
  knowledgePoints: [
    {
      id: "two-factors",
      title: t("Multiplying two integers", "两个整数相乘"),
      explanation: t(
        "Multiply the absolute values, then decide the sign:\n\n- same signs give a **positive** product: $(-3)(-5) = 15$;\n- different signs give a **negative** product: $(-3) \\cdot 5 = -15$.\n\nAny number times $0$ is $0$.",
        "先把绝对值相乘，再确定符号：\n\n- 同号相乘得**正数**：$(-3)(-5) = 15$；\n- 异号相乘得**负数**：$(-3) \\cdot 5 = -15$。\n\n任何数乘以 $0$ 都得 $0$。",
      ),
      generate(rng) {
        let a = rng.nonZero(-12, 12);
        const b = rng.nonZero(-12, 12);
        if (a > 0 && b > 0) a = -a;
        const p = a * b;
        const same = a < 0 === b < 0;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} \\cdot ${paren(b)}$.`, `计算 $${num(a)} \\cdot ${paren(b)}$。`),
          answer: p,
          wrong: [-p, a + b],
          solution: t(
            `$${abs(a)} \\cdot ${abs(b)} = ${abs(p)}$, and the signs are ${same ? "the same, so the product is positive" : "different, so the product is negative"}: $${num(a)} \\cdot ${paren(b)} = ${num(p)}$.`,
            `$${abs(a)} \\cdot ${abs(b)} = ${abs(p)}$，两数${same ? "同号，所以积为正" : "异号，所以积为负"}：$${num(a)} \\cdot ${paren(b)} = ${num(p)}$。`,
          ),
        });
      },
    },
    {
      id: "several-factors",
      title: t("Multiplying several integers", "多个整数相乘"),
      explanation: t(
        "When several nonzero numbers are multiplied, count the negative factors: an **even** number of negative factors gives a positive product, an **odd** number gives a negative product. For example, $(-2)(-3)(-4)$ has three negative factors, so it equals $-24$.",
        "多个非零数相乘时，数一数负因数的个数：负因数有**偶数**个，积为正；有**奇数**个，积为负。例如 $(-2)(-3)(-4)$ 有三个负因数，所以等于 $-24$。",
      ),
      generate(rng) {
        const fs = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.nonZero(-6, 6)];
        if (fs.every((f) => f > 0)) fs[rng.int(0, 2)]! *= -1;
        const p = fs.reduce((x, y) => x * y, 1);
        const negatives = fs.filter((f) => f < 0).length;
        const expr = fs.map(paren).join(" \\cdot ");
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: p,
          wrong: [-p],
          solution: t(
            `$${fs.map(abs).join(" \\cdot ")} = ${abs(p)}$. There ${negatives === 1 ? "is 1 negative factor" : `are ${negatives} negative factors`}, an ${negatives % 2 ? "odd" : "even"} number, so the product is $${num(p)}$.`,
            `$${fs.map(abs).join(" \\cdot ")} = ${abs(p)}$。负因数有 ${negatives} 个，是${negatives % 2 ? "奇" : "偶"}数个，所以积为 $${num(p)}$。`,
          ),
        });
      },
    },
  ],
};

export const dividingIntegers: TopicDef = {
  id: "dividing-integers",
  title: t("Dividing Integers", "整数除法"),
  summary: t("Divide integers using the sign rules.", "运用符号法则做整数除法。"),
  prerequisites: ["multiplying-integers"],
  encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.7.NS.A.2.B"],
  knowledgePoints: [
    {
      id: "division-sign",
      title: t("Dividing integers", "两个整数相除"),
      explanation: t(
        "Division follows the same sign rules as multiplication, because $a \\div b = c$ exactly when $b \\cdot c = a$:\n\n- same signs give a positive quotient: $(-24) \\div (-6) = 4$;\n- different signs give a negative quotient: $24 \\div (-6) = -4$.\n\nDivision by $0$ is undefined.",
        "除法的符号法则与乘法相同，因为 $a \\div b = c$ 当且仅当 $b \\cdot c = a$：\n\n- 同号相除得正数：$(-24) \\div (-6) = 4$；\n- 异号相除得负数：$24 \\div (-6) = -4$。\n\n除以 $0$ 没有意义。",
      ),
      keyPrerequisites: ["multiplying-integers"],
      generate(rng) {
        const b = rng.nonZero(-12, 12);
        let c = rng.nonZero(-12, 12);
        if (b > 0 && c > 0) c = -c;
        const a = b * c;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} \\div ${paren(b)}$.`, `计算 $${num(a)} \\div ${paren(b)}$。`),
          answer: c,
          wrong: [-c],
          solution: t(
            `$${abs(a)} \\div ${abs(b)} = ${abs(c)}$, and the signs are ${a < 0 === b < 0 ? "the same, so the quotient is positive" : "different, so the quotient is negative"}: $${num(a)} \\div ${paren(b)} = ${num(c)}$.`,
            `$${abs(a)} \\div ${abs(b)} = ${abs(c)}$，两数${a < 0 === b < 0 ? "同号，所以商为正" : "异号，所以商为负"}：$${num(a)} \\div ${paren(b)} = ${num(c)}$。`,
          ),
        });
      },
    },
    {
      id: "fraction-bar",
      title: t("The fraction bar as division", "分数线表示除法"),
      explanation: t(
        "A fraction bar means division: $\\dfrac{a}{b} = a \\div b$. A negative sign may sit in the numerator, in the denominator or in front, with the same value: $\\dfrac{-12}{4} = \\dfrac{12}{-4} = -\\dfrac{12}{4} = -3$.",
        "分数线表示除法：$\\dfrac{a}{b} = a \\div b$。负号可以写在分子、分母或分数前面，值都相同：$\\dfrac{-12}{4} = \\dfrac{12}{-4} = -\\dfrac{12}{4} = -3$。",
      ),
      generate(rng) {
        const b = rng.nonZero(-12, 12);
        const c = rng.nonZero(-12, 12);
        const a = b * c;
        const outside = rng.bool(0.35);
        const expr = `${outside ? "-" : ""}\\dfrac{${num(a)}}{${num(b)}}`;
        const value = outside ? -c : c;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: value,
          wrong: [-value],
          solution: outside
            ? t(
                `First $\\dfrac{${num(a)}}{${num(b)}} = ${num(c)}$; the sign in front gives its opposite, $${num(value)}$.`,
                `先算 $\\dfrac{${num(a)}}{${num(b)}} = ${num(c)}$；前面的负号取它的相反数，得 $${num(value)}$。`,
              )
            : t(
                `$\\dfrac{${num(a)}}{${num(b)}} = ${num(a)} \\div ${paren(b)} = ${num(c)}$.`,
                `$\\dfrac{${num(a)}}{${num(b)}} = ${num(a)} \\div ${paren(b)} = ${num(c)}$。`,
              ),
        });
      },
    },
  ],
};

export const powersOfIntegers: TopicDef = {
  id: "powers-of-integers",
  title: t("Powers of Integers", "整数的乘方"),
  summary: t("Evaluate powers with negative bases, and tell $(-a)^n$ from $-a^n$.", "计算底数为负数的乘方，区分 $(-a)^n$ 与 $-a^n$。"),
  prerequisites: ["multiplying-integers"],
  encompasses: [{ topic: "multiplying-integers", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.6.EE.A.1"],
  knowledgePoints: [
    {
      id: "negative-bases",
      title: t("Powers of negative numbers", "负数的乘方"),
      explanation: t(
        "A power is repeated multiplication: $a^n$ means $n$ factors of $a$. For a negative base, the parentheses are part of the base: $(-2)^3 = (-2)(-2)(-2) = -8$.\n\nAn **even** power of a negative number is positive, an **odd** power is negative.",
        "乘方是重复的乘法：$a^n$ 表示 $n$ 个 $a$ 相乘。底数为负数时，括号是底数的一部分：$(-2)^3 = (-2)(-2)(-2) = -8$。\n\n负数的**偶数**次幂为正，**奇数**次幂为负。",
      ),
      keyPrerequisites: ["multiplying-integers"],
      generate(rng) {
        const [base, n] = rng.pick<[number, number]>([
          [rng.int(2, 10), 2],
          [rng.int(2, 5), 3],
          [rng.int(2, 3), rng.int(4, 5)],
          [1, rng.int(5, 20)],
        ]);
        const value = (-base) ** n;
        const product = n <= 5 ? `${Array(n).fill(`(-${base})`).join("")} = ` : "";
        return numberProblem({
          prompt: t(`Evaluate $(-${base})^{${n}}$.`, `计算 $(-${base})^{${n}}$。`),
          answer: value,
          wrong: [-value, -base * n],
          solution: t(
            `${steps(`(-${base})^{${n}} = ${product}${num(value)}`)}There are ${n} negative factors, an ${n % 2 ? "odd" : "even"} number, so the result is ${n % 2 ? "negative" : "positive"}.`,
            `${steps(`(-${base})^{${n}} = ${product}${num(value)}`)}共有 ${n} 个负因数，是${n % 2 ? "奇" : "偶"}数个，所以结果为${n % 2 ? "负" : "正"}。`,
          ),
        });
      },
    },
    {
      id: "negative-of-a-power",
      title: t("The opposite of a power", "乘方的相反数"),
      explanation: t(
        "An exponent applies only to what is directly in front of it. In $-3^2$ there are no parentheses, so the exponent applies to $3$ alone and the minus sign is applied afterwards: $-3^2 = -(3^2) = -9$, whereas $(-3)^2 = 9$.",
        "指数只作用于紧挨在它前面的部分。$-3^2$ 中没有括号，所以指数只作用于 $3$，负号在乘方之后再作用：$-3^2 = -(3^2) = -9$，而 $(-3)^2 = 9$。",
      ),
      generate(rng) {
        const [base, n] = rng.pick<[number, number]>([
          [rng.int(2, 12), 2],
          [rng.int(2, 5), 3],
          [rng.int(2, 3), 4],
        ]);
        const parens = rng.bool(0.3);
        const value = parens ? (-base) ** n : -(base ** n);
        const other = parens ? -(base ** n) : (-base) ** n;
        const expr = parens ? `(-${base})^{${n}}` : `-${base}^{${n}}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: value,
          wrong: [other, -base * n],
          solution: parens
            ? t(`The base is $-${base}$: $${expr} = ${num(value)}$.`, `底数是 $-${base}$：$${expr} = ${num(value)}$。`)
            : t(
                `The exponent applies to $${base}$ only: ${steps(`${expr} = -(${base}^{${n}}) = -${base ** n}`)}`,
                `指数只作用于 $${base}$：${steps(`${expr} = -(${base}^{${n}}) = -${base ** n}`)}`,
              ),
        });
      },
    },
  ],
};

export const orderOfOperationsWithIntegers: TopicDef = {
  id: "order-of-operations-with-integers",
  title: t("Order of Operations with Integers", "整数的混合运算"),
  summary: t("Evaluate expressions with integers using the order of operations.", "按运算顺序计算含整数的式子。"),
  prerequisites: ["subtracting-integers", "dividing-integers", "powers-of-integers"],
  encompasses: [
    { topic: "subtracting-integers", weight: 0.5 },
    { topic: "dividing-integers", weight: 0.5 },
    { topic: "powers-of-integers", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.7.NS.A.3"],
  knowledgePoints: [
    {
      id: "without-exponents",
      title: t("Multiplication before addition", "先乘除后加减"),
      explanation: t(
        "Evaluate in this order:\n\n1. inside parentheses;\n2. exponents;\n3. multiplication and division, from left to right;\n4. addition and subtraction, from left to right.\n\nSo $5 - 3 \\cdot (-2) = 5 - (-6) = 11$, but $(5 - 3) \\cdot (-2) = 2 \\cdot (-2) = -4$.",
        "按以下顺序计算：\n\n1. 括号内；\n2. 乘方；\n3. 乘法和除法，从左到右；\n4. 加法和减法，从左到右。\n\n所以 $5 - 3 \\cdot (-2) = 5 - (-6) = 11$，而 $(5 - 3) \\cdot (-2) = 2 \\cdot (-2) = -4$。",
      ),
      keyPrerequisites: ["subtracting-integers", "multiplying-integers"],
      generate(rng) {
        const a = rng.nonZero(-20, 20);
        const b = rng.nonZero(-9, 9);
        const c = rng.nonZero(-9, 9);
        switch (rng.int(0, 2)) {
          case 0: {
            const v = a - b * c;
            return numberProblem({
              prompt: t(`Evaluate $${num(a)} - ${paren(b)} \\cdot ${paren(c)}$.`, `计算 $${num(a)} - ${paren(b)} \\cdot ${paren(c)}$。`),
              answer: v,
              wrong: [(a - b) * c, a + b * c],
              solution: t(
                `Multiply first: ${steps(`${num(a)} - ${paren(b)} \\cdot ${paren(c)} = ${num(a)} - ${paren(b * c)} = ${num(v)}`)}`,
                `先算乘法：${steps(`${num(a)} - ${paren(b)} \\cdot ${paren(c)} = ${num(a)} - ${paren(b * c)} = ${num(v)}`)}`,
              ),
            });
          }
          case 1: {
            const v = (a - b) * c;
            return numberProblem({
              prompt: t(
                `Evaluate $(${num(a)} - ${paren(b)}) \\cdot ${paren(c)}$.`,
                `计算 $(${num(a)} - ${paren(b)}) \\cdot ${paren(c)}$。`,
              ),
              answer: v,
              wrong: [a - b * c, (a + b) * c],
              solution: t(
                `Parentheses first: ${steps(`(${num(a)} - ${paren(b)}) \\cdot ${paren(c)} = ${paren(a - b)} \\cdot ${paren(c)} = ${num(v)}`)}`,
                `先算括号：${steps(`(${num(a)} - ${paren(b)}) \\cdot ${paren(c)} = ${paren(a - b)} \\cdot ${paren(c)} = ${num(v)}`)}`,
              ),
            });
          }
          default: {
            const d = rng.nonZero(-20, 20);
            const v = a - b + d;
            return numberProblem({
              prompt: t(`Evaluate $${num(a)} - ${paren(b)} + ${paren(d)}$.`, `计算 $${num(a)} - ${paren(b)} + ${paren(d)}$。`),
              answer: v,
              wrong: [a - (b + d), a + b + d],
              solution: t(
                `Add and subtract from left to right: ${steps(`${num(a)} - ${paren(b)} + ${paren(d)} = ${num(a - b)} + ${paren(d)} = ${num(v)}`)}`,
                `从左到右依次加减：${steps(`${num(a)} - ${paren(b)} + ${paren(d)} = ${num(a - b)} + ${paren(d)} = ${num(v)}`)}`,
              ),
            });
          }
        }
      },
    },
    {
      id: "with-exponents-and-division",
      title: t("Exponents and division", "含乘方与除法的运算"),
      explanation: t(
        "Exponents come before multiplication and division, which come before addition and subtraction. For example, $-7 + (-2)^3 \\div 4 = -7 + (-8) \\div 4 = -7 + (-2) = -9$.",
        "乘方先于乘除，乘除先于加减。例如 $-7 + (-2)^3 \\div 4 = -7 + (-8) \\div 4 = -7 + (-2) = -9$。",
      ),
      keyPrerequisites: ["powers-of-integers", "dividing-integers"],
      generate(rng) {
        const a = rng.nonZero(-20, 20);
        if (rng.bool()) {
          const b = rng.nonZero(-6, 6);
          const v = a - b * b;
          return numberProblem({
            prompt: t(`Evaluate $${num(a)} - ${paren(b)}^{2}$.`, `计算 $${num(a)} - ${paren(b)}^{2}$。`),
            answer: v,
            wrong: [(a - b) ** 2, a + b * b],
            solution: t(
              `Exponent first: ${steps(`${num(a)} - ${paren(b)}^{2} = ${num(a)} - ${b * b} = ${num(v)}`)}`,
              `先算乘方：${steps(`${num(a)} - ${paren(b)}^{2} = ${num(a)} - ${b * b} = ${num(v)}`)}`,
            ),
          });
        }
        const c = rng.nonZero(-6, 6);
        const qt = rng.nonZero(-9, 9);
        const b = c * qt;
        const v = a + qt;
        return numberProblem({
          prompt: t(`Evaluate $${num(a)} + ${paren(b)} \\div ${paren(c)}$.`, `计算 $${num(a)} + ${paren(b)} \\div ${paren(c)}$。`),
          answer: v,
          wrong: [a - qt, ...((a + b) % c === 0 ? [(a + b) / c] : [])],
          solution: t(
            `Divide first: ${steps(`${num(a)} + ${paren(b)} \\div ${paren(c)} = ${num(a)} + ${paren(qt)} = ${num(v)}`)}`,
            `先算除法：${steps(`${num(a)} + ${paren(b)} \\div ${paren(c)} = ${num(a)} + ${paren(qt)} = ${num(v)}`)}`,
          ),
        });
      },
    },
  ],
};

/** integerTopics are the topics of the integers unit, in teaching order. */
export const integerTopics: readonly TopicDef[] = [
  integersAndOpposites,
  absoluteValue,
  addingIntegers,
  subtractingIntegers,
  multiplyingIntegers,
  dividingIntegers,
  powersOfIntegers,
  orderOfOperationsWithIntegers,
];
