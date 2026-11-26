// Third knowledge points for thin topics of Methods of Proof, on induction, limits, cardinality,
// congruences and relations: the reverse question, a harder case or a common trap.
// See `deeperMethodsOfProofThird2Points`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { say, withMistakes } from "../problems.ts";
import { ask, choose, divisors, point, powMod, same } from "../university-kit.ts";
import { gcd, lcm } from "./deeper-methods-of-proof-third.ts";

/** pairs writes a list of ordered pairs. */
const pairs = (list: readonly (readonly [number, number])[]) => list.map(([a, b]) => `(${a}, ${b})`).join(", ");

const baseCaseMatters = point(
  "the-base-case-an-inductive-step-cannot-supply",
  ["The base case an inductive step cannot supply", "归纳步骤无法提供的基础情形"],
  [
    "An inductive step can succeed even when the claim is false, because it only passes truth along. For $d \\mid a^{n} + c$ with $d \\mid a - 1$, the step works for every $c$, so the base case alone decides which values of $c$ make the claim true.\n\n> **Watch out.** A working inductive step proves nothing on its own. Check the base case, which here needs $d \\mid a + c$, not $d \\mid c$.",
    "即使命题不成立，归纳步骤也可能成功，因为它只是传递真值。对于 $d \\mid a^{n} + c$，当 $d \\mid a - 1$ 时，归纳步骤对每个 $c$ 都成立，所以只有基础情形决定哪些 $c$ 使命题成立。\n\n> **注意。** 单靠成功的归纳步骤什么也证明不了。要检查基础情形，这里它要求 $d \\mid a + c$，而不是 $d \\mid c$。",
  ],
  (rng) => {
    const d = rng.int(2, 9);
    const a = d * rng.int(1, 3) + 1;
    const low = rng.int(5, 40);
    let c = low + 1;
    while ((a + c) % d !== 0) c++;
    const plain = low + 1 + ((d - ((low + 1) % d)) % d);
    const second = a * a + c;
    return withMistakes(
      ask(
        [
          `For which smallest integer $c > ${low}$ does $${d} \\mid ${a}^{n} + c$ hold for every positive integer $n$?`,
          `对于大于 $${low}$ 的哪个最小整数 $c$，$${d} \\mid ${a}^{n} + c$ 对每个正整数 $n$ 都成立？`,
        ],
        c,
        [c + d, plain === c ? c + 1 : plain, low + 1 === c ? c + 2 : low + 1],
        [
          `**Step 1: Check the inductive step.** $${a}^{k+1} + c = ${a}(${a}^{k} + c) - ${a - 1}c$, and $${d} \\mid ${a - 1}$, so the step holds for every $c$.\n\n**Step 2: Use the base case.** At $n = 1$ the claim needs $${d} \\mid ${a} + c$. The smallest such $c$ above $${low}$ is $${c}$, since $${a} + ${c} = ${a + c} = ${d} \\cdot ${(a + c) / d}$.\n\n**Check.** At $n = 2$: $${a}^{2} + ${c} = ${second} = ${d} \\cdot ${second / d}$.`,
          `**第一步：检查归纳步骤。** $${a}^{k+1} + c = ${a}(${a}^{k} + c) - ${a - 1}c$，且 $${d} \\mid ${a - 1}$，所以归纳步骤对每个 $c$ 都成立。\n\n**第二步：用基础情形。** $n = 1$ 时命题要求 $${d} \\mid ${a} + c$。大于 $${low}$ 的最小这样的 $c$ 是 $${c}$，因为 $${a} + ${c} = ${a + c} = ${d} \\cdot ${(a + c) / d}$。\n\n**检验。** $n = 2$ 时：$${a}^{2} + ${c} = ${second} = ${d} \\cdot ${second / d}$。`,
        ],
      ),
      sayApart(String(c), [
        say(
          String(plain),
          `That makes $c$ itself a multiple of $${d}$; the base case needs $${d} \\mid ${a} + c$.`,
          `这使 $c$ 本身是 $${d}$ 的倍数；而基础情形要求 $${d} \\mid ${a} + c$。`,
        ),
        say(
          String(low + 1),
          `The base case fails: $${a} + ${low + 1} = ${a + low + 1}$ is not a multiple of $${d}$.`,
          `基础情形不成立：$${a} + ${low + 1} = ${a + low + 1}$ 不是 $${d}$ 的倍数。`,
        ),
        say(String(c + d), `That works too, but $${d}$ less still lies above $${low}$.`, `它也成立，但再减 $${d}$ 仍大于 $${low}$。`),
      ]),
    );
  },
);

/** sayApart keeps the mistakes whose responses differ from the answer and from each other. */
function sayApart(answer: string, list: readonly ReturnType<typeof say>[]): ReturnType<typeof say>[] {
  const seen = new Set([answer]);
  return list.filter((m) => !seen.has(m.response) && Boolean(seen.add(m.response)));
}

