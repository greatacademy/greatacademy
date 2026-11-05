// Further knowledge points for topics of 5th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade5Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { mixedLatex, numberProblem } from "../problems.ts";

/** UNLIKE_PAIRS lists denominators of two fractions that need a common denominator. */
const UNLIKE_PAIRS: readonly (readonly [number, number])[] = [
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [2, 7],
  [3, 8],
  [5, 6],
  [6, 8],
  [4, 10],
  [5, 8],
];
/** gcd5 is the greatest common factor of two positive integers. */
const gcd5 = (a: number, b: number): number => (b === 0 ? a : gcd5(b, a % b));
/** hundredths writes a whole number of hundredths as a decimal. */
const hundredths = (n: number) => dec(Q.of(n, 100));

const integersWithSmallAbsoluteValue: KnowledgePointDef = {
  id: "counting-integers-with-small-absolute-value",
  title: t("Counting integers with a small absolute value", "数绝对值较小的整数"),
  explanation: t(
    "The absolute value of a number is its distance from zero, and each distance other than zero is reached in two directions. So the integers with absolute value less than some number lie on both sides of zero, and zero itself is one of them. Count those on the positive side, double the count for the negative side, and add one for zero. Forgetting zero is the common slip.",
    "一个数的绝对值是它到零的距离，除了零以外，每个距离都能从两个方向达到。所以绝对值小于某数的整数分布在零的两侧，零本身也在其中。先数正数一侧，再乘以 2 算上负数一侧，最后为零加 1。常见的差错是忘了零。",
  ),
  generate(rng) {
    const n = rng.int(3, 60);
    const inclusive = rng.bool();
    const answer = inclusive ? 2 * n + 1 : 2 * n - 1;
    return numberProblem({
      prompt: t(
        `How many integers have an absolute value ${inclusive ? "of at most" : "less than"} ${n}?`,
        `有多少个整数的绝对值${inclusive ? "不超过" : "小于"} ${n}？`,
      ),
      answer,
      form: "integer",
      wrong: [n, 2 * n, inclusive ? 2 * n - 1 : 2 * n + 1, n + 1, n - 1],
      solution: t(
        `On the positive side there are ${inclusive ? n : n - 1} of them, and as many on the negative side. With zero, that is $2 \\times ${inclusive ? n : n - 1} + 1 = ${answer}$.`,
        `正数一侧有 ${inclusive ? n : n - 1} 个，负数一侧也有这么多。加上零，共 $2 \\times ${inclusive ? n : n - 1} + 1 = ${answer}$ 个。`,
      ),
    });
  },
};

const integersBetween: KnowledgePointDef = {
  id: "counting-integers-between-a-negative-and-a-positive",
  title: t("Counting integers between a negative and a positive", "数一个负数和一个正数之间的整数"),
  explanation: t(
    "The integers between a negative number and a positive number are spread on both sides of zero. The distance between the two ends is found by adding their distances from zero. There are always one fewer integers strictly between two ends than this distance, just as there are fewer posts inside a fence than steps along it. Trying a small case by hand, such as the integers between $-1$ and $1$, shows why.",
    "一个负数和一个正数之间的整数分布在零的两侧。两端之间的距离，等于它们到零的距离之和。严格在两端之间的整数个数总是比这个距离少 1。试一个小例子，比如 $-1$ 和 $1$ 之间的整数，就能看出原因。",
  ),
  generate(rng) {
    const a = rng.int(2, 40);
    const b = rng.int(2, 40);
    const answer = a + b - 1;
    return numberProblem({
      prompt: t(`How many integers lie strictly between $-${a}$ and ${b}?`, `严格在 $-${a}$ 和 ${b} 之间的整数有多少个？`),
      answer,
      form: "integer",
      wrong: [a + b, a + b + 1, Math.abs(a - b), a + b - 2, Math.abs(a - b) - 1],
      solution: t(
        `The distance from $-${a}$ to ${b} is $${a} + ${b} = ${a + b}$. There is one fewer integer strictly between them, which makes ${answer}.`,
        `从 $-${a}$ 到 ${b} 的距离是 $${a} + ${b} = ${a + b}$。严格在它们之间的整数比这个数少 1，是 ${answer} 个。`,
      ),
    });
  },
};

