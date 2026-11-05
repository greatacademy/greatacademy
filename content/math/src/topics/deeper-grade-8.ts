// Further knowledge points for topics of 8th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade8Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { numberProblem } from "../problems.ts";

/** gcd8 is the greatest common factor of two positive integers. */
const gcd8 = (a: number, b: number): number => (b === 0 ? a : gcd8(b, a % b));

const exponentGivingOne: KnowledgePointDef = {
  id: "an-exponent-that-gives-one",
  title: t("An exponent that gives one", "使幂等于一的指数"),
  explanation: t(
    "A power of a number other than $0$, $1$ and $-1$ equals $1$ only when its exponent is zero. So an equation that sets such a power equal to $1$ is really an equation about the exponent. Set the whole exponent equal to zero and solve that linear equation. The base plays no further part, which is why the answer does not change if the base is replaced by another suitable number.",
    "除 $0$、$1$ 和 $-1$ 以外的数，它的幂只有在指数为零时才等于 $1$。所以令这样的幂等于 $1$ 的方程，其实是关于指数的方程。令整个指数等于零，解这个一次方程。底数不再起作用，这就是为什么把底数换成另一个合适的数，答案也不会变。",
  ),
  generate(rng) {
    const base = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const k = rng.int(2, 7);
    const answer = rng.int(2, 12);
    const c = k * answer;
    return numberProblem({
      prompt: t(`Find $x$ if $${base}^{${k}x - ${c}} = 1$.`, `已知 $${base}^{${k}x - ${c}} = 1$，求 $x$。`),
      answer,
      form: "integer",
      wrong: [c, -answer, answer + 1, 0, 1],
      solution: t(
        `Only an exponent of zero gives $1$ here. So $${k}x - ${c} = 0$, which gives $${k}x = ${c}$ and $x = ${answer}$.`,
        `这里只有指数为零才能得到 $1$。所以 $${k}x - ${c} = 0$，得 $${k}x = ${c}$，$x = ${answer}$。`,
      ),
    });
  },
};

const exponentForUnitFraction: KnowledgePointDef = {
  id: "the-exponent-that-gives-a-unit-fraction",
  title: t("The exponent that gives a unit fraction", "得到单位分数的指数"),
  explanation: t(
    "Reading a negative exponent backwards solves equations for the exponent. A unit fraction whose bottom is a power of the base is that base raised to a negative exponent. Equally, a whole number can be a negative power of a unit fraction, since flipping the base changes the sign of the exponent. So first write both sides with the same base, and then the exponents must match, including their signs.",
    "把负指数倒过来读，就能解关于指数的方程。分母是底数的幂的单位分数，就是这个底数的负指数幂。同样，整数也可以是单位分数的负指数幂，因为把底数颠倒，指数就变号。所以先把两边写成同样的底数，指数（包括符号）就必须相同。",
  ),
  generate(rng) {
    const base = rng.pick([2, 3, 4, 5, 10]);
    const n = rng.int(2, 5);
    const power = base ** n;
    const flipped = rng.bool();
    const answer = -n;
    return numberProblem({
      prompt: flipped
        ? t(
            `Find $x$ if $\\left(\\frac{1}{${base}}\\right)^{x} = ${power}$.`,
            `已知 $\\left(\\frac{1}{${base}}\\right)^{x} = ${power}$，求 $x$。`,
          )
        : t(`Find $x$ if $${base}^{x} = \\frac{1}{${power}}$.`, `已知 $${base}^{x} = \\frac{1}{${power}}$，求 $x$。`),
      answer,
      form: "integer",
      wrong: [n, answer - 1, answer + 1, base, -power],
      solution: t(
        flipped
          ? `Since $\\frac{1}{${base}} = ${base}^{-1}$, the left side is a power of ${base} with exponent $-x$. As $${power} = ${base}^{${n}}$, we need $-x = ${n}$, so $x = ${answer}$.`
          : `Since $${power} = ${base}^{${n}}$, we have $\\frac{1}{${power}} = ${base}^{${answer}}$. So $x = ${answer}$.`,
        flipped
          ? `因为 $\\frac{1}{${base}} = ${base}^{-1}$，左边是指数为 $-x$ 的 ${base} 的幂。又 $${power} = ${base}^{${n}}$，所以 $-x = ${n}$，$x = ${answer}$。`
          : `因为 $${power} = ${base}^{${n}}$，所以 $\\frac{1}{${power}} = ${base}^{${answer}}$。于是 $x = ${answer}$。`,
      ),
    });
  },
};

const missingExponent: KnowledgePointDef = {
  id: "a-missing-exponent-in-a-product-or-quotient",
  title: t("A missing exponent in a product or quotient", "积或商中缺失的指数"),
  explanation: t(
    "The rules for exponents can run backwards. When powers of one base multiply, their exponents add, so a missing exponent is the difference between the result and the known exponent. When they divide, the exponents subtract, and so a missing exponent in the divisor is again a difference. Set up the equation for the exponents alone, since the base has done its work once it is the same on both sides.",
    "指数法则可以倒过来用。同底数的幂相乘，指数相加，所以缺失的指数是结果的指数与已知指数的差。相除时指数相减，所以除式中缺失的指数同样是一个差。只针对指数列方程就行，因为两边底数相同后，底数就不再起作用了。",
  ),
  generate(rng) {
    const base = rng.pick([2, 3, 5, 7, 10]);
    const m = rng.int(2, 12);
    const n = rng.pick([...Array(11).keys()].map((i) => i + 2).filter((v) => v !== m));
    const product = rng.bool();
    const answer = product ? n - m : m - n;
    const big = product ? n : m;
    const known = product ? m : n;
    return numberProblem({
      prompt: product
        ? t(
            `Find $x$ if $${base}^{${m}} \\times ${base}^{x} = ${base}^{${n}}$.`,
            `已知 $${base}^{${m}} \\times ${base}^{x} = ${base}^{${n}}$，求 $x$。`,
          )
        : t(
            `Find $x$ if $${base}^{${m}} \\div ${base}^{x} = ${base}^{${n}}$.`,
            `已知 $${base}^{${m}} \\div ${base}^{x} = ${base}^{${n}}$，求 $x$。`,
          ),
      answer,
      form: "integer",
      wrong: [m + n, -answer, m * n, answer + 1, answer - 1],
      solution: t(
        product
          ? `Exponents add when multiplying, so $${m} + x = ${n}$. This gives $x = ${n} - ${m} = ${answer}$.`
          : `Exponents subtract when dividing, so $${m} - x = ${n}$. This gives $x = ${m} - ${n} = ${answer}$.`,
        product
          ? `相乘时指数相加，所以 $${m} + x = ${n}$。得 $x = ${big} - ${known} = ${answer}$。`
          : `相除时指数相减，所以 $${m} - x = ${n}$。得 $x = ${big} - ${known} = ${answer}$。`,
      ),
    });
  },
};

