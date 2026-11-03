import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// SAT Math Fundamentals, algebra: radical expressions, linear equations solved by structure, systems, optimizing over
// ranges, linear functions given by tables, and translations of functions.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** squareFree are radicands with no square factor. */
const squareFree = [2, 3, 5, 6, 7, 10, 11] as const;

/** surd writes a + b√m. */
const surd = (a: number, b: number, m: number) => poly([a, ""], [b, `\\sqrt{${m}}`]);

/** units is "unit" or "units" to follow the number n. */
const units = (n: number) => (Math.abs(n) === 1 ? "unit" : "units");

/** coef writes a coefficient before a symbol: "", "-", "3", "-3". */
const coef = (c: number) => (c === 1 ? "" : c === -1 ? "-" : String(c));

// ---------------------------------------------------------------------------
// Radicals

/** simplifyingExpressionsWithSurds simplifies sums and products of surds. */
export const simplifyingExpressionsWithSurds = topic(
  "simplifying-expressions-with-surds",
  t("Simplifying Expressions With Surds", "化简含根式的表达式"),
  t(
    "Simplify sums and products of square roots by taking out square factors and combining like surds.",
    "提取平方因数、合并同类根式，从而化简平方根的和与积。",
  ),
  ["adding-and-subtracting-radicals", "the-product-rule-for-radicals"],
  ["8.EE.A.2", "HSN.RN.A.2"],
  [
    kp(
      "sums-of-surds-with-square-factors",
      t("Sums of surds with square factors", "含平方因数的根式之和"),
      t(
        "Surds can only be added when they have the same number under the root, so first take every square factor out of each root. Then the terms become like terms and their coefficients add.\n\n$$3\\sqrt{12} + \\sqrt{27} = 3 \\cdot 2\\sqrt{3} + 3\\sqrt{3} = 9\\sqrt{3}$$",
        "只有被开方数相同的根式才能相加，所以先把每个根式里的平方因数都提出来。这样各项就成为同类项，系数可以相加。\n\n$$3\\sqrt{12} + \\sqrt{27} = 3 \\cdot 2\\sqrt{3} + 3\\sqrt{3} = 9\\sqrt{3}$$",
      ),
      (rng) => {
        const m = rng.pick(squareFree);
        const [k1, k2] = rng.sample([2, 3, 4, 5], 2) as [number, number];
        const p = rng.int(1, 4);
        const q = rng.nonZero(-4, 4);
        const c = p * k1 + q * k2;
        const expr = `${coef(p)}\\sqrt{${k1 * k1 * m}}${q < 0 ? " - " : " + "}${coef(Math.abs(q))}\\sqrt{${k2 * k2 * m}}`;
        const answer = surd(0, c, m);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: [surd(0, p + q, m), surd(0, p * k1 - q * k2, m), surd(0, c, 2 * m), surd(0, p + q, k1 * k1 * m + k2 * k2 * m)],
          solution: t(
            `Take the square factors out of each root: $\\sqrt{${k1 * k1 * m}} = ${k1}\\sqrt{${m}}$ and $\\sqrt{${k2 * k2 * m}} = ${k2}\\sqrt{${m}}$. Then combine like surds:${steps(`${expr} = ${p * k1}\\sqrt{${m}} ${q < 0 ? "-" : "+"} ${Math.abs(q * k2)}\\sqrt{${m}} = ${answer}`)}`,
            `把每个根式里的平方因数提出来：$\\sqrt{${k1 * k1 * m}} = ${k1}\\sqrt{${m}}$，$\\sqrt{${k2 * k2 * m}} = ${k2}\\sqrt{${m}}$。再合并同类根式：${steps(`${expr} = ${p * k1}\\sqrt{${m}} ${q < 0 ? "-" : "+"} ${Math.abs(q * k2)}\\sqrt{${m}} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "products-of-surds",
      t("Products of surds", "根式的乘积"),
      t(
        "To multiply terms with roots, multiply the numbers in front together and the numbers under the roots together, then simplify the root that results by taking out its square factors.\n\n$$(2\\sqrt{6})(3\\sqrt{10}) = 6\\sqrt{60} = 6 \\cdot 2\\sqrt{15} = 12\\sqrt{15}$$",
        "相乘含根式的项时，根号外的数与数相乘，根号内的数与数相乘，再把所得根式中的平方因数提出来化简。\n\n$$(2\\sqrt{6})(3\\sqrt{10}) = 6\\sqrt{60} = 6 \\cdot 2\\sqrt{15} = 12\\sqrt{15}$$",
      ),
      (rng) => {
        const [x, y, r] = rng.pick([
          [6, 10, [2, 15]],
          [6, 15, [3, 10]],
          [10, 15, [5, 6]],
          [2, 6, [2, 3]],
          [3, 6, [3, 2]],
          [5, 10, [5, 2]],
          [2, 14, [2, 7]],
          [3, 15, [3, 5]],
          [7, 14, [7, 2]],
          [6, 21, [3, 14]],
        ] as const);
        const [k, m] = r;
        const a = rng.int(2, 5);
        const b = rng.int(2, 5);
        const answer = surd(0, a * b * k, m);
        return expressionProblem({
          prompt: t(`Simplify $(${a}\\sqrt{${x}})(${b}\\sqrt{${y}})$.`, `化简 $(${a}\\sqrt{${x}})(${b}\\sqrt{${y}})$。`),
          answer,
          radical: true,
          wrong: [surd(0, a * b, x * y), surd(0, a * b * k * k, m), surd(0, a + b, x * y), surd(0, a * b * k, x + y)],
          solution: t(
            `Multiply outside and inside the roots, then simplify:${steps(`(${a}\\sqrt{${x}})(${b}\\sqrt{${y}}) = ${a * b}\\sqrt{${x * y}} = ${a * b} \\cdot ${k}\\sqrt{${m}} = ${answer}`)}`,
            `根号外与根号内分别相乘，再化简：${steps(`(${a}\\sqrt{${x}})(${b}\\sqrt{${y}}) = ${a * b}\\sqrt{${x * y}} = ${a * b} \\cdot ${k}\\sqrt{${m}} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** evaluatingNumericalExpressionsContainingRadicals evaluates expressions with perfect roots and squared roots. */
export const evaluatingNumericalExpressionsContainingRadicals = topic(
  "evaluating-numerical-expressions-containing-radicals",
  t("Evaluating Numerical Expressions Containing Radicals", "计算含根式的数值表达式"),
  t(
    "Evaluate expressions that contain square and cube roots of perfect powers and squares of surds, following the order of operations.",
    "按运算顺序计算含完全平方数、完全立方数的根式以及根式平方的表达式。",
  ),
  ["the-cube-root-of-a-perfect-cube", "squaring-a-square-root"],
  ["8.EE.A.2"],
  [
    kp(
      "expressions-with-perfect-roots",
      t("Expressions with perfect roots", "含完全方根的表达式"),
      t(
        "A root of a perfect square or a perfect cube is a whole number, so replace each root by its value first. A root acts like a pair of parentheses: work out what is under it before taking the root, and then finish with the order of operations.\n\n$$2\\sqrt{25} - \\sqrt[3]{8} = 2 \\cdot 5 - 2 = 8$$",
        "完全平方数或完全立方数的方根是整数，所以先把每个根式换成它的值。根号的作用像括号：先算根号里面的部分，再开方，最后按运算顺序完成计算。\n\n$$2\\sqrt{25} - \\sqrt[3]{8} = 2 \\cdot 5 - 2 = 8$$",
      ),
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 5);
        const p = rng.int(2, 6);
        const q = rng.int(2, 4);
        const inner = rng.int(1, 4);
        // √(a² ) multiplied, cube root subtracted, and a root of a sum
        const s = rng.pick([
          [9, 16, 5],
          [36, 64, 10],
          [16, 9, 5],
          [25, 144, 13],
          [64, 36, 10],
        ] as const);
        const value = p * a - q * b + inner * s[2];
        const expr = `${p}\\sqrt{${a * a}} - ${q}\\sqrt[3]{${b ** 3}} + ${coef(inner)}\\sqrt{${s[0]} + ${s[1]}}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: value,
          form: "integer",
          wrong: [
            p * a - q * b + inner * (Math.sqrt(s[0]) + Math.sqrt(s[1])),
            p * a * a - q * b + inner * s[2],
            p * a - q * b * b + inner * s[2],
          ],
          solution: t(
            `Work out each root: $\\sqrt{${a * a}} = ${a}$, $\\sqrt[3]{${b ** 3}} = ${b}$ and $\\sqrt{${s[0]} + ${s[1]}} = \\sqrt{${s[0] + s[1]}} = ${s[2]}$. Then${steps(`${p} \\cdot ${a} - ${q} \\cdot ${b} + ${inner} \\cdot ${s[2]} = ${value}`)}The root of a sum is not the sum of the roots.`,
            `先求每个根式：$\\sqrt{${a * a}} = ${a}$，$\\sqrt[3]{${b ** 3}} = ${b}$，$\\sqrt{${s[0]} + ${s[1]}} = \\sqrt{${s[0] + s[1]}} = ${s[2]}$。于是${steps(`${p} \\cdot ${a} - ${q} \\cdot ${b} + ${inner} \\cdot ${s[2]} = ${value}`)}和的平方根不等于平方根的和。`,
          ),
        });
      },
    ),
    kp(
      "expressions-with-squared-surds",
      t("Expressions with squared surds", "含根式平方的表达式"),
      t(
        "Squaring a term with a root squares both factors: $(a\\sqrt{m})^2 = a^2 m$, so the root disappears. A product of two equal roots works the same way, since $\\sqrt{m} \\cdot \\sqrt{m} = m$. Replace these by whole numbers, then evaluate as usual.\n\n$$(3\\sqrt{2})^2 - \\sqrt{5}\\sqrt{5} = 18 - 5 = 13$$",
        "把含根式的项平方，就是把两个因数分别平方：$(a\\sqrt{m})^2 = a^2 m$，根号随之消失。两个相同根式相乘也一样，因为 $\\sqrt{m} \\cdot \\sqrt{m} = m$。把这些换成整数，再照常计算。\n\n$$(3\\sqrt{2})^2 - \\sqrt{5}\\sqrt{5} = 18 - 5 = 13$$",
      ),
      (rng) => {
        const a = rng.int(2, 5);
        const m = rng.pick(squareFree);
        const n = rng.pick(squareFree.filter((x) => x !== m));
        const b = rng.int(2, 4);
        const value = a * a * m - b * n;
        const expr = `(${a}\\sqrt{${m}})^2 - ${b}\\sqrt{${n}} \\cdot \\sqrt{${n}}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: value,
          form: "integer",
          wrong: [a * m - b * n, a * a * m - b * b * n, 2 * a * m - b * n, a * a * m * m - b * n],
          solution: t(
            `Square both factors of $${a}\\sqrt{${m}}$ and multiply the equal roots:${steps(`(${a}\\sqrt{${m}})^2 = ${a * a} \\cdot ${m} = ${a * a * m}`, `${b}\\sqrt{${n}} \\cdot \\sqrt{${n}} = ${b} \\cdot ${n} = ${b * n}`)}So the value is $${a * a * m} - ${b * n} = ${value}$.`,
            `把 $${a}\\sqrt{${m}}$ 的两个因数分别平方，并把相同根式相乘：${steps(`(${a}\\sqrt{${m}})^2 = ${a * a} \\cdot ${m} = ${a * a * m}`, `${b}\\sqrt{${n}} \\cdot \\sqrt{${n}} = ${b} \\cdot ${n} = ${b * n}`)}所以结果是 $${a * a * m} - ${b * n} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** applyingTheDistributiveLawToRadicalExpressions expands products of sums containing surds. */
export const applyingTheDistributiveLawToRadicalExpressions = topic(
  "applying-the-distributive-law-to-radical-expressions",
  t("Applying the Distributive Law to Radical Expressions", "对根式表达式运用分配律"),
  t(
    "Expand products such as $\\sqrt{m}(a + b\\sqrt{m})$ and $(a + \\sqrt{m})(b + \\sqrt{m})$ and collect the rational and surd parts.",
    "展开 $\\sqrt{m}(a + b\\sqrt{m})$、$(a + \\sqrt{m})(b + \\sqrt{m})$ 这类乘积，并分别合并有理部分与根式部分。",
  ),
  ["simplifying-expressions-with-surds", "multiplying-binomials"],
  ["HSN.RN.B.3"],
  [
    kp(
      "distributing-a-surd",
      t("Distributing a surd over a sum", "根式乘以和"),
      t(
        "Multiply the surd outside the parentheses by every term inside, exactly as with a variable. Wherever a root meets the same root, the product is the number under it, which becomes a rational term.\n\n$$\\sqrt{3}(4 + 2\\sqrt{3}) = 4\\sqrt{3} + 2 \\cdot 3 = 6 + 4\\sqrt{3}$$",
        "像处理变量一样，用括号外的根式乘括号里的每一项。相同根式相乘得到被开方数，成为有理项。\n\n$$\\sqrt{3}(4 + 2\\sqrt{3}) = 4\\sqrt{3} + 2 \\cdot 3 = 6 + 4\\sqrt{3}$$",
      ),
      (rng) => {
        const m = rng.pick(squareFree);
        const k = rng.int(1, 4);
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-4, 4);
        const expr = `${coef(k)}\\sqrt{${m}}(${surd(a, b, m)})`;
        const answer = surd(k * b * m, k * a, m);
        return expressionProblem({
          prompt: t(`Expand and simplify $${expr}$.`, `展开并化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: [surd(k * b, k * a, m), surd(k * a, k * b * m, m), surd(k * b * m, a, m), surd(0, k * a + k * b * m, m)],
          solution: t(
            `Multiply $${coef(k)}\\sqrt{${m}}$ by each term:${steps(`${coef(k)}\\sqrt{${m}} \\cdot ${paren(a)} = ${surd(0, k * a, m)}`, `${coef(k)}\\sqrt{${m}} \\cdot ${surd(0, b, m)} = ${num(k * b)} \\cdot ${m} = ${k * b * m}`)}So the result is $${answer}$.`,
            `用 $${coef(k)}\\sqrt{${m}}$ 乘每一项：${steps(`${coef(k)}\\sqrt{${m}} \\cdot ${paren(a)} = ${surd(0, k * a, m)}`, `${coef(k)}\\sqrt{${m}} \\cdot ${surd(0, b, m)} = ${num(k * b)} \\cdot ${m} = ${k * b * m}`)}所以结果是 $${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "multiplying-binomials-with-surds",
      t("Multiplying binomials with surds", "含根式的二项式相乘"),
      t(
        "Multiply two binomials with surds term by term, as in $(x + p)(x + q)$: each term of the first multiplies each term of the second. The product of the two surds is a whole number, so collect the rational terms and the surd terms separately.\n\n$$(2 + \\sqrt{5})(3 - \\sqrt{5}) = 6 - 2\\sqrt{5} + 3\\sqrt{5} - 5 = 1 + \\sqrt{5}$$",
        "像 $(x + p)(x + q)$ 那样逐项相乘含根式的两个二项式：第一个括号的每一项乘第二个括号的每一项。两个根式的积是整数，再分别合并有理项和根式项。\n\n$$(2 + \\sqrt{5})(3 - \\sqrt{5}) = 6 - 2\\sqrt{5} + 3\\sqrt{5} - 5 = 1 + \\sqrt{5}$$",
      ),
      (rng) => {
        const m = rng.pick(squareFree);
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const s = rng.sign();
        // (a + √m)(b + s√m) = ab + s m + (as + b)√m
        const rational = a * b + s * m;
        const irr = a * s + b;
        const answer = surd(rational, irr, m);
        const expr = `(${surd(a, 1, m)})(${surd(b, s, m)})`;
        return expressionProblem({
          prompt: t(`Expand and simplify $${expr}$.`, `展开并化简 $${expr}$。`),
          answer,
          radical: true,
          wrong: [surd(a * b, irr, m), surd(a * b + s * m, 0, m), surd(a * b - s * m, irr, m), surd(rational, a + b, m)],
          solution: t(
            `Multiply each term of the first binomial by each term of the second:${steps(`${expr} = ${a * b} ${s < 0 ? "-" : "+"} ${coef(a)}\\sqrt{${m}} + ${coef(b)}\\sqrt{${m}} ${s < 0 ? "-" : "+"} ${m}`)}Collect the rational terms and the surd terms to get $${answer}$.`,
            `用第一个二项式的每一项乘第二个二项式的每一项：${steps(`${expr} = ${a * b} ${s < 0 ? "-" : "+"} ${coef(a)}\\sqrt{${m}} + ${coef(b)}\\sqrt{${m}} ${s < 0 ? "-" : "+"} ${m}`)}分别合并有理项与根式项，得到 $${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** comparingRadicals compares numbers written with square roots by moving coefficients under the root. */
export const comparingRadicals = topic(
  "comparing-radicals",
  t("Comparing Radicals", "比较根式的大小"),
  t(
    "Compare numbers such as $3\\sqrt{5}$ and $2\\sqrt{11}$ by writing each as a single square root and comparing the radicands.",
    "把 $3\\sqrt{5}$、$2\\sqrt{11}$ 这样的数各写成一个平方根，再比较被开方数，从而比较大小。",
  ),
  ["surds"],
  ["8.NS.A.2"],
  [
    kp(
      "comparing-two-radicals",
      t("Comparing two radicals", "比较两个根式"),
      t(
        "For positive numbers, the larger square root belongs to the larger number under the root. To compare $a\\sqrt{m}$ with $b\\sqrt{n}$, move each coefficient inside the root by squaring it, $a\\sqrt{m} = \\sqrt{a^2 m}$, and compare the radicands.\n\n$$3\\sqrt{5} = \\sqrt{45} \\quad 2\\sqrt{11} = \\sqrt{44} \\quad \\text{so } 3\\sqrt{5} > 2\\sqrt{11}$$",
        "对正数而言，被开方数越大，平方根越大。要比较 $a\\sqrt{m}$ 与 $b\\sqrt{n}$，把系数平方后移进根号，$a\\sqrt{m} = \\sqrt{a^2 m}$，再比较被开方数。\n\n$$3\\sqrt{5} = \\sqrt{45} \\quad 2\\sqrt{11} = \\sqrt{44} \\quad \\text{所以 } 3\\sqrt{5} > 2\\sqrt{11}$$",
      ),
      (rng) => {
        let a = 0;
        let m = 0;
        let b = 0;
        let n = 0;
        do {
          a = rng.int(2, 6);
          b = rng.int(2, 6);
          m = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
          n = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
        } while (a === b || m === n || Math.abs(a * a * m - b * b * n) > 12);
        const left = a * a * m;
        const right = b * b * n;
        const rel = Math.sign(left - right) + 1;
        const options = ["<", "=", ">"].map((s) => mathText(s));
        return choiceProblem({
          prompt: t(
            `Which symbol makes this true? $$${a}\\sqrt{${m}} \\ \\square \\ ${b}\\sqrt{${n}}$$`,
            `方框中应填哪个符号？$$${a}\\sqrt{${m}} \\ \\square \\ ${b}\\sqrt{${n}}$$`,
          ),
          options,
          correct: rel,
          solution: t(
            `Move each coefficient under its root: $${a}\\sqrt{${m}} = \\sqrt{${a * a} \\cdot ${m}} = \\sqrt{${left}}$ and $${b}\\sqrt{${n}} = \\sqrt{${b * b} \\cdot ${n}} = \\sqrt{${right}}$. Since $${left} ${["<", "=", ">"][rel]} ${right}$, $${a}\\sqrt{${m}} ${["<", "=", ">"][rel]} ${b}\\sqrt{${n}}$.`,
            `把系数移进根号：$${a}\\sqrt{${m}} = \\sqrt{${a * a} \\cdot ${m}} = \\sqrt{${left}}$，$${b}\\sqrt{${n}} = \\sqrt{${b * b} \\cdot ${n}} = \\sqrt{${right}}$。因为 $${left} ${["<", "=", ">"][rel]} ${right}$，所以 $${a}\\sqrt{${m}} ${["<", "=", ">"][rel]} ${b}\\sqrt{${n}}$。`,
          ),
        });
      },
    ),
    kp(
      "finding-the-greatest-radical",
      t("Finding the greatest of several radicals", "找出几个根式中最大的"),
      t(
        "To find the greatest of several numbers written with roots, write each as a single root $\\sqrt{a^2 m}$, or compare their squares $a^2 m$, which order the same way because all the numbers are positive. A bigger coefficient does not on its own make a bigger number.\n\n$$(2\\sqrt{7})^2 = 28 \\quad (3\\sqrt{3})^2 = 27 \\quad (4\\sqrt{2})^2 = 32$$",
        "要找出几个根式中最大的，把每个都写成一个根式 $\\sqrt{a^2 m}$，或者比较它们的平方 $a^2 m$；这些数都是正数，平方的大小顺序与原数相同。系数大并不一定数就大。\n\n$$(2\\sqrt{7})^2 = 28 \\quad (3\\sqrt{3})^2 = 27 \\quad (4\\sqrt{2})^2 = 32$$",
      ),
      (rng) => {
        const pool: [number, number][] = [];
        for (const a of [2, 3, 4, 5, 6]) for (const m of [2, 3, 5, 6, 7, 10]) pool.push([a, m]);
        let items: [number, number][] = [];
        do items = rng.sample(pool, 4);
        while (new Set(items.map(([a, m]) => a * a * m)).size < 4);
        const squares = items.map(([a, m]) => a * a * m);
        const best = squares.indexOf(Math.max(...squares));
        const text = (i: number) => `${items[i]![0]}\\sqrt{${items[i]![1]}}`;
        const opts = items.map((_, i) => mathText(text(i)));
        const correct = opts[best]!;
        return pickChoice(
          rng,
          t(
            `Which of the numbers $${items.map((_, i) => text(i)).join("$, $")}$ is the greatest?`,
            `数 $${items.map((_, i) => text(i)).join("$，$")}$ 中哪个最大？`,
          ),
          correct,
          opts.filter((_, i) => i !== best),
          t(
            `Square each number: ${items.map(([a, m], i) => `$(${text(i)})^2 = ${a * a * m}$`).join(", ")}. The greatest square is $${squares[best]}$, so $${text(best)}$ is the greatest.`,
            `把每个数平方：${items.map(([a, m], i) => `$(${text(i)})^2 = ${a * a * m}$`).join("，")}。最大的平方是 $${squares[best]}$，所以 $${text(best)}$ 最大。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Linear equations by structure

/** solvingLinearEquationsContainingBinomialsByFactoring solves equations by treating a repeated binomial as one quantity. */
export const solvingLinearEquationsContainingBinomialsByFactoring = topic(
  "solving-linear-equations-containing-binomials-by-factoring",
  t("Solving Linear Equations Containing Binomials by Factoring", "用提公因式法解含二项式的一次方程"),
  t(
    "Solve equations in which the same binomial appears several times by collecting it as a single quantity.",
    "当同一个二项式多次出现时，把它看作一个整体合并，从而解方程。",
  ),
  ["equations-with-parentheses", "factoring-linear-expressions"],
  ["HSA.SSE.A.2", "HSA.REI.B.3"],
  [
    kp(
      "collecting-a-repeated-binomial",
      t("Collecting a repeated binomial", "合并重复出现的二项式"),
      t(
        "When the same binomial appears in several terms, treat it as one quantity and collect the terms like ordinary like terms. This is factoring out the binomial, and it saves expanding.\n\n$$3(x + 2) + 5(x + 2) = 24 \\implies 8(x + 2) = 24 \\implies x + 2 = 3 \\implies x = 1$$",
        "当同一个二项式出现在几项中时，把它看作一个整体，像普通同类项那样合并。这相当于提出这个二项式作为公因式，可以省去展开。\n\n$$3(x + 2) + 5(x + 2) = 24 \\implies 8(x + 2) = 24 \\implies x + 2 = 3 \\implies x = 1$$",
      ),
      (rng) => {
        const b = rng.nonZero(-9, 9);
        const p = rng.int(2, 9);
        const q = rng.nonZero(-6, 9);
        if (p + q === 0) return solvingLinearEquationsContainingBinomialsByFactoring.knowledgePoints[0]!.generate(rng);
        const v = rng.nonZero(-6, 6);
        const x = v - b;
        const total = (p + q) * v;
        const bin = linear(1, b);
        const expr = `${p}(${bin})${q < 0 ? " - " : " + "}${Math.abs(q)}(${bin}) = ${total}`;
        return numberProblem({
          prompt: t(`Solve for $x$: $$${expr}$$`, `解关于 $x$ 的方程：$$${expr}$$`),
          answer: x,
          solveFor: "x",
          wrong: [v, v + b, Q.of(total, p).sub(Q.of(b)), x + 2 * b],
          solution: t(
            `Collect the terms in $(${bin})$:${steps(`${p + q}(${bin}) = ${total}`, `${bin} = ${v}`, `x = ${x}`)}`,
            `合并含 $(${bin})$ 的项：${steps(`${p + q}(${bin}) = ${total}`, `${bin} = ${v}`, `x = ${x}`)}`,
          ),
        });
      },
    ),
    kp(
      "finding-the-value-of-a-binomial",
      t("Finding the value of a binomial", "求二项式的值"),
      t(
        "Some questions ask for the value of an expression rather than of $x$. If that expression appears in the equation, keep it whole: move its terms to one side, collect them, and divide. There is no need to find $x$ at all.\n\n$$7(2x - 1) = 3(2x - 1) + 20 \\implies 4(2x - 1) = 20 \\implies 2x - 1 = 5$$",
        "有些题目问的是某个表达式的值，而不是 $x$ 的值。如果这个表达式出现在方程中，就把它当作整体：把含它的项移到一边、合并、再相除，根本不需要求 $x$。\n\n$$7(2x - 1) = 3(2x - 1) + 20 \\implies 4(2x - 1) = 20 \\implies 2x - 1 = 5$$",
      ),
      (rng) => {
        const a = rng.int(2, 5);
        const b = rng.nonZero(-9, 9);
        const q = rng.int(2, 6);
        const p = q + rng.int(1, 5);
        const v = rng.nonZero(-8, 8);
        const d = (p - q) * v;
        const bin = linear(a, b);
        const prompt = `${p}(${bin}) = ${q}(${bin}) ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
        return numberProblem({
          prompt: t(`If $${prompt}$, what is the value of $${bin}$?`, `若 $${prompt}$，则 $${bin}$ 的值是多少？`),
          answer: v,
          wrong: [Q.of(v - b, a), Q.of(d, p + q), d, -v],
          solution: t(
            `Subtract $${q}(${bin})$ from both sides and keep $${bin}$ whole:${steps(`${p - q}(${bin}) = ${d}`, `${bin} = ${v}`)}`,
            `两边同时减去 $${q}(${bin})$，并把 $${bin}$ 看作整体：${steps(`${p - q}(${bin}) = ${d}`, `${bin} = ${v}`)}`,
          ),
        });
      },
    ),
  ],
);

/** manipulatingExpressionsAndEquations finds the value of an expression from an equation without solving it. */
export const manipulatingExpressionsAndEquations = topic(
  "manipulating-expressions-and-equations",
  t("Manipulating Expressions and Equations", "表达式与方程的变形"),
  t(
    "Find the value of an expression by multiplying or adding to a given equation, without solving for the variables.",
    "通过把已知方程乘以某数或加上某数来求表达式的值，而不必解出变量。",
  ),
  ["two-step-equations", "two-variable-linear-equations-and-their-solutions"],
  ["HSA.SSE.A.2"],
  [
    kp(
      "scaling-an-equation",
      t("Scaling an equation to reach an expression", "把方程乘以一个数得到所求表达式"),
      t(
        "If the expression you need is a multiple of one side of the equation, multiply both sides by that number instead of solving. Then add or subtract whatever constant the expression needs.\n\n$$3x + 5 = 11 \\implies 6x + 10 = 22 \\implies 6x + 7 = 19$$",
        "如果所求表达式是方程一边的倍数，就把方程两边同乘这个数，而不必解方程。然后再加上或减去表达式需要的常数。\n\n$$3x + 5 = 11 \\implies 6x + 10 = 22 \\implies 6x + 7 = 19$$",
      ),
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.nonZero(-9, 9);
        const c = rng.nonZero(-20, 20);
        const k = rng.pick([2, 3, 4, 5, -2, -3]);
        const d = rng.nonZero(-9, 9);
        const answer = k * c - k * b + d;
        const target = poly([k * a, "x"], [d, ""]);
        return numberProblem({
          prompt: t(
            `If $${linear(a, b)} = ${c}$, what is the value of $${target}$?`,
            `若 $${linear(a, b)} = ${c}$，则 $${target}$ 的值是多少？`,
          ),
          answer,
          wrong: [k * c + d, k * c, k * (c - b), c - b + d],
          solution: t(
            `Multiply both sides by $${k}$, then adjust the constant:${steps(`${poly([k * a, "x"], [k * b, ""])} = ${k * c}`, `${k * a}x = ${k * c - k * b}`, `${target} = ${k * c - k * b} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${answer}`)}`,
            `两边同乘 $${k}$，再调整常数：${steps(`${poly([k * a, "x"], [k * b, ""])} = ${k * c}`, `${k * a}x = ${k * c - k * b}`, `${target} = ${k * c - k * b} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "rearranging-a-two-variable-equation",
      t("Rearranging a two-variable equation", "变形二元方程"),
      t(
        "An equation in two variables does not fix $x$ and $y$, but it can fix a combination of them. If the expression asked for is the equation's left side times a number, possibly with its terms reversed, multiplying both sides by that number gives its value directly.\n\n$$2x - 3y = 7 \\implies 6y - 4x = -2(2x - 3y) = -14$$",
        "一个二元方程不能确定 $x$ 和 $y$，但能确定它们的某种组合。如果所求表达式是方程左边乘以某个数（项的顺序可能颠倒），两边同乘这个数就能直接得到它的值。\n\n$$2x - 3y = 7 \\implies 6y - 4x = -2(2x - 3y) = -14$$",
      ),
      (rng) => {
        const a = rng.int(1, 6);
        const b = rng.nonZero(-6, 6);
        const c = rng.nonZero(-15, 15);
        const k = rng.pick([2, 3, 4, -1, -2, -3]);
        // k(ax + by) written with y first
        const target = poly([k * b, "y"], [k * a, "x"]);
        const answer = k * c;
        return numberProblem({
          prompt: t(
            `If $${poly([a, "x"], [b, "y"])} = ${c}$, what is the value of $${target}$?`,
            `若 $${poly([a, "x"], [b, "y"])} = ${c}$，则 $${target}$ 的值是多少？`,
          ),
          answer,
          wrong: [-answer, c, k + c, Math.abs(k) * c === answer ? -c : Math.abs(k) * c],
          solution: t(
            `The expression is $${k}$ times the left side: $${target} = ${k}(${poly([a, "x"], [b, "y"])})$. So its value is $${k} \\cdot ${paren(c)} = ${answer}$.`,
            `该表达式是方程左边的 $${k}$ 倍：$${target} = ${k}(${poly([a, "x"], [b, "y"])})$。所以它的值是 $${k} \\cdot ${paren(c)} = ${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** interpretingCoefficientsOfTwoVariableEquations interprets the coefficients of linear models in context. */
export const interpretingCoefficientsOfTwoVariableEquations = topic(
  "interpreting-coefficients-of-two-variable-equations",
  t("Interpreting Coefficients of Two-Variable Equations", "解释二元方程中系数的含义"),
  t(
    "Interpret the coefficients and constant of an equation such as $ax + by = c$ that models a total, and find how one quantity changes when the other does.",
    "解释表示总量的方程 $ax + by = c$ 中系数与常数的含义，并求一个量变化时另一个量如何变化。",
  ),
  ["modeling-totals-with-two-variable-equations"],
  ["HSA.SSE.A.1"],
  [
    kp(
      "meaning-of-a-coefficient",
      t("The meaning of a coefficient", "系数的含义"),
      t(
        "In an equation like $ax + by = c$ that adds up a total, each coefficient is the amount that one unit of its variable contributes, and the constant on the other side is the total. Read the units: if $x$ counts items and the total is in dollars, $a$ is dollars per item.",
        "在 $ax + by = c$ 这样表示总量的方程中，每个系数是对应变量每增加一个单位所贡献的量，等号另一边的常数是总量。注意单位：如果 $x$ 是物品的件数、总量以美元计，那么 $a$ 就是每件物品的美元数。",
      ),
      (rng) => {
        const [item1, item2, z1, z2] = rng.pick([
          ["small boxes", "large boxes", "小箱子", "大箱子"],
          ["adult tickets", "child tickets", "成人票", "儿童票"],
          ["notebooks", "pens", "笔记本", "钢笔"],
          ["salads", "sandwiches", "沙拉", "三明治"],
        ] as const);
        const a = rng.int(2, 9);
        const b = rng.int(10, 25);
        const c = rng.int(10, 40) * 10;
        const ask = rng.pick(["a", "b", "c"] as const);
        const options = [
          t(`The price, in dollars, of one of the ${item1}`, `一件${z1}的价格（美元）`),
          t(`The price, in dollars, of one of the ${item2}`, `一件${z2}的价格（美元）`),
          t("The total amount spent, in dollars", "花费的总金额（美元）"),
          t(`The number of ${item1} bought`, `购买${z1}的数量`),
        ];
        const correct = { a: 0, b: 1, c: 2 }[ask];
        const value = { a, b, c }[ask];
        return pickChoice(
          rng,
          t(
            `A customer buys $x$ ${item1} and $y$ ${item2}. The equation $${a}x + ${b}y = ${c}$ describes the purchase. What does $${value}$ represent?`,
            `一位顾客购买了 $x$ 件${z1}和 $y$ 件${z2}。方程 $${a}x + ${b}y = ${c}$ 描述了这次购买。$${value}$ 表示什么？`,
          ),
          options[correct]!,
          options.filter((_, i) => i !== correct),
          t(
            `$${a}x$ is the cost of the ${item1}, so $${a}$ is the price of one; likewise $${b}$ is the price of one of the ${item2}, and $${c}$ is the total cost.`,
            `$${a}x$ 是${z1}的费用，所以 $${a}$ 是一件${z1}的价格；同样 $${b}$ 是一件${z2}的价格，$${c}$ 是总费用。`,
          ),
        );
      },
    ),
    kp(
      "trading-one-quantity-for-another",
      t("Trading one quantity for another", "两个量之间的替换"),
      t(
        "If the total in $ax + by = c$ stays fixed, raising $x$ by one adds $a$ to the total, so $by$ must drop by $a$, and $y$ changes by $-\\frac{a}{b}$. This rate is the slope of the line, solved for $y$, and it tells how many of one item trade for one of the other.",
        "若 $ax + by = c$ 中的总量保持不变，$x$ 增加 1 会让总量增加 $a$，所以 $by$ 必须减少 $a$，$y$ 的变化量是 $-\\frac{a}{b}$。这个变化率就是把方程解成 $y$ 后直线的斜率，它说明一种物品可以换多少另一种物品。",
      ),
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        if (a === b) return interpretingCoefficientsOfTwoVariableEquations.knowledgePoints[1]!.generate(rng);
        const k = rng.int(1, 4);
        const c = rng.int(20, 60) * a * b;
        const change = Q.of(-a * k, b);
        return numberProblem({
          prompt: t(
            `A team's points satisfy $${a}x + ${b}y = ${c}$, where $x$ and $y$ are the numbers of two kinds of goals. If the total stays the same and $x$ increases by $${k}$, by how much does $y$ change? (Give a negative number for a decrease.)`,
            `某队得分满足 $${a}x + ${b}y = ${c}$，其中 $x$、$y$ 是两类进球的个数。若总分不变而 $x$ 增加 $${k}$，$y$ 变化多少？（减少时填负数。）`,
          ),
          answer: change,
          wrong: [change.neg(), Q.of(-b * k, a), Q.of(-a, b), Q.of(-k * a)],
          solution: t(
            `Raising $x$ by $${k}$ adds $${a} \\cdot ${k} = ${a * k}$ to the total, so $${b}y$ must fall by $${a * k}$:${steps(`\\Delta y = -\\frac{${a * k}}{${b}} = ${change.toLatex()}`)}`,
            `$x$ 增加 $${k}$ 会让总分增加 $${a} \\cdot ${k} = ${a * k}$，所以 $${b}y$ 必须减少 $${a * k}$：${steps(`\\Delta y = -\\frac{${a * k}}{${b}} = ${change.toLatex()}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Systems of equations

/** parametrizingSystemsWithInfinitelyManySolutions writes the solutions of a dependent system with a parameter. */
export const parametrizingSystemsWithInfinitelyManySolutions = topic(
  "parametrizing-systems-with-infinitely-many-solutions",
  t("Parametrizing Systems With Infinitely Many Solutions", "用参数表示有无穷多解的方程组"),
  t(
    "Describe every solution of a system whose equations are multiples of each other by letting one variable be a parameter.",
    "当方程组的两个方程互为倍数时，令一个变量为参数，表示出全部解。",
  ),
  ["systems-with-no-solution-or-infinitely-many-solutions"],
  ["HSA.REI.C.6"],
  [
    kp(
      "solutions-in-terms-of-a-parameter",
      t("Solutions in terms of a parameter", "用参数表示解"),
      t(
        "When one equation of a system is a multiple of the other, both describe the same line and every point on it is a solution. To list them, let $x = t$ for any number $t$ and solve the equation for $y$ in terms of $t$. Each value of $t$ gives one solution $(t, y)$.\n\n$$2x + 3y = 6 \\implies y = 2 - \\frac{2}{3}t$$",
        "当方程组中一个方程是另一个的倍数时，两者表示同一条直线，直线上每个点都是解。要表示全部解，令 $x = t$（$t$ 为任意数），再把 $y$ 用 $t$ 表示出来。每个 $t$ 值对应一个解 $(t, y)$。\n\n$$2x + 3y = 6 \\implies y = 2 - \\frac{2}{3}t$$",
      ),
      (rng) => {
        const a = rng.nonZero(-5, 5);
        const b = rng.pick([1, 2, 3, 4, 5]);
        const c = b * rng.nonZero(-6, 6);
        const k = rng.int(2, 4);
        const intercept = Q.of(c, b);
        const slope = Q.of(-a, b);
        const answer = poly([intercept, ""], [slope, "t"]);
        return expressionProblem({
          prompt: t(
            `The system below has infinitely many solutions. If $x = t$, express $y$ in terms of $t$. $$\\begin{cases} ${poly([a, "x"], [b, "y"])} = ${c} \\\\ ${poly([k * a, "x"], [k * b, "y"])} = ${k * c} \\end{cases}$$`,
            `下面的方程组有无穷多解。若 $x = t$，用 $t$ 表示 $y$。$$\\begin{cases} ${poly([a, "x"], [b, "y"])} = ${c} \\\\ ${poly([k * a, "x"], [k * b, "y"])} = ${k * c} \\end{cases}$$`,
          ),
          answer,
          prefix: "y =",
          wrong: [poly([intercept, ""], [slope.neg(), "t"]), poly([c, ""], [-a, "t"]), poly([Q.of(c * k, b), ""], [slope, "t"])],
          solution: t(
            `The second equation is $${k}$ times the first, so use the first. Substitute $x = t$ and solve for $y$:${steps(`${poly([a, "t"], [b, "y"])} = ${c}`, `y = ${answer}`)}`,
            `第二个方程是第一个方程的 $${k}$ 倍，所以只用第一个方程。代入 $x = t$ 并解出 $y$：${steps(`${poly([a, "t"], [b, "y"])} = ${c}`, `y = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "checking-a-parametrized-solution",
      t("Finding a particular solution", "求一个具体的解"),
      t(
        "A parametrized solution such as $(t, 2 - \\frac{2}{3}t)$ gives one solution for each value of the parameter. To find the solution with a given $x$-value, substitute that value for $t$; the result is a point that satisfies both equations of the system.",
        "像 $(t, 2 - \\frac{2}{3}t)$ 这样的参数解，每个参数值对应一个解。要找出 $x$ 取某个值时的解，把这个值代入 $t$；得到的点同时满足方程组中的两个方程。",
      ),
      (rng) => {
        const a = rng.nonZero(-6, 6);
        const b = rng.pick([1, 2, 3, 4]);
        const c = rng.nonZero(-12, 12);
        const k = rng.int(2, 5);
        const x0 = b * rng.nonZero(-4, 4);
        const y0 = Q.of(c - a * x0, b);
        return numberProblem({
          prompt: t(
            `The system $$\\begin{cases} ${poly([a, "x"], [b, "y"])} = ${c} \\\\ ${poly([k * a, "x"], [k * b, "y"])} = ${k * c} \\end{cases}$$ has infinitely many solutions $(x, y)$. What is $y$ in the solution with $x = ${x0}$?`,
            `方程组 $$\\begin{cases} ${poly([a, "x"], [b, "y"])} = ${c} \\\\ ${poly([k * a, "x"], [k * b, "y"])} = ${k * c} \\end{cases}$$ 有无穷多组解 $(x, y)$。在 $x = ${x0}$ 的那组解中，$y$ 是多少？`,
          ),
          answer: y0,
          wrong: [Q.of(c + a * x0, b), Q.of(c - a * x0), Q.of(k * c - a * x0, b)],
          solution: t(
            `Both equations describe the same line. Substitute $x = ${x0}$ into the first:${steps(`${b === 1 ? "" : b}y = ${c} - ${paren(a * x0)} = ${c - a * x0}`, `y = ${y0.toLatex()}`)}`,
            `两个方程表示同一条直线。把 $x = ${x0}$ 代入第一个方程：${steps(`${b === 1 ? "" : b}y = ${c} - ${paren(a * x0)} = ${c - a * x0}`, `y = ${y0.toLatex()}`)}`,
          ),
        });
      },
    ),
  ],
);

/** solvingSystemsOfLinearEquationsByIdentifyingStructure finds sums and differences of the unknowns by adding equations. */
export const solvingSystemsOfLinearEquationsByIdentifyingStructure = topic(
  "solving-systems-of-linear-equations-by-identifying-structure",
  t("Solving Systems of Linear Equations by Identifying Structure", "利用结构解线性方程组"),
  t(
    "Find $x + y$ or $x - y$ directly by adding or subtracting the equations of a system with symmetric coefficients.",
    "对系数对称的方程组，直接把方程相加或相减，求出 $x + y$ 或 $x - y$。",
  ),
  ["introduction-to-elimination"],
  ["HSA.REI.C.5"],
  [
    kp(
      "sum-of-the-unknowns",
      t("Finding the sum of the unknowns", "求未知数之和"),
      t(
        "When the coefficients of the two equations are swapped, as in $ax + by$ and $bx + ay$, adding the equations gives $(a + b)x + (a + b)y$. Dividing by $a + b$ then gives $x + y$ without solving for either variable.\n\n$$3x + 2y = 11, \\ 2x + 3y = 9 \\implies 5x + 5y = 20 \\implies x + y = 4$$",
        "当两个方程的系数互换位置，如 $ax + by$ 与 $bx + ay$，把两个方程相加得到 $(a + b)x + (a + b)y$。再除以 $a + b$ 就得到 $x + y$，无需解出任何一个变量。\n\n$$3x + 2y = 11, \\ 2x + 3y = 9 \\implies 5x + 5y = 20 \\implies x + y = 4$$",
      ),
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, 9);
        if (a === b) return solvingSystemsOfLinearEquationsByIdentifyingStructure.knowledgePoints[0]!.generate(rng);
        const x = rng.int(-6, 9);
        const y = rng.int(-6, 9);
        const c1 = a * x + b * y;
        const c2 = b * x + a * y;
        return numberProblem({
          prompt: t(
            `If $${poly([a, "x"], [b, "y"])} = ${c1}$ and $${poly([b, "x"], [a, "y"])} = ${c2}$, what is the value of $x + y$?`,
            `若 $${poly([a, "x"], [b, "y"])} = ${c1}$ 且 $${poly([b, "x"], [a, "y"])} = ${c2}$，则 $x + y$ 的值是多少？`,
          ),
          answer: x + y,
          wrong: [c1 + c2, x - y, Q.of(c1 - c2, a - b), Q.of(c1 + c2, a)],
          solution: t(
            `Add the equations:${steps(`${a + b}x + ${a + b}y = ${c1 + c2}`, `x + y = \\frac{${c1 + c2}}{${a + b}} = ${x + y}`)}`,
            `把两个方程相加：${steps(`${a + b}x + ${a + b}y = ${c1 + c2}`, `x + y = \\frac{${c1 + c2}}{${a + b}} = ${x + y}`)}`,
          ),
        });
      },
    ),
    kp(
      "difference-of-the-unknowns",
      t("Finding the difference of the unknowns", "求未知数之差"),
      t(
        "Subtracting the equations $ax + by = c_1$ and $bx + ay = c_2$ gives $(a - b)x - (a - b)y = c_1 - c_2$, so dividing by $a - b$ gives $x - y$. Look at what the question asks before solving: often adding or subtracting the equations gets there in one step.",
        "把 $ax + by = c_1$ 与 $bx + ay = c_2$ 相减，得到 $(a - b)x - (a - b)y = c_1 - c_2$，再除以 $a - b$ 就得到 $x - y$。解题前先看清问的是什么：往往把方程相加或相减一步就能得到答案。",
      ),
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, 9);
        if (a === b) return solvingSystemsOfLinearEquationsByIdentifyingStructure.knowledgePoints[1]!.generate(rng);
        const x = rng.int(-6, 9);
        const y = rng.int(-6, 9);
        const c1 = a * x + b * y;
        const c2 = b * x + a * y;
        return numberProblem({
          prompt: t(
            `If $${poly([a, "x"], [b, "y"])} = ${c1}$ and $${poly([b, "x"], [a, "y"])} = ${c2}$, what is the value of $x - y$?`,
            `若 $${poly([a, "x"], [b, "y"])} = ${c1}$ 且 $${poly([b, "x"], [a, "y"])} = ${c2}$，则 $x - y$ 的值是多少？`,
          ),
          answer: x - y,
          wrong: [c1 - c2, x + y, y - x, Q.of(c1 - c2, a + b)],
          solution: t(
            `Subtract the second equation from the first:${steps(`${poly([a - b, "x"], [b - a, "y"])} = ${c1 - c2}`, `x - y = \\frac{${c1 - c2}}{${a - b}} = ${x - y}`)}`,
            `用第一个方程减去第二个方程：${steps(`${poly([a - b, "x"], [b - a, "y"])} = ${c1 - c2}`, `x - y = \\frac{${c1 - c2}}{${a - b}} = ${x - y}`)}`,
          ),
        });
      },
    ),
  ],
);

/** largerSystemsOfEquations solves systems of three linear equations in three unknowns. */
export const largerSystemsOfEquations = topic(
  "larger-systems-of-equations",
  t("Larger Systems of Equations", "更大的方程组"),
  t(
    "Solve systems of three linear equations in three unknowns by adding equations and by elimination.",
    "通过方程相加与消元，解三元一次方程组。",
  ),
  ["elimination-with-two-transformations"],
  ["HSA.REI.C.6"],
  [
    kp(
      "adding-all-three-equations",
      t("Adding all three equations", "把三个方程相加"),
      t(
        "If each equation gives the sum of two of the three unknowns, adding all three equations counts every unknown twice. Halving gives $x + y + z$, and subtracting any one equation from that total gives the missing unknown.\n\n$$x + y = 7, \\ y + z = 9, \\ x + z = 8 \\implies x + y + z = 12 \\implies z = 5$$",
        "如果每个方程都给出三个未知数中两个的和，把三个方程相加时每个未知数都被算了两次。除以 2 得到 $x + y + z$，再减去其中一个方程，就得到剩下的那个未知数。\n\n$$x + y = 7, \\ y + z = 9, \\ x + z = 8 \\implies x + y + z = 12 \\implies z = 5$$",
      ),
      (rng) => {
        const x = rng.int(-5, 12);
        const y = rng.int(-5, 12);
        const z = rng.int(-5, 12);
        const ask = rng.pick(["x", "y", "z", "s"] as const);
        const value = { x, y, z, s: x + y + z }[ask];
        const name = ask === "s" ? "x + y + z" : ask;
        return numberProblem({
          prompt: t(
            `If $x + y = ${x + y}$, $y + z = ${y + z}$ and $x + z = ${x + z}$, what is the value of $${name}$?`,
            `若 $x + y = ${x + y}$，$y + z = ${y + z}$，$x + z = ${x + z}$，则 $${name}$ 的值是多少？`,
          ),
          answer: value,
          wrong: [2 * (x + y + z), x + y + z === value ? 2 * value : x + y + z, value + 1],
          solution: t(
            `Add all three equations: $2x + 2y + 2z = ${2 * (x + y + z)}$, so $x + y + z = ${x + y + z}$.${ask === "s" ? "" : ` Subtract the equation without $${ask}$: $${ask} = ${x + y + z} - ${paren({ x: y + z, y: x + z, z: x + y }[ask])} = ${value}$.`}`,
            `把三个方程相加：$2x + 2y + 2z = ${2 * (x + y + z)}$，所以 $x + y + z = ${x + y + z}$。${ask === "s" ? "" : `再减去不含 $${ask}$ 的那个方程：$${ask} = ${x + y + z} - ${paren({ x: y + z, y: x + z, z: x + y }[ask])} = ${value}$。`}`,
          ),
        });
      },
    ),
    kp(
      "eliminating-down-to-one-unknown",
      t("Eliminating down to one unknown", "逐步消元到一个未知数"),
      t(
        "A system of three equations in three unknowns is solved by elimination in stages. Use one equation to remove a variable from the other two, which leaves two equations in two unknowns; solve that smaller system, then substitute back to find the third variable.",
        "三元一次方程组用分步消元来解。先用一个方程从另外两个方程中消去一个变量，得到二元一次方程组；解出这个较小的方程组，再回代求出第三个变量。",
      ),
      (rng) => {
        const x = rng.int(-4, 6);
        const y = rng.int(-4, 6);
        const z = rng.int(-4, 6);
        const a = rng.int(1, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.int(1, 3);
        const d = rng.nonZero(-2, 2);
        // x + y + z = s; a x + b y - z = e1; x - y + c z ... ensure solvable by construction
        const e1 = a * x + b * y - z;
        const e2 = x + d * y + c * z;
        const s = x + y + z;
        const det = 1 * (b * c - -1 * d) - 1 * (a * c - -1 * 1) + 1 * (a * d - b * 1);
        if (det === 0) return largerSystemsOfEquations.knowledgePoints[1]!.generate(rng);
        const ask = rng.pick(["x", "y", "z"] as const);
        const value = { x, y, z }[ask];
        return numberProblem({
          prompt: t(
            `Solve the system and give the value of $${ask}$: $$\\begin{cases} x + y + z = ${s} \\\\ ${poly([a, "x"], [b, "y"], [-1, "z"])} = ${e1} \\\\ ${poly([1, "x"], [d, "y"], [c, "z"])} = ${e2} \\end{cases}$$`,
            `解方程组，求 $${ask}$ 的值：$$\\begin{cases} x + y + z = ${s} \\\\ ${poly([a, "x"], [b, "y"], [-1, "z"])} = ${e1} \\\\ ${poly([1, "x"], [d, "y"], [c, "z"])} = ${e2} \\end{cases}$$`,
          ),
          answer: value,
          solveFor: ask,
          wrong: [-value, value + 1, s - value],
          solution: t(
            `Add the first two equations to remove $z$: $${poly([a + 1, "x"], [b + 1, "y"])} = ${s + e1}$. Subtract $${c}$ times the first equation from the third to remove $z$ again: $${poly([1 - c, "x"], [d - c, "y"])} = ${e2 - c * s}$. Solving these two gives $x = ${x}$ and $y = ${y}$, and then $z = ${s} - ${paren(x)} - ${paren(y)} = ${z}$.`,
            `前两个方程相加消去 $z$：$${poly([a + 1, "x"], [b + 1, "y"])} = ${s + e1}$。第三个方程减去第一个方程的 $${c}$ 倍，再次消去 $z$：$${poly([1 - c, "x"], [d - c, "y"])} = ${e2 - c * s}$。解这两个方程得 $x = ${x}$，$y = ${y}$，于是 $z = ${s} - ${paren(x)} - ${paren(y)} = ${z}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Optimizing over ranges

/** optimizingSumsDifferencesProductsAndQuotients finds extreme values of combinations of two bounded quantities. */
export const optimizingSumsDifferencesProductsAndQuotients = topic(
  "optimizing-sums-differences-products-and-quotients",
  t("Optimizing Sums, Differences, Products, and Quotients", "和、差、积、商的最值"),
  t(
    "Find the greatest or least possible value of $x + y$, $x - y$, $xy$ or $\\frac{x}{y}$ when $x$ and $y$ lie in given ranges.",
    "当 $x$、$y$ 在给定范围内时，求 $x + y$、$x - y$、$xy$ 或 $\\frac{x}{y}$ 的最大值或最小值。",
  ),
  ["compound-inequalities"],
  ["HSA.CED.A.3"],
  [
    kp(
      "extremes-of-sums-and-differences",
      t("Extremes of sums and differences", "和与差的最值"),
      t(
        "A sum $x + y$ is greatest when both parts are greatest. A difference $x - y$ is greatest when $x$ is as large as possible and $y$ as small as possible, because subtracting less leaves more. Reverse each choice for the least value.\n\n$$2 \\le x \\le 5, \\ 1 \\le y \\le 3 \\implies \\max(x - y) = 5 - 1 = 4$$",
        "和 $x + y$ 在两部分都最大时最大。差 $x - y$ 在 $x$ 尽量大、$y$ 尽量小时最大，因为减去的越少剩下的越多。求最小值时把每个选择反过来。\n\n$$2 \\le x \\le 5, \\ 1 \\le y \\le 3 \\implies \\max(x - y) = 5 - 1 = 4$$",
      ),
      (rng) => {
        const a = rng.int(-8, 4);
        const b = a + rng.int(2, 8);
        const c = rng.int(-8, 4);
        const d = c + rng.int(2, 8);
        const op = rng.pick(["+", "-"] as const);
        const big = rng.bool();
        const value = op === "+" ? (big ? b + d : a + c) : big ? b - c : a - d;
        const wrongs = op === "+" ? [b + c, a + d, big ? a + c : b + d] : [b - d, a - c, big ? a - d : b - c];
        return numberProblem({
          prompt: t(
            `If $${a} \\le x \\le ${b}$ and $${c} \\le y \\le ${d}$, what is the ${big ? "greatest" : "least"} possible value of $x ${op} y$?`,
            `若 $${a} \\le x \\le ${b}$，$${c} \\le y \\le ${d}$，则 $x ${op} y$ 的${big ? "最大" : "最小"}可能值是多少？`,
          ),
          answer: value,
          wrong: wrongs,
          solution: t(
            op === "+"
              ? `A sum is ${big ? "greatest" : "least"} when both parts are ${big ? "greatest" : "least"}: $${big ? b : a} + ${paren(big ? d : c)} = ${value}$.`
              : `A difference is ${big ? "greatest" : "least"} when $x$ is ${big ? "greatest" : "least"} and $y$ is ${big ? "least" : "greatest"}: $${big ? b : a} - ${paren(big ? c : d)} = ${value}$.`,
            op === "+"
              ? `两部分都取${big ? "最大" : "最小"}值时和${big ? "最大" : "最小"}：$${big ? b : a} + ${paren(big ? d : c)} = ${value}$。`
              : `$x$ 取${big ? "最大" : "最小"}值、$y$ 取${big ? "最小" : "最大"}值时差${big ? "最大" : "最小"}：$${big ? b : a} - ${paren(big ? c : d)} = ${value}$。`,
          ),
        });
      },
    ),
    kp(
      "extremes-of-products-and-quotients",
      t("Extremes of products and quotients", "积与商的最值"),
      t(
        "For a product $xy$ the signs matter: when a range includes negative numbers, two large negatives can give a large positive product. The extreme value always occurs at endpoints of the ranges, so compute the product at all four pairs of endpoints and pick the greatest or least. For a positive quotient $\\frac{x}{y}$, make $x$ large and $y$ small to make it large.",
        "求积 $xy$ 时要注意符号：如果范围中有负数，两个绝对值大的负数相乘可能得到很大的正数。最值总在范围的端点处取得，所以计算四组端点的积，再从中选最大或最小的。对于正的商 $\\frac{x}{y}$，要使它最大，就让 $x$ 尽量大、$y$ 尽量小。",
      ),
      (rng) => {
        const a = rng.int(-6, 2);
        const b = a + rng.int(2, 7);
        const c = rng.int(-6, 2);
        const d = c + rng.int(2, 7);
        const big = rng.bool();
        const corners = [a * c, a * d, b * c, b * d];
        const value = big ? Math.max(...corners) : Math.min(...corners);
        return numberProblem({
          prompt: t(
            `If $${a} \\le x \\le ${b}$ and $${c} \\le y \\le ${d}$, what is the ${big ? "greatest" : "least"} possible value of $xy$?`,
            `若 $${a} \\le x \\le ${b}$，$${c} \\le y \\le ${d}$，则 $xy$ 的${big ? "最大" : "最小"}可能值是多少？`,
          ),
          answer: value,
          wrong: [b * d, a * c, big ? Math.min(...corners) : Math.max(...corners), a * d],
          solution: t(
            `The extreme value occurs at a pair of endpoints. The four products are $${paren(a)} \\cdot ${paren(c)} = ${a * c}$, $${paren(a)} \\cdot ${paren(d)} = ${a * d}$, $${paren(b)} \\cdot ${paren(c)} = ${b * c}$ and $${paren(b)} \\cdot ${paren(d)} = ${b * d}$, so the ${big ? "greatest" : "least"} is $${value}$.`,
            `最值在端点处取得。四个积是 $${paren(a)} \\cdot ${paren(c)} = ${a * c}$，$${paren(a)} \\cdot ${paren(d)} = ${a * d}$，$${paren(b)} \\cdot ${paren(c)} = ${b * c}$，$${paren(b)} \\cdot ${paren(d)} = ${b * d}$，所以${big ? "最大" : "最小"}值是 $${value}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Linear functions in tables

/** Table is a table of values of a linear function f(x) = mx + c. */
interface Table {
  readonly xs: number[];
  readonly m: Q;
  readonly c: Q;
}

/** linearTable draws a linear function with integer values at evenly spaced x-values. */
function linearTable(rng: Rng, rows = 4): Table {
  const step = rng.pick([1, 1, 2, 3, 5]);
  const x0 = rng.int(-3, 4);
  const xs = Array.from({ length: rows }, (_, i) => x0 + i * step);
  const m = Q.of(rng.nonZero(-6, 6) * rng.pick([1, 1, step]), step);
  const fx0 = rng.int(-12, 15);
  const c = Q.of(fx0).sub(m.mul(Q.of(x0)));
  return { xs, m, c };
}

const at = (tb: Table, x: number) => tb.m.mul(Q.of(x)).add(tb.c);

/** tableLatex writes a two-row table of x and f(x); cells may be replaced. */
function tableLatex(tb: Table, name = "f", cells?: (string | undefined)[]): string {
  const ys = tb.xs.map((x, i) => cells?.[i] ?? at(tb, x).toLatex());
  return `\\begin{array}{c|${"c".repeat(tb.xs.length)}} x & ${tb.xs.join(" & ")} \\\\ \\hline ${name}(x) & ${ys.join(" & ")} \\end{array}`;
}

/** linearFunctionsInTabularForm reads values and rates of change of a linear function from a table. */
export const linearFunctionsInTabularForm = topic(
  "linear-functions-in-tabular-form",
  t("Linear Functions in Tabular Form", "表格形式的一次函数"),
  t(
    "Find the rate of change of a linear function given by a table, and use it to find values outside the table.",
    "由表格给出的一次函数，求它的变化率，并用它求表格之外的函数值。",
  ),
  ["constructing-linear-functions"],
  ["8.F.B.4", "HSF.LE.A.2"],
  [
    kp(
      "rate-of-change-from-a-table",
      t("The rate of change from a table", "由表格求变化率"),
      t(
        "In a table of a linear function, equal steps in $x$ always give equal steps in $f(x)$. The rate of change, or slope, is the change in $f(x)$ divided by the change in $x$ between any two columns; be careful to divide by the step in $x$ when it is not $1$.",
        "在一次函数的表格中，$x$ 每变化相同的量，$f(x)$ 也变化相同的量。变化率（斜率）就是任意两列之间 $f(x)$ 的变化量除以 $x$ 的变化量；当 $x$ 的步长不是 $1$ 时，一定要除以这个步长。",
      ),
      (rng) => {
        const tb = linearTable(rng);
        const step = tb.xs[1]! - tb.xs[0]!;
        const dy = tb.m.mul(Q.of(step));
        return numberProblem({
          prompt: t(
            `The table shows some values of the linear function $f$. What is the slope of the graph of $f$? $$${tableLatex(tb)}$$`,
            `下表给出一次函数 $f$ 的一些值。$f$ 的图像的斜率是多少？$$${tableLatex(tb)}$$`,
          ),
          answer: tb.m,
          wrong: [dy, tb.m.neg(), Q.of(step).div(dy.isZero() ? Q.one : dy), at(tb, tb.xs[0]!)],
          solution: t(
            `From $x = ${tb.xs[0]}$ to $x = ${tb.xs[1]}$, $x$ increases by $${step}$ and $f(x)$ changes by $${dy.toLatex()}$, so the slope is $\\frac{${dy.toLatex()}}{${step}} = ${tb.m.toLatex()}$.`,
            `从 $x = ${tb.xs[0]}$ 到 $x = ${tb.xs[1]}$，$x$ 增加 $${step}$，$f(x)$ 变化 $${dy.toLatex()}$，所以斜率是 $\\frac{${dy.toLatex()}}{${step}} = ${tb.m.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "values-beyond-the-table",
      t("Values beyond the table", "求表格之外的值"),
      t(
        "To find $f$ at an $x$-value that is not in the table, start from a known column and move along at the constant rate: $f(x_1) = f(x_0) + m(x_1 - x_0)$, where $m$ is the slope found from the table.",
        "要求表格中没有的 $x$ 值处的函数值，从已知的一列出发，按不变的变化率移动：$f(x_1) = f(x_0) + m(x_1 - x_0)$，其中 $m$ 是由表格求出的斜率。",
      ),
      (rng) => {
        const tb = linearTable(rng, 3);
        const last = tb.xs.at(-1)!;
        const target = last + rng.int(2, 9);
        const value = at(tb, target);
        return numberProblem({
          prompt: t(
            `The table shows some values of the linear function $f$. What is $f(${target})$? $$${tableLatex(tb)}$$`,
            `下表给出一次函数 $f$ 的一些值。$f(${target})$ 是多少？$$${tableLatex(tb)}$$`,
          ),
          answer: value,
          wrong: [at(tb, last).add(Q.of(target - last)), at(tb, last).add(tb.m), value.add(tb.m), tb.m.mul(Q.of(target))],
          solution: t(
            `The slope is $${tb.m.toLatex()}$. From $x = ${last}$, move $${target - last}$ units:${steps(`f(${target}) = ${at(tb, last).toLatex()} + ${paren(tb.m)} \\cdot ${target - last} = ${value.toLatex()}`)}`,
            `斜率是 $${tb.m.toLatex()}$。从 $x = ${last}$ 出发，移动 $${target - last}$ 个单位：${steps(`f(${target}) = ${at(tb, last).toLatex()} + ${paren(tb.m)} \\cdot ${target - last} = ${value.toLatex()}`)}`,
          ),
        });
      },
    ),
  ],
);

/** analyzingLinearFunctionsInTabularForm finds the intercept, missing entries and equation of a linear function from a table. */
export const analyzingLinearFunctionsInTabularForm = topic(
  "analyzing-linear-functions-in-tabular-form",
  t("Analyzing Linear Functions in Tabular Form", "分析表格形式的一次函数"),
  t(
    "Find the equation, the $y$-intercept and missing entries of a linear function given by a table.",
    "由表格给出的一次函数，求它的解析式、$y$ 轴截距以及表中缺失的值。",
  ),
  ["linear-functions-in-tabular-form"],
  ["8.F.B.4"],
  [
    kp(
      "equation-from-a-table",
      t("The equation from a table", "由表格求解析式"),
      t(
        "To write $f(x) = mx + b$ from a table, find the slope $m$ from two columns, then find $b$ by substituting one column: $b = f(x_0) - m x_0$. The value $b$ is $f(0)$, the $y$-intercept, even when $x = 0$ is not in the table.",
        "要由表格写出 $f(x) = mx + b$，先由两列求斜率 $m$，再代入一列求 $b$：$b = f(x_0) - m x_0$。即使表中没有 $x = 0$，$b$ 也是 $f(0)$，即 $y$ 轴截距。",
      ),
      (rng) => {
        const tb = linearTable(rng);
        if (tb.xs.includes(0)) return analyzingLinearFunctionsInTabularForm.knowledgePoints[0]!.generate(rng);
        const answer = poly([tb.m, "x"], [tb.c, ""]);
        const y0 = at(tb, tb.xs[0]!);
        return expressionProblem({
          prompt: t(
            `The table shows some values of the linear function $f$. Write $f(x)$. $$${tableLatex(tb)}$$`,
            `下表给出一次函数 $f$ 的一些值。写出 $f(x)$。$$${tableLatex(tb)}$$`,
          ),
          answer,
          prefix: "f(x) =",
          wrong: [poly([tb.m, "x"], [y0, ""]), poly([tb.m.neg(), "x"], [tb.c, ""]), poly([tb.m, "x"], [tb.c.neg(), ""])],
          solution: t(
            `The slope is $${tb.m.toLatex()}$. Substitute the column $x = ${tb.xs[0]}$: $b = ${y0.toLatex()} - ${paren(tb.m)} \\cdot ${paren(tb.xs[0]!)} = ${tb.c.toLatex()}$. So $f(x) = ${answer}$.`,
            `斜率是 $${tb.m.toLatex()}$。代入 $x = ${tb.xs[0]}$ 这一列：$b = ${y0.toLatex()} - ${paren(tb.m)} \\cdot ${paren(tb.xs[0]!)} = ${tb.c.toLatex()}$。所以 $f(x) = ${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "missing-entries",
      t("Missing entries", "表中缺失的值"),
      t(
        "A gap in a table of a linear function can be filled from the constant rate of change. Find the slope from two complete columns, then step from a known column to the missing one: the change in $f(x)$ is the slope times the change in $x$.",
        "一次函数表格中的空缺可以由不变的变化率补上。先用两列完整的数据求斜率，再从已知的一列走到缺失的一列：$f(x)$ 的变化量等于斜率乘以 $x$ 的变化量。",
      ),
      (rng) => {
        const tb = linearTable(rng, 4);
        const hole = rng.int(1, 3);
        const cells: (string | undefined)[] = tb.xs.map(() => undefined);
        cells[hole] = "k";
        const value = at(tb, tb.xs[hole]!);
        const step = tb.xs[1]! - tb.xs[0]!;
        return numberProblem({
          prompt: t(
            `The table shows some values of the linear function $f$. What is the value of $k$? $$${tableLatex(tb, "f", cells)}$$`,
            `下表给出一次函数 $f$ 的一些值。$k$ 的值是多少？$$${tableLatex(tb, "f", cells)}$$`,
          ),
          answer: value,
          wrong: [value.add(tb.m), value.sub(tb.m.mul(Q.of(step))).add(tb.m), at(tb, tb.xs[0]!).add(tb.m.mul(Q.of(hole)))],
          solution: t(
            `Between neighbouring columns $f(x)$ changes by $${tb.m.mul(Q.of(step)).toLatex()}$. Stepping from $x = ${tb.xs[0]}$ gives $k = f(${tb.xs[hole]}) = ${value.toLatex()}$.`,
            `相邻两列之间 $f(x)$ 变化 $${tb.m.mul(Q.of(step)).toLatex()}$。从 $x = ${tb.xs[0]}$ 开始逐列推算，得 $k = f(${tb.xs[hole]}) = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** transformationsOfLinearFunctionsInTabularForm evaluates transformations of a function given by a table. */
export const transformationsOfLinearFunctionsInTabularForm = topic(
  "transformations-of-linear-functions-in-tabular-form",
  t("Transformations of Linear Functions in Tabular Form", "表格形式一次函数的变换"),
  t(
    "Evaluate functions such as $f(x) + k$, $kf(x)$ and $f(x - h)$ when $f$ is given by a table.",
    "当 $f$ 由表格给出时，求 $f(x) + k$、$kf(x)$、$f(x - h)$ 等函数的值。",
  ),
  ["linear-functions-in-tabular-form", "horizontal-translations-of-functions"],
  ["HSF.BF.B.3"],
  [
    kp(
      "vertical-changes-from-a-table",
      t("Vertical shifts and stretches from a table", "由表格求竖直平移与伸缩"),
      t(
        "For $g(x) = f(x) + k$ or $g(x) = a f(x)$, look up $f$ at the same $x$ first, then add $k$ or multiply by $a$. These change the outputs only, so the $x$-row of the table stays the same.",
        "对于 $g(x) = f(x) + k$ 或 $g(x) = a f(x)$，先在表中查出同一个 $x$ 处的 $f$ 值，再加上 $k$ 或乘以 $a$。这些变换只改变输出，表中 $x$ 那一行不变。",
      ),
      (rng) => {
        const tb = linearTable(rng);
        const i = rng.int(0, 3);
        const x = tb.xs[i]!;
        const fx = at(tb, x);
        const kind = rng.pick(["shift", "stretch"] as const);
        const k = rng.nonZero(-8, 8);
        const g = kind === "shift" ? `${poly([1, "f(x)"], [k, ""])}` : `${k}f(x)`;
        const value = kind === "shift" ? fx.add(Q.of(k)) : fx.mul(Q.of(k));
        return numberProblem({
          prompt: t(
            `The table shows some values of the linear function $f$, and $g(x) = ${g}$. What is $g(${x})$? $$${tableLatex(tb)}$$`,
            `下表给出一次函数 $f$ 的一些值，且 $g(x) = ${g}$。$g(${x})$ 是多少？$$${tableLatex(tb)}$$`,
          ),
          answer: value,
          wrong: kind === "shift" ? [at(tb, x + k), fx, fx.sub(Q.of(k))] : [at(tb, k * x), fx, fx.add(Q.of(k))],
          solution: t(
            `From the table, $f(${x}) = ${fx.toLatex()}$, so $g(${x}) = ${kind === "shift" ? `${fx.toLatex()} + ${paren(k)}` : `${k} \\cdot ${paren(fx)}`} = ${value.toLatex()}$.`,
            `由表格，$f(${x}) = ${fx.toLatex()}$，所以 $g(${x}) = ${kind === "shift" ? `${fx.toLatex()} + ${paren(k)}` : `${k} \\cdot ${paren(fx)}`} = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "horizontal-shifts-from-a-table",
      t("Horizontal shifts from a table", "由表格求水平平移"),
      t(
        "For $g(x) = f(x - h)$, the input is changed before $f$ is applied. To find $g(a)$, compute $a - h$ first and look up $f$ there. The graph of $g$ is the graph of $f$ moved $h$ units to the right, so the table of $g$ is the table of $f$ with every $x$ increased by $h$.",
        "对于 $g(x) = f(x - h)$，先改变输入，再代入 $f$。要求 $g(a)$，先算出 $a - h$，再在表中查 $f$ 在那里的值。$g$ 的图像是 $f$ 的图像向右平移 $h$ 个单位，所以 $g$ 的表格就是把 $f$ 的表格中每个 $x$ 都加上 $h$。",
      ),
      (rng) => {
        const tb = linearTable(rng);
        const i = rng.int(0, 3);
        const h = rng.nonZero(-6, 6);
        const x = tb.xs[i]! + h;
        const value = at(tb, tb.xs[i]!);
        return numberProblem({
          prompt: t(
            `The table shows some values of the linear function $f$, and $g(x) = f(${linear(1, -h)})$. What is $g(${x})$? $$${tableLatex(tb)}$$`,
            `下表给出一次函数 $f$ 的一些值，且 $g(x) = f(${linear(1, -h)})$。$g(${x})$ 是多少？$$${tableLatex(tb)}$$`,
          ),
          answer: value,
          wrong: [at(tb, x + h), at(tb, x), value.sub(Q.of(h))],
          solution: t(
            `$g(${x}) = f(${x} - ${paren(h)}) = f(${tb.xs[i]})$, and the table gives $f(${tb.xs[i]}) = ${value.toLatex()}$.`,
            `$g(${x}) = f(${x} - ${paren(h)}) = f(${tb.xs[i]})$，由表格得 $f(${tb.xs[i]}) = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** linearFunctionsInTabularFormContainingUnknownParameters finds unknown entries and coefficients of linear functions from tables. */
export const linearFunctionsInTabularFormContainingUnknownParameters = topic(
  "linear-functions-in-tabular-form-containing-unknown-parameters",
  t("Linear Functions in Tabular Form Containing Unknown Parameters", "含未知参数的表格形式一次函数"),
  t(
    "Use the constant rate of change of a linear function to find unknown parameters in its table or its equation.",
    "利用一次函数变化率不变的性质，求表格或解析式中的未知参数。",
  ),
  ["analyzing-linear-functions-in-tabular-form"],
  ["8.F.B.4"],
  [
    kp(
      "unknown-x-value",
      t("An unknown input in a table", "表中未知的自变量"),
      t(
        "If a table of a linear function has an unknown $x$-value, find the equation from the complete columns, then set it equal to the given output and solve. Equivalently, the change in output divided by the slope tells how far $x$ must move.",
        "如果一次函数表格中某个 $x$ 值未知，先由完整的列求出解析式，再令它等于给定的输出并解方程。也可以用输出的变化量除以斜率，得到 $x$ 需要移动多远。",
      ),
      (rng) => {
        const tb = linearTable(rng, 3);
        if (tb.m.isZero()) return linearFunctionsInTabularFormContainingUnknownParameters.knowledgePoints[0]!.generate(rng);
        const xk = tb.xs.at(-1)! + rng.int(1, 6);
        const yk = at(tb, xk);
        const latex = `\\begin{array}{c|cccc} x & ${tb.xs.join(" & ")} & k \\\\ \\hline f(x) & ${tb.xs.map((x) => at(tb, x).toLatex()).join(" & ")} & ${yk.toLatex()} \\end{array}`;
        return numberProblem({
          prompt: t(
            `The table shows some values of the linear function $f$. What is the value of $k$? $$${latex}$$`,
            `下表给出一次函数 $f$ 的一些值。$k$ 的值是多少？$$${latex}$$`,
          ),
          answer: xk,
          wrong: [yk, tb.xs.at(-1)! + 1, Q.of(xk).add(tb.m)],
          solution: t(
            `The function is $f(x) = ${poly([tb.m, "x"], [tb.c, ""])}$. Solve $${poly([tb.m, "k"], [tb.c, ""])} = ${yk.toLatex()}$ to get $k = ${xk}$.`,
            `该函数是 $f(x) = ${poly([tb.m, "x"], [tb.c, ""])}$。解 $${poly([tb.m, "k"], [tb.c, ""])} = ${yk.toLatex()}$，得 $k = ${xk}$。`,
          ),
        });
      },
    ),
    kp(
      "unknown-coefficient",
      t("An unknown coefficient", "未知的系数"),
      t(
        "If $f(x) = ax + b$ has an unknown coefficient and the table gives two of its values, the difference of the outputs divided by the difference of the inputs is the slope $a$. Substituting one point then gives $b$.",
        "如果 $f(x) = ax + b$ 含未知系数，而表格给出了它的两个函数值，那么输出之差除以输入之差就是斜率 $a$。再代入一个点就可以求出 $b$。",
      ),
      (rng) => {
        const a = rng.nonZero(-7, 7);
        const b = rng.nonZero(-10, 10);
        const x1 = rng.int(-4, 3);
        const x2 = x1 + rng.int(2, 6);
        const ask = rng.pick(["a", "b"] as const);
        const latex = `\\begin{array}{c|cc} x & ${x1} & ${x2} \\\\ \\hline f(x) & ${a * x1 + b} & ${a * x2 + b} \\end{array}`;
        const value = ask === "a" ? a : b;
        return numberProblem({
          prompt: t(
            `The function $f(x) = ax + b$ takes the values in the table, where $a$ and $b$ are constants. What is the value of $${ask}$? $$${latex}$$`,
            `函数 $f(x) = ax + b$（$a$、$b$ 为常数）取表中的值。$${ask}$ 的值是多少？$$${latex}$$`,
          ),
          answer: value,
          wrong: ask === "a" ? [a * (x2 - x1), -a, Q.of(x2 - x1, a)] : [a * x1 + b, -b, b + a],
          solution: t(
            `The slope is $a = \\frac{${a * x2 + b} - ${paren(a * x1 + b)}}{${x2} - ${paren(x1)}} = ${a}$. Then $b = ${a * x1 + b} - ${paren(a)} \\cdot ${paren(x1)} = ${b}$.`,
            `斜率 $a = \\frac{${a * x2 + b} - ${paren(a * x1 + b)}}{${x2} - ${paren(x1)}} = ${a}$。于是 $b = ${a * x1 + b} - ${paren(a)} \\cdot ${paren(x1)} = ${b}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Translations of functions

/** findingEquationsOfTranslatedFunctions writes the equation of a function after a translation. */
export const findingEquationsOfTranslatedFunctions = topic(
  "finding-equations-of-translated-functions",
  t("Finding Equations of Translated Functions", "求平移后函数的解析式"),
  t(
    "Write the equation of the graph of $y = f(x)$ after it is moved horizontally and vertically.",
    "写出 $y = f(x)$ 的图像经水平和竖直平移后的解析式。",
  ),
  ["horizontal-translations-of-functions"],
  ["HSF.BF.B.3"],
  [
    kp(
      "translating-a-quadratic",
      t("Translating a quadratic", "平移二次函数"),
      t(
        "Moving a graph $h$ units right and $k$ units up turns $y = f(x)$ into $y = f(x - h) + k$: replace every $x$ by $x - h$ and add $k$ to the result. Moving left or down uses negative $h$ or $k$, so a shift left by $3$ gives $f(x + 3)$.",
        "把图像向右平移 $h$ 个单位、向上平移 $k$ 个单位，$y = f(x)$ 就变成 $y = f(x - h) + k$：把每个 $x$ 换成 $x - h$，再在结果上加 $k$。向左或向下平移时 $h$ 或 $k$ 取负数，所以向左平移 $3$ 个单位得到 $f(x + 3)$。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const c = rng.nonZero(-6, 6);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-6, 6);
        const f = poly([a, "x^2"], [c, ""]);
        const vx = (shift: number, constant: number) => poly([a, `(${linear(1, -shift)})^2`], [constant, ""]);
        const answer = vx(h, c + k);
        const dir = (n: number, en: [string, string], zh: [string, string]) => [n > 0 ? en[0] : en[1], n > 0 ? zh[0] : zh[1]] as const;
        const [hx, hz] = dir(h, ["right", "left"], ["右", "左"]);
        const [kx, kz] = dir(k, ["up", "down"], ["上", "下"]);
        return expressionProblem({
          prompt: t(
            `The graph of $f(x) = ${f}$ is moved $${Math.abs(h)}$ ${units(h)} ${hx} and $${Math.abs(k)}$ ${units(k)} ${kx} to give the graph of $g$. Write $g(x)$.`,
            `把 $f(x) = ${f}$ 的图像向${hz}平移 $${Math.abs(h)}$ 个单位、向${kz}平移 $${Math.abs(k)}$ 个单位，得到 $g$ 的图像。写出 $g(x)$。`,
          ),
          answer,
          prefix: "g(x) =",
          wrong: [vx(-h, c + k), vx(k, c + h), vx(h, c - k)],
          solution: t(
            `Replace $x$ by $${linear(1, -h)}$ and add $${k}$:${steps(`g(x) = f(${linear(1, -h)}) ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${coef(a)}(${linear(1, -h)})^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${answer}`)}`,
            `把 $x$ 换成 $${linear(1, -h)}$，再加上 $${k}$：${steps(`g(x) = f(${linear(1, -h)}) ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${coef(a)}(${linear(1, -h)})^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "translating-a-line",
      t("Translating a line", "平移直线"),
      t(
        "A line $y = mx + b$ moved $h$ units right and $k$ units up becomes $y = m(x - h) + b + k$. Expanding shows the slope stays $m$ and only the intercept changes, to $b - mh + k$: a translated line is parallel to the original.",
        "直线 $y = mx + b$ 向右平移 $h$ 个单位、向上平移 $k$ 个单位后变成 $y = m(x - h) + b + k$。展开后可以看到斜率仍是 $m$，只有截距变为 $b - mh + k$：平移后的直线与原直线平行。",
      ),
      (rng) => {
        const m = rng.nonZero(-5, 5);
        const b = rng.nonZero(-8, 8);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-6, 6);
        const answer = linear(m, b - m * h + k);
        const [hx, hz] = h > 0 ? ["right", "右"] : ["left", "左"];
        const [kx, kz] = k > 0 ? ["up", "上"] : ["down", "下"];
        return expressionProblem({
          prompt: t(
            `The line $y = ${linear(m, b)}$ is moved $${Math.abs(h)}$ ${units(h)} ${hx} and $${Math.abs(k)}$ ${units(k)} ${kx}. Write the equation of the new line in slope-intercept form.`,
            `把直线 $y = ${linear(m, b)}$ 向${hz}平移 $${Math.abs(h)}$ 个单位、向${kz}平移 $${Math.abs(k)}$ 个单位。用斜截式写出新直线的方程。`,
          ),
          answer,
          prefix: "y =",
          wrong: [linear(m, b + m * h + k), linear(m, b - h + k), linear(m, b + k), linear(m, b - m * h - k)],
          solution: t(
            `Replace $x$ by $${linear(1, -h)}$ and add $${k}$:${steps(`y = ${m}(${linear(1, -h)}) ${b < 0 ? "-" : "+"} ${Math.abs(b)} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${answer}`)}`,
            `把 $x$ 换成 $${linear(1, -h)}$，再加上 $${k}$：${steps(`y = ${m}(${linear(1, -h)}) ${b < 0 ? "-" : "+"} ${Math.abs(b)} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** transformingPolynomialFunctions finds zeros and values of transformed polynomial functions. */
export const transformingPolynomialFunctions = topic(
  "transforming-polynomial-functions",
  t("Transforming Polynomial Functions", "多项式函数的变换"),
  t(
    "Find the zeros and values of $f(x - h)$, $f(x) + k$, $-f(x)$ and $f(-x)$ when $f$ is a polynomial in factored form.",
    "当 $f$ 是因式分解形式的多项式时，求 $f(x - h)$、$f(x) + k$、$-f(x)$、$f(-x)$ 的零点和函数值。",
  ),
  ["finding-equations-of-translated-functions", "vertical-reflections-of-functions"],
  ["HSF.BF.B.3", "HSA.APR.B.3"],
  [
    kp(
      "zeros-after-a-transformation",
      t("Zeros after a transformation", "变换后的零点"),
      t(
        "A horizontal shift moves every zero: if $f(r) = 0$, then $g(x) = f(x - h)$ is zero at $x = r + h$. A reflection in the $y$-axis, $f(-x)$, turns each zero $r$ into $-r$, while a reflection in the $x$-axis, $-f(x)$, keeps the zeros where they are.",
        "水平平移会移动每个零点：若 $f(r) = 0$，则 $g(x) = f(x - h)$ 在 $x = r + h$ 处为零。关于 $y$ 轴的反射 $f(-x)$ 把每个零点 $r$ 变成 $-r$；关于 $x$ 轴的反射 $-f(x)$ 则不改变零点。",
      ),
      (rng) => {
        const roots = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 3).sort((p, q) => p - q);
        const f = roots.map((r) => `(${linear(1, -r)})`).join("");
        const kind = rng.pick(["shift", "shift", "flipx", "flipy"] as const);
        const h = rng.nonZero(-5, 5);
        const g = kind === "shift" ? `f(${linear(1, -h)})` : kind === "flipx" ? "f(-x)" : "-f(x)";
        const zeros = kind === "shift" ? roots.map((r) => r + h) : kind === "flipx" ? roots.map((r) => -r) : roots;
        const value = Math.max(...zeros);
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${f}$ and $g(x) = ${g}$. What is the greatest zero of $g$?`,
            `设 $f(x) = ${f}$，$g(x) = ${g}$。$g$ 的最大零点是多少？`,
          ),
          answer: value,
          wrong: [Math.max(...roots), Math.max(...roots.map((r) => r - h)), Math.max(...roots.map((r) => -r)), Math.min(...zeros)],
          solution: t(
            `The zeros of $f$ are $${roots.join(", ")}$. ${kind === "shift" ? `$g(x) = 0$ when $${linear(1, -h)}$ is a zero of $f$, so each zero moves by $${h}$` : kind === "flipx" ? "$g(x) = 0$ when $-x$ is a zero of $f$, so each zero changes sign" : "Multiplying by $-1$ does not change where the function is zero"}: the zeros of $g$ are $${[...zeros].sort((p, q) => p - q).join(", ")}$, and the greatest is $${value}$.`,
            `$f$ 的零点是 $${roots.join(", ")}$。${kind === "shift" ? `当 $${linear(1, -h)}$ 是 $f$ 的零点时 $g(x) = 0$，所以每个零点移动 $${h}$` : kind === "flipx" ? "当 $-x$ 是 $f$ 的零点时 $g(x) = 0$，所以每个零点变号" : "乘以 $-1$ 不改变函数为零的位置"}：$g$ 的零点是 $${[...zeros].sort((p, q) => p - q).join(", ")}$，最大的是 $${value}$。`,
          ),
        });
      },
    ),
    kp(
      "values-after-a-transformation",
      t("Values after a transformation", "变换后的函数值"),
      t(
        "To evaluate a transformed function, follow the transformation literally. For $g(x) = f(x - h) + k$, first subtract $h$ from the input, then evaluate $f$ there, then add $k$. Working through the steps in this order avoids mixing up shifts of the input with shifts of the output.",
        "求变换后函数的值时，严格按变换的定义计算。对于 $g(x) = f(x - h) + k$，先把输入减去 $h$，再求 $f$ 在该处的值，最后加上 $k$。按这个顺序计算，就不会把输入的平移与输出的平移弄混。",
      ),
      (rng) => {
        const p = rng.nonZero(-4, 4);
        const q = rng.nonZero(-5, 5);
        const f = poly([1, "x^3"], [p, "x"], [q, ""]);
        const h = rng.nonZero(-3, 3);
        const k = rng.nonZero(-6, 6);
        const x = rng.int(-2, 3) + h;
        const u = x - h;
        const value = u ** 3 + p * u + q + k;
        const wrongAt = (v: number) => v ** 3 + p * v + q + k;
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${f}$ and $g(x) = f(${linear(1, -h)}) ${k < 0 ? "-" : "+"} ${Math.abs(k)}$. What is $g(${x})$?`,
            `设 $f(x) = ${f}$，$g(x) = f(${linear(1, -h)}) ${k < 0 ? "-" : "+"} ${Math.abs(k)}$。$g(${x})$ 是多少？`,
          ),
          answer: value,
          wrong: [wrongAt(x + h), wrongAt(x), value - 2 * k],
          solution: t(
            `First $${x} - ${paren(h)} = ${u}$. Then $f(${u}) = ${paren(u)}^3 + ${paren(p)} \\cdot ${paren(u)} + ${paren(q)} = ${u ** 3 + p * u + q}$, so $g(${x}) = ${u ** 3 + p * u + q} + ${paren(k)} = ${value}$.`,
            `先算 $${x} - ${paren(h)} = ${u}$。再求 $f(${u}) = ${paren(u)}^3 + ${paren(p)} \\cdot ${paren(u)} + ${paren(q)} = ${u ** 3 + p * u + q}$，所以 $g(${x}) = ${u ** 3 + p * u + q} + ${paren(k)} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** satFundamentalsAlgebraTopics are the algebra topics written for SAT Math Fundamentals. */
export const satFundamentalsAlgebraTopics: readonly TopicDef[] = [
  simplifyingExpressionsWithSurds,
  evaluatingNumericalExpressionsContainingRadicals,
  applyingTheDistributiveLawToRadicalExpressions,
  comparingRadicals,
  solvingLinearEquationsContainingBinomialsByFactoring,
  manipulatingExpressionsAndEquations,
  interpretingCoefficientsOfTwoVariableEquations,
  parametrizingSystemsWithInfinitelyManySolutions,
  solvingSystemsOfLinearEquationsByIdentifyingStructure,
  largerSystemsOfEquations,
  optimizingSumsDifferencesProductsAndQuotients,
  linearFunctionsInTabularForm,
  analyzingLinearFunctionsInTabularForm,
  transformationsOfLinearFunctionsInTabularForm,
  linearFunctionsInTabularFormContainingUnknownParameters,
  findingEquationsOfTranslatedFunctions,
  transformingPolynomialFunctions,
];
