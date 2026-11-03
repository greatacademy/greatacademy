import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, num, Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// SAT Math Prep, algebra: equivalent equations, linear equations solved by structure, numerical word problems,
// linear models in context and in tables, intercepts and shifts of lines, and percentage inequalities.

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

/** eq writes the equation ax + b = c. */
const eq = (a: number, b: number, c: number) => `${linear(a, b)} = ${c}`;

/** distinct drops the values equal to the answer or to an earlier value. */
function distinct(answer: Q, values: readonly Q[]): Q[] {
  const out: Q[] = [];
  for (const v of values) if (!v.eq(answer) && !out.some((o) => o.eq(v))) out.push(v);
  return out;
}

// ---------------------------------------------------------------------------
// Linear equations in one variable

/** findingEquivalentEquations recognizes equations with the same solutions and uses them to evaluate expressions. */
export const findingEquivalentEquations = topic(
  "finding-equivalent-equations",
  t("Finding Equivalent Equations", "寻找等价方程"),
  t(
    "Recognize equations with the same solutions, and use a multiple of an equation to evaluate an expression directly.",
    "识别解相同的方程，并利用方程的倍数直接求代数式的值。",
  ),
  ["two-step-equations"],
  ["A-REI.A.1"],
  [
    kp(
      "recognizing-equivalent-equations",
      t("Recognizing equivalent equations", "识别等价方程"),
      t(
        "Two equations are equivalent when they have exactly the same solutions. Adding the same number to both sides, or multiplying both sides by the same nonzero number, gives an equivalent equation. Changing only one side, or only some of the terms, does not. For example, $3x + 2 = 8$ and $6x + 4 = 16$ are equivalent because the second is the first with both sides doubled.",
        "两个方程的解完全相同时，它们是等价方程。两边同时加上同一个数，或两边同时乘以同一个非零数，得到的方程与原方程等价；只改变一边或只改变部分项则不然。例如 $3x + 2 = 8$ 与 $6x + 4 = 16$ 等价，因为后者是把前者两边都乘以 $2$。",
      ),
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const c = rng.int(-20, 20);
        const k = rng.int(2, 5);
        const root = Q.of(c - b, a);
        const solves = (A: number, B: number, C: number) => Q.of(C - B, A).eq(root);
        const candidates: [number, number, number][] = [
          [k * a, b, k * c],
          [k * a, k * b, c],
          [a + k, b + k, c + k],
          [k * a, k * b, k * c + k],
          [a, k * b, k * c],
          [k * a, -k * b, k * c],
        ];
        const wrong = candidates.filter(([A, B, C]) => !solves(A, B, C)).map(([A, B, C]) => mathText(eq(A, B, C)));
        return pickChoice(
          rng,
          t(`Which equation is equivalent to $${eq(a, b, c)}$?`, `哪个方程与 $${eq(a, b, c)}$ 等价？`),
          mathText(eq(k * a, k * b, k * c)),
          wrong,
          t(
            `Multiplying both sides of $${eq(a, b, c)}$ by $${k}$ multiplies every term by $${k}$, giving $${eq(k * a, k * b, k * c)}$. The other choices change only some of the terms, so their solutions differ from $x = ${root.toLatex()}$.`,
            `把 $${eq(a, b, c)}$ 两边同乘以 $${k}$，每一项都乘以 $${k}$，得到 $${eq(k * a, k * b, k * c)}$。其他选项只改变了部分项，它们的解与 $x = ${root.toLatex()}$ 不同。`,
          ),
        );
      },
    ),
    kp(
      "evaluating-a-multiple-of-an-equation",
      t("Evaluating a multiple of one side", "求一边的倍数的值"),
      t(
        "When an expression is a multiple of one side of an equation, you do not need to solve for the variable. If $4x - 3 = 9$, then $8x - 6$ is twice the left side, so it equals twice the right side: $8x - 6 = 18$. Look for the factor that turns the given side into the expression you need.",
        "当所求代数式是方程某一边的倍数时，不必先解出未知数。若 $4x - 3 = 9$，则 $8x - 6$ 是左边的 $2$ 倍，所以它等于右边的 $2$ 倍：$8x - 6 = 18$。关键是找到把已知一边变成所求代数式的倍数。",
      ),
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.nonZero(-9, 9);
        const c = rng.int(-15, 30);
        const k = rng.pick([2, 3, 4, 5, -1, -2, -3]);
        const value = k * c;
        return numberProblem({
          prompt: t(
            `If $${eq(a, b, c)}$, what is the value of $${linear(k * a, k * b)}$?`,
            `若 $${eq(a, b, c)}$，求 $${linear(k * a, k * b)}$ 的值。`,
          ),
          answer: value,
          wrong: distinct(Q.of(value), [Q.of(c - b, a), Q.of(c), Q.of(k * c + b), Q.of(k * c - k * b)]),
          solution: t(
            `The expression is $${k}$ times the left side: $${linear(k * a, k * b)} = ${num(k)}(${linear(a, b)})$. So it equals $${num(k)} \\cdot ${c} = ${value}$.`,
            `这个代数式是左边的 $${k}$ 倍：$${linear(k * a, k * b)} = ${num(k)}(${linear(a, b)})$。所以它等于 $${num(k)} \\cdot ${c} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** solvingEquationsByCombiningTerms collects like terms on each side before solving. */
export const solvingEquationsByCombiningTerms = topic(
  "solving-equations-by-combining-terms",
  t("Solving Equations by Combining Terms", "合并同类项解方程"),
  t(
    "Solve linear equations whose sides contain several variable terms and constants by combining like terms first.",
    "先合并同类项，再解两边含有多个未知项和常数项的一元一次方程。",
  ),
  ["two-step-equations", "combining-like-terms"],
  ["A-REI.B.3"],
  [
    kp(
      "combining-terms-on-one-side",
      t("Combining terms on one side", "合并一边的同类项"),
      t(
        "When one side has several $x$-terms and several constants, add the $x$-terms together and the constants together first. Then the equation has the form $ax + b = c$ and you solve it in two steps. For $5x + 3 - 2x + 4 = 19$, combining gives $3x + 7 = 19$, so $3x = 12$ and $x = 4$.",
        "当一边有多个含 $x$ 的项和多个常数项时，先把含 $x$ 的项相加、常数项相加。这样方程化为 $ax + b = c$ 的形式，再分两步求解。对于 $5x + 3 - 2x + 4 = 19$，合并得 $3x + 7 = 19$，所以 $3x = 12$，$x = 4$。",
      ),
      (rng) => {
        const a1 = rng.int(2, 9);
        let a2 = rng.nonZero(-7, 7);
        while (a1 + a2 === 0) a2 = rng.nonZero(-7, 7);
        const a = a1 + a2;
        const b1 = rng.nonZero(-9, 9);
        const b2 = rng.nonZero(-9, 9);
        const x = rng.int(-8, 10);
        const c = a * x + b1 + b2;
        const left = `${linear(a1, b1)} ${a2 < 0 ? "-" : "+"} ${Math.abs(a2) === 1 ? "" : Math.abs(a2)}x ${b2 < 0 ? "-" : "+"} ${Math.abs(b2)}`;
        return numberProblem({
          prompt: t(`Solve $${left} = ${c}$.`, `解方程 $${left} = ${c}$。`),
          answer: x,
          solveFor: "x",
          wrong: distinct(Q.of(x), [Q.of(c - b1 - b2, a1), Q.of(c + b1 + b2, a), Q.of(c - b1 + b2, a), Q.of(c - b1 - b2, a1 - a2 || 1)]),
          solution: t(
            `Combine the $x$-terms and the constants:${steps(`${linear(a, b1 + b2)} = ${c}`, `${linear(a, 0)} = ${c - b1 - b2}`, `x = ${x}`)}`,
            `合并含 $x$ 的项与常数项：${steps(`${linear(a, b1 + b2)} = ${c}`, `${linear(a, 0)} = ${c - b1 - b2}`, `x = ${x}`)}`,
          ),
        });
      },
    ),
    kp(
      "combining-terms-on-both-sides",
      t("Combining terms on both sides", "合并两边的同类项"),
      t(
        "If both sides have several terms, simplify each side on its own, then move the $x$-terms to one side and the constants to the other. For $4x + 9 - x = x + 2 + 15$, the sides simplify to $3x + 9 = x + 17$; subtracting $x$ and $9$ gives $2x = 8$, so $x = 4$.",
        "如果两边都有多个项，先分别化简每一边，再把含 $x$ 的项移到一边、常数项移到另一边。对于 $4x + 9 - x = x + 2 + 15$，两边化简为 $3x + 9 = x + 17$；两边减去 $x$ 和 $9$ 得 $2x = 8$，所以 $x = 4$。",
      ),
      (rng) => {
        const p = rng.int(3, 9);
        const q = rng.int(1, p - 1);
        const r = rng.int(1, 6);
        const x = rng.int(-6, 9);
        const b1 = rng.int(-9, 12);
        const b2 = rng.nonZero(-9, 9);
        // Left: px + b1 - qx; right: rx + b2 + b3 with (p - q - r)x + b1 = b2 + b3.
        const a = p - q - r;
        if (a === 0) return solvingEquationsByCombiningTerms.knowledgePoints[1]!.generate(rng);
        const b3 = a * x + b1 - b2;
        if (b3 === 0) return solvingEquationsByCombiningTerms.knowledgePoints[1]!.generate(rng);
        const lhs = `${linear(p, b1)} - ${q === 1 ? "" : q}x`;
        const rhs = `${linear(r, b2)} ${b3 < 0 ? "-" : "+"} ${Math.abs(b3)}`;
        return numberProblem({
          prompt: t(`Solve $${lhs} = ${rhs}$.`, `解方程 $${lhs} = ${rhs}$。`),
          answer: x,
          solveFor: "x",
          wrong: distinct(Q.of(x), [Q.of(b2 + b3 - b1, p - q + r), Q.of(b2 + b3 + b1, a), Q.of(b2 + b3 - b1, p + q - r || 1), Q.of(-x)]),
          solution: t(
            `Simplify each side, then collect terms:${steps(`${linear(p - q, b1)} = ${linear(r, b2 + b3)}`, `${linear(a, 0)} = ${b2 + b3 - b1}`, `x = ${x}`)}`,
            `先化简两边，再移项合并：${steps(`${linear(p - q, b1)} = ${linear(r, b2 + b3)}`, `${linear(a, 0)} = ${b2 + b3 - b1}`, `x = ${x}`)}`,
          ),
        });
      },
    ),
  ],
);

/** manipulatingLinearEquationsContainingBinomials treats a repeated binomial as a single quantity. */
export const manipulatingLinearEquationsContainingBinomials = topic(
  "manipulating-linear-equations-containing-binomials",
  t("Manipulating Linear Equations Containing Binomials", "变形含二项式的一次方程"),
  t(
    "Find the value of a binomial such as $x - 4$ directly from an equation, without solving for $x$ first.",
    "不先求出 $x$，直接由方程求出 $x - 4$ 这类二项式的值。",
  ),
  ["equations-with-parentheses"],
  ["A-SSE.A.1", "A-REI.B.3"],
  [
    kp(
      "treating-a-binomial-as-one-quantity",
      t("Treating a binomial as one quantity", "把二项式看作一个整体"),
      t(
        "When a question asks for the value of a binomial that already appears in the equation, treat that binomial as a single unknown. If $3(x - 4) = 21$, then $x - 4$ is the number that gives $21$ when tripled, so $x - 4 = 7$. Finding $x$ first and then subtracting gives the same result with more work and more chances for error.",
        "当题目要求的二项式已经出现在方程中时，把它看作一个整体未知量。若 $3(x - 4) = 21$，则 $x - 4$ 乘以 $3$ 等于 $21$，所以 $x - 4 = 7$。先求 $x$ 再相减也能得到同样的结果，但步骤更多，更容易出错。",
      ),
      (rng) => {
        const k = rng.int(2, 9);
        const p = rng.nonZero(-9, 9);
        const v = rng.nonZero(-9, 12);
        const m = rng.pick([1, 2, 3, 5, -1, -2]);
        const bin = linear(1, p);
        const value = m * v;
        const target = m === 1 ? bin : m === -1 ? `-(${bin})` : `${m}(${bin})`;
        return numberProblem({
          prompt: t(
            `If $${k}(${bin}) = ${k * v}$, what is the value of $${target}$?`,
            `若 $${k}(${bin}) = ${k * v}$，求 $${target}$ 的值。`,
          ),
          answer: value,
          wrong: distinct(Q.of(value), [Q.of(v - p), Q.of(m * (v - p)), Q.of(k * v), Q.of(m * k * v)]),
          solution: t(
            `Divide both sides by $${k}$: $${bin} = ${v}$. Then $${target} = ${num(m)} \\cdot ${num(v)} = ${value}$.`,
            `两边同除以 $${k}$：$${bin} = ${v}$。所以 $${target} = ${num(m)} \\cdot ${num(v)} = ${value}$。`,
          ),
        });
      },
    ),
    kp(
      "spotting-a-hidden-binomial",
      t("Spotting a hidden binomial", "发现隐藏的二项式"),
      t(
        "Sometimes the binomial is hidden: $5x - 10 = 35$ does not show $x - 2$, but factoring the left side does, since $5x - 10 = 5(x - 2)$. Then $5(x - 2) = 35$ gives $x - 2 = 7$. Factor out the common factor that makes the needed binomial appear.",
        "有时二项式是隐藏的：$5x - 10 = 35$ 中看不到 $x - 2$，但把左边因式分解就能看到，因为 $5x - 10 = 5(x - 2)$。于是 $5(x - 2) = 35$ 给出 $x - 2 = 7$。提取公因数，让所需的二项式出现。",
      ),
      (rng) => {
        const k = rng.int(2, 9);
        const p = rng.nonZero(-9, 9);
        const v = rng.nonZero(-9, 12);
        const bin = linear(1, p);
        return numberProblem({
          prompt: t(`If $${eq(k, k * p, k * v)}$, what is the value of $${bin}$?`, `若 $${eq(k, k * p, k * v)}$，求 $${bin}$ 的值。`),
          answer: v,
          wrong: distinct(Q.of(v), [Q.of(v - p), Q.of(k * v), Q.of(k * v - k * p), Q.of(v + p)]),
          solution: t(
            `Factor $${k}$ out of the left side:${steps(`${k}(${bin}) = ${k * v}`, `${bin} = ${v}`)}`,
            `从左边提取公因数 $${k}$：${steps(`${k}(${bin}) = ${k * v}`, `${bin} = ${v}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Word problems and modeling

/** Step is one operation applied to a number in a word problem: adding, subtracting or multiplying by n. */
interface Step {
  readonly op: "add" | "sub" | "mul";
  readonly n: number;
}

/** stepFor builds a random operation of a word problem. */
function stepFor(rng: Rng): Step {
  return { op: rng.pick(["add", "sub", "mul"] as const), n: rng.int(2, 9) };
}

/** apply performs a step. */
const apply = (s: Step, v: Q) => (s.op === "add" ? v.add(Q.of(s.n)) : s.op === "sub" ? v.sub(Q.of(s.n)) : v.mul(Q.of(s.n)));

/** undo reverses a step. */
const undo = (s: Step, v: Q) => (s.op === "add" ? v.sub(Q.of(s.n)) : s.op === "sub" ? v.add(Q.of(s.n)) : v.div(Q.of(s.n)));

/** doEn and doZh name a step; undoEn and undoZh name its reverse. */
const doEn = (s: Step) => (s.op === "add" ? `add $${s.n}$` : s.op === "sub" ? `subtract $${s.n}$` : `multiply by $${s.n}$`);
const doZh = (s: Step) => (s.op === "add" ? `加上 $${s.n}$` : s.op === "sub" ? `减去 $${s.n}$` : `乘以 $${s.n}$`);
const undoEn = (s: Step) => (s.op === "add" ? `subtract $${s.n}$` : s.op === "sub" ? `add $${s.n}$` : `divide by $${s.n}$`);
const undoZh = (s: Step) => (s.op === "add" ? `减去 $${s.n}$` : s.op === "sub" ? `加上 $${s.n}$` : `除以 $${s.n}$`);

/** numericalWordProblems translates statements about an unknown number into linear equations. */
export const numericalWordProblems = topic(
  "numerical-word-problems",
  t("Numerical Word Problems", "数字应用题"),
  t("Translate statements about an unknown number into a linear equation and solve it.", "把关于未知数的叙述翻译成一次方程并求解。"),
  ["two-step-equations"],
  ["A-CED.A.1"],
  [
    kp(
      "translating-a-statement",
      t("Translating a statement into an equation", "把叙述翻译成方程"),
      t(
        "Let $n$ stand for the unknown number and translate the words in order: “times” multiplies, “more than” adds, “less than” subtracts in reverse order, and “the result is” becomes the equals sign. “$7$ less than $3$ times a number is $20$” becomes $3n - 7 = 20$, so $n = 9$.",
        "设未知数为 $n$，按顺序翻译：“倍”表示乘，“多”表示加，“少”表示减，“结果是”就是等号。“一个数的 $3$ 倍减去 $7$ 等于 $20$”写成 $3n - 7 = 20$，所以 $n = 9$。",
      ),
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, 20);
        const n = rng.int(-6, 15);
        const more = rng.bool();
        const c = more ? a * n + b : a * n - b;
        const prompt = more
          ? t(
              `When $${b}$ is added to $${a}$ times a number, the result is $${c}$. What is the number?`,
              `一个数的 $${a}$ 倍加上 $${b}$，结果是 $${c}$。这个数是多少？`,
            )
          : t(
              `$${b}$ less than $${a}$ times a number is $${c}$. What is the number?`,
              `一个数的 $${a}$ 倍减去 $${b}$，结果是 $${c}$。这个数是多少？`,
            );
        const equation = more ? `${a}n + ${b} = ${c}` : `${a}n - ${b} = ${c}`;
        return numberProblem({
          prompt,
          answer: n,
          wrong: distinct(Q.of(n), [Q.of(more ? c + b : c - b, a), Q.of(c - a, b), Q.of(c, a), Q.of(more ? a * c + b : a * c - b)]),
          solution: t(
            `Let $n$ be the number. The statement says $${equation}$, so $${a}n = ${more ? c - b : c + b}$ and $n = ${n}$.`,
            `设这个数为 $n$。叙述给出 $${equation}$，所以 $${a}n = ${more ? c - b : c + b}$，$n = ${n}$。`,
          ),
        });
      },
    ),
    kp(
      "two-numbers-from-a-sum-and-a-difference",
      t("Two numbers from their sum and difference", "由和与差求两个数"),
      t(
        "When two numbers are described together, write both in terms of one unknown. If the sum is $40$ and one number is $6$ more than the other, call the smaller $n$ and the larger $n + 6$. Then $n + (n + 6) = 40$, so $2n = 34$, $n = 17$, and the larger number is $23$.",
        "当题目同时描述两个数时，用一个未知数表示两者。若两数之和为 $40$，且一个数比另一个大 $6$，设较小的数为 $n$，较大的数为 $n + 6$。则 $n + (n + 6) = 40$，$2n = 34$，$n = 17$，较大的数是 $23$。",
      ),
      (rng) => {
        const small = rng.int(-5, 40);
        const d = rng.int(2, 19);
        const big = small + d;
        const s = small + big;
        const askBig = rng.bool();
        const answer = askBig ? big : small;
        return numberProblem({
          prompt: t(
            `The sum of two numbers is $${s}$, and one number is $${d}$ more than the other. What is the ${askBig ? "larger" : "smaller"} number?`,
            `两个数之和是 $${s}$，其中一个数比另一个大 $${d}$。${askBig ? "较大" : "较小"}的数是多少？`,
          ),
          answer,
          wrong: distinct(Q.of(answer), [Q.of(askBig ? small : big), Q.of(s - d), Q.of(s, 2), Q.of(s + d)]),
          solution: t(
            `Let the smaller number be $n$, so the larger is $n + ${d}$:${steps(`n + (n + ${d}) = ${s}`, `2n = ${s - d}`, `n = ${small}`)}The larger number is $${small} + ${d} = ${big}$.`,
            `设较小的数为 $n$，则较大的数为 $n + ${d}$：${steps(`n + (n + ${d}) = ${s}`, `2n = ${s - d}`, `n = ${small}`)}较大的数是 $${small} + ${d} = ${big}$。`,
          ),
        });
      },
    ),
  ],
);

/** multistepNumericalWordProblems undoes a chain of operations, or solves an equation with the unknown on both sides. */
export const multistepNumericalWordProblems = topic(
  "multistep-numerical-word-problems",
  t("Multistep Numerical Word Problems", "多步数字应用题"),
  t(
    "Solve word problems in which a number goes through several operations, or is compared with a multiple of itself.",
    "解决一个数经过多次运算，或与自身的倍数比较的应用题。",
  ),
  ["numerical-word-problems"],
  ["A-CED.A.1"],
  [
    kp(
      "undoing-a-chain-of-operations",
      t("Undoing a chain of operations", "逆推一连串运算"),
      t(
        "If a number goes through several operations in a row, work backward from the result and undo each operation in reverse order: undo the last operation first. Multiplication is undone by division and addition by subtraction. If a number is doubled, then $5$ is subtracted, giving $17$, add $5$ to get $22$ and then halve to get $11$.",
        "如果一个数依次经过几次运算，就从结果出发倒推，按相反的顺序撤销每次运算：先撤销最后一步。乘法用除法撤销，加法用减法撤销。若一个数先乘以 $2$ 再减去 $5$ 得 $17$，先加 $5$ 得 $22$，再除以 $2$ 得 $11$。",
      ),
      (rng) => {
        let chain: Step[] = [];
        do chain = [stepFor(rng), stepFor(rng), stepFor(rng)];
        while (!chain.some((c) => c.op === "mul"));
        const [s1, s2, s3] = chain as [Step, Step, Step];
        const n = Q.of(rng.int(-5, 12));
        const result = apply(s3, apply(s2, apply(s1, n)));
        const back = [undo(s3, result), undo(s2, undo(s3, result))];
        const forward = undo(s3, undo(s2, undo(s1, result)));
        const inOrder = undo(s1, undo(s2, undo(s3, result)));
        return numberProblem({
          prompt: t(
            `Start with a number, ${doEn(s1)}, then ${doEn(s2)}, and then ${doEn(s3)}. The result is $${result.toLatex()}$. What was the number?`,
            `从一个数开始，先${doZh(s1)}，再${doZh(s2)}，然后${doZh(s3)}，结果是 $${result.toLatex()}$。原来的数是多少？`,
          ),
          answer: n,
          wrong: distinct(n, [forward, inOrder.add(Q.one), back[0]!, back[1]!, result]),
          solution: t(
            `Undo the operations in reverse order, starting from $${result.toLatex()}$: ${undoEn(s3)} to get $${back[0]!.toLatex()}$, ${undoEn(s2)} to get $${back[1]!.toLatex()}$, then ${undoEn(s1)} to get $${n.toLatex()}$.`,
            `从 $${result.toLatex()}$ 开始按相反顺序撤销运算：${undoZh(s3)}得 $${back[0]!.toLatex()}$，${undoZh(s2)}得 $${back[1]!.toLatex()}$，再${undoZh(s1)}得 $${n.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "comparing-a-number-with-a-multiple-of-itself",
      t("Comparing a number with a multiple of itself", "把一个数与它的倍数比较"),
      t(
        "Some statements use the unknown number on both sides. “When $4$ is added to a number and the sum is tripled, the result is $10$ more than twice the number” becomes $3(n + 4) = 2n + 10$. Expanding gives $3n + 12 = 2n + 10$, so $n = -2$.",
        "有些叙述在等号两边都用到未知数。“一个数加 $4$ 后再乘以 $3$，结果比这个数的 $2$ 倍多 $10$”写成 $3(n + 4) = 2n + 10$。展开得 $3n + 12 = 2n + 10$，所以 $n = -2$。",
      ),
      (rng) => {
        const a = rng.int(1, 9);
        const k = rng.int(2, 6);
        const m = rng.int(1, 9);
        if (m === k) return multistepNumericalWordProblems.knowledgePoints[1]!.generate(rng);
        const n = rng.int(-8, 15);
        // k(n + a) = mn + c
        const c = k * (n + a) - m * n;
        const twice = m === 1 ? "the number" : `$${m}$ times the number`;
        const twiceZh = m === 1 ? "这个数" : `这个数的 $${m}$ 倍`;
        const rel = c >= 0 ? `$${c}$ more than ${twice}` : `$${-c}$ less than ${twice}`;
        const relZh = c >= 0 ? `比${twiceZh}多 $${c}$` : `比${twiceZh}少 $${-c}$`;
        return numberProblem({
          prompt: t(
            `When $${a}$ is added to a number and the sum is multiplied by $${k}$, the result is ${rel}. What is the number?`,
            `一个数加上 $${a}$ 后再乘以 $${k}$，结果${relZh}。这个数是多少？`,
          ),
          answer: n,
          wrong: distinct(Q.of(n), [Q.of(c - a, k - m), Q.of(c - k * a, k + m), Q.of(-n), Q.of(c + k * a, k - m)]),
          solution: t(
            `Let the number be $n$:${steps(`${k}(n + ${a}) = ${linear(m, c, "n")}`, `${linear(k, k * a, "n")} = ${linear(m, c, "n")}`, `${linear(k - m, 0, "n")} = ${c - k * a}`, `n = ${n}`)}`,
            `设这个数为 $n$：${steps(`${k}(n + ${a}) = ${linear(m, c, "n")}`, `${linear(k, k * a, "n")} = ${linear(m, c, "n")}`, `${linear(k - m, 0, "n")} = ${c - k * a}`, `n = ${n}`)}`,
          ),
        });
      },
    ),
  ],
);

/** Charge is a pricing context for linear models: a first unit at one price and further units at another. */
interface Charge {
  readonly en: (first: number, each: number) => string;
  readonly zh: (first: number, each: number) => string;
  readonly unitEn: string;
  readonly unitZh: string;
}

const charges: readonly Charge[] = [
  {
    en: (f, e) => `A plumber charges $\\$${f}$ for the first hour of work and $\\$${e}$ for each additional hour.`,
    zh: (f, e) => `一位水管工第一小时收费 $${f}$ 美元，之后每小时收费 $${e}$ 美元。`,
    unitEn: "hours",
    unitZh: "小时",
  },
  {
    en: (f, e) => `A taxi ride costs $\\$${f}$ for the first mile and $\\$${e}$ for each additional mile.`,
    zh: (f, e) => `乘坐出租车第一英里收费 $${f}$ 美元，之后每英里收费 $${e}$ 美元。`,
    unitEn: "miles",
    unitZh: "英里",
  },
  {
    en: (f, e) => `A parking garage charges $\\$${f}$ for the first day and $\\$${e}$ for each additional day.`,
    zh: (f, e) => `一个停车场第一天收费 $${f}$ 美元，之后每天收费 $${e}$ 美元。`,
    unitEn: "days",
    unitZh: "天",
  },
];

/** linearModelsPresentedInUnsimplifiedForm reads rates and starting values from models such as C = 50 + 30(h − 1). */
export const linearModelsPresentedInUnsimplifiedForm = topic(
  "linear-models-presented-in-unsimplified-form",
  t("Linear Models Presented in Unsimplified Form", "未化简形式的线性模型"),
  t(
    "Work with linear models written as a first charge plus a rate times the remaining units, such as $C = 50 + 30(h - 1)$.",
    "处理写成“首段费用加上单价乘以剩余数量”形式的线性模型，例如 $C = 50 + 30(h - 1)$。",
  ),
  ["interpreting-linear-expressions", "equations-with-parentheses"],
  ["A-SSE.A.1", "F-LE.B.5"],
  [
    kp(
      "simplifying-the-model",
      t("Simplifying the model", "化简模型"),
      t(
        "A model like $C = 50 + 30(h - 1)$ says the first hour costs $50$ and each hour after the first costs $30$. Expanding gives $C = 30h + 20$: the slope $30$ is still the cost per additional hour, but the constant $20$ is not the cost of the first hour. Expand and collect terms to write the model as $C = mh + b$.",
        "像 $C = 50 + 30(h - 1)$ 这样的模型表示第一小时收费 $50$，之后每小时收费 $30$。展开得 $C = 30h + 20$：斜率 $30$ 仍然是每增加一小时的费用，但常数 $20$ 并不是第一小时的费用。展开并合并同类项，把模型写成 $C = mh + b$ 的形式。",
      ),
      (rng) => {
        const each = rng.int(3, 40);
        const first = each + rng.int(2, 60);
        const ch = rng.pick(charges);
        const b = first - each;
        const askSlope = rng.bool();
        const answer = askSlope ? each : b;
        return numberProblem({
          prompt: t(
            `${ch.en(first, each)} The total cost, in dollars, for $n$ ${ch.unitEn} is $C = ${first} + ${each}(n - 1)$. When this is written as $C = mn + b$, what is the value of $${askSlope ? "m" : "b"}$?`,
            `${ch.zh(first, each)}$n$ ${ch.unitZh}的总费用（美元）为 $C = ${first} + ${each}(n - 1)$。把它写成 $C = mn + b$ 的形式时，$${askSlope ? "m" : "b"}$ 的值是多少？`,
          ),
          answer,
          wrong: distinct(Q.of(answer), [Q.of(askSlope ? b : each), Q.of(first), Q.of(first + each), Q.of(-each)]),
          solution: t(
            `Expand and collect terms:${steps(`C = ${first} + ${each}n - ${each}`, `C = ${each}n + ${b}`)}So $m = ${each}$ and $b = ${b}$.`,
            `展开并合并同类项：${steps(`C = ${first} + ${each}n - ${each}`, `C = ${each}n + ${b}`)}所以 $m = ${each}$，$b = ${b}$。`,
          ),
        });
      },
    ),
    kp(
      "solving-the-model-for-an-input",
      t("Finding the input for a given total", "由总量求输入"),
      t(
        "To find how many units give a certain total, substitute the total and solve, keeping the binomial together at first. If $C = 50 + 30(h - 1)$ and $C = 230$, then $30(h - 1) = 180$, so $h - 1 = 6$ and $h = 7$. Undo the first charge, then the rate, then the shift.",
        "要求出多少数量对应某个总量，把总量代入并求解，先把二项式看作一个整体。若 $C = 50 + 30(h - 1)$ 且 $C = 230$，则 $30(h - 1) = 180$，$h - 1 = 6$，$h = 7$。依次撤销首段费用、单价和平移。",
      ),
      (rng) => {
        const each = rng.int(3, 40);
        const first = each + rng.int(2, 60);
        const ch = rng.pick(charges);
        const n = rng.int(2, 20);
        const total = first + each * (n - 1);
        return numberProblem({
          prompt: t(
            `${ch.en(first, each)} The total cost, in dollars, for $n$ ${ch.unitEn} is $C = ${first} + ${each}(n - 1)$. For how many ${ch.unitEn} is the total cost $\\$${total}$?`,
            `${ch.zh(first, each)}$n$ ${ch.unitZh}的总费用（美元）为 $C = ${first} + ${each}(n - 1)$。总费用为 $${total}$ 美元时，$n$ 是多少？`,
          ),
          answer: n,
          wrong: distinct(Q.of(n), [Q.of(n - 1), Q.of(total, each), Q.of(total - first, each).add(Q.of(-1)), Q.of(n + 1)]),
          solution: t(
            `Substitute and solve:${steps(`${first} + ${each}(n - 1) = ${total}`, `${each}(n - 1) = ${total - first}`, `n - 1 = ${n - 1}`, `n = ${n}`)}`,
            `代入并求解：${steps(`${first} + ${each}(n - 1) = ${total}`, `${each}(n - 1) = ${total - first}`, `n - 1 = ${n - 1}`, `n = ${n}`)}`,
          ),
        });
      },
    ),
  ],
);

/** modelingGeometryProblemsUsingLinearEquations sets up linear equations from perimeters and angle sums. */
export const modelingGeometryProblemsUsingLinearEquations = topic(
  "modeling-geometry-problems-using-linear-equations",
  t("Modeling Geometry Problems Using Linear Equations", "用一次方程建模几何问题"),
  t(
    "Set up and solve linear equations from perimeters of rectangles and from the angle sum of a triangle.",
    "根据长方形的周长和三角形的内角和列出并求解一次方程。",
  ),
  ["modeling-with-linear-equations", "perimeter", "angles-of-a-triangle"],
  ["A-CED.A.1", "8.G.A.5"],
  [
    kp(
      "rectangles-with-related-sides",
      t("Rectangles with related sides", "边长相关的长方形"),
      t(
        "If one side of a rectangle is described in terms of the other, call the shorter side $w$ and write the longer side using $w$. The perimeter is $2(\\text{length} + \\text{width})$. A rectangle whose length is $3$ more than twice its width and whose perimeter is $42$ gives $2(w + 2w + 3) = 42$, so $6w + 6 = 42$ and $w = 6$.",
        "如果长方形的一条边用另一条边来描述，就设较短的边为 $w$，用 $w$ 表示较长的边。周长等于 $2(\\text{长} + \\text{宽})$。长比宽的 $2$ 倍多 $3$、周长为 $42$ 的长方形给出 $2(w + 2w + 3) = 42$，所以 $6w + 6 = 42$，$w = 6$。",
      ),
      (rng) => {
        const k = rng.int(1, 4);
        const d = rng.int(1, 9);
        const w = rng.int(2, 20);
        const l = k * w + d;
        const p = 2 * (w + l);
        const askLength = rng.bool();
        const answer = askLength ? l : w;
        const rel = k === 1 ? `$${d}$ more than its width` : `$${d}$ more than $${k}$ times its width`;
        const relZh = k === 1 ? `比宽多 $${d}$` : `比宽的 $${k}$ 倍多 $${d}$`;
        return numberProblem({
          prompt: t(
            `The length of a rectangle is ${rel}. The perimeter of the rectangle is $${p}$ centimeters. What is the ${askLength ? "length" : "width"} of the rectangle, in centimeters?`,
            `一个长方形的长${relZh}，周长是 $${p}$ 厘米。这个长方形的${askLength ? "长" : "宽"}是多少厘米？`,
          ),
          answer,
          unit: "cm",
          wrong: distinct(Q.of(answer), [
            Q.of(askLength ? w : l),
            Q.of(p - d, k + 1),
            Q.of(p - 2 * d, 2 * (k + 1)).add(Q.of(askLength ? d : 0)),
            Q.of(p, 2),
          ]),
          solution: t(
            `Let the width be $w$, so the length is $${linear(k, d, "w")}$:${steps(`2(w + ${linear(k, d, "w")}) = ${p}`, `${linear(2 * (k + 1), 2 * d, "w")} = ${p}`, `w = ${w}`)}The length is $${l}$ centimeters and the width is $${w}$ centimeters.`,
            `设宽为 $w$，则长为 $${linear(k, d, "w")}$：${steps(`2(w + ${linear(k, d, "w")}) = ${p}`, `${linear(2 * (k + 1), 2 * d, "w")} = ${p}`, `w = ${w}`)}长是 $${l}$ 厘米，宽是 $${w}$ 厘米。`,
          ),
        });
      },
    ),
    kp(
      "angles-of-a-triangle-in-terms-of-x",
      t("Triangle angles in terms of x", "用 x 表示的三角形内角"),
      t(
        "The three angles of a triangle add up to $180^\\circ$. When the angles are given as expressions in $x$, add the expressions, set the sum equal to $180$, and solve. Angles of $x^\\circ$, $2x^\\circ$ and $(x + 20)^\\circ$ give $4x + 20 = 180$, so $x = 40$ and the angles are $40^\\circ$, $80^\\circ$ and $60^\\circ$.",
        "三角形三个内角之和为 $180^\\circ$。当内角用含 $x$ 的式子表示时，把它们相加，令和等于 $180$ 并求解。内角为 $x^\\circ$、$2x^\\circ$、$(x + 20)^\\circ$ 时，$4x + 20 = 180$，所以 $x = 40$，三个角分别是 $40^\\circ$、$80^\\circ$、$60^\\circ$。",
      ),
      (rng) => {
        for (;;) {
          const a1 = rng.int(1, 4);
          const a2 = rng.int(1, 4);
          const a3 = rng.int(1, 3);
          const b2 = rng.int(-20, 30);
          const b3 = rng.int(-20, 30);
          const s = a1 + a2 + a3;
          const rest = 180 - b2 - b3;
          if (rest % s !== 0) continue;
          const x = rest / s;
          const angles = [a1 * x, a2 * x + b2, a3 * x + b3];
          if (angles.some((v) => v <= 0)) continue;
          const largest = Math.max(...angles);
          const askX = rng.bool();
          const answer = askX ? x : largest;
          const e1 = linear(a1, 0);
          const e2 = linear(a2, b2);
          const e3 = linear(a3, b3);
          return numberProblem({
            prompt: t(
              `The angles of a triangle measure $(${e1})^\\circ$, $(${e2})^\\circ$ and $(${e3})^\\circ$. What is ${askX ? "the value of $x$" : "the measure, in degrees, of the largest angle"}?`,
              `一个三角形的三个内角分别是 $(${e1})^\\circ$、$(${e2})^\\circ$ 和 $(${e3})^\\circ$。${askX ? "$x$ 的值" : "最大的角是多少度"}？`,
            ),
            answer,
            wrong: distinct(Q.of(answer), [
              Q.of(askX ? largest : x),
              Q.of(180 + b2 + b3, s),
              Q.of(360 - b2 - b3, s),
              Q.of(Math.min(...angles)),
            ]),
            solution: t(
              `The angles add up to $180^\\circ$:${steps(`${linear(s, b2 + b3)} = 180`, `${linear(s, 0)} = ${rest}`, `x = ${x}`)}The angles are $${angles.join("^\\circ$, $")}^\\circ$, so the largest is $${largest}^\\circ$.`,
              `三个内角之和为 $180^\\circ$：${steps(`${linear(s, b2 + b3)} = 180`, `${linear(s, 0)} = ${rest}`, `x = ${x}`)}三个角分别是 $${angles.join("^\\circ$、$")}^\\circ$，最大的角是 $${largest}^\\circ$。`,
            ),
          });
        }
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Linear functions

/** findingAFunctionInputForAGivenOutput solves f(x) = c for linear functions. */
export const findingAFunctionInputForAGivenOutput = topic(
  "finding-a-function-input-for-a-given-output",
  t("Finding a Function Input for a Given Output", "由函数值求自变量"),
  t(
    "Find the input of a linear function that produces a given output by solving an equation.",
    "通过解方程，求出使一次函数取给定值的自变量。",
  ),
  ["introduction-to-functions"],
  ["F-IF.A.2"],
  [
    kp(
      "solving-f-of-x-equals-c",
      t("Solving f(x) = c", "解 f(x) = c"),
      t(
        "Evaluating $f(4)$ means substituting $4$ for $x$. The reverse question, “for what value of $x$ is $f(x) = 17$?”, means setting the formula equal to $17$ and solving. For $f(x) = 3x - 4$, the equation $3x - 4 = 17$ gives $x = 7$, so $f(7) = 17$.",
        "求 $f(4)$ 是把 $4$ 代入 $x$。反过来问“$x$ 取何值时 $f(x) = 17$”，就是令函数式等于 $17$ 并求解。对于 $f(x) = 3x - 4$，方程 $3x - 4 = 17$ 给出 $x = 7$，所以 $f(7) = 17$。",
      ),
      (rng) => {
        const a = rng.nonZero(-8, 9);
        const b = rng.int(-15, 15);
        const x = rng.int(-9, 12);
        const c = a * x + b;
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${linear(a, b)}$. For what value of $x$ is $f(x) = ${c}$?`,
            `函数 $f$ 定义为 $f(x) = ${linear(a, b)}$。$x$ 取何值时 $f(x) = ${c}$？`,
          ),
          answer: x,
          wrong: distinct(Q.of(x), [Q.of(a * c + b), Q.of(c + b, a), Q.of(c, a), Q.of(c - b)]),
          solution: t(
            `Set the formula equal to $${c}$ and solve:${steps(`${linear(a, b)} = ${c}`, `${linear(a, 0)} = ${c - b}`, `x = ${x}`)}`,
            `令函数式等于 $${c}$ 并求解：${steps(`${linear(a, b)} = ${c}`, `${linear(a, 0)} = ${c - b}`, `x = ${x}`)}`,
          ),
        });
      },
    ),
    kp(
      "inputs-of-functions-with-fractions",
      t("Inputs of functions with fractional coefficients", "含分数系数的函数的自变量"),
      t(
        "If the function has a fractional coefficient, clear the fraction after isolating the term with $x$. For $f(x) = \\frac{2}{3}x + 5$ and $f(x) = 13$, subtract $5$ to get $\\frac{2}{3}x = 8$, then multiply by $\\frac{3}{2}$ to get $x = 12$.",
        "如果函数含有分数系数，先把含 $x$ 的项单独留在一边，再消去分数。对于 $f(x) = \\frac{2}{3}x + 5$ 且 $f(x) = 13$，减去 $5$ 得 $\\frac{2}{3}x = 8$，再乘以 $\\frac{3}{2}$ 得 $x = 12$。",
      ),
      (rng) => {
        const [p, q] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [3, 4],
          [1, 4],
          [2, 5],
          [3, 5],
          [5, 2],
          [4, 3],
        ] as const);
        const sign = rng.sign();
        const m = Q.of(sign * p, q);
        const x = q * rng.nonZero(-6, 8);
        const b = rng.int(-12, 12);
        const c = m.mul(Q.of(x)).add(Q.of(b));
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${linear(m, b)}$. For what value of $x$ is $f(x) = ${c.toLatex()}$?`,
            `函数 $f$ 定义为 $f(x) = ${linear(m, b)}$。$x$ 取何值时 $f(x) = ${c.toLatex()}$？`,
          ),
          answer: x,
          wrong: distinct(Q.of(x), [c.sub(Q.of(b)).mul(m), m.mul(c).add(Q.of(b)), c.add(Q.of(b)).div(m), Q.of(-x)]),
          solution: t(
            `Set the formula equal to $${c.toLatex()}$:${steps(`${linear(m, b)} = ${c.toLatex()}`, `${linear(m, 0)} = ${c.sub(Q.of(b)).toLatex()}`, `x = ${c.sub(Q.of(b)).toLatex()} \\cdot ${Q.one.div(m).toLatex()} = ${x}`)}`,
            `令函数式等于 $${c.toLatex()}$：${steps(`${linear(m, b)} = ${c.toLatex()}`, `${linear(m, 0)} = ${c.sub(Q.of(b)).toLatex()}`, `x = ${c.sub(Q.of(b)).toLatex()} \\cdot ${Q.one.div(m).toLatex()} = ${x}`)}`,
          ),
        });
      },
    ),
  ],
);

/** linearFunctionsContainingUnknownParameters finds a missing coefficient from a known value of the function. */
export const linearFunctionsContainingUnknownParameters = topic(
  "linear-functions-containing-unknown-parameters",
  t("Linear Functions Containing Unknown Parameters", "含未知参数的一次函数"),
  t(
    "Use a known value of a linear function to find an unknown constant in its formula, then use the completed function.",
    "利用一次函数的一个已知函数值求出式中的未知常数，再使用完整的函数。",
  ),
  ["finding-a-function-input-for-a-given-output"],
  ["F-IF.A.2", "A-CED.A.1"],
  [
    kp(
      "finding-the-parameter",
      t("Finding the parameter", "求参数"),
      t(
        "If $f(x) = ax + 7$ for some constant $a$ and $f(3) = 22$, substitute $x = 3$ and $f(x) = 22$: $3a + 7 = 22$, so $a = 5$. The known input and output give an equation whose only unknown is the parameter.",
        "若 $f(x) = ax + 7$（$a$ 为常数）且 $f(3) = 22$，代入 $x = 3$ 与 $f(x) = 22$：$3a + 7 = 22$，所以 $a = 5$。已知的自变量与函数值给出一个只含参数的方程。",
      ),
      (rng) => {
        const a = rng.nonZero(-8, 9);
        const b = rng.int(-15, 15);
        const p = rng.nonZero(-6, 8);
        const value = a * p + b;
        const slopeUnknown = rng.bool();
        const formula = slopeUnknown ? `ax ${b < 0 ? "-" : "+"} ${Math.abs(b)}` : `${linear(a, 0)} + b`;
        const answer = slopeUnknown ? a : b;
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${formula}$, where $${slopeUnknown ? "a" : "b"}$ is a constant. If $f(${p}) = ${value}$, what is the value of $${slopeUnknown ? "a" : "b"}$?`,
            `函数 $f$ 定义为 $f(x) = ${formula}$，其中 $${slopeUnknown ? "a" : "b"}$ 是常数。若 $f(${p}) = ${value}$，求 $${slopeUnknown ? "a" : "b"}$ 的值。`,
          ),
          answer,
          wrong: distinct(
            Q.of(answer),
            slopeUnknown ? [Q.of(value + b, p), Q.of(value, p), Q.of(value - b)] : [Q.of(value + a * p), Q.of(value), Q.of(value - a)],
          ),
          solution: slopeUnknown
            ? t(
                `Substitute $x = ${p}$:${steps(`${p}a ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${value}`, `${p}a = ${value - b}`, `a = ${a}`)}`,
                `代入 $x = ${p}$：${steps(`${p}a ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${value}`, `${p}a = ${value - b}`, `a = ${a}`)}`,
              )
            : t(
                `Substitute $x = ${p}$:${steps(`${num(a * p)} + b = ${value}`, `b = ${b}`)}`,
                `代入 $x = ${p}$：${steps(`${num(a * p)} + b = ${value}`, `b = ${b}`)}`,
              ),
        });
      },
    ),
    kp(
      "using-the-completed-function",
      t("Using the completed function", "使用求出参数后的函数"),
      t(
        "After finding the parameter, write out the complete function before answering the actual question. If $f(x) = ax - 4$ and $f(2) = 6$, then $2a - 4 = 6$ gives $a = 5$, so $f(x) = 5x - 4$ and $f(-3) = -19$. Many wrong answers come from stopping once the parameter is found.",
        "求出参数后，先写出完整的函数，再回答题目真正的问题。若 $f(x) = ax - 4$ 且 $f(2) = 6$，则 $2a - 4 = 6$，$a = 5$，所以 $f(x) = 5x - 4$，$f(-3) = -19$。很多错误答案来自求出参数后就停下了。",
      ),
      (rng) => {
        const a = rng.nonZero(-7, 8);
        const b = rng.nonZero(-12, 12);
        const p = rng.nonZero(-5, 6);
        let r = rng.int(-6, 8);
        if (r === p) r = p + 1;
        const fp = a * p + b;
        const fr = a * r + b;
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ax ${b < 0 ? "-" : "+"} ${Math.abs(b)}$, where $a$ is a constant, and $f(${p}) = ${fp}$. What is the value of $f(${r})$?`,
            `函数 $f$ 定义为 $f(x) = ax ${b < 0 ? "-" : "+"} ${Math.abs(b)}$，其中 $a$ 为常数，且 $f(${p}) = ${fp}$。求 $f(${r})$ 的值。`,
          ),
          answer: fr,
          wrong: distinct(Q.of(fr), [Q.of(a), Q.of(a * r), Q.of(fp * r + b), Q.of(fp + r)]),
          solution: t(
            `First find $a$: $${p}a ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${fp}$, so $a = ${a}$ and $f(x) = ${linear(a, b)}$. Then $f(${r}) = ${num(a)} \\cdot ${num(r)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${fr}$.`,
            `先求 $a$：$${p}a ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${fp}$，所以 $a = ${a}$，$f(x) = ${linear(a, b)}$。于是 $f(${r}) = ${num(a)} \\cdot ${num(r)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${fr}$。`,
          ),
        });
      },
    ),
  ],
);

/** Scenario is a context for a linear function given in a table. */
interface Scenario {
  readonly en: string;
  readonly zh: string;
  readonly xEn: string;
  readonly xZh: string;
  readonly yEn: string;
  readonly yZh: string;
  readonly rateEn: string;
  readonly rateZh: string;
}

const scenarios: readonly Scenario[] = [
  {
    en: "The table shows the total cost $C$, in dollars, of renting a kayak for $h$ hours.",
    zh: "下表给出租用皮划艇 $h$ 小时的总费用 $C$（美元）。",
    xEn: "h",
    xZh: "h",
    yEn: "C",
    yZh: "C",
    rateEn: "dollars per hour",
    rateZh: "美元每小时",
  },
  {
    en: "The table shows the height $H$, in centimeters, of a plant $d$ days after it was measured for the first time.",
    zh: "下表给出一株植物在首次测量后第 $d$ 天的高度 $H$（厘米）。",
    xEn: "d",
    xZh: "d",
    yEn: "H",
    yZh: "H",
    rateEn: "centimeters per day",
    rateZh: "厘米每天",
  },
  {
    en: "The table shows the amount of water $W$, in liters, in a tank $m$ minutes after a pump was turned on.",
    zh: "下表给出水泵打开 $m$ 分钟后水箱中的水量 $W$（升）。",
    xEn: "m",
    xZh: "m",
    yEn: "W",
    yZh: "W",
    rateEn: "liters per minute",
    rateZh: "升每分钟",
  },
];

/** tableOf writes a two-row table of a linear function. */
function tableOf(x: string, y: string, xs: readonly number[], m: number, b: number): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} ${x} & ${xs.join(" & ")} \\\\ \\hline ${y} & ${xs.map((v) => m * v + b).join(" & ")} \\end{array}$$`;
}

/** linearFunctionsAsTablesInApplications reads rates and starting values of linear models from tables. */
export const linearFunctionsAsTablesInApplications = topic(
  "linear-functions-as-tables-in-applications",
  t("Linear Functions as Tables in Applications", "应用情境中以表格表示的一次函数"),
  t(
    "Read the rate of change and the starting value of a linear model from a table, and use them to predict.",
    "从表格中读出线性模型的变化率与初始值，并用它们进行预测。",
  ),
  ["linear-functions-in-tabular-form"],
  ["F-LE.A.2", "F-LE.B.5"],
  [
    kp(
      "rate-from-a-table",
      t("The rate of change in context", "情境中的变化率"),
      t(
        "In a table of a linear model, the rate of change is the change in the output divided by the change in the input between any two columns. The inputs need not be consecutive: if the cost goes from $26$ at $2$ hours to $50$ at $5$ hours, the rate is $\\frac{50 - 26}{5 - 2} = 8$ dollars per hour.",
        "在线性模型的表格中，变化率等于任意两列之间输出的变化量除以输入的变化量。输入不必连续：若费用在 $2$ 小时时为 $26$，在 $5$ 小时时为 $50$，变化率为 $\\frac{50 - 26}{5 - 2} = 8$ 美元每小时。",
      ),
      (rng) => {
        const sc = rng.pick(scenarios);
        const m = rng.int(2, 15);
        const b = rng.int(5, 60);
        const start = rng.int(1, 4);
        const gap = rng.int(2, 4);
        const xs = [start, start + gap, start + 2 * gap, start + 3 * gap];
        return numberProblem({
          prompt: t(
            `${sc.en} ${tableOf(sc.xEn, sc.yEn, xs, m, b)}The relationship is linear. What is the rate of change, in ${sc.rateEn}?`,
            `${sc.zh}${tableOf(sc.xZh, sc.yZh, xs, m, b)}两者之间是线性关系。变化率是多少${sc.rateZh}？`,
          ),
          answer: m,
          wrong: distinct(Q.of(m), [Q.of(m * gap), Q.of(b), Q.of(m * xs[0]! + b, xs[0]!), Q.of(m + b)]),
          solution: t(
            `Between the first two columns the input increases by $${gap}$ and the output by $${m * gap}$, so the rate is $\\frac{${m * gap}}{${gap}} = ${m}$ ${sc.rateEn}.`,
            `前两列之间输入增加 $${gap}$，输出增加 $${m * gap}$，所以变化率为 $\\frac{${m * gap}}{${gap}} = ${m}$ ${sc.rateZh}。`,
          ),
        });
      },
    ),
    kp(
      "predicting-from-a-table",
      t("Predicting from a table", "根据表格预测"),
      t(
        "To predict a value not in the table, find the rate of change, then work back to the starting value at input $0$ and write the model $y = mx + b$. If the table gives $26$ at $2$ and $50$ at $5$, the rate is $8$ and the starting value is $26 - 2 \\cdot 8 = 10$, so at $12$ the model gives $8 \\cdot 12 + 10 = 106$.",
        "要预测表格中没有的值，先求出变化率，再倒推输入为 $0$ 时的初始值，写出模型 $y = mx + b$。若表格给出 $2$ 对应 $26$、$5$ 对应 $50$，变化率为 $8$，初始值为 $26 - 2 \\cdot 8 = 10$，所以输入为 $12$ 时模型给出 $8 \\cdot 12 + 10 = 106$。",
      ),
      (rng) => {
        const sc = rng.pick(scenarios);
        const m = rng.int(2, 15);
        const b = rng.int(5, 60);
        const start = rng.int(1, 4);
        const gap = rng.int(1, 3);
        const xs = [start, start + gap, start + 2 * gap];
        const target = xs[2]! + rng.int(4, 15);
        const value = m * target + b;
        return numberProblem({
          prompt: t(
            `${sc.en} ${tableOf(sc.xEn, sc.yEn, xs, m, b)}The relationship is linear. What is the value of $${sc.yEn}$ when $${sc.xEn} = ${target}$?`,
            `${sc.zh}${tableOf(sc.xZh, sc.yZh, xs, m, b)}两者之间是线性关系。当 $${sc.xZh} = ${target}$ 时，$${sc.yZh}$ 的值是多少？`,
          ),
          answer: value,
          wrong: distinct(Q.of(value), [
            Q.of(m * target),
            Q.of(m * gap * target + b),
            Q.of(m * xs[2]! + b + m),
            Q.of((m * xs[0]! + b) * target),
          ]),
          solution: t(
            `The rate is $\\frac{${m * gap}}{${gap}} = ${m}$, and the value at $0$ is $${m * xs[0]! + b} - ${xs[0]!} \\cdot ${m} = ${b}$. So $${sc.yEn} = ${m}${sc.xEn} + ${b}$ and at $${sc.xEn} = ${target}$ it is $${m} \\cdot ${target} + ${b} = ${value}$.`,
            `变化率为 $\\frac{${m * gap}}{${gap}} = ${m}$，输入为 $0$ 时的值为 $${m * xs[0]! + b} - ${xs[0]!} \\cdot ${m} = ${b}$。所以 $${sc.yZh} = ${m}${sc.xZh} + ${b}$，当 $${sc.xZh} = ${target}$ 时为 $${m} \\cdot ${target} + ${b} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Graphs of linear equations

/** findingInterceptsOfLinesInSlopeInterceptForm finds the intercepts of y = mx + b. */
export const findingInterceptsOfLinesInSlopeInterceptForm = topic(
  "finding-intercepts-of-lines-in-slope-intercept-form",
  t("Finding Intercepts of Lines in Slope-Intercept Form", "求斜截式直线的截距"),
  t(
    "Find where a line given in slope-intercept form crosses the axes, including lines described by a slope and a point.",
    "求以斜截式给出的直线与坐标轴的交点，包括用斜率和一点描述的直线。",
  ),
  ["slope-intercept-form"],
  ["A-REI.D.10", "F-IF.C.7"],
  [
    kp(
      "the-x-intercept",
      t("The x-intercept", "x 轴截距"),
      t(
        "The $y$-intercept of $y = mx + b$ is $(0, b)$. The $x$-intercept is where $y = 0$, so solve $0 = mx + b$ to get $x = -\\frac{b}{m}$. For $y = 4x - 10$, the $x$-intercept is at $x = \\frac{10}{4} = \\frac{5}{2}$, which is between $2$ and $3$.",
        "直线 $y = mx + b$ 的 $y$ 轴截距点为 $(0, b)$。$x$ 轴截距处 $y = 0$，解 $0 = mx + b$ 得 $x = -\\frac{b}{m}$。对于 $y = 4x - 10$，$x$ 轴截距在 $x = \\frac{10}{4} = \\frac{5}{2}$ 处，介于 $2$ 和 $3$ 之间。",
      ),
      (rng) => {
        const m = rng.nonZero(-9, 9);
        const b = rng.nonZero(-20, 20);
        const x = Q.of(-b, m);
        return numberProblem({
          prompt: t(
            `The line $y = ${linear(m, b)}$ crosses the $x$-axis at the point $(a, 0)$. What is the value of $a$?`,
            `直线 $y = ${linear(m, b)}$ 与 $x$ 轴交于点 $(a, 0)$。求 $a$ 的值。`,
          ),
          answer: x,
          form: "fraction",
          wrong: distinct(x, [Q.of(b), Q.of(b, m), Q.of(-m, b), Q.of(m * b)]),
          solution: t(
            `At the $x$-intercept $y = 0$:${steps(`0 = ${linear(m, b)}`, `${linear(m, 0)} = ${-b}`, `x = ${x.toLatex()}`)}`,
            `在 $x$ 轴截距处 $y = 0$：${steps(`0 = ${linear(m, b)}`, `${linear(m, 0)} = ${-b}`, `x = ${x.toLatex()}`)}`,
          ),
        });
      },
    ),
    kp(
      "intercepts-from-a-slope-and-a-point",
      t("Intercepts from a slope and a point", "由斜率与一点求截距"),
      t(
        "If a line has slope $m$ and passes through $(p, q)$, its $y$-intercept is $b = q - mp$, because $q = mp + b$. A line with slope $3$ through $(2, 1)$ has $b = 1 - 6 = -5$. Once $b$ is known, the $x$-intercept is $-\\frac{b}{m}$, here $\\frac{5}{3}$.",
        "若直线斜率为 $m$ 且经过 $(p, q)$，则它的 $y$ 轴截距为 $b = q - mp$，因为 $q = mp + b$。斜率为 $3$、经过 $(2, 1)$ 的直线有 $b = 1 - 6 = -5$。求出 $b$ 后，$x$ 轴截距为 $-\\frac{b}{m}$，这里是 $\\frac{5}{3}$。",
      ),
      (rng) => {
        const m = rng.nonZero(-6, 6);
        const p = rng.nonZero(-6, 6);
        const q = rng.int(-10, 10);
        const b = q - m * p;
        if (b === 0) return findingInterceptsOfLinesInSlopeInterceptForm.knowledgePoints[1]!.generate(rng);
        const askY = rng.bool();
        const answer = askY ? Q.of(b) : Q.of(-b, m);
        return numberProblem({
          prompt: t(
            `A line has slope $${m}$ and passes through the point $(${p}, ${q})$. What is the ${askY ? "$y$-coordinate of its $y$-intercept" : "$x$-coordinate of its $x$-intercept"}?`,
            `一条直线的斜率为 $${m}$，经过点 $(${p}, ${q})$。它的${askY ? " $y$ 轴截距点的纵坐标" : " $x$ 轴截距点的横坐标"}是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: distinct(answer, [Q.of(q + m * p), Q.of(q - p), askY ? Q.of(-b, m) : Q.of(b), Q.of(p - q, m)]),
          solution: t(
            `Substitute the point into $y = ${m}x + b$: $${q} = ${num(m)} \\cdot ${num(p)} + b$, so $b = ${b}$ and the line is $y = ${linear(m, b)}$.${askY ? "" : ` Setting $y = 0$ gives $x = ${Q.of(-b, m).toLatex()}$.`}`,
            `把点代入 $y = ${m}x + b$：$${q} = ${num(m)} \\cdot ${num(p)} + b$，所以 $b = ${b}$，直线为 $y = ${linear(m, b)}$。${askY ? "" : `令 $y = 0$ 得 $x = ${Q.of(-b, m).toLatex()}$。`}`,
          ),
        });
      },
    ),
  ],
);

/** analyzingLinearEquationsOfShiftedLines writes the equations of lines translated up, down, left or right. */
export const analyzingLinearEquationsOfShiftedLines = topic(
  "analyzing-linear-equations-of-shifted-lines",
  t("Analyzing Linear Equations of Shifted Lines", "分析平移后直线的方程"),
  t("Find the equation and intercepts of a line after it is shifted vertically or horizontally.", "求直线竖直或水平平移后的方程与截距。"),
  ["finding-intercepts-of-lines-in-slope-intercept-form"],
  ["F-BF.B.3"],
  [
    kp(
      "vertical-shifts-of-lines",
      t("Vertical shifts of lines", "直线的竖直平移"),
      t(
        "Shifting the graph of $y = mx + b$ up by $k$ units adds $k$ to every $y$-value, giving $y = mx + b + k$. The slope does not change, and the $y$-intercept moves from $b$ to $b + k$. Shifting down by $k$ subtracts $k$ instead. For example, $y = 2x - 3$ shifted up $5$ units is $y = 2x + 2$.",
        "把 $y = mx + b$ 的图象向上平移 $k$ 个单位，每个 $y$ 值都加上 $k$，得到 $y = mx + b + k$。斜率不变，$y$ 轴截距从 $b$ 变为 $b + k$。向下平移 $k$ 个单位则减去 $k$。例如 $y = 2x - 3$ 向上平移 $5$ 个单位得 $y = 2x + 2$。",
      ),
      (rng) => {
        const m = rng.nonZero(-6, 6);
        const b = rng.int(-10, 10);
        const k = rng.int(1, 12);
        const up = rng.bool();
        const nb = up ? b + k : b - k;
        if (nb === 0) return analyzingLinearEquationsOfShiftedLines.knowledgePoints[0]!.generate(rng);
        const answer = Q.of(-nb, m);
        return numberProblem({
          prompt: t(
            `The graph of $y = ${linear(m, b)}$ is shifted ${up ? "up" : "down"} $${k}$ units. What is the $x$-coordinate of the $x$-intercept of the new graph?`,
            `把 $y = ${linear(m, b)}$ 的图象向${up ? "上" : "下"}平移 $${k}$ 个单位。新图象的 $x$ 轴截距点的横坐标是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: distinct(answer, [Q.of(nb), Q.of(-b, m), Q.of(-(up ? b - k : b + k), m), Q.of(nb, m)]),
          solution: t(
            `The shifted line is $y = ${linear(m, nb)}$. Setting $y = 0$ gives $${linear(m, 0)} = ${-nb}$, so $x = ${answer.toLatex()}$.`,
            `平移后的直线为 $y = ${linear(m, nb)}$。令 $y = 0$ 得 $${linear(m, 0)} = ${-nb}$，所以 $x = ${answer.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "horizontal-shifts-of-lines",
      t("Horizontal shifts of lines", "直线的水平平移"),
      t(
        "Shifting $y = mx + b$ to the right by $h$ units replaces $x$ with $x - h$, giving $y = m(x - h) + b = mx + (b - mh)$. The slope stays the same but the $y$-intercept changes by $-mh$. Shifting $y = 3x + 1$ right by $2$ gives $y = 3(x - 2) + 1 = 3x - 5$, so its $y$-intercept is $-5$.",
        "把 $y = mx + b$ 向右平移 $h$ 个单位，就是用 $x - h$ 代替 $x$，得到 $y = m(x - h) + b = mx + (b - mh)$。斜率不变，但 $y$ 轴截距改变 $-mh$。把 $y = 3x + 1$ 向右平移 $2$ 个单位得 $y = 3(x - 2) + 1 = 3x - 5$，它的 $y$ 轴截距为 $-5$。",
      ),
      (rng) => {
        const m = rng.nonZero(-6, 6);
        const b = rng.int(-10, 10);
        const h = rng.int(1, 8);
        const right = rng.bool();
        const shift = right ? h : -h;
        const nb = b - m * shift;
        return numberProblem({
          prompt: t(
            `The graph of $y = ${linear(m, b)}$ is shifted $${h}$ units to the ${right ? "right" : "left"}. What is the $y$-coordinate of the $y$-intercept of the new graph?`,
            `把 $y = ${linear(m, b)}$ 的图象向${right ? "右" : "左"}平移 $${h}$ 个单位。新图象的 $y$ 轴截距点的纵坐标是多少？`,
          ),
          answer: nb,
          wrong: distinct(Q.of(nb), [Q.of(b + m * shift), Q.of(right ? b - h : b + h), Q.of(right ? b + h : b - h), Q.of(b)]),
          solution: t(
            `Replace $x$ with $${right ? `x - ${h}` : `x + ${h}`}$:${steps(`y = ${num(m)}(${right ? `x - ${h}` : `x + ${h}`}) ${b < 0 ? "-" : "+"} ${Math.abs(b)}`, `y = ${linear(m, nb)}`)}The new $y$-intercept is $${nb}$.`,
            `用 $${right ? `x - ${h}` : `x + ${h}`}$ 代替 $x$：${steps(`y = ${num(m)}(${right ? `x - ${h}` : `x + ${h}`}) ${b < 0 ? "-" : "+"} ${Math.abs(b)}`, `y = ${linear(m, nb)}`)}新的 $y$ 轴截距为 $${nb}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Linear inequalities

/** modelingAndSolvingPercentageProblemsWithOneVariableLinearInequalities models budgets and passing scores. */
export const modelingAndSolvingPercentageProblemsWithOneVariableLinearInequalities = topic(
  "modeling-and-solving-percentage-problems-with-one-variable-linear-inequalities",
  t("Modeling and Solving Percentage Problems With One-Variable Linear Inequalities", "用一元一次不等式建模并解决百分数问题"),
  t(
    "Model discounts, taxes and required percentages with linear inequalities, and round the solution in the direction the context requires.",
    "用一次不等式为折扣、税费和所需百分比建模，并按情境要求的方向取整。",
  ),
  ["modeling-with-one-step-inequalities", "percent-of-a-number"],
  ["A-CED.A.1", "7.EE.B.4"],
  [
    kp(
      "budgets-with-discounts",
      t("Budgets with discounts", "有折扣的预算"),
      t(
        "A discount of $d\\%$ means each item costs $(1 - \\frac{d}{100})$ times its price. To stay within a budget, the number of items $n$ must satisfy $\\text{discounted price} \\cdot n \\le \\text{budget}$. Because $n$ counts items, the answer is the greatest whole number that satisfies the inequality, so round down.",
        "打 $d\\%$ 的折扣意味着每件商品的价格变为原价的 $(1 - \\frac{d}{100})$ 倍。要不超出预算，件数 $n$ 必须满足 $\\text{折后价} \\cdot n \\le \\text{预算}$。由于 $n$ 是件数，答案是满足不等式的最大整数，所以要向下取整。",
      ),
      (rng) => {
        const price = rng.int(8, 60);
        const d = rng.pick([10, 20, 25, 30, 40, 50]);
        const each = Q.of(price * (100 - d), 100);
        const n = rng.int(3, 20);
        const budget = Math.floor(each.mul(Q.of(n)).toNumber()) + rng.int(0, Math.max(1, Math.floor(each.toNumber()) - 1));
        const ratio = Q.of(budget).div(each);
        const max = Math.floor(ratio.toNumber());
        return numberProblem({
          prompt: t(
            `A store sells notebooks for $\\$${price}$ each and is offering a $${d}\\%$ discount on every notebook. What is the greatest number of notebooks a customer can buy with $\\$${budget}$?`,
            `一家商店的笔记本每本售价 $${price}$ 美元，现在每本都打 $${d}\\%$ 的折扣。顾客用 $${budget}$ 美元最多能买多少本笔记本？`,
          ),
          answer: max,
          form: "integer",
          wrong: distinct(Q.of(max), [Q.of(Math.floor(budget / price)), Q.of(max + 1), Q.of(Math.floor(budget / ((price * d) / 100)))]),
          solution: t(
            `Each notebook costs $${price} \\cdot ${dec(Q.of(100 - d, 100))} = ${dec(each)}$ dollars, so $${dec(each)}n \\le ${budget}$ and $n \\le \\frac{${budget}}{${dec(each)}}$, which is ${ratio.isInteger() ? `exactly $${max}$` : `between $${max}$ and $${max + 1}$`}. The number of notebooks is a whole number, so the greatest possible number is $${max}$.`,
            `每本价格为 $${price} \\cdot ${dec(Q.of(100 - d, 100))} = ${dec(each)}$ 美元，所以 $${dec(each)}n \\le ${budget}$，$n \\le \\frac{${budget}}{${dec(each)}}$，${ratio.isInteger() ? `恰好等于 $${max}$` : `介于 $${max}$ 和 $${max + 1}$ 之间`}。笔记本的数量是整数，所以最多能买 $${max}$ 本。`,
          ),
        });
      },
    ),
    kp(
      "reaching-a-required-percentage",
      t("Reaching a required percentage", "达到所需百分比"),
      t(
        "To score at least $p\\%$ on a test of $N$ questions, the number of correct answers $c$ must satisfy $c \\ge \\frac{p}{100} \\cdot N$. Since $c$ is a whole number, round up to the next whole number when $\\frac{p}{100} \\cdot N$ is not an integer. At least $70\\%$ of $45$ questions means $c \\ge 31.5$, so at least $32$ correct answers.",
        "要在 $N$ 道题的测验中至少得到 $p\\%$，答对题数 $c$ 必须满足 $c \\ge \\frac{p}{100} \\cdot N$。由于 $c$ 是整数，当 $\\frac{p}{100} \\cdot N$ 不是整数时要向上取整。$45$ 道题至少答对 $70\\%$ 意味着 $c \\ge 31.5$，所以至少答对 $32$ 道。",
      ),
      (rng) => {
        const p = rng.pick([60, 65, 70, 75, 80, 85, 90]);
        const n = rng.int(12, 80);
        const need = Q.of(p * n, 100);
        const min = Math.ceil(need.toNumber());
        return numberProblem({
          prompt: t(
            `To pass a certification exam, a candidate must answer at least $${p}\\%$ of the $${n}$ questions correctly. What is the least number of questions the candidate must answer correctly to pass?`,
            `要通过一项资格考试，考生必须答对 $${n}$ 道题中的至少 $${p}\\%$。考生至少要答对多少道题才能通过？`,
          ),
          answer: min,
          form: "integer",
          wrong: distinct(Q.of(min), [
            Q.of(Math.floor(need.toNumber())),
            Q.of(n - min),
            Q.of(min + 1),
            Q.of(Math.ceil(((100 - p) * n) / 100)),
          ]),
          solution: t(
            `The number correct $c$ must satisfy $c \\ge \\frac{${p}}{100} \\cdot ${n} = ${dec(need)}$. ${need.isInteger() ? `So the least number is $${min}$.` : `Rounding up to a whole number gives $${min}$.`}`,
            `答对题数 $c$ 必须满足 $c \\ge \\frac{${p}}{100} \\cdot ${n} = ${dec(need)}$。${need.isInteger() ? `所以最少是 $${min}$ 道。` : `向上取整得 $${min}$ 道。`}`,
          ),
        });
      },
    ),
  ],
);

/** satPrepAlgebraTopics lists the SAT Math Prep algebra topics in prerequisite order. */
export const satPrepAlgebraTopics: readonly TopicDef[] = [
  findingEquivalentEquations,
  solvingEquationsByCombiningTerms,
  manipulatingLinearEquationsContainingBinomials,
  numericalWordProblems,
  multistepNumericalWordProblems,
  linearModelsPresentedInUnsimplifiedForm,
  modelingGeometryProblemsUsingLinearEquations,
  findingAFunctionInputForAGivenOutput,
  linearFunctionsContainingUnknownParameters,
  linearFunctionsAsTablesInApplications,
  findingInterceptsOfLinesInSlopeInterceptForm,
  analyzingLinearEquationsOfShiftedLines,
  modelingAndSolvingPercentageProblemsWithOneVariableLinearInequalities,
];