const powersOfDifferentBases: KnowledgePointDef = {
  id: "matching-powers-with-different-bases",
  title: t("Matching powers with different bases", "使不同底数的幂一致"),
  explanation: t(
    "Powers can only be combined directly when they have the same base. But a base such as 8 is itself a power of 2, and the power rule then rewrites any power of 8 as a power of 2. After this step, the product rule works as usual, and the exponents add. Adding the original exponents without converting is the common error, because they count factors of two different numbers.",
    "只有底数相同的幂才能直接合并。但像 8 这样的底数本身就是 2 的幂，用幂的乘方法则可以把 8 的任何幂改写成 2 的幂。这样之后，同底数幂的乘法照常进行，指数相加。不转换就直接把原来的指数相加是常见的差错，因为它们数的是两个不同的数的因数个数。",
  ),
  generate(rng) {
    const [small, big, ratio] = rng.pick([
      [2, 4, 2],
      [2, 8, 3],
      [2, 16, 4],
      [2, 32, 5],
      [3, 9, 2],
      [3, 27, 3],
      [5, 25, 2],
    ]) as [number, number, number];
    const m = rng.int(2, 9);
    const k = rng.int(2, 9);
    const answer = ratio * m + k;
    return numberProblem({
      prompt: t(
        `Find $x$ if $${big}^{${m}} \\times ${small}^{${k}} = ${small}^{x}$.`,
        `已知 $${big}^{${m}} \\times ${small}^{${k}} = ${small}^{x}$，求 $x$。`,
      ),
      answer,
      form: "integer",
      wrong: [m + k, ratio + m + k, ratio * m, m * k, ratio * (m + k), answer + 1, answer - 1],
      solution: t(
        `Since $${big} = ${small}^{${ratio}}$, we have $${big}^{${m}} = ${small}^{${ratio * m}}$. Multiplying adds the exponents: $${ratio * m} + ${k} = ${answer}$.`,
        `因为 $${big} = ${small}^{${ratio}}$，所以 $${big}^{${m}} = ${small}^{${ratio * m}}$。相乘时指数相加：$${ratio * m} + ${k} = ${answer}$。`,
      ),
    });
  },
};

const countingFactors: KnowledgePointDef = {
  id: "counting-factors-from-a-prime-factorization",
  title: t("Counting factors from a prime factorization", "由质因数分解数因数的个数"),
  explanation: t(
    "A prime factorization shows every factor of a number at once. Each factor is built by choosing how many copies of each prime to use, from none up to all of them. So a prime with an exponent of 3 offers 4 choices. These choices are independent, which means that they multiply. Multiplying one more than each exponent therefore counts the factors, including 1 and the number itself, and no list is needed.",
    "质因数分解一下子说明了一个数的所有因数。每个因数都是这样构成的：决定每个质数用几个，从一个不用到全部用上。所以指数是 3 的质数有 4 种选择。这些选择相互独立，因此要相乘。把每个指数加 1 再相乘，就数出了因数的个数（包括 1 和这个数本身），不需要一一列出。",
  ),
  generate(rng) {
    const primes = rng.pick([
      [2, 3],
      [2, 5],
      [3, 5],
      [2, 7],
      [3, 7],
      [2, 3, 5],
      [2, 3, 7],
      [2, 5, 7],
      [3, 5, 7],
      [2, 3, 11],
    ]);
    const powers = primes.map(() => rng.int(1, 5));
    const answer = powers.reduce((total, v) => total * (v + 1), 1);
    const latex = primes.map((p, i) => (powers[i] === 1 ? `${p}` : `${p}^{${powers[i]}}`)).join(" \\times ");
    const sum = powers.reduce((total, v) => total + v, 0);
    return numberProblem({
      prompt: t(
        `A number has the prime factorization $${latex}$. How many positive factors does it have, including 1 and itself?`,
        `一个数的质因数分解是 $${latex}$。它有多少个正因数（包括 1 和它本身）？`,
      ),
      answer,
      form: "integer",
      wrong: [sum, sum + powers.length, powers.reduce((total, v) => total * v, 1), answer + 1, answer - 1],
      solution: t(
        `Each prime can be used from zero times up to its exponent, which gives $${powers.map((v) => v + 1).join(" \\times ")} = ${answer}$ choices in all.`,
        `每个质数可以用从 0 次到它的指数次，所以共有 $${powers.map((v) => v + 1).join(" \\times ")} = ${answer}$ 种选择。`,
      ),
    });
  },
};

