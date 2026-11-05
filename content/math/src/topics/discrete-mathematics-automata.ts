import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { choiceProblem, numberProblem, verdictChoice, yesNo } from "../problems.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 8: finite-state machines, Turing machines and algorithmic complexity.

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

/** stringChoice builds a multiple-choice problem whose options are strings, the right one among distinct wrong ones. */
function stringChoice(rng: Rng, prompt: Text, right: string, wrong: readonly string[], fill: () => string, solution: Text) {
  const options = [right];
  for (const w of [...wrong, ...range(1, 40).map(fill)]) {
    if (options.length === 4) break;
    if (!options.includes(w)) options.push(w);
  }
  const order = rng.shuffle(range(0, options.length - 1));
  return choiceProblem({
    prompt,
    options: order.map((i) => t(`$${options[i]}$`, `$${options[i]}$`)),
    correct: order.indexOf(0),
    solution,
  });
}

/** flip changes one random symbol of a binary string. */
const flip = (rng: Rng, s: string) => {
  const i = rng.int(0, s.length - 1);
  return s.slice(0, i) + (s[i] === "0" ? "1" : "0") + s.slice(i + 1);
};

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

/** DFA_NOTE explains the table notation for DFAs. */
const DFA_NOTE = t("($\\to$ marks the start state and $*$ the accepting states.)", "（$\\to$ 标出初始状态，$*$ 标出接受状态。）");

/** mealyMachines runs finite-state transducers whose outputs belong to transitions. */
/** pwr writes $n^k$, or plain $n$ for the first power. */
const pwr = (k: number): string => (k === 1 ? "n" : `n^{${k}}`);

