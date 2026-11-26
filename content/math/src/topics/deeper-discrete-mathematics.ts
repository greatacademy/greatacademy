// Further knowledge points for topics of Discrete Mathematics, each a skill the
// topic's own points leave out. See `deeperDiscreteMathematicsPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { discreteDrawings1 } from "../explanation-drawings-discrete-mathematics-1.ts";
import { discreteDrawings2 } from "../explanation-drawings-discrete-mathematics-2.ts";

import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** inParens puts a negative number in parentheses, for use inside a sum or under a power. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => [...Array(hi - lo + 1).keys()].map((i) => i + lo);
/** gcd gives the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** totient counts the integers from 1 to n coprime to n. */
const totient = (n: number) => range(1, n).filter((i) => gcd(i, n) === 1).length;
/** binom gives the binomial coefficient. */
const binom = (n: number, k: number) => {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return c;
};
/** powersMod lists a^1, a^2, … mod n up to and including the first 1, for a coprime to n. */
const powersMod = (a: number, n: number) => {
  const out = [a % n];
  while (out[out.length - 1] !== 1) out.push(((out[out.length - 1] as number) * a) % n);
  return out;
};
/** powMod gives b^e mod n. */
const powMod = (b: number, e: number, n: number) => {
  let r = 1;
  for (let i = 0; i < e; i++) r = (r * b) % n;
  return r;
};
/** derangements counts the permutations of m items that fix none of them. */
const derangements = (m: number): number => (m === 0 ? 1 : m === 1 ? 0 : (m - 1) * (derangements(m - 1) + derangements(m - 2)));
/** pow writes a base to an exponent, leaving out an exponent of one. */
const pow = (base: number, e: number) => (e === 1 ? `${base}` : `${base}^{${e}}`);

const functionsOfAGivenWeight: KnowledgePointDef = {
  id: "boolean-functions-of-a-given-weight",
  title: t("Boolean functions of a given weight", "给定权重的布尔函数"),
  explanation: t(
    "The weight of a Boolean function is the number of inputs on which it equals one. A function of $n$ variables has $2^n$ inputs, and choosing the function is the same as choosing which inputs get a one. So the functions of weight $k$ are counted by a binomial coefficient, not by a power of two: with $5$ variables there are $32$ inputs, and $\\binom{32}{5} = 201376$ functions have weight $5$.\n\n> **Watch out.** Choose among the $2^n$ inputs, not among the $n$ variables; and the inputs left out must all give $0$, so they are not free.",
    "布尔函数的权重是它取值为一的输入个数。$n$ 元函数有 $2^n$ 个输入，确定函数就是选出哪些输入取一。所以权重为 $k$ 的函数个数是一个二项式系数，而不是二的幂：$5$ 个变量有 $32$ 个输入，权重为 $5$ 的函数有 $\\binom{32}{5} = 201376$ 个。\n\n> **注意。** 要在 $2^n$ 个输入中选，而不是在 $n$ 个变量中选；没被选中的输入都必须取 $0$，它们不是自由的。",
  ),
  generate(rng) {
    const [n, k] = rng.pick([
      ...range(1, 3).map((k) => [2, k] as const),
      ...range(1, 7).map((k) => [3, k] as const),
      ...range(1, 15).map((k) => [4, k] as const),
      ...range(1, 4).map((k) => [5, k] as const),
    ]);
    const inputs = 2 ** n;
    const answer = binom(inputs, k);
    return numberProblem({
      prompt: t(
        `How many Boolean functions of $${n}$ variables equal $1$ on exactly $${k}$ of their inputs?`,
        `有多少个 $${n}$ 元布尔函数恰好在 $${k}$ 个输入上取值为 $1$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          inputs * k,
          `That multiplies the $${inputs}$ inputs by $${k}$ instead of choosing $${k}$ of them.`,
          `那是把 $${inputs}$ 个输入乘以 $${k}$，而不是从中选出 $${k}$ 个。`,
        ),
        why(binom(inputs, k - 1), "That chooses one input too few.", "那是少选了一个输入。"),
        why(2 ** inputs, "That counts the functions of every weight.", "那是所有权重的函数的个数。"),
        ...(k <= n
          ? [
              why(
                binom(n, k),
                `That chooses among the $${n}$ variables, not the $${inputs}$ inputs.`,
                `那是从 $${n}$ 个变量中选，而不是从 $${inputs}$ 个输入中选。`,
              ),
            ]
          : []),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["Count the inputs", "数输入"], t(`$2^{${n}} = ${inputs}$ inputs.`, `共 $2^{${n}} = ${inputs}$ 个输入。`)],
          [
            ["Choose the inputs that give 1", "选出取 1 的输入"],
            t(
              `$\\binom{${inputs}}{${k}} = ${answer}$; the other inputs give $0$.`,
              `$\\binom{${inputs}}{${k}} = ${answer}$；其余输入都取 $0$。`,
            ),
          ],
        ],
        t(
          `Choosing instead the $${inputs - k}$ inputs that give $0$ gives $\\binom{${inputs}}{${inputs - k}} = ${answer}$ as well.`,
          `改为选出取 $0$ 的 $${inputs - k}$ 个输入，同样得 $\\binom{${inputs}}{${inputs - k}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const selfDualCompletions: KnowledgePointDef = {
  id: "completing-a-self-dual-function",
  title: t("Completing a self-dual function", "补全自对偶函数"),
  explanation: t(
    "A self-dual function satisfies $f(\\bar{x}) = \\overline{f(x)}$, so its value on an input fixes its value on the complementary input. The inputs therefore fall into complementary pairs, with one free choice per pair. Counting completions means counting the pairs that nothing has decided yet, and each of them doubles the count. With $6$ variables the $64$ inputs form $32$ pairs; if $10$ values are known, $22$ pairs are free and there are $2^{22} = 4194304$ completions.\n\n> **Watch out.** A known value also fixes the value at the complementary input, so count pairs, not inputs: the $2^n$ inputs give only $2^{n - 1}$ free choices.",
    "自对偶函数满足 $f(\\bar{x}) = \\overline{f(x)}$，所以它在一个输入上的值决定了在互补输入上的值。于是输入分成互补的对，每一对只有一次自由选择。计算补全的方式，就是数出尚未确定的对，每一对都使个数加倍。$6$ 个变量时 $64$ 个输入组成 $32$ 对；若已知 $10$ 个值，则有 $22$ 对自由，共 $2^{22} = 4194304$ 种补全。\n\n> **注意。** 一个已知的值同时确定了互补输入上的值，所以要数对而不是数输入：$2^n$ 个输入只有 $2^{n - 1}$ 次自由选择。",
  ),
  generate(rng) {
    const [n, k] = rng.pick([
      [2, 1] as const,
      ...range(1, 3).map((k) => [3, k] as const),
      ...range(1, 7).map((k) => [4, k] as const),
      ...range(1, 15).map((k) => [5, k] as const),
    ]);
    const pairs = 2 ** (n - 1);
    const free = pairs - k;
    const answer = 2 ** free;
    return numberProblem({
      prompt: t(
        `The values of a self-dual Boolean function of $${n}$ variables are known on $${k}$ input${k === 1 ? "" : "s"}, no two of which are complements. How many such functions have these values?`,
        `一个 $${n}$ 元自对偶布尔函数在 $${k}$ 个输入上的值已知，这些输入两两不互补。有多少个这样的函数取这些值？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          2 ** (2 ** n - k),
          "That treats every unknown input as a free choice, but each pair of complements has only one.",
          "那是把每个未知输入都当作自由选择，但每一对互补输入只有一次选择。",
        ),
        why(
          2 ** pairs,
          `That ignores the $${k}$ known values, which settle $${k}$ of the pairs.`,
          `那是忽略了 $${k}$ 个已知值，它们确定了其中 $${k}$ 对。`,
        ),
        why(
          2 ** (2 ** n - 2 * k),
          "That frees each undecided input on its own, but its value fixes the value at its complement.",
          "那是让每个未确定的输入各自自由，但它的值决定了互补输入上的值。",
        ),
        why(free, "That counts the free pairs, not the ways to fill them.", "那是自由对的个数，而不是填写它们的方式数。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Pair the inputs", "把输入配对"],
            t(
              `The $2^{${n}} = ${2 ** n}$ inputs form $${pairs}$ complementary pairs.`,
              `$2^{${n}} = ${2 ** n}$ 个输入组成 $${pairs}$ 个互补对。`,
            ),
          ],
          [
            ["Remove the settled pairs", "去掉已确定的对"],
            t(
              `The known values settle $${k}$ of them, leaving $${pairs} - ${k} = ${free}$ free.`,
              `已知的值确定了其中 $${k}$ 对，剩下 $${pairs} - ${k} = ${free}$ 对自由。`,
            ),
          ],
          [
            ["Fill the free pairs", "填写自由的对"],
            t(
              `$${free === 1 ? "2" : `${pow(2, free)} = ${answer}`}$ ways.`,
              `共 $${free === 1 ? "2" : `${pow(2, free)} = ${answer}`}$ 种方法。`,
            ),
          ],
        ],
        t(
          `The known values are one of $${pow(2, k)}$ choices for their pairs, and each leaves the same number of completions: $${pow(2, k)} \\cdot ${answer} = ${pow(2, pairs)}$, the number of self-dual functions of $${n}$ variables.`,
          `已知的值是它们所在各对的 $${pow(2, k)}$ 种取法之一，每种取法留下的补全数相同：$${pow(2, k)} \\cdot ${answer} = ${pow(2, pairs)}$，正是 $${n}$ 元自对偶函数的个数。`,
        ),
      ),
    });
  },
};

const thresholdWeight: KnowledgePointDef = {
  id: "the-true-inputs-of-a-threshold-function",
  title: t("The true inputs of a threshold function", "阈值函数的真输入"),
  explanation: t(
    "A threshold function equals one when at least $k$ of its variables equal one. It is monotonic, because turning a zero into a one can never bring the count below the threshold. Its value depends only on how many ones an input has, so its true inputs can be counted by adding a binomial coefficient for each allowed count. With $10$ variables and $k = 8$: $\\binom{10}{8} + \\binom{10}{9} + \\binom{10}{10} = 45 + 10 + 1 = 56$.\n\n> **Watch out.** At least $k$ includes exactly $k$, so the sum starts at $\\binom{n}{k}$; and it counts inputs, so it adds binomial coefficients rather than fixing $k$ particular variables.",
    "阈值函数在至少 $k$ 个变量取一时取值为一。它是单调的，因为把零改成一不会使个数降到阈值以下。它的值只取决于输入中一的个数，所以可以对每个允许的个数加上一个二项式系数，数出真输入。$10$ 个变量、$k = 8$ 时：$\\binom{10}{8} + \\binom{10}{9} + \\binom{10}{10} = 45 + 10 + 1 = 56$。\n\n> **注意。** 至少 $k$ 个包括恰好 $k$ 个，所以和从 $\\binom{n}{k}$ 开始；它数的是输入，所以要把二项式系数相加，而不是固定 $k$ 个特定的变量。",
  ),
  generate(rng) {
    const [n, k] = rng.pick(range(3, 8).flatMap((n) => range(1, n).map((k) => [n, k] as const)));
    const counts = range(k, n);
    const answer = counts.reduce((s, j) => s + binom(n, j), 0);
    const terms = counts.map((j) => `\\binom{${n}}{${j}}`).join(" + ");
    const values = counts.map((j) => binom(n, j)).join(" + ");
    const below = range(0, k - 1);
    const rest = 2 ** n - answer;
    return numberProblem({
      prompt: t(
        `The function $f(x_1, \\dots, x_{${n}})$ equals $1$ exactly when at least $${k}$ of its variables equal $1$. On how many inputs does it equal $1$?`,
        `函数 $f(x_1, \\dots, x_{${n}})$ 恰好在至少 $${k}$ 个变量取 $1$ 时取值为 $1$。它在多少个输入上取值为 $1$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(binom(n, k), `That counts only the inputs with exactly $${k}$ ones.`, `那是只数了恰有 $${k}$ 个 $1$ 的输入。`),
        why(rest, "That counts the inputs on which $f$ is $0$.", "那是 $f$ 取 $0$ 的输入个数。"),
        why(
          2 ** (n - k),
          `That fixes $${k}$ particular variables at $1$; any $${k}$ of them may be the ones.`,
          `那是把 $${k}$ 个特定的变量固定为 $1$；其实任意 $${k}$ 个都可以。`,
        ),
        why(
          answer - binom(n, k),
          `That leaves out the inputs with exactly $${k}$ ones, which also count.`,
          `那是漏掉了恰有 $${k}$ 个 $1$ 的输入，它们也要算。`,
        ),
      ].filter((m, i, all) => m.value !== answer && m.value !== 0 && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["List the allowed counts of ones", "列出允许的 1 的个数"],
            t(
              `An input is true when it has ${counts.length === 1 ? `$${n}$ ones` : `$${k}$ to $${n}$ ones`}.`,
              `输入含 ${counts.length === 1 ? `$${n}$ 个` : `$${k}$ 到 $${n}$ 个`} $1$ 时为真。`,
            ),
          ],
          [
            ["Add the binomial coefficients", "把二项式系数相加"],
            t(
              `$${terms} = ${counts.length === 1 ? "" : `${values} = `}${answer}$.`,
              `$${terms} = ${counts.length === 1 ? "" : `${values} = `}${answer}$。`,
            ),
          ],
        ],
        t(
          `The inputs with fewer than $${k}$ ones number $${below.map((j) => `\\binom{${n}}{${j}}`).join(" + ")} = ${rest}$, and $${answer} + ${rest} = ${2 ** n} = 2^{${n}}$, every input.`,
          `少于 $${k}$ 个 $1$ 的输入有 $${below.map((j) => `\\binom{${n}}{${j}}`).join(" + ")} = ${rest}$ 个，而 $${answer} + ${rest} = ${2 ** n} = 2^{${n}}$，正是全部输入。`,
        ),
      ),
    });
  },
};

const gateDepth: KnowledgePointDef = {
  id: "the-depth-of-a-tree-of-gates",
  title: t("The depth of a tree of gates", "门电路树的深度"),
  explanation: t(
    "Combining many inputs with two-input gates takes one gate fewer than the number of inputs, however they are arranged. The arrangement decides the delay, which is the number of gates on the longest path. Each level can at most double the number of inputs covered, so the best depth is a rounded-up base-two logarithm. For $1000$ inputs: $2^{9} = 512$ is too few and $2^{10} = 1024$ is enough, so the depth is $10$, although $999$ gates are needed.\n\n> **Watch out.** The number of gates is always one less than the number of inputs; the question asks for levels, and $k$ levels reach at most $2^k$ inputs, so round the logarithm up, not down.",
    "用两输入门合并多个输入，无论怎样安排，所需的门都比输入少一个。安排方式决定的是延迟，也就是最长路径上门的个数。每一层最多使覆盖的输入翻倍，所以最优深度是向上取整的以二为底的对数。$1000$ 个输入时：$2^{9} = 512$ 不够，$2^{10} = 1024$ 足够，所以深度是 $10$，尽管需要 $999$ 个门。\n\n> **注意。** 门的个数总比输入少一个；题目问的是层数，$k$ 层最多覆盖 $2^k$ 个输入，所以对数要向上取整，而不是向下取整。",
  ),
  generate(rng) {
    const n = rng.int(5, 200);
    const answer = Math.ceil(Math.log2(n));
    const halvings = range(0, answer).map((j) => `$${Math.ceil(n / 2 ** j)}$`);
    return numberProblem({
      prompt: t(
        `An AND of $${n}$ inputs is built from two-input AND gates. What is the smallest possible number of gates on the longest path from an input to the output?`,
        `用两输入与门构造 $${n}$ 个输入的与。从输入到输出的最长路径上，门的个数最少是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n - 1,
          "That is the number of gates, which a chain would also need; a balanced tree is far shallower.",
          "那是门的个数，链状连接也需要这么多；平衡的树要浅得多。",
        ),
        why(
          answer - 1,
          `That is one level too few: $2^{${answer - 1}} = ${2 ** (answer - 1)}$ is less than $${n}$.`,
          `那少了一层：$2^{${answer - 1}} = ${2 ** (answer - 1)}$ 小于 $${n}$。`,
        ),
        why(Math.ceil(n / 2), "That counts the gates of the first level, not the levels.", "那是第一层的门数，而不是层数。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Bound the inputs of a tree", "估计树的输入数"],
            t("A tree with $k$ levels of two-input gates has at most $2^k$ inputs.", "$k$ 层两输入门组成的树最多有 $2^k$ 个输入。"),
          ],
          [
            ["Find the smallest k", "求最小的 k"],
            t(
              `$2^{${answer - 1}} = ${2 ** (answer - 1)} < ${n} \\le 2^{${answer}} = ${2 ** answer}$, so $${answer}$ levels are needed and enough.`,
              `$2^{${answer - 1}} = ${2 ** (answer - 1)} < ${n} \\le 2^{${answer}} = ${2 ** answer}$，所以需要且只需 $${answer}$ 层。`,
            ),
          ],
        ],
        t(
          `Halving $${n}$ and rounding up, level by level, reaches one output after $${answer}$ halvings: ${halvings.join(", ")}.`,
          `把 $${n}$ 逐层减半并向上取整，经过 $${answer}$ 次减半得到一个输出：${halvings.join("，")}。`,
        ),
      ),
    });
  },
};

const twosComplement: KnowledgePointDef = {
  id: "reading-twos-complement",
  title: t("Reading two's complement", "读二进制补码"),
  explanation: t(
    "Computers subtract by adding negative numbers written in two's complement. In this code the leading bit of an $n$-bit pattern has the weight $-2^{n-1}$ instead of $2^{n-1}$, while all the other bits keep their usual weights. So a pattern that starts with one stands for a negative number, found by adding up the weights. In six bits, for example, the leading bit weighs $-32$, so $101101$ stands for $-32 + 8 + 4 + 1 = -19$.\n\n> **Watch out.** Only the leading bit changes sign; the others still count positively. Flipping the bits alone gives a number one too large, because the two's complement of $x$ is the flipped pattern plus one.",
    "计算机通过加上用补码表示的负数来做减法。在这种编码中，$n$ 位模式的最高位权重是 $-2^{n-1}$ 而不是 $2^{n-1}$，其余各位的权重不变。所以以一开头的模式表示负数，把各位权重相加就能得到它的值。例如在六位中，最高位的权重是 $-32$，所以 $101101$ 表示 $-32 + 8 + 4 + 1 = -19$。\n\n> **注意。** 只有最高位变号，其余各位仍按正数计。只把各位取反得到的数大了一，因为 $x$ 的补码是取反后再加一。",
  ),
  generate(rng) {
    const v = rng.int(128, 255);
    const bits = v.toString(2);
    const rest = v - 128;
    const answer = v - 256;
    return numberProblem({
      prompt: t(
        `The $8$-bit pattern $${bits}$ is an integer in two's complement. What is its value?`,
        `$8$ 位模式 $${bits}$ 是用补码表示的整数。它的值是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          v,
          `That reads the pattern as an unsigned number, giving the leading bit the weight $128$ instead of $-128$.`,
          `那是把模式当作无符号数来读，给了最高位权重 $128$ 而不是 $-128$。`,
        ),
        ...(rest > 0
          ? [
              why(
                128 - v,
                `That puts the minus sign on the other bits, $-${rest}$, instead of on the leading bit.`,
                `那是把负号放在其余各位 $-${rest}$ 上，而不是放在最高位上。`,
              ),
            ]
          : []),
        why(
          v - 255,
          "That negates the flipped pattern without adding one, which gives a number one too large.",
          "那是把取反后的模式取负而没有加一，结果大了一。",
        ),
        why(rest, "That drops the leading bit instead of giving it the weight $-128$.", "那是丢掉了最高位，而不是给它权重 $-128$。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Split off the leading bit", "分出最高位"],
            t(
              `The leading $1$ has the weight $-128$, and the other seven bits $${bits.slice(1)}$ are worth $${rest}$.`,
              `最高位的 $1$ 权重是 $-128$，其余七位 $${bits.slice(1)}$ 的值是 $${rest}$。`,
            ),
          ],
          [["Add the weights", "把权重相加"], t(`$-128 + ${rest} = ${answer}$.`, `$-128 + ${rest} = ${answer}$。`)],
        ],
        t(
          `Read without a sign the pattern is $${v}$, and the leading bit then counts $256$ too much: $${v} - 256 = ${answer}$.`,
          `不计符号时这个模式是 $${v}$，此时最高位多算了 $256$：$${v} - 256 = ${answer}$。`,
        ),
      ),
    });
  },
};

const binaryPeriod: KnowledgePointDef = {
  id: "the-period-of-a-binary-fraction",
  title: t("The period of a binary fraction", "二进制小数的周期"),
  explanation: t(
    "A fraction with an odd denominator $q$ has a binary expansion that repeats from the first digit. The length of the repeating block is the smallest $k$ for which $2^k$ leaves remainder one on division by $q$. The numerator does not matter as long as the fraction is in lowest terms and below one. For $\\frac{5}{127}$ the block has length $7$, since $2^7 = 128 = 127 + 1$ and no smaller power of $2$ exceeds $127$.\n\n> **Watch out.** The period is the first power that leaves remainder one. The numbers $q - 1$ and $\\varphi(q)$ are always multiples of it, but they are often larger.",
    "分母 $q$ 为奇数的分数，其二进制展开从第一位起就循环。循环节的长度是使 $2^k$ 除以 $q$ 余一的最小 $k$。只要分数是最简的且小于一，分子就不起作用。$\\frac{5}{127}$ 的循环节长 $7$，因为 $2^7 = 128 = 127 + 1$，而更小的 $2$ 的幂都不超过 $127$。\n\n> **注意。** 周期是第一个余一的幂。$q - 1$ 和 $\\varphi(q)$ 总是它的倍数，但常常比它大。",
  ),
  generate(rng) {
    const q = rng.pick(
      range(1, 49)
        .map((i) => 2 * i + 1)
        .filter((n) => powersMod(2, n).length <= 12),
    );
    const p = rng.pick(range(1, q - 1).filter((i) => gcd(i, q) === 1));
    const powers = powersMod(2, q);
    const answer = powers.length;
    const list = powers.map((r, i) => `${pow(2, i + 1)} \\equiv ${r}`).join(", \\; ");
    const k = (2 ** answer - 1) / q;
    return numberProblem({
      prompt: t(
        `How long is the repeating block in the binary expansion of $\\frac{${p}}{${q}}$?`,
        `$\\frac{${p}}{${q}}$ 的二进制展开中，循环节有多长？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          q - 1,
          `That is $q - 1 = ${q - 1}$; the period divides it when $q$ is prime, but it is the first power with remainder $1$ that counts.`,
          `那是 $q - 1 = ${q - 1}$；$q$ 为质数时周期整除它，但要的是第一个余 $1$ 的幂。`,
        ),
        why(
          totient(q),
          `That is $\\varphi(${q}) = ${totient(q)}$, which the period divides but need not equal.`,
          `那是 $\\varphi(${q}) = ${totient(q)}$，周期整除它，但不一定等于它。`,
        ),
        why(answer + 1, "That counts one power past the first remainder of $1$.", "那是数过了第一个余 $1$ 的幂，多数了一个。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["List the remainders of the powers of $2$", "列出 $2$ 的幂的余数"], t(`Modulo $${q}$: $${list}$.`, `模 $${q}$：$${list}$。`)],
          [
            ["Find the first remainder of $1$", "找第一个余 $1$ 的幂"],
            t(
              `It appears at $${pow(2, answer)}$, so the block has length $${answer}$.`,
              `它出现在 $${pow(2, answer)}$，所以循环节长度是 $${answer}$。`,
            ),
          ],
        ],
        t(
          k === 1
            ? `$${pow(2, answer)} - 1 = ${q}$ is the denominator itself, and a fraction over $${pow(2, answer)} - 1$ repeats a block of $${answer}$ binary digits.`
            : `$${pow(2, answer)} - 1 = ${2 ** answer - 1} = ${q} \\cdot ${k}$, so $\\frac{1}{${q}} = \\frac{${k}}{${2 ** answer - 1}}$, and a fraction over $${pow(2, answer)} - 1$ repeats a block of $${answer}$ binary digits.`,
          k === 1
            ? `$${pow(2, answer)} - 1 = ${q}$ 就是分母本身，而分母为 $${pow(2, answer)} - 1$ 的分数循环一个 $${answer}$ 位的二进制块。`
            : `$${pow(2, answer)} - 1 = ${2 ** answer - 1} = ${q} \\cdot ${k}$，所以 $\\frac{1}{${q}} = \\frac{${k}}{${2 ** answer - 1}}$，而分母为 $${pow(2, answer)} - 1$ 的分数循环一个 $${answer}$ 位的二进制块。`,
        ),
      ),
    });
  },
};

const bitsOfAHexNumber: KnowledgePointDef = {
  id: "the-number-of-bits-of-a-hexadecimal-integer",
  title: t("The number of bits of a hexadecimal integer", "十六进制整数的位数"),
  explanation: t(
    "Each hexadecimal digit stands for exactly four bits, so converting between the two bases never needs arithmetic. The one exception is the leading digit. It may start with zeros in its four bits, and these are not written. So only the leading digit needs thought when counting the bits of the number. For $\\mathrm{3A0F51C2}_{16}$ the seven later digits give $28$ bits and the leading $3 = 11_2$ gives $2$ more, so the number has $30$ bits.\n\n> **Watch out.** Give every digit after the first a full four bits, even a $0$; give the leading digit only as many bits as its own binary numeral has.",
    "每个十六进制数字恰好对应四个二进制位，所以这两种进制之间的转换不需要计算。唯一的例外是最高位的数字。它的四位可能以零开头，而这些零不写出来。所以数二进制位数时，只有最高位数字需要留意。$\\mathrm{3A0F51C2}_{16}$ 后面七个数字给出 $28$ 位，最高位 $3 = 11_2$ 再给出 $2$ 位，所以这个数有 $30$ 位。\n\n> **注意。** 第一位之后的每个数字都算满四位，即使是 $0$；最高位数字只算它自己的二进制数字的位数。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const lead = rng.int(1, 15);
    const tail = range(1, k - 1)
      .map(() => rng.int(0, 15).toString(16).toUpperCase())
      .join("");
    const hex = `${lead.toString(16).toUpperCase()}${tail}`;
    const leadBits = lead.toString(2);
    const answer = 4 * (k - 1) + leadBits.length;
    const L = leadBits.length;
    const leadDigit = lead.toString(16).toUpperCase();
    return numberProblem({
      prompt: t(
        `How many bits does $\\mathrm{${hex}}_{16}$ have when written in binary without leading zeros?`,
        `$\\mathrm{${hex}}_{16}$ 写成不带前导零的二进制时有多少位？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          4 * k,
          `That gives the leading digit a full four bits, but $${leadBits}$ has only $${L}$.`,
          `那是给最高位数字算了满四位，但 $${leadBits}$ 只有 $${L}$ 位。`,
        ),
        why(4 * (k - 1), "That leaves out the bits of the leading digit.", "那是漏掉了最高位数字的二进制位。"),
        why(k, "That counts hexadecimal digits, not bits.", "那是数了十六进制数字的个数，而不是二进制位数。"),
        why(
          4 * (k - 1) + 1,
          `That gives the leading digit a single bit, but $${leadBits}$ has $${L}$.`,
          `那是给最高位数字只算了一位，但 $${leadBits}$ 有 $${L}$ 位。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count the later digits", "数后面的数字"],
            t(
              k === 2
                ? "The one digit after the first gives $4$ bits."
                : `The $${k - 1}$ digits after the first give $4 \\cdot ${k - 1} = ${4 * (k - 1)}$ bits.`,
              k === 2
                ? "第一位之后的一个数字给出 $4$ 位。"
                : `第一位之后的 $${k - 1}$ 个数字给出 $4 \\cdot ${k - 1} = ${4 * (k - 1)}$ 位。`,
            ),
          ],
          [
            ["Count the leading digit", "数最高位数字"],
            t(
              `$\\mathrm{${leadDigit}}_{16} = ${leadBits}_2$ has $${L}$ ${L === 1 ? "bit" : "bits"}, for a total of $${4 * (k - 1)} + ${L} = ${answer}$.`,
              `$\\mathrm{${leadDigit}}_{16} = ${leadBits}_2$ 有 $${L}$ 位，共 $${4 * (k - 1)} + ${L} = ${answer}$ 位。`,
            ),
          ],
        ],
        L === 4
          ? t(
              `The leading digit $${leadBits}$ already starts with a $1$, so all $4 \\cdot ${k} = ${answer}$ bits count.`,
              `最高位数字 $${leadBits}$ 已经以 $1$ 开头，所以 $4 \\cdot ${k} = ${answer}$ 位全都算。`,
            )
          : t(
              `Padded to four bits the leading digit is $${leadBits.padStart(4, "0")}$; dropping its $${4 - L}$ leading ${L === 3 ? "zero" : "zeros"} from all $${4 * k}$ bits gives $${4 * k} - ${4 - L} = ${answer}$.`,
              `补足四位时最高位数字是 $${leadBits.padStart(4, "0")}$；从全部 $${4 * k}$ 位中去掉它的 $${4 - L}$ 个前导零，得 $${4 * k} - ${4 - L} = ${answer}$。`,
            ),
      ),
    });
  },
};

const digitSumRemainder: KnowledgePointDef = {
  id: "remainders-from-the-digit-sum-in-base-b",
  title: t("Remainders from the digit sum in base b", "由数字和求 b 进制数的余数"),
  explanation: t(
    "The rule that a number and its digit sum have the same remainder on division by nine works in every base. In base $b$, each power of $b$ leaves remainder one on division by $b - 1$. So each digit counts as itself, and the remainder can be found without converting the number to decimal. For $3221_4$ the digit sum is $3 + 2 + 2 + 1 = 8 = 3 \\cdot 2 + 2$, so the remainder on division by $3$ is $2$; indeed $3221_4 = 233 = 3 \\cdot 77 + 2$.\n\n> **Watch out.** Divide by $b - 1$, not by $9$ or by $b$; and reduce the digit sum itself, which is the remainder only when it is below $b - 1$.",
    "一个数与其数字和除以九的余数相同，这条规则在任何进制中都成立。在 $b$ 进制中，$b$ 的每个幂除以 $b - 1$ 都余一。所以每个数字都只算它本身，不必把数转换成十进制就能求出余数。$3221_4$ 的数字和是 $3 + 2 + 2 + 1 = 8 = 3 \\cdot 2 + 2$，所以它除以 $3$ 余 $2$；确实 $3221_4 = 233 = 3 \\cdot 77 + 2$。\n\n> **注意。** 要除以 $b - 1$，而不是 $9$ 或 $b$；数字和本身还要再取余，只有它小于 $b - 1$ 时才就是余数。",
  ),
  generate(rng) {
    const b = rng.int(5, 9);
    const first = rng.int(1, b - 1);
    const others = [rng.int(0, b - 1), rng.int(0, b - 1), rng.int(0, b - 1)];
    const digits = [first, ...others];
    const sum = digits.reduce((s, x) => s + x, 0);
    const answer = sum % (b - 1);
    const last = others[2] as number;
    const d = b - 1;
    const quotient = Math.floor(sum / d);
    const value = digits.reduce((s, x) => s * b + x, 0);
    const split = (qt: number) => `${qt === 1 ? `${d}` : `${d} \\cdot ${qt}`}${answer === 0 ? "" : ` + ${answer}`}`;
    return numberProblem({
      prompt: t(
        `What is the remainder when $${digits.join("")}_{${b}}$ is divided by $${d}$?`,
        `$${digits.join("")}_{${b}}$ 除以 $${d}$ 的余数是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(sum, `That is the digit sum itself, which still has to be divided by $${d}$.`, `那是数字和本身，它还要再除以 $${d}$ 取余。`),
        why(
          last % d,
          `That uses only the last digit, which decides the remainder on division by $${b}$, not by $${d}$.`,
          `那是只用了最后一位，它决定的是除以 $${b}$ 的余数，而不是除以 $${d}$ 的余数。`,
        ),
        why((sum + 1) % d, "That is one off from the remainder of the digit sum.", "那与数字和的余数差了一。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Replace the number by its digit sum", "用数字和代替这个数"],
            t(
              `Each power of $${b}$ is one more than a multiple of $${d}$, so the number leaves the same remainder as $${digits.join(" + ")} = ${sum}$.`,
              `$${b}$ 的每个幂都比 $${d}$ 的某个倍数多一，所以这个数与 $${digits.join(" + ")} = ${sum}$ 的余数相同。`,
            ),
          ],
          [
            ["Divide the digit sum", "用数字和做除法"],
            quotient === 0
              ? t(
                  `$${sum}$ is already below $${d}$, so the remainder is $${answer}$.`,
                  `$${sum}$ 已经小于 $${d}$，所以余数是 $${answer}$。`,
                )
              : sum === d
                ? t(`The digit sum is $${d}$ itself, so the remainder is $0$.`, `数字和就是 $${d}$ 本身，所以余数是 $0$。`)
                : t(
                    `$${sum} = ${split(quotient)}$, so the remainder is $${answer}$.`,
                    `$${sum} = ${split(quotient)}$，所以余数是 $${answer}$。`,
                  ),
          ],
        ],
        t(
          `In decimal $${digits.join("")}_{${b}} = ${value} = ${split(Math.floor(value / d))}$.`,
          `化成十进制，$${digits.join("")}_{${b}} = ${value} = ${split(Math.floor(value / d))}$。`,
        ),
      ),
    });
  },
};

const fermatTest: KnowledgePointDef = {
  id: "the-fermat-primality-test",
  title: t("The Fermat primality test", "费马素性检验"),
  explanation: t(
    "Fermat's little theorem says that $a^{n-1}$ leaves remainder one on division by a prime $n$, when $a$ is not a multiple of it. So a different remainder proves that $n$ is composite, even though no factor has been found. Repeated squaring makes the power quick to compute, even for very large numbers. With the base $10$ and $n = 21$: $10^2 \\equiv 16$, $10^4 \\equiv 4$, $10^8 \\equiv 16$, $10^{16} \\equiv 4$, and $20 = 16 + 4$ gives $10^{20} \\equiv 4 \\cdot 4 = 16 \\pmod{21}$, so $21$ is composite.\n\n> **Watch out.** Raise $a$ to the power $n - 1$, not $n$. A remainder of one does not prove that $n$ is prime: some composite numbers pass the test for some bases.",
    "费马小定理说，当 $n$ 是素数且 $a$ 不是它的倍数时，$a^{n-1}$ 除以 $n$ 余一。所以余数不是一就证明了 $n$ 是合数，尽管并没有找到因子。反复平方使这个幂很快就能算出，即使数非常大也是如此。取底 $10$、$n = 21$：$10^2 \\equiv 16$，$10^4 \\equiv 4$，$10^8 \\equiv 16$，$10^{16} \\equiv 4$，由 $20 = 16 + 4$ 得 $10^{20} \\equiv 4 \\cdot 4 = 16 \\pmod{21}$，所以 $21$ 是合数。\n\n> **注意。** 要把 $a$ 升到 $n - 1$ 次幂，而不是 $n$ 次。余数是一并不能证明 $n$ 是素数：有些合数对某些底也能通过检验。",
  ),
  generate(rng) {
    const composites = range(4, 49)
      .map((i) => 2 * i + 1)
      .filter((n) => range(2, n - 1).some((i) => n % i === 0));
    const [a, n] = rng.pick(
      [2, 3, 5, 7].flatMap((a) => composites.filter((n) => gcd(a, n) === 1 && powMod(a, n - 1, n) !== 1).map((n) => [a, n] as const)),
    );
    const e = n - 1;
    const answer = powMod(a, e, n);
    const squares: string[] = [];
    for (let j = 2; j <= e; j *= 2) squares.push(`${a}^{${j}} \\equiv ${powMod(a, j, n)}`);
    const parts = range(0, 7)
      .map((i) => 2 ** i)
      .filter((v) => (e & v) !== 0)
      .reverse();
    const split = parts.length > 1 ? `$${e} = ${parts.join(" + ")}$` : "";
    const factors = parts.map((v) => powMod(a, v, n)).filter((v) => v !== 1);
    const product = factors.length > 1 ? `$${factors.join(" \\cdot ")} \\equiv ${answer}$` : `$${answer}$`;
    const d = range(2, n - 1).find((i) => n % i === 0) as number;
    return numberProblem({
      prompt: t(
        `To test whether $${n}$ is prime with the base $${a}$, find the remainder of $${a}^{${e}}$ on division by $${n}$.`,
        `用底 $${a}$ 检验 $${n}$ 是否为素数：求 $${a}^{${e}}$ 除以 $${n}$ 的余数。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          1,
          `That is the remainder a prime would give; $${n}$ is composite, so the power need not leave $1$, and here it does not.`,
          `那是素数才会给出的余数；$${n}$ 是合数，这个幂不一定余 $1$，这里也确实不余 $1$。`,
        ),
        why(
          n - 1,
          `That is $-1$ modulo $${n}$, a guess rather than the remainder the squarings give.`,
          `那是模 $${n}$ 的 $-1$，是猜出来的，而不是反复平方算出的余数。`,
        ),
        why((answer * a) % n, `That is the remainder of $${a}^{${n}}$, one power too many.`, `那是 $${a}^{${n}}$ 的余数，多乘了一次。`),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["Square repeatedly", "反复平方"], t(`Modulo $${n}$: $${squares.join(", \\; ")}$.`, `模 $${n}$：$${squares.join(", \\; ")}$。`)],
          [
            ["Combine the squares", "组合各次平方"],
            split
              ? t(`Since ${split}, the remainder is ${product}.`, `因为 ${split}，余数是 ${product}。`)
              : t(`$${e}$ is itself a power of $2$, so the remainder is $${answer}$.`, `$${e}$ 本身是 $2$ 的幂，所以余数是 $${answer}$。`),
          ],
          [
            ["Draw the conclusion", "得出结论"],
            t(`The remainder is not $1$, so $${n}$ is composite.`, `余数不是 $1$，所以 $${n}$ 是合数。`),
          ],
        ],
        t(`Indeed $${n} = ${d} \\cdot ${n / d}$ is composite.`, `确实 $${n} = ${d} \\cdot ${n / d}$ 是合数。`),
      ),
    });
  },
};

const coprimeInARange: KnowledgePointDef = {
  id: "counting-coprime-integers-in-a-range",
  title: t("Counting coprime integers in a range", "数区间内的互素整数"),
  explanation: t(
    "Whether an integer is coprime to $n$ depends only on its remainder on division by $n$. So the pattern of coprime integers repeats with period $n$, with exactly $\\varphi(n)$ of them in each block. A range made of whole blocks therefore contains a multiple of $\\varphi(n)$. From $1$ to $120$ there are ten blocks of $12$, each holding the four integers coprime to $12$ that sit at $1$, $5$, $7$, $11$, so $10 \\cdot 4 = 40$ integers are coprime to $12$.\n\n> **Watch out.** The count is not $\\varphi$ of the range's end: $\\varphi(120) = 32$ also leaves out the multiples of $5$, which may well be coprime to $12$.",
    "一个整数是否与 $n$ 互素，只取决于它除以 $n$ 的余数。所以互素整数的分布以 $n$ 为周期重复，每一段恰有 $\\varphi(n)$ 个。因此由完整的若干段组成的区间，其个数是 $\\varphi(n)$ 的倍数。从 $1$ 到 $120$ 有十段长 $12$ 的区间，每段在 $1$、$5$、$7$、$11$ 位置上有四个与 $12$ 互素的整数，所以有 $10 \\cdot 4 = 40$ 个整数与 $12$ 互素。\n\n> **注意。** 个数不是区间端点的欧拉函数值：$\\varphi(120) = 32$ 还去掉了 $5$ 的倍数，而它们可能与 $12$ 互素。",
  ),
  generate(rng) {
    const n = rng.pick(range(6, 60).filter((v) => totient(v) < v - 1));
    const m = rng.int(2, 9);
    const N = n * m;
    const phi = totient(n);
    const answer = m * phi;
    const primes = range(2, n).filter((p) => n % p === 0 && totient(p) === p - 1);
    const fractions = primes.map((p) => `\\frac{${p - 1}}{${p}}`).join(" \\cdot ");
    const residues = range(1, n).filter((r) => gcd(r, n) === 1);
    return numberProblem({
      prompt: t(
        `How many of the integers from $1$ to $${N}$ are coprime to $${n}$?`,
        `从 $1$ 到 $${N}$ 的整数中，有多少个与 $${n}$ 互素？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(phi, `That counts a single block of $${n}$, not all $${m}$ blocks.`, `那只数了一段长 $${n}$ 的区间，而不是全部 $${m}$ 段。`),
        why(N - answer, `That counts the integers that share a factor with $${n}$.`, `那数的是与 $${n}$ 有公因数的整数。`),
        why(
          totient(N),
          `That is $\\varphi(${N})$, which also leaves out integers that share a factor with $${m}$ but not with $${n}$.`,
          `那是 $\\varphi(${N})$，它还去掉了与 $${m}$ 有公因数、却与 $${n}$ 互素的整数。`,
        ),
        why(answer + m, "That counts one extra integer in each block.", "那是每段都多数了一个整数。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Split the range into blocks", "把区间分段"],
            t(
              `$${N} = ${n} \\cdot ${m}$, so the range is $${m}$ blocks of $${n}$ consecutive integers.`,
              `$${N} = ${n} \\cdot ${m}$，所以这个区间是 $${m}$ 段连续 $${n}$ 个整数。`,
            ),
          ],
          [
            ["Count one block", "数一段"],
            phi <= 12
              ? t(
                  `The remainders coprime to $${n}$ are $${residues.join(", ")}$, so each block holds $\\varphi(${n}) = ${phi}$.`,
                  `与 $${n}$ 互素的余数是 $${residues.join(", ")}$，所以每段有 $\\varphi(${n}) = ${phi}$ 个。`,
                )
              : t(`Each block holds $\\varphi(${n}) = ${phi}$.`, `每段有 $\\varphi(${n}) = ${phi}$ 个。`),
          ],
          [["Multiply", "相乘"], t(`$${m} \\cdot ${phi} = ${answer}$.`, `$${m} \\cdot ${phi} = ${answer}$。`)],
        ],
        t(
          `Removing the multiples of each prime factor of $${n}$ from all $${N}$ integers gives $${N} \\cdot ${fractions} = ${answer}$.`,
          `从全部 $${N}$ 个整数中去掉 $${n}$ 的每个质因数的倍数，得 $${N} \\cdot ${fractions} = ${answer}$。`,
        ),
      ),
    });
  },
};

const orderModN: KnowledgePointDef = {
  id: "the-order-of-a-number-modulo-n",
  title: t("The order of a number modulo n", "数模 n 的阶"),
  explanation: t(
    "Euler's theorem guarantees that $a^{\\varphi(n)}$ leaves remainder one, but a smaller power may already do so. The smallest such positive exponent is called the order of $a$ modulo $n$, and it always divides $\\varphi(n)$. Knowing the order is what lets you reduce an exponent as far as it can possibly go. Modulo $26$, the powers of $3$ are $3$, $9$, $27 \\equiv 1$, so $3$ has order $3$, although $\\varphi(26) = 12$.\n\n> **Watch out.** The order is the first exponent that gives remainder one. $\\varphi(n)$, $n - 1$ and every multiple of the order give one as well, but they need not be the smallest.",
    "欧拉定理保证 $a^{\\varphi(n)}$ 余一，但更小的幂可能已经余一。满足这一点的最小正指数叫作 $a$ 模 $n$ 的阶，它总是整除 $\\varphi(n)$。知道了阶，才能把指数化简到最小。模 $26$ 时，$3$ 的幂依次是 $3$、$9$、$27 \\equiv 1$，所以 $3$ 的阶是 $3$，尽管 $\\varphi(26) = 12$。\n\n> **注意。** 阶是第一个给出余数一的指数。$\\varphi(n)$ 以及阶的每个倍数也都给出一，但它们不一定是最小的。",
  ),
  generate(rng) {
    const n = rng.int(7, 25);
    const a = rng.pick(range(2, n - 2).filter((i) => gcd(i, n) === 1));
    const powers = powersMod(a, n);
    const answer = powers.length;
    const phi = totient(n);
    const list = powers.map((r, i) => `${pow(a, i + 1)} \\equiv ${r}`).join(", \\; ");
    return numberProblem({
      prompt: t(
        `What is the smallest positive integer $k$ for which $${a}^k$ leaves remainder $1$ on division by $${n}$?`,
        `使 $${a}^k$ 除以 $${n}$ 余 $1$ 的最小正整数 $k$ 是多少？`,
      ),
      answer,
      solveFor: "k",
      mistakes: [
        why(
          phi,
          `That is $\\varphi(${n}) = ${phi}$, which Euler's theorem guarantees, but a smaller power already gives $1$.`,
          `那是 $\\varphi(${n}) = ${phi}$，欧拉定理保证它可行，但更小的幂已经余 $1$。`,
        ),
        why(
          n - 1,
          `That is $n - 1 = ${n - 1}$, the exponent of Fermat's little theorem, which need not even give $1$ when $${n}$ is not prime.`,
          `那是 $n - 1 = ${n - 1}$，费马小定理的指数；$${n}$ 不是质数时它甚至不一定余 $1$。`,
        ),
        why(
          2 * answer,
          `That is twice the order: $${a}^{${2 * answer}}$ also gives $1$, but it is not the smallest such power.`,
          `那是阶的两倍：$${a}^{${2 * answer}}$ 也余 $1$，但它不是最小的。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["List the powers", "列出各次幂"], t(`Modulo $${n}$: $${list}$.`, `模 $${n}$：$${list}$。`)],
          [
            ["Find the first remainder of $1$", "找第一个余 $1$ 的幂"],
            t(`It is $${pow(a, answer)}$, so $k = ${answer}$.`, `它是 $${pow(a, answer)}$，所以 $k = ${answer}$。`),
          ],
        ],
        phi === answer
          ? t(
              `The order must divide $\\varphi(${n}) = ${phi}$, and here it equals it.`,
              `阶必须整除 $\\varphi(${n}) = ${phi}$，这里恰好等于它。`,
            )
          : t(
              `The order must divide $\\varphi(${n}) = ${phi}$, and indeed $${phi} = ${answer} \\cdot ${phi / answer}$.`,
              `阶必须整除 $\\varphi(${n}) = ${phi}$，确实 $${phi} = ${answer} \\cdot ${phi / answer}$。`,
            ),
      ),
    });
  },
};

const linearCipherKeys: KnowledgePointDef = {
  id: "counting-keys-of-a-linear-cipher",
  title: t("Counting keys of a linear cipher", "线性密码的密钥个数"),
  explanation: t(
    "A linear cipher $E(x) = ax + b$ can only be decrypted if $a$ has an inverse modulo the alphabet size $m$, which requires $a$ to be coprime to $m$. The shift $b$ may be anything. So the number of keys is $m\\varphi(m)$, and for a small alphabet the cipher can be broken simply by trying them all. On an alphabet of $8$ symbols the multiplier must be $1$, $3$, $5$ or $7$, so there are $4 \\cdot 8 = 32$ keys.\n\n> **Watch out.** A nonzero multiplier is not enough: it must be coprime to $m$. The shift, on the other hand, is free, $b = 0$ included.",
    "线性密码 $E(x) = ax + b$ 要能解密，$a$ 必须在模字母表大小 $m$ 下有逆元，这要求 $a$ 与 $m$ 互素。平移量 $b$ 可以任取。所以密钥个数是 $m\\varphi(m)$，字母表较小时，只要逐个尝试就能破解。在 $8$ 个符号的字母表上，乘数只能是 $1$、$3$、$5$ 或 $7$，所以有 $4 \\cdot 8 = 32$ 个密钥。\n\n> **注意。** 乘数非零还不够，它必须与 $m$ 互素。而平移量可以任取，包括 $b = 0$。",
  ),
  generate(rng) {
    const m = rng.int(10, 50);
    const phi = totient(m);
    const answer = m * phi;
    const primes = range(2, m).filter((p) => m % p === 0 && totient(p) === p - 1);
    const fractions = primes.map((p) => `\\frac{${p - 1}}{${p}}`).join(" \\cdot ");
    return numberProblem({
      prompt: t(
        `How many keys $(a, b)$ does the linear cipher $E(x) = ax + b$ have on an alphabet of $${m}$ symbols, if every key must allow decryption?`,
        `在 $${m}$ 个符号的字母表上，线性密码 $E(x) = ax + b$ 有多少个密钥 $(a, b)$？要求每个密钥都能解密。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          m * m,
          `That lets the multiplier be anything, but only multipliers coprime to $${m}$ can be undone.`,
          `那是让乘数任取，但只有与 $${m}$ 互素的乘数才能还原。`,
        ),
        why(
          m * (m - 1),
          `That allows every nonzero multiplier, but only the $${phi}$ coprime to $${m}$ can be undone.`,
          `那是允许所有非零乘数，但只有与 $${m}$ 互素的 $${phi}$ 个才能还原。`,
        ),
        why(phi, `That counts only the multipliers and leaves out the $${m}$ shifts.`, `那只数了乘数，漏掉了 $${m}$ 种平移量。`),
        why(phi * (m - 1), "That leaves out the shift $b = 0$, which is allowed.", "那是漏掉了平移量 $b = 0$，而它是允许的。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count the multipliers", "数乘数"],
            t(
              `$a$ must be coprime to $${m}$: $\\varphi(${m}) = ${m} \\cdot ${fractions} = ${phi}$ choices.`,
              `$a$ 必须与 $${m}$ 互素：$\\varphi(${m}) = ${m} \\cdot ${fractions} = ${phi}$ 种取法。`,
            ),
          ],
          [
            ["Count the shifts and multiply", "数平移量并相乘"],
            t(
              `$b$ may be any of the $${m}$ symbols, so there are $${phi} \\cdot ${m} = ${answer}$ keys.`,
              `$b$ 可以是 $${m}$ 个符号中的任何一个，所以有 $${phi} \\cdot ${m} = ${answer}$ 个密钥。`,
            ),
          ],
        ],
        phi === m - 1
          ? t(
              `$${m}$ is prime, so every multiplier from $1$ to $${m - 1}$ is coprime to it: $${m - 1} \\cdot ${m} = ${answer}$.`,
              `$${m}$ 是质数，所以 $1$ 到 $${m - 1}$ 的每个乘数都与它互素：$${m - 1} \\cdot ${m} = ${answer}$。`,
            )
          : t(
              `Of the $${m * m}$ pairs, the $${m - phi}$ multipliers sharing a factor with $${m}$ spoil $${(m - phi) * m}$, and $${m * m} - ${(m - phi) * m} = ${answer}$.`,
              `在 $${m * m}$ 对中，与 $${m}$ 有公因数的 $${m - phi}$ 个乘数作废了 $${(m - phi) * m}$ 对，而 $${m * m} - ${(m - phi) * m} = ${answer}$。`,
            ),
      ),
    });
  },
};

const discreteLog: KnowledgePointDef = {
  id: "recovering-a-private-exponent-by-search",
  title: t("Recovering a private exponent by search", "通过搜索恢复私有指数"),
  explanation: t(
    "An eavesdropper on the Diffie–Hellman protocol sees the prime, the base and the public values. Finding a private exponent from these is the discrete logarithm problem. With a small prime, one can simply list powers of the base until the public value appears. The protocol is secure only because this search is hopeless for a huge prime. With $p = 53$, $g = 2$ and the public value $11$, the powers $2, 4, 8, 16, 32$ stay below $53$, and $2^6 = 64 = 53 + 11$, so the private exponent is $6$.\n\n> **Watch out.** The answer is the exponent, not the public value; and stop at the first power that matches, since adding the order of $g$ to it gives the same value again.",
    "窃听迪菲–赫尔曼协议的人能看到素数、底和公开值。由这些求私有指数，就是离散对数问题。素数很小时，只要依次列出底的幂，直到公开值出现。这个协议之所以安全，只是因为素数巨大时这种搜索毫无希望。取 $p = 53$、$g = 2$，公开值为 $11$：幂 $2, 4, 8, 16, 32$ 都小于 $53$，而 $2^6 = 64 = 53 + 11$，所以私有指数是 $6$。\n\n> **注意。** 答案是指数，而不是公开值；要在第一个相符的幂处停下，因为再加上 $g$ 的阶会再次得到同一个值。",
  ),
  generate(rng) {
    const options = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43].flatMap((p) =>
      range(2, p - 2).flatMap((g) => {
        const order = powersMod(g, p).length;
        return range(2, Math.min(7, order - 1)).map((x) => [p, g, x] as const);
      }),
    );
    const [p, g, x] = rng.pick(options);
    const A = powMod(g, x, p);
    const list = range(1, x)
      .map((j) => `${pow(g, j)} \\equiv ${powMod(g, j, p)}`)
      .join(", \\; ");
    const order = powersMod(g, p).length;
    const big = g ** x;
    return numberProblem({
      prompt: t(
        `In the Diffie–Hellman protocol with prime $${p}$ and base $${g}$, the public value is $${A}$. Find the smallest positive private exponent that gives this value.`,
        `在素数为 $${p}$、底为 $${g}$ 的迪菲–赫尔曼协议中，公开值是 $${A}$。求给出这个值的最小正私有指数。`,
      ),
      answer: x,
      form: "integer",
      mistakes: [
        why(x + 1, "That is one power past the first match.", "那是越过第一个相符的幂又多走了一步。"),
        why(
          p - 1 - x,
          `That exponent gives the inverse of $${A}$, since $${g}^{${p - 1}} \\equiv 1$; it does not give $${A}$ itself.`,
          `这个指数给出的是 $${A}$ 的逆，因为 $${g}^{${p - 1}} \\equiv 1$；它给不出 $${A}$ 本身。`,
        ),
        why(A, "That is the public value itself, not the exponent that produces it.", "那是公开值本身，而不是产生它的指数。"),
        why(
          x + order,
          `That also gives $${A}$, but it is not the smallest exponent: the powers repeat every $${order}$ steps.`,
          `它也给出 $${A}$，但不是最小的指数：幂每 $${order}$ 步重复一次。`,
        ),
      ].filter((m, i, all) => m.value !== x && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["List the powers", "列出各次幂"], t(`Modulo $${p}$: $${list}$.`, `模 $${p}$：$${list}$。`)],
          [
            ["Stop at the public value", "在公开值处停下"],
            t(
              `$${A}$ first appears at $${pow(g, x)}$, so the private exponent is $${x}$.`,
              `$${A}$ 第一次出现在 $${pow(g, x)}$，所以私有指数是 $${x}$。`,
            ),
          ],
        ],
        big < p
          ? t(
              `$${g}^{${x}} = ${big}$ is already below $${p}$, so it is the public value itself.`,
              `$${g}^{${x}} = ${big}$ 已经小于 $${p}$，所以它就是公开值本身。`,
            )
          : t(
              `$${g}^{${x}} = ${big} = ${Math.floor(big / p) === 1 ? `${p}` : `${p} \\cdot ${Math.floor(big / p)}`} + ${A}$.`,
              `$${g}^{${x}} = ${big} = ${Math.floor(big / p) === 1 ? `${p}` : `${p} \\cdot ${Math.floor(big / p)}`} + ${A}$。`,
            ),
      ),
    });
  },
};

const rsaFactorFromTotient: KnowledgePointDef = {
  id: "factoring-an-rsa-modulus-from-its-totient",
  title: t("Factoring an RSA modulus from its totient", "由欧拉函数值分解 RSA 模数"),
  explanation: t(
    "For $n = pq$, we have $\\varphi(n) = n - (p + q) + 1$. So anyone who learns $\\varphi(n)$ also learns the sum $p + q$, and the primes are then the two roots of a quadratic with a known sum and product. Keeping $\\varphi(n)$ secret is therefore just as important as keeping the primes secret. For $n = 3233$ and $\\varphi(n) = 3120$ the sum is $3233 - 3120 + 1 = 114$, and $x^2 - 114x + 3233 = (x - 53)(x - 61)$ gives the primes $53$ and $61$.\n\n> **Watch out.** The sum is $n - \\varphi(n) + 1$; forgetting the $+ 1$ makes the quadratic fail to factor. The sum itself is not one of the primes.",
    "对 $n = pq$，有 $\\varphi(n) = n - (p + q) + 1$。所以知道 $\\varphi(n)$ 的人也就知道了和 $p + q$，而这两个素数就是已知和与积的二次方程的两根。因此 $\\varphi(n)$ 的保密与素数本身的保密同样重要。对 $n = 3233$、$\\varphi(n) = 3120$，和是 $3233 - 3120 + 1 = 114$，而 $x^2 - 114x + 3233 = (x - 53)(x - 61)$ 给出两个素数 $53$ 和 $61$。\n\n> **注意。** 和是 $n - \\varphi(n) + 1$；漏掉 $+ 1$ 会使二次式无法分解。和本身并不是其中的素数。",
  ),
  generate(rng) {
    const primes = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const p = rng.pick(primes.slice(0, -1));
    const q = rng.pick(primes.filter((v) => v > p));
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const sum = p + q;
    const gap = q - p;
    return numberProblem({
      prompt: t(
        `An RSA modulus $n = ${n}$ is a product of two primes, and $\\varphi(n) = ${phi}$. Find the larger prime.`,
        `RSA 模数 $n = ${n}$ 是两个素数之积，$\\varphi(n) = ${phi}$。求较大的素数。`,
      ),
      answer: q,
      form: "integer",
      mistakes: [
        why(p, "That is the smaller of the two primes.", "那是两个素数中较小的一个。"),
        why(sum, `That is the sum $p + q = ${sum}$, not one of the primes.`, `那是和 $p + q = ${sum}$，而不是其中一个素数。`),
        why(
          n - phi,
          `That is $n - \\varphi(n) = ${n - phi}$, which is $p + q - 1$, one less than the sum and not a prime factor.`,
          `那是 $n - \\varphi(n) = ${n - phi}$，即 $p + q - 1$，比和少一，也不是质因数。`,
        ),
      ].filter((m, i, all) => m.value !== q && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Find the sum of the primes", "求两个素数之和"],
            t(
              `$p + q = n - \\varphi(n) + 1 = ${n} - ${phi} + 1 = ${sum}$.`,
              `$p + q = n - \\varphi(n) + 1 = ${n} - ${phi} + 1 = ${sum}$。`,
            ),
          ],
          [
            ["Find their difference", "求它们的差"],
            t(
              `$(q - p)^2 = (p + q)^2 - 4pq = ${sum * sum} - ${4 * n} = ${gap * gap}$, so $q - p = ${gap}$.`,
              `$(q - p)^2 = (p + q)^2 - 4pq = ${sum * sum} - ${4 * n} = ${gap * gap}$，所以 $q - p = ${gap}$。`,
            ),
          ],
          [
            ["Solve for the larger prime", "解出较大的素数"],
            t(
              `$q = \\frac{${sum} + ${gap}}{2} = ${q}$, and $p = ${p}$; they are the roots of $${poly([1, "x^2"], [-sum, "x"], [n, ""])} = 0$.`,
              `$q = \\frac{${sum} + ${gap}}{2} = ${q}$，$p = ${p}$；它们是 $${poly([1, "x^2"], [-sum, "x"], [n, ""])} = 0$ 的两根。`,
            ),
          ],
        ],
        t(
          `$${p} \\cdot ${q} = ${n}$ and $${p - 1} \\cdot ${q - 1} = ${phi}$.`,
          `$${p} \\cdot ${q} = ${n}$，且 $${p - 1} \\cdot ${q - 1} = ${phi}$。`,
        ),
      ),
    });
  },
};

const firstOrderLimit: KnowledgePointDef = {
  id: "the-limit-of-a-first-order-recurrence",
  title: t("The limit of a first-order recurrence", "一阶递推的极限"),
  explanation: t(
    "The recurrence $a_{n+1} = ra_n + c$ has the fixed point $L$ with $L = rL + c$. The distance from $L$ is multiplied by $r$ at each step, so if $|r| < 1$ the sequence tends to $L$, whatever the starting value is. For $a_{n+1} = \\frac{1}{5}a_n + 8$, $L = \\frac{1}{5}L + 8$ gives $\\frac{4}{5}L = 8$, so the limit is $L = 10$ without solving for the general term.\n\n> **Watch out.** Move $rL$ to the left before dividing: $(1 - r)L = c$, so divide by $1 - r$, not $1 + r$. The starting value plays no part in the limit.",
    "递推 $a_{n+1} = ra_n + c$ 有不动点 $L$，满足 $L = rL + c$。每一步到 $L$ 的距离都乘以 $r$，所以当 $|r| < 1$ 时，无论初始值是多少，数列都趋于 $L$。对 $a_{n+1} = \\frac{1}{5}a_n + 8$，由 $L = \\frac{1}{5}L + 8$ 得 $\\frac{4}{5}L = 8$，所以不必求通项，极限就是 $L = 10$。\n\n> **注意。** 先把 $rL$ 移到左边再相除：$(1 - r)L = c$，所以要除以 $1 - r$，不是 $1 + r$。初始值与极限无关。",
  ),
  generate(rng) {
    const r = rng.pick([
      Q.of(1, 2),
      Q.of(-1, 2),
      Q.of(1, 3),
      Q.of(-1, 3),
      Q.of(1, 4),
      Q.of(-1, 4),
      Q.of(2, 3),
      Q.of(-2, 3),
      Q.of(3, 4),
      Q.of(-3, 4),
    ]);
    const c = rng.pick(range(-12, 12).filter((v) => v !== 0));
    const start = rng.int(1, 9);
    const gap = Q.of(1).sub(r);
    const answer = Q.of(c).div(gap);
    const step = `${r.toLatex()}a_n ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
    return numberProblem({
      prompt: t(
        `A sequence has $a_0 = ${start}$ and $a_{n+1} = ${step}$. Find $\\lim_{n \\to \\infty} a_n$.`,
        `数列满足 $a_0 = ${start}$，$a_{n+1} = ${step}$。求 $\\lim_{n \\to \\infty} a_n$。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(c).div(Q.of(1).add(r)),
          "That divides by $1 + r$; moving $rL$ to the left gives $(1 - r)L = c$.",
          "那是除以了 $1 + r$；把 $rL$ 移到左边得 $(1 - r)L = c$。",
        ),
        why(
          Q.of(c),
          "That is the constant $c$; the limit is the fixed point, which solves $L = rL + c$.",
          "那是常数 $c$；极限是满足 $L = rL + c$ 的不动点。",
        ),
        why(
          Q.of(c).mul(r),
          "That multiplies $c$ by the ratio; the fixed point is $\\frac{c}{1 - r}$.",
          "那是把 $c$ 乘以比；不动点是 $\\frac{c}{1 - r}$。",
        ),
        why(
          Q.of(start),
          `That is the starting value $a_0 = ${start}$, which does not affect the limit.`,
          `那是初始值 $a_0 = ${start}$，它不影响极限。`,
        ),
      ].filter((m, i, all) => all.findIndex((o) => (o.value as Q).eq(m.value as Q)) === i),
      solution: walked(
        [
          [
            ["Check the ratio", "检查比值"],
            t(
              `$|r| = ${r.abs().toLatex()} < 1$, so the distance to the fixed point shrinks at each step and the sequence tends to it, whatever $a_0$ is.`,
              `$|r| = ${r.abs().toLatex()} < 1$，所以到不动点的距离每一步都在缩小，无论 $a_0$ 是多少，数列都趋于不动点。`,
            ),
          ],
          [
            ["Solve for the fixed point", "求不动点"],
            t(
              `$L = ${r.toLatex()}L ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ gives $${gap.toLatex()}L = ${c}$, so $L = ${answer.toLatex()}$.`,
              `由 $L = ${r.toLatex()}L ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ 得 $${gap.toLatex()}L = ${c}$，所以 $L = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `One step of the rule from $L$ stays at $L$: $${r.toLatex()} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${r.mul(answer).add(Q.of(c)).toLatex()}$.`,
          `从 $L$ 出发用一次递推仍得 $L$：$${r.toLatex()} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${r.mul(answer).add(Q.of(c)).toLatex()}$。`,
        ),
      ),
    });
  },
};

const recurrenceFromRoots: KnowledgePointDef = {
  id: "a-recurrence-from-its-solutions",
  title: t("A recurrence from its solutions", "由解求递推关系"),
  explanation: t(
    "The solutions $Ar^n + Bs^n$ tell you the characteristic roots, so the recurrence can be rebuilt from them. The characteristic equation of $a_{n+2} = pa_{n+1} + qa_n$ is $x^2 - px - q = 0$. Comparing it with $(x - r)(x - s) = 0$ gives $p$ as the sum of the roots and $q$ as minus their product. For the solutions $A \\cdot 7^n + B(-1)^n$, $(x - 7)(x + 1) = x^2 - 6x - 7$, so $p = 6$ and $q = 7$.\n\n> **Watch out.** Match against $x^2 - px - q$, which carries minus signs: $p$ is the sum of the roots, not minus it, and $q$ is minus their product.",
    "解 $Ar^n + Bs^n$ 给出了特征根，所以可以由它们还原递推关系。$a_{n+2} = pa_{n+1} + qa_n$ 的特征方程是 $x^2 - px - q = 0$。与 $(x - r)(x - s) = 0$ 比较，得 $p$ 是两根之和，$q$ 是两根之积的相反数。对解 $A \\cdot 7^n + B(-1)^n$，$(x - 7)(x + 1) = x^2 - 6x - 7$，所以 $p = 6$，$q = 7$。\n\n> **注意。** 要与带负号的 $x^2 - px - q$ 比较：$p$ 是两根之和，不是它的相反数；$q$ 是两根之积的相反数。",
  ),
  generate(rng) {
    const pool = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6];
    const r = rng.pick(pool);
    const s = rng.pick(pool.filter((v) => v !== r));
    const asksP = rng.pick([true, false]);
    const name = asksP ? "p" : "q";
    const answer = asksP ? r + s : -r * s;
    return numberProblem({
      prompt: t(
        `Every sequence $a_n = A \\cdot ${inParens(r)}^n + B \\cdot ${inParens(s)}^n$ satisfies $a_{n+2} = pa_{n+1} + qa_n$. Find $${name}$.`,
        `每个数列 $a_n = A \\cdot ${inParens(r)}^n + B \\cdot ${inParens(s)}^n$ 都满足 $a_{n+2} = pa_{n+1} + qa_n$。求 $${name}$。`,
      ),
      answer,
      solveFor: name,
      mistakes: (asksP
        ? [
            why(
              -(r + s),
              "The sign is off: the $x$ term of $x^2 - px - q$ is $-px$, so $p$ is the sum of the roots.",
              "符号错了：$x^2 - px - q$ 的 $x$ 项是 $-px$，所以 $p$ 是两根之和。",
            ),
            why(r * s, "That is the product of the roots; $p$ is their sum.", "那是两根之积；$p$ 是两根之和。"),
            why(-r * s, "That is $q$, the other coefficient.", "那是另一个系数 $q$。"),
          ]
        : [
            why(
              r * s,
              "The sign is off: the constant term of $x^2 - px - q$ is $-q$, so $q$ is minus the product.",
              "符号错了：$x^2 - px - q$ 的常数项是 $-q$，所以 $q$ 是两根之积的相反数。",
            ),
            why(r + s, "That is $p$, the sum of the roots.", "那是两根之和 $p$。"),
            why(-(r + s), "That is minus the sum of the roots; $q$ comes from their product.", "那是两根之和的相反数；$q$ 来自两根之积。"),
          ]
      ).filter((m, i, all) => all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Write the characteristic equation", "写出特征方程"],
            t(
              `The roots $${r}$ and $${s}$ give $(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})(x ${s < 0 ? "+" : "-"} ${Math.abs(s)}) = ${poly([1, "x^2"], [-(r + s), "x"], [r * s, ""])} = 0$.`,
              `根 $${r}$ 和 $${s}$ 给出 $(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})(x ${s < 0 ? "+" : "-"} ${Math.abs(s)}) = ${poly([1, "x^2"], [-(r + s), "x"], [r * s, ""])} = 0$。`,
            ),
          ],
          [
            ["Compare with $x^2 - px - q = 0$", "与 $x^2 - px - q = 0$ 比较"],
            t(
              `$-p = ${-(r + s)}$ and $-q = ${r * s}$, so $p = ${r + s}$ and $q = ${-r * s}$.`,
              `$-p = ${-(r + s)}$，$-q = ${r * s}$，所以 $p = ${r + s}$，$q = ${-r * s}$。`,
            ),
          ],
        ],
        t(
          `The sequence $${inParens(r)}^n$ must satisfy the recurrence, so $${inParens(r)}^2 = pr + q$: $${r + s === 0 ? `${-r * s}` : `${(r + s) * r} ${-r * s < 0 ? "-" : "+"} ${Math.abs(r * s)}`} = ${r * r}$.`,
          `数列 $${inParens(r)}^n$ 必须满足递推，所以 $${inParens(r)}^2 = pr + q$：$${r + s === 0 ? `${-r * s}` : `${(r + s) * r} ${-r * s < 0 ? "-" : "+"} ${Math.abs(r * s)}`} = ${r * r}$。`,
        ),
      ),
    });
  },
};

const parameterForRepeatedRoot: KnowledgePointDef = {
  id: "the-coefficient-that-makes-a-root-repeated",
  title: t("The coefficient that makes a root repeated", "使特征根重复的系数"),
  explanation: t(
    "The form of the solution of a second-order recurrence depends on the discriminant of its characteristic equation. Positive gives two real roots, negative gives complex roots, and zero gives a repeated root, where the solution changes to $(A + Bn)r^n$. Setting the discriminant to zero finds the coefficient at this boundary between the other two cases. For $a_{n+2} = 20a_{n+1} + ka_n$, the equation $x^2 - 20x - k = 0$ has discriminant $400 + 4k$, which is zero at $k = -100$; then $x^2 - 20x + 100 = (x - 10)^2$.\n\n> **Watch out.** The constant term of $x^2 - px - k$ is $-k$, so the discriminant is $p^2 + 4k$, not $p^2 - 4k$. That makes $k = -\\frac{p^2}{4}$ negative, and the repeated root is $\\frac{p}{2}$.",
    "二阶递推的解的形式取决于特征方程的判别式。为正时有两个实根，为负时有复根，为零时有重根，此时解变为 $(A + Bn)r^n$。令判别式为零，就求出了处于另外两种情形分界处的系数。对 $a_{n+2} = 20a_{n+1} + ka_n$，方程 $x^2 - 20x - k = 0$ 的判别式是 $400 + 4k$，在 $k = -100$ 时为零；此时 $x^2 - 20x + 100 = (x - 10)^2$。\n\n> **注意。** $x^2 - px - k$ 的常数项是 $-k$，所以判别式是 $p^2 + 4k$，不是 $p^2 - 4k$。因此 $k = -\\frac{p^2}{4}$ 是负数，重根是 $\\frac{p}{2}$。",
  ),
  generate(rng) {
    const p = rng.pick(range(-15, 15).filter((v) => v !== 0));
    const answer = Q.of(-p * p, 4);
    const root = Q.of(p, 2);
    return numberProblem({
      prompt: t(
        `For which $k$ does the recurrence $a_{n+2} = ${poly([p, "a_{n+1}"])} + ka_n$ have a repeated characteristic root?`,
        `$k$ 取何值时，递推 $a_{n+2} = ${poly([p, "a_{n+1}"])} + ka_n$ 有重特征根？`,
      ),
      answer,
      solveFor: "k",
      mistakes: [
        why(
          Q.of(p * p, 4),
          "The sign is off: the constant term is $-k$, so the discriminant is $p^2 + 4k$.",
          "符号错了：常数项是 $-k$，所以判别式是 $p^2 + 4k$。",
        ),
        why(
          Q.of(-p * p, 2),
          "That divides by $2$; the discriminant $p^2 + 4k$ is zero when $k = -\\frac{p^2}{4}$.",
          "那是除以了 $2$；判别式 $p^2 + 4k$ 在 $k = -\\frac{p^2}{4}$ 时为零。",
        ),
        why(Q.of(-p, 2), "That is minus half of $p$; square $p$ in the discriminant.", "那是 $p$ 的一半的相反数；判别式中 $p$ 要平方。"),
        why(root, "That is the repeated root $\\frac{p}{2}$, not the coefficient $k$.", "那是重根 $\\frac{p}{2}$，不是系数 $k$。"),
      ].filter((m, i, all) => all.findIndex((o) => (o.value as Q).eq(m.value as Q)) === i),
      solution: walked(
        [
          [
            ["Write the characteristic equation", "写出特征方程"],
            t(
              `Trying $a_n = x^n$ gives $${poly([1, "x^2"], [-p, "x"])} - k = 0$.`,
              `设 $a_n = x^n$，得 $${poly([1, "x^2"], [-p, "x"])} - k = 0$。`,
            ),
          ],
          [
            ["Set the discriminant to zero", "令判别式为零"],
            t(
              `$${inParens(p)}^2 + 4k = ${p * p} + 4k = 0$, so $k = ${answer.toLatex()}$.`,
              `$${inParens(p)}^2 + 4k = ${p * p} + 4k = 0$，所以 $k = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `With $k = ${answer.toLatex()}$ the equation is $${poly([1, "x^2"], [-p, "x"])} + ${answer.neg().toLatex()} = \\left(x ${p < 0 ? "+" : "-"} ${root.abs().toLatex()}\\right)^2 = 0$, with the repeated root $${root.toLatex()}$.`,
          `当 $k = ${answer.toLatex()}$ 时，方程为 $${poly([1, "x^2"], [-p, "x"])} + ${answer.neg().toLatex()} = \\left(x ${p < 0 ? "+" : "-"} ${root.abs().toLatex()}\\right)^2 = 0$，重根为 $${root.toLatex()}$。`,
        ),
      ),
    });
  },
};

const periodicRecurrence: KnowledgePointDef = {
  id: "far-terms-of-a-periodic-recurrence",
  figure: discreteDrawings1["second-order-homogeneous-recurrence-relations-with-complex-roots#far-terms-of-a-periodic-recurrence"],
  title: t("Far terms of a periodic recurrence", "周期递推的远项"),
  explanation: t(
    "When the characteristic roots are complex with modulus one, the powers of the roots just turn around the unit circle. If the angle is a simple fraction of a full turn, the sequence repeats exactly. So a term with a large index can be found by writing out one period and reducing the index by the length of the period. For $a_{n+2} = a_{n+1} - a_n$ with $a_0 = 10$ and $a_1 = 12$, the terms run $10, 12, 2, -10, -12, -2$ and then repeat, so the period is $6$. Since $100 = 6 \\cdot 16 + 4$, $a_{100} = a_4 = -12$.\n\n> **Watch out.** Count from $a_0$: a remainder of $4$ means $a_4$, the fifth term listed, not the fourth. The period ends only when two consecutive terms are again $a_0$ and $a_1$.",
    "特征根是模为一的复数时，根的幂只是在单位圆上旋转。如果角度是整圈的简单分数，数列就严格重复。所以求下标很大的项时，只要写出一个周期，再按周期长度化简下标。对 $a_{n+2} = a_{n+1} - a_n$，$a_0 = 10$，$a_1 = 12$，各项依次是 $10, 12, 2, -10, -12, -2$，然后重复，所以周期是 $6$。因为 $100 = 6 \\cdot 16 + 4$，所以 $a_{100} = a_4 = -12$。\n\n> **注意。** 从 $a_0$ 数起：余数为 $4$ 指的是 $a_4$，即列出的第五项，不是第四项。只有连续两项又是 $a_0$ 和 $a_1$ 时，一个周期才结束。",
  ),
  generate(rng) {
    const p = rng.pick([0, 1, -1]);
    const period = p === 0 ? 4 : p === 1 ? 6 : 3;
    const pool = range(-9, 9).filter((v) => v !== 0);
    const a0 = rng.pick(pool);
    const a1 = rng.pick(pool.filter((v) => v !== a0));
    const terms = [a0, a1];
    for (let i = 2; i < period; i++) terms.push(p * (terms[i - 1] as number) - (terms[i - 2] as number));
    const rem = rng.int(2, period - 1);
    const N = period * rng.int(5, 40) + rem;
    const answer = terms[rem] as number;
    const last = terms[period - 1] as number;
    const sum = (x: number, y: number) => (x === 0 ? `${y}` : y === 0 ? `${x}` : `${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}`);
    const equals = (lhs: string, e: string, v: number) => (e === `${v}` ? `$${lhs} = ${v}$` : `$${lhs} = ${e} = ${v}$`);
    const again = equals(`a_{${period}}`, sum(p * last, -(terms[period - 2] as number)), a0);
    const again1 = equals(`a_{${period + 1}}`, sum(p * a0, -last), a1);
    return numberProblem({
      prompt: t(
        `A sequence has $a_0 = ${a0}$, $a_1 = ${a1}$ and $a_{n+2} = ${poly([p, "a_{n+1}"], [-1, "a_n"])}$. Find $a_{${N}}$.`,
        `数列满足 $a_0 = ${a0}$，$a_1 = ${a1}$，$a_{n+2} = ${poly([p, "a_{n+1}"], [-1, "a_n"])}$。求 $a_{${N}}$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          terms[rem - 1] as number,
          `That is $a_{${rem - 1}}$, one place early: count the terms from $a_0$.`,
          `那是 $a_{${rem - 1}}$，早了一位：要从 $a_0$ 数起。`,
        ),
        why(a0, `That is $a_0$; $${N}$ leaves remainder $${rem}$, not $0$.`, `那是 $a_0$；$${N}$ 的余数是 $${rem}$，不是 $0$。`),
        why(a1, `That is $a_1$; $${N}$ leaves remainder $${rem}$, not $1$.`, `那是 $a_1$；$${N}$ 的余数是 $${rem}$，不是 $1$。`),
        why(-answer, "The sign is off; read the term straight from the listed period.", "符号错了；直接从列出的周期中读出这一项。"),
        why(a0 + a1, "That adds the two initial terms; apply the rule as given.", "那是把两个初始项相加；要按给定的规则计算。"),
      ].filter((m, i, all) => all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["List one period", "列出一个周期"],
            t(
              `$${terms.map((v, i) => `a_{${i}} = ${v}`).join(", ")}$, and the next two terms are again $${a0}$ and $${a1}$, so the period is $${period}$.`,
              `${terms.map((v, i) => `$a_{${i}} = ${v}$`).join("，")}，接下来两项又是 $${a0}$ 和 $${a1}$，所以周期是 $${period}$。`,
            ),
          ],
          [
            ["Reduce the index", "化简下标"],
            t(
              `$${N} = ${period} \\cdot ${(N - rem) / period} + ${rem}$, so $a_{${N}} = a_{${rem}} = ${answer}$.`,
              `$${N} = ${period} \\cdot ${(N - rem) / period} + ${rem}$，所以 $a_{${N}} = a_{${rem}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The rule after the last listed term gives ${again} and ${again1}, so the terms do repeat.`,
          `由递推，最后一项之后是 ${again}，${again1}，所以各项确实重复。`,
        ),
      ),
    });
  },
};

const productOfFiniteSums: KnowledgePointDef = {
  id: "coefficients-of-a-product-of-finite-sums",
  title: t("Coefficients of a product of finite sums", "有限和之积的系数"),
  explanation: t(
    "A generating function turns counting into multiplication. In a product of two finite sums, each way of making the power $x^m$ picks one exponent from each factor, with the exponents adding to $m$. So the coefficient counts the pairs of allowed exponents with that sum, which is how limits on choices enter a counting problem. In $(1 + x + \\dots + x^{10})(1 + x + \\dots + x^{12})$, the coefficient of $x^{15}$ counts $i + j = 15$ with $i \\le 10$ and $j \\le 12$: $i$ runs from $3$ to $10$, which gives $8$ pairs.\n\n> **Watch out.** Both limits cut the range: $i \\le a$, and $j = m - i \\le b$ forces $i \\ge m - b$. Counting the whole numbers from the lowest to the highest gives one more than their difference.",
    "生成函数把计数变成乘法。在两个有限和的乘积中，得到幂 $x^m$ 的每种方式都是从每个因子选一个指数，使指数之和为 $m$。所以系数就是和为该值的可选指数对的个数，选择上的限制正是这样进入计数问题的。在 $(1 + x + \\dots + x^{10})(1 + x + \\dots + x^{12})$ 中，$x^{15}$ 的系数数的是满足 $i + j = 15$、$i \\le 10$、$j \\le 12$ 的数对：$i$ 从 $3$ 取到 $10$，共 $8$ 对。\n\n> **注意。** 两个上限都会截断范围：$i \\le a$，而 $j = m - i \\le b$ 迫使 $i \\ge m - b$。从最小值数到最大值，个数比两者之差多一。",
  ),
  generate(rng) {
    const a = rng.int(3, 8);
    const b = rng.int(3, 8);
    const m = rng.int(2, a + b - 1);
    const low = Math.max(0, m - b);
    const high = Math.min(a, m);
    const answer = high - low + 1;
    const sum = (top: number) => `(1 + x + \\dots + x^{${top}})`;
    return numberProblem({
      prompt: t(`Find the coefficient of $x^{${m}}$ in $${sum(a)}${sum(b)}$.`, `求 $${sum(a)}${sum(b)}$ 中 $x^{${m}}$ 的系数。`),
      answer,
      form: "integer",
      mistakes: [
        why(
          m + 1,
          `That counts every split of $${m}$ with no upper limits; the exponents cannot pass $${a}$ and $${b}$.`,
          `那是不加上限地数了 $${m}$ 的所有拆分；指数不能超过 $${a}$ 和 $${b}$。`,
        ),
        why(
          Math.min(a, b) + 1,
          "That counts the terms of the shorter factor; the count also depends on the power.",
          "那是数了较短因子的项数；个数还与幂次有关。",
        ),
        why(high - low, "That is the difference of the end values; counting both ends adds one.", "那是两端值之差；两端都算上要再加一。"),
      ].filter((m, i, all) => all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Set up the count", "列出计数条件"],
            t(
              `Each $x^{${m}}$ comes from $x^i \\cdot x^j$ with $i + j = ${m}$, $0 \\le i \\le ${a}$ and $0 \\le j \\le ${b}$.`,
              `每个 $x^{${m}}$ 都来自 $x^i \\cdot x^j$，其中 $i + j = ${m}$，$0 \\le i \\le ${a}$，$0 \\le j \\le ${b}$。`,
            ),
          ],
          [
            ["Find the range of $i$", "求 $i$ 的范围"],
            t(
              `${m > b ? `$j = ${m} - i \\le ${b}$ gives $i \\ge ${m - b}$` : `$j = ${m} - i \\le ${b}$ holds for every $i \\ge 0$`}, and $j \\ge 0$ gives $i \\le ${m}$. So $i$ runs from $${low}$ to $${high}$, which is $${low === 0 ? `${high} + 1` : `${high} - ${low} + 1`} = ${answer}$ values.`,
              `${m > b ? `由 $j = ${m} - i \\le ${b}$ 得 $i \\ge ${m - b}$` : `$j = ${m} - i \\le ${b}$ 对所有 $i \\ge 0$ 成立`}，由 $j \\ge 0$ 得 $i \\le ${m}$。所以 $i$ 从 $${low}$ 取到 $${high}$，共 $${low === 0 ? `${high} + 1` : `${high} - ${low} + 1`} = ${answer}$ 个值。`,
            ),
          ],
        ],
        t(
          `The extreme pairs are $(${low}, ${m - low})$ and $(${high}, ${m - high})$, and both stay within the limits $${a}$ and $${b}$.`,
          `两端的数对是 $(${low}, ${m - low})$ 和 $(${high}, ${m - high})$，都在上限 $${a}$ 和 $${b}$ 之内。`,
        ),
      ),
    });
  },
};

const seriesFromGeneratingFunction: KnowledgePointDef = {
  id: "summing-a-recursive-series-with-its-generating-function",
  title: t("Summing a recursive series with its generating function", "用生成函数求递推级数的和"),
  explanation: t(
    "The generating function $G(x) = \\sum a_nx^n$ of a recurrence is a rational function. Evaluating it at a point inside its radius of convergence gives the sum of an infinite series. So a sum like $\\sum \\frac{a_n}{k^n}$ needs no formula for the terms at all: just put $x = \\frac{1}{k}$ into the rational function. For $a_0 = 1$, $a_1 = 5$ and $a_{n+2} = a_{n+1} + 6a_n$, $G(x) = \\frac{1 + 4x}{1 - x - 6x^2}$, so $\\sum \\frac{a_n}{10^n} = G\\left(\\frac{1}{10}\\right) = \\frac{100 + 40}{100 - 10 - 6} = \\frac{5}{3}$.\n\n> **Watch out.** The numerator is $a_0 + (a_1 - pa_0)x$, not $a_0 + a_1x$, and the denominator is $1 - px - qx^2$, with both signs minus. Multiply top and bottom by $k^2$ to clear the fractions.",
    "递推的生成函数 $G(x) = \\sum a_nx^n$ 是有理函数。在收敛半径内的一点取值，就得到一个无穷级数的和。所以像 $\\sum \\frac{a_n}{k^n}$ 这样的和完全不需要通项公式：只要把 $x = \\frac{1}{k}$ 代入这个有理函数。对 $a_0 = 1$，$a_1 = 5$，$a_{n+2} = a_{n+1} + 6a_n$，$G(x) = \\frac{1 + 4x}{1 - x - 6x^2}$，所以 $\\sum \\frac{a_n}{10^n} = G\\left(\\frac{1}{10}\\right) = \\frac{100 + 40}{100 - 10 - 6} = \\frac{5}{3}$。\n\n> **注意。** 分子是 $a_0 + (a_1 - pa_0)x$，不是 $a_0 + a_1x$；分母是 $1 - px - qx^2$，两个符号都是负号。分子分母同乘 $k^2$ 来消去分数。",
  ),
  generate(rng) {
    const p = rng.int(1, 3);
    const q = rng.int(1, 3);
    const a0 = rng.int(0, 3);
    const a1 = rng.int(1, 4);
    const k = p + q + rng.int(1, 4);
    const lin = a1 - p * a0;
    const top = a0 * k * k + lin * k;
    const bottom = k * k - p * k - q;
    const answer = Q.of(top, bottom);
    const raw = `\\frac{${top}}{${bottom}}`;
    const value = raw === answer.toLatex() ? raw : `${raw} = ${answer.toLatex()}`;
    const numerator = poly([a0, ""], [lin, "x"]);
    const denominator = poly([1, ""], [-p, "x"], [-q, "x^2"]);
    return numberProblem({
      prompt: t(
        `A sequence has $a_0 = ${a0}$, $a_1 = ${a1}$ and $a_{n+2} = ${poly([p, "a_{n+1}"], [q, "a_n"])}$. Find $\\sum_{n=0}^{\\infty} \\frac{a_n}{${k}^n}$.`,
        `数列满足 $a_0 = ${a0}$，$a_1 = ${a1}$，$a_{n+2} = ${poly([p, "a_{n+1}"], [q, "a_n"])}$。求 $\\sum_{n=0}^{\\infty} \\frac{a_n}{${k}^n}$。`,
      ),
      answer,
      mistakes: [
        why(
          Q.of(top, k * k + p * k + q),
          "The signs in the denominator are off: it is $1 - px - qx^2$.",
          "分母的符号错了：应是 $1 - px - qx^2$。",
        ),
        why(
          Q.of(a0 * k * k + a1 * k, bottom),
          "That uses $a_0 + a_1x$ as the numerator; its $x$ coefficient is $a_1 - pa_0$.",
          "那是把 $a_0 + a_1x$ 当作分子；它的 $x$ 系数是 $a_1 - pa_0$。",
        ),
        why(Q.of(a0 * k + a1, k), "That adds only the first two terms of the series.", "那是只加了级数的前两项。"),
        why(
          Q.of(top, k * k - p * k + q),
          "The sign of the $qx^2$ term is off: the denominator is $1 - px - qx^2$.",
          "$qx^2$ 项的符号错了：分母是 $1 - px - qx^2$。",
        ),
      ].filter((m, i, all) => all.findIndex((o) => (o.value as Q).eq(m.value as Q)) === i),
      solution: walked(
        [
          [
            ["Find the generating function", "求生成函数"],
            t(
              `Multiplying by $x^{n+2}$ and summing gives $G(x)(${denominator}) = a_0 + (a_1 - pa_0)x$, so $G(x) = \\frac{${numerator}}{${denominator}}$.`,
              `乘以 $x^{n+2}$ 再求和，得 $G(x)(${denominator}) = a_0 + (a_1 - pa_0)x$，所以 $G(x) = \\frac{${numerator}}{${denominator}}$。`,
            ),
          ],
          [
            [`Put $x = \\frac{1}{${k}}$`, `代入 $x = \\frac{1}{${k}}$`],
            t(
              `Multiplying top and bottom by $${k * k}$: $G\\left(\\frac{1}{${k}}\\right) = ${value}$.`,
              `分子分母同乘 $${k * k}$：$G\\left(\\frac{1}{${k}}\\right) = ${value}$。`,
            ),
          ],
        ],
        t(
          `Multiplying back by the denominator at $x = \\frac{1}{${k}}$, which is $${Q.of(bottom, k * k).toLatex()}$, gives $${answer.mul(Q.of(bottom, k * k)).toLatex()}$, and the numerator there is $${Q.of(a0).add(Q.of(lin, k)).toLatex()}$, the same.`,
          `乘回分母在 $x = \\frac{1}{${k}}$ 处的值 $${Q.of(bottom, k * k).toLatex()}$，得 $${answer.mul(Q.of(bottom, k * k)).toLatex()}$；而分子在该处的值是 $${Q.of(a0).add(Q.of(lin, k)).toLatex()}$，两者相同。`,
        ),
      ),
    });
  },
};

const facesOfARegularPlanarGraph: KnowledgePointDef = {
  id: "faces-of-a-regular-planar-graph",
  figure: discreteDrawings1["planar-graphs#faces-of-a-regular-planar-graph"],
  title: t("Faces of a regular planar graph", "正则平面图的面数"),
  explanation: t(
    "Euler's formula $V - E + F = 2$ needs the number of edges, and for a regular graph the handshaking lemma supplies it: the degrees add up to twice the edges. Combining the two facts gives the number of faces from the number of vertices and the common degree alone, without ever drawing the graph. The drawing shows a $3$-regular planar graph on $8$ vertices: $E = \\frac{8 \\cdot 3}{2} = 12$ and $F = 2 - 8 + 12 = 6$, the inner square, four quadrilaterals around it and the outer face. A connected planar graph with $50$ vertices, each of degree $4$, has $E = \\frac{4 \\cdot 50}{2} = 100$ edges, so $F = 2 - 50 + 100 = 52$ faces.\n\n> **Watch out.** Halve the degree sum before using it as $E$, and count the outer face: Euler's formula includes it.",
    "欧拉公式 $V - E + F = 2$ 需要边数，而对正则图，握手引理正好给出它：度数之和等于边数的两倍。把这两个事实结合起来，只由顶点数和公共的度数就能得到面数，完全不必画出这个图。图中是 $8$ 个顶点的 $3$-正则平面图：$E = \\frac{8 \\cdot 3}{2} = 12$，$F = 2 - 8 + 12 = 6$，即内部的正方形、它周围的四个四边形和外部面。一个连通平面图有 $50$ 个顶点，每个顶点的度都是 $4$，则 $E = \\frac{4 \\cdot 50}{2} = 100$，所以 $F = 2 - 50 + 100 = 52$。\n\n> **注意。** 度数之和要先减半才是 $E$；外部面也要算上：欧拉公式包括它。",
  ),
  generate(rng) {
    const [k, V] = rng.pick([...range(2, 20).map((i) => [3, 2 * i] as const), ...range(3, 20).map((i) => [4, 2 * i] as const)]);
    const E = (k * V) / 2;
    const answer = 2 - V + E;
    return numberProblem({
      prompt: t(
        `A connected planar graph has ${V} vertices, each of degree ${k}. How many faces does a plane drawing of it have?`,
        `一个连通平面图有 ${V} 个顶点，每个顶点的度都是 ${k}。它的平面画法有多少个面？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(E, "That is the number of edges; Euler's formula still has to turn it into faces.", "那是边数；还要用欧拉公式把它化为面数。"),
        why(answer - 2, "That leaves out the $2$ in Euler's formula.", "那是漏掉了欧拉公式中的 $2$。"),
        why(answer - 1, "That leaves out the outer face, which counts as a face.", "那是漏掉了外部面，它也算一个面。"),
        why(2 - V + k * V, "That uses the degree sum as the number of edges; halve it first.", "那是把度数之和当作边数；要先减半。"),
      ].filter((m, i, all) => all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count the edges", "求边数"],
            t(
              `The handshaking lemma gives $E = \\frac{${k} \\cdot ${V}}{2} = ${E}$.`,
              `由握手引理得 $E = \\frac{${k} \\cdot ${V}}{2} = ${E}$。`,
            ),
          ],
          [["Apply Euler's formula", "用欧拉公式"], t(`$F = 2 - ${V} + ${E} = ${answer}$.`, `$F = 2 - ${V} + ${E} = ${answer}$。`)],
        ],
        t(`$${V} - ${E} + ${answer} = 2$, as Euler's formula requires.`, `$${V} - ${E} + ${answer} = 2$，符合欧拉公式。`),
      ),
    });
  },
};

const mostBipartiteEdges: KnowledgePointDef = {
  id: "the-most-edges-of-a-bipartite-graph",
  figure: discreteDrawings1["complete-and-bipartite-graphs#the-most-edges-of-a-bipartite-graph"],
  title: t("The most edges of a bipartite graph", "二部图的最多边数"),
  explanation: t(
    "A bipartite graph with parts of sizes $a$ and $b$ has at most $ab$ edges, reached by the complete bipartite graph. For a fixed total $a + b = n$, the product is largest when the parts are as equal as possible. So a graph on $n$ vertices with no odd cycle has at most $\\lfloor \\frac{n^2}{4} \\rfloor$ edges. In the drawing, on $6$ vertices, parts of $3$ and $3$ allow $3 \\cdot 3 = 9$ edges while parts of $2$ and $4$ allow only $2 \\cdot 4 = 8$. On $51$ vertices the best split is $25$ and $26$, giving $25 \\cdot 26 = 650$ edges.\n\n> **Watch out.** Edges inside a part are not allowed, so the count is not $\\binom{n}{2}$; and when $n$ is odd the parts differ by one, so the answer is not $\\left(\\frac{n}{2}\\right)^2$.",
    "两部分大小为 $a$ 和 $b$ 的二部图最多有 $ab$ 条边，完全二部图达到这个值。总数 $a + b = n$ 固定时，两部分越接近相等，乘积越大。所以 $n$ 个顶点且没有奇圈的图最多有 $\\lfloor \\frac{n^2}{4} \\rfloor$ 条边。图中是 $6$ 个顶点的情形：分成 $3$ 和 $3$ 可有 $3 \\cdot 3 = 9$ 条边，分成 $2$ 和 $4$ 只有 $2 \\cdot 4 = 8$ 条。$51$ 个顶点时最好的分法是 $25$ 和 $26$，共 $25 \\cdot 26 = 650$ 条边。\n\n> **注意。** 同一部分内部不能连边，所以答案不是 $\\binom{n}{2}$；$n$ 为奇数时两部分相差一，所以答案也不是 $\\left(\\frac{n}{2}\\right)^2$。",
  ),
  generate(rng) {
    const n = rng.int(5, 44);
    const a = Math.floor(n / 2);
    const b = n - a;
    const answer = a * b;
    const moved = (a - 1) * (b + 1);
    const movedTex = a - 1 === 1 ? `${moved}` : `${a - 1} \\cdot ${b + 1} = ${moved}`;
    return numberProblem({
      prompt: t(
        `What is the largest possible number of edges of a bipartite graph with ${n} vertices?`,
        `${n} 个顶点的二部图最多有多少条边？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          (n * (n - 1)) / 2,
          "That counts every pair of vertices; no edge may join two vertices of the same part.",
          "那是数了所有顶点对；同一部分的两个顶点之间不能连边。",
        ),
        why(
          n - 1,
          "That is far too few; every vertex of one part can be joined to every vertex of the other.",
          "太少了；一部分的每个顶点都可以与另一部分的每个顶点相连。",
        ),
        why(
          a * a,
          `That uses two parts of size $${a}$; the parts must add up to $${n}$.`,
          `那是用了两个大小为 $${a}$ 的部分；两部分之和必须是 $${n}$。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Choose the part sizes", "选部分的大小"],
            t(
              `With parts of sizes $x$ and $${n} - x$ there are at most $x(${n} - x)$ edges, largest for the most equal split, $${a}$ and $${b}$.`,
              `两部分大小为 $x$ 和 $${n} - x$ 时至多有 $x(${n} - x)$ 条边，分得最均匀时最大，即 $${a}$ 和 $${b}$。`,
            ),
          ],
          [
            ["Join every pair across", "连接所有跨部分的顶点对"],
            t(
              `All edges between the parts are allowed: $${a} \\cdot ${b} = ${answer}$.`,
              `两部分之间的边都可以连：$${a} \\cdot ${b} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$\\lfloor \\frac{${n}^2}{4} \\rfloor = \\lfloor \\frac{${n * n}}{4} \\rfloor = ${answer}$, and moving one vertex across gives only $${movedTex}$ edges.`,
          `$\\lfloor \\frac{${n}^2}{4} \\rfloor = \\lfloor \\frac{${n * n}}{4} \\rfloor = ${answer}$，而把一个顶点移到另一部分只得到 $${movedTex}$ 条边。`,
        ),
      ),
    });
  },
};

const treesWithAGivenVertexDegree: KnowledgePointDef = {
  id: "labeled-trees-where-one-vertex-has-a-given-degree",
  title: t("Labeled trees where one vertex has a given degree", "某顶点度数给定的标号树"),
  explanation: t(
    "A labeled tree on $n$ vertices corresponds to a Prüfer word of length $n - 2$, and a vertex appears in the word one time fewer than its degree. So fixing the degree of one vertex fixes how often its label occurs. Choose the positions for this label, and fill the remaining positions freely with the other labels. On the vertices $1, \\dots, 12$, vertex $1$ has degree $4$ when it fills $3$ of the $10$ places, in $\\binom{10}{3} = 120$ ways, and the other $7$ places take any of $11$ labels: $120 \\cdot 11^7 = 2338460520$ trees.\n\n> **Watch out.** The label appears $d - 1$ times, not $d$ times, and the remaining places may not use label $1$ again, so they have $n - 1$ choices each, not $n$.",
    "$n$ 个顶点的标号树对应长度为 $n - 2$ 的普吕弗序列，一个顶点在序列中出现的次数比它的度少一。所以确定一个顶点的度，就确定了它的标号出现的次数。选出这个标号的位置，其余位置用其他标号任意填写。在顶点 $1, \\dots, 12$ 上，顶点 $1$ 的度为 $4$ 时，它占据 $10$ 个位置中的 $3$ 个，有 $\\binom{10}{3} = 120$ 种方式，其余 $7$ 个位置各取 $11$ 个标号之一：共 $120 \\cdot 11^7 = 2338460520$ 棵树。\n\n> **注意。** 这个标号出现 $d - 1$ 次，而不是 $d$ 次；其余位置不能再用标号 $1$，所以每个位置有 $n - 1$ 种选择，而不是 $n$ 种。",
  ),
  generate(rng) {
    const [n, d] = rng.pick(range(4, 9).flatMap((n) => range(1, n - 1).map((d) => [n, d] as const)));
    const places = binom(n - 2, d - 1);
    const rest = n - 1 - d;
    const answer = places * (n - 1) ** rest;
    const fill = rest === 0 ? "" : ` \\cdot ${pow(n - 1, rest)}`;
    const count = t(
      rest === 0
        ? "No other positions remain."
        : `The other ${rest === 1 ? "position takes" : `${rest} positions take`} any of ${n - 1} labels.`,
      rest === 0 ? "没有其他位置了。" : `其余 ${rest} 个位置可以取 ${n - 1} 个标号中的任一个。`,
    );
    return numberProblem({
      prompt: t(
        `How many labeled trees on the vertices $1, \\dots, ${n}$ have vertex 1 of degree ${d}?`,
        `顶点为 $1, \\dots, ${n}$ 的标号树中，有多少棵的顶点 1 的度是 ${d}？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n ** (n - 2),
          "That counts every labeled tree, whatever the degree of vertex 1.",
          "那是数了所有标号树，不管顶点 1 的度是多少。",
        ),
        why(places, "That only places the label 1; the other positions still have to be filled.", "那只是放好了标号 1；其余位置还要填写。"),
        why(
          (n - 1) ** rest * d,
          "That multiplies by the degree; choose the positions of label 1 with a binomial coefficient instead.",
          "那是乘以了度数；应当用二项式系数选出标号 1 的位置。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Place the label 1", "放置标号 1"],
            t(
              `Vertex 1 appears ${d - 1} times in the Prüfer word of length ${n - 2}, in $\\binom{${n - 2}}{${d - 1}}$ ways.`,
              `顶点 1 在长度为 ${n - 2} 的普吕弗序列中出现 ${d - 1} 次，有 $\\binom{${n - 2}}{${d - 1}}$ 种方式。`,
            ),
          ],
          [
            ["Fill the other positions", "填其余位置"],
            t(
              `${count.en} The total is $\\binom{${n - 2}}{${d - 1}}${fill} = ${answer}$.`,
              `${count["zh-CN"]}总数是 $\\binom{${n - 2}}{${d - 1}}${fill} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The positions add up: $${d - 1} + ${rest} = ${n - 2}$, the length of the Prüfer word.`,
          `位置数相加：$${d - 1} + ${rest} = ${n - 2}$，正是普吕弗序列的长度。`,
        ),
      ),
    });
  },
};

const fourCycles: KnowledgePointDef = {
  id: "four-cycles-of-a-complete-bipartite-graph",
  figure: discreteDrawings1["cycles-in-graphs#four-cycles-of-a-complete-bipartite-graph"],
  title: t("Four-cycles of a complete bipartite graph", "完全二部图的四圈"),
  explanation: t(
    "A cycle in a bipartite graph alternates between the two parts, so its length is even and the shortest possible cycles have length four. A four-cycle uses two vertices from each part. In a complete bipartite graph, any such choice of vertices can be joined into exactly one four-cycle, so counting them reduces to choosing pairs. The drawing shows $K_{3,4}$, with $\\binom{3}{2}\\binom{4}{2} = 3 \\cdot 6 = 18$ four-cycles. $K_{10,12}$ has $\\binom{10}{2}\\binom{12}{2} = 45 \\cdot 66 = 2970$ four-cycles.\n\n> **Watch out.** The two choices of pairs combine by multiplying, not adding, and each choice gives one four-cycle, not two: its two directions trace the same cycle.",
    "二部图中的圈在两部分之间交替，所以长度是偶数，最短的圈长度为四。四圈从每一部分各用两个顶点。在完全二部图中，这样选出的顶点恰好能连成一个四圈，所以计数就化为选取顶点对。图中是 $K_{3,4}$，有 $\\binom{3}{2}\\binom{4}{2} = 3 \\cdot 6 = 18$ 个四圈。$K_{10,12}$ 有 $\\binom{10}{2}\\binom{12}{2} = 45 \\cdot 66 = 2970$ 个四圈。\n\n> **注意。** 两次选顶点对的方法数要相乘，而不是相加；每种选法只给出一个四圈，不是两个：两个方向走的是同一个圈。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const n = rng.int(2, 9);
    const left = binom(m, 2);
    const right = binom(n, 2);
    const answer = left * right;
    const product = left === 1 || right === 1 ? "" : ` = ${left} \\cdot ${right}`;
    const sides = [
      [m, n, m - 1, n - 1].filter((f) => f !== 1).join(" \\cdot "),
      `${m * n * (m - 1) * (n - 1)}`,
      answer === 1 ? "4" : `4 \\cdot ${answer}`,
    ];
    const sequences = sides.filter((s, i) => i === 0 || s !== sides[i - 1]).join(" = ");
    return numberProblem({
      prompt: t(
        `How many cycles of length 4 does the complete bipartite graph $K_{${m},${n}}$ have?`,
        `完全二部图 $K_{${m},${n}}$ 有多少个长度为 4 的圈？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(m * n, "That counts the edges of the graph, not its 4-cycles.", "那是数了图的边，不是 4 圈。"),
        why(
          left + right,
          "That adds the two choices of pairs; every pair on one side combines with every pair on the other, so multiply.",
          "那是把两次选顶点对的方法数相加；一侧的每一对与另一侧的每一对都能搭配，所以要相乘。",
        ),
        why(2 * answer, "That counts each 4-cycle twice, once for each direction around it.", "那是把每个 4 圈数了两次，每个方向各一次。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Describe a 4-cycle", "描述 4 圈"],
            t(
              "A 4-cycle alternates between the parts, so it uses two vertices of each part, and any such four vertices form exactly one 4-cycle.",
              "4 圈在两部分之间交替，所以每一部分各用两个顶点；任意这样的四个顶点恰好构成一个 4 圈。",
            ),
          ],
          [
            ["Choose the pairs", "选顶点对"],
            t(
              `That gives $\\binom{${m}}{2}\\binom{${n}}{2}${product} = ${answer}$ ${answer === 1 ? "cycle" : "cycles"}.`,
              `所以共有 $\\binom{${m}}{2}\\binom{${n}}{2}${product} = ${answer}$ 个圈。`,
            ),
          ],
        ],
        t(
          `Counting walks instead: ${m} choices of a start on the left, then ${n}, ${m - 1} and ${n - 1} choices for the next vertices, give $${sequences}$; each 4-cycle arises from $2$ starts on the left and $2$ directions.`,
          `换成数途径：左侧起点有 ${m} 种选择，接下来的顶点依次有 ${n}、${m - 1}、${n - 1} 种选择，得 $${sequences}$；每个 4 圈对应左侧的 $2$ 个起点和 $2$ 个方向。`,
        ),
      ),
    });
  },
};

const treeAfterANewEdge: KnowledgePointDef = {
  id: "updating-a-spanning-tree-after-a-new-edge",
  title: t("Updating a spanning tree after a new edge", "新增一条边后更新生成树"),
  explanation: t(
    "A new edge need not mean rerunning Kruskal's algorithm. Adding the edge to the minimum spanning tree creates exactly one cycle. By the cycle property, the heaviest edge on that cycle can be left out of a minimum spanning tree. So compare the new edge with the heaviest edge on the tree path between its ends, and keep the lighter. A minimum spanning tree of weight $400$ whose path from $u$ to $v$ has weights $30$, $45$ and $35$ gains a new edge $uv$ of weight $28$: it is lighter than $45$, so it replaces that edge, and the tree now weighs $400 - 45 + 28 = 383$.\n\n> **Watch out.** Compare the new edge only with the heaviest edge on the cycle it closes, not with the lightest one and not with the rest of the tree. And if the new edge is the heaviest on that cycle, the tree does not change at all.",
    "新增一条边不必重新运行克鲁斯卡尔算法。把这条边加入最小生成树，恰好产生一个圈。根据圈性质，圈上最重的边可以不在最小生成树中。所以把新边与其两端之间树路径上最重的边比较，保留较轻的那条。一棵权为 $400$ 的最小生成树中，$u$ 到 $v$ 的路径上边权为 $30$、$45$、$35$，新增一条权为 $28$ 的边 $uv$：它比 $45$ 轻，所以替换那条边，现在树的权为 $400 - 45 + 28 = 383$。\n\n> **注意。** 新边只与它所构成的圈上最重的边比较，不是与最轻的边比较，也不是与树的其余部分比较。如果新边是这个圈上最重的边，树就完全不变。",
  ),
  generate(rng) {
    const a = rng.int(2, 20);
    const b = rng.int(2, 20);
    const c = rng.int(2, 20);
    const top = Math.max(a, b, c);
    const W = a + b + c + rng.int(5, 40);
    const w = rng.pick(range(1, 25).filter((v) => v !== top));
    const answer = w < top ? W - top + w : W;
    return numberProblem({
      prompt: t(
        `A minimum spanning tree has total weight ${W}. A new edge of weight ${w} joins vertices $u$ and $v$, and the tree path between them has edges of weights ${a}, ${b} and ${c}. What is the weight of a minimum spanning tree now?`,
        `最小生成树的总权重是 ${W}。一条权重为 ${w} 的新边连接顶点 $u$ 和 $v$，树中它们之间的路径上的边权重为 ${a}、${b} 和 ${c}。现在最小生成树的权重是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          W + w,
          "That keeps every old edge and adds the new one, but then the tree has a cycle.",
          "那是保留所有旧边再加上新边，但这样树中就有圈了。",
        ),
        why(
          W - top,
          "That removes the heaviest path edge but forgets to add the new edge in its place.",
          "那是去掉了路径上最重的边，却忘了用新边代替它。",
        ),
        why(
          W - Math.min(a, b, c) + w,
          "That swaps out the lightest edge on the path; the heaviest edge on the cycle is the one to leave out.",
          "那是换掉了路径上最轻的边；应当舍去的是圈上最重的边。",
        ),
        why(
          W - top + w,
          "That swaps in the new edge even though it is heavier than every edge on the path, which makes the tree heavier.",
          "新边比路径上的每条边都重，却仍把它换进来，这会使树变重。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Find the cycle", "找出圈"],
            t(
              `The new edge and the tree path between $u$ and $v$ form a cycle with weights ${a}, ${b}, ${c} and ${w}.`,
              `新边与树中 $u$、$v$ 之间的路径构成一个圈，边权为 ${a}、${b}、${c} 和 ${w}。`,
            ),
          ],
          w < top
            ? [
                ["Leave out the heaviest edge", "舍去最重的边"],
                t(
                  `The heaviest edge on the cycle is the path edge of weight ${top}, so the new edge replaces it: $${W} - ${top} + ${w} = ${answer}$.`,
                  `圈上最重的边是路径上权为 ${top} 的边，所以新边替换它：$${W} - ${top} + ${w} = ${answer}$。`,
                ),
              ]
            : [
                ["Leave out the heaviest edge", "舍去最重的边"],
                t(
                  `The heaviest edge on the cycle is the new edge itself, since $${w} > ${top}$, so the tree stays as it is, with weight ${answer}.`,
                  `圈上最重的边就是新边本身，因为 $${w} > ${top}$，所以树不变，权重仍是 ${answer}。`,
                ),
              ],
        ],
        w < top
          ? t(
              `The tree became lighter by $${top} - ${w} = ${top - w}$, and $${W} - ${top - w} = ${answer}$.`,
              `树变轻了 $${top} - ${w} = ${top - w}$，而 $${W} - ${top - w} = ${answer}$。`,
            )
          : t(
              `Swapping the new edge in would give $${W} - ${top} + ${w} = ${W - top + w}$, more than ${W}, so keeping the old tree is right.`,
              `若把新边换进来，会得到 $${W} - ${top} + ${w} = ${W - top + w}$，比 ${W} 大，所以保留原来的树是对的。`,
            ),
      ),
    });
  },
};

const productAutomaton: KnowledgePointDef = {
  id: "the-states-of-a-product-automaton",
  title: t("The states of a product automaton", "乘积自动机的状态数"),
  explanation: t(
    "To check two conditions at once, a finite automaton runs one automaton for each condition side by side. A state of the combined machine is a pair of states, so the sizes multiply. When the two conditions track independent counts, every pair must be remembered separately, and no automaton with fewer states can do the job.\n\n> **Watch out.** The sizes multiply, they do not add: the machine must know both counts at once. Counting $0$s modulo $2$ and $1$s modulo $3$ needs $2 \\cdot 3 = 6$ states, not $2 + 3 = 5$.",
    "要同时检查两个条件，有限自动机让对应每个条件的自动机并行运行。组合机器的状态是一对状态，所以状态数相乘。当两个条件跟踪的是相互独立的计数时，每一对都必须分别记住，状态更少的自动机无法胜任。\n\n> **注意。** 状态数相乘，而不是相加：机器必须同时知道两个计数。数 $0$ 的个数模 $2$、$1$ 的个数模 $3$ 需要 $2 \\cdot 3 = 6$ 个状态，而不是 $2 + 3 = 5$ 个。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const answer = a * b;
    return numberProblem({
      prompt: t(
        `A DFA accepts exactly the binary strings in which the number of 0s is divisible by ${a} and the number of 1s is divisible by ${b}. What is the smallest possible number of states?`,
        `一个 DFA 恰好接受这样的二进制串：0 的个数能被 ${a} 整除，1 的个数能被 ${b} 整除。它最少有多少个状态？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          a + b,
          "That adds the sizes of the two machines; a state must record both remainders at once, so the sizes multiply.",
          "那是把两台机器的状态数相加；一个状态必须同时记下两个余数，所以状态数相乘。",
        ),
        why(Math.max(a, b), "That keeps track of only one of the two counts.", "那只追踪了两个计数中的一个。"),
        why(
          2 ** (a + b),
          "That counts sets of states, as in a subset construction; only pairs of remainders are needed.",
          "那是在数状态的集合，像子集构造那样；这里只需要余数对。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["What must be remembered", "需要记住什么"],
            t(
              `The machine must remember the count of 0s modulo $${a}$ and the count of 1s modulo $${b}$, that is, a pair of remainders.`,
              `机器必须记住 0 的个数模 $${a}$ 和 1 的个数模 $${b}$，即一对余数。`,
            ),
          ],
          [
            ["Count the pairs", "数余数对"],
            t(
              `Two different pairs can always be told apart by some continuation, so each needs its own state: $${a} \\cdot ${b} = ${answer}$.`,
              `两个不同的数对总能被某个后续串区分，所以每一对都需要自己的状态：$${a} \\cdot ${b} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `For example, the pairs $(0, 0)$ and $(1, 0)$ differ: appending $${a - 1}$ zeros leads to acceptance from the second but not the first. The product machine with $${answer}$ states does the job, so $${answer}$ is the smallest number.`,
          `例如数对 $(0, 0)$ 与 $(1, 0)$ 不同：再添上 $${a - 1}$ 个 0，后者被接受而前者不被接受。有 $${answer}$ 个状态的乘积机器可以胜任，所以 $${answer}$ 是最小值。`,
        ),
      ),
    });
  },
};

const divideAndConquerExponent: KnowledgePointDef = {
  id: "the-exponent-of-a-divide-and-conquer-recurrence",
  title: t("The exponent of a divide-and-conquer recurrence", "分治递推的指数"),
  explanation: t(
    "For $T(n) = aT\\left(\\frac{n}{b}\\right) + n^c$, the amount of work per level changes by a factor of $\\frac{a}{b^c}$. If this is above one, the bottom level dominates and $T(n) = \\Theta(n^{\\log_b a})$. If it is below one, the top level dominates and $T(n) = \\Theta(n^c)$. So comparing $a$ with $b^c$ decides the growth.\n\n> **Watch out.** Compare $a$ with $b^c$, not with $b$. For $T(n) = 3T\\left(\\frac{n}{2}\\right) + n^2$ we have $3 > 2$ but $3 < 2^2 = 4$, so the top level dominates and $T(n) = \\Theta(n^2)$.",
    "对 $T(n) = aT\\left(\\frac{n}{b}\\right) + n^c$，每层的工作量按因子 $\\frac{a}{b^c}$ 变化。这个因子大于一时，最底层占主导，$T(n) = \\Theta(n^{\\log_b a})$。小于一时，最顶层占主导，$T(n) = \\Theta(n^c)$。所以比较 $a$ 与 $b^c$ 就能决定增长速度。\n\n> **注意。** 要把 $a$ 与 $b^c$ 比较，而不是与 $b$ 比较。对 $T(n) = 3T\\left(\\frac{n}{2}\\right) + n^2$，虽然 $3 > 2$，但 $3 < 2^2 = 4$，所以最顶层占主导，$T(n) = \\Theta(n^2)$。",
  ),
  generate(rng) {
    const bottom = range(2, 5).flatMap((b) => range(1, 4).flatMap((e) => range(0, e - 1).map((c) => [b ** e, b, c, e] as const)));
    const top = range(2, 5).flatMap((b) => range(1, 4).flatMap((c) => range(2, Math.min(9, b ** c - 1)).map((a) => [a, b, c, c] as const)));
    const [a, b, c, answer] = rng.pick([...bottom, ...top]);
    const work = c === 0 ? "1" : c === 1 ? "n" : `n^{${c}}`;
    const power = b ** c;
    const bigger = a > power;
    const threshold = c === 1 ? `${b}` : `${b}^{${c}} = ${power}`;
    const ratio = power === 1 ? `${a}` : `\\frac{${a}}{${power}}`;
    const root = answer === 1 ? `${b}` : `${b}^{${answer}}`;
    return numberProblem({
      prompt: t(
        `Let $T(n) = ${a}T\\left(\\frac{n}{${b}}\\right) + ${work}$. Then $T(n) = \\Theta(n^k)$. Find $k$.`,
        `设 $T(n) = ${a}T\\left(\\frac{n}{${b}}\\right) + ${work}$。则 $T(n) = \\Theta(n^k)$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      mistakes: [
        ...(bigger
          ? [
              why(
                c,
                `That is the exponent of the work term, but $${a} > ${threshold}$, so the bottom level dominates.`,
                `那是工作量项的指数，但 $${a} > ${threshold}$，所以最底层占主导。`,
              ),
            ]
          : [
              why(
                Math.floor(Math.log(a) / Math.log(b)),
                `That comes from $\\log_{${b}} ${a}$, but $${a} < ${threshold}$, so the top level dominates.`,
                `那来自 $\\log_{${b}} ${a}$，但 $${a} < ${threshold}$，所以最顶层占主导。`,
              ),
            ]),
        why(a, "That takes the number of subproblems as the exponent.", "那是把子问题的个数当成了指数。"),
        why(
          answer + 1,
          `That adds one to the exponent; an extra factor appears only when $a = b^c$, and even then it is $\\log n$, not $n$.`,
          `那给指数加了一；只有 $a = b^c$ 时才会多出因子，而且那时多出的是 $\\log n$，不是 $n$。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Compare the subproblems with the shrinking work", "比较子问题个数与工作量的缩小"],
            c === 0
              ? t(
                  `There are $${a}$ subproblems and the work per call is constant, so each level does $${a}$ times the work of the level above.`,
                  `共有 $${a}$ 个子问题，每次调用的工作量是常数，所以每层的工作量是上一层的 $${a}$ 倍。`,
                )
              : t(
                  `There are $${a}$ subproblems and the work per call shrinks by a factor of $${threshold}$, so each level does $${ratio}$ times the work of the level above.`,
                  `共有 $${a}$ 个子问题，每次调用的工作量缩小为原来的 $\\frac{1}{${power}}$，所以每层的工作量是上一层的 $${ratio}$ 倍。`,
                ),
          ],
          [
            ["Decide which level dominates", "判断哪一层占主导"],
            bigger
              ? t(
                  `Here $${a} > ${threshold}$, so the work grows level by level and the bottom level dominates: $k = \\log_{${b}} ${a} = ${answer}$.`,
                  `这里 $${a} > ${threshold}$，工作量逐层增大，最底层占主导：$k = \\log_{${b}} ${a} = ${answer}$。`,
                )
              : t(
                  `Here $${a} < ${threshold}$, so the work shrinks level by level and the top level dominates: $k$ is the exponent of the work term, $${answer}$.`,
                  `这里 $${a} < ${threshold}$，工作量逐层减小，最顶层占主导：$k$ 是工作量项的指数 $${answer}$。`,
                ),
          ],
        ],
        bigger
          ? t(
              `$${root} = ${a}$, so $\\log_{${b}} ${a} = ${answer}$ exactly, and $${answer} > ${c}$: the leaves outweigh the work term, as they should.`,
              `$${root} = ${a}$，所以 $\\log_{${b}} ${a} = ${answer}$ 恰好成立，且 $${answer} > ${c}$：叶子的总量超过工作量项，与结论一致。`,
            )
          : t(
              `The levels form a geometric series with ratio $${ratio} < 1$, whose sum is a constant times the top level's work, so the total is a constant multiple of that work.`,
              `各层构成公比为 $${ratio} < 1$ 的等比数列，其和是顶层工作量的常数倍，所以总量是该工作量的常数倍。`,
            ),
      ),
    });
  },
};

const pairsWithASum: KnowledgePointDef = {
  id: "the-pigeonhole-principle-with-pairs-of-numbers",
  title: t("The pigeonhole principle with pairs of numbers", "数对上的鸽巢原理"),
  explanation: t(
    "The pigeonhole principle only needs boxes, and the boxes need not be given. To force two chosen numbers to have a given sum, make each box a pair of numbers with that sum. A number with no partner forms a box of its own. One number from each box avoids the sum, and one more number forces it. From $1, 2, \\dots, 100$, the pairs with sum $101$ are $\\{1, 100\\}, \\{2, 99\\}, \\dots, \\{50, 51\\}$, which is $50$ boxes, so $51$ numbers force a sum of $101$.\n\n> **Watch out.** Choosing one number from every box still avoids the sum, so the answer is one more than the number of boxes; and when the range has odd length, the middle number is a box by itself.",
    "鸽巢原理只需要盒子，而盒子不必是现成的。要迫使选出的两个数有给定的和，就让每个盒子是和为该值的一对数。没有配对的数自成一盒。每盒选一个数可以避开这个和，再多选一个就无法避开。从 $1, 2, \\dots, 100$ 中，和为 $101$ 的数对是 $\\{1, 100\\}, \\{2, 99\\}, \\dots, \\{50, 51\\}$，共 $50$ 个盒子，所以取 $51$ 个数就必有和为 $101$ 的两个数。\n\n> **注意。** 每个盒子各取一个数仍能避开这个和，所以答案是盒子数加一；范围内数的个数为奇数时，中间的数自成一盒。",
  ),
  generate(rng) {
    const N = rng.int(8, 60);
    const boxes = Math.ceil(N / 2);
    const answer = boxes + 1;
    return numberProblem({
      prompt: t(
        `What is the smallest $k$ such that any $k$ different numbers from $1, 2, \\dots, ${N}$ must include two with sum ${N + 1}?`,
        `最小的 $k$ 是多少，使得从 $1, 2, \\dots, ${N}$ 中任取 $k$ 个不同的数，都必有两个数的和为 ${N + 1}？`,
      ),
      answer,
      solveFor: "k",
      mistakes: [
        why(
          boxes,
          "That many numbers can be one from each box, which still avoids the sum; one more is needed.",
          "这么多个数可以每盒各取一个，仍能避开这个和；还需要再多一个。",
        ),
        why(
          N - 1,
          "That is far more than needed; the number of boxes, not the size of the range, decides.",
          "那比需要的多得多；起决定作用的是盒子数，而不是范围的大小。",
        ),
        why(
          boxes + 2,
          "That is one more than needed; one number beyond one per box already forces the sum.",
          "那比需要的多一个；每盒一个之外再多一个就已经必然出现这个和。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Make the boxes", "构造盒子"],
            N % 2 === 0
              ? t(`The numbers form $${boxes}$ pairs with sum $${N + 1}$.`, `这些数组成 $${boxes}$ 对和为 $${N + 1}$ 的数。`)
              : t(
                  `The numbers form $${boxes - 1}$ pairs with sum $${N + 1}$, and the middle number $${boxes}$ is a box by itself: $${boxes}$ boxes.`,
                  `这些数组成 $${boxes - 1}$ 对和为 $${N + 1}$ 的数，中间的数 $${boxes}$ 自成一盒：共 $${boxes}$ 个盒子。`,
                ),
          ],
          [
            ["Add one", "再加一个"],
            t(
              `One from each box avoids the sum, and one more forces it: $k = ${boxes} + 1 = ${answer}$.`,
              `每盒取一个可以避开这个和，再多取一个就无法避开：$k = ${boxes} + 1 = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The numbers $1, \\dots, ${boxes}$ show that $${boxes}$ is not enough: their largest sum is $${boxes} + ${boxes - 1} = ${2 * boxes - 1}$, below $${N + 1}$.`,
          `数 $1, \\dots, ${boxes}$ 说明 $${boxes}$ 个不够：它们的最大和是 $${boxes} + ${boxes - 1} = ${2 * boxes - 1}$，小于 $${N + 1}$。`,
        ),
      ),
    });
  },
};

const fixedPoints: KnowledgePointDef = {
  id: "permutations-with-exactly-k-fixed-points",
  title: t("Permutations with exactly k fixed points", "恰有 k 个不动点的排列"),
  explanation: t(
    "Inclusion-exclusion counts the derangements, the permutations that leave nothing in place: $D_m = m!\\sum_{j=0}^{m} \\frac{(-1)^j}{j!}$, which begins $1, 0, 1, 2, 9, 44, 265$. To leave exactly $k$ items in place, first choose those $k$ items. The remaining items must then form a derangement, and the two counts multiply. Of the arrangements of $1, 2, 3$, exactly one number stays in place in $\\binom{3}{1} D_2 = 3$ of them: $132$, $321$ and $213$.\n\n> **Watch out.** The items not chosen must all move, so count their derangements, not all their orders; and do not forget the factor that chooses which items stay.",
    "容斥原理可以数出错排，即没有任何元素留在原位的排列：$D_m = m!\\sum_{j=0}^{m} \\frac{(-1)^j}{j!}$，开头几项是 $1, 0, 1, 2, 9, 44, 265$。要恰好使 $k$ 个元素留在原位，先选出这 $k$ 个元素。其余元素必须构成错排，两个计数相乘。在 $1, 2, 3$ 的排列中，恰有一个数留在原位的有 $\\binom{3}{1} D_2 = 3$ 个：$132$、$321$ 和 $213$。\n\n> **注意。** 没被选中的元素必须全部移动，所以要数它们的错排，而不是全部排列；也不要忘了选出哪些元素留在原位的那个因子。",
  ),
  generate(rng) {
    const [n, k] = rng.pick(range(4, 10).flatMap((n) => range(1, n - 2).map((k) => [n, k] as const)));
    const left = n - k;
    const d = derangements(left);
    const choose = binom(n, k);
    const answer = choose * d;
    const factorial = range(1, left).reduce((s, i) => s * i, 1);
    const derangeTerms = range(0, left)
      .map((j) => `${j === 0 ? "" : j % 2 === 1 ? " - " : " + "}${factorial / range(1, j).reduce((s, i) => s * i, 1)}`)
      .join("");
    return numberProblem({
      prompt: t(
        `${n} letters are put into ${n} addressed envelopes, one per envelope. In how many ways do exactly ${k} letters reach the right envelope?`,
        `把 ${n} 封信放进 ${n} 个写好地址的信封，每个信封一封。恰好 ${k} 封信放对的方式有多少种？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          choose,
          "That only chooses the correct letters; the other letters must still all go wrong, which multiplies the count.",
          "那只是选出了放对的信；其余的信还必须全部放错，这要乘上去。",
        ),
        why(
          choose * factorial,
          "That lets the other letters go anywhere, so some of them may land right as well.",
          "那是让其余的信随便放，于是其中一些也可能放对。",
        ),
        why(
          d,
          "That counts the ways the other letters all go wrong but forgets to choose which letters are right.",
          "那是数了其余信全放错的方式，却忘了选出哪些信放对。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["Choose the right letters", "选出放对的信"], t(`$\\binom{${n}}{${k}} = ${choose}$.`, `$\\binom{${n}}{${k}} = ${choose}$。`)],
          [
            ["Derange the rest", "其余错排"],
            t(`The other $${left}$ must all be wrong: $D_{${left}} = ${d}$.`, `其余 $${left}$ 封必须全放错：$D_{${left}} = ${d}$。`),
          ],
          [["Multiply", "相乘"], t(`$${choose} \\cdot ${d} = ${answer}$.`, `$${choose} \\cdot ${d} = ${answer}$。`)],
        ],
        t(
          `Inclusion-exclusion gives $D_{${left}} = ${derangeTerms}$, which is $${d}$ again.`,
          `由容斥原理 $D_{${left}} = ${derangeTerms}$，同样是 $${d}$。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** matrix writes a grid of numbers as a LaTeX matrix. */
const matrix = (rows: number[][]) => `\\begin{pmatrix} ${rows.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
/** binary writes a positive integer as a base 2 numeral. */
const binary = (n: number) => `\\mathrm{${n.toString(2)}}_{2}`;
/** productOf multiplies a list of numbers. */
const productOf = (values: number[]) => values.reduce((a, b) => a * b, 1);

const functionsWithFixedValues: KnowledgePointDef = {
  id: "boolean-functions-with-values-fixed-on-some-inputs",
  title: t("Boolean functions with values fixed on some inputs", "在部分输入上取值固定的布尔函数"),
  explanation: t(
    "A Boolean function of $n$ variables is nothing more than a choice of 0 or 1 for each of its $2^n$ input rows, and these choices are independent. Fixing the value on some rows removes those choices and leaves the rest free. So each remaining row doubles the count, and the answer is a power of 2 with the number of free rows as exponent: a function of $5$ variables with its value fixed on $30$ of its $32$ rows has $2^{2} = 4$ choices left.\n\n> **Watch out.** The exponent is the number of free rows, not the number of fixed ones; and the value the fixed rows take does not change the count.",
    "$n$ 个变量的布尔函数，不过是为 $2^n$ 个输入行各选 0 或 1，这些选择相互独立。在某些行上固定取值，就去掉了这些选择，其余的行仍然自由。所以每个剩下的行都使个数翻倍，答案是 2 的幂，指数是自由行的个数：$5$ 元函数在 $32$ 行中的 $30$ 行上取值固定后，还剩 $2^{2} = 4$ 种选择。\n\n> **注意。** 指数是自由行的个数，而不是固定行的个数；固定行取什么值并不影响个数。",
  ),
  generate(rng) {
    const n = rng.int(3, 4);
    const rows = 2 ** n;
    const fixed = rng.int(1, rows - 1);
    const value = rng.int(0, 1);
    const free = rows - fixed;
    const answer = 2 ** free;
    return numberProblem({
      prompt: t(
        `How many Boolean functions of $${n}$ variables take the value $${value}$ on each of $${fixed}$ chosen input ${fixed === 1 ? "row" : "rows"}?`,
        `有多少个 $${n}$ 元布尔函数，在选定的 $${fixed}$ 个输入行上都取值 $${value}$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(2 ** rows, "That ignores the fixed rows.", "那是忽略了取值固定的行。"),
        why(
          2 ** fixed,
          "That raises $2$ to the number of fixed rows; it is the free rows that have a choice.",
          "那是以固定行的个数为指数；有选择的是自由行。",
        ),
        why(free, "That counts the free rows, not the ways to fill them.", "那是自由行的个数，而不是填写它们的方式数。"),
        why(
          2 * free,
          "That doubles the number of free rows instead of raising $2$ to it.",
          "那是把自由行的个数乘以 $2$，而不是以它为 $2$ 的指数。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count the free rows", "数自由行"],
            t(
              `There are $2^{${n}} = ${rows}$ rows, and $${rows} - ${fixed} = ${free}$ remain free.`,
              `共有 $2^{${n}} = ${rows}$ 行，其中 $${rows} - ${fixed} = ${free}$ 行仍然自由。`,
            ),
          ],
          [
            ["Fill the free rows", "填写自由行"],
            t(
              `Each free row takes $0$ or $1$, so the count is $${pow(2, free)}${free === 1 ? "" : ` = ${answer}`}$.`,
              `每个自由行取 $0$ 或 $1$，所以个数是 $${pow(2, free)}${free === 1 ? "" : ` = ${answer}`}$。`,
            ),
          ],
        ],
        t(
          `With every row free there would be $2^{${rows}}$ functions, and fixing a row halves the count: $2^{${rows}} / ${pow(2, fixed)} = ${pow(2, free)}$.`,
          `若所有行都自由，共有 $2^{${rows}}$ 个函数，每固定一行个数就减半：$2^{${rows}} / ${pow(2, fixed)} = ${pow(2, free)}$。`,
        ),
      ),
    });
  },
};

const distributingClauses: KnowledgePointDef = {
  id: "the-number-of-terms-after-distributing-clauses",
  title: t("The number of terms after distributing clauses", "分配子句后的项数"),
  explanation: t(
    "Distributing $\\wedge$ over $\\vee$ turns a conjunction of clauses into a disjunctive normal form. Each resulting term is made by picking one literal from every clause, just as each term of a product of sums picks one summand from every bracket. So the number of terms is the product of the clause sizes, which is why converting between normal forms can make a formula grow quickly: $(x_1 \\vee x_2 \\vee x_3) \\wedge (x_4 \\vee x_5) \\wedge x_6$ gives $3 \\cdot 2 \\cdot 1 = 6$ terms, such as $x_1 \\wedge x_4 \\wedge x_6$.\n\n> **Watch out.** Multiply the clause sizes; adding them counts the literals, not the terms.",
    "把 $\\wedge$ 对 $\\vee$ 分配，就把子句的合取变成析取范式。得到的每一项都是从每个子句中各选一个文字构成的，正如和的乘积展开时，每一项从每个括号中各选一项。所以项数是各子句大小的乘积，这也是范式转换会使公式迅速变大的原因：$(x_1 \\vee x_2 \\vee x_3) \\wedge (x_4 \\vee x_5) \\wedge x_6$ 得到 $3 \\cdot 2 \\cdot 1 = 6$ 项，例如 $x_1 \\wedge x_4 \\wedge x_6$。\n\n> **注意。** 要把各子句的大小相乘；相加得到的是文字的个数，而不是项数。",
  ),
  generate(rng) {
    const sizes = range(1, rng.int(2, 4)).map(() => rng.int(2, 6));
    const answer = productOf(sizes);
    const sum = sizes.reduce((a, b) => a + b, 0);
    const list = `${sizes.slice(0, -1).join(", ")} and ${sizes[sizes.length - 1]}`;
    const rest = answer / sizes[0]!;
    return numberProblem({
      prompt: t(
        `A conjunction has ${sizes.length} clauses, with ${list} literals, and no variable occurs twice. Distributing $\\wedge$ over $\\vee$ gives a disjunctive normal form. How many terms does it have before any simplification?`,
        `一个合取式有 ${sizes.length} 个子句，文字个数分别是 ${sizes.join("、")}，没有变量出现两次。把 $\\wedge$ 对 $\\vee$ 分配，得到一个析取范式。化简之前它有多少项？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          sum,
          "That adds the clause sizes; each term picks from every clause, so the counts multiply.",
          "那是把子句大小相加；每一项从每个子句中各选一个，所以个数相乘。",
        ),
        why(sizes.length, "That counts the clauses, not the terms.", "那是子句的个数，而不是项数。"),
        why(
          2 ** sum,
          "That counts every set of literals, not one literal from each clause.",
          "那是所有文字集合的个数，而不是从每个子句各取一个文字。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["Build a term", "构造一项"], t("Each term picks one literal from every clause.", "每一项从每个子句中各选一个文字。")],
          [
            ["Multiply the choices", "把选择数相乘"],
            t(`$${sizes.join(" \\cdot ")} = ${answer}$ terms.`, `共 $${sizes.join(" \\cdot ")} = ${answer}$ 项。`),
          ],
        ],
        t(
          `For each of the $${sizes[0]}$ literals of the first clause, the other clauses give $${rest}$ ways to finish the term, and $${sizes[0]} \\cdot ${rest} = ${answer}$.`,
          `第一个子句的 $${sizes[0]}$ 个文字中的每一个，其余子句都有 $${rest}$ 种方式补全这一项，$${sizes[0]} \\cdot ${rest} = ${answer}$。`,
        ),
      ),
    });
  },
};

const clausesOfWidth: KnowledgePointDef = {
  id: "counting-the-clauses-of-a-given-width",
  title: t("Counting the clauses of a given width", "计算给定宽度的子句数"),
  explanation: t(
    "A clause with exactly $k$ literals on $k$ different variables is built in two independent steps. First choose which $k$ of the $n$ variables appear, which can be done in $\\binom{n}{k}$ ways. Then decide for each chosen variable whether it appears plain or negated, which gives $2^k$ ways. A variable cannot appear in both forms, because such a clause would always be true. Over $6$ variables, the clauses that use all $6$ number $\\binom{6}{6} \\cdot 2^{6} = 64$.\n\n> **Watch out.** Choose $k$ of the $n$ variables, not $k$ of the $2n$ literals, which would allow $x$ and $\\neg x$ together; and do not forget the $2^k$ choices of sign.",
    "恰有 $k$ 个文字、涉及 $k$ 个不同变量的子句，分两个独立的步骤构造。先选出 $n$ 个变量中出现的 $k$ 个，有 $\\binom{n}{k}$ 种选法。再决定每个选中的变量是原样出现还是取反出现，有 $2^k$ 种方式。一个变量不能以两种形式同时出现，因为这样的子句永远为真。在 $6$ 个变量上，用到全部 $6$ 个变量的子句有 $\\binom{6}{6} \\cdot 2^{6} = 64$ 个。\n\n> **注意。** 要从 $n$ 个变量中选 $k$ 个，而不是从 $2n$ 个文字中选 $k$ 个，后者会让 $x$ 与 $\\neg x$ 同时出现；也不要忘了符号的 $2^k$ 种选择。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const k = rng.int(2, Math.min(n, 5));
    const choose = binom(n, k);
    const answer = choose * 2 ** k;
    const ordered = range(0, k - 1).map((i) => 2 * n - 2 * i);
    const factorial = productOf(range(1, k));
    return numberProblem({
      prompt: t(
        `Over $${n}$ variables, how many clauses have exactly $${k}$ literals on $${k}$ different variables?`,
        `在 $${n}$ 个变量上，有多少个子句恰有 $${k}$ 个文字，且涉及 $${k}$ 个不同的变量？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(choose, "That leaves out the choice of signs.", "那是漏掉了符号的选择。"),
        why(2 ** k, "That leaves out the choice of variables.", "那是漏掉了变量的选择。"),
        why(
          binom(2 * n, k),
          `That chooses $${k}$ of the $${2 * n}$ literals, which allows a variable to appear both plain and negated.`,
          `那是从 $${2 * n}$ 个文字中选 $${k}$ 个，会让同一个变量既原样又取反地出现。`,
        ),
        why(n ** k, "That picks the variables in order and allows repeats.", "那是按顺序选变量，并且允许重复。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Choose the variables", "选变量"],
            t(`$\\binom{${n}}{${k}} = ${choose}$ ways.`, `有 $\\binom{${n}}{${k}} = ${choose}$ 种方法。`),
          ],
          [["Choose the signs", "选符号"], t(`$2^{${k}} = ${2 ** k}$ ways.`, `有 $2^{${k}} = ${2 ** k}$ 种方法。`)],
          [["Multiply", "相乘"], t(`$${choose} \\cdot ${2 ** k} = ${answer}$.`, `$${choose} \\cdot ${2 ** k} = ${answer}$。`)],
        ],
        t(
          `Picking the literals one at a time, each pick rules out both literals of its variable: $\\frac{${ordered.join(" \\cdot ")}}{${k}!} = \\frac{${productOf(ordered)}}{${factorial}} = ${answer}$.`,
          `逐个选文字，每选一个就排除它所在变量的两个文字：$\\frac{${ordered.join(" \\cdot ")}}{${k}!} = \\frac{${productOf(ordered)}}{${factorial}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const mintermsOfConjunction: KnowledgePointDef = {
  id: "the-minterms-of-a-single-conjunction",
  title: t("The minterms of a single conjunction", "单个合取式的极小项"),
  explanation: t(
    "A minterm mentions every variable, so a shorter conjunction stands for several minterms at once. The literals that are present fix the values of their variables, and each variable that is missing can take either value. So a conjunction of $k$ literals over $n$ variables is true on $2^{n - k}$ rows, and its principal disjunctive normal form has that many minterms: over $10$ variables, $x_1 \\wedge \\neg x_2 \\wedge x_3$ leaves $7$ variables free and has $2^{7} = 128$ minterms.\n\n> **Watch out.** The exponent counts the missing variables, not the literals present; and the rows where the conjunction is false give maxterms, not minterms.",
    "极小项涉及每个变量，所以较短的合取式同时代表多个极小项。出现的文字固定了相应变量的取值，每个没有出现的变量都可以取任一值。所以 $n$ 个变量上 $k$ 个文字的合取式在 $2^{n - k}$ 行上为真，它的主析取范式就有这么多个极小项：在 $10$ 个变量上，$x_1 \\wedge \\neg x_2 \\wedge x_3$ 留下 $7$ 个自由变量，有 $2^{7} = 128$ 个极小项。\n\n> **注意。** 指数是没有出现的变量的个数，而不是出现的文字个数；合取式为假的行给出的是极大项，而不是极小项。",
  ),
  generate(rng) {
    const n = rng.int(3, 8);
    const k = rng.int(1, n - 1);
    const literals = range(1, k).map((i) => `${rng.int(0, 1) === 0 ? "\\neg " : ""}x_{${i}}`);
    const answer = 2 ** (n - k);
    return numberProblem({
      prompt: t(
        `A function of the $${n}$ variables $x_{1}, \\dots, x_{${n}}$ is $f = ${literals.join(" \\wedge ")}$. How many minterms does its principal disjunctive normal form have?`,
        `$x_{1}, \\dots, x_{${n}}$ 这 $${n}$ 个变量的函数是 $f = ${literals.join(" \\wedge ")}$。它的主析取范式有多少个极小项？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          1,
          "That takes the conjunction for a single minterm, but it does not mention every variable.",
          "那是把这个合取式当成一个极小项，但它没有涉及每个变量。",
        ),
        why(n - k, "That counts the free variables, not the ways to set them.", "那是自由变量的个数，而不是给它们赋值的方式数。"),
        why(
          2 ** k,
          "That raises $2$ to the number of literals present instead of the number missing.",
          "那是以出现的文字个数为指数，而不是以没有出现的变量个数为指数。",
        ),
        why(2 ** n - answer, "That counts the rows where $f$ is false, which give maxterms.", "那是 $f$ 为假的行数，它们给出极大项。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count the free variables", "数自由变量"],
            t(
              `The formula fixes $${k}$ of the variables and leaves $${n} - ${k} = ${n - k}$ free.`,
              `这个公式固定了 $${k}$ 个变量，留下 $${n} - ${k} = ${n - k}$ 个自由变量。`,
            ),
          ],
          [
            ["Count the true rows", "数为真的行"],
            t(
              `$${pow(2, n - k)}${n - k === 1 ? "" : ` = ${answer}`}$ rows, one minterm each.`,
              `共 $${pow(2, n - k)}${n - k === 1 ? "" : ` = ${answer}`}$ 行，每行一个极小项。`,
            ),
          ],
        ],
        t(
          `The $${pow(2, k)}$ ways to set the fixed variables split the $2^{${n}}$ rows into equal groups of $${answer}$, and only one way makes $f$ true: $2^{${n}} / ${pow(2, k)} = ${answer}$.`,
          `固定变量的 $${pow(2, k)}$ 种取法把 $2^{${n}}$ 行分成大小都为 $${answer}$ 的组，只有一种取法使 $f$ 为真：$2^{${n}} / ${pow(2, k)} = ${answer}$。`,
        ),
      ),
    });
  },
};

const maxtermsFromMinterms: KnowledgePointDef = {
  id: "the-maxterms-from-the-number-of-minterms",
  title: t("The maxterms from the number of minterms", "由极小项个数求极大项个数"),
  explanation: t(
    "Every input row of a function falls into exactly one of two groups. A row where the function is true gives a minterm of the principal disjunctive normal form, and a row where it is false gives a maxterm of the principal conjunctive normal form. So the numbers of minterms and maxterms always add to $2^n$, and knowing one tells you the other: a function of $9$ variables with $100$ minterms has $512 - 100 = 412$ maxterms.\n\n> **Watch out.** Subtract from the $2^n$ rows, not from $n$; and the two counts are equal only when the function is true on exactly half of its rows.",
    "函数的每个输入行恰好属于两类之一。函数为真的行给出主析取范式的一个极小项，函数为假的行给出主合取范式的一个极大项。所以极小项和极大项的个数之和总是 $2^n$，知道其中一个就知道另一个：有 $100$ 个极小项的 $9$ 元函数有 $512 - 100 = 412$ 个极大项。\n\n> **注意。** 要从 $2^n$ 行中减，而不是从 $n$ 中减；只有函数恰在一半的行上为真时，两个个数才相等。",
  ),
  generate(rng) {
    const n = rng.int(2, 8);
    const rows = 2 ** n;
    const m = rng.int(1, rows - 1);
    const answer = rows - m;
    return numberProblem({
      prompt: t(
        `The principal disjunctive normal form of a function of $${n}$ variables has $${m}$ ${m === 1 ? "minterm" : "minterms"}. How many maxterms does its principal conjunctive normal form have?`,
        `一个 $${n}$ 元函数的主析取范式有 $${m}$ 个极小项。它的主合取范式有多少个极大项？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          m,
          "That assumes as many maxterms as minterms; the maxterms come from the other rows.",
          "那是假定极大项与极小项一样多；极大项来自其余的行。",
        ),
        why(rows, "That counts every row, including the true ones.", "那是把所有行都数上了，包括为真的行。"),
        why(
          rows / 2,
          `That assumes $f$ is false on half the rows; it is true on $${m}$ of them.`,
          `那是假定 $f$ 在一半的行上为假；而它在其中 $${m}$ 行上为真。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count the rows", "数行"],
            t(`$2^{${n}} = ${rows}$ rows, $${m}$ of them true.`, `共 $2^{${n}} = ${rows}$ 行，其中 $${m}$ 行为真。`),
          ],
          [
            ["Take the false rows", "取为假的行"],
            t(`$${rows} - ${m} = ${answer}$ rows give the maxterms.`, `$${rows} - ${m} = ${answer}$ 行给出极大项。`),
          ],
        ],
        t(`$${m} + ${answer} = ${rows}$, every row counted once.`, `$${m} + ${answer} = ${rows}$，每行恰好数一次。`),
      ),
    });
  },
};

const monomialsOfDegree: KnowledgePointDef = {
  id: "counting-the-monomials-of-a-given-degree",
  title: t("Counting the monomials of a given degree", "计算给定次数的单项式数"),
  explanation: t(
    "In a Boolean polynomial, $x \\wedge x = x$, so no variable ever needs an exponent above 1. A monomial is therefore determined by the set of variables it contains, and its degree is the size of that set. Counting monomials of degree $d$ in $n$ variables is the same as counting subsets of size $d$, which is why the answer is a binomial coefficient and not a power: in $13$ variables there are $\\binom{13}{3} = 286$ monomials of degree $3$.\n\n> **Watch out.** Do not count monomials such as $x^2 y$ or $yx$ separately, since $x^2 = x$ and $yx = xy$; and $2^n$ counts the monomials of every degree together.",
    "在布尔多项式中，$x \\wedge x = x$，所以任何变量的指数都不需要超过 1。因此单项式由它所含变量的集合决定，次数就是这个集合的大小。计算 $n$ 个变量上 $d$ 次单项式的个数，就是计算大小为 $d$ 的子集个数，所以答案是二项式系数，而不是幂：$13$ 个变量上有 $\\binom{13}{3} = 286$ 个 $3$ 次单项式。\n\n> **注意。** 不要另算 $x^2 y$ 或 $yx$ 这样的单项式，因为 $x^2 = x$，$yx = xy$；$2^n$ 是所有次数的单项式的总数。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const d = rng.int(2, n - 1);
    const answer = binom(n, d);
    return numberProblem({
      prompt: t(
        `How many different monomials of degree $${d}$ can a Boolean polynomial in $${n}$ variables contain?`,
        `$${n}$ 个变量的布尔多项式可以含有多少个不同的 $${d}$ 次单项式？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n ** d,
          "That picks the variables in order and allows repeats, but $x^2 = x$ and $yx = xy$.",
          "那是按顺序选变量并允许重复，但 $x^2 = x$，$yx = xy$。",
        ),
        why(2 ** n, "That counts the monomials of every degree.", "那是所有次数的单项式的个数。"),
        why(binom(n + d - 1, d), "That allows a variable to repeat, but $x^2 = x$.", "那是允许变量重复，但 $x^2 = x$。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Describe a monomial", "描述单项式"],
            t(
              `Since $x^2 = x$, a monomial of degree $${d}$ is a set of $${d}$ different variables.`,
              `因为 $x^2 = x$，$${d}$ 次单项式就是 $${d}$ 个不同变量的集合。`,
            ),
          ],
          [["Count the sets", "数集合"], t(`$\\binom{${n}}{${d}} = ${answer}$.`, `$\\binom{${n}}{${d}} = ${answer}$。`)],
        ],
        t(
          `Choosing instead the $${n - d}$ variables left out gives $\\binom{${n}}{${n - d}} = ${answer}$ as well.`,
          `改为选出不出现的 $${n - d}$ 个变量，同样得 $\\binom{${n}}{${n - d}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const karnaughGroups: KnowledgePointDef = {
  id: "counting-the-groups-of-a-karnaugh-map",
  title: t("Counting the groups of a Karnaugh map", "计算卡诺图中的分组数"),
  explanation: t(
    "A valid group of $2^j$ cells in a Karnaugh map lets exactly $j$ variables vary while the others stay fixed. To describe such a group, choose which $j$ variables are free, then choose a value for each of the remaining $n - j$ variables. Multiplying the two counts gives every group. It also shows that wrapping around the edges of the map is part of the count. The $2 \\times 2$ map of $x$ and $y$ has $\\binom{2}{1} \\cdot 2 = 4$ pairs: the rows $x$ and $\\neg x$ and the columns $y$ and $\\neg y$.\n\n> **Watch out.** The fixed variables need values, $2^{n - j}$ ways, as well as the choice of which variables are free; and the free variables get no values, since they run through both.",
    "卡诺图中 $2^j$ 个格子的有效分组，恰好让 $j$ 个变量变化，其他变量保持固定。要描述这样的分组，先选出哪 $j$ 个变量自由，再为其余 $n - j$ 个变量各选一个值。两个计数相乘，就得到所有分组。这也说明，绕过图边缘的分组也包括在内。$x$ 与 $y$ 的 $2 \\times 2$ 卡诺图有 $\\binom{2}{1} \\cdot 2 = 4$ 个两格组：行 $x$ 与 $\\neg x$，列 $y$ 与 $\\neg y$。\n\n> **注意。** 除了选哪些变量自由，固定的变量还要取值，有 $2^{n - j}$ 种方式；自由变量不取值，因为它们取遍两个值。",
  ),
  generate(rng) {
    const n = rng.int(3, 8);
    const j = rng.int(1, n - 1);
    const choose = binom(n, j);
    const values = 2 ** (n - j);
    const answer = choose * values;
    return numberProblem({
      prompt: t(
        `A valid group of $${2 ** j}$ cells in a Karnaugh map of $${n}$ variables lets $${j}$ ${j === 1 ? "variable" : "variables"} vary and fixes the others. How many different groups of this size are there?`,
        `$${n}$ 个变量的卡诺图中，$${2 ** j}$ 个格子的有效分组让 $${j}$ 个变量变化，并固定其他变量。这样大小的不同分组有多少个？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(choose, "That leaves out the values of the fixed variables.", "那是漏掉了固定变量的取值。"),
        why(values, "That leaves out the choice of which variables are free.", "那是漏掉了选哪些变量自由。"),
        why(
          choose * 2 ** j,
          "That gives values to the free variables instead of the fixed ones.",
          "那是给自由变量取值，而不是给固定变量取值。",
        ),
        why(2 ** n, "That counts the cells of the map, not the groups.", "那是卡诺图的格子数，而不是分组数。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Choose the free variables", "选自由变量"],
            t(`$\\binom{${n}}{${j}} = ${choose}$ ways.`, `有 $\\binom{${n}}{${j}} = ${choose}$ 种方法。`),
          ],
          [
            ["Fix the others", "固定其余变量"],
            t(
              `The other $${n - j}$ variables take values in $${pow(2, n - j)}${n - j === 1 ? "" : ` = ${values}`}$ ways.`,
              `其余 $${n - j}$ 个变量的取值有 $${pow(2, n - j)}${n - j === 1 ? "" : ` = ${values}`}$ 种方式。`,
            ),
          ],
          [["Multiply", "相乘"], t(`$${choose} \\cdot ${values} = ${answer}$.`, `$${choose} \\cdot ${values} = ${answer}$。`)],
        ],
        t(
          `Each group is a term with $${n - j}$ literals on different variables, and such terms number $\\binom{${n}}{${n - j}} \\cdot ${pow(2, n - j)} = ${answer}$ too.`,
          `每个分组都是含 $${n - j}$ 个不同变量文字的项，这样的项也有 $\\binom{${n}}{${n - j}} \\cdot ${pow(2, n - j)} = ${answer}$ 个。`,
        ),
      ),
    });
  },
};

const affineDependingOn: KnowledgePointDef = {
  id: "affine-functions-that-depend-on-a-given-number-of-variables",
  title: t("Affine functions that depend on a given number of variables", "依赖给定个数变量的仿射函数"),
  explanation: t(
    "An affine Boolean function has the form $c \\oplus x_{i_1} \\oplus \\dots \\oplus x_{i_k}$, and the variables in the sum are exactly the ones it depends on, since changing any of them flips the output. So to count them, choose the $k$ variables, then choose the constant $c$. The constant has two values, and it does not change which variables matter. With $20$ variables, $2\\binom{20}{2} = 380$ affine functions depend on exactly $2$ of them.\n\n> **Watch out.** Keep both values of the constant, since $c \\oplus x_1$ and $\\neg(c \\oplus x_1)$ depend on the same variable; and choose which $k$ variables appear rather than raising $2$ to the power $k$.",
    "仿射布尔函数的形式是 $c \\oplus x_{i_1} \\oplus \\dots \\oplus x_{i_k}$，和中的变量恰好就是它依赖的变量，因为改变其中任何一个都会翻转输出。所以要计数，先选这 $k$ 个变量，再选常数 $c$。常数有两个值，它不改变函数依赖哪些变量。$20$ 个变量时，恰好依赖其中 $2$ 个变量的仿射函数有 $2\\binom{20}{2} = 380$ 个。\n\n> **注意。** 常数的两个值都要算，因为 $c \\oplus x_1$ 与 $\\neg(c \\oplus x_1)$ 依赖同一个变量；要选出出现的 $k$ 个变量，而不是取 $2$ 的 $k$ 次方。",
  ),
  generate(rng) {
    const n = rng.int(2, 14);
    const k = rng.int(1, n);
    const choose = binom(n, k);
    const answer = 2 * choose;
    return numberProblem({
      prompt: t(
        `How many affine Boolean functions of $${n}$ variables depend on exactly $${k}$ of them?`,
        `有多少个 $${n}$ 元仿射布尔函数恰好依赖其中 $${k}$ 个变量？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(choose, "That leaves out the two choices of the constant.", "那是漏掉了常数的两种选择。"),
        why(2 ** (n + 1), "That counts every affine function, whatever it depends on.", "那是所有仿射函数的个数，不论它依赖哪些变量。"),
        why(
          2 ** k,
          `That raises $2$ to the power $${k}$ instead of choosing which $${k}$ variables appear.`,
          `那是取 $2$ 的 $${k}$ 次方，而不是选出出现的 $${k}$ 个变量。`,
        ),
        why(n, "That counts the variables, not the functions.", "那是变量的个数，不是函数的个数。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Choose the variables", "选变量"],
            t(`$\\binom{${n}}{${k}} = ${choose}$ ways.`, `有 $\\binom{${n}}{${k}} = ${choose}$ 种方法。`),
          ],
          [
            ["Choose the constant", "选常数"],
            t(`$c$ is $0$ or $1$: $2 \\cdot ${choose} = ${answer}$.`, `$c$ 取 $0$ 或 $1$：$2 \\cdot ${choose} = ${answer}$。`),
          ],
        ],
        t(
          `Choosing instead the $${n - k}$ variables left out gives $2\\binom{${n}}{${n - k}} = ${answer}$ as well.`,
          `改为选出不出现的 $${n - k}$ 个变量，同样得 $2\\binom{${n}}{${n - k}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const integersWithBits: KnowledgePointDef = {
  id: "integers-with-a-given-number-of-binary-digits-and-ones",
  title: t("Integers with a given number of binary digits and ones", "给定二进制位数和 1 的个数的整数"),
  explanation: t(
    "The leading digit of a positive binary integer is always $1$, because a leading $0$ would simply not be written. So in an integer with $n$ digits and $k$ ones, one of the ones is already placed. The remaining $k - 1$ ones can occupy any of the other $n - 1$ positions, which gives a binomial coefficient with both numbers reduced by one. With $20$ digits and $3$ ones, the other two ones go among the last $19$ digits in $\\binom{19}{2} = 171$ ways.\n\n> **Watch out.** Choose $k - 1$ places among $n - 1$, not $k$ among $n$: the leading place is not free, since it must hold a $1$.",
    "正二进制整数的最高位总是 $1$，因为最高位的 $0$ 根本不会写出来。所以在 $n$ 位、含 $k$ 个 1 的整数中，已经有一个 1 的位置确定了。其余 $k - 1$ 个 1 可以占据另外 $n - 1$ 个位置中的任意位置，于是得到两个数都减一的二项式系数。$20$ 位、含 $3$ 个 1 时，另外两个 1 放在后 $19$ 位中，有 $\\binom{19}{2} = 171$ 种方法。\n\n> **注意。** 要在 $n - 1$ 个位置中选 $k - 1$ 个，而不是在 $n$ 个中选 $k$ 个：最高位不是自由的，它必须是 $1$。",
  ),
  generate(rng) {
    const n = rng.int(3, 16);
    const k = rng.int(1, n);
    const answer = binom(n - 1, k - 1);
    return numberProblem({
      prompt: t(
        `How many positive integers have exactly $${n}$ binary digits, with no leading zeros, of which exactly $${k}$ ${k === 1 ? "is" : "are"} $1$?`,
        `有多少个正整数恰有 $${n}$ 位二进制数字（最高位不为零），其中恰有 $${k}$ 个 $1$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          binom(n, k),
          `That chooses $${k}$ places among all $${n}$, allowing a leading $0$.`,
          `那是在全部 $${n}$ 位中选 $${k}$ 个，允许了最高位为 $0$。`,
        ),
        why(
          2 ** (n - 1),
          `That counts every $${n}$-digit integer, whatever its number of ones.`,
          `那数的是所有 $${n}$ 位整数，不管其中有几个 1。`,
        ),
        ...(k < n
          ? [
              why(
                binom(n - 1, k),
                `That puts all $${k}$ ones among the last $${n - 1}$ digits, forgetting the $1$ already in front.`,
                `那是把全部 $${k}$ 个 1 都放进后 $${n - 1}$ 位，忘了最高位已经是 $1$。`,
              ),
            ]
          : []),
        why(n - 1, "That counts the free places, not the ways to fill them.", "那数的是可自由选择的位置，而不是填法。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Place the leading one", "放好最高位的 1"],
            t(
              k === 1
                ? `The first digit is $1$, and no ones are left for the other $${n - 1}$ digits.`
                : `The first digit is $1$, leaving $${k - 1}$ ${k === 2 ? "one" : "ones"} for the other $${n - 1}$ digits.`,
              k === 1 ? `最高位是 $1$，其余 $${n - 1}$ 位不再有 1。` : `最高位是 $1$，其余 $${n - 1}$ 位中还要放 $${k - 1}$ 个 1。`,
            ),
          ],
          [
            ["Choose their places", "选出它们的位置"],
            t(`$\\binom{${n - 1}}{${k - 1}} = ${answer}$.`, `$\\binom{${n - 1}}{${k - 1}} = ${answer}$。`),
          ],
        ],
        k === 1
          ? t(
              `The only such integer is $2^{${n - 1}}$, a $1$ followed by $${n - 1}$ zeros.`,
              `唯一这样的整数是 $2^{${n - 1}}$，即 $1$ 后跟 $${n - 1}$ 个零。`,
            )
          : k === n
            ? t(`The only such integer is $2^{${n}} - 1$, all ones.`, `唯一这样的整数是 $2^{${n}} - 1$，全是 1。`)
            : t(
                `Choosing instead the places of the $${n - k}$ zeros among the last $${n - 1}$ digits gives $\\binom{${n - 1}}{${n - k}} = ${answer}$ as well.`,
                `改为在后 $${n - 1}$ 位中选出 $${n - k}$ 个零的位置，同样得 $\\binom{${n - 1}}{${n - k}} = ${answer}$。`,
              ),
      ),
    });
  },
};

const dividingByPowerOfTwo: KnowledgePointDef = {
  id: "dividing-by-a-power-of-two-in-binary",
  title: t("Dividing by a power of two in binary", "二进制中除以 2 的幂"),
  explanation: t(
    "Dividing by $2$ in binary moves every digit one place to the right, just as dividing by $10$ does in decimal. So dividing by $2^k$, which is written as a $1$ followed by $k$ zeros, removes the last $k$ digits of the number. Those digits form the remainder, and the digits left over form the quotient. No long division is needed at all. Dividing $\\mathrm{10110111001}_{2} = 1465$ by $\\mathrm{10000000}_{2} = 2^7$ cuts off the last seven digits $\\mathrm{0111001}_{2} = 57$, leaving the quotient $\\mathrm{1011}_{2} = 11$; indeed $128 \\cdot 11 + 57 = 1465$.\n\n> **Watch out.** Cut off as many digits as the divisor has zeros, not as many as it has digits. The digits cut off are the remainder, not the quotient.",
    "在二进制中除以 $2$，就是把每一位右移一位，正如十进制中除以 $10$。所以除以 $2^k$（写作 $1$ 后跟 $k$ 个零），就是去掉数的最后 $k$ 位。这些位构成余数，留下的位构成商。根本不需要长除法。$\\mathrm{10110111001}_{2} = 1465$ 除以 $\\mathrm{10000000}_{2} = 2^7$，去掉最后七位 $\\mathrm{0111001}_{2} = 57$，留下商 $\\mathrm{1011}_{2} = 11$；确实 $128 \\cdot 11 + 57 = 1465$。\n\n> **注意。** 去掉的位数等于除数中零的个数，而不是除数的位数。去掉的那些位是余数，不是商。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const x = rng.int(100, 4000);
    const divisor = 2 ** k;
    const answer = Math.floor(x / divisor);
    const r = x % divisor;
    const bits = x.toString(2);
    return numberProblem({
      prompt: t(
        `Find the quotient, ignoring the remainder, when $${binary(x)}$ is divided by $${binary(divisor)}$. Write it in decimal.`,
        `求 $${binary(x)}$ 除以 $${binary(divisor)}$ 的商（不计余数）。用十进制表示。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          Math.floor(x / 2 ** (k - 1)),
          `That cuts off only $${k - 1}$ digits, but the divisor has $${k}$ zeros.`,
          `那只去掉了 $${k - 1}$ 位，但除数有 $${k}$ 个零。`,
        ),
        why(
          Math.floor(x / 2 ** (k + 1)),
          `That cuts off $${k + 1}$ digits, counting the $1$ of the divisor as well as its zeros.`,
          `那去掉了 $${k + 1}$ 位，把除数的 $1$ 也和零一起算上了。`,
        ),
        why(r, "That is the remainder, made by the digits cut off, not the quotient.", "那是余数，由去掉的那些位组成，而不是商。"),
        why(
          x * divisor,
          `That multiplies, appending $${k}$ zeros instead of cutting off digits.`,
          `那是做了乘法，添上 $${k}$ 个零，而不是去掉若干位。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Read the divisor", "读出除数"],
            t(
              `$${binary(divisor)} = 2^{${k}}$, a $1$ followed by $${k}$ zeros, so cut off the last $${k}$ digits.`,
              `$${binary(divisor)} = 2^{${k}}$，即 $1$ 后跟 $${k}$ 个零，所以去掉最后 $${k}$ 位。`,
            ),
          ],
          [
            ["Cut off the digits", "去掉这些位"],
            t(
              `$\\mathrm{${bits}}_{2}$ splits into $\\mathrm{${bits.slice(0, -k)}}_{2}$ and the remainder $\\mathrm{${bits.slice(-k)}}_{2} = ${r}$.`,
              `$\\mathrm{${bits}}_{2}$ 分成 $\\mathrm{${bits.slice(0, -k)}}_{2}$ 和余数 $\\mathrm{${bits.slice(-k)}}_{2} = ${r}$。`,
            ),
          ],
          [["Convert the quotient", "把商化成十进制"], t(`$${binary(answer)} = ${answer}$.`, `$${binary(answer)} = ${answer}$。`)],
        ],
        t(
          `$${answer === 1 ? divisor : `${divisor} \\cdot ${answer}`}${r === 0 ? "" : ` + ${r}`} = ${x}$, which is $${binary(x)}$.`,
          `$${answer === 1 ? divisor : `${divisor} \\cdot ${answer}`}${r === 0 ? "" : ` + ${r}`} = ${x}$，正是 $${binary(x)}$。`,
        ),
      ),
    });
  },
};

const hexOnes: KnowledgePointDef = {
  id: "counting-the-ones-of-a-hexadecimal-number",
  title: t("Counting the ones of a hexadecimal number", "计算十六进制数中 1 的个数"),
  explanation: t(
    "Each hexadecimal digit corresponds to exactly four binary digits, because $16 = 2^4$. So a hexadecimal numeral converts to binary one digit at a time, with no carrying and no arithmetic on the whole number. This makes questions about individual bits easy to answer. In particular, the number of ones in the whole number is the sum of the counts for each digit. For $\\mathrm{3E09C1}_{16} = \\mathrm{0011\\ 1110\\ 0000\\ 1001\\ 1100\\ 0001}_{2}$ the counts are $2 + 3 + 0 + 2 + 2 + 1 = 10$.\n\n> **Watch out.** Count the ones in each digit's four bits, not the digits or their values: $\\mathrm{F}$ holds four ones, while $8$ holds just one.",
    "每个十六进制数字恰好对应四个二进制数字，因为 $16 = 2^4$。所以十六进制数可以逐位转换成二进制，不需要进位，也不需要对整个数做运算。这使得关于单个位的问题很容易回答。特别地，整个数中 1 的个数，就是每个数字对应个数的和。$\\mathrm{3E09C1}_{16} = \\mathrm{0011\\ 1110\\ 0000\\ 1001\\ 1100\\ 0001}_{2}$ 各位的个数是 $2 + 3 + 0 + 2 + 2 + 1 = 10$。\n\n> **注意。** 要数每个数字四位中的 1，而不是数数字的个数或它们的值：$\\mathrm{F}$ 有四个 1，而 $8$ 只有一个。",
  ),
  generate(rng) {
    const length = rng.int(3, 5);
    const digits = range(1, length).map((i) => (i === 1 ? rng.int(1, 15) : rng.int(0, 15)));
    const numeral = digits.map((d) => d.toString(16).toUpperCase()).join("");
    const counts = digits.map((d) => d.toString(2).split("0").join("").length);
    const answer = counts.reduce((a, b) => a + b, 0);
    const parts = digits.map((d) => d.toString(2).padStart(4, "0")).join("\\ ");
    const digitSum = digits.reduce((a, b) => a + b, 0);
    return numberProblem({
      prompt: t(
        `How many of the binary digits of $\\mathrm{${numeral}}_{16}$ are $1$?`,
        `$\\mathrm{${numeral}}_{16}$ 的二进制数字中有多少个 $1$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(4 * length, "That counts every bit, zeros included.", "那是把所有位都数了，包括零。"),
        why(4 * length - answer, "That counts the zeros instead of the ones.", "那数的是零而不是 1。"),
        why(
          length,
          "That counts the hexadecimal digits, not the ones in their bits.",
          "那数的是十六进制数字的个数，而不是它们各位中的 1。",
        ),
        why(digitSum, "That adds the values of the digits instead of counting their ones.", "那是把各数字的值相加，而不是数它们中的 1。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Convert digit by digit", "逐位转换"],
            t(`$\\mathrm{${numeral}}_{16} = \\mathrm{${parts}}_{2}$.`, `$\\mathrm{${numeral}}_{16} = \\mathrm{${parts}}_{2}$。`),
          ],
          [["Add the counts", "把个数相加"], t(`$${counts.join(" + ")} = ${answer}$.`, `$${counts.join(" + ")} = ${answer}$。`)],
        ],
        t(
          `There are $${4 * length - answer}$ zeros, and $${answer} + ${4 * length - answer} = ${4 * length}$ accounts for all $${length}$ groups of four bits.`,
          `零有 $${4 * length - answer}$ 个，而 $${answer} + ${4 * length - answer} = ${4 * length}$ 正好是 $${length}$ 组四位的总数。`,
        ),
      ),
    });
  },
};

const placesInPowerBase: KnowledgePointDef = {
  id: "the-number-of-places-of-a-fraction-in-a-power-of-two-base",
  title: t("The number of places of a fraction in a power of two base", "分数在 2 的幂进制下的位数"),
  explanation: t(
    "A fraction with odd numerator and denominator $2^k$ terminates after exactly $k$ places in base $2$. In base $4$ or base $8$, each digit stands for a block of two or three binary digits. So the binary places are grouped into blocks from the point, and a block that is only partly filled still needs a digit. That is why the count rounds up. In base $16$, with blocks of four, $\\frac{3}{2^{10}}$ has $10$ binary places and so $3$ places: $\\frac{3}{1024} = \\frac{12}{16^3} = \\mathrm{0.00C}_{16}$.\n\n> **Watch out.** Round up, not down: a last block that is only partly filled still takes a digit. Group from the point, so the padding zeros go on the right.",
    "分子为奇数、分母为 $2^k$ 的分数，在二进制下恰好在 $k$ 位后终止。在四进制或八进制下，每个数字代表两个或三个二进制数字组成的一组。所以从小数点起把二进制位分组，只填了一部分的组仍然需要一个数字。这就是计数要向上取整的原因。在十六进制下每组四位，$\\frac{3}{2^{10}}$ 有 $10$ 个二进制位，所以有 $3$ 位：$\\frac{3}{1024} = \\frac{12}{16^3} = \\mathrm{0.00C}_{16}$。\n\n> **注意。** 要向上取整，而不是向下：只填了一部分的最后一组仍要占一位。从小数点起分组，所以补的零在右边。",
  ),
  generate(rng) {
    const k = rng.int(2, 12);
    const denominator = 2 ** k;
    const m = 2 * rng.int(0, denominator / 2 - 1) + 1;
    const block = rng.int(2, 3);
    const base = 2 ** block;
    const answer = Math.ceil(k / block);
    const down = Math.floor(k / block);
    const numerator = m * 2 ** (block * answer - k);
    return numberProblem({
      prompt: t(
        `How many digits does $\\frac{${m}}{${denominator}}$ have after the point when written in base $${base}$?`,
        `$\\frac{${m}}{${denominator}}$ 用 $${base}$ 进制写出时，小数点后有多少位？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          k,
          `That is the number of binary places, before grouping them in blocks of $${block}$.`,
          `那是二进制的位数，还没有按 $${block}$ 位一组分组。`,
        ),
        down === answer
          ? why(
              answer + 1,
              `That adds a block too many: the $${k}$ places fill exactly $${answer}$ blocks of $${block}$.`,
              `那多算了一组：$${k}$ 位恰好填满 $${answer}$ 组，每组 $${block}$ 位。`,
            )
          : why(
              down,
              "That rounds down, dropping the partly filled last block, which still needs a digit.",
              "那是向下取整，丢掉了只填了一部分的最后一组，而它仍需要一位。",
            ),
        why(k * block, "That multiplies by the block size instead of dividing by it.", "那是乘以每组的位数，而不是除以它。"),
        why(denominator, "That is the denominator, not a number of places.", "那是分母，而不是位数。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Count the binary places", "数二进制位"],
            t(
              `$${denominator} = 2^{${k}}$ and $${m}$ is odd, so there are $${k}$ places in base $2$.`,
              `$${denominator} = 2^{${k}}$，且 $${m}$ 是奇数，所以二进制下有 $${k}$ 位。`,
            ),
          ],
          [
            ["Group them", "分组"],
            t(
              `$${base} = 2^{${block}}$, so group the places in blocks of $${block}$: that takes $${answer}$ ${answer === 1 ? "block" : "blocks"}.`,
              `$${base} = 2^{${block}}$，所以按 $${block}$ 位一组分组：需要 $${answer}$ 组。`,
            ),
          ],
        ],
        t(
          `$\\frac{${m}}{${denominator}} = \\frac{${numerator}}{${pow(base, answer)}}$, and $${numerator}$ is not a multiple of $${base}$, so ${answer === 1 ? "the single place is" : `the last of the $${answer}$ places is`} not zero.`,
          `$\\frac{${m}}{${denominator}} = \\frac{${numerator}}{${pow(base, answer)}}$，而 $${numerator}$ 不是 $${base}$ 的倍数，所以${answer === 1 ? "这一位" : `这 $${answer}$ 位的最后一位`}不是零。`,
        ),
      ),
    });
  },
};

const affineDecrypt: KnowledgePointDef = {
  id: "decrypting-a-letter-of-an-affine-cipher",
  title: t("Decrypting a letter of an affine cipher", "解密仿射密码的字母"),
  explanation: t(
    "An affine cipher encrypts a letter number $x$ as $y = ax + b$ modulo $26$. To undo it, undo the steps in reverse order: subtract $b$, then multiply by the inverse of $a$ modulo $26$. The inverse exists exactly when $a$ is coprime to $26$, which is why only those values make usable keys. Dividing by $a$ as an ordinary fraction does not work. The same steps work for any alphabet: with $29$ symbols and $y = 3x + 7$, the ciphertext $4$ gives $4 - 7 = -3 \\equiv 26$, and $3^{-1} \\equiv 10$ since $30 \\equiv 1$, so $x \\equiv 10 \\cdot 26 = 260 \\equiv 28 \\pmod{29}$.\n\n> **Watch out.** Subtract $b$ first and multiply by $a^{-1}$ second. Multiplying first, or adding $b$, undoes the wrong steps.",
    "仿射密码把字母编号 $x$ 加密成模 $26$ 的 $y = ax + b$。要还原，就按相反的顺序撤销各步：先减去 $b$，再乘以 $a$ 模 $26$ 的逆。逆存在当且仅当 $a$ 与 $26$ 互素，所以只有这些值才能作为可用的密钥。像普通分数那样除以 $a$ 是行不通的。同样的步骤适用于任何字母表：$29$ 个符号、$y = 3x + 7$ 时，密文 $4$ 给出 $4 - 7 = -3 \\equiv 26$，而 $3^{-1} \\equiv 10$，因为 $30 \\equiv 1$，所以 $x \\equiv 10 \\cdot 26 = 260 \\equiv 28 \\pmod{29}$。\n\n> **注意。** 先减去 $b$，再乘以 $a^{-1}$。先做乘法，或者加上 $b$，撤销的就不是原来的步骤。",
  ),
  generate(rng) {
    const a = rng.pick([3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]);
    const b = rng.int(1, 25);
    const x = rng.int(0, 25);
    const y = (a * x + b) % 26;
    const inverse = range(1, 25).find((v) => (a * v) % 26 === 1) ?? 1;
    const difference = (((y - b) % 26) + 26) % 26;
    const product = inverse * difference;
    const encrypted = a * x + b;
    return numberProblem({
      prompt: t(
        `Letters are numbered $\\mathrm{A} = 0, \\dots, \\mathrm{Z} = 25$. A letter was encrypted as $x \\mapsto ${a}x + ${b} \\pmod{26}$, and the result is $${y}$. Find the original letter's number $x$.`,
        `字母编号为 $\\mathrm{A} = 0, \\dots, \\mathrm{Z} = 25$。一个字母按 $x \\mapsto ${a}x + ${b} \\pmod{26}$ 加密，结果是 $${y}$。求原字母的编号 $x$。`,
      ),
      answer: x,
      form: "integer",
      mistakes: [
        why(
          difference,
          `That subtracts $${b}$ but never multiplies by the inverse of $${a}$.`,
          `那是减去了 $${b}$，却没有乘以 $${a}$ 的逆。`,
        ),
        why((a * y + b) % 26, "That encrypts the ciphertext again instead of decrypting it.", "那是把密文又加密了一次，而不是解密。"),
        why(
          (inverse * y) % 26,
          `That multiplies by the inverse but forgets to subtract $${b}$ first.`,
          `那是乘了逆元，却忘了先减去 $${b}$。`,
        ),
        why((inverse * (y + b)) % 26, `That adds $${b}$ instead of subtracting it.`, `那是加上了 $${b}$，而不是减去它。`),
        why((x + 1) % 26, "That is one letter off; recheck the reduction modulo $26$.", "那差了一个字母；请重新检查模 $26$ 的约简。"),
      ].filter((m, i, all) => m.value !== x && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            [`Find the inverse of $${a}$`, `求 $${a}$ 的逆`],
            t(
              `$${a} \\cdot ${inverse} = ${a * inverse} = ${a * inverse === 27 ? "26" : `26 \\cdot ${(a * inverse - 1) / 26}`} + 1$, so $${a}^{-1} \\equiv ${inverse} \\pmod{26}$.`,
              `$${a} \\cdot ${inverse} = ${a * inverse} = ${a * inverse === 27 ? "26" : `26 \\cdot ${(a * inverse - 1) / 26}`} + 1$，所以 $${a}^{-1} \\equiv ${inverse} \\pmod{26}$。`,
            ),
          ],
          [
            [`Subtract $${b}$`, `减去 $${b}$`],
            t(
              `$${y} - ${b} = ${y - b}${y - b === difference ? "" : ` \\equiv ${difference}`}$.`,
              `$${y} - ${b} = ${y - b}${y - b === difference ? "" : ` \\equiv ${difference}`}$。`,
            ),
          ],
          [
            [`Multiply by $${inverse}$`, `乘以 $${inverse}$`],
            t(
              `$x \\equiv ${inverse} \\cdot ${difference} = ${product}${product === x ? "" : ` \\equiv ${x}`} \\pmod{26}$.`,
              `$x \\equiv ${inverse} \\cdot ${difference} = ${product}${product === x ? "" : ` \\equiv ${x}`} \\pmod{26}$。`,
            ),
          ],
        ],
        t(
          `Encrypting $x = ${x}$ gives $${a} \\cdot ${x} + ${b} = ${encrypted}${encrypted === y ? "" : ` \\equiv ${y}`} \\pmod{26}$, the given result.`,
          `加密 $x = ${x}$ 得 $${a} \\cdot ${x} + ${b} = ${encrypted}${encrypted === y ? "" : ` \\equiv ${y}`} \\pmod{26}$，正是给出的结果。`,
        ),
      ),
    });
  },
};

const partitionsIntoThree: KnowledgePointDef = {
  id: "partitions-into-exactly-three-parts",
  title: t("Partitions into exactly three parts", "恰好分成三部分的分拆"),
  explanation: t(
    "To count partitions of $n$ into exactly three parts, list them with $a \\ge b \\ge c \\ge 1$, so that each partition appears once. A useful shortcut is that the count equals $\\frac{n^2}{12}$ rounded to the nearest whole number. Compositions are a different thing: there, order matters and the count is $\\binom{n - 1}{2}$. Each partition corresponds to as many as six compositions. For $n = 42$, $\\frac{1764}{12} = 147$ partitions, while there are $\\binom{41}{2} = 820$ compositions.\n\n> **Watch out.** Round $\\frac{n^2}{12}$ to the nearest whole number, not always up or always down; and $\\binom{n-1}{2}$ counts ordered sums, not partitions.",
    "要计算 $n$ 恰好分成三部分的分拆数，就按 $a \\ge b \\ge c \\ge 1$ 列出，使每个分拆只出现一次。一个有用的捷径是，这个个数等于 $\\frac{n^2}{12}$ 四舍五入到最接近的整数。有序分解是另一回事：那里顺序有关，个数是 $\\binom{n - 1}{2}$。每个分拆最多对应六个有序分解。对 $n = 42$，分拆有 $\\frac{1764}{12} = 147$ 个，而有序分解有 $\\binom{41}{2} = 820$ 个。\n\n> **注意。** $\\frac{n^2}{12}$ 要四舍五入到最接近的整数，不能总是向上或总是向下取整；$\\binom{n-1}{2}$ 计数的是有序和，不是分拆。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const answer = Math.round((n * n) / 12);
    const q = Math.floor((n * n) / 12);
    const r = (n * n) % 12;
    return numberProblem({
      prompt: t(
        `In how many ways can ${n} be written as a sum of exactly 3 positive integers, if order does not matter?`,
        `不计顺序，${n} 有多少种方法写成恰好 3 个正整数之和？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          binom(n - 1, 2),
          "That counts ordered sums, the compositions; a partition ignores order.",
          "那是数了有序和，即有序分解；分拆不计顺序。",
        ),
        why(Math.floor(n / 2), "That counts partitions into two parts, not three.", "那是分成两部分的分拆数，不是三部分。"),
        why(Math.ceil((n * n) / 12), "That rounds up; round to the nearest whole number.", "那是向上取整；应四舍五入到最接近的整数。"),
        why(Math.floor((n * n) / 12), "That rounds down; round to the nearest whole number.", "那是向下取整；应四舍五入到最接近的整数。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Divide the square by 12", "平方除以 12"],
            r === 0
              ? t(`$\\frac{${n * n}}{12} = ${q}$.`, `$\\frac{${n * n}}{12} = ${q}$。`)
              : t(
                  `$\\frac{${n * n}}{12}$ is $${q}$ and $\\frac{${r}}{12}$, which is ${2 * r > 12 ? "more" : "less"} than one half.`,
                  `$\\frac{${n * n}}{12}$ 等于 $${q}$ 加 $\\frac{${r}}{12}$，${2 * r > 12 ? "大于" : "小于"}一半。`,
                ),
          ],
          [["Round", "取整"], t(`The nearest whole number is $${answer}$.`, `最接近的整数是 $${answer}$。`)],
        ],
        t(
          `Partitions with a part equal to one number $p(${n - 1}, 2) = ${Math.floor((n - 1) / 2)}$, and the rest, less one in each part, number $p(${n - 3}, 3) = ${Math.round(((n - 3) * (n - 3)) / 12)}$: $${Math.floor((n - 1) / 2)} + ${Math.round(((n - 3) * (n - 3)) / 12)} = ${answer}$.`,
          `含有部分为一的分拆有 $p(${n - 1}, 2) = ${Math.floor((n - 1) / 2)}$ 个，其余的每部分减一后有 $p(${n - 3}, 3) = ${Math.round(((n - 3) * (n - 3)) / 12)}$ 个：$${Math.floor((n - 1) / 2)} + ${Math.round(((n - 3) * (n - 3)) / 12)} = ${answer}$。`,
        ),
      ),
    });
  },
};

const twoUpperBounds: KnowledgePointDef = {
  id: "integer-solutions-with-two-upper-bounds",
  title: t("Integer solutions with two upper bounds", "带两个上界的整数解"),
  explanation: t(
    "Upper bounds are handled by inclusion and exclusion. Start from all nonnegative solutions, then subtract those that break the first bound and those that break the second. Breaking $x_1 \\le a$ means $x_1 \\ge a + 1$, and subtracting $a + 1$ from $x_1$ turns this into an ordinary count with a smaller total. Solutions that break both were subtracted twice, so add them back. For $x_1 + x_2 + x_3 = 22$ with $x_1 \\le 15$ and $x_2 \\le 12$: $\\binom{24}{2} = 276$ in all, $\\binom{8}{2} = 28$ with $x_1 \\ge 16$, $\\binom{11}{2} = 55$ with $x_2 \\ge 13$, and none break both since $16 + 13 > 22$, so $276 - 28 - 55 = 193$.\n\n> **Watch out.** Subtract the solutions that break each bound, both of them, and add back those that break both; and multiplying the ranges of $x_1$ and $x_2$ fails once a pair adds up to more than the total.",
    "上界用容斥原理处理。先取所有非负解，再减去违反第一个上界的解和违反第二个上界的解。违反 $x_1 \\le a$ 就是 $x_1 \\ge a + 1$，从 $x_1$ 中减去 $a + 1$，就化成总和更小的普通计数。同时违反两者的解被减了两次，所以要加回来。对 $x_1 + x_2 + x_3 = 22$，$x_1 \\le 15$，$x_2 \\le 12$：全部有 $\\binom{24}{2} = 276$ 组，$x_1 \\ge 16$ 的有 $\\binom{8}{2} = 28$ 组，$x_2 \\ge 13$ 的有 $\\binom{11}{2} = 55$ 组，因为 $16 + 13 > 22$，没有同时违反两者的解，所以是 $276 - 28 - 55 = 193$。\n\n> **注意。** 违反每个上界的解都要减去，两个都要减，再加回同时违反两者的解；当一对取值之和超过总数时，把 $x_1$ 与 $x_2$ 的取值范围相乘就不对了。",
  ),
  generate(rng) {
    const n = rng.int(8, 20);
    const a = rng.int(2, n - 1);
    const b = rng.int(2, n - 1);
    const count = (total: number) => (total < 0 ? 0 : binom(total + 2, 2));
    const all = count(n);
    const overA = count(n - a - 1);
    const overB = count(n - b - 1);
    const overBoth = count(n - a - b - 2);
    const answer = all - overA - overB + overBoth;
    const perX = range(0, Math.min(a, n)).map((x) => Math.min(b, n - x) + 1);
    return numberProblem({
      prompt: t(
        `How many solutions in nonnegative integers does $x_{1} + x_{2} + x_{3} = ${n}$ have with $x_{1} \\le ${a}$ and $x_{2} \\le ${b}$?`,
        `$x_{1} + x_{2} + x_{3} = ${n}$ 有多少组非负整数解满足 $x_{1} \\le ${a}$ 且 $x_{2} \\le ${b}$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(all, "That ignores both upper bounds.", "那是忽略了两个上界。"),
        why(all - overA, "That removes only the solutions that break the first bound.", "那是只去掉了违反第一个上界的解。"),
        why(all - overB, "That removes only the solutions that break the second bound.", "那是只去掉了违反第二个上界的解。"),
        why(
          all - overA - overB,
          "That forgets to add back the solutions that break both bounds, which were removed twice.",
          "那是忘了加回同时违反两个上界的解，它们被减了两次。",
        ),
        why(
          (a + 1) * (b + 1),
          "That multiplies the ranges of $x_1$ and $x_2$, but for some pairs $x_3$ would have to be negative.",
          "那是把 $x_1$ 与 $x_2$ 的取值范围相乘，但有些组合会使 $x_3$ 为负。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [["Count all solutions", "数全部解"], t(`$\\binom{${n + 2}}{2} = ${all}$.`, `$\\binom{${n + 2}}{2} = ${all}$。`)],
          [
            ["Count those breaking each bound", "数违反各上界的解"],
            t(
              `$x_1 \\ge ${a + 1}$ leaves a sum of $${n - a - 1}$: $${overA}$. $x_2 \\ge ${b + 1}$ leaves $${n - b - 1}$: $${overB}$. ${n - a - b - 2 < 0 ? `None break both, since $${a + 1} + ${b + 1} > ${n}$.` : `Both leave $${n - a - b - 2}$: $${overBoth}$.`}`,
              `$x_1 \\ge ${a + 1}$ 后和为 $${n - a - 1}$：$${overA}$ 组。$x_2 \\ge ${b + 1}$ 后和为 $${n - b - 1}$：$${overB}$ 组。${n - a - b - 2 < 0 ? `因为 $${a + 1} + ${b + 1} > ${n}$，没有同时违反两者的解。` : `两者都违反后和为 $${n - a - b - 2}$：$${overBoth}$ 组。`}`,
            ),
          ],
          [
            ["Combine", "合并"],
            t(`$${all} - ${overA} - ${overB} + ${overBoth} = ${answer}$.`, `$${all} - ${overA} - ${overB} + ${overBoth} = ${answer}$。`),
          ],
        ],
        t(
          `For each $x_1 = 0, \\dots, ${Math.min(a, n)}$, $x_2$ runs from $0$ to the smaller of $${b}$ and $${n} - x_1$, giving $${perX.join(" + ")} = ${answer}$.`,
          `对每个 $x_1 = 0, \\dots, ${Math.min(a, n)}$，$x_2$ 从 $0$ 取到 $${b}$ 与 $${n} - x_1$ 中较小的那个，得 $${perX.join(" + ")} = ${answer}$。`,
        ),
      ),
    });
  },
};

const coefficientSum: KnowledgePointDef = {
  id: "the-sum-of-the-coefficients-of-a-multinomial-expansion",
  title: t("The sum of the coefficients of a multinomial expansion", "多项式展开的系数和"),
  explanation: t(
    "Setting every variable equal to 1 turns each term of an expansion into its coefficient alone, so the expression's value at that point is the sum of all the coefficients. For $(2x - 3y + 6z)^3$, the bracket at $x = y = z = 1$ is $2 - 3 + 6 = 5$, so the coefficients add up to $5^3 = 125$, with no single term worked out.\n\n> **Watch out.** Combine the coefficients inside the bracket, signs included, before taking the power; raising each coefficient separately, or dropping the minus signs, gives a different number.",
    "令每个变量都等于 1，展开式的每一项就只剩下它的系数，所以这一点上的表达式的值就是所有系数之和。对 $(2x - 3y + 6z)^3$，在 $x = y = z = 1$ 处括号的值为 $2 - 3 + 6 = 5$，所以系数之和为 $5^3 = 125$，不必求出任何单独的项。\n\n> **注意。** 要先把括号内的系数连同符号合并，再求幂；把每个系数分别求幂，或者丢掉负号，都会得到别的数。",
  ),
  generate(rng) {
    const a = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const c = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const n = rng.int(2, 6);
    const sum = a + b + c;
    const answer = sum ** n;
    const size = Math.abs(a) + Math.abs(b) + Math.abs(c);
    const added = `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)} ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
    return numberProblem({
      prompt: t(
        `Find the sum of all the coefficients in the expansion of $(${poly([a, "x"], [b, "y"], [c, "z"])})^{${n}}$.`,
        `求 $(${poly([a, "x"], [b, "y"], [c, "z"])})^{${n}}$ 展开式中所有系数之和。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(size ** n, "That drops the minus signs of the coefficients.", "那是丢掉了系数的负号。"),
        why(sum * n, `That multiplies by $${n}$ instead of raising to the power $${n}$.`, `那是乘以 $${n}$，而不是取 $${n}$ 次方。`),
        why(
          a ** n + b ** n + c ** n,
          "That raises each coefficient separately; the bracket must be combined first.",
          "那是把每个系数分别求幂；应先合并括号。",
        ),
        why(3 ** n, "That treats every coefficient in the bracket as $1$.", "那是把括号内每个系数都当成了 $1$。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Set every variable to 1", "令每个变量为 1"],
            t(`At $x = y = z = 1$ the bracket is $${added} = ${sum}$.`, `在 $x = y = z = 1$ 处，括号的值为 $${added} = ${sum}$。`),
          ],
          [["Raise to the power", "求幂"], t(`$${inParens(sum)}^{${n}} = ${answer}$.`, `$${inParens(sum)}^{${n}} = ${answer}$。`)],
        ],
        Math.abs(sum) <= 1
          ? t(
              `Each of the $${n}$ factors equals $${sum}$ at that point, so their product is $${answer}$.`,
              `在该点 $${n}$ 个因子都等于 $${sum}$，所以乘积为 $${answer}$。`,
            )
          : t(
              `Each of the $${n}$ factors equals $${sum}$ at that point, and $${Array(n).fill(inParens(sum)).join(" \\cdot ")} = ${answer}$.`,
              `在该点 $${n}$ 个因子都等于 $${sum}$，而 $${Array(n).fill(inParens(sum)).join(" \\cdot ")} = ${answer}$。`,
            ),
      ),
    });
  },
};

const termsWithAllVariables: KnowledgePointDef = {
  id: "the-terms-of-a-multinomial-expansion-that-contain-every-variable",
  title: t("The terms of a multinomial expansion that contain every variable", "多项式展开中含所有变量的项"),
  explanation: t(
    "A term of $(x_1 + \\dots + x_k)^n$ is decided by its exponents, which are whole numbers adding to $n$. A term that contains every variable has all its exponents at least 1, so give each variable one copy first and share out the rest freely. In $(x_1 + \\dots + x_7)^{10}$, that leaves $3$ copies for $7$ variables: $\\binom{3 + 6}{6} = \\binom{9}{6} = 84$ terms.\n\n> **Watch out.** Hand out the $k$ required copies before using stars and bars; counting all $\\binom{n + k - 1}{k - 1}$ terms includes those with a missing variable.",
    "$(x_1 + \\dots + x_k)^n$ 的一项由它的指数决定，这些指数是和为 $n$ 的整数。含所有变量的项，所有指数都至少是 1，所以先给每个变量一份，再自由分配剩下的。在 $(x_1 + \\dots + x_7)^{10}$ 中，剩下 $3$ 份分给 $7$ 个变量：共 $\\binom{3 + 6}{6} = \\binom{9}{6} = 84$ 项。\n\n> **注意。** 用隔板法之前要先分掉必需的 $k$ 份；直接数全部 $\\binom{n + k - 1}{k - 1}$ 项会把缺少某个变量的项也算进去。",
  ),
  generate(rng) {
    const k = rng.int(3, 6);
    const n = rng.int(k, 20);
    const answer = binom(n - 1, k - 1);
    const bracket = range(1, k)
      .map((i) => `x_{${i}}`)
      .join(" + ");
    return numberProblem({
      prompt: t(
        `After like terms are collected, how many terms of the expansion of $(${bracket})^{${n}}$ contain all ${k} variables?`,
        `合并同类项后，$(${bracket})^{${n}}$ 的展开式中有多少项含全部 ${k} 个变量？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          binom(n + k - 1, k - 1),
          "That counts every term, including those with a missing variable.",
          "那是数了全部项，包括缺少某个变量的项。",
        ),
        why(
          binom(n, k - 1),
          `That shares out one copy too many; after giving each variable one, $${n - k}$ remain.`,
          `那是多分了一份；给每个变量一份之后剩下 $${n - k}$ 份。`,
        ),
        ...(n - k >= k - 1
          ? [
              why(
                binom(n - k, k - 1),
                "That chooses the bars among the stars only; the bars take positions of their own.",
                "那是只在星之间选隔板；隔板自己也占位置。",
              ),
            ]
          : []),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Give each variable one copy", "每个变量先分一份"],
            t(
              `That uses $${k}$ of the $${n}$, leaving $${n - k}$ to share freely.`,
              `这用掉 $${n}$ 中的 $${k}$ 份，剩下 $${n - k}$ 份自由分配。`,
            ),
          ],
          [
            ["Count with stars and bars", "用隔板法计数"],
            t(
              `$${n - k}$ stars and $${k - 1}$ bars: $\\binom{${n - k} + ${k - 1}}{${k - 1}} = \\binom{${n - 1}}{${k - 1}} = ${answer}$.`,
              `$${n - k}$ 颗星和 $${k - 1}$ 个隔板：$\\binom{${n - k} + ${k - 1}}{${k - 1}} = \\binom{${n - 1}}{${k - 1}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Equivalently, lay out $${n}$ objects in a row and cut it at $${k - 1}$ of the $${n - 1}$ gaps, so every part is nonempty: $\\binom{${n - 1}}{${k - 1}} = ${answer}$ again.`,
          `等价地，把 $${n}$ 个物体排成一行，在 $${n - 1}$ 个空隙中选 $${k - 1}$ 个切开，使每段都非空：同样得 $\\binom{${n - 1}}{${k - 1}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const graphsWithEdges: KnowledgePointDef = {
  id: "labeled-graphs-with-a-given-number-of-edges",
  title: t("Labeled graphs with a given number of edges", "给定边数的标号图"),
  explanation: t(
    "A simple graph on labeled vertices is decided by which pairs of vertices are joined. There are $\\binom{n}{2}$ pairs available, and a graph with exactly $m$ edges chooses $m$ of them. So the count is a binomial coefficient applied twice. Labeled means that two graphs with the same shape but different vertex names count as different, unlike counting graphs up to isomorphism. In the drawing, $4$ labeled vertices have $\\binom{4}{2} = 6$ pairs, so $\\binom{6}{2} = 15$ graphs have exactly $2$ edges, like the colored one. On $10$ labeled vertices there are $\\binom{10}{2} = 45$ pairs, so $\\binom{45}{3} = 14190$ graphs have exactly $3$ edges.\n\n> **Watch out.** Choose among the pairs of vertices, not among the vertices themselves, and choose exactly $m$ of them: $2^{\\binom{n}{2}}$ counts the graphs with any number of edges.",
    "标号顶点上的简单图，由哪些顶点对相连决定。可用的顶点对有 $\\binom{n}{2}$ 个，恰有 $m$ 条边的图从中选出 $m$ 个。所以计数用了两次二项式系数。标号意味着形状相同但顶点名称不同的两个图算作不同的图，这与同构意义下的计数不同。图中 $4$ 个标号顶点有 $\\binom{4}{2} = 6$ 个顶点对，所以恰有 $2$ 条边的图有 $\\binom{6}{2} = 15$ 个，彩色的就是其中之一。$10$ 个标号顶点有 $\\binom{10}{2} = 45$ 个顶点对，所以恰有 $3$ 条边的图有 $\\binom{45}{3} = 14190$ 个。\n\n> **注意。** 要在顶点对中选，而不是在顶点中选，而且恰好选 $m$ 个：$2^{\\binom{n}{2}}$ 数的是边数任意的图。",
  ),
  generate(rng) {
    const n = rng.int(3, 8);
    const pairs = binom(n, 2);
    const m = rng.int(1, pairs - 1);
    const answer = binom(pairs, m);
    return numberProblem({
      prompt: t(
        `How many simple graphs on ${n} labeled vertices have exactly ${m} ${m === 1 ? "edge" : "edges"}?`,
        `${n} 个标号顶点上，有多少个简单图恰有 ${m} 条边？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          2 ** pairs,
          "That counts the graphs with any number of edges; exactly the given number must be chosen.",
          "那是数了边数任意的图；必须恰好选出给定数目的边。",
        ),
        why(
          binom(n, Math.min(m, n)),
          "That chooses vertices; an edge is a pair of vertices, so choose among the pairs.",
          "那是在选顶点；边是顶点对，所以要在顶点对中选。",
        ),
        why(
          pairs,
          "That is the number of pairs available, not the number of ways to choose some of them.",
          "那是可用的顶点对数，不是从中选取的方法数。",
        ),
        why(
          pairs * m,
          "That multiplies; choosing a set of pairs calls for a binomial coefficient.",
          "那是相乘；选出一组顶点对要用二项式系数。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Count the pairs", "数顶点对"],
            t(`There are $\\binom{${n}}{2} = ${pairs}$ pairs of vertices.`, `一共有 $\\binom{${n}}{2} = ${pairs}$ 个顶点对。`),
          ],
          [
            ["Choose the edges", "选边"],
            t(
              `The graph chooses ${m} of them, in $\\binom{${pairs}}{${m}} = ${answer}$ ways.`,
              `图从中选出 ${m} 个，有 $\\binom{${pairs}}{${m}} = ${answer}$ 种方法。`,
            ),
          ],
        ],
        t(
          `Choosing instead the ${pairs - m} ${pairs - m === 1 ? "pair" : "pairs"} left out gives the same count, $\\binom{${pairs}}{${pairs - m}} = ${answer}$.`,
          `改为选出不连边的 ${pairs - m} 个顶点对，得到相同的个数 $\\binom{${pairs}}{${pairs - m}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const fewestVertices: KnowledgePointDef = {
  id: "the-fewest-vertices-for-a-given-maximum-degree",
  title: t("The fewest vertices for a given maximum degree", "给定最大度时的最少顶点数"),
  explanation: t(
    "The handshaking lemma gives a lower bound on the number of vertices. If no degree exceeds $d$, the sum of the degrees is at most $dn$, and it must equal $2m$. So $n \\ge \\frac{2m}{d}$, and since $n$ is a whole number, this rounds up. When $d$ is smaller than $n$, a graph with degrees as equal as possible reaches this bound. In the drawing, $6$ edges with no degree above $3$ need $n \\ge \\frac{12}{3} = 4$, and the complete graph on $4$ vertices reaches it. With $44$ edges and no degree above $3$, $n \\ge \\frac{88}{3}$, so at least $30$ vertices are needed.\n\n> **Watch out.** Use the degree sum $2m$, not $m$, and round up, not down: $29$ vertices of degree at most $3$ carry a degree sum of at most $87 < 88$.",
    "握手引理给出顶点数的下界。如果没有度超过 $d$，度数之和最多是 $dn$，而它必须等于 $2m$。所以 $n \\ge \\frac{2m}{d}$，由于 $n$ 是整数，要向上取整。当 $d$ 小于 $n$ 时，度数尽量相等的图可以达到这个下界。图中 $6$ 条边且没有度超过 $3$，需要 $n \\ge \\frac{12}{3} = 4$，$4$ 个顶点的完全图正好达到。有 $44$ 条边且没有度超过 $3$ 时，$n \\ge \\frac{88}{3}$，所以至少需要 $30$ 个顶点。\n\n> **注意。** 要用度数之和 $2m$，而不是 $m$；而且要向上取整，不能向下：$29$ 个度至多为 $3$ 的顶点，度数之和至多是 $87 < 88$。",
  ),
  generate(rng) {
    const n = rng.int(4, 20);
    const d = rng.int(2, n - 1);
    const m = rng.int(Math.floor(((n - 1) * d) / 2) + 1, Math.floor((n * d) / 2));
    const bound = Q.of(2 * m, d);
    return numberProblem({
      prompt: t(
        `A simple graph has ${m} edges, and no vertex has degree above ${d}. What is the fewest vertices it can have?`,
        `一个简单图有 ${m} 条边，没有顶点的度超过 ${d}。它最少有多少个顶点？`,
      ),
      answer: n,
      form: "integer",
      mistakes: [
        why(
          m,
          "That is the number of edges; the bound comes from the degree sum divided by the largest degree.",
          "那是边数；下界来自度数之和除以最大度。",
        ),
        why(d + 1, "That is only enough vertices for a single vertex of the largest degree.", "那只够一个顶点达到最大度。"),
        why(
          Math.floor(m / d),
          "That divides the edges, not the degree sum, by the largest degree.",
          "那是用边数而不是度数之和去除以最大度。",
        ),
        why(n + 1, "That is not the fewest: one vertex less still carries enough degree.", "那不是最少的：少一个顶点仍有足够的度数。"),
        why(
          n - 1,
          "That rounds down; too few vertices cannot carry the whole degree sum.",
          "那是向下取整；顶点太少，承担不了全部度数之和。",
        ),
      ].filter((w, i, all) => w.value !== n && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Bound the degree sum", "估计度数之和"],
            t(
              `The degrees add to ${2 * m} and each is at most ${d}, so the number of vertices is at least $${bound.toLatex()}$.`,
              `度数之和是 ${2 * m}，每个度最多是 ${d}，所以顶点数至少是 $${bound.toLatex()}$。`,
            ),
          ],
          [["Round up", "向上取整"], t(`The smallest whole number allowed is ${n}.`, `允许的最小整数是 ${n}。`)],
        ],
        t(
          `$${n - 1}$ vertices carry a degree sum of at most $${n - 1} \\cdot ${d} = ${(n - 1) * d} < ${2 * m}$, while $${n}$ vertices allow up to $${n} \\cdot ${d} = ${n * d} \\ge ${2 * m}$.`,
          `$${n - 1}$ 个顶点的度数之和至多为 $${n - 1} \\cdot ${d} = ${(n - 1) * d} < ${2 * m}$，而 $${n}$ 个顶点最多可达 $${n} \\cdot ${d} = ${n * d} \\ge ${2 * m}$。`,
        ),
      ),
    });
  },
};

const complementOfRegular: KnowledgePointDef = {
  id: "the-edges-of-the-complement-of-a-regular-graph",
  figure: discreteDrawings1["subgraphs-and-graph-complements#the-edges-of-the-complement-of-a-regular-graph"],
  title: t("The edges of the complement of a regular graph", "正则图补图的边数"),
  explanation: t(
    "In the complement of a simple graph, a vertex is joined to exactly the vertices it was not joined to, leaving out itself. So a vertex of degree $r$ on $n$ vertices has degree $n - 1 - r$ in the complement. The complement of a regular graph is therefore regular too, and the handshaking lemma gives its edges. The total with the original is always $\\binom{n}{2}$. The drawing shows the $2$-regular cycle on $5$ vertices and its complement, the star-shaped cycle, which is $5 - 1 - 2 = 2$-regular; each has $5$ edges, and $5 + 5 = 10 = \\binom{5}{2}$. The complement of a $7$-regular graph on $40$ vertices is $32$-regular, with $\\frac{40 \\cdot 32}{2} = 640$ edges.\n\n> **Watch out.** A vertex has $n - 1$ possible neighbors, not $n$, and the degree sum $n(n - 1 - r)$ must still be halved to give the edges.",
    "在简单图的补图中，一个顶点恰好与原来不相邻的顶点相连，不包括自身。所以 $n$ 个顶点的图中度为 $r$ 的顶点，在补图中的度是 $n - 1 - r$。因此正则图的补图也是正则的，握手引理给出它的边数。它与原图的边数之和总是 $\\binom{n}{2}$。图中是 $5$ 个顶点的 $2$-正则圈和它的补图，即星形的圈，它是 $5 - 1 - 2 = 2$-正则的；两者各有 $5$ 条边，$5 + 5 = 10 = \\binom{5}{2}$。$40$ 个顶点的 $7$-正则图，其补图是 $32$-正则的，有 $\\frac{40 \\cdot 32}{2} = 640$ 条边。\n\n> **注意。** 一个顶点有 $n - 1$ 个可能的邻点，而不是 $n$ 个；度数之和 $n(n - 1 - r)$ 还要减半才是边数。",
  ),
  generate(rng) {
    const n = rng.int(5, 30);
    const options = range(1, n - 2).filter((r) => (n * r) % 2 === 0);
    const r = rng.pick(options);
    const degree = n - 1 - r;
    const answer = (n * degree) / 2;
    const half = degree === 1 ? `\\frac{${n}}{2}` : `\\frac{${n} \\cdot ${degree}}{2}`;
    const own = (n * r) / 2;
    const ownHalf = r === 1 ? `\\frac{${n}}{2}` : `\\frac{${n} \\cdot ${r}}{2}`;
    return numberProblem({
      prompt: t(
        `A simple ${r}-regular graph has ${n} vertices. How many edges does its complement have?`,
        `一个 ${r}-正则简单图有 ${n} 个顶点。它的补图有多少条边？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(own, "That is the number of edges of the graph itself, not of its complement.", "那是原图本身的边数，不是补图的。"),
        why(
          binom(n, 2),
          "That counts every pair of vertices; the edges of the graph must be left out.",
          "那是数了所有顶点对；要去掉原图的边。",
        ),
        why(n * degree, "That is the degree sum of the complement; halve it to get the edges.", "那是补图的度数之和；要减半才得到边数。"),
        why(degree, "That is the degree of each vertex in the complement, not the number of edges.", "那是补图中每个顶点的度，不是边数。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the degree in the complement", "求补图中的度"],
            t(
              `Each vertex has degree $${n} - 1 - ${r} = ${degree}$ in the complement.`,
              `每个顶点在补图中的度是 $${n} - 1 - ${r} = ${degree}$。`,
            ),
          ],
          [
            ["Apply the handshaking lemma", "用握手引理"],
            t(`So the complement has $${half} = ${answer}$ edges.`, `所以补图有 $${half} = ${answer}$ 条边。`),
          ],
        ],
        t(
          `The graph itself has $${ownHalf} = ${own}$ edges, and $${own} + ${answer} = ${binom(n, 2)} = \\binom{${n}}{2}$, every pair of vertices.`,
          `原图有 $${ownHalf} = ${own}$ 条边，而 $${own} + ${answer} = ${binom(n, 2)} = \\binom{${n}}{2}$，正是所有顶点对。`,
        ),
      ),
    });
  },
};

const mostComponents: KnowledgePointDef = {
  id: "the-most-components-for-a-given-number-of-edges",
  figure: discreteDrawings1["connected-graphs#the-most-components-for-a-given-number-of-edges"],
  title: t("The most components for a given number of edges", "给定边数时的最多连通分支数"),
  explanation: t(
    "To get as many connected components as possible, keep the edges from joining new vertices. That means packing all $m$ edges into the smallest possible group of $k$ vertices, the smallest $k$ with $\\binom{k}{2} \\ge m$, and leaving all the other vertices isolated. The group counts as one component, and each isolated vertex counts as another. Spreading the edges out would only lower the count. In the drawing, $4$ edges on $7$ vertices need a group of $4$, since $\\binom{3}{2} = 3$ is too few and $\\binom{4}{2} = 6$ is enough, and the other $3$ vertices are isolated: $3 + 1 = 4$ components. With $40$ vertices and $10$ edges, $\\binom{5}{2} = 10$, so the edges fit on $5$ vertices and the other $35$ stay isolated: $35 + 1 = 36$ components.\n\n> **Watch out.** The group holding the edges is itself one component, so add $1$ to the isolated vertices; and the group needs $\\binom{k}{2} \\ge m$, not $k \\ge m$.",
    "要得到尽可能多的连通分支，就不要让边连接新的顶点。也就是把所有 $m$ 条边放进尽可能少的 $k$ 个顶点中（满足 $\\binom{k}{2} \\ge m$ 的最小 $k$），其余顶点都孤立。这一组算一个分支，每个孤立顶点各算一个。把边分散开只会使个数减少。图中 $7$ 个顶点上的 $4$ 条边需要 $4$ 个顶点的一组，因为 $\\binom{3}{2} = 3$ 不够，$\\binom{4}{2} = 6$ 够了，其余 $3$ 个顶点孤立：共 $3 + 1 = 4$ 个分支。有 $40$ 个顶点、$10$ 条边时，$\\binom{5}{2} = 10$，所以这些边放在 $5$ 个顶点上，其余 $35$ 个顶点孤立：共 $35 + 1 = 36$ 个分支。\n\n> **注意。** 容纳边的那一组本身是一个分支，所以要在孤立顶点数上加 $1$；而这一组需要满足 $\\binom{k}{2} \\ge m$，而不是 $k \\ge m$。",
  ),
  generate(rng) {
    const n = rng.int(6, 30);
    const m = rng.int(1, Math.min(binom(n - 1, 2), 60));
    const k = range(2, n).find((v) => binom(v, 2) >= m) ?? n;
    const answer = n - k + 1;
    return numberProblem({
      prompt: t(
        `A simple graph has ${n} vertices and ${m} ${m === 1 ? "edge" : "edges"}. What is the largest number of connected components it can have?`,
        `一个简单图有 ${n} 个顶点、${m} 条边。它最多有多少个连通分支？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          Math.max(n - m, 1),
          "That spreads the edges out as a forest; packing them onto few vertices leaves more vertices isolated.",
          "那是把边分散成森林；把边集中在少数顶点上，孤立顶点会更多。",
        ),
        why(
          n,
          "That ignores the edges; each edge joins two vertices into one component.",
          "那是忽略了边；每条边都把两个顶点连成一个分支。",
        ),
        why(answer + 1, "That is one too many: the edges need a larger group of vertices.", "多了一：这些边需要更大的一组顶点。"),
        why(
          n - k,
          "That counts only the isolated vertices; the group holding the edges is one more component.",
          "那只数了孤立顶点；容纳边的那一组还是一个分支。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Pack the edges", "把边集中"],
            t(
              `The smallest group of vertices that holds ${m} ${m === 1 ? "edge" : "edges"} has ${k} vertices, since $\\binom{${k}}{2} = ${binom(k, 2)}$.`,
              `能容纳 ${m} 条边的最小顶点组有 ${k} 个顶点，因为 $\\binom{${k}}{2} = ${binom(k, 2)}$。`,
            ),
          ],
          [
            ["Count the components", "数分支"],
            t(
              `The other ${n - k} ${n - k === 1 ? "vertex stays" : "vertices stay"} isolated, which gives $${n - k} + 1 = ${answer}$ components.`,
              `其余 ${n - k} 个顶点保持孤立，于是有 $${n - k} + 1 = ${answer}$ 个分支。`,
            ),
          ],
        ],
        t(
          `${k === 2 ? "A single vertex holds" : `A group of $${k - 1}$ vertices holds`} at most $\\binom{${k - 1}}{2} = ${binom(k - 1, 2)} < ${m}$ edges, so the edges cannot fit on fewer vertices.`,
          `$${k - 1}$ 个顶点至多容纳 $\\binom{${k - 1}}{2} = ${binom(k - 1, 2)} < ${m}$ 条边，所以这些边放不进更少的顶点。`,
        ),
      ),
    });
  },
};

const treeCutVertices: KnowledgePointDef = {
  id: "the-cut-vertices-of-a-tree",
  figure: discreteDrawings1["cut-vertices-and-cut-edges#the-cut-vertices-of-a-tree"],
  title: t("The cut vertices of a tree", "树的割点"),
  explanation: t(
    "In a tree, each pair of vertices is joined by exactly one path. Removing a vertex of degree at least 2 cuts the path between two of its neighbors, so every such vertex is a cut vertex. Removing a leaf cannot disconnect anything, since no path passes through a leaf. So on three or more vertices, the cut vertices are exactly the vertices that are not leaves. The tree drawn has $6$ vertices and $4$ leaves, so its $6 - 4 = 2$ other vertices, highlighted, are the cut vertices. A tree on $60$ vertices with $25$ leaves has $60 - 25 = 35$ cut vertices.\n\n> **Watch out.** Count cut vertices, not cut edges: every one of the $n - 1$ edges of a tree is a cut edge, but the leaves are never cut vertices.",
    "在树中，每对顶点恰好由一条路径相连。去掉度至少为 2 的顶点，会切断它的两个邻点之间的路径，所以每个这样的顶点都是割点。去掉叶子不会使任何东西断开，因为没有路径经过叶子。所以在三个或更多顶点上，割点恰好就是不是叶子的顶点。图中的树有 $6$ 个顶点、$4$ 片叶子，所以其余 $6 - 4 = 2$ 个突出显示的顶点就是割点。有 $60$ 个顶点、$25$ 片叶子的树有 $60 - 25 = 35$ 个割点。\n\n> **注意。** 要数的是割点，不是割边：树的 $n - 1$ 条边每条都是割边，但叶子绝不是割点。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const leaves = rng.int(2, n - 1);
    const answer = n - leaves;
    const rest = 2 * (n - 1) - leaves;
    return numberProblem({
      prompt: t(
        `A tree has ${n} vertices, and ${leaves} of them are leaves. How many cut vertices does it have?`,
        `一棵树有 ${n} 个顶点，其中 ${leaves} 个是叶子。它有多少个割点？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(leaves, "That counts the leaves, which are never cut vertices.", "那是数了叶子，而叶子绝不是割点。"),
        why(
          n - 1,
          "That is the number of edges, all of them cut edges; the question asks for cut vertices.",
          "那是边数，它们都是割边；题目问的是割点。",
        ),
        why(
          answer + 1,
          "That is one too many: only the vertices that are not leaves are cut vertices.",
          "多了一：只有非叶子顶点才是割点。",
        ),
        why(n, "That counts every vertex; removing a leaf leaves the tree connected.", "那是数了所有顶点；去掉叶子后树仍连通。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Identify the cut vertices", "找出割点"],
            t(
              "Removing a vertex of degree at least 2 separates two of its neighbors, while removing a leaf disconnects nothing, so the cut vertices are the non-leaves.",
              "去掉度至少为 2 的顶点会把它的两个邻点分开，而去掉叶子不会使任何东西断开，所以割点就是非叶子顶点。",
            ),
          ],
          [["Count them", "数一数"], t(`$${n} - ${leaves} = ${answer}$.`, `$${n} - ${leaves} = ${answer}$。`)],
        ],
        t(
          `The degrees of a tree add to $2 \\cdot ${n - 1} = ${2 * (n - 1)}$, so the non-leaves carry $${2 * (n - 1)} - ${leaves} = ${rest}$, at least $2$ each: $${rest} \\ge ${answer === 1 ? "2" : `2 \\cdot ${answer} = ${2 * answer}`}$.`,
          `树的度数之和为 $2 \\cdot ${n - 1} = ${2 * (n - 1)}$，所以非叶子顶点的度数之和为 $${2 * (n - 1)} - ${leaves} = ${rest}$，每个至少为 $2$：$${rest} \\ge ${answer === 1 ? "2" : `2 \\cdot ${answer} = ${2 * answer}`}$。`,
        ),
      ),
    });
  },
};

const fullTreeLeaves: KnowledgePointDef = {
  id: "the-leaves-of-a-full-tree",
  figure: discreteDrawings1["trees-and-forests#the-leaves-of-a-full-tree"],
  title: t("The leaves of a full tree", "满树的叶子"),
  explanation: t(
    "In a full $m$-ary tree, each internal vertex has exactly $m$ children. Every vertex except the root is a child of exactly one internal vertex, so with $i$ internal vertices the tree has $mi + 1$ vertices. Subtracting the internal ones leaves $(m - 1)i + 1$ leaves. The depth and shape of the tree play no part, so very different trees give the same count. The drawing shows two full binary trees of different shapes, each with $3$ internal vertices and so $(2 - 1) \\cdot 3 + 1 = 4$ leaves. A full $10$-ary tree with $50$ internal vertices has $10 \\cdot 50 + 1 = 501$ vertices and $501 - 50 = 451$ leaves.\n\n> **Watch out.** The $+ 1$ is the root, the one vertex that is nobody's child; and subtract the internal vertices from the total, since the leaves are what remains.",
    "在满 $m$ 叉树中，每个内部顶点恰有 $m$ 个孩子。除根以外的每个顶点都恰好是一个内部顶点的孩子，所以有 $i$ 个内部顶点的树共有 $mi + 1$ 个顶点。减去内部顶点，剩下 $(m - 1)i + 1$ 片叶子。树的深度和形状都不起作用，所以差别很大的树也给出相同的个数。图中是两棵形状不同的满二叉树，各有 $3$ 个内部顶点，所以各有 $(2 - 1) \\cdot 3 + 1 = 4$ 片叶子。有 $50$ 个内部顶点的满 $10$ 叉树共有 $10 \\cdot 50 + 1 = 501$ 个顶点，叶子有 $501 - 50 = 451$ 片。\n\n> **注意。** 其中的 $+ 1$ 是根，它是唯一不是任何顶点孩子的顶点；叶子是总数减去内部顶点后剩下的部分。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const i = rng.int(1, 40);
    const answer = (m - 1) * i + 1;
    const children = i === 1 ? `${m}` : `${m} \\cdot ${i}`;
    const factors = [m - 1, i].filter((f) => f !== 1);
    const product = factors.length === 0 ? "1" : factors.join(" \\cdot ");
    const formula = factors.length < 2 ? `${product} + 1` : `${product} + 1 = ${(m - 1) * i} + 1`;
    return numberProblem({
      prompt: t(
        `In a rooted tree, every internal vertex has exactly ${m} children, and there are ${i} internal ${i === 1 ? "vertex" : "vertices"}. How many leaves does it have?`,
        `在一棵有根树中，每个内部顶点恰有 ${m} 个孩子，共有 ${i} 个内部顶点。它有多少片叶子？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(m * i + 1, "That is the number of all vertices; the internal ones are not leaves.", "那是所有顶点的个数；内部顶点不是叶子。"),
        why(
          m * i,
          "That counts every child; some children are internal vertices themselves.",
          "那是数了所有孩子；有些孩子本身就是内部顶点。",
        ),
        why(
          (m - 1) * i,
          "That leaves out the root, the one vertex that is nobody's child.",
          "那是漏掉了根，它是唯一不是任何顶点孩子的顶点。",
        ),
        why(i + 1, `That gives each internal vertex one child; it has ${m}.`, `那是让每个内部顶点只有一个孩子；它有 ${m} 个。`),
      ].filter((w, k, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === k),
      solution: walked(
        [
          [
            ["Count all the vertices", "数所有顶点"],
            t(
              `Every vertex but the root is a child, so the tree has $${children} + 1 = ${m * i + 1}$ vertices.`,
              `除根以外的每个顶点都是孩子，所以这棵树有 $${children} + 1 = ${m * i + 1}$ 个顶点。`,
            ),
          ],
          [
            ["Remove the internal vertices", "去掉内部顶点"],
            t(
              `Removing the ${i} internal ones leaves $${m * i + 1} - ${i} = ${answer}$.`,
              `去掉 ${i} 个内部顶点，剩下 $${m * i + 1} - ${i} = ${answer}$ 个。`,
            ),
          ],
        ],
        t(`The formula $(m - 1)i + 1$ gives $${formula} = ${answer}$ as well.`, `公式 $(m - 1)i + 1$ 同样给出 $${formula} = ${answer}$。`),
      ),
    });
  },
};

const traceOfCube: KnowledgePointDef = {
  id: "the-trace-of-the-cube-of-an-adjacency-matrix",
  figure: discreteDrawings2["adjacency-matrices#the-trace-of-the-cube-of-an-adjacency-matrix"],
  title: t("The trace of the cube of an adjacency matrix", "邻接矩阵立方的迹"),
  explanation: t(
    "The diagonal entry $(A^3)_{ii}$ counts the walks of length 3 that start and end at vertex $i$. In a simple graph, such a walk must go around a triangle. Each triangle gives six of these walks across the whole diagonal, since it can start at any of three corners and go in either of two directions. So the trace is six times the number of triangles. The drawing shows a graph with one triangle: each of its corners has diagonal entry $2$, the pendant vertex has $0$, and the trace is $6$. The complete graph on $6$ vertices has $\\binom{6}{3} = 20$ triangles, so its trace is $6 \\cdot 20 = 120$.\n\n> **Watch out.** Each triangle counts six times, not once and not three times: three starting corners, each with two directions. And $\\operatorname{tr}(A^2)$, twice the number of edges, is a different count.",
    "对角元 $(A^3)_{ii}$ 计算从顶点 $i$ 出发并回到 $i$、长度为 3 的路线。在简单图中，这样的路线必须绕一个三角形。每个三角形在整条对角线上给出六条这样的路线，因为可以从三个角中任一个出发，并沿两个方向之一行走。所以迹是三角形个数的六倍。图中的图有一个三角形：三角形每个角的对角元为 $2$，悬挂顶点为 $0$，迹为 $6$。$6$ 个顶点的完全图有 $\\binom{6}{3} = 20$ 个三角形，所以它的迹是 $6 \\cdot 20 = 120$。\n\n> **注意。** 每个三角形算六次，不是一次，也不是三次：三个出发的角，每个有两个方向。而 $\\operatorname{tr}(A^2)$ 等于边数的两倍，是另一种计数。",
  ),
  generate(rng) {
    const size = 5;
    const grid = range(1, size).map(() => range(1, size).map(() => 0));
    const link = (i: number, j: number, on: number) => {
      const row = grid[i];
      const other = grid[j];
      if (row && other) {
        row[j] = on;
        other[i] = on;
      }
    };
    for (const i of range(0, size - 1)) {
      for (const j of range(i + 1, size - 1)) link(i, j, rng.int(0, 1));
    }
    link(0, 1, 1);
    link(1, 2, 1);
    link(0, 2, 1);
    const at = (i: number, j: number) => grid[i]?.[j] ?? 0;
    let triangles = 0;
    for (const i of range(0, size - 1)) {
      for (const j of range(i + 1, size - 1)) {
        for (const k of range(j + 1, size - 1)) triangles += at(i, j) * at(j, k) * at(i, k);
      }
    }
    const edges = grid.flat().reduce((a, b) => a + b, 0) / 2;
    const answer = 6 * triangles;
    const corners = range(0, size - 1).flatMap((i) =>
      range(i + 1, size - 1).flatMap((j) =>
        range(j + 1, size - 1)
          .filter((k) => at(i, j) * at(j, k) * at(i, k) === 1)
          .map((k) => [i, j, k] as const),
      ),
    );
    const listed = corners.map(([i, j, k]) => `\\{${i + 1}, ${j + 1}, ${k + 1}\\}`).join(",\\ ");
    const diagonal = range(0, size - 1).map((v) => 2 * corners.filter((c) => c.includes(v)).length);
    return numberProblem({
      prompt: t(
        `A simple graph has adjacency matrix $A = ${matrix(grid)}$. Find $\\operatorname{tr}(A^3)$.`,
        `一个简单图的邻接矩阵是 $A = ${matrix(grid)}$。求 $\\operatorname{tr}(A^3)$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(triangles, "That is the number of triangles; each one gives six closed walks.", "那是三角形的个数；每个三角形给出六条闭途径。"),
        why(
          3 * triangles,
          "That counts the three starting corners but not the two directions around each triangle.",
          "那数了三个出发的角，却没有算绕三角形的两个方向。",
        ),
        why(
          2 * edges,
          "That is $\\operatorname{tr}(A^2)$, twice the number of edges, not the closed walks of length 3.",
          "那是 $\\operatorname{tr}(A^2)$，即边数的两倍，不是长度为 3 的闭途径。",
        ),
        why(answer + 1, "The trace must be a multiple of $6$: recount the triangles.", "迹一定是 $6$ 的倍数：重新数三角形。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Find the triangles", "找出三角形"],
            t(
              `Numbering the vertices $1$ to $5$ by the rows, the triples joined in pairs are $${listed}$: ${triangles} ${triangles === 1 ? "triangle" : "triangles"}.`,
              `按行把顶点编号为 $1$ 到 $5$，两两相连的三元组为 $${listed}$：共 ${triangles} 个三角形。`,
            ),
          ],
          [
            ["Count six walks each", "每个算六条途径"],
            t(
              triangles === 1
                ? `The triangle gives $3$ starting corners times $2$ directions, so the trace is $${answer}$.`
                : `Each triangle gives $3$ starting corners times $2$ directions, so the trace is $6 \\cdot ${triangles} = ${answer}$.`,
              triangles === 1
                ? `这个三角形有 $3$ 个出发的角，每个 $2$ 个方向，所以迹是 $${answer}$。`
                : `每个三角形有 $3$ 个出发的角，每个 $2$ 个方向，所以迹是 $6 \\cdot ${triangles} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Vertex by vertex, $(A^3)_{ii}$ is twice the number of triangles at $i$: $${diagonal.join(" + ")} = ${answer}$.`,
          `逐个顶点看，$(A^3)_{ii}$ 是含 $i$ 的三角形个数的两倍：$${diagonal.join(" + ")} = ${answer}$。`,
        ),
      ),
    });
  },
};

const pathDistanceSum: KnowledgePointDef = {
  id: "the-sum-of-the-distance-matrix-of-a-path",
  title: t("The sum of the distance matrix of a path", "路径图距离矩阵的元素和"),
  explanation: t(
    "On a path with $n$ vertices, there are $n - d$ pairs of vertices at distance $d$. So the distances between unordered pairs add to $\\sum_{d = 1}^{n - 1} d(n - d) = \\binom{n + 1}{3}$. A distance matrix records each pair twice, once above the diagonal and once below it, while the diagonal itself is all zeros. The sum of all its entries is therefore double this total. On a path with $40$ vertices the pairs add to $\\binom{41}{3} = 10660$, so the distance matrix sums to $2 \\cdot 10660 = 21320$.\n\n> **Watch out.** Double the total over pairs, since the matrix lists each pair above and below the diagonal. And the distances are not all $1$: only the $n - 1$ neighboring pairs are at distance $1$.",
    "在 $n$ 个顶点的路径上，距离为 $d$ 的顶点对有 $n - d$ 个。所以无序顶点对的距离之和是 $\\sum_{d = 1}^{n - 1} d(n - d) = \\binom{n + 1}{3}$。距离矩阵把每对记录两次，对角线上方一次，下方一次，而对角线全是零。因此它所有元素之和是这个总数的两倍。在有 $40$ 个顶点的路径上，各对距离之和为 $\\binom{41}{3} = 10660$，所以距离矩阵之和为 $2 \\cdot 10660 = 21320$。\n\n> **注意。** 要把各对的总和加倍，因为矩阵在对角线上方和下方各列一次每对顶点。而且距离并不都是 $1$：只有 $n - 1$ 对相邻顶点的距离是 $1$。",
  ),
  generate(rng) {
    const n = rng.int(3, 30);
    const half = binom(n + 1, 3);
    const answer = 2 * half;
    return numberProblem({
      prompt: t(
        `A path graph has ${n} vertices. Find the sum of all the entries of its distance matrix.`,
        `一个路径图有 ${n} 个顶点。求它的距离矩阵所有元素之和。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(half, "That counts each pair once; the matrix lists every pair twice.", "那是每对只算一次；矩阵把每对列了两次。"),
        why(
          n * (n - 1),
          "That counts every entry off the diagonal as $1$; farther pairs have larger distances.",
          "那是把对角线外的每个元都算作 $1$；更远的顶点对距离更大。",
        ),
        why(2 * (n - 1), "That adds only the entries equal to $1$, the neighboring pairs.", "那只加了等于 $1$ 的元，即相邻的顶点对。"),
        why(n * n, "That is the number of entries, not their sum.", "那是元的个数，不是它们的和。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Add over the pairs", "对各对求和"],
            t(
              `There are $${n} - d$ pairs at distance $d$, so the pairs add to $\\sum_{d = 1}^{${n - 1}} d(${n} - d) = \\binom{${n + 1}}{3} = ${half}$.`,
              `距离为 $d$ 的顶点对有 $${n} - d$ 个，所以各对之和为 $\\sum_{d = 1}^{${n - 1}} d(${n} - d) = \\binom{${n + 1}}{3} = ${half}$。`,
            ),
          ],
          [
            ["Double", "加倍"],
            t(
              `The matrix lists each pair twice, so its entries add to $2 \\cdot ${half} = ${answer}$.`,
              `矩阵把每对列了两次，所以各元之和为 $2 \\cdot ${half} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `In closed form, $2\\binom{n + 1}{3} = \\frac{(n + 1)n(n - 1)}{3} = \\frac{${n + 1} \\cdot ${n} \\cdot ${n - 1}}{3} = ${answer}$.`,
          `用封闭形式，$2\\binom{n + 1}{3} = \\frac{(n + 1)n(n - 1)}{3} = \\frac{${n + 1} \\cdot ${n} \\cdot ${n - 1}}{3} = ${answer}$。`,
        ),
      ),
    });
  },
};

const dagMostEdges: KnowledgePointDef = {
  id: "the-most-edges-of-a-directed-acyclic-graph",
  figure: discreteDrawings2["directed-acyclic-graphs#the-most-edges-of-a-directed-acyclic-graph"],
  title: t("The most edges of a directed acyclic graph", "有向无环图的最多边数"),
  explanation: t(
    "A directed acyclic graph can be placed in a topological order, with every edge pointing forward. So for each pair of vertices, only the forward edge is possible, and this gives at most one edge per pair. Adding every forward edge reaches that limit without creating a cycle. An edge in both directions between a pair of vertices would already be a cycle of length two. The drawing shows $4$ vertices in topological order with every forward arc, $\\frac{4 \\cdot 3}{2} = 6$ arcs in all. On $50$ vertices the most is $\\binom{50}{2} = 1225$.\n\n> **Watch out.** Each pair of vertices allows one arc, not two, since arcs both ways would form a cycle. And the bound is reached: adding every forward arc of a topological order creates no cycle.",
    "有向无环图可以排成拓扑序，每条边都指向前方。所以对每对顶点，只可能有向前的那条边，这样每对最多一条边。加上所有向前的边，就达到这个上限，而不产生圈。一对顶点之间两个方向都有边，本身就已经是长度为二的圈。图中 $4$ 个顶点按拓扑序排列，画出了所有向前的弧，共 $\\frac{4 \\cdot 3}{2} = 6$ 条。$50$ 个顶点时最多有 $\\binom{50}{2} = 1225$ 条。\n\n> **注意。** 每对顶点只允许一条弧，而不是两条，因为两个方向的弧会构成圈。而且这个上限能够达到：加上拓扑序中所有向前的弧不会产生圈。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const answer = binom(n, 2);
    const descending =
      n <= 4
        ? range(1, n - 1)
            .reverse()
            .join(" + ")
        : `${n - 1} + ${n - 2} + \\dots + 1`;
    return numberProblem({
      prompt: t(
        `What is the largest number of edges a directed acyclic graph on ${n} vertices can have?`,
        `${n} 个顶点的有向无环图最多有多少条边？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n * (n - 1),
          "That allows arcs both ways between each pair, which would form cycles of length two.",
          "那是让每对顶点之间两个方向都有弧，这会构成长度为二的圈。",
        ),
        why(
          n - 1,
          "That is the number of arcs of a directed path; many more fit without a cycle.",
          "那是有向路径的弧数；不产生圈还能放下多得多的弧。",
        ),
        why(
          answer - 1,
          "That is one too few: every forward arc of a topological order can be present at once.",
          "少了一：拓扑序中所有向前的弧可以同时存在。",
        ),
        why(n * n, "That counts every ordered pair, loops and both directions included.", "那数了所有有序对，包括环和两个方向。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Order the vertices", "给顶点排序"],
            t(
              "In a topological order every arc points forward, so each pair of vertices has at most one arc, and all the forward arcs together form no cycle.",
              "在拓扑序中每条弧都指向前方，所以每对顶点至多一条弧，而所有向前的弧放在一起也不构成圈。",
            ),
          ],
          [
            ["Count the pairs", "数顶点对"],
            t(
              `So the largest number is the number of pairs, $\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${answer}$.`,
              `所以最大值是顶点对的个数，$\\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Counting the forward arcs from each vertex in turn: $${descending} = ${answer}$.`,
          `逐个顶点数向前的弧：$${descending} = ${answer}$。`,
        ),
      ),
    });
  },
};

const twoChains: KnowledgePointDef = {
  id: "the-topological-orderings-of-two-separate-paths",
  figure: discreteDrawings2["topological-ordering#the-topological-orderings-of-two-separate-paths"],
  title: t("The topological orderings of two separate paths", "两条独立路径的拓扑排序"),
  explanation: t(
    "A directed path allows only one order of its own vertices. If a graph consists of two separate paths, a topological ordering is any way of shuffling them together that keeps each path in order. Such a shuffle is decided by which positions go to the first path, and the vertices then fill those positions in their only possible order. So the count is one binomial coefficient. The drawing shows paths of $2$ and $3$ vertices: choosing the $2$ positions of the first path among $5$ gives $\\frac{5 \\cdot 4}{2} = 10$ orderings. Paths of $12$ and $2$ vertices give $\\binom{14}{2} = 91$.\n\n> **Watch out.** The two paths are shuffled together, not placed one after the other, so there are far more than $2$ orderings. And choose positions only for one path, since the other path fills the rest in its one order.",
    "有向路径只允许它自身顶点的一种顺序。如果一个图由两条独立的路径组成，拓扑排序就是把它们混合在一起、同时保持每条路径内部顺序的任何方式。这样的混合由哪些位置分给第一条路径决定，然后顶点按唯一可能的顺序填入这些位置。所以计数就是一个二项式系数。图中是 $2$ 个顶点和 $3$ 个顶点的两条路径：在 $5$ 个位置中选出第一条路径的 $2$ 个位置，得 $\\frac{5 \\cdot 4}{2} = 10$ 种排序。$12$ 个顶点和 $2$ 个顶点的两条路径给出 $\\binom{14}{2} = 91$ 种。\n\n> **注意。** 两条路径是混合在一起的，而不是一条接在另一条后面，所以排序远不止 $2$ 种。而且只需为一条路径选位置，另一条路径按它唯一的顺序填满其余位置。",
  ),
  generate(rng) {
    const a = rng.int(2, 10);
    const b = rng.int(2, 10);
    const answer = binom(a + b, a);
    return numberProblem({
      prompt: t(
        `A directed graph consists of two separate directed paths, one with ${a} vertices and one with ${b}, and no other edges. How many topological orderings does it have?`,
        `一个有向图由两条独立的有向路径组成，一条有 ${a} 个顶点，另一条有 ${b} 个，没有其他边。它有多少种拓扑排序？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(a + b, "That is the number of vertices, not the number of orderings.", "那是顶点数，不是排序数。"),
        why(
          a * b,
          "That multiplies the path lengths; count the ways to choose positions instead.",
          "那是把两条路径的顶点数相乘；应当数选位置的方法。",
        ),
        why(
          2 ** (a + b),
          `That counts every subset of the positions; the first path takes exactly ${a} of them.`,
          `那数了位置的所有子集；第一条路径恰好占 ${a} 个位置。`,
        ),
        why(
          2,
          "That only puts one whole path before the other; the paths can be shuffled together.",
          "那只是把一整条路径放在另一条之前；两条路径可以混合排列。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Choose positions", "选位置"],
            t(
              `An ordering has ${a + b} positions, and it is decided by which ${a} of them go to the first path.`,
              `一个排序有 ${a + b} 个位置，它由其中哪 ${a} 个分给第一条路径决定。`,
            ),
          ],
          [
            ["Count the choices", "数选法"],
            t(
              `Each path fills its positions in its only order, so there are $\\binom{${a + b}}{${a}} = ${answer}$ orderings.`,
              `每条路径按唯一的顺序填入它的位置，所以有 $\\binom{${a + b}}{${a}} = ${answer}$ 种排序。`,
            ),
          ],
        ],
        t(
          `Choosing instead the ${b} positions of the second path gives $\\binom{${a + b}}{${b}} = ${answer}$ as well.`,
          `改为选第二条路径的 ${b} 个位置，同样得到 $\\binom{${a + b}}{${b}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const bfsDiscovered: KnowledgePointDef = {
  id: "the-vertices-a-breadth-first-search-finds-by-a-given-level",
  figure: discreteDrawings2["breadth-first-search#the-vertices-a-breadth-first-search-finds-by-a-given-level"],
  title: t("The vertices a breadth-first search finds by a given level", "广度优先搜索到某层时找到的顶点"),
  explanation: t(
    "A breadth-first search finds vertices in order of their distance from the start, finishing each level before moving to the next. In a complete $m$-ary tree started at the root, level $j$ has $m^j$ vertices, because each vertex on one level has $m$ children on the next. The number found once level $d$ is finished is the geometric sum of all the levels up to $d$. In the drawing, a complete binary tree searched through level $2$ has found $1 + 2 + 4 = 7$ vertices. In a complete $10$-ary tree, once level $3$ is finished the search has found $1 + 10 + 100 + 1000 = 1111$.\n\n> **Watch out.** Count every level from the root, level $0$, up to level $d$, not only level $d$ itself. And the levels multiply by $m$ each time; they do not grow by adding $m$.",
    "广度优先搜索按到起点的距离顺序找到顶点，完成一层后才进入下一层。在从根出发的完全 $m$ 叉树中，第 $j$ 层有 $m^j$ 个顶点，因为一层的每个顶点在下一层有 $m$ 个孩子。第 $d$ 层完成时找到的顶点数，就是到第 $d$ 层为止所有层的几何级数和。图中的完全二叉树搜索到第 $2$ 层时，已找到 $1 + 2 + 4 = 7$ 个顶点。在完全 $10$ 叉树中，第 $3$ 层完成时，搜索已找到 $1 + 10 + 100 + 1000 = 1111$ 个顶点。\n\n> **注意。** 要数从根所在的第 $0$ 层到第 $d$ 层的每一层，而不只是第 $d$ 层。而且各层每次乘以 $m$，不是每次加 $m$。",
  ),
  generate(rng) {
    const m = rng.int(2, 6);
    const d = rng.int(1, 7);
    const answer = (m ** (d + 1) - 1) / (m - 1);
    const levels = range(0, d).map((j) => m ** j);
    return numberProblem({
      prompt: t(
        `A breadth-first search starts at the root of a complete ${m}-ary tree of height ${d + 2}, with the root on level 0. How many vertices have been discovered once level ${d} is finished?`,
        `广度优先搜索从高度为 ${d + 2} 的完全 ${m} 叉树的根出发，根在第 0 层。第 ${d} 层完成时，已经发现了多少个顶点？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(m ** d, `That counts only level ${d}; the levels before it were found too.`, `那只数了第 ${d} 层；之前各层也都已找到。`),
        why(m ** (d + 1), `That is the size of level ${d + 1}, the next level.`, `那是下一层，即第 ${d + 1} 层的顶点数。`),
        why(
          m * d + 1,
          `That adds ${m} vertices per level; each level has ${m} times as many as the one before.`,
          `那是每层加 ${m} 个顶点；每层的顶点数是上一层的 ${m} 倍。`,
        ),
        why(answer - 1, "That leaves out the root, which is found first.", "那漏掉了最先找到的根。"),
      ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
      solution: walked(
        [
          [
            ["Size each level", "求每层的大小"],
            t(
              `Level $j$ has $${m}^j$ vertices, so levels $0$ to $${d}$ hold $${levels.join(", ")}$.`,
              `第 $j$ 层有 $${m}^j$ 个顶点，所以第 $0$ 层到第 $${d}$ 层分别有 $${levels.join(", ")}$ 个。`,
            ),
          ],
          [
            ["Add the levels", "各层相加"],
            t(`Together they hold $${levels.join(" + ")} = ${answer}$ vertices.`, `合计 $${levels.join(" + ")} = ${answer}$ 个顶点。`),
          ],
        ],
        t(
          `The geometric sum formula gives $\\frac{${m}^{${d + 1}} - 1}{${m} - 1} = ${answer}$ as well.`,
          `几何级数求和公式同样给出 $\\frac{${m}^{${d + 1}} - 1}{${m} - 1} = ${answer}$。`,
        ),
      ),
    });
  },
};

const primStar: KnowledgePointDef = {
  id: "the-spanning-tree-of-a-graph-with-sum-weights",
  figure: discreteDrawings2["prims-algorithm#the-spanning-tree-of-a-graph-with-sum-weights"],
  title: t("The spanning tree of a graph with sum weights", "和权图的生成树"),
  explanation: t(
    "Prim's algorithm grows a tree by always adding the cheapest edge that leaves it. When vertices are numbered and an edge between $i$ and $j$ weighs $i + j$, the cheapest edge reaching any new vertex $j$ comes from the smallest vertex already in the tree. If the tree contains vertex 1, every new vertex is attached directly to vertex 1, so the tree is a star. The drawing shows $4$ vertices: the new vertices are reached from vertex 1 at weights $3$, $4$ and $5$, so the tree weighs $12$, and the dashed edges of weights $5$, $6$ and $7$ are never chosen. With $50$ vertices the star's edges weigh $3, 4, \\dots, 51$, which add to $\\frac{49(3 + 51)}{2} = 1323$.\n\n> **Watch out.** Each weight is $1 + j$, so remember the $1$ on every one of the $n - 1$ edges. And no edge reaches vertex $j$ more cheaply than the one from vertex $1$, so the largest weights never enter the tree.",
    "普里姆算法总是加入离开当前树的最便宜的边，使树增长。当顶点编号，且 $i$、$j$ 之间的边权为 $i + j$ 时，到达任何新顶点 $j$ 的最便宜的边，来自树中最小的顶点。如果树含顶点 1，每个新顶点都直接连到顶点 1，所以这棵树是星形。图中有 $4$ 个顶点：新顶点从顶点 1 以权 $3$、$4$、$5$ 到达，所以树的权为 $12$，权为 $5$、$6$、$7$ 的虚线边从不被选中。有 $50$ 个顶点时，星形的边权为 $3, 4, \\dots, 51$，其和为 $\\frac{49(3 + 51)}{2} = 1323$。\n\n> **注意。** 每条边的权是 $1 + j$，所以 $n - 1$ 条边中每一条都别忘了那个 $1$。而且没有哪条边到达顶点 $j$ 比从顶点 $1$ 出发的更便宜，所以最大的权永远不会进入树。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const answer = n - 1 + (n * (n + 1)) / 2 - 1;
    const weights = n <= 4 ? range(3, n + 1).join(", ") : `3, 4, \\dots, ${n + 1}`;
    return numberProblem({
      prompt: t(
        `A complete graph has vertices $1, 2, \\dots, ${n}$, and the edge between $i$ and $j$ has weight $i + j$. Find the total weight of a minimum spanning tree.`,
        `一个完全图的顶点是 $1, 2, \\dots, ${n}$，$i$ 与 $j$ 之间的边权为 $i + j$。求最小生成树的总权重。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n * n - 1,
          `That gives every edge the largest weight, $1 + ${n}$; the edges to smaller vertices are lighter.`,
          `那是给每条边都用了最大的权 $1 + ${n}$；连到较小顶点的边更轻。`,
        ),
        why(
          (n * (n + 1)) / 2 - 1,
          "That adds $2 + 3 + \\dots + n$ but leaves out the $1$ in each weight $1 + j$.",
          "那是把 $2 + 3 + \\dots + n$ 相加，却漏掉了每个权 $1 + j$ 中的 $1$。",
        ),
        why(
          ((n - 1) * (n * (n + 1))) / 2,
          "That multiplies where it should add; add the weights of the edges one by one.",
          "那是该加的地方做了乘法；应把各边的权逐一相加。",
        ),
        why(answer + 1, `That is one too many: the weights run from $3$ to $${n + 1}$.`, `多了一：权从 $3$ 到 $${n + 1}$。`),
      ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
      solution: walked(
        [
          [
            ["Attach each vertex to 1", "每个顶点连到 1"],
            t(
              `Every vertex $j \\ge 2$ joins vertex 1 with an edge of weight $1 + j$, the lightest edge at $j$, so the weights are $${weights}$.`,
              `每个顶点 $j \\ge 2$ 通过权为 $1 + j$ 的边连到顶点 1，这是 $j$ 处最轻的边，所以各边权为 $${weights}$。`,
            ),
          ],
          [
            ["Add the weights", "把权相加"],
            t(
              `The ${n - 1} ones and $${n <= 4 ? range(2, n).join(" + ") : `2 + 3 + \\dots + ${n}`}$ add to $${n - 1} + ${(n * (n + 1)) / 2 - 1} = ${answer}$.`,
              `${n - 1} 个 1 与 $${n <= 4 ? range(2, n).join(" + ") : `2 + 3 + \\dots + ${n}`}$ 之和为 $${n - 1} + ${(n * (n + 1)) / 2 - 1} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `As an arithmetic series of ${n - 1} terms from $3$ to $${n + 1}$: $\\frac{${n - 1}(3 + ${n + 1})}{2} = ${answer}$.`,
          `看作从 $3$ 到 $${n + 1}$ 的 ${n - 1} 项等差数列：$\\frac{${n - 1}(3 + ${n + 1})}{2} = ${answer}$。`,
        ),
      ),
    });
  },
};

const gridPaths: KnowledgePointDef = {
  id: "the-shortest-paths-across-a-grid-graph",
  figure: discreteDrawings2["shortest-paths-in-unweighted-graphs#the-shortest-paths-across-a-grid-graph"],
  title: t("The shortest paths across a grid graph", "网格图中的最短路径"),
  explanation: t(
    "In a grid graph, moving from one corner to the opposite corner needs a fixed number of steps in each direction, and any shortest path uses no others. A shortest path is therefore a sequence of steps, in which we only choose the order of the two kinds. Choosing the positions of one kind decides the whole sequence, which gives a binomial coefficient instead of a search. The drawing shows a grid $3$ steps wide and $2$ steps high: a shortest path makes $3$ steps across and $2$ up, and choosing the $2$ positions of the steps up among $5$ gives $\\frac{5 \\cdot 4}{2} = 10$ paths. A grid $12$ steps wide and $3$ high has $\\binom{15}{3} = 455$.\n\n> **Watch out.** The length of a shortest path is $a + b$, but the question asks how many there are. And a shortest path never steps back, so the steps are of only two kinds and only their order varies.",
    "在网格图中，从一个角走到对角，每个方向需要固定的步数，任何最短路径都不会多走。因此最短路径就是一列步子，我们只选择两种步子的顺序。选定其中一种步子的位置，就决定了整个序列，于是得到一个二项式系数，而不必搜索。图中的网格宽 $3$ 步、高 $2$ 步：最短路径横走 $3$ 步、向上 $2$ 步，在 $5$ 个位置中选出向上的 $2$ 步，得 $\\frac{5 \\cdot 4}{2} = 10$ 条路径。宽 $12$ 步、高 $3$ 步的网格有 $\\binom{15}{3} = 455$ 条。\n\n> **注意。** 最短路径的长度是 $a + b$，但问题问的是有多少条。而且最短路径从不后退，所以步子只有两种，变化的只是它们的顺序。",
  ),
  generate(rng) {
    const a = rng.int(2, 10);
    const b = rng.int(2, 10);
    const answer = binom(a + b, a);
    return numberProblem({
      prompt: t(
        `A grid graph has vertices $(i, j)$ with $0 \\le i \\le ${a}$ and $0 \\le j \\le ${b}$, and two vertices are joined when they differ by 1 in one coordinate. How many shortest paths go from $(0, 0)$ to $(${a}, ${b})$?`,
        `网格图的顶点是 $(i, j)$，$0 \\le i \\le ${a}$，$0 \\le j \\le ${b}$，两个顶点在一个坐标上相差 1 时相连。从 $(0, 0)$ 到 $(${a}, ${b})$ 有多少条最短路径？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(a + b, "That is the length of a shortest path, not the number of them.", "那是最短路径的长度，不是它们的条数。"),
        why((a + 1) * (b + 1), "That is the number of vertices of the grid.", "那是网格的顶点数。"),
        why(
          2 ** (a + b),
          `That lets each step go either way freely; exactly ${a} of the steps must increase $i$.`,
          `那是让每一步随意选方向；恰好要有 ${a} 步增加 $i$。`,
        ),
        why(a * b, "That multiplies the side lengths; count the orders of the steps instead.", "那是把两边长相乘；应当数步子的排列顺序。"),
      ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
      solution: walked(
        [
          [
            ["Count the steps", "数步数"],
            t(
              `A shortest path has $${a} + ${b} = ${a + b}$ steps: ${a} that increase $i$ and ${b} that increase $j$.`,
              `最短路径有 $${a} + ${b} = ${a + b}$ 步：${a} 步增加 $i$，${b} 步增加 $j$。`,
            ),
          ],
          [
            ["Choose their order", "选顺序"],
            t(
              `Choosing which ${a} of the ${a + b} steps increase $i$ decides the path, so there are $\\binom{${a + b}}{${a}} = ${answer}$ paths.`,
              `选出 ${a + b} 步中哪 ${a} 步增加 $i$，就决定了路径，所以有 $\\binom{${a + b}}{${a}} = ${answer}$ 条路径。`,
            ),
          ],
        ],
        t(
          `Choosing instead the ${b} steps that increase $j$ gives $\\binom{${a + b}}{${b}} = ${answer}$ as well.`,
          `改为选出增加 $j$ 的 ${b} 步，同样得到 $\\binom{${a + b}}{${b}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const mooreCount: KnowledgePointDef = {
  id: "counting-the-tables-of-a-moore-machine",
  title: t("Counting the tables of a Moore machine", "计算Moore 机的表"),
  explanation: t(
    "A Moore machine's table has two independent parts. Each pair of a state and an input symbol needs a next state, which makes $as$ entries with $s$ choices each. Each state also needs one output, which makes $s$ entries with $b$ choices each. The output belongs to the state and not to the transition, and this is what makes the count smaller than for a Mealy machine.\n\n> **Watch out.** There is one output per state, not one per transition. With $2$ states, $2$ input symbols and $2$ output symbols there are $2^4 \\cdot 2^2 = 64$ tables, not $2^4 \\cdot 2^4 = 256$.",
    "Moore 机的表有两个独立的部分。每一对状态和输入符号需要一个下一状态，共 $as$ 项，每项有 $s$ 种选择。每个状态还需要一个输出，共 $s$ 项，每项有 $b$ 种选择。输出属于状态而不属于转移，这使得计数比Mealy 机要小。\n\n> **注意。** 每个状态一个输出，而不是每个转移一个输出。有 $2$ 个状态、$2$ 个输入符号和 $2$ 个输出符号时，共有 $2^4 \\cdot 2^2 = 64$ 种表，而不是 $2^4 \\cdot 2^4 = 256$ 种。",
  ),
  generate(rng) {
    const s = rng.int(2, 5);
    const a = s === 5 ? 2 : rng.int(2, 3);
    const b = rng.int(2, 5);
    const entries = a * s;
    const answer = s ** entries * b ** s;
    return numberProblem({
      prompt: t(
        `A Moore machine has ${s} states with a fixed start state, ${a} input symbols and ${b} output symbols. How many different tables of next states and outputs are there?`,
        `一个Moore 机有 ${s} 个状态（起始状态固定）、${a} 个输入符号和 ${b} 个输出符号。下一状态和输出构成的表有多少种？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(s ** entries, "That counts only the next states and leaves out the outputs.", "那只数了下一状态，漏掉了输出。"),
        why(
          (s * b) ** entries,
          "That puts an output on every transition, as in a Mealy machine; a Moore machine has one output per state.",
          "那是给每个转移都配一个输出，像 Mealy 机那样；Moore 机每个状态只有一个输出。",
        ),
        why(
          s ** entries + b ** s,
          "That adds the two parts; every choice of next states combines with every choice of outputs, so they multiply.",
          "那是把两部分相加；每种下一状态的选法都能与每种输出的选法搭配，所以应相乘。",
        ),
        why(s ** a * b, "That fills in only one row of the table, with one output.", "那只填了表中的一行和一个输出。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Next states", "下一状态"],
            t(
              `There are $${s} \\cdot ${a} = ${entries}$ pairs of a state and an input symbol, each with $${s}$ choices: $${s}^{${entries}} = ${s ** entries}$ ways.`,
              `状态与输入符号的配对共 $${s} \\cdot ${a} = ${entries}$ 个，每个有 $${s}$ 种选择：共 $${s}^{${entries}} = ${s ** entries}$ 种。`,
            ),
          ],
          [
            ["Outputs", "输出"],
            t(
              `Each of the $${s}$ states has one output with $${b}$ choices: $${b}^{${s}} = ${b ** s}$ ways.`,
              `$${s}$ 个状态各有一个输出，每个有 $${b}$ 种选择：共 $${b}^{${s}} = ${b ** s}$ 种。`,
            ),
          ],
          [["Multiply", "相乘"], t("The two parts are independent:", "两部分相互独立："), [`${s ** entries} \\cdot ${b ** s} = ${answer}`]],
        ],
        t(
          `A Mealy machine with the same sizes would have $(${s} \\cdot ${b})^{${entries}} = ${s}^{${entries}} \\cdot ${b}^{${entries}}$ tables; the Moore count has $${b}^{${s}}$ in place of $${b}^{${entries}}$, which is smaller, as it should be.`,
          `同样规模的 Mealy 机有 $(${s} \\cdot ${b})^{${entries}} = ${s}^{${entries}} \\cdot ${b}^{${entries}}$ 种表；Moore 机的计数中是 $${b}^{${s}}$ 而不是 $${b}^{${entries}}$，确实更小。`,
        ),
      ),
    });
  },
};

const noTwoOnes: KnowledgePointDef = {
  id: "the-accepted-strings-of-a-given-length-with-no-two-ones-together",
  title: t("Accepted strings of a given length with no two ones together", "没有相邻 1 的给定长度串"),
  explanation: t(
    "The states of a DFA can be used to count its accepted strings. For strings with no two consecutive ones, the DFA remembers whether the last symbol was a 1. A valid string of length $n$ either ends in 0, after any valid string of length $n - 1$, or ends in 01, after any valid string of length $n - 2$. So the counts follow the Fibonacci recurrence.\n\n> **Watch out.** The counts start from $1$ for the empty string and $2$ for length $1$, not from $1, 1$. Length $3$ gives $5$ strings, namely $000, 001, 010, 100, 101$, not the Fibonacci number $2$ or $3$.",
    "DFA 的状态可以用来计算它接受的串的个数。对没有两个连续 1 的串，DFA 记住最后一个符号是否为 1。长度为 $n$ 的有效串，要么以 0 结尾（前面是任意长度为 $n - 1$ 的有效串），要么以 01 结尾（前面是任意长度为 $n - 2$ 的有效串）。所以这些个数满足斐波那契递推。\n\n> **注意。** 个数从空串的 $1$ 和长度 $1$ 的 $2$ 开始，而不是从 $1, 1$ 开始。长度为 $3$ 时有 $5$ 个串，即 $000, 001, 010, 100, 101$，而不是斐波那契数 $2$ 或 $3$。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const counts = [1, 2];
    for (const i of range(2, n)) counts[i] = (counts[i - 1] ?? 0) + (counts[i - 2] ?? 0);
    const answer = counts[n] ?? 0;
    const shorter = counts[n - 1] ?? 0;
    const shortest = counts[n - 2] ?? 0;
    return numberProblem({
      prompt: t(
        `A DFA over $\\{0, 1\\}$ accepts exactly the strings with no two consecutive 1s. How many strings of length ${n} does it accept?`,
        `$\\{0, 1\\}$ 上的一个 DFA 恰好接受没有两个连续 1 的串。它接受多少个长度为 ${n} 的串？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(2 ** n, "That counts every binary string of that length.", "那是该长度的所有二进制串的个数。"),
        why(shorter, "That counts only the valid strings that end in 0.", "那只数了以 0 结尾的有效串。"),
        why(shortest, "That counts only the valid strings that end in 1, that is, in 01.", "那只数了以 1（即 01）结尾的有效串。"),
        why(n + 1, "That counts only the strings with at most one 1.", "那只数了至多含一个 1 的串。"),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Split by the last symbol", "按最后一个符号分类"],
            t(
              `A valid string of length $${n}$ ends in 0 after a valid string of length $${n - 1}$, or in 01 after a valid string of length $${n - 2}$, so each count is the sum of the two before it.`,
              `长度为 $${n}$ 的有效串，要么是长度为 $${n - 1}$ 的有效串后接 0，要么是长度为 $${n - 2}$ 的有效串后接 01，所以每个个数都是前两个之和。`,
            ),
          ],
          [
            ["Run the recurrence", "运用递推"],
            t(
              "Starting from $1$ for the empty string and $2$ for length $1$, the counts are",
              "从空串的 $1$ 和长度 $1$ 的 $2$ 开始，个数依次为",
            ),
            range(0, Math.floor(n / 8))
              .map((r) => counts.slice(8 * r, Math.min(8 * r + 8, n + 1)).join(",\\ "))
              .filter((row) => row !== ""),
          ],
          [
            ["Read off length n", "读出长度 n 的值"],
            t(
              `The count for length $${n}$ is the sum of the counts for lengths $${n - 1}$ and $${n - 2}$:`,
              `长度 $${n}$ 的个数是长度 $${n - 1}$ 与 $${n - 2}$ 的个数之和：`,
            ),
            [`${shorter} + ${shortest} = ${answer}`],
          ],
        ],
        t(
          "For length $3$ the list can be checked by hand: $000, 001, 010, 100, 101$ are the $5$ strings without two adjacent 1s, which is the fourth count in the list.",
          "长度为 $3$ 时可以直接核对：没有相邻 1 的串是 $000, 001, 010, 100, 101$，共 $5$ 个，正是列表中的第四个数。",
        ),
      ),
    });
  },
};

const regexBlock: KnowledgePointDef = {
  id: "the-strings-of-a-given-length-with-a-single-block-of-ones",
  title: t("The strings of a given length with a single block of ones", "只有一段 1 的给定长度串"),
  explanation: t(
    "A string matching $0^*1^*0^*$ is either all zeros or has one unbroken block of ones. A block is decided by where it starts and where it ends, which amounts to choosing two of the $n + 1$ gaps between and around the symbols. Adding the all-zero string gives the total. Different splits can produce the same all-zero string, so it must be counted only once.\n\n> **Watch out.** Count strings, not splits. For length $2$ the string $00$ comes from three splits, $00 \\cdot \\varepsilon \\cdot \\varepsilon$, $0 \\cdot \\varepsilon \\cdot 0$ and $\\varepsilon \\cdot \\varepsilon \\cdot 00$, yet it is one string; the total is $\\binom{3}{2} + 1 = 4$.",
    "匹配 $0^*1^*0^*$ 的串，要么全是零，要么有一段连续的 1。这一段由它的起点和终点决定，相当于从符号之间及两端的 $n + 1$ 个间隙中选两个。再加上全零串，就得到总数。不同的拆分可以产生同一个全零串，所以它只能算一次。\n\n> **注意。** 要数串，而不是拆分。长度为 $2$ 时，串 $00$ 来自三种拆分 $00 \\cdot \\varepsilon \\cdot \\varepsilon$、$0 \\cdot \\varepsilon \\cdot 0$ 和 $\\varepsilon \\cdot \\varepsilon \\cdot 00$，但它只是一个串；总数为 $\\binom{3}{2} + 1 = 4$。",
  ),
  generate(rng) {
    const n = rng.int(3, 35);
    const blocks = binom(n + 1, 2);
    const answer = blocks + 1;
    return numberProblem({
      prompt: t(
        `How many binary strings of length ${n} match the regular expression $0^*1^*0^*$?`,
        `长度为 ${n} 的二进制串中，有多少个匹配正则表达式 $0^*1^*0^*$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(blocks, "That leaves out the all-zero string, which also matches.", "那漏掉了全零串，它也匹配。"),
        why(2 ** n, "That counts every binary string of that length.", "那是该长度的所有二进制串的个数。"),
        why(
          n + 1,
          "That counts only the strings $0^k1^{n-k}$, which match $0^*1^*$.",
          "那只数了形如 $0^k1^{n-k}$ 的串，它们匹配的是 $0^*1^*$。",
        ),
        why(
          binom(n + 2, 2),
          `That counts the splits into three parts; the all-zero string comes from $${n + 1}$ splits but is one string.`,
          `那数的是分成三段的拆分；全零串来自 $${n + 1}$ 种拆分，但只是一个串。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Strings with a block of ones", "含一段 1 的串"],
            t(
              `The block starts and ends at two of the $${n + 1}$ gaps between and around the symbols: $\\binom{${n + 1}}{2} = ${blocks}$ ways.`,
              `这一段的起点和终点是符号之间及两端的 $${n + 1}$ 个间隙中的两个：共 $\\binom{${n + 1}}{2} = ${blocks}$ 种。`,
            ),
          ],
          [
            ["Add the all-zero string", "加上全零串"],
            t("The string with no ones matches too, and it is counted once:", "不含 1 的串也匹配，只算一次："),
            [`${blocks} + 1 = ${answer}`],
          ],
        ],
        t(
          `Counting blocks by their length instead, a block of length $L$ has $${n} - L + 1$ positions, so there are $${n} + ${n - 1} + \\dots + 1 = \\frac{${n} \\cdot ${n + 1}}{2} = ${blocks}$ blocks, as before.`,
          `改为按长度数：长度为 $L$ 的一段有 $${n} - L + 1$ 个位置，所以共有 $${n} + ${n - 1} + \\dots + 1 = \\frac{${n} \\cdot ${n + 1}}{2} = ${blocks}$ 段，与前面相同。`,
        ),
      ),
    });
  },
};

const tmConfigurations: KnowledgePointDef = {
  id: "counting-the-configurations-of-a-turing-machine",
  title: t("Counting the configurations of a Turing machine", "计算图灵机的格局数"),
  explanation: t(
    "A configuration records everything needed to continue a computation: the current state, the position of the head, and the contents of the tape. On a tape limited to $c$ cells, these parts are independent, so the count is the product of the number of states, the $c$ head positions, and the number of tape contents. This count is what bounds how long a machine can run without repeating.\n\n> **Watch out.** Each cell holds its own symbol, so the tape contents number $g^c$, not $g \\cdot c$. With $2$ symbols and $3$ cells there are $2^3 = 8$ contents, not $6$.",
    "格局记录了继续计算所需的一切：当前状态、读写头的位置和纸带的内容。在限于 $c$ 个单元的纸带上，这些部分相互独立，所以个数是状态数、$c$ 个读写头位置和纸带内容数的乘积。这个计数决定了机器在不重复的情况下最多能运行多久。\n\n> **注意。** 每个单元各有自己的符号，所以纸带内容有 $g^c$ 种，而不是 $g \\cdot c$ 种。$2$ 个符号、$3$ 个单元时有 $2^3 = 8$ 种内容，而不是 $6$ 种。",
  ),
  generate(rng) {
    const q = rng.int(2, 9);
    const c = rng.int(2, 8);
    const g = rng.int(2, 4);
    const tapes = g ** c;
    const answer = q * c * tapes;
    return numberProblem({
      prompt: t(
        `A Turing machine has ${q} states and ${g} tape symbols, and it uses only ${c} cells of its tape. How many configurations are possible?`,
        `一台图灵机有 ${q} 个状态和 ${g} 个纸带符号，只使用纸带上的 ${c} 个单元。可能的格局有多少个？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(q * tapes, "That leaves out the position of the head.", "那漏掉了读写头的位置。"),
        why(tapes, "That counts only the tape contents.", "那只数了纸带内容。"),
        why(
          q * c * g,
          `That gives the tape $${g}$ contents in all; each of the $${c}$ cells has its own $${g}$ choices.`,
          `那让纸带总共只有 $${g}$ 种内容；其实 $${c}$ 个单元各有 $${g}$ 种选择。`,
        ),
        why(
          (q + c) * tapes,
          "That adds the states and head positions; they combine independently, so they multiply.",
          "那是把状态数与读写头位置数相加；它们相互独立地搭配，应相乘。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count each part", "数每个部分"],
            t(
              `There are $${q}$ states, $${c}$ head positions and $${g}^{${c}} = ${tapes}$ tape contents.`,
              `有 $${q}$ 个状态、$${c}$ 个读写头位置和 $${g}^{${c}} = ${tapes}$ 种纸带内容。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t("The three parts are independent:", "三个部分相互独立："),
            [`${q} \\cdot ${c} \\cdot ${tapes} = ${answer}`],
          ],
        ],
        t(
          `Grouping the other way, the $${q} \\cdot ${c} = ${q * c}$ pairs of a state and a head position each go with $${tapes}$ tapes, and $${q * c} \\cdot ${tapes} = ${answer}$.`,
          `换一种分组：状态与读写头位置的 $${q} \\cdot ${c} = ${q * c}$ 种配对，每种都与 $${tapes}$ 种纸带搭配，$${q * c} \\cdot ${tapes} = ${answer}$。`,
        ),
      ),
    });
  },
};

const sumOfPowersOrder: KnowledgePointDef = {
  id: "the-order-of-a-sum-of-powers",
  title: t("The order of a sum of powers", "幂和的阶"),
  explanation: t(
    "A loop that does $i^p$ work on its $i$th pass has total cost $\\sum_{i = 1}^n i^p$. Each of the $n$ terms is at most $n^p$, so the sum is $O(n^{p + 1})$. This exponent cannot be lowered, since the larger half of the terms are each at least $\\left(\\frac{n}{2}\\right)^p$. So summing raises the exponent by exactly one, whatever the constant in front.\n\n> **Watch out.** The sum has $n$ terms, so its exponent is one more than that of a single term. $\\sum_{i=1}^{n} i^2$ is $\\Theta(n^3)$, not $\\Theta(n^2)$.",
    "第 $i$ 次循环做 $i^p$ 的工作，总代价是 $\\sum_{i = 1}^n i^p$。$n$ 个项中每一项最多是 $n^p$，所以和是 $O(n^{p + 1})$。这个指数不能再降低，因为较大的一半项每项至少是 $\\left(\\frac{n}{2}\\right)^p$。所以求和恰好使指数增加一，与前面的常数无关。\n\n> **注意。** 和有 $n$ 项，所以它的指数比单独一项的指数大一。$\\sum_{i=1}^{n} i^2$ 是 $\\Theta(n^3)$，而不是 $\\Theta(n^2)$。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const p = rng.int(1, 9);
    const answer = p + 1;
    const term = p === 1 ? "i" : `i^{${p}}`;
    const top = p === 1 ? "n" : `n^{${p}}`;
    return numberProblem({
      prompt: t(
        `Find the smallest integer $k$ such that $\\sum_{i=1}^{n} ${a}${term} = O(n^k)$.`,
        `求最小的整数 $k$，使 $\\sum_{i=1}^{n} ${a}${term} = O(n^k)$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          p,
          "That is the exponent of a single term; adding up $n$ terms raises it by one.",
          "那是单独一项的指数；把 $n$ 项加起来使它增加一。",
        ),
        why(
          p + 2,
          `That is an upper bound, but not the smallest: the sum is already $O(n^{${answer}})$.`,
          `那是一个上界，但不是最小的：这个和已经是 $O(n^{${answer}})$。`,
        ),
        why(
          a + p,
          `That adds the constant $${a}$ to the exponent; a constant factor does not change the order.`,
          `那把常数 $${a}$ 加到了指数上；常数因子不改变阶。`,
        ),
        why(
          a * p,
          `That multiplies the exponent by the constant $${a}$; a constant factor does not change the order.`,
          `那把指数乘以常数 $${a}$；常数因子不改变阶。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Bound from above", "从上方估计"],
            t(`Each of the $n$ terms is at most $${a}${top}$:`, `$n$ 项中每项最多是 $${a}${top}$：`),
            [`\\sum_{i=1}^{n} ${a}${term} \\le n \\cdot ${a}${top} = ${a}n^{${answer}}`],
          ],
          [
            ["Bound from below", "从下方估计"],
            t(
              `The larger half of the terms, about $\\frac{n}{2}$ of them, are each at least $${a}${p === 1 ? "\\cdot \\frac{n}{2}" : `\\left(\\frac{n}{2}\\right)^{${p}}`}$, so the sum is at least a constant times $n^{${answer}}$, namely $\\frac{${a}}{2^{${answer}}} n^{${answer}}$.`,
              `较大的一半项约有 $\\frac{n}{2}$ 个，每项至少是 $${a}${p === 1 ? "\\cdot \\frac{n}{2}" : `\\left(\\frac{n}{2}\\right)^{${p}}`}$，所以和至少是 $n^{${answer}}$ 的常数倍，即 $\\frac{${a}}{2^{${answer}}} n^{${answer}}$。`,
            ),
          ],
          [
            ["Read off the exponent", "读出指数"],
            t(
              `So the sum grows like $n^{${answer}}$ and $k = ${p} + 1 = ${answer}$.`,
              `所以这个和的增长与 $n^{${answer}}$ 相当，$k = ${p} + 1 = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The integral gives the same order: $\\int_0^n ${a}${p === 1 ? "x" : `x^{${p}}`}\\,dx = \\frac{${a}}{${answer}} n^{${answer}}$, which lies between the two bounds.`,
          `积分给出同样的阶：$\\int_0^n ${a}${p === 1 ? "x" : `x^{${p}}`}\\,dx = \\frac{${a}}{${answer}} n^{${answer}}$，它介于上下两个界之间。`,
        ),
      ),
    });
  },
};

const omegaThreshold: KnowledgePointDef = {
  id: "the-threshold-where-an-exponential-overtakes-a-power",
  title: t("The threshold where an exponential overtakes a power", "指数函数超过幂函数的临界点"),
  explanation: t(
    "The statement $2^n = \\Omega(n^p)$ only needs its inequality to hold from some point on. Small values of $n$ can behave differently, and an inequality may hold at first, fail for a while, and then hold for good. So the threshold $n_0$ is one more than the last value where the inequality fails, and it is not the first value where it happens to hold.\n\n> **Watch out.** An early success does not settle the threshold. $2^n \\ge n^2$ holds at $n = 1$ and $n = 2$, fails at $n = 3$ since $8 < 9$, and holds from $n = 4$ on, so $n_0 = 4$, not $1$.",
    "$2^n = \\Omega(n^p)$ 只要求不等式从某一点起成立。较小的 $n$ 可以表现不同，不等式可能开始成立，失败一段时间，然后一直成立。所以临界值 $n_0$ 比不等式失败的最后一个值大一，而不是它碰巧成立的第一个值。\n\n> **注意。** 开始时成立并不能确定临界值。$2^n \\ge n^2$ 在 $n = 1$ 和 $n = 2$ 时成立，在 $n = 3$ 时因 $8 < 9$ 而不成立，从 $n = 4$ 起一直成立，所以 $n_0 = 4$，而不是 $1$。",
  ),
  generate(rng) {
    const c = rng.int(1, 60);
    const p = rng.int(2, 3);
    const holds = (n: number) => 2 ** n >= c * n ** p;
    const last =
      range(1, 64)
        .filter((n) => !holds(n))
        .pop() ?? 0;
    const answer = last + 1;
    const first = range(1, 64).find(holds) ?? answer;
    const scaled = c === 1 ? `n^{${p}}` : `${c}n^{${p}}`;
    return numberProblem({
      prompt: t(
        `Find the smallest positive integer $n_0$ such that $2^n \\ge ${scaled}$ for all integers $n \\ge n_0$.`,
        `求最小的正整数 $n_0$，使 $2^n \\ge ${scaled}$ 对所有整数 $n \\ge n_0$ 成立。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          first,
          `The inequality holds at $n = ${first}$, but it fails again at $n = ${last}$, so it does not hold for all $n \\ge ${first}$.`,
          `不等式在 $n = ${first}$ 时成立，但在 $n = ${last}$ 时又不成立，所以并非对所有 $n \\ge ${first}$ 都成立。`,
        ),
        why(
          last,
          "That is the last value where the inequality fails; the threshold is the next one.",
          "那是不等式不成立的最后一个值；临界值是下一个。",
        ),
        why(
          answer + 1,
          `The inequality already holds for all $n \\ge ${answer}$, so this is not the smallest.`,
          `不等式已经对所有 $n \\ge ${answer}$ 成立，所以这不是最小的。`,
        ),
        why(
          c,
          "That is the constant in the inequality, not the point from which it holds.",
          "那是不等式中的常数，而不是它开始成立的位置。",
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Find the last failure", "找出最后一次不成立"],
            t(`At $n = ${last}$ the inequality fails:`, `在 $n = ${last}$ 时不等式不成立：`),
            [`2^{${last}} = ${2 ** last} < ${c * last ** p} = ${c === 1 ? "" : `${c} \\cdot `}${last}^{${p}}`],
          ],
          [
            ["Check the next value", "检验下一个值"],
            t(`At $n = ${answer}$ it holds:`, `在 $n = ${answer}$ 时成立：`),
            [`2^{${answer}} = ${2 ** answer} \\ge ${c * answer ** p} = ${c === 1 ? "" : `${c} \\cdot `}${answer}^{${p}}`],
          ],
        ],
        t(
          `It keeps holding from there: each step doubles the left side, while the right side grows by the factor $\\left(\\frac{n + 1}{n}\\right)^{${p}} \\le \\left(\\frac{${answer + 1}}{${answer}}\\right)^{${p}} < 2$. So $n_0 = ${answer}$.`,
          `此后一直成立：每一步左边加倍，而右边只增大为 $\\left(\\frac{n + 1}{n}\\right)^{${p}} \\le \\left(\\frac{${answer + 1}}{${answer}}\\right)^{${p}} < 2$ 倍。所以 $n_0 = ${answer}$。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** sumOfTerms writes integer coefficients and monomials as a sum, leaving out zero terms and unit coefficients. */
const sumOfTerms = (terms: readonly (readonly [number, string])[]) =>
  terms
    .filter(([c]) => c !== 0)
    .map(([c, m], i) => {
      const size = Math.abs(c);
      const body = m === "" ? `${size}` : size === 1 ? m : `${size}${m}`;
      return `${i === 0 ? (c < 0 ? "-" : "") : c < 0 ? " - " : " + "}${body}`;
    })
    .join("");
/** ratioTerm writes a signed term with a rational coefficient, leaving out a unit coefficient. */
const ratioTerm = (q: Q, m: string, first: boolean) => {
  const size = q.abs();
  const body = size.eq(Q.of(1)) ? m : `${size.toLatex()}${m}`;
  return `${first ? (q.sign() < 0 ? "-" : "") : q.sign() < 0 ? " - " : " + "}${body}`;
};
/** bracketPow writes a rational base to an exponent, in brackets, leaving out an exponent of one. */
const bracketPow = (base: Q, e: number) => {
  const inner = `\\left(${base.toLatex()}\\right)`;
  return e === 1 ? inner : `${inner}^{${e}}`;
};
/** sampleFrom draws k different items of a list, in the order drawn. */
const sampleFrom = <T>(rng: Parameters<KnowledgePointDef["generate"]>[0], items: readonly T[], k: number): T[] => {
  const rest = [...items];
  const out: T[] = [];
  for (let i = 0; i < k; i++) out.push(rest.splice(rng.int(0, rest.length - 1), 1)[0] as T);
  return out;
};
/** arcSet writes the arcs of a directed graph on lettered vertices, in alphabetical order. */
const arcSet = (edges: readonly (readonly [number, number])[]) =>
  [...edges]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map(([u, v]) => `(${"ABCDEFGH"[u]}, ${"ABCDEFGH"[v]})`)
    .join(", ");
/** letterList writes the vertices with the given numbers as the letters A, B, …. */
const letterList = (ids: readonly number[]) => ids.map((i) => "ABCDEFGH"[i]).join(", ");
/** automatonTable writes a transition table on the states q_0, … with cells given as LaTeX, the start state arrowed and accepting states starred. */
const automatonTable = (cells: readonly (readonly [string, string])[], accepting: readonly number[] = []) =>
  `\\begin{array}{c|cc} & 0 & 1 \\\\ \\hline ${cells
    .map(([zero, one], q) => `${q === 0 ? "\\to " : ""}${accepting.includes(q) ? "{*}" : ""}q_{${q}} & ${zero} & ${one}`)
    .join(" \\\\ ")} \\end{array}`;

const rearrangingForAugmentedMatrix: KnowledgePointDef = {
  id: "equations-out-of-standard-form-in-an-augmented-matrix",
  title: t("Equations out of standard form in an augmented matrix", "增广矩阵中不是标准形式的方程"),
  explanation: t(
    "An augmented matrix can only be read off once every equation has its unknowns on the left, in the agreed order, and its constant on the right. An equation that arrives in another shape must be rearranged first. Moving a term across the equals sign changes its sign, and that sign is what the matrix records. For $2x + 3 = 4y + 7$: $2x - 4y = 4$, so the row is $(2, -4 \\mid 4)$.\n\n> **Watch out.** Every term that crosses the equals sign changes sign, the constants included. Read the entries only after the equation is in standard form.",
    "只有当每个方程的未知数都按约定顺序放在左边、常数放在右边时，才能直接写出增广矩阵。形式不同的方程要先整理。把一项移到等号另一边时符号会改变，矩阵记录的正是改变后的符号。对 $2x + 3 = 4y + 7$：$2x - 4y = 4$，所以这一行是 $(2, -4 \\mid 4)$。\n\n> **注意。** 每一项移过等号都要变号，常数也不例外。要先化成标准形式，再读出各元素。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const b = rng.int(2, 7);
    const d = rng.int(2, 7);
    const c = rng.int(1, 12);
    const e = rng.pick(range(1, 12).filter((v) => v !== c));
    const kind = rng.pick(["y", "z", "rhs"] as const);
    const answer = kind === "y" ? -b : kind === "z" ? d : e - c;
    const mistakes =
      kind === "y"
        ? [
            why(b, "The $y$-term moves from the right side to the left, so its sign changes.", "$y$ 项从右边移到左边，符号要改变。"),
            why(-d, "That is the entry of $z$; the question asks for the column of $y$.", "这是 $z$ 的元素；题目问的是 $y$ 这一列。"),
            why(a, "That is the coefficient of $x$; the column of $y$ comes next.", "这是 $x$ 的系数；$y$ 这一列在它后面。"),
          ]
        : kind === "z"
          ? [
              why(-d, "The $z$-term moves from the right side to the left, so its sign changes.", "$z$ 项从右边移到左边，符号要改变。"),
              why(-b, "That is the entry of $y$; the question asks for the column of $z$.", "这是 $y$ 的元素；题目问的是 $z$ 这一列。"),
              why(a, "That is the coefficient of $x$; the column of $z$ is the third.", "这是 $x$ 的系数；$z$ 这一列是第三列。"),
            ]
          : [
              why(
                e + c,
                `The constant $${c}$ moves from the left to the right, so it is subtracted.`,
                `常数 $${c}$ 从左边移到右边，所以要减去它。`,
              ),
              why(
                c - e,
                "The sign is flipped: the constants end up on the right, so the entry is $e - c$, not $c - e$.",
                "符号反了：常数最终在右边，所以元素是右边减左边。",
              ),
              why(e, `The constant $${c}$ on the left must also move to the right.`, `左边的常数 $${c}$ 也要移到右边。`),
            ];
    const where = {
      y: t("the column of $y$", "$y$ 这一列"),
      z: t("the column of $z$", "$z$ 这一列"),
      rhs: t("the column of constants", "常数列"),
    }[kind];
    const standard = `${sumOfTerms([
      [a, "x"],
      [-b, "y"],
      [d, "z"],
    ])} = ${e - c}`;
    return numberProblem({
      prompt: t(
        `The equation $${a}x + ${c} = ${b}y - ${d}z + ${e}$ is one row of a system in the unknowns $x, y, z$. In the augmented matrix $[A \\mid \\mathbf{b}]$, with columns in that order, what is the entry of this row in ${where.en}?`,
        `方程 $${a}x + ${c} = ${b}y - ${d}z + ${e}$ 是关于未知数 $x, y, z$ 的方程组中的一行。在按此顺序排列的增广矩阵 $[A \\mid \\mathbf{b}]$ 中，这一行在${where["zh-CN"]}的元素是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: mistakes.filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Put the equation in standard form", "化成标准形式"],
            t(
              "Move the unknowns to the left and the constants to the right; each term that crosses changes sign:",
              "把未知数移到左边，常数移到右边；移过等号的每一项都变号：",
            ),
            [standard],
          ],
          [["Read the entry", "读出元素"], t(`The entry in ${where.en} is $${answer}$.`, `${where["zh-CN"]}的元素是 $${answer}$。`)],
        ],
        t(
          `Moving everything back, $${a}x + ${c} = ${b}y - ${d}z + ${e}$ again, since $${e - c} + ${c} = ${e}$.`,
          `把各项移回去，又得到 $${a}x + ${c} = ${b}y - ${d}z + ${e}$，因为 $${e - c} + ${c} = ${e}$。`,
        ),
      ),
    });
  },
};

const zerosOfRowEchelonForm: KnowledgePointDef = {
  id: "zero-entries-forced-by-row-echelon-form",
  title: t("Zero entries forced by row echelon form", "行阶梯形强制出现的零元素"),
  explanation: t(
    "Row echelon form forces some entries to be zero and leaves the others free. Each pivot lies strictly to the right of the pivot above it, so the rows need longer and longer runs of leading zeros, and any row with no pivot is zero throughout. Entries above a pivot or to its right may be anything. A $3 \\times 4$ matrix with $2$ pivots needs at least $1$ zero in row $2$ and $4$ in the zero row $3$, so $5$ in all.\n\n> **Watch out.** The $i$th pivot row has at least $i - 1$ leading zeros, not $i$: the first row needs none. A row without a pivot contributes all $n$ of its entries.",
    "行阶梯形要求一部分元素为零，其余元素不受限制。每个主元都严格位于上一行主元的右边，所以各行开头的零越来越多，而没有主元的行全部为零。主元上方和右边的元素可以取任意值。有 $2$ 个主元的 $3 \\times 4$ 矩阵，第 $2$ 行至少有 $1$ 个零，零行第 $3$ 行有 $4$ 个，共至少 $5$ 个。\n\n> **注意。** 第 $i$ 个主元行开头至少有 $i - 1$ 个零，而不是 $i$ 个：第一行不需要零。没有主元的行贡献它全部 $n$ 个元素。",
  ),
  generate(rng) {
    const [m, n, r] = rng.pick(
      range(2, 6).flatMap((m) => range(2, 7).flatMap((n) => range(2, Math.min(m, n)).map((r) => [m, n, r] as const))),
    );
    const stairs = (r * (r - 1)) / 2;
    const blank = (m - r) * n;
    const answer = stairs + blank;
    const rest = m - r;
    const restEn =
      rest === 0
        ? "Every row has a pivot, so there are no zero rows."
        : `The ${rest === 1 ? "row" : `${rest} rows`} without a pivot ${rest === 1 ? "is" : "are"} all zero, which adds $${rest} \\cdot ${n} = ${blank}$.`;
    const restZh =
      rest === 0 ? "每一行都有主元，所以没有零行。" : `没有主元的 ${rest} 行全为零，增加 $${rest} \\cdot ${n} = ${blank}$ 个。`;
    return numberProblem({
      prompt: t(
        `A $${m} \\times ${n}$ matrix is in row echelon form and has exactly ${r} pivots. What is the smallest possible number of entries equal to $0$?`,
        `一个 $${m} \\times ${n}$ 矩阵是行阶梯形，恰好有 ${r} 个主元。其中等于 $0$ 的元素最少有多少个？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          stairs + rest,
          "A row without a pivot is zero in every entry, so it adds all of its entries, not one.",
          "没有主元的行每个元素都是零，所以它贡献全部元素，而不是一个。",
        ),
        why(
          (r * (r + 1)) / 2 + blank,
          "That gives the $i$th pivot row $i$ leading zeros; it needs only $i - 1$, and the first row none.",
          "这让第 $i$ 个主元行开头有 $i$ 个零；其实只需 $i - 1$ 个，第一行不需要。",
        ),
        why(
          blank + r,
          "The staircase needs $0 + 1 + \\cdots + (r - 1)$ zeros, not one per pivot.",
          "台阶需要 $0 + 1 + \\cdots + (r - 1)$ 个零，而不是每个主元一个。",
        ),
        why(
          stairs + (m - r) * (n - r),
          `A zero row has $${n}$ entries, all zero, not $${n} - ${r}$.`,
          `零行有 $${n}$ 个元素，全为零，而不是 $${n} - ${r}$ 个。`,
        ),
        why(
          m * n,
          "That counts every entry; the entries at and right of each pivot may be nonzero.",
          "这数的是全部元素；主元及其右边的元素可以不为零。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Count the staircase", "数台阶中的零"],
            t(
              `The $i$th pivot row has at least $i - 1$ leading zeros, which forces $0 + 1 + \\cdots + ${r - 1} = ${stairs}$ ${stairs === 1 ? "zero" : "zeros"}.`,
              `第 $i$ 个主元行开头至少有 $i - 1$ 个零，这要求 $0 + 1 + \\cdots + ${r - 1} = ${stairs}$ 个零。`,
            ),
          ],
          [["Count the zero rows", "数零行"], t(restEn, restZh)],
          [["Add", "相加"], t(`The minimum is $${stairs} + ${blank} = ${answer}$.`, `最少是 $${stairs} + ${blank} = ${answer}$ 个。`)],
        ],
        t(
          `Putting the pivots in the first ${r} columns and every other allowed entry nonzero reaches exactly $${answer}$ zeros, so the bound is attained.`,
          `把主元放在前 ${r} 列、其余允许的元素都不为零，恰好有 $${answer}$ 个零，所以下界可以达到。`,
        ),
      ),
    });
  },
};

const backSubstitutionCost: KnowledgePointDef = {
  id: "counting-the-operations-of-back-substitution",
  title: t("Counting the operations of back substitution", "计算回代的运算次数"),
  explanation: t(
    "The cost of back substitution comes from how much of each row is already known. The last unknown needs one division and nothing else. Every row above it has one more known unknown to multiply and subtract, so the work grows row by row, and adding it up gives a triangular number, far below the cost of elimination. With $4$ unknowns there are $0 + 1 + 2 + 3 = 6$ multiplications.\n\n> **Watch out.** The row solved $j$th from the bottom has $j - 1$ known unknowns, not $j$, so the sum runs from $0$ to $n - 1$. Divisions, one per row, are counted separately.",
    "回代的运算量取决于每一行已知的未知数有多少。最后一个未知数只需要一次除法。往上每一行都多一个已知未知数要相乘再相减，所以工作量逐行增加，加起来是一个三角形数，远小于消元的运算量。有 $4$ 个未知数时共有 $0 + 1 + 2 + 3 = 6$ 次乘法。\n\n> **注意。** 从下往上第 $j$ 个求解的行有 $j - 1$ 个已知未知数，而不是 $j$ 个，所以求和从 $0$ 到 $n - 1$。除法每行一次，要另外计数。",
  ),
  generate(rng) {
    const n = rng.int(4, 30);
    const kind = rng.pick(["mul", "all"] as const);
    const products = (n * (n - 1)) / 2;
    const answer = kind === "mul" ? products : n * n;
    return numberProblem({
      prompt:
        kind === "mul"
          ? t(
              `Back substitution solves an upper triangular system of ${n} equations in ${n} unknowns, with no zero entries on or above the diagonal. How many multiplications does it use, not counting divisions?`,
              `用回代法解一个含 ${n} 个方程、${n} 个未知数的上三角方程组，对角线及其上方没有零元素。不计除法，一共要做多少次乘法？`,
            )
          : t(
              `Back substitution solves an upper triangular system of ${n} equations in ${n} unknowns, with no zero entries on or above the diagonal. How many multiplications, subtractions and divisions does it use in total?`,
              `用回代法解一个含 ${n} 个方程、${n} 个未知数的上三角方程组，对角线及其上方没有零元素。乘法、减法和除法一共要做多少次？`,
            ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n * n,
          "That is the total of all three operations; multiplications alone number $\\frac{n(n-1)}{2}$.",
          "这是三种运算的总数；仅乘法是 $\\frac{n(n-1)}{2}$ 次。",
        ),
        why(
          (n * (n + 1)) / 2,
          "That gives the $j$th row $j$ multiplications; it has only $j - 1$ known unknowns.",
          "这让第 $j$ 行做 $j$ 次乘法；它只有 $j - 1$ 个已知未知数。",
        ),
        why(n * (n - 1), "That counts multiplications and subtractions but leaves out the divisions.", "这数了乘法和减法，却漏了除法。"),
        why(
          n * (n + 1),
          "That gives each row one operation too many of each kind; the row solved $j$th has $j - 1$ known unknowns.",
          "这让每行的每种运算都多了一次；第 $j$ 个求解的行有 $j - 1$ 个已知未知数。",
        ),
        why(products, "Those are the multiplications only; the subtractions and divisions count too.", "这只是乘法；减法和除法也要计入。"),
        why(
          2 * n - 1,
          "The work grows row by row, so the count is a sum over the rows, not a fixed amount per row.",
          "工作量逐行增加，所以次数是各行之和，而不是每行固定的量。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution:
        kind === "mul"
          ? walked(
              [
                [
                  ["Count per row", "逐行计数"],
                  t(
                    "The row solved $j$th from the bottom contains $j - 1$ unknowns already found, each multiplied by its coefficient once.",
                    "从下往上第 $j$ 个求解的行含 $j - 1$ 个已求出的未知数，每个都要与系数相乘一次。",
                  ),
                ],
                [["Add the rows", "各行相加"], t("", ""), [`0 + 1 + \\cdots + ${n - 1} = \\frac{${n} \\cdot ${n - 1}}{2} = ${answer}`]],
              ],
              t(
                `For a small case, $3$ unknowns need $0 + 1 + 2 = 3 = \\frac{3 \\cdot 2}{2}$ multiplications, matching the formula.`,
                `小情形验证：$3$ 个未知数需要 $0 + 1 + 2 = 3 = \\frac{3 \\cdot 2}{2}$ 次乘法，与公式一致。`,
              ),
            )
          : walked(
              [
                [
                  ["Count per row", "逐行计数"],
                  t(
                    "A row with $j - 1$ known unknowns uses $j - 1$ multiplications, $j - 1$ subtractions and one division.",
                    "含 $j - 1$ 个已知未知数的行要做 $j - 1$ 次乘法、$j - 1$ 次减法和一次除法。",
                  ),
                ],
                [
                  ["Add the rows", "各行相加"],
                  t(
                    `There are $\\frac{${n} \\cdot ${n - 1}}{2} = ${products}$ multiplications, as many subtractions and ${n} divisions:`,
                    `乘法有 $\\frac{${n} \\cdot ${n - 1}}{2} = ${products}$ 次，减法同样多，除法 ${n} 次：`,
                  ),
                  [`2 \\cdot ${products} + ${n} = ${answer}`],
                ],
              ],
              t(
                `$2 \\cdot \\frac{n(n-1)}{2} + n = n^2$, and $${n}^2 = ${answer}$.`,
                `$2 \\cdot \\frac{n(n-1)}{2} + n = n^2$，而 $${n}^2 = ${answer}$。`,
              ),
            ),
    });
  },
};

const preserversOfAGivenWeight: KnowledgePointDef = {
  id: "truth-preserving-functions-of-a-given-weight",
  title: t("Truth-preserving functions of a given weight", "给定权重的保值函数"),
  explanation: t(
    "Preserving or failing to preserve a constant fixes the value of a function on one particular input: all zeros for the constant zero, all ones for the constant one. These two rows of the table are then settled, and the remaining rows are still free. A condition on the number of ones must be split between the fixed rows and the free ones. With $5$ variables, a function that preserves both $0$ and $1$ and equals $1$ on exactly $4$ inputs already has one $1$ at $(1, \\dots, 1)$, so the other $3$ go among $32 - 2 = 30$ inputs: $\\binom{30}{3} = 4060$ functions.\n\n> **Watch out.** The two fixed rows may already hold some of the $k$ ones, so subtract them before choosing; and only $2^n - 2$ inputs remain free.",
    "是否保某个常数，决定了函数在一个特定输入上的值：保 0 看全零输入，保 1 看全一输入。这样真值表的两行就确定了，其余各行仍然自由。对取一个数的要求，要分别算在已确定的行和自由的行上。$5$ 个变量时，既保 $0$ 又保 $1$、恰在 $4$ 个输入上取 $1$ 的函数已在 $(1, \\dots, 1)$ 处有一个 $1$，其余 $3$ 个放在 $32 - 2 = 30$ 个输入中：共 $\\binom{30}{3} = 4060$ 个函数。\n\n> **注意。** 两个固定的行可能已经占了 $k$ 个 $1$ 中的几个，要先减去再选；而且只有 $2^n - 2$ 个输入仍然自由。",
  ),
  generate(rng) {
    const [n, k, kind] = rng.pick(
      [3, 4].flatMap((n) =>
        range(2, 6).flatMap((k) =>
          (["both", "neither", "zero", "one"] as const).filter((kind) => kind !== "one" || k >= 3).map((kind) => [n, k, kind] as const),
        ),
      ),
    );
    const free = 2 ** n - 2;
    const fixedOnes = ({ both: 1, neither: 1, zero: 0, one: 2 } as const)[kind];
    const pickOnes = k - fixedOnes;
    const answer = binom(free, pickOnes);
    const condition = {
      both: t("preserve both $0$ and $1$", "既保 $0$ 又保 $1$"),
      neither: t("preserve neither $0$ nor $1$", "既不保 $0$ 也不保 $1$"),
      zero: t("preserve $0$ but not $1$", "保 $0$ 但不保 $1$"),
      one: t("preserve $1$ but not $0$", "保 $1$ 但不保 $0$"),
    }[kind];
    const values = {
      both: "f(0, \\dots, 0) = 0, f(1, \\dots, 1) = 1",
      neither: "f(0, \\dots, 0) = 1, f(1, \\dots, 1) = 0",
      zero: "f(0, \\dots, 0) = 0, f(1, \\dots, 1) = 0",
      one: "f(0, \\dots, 0) = 1, f(1, \\dots, 1) = 1",
    }[kind];
    const ones = {
      0: t("neither equals $1$", "两个都不是 $1$"),
      1: t("exactly one equals $1$", "恰有一个是 $1$"),
      2: t("both equal $1$", "两个都是 $1$"),
    }[fixedOnes];
    return numberProblem({
      prompt: t(
        `How many Boolean functions of $${n}$ variables ${condition.en} and equal $1$ on exactly $${k}$ of their inputs?`,
        `有多少个 $${n}$ 元布尔函数${condition["zh-CN"]}，并且恰好在 $${k}$ 个输入上取值为 $1$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(binom(2 ** n, k), "That ignores the condition, which fixes two rows of the table.", "那是忽略了条件，它固定了真值表的两行。"),
        why(binom(2 ** n - 1, k), "That fixes only one of the two rows.", "那是只固定了两行中的一行。"),
        ...[k, k - 1, k - 2]
          .filter((j) => j >= 0 && j !== pickOnes)
          .map((j) =>
            why(
              binom(free, j),
              `That places $${j}$ ones among the free inputs, but the fixed rows hold $${fixedOnes}$ of the $${k}$, so $${pickOnes}$ remain.`,
              `那是在自由的输入中放了 $${j}$ 个 $1$，但固定的两行占了 $${k}$ 个中的 $${fixedOnes}$ 个，所以只剩 $${pickOnes}$ 个。`,
            ),
          ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Fix the two rows", "固定两行"],
            t(
              `The condition means $${values}$; of these two values, ${ones.en}.`,
              `这个条件就是 $${values}$；这两个值中${ones["zh-CN"]}。`,
            ),
          ],
          [
            ["Count the ones still to place", "数还要放的 1"],
            t(
              `$${k} - ${fixedOnes} = ${pickOnes}$ ${pickOnes === 1 ? "one goes" : "ones go"} among the other $2^{${n}} - 2 = ${free}$ inputs.`,
              `还有 $${k} - ${fixedOnes} = ${pickOnes}$ 个 $1$ 要放在其余 $2^{${n}} - 2 = ${free}$ 个输入中。`,
            ),
          ],
          [
            ["Choose their places", "选择位置"],
            t(`$\\binom{${free}}{${pickOnes}} = ${answer}$.`, `$\\binom{${free}}{${pickOnes}} = ${answer}$。`),
          ],
        ],
        t(
          `Choosing the $${free - pickOnes}$ free ${free - pickOnes === 1 ? "input that gets" : "inputs that get"} $0$ instead gives $\\binom{${free}}{${free - pickOnes}} = ${answer}$ as well.`,
          `改为选出取 $0$ 的 $${free - pickOnes}$ 个自由输入，同样得 $\\binom{${free}}{${free - pickOnes}} = ${answer}$。`,
        ),
      ),
    });
  },
};

/** postPool lists functions of x, y, z for testing completeness, with their LaTeX. */
const postPool: readonly (readonly [string, (x: number, y: number, z: number) => number])[] = [
  ["x \\wedge y", (x, y) => x & y],
  ["x \\vee y", (x, y) => x | y],
  ["\\neg x", (x) => 1 - x],
  ["x \\oplus y", (x, y) => x ^ y],
  ["x \\Leftrightarrow y", (x, y) => 1 - (x ^ y)],
  ["x \\Rightarrow y", (x, y) => (1 - x) | y],
  ["x \\oplus y \\oplus z", (x, y, z) => x ^ y ^ z],
  ["x \\wedge \\neg y", (x, y) => x & (1 - y)],
  ["(x \\wedge y) \\vee (y \\wedge z) \\vee (x \\wedge z)", (x, y, z) => (x & y) | (y & z) | (x & z)],
  ["0", () => 0],
  ["1", () => 1],
];
/** postEscapes lists the Post classes T0, T1, S, M, L that a function of three variables lies outside. */
const postEscapes = (f: (x: number, y: number, z: number) => number) => {
  const at = (v: number) => f((v >> 2) & 1, (v >> 1) & 1, v & 1);
  const inputs = range(0, 7);
  const out: string[] = [];
  if (at(0) !== 0) out.push("T_0");
  if (at(7) !== 1) out.push("T_1");
  if (inputs.some((v) => at(v) === at(7 - v))) out.push("S");
  if (inputs.some((v) => inputs.some((w) => (v & w) === v && at(v) > at(w)))) out.push("M");
  if (inputs.some((v) => inputs.some((w) => (at(v ^ w) ^ at(v) ^ at(w) ^ at(0)) !== 0))) out.push("L");
  return out;
};
const CLASSES = ["T_0", "T_1", "S", "M", "L"];
/** smallestCompletePart gives the indices of a smallest functionally complete part of a list of escape lists, or undefined when the whole list is not complete. */
const smallestCompletePart = (escapes: readonly (readonly string[])[]) => {
  const masks = range(1, 2 ** escapes.length - 1).sort(
    (a, b) => a.toString(2).replaceAll("0", "").length - b.toString(2).replaceAll("0", "").length || a - b,
  );
  for (const mask of masks) {
    const part = range(0, escapes.length - 1).filter((i) => (mask >> i) & 1);
    if (CLASSES.every((c) => part.some((i) => (escapes[i] as readonly string[]).includes(c)))) return part;
  }
  return undefined;
};

const smallestCompleteSubset: KnowledgePointDef = {
  id: "the-smallest-complete-subset-of-a-set-of-functions",
  title: t("The smallest complete subset of a set of functions", "函数集的最小完备子集"),
  explanation: t(
    "Post's theorem turns completeness into a covering question. Record, for each function, which of the five classes it lies outside. A subset is complete exactly when every class is left by at least one chosen function, so finding the smallest complete subset means covering all five classes with as few functions as possible. Among $x \\wedge y$, $x \\vee y$ and $1 \\oplus x \\oplus y \\oplus z$, the first two each leave only $S$ and $L$, while the third leaves $T_0$, $T_1$ and $M$; so $\\{x \\vee y, 1 \\oplus x \\oplus y \\oplus z\\}$ is complete and the smallest number is $2$.\n\n> **Watch out.** One function can leave several classes at once, so fewer than five functions may be enough; and every class must be left, including $S$ and $L$, which are easy to forget.",
    "波斯特定理把完备性变成了一个覆盖问题。对每个函数，记下它不属于五个类中的哪些。一个子集完备，当且仅当每个类都至少有一个选中的函数不属于它，所以求最小完备子集，就是用尽量少的函数覆盖全部五个类。在 $x \\wedge y$、$x \\vee y$、$1 \\oplus x \\oplus y \\oplus z$ 中，前两个都只不属于 $S$ 和 $L$，第三个不属于 $T_0$、$T_1$ 和 $M$；所以 $\\{x \\vee y, 1 \\oplus x \\oplus y \\oplus z\\}$ 完备，最少是 $2$ 个。\n\n> **注意。** 一个函数可以同时不属于几个类，所以不到五个函数也可能够用；每个类都必须有函数不属于它，包括容易忘记的 $S$ 和 $L$。",
  ),
  generate(rng) {
    let chosen = [0, 2, 9, 3];
    let part = [0, 1];
    for (let attempt = 0; attempt < 200; attempt++) {
      const trial = sampleFrom(rng, range(0, postPool.length - 1), rng.int(3, 5));
      const found = smallestCompletePart(trial.map((i) => postEscapes((postPool[i] as (typeof postPool)[number])[1])));
      if (found && found.length >= 2) {
        chosen = trial;
        part = found;
        break;
      }
    }
    const functions = chosen.map((i) => postPool[i] as (typeof postPool)[number]);
    const answer = part.length;
    const listing = functions.map(([latex]) => latex).join(", \\quad ");
    const lines = functions.map(([latex, f]) => [latex, postEscapes(f).join(", ")] as const);
    const best = part.map((i) => (functions[i] as (typeof postPool)[number])[0]).join(", \\ ");
    const cover = CLASSES.map((c) => {
      const [latex] = part.map((i) => functions[i] as (typeof postPool)[number]).find(([, f]) => postEscapes(f).includes(c)) ?? ["?"];
      return [c, latex] as const;
    });
    return numberProblem({
      prompt: t(
        `Consider the functions $${listing}$ of the variables $x, y, z$. These functions together are functionally complete. What is the smallest number of them that still form a functionally complete set?`,
        `考虑变量 $x, y, z$ 的函数 $${listing}$。这些函数合在一起是函数完备的。最少选其中几个，仍能构成函数完备集？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          answer - 1,
          `That is too few: ${answer - 1 === 1 ? "no single function leaves" : `no $${answer - 1}$ of the functions leave`} all five classes.`,
          `那太少了：任何 $${answer - 1}$ 个函数都不能使五个类都有函数不属于它。`,
        ),
        why(functions.length, "That keeps every function, but some of them are not needed.", "那是保留了所有函数，但其中有些并不需要。"),
        why(
          5,
          "That takes one function per class, but one function can leave several classes.",
          "那是每个类取一个函数，但一个函数可以同时不属于几个类。",
        ),
      ].filter((m, i, all) => m.value !== answer && m.value !== 0 && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["List the classes each function leaves", "列出每个函数不属于的类"],
            t(`${lines.map(([f, out]) => `$${f}$: $${out}$`).join("; ")}.`, `${lines.map(([f, out]) => `$${f}$：$${out}$`).join("；")}。`),
          ],
          [
            ["Rule out smaller subsets", "排除更小的子集"],
            t(
              `A complete subset must leave each of $T_0, T_1, S, M, L$, and no ${answer - 1 === 1 ? "single function does" : `$${answer - 1}$ functions do`}.`,
              `完备子集必须对 $T_0, T_1, S, M, L$ 每一类都有函数不属于它，而任何 $${answer - 1}$ 个函数都做不到。`,
            ),
          ],
          [
            ["Find a smallest cover", "找出最小的覆盖"],
            t(`The functions $${best}$ do, so the smallest number is $${answer}$.`, `函数 $${best}$ 可以做到，所以最少是 $${answer}$ 个。`),
          ],
        ],
        t(
          `Class by class, the chosen functions leave each one: ${cover.map(([c, f]) => `$${c}$ by $${f}$`).join(", ")}.`,
          `逐类检查，选中的函数使每一类都有函数不属于它：${cover.map(([c, f]) => `$${c}$ 由 $${f}$`).join("，")}。`,
        ),
      ),
    });
  },
};

const GATE_OPERATIONS: Readonly<Record<string, (a: number, b: number) => number>> = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
  NAND: (a, b) => 1 - (a & b),
  NOR: (a, b) => 1 - (a | b),
};

/** PARTNER is the gate a gate is most easily mistaken for. */
const PARTNER: Readonly<Record<string, string>> = { AND: "OR", OR: "AND", XOR: "OR", NAND: "AND", NOR: "OR" };

/** misreadGate is the operation of the gate a gate is mistaken for. */
const misreadGate = (op: string) => GATE_OPERATIONS[PARTNER[op] as string] as (a: number, b: number) => number;

/** article is the indefinite article before a gate name read aloud: "an AND", "a NOR". */
const article = (op: string) => (["AND", "OR", "XOR"].includes(op) ? "an" : "a");

const inputsThatLightACircuit: KnowledgePointDef = {
  id: "counting-the-inputs-that-make-a-circuit-output-one",
  title: t("Counting the inputs that make a circuit output one", "计算使电路输出一的输入个数"),
  explanation: t(
    "Tracing a circuit on one input tells you a single row of its truth table. To describe the whole circuit, repeat the trace for every combination of inputs, working through the gates in order so that each gate's inputs are known before it is evaluated. With three inputs there are eight rows to fill in. For $g_{1} = \\mathrm{OR}(x, y)$, $g_{2} = \\mathrm{NOT}(z)$, $g_{3} = \\mathrm{AND}(g_{1}, g_{2})$, the output is $1$ when $z = 0$ and $x$ or $y$ is $1$: on $(0, 1, 0)$, $(1, 0, 0)$ and $(1, 1, 0)$, so $3$ rows.\n\n> **Watch out.** Trace all eight rows and compute $g_{1}$ and $g_{2}$ before $g_{3}$; NAND and NOR give $1$ exactly where AND and OR give $0$.",
    "在一个输入上追踪电路，只得到真值表的一行。要了解整个电路，就对每种输入组合都追踪一次，并按顺序计算各门，使每个门的输入在计算它之前已经确定。三个输入共有八行要填。对 $g_{1} = \\mathrm{OR}(x, y)$，$g_{2} = \\mathrm{NOT}(z)$，$g_{3} = \\mathrm{AND}(g_{1}, g_{2})$，输出在 $z = 0$ 且 $x$ 或 $y$ 为 $1$ 时为 $1$：即 $(0, 1, 0)$、$(1, 0, 0)$、$(1, 1, 0)$ 三行。\n\n> **注意。** 要追踪全部八行，并先算 $g_{1}$ 和 $g_{2}$ 再算 $g_{3}$；与非门和或非门恰好在与门和或门取 $0$ 的地方取 $1$。",
  ),
  generate(rng) {
    const names = Object.keys(GATE_OPERATIONS);
    const rows = range(0, 7).map((v) => [(v >> 2) & 1, (v >> 1) & 1, v & 1] as const);
    for (;;) {
      const [op1, op2, op3] = [rng.pick(names), rng.pick(names), rng.pick(names)];
      const second = rng.pick(["x", "y"]);
      const f1 = GATE_OPERATIONS[op1] as (a: number, b: number) => number;
      const f2 = GATE_OPERATIONS[op2] as (a: number, b: number) => number;
      const f3 = GATE_OPERATIONS[op3] as (a: number, b: number) => number;
      const lit = rows.filter(([x, y, z]) => f3(f1(x, y), f2(second === "x" ? x : y, z)) === 1);
      const answer = lit.length;
      if (answer < 2 || answer > 6) continue;
      const gates = `g_{1} = \\mathrm{${op1}}(x, y)$, $g_{2} = \\mathrm{${op2}}(${second}, z)$, $g_{3} = \\mathrm{${op3}}(g_{1}, g_{2})`;
      const list = lit.map(([x, y, z]) => `(${x}, ${y}, ${z})`).join(", ");
      const first = lit[0] as (typeof rows)[number];
      const g1 = f1(first[0], first[1]);
      const g2 = f2(second === "x" ? first[0] : first[1], first[2]);
      const misread = (op: string, a: typeof f1, b: typeof f2) =>
        rows.filter(([x, y, z]) => misreadGate(op)(a(x, y), b(second === "x" ? x : y, z)) === 1).length;
      return numberProblem({
        prompt: t(
          `A circuit has inputs $x, y, z$ and gates $${gates}$, with output $g_{3}$. For how many of the $8$ input combinations is the output $1$?`,
          `一个电路的输入是 $x, y, z$，门为 $${gates.replaceAll("$, $", "$、$")}$，输出是 $g_{3}$。在 $8$ 种输入组合中，有多少种使输出为 $1$？`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(8 - answer, "That counts the inputs on which the output is $0$.", "那是输出为 $0$ 的输入个数。"),
          why(
            misread(op3, f1, f2),
            `That reads the output gate $g_{3}$, ${article(op3)} ${op3} gate, as ${PARTNER[op3]}.`,
            `那是把输出门 $g_{3}$（${op3} 门）当成了 ${PARTNER[op3]} 门。`,
          ),
          why(
            rows.filter(([x, y, z]) => f3(misreadGate(op1)(x, y), f2(second === "x" ? x : y, z)) === 1).length,
            `That reads the gate $g_{1}$, ${article(op1)} ${op1} gate, as ${PARTNER[op1]}.`,
            `那是把门 $g_{1}$（${op1} 门）当成了 ${PARTNER[op1]} 门。`,
          ),
          why(
            rows.filter(([x, y, z]) => f3(f1(x, y), misreadGate(op2)(second === "x" ? x : y, z)) === 1).length,
            `That reads the gate $g_{2}$, ${article(op2)} ${op2} gate, as ${PARTNER[op2]}.`,
            `那是把门 $g_{2}$（${op2} 门）当成了 ${PARTNER[op2]} 门。`,
          ),
        ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
        solution: walked(
          [
            [
              ["Trace every row", "追踪每一行"],
              t(
                "Evaluate $g_{1}$, then $g_{2}$, then $g_{3}$ on each of the eight rows.",
                "在八行中的每一行依次计算 $g_{1}$、$g_{2}$、$g_{3}$。",
              ),
            ],
            [
              ["Count the rows with output 1", "数输出为 1 的行"],
              t(
                `The output is $1$ exactly on $(x, y, z) = ${list}$, so the count is $${answer}$.`,
                `输出为 $1$ 的恰好是 $(x, y, z) = ${list}$，所以有 $${answer}$ 种。`,
              ),
            ],
          ],
          t(
            `On the first of these rows, $(${first.join(", ")})$: $g_{1} = ${g1}$, $g_{2} = ${g2}$ and $g_{3} = \\mathrm{${op3}}(${g1}, ${g2}) = 1$.`,
            `在其中第一行 $(${first.join(", ")})$ 上：$g_{1} = ${g1}$，$g_{2} = ${g2}$，$g_{3} = \\mathrm{${op3}}(${g1}, ${g2}) = 1$。`,
          ),
        ),
      });
    }
  },
};

const gatesSavedByFactoring: KnowledgePointDef = {
  id: "gates-saved-by-factoring-a-circuit",
  title: t("Gates saved by factoring a circuit", "因式分解节省的门数"),
  explanation: t(
    "The distributive law often makes a circuit much smaller. A product of two sums multiplied out has one AND for every pair of terms, and these must then be joined by ORs, so the expanded form grows with the product of the two sizes. The factored form grows only with their sum, since each input is used once. With $10$ and $12$ variables, the expanded circuit has $120$ ANDs and $119$ ORs, $239$ gates, while the factored one has $9 + 11$ ORs and one AND, $21$ gates: $218$ are saved.\n\n> **Watch out.** Joining $m$ terms takes $m - 1$ OR gates, and the ANDs count too; the question asks for the difference of the two sizes, not either size.",
    "分配律常常能让电路小很多。两个和式的积展开后，每一对项都要一个与门，再用或门连接起来，所以展开式的规模随两个大小的乘积增长。分解后的形式只随它们的和增长，因为每个输入只用一次。$10$ 个与 $12$ 个变量时，展开的电路有 $120$ 个与门和 $119$ 个或门，共 $239$ 个门；分解的电路有 $9 + 11$ 个或门和一个与门，共 $21$ 个门：节省 $218$ 个。\n\n> **注意。** 连接 $m$ 项需要 $m - 1$ 个或门，与门也要算上；题目问的是两种规模之差，而不是其中某一个规模。",
  ),
  generate(rng) {
    const p = rng.int(2, 7);
    const q = rng.int(2, 7);
    const pairs = p * q;
    const expanded = 2 * pairs - 1;
    const factored = p + q - 1;
    const answer = expanded - factored;
    return numberProblem({
      prompt: t(
        `A circuit of two-input AND and OR gates computes an OR of $${pairs}$ products, each pairing one of $${p}$ different variables with one of $${q}$ other different variables. How many gates are saved by replacing it with the circuit for the factored form, an AND of an OR of the $${p}$ variables and an OR of the $${q}$ variables?`,
        `一个由二输入与门和或门组成的电路计算 $${pairs}$ 个积的或，每个积由 $${p}$ 个不同变量之一和另外 $${q}$ 个不同变量之一配成。把它换成分解形式的电路，即 $${p}$ 个变量的或与 $${q}$ 个变量的或再取与，能节省多少个门？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(expanded, "That is the size of the expanded circuit, not the saving.", "那是展开电路的规模，而不是节省的门数。"),
        why(factored, "That is the size of the factored circuit, not the saving.", "那是分解电路的规模，而不是节省的门数。"),
        why(pairs, "That counts only the ANDs of the expanded circuit.", "那是只数了展开电路中的与门。"),
        why(pairs - factored, "That leaves out the ORs that join the products.", "那是漏掉了连接各个积的或门。"),
      ].filter((m, i, all) => m.value !== answer && m.value !== 0 && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Count the expanded circuit", "数展开的电路"],
            t(
              `$${pairs}$ ANDs and $${pairs - 1}$ ORs to join them: $${expanded}$ gates.`,
              `$${pairs}$ 个与门和连接它们的 $${pairs - 1}$ 个或门：共 $${expanded}$ 个门。`,
            ),
          ],
          [
            ["Count the factored circuit", "数分解的电路"],
            t(
              `$${p - 1} + ${q - 1}$ ORs and one AND: $${factored}$ gates.`,
              `$${p - 1} + ${q - 1}$ 个或门和一个与门：共 $${factored}$ 个门。`,
            ),
          ],
          [["Subtract", "相减"], t(`$${expanded} - ${factored} = ${answer}$.`, `$${expanded} - ${factored} = ${answer}$。`)],
        ],
        t(
          `In general the saving is $(2pq - 1) - (p + q - 1) = 2pq - p - q$, and $2 \\cdot ${p} \\cdot ${q} - ${p} - ${q} = ${answer}$.`,
          `一般地，节省的门数是 $(2pq - 1) - (p + q - 1) = 2pq - p - q$，而 $2 \\cdot ${p} \\cdot ${q} - ${p} - ${q} = ${answer}$。`,
        ),
      ),
    });
  },
};

const remainderOfARandomVariable: KnowledgePointDef = {
  id: "probabilities-of-a-remainder",
  title: t("Probabilities of a remainder", "余数的概率"),
  explanation: t(
    "Taking a remainder is a many-to-one transformation with a pattern: all values of the variable in the same residue class map to the same result. To find the probability of a given remainder, identify every listed value in that class and add their probabilities. Values that are far apart can still land on the same result.",
    "取余数是一种有规律的多对一变换：属于同一剩余类的变量值都映到同一个结果。要求某个余数的概率，就找出表中属于这一类的所有值，把它们的概率相加。相距很远的值也可能得到同一个结果。",
  ),
  generate(rng) {
    for (;;) {
      const m = rng.pick([3, 4, 5]);
      const xs = sampleFrom(rng, range(1, 12), 5).sort((a, b) => a - b);
      const cuts = sampleFrom(rng, range(1, 9), 4).sort((a, b) => a - b);
      const marks = [0, ...cuts, 10];
      const tenths = marks.slice(1).map((c, i) => c - (marks[i] as number));
      const classes = range(0, m - 1).filter((r) => xs.filter((x) => x % m === r).length >= 2);
      if (classes.length === 0) continue;
      const r = rng.pick(classes);
      const members = xs.flatMap((x, i) => (x % m === r ? [[x, tenths[i] as number] as const] : []));
      const total = members.reduce((s, [, p]) => s + p, 0);
      if (total === 10) continue;
      const answer = Q.of(total, 10);
      const dec1 = (tenth: number) => (tenth === 10 ? "1" : `0.${tenth}`);
      const head = xs.map((x) => `$${x}$`).join(" | ");
      const body = tenths.map((p) => `$${dec1(p)}$`).join(" | ");
      const table = `| $x$ | ${head} |\n| :---: | ${xs.map(() => ":---:").join(" | ")} |\n| $P(X = x)$ | ${body} |`;
      const values = members.map(([x]) => x).join(", ");
      const adds = members.map(([, p]) => dec1(p)).join(" + ");
      return numberProblem({
        prompt: t(
          `The random variable $X$ has the distribution below.\n\n${table}\n\nLet $Y$ be the remainder when $X$ is divided by $${m}$. Find $P(Y = ${r})$.`,
          `随机变量 $X$ 的分布如下。\n\n${table}\n\n设 $Y$ 是 $X$ 除以 $${m}$ 的余数。求 $P(Y = ${r})$。`,
        ),
        answer,
        form: "decimal",
        wrong: [
          Q.of((members[0] as readonly [number, number])[1], 10),
          Q.of(10 - total, 10),
          Q.of(1, m),
          Q.of(total + 1, 10),
          Q.of(total - 1, 10),
        ],
        solution: t(
          `The listed values that leave remainder $${r}$ on division by $${m}$ are $${values}$. Their probabilities add up: $${adds} = ${dec1(total)}$.`,
          `表中除以 $${m}$ 余 $${r}$ 的值是 $${values}$。把它们的概率相加：$${adds} = ${dec1(total)}$。`,
        ),
      });
    }
  },
};

const matchingNeighbours: KnowledgePointDef = {
  id: "the-expected-number-of-matching-neighbours",
  title: t("The expected number of matching neighbours", "相邻相同的期望对数"),
  explanation: t(
    "Linearity of expectation handles counts that have no convenient distribution. Write the count as a sum of indicators, one for each place where the event could occur, and add their expected values. Each indicator's expectation is simply the probability of its event, and the addition is valid whether or not the indicators are independent.",
    "期望的线性性可以处理那些没有方便分布的计数。把计数写成示性变量的和，事件可能发生的每个位置对应一个，再把它们的期望相加。每个示性变量的期望就是对应事件的概率，无论这些变量是否独立，相加都成立。",
  ),
  generate(rng) {
    const s = rng.pick([4, 6, 8, 10, 12]);
    const n = rng.int(5, 25);
    const answer = Q.of(n - 1, s);
    return numberProblem({
      prompt: t(
        `A row of ${n} fair dice, each with ${s} faces, is rolled. A pair of neighbouring dice matches when they show the same number. Find the expected number of matching neighbouring pairs.`,
        `掷一排 ${n} 枚公平的骰子，每枚有 ${s} 个面。相邻两枚骰子点数相同时，称这一对匹配。求匹配的相邻对数的期望。`,
      ),
      answer,
      wrong: [Q.of(n, s), Q.of(n - 1, s * s), Q.of(n - 2, s), Q.of(1, s), Q.of(n - 1, s - 1)],
      solution: t(
        `There are ${n - 1} neighbouring pairs, and whatever the first die of a pair shows, the second matches it with probability $\\frac{1}{${s}}$. Adding one indicator for each pair gives $\\frac{${n - 1}}{${s}}${gcd(n - 1, s) === 1 ? "" : ` = ${answer.toLatex()}`}$.`,
        `相邻的对共有 ${n - 1} 个，无论一对中第一枚显示什么，第二枚与它相同的概率都是 $\\frac{1}{${s}}$。对每一对加一个示性变量，得到 $\\frac{${n - 1}}{${s}}${gcd(n - 1, s) === 1 ? "" : ` = ${answer.toLatex()}`}$。`,
      ),
    });
  },
};

const thirdCentralMoment: KnowledgePointDef = {
  id: "the-third-central-moment-from-raw-moments",
  title: t("The third central moment from raw moments", "由原点矩求三阶中心矩"),
  explanation: t(
    "The central moments measure spread and asymmetry around the mean, and they can be recovered from the raw moments without knowing the distribution. Expand the power of the difference with the binomial theorem and take expectations term by term, treating the mean as a constant. The sign of the third central moment then shows the skew.",
    "中心矩度量围绕均值的离散和不对称程度，不必知道分布，也能由原点矩求出。用二项式定理展开差的幂，再逐项取期望，把均值当作常数。三阶中心矩的符号就显示了偏斜的方向。",
  ),
  generate(rng) {
    const m = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const s = m * m + rng.int(1, 12);
    const third = rng.int(1, 60);
    const answer = third - 3 * m * s + 2 * m ** 3;
    return numberProblem({
      prompt: t(
        `$E(X) = ${m}$, $E(X^2) = ${s}$ and $E(X^3) = ${third}$. Find $E\\big((X - E(X))^3\\big)$.`,
        `$E(X) = ${m}$，$E(X^2) = ${s}$，$E(X^3) = ${third}$。求 $E\\big((X - E(X))^3\\big)$。`,
      ),
      answer,
      form: "integer",
      wrong: [
        third - m ** 3,
        third - 3 * m * s,
        third - 3 * m * s - 2 * m ** 3,
        third - 3 * m * s + m ** 3,
        third + 3 * m * s + 2 * m ** 3,
      ],
      solution: t(
        `Write $\\mu$ for the mean and expand: $E\\big((X - \\mu)^3\\big) = E(X^3) - 3\\mu E(X^2) + 3\\mu^2 E(X) - \\mu^3 = E(X^3) - 3\\mu E(X^2) + 2\\mu^3$. This is $${third} - 3 \\cdot ${inParens(m)} \\cdot ${s} + 2 \\cdot ${inParens(m ** 3)} = ${answer}$.`,
        `记均值为 $\\mu$ 并展开：$E\\big((X - \\mu)^3\\big) = E(X^3) - 3\\mu E(X^2) + 3\\mu^2 E(X) - \\mu^3 = E(X^3) - 3\\mu E(X^2) + 2\\mu^3$。代入得 $${third} - 3 \\cdot ${inParens(m)} \\cdot ${s} + 2 \\cdot ${inParens(m ** 3)} = ${answer}$。`,
      ),
    });
  },
};

const largestOfTwoDraws: KnowledgePointDef = {
  id: "the-distribution-of-the-larger-of-two-draws",
  title: t("The distribution of the larger of two draws", "两次抽取中较大值的分布"),
  explanation: t(
    "The larger of two uniform draws is not uniform, because large values have more ways to be the maximum. The easy route is through the cumulative probability: the larger value is at most some number exactly when both draws are. Subtracting consecutive cumulative probabilities then gives the probability of each individual value.",
    "两次均匀抽取中的较大值不再服从均匀分布，因为较大的值有更多方式成为最大值。简便的做法是通过累积概率：较大值不超过某个数，当且仅当两次抽取都不超过它。把相邻的累积概率相减，就得到每个值的概率。",
  ),
  generate(rng) {
    const n = rng.int(6, 20);
    const k = rng.int(2, n);
    const answer = Q.of(2 * k - 1, n * n);
    return numberProblem({
      prompt: t(
        `A ticket is drawn at random from tickets numbered $1$ to $${n}$, returned, and a second ticket is drawn. $L$ is the larger of the two numbers (or their common value if they are equal). Find $P(L = ${k})$.`,
        `从编号 $1$ 到 $${n}$ 的奖券中随机抽一张，放回后再抽一张。$L$ 是两个号码中较大的一个（相等时取这个相同的值）。求 $P(L = ${k})$。`,
      ),
      answer,
      form: "fraction",
      wrong: [Q.of(k * k, n * n), Q.of(2 * k, n * n), Q.of(2 * k - 2, n * n), Q.of(1, n), Q.of(k, n)],
      solution: t(
        `$L \\le ${k}$ requires both draws to be at most $${k}$, which is ${k * k} of the ${n * n} equally likely outcomes, and $L \\le ${k - 1}$ is ${(k - 1) ** 2} of them. So $L = ${k}$ on $${k * k} - ${(k - 1) ** 2} = ${2 * k - 1}$ outcomes, and the probability is $${answer.toLatex()}$.`,
        `$L \\le ${k}$ 要求两次都不超过 $${k}$，这是 ${n * n} 种等可能结果中的 ${k * k} 种；$L \\le ${k - 1}$ 是其中的 ${(k - 1) ** 2} 种。所以 $L = ${k}$ 有 $${k * k} - ${(k - 1) ** 2} = ${2 * k - 1}$ 种结果，概率是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const negativeBinomialThroughBinomial: KnowledgePointDef = {
  id: "negative-binomial-tail-through-the-binomial",
  title: t("A negative binomial tail through the binomial", "用二项分布求负二项分布的累积概率"),
  explanation: t(
    "A question about waiting for successes can be turned into a question about counting them. Needing no more than a given number of trials to reach a target number of successes means exactly that those trials contain at least the target. So a cumulative negative binomial probability equals a binomial tail, which often has fewer terms to add.",
    "关于等待成功的问题可以转化成关于计数成功的问题。达到目标成功次数所需的试验不超过某个数，恰好意味着这些试验中至少有目标次数的成功。所以负二项分布的累积概率等于二项分布的尾概率，要加的项往往更少。",
  ),
  generate(rng) {
    const [pn, pd] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
    ] as const);
    const r = rng.int(2, 4);
    const k = r + rng.int(1, 3);
    const p = Q.of(pn, pd);
    const q = Q.of(1).sub(p);
    const binomialTerm = (j: number) =>
      Q.of(binom(k, j))
        .mul(p.pow(j))
        .mul(q.pow(k - j));
    const answer = range(r, k).reduce((s, j) => s.add(binomialTerm(j)), Q.of(0));
    const exactly = Q.of(binom(k - 1, r - 1))
      .mul(p.pow(r))
      .mul(q.pow(k - r));
    return numberProblem({
      prompt: t(
        `Independent trials each succeed with probability $${p.toLatex()}$. $X$ is the number of trials needed for $${r}$ successes. Find $P(X \\le ${k})$.`,
        `独立试验每次成功的概率为 $${p.toLatex()}$。$X$ 是取得 $${r}$ 次成功所需的试验次数。求 $P(X \\le ${k})$。`,
      ),
      answer,
      form: "fraction",
      wrong: [exactly, binomialTerm(r), Q.of(1).sub(answer), answer.sub(exactly), binomialTerm(k)],
      solution: t(
        `$X \\le ${k}$ means that the first ${k} trials contain at least ${r} successes. So $P(X \\le ${k}) = \\sum_{j=${r}}^{${k}} \\binom{${k}}{j} \\left(${p.toLatex()}\\right)^{j} \\left(${q.toLatex()}\\right)^{${k} - j} = ${answer.toLatex()}$.`,
        `$X \\le ${k}$ 表示前 ${k} 次试验中至少有 ${r} 次成功。所以 $P(X \\le ${k}) = \\sum_{j=${r}}^{${k}} \\binom{${k}}{j} \\left(${p.toLatex()}\\right)^{j} \\left(${q.toLatex()}\\right)^{${k} - j} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const lengthOfASeries: KnowledgePointDef = {
  id: "the-length-of-a-first-to-win-series",
  title: t("The length of a first-to-win series", "先胜赛制的比赛场数"),
  explanation: t(
    "A contest played until one side reaches a set number of wins can end with either side winning, so its length combines two negative binomial probabilities. For one side to win in a particular game, it must win that game and exactly one fewer than the target among the games before it. Add the cases for the two sides.",
    "一直比到一方达到规定胜场数的比赛，可能由任一方结束，所以场数的概率由两个负二项概率组成。一方要在某一场取胜结束，必须赢下这一场，并在之前的比赛中恰好赢目标数减一场。再把双方的情形相加。",
  ),
  generate(rng) {
    const p = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(1, 4), Q.of(3, 4), Q.of(2, 5), Q.of(3, 5)]);
    const q = Q.of(1).sub(p);
    const w = rng.int(3, 5);
    const g = w + rng.int(1, w - 1);
    const ways = binom(g - 1, w - 1);
    const a = Q.of(ways)
      .mul(p.pow(w))
      .mul(q.pow(g - w));
    const b = Q.of(ways)
      .mul(q.pow(w))
      .mul(p.pow(g - w));
    const answer = a.add(b);
    return numberProblem({
      prompt: t(
        `Two teams play until one of them has won ${w} games. Team A wins each game with probability $${p.toLatex()}$, independently. Find the probability that exactly ${g} games are played.`,
        `两队比赛，直到其中一队赢满 ${w} 场为止。A 队每场获胜的概率为 $${p.toLatex()}$，各场相互独立。求恰好比赛 ${g} 场的概率。`,
      ),
      answer,
      form: "fraction",
      wrong: [
        a,
        b,
        Q.of(binom(g, w))
          .mul(p.pow(w))
          .mul(q.pow(g - w))
          .add(
            Q.of(binom(g, w))
              .mul(q.pow(w))
              .mul(p.pow(g - w)),
          ),
        p
          .pow(w)
          .mul(q.pow(g - w))
          .add(q.pow(w).mul(p.pow(g - w))),
      ],
      solution: t(
        `For a team to finish in game ${g}, it wins that game and ${w - 1} of the ${g - 1} before it, in $\\binom{${g - 1}}{${w - 1}} = ${ways}$ ways. Either team can do this, so the probability is $${ways}\\left[${bracketPow(p, w)}${bracketPow(q, g - w)} + ${bracketPow(q, w)}${bracketPow(p, g - w)}\\right] = ${answer.toLatex()}$.`,
        `一队要在第 ${g} 场结束比赛，就要赢下这一场和之前 ${g - 1} 场中的 ${w - 1} 场，有 $\\binom{${g - 1}}{${w - 1}} = ${ways}$ 种方式。两队都可能如此，所以概率是 $${ways}\\left[${bracketPow(p, w)}${bracketPow(q, g - w)} + ${bracketPow(q, w)}${bracketPow(p, g - w)}\\right] = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const hypergeometricSupport: KnowledgePointDef = {
  id: "the-possible-values-of-a-hypergeometric-variable",
  title: t("The possible values of a hypergeometric variable", "超几何变量的可能取值"),
  explanation: t(
    "A hypergeometric count cannot take every value from zero up to the sample size. The sample cannot contain more special items than exist, and when the sample is large, it runs out of ordinary items and must include some special ones. These two limits together decide exactly which values have nonzero probability.",
    "超几何计数并不能取从零到样本量的所有值。样本中的特殊物品不可能比总数还多；而样本较大时，普通物品不够用，必然包含一些特殊物品。这两个限制共同决定了哪些值的概率不为零。",
  ),
  generate(rng) {
    const R = rng.int(3, 12);
    const W = rng.int(3, 12);
    const n = rng.int(W + 1, R + W - 1);
    const lo = n - W;
    const hi = Math.min(n, R);
    const kind = rng.pick(["smallest", "count"] as const);
    const count = hi - lo + 1;
    const answer = kind === "smallest" ? lo : count;
    return numberProblem({
      prompt:
        kind === "smallest"
          ? t(
              `A bag holds ${R} red and ${W} white marbles. ${n} marbles are drawn at random without replacement. $X$ is the number of red marbles. What is the smallest value $X$ can take?`,
              `袋中有 ${R} 个红球和 ${W} 个白球。不放回地随机取出 ${n} 个球，$X$ 是其中红球的个数。$X$ 最小可能取多少？`,
            )
          : t(
              `A bag holds ${R} red and ${W} white marbles. ${n} marbles are drawn at random without replacement. $X$ is the number of red marbles. How many different values can $X$ take?`,
              `袋中有 ${R} 个红球和 ${W} 个白球。不放回地随机取出 ${n} 个球，$X$ 是其中红球的个数。$X$ 一共可能取多少个不同的值？`,
            ),
      answer,
      form: "integer",
      wrong: kind === "smallest" ? [0, lo + 1, lo + 2, n, R, W] : [n + 1, hi + 1, count - 1, count + 1, count + 2, R + 1],
      solution: t(
        `At most ${W} of the ${n} marbles can be white, so at least $${n} - ${W} = ${lo}$ are red. At most $\\min(${n}, ${R}) = ${hi}$ are red. So $X$ takes the values from $${lo}$ to $${hi}$${kind === "smallest" ? `, and the smallest is $${lo}$` : `, which is $${hi} - ${lo} + 1 = ${count}$ values`}.`,
        `取出的 ${n} 个球中白球至多 ${W} 个，所以红球至少 $${n} - ${W} = ${lo}$ 个。红球至多 $\\min(${n}, ${R}) = ${hi}$ 个。所以 $X$ 取值从 $${lo}$ 到 $${hi}$${kind === "smallest" ? `，最小是 $${lo}$` : `，共 $${hi} - ${lo} + 1 = ${count}$ 个值`}。`,
      ),
    });
  },
};

const hypergeometricMode: KnowledgePointDef = {
  id: "the-most-likely-value-of-a-hypergeometric-variable",
  title: t("The most likely value of a hypergeometric variable", "超几何变量最可能的取值"),
  explanation: t(
    "To find where a probability mass function peaks, compare each probability with the next by taking their ratio. In a hypergeometric distribution the binomial coefficients in that ratio cancel to a short fraction. While the ratio exceeds one the probabilities are rising, and once it falls below one they are falling, so the peak is at the changeover.",
    "要找概率质量函数的峰值，就用比值比较相邻的两个概率。在超几何分布中，这个比值里的二项式系数约分后是一个简短的分数。比值大于一时概率在上升，小于一时概率在下降，所以峰值就在转折的地方。",
  ),
  generate(rng) {
    for (;;) {
      const R = rng.int(5, 15);
      const W = rng.int(5, 15);
      const n = rng.int(4, 12);
      if (n >= R + W) continue;
      const ratio = (x: number) => Q.of((R - x) * (n - x), (x + 1) * (W - n + x + 1));
      const lo = Math.max(0, n - W);
      const hi = Math.min(n, R);
      const mode = range(lo, hi).find((x) => x === hi || ratio(x).cmp(Q.of(1)) < 0) as number;
      if (mode === lo || mode === hi || ratio(mode - 1).eq(Q.of(1))) continue;
      const mean = (n * R) / (R + W);
      const shifted = sumOfTerms([
        [1, "x"],
        [W - n + 1, ""],
      ]);
      return numberProblem({
        prompt: t(
          `A bag holds ${R} red and ${W} white marbles. ${n} marbles are drawn at random without replacement. $X$ is the number of red marbles. Which value of $X$ is the most likely?`,
          `袋中有 ${R} 个红球和 ${W} 个白球。不放回地随机取出 ${n} 个球，$X$ 是其中红球的个数。$X$ 取哪个值的可能性最大？`,
        ),
        answer: mode,
        form: "integer",
        wrong: [mode + 1, mode - 1, Math.floor(mean), Math.ceil(mean), mode + 2],
        solution: t(
          `The ratio of consecutive probabilities is $\\frac{P(X = x + 1)}{P(X = x)} = \\frac{(${R} - x)(${n} - x)}{(x + 1)(${shifted})}$. At $x = ${mode - 1}$ it is $${ratio(mode - 1).toLatex()} > 1$, and at $x = ${mode}$ it is $${ratio(mode).toLatex()} < 1$. So the probabilities rise up to $x = ${mode}$ and fall after it.`,
          `相邻概率之比为 $\\frac{P(X = x + 1)}{P(X = x)} = \\frac{(${R} - x)(${n} - x)}{(x + 1)(${shifted})}$。当 $x = ${mode - 1}$ 时比值为 $${ratio(mode - 1).toLatex()} > 1$，当 $x = ${mode}$ 时比值为 $${ratio(mode).toLatex()} < 1$。所以概率一直上升到 $x = ${mode}$，之后下降。`,
        ),
      });
    }
  },
};

const totalProbabilityTwoDraws: KnowledgePointDef = {
  id: "total-probability-with-a-calculation-in-each-case",
  title: t("Total probability with a calculation in each case", "每种情形都要计算的全概率"),
  explanation: t(
    "In the law of total probability the conditional probabilities are not always handed to you. Often each case is a small problem of its own, and the partition only tells you which problem you are in. Solve each case separately under its condition, and only then weight the answers by the probabilities of the cases. With two equally likely boxes, one holding $3$ red and $1$ white and the other $2$ red and $2$ white, two draws are both red with probability $\\frac{6}{12} = \\frac{1}{2}$ or $\\frac{2}{12} = \\frac{1}{6}$, so the total is $\\frac{1}{2} \\cdot \\frac{1}{2} + \\frac{1}{2} \\cdot \\frac{1}{6} = \\frac{1}{3}$.\n\n> **Watch out.** Without replacement the second draw has one red ball fewer and one ball fewer in all, so do not square the single-draw chance; and weight each box by its own probability, not equally.",
    "在全概率公式中，条件概率不一定是直接给出的。每种情形常常本身就是一个小问题，划分只告诉你身处哪个问题。先在各自的条件下分别求解，然后才用各情形的概率加权。有两个等可能的箱子，一个有 $3$ 个红球和 $1$ 个白球，另一个有 $2$ 个红球和 $2$ 个白球，两次都取到红球的概率分别为 $\\frac{6}{12} = \\frac{1}{2}$ 与 $\\frac{2}{12} = \\frac{1}{6}$，所以总概率为 $\\frac{1}{2} \\cdot \\frac{1}{2} + \\frac{1}{2} \\cdot \\frac{1}{6} = \\frac{1}{3}$。\n\n> **注意。** 不放回时第二次取球红球少一个、总数也少一个，所以不能把单次概率平方；每个箱子要按自己的概率加权，而不是平均。",
  ),
  generate(rng) {
    const weights = rng.pick([
      [Q.of(1, 2), Q.of(1, 3), Q.of(1, 6)],
      [Q.of(1, 4), Q.of(1, 4), Q.of(1, 2)],
      [Q.of(1, 5), Q.of(2, 5), Q.of(2, 5)],
      [Q.of(1, 6), Q.of(1, 6), Q.of(2, 3)],
    ]);
    const boxes = sampleFrom(rng, range(2, 6), 3).map((r) => [r, rng.int(2, 6)] as const);
    const both = boxes.map(([r, w]) => Q.of(r * (r - 1), (r + w) * (r + w - 1)));
    const single = boxes.map(([r, w]) => Q.of(r, r + w));
    const total = (values: readonly Q[]) => values.reduce((s, v, i) => s.add(v.mul(weights[i] as Q)), Q.of(0));
    const answer = total(both);
    const names = ["A", "B", "C"];
    const contentsEn = boxes.map(([r, w], i) => `Box ${names[i]} holds ${r} red and ${w} white balls`).join(", ");
    const contentsZh = boxes.map(([r, w], i) => `${names[i]} 箱有 ${r} 个红球和 ${w} 个白球`).join("，");
    const chance = weights.map((v) => v.toLatex());
    const sum = both.map((v, i) => `${(weights[i] as Q).toLatex()} \\cdot ${v.toLatex()}`).join(" + ");
    return numberProblem({
      prompt: t(
        `Box A, B or C is chosen with probabilities $${chance[0]}$, $${chance[1]}$, $${chance[2]}$. ${contentsEn}. Two balls are drawn from the chosen box without replacement. Find the probability that both are red.`,
        `以概率 $${chance[0]}$、$${chance[1]}$、$${chance[2]}$ 选中 A、B、C 箱。${contentsZh}。从选中的箱子中不放回地取两个球。求两个都是红球的概率。`,
      ),
      answer,
      form: "fraction",
      mistakes: [
        why(
          total(single),
          "That is the chance that one ball is red; both balls must be red.",
          "那是一个球为红球的概率；两个球都要是红球。",
        ),
        why(
          total(single.map((v) => v.mul(v))),
          "That squares the single chance, as if the first ball were put back.",
          "那是把单次概率平方，好像第一个球放回去了。",
        ),
        why(
          both.reduce((s, v) => s.add(v), Q.of(0)).div(Q.of(3)),
          "That averages the boxes equally; weight each by its own probability.",
          "那是把各箱平均；每个箱子要按自己的概率加权。",
        ),
        why(
          total(single).mul(total(single)),
          "That squares the overall chance of red; the two draws come from the same box.",
          "那是把总体红球概率平方；两次都是从同一个箱子取。",
        ),
      ].filter((m, i, all) => !(m.value as Q).eq(answer) && all.findIndex((x) => (x.value as Q).eq(m.value as Q)) === i),
      solution: walked(
        [
          [
            ["Solve each box", "分别求每个箱子"],
            t(
              `With $r$ red among $n$ balls, both are red with probability $\\frac{r(r - 1)}{n(n - 1)}$: ${boxes.map(([r, w], i) => `box ${names[i]} gives $\\frac{${r * (r - 1)}}{${(r + w) * (r + w - 1)}} = ${(both[i] as Q).toLatex()}$`).join(", ")}.`,
              `$n$ 个球中有 $r$ 个红球时，两个都是红球的概率为 $\\frac{r(r - 1)}{n(n - 1)}$：${boxes.map(([r, w], i) => `${names[i]} 箱为 $\\frac{${r * (r - 1)}}{${(r + w) * (r + w - 1)}} = ${(both[i] as Q).toLatex()}$`).join("，")}。`,
            ),
          ],
          [["Weight the boxes", "按箱子加权"], t(`$${sum} = ${answer.toLatex()}$.`, `$${sum} = ${answer.toLatex()}$。`)],
        ],
        t(
          `$${answer.toLatex()}$ lies between the smallest and the largest of the three box probabilities, as a weighted average must.`,
          `$${answer.toLatex()}$ 介于三个箱子概率的最小值与最大值之间，加权平均理应如此。`,
        ),
      ),
    });
  },
};

const timeForAtLeastOne: KnowledgePointDef = {
  id: "the-length-needed-for-at-least-one-event",
  title: t("The length needed for at least one event", "至少发生一次所需的长度"),
  explanation: t(
    "Questions about planning ask for the interval rather than the probability. In a Poisson model the count over a longer interval has a proportionally larger mean, and the probability of no events falls exponentially with length. So set the probability of no events to the allowed level, solve using a logarithm, and round up to reach the requirement.",
    "规划类的问题求的是区间长度而不是概率。在泊松模型中，区间越长，计数的均值按比例增大，没有事件发生的概率随长度指数下降。所以令没有事件发生的概率等于允许的水平，用对数解出长度，再向上取整以满足要求。",
  ),
  generate(rng) {
    const hundredths = rng.pick([5, 10, 15, 20, 25, 40, 50]);
    const percent = rng.pick([50, 75, 90, 95, 99]);
    const rate = hundredths / 100;
    const rest = (100 - percent) / 100;
    const exact = -Math.log(rest) / rate;
    const answer = Math.ceil(exact);
    const [en, zh, enUnits, zhUnits] = rng.pick([
      ["Calls reach a help desk", "咨询电话相互独立地打到服务台", "minute", "分钟"],
      ["Flaws appear in a cable", "电缆上的瑕疵相互独立地出现", "metre", "米"],
      ["Customers arrive at a kiosk", "顾客相互独立地来到售货亭", "minute", "分钟"],
      ["Typing errors occur in a manuscript", "手稿中的打字错误相互独立地出现", "page", "页"],
    ] as const);
    return numberProblem({
      prompt: t(
        `${en} independently at a constant average rate of $${rate}$ per ${enUnits}. What is the smallest whole number of ${enUnits}s for which the probability of at least one is at least $${percent}\\%$?`,
        `${zh}，平均每${zhUnits} $${rate}$ 次。至少要多少${zhUnits}（取整数），才能使至少发生一次的概率不低于 $${percent}\\%$？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.floor(exact), answer + 1, Math.ceil(percent / 100 / rate), Math.ceil(1 / rate), answer + 2],
      solution: t(
        `Over $t$ ${enUnits}s the count is Poisson with mean $${rate}t$, so at least one has probability $1 - e^{-${rate}t}$. This needs $e^{-${rate}t} \\le ${rest}$, or $t \\ge \\frac{-\\ln ${rest}}{${rate}} \\approx ${exact.toFixed(2)}$. The next whole number is $${answer}$.`,
        `在 $t$ ${zhUnits}内，计数服从均值为 $${rate}t$ 的泊松分布，所以至少发生一次的概率是 $1 - e^{-${rate}t}$。需要 $e^{-${rate}t} \\le ${rest}$，即 $t \\ge \\frac{-\\ln ${rest}}{${rate}} \\approx ${exact.toFixed(2)}$。向上取整得 $${answer}$。`,
      ),
    });
  },
};

const termsFromALinearSum: KnowledgePointDef = {
  id: "the-number-of-terms-from-a-linear-sum",
  title: t("The number of terms from a linear sum", "由线性和式求项数"),
  explanation: t(
    "A sum of a linear expression is itself a quadratic function of its upper limit, so a sum with an unknown number of terms can be solved. Apply the formula for the sum of the first integers, clear the fraction, and solve the quadratic equation. Only a positive integer root makes sense as a number of terms. For $\\sum_{k=1}^{N} (7k + 1) = 203$: $\\frac{7N(N + 1)}{2} + N = 203$ gives $7N^2 + 9N - 406 = 0$, which is $(N - 7)(7N + 58) = 0$, so $N = 7$.\n\n> **Watch out.** Do not divide the total by the coefficient of $k$: the sum grows like $\\frac{a}{2}N^2$, not $aN$; and the constant term contributes $bN$, so it is multiplied by $N$ too.",
    "线性表达式的和本身是上限的二次函数，所以项数未知的和式可以求解。用前若干个整数之和的公式，去掉分母，解这个二次方程。作为项数，只有正整数根才有意义。对 $\\sum_{k=1}^{N} (7k + 1) = 203$：$\\frac{7N(N + 1)}{2} + N = 203$ 化为 $7N^2 + 9N - 406 = 0$，即 $(N - 7)(7N + 58) = 0$，所以 $N = 7$。\n\n> **注意。** 不要用总和除以 $k$ 的系数：和的增长像 $\\frac{a}{2}N^2$，而不是 $aN$；常数项贡献 $bN$，也要乘以 $N$。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const b = rng.pick(range(-3, 9).filter((v) => v !== 0));
    const N = rng.int(5, 40);
    const S = (a * N * (N + 1)) / 2 + b * N;
    const lin = a + 2 * b;
    const disc = lin * lin + 8 * a * S;
    const top = lin === 0 ? `\\sqrt{${disc}}` : `${-lin} + \\sqrt{${disc}}`;
    const topValue = lin === 0 ? `${2 * a * N}` : `${-lin} + ${2 * a * N + lin}`;
    const quadratic = sumOfTerms([
      [a, "N^2"],
      [a + 2 * b, "N"],
      [-2 * S, ""],
    ]);
    return numberProblem({
      prompt: t(
        `Find the positive integer $N$ such that $\\sum_{k=1}^{N} (${sumOfTerms([
          [a, "k"],
          [b, ""],
        ])}) = ${S}$.`,
        `求正整数 $N$，使 $\\sum_{k=1}^{N} (${sumOfTerms([
          [a, "k"],
          [b, ""],
        ])}) = ${S}$。`,
      ),
      answer: N,
      form: "integer",
      mistakes: [
        why(N + 1, `That is one term too many: the sum to $N + 1$ is larger than $${S}$.`, `那多了一项：到 $N + 1$ 的和大于 $${S}$。`),
        why(N - 1, `That is one term too few: the sum to $N - 1$ falls short of $${S}$.`, `那少了一项：到 $N - 1$ 的和不到 $${S}$。`),
        why(
          Math.round(S / a),
          "That divides the total by the coefficient of $k$, but the sum grows like a square, not linearly.",
          "那是用总和除以 $k$ 的系数，但和是按平方增长的，不是线性的。",
        ),
        why(
          Math.round(S / (a + Math.abs(b))),
          "That divides the total by the first term, as if every term were equal; the terms grow.",
          "那是用总和除以第一项，好像每一项都相等；但各项在增大。",
        ),
      ].filter((m, i, all) => m.value !== N && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Write the sum in N", "用 N 表示和"],
            t(
              `$${a} \\cdot \\frac{N(N + 1)}{2} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}N = ${S}$.`,
              `$${a} \\cdot \\frac{N(N + 1)}{2} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}N = ${S}$。`,
            ),
          ],
          [["Clear the fraction", "去分母"], t(`Multiplying by two: $${quadratic} = 0$.`, `乘以二：$${quadratic} = 0$。`)],
          [
            ["Solve", "求解"],
            t(
              `$N = \\frac{${top}}{${2 * a}} = \\frac{${topValue}}{${2 * a}} = ${N}$; the other root is negative, so it cannot count terms.`,
              `$N = \\frac{${top}}{${2 * a}} = \\frac{${topValue}}{${2 * a}} = ${N}$；另一个根是负数，不能作为项数。`,
            ),
          ],
        ],
        t(
          `With $N = ${N}$: $${a} \\cdot \\frac{${N} \\cdot ${N + 1}}{2} ${b < 0 ? "-" : "+"} ${Math.abs(b * N)} = ${(a * N * (N + 1)) / 2} ${b < 0 ? "-" : "+"} ${Math.abs(b * N)} = ${S}$.`,
          `取 $N = ${N}$：$${a} \\cdot \\frac{${N} \\cdot ${N + 1}}{2} ${b < 0 ? "-" : "+"} ${Math.abs(b * N)} = ${(a * N * (N + 1)) / 2} ${b < 0 ? "-" : "+"} ${Math.abs(b * N)} = ${S}$。`,
        ),
      ),
    });
  },
};

const alternatingSquares: KnowledgePointDef = {
  id: "alternating-sums-of-squares",
  title: t("Alternating sums of squares", "平方的交错和"),
  explanation: t(
    "When the signs of a sum of squares alternate, the formula for the sum of squares is the wrong tool, because the terms nearly cancel. Pair each square with the next, starting from the largest. A difference of consecutive squares equals the sum of the two numbers, so the alternating sum collapses to a sum of integers. For $1^2 - 2^2 + 3^2 - \\cdots - 100^2$, each pair $(2j - 1)^2 - (2j)^2$ is $-(4j - 1)$, and the total is $-(1 + 2 + \\cdots + 100) = -5050$.\n\n> **Watch out.** The sign of the whole sum is the sign of its largest term, so check whether $k = n$ carries a plus or a minus; and ignoring the signs gives the ordinary sum of squares, far too large.",
    "平方和的符号交替时，平方和公式不是合适的工具，因为各项几乎相互抵消。从最大的一项开始，把每个平方与下一个配对。相邻两个平方之差等于这两个数之和，所以交错和就化成了整数的和。对 $1^2 - 2^2 + 3^2 - \\cdots - 100^2$，每对 $(2j - 1)^2 - (2j)^2$ 等于 $-(4j - 1)$，总和为 $-(1 + 2 + \\cdots + 100) = -5050$。\n\n> **注意。** 整个和的符号就是最大一项的符号，所以要看 $k = n$ 这一项带正号还是负号；忽略符号得到的是普通平方和，大得多。",
  ),
  generate(rng) {
    const n = rng.int(5, 60);
    const plusFirst = rng.pick([true, false]);
    const size = (n * (n + 1)) / 2;
    const largestPositive = plusFirst ? n % 2 === 1 : n % 2 === 0;
    const answer = largestPositive ? size : -size;
    const sign = plusFirst ? "(-1)^{k+1}" : "(-1)^{k}";
    const allSquares = (n * (n + 1) * (2 * n + 1)) / 6;
    const prevSize = ((n - 1) * n) / 2;
    return numberProblem({
      prompt: t(`Evaluate $\\sum_{k=1}^{${n}} ${sign} k^2$.`, `计算 $\\sum_{k=1}^{${n}} ${sign} k^2$。`),
      answer,
      form: "integer",
      mistakes: [
        why(
          -answer,
          `That has the wrong sign: the term $k = ${n}$ carries a ${largestPositive ? "plus" : "minus"} sign and decides the sign of the sum.`,
          `那是符号错了：$k = ${n}$ 这一项带${largestPositive ? "正" : "负"}号，决定了和的符号。`,
        ),
        why(allSquares, "That ignores the signs and adds all the squares.", "那是忽略了符号，把所有平方相加。"),
        why(
          answer > 0 ? n * n : -n * n,
          "That keeps only the largest term; the other terms do not cancel completely.",
          "那是只保留了最大的一项；其余各项并没有完全抵消。",
        ),
        why(
          answer > 0 ? size - n : n - size,
          `That leaves $${n}$ out of the sum of the integers; each pair gives both of its numbers.`,
          `那是在整数和中漏掉了 $${n}$；每一对都给出它的两个数。`,
        ),
      ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
      solution: walked(
        [
          [
            ["Pair from the top", "从最大项配对"],
            t(
              `$${n}^2 - ${n - 1}^2 = ${n} + ${n - 1}$, and likewise for each lower pair, since $a^2 - (a - 1)^2 = a + (a - 1)$.`,
              `$${n}^2 - ${n - 1}^2 = ${n} + ${n - 1}$，较小的各对也一样，因为 $a^2 - (a - 1)^2 = a + (a - 1)$。`,
            ),
          ],
          [
            ["Add the integers", "整数求和"],
            t(
              `The size is $${n} + ${n - 1} + \\cdots + 1 = \\frac{${n} \\cdot ${n + 1}}{2} = ${size}$.`,
              `绝对值为 $${n} + ${n - 1} + \\cdots + 1 = \\frac{${n} \\cdot ${n + 1}}{2} = ${size}$。`,
            ),
          ],
          [
            ["Fix the sign", "确定符号"],
            t(
              `The term $k = ${n}$ has a ${largestPositive ? "plus" : "minus"} sign, so the sum is $${answer}$.`,
              `$k = ${n}$ 这一项带${largestPositive ? "正" : "负"}号，所以和是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `The sum to $${n - 1}$ has size $\\frac{${n - 1} \\cdot ${n}}{2} = ${prevSize}$ and the opposite sign, and $${n}^2 - ${prevSize} = ${n * n - prevSize}$ is the size found.`,
          `到 $${n - 1}$ 的和绝对值为 $\\frac{${n - 1} \\cdot ${n}}{2} = ${prevSize}$，符号相反，而 $${n}^2 - ${prevSize} = ${n * n - prevSize}$ 正是所得的绝对值。`,
        ),
      ),
    });
  },
};

const firstPartialSumPastATarget: KnowledgePointDef = {
  id: "the-first-partial-sum-past-a-target",
  title: t("The first partial sum past a target", "首次超过目标的部分和"),
  explanation: t(
    "For a series of positive terms the partial sums keep growing, so there is a first index at which they pass any given target. A closed form for the partial sum gives a good first estimate of that index, but the answer must then be confirmed by comparing the partial sums on either side, since rounding alone can miss by one. For $\\sum (2n + 1)$, $S_{n} = n^{2} + 2n$; to pass $50$, $S_{6} = 48$ falls short and $S_{7} = 63$ passes, so the answer is $7$.\n\nCheck: adding the next term by hand, $S_{7} = S_{6} + a_{7} = 48 + 15 = 63$.\n\n> **Watch out.** Look at the partial sum just before as well: an index whose partial sum passes the target is the smallest only if the one before does not.",
    "对正项级数，部分和不断增大，所以对任何目标，都有首个超过它的下标。部分和的封闭形式能给出这个下标的良好估计，但还要比较两侧的部分和来确认，因为只靠四舍五入可能差一。对 $\\sum (2n + 1)$，$S_{n} = n^{2} + 2n$；要超过 $50$，$S_{6} = 48$ 不够，$S_{7} = 63$ 超过了，所以答案是 $7$。\n\n检验：直接加上下一项，$S_{7} = S_{6} + a_{7} = 48 + 15 = 63$。\n\n> **注意。** 还要看前一个部分和：部分和超过目标的下标，只有当前一个没有超过时才是最小的。",
  ),
  generate(rng) {
    const geometric = rng.pick([true, false]);
    const a = rng.int(2, 7);
    const b = geometric ? rng.pick([2, 3]) : rng.int(1, 9);
    const term = (n: number) => (geometric ? a * b ** n : a * n + b);
    const target = rng.int(10, 40) * 25;
    let n = 1;
    let previous = 0;
    let sum = term(1);
    while (sum <= target) {
      n += 1;
      previous = sum;
      sum += term(n);
    }
    let alone = 1;
    while (term(alone) <= target) alone += 1;
    const asFirst = Math.floor(target / term(1)) + 1;
    const series = geometric ? `${a} \\cdot ${b}^{n}` : `(${a}n + ${b})`;
    const closed = geometric
      ? b === 2
        ? `S_n = ${a}(2^{n + 1} - 2)`
        : `S_n = ${a} \\cdot \\frac{${b}^{n + 1} - ${b}}{${b - 1}}`
      : `S_n = ${a} \\cdot \\frac{n(n + 1)}{2} + ${b === 1 ? "" : b}n`;
    const at = (m: number) =>
      geometric
        ? b === 2
          ? `${a}(2^{${m + 1}} - 2)`
          : `${a} \\cdot \\frac{${b}^{${m + 1}} - ${b}}{${b - 1}}`
        : `${a} \\cdot \\frac{${m} \\cdot ${m + 1}}{2} + ${b === 1 ? "" : `${b} \\cdot `}${m}`;
    const wrong: readonly (readonly [number, string, string])[] = [
      [n - 1, `$S_{${n - 1}} = ${previous}$ does not exceed $${target}$`, `$S_{${n - 1}} = ${previous}$ 没有超过 $${target}$`],
      [
        n + 1,
        `$S_{${n}} = ${sum}$ already exceeds $${target}$, so $${n + 1}$ is not the smallest`,
        `$S_{${n}} = ${sum}$ 已经超过 $${target}$，所以 $${n + 1}$ 不是最小的`,
      ],
      [
        alone,
        "This is where a single term passes the target; the partial sum, which adds all the terms, passes it sooner",
        "这是单独一项超过目标的位置；部分和把各项加起来，会更早超过",
      ],
      [asFirst, `This treats every term as the first, $${term(1)}$; the terms grow`, `这里把每一项都当作第一项 $${term(1)}$；但各项在增大`],
    ];
    return numberProblem({
      prompt: t(
        `$S_n$ is the $n$th partial sum of the series $\\sum_{n=1}^{\\infty} ${series}$. Find the smallest $n$ with $S_n > ${target}$.`,
        `$S_n$ 是级数 $\\sum_{n=1}^{\\infty} ${series}$ 的第 $n$ 个部分和。求使 $S_n > ${target}$ 的最小的 $n$。`,
      ),
      answer: n,
      form: "integer",
      mistakes: wrong
        .filter((w, i) => w[0] >= 1 && wrong.findIndex((x) => x[0] === w[0]) === i)
        .map(([value, en, zh]) => ({ value, why: t(en, zh) })),
      solution: walked(
        [
          [
            ["Write the partial sum", "写出部分和"],
            t(
              `The terms ${geometric ? "form a geometric series" : "form an arithmetic series"}, so:`,
              `各项构成${geometric ? "几何" : "等差"}数列，所以：`,
            ),
            [closed],
          ],
          [
            ["Compare on both sides", "比较两侧"],
            t(
              `The partial sum just before falls short of $${target}$ and the next one passes it:`,
              `前一个部分和不到 $${target}$，下一个超过了它：`,
            ),
            [`S_{${n - 1}} = ${at(n - 1)} = ${previous} \\le ${target}`, `S_{${n}} = ${at(n)} = ${sum} > ${target}`],
          ],
        ],
        t(
          `Add the next term by hand instead of using the formula: $a_{${n}} = ${geometric ? `${a} \\cdot ${b}^{${n}}` : `${a} \\cdot ${n} + ${b}`} = ${term(n)}$, and $S_{${n - 1}} + a_{${n}} = ${previous} + ${term(n)} = ${sum}$. The partial sums only grow, so the smallest index is $${n}$.`,
          `不用公式，直接加上下一项：$a_{${n}} = ${geometric ? `${a} \\cdot ${b}^{${n}}` : `${a} \\cdot ${n} + ${b}`} = ${term(n)}$，$S_{${n - 1}} + a_{${n}} = ${previous} + ${term(n)} = ${sum}$。部分和只增不减，所以最小的下标是 $${n}$。`,
        ),
      ),
    });
  },
};

const seriesWithDoubledIndex: KnowledgePointDef = {
  id: "geometric-series-with-a-multiple-of-the-index-in-the-exponent",
  title: t("Geometric series with a multiple of the index in the exponent", "指数含下标倍数的几何级数"),
  explanation: t(
    "A series in sigma notation need not show its common ratio directly. When the exponent grows by two with each step of the index, the ratio between consecutive terms is the square of the base, not the base. Write out the first term from the starting index, compare it with the second, and only then apply the sum formula. For $\\sum_{n=0}^{\\infty} 3\\left(\\frac{1}{2}\\right)^{2n}$, the terms are $3, \\frac{3}{4}, \\frac{3}{16}, \\ldots$, so the ratio is $\\frac{1}{4}$ and the sum is $\\frac{3}{3/4} = 4$.\n\nCheck: the sum $S$ satisfies $S = 3 + \\frac{1}{4}S$, and $3 + \\frac{1}{4} \\cdot 4 = 4$.\n\n> **Watch out.** Using the base $\\frac{1}{2}$ as the ratio gives $6$; the terms shrink by $\\frac{1}{4}$ at each step.",
    "用求和符号写的级数不一定直接显示公比。当下标每增加一，指数增加二时，相邻两项之比是底数的平方，而不是底数。先写出起始下标对应的首项，与第二项比较，然后才使用求和公式。对 $\\sum_{n=0}^{\\infty} 3\\left(\\frac{1}{2}\\right)^{2n}$，各项是 $3, \\frac{3}{4}, \\frac{3}{16}, \\ldots$，所以公比是 $\\frac{1}{4}$，和为 $\\frac{3}{3/4} = 4$。\n\n检验：和 $S$ 满足 $S = 3 + \\frac{1}{4}S$，而 $3 + \\frac{1}{4} \\cdot 4 = 4$。\n\n> **注意。** 把底数 $\\frac{1}{2}$ 当作公比会得到 $6$；各项每一步缩小为 $\\frac{1}{4}$。",
  ),
  generate(rng) {
    const r = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(1, 4), Q.of(3, 4), Q.of(2, 5), Q.of(3, 5)]);
    const a = rng.int(2, 9);
    const shift = rng.pick([0, 1]);
    const exponent = shift === 0 ? "2n" : "2n + 1";
    const first = Q.of(a).mul(r.pow(shift));
    const ratio = r.mul(r);
    const answer = first.div(Q.of(1).sub(ratio));
    const second = first.mul(ratio);
    const wrong: readonly (readonly [Q, string, string])[] = [
      [
        first.div(Q.of(1).sub(r)),
        `This uses the base $${r.toLatex()}$ as the ratio; the exponent grows by two, so the ratio is its square`,
        `这里把底数 $${r.toLatex()}$ 当作公比；指数每步增加二，公比是它的平方`,
      ],
      [
        Q.of(a).div(Q.of(1).sub(ratio)),
        `This uses $${a}$ as the first term; at $n = 0$ the exponent is $1$, so the first term is $${first.toLatex()}$`,
        `这里把 $${a}$ 当作首项；$n = 0$ 时指数是 $1$，首项是 $${first.toLatex()}$`,
      ],
      [
        Q.of(a).div(Q.of(1).sub(r)),
        `This reads the series as $${a}\\left(${r.toLatex()}\\right)^{n}$, with the wrong first term and ratio`,
        `这里把级数读成了 $${a}\\left(${r.toLatex()}\\right)^{n}$，首项和公比都错了`,
      ],
      [first.div(Q.of(1).add(ratio)), "This divides by $1 + r$; the formula divides by $1 - r$", "这里除以了 $1 + r$；公式是除以 $1 - r$"],
      [
        second.div(Q.of(1).sub(ratio)),
        "This starts at $n = 1$ and leaves out the term at $n = 0$",
        "这里从 $n = 1$ 开始，漏掉了 $n = 0$ 的项",
      ],
    ];
    return numberProblem({
      prompt: t(
        `Find $\\sum_{n=0}^{\\infty} ${a}\\left(${r.toLatex()}\\right)^{${exponent}}$.`,
        `求 $\\sum_{n=0}^{\\infty} ${a}\\left(${r.toLatex()}\\right)^{${exponent}}$。`,
      ),
      answer,
      form: "fraction",
      mistakes: wrong.filter((w, i) => wrong.findIndex((x) => x[0].eq(w[0])) === i).map(([value, en, zh]) => ({ value, why: t(en, zh) })),
      solution: walked(
        [
          [
            ["Write out the first two terms", "写出前两项"],
            t(`Put in $n = 0$ and $n = 1$:`, `代入 $n = 0$ 和 $n = 1$：`),
            [
              `${a}\\left(${r.toLatex()}\\right)^{${shift}} = ${first.toLatex()}, \\quad ${a}\\left(${r.toLatex()}\\right)^{${shift + 2}} = ${second.toLatex()}`,
            ],
          ],
          [
            ["Find the ratio", "求公比"],
            t("Divide the second term by the first:", "用第二项除以第一项："),
            [`\\frac{${second.toLatex()}}{${first.toLatex()}} = \\left(${r.toLatex()}\\right)^{2} = ${ratio.toLatex()}`],
          ],
          [
            ["Sum the series", "求级数的和"],
            t("The ratio is less than $1$, so:", "公比小于 $1$，所以："),
            [`\\frac{${first.toLatex()}}{1 - ${ratio.toLatex()}} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `The terms after the first are the whole series times $${ratio.toLatex()}$, so the sum satisfies $S = ${first.toLatex()} + ${ratio.toLatex()}S$. With $S = ${answer.toLatex()}$: $${first.toLatex()} + ${ratio.toLatex()} \\cdot ${answer.toLatex()} = ${first.toLatex()} + ${answer.mul(ratio).toLatex()} = ${answer.toLatex()}$.`,
          `第一项之后的各项是整个级数乘以 $${ratio.toLatex()}$，所以和满足 $S = ${first.toLatex()} + ${ratio.toLatex()}S$。代入 $S = ${answer.toLatex()}$：$${first.toLatex()} + ${ratio.toLatex()} \\cdot ${answer.toLatex()} = ${first.toLatex()} + ${answer.mul(ratio).toLatex()} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const exponentFromCoefficients: KnowledgePointDef = {
  id: "the-exponent-from-two-coefficients-of-a-binomial-expansion",
  title: t("The exponent from two coefficients of a binomial expansion", "由二项展开式的两个系数求指数"),
  explanation: t(
    "The first coefficients of a generalized binomial expansion can be read backward: $\\alpha k = A$ and $\\frac{\\alpha(\\alpha - 1)}{2}k^2 = B$. Then $A^2 - 2B = \\alpha k^2$, so $\\alpha = \\frac{A^2}{A^2 - 2B}$. If $(1 + kx)^{\\alpha}$ begins $1 + 3x - \\frac{3}{2}x^2$, then $A^2 - 2B = 9 + 3 = 12$ and $\\alpha = \\frac{9}{12} = \\frac{3}{4}$, with $k = 4$.\n\n> **Watch out.** The $x^2$ coefficient carries $k^2$ and a factor $\\frac{1}{2}$, so divide $A^2$ by $A^2 - 2B$, not by $B$; and the first coefficient is $\\alpha k$, not $\\alpha$ itself.",
    "广义二项展开式的前几个系数可以反过来用：$\\alpha k = A$，$\\frac{\\alpha(\\alpha - 1)}{2}k^2 = B$。于是 $A^2 - 2B = \\alpha k^2$，所以 $\\alpha = \\frac{A^2}{A^2 - 2B}$。若 $(1 + kx)^{\\alpha}$ 的开头是 $1 + 3x - \\frac{3}{2}x^2$，则 $A^2 - 2B = 9 + 3 = 12$，$\\alpha = \\frac{9}{12} = \\frac{3}{4}$，且 $k = 4$。\n\n> **注意。** $x^2$ 的系数含 $k^2$ 和因子 $\\frac{1}{2}$，所以应以 $A^2 - 2B$ 而不是 $B$ 去除 $A^2$；第一个系数是 $\\alpha k$，不是 $\\alpha$ 本身。",
  ),
  generate(rng) {
    const scales: readonly (readonly [Q, readonly number[]])[] = [
      [Q.of(-1), [2, 3, 4, 5]],
      [Q.of(-2), [2, 3, 4]],
      [Q.of(-3), [2, 3]],
      [Q.of(3), [2, 3]],
      [Q.of(4), [2, 3]],
      [Q.of(1, 2), [2, 4, 6]],
      [Q.of(-1, 2), [2, 4, 6]],
      [Q.of(3, 2), [2, 4]],
      [Q.of(-3, 2), [2, 4]],
      [Q.of(1, 3), [3, 6]],
      [Q.of(-1, 3), [3, 6]],
      [Q.of(2, 3), [3, 6]],
    ];
    const [alpha, k] = rng.pick(scales.flatMap(([alpha, ks]) => ks.flatMap((k) => [[alpha, k] as const, [alpha, -k] as const])));
    const A = alpha.mul(Q.of(k));
    const B = alpha
      .mul(alpha.sub(Q.of(1)))
      .mul(Q.of(k * k))
      .div(Q.of(2));
    const expansion = `1${ratioTerm(A, "x", false)}${ratioTerm(B, "x^2", false)} + \\cdots`;
    const square = A.mul(A);
    const denominator = square.sub(B).sub(B);
    return numberProblem({
      prompt: t(
        `For a nonzero constant $k$ and an exponent $\\alpha$, the expansion of $(1 + kx)^{\\alpha}$ begins $${expansion}$. Find $\\alpha$.`,
        `对非零常数 $k$ 和指数 $\\alpha$，$(1 + kx)^{\\alpha}$ 的展开式开头是 $${expansion}$。求 $\\alpha$。`,
      ),
      answer: alpha,
      mistakes: [
        why(
          alpha.neg(),
          "That has the wrong sign; $\\alpha$ has the same sign as $A^2 - 2B$.",
          "那是符号错了；$\\alpha$ 与 $A^2 - 2B$ 同号。",
        ),
        why(
          square.div(B),
          "That divides $A^2$ by $B$; the scale only cancels against $A^2 - 2B$.",
          "那是用 $B$ 去除 $A^2$；只有除以 $A^2 - 2B$ 才能消去比例。",
        ),
        why(A, "That is $\\alpha k$, the first coefficient, not $\\alpha$.", "那是第一个系数 $\\alpha k$，不是 $\\alpha$。"),
        why(Q.of(k), "That is the scale $k$, not the exponent.", "那是比例 $k$，不是指数。"),
        why(Q.of(1).div(alpha), "That inverts the fraction $\\frac{A^2}{A^2 - 2B}$.", "那是把分数 $\\frac{A^2}{A^2 - 2B}$ 颠倒了。"),
      ].filter((m, i, all) => !(m.value as Q).eq(alpha) && all.findIndex((x) => (x.value as Q).eq(m.value as Q)) === i),
      solution: walked(
        [
          [
            ["Match the coefficients", "比较系数"],
            t(
              `$\\alpha k = ${A.toLatex()}$ and $\\frac{\\alpha(\\alpha - 1)}{2} k^2 = ${B.toLatex()}$.`,
              `$\\alpha k = ${A.toLatex()}$，$\\frac{\\alpha(\\alpha - 1)}{2} k^2 = ${B.toLatex()}$。`,
            ),
          ],
          [
            ["Remove the scale", "消去比例"],
            t(
              `$(\\alpha k)^2 - 2 \\cdot \\frac{\\alpha(\\alpha - 1)}{2} k^2 = \\alpha k^2$, so $\\alpha k^2 = ${square.toLatex()} - 2 \\cdot ${bracketPow(B, 1)} = ${denominator.toLatex()}$.`,
              `$(\\alpha k)^2 - 2 \\cdot \\frac{\\alpha(\\alpha - 1)}{2} k^2 = \\alpha k^2$，所以 $\\alpha k^2 = ${square.toLatex()} - 2 \\cdot ${bracketPow(B, 1)} = ${denominator.toLatex()}$。`,
            ),
          ],
          [
            ["Divide", "相除"],
            t(
              `$\\alpha = \\frac{(\\alpha k)^2}{\\alpha k^2} = \\frac{${square.toLatex()}}{${denominator.toLatex()}} = ${alpha.toLatex()}$.`,
              `$\\alpha = \\frac{(\\alpha k)^2}{\\alpha k^2} = \\frac{${square.toLatex()}}{${denominator.toLatex()}} = ${alpha.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `With $\\alpha = ${alpha.toLatex()}$ the scale is $k = ${k}$, and $\\frac{\\alpha(\\alpha - 1)}{2}k^2 = \\frac{${bracketPow(alpha, 1)}${bracketPow(alpha.sub(Q.of(1)), 1)}}{2} \\cdot ${k * k} = ${B.toLatex()}$, the given $x^2$ coefficient.`,
          `取 $\\alpha = ${alpha.toLatex()}$，比例为 $k = ${k}$，且 $\\frac{\\alpha(\\alpha - 1)}{2}k^2 = \\frac{${bracketPow(alpha, 1)}${bracketPow(alpha.sub(Q.of(1)), 1)}}{2} \\cdot ${k * k} = ${B.toLatex()}$，正是给出的 $x^2$ 系数。`,
        ),
      ),
    });
  },
};

const firstOmittedTerm: KnowledgePointDef = {
  id: "the-first-term-left-out-of-a-binomial-approximation",
  title: t("The first term left out of a binomial approximation", "二项近似中第一个被舍去的项"),
  explanation: t(
    "A truncated binomial expansion is only useful if we know roughly how far off it is. When the small quantity is well below one, each term is much smaller than the one before, so the error is close to the first term left out. Approximating $1.02^{1/2}$ by $1 + \\frac{1}{2}x - \\frac{1}{8}x^2$ with $x = \\frac{1}{50}$ leaves out $\\frac{1}{16}x^3 = \\frac{1}{2000000}$, so the approximation is too small by about that much.\n\n> **Watch out.** The $x^3$ coefficient is $\\frac{\\alpha(\\alpha - 1)(\\alpha - 2)}{6}$, divided by $3! = 6$; and keep its sign, which tells whether the approximation is too large or too small.",
    "截断的二项展开式只有在知道大致误差时才有用。当小量远小于一时，每一项都比前一项小得多，所以误差接近第一个被舍去的项。用 $1 + \\frac{1}{2}x - \\frac{1}{8}x^2$ 以 $x = \\frac{1}{50}$ 近似 $1.02^{1/2}$，舍去的是 $\\frac{1}{16}x^3 = \\frac{1}{2000000}$，所以近似值大约偏小这么多。\n\n> **注意。** $x^3$ 的系数是 $\\frac{\\alpha(\\alpha - 1)(\\alpha - 2)}{6}$，要除以 $3! = 6$；还要保留它的符号，它说明近似值偏大还是偏小。",
  ),
  generate(rng) {
    const alpha = rng.pick([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3), Q.of(-1), Q.of(-2), Q.of(3, 2), Q.of(-3, 2)]);
    const [x, base] = rng.pick([
      [Q.of(1, 10), "1.1"],
      [Q.of(-1, 10), "0.9"],
      [Q.of(1, 5), "1.2"],
      [Q.of(-1, 5), "0.8"],
      [Q.of(1, 20), "1.05"],
      [Q.of(-1, 20), "0.95"],
      [Q.of(1, 4), "1.25"],
      [Q.of(-1, 4), "0.75"],
    ] as const);
    const c3 = alpha
      .mul(alpha.sub(Q.of(1)))
      .mul(alpha.sub(Q.of(2)))
      .div(Q.of(6));
    const answer = c3.mul(x.pow(3));
    const lead = c3.eq(Q.of(-1)) ? "-" : `${c3.toLatex()} \\cdot `;
    const second = alpha
      .mul(alpha.sub(Q.of(1)))
      .div(Q.of(2))
      .mul(x.pow(2));
    return numberProblem({
      prompt: t(
        `The first three terms of the expansion of $(1 + x)^{${alpha.toLatex()}}$ are used to approximate $${base}^{${alpha.toLatex()}}$. Find the value of the first term left out, as an exact fraction.`,
        `用 $(1 + x)^{${alpha.toLatex()}}$ 展开式的前三项近似 $${base}^{${alpha.toLatex()}}$。求第一个被舍去的项的值，写成准确的分数。`,
      ),
      answer,
      form: "fraction",
      mistakes: [
        why(
          answer.neg(),
          "That has the wrong sign; keep the signs of the factors and of $x$.",
          "那是符号错了；要保留各因子和 $x$ 的符号。",
        ),
        why(
          second,
          "That is the $x^2$ term, the last one kept, not the first one left out.",
          "那是 $x^2$ 项，即保留的最后一项，不是第一个被舍去的项。",
        ),
        why(answer.mul(Q.of(6)), "That forgets to divide by $3! = 6$.", "那是忘了除以 $3! = 6$。"),
        why(x.pow(3), "That leaves out the coefficient of $x^3$.", "那是漏掉了 $x^3$ 的系数。"),
        why(c3, "That gives the coefficient without multiplying by $x^3$.", "那是只给出系数，没有乘以 $x^3$。"),
      ].filter((m, i, all) => !(m.value as Q).eq(answer) && all.findIndex((o) => (o.value as Q).eq(m.value as Q)) === i),
      solution: walked(
        [
          [
            ["Identify the omitted term", "确定被舍去的项"],
            t(
              `Here $x = ${x.toLatex()}$, and the first three terms stop at $x^2$, so the first term left out is the $x^3$ term.`,
              `这里 $x = ${x.toLatex()}$，前三项到 $x^2$ 为止，所以第一个被舍去的是 $x^3$ 项。`,
            ),
          ],
          [
            ["Find its coefficient", "求它的系数"],
            t(
              `$\\frac{${bracketPow(alpha, 1)}${bracketPow(alpha.sub(Q.of(1)), 1)}${bracketPow(alpha.sub(Q.of(2)), 1)}}{6} = ${c3.toLatex()}$.`,
              `$\\frac{${bracketPow(alpha, 1)}${bracketPow(alpha.sub(Q.of(1)), 1)}${bracketPow(alpha.sub(Q.of(2)), 1)}}{6} = ${c3.toLatex()}$。`,
            ),
          ],
          [
            ["Multiply by the cube", "乘以立方"],
            t(
              `$${lead}${bracketPow(x, 3)} = ${lead}${bracketPow(x.pow(3), 1)} = ${answer.toLatex()}$.`,
              `$${lead}${bracketPow(x, 3)} = ${lead}${bracketPow(x.pow(3), 1)} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The term after it is $\\frac{\\alpha - 3}{4}x$ times this one, that is $${bracketPow(alpha.sub(Q.of(3)).mul(x).div(Q.of(4)), 1)}$ times it, which is much smaller, so the error is close to $${answer.toLatex()}$.`,
          `再下一项是这一项的 $\\frac{\\alpha - 3}{4}x$ 倍，即 $${bracketPow(alpha.sub(Q.of(3)).mul(x).div(Q.of(4)), 1)}$ 倍，小得多，所以误差接近 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
};

const walksInACompleteGraph: KnowledgePointDef = {
  id: "walks-between-two-vertices-of-a-complete-graph",
  title: t("Walks between two vertices of a complete graph", "完全图中两顶点之间的途径"),
  explanation: t(
    "The symmetry of a complete graph means only one thing matters about a walk's current position: whether it stands at the target vertex or somewhere else. So keep two counts, one for walks ending at the target and one for walks ending at any particular other vertex, and update both as the walk grows. This avoids any matrix power. In $K_{15}$, with $a_j$ the walks of length $j$ from $u$ back to $u$ and $b_j$ those from $u$ to $v$, $a_1 = 0$ and $b_1 = 1$ give $a_2 = 14$, $b_2 = 13$, and then $b_3 = a_2 + 13 b_2 = 14 + 169 = 183$.\n\n> **Watch out.** A walk may revisit vertices, so this is not a count of paths; and a walk standing at a vertex cannot step to that same vertex, so the last step is not free: $(n - 1)^k$ counts the walks ending anywhere.",
    "完全图的对称性意味着，途径当前的位置只有一点重要：它是否在目标顶点上。所以维护两个计数，一个是结束于目标顶点的途径数，另一个是结束于某个特定其他顶点的途径数，随途径变长同时更新。这样就不需要计算矩阵的幂。在 $K_{15}$ 中，设 $a_j$ 是从 $u$ 回到 $u$ 的长度为 $j$ 的途径数，$b_j$ 是从 $u$ 到 $v$ 的途径数，由 $a_1 = 0$，$b_1 = 1$ 得 $a_2 = 14$，$b_2 = 13$，于是 $b_3 = a_2 + 13 b_2 = 14 + 169 = 183$。\n\n> **注意。** 途径可以重复经过顶点，所以这不是数路径；而且站在某个顶点的途径不能走到同一个顶点，所以最后一步不是任意的：$(n - 1)^k$ 数的是终点任意的途径。",
  ),
  generate(rng) {
    const n = rng.int(4, 12);
    const k = rng.int(2, 6);
    const same = [0];
    const other = [1];
    for (let i = 1; i < k; i++) {
      same.push((n - 1) * (other[i - 1] as number));
      other.push((same[i - 1] as number) + (n - 2) * (other[i - 1] as number));
    }
    const answer = other[k - 1] as number;
    const lastSame = same[k - 2] as number;
    const lastOther = other[k - 2] as number;
    const lastTerms = [...(lastSame === 0 ? [] : [`${lastSame}`]), lastOther === 1 ? `${n - 2}` : `${n - 2} \\cdot ${lastOther}`].join(
      " + ",
    );
    const finalStep = lastTerms === `${answer}` ? `b_{${k}} = ${answer}` : `b_{${k}} = ${lastTerms} = ${answer}`;
    const table = range(1, k - 1)
      .map((j) => `(a_{${j}}, b_{${j}}) = (${same[j - 1] as number}, ${other[j - 1] as number})`)
      .join(", ");
    const power = (n - 1) ** k;
    const sign = k % 2 === 0 ? "-" : "+";
    return numberProblem({
      prompt: t(
        `In the complete graph $K_{${n}}$, $u$ and $v$ are two different vertices. How many walks of length ${k} go from $u$ to $v$?`,
        `在完全图 $K_{${n}}$ 中，$u$ 和 $v$ 是两个不同的顶点。从 $u$ 到 $v$ 长度为 ${k} 的途径有多少条？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          power,
          `That counts every walk of length ${k} from $u$, wherever it ends.`,
          `那是数了从 $u$ 出发、长度为 ${k} 的所有途径，不管终点在哪里。`,
        ),
        why(
          (n - 1) ** (k - 1),
          "That lets the earlier steps go anywhere and forces the last step to $v$, but a walk already at $v$ cannot step to $v$.",
          "那是让前面的步任意走、最后一步走到 $v$，但已经在 $v$ 的途径不能再走到 $v$。",
        ),
        why(
          same[k - 1] as number,
          `That counts the walks from $u$ back to $u$, not to $v$.`,
          `那是数了从 $u$ 回到 $u$ 的途径，不是到 $v$ 的。`,
        ),
        why(
          (n - 2) ** (k - 1),
          "That never lets the walk pass through $u$ or $v$ on the way; a walk may revisit them.",
          "那是不让途径中途经过 $u$ 或 $v$；途径可以重复经过它们。",
        ),
        why(
          n ** (k - 1),
          "That lets a step stay at the same vertex; a complete graph has no loops.",
          "那是允许某一步停在原顶点；完全图没有环。",
        ),
        why(answer + 1, "That is one too many: check the recurrence step by step.", "多了一：逐步检查递推。"),
        why(answer - 1, "That is one too few: check the recurrence step by step.", "少了一：逐步检查递推。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Set up two counts", "设两个计数"],
            t(
              `Let $a_j$ count walks of length $j$ from $u$ back to $u$, and $b_j$ those from $u$ to one other vertex, with $a_1 = 0$ and $b_1 = 1$. The last step into $v$ comes from $u$ or from one of the other $${n - 2}$ vertices, so $b_{j+1} = a_j + ${n - 2}b_j$, and $a_{j+1} = ${n - 1}b_j$.`,
              `设 $a_j$ 是从 $u$ 回到 $u$ 的长度为 $j$ 的途径数，$b_j$ 是从 $u$ 到某个其他顶点的途径数，$a_1 = 0$，$b_1 = 1$。进入 $v$ 的最后一步来自 $u$ 或其他 $${n - 2}$ 个顶点之一，所以 $b_{j+1} = a_j + ${n - 2}b_j$，$a_{j+1} = ${n - 1}b_j$。`,
            ),
          ],
          [[`Work up to length ${k}`, `递推到长度 ${k}`], t(`$${table}$, so $${finalStep}$.`, `$${table}$，所以 $${finalStep}$。`)],
        ],
        t(
          `The closed form $b_k = \\frac{(n - 1)^k - (-1)^k}{n}$ gives $\\frac{${n - 1}^{${k}} ${sign} 1}{${n}} = \\frac{${k % 2 === 0 ? power - 1 : power + 1}}{${n}} = ${answer}$.`,
          `闭式 $b_k = \\frac{(n - 1)^k - (-1)^k}{n}$ 给出 $\\frac{${n - 1}^{${k}} ${sign} 1}{${n}} = \\frac{${k % 2 === 0 ? power - 1 : power + 1}}{${n}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const traceOfDirectedSquare: KnowledgePointDef = {
  id: "the-trace-of-the-square-of-a-directed-adjacency-matrix",
  figure: discreteDrawings2["adjacency-matrices-of-directed-graphs#the-trace-of-the-square-of-a-directed-adjacency-matrix"],
  title: t("The trace of the square of a directed adjacency matrix", "有向图邻接矩阵平方的迹"),
  explanation: t(
    "The diagonal of the square of an adjacency matrix counts closed walks of length two. In a directed graph without loops, such a walk leaves a vertex and returns at once, so it needs arcs in both directions between two vertices. This means the trace can be read from the matrix by looking for symmetric pairs of ones, without squaring. In the drawing, only $1$ and $2$ are joined both ways, so the diagonal of $A^2$ is $1, 1, 0$ and the trace is $2$. A directed graph on $8$ vertices with $3$ pairs joined both ways has trace $2 \\cdot 3 = 6$, however many one-way arcs it has.\n\n> **Watch out.** Each pair joined both ways counts twice, once from each end. And one-way arcs add nothing, so the trace is not the number of arcs.",
    "邻接矩阵平方的对角线计算长度为二的闭途径。在没有环的有向图中，这样的途径离开一个顶点又立刻返回，所以两个顶点之间必须有两个方向的弧。因此不必做平方，只要在矩阵中寻找对称的一对一，就能读出迹。图中只有 $1$ 和 $2$ 双向相连，所以 $A^2$ 的对角线为 $1, 1, 0$，迹为 $2$。一个有 $8$ 个顶点、$3$ 对双向相连顶点的有向图，不论单向弧有多少，迹都是 $2 \\cdot 3 = 6$。\n\n> **注意。** 每对双向相连的顶点算两次，从两端各算一次。单向弧不起作用，所以迹不是弧的条数。",
  ),
  generate(rng) {
    const n = rng.pick([4, 5]);
    const rows: number[][] = range(0, n - 1).map((i) => range(0, n - 1).map((j) => (i !== j && rng.int(0, 1) === 1 ? 1 : 0)));
    const entry = (i: number, j: number) => (rows[i] as number[])[j] as number;
    const bothWays = () =>
      range(0, n - 1).flatMap((i) =>
        range(i + 1, n - 1)
          .filter((j) => entry(i, j) === 1 && entry(j, i) === 1)
          .map((j) => [i, j] as const),
      );
    if (bothWays().length === 0) {
      (rows[0] as number[])[1] = 1;
      (rows[1] as number[])[0] = 1;
    }
    const pairs = bothWays();
    const arcs = rows.flat().reduce((s, v) => s + v, 0);
    const answer = 2 * pairs.length;
    const names = pairs.map(([i, j]) => `\\{${"ABCDE"[i]}, ${"ABCDE"[j]}\\}`).join(", ");
    return numberProblem({
      prompt: t(
        `A directed graph on vertices $${letterList(range(0, n - 1))}$ has adjacency matrix $M = ${matrix(rows)}$. Find the trace of $M^2$.`,
        `顶点为 $${letterList(range(0, n - 1))}$ 的有向图的邻接矩阵是 $M = ${matrix(rows)}$。求 $M^2$ 的迹。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          pairs.length,
          "That counts each pair joined both ways once; it gives a closed walk from each end.",
          "那是每对双向相连的顶点只算一次；它从两端各给出一条闭途径。",
        ),
        why(
          arcs,
          "That counts every arc; only arcs with a partner in the other direction close a walk of length two.",
          "那数了所有的弧；只有反方向也有弧的弧才能构成长度为二的闭途径。",
        ),
        why(
          2 * arcs,
          "That doubles every arc; one-way arcs give no closed walk of length two.",
          "那是把所有的弧加倍；单向弧不给出长度为二的闭途径。",
        ),
        why(
          answer + 2,
          "That counts one pair too many: check that both $M_{ij}$ and $M_{ji}$ are $1$.",
          "多数了一对：检查 $M_{ij}$ 和 $M_{ji}$ 是否都为 $1$。",
        ),
        why(
          answer + 4,
          "That counts two pairs too many: check that both $M_{ij}$ and $M_{ji}$ are $1$.",
          "多数了两对：检查 $M_{ij}$ 和 $M_{ji}$ 是否都为 $1$。",
        ),
        why(
          n,
          "That is the number of vertices; most of them need not lie on a closed walk of length two.",
          "那是顶点数；大多数顶点不一定在长度为二的闭途径上。",
        ),
      ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
      solution: walked(
        [
          [
            ["Find the pairs joined both ways", "找出双向相连的顶点对"],
            t(
              `A closed walk of length two goes out along an arc and straight back, so it needs symmetric ones in $M$. These are at the pairs $${names}$.`,
              `长度为二的闭途径沿一条弧出去又立刻返回，所以需要 $M$ 中对称的一。它们位于顶点对 $${names}$。`,
            ),
          ],
          [
            ["Count two walks per pair", "每对算两条途径"],
            t(
              pairs.length === 1
                ? `The pair gives two closed walks, one from each end, so the trace is $${answer}$.`
                : `Each pair gives two closed walks, one from each end, so the trace is $2 \\cdot ${pairs.length} = ${answer}$.`,
              pairs.length === 1
                ? `这一对给出两条闭途径，从两端各一条，所以迹是 $${answer}$。`
                : `每对给出两条闭途径，从两端各一条，所以迹是 $2 \\cdot ${pairs.length} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Row by row, $(M^2)_{ii}$ counts the vertices joined to $i$ both ways: $${range(0, n - 1)
            .map((i) => range(0, n - 1).filter((j) => entry(i, j) === 1 && entry(j, i) === 1).length)
            .join(" + ")} = ${answer}$.`,
          `逐行看，$(M^2)_{ii}$ 是与 $i$ 双向相连的顶点数：$${range(0, n - 1)
            .map((i) => range(0, n - 1).filter((j) => entry(i, j) === 1 && entry(j, i) === 1).length)
            .join(" + ")} = ${answer}$。`,
        ),
      ),
    });
  },
};

const whereKahnStops: KnowledgePointDef = {
  id: "where-kahns-algorithm-stops-on-a-graph-with-a-cycle",
  figure: discreteDrawings2["kahns-algorithm#where-kahns-algorithm-stops-on-a-graph-with-a-cycle"],
  title: t("Where Kahn's algorithm stops on a graph with a cycle", "Kahn 算法在含环图上的停止位置"),
  explanation: t(
    "On a graph with a directed cycle, Kahn's algorithm cannot finish. Vertices on the cycle never reach in-degree zero, since each waits for the one before it, and anything that can be reached from the cycle waits too. The algorithm outputs everything else and then stops with vertices left over, and this is how it detects a cycle. In the drawing, $S$ leads into the cycle $A, B, C$, and $C$ leads on to $T$: the algorithm outputs $S$ and stops, with the $4$ vertices $A$, $B$, $C$ and $T$ left over. With the arcs $(S, A), (A, B), (B, C), (C, A)$ and an arc from $C$ to each of six more vertices, the algorithm outputs only $S$ and stops with $9$ of the $10$ vertices left.\n\n> **Watch out.** The vertices after the cycle are stuck too, even though they are not on it. And the vertices of in-degree zero at the start are not the whole output: removing them can free others.",
    "在含有向环的图上，Kahn 算法无法完成。环上的顶点入度永远到不了零，因为每个都在等它前面的顶点；从环出发能到达的顶点也都要等。算法输出其余所有顶点，然后在还有顶点剩余时停止，它正是这样检测到环的。图中 $S$ 通向环 $A, B, C$，$C$ 再通向 $T$：算法输出 $S$ 后停止，剩下 $A$、$B$、$C$、$T$ 这 $4$ 个顶点。若有弧 $(S, A), (A, B), (B, C), (C, A)$，并从 $C$ 到另外六个顶点各有一条弧，则算法只输出 $S$ 就停止，$10$ 个顶点中剩下 $9$ 个。\n\n> **注意。** 环之后的顶点虽然不在环上，也同样被卡住。而且开始时入度为零的顶点并不是全部输出：删去它们可能使其他顶点变为可用。",
  ),
  generate(rng) {
    const n = rng.pick([6, 7]);
    const ids = sampleFrom(rng, range(0, n - 1), n);
    const front = rng.int(1, 3);
    const cycle = rng.int(2, 3);
    const frontIds = ids.slice(0, front);
    const onCycle = ids.slice(front, front + cycle);
    const back = ids.slice(front + cycle);
    const edges: [number, number][] = [];
    const add = (u: number, v: number) => {
      if (!edges.some(([a, b]) => a === u && b === v)) edges.push([u, v]);
    };
    onCycle.forEach((u, i) => {
      add(u, onCycle[(i + 1) % onCycle.length] as number);
    });
    for (let i = 0; i < front; i++) {
      for (let j = i + 1; j < n; j++) {
        if (rng.int(0, 2) === 0) add(ids[i] as number, ids[j] as number);
      }
    }
    add(rng.pick(frontIds), rng.pick(onCycle));
    back.forEach((v, i) => {
      if (rng.int(0, 1) === 0) add(rng.pick(onCycle), v);
      else add(rng.pick(frontIds), v);
      if (i > 0 && rng.int(0, 1) === 0) add(back[i - 1] as number, v);
    });
    const remaining = new Set(ids);
    const output: number[] = [];
    for (;;) {
      const ready = [...remaining].sort((a, b) => a - b).find((v) => !edges.some(([u, w]) => w === v && remaining.has(u)));
      if (ready === undefined) break;
      remaining.delete(ready);
      output.push(ready);
    }
    const answer = output.length;
    const initial = ids.filter((v) => !edges.some(([, w]) => w === v)).length;
    const left = letterList([...remaining].sort((a, b) => a - b));
    return numberProblem({
      prompt: t(
        `Let $G$ be the directed graph with $V = \\{${letterList(range(0, n - 1))}\\}$ and $E = \\{${arcSet(edges)}\\}$. Kahn's algorithm is run on $G$. How many vertices does it output before it stops?`,
        `设 $G$ 是有向图，$V = \\{${letterList(range(0, n - 1))}\\}$，$E = \\{${arcSet(edges)}\\}$。在 $G$ 上运行 Kahn 算法。它停止之前输出多少个顶点？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          n,
          "That assumes the algorithm finishes; the cycle stops it with vertices left over.",
          "那是假定算法能完成；环会使它在还有顶点剩余时停止。",
        ),
        why(n - answer, "That is the number of vertices left over, not the number output.", "那是剩下的顶点数，不是输出的顶点数。"),
        why(
          initial,
          "That counts only the vertices of in-degree zero at the start; removing them frees others.",
          "那只数了开始时入度为零的顶点；删去它们会使其他顶点变为可用。",
        ),
        why(
          answer + 1,
          "That is one too many: after the last output, every remaining vertex still has an incoming arc.",
          "多了一：最后一次输出后，剩下的每个顶点都仍有入弧。",
        ),
        why(
          answer - 1,
          "That is one too few: recheck which vertices are freed after each output.",
          "少了一：重新检查每次输出后哪些顶点变为可用。",
        ),
      ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
      solution: walked(
        [
          [
            ["Output vertices of in-degree zero", "输出入度为零的顶点"],
            t(
              `Removing vertices of in-degree zero one at a time, the algorithm outputs $${letterList(output)}$.`,
              `依次删去入度为零的顶点，算法输出 $${letterList(output)}$。`,
            ),
          ],
          [
            ["See where it stops", "看它停在哪里"],
            t(
              `Then each of $${left}$ still has an incoming arc from another remaining vertex, so it stops after $${answer}$ ${answer === 1 ? "vertex" : "vertices"}.`,
              `之后 $${left}$ 中每个顶点仍有来自其他剩余顶点的入弧，所以它输出 $${answer}$ 个顶点后停止。`,
            ),
          ],
        ],
        t(
          `The vertices left over contain the directed cycle $${[...onCycle, onCycle[0] as number].map((v) => "ABCDEFGH"[v]).join(" \\to ")}$, and $${answer} + ${n - answer} = ${n}$ accounts for every vertex.`,
          `剩下的顶点中含有有向环 $${[...onCycle, onCycle[0] as number].map((v) => "ABCDEFGH"[v]).join(" \\to ")}$，而 $${answer} + ${n - answer} = ${n}$ 正好是全部顶点。`,
        ),
      ),
    });
  },
};

const tentativeLabel: KnowledgePointDef = {
  id: "a-tentative-distance-during-dijkstras-algorithm",
  figure: discreteDrawings2["dijkstras-algorithm#a-tentative-distance-during-dijkstras-algorithm"],
  title: t("A tentative distance during Dijkstra's algorithm", "Dijkstra 算法过程中的暂定距离"),
  explanation: t(
    "Dijkstra's algorithm keeps a tentative distance for every vertex and improves it as vertices are finalized. A tentative distance is the best route found so far that passes only through finalized vertices, so it may be larger than the true distance. Each time a vertex is finalized, compare the route through it with the current label and keep the smaller. In the drawing, once $A$ is finalized, $B$ has tentative distance $7$ and $C$ has $2$; once $C$ is finalized too, the route through it improves the label of $B$ to $\\min(7, 2 + 3) = 5$. With $AB\\colon 60$, $AC\\colon 22$, $CB\\colon 25$, finalizing $A$ and then $C$ lowers the label of $B$ from $60$ to $\\min(60, 22 + 25) = 47$.\n\n> **Watch out.** The route through the newly finalized vertex is its distance plus the edge, not the edge alone. And keep the old label when it is smaller; a label only ever goes down.",
    "Dijkstra 算法为每个顶点保存一个暂定距离，并在顶点确定时改进它。暂定距离是目前找到的、只经过已确定顶点的最佳路线，所以可能大于真实距离。每确定一个顶点，就把经过它的路线与当前标记比较，保留较小的。图中确定 $A$ 后，$B$ 的暂定距离为 $7$，$C$ 为 $2$；再确定 $C$ 后，经过它的路线把 $B$ 的标记改进为 $\\min(7, 2 + 3) = 5$。若 $AB\\colon 60$、$AC\\colon 22$、$CB\\colon 25$，先确定 $A$ 再确定 $C$，$B$ 的标记从 $60$ 降为 $\\min(60, 22 + 25) = 47$。\n\n> **注意。** 经过新确定顶点的路线长度是它的距离加上边权，而不只是边权。旧标记更小时要保留它；标记只会下降。",
  ),
  generate(rng) {
    const pairs = range(0, 4).flatMap((i) => range(i + 1, 4).map((j) => [i, j] as const));
    for (;;) {
      const weights = new Map<string, number>();
      for (const [i, j] of pairs) {
        if (rng.int(0, 3) !== 0) weights.set(`${i}${j}`, rng.int(1, 20));
      }
      const w = (a: number, b: number) => weights.get(a < b ? `${a}${b}` : `${b}${a}`);
      const direct = range(1, 4).filter((v) => w(0, v) !== undefined);
      if (direct.length < 2) continue;
      const nearestDistance = Math.min(...direct.map((v) => w(0, v) as number));
      const closest = direct.filter((v) => w(0, v) === nearestDistance);
      if (closest.length !== 1) continue;
      const nearest = closest[0] as number;
      const improved = range(1, 4).filter((v) => {
        const through = w(nearest, v);
        if (v === nearest || through === undefined) return false;
        const old = w(0, v);
        return old === undefined || nearestDistance + through < old;
      });
      if (improved.length === 0) continue;
      const target = rng.pick(improved);
      const through = w(nearest, target) as number;
      const answer = nearestDistance + through;
      const old = w(0, target);
      const graph = pairs
        .filter(([i, j]) => weights.has(`${i}${j}`))
        .map(([i, j]) => `${"ABCDE"[i]}${"ABCDE"[j]}\\colon ${weights.get(`${i}${j}`)}`)
        .join(",\\ ");
      const name = "ABCDE"[target];
      const close = "ABCDE"[nearest];
      const oldEn = old === undefined ? "had no label yet" : `had label $${old}$ from the edge from $A$`;
      const oldZh = old === undefined ? "还没有标记" : `的标记是来自 $A$ 的边给出的 $${old}$`;
      return numberProblem({
        prompt: t(
          `A weighted graph on vertices $A$, $B$, $C$, $D$, $E$ has edges with weights $${graph}$. Dijkstra's algorithm starts from $A$. After $A$ and one more vertex have been finalized, what is the tentative distance of $${name}$?`,
          `一个带权图的顶点为 $A$、$B$、$C$、$D$、$E$，边的权为 $${graph}$。Dijkstra 算法从 $A$ 开始。在 $A$ 和另一个顶点确定之后，$${name}$ 的暂定距离是多少？`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(
            through,
            `That is the edge from $${close}$ alone; the route also needs the distance $${nearestDistance}$ to $${close}$.`,
            `那只是从 $${close}$ 出发的边；路线还要加上到 $${close}$ 的距离 $${nearestDistance}$。`,
          ),
          ...(old === undefined
            ? [
                why(
                  through + 1,
                  "That is one more than the edge alone; add the distance to the finalized vertex instead.",
                  "那是边权加一；应当加上到已确定顶点的距离。",
                ),
              ]
            : [
                why(
                  old,
                  "That is the old label from the edge from $A$; the route through the finalized vertex is shorter.",
                  "那是来自 $A$ 的边给出的旧标记；经过已确定顶点的路线更短。",
                ),
              ]),
          why(answer + 1, "That is one too many: add the distance and the edge again.", "多了一：重新把距离与边权相加。"),
          why(
            nearestDistance,
            "That is the distance of the finalized vertex, not of the one asked about.",
            "那是已确定顶点的距离，不是所问顶点的距离。",
          ),
          why(answer - 1, "That is one too few: add the distance and the edge again.", "少了一：重新把距离与边权相加。"),
          why(answer + 2, "That is two too many: add the distance and the edge again.", "多了二：重新把距离与边权相加。"),
        ].filter((x, i, all) => x.value !== answer && all.findIndex((o) => o.value === x.value) === i),
        solution: walked(
          [
            [
              ["Finalize the nearest vertex", "确定最近的顶点"],
              t(
                `From $A$, the smallest edge leads to $${close}$ with weight $${nearestDistance}$, so $${close}$ is finalized next. Before that, $${name}$ ${oldEn}.`,
                `从 $A$ 出发，最小的边通向 $${close}$，权为 $${nearestDistance}$，所以接下来确定 $${close}$。在此之前，$${name}$ ${oldZh}。`,
              ),
            ],
            [
              ["Update the label", "更新标记"],
              t(
                `The route through $${close}$ costs $${nearestDistance} + ${through} = ${answer}$, which is smaller, so the label becomes $${answer}$.`,
                `经过 $${close}$ 的路线长度是 $${nearestDistance} + ${through} = ${answer}$，更小，所以标记变为 $${answer}$。`,
              ),
            ],
          ],
          old === undefined
            ? t(
                `The route $A, ${close}, ${name}$ is the only one so far through finalized vertices, and $${nearestDistance} + ${through} = ${answer}$.`,
                `路线 $A, ${close}, ${name}$ 是目前唯一一条只经过已确定顶点的路线，且 $${nearestDistance} + ${through} = ${answer}$。`,
              )
            : t(
                `Of the two routes through finalized vertices, the direct edge costs $${old}$ and $A, ${close}, ${name}$ costs $${answer}$, and $\\min(${old}, ${answer}) = ${answer}$.`,
                `在只经过已确定顶点的两条路线中，直接的边长 $${old}$，$A, ${close}, ${name}$ 长 $${answer}$，而 $\\min(${old}, ${answer}) = ${answer}$。`,
              ),
        ),
      });
    }
  },
};

const mealyToMooreStates: KnowledgePointDef = {
  id: "the-states-of-a-moore-machine-from-a-mealy-machine",
  title: t("The states of a Moore machine from a Mealy machine", "由 Mealy 机得到的 Moore 机的状态数"),
  explanation: t(
    "A Mealy machine attaches outputs to transitions, whereas a Moore machine attaches them to states. To convert, a state entered with two different outputs must be split, since one Moore state can show only one output. So each new state is a pair of an old state and an output with which it is entered.\n\n> **Watch out.** Split only the states entered with two different outputs. If $q_1$ is entered as $q_1/0$ from two different rows, that gives the single pair $(q_1, 0)$, so $q_1$ stays one state.",
    "Mealy 机把输出放在转移上，而 Moore 机把输出放在状态上。转换时，以两种不同输出进入的状态必须拆分，因为一个 Moore 状态只能显示一种输出。所以每个新状态都是一个旧状态和进入它时的一个输出组成的对。\n\n> **注意。** 只拆分以两种不同输出进入的状态。若 $q_1$ 从两行都以 $q_1/0$ 进入，只得到一个对 $(q_1, 0)$，所以 $q_1$ 仍是一个状态。",
  ),
  generate(rng) {
    for (;;) {
      const k = rng.pick([3, 4]);
      const table = range(0, k - 1).map(
        () =>
          [
            [rng.int(0, k - 1), rng.int(0, 1)],
            [rng.int(0, k - 1), rng.int(0, 1)],
          ] as const,
      );
      const reached = new Set([0]);
      for (let round = 0; round < k; round++) {
        for (const q of [...reached]) {
          for (const [to] of table[q] as (typeof table)[number]) reached.add(to);
        }
      }
      if (reached.size !== k) continue;
      const pairs = new Set(table.flatMap((row) => row.map(([to, out]) => `${to},${out}`)));
      const startEntered = table.some((row) => row.some(([to]) => to === 0));
      const answer = pairs.size + (startEntered ? 0 : 1);
      if (answer === k) continue;
      const split = range(0, k - 1).filter((q) => pairs.has(`${q},0`) && pairs.has(`${q},1`)).length;
      const cell = ([to, out]: readonly [number, number]) => `q_{${to}}/${out}`;
      const shown = automatonTable(table.map((row) => [cell(row[0]), cell(row[1])]));
      const list = [...pairs]
        .sort()
        .map((p) => `(q_{${p.split(",")[0]}}, ${p.split(",")[1]})`)
        .join(", ");
      return numberProblem({
        prompt: t(
          `A Mealy machine with start state $q_0$ has transition table $${shown}$, where each entry shows the next state and the output. It is converted to a Moore machine by making one state for each pair of a state and an output with which that state is entered, with one extra state for $q_0$ if it is never entered. How many states does the Moore machine have?`,
          `一个 Mealy 机的起始状态是 $q_0$，转移表为 $${shown}$，每格表示下一状态和输出。把它转换成 Moore 机：对每个状态和进入该状态时的一个输出组成的对，建立一个状态；如果 $q_0$ 从未被进入，再为它加一个状态。这个 Moore 机有多少个状态？`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(
            k,
            "That keeps the states as they are; a state entered with two different outputs must be split.",
            "那是保持状态不变；以两种不同输出进入的状态必须拆分。",
          ),
          why(
            2 * k,
            "That splits every state into both outputs, including pairs that never occur.",
            "那是把每个状态都按两种输出拆分，包括从未出现的对。",
          ),
          startEntered
            ? why(
                pairs.size + 1,
                "That adds an extra state for $q_0$, but $q_0$ is entered by some transition.",
                "那为 $q_0$ 额外加了一个状态，但 $q_0$ 有转移进入。",
              )
            : why(
                pairs.size,
                "That leaves out the extra state for $q_0$, which is never entered.",
                "那漏掉了为 $q_0$ 加的额外状态，而 $q_0$ 从未被进入。",
              ),
        ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
        solution: walked(
          [
            [
              ["List the pairs", "列出所有对"],
              t(`The pairs of a state and an output that occur in the table are`, `表中出现的状态与输出的对为`),
              [list],
            ],
            [
              ["The start state", "初始状态"],
              startEntered
                ? t(
                    "The state $q_0$ is entered by some transition, so no extra state is needed.",
                    "状态 $q_0$ 有转移进入，所以不需要额外的状态。",
                  )
                : t("The state $q_0$ is never entered, so it needs one extra state.", "状态 $q_0$ 从未被进入，所以需要一个额外的状态。"),
            ],
            [
              ["Count", "计数"],
              t(
                "Each pair, and the extra state if there is one, becomes a state of the Moore machine:",
                "每个对（以及额外的状态，如果有）成为 Moore 机的一个状态：",
              ),
              [startEntered ? `${pairs.size}` : `${pairs.size} + 1 = ${answer}`],
            ],
          ],
          t(
            `Every one of the $${k}$ states is reached, and $${split}$ of them are entered with both outputs and split in two, so the count is also $${k} + ${split} = ${answer}$.`,
            `$${k}$ 个状态都能到达，其中 $${split}$ 个以两种输出进入而被一分为二，所以个数也是 $${k} + ${split} = ${answer}$。`,
          ),
        ),
      });
    }
  },
};

const acceptedStringsByLength: KnowledgePointDef = {
  id: "counting-the-accepted-strings-of-a-given-length",
  title: t("Counting the accepted strings of a given length", "计算给定长度的被接受字符串"),
  explanation: t(
    "Listing every string of a given length is slow, since the number doubles with each symbol. A deterministic automaton gives a better way, because each string follows exactly one path. Keep a count of the strings of the current length that end in each state, and let each count flow along the two outgoing transitions to produce the next length.\n\n> **Watch out.** Every state sends its count along both of its transitions, so the counts for length $n$ add up to $2^n$. If both transitions of $q_1$ lead to $q_2$ and $3$ strings end in $q_1$, then $q_2$ receives $6$ from it, not $3$.",
    "列出给定长度的所有字符串很慢，因为每多一个符号，数量就翻倍。确定性自动机提供了更好的办法，因为每个字符串恰好走一条路径。记录当前长度的字符串结束于每个状态的个数，让每个计数沿两条出边转移，就得到下一长度的计数。\n\n> **注意。** 每个状态都把它的计数沿两条转移送出，所以长度为 $n$ 的计数之和是 $2^n$。若 $q_1$ 的两条转移都指向 $q_2$，且有 $3$ 个串结束于 $q_1$，则 $q_2$ 从它那里得到 $6$，而不是 $3$。",
  ),
  generate(rng) {
    for (;;) {
      const k = rng.pick([3, 4]);
      const table = range(0, k - 1).map(() => [rng.int(0, k - 1), rng.int(0, k - 1)] as const);
      const accepting = sampleFrom(rng, range(0, k - 1), rng.int(1, 2)).sort((a, b) => a - b);
      const length = rng.int(4, 7);
      const steps: number[][] = [range(0, k - 1).map((q) => (q === 0 ? 1 : 0))];
      for (let i = 0; i < length; i++) {
        const next = range(0, k - 1).map(() => 0);
        (steps[i] as number[]).forEach((count, q) => {
          for (const to of table[q] as readonly [number, number]) next[to] = (next[to] as number) + count;
        });
        steps.push(next);
      }
      const accepted = (v: readonly number[]) => accepting.reduce((s, q) => s + (v[q] as number), 0);
      const last = steps[length] as number[];
      const answer = accepted(last);
      if (answer === 0 || answer === 2 ** length) continue;
      const shown = automatonTable(
        table.map(([a, b]) => [`q_{${a}}`, `q_{${b}}`]),
        accepting,
      );
      const vectors = steps.map((v) => `(${v.join(", ")})`);
      const rows = range(0, Math.ceil(vectors.length / 4) - 1).map(
        (r) => `${r === 0 ? "" : "\\to "}${vectors.slice(4 * r, 4 * r + 4).join(" \\to ")}`,
      );
      const order = range(0, k - 1)
        .map((q) => `q_{${q}}`)
        .join(", ");
      const picked = accepting.map((q) => last[q] as number);
      return numberProblem({
        prompt: t(
          `A DFA over the alphabet $\\{0, 1\\}$ has transition table $${shown}$. How many strings of length ${length} does it accept?`,
          `字母表 $\\{0, 1\\}$ 上的一个 DFA 的转移表为 $${shown}$。它接受多少个长度为 ${length} 的字符串？`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(2 ** length - answer, "That counts the strings the DFA rejects.", "那是 DFA 拒绝的字符串的个数。"),
          why(
            accepted(steps[length - 1] as number[]),
            `That stops one step early, counting the accepted strings of length $${length - 1}$.`,
            `那少走了一步，数的是长度为 $${length - 1}$ 的被接受字符串。`,
          ),
          why(
            2 ** (length - 1),
            "That assumes half of all strings are accepted; the counts depend on the table.",
            "那假定恰好一半的字符串被接受；个数取决于转移表。",
          ),
          ...(accepting.length > 1
            ? [why(picked[0] as number, "That adds the count of only one of the accepting states.", "那只加了其中一个接受状态的计数。")]
            : []),
        ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
        solution: walked(
          [
            [
              ["Pass the counts along", "传递计数"],
              t(
                `Start with one string, the empty one, at $q_0$, and at each step send every count along both transitions. The counts for lengths $0$ to $${length}$, in the order $${order}$, are`,
                `从 $q_0$ 上的一个字符串（空串）开始，每一步把每个计数沿两条转移送出。长度 $0$ 到 $${length}$ 的计数（按 $${order}$ 的顺序）为`,
              ),
              rows,
            ],
            [
              ["Add the accepting states", "把接受状态相加"],
              t(
                `The accepting states are $${accepting.map((q) => `q_{${q}}`).join(", ")}$:`,
                `接受状态为 $${accepting.map((q) => `q_{${q}}`).join(", ")}$：`,
              ),
              [accepting.length > 1 ? `${picked.join(" + ")} = ${answer}` : `${answer}`],
            ],
          ],
          t(
            `The counts for length $${length}$ add to $${last.join(" + ")} = ${2 ** length} = 2^{${length}}$, the number of binary strings of that length, so no string was lost or counted twice.`,
            `长度 $${length}$ 的计数之和为 $${last.join(" + ")} = ${2 ** length} = 2^{${length}}$，正是该长度的二进制串的个数，所以没有字符串被漏掉或重复计数。`,
          ),
        ),
      });
    }
  },
};

const subsetConstructionStates: KnowledgePointDef = {
  id: "the-states-of-the-subset-construction",
  title: t("The states of the subset construction", "子集构造的状态数"),
  explanation: t(
    "The subset construction turns a nondeterministic automaton into a deterministic one whose states are sets of the original states. There may be many subsets in principle, but only those actually reached from the start matter. So build them as you go: follow both symbols from each new set, and stop when no new set appears. The empty set counts if reached.\n\n> **Watch out.** Count only the subsets actually reached, and include $\\varnothing$ when it is reached. An NFA with $3$ states has $2^3 = 8$ subsets, but if only $\\{q_0\\}$, $\\{q_1\\}$, $\\{q_0, q_2\\}$ and $\\varnothing$ are reached, the DFA has $4$ states.",
    "子集构造把非确定性自动机变成确定性自动机，新状态是原状态的集合。理论上子集可能很多，但只有从起始状态实际到达的才重要。所以边走边构造：从每个新集合沿两个符号出发，直到没有新集合出现。到达的空集也要计入。\n\n> **注意。** 只数实际到达的子集，到达 $\\varnothing$ 时也要计入。有 $3$ 个状态的 NFA 有 $2^3 = 8$ 个子集，但若只到达 $\\{q_0\\}$、$\\{q_1\\}$、$\\{q_0, q_2\\}$ 和 $\\varnothing$，DFA 就有 $4$ 个状态。",
  ),
  generate(rng) {
    for (;;) {
      const k = rng.pick([3, 4]);
      const masks = range(0, k - 1).map(() => [rng.int(0, 2 ** k - 1), rng.int(0, 2 ** k - 1)] as const);
      const step = (set: number, symbol: 0 | 1) =>
        range(0, k - 1).reduce((s, q) => ((set >> q) & 1 ? s | ((masks[q] as readonly [number, number])[symbol] as number) : s), 0);
      const found = [1];
      for (let i = 0; i < found.length; i++) {
        for (const symbol of [0, 1] as const) {
          const next = step(found[i] as number, symbol);
          if (!found.includes(next)) found.push(next);
        }
      }
      const answer = found.length;
      if (answer < 4 || answer === 2 ** k) continue;
      const setLatex = (mask: number) =>
        mask === 0
          ? "\\varnothing"
          : `\\{${range(0, k - 1)
              .filter((q) => (mask >> q) & 1)
              .map((q) => `q_{${q}}`)
              .join(", ")}\\}`;
      const shown = automatonTable(masks.map(([a, b]) => [setLatex(a), setLatex(b)]));
      const list = found.map(setLatex).join(", ");
      return numberProblem({
        prompt: t(
          `An NFA with start state $q_0$ has transition table $${shown}$. The subset construction builds a DFA from it, keeping only the subsets reached from $\\{q_0\\}$ and counting $\\varnothing$ if it is reached. How many states does the DFA have?`,
          `一个 NFA 的起始状态是 $q_0$，转移表为 $${shown}$。用子集构造由它得到一个 DFA，只保留从 $\\{q_0\\}$ 能到达的子集，到达 $\\varnothing$ 时也计入。这个 DFA 有多少个状态？`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(
            2 ** k,
            `That counts all $2^{${k}}$ subsets; only the ones reached from $\\{q_0\\}$ become states.`,
            `那数了全部 $2^{${k}}$ 个子集；只有从 $\\{q_0\\}$ 到达的才成为状态。`,
          ),
          why(2 ** k - 1, "That counts every nonempty subset, reached or not.", "那数了所有非空子集，不论是否到达。"),
          why(
            k,
            "That keeps one state per state of the NFA; the states of the DFA are sets.",
            "那是每个 NFA 状态对应一个状态；DFA 的状态是集合。",
          ),
          ...(found.includes(0)
            ? [
                why(
                  answer - 1,
                  "That leaves out $\\varnothing$, which is reached and counts as a state.",
                  "那漏掉了 $\\varnothing$，它被到达，也算一个状态。",
                ),
              ]
            : []),
        ].filter((m, i, all) => m.value !== answer && all.findIndex((o) => o.value === m.value) === i),
        solution: walked(
          [
            [
              ["Build the reached sets", "构造到达的集合"],
              t(
                "Start from $\\{q_0\\}$ and, for each new set, take the union of its members' entries on each symbol:",
                "从 $\\{q_0\\}$ 开始，对每个新集合，在每个符号上取其成员表项的并集：",
              ),
              found.map(
                (s) =>
                  `${setLatex(s)} \\xrightarrow{0} ${setLatex(step(s, 0))},\\quad ${setLatex(s)} \\xrightarrow{1} ${setLatex(step(s, 1))}`,
              ),
            ],
            [
              ["Count them", "数一数"],
              t(`The sets reached are $${list}$, which is $${answer}$ states.`, `到达的集合是 $${list}$，共 $${answer}$ 个状态。`),
            ],
          ],
          t(
            `Every set on the right of an arrow is already in the list, so the construction is closed and no further set appears; and $${answer}$ is less than the $2^{${k}} = ${2 ** k}$ subsets in all.`,
            `箭头右边的每个集合都已在列表中，所以构造已经封闭，不会再出现新的集合；而 $${answer}$ 小于全部子集的个数 $2^{${k}} = ${2 ** k}$。`,
          ),
        ),
      });
    }
  },
};

/** deeperDiscreteMathematicsPoints gives, by topic id, the knowledge points added after a Discrete Mathematics topic's own. */
export const deeperDiscreteMathematicsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "boolean-functions": [functionsOfAGivenWeight],
  "self-dual-boolean-functions": [selfDualCompletions],
  "monotonic-boolean-functions": [thresholdWeight],
  "logic-gates-and-combinational-circuits": [gateDepth],
  "adding-and-subtracting-binary-integers": [twosComplement],
  "binary-fractions": [binaryPeriod],
  "converting-between-binary-and-hexadecimal-integers": [bitsOfAHexNumber],
  "integers-in-arbitrary-bases": [digitSumRemainder],
  "fermats-little-theorem": [fermatTest],
  "eulers-totient-function": [coprimeInARange],
  "eulers-theorem": [orderModN],
  "the-linear-cipher": [linearCipherKeys],
  "the-diffie-hellman-protocol": [discreteLog],
  "the-rsa-cryptosystem": [rsaFactorFromTotient],
  "the-inclusion-exclusion-principle": [fixedPoints],
  "the-pigeonhole-principle": [pairsWithASum],
  "first-order-recurrence-relations": [firstOrderLimit],
  "second-order-homogeneous-recurrence-relations-with-distinct-real-roots": [recurrenceFromRoots],
  "second-order-homogeneous-recurrence-relations-with-repeated-roots": [parameterForRepeatedRoot],
  "second-order-homogeneous-recurrence-relations-with-complex-roots": [periodicRecurrence],
  "generating-functions": [productOfFiniteSums],
  "generating-functions-of-homogeneous-recurrence-relations": [seriesFromGeneratingFunction],
  "planar-graphs": [facesOfARegularPlanarGraph],
  "complete-and-bipartite-graphs": [mostBipartiteEdges],
  "counting-trees": [treesWithAGivenVertexDegree],
  "cycles-in-graphs": [fourCycles],
  "kruskals-algorithm": [treeAfterANewEdge],
  "deterministic-finite-automata": [productAutomaton],
  "big-theta-notation": [divideAndConquerExponent],
  "boolean-functions-and-logical-operations": [functionsWithFixedValues],
  "disjunctive-normal-forms": [distributingClauses],
  "conjunctive-normal-forms": [clausesOfWidth],
  "principal-disjunctive-normal-forms": [mintermsOfConjunction],
  "principal-conjunctive-normal-forms": [maxtermsFromMinterms],
  "boolean-polynomials": [monomialsOfDegree],
  "simplifying-logical-expressions-using-karnaugh-maps": [karnaughGroups],
  "affine-boolean-functions": [affineDependingOn],
  "binary-integers": [integersWithBits],
  "multiplying-and-dividing-binary-integers": [dividingByPowerOfTwo],
  "hexadecimal-integers": [hexOnes],
  "fractions-in-arbitrary-bases": [placesInPowerBase],
  "introduction-to-cryptography": [affineDecrypt],
  "partitions-of-natural-numbers": [partitionsIntoThree],
  "counting-integer-solutions-of-a-constrained-equation": [twoUpperBounds],
  "the-multinomial-theorem": [coefficientSum],
  "counting-terms-in-multinomial-expansions": [termsWithAllVariables],
  "introduction-to-graphs": [graphsWithEdges],
  "the-handshaking-lemma": [fewestVertices],
  "subgraphs-and-graph-complements": [complementOfRegular],
  "connected-graphs": [mostComponents],
  "cut-vertices-and-cut-edges": [treeCutVertices],
  "trees-and-forests": [fullTreeLeaves],
  "adjacency-matrices": [traceOfCube],
  "distance-matrices": [pathDistanceSum],
  "directed-acyclic-graphs": [dagMostEdges],
  "topological-ordering": [twoChains],
  "breadth-first-search": [bfsDiscovered],
  "prims-algorithm": [primStar],
  "shortest-paths-in-unweighted-graphs": [gridPaths],
  "moore-machines": [mooreCount],
  "the-language-of-automata": [noTwoOnes],
  "regular-expressions": [regexBlock],
  "introduction-to-turing-machines": [tmConfigurations],
  "big-o-notation": [sumOfPowersOrder],
  "big-omega-notation": [omegaThreshold],
  "systems-of-equations-as-augmented-matrices": [rearrangingForAugmentedMatrix],
  "row-echelon-form": [zerosOfRowEchelonForm],
  "solving-systems-of-equations-using-back-substitution": [backSubstitutionCost],
  "truth-preserving-boolean-functions": [preserversOfAGivenWeight],
  "posts-functional-completeness-theorem": [smallestCompleteSubset],
  "introduction-to-logic-circuits": [inputsThatLightACircuit],
  "simplifying-logic-circuits": [gatesSavedByFactoring],
  "many-to-one-transformations-of-discrete-random-variables": [remainderOfARandomVariable],
  "properties-of-expectation-for-discrete-random-variables": [matchingNeighbours],
  "moments-of-discrete-random-variables": [thirdCentralMoment],
  "modeling-with-discrete-uniform-distributions": [largestOfTwoDraws],
  "the-negative-binomial-distribution": [negativeBinomialThroughBinomial],
  "modeling-with-the-negative-binomial-distribution": [lengthOfASeries],
  "the-hypergeometric-distribution": [hypergeometricSupport],
  "the-pmf-of-the-hypergeometric-distribution": [hypergeometricMode],
  "extending-the-law-of-total-probability": [totalProbabilityTwoDraws],
  "modeling-with-the-poisson-distribution": [timeForAtLeastOne],
  "finite-linear-series": [termsFromALinearSum],
  "finite-quadratic-series": [alternatingSquares],
  "infinite-series-and-partial-sums": [firstPartialSumPastATarget],
  "sums-of-infinite-geometric-series-given-in-sigma-notation": [seriesWithDoubledIndex],
  "the-generalized-binomial-theorem": [exponentFromCoefficients],
  "approximating-values-using-the-generalized-binomial-theorem": [firstOmittedTerm],
  "walks-trails-paths-and-distances": [walksInACompleteGraph],
  "adjacency-matrices-of-directed-graphs": [traceOfDirectedSquare],
  "kahns-algorithm": [whereKahnStops],
  "dijkstras-algorithm": [tentativeLabel],
  "mealy-machines": [mealyToMooreStates],
  "processing-strings-using-deterministic-finite-automata": [acceptedStringsByLength],
  "nondeterministic-finite-automata": [subsetConstructionStates],
};