const otherNumberFromGcfLcm: KnowledgePointDef = {
  id: "the-other-number-from-its-gcf-and-lcm",
  title: t("The other number from its GCF and LCM", "由最大公因数和最小公倍数求另一个数"),
  explanation: t(
    "For two positive whole numbers, the GCF times the LCM always equals the product of the numbers. Prime factorizations show why: each prime's smaller power goes into the GCF, its larger power goes into the LCM, and together they use every factor from both numbers exactly once. So if one number is known along with the GCF and the LCM, then dividing their product by the known number gives the other one.",
    "对两个正整数，最大公因数乘以最小公倍数，总是等于这两个数的积。质因数分解说明了原因：每个质数较小的幂进入最大公因数，较大的幂进入最小公倍数，合起来恰好把两个数的每个因数都用了一次。所以知道其中一个数和最大公因数、最小公倍数后，用它们的积除以已知的数，就得到另一个数。",
  ),
  generate(rng) {
    const g = rng.int(2, 12);
    const m = rng.int(2, 9);
    const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m && gcd8(v, m) === 1));
    const a = g * m;
    const answer = g * n;
    const lcm = g * m * n;
    return numberProblem({
      prompt: t(
        `Two numbers have a greatest common factor of $${g}$ and a lowest common multiple of $${lcm}$. One of the numbers is $${a}$. What is the other?`,
        `两个数的最大公因数是 $${g}$，最小公倍数是 $${lcm}$。其中一个数是 $${a}$。另一个数是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [n, lcm - a, lcm / g, answer + g, a + g, answer + 2 * g],
      solution: t(
        `The GCF times the LCM equals the product of the numbers: $${g} \\times ${lcm} = ${g * lcm}$. So the other number is $${g * lcm} \\div ${a} = ${answer}$.`,
        `最大公因数乘以最小公倍数等于两数之积：$${g} \\times ${lcm} = ${g * lcm}$。所以另一个数是 $${g * lcm} \\div ${a} = ${answer}$。`,
      ),
    });
  },
};

const squareTiles: KnowledgePointDef = {
  id: "the-largest-square-tile-for-a-floor",
  figure: gradeDrawings5["finding-greatest-common-factors-using-prime-factorization#the-largest-square-tile-for-a-floor"],
  title: t("The largest square tile for a floor", "铺地面的最大正方形地砖"),
  explanation: t(
    "A square tile covers a rectangle exactly only if its side divides both of the rectangle's sides. So the largest possible tile has a side equal to the greatest common factor of the two lengths. Next, find how many tiles fit along each side by dividing, and multiply these two counts. Dividing the area by the side, instead of by the tile's area, is the usual mistake, as a tile is two-dimensional.",
    "正方形地砖要恰好铺满长方形，它的边长必须能整除长方形的两条边。所以最大的地砖边长等于这两个长度的最大公因数。接着用除法求出每条边能放几块，再把两个数相乘。用面积除以边长，而不是除以地砖的面积，是常见的差错，因为地砖是二维的。",
  ),
  generate(rng) {
    const g = rng.int(2, 15);
    const m = rng.int(2, 9);
    const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m && gcd8(v, m) === 1));
    const w = g * m;
    const h = g * n;
    const answer = m * n;
    return numberProblem({
      prompt: t(
        `A floor measuring $${w}$ cm by $${h}$ cm is covered exactly by equal square tiles, using the largest whole-number side possible. How many tiles are needed?`,
        `一块 $${w}$ 厘米乘 $${h}$ 厘米的地面，用边长为整数且尽可能大的相同正方形地砖恰好铺满。需要多少块地砖？`,
      ),
      answer,
      form: "integer",
      wrong: [g, m + n, m * h, 2 * (m + n), answer + 1],
      solution: t(
        `The largest side is the GCF of $${w}$ and $${h}$, which is $${g}$. That gives $${m}$ tiles along one side and $${n}$ along the other, so $${m} \\times ${n} = ${answer}$ tiles.`,
        `最大的边长是 $${w}$ 和 $${h}$ 的最大公因数，即 $${g}$。一条边放 $${m}$ 块，另一条边放 $${n}$ 块，所以共 $${m} \\times ${n} = ${answer}$ 块。`,
      ),
    });
  },
};

const missingDigit: KnowledgePointDef = {
  id: "a-missing-digit-for-divisibility",
  title: t("A missing digit for divisibility", "使数能被整除的缺失数字"),
  explanation: t(
    "The tests for $3$ and $9$ depend on the digit sum, and so they can also find a missing digit. Add the known digits and see what must be added to reach the next multiple. For $9$, this gives one digit, unless the sum is already a multiple. For $3$, several digits work, as they differ by $3$, so the question must say which one it wants. Checking the new digit sum confirms the choice.",
    "能否被 $3$ 和 $9$ 整除取决于各位数字之和，所以也可以用来找缺失的数字。把已知数字加起来，看还要加多少才到下一个倍数。对 $9$ 来说，这样得到一个数字，除非和已经是倍数。对 $3$ 来说，有几个数字都可以，它们相差 $3$，所以题目要说明要哪一个。算一下新的数字和就能确认。",
  ),
  generate(rng) {
    const digits = [rng.int(1, 9), rng.int(0, 9), rng.int(0, 9), rng.int(0, 9)];
    const nine = rng.bool();
    const firstSum = digits.reduce((total, v) => total + v, 0);
    if (nine && firstSum % 9 === 0) digits[3] = digits[3] === 9 ? 8 : (digits[3] as number) + 1;
    const sum = digits.reduce((total, v) => total + v, 0);
    const modulus = nine ? 9 : 3;
    const answer = (modulus - (sum % modulus)) % modulus;
    const gap = rng.int(1, 3);
    const shown = digits.map((d, i) => (i === gap ? `${d}\\square` : `${d}`)).join("");
    return numberProblem({
      prompt: nine
        ? t(
            `The digit in the box makes $${shown}$ divisible by $9$. Which digit is it?`,
            `方框里的数字使 $${shown}$ 能被 $9$ 整除。这个数字是几？`,
          )
        : t(
            `What is the smallest digit that can go in the box to make $${shown}$ divisible by $3$?`,
            `方框里最小填什么数字，才能使 $${shown}$ 能被 $3$ 整除？`,
          ),
      answer,
      form: "integer",
      wrong: [sum % modulus, answer + 1, answer + 2, (answer + 3) % 10, modulus],
      solution: t(
        `The known digits add up to $${sum}$. The next multiple of $${modulus}$ ${answer === 0 ? "is that sum itself, so no more is needed and the smallest digit is $0$" : `is ${sum + answer}, so the digit is $${sum + answer} - ${sum} = ${answer}$`}.`,
        `已知数字之和是 ${sum}。${answer === 0 ? `它已经是 ${modulus} 的倍数，不需要再加，所以最小的数字是 $0$` : `下一个 ${modulus} 的倍数是 ${sum + answer}，所以这个数字是 $${sum + answer} - ${sum} = ${answer}$`}。`,
      ),
    });
  },
};

const twoRootsEqual: KnowledgePointDef = {
  id: "two-square-roots-set-equal",
  title: t("Two square roots set equal", "两个相等的平方根"),
  explanation: t(
    "When a square root equals another square root, squaring both sides removes both radicals at the same moment. What remains is a linear equation with variables on both sides. Squaring can introduce false solutions, however, since a square root of a negative number is not a real number. So substitute the answer back: the two expressions under the roots must match, and their common value must not be negative.",
    "一个平方根等于另一个平方根时，两边平方就同时去掉了两个根号。剩下的是两边都有变量的一次方程。但平方可能引入假解，因为负数的平方根不是实数。所以要把答案代回去：两个被开方式必须相等，它们共同的值不能是负数。",
  ),
  generate(rng) {
    const answer = rng.int(2, 12);
    const c = rng.int(2, 7);
    const a = c + rng.int(1, 5);
    const b = rng.int(1, 30);
    const d = (a - c) * answer + b;
    const value = a * answer + b;
    const gapText = a - c === 1 ? "" : `${a - c}`;
    return numberProblem({
      prompt: t(`Solve $\\sqrt{${a}x + ${b}} = \\sqrt{${c}x + ${d}}$.`, `解方程 $\\sqrt{${a}x + ${b}} = \\sqrt{${c}x + ${d}}$。`),
      answer,
      form: "integer",
      wrong: [-answer, answer + 1, Math.round((b + d) / (a + c)), Math.round((d - b) / (a + c)), value, Math.round(Math.sqrt(value))],
      solution: t(
        `Squaring both sides gives $${a}x + ${b} = ${c}x + ${d}$, so $${gapText}x = ${d - b}$${a - c === 1 ? "" : ` and $x = ${answer}$`}. Both sides then have ${value} under the root, which is positive, so the solution holds.`,
        `两边平方得 $${a}x + ${b} = ${c}x + ${d}$，所以 $${gapText}x = ${d - b}$${a - c === 1 ? "" : `，$x = ${answer}$`}。这时两边的被开方数都是 ${value}，是正数，所以这个解成立。`,
      ),
    });
  },
};

const underOneRoot: KnowledgePointDef = {
  id: "moving-a-whole-number-under-a-root",
  title: t("Moving a whole number under a root", "把整数移到根号里"),
  explanation: t(
    "Simplifying a square root pulls a square factor out of the radical, and the same step works in reverse. A whole number multiplying a root equals the square root of its own square, and the product rule then joins the two roots into one. This is useful for comparing two surds, because the one with the larger number under its root is the larger. Remember that the outside number must be squared on the way in.",
    "化简平方根是把平方因数提到根号外，这一步也可以倒过来。乘在根号前的整数，等于它的平方的平方根，再用积的法则把两个根号合成一个。这在比较两个根式时很有用，因为根号里的数较大的那个就较大。记住，根号外的数移进去时要平方。",
  ),
  generate(rng) {
    const k = rng.int(2, 12);
    const m = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
    const answer = k * k * m;
    return numberProblem({
      prompt: t(
        `The number $${k}\\sqrt{${m}}$ can be written as $\\sqrt{n}$. Find $n$.`,
        `$${k}\\sqrt{${m}}$ 可以写成 $\\sqrt{n}$。求 $n$。`,
      ),
      answer,
      form: "integer",
      wrong: [k * m, k * k + m, k * m * m, k + m, (k * m) ** 2],
      solution: t(
        `Write ${k} as $\\sqrt{${k * k}}$. Then $\\sqrt{${k * k}} \\times \\sqrt{${m}} = \\sqrt{${answer}}$, so $n = ${answer}$.`,
        `把 ${k} 写成 $\\sqrt{${k * k}}$。于是 $\\sqrt{${k * k}} \\times \\sqrt{${m}} = \\sqrt{${answer}}$，所以 $n = ${answer}$。`,
      ),
    });
  },
};

const wholeBetweenRoots: KnowledgePointDef = {
  id: "whole-numbers-between-two-roots",
  title: t("Whole numbers between two roots", "两个根之间的整数"),
  explanation: t(
    "A surd lies between two neighboring whole numbers, and the perfect squares on each side show which. To count the whole numbers between two surds, find the smallest whole number above the lower one and the largest whole number below the upper one. Then subtract these two and add one, since both of them are included. Subtracting the numbers under the roots gives a very different and much larger count.",
    "一个根式位于两个相邻的整数之间，两边的完全平方数说明是哪两个。要数两个根式之间的整数，就找出大于较小根式的最小整数，以及小于较大根式的最大整数。然后把这两个数相减再加 1，因为它们都算在内。用根号里的数相减，会得到一个完全不同而且大得多的数。",
  ),
  generate(rng) {
    const low = rng.int(2, 15);
    const high = low + rng.int(2, 9);
    const a = low * low + rng.int(1, 2 * low);
    const b = high * high + rng.int(1, 2 * high);
    const answer = high - low;
    return numberProblem({
      prompt: t(
        `How many whole numbers lie between $\\sqrt{${a}}$ and $\\sqrt{${b}}$?`,
        `$\\sqrt{${a}}$ 和 $\\sqrt{${b}}$ 之间有多少个整数？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, b - a, high, answer + 2],
      solution: t(
        `Since $${low * low} < ${a} < ${(low + 1) ** 2}$, the lower root lies between ${low} and ${low + 1}. Since $${high * high} < ${b} < ${(high + 1) ** 2}$, the upper root lies between ${high} and ${high + 1}. So the whole numbers are ${low + 1} to ${high}, and there are $${high} - ${low} = ${answer}$ of them.`,
        `因为 $${low * low} < ${a} < ${(low + 1) ** 2}$，较小的根在 ${low} 和 ${low + 1} 之间。因为 $${high * high} < ${b} < ${(high + 1) ** 2}$，较大的根在 ${high} 和 ${high + 1} 之间。所以这些整数是 ${low + 1} 到 ${high}，共 $${high} - ${low} = ${answer}$ 个。`,
      ),
    });
  },
};