export const mealyMachines: TopicDef = {
  id: "mealy-machines",
  title: t("Mealy Machines", "Mealy 机"),
  summary: t(
    "A Mealy machine is a finite-state transducer: from each state, each input symbol leads to a next state and produces an output symbol. Reading an input string of length n produces an output string of length n.",
    "Mealy 机是一种有限状态转换器：在每个状态下，每个输入符号都导向一个下一状态并产生一个输出符号。读入长度为 n 的输入串产生长度为 n 的输出串。",
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
        "An entry $q_1/0$ in row $q_0$, column $1$ means: in state $q_0$, reading $1$, output $0$ and move to $q_1$. Follow the input symbol by symbol from the start state, writing down the outputs.",
        "$q_0$ 行、$1$ 列中的 $q_1/0$ 表示：在状态 $q_0$ 读入 $1$ 时，输出 $0$ 并转到 $q_1$。从初始状态出发逐个读入符号，记下输出。",
      ),
      generate(rng) {
        const m = randomMachine(rng, rng.int(2, 3));
        const w = randomWord(rng, rng.int(5, 7));
        const out = mealyOutput(m, w);
        return stringChoice(
          rng,
          t(
            `A Mealy machine with start state $q_0$ has transition table $${mealyTable(m)}$, where $q_j/b$ means "go to $q_j$ and output $b$". What does it output on input $${w}$?`,
            `一个初始状态为 $q_0$ 的 Mealy 机的转移表为 $${mealyTable(m)}$，其中 $q_j/b$ 表示“转到 $q_j$ 并输出 $b$”。输入 $${w}$ 时它输出什么？`,
          ),
          out,
          [mooreOutput(m, w).slice(1), [...out].reverse().join(""), w],
          () => flip(rng, out),
          t(
            `The states are $${traceTex(trace(m, w))}$, and the outputs along the way are $${out}$.`,
            `状态依次为 $${traceTex(trace(m, w))}$，沿途的输出为 $${out}$。`,
          ),
        );
      },
    },
    {
      id: "states-of-mealy-machines",
      title: t("The final state", "最终状态"),
      explanation: t(
        "The outputs do not affect the transitions: to find where the machine ends, follow only the next-state parts of the entries.",
        "输出不影响转移：要找出机器停在哪个状态，只需跟随表中各项的下一状态部分。",
      ),
      generate(rng) {
        const m = randomMachine(rng, 3);
        const w = randomWord(rng, rng.int(5, 8));
        const s = trace(m, w);
        const last = s[s.length - 1]!;
        return numberProblem({
          prompt: t(
            `A Mealy machine with start state $q_0$ has transition table $${mealyTable(m)}$, where $q_j/b$ means "go to $q_j$ and output $b$". After reading $${w}$ it is in state $q_i$. Find $i$.`,
            `一个初始状态为 $q_0$ 的 Mealy 机的转移表为 $${mealyTable(m)}$，其中 $q_j/b$ 表示“转到 $q_j$ 并输出 $b$”。读入 $${w}$ 后它处于状态 $q_i$。求 $i$。`,
          ),
          answer: last,
          wrong: [s[s.length - 2]!, ...range(0, 2).filter((x) => x !== last)],
          solution: t(`The states are $${traceTex(s)}$, so $i = ${last}$.`, `状态依次为 $${traceTex(s)}$，所以 $i = ${last}$。`),
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
  prerequisites: ["mealy-machines"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "outputs-of-moore-machines",
      title: t("The output string", "输出串"),
      explanation: t(
        "Write the output of $q_0$, then after each input symbol write the output of the state reached. On input $011$ a Moore machine passes through four states and outputs four symbols.",
        "先写出 $q_0$ 的输出，然后每读入一个符号，写出到达的状态的输出。对输入 $011$，Moore 机经过四个状态，输出四个符号。",
      ),
      generate(rng) {
        const m = randomMachine(rng, rng.int(2, 3));
        const w = randomWord(rng, rng.int(4, 6));
        const out = mooreOutput(m, w);
        return stringChoice(
          rng,
          t(
            `A Moore machine with start state $q_0$ has transition table $${mooreTable(m)}$. It outputs the symbol of each state it is in, starting with $q_0$. What does it output on input $${w}$?`,
            `一个初始状态为 $q_0$ 的 Moore 机的转移表为 $${mooreTable(m)}$。它输出所处的每个状态的符号，从 $q_0$ 开始。输入 $${w}$ 时它输出什么？`,
          ),
          out,
          [out.slice(1), out.slice(0, -1), `${out.slice(1)}${out[0]}`],
          () => flip(rng, out),
          t(
            `The states are $${traceTex(trace(m, w))}$, whose outputs give $${out}$.`,
            `状态依次为 $${traceTex(trace(m, w))}$，它们的输出给出 $${out}$。`,
          ),
        );
      },
    },
    {
      id: "counting-outputs-of-moore-machines",
      title: t("Counting output symbols", "数输出符号"),
      explanation: t(
        "Each state visited contributes its output once, so count how many of the visited states (with repetition, and including $q_0$) have output $1$.",
        "每个经过的状态贡献一次它的输出，所以数一数经过的状态（计重复，含 $q_0$）中有多少个的输出为 $1$。",
      ),
      generate(rng) {
        let m: Machine;
        let w: string;
        let out: string;
        do {
          m = randomMachine(rng, 3);
          w = randomWord(rng, rng.int(6, 9));
          out = mooreOutput(m, w);
        } while (!out.includes("0") || !out.includes("1"));
        const ones = [...out].filter((c) => c === "1").length;
        return numberProblem({
          prompt: t(
            `A Moore machine with start state $q_0$ has transition table $${mooreTable(m)}$. It outputs the symbol of each state it is in, starting with $q_0$. How many $1$s does it output on input $${w}$?`,
            `一个初始状态为 $q_0$ 的 Moore 机的转移表为 $${mooreTable(m)}$。它输出所处的每个状态的符号，从 $q_0$ 开始。输入 $${w}$ 时它输出多少个 $1$？`,
          ),
          answer: ones,
          wrong: [ones - Number(out[0]), out.length - ones, ones + 1, [...w].filter((c) => c === "1").length],
          solution: t(
            `The states are $${traceTex(trace(m, w))}$, giving output $${out}$ with $${ones}$ ones.`,
            `状态依次为 $${traceTex(trace(m, w))}$，输出为 $${out}$，其中有 $${ones}$ 个 $1$。`,
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
  prerequisites: ["mealy-machines"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "deciding-acceptance-by-a-dfa",
      title: t("Acceptance", "接受"),
      explanation: t(
        "Follow the string from the start state. Only the last state matters: the DFA accepts if it is accepting, even if the run passed through accepting states earlier.",
        "从初始状态出发跟随该串。只有最后的状态重要：若它是接受状态则 DFA 接受，即使途中曾经过接受状态也不影响。",
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
          solution: t(
            `The run is $${traceTex(s)}$, ending in $${qx(last)}$, which is ${m.accept[last] ? "" : "not "}accepting.`,
            `运行过程为 $${traceTex(s)}$，停在 $${qx(last)}$，它${m.accept[last] ? "是" : "不是"}接受状态。`,
          ),
        });
      },
    },
    {
      id: "final-states-of-a-dfa",
      title: t("The final state", "最终状态"),
      explanation: t(
        "Each symbol moves the DFA to exactly one state, so the state after reading a string is determined. Process the symbols one at a time, looking up row (current state), column (symbol).",
        "每个符号把 DFA 带到唯一的状态，所以读完一个串后的状态是确定的。逐个处理符号，查找“当前状态”行、“符号”列。",
      ),
      generate(rng) {
        const k = 4;
        const m = randomMachine(rng, k);
        const w = randomWord(rng, rng.int(6, 9));
        const s = trace(m, w);
        const last = s[s.length - 1]!;
        return numberProblem({
          prompt: t(
            `A DFA has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} After reading $${w}$ it is in state $q_i$. Find $i$.`,
            `一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}读入 $${w}$ 后它处于状态 $q_i$。求 $i$。`,
          ),
          answer: last,
          wrong: [s[s.length - 2]!, trace(m, [...w].reverse().join("")).pop()!, ...range(0, k - 1)],
          solution: t(`The run is $${traceTex(s)}$, so $i = ${last}$.`, `运行过程为 $${traceTex(s)}$，所以 $i = ${last}$。`),
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
  prerequisites: ["deterministic-finite-automata", "binary-integers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "remainder-automata",
      title: t("Tracking remainders", "追踪余数"),
      explanation: t(
        "Reading a binary digit doubles the number so far and adds the digit, so an automaton can track just the remainder after each digit. In the DFA with $\\delta(q_r, b) = q_{(2r + b) \\bmod 3}$, reading $1101$ goes $q_0 \\to q_1 \\to q_0 \\to q_0 \\to q_1$. Indeed $1101_2 = 13$ and $13 \\bmod 3 = 1$.",
        "读入一个二进制位相当于把已读的数加倍再加上这一位，所以自动机只需记录每读一位后的余数。在 $\\delta(q_r, b) = q_{(2r + b) \\bmod 3}$ 的 DFA 中，读入 $1101$ 依次经过 $q_0 \\to q_1 \\to q_0 \\to q_0 \\to q_1$。确实 $1101_2 = 13$，$13 \\bmod 3 = 1$。",
      ),
      generate(rng) {
        const mod = rng.int(3, 7);
        const m = remainderMachine(mod);
        const w = `1${randomWord(rng, rng.int(4, 7))}`;
        const value = Number.parseInt(w, 2);
        const s = trace(m, w);
        return numberProblem({
          prompt: t(
            `A DFA has states $q_0, \\dots, q_{${mod - 1}}$, start state $q_0$, and transitions $\\delta(q_r, b) = q_{(2r + b) \\bmod ${mod}}$. After reading $${w}$ it is in state $q_i$. Find $i$.`,
            `一个 DFA 的状态为 $q_0, \\dots, q_{${mod - 1}}$，初始状态为 $q_0$，转移为 $\\delta(q_r, b) = q_{(2r + b) \\bmod ${mod}}$。读入 $${w}$ 后它处于状态 $q_i$。求 $i$。`,
          ),
          answer: s[s.length - 1]!,
          wrong: [Number.parseInt([...w].reverse().join(""), 2) % mod, s[s.length - 2]!, [...w].filter((c) => c === "1").length % mod],
          solution: t(
            `The run is $${traceTex(s)}$. As a check, $${w}_2 = ${value}$ and $${value} \\bmod ${mod} = ${value % mod}$.`,
            `运行过程为 $${traceTex(s)}$。验算：$${w}_2 = ${value}$，$${value} \\bmod ${mod} = ${value % mod}$。`,
          ),
        });
      },
    },
    {
      id: "first-acceptance-while-processing-a-string",
      title: t("Following a run", "跟随运行过程"),
      explanation: t(
        "The prefixes of a string that a DFA accepts are found by watching the run: the DFA accepts the first $k$ symbols exactly when it is in an accepting state after step $k$.",
        "观察运行过程就能找出 DFA 接受的前缀：DFA 接受前 $k$ 个符号，当且仅当第 $k$ 步之后它处于接受状态。",
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
          k = s.findIndex((q, i) => i > 0 && m.accept[q]);
        } while (k < 2 || m.accept[0]);
        const count = s.slice(1).filter((q) => m.accept[q]).length;
        return numberProblem({
          prompt: t(
            `A DFA has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} What is the length of the shortest nonempty prefix of $${w}$ that it accepts?`,
            `一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}它接受的 $${w}$ 的最短非空前缀的长度是多少？`,
          ),
          answer: k,
          wrong: [k + 1, k - 1, count, w.length],
          solution: t(
            `The run is $${traceTex(s)}$. It first reaches an accepting state after $${k}$ symbols.`,
            `运行过程为 $${traceTex(s)}$。读入 $${k}$ 个符号后它第一次到达接受状态。`,
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

/** nfaTable writes the transition table of an NFA. */
const nfaTable = (m: Nfa) =>
  `\\begin{array}{c|cc} & 0 & 1 \\\\ \\hline ${range(0, m.k - 1)
    .map(
      (q) =>
        `${q === 0 ? "\\to " : ""}${m.accept[q] ? "{*}" : ""}${qx(q)} & ${stateSetTex(m.delta[q]![0]!)} & ${stateSetTex(m.delta[q]![1]!)}`,
    )
    .join(" \\\\ ")} \\end{array}`;

/** nondeterministicFiniteAutomata tracks the sets of states an NFA can be in. */
export const nondeterministicFiniteAutomata: TopicDef = {
  id: "nondeterministic-finite-automata",
  title: t("Nondeterministic Finite Automata", "非确定性有限自动机"),
  summary: t(
    "In a nondeterministic finite automaton (NFA) a state and symbol lead to a set of possible next states, possibly empty. Track the set of all states the NFA could be in; it accepts a string if that final set contains an accepting state.",
    "在非确定性有限自动机（NFA）中，一个状态和一个符号导向一组可能的下一状态（可能为空）。追踪 NFA 可能处于的所有状态构成的集合；若最终的集合含有接受状态，则它接受该串。",
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
        "Start with $\\{q_0\\}$. For each symbol, the new set is the union of the table entries for every state in the current set. A branch with no move simply dies.",
        "从 $\\{q_0\\}$ 开始。对每个符号，新的集合是当前集合中每个状态对应表项的并集。无法移动的分支直接消失。",
      ),
      generate(rng) {
        let m: Nfa;
        let w: string;
        let sets: number[][];
        do {
          m = randomNfa(rng, rng.int(3, 4));
          w = randomWord(rng, rng.int(3, 5));
          sets = nfaSets(m, w);
        } while (sets[sets.length - 1]!.length === 0 && rng.bool(0.8));
        const last = sets[sets.length - 1]!;
        return numberProblem({
          prompt: t(
            `An NFA has transition table $${nfaTable(m)}$ ${DFA_NOTE.en} How many states could it be in after reading $${w}$?`,
            `一个 NFA 的转移表为 $${nfaTable(m)}$${DFA_NOTE["zh-CN"]}读入 $${w}$ 后它可能处于多少个状态？`,
          ),
          answer: last.length,
          wrong: [sets[sets.length - 2]!.length, last.length + 1, Math.max(...sets.map((s) => s.length)), 1],
          solution: t(
            `The sets of possible states are $${sets.map(stateSetTex).join(" \\to ")}$, so the answer is $${last.length}$.`,
            `可能状态的集合依次为 $${sets.map(stateSetTex).join(" \\to ")}$，所以答案为 $${last.length}$。`,
          ),
        });
      },
    },
    {
      id: "acceptance-by-an-nfa",
      title: t("Acceptance", "接受"),
      explanation: t(
        "An NFA accepts if at least one way of reading the string ends in an accepting state, that is, if the final set of possible states contains an accepting state. It rejects if every branch ends elsewhere or dies.",
        "若读入该串的某一种方式停在接受状态，即最终的可能状态集含有接受状态，则 NFA 接受。若每个分支都停在别处或中途消失，则拒绝。",
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
          solution: t(
            `The sets of possible states are $${sets.map(stateSetTex).join(" \\to ")}$. The final set ${yes ? "contains" : "does not contain"} an accepting state.`,
            `可能状态的集合依次为 $${sets.map(stateSetTex).join(" \\to ")}$。最终的集合${yes ? "含有" : "不含"}接受状态。`,
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
  prerequisites: ["processing-strings-using-deterministic-finite-automata", "nondeterministic-finite-automata"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-strings-in-the-language-of-a-dfa",
      title: t("Counting strings", "数串"),
      explanation: t(
        "Start with $1$ string (the empty one) at $q_0$. At each step, every state passes its count to the states its transitions lead to. After $n$ steps, add the counts at the accepting states.",
        "开始时 $q_0$ 处有 $1$ 个串（空串）。每一步，每个状态把它的计数传给它的转移所指向的状态。$n$ 步之后，把接受状态处的计数相加。",
      ),
      generate(rng) {
        let m: Machine;
        let n: number;
        let value: number;
        do {
          m = randomMachine(rng, 3);
          n = rng.int(3, 6);
          value = countAccepted(m, n);
        } while (value === 0 || value === 2 ** n);
        const counts = countsByLength(m, n)
          .map((c) => `(${c.join(", ")})`)
          .join(" \\to ");
        return numberProblem({
          prompt: t(
            `A DFA over $\\{0, 1\\}$ has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} How many strings of length $${n}$ are in its language?`,
            `字母表 $\\{0, 1\\}$ 上的一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}它的语言中有多少个长度为 $${n}$ 的串？`,
          ),
          answer: value,
          wrong: [2 ** n - value, countAccepted(m, n - 1), countAccepted(m, n + 1), value + 1],
          solution: t(
            `Track how many strings reach each of the three states, in the order of the table, one symbol at a time: $${counts}$. The accepting states hold $${value}$ of the $${2 ** n}$ strings.`,
            `按转移表的顺序，逐个符号追踪到达三个状态的串的个数：$${counts}$。接受状态处共有 $${2 ** n}$ 个串中的 $${value}$ 个。`,
          ),
        });
      },
    },
    {
      id: "recognizing-strings-in-a-language",
      title: t("Members of the language", "语言中的串"),
      explanation: t(
        "To decide whether a string is in $L(M)$, run $M$ on it. Strings of the same length can land in different states, so each must be checked.",
        "要判断一个串是否在 $L(M)$ 中，就让 $M$ 处理它。同样长度的串可能停在不同的状态，所以每个都要检查。",
      ),
      generate(rng) {
        let m: Machine;
        let words: string[];
        let inL: string[];
        do {
          m = randomMachine(rng, 3);
          words = rng.sample(allWords(5), 8);
          inL = words.filter((w) => accepts(m, w));
        } while (inL.length === 0 || words.length - inL.length < 3);
        const right = inL[0]!;
        const wrong = words.filter((w) => !accepts(m, w));
        return stringChoice(
          rng,
          t(
            `A DFA has transition table $${dfaTable(m)}$ ${DFA_NOTE.en} Which string is in its language?`,
            `一个 DFA 的转移表为 $${dfaTable(m)}$${DFA_NOTE["zh-CN"]}哪个串在它的语言中？`,
          ),
          right,
          wrong.slice(0, 3),
          () => wrong[0]!,
          t(
            `On $${right}$ the run is $${traceTex(trace(m, right))}$, ending in an accepting state; the other strings end in non-accepting states.`,
            `对 $${right}$，运行过程为 $${traceTex(trace(m, right))}$，停在接受状态；其他串都停在非接受状态。`,
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

/** randomRegex joins two or three random pieces. */
const randomRegex = (rng: Rng) =>
  range(1, rng.int(2, 3))
    .map(() => rng.pick(REGEX_PIECES))
    .join("");

/** regularExpressions counts and recognizes the strings a regular expression matches. */
export const regularExpressions: TopicDef = {
  id: "regular-expressions",
  title: t("Regular Expressions", "正则表达式"),
  summary: t(
    "Regular expressions build languages from single symbols using union ($r \\mid s$), concatenation ($rs$) and the Kleene star ($r^*$, any number of copies, including none). They describe exactly the regular languages, the ones finite automata accept.",
    "正则表达式由单个符号出发，用并（$r \\mid s$）、连接（$rs$）和 Kleene 星号（$r^*$，任意多个副本，包括零个）构造语言。它们恰好描述正则语言，即有限自动机接受的语言。",
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
        "$1(0 \\mid 1)^*0$ matches the strings that start with $1$ and end with $0$, such as $10$ and $1100$, but not $1$ or $0110$. Try to split the string into parts matching each piece of the expression.",
        "$1(0 \\mid 1)^*0$ 匹配以 $1$ 开头、以 $0$ 结尾的串，例如 $10$ 和 $1100$，但不匹配 $1$ 或 $0110$。尝试把串拆成与表达式各部分匹配的几段。",
      ),
      generate(rng) {
        let r: string;
        let pool: string[];
        let matching: string[];
        do {
          r = randomRegex(rng);
          pool = range(3, 6).flatMap((n) => allWords(n));
          const re = new RegExp(`^(?:${r})$`);
          matching = pool.filter((w) => re.test(w));
        } while (matching.length === 0 || matching.length === pool.length);
        const yes = rng.bool();
        const re = new RegExp(`^(?:${r})$`);
        const w = yes ? rng.pick(matching) : rng.pick(pool.filter((x) => !re.test(x)));
        return choiceProblem({
          prompt: t(
            `Does the string $${w}$ match the regular expression $${regexTex(r)}$?`,
            `串 $${w}$ 与正则表达式 $${regexTex(r)}$ 匹配吗？`,
          ),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `Yes: $${w}$ splits into consecutive parts matching the pieces of $${regexTex(r)}$.`,
                `匹配：$${w}$ 可以拆成依次与 $${regexTex(r)}$ 各部分匹配的几段。`,
              )
            : t(
                `No: there is no way to split $${w}$ into consecutive parts matching the pieces of $${regexTex(r)}$.`,
                `不匹配：无法把 $${w}$ 拆成依次与 $${regexTex(r)}$ 各部分匹配的几段。`,
              ),
        });
      },
    },
    {
      id: "counting-strings-matched-by-a-regular-expression",
      title: t("Counting matches", "数匹配的串"),
      explanation: t(
        "Strings of length $5$ matching $(0 \\mid 1)^*11$ end in $11$, and the first $3$ symbols are free: $2^3 = 8$ strings. Strings of length $n$ matching $0^*1^*$ are $0^k1^{n-k}$ for $k = 0, \\dots, n$: $n + 1$ strings.",
        "长度为 $5$、匹配 $(0 \\mid 1)^*11$ 的串以 $11$ 结尾，前 $3$ 个符号任意：共 $2^3 = 8$ 个。长度为 $n$、匹配 $0^*1^*$ 的串为 $0^k1^{n-k}$（$k = 0, \\dots, n$）：共 $n + 1$ 个。",
      ),
      generate(rng) {
        let r: string;
        let n: number;
        let count: number;
        do {
          r = randomRegex(rng);
          n = rng.int(4, 7);
          const re = new RegExp(`^(?:${r})$`);
          count = allWords(n).filter((w) => re.test(w)).length;
        } while (count < 2 || count === 2 ** n);
        const re = new RegExp(`^(?:${r})$`);
        const shorter = allWords(n - 1).filter((w) => re.test(w)).length;
        return numberProblem({
          prompt: t(
            `How many binary strings of length $${n}$ match the regular expression $${regexTex(r)}$?`,
            `有多少个长度为 $${n}$ 的二进制串与正则表达式 $${regexTex(r)}$ 匹配？`,
          ),
          answer: count,
          wrong: [shorter, 2 ** n - count, count + 1, count * 2],
          solution: t(
            `Listing the strings of length $${n}$ by the parts they split into, $${count}$ of the $${2 ** n}$ strings match.`,
            `按串拆成的各部分逐一列举，长度为 $${n}$ 的 $${2 ** n}$ 个串中有 $${count}$ 个匹配。`,
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

/** randomTmTask picks one of the simple machines with a suitable input. */
function randomTmTask(rng: Rng): { m: Tm; input: string } {
  const kind = rng.int(0, 3);
  if (kind === 0) return { m: flipper, input: randomWord(rng, rng.int(3, 7)) };
  if (kind === 1) return { m: unaryAdder, input: `${"1".repeat(rng.int(1, 4))}0${"1".repeat(rng.int(1, 4))}` };
  if (kind === 2) return { m: incrementer, input: `1${randomWord(rng, rng.int(2, 6))}` };
  return { m: zeroEraser, input: `${randomWord(rng, rng.int(2, 5))}1` };
}

/** introductionToTuringMachines runs simple Turing machines step by step. */
export const introductionToTuringMachines: TopicDef = {
  id: "introduction-to-turing-machines",
  title: t("Introduction to Turing Machines", "图灵机简介"),
  summary: t(
    "A Turing machine has a finite set of states and a head on an infinite tape. In each step it reads the symbol under the head and, according to its transition function, writes a symbol, moves left or right, and changes state, until it halts.",
    "图灵机有有限个状态和一个位于无限长纸带上的读写头。每一步它读取读写头下的符号，按照转移函数写入一个符号、向左或向右移动并改变状态，直到停机。",
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
        "Write out the tape and run the machine one step at a time, keeping track of the state and the head. When it halts, read the symbols left on the tape.",
        "写出纸带，逐步运行机器，记录状态和读写头的位置。停机后读出纸带上剩下的符号。",
      ),
      generate(rng) {
        const { m, input } = randomTmTask(rng);
        const run = runTm(m, input);
        const ones = [...run.content].filter((c) => c === "1").length;
        const inOnes = [...input].filter((c) => c === "1").length;
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ with its head on the first symbol of the input $${input}$, the rest of the tape blank. Its transitions are $${tmTex(m)}$. ${TM_NOTE.en} How many $1$s are on the tape when it halts?`,
            `一台图灵机从状态 $q_0$ 开始，读写头位于输入 $${input}$ 的第一个符号上，纸带其余部分为空白。它的转移为 $${tmTex(m)}$。${TM_NOTE["zh-CN"]}停机时纸带上有多少个 $1$？`,
          ),
          answer: ones,
          wrong: [inOnes, ones + 1, input.length - inOnes, ones - 1].filter((x) => x >= 0),
          solution: t(
            `After $${run.steps}$ steps the machine halts with $${run.content.replace(/_/g, "\\sqcup ")}$ on the tape, in which $${ones}$ symbols are $1$.`,
            `经过 $${run.steps}$ 步后机器停机，纸带上为 $${run.content.replace(/_/g, "\\sqcup ")}$，其中有 $${ones}$ 个 $1$。`,
          ),
        });
      },
    },
    {
      id: "the-head-position-of-a-turing-machine",
      title: t("Following the head", "跟踪读写头"),
      explanation: t(
        "Number the cells so the input starts in cell $1$. Each step moves the head one cell: $R$ adds $1$ to its position and $L$ subtracts $1$.",
        "给纸带格编号，使输入从第 $1$ 格开始。每一步读写头移动一格：$R$ 使位置加 $1$，$L$ 使位置减 $1$。",
      ),
      generate(rng) {
        const { m, input } = randomTmTask(rng);
        const run = runTm(m, input);
        const k = rng.int(Math.min(3, run.steps), run.steps);
        const pos = run.heads[k]!;
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ with its head on cell $1$, the first symbol of the input $${input}$; the rest of the tape is blank. Its transitions are $${tmTex(m)}$. ${TM_NOTE.en} On which cell is the head after $${k}$ steps?`,
            `一台图灵机从状态 $q_0$ 开始，读写头位于第 $1$ 格，即输入 $${input}$ 的第一个符号上；纸带其余部分为空白。它的转移为 $${tmTex(m)}$。${TM_NOTE["zh-CN"]}$${k}$ 步之后读写头在第几格？`,
          ),
          answer: pos,
          wrong: [k + 1, pos + 1, pos - 1, run.heads[k - 1]!],
          solution: t(
            `The head moves through the cells $${run.heads.slice(0, k + 1).join(", ")}$, so after $${k}$ steps it is on cell $${pos}$.`,
            `读写头依次经过第 $${run.heads.slice(0, k + 1).join(", ")}$ 格，所以 $${k}$ 步之后它在第 $${pos}$ 格。`,
          ),
        });
      },
    },
  ],
};

/** processingStringsUsingTuringMachines runs a binary incrementer. */
export const processingStringsUsingTuringMachines: TopicDef = {
  id: "processing-strings-using-turing-machines",
  title: t("Processing Strings Using Turing Machines", "用图灵机处理字符串"),
  summary: t(
    "Unlike a finite automaton, a Turing machine can move back and rewrite its input, so it can compute functions. A machine that adds 1 to a binary number walks to the last digit, then moves left turning 1s into 0s until it can turn a 0 (or a blank) into 1.",
    "与有限自动机不同，图灵机可以往回移动并改写输入，所以能计算函数。给二进制数加 1 的机器先走到最后一位，再向左把 1 改成 0，直到能把一个 0（或空白）改成 1。",
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
        "On input $1011$ the incrementer walks right to the blank, steps back, changes the trailing $1$s to $0$s and the $0$ before them to $1$: the tape reads $1100$, which is $11 + 1 = 12$.",
        "对输入 $1011$，加一机向右走到空白处，退回一格，把末尾的 $1$ 改成 $0$，再把它们前面的 $0$ 改成 $1$：纸带上为 $1100$，即 $11 + 1 = 12$。",
      ),
      generate(rng) {
        const input = `1${randomWord(rng, rng.int(3, 7))}`;
        const run = runTm(incrementer, input);
        const value = Number.parseInt(run.content, 2);
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ on the first symbol of $${input}$. Its transitions are $${tmTex(incrementer)}$. ${TM_NOTE.en} When it halts, the tape holds a binary number. What is it in decimal?`,
            `一台图灵机从状态 $q_0$、读写头位于 $${input}$ 的第一个符号上开始。它的转移为 $${tmTex(incrementer)}$。${TM_NOTE["zh-CN"]}停机时纸带上是一个二进制数。它的十进制值是多少？`,
          ),
          answer: value,
          wrong: [value - 1, value + 1, Number.parseInt(input, 2) * 2, Number.parseInt(run.content.split("").reverse().join(""), 2)],
          solution: t(
            `The machine halts with $${run.content}$ on the tape: $${run.content}_2 = ${value}$, one more than $${input}_2 = ${value - 1}$.`,
            `机器停机时纸带上为 $${run.content}$：$${run.content}_2 = ${value}$，比 $${input}_2 = ${value - 1}$ 大一。`,
          ),
        });
      },
    },
    {
      id: "counting-steps-of-a-turing-machine",
      title: t("Counting steps", "数步数"),
      explanation: t(
        "On an input of length $n$ ending in $t$ ones, the incrementer takes $n + 1$ steps to reach the blank and step back, then $t$ steps to clear the ones and $1$ more to write the final $1$: $n + t + 2$ steps.",
        "对长度为 $n$、末尾有 $t$ 个 $1$ 的输入，加一机用 $n + 1$ 步走到空白处并退回，再用 $t$ 步清除这些 $1$，最后再用 $1$ 步写入 $1$：共 $n + t + 2$ 步。",
      ),
      generate(rng) {
        const input = `1${randomWord(rng, rng.int(3, 8))}`;
        const run = runTm(incrementer, input);
        const trailing = input.length - input.replace(/1+$/, "").length;
        return numberProblem({
          prompt: t(
            `A Turing machine starts in state $q_0$ on the first symbol of $${input}$. Its transitions are $${tmTex(incrementer)}$. ${TM_NOTE.en} How many steps does it take before halting?`,
            `一台图灵机从状态 $q_0$、读写头位于 $${input}$ 的第一个符号上开始。它的转移为 $${tmTex(incrementer)}$。${TM_NOTE["zh-CN"]}它停机前共走了多少步？`,
          ),
          answer: run.steps,
          wrong: [input.length + 1, run.steps - 1, run.steps + 1, 2 * input.length],
          solution: t(
            `It takes $${input.length + 1}$ steps to reach the blank and step back, $${trailing}$ to turn the trailing $1$s into $0$s, and $1$ to write the final $1$: $${run.steps}$ steps.`,
            `走到空白处并退回用 $${input.length + 1}$ 步，把末尾的 $1$ 改成 $0$ 用 $${trailing}$ 步，写入最后的 $1$ 用 $1$ 步：共 $${run.steps}$ 步。`,
          ),
        });
      },
    },
  ],
};

/** nondeterministicTuringMachines counts the branches of nondeterministic computations. */
export const nondeterministicTuringMachines: TopicDef = {
  id: "nondeterministic-turing-machines",
  title: t("Nondeterministic Turing Machines", "非确定性图灵机"),
  summary: t(
    "A nondeterministic Turing machine may have several possible moves in a configuration, so its computations form a tree; it accepts if some branch accepts. A deterministic machine can simulate it by exploring the tree level by level, which can take exponentially many steps.",
    "非确定性图灵机在一个格局下可能有多种移动，所以它的计算构成一棵树；只要有一个分支接受，它就接受。确定性机器可以逐层探索这棵树来模拟它，这可能需要指数多步。",
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
        "If a machine has $2$ choices at each of its first $3$ steps and then $3$ choices at each of the next $2$, its computation tree has $2^3 \\cdot 3^2 = 72$ branches after $5$ steps (if none halts early).",
        "若机器在前 $3$ 步每步有 $2$ 种选择，接下来 $2$ 步每步有 $3$ 种选择，则 $5$ 步之后它的计算树有 $2^3 \\cdot 3^2 = 72$ 个分支（假设没有提前停机）。",
      ),
      generate(rng) {
        const a = rng.int(2, 3);
        const s1 = rng.int(1, 5);
        const b = rng.int(2, 4);
        const s2 = rng.int(1, 4);
        const value = a ** s1 * b ** s2;
        return numberProblem({
          prompt: t(
            `A nondeterministic Turing machine has exactly $${a}$ possible moves at each of its first $${s1}$ steps and exactly $${b}$ at each of the next $${s2}$. If no branch halts early, how many branches does its computation tree have after $${s1 + s2}$ steps?`,
            `一台非确定性图灵机在前 $${s1}$ 步每步恰有 $${a}$ 种可能的移动，在接下来的 $${s2}$ 步每步恰有 $${b}$ 种。若没有分支提前停机，$${s1 + s2}$ 步之后它的计算树有多少个分支？`,
          ),
          answer: value,
          wrong: [a * s1 + b * s2, a * s1 * b * s2, a ** s1 + b ** s2, (a * b) ** (s1 + s2)],
          solution: t(
            `Each step multiplies the number of branches by the number of choices: $${a}^{${s1}} \\cdot ${b}^{${s2}} = ${value}$.`,
            `每一步把分支数乘以选择数：$${a}^{${s1}} \\cdot ${b}^{${s2}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "simulating-a-nondeterministic-machine",
      title: t("Deterministic simulation", "确定性模拟"),
      explanation: t(
        "A breadth-first simulation visits every configuration in the tree up to depth $t$. With $b$ choices per step there are $1 + b + \\dots + b^t = \\frac{b^{t+1} - 1}{b - 1}$ of them; for $b = 2$, $t = 4$ that is $31$.",
        "广度优先模拟访问树中深度不超过 $t$ 的所有格局。每步有 $b$ 种选择时，共有 $1 + b + \\dots + b^t = \\frac{b^{t+1} - 1}{b - 1}$ 个；$b = 2$、$t = 4$ 时为 $31$。",
      ),
      generate(rng) {
        const b = rng.int(2, 5);
        const tt = rng.int(2, 8);
        const value = (b ** (tt + 1) - 1) / (b - 1);
        return numberProblem({
          prompt: t(
            `A nondeterministic Turing machine has exactly $${b}$ possible moves in every configuration. A deterministic simulation explores its computation tree breadth-first up to depth $${tt}$, counting the starting configuration. How many configurations does it visit?`,
            `一台非确定性图灵机在每个格局下都恰有 $${b}$ 种可能的移动。确定性模拟用广度优先方式探索它的计算树，直到深度 $${tt}$（含初始格局）。它访问多少个格局？`,
          ),
          answer: value,
          wrong: [b ** tt, b ** (tt + 1), value - 1, b * tt + 1],
          solution: t(
            `$1 + ${b} + \\dots + ${b}^{${tt}} = \\frac{${b}^{${tt + 1}} - 1}{${b} - 1} = ${value}$.`,
            `$1 + ${b} + \\dots + ${b}^{${tt}} = \\frac{${b}^{${tt + 1}} - 1}{${b} - 1} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** Growth is a function of n with exponents k such that it is O(nᵏ) (upper) and Ω(nᵏ) (lower). */
interface Growth {
  readonly tex: string;
  readonly upper: number;
  readonly lower: number;
}

/** coef writes a positive coefficient, omitting 1. */
const coef = (c: number) => (c === 1 ? "" : `${c}`);

/** randomGrowth builds a function whose polynomial growth bounds are known. */
function randomGrowth(rng: Rng): Growth {
  const p = rng.int(1, 5);
  const c = rng.int(1, 9);
  const d = rng.int(1, 20);
  const lower = p > 1 ? ` + ${coef(rng.int(1, 9))}n^{${rng.int(1, p - 1)}}`.replace("n^{1}", "n") : "";
  const np = p === 1 ? "n" : `n^{${p}}`;
  switch (rng.int(0, 4)) {
    case 0:
      return { tex: `${coef(c)}${np}${lower} + ${d}`, upper: p, lower: p };
    case 1:
      return { tex: `${coef(c)}${np} \\log_2 n${lower}`, upper: p + 1, lower: p };
    case 2:
      return { tex: `${coef(c)}${np}\\sqrt{n} + ${d}`, upper: p + 1, lower: p };
    case 3:
      return { tex: `\\frac{${coef(c)}${np}}{\\log_2 n}`, upper: p, lower: p - 1 };
    default: {
      const q = rng.int(1, 3);
      return { tex: `(${np} + ${d})(${coef(c)}n${q === 1 ? "" : `^{${q}}`} - 1)`, upper: p + q, lower: p + q };
    }
  }
}

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
  prerequisites: ["evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-upper-bounds",
      title: t("Polynomial upper bounds", "多项式上界"),
      explanation: t(
        "A function is big O of another when it eventually stays below a constant multiple of it, so a slowly growing factor like a logarithm can push it past a lower power. $3n^2\\log_2 n$ is $O(n^3)$, since $\\log_2 n \\le n$, but not $O(n^2)$, since $\\log_2 n$ is unbounded. So the smallest integer $k$ with $3n^2 \\log_2 n = O(n^k)$ is $3$.",
        "当一个函数最终保持在另一个函数的某个常数倍以下时，它就是后者的大 O，所以像对数这样增长缓慢的因子也能使它超过较低的幂。$3n^2\\log_2 n$ 是 $O(n^3)$，因为 $\\log_2 n \\le n$；但不是 $O(n^2)$，因为 $\\log_2 n$ 无界。所以使 $3n^2 \\log_2 n = O(n^k)$ 的最小整数 $k$ 为 $3$。",
      ),
      generate(rng) {
        const g = randomGrowth(rng);
        return numberProblem({
          prompt: t(`Find the smallest integer $k$ such that $${g.tex} = O(n^k)$.`, `求使 $${g.tex} = O(n^k)$ 成立的最小整数 $k$。`),
          answer: g.upper,
          wrong: [g.upper + 1, g.upper - 1, g.lower === g.upper ? g.upper + 2 : g.lower],
          solution: t(
            `Ignoring constants and lower-order terms, $${g.tex}$ grows ${g.upper === g.lower ? `like $${pwr(g.upper)}$` : `faster than $${pwr(g.lower)}$ but slower than $${pwr(g.upper)}$`}, so $k = ${g.upper}$.`,
            `忽略常数和低阶项，$${g.tex}$ 的增长${g.upper === g.lower ? `与 $${pwr(g.upper)}$ 相当` : `快于 $${pwr(g.lower)}$ 但慢于 $${pwr(g.upper)}$`}，所以 $k = ${g.upper}$。`,
          ),
        });
      },
    },
    {
      id: "constants-in-big-o-bounds",
      title: t("Witness constants", "见证常数"),
      explanation: t(
        "To prove a big O bound, exhibit a constant and a starting point beyond which the inequality holds, often by replacing every lower power with the highest one. For $n \\ge 1$, $4n^2 + 3n + 5 \\le 4n^2 + 3n^2 + 5n^2 = 12n^2$, with equality at $n = 1$. So $C = 12$, $N = 1$ witness $4n^2 + 3n + 5 = O(n^2)$, and no smaller $C$ works for all $n \\ge 1$.",
        "要证明大 O 界，就要给出一个常数和一个起点，使不等式在此之后成立，常用的方法是把每个低次幂都换成最高次幂。当 $n \\ge 1$ 时，$4n^2 + 3n + 5 \\le 4n^2 + 3n^2 + 5n^2 = 12n^2$，且 $n = 1$ 时取等号。所以 $C = 12$、$N = 1$ 是 $4n^2 + 3n + 5 = O(n^2)$ 的见证，对所有 $n \\ge 1$ 不存在更小的 $C$。",
      ),
      generate(rng) {
        const deg = rng.int(2, 3);
        const cs = range(0, deg).map(() => rng.int(1, 9));
        const tex = cs
          .map((c, i) => `${i === deg ? c : coef(c)}${deg - i === 0 ? "" : deg - i === 1 ? "n" : `n^{${deg - i}}`}`)
          .join(" + ");
        const value = sum(cs);
        return numberProblem({
          prompt: t(
            `Find the smallest constant $C$ such that $${tex} \\le Cn^{${deg}}$ for all integers $n \\ge 1$.`,
            `求使 $${tex} \\le Cn^{${deg}}$ 对所有整数 $n \\ge 1$ 成立的最小常数 $C$。`,
          ),
          answer: value,
          wrong: [cs[0]!, value - cs[deg]!, value + 1, Math.max(...cs)],
          solution: t(
            `The ratio $\\frac{${tex}}{n^{${deg}}}$ decreases as $n$ grows, so its largest value is at $n = 1$: $${cs.join(" + ")} = ${value}$.`,
            `比值 $\\frac{${tex}}{n^{${deg}}}$ 随 $n$ 增大而减小，所以最大值在 $n = 1$ 处：$${cs.join(" + ")} = ${value}$。`,
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
  prerequisites: ["big-o-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-lower-bounds",
      title: t("Polynomial lower bounds", "多项式下界"),
      explanation: t(
        "A lower bound means the function eventually grows at least as fast as a constant multiple of the bound, ignoring small values. $\\frac{n^3}{\\log_2 n}$ is $\\Omega(n^2)$, since $\\log_2 n \\le n$, but not $\\Omega(n^3)$. So the largest integer $k$ with $\\frac{n^3}{\\log_2 n} = \\Omega(n^k)$ is $2$.",
        "下界的意思是，不计较小的值，函数最终至少与界的某个常数倍增长得一样快。$\\frac{n^3}{\\log_2 n}$ 是 $\\Omega(n^2)$，因为 $\\log_2 n \\le n$；但不是 $\\Omega(n^3)$。所以使 $\\frac{n^3}{\\log_2 n} = \\Omega(n^k)$ 的最大整数 $k$ 为 $2$。",
      ),
      generate(rng) {
        const g = randomGrowth(rng);
        return numberProblem({
          prompt: t(
            `Find the largest integer $k$ such that $${g.tex} = \\Omega(n^k)$.`,
            `求使 $${g.tex} = \\Omega(n^k)$ 成立的最大整数 $k$。`,
          ),
          answer: g.lower,
          wrong: [g.lower + 1, g.lower - 1, g.upper === g.lower ? g.lower + 2 : g.upper],
          solution: t(
            `Ignoring constants and lower-order terms, $${g.tex}$ grows ${g.upper === g.lower ? `like $${pwr(g.lower)}$` : `faster than $${pwr(g.lower)}$ but slower than $${pwr(g.upper)}$`}, so $k = ${g.lower}$.`,
            `忽略常数和低阶项，$${g.tex}$ 的增长${g.upper === g.lower ? `与 $${pwr(g.lower)}$ 相当` : `快于 $${pwr(g.lower)}$ 但慢于 $${pwr(g.upper)}$`}，所以 $k = ${g.lower}$。`,
          ),
        });
      },
    },
    {
      id: "comparing-growth-rates",
      title: t("Comparing growth rates", "比较增长率"),
      explanation: t(
        "The standard growth rates in increasing order are $\\log n, \\sqrt{n}, n, n\\log n, n^2, n^3, 2^n, n!$. A function is $\\Omega$ of every rate at or below its own, whatever the constant factors.",
        "标准增长率由慢到快依次为 $\\log n, \\sqrt{n}, n, n\\log n, n^2, n^3, 2^n, n!$。一个函数是其自身及更慢的每个增长率的 $\\Omega$，与常数因子无关。",
      ),
      generate(rng) {
        const [i, j] = rng.sample(range(0, FAMILIES.length - 1), 2);
        const c = rng.int(2, 50);
        const yes = i! >= j!;
        const f = `${c} \\cdot ${FAMILIES[i!]}`;
        return choiceProblem({
          prompt: t(`Is $${f} = \\Omega(${FAMILIES[j!]})$?`, `$${f} = \\Omega(${FAMILIES[j!]})$ 成立吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `Yes: $${FAMILIES[i!]}$ grows at least as fast as $${FAMILIES[j!]}$.`,
                `成立：$${FAMILIES[i!]}$ 的增长至少与 $${FAMILIES[j!]}$ 一样快。`,
              )
            : t(
                `No: $${FAMILIES[i!]}$ grows strictly slower than $${FAMILIES[j!]}$, and the constant $${c}$ cannot make up for that.`,
                `不成立：$${FAMILIES[i!]}$ 的增长严格慢于 $${FAMILIES[j!]}$，常数 $${c}$ 无法弥补。`,
              ),
        });
      },
    },
  ],
};

/** Loop is a loop nest with its exact count, written as pseudocode. */
interface Loop {
  /** how writes the count as a sum or product of the loop's bounds. */
  readonly how?: string;
  readonly en: string;
  readonly zh: string;
  readonly count: (n: number) => number;
  readonly theta: string;
}

/** LOOPS are loop nests whose number of executions of the inner statement is known. */
const LOOPS: readonly Loop[] = [
  {
    en: "for $i = 1$ to $n$: for $j = 1$ to $i$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = 1$ 到 $i$：$x \\leftarrow x + 1$",
    count: (n) => (n * (n + 1)) / 2,
    how: "\\sum_{i=1}^{n} i = \\frac{n(n + 1)}{2}",
    theta: "n^2",
  },
  {
    en: "for $i = 1$ to $n$: for $j = i + 1$ to $n$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = i + 1$ 到 $n$：$x \\leftarrow x + 1$",
    count: (n) => (n * (n - 1)) / 2,
    how: "\\sum_{i=1}^{n} (n - i) = \\frac{n(n - 1)}{2}",
    theta: "n^2",
  },
  {
    en: "for $i = 1$ to $n$: for $j = 1$ to $n$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = 1$ 到 $n$：$x \\leftarrow x + 1$",
    count: (n) => n * n,
    how: "n \\cdot n",
    theta: "n^2",
  },
  {
    en: "for $i = 1$ to $n$: for $j = 1$ to $i$: for $k = 1$ to $j$: $x \\leftarrow x + 1$",
    zh: "对 $i = 1$ 到 $n$：对 $j = 1$ 到 $i$：对 $k = 1$ 到 $j$：$x \\leftarrow x + 1$",
    count: (n) => (n * (n + 1) * (n + 2)) / 6,
    how: "\\sum_{i=1}^{n} \\sum_{j=1}^{i} j = \\frac{n(n + 1)(n + 2)}{6}",
    theta: "n^3",
  },
  {
    en: "$i \\leftarrow 1$; while $i \\le n$: $x \\leftarrow x + 1$; $i \\leftarrow 2i$",
    zh: "$i \\leftarrow 1$；当 $i \\le n$ 时：$x \\leftarrow x + 1$；$i \\leftarrow 2i$",
    count: (n) => Math.floor(Math.log2(n)) + 1,
    how: "\\lfloor \\log_2 n \\rfloor + 1",
    theta: "\\log n",
  },
  {
    en: "for $i = 1$ to $n$: $j \\leftarrow 1$; while $j \\le n$: $x \\leftarrow x + 1$; $j \\leftarrow 2j$",
    zh: "对 $i = 1$ 到 $n$：$j \\leftarrow 1$；当 $j \\le n$ 时：$x \\leftarrow x + 1$；$j \\leftarrow 2j$",
    count: (n) => n * (Math.floor(Math.log2(n)) + 1),
    theta: "n \\log n",
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
  prerequisites: ["big-omega-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exact-polynomial-growth",
      title: t("Exact growth rates", "确切增长率"),
      explanation: t(
        "For products and quotients of polynomials, only the leading terms matter, so the exponent of the growth rate comes from adding or subtracting degrees. $(n^2 + 3)(2n - 1)$ has leading term $2n^3$, so it is $\\Theta(n^3)$. For a quotient, subtract the degrees: $\\frac{n^5 + n}{n^2 + 1} = \\Theta(n^3)$.",
        "对于多项式的乘积和商，只有首项起作用，所以增长率的指数由次数相加或相减得到。$(n^2 + 3)(2n - 1)$ 的首项为 $2n^3$，所以它是 $\\Theta(n^3)$。对于商，用次数相减：$\\frac{n^5 + n}{n^2 + 1} = \\Theta(n^3)$。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(1, 4);
        const c1 = rng.int(1, 9);
        const c2 = rng.int(1, 9);
        const pw = (k: number) => (k === 1 ? "n" : `n^{${k}}`);
        const kind = rng.int(0, 2);
        const [tex, k] =
          kind === 0
            ? [`(${coef(c1)}${pw(a)} + ${c2})(${pw(b)} - ${rng.int(1, 9)})`, a + b]
            : kind === 1
              ? [`\\frac{${coef(c1)}${pw(a + b)} + ${c2}n}{${pw(b)} + ${rng.int(1, 9)}}`, a]
              : [`${coef(c1)}${pw(a)} + ${coef(c2)}${pw(a + b)} + ${rng.int(1, 20)}`, a + b];
        return numberProblem({
          prompt: t(`Find $k$ such that $${tex} = \\Theta(n^k)$.`, `求使 $${tex} = \\Theta(n^k)$ 成立的 $k$。`),
          answer: k,
          wrong: kind === 0 ? [a * b, Math.max(a, b), k + 1] : kind === 1 ? [a + b, b, a + 1] : [a, k + 1, a + b + 1],
          solution: t(
            `The dominant behavior is a constant times $${pw(k)}$, so $k = ${k}$.`,
            `主导行为是常数乘以 $${pw(k)}$，所以 $k = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "counting-steps-of-loops",
      title: t("Counting loop steps", "数循环步数"),
      explanation: t(
        'In "for $i = 1$ to $n$: for $j = 1$ to $i$", the inner statement runs $1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}$ times, which is $\\Theta(n^2)$. A loop that doubles $i$ until it exceeds $n$ runs $\\lfloor \\log_2 n \\rfloor + 1$ times.',
        "在“对 $i = 1$ 到 $n$：对 $j = 1$ 到 $i$”中，内层语句执行 $1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}$ 次，即 $\\Theta(n^2)$。把 $i$ 不断加倍直到超过 $n$ 的循环执行 $\\lfloor \\log_2 n \\rfloor + 1$ 次。",
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
          wrong: [n * n, value + n, value - 1, Math.floor(Math.log2(n))].filter((x) => x !== value),
          solution: t(
            `${loop.how ? `The count is $${loop.how}$, so with $n = ${n}$ the` : "The"} statement runs $${value}$ times; in general this loop is $\\Theta(${loop.theta})$.`,
            `${loop.how ? `次数为 $${loop.how}$，所以当 $n = ${n}$ 时` : ""}该语句执行 $${value}$ 次；一般地，这个循环是 $\\Theta(${loop.theta})$。`,
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
