// Further knowledge points for topics of 4th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade4Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";

/** gcd4 is the greatest common factor of two positive integers. */
const gcd4 = (a: number, b: number): number => (b === 0 ? a : gcd4(b, a % b));
/** factorsOf lists the factors of a positive integer in increasing order. */
const factorsOf = (n: number) => [...Array(n).keys()].map((i) => i + 1).filter((d) => n % d === 0);
/** isPrime says whether a whole number is prime. */
const isPrime = (n: number) => n > 1 && factorsOf(n).length === 2;

const smallestThatRounds: KnowledgePointDef = {
  id: "the-smallest-number-that-rounds-to-a-value",
  title: t("The smallest or largest number that rounds to a value", "四舍五入到某值的最小数或最大数"),
  explanation: t(
    "Rounding can be run backwards. Many numbers round to the same value, and they form a block around it. When rounding to the nearest hundred, the block reaches 50 below the value, because a number exactly halfway rounds up. It reaches only 49 above the value, because the next number would round up to the following hundred. So the two ends of the block are not the same distance away.",
    "四舍五入可以倒过来想。许多数会舍入到同一个值，它们在这个值周围形成一段。舍入到最近的百位时，这一段向下延伸 50，因为恰好在正中间的数要向上舍入。向上只延伸 49，因为再大一个数就会舍入到下一个百。所以这一段的两端与这个值的距离不一样。",
  ),
  generate(rng) {
    const place = rng.pick([10, 100, 1000]);
    const value = rng.int(2, 90) * place;
    const smallest = rng.pick([true, false]);
    const half = place / 2;
    const answer = smallest ? value - half : value + half - 1;
    const name = place === 10 ? ["ten", "十位"] : place === 100 ? ["hundred", "百位"] : ["thousand", "千位"];
    return numberProblem({
      prompt: t(
        `A whole number rounds to ${value} when rounded to the nearest ${name[0]}. What is the ${smallest ? "smallest" : "largest"} that number can be?`,
        `一个整数舍入到最近的${name[1]}后是 ${value}。这个数${smallest ? "最小" : "最大"}是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [
        smallest ? value - half + 1 : value + half,
        smallest ? value - place : value + place,
        value,
        smallest ? value - half - 1 : value + half - 2,
      ],
      solution: t(
        smallest
          ? `A number exactly halfway rounds up, so the block starts ${half} below ${value}, at ${answer}.`
          : `A number exactly halfway to the next ${name[0]} would round up to it, so the block stops just before ${value + half}, at ${answer}.`,
        smallest
          ? `恰好在正中间的数要向上舍入，所以这一段从 ${value} 往下 ${half} 开始，也就是 ${answer}。`
          : `恰好在到下一个${name[1]}正中间的数会向上舍入，所以这一段在 ${value + half} 之前结束，也就是 ${answer}。`,
      ),
    });
  },
};

const estimateError: KnowledgePointDef = {
  id: "how-far-an-estimate-is-from-the-exact-sum",
  title: t("How far an estimate is from the exact sum", "估算值与准确和相差多少"),
  explanation: t(
    "An estimate is useful because it is quick, but it is not exact, and it helps to know how close it came. Rounding each number before adding moves the sum a little. One number may be pushed up while the other is pushed down, and so the two changes can partly cancel. To measure the error, work out both the estimate and the exact sum, and then subtract the smaller from the larger.",
    "估算的好处是快，但它不准确，了解它有多接近很有帮助。相加前把每个数舍入，会使和稍有变化。一个数可能被往上推，另一个被往下推，所以两个变化可能部分抵消。要量出误差，就算出估算值和准确和，再用较大的减去较小的。",
  ),
  generate(rng) {
    const a = rng.int(120, 980);
    const b = rng.int(120, 980);
    const round = (n: number) => Math.round(n / 100) * 100;
    const estimate = round(a) + round(b);
    const exact = a + b;
    const answer = Math.abs(estimate - exact);
    return numberProblem({
      prompt: t(
        `Estimate $${a} + ${b}$ by rounding each number to the nearest hundred before adding. How far is the estimate from the exact sum?`,
        `先把每个数舍入到最近的百位，再相加来估算 $${a} + ${b}$。估算值与准确和相差多少？`,
      ),
      answer,
      form: "integer",
      wrong: [estimate, exact, Math.abs(round(a) - a), Math.abs(round(b) - b), answer + 10, answer + 20, answer + 100],
      solution: t(
        `The estimate is $${round(a)} + ${round(b)} = ${estimate}$, and the exact sum is ${exact}. They differ by ${answer}.`,
        `估算值是 $${round(a)} + ${round(b)} = ${estimate}$，准确和是 ${exact}。两者相差 ${answer}。`,
      ),
    });
  },
};

const largestDifferenceFromDigits: KnowledgePointDef = {
  id: "the-largest-difference-from-three-digits",
  title: t("The largest difference from three digits", "用三个数字组成的最大差"),
  explanation: t(
    "To make a difference as large as possible, make the first number as large as possible and the second as small as possible. With a given set of digits, the largest number puts the biggest digit in the highest place, and the smallest number puts the smallest digit there. Place value decides this, because a digit in the hundreds place counts for far more than the same digit in the ones place.",
    "要让差尽可能大，就让被减数尽可能大，减数尽可能小。用给定的几个数字，最大的数把最大的数字放在最高位，最小的数把最小的数字放在最高位。这是由位值决定的，因为百位上的数字比个位上同样的数字大得多。",
  ),
  generate(rng) {
    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const a = rng.pick(pool);
    const b = rng.pick(pool.filter((v) => v !== a));
    const c = rng.pick(pool.filter((v) => v !== a && v !== b));
    const [low, middle, high] = [a, b, c].sort((x, y) => x - y) as [number, number, number];
    const largest = 100 * high + 10 * middle + low;
    const smallest = 100 * low + 10 * middle + high;
    const answer = largest - smallest;
    return numberProblem({
      prompt: t(
        `Use the digits ${a}, ${b} and ${c}, each once, to write a three-digit number. Then use them again to write a second three-digit number. What is the largest possible difference between the two numbers?`,
        `用数字 ${a}、${b}、${c} 各一次写一个三位数，再用它们写第二个三位数。这两个数的差最大是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [largest, smallest, largest + smallest, answer - 90, answer + 90],
      solution: t(
        `The largest number is ${largest} and the smallest is ${smallest}. Their difference is $${largest} - ${smallest} = ${answer}$.`,
        `最大的数是 ${largest}，最小的数是 ${smallest}。它们的差是 $${largest} - ${smallest} = ${answer}$。`,
      ),
    });
  },
};

const countingFactors: KnowledgePointDef = {
  id: "counting-the-factors-of-a-number",
  title: t("Counting the factors of a number", "数一个数的因数个数"),
  explanation: t(
    "Factors come in pairs, because each multiplication fact gives two of them. So a tidy way to find all the factors is to try $1, 2, 3$ and so on, and to write down both numbers of each pair. Once the numbers in a pair start to repeat, the search is finished. A square number has one pair with two equal numbers, and this number must be counted only once.",
    "因数是成对出现的，因为每个乘法算式给出两个因数。所以找出所有因数的好办法是依次试 $1, 2, 3$ 等，把每一对的两个数都写下来。当一对中的数开始重复时，就找完了。平方数有一对数相等，这个数只能算一次。",
  ),
  generate(rng) {
    const n = rng.int(12, 100);
    const factors = factorsOf(n);
    const answer = factors.length;
    return numberProblem({
      prompt: t(`How many different factors does ${n} have?`, `${n} 有多少个不同的因数？`),
      answer,
      form: "integer",
      wrong: [answer - 1, answer + 3, answer + 1, answer + 2, n],
      solution: t(
        `Listing them in pairs gives ${factors.join(", ")}. That is ${answer} factors.`,
        `列出各对，得 ${factors.join("、")}。一共有 ${answer} 个因数。`,
      ),
    });
  },
};

const nextPrime: KnowledgePointDef = {
  id: "the-next-prime-after-a-number",
  title: t("The next prime after a number", "一个数之后的下一个质数"),
  explanation: t(
    "Primes have no regular pattern, so the next prime is found by testing the numbers that follow, one at a time. Most can be ruled out quickly. Even numbers above 2 are never prime, and numbers ending in 5 are multiples of 5. For the rest, try dividing by 3 and by 7. A number can look prime when it is not: 51, 57 and 91 are all composite, because of factors that are easy to overlook.",
    "质数没有规律可循，所以要找下一个质数，就依次检验后面的数。大多数数很快就能排除。大于 2 的偶数都不是质数，个位是 5 的数是 5 的倍数。其余的数，试着除以 3 和 7。有些数看起来像质数，其实不是：51、57、91 都是合数，它们的因数容易被忽略。",
  ),
  generate(rng) {
    const n = rng.int(10, 110);
    let answer = n + 1;
    while (!isPrime(answer)) answer += 1;
    const skipped = [...Array(answer - n - 1).keys()].map((i) => n + 1 + i);
    const decoy = skipped.find((v) => v % 2 !== 0 && v % 5 !== 0);
    return numberProblem({
      prompt: t(`What is the first prime number greater than ${n}?`, `比 ${n} 大的第一个质数是多少？`),
      answer,
      form: "integer",
      wrong: [decoy ?? answer + 2, n + 1, answer + 2, answer + 1, n + 3, answer + 3, answer + 4],
      solution: t(
        skipped.length > 0
          ? `${skipped.length === 1 ? `The number ${skipped[0]} has` : `The numbers ${skipped.join(", ")} all have`} factors other than 1 and ${skipped.length === 1 ? "itself" : "themselves"}. The number ${answer} has no such factor, so it is the first prime.`
          : `The next number, ${answer}, has no factors other than 1 and itself, so it is the first prime.`,
        skipped.length > 0
          ? `${skipped.join("、")} 都有除 1 和它本身以外的因数。${answer} 没有这样的因数，所以它是第一个质数。`
          : `下一个数 ${answer} 除 1 和它本身外没有其他因数，所以它就是第一个质数。`,
      ),
    });
  },
};

const whenEventsMeet: KnowledgePointDef = {
  id: "when-two-repeating-events-meet-again",
  title: t("When two repeating events meet again", "两件重复的事何时再次同时发生"),
  explanation: t(
    "When two things repeat on different schedules, they happen together at the common multiples of their two gaps. The first time they happen together again is therefore the least common multiple. Multiplying the two gaps always gives a time when they meet, but it is often not the first one, because the two gaps may share a factor. Listing the multiples of the larger gap is the quickest way to find the answer.",
    "两件事按不同的周期重复时，它们会在两个周期的公倍数时刻同时发生。所以它们第一次再同时发生，就是在最小公倍数时刻。把两个周期相乘总能得到一个同时发生的时刻，但往往不是第一次，因为两个周期可能有公因数。列出较大周期的倍数是最快的办法。",
  ),
  generate(rng) {
    const a = rng.pick([4, 6, 8, 9, 10, 12, 14, 15]);
    const b = rng.pick([4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20].filter((v) => v !== a && gcd4(v, a) > 1));
    const answer = (a * b) / gcd4(a, b);
    const scene = rng.pick([
      ["Two lights flash", "两盏灯闪烁", "seconds", "秒"],
      ["Two buses leave a stop", "两路公交车从车站发车", "minutes", "分钟"],
      ["Two bells ring", "两口钟鸣响", "minutes", "分钟"],
    ]) as [string, string, string, string];
    return numberProblem({
      prompt: t(
        `${scene[0]} together. One repeats every ${a} ${scene[2]} and the other every ${b} ${scene[2]}. After how many ${scene[2]} do they next happen together?`,
        `${scene[1]}，刚好同时。一个每 ${a} ${scene[3]}重复一次，另一个每 ${b} ${scene[3]}重复一次。再过多少${scene[3]}它们下一次同时发生？`,
      ),
      answer,
      form: "integer",
      wrong: [a * b, a + b, gcd4(a, b), Math.abs(a - b), 2 * answer],
      solution: t(
        `They happen together at the common multiples of ${a} and ${b}. The least common multiple is ${answer}.`,
        `它们在 ${a} 和 ${b} 的公倍数时刻同时发生。最小公倍数是 ${answer}。`,
      ),
    });
  },
};

const largestEqualGroups: KnowledgePointDef = {
  id: "the-largest-equal-groups",
  title: t("The largest equal groups", "最多能分成多少个相同的组"),
  explanation: t(
    "If two kinds of objects are shared out into identical groups with nothing left over, the number of groups must divide both amounts. So the number of groups is a common factor, and the greatest number of groups possible is the greatest common factor. This is different from a question about when two events meet, which needs a common multiple. In a sharing question, the answer can never be larger than the smaller amount.",
    "如果把两种物品分成相同的若干组，没有剩余，那么组数必须同时整除两个数量。所以组数是公因数，最多的组数就是最大公因数。这与两件事何时同时发生的问题不同，那要用公倍数。在分组问题中，答案绝不会大于较小的数量。",
  ),
  generate(rng) {
    const g = rng.int(3, 12);
    const p = rng.int(2, 8);
    const q = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== p && gcd4(v, p) === 1));
    const a = g * p;
    const b = g * q;
    const asksGroups = rng.pick([true, false]);
    const answer = asksGroups ? g : p + q;
    return numberProblem({
      prompt: t(
        `A teacher shares ${a} pencils and ${b} erasers into identical groups, with nothing left over, making as many groups as possible. ${asksGroups ? "How many groups are there?" : "How many items in all are in each group?"}`,
        `老师把 ${a} 支铅笔和 ${b} 块橡皮分成相同的若干组，没有剩余，并且组数尽可能多。${asksGroups ? "一共有多少组？" : "每组一共有多少件物品？"}`,
      ),
      answer,
      form: "integer",
      wrong: [asksGroups ? p + q : g, a + b, (a * b) / g, Math.abs(a - b), answer + 1],
      solution: t(
        `The number of groups must divide both ${a} and ${b}, and the greatest common factor is ${g}. So there are ${g} groups${asksGroups ? "" : `, each with ${p} pencils and ${q} erasers, which is ${answer} items`}.`,
        `组数必须同时整除 ${a} 和 ${b}，最大公因数是 ${g}。所以有 ${g} 组${asksGroups ? "" : `，每组有 ${p} 支铅笔和 ${q} 块橡皮，共 ${answer} 件`}。`,
      ),
    });
  },
};