const smallestNForNull = point(
  "the-exact-n-for-a-null-sequence",
  ["The exact N for a null sequence", "零序列的精确 N"],
  [
    "For a decreasing sequence, the definition of the limit can be solved exactly. The inequality $|a_{n}| < \\varepsilon$ is strict, so when the boundary value is a whole number, $N$ must be one more than it, since the boundary term only equals $\\varepsilon$. For $a_{n} = \\dfrac{3}{n + 2}$ and $\\varepsilon = \\dfrac{1}{10}$: $n + 2 > 30$, so $n > 28$ and $N = 29$.\n\n> **Watch out.** Keep the shift in the denominator: $n + 2 > 30$ gives $n > 28$, not $n > 30$. And the boundary index $28$, where the term equals $\\varepsilon$ exactly, is still too early.",
    "对于递减序列，极限的定义可以精确求解。不等式 $|a_{n}| < \\varepsilon$ 是严格的，所以当边界值是整数时，$N$ 必须比它大一，因为边界项只是等于 $\\varepsilon$。对 $a_{n} = \\dfrac{3}{n + 2}$ 与 $\\varepsilon = \\dfrac{1}{10}$：$n + 2 > 30$，所以 $n > 28$，$N = 29$。\n\n> **注意。** 别丢掉分母中的平移：$n + 2 > 30$ 给出 $n > 28$，而不是 $n > 30$。边界下标 $28$ 处的项恰好等于 $\\varepsilon$，仍然太早。",
  ],
  (rng) => {
    const c = rng.int(2, 9);
    const b = rng.int(1, 9);
    const m = rng.pick([10, 20, 50, 100, 200]);
    const edge = c * m - b;
    const answer = edge + 1;
    return withMistakes(
      ask(
        [
          `Let $a_{n} = \\dfrac{${c}}{n + ${b}}$ and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ with $|a_{n}| < \\varepsilon$ for all $n \\ge N$.`,
          `设 $a_{n} = \\dfrac{${c}}{n + ${b}}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使 $|a_{n}| < \\varepsilon$ 对所有 $n \\ge N$ 成立。`,
        ],
        answer,
        [edge, c * m + 1, c * m],
        [
          `**Step 1: Solve the inequality.** $\\dfrac{${c}}{n + ${b}} < \\dfrac{1}{${m}}$ means $n + ${b} > ${c * m}$, so $n > ${edge}$.\n\n**Step 2: Take the first index past it.** At $n = ${edge}$ the term equals $\\varepsilon$, and the terms keep decreasing, so the smallest $N$ is $${answer}$.\n\n**Check.** $a_{${answer}} = \\dfrac{${c}}{${c * m + 1}}$ is less than $\\dfrac{${c}}{${c * m}} = \\dfrac{1}{${m}}$, while $a_{${edge}} = \\dfrac{${c}}{${c * m}}$ equals it.`,
          `**第一步：解不等式。** $\\dfrac{${c}}{n + ${b}} < \\dfrac{1}{${m}}$ 即 $n + ${b} > ${c * m}$，所以 $n > ${edge}$。\n\n**第二步：取越过它的第一个下标。** 当 $n = ${edge}$ 时这一项等于 $\\varepsilon$，而各项继续减小，所以最小的 $N$ 是 $${answer}$。\n\n**检验。** $a_{${answer}} = \\dfrac{${c}}{${c * m + 1}}$ 小于 $\\dfrac{${c}}{${c * m}} = \\dfrac{1}{${m}}$，而 $a_{${edge}} = \\dfrac{${c}}{${c * m}}$ 恰好等于它。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(edge),
          "At that index the term equals $\\varepsilon$ exactly, and the inequality is strict.",
          "在这个下标处，这一项恰好等于 $\\varepsilon$，而不等式是严格的。",
        ),
        say(String(c * m + 1), `That drops the $+ ${b}$ in the denominator.`, `这丢掉了分母中的 $+ ${b}$。`),
        say(String(c * m), `That drops the $+ ${b}$ in the denominator.`, `这丢掉了分母中的 $+ ${b}$。`),
      ]),
    );
  },
);

const quadraticLimit = point(
  "the-n-for-a-quadratic-ratio",
  ["The N for a quadratic ratio", "二次比值的 N"],
  [
    "With squares on top and bottom, the distance to the limit is a constant over $n^{2} + c$. So the inequality gives a bound on $n^{2}$, and a square root appears in the answer for $N$. For $a_{n} = \\dfrac{2n^{2} + 7}{n^{2} + 1}$, which tends to $2$, the distance is $\\dfrac{5}{n^{2} + 1}$; with $\\varepsilon = \\dfrac{1}{10}$ we need $n^{2} > 49$, so $N = 8$.\n\n> **Watch out.** Solving gives a bound on $n^{2}$, not on $n$: take the square root, and since $n^{2}$ must exceed the bound strictly, a perfect square such as $49$ still needs the next integer.",
    "分子分母都有平方时，到极限的距离是一个常数除以 $n^{2} + c$。所以不等式给出 $n^{2}$ 的界，$N$ 的答案中出现平方根。对趋于 $2$ 的 $a_{n} = \\dfrac{2n^{2} + 7}{n^{2} + 1}$，距离是 $\\dfrac{5}{n^{2} + 1}$；取 $\\varepsilon = \\dfrac{1}{10}$，需要 $n^{2} > 49$，所以 $N = 8$。\n\n> **注意。** 解出来的是 $n^{2}$ 的界，而不是 $n$ 的界：要开平方。又因为 $n^{2}$ 必须严格大于这个界，像 $49$ 这样的完全平方数仍要取下一个整数。",
  ],
  (rng) => {
    const a = rng.int(2, 5);
    const c = rng.int(1, 9);
    let b = rng.int(1, 30);
    if (b === a * c) b += 1;
    const m = rng.pick([10, 20, 100]);
    const K = Math.abs(b - a * c);
    const bound = K * m - c;
    const answer = Math.floor(Math.sqrt(bound)) + 1;
    return withMistakes(
      ask(
        [
          `Let $a_{n} = \\dfrac{${a}n^{2} + ${b}}{n^{2} + ${c}}$, which tends to $${a}$, and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ with $|a_{n} - ${a}| < \\varepsilon$ for all $n \\ge N$.`,
          `设 $a_{n} = \\dfrac{${a}n^{2} + ${b}}{n^{2} + ${c}}$，它趋于 $${a}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使 $|a_{n} - ${a}| < \\varepsilon$ 对所有 $n \\ge N$ 成立。`,
        ],
        answer,
        [answer + 1, bound + 1, Math.floor(Math.sqrt(K * m)) + 1],
        [
          `**Step 1: Write the distance.** $a_{n} - ${a} = \\dfrac{${b} - ${a * c}}{n^{2} + ${c}}$, so $|a_{n} - ${a}| = \\dfrac{${K}}{n^{2} + ${c}}$.\n\n**Step 2: Solve for $n^{2}$.** $\\dfrac{${K}}{n^{2} + ${c}} < \\dfrac{1}{${m}}$ means $n^{2} + ${c} > ${K * m}$, so $n^{2} > ${bound}$.\n\n**Step 3: Take the square root.** The smallest positive integer with $n^{2} > ${bound}$ is $${answer}$, and the distance keeps decreasing after it.\n\n**Check.** $${answer}^{2} = ${answer * answer} > ${bound}$, while $${answer - 1}^{2} = ${(answer - 1) ** 2} \\le ${bound}$.`,
          `**第一步：写出距离。** $a_{n} - ${a} = \\dfrac{${b} - ${a * c}}{n^{2} + ${c}}$，所以 $|a_{n} - ${a}| = \\dfrac{${K}}{n^{2} + ${c}}$。\n\n**第二步：解出 $n^{2}$。** $\\dfrac{${K}}{n^{2} + ${c}} < \\dfrac{1}{${m}}$ 即 $n^{2} + ${c} > ${K * m}$，所以 $n^{2} > ${bound}$。\n\n**第三步：开平方。** 满足 $n^{2} > ${bound}$ 的最小正整数是 $${answer}$，此后距离继续减小。\n\n**检验。** $${answer}^{2} = ${answer * answer} > ${bound}$，而 $${answer - 1}^{2} = ${(answer - 1) ** 2} \\le ${bound}$。`,
        ],
      ),
      sayApart(String(answer), [
        say(String(bound + 1), "That is a bound on $n^{2}$; take the square root to find $N$.", "这是 $n^{2}$ 的界；开平方才得到 $N$。"),
        say(String(Math.floor(Math.sqrt(K * m)) + 1), `That drops the $+ ${c}$ in the denominator.`, `这丢掉了分母中的 $+ ${c}$。`),
      ]),
    );
  },
);

const quadraticInfinite = point(
  "the-n-for-a-sequence-that-dips-first",
  ["The N for a sequence that dips first", "先下降的序列的 N"],
  [
    "A sequence with an infinite limit need not increase from the start. For $n^{2} - bn$, the early terms fall before growing, and solving the quadratic inequality still gives the threshold, with the positive root marking where the terms stay above $M$. For $n^{2} - 4n > 60$: the roots of $n^{2} - 4n - 60$ are $-6$ and $10$, so $N = 11$.\n\n> **Watch out.** Solve the whole quadratic, not just $n^{2} > M$: the term $-bn$ pushes the threshold later. Only the positive root matters, since the indices are positive.",
    "极限为无穷的序列不一定从一开始就递增。对于 $n^{2} - bn$，前面的项会先下降再增长，解二次不等式仍能得到阈值，正根标出了此后各项一直高于 $M$ 的位置。对 $n^{2} - 4n > 60$：$n^{2} - 4n - 60$ 的根是 $-6$ 与 $10$，所以 $N = 11$。\n\n> **注意。** 要解整个二次不等式，而不只是 $n^{2} > M$：$-bn$ 这一项会把阈值推后。只有正根有用，因为下标是正的。",
  ],
  (rng) => {
    const b = rng.int(1, 12);
    const M = rng.int(50, 600);
    const f = (n: number) => n * n - b * n;
    let N = Math.ceil(Math.sqrt(M)) + b + 5;
    while (N > 1 && f(N - 1) > M) N--;
    const root = ((b + Math.sqrt(b * b + 4 * M)) / 2).toFixed(2);
    const expr = poly([1, "n^{2}"], [-b, "n"]);
    const plain = Math.floor(Math.sqrt(M)) + 1;
    return withMistakes(
      ask(
        [
          `Let $a_{n} = ${expr}$ and $M = ${M}$. Find the smallest positive integer $N$ such that $a_{n} > M$ for all $n \\ge N$.`,
          `设 $a_{n} = ${expr}$，$M = ${M}$。求最小的正整数 $N$，使 $a_{n} > M$ 对所有 $n \\ge N$ 成立。`,
        ],
        N,
        [N + 1, N - 1, plain],
        [
          `**Step 1: Find the positive root.** $${expr} - ${M} = 0$ has roots $\\dfrac{${b} \\pm \\sqrt{${b * b + 4 * M}}}{2}$, and the positive one is about $${root}$.\n\n**Step 2: Take the first integer past it.** Beyond the positive root the quadratic is positive and the terms keep growing, so the smallest $N$ is $${N}$.\n\n**Check.** $a_{${N}} = ${f(N)} > ${M}$, while $a_{${N - 1}} = ${f(N - 1)} \\le ${M}$.`,
          `**第一步：求正根。** $${expr} - ${M} = 0$ 的根是 $\\dfrac{${b} \\pm \\sqrt{${b * b + 4 * M}}}{2}$，正根约为 $${root}$。\n\n**第二步：取越过它的第一个整数。** 正根之后二次式为正，各项继续增大，所以最小的 $N$ 是 $${N}$。\n\n**检验。** $a_{${N}} = ${f(N)} > ${M}$，而 $a_{${N - 1}} = ${f(N - 1)} \\le ${M}$。`,
        ],
      ),
      sayApart(String(N), [
        say(String(N - 1), `There the term is $${f(N - 1)}$, which is not above $${M}$.`, `那里的项是 $${f(N - 1)}$，并不大于 $${M}$。`),
        say(
          String(plain),
          `That solves $n^{2} > ${M}$ and ignores the $-${b}n$ term.`,
          `这解的是 $n^{2} > ${M}$，忽略了 $-${b}n$ 这一项。`,
        ),
      ]),
    );
  },
);

const minusInfinity = point(
  "proving-a-limit-of-minus-infinity",
  ["Proving a limit of minus infinity", "证明极限为负无穷"],
  [
    "For a limit of $-\\infty$, the definition reverses: given any $M$, however negative, the terms must eventually stay below it. Solving the inequality involves dividing by a negative coefficient, which flips the inequality and gives a lower bound on $N$. For $5 - 2n < M$: $-2n < M - 5$, so $n > \\dfrac{5 - M}{2}$.\n\n> **Watch out.** Dividing by $-a$ flips the inequality. The result must be a lower bound on $n$, as for every limit as $n \\to \\infty$; an upper bound on $N$ cannot describe all large $n$.",
    "对于极限为 $-\\infty$，定义要反过来：给定任意 $M$，无论多么小，各项最终都必须低于它。解不等式时要除以负系数，不等号会翻转，从而得到 $N$ 的下界。对 $5 - 2n < M$：$-2n < M - 5$，所以 $n > \\dfrac{5 - M}{2}$。\n\n> **注意。** 除以 $-a$ 时不等号翻转。结果必须是 $n$ 的下界，对 $n \\to \\infty$ 的每个极限都是如此；$N$ 的上界无法描述所有大的 $n$。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(1, 30);
    const expr = poly([b, ""], [-a, "n"]);
    const right = same(`N > \\frac{${b} - M}{${a}}`);
    const swapped = same(`N > \\frac{M - ${b}}{${a}}`);
    const upper = same(`N < \\frac{${b} - M}{${a}}`);
    const plus = same(`N > \\frac{${b} + M}{${a}}`);
    const M0 = b - 10 * a;
    return withMistakes(
      choose(
        rng,
        [
          `To prove $${expr} \\to -\\infty$, given $M < ${b}$, which condition on $N$ ensures $a_{n} < M$ for all $n \\ge N$?`,
          `要证明 $${expr} \\to -\\infty$，给定 $M < ${b}$，$N$ 满足什么条件能保证 $a_{n} < M$ 对所有 $n \\ge N$ 成立？`,
        ],
        right,
        [swapped, upper, plus],
        [
          `**Step 1: Set up the inequality.** We need $${expr} < M$, that is $-${a}n < M - ${b}$.\n\n**Step 2: Divide by $-${a}$.** The inequality flips: $n > \\frac{${b} - M}{${a}}$. Taking $N$ above this value makes it hold for every $n \\ge N$.\n\n**Check.** For $M = ${M0}$ the bound is $\\frac{${b} - (${M0})}{${a}} = 10$, and indeed $a_{11} = ${b - 11 * a} < ${M0}$.`,
          `**第一步：列出不等式。** 需要 $${expr} < M$，即 $-${a}n < M - ${b}$。\n\n**第二步：除以 $-${a}$。** 不等号翻转：$n > \\frac{${b} - M}{${a}}$。取 $N$ 大于这个值，则对每个 $n \\ge N$ 都成立。\n\n**检验。** 当 $M = ${M0}$ 时，界为 $\\frac{${b} - (${M0})}{${a}} = 10$，而确实 $a_{11} = ${b - 11 * a} < ${M0}$。`,
        ],
      ),
      [
        say(
          swapped[0],
          `That has the sign of the numerator reversed: moving $${b}$ across gives $${b} - M$.`,
          `这里分子的符号反了：把 $${b}$ 移项得到 $${b} - M$。`,
        ),
        say(
          upper[0],
          "Dividing by the negative coefficient flips the inequality, and the result must be a lower bound on $n$.",
          "除以负系数时不等号翻转，结果必须是 $n$ 的下界。",
        ),
        say(plus[0], "Moving $M$ to the other side changes its sign.", "把 $M$ 移到另一边时要变号。"),
      ],
    );
  },
);

const missedResidues = point(
  "how-far-a-map-is-from-surjective",
  ["How far a map is from surjective", "映射离满射有多远"],
  [
    "A map is surjective when it misses nothing, and counting the missed elements measures the failure. For multiplication by $a$ on residues modulo $m$, the image is exactly the multiples of $\\gcd(a, m)$, so the map is surjective only when this greatest common divisor is one. For $f(x) = 4x$ on $\\mathbb{Z}_{6}$: $\\gcd(4, 6) = 2$, the image is $\\{0, 2, 4\\}$, and $3$ residues are missed.\n\n> **Watch out.** The image has $\\dfrac{m}{\\gcd(a, m)}$ elements, not $\\gcd(a, m)$ elements. The missed residues are the rest of the $m$ residues.",
    "映射不遗漏任何元素时是满射，计算遗漏的元素就能衡量它的不足。对模 $m$ 的剩余类乘以 $a$，像恰好是 $\\gcd(a, m)$ 的倍数，所以只有当这个最大公约数为一时才是满射。对 $\\mathbb{Z}_{6}$ 上的 $f(x) = 4x$：$\\gcd(4, 6) = 2$，像是 $\\{0, 2, 4\\}$，遗漏了 $3$ 个剩余类。\n\n> **注意。** 像有 $\\dfrac{m}{\\gcd(a, m)}$ 个元素，而不是 $\\gcd(a, m)$ 个。遗漏的是 $m$ 个剩余类中剩下的那些。",
  ],
  (rng) => {
    const m = rng.int(6, 40);
    const a = rng.int(2, m - 1);
    const g = gcd(a, m);
    const image = m / g;
    const answer = m - image;
    return withMistakes(
      ask(
        [
          `Let $f: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${m}}$ be $f(x) = ${a}x$. How many elements of the codomain are not in the image of $f$?`,
          `设 $f: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${m}}$，$f(x) = ${a}x$。陪域中有多少个元素不在 $f$ 的像中？`,
        ],
        answer,
        [image, g, m - g],
        [
          `**Step 1: Find the image.** $\\gcd(${a}, ${m}) = ${g}$, so the image is the set of multiples of $${g}$ in $\\mathbb{Z}_{${m}}$, which has $\\dfrac{${m}}{${g}} = ${image}$ elements.\n\n**Step 2: Count the rest.** $${m} - ${image} = ${answer}$ elements are missed.\n\n**Check.** Every output $${a}x$ is a multiple of $${g}$ modulo $${m}$, and the multiples $0, ${g}, \\dots, ${m - g}$ number $${image}$, so the other $${answer}$ residues are never reached.`,
          `**第一步：求像。** $\\gcd(${a}, ${m}) = ${g}$，所以像是 $\\mathbb{Z}_{${m}}$ 中 $${g}$ 的倍数组成的集合，有 $\\dfrac{${m}}{${g}} = ${image}$ 个元素。\n\n**第二步：数剩下的。** 遗漏了 $${m} - ${image} = ${answer}$ 个元素。\n\n**检验。** 每个输出 $${a}x$ 模 $${m}$ 都是 $${g}$ 的倍数，而倍数 $0, ${g}, \\dots, ${m - g}$ 共 $${image}$ 个，所以其余 $${answer}$ 个剩余类永远取不到。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(image),
          "That is the size of the image; the question asks how many residues it misses.",
          "这是像的大小；题目问的是遗漏了多少个剩余类。",
        ),
        say(
          String(g),
          "The greatest common divisor says which residues are reached, its multiples, not how many are missed.",
          "最大公约数说明哪些剩余类能取到（它的倍数），而不是遗漏了多少个。",
        ),
        say(
          String(m - g),
          `The image has $\\frac{${m}}{${g}}$ elements, not $${g}$.`,
          `像有 $\\frac{${m}}{${g}}$ 个元素，而不是 $${g}$ 个。`,
        ),
      ]),
    );
  },
);