const travelTimeInScientificNotation: KnowledgePointDef = {
  id: "a-travel-time-in-scientific-notation",
  title: t("A travel time in scientific notation", "用科学记数法算行程时间"),
  explanation: t(
    "Distances in space are huge, and scientific notation keeps them manageable. Time is distance divided by speed, so divide the coefficients and subtract the exponents. The exponent of the speed is subtracted, even though it may look like it should be added. Then read the final power of ten to write the answer in standard form. A rough check is to ask whether the size of the time seems reasonable.",
    "太空中的距离非常大，用科学记数法可以方便地处理。时间等于距离除以速度，所以系数相除，指数相减。速度的指数是减去的，哪怕看起来好像应该相加。最后看 10 的幂，把答案写成标准形式。粗略的检验是问问这个时间的大小是否合理。",
  ),
  generate(rng) {
    const [speedTenths, ratio] = rng.pick([
      [12, 2],
      [12, 3],
      [12, 4],
      [12, 5],
      [15, 2],
      [15, 3],
      [15, 4],
      [15, 6],
      [20, 2],
      [20, 3],
      [20, 4],
      [25, 2],
      [25, 3],
      [30, 2],
      [30, 3],
      [40, 2],
    ]) as [number, number];
    const q = rng.int(3, 8);
    const gap = rng.int(1, 5);
    const p = q + gap;
    const distance = Q.of(speedTenths * ratio, 10);
    const speed = Q.of(speedTenths, 10);
    const answer = ratio * 10 ** gap;
    const powerLatex = gap === 1 ? "10" : `10^{${gap}}`;
    return numberProblem({
      prompt: t(
        `A probe travels $${dec(distance)} \\times 10^{${p}}$ km at a steady $${dec(speed)} \\times 10^{${q}}$ km per hour. How many hours does the trip take?`,
        `一个探测器以 $${dec(speed)} \\times 10^{${q}}$ 千米每小时的速度匀速飞行 $${dec(distance)} \\times 10^{${p}}$ 千米。这段旅程要多少小时？`,
      ),
      answer,
      form: "integer",
      wrong: [ratio * 10 ** (gap + 1), ratio * 10 ** (gap - 1), (ratio + 1) * 10 ** gap, ratio * 10 ** (gap + 2)],
      solution: t(
        `Time is distance divided by speed. The coefficients give $${dec(distance)} \\div ${dec(speed)} = ${ratio}$, and the exponents give $${p} - ${q} = ${gap}$. So the time is $${ratio} \\times ${powerLatex} = ${answer}$ hours.`,
        `时间等于距离除以速度。系数相除得 $${dec(distance)} \\div ${dec(speed)} = ${ratio}$，指数相减得 $${p} - ${q} = ${gap}$。所以时间是 $${ratio} \\times ${powerLatex} = ${answer}$ 小时。`,
      ),
    });
  },
};