const elevationGap: KnowledgePointDef = {
  id: "the-gap-across-zero",
  title: t("The gap across zero", "跨过零的差距"),
  explanation: t(
    "Temperatures and heights can lie on either side of zero. To find the gap between one value above zero and one below it, add their distances from zero, since the path from one to the other goes through zero. Subtracting these distances only works when both values are on the same side. Picturing the values on a vertical number line makes it clear which of the two cases a problem is showing.",
    "温度和高度可能在零的两侧。要求零上的值和零下的值之间的差距，就把它们到零的距离相加，因为从一个到另一个要经过零。只有两个值在同一侧时，才把距离相减。把这些值画在竖直的数轴上，就能看清题目属于哪种情况。",
  ),
  generate(rng) {
    const up = rng.int(3, 900);
    const down = rng.int(3, 900);
    const answer = up + down;
    return numberProblem({
      prompt: t(
        `A bird flies ${up} m above sea level, and a submarine is ${down} m below sea level. How many meters apart are their heights?`,
        `一只鸟在海平面以上 ${up} 米飞行，一艘潜艇在海平面以下 ${down} 米。它们的高度相差多少米？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.abs(up - down), up, down, answer + 100, answer - 10],
      solution: t(
        `The path from one to the other goes through sea level, so the gap is $${up} + ${down} = ${answer}$ m.`,
        `从一个到另一个要经过海平面，所以差距是 $${up} + ${down} = ${answer}$ 米。`,
      ),
    });
  },
};

const parenthesesGain: KnowledgePointDef = {
  id: "how-much-parentheses-change-a-value",
  title: t("How much parentheses change a value", "括号使结果改变多少"),
  explanation: t(
    "Parentheses can change the value of an expression without changing any of its numbers. Without them, multiplication comes before addition. With parentheses around the sum, the first number is also multiplied. So the second value is larger, and comparing the two shows exactly how much the order of operations matters. Working out both values in full, with care, is the safest way to compare them.",
    "括号可以在不改变任何数字的情况下改变算式的值。没有括号时，先乘后加。给和加上括号后，第一个数也被乘了。所以第二个值更大，比较这两个值，正好能看出运算顺序有多重要。最稳妥的比较办法是仔细算出两个值。",
  ),
  generate(rng) {
    const a = rng.int(2, 20);
    const b = rng.int(2, 15);
    const c = rng.int(2, 12);
    const plain = a + b * c;
    const grouped = (a + b) * c;
    const answer = grouped - plain;
    return numberProblem({
      prompt: t(
        `How much greater is $(${a} + ${b}) \\times ${c}$ than $${a} + ${b} \\times ${c}$?`,
        `$(${a} + ${b}) \\times ${c}$ 比 $${a} + ${b} \\times ${c}$ 大多少？`,
      ),
      answer,
      form: "integer",
      wrong: [grouped, plain, a * c, b * c, answer + a, answer + 1, answer + 2],
      solution: t(
        `The first is $${a + b} \\times ${c} = ${grouped}$, and the second is $${a} + ${b * c} = ${plain}$. The difference is ${answer}.`,
        `第一个是 $${a + b} \\times ${c} = ${grouped}$，第二个是 $${a} + ${b * c} = ${plain}$。差是 ${answer}。`,
      ),
    });
  },
};

const nextProduct: KnowledgePointDef = {
  id: "a-new-product-from-a-known-product",
  title: t("A new product from a known product", "由已知的积求新的积"),
  explanation: t(
    "A known product can save a long multiplication. Multiplying by one more means one more group, so the product grows by the other factor. Multiplying by one less takes one group away. The same reasoning works for adding or taking away a few groups. This is the distributive property, and using it is both quicker and a useful check on a long multiplication that has just been done by hand.",
    "已知的积可以省去一次长乘法。多乘一个，就是多一组，所以积增加另一个因数。少乘一个，就是减少一组。增加或减少几组也是同样的道理。这就是分配律，用它既快，也能检验刚刚用笔算的长乘法。",
  ),
  generate(rng) {
    const a = rng.int(12, 99);
    const b = rng.int(12, 99);
    const change = rng.pick([1, -1, 2, -2]);
    const answer = a * (b + change);
    const shown = a * b;
    return numberProblem({
      prompt: t(
        `Given that $${a} \\times ${b} = ${shown}$, find $${a} \\times ${b + change}$.`,
        `已知 $${a} \\times ${b} = ${shown}$，求 $${a} \\times ${b + change}$。`,
      ),
      answer,
      form: "integer",
      wrong: [shown + change, shown + change * b, shown - change * a, shown + change * 10, answer + 10],
      solution: t(
        `The second product has ${Math.abs(change) === 1 ? "one" : "two"} ${change > 0 ? "more" : "fewer"} ${Math.abs(change) === 1 ? "group" : "groups"} of ${a}, so it is $${shown} ${change > 0 ? "+" : "-"} ${Math.abs(change * a)} = ${answer}$.`,
        `第二个积${change > 0 ? "多" : "少"} ${Math.abs(change)} 组 ${a}，所以是 $${shown} ${change > 0 ? "+" : "-"} ${Math.abs(change * a)} = ${answer}$。`,
      ),
    });
  },
};

const digitsOfProduct: KnowledgePointDef = {
  id: "the-number-of-digits-in-a-product",
  title: t("The number of digits in a product", "积的位数"),
  explanation: t(
    "The size of a product can be judged before working it out. Rounding the factors to a leading digit followed by zeros gives a rough value, and so the number of digits. A product of a three-digit and a three-digit number always has five or six digits, depending on the leading digits of the factors. This check catches a misplaced zero in a long multiplication, which is the most common error in a partial product.",
    "积的大小在算出来之前就可以判断。把因数舍入成首位数字后面跟零的形式，就能得到大概的值，也就知道位数。三位数乘三位数的积总是五位或六位，这取决于因数的首位数字。这个检验能发现长乘法中错放的零，这是部分积中最常见的差错。",
  ),
  generate(rng) {
    const a = rng.int(101, 999);
    const b = rng.int(101, 999);
    const product = a * b;
    const answer = String(product).length;
    return numberProblem({
      prompt: t(
        `Without a calculator, decide how many digits the product $${a} \\times ${b}$ has.`,
        `不用计算器，判断积 $${a} \\times ${b}$ 有几位数。`,
      ),
      answer,
      form: "integer",
      wrong: [answer === 5 ? 6 : 5, 4, 7, 9],
      solution: t(
        `The product is $${String(product).replace(/\\B(?=(\\d{3})+$)/g, "{,}")}$, which has ${answer} digits.`,
        `积是 $${String(product).replace(/\\B(?=(\\d{3})+$)/g, "{,}")}$，有 ${answer} 位。`,
      ),
    });
  },
};

const addToMakeMultiple: KnowledgePointDef = {
  id: "the-least-to-add-for-a-multiple",
  title: t("The least to add for a multiple", "加多少才成为倍数"),
  explanation: t(
    "A remainder says how far a number is above the last multiple. So it also says how far the number is below the next multiple: that gap is the divisor minus the remainder. To make a number divisible by the divisor, either subtract the remainder or add this gap. A question about buying enough equal packs, or filling up the last row of a seating plan, asks for this second value.",
    "余数说明一个数比上一个倍数大多少。所以它也说明这个数比下一个倍数小多少：这个差距就是除数减去余数。要让一个数能被除数整除，要么减去余数，要么加上这个差距。凑够若干相同的包装、坐满最后一排的问题，求的就是这第二个值。",
  ),
  generate(rng) {
    const d = rng.int(12, 48);
    const r = rng.int(1, d - 1);
    const q = rng.int(25, 180);
    const n = q * d + r;
    const answer = d - r;
    return numberProblem({
      prompt: t(
        `A school has ${n} students and seats them in rows of ${d}. What is the least number of extra students needed so that every row is full?`,
        `学校有 ${n} 名学生，每排坐 ${d} 人。至少再来多少名学生，才能使每排都坐满？`,
      ),
      answer,
      form: "integer",
      wrong: [r, q, q + 1, d, answer + 1, answer + 2],
      solution: t(
        `Dividing, $${n} \\div ${d}$ is ${q} with remainder ${r}. The last row needs $${d} - ${r} = ${answer}$ more students.`,
        `做除法，$${n} \\div ${d}$ 商 ${q} 余 ${r}。最后一排还需要 $${d} - ${r} = ${answer}$ 名学生。`,
      ),
    });
  },
};

const missingFractionAddend: KnowledgePointDef = {
  id: "a-missing-fraction-in-a-sum",
  title: t("A missing fraction in a sum", "和中缺失的分数"),
  explanation: t(
    "An unknown part of a sum is found by subtraction, and fractions are no different. Take the known part away from the total. As the two fractions have different denominators, they must first be rewritten over a common denominator. Adding the two parts back together at the end checks the answer, and that check also catches a slip in finding the common denominator, which is where most errors in this kind of problem happen.",
    "和中未知的部分用减法求，分数也一样。从总和中减去已知的部分。由于两个分数的分母不同，要先化成同分母。最后把两部分加回去可以检验答案，这也能发现通分时的差错，这类题的错误大多出在那里。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(UNLIKE_PAIRS) as readonly [number, number];
    const a = Q.of(rng.int(1, p - 1), p);
    const answer = Q.of(rng.int(1, q - 1), q);
    const total = a.add(answer);
    return numberProblem({
      prompt: t(
        `Find the missing fraction: $$${a.toLatex()} + \\square = ${total.toLatex()}$$`,
        `求缺失的分数：$$${a.toLatex()} + \\square = ${total.toLatex()}$$`,
      ),
      answer,
      wrong: [
        total.add(a),
        Q.of(Math.abs(Number(total.n) - Number(a.n)) || 1, Number(total.d)),
        answer.add(Q.of(1, q * p)),
        answer.mul(Q.of(2)),
        a,
      ],
      solution: t(
        `Subtract: $${total.toLatex()} - ${a.toLatex()} = ${answer.toLatex()}$.`,
        `做减法：$${total.toLatex()} - ${a.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const leftOverTwoParts: KnowledgePointDef = {
  id: "what-is-left-after-two-fractions",
  title: t("What is left after two fractions", "去掉两个分数后还剩多少"),
  explanation: t(
    "If a whole is shared among several parts, the fractions all add up to 1. So the part that remains after two others is 1 minus their sum. Write everything over a common denominator, and write the whole as that denominator over itself. A remaining part that comes out negative, or greater than 1, shows that a mistake has been made along the way, so this is worth a quick check at the end.",
    "如果一个整体分成几部分，这些分数加起来是 1。所以去掉两部分后剩下的，就是 1 减去它们的和。把所有分数化成同分母，把整体写成分子分母都是这个分母的分数。如果剩下的部分算出来是负数或大于 1，说明中途出了错，所以最后值得快速检查一下。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(UNLIKE_PAIRS) as readonly [number, number];
    const a = Q.of(1, p);
    const b = Q.of(rng.int(1, Math.max(1, Math.floor(q / 3))), q);
    const answer = Q.of(1).sub(a).sub(b);
    const asksShare = rng.bool();
    if (asksShare) {
      return numberProblem({
        prompt: t(
          `In a garden, $${a.toLatex()}$ of the land grows beans and $${b.toLatex()}$ grows peas. The rest grows corn. What fraction of the land grows corn?`,
          `一个菜园里，$${a.toLatex()}$ 的土地种豆角，$${b.toLatex()}$ 种豌豆，其余种玉米。种玉米的土地占几分之几？`,
        ),
        answer,
        wrong: [a.add(b), Q.of(1).sub(a), Q.of(1).sub(b), answer.add(Q.of(1, p * q))],
        solution: t(
          `The beans and peas take $${a.toLatex()} + ${b.toLatex()} = ${a.add(b).toLatex()}$. The corn has $1 - ${a.add(b).toLatex()} = ${answer.toLatex()}$.`,
          `豆角和豌豆占 $${a.toLatex()} + ${b.toLatex()} = ${a.add(b).toLatex()}$。玉米占 $1 - ${a.add(b).toLatex()} = ${answer.toLatex()}$。`,
        ),
      });
    }
    const unit = (p * q) / gcd5(p, q);
    const land = unit * rng.int(2, 12);
    const area = answer.mul(Q.of(land));
    return numberProblem({
      prompt: t(
        `A garden has ${land} square meters. Of the land, $${a.toLatex()}$ grows beans and $${b.toLatex()}$ grows peas. The rest grows corn. How many square meters grow corn?`,
        `一个菜园有 ${land} 平方米，其中 $${a.toLatex()}$ 种豆角，$${b.toLatex()}$ 种豌豆，其余种玉米。种玉米的有多少平方米？`,
      ),
      answer: area,
      form: "integer",
      wrong: [a.add(b).mul(Q.of(land)), a.mul(Q.of(land)), b.mul(Q.of(land)), area.add(Q.of(1)), Q.of(land)],
      solution: t(
        `The corn has $1 - ${a.add(b).toLatex()} = ${answer.toLatex()}$ of the land. Then $${answer.toLatex()} \\times ${land} = ${area.toLatex()}$.`,
        `玉米占 $1 - ${a.add(b).toLatex()} = ${answer.toLatex()}$。于是 $${answer.toLatex()} \\times ${land} = ${area.toLatex()}$。`,
      ),
    });
  },
};

const mixedToNextWhole: KnowledgePointDef = {
  id: "what-mixed-number-completes-a-total",
  title: t("What mixed number completes a total", "凑成总数的带分数"),
  explanation: t(
    "A problem can ask how much more is needed to reach a whole number. Add the mixed numbers that are given, and then subtract their sum from the whole number. It helps to write the whole number with a fraction part, by taking one whole and writing it as a fraction with the common denominator. Then the fractions subtract directly. Estimating with whole numbers first shows roughly how large the answer must be.",
    "题目可能问还需要多少才能达到一个整数。先把给出的带分数相加，再从整数中减去它们的和。可以取出一个整体，写成同分母的分数，这样整数就带有分数部分，分数就能直接相减。先用整数估算，就能知道答案大概有多大。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(UNLIKE_PAIRS) as readonly [number, number];
    const a = Q.of(rng.int(1, 4)).add(Q.of(rng.int(1, p - 1), p));
    const b = Q.of(rng.int(1, 4)).add(Q.of(rng.int(1, q - 1), q));
    const sum = a.add(b);
    const whole = Math.ceil(Number(sum.n) / Number(sum.d)) + rng.int(0, 3);
    const answer = Q.of(whole).sub(sum);
    return numberProblem({
      prompt: t(
        `A baker needs ${whole} cups of flour in all and has used $${mixedLatex(a)}$ cups and $${mixedLatex(b)}$ cups so far. How many more cups does the baker need? Write the answer as a mixed number or a fraction.`,
        `面包师一共需要 ${whole} 杯面粉，已经用了 $${mixedLatex(a)}$ 杯和 $${mixedLatex(b)}$ 杯。还需要多少杯？答案写成带分数或分数。`,
      ),
      answer,
      wrong: [sum, Q.of(whole).sub(a), Q.of(whole).sub(b), answer.add(Q.of(1)), Q.of(whole).add(sum)],
      solution: t(
        `The amounts used add up to $${mixedLatex(a)} + ${mixedLatex(b)} = ${mixedLatex(sum)}$. Then $${whole} - ${mixedLatex(sum)} = ${mixedLatex(answer)}$.`,
        `已用的合计 $${mixedLatex(a)} + ${mixedLatex(b)} = ${mixedLatex(sum)}$。于是 $${whole} - ${mixedLatex(sum)} = ${mixedLatex(answer)}$。`,
      ),
    });
  },
};

const fractionOfTheRest: KnowledgePointDef = {
  id: "a-fraction-of-what-is-left",
  title: t("A fraction of what is left", "剩余部分的几分之几"),
  explanation: t(
    "When a second fraction is taken of what remains, it applies to a smaller amount than the first one did. So the two fractions cannot simply be added. First find what is left after the first step, and then find the fraction of that. The word 'rest' or 'remaining' is the signal. Taking each step in order, with whole-number amounts at each stage, keeps the two different wholes from being mixed up.",
    "当第二个分数是对剩下的部分而言时，它作用的量比第一个分数作用的量小。所以两个分数不能简单相加。先算出第一步后剩下多少，再算出它的几分之几。“其余”或“剩下”这样的词就是信号。按顺序一步步算，每一步都得到整数，就不会把两个不同的整体弄混。",
  ),
  generate(rng) {
    const p = rng.pick([2, 3, 4, 5]);
    const q = rng.pick([2, 3, 4, 5, 6]);
    const money = p * q * rng.int(2, 12);
    const spent = money / p;
    const rest = money - spent;
    const second = rest / q;
    const answer = rest - second;
    return numberProblem({
      prompt: t(
        `Ana has $\\$${money}$. Ana spends $\\frac{1}{${p}}$ of it on a book, and then $\\frac{1}{${q}}$ of what is left on lunch. How many dollars does Ana have now?`,
        `安娜有 ${money} 美元。安娜用其中的 $\\frac{1}{${p}}$ 买书，又用剩下的 $\\frac{1}{${q}}$ 吃午饭。安娜现在还有多少美元？`,
      ),
      answer,
      form: "integer",
      wrong: [money - spent - money / q, rest, second, spent, answer + spent, answer + 1, money - second],
      solution: t(
        `The book costs ${spent}, which leaves ${rest}. Lunch costs $${rest} \\div ${q} = ${second}$, which leaves ${answer}.`,
        `买书用去 ${spent}，剩下 ${rest}。午饭用去 $${rest} \\div ${q} = ${second}$，剩下 ${answer}。`,
      ),
    });
  },
};

const fullPieces: KnowledgePointDef = {
  id: "full-pieces-cut-from-a-length",
  title: t("Full pieces cut from a length", "能剪出多少段完整的"),
  explanation: t(
    "Dividing a whole number by a fraction shows how many of those fractions fit. In a real situation the quotient may not be a whole number, and then the meaning decides what to do. Only complete pieces count when cutting a rope, so the fractional part of the quotient is dropped, even when it is close to one. Whatever is left over is too short to make another piece of the required length.",
    "整数除以分数，表示能放下多少个这样的分数。在实际情境中，商可能不是整数，这时要由含义决定怎么办。剪绳子时只有完整的段才算，所以商的分数部分要舍去，即使它接近 1。剩下的部分不够再剪出一段所需的长度。",
  ),
  generate(rng) {
    const [n, d] = rng.pick([
      [3, 4],
      [2, 3],
      [2, 5],
      [3, 5],
      [4, 5],
      [3, 8],
      [5, 8],
      [5, 6],
    ]) as [number, number];
    const options = [...Array(20).keys()].map((i) => 5 + i).filter((v) => (v * d) % n !== 0);
    const length = rng.pick(options);
    const exact = Q.of(length * d, n);
    const answer = Math.floor((length * d) / n);
    return numberProblem({
      prompt: t(
        `How many complete pieces, each $\\frac{${n}}{${d}}$ m long, can be cut from a rope ${length} m long?`,
        `一根 ${length} 米长的绳子，能剪出多少段完整的、每段 $\\frac{${n}}{${d}}$ 米的绳子？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, length * d, Math.floor((length * n) / d), answer - 1, length],
      solution: t(
        `Dividing, $${length} \\div \\frac{${n}}{${d}} = ${length} \\times \\frac{${d}}{${n}} = ${mixedLatex(exact)}$. Only complete pieces count, so the answer is ${answer}.`,
        `做除法，$${length} \\div \\frac{${n}}{${d}} = ${length} \\times \\frac{${d}}{${n}} = ${mixedLatex(exact)}$。只有完整的段才算，所以答案是 ${answer}。`,
      ),
    });
  },
};

const reciprocalOfSum: KnowledgePointDef = {
  id: "the-reciprocal-of-a-sum",
  title: t("The reciprocal of a sum", "和的倒数"),
  explanation: t(
    "A reciprocal flips one fraction, and so a sum must be turned into a single fraction first. Adding the reciprocals of the two parts gives a different value, because the reciprocal of a sum is not the sum of the reciprocals. Add first, using a common denominator, and then flip the result. The answer can be checked by multiplying it by the sum, because a number times its reciprocal always gives exactly 1.",
    "倒数是把一个分数上下颠倒，所以和要先化成一个分数。把两部分的倒数相加得到的是另一个值，因为和的倒数不等于倒数的和。先通分相加，再把结果颠倒。可以把答案与和相乘来检验，因为一个数乘它的倒数总是恰好得 1。",
  ),
  generate(rng) {
    const [p, q] = rng.pick(UNLIKE_PAIRS) as readonly [number, number];
    const a = Q.of(rng.int(1, p - 1), p);
    const b = Q.of(rng.int(1, q - 1), q);
    const sum = a.add(b);
    const answer = Q.of(1).div(sum);
    return numberProblem({
      prompt: t(`Find the reciprocal of $${a.toLatex()} + ${b.toLatex()}$.`, `求 $${a.toLatex()} + ${b.toLatex()}$ 的倒数。`),
      answer,
      wrong: [Q.of(p + q), sum, Q.of(p * q), Q.of(1, p + q), answer.add(Q.of(1))],
      solution: t(
        `The sum is $${sum.toLatex()}$. Flipping it gives $${answer.toLatex()}$.`,
        `和是 $${sum.toLatex()}$。把它颠倒，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const fractionOfWholeBackwards: KnowledgePointDef = {
  id: "the-whole-amount-from-a-fraction-of-it",
  title: t("The whole amount from a fraction of it", "由几分之几求总量"),
  explanation: t(
    "If a fraction of an amount is known, the whole amount is found by dividing by the fraction. That is the reverse of finding the fraction of an amount, and so dividing and multiplying swap roles. Dividing by a fraction is the same as multiplying by its reciprocal. A quick check is that the whole must be larger than the known part, provided the fraction is less than one.",
    "如果知道一个量的几分之几，就用除以这个分数来求整个量。这是求一个量的几分之几的逆过程，所以乘除互换了角色。除以一个分数等于乘它的倒数。快速检验：只要这个分数小于 1，整体就一定大于已知的部分。",
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
    ]) as [number, number];
    const share = Q.of(rng.int(1, 9), rng.pick([2, 3, 4]));
    const part = share.mul(Q.of(n));
    const answer = share.mul(Q.of(d));
    return numberProblem({
      prompt: t(
        `A jug is $\\frac{${n}}{${d}}$ full and holds $${mixedLatex(part)}$ liters of water. How many liters does the full jug hold?`,
        `一个水壶装到 $\\frac{${n}}{${d}}$ 满时有 $${mixedLatex(part)}$ 升水。这个水壶装满时能装多少升？`,
      ),
      answer,
      wrong: [part.mul(Q.of(n, d)), part.add(Q.of(n, d)), share, part, answer.add(Q.of(1))],
      solution: t(
        `Divide by the fraction: $${mixedLatex(part)} \\div \\frac{${n}}{${d}} = ${mixedLatex(part)} \\times \\frac{${d}}{${n}} = ${mixedLatex(answer)}$.`,
        `除以这个分数：$${mixedLatex(part)} \\div \\frac{${n}}{${d}} = ${mixedLatex(part)} \\times \\frac{${d}}{${n}} = ${mixedLatex(answer)}$。`,
      ),
    });
  },
};

const roundingEnds: KnowledgePointDef = {
  id: "the-ends-of-a-rounded-decimal",
  title: t("The ends of a rounded decimal", "舍入后的小数的两端"),
  explanation: t(
    "Rounding can be run backwards with decimals too. Many decimals round to the same tenth, and they form a block around it. A number exactly halfway rounds up, so the block starts at exactly 5 hundredths below the tenth. With two decimal places allowed, the block ends at 4 hundredths above it, because 5 hundredths above would round up to the next tenth. So the two ends are not equally far away.",
    "小数的舍入也可以倒过来想。许多小数舍入到同一个十分位的值，它们在这个值周围形成一段。恰好在正中间的数要向上舍入，所以这一段正好从比这个值小 5 个百分之一开始。如果只取两位小数，这一段在比这个值大 4 个百分之一处结束，因为大 5 个百分之一就会舍入到下一个十分位。所以两端与这个值的距离不一样。",
  ),
  generate(rng) {
    const whole = rng.int(0, 30);
    const tenth = rng.int(1, 9);
    const value = whole * 100 + tenth * 10;
    const smallest = rng.bool();
    const answerHundredths = smallest ? value - 5 : value + 4;
    return numberProblem({
      prompt: t(
        `A decimal with two decimal places rounds to $${hundredths(value)}$ when rounded to the nearest tenth. What is the ${smallest ? "smallest" : "largest"} it can be?`,
        `一个两位小数舍入到十分位后是 $${hundredths(value)}$。它${smallest ? "最小" : "最大"}是多少？`,
      ),
      answer: Q.of(answerHundredths, 100),
      form: "decimal",
      wrong: [
        Q.of(smallest ? value - 4 : value + 5, 100),
        Q.of(smallest ? value - 10 : value + 10, 100),
        Q.of(value, 100),
        Q.of(smallest ? value - 9 : value + 9, 100),
      ],
      solution: t(
        smallest
          ? `A number exactly halfway rounds up, so the block starts at $${hundredths(answerHundredths)}$.`
          : `The value $${hundredths(value + 5)}$ would round up to the next tenth, so the largest is $${hundredths(answerHundredths)}$.`,
        smallest
          ? `恰好在正中间的数要向上舍入，所以这一段从 $${hundredths(answerHundredths)}$ 开始。`
          : `$${hundredths(value + 5)}$ 会舍入到下一个十分位，所以最大是 $${hundredths(answerHundredths)}$。`,
      ),
    });
  },
};

const decimalsBetween: KnowledgePointDef = {
  id: "counting-decimals-between-two-decimals",
  title: t("Counting decimals between two decimals", "数两个小数之间的小数"),
  explanation: t(
    "Between any two decimals there are more decimals, as soon as a further place is allowed. Written with two places, the decimals are simply counted in hundredths, and so the count works like the count of whole numbers. The numbers strictly between two ends number one fewer than the gap. Rewriting $3.4$ as $3.40$ first shows the hidden hundredths and removes the false idea that nothing fits between $3.4$ and $3.5$.",
    "只要允许再多一位，任意两个小数之间还有小数。写成两位小数后，小数就是按百分之一来数，所以数法和整数一样。严格在两端之间的数比差距少 1 个。先把 $3.4$ 写成 $3.40$，就能看出隐藏的百分位，消除 $3.4$ 和 $3.5$ 之间什么也没有的错误想法。",
  ),
  generate(rng) {
    const low = rng.int(1, 40) * 10 + rng.int(0, 9) * 10;
    const gap = rng.pick([10, 20, 30, 40, 50, 60]);
    const high = low + gap;
    const answer = gap - 1;
    return numberProblem({
      prompt: t(
        `How many numbers, written with two decimal places, lie strictly between $${hundredths(low)}$ and $${hundredths(high)}$?`,
        `严格在 $${hundredths(low)}$ 和 $${hundredths(high)}$ 之间、写成两位小数的数有多少个？`,
      ),
      answer,
      form: "integer",
      wrong: [gap, gap + 1, gap / 10, gap / 10 - 1, 0],
      solution: t(
        `Written with two places, the ends are ${low} and ${high} hundredths, which are ${gap} apart. There are ${answer} strictly between them.`,
        `写成两位小数，两端是 ${low} 和 ${high} 个百分之一，相差 ${gap}。严格在它们之间的有 ${answer} 个。`,
      ),
    });
  },
};

const countingSignificantFigures: KnowledgePointDef = {
  id: "counting-significant-figures",
  title: t("Counting significant figures", "数有效数字的个数"),
  explanation: t(
    "Significant figures start at the first digit that is not zero. Zeros before that digit only show the place of the decimal point, so they do not count. Zeros after it do count when they lie between other digits, and also when they come after the decimal point at the end, because they show how exactly the value was measured. So $0.0340$ has three significant figures, which are the 3, the 4 and the final 0.",
    "有效数字从第一个不是零的数字开始。这个数字之前的零只表示小数点的位置，所以不算。它之后的零，如果夹在其他数字之间，要算；如果在小数点后的末尾，也要算，因为它们表示测量的精确程度。所以 $0.0340$ 有三个有效数字，分别是 3、4 和最后的 0。",
  ),
  generate(rng) {
    const leading = rng.int(0, 3);
    const answer = rng.int(2, 5);
    const digits: number[] = [rng.int(1, 9)];
    for (let i = 1; i < answer - 1; i++) digits.push(rng.int(0, 9));
    digits.push(rng.bool() ? 0 : rng.int(1, 9));
    const text = `0.${"0".repeat(leading)}${digits.join("")}`;
    const shown = digits.filter((v) => v !== 0).length;
    return numberProblem({
      prompt: t(`How many significant figures does $${text}$ have?`, `$${text}$ 有几个有效数字？`),
      answer,
      form: "integer",
      wrong: [
        answer + leading + 1,
        shown === answer ? answer + 1 : shown,
        answer + leading,
        answer - 1,
        answer + 1,
        answer + 2,
        answer + 3,
      ],
      solution: t(
        `Counting starts at the first digit that is not zero, ${digits[0]}. From there, the digits ${digits.join(", ")} all count, which makes ${answer}.`,
        `从第一个不是零的数字 ${digits[0]} 开始数。从这里起，${digits.join("、")} 都算，共 ${answer} 个。`,
      ),
    });
  },
};

const decimalToWhole: KnowledgePointDef = {
  id: "the-decimal-that-completes-a-whole-number",
  title: t("The decimal that completes a whole number", "凑成整数的小数"),
  explanation: t(
    "To find what is missing from a decimal to reach a whole number, subtract. Writing the whole number with the same number of decimal places as the other number, such as $10.00$, makes each column clear. A quick way to check the digits is that the two hundredths digits must add to ten, and that the digits further to the left must add to nine. That check also spots a missing regrouping.",
    "要求一个小数还差多少才到某个整数，就做减法。把整数写成和另一个数相同的小数位数，比如 $10.00$，每一列就很清楚。检查数字的快办法是：两个百分位数字加起来应是十，再往左的数字加起来应是九。这个检验也能发现漏掉的退位。",
  ),
  generate(rng) {
    const whole = rng.pick([5, 10, 20, 50, 100]);
    const big = rng.int(1, whole * 100 - 1);
    const part = big % 10 === 0 ? big + 3 : big;
    const answer = whole * 100 - part;
    return numberProblem({
      prompt: t(
        `Find the missing number: $$${hundredths(part)} + \\square = ${whole}$$`,
        `求缺失的数：$$${hundredths(part)} + \\square = ${whole}$$`,
      ),
      answer: Q.of(answer, 100),
      form: "decimal",
      wrong: [Q.of(answer + 10, 100), Q.of(answer + 100, 100), Q.of(whole * 100 + part, 100), Q.of(answer - 1, 100), Q.of(answer, 10)],
      solution: t(
        `Subtract: $${whole}.00 - ${hundredths(part)} = ${hundredths(answer)}$.`,
        `做减法：$${whole}.00 - ${hundredths(part)} = ${hundredths(answer)}$。`,
      ),
    });
  },
};

const decimalsFromKnownProduct: KnowledgePointDef = {
  id: "a-decimal-product-from-a-whole-number-product",
  title: t("A decimal product from a whole-number product", "由整数的积求小数的积"),
  explanation: t(
    "The digits of a decimal product are the same as those of the whole-number product. Only the place of the decimal point changes. The product has as many decimal places as the two factors have together, as each decimal place divides the result by ten. So a known product of whole numbers gives the decimal product at once, and an estimate from rounding the factors confirms that the point is in the right place.",
    "小数乘积的数字与整数乘积相同，只是小数点的位置变了。积的小数位数等于两个因数的小数位数之和，因为每一位小数都把结果除以十。所以已知整数的积，马上就能得到小数的积，把因数舍入后估算可以确认小数点的位置对不对。",
  ),
  generate(rng) {
    const a = rng.pick([...Array(89).keys()].map((i) => 11 + i).filter((v) => v % 10 !== 0));
    const b = rng.pick([...Array(89).keys()].map((i) => 11 + i).filter((v) => v % 10 !== 0));
    const product = a * b;
    const placesA = rng.int(1, 2);
    const placesB = rng.int(1, 2);
    const fa = Q.of(a, 10 ** placesA);
    const fb = Q.of(b, 10 ** placesB);
    const answer = fa.mul(fb);
    return numberProblem({
      prompt: t(
        `Given that $${a} \\times ${b} = ${product}$, find $${dec(fa)} \\times ${dec(fb)}$.`,
        `已知 $${a} \\times ${b} = ${product}$，求 $${dec(fa)} \\times ${dec(fb)}$。`,
      ),
      answer,
      form: "decimal",
      wrong: [answer.mul(Q.of(10)), answer.div(Q.of(10)), answer.mul(Q.of(100)), answer.div(Q.of(100))],
      solution: t(
        `The factors have ${placesA + placesB} decimal places together, so move the point ${placesA + placesB} places left in ${product}: $${dec(answer)}$.`,
        `两个因数共有 ${placesA + placesB} 位小数，所以把 ${product} 的小数点向左移 ${placesA + placesB} 位：$${dec(answer)}$。`,
      ),
    });
  },
};

const decimalsFromKnownQuotient: KnowledgePointDef = {
  id: "a-decimal-quotient-from-a-whole-number-quotient",
  title: t("A decimal quotient from a whole-number quotient", "由整数的商求小数的商"),
  explanation: t(
    "Multiplying the dividend and the divisor by the same number leaves a quotient unchanged. That is why a decimal divisor can be made into a whole number. It also means a known quotient can be reused. Compare the given numbers with the known ones, and see how many times ten each of them has been divided. When both change by the same power of ten, the quotient stays the same; otherwise it moves by the difference.",
    "被除数和除数乘以同一个数，商不变。这就是小数除数能化成整数的原因，也意味着已知的商可以再利用。把给出的数与已知的数比较，看看每个数除以了多少个十。两者变化的 10 的幂相同时，商不变；否则商按差移动。",
  ),
  generate(rng) {
    const q = rng.int(12, 96);
    const d = rng.pick([...Array(40).keys()].map((i) => 11 + i).filter((v) => v % 10 !== 0));
    const n = q * d;
    const shiftN = rng.int(0, 2);
    const shiftD = rng.int(1, 2);
    const answer = Q.of(q).mul(Q.of(10 ** shiftD, 10 ** shiftN));
    const dn = dec(Q.of(n, 10 ** shiftN));
    const dd = dec(Q.of(d, 10 ** shiftD));
    return numberProblem({
      prompt: t(
        `Given that $${n} \\div ${d} = ${q}$, find $${dn} \\div ${dd}$.`,
        `已知 $${n} \\div ${d} = ${q}$，求 $${dn} \\div ${dd}$。`,
      ),
      answer,
      form: "decimal",
      wrong: [answer.mul(Q.of(10)), answer.div(Q.of(10)), answer.mul(Q.of(100)), answer.div(Q.of(100)), Q.of(q + 1)],
      solution: t(
        `Multiply both numbers by $${10 ** Math.max(shiftN, shiftD)}$ to clear the decimals. This makes the division $${dec(Q.of(n, 10 ** shiftN).mul(Q.of(10 ** Math.max(shiftN, shiftD))))} \\div ${dec(Q.of(d, 10 ** shiftD).mul(Q.of(10 ** Math.max(shiftN, shiftD))))}$, whose value is $${dec(answer)}$.`,
        `两数都乘以 $${10 ** Math.max(shiftN, shiftD)}$，消去小数。除法变成 $${dec(Q.of(n, 10 ** shiftN).mul(Q.of(10 ** Math.max(shiftN, shiftD))))} \\div ${dec(Q.of(d, 10 ** shiftD).mul(Q.of(10 ** Math.max(shiftN, shiftD))))}$，值是 $${dec(answer)}$。`,
      ),
    });
  },
};

const zerosInPower: KnowledgePointDef = {
  id: "zeros-at-the-end-of-a-power-of-a-multiple-of-ten",
  title: t("Zeros at the end of a power of a multiple of ten", "整十数的幂末尾的零"),
  explanation: t(
    "A multiple of ten can be split into a digit and a power of ten. Each copy of the base brings along its own zeros, and they all add together. So raising 30 to the fourth power gives $3^4$ followed by four zeros. Counting the zeros is the same as multiplying the exponent by the number of zeros in the base. Take care if the digit's own power ends in zero, as it would add another zero.",
    "整十数可以拆成一个数字和 10 的幂。底数的每一份都带着自己的零，这些零要加在一起。所以 30 的四次方就是 $3^4$ 后面跟四个零。数零的个数，就是用指数乘以底数中零的个数。如果数字自身的幂末尾是零，还要再多算一个零，这一点要小心。",
  ),
  generate(rng) {
    const digit = rng.pick([2, 3, 6, 7, 9]);
    const zeros = rng.int(1, 2);
    const exponent = rng.int(2, 7);
    const answer = zeros * exponent;
    const base = digit * 10 ** zeros;
    return numberProblem({
      prompt: t(
        `When $${base}^{${exponent}}$ is written out, how many zeros does it end with?`,
        `$${base}^{${exponent}}$ 写出来后，末尾有多少个零？`,
      ),
      answer,
      form: "integer",
      wrong: [zeros, exponent, zeros + exponent, answer + 1, answer * 2],
      solution: t(
        `Each of the ${exponent} copies of ${base} brings ${zeros} ${zeros === 1 ? "zero" : "zeros"}, which makes $${exponent} \\times ${zeros} = ${answer}$. The power of ${digit} does not end in zero, so it adds no more.`,
        `${exponent} 个 ${base} 各带 ${zeros} 个零，共 $${exponent} \\times ${zeros} = ${answer}$ 个。${digit} 的幂末尾不是零，所以不再增加。`,
      ),
    });
  },
};

const missingExponent: KnowledgePointDef = {
  id: "the-missing-exponent",
  title: t("The missing exponent", "缺失的指数"),
  explanation: t(
    "An exponent says how many times a base is used as a factor. To find an unknown exponent, keep multiplying by the base and count the factors until the value is reached. Another way is to keep dividing the value by the base until 1 is reached. Either way the count is the exponent. The value 1 is not counted as a factor, and a slip here gives an answer that is off by one.",
    "指数表示底数作为因数用了多少次。要求未知的指数，就不断乘以底数并数因数的个数，直到达到这个值。也可以不断用这个值除以底数，直到得 1。无论哪种方法，数出来的都是指数。1 不算作因数，这里出错，答案就会差 1。",
  ),
  generate(rng) {
    const base = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const answer = rng.int(2, base <= 3 ? 10 : base <= 6 ? 6 : 5);
    const value = base ** answer;
    return numberProblem({
      prompt: t(`Find the missing exponent: $$${base}^{\\square} = ${value}$$`, `求缺失的指数：$$${base}^{\\square} = ${value}$$`),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, Math.floor(value / base), base, answer + 2],
      solution: t(
        `Writing $${value}$ as a product of ${base}s takes ${answer} factors, so the exponent is ${answer}.`,
        `把 $${value}$ 写成 ${base} 的连乘，要用 ${answer} 个因数，所以指数是 ${answer}。`,
      ),
    });
  },
};

const lastDigitOfPower: KnowledgePointDef = {
  id: "the-last-digit-of-a-large-power",
  title: t("The last digit of a large power", "大幂的个位数字"),
  explanation: t(
    "The last digit of a product depends only on the last digits of its factors. So the last digits of the powers of a number soon begin to repeat, usually in a cycle of length 1, 2 or 4. Write out the first few, spot the cycle, and then divide the exponent by the length of the cycle. The remainder tells which digit in the cycle is the answer, where a remainder of zero means the last one in the cycle.",
    "积的个位只取决于因数的个位。所以一个数的各次幂的个位很快开始重复，周期通常是 1、2 或 4。写出前几个，找到周期，再用指数除以周期的长度。余数说明答案是周期中的第几个，余数为零表示周期中的最后一个。",
  ),
  generate(rng) {
    const base = rng.pick([2, 3, 4, 7, 8, 9]);
    const exponent = rng.int(10, 60);
    const cycle: number[] = [];
    let last = base;
    while (!cycle.includes(last)) {
      cycle.push(last);
      last = (last * base) % 10;
    }
    const answer = cycle[(exponent - 1) % cycle.length] as number;
    const next = cycle[exponent % cycle.length] as number;
    return numberProblem({
      prompt: t(`What is the ones digit of $${base}^{${exponent}}$?`, `$${base}^{${exponent}}$ 的个位数字是多少？`),
      answer,
      form: "integer",
      wrong: [next, base, exponent % 10, (answer + 2) % 10, (answer + 5) % 10, (answer + 1) % 10, (answer + 3) % 10],
      solution: t(
        `The ones digits of the powers of ${base} repeat as ${cycle.join(", ")}, a cycle of length ${cycle.length}. Exponent ${exponent} leaves a remainder of ${exponent % cycle.length}, which points to ${answer}.`,
        `${base} 的各次幂的个位按 ${cycle.join("、")} 重复，周期是 ${cycle.length}。指数 ${exponent} 除以周期余 ${exponent % cycle.length}，对应 ${answer}。`,
      ),
    });
  },
};

const scalingVolume: KnowledgePointDef = {
  id: "how-volume-grows-when-edges-grow",
  title: t("How volume grows when edges grow", "棱长变大时体积如何变化"),
  explanation: t(
    "A volume is a product of three lengths. So if every edge of a box is doubled, the volume is multiplied by $2 \\times 2 \\times 2$, which is 8, and not by 2. Only one factor of the scale appears for each of the three directions. If only one edge changes, the volume changes by that factor alone. Picturing how many copies of the small box fit into the big one helps to make sense of this.",
    "体积是三个长度的积。所以如果盒子的每条棱都扩大到 2 倍，体积就乘以 $2 \\times 2 \\times 2$，即 8，而不是 2。三个方向各贡献一个倍数。如果只有一条棱变化，体积就只按这一个倍数变化。想一想大盒子能放下多少个小盒子，有助于理解这一点。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(2, 9);
    const k = rng.int(2, 4);
    const all = rng.bool();
    const volume = a * b * c;
    const answer = all ? volume * k ** 3 : volume * k;
    return numberProblem({
      prompt: t(
        `A box has a volume of ${volume} cubic centimeters. ${all ? `Every edge is multiplied by ${k}.` : `Only its height is multiplied by ${k}.`} What is the new volume, in cubic centimeters?`,
        `一个盒子的体积是 ${volume} 立方厘米。${all ? `每条棱都乘以 ${k}。` : `只有高乘以 ${k}。`}新的体积是多少立方厘米？`,
      ),
      answer,
      form: "integer",
      wrong: [all ? volume * k : volume * k ** 3, volume * k ** 2, volume + k, volume + 3 * k, answer * 2],
      solution: t(
        all
          ? `Each of the three directions multiplies the volume by ${k}, so the volume is multiplied by ${k ** 3}: $${volume} \\times ${k ** 3} = ${answer}$.`
          : `One edge multiplies the volume by ${k} once: $${volume} \\times ${k} = ${answer}$.`,
        all
          ? `三个方向各把体积乘以 ${k}，所以体积乘以 ${k ** 3}：$${volume} \\times ${k ** 3} = ${answer}$。`
          : `一条棱使体积乘以 ${k} 一次：$${volume} \\times ${k} = ${answer}$。`,
      ),
    });
  },
};

const cubesInBox: KnowledgePointDef = {
  id: "how-many-cubes-fill-a-box",
  title: t("How many cubes fill a box", "盒子能装多少个立方体"),
  explanation: t(
    "To count how many small cubes fit in a box, think along each edge. Divide each edge length by the edge of the cube to find how many cubes fit in that direction, and then multiply the three counts. When the edges divide exactly, this equals dividing the two volumes. When they do not, dividing the volumes gives too large an answer, because no cube can be cut to fill the gaps along the walls.",
    "要数盒子里能装多少个小立方体，就沿每条棱来想。用每条棱长除以立方体的棱长，算出这个方向能放几个，再把三个数相乘。棱长能整除时，这等于把两个体积相除。不能整除时，体积相除得到的答案偏大，因为立方体不能切开来填满靠墙的空隙。",
  ),
  generate(rng) {
    const s = rng.int(2, 5);
    const x = rng.int(2, 8);
    const y = rng.int(2, 8);
    const z = rng.int(2, 8);
    const extra = rng.int(1, s - 1);
    const a = x * s + extra;
    const b = y * s;
    const c = z * s;
    const answer = x * y * z;
    return numberProblem({
      prompt: t(
        `A box measures ${a} cm by ${b} cm by ${c} cm. How many whole cubes with edges of ${s} cm can be packed inside it?`,
        `一个盒子长 ${a} 厘米、宽 ${b} 厘米、高 ${c} 厘米。里面最多能放多少个棱长 ${s} 厘米的完整立方体？`,
      ),
      answer,
      form: "integer",
      wrong: [(x + 1) * y * z, Math.floor((a * b * c) / s ** 3), Math.floor((a * b * c) / s), x + y + z, a * b * c],
      solution: t(
        `Along the edges, $${a} \\div ${s}$ fits ${x} whole cubes, ${b} fits ${y}, and ${c} fits ${z}. So $${x} \\times ${y} \\times ${z} = ${answer}$ cubes fit.`,
        `沿各条棱，$${a} \\div ${s}$ 能放 ${x} 个完整的，${b} 能放 ${y} 个，${c} 能放 ${z} 个。所以能放 $${x} \\times ${y} \\times ${z} = ${answer}$ 个。`,
      ),
    });
  },
};

const rectangleOnGrid: KnowledgePointDef = {
  id: "the-area-of-a-rectangle-from-its-corners",
  title: t("The area of a rectangle from its corners", "由顶点坐标求长方形面积"),
  explanation: t(
    "Coordinates can be used to find lengths without any ruler. When two corners of a rectangle share a coordinate, the side between them runs along a grid line. Its length is the difference of the other coordinates. Two corners that are opposite each other give both side lengths, one from the first coordinates and one from the second. Multiplying these two lengths gives the area of the rectangle, and adding them twice gives the perimeter.",
    "不用尺子也能用坐标求长度。当长方形的两个顶点有一个坐标相同时，它们之间的边沿着网格线，长度就是另一个坐标的差。相对的两个顶点能给出两条边长，一条来自第一个坐标，一条来自第二个坐标。两条边长相乘得面积，相加再乘 2 得周长。",
  ),
  generate(rng) {
    const x1 = rng.int(0, 9);
    const y1 = rng.int(0, 9);
    const w = rng.int(2, 12);
    const h = rng.pick([...Array(11).keys()].map((i) => i + 2).filter((v) => v !== w));
    const asksArea = rng.bool();
    const answer = asksArea ? w * h : 2 * (w + h);
    return numberProblem({
      prompt: t(
        `A rectangle with sides along the grid lines has opposite corners at $(${x1}, ${y1})$ and $(${x1 + w}, ${y1 + h})$. What is its ${asksArea ? "area" : "perimeter"}?`,
        `一个边沿网格线的长方形，相对的两个顶点是 $(${x1}, ${y1})$ 和 $(${x1 + w}, ${y1 + h})$。它的${asksArea ? "面积" : "周长"}是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [asksArea ? 2 * (w + h) : w * h, w + h, (x1 + w) * (y1 + h), answer + 2, w * w, answer + 4],
      solution: t(
        `The sides are $${x1 + w} - ${x1} = ${w}$ and $${y1 + h} - ${y1} = ${h}$. ${asksArea ? `So the area is $${w} \\times ${h} = ${answer}$.` : `So the perimeter is $2 \\times (${w} + ${h}) = ${answer}$.`}`,
        `两条边是 $${x1 + w} - ${x1} = ${w}$ 和 $${y1 + h} - ${y1} = ${h}$。${asksArea ? `所以面积是 $${w} \\times ${h} = ${answer}$。` : `所以周长是 $2 \\times (${w} + ${h}) = ${answer}$。`}`,
      ),
    });
  },
};

const ruleBetweenPatterns: KnowledgePointDef = {
  id: "a-far-term-of-a-related-pattern",
  title: t("A far term of a related pattern", "相关规律中很靠后的一项"),
  explanation: t(
    "When two patterns start at zero and each adds its own number, the terms in matching positions keep a steady ratio. So the second pattern can be reached from the first by a single multiplication. Knowing this rule, a far term can be found without writing out either pattern. First work out the multiplier from the two steps, and then multiply the term of the first pattern by it.",
    "当两个规律都从零开始、各加自己的数时，对应位置的项保持固定的倍数关系。所以第一个规律的项只要乘一次，就得到第二个规律的项。知道了这个规则，不用写出任何一个规律，就能求出很靠后的项。先由两个步长算出倍数，再用第一个规律的项乘以它。",
  ),
  generate(rng) {
    const step = rng.int(2, 6);
    const times = rng.int(2, 6);
    const position = rng.int(12, 40);
    const value = step * position;
    const answer = value * times;
    return numberProblem({
      prompt: t(
        `Pattern A starts at 0 and adds ${step} each time. Pattern B starts at 0 and adds ${step * times} each time. When the term of pattern A is ${value}, what is the matching term of pattern B?`,
        `规律 A 从 0 开始，每次加 ${step}。规律 B 从 0 开始，每次加 ${step * times}。当规律 A 的项是 ${value} 时，规律 B 对应的项是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [value + step * times, value * step, position * step, answer + step * times, position * times],
      solution: t(
        `Each term of B is ${times} times the matching term of A, because $${step * times} \\div ${step} = ${times}$. So the term is $${value} \\times ${times} = ${answer}$.`,
        `B 的每一项是 A 对应项的 ${times} 倍，因为 $${step * times} \\div ${step} = ${times}$。所以这一项是 $${value} \\times ${times} = ${answer}$。`,
      ),
    });
  },
};

const squareWithSamePerimeter: KnowledgePointDef = {
  id: "a-square-with-the-same-perimeter",
  title: t("A square with the same perimeter", "周长相同的正方形"),
  explanation: t(
    "A piece of wire keeps its length when it is bent into a new shape, and so the perimeter stays the same. A rectangle and a square made from one wire have the same perimeter, but not the same area. Find the perimeter from the first shape, and then divide by 4 to find the side of the square. Among rectangles with one fixed perimeter, the square always has the largest area.",
    "一根铁丝弯成新的形状时长度不变，所以周长不变。用同一根铁丝做的长方形和正方形周长相同，但面积不同。先由第一个图形求出周长，再除以 4 得到正方形的边长。在周长一定的长方形中，正方形的面积总是最大。",
  ),
  generate(rng) {
    const side = rng.int(3, 25);
    const offset = rng.int(1, side - 1);
    const length = side + offset;
    const width = side - offset;
    const asksArea = rng.bool();
    const answer = asksArea ? side * side : side;
    return numberProblem({
      prompt: t(
        `A wire is bent into a rectangle ${length} cm long and ${width} cm wide. It is then bent into a square. What is the ${asksArea ? "area of the square in square centimeters" : "side of the square in centimeters"}?`,
        `一根铁丝弯成长 ${length} 厘米、宽 ${width} 厘米的长方形，再弯成一个正方形。这个正方形的${asksArea ? "面积是多少平方厘米" : "边长是多少厘米"}？`,
      ),
      answer,
      form: "integer",
      wrong: [
        asksArea ? length * width : length,
        asksArea ? 4 * side : width,
        2 * (length + width),
        answer + 1,
        asksArea ? side : length + width,
      ],
      solution: t(
        `The perimeter is $2 \\times (${length} + ${width}) = ${4 * side}$ cm, so the side of the square is $${4 * side} \\div 4 = ${side}$ cm${asksArea ? `, and the area is $${side} \\times ${side} = ${answer}$` : ""}.`,
        `周长是 $2 \\times (${length} + ${width}) = ${4 * side}$ 厘米，所以正方形的边长是 $${4 * side} \\div 4 = ${side}$ 厘米${asksArea ? `，面积是 $${side} \\times ${side} = ${answer}$` : ""}。`,
      ),
    });
  },
};

const diagonalsFromVertex: KnowledgePointDef = {
  id: "diagonals-from-one-vertex",
  title: t("Diagonals from one vertex", "从一个顶点出发的对角线"),
  explanation: t(
    "A diagonal joins two vertices of a polygon that are not next to each other. From any one vertex, a line cannot go to that vertex itself or to its two neighbors, since those are sides. So a polygon with $n$ sides has $n - 3$ diagonals from each vertex. A quadrilateral therefore has one, which agrees with a picture. These diagonals also cut the polygon into triangles, one more than the number of diagonals.",
    "对角线连接多边形中不相邻的两个顶点。从任一顶点出发，线不能连到它自身，也不能连到它的两个相邻顶点，因为那些是边。所以 $n$ 边形从每个顶点出发有 $n - 3$ 条对角线。四边形因此有一条，与图形相符。这些对角线还把多边形分成若干三角形，三角形的个数比对角线多 $1$。",
  ),
  generate(rng) {
    const n = rng.int(4, 30);
    const asksTriangles = rng.bool();
    const answer = asksTriangles ? n - 2 : n - 3;
    return numberProblem({
      prompt: t(
        `A polygon has $${n}$ sides. All the diagonals are drawn from one vertex. ${asksTriangles ? "How many triangles are formed?" : "How many diagonals are drawn?"}`,
        `一个多边形有 $${n}$ 条边。从一个顶点画出所有的对角线。${asksTriangles ? "形成多少个三角形？" : "画了多少条对角线？"}`,
      ),
      answer,
      form: "integer",
      wrong: [n, n - 1, asksTriangles ? n - 3 : n - 2, n + 1, n - 4],
      solution: t(
        `A vertex cannot join itself or its 2 neighbors, so there are $${n} - 3 = ${n - 3}$ diagonals${asksTriangles ? `, which cut the polygon into ${answer} triangles` : ""}.`,
        `一个顶点不能连到自身和 2 个相邻顶点，所以有 $${n} - 3 = ${n - 3}$ 条对角线${asksTriangles ? `，它们把多边形分成 ${answer} 个三角形` : ""}。`,
      ),
    });
  },
};

/** deeperGrade5Points maps topics of 5th Grade Math to further knowledge points. */
export const deeperGrade5Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "absolute-value": [integersWithSmallAbsoluteValue],
  "integers-and-opposites": [integersBetween],
  "negative-numbers": [elevationGap],
  "evaluating-whole-number-expressions-with-parentheses": [parenthesesGain],
  "two-digit-by-two-digit-multiplication": [nextProduct],
  "three-digit-by-three-digit-multiplication": [digitsOfProduct],
  "four-digit-by-two-digit-division": [addToMakeMultiple],
  "adding-fractions-with-unlike-denominators": [missingFractionAddend],
  "adding-and-subtracting-fractions-with-unlike-denominators-word-problems": [leftOverTwoParts],
  "adding-and-subtracting-mixed-numbers-with-unlike-denominators-word-problems": [mixedToNextWhole],
  "multiplying-fractions-word-problems": [fractionOfTheRest],
  "dividing-whole-numbers-by-fractions": [fullPieces],
  reciprocals: [reciprocalOfSum],
  "dividing-fractions-and-whole-numbers-word-problems": [fractionOfWholeBackwards],
  "rounding-up-decimals": [roundingEnds],
  "comparing-decimals": [decimalsBetween],
  "significant-figures-with-decimals": [countingSignificantFigures],
  "subtraction-with-unequal-numbers-of-decimals": [decimalToWhole],
  "multiplying-two-digit-decimals": [decimalsFromKnownProduct],
  "dividing-three-digit-decimals-by-two-digit-decimals": [decimalsFromKnownQuotient],
  "multiplying-numbers-by-powers-of-ten-with-exponents": [zerosInPower],
  "evaluating-exponents": [missingExponent],
  "evaluating-larger-exponents": [lastDigitOfPower],
  "volumes-of-right-rectangular-prisms": [scalingVolume],
  "volumes-of-right-rectangular-prisms-word-problems": [cubesInBox],
  "solving-real-world-problems-using-coordinates": [rectangleOnGrid],
  "connecting-patterns": [ruleBetweenPatterns],
  "rectangles-rhombuses-and-squares": [squareWithSamePerimeter],
  polygons: [diagonalsFromVertex],
};