const cantorPairing = point(
  "the-cantor-pairing-function",
  ["The Cantor pairing function", "康托尔配对函数"],
  [
    "The formula $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$ numbers the pairs of naturals along diagonals. It is a bijection from $\\mathbb{N} \\times \\mathbb{N}$ onto $\\mathbb{N}$, which shows that a product of two countable sets is countable. The triangular number counts the earlier diagonals. For $(2, 1)$: $\\frac{3 \\cdot 4}{2} + 1 = 7$.\n\n> **Watch out.** Halve the product $(x + y)(x + y + 1)$, and add $y$, the second entry, for the position along the diagonal, not $x$.",
    "公式 $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$ 沿对角线给自然数对编号。它是从 $\\mathbb{N} \\times \\mathbb{N}$ 到 $\\mathbb{N}$ 的双射，说明两个可数集的乘积是可数的。其中的三角形数计算前面各条对角线上的点数。对 $(2, 1)$：$\\frac{3 \\cdot 4}{2} + 1 = 7$。\n\n> **注意。** 乘积 $(x + y)(x + y + 1)$ 要除以二，沿对角线的位置加的是第二个分量 $y$，而不是 $x$。",
  ],
  (rng) => {
    const x = rng.int(0, 14);
    const y = rng.int(0, 14);
    const s = x + y;
    const tri = (s * (s + 1)) / 2;
    const answer = tri + y;
    return withMistakes(
      ask(
        [
          `The bijection $\\pi: \\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$ is $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$. Find $\\pi(${x}, ${y})$.`,
          `双射 $\\pi: \\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$ 为 $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$。求 $\\pi(${x}, ${y})$。`,
        ],
        answer,
        [tri, tri + x, s * (s + 1) + y],
        [
          `**Step 1: Count the earlier diagonals.** $x + y = ${s}$, so the earlier diagonals contain $\\frac{${s} \\cdot ${s + 1}}{2} = ${tri}$ pairs.\n\n**Step 2: Move along the diagonal.** Adding $y = ${y}$ gives $${answer}$.\n\n**Check.** The diagonal $x + y = ${s}$ runs from position $${tri}$ at $(${s}, 0)$ to position $${tri + s}$ at $(0, ${s})$, and $${answer}$ lies in that range.`,
          `**第一步：数前面的对角线。** $x + y = ${s}$，所以前面的对角线共有 $\\frac{${s} \\cdot ${s + 1}}{2} = ${tri}$ 个数对。\n\n**第二步：沿对角线移动。** 加上 $y = ${y}$，得 $${answer}$。\n\n**检验。** 对角线 $x + y = ${s}$ 从位置 $${tri}$ 的 $(${s}, 0)$ 到位置 $${tri + s}$ 的 $(0, ${s})$，而 $${answer}$ 在这个范围内。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(tri),
          "That is where the diagonal starts; add $y$ for the position along it.",
          "这是对角线的起点；还要加上 $y$ 才是沿对角线的位置。",
        ),
        say(String(tri + x), "That adds $x$; the position along the diagonal grows with $y$.", "这加的是 $x$；沿对角线的位置随 $y$ 增大。"),
        say(
          String(s * (s + 1) + y),
          "That forgets to halve the product $(x + y)(x + y + 1)$.",
          "这忘了把乘积 $(x + y)(x + y + 1)$ 除以二。",
        ),
      ]),
    );
  },
);

const intervalRayInverse = point(
  "inverting-a-bijection-onto-a-ray",
  ["Inverting a bijection onto a ray", "求到射线的双射的逆"],
  [
    "The map $f(x) = \\frac{x - a}{b - x}$ sends $(a, b)$ onto $(0, \\infty)$. Finding the input for a given output proves surjectivity, and solving the equation gives $x = \\frac{a + by}{1 + y}$, which always lies between $a$ and $b$ when $y$ is positive. For $(0, 2)$ and $y = 3$: $x = \\frac{6}{4} = \\frac{3}{2}$.\n\n> **Watch out.** Multiply out $y(b - x)$ before collecting the $x$ terms. Both $x$ and $yx$ end up on one side, which gives the factor $1 + y$, not $y$.",
    "映射 $f(x) = \\frac{x - a}{b - x}$ 把 $(a, b)$ 映到 $(0, \\infty)$ 上。求给定输出对应的输入就能证明满射性，解方程得 $x = \\frac{a + by}{1 + y}$，当 $y$ 为正时它总在 $a$ 与 $b$ 之间。对 $(0, 2)$ 与 $y = 3$：$x = \\frac{6}{4} = \\frac{3}{2}$。\n\n> **注意。** 先把 $y(b - x)$ 展开，再合并含 $x$ 的项。$x$ 与 $yx$ 都移到同一边，得到因子 $1 + y$，而不是 $y$。",
  ],
  (rng) => {
    const a = rng.int(-9, 9);
    const b = a + rng.int(1, 9);
    const y = rng.int(1, 12);
    const answer = Q.of(a + b * y, 1 + y);
    const top = poly([1, "x"], [-a, ""]);
    const bottom = poly([b, ""], [-1, "x"]);
    const fx = `\\dfrac{${top}}{${bottom}}`;
    const swapped = Q.of(b + a * y, 1 + y);
    const rhs = `${a} ${b * y < 0 ? "-" : "+"} ${Math.abs(b * y)}`;
    const noOne = Q.of(a + b * y, y);
    return withMistakes(
      ask(
        [
          `The function $f(x) = ${fx}$ is a bijection from $(${a}, ${b})$ onto $(0, \\infty)$. Find the $x$ with $f(x) = ${y}$.`,
          `函数 $f(x) = ${fx}$ 是从 $(${a}, ${b})$ 到 $(0, \\infty)$ 的双射。求满足 $f(x) = ${y}$ 的 $x$。`,
        ],
        answer,
        [swapped, noOne, Q.of(a + y, 1 + y)],
        [
          `**Step 1: Clear the fraction.** $f(x) = ${y}$ gives $${top} = ${y}(${bottom})$.\n\n**Step 2: Collect the $x$ terms.** $x + ${y}x = ${rhs}$, so $${1 + y}x = ${a + b * y}$ and $x = ${answer.toLatex()}$, which lies inside the interval.\n\n**Check.** $${top} = \\dfrac{${y * (b - a)}}{${1 + y}}$ and $${b} - x = \\dfrac{${b - a}}{${1 + y}}$, whose ratio is $${y}$.`,
          `**第一步：去分母。** $f(x) = ${y}$ 给出 $${top} = ${y}(${bottom})$。\n\n**第二步：合并含 $x$ 的项。** $x + ${y}x = ${rhs}$，所以 $${1 + y}x = ${a + b * y}$，$x = ${answer.toLatex()}$，它在区间内。\n\n**检验。** $${top} = \\dfrac{${y * (b - a)}}{${1 + y}}$，$${b} - x = \\dfrac{${b - a}}{${1 + y}}$，两者之比为 $${y}$。`,
        ],
      ),
      sayApart(answer.toLatex(), [
        say(
          swapped.toLatex(),
          "That swaps the roles of the two endpoints; the output $y$ multiplies the right endpoint.",
          "这把两个端点的作用弄反了；输出 $y$ 乘的是右端点。",
        ),
        say(
          noOne.toLatex(),
          "That loses the $x$ on the left: the $x$ terms give $(1 + y)x$.",
          "这丢了左边的 $x$：含 $x$ 的项合起来是 $(1 + y)x$。",
        ),
      ]),
    );
  },
);

const diagonalDistance = point(
  "how-the-diagonal-sequence-differs-from-a-row",
  ["How the diagonal sequence differs from a row", "对角序列与某一行的差异"],
  [
    "The diagonal sequence is built to differ from the $k$-th row at position $k$. It may differ at other positions too, but this one guaranteed position is all that the argument uses, and it works for every row in the list at once. For rows $s_{1} = 01$, $s_{2} = 11$: the diagonal is $0, 1$, flipped $d = 10$, which differs from $s_{1}$ in both positions.\n\n> **Watch out.** Flip the diagonal digits before comparing. Position $k$ always differs from $s_{k}$, but other positions may differ too, so compare every digit.",
    "对角序列的构造保证它与第 $k$ 行在第 $k$ 位不同。它也可能在其他位置不同，但论证只用到这个有保证的位置，并且它同时对列表中的每一行都有效。对 $s_{1} = 01$，$s_{2} = 11$：对角线是 $0, 1$，翻转后 $d = 10$，它与 $s_{1}$ 两位都不同。\n\n> **注意。** 先翻转对角线数字再比较。第 $k$ 位一定与 $s_{k}$ 不同，但其他位置也可能不同，所以要逐位比较。",
  ],
  (rng) => {
    const rows = [0, 1, 2, 3, 4].map(() => [0, 1, 2, 3, 4].map(() => rng.int(0, 1)));
    const diagonal = rows.map((r, i) => 1 - (r[i] as number));
    const k = rng.int(0, 4);
    const row = rows[k] as number[];
    const differ = [0, 1, 2, 3, 4].filter((i) => diagonal[i] !== row[i]).map((i) => i + 1);
    const answer = differ.length;
    const list = rows.map((r, i) => `s_{${i + 1}} = ${r.join("")}`).join(",\\ ");
    return withMistakes(
      ask(
        [
          `Let $${list}$. Let $d$ be the sequence obtained by flipping the diagonal digits. In how many of the $5$ positions does $d$ differ from $s_{${k + 1}}$?`,
          `设 $${list}$。令 $d$ 为翻转对角线上的数字得到的序列。$d$ 与 $s_{${k + 1}}$ 在 $5$ 个位置中有多少个不同？`,
        ],
        answer,
        [(answer + 1) % 6, (answer + 2) % 6, (answer + 3) % 6],
        [
          `**Step 1: Flip the diagonal.** The diagonal digits are $${rows.map((r, i) => r[i]).join("")}$, so $d = ${diagonal.join("")}$.\n\n**Step 2: Compare with $s_{${k + 1}} = ${row.join("")}$.** They differ in positions $${differ.join(", ")}$: $${answer}$ positions.\n\n**Check.** Position $${k + 1}$ is among them, as the construction guarantees: $s_{${k + 1}}$ has $${row[k]}$ there and $d$ has $${diagonal[k]}$.`,
          `**第一步：翻转对角线。** 对角线数字是 $${rows.map((r, i) => r[i]).join("")}$，所以 $d = ${diagonal.join("")}$。\n\n**第二步：与 $s_{${k + 1}} = ${row.join("")}$ 比较。** 它们在第 $${differ.join(", ")}$ 位不同：共 $${answer}$ 处。\n\n**检验。** 第 $${k + 1}$ 位在其中，这是构造所保证的：$s_{${k + 1}}$ 在那里是 $${row[k]}$，$d$ 是 $${diagonal[k]}$。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(5 - answer),
          "That compares the diagonal before flipping it; flip each diagonal digit first.",
          "这是用翻转前的对角线比较的；要先翻转每个对角线数字。",
        ),
        say(
          "1",
          "Only position $k$ is guaranteed to differ, but other positions may differ too: compare every digit.",
          "只有第 $k$ 位保证不同，但其他位置也可能不同：要逐位比较。",
        ),
      ]),
    );
  },
);