const countingMultiples: KnowledgePointDef = {
  id: "counting-multiples-up-to-a-number",
  title: t("Counting multiples up to a number", "数到某个数为止的倍数个数"),
  explanation: t(
    "To count the multiples of a number up to some limit, there is no need to list them. Each multiple is one more group of that number, so the question asks how many whole groups fit in the limit. That is a division, and the remainder is ignored, because a part of a group does not make another multiple. The same thinking also tells how many numbers in a list are divisible by a given number.",
    "要数到某个上限为止的倍数个数，不必一一列出。每个倍数就是多一组这个数，所以问题是上限里能放下多少个完整的组。这就是除法，余数不用管，因为不满一组就不是另一个倍数。同样的想法也能算出一列数中有多少个能被给定的数整除。",
  ),
  generate(rng) {
    const k = rng.int(3, 12);
    const limit = rng.int(40, 300);
    const answer = Math.floor(limit / k);
    return numberProblem({
      prompt: t(`How many multiples of ${k} are there from 1 to ${limit}?`, `从 1 到 ${limit} 有多少个 ${k} 的倍数？`),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, limit % k, limit - k, answer + 2],
      solution: t(
        `Dividing, $${limit} \\div ${k}$ is ${answer} with remainder ${limit % k}. So ${answer} whole groups of ${k} fit, and the last multiple is ${answer * k}.`,
        `做除法，$${limit} \\div ${k}$ 商 ${answer} 余 ${limit % k}。所以能放下 ${answer} 组 ${k}，最后一个倍数是 ${answer * k}。`,
      ),
    });
  },
};

