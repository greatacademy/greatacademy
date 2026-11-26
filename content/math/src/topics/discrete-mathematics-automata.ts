import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { explainedChoice, numberProblem, verdictChoice } from "../problems.ts";
import { none, walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 8: finite-state machines, Turing machines and algorithmic complexity.

/** Mistake is a wrong numeric answer with what went wrong. */
type Mistake = { readonly value: number; readonly why: Text };

/** slip pairs a wrong value with what went wrong. */
const slip = (value: number, en: string, zh: string): Mistake => ({ value, why: t(en, zh) });

/** apart drops the mistakes whose value is the answer, is not a finite number, or repeats an earlier one. */
const apart = (answer: number, mistakes: readonly Mistake[]): Mistake[] =>
  mistakes.filter((m, i, all) => Number.isFinite(m.value) && m.value !== answer && all.findIndex((x) => x.value === m.value) === i);

/** qx writes state q_i. */
const qx = (i: number) => `q_${i}`;

/** randomWord picks a binary string of length n. */
const randomWord = (rng: Rng, n: number) =>
  range(1, n)
    .map(() => rng.pick(["0", "1"]))
    .join("");

/** allWords lists the binary strings of length n. */
const allWords = (n: number) =>
  range(0, 2 ** n - 1)
    .map((x) =>
      x
        .toString(2)
        .padStart(n, "0")
        .slice(-n || 1),
    )
    .map((w) => (n === 0 ? "" : w));

/** countOnes counts the 1s of a binary string. */
const countOnes = (s: string) => [...s].filter((c) => c === "1").length;

/** Option is a wrong string option with what is wrong with it. */
type Option = { readonly s: string; readonly why: Text };

/** flip changes one random symbol of a binary string. */
const flip = (rng: Rng, s: string) => {
  const i = rng.int(0, s.length - 1);
  return s.slice(0, i) + (s[i] === "0" ? "1" : "0") + s.slice(i + 1);
};

/** stringChoice builds an explained choice among strings: the right one and three distinct wrong ones, near misses that change one symbol filling any gap. */
function stringChoice(rng: Rng, prompt: Text, right: string, wrong: readonly Option[], solution: Text) {
  const near = range(1, 40).map((): Option => {
    const s = flip(rng, right);
    const i = [...s].findIndex((c, j) => c !== right[j]) + 1;
    return {
      s,
      why: t(
        `Symbol ${i} of this string is wrong; recheck the state the run is in at that point.`,
        `这个串的第 ${i} 个符号错了；请重新检查运行到那里时所处的状态。`,
      ),
    };
  });
  const seen = new Set([right]);
  const picked: Option[] = [];
  for (const o of [...wrong, ...near]) {
    if (picked.length === 3) break;
    if (!seen.has(o.s)) {
      seen.add(o.s);
      picked.push(o);
    }
  }
  return explainedChoice(rng, {
    prompt,
    correct: t(`$${right}$`, `$${right}$`),
    wrong: picked.map((o) => ({ option: t(`$${o.s}$`, `$${o.s}$`), why: o.why })),
    solution,
  });
}

/** Machine is a deterministic finite-state machine over {0, 1} starting in q₀; out holds Mealy outputs per transition. */
interface Machine {
  readonly k: number;
  readonly delta: readonly (readonly number[])[];
  readonly out: readonly (readonly number[])[];
  readonly accept: readonly boolean[];
}

/** randomMachine builds a random machine with k states, outputs and a nonempty proper set of accepting states. */
function randomMachine(rng: Rng, k: number): Machine {
  const accepting = rng.sample(range(0, k - 1), rng.int(1, k - 1));
  return {
    k,
    delta: range(0, k - 1).map(() => [rng.int(0, k - 1), rng.int(0, k - 1)]),
    out: range(0, k - 1).map(() => [rng.int(0, 1), rng.int(0, 1)]),
    accept: range(0, k - 1).map((q) => accepting.includes(q)),
  };
}

/** trace returns the states visited while reading w, starting with q₀. */
function trace(m: Machine, w: string): number[] {
  const states = [0];
  for (const c of w) states.push(m.delta[states[states.length - 1]!]![Number(c)]!);
  return states;
}

/** mealyOutput is the output string of a Mealy machine on w. */
const mealyOutput = (m: Machine, w: string) => {
  const s = trace(m, w);
  return [...w].map((c, i) => m.out[s[i]!]![Number(c)]).join("");
};

/** mooreOutput is the output string of a Moore machine on w, starting with the output of q₀; out[q][0] is the output of state q. */
const mooreOutput = (m: Machine, w: string) =>
  trace(m, w)
    .map((q) => m.out[q]![0])
    .join("");

/** mealyTable writes the transition table of a Mealy machine, entries next state / output. */
const mealyTable = (m: Machine) =>
  `\\begin{array}{c|cc} & 0 & 1 \\\\ \\hline ${range(0, m.k - 1)
    .map((q) => `${q === 0 ? "\\to " : ""}${qx(q)} & ${qx(m.delta[q]![0]!)}/${m.out[q]![0]} & ${qx(m.delta[q]![1]!)}/${m.out[q]![1]}`)
    .join(" \\\\ ")} \\end{array}`;

/** mooreTable writes the transition table of a Moore machine with an output column. */
const mooreTable = (m: Machine) =>
  `\\begin{array}{c|cc|c} & 0 & 1 & \\text{out} \\\\ \\hline ${range(0, m.k - 1)
    .map((q) => `${q === 0 ? "\\to " : ""}${qx(q)} & ${qx(m.delta[q]![0]!)} & ${qx(m.delta[q]![1]!)} & ${m.out[q]![0]}`)
    .join(" \\\\ ")} \\end{array}`;

/** dfaTable writes the transition table of a DFA; → marks the start state and * the accepting states. */
const dfaTable = (m: Machine) =>
  `\\begin{array}{c|cc} & 0 & 1 \\\\ \\hline ${range(0, m.k - 1)
    .map((q) => `${q === 0 ? "\\to " : ""}${m.accept[q] ? "{*}" : ""}${qx(q)} & ${qx(m.delta[q]![0]!)} & ${qx(m.delta[q]![1]!)}`)
    .join(" \\\\ ")} \\end{array}`;

/** traceTex writes the states visited as q₀ → q₂ → …. */
const traceTex = (states: readonly number[]) => states.map(qx).join(" \\to ");

/** runTex writes a run with each arrow labelled by the symbol read, or by a label of its own. */
const runTex = (states: readonly number[], labels: readonly string[]) =>
  states.map((q, i) => (i === 0 ? qx(q) : `\\xrightarrow{${labels[i - 1]}} ${qx(q)}`)).join(" ");

/** DFA_NOTE explains the table notation for DFAs. */
const DFA_NOTE = t("($\\to$ marks the start state and $*$ the accepting states.)", "（$\\to$ 标出初始状态，$*$ 标出接受状态。）");

/** pwr writes $n^k$, or plain $n$ for the first power. */
const pwr = (k: number): string => (k === 1 ? "n" : `n^{${k}}`);

/** pn writes $n^k$, plain $n$ for the first power and $1$ for the zeroth. */
const pn = (k: number): string => (k === 0 ? "1" : pwr(k));

/** mealyMachines runs finite-state transducers whose outputs belong to transitions. */
export const mealyMachines: TopicDef = {
  id: "mealy-machines",
  title: t("Mealy Machines", "Mealy 机"),
  summary: t(
    "A Mealy machine is a finite-state transducer: from each state, each input symbol leads to a next state and produces an output symbol. Reading an input string of length n produces an output string of length n.",
    "Mealy 机是一种有限状态转换器：在每个状态下，每个输入符号都导向一个下一状态并产生一个输出符号。读入长度为 n 的输入串产生长度为 n 的输出串。",
  ),
  intro: t(
    'Take a Mealy machine with start state $q_0$ whose row $q_0$ has $q_0/1$ under $0$ and $q_1/0$ under $1$, and whose row $q_1$ has $q_1/0$ under $0$ and $q_0/1$ under $1$; an entry $q_j/b$ means "go to $q_j$ and output $b$". On input $101$ it reads $1$ in $q_0$, outputs $0$ and moves to $q_1$; reads $0$ in $q_1$, outputs $0$ and stays there; reads $1$ in $q_1$, outputs $1$ and returns to $q_0$. The output is $001$ and the machine ends in $q_0$.\n\nCheck: the output has three symbols, one for each input symbol, and the three entries used, $q_1/0$, $q_1/0$ and $q_0/1$, give the outputs $0, 0, 1$ in that order.\n\nIn this lesson we run a Mealy machine on an input string, reading each table entry as a next state and an output, to find the output string and the state where the machine ends.',
    "取一个初始状态为 $q_0$ 的 Mealy 机：$q_0$ 行在 $0$ 列为 $q_0/1$，在 $1$ 列为 $q_1/0$；$q_1$ 行在 $0$ 列为 $q_1/0$，在 $1$ 列为 $q_0/1$；表项 $q_j/b$ 表示“转到 $q_j$ 并输出 $b$”。对输入 $101$，它在 $q_0$ 读入 $1$，输出 $0$ 并转到 $q_1$；在 $q_1$ 读入 $0$，输出 $0$ 并停留；在 $q_1$ 读入 $1$，输出 $1$ 并回到 $q_0$。输出为 $001$，机器停在 $q_0$。\n\n检验：输出有三个符号，每个输入符号对应一个；用到的三个表项 $q_1/0$、$q_1/0$、$q_0/1$ 依次给出输出 $0, 0, 1$。\n\n本课我们让 Mealy 机处理一个输入串，把每个表项读作下一状态和输出，求出输出串以及机器最终所处的状态。",
  ),
  prerequisites: ["introduction-to-logic-circuits"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "outputs-of-mealy-machines",
      title: t("The output string", "输出串"),
      explanation: t(
        "An entry $q_1/0$ in row $q_0$, column $1$ means: in state $q_0$, reading $1$, output $0$ and move to $q_1$. Follow the input symbol by symbol from the start state, writing down the outputs.\n\n> **Watch out.** The output belongs to the transition, so it comes from the row of the state being left, not the state reached. If row $q_0$ has $q_1/0$ under $1$, reading $1$ in $q_0$ outputs $0$, whatever row $q_1$ says.",
        "$q_0$ 行、$1$ 列中的 $q_1/0$ 表示：在状态 $q_0$ 读入 $1$ 时，输出 $0$ 并转到 $q_1$。从初始状态出发逐个读入符号，记下输出。\n\n> **注意。** 输出属于转移，所以它取自离开的那个状态所在的行，而不是到达的状态。若 $q_0$ 行在 $1$ 列为 $q_1/0$，则在 $q_0$ 读入 $1$ 输出 $0$，与 $q_1$ 行写的是什么无关。",
      ),
      generate(rng) {
        const m = randomMachine(rng, rng.int(2, 3));
        const w = randomWord(rng, rng.int(5, 7));
        const out = mealyOutput(m, w);
        const s = trace(m, w);
        const prev = s[s.length - 2]!;
        const last = s[s.length - 1]!;
        return stringChoice(
          rng,
          t(
            `A Mealy machine with start state $q_0$ has transition table $${mealyTable(m)}$, where $q_j/b$ means "go to $q_j$ and output $b$". What does it output on input $${w}$?`,
            `一个初始状态为 $q_0$ 的 Mealy 机的转移表为 $${mealyTable(m)}$，其中 $q_j/b$ 表示“转到 $q_j$ 并输出 $b$”。输入 $${w}$ 时它输出什么？`,
          ),
          out,
          [
            {
              s: mooreOutput(m, w).slice(1),
              why: t(
                "This takes each output from the row of the state reached, under $0$; the output comes from the entry actually used, in the row of the state being left.",
                "这是从到达的状态所在行的 $0$ 列取输出；输出应取自实际用到的表项，在离开的状态所在的行。",
              ),
            },
            {
              s: [...out].reverse().join(""),
              why: t(
                "This is the right output read backwards; the first symbol output belongs to the first symbol read.",
                "这是正确输出倒过来写；第一个输出的符号对应读入的第一个符号。",
              ),
            },
            {
              s: w,
              why: t("This is the input itself; the outputs are the symbols after the slashes.", "这是输入本身；输出是斜线后面的符号。"),
            },
          ],
          walked(
            [
              [
                ["Follow the run", "跟随运行过程"],
                t("Each arrow shows the symbol read and the symbol output:", "每个箭头标出读入的符号和输出的符号："),
                [
                  runTex(
                    s,
                    [...w].map((c, i) => `${c}/${out[i]}`),
                  ),
                ],
              ],
              [
                ["Collect the outputs", "收集输出"],
                t("Reading the outputs off the arrows in order gives", "按顺序读出箭头上的输出，得到"),
                [out],
              ],
            ],
            t(
              `The output has $${out.length}$ symbols, one for each of the $${w.length}$ input symbols, and the last arrow agrees with the table: row $${qx(prev)}$, column $${w[w.length - 1]}$ holds $${qx(last)}/${out[out.length - 1]}$.`,
              `输出有 $${out.length}$ 个符号，与 $${w.length}$ 个输入符号一一对应；最后一个箭头与转移表一致：$${qx(prev)}$ 行、$${w[w.length - 1]}$ 列为 $${qx(last)}/${out[out.length - 1]}$。`,
            ),
          ),
        );
      },
    },
    {
      id: "states-of-mealy-machines",
      title: t("The final state", "最终状态"),
      explanation: t(
        "The outputs do not affect the transitions: to find where the machine ends, follow only the next-state parts of the entries.\n\n> **Watch out.** Look up each step in the row of the current state, not of the start state. If row $q_0$ has $q_2/1$ under $1$ and row $q_2$ has $q_1/0$ under $1$, then reading $11$ ends in $q_1$, not $q_2$.",
        "输出不影响转移：要找出机器停在哪个状态，只需跟随表中各项的下一状态部分。\n\n> **注意。** 每一步都要在当前状态所在的行查找，而不是在初始状态的行。若 $q_0$ 行在 $1$ 列为 $q_2/1$，$q_2$ 行在 $1$ 列为 $q_1/0$，则读入 $11$ 后停在 $q_1$，而不是 $q_2$。",
      ),
      generate(rng) {
        const m = randomMachine(rng, 3);
        const w = randomWord(rng, rng.int(5, 8));
        const s = trace(m, w);
        const last = s[s.length - 1]!;
        const prev = s[s.length - 2]!;
        const c = w[w.length - 1]!;
        return numberProblem({
          prompt: t(
            `A Mealy machine with start state $q_0$ has transition table $${mealyTable(m)}$, where $q_j/b$ means "go to $q_j$ and output $b$". After reading $${w}$ it is in state $q_i$. Find $i$.`,
            `一个初始状态为 $q_0$ 的 Mealy 机的转移表为 $${mealyTable(m)}$，其中 $q_j/b$ 表示“转到 $q_j$ 并输出 $b$”。读入 $${w}$ 后它处于状态 $q_i$。求 $i$。`,
          ),
          answer: last,
          mistakes: apart(last, [
            slip(
              prev,
              `That is the state before the last symbol, $${c}$, is read; take one more step.`,
              `这是读入最后一个符号 $${c}$ 之前的状态；还要再走一步。`,
            ),
            slip(
              trace(m, [...w].reverse().join("")).pop()!,
              "That reads the input from right to left; the machine reads it from the first symbol.",
              "这是从右往左读输入得到的；机器从第一个符号开始读。",
            ),
            slip(
              trace(m, w.slice(1)).pop()!,
              "That skips the first symbol: the run starts in $q_0$ before any symbol is read.",
              "这跳过了第一个符号：运行在读入任何符号之前从 $q_0$ 开始。",
            ),
            ...range(0, 2).map((x) =>
              slip(
                x,
                `The run does not end in $${qx(x)}$; follow only the next-state part of each entry, one symbol at a time.`,
                `运行并不停在 $${qx(x)}$；只跟随每一项的下一状态部分，一次一个符号。`,
              ),
            ),
          ]),
          solution: walked(
            [
              [
                ["Follow the next states", "跟随下一状态"],
                t("Ignore the outputs and follow the state part of each entry:", "忽略输出，只跟随每一项的状态部分："),
                [runTex(s, [...w])],
              ],
              [
                ["Read off the last state", "读出最后的状态"],
                t(`The run ends in $${qx(last)}$, so $i = ${last}$.`, `运行停在 $${qx(last)}$，所以 $i = ${last}$。`),
              ],
            ],
            t(
              `The run lists $${s.length}$ states for the $${w.length}$ symbols, and its last step agrees with the table: row $${qx(prev)}$, column $${c}$ starts with $${qx(last)}$.`,
              `运行列出了 $${s.length}$ 个状态，对应 $${w.length}$ 个符号；最后一步与转移表一致：$${qx(prev)}$ 行、$${c}$ 列的表项以 $${qx(last)}$ 开头。`,
            ),
          ),
        });
      },
    },
  ],
};

/** mooreMachines runs finite-state transducers whose outputs belong to states. */
export const mooreMachines: TopicDef = {
  id: "moore-machines",
  title: t("Moore Machines", "Moore 机"),
  summary: t(
    "A Moore machine attaches an output symbol to each state rather than to each transition. It outputs the symbol of every state it is in, including the start state, so an input of length n produces an output of length n + 1.",
    "Moore 机把输出符号附在每个状态上，而不是每个转移上。它输出所处的每个状态的符号（包括初始状态），所以长度为 n 的输入产生长度为 n + 1 的输出。",
  ),
  intro: t(
    "Take a Moore machine with start state $q_0$ of output $0$ and a state $q_1$ of output $1$, where reading $0$ always leads to $q_0$ and reading $1$ always leads to $q_1$. On input $011$ it is in $q_0$, then $q_0$, $q_1$ and $q_1$, so it outputs $0$, $0$, $1$, $1$: the output is $0011$.\n\nCheck: the input has three symbols and the output four, one for each state the machine is in, starting with the output of $q_0$ before anything is read.\n\nIn this lesson we run a Moore machine on an input string, writing the output of each state it passes through, and count the symbols of its output.",
    "取一个 Moore 机：初始状态 $q_0$ 的输出为 $0$，状态 $q_1$ 的输出为 $1$，读入 $0$ 总是转到 $q_0$，读入 $1$ 总是转到 $q_1$。对输入 $011$，它依次处于 $q_0$、$q_0$、$q_1$、$q_1$，所以输出 $0$、$0$、$1$、$1$：输出为 $0011$。\n\n检验：输入有三个符号，输出有四个，机器所处的每个状态对应一个，最先是读入任何符号之前 $q_0$ 的输出。\n\n本课我们让 Moore 机处理一个输入串，写出它经过的每个状态的输出，并数一数输出中的符号。",
  ),
  prerequisites: ["mealy-machines"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "outputs-of-moore-machines",
      title: t("The output string", "输出串"),
      explanation: t(
        "Write the output of $q_0$, then after each input symbol write the output of the state reached. On input $011$ a Moore machine passes through four states and outputs four symbols.\n\n> **Watch out.** The start state's output comes first, before any symbol is read, so the output is one symbol longer than the input. On input $01$ with the run $q_0 \\to q_0 \\to q_1$ and outputs $0$, $0$, $1$, the output is $001$, not $01$.",
        "先写出 $q_0$ 的输出，然后每读入一个符号，写出到达的状态的输出。对输入 $011$，Moore 机经过四个状态，输出四个符号。\n\n> **注意。** 初始状态的输出在读入任何符号之前就写出，所以输出比输入多一个符号。对输入 $01$，若运行为 $q_0 \\to q_0 \\to q_1$，输出依次为 $0$、$0$、$1$，则输出为 $001$，而不是 $01$。",
      ),
      generate(rng) {
        const m = randomMachine(rng, rng.int(2, 3));
        const w = randomWord(rng, rng.int(4, 6));
        const out = mooreOutput(m, w);
        const s = trace(m, w);
        return stringChoice(
          rng,
          t(
            `A Moore machine with start state $q_0$ has transition table $${mooreTable(m)}$. It outputs the symbol of each state it is in, starting with $q_0$. What does it output on input $${w}$?`,
            `一个初始状态为 $q_0$ 的 Moore 机的转移表为 $${mooreTable(m)}$。它输出所处的每个状态的符号，从 $q_0$ 开始。输入 $${w}$ 时它输出什么？`,
          ),
          out,
          [
            {
              s: out.slice(1),
              why: t(
                "This leaves out the output of the start state $q_0$, which comes before any symbol is read.",
                "这漏掉了初始状态 $q_0$ 的输出，它在读入任何符号之前就写出。",
              ),
            },
            {
              s: out.slice(0, -1),
              why: t(
                "This stops one state early: the state reached by the last symbol also outputs.",
                "这少写了一个状态：读入最后一个符号后到达的状态也要输出。",
              ),
            },
            {
              s: `${out.slice(1)}${out[0]}`,
              why: t("This moves the output of $q_0$ to the end, but it comes first.", "这把 $q_0$ 的输出移到了末尾，但它应该在最前面。"),
            },
          ],
          walked(
            [
              [
                ["Follow the run", "跟随运行过程"],
                t("Start in $q_0$ and look up one entry per symbol:", "从 $q_0$ 开始，每个符号查一次表："),
                [runTex(s, [...w])],
              ],
              [
                ["Write each state's output", "写出每个状态的输出"],
                t("Read the output column for every state of the run, $q_0$ included:", "对运行中的每个状态（包括 $q_0$）读出输出列："),
                [s.map((q) => `${qx(q)} \\mapsto ${m.out[q]![0]}`).join(",\\ ")],
              ],
              [["Join them", "连起来"], none, [out]],
            ],
            t(
              `The output has $${out.length}$ symbols for the $${w.length}$ input symbols, one more, since $q_0$ outputs before anything is read.`,
              `输出有 $${out.length}$ 个符号，比 $${w.length}$ 个输入符号多一个，因为 $q_0$ 在读入任何符号之前就输出。`,
            ),
          ),
        );
      },
    },
    {
      id: "counting-outputs-of-moore-machines",
      title: t("Counting output symbols", "数输出符号"),
      explanation: t(
        "Each state visited contributes its output once, so count how many of the visited states (with repetition, and including $q_0$) have output $1$.\n\n> **Watch out.** A state visited twice outputs twice, and $q_0$ counts before any symbol is read. With outputs $1$ for $q_0$ and $0$ for $q_1$, the run $q_0 \\to q_1 \\to q_0$ outputs $101$, which has two $1$s, not one.",
        "每个经过的状态贡献一次它的输出，所以数一数经过的状态（计重复，含 $q_0$）中有多少个的输出为 $1$。\n\n> **注意。** 经过两次的状态输出两次，而 $q_0$ 在读入任何符号之前就要计入。若 $q_0$ 的输出为 $1$，$q_1$ 的输出为 $0$，则运行 $q_0 \\to q_1 \\to q_0$ 输出 $101$，其中有两个 $1$，而不是一个。",
      ),
      generate(rng) {
        let m: Machine;
        let w: string;
        let out: string;
        let ones: number;
        let mistakes: Mistake[];
        do {
          const mm = randomMachine(rng, 3);
          const ww = randomWord(rng, rng.int(6, 9));
          const oo = mooreOutput(mm, ww);
          const n1 = countOnes(oo);
          m = mm;
          w = ww;
          out = oo;
          ones = n1;
          mistakes = apart(n1, [
            slip(
              n1 - Number(oo[0]),
              "That leaves out the output of the start state $q_0$, written before any symbol is read.",
              "这漏掉了初始状态 $q_0$ 的输出，它在读入任何符号之前就写出。",
            ),
            slip(n1 - Number(oo[oo.length - 1]), "That leaves out the output of the last state reached.", "这漏掉了最后到达的状态的输出。"),
            slip(oo.length - n1, "That counts the $0$s of the output instead of the $1$s.", "这数的是输出中的 $0$，而不是 $1$。"),
            slip(countOnes(ww), "That counts the $1$s of the input, not of the output.", "这数的是输入中的 $1$，而不是输出中的。"),
            slip(oo.length, "That counts every output symbol, $0$s and $1$s alike.", "这把所有输出符号都数了，$0$ 和 $1$ 都算在内。"),
          ]);
        } while (!out.includes("0") || !out.includes("1") || mistakes.length < 2);
        const s = trace(m, w);
        return numberProblem({
          prompt: t(
            `A Moore machine with start state $q_0$ has transition table $${mooreTable(m)}$. It outputs the symbol of each state it is in, starting with $q_0$. How many $1$s does it output on input $${w}$?`,
            `一个初始状态为 $q_0$ 的 Moore 机的转移表为 $${mooreTable(m)}$。它输出所处的每个状态的符号，从 $q_0$ 开始。输入 $${w}$ 时它输出多少个 $1$？`,
          ),
          answer: ones,
          mistakes,
          solution: walked(
            [
              [
                ["Follow the run", "跟随运行过程"],
                t("Start in $q_0$ and look up one entry per symbol:", "从 $q_0$ 开始，每个符号查一次表："),
                [runTex(s, [...w])],
              ],
              [
                ["Write the outputs", "写出输出"],
                t(
                  "Each state of the run, $q_0$ included, outputs the symbol in its output column:",
                  "运行中的每个状态（包括 $q_0$）输出它的输出列中的符号：",
                ),
                [out],
              ],
              [["Count the ones", "数 1 的个数"], t(`The output $${out}$ has $${ones}$ ones.`, `输出 $${out}$ 中有 $${ones}$ 个 $1$。`)],
            ],
            t(
              `It also has $${out.length - ones}$ zeros, and $${ones} + ${out.length - ones} = ${out.length}$, one more than the $${w.length}$ input symbols, as a Moore machine's output should be.`,
              `它还有 $${out.length - ones}$ 个 $0$，而 $${ones} + ${out.length - ones} = ${out.length}$，比 $${w.length}$ 个输入符号多一个，正符合 Moore 机的输出长度。`,
            ),
          ),
        });
      },
    },
  ],
};