const injectionScale = point(
  "scaling-an-injection-into-an-open-interval",
  ["Scaling an injection into an open interval", "把单射缩放到开区间内"],
  [
    "To apply the Cantor-Bernstein-Schroder theorem, an injection often has to fit a closed interval into an open one. Shifting away from an endpoint and dividing by a large enough number does this, since a linear map with nonzero slope is injective. For $[0, 3]$ and $x \\mapsto \\frac{x + 1}{q}$: the largest output is $\\frac{4}{q}$, so $q = 5$ is the smallest that fits.\n\n> **Watch out.** The largest input gives the largest output, and it must be strictly below $1$. With $q$ equal to the largest numerator, the endpoint lands on $1$, which the open interval does not contain.",
    "应用康托尔-伯恩斯坦-施罗德定理时，常常要把闭区间单射到开区间内。先从端点移开，再除以足够大的数就能做到，因为斜率不为零的线性映射是单射。对 $[0, 3]$ 与 $x \\mapsto \\frac{x + 1}{q}$：最大输出是 $\\frac{4}{q}$，所以最小可行的是 $q = 5$。\n\n> **注意。** 最大的输入给出最大的输出，它必须严格小于 $1$。若 $q$ 等于最大的分子，端点就落在 $1$ 上，而开区间不包含 $1$。",
  ],
  (rng) => {
    const c = rng.int(1, 20);
    const p = rng.int(1, 20);
    const answer = c + p + 1;
    return withMistakes(
      ask(
        [
          `For which smallest positive integer $q$ does $x \\mapsto \\dfrac{x + ${p}}{q}$ map $[0, ${c}]$ injectively into $(0, 1)$?`,
          `当最小的正整数 $q$ 取何值时，$x \\mapsto \\dfrac{x + ${p}}{q}$ 把 $[0, ${c}]$ 单射到 $(0, 1)$ 内？`,
        ],
        answer,
        [c + p, p + 1, c + 1],
        [
          `**Step 1: Check injectivity.** The map is linear with slope $\\frac{1}{q} > 0$, so it is injective for every $q$.\n\n**Step 2: Fit the outputs.** The outputs run from $\\frac{${p}}{q} > 0$ up to $\\frac{${c + p}}{q}$, which must be below $1$, so $q > ${c + p}$ and the smallest choice is $${answer}$.\n\n**Check.** $\\frac{${c + p}}{${answer}} < 1$, while $q = ${c + p}$ would send $${c}$ to $\\frac{${c + p}}{${c + p}} = 1$, outside $(0, 1)$.`,
          `**第一步：检验单射。** 这个映射是斜率为 $\\frac{1}{q} > 0$ 的线性映射，所以对每个 $q$ 都是单射。\n\n**第二步：让输出落进去。** 输出从 $\\frac{${p}}{q} > 0$ 到 $\\frac{${c + p}}{q}$，后者必须小于 $1$，所以 $q > ${c + p}$，最小取 $${answer}$。\n\n**检验。** $\\frac{${c + p}}{${answer}} < 1$，而 $q = ${c + p}$ 会把 $${c}$ 映到 $\\frac{${c + p}}{${c + p}} = 1$，不在 $(0, 1)$ 中。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(c + p),
          `Then $${c}$ goes to exactly $1$, which the open interval does not contain.`,
          `那样 $${c}$ 恰好映到 $1$，而开区间不包含 $1$。`,
        ),
        say(
          String(p + 1),
          `That ignores the length of the interval: the input $${c}$ gives the numerator $${c + p}$.`,
          `这忽略了区间的长度：输入 $${c}$ 给出分子 $${c + p}$。`,
        ),
        say(String(c + 1), `That ignores the shift $${p}$ in the numerator.`, `这忽略了分子中的平移 $${p}$。`),
      ]),
    );
  },
);

const missedSubsets = point(
  "how-many-subsets-a-map-must-miss",
  ["How many subsets a map must miss", "映射必定遗漏多少子集"],
  [
    "Cantor's theorem says that no map from a set to its power set is surjective. For a finite set, this can be counted: an $n$-element set has $2^{n}$ subsets, and a map hits only as many subsets as it has distinct values, which is at most $n$. For $n = 3$ and a map with $2$ values: $8 - 2 = 6$ subsets are missed.\n\n> **Watch out.** The power set has $2^{n}$ elements, not $2n$. The image has as many subsets as the map has different values, which can be fewer than $n$.",
    "康托尔定理说，从一个集合到它的幂集不存在满射。对有限集可以具体计数：$n$ 元集有 $2^{n}$ 个子集，而映射能取到的子集数等于它的不同值的个数，至多为 $n$。对 $n = 3$ 且映射取 $2$ 个值：遗漏 $8 - 2 = 6$ 个子集。\n\n> **注意。** 幂集有 $2^{n}$ 个元素，而不是 $2n$ 个。像中的子集个数等于映射不同值的个数，可能少于 $n$。",
  ],
  (rng) => {
    const n = rng.int(3, 9);
    const j = rng.int(1, n);
    const answer = 2 ** n - j;
    return withMistakes(
      ask(
        [
          `A map $f: A \\to \\mathcal{P}(A)$ on a set with $${n}$ elements takes exactly $${j}$ different values. How many subsets of $A$ are not in its image?`,
          `$${n}$ 元集 $A$ 上的映射 $f: A \\to \\mathcal{P}(A)$ 恰好取 $${j}$ 个不同的值。$A$ 有多少个子集不在它的像中？`,
        ],
        answer,
        [2 ** n - n, n - j, 2 * n - j],
        [
          `**Step 1: Count the subsets.** A set with $${n}$ elements has $2^{${n}} = ${2 ** n}$ subsets.\n\n**Step 2: Remove the image.** The image contains $${j}$ of them, so $${2 ** n} - ${j} = ${answer}$ are missed.\n\n**Check.** $${j} \\le ${n} < ${2 ** n}$, so at least one subset is missed, as Cantor's theorem requires.`,
          `**第一步：数子集。** $${n}$ 元集有 $2^{${n}} = ${2 ** n}$ 个子集。\n\n**第二步：去掉像。** 像包含其中 $${j}$ 个，所以遗漏了 $${2 ** n} - ${j} = ${answer}$ 个。\n\n**检验。** $${j} \\le ${n} < ${2 ** n}$，所以至少遗漏一个子集，正如康托尔定理所要求的。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(2 ** n - n),
          `The map takes $${j}$ different values, so its image has $${j}$ subsets, not $${n}$.`,
          `映射取 $${j}$ 个不同的值，所以像中有 $${j}$ 个子集，而不是 $${n}$ 个。`,
        ),
        say(String(2 * n - j), "The power set has $2^{n}$ elements, not $2n$.", "幂集有 $2^{n}$ 个元素，而不是 $2n$ 个。"),
        say(
          String(n - j),
          "Subtract from the number of subsets, $2^{n}$, not from the number of elements.",
          "要从子集个数 $2^{n}$ 中减，而不是从元素个数中减。",
        ),
      ]),
    );
  },
);

const linearCombination = point(
  "a-linear-combination-of-congruences",
  ["A linear combination of congruences", "同余式的线性组合"],
  [
    "Congruences can be multiplied by constants and added or subtracted, so a whole linear combination can be reduced using only the remainders. A subtraction may give a negative value, and then a multiple of the modulus must be added to bring it into the standard range.\n\n> **Watch out.** A negative value is not yet a remainder. Add a multiple of the modulus to it, rather than dropping its minus sign.",
    "同余式可以乘以常数并相加或相减，所以整个线性组合只需用余数来化简。减法可能得到负值，这时要加上模的倍数，把它变到标准范围内。\n\n> **注意。** 负值还不是余数。要给它加上模的倍数，而不是去掉负号。",
  ],
  (rng) => {
    const m = rng.int(5, 15);
    let r: number;
    let s: number;
    let k: number;
    let l: number;
    // A combination that vanishes before any reduction, or reduces to zero, says little.
    do {
      r = rng.int(1, m - 1);
      s = rng.int(1, m - 1);
      k = rng.int(2, 6);
      l = rng.int(2, 6);
    } while ((k * r - l * s) % m === 0);
    const raw = k * r - l * s;
    const answer = ((raw % m) + m) % m;
    const q = Math.floor(raw / m);
    const shown = raw < 0 ? `(${raw})` : String(raw);
    const times = q < 0 ? `(${q})` : String(q);
    return withMistakes(
      ask(
        [
          `Suppose $a \\equiv ${r} \\pmod{${m}}$ and $b \\equiv ${s} \\pmod{${m}}$. Find the remainder $x$ with $0 \\le x < ${m}$ and $${k}a - ${l}b \\equiv x \\pmod{${m}}$.`,
          `设 $a \\equiv ${r} \\pmod{${m}}$，$b \\equiv ${s} \\pmod{${m}}$。求满足 $0 \\le x < ${m}$ 且 $${k}a - ${l}b \\equiv x \\pmod{${m}}$ 的余数 $x$。`,
        ],
        answer,
        [(k * r + l * s) % m, Math.abs(raw) % m, (((r - s) % m) + m) % m],
        [
          `**Step 1: Substitute the remainders.** $${k} \\cdot ${r} - ${l} \\cdot ${s} = ${k * r} - ${l * s} = ${raw}$.\n\n**Step 2: Reduce.** $${raw} = ${m} \\cdot ${times} + ${answer}$, so the remainder is $${answer}$.\n\n**Check.** $${answer} - ${shown} = ${answer - raw} = ${m} \\cdot ${-q}$, a multiple of $${m}$, and $0 \\le ${answer} < ${m}$.`,
          `**第一步：代入余数。** $${k} \\cdot ${r} - ${l} \\cdot ${s} = ${k * r} - ${l * s} = ${raw}$。\n\n**第二步：化简。** $${raw} = ${m} \\cdot ${times} + ${answer}$，所以余数是 $${answer}$。\n\n**检验。** $${answer} - ${shown} = ${answer - raw} = ${m} \\cdot ${-q}$，是 $${m}$ 的倍数，且 $0 \\le ${answer} < ${m}$。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String((k * r + l * s) % m),
          `That adds the two terms; the combination subtracts $${l}b$.`,
          `这是把两项相加；组合中是减去 $${l}b$。`,
        ),
        say(
          String(Math.abs(raw) % m),
          `That drops the minus sign of $${raw}$; add a multiple of $${m}$ instead.`,
          `这是去掉了 $${raw}$ 的负号；应加上 $${m}$ 的倍数。`,
        ),
        say(String((((r - s) % m) + m) % m), `That leaves out the coefficients $${k}$ and $${l}$.`, `这漏掉了系数 $${k}$ 和 $${l}$。`),
      ]),
    );
  },
);