const dividendFromQuotient: KnowledgePointDef = {
  id: "the-dividend-from-the-quotient-and-remainder",
  title: t("The dividend from the quotient and remainder", "由商和余数求被除数"),
  explanation: t(
    "A division with a remainder can be checked, or undone, by multiplication. If a number is divided by $d$ to give a quotient $q$ and a remainder $r$, then the number was made of $q$ groups of $d$ together with $r$ left over. So the number equals $q \\times d + r$. Forgetting to add the remainder is the most common slip, and a check by dividing again will catch it.",
    "带余数的除法可以用乘法来检验或还原。如果一个数除以 $d$，商是 $q$，余数是 $r$，那么这个数由 $q$ 组 $d$ 和剩下的 $r$ 组成。所以这个数等于 $q \\times d + r$。忘记加余数是最常见的差错，再除一次检验就能发现。",
  ),
  generate(rng) {
    const d = rng.int(3, 12);
    const q = rng.int(6, 99);
    const r = rng.int(1, d - 1);
    const answer = q * d + r;
    return numberProblem({
      prompt: t(
        `When a number is divided by ${d}, the quotient is ${q} and the remainder is ${r}. What is the number?`,
        `一个数除以 ${d}，商是 ${q}，余数是 ${r}。这个数是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [q * d, q * d - r, q * (d + r), q + d + r, answer + d],
      solution: t(
        `The number is ${q} groups of ${d} and ${r} more: $${q} \\times ${d} + ${r} = ${answer}$.`,
        `这个数是 ${q} 组 ${d} 再加 ${r}：$${q} \\times ${d} + ${r} = ${answer}$。`,
      ),
    });
  },
};

const largestWithQuotient: KnowledgePointDef = {
  id: "the-largest-number-with-a-given-quotient",
  title: t("The largest number with a given quotient", "商一定时的最大被除数"),
  explanation: t(
    "A remainder must always be smaller than the divisor, because otherwise another whole group would fit. So when dividing by $d$, the largest possible remainder is $d - 1$. This also decides which numbers share a quotient: the numbers run from an exact multiple up to just below the next multiple. The largest number with a given quotient therefore has the largest possible remainder, and the next number up has a larger quotient.",
    "余数总是小于除数，否则还能再放下一组。所以除以 $d$ 时，最大的余数是 $d - 1$。这也决定了哪些数的商相同：它们从一个整倍数开始，一直到下一个倍数之前。所以商一定时最大的被除数有最大的余数，再大一个数商就变大了。",
  ),
  generate(rng) {
    const d = rng.int(3, 12);
    const q = rng.int(5, 60);
    const answer = q * d + d - 1;
    return numberProblem({
      prompt: t(
        `A whole number divided by ${d} has quotient ${q} and some remainder. What is the largest that number can be?`,
        `一个整数除以 ${d}，商是 ${q}，还有余数。这个数最大是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [q * d, answer + 1, q * d + d, q * d + 1, answer - 1],
      solution: t(
        `The largest remainder when dividing by ${d} is ${d - 1}. So the number is $${q} \\times ${d} + ${d - 1} = ${answer}$.`,
        `除以 ${d} 时最大的余数是 ${d - 1}。所以这个数是 $${q} \\times ${d} + ${d - 1} = ${answer}$。`,
      ),
    });
  },
};

const fullHundreds: KnowledgePointDef = {
  id: "how-many-full-groups-of-a-power-of-ten",
  title: t("How many full groups of a power of ten", "能装满多少组 10 的幂"),
  explanation: t(
    "Dividing by 10, 100 or 1000 is easy to read from the digits when the number does not end in enough zeros. The digits to the left show how many full groups fit, and the digits that drop off on the right are the remainder. So for 1000, the last three digits are what is left over. In a packing problem, only the full groups count, and the leftover is what remains unpacked.",
    "当一个数末尾的零不够多时，除以 10、100 或 1000 也很容易从数字上读出来。左边的数字表示能装满多少组，右边去掉的数字就是余数。所以除以 1000 时，最后三位就是剩下的部分。在装箱问题中，只有装满的组才算，余数是没有装箱的部分。",
  ),
  generate(rng) {
    const size = rng.pick([10, 100, 1000]);
    const n = rng.int(1200, 98000) + rng.int(1, 9);
    const count = n % size === 0 ? n + 1 : n;
    const groups = Math.floor(count / size);
    const left = count % size;
    const asksLeft = rng.pick([true, false]);
    const answer = asksLeft ? left : groups;
    return numberProblem({
      prompt: t(
        `A factory packs ${count} nails into boxes of ${size}. ${asksLeft ? "How many nails are left after filling as many boxes as possible?" : "How many boxes can it fill?"}`,
        `工厂把 ${count} 枚钉子装进每盒 ${size} 枚的盒子。${asksLeft ? "尽量装满后还剩多少枚？" : "能装满多少盒？"}`,
      ),
      answer,
      form: "integer",
      wrong: [asksLeft ? groups : left, answer + 1, size - left, asksLeft ? left + size : groups * 10, count],
      solution: t(
        `Dividing by ${size} gives ${groups} with remainder ${left}. So ${groups} boxes are full and ${left} ${left === 1 ? "nail is" : "nails are"} left.`,
        `除以 ${size}，商 ${groups} 余 ${left}。所以装满 ${groups} 盒，还剩 ${left} 枚。`,
      ),
    });
  },
};

const totalFromTimes: KnowledgePointDef = {
  id: "two-amounts-from-a-total-and-a-times-comparison",
  title: t("Two amounts from a total and a times comparison", "由总数和倍数关系求两个量"),
  explanation: t(
    "If one amount is some number of times another, draw the smaller amount as one bar and the larger as several bars of the same size. Together they make one more bar than the comparison number says. Dividing the total by the number of bars gives the size of one bar, which is the smaller amount. A common slip is to divide by the comparison number itself, forgetting the bar for the smaller amount.",
    "如果一个量是另一个量的若干倍，就把较小的量画成一条，把较大的量画成同样大小的若干条。合起来比倍数多一条。用总数除以条数，就得到一条的大小，也就是较小的量。常见的差错是直接除以倍数，忘了较小的量那一条。",
  ),
  generate(rng) {
    const k = rng.int(2, 7);
    const small = rng.int(6, 60);
    const total = small * (k + 1);
    const asksLarge = rng.pick([true, false]);
    const answer = asksLarge ? small * k : small;
    return numberProblem({
      prompt: t(
        `Maya and Leo have ${total} stickers in all. Maya has ${k} times as many as Leo. How many stickers does ${asksLarge ? "Maya" : "Leo"} have?`,
        `玛雅和利奥一共有 ${total} 张贴纸。玛雅的贴纸是利奥的 ${k} 倍。${asksLarge ? "玛雅" : "利奥"}有多少张贴纸？`,
      ),
      answer,
      form: "integer",
      wrong: [asksLarge ? small : small * k, Math.floor(total / k), total - k, answer + small, total],
      solution: t(
        `Leo is 1 bar and Maya is ${k} bars, which makes ${k + 1} bars. One bar is $${total} \\div ${k + 1} = ${small}$${asksLarge ? `, so Maya has $${k} \\times ${small} = ${answer}$` : ""}.`,
        `利奥是 1 条，玛雅是 ${k} 条，共 ${k + 1} 条。一条是 $${total} \\div ${k + 1} = ${small}$${asksLarge ? `，所以玛雅有 $${k} \\times ${small} = ${answer}$ 张` : ""}。`,
      ),
    });
  },
};

const termOfPattern: KnowledgePointDef = {
  id: "a-far-term-of-an-adding-pattern",
  title: t("A far term of an adding pattern", "加法规律中很靠后的一项"),
  explanation: t(
    "A pattern that adds the same number each time does not need to be written out to reach a far term. To get from the first term to the term in position $n$, the rule is applied $n - 1$ times, since the first term already stands in position 1. So multiply the step by one less than the position, and add the result to the first term. Multiplying by the position itself gives an answer that is one step too large.",
    "每次加同一个数的规律，不必全部写出来就能算出很靠后的项。从第一项到第 $n$ 项，规则用了 $n - 1$ 次，因为第一项已经在第 1 个位置。所以用步长乘以比位置小 1 的数，再加上第一项。直接乘以位置本身，答案会多出一步。",
  ),
  generate(rng) {
    const first = rng.int(2, 30);
    const step = rng.int(2, 12);
    const n = rng.int(12, 60);
    const answer = first + (n - 1) * step;
    return numberProblem({
      prompt: t(
        `A pattern starts at ${first} and adds ${step} each time. What is term number ${n}?`,
        `一个规律从 ${first} 开始，每次加 ${step}。第 ${n} 项是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [first + n * step, n * step, first + (n - 2) * step, first * n, answer + 1],
      solution: t(
        `Going from term 1 to term ${n} takes ${n - 1} steps, so the term is $${first} + ${n - 1} \\times ${step} = ${answer}$.`,
        `从第 1 项到第 ${n} 项要走 ${n - 1} 步，所以这一项是 $${first} + ${n - 1} \\times ${step} = ${answer}$。`,
      ),
    });
  },
};

const positionOfTerm: KnowledgePointDef = {
  id: "the-position-of-a-number-in-a-pattern",
  title: t("The position of a number in a pattern", "一个数在规律中的位置"),
  explanation: t(
    "The rule of a pattern can also be run backwards, to find where a given number appears. Subtract the first term to find how far the number is from the start. Divide by the step to find how many steps that is. The position is one more than the number of steps, because the first term is already in position 1 before any step is taken. The same reasoning counts the terms of a list.",
    "规律的规则也可以倒过来用，找出给定的数出现在哪里。减去第一项，算出这个数离开头有多远。除以步长，算出这是多少步。位置比步数多 1，因为还没有走步时第一项已经在第 1 个位置。同样的道理可以数出一列数有多少项。",
  ),
  generate(rng) {
    const first = rng.int(2, 30);
    const step = rng.int(2, 12);
    const answer = rng.int(8, 60);
    const value = first + (answer - 1) * step;
    return numberProblem({
      prompt: t(
        `A pattern starts at ${first} and adds ${step} each time. Which term number is ${value}?`,
        `一个规律从 ${first} 开始，每次加 ${step}。${value} 是第几项？`,
      ),
      answer,
      form: "integer",
      wrong: [answer - 1, answer + 1, Math.floor(value / step), value - first, answer + 2],
      solution: t(
        `From ${first} to ${value} is ${value - first}, which is $${value - first} \\div ${step} = ${answer - 1}$ steps. The term number is one more than that, ${answer}.`,
        `从 ${first} 到 ${value} 相差 ${value - first}，也就是 $${value - first} \\div ${step} = ${answer - 1}$ 步。项数比步数多 1，是 ${answer}。`,
      ),
    });
  },
};

const equivalentWithSum: KnowledgePointDef = {
  id: "the-equivalent-fraction-with-a-given-sum",
  title: t("The equivalent fraction with a given sum", "分子分母之和一定的等值分数"),
  explanation: t(
    "All the fractions equal to a given one are made by multiplying its top and bottom by the same number. Then the sum of the top and bottom is multiplied by that number too. So if the sum of the new top and bottom is known, dividing it by the old sum shows which number was used. This lets one fraction be picked out of the endless list of equivalent fractions by a single extra fact.",
    "与给定分数相等的所有分数，都是把它的分子和分母乘以同一个数得到的。于是分子与分母的和也乘了这个数。所以如果知道新分子与新分母的和，用它除以原来的和，就知道乘的是哪个数。这样只凭一个额外的条件，就能从无穷多个等值分数中挑出一个。",
  ),
  generate(rng) {
    const [n, d] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [3, 7],
      [5, 8],
    ]) as [number, number];
    const k = rng.int(2, 12);
    const asksTop = rng.pick([true, false]);
    const answer = asksTop ? n * k : d * k;
    const total = (n + d) * k;
    return numberProblem({
      prompt: t(
        `A fraction equal to $\\frac{${n}}{${d}}$ has a numerator and denominator that add up to ${total}. What is its ${asksTop ? "numerator" : "denominator"}?`,
        `一个与 $\\frac{${n}}{${d}}$ 相等的分数，分子与分母之和是 ${total}。它的${asksTop ? "分子" : "分母"}是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [asksTop ? d * k : n * k, k, total - n, total - d, answer + 1, answer + 2, answer + k],
      solution: t(
        `In $\\frac{${n}}{${d}}$, the top and bottom add up to ${n + d}, and $${total} \\div ${n + d} = ${k}$. So multiply both by ${k}, which gives $\\frac{${n * k}}{${d * k}}$.`,
        `在 $\\frac{${n}}{${d}}$ 中，分子与分母之和是 ${n + d}，$${total} \\div ${n + d} = ${k}$。所以两者都乘以 ${k}，得 $\\frac{${n * k}}{${d * k}}$。`,
      ),
    });
  },
};

const wholeFromFractionalPart: KnowledgePointDef = {
  id: "the-whole-from-a-fractional-part",
  title: t("The whole from a fractional part", "由部分求整体"),
  explanation: t(
    "A fraction of a whole can be turned around. If $\\frac{3}{4}$ of a group is known, the group is split into 4 equal shares, and the known amount fills 3 of them. So first divide by the numerator to get one share, and then multiply by the denominator to get the whole group. Drawing the bar makes it clear why the two steps come in this order, and why the answer must be larger than the part.",
    "整体的几分之几可以反过来用。如果知道一组的 $\\frac{3}{4}$，这组就被分成 4 等份，已知的量占其中 3 份。所以先除以分子得到一份，再乘以分母得到整组。画一条线段就能看出为什么是这两步，以及为什么答案一定比部分大。",
  ),
  generate(rng) {
    const [n, d] = rng.pick([
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 6],
      [3, 8],
      [5, 8],
      [7, 8],
      [3, 10],
      [7, 10],
    ]) as [number, number];
    const share = rng.int(2, 15);
    const part = n * share;
    const answer = d * share;
    return numberProblem({
      prompt: t(
        `A class read ${part} pages, which is $\\frac{${n}}{${d}}$ of a book. How many pages does the book have?`,
        `全班读了 ${part} 页，占一本书的 $\\frac{${n}}{${d}}$。这本书有多少页？`,
      ),
      answer,
      form: "integer",
      wrong: [share, part + d, part * d, answer - part, part * n],
      solution: t(
        `The ${part} pages fill ${n} of the ${d} equal shares, so one share is $${part} \\div ${n} = ${share}$. The book has $${d} \\times ${share} = ${answer}$ pages.`,
        `${part} 页占 ${d} 等份中的 ${n} 份，所以一份是 $${part} \\div ${n} = ${share}$。这本书有 $${d} \\times ${share} = ${answer}$ 页。`,
      ),
    });
  },
};

const hundredthsBetween: KnowledgePointDef = {
  id: "the-hundredths-between-two-decimals",
  title: t("The hundredths between two decimals", "两个小数之间相差多少个百分之一"),
  explanation: t(
    "A decimal with two places counts hundredths, so comparing two such decimals comes down to comparing two whole numbers of hundredths. A tenth is worth ten hundredths, and so a decimal with only one place should be read with a zero in the hundredths place. Then $0.5$ is 50 hundredths, not 5. Once both are written as hundredths, the gap between them is an ordinary subtraction of whole numbers.",
    "两位小数表示有多少个百分之一，所以比较两个这样的小数，就是比较两个整数个百分之一。一个十分之一等于十个百分之一，所以只有一位的小数要在百分位补零来读。这样 $0.5$ 是 50 个百分之一，而不是 5 个。都写成百分之一后，它们的差就是普通的整数减法。",
  ),
  generate(rng) {
    const a = rng.int(5, 90);
    const short = rng.pick([true, false]);
    const b = short
      ? rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v * 10 !== a)) * 10
      : rng.pick([...Array(99).keys()].map((i) => i + 1).filter((v) => v !== a && v % 10 !== 0));
    const fmt = (v: number) => (v % 10 === 0 ? `0.${v / 10}` : `0.${String(v).padStart(2, "0")}`);
    const answer = Math.abs(a - b);
    return numberProblem({
      prompt: t(`How many hundredths apart are $${fmt(a)}$ and $${fmt(b)}$?`, `$${fmt(a)}$ 和 $${fmt(b)}$ 相差多少个百分之一？`),
      answer,
      form: "integer",
      wrong: [a + b, Math.abs(a - Math.floor(b / 10)), Math.abs(Math.floor(a / 10) - b), answer + 10, answer + 1],
      solution: t(
        `As hundredths, the numbers are ${a} and ${b}. They are ${answer} hundredths apart.`,
        `写成百分之一，这两个数是 ${a} 和 ${b} 个。它们相差 ${answer} 个百分之一。`,
      ),
    });
  },
};