/** deterministicFiniteAutomata runs DFAs and decides acceptance. */
export const deterministicFiniteAutomata: TopicDef = {
  id: "deterministic-finite-automata",
  title: t("Deterministic Finite Automata", "确定性有限自动机"),
  summary: t(
    "A deterministic finite automaton (DFA) has a finite set of states, a start state, a set of accepting states and a transition function giving exactly one next state for each state and input symbol. It accepts a string if reading it from the start state ends in an accepting state.",
    "确定性有限自动机（DFA）有有限个状态、一个初始状态、一组接受状态和一个转移函数，转移函数对每个状态和输入符号恰好给出一个下一状态。若从初始状态读完一个串后停在接受状态，则 DFA 接受该串。",
  ),
  intro: t(
    "Take a DFA with start state $q_0$ and one accepting state $q_1$, where reading $0$ leads to $q_0$ and reading $1$ leads to $q_1$ from either state. On $0110$ the run is $q_0 \\to q_0 \\to q_1 \\to q_1 \\to q_0$. It passes through $q_1$, but it ends in $q_0$, so the DFA rejects $0110$.\n\nCheck: this DFA is in $q_1$ exactly when the last symbol read is $1$, and $0110$ ends in $0$, so rejecting it is right.\n\nIn this lesson we run a DFA on a string one symbol at a time, find the state it ends in, and decide from that state alone whether it accepts.",
    "取一个 DFA，初始状态为 $q_0$，唯一的接受状态为 $q_1$，从任一状态读入 $0$ 都转到 $q_0$，读入 $1$ 都转到 $q_1$。对 $0110$，运行过程为 $q_0 \\to q_0 \\to q_1 \\to q_1 \\to q_0$。它途中经过 $q_1$，但停在 $q_0$，所以 DFA 拒绝 $0110$。\n\n检验：这个 DFA 处于 $q_1$ 当且仅当最后读入的符号是 $1$，而 $0110$ 以 $0$ 结尾，所以拒绝它是对的。\n\n本课我们让 DFA 逐个符号处理一个串，求出它停在的状态，并仅凭这个状态判断它是否接受。",
  ),
  prerequisites: ["mealy-machines"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "deciding-acceptance-by-a-dfa",
      title: t("Acceptance", "接受"),
      explanation: t(
        "Follow the string from the start state. Only the last state matters: the DFA accepts if it is accepting, even if the run passed through accepting states earlier.\n\n> **Watch out.** Passing through an accepting state on the way proves nothing. With $q_1$ accepting and $q_0$ not, the run $q_0 \\to q_1 \\to q_0$ rejects, because it ends in $q_0$.",
        "从初始状态出发跟随该串。只有最后的状态重要：若它是接受状态则 DFA 接受，即使途中曾经过接受状态也不影响。\n\n> **注意。** 途中经过接受状态说明不了什么。若 $q_1$ 是接受状态而 $q_0$ 不是，则运行 $q_0 \\to q_1 \\to q_0$ 被拒绝，因为它停在 $q_0$。",
      ),
      generate(rng) {
        const m = randomMachine(rng, rng.int(3, 4));
        const w = randomWord(rng, rng.int(4, 7));
        const s = trace(m, w);
        const last = s[s.length - 1]!;
        const accepted = m.accept[last]!;
        const states = range(0, m.k - 1);
        return verdictChoice(rng, {
          prompt: t(
            `A DFA has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} Does it accept $${w}$?`,
            `一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}它接受 $${w}$ 吗？`,
          ),
          holds: accepted,
          yes: t(
            `the run ends in the accepting state $${qx(accepted ? last : states.find((q) => m.accept[q])!)}$`,
            `运行停在接受状态 $${qx(accepted ? last : states.find((q) => m.accept[q])!)}$`,
          ),
          no: t(
            `the run ends in $${qx(accepted ? states.find((q) => !m.accept[q])! : last)}$, which is not accepting`,
            `运行停在 $${qx(accepted ? states.find((q) => !m.accept[q])! : last)}$，它不是接受状态`,
          ),
          yesWrong: t("the run passes through an accepting state along the way", "运行途中经过了接受状态"),
          noWrong: t(`the run does not end in the start state $${qx(0)}$`, `运行没有停在初始状态 $${qx(0)}$`),
          solution: walked(
            [
              [
                ["Follow the run", "跟随运行过程"],
                t("Start in $q_0$ and look up one entry per symbol:", "从 $q_0$ 开始，每个符号查一次表："),
                [runTex(s, [...w])],
              ],
              [
                ["Look at the last state", "看最后的状态"],
                t(
                  `The run ends in $${qx(last)}$, which ${accepted ? "is marked $*$, so the DFA accepts" : "has no $*$, so the DFA rejects"} $${w}$.`,
                  `运行停在 $${qx(last)}$，它${accepted ? "标有 $*$，所以 DFA 接受" : "没有标 $*$，所以 DFA 拒绝"} $${w}$。`,
                ),
              ],
            ],
            t(
              `The run has $${s.length}$ states for the $${w.length}$ symbols, so no symbol was skipped, and only its last state decides, whatever states it passed through.`,
              `运行有 $${s.length}$ 个状态，对应 $${w.length}$ 个符号，没有漏掉符号；而且只由最后的状态决定，与途中经过哪些状态无关。`,
            ),
          ),
        });
      },
    },
    {
      id: "final-states-of-a-dfa",
      title: t("The final state", "最终状态"),
      explanation: t(
        "Each symbol moves the DFA to exactly one state, so the state after reading a string is determined. Process the symbols one at a time, looking up row (current state), column (symbol).\n\n> **Watch out.** Every lookup uses the row of the current state, not the start state. If $\\delta(q_0, 1) = q_2$ and $\\delta(q_2, 1) = q_3$, reading $11$ ends in $q_3$, not $q_2$.",
        "每个符号把 DFA 带到唯一的状态，所以读完一个串后的状态是确定的。逐个处理符号，查找“当前状态”行、“符号”列。\n\n> **注意。** 每次查表都用当前状态所在的行，而不是初始状态的行。若 $\\delta(q_0, 1) = q_2$，$\\delta(q_2, 1) = q_3$，则读入 $11$ 后停在 $q_3$，而不是 $q_2$。",
      ),
      generate(rng) {
        const k = 4;
        const m = randomMachine(rng, k);
        const w = randomWord(rng, rng.int(6, 9));
        const s = trace(m, w);
        const last = s[s.length - 1]!;
        const prev = s[s.length - 2]!;
        const c = w[w.length - 1]!;
        const swapped = [...w].map((x) => (x === "0" ? "1" : "0")).join("");
        return numberProblem({
          prompt: t(
            `A DFA has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} After reading $${w}$ it is in state $q_i$. Find $i$.`,
            `一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}读入 $${w}$ 后它处于状态 $q_i$。求 $i$。`,
          ),
          answer: last,
          mistakes: apart(last, [
            slip(
              prev,
              `That is the state before the last symbol, $${c}$, is read; take one more step.`,
              `这是读入最后一个符号 $${c}$ 之前的状态；还要再走一步。`,
            ),
            slip(
              trace(m, [...w].reverse().join("")).pop()!,
              "That reads the string from right to left; the DFA reads it from the first symbol.",
              "这是从右往左读串得到的；DFA 从第一个符号开始读。",
            ),
            slip(
              trace(m, swapped).pop()!,
              "That swaps the columns, reading each $0$ as $1$ and each $1$ as $0$.",
              "这把两列弄反了，把每个 $0$ 当成 $1$、每个 $1$ 当成 $0$。",
            ),
            slip(
              trace(m, w.slice(1)).pop()!,
              "That skips the first symbol: the run starts in $q_0$ before any symbol is read.",
              "这跳过了第一个符号：运行在读入任何符号之前从 $q_0$ 开始。",
            ),
            ...range(0, k - 1).map((x) =>
              slip(
                x,
                `The run does not end in $${qx(x)}$; look up one entry per symbol, always in the row of the current state.`,
                `运行并不停在 $${qx(x)}$；每个符号查一次表，并且总是在当前状态所在的行查。`,
              ),
            ),
          ]),
          solution: walked(
            [
              [
                ["Follow the run", "跟随运行过程"],
                t("Start in $q_0$ and look up one entry per symbol:", "从 $q_0$ 开始，每个符号查一次表："),
                [runTex(s, [...w])],
              ],
              [
                ["Read off the last state", "读出最后的状态"],
                t(`The run ends in $${qx(last)}$, so $i = ${last}$.`, `运行停在 $${qx(last)}$，所以 $i = ${last}$。`),
              ],
            ],
            t(
              `The last step agrees with the table: row $${qx(prev)}$, column $${c}$ holds $${qx(last)}$, and the run has $${s.length}$ states for the $${w.length}$ symbols.`,
              `最后一步与转移表一致：$${qx(prev)}$ 行、$${c}$ 列为 $${qx(last)}$；运行有 $${s.length}$ 个状态，对应 $${w.length}$ 个符号。`,
            ),
          ),
        });
      },
    },
  ],
};

/** remainderMachine is the DFA whose state is the remainder mod m of the binary number read so far. */
const remainderMachine = (m: number): Machine => ({
  k: m,
  delta: range(0, m - 1).map((r) => [(2 * r) % m, (2 * r + 1) % m]),
  out: range(0, m - 1).map(() => [0, 0]),
  accept: range(0, m - 1).map((r) => r === 0),
});