const twoCancellations = point(
  "combining-two-cancellations",
  ["Combining two cancellations", "结合两次约分"],
  [
    "Cancelling $k$ from a congruence divides the modulus by $\\gcd(k, m)$. Two different cancellations give two moduli, and a number congruent under both is congruent under their least common multiple, so the two facts together are stronger than either one alone.\n\n> **Watch out.** Combine the two moduli by their least common multiple, not their product, and keep both rather than only the larger one.",
    "从同余式中约去 $k$ 时，模要除以 $\\gcd(k, m)$。两次不同的约分给出两个模，在两者下都同余的数在它们的最小公倍数下也同余，所以两个事实合起来比单独任何一个都强。\n\n> **注意。** 两个模要取最小公倍数来合并，而不是取乘积，并且两个都要用上，不能只取较大的那个。",
  ],
  (rng) => {
    let m: number;
    let k1: number;
    let k2: number;
    let m1: number;
    let m2: number;
    // Neither congruence alone may give what the two give together.
    do {
      m = rng.pick([12, 18, 24, 30, 36, 40, 42, 48, 60, 72]);
      k1 = rng.int(2, 15);
      k2 = rng.int(2, 15);
      m1 = m / gcd(k1, m);
      m2 = m / gcd(k2, m);
    } while (m1 % m2 === 0 || m2 % m1 === 0);
    const answer = lcm(m1, m2);
    return withMistakes(
      ask(
        [
          `Suppose $${k1}a \\equiv ${k1}b \\pmod{${m}}$ and $${k2}a \\equiv ${k2}b \\pmod{${m}}$. What is the largest $n$ for which $a \\equiv b \\pmod{n}$ must hold?`,
          `设 $${k1}a \\equiv ${k1}b \\pmod{${m}}$，$${k2}a \\equiv ${k2}b \\pmod{${m}}$。使 $a \\equiv b \\pmod{n}$ 必定成立的最大 $n$ 是多少？`,
        ],
        answer,
        [m1, m2, m1 * m2 === answer ? m + 1 : m1 * m2],
        [
          `**Step 1: Cancel each factor.** $\\gcd(${k1}, ${m}) = ${gcd(k1, m)}$ and $\\gcd(${k2}, ${m}) = ${gcd(k2, m)}$, so the two congruences give $a \\equiv b \\pmod{${m1}}$ and $a \\equiv b \\pmod{${m2}}$.\n\n**Step 2: Combine the moduli.** $a - b$ is a multiple of both $${m1}$ and $${m2}$, so of $\\operatorname{lcm}(${m1}, ${m2}) = ${answer}$.\n\n**Check.** $${answer} = ${m1} \\cdot ${answer / m1} = ${m2} \\cdot ${answer / m2}$, and $${answer}$ divides $${m}$, as a modulus got by cancelling must.`,
          `**第一步：分别约分。** $\\gcd(${k1}, ${m}) = ${gcd(k1, m)}$，$\\gcd(${k2}, ${m}) = ${gcd(k2, m)}$，所以两个同余式分别给出 $a \\equiv b \\pmod{${m1}}$ 和 $a \\equiv b \\pmod{${m2}}$。\n\n**第二步：合并模。** $a - b$ 既是 $${m1}$ 的倍数，又是 $${m2}$ 的倍数，所以是 $\\operatorname{lcm}(${m1}, ${m2}) = ${answer}$ 的倍数。\n\n**检验。** $${answer} = ${m1} \\cdot ${answer / m1} = ${m2} \\cdot ${answer / m2}$，且 $${answer}$ 整除 $${m}$，约分得到的模必须如此。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(m1),
          `That uses only the first congruence; the second also gives modulus $${m2}$.`,
          `这只用了第一个同余式；第二个还给出模 $${m2}$。`,
        ),
        say(
          String(m2),
          `That uses only the second congruence; the first also gives modulus $${m1}$.`,
          `这只用了第二个同余式；第一个还给出模 $${m1}$。`,
        ),
        say(
          String(m1 * m2),
          `$${m1}$ and $${m2}$ share the factor $${gcd(m1, m2)}$, so they combine to their least common multiple, not their product.`,
          `$${m1}$ 和 $${m2}$ 有公因数 $${gcd(m1, m2)}$，所以合并得到最小公倍数，而不是乘积。`,
        ),
      ]),
    );
  },
);

const powerResidue = point(
  "a-power-of-a-large-number-modulo-m",
  ["A power of a large number modulo m", "大数的幂模 m"],
  [
    "Induction on the multiplication property proves that $a \\equiv b \\pmod{m}$ implies $a^{n} \\equiv b^{n} \\pmod{m}$. So a large base can be replaced by its remainder before the power is taken, and the result can be reduced after each multiplication.\n\n> **Watch out.** Only the base is replaced by its remainder; the exponent stays. Raise the remainder to the power instead of multiplying it by the exponent.",
    "对乘法性质用归纳法可证 $a \\equiv b \\pmod{m}$ 蕴涵 $a^{n} \\equiv b^{n} \\pmod{m}$。所以取幂之前可以把大底数换成它的余数，每次相乘后还能把结果化简。\n\n> **注意。** 只有底数换成余数，指数不变。要求余数的幂，而不是把余数乘以指数。",
  ],
  (rng) => {
    const m = rng.int(5, 15);
    const r = rng.int(2, m - 1);
    const a = m * rng.int(3, 40) + r;
    const n = rng.int(2, 6);
    const answer = powMod(r, n, m);
    const powers = Array.from({ length: n }, (_, i) => `$$${r}^{${i + 1}} \\equiv ${powMod(r, i + 1, m)}$$`);
    const whole = r ** n;
    return withMistakes(
      ask(
        [`Find the remainder when $${a}^{${n}}$ is divided by $${m}$.`, `求 $${a}^{${n}}$ 除以 $${m}$ 的余数。`],
        answer,
        [r, (r * n) % m, (a * n) % m],
        [
          `**Step 1: Reduce the base.** $${a} = ${m} \\cdot ${(a - r) / m} + ${r}$, so $${a} \\equiv ${r}$ and $${a}^{${n}} \\equiv ${r}^{${n}} \\pmod{${m}}$.\n\n**Step 2: Multiply and reduce.** Multiplying by $${r}$ and reducing modulo $${m}$ at each step:\n\n${powers.join("\n\n")}\n\nSo the remainder is $${answer}$.\n\n**Check.** $${r}^{${n}} = ${whole} = ${m} \\cdot ${(whole - answer) / m} + ${answer}$.`,
          `**第一步：化简底数。** $${a} = ${m} \\cdot ${(a - r) / m} + ${r}$，所以 $${a} \\equiv ${r}$，$${a}^{${n}} \\equiv ${r}^{${n}} \\pmod{${m}}$。\n\n**第二步：相乘并化简。** 每步乘以 $${r}$ 并模 $${m}$ 化简：\n\n${powers.join("\n\n")}\n\n所以余数是 $${answer}$。\n\n**检验。** $${r}^{${n}} = ${whole} = ${m} \\cdot ${(whole - answer) / m} + ${answer}$。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(r),
          `That is the remainder of the base alone; it still has to be raised to the power $${n}$.`,
          `这只是底数的余数；还要求它的 $${n}$ 次幂。`,
        ),
        say(
          String((r * n) % m),
          `That multiplies the remainder by $${n}$ instead of raising it to the power $${n}$.`,
          `这是把余数乘以 $${n}$，而不是求它的 $${n}$ 次幂。`,
        ),
      ]),
    );
  },
);