const hundredthsCompletingWhole: KnowledgePointDef = {
  id: "the-hundredths-that-complete-a-whole",
  title: t("The hundredths that complete a whole", "凑成整体所需的百分之几"),
  explanation: t(
    "Fractions with denominators 10 and 100 can be added once the tenths are written as hundredths. Multiplying the top and bottom of a tenth by 10 gives the same amount in hundredths. A whole is 100 hundredths, so finding what is missing to complete a whole is a subtraction from 100. The same idea explains why the digits in a decimal such as $0.73$ and its partner $0.27$ add up to a whole.",
    "分母是 10 和 100 的分数，把十分之几写成百分之几后就可以相加。把十分之几的分子分母都乘以 10，就得到同样大小的百分之几。一个整体是 100 个百分之一，所以求凑成整体还差多少，就是从 100 里减。同样的想法也能说明 $0.73$ 和 $0.27$ 为什么合起来是一个整体。",
  ),
  generate(rng) {
    const tenths = rng.int(1, 7);
    const hundredths = rng.pick([...Array(19).keys()].map((i) => i + 1).filter((v) => v % 10 !== 0));
    const answer = 100 - tenths * 10 - hundredths;
    return numberProblem({
      prompt: t(
        `Find the missing numerator: $$\\frac{${tenths}}{10} + \\frac{${hundredths}}{100} + \\frac{\\square}{100} = 1$$`,
        `求未知的分子：$$\\frac{${tenths}}{10} + \\frac{${hundredths}}{100} + \\frac{\\square}{100} = 1$$`,
      ),
      answer,
      form: "integer",
      wrong: [100 - tenths - hundredths, answer + 1, answer + 10, answer - 10, tenths * 10 + hundredths],
      solution: t(
        `Write $\\frac{${tenths}}{10}$ as $\\frac{${tenths * 10}}{100}$. A whole is 100 hundredths, so the missing numerator is $100 - ${tenths * 10} - ${hundredths} = ${answer}$.`,
        `把 $\\frac{${tenths}}{10}$ 写成 $\\frac{${tenths * 10}}{100}$。一个整体是 100 个百分之一，所以未知的分子是 $100 - ${tenths * 10} - ${hundredths} = ${answer}$。`,
      ),
    });
  },
};