const normalizingCoefficient: KnowledgePointDef = {
  id: "fixing-a-coefficient-outside-the-range",
  title: t("Fixing a coefficient outside the range", "调整超出范围的系数"),
  explanation: t(
    "A product such as $34$ times a power of ten is not yet in scientific notation, as its coefficient must be at least $1$ and less than $10$. Moving the decimal point changes the coefficient, and the exponent must change in the opposite way so that the value stays the same. A smaller coefficient means a larger exponent, and a larger coefficient means a smaller exponent. Each place moved changes the exponent by one.",
    "像 $34$ 乘以 $10$ 的幂这样的积，还不是科学记数法，因为系数必须大于或等于 $1$ 且小于 $10$。移动小数点会改变系数，指数必须朝相反的方向变，数值才保持不变。系数变小，指数就变大；系数变大，指数就变小。每移动一位，指数变化 $1$。",
  ),
  generate(rng) {
    const digits = rng.pick([...Array(89).keys()].map((i) => i + 11).filter((v) => v % 10 !== 0));
    const shift = rng.pick([-3, -2, -1, 1, 2, 3]);
    const exponent = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
    const proper = Q.of(digits, 10);
    const shown = shift > 0 ? proper.mul(Q.of(10 ** shift)) : proper.div(Q.of(10 ** -shift));
    const answer = exponent + shift;
    const places = Math.abs(shift);
    const placeEn = places === 1 ? "place" : "places";
    return numberProblem({
      prompt: t(
        `Write $${dec(shown)} \\times 10^{${exponent}}$ in scientific notation as $a \\times 10^{k}$. What is $k$?`,
        `把 $${dec(shown)} \\times 10^{${exponent}}$ 写成科学记数法 $a \\times 10^{k}$。$k$ 是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [exponent - shift, exponent, shift, answer + 1, answer - 1],
      solution: t(
        `The coefficient must become $${dec(proper)}$, so the decimal point moves $${places}$ ${placeEn} to the ${shift > 0 ? "left" : "right"}. To keep the value the same, the exponent ${shift > 0 ? "rises" : "falls"} by $${places}$: $${exponent} ${shift > 0 ? "+" : "-"} ${places} = ${answer}$.`,
        `系数要变成 $${dec(proper)}$，所以小数点向${shift > 0 ? "左" : "右"}移 $${places}$ 位。为了保持数值不变，指数${shift > 0 ? "增加" : "减少"} $${places}$：$${exponent} ${shift > 0 ? "+" : "-"} ${places} = ${answer}$。`,
      ),
    });
  },
};

const anotherProportionalPoint: KnowledgePointDef = {
  id: "another-point-on-a-line-through-the-origin",
  title: t("Another point on a line through the origin", "过原点的直线上的另一个点"),
  explanation: t(
    "A line through the origin shows a proportional relationship, so every point on it has the same ratio of $y$ to $x$. That ratio is the slope. One known point therefore gives the slope, and the slope gives the other coordinate of any point. The change between points must be multiplicative and not additive: adding the same amount to each coordinate moves the point away from the line, unless the slope is one.",
    "过原点的直线表示正比例关系，所以线上每个点的 $y$ 与 $x$ 之比都相同。这个比就是斜率。因此一个已知的点给出斜率，斜率又给出任何一点的另一个坐标。点之间的变化必须是相乘，而不是相加：给两个坐标加上同样的量，这个点就离开了直线，除非斜率是 1。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [2, 3],
      [3, 4],
      [3, 2],
      [5, 2],
      [4, 3],
      [5, 3],
      [2, 5],
      [3, 5],
      [5, 4],
      [7, 2],
    ]) as [number, number];
    const u = rng.int(2, 9);
    const v = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((w) => w !== u));
    const a = q * u;
    const b = p * u;
    const c = q * v;
    const answer = p * v;
    return numberProblem({
      prompt: t(
        `A line through the origin passes through $(${a}, ${b})$ and $(${c}, y)$. Find $y$.`,
        `一条过原点的直线经过 $(${a}, ${b})$ 和 $(${c}, y)$。求 $y$。`,
      ),
      answer,
      form: "integer",
      wrong: [b + c - a, Math.round((a * c) / b), c, answer + p, answer + 1],
      solution: t(
        `The slope is $\\frac{${b}}{${a}} = \\frac{${p}}{${q}}$. So $y = \\frac{${p}}{${q}} \\times ${c} = ${answer}$.`,
        `斜率是 $\\frac{${b}}{${a}} = \\frac{${p}}{${q}}$。所以 $y = \\frac{${p}}{${q}} \\times ${c} = ${answer}$。`,
      ),
    });
  },
};

const valueRemovingSolutions: KnowledgePointDef = {
  id: "the-value-that-removes-all-solutions",
  title: t("The value that removes all solutions", "使方程无解的值"),
  explanation: t(
    "A linear equation has no solution when the variable terms cancel and a false statement is left. When a coefficient is unknown and inside parentheses, expand first, so that the coefficient of $x$ is visible on each side. Then set these two coefficients equal to find the unknown. Finally, compare the constants: if they differ, no value of $x$ works; if they are equal, every value of $x$ works instead.",
    "当含变量的项抵消后剩下一个假的等式，一次方程就无解。当系数未知且在括号里时，先展开，让两边 $x$ 的系数都显现出来。然后令这两个系数相等，求出未知数。最后比较常数：如果不同，就没有 $x$ 能满足；如果相同，那么每个 $x$ 都满足。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const answer = rng.int(2, 9);
    const b = rng.int(1, 9);
    const m = a * answer;
    const d = a * b + rng.int(1, 9);
    return numberProblem({
      prompt: t(
        `For which value of $k$ does $${a}(kx + ${b}) = ${m}x + ${d}$ have no solution?`,
        `当 $k$ 取何值时，方程 $${a}(kx + ${b}) = ${m}x + ${d}$ 无解？`,
      ),
      answer,
      form: "integer",
      wrong: [m, m - a, d - b, answer + 1, d - a * b, answer + 2, answer + 3, answer + 4],
      solution: t(
        `Expanding gives $${a}kx + ${a * b} = ${m}x + ${d}$. The $x$ terms cancel when $${a}k = ${m}$, so $k = ${answer}$. That leaves $${a * b} = ${d}$, which is false, so there is no solution.`,
        `展开得 $${a}kx + ${a * b} = ${m}x + ${d}$。当 $${a}k = ${m}$ 时 $x$ 的项抵消，所以 $k = ${answer}$。这时剩下 $${a * b} = ${d}$，这是假的，所以无解。`,
      ),
    });
  },
};

const combinationWithoutSolving: KnowledgePointDef = {
  id: "a-combination-without-solving-the-system",
  title: t("A combination without solving the system", "不解方程组求组合式的值"),
  explanation: t(
    "Sometimes a question asks for $x + y$ or $x - y$ and not for the separate values. If the coefficients of the two equations are swapped, then adding the equations makes the two coefficients equal, and subtracting does the same for the difference. Factoring or dividing then gives the wanted value in one step. Looking at what is asked before solving often saves a good deal of work, and it avoids fractions on the way.",
    "有时题目问的是 $x + y$ 或 $x - y$，而不是各自的值。如果两个方程的系数正好互换，把方程相加会使两个系数相等，相减对差也有同样的效果。接着提取公因数或做除法，一步就得到所要的值。解之前先看清问的是什么，常常能省很多功夫，还能避免中途出现分数。",
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
        asksSum
          ? `Adding the equations gives $${a + b}x + ${a + b}y = ${s + u}$. Dividing by $${a + b}$ gives $x + y = ${answer}$.`
          : `Subtracting the second equation from the first gives $${differenceLeft} = ${s - u}$.${gap === 1 ? "" : ` Dividing by $${gap}$ gives $x - y = ${answer}$.`}`,
        asksSum
          ? `两个方程相加得 $${a + b}x + ${a + b}y = ${s + u}$。除以 $${a + b}$ 得 $x + y = ${answer}$。`
          : `第一个方程减去第二个方程得 $${differenceLeft} = ${s - u}$。${gap === 1 ? "" : `除以 $${gap}$ 得 $x - y = ${answer}$。`}`,
      ),
    });
  },
};

const plansCostingTheSame: KnowledgePointDef = {
  id: "when-two-plans-cost-the-same",
  title: t("When two plans cost the same", "两种方案花费相同的时刻"),
  explanation: t(
    "Two linear functions can be described in different ways, one in words and the other through a pair of values. Put both into the same form by finding each rate of change and each starting value. Setting the two expressions equal then shows when the functions agree. Beyond that point, the function with the larger rate has the larger value, which is the practical reason to compare two plans in this way.",
    "两个一次函数可以用不同方式描述，一个用文字，另一个用两组数值。求出各自的变化率和起始值，把它们写成同样的形式。令两个式子相等，就知道两个函数何时一致。过了这一点，变化率较大的函数值就较大，这正是这样比较两种方案的实际原因。",
  ),
  generate(rng) {
    const q = rng.int(3, 15);
    const r = q + rng.int(1, 12);
    const answer = rng.int(3, 24);
    const a = rng.int(5, 40);
    const b = a + (r - q) * answer;
    const t1 = rng.int(1, 3);
    const t2 = t1 + rng.int(2, 6);
    const y1 = b + q * t1;
    const y2 = b + q * t2;
    const gap = r - q;
    return numberProblem({
      prompt: t(
        `Plan A costs ${a} dollars to join and ${r} dollars per month. Plan B also has a joining fee and a fixed monthly price: its total is ${y1} dollars after ${t1} ${t1 === 1 ? "month" : "months"} and ${y2} dollars after ${t2} months. After how many months do the two plans have the same total?`,
        `方案 A 入会费 ${a} 美元，每月 ${r} 美元。方案 B 也有入会费和固定月费：${t1} 个月后总额是 ${y1} 美元，${t2} 个月后总额是 ${y2} 美元。多少个月后两种方案的总额相同？`,
      ),
      answer,
      form: "integer",
      wrong: [b - a, answer + 1, answer - 1, answer + 2, Math.round((y1 - a) / r), Math.round(b / r)],
      solution: t(
        `Plan B rises $${y2 - y1} \\div ${t2 - t1} = ${q}$ dollars per month, so its fee is $${y1} - ${q * t1} = ${b}$. Then $${a} + ${r}m = ${b} + ${q}m$, which gives ${gap === 1 ? `$m = ${answer}$` : `$${gap}m = ${b - a}$ and $m = ${answer}$`}.`,
        `方案 B 每月增加 $${y2 - y1} \\div ${t2 - t1} = ${q}$ 美元，所以入会费是 $${y1} - ${q * t1} = ${b}$ 美元。于是 $${a} + ${r}m = ${b} + ${q}m$，得 ${gap === 1 ? `$m = ${answer}$` : `$${gap}m = ${b - a}$，$m = ${answer}$`}。`,
      ),
    });
  },
};

const whenTankEmpties: KnowledgePointDef = {
  id: "when-a-linear-model-reaches-zero",
  title: t("When a linear model reaches zero", "线性模型何时变为零"),
  explanation: t(
    "Two readings of a steadily changing quantity fix the whole linear model. The rate comes from the difference of the readings divided by the time between them. To find when the quantity runs out, divide the amount left at a reading by the rate, and then add the time of that reading. Forgetting to add it gives the time after the reading, and not the time since the start, which is the common slip.",
    "匀速变化的量的两个读数，就确定了整个线性模型。变化率等于读数之差除以两次读数之间的时间。要知道这个量何时用完，用某次读数时剩下的量除以变化率，再加上那次读数的时间。忘了加，得到的就是从那次读数算起的时间，而不是从开始算起的时间，这是常见的差错。",
  ),
  generate(rng) {
    const rate = rng.int(2, 12);
    const answer = rng.int(15, 60);
    const t1 = rng.int(2, 6);
    const t2 = t1 + rng.int(2, 8);
    const v1 = rate * (answer - t1);
    const v2 = rate * (answer - t2);
    return numberProblem({
      prompt: t(
        `A tank drains at a steady rate. After ${t1} minutes it holds ${v1} liters, and after ${t2} minutes it holds ${v2} liters. How many minutes after the start is it empty?`,
        `一个水箱匀速放水。${t1} 分钟后还有 ${v1} 升，${t2} 分钟后还有 ${v2} 升。开始后多少分钟水箱放空？`,
      ),
      answer,
      form: "integer",
      wrong: [answer - t2, answer - t1, answer + t1, answer + 1, rate],
      solution: t(
        `The tank loses $(${v1} - ${v2}) \\div ${t2 - t1} = ${rate}$ liters per minute. The ${v2} liters left at ${t2} minutes last $${v2} \\div ${rate} = ${answer - t2}$ more minutes, so it is empty at $${t2} + ${answer - t2} = ${answer}$ minutes.`,
        `水箱每分钟减少 $(${v1} - ${v2}) \\div ${t2 - t1} = ${rate}$ 升。${t2} 分钟时剩下的 ${v2} 升还能放 $${v2} \\div ${rate} = ${answer - t2}$ 分钟，所以在 $${t2} + ${answer - t2} = ${answer}$ 分钟时放空。`,
      ),
    });
  },
};

const sidesFromAngleRatio: KnowledgePointDef = {
  id: "sides-from-the-ratio-of-interior-to-exterior",
  title: t("Sides from the ratio of interior to exterior", "由内外角之比求边数"),
  explanation: t(
    "At each vertex of a polygon, the interior and exterior angles form a straight line, so they add up to $180$ degrees. If their ratio is known, then splitting $180$ degrees in that ratio gives both angles. The exterior angles of a regular polygon add up to $360$ degrees, so dividing $360$ degrees by one exterior angle gives the number of sides. Using the exterior angle is much simpler than the interior angle formula.",
    "在多边形的每个顶点，内角和外角组成一条直线，所以它们的和是 $180$ 度。如果知道它们的比，按这个比分配 $180$ 度就得到这两个角。正多边形的外角和是 $360$ 度，所以用 $360$ 度除以一个外角，就得到边数。用外角比用内角公式简单得多。",
  ),
  generate(rng) {
    const answer = rng.int(5, 60);
    const even = answer % 2 === 0;
    const p = even ? (answer - 2) / 2 : answer - 2;
    const q = even ? 1 : 2;
    const exterior = Q.of(360, answer);
    return numberProblem({
      prompt: t(
        `In a regular polygon, each interior angle and each exterior angle are in the ratio $${p}:${q}$. How many sides does the polygon have?`,
        `在一个正多边形中，每个内角和每个外角的比是 $${p}:${q}$。这个多边形有多少条边？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 2, answer + 2, 2 * (p + q) + 1, p],
      solution: t(
        `The two angles add up to $180^\\circ$, so the exterior angle is $180^\\circ \\times \\frac{${q}}{${p + q}} = ${exterior.toLatex()}^\\circ$. The exterior angles add up to $360^\\circ$, so there are $360 \\div ${exterior.toLatex()} = ${answer}$ sides.`,
        `两个角的和是 $180^\\circ$，所以外角是 $180^\\circ \\times \\frac{${q}}{${p + q}} = ${exterior.toLatex()}^\\circ$。外角和是 $360^\\circ$，所以边数是 $360 \\div ${exterior.toLatex()} = ${answer}$。`,
      ),
    });
  },
};