const contrapositiveValue = point(
  "the-residue-that-makes-a-contrapositive-true",
  ["The residue that makes a contrapositive true", "使逆否命题成立的余数"],
  [
    "A claim about non-congruence is usually easier in contrapositive form, where it is a direct calculation. To make such a claim true, work out what the contrapositive requires: if $n \\equiv s$, then $n^{2} \\equiv s^{2}$, and this value decides the residue.\n\n> **Watch out.** The residue $r$ belongs to $n^{2}$, not to $n$: square $s$ and then reduce the square into the range from $0$ to $m - 1$.",
    "关于不同余的命题，用逆否形式通常更容易，这时只需直接计算。要使这样的命题成立，先弄清逆否命题的要求：如果 $n \\equiv s$，那么 $n^{2} \\equiv s^{2}$，这个值就决定了余数。\n\n> **注意。** 余数 $r$ 属于 $n^{2}$，而不是 $n$：先把 $s$ 平方，再把平方化简到 $0$ 到 $m - 1$ 的范围内。",
  ],
  (rng) => {
    const m = rng.int(5, 20);
    const s = rng.int(2, m - 1);
    const answer = (s * s) % m;
    return withMistakes(
      ask(
        [
          `For which $r$ with $0 \\le r < ${m}$ is the claim "if $n^{2} \\not\\equiv r \\pmod{${m}}$, then $n \\not\\equiv ${s} \\pmod{${m}}$" true for every integer $n$?`,
          `对于满足 $0 \\le r < ${m}$ 的哪个 $r$，命题“如果 $n^{2} \\not\\equiv r \\pmod{${m}}$，那么 $n \\not\\equiv ${s} \\pmod{${m}}$”对每个整数 $n$ 都成立？`,
        ],
        answer,
        [s, (2 * s) % m, s * s],
        [
          `**Step 1: Take the contrapositive.** The claim is equivalent to: if $n \\equiv ${s} \\pmod{${m}}$, then $n^{2} \\equiv r \\pmod{${m}}$.\n\n**Step 2: Compute the square.** If $n \\equiv ${s}$, then $n^{2} \\equiv ${s}^{2} = ${s * s} = ${m} \\cdot ${Math.floor((s * s) / m)} + ${answer}$, so $r = ${answer}$.\n\n**Check.** With $r = ${answer}$, every $n \\equiv ${s}$ has $n^{2} \\equiv ${answer}$, so $n^{2} \\not\\equiv ${answer}$ rules out $n \\equiv ${s}$; any other $r$ fails at $n = ${s}$.`,
          `**第一步：取逆否命题。** 原命题等价于：如果 $n \\equiv ${s} \\pmod{${m}}$，那么 $n^{2} \\equiv r \\pmod{${m}}$。\n\n**第二步：计算平方。** 若 $n \\equiv ${s}$，则 $n^{2} \\equiv ${s}^{2} = ${s * s} = ${m} \\cdot ${Math.floor((s * s) / m)} + ${answer}$，所以 $r = ${answer}$。\n\n**检验。** 取 $r = ${answer}$ 时，每个 $n \\equiv ${s}$ 都有 $n^{2} \\equiv ${answer}$，所以 $n^{2} \\not\\equiv ${answer}$ 排除了 $n \\equiv ${s}$；其他的 $r$ 在 $n = ${s}$ 时都不成立。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(s),
          "That is the residue of $n$; the claim asks for the residue of $n^{2}$.",
          "这是 $n$ 的余数；命题问的是 $n^{2}$ 的余数。",
        ),
        say(String((2 * s) % m), `That doubles $${s}$ instead of squaring it.`, `这是把 $${s}$ 乘以 2，而不是平方。`),
        say(
          String(s * s),
          `$${s * s}$ is not in the range from $0$ to $${m - 1}$; reduce it modulo $${m}$.`,
          `$${s * s}$ 不在 $0$ 到 $${m - 1}$ 的范围内；要模 $${m}$ 化简。`,
        ),
      ]),
    );
  },
);

const solutionAboveModulus = point(
  "a-solution-beyond-the-modulus",
  ["A solution beyond the modulus", "大于模的解"],
  [
    "After dividing a congruence by the common factor, the solutions form a single class modulo the reduced modulus. So they repeat more often than the original modulus suggests, and the next solution beyond a given number is found by using the reduced step.\n\n> **Watch out.** The solutions repeat every $\\frac{m}{g}$, not every $m$, so adding $m$ to the smallest solution can skip a smaller one above $m$.",
    "同余式除以公因数后，解构成约化模下的一个剩余类。所以解重复的周期比原来的模所暗示的更短，超过给定数的下一个解要用约化后的步长来求。\n\n> **注意。** 解每隔 $\\frac{m}{g}$ 重复一次，而不是每隔 $m$，所以给最小的解加上 $m$ 可能跳过大于 $m$ 的更小的解。",
  ],
  (rng) => {
    const g = rng.int(2, 4);
    const reduced = rng.int(3, 9);
    let u = rng.int(2, 12);
    while (gcd(u, reduced) !== 1) u++;
    const c = rng.int(1, reduced - 1);
    const a = g * u;
    const m = g * reduced;
    const b = g * c;
    let x0 = 0;
    while ((u * x0 - c) % reduced !== 0) x0++;
    let answer = m + 1;
    while ((answer - x0) % reduced !== 0) answer++;
    const run: number[] = [];
    for (let x = x0; x <= answer; x += reduced) run.push(x);
    return withMistakes(
      ask(
        [
          `Find the smallest integer $x > ${m}$ that satisfies $${a}x \\equiv ${b} \\pmod{${m}}$.`,
          `求满足 $${a}x \\equiv ${b} \\pmod{${m}}$ 且 $x > ${m}$ 的最小整数 $x$。`,
        ],
        answer,
        [x0 + m === answer ? answer + m : x0 + m, x0, answer + reduced],
        [
          `**Step 1: Divide by the common factor.** Dividing by $${g}$ gives $${u}x \\equiv ${c} \\pmod{${reduced}}$.\n\n**Step 2: Solve the reduced congruence.** $${u} \\cdot ${x0} = ${u * x0} \\equiv ${c} \\pmod{${reduced}}$, so $x \\equiv ${x0} \\pmod{${reduced}}$.\n\n**Step 3: Step past the modulus.** The solutions run $${run.join(", ")}$, and the first above $${m}$ is $${answer}$.\n\n**Check.** $${a} \\cdot ${answer} = ${a * answer} = ${m} \\cdot ${(a * answer - b) / m} + ${b}$.`,
          `**第一步：除以公因数。** 除以 $${g}$，得 $${u}x \\equiv ${c} \\pmod{${reduced}}$。\n\n**第二步：解约化后的同余式。** $${u} \\cdot ${x0} = ${u * x0} \\equiv ${c} \\pmod{${reduced}}$，所以 $x \\equiv ${x0} \\pmod{${reduced}}$。\n\n**第三步：越过模。** 解依次是 $${run.join(", ")}$，大于 $${m}$ 的第一个是 $${answer}$。\n\n**检验。** $${a} \\cdot ${answer} = ${a * answer} = ${m} \\cdot ${(a * answer - b) / m} + ${b}$。`,
        ],
      ),
      sayApart(String(answer), [
        say(
          String(x0 + m),
          `That steps by $${m}$; the solutions repeat every $${reduced}$, so a smaller one lies above $${m}$.`,
          `这是按 $${m}$ 跳；解每隔 $${reduced}$ 重复一次，所以大于 $${m}$ 的解还有更小的。`,
        ),
        say(String(x0), `$${x0}$ is a solution, but it is not greater than $${m}$.`, `$${x0}$ 是解，但不大于 $${m}$。`),
        say(
          String(answer + reduced),
          `That is a solution, but a smaller one also lies above $${m}$.`,
          `这是解，但大于 $${m}$ 的解中还有更小的。`,
        ),
      ]),
    );
  },
);

const solutionCount = point(
  "counting-the-solutions-of-a-linear-congruence",
  ["Counting the solutions of a linear congruence", "计算线性同余式的解数"],
  [
    "The equation $ax \\equiv b \\pmod{m}$ has solutions exactly when $g = \\gcd(a, m)$ divides $b$. In that case there are $g$ solutions among the residues modulo $m$, all of them congruent modulo $\\frac{m}{g}$. If $g$ does not divide $b$, there are none.\n\n> **Watch out.** When $g$ divides $b$ there are $g$ solutions modulo $m$, not just one; when it does not, there are none at all, not $g$.",
    "方程 $ax \\equiv b \\pmod{m}$ 有解当且仅当 $g = \\gcd(a, m)$ 整除 $b$。这时在模 $m$ 的剩余中有 $g$ 个解，它们模 $\\frac{m}{g}$ 同余。如果 $g$ 不整除 $b$，就没有解。\n\n> **注意。** $g$ 整除 $b$ 时，模 $m$ 有 $g$ 个解，而不只是一个；不整除时则一个解也没有，而不是 $g$ 个。",
  ],
  (rng) => {
    const g = rng.int(2, 6);
    const reduced = rng.int(3, 9);
    let u = rng.int(1, 9);
    while (gcd(u, reduced) !== 1) u++;
    const a = g * u;
    const m = g * reduced;
    const solvable = rng.bool();
    const b = solvable ? g * rng.int(1, reduced - 1) : g * rng.int(0, reduced - 1) + rng.int(1, g - 1);
    const answer = solvable ? g : 0;
    const roots = Array.from({ length: m }, (_, x) => x).filter((x) => (a * x - b) % m === 0);
    const products = [...new Set(Array.from({ length: m }, (_, x) => (a * x) % m))].sort((p, q) => p - q);
    const first = roots[0] ?? 0;
    return withMistakes(
      ask(
        [
          `How many solutions $x \\in \\{0, 1, \\dots, ${m - 1}\\}$ does $${a}x \\equiv ${b} \\pmod{${m}}$ have?`,
          `$${a}x \\equiv ${b} \\pmod{${m}}$ 在 $x \\in \\{0, 1, \\dots, ${m - 1}\\}$ 中有多少个解？`,
        ],
        answer,
        [1, solvable ? 0 : g, m],
        solvable
          ? [
              `**Step 1: Test the gcd.** $\\gcd(${a}, ${m}) = ${g}$ divides $${b} = ${g} \\cdot ${b / g}$, so there are solutions.\n\n**Step 2: Count them.** Dividing by $${g}$ gives $${u}x \\equiv ${b / g} \\pmod{${reduced}}$, with one solution modulo $${reduced}$. Below $${m}$ it appears $${g}$ times: $${roots.join(", ")}$.\n\n**Check.** $${a} \\cdot ${first} = ${a * first} = ${m} \\cdot ${(a * first - b) / m} + ${b}$, and the others differ from $${first}$ by multiples of $${reduced}$.`,
              `**第一步：检验最大公因数。** $\\gcd(${a}, ${m}) = ${g}$ 整除 $${b} = ${g} \\cdot ${b / g}$，所以有解。\n\n**第二步：计数。** 除以 $${g}$，得 $${u}x \\equiv ${b / g} \\pmod{${reduced}}$，模 $${reduced}$ 有一个解。在小于 $${m}$ 的数中它出现 $${g}$ 次：$${roots.join(", ")}$。\n\n**检验。** $${a} \\cdot ${first} = ${a * first} = ${m} \\cdot ${(a * first - b) / m} + ${b}$，其余的解与 $${first}$ 相差 $${reduced}$ 的倍数。`,
            ]
          : [
              `**Step 1: Test the gcd.** $\\gcd(${a}, ${m}) = ${g}$, and $${b} = ${g} \\cdot ${Math.floor(b / g)} + ${b % g}$, so $${g}$ does not divide $${b}$.\n\n**Step 2: Rule out every $x$.** $${a}x - ${m}k$ is a multiple of $${g}$ for all integers $x$ and $k$, but $${b}$ is not, so there are no solutions.\n\n**Check.** The residues of $${a}x$ modulo $${m}$ are $${products.join(", ")}$, all multiples of $${g}$, and $${b}$ is not among them.`,
              `**第一步：检验最大公因数。** $\\gcd(${a}, ${m}) = ${g}$，而 $${b} = ${g} \\cdot ${Math.floor(b / g)} + ${b % g}$，所以 $${g}$ 不整除 $${b}$。\n\n**第二步：排除每个 $x$。** 对所有整数 $x$ 和 $k$，$${a}x - ${m}k$ 都是 $${g}$ 的倍数，而 $${b}$ 不是，所以没有解。\n\n**检验。** $${a}x$ 模 $${m}$ 的剩余是 $${products.join(", ")}$，都是 $${g}$ 的倍数，$${b}$ 不在其中。`,
            ],
      ),
      sayApart(
        String(answer),
        solvable
          ? [
              say(
                "1",
                `There is one solution modulo $${reduced}$, but it appears $${g}$ times below $${m}$.`,
                `模 $${reduced}$ 有一个解，但在小于 $${m}$ 的数中它出现 $${g}$ 次。`,
              ),
              say("0", `$${g}$ divides $${b}$, so solutions exist.`, `$${g}$ 整除 $${b}$，所以有解。`),
              say(
                String(m),
                "Not every residue works; test the gcd against the right-hand side.",
                "并不是每个剩余都行；要用最大公因数检验右边。",
              ),
            ]
          : [
              say(
                String(g),
                `$${g}$ counts the solutions only when it divides the right-hand side, and $${g}$ does not divide $${b}$.`,
                `只有 $${g}$ 整除右边时，解数才是 $${g}$，而 $${g}$ 不整除 $${b}$。`,
              ),
              say("1", `No residue works, since $${g}$ does not divide $${b}$.`, `没有剩余满足，因为 $${g}$ 不整除 $${b}$。`),
              say(String(m), `No residue works, since $${g}$ does not divide $${b}$.`, `没有剩余满足，因为 $${g}$ 不整除 $${b}$。`),
            ],
      ),
    );
  },
);

const relatedToN = point(
  "elements-related-to-a-given-number",
  ["Elements related to a given number", "与给定数相关的元素"],
  [
    "Membership in a relation on an infinite set can define a finite set of elements related to a given number. Under divisibility on the positive integers, the elements related to $n$ are exactly its divisors, so they can be counted by factorizing $n$. For $n = 12 = 2^{2} \\cdot 3$: $(2 + 1)(1 + 1) = 6$ divisors, namely $1, 2, 3, 4, 6, 12$.\n\n> **Watch out.** $1$ and $n$ itself are divisors too, so both are related to $n$. Add one to each exponent before multiplying.",
    "无限集上的关系可以确定与给定数相关的有限元素集。在正整数的整除关系下，与 $n$ 相关的元素恰好是它的因数，所以可以通过分解 $n$ 来计数。对 $n = 12 = 2^{2} \\cdot 3$：共 $(2 + 1)(1 + 1) = 6$ 个因数，即 $1, 2, 3, 4, 6, 12$。\n\n> **注意。** $1$ 和 $n$ 本身也是因数，所以它们都与 $n$ 相关。各指数先加一再相乘。",
  ],
  (rng) => {
    const n = rng.int(12, 240);
    const list = divisors(n);
    const answer = list.length;
    const factors: [number, number][] = [];
    let rest = n;
    for (let p = 2; rest > 1; p++) {
      let e = 0;
      while (rest % p === 0) {
        rest /= p;
        e++;
      }
      if (e > 0) factors.push([p, e]);
    }
    const factored = factors.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
    const product = factors.map(([, e]) => `(${e} + 1)`).join("");
    return withMistakes(
      ask(
        [
          `On the positive integers, let $x \\mathrel{R} y \\iff x \\mid y$. How many positive integers $x$ satisfy $x \\mathrel{R} ${n}$?`,
          `在正整数上，设 $x \\mathrel{R} y \\iff x \\mid y$。有多少个正整数 $x$ 满足 $x \\mathrel{R} ${n}$？`,
        ],
        answer,
        [answer - 1, answer + 1, answer - 2],
        [
          `**Step 1: Read the relation.** $x \\mathrel{R} ${n}$ means $x \\mid ${n}$, so the elements are the positive divisors of $${n}$.\n\n**Step 2: Factorize.** ${factored === String(n) ? `$${n}$ is prime, so its exponent $1$ gives $1 + 1 = 2$ divisors.` : `$${n} = ${factored}$, so there are $${product} = ${answer}$ divisors.`}\n\n**Check.** Listing them: $${list.join(", ")}$, which makes $${answer}$.`,
          `**第一步：理解关系。** $x \\mathrel{R} ${n}$ 即 $x \\mid ${n}$，所以这些元素就是 $${n}$ 的正因数。\n\n**第二步：分解。** ${factored === String(n) ? `$${n}$ 是素数，指数 $1$ 给出 $1 + 1 = 2$ 个因数。` : `$${n} = ${factored}$，所以共有 $${product} = ${answer}$ 个因数。`}\n\n**检验。** 逐个列出：$${list.join(", ")}$，共 $${answer}$ 个。`,
        ],
      ),
      [
        say(
          String(answer - 1),
          `That leaves out one divisor; $1$ and $${n}$ both divide $${n}$.`,
          `这漏掉了一个因数；$1$ 和 $${n}$ 都整除 $${n}$。`,
        ),
        say(
          String(answer - 2),
          `That leaves out $1$ and $${n}$, which divide $${n}$ as well.`,
          `这漏掉了 $1$ 和 $${n}$，它们也整除 $${n}$。`,
        ),
      ],
    );
  },
);

const symmetricUnion = point(
  "the-size-of-a-relation-with-its-inverse",
  ["The size of a relation with its inverse", "关系与其逆的并集大小"],
  [
    "The union $R \\cup R^{-1}$ is the smallest symmetric relation containing $R$. A pair and its reverse may both already be in $R$, and pairs of the form $(a, a)$ are their own reverses, so doubling the size of $R$ overcounts them. For $R = \\{(1, 2), (2, 1), (1, 3), (2, 2)\\}$, the pairs whose reverse is in $R$ are $(1, 2), (2, 1), (2, 2)$, so the union has $2 \\cdot 4 - 3 = 5$ pairs.\n\n> **Watch out.** Count every pair of $R$ whose reverse is also in $R$, including each $(a, a)$. A pair and its reverse both in $R$ count as two such pairs, not one.",
    "并集 $R \\cup R^{-1}$ 是包含 $R$ 的最小对称关系。一个序对及其反向可能都已经在 $R$ 中，形如 $(a, a)$ 的序对是自身的反向，所以把 $R$ 的大小加倍会多算它们。对 $R = \\{(1, 2), (2, 1), (1, 3), (2, 2)\\}$，反向也在 $R$ 中的序对是 $(1, 2), (2, 1), (2, 2)$，所以并集有 $2 \\cdot 4 - 3 = 5$ 个序对。\n\n> **注意。** 要数出 $R$ 中反向也在 $R$ 中的每个序对，包括每个 $(a, a)$。一个序对与它的反向都在 $R$ 中时，算作两个这样的序对，而不是一个。",
  ],
  (rng) => {
    const all: [number, number][] = [];
    for (let a = 1; a <= 5; a++) for (let b = 1; b <= 5; b++) all.push([a, b]);
    const R = rng.sample(all, rng.int(5, 9)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const has = (a: number, b: number) => R.some(([x, y]) => x === a && y === b);
    const both = R.filter(([a, b]) => has(b, a));
    const overlap = both.length;
    const answer = 2 * R.length - overlap;
    const added = R.filter(([a, b]) => !has(b, a)).map(([a, b]) => [b, a] as [number, number]);
    return withMistakes(
      ask(
        [
          `Let $R = \\{${pairs(R)}\\}$. How many pairs are in $R \\cup R^{-1}$?`,
          `设 $R = \\{${pairs(R)}\\}$。$R \\cup R^{-1}$ 中有多少个序对？`,
        ],
        answer,
        [answer === 2 * R.length ? answer - 1 : 2 * R.length, R.length, answer + 1],
        [
          `**Step 1: Find the pairs in both.** The pairs of $R$ whose reverse is also in $R$: ${overlap === 0 ? "there are none" : `$${pairs(both)}$, which makes $${overlap}$`}.\n\n**Step 2: Subtract the overlap.** $R$ and $R^{-1}$ have $${R.length}$ pairs each, so the union has $${2 * R.length} - ${overlap} = ${answer}$.\n\n**Check.** $R^{-1}$ adds the new pairs ${added.length === 0 ? "none" : `$${pairs(added)}$`}, and $${R.length} + ${added.length} = ${answer}$.`,
          `**第一步：找出两者共有的序对。** $R$ 中反向也在 $R$ 中的序对：${overlap === 0 ? "没有" : `$${pairs(both)}$，共 $${overlap}$ 个`}。\n\n**第二步：减去重叠部分。** $R$ 与 $R^{-1}$ 各有 $${R.length}$ 个序对，所以并集有 $${2 * R.length} - ${overlap} = ${answer}$ 个。\n\n**检验。** $R^{-1}$ 新增的序对是${added.length === 0 ? "零个" : ` $${pairs(added)}$`}，而 $${R.length} + ${added.length} = ${answer}$。`,
        ],
      ),
      [
        say(
          String(2 * R.length),
          "That counts the pairs that are in both $R$ and $R^{-1}$ twice.",
          "这把同时属于 $R$ 与 $R^{-1}$ 的序对算了两次。",
        ),
        say(
          String(R.length),
          "That counts only $R$; its inverse adds the reverses that are missing.",
          "这只数了 $R$；它的逆还会加入缺少的反向序对。",
        ),
      ],
    );
  },
);

const reflexiveClosure = point(
  "pairs-needed-to-make-a-relation-reflexive",
  ["Pairs needed to make a relation reflexive", "使关系自反所需的序对"],
  [
    "A relation on a set is reflexive only if every element is related to itself. To repair a relation, add just the missing pairs of the form $(a, a)$. The other pairs in the relation play no part, so only the diagonal needs to be checked. On $\\{1, 2, 3\\}$, $R = \\{(1, 1), (1, 2), (3, 1)\\}$ needs $(2, 2)$ and $(3, 3)$: two pairs.\n\n> **Watch out.** Pairs such as $(1, 2)$ neither help nor need fixing; only the pairs $(a, a)$ already in $R$ reduce the count.",
    "集合上的关系只有在每个元素都与自身相关时才是自反的。要补全一个关系，只需添加缺少的形如 $(a, a)$ 的序对。关系中的其他序对不起作用，所以只需检查对角线。在 $\\{1, 2, 3\\}$ 上，$R = \\{(1, 1), (1, 2), (3, 1)\\}$ 需要添加 $(2, 2)$ 和 $(3, 3)$：两个序对。\n\n> **注意。** 像 $(1, 2)$ 这样的序对既无帮助，也不需要修正；只有已在 $R$ 中的 $(a, a)$ 会减少个数。",
  ],
  (rng) => {
    const n = rng.int(3, 7);
    const all: [number, number][] = [];
    for (let a = 1; a <= n; a++) for (let b = 1; b <= n; b++) all.push([a, b]);
    const R = rng.sample(all, rng.int(4, Math.min(9, n * n - 1))).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const present = R.filter(([a, b]) => a === b).map(([a]) => a);
    const loops = present.length;
    const answer = n - loops;
    const missing = [...Array(n).keys()].map((i) => i + 1).filter((a) => !present.includes(a));
    const loopsText = (list: readonly number[]) => list.map((a) => `(${a}, ${a})`).join(", ");
    return withMistakes(
      ask(
        [
          `Let $R = \\{${pairs(R)}\\}$ on $\\{1, 2, \\dots, ${n}\\}$. How many pairs must be added to make $R$ reflexive?`,
          `$\\{1, 2, \\dots, ${n}\\}$ 上的 $R = \\{${pairs(R)}\\}$。要使 $R$ 自反，必须添加多少个序对？`,
        ],
        answer,
        [n, n * n - R.length, loops === 0 ? n + 1 : loops],
        [
          `**Step 1: List what reflexivity needs.** The $${n}$ pairs $(a, a)$ for $a = 1, \\dots, ${n}$.\n\n**Step 2: See which are there.** $R$ contains ${loops === 0 ? "none of them" : `$${loopsText(present)}$`}, so $${n} - ${loops} = ${answer}$ are missing.\n\n**Check.** The missing pairs are ${missing.length === 0 ? "none" : `$${loopsText(missing)}$`}, which makes $${answer}$.`,
          `**第一步：列出自反性的要求。** 对 $a = 1, \\dots, ${n}$ 的 $${n}$ 个序对 $(a, a)$。\n\n**第二步：看哪些已经存在。** $R$ 包含${loops === 0 ? "其中零个" : ` $${loopsText(present)}$`}，所以缺少 $${n} - ${loops} = ${answer}$ 个。\n\n**检验。** 缺少的序对是${missing.length === 0 ? "零个" : ` $${loopsText(missing)}$`}，共 $${answer}$ 个。`,
        ],
      ),
      [
        say(String(n), `Some pairs $(a, a)$ are already in $R$ and need not be added.`, "有些 $(a, a)$ 已经在 $R$ 中，不必添加。"),
        say(
          String(n * n - R.length),
          "That adds every missing pair; reflexivity needs only the pairs $(a, a)$.",
          "这添加了所有缺少的序对；自反性只需要 $(a, a)$。",
        ),
      ],
    );
  },
);

const classCount = point(
  "counting-the-classes-of-an-equivalence-relation",
  ["Counting the classes of an equivalence relation", "计算等价关系的类数"],
  [
    "An equivalence proof can also reveal what the relation really is. When $p + q$ is a multiple of $d$, the condition $d \\mid pa + qb$ is the same as $d \\mid p(a - b)$, which means that $a$ and $b$ are congruent modulo $\\frac{d}{\\gcd(d, p)}$. For $6 \\mid 2a + 4b$: $2a + 4b = 6b + 2(a - b)$, so the condition is $6 \\mid 2(a - b)$, that is $a \\equiv b \\pmod 3$, with $3$ classes.\n\n> **Watch out.** Cancel the common factor of $d$ and $p$ from the modulus: $6 \\mid 2(a - b)$ means $3 \\mid a - b$, which gives $3$ classes, not $6$.",
    "等价关系的证明还能揭示关系的实质。当 $p + q$ 是 $d$ 的倍数时，条件 $d \\mid pa + qb$ 等同于 $d \\mid p(a - b)$，这意味着 $a$ 与 $b$ 模 $\\frac{d}{\\gcd(d, p)}$ 同余。对 $6 \\mid 2a + 4b$：$2a + 4b = 6b + 2(a - b)$，所以条件是 $6 \\mid 2(a - b)$，即 $a \\equiv b \\pmod 3$，共 $3$ 个类。\n\n> **注意。** 要从模中约去 $d$ 与 $p$ 的公因数：$6 \\mid 2(a - b)$ 即 $3 \\mid a - b$，有 $3$ 个类，而不是 $6$ 个。",
  ],
  (rng) => {
    const d = rng.int(4, 18);
    const p = rng.int(2, d - 1);
    const q = d - p;
    const g = gcd(d, p);
    const answer = d / g;
    return withMistakes(
      ask(
        [
          `On $\\mathbb{Z}$, the relation $a \\sim b \\iff ${d} \\mid ${poly([p, "a"], [q, "b"])}$ is an equivalence relation. How many equivalence classes does it have?`,
          `在 $\\mathbb{Z}$ 上，关系 $a \\sim b \\iff ${d} \\mid ${poly([p, "a"], [q, "b"])}$ 是等价关系。它有多少个等价类？`,
        ],
        answer,
        [answer === d ? d + 1 : d, g === answer ? g + 1 : g, p === answer ? p + 1 : p],
        [
          `**Step 1: Rewrite the condition.** $${poly([p, "a"], [q, "b"])} = ${d}b + ${p}(a - b)$, so the condition is $${d} \\mid ${p}(a - b)$.\n\n**Step 2: Cancel the common factor.** $\\gcd(${d}, ${p}) = ${g}$, so this says $${answer} \\mid a - b$, that is $a \\equiv b \\pmod{${answer}}$.\n\n**Step 3: Count.** One class for each remainder modulo $${answer}$: $${answer}$ classes.\n\n**Check.** $0 \\sim ${answer}$: $${p} \\cdot 0 + ${q} \\cdot ${answer} = ${q * answer} = ${d} \\cdot ${(q * answer) / d}$.${answer > 1 ? ` But $0 \\not\\sim 1$: $${q}$ is not a multiple of $${d}$.` : ""}`,
          `**第一步：改写条件。** $${poly([p, "a"], [q, "b"])} = ${d}b + ${p}(a - b)$，所以条件是 $${d} \\mid ${p}(a - b)$。\n\n**第二步：约去公因数。** $\\gcd(${d}, ${p}) = ${g}$，所以这表示 $${answer} \\mid a - b$，即 $a \\equiv b \\pmod{${answer}}$。\n\n**第三步：计数。** 模 $${answer}$ 的每个余数对应一个类：共 $${answer}$ 个类。\n\n**检验。** $0 \\sim ${answer}$：$${p} \\cdot 0 + ${q} \\cdot ${answer} = ${q * answer} = ${d} \\cdot ${(q * answer) / d}$。${answer > 1 ? `但 $0 \\not\\sim 1$：$${q}$ 不是 $${d}$ 的倍数。` : ""}`,
        ],
      ),
      [
        say(
          String(d),
          `$${d}$ and $${p}$ share the factor $${g}$, which cancels from the modulus.`,
          `$${d}$ 与 $${p}$ 有公因数 $${g}$，要从模中约去。`,
        ),
        ...(g > 1
          ? [
              say(
                String(g),
                `$${g}$ is the factor that cancels; the modulus left is $${d} / ${g}$.`,
                `$${g}$ 是约去的因数；剩下的模是 $${d} / ${g}$。`,
              ),
            ]
          : []),
      ],
    );
  },
);

const equalClassModuli = point(
  "the-moduli-for-which-two-classes-agree",
  ["The moduli for which two classes agree", "使两个类相同的模"],
  [
    "Two residue classes $[a]_{m}$ and $[b]_{m}$ are equal exactly when $m$ divides $a - b$. So the moduli that make two given classes equal are the divisors of the difference, and listing them answers the question without testing each modulus separately. For $[3]_{m} = [15]_{m}$: $15 - 3 = 12$, whose divisors above $1$ are $2, 3, 4, 6, 12$, so $5$ moduli.\n\n> **Watch out.** Leave out the divisor $1$, since $m > 1$, but keep the difference itself: $m = 12$ works.",
    "两个剩余类 $[a]_{m}$ 与 $[b]_{m}$ 相等，当且仅当 $m$ 整除 $a - b$。所以使两个给定类相等的模就是差的因数，列出它们就能回答问题，不必逐一检验每个模。对 $[3]_{m} = [15]_{m}$：$15 - 3 = 12$，大于 $1$ 的因数是 $2, 3, 4, 6, 12$，共 $5$ 个模。\n\n> **注意。** 因为 $m > 1$，要去掉因数 $1$，但差本身要保留：$m = 12$ 也可以。",
  ],
  (rng) => {
    const gap = rng.int(6, 72);
    const a = rng.int(-20, 40);
    const b = a + gap;
    const list = divisors(gap).filter((d) => d > 1);
    const answer = list.length;
    const largest = list[list.length - 1]!;
    return withMistakes(
      ask(
        [`For how many integers $m > 1$ is $[${a}]_{m} = [${b}]_{m}$?`, `对于多少个大于 $1$ 的整数 $m$，有 $[${a}]_{m} = [${b}]_{m}$？`],
        answer,
        [answer + 1, gap, gap - 1],
        [
          `**Step 1: Take the difference.** $${b} - ${a < 0 ? `(${a})` : a} = ${gap}$, and the classes are equal exactly when $m \\mid ${gap}$.\n\n**Step 2: List the divisors above 1.** $${list.join(", ")}$, which makes $${answer}$.\n\n**Check.** $m = ${largest}$: $[${a}]_{${largest}} = [${b}]_{${largest}}$ since $${gap} = ${largest} \\cdot ${gap / largest}$.`,
          `**第一步：求差。** $${b} - ${a < 0 ? `(${a})` : a} = ${gap}$，两个类相等当且仅当 $m \\mid ${gap}$。\n\n**第二步：列出大于 1 的因数。** $${list.join(", ")}$，共 $${answer}$ 个。\n\n**检验。** $m = ${largest}$：因为 $${gap} = ${largest} \\cdot ${gap / largest}$，所以 $[${a}]_{${largest}} = [${b}]_{${largest}}$。`,
        ],
      ),
      [
        say(String(answer + 1), "That counts $m = 1$, which the question excludes.", "这把 $m = 1$ 也算进去了，而题目排除了它。"),
        say(
          String(gap),
          "That counts every number up to the difference; only its divisors work.",
          "这数的是不超过差的所有数；只有差的因数才行。",
        ),
        say(
          String(gap - 1),
          "That counts every number from $2$ to the difference; only its divisors work.",
          "这数的是从 $2$ 到差的所有数；只有差的因数才行。",
        ),
      ],
    );
  },
);

/** deeperMethodsOfProofThird2Points maps topics of Methods of Proof, on induction, limits, cardinality, congruences and relations, to a third knowledge point. */
export const deeperMethodsOfProofThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "proving-divisibility-using-induction": [baseCaseMatters],
  "proving-the-limit-of-a-null-sequence": [smallestNForNull],
  "proving-the-finite-limit-of-a-sequence": [quadraticLimit],
  "infinite-limits-of-sequences": [quadraticInfinite],
  "proving-a-sequence-has-an-infinite-limit": [minusInfinity],
  surjections: [missedResidues],
  "discrete-infinite-sets-with-equal-cardinality": [cantorPairing],
  "continuous-infinite-sets-with-equal-cardinality": [intervalRayInverse],
  "cantors-diagonal-argument": [diagonalDistance],
  "the-cantor-bernstein-schroder-theorem": [injectionScale],
  "cantors-theorem": [missedSubsets],
  "the-addition-property-of-modular-arithmetic": [linearCombination],
  "the-division-properties-of-modular-arithmetic": [twoCancellations],
  "proving-properties-of-modular-congruence": [powerResidue],
  "proving-congruence-by-contrapositive": [contrapositiveValue],
  "solving-advanced-linear-congruences": [solutionAboveModulus],
  "proving-properties-of-linear-congruences": [solutionCount],
  "relations-on-infinite-sets": [relatedToN],
  "operations-on-relations": [symmetricUnion],
  "reflexive-and-irreflexive-relations": [reflexiveClosure],
  "proving-a-relation-is-an-equivalence-relation": [classCount],
  "residue-classes": [equalClassModuli],
};