/** processingStringsUsingDeterministicFiniteAutomata follows DFAs that track remainders and acceptance along a string. */
export const processingStringsUsingDeterministicFiniteAutomata: TopicDef = {
  id: "processing-strings-using-deterministic-finite-automata",
  title: t("Processing Strings Using Deterministic Finite Automata", "用确定性有限自动机处理字符串"),
  summary: t(
    "A DFA's state summarizes everything it needs to remember about the input so far. For example, a DFA reading a binary number from its most significant bit can track its remainder mod m: reading bit b moves from remainder r to (2r + b) mod m.",
    "DFA 的状态概括了它对目前输入需要记住的全部信息。例如，从最高位读入二进制数的 DFA 可以追踪它模 m 的余数：读入位 b 时，余数从 r 变为 (2r + b) mod m。",
  ),
  intro: t(
    "Take the DFA with states $q_0, q_1, q_2$ and $\\delta(q_r, b) = q_{(2r + b) \\bmod 3}$, so its state is the remainder mod $3$ of the binary number read so far. On $110$: reading $1$ from $q_0$ gives $(2 \\cdot 0 + 1) \\bmod 3 = 1$, reading $1$ from $q_1$ gives $(2 \\cdot 1 + 1) \\bmod 3 = 0$, and reading $0$ from $q_0$ gives $0$. The run is $q_0 \\to q_1 \\to q_0 \\to q_0$, so $110_2$ leaves remainder $0$.\n\nCheck: $110_2 = 6 = 2 \\cdot 3$, which is indeed divisible by $3$.\n\nIn this lesson we follow DFAs whose states carry a meaning, such as a remainder, and watch a run step by step to find which prefixes of a string the DFA accepts.",
    "取状态为 $q_0, q_1, q_2$、转移为 $\\delta(q_r, b) = q_{(2r + b) \\bmod 3}$ 的 DFA，它的状态就是已读二进制数模 $3$ 的余数。对 $110$：在 $q_0$ 读入 $1$ 得 $(2 \\cdot 0 + 1) \\bmod 3 = 1$，在 $q_1$ 读入 $1$ 得 $(2 \\cdot 1 + 1) \\bmod 3 = 0$，在 $q_0$ 读入 $0$ 得 $0$。运行过程为 $q_0 \\to q_1 \\to q_0 \\to q_0$，所以 $110_2$ 的余数为 $0$。\n\n检验：$110_2 = 6 = 2 \\cdot 3$，确实能被 $3$ 整除。\n\n本课我们跟随状态带有含义（例如余数）的 DFA，并逐步观察运行过程，找出 DFA 接受一个串的哪些前缀。",
  ),
  prerequisites: ["deterministic-finite-automata", "binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "remainder-automata",
      title: t("Tracking remainders", "追踪余数"),
      explanation: t(
        "Reading a binary digit doubles the number so far and adds the digit, so an automaton can track just the remainder after each digit. In the DFA with $\\delta(q_r, b) = q_{(2r + b) \\bmod 3}$, reading $1101$ goes $q_0 \\to q_1 \\to q_0 \\to q_0 \\to q_1$. Indeed $1101_2 = 13$ and $13 \\bmod 3 = 1$.\n\n> **Watch out.** Each step doubles the remainder before adding the digit, because the digits are read from the most significant end. From $q_2$ with modulus $5$, reading $1$ gives $q_{(2 \\cdot 2 + 1) \\bmod 5} = q_0$, not $q_{(2 + 1) \\bmod 5} = q_3$.",
        "读入一个二进制位相当于把已读的数加倍再加上这一位，所以自动机只需记录每读一位后的余数。在 $\\delta(q_r, b) = q_{(2r + b) \\bmod 3}$ 的 DFA 中，读入 $1101$ 依次经过 $q_0 \\to q_1 \\to q_0 \\to q_0 \\to q_1$。确实 $1101_2 = 13$，$13 \\bmod 3 = 1$。\n\n> **注意。** 因为是从最高位开始读，每一步都要先把余数加倍再加上这一位。模为 $5$ 时，在 $q_2$ 读入 $1$ 得 $q_{(2 \\cdot 2 + 1) \\bmod 5} = q_0$，而不是 $q_{(2 + 1) \\bmod 5} = q_3$。",
      ),
      generate(rng) {
        const mod = rng.int(3, 7);
        const m = remainderMachine(mod);
        const w = `1${randomWord(rng, rng.int(4, 7))}`;
        const value = Number.parseInt(w, 2);
        const s = trace(m, w);
        const r = value % mod;
        const quotient = Math.floor(value / mod);
        return numberProblem({
          prompt: t(
            `A DFA has states $q_0, \\dots, q_{${mod - 1}}$, start state $q_0$, and transitions $\\delta(q_r, b) = q_{(2r + b) \\bmod ${mod}}$. After reading $${w}$ it is in state $q_i$. Find $i$.`,
            `一个 DFA 的状态为 $q_0, \\dots, q_{${mod - 1}}$，初始状态为 $q_0$，转移为 $\\delta(q_r, b) = q_{(2r + b) \\bmod ${mod}}$。读入 $${w}$ 后它处于状态 $q_i$。求 $i$。`,
          ),
          answer: s[s.length - 1]!,
          mistakes: apart(r, [
            slip(
              Number.parseInt([...w].reverse().join(""), 2) % mod,
              "That reads the number from its last digit; the DFA reads the most significant digit first.",
              "这是从最后一位开始读这个数；DFA 先读最高位。",
            ),
            slip(
              s[s.length - 2]!,
              "That is the state before the last digit is read; take one more step.",
              "这是读入最后一位之前的状态；还要再走一步。",
            ),
            slip(
              countOnes(w) % mod,
              "That adds the digits without doubling: each step must double the remainder before adding the digit.",
              "这只把各位相加而没有加倍：每一步都要先把余数加倍再加上这一位。",
            ),
            slip(
              value,
              `That is the number $${w}_2 = ${value}$ itself; the state is its remainder mod $${mod}$.`,
              `这是数 $${w}_2 = ${value}$ 本身；状态是它模 $${mod}$ 的余数。`,
            ),
            slip(quotient, "That is the quotient of the division, not the remainder.", "这是除法的商，而不是余数。"),
          ]),
          solution: walked(
            [
              [
                ["Apply the rule digit by digit", "逐位运用规则"],
                t(
                  `Each digit $b$ takes remainder $r$ to $(2r + b) \\bmod ${mod}$:`,
                  `每一位 $b$ 把余数 $r$ 变为 $(2r + b) \\bmod ${mod}$：`,
                ),
                [...w].map((b, i) => `${qx(s[i]!)} \\xrightarrow{${b}} q_{(2 \\cdot ${s[i]} + ${b}) \\bmod ${mod}} = ${qx(s[i + 1]!)}`),
              ],
              [
                ["Read off the last state", "读出最后的状态"],
                t(`The run ends in $${qx(r)}$, so $i = ${r}$.`, `运行停在 $${qx(r)}$，所以 $i = ${r}$。`),
              ],
            ],
            t(
              `$${w}_2 = ${value} = ${mod} \\cdot ${quotient} + ${r}$, so the remainder of the whole number is $${r}$, the index of the last state.`,
              `$${w}_2 = ${value} = ${mod} \\cdot ${quotient} + ${r}$，所以整个数的余数为 $${r}$，正是最后状态的下标。`,
            ),
          ),
        });
      },
    },
    {
      id: "first-acceptance-while-processing-a-string",
      title: t("Following a run", "跟随运行过程"),
      explanation: t(
        "The prefixes of a string that a DFA accepts are found by watching the run: the DFA accepts the first $k$ symbols exactly when it is in an accepting state after step $k$.\n\n> **Watch out.** The prefix of length $k$ ends at the state after step $k$, which is entry $k + 1$ of the run because the run starts with $q_0$. In the run $q_0 \\to q_2 \\to q_1$ with only $q_1$ accepting, the shortest accepted prefix has length $2$, not $3$.",
        "观察运行过程就能找出 DFA 接受的前缀：DFA 接受前 $k$ 个符号，当且仅当第 $k$ 步之后它处于接受状态。\n\n> **注意。** 长度为 $k$ 的前缀对应第 $k$ 步之后的状态，因为运行以 $q_0$ 开头，它是运行中的第 $k + 1$ 个状态。在运行 $q_0 \\to q_2 \\to q_1$ 中，若只有 $q_1$ 是接受状态，则被接受的最短前缀长度为 $2$，而不是 $3$。",
      ),
      generate(rng) {
        let m: Machine;
        let w: string;
        let s: number[];
        let k: number;
        do {
          m = randomMachine(rng, rng.int(3, 4));
          w = randomWord(rng, rng.int(6, 8));
          s = trace(m, w);
          const mm = m;
          k = s.findIndex((q, i) => i > 0 && mm.accept[q]);
        } while (k < 2 || m.accept[0]);
        const mm = m;
        const hits = range(1, w.length).filter((i) => mm.accept[s[i]!]);
        return numberProblem({
          prompt: t(
            `A DFA has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} What is the length of the shortest nonempty prefix of $${w}$ that it accepts?`,
            `一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}它接受的 $${w}$ 的最短非空前缀的长度是多少？`,
          ),
          answer: k,
          mistakes: apart(k, [
            slip(
              k - 1,
              "That counts the steps before the one that reaches the accepting state; the prefix includes the symbol read on that step.",
              "这数的是到达接受状态那一步之前的步数；前缀还包括那一步读入的符号。",
            ),
            slip(
              k + 1,
              "That counts the states of the run up to the accepting one, $q_0$ included; the prefix has one symbol fewer.",
              "这数的是运行中到接受状态为止的状态个数（含 $q_0$）；前缀的符号比它少一个。",
            ),
            slip(
              hits[hits.length - 1]!,
              "That is the longest accepted prefix; the question asks for the shortest.",
              "这是被接受的最长前缀；题目问的是最短的。",
            ),
            slip(
              hits.length,
              "That counts how often the run is in an accepting state, not when it first gets there.",
              "这数的是运行处于接受状态的次数，而不是第一次到达的时刻。",
            ),
            slip(
              w.length,
              "That is the length of the whole string; a shorter prefix is accepted first.",
              "这是整个串的长度；更短的前缀已经先被接受了。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Follow the run", "跟随运行过程"],
                t("Start in $q_0$ and look up one entry per symbol:", "从 $q_0$ 开始，每个符号查一次表："),
                [runTex(s, [...w])],
              ],
              [
                ["Find the first accepting state", "找到第一个接受状态"],
                t(
                  `The first state after $q_0$ that is marked $*$ is $${qx(s[k]!)}$, reached after step $${k}$.`,
                  `$q_0$ 之后第一个标有 $*$ 的状态是 $${qx(s[k]!)}$，在第 $${k}$ 步之后到达。`,
                ),
              ],
            ],
            t(
              `The prefix $${w.slice(0, k)}$ has $${k}$ symbols and its run $${traceTex(s.slice(0, k + 1))}$ ends in an accepting state, while the states after steps $1$ to $${k - 1}$ are not accepting.`,
              `前缀 $${w.slice(0, k)}$ 有 $${k}$ 个符号，它的运行 $${traceTex(s.slice(0, k + 1))}$ 停在接受状态，而第 $1$ 到第 $${k - 1}$ 步之后的状态都不是接受状态。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Nfa is a nondeterministic automaton over {0, 1} starting in q₀; delta[q][b] is a set of states. */
interface Nfa {
  readonly k: number;
  readonly delta: readonly (readonly (readonly number[])[])[];
  readonly accept: readonly boolean[];
}

/** randomNfa builds a random NFA with k states. */
function randomNfa(rng: Rng, k: number): Nfa {
  const accepting = rng.sample(range(1, k - 1), rng.int(1, k - 2));
  const set = () => rng.sample(range(0, k - 1), rng.pick([0, 1, 1, 1, 2, 2])).sort((a, b) => a - b);
  return { k, delta: range(0, k - 1).map(() => [set(), set()]), accept: range(0, k - 1).map((q) => accepting.includes(q)) };
}

/** nfaSets returns the sets of possible states while reading w. */
function nfaSets(m: Nfa, w: string): number[][] {
  const sets = [[0]];
  for (const c of w) {
    const next = new Set<number>();
    for (const q of sets[sets.length - 1]!) for (const r of m.delta[q]![Number(c)]!) next.add(r);
    sets.push([...next].sort((a, b) => a - b));
  }
  return sets;
}

/** stateSetTex writes a set of states. */
const stateSetTex = (s: readonly number[]) => (s.length === 0 ? "\\varnothing" : `\\{${s.map(qx).join(", ")}\\}`);

/** setsTex writes the sets of possible states with each arrow labelled by the symbol read. */
const setsTex = (sets: readonly (readonly number[])[], w: string) =>
  sets.map((S, i) => (i === 0 ? stateSetTex(S) : `\\xrightarrow{${w[i - 1]}} ${stateSetTex(S)}`)).join(" ");

/** nfaTable writes the transition table of an NFA. */
const nfaTable = (m: Nfa) =>
  `\\begin{array}{c|cc} & 0 & 1 \\\\ \\hline ${range(0, m.k - 1)
    .map(
      (q) =>
        `${q === 0 ? "\\to " : ""}${m.accept[q] ? "{*}" : ""}${qx(q)} & ${stateSetTex(m.delta[q]![0]!)} & ${stateSetTex(m.delta[q]![1]!)}`,
    )
    .join(" \\\\ ")} \\end{array}`;

/** acceptingBranch finds one run of an NFA on w that ends in the given state, walking the sets backwards. */
function acceptingBranch(m: Nfa, w: string, sets: readonly (readonly number[])[], end: number): number[] {
  const path = [end];
  for (let i = w.length; i > 0; i--) {
    const q = path[0]!;
    path.unshift(sets[i - 1]!.find((p) => m.delta[p]![Number(w[i - 1])]!.includes(q))!);
  }
  return path;
}

/** nondeterministicFiniteAutomata tracks the sets of states an NFA can be in. */
export const nondeterministicFiniteAutomata: TopicDef = {
  id: "nondeterministic-finite-automata",
  title: t("Nondeterministic Finite Automata", "非确定性有限自动机"),
  summary: t(
    "In a nondeterministic finite automaton (NFA) a state and symbol lead to a set of possible next states, possibly empty. Track the set of all states the NFA could be in; it accepts a string if that final set contains an accepting state.",
    "在非确定性有限自动机（NFA）中，一个状态和一个符号导向一组可能的下一状态（可能为空）。追踪 NFA 可能处于的所有状态构成的集合；若最终的集合含有接受状态，则它接受该串。",
  ),
  intro: t(
    "Take an NFA with start state $q_0$ and accepting state $q_1$, where $\\delta(q_0, 0) = \\{q_0\\}$, $\\delta(q_0, 1) = \\{q_0, q_1\\}$ and $q_1$ has no moves at all. On $011$ the sets of possible states are $\\{q_0\\} \\to \\{q_0\\} \\to \\{q_0, q_1\\} \\to \\{q_0, q_1\\}$: on the last $1$, $q_0$ leads to $\\{q_0, q_1\\}$ and $q_1$ leads nowhere. The final set contains $q_1$, so the NFA accepts $011$.\n\nCheck: one branch is $q_0 \\to q_0 \\to q_0 \\to q_1$, which reads $0$, $1$, $1$ using allowed moves and ends in the accepting state $q_1$.\n\nIn this lesson we track the set of all states an NFA could be in while reading a string, and decide acceptance from the final set.",
    "取一个 NFA，初始状态为 $q_0$，接受状态为 $q_1$，$\\delta(q_0, 0) = \\{q_0\\}$，$\\delta(q_0, 1) = \\{q_0, q_1\\}$，而 $q_1$ 没有任何移动。对 $011$，可能状态的集合依次为 $\\{q_0\\} \\to \\{q_0\\} \\to \\{q_0, q_1\\} \\to \\{q_0, q_1\\}$：读最后一个 $1$ 时，$q_0$ 导向 $\\{q_0, q_1\\}$，$q_1$ 无处可去。最终的集合含有 $q_1$，所以 NFA 接受 $011$。\n\n检验：有一个分支 $q_0 \\to q_0 \\to q_0 \\to q_1$，它用允许的移动依次读入 $0$、$1$、$1$，停在接受状态 $q_1$。\n\n本课我们在读串的过程中追踪 NFA 可能处于的所有状态构成的集合，并由最终的集合判断是否接受。",
  ),
  prerequisites: ["deterministic-finite-automata", "power-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sets-of-states-of-an-nfa",
      title: t("Sets of states", "状态集"),
      explanation: t(
        "Start with $\\{q_0\\}$. For each symbol, the new set is the union of the table entries for every state in the current set. A branch with no move simply dies.\n\n> **Watch out.** Take the union over the whole current set, and count a state reached twice only once. From $\\{q_0, q_1\\}$ with $\\delta(q_0, 1) = \\{q_2\\}$ and $\\delta(q_1, 1) = \\{q_2\\}$, the next set is $\\{q_2\\}$: one state, not two.",
        "从 $\\{q_0\\}$ 开始。对每个符号，新的集合是当前集合中每个状态对应表项的并集。无法移动的分支直接消失。\n\n> **注意。** 要对整个当前集合取并集，而被到达两次的状态只算一次。从 $\\{q_0, q_1\\}$ 出发，若 $\\delta(q_0, 1) = \\{q_2\\}$，$\\delta(q_1, 1) = \\{q_2\\}$，则下一个集合为 $\\{q_2\\}$：一个状态，而不是两个。",
      ),
      generate(rng) {
        let m: Nfa;
        let w: string;
        let sets: number[][];
        let mistakes: Mistake[];
        do {
          const mm = randomNfa(rng, rng.int(3, 4));
          const ww = randomWord(rng, rng.int(3, 5));
          const ss = nfaSets(mm, ww);
          const fin = ss[ss.length - 1]!;
          const before = ss[ss.length - 2]!;
          const c = Number(ww[ww.length - 1]);
          m = mm;
          w = ww;
          sets = ss;
          mistakes = apart(fin.length, [
            slip(
              before.length,
              "That is the number of possible states before the last symbol is read; take one more step.",
              "这是读入最后一个符号之前可能状态的个数；还要再走一步。",
            ),
            slip(
              before.reduce((n, q) => n + mm.delta[q]![c]!.length, 0),
              "That adds the sizes of the last entries used, counting a state reached from two states twice; in a set it counts once.",
              "这把最后用到的各表项的大小相加，把从两个状态到达的同一状态算了两次；在集合中它只算一次。",
            ),
            slip(
              Math.max(...ss.map((x) => x.length)),
              "That is the largest set along the way, not the set at the end.",
              "这是途中最大的集合，而不是最后的集合。",
            ),
            slip(
              1,
              "That follows a single branch, as if the machine were deterministic; every possible branch must be tracked.",
              "这只跟随了一个分支，好像机器是确定性的；必须追踪所有可能的分支。",
            ),
          ]);
        } while ((sets[sets.length - 1]!.length === 0 && rng.bool(0.8)) || mistakes.length < 2);
        const last = sets[sets.length - 1]!;
        const prev = sets[sets.length - 2]!;
        const c = w[w.length - 1]!;
        return numberProblem({
          prompt: t(
            `An NFA has transition table $${nfaTable(m)}$ ${DFA_NOTE.en} How many states could it be in after reading $${w}$?`,
            `一个 NFA 的转移表为 $${nfaTable(m)}$${DFA_NOTE["zh-CN"]}读入 $${w}$ 后它可能处于多少个状态？`,
          ),
          answer: last.length,
          mistakes,
          solution: walked(
            [
              [
                ["Track the sets", "追踪集合"],
                t(
                  "Each new set is the union of the entries, under the symbol read, of the states in the current set:",
                  "每个新集合是当前集合中各状态在所读符号下的表项的并集：",
                ),
                [setsTex(sets, w)],
              ],
              [
                ["Count the final set", "数最终的集合"],
                t(
                  `The final set $${stateSetTex(last)}$ has $${last.length}$ states.`,
                  `最终的集合 $${stateSetTex(last)}$ 有 $${last.length}$ 个状态。`,
                ),
              ],
            ],
            prev.length === 0
              ? t(
                  "Once the set is $\\varnothing$, no branch is left, so it stays $\\varnothing$ to the end.",
                  "集合一旦变为 $\\varnothing$，就没有分支剩下，所以它一直是 $\\varnothing$。",
                )
              : last.length === 0
                ? t(
                    `Every state of $${stateSetTex(prev)}$ has the entry $\\varnothing$ under $${c}$, so every branch dies on the last symbol.`,
                    `$${stateSetTex(prev)}$ 中每个状态在 $${c}$ 列的表项都是 $\\varnothing$，所以每个分支都在最后一个符号处消失。`,
                  )
                : t(
                    `Each state of $${stateSetTex(last)}$ appears under $${c}$ in the row of some state of $${stateSetTex(prev)}$, and every state in those entries is listed once.`,
                    `$${stateSetTex(last)}$ 中的每个状态都出现在 $${stateSetTex(prev)}$ 中某个状态所在行的 $${c}$ 列中，而这些表项中的每个状态都只列了一次。`,
                  ),
          ),
        });
      },
    },
    {
      id: "acceptance-by-an-nfa",
      title: t("Acceptance", "接受"),
      explanation: t(
        "An NFA accepts if at least one way of reading the string ends in an accepting state, that is, if the final set of possible states contains an accepting state. It rejects if every branch ends elsewhere or dies.\n\n> **Watch out.** One accepting branch is enough, even if other branches die or end elsewhere. If the final set is $\\{q_0, q_2\\}$ and only $q_2$ is accepting, the NFA accepts.",
        "若读入该串的某一种方式停在接受状态，即最终的可能状态集含有接受状态，则 NFA 接受。若每个分支都停在别处或中途消失，则拒绝。\n\n> **注意。** 只要有一个分支接受就够了，即使其他分支消失或停在别处。若最终的集合为 $\\{q_0, q_2\\}$ 且只有 $q_2$ 是接受状态，则 NFA 接受。",
      ),
      generate(rng) {
        const m = randomNfa(rng, rng.int(3, 4));
        const w = randomWord(rng, rng.int(3, 6));
        const sets = nfaSets(m, w);
        const last = sets[sets.length - 1]!;
        const yes = last.some((q) => m.accept[q]);
        const claimed = last.find((q) => m.accept[q]) ?? range(0, m.k - 1).find((q) => m.accept[q])!;
        const claimedSet = last.filter((q) => !m.accept[q]);
        return verdictChoice(rng, {
          prompt: t(
            `An NFA has transition table $${nfaTable(m)}$ ${DFA_NOTE.en} Does it accept $${w}$?`,
            `一个 NFA 的转移表为 $${nfaTable(m)}$${DFA_NOTE["zh-CN"]}它接受 $${w}$ 吗？`,
          ),
          holds: yes,
          yes: t(`the final set of states contains the accepting state $${qx(claimed)}$`, `最终的状态集含有接受状态 $${qx(claimed)}$`),
          no: t(
            `the final set of states is $${stateSetTex(claimedSet)}$, with no accepting state`,
            `最终的状态集是 $${stateSetTex(claimedSet)}$，不含接受状态`,
          ),
          yesWrong: t("some branch passes through an accepting state along the way", "某个分支途中经过了接受状态"),
          noWrong: t("some branch dies or ends in a state that is not accepting", "某个分支中途消失或停在非接受状态"),
          solution: walked(
            [
              [
                ["Track the sets", "追踪集合"],
                t(
                  "Each new set is the union of the entries, under the symbol read, of the states in the current set:",
                  "每个新集合是当前集合中各状态在所读符号下的表项的并集：",
                ),
                [setsTex(sets, w)],
              ],
              [
                ["Look for an accepting state", "寻找接受状态"],
                yes
                  ? t(
                      `The final set $${stateSetTex(last)}$ contains the accepting state $${qx(claimed)}$, so the NFA accepts $${w}$.`,
                      `最终的集合 $${stateSetTex(last)}$ 含有接受状态 $${qx(claimed)}$，所以 NFA 接受 $${w}$。`,
                    )
                  : t(
                      `The final set $${stateSetTex(last)}$ contains no state marked $*$, so the NFA rejects $${w}$.`,
                      `最终的集合 $${stateSetTex(last)}$ 不含标有 $*$ 的状态，所以 NFA 拒绝 $${w}$。`,
                    ),
              ],
            ],
            yes
              ? t(
                  `One accepting branch is $${traceTex(acceptingBranch(m, w, sets, claimed))}$: each step is an allowed move on the symbol read, and it ends in $${qx(claimed)}$.`,
                  `一个接受的分支是 $${traceTex(acceptingBranch(m, w, sets, claimed))}$：每一步都是对所读符号允许的移动，并且停在 $${qx(claimed)}$。`,
                )
              : t(
                  `Every branch is accounted for by the sets: ${last.length === 0 ? "all of them die before the end" : "the ones that survive end in states without a $*$"}, so no way of reading $${w}$ is accepted.`,
                  `这些集合涵盖了所有分支：${last.length === 0 ? "它们都在中途消失" : "存活下来的分支都停在没有 $*$ 的状态"}，所以读入 $${w}$ 的任何方式都不被接受。`,
                ),
          ),
        });
      },
    },
  ],
};

/** countsByLength lists, for each length up to n, how many strings reach each state. */
function countsByLength(m: Machine, n: number): number[][] {
  const rows: number[][] = [range(0, m.k - 1).map((q) => (q === 0 ? 1 : 0))];
  for (let i = 0; i < n; i++) {
    const next = range(0, m.k - 1).map(() => 0);
    rows[i]!.forEach((c, q) => {
      next[m.delta[q]![0]!]! += c;
      next[m.delta[q]![1]!]! += c;
    });
    rows.push(next);
  }
  return rows;
}

/** countAccepted counts the strings of length n a DFA accepts by dynamic programming over states. */
function countAccepted(m: Machine, n: number): number {
  let ways: number[] = range(0, m.k - 1).map((q) => (q === 0 ? 1 : 0));
  for (let i = 0; i < n; i++) {
    const next = range(0, m.k - 1).map(() => 0);
    ways.forEach((c, q) => {
      next[m.delta[q]![0]!]! += c;
      next[m.delta[q]![1]!]! += c;
    });
    ways = next;
  }
  return ways.reduce((s, c, q) => s + (m.accept[q] ? c : 0), 0);
}

/** accepts reports whether a DFA accepts w. */
const accepts = (m: Machine, w: string) => m.accept[trace(m, w).pop()!]!;

/** theLanguageOfAutomata describes and counts the strings an automaton accepts. */
export const theLanguageOfAutomata: TopicDef = {
  id: "the-language-of-automata",
  title: t("The Language of Automata", "自动机的语言"),
  summary: t(
    "The language L(M) of an automaton M is the set of strings it accepts. Languages accepted by finite automata are called regular; DFAs and NFAs accept exactly the same languages. The strings of length n in L(M) can be counted by tracking how many strings reach each state.",
    "自动机 M 的语言 L(M) 是它接受的所有串的集合。有限自动机接受的语言称为正则语言；DFA 与 NFA 接受的语言完全相同。可以通过追踪到达每个状态的串的个数来数 L(M) 中长度为 n 的串。",
  ),
  intro: t(
    "Take the DFA with accepting start state $q_0$ and a state $q_1$, where $0$ keeps the state and $1$ switches it; its language is the strings with an even number of $1$s. Count the strings of length $3$ by passing counts along: $(1, 0) \\to (1, 1) \\to (2, 2) \\to (4, 4)$, listing $q_0$ first. The accepting state $q_0$ holds $4$ of the $8$ strings.\n\nCheck: the strings of length $3$ with an even number of $1$s are $000$, $011$, $101$ and $110$, four of them.\n\nIn this lesson we count the strings of a given length in the language of a DFA by passing counts from state to state, and decide which strings belong to the language by running the DFA on them.",
    "取一个 DFA：初始状态 $q_0$ 是接受状态，另有状态 $q_1$，读入 $0$ 保持状态，读入 $1$ 切换状态；它的语言是含偶数个 $1$ 的串。把计数逐步传递来数长度为 $3$ 的串：$(1, 0) \\to (1, 1) \\to (2, 2) \\to (4, 4)$，先列 $q_0$。接受状态 $q_0$ 处有 $8$ 个串中的 $4$ 个。\n\n检验：长度为 $3$、含偶数个 $1$ 的串是 $000$、$011$、$101$、$110$，共四个。\n\n本课我们通过在状态之间传递计数，数出 DFA 的语言中给定长度的串，并通过让 DFA 处理各个串来判断它们是否属于该语言。",
  ),
  prerequisites: ["processing-strings-using-deterministic-finite-automata", "nondeterministic-finite-automata"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-strings-in-the-language-of-a-dfa",
      title: t("Counting strings", "数串"),
      explanation: t(
        "Start with $1$ string (the empty one) at $q_0$. At each step, every state passes its count to the states its transitions lead to. After $n$ steps, add the counts at the accepting states.\n\n> **Watch out.** A state whose two transitions lead to the same place passes its count there twice, once for each symbol. If $\\delta(q_1, 0) = \\delta(q_1, 1) = q_2$ and $3$ strings reach $q_1$, they send $6$ strings to $q_2$, not $3$.",
        "开始时 $q_0$ 处有 $1$ 个串（空串）。每一步，每个状态把它的计数传给它的转移所指向的状态。$n$ 步之后，把接受状态处的计数相加。\n\n> **注意。** 若一个状态的两个转移指向同一处，它要把计数传过去两次，每个符号一次。若 $\\delta(q_1, 0) = \\delta(q_1, 1) = q_2$，且有 $3$ 个串到达 $q_1$，则它们向 $q_2$ 送去 $6$ 个串，而不是 $3$ 个。",
      ),
      generate(rng) {
        let m: Machine;
        let n: number;
        let value: number;
        let mistakes: Mistake[];
        do {
          const mm = randomMachine(rng, 3);
          const nn = rng.int(3, 6);
          const v = countAccepted(mm, nn);
          const first = countsByLength(mm, nn)[nn]![range(0, 2).find((q) => mm.accept[q])!]!;
          m = mm;
          n = nn;
          value = v;
          mistakes = apart(v, [
            slip(2 ** nn - v, "That counts the strings the DFA rejects.", "这数的是 DFA 拒绝的串。"),
            slip(2 ** nn, "That counts every string of that length, accepted or not.", "这把该长度的所有串都数了，不论是否被接受。"),
            slip(
              countAccepted(mm, nn - 1),
              `That stops one step early, counting strings of length $${nn - 1}$.`,
              `这少走了一步，数的是长度为 $${nn - 1}$ 的串。`,
            ),
            slip(
              countAccepted(mm, nn + 1),
              `That takes one step too many, counting strings of length $${nn + 1}$.`,
              `这多走了一步，数的是长度为 $${nn + 1}$ 的串。`,
            ),
            slip(first, "That adds the count at only one of the accepting states.", "这只加了其中一个接受状态处的计数。"),
          ]);
        } while (value === 0 || value === 2 ** n || mistakes.length < 2);
        const rows = countsByLength(m, n);
        const mm = m;
        const acc = range(0, 2).filter((q) => mm.accept[q]);
        const end = rows[n]!;
        const counts = rows.map((c) => `(${c.join(", ")})`).join(" \\to ");
        return numberProblem({
          prompt: t(
            `A DFA over $\\{0, 1\\}$ has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} How many strings of length $${n}$ are in its language?`,
            `字母表 $\\{0, 1\\}$ 上的一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}它的语言中有多少个长度为 $${n}$ 的串？`,
          ),
          answer: value,
          mistakes,
          solution: walked(
            [
              [
                ["Start the counts", "开始计数"],
                t("Before any symbol is read, the one empty string is at $q_0$:", "读入任何符号之前，唯一的空串在 $q_0$ 处："),
                [`(${rows[0]!.join(", ")})`],
              ],
              [
                ["Pass the counts along", "传递计数"],
                t(
                  "At each step every state sends its count along both of its transitions; the counts are listed in the order $q_0, q_1, q_2$:",
                  "每一步，每个状态沿它的两个转移送出计数；计数按 $q_0, q_1, q_2$ 的顺序列出：",
                ),
                [counts],
              ],
              [
                ["Add the accepting states", "把接受状态相加"],
                t(`The accepting states are $${acc.map(qx).join(", ")}$:`, `接受状态为 $${acc.map(qx).join(", ")}$：`),
                [acc.length > 1 ? `${acc.map((q) => end[q]).join(" + ")} = ${value}` : `${value}`],
              ],
            ],
            t(
              `The three counts after $${n}$ steps add to $${end.join(" + ")} = ${2 ** n} = 2^{${n}}$, the number of binary strings of length $${n}$, so no string was lost or counted twice.`,
              `$${n}$ 步之后三个计数之和为 $${end.join(" + ")} = ${2 ** n} = 2^{${n}}$，正是长度为 $${n}$ 的二进制串的个数，所以没有串被漏掉或重复计数。`,
            ),
          ),
        });
      },
    },
    {
      id: "recognizing-strings-in-a-language",
      title: t("Members of the language", "语言中的串"),
      explanation: t(
        "To decide whether a string is in $L(M)$, run $M$ on it. Strings of the same length can land in different states, so each must be checked.\n\n> **Watch out.** Strings that look alike can still end in different states, so run each one. If $\\delta(q_0, 0) = q_1$, $\\delta(q_0, 1) = q_0$ and $q_1$ stays in $q_1$, then $01$ ends in $q_1$ while $11$ ends in $q_0$.",
        "要判断一个串是否在 $L(M)$ 中，就让 $M$ 处理它。同样长度的串可能停在不同的状态，所以每个都要检查。\n\n> **注意。** 看起来相似的串也可能停在不同的状态，所以每个都要运行一遍。若 $\\delta(q_0, 0) = q_1$，$\\delta(q_0, 1) = q_0$，而 $q_1$ 总是停留在 $q_1$，则 $01$ 停在 $q_1$，而 $11$ 停在 $q_0$。",
      ),
      generate(rng) {
        let m: Machine;
        let words: string[];
        let inL: string[];
        do {
          m = randomMachine(rng, 3);
          words = rng.sample(allWords(5), 8);
          const mm = m;
          inL = words.filter((w) => accepts(mm, w));
        } while (inL.length === 0 || words.length - inL.length < 3);
        const mm = m;
        const right = inL[0]!;
        const s = trace(mm, right);
        const wrong = words.filter((w) => !accepts(mm, w)).slice(0, 3);
        return stringChoice(
          rng,
          t(
            `A DFA has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} Which string is in its language?`,
            `一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}哪个串在它的语言中？`,
          ),
          right,
          wrong.map((x) => {
            const run = trace(mm, x);
            return {
              s: x,
              why: t(
                `On $${x}$ the run is $${traceTex(run)}$, which ends in $${qx(run[run.length - 1]!)}$, not an accepting state.`,
                `对 $${x}$，运行过程为 $${traceTex(run)}$，停在 $${qx(run[run.length - 1]!)}$，它不是接受状态。`,
              ),
            };
          }),
          walked(
            [
              [["Run the DFA", "运行 DFA"], t(`On $${right}$ the run is`, `对 $${right}$，运行过程为`), [runTex(s, [...right])]],
              [
                ["Look at the last state", "看最后的状态"],
                t(
                  `It ends in $${qx(s[s.length - 1]!)}$, which is marked $*$, so $${right}$ is in $L(M)$.`,
                  `它停在 $${qx(s[s.length - 1]!)}$，该状态标有 $*$，所以 $${right}$ 在 $L(M)$ 中。`,
                ),
              ],
            ],
            t(
              "Running the DFA on each of the other options ends in a state without a $*$, as shown below, so exactly one option is in the language.",
              "让 DFA 处理其他每个选项，都停在没有 $*$ 的状态（见下），所以恰好只有一个选项在该语言中。",
            ),
          ),
        );
      },
    },
  ],
};

/** REGEX_PIECES are building blocks of regular expressions, in JavaScript syntax. */
const REGEX_PIECES = ["0", "1", "(0|1)", "0*", "1*", "(0|1)*", "(01)*", "(10)*", "(00|1)*", "(0|11)*", "(0|1)(0|1)", "10*", "01*"] as const;

/** regexTex writes a regular expression with ^* for the star and ∣ for alternation. */
const regexTex = (r: string) => r.replace(/\|/g, " \\mid ").replace(/\*/g, "^*");

/** randomRegex picks two or three random pieces, to be concatenated. */
const randomRegex = (rng: Rng): string[] => range(1, rng.int(2, 3)).map(() => rng.pick(REGEX_PIECES));

/** splitBy cuts w into consecutive parts matching the pieces in order, or returns undefined when no cut works. */
function splitBy(w: string, pieces: readonly string[]): string[] | undefined {
  const [head, ...rest] = pieces;
  if (head === undefined) return w === "" ? [] : undefined;
  const re = new RegExp(`^(?:${head})$`);
  for (let i = 0; i <= w.length; i++) {
    if (!re.test(w.slice(0, i))) continue;
    const tail = splitBy(w.slice(i), rest);
    if (tail) return [w.slice(0, i), ...tail];
  }
  return undefined;
}

/** partTex writes a part of a string, ε when it is empty. */
const partTex = (p: string) => (p === "" ? "\\varepsilon" : p);

/** partsTex writes a cut of a string as its parts joined by dots. */
const partsTex = (parts: readonly string[]) => parts.map(partTex).join(" \\cdot ");

/** regularExpressions counts and recognizes the strings a regular expression matches. */
export const regularExpressions: TopicDef = {
  id: "regular-expressions",
  title: t("Regular Expressions", "正则表达式"),
  summary: t(
    "Regular expressions build languages from single symbols using union ($r \\mid s$), concatenation ($rs$) and the Kleene star ($r^*$, any number of copies, including none). They describe exactly the regular languages, the ones finite automata accept.",
    "正则表达式由单个符号出发，用并（$r \\mid s$）、连接（$rs$）和 Kleene 星号（$r^*$，任意多个副本，包括零个）构造语言。它们恰好描述正则语言，即有限自动机接受的语言。",
  ),
  intro: t(
    "Take the expression $0^*1(0 \\mid 1)$, the concatenation of the pieces $0^*$, $1$ and $(0 \\mid 1)$. The string $0010$ matches it: cut it as $00 \\cdot 1 \\cdot 0$, where $00$ is a run of $0$s, then comes the $1$, then one more symbol. Of length $4$, the expression matches exactly $0010$ and $0011$, since $0^*$ must then take two symbols.\n\nCheck: $0100$ does not match. After $0^*$ takes the first $0$, the $1$ and one more symbol use up $10$, and the last $0$ is left over; any other cut fails earlier.\n\nIn this lesson we decide whether a string matches a regular expression by cutting it into parts that fit the pieces in order, and count the strings of a given length that match.",
    "取表达式 $0^*1(0 \\mid 1)$，它是 $0^*$、$1$、$(0 \\mid 1)$ 三部分的连接。串 $0010$ 与它匹配：把它切成 $00 \\cdot 1 \\cdot 0$，其中 $00$ 是一串 $0$，接着是 $1$，最后再有一个符号。长度为 $4$ 时，该表达式恰好匹配 $0010$ 和 $0011$，因为这时 $0^*$ 必须取两个符号。\n\n检验：$0100$ 不匹配。$0^*$ 取走第一个 $0$ 后，$1$ 和后面的一个符号用掉 $10$，最后的 $0$ 剩了下来；其他切法更早就失败了。\n\n本课我们把串切成依次符合表达式各部分的几段，以判断它是否与正则表达式匹配，并数出给定长度的匹配串。",
  ),
  prerequisites: ["the-language-of-automata"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "matching-regular-expressions",
      title: t("Matching a string", "匹配串"),
      explanation: t(
        "$1(0 \\mid 1)^*0$ matches the strings that start with $1$ and end with $0$, such as $10$ and $1100$, but not $1$ or $0110$. Try to split the string into parts matching each piece of the expression.\n\n> **Watch out.** A starred piece may take any number of copies, including none, so try every cut before deciding there is no match. $0^*1$ matches $1$, with $0^*$ taking the empty part, and $(01)^*$ matches the empty string.",
        "$1(0 \\mid 1)^*0$ 匹配以 $1$ 开头、以 $0$ 结尾的串，例如 $10$ 和 $1100$，但不匹配 $1$ 或 $0110$。尝试把串拆成与表达式各部分匹配的几段。\n\n> **注意。** 带星号的部分可以取任意多个副本，包括零个，所以在断定不匹配之前要试遍每一种切法。$0^*1$ 匹配 $1$，这时 $0^*$ 取空段；$(01)^*$ 匹配空串。",
      ),
      generate(rng) {
        let pieces: string[];
        let pool: string[];
        let matching: string[];
        do {
          pieces = randomRegex(rng);
          pool = range(3, 6).flatMap((n) => allWords(n));
          const re = new RegExp(`^(?:${pieces.join("")})$`);
          matching = pool.filter((w) => re.test(w));
        } while (matching.length === 0 || matching.length === pool.length);
        const r = pieces.join("");
        const yes = rng.bool();
        const re = new RegExp(`^(?:${r})$`);
        const w = yes ? rng.pick(matching) : rng.pick(pool.filter((x) => !re.test(x)));
        const list = pieces.map(regexTex).join(",\\ ");
        const parts = splitBy(w, pieces);
        const ps = pieces;
        const example = matching[0]!;
        const firstRe = new RegExp(`^(?:${pieces[0]})$`);
        const starts = range(0, w.length)
          .map((i) => w.slice(0, i))
          .filter((p) => firstRe.test(p));
        return verdictChoice(rng, {
          prompt: t(
            `Does the string $${w}$ match the regular expression $${regexTex(r)}$?`,
            `串 $${w}$ 与正则表达式 $${regexTex(r)}$ 匹配吗？`,
          ),
          holds: yes,
          yes: parts
            ? t(
                `it splits as $${partsTex(parts)}$, one part for each of the pieces $${list}$`,
                `它可以切成 $${partsTex(parts)}$，每段对应 $${list}$ 中的一部分`,
              )
            : t(`it can be cut into parts that fit the pieces $${list}$ in order`, `它可以切成依次符合 $${list}$ 各部分的几段`),
          no: t(
            `no way of cutting $${w}$ into consecutive parts fits the pieces $${list}$ in order`,
            `无论怎样把 $${w}$ 切成相连的几段，都不能依次符合 $${list}$ 各部分`,
          ),
          yesWrong: t(`every symbol of $${w}$ appears somewhere in $${regexTex(r)}$`, `$${w}$ 的每个符号都在 $${regexTex(r)}$ 中出现`),
          noWrong: t(`$${w}$ does not appear written out inside $${regexTex(r)}$`, `$${w}$ 没有原样写在 $${regexTex(r)}$ 里`),
          solution: walked(
            [
              [
                ["Name the pieces", "列出各部分"],
                t("The expression is the concatenation of", "表达式是以下各部分的连接："),
                [pieces.map(regexTex).join(" \\quad ")],
              ],
              parts
                ? [
                    ["Cut the string", "切分串"],
                    t("Cut the string into one part per piece:", "把串切成每部分一段："),
                    [`${w} = ${partsTex(parts)}`],
                  ]
                : [
                    ["Try every cut", "尝试每种切法"],
                    starts.length === 0
                      ? t(
                          `No beginning of $${w}$ fits the first piece $${regexTex(pieces[0]!)}$, so no cut works.`,
                          `$${w}$ 没有任何开头部分符合第一部分 $${regexTex(pieces[0]!)}$，所以没有切法可行。`,
                        )
                      : t(
                          `The first piece $${regexTex(pieces[0]!)}$ can take only the beginnings ${starts.map((p) => `$${partTex(p)}$`).join(", ")} of $${w}$, and in each case the rest cannot be cut to fit the remaining pieces. So $${w}$ does not match.`,
                          `第一部分 $${regexTex(pieces[0]!)}$ 只能取 $${w}$ 的开头 ${starts.map((p) => `$${partTex(p)}$`).join("、")}，而每种情况下剩下的部分都无法切成符合其余各部分的几段。所以 $${w}$ 不匹配。`,
                        ),
                  ],
            ],
            parts
              ? t(
                  `Each part fits its piece: ${parts.map((p, i) => `$${partTex(p)}$ fits $${regexTex(ps[i]!)}$`).join(", ")}, and together the parts give back $${w}$.`,
                  `每段都符合对应的部分：${parts.map((p, i) => `$${partTex(p)}$ 符合 $${regexTex(ps[i]!)}$`).join("，")}，而这些段连起来正是 $${w}$。`,
                )
              : t(
                  `For contrast, $${example}$ does match, cut as $${partsTex(splitBy(example, pieces)!)}$; every string the expression matches can be cut this way, so the failure of every cut shows $${w}$ does not match.`,
                  `作为对照，$${example}$ 是匹配的，可切成 $${partsTex(splitBy(example, pieces)!)}$；表达式匹配的每个串都能这样切开，所以每种切法都失败说明 $${w}$ 不匹配。`,
                ),
          ),
        });
      },
    },
    {
      id: "counting-strings-matched-by-a-regular-expression",
      title: t("Counting matches", "数匹配的串"),
      explanation: t(
        "Strings of length $5$ matching $(0 \\mid 1)^*11$ end in $11$, and the first $3$ symbols are free: $2^3 = 8$ strings. Strings of length $n$ matching $0^*1^*$ are $0^k1^{n-k}$ for $k = 0, \\dots, n$: $n + 1$ strings.\n\n> **Watch out.** Count strings, not cuts: a string that can be cut in two ways still counts once. Of length $2$, $0^*0^*$ matches only $00$, although $00$ can be cut as $\\varepsilon \\cdot 00$, $0 \\cdot 0$ or $00 \\cdot \\varepsilon$.",
        "长度为 $5$、匹配 $(0 \\mid 1)^*11$ 的串以 $11$ 结尾，前 $3$ 个符号任意：共 $2^3 = 8$ 个。长度为 $n$、匹配 $0^*1^*$ 的串为 $0^k1^{n-k}$（$k = 0, \\dots, n$）：共 $n + 1$ 个。\n\n> **注意。** 要数的是串，而不是切法：一个串即使有两种切法，也只算一次。长度为 $2$ 时，$0^*0^*$ 只匹配 $00$，尽管 $00$ 可以切成 $\\varepsilon \\cdot 00$、$0 \\cdot 0$ 或 $00 \\cdot \\varepsilon$。",
      ),
      generate(rng) {
        let pieces: string[];
        let n: number;
        let matches: string[];
        let mistakes: Mistake[];
        do {
          const pp = randomRegex(rng);
          const nn = rng.int(4, 7);
          const re = new RegExp(`^(?:${pp.join("")})$`);
          const of = (len: number) => allWords(len).filter((w) => re.test(w)).length;
          const mm = allWords(nn).filter((w) => re.test(w));
          pieces = pp;
          n = nn;
          matches = mm;
          mistakes = apart(mm.length, [
            slip(of(nn - 1), `That counts the matches of length $${nn - 1}$.`, `这数的是长度为 $${nn - 1}$ 的匹配串。`),
            slip(of(nn + 1), `That counts the matches of length $${nn + 1}$.`, `这数的是长度为 $${nn + 1}$ 的匹配串。`),
            slip(2 ** nn - mm.length, "That counts the strings that do not match.", "这数的是不匹配的串。"),
            slip(
              range(0, nn).reduce((s, len) => s + of(len), 0),
              `That counts the matches of every length up to $${nn}$, not just length $${nn}$.`,
              `这数的是长度不超过 $${nn}$ 的所有匹配串，而不只是长度为 $${nn}$ 的。`,
            ),
          ]);
        } while (matches.length < 2 || matches.length === 2 ** n || matches.length > 12 || mistakes.length < 2);
        const r = pieces.join("");
        const count = matches.length;
        const rows = range(0, Math.ceil(count / 4) - 1).map((i) => matches.slice(4 * i, 4 * i + 4).join(",\\ "));
        return numberProblem({
          prompt: t(
            `How many binary strings of length $${n}$ match the regular expression $${regexTex(r)}$?`,
            `有多少个长度为 $${n}$ 的二进制串与正则表达式 $${regexTex(r)}$ 匹配？`,
          ),
          answer: count,
          mistakes,
          solution: walked(
            [
              [
                ["Name the pieces", "列出各部分"],
                t("The expression is the concatenation of", "表达式是以下各部分的连接："),
                [pieces.map(regexTex).join(" \\quad ")],
              ],
              [
                ["List the matches", "列出匹配串"],
                t(
                  `The strings of length $${n}$ that can be cut to fit the pieces in order are`,
                  `能切成依次符合各部分的长度为 $${n}$ 的串为`,
                ),
                rows,
              ],
              [["Count them", "数一数"], t(`That is $${count}$ strings.`, `共 $${count}$ 个串。`)],
            ],
            t(
              `Each listed string does fit, for example $${matches[0]} = ${partsTex(splitBy(matches[0]!, pieces)!)}$, and with the $${2 ** n - count}$ strings that do not, they make up all $2^{${n}} = ${2 ** n}$ strings of length $${n}$.`,
              `列出的每个串都符合，例如 $${matches[0]} = ${partsTex(splitBy(matches[0]!, pieces)!)}$；它们与 $${2 ** n - count}$ 个不匹配的串合起来，正是长度为 $${n}$ 的全部 $2^{${n}} = ${2 ** n}$ 个串。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Rule is a Turing machine transition: write a symbol, move L or R, go to a state (-1 halts). */
type Rule = readonly [string, "L" | "R", number];

/** Tm is a Turing machine as a map from "state,symbol" to a rule; "_" is the blank. */
interface Tm {
  readonly rules: ReadonlyMap<string, Rule>;
  readonly states: number;
}

/** tm builds a Turing machine from a list of transitions. */
const tm = (states: number, list: readonly (readonly [number, string, string, "L" | "R", number])[]): Tm => ({
  states,
  rules: new Map(list.map(([q, a, b, d, r]) => [`${q},${a}`, [b, d, r] as const])),
});

/** runTm runs a machine on input from cell 1, returning the tape (trimmed of blanks), the number of steps, the head cell and the final state; it halts when no rule applies or a rule leads to -1. */
function runTm(m: Tm, input: string, maxSteps = 200) {
  const tape = new Map([...input].map((c, i) => [i + 1, c] as const));
  let head = 1;
  let state = 0;
  let steps = 0;
  const heads = [head];
  while (steps < maxSteps) {
    const rule = m.rules.get(`${state},${tape.get(head) ?? "_"}`);
    if (rule === undefined) break;
    tape.set(head, rule[0]);
    head += rule[1] === "R" ? 1 : -1;
    state = rule[2];
    steps++;
    heads.push(head);
    if (state === -1) break;
  }
  const cells = [...tape.entries()].filter(([, c]) => c !== "_").sort((a, b) => a[0] - b[0]);
  const lo = cells[0]?.[0] ?? 1;
  const hi = cells[cells.length - 1]?.[0] ?? 0;
  const content = range(lo, hi)
    .map((i) => tape.get(i) ?? "_")
    .join("");
  return { content, steps, head, heads, state };
}

/** tmTex writes the transitions of a Turing machine, h for the halting state and ⊔ for the blank. */
const tmTex = (m: Tm) =>
  [...m.rules.entries()]
    .map(([k, [b, d, r]]) => {
      const [q, a] = k.split(",");
      const sym = (c: string) => (c === "_" ? "\\sqcup" : c);
      return `\\delta(q_{${q}}, ${sym(a!)}) = (${r === -1 ? "h" : `q_{${r}}`}, ${sym(b)}, ${d})`;
    })
    .join(",\\ ");

/** tapeTex writes the contents of a tape with ⊔ for the blanks. */
const tapeTex = (content: string) => content.replace(/_/g, "\\sqcup ");

/** TM_NOTE explains the notation for Turing machines. */
const TM_NOTE = t(
  "Here $\\delta(q, a) = (p, b, D)$ means: in state $q$ reading $a$, write $b$, move the head one cell in direction $D$ and go to state $p$; $\\sqcup$ is the blank and $h$ halts.",
  "这里 $\\delta(q, a) = (p, b, D)$ 表示：在状态 $q$ 读到 $a$ 时，写入 $b$，读写头向 $D$ 方向移动一格，转到状态 $p$；$\\sqcup$ 是空白符，$h$ 表示停机。",
);

/** flipper complements every bit, then halts at the first blank. */
const flipper = tm(1, [
  [0, "0", "1", "R", 0],
  [0, "1", "0", "R", 0],
  [0, "_", "_", "L", -1],
]);

/** unaryAdder turns 1ᵃ01ᵇ into 1ᵃ⁺ᵇ. */
const unaryAdder = tm(3, [
  [0, "1", "1", "R", 0],
  [0, "0", "1", "R", 1],
  [1, "1", "1", "R", 1],
  [1, "_", "_", "L", 2],
  [2, "1", "_", "L", -1],
]);

/** incrementer adds 1 to a binary number. */
const incrementer = tm(2, [
  [0, "0", "0", "R", 0],
  [0, "1", "1", "R", 0],
  [0, "_", "_", "L", 1],
  [1, "1", "0", "L", 1],
  [1, "0", "1", "L", -1],
  [1, "_", "1", "L", -1],
]);

/** zeroEraser replaces every 0 by a blank and returns to the start. */
const zeroEraser = tm(2, [
  [0, "0", "_", "R", 0],
  [0, "1", "1", "R", 0],
  [0, "_", "_", "L", 1],
  [1, "1", "1", "L", 1],
  [1, "_", "_", "R", -1],
]);

/** TmTask is a machine with its input, what its rules do, and a second way to count the 1s it leaves. */
interface TmTask {
  readonly m: Tm;
  readonly input: string;
  readonly does: Text;
  readonly ones: Text;
}

/** randomTmTask picks one of the simple machines with a suitable input. */
function randomTmTask(rng: Rng): TmTask {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const input = randomWord(rng, rng.int(3, 7));
    const zeros = input.length - countOnes(input);
    return {
      m: flipper,
      input,
      does: t(
        "In $q_0$ the machine flips each bit and moves right; at the first blank it steps back left and halts.",
        "在 $q_0$ 中，机器把每一位取反并右移；遇到第一个空白时左移一格并停机。",
      ),
      ones: t(
        `Every $0$ of the input becomes a $1$ and every $1$ a $0$, so the $1$s on the tape are the $${zeros}$ zeros of the input.`,
        `输入的每个 $0$ 变成 $1$，每个 $1$ 变成 $0$，所以纸带上的 $1$ 就是输入中的 $${zeros}$ 个 $0$。`,
      ),
    };
  }
  if (kind === 1) {
    const a = rng.int(1, 4);
    const b = rng.int(1, 4);
    const input = `${"1".repeat(a)}0${"1".repeat(b)}`;
    return {
      m: unaryAdder,
      input,
      does: t(
        "$q_0$ moves right over the first block of $1$s and turns the $0$ into a $1$; $q_1$ runs on to the blank and steps back; $q_2$ erases the last $1$ and halts.",
        "$q_0$ 右移经过第一段 $1$，并把 $0$ 改成 $1$；$q_1$ 继续右移到空白处再退回一格；$q_2$ 擦去最后一个 $1$ 并停机。",
      ),
      ones: t(
        `The $0$ of $${input}$ became a $1$ and the last $1$ was erased, leaving $${a} + ${b} = ${a + b}$ ones.`,
        `$${input}$ 中的 $0$ 变成了 $1$，最后一个 $1$ 被擦去，剩下 $${a} + ${b} = ${a + b}$ 个 $1$。`,
      ),
    };
  }
  if (kind === 2) {
    const input = `1${randomWord(rng, rng.int(2, 6))}`;
    const value = Number.parseInt(input, 2) + 1;
    const out = value.toString(2);
    return {
      m: incrementer,
      input,
      does: t(
        "$q_0$ runs right to the blank and steps back; $q_1$ turns the trailing $1$s into $0$s moving left, then turns the first $0$ or blank it meets into $1$ and halts.",
        "$q_0$ 右移到空白处再退回一格；$q_1$ 一边左移一边把末尾的 $1$ 改成 $0$，然后把遇到的第一个 $0$ 或空白改成 $1$ 并停机。",
      ),
      ones: t(
        `The tape holds $${input}_2 + 1 = ${value}$ in binary, $${out}$, which has $${countOnes(out)}$ ones.`,
        `纸带上是 $${input}_2 + 1 = ${value}$ 的二进制形式 $${out}$，其中有 $${countOnes(out)}$ 个 $1$。`,
      ),
    };
  }
  const input = `${randomWord(rng, rng.int(2, 5))}1`;
  return {
    m: zeroEraser,
    input,
    does: t(
      "$q_0$ moves right, replacing every $0$ by a blank and keeping the $1$s; at the end $q_1$ walks back left over $1$s until it meets a blank, then steps right and halts.",
      "$q_0$ 右移，把每个 $0$ 换成空白而保留 $1$；到末尾后 $q_1$ 向左走过 $1$，直到遇到空白，再右移一格并停机。",
    ),
    ones: t(
      `Only $0$s are erased and no $1$ is written, so the $1$s on the tape are the $${countOnes(input)}$ ones of the input.`,
      `只有 $0$ 被擦去，也没有写入新的 $1$，所以纸带上的 $1$ 就是输入中的 $${countOnes(input)}$ 个 $1$。`,
    ),
  };
}

/** introductionToTuringMachines runs simple Turing machines step by step. */
export const introductionToTuringMachines: TopicDef = {
  id: "introduction-to-turing-machines",
  title: t("Introduction to Turing Machines", "图灵机简介"),
  summary: t(
    "A Turing machine has a finite set of states and a head on an infinite tape. In each step it reads the symbol under the head and, according to its transition function, writes a symbol, moves left or right, and changes state, until it halts.",
    "图灵机有有限个状态和一个位于无限长纸带上的读写头。每一步它读取读写头下的符号，按照转移函数写入一个符号、向左或向右移动并改变状态，直到停机。",
  ),
  intro: t(
    "Take the machine with $\\delta(q_0, 0) = (q_0, 1, R)$, $\\delta(q_0, 1) = (q_0, 0, R)$ and $\\delta(q_0, \\sqcup) = (h, \\sqcup, L)$, started in $q_0$ on cell $1$ of the input $10$. Step $1$ reads $1$, writes $0$ and moves to cell $2$; step $2$ reads $0$, writes $1$ and moves to cell $3$; step $3$ reads the blank, leaves it, moves back to cell $2$ and halts. The tape reads $01$ and the head is on cell $2$.\n\nCheck: the machine flips each bit once on its way right, so $10$ becomes $01$, and it takes one step per input symbol plus one for the blank: $2 + 1 = 3$ steps.\n\nIn this lesson we run a Turing machine one step at a time, keeping track of its state, the tape and the head, to find what it leaves on the tape and where its head goes.",
    "取转移为 $\\delta(q_0, 0) = (q_0, 1, R)$、$\\delta(q_0, 1) = (q_0, 0, R)$、$\\delta(q_0, \\sqcup) = (h, \\sqcup, L)$ 的机器，从状态 $q_0$、输入 $10$ 的第 $1$ 格开始。第 $1$ 步读到 $1$，写入 $0$，移到第 $2$ 格；第 $2$ 步读到 $0$，写入 $1$，移到第 $3$ 格；第 $3$ 步读到空白，保持不变，退回第 $2$ 格并停机。纸带上为 $01$，读写头在第 $2$ 格。\n\n检验：机器向右走时把每一位各取反一次，所以 $10$ 变成 $01$；它每个输入符号走一步，再加上空白处的一步：共 $2 + 1 = 3$ 步。\n\n本课我们逐步运行图灵机，记录它的状态、纸带和读写头，求出它在纸带上留下什么以及读写头的去向。",
  ),
  prerequisites: ["deterministic-finite-automata"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-tape-after-a-turing-machine-halts",
      title: t("The final tape", "最终的纸带"),
      explanation: t(
        "Write out the tape and run the machine one step at a time, keeping track of the state and the head. When it halts, read the symbols left on the tape.\n\n> **Watch out.** The step into $h$ still writes its symbol and moves, so apply it before reading the tape. If the last rule used is $\\delta(q_2, 1) = (h, \\sqcup, L)$, that $1$ is erased as the machine halts.",
        "写出纸带，逐步运行机器，记录状态和读写头的位置。停机后读出纸带上剩下的符号。\n\n> **注意。** 进入 $h$ 的那一步仍然要写入符号并移动，所以读纸带之前要先执行它。若最后用到的规则是 $\\delta(q_2, 1) = (h, \\sqcup, L)$，那么这个 $1$ 在停机时被擦去。",
      ),
      generate(rng) {
        let task: TmTask;
        let run: ReturnType<typeof runTm>;
        let ones: number;
        let mistakes: Mistake[];
        do {
          const tk = randomTmTask(rng);
          const rr = runTm(tk.m, tk.input);
          const n1 = countOnes(rr.content);
          const early = runTm(tk.m, tk.input, rr.steps - 1);
          task = tk;
          run = rr;
          ones = n1;
          mistakes = apart(n1, [
            slip(
              countOnes(tk.input),
              "That counts the $1$s of the input; the machine rewrites the tape.",
              "这数的是输入中的 $1$；机器会改写纸带。",
            ),
            slip(
              countOnes(early.content),
              "That stops one step early: the halting step also writes its symbol.",
              "这少走了一步：停机的那一步也要写入符号。",
            ),
            slip(
              rr.content.length - n1 - (rr.content.match(/_/g)?.length ?? 0),
              "That counts the $0$s left on the tape.",
              "这数的是纸带上剩下的 $0$。",
            ),
            slip(
              tk.input.length,
              "That counts every symbol of the input, not the $1$s left at the end.",
              "这数的是输入的所有符号，而不是最后剩下的 $1$。",
            ),
          ]);
        } while (mistakes.length < 2);
        const { m, input } = task;
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ with its head on the first symbol of the input $${input}$, the rest of the tape blank. Its transitions are $${tmTex(m)}$. ${TM_NOTE.en} How many $1$s are on the tape when it halts?`,
            `一台图灵机从状态 $q_0$ 开始，读写头位于输入 $${input}$ 的第一个符号上，纸带其余部分为空白。它的转移为 $${tmTex(m)}$。${TM_NOTE["zh-CN"]}停机时纸带上有多少个 $1$？`,
          ),
          answer: ones,
          mistakes,
          solution: walked(
            [
              [["See what the rules do", "看规则做什么"], task.does],
              [
                ["Run it on the input", "在输入上运行"],
                t(
                  `After $${run.steps}$ steps, the halting step included, the tape has changed from the input to`,
                  `经过 $${run.steps}$ 步（含停机的一步），纸带从输入变为`,
                ),
                [`${input} \\to ${tapeTex(run.content)}`],
              ],
              [
                ["Count the ones", "数 1 的个数"],
                t(`The final tape has $${ones}$ symbols equal to $1$.`, `最终的纸带上有 $${ones}$ 个符号是 $1$。`),
              ],
            ],
            task.ones,
          ),
        });
      },
    },
    {
      id: "the-head-position-of-a-turing-machine",
      title: t("Following the head", "跟踪读写头"),
      explanation: t(
        "Number the cells so the input starts in cell $1$. Each step moves the head one cell: $R$ adds $1$ to its position and $L$ subtracts $1$.\n\n> **Watch out.** A move $L$ counts as $-1$, not $+1$. After the moves $R, R, R, L$ from cell $1$, the head is on cell $1 + 3 - 1 = 3$, not cell $5$.",
        "给纸带格编号，使输入从第 $1$ 格开始。每一步读写头移动一格：$R$ 使位置加 $1$，$L$ 使位置减 $1$。\n\n> **注意。** 移动 $L$ 算作 $-1$，而不是 $+1$。从第 $1$ 格出发，经过 $R, R, R, L$ 的移动后，读写头在第 $1 + 3 - 1 = 3$ 格，而不是第 $5$ 格。",
      ),
      generate(rng) {
        let task: TmTask;
        let run: ReturnType<typeof runTm>;
        let k: number;
        let mistakes: Mistake[];
        do {
          const tk = randomTmTask(rng);
          const rr = runTm(tk.m, tk.input);
          const kk = rng.int(Math.min(3, rr.steps), rr.steps);
          const p = rr.heads[kk]!;
          task = tk;
          run = rr;
          k = kk;
          mistakes = apart(p, [
            slip(
              kk + 1,
              `That moves right on every step, $1 + ${kk}$; some of the moves are to the left.`,
              `这假定每一步都右移，即 $1 + ${kk}$；其中有些移动是向左的。`,
            ),
            slip(
              rr.heads[kk - 1]!,
              `That is where the head is after $${kk - 1}$ steps; take one more.`,
              `这是 $${kk - 1}$ 步之后读写头的位置；还要再走一步。`,
            ),
            ...(kk < rr.steps
              ? [
                  slip(
                    rr.heads[kk + 1]!,
                    `That is where the head is after $${kk + 1}$ steps, one step too many.`,
                    `这是 $${kk + 1}$ 步之后读写头的位置，多走了一步。`,
                  ),
                ]
              : []),
            slip(kk, "That is the number of steps, not the cell the head is on.", "这是步数，而不是读写头所在的格。"),
          ]);
        } while (mistakes.length < 2);
        const { m, input } = task;
        const pos = run.heads[k]!;
        const path = run.heads.slice(0, k + 1);
        const moves = path.slice(1).map((h, i) => (h > path[i]! ? "R" : "L"));
        const rights = moves.filter((d) => d === "R").length;
        const lefts = k - rights;
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ with its head on cell $1$, the first symbol of the input $${input}$; the rest of the tape is blank. Its transitions are $${tmTex(m)}$. ${TM_NOTE.en} On which cell is the head after $${k}$ steps?`,
            `一台图灵机从状态 $q_0$ 开始，读写头位于第 $1$ 格，即输入 $${input}$ 的第一个符号上；纸带其余部分为空白。它的转移为 $${tmTex(m)}$。${TM_NOTE["zh-CN"]}$${k}$ 步之后读写头在第几格？`,
          ),
          answer: pos,
          mistakes,
          solution: walked(
            [
              [["See what the rules do", "看规则做什么"], task.does],
              [
                ["List the moves", "列出移动"],
                t(
                  `The first $${k}$ moves are $${moves.join(", ")}$, so the head visits the cells`,
                  `前 $${k}$ 次移动为 $${moves.join(", ")}$，所以读写头依次经过第`,
                ),
                [path.join(" \\to ")],
              ],
              [["Add up the moves", "把移动相加"], none, [`1 + ${rights} - ${lefts} = ${pos}`]],
            ],
            t(
              `The $${rights}$ moves right and $${lefts}$ moves left make $${rights} + ${lefts} = ${k}$ moves, one per step, and each cell in the list differs from the one before by $1$.`,
              `$${rights}$ 次右移与 $${lefts}$ 次左移共 $${rights} + ${lefts} = ${k}$ 次，每步一次；列表中每一格与前一格都相差 $1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** binTerms writes the powers of 2 that a binary string adds up. */
const binTerms = (bits: string) =>
  [...bits]
    .map((c, i) => (c === "1" ? bits.length - 1 - i : -1))
    .filter((e) => e >= 0)
    .map((e) => (e === 0 ? "1" : e === 1 ? "2" : `2^{${e}}`))
    .join(" + ");

/** processingStringsUsingTuringMachines runs a binary incrementer. */
export const processingStringsUsingTuringMachines: TopicDef = {
  id: "processing-strings-using-turing-machines",
  title: t("Processing Strings Using Turing Machines", "用图灵机处理字符串"),
  summary: t(
    "Unlike a finite automaton, a Turing machine can move back and rewrite its input, so it can compute functions. A machine that adds 1 to a binary number walks to the last digit, then moves left turning 1s into 0s until it can turn a 0 (or a blank) into 1.",
    "与有限自动机不同，图灵机可以往回移动并改写输入，所以能计算函数。给二进制数加 1 的机器先走到最后一位，再向左把 1 改成 0，直到能把一个 0（或空白）改成 1。",
  ),
  intro: t(
    "Run the incrementer on $1001$. In $q_0$ it walks right over the four digits to the blank and steps back onto the last digit: $5$ steps. In $q_1$ it turns that trailing $1$ into $0$ and moves left, then finds a $0$, turns it into $1$ and halts: $2$ more steps. The tape reads $1010$ after $7$ steps.\n\nCheck: $1001_2 = 9$ and $1010_2 = 10 = 9 + 1$, and the step count fits $n + t + 2 = 4 + 1 + 2 = 7$ for $n = 4$ digits ending in $t = 1$ one.\n\nIn this lesson we run a Turing machine that adds $1$ to a binary number, read off the result, and count the steps it takes.",
    "让加一机处理 $1001$。在 $q_0$ 中，它向右走过四位数字到空白处，再退回最后一位：共 $5$ 步。在 $q_1$ 中，它把末尾的那个 $1$ 改成 $0$ 并左移，然后遇到一个 $0$，把它改成 $1$ 并停机：又走 $2$ 步。$7$ 步之后纸带上为 $1010$。\n\n检验：$1001_2 = 9$，$1010_2 = 10 = 9 + 1$；步数也符合 $n + t + 2 = 4 + 1 + 2 = 7$，其中 $n = 4$ 位，末尾有 $t = 1$ 个 $1$。\n\n本课我们运行给二进制数加 $1$ 的图灵机，读出结果，并数出它所走的步数。",
  ),
  prerequisites: ["introduction-to-turing-machines", "binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-with-a-turing-machine",
      title: t("Computing a result", "计算结果"),
      explanation: t(
        "On input $1011$ the incrementer walks right to the blank, steps back, changes the trailing $1$s to $0$s and the $0$ before them to $1$: the tape reads $1100$, which is $11 + 1 = 12$.\n\n> **Watch out.** Only the trailing $1$s become $0$s; the first $0$ to their left becomes $1$, and everything further left stays. On $10011$ the tape ends as $10100$, which is $19 + 1 = 20$, not $11100$.",
        "对输入 $1011$，加一机向右走到空白处，退回一格，把末尾的 $1$ 改成 $0$，再把它们前面的 $0$ 改成 $1$：纸带上为 $1100$，即 $11 + 1 = 12$。\n\n> **注意。** 只有末尾的 $1$ 变成 $0$；它们左边的第一个 $0$ 变成 $1$，更左边的位都不变。对 $10011$，纸带最后为 $10100$，即 $19 + 1 = 20$，而不是 $11100$。",
      ),
      generate(rng) {
        const input = `1${randomWord(rng, rng.int(3, 7))}`;
        const run = runTm(incrementer, input);
        const value = Number.parseInt(run.content, 2);
        const trailing = input.length - input.replace(/1+$/, "").length;
        const allOnes = trailing === input.length;
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ on the first symbol of $${input}$. Its transitions are $${tmTex(incrementer)}$. ${TM_NOTE.en} When it halts, the tape holds a binary number. What is it in decimal?`,
            `一台图灵机从状态 $q_0$、读写头位于 $${input}$ 的第一个符号上开始。它的转移为 $${tmTex(incrementer)}$。${TM_NOTE["zh-CN"]}停机时纸带上是一个二进制数。它的十进制值是多少？`,
          ),
          answer: value,
          mistakes: apart(value, [
            slip(value - 1, "That is the value of the input; the machine adds $1$ to it.", "这是输入的值；机器还要给它加 $1$。"),
            ...(trailing > 0
              ? [
                  slip(
                    value - 2 ** trailing,
                    "That clears the trailing $1$s but forgets to write the carry $1$.",
                    "这清除了末尾的 $1$，却忘了写入进位的 $1$。",
                  ),
                ]
              : []),
            slip(Number(run.content), "That reads the binary digits as a decimal number.", "这把二进制数字当成了十进制数。"),
            slip(
              Number.parseInt([...run.content].reverse().join(""), 2),
              "That reads the tape from right to left; the most significant digit is on the left.",
              "这是从右往左读纸带；最高位在左边。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the trailing ones", "找出末尾的 1"],
                t(
                  `$q_0$ walks right to the blank and steps back onto the last digit. The input $${input}$ ends in $${trailing}$ trailing $1$s.`,
                  `$q_0$ 向右走到空白处，再退回最后一位。输入 $${input}$ 末尾有 $${trailing}$ 个 $1$。`,
                ),
              ],
              [
                ["Carry", "进位"],
                t(
                  `$q_1$ turns those $1$s into $0$s and the ${allOnes ? "blank" : "$0$"} before them into $1$:`,
                  `$q_1$ 把这些 $1$ 改成 $0$，再把它们前面的${allOnes ? "空白" : " $0$ "}改成 $1$：`,
                ),
                [`${input} \\to ${run.content}`],
              ],
              [["Convert to decimal", "化为十进制"], none, [`${run.content}_2 = ${binTerms(run.content)} = ${value}`]],
            ],
            t(
              `The input is $${input}_2 = ${binTerms(input)} = ${value - 1}$, and $${value - 1} + 1 = ${value}$, as an incrementer should give.`,
              `输入为 $${input}_2 = ${binTerms(input)} = ${value - 1}$，而 $${value - 1} + 1 = ${value}$，正是加一机应得的结果。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-steps-of-a-turing-machine",
      title: t("Counting steps", "数步数"),
      explanation: t(
        "On an input of length $n$ ending in $t$ ones, the incrementer takes $n + 1$ steps to reach the blank and step back, then $t$ steps to clear the ones and $1$ more to write the final $1$: $n + t + 2$ steps.\n\n> **Watch out.** The step that reads the blank counts too: it is the one that turns the machine around. On $10$ the incrementer takes $2 + 1 = 3$ steps to read both digits and the blank, then $1$ more to write $1$ over the $0$: $4$ steps, not $3$.",
        "对长度为 $n$、末尾有 $t$ 个 $1$ 的输入，加一机用 $n + 1$ 步走到空白处并退回，再用 $t$ 步清除这些 $1$，最后再用 $1$ 步写入 $1$：共 $n + t + 2$ 步。\n\n> **注意。** 读到空白的那一步也要算：正是这一步让机器掉头。对 $10$，加一机用 $2 + 1 = 3$ 步读过两位数字和空白，再用 $1$ 步把 $0$ 改写成 $1$：共 $4$ 步，而不是 $3$ 步。",
      ),
      generate(rng) {
        const input = `1${randomWord(rng, rng.int(3, 8))}`;
        const run = runTm(incrementer, input);
        const n = input.length;
        const trailing = n - input.replace(/1+$/, "").length;
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ on the first symbol of $${input}$. Its transitions are $${tmTex(incrementer)}$. ${TM_NOTE.en} How many steps does it take before halting?`,
            `一台图灵机从状态 $q_0$、读写头位于 $${input}$ 的第一个符号上开始。它的转移为 $${tmTex(incrementer)}$。${TM_NOTE["zh-CN"]}它停机前共走了多少步？`,
          ),
          answer: run.steps,
          mistakes: apart(run.steps, [
            slip(
              n + 1,
              "That only counts the walk to the blank and back; the machine still has to carry.",
              "这只数了走到空白处再退回的步数；机器还要进位。",
            ),
            slip(n + trailing + 1, "That leaves out the step that writes the final $1$.", "这漏掉了写入最后那个 $1$ 的一步。"),
            ...(trailing > 0
              ? [
                  slip(
                    n + 2,
                    "That leaves out the steps that turn the trailing $1$s into $0$s.",
                    "这漏掉了把末尾的 $1$ 改成 $0$ 的那些步。",
                  ),
                ]
              : []),
            slip(
              2 * n,
              "That walks back over the whole input; the machine halts as soon as it can write the carry.",
              "这假定机器走回整个输入；其实一写下进位机器就停机。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Walk to the blank", "走到空白处"],
                t(
                  `Reading the $${n}$ digits and then the blank, which sends the head back, takes`,
                  `读过 $${n}$ 位数字，再读到让读写头掉头的空白，共用`,
                ),
                [`${n} + 1 = ${n + 1}`],
              ],
              [
                ["Clear the trailing ones", "清除末尾的 1"],
                t(
                  `The input ends in $${trailing}$ trailing $1$s, each turned into $0$ in one step.`,
                  `输入末尾有 $${trailing}$ 个 $1$，每个用一步改成 $0$。`,
                ),
              ],
              [["Write the carry", "写入进位"], t("One more step writes the final $1$ and halts.", "再用一步写入最后的 $1$ 并停机。")],
              [["Add the steps", "把步数相加"], none, [`${n + 1} + ${trailing} + 1 = ${run.steps}`]],
            ],
            t(
              `The formula $n + t + 2$ with $n = ${n}$ and $t = ${trailing}$ gives $${n} + ${trailing} + 2 = ${run.steps}$ as well.`,
              `用公式 $n + t + 2$，取 $n = ${n}$、$t = ${trailing}$，同样得到 $${n} + ${trailing} + 2 = ${run.steps}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** pw writes base^e, or the base alone for the first power. */
const pw = (base: number, e: number) => (e === 1 ? `${base}` : `${base}^{${e}}`);

/** nondeterministicTuringMachines counts the branches of nondeterministic computations. */
export const nondeterministicTuringMachines: TopicDef = {
  id: "nondeterministic-turing-machines",
  title: t("Nondeterministic Turing Machines", "非确定性图灵机"),
  summary: t(
    "A nondeterministic Turing machine may have several possible moves in a configuration, so its computations form a tree; it accepts if some branch accepts. A deterministic machine can simulate it by exploring the tree level by level, which can take exponentially many steps.",
    "非确定性图灵机在一个格局下可能有多种移动，所以它的计算构成一棵树；只要有一个分支接受，它就接受。确定性机器可以逐层探索这棵树来模拟它，这可能需要指数多步。",
  ),
  intro: t(
    "Take a nondeterministic machine with $2$ possible moves at each of its first $2$ steps and $3$ at the next step. Its computation tree has $1$ configuration at depth $0$, then $2$, then $2 \\cdot 2 = 4$, then $4 \\cdot 3 = 12$, so after $3$ steps there are $12$ branches. A breadth-first simulation of the whole tree visits $1 + 2 + 4 + 12 = 19$ configurations.\n\nCheck: $2^2 \\cdot 3 = 12$, and the levels before the last add up to $1 + 2 + 4 = 7$, so $7 + 12 = 19$.\n\nIn this lesson we count the branches of a nondeterministic computation and the configurations a deterministic simulation has to visit.",
    "取一台非确定性机器，它在前 $2$ 步每步有 $2$ 种可能的移动，下一步有 $3$ 种。它的计算树在深度 $0$ 有 $1$ 个格局，然后是 $2$ 个，再是 $2 \\cdot 2 = 4$ 个，再是 $4 \\cdot 3 = 12$ 个，所以 $3$ 步之后有 $12$ 个分支。对整棵树做广度优先模拟要访问 $1 + 2 + 4 + 12 = 19$ 个格局。\n\n检验：$2^2 \\cdot 3 = 12$，最后一层之前各层之和为 $1 + 2 + 4 = 7$，所以 $7 + 12 = 19$。\n\n本课我们数非确定性计算的分支数，以及确定性模拟需要访问的格局数。",
  ),
  prerequisites: ["processing-strings-using-turing-machines", "nondeterministic-finite-automata"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "branches-of-a-nondeterministic-computation",
      title: t("Counting branches", "数分支"),
      explanation: t(
        "If a machine has $2$ choices at each of its first $3$ steps and then $3$ choices at each of the next $2$, its computation tree has $2^3 \\cdot 3^2 = 72$ branches after $5$ steps (if none halts early).\n\n> **Watch out.** The numbers of choices multiply step after step; they do not add. With $2$ choices at each of $3$ steps there are $2^3 = 8$ branches, not $2 \\cdot 3 = 6$ or $2 + 2 + 2 = 6$.",
        "若机器在前 $3$ 步每步有 $2$ 种选择，接下来 $2$ 步每步有 $3$ 种选择，则 $5$ 步之后它的计算树有 $2^3 \\cdot 3^2 = 72$ 个分支（假设没有提前停机）。\n\n> **注意。** 各步的选择数要逐步相乘，而不是相加。$3$ 步每步有 $2$ 种选择时，共有 $2^3 = 8$ 个分支，而不是 $2 \\cdot 3 = 6$ 或 $2 + 2 + 2 = 6$。",
      ),
      generate(rng) {
        let a: number;
        let s1: number;
        let b: number;
        let s2: number;
        let mistakes: Mistake[];
        do {
          const aa = rng.int(2, 3);
          const x1 = rng.int(1, 5);
          const bb = rng.int(2, 4);
          const x2 = rng.int(1, 4);
          a = aa;
          s1 = x1;
          b = bb;
          s2 = x2;
          mistakes = apart(aa ** x1 * bb ** x2, [
            slip(
              aa * x1 + bb * x2,
              "That adds up the choices; each step multiplies the number of branches.",
              "这把选择数相加了；每一步都要把分支数相乘。",
            ),
            slip(
              aa ** x1 + bb ** x2,
              "That adds the two stages; every branch of the first stage splits again in the second, so they multiply.",
              "这把两个阶段相加了；第一阶段的每个分支在第二阶段还要再分叉，所以应相乘。",
            ),
            slip(
              (aa * bb) ** (x1 + x2),
              "That uses both numbers of choices at every step; each stage has its own number of choices.",
              "这在每一步都用了两种选择数；每个阶段有各自的选择数。",
            ),
            slip(
              aa * x1 * bb * x2,
              "That multiplies the choices by the numbers of steps; the choices are raised to the numbers of steps.",
              "这把选择数乘以步数；应当以步数为指数对选择数求幂。",
            ),
          ]);
        } while (mistakes.length < 2);
        const value = a ** s1 * b ** s2;
        const levels = range(0, s1 + s2).map((d) => a ** Math.min(d, s1) * b ** Math.max(0, d - s1));
        return numberProblem({
          prompt: t(
            `A nondeterministic Turing machine has exactly $${a}$ possible moves at each of its first $${s1}$ steps and exactly $${b}$ at each of the next $${s2}$. If no branch halts early, how many branches does its computation tree have after $${s1 + s2}$ steps?`,
            `一台非确定性图灵机在前 $${s1}$ 步每步恰有 $${a}$ 种可能的移动，在接下来的 $${s2}$ 步每步恰有 $${b}$ 种。若没有分支提前停机，$${s1 + s2}$ 步之后它的计算树有多少个分支？`,
          ),
          answer: value,
          mistakes,
          solution: walked(
            [
              [
                ["First stage", "第一阶段"],
                t(
                  `Each of the first $${s1}$ steps multiplies the number of branches by $${a}$, giving $${pw(a, s1)}${s1 > 1 ? ` = ${a ** s1}` : ""}$ branches.`,
                  `前 $${s1}$ 步每步把分支数乘以 $${a}$，得到 $${pw(a, s1)}${s1 > 1 ? ` = ${a ** s1}` : ""}$ 个分支。`,
                ),
              ],
              [
                ["Second stage", "第二阶段"],
                t(`Each of the next $${s2}$ steps multiplies by $${b}$:`, `接下来 $${s2}$ 步每步再乘以 $${b}$：`),
                [`${a ** s1} \\cdot ${pw(b, s2)} = ${value}`],
              ],
            ],
            t(
              `Level by level the tree has $${levels.join(", ")}$ configurations, each level the one before times its number of choices, ending with $${value}$.`,
              `这棵树逐层有 $${levels.join(", ")}$ 个格局，每层是上一层乘以该步的选择数，最后为 $${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "simulating-a-nondeterministic-machine",
      title: t("Deterministic simulation", "确定性模拟"),
      explanation: t(
        "A breadth-first simulation visits every configuration in the tree up to depth $t$. With $b$ choices per step there are $1 + b + \\dots + b^t = \\frac{b^{t+1} - 1}{b - 1}$ of them; for $b = 2$, $t = 4$ that is $31$.\n\n> **Watch out.** Count every level from depth $0$, the starting configuration, to depth $t$: that is $t + 1$ levels. For $b = 3$ and $t = 2$ the simulation visits $1 + 3 + 9 = 13$ configurations, not just the $9$ at the deepest level.",
        "广度优先模拟访问树中深度不超过 $t$ 的所有格局。每步有 $b$ 种选择时，共有 $1 + b + \\dots + b^t = \\frac{b^{t+1} - 1}{b - 1}$ 个；$b = 2$、$t = 4$ 时为 $31$。\n\n> **注意。** 要数从深度 $0$（初始格局）到深度 $t$ 的每一层：共 $t + 1$ 层。$b = 3$、$t = 2$ 时，模拟访问 $1 + 3 + 9 = 13$ 个格局，而不只是最深一层的 $9$ 个。",
      ),
      generate(rng) {
        const b = rng.int(2, 5);
        const tt = rng.int(2, 8);
        const value = (b ** (tt + 1) - 1) / (b - 1);
        const formula =
          b === 2
            ? `\\frac{${b}^{${tt + 1}} - 1}{${b} - 1} = ${value}`
            : `\\frac{${b}^{${tt + 1}} - 1}{${b} - 1} = \\frac{${b ** (tt + 1) - 1}}{${b - 1}} = ${value}`;
        return numberProblem({
          prompt: t(
            `A nondeterministic Turing machine has exactly $${b}$ possible moves in every configuration. A deterministic simulation explores its computation tree breadth-first up to depth $${tt}$, counting the starting configuration. How many configurations does it visit?`,
            `一台非确定性图灵机在每个格局下都恰有 $${b}$ 种可能的移动。确定性模拟用广度优先方式探索它的计算树，直到深度 $${tt}$（含初始格局）。它访问多少个格局？`,
          ),
          answer: value,
          mistakes: apart(value, [
            slip(
              b ** tt,
              "That counts only the deepest level; the simulation visits every level on the way.",
              "这只数了最深的一层；模拟途中要访问每一层。",
            ),
            slip(
              b ** (tt + 1),
              `That is the top of the formula, $${b}^{${tt + 1}}$, without subtracting $1$ and dividing by $${b} - 1$.`,
              `这只是公式的分子部分 $${b}^{${tt + 1}}$，没有减 $1$ 再除以 $${b} - 1$。`,
            ),
            slip(value - 1, "That leaves out the starting configuration at depth $0$.", "这漏掉了深度 $0$ 处的初始格局。"),
            slip(
              b * tt + 1,
              "That adds $b$ configurations per level; each level has $b$ times as many as the one before.",
              "这每层只加了 $b$ 个格局；其实每层是上一层的 $b$ 倍。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Add the levels", "把各层相加"],
                t(
                  `Depth $d$ has $${b}^{d}$ configurations, for $d = 0, 1, \\dots, ${tt}$:`,
                  `深度 $d$ 处有 $${b}^{d}$ 个格局，$d = 0, 1, \\dots, ${tt}$：`,
                ),
                [
                  `${range(0, tt)
                    .map((d) => b ** d)
                    .join(" + ")} = ${value}`,
                ],
              ],
            ],
            t(`The geometric series formula agrees: $${formula}$.`, `等比数列求和公式给出同样的结果：$${formula}$。`),
          ),
        });
      },
    },
  ],
};

/** Growth is a function of n with exponents k such that it is O(nᵏ) (upper) and Ω(nᵏ) (lower), and its dominant part c·nᵉ·(factor). */
interface Growth {
  readonly tex: string;
  readonly upper: number;
  readonly lower: number;
  /** kind is the factor next to the power: none, log₂ n, √n, or 1/log₂ n. */
  readonly kind: "power" | "log" | "root" | "overLog";
  readonly c: number;
  readonly e: number;
  /** p and q are the degrees of the two factors of a product, q = 0 otherwise; r is the degree of a lower-order term, 0 if none. */
  readonly p: number;
  readonly q: number;
  readonly r: number;
  /** keep says which part of the function dominates. */
  readonly keep: Text;
}

/** coef writes a positive coefficient, omitting 1. */
const coef = (c: number) => (c === 1 ? "" : `${c}`);

/** leadTex writes the dominant part of a growth function. */
function leadTex(g: Growth): string {
  const base = `${coef(g.c)}${pwr(g.e)}`;
  if (g.kind === "log") return `${base} \\log_2 n`;
  if (g.kind === "root") return `${base}\\sqrt{n}`;
  if (g.kind === "overLog") return `\\frac{${base}}{\\log_2 n}`;
  return base;
}

/** ratioLine divides the dominant part by nᵏ and writes where the ratio goes as n grows; it reports whether the ratio is bounded and whether it stays away from 0. */
function ratioLine(g: Growth, k: number): string {
  const d = g.e - k;
  const c = g.c;
  const [ratio, limit] =
    g.kind === "power"
      ? d === 0
        ? [`${c}`, ""]
        : d === 1
          ? [`${coef(c)}n`, "\\infty"]
          : [`\\frac{${c}}{n}`, "0"]
      : g.kind === "log"
        ? d === 0
          ? [`${coef(c)}\\log_2 n`, "\\infty"]
          : [`\\frac{${coef(c)}\\log_2 n}{n}`, "0"]
        : g.kind === "root"
          ? d === 0
            ? [`${coef(c)}\\sqrt{n}`, "\\infty"]
            : [`\\frac{${c}}{\\sqrt{n}}`, "0"]
          : d === 0
            ? [`\\frac{${c}}{\\log_2 n}`, "0"]
            : [`\\frac{${coef(c)}n}{\\log_2 n}`, "\\infty"];
  const arrow = limit === "" ? "" : ` \\to ${limit}`;
  return k === 0 ? `${ratio}${arrow}` : `\\frac{${leadTex(g)}}{${pwr(k)}} = ${ratio}${arrow}`;
}

/** factorTex names the extra factor of a growth function. */
const factorTex = (g: Growth) => (g.kind === "root" ? "\\sqrt{n}" : "\\log_2 n");

/** randomGrowth builds a function whose polynomial growth bounds are known. */
function randomGrowth(rng: Rng): Growth {
  const p = rng.int(1, 5);
  const c = rng.int(1, 9);
  const d = rng.int(1, 20);
  const lc = p > 1 ? rng.int(1, 9) : 0;
  const r = p > 1 ? rng.int(1, p - 1) : 0;
  const lowerTerm = p > 1 ? `${coef(lc)}${pwr(r)}` : "";
  const lower = p > 1 ? ` + ${lowerTerm}` : "";
  const np = pwr(p);
  const base = { c, p, q: 0, r };
  switch (rng.int(0, 4)) {
    case 0:
      return {
        ...base,
        tex: `${coef(c)}${np}${lower} + ${d}`,
        upper: p,
        lower: p,
        kind: "power",
        e: p,
        keep: t(
          `For large $n$ the leading term $${coef(c)}${np}$ outweighs the lower-order terms${p > 1 ? ` $${lowerTerm}$ and` : ""} $${d}$.`,
          `$n$ 很大时，首项 $${coef(c)}${np}$ 远大于低阶项${p > 1 ? ` $${lowerTerm}$ 和` : ""} $${d}$。`,
        ),
      };
    case 1:
      return {
        ...base,
        tex: `${coef(c)}${np} \\log_2 n${lower}`,
        upper: p + 1,
        lower: p,
        kind: "log",
        e: p,
        keep:
          p > 1
            ? t(
                `For large $n$ the term $${coef(c)}${np} \\log_2 n$ outweighs $${lowerTerm}$.`,
                `$n$ 很大时，项 $${coef(c)}${np} \\log_2 n$ 远大于 $${lowerTerm}$。`,
              )
            : t(
                `The whole function is $${coef(c)}${np} \\log_2 n$: a power of $n$ times $\\log_2 n$.`,
                `整个函数就是 $${coef(c)}${np} \\log_2 n$：$n$ 的幂乘以 $\\log_2 n$。`,
              ),
      };
    case 2:
      return {
        ...base,
        tex: `${coef(c)}${np}\\sqrt{n} + ${d}`,
        upper: p + 1,
        lower: p,
        kind: "root",
        e: p,
        keep: t(
          `For large $n$ the constant $${d}$ is negligible next to $${coef(c)}${np}\\sqrt{n}$.`,
          `$n$ 很大时，常数 $${d}$ 与 $${coef(c)}${np}\\sqrt{n}$ 相比可以忽略。`,
        ),
      };
    case 3:
      return {
        ...base,
        tex: `\\frac{${coef(c)}${np}}{\\log_2 n}`,
        upper: p,
        lower: p - 1,
        kind: "overLog",
        e: p,
        keep: t(
          `The whole function is $\\frac{${coef(c)}${np}}{\\log_2 n}$: a power of $n$ divided by $\\log_2 n$.`,
          `整个函数就是 $\\frac{${coef(c)}${np}}{\\log_2 n}$：$n$ 的幂除以 $\\log_2 n$。`,
        ),
      };
    default: {
      const q = rng.int(1, 3);
      return {
        ...base,
        q,
        tex: `(${np} + ${d})(${coef(c)}${pwr(q)} - 1)`,
        upper: p + q,
        lower: p + q,
        kind: "power",
        e: p + q,
        keep: t(
          `Multiplying the leading terms of the factors gives $${np} \\cdot ${coef(c)}${pwr(q)} = ${coef(c)}${pwr(p + q)}$, and the other products are of lower order.`,
          `把两个因式的首项相乘得 $${np} \\cdot ${coef(c)}${pwr(q)} = ${coef(c)}${pwr(p + q)}$，其余乘积都是低阶的。`,
        ),
      };
    }
  }
}

/** productSlips are the mistakes of multiplying or dropping the degrees of a product's factors. */
const productSlips = (g: Growth): Mistake[] =>
  g.q > 0
    ? [
        slip(
          g.p * g.q,
          `That multiplies the degrees $${g.p}$ and $${g.q}$; in a product of powers they add.`,
          `这把次数 $${g.p}$ 和 $${g.q}$ 相乘了；幂相乘时指数相加。`,
        ),
        slip(
          Math.max(g.p, g.q),
          "That keeps only the larger factor; both factors grow, so their degrees add.",
          "这只保留了次数较大的因式；两个因式都在增长，所以次数相加。",
        ),
      ]
    : [];

/** FAMILIES are standard growth rates in increasing order. */
const FAMILIES = ["\\log_2 n", "\\sqrt{n}", "n", "n \\log_2 n", "n^2", "n^3", "2^n", "n!"] as const;

/** bigONotation finds polynomial upper bounds and their constants. */
export const bigONotation: TopicDef = {
  id: "big-o-notation",
  title: t("Big-O Notation", "大 O 记号"),
  summary: t(
    "f(n) = O(g(n)) means f grows no faster than g: there are constants C and N with |f(n)| ≤ C·|g(n)| for all n ≥ N. Lower-order terms and constant factors do not matter, and log n = O(nᵉ) for every ε > 0.",
    "f(n) = O(g(n)) 表示 f 的增长不快于 g：存在常数 C 和 N，使得对所有 n ≥ N 都有 |f(n)| ≤ C·|g(n)|。低阶项和常数因子无关紧要，且对任意 ε > 0 都有 log n = O(nᵉ)。",
  ),
  intro: t(
    "Take $f(n) = 5n^2 + 3n$. For $n \\ge 1$ we have $3n \\le 3n^2$, so $5n^2 + 3n \\le 5n^2 + 3n^2 = 8n^2$. The constants $C = 8$ and $N = 1$ witness $f(n) = O(n^2)$. On the other hand $\\frac{f(n)}{n} = 5n + 3$ grows without bound, so $f$ is not $O(n)$, and $2$ is the smallest integer power that works.\n\nCheck: at $n = 1$, $f(1) = 8 \\le 8 \\cdot 1$, and at $n = 10$, $f(10) = 530 \\le 8 \\cdot 100 = 800$.\n\nIn this lesson we find the smallest power of $n$ that bounds a function from above, and the constants that witness such a bound.",
    "取 $f(n) = 5n^2 + 3n$。当 $n \\ge 1$ 时 $3n \\le 3n^2$，所以 $5n^2 + 3n \\le 5n^2 + 3n^2 = 8n^2$。常数 $C = 8$、$N = 1$ 见证了 $f(n) = O(n^2)$。另一方面，$\\frac{f(n)}{n} = 5n + 3$ 无界，所以 $f$ 不是 $O(n)$，$2$ 是可行的最小整数幂。\n\n检验：$n = 1$ 时 $f(1) = 8 \\le 8 \\cdot 1$；$n = 10$ 时 $f(10) = 530 \\le 8 \\cdot 100 = 800$。\n\n本课我们求从上方界住一个函数的 $n$ 的最小幂，以及见证这个界的常数。",
  ),
  prerequisites: ["evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-upper-bounds",
      title: t("Polynomial upper bounds", "多项式上界"),
      explanation: t(
        "A function is big O of another when it eventually stays below a constant multiple of it, so a slowly growing factor like a logarithm can push it past a lower power. $3n^2\\log_2 n$ is $O(n^3)$, since $\\log_2 n \\le n$, but not $O(n^2)$, since $\\log_2 n$ is unbounded. So the smallest integer $k$ with $3n^2 \\log_2 n = O(n^k)$ is $3$.\n\n> **Watch out.** A slowly growing factor still raises the smallest integer exponent. $n^2\\log_2 n$ is not $O(n^2)$, because $\\frac{n^2\\log_2 n}{n^2} = \\log_2 n$ grows without bound, so the smallest $k$ is $3$, not $2$.",
        "当一个函数最终保持在另一个函数的某个常数倍以下时，它就是后者的大 O，所以像对数这样增长缓慢的因子也能使它超过较低的幂。$3n^2\\log_2 n$ 是 $O(n^3)$，因为 $\\log_2 n \\le n$；但不是 $O(n^2)$，因为 $\\log_2 n$ 无界。所以使 $3n^2 \\log_2 n = O(n^k)$ 的最小整数 $k$ 为 $3$。\n\n> **注意。** 增长缓慢的因子同样会抬高最小的整数指数。$n^2\\log_2 n$ 不是 $O(n^2)$，因为 $\\frac{n^2\\log_2 n}{n^2} = \\log_2 n$ 无界，所以最小的 $k$ 是 $3$，而不是 $2$。",
      ),
      generate(rng) {
        const g = randomGrowth(rng);
        const k = g.upper;
        return numberProblem({
          prompt: t(`Find the smallest integer $k$ such that $${g.tex} = O(n^k)$.`, `求使 $${g.tex} = O(n^k)$ 成立的最小整数 $k$。`),
          answer: k,
          mistakes: apart(k, [
            slip(
              k + 1,
              `That is an upper bound, but not the smallest: the function is $O(${pn(k)})$ already.`,
              `这是一个上界，但不是最小的：这个函数已经是 $O(${pn(k)})$。`,
            ),
            ...(g.kind === "power"
              ? [
                  ...productSlips(g),
                  ...(g.r > 0 && g.q === 0
                    ? [
                        slip(
                          g.r,
                          "That is the degree of a lower-order term; the highest power decides.",
                          "这是低阶项的次数；起决定作用的是最高次幂。",
                        ),
                      ]
                    : []),
                  slip(
                    k - 1,
                    `The leading term $${leadTex(g)}$ outgrows every constant multiple of $${pn(k - 1)}$.`,
                    `首项 $${leadTex(g)}$ 终将超过 $${pn(k - 1)}$ 的任何常数倍。`,
                  ),
                ]
              : g.kind === "overLog"
                ? [
                    slip(
                      k - 1,
                      `Dividing by $\\log_2 n$ slows the growth, but by less than a factor of $n$: $\\frac{n}{\\log_2 n}$ is unbounded, so the function is not $O(${pn(k - 1)})$.`,
                      `除以 $\\log_2 n$ 使增长变慢，但慢不到一个 $n$ 的因子：$\\frac{n}{\\log_2 n}$ 无界，所以这个函数不是 $O(${pn(k - 1)})$。`,
                    ),
                  ]
                : [
                    slip(
                      g.p,
                      `That ignores the factor $${factorTex(g)}$, which grows without bound, so the function outgrows every constant multiple of $${pn(g.p)}$.`,
                      `这忽略了因子 $${factorTex(g)}$，它无界，所以这个函数终将超过 $${pn(g.p)}$ 的任何常数倍。`,
                    ),
                  ]),
          ]),
          solution: walked(
            [
              [["Keep the dominant part", "保留主导部分"], g.keep],
              [
                ["Test the power", "检验这个幂"],
                t(
                  `Divide by $${pn(k)}$: the ratio stays bounded, so the function is $O(${pn(k)})$.`,
                  `除以 $${pn(k)}$：比值有界，所以这个函数是 $O(${pn(k)})$。`,
                ),
                [ratioLine(g, k)],
              ],
              [
                ["Try one power lower", "试低一次的幂"],
                t(
                  `Divide by $${pn(k - 1)}$ instead: the ratio grows without bound, so the function is not $O(${pn(k - 1)})$.`,
                  `改为除以 $${pn(k - 1)}$：比值无界，所以这个函数不是 $O(${pn(k - 1)})$。`,
                ),
                [ratioLine(g, k - 1)],
              ],
            ],
            g.upper === g.lower
              ? t(
                  `The function is also $\\Omega(${pn(g.lower)})$, since the first ratio tends to a positive constant, so it grows exactly like $${pn(k)}$ and no smaller power can bound it: $k = ${k}$.`,
                  `第一个比值趋于正常数，所以这个函数也是 $\\Omega(${pn(g.lower)})$，它的增长恰与 $${pn(k)}$ 相当，更小的幂都界不住它：$k = ${k}$。`,
                )
              : t(
                  `The function is $\\Omega(${pn(g.lower)})$ but not $O(${pn(g.lower)})$: its extra factor puts it strictly between $${pn(g.lower)}$ and $${pn(g.upper)}$, so the smallest integer bound is the next power, $k = ${k}$.`,
                  `这个函数是 $\\Omega(${pn(g.lower)})$ 但不是 $O(${pn(g.lower)})$：额外的因子使它严格介于 $${pn(g.lower)}$ 与 $${pn(g.upper)}$ 之间，所以最小的整数界是下一个幂，$k = ${k}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "constants-in-big-o-bounds",
      title: t("Witness constants", "见证常数"),
      explanation: t(
        "To prove a big O bound, exhibit a constant and a starting point beyond which the inequality holds, often by replacing every lower power with the highest one. For $n \\ge 1$, $4n^2 + 3n + 5 \\le 4n^2 + 3n^2 + 5n^2 = 12n^2$, with equality at $n = 1$. So $C = 12$, $N = 1$ witness $4n^2 + 3n + 5 = O(n^2)$, and no smaller $C$ works for all $n \\ge 1$.\n\n> **Watch out.** The leading coefficient alone is not enough when the bound must hold from $n = 1$, where the lower terms weigh the most. For $2n^2 + 5n + 1 \\le Cn^2$, $C = 2$ fails at $n = 1$, since $8 > 2$; the smallest $C$ is $2 + 5 + 1 = 8$.",
        "要证明大 O 界，就要给出一个常数和一个起点，使不等式在此之后成立，常用的方法是把每个低次幂都换成最高次幂。当 $n \\ge 1$ 时，$4n^2 + 3n + 5 \\le 4n^2 + 3n^2 + 5n^2 = 12n^2$，且 $n = 1$ 时取等号。所以 $C = 12$、$N = 1$ 是 $4n^2 + 3n + 5 = O(n^2)$ 的见证，对所有 $n \\ge 1$ 不存在更小的 $C$。\n\n> **注意。** 当界必须从 $n = 1$ 起成立时，只看首项系数是不够的，因为在 $n = 1$ 处低次项的分量最重。对 $2n^2 + 5n + 1 \\le Cn^2$，$C = 2$ 在 $n = 1$ 处不成立，因为 $8 > 2$；最小的 $C$ 是 $2 + 5 + 1 = 8$。",
      ),
      generate(rng) {
        const deg = rng.int(2, 3);
        const cs = range(0, deg).map(() => rng.int(1, 9));
        const term = (c: number, i: number) => `${i === deg ? c : coef(c)}${deg - i === 0 ? "" : deg - i === 1 ? "n" : `n^{${deg - i}}`}`;
        const tex = cs.map(term).join(" + ");
        const value = sum(cs);
        const at2 = sum(cs.map((c, i) => c * 2 ** (deg - i)));
        return numberProblem({
          prompt: t(
            `Find the smallest constant $C$ such that $${tex} \\le Cn^{${deg}}$ for all integers $n \\ge 1$.`,
            `求使 $${tex} \\le Cn^{${deg}}$ 对所有整数 $n \\ge 1$ 成立的最小常数 $C$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            slip(
              cs[0]!,
              "That is the leading coefficient alone; at $n = 1$ the lower terms count in full.",
              "这只是首项系数；在 $n = 1$ 处低次项要全部计入。",
            ),
            slip(
              value - cs[deg]!,
              "That leaves out the constant term, which also counts at $n = 1$.",
              "这漏掉了常数项，它在 $n = 1$ 处同样要计入。",
            ),
            slip(
              Math.max(...cs),
              "That takes the largest coefficient; the bound needs all of them added.",
              "这取的是最大的系数；这个界需要把所有系数相加。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Raise every power to the highest", "把每个幂都升到最高次"],
                t(`For $n \\ge 1$ each lower power is at most $n^{${deg}}$:`, `当 $n \\ge 1$ 时，每个低次幂都不超过 $n^{${deg}}$：`),
                [`${tex} \\le ${cs.map((c) => `${coef(c)}n^{${deg}}`).join(" + ")} = ${value}n^{${deg}}`],
              ],
              [
                ["Look at n = 1", "看 n = 1 的情形"],
                t("At $n = 1$ both sides are equal, so no smaller constant works:", "在 $n = 1$ 处两边相等，所以更小的常数都不行："),
                [`${cs.join(" + ")} = ${value} = ${value} \\cdot 1^{${deg}}`],
              ],
            ],
            t(
              `At $n = 2$ the bound holds with room to spare: the left side is $${at2}$ and $${value} \\cdot 2^{${deg}} = ${value * 2 ** deg}$.`,
              `在 $n = 2$ 处这个界成立且有余量：左边为 $${at2}$，而 $${value} \\cdot 2^{${deg}} = ${value * 2 ** deg}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** sum adds numbers. */
function sum(xs: readonly number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

/** bigOmegaNotation finds polynomial lower bounds and compares growth rates. */
export const bigOmegaNotation: TopicDef = {
  id: "big-omega-notation",
  title: t("Big-Omega Notation", "大 Ω 记号"),
  summary: t(
    "f(n) = Ω(g(n)) means f grows at least as fast as g: there are constants c > 0 and N with f(n) ≥ c·g(n) for all n ≥ N. Equivalently, g(n) = O(f(n)).",
    "f(n) = Ω(g(n)) 表示 f 的增长至少与 g 一样快：存在常数 c > 0 和 N，使得对所有 n ≥ N 都有 f(n) ≥ c·g(n)。等价地，g(n) = O(f(n))。",
  ),
  intro: t(
    "Take $f(n) = n^2 - 4n$. For $n \\ge 8$ we have $4n \\le \\frac{n^2}{2}$, so $f(n) \\ge n^2 - \\frac{n^2}{2} = \\frac{n^2}{2}$. The constants $c = \\frac{1}{2}$ and $N = 8$ witness $f(n) = \\Omega(n^2)$. But $\\frac{f(n)}{n^3} = \\frac{1}{n} - \\frac{4}{n^2}$ tends to $0$, so $f$ is not $\\Omega(n^3)$, and $2$ is the largest integer power that works.\n\nCheck: at $n = 8$, $f(8) = 64 - 32 = 32 = \\frac{64}{2}$, and at $n = 10$, $f(10) = 60 \\ge 50$.\n\nIn this lesson we find the largest power of $n$ that bounds a function from below, and compare standard growth rates with $\\Omega$.",
    "取 $f(n) = n^2 - 4n$。当 $n \\ge 8$ 时 $4n \\le \\frac{n^2}{2}$，所以 $f(n) \\ge n^2 - \\frac{n^2}{2} = \\frac{n^2}{2}$。常数 $c = \\frac{1}{2}$、$N = 8$ 见证了 $f(n) = \\Omega(n^2)$。但 $\\frac{f(n)}{n^3} = \\frac{1}{n} - \\frac{4}{n^2}$ 趋于 $0$，所以 $f$ 不是 $\\Omega(n^3)$，$2$ 是可行的最大整数幂。\n\n检验：$n = 8$ 时 $f(8) = 64 - 32 = 32 = \\frac{64}{2}$；$n = 10$ 时 $f(10) = 60 \\ge 50$。\n\n本课我们求从下方界住一个函数的 $n$ 的最大幂，并用 $\\Omega$ 比较标准的增长率。",
  ),
  prerequisites: ["big-o-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-lower-bounds",
      title: t("Polynomial lower bounds", "多项式下界"),
      explanation: t(
        "A lower bound means the function eventually grows at least as fast as a constant multiple of the bound, ignoring small values. $\\frac{n^3}{\\log_2 n}$ is $\\Omega(n^2)$, since $\\log_2 n \\le n$, but not $\\Omega(n^3)$. So the largest integer $k$ with $\\frac{n^3}{\\log_2 n} = \\Omega(n^k)$ is $2$.\n\n> **Watch out.** A factor that grows more slowly than any power of $n$, like $\\log_2 n$, does not raise the exponent of a lower bound. $n^2\\log_2 n$ is $\\Omega(n^2)$ but not $\\Omega(n^3)$, since $\\frac{n^2 \\log_2 n}{n^3} = \\frac{\\log_2 n}{n} \\to 0$, so the largest $k$ is $2$, not $3$.",
        "下界的意思是，不计较小的值，函数最终至少与界的某个常数倍增长得一样快。$\\frac{n^3}{\\log_2 n}$ 是 $\\Omega(n^2)$，因为 $\\log_2 n \\le n$；但不是 $\\Omega(n^3)$。所以使 $\\frac{n^3}{\\log_2 n} = \\Omega(n^k)$ 的最大整数 $k$ 为 $2$。\n\n> **注意。** 像 $\\log_2 n$ 这样比 $n$ 的任何幂都增长得慢的因子，不会抬高下界的指数。$n^2\\log_2 n$ 是 $\\Omega(n^2)$ 但不是 $\\Omega(n^3)$，因为 $\\frac{n^2 \\log_2 n}{n^3} = \\frac{\\log_2 n}{n} \\to 0$，所以最大的 $k$ 是 $2$，而不是 $3$。",
      ),
      generate(rng) {
        const g = randomGrowth(rng);
        const k = g.lower;
        return numberProblem({
          prompt: t(
            `Find the largest integer $k$ such that $${g.tex} = \\Omega(n^k)$.`,
            `求使 $${g.tex} = \\Omega(n^k)$ 成立的最大整数 $k$。`,
          ),
          answer: k,
          mistakes: apart(k, [
            slip(
              k - 1,
              `That is a lower bound, but not the largest: the function is $\\Omega(${pn(k)})$ already.`,
              `这是一个下界，但不是最大的：这个函数已经是 $\\Omega(${pn(k)})$。`,
            ),
            ...(g.kind === "power"
              ? [
                  ...productSlips(g),
                  slip(
                    k + 1,
                    `The ratio of the function to $${pn(k + 1)}$ tends to $0$, so it is not $\\Omega(${pn(k + 1)})$.`,
                    `这个函数与 $${pn(k + 1)}$ 的比值趋于 $0$，所以它不是 $\\Omega(${pn(k + 1)})$。`,
                  ),
                ]
              : g.kind === "overLog"
                ? [
                    slip(
                      g.p,
                      `Dividing by $\\log_2 n$ takes the function below every constant multiple of $${pn(g.p)}$, so it is not $\\Omega(${pn(g.p)})$.`,
                      `除以 $\\log_2 n$ 使这个函数终将低于 $${pn(g.p)}$ 的任何常数倍，所以它不是 $\\Omega(${pn(g.p)})$。`,
                    ),
                  ]
                : [
                    slip(
                      g.p + 1,
                      `The factor $${factorTex(g)}$ grows more slowly than $n$, so the function is not $\\Omega(${pn(g.p + 1)})$; it is only $O(${pn(g.p + 1)})$.`,
                      `因子 $${factorTex(g)}$ 比 $n$ 增长得慢，所以这个函数不是 $\\Omega(${pn(g.p + 1)})$，只是 $O(${pn(g.p + 1)})$。`,
                    ),
                  ]),
          ]),
          solution: walked(
            [
              [["Keep the dominant part", "保留主导部分"], g.keep],
              [
                ["Test the power", "检验这个幂"],
                t(
                  `Divide by $${pn(k)}$: the ratio stays away from $0$, so the function is $\\Omega(${pn(k)})$.`,
                  `除以 $${pn(k)}$：比值不趋于 $0$，所以这个函数是 $\\Omega(${pn(k)})$。`,
                ),
                [ratioLine(g, k)],
              ],
              [
                ["Try one power higher", "试高一次的幂"],
                t(
                  `Divide by $${pn(k + 1)}$ instead: the ratio tends to $0$, so the function is not $\\Omega(${pn(k + 1)})$.`,
                  `改为除以 $${pn(k + 1)}$：比值趋于 $0$，所以这个函数不是 $\\Omega(${pn(k + 1)})$。`,
                ),
                [ratioLine(g, k + 1)],
              ],
            ],
            g.upper === g.lower
              ? t(
                  `The function is also $O(${pn(g.upper)})$, since the first ratio is a constant, so it grows exactly like $${pn(k)}$ and no larger power fits under it: $k = ${k}$.`,
                  `第一个比值是常数，所以这个函数也是 $O(${pn(g.upper)})$，它的增长恰与 $${pn(k)}$ 相当，更大的幂都放不到它下面：$k = ${k}$。`,
                )
              : t(
                  `The function is $O(${pn(g.upper)})$ but not $\\Omega(${pn(g.upper)})$: its extra factor puts it strictly between $${pn(g.lower)}$ and $${pn(g.upper)}$, so the largest integer lower bound is the power below, $k = ${k}$.`,
                  `这个函数是 $O(${pn(g.upper)})$ 但不是 $\\Omega(${pn(g.upper)})$：额外的因子使它严格介于 $${pn(g.lower)}$ 与 $${pn(g.upper)}$ 之间，所以最大的整数下界是下面的那个幂，$k = ${k}$。`,
                ),
          ),
        });
      },
    },
    {
      id: "comparing-growth-rates",
      title: t("Comparing growth rates", "比较增长率"),
      explanation: t(
        "The standard growth rates in increasing order are $\\log n, \\sqrt{n}, n, n\\log n, n^2, n^3, 2^n, n!$. A function is $\\Omega$ of every rate at or below its own, whatever the constant factors.\n\n> **Watch out.** A large constant factor does not change the order. $1000\\sqrt{n}$ is not $\\Omega(n)$, since $\\frac{1000\\sqrt{n}}{n} = \\frac{1000}{\\sqrt{n}} \\to 0$.",
        "标准增长率由慢到快依次为 $\\log n, \\sqrt{n}, n, n\\log n, n^2, n^3, 2^n, n!$。一个函数是其自身及更慢的每个增长率的 $\\Omega$，与常数因子无关。\n\n> **注意。** 很大的常数因子也改变不了增长的次序。$1000\\sqrt{n}$ 不是 $\\Omega(n)$，因为 $\\frac{1000\\sqrt{n}}{n} = \\frac{1000}{\\sqrt{n}} \\to 0$。",
      ),
      generate(rng) {
        const [i, j] = rng.sample(range(0, FAMILIES.length - 1), 2);
        const c = rng.int(2, 50);
        const yes = i! >= j!;
        const fi = FAMILIES[i!]!;
        const fj = FAMILIES[j!]!;
        const f = `${c} \\cdot ${fi}`;
        return verdictChoice(rng, {
          prompt: t(`Is $${f} = \\Omega(${fj})$?`, `$${f} = \\Omega(${fj})$ 成立吗？`),
          holds: yes,
          yes: t(
            `$${fi}$ grows faster than $${fj}$, and the constant $${c}$ only helps`,
            `$${fi}$ 比 $${fj}$ 增长得快，常数 $${c}$ 只会有利`,
          ),
          no: t(
            `$${fi}$ grows more slowly than $${fj}$, and no constant factor makes up for that`,
            `$${fi}$ 比 $${fj}$ 增长得慢，任何常数因子都无法弥补`,
          ),
          yesWrong: t(`the constant $${c}$ is large`, `常数 $${c}$ 很大`),
          noWrong: t(`the function has a constant factor $${c}$ in front`, `这个函数前面有常数因子 $${c}$`),
          solution: walked(
            [
              [
                ["Place both rates in the order", "把两个增长率放进次序中"],
                t("The standard rates, from slowest to fastest, are", "标准增长率由慢到快为"),
                [FAMILIES.join(",\\ ")],
              ],
              [
                ["Compare them", "比较"],
                t(
                  `Here $${fi}$ is number $${i! + 1}$ and $${fj}$ is number $${j! + 1}$, so $${fi}$ grows ${yes ? "faster than" : "more slowly than"} $${fj}$. The factor $${c}$ does not change that, so $${f} ${yes ? "=" : "\\ne"} \\Omega(${fj})$.`,
                  `这里 $${fi}$ 排第 $${i! + 1}$ 位，$${fj}$ 排第 $${j! + 1}$ 位，所以 $${fi}$ 比 $${fj}$ 增长得${yes ? "快" : "慢"}。因子 $${c}$ 改变不了这一点，所以 $${f} ${yes ? "=" : "\\ne"} \\Omega(${fj})$。`,
                ),
              ],
            ],
            t(
              `The ratio $\\frac{${f}}{${fj}}$ tends to $${yes ? "\\infty" : "0"}$ as $n$ grows, which is ${yes ? "at least a positive constant from some point on" : "eventually below every positive constant"}.`,
              `当 $n$ 增大时，比值 $\\frac{${f}}{${fj}}$ 趋于 $${yes ? "\\infty" : "0"}$，${yes ? "从某处起至少是一个正常数" : "终将小于任何正常数"}。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Loop is a loop nest with its exact count, written as pseudocode. */
interface Loop {
  /** how writes the count as a sum or product of the loop's bounds. */
  readonly how: string;
  readonly en: string;
  readonly zh: string;
  readonly count: (n: number) => number;
  readonly theta: string;
  /** at substitutes a value of n into the count. */
  readonly at: (n: number) => string;
  /** byHand lists the passes of the inner statement for n = 3. */
  readonly byHand: string;
  /** slips are the typical wrong counts for a value of n. */
  readonly slips: (n: number) => Mistake[];
}

/** fl is ⌊log₂ n⌋. */
const fl = (n: number) => Math.floor(Math.log2(n));

/** LOOPS are loop nests whose number of executions of the inner statement is known. */
const LOOPS: readonly Loop[] = [
  {
    en: "for $i = 1$ to $n$: for $j = 1$ to $i$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = 1$ 到 $i$：$x \\leftarrow x + 1$",
    count: (n) => (n * (n + 1)) / 2,
    how: "\\sum_{i=1}^{n} i = \\frac{n(n + 1)}{2}",
    theta: "n^2",
    at: (n) => `\\frac{${n} \\cdot ${n + 1}}{2} = ${(n * (n + 1)) / 2}`,
    byHand: "1 + 2 + 3",
    slips: (n) => [
      slip(
        n * n,
        "That runs the inner loop $n$ times on every pass; it runs $i$ times.",
        "这让内层循环每轮都执行 $n$ 次；其实它执行 $i$ 次。",
      ),
      slip(
        (n * (n - 1)) / 2,
        "That stops the inner loop at $i - 1$; it runs up to $i$ itself.",
        "这让内层循环停在 $i - 1$；其实它一直执行到 $i$。",
      ),
    ],
  },
  {
    en: "for $i = 1$ to $n$: for $j = i + 1$ to $n$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = i + 1$ 到 $n$：$x \\leftarrow x + 1$",
    count: (n) => (n * (n - 1)) / 2,
    how: "\\sum_{i=1}^{n} (n - i) = \\frac{n(n - 1)}{2}",
    theta: "n^2",
    at: (n) => `\\frac{${n} \\cdot ${n - 1}}{2} = ${(n * (n - 1)) / 2}`,
    byHand: "2 + 1 + 0",
    slips: (n) => [
      slip(
        (n * (n + 1)) / 2,
        "That starts $j$ at $i$; it starts at $i + 1$, so pass $i$ runs $n - i$ times.",
        "这让 $j$ 从 $i$ 开始；其实它从 $i + 1$ 开始，所以第 $i$ 轮执行 $n - i$ 次。",
      ),
      slip(n * n, "That runs the inner loop $n$ times on every pass.", "这让内层循环每轮都执行 $n$ 次。"),
    ],
  },
  {
    en: "for $i = 1$ to $n$: for $j = 1$ to $n$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = 1$ 到 $n$：$x \\leftarrow x + 1$",
    count: (n) => n * n,
    how: "n \\cdot n",
    theta: "n^2",
    at: (n) => `${n} \\cdot ${n} = ${n * n}`,
    byHand: "3 + 3 + 3",
    slips: (n) => [
      slip(2 * n, "That adds the lengths of the loops; nested loops multiply.", "这把两层循环的长度相加了；嵌套循环应相乘。"),
      slip(
        (n * (n + 1)) / 2,
        "That runs the inner loop only up to $i$; here it runs up to $n$.",
        "这让内层循环只执行到 $i$；这里它执行到 $n$。",
      ),
    ],
  },
  {
    en: "for $i = 1$ to $n$: for $j = 1$ to $i$: for $k = 1$ to $j$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = 1$ 到 $i$：对 $k = 1$ 到 $j$：$x \\leftarrow x + 1$",
    count: (n) => (n * (n + 1) * (n + 2)) / 6,
    how: "\\sum_{i=1}^{n} \\sum_{j=1}^{i} j = \\frac{n(n + 1)(n + 2)}{6}",
    theta: "n^3",
    at: (n) => `\\frac{${n} \\cdot ${n + 1} \\cdot ${n + 2}}{6} = ${(n * (n + 1) * (n + 2)) / 6}`,
    byHand: "1 + (1 + 2) + (1 + 2 + 3)",
    slips: (n) => [
      slip(
        n ** 3,
        "That runs every loop $n$ times; the inner bounds depend on the outer variables.",
        "这让每层循环都执行 $n$ 次；内层的上限依赖于外层变量。",
      ),
      slip(
        (n * (n + 1) * (2 * n + 1)) / 6,
        "That takes $i^2$ passes for each $i$; the two inner loops run $1 + 2 + \\dots + i = \\frac{i(i + 1)}{2}$ times.",
        "这对每个 $i$ 取了 $i^2$ 次；内两层循环执行 $1 + 2 + \\dots + i = \\frac{i(i + 1)}{2}$ 次。",
      ),
    ],
  },
  {
    en: "$i \\leftarrow 1$; while $i \\le n$: $x \\leftarrow x + 1$; $i \\leftarrow 2i$",
    zh: "$i \\leftarrow 1$；当 $i \\le n$ 时：$x \\leftarrow x + 1$；$i \\leftarrow 2i$",
    count: (n) => fl(n) + 1,
    how: "\\lfloor \\log_2 n \\rfloor + 1",
    theta: "\\log n",
    at: (n) => `\\lfloor \\log_2 ${n} \\rfloor + 1 = ${fl(n)} + 1 = ${fl(n) + 1}`,
    byHand: "i = 1, 2",
    slips: (n) => [
      slip(fl(n), "That leaves out the pass with $i = 1$.", "这漏掉了 $i = 1$ 的那一轮。"),
      slip(n, "That increases $i$ by $1$ each time; it doubles.", "这让 $i$ 每次加 $1$；其实它每次加倍。"),
    ],
  },
  {
    en: "for $i = 1$ to $n$: $j \\leftarrow 1$; while $j \\le n$: $x \\leftarrow x + 1$; $j \\leftarrow 2j$",
    zh: "对 $i = 1$ 到 $n$：$j \\leftarrow 1$；当 $j \\le n$ 时：$x \\leftarrow x + 1$；$j \\leftarrow 2j$",
    count: (n) => n * (fl(n) + 1),
    how: "n(\\lfloor \\log_2 n \\rfloor + 1)",
    theta: "n \\log n",
    at: (n) => `${n} \\cdot (${fl(n)} + 1) = ${n * (fl(n) + 1)}`,
    byHand: "2 + 2 + 2",
    slips: (n) => [
      slip(n * fl(n), "That leaves out the pass with $j = 1$ of the inner loop.", "这漏掉了内层循环中 $j = 1$ 的那一轮。"),
      slip(
        n * n,
        "That runs the inner loop $n$ times; $j$ doubles, so it runs about $\\log_2 n$ times.",
        "这让内层循环执行 $n$ 次；$j$ 每次加倍，所以它只执行约 $\\log_2 n$ 次。",
      ),
    ],
  },
];

/** bigThetaNotation finds exact growth rates. */
export const bigThetaNotation: TopicDef = {
  id: "big-theta-notation",
  title: t("Big-Theta Notation", "大 Θ 记号"),
  summary: t(
    "f(n) = Θ(g(n)) means f is both O(g(n)) and Ω(g(n)): f grows at the same rate as g, up to constant factors. A polynomial of degree k is Θ(nᵏ), and the running time of nested loops is found by counting how often the innermost statement runs.",
    "f(n) = Θ(g(n)) 表示 f 既是 O(g(n)) 又是 Ω(g(n))：在常数因子范围内，f 与 g 以相同速率增长。k 次多项式是 Θ(nᵏ)，嵌套循环的运行时间通过数最内层语句执行的次数求得。",
  ),
  intro: t(
    "Take $f(n) = (n + 1)(2n - 3)$. Multiplying out gives $2n^2 - n - 3$, whose leading term is $2n^2$, so $\\frac{f(n)}{n^2} = 2 - \\frac{1}{n} - \\frac{3}{n^2}$ tends to $2$. A ratio that tends to a positive constant makes $f$ both $O(n^2)$ and $\\Omega(n^2)$, so $f(n) = \\Theta(n^2)$.\n\nCheck: at $n = 100$, $f(100) = 101 \\cdot 197 = 19897$, close to $2 \\cdot 100^2 = 20000$.\n\nIn this lesson we find the exact growth rate of products, quotients and sums of powers, and of loops, by counting how often the innermost statement runs.",
    "取 $f(n) = (n + 1)(2n - 3)$。展开得 $2n^2 - n - 3$，首项为 $2n^2$，所以 $\\frac{f(n)}{n^2} = 2 - \\frac{1}{n} - \\frac{3}{n^2}$ 趋于 $2$。比值趋于正常数，说明 $f$ 既是 $O(n^2)$ 又是 $\\Omega(n^2)$，所以 $f(n) = \\Theta(n^2)$。\n\n检验：$n = 100$ 时，$f(100) = 101 \\cdot 197 = 19897$，接近 $2 \\cdot 100^2 = 20000$。\n\n本课我们求幂的积、商与和的确切增长率，并通过数最内层语句执行的次数求循环的确切增长率。",
  ),
  prerequisites: ["big-omega-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exact-polynomial-growth",
      title: t("Exact growth rates", "确切增长率"),
      explanation: t(
        "For products and quotients of polynomials, only the leading terms matter, so the exponent of the growth rate comes from adding or subtracting degrees. $(n^2 + 3)(2n - 1)$ has leading term $2n^3$, so it is $\\Theta(n^3)$. For a quotient, subtract the degrees: $\\frac{n^5 + n}{n^2 + 1} = \\Theta(n^3)$.\n\n> **Watch out.** In a product the degrees add; they do not multiply. $(n^2 + 1)(n^3 - 4)$ has leading term $n^5$, so it is $\\Theta(n^5)$, not $\\Theta(n^6)$.",
        "对于多项式的乘积和商，只有首项起作用，所以增长率的指数由次数相加或相减得到。$(n^2 + 3)(2n - 1)$ 的首项为 $2n^3$，所以它是 $\\Theta(n^3)$。对于商，用次数相减：$\\frac{n^5 + n}{n^2 + 1} = \\Theta(n^3)$。\n\n> **注意。** 乘积中次数相加，而不是相乘。$(n^2 + 1)(n^3 - 4)$ 的首项为 $n^5$，所以它是 $\\Theta(n^5)$，而不是 $\\Theta(n^6)$。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(1, 4);
        const c1 = rng.int(1, 9);
        const c2 = rng.int(1, 9);
        const kind = rng.int(0, 2);
        let tex: string;
        let k: number;
        let lead: string;
        let constant: number;
        let mistakes: Mistake[];
        if (kind === 0) {
          tex = `(${coef(c1)}${pwr(a)} + ${c2})(${pwr(b)} - ${rng.int(1, 9)})`;
          k = a + b;
          constant = c1;
          lead = `${coef(c1)}${pwr(a)} \\cdot ${pwr(b)} = ${coef(c1)}${pwr(a + b)}`;
          mistakes = [
            slip(a * b, "That multiplies the degrees; in a product of powers they add.", "这把次数相乘了；幂相乘时指数相加。"),
            slip(
              Math.max(a, b),
              "That keeps only the factor of higher degree; both factors grow, so their degrees add.",
              "这只保留了次数较高的因式；两个因式都在增长，所以次数相加。",
            ),
            slip(
              Math.abs(a - b),
              "That subtracts the degrees, as for a quotient; this is a product.",
              "这把次数相减了，那是商的做法；这里是乘积。",
            ),
          ];
        } else if (kind === 1) {
          tex = `\\frac{${coef(c1)}${pwr(a + b)} + ${c2}n}{${pwr(b)} + ${rng.int(1, 9)}}`;
          k = a;
          constant = c1;
          lead = `\\frac{${coef(c1)}${pwr(a + b)}}{${pwr(b)}} = ${coef(c1)}${pwr(a)}`;
          mistakes = [
            slip(a + b, "That ignores the denominator, which grows too.", "这忽略了分母，而分母也在增长。"),
            slip(a + 2 * b, "That adds the denominator's degree instead of subtracting it.", "这把分母的次数加上了，而应减去。"),
          ];
        } else {
          tex = `${coef(c1)}${pwr(a)} + ${coef(c2)}${pwr(a + b)} + ${rng.int(1, 20)}`;
          k = a + b;
          constant = c2;
          lead = `${coef(c2)}${pwr(a + b)}`;
          mistakes = [
            slip(
              a,
              "That takes the exponent of the first term; in a sum the highest power wins, wherever it is written.",
              "这取的是第一项的指数；在和中起决定作用的是最高次幂，不论它写在哪里。",
            ),
            slip(
              2 * a + b,
              "That adds the exponents of the two terms; in a sum only the largest counts.",
              "这把两项的指数相加了；在和中只看最大的那个。",
            ),
          ];
        }
        return numberProblem({
          prompt: t(`Find $k$ such that $${tex} = \\Theta(n^k)$.`, `求使 $${tex} = \\Theta(n^k)$ 成立的 $k$。`),
          answer: k,
          mistakes: apart(k, mistakes),
          solution: walked(
            [
              [
                ["Find the leading term", "找出首项"],
                kind === 0
                  ? t("Multiply the leading terms of the two factors:", "把两个因式的首项相乘：")
                  : kind === 1
                    ? t("Divide the leading term of the numerator by that of the denominator:", "用分子的首项除以分母的首项：")
                    : t("The term with the highest power is", "次数最高的项为"),
                [lead],
              ],
              [
                ["Read off the exponent", "读出指数"],
                t(`So the function grows like $${pwr(k)}$ and $k = ${k}$.`, `所以这个函数的增长与 $${pwr(k)}$ 相当，$k = ${k}$。`),
              ],
            ],
            t(
              `The ratio of the function to $${pwr(k)}$ tends to $${constant}$, a positive constant, so the function is both $O(${pwr(k)})$ and $\\Omega(${pwr(k)})$.`,
              `这个函数与 $${pwr(k)}$ 的比值趋于正常数 $${constant}$，所以它既是 $O(${pwr(k)})$ 又是 $\\Omega(${pwr(k)})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-steps-of-loops",
      title: t("Counting loop steps", "数循环步数"),
      explanation: t(
        'In "for $i = 1$ to $n$: for $j = 1$ to $i$", the inner statement runs $1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}$ times, which is $\\Theta(n^2)$. A loop that doubles $i$ until it exceeds $n$ runs $\\lfloor \\log_2 n \\rfloor + 1$ times.\n\n> **Watch out.** An inner loop whose bound depends on $i$ runs a different number of times on each pass, so add the passes instead of multiplying by $n$. For $n = 4$, "for $i = 1$ to $n$: for $j = 1$ to $i$" runs $1 + 2 + 3 + 4 = 10$ times, not $16$.',
        "在“对 $i = 1$ 到 $n$：对 $j = 1$ 到 $i$”中，内层语句执行 $1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}$ 次，即 $\\Theta(n^2)$。把 $i$ 不断加倍直到超过 $n$ 的循环执行 $\\lfloor \\log_2 n \\rfloor + 1$ 次。\n\n> **注意。** 上限依赖于 $i$ 的内层循环在每一轮执行的次数不同，所以要把各轮相加，而不是乘以 $n$。$n = 4$ 时，“对 $i = 1$ 到 $n$：对 $j = 1$ 到 $i$”执行 $1 + 2 + 3 + 4 = 10$ 次，而不是 $16$ 次。",
      ),
      generate(rng) {
        const loop = rng.pick(LOOPS);
        const n = rng.int(5, 40);
        const value = loop.count(n);
        return numberProblem({
          prompt: t(
            `How many times is $x \\leftarrow x + 1$ executed by the following code when $n = ${n}$? ${loop.en}`,
            `当 $n = ${n}$ 时，下面的代码执行 $x \\leftarrow x + 1$ 多少次？${loop.zh}`,
          ),
          answer: value,
          mistakes: apart(value, [
            ...loop.slips(n),
            slip(value - 1, "That is one short: count the first and the last pass.", "这少了一次：第一轮和最后一轮都要算。"),
          ]),
          solution: walked(
            [
              [
                ["Write the count", "写出次数"],
                t("Adding up the passes of the inner statement gives", "把内层语句各轮的执行次数相加，得到"),
                [loop.how],
              ],
              [["Substitute the value of n", "代入 n 的值"], t(`With $n = ${n}$:`, `取 $n = ${n}$：`), [loop.at(n)]],
            ],
            t(
              `For $n = 3$ the passes can be counted by hand, $${loop.byHand}$, which is $${loop.count(3)}$, the value the formula gives. In general this loop is $\\Theta(${loop.theta})$.`,
              `$n = 3$ 时可以直接数出各轮：$${loop.byHand}$，共 $${loop.count(3)}$ 次，与公式给出的值相同。一般地，这个循环是 $\\Theta(${loop.theta})$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsAutomataTopics are the topics of Discrete Mathematics unit 8. */
export const discreteMathematicsAutomataTopics: readonly TopicDef[] = [
  mealyMachines,
  mooreMachines,
  deterministicFiniteAutomata,
  processingStringsUsingDeterministicFiniteAutomata,
  nondeterministicFiniteAutomata,
  theLanguageOfAutomata,
  regularExpressions,
  introductionToTuringMachines,
  processingStringsUsingTuringMachines,
  nondeterministicTuringMachines,
  bigONotation,
  bigOmegaNotation,
  bigThetaNotation,
];