const isoscelesExterior: KnowledgePointDef = {
  id: "an-exterior-angle-of-an-isosceles-triangle",
  figure: gradeDrawings5["exterior-angles-of-triangles#an-exterior-angle-of-an-isosceles-triangle"],
  title: t("An exterior angle of an isosceles triangle", "等腰三角形的外角"),
  explanation: t(
    "An exterior angle equals the sum of the two interior angles that are not next to it. In an isosceles triangle, this has a useful form. At the apex, the two opposite angles are the equal base angles, so the exterior angle is twice one of them. At a base vertex, the exterior angle is next to one base angle, which is found first, and the base angles then give the apex by the angle sum.",
    "外角等于和它不相邻的两个内角之和。在等腰三角形中，这有一个很有用的形式。在顶点处，不相邻的两个角是相等的底角，所以外角是一个底角的两倍。在底角的顶点处，外角和一个底角相邻，先求出这个底角，再由内角和从两个底角求出顶角。",
  ),
  generate(rng) {
    const atApex = rng.bool();
    const exterior = atApex ? 2 * rng.int(20, 85) : 2 * rng.int(48, 85);
    const answer = atApex ? exterior / 2 : 2 * exterior - 180;
    return numberProblem({
      prompt: atApex
        ? t(
            `An exterior angle at the apex of an isosceles triangle measures $${exterior}^\\circ$. What is each base angle, in degrees?`,
            `等腰三角形顶角处的一个外角是 $${exterior}^\\circ$。每个底角是多少度？`,
          )
        : t(
            `An exterior angle at a base vertex of an isosceles triangle measures $${exterior}^\\circ$. What is the apex angle, in degrees?`,
            `等腰三角形一个底角处的外角是 $${exterior}^\\circ$。顶角是多少度？`,
          ),
      answer,
      form: "integer",
      wrong: [180 - exterior, exterior, atApex ? (180 - exterior) / 2 + 45 : exterior - 90, answer + 10, 360 - exterior],
      solution: t(
        atApex
          ? `The exterior angle equals the sum of the two equal base angles, so each is $${exterior}^\\circ \\div 2 = ${answer}^\\circ$.`
          : `Each base angle is $180^\\circ - ${exterior}^\\circ = ${180 - exterior}^\\circ$. So the apex is $180^\\circ - 2 \\times ${180 - exterior}^\\circ = ${answer}^\\circ$.`,
        atApex
          ? `外角等于两个相等的底角之和，所以每个底角是 $${exterior}^\\circ \\div 2 = ${answer}^\\circ$。`
          : `每个底角是 $180^\\circ - ${exterior}^\\circ = ${180 - exterior}^\\circ$。所以顶角是 $180^\\circ - 2 \\times ${180 - exterior}^\\circ = ${answer}^\\circ$。`,
      ),
    });
  },
};