const startFromElapsed: KnowledgePointDef = {
  id: "the-start-time-from-the-elapsed-time",
  title: t("The start time from the elapsed time", "由经过的时间求开始时刻"),
  explanation: t(
    "Elapsed time can be worked backwards from the end. Subtract the hours first, and then the minutes. If there are not enough minutes to subtract from, go back one more hour, since an hour holds 60 minutes. A clock runs in sixties, not hundreds, so ordinary column subtraction gives a wrong answer. Checking by adding the elapsed time to the start time should bring the answer back to the end time.",
    "经过的时间可以从结束时刻倒着算。先减去小时，再减去分钟。如果分钟不够减，就再退回一小时，因为一小时有 60 分钟。时钟是六十进制，不是一百进制，所以普通的竖式减法会出错。把经过的时间加到开始时刻来检验，应该回到结束时刻。",
  ),
  generate(rng) {
    const endHour = rng.int(5, 11);
    const endMinute = rng.int(1, 59);
    const hours = rng.int(1, 3);
    const minutes = rng.int(5, 55);
    const total = endHour * 60 + endMinute - hours * 60 - minutes;
    const startHour = Math.floor(total / 60);
    const answer = total % 60;
    const pad = (m: number) => String(m).padStart(2, "0");
    const borrowed = endMinute < minutes;
    return numberProblem({
      prompt: t(
        `A train trip ends at ${endHour}:${pad(endMinute)} in the evening and lasts ${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} minutes. It starts at ${startHour}:__. How many minutes go in the blank?`,
        `一次火车旅行在晚上 ${endHour}:${pad(endMinute)} 结束，历时 ${hours} 小时 ${minutes} 分钟。它在 ${startHour}:__ 开始。空格处应填多少分钟？`,
      ),
      answer,
      form: "integer",
      wrong: [
        Math.abs(endMinute - minutes),
        (endMinute + minutes) % 60,
        (answer + 40) % 60,
        (answer + 10) % 60,
        (answer + 1) % 60,
        60 - answer,
      ],
      solution: t(
        `In minutes, the trip lasts ${hours * 60 + minutes}. ${borrowed ? `There are too few minutes at ${endHour}:${pad(endMinute)} to subtract ${minutes}, so go back one more hour: ` : ""}$${endMinute}${borrowed ? " + 60" : ""} - ${minutes} = ${answer}$.`,
        `这次旅行共 ${hours * 60 + minutes} 分钟。${borrowed ? `${endHour}:${pad(endMinute)} 的分钟不够减 ${minutes}，所以再退回一小时：` : ""}$${endMinute}${borrowed ? " + 60" : ""} - ${minutes} = ${answer}$。`,
      ),
    });
  },
};

