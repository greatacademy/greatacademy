import type { Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, poly, relSymbol } from "@ga/subject-math";

import { choiceProblem, type InequalityOp, inequalityLatex, inequalityProblem, steps, yesNo } from "../problems.ts";

const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const strictness: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const holds = (l: number, op: InequalityOp, r: number) => ({ "<": l < r, "<=": l <= r, ">": l > r, ">=": l >= r })[op];

export const inequalitiesAndSolutions: TopicDef = {
  id: "inequalities-and-solutions",
  title: t("Inequalities and Their Solutions", "不等式及其解"),
  summary: t("Read and write inequalities, and check whether a number is a solution.", "读写不等式，判断一个数是否是不等式的解。"),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "integers-and-opposites", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.6.EE.B.5", "CCSS.6.EE.B.8"],
  knowledgePoints: [
    {
      id: "checking-solutions",
      title: t("Checking a solution", "检验解"),
      explanation: t(
        "An **inequality** compares two expressions with one of the symbols $<$ (less than), $\\le$ (less than or equal to), $>$ (greater than) or $\\ge$ (greater than or equal to). A value is a **solution** if substituting it makes the inequality true.\n\nFor example, $x = 4$ is a solution of $2x - 1 \\ge 7$, because $2(4) - 1 = 7$ and $7 \\ge 7$ is true. It is **not** a solution of $2x - 1 > 7$, because $7 > 7$ is false.",
        "**不等式**用符号 $<$（小于）、$\\le$（小于或等于）、$>$（大于）或 $\\ge$（大于或等于）比较两个式子。代入后能使不等式成立的值是不等式的**解**。\n\n例如 $x = 4$ 是 $2x - 1 \\ge 7$ 的解，因为 $2(4) - 1 = 7$，而 $7 \\ge 7$ 成立；但它**不是** $2x - 1 > 7$ 的解，因为 $7 > 7$ 不成立。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-12, 12);
        const x = rng.nonZero(-8, 8);
        const v = a * x + b;
        const op = rng.pick(ops);
        const c = rng.bool(0.35) ? v : v + rng.nonZero(-6, 6);
        const expr = linear(a, b);
        const ok = holds(v, op, c);
        const sub = `${a === 1 ? "" : a === -1 ? "-" : num(a)}(${num(x)}) ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
        return choiceProblem({
          prompt: t(
            `Is $x = ${num(x)}$ a solution of $${expr} ${relSymbol(op)} ${num(c)}$?`,
            `$x = ${num(x)}$ 是不等式 $${expr} ${relSymbol(op)} ${num(c)}$ 的解吗？`,
          ),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `Substitute: $${sub} = ${num(v)}$. The statement $${num(v)} ${relSymbol(op)} ${num(c)}$ is ${ok ? "true, so it is a solution" : "false, so it is not a solution"}.`,
            `代入：$${sub} = ${num(v)}$。$${num(v)} ${relSymbol(op)} ${num(c)}$ ${ok ? "成立，所以它是解" : "不成立，所以它不是解"}。`,
          ),
        });
      },
    },
    {
      id: "writing-inequalities",
      title: t("Writing inequalities", "写出不等式"),
      explanation: t(
        'Phrases translate into symbols:\n\n| Phrase | Symbol |\n| :--- | :--- |\n| less than, below | $<$ |\n| at most, no more than | $\\le$ |\n| greater than, above | $>$ |\n| at least, no less than | $\\ge$ |\n\n"$x$ is at least $-3$" means $x$ can be $-3$ or anything greater: $x \\ge -3$.',
        '文字与符号的对应：\n\n| 说法 | 符号 |\n| :--- | :--- |\n| 小于、低于 | $<$ |\n| 至多、不超过 | $\\le$ |\n| 大于、高于 | $>$ |\n| 至少、不低于 | $\\ge$ |\n\n"$x$ 至少是 $-3$"表示 $x$ 可以等于 $-3$ 或比它大：$x \\ge -3$。',
      ),
      generate(rng) {
        const phrases: readonly [InequalityOp, Text][] = [
          ["<", t("less than", "小于")],
          ["<=", t("at most", "至多是")],
          ["<=", t("no more than", "不超过")],
          [">", t("greater than", "大于")],
          [">=", t("at least", "至少是")],
          [">=", t("no less than", "不小于")],
        ];
        const [op, phrase] = rng.pick(phrases);
        const v = rng.int(-20, 20);
        return inequalityProblem({
          prompt: t(
            `Write an inequality that says: $x$ is ${phrase.en} $${num(v)}$.`,
            `写出表示下面意思的不等式：$x$ ${phrase["zh-CN"]} $${num(v)}$。`,
          ),
          op,
          value: v,
          wrong: [
            [strictness[op], v],
            [flip[op], v],
          ],
          solution: t(
            `"${phrase.en}" is written $${relSymbol(op)}$: $${inequalityLatex("x", op, v)}$.`,
            `"${phrase["zh-CN"]}"写作 $${relSymbol(op)}$：$${inequalityLatex("x", op, v)}$。`,
          ),
        });
      },
    },
  ],
};

export const solvingOneStepInequalities: TopicDef = {
  id: "solving-one-step-inequalities",
  title: t("Solving One-Step Inequalities", "解一步不等式"),
  summary: t(
    "Solve inequalities in one step, reversing the symbol when multiplying or dividing by a negative number.",
    "一步解不等式；乘或除以负数时改变不等号方向。",
  ),
  prerequisites: ["inequalities-and-solutions", "one-step-equations-multiplication"],
  encompasses: [
    { topic: "one-step-equations-multiplication", weight: 0.5 },
    { topic: "one-step-equations-addition", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.7.EE.B.4.B"],
  knowledgePoints: [
    {
      id: "adding-and-subtracting",
      title: t("Adding or subtracting on both sides", "两边同时加减"),
      explanation: t(
        "Adding or subtracting the same number on both sides keeps an inequality true, so solve as for an equation:\n\n$$x + 6 < 2 \\;\\Rightarrow\\; x < -4.$$\n\nThe solution is not one number but every number less than $-4$.",
        "不等式两边同时加上或减去同一个数，不等式仍然成立，所以解法与方程相同：\n\n$$x + 6 < 2 \\;\\Rightarrow\\; x < -4.$$\n\n解不是一个数，而是所有小于 $-4$ 的数。",
      ),
      keyPrerequisites: ["one-step-equations-addition"],
      generate(rng) {
        const a = rng.nonZero(-20, 20);
        const b = rng.int(-25, 25);
        const op = rng.pick(ops);
        const v = b - a;
        return inequalityProblem({
          prompt: t(`Solve $${linear(1, a)} ${relSymbol(op)} ${num(b)}$.`, `解不等式 $${linear(1, a)} ${relSymbol(op)} ${num(b)}$。`),
          op,
          value: v,
          wrong: [
            [op, b + a],
            [flip[op], v],
          ],
          solution: t(
            `${a > 0 ? `Subtract $${a}$ from` : `Add $${-a}$ to`} both sides: $${inequalityLatex("x", op, v)}$.`,
            `两边同时${a > 0 ? `减去 $${a}$` : `加上 $${-a}$`}：$${inequalityLatex("x", op, v)}$。`,
          ),
        });
      },
    },
    {
      id: "positive-coefficient",
      title: t("Dividing by a positive number", "除以正数"),
      explanation: t(
        "Multiplying or dividing both sides by a **positive** number keeps the inequality symbol as it is:\n\n$$4x \\ge -12 \\;\\Rightarrow\\; x \\ge -3.$$",
        "两边同时乘以或除以一个**正数**，不等号方向不变：\n\n$$4x \\ge -12 \\;\\Rightarrow\\; x \\ge -3.$$",
      ),
      keyPrerequisites: ["one-step-equations-multiplication"],
      generate(rng) {
        const a = rng.int(2, 9);
        const v = rng.int(-10, 10);
        const op = rng.pick(ops);
        return inequalityProblem({
          prompt: t(`Solve $${a}x ${relSymbol(op)} ${num(a * v)}$.`, `解不等式 $${a}x ${relSymbol(op)} ${num(a * v)}$。`),
          op,
          value: v,
          wrong: [
            [flip[op], v],
            [op, a * v - a],
          ],
          solution: t(
            `Divide both sides by $${a}$, which is positive, so the symbol stays: $${inequalityLatex("x", op, v)}$.`,
            `两边同时除以正数 $${a}$，不等号方向不变：$${inequalityLatex("x", op, v)}$。`,
          ),
        });
      },
    },
    {
      id: "negative-coefficient",
      title: t("Dividing by a negative number", "除以负数"),
      explanation: t(
        "Multiplying or dividing both sides by a **negative** number **reverses** the inequality symbol. For example, $2 < 5$, but $-2 > -5$. So\n\n$$-3x < 12 \\;\\Rightarrow\\; x > -4.$$\n\nCheck with a value: $x = 0$ satisfies $x > -4$, and $-3(0) = 0 < 12$. ✓",
        "两边同时乘以或除以一个**负数**，不等号要**改变方向**。例如 $2 < 5$，但 $-2 > -5$。所以\n\n$$-3x < 12 \\;\\Rightarrow\\; x > -4.$$\n\n取一个值检验：$x = 0$ 满足 $x > -4$，且 $-3(0) = 0 < 12$。✓",
      ),
      generate(rng) {
        const a = rng.bool(0.15) ? -1 : -rng.int(2, 9);
        const v = rng.int(-10, 10);
        const op = rng.pick(ops);
        const answerOp = flip[op];
        return inequalityProblem({
          prompt: t(
            `Solve $${poly([a, "x"])} ${relSymbol(op)} ${num(a * v)}$.`,
            `解不等式 $${poly([a, "x"])} ${relSymbol(op)} ${num(a * v)}$。`,
          ),
          op: answerOp,
          value: v,
          wrong: [
            [op, v],
            [answerOp, -v],
            [op, -v],
          ],
          solution: t(
            `Divide both sides by $${num(a)}$. It is negative, so the symbol reverses: $${inequalityLatex("x", answerOp, v)}$.`,
            `两边同时除以 $${num(a)}$。它是负数，所以不等号改变方向：$${inequalityLatex("x", answerOp, v)}$。`,
          ),
        });
      },
    },
  ],
};

export const solvingMultiStepInequalities: TopicDef = {
  id: "solving-multi-step-inequalities",
  title: t("Solving Multi-Step Inequalities", "解多步不等式"),
  summary: t("Solve linear inequalities with several steps and variables on both sides.", "解需要多步、两边都有变量的一元一次不等式。"),
  prerequisites: ["solving-one-step-inequalities", "equations-with-variables-on-both-sides"],
  encompasses: [
    { topic: "solving-one-step-inequalities", weight: 1 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.7 },
  ],
  xp: 15,
  standards: ["CCSS.7.EE.B.4.B"],
  knowledgePoints: [
    {
      id: "two-step-inequalities",
      title: t("Two-step inequalities", "两步不等式"),
      explanation: t(
        "Solve as for a two-step equation, and reverse the symbol only at the moment you multiply or divide by a negative number:\n\n$$7 - 2x \\ge 13 \\;\\Rightarrow\\; -2x \\ge 6 \\;\\Rightarrow\\; x \\le -3.$$",
        "按两步方程的方法求解，只在乘或除以负数的那一步改变不等号方向：\n\n$$7 - 2x \\ge 13 \\;\\Rightarrow\\; -2x \\ge 6 \\;\\Rightarrow\\; x \\le -3.$$",
      ),
      keyPrerequisites: ["solving-one-step-inequalities", "two-step-equations"],
      generate(rng) {
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-20, 20);
        const v = rng.int(-10, 10);
        const c = a * v + b;
        const op = rng.pick(ops);
        const answerOp = a < 0 ? flip[op] : op;
        const lhs = rng.bool() || a > 0 ? linear(a, b) : poly([b, ""], [a, "x"]);
        return inequalityProblem({
          prompt: t(`Solve $${lhs} ${relSymbol(op)} ${num(c)}$.`, `解不等式 $${lhs} ${relSymbol(op)} ${num(c)}$。`),
          op: answerOp,
          value: v,
          wrong: [
            [flip[answerOp], v],
            [answerOp, -v],
          ],
          solution: t(
            `${b > 0 ? `Subtract $${b}$ from` : `Add $${-b}$ to`} both sides, then divide by $${num(a)}$${a < 0 ? ", reversing the symbol" : ""}: ${steps(`${poly([a, "x"])} ${relSymbol(op)} ${num(c - b)}`, inequalityLatex("x", answerOp, v))}`,
            `两边同时${b > 0 ? `减去 $${b}$` : `加上 $${-b}$`}，再同时除以 $${num(a)}$${a < 0 ? "，并改变不等号方向" : ""}：${steps(`${poly([a, "x"])} ${relSymbol(op)} ${num(c - b)}`, inequalityLatex("x", answerOp, v))}`,
          ),
        });
      },
    },
    {
      id: "variables-on-both-sides",
      title: t("Variables on both sides", "两边都有变量"),
      explanation: t(
        "Collect the variable on one side first. If its coefficient ends up negative, dividing by it reverses the symbol:\n\n$$2x + 5 > 5x - 4 \\;\\Rightarrow\\; -3x > -9 \\;\\Rightarrow\\; x < 3.$$",
        "先把变量移到一边。如果最后的系数是负数，除以它时要改变不等号方向：\n\n$$2x + 5 > 5x - 4 \\;\\Rightarrow\\; -3x > -9 \\;\\Rightarrow\\; x < 3.$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        let c = rng.nonZero(-9, 9);
        while (c === a) c = rng.nonZero(-9, 9);
        const k = a - c;
        const v = rng.int(-8, 8);
        const b = rng.nonZero(-15, 15);
        const d = k * v + b;
        const op = rng.pick(ops);
        const answerOp = k < 0 ? flip[op] : op;
        return inequalityProblem({
          prompt: t(
            `Solve $${linear(a, b)} ${relSymbol(op)} ${linear(c, d)}$.`,
            `解不等式 $${linear(a, b)} ${relSymbol(op)} ${linear(c, d)}$。`,
          ),
          op: answerOp,
          value: v,
          wrong: [
            [flip[answerOp], v],
            [answerOp, -v],
          ],
          solution: t(
            `Subtract $${linear(c, b)}$ from both sides, then divide by $${num(k)}$${k < 0 ? ", reversing the symbol" : ""}: ${steps(`${poly([k, "x"])} ${relSymbol(op)} ${num(d - b)}`, inequalityLatex("x", answerOp, v))}`,
            `两边同时减去 $${linear(c, b)}$，再同时除以 $${num(k)}$${k < 0 ? "，并改变不等号方向" : ""}：${steps(`${poly([k, "x"])} ${relSymbol(op)} ${num(d - b)}`, inequalityLatex("x", answerOp, v))}`,
          ),
        });
      },
    },
  ],
};

/** inequalityTopics are the topics of the inequalities unit, in teaching order. */
export const inequalityTopics: readonly TopicDef[] = [inequalitiesAndSolutions, solvingOneStepInequalities, solvingMultiStepInequalities];
