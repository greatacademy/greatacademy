import type { Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, why, yesNo } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range, setProblem, setTex } from "./methods-of-proof-common.ts";
import { bezout, gcd, mod } from "./methods-of-proof-number-theory.ts";

// Methods of Proof unit 6: modular congruence and linear congruences.

/** math wraps LaTeX as an option. */
const math = (s: string) => t(`$${s}$`, `$${s}$`);

/** signed writes "+ 3" or "- 3" after a term, or nothing for 0. */
const signed = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** cong writes a ≡ b (mod n) in LaTeX. */
const cong = (a: string | number, b: string | number, n: number | string) => `${a} \\equiv ${b} \\pmod{${n}}`;

/** ncong writes a ≢ b (mod n) in LaTeX. */
const ncong = (a: string | number, b: string | number, n: number | string) => `${a} \\not\\equiv ${b} \\pmod{${n}}`;

/** reduced writes "x ≡ v", or just "v" when x already equals v. */
const reduced = (x: number, v: number) => (x === v ? `${v}` : `${x} \\equiv ${v}`);

/** par puts negative numbers in parentheses. */
const par = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** firstOf keeps the first mistake for each wrong value. */
const firstOf = <T extends { readonly value: unknown }>(ms: readonly T[]): T[] =>
  ms.filter((m, i) => ms.findIndex((x) => String(x.value) === String(m.value)) === i);

/** modPow computes bᵉ mod n by repeated squaring. */
export function modPow(b: number, e: number, n: number): number {
  let result = 1 % n;
  let base = mod(b, n);
  for (let k = e; k > 0; k = Math.floor(k / 2)) {
    if (k % 2 === 1) result = (result * base) % n;
    base = (base * base) % n;
  }
  return result;
}

/** inverseMod finds the inverse of a modulo n, assuming gcd(a, n) = 1. */
export const inverseMod = (a: number, n: number) => mod(bezout(mod(a, n), n)[0], n);

/** trueFalse are the options of a true-or-false question. */
const trueFalse: readonly Text[] = [t("True", "真"), t("False", "假")];

/** modularCongruence defines a ≡ b (mod n). */
export const modularCongruence: TopicDef = {
  id: "modular-congruence",
  title: t("Modular Congruence", "模同余"),
  summary: t(
    "a ≡ b (mod n) means n divides a − b; equivalently, a and b leave the same remainder on division by n.",
    "a ≡ b (mod n) 表示 n 整除 a − b；等价地，a 与 b 除以 n 的余数相同。",
  ),
  intro: t(
    "On a clock, $15$ hours after midnight the hand points at $3$: modulo $12$, the numbers $15$ and $3$ are the same. We write $15 \\equiv 3 \\pmod{12}$, which means $12$ divides $15 - 3 = 12$.\n\nCheck: $15$ and $3$ both leave remainder $3$ on division by $12$.\n\nIn this lesson we decide whether two integers are congruent and find integers congruent to a given one.",
    "在钟面上，午夜后 $15$ 小时，指针指向 $3$：模 $12$ 时，$15$ 与 $3$ 是一样的。我们写作 $15 \\equiv 3 \\pmod{12}$，意思是 $12$ 整除 $15 - 3 = 12$。\n\n检验：$15$ 和 $3$ 除以 $12$ 都余 $3$。\n\n本课我们判断两个整数是否同余，并找出与给定整数同余的整数。",
  ),
  prerequisites: ["the-division-algorithm"],
  encompasses: [{ topic: "integer-divisibility", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-a-congruence",
      title: t("Checking a congruence", "检验同余式"),
      explanation: t(
        "Two integers are congruent modulo a number exactly when their difference is a whole multiple of that number. $38 \\equiv 10 \\pmod{7}$ because $38 - 10 = 28 = 7 \\cdot 4$. But $38 \\not\\equiv 11 \\pmod{7}$, since $38 - 11 = 27$ is not a multiple of $7$.\n\n> **Watch out.** The test is on the difference, not on the numbers themselves, and negative numbers follow the same rule: $-3 \\equiv 4 \\pmod{7}$ because $-3 - 4 = -7 = 7 \\cdot (-1)$.",
        "两个整数模某个数同余，当且仅当它们的差是这个数的倍数。$38 \\equiv 10 \\pmod{7}$，因为 $38 - 10 = 28 = 7 \\cdot 4$。但 $38 \\not\\equiv 11 \\pmod{7}$，因为 $38 - 11 = 27$ 不是 $7$ 的倍数。\n\n> **注意。** 检验的是差，而不是两个数本身，负数也遵循同样的规则：$-3 \\equiv 4 \\pmod{7}$，因为 $-3 - 4 = -7 = 7 \\cdot (-1)$。",
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const a = rng.int(-60, 99);
        const value = rng.bool();
        const b = value ? a - n * rng.nonZero(-6, 6) : a - n * rng.int(-6, 6) + rng.int(1, n - 1);
        const diff = a - b;
        const q = Math.floor(diff / n);
        const left = diff - n * q;
        return reasoned(
          oneOf(
            rng,
            t(`Is $${cong(a, b, n)}$?`, `$${cong(a, b, n)}$ 成立吗？`),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [["Take the difference", "求差"], t(`$${a} - ${par(b)} = ${diff}$.`, `$${a} - ${par(b)} = ${diff}$。`)],
                value
                  ? [
                      ["Divide by the modulus", "除以模"],
                      t(
                        `$${diff} = ${n} \\cdot ${par(diff / n)}$ is a multiple of $${n}$, so the congruence holds.`,
                        `$${diff} = ${n} \\cdot ${par(diff / n)}$ 是 $${n}$ 的倍数，所以同余式成立。`,
                      ),
                    ]
                  : [
                      ["Divide by the modulus", "除以模"],
                      t(
                        `$${diff} = ${n} \\cdot ${par(q)} + ${left}$ leaves remainder $${left}$, so it is not a multiple of $${n}$ and the congruence fails.`,
                        `$${diff} = ${n} \\cdot ${par(q)} + ${left}$ 余 $${left}$，不是 $${n}$ 的倍数，所以同余式不成立。`,
                      ),
                    ],
              ],
              value
                ? t(`Both numbers leave remainder $${mod(a, n)}$ on division by $${n}$.`, `两个数除以 $${n}$ 的余数都是 $${mod(a, n)}$。`)
                : t(
                    `The remainders differ: $${a}$ leaves $${mod(a, n)}$ and $${b}$ leaves $${mod(b, n)}$ on division by $${n}$.`,
                    `余数不同：$${a}$ 除以 $${n}$ 余 $${mod(a, n)}$，$${b}$ 除以 $${n}$ 余 $${mod(b, n)}$。`,
                  ),
            ),
          ),
          [
            value
              ? [
                  "No",
                  `The difference is what counts, and $${diff}$ is a whole multiple of $${n}$.`,
                  `关键看差，而 $${diff}$ 正是 $${n}$ 的整数倍。`,
                ]
              : [
                  "Yes",
                  `The difference must be a whole multiple of $${n}$, and $${diff}$ is not.`,
                  `差必须是 $${n}$ 的整数倍，而 $${diff}$ 不是。`,
                ],
          ],
        );
      },
    },
    {
      id: "finding-congruent-integers",
      title: t("Finding congruent integers", "找出同余的整数"),
      explanation: t(
        "Adding or subtracting the modulus does not change the remainder, so the congruent integers are spaced evenly by the modulus. The integers congruent to $5$ modulo $8$ are $\\dots, -11, -3, 5, 13, 21, \\dots$: add or subtract multiples of $8$.\n\n> **Watch out.** Step by whole multiples of the modulus, never by the number itself: $5 + 5 = 10$ is not congruent to $5$ modulo $8$, since $10 - 5 = 5$.",
        "加上或减去模不会改变余数，所以同余的整数以模为间隔均匀分布。模 $8$ 与 $5$ 同余的整数是 $\\dots, -11, -3, 5, 13, 21, \\dots$：加上或减去 $8$ 的倍数即可。\n\n> **注意。** 要按模的整数倍移动，而不是按这个数本身：$5 + 5 = 10$ 模 $8$ 不与 $5$ 同余，因为 $10 - 5 = 5$。",
      ),
      generate(rng) {
        const n = rng.int(3, 13);
        const a = rng.int(-30, 50);
        const right = a + n * rng.pick([-4, -3, -2, 2, 3, 4, 5]);
        const wrong = [1, 2, 3].map((k) => a + n * rng.int(-3, 3) + (k % n === 0 ? 1 : k));
        return reasoned(
          oneOf(
            rng,
            t(`Which integer is congruent to $${a}$ modulo $${n}$?`, `哪个整数模 $${n}$ 与 $${a}$ 同余？`),
            math(`${right}`),
            wrong.map((w) => math(`${w}`)),
            walked(
              [
                [
                  ["Subtract the given integer", "减去给定的整数"],
                  t(
                    `An option is congruent to $${a}$ exactly when its difference from $${a}$ is a multiple of $${n}$.`,
                    `一个选项与 $${a}$ 同余，当且仅当它与 $${a}$ 的差是 $${n}$ 的倍数。`,
                  ),
                ],
                [
                  ["Find the multiple", "找出倍数"],
                  t(
                    `$${right} - ${par(a)} = ${right - a} = ${n} \\cdot ${par((right - a) / n)}$, so $${right}$ is the one.`,
                    `$${right} - ${par(a)} = ${right - a} = ${n} \\cdot ${par((right - a) / n)}$，所以是 $${right}$。`,
                  ),
                ],
              ],
              t(
                `$${right}$ and $${a}$ both leave remainder $${mod(a, n)}$ on division by $${n}$.`,
                `$${right}$ 与 $${a}$ 除以 $${n}$ 的余数都是 $${mod(a, n)}$。`,
              ),
            ),
          ),
          wrong.map(
            (w): Reason => [
              `$${w}$`,
              `$${w} - ${par(a)} = ${w - a}$ leaves remainder $${mod(w - a, n)}$ on division by $${n}$, so it is not a multiple of $${n}$.`,
              `$${w} - ${par(a)} = ${w - a}$ 除以 $${n}$ 余 $${mod(w - a, n)}$，不是 $${n}$ 的倍数。`,
            ],
          ),
        );
      },
    },
  ],
};