const twoStepTime: KnowledgePointDef = {
  id: "converting-through-two-units-of-time",
  title: t("Converting through two units of time", "经过两个时间单位的换算"),
  explanation: t(
    "Some conversions of time need two steps, since no single familiar number links the two units. To go from days to minutes, change the days to hours and then the hours to minutes. Each step multiplies, because a smaller unit needs a larger count. The different factors, 7, 24 and 60, are easy to mix up, and so it helps to write down each unit in turn and check that it makes sense.",
    "有些时间换算需要两步，因为没有一个熟悉的数直接联系这两个单位。把天化成分钟，要先把天化成小时，再把小时化成分钟。每一步都做乘法，因为单位越小，数量越大。7、24、60 这些不同的进率容易弄混，所以最好依次写下每个单位，并检查是否合理。",
  ),
  generate(rng) {
    const [from, fromZh, to, toZh, via, viaZh, f1, f2] = rng.pick([
      ["days", "天", "minutes", "分钟", "hours", "小时", 24, 60],
      ["hours", "小时", "seconds", "秒", "minutes", "分钟", 60, 60],
      ["weeks", "周", "hours", "小时", "days", "天", 7, 24],
    ]) as [string, string, string, string, string, string, number, number];
    const n = rng.int(2, 12);
    const answer = n * f1 * f2;
    return numberProblem({
      prompt: t(`How many ${to} are in ${n} ${from}?`, `${n} ${fromZh}是多少${toZh}？`),
      answer,
      form: "integer",
      wrong: [n * f1, n * f2, n * (f1 + f2), n * f1 * 100, answer * 2],
      solution: t(
        `First, ${n} ${from} is $${n} \\times ${f1} = ${n * f1}$ ${via}. Then $${n * f1} \\times ${f2} = ${answer}$ ${to}.`,
        `先算，${n} ${fromZh}是 $${n} \\times ${f1} = ${n * f1}$ ${viaZh}。再算，$${n * f1} \\times ${f2} = ${answer}$ ${toZh}。`,
      ),
    });
  },
};