const bendBetweenParallels: KnowledgePointDef = {
  id: "the-angle-at-a-bend-between-parallel-lines",
  figure: gradeDrawings3["alternate-angles#the-angle-at-a-bend-between-parallel-lines"],
  title: t("The angle at a bend between parallel lines", "平行线之间折线的夹角"),
  explanation: t(
    "A path can bend at a point between two parallel lines. To find the angle at the bend, draw a third line through that point, parallel to the others. This splits the angle at the bend into two parts. Each part is an alternate angle to one of the given angles, so it equals that angle. The angle at the bend is therefore their sum. Drawing an extra line like this is a standard step in geometry.",
    "一条折线可以在两条平行线之间的一点转折。要求转折处的角，就过这一点作第三条直线，与另外两条平行。这把转折处的角分成两部分。每部分都和一个已知角是内错角，所以与那个角相等。因此转折处的角就是它们的和。像这样添一条辅助线，是几何中的标准步骤。",
  ),
  generate(rng) {
    const a = rng.int(20, 80);
    const b = rng.int(20, 80);
    const answer = a + b;
    return numberProblem({
      prompt: t(
        `Lines $\\ell$ and $m$ are parallel. Point $A$ is on $\\ell$, point $B$ is on $m$, and point $P$ lies between the lines. Rays $AC$ on $\\ell$ and $BD$ on $m$ point the same way, with $P$ on their side of line $AB$. If $\\angle CAP = ${a}^\\circ$ and $\\angle DBP = ${b}^\\circ$, what is $\\angle APB$, in degrees?`,
        `直线 $\\ell$ 和 $m$ 平行。点 $A$ 在 $\\ell$ 上，点 $B$ 在 $m$ 上，点 $P$ 在两条直线之间。$\\ell$ 上的射线 $AC$ 和 $m$ 上的射线 $BD$ 方向相同，$P$ 与它们在直线 $AB$ 的同一侧。如果 $\\angle CAP = ${a}^\\circ$，$\\angle DBP = ${b}^\\circ$，那么 $\\angle APB$ 是多少度？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.abs(a - b), 180 - answer, 360 - answer, answer + 10, 180 - a],
      solution: t(
        `Draw a line through $P$ parallel to $\\ell$ and $m$. It splits $\\angle APB$ into two parts, which are alternate angles to the given ones. So $\\angle APB = ${a}^\\circ + ${b}^\\circ = ${answer}^\\circ$.`,
        `过 $P$ 作一条与 $\\ell$、$m$ 平行的直线。它把 $\\angle APB$ 分成两部分，分别与已知角是内错角。所以 $\\angle APB = ${a}^\\circ + ${b}^\\circ = ${answer}^\\circ$。`,
      ),
    });
  },
};

/** deeperGrade8Points maps topics of 8th Grade Math to further knowledge points. */
export const deeperGrade8Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-zeroth-power": [exponentGivingOne],
  "negative-exponents": [exponentForUnitFraction],
  "the-product-rule-for-exponents": [missingExponent],
  "the-power-rule-for-exponents": [powersOfDifferentBases],
  "the-fundamental-theorem-of-arithmetic": [countingFactors],
  "finding-lowest-common-multiples-using-prime-factorization": [otherNumberFromGcfLcm],
  "finding-greatest-common-factors-using-prime-factorization": [squareTiles],
  "divisibility-of-integers-by-3-9-6-and-7": [missingDigit],
  "solving-radical-equations-with-square-roots": [twoRootsEqual],
  "simplifying-square-roots": [underOneRoot],
  "approximating-square-roots-and-cube-roots": [wholeBetweenRoots],
  "dividing-numbers-in-scientific-notation": [travelTimeInScientificNotation],
  "writing-numbers-in-scientific-notation": [normalizingCoefficient],
  "slope-as-a-unit-rate-in-proportional-relationships": [anotherProportionalPoint],
  "linear-equations-with-no-solutions": [valueRemovingSolutions],
  "introduction-to-elimination": [combinationWithoutSolving],
  "comparing-properties-of-two-functions-represented-differently": [plansCostingTheSame],
  "interpreting-rate-of-change-and-initial-value-in-context": [whenTankEmpties],
  "exterior-angles-of-polygons": [sidesFromAngleRatio],
  "exterior-angles-of-triangles": [isoscelesExterior],
  "alternate-angles": [bendBetweenParallels],
};