/** theAdditionPropertyOfModularArithmetic adds and subtracts congruences. */
export const theAdditionPropertyOfModularArithmetic: TopicDef = {
  id: "the-addition-property-of-modular-arithmetic",
  title: t("The Addition Property of Modular Arithmetic", "模运算的加法性质"),
  summary: t(
    "If a ≡ b and c ≡ d (mod n), then a + c ≡ b + d and a − c ≡ b − d (mod n): reduce before adding.",
    "若 a ≡ b 且 c ≡ d (mod n)，则 a + c ≡ b + d 且 a − c ≡ b − d (mod n)：可以先约化再相加。",
  ),
  intro: t(
    "What is the remainder of $1003 + 2005$ on division by $10$? The last digits are $3$ and $5$, so the sum ends in $8$: we added remainders instead of the numbers. That works because congruences can be added.\n\nCheck: $1003 + 2005 = 3008$, which leaves remainder $8$.\n\nIn this lesson we add and subtract congruences and reduce each term before combining.",
    "$1003 + 2005$ 除以 $10$ 的余数是多少？两个数的末位是 $3$ 和 $5$，所以和的末位是 $8$：我们加的是余数而不是原数。这之所以可行，是因为同余式可以相加。\n\n检验：$1003 + 2005 = 3008$，余数是 $8$。\n\n本课我们把同余式相加、相减，并在组合之前先约化每一项。",
  ),
  prerequisites: ["modular-congruence"],
  encompasses: [{ topic: "modular-congruence", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "adding-congruences",
      title: t("Adding congruences", "同余式相加"),
      explanation: t(
        "Congruences can be added and subtracted like equations, and the result can then be reduced to a remainder in the usual range. If $a \\equiv 4 \\pmod{9}$ and $b \\equiv 7 \\pmod{9}$, then $a + b \\equiv 11 \\equiv 2 \\pmod{9}$ and $a - b \\equiv -3 \\equiv 6 \\pmod{9}$.\n\n> **Watch out.** A sum of remainders can reach the modulus or more, and a difference can be negative. Reduce the result back into $0, 1, \\dots, n - 1$ before giving it as a remainder.",
        "同余式可以像等式一样相加和相减，然后再把结果约化到通常范围内的余数。若 $a \\equiv 4 \\pmod{9}$ 且 $b \\equiv 7 \\pmod{9}$，则 $a + b \\equiv 11 \\equiv 2 \\pmod{9}$，$a - b \\equiv -3 \\equiv 6 \\pmod{9}$。\n\n> **注意。** 余数之和可能达到或超过模，余数之差可能是负数。作为余数给出之前，要把结果约化回 $0, 1, \\dots, n - 1$ 中。",
      ),
      generate(rng) {
        const n = rng.int(4, 13);
        const r = rng.int(1, n - 1);
        const minus = rng.bool();
        // Equal remainders would make a difference trivially zero.
        const s = rng.pick(range(1, n - 1).filter((v) => !minus || v !== r));
        const raw = minus ? r - s : r + s;
        const value = mod(raw, n);
        const op = minus ? "-" : "+";
        const [x, y] = [r + n, s];
        const shown = minus ? x - y : x + y;
        return numberProblem({
          prompt: t(
            `Suppose $${cong("a", r, n)}$ and $${cong("b", s, n)}$. Find the remainder $r$ with $0 \\le r < ${n}$ and $${cong(`a ${op} b`, "r", n)}$.`,
            `设 $${cong("a", r, n)}$，$${cong("b", s, n)}$。求满足 $0 \\le r < ${n}$ 且 $${cong(`a ${op} b`, "r", n)}$ 的余数 $r$。`,
          ),
          answer: value,
          wrong: [raw, mod(minus ? r + s : r - s, n), mod(r * s, n)],
          mistakes: firstOf([
            why(
              raw,
              raw < 0 ? `A remainder cannot be negative: add $${n}$.` : `That is not reduced: a remainder must be less than $${n}$.`,
              raw < 0 ? `余数不能是负数：要加上 $${n}$。` : `这还没有约化：余数必须小于 $${n}$。`,
            ),
            why(
              mod(minus ? r + s : r - s, n),
              minus ? "That adds the remainders; the question subtracts." : "That subtracts the remainders; the question adds.",
              minus ? "这是把余数相加；题目要求相减。" : "这是把余数相减；题目要求相加。",
            ),
            why(mod(r * s, n), "That multiplies the remainders instead.", "这是把余数相乘了。"),
          ]),
          solution: walked(
            [
              [
                ["Replace a and b by their remainders", "用余数代替 a 和 b"],
                t(
                  `$a ${op} b \\equiv ${r} ${op} ${s} = ${raw} \\pmod{${n}}$.`,
                  `$a ${op} b \\equiv ${r} ${op} ${s} = ${raw} \\pmod{${n}}$。`,
                ),
              ],
              [
                ["Reduce", "约化"],
                raw === value
                  ? t(
                      `$${raw}$ already lies between $0$ and $${n - 1}$, so $r = ${value}$.`,
                      `$${raw}$ 已在 $0$ 到 $${n - 1}$ 之间，所以 $r = ${value}$。`,
                    )
                  : t(
                      `$${raw} ${raw < 0 ? "+" : "-"} ${n} = ${value}$ lies between $0$ and $${n - 1}$, so $r = ${value}$.`,
                      `$${raw} ${raw < 0 ? "+" : "-"} ${n} = ${value}$ 在 $0$ 到 $${n - 1}$ 之间，所以 $r = ${value}$。`,
                    ),
              ],
            ],
            t(
              `Try $a = ${x}$ and $b = ${y}$, which have the given remainders: $${x} ${op} ${y} = ${shown}$, which leaves remainder $${value}$ on division by $${n}$.`,
              `取具有给定余数的 $a = ${x}$，$b = ${y}$：$${x} ${op} ${y} = ${shown}$，除以 $${n}$ 余 $${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "reducing-before-adding",
      title: t("Reducing before adding", "先约化再相加"),
      explanation: t(
        "To find the remainder of $1234 + 5678$ on division by $9$, reduce each term: $1234 \\equiv 1$ and $5678 \\equiv 8$, so the sum is $\\equiv 9 \\equiv 0 \\pmod{9}$.\n\n> **Watch out.** Each term keeps its sign when it is replaced by its remainder. A subtracted term is still subtracted, and the combined result may then need reducing again.",
        "求 $1234 + 5678$ 除以 $9$ 的余数：先约化每一项，$1234 \\equiv 1$，$5678 \\equiv 8$，所以和 $\\equiv 9 \\equiv 0 \\pmod{9}$。\n\n> **注意。** 每一项换成余数时保留原来的符号。被减去的项仍然要减去，组合后的结果可能还需要再约化。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const xs = range(1, rng.int(2, 3)).map(() => rng.int(100, 9999));
        const signs = xs.map((_, i) => (i === 0 ? 1 : rng.pick([1, -1])));
        const total = xs.reduce((s, x, i) => s + signs[i]! * x, 0);
        const value = mod(total, n);
        const expr = xs.map((x, i) => (i === 0 ? `${x}` : `${signs[i]! > 0 ? "+" : "-"} ${x}`)).join(" ");
        const rs = xs.map((x) => mod(x, n));
        const combo = rs.reduce((s, r, i) => s + signs[i]! * r, 0);
        const comboTex = rs.map((r, i) => (i === 0 ? `${r}` : `${signs[i]! > 0 ? "+" : "-"} ${r}`)).join(" ");
        const q = Math.floor(total / n);
        return numberProblem({
          prompt: t(`Find the remainder when $${expr}$ is divided by $${n}$.`, `求 $${expr}$ 除以 $${n}$ 的余数。`),
          answer: value,
          wrong: [rs.reduce((s, r) => s + r, 0) % n, mod(-total, n), mod(value + 1, n)],
          mistakes: firstOf([
            why(
              rs.reduce((s, r) => s + r, 0) % n,
              "That adds every remainder; the subtracted terms must stay subtracted.",
              "这把所有余数都加起来了；被减去的项仍然要减去。",
            ),
            why(mod(-total, n), "That reverses every sign of the expression.", "这把表达式的每个符号都反过来了。"),
          ]),
          solution: walked(
            [
              [["Reduce each term", "约化每一项"], t(`Modulo $${n}$:`, `模 $${n}$：`), xs.map((x, i) => `${x} \\equiv ${rs[i]}`)],
              [
                ["Combine and reduce", "组合并约化"],
                t(
                  `$${expr} \\equiv ${comboTex} = ${reduced(combo, value)} \\pmod{${n}}$.`,
                  `$${expr} \\equiv ${comboTex} = ${reduced(combo, value)} \\pmod{${n}}$。`,
                ),
              ],
            ],
            t(
              `Directly, $${expr} = ${total} = ${n} \\cdot ${par(q)} + ${value}$.`,
              `直接计算，$${expr} = ${total} = ${n} \\cdot ${par(q)} + ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** modularResidues reduces integers to their least nonnegative residues. */
export const modularResidues: TopicDef = {
  id: "modular-residues",
  title: t("Modular Residues", "模剩余"),
  summary: t(
    "Every integer is congruent mod n to exactly one residue in {0, 1, …, n − 1}: its remainder on division by n.",
    "每个整数模 n 恰好与 {0, 1, …, n − 1} 中的一个剩余同余：即它除以 n 的余数。",
  ),
  intro: t(
    "Which day of the week is $30$ days after a Monday? Modulo $7$, $30 \\equiv 2$, because $30 = 7 \\cdot 4 + 2$, so it is two days after Monday: a Wednesday. The residue $2$ stands for every integer in its class.\n\nCheck: $28$ days after Monday is again a Monday, and two more days give Wednesday.\n\nIn this lesson we find the residue of any integer, negative ones included, and count the integers in a residue class.",
    "星期一之后 $30$ 天是星期几？模 $7$ 时 $30 \\equiv 2$，因为 $30 = 7 \\cdot 4 + 2$，所以是星期一之后两天：星期三。剩余 $2$ 代表它所在类中的每个整数。\n\n检验：星期一之后 $28$ 天又是星期一，再过两天是星期三。\n\n本课我们求任意整数（包括负数）的剩余，并统计一个剩余类中的整数个数。",
  ),
  prerequisites: ["modular-congruence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "least-nonnegative-residues",
      title: t("Least nonnegative residues", "最小非负剩余"),
      explanation: t(
        "The residue of $-23$ modulo $6$ is $1$, since $-23 = 6 \\cdot (-4) + 1$. For negative numbers, go down to the next multiple of $n$, not up.\n\n> **Watch out.** Dropping the minus sign changes the residue: $23$ leaves $5$ on division by $6$, but $-23$ leaves $1$. The residue is measured up from the multiple just below, here $-24$.",
        "$-23$ 模 $6$ 的剩余是 $1$，因为 $-23 = 6 \\cdot (-4) + 1$。对负数，要取下一个更小的 $n$ 的倍数，而不是更大的。\n\n> **注意。** 去掉负号会改变剩余：$23$ 除以 $6$ 余 $5$，而 $-23$ 余 $1$。剩余是从紧挨着的较小倍数（这里是 $-24$）往上量的。",
      ),
      generate(rng) {
        const n = rng.int(3, 17);
        const a = rng.bool() ? -rng.int(n + 1, 200) : rng.int(n + 1, 999);
        const r = mod(a, n);
        const q = (a - r) / n;
        return numberProblem({
          prompt: t(
            `Find the residue $r$ with $0 \\le r < ${n}$ and $${cong(a, "r", n)}$.`,
            `求满足 $0 \\le r < ${n}$ 且 $${cong(a, "r", n)}$ 的剩余 $r$。`,
          ),
          answer: r,
          wrong: [Math.abs(a) % n, a % n, n - r],
          mistakes: firstOf([
            why(
              Math.abs(a) % n,
              "That is the remainder of the number without its minus sign; for a negative number, step down to the next multiple.",
              "这是去掉负号后的余数；对负数，要取下面紧挨着的倍数。",
            ),
            why(
              a % n,
              `A residue cannot be negative: it must lie between $0$ and $${n - 1}$.`,
              `剩余不能是负数：它必须在 $0$ 到 $${n - 1}$ 之间。`,
            ),
            why(n - r, "That is the distance up to the next multiple, not the remainder.", "这是到上面一个倍数的距离，而不是余数。"),
          ]),
          solution: walked(
            [
              [
                ["Find the multiple just below", "找出紧挨着的较小倍数"],
                t(
                  `The largest multiple of $${n}$ not above $${a}$ is $${n} \\cdot ${par(q)} = ${n * q}$.`,
                  `不超过 $${a}$ 的最大的 $${n}$ 的倍数是 $${n} \\cdot ${par(q)} = ${n * q}$。`,
                ),
              ],
              [
                ["Subtract", "相减"],
                t(
                  `$${a} - ${par(n * q)} = ${r}$, so $${a} = ${n} \\cdot ${par(q)} + ${r}$ and $r = ${r}$.`,
                  `$${a} - ${par(n * q)} = ${r}$，所以 $${a} = ${n} \\cdot ${par(q)} + ${r}$，$r = ${r}$。`,
                ),
              ],
            ],
            t(
              `$0 \\le ${r} < ${n}$, and $${a} - ${r} = ${a - r}$ is a multiple of $${n}$.`,
              `$0 \\le ${r} < ${n}$，且 $${a} - ${r} = ${a - r}$ 是 $${n}$ 的倍数。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-integers-in-a-residue-class",
      title: t("Counting integers in a residue class", "统计剩余类中的整数"),
      explanation: t(
        "The members of a residue class form an arithmetic progression, so count them by finding the first and last terms in the range. How many integers from $1$ to $50$ are $\\equiv 3 \\pmod{7}$? They are $3, 10, \\dots, 45$, that is $3 + 7k$ for $k = 0, \\dots, 6$: seven of them.\n\n> **Watch out.** $(\\text{last} - \\text{first}) / n$ counts the gaps between members, not the members. Add one for the first member.",
        "一个剩余类中的元素构成等差数列，所以通过找出范围内的首项和末项来计数。从 $1$ 到 $50$ 中有多少个整数 $\\equiv 3 \\pmod{7}$？它们是 $3, 10, \\dots, 45$，即 $3 + 7k$，$k = 0, \\dots, 6$：共七个。\n\n> **注意。** $(\\text{末项} - \\text{首项}) / n$ 数的是元素之间的间隔，而不是元素。还要为首项加一。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const r = rng.int(0, n - 1);
        const lo = rng.int(1, 30);
        const hi = lo + rng.int(30, 150);
        const xs = range(lo, hi).filter((x) => mod(x - r, n) === 0);
        const [first, last] = [xs[0]!, xs[xs.length - 1]!];
        return numberProblem({
          prompt: t(
            `How many integers $x$ with $${lo} \\le x \\le ${hi}$ satisfy $${cong("x", r, n)}$?`,
            `满足 $${lo} \\le x \\le ${hi}$ 且 $${cong("x", r, n)}$ 的整数 $x$ 有多少个？`,
          ),
          answer: xs.length,
          wrong: [xs.length + 1, xs.length - 1, Math.floor((hi - lo) / n)],
          mistakes: firstOf([
            why(
              xs.length - 1,
              "That counts the gaps between members; add one for the first member.",
              "这数的是元素之间的间隔；还要为首项加一。",
            ),
            why(
              Math.floor((hi - lo) / n),
              "That divides the length of the range by the modulus; count from the first and last members instead.",
              "这是用范围的长度除以模；应当从首项和末项来数。",
            ),
            why(
              xs.length + 1,
              `That counts one too many: check that every member lies between $${lo}$ and $${hi}$.`,
              `这多数了一个：检查每个元素是否都在 $${lo}$ 与 $${hi}$ 之间。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the first and last members", "找出首项和末项"],
                t(
                  `The members in the range are $${first}, ${first + n}, \\dots, ${last}$.`,
                  `范围内的元素是 $${first}, ${first + n}, \\dots, ${last}$。`,
                ),
              ],
              [
                ["Count", "计数"],
                t(
                  `$\\dfrac{${last} - ${first}}{${n}} + 1 = ${(last - first) / n} + 1 = ${xs.length}$.`,
                  `$\\dfrac{${last} - ${first}}{${n}} + 1 = ${(last - first) / n} + 1 = ${xs.length}$。`,
                ),
              ],
            ],
            t(
              `The neighbours just outside, $${first - n}$ and $${last + n}$, lie below $${lo}$ and above $${hi}$, so none is missed.`,
              `紧挨在外面的 $${first - n}$ 和 $${last + n}$ 分别小于 $${lo}$、大于 $${hi}$，所以没有遗漏。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theMultiplicationPropertiesOfModularArithmetic multiplies congruences and takes powers. */
export const theMultiplicationPropertiesOfModularArithmetic: TopicDef = {
  id: "the-multiplication-properties-of-modular-arithmetic",
  title: t("The Multiplication Properties of Modular Arithmetic", "模运算的乘法性质"),
  summary: t(
    "If a ≡ b and c ≡ d (mod n), then ac ≡ bd and aᵏ ≡ bᵏ (mod n), so products and powers can be reduced step by step.",
    "若 a ≡ b 且 c ≡ d (mod n)，则 ac ≡ bd，aᵏ ≡ bᵏ (mod n)，所以乘积与幂都可以逐步约化。",
  ),
  intro: t(
    "What is the last digit of $13 \\cdot 17$? Only the last digits matter: $3 \\cdot 7 = 21$ ends in $1$, so the product ends in $1$. Modulo $10$, we multiplied remainders instead of the numbers.\n\nCheck: $13 \\cdot 17 = 221$, which ends in $1$.\n\nIn this lesson we reduce products and large powers modulo $n$, a step at a time.",
    "$13 \\cdot 17$ 的末位是几？只有末位起作用：$3 \\cdot 7 = 21$ 末位是 $1$，所以乘积末位是 $1$。模 $10$ 时，我们乘的是余数而不是原数。\n\n检验：$13 \\cdot 17 = 221$，末位是 $1$。\n\n本课我们逐步约化模 $n$ 的乘积和大的幂。",
  ),
  prerequisites: ["the-addition-property-of-modular-arithmetic", "modular-residues"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reducing-products",
      title: t("Reducing products", "约化乘积"),
      explanation: t(
        "Congruences can be multiplied, so reduce each factor first and multiply the small remainders instead of the large numbers. $123 \\cdot 456 \\pmod{10}$: $123 \\equiv 3$ and $456 \\equiv 6$, so the product is $\\equiv 18 \\equiv 8 \\pmod{10}$.\n\n> **Watch out.** The product of two remainders may itself be too large: $3 \\cdot 6 = 18$ is not a remainder modulo $10$. Reduce once more at the end.",
        "同余式可以相乘，所以先约化每个因数，再把小的余数相乘，而不是乘大数。$123 \\cdot 456 \\pmod{10}$：$123 \\equiv 3$，$456 \\equiv 6$，所以乘积 $\\equiv 18 \\equiv 8 \\pmod{10}$。\n\n> **注意。** 两个余数的乘积本身可能太大：$3 \\cdot 6 = 18$ 不是模 $10$ 的余数。最后还要再约化一次。",
      ),
      generate(rng) {
        const n = rng.int(3, 13);
        const nudge = (v: number): number => (v % n === 0 ? v + 1 : v);
        const a = nudge(rng.int(50, 999));
        const b = nudge(rng.int(50, 999));
        const ra = a % n;
        const rb = b % n;
        const value = (a * b) % n;
        return numberProblem({
          prompt: t(`Find the remainder when $${a} \\cdot ${b}$ is divided by $${n}$.`, `求 $${a} \\cdot ${b}$ 除以 $${n}$ 的余数。`),
          answer: value,
          wrong: [(ra + rb) % n, ra * rb, mod(value - 1, n)],
          mistakes: firstOf([
            why((ra + rb) % n, "That adds the remainders; the question multiplies.", "这是把余数相加；题目要求相乘。"),
            why(ra * rb, `That is not reduced: a remainder must be less than $${n}$.`, `这还没有约化：余数必须小于 $${n}$。`),
          ]),
          solution: walked(
            [
              [
                ["Reduce each factor", "约化每个因数"],
                t(
                  `$${a} \\equiv ${ra}$ and $${b} \\equiv ${rb} \\pmod{${n}}$.`,
                  `$${a} \\equiv ${ra}$，$${b} \\equiv ${rb} \\pmod{${n}}$。`,
                ),
              ],
              [
                ["Multiply and reduce", "相乘并约化"],
                t(
                  `$${a} \\cdot ${b} \\equiv ${ra} \\cdot ${rb} = ${reduced(ra * rb, value)} \\pmod{${n}}$.`,
                  `$${a} \\cdot ${b} \\equiv ${ra} \\cdot ${rb} = ${reduced(ra * rb, value)} \\pmod{${n}}$。`,
                ),
              ],
            ],
            t(
              `Directly, $${a} \\cdot ${b} = ${a * b} = ${n} \\cdot ${Math.floor((a * b) / n)} + ${value}$.`,
              `直接计算，$${a} \\cdot ${b} = ${a * b} = ${n} \\cdot ${Math.floor((a * b) / n)} + ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "reducing-powers",
      title: t("Reducing powers", "约化幂"),
      explanation: t(
        "Look for a small power that is congruent to one, then split the exponent into multiples of it plus a remainder. To find $2^{100} \\bmod 7$: $2^3 = 8 \\equiv 1 \\pmod{7}$, so $2^{100} = (2^3)^{33} \\cdot 2 \\equiv 1^{33} \\cdot 2 = 2 \\pmod{7}$. Look for a power that is $\\equiv 1$ (or $\\equiv -1$).\n\n> **Watch out.** What matters is the remainder of the exponent on division by the length of the cycle, not the quotient: $100 = 3 \\cdot 33 + 1$ leaves $2^{1}$, not $2^{33}$.",
        "寻找一个同余于 1 的小幂，再把指数分成它的倍数加上余数。求 $2^{100} \\bmod 7$：$2^3 = 8 \\equiv 1 \\pmod{7}$，所以 $2^{100} = (2^3)^{33} \\cdot 2 \\equiv 1^{33} \\cdot 2 = 2 \\pmod{7}$。寻找 $\\equiv 1$（或 $\\equiv -1$）的幂。\n\n> **注意。** 起作用的是指数除以循环长度的余数，而不是商：$100 = 3 \\cdot 33 + 1$ 剩下的是 $2^{1}$，而不是 $2^{33}$。",
      ),
      generate(rng) {
        let n: number;
        let b: number;
        do {
          n = rng.int(3, 13);
          b = rng.int(2, 30);
        } while (gcd(b, n) !== 1 || b % n === 1);
        const e = rng.int(20, 200);
        const value = modPow(b, e, n);
        let k = 1;
        while (modPow(b, k, n) !== 1) k++;
        const rem = e % k;
        const quo = Math.floor(e / k);
        const next = modPow(b, e + 1, n);
        return numberProblem({
          prompt: t(`Find the remainder when $${b}^{${e}}$ is divided by $${n}$.`, `求 $${b}^{${e}}$ 除以 $${n}$ 的余数。`),
          answer: value,
          wrong: [modPow(b, e + 1, n), modPow(b, e - 1, n), (b * e) % n],
          mistakes: firstOf([
            why(
              modPow(b, quo, n),
              "That uses the quotient of the exponent; the remainder of the exponent is what is left over.",
              "这用了指数的商；剩下的应当是指数的余数。",
            ),
            why(
              (b * e) % n,
              "That multiplies the base by the exponent; a power is repeated multiplication.",
              "这是用底数乘以指数；幂是重复相乘。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find a power congruent to one", "找出同余于 1 的幂"],
                t(`The powers of $${b}$ modulo $${n}$ are:`, `$${b}$ 模 $${n}$ 的各次幂是：`),
                range(1, k).map((j) => `${b}^{${j}} \\equiv ${modPow(b, j, n)}`),
              ],
              [
                ["Split the exponent", "拆分指数"],
                t(
                  `$${e} = ${k} \\cdot ${quo} + ${rem}$, so $${b}^{${e}} = (${b}^{${k}})^{${quo}} \\cdot ${b}^{${rem}} \\equiv 1 \\cdot ${b}^{${rem}} \\equiv ${value} \\pmod{${n}}$.`,
                  `$${e} = ${k} \\cdot ${quo} + ${rem}$，所以 $${b}^{${e}} = (${b}^{${k}})^{${quo}} \\cdot ${b}^{${rem}} \\equiv 1 \\cdot ${b}^{${rem}} \\equiv ${value} \\pmod{${n}}$。`,
                ),
              ],
            ],
            t(
              `One more factor of $${b}$ gives $${b}^{${e + 1}} \\equiv ${value} \\cdot ${b % n} \\equiv ${next}$, the next entry of the cycle, as it should.`,
              `再乘一个 $${b}$ 得 $${b}^{${e + 1}} \\equiv ${value} \\cdot ${b % n} \\equiv ${next}$，正是循环中的下一项。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theDivisionPropertiesOfModularArithmetic cancels common factors in congruences. */
export const theDivisionPropertiesOfModularArithmetic: TopicDef = {
  id: "the-division-properties-of-modular-arithmetic",
  title: t("The Division Properties of Modular Arithmetic", "模运算的除法性质"),
  summary: t(
    "If ca ≡ cb (mod n), then a ≡ b (mod n/gcd(c, n)); in particular c can be cancelled when gcd(c, n) = 1.",
    "若 ca ≡ cb (mod n)，则 a ≡ b (mod n/gcd(c, n))；特别地，当 gcd(c, n) = 1 时可以约去 c。",
  ),
  intro: t(
    "Does $2a \\equiv 2b \\pmod{6}$ force $a \\equiv b \\pmod{6}$? No: $2 \\cdot 0 = 0$ and $2 \\cdot 3 = 6$ are congruent modulo $6$, but $0 \\not\\equiv 3$. Cancelling the $2$ is allowed only if the modulus is divided by $\\gcd(2, 6) = 2$, which leaves $a \\equiv b \\pmod{3}$.\n\nCheck: $3 - 0 = 3$ is a multiple of $3$, as $a \\equiv b \\pmod{3}$ says.\n\nIn this lesson we cancel common factors from congruences and decide when the modulus survives.",
    "$2a \\equiv 2b \\pmod{6}$ 能推出 $a \\equiv b \\pmod{6}$ 吗？不能：$2 \\cdot 0 = 0$ 与 $2 \\cdot 3 = 6$ 模 $6$ 同余，但 $0 \\not\\equiv 3$。只有把模除以 $\\gcd(2, 6) = 2$，才能约去 $2$，得到 $a \\equiv b \\pmod{3}$。\n\n检验：$3 - 0 = 3$ 是 $3$ 的倍数，正如 $a \\equiv b \\pmod{3}$ 所说。\n\n本课我们从同余式中约去公因数，并判断模何时保持不变。",
  ),
  prerequisites: ["the-multiplication-properties-of-modular-arithmetic", "the-euclidean-algorithm"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-modulus-after-cancelling",
      title: t("The modulus after cancelling", "约去后的模"),
      explanation: t(
        "Dividing a congruence by a common factor is allowed only if the modulus is divided by its gcd with that factor. From $6a \\equiv 6b \\pmod{15}$: $\\gcd(6, 15) = 3$, so $a \\equiv b \\pmod{5}$. Dividing by $6$ also divides the modulus by the common factor $3$.\n\n> **Watch out.** The modulus is divided by $\\gcd(c, n)$, not by $c$. When $\\gcd(c, n) = 1$ the modulus does not change at all.",
        "只有把模也除以它与该因数的最大公因数，才可以把同余式除以这个公因数。由 $6a \\equiv 6b \\pmod{15}$：$\\gcd(6, 15) = 3$，所以 $a \\equiv b \\pmod{5}$。两边除以 $6$ 时，模也要除以公因数 $3$。\n\n> **注意。** 模要除以 $\\gcd(c, n)$，而不是除以 $c$。当 $\\gcd(c, n) = 1$ 时，模完全不变。",
      ),
      generate(rng) {
        const c = rng.int(2, 15);
        const factors = range(2, c).filter((f) => c % f === 0);
        const n = rng.int(0, 3) === 0 ? rng.int(4, 40) : rng.pick(factors) * rng.int(2, 8);
        const g = gcd(c, n);
        const m = n / g;
        return numberProblem({
          prompt: t(
            `If $${cong(`${c}a`, `${c}b`, n)}$, what is the largest $m$ for which $a \\equiv b \\pmod{m}$ must hold?`,
            `若 $${cong(`${c}a`, `${c}b`, n)}$，使 $a \\equiv b \\pmod{m}$ 必然成立的最大的 $m$ 是多少？`,
          ),
          answer: m,
          wrong: [n, g, Math.max(1, Math.floor(n / c))],
          mistakes: firstOf([
            why(
              n,
              `That keeps the modulus; cancelling $${c}$ divides it by $\\gcd(${c}, ${n})$.`,
              `这保留了原来的模；约去 $${c}$ 时，模要除以 $\\gcd(${c}, ${n})$。`,
            ),
            why(
              g,
              "That is the common factor itself; the new modulus is the old one divided by it.",
              "这是公因数本身；新的模是原来的模除以它。",
            ),
            why(
              Math.max(1, Math.floor(n / c)),
              `That divides the modulus by $${c}$; divide by $\\gcd(${c}, ${n})$ instead.`,
              `这是用 $${c}$ 去除模；应当除以 $\\gcd(${c}, ${n})$。`,
            ),
          ]),
          solution: walked(
            [
              [["Find the common factor", "求公因数"], t(`$\\gcd(${c}, ${n}) = ${g}$.`, `$\\gcd(${c}, ${n}) = ${g}$。`)],
              g === 1
                ? [
                    ["Cancel", "约去"],
                    t(
                      `$${n} \\mid ${c}(a - b)$ and $${c}$ shares no factor with $${n}$, so $${n} \\mid a - b$: $m = ${n}$.`,
                      `$${n} \\mid ${c}(a - b)$，而 $${c}$ 与 $${n}$ 没有公因数，所以 $${n} \\mid a - b$：$m = ${n}$。`,
                    ),
                  ]
                : [
                    ["Divide through", "两边同除"],
                    t(
                      `$${n} \\mid ${c}(a - b)$ gives $${m} \\mid ${c / g}(a - b)$, and $\\gcd(${c / g}, ${m}) = 1$, so $${m} \\mid a - b$: $m = ${m}$.`,
                      `由 $${n} \\mid ${c}(a - b)$ 得 $${m} \\mid ${c / g}(a - b)$，而 $\\gcd(${c / g}, ${m}) = 1$，所以 $${m} \\mid a - b$：$m = ${m}$。`,
                    ),
                  ],
            ],
            t(
              `Nothing larger works: $a = 0$ and $b = ${m}$ give $${c} \\cdot ${m} = ${c * m} = ${n} \\cdot ${c / g}$, a multiple of $${n}$, while $b - a = ${m}$.`,
              `更大的不行：$a = 0$，$b = ${m}$ 给出 $${c} \\cdot ${m} = ${c * m} = ${n} \\cdot ${c / g}$，是 $${n}$ 的倍数，而 $b - a = ${m}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "when-cancellation-is-valid",
      title: t("When cancellation is valid", "何时可以约去"),
      explanation: t(
        "A factor can be cancelled from both sides without changing the modulus only when it shares no common factor with the modulus. $4 \\cdot 2 \\equiv 4 \\cdot 5 \\pmod{12}$, but $2 \\not\\equiv 5 \\pmod{12}$: cancelling $4$ fails because $\\gcd(4, 12) \\ne 1$. Cancelling $c$ is valid exactly when $\\gcd(c, n) = 1$.\n\n> **Watch out.** A small factor can still share a divisor with the modulus. $\\gcd(2, 10) = 2$, and indeed $2 \\cdot 1 \\equiv 2 \\cdot 6 \\pmod{10}$ although $1 \\not\\equiv 6$.",
        "只有当一个因数与模没有公因数时，才能在不改变模的情况下从两边约去它。$4 \\cdot 2 \\equiv 4 \\cdot 5 \\pmod{12}$，但 $2 \\not\\equiv 5 \\pmod{12}$：约去 $4$ 失败，因为 $\\gcd(4, 12) \\ne 1$。当且仅当 $\\gcd(c, n) = 1$ 时可以约去 $c$。\n\n> **注意。** 很小的因数也可能与模有公因数。$\\gcd(2, 10) = 2$，确实 $2 \\cdot 1 \\equiv 2 \\cdot 6 \\pmod{10}$，而 $1 \\not\\equiv 6$。",
      ),
      generate(rng) {
        const c = rng.int(2, 12);
        const n = rng.int(4, 30);
        const g = gcd(c, n);
        const value = g === 1;
        return reasoned(
          oneOf(
            rng,
            t(
              `True or false: for all integers $a$ and $b$, if $${cong(`${c}a`, `${c}b`, n)}$, then $${cong("a", "b", n)}$.`,
              `判断真假：对所有整数 $a$、$b$，若 $${cong(`${c}a`, `${c}b`, n)}$，则 $${cong("a", "b", n)}$。`,
            ),
            trueFalse[value ? 0 : 1]!,
            [trueFalse[value ? 1 : 0]!],
            walked(
              [
                [["Find the common factor", "求公因数"], t(`$\\gcd(${c}, ${n}) = ${g}$.`, `$\\gcd(${c}, ${n}) = ${g}$。`)],
                value
                  ? [
                      ["Cancel", "约去"],
                      t(
                        `$${n} \\mid ${c}(a - b)$, and $${c}$ shares no factor with $${n}$, so $${n} \\mid a - b$. The statement is true.`,
                        `$${n} \\mid ${c}(a - b)$，而 $${c}$ 与 $${n}$ 没有公因数，所以 $${n} \\mid a - b$。命题为真。`,
                      ),
                    ]
                  : [
                      ["Find a counterexample", "找反例"],
                      t(
                        `Take $a = 0$ and $b = ${n / g}$: $${c} \\cdot ${n / g} = ${(c * n) / g} = ${n} \\cdot ${c / g}$ is a multiple of $${n}$, but $${n / g} \\not\\equiv 0 \\pmod{${n}}$. The statement is false.`,
                        `取 $a = 0$，$b = ${n / g}$：$${c} \\cdot ${n / g} = ${(c * n) / g} = ${n} \\cdot ${c / g}$ 是 $${n}$ 的倍数，但 $${n / g} \\not\\equiv 0 \\pmod{${n}}$。命题为假。`,
                      ),
                    ],
              ],
              value
                ? t(
                    `$${c}$ has an inverse modulo $${n}$, namely $${inverseMod(c, n)}$, since $${c} \\cdot ${inverseMod(c, n)} = ${c * inverseMod(c, n)} \\equiv 1$; multiplying by it undoes the factor $${c}$.`,
                    `$${c}$ 模 $${n}$ 有逆元 $${inverseMod(c, n)}$，因为 $${c} \\cdot ${inverseMod(c, n)} = ${c * inverseMod(c, n)} \\equiv 1$；乘以它就撤销了因数 $${c}$。`,
                  )
                : t(
                    `$${n / g} - 0 = ${n / g}$ lies strictly between $0$ and $${n}$, so it is not a multiple of $${n}$.`,
                    `$${n / g} - 0 = ${n / g}$ 严格介于 $0$ 与 $${n}$ 之间，所以不是 $${n}$ 的倍数。`,
                  ),
            ),
          ),
          [
            value
              ? [
                  "False",
                  `Cancelling fails only when the factor shares a divisor with the modulus; check $\\gcd(${c}, ${n})$.`,
                  `只有当因数与模有公因数时约去才会失败；检查 $\\gcd(${c}, ${n})$。`,
                ]
              : [
                  "True",
                  `$${c}$ and $${n}$ share a factor, so cancelling can lose information; look for a counterexample.`,
                  `$${c}$ 与 $${n}$ 有公因数，约去可能丢失信息；试着找一个反例。`,
                ],
          ],
        );
      },
    },
  ],
};

/** provingPropertiesOfModularCongruence proves congruence laws from the definition. */
export const provingPropertiesOfModularCongruence: TopicDef = {
  id: "proving-properties-of-modular-congruence",
  title: t("Proving Properties of Modular Congruence", "证明模同余的性质"),
  summary: t(
    "Write each congruence as an equation, a − b = nk, combine the equations, and factor out n.",
    "把每个同余式写成等式 a − b = nk，再把等式组合起来并提出 n。",
  ),
  intro: t(
    "Why does $a \\equiv b \\pmod{5}$ give $a + 3 \\equiv b + 3 \\pmod{5}$? Write the hypothesis as an equation, $a - b = 5k$. Then $(a + 3) - (b + 3) = a - b = 5k$, a multiple of $5$, which is exactly what the conclusion says.\n\nCheck: $7 \\equiv 2 \\pmod{5}$, and $10 - 5 = 5$ is a multiple of $5$.\n\nIn this lesson we prove congruence laws from the definition and tell valid laws from invalid ones.",
    "为什么由 $a \\equiv b \\pmod{5}$ 能得到 $a + 3 \\equiv b + 3 \\pmod{5}$？把假设写成等式 $a - b = 5k$。则 $(a + 3) - (b + 3) = a - b = 5k$ 是 $5$ 的倍数，这正是结论所说的。\n\n检验：$7 \\equiv 2 \\pmod{5}$，而 $10 - 5 = 5$ 是 $5$ 的倍数。\n\n本课我们由定义证明同余律，并区分成立与不成立的规律。",
  ),
  prerequisites: ["the-multiplication-properties-of-modular-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "combining-the-defining-equations",
      title: t("Combining the defining equations", "组合定义等式"),
      explanation: t(
        "Each congruence means a difference is a multiple of the modulus, so combine those equations to show the new difference is a multiple too. To prove that $a \\equiv b$ and $c \\equiv d \\pmod{6}$ imply $a + c \\equiv b + d \\pmod{6}$: write $a - b = 6k$ and $c - d = 6l$. Then $(a + c) - (b + d) = 6k + 6l = 6(k + l)$.\n\n> **Watch out.** Give each congruence its own letter. Writing $a - b = 6k$ and $c - d = 6k$ assumes the two multiples are the same, which the hypotheses do not say.",
        "每个同余式都意味着某个差是模的倍数，所以把这些等式组合起来，证明新的差也是模的倍数。证明 $a \\equiv b$ 且 $c \\equiv d \\pmod{6}$ 推出 $a + c \\equiv b + d \\pmod{6}$：写 $a - b = 6k$，$c - d = 6l$。则 $(a + c) - (b + d) = 6k + 6l = 6(k + l)$。\n\n> **注意。** 每个同余式要用各自的字母。写成 $a - b = 6k$ 和 $c - d = 6k$ 就假定了两个倍数相同，而假设并没有这样说。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const kind = rng.int(0, 4);
        const both = `$a - b = ${n}k$ and $c - d = ${n}l$`;
        const bothZh = `$a - b = ${n}k$，$c - d = ${n}l$`;
        type Case = [string, string, string, string, string, string, [string, string, string][]];
        const cases: Case[] = [
          [
            `${cong("a", "b", n)} \\text{ and } ${cong("c", "d", n)}`,
            both,
            bothZh,
            `(a + c) - (b + d) = ${n}(k + l)`,
            `(a + c) - (b + d) = (a - b) + (c - d) = ${n}k + ${n}l = ${n}(k + l)`,
            "k + l",
            [
              [
                `(a + c) - (b + d) = ${n}kl`,
                "Adding the equations adds their right sides; nothing is multiplied.",
                "把等式相加就是把右边相加；没有相乘。",
              ],
              [
                `(a + c) - (b + d) = ${n}(k - l)`,
                "The second difference is added, so $l$ enters with a plus sign.",
                "第二个差是加上的，所以 $l$ 前面是加号。",
              ],
              [
                `(a + c) - (b + d) = ${2 * n}(k + l)`,
                `$${n}k + ${n}l$ has the single common factor $${n}$; nothing doubles it.`,
                `$${n}k + ${n}l$ 只提出公因数 $${n}$；没有东西使它加倍。`,
              ],
            ],
          ],
          [
            `${cong("a", "b", n)} \\text{ and } ${cong("c", "d", n)}`,
            both,
            bothZh,
            `(a - c) - (b - d) = ${n}(k - l)`,
            `(a - c) - (b - d) = (a - b) - (c - d) = ${n}k - ${n}l = ${n}(k - l)`,
            "k - l",
            [
              [
                `(a - c) - (b - d) = ${n}(k + l)`,
                "The second difference is subtracted, so $l$ enters with a minus sign.",
                "第二个差是减去的，所以 $l$ 前面是减号。",
              ],
              [
                `(a - c) - (b - d) = ${n}kl`,
                "Subtracting the equations subtracts their right sides; nothing is multiplied.",
                "把等式相减就是把右边相减；没有相乘。",
              ],
              [
                `(a - c) - (b - d) = ${n}(l - k)`,
                "That has the order reversed: $a - b$ comes first, so $k$ comes first.",
                "这把顺序弄反了：$a - b$ 在前，所以 $k$ 在前。",
              ],
            ],
          ],
          [
            `${cong("a", "b", n)} \\text{ and } ${cong("b", "c", n)}`,
            `$a - b = ${n}k$ and $b - c = ${n}l$`,
            `$a - b = ${n}k$，$b - c = ${n}l$`,
            `a - c = ${n}(k + l)`,
            `a - c = (a - b) + (b - c) = ${n}k + ${n}l = ${n}(k + l)`,
            "k + l",
            [
              [
                `a - c = ${n}(k - l)`,
                "Adding the two equations cancels $b$, and both multiples are added.",
                "把两个等式相加消去了 $b$，两个倍数都是加上的。",
              ],
              [
                `a - c = ${n}kl`,
                "Adding the equations adds their right sides; nothing is multiplied.",
                "把等式相加就是把右边相加；没有相乘。",
              ],
              [
                `c - a = ${n}(k + l)`,
                "The sum $(a - b) + (b - c)$ is $a - c$, not $c - a$.",
                "和 $(a - b) + (b - c)$ 是 $a - c$，而不是 $c - a$。",
              ],
            ],
          ],
          [
            cong("a", "b", n),
            `$a - b = ${n}k$`,
            `$a - b = ${n}k$`,
            `b - a = ${n}(-k)`,
            `b - a = -(a - b) = -${n}k = ${n}(-k)`,
            "-k",
            [
              [`b - a = ${n}k`, "Reversing the order of a difference changes its sign.", "交换差的顺序会改变符号。"],
              [`b - a = -k`, `The factor $${n}$ has been lost: $-(a - b) = -${n}k$.`, `丢掉了因数 $${n}$：$-(a - b) = -${n}k$。`],
              [
                `a - b = ${n}(-k)`,
                "That speaks of $a - b$, but the goal $b \\equiv a$ is about $b - a$.",
                "这说的是 $a - b$，而目标 $b \\equiv a$ 关心的是 $b - a$。",
              ],
            ],
          ],
          [
            cong("a", "b", n),
            `$a - b = ${n}k$`,
            `$a - b = ${n}k$`,
            `ca - cb = ${n}(ck)`,
            `ca - cb = c(a - b) = c \\cdot ${n}k = ${n}(ck)`,
            "ck",
            [
              [
                `ca - cb = ${n}k`,
                "Multiplying $a - b = nk$ by $c$ multiplies the right side by $c$ too.",
                "把 $a - b = nk$ 乘以 $c$，右边也要乘以 $c$。",
              ],
              [`ca - cb = c + ${n}k`, "Multiplying by $c$ is not the same as adding $c$.", "乘以 $c$ 与加上 $c$ 不同。"],
              [
                `ca - cb = ${n}(c + k)`,
                `$c \\cdot ${n}k$ is a product, $${n}(ck)$, not $${n}(c + k)$.`,
                `$c \\cdot ${n}k$ 是乘积 $${n}(ck)$，而不是 $${n}(c + k)$。`,
              ],
            ],
          ],
        ];
        const [hyp, writeEn, writeZh, right, derive, multiple, wrong] = cases[kind]!;
        const goal = [`a + c \\equiv b + d`, `a - c \\equiv b - d`, `a \\equiv c`, `b \\equiv a`, `ca \\equiv cb`][kind]!;
        return reasoned(
          oneOf(
            rng,
            t(
              `To prove that $${hyp}$ ${kind < 3 ? "imply" : "implies"} $${goal} \\pmod{${n}}$, write ${writeEn}. Which equation finishes the proof?`,
              `为证明 $${hyp}$ 推出 $${goal} \\pmod{${n}}$，写出 ${writeZh}。哪个等式完成证明？`,
            ),
            math(right),
            wrong.map(([w]) => math(w)),
            walked(
              [
                [["Write the hypotheses as equations", "把假设写成等式"], t(`${writeEn}.`, `${writeZh}。`)],
                [["Combine them", "组合等式"], t(`$${derive}$.`, `$${derive}$。`)],
              ],
              t(
                `$${multiple}$ is an integer, so the difference is a multiple of $${n}$: that is the definition of $${goal} \\pmod{${n}}$.`,
                `$${multiple}$ 是整数，所以这个差是 $${n}$ 的倍数：这正是 $${goal} \\pmod{${n}}$ 的定义。`,
              ),
            ),
          ),
          wrong.map(([w, en, zh]): Reason => [`$${w}$`, en, zh]),
        );
      },
    },
    {
      id: "true-and-false-congruence-laws",
      title: t("True and false congruence laws", "同余律的真假"),
      explanation: t(
        "Valid: if $a \\equiv b \\pmod{n}$ then $a^2 \\equiv b^2$, $a + c \\equiv b + c$, and $a \\equiv b \\pmod{d}$ for every divisor $d$ of $n$. Invalid: $a^2 \\equiv b^2$ does not give $a \\equiv b$ (e.g. $1^2 \\equiv 4^2 \\pmod{5}$), and $a \\equiv b \\pmod{n}$ does not give $a \\equiv b \\pmod{2n}$.\n\n> **Watch out.** A law that works in several examples can still be false, and a single counterexample settles it. To show a law is true, argue from the defining equation instead.",
        "成立：若 $a \\equiv b \\pmod{n}$，则 $a^2 \\equiv b^2$，$a + c \\equiv b + c$，并且对 $n$ 的每个因数 $d$ 有 $a \\equiv b \\pmod{d}$。不成立：$a^2 \\equiv b^2$ 推不出 $a \\equiv b$（例如 $1^2 \\equiv 4^2 \\pmod{5}$），$a \\equiv b \\pmod{n}$ 也推不出 $a \\equiv b \\pmod{2n}$。\n\n> **注意。** 一条规律在几个例子中成立，仍可能是假的，而一个反例就能定论。要证明规律成立，应当从定义等式出发论证。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const divisors = range(2, n - 1).filter((d) => n % d === 0);
        const d = divisors.length > 0 ? rng.pick(divisors) : 0;
        const prime = divisors.length === 0;
        const f = divisors[0] ?? 1;
        type Claim = [string, boolean, [string, string], Text, [string, string], Text, Text];
        const hypothesis: [string, string] = ["Write the hypothesis", "写出假设"];
        const counter: [string, string] = ["Find a counterexample", "找反例"];
        const claims: Claim[] = [
          [
            `${cong("a", "b", n)} \\implies ${cong("a^2", "b^2", n)}`,
            true,
            hypothesis,
            t(`$a - b = ${n}k$ for some integer $k$.`, `存在整数 $k$ 使 $a - b = ${n}k$。`),
            ["Factor the new difference", "分解新的差"],
            t(
              `$a^2 - b^2 = (a - b)(a + b) = ${n}k(a + b)$, a multiple of $${n}$. True.`,
              `$a^2 - b^2 = (a - b)(a + b) = ${n}k(a + b)$ 是 $${n}$ 的倍数。真。`,
            ),
            t(
              `$a = ${n + 1}$, $b = 1$: $${n + 1}^2 - 1 = ${(n + 1) ** 2 - 1} = ${n} \\cdot ${n + 2}$.`,
              `$a = ${n + 1}$，$b = 1$：$${n + 1}^2 - 1 = ${(n + 1) ** 2 - 1} = ${n} \\cdot ${n + 2}$。`,
            ),
          ],
          [
            `${cong("a^2", "b^2", n)} \\implies ${cong("a", "b", n)}`,
            false,
            counter,
            t("Squares agree for a number and its negative, so try $1$ and $-1$.", "一个数与它的相反数平方相同，所以试试 $1$ 和 $-1$。"),
            ["Check it", "验证"],
            t(
              `$a = 1$, $b = ${n - 1}$: $${n - 1}^2 - 1 = ${(n - 1) ** 2 - 1} = ${n} \\cdot ${n - 2}$, so $a^2 \\equiv b^2$, but $1 \\not\\equiv ${n - 1}$. False.`,
              `$a = 1$，$b = ${n - 1}$：$${n - 1}^2 - 1 = ${(n - 1) ** 2 - 1} = ${n} \\cdot ${n - 2}$，所以 $a^2 \\equiv b^2$，但 $1 \\not\\equiv ${n - 1}$。假。`,
            ),
            t(
              `$${n - 1} - 1 = ${n - 2}$ lies strictly between $0$ and $${n}$, so it is not a multiple of $${n}$.`,
              `$${n - 1} - 1 = ${n - 2}$ 严格介于 $0$ 与 $${n}$ 之间，不是 $${n}$ 的倍数。`,
            ),
          ],
          [
            `${cong("a", "b", n)} \\implies ${cong("a", "b", 2 * n)}`,
            false,
            counter,
            t(`A multiple of $${n}$ need not be a multiple of $${2 * n}$.`, `$${n}$ 的倍数不一定是 $${2 * n}$ 的倍数。`),
            ["Check it", "验证"],
            t(
              `$a = ${n}$, $b = 0$: $${n} \\equiv 0 \\pmod{${n}}$, but $${n} \\not\\equiv 0 \\pmod{${2 * n}}$. False.`,
              `$a = ${n}$，$b = 0$：$${n} \\equiv 0 \\pmod{${n}}$，但 $${n} \\not\\equiv 0 \\pmod{${2 * n}}$。假。`,
            ),
            t(`$${n} - 0 = ${n}$ lies strictly between $0$ and $${2 * n}$.`, `$${n} - 0 = ${n}$ 严格介于 $0$ 与 $${2 * n}$ 之间。`),
          ],
          d > 0
            ? [
                `${cong("a", "b", n)} \\implies ${cong("a", "b", d)}`,
                true,
                hypothesis,
                t(`$${n} \\mid a - b$.`, `$${n} \\mid a - b$。`),
                ["Pass the divisor along", "传递整除"],
                t(
                  `$${d} \\mid ${n}$ and $${n} \\mid a - b$, so $${d} \\mid a - b$. True.`,
                  `$${d} \\mid ${n}$ 且 $${n} \\mid a - b$，所以 $${d} \\mid a - b$。真。`,
                ),
                t(`$a = ${n}$, $b = 0$: $${n} = ${d} \\cdot ${n / d}$.`, `$a = ${n}$，$b = 0$：$${n} = ${d} \\cdot ${n / d}$。`),
              ]
            : [
                `${cong("a", "b", 2 * n)} \\implies ${cong("a", "b", n)}`,
                true,
                hypothesis,
                t(`$${2 * n} \\mid a - b$.`, `$${2 * n} \\mid a - b$。`),
                ["Pass the divisor along", "传递整除"],
                t(
                  `$${n} \\mid ${2 * n}$ and $${2 * n} \\mid a - b$, so $${n} \\mid a - b$. True.`,
                  `$${n} \\mid ${2 * n}$ 且 $${2 * n} \\mid a - b$，所以 $${n} \\mid a - b$。真。`,
                ),
                t(`$a = ${2 * n}$, $b = 0$: $${2 * n} = ${n} \\cdot 2$.`, `$a = ${2 * n}$，$b = 0$：$${2 * n} = ${n} \\cdot 2$。`),
              ],
          [
            `${cong("a", "b", n)} \\implies ${cong("a + c", "b + c", n)}`,
            true,
            hypothesis,
            t(`$a - b = ${n}k$ for some integer $k$.`, `存在整数 $k$ 使 $a - b = ${n}k$。`),
            ["Compare the differences", "比较差"],
            t(`$(a + c) - (b + c) = a - b = ${n}k$. True.`, `$(a + c) - (b + c) = a - b = ${n}k$。真。`),
            t(`$a = ${n + 1}$, $b = 1$, $c = 5$: $${n + 6} - 6 = ${n}$.`, `$a = ${n + 1}$，$b = 1$，$c = 5$：$${n + 6} - 6 = ${n}$。`),
          ],
          [
            `${cong("a", "b", n)} \\implies ${cong(`a^{${n}}`, `b^{${n}}`, n)}`,
            true,
            hypothesis,
            t(`$${cong("a", "b", n)}$.`, `$${cong("a", "b", n)}$。`),
            ["Multiply repeatedly", "反复相乘"],
            t(
              `Congruences can be multiplied, so multiplying $a \\equiv b$ by itself $${n}$ times gives $a^{${n}} \\equiv b^{${n}}$. True.`,
              `同余式可以相乘，所以把 $a \\equiv b$ 与自身相乘 $${n}$ 次得 $a^{${n}} \\equiv b^{${n}}$。真。`,
            ),
            t(
              `$a = ${n + 1}$, $b = 1$: already $${n + 1}^2 = ${(n + 1) ** 2} = ${n} \\cdot ${n + 2} + 1 \\equiv 1$, and each further factor $${n + 1} \\equiv 1$ keeps the power $\\equiv 1 = 1^{${n}}$.`,
              `$a = ${n + 1}$，$b = 1$：$${n + 1}^2 = ${(n + 1) ** 2} = ${n} \\cdot ${n + 2} + 1 \\equiv 1$，之后每个因数 $${n + 1} \\equiv 1$ 都使幂保持 $\\equiv 1 = 1^{${n}}$。`,
            ),
          ],
          [
            `${cong("a", "b", n)} \\implies ${cong(`${n + 1}a`, "b", n)}`,
            true,
            ["Reduce the coefficient", "约化系数"],
            t(`$${cong(n + 1, 1, n)}$.`, `$${cong(n + 1, 1, n)}$。`),
            ["Substitute", "代入"],
            t(
              `$${n + 1}a \\equiv 1 \\cdot a = a \\equiv b \\pmod{${n}}$. True.`,
              `$${n + 1}a \\equiv 1 \\cdot a = a \\equiv b \\pmod{${n}}$。真。`,
            ),
            t(`$${n + 1}a - a = ${n}a$ is a multiple of $${n}$.`, `$${n + 1}a - a = ${n}a$ 是 $${n}$ 的倍数。`),
          ],
          prime
            ? [
                `${cong("ab", 0, n)} \\implies ${cong("a", 0, n)} \\text{ or } ${cong("b", 0, n)}`,
                true,
                ["Use that the modulus is prime", "利用模是素数"],
                t(`$${n}$ is prime.`, `$${n}$ 是素数。`),
                ["Apply Euclid's lemma", "应用欧几里得引理"],
                t(
                  `$${n} \\mid ab$ forces $${n} \\mid a$ or $${n} \\mid b$. True.`,
                  `$${n} \\mid ab$ 推出 $${n} \\mid a$ 或 $${n} \\mid b$。真。`,
                ),
                t(
                  `None of $1, \\dots, ${n - 1}$ shares a factor with $${n}$, so no product of two of them is a multiple of $${n}$.`,
                  `$1, \\dots, ${n - 1}$ 都与 $${n}$ 没有公因数，所以其中任意两个的乘积都不是 $${n}$ 的倍数。`,
                ),
              ]
            : [
                `${cong("ab", 0, n)} \\implies ${cong("a", 0, n)} \\text{ or } ${cong("b", 0, n)}`,
                false,
                counter,
                t(
                  `$${n} = ${f} \\cdot ${n / f}$ is composite, so split it into two factors.`,
                  `$${n} = ${f} \\cdot ${n / f}$ 是合数，所以把它拆成两个因数。`,
                ),
                ["Check it", "验证"],
                t(
                  `$a = ${f}$, $b = ${n / f}$: $ab = ${n} \\equiv 0$, but neither factor is $\\equiv 0 \\pmod{${n}}$. False.`,
                  `$a = ${f}$，$b = ${n / f}$：$ab = ${n} \\equiv 0$，但两个因数都不 $\\equiv 0 \\pmod{${n}}$。假。`,
                ),
                t(
                  `$${f}$ and $${n / f}$ both lie strictly between $0$ and $${n}$.`,
                  `$${f}$ 和 $${n / f}$ 都严格介于 $0$ 与 $${n}$ 之间。`,
                ),
              ],
        ];
        const [claim, value, label1, said1, label2, said2, check] = claims[rng.int(0, claims.length - 1)]!;
        return reasoned(
          oneOf(
            rng,
            t(`True or false, for all integers $a$, $b$, $c$: $${claim}$.`, `判断真假（对所有整数 $a$、$b$、$c$）：$${claim}$。`),
            trueFalse[value ? 0 : 1]!,
            [trueFalse[value ? 1 : 0]!],
            walked(
              [
                [label1, said1],
                [label2, said2],
              ],
              check,
            ),
          ),
          [
            value
              ? [
                  "False",
                  "Write the hypothesis as an equation and follow it: the new difference comes out a multiple of the modulus.",
                  "把假设写成等式再推下去：新的差会是模的倍数。",
                ]
              : [
                  "True",
                  "One counterexample is enough to make a law false; try small numbers.",
                  "一个反例就足以说明规律不成立；试试小的数。",
                ],
          ],
        );
      },
    },
  ],
};

/** provingDivisibilityUsingCongruence proves divisibility by working with residues. */
export const provingDivisibilityUsingCongruence: TopicDef = {
  id: "proving-divisibility-using-congruence",
  title: t("Proving Divisibility Using Congruence", "用同余证明整除"),
  summary: t(
    "To show m divides an expression for every n, check each residue of n modulo m; to test a large number, reduce 10 modulo m.",
    "要证明 m 对每个 n 都整除某个表达式，逐一检验 n 模 m 的每个剩余；要检验大数，先把 10 模 m 约化。",
  ),
  intro: t(
    "Can $n^2 + 1$ ever be a multiple of $3$? Every integer is $\\equiv 0$, $1$ or $2 \\pmod{3}$, and these give $n^2 + 1 \\equiv 1$, $2$ and $5 \\equiv 2$. None is $0$, so the answer is never, for infinitely many $n$ at once.\n\nCheck: $n = 4$ gives $17$, and $n = 6$ gives $37$; neither is a multiple of $3$.\n\nIn this lesson we prove divisibility by checking residue classes and find remainders from the digits of a number.",
    "$n^2 + 1$ 能是 $3$ 的倍数吗？每个整数都 $\\equiv 0$、$1$ 或 $2 \\pmod{3}$，它们分别给出 $n^2 + 1 \\equiv 1$、$2$ 和 $5 \\equiv 2$。都不是 $0$，所以答案是永远不能，一次就处理了无穷多个 $n$。\n\n检验：$n = 4$ 得 $17$，$n = 6$ 得 $37$；都不是 $3$ 的倍数。\n\n本课我们通过检验剩余类来证明整除，并由一个数的各位数字求余数。",
  ),
  prerequisites: ["the-multiplication-properties-of-modular-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-residue-classes",
      title: t("Checking residue classes", "逐一检验剩余类"),
      explanation: t(
        "Every integer falls into one of finitely many residue classes, so checking one representative from each class covers all integers. To prove $3 \\mid n^3 - n$, check $n \\equiv 0, 1, 2 \\pmod{3}$: $0 - 0 = 0$, $1 - 1 = 0$, $8 - 2 = 6 \\equiv 0$. Every case gives $0$, so $3$ always divides $n^3 - n$.\n\n> **Watch out.** Replace every $n$ in the expression by the residue, the one in the linear term too. A claim about every $n$ needs every class checked; one class that fails is enough to sink it.",
        "每个整数都属于有限个剩余类之一，所以从每类中检查一个代表就覆盖了所有整数。证明 $3 \\mid n^3 - n$：检验 $n \\equiv 0, 1, 2 \\pmod{3}$：$0 - 0 = 0$，$1 - 1 = 0$，$8 - 2 = 6 \\equiv 0$。每种情况都得 $0$，所以 $3$ 总整除 $n^3 - n$。\n\n> **注意。** 要把表达式中的每个 $n$ 都换成剩余，一次项中的也不例外。关于每个 $n$ 的命题需要检验每一类；只要有一类不成立，命题就被推翻。",
      ),
      generate(rng) {
        const m = rng.int(3, 9);
        const r = rng.int(1, m - 1);
        const p = rng.int(2, 4);
        const a = rng.int(1, 6);
        const c = rng.int(-9, 9);
        const tex = `n^{${p}} + ${a === 1 ? "" : a}n${signed(c)}`;
        const raw = r ** p + a * r + c;
        const value = mod(raw, m);
        const k = r + m;
        const big = k ** p + a * k + c;
        return numberProblem({
          prompt: t(
            `In a proof by cases modulo $${m}$, suppose $${cong("n", r, m)}$. Find the residue $s$ with $0 \\le s < ${m}$ and $${cong(tex, "s", m)}$.`,
            `在模 $${m}$ 的分情况证明中，设 $${cong("n", r, m)}$。求满足 $0 \\le s < ${m}$ 且 $${cong(tex, "s", m)}$ 的剩余 $s$。`,
          ),
          answer: value,
          wrong: [mod(r * p + a * r + c, m), mod(r ** p + a + c, m), mod(value + 1, m)],
          mistakes: firstOf([
            why(
              mod(r * p + a * r + c, m),
              `That multiplies $${r}$ by the exponent; $${r}^{${p}}$ is repeated multiplication.`,
              `这是用 $${r}$ 乘以指数；$${r}^{${p}}$ 是重复相乘。`,
            ),
            why(
              mod(r ** p + a + c, m),
              "That drops the $n$ from the linear term; it must be replaced by the residue too.",
              "这漏掉了一次项中的 $n$；它也要换成剩余。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the residue", "代入剩余"],
                t(
                  `$${tex} \\equiv ${r}^{${p}}${signed(a)} \\cdot ${r}${signed(c)} \\pmod{${m}}$.`,
                  `$${tex} \\equiv ${r}^{${p}}${signed(a)} \\cdot ${r}${signed(c)} \\pmod{${m}}$。`,
                ),
              ],
              [
                ["Compute and reduce", "计算并约化"],
                t(
                  `$${r ** p}${signed(a * r)}${signed(c)} = ${reduced(raw, value)} \\pmod{${m}}$, so $s = ${value}$.`,
                  `$${r ** p}${signed(a * r)}${signed(c)} = ${reduced(raw, value)} \\pmod{${m}}$，所以 $s = ${value}$。`,
                ),
              ],
            ],
            t(
              `Try $n = ${k}$, which is $\\equiv ${r} \\pmod{${m}}$: the expression is $${big} = ${m} \\cdot ${par(Math.floor(big / m))} + ${value}$.`,
              `取 $n = ${k}$，它 $\\equiv ${r} \\pmod{${m}}$：表达式等于 $${big} = ${m} \\cdot ${par(Math.floor(big / m))} + ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "digit-tests-for-divisibility",
      title: t("Digit tests", "数字判别法"),
      explanation: t(
        "Ten has a simple remainder modulo nine and eleven, so a number reduces to a simple combination of its digits. Since $10 \\equiv 1 \\pmod{9}$, a number is congruent to its digit sum modulo $9$. Since $10 \\equiv -1 \\pmod{11}$, $d_k \\cdots d_1 d_0 \\equiv d_0 - d_1 + d_2 - \\cdots \\pmod{11}$. For $8371$: $1 - 7 + 3 - 8 = -11 \\equiv 0$, so $11 \\mid 8371$.\n\n> **Watch out.** For $11$ the signs alternate starting with a plus on the units digit, the rightmost one. Starting from the left digit flips every sign when the number has an even number of digits.",
        "10 模 9 和模 11 的余数都很简单，所以一个数可以约化为其各位数字的简单组合。因为 $10 \\equiv 1 \\pmod{9}$，一个数模 $9$ 与其各位数字之和同余。因为 $10 \\equiv -1 \\pmod{11}$，$d_k \\cdots d_1 d_0 \\equiv d_0 - d_1 + d_2 - \\cdots \\pmod{11}$。对 $8371$：$1 - 7 + 3 - 8 = -11 \\equiv 0$，所以 $11 \\mid 8371$。\n\n> **注意。** 对 $11$，符号交替，从个位（最右边一位）的加号开始。当位数是偶数时，从最左边一位开始会把每个符号都弄反。",
      ),
      generate(rng) {
        const m = rng.pick([3, 9, 11]);
        const x = rng.int(10000, 9999999);
        const digits = `${x}`.split("").map(Number).reverse();
        const value = x % m;
        const eleven = m === 11;
        const sum = eleven ? digits.reduce((s, d, i) => s + (i % 2 === 0 ? d : -d), 0) : digits.reduce((s, d) => s + d, 0);
        const sumTex = digits.map((d, i) => (i === 0 ? `${d}` : `${eleven && i % 2 === 1 ? "-" : "+"} ${d}`)).join(" ");
        return numberProblem({
          prompt: t(
            `Using $${cong(10, eleven ? -1 : 1, m)}$, find the remainder when $${x}$ is divided by $${m}$.`,
            `利用 $${cong(10, eleven ? -1 : 1, m)}$，求 $${x}$ 除以 $${m}$ 的余数。`,
          ),
          answer: value,
          wrong: [mod(-sum, m), digits[0]! % m, mod(value + 1, m)],
          mistakes: firstOf([
            ...(eleven
              ? [
                  why(
                    mod(-sum, m),
                    "That alternates the signs the wrong way: the units digit gets the plus sign.",
                    "这把交替的符号弄反了：个位数字取加号。",
                  ),
                ]
              : []),
            why(
              digits[0]! % m,
              `That uses only the last digit; modulo $${m}$ every digit counts.`,
              `这只用了末位数字；模 $${m}$ 时每一位都起作用。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Reduce the powers of ten", "约化 10 的幂"],
                eleven
                  ? t(
                      "$10 \\equiv -1$, so $10^{k} \\equiv (-1)^{k}$: the digits count with alternating signs, starting with a plus on the units digit.",
                      "$10 \\equiv -1$，所以 $10^{k} \\equiv (-1)^{k}$：各位数字带交替符号计入，个位取加号。",
                    )
                  : t(
                      "$10 \\equiv 1$, so every $10^{k} \\equiv 1$: each digit counts once.",
                      "$10 \\equiv 1$，所以每个 $10^{k} \\equiv 1$：每位数字各计一次。",
                    ),
              ],
              [
                ["Combine the digits", "组合各位数字"],
                t(
                  `From the right, $${sumTex} = ${reduced(sum, value)} \\pmod{${m}}$.`,
                  `从右往左，$${sumTex} = ${reduced(sum, value)} \\pmod{${m}}$。`,
                ),
              ],
            ],
            t(
              `Directly, $${x} = ${m} \\cdot ${Math.floor(x / m)} + ${value}$.`,
              `直接计算，$${x} = ${m} \\cdot ${Math.floor(x / m)} + ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** provingCongruenceByContrapositive proves congruence statements through their contrapositives. */
export const provingCongruenceByContrapositive: TopicDef = {
  id: "proving-congruence-by-contrapositive",
  title: t("Proving Congruence by Contrapositive", "用逆否命题证明同余"),
  summary: t(
    "A statement with a ≢ hypothesis is often easier as its contrapositive, which has an ≡ hypothesis that can be computed with.",
    "假设为 ≢ 的命题常常改证其逆否命题更容易，因为逆否命题的假设是 ≡，可以直接计算。",
  ),
  intro: t(
    "Prove: if $n^2 \\not\\equiv 0 \\pmod{4}$, then $n$ is odd. A hypothesis that says what $n^2$ is not gives little to compute with, so prove the contrapositive instead: if $n$ is even, then $n^2 \\equiv 0 \\pmod{4}$. Writing $n = 2k$ gives $n^2 = 4k^2$.\n\nCheck: $n = 6$ gives $36 = 4 \\cdot 9$.\n\nIn this lesson we form contrapositives of congruence statements and find the residues that make a congruence hold.",
    "证明：若 $n^2 \\not\\equiv 0 \\pmod{4}$，则 $n$ 是奇数。只说 $n^2$ 不是什么的假设很难用来计算，所以改证逆否命题：若 $n$ 是偶数，则 $n^2 \\equiv 0 \\pmod{4}$。写 $n = 2k$ 得 $n^2 = 4k^2$。\n\n检验：$n = 6$ 得 $36 = 4 \\cdot 9$。\n\n本课我们写出同余命题的逆否命题，并找出使同余式成立的剩余。",
  ),
  prerequisites: ["proving-properties-of-modular-congruence", "proof-by-contrapositive"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "forming-the-contrapositive",
      title: t("Forming the contrapositive", "写出逆否命题"),
      explanation: t(
        "The contrapositive of “if $n^2 \\not\\equiv 1 \\pmod{8}$, then $n$ is even” is “if $n$ is odd, then $n^2 \\equiv 1 \\pmod{8}$”, which can be checked on $n \\equiv 1, 3, 5, 7 \\pmod{8}$.\n\n> **Watch out.** The contrapositive both swaps and negates. Swapping alone gives the converse, and negating alone gives the inverse; neither is equivalent to the original.",
        "“若 $n^2 \\not\\equiv 1 \\pmod{8}$，则 $n$ 是偶数”的逆否命题是“若 $n$ 是奇数，则 $n^2 \\equiv 1 \\pmod{8}$”，可以对 $n \\equiv 1, 3, 5, 7 \\pmod{8}$ 逐一检验。\n\n> **注意。** 逆否命题既要交换又要否定。只交换得到逆命题，只否定得到否命题；两者都与原命题不等价。",
      ),
      generate(rng) {
        const m = rng.int(3, 12);
        const d = rng.int(1, m - 1);
        const p = rng.int(2, 3);
        const c = modPow(d, p, m);
        const np = `n^{${p}}`;
        const stmt = (h: string, k: string) => math(`\\text{If } ${h}, \\text{ then } ${k}.`);
        const converse = stmt(ncong("n", d, m), ncong(np, c, m));
        const inverse = stmt(cong(np, c, m), cong("n", d, m));
        const half = stmt(cong("n", d, m), ncong(np, c, m));
        return reasoned(
          oneOf(
            rng,
            t(
              `Which is the contrapositive of “if $${ncong(np, c, m)}$, then $${ncong("n", d, m)}$”?`,
              `“若 $${ncong(np, c, m)}$，则 $${ncong("n", d, m)}$”的逆否命题是哪一个？`,
            ),
            stmt(cong("n", d, m), cong(np, c, m)),
            [converse, inverse, half],
            walked(
              [
                [
                  ["Swap the hypothesis and conclusion", "交换假设与结论"],
                  t(
                    `This gives “if $${ncong("n", d, m)}$, then $${ncong(np, c, m)}$”.`,
                    `得到“若 $${ncong("n", d, m)}$，则 $${ncong(np, c, m)}$”。`,
                  ),
                ],
                [
                  ["Negate both", "同时否定"],
                  t(
                    `This gives “if $${cong("n", d, m)}$, then $${cong(np, c, m)}$”.`,
                    `得到“若 $${cong("n", d, m)}$，则 $${cong(np, c, m)}$”。`,
                  ),
                ],
              ],
              t(
                `The contrapositive is true, since $${d}^{${p}} = ${d ** p} \\equiv ${c} \\pmod{${m}}$, so the original statement is true as well.`,
                `逆否命题为真，因为 $${d}^{${p}} = ${d ** p} \\equiv ${c} \\pmod{${m}}$，所以原命题也为真。`,
              ),
            ),
          ),
          [
            [converse.en, "That swaps the two parts without negating them: it is the converse.", "这交换了两部分却没有否定：它是逆命题。"],
            [inverse.en, "That negates the two parts without swapping them: it is the inverse.", "这否定了两部分却没有交换：它是否命题。"],
            [
              half.en,
              "Only the hypothesis is negated; the contrapositive negates the conclusion too.",
              "只否定了假设；逆否命题也要否定结论。",
            ],
          ],
        );
      },
    },
    {
      id: "finding-the-residues-that-satisfy-a-congruence",
      title: t("Residues satisfying a congruence", "满足同余式的剩余"),
      explanation: t(
        "To see which residues satisfy a congruence, test each residue class in turn, since there are only finitely many. To prove “if $n^2 \\not\\equiv 4 \\pmod{5}$, then $n \\not\\equiv 2$ and $n \\not\\equiv 3 \\pmod{5}$”, first find which residues satisfy $n^2 \\equiv 4 \\pmod{5}$: squaring $0, 1, 2, 3, 4$ gives $0, 1, 4, 4, 1$, so exactly $n \\equiv 2, 3$.\n\n> **Watch out.** A congruence with a power usually has more than one solution, so stopping at the first residue that works misses others. Test every residue from $0$ to $n - 1$.",
        "要知道哪些余数满足一个同余式，逐个检验每个剩余类，因为只有有限个。要证明“若 $n^2 \\not\\equiv 4 \\pmod{5}$，则 $n \\not\\equiv 2$ 且 $n \\not\\equiv 3 \\pmod{5}$”，先找出满足 $n^2 \\equiv 4 \\pmod{5}$ 的剩余：$0, 1, 2, 3, 4$ 的平方为 $0, 1, 4, 4, 1$，所以恰好是 $n \\equiv 2, 3$。\n\n> **注意。** 含幂的同余式通常不止一个解，所以找到第一个成立的剩余就停下会漏掉其他的。要检验从 $0$ 到 $n - 1$ 的每个剩余。",
      ),
      generate(rng) {
        const m = rng.int(5, 16);
        const p = rng.int(2, 3);
        const r0 = rng.int(1, m - 1);
        const c = modPow(r0, p, m);
        const roots = range(0, m - 1).filter((r) => modPow(r, p, m) === c);
        const table = range(0, m - 1).map((r) => `${r}^{${p}} \\equiv ${modPow(r, p, m)}`);
        const rows = range(0, Math.ceil(m / 4) - 1).map((i) => table.slice(4 * i, 4 * i + 4).join(", \\quad "));
        const last = roots[roots.length - 1]!;
        return setProblem({
          prompt: t(
            `Which residues $r \\in \\{0, 1, \\dots, ${m - 1}\\}$ satisfy $${cong(`r^{${p}}`, c, m)}$?`,
            `哪些剩余 $r \\in \\{0, 1, \\dots, ${m - 1}\\}$ 满足 $${cong(`r^{${p}}`, c, m)}$？`,
          ),
          values: roots,
          wrong: [[r0], roots.length > 1 ? roots.slice(1) : [r0, m - r0]],
          mistakes: [
            [
              [r0],
              `That is one residue that works, but not the only one: test every residue from $0$ to $${m - 1}$.`,
              `这是一个成立的剩余，但不是唯一的：要检验从 $0$ 到 $${m - 1}$ 的每个剩余。`,
            ],
            roots.length > 1
              ? [
                  roots.slice(1),
                  `That misses a residue: test every residue from $0$ to $${m - 1}$.`,
                  `这漏掉了一个剩余：要检验从 $0$ 到 $${m - 1}$ 的每个剩余。`,
                ]
              : [
                  [r0, m - r0],
                  `$${m - r0}^{${p}} \\equiv ${modPow(m - r0, p, m)}$, not $${c}$.`,
                  `$${m - r0}^{${p}} \\equiv ${modPow(m - r0, p, m)}$，而不是 $${c}$。`,
                ],
          ],
          solution: walked(
            [
              [["Compute every power", "计算每个幂"], t(`Modulo $${m}$:`, `模 $${m}$：`), rows],
              [
                ["Keep the residues that give the value", "保留得到该值的剩余"],
                t(
                  `The residues with $r^{${p}} \\equiv ${c}$ are $${setTex(roots)}$.`,
                  `满足 $r^{${p}} \\equiv ${c}$ 的剩余是 $${setTex(roots)}$。`,
                ),
              ],
            ],
            t(
              `For instance $${last}^{${p}} = ${last ** p} = ${m} \\cdot ${Math.floor(last ** p / m)} + ${c}$.`,
              `例如 $${last}^{${p}} = ${last ** p} = ${m} \\cdot ${Math.floor(last ** p / m)} + ${c}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** additiveInversesModuloN finds −a modulo n. */
export const additiveInversesModuloN: TopicDef = {
  id: "additive-inverses-modulo-n",
  title: t("Additive Inverses Modulo n", "模 n 的加法逆元"),
  summary: t(
    "The additive inverse of a modulo n is the residue b with a + b ≡ 0 (mod n), namely n − (a mod n) (or 0).",
    "a 模 n 的加法逆元是满足 a + b ≡ 0 (mod n) 的剩余 b，即 n − (a mod n)（或 0）。",
  ),
  intro: t(
    "What must be added to $7$ to reach a multiple of $10$? Adding $3$ gives $10 \\equiv 0$, so $3$ is the additive inverse of $7$ modulo $10$: modulo $10$, $-7 \\equiv 3$.\n\nCheck: $-7 + 10 = 3$, so $-7$ and $3$ differ by $10$.\n\nIn this lesson we find additive inverses and use them to solve congruences of the form $x + a \\equiv b$.",
    "$7$ 加上多少才能得到 $10$ 的倍数？加 $3$ 得 $10 \\equiv 0$，所以 $3$ 是 $7$ 模 $10$ 的加法逆元：模 $10$ 时 $-7 \\equiv 3$。\n\n检验：$-7 + 10 = 3$，所以 $-7$ 与 $3$ 相差 $10$。\n\n本课我们求加法逆元，并用它解形如 $x + a \\equiv b$ 的同余式。",
  ),
  prerequisites: ["modular-residues", "the-addition-property-of-modular-arithmetic"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-additive-inverses",
      title: t("Finding additive inverses", "求加法逆元"),
      explanation: t(
        "The additive inverse is what you add to get a multiple of the modulus, which is the modulus minus the reduced number. The additive inverse of $23$ modulo $9$: $23 \\equiv 5$, and $5 + 4 = 9 \\equiv 0$, so it is $4$.\n\n> **Watch out.** Reduce the number before subtracting it from the modulus: $9 - 23$ is negative and is not the residue. The inverse of a multiple of $n$ is $0$, not $n$.",
        "加法逆元是加上之后得到模的倍数的那个数，即模减去约化后的数。$23$ 模 $9$ 的加法逆元：$23 \\equiv 5$，而 $5 + 4 = 9 \\equiv 0$，所以是 $4$。\n\n> **注意。** 先约化这个数，再用模减去它：$9 - 23$ 是负数，不是剩余。$n$ 的倍数的逆元是 $0$，而不是 $n$。",
      ),
      generate(rng) {
        const n = rng.int(4, 30);
        const a = rng.int(-50, 99);
        const ra = mod(a, n);
        const value = mod(-a, n);
        return numberProblem({
          prompt: t(
            `Find the additive inverse of $${a}$ modulo $${n}$, as a residue in $\\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求 $${a}$ 模 $${n}$ 的加法逆元，写成 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的剩余。`,
          ),
          answer: value,
          wrong: [ra, -a, n - Math.abs(a)],
          mistakes: firstOf([
            why(ra, "That is the residue of the number itself, not of its negative.", "这是这个数本身的剩余，而不是它的相反数的剩余。"),
            why(-a, `That is not a residue: it must lie between $0$ and $${n - 1}$.`, `这不是剩余：它必须在 $0$ 到 $${n - 1}$ 之间。`),
            why(
              n - Math.abs(a),
              "Reduce the number first; the modulus minus the unreduced number is not the inverse.",
              "先约化这个数；模减去未约化的数不是逆元。",
            ),
          ]),
          solution: walked(
            [
              [["Reduce the number", "约化这个数"], t(`$${a} \\equiv ${ra} \\pmod{${n}}$.`, `$${a} \\equiv ${ra} \\pmod{${n}}$。`)],
              ra === 0
                ? [
                    ["Find what reaches a multiple", "求凑成倍数所需的数"],
                    t("It is already a multiple of the modulus, so the inverse is $0$.", "它已经是模的倍数，所以逆元是 $0$。"),
                  ]
                : [
                    ["Find what reaches a multiple", "求凑成倍数所需的数"],
                    t(`$${n} - ${ra} = ${value}$, so the inverse is $${value}$.`, `$${n} - ${ra} = ${value}$，所以逆元是 $${value}$。`),
                  ],
            ],
            t(
              `$${a} + ${value} = ${a + value} = ${n} \\cdot ${par((a + value) / n)} \\equiv 0 \\pmod{${n}}$.`,
              `$${a} + ${value} = ${a + value} = ${n} \\cdot ${par((a + value) / n)} \\equiv 0 \\pmod{${n}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-additive-congruences",
      title: t("Solving x + a ≡ b", "解 x + a ≡ b"),
      explanation: t(
        "Adding the same number to both sides keeps a congruence true, so subtracting the constant isolates the unknown. Add the additive inverse of $a$ to both sides: $x + 8 \\equiv 3 \\pmod{11}$ gives $x \\equiv 3 - 8 = -5 \\equiv 6 \\pmod{11}$.\n\n> **Watch out.** Undo $+\\,a$ by subtracting $a$, in the order $b - a$, and reduce the result: $b - a$ is often negative.",
        "两边加上同一个数，同余式仍然成立，所以减去常数就能把未知数单独分离出来。两边加上 $a$ 的加法逆元：$x + 8 \\equiv 3 \\pmod{11}$ 得 $x \\equiv 3 - 8 = -5 \\equiv 6 \\pmod{11}$。\n\n> **注意。** 用减去 $a$ 来撤销 $+\\,a$，顺序是 $b - a$，并约化结果：$b - a$ 常常是负数。",
      ),
      generate(rng) {
        const n = rng.int(4, 25);
        const a = rng.int(1, 60);
        const b = rng.int(0, n - 1);
        const raw = b - a;
        const value = mod(raw, n);
        return numberProblem({
          prompt: t(
            `Solve $${cong(`x + ${a}`, b, n)}$ for the residue $x \\in \\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求解 $${cong(`x + ${a}`, b, n)}$，答案写成剩余 $x \\in \\{0, 1, \\dots, ${n - 1}\\}$。`,
          ),
          answer: value,
          wrong: [mod(b + a, n), raw, mod(a - b, n)],
          mistakes: firstOf([
            why(
              mod(b + a, n),
              `That adds $${a}$ to both sides; to undo $+\\,${a}$, subtract it.`,
              `这是两边加上 $${a}$；要撤销 $+\\,${a}$，应当减去它。`,
            ),
            why(
              raw,
              `That is not reduced: the residue must lie between $0$ and $${n - 1}$.`,
              `这还没有约化：剩余必须在 $0$ 到 $${n - 1}$ 之间。`,
            ),
            why(mod(a - b, n), `That subtracts in the wrong order: $x \\equiv ${b} - ${a}$.`, `这减反了顺序：$x \\equiv ${b} - ${a}$。`),
          ]),
          solution: walked(
            [
              [
                ["Subtract the constant", "减去常数"],
                t(`$x \\equiv ${b} - ${a} = ${raw} \\pmod{${n}}$.`, `$x \\equiv ${b} - ${a} = ${raw} \\pmod{${n}}$。`),
              ],
              [
                ["Reduce", "约化"],
                t(
                  `$${raw} \\equiv ${value} \\pmod{${n}}$, so $x = ${value}$.`,
                  `$${raw} \\equiv ${value} \\pmod{${n}}$，所以 $x = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${value} + ${a} = ${value + a} = ${n} \\cdot ${Math.floor((value + a) / n)} + ${b} \\equiv ${b} \\pmod{${n}}$.`,
              `$${value} + ${a} = ${value + a} = ${n} \\cdot ${Math.floor((value + a) / n)} + ${b} \\equiv ${b} \\pmod{${n}}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** multiplicativeInversesModuloN finds a⁻¹ modulo n. */
export const multiplicativeInversesModuloN: TopicDef = {
  id: "multiplicative-inverses-modulo-n",
  title: t("Multiplicative Inverses Modulo n", "模 n 的乘法逆元"),
  summary: t(
    "a has an inverse modulo n exactly when gcd(a, n) = 1; the extended Euclidean algorithm gives as + nt = 1, and s is the inverse.",
    "a 模 n 有逆元当且仅当 gcd(a, n) = 1；扩展欧几里得算法给出 as + nt = 1，s 就是逆元。",
  ),
  intro: t(
    "What number times $3$ leaves remainder $1$ on division by $7$? Trying $1, 2, \\dots$ gives $3 \\cdot 5 = 15 = 2 \\cdot 7 + 1$, so $5$ works: it is the inverse of $3$ modulo $7$, and multiplying by it undoes multiplying by $3$.\n\nCheck: $15 - 1 = 14$ is a multiple of $7$.\n\nIn this lesson we find inverses with the extended Euclidean algorithm and decide when an inverse exists.",
    "什么数乘以 $3$ 后除以 $7$ 余 $1$？依次试 $1, 2, \\dots$，得 $3 \\cdot 5 = 15 = 2 \\cdot 7 + 1$，所以 $5$ 可以：它是 $3$ 模 $7$ 的逆元，乘以它就撤销了乘以 $3$。\n\n检验：$15 - 1 = 14$ 是 $7$ 的倍数。\n\n本课我们用扩展欧几里得算法求逆元，并判断逆元何时存在。",
  ),
  prerequisites: ["additive-inverses-modulo-n", "the-multiplication-properties-of-modular-arithmetic", "the-extended-euclidean-algorithm"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-multiplicative-inverses",
      title: t("Finding multiplicative inverses", "求乘法逆元"),
      explanation: t(
        "An inverse exists when the number and the modulus are coprime, and the extended Euclidean algorithm finds it from a Bézout identity. The inverse of $7$ modulo $26$: the extended Euclidean algorithm gives $7 \\cdot (-11) + 26 \\cdot 3 = 1$, so $7^{-1} \\equiv -11 \\equiv 15 \\pmod{26}$. Check: $7 \\cdot 15 = 105 = 4 \\cdot 26 + 1$.\n\n> **Watch out.** The multiplicative inverse makes a product $\\equiv 1$, while the additive inverse makes a sum $\\equiv 0$. A negative Bézout coefficient still has to be reduced into $0, 1, \\dots, n - 1$.",
        "当这个数与模互素时逆元存在，扩展欧几里得算法可以由贝祖等式求出它。$7$ 模 $26$ 的逆元：扩展欧几里得算法给出 $7 \\cdot (-11) + 26 \\cdot 3 = 1$，所以 $7^{-1} \\equiv -11 \\equiv 15 \\pmod{26}$。验证：$7 \\cdot 15 = 105 = 4 \\cdot 26 + 1$。\n\n> **注意。** 乘法逆元使乘积 $\\equiv 1$，而加法逆元使和 $\\equiv 0$。负的贝祖系数仍要约化到 $0, 1, \\dots, n - 1$ 中。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(5, 40);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) !== 1);
        const value = inverseMod(a, n);
        const [s, tt] = bezout(a, n);
        return numberProblem({
          prompt: t(
            `Find the inverse of $${a}$ modulo $${n}$, as a residue in $\\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求 $${a}$ 模 $${n}$ 的逆元，写成 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的剩余。`,
          ),
          answer: value,
          wrong: [n - value, mod(-a, n), mod(value + 1, n)],
          mistakes: firstOf([
            why(
              n - value,
              `That is the negative of the inverse: $${a}$ times it is $\\equiv -1$, not $1$.`,
              `这是逆元的相反数：$${a}$ 乘以它 $\\equiv -1$，而不是 $1$。`,
            ),
            why(
              mod(-a, n),
              "That is the additive inverse; the multiplicative inverse makes the product $\\equiv 1$.",
              "这是加法逆元；乘法逆元要使乘积 $\\equiv 1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find a Bézout identity", "求贝祖等式"],
                t(
                  `The extended Euclidean algorithm gives $${a} \\cdot ${par(s)} + ${n} \\cdot ${par(tt)} = 1$, so $${a} \\cdot ${par(s)} \\equiv 1 \\pmod{${n}}$.`,
                  `扩展欧几里得算法给出 $${a} \\cdot ${par(s)} + ${n} \\cdot ${par(tt)} = 1$，所以 $${a} \\cdot ${par(s)} \\equiv 1 \\pmod{${n}}$。`,
                ),
              ],
              [
                ["Reduce the coefficient", "约化系数"],
                t(
                  `$${reduced(s, value)} \\pmod{${n}}$, so the inverse is $${value}$.`,
                  `$${reduced(s, value)} \\pmod{${n}}$，所以逆元是 $${value}$。`,
                ),
              ],
            ],
            t(
              `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${(a * value - 1) / n} + 1 \\equiv 1 \\pmod{${n}}$.`,
              `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${(a * value - 1) / n} + 1 \\equiv 1 \\pmod{${n}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "existence-of-inverses",
      title: t("When an inverse exists", "逆元何时存在"),
      explanation: t(
        "If $\\gcd(a, n) = d > 1$, then $ax - 1$ can never be a multiple of $n$ (it is $\\equiv -1 \\pmod{d}$), so $a$ has no inverse. Modulo $12$, only $1, 5, 7, 11$ are invertible.\n\n> **Watch out.** What matters is a common factor with the modulus, not whether $a$ is prime: $3$ is prime, but it has no inverse modulo $12$.",
        "若 $\\gcd(a, n) = d > 1$，则 $ax - 1$ 永远不会是 $n$ 的倍数（它 $\\equiv -1 \\pmod{d}$），所以 $a$ 没有逆元。模 $12$ 时，只有 $1, 5, 7, 11$ 可逆。\n\n> **注意。** 关键是与模有没有公因数，而不是 $a$ 是否为素数：$3$ 是素数，但它模 $12$ 没有逆元。",
      ),
      generate(rng) {
        const n = rng.int(6, 40);
        const a = rng.int(2, 3 * n);
        const g = gcd(a, n);
        const value = g === 1;
        const inv = value ? inverseMod(a, n) : 0;
        const few = [1, 2, 3].map((x) => mod(a * x, n));
        return reasoned(
          oneOf(
            rng,
            t(`Does $${a}$ have a multiplicative inverse modulo $${n}$?`, `$${a}$ 模 $${n}$ 有乘法逆元吗？`),
            yesNo[value ? 0 : 1]!,
            [yesNo[value ? 1 : 0]!],
            walked(
              [
                [["Find the common factor", "求公因数"], t(`$\\gcd(${a}, ${n}) = ${g}$.`, `$\\gcd(${a}, ${n}) = ${g}$。`)],
                value
                  ? [
                      ["Decide", "判断"],
                      t(`The gcd is $1$, so an inverse exists; it is $${inv}$.`, `最大公因数是 $1$，所以逆元存在；它是 $${inv}$。`),
                    ]
                  : [
                      ["Decide", "判断"],
                      t(
                        `Every $${a}x$ and every multiple of $${n}$ is divisible by $${g}$, but $1$ is not, so $${a}x - 1$ is never a multiple of $${n}$: no inverse.`,
                        `每个 $${a}x$ 和每个 $${n}$ 的倍数都能被 $${g}$ 整除，而 $1$ 不能，所以 $${a}x - 1$ 永远不是 $${n}$ 的倍数：没有逆元。`,
                      ),
                    ],
              ],
              value
                ? t(
                    `$${a} \\cdot ${inv} = ${a * inv} = ${n} \\cdot ${(a * inv - 1) / n} + 1$.`,
                    `$${a} \\cdot ${inv} = ${a * inv} = ${n} \\cdot ${(a * inv - 1) / n} + 1$。`,
                  )
                : t(
                    `For $x = 1, 2, 3$ the residues of $${a}x$ are $${few.join(", ")}$, all multiples of $${g}$.`,
                    `当 $x = 1, 2, 3$ 时，$${a}x$ 的剩余是 $${few.join(", ")}$，都是 $${g}$ 的倍数。`,
                  ),
            ),
          ),
          [
            value
              ? [
                  "No",
                  "Only a common factor with the modulus prevents an inverse; find the gcd.",
                  "只有与模有公因数才会没有逆元；求出最大公因数。",
                ]
              : [
                  "Yes",
                  "A common factor with the modulus rules an inverse out; find the gcd.",
                  "与模有公因数就不可能有逆元；求出最大公因数。",
                ],
          ],
        );
      },
    },
  ],
};

/** solvingLinearCongruences solves ax ≡ b (mod n). */
export const solvingLinearCongruences: TopicDef = {
  id: "solving-linear-congruences",
  title: t("Solving Linear Congruences", "解一次同余式"),
  summary: t(
    "When gcd(a, n) = 1, ax ≡ b (mod n) has the unique solution x ≡ a⁻¹b (mod n). In general it is solvable iff gcd(a, n) divides b, with gcd(a, n) solutions modulo n.",
    "当 gcd(a, n) = 1 时，ax ≡ b (mod n) 有唯一解 x ≡ a⁻¹b (mod n)。一般地，它有解当且仅当 gcd(a, n) 整除 b，此时模 n 有 gcd(a, n) 个解。",
  ),
  intro: t(
    "Solve $2x \\equiv 3 \\pmod{5}$. Dividing $3$ by $2$ makes no sense here, but $2 \\cdot 3 = 6 \\equiv 1$, so $3$ is the inverse of $2$. Multiplying both sides by $3$ gives $x \\equiv 9 \\equiv 4 \\pmod{5}$.\n\nCheck: $2 \\cdot 4 = 8 \\equiv 3 \\pmod{5}$.\n\nIn this lesson we solve linear congruences with inverses and count how many solutions they have.",
    "解 $2x \\equiv 3 \\pmod{5}$。这里用 $3$ 除以 $2$ 没有意义，但 $2 \\cdot 3 = 6 \\equiv 1$，所以 $3$ 是 $2$ 的逆元。两边乘以 $3$ 得 $x \\equiv 9 \\equiv 4 \\pmod{5}$。\n\n检验：$2 \\cdot 4 = 8 \\equiv 3 \\pmod{5}$。\n\n本课我们用逆元解一次同余式，并统计它们有多少个解。",
  ),
  prerequisites: ["multiplicative-inverses-modulo-n"],
  encompasses: [{ topic: "multiplicative-inverses-modulo-n", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-with-an-inverse",
      title: t("Solving with an inverse", "利用逆元求解"),
      explanation: t(
        "Multiplying both sides by the inverse of the coefficient undoes the multiplication, just as dividing does for ordinary equations. $5x \\equiv 3 \\pmod{12}$: $5^{-1} \\equiv 5$ (since $25 \\equiv 1$), so $x \\equiv 5 \\cdot 3 = 15 \\equiv 3 \\pmod{12}$. Check: $5 \\cdot 3 = 15 \\equiv 3$.\n\n> **Watch out.** The inverse is not yet the answer: it has to multiply the right side. Subtracting the coefficient does not undo a product.",
        "把两边乘以系数的逆元就撤销了乘法，就像普通方程中的除法一样。$5x \\equiv 3 \\pmod{12}$：$5^{-1} \\equiv 5$（因为 $25 \\equiv 1$），所以 $x \\equiv 5 \\cdot 3 = 15 \\equiv 3 \\pmod{12}$。验证：$5 \\cdot 3 = 15 \\equiv 3$。\n\n> **注意。** 逆元还不是答案：它要乘到右边。减去系数并不能撤销乘积。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(5, 30);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) !== 1);
        const b = rng.int(1, n - 1);
        const inv = inverseMod(a, n);
        const value = mod(inv * b, n);
        return numberProblem({
          prompt: t(
            `Solve $${cong(`${a === 1 ? "" : a}x`, b, n)}$ for the residue $x \\in \\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求解 $${cong(`${a === 1 ? "" : a}x`, b, n)}$，答案写成剩余 $x \\in \\{0, 1, \\dots, ${n - 1}\\}$。`,
          ),
          answer: value,
          wrong: [inv, mod(b - a, n), mod(a * b, n)],
          mistakes: firstOf([
            why(inv, `That is the inverse of $${a}$; it still has to multiply $${b}$.`, `这是 $${a}$ 的逆元；还要用它乘以 $${b}$。`),
            why(
              mod(b - a, n),
              "That subtracts the coefficient; a coefficient is undone by its inverse.",
              "这是减去系数；系数要用它的逆元来撤销。",
            ),
            why(mod(a * b, n), `That multiplies by $${a}$ itself rather than by its inverse.`, `这是乘以 $${a}$ 本身，而不是它的逆元。`),
          ]),
          solution: walked(
            [
              [
                ["Find the inverse", "求逆元"],
                t(
                  `$${a} \\cdot ${inv} = ${a * inv} = ${n} \\cdot ${(a * inv - 1) / n} + 1$, so $${a}^{-1} \\equiv ${inv} \\pmod{${n}}$.`,
                  `$${a} \\cdot ${inv} = ${a * inv} = ${n} \\cdot ${(a * inv - 1) / n} + 1$，所以 $${a}^{-1} \\equiv ${inv} \\pmod{${n}}$。`,
                ),
              ],
              [
                ["Multiply both sides", "两边相乘"],
                t(
                  `$x \\equiv ${inv} \\cdot ${b} = ${reduced(inv * b, value)} \\pmod{${n}}$.`,
                  `$x \\equiv ${inv} \\cdot ${b} = ${reduced(inv * b, value)} \\pmod{${n}}$。`,
                ),
              ],
            ],
            t(
              `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${Math.floor((a * value) / n)} + ${b} \\equiv ${b} \\pmod{${n}}$.`,
              `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${Math.floor((a * value) / n)} + ${b} \\equiv ${b} \\pmod{${n}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-solutions-of-a-linear-congruence",
      title: t("Counting solutions", "统计解的个数"),
      explanation: t(
        "A linear congruence has solutions only when the gcd of the coefficient and the modulus divides the constant, and then it has exactly that many. $6x \\equiv 9 \\pmod{15}$: $\\gcd(6, 15) = 3$ divides $9$, so there are $3$ solutions modulo $15$. $6x \\equiv 4 \\pmod{15}$ has none, since $3 \\nmid 4$.\n\n> **Watch out.** First check that $\\gcd(a, n)$ divides $b$. When it does, the number of solutions is $\\gcd(a, n)$, and $n / \\gcd(a, n)$ is only the spacing between them.",
        "线性同余式只有在系数与模的最大公因数整除常数时才有解，而且这时恰好有那么多个解。$6x \\equiv 9 \\pmod{15}$：$\\gcd(6, 15) = 3$ 整除 $9$，所以模 $15$ 有 $3$ 个解。$6x \\equiv 4 \\pmod{15}$ 无解，因为 $3 \\nmid 4$。\n\n> **注意。** 先检查 $\\gcd(a, n)$ 是否整除 $b$。若整除，解的个数是 $\\gcd(a, n)$，而 $n / \\gcd(a, n)$ 只是解之间的间隔。",
      ),
      generate(rng) {
        const n = rng.int(6, 36);
        const factors = range(2, n - 1).filter((f) => n % f === 0);
        const f = factors.length > 0 && rng.int(0, 2) > 0 ? rng.pick(factors) : 1;
        const a = f * rng.int(f === 1 ? 2 : 1, Math.floor((n - 1) / f));
        const d = gcd(a, n);
        const b = rng.bool() ? d * rng.int(0, Math.floor((n - 1) / d)) : rng.int(1, n - 1);
        const count = b % d === 0 ? d : 0;
        const sols = range(0, n - 1).filter((x) => mod(a * x - b, n) === 0);
        const ax = `${a === 1 ? "" : a}x`;
        return numberProblem({
          prompt: t(
            `How many solutions $x \\in \\{0, 1, \\dots, ${n - 1}\\}$ does $${cong(ax, b, n)}$ have?`,
            `$${cong(ax, b, n)}$ 在 $\\{0, 1, \\dots, ${n - 1}\\}$ 中有多少个解？`,
          ),
          answer: count,
          wrong: [1, count === 0 ? d : 0, n / d],
          mistakes: firstOf([
            count === 0
              ? why(
                  1,
                  `First check whether $\\gcd(${a}, ${n})$ divides $${b}$; if it does not, there is no solution at all.`,
                  `先检查 $\\gcd(${a}, ${n})$ 是否整除 $${b}$；若不整除，就根本没有解。`,
                )
              : why(
                  1,
                  `With $\\gcd(${a}, ${n}) = ${d}$ the solutions repeat every $${n / d}$, so there is more than one modulo $${n}$.`,
                  `$\\gcd(${a}, ${n}) = ${d}$ 时，解每隔 $${n / d}$ 重复一次，所以模 $${n}$ 不止一个解。`,
                ),
            count === 0
              ? why(d, `There would be $${d}$ solutions only if $${d}$ divided $${b}$.`, `只有当 $${d}$ 整除 $${b}$ 时才会有 $${d}$ 个解。`)
              : why(0, `$${d}$ divides $${b}$, so solutions do exist.`, `$${d}$ 整除 $${b}$，所以解确实存在。`),
            why(n / d, "That is the spacing between the solutions, not how many there are.", "这是解之间的间隔，而不是解的个数。"),
          ]),
          solution: walked(
            [
              [["Find the gcd", "求最大公因数"], t(`$\\gcd(${a}, ${n}) = ${d}$.`, `$\\gcd(${a}, ${n}) = ${d}$。`)],
              count === 0
                ? [["Test the constant", "检验常数"], t(`$${d} \\nmid ${b}$, so there are no solutions.`, `$${d} \\nmid ${b}$，所以无解。`)]
                : [
                    ["Test the constant", "检验常数"],
                    t(
                      `$${d} \\mid ${b}$, so there are $${d}$ solution${d === 1 ? "" : "s"} modulo $${n}$.`,
                      `$${d} \\mid ${b}$，所以模 $${n}$ 有 $${d}$ 个解。`,
                    ),
                  ],
            ],
            count === 0
              ? t(
                  `Every $${a}x$ and every multiple of $${n}$ is divisible by $${d}$, so $${a}x - ${b}$ never is a multiple of $${n}$.`,
                  `每个 $${a}x$ 和每个 $${n}$ 的倍数都能被 $${d}$ 整除，所以 $${a}x - ${b}$ 永远不是 $${n}$ 的倍数。`,
                )
              : t(
                  `The solutions are $${sols.join(", ")}$: $${sols.length}$ of them.`,
                  `解是 $${sols.join(", ")}$：共 $${sols.length}$ 个。`,
                ),
          ),
        });
      },
    },
  ],
};

/** solvingAdvancedLinearCongruences solves ax ≡ b (mod n) when gcd(a, n) > 1. */
export const solvingAdvancedLinearCongruences: TopicDef = {
  id: "solving-advanced-linear-congruences",
  title: t("Solving Advanced Linear Congruences", "解较复杂的一次同余式"),
  summary: t(
    "If d = gcd(a, n) divides b, divide through by d, solve (a/d)x ≡ b/d (mod n/d), and list the d solutions modulo n.",
    "若 d = gcd(a, n) 整除 b，两边同除以 d，解 (a/d)x ≡ b/d (mod n/d)，再列出模 n 的 d 个解。",
  ),
  intro: t(
    "Solve $4x \\equiv 6 \\pmod{10}$. Here $4$ has no inverse, but $\\gcd(4, 10) = 2$ divides $6$, so divide everything by $2$: $2x \\equiv 3 \\pmod{5}$, which gives $x \\equiv 4 \\pmod{5}$. Modulo $10$ that is two solutions, $4$ and $9$.\n\nCheck: $4 \\cdot 9 = 36 \\equiv 6 \\pmod{10}$.\n\nIn this lesson we solve congruences whose coefficient shares a factor with the modulus, and reduce large coefficients first.",
    "解 $4x \\equiv 6 \\pmod{10}$。这里 $4$ 没有逆元，但 $\\gcd(4, 10) = 2$ 整除 $6$，所以各项除以 $2$：$2x \\equiv 3 \\pmod{5}$，得 $x \\equiv 4 \\pmod{5}$。模 $10$ 时这是两个解：$4$ 和 $9$。\n\n检验：$4 \\cdot 9 = 36 \\equiv 6 \\pmod{10}$。\n\n本课我们解系数与模有公因数的同余式，并先约化较大的系数。",
  ),
  prerequisites: ["solving-linear-congruences", "the-division-properties-of-modular-arithmetic"],
  encompasses: [{ topic: "solving-linear-congruences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "listing-all-solutions",
      title: t("Listing all solutions", "列出全部解"),
      explanation: t(
        "Divide everything by the gcd, solve the smaller congruence, and then list its solutions within the original modulus. $6x \\equiv 9 \\pmod{15}$: divide by $3$ to get $2x \\equiv 3 \\pmod{5}$, so $x \\equiv 4 \\pmod{5}$. Modulo $15$ the solutions are $4, 9, 14$.\n\n> **Watch out.** Solving the reduced congruence gives one class modulo $n / d$, which splits into $d$ residues modulo $n$. They are spaced $n / d$ apart, not $d$ apart.",
        "把各项都除以最大公因数，解较小的同余式，再在原来的模内列出它的所有解。$6x \\equiv 9 \\pmod{15}$：两边除以 $3$ 得 $2x \\equiv 3 \\pmod{5}$，所以 $x \\equiv 4 \\pmod{5}$。模 $15$ 的解是 $4, 9, 14$。\n\n> **注意。** 解约化后的同余式只得到模 $n / d$ 的一个类，它在模 $n$ 下分成 $d$ 个剩余。它们相隔 $n / d$，而不是相隔 $d$。",
      ),
      generate(rng) {
        const d = rng.int(2, 4);
        let m: number;
        let a1: number;
        do {
          m = rng.int(3, 9);
          a1 = rng.int(1, m - 1);
        } while (gcd(a1, m) !== 1 || gcd(d, m) !== 1);
        const n = d * m;
        const b1 = rng.int(0, m - 1);
        const x0 = mod(inverseMod(a1, m) * b1, m);
        const a = d * a1;
        const b = d * b1;
        const sols = range(0, d - 1).map((k) => x0 + k * m);
        const top = sols[sols.length - 1]!;
        return setProblem({
          prompt: t(
            `Find all solutions $x \\in \\{0, 1, \\dots, ${n - 1}\\}$ of $${cong(`${a === 1 ? "" : a}x`, b, n)}$.`,
            `求 $${cong(`${a === 1 ? "" : a}x`, b, n)}$ 在 $\\{0, 1, \\dots, ${n - 1}\\}$ 中的全部解。`,
          ),
          values: sols,
          wrong: [[x0], sols.map((s) => mod(s + 1, n))],
          mistakes: [
            [
              [x0],
              `That solves the reduced congruence modulo $${m}$; modulo $${n}$ there are $${d}$ solutions.`,
              `这只解了模 $${m}$ 的约化同余式；模 $${n}$ 有 $${d}$ 个解。`,
            ],
            [
              range(0, d - 1).map((k) => mod(x0 + k * d, n)),
              `The solutions are spaced by the reduced modulus $${m}$, not by $${d}$.`,
              `解之间相隔约化后的模 $${m}$，而不是 $${d}$。`,
            ],
          ],
          solution: walked(
            [
              [
                ["Divide by the gcd", "除以最大公因数"],
                t(
                  `$\\gcd(${a}, ${n}) = ${d}$ divides $${b}$; dividing gives $${cong(`${a1 === 1 ? "" : a1}x`, b1, m)}$.`,
                  `$\\gcd(${a}, ${n}) = ${d}$ 整除 $${b}$；两边除以它得 $${cong(`${a1 === 1 ? "" : a1}x`, b1, m)}$。`,
                ),
              ],
              [
                ["Solve the smaller congruence", "解较小的同余式"],
                a1 === 1
                  ? t(`It already reads $${cong("x", x0, m)}$.`, `它已经是 $${cong("x", x0, m)}$。`)
                  : t(
                      `$${a1}^{-1} \\equiv ${inverseMod(a1, m)} \\pmod{${m}}$, so $x \\equiv ${inverseMod(a1, m)} \\cdot ${b1} \\equiv ${x0} \\pmod{${m}}$.`,
                      `$${a1}^{-1} \\equiv ${inverseMod(a1, m)} \\pmod{${m}}$，所以 $x \\equiv ${inverseMod(a1, m)} \\cdot ${b1} \\equiv ${x0} \\pmod{${m}}$。`,
                    ),
              ],
              [
                ["List the solutions modulo n", "列出模 n 的解"],
                t(`Add multiples of $${m}$ below $${n}$: $${setTex(sols)}$.`, `加上小于 $${n}$ 的 $${m}$ 的倍数：$${setTex(sols)}$。`),
              ],
            ],
            t(
              `For $x = ${top}$: $${a} \\cdot ${top} = ${a * top} = ${n} \\cdot ${Math.floor((a * top) / n)} + ${b}$.`,
              `对 $x = ${top}$：$${a} \\cdot ${top} = ${a * top} = ${n} \\cdot ${Math.floor((a * top) / n)} + ${b}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "reducing-the-coefficients-first",
      title: t("Reducing the coefficients first", "先约化系数"),
      explanation: t(
        "Replacing every number by its remainder first keeps the arithmetic small and does not change the solutions. $47x \\equiv -13 \\pmod{9}$: reduce first, $47 \\equiv 2$ and $-13 \\equiv 5$, giving $2x \\equiv 5 \\pmod{9}$. Then $2^{-1} \\equiv 5$, so $x \\equiv 25 \\equiv 7 \\pmod{9}$.\n\n> **Watch out.** A negative constant reduces upward from the multiple of $n$ just below it: $-13 \\equiv 5 \\pmod{9}$, not $4$. Dropping the sign changes the congruence.",
        "先把每个数换成它的余数，可以让计算保持简单，而且不改变解。$47x \\equiv -13 \\pmod{9}$：先约化，$47 \\equiv 2$，$-13 \\equiv 5$，得 $2x \\equiv 5 \\pmod{9}$。而 $2^{-1} \\equiv 5$，所以 $x \\equiv 25 \\equiv 7 \\pmod{9}$。\n\n> **注意。** 负的常数要从它下面紧挨着的 $n$ 的倍数往上约化：$-13 \\equiv 5 \\pmod{9}$，而不是 $4$。去掉符号会改变同余式。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(5, 17);
          a = rng.int(n + 1, 120);
        } while (gcd(a, n) !== 1);
        const b = rng.int(-80, -1);
        const ra = mod(a, n);
        const rb = mod(b, n);
        const inv = inverseMod(ra, n);
        const value = mod(inv * rb, n);
        const diff = a * value - b;
        return numberProblem({
          prompt: t(
            `Solve $${cong(`${a === 1 ? "" : a}x`, b, n)}$ for the residue $x \\in \\{0, 1, \\dots, ${n - 1}\\}$.`,
            `求解 $${cong(`${a === 1 ? "" : a}x`, b, n)}$，答案写成剩余 $x \\in \\{0, 1, \\dots, ${n - 1}\\}$。`,
          ),
          answer: value,
          wrong: [mod(inv * -b, n), mod(inv * Math.abs(b % n), n), mod(value + 1, n)],
          mistakes: firstOf([
            why(
              mod(inv * -b, n),
              `That uses the constant without its minus sign; $${b}$ is negative.`,
              `这用了去掉负号的常数；$${b}$ 是负数。`,
            ),
            why(
              mod(inv * Math.abs(b % n), n),
              `That reduces $${b}$ without its sign; a negative number reduces upward from the multiple below it.`,
              `这是去掉符号后约化 $${b}$；负数要从下面紧挨着的倍数往上约化。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Reduce the coefficients", "约化系数"],
                t(
                  `$${a} \\equiv ${ra}$ and $${b} \\equiv ${rb} \\pmod{${n}}$, so the congruence is $${cong(`${ra === 1 ? "" : ra}x`, rb, n)}$.`,
                  `$${a} \\equiv ${ra}$，$${b} \\equiv ${rb} \\pmod{${n}}$，所以同余式是 $${cong(`${ra === 1 ? "" : ra}x`, rb, n)}$。`,
                ),
              ],
              [
                ["Multiply by the inverse", "乘以逆元"],
                t(
                  `$${ra}^{-1} \\equiv ${inv} \\pmod{${n}}$, so $x \\equiv ${inv} \\cdot ${rb} = ${reduced(inv * rb, value)} \\pmod{${n}}$.`,
                  `$${ra}^{-1} \\equiv ${inv} \\pmod{${n}}$，所以 $x \\equiv ${inv} \\cdot ${rb} = ${reduced(inv * rb, value)} \\pmod{${n}}$。`,
                ),
              ],
            ],
            t(
              `In the original congruence, $${a} \\cdot ${value} - ${par(b)} = ${diff} = ${n} \\cdot ${diff / n}$.`,
              `代回原同余式，$${a} \\cdot ${value} - ${par(b)} = ${diff} = ${n} \\cdot ${diff / n}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theChineseRemainderTheorem solves systems of congruences with coprime moduli. */
export const theChineseRemainderTheorem: TopicDef = {
  id: "the-chinese-remainder-theorem",
  title: t("The Chinese Remainder Theorem", "中国剩余定理"),
  summary: t(
    "If the moduli are pairwise coprime, a system x ≡ aᵢ (mod nᵢ) has exactly one solution modulo n₁n₂⋯nₖ.",
    "若各模两两互素，同余方程组 x ≡ aᵢ (mod nᵢ) 模 n₁n₂⋯nₖ 恰有一个解。",
  ),
  intro: t(
    "A number leaves remainder $1$ on division by $3$ and remainder $2$ on division by $5$. The numbers with the first property are $1, 4, 7, 10, \\dots$, and the first of them with the second property is $7$. Every other answer differs from $7$ by a multiple of $15$.\n\nCheck: $7 = 3 \\cdot 2 + 1$ and $7 = 5 \\cdot 1 + 2$.\n\nIn this lesson we solve systems of two and three congruences with coprime moduli.",
    "一个数除以 $3$ 余 $1$，除以 $5$ 余 $2$。具有第一个性质的数是 $1, 4, 7, 10, \\dots$，其中第一个具有第二个性质的是 $7$。其他答案都与 $7$ 相差 $15$ 的倍数。\n\n检验：$7 = 3 \\cdot 2 + 1$，$7 = 5 \\cdot 1 + 2$。\n\n本课我们解模两两互素的两个或三个同余式组成的方程组。",
  ),
  prerequisites: ["solving-linear-congruences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-two-congruences",
      title: t("Two congruences", "两个同余式"),
      explanation: t(
        "Write the general solution of the first congruence with a parameter and substitute it into the second to find the parameter. $x \\equiv 2 \\pmod{5}$, $x \\equiv 3 \\pmod{7}$: write $x = 2 + 5k$. Then $2 + 5k \\equiv 3 \\pmod{7}$, so $5k \\equiv 1$ and $k \\equiv 3 \\pmod{7}$. So $x = 17$, and all solutions are $x \\equiv 17 \\pmod{35}$.\n\n> **Watch out.** Substitute the whole general solution $a + mk$, not just $a$: the second congruence is what decides $k$. Then check the answer against both congruences.",
        "用一个参数写出第一个同余式的通解，再代入第二个同余式求出这个参数。$x \\equiv 2 \\pmod{5}$，$x \\equiv 3 \\pmod{7}$：写 $x = 2 + 5k$。则 $2 + 5k \\equiv 3 \\pmod{7}$，所以 $5k \\equiv 1$，$k \\equiv 3 \\pmod{7}$。于是 $x = 17$，全部解为 $x \\equiv 17 \\pmod{35}$。\n\n> **注意。** 要代入完整的通解 $a + mk$，而不只是 $a$：决定 $k$ 的是第二个同余式。最后要用两个同余式检验答案。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        do {
          m = rng.int(3, 11);
          n = rng.int(3, 13);
        } while (gcd(m, n) !== 1);
        const a = rng.int(0, m - 1);
        const b = rng.int(0, n - 1);
        const x = range(0, m * n - 1).find((v) => v % m === a && v % n === b)!;
        const k = (x - a) / m;
        const off = (v: number): [string, string] => [
          `$${v}$ leaves remainder $${v % m}$ on division by $${m}$ and $${v % n}$ on division by $${n}$, so it does not satisfy both.`,
          `$${v}$ 除以 $${m}$ 余 $${v % m}$，除以 $${n}$ 余 $${v % n}$，不能同时满足两个同余式。`,
        ];
        const third = mod(a * n + b * m, m * n);
        return numberProblem({
          prompt: t(
            `Find the smallest nonnegative $x$ with $${cong("x", a, m)}$ and $${cong("x", b, n)}$.`,
            `求同时满足 $${cong("x", a, m)}$ 与 $${cong("x", b, n)}$ 的最小非负整数 $x$。`,
          ),
          answer: x,
          wrong: [x + m * n, a + b, third],
          mistakes: firstOf([
            why(
              x + m * n,
              `That satisfies both, but it is not the smallest: subtract $${m * n}$.`,
              `它同时满足两个同余式，但不是最小的：减去 $${m * n}$。`,
            ),
            why(a + b, ...off(a + b)),
            why(third, ...off(third)),
          ]),
          solution: walked(
            [
              [["Write the first congruence with a parameter", "用参数写出第一个同余式"], t(`$x = ${a} + ${m}k$.`, `$x = ${a} + ${m}k$。`)],
              [
                ["Substitute into the second", "代入第二个同余式"],
                t(
                  `$${cong(`${a} + ${m}k`, b, n)}$ gives $k \\equiv ${k} \\pmod{${n}}$, the smallest choice being $k = ${k}$.`,
                  `由 $${cong(`${a} + ${m}k`, b, n)}$ 得 $k \\equiv ${k} \\pmod{${n}}$，最小取 $k = ${k}$。`,
                ),
              ],
              [
                ["Find x", "求 x"],
                t(
                  `$x = ${a} + ${m} \\cdot ${k} = ${x}$, unique modulo $${m * n}$.`,
                  `$x = ${a} + ${m} \\cdot ${k} = ${x}$，模 $${m * n}$ 唯一。`,
                ),
              ],
            ],
            t(
              `$${x} = ${m} \\cdot ${Math.floor(x / m)} + ${a}$ and $${x} = ${n} \\cdot ${Math.floor(x / n)} + ${b}$.`,
              `$${x} = ${m} \\cdot ${Math.floor(x / m)} + ${a}$，$${x} = ${n} \\cdot ${Math.floor(x / n)} + ${b}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-three-congruences",
      title: t("Three congruences", "三个同余式"),
      explanation: t(
        "Combine the congruences two at a time: solving the first pair gives one congruence, which is then combined with the third. $x \\equiv 1 \\pmod{3}$, $x \\equiv 2 \\pmod{4}$, $x \\equiv 3 \\pmod{5}$: the first two give $x \\equiv 10 \\pmod{12}$; then $10 + 12k \\equiv 3 \\pmod{5}$ gives $k \\equiv 4$, so $x = 58$ modulo $60$.\n\n> **Watch out.** The solution of the first pair is only halfway: it still has to be combined with the third congruence, and its modulus is the product of the first two moduli.",
        "把同余式两两合并：解出前两个得到一个同余式，再把它与第三个合并。$x \\equiv 1 \\pmod{3}$，$x \\equiv 2 \\pmod{4}$，$x \\equiv 3 \\pmod{5}$：前两个给出 $x \\equiv 10 \\pmod{12}$；再由 $10 + 12k \\equiv 3 \\pmod{5}$ 得 $k \\equiv 4$，所以模 $60$ 有 $x = 58$。\n\n> **注意。** 解出前两个只完成了一半：还要与第三个同余式合并，而它的模是前两个模的乘积。",
      ),
      generate(rng) {
        const [p, q, r] = rng.pick([
          [2, 3, 5],
          [3, 4, 5],
          [3, 5, 7],
          [2, 5, 7],
          [4, 5, 7],
        ] as const);
        const a = rng.int(0, p - 1);
        const b = rng.int(0, q - 1);
        const c = rng.int(0, r - 1);
        const N = p * q * r;
        const x = range(0, N - 1).find((v) => v % p === a && v % q === b && v % r === c)!;
        const y = range(0, p * q - 1).find((v) => v % p === a && v % q === b)!;
        const k = (x - y) / (p * q);
        return numberProblem({
          prompt: t(
            `Find the smallest nonnegative $x$ with $${cong("x", a, p)}$, $${cong("x", b, q)}$ and $${cong("x", c, r)}$.`,
            `求同时满足 $${cong("x", a, p)}$、$${cong("x", b, q)}$、$${cong("x", c, r)}$ 的最小非负整数 $x$。`,
          ),
          answer: x,
          wrong: [y, x + N, a + b + c],
          mistakes: firstOf([
            why(
              y,
              `That satisfies the first two congruences only; it leaves remainder $${y % r}$ on division by $${r}$.`,
              `它只满足前两个同余式；它除以 $${r}$ 余 $${y % r}$。`,
            ),
            why(
              x + N,
              `That satisfies all three, but it is not the smallest: subtract $${N}$.`,
              `它满足全部三个同余式，但不是最小的：减去 $${N}$。`,
            ),
            why(
              a + b + c,
              `Adding the remainders does not work: $${a + b + c}$ leaves remainders $${(a + b + c) % p}$, $${(a + b + c) % q}$ and $${(a + b + c) % r}$.`,
              `把余数相加不行：$${a + b + c}$ 的余数分别是 $${(a + b + c) % p}$、$${(a + b + c) % q}$、$${(a + b + c) % r}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Combine the first two", "合并前两个"], t(`They give $${cong("x", y, p * q)}$.`, `它们给出 $${cong("x", y, p * q)}$。`)],
              [
                ["Bring in the third", "加入第三个"],
                t(
                  `$x = ${y} + ${p * q}k \\equiv ${c} \\pmod{${r}}$ gives $k = ${k}$.`,
                  `由 $x = ${y} + ${p * q}k \\equiv ${c} \\pmod{${r}}$ 得 $k = ${k}$。`,
                ),
              ],
              [
                ["Find x", "求 x"],
                t(
                  `$x = ${y} + ${p * q} \\cdot ${k} = ${x}$, unique modulo $${N}$.`,
                  `$x = ${y} + ${p * q} \\cdot ${k} = ${x}$，模 $${N}$ 唯一。`,
                ),
              ],
            ],
            t(
              `$${x} = ${p} \\cdot ${Math.floor(x / p)} + ${a}$, $${x} = ${q} \\cdot ${Math.floor(x / q)} + ${b}$ and $${x} = ${r} \\cdot ${Math.floor(x / r)} + ${c}$.`,
              `$${x} = ${p} \\cdot ${Math.floor(x / p)} + ${a}$，$${x} = ${q} \\cdot ${Math.floor(x / q)} + ${b}$，$${x} = ${r} \\cdot ${Math.floor(x / r)} + ${c}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** provingPropertiesOfLinearCongruences proves existence and uniqueness of solutions. */
export const provingPropertiesOfLinearCongruences: TopicDef = {
  id: "proving-properties-of-linear-congruences",
  title: t("Proving Properties of Linear Congruences", "证明一次同余式的性质"),
  summary: t(
    "Existence: from as + nt = 1, x = sb solves ax ≡ b (mod n). Uniqueness: ax ≡ ay with gcd(a, n) = 1 gives n | x − y.",
    "存在性：由 as + nt = 1，x = sb 是 ax ≡ b (mod n) 的解。唯一性：ax ≡ ay 且 gcd(a, n) = 1 推出 n | x − y。",
  ),
  intro: t(
    "Why does $3x \\equiv 4 \\pmod{7}$ have a solution? The identity $3 \\cdot 5 + 7 \\cdot (-2) = 1$ multiplied by $4$ gives $3 \\cdot 20 + 7 \\cdot (-8) = 4$, so $x = 20 \\equiv 6$ works. The identity proves that a solution exists and also builds it.\n\nCheck: $3 \\cdot 6 = 18 = 2 \\cdot 7 + 4$.\n\nIn this lesson we construct solutions from Bézout identities and prove when the solution is unique.",
    "为什么 $3x \\equiv 4 \\pmod{7}$ 有解？把等式 $3 \\cdot 5 + 7 \\cdot (-2) = 1$ 乘以 $4$，得 $3 \\cdot 20 + 7 \\cdot (-8) = 4$，所以 $x = 20 \\equiv 6$ 可以。这个等式既证明了解存在，又构造出了解。\n\n检验：$3 \\cdot 6 = 18 = 2 \\cdot 7 + 4$。\n\n本课我们由贝祖等式构造解，并证明解何时唯一。",
  ),
  prerequisites: ["solving-advanced-linear-congruences", "proving-properties-of-modular-congruence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "constructing-a-solution-from-bezout",
      title: t("Constructing a solution", "构造解"),
      explanation: t(
        "A Bézout identity shows a multiple of the coefficient congruent to one, so scaling it gives a solution of the congruence. Given $7 \\cdot (-2) + 15 \\cdot 1 = 1$, multiply by $4$: $7 \\cdot (-8) + 15 \\cdot 4 = 4$, so $7 \\cdot (-8) \\equiv 4 \\pmod{15}$ and $x = -8 \\equiv 7$ solves $7x \\equiv 4 \\pmod{15}$.\n\n> **Watch out.** The solution comes from the coefficient of $a$, multiplied by $b$. The coefficient of $n$ only says which multiple of $n$ is added, and disappears modulo $n$.",
        "贝祖等式给出系数的一个同余于 1 的倍数，把它按比例放大就得到同余式的解。已知 $7 \\cdot (-2) + 15 \\cdot 1 = 1$，两边乘以 $4$：$7 \\cdot (-8) + 15 \\cdot 4 = 4$，所以 $7 \\cdot (-8) \\equiv 4 \\pmod{15}$，$x = -8 \\equiv 7$ 是 $7x \\equiv 4 \\pmod{15}$ 的解。\n\n> **注意。** 解来自 $a$ 的系数，再乘以 $b$。$n$ 的系数只说明加上了 $n$ 的哪个倍数，模 $n$ 时就消失了。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 40);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) !== 1);
        const [s, tt] = bezout(a, n);
        // With b = a the answer is x = 1, whatever the identity says.
        const b = rng.pick(range(2, n - 1).filter((v) => v !== a));
        const value = mod(s * b, n);
        const options = [mod(tt * b, n), mod(s + b, n), mod(-s * b, n), mod(s, n)];
        const key = (w: number) => `$x = ${w}$`;
        return reasoned(
          oneOf(
            rng,
            t(
              `Given $${a} \\cdot ${par(s)} + ${n} \\cdot ${par(tt)} = 1$, which residue solves $${cong(`${a === 1 ? "" : a}x`, b, n)}$?`,
              `已知 $${a} \\cdot ${par(s)} + ${n} \\cdot ${par(tt)} = 1$，哪个剩余是 $${cong(`${a === 1 ? "" : a}x`, b, n)}$ 的解？`,
            ),
            math(`x = ${value}`),
            options.filter((w) => w !== value).map((w) => math(`x = ${w}`)),
            walked(
              [
                [
                  ["Multiply the identity", "等式两边相乘"],
                  t(
                    `Multiply by $${b}$: $${a} \\cdot ${par(s * b)} + ${n} \\cdot ${par(tt * b)} = ${b}$.`,
                    `两边乘以 $${b}$：$${a} \\cdot ${par(s * b)} + ${n} \\cdot ${par(tt * b)} = ${b}$。`,
                  ),
                ],
                [
                  ["Read off x", "读出 x"],
                  t(
                    `Modulo $${n}$ the second term vanishes, so $x \\equiv ${reduced(s * b, value)} \\pmod{${n}}$.`,
                    `模 $${n}$ 时第二项消失，所以 $x \\equiv ${reduced(s * b, value)} \\pmod{${n}}$。`,
                  ),
                ],
              ],
              t(
                `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${Math.floor((a * value) / n)} + ${b}$.`,
                `$${a} \\cdot ${value} = ${a * value} = ${n} \\cdot ${Math.floor((a * value) / n)} + ${b}$。`,
              ),
            ),
          ),
          [
            [
              key(options[0]!),
              `That scales the coefficient of $${n}$; the solution comes from the coefficient of $${a}$.`,
              `这是放大了 $${n}$ 的系数；解来自 $${a}$ 的系数。`,
            ],
            [
              key(options[1]!),
              `That adds $${b}$ to the coefficient; multiply the identity by $${b}$ instead.`,
              `这是给系数加上 $${b}$；应当把等式乘以 $${b}$。`,
            ],
            [key(options[2]!), "That has the sign of the coefficient reversed.", "这把系数的符号弄反了。"],
            [
              key(options[3]!),
              `That solves $${a}x \\equiv 1$; multiply by $${b}$ to get $${b}$ on the right.`,
              `这解的是 $${a}x \\equiv 1$；乘以 $${b}$ 才能使右边是 $${b}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "proving-uniqueness-of-solutions",
      title: t("Proving uniqueness", "证明唯一性"),
      explanation: t(
        "If two solutions existed, the modulus would divide the coefficient times their difference, and coprimality forces it to divide the difference itself. Suppose $ax \\equiv b$ and $ay \\equiv b \\pmod{n}$ with $\\gcd(a, n) = 1$. Subtracting, $n \\mid a(x - y)$; since $n$ shares no factor with $a$, $n \\mid x - y$, so $x \\equiv y \\pmod{n}$.\n\n> **Watch out.** Cancelling $a$ from $n \\mid a(x - y)$ needs $\\gcd(a, n) = 1$. Otherwise only $n / \\gcd(a, n)$ is sure to divide $x - y$, and there can be several solutions modulo $n$.",
        "如果存在两个解，模就整除系数乘以它们的差，而互素性迫使模整除这个差本身。设 $ax \\equiv b$ 且 $ay \\equiv b \\pmod{n}$，$\\gcd(a, n) = 1$。相减得 $n \\mid a(x - y)$；由于 $n$ 与 $a$ 没有公因数，$n \\mid x - y$，所以 $x \\equiv y \\pmod{n}$。\n\n> **注意。** 从 $n \\mid a(x - y)$ 中约去 $a$ 需要 $\\gcd(a, n) = 1$。否则只能确定 $n / \\gcd(a, n)$ 整除 $x - y$，模 $n$ 可能有几个解。",
      ),
      generate(rng) {
        const n = rng.int(4, 30);
        const a0 = rng.int(2, 40);
        const a = a0 % n === 0 ? a0 + 1 : a0;
        const g = gcd(a, n);
        const coprime = g === 1;
        const equal: [string, string, string] = [
          "$x = y$",
          "Two solutions can be congruent without being equal; the conclusion is about $x - y$.",
          "两个解可以同余而不相等；结论说的是 $x - y$。",
        ];
        const reasons: Reason[] = coprime
          ? [
              equal,
              [
                `$${cong("x", "y", n * a)}$`,
                `Nothing forces $${n * a}$ to divide $x - y$; only $${n}$ is forced.`,
                `没有理由让 $${n * a}$ 整除 $x - y$；只能确定 $${n}$ 整除它。`,
              ],
              [
                `$${cong("x", 0, n)}$`,
                "Nothing says $x$ itself is a multiple of the modulus; the conclusion is about $x - y$.",
                "没有说明 $x$ 本身是模的倍数；结论说的是 $x - y$。",
              ],
            ]
          : [
              [
                `$${cong("x", "y", n)}$`,
                `$${a}$ and $${n}$ share the factor $${g}$, so only $${n / g}$ is sure to divide $x - y$.`,
                `$${a}$ 与 $${n}$ 有公因数 $${g}$，所以只能确定 $${n / g}$ 整除 $x - y$。`,
              ],
              equal,
              [
                `$${cong("x", "y", g)}$`,
                `The modulus left after cancelling is $${n} / ${g} = ${n / g}$, not $${g}$.`,
                `约去后剩下的模是 $${n} / ${g} = ${n / g}$，而不是 $${g}$。`,
              ],
            ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Suppose $${cong(`${a === 1 ? "" : a}x`, "b", n)}$ and $${cong(`${a}y`, "b", n)}$, so $${n} \\mid ${a}(x - y)$. What can we conclude?`,
              `设 $${cong(`${a === 1 ? "" : a}x`, "b", n)}$ 且 $${cong(`${a}y`, "b", n)}$，所以 $${n} \\mid ${a}(x - y)$。可以得出什么结论？`,
            ),
            coprime ? math(cong("x", "y", n)) : math(cong("x", "y", n / g)),
            coprime
              ? [math(`x = y`), math(cong("x", "y", n * a)), math(cong("x", 0, n))]
              : [math(cong("x", "y", n)), math(`x = y`), math(cong("x", "y", g))],
            walked(
              [
                [["Find the common factor", "求公因数"], t(`$\\gcd(${a}, ${n}) = ${g}$.`, `$\\gcd(${a}, ${n}) = ${g}$。`)],
                coprime
                  ? [
                      ["Cancel", "约去"],
                      t(
                        `$${n}$ shares no factor with $${a}$, so $${n} \\mid ${a}(x - y)$ gives $${n} \\mid x - y$: the solution is unique modulo $${n}$.`,
                        `$${n}$ 与 $${a}$ 没有公因数，所以由 $${n} \\mid ${a}(x - y)$ 得 $${n} \\mid x - y$：解模 $${n}$ 唯一。`,
                      ),
                    ]
                  : [
                      ["Divide by the common factor", "除以公因数"],
                      t(
                        `$${n / g} \\mid ${a / g}(x - y)$ with $\\gcd(${a / g}, ${n / g}) = 1$, so $${n / g} \\mid x - y$: solutions repeat modulo $${n / g}$, not $${n}$.`,
                        `$${n / g} \\mid ${a / g}(x - y)$，且 $\\gcd(${a / g}, ${n / g}) = 1$，所以 $${n / g} \\mid x - y$：解按模 $${n / g}$ 重复，而非模 $${n}$。`,
                      ),
                    ],
              ],
              coprime
                ? t(
                    `$${a}$ has the inverse $${inverseMod(a, n)}$ modulo $${n}$; multiplying $${a}x \\equiv ${a}y$ by it gives $x \\equiv y$ directly.`,
                    `$${a}$ 模 $${n}$ 有逆元 $${inverseMod(a, n)}$；把 $${a}x \\equiv ${a}y$ 乘以它直接得到 $x \\equiv y$。`,
                  )
                : t(
                    `$x = 0$ and $y = ${n / g}$ give $${a} \\cdot ${n / g} = ${(a * n) / g} = ${n} \\cdot ${a / g}$, a multiple of $${n}$, although $${n} \\nmid ${n / g}$.`,
                    `$x = 0$，$y = ${n / g}$ 给出 $${a} \\cdot ${n / g} = ${(a * n) / g} = ${n} \\cdot ${a / g}$，是 $${n}$ 的倍数，但 $${n} \\nmid ${n / g}$。`,
                  ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** methodsOfProofCongruenceTopics are the new topics of Methods of Proof unit 6. */
export const methodsOfProofCongruenceTopics: readonly TopicDef[] = [
  modularCongruence,
  theAdditionPropertyOfModularArithmetic,
  modularResidues,
  theMultiplicationPropertiesOfModularArithmetic,
  theDivisionPropertiesOfModularArithmetic,
  provingPropertiesOfModularCongruence,
  provingDivisibilityUsingCongruence,
  provingCongruenceByContrapositive,
  additiveInversesModuloN,
  multiplicativeInversesModuloN,
  solvingLinearCongruences,
  solvingAdvancedLinearCongruences,
  theChineseRemainderTheorem,
  provingPropertiesOfLinearCongruences,
];