const equalAnglesAroundPoint: KnowledgePointDef = {
  id: "equal-angles-around-a-point",
  title: t("Equal angles around a point", "一点周围相等的角"),
  explanation: t(
    "All the angles around a point add up to a full turn of 360 degrees. If one angle is known and the rest are equal, take the known angle away from 360 first. What remains is shared equally among the other angles, so divide it by how many there are. Doing these steps in the wrong order gives a wrong answer, as the known angle does not take part in the sharing at all.",
    "一点周围所有的角加起来是一周 360 度。如果一个角已知，其余的角都相等，先从 360 里减去已知的角。剩下的平均分给其他的角，所以除以它们的个数。这两步的顺序不能错，因为已知的角根本不参加平分。",
  ),
  generate(rng) {
    const count = rng.int(3, 6);
    const each = rng.pick([...Array(71).keys()].map((i) => 20 + i).filter((v) => 360 - v * count > 0 && 360 - v * count < 180));
    const known = 360 - each * count;
    return numberProblem({
      prompt: t(
        `Around a point there is one angle of $${known}^\\circ$ and ${count} other angles that are all equal. How many degrees is each of the equal angles?`,
        `一点周围有一个 $${known}^\\circ$ 的角和另外 ${count} 个相等的角。每个相等的角是多少度？`,
      ),
      answer: each,
      form: "integer",
      wrong: [Math.floor(360 / (count + 1)), each + 10, 360 - known, each + 5, Math.floor(360 / count)],
      solution: t(
        `The equal angles share $360^\\circ - ${known}^\\circ = ${360 - known}^\\circ$. Each is $${360 - known}^\\circ \\div ${count} = ${each}^\\circ$.`,
        `相等的角平分 $360^\\circ - ${known}^\\circ = ${360 - known}^\\circ$。每个角是 $${360 - known}^\\circ \\div ${count} = ${each}^\\circ$。`,
      ),
    });
  },
};

const clockAngle: KnowledgePointDef = {
  id: "the-angle-between-clock-hands-on-the-hour",
  title: t("The angle between clock hands on the hour", "整点时钟面上两针的夹角"),
  explanation: t(
    "A clock face is a circle of 360 degrees cut into 12 equal hours, so each hour mark is 30 degrees from the next one. On the hour, the minute hand points at 12, and the hour hand points at the hour mark. The angle between them is 30 degrees for each hour between the hands. There are two ways round the clock, and the smaller angle is the one that goes the shorter way. As the hours pass, the hour hand also turns 30 degrees each hour.",
    "钟面是 360 度的圆，平均分成 12 小时，所以相邻两个小时刻度相差 30 度。整点时，分针指向 12，时针指向小时刻度。两针之间每隔一小时就是 30 度。绕钟面有两条路，较小的角走的是近的那条路。随着时间过去，时针每小时也转 30 度。",
  ),
  generate(rng) {
    const hour = rng.int(1, 11);
    if (rng.bool()) {
      const hours = rng.int(2, 11);
      const later = ((hour + hours - 1) % 12) + 1;
      const answer = hours * 30;
      return numberProblem({
        prompt: t(
          `Through how many degrees does the hour hand of a clock turn from ${hour}:00 to the next ${later}:00?`,
          `从 ${hour}:00 到接下来的 ${later}:00，钟面上的时针转过多少度？`,
        ),
        answer,
        form: "integer",
        wrong: [hours * 6, hours * 60, later * 30, 360 - answer, answer + 30],
        solution: t(
          `The hour hand moves ${hours} hours, and it turns $30^\\circ$ each hour. So it turns $${hours} \\times 30^\\circ = ${answer}^\\circ$.`,
          `时针走了 ${hours} 小时，每小时转 $30^\\circ$。所以转过 $${hours} \\times 30^\\circ = ${answer}^\\circ$。`,
        ),
      });
    }
    const gaps = Math.min(hour, 12 - hour);
    const answer = gaps * 30;
    return numberProblem({
      prompt: t(
        `What is the smaller angle, in degrees, between the hands of a clock at ${hour}:00?`,
        `${hour}:00 时，钟面上两针所成的较小的角是多少度？`,
      ),
      answer,
      form: "integer",
      wrong: [360 - answer, hour * 6, gaps * 60, answer + 30, gaps * 12],
      solution: t(
        `The hands are ${gaps} hour ${gaps === 1 ? "mark" : "marks"} apart the short way round, and each is $360^\\circ \\div 12 = 30^\\circ$. So the angle is $${answer}^\\circ$.`,
        `沿近路两针相隔 ${gaps} 个小时刻度，每个是 $360^\\circ \\div 12 = 30^\\circ$。所以夹角是 $${answer}^\\circ$。`,
      ),
    });
  },
};

const rectangleFromRatio: KnowledgePointDef = {
  id: "a-rectangle-from-its-perimeter-and-a-side-comparison",
  title: t("A rectangle from its perimeter and a side comparison", "由周长和边的倍数关系求长方形"),
  explanation: t(
    "A perimeter on its own does not settle a rectangle, because many rectangles share one. A comparison of the sides settles it. Half the perimeter is the length and the width together. If the length is some number of times the width, the two sides make one more equal part than that number. Dividing gives the width, and then the area follows by multiplying the two sides. So one problem combines both ideas about rectangles.",
    "只有周长不能确定长方形，因为许多长方形周长相同。边的倍数关系就能确定它。周长的一半是长与宽的和。如果长是宽的若干倍，两条边合起来比这个倍数多一份。做除法得到宽，再把两条边相乘就得到面积。所以一道题里用到了关于长方形的两个想法。",
  ),
  generate(rng) {
    const k = rng.int(2, 5);
    const width = rng.int(2, 15);
    const length = k * width;
    const perimeter = 2 * (length + width);
    const asksArea = rng.pick([true, false]);
    const answer = asksArea ? length * width : width;
    return numberProblem({
      prompt: t(
        `A rectangle has a perimeter of ${perimeter} cm, and its length is ${k} times its width. Find its ${asksArea ? "area in square centimeters" : "width in centimeters"}.`,
        `一个长方形的周长是 ${perimeter} 厘米，长是宽的 ${k} 倍。求它的${asksArea ? "面积（平方厘米）" : "宽（厘米）"}。`,
      ),
      answer,
      form: "integer",
      wrong: [
        asksArea ? perimeter * k : length,
        asksArea ? width * width : Math.floor(perimeter / k),
        asksArea ? (length + width) * width : perimeter / 2,
        answer + 2,
        perimeter,
      ],
      solution: t(
        `Half the perimeter is ${perimeter / 2}, and the two sides make ${k + 1} equal parts, so the width is $${perimeter / 2} \\div ${k + 1} = ${width}$.${asksArea ? ` The length is ${length}, so the area is $${length} \\times ${width} = ${answer}$.` : ""}`,
        `周长的一半是 ${perimeter / 2}，两条边合起来是 ${k + 1} 份，所以宽是 $${perimeter / 2} \\div ${k + 1} = ${width}$。${asksArea ? `长是 ${length}，所以面积是 $${length} \\times ${width} = ${answer}$。` : ""}`,
      ),
    });
  },
};

const missingDigitInFactor: KnowledgePointDef = {
  id: "a-missing-digit-in-a-multiplication",
  title: t("A missing digit in a multiplication", "乘法中缺失的数字"),
  explanation: t(
    "A multiplication can be undone to find a digit that is hidden. Dividing the product by the known factor gives the whole of the other factor, and the hidden digit can then be read from it. The ones digit gives a quick check as well. Only the ones digits of the factors decide the ones digit of the product, and so a wrong guess can often be ruled out without any long working.",
    "把乘法还原，就能找出被遮住的数字。用积除以已知的因数，就得到另一个完整的因数，再从中读出被遮住的数字。个位数字也能快速检验。积的个位只由两个因数的个位决定，所以错误的猜测往往不用长算就能排除。",
  ),
  generate(rng) {
    const m = rng.int(3, 9);
    const hundreds = rng.int(1, 9);
    const answer = rng.int(0, 9);
    const ones = rng.int(1, 9);
    const hiddenTens = rng.pick([true, false]);
    const factor = 100 * hundreds + 10 * answer + ones;
    const product = factor * m;
    const shown = hiddenTens ? `${hundreds}\\square${ones}` : `${hundreds}${answer}\\square`;
    const digit = hiddenTens ? answer : ones;
    return numberProblem({
      prompt: t(`Find the missing digit: $$${shown} \\times ${m} = ${product}$$`, `求缺失的数字：$$${shown} \\times ${m} = ${product}$$`),
      answer: digit,
      form: "integer",
      wrong: [(digit + 1) % 10, (digit + 9) % 10, (digit + 5) % 10, m],
      solution: t(
        `Divide the product by the known factor: $${product} \\div ${m} = ${factor}$. So the missing digit is ${digit}.`,
        `用积除以已知的因数：$${product} \\div ${m} = ${factor}$。所以缺失的数字是 ${digit}。`,
      ),
    });
  },
};

const missingAddendAcrossThree: KnowledgePointDef = {
  id: "the-third-number-from-a-total",
  title: t("The third number from a total", "由总数求第三个数"),
  explanation: t(
    "When several numbers are added, one of them can be found from the total and the others. Add the known numbers first, and then subtract their sum from the total. Taking the numbers away one at a time gives the same answer, but it means more chances to slip. Rounding each number first gives a quick estimate of the answer, which can catch a mistake such as a digit in the wrong column.",
    "几个数相加时，可以由总数和其他的数求出其中一个。先把已知的数加起来，再从总数里减去它们的和。一个一个地减也能得到同样的答案，但出错的机会更多。先把每个数舍入，可以快速估算答案，这能发现把数字写错位之类的差错。",
  ),
  generate(rng) {
    const a = rng.int(1200, 9800);
    const b = rng.int(1200, 9800);
    const answer = rng.int(1200, 9800);
    const total = a + b + answer;
    return numberProblem({
      prompt: t(
        `Three towns have ${total} people in all. One town has ${a} people and another has ${b}. How many people does the third town have?`,
        `三个镇一共有 ${total} 人。一个镇有 ${a} 人，另一个镇有 ${b} 人。第三个镇有多少人？`,
      ),
      answer,
      form: "integer",
      wrong: [total - a, total - b, a + b, answer + 1000, answer - 100],
      solution: t(
        `The two known towns have $${a} + ${b} = ${a + b}$ people. The third has $${total} - ${a + b} = ${answer}$.`,
        `已知的两个镇有 $${a} + ${b} = ${a + b}$ 人。第三个镇有 $${total} - ${a + b} = ${answer}$ 人。`,
      ),
    });
  },
};

/** deeperGrade4Points maps topics of 4th Grade Math to further knowledge points. */
export const deeperGrade4Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "rounding-up-whole-numbers": [smallestThatRounds],
  "estimating-multi-digit-addition": [estimateError],
  "adding-three-multi-digit-numbers": [missingAddendAcrossThree],
  "subtracting-three-digit-numbers": [largestDifferenceFromDigits],
  "products-and-factors": [countingFactors],
  "prime-and-composite-numbers": [nextPrime],
  "least-common-multiple-by-listing": [whenEventsMeet],
  "greatest-common-factor-by-listing": [largestEqualGroups],
  "connecting-factors-and-multiples": [countingMultiples],
  "finding-remainders": [dividendFromQuotient],
  "division-with-remainders": [largestWithQuotient],
  "dividing-by-10-100-and-1000": [fullHundreds],
  "word-problems-involving-additive-and-multiplicative-comparison": [totalFromTimes],
  "generating-patterns": [termOfPattern],
  "identifying-patterns": [positionOfTerm],
  "equivalent-fractions-by-multiplying-and-dividing": [equivalentWithSum],
  "multiplying-fractions-by-whole-numbers-word-problems": [wholeFromFractionalPart],
  "comparing-decimals-up-to-hundredths": [hundredthsBetween],
  "adding-decimal-fractions": [hundredthsCompletingWhole],
  "units-of-time-and-elapsed-time": [startFromElapsed],
  "converting-units-of-time-to-smaller-units": [twoStepTime],
  "sums-of-angles": [equalAnglesAroundPoint],
  "solving-angle-problems": [clockAngle],
  "modeling-with-rectangles": [rectangleFromRatio],
  "multi-digit-by-one-digit-multiplication-using-place-value": [missingDigitInFactor],
};
