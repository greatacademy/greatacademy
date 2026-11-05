// Further knowledge points for topics of 7th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade7Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { numberProblem } from "../problems.ts";

/** gcd7 is the greatest common factor of two positive integers. */
const gcd7 = (a: number, b: number): number => (b === 0 ? a : gcd7(b, a % b));

const upThenDownSame: KnowledgePointDef = {
  id: "up-and-down-by-the-same-percent",
  title: t("Up and down by the same percent", "先升后降相同的百分数"),
  explanation: t(
    "A rise followed by a fall of the same percent does not return to the start. The second percent applies to a larger amount, so more is taken away than was added. The two multipliers show exactly what happens: their product is $1$ minus the square of the rate. So the overall result is always a loss, and the size of the loss does not depend on the starting value at all, or on the order.",
    "先升后降相同的百分数，并不会回到起点。第二个百分数作用于更大的量，所以减去的比加上的多。两个乘数准确地说明了这一点：它们的积是 $1$ 减去比率的平方。所以总的结果总是减少，减少的幅度完全不取决于起始值，也不取决于顺序。",
  ),
  generate(rng) {
    const rate = rng.int(2, 90);
    const answer = Q.of(rate * rate, 100);
    const up = Q.of(100 + rate, 100);
    const down = Q.of(100 - rate, 100);
    return numberProblem({
      prompt: t(
        `A price rises by $${rate}\\%$ and then falls by $${rate}\\%$. By what percent of the original is the final price lower than the original?`,
        `一个价格先上涨 $${rate}\\%$，再下降 $${rate}\\%$。最终价格比原价低原价的百分之几？`,
      ),
      answer,
      form: "decimal",
      percent: true,
      wrong: [Q.of(0), Q.of(rate), Q.of(2 * rate), answer.mul(Q.of(2)), Q.of(rate * rate)],
      solution: t(
        `The multipliers give $${dec(up)} \\times ${dec(down)} = ${dec(up.mul(down))}$. So the final price is $${dec(answer)}\\%$ lower.`,
        `两个乘数相乘：$${dec(up)} \\times ${dec(down)} = ${dec(up.mul(down))}$。所以最终价格低 $${dec(answer)}\\%$。`,
      ),
    });
  },
};

const returningPercent: KnowledgePointDef = {
  id: "the-percent-that-undoes-a-change",
  title: t("The percent that undoes a change", "抵消变化的百分数"),
  explanation: t(
    "A percent is always a percent of something, and the base changes after each step. If a value is raised by some percent, it takes a smaller percent decrease to bring it back, as that decrease is measured from the larger value. The change needed is the same in actual size, but it is compared with a different amount. So divide the amount of the change by the new value, and not by the original one.",
    "百分数总是某个量的百分数，而每一步之后基数都会变。如果一个值上涨了某个百分数，只要下降一个较小的百分数就能回到原值，因为这个下降是从较大的值算起的。需要的变化在实际大小上相同，但比较的基数不同。所以要用变化量除以新的值，而不是原来的值。",
  ),
  generate(rng) {
    const [up, down] = rng.pick([
      [25, 20],
      [100, 50],
      [150, 60],
      [300, 75],
      [400, 80],
      [900, 90],
      [60, 37.5],
    ]) as [number, number];
    const base = 20 * rng.int(1, 20);
    const raised = (base * (100 + up)) / 100;
    const half = (v: number) => Q.of(v * 4, 4);
    return numberProblem({
      prompt: t(
        `A price of ${base} dollars is raised by ${up}%. By what percent must the new price be lowered to bring it back to ${base} dollars?`,
        `${base} 美元的价格上涨 ${up}%。新价格要下降百分之几才能回到 ${base} 美元？`,
      ),
      answer: half(down),
      form: "decimal",
      percent: true,
      wrong: [half(up), half(down + 5), half(down / 2), half(100 - down)],
      solution: t(
        `The new price is ${raised}, and it must fall by $${raised} - ${base} = ${raised - base}$. As a percent of the new price, that is $${raised - base} \\div ${raised} = ${down}\\%$.`,
        `新价格是 ${raised}，要下降 $${raised} - ${base} = ${raised - base}$。占新价格的百分比是 $${raised - base} \\div ${raised} = ${down}\\%$。`,
      ),
    });
  },
};

const originalFromTwoChanges: KnowledgePointDef = {
  id: "the-original-value-after-two-changes",
  title: t("The original value after two changes", "两次变化后求原值"),
  explanation: t(
    "When a value has been through two percent changes, its final value is the original times both multipliers. So working backwards means dividing by both of them. Taking the percents away from the final value does not work, because each of them was measured from a different amount. Combining the two multipliers into one is the neatest approach, and multiplying forward from the answer checks that the final value is reached.",
    "一个值经过两次百分比变化后，最终值等于原值乘以两个乘数。所以倒着算就是除以这两个乘数。从最终值减去百分数是不行的，因为它们各自的基数不同。把两个乘数合成一个是最简洁的办法，再从答案往前乘，检验能否得到最终值。",
  ),
  generate(rng) {
    const discount = rng.pick([10, 20, 25, 40, 50]);
    const tax = rng.pick([5, 10, 20]);
    const original = 400 * rng.int(1, 12);
    const sale = (original * (100 - discount)) / 100;
    const final = (sale * (100 + tax)) / 100;
    return numberProblem({
      prompt: t(
        `A coat is sold at $${discount}\\%$ off, and a $${tax}\\%$ tax is then added to the sale price. The final cost is $${final}$ dollars. What was the original price, in dollars?`,
        `一件外套打折 $${discount}\\%$，然后在售价上加 $${tax}\\%$ 的税。最终花费 $${final}$ 美元。原价是多少美元？`,
      ),
      answer: original,
      form: "integer",
      wrong: [
        sale,
        Math.round(final * (1 + (discount - tax) / 100)),
        final,
        Math.round(final / (1 - (discount - tax) / 100)),
        original + 400,
      ],
      solution: t(
        `The overall multiplier is $${(100 - discount) / 100} \\times ${(100 + tax) / 100}$. Dividing, $${final}$ comes from $${sale}$ before the tax, and $${sale}$ comes from $${original}$ before the discount.`,
        `总的乘数是 $${(100 - discount) / 100} \\times ${(100 + tax) / 100}$。倒着除，$${final}$ 是税前的 $${sale}$，$${sale}$ 是打折前的 $${original}$。`,
      ),
    });
  },
};

const averagePrice: KnowledgePointDef = {
  id: "the-average-price-of-a-mixture",
  title: t("The average price of a mixture", "混合后的平均价格"),
  explanation: t(
    "A unit price for a mixture is the total cost divided by the total amount. It is usually not the simple average of the two prices, because the larger amount carries more weight. So work out the cost of each part, add those costs, and divide by the total weight. The answer always lies between the two prices, and it lies nearer to the price of the part that there is more of.",
    "混合物的单价是总费用除以总量。它通常不是两个价格的简单平均，因为量大的部分权重更大。所以先算出每部分的费用，把费用相加，再除以总重量。答案总在两个价格之间，而且更接近量较多那部分的价格。",
  ),
  generate(rng) {
    const low = rng.int(2, 9);
    const high = low + rng.int(2, 9);
    const a = rng.int(2, 18);
    const b = rng.int(2, 18);
    const cost = a * low + b * high;
    const answer = Q.of(cost, a + b);
    return numberProblem({
      prompt: t(
        `A shop mixes ${a} kg of tea at ${low} dollars per kg with ${b} kg of tea at ${high} dollars per kg. What is the price per kg of the mixture, in dollars? Give an exact value.`,
        `一家店把 ${a} 千克每千克 ${low} 美元的茶和 ${b} 千克每千克 ${high} 美元的茶混合。混合茶每千克多少美元？写出准确值。`,
      ),
      answer,
      wrong: [Q.of(low + high, 2), Q.of(cost), Q.of(low + high), answer.add(Q.of(1)), Q.of(cost, 2)],
      solution: t(
        `The total cost is $${a} \\times ${low} + ${b} \\times ${high} = ${cost}$ dollars, for ${a + b} kg. So the price is $${answer.toLatex()}$ dollars per kg.`,
        `总费用是 $${a} \\times ${low} + ${b} \\times ${high} = ${cost}$ 美元，共 ${a + b} 千克。所以每千克 $${answer.toLatex()}$ 美元。`,
      ),
    });
  },
};

const wholeJobTime: KnowledgePointDef = {
  id: "the-time-for-a-whole-job",
  title: t("The time for a whole job", "完成整项工作的时间"),
  explanation: t(
    "A unit rate does not need whole numbers. If a fraction of a job takes a fraction of an hour, then dividing the fraction of the job by the time gives the rate in jobs per hour. Flipping that rate gives the hours for one whole job. Equally, dividing the time by the fraction of the job gives this time directly. A check is that the time for a whole job exceeds the time for a part of it.",
    "单位率不一定是整数。如果完成一项工作的几分之几要用几分之几小时，用工作量除以时间，就得到每小时完成多少。把这个比率颠倒，就是完成整项工作的小时数。同样，用时间除以工作量可以直接得到这个时间。检验：完成整项工作的时间一定比完成一部分的时间长。",
  ),
  generate(rng) {
    const part = Q.of(rng.pick([1, 2, 3]), rng.pick([4, 5, 7]));
    const [hoursTop, hoursBottom] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 6],
      [5, 6],
    ]) as [number, number];
    const time = Q.of(hoursTop, hoursBottom);
    const answer = time.div(part);
    return numberProblem({
      prompt: t(
        `A painter covers $${part.toLatex()}$ of a wall in $${time.toLatex()}$ of an hour. At this rate, how many hours does the whole wall take?`,
        `一位油漆工 $${time.toLatex()}$ 小时刷完墙的 $${part.toLatex()}$。照这样的速度，刷完整面墙要多少小时？`,
      ),
      answer,
      wrong: [part.div(time), part.mul(time), time, answer.add(Q.of(1)), time.add(part)],
      solution: t(
        `Divide the time by the fraction of the wall: $${time.toLatex()} \\div ${part.toLatex()} = ${answer.toLatex()}$ hours.`,
        `用时间除以墙的比例：$${time.toLatex()} \\div ${part.toLatex()} = ${answer.toLatex()}$ 小时。`,
      ),
    });
  },
};

const sumOfIntegerRange: KnowledgePointDef = {
  id: "the-sum-of-integers-across-zero",
  title: t("The sum of integers across zero", "跨过零的整数之和"),
  explanation: t(
    "Additive inverses cancel, and this can shorten a long sum. In a list of consecutive integers that crosses zero, each negative number pairs with its opposite to give zero, and zero itself adds nothing. So only the numbers without a partner are left. These are the numbers on the side that reaches further, beyond the point where the other side stops. Adding just those few numbers gives the sum of the whole list.",
    "相反数相互抵消，这可以简化很长的加法。在跨过零的连续整数中，每个负数都和它的相反数配对得零，零本身也不增加什么。所以只剩下没有配对的数。这些数在延伸较远的一侧，位于另一侧结束之后。只把这几个数加起来，就得到整列数的和。",
  ),
  generate(rng) {
    const low = rng.int(3, 30);
    const extra = rng.int(1, 5);
    const positiveLonger = rng.bool();
    const a = positiveLonger ? low : low + extra;
    const b = positiveLonger ? low + extra : low;
    const left: number[] = [];
    for (let i = low + 1; i <= low + extra; i++) left.push(positiveLonger ? i : -i);
    const answer = left.reduce((sum, v) => sum + v, 0);
    return numberProblem({
      prompt: t(`Find the sum of all the integers from $-${a}$ to ${b}.`, `求从 $-${a}$ 到 ${b} 的所有整数之和。`),
      answer,
      form: "integer",
      wrong: [0, -answer, b - a, a + b, answer + (positiveLonger ? low : -low)],
      solution: t(
        `Each number from $-${low}$ to ${low} cancels with its opposite. ${left.length === 1 ? `Only $${answer}$ is left` : `That leaves $${left.map((v) => (v < 0 ? `(${v})` : `${v}`)).join(" + ")} = ${answer}$`}.`,
        `从 $-${low}$ 到 ${low} 的每个数都和它的相反数抵消。${left.length === 1 ? `只剩下 $${answer}$` : `剩下 $${left.map((v) => (v < 0 ? `(${v})` : `${v}`)).join(" + ")} = ${answer}$`}。`,
      ),
    });
  },
};

const alternatingPowers: KnowledgePointDef = {
  id: "a-sum-of-powers-of-negative-one",
  title: t("A sum of powers of negative one", "负一的幂之和"),
  explanation: t(
    "Powers of $-1$ alternate between $-1$ and $1$, since each further factor flips the sign. An even exponent gives $1$ and an odd exponent gives $-1$. In a long sum, each neighboring pair of terms cancels to zero. So the whole sum depends only on whether the last exponent is even or odd. This is the same sign rule that decides whether any product with many negative factors is positive or negative.",
    "$-1$ 的幂在 $-1$ 和 $1$ 之间交替，因为每多一个因数符号就翻转一次。偶数指数得 $1$，奇数指数得 $-1$。在很长的和中，每相邻两项抵消为零。所以整个和只取决于最后的指数是偶数还是奇数。这也是决定多个负因数之积是正还是负的符号规律。",
  ),
  generate(rng) {
    const n = rng.int(11, 400);
    const scale = rng.int(1, 9);
    const answer = n % 2 === 0 ? 0 : -scale;
    return numberProblem({
      prompt: t(
        `Find the value of $${scale === 1 ? "" : `${scale}\\left(`}(-1)^1 + (-1)^2 + (-1)^3 + \\cdots + (-1)^{${n}}${scale === 1 ? "" : "\\right)"}$.`,
        `求 $${scale === 1 ? "" : `${scale}\\left(`}(-1)^1 + (-1)^2 + (-1)^3 + \\cdots + (-1)^{${n}}${scale === 1 ? "" : "\\right)"}$ 的值。`,
      ),
      answer,
      form: "integer",
      wrong: [scale, n % 2 === 0 ? -scale : 0, -n * scale, n * scale, 2 * scale],
      solution: t(
        `Each neighboring pair adds to 0. ${n % 2 === 0 ? `With ${n} terms, all of them pair up, so the sum is 0.` : `With ${n} terms, one $-1$ is left over${scale === 1 ? "" : `, and $${scale} \\times (-1) = ${-scale}$`}.`}`,
        `每相邻两项之和是 0。${n % 2 === 0 ? `共 ${n} 项，全部配对，所以和是 0。` : `共 ${n} 项，剩下一个 $-1$${scale === 1 ? "" : `，而 $${scale} \\times (-1) = ${-scale}$`}。`}`,
      ),
    });
  },
};

const missingSignedValue: KnowledgePointDef = {
  id: "a-missing-value-from-a-signed-mean",
  title: t("A missing value from a signed mean", "由带符号的平均数求缺失的值"),
  explanation: t(
    "A mean can be negative, and the usual reasoning still works. Multiply the mean by the number of values to find their total. Subtract the known values from this total to find the one that is missing. Each subtraction of a negative number adds to the amount left, and so careful bracketing matters. Averaging the known values with the target, or simply subtracting the mean, misses the point that all the values share one total.",
    "平均数可以是负数，通常的推理依然成立。用平均数乘以个数得到总和。从总和中减去已知的值，就得到缺失的那个。减去负数等于增加剩下的量，所以要小心加括号。把已知值和目标值再求平均，或者简单地减去平均数，都没有抓住所有值共用一个总和这一点。",
  ),
  generate(rng) {
    const known = [rng.int(-15, -1), rng.int(-12, 12), rng.int(-15, 3), rng.int(-9, 9)];
    const answer = rng.int(-20, 20);
    const shift = known.reduce((sum, v) => sum + v, 0) + answer;
    const adjust = ((shift % 5) + 5) % 5;
    const missing = answer - adjust;
    const total = shift - adjust;
    const mean = total / 5;
    const shown = known.map((v) => `$${v}$`).join(", ");
    const shownZh = known.map((v) => `$${v}$`).join("、");
    return numberProblem({
      prompt: t(
        `On five days the temperature changes had a mean of $${mean}$ degrees. Four of the changes were ${shown}. What was the fifth change, in degrees?`,
        `五天的温度变化平均是 $${mean}$ 度。其中四天的变化是 ${shownZh}。第五天的变化是多少度？`,
      ),
      answer: missing,
      form: "integer",
      wrong: [
        total + known.reduce((sum, v) => sum + v, 0),
        mean,
        -missing,
        missing + 5,
        missing - 5,
        missing + 1,
        mean - known.reduce((sum, v) => sum + v, 0),
      ],
      solution: t(
        `The total of all five is $5 \\times ${mean < 0 ? `(${mean})` : mean} = ${total}$. The four known changes add up to $${known.reduce((sum, v) => sum + v, 0)}$, so the fifth is $${missing}$.`,
        `五天的总和是 $5 \\times ${mean < 0 ? `(${mean})` : mean} = ${total}$。已知四天的和是 $${known.reduce((sum, v) => sum + v, 0)}$，所以第五天是 $${missing}$。`,
      ),
    });
  },
};

const whatMustBeAdded: KnowledgePointDef = {
  id: "what-must-be-added-to-an-expression",
  title: t("What must be added to an expression", "算式要加什么"),
  explanation: t(
    "To find what must be added to one expression to get another, subtract: the target minus the starting expression. Subtraction must apply to every term in the group, so the signs of both terms change. It is easy to change only the first one. Adding the result back to the starting expression should give the target, and this check is quick, because the terms with the variable and the constants can be compared separately.",
    "要求一个算式加什么才能得到另一个，就做减法：目标减去起始算式。减法要作用于这组的每一项，所以两项的符号都要变。很容易只变第一项。把结果加回起始算式，应该得到目标，这个检验很快，因为含变量的项和常数项可以分别比较。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 15);
    const c = a + rng.int(2, 9);
    const d = rng.int(2, 15);
    const asksCoefficient = rng.bool();
    const answer = asksCoefficient ? c - a : -d - b;
    return numberProblem({
      prompt: t(
        `An expression is added to $${a}x + ${b}$, and the result is $${c}x - ${d}$. What is the ${asksCoefficient ? "coefficient of $x$" : "constant term"} of the added expression?`,
        `$${a}x + ${b}$ 加上一个算式，结果是 $${c}x - ${d}$。所加算式的${asksCoefficient ? " $x$ 的系数" : "常数项"}是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [
        asksCoefficient ? a + c : b - d,
        asksCoefficient ? a - c : d - b,
        asksCoefficient ? -d - b : c - a,
        asksCoefficient ? c : b + d,
        answer + 1,
      ],
      solution: t(
        `Subtract: $(${c}x - ${d}) - (${a}x + ${b}) = ${c - a}x - ${d + b}$. So the ${asksCoefficient ? "coefficient" : "constant term"} is $${answer}$.`,
        `做减法：$(${c}x - ${d}) - (${a}x + ${b}) = ${c - a}x - ${d + b}$。所以${asksCoefficient ? "系数" : "常数项"}是 $${answer}$。`,
      ),
    });
  },
};

const consecutiveIntegers: KnowledgePointDef = {
  id: "consecutive-integers-with-a-given-sum",
  title: t("Consecutive integers with a given sum", "和一定的连续整数"),
  explanation: t(
    "Consecutive integers can be written with one variable: $n$, $n + 1$, $n + 2$ and so on, and consecutive even or odd ones go up by $2$. Adding them gives a two-step equation. Look out for what the question asks for: the variable is the smallest number, and the question may want a different one. For an odd number of consecutive integers, the middle one equals the mean, which gives a useful check on the answer.",
    "连续整数可以用一个变量表示：$n$、$n + 1$、$n + 2$ 等，连续偶数或奇数每次加 $2$。把它们相加得到一个两步方程。要注意问题问的是什么：变量是最小的数，问题可能要的是另一个。奇数个连续整数的中间数等于平均数，这可以用来检验答案。",
  ),
  generate(rng) {
    const step = rng.pick([1, 2]);
    const count = rng.pick([3, 4, 5]);
    const first = rng.int(-20, 60) * (step === 2 ? 2 : 1);
    const terms = [...Array(count).keys()].map((i) => first + i * step);
    const sum = terms.reduce((total, v) => total + v, 0);
    const asksLargest = rng.bool();
    const answer = asksLargest ? (terms[count - 1] as number) : first;
    const nameEn = step === 1 ? "consecutive integers" : "consecutive even integers";
    const nameZh = step === 1 ? "连续整数" : "连续偶数";
    const offset = (step * count * (count - 1)) / 2;
    return numberProblem({
      prompt: t(
        `The sum of $${count}$ ${nameEn} is $${sum}$. What is the ${asksLargest ? "largest" : "smallest"} of them?`,
        `$${count}$ 个${nameZh}的和是 $${sum}$。其中${asksLargest ? "最大" : "最小"}的数是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [
        asksLargest ? first : (terms[count - 1] as number),
        Math.round(sum / count),
        answer + step,
        answer - step,
        Math.round(sum / (count + 1)),
      ],
      solution: t(
        `With $n$ as the smallest, the sum is $${count}n + ${offset}$. Then $${count}n = ${sum - offset}$, so $n = ${first}$${asksLargest ? `, and the largest is $${answer}$` : ""}.`,
        `设最小的数是 $n$，和是 $${count}n + ${offset}$。于是 $${count}n = ${sum - offset}$，$n = ${first}$${asksLargest ? `，最大的数是 $${answer}$` : ""}。`,
      ),
    });
  },
};

const agesEquation: KnowledgePointDef = {
  id: "when-one-age-is-a-multiple-of-another",
  title: t("When one age is a multiple of another", "一个年龄何时是另一个的倍数"),
  explanation: t(
    "As time passes, two ages grow by the same amount, so their difference stays fixed but their ratio changes. Let $x$ be the number of years from now, and write each future age as the current age plus $x$. Setting one equal to the required multiple of the other gives an equation with the variable on both sides. Remember to multiply the whole future age by the multiple, and not only the current age.",
    "随着时间过去，两个年龄增加同样多，所以它们的差不变，但比值会变。设 $x$ 为从现在起的年数，把每个将来的年龄写成现在的年龄加 $x$。令一个等于另一个的所要求的倍数，就得到两边都有变量的方程。记住要把整个将来的年龄乘以倍数，而不是只乘现在的年龄。",
  ),
  generate(rng) {
    const multiple = rng.int(2, 4);
    const futureKid = multiple === 2 ? rng.int(20, 40) : multiple === 3 ? rng.int(10, 20) : rng.int(7, 13);
    const answer = rng.int(1, Math.min(15, futureKid - 1));
    const kid = futureKid - answer;
    const adult = multiple * futureKid - answer;
    return numberProblem({
      prompt: t(
        `A parent is $${adult}$ years old and a child is $${kid}$. In how many years will the parent be $${multiple}$ times as old as the child?`,
        `家长 $${adult}$ 岁，孩子 $${kid}$ 岁。多少年后家长的年龄是孩子的 $${multiple}$ 倍？`,
      ),
      answer,
      form: "integer",
      wrong: [adult - multiple * kid, Math.round((adult - kid) / multiple), adult - kid, answer + 1, kid + answer, answer + 2, answer + 3],
      solution: t(
        `Solve $${adult} + x = ${multiple}(${kid} + x)$. This gives $${adult} + x = ${multiple * kid} + ${multiple}x$, so ${multiple === 2 ? `$x = ${answer}$` : `$${multiple - 1}x = ${adult - multiple * kid}$ and $x = ${answer}$`}.`,
        `解 $${adult} + x = ${multiple}(${kid} + x)$。得 $${adult} + x = ${multiple * kid} + ${multiple}x$，所以 ${multiple === 2 ? `$x = ${answer}$` : `$${multiple - 1}x = ${adult - multiple * kid}$，$x = ${answer}$`}。`,
      ),
    });
  },
};

const addToBothForRatio: KnowledgePointDef = {
  id: "adding-the-same-amount-to-reach-a-ratio",
  title: t("Adding the same amount to reach a ratio", "加同样的量以达到某个比"),
  explanation: t(
    "A fraction changes when the same amount is added to its top and bottom, and a proportion can show what amount gives a wanted value. Write the new fraction with $x$ in both places, set it equal to the wanted ratio, and cross multiply. The same $x$ on both sides makes this an equation with variables on both sides. Substituting back into the fraction confirms the result, and it should simplify to the wanted ratio exactly.",
    "分子分母加同样的量，分数就会变，用比例式可以求出多少量能得到想要的值。把新分数的两处都写上 $x$，令它等于想要的比，再交叉相乘。两边都有 $x$，所以这是两边都有变量的方程。代回分数可以确认结果，它应该恰好化简成想要的比。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 5],
      [2, 5],
      [5, 6],
      [5, 7],
    ]) as [number, number];
    const k = rng.int(2, 9);
    const candidates = [...Array(p * k - 1).keys()].map((i) => i + 1).filter((x) => gcd7(p * k - x, q * k - x) === 1);
    const result = rng.pick(candidates);
    const safeTop = p * k - result;
    const bottom = q * k - result;
    return numberProblem({
      prompt: t(
        `What number must be added to both the top and bottom of $\\frac{${safeTop}}{${bottom}}$ to make it equal to $\\frac{${p}}{${q}}$?`,
        `$\\frac{${safeTop}}{${bottom}}$ 的分子和分母都加上多少，才等于 $\\frac{${p}}{${q}}$？`,
      ),
      answer: result,
      form: "integer",
      wrong: [result + 1, result + 2, result + 3, p, q, (q - p) * k],
      solution: t(
        `Solve $\\frac{${safeTop} + x}{${bottom} + x} = \\frac{${p}}{${q}}$. Cross multiplying gives $${q}(${safeTop} + x) = ${p}(${bottom} + x)$, so ${q - p === 1 ? `$x = ${result}$` : `$${q - p}x = ${p * bottom - q * safeTop}$ and $x = ${result}$`}.`,
        `解 $\\frac{${safeTop} + x}{${bottom} + x} = \\frac{${p}}{${q}}$。交叉相乘得 $${q}(${safeTop} + x) = ${p}(${bottom} + x)$，所以 ${q - p === 1 ? `$x = ${result}$` : `$${q - p}x = ${p * bottom - q * safeTop}$，$x = ${result}$`}。`,
      ),
    });
  },
};

const ticketsSystem: KnowledgePointDef = {
  id: "a-system-from-a-count-and-a-cost",
  title: t("A system from a count and a cost", "由数量和费用列方程组"),
  explanation: t(
    "Problems with two kinds of item often give two facts: how many there are in all, and how much they cost in all. Each fact gives one equation. From the count, write one kind in terms of the other, and substitute this into the cost equation. Pay attention to which unknown the question is asking for. Substituting both values back into both of the original facts is the safest final check.",
    "有两种物品的问题常常给两个条件：一共有多少个，一共多少钱。每个条件给出一个方程。由数量，把一种用另一种表示，再代入费用方程。要注意问题问的是哪个未知数。把两个值代回原来的两个条件，是最稳妥的最后检验。",
  ),
  generate(rng) {
    const adult = rng.int(6, 15);
    const child = rng.int(2, adult - 2);
    const adults = rng.int(5, 80);
    const children = rng.int(5, 80);
    const count = adults + children;
    const cost = adult * adults + child * children;
    const asksAdults = rng.bool();
    const answer = asksAdults ? adults : children;
    return numberProblem({
      prompt: t(
        `A show sold $${count}$ tickets for $${cost}$ dollars in all. Adult tickets cost $${adult}$ dollars and child tickets cost $${child}$ dollars. How many ${asksAdults ? "adult" : "child"} tickets were sold?`,
        `一场演出共卖出 $${count}$ 张票，收入 $${cost}$ 美元。成人票 $${adult}$ 美元，儿童票 $${child}$ 美元。卖出多少张${asksAdults ? "成人" : "儿童"}票？`,
      ),
      answer,
      form: "integer",
      wrong: [
        asksAdults ? children : adults,
        Math.round(cost / adult),
        Math.round(cost / child),
        answer + 1,
        answer + 2,
        Math.floor(count / 2),
      ],
      solution: t(
        `With $a$ adult tickets, $${adult}a + ${child}(${count} - a) = ${cost}$. This gives $${adult - child === 1 ? "" : adult - child}a = ${cost - child * count}$, so $a = ${adults}$ and there are $${children}$ child tickets.`,
        `设成人票 $a$ 张，$${adult}a + ${child}(${count} - a) = ${cost}$。得 $${adult - child === 1 ? "" : adult - child}a = ${cost - child * count}$，所以 $a = ${adults}$，儿童票 $${children}$ 张。`,
      ),
    });
  },
};

const compoundCount: KnowledgePointDef = {
  id: "counting-integers-in-a-compound-inequality",
  title: t("Counting integers in a compound inequality", "数复合不等式中的整数"),
  explanation: t(
    "A compound inequality is solved by doing the same operation to all three parts. Once the variable stands alone in the middle, the bounds show which integers qualify. Whether each end counts depends on its sign: a strict sign leaves the end out, and an inclusive sign keeps it in. To count them, subtract the smallest qualifying integer from the largest and add one, because both ends of this list are included.",
    "解复合不等式时，对三个部分都做同样的运算。变量单独留在中间后，边界就说明哪些整数符合。每一端算不算，取决于它的符号：严格的符号不包括这一端，包含的符号则包括。要数个数，就用最大的符合条件的整数减去最小的，再加 $1$，因为这列数的两端都算在内。",
  ),
  generate(rng) {
    const k = rng.int(2, 5);
    const c = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const low = rng.int(-12, 2);
    const high = low + rng.int(3, 15);
    const lowStrict = rng.bool();
    const highStrict = rng.bool();
    const first = lowStrict ? low + 1 : low;
    const last = highStrict ? high - 1 : high;
    const answer = last - first + 1;
    const body = `${k}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
    const left = low * k + c;
    const right = high * k + c;
    return numberProblem({
      prompt: t(
        `How many integers $x$ satisfy $${left} ${lowStrict ? "<" : "\\le"} ${body} ${highStrict ? "<" : "\\le"} ${right}$?`,
        `有多少个整数 $x$ 满足 $${left} ${lowStrict ? "<" : "\\le"} ${body} ${highStrict ? "<" : "\\le"} ${right}$？`,
      ),
      answer,
      form: "integer",
      wrong: [high - low, high - low + 1, high - low - 1 === answer ? high - low + 2 : high - low - 1, right - left, answer + 2],
      solution: t(
        `${c < 0 ? `Adding ${-c}` : `Subtracting ${c}`} and dividing by ${k} gives $${low} ${lowStrict ? "<" : "\\le"} x ${highStrict ? "<" : "\\le"} ${high}$. The integers run from $${first}$ to $${last}$, which makes ${answer}.`,
        `${c < 0 ? `加上 ${-c}` : `减去 ${c}`} 并除以 ${k}，得 $${low} ${lowStrict ? "<" : "\\le"} x ${highStrict ? "<" : "\\le"} ${high}$。整数从 $${first}$ 到 $${last}$，共 ${answer} 个。`,
      ),
    });
  },
};

const anglesInRatio: KnowledgePointDef = {
  id: "triangle-angles-in-a-ratio",
  figure: gradeDrawings4["angles-of-a-triangle#triangle-angles-in-a-ratio"],
  title: t("Triangle angles in a ratio", "三角形的角成比例"),
  explanation: t(
    "When the angles of a triangle are in a given ratio, write them as multiples of one unknown. As the three angles add up to $180$ degrees, the sum of the ratio numbers tells how many equal parts make $180$. Divide to find one part, and multiply to get the angle that is asked for. The three angles should then add back up to $180$, and their sizes also show whether the triangle is acute, right or obtuse.",
    "当三角形的角成给定的比时，就把它们写成一个未知数的倍数。由于三个角加起来是 $180$ 度，比中各数的和说明 $180$ 度被分成多少等份。做除法得到一份，再相乘得到所求的角。三个角加起来应该还是 $180$，它们的大小也能说明三角形是锐角、直角还是钝角三角形。",
  ),
  generate(rng) {
    const [a, b, c] = rng.pick([
      [1, 2, 3],
      [2, 3, 4],
      [1, 1, 2],
      [1, 2, 2],
      [2, 3, 5],
      [1, 3, 5],
      [3, 4, 5],
      [1, 4, 5],
      [2, 7, 9],
      [4, 5, 6],
      [2, 2, 5],
      [1, 5, 6],
      [3, 5, 10],
      [5, 6, 7],
      [1, 3, 8],
      [5, 7, 8],
    ]) as [number, number, number];
    const parts = a + b + c;
    const unit = 180 / parts;
    const which = rng.pick(["smallest", "largest"]);
    const answer = which === "smallest" ? a * unit : c * unit;
    return numberProblem({
      prompt: t(
        `The angles of a triangle are in the ratio $${a}:${b}:${c}$. What is the ${which} angle, in degrees?`,
        `三角形三个角的比是 $${a}:${b}:${c}$。${which === "smallest" ? "最小" : "最大"}的角是多少度？`,
      ),
      answer,
      form: "integer",
      wrong: [
        which === "smallest" ? c * unit : a * unit,
        unit,
        Math.round((180 * c) / (a + b)),
        which === "smallest" ? a : c,
        answer + unit,
      ],
      solution: t(
        `The parts add up to $${parts}$, so one part is $180^\\circ \\div ${parts} = ${unit}^\\circ$. The ${which} angle is $${which === "smallest" ? a : c} \\times ${unit}^\\circ = ${answer}^\\circ$.`,
        `各份之和是 $${parts}$，所以一份是 $180^\\circ \\div ${parts} = ${unit}^\\circ$。${which === "smallest" ? "最小" : "最大"}的角是 $${which === "smallest" ? a : c} \\times ${unit}^\\circ = ${answer}^\\circ$。`,
      ),
    });
  },
};

const bisectorsOfNeighbors: KnowledgePointDef = {
  id: "the-angle-between-two-bisectors",
  figure: gradeDrawings4["angle-bisectors#the-angle-between-two-bisectors"],
  title: t("The angle between two bisectors", "两条角平分线的夹角"),
  explanation: t(
    "When two angles share a side and each is bisected, the angle between the two bisectors is made of one half from each angle. So it is half of the two angles together, and the separate sizes do not matter. If the two angles form a straight line, the bisectors are always at a right angle, which is a neat result. The same reasoning works for any pair of adjacent angles, and a sketch with the halves marked makes it clear.",
    "两个角有公共边，分别作平分线时，两条平分线的夹角由两个角的各一半组成。所以它是两个角之和的一半，与各自的大小无关。如果两个角组成一条直线，两条平分线总是成直角，这是个很漂亮的结论。同样的推理适用于任何一对相邻的角，画一个标出一半的草图就很清楚。",
  ),
  generate(rng) {
    const a = 2 * rng.int(10, 60);
    const b = 2 * rng.int(10, 60);
    const answer = (a + b) / 2;
    return numberProblem({
      prompt: t(
        `Two adjacent angles measure $${a}^\\circ$ and $${b}^\\circ$, and each one is bisected. What is the angle between the two bisectors, in degrees?`,
        `两个相邻的角分别是 $${a}^\\circ$ 和 $${b}^\\circ$，各作一条角平分线。两条平分线的夹角是多少度？`,
      ),
      answer,
      form: "integer",
      wrong: [a + b, Math.abs(a - b) / 2, a / 2, b / 2, answer + 10],
      solution: t(
        `The angle is made of half of each one: $${a / 2}^\\circ + ${b / 2}^\\circ = ${answer}^\\circ$.`,
        `这个角由两个角的各一半组成：$${a / 2}^\\circ + ${b / 2}^\\circ = ${answer}^\\circ$。`,
      ),
    });
  },
};

const clockAtAnyTime: KnowledgePointDef = {
  id: "clock-angles-between-the-hours",
  figure: gradeDrawings4["solving-problems-with-angles#clock-angles-between-the-hours"],
  title: t("Clock angles between the hours", "非整点时的钟面夹角"),
  explanation: t(
    "On a clock, the minute hand turns $6$ degrees each minute, and the hour hand turns only half a degree each minute. So between the hours, the hour hand lies part of the way from one mark to the next, and forgetting this is the usual mistake. Measure both hands from $12$, subtract, and if the result is more than $180$ degrees, subtract it from $360$ to get the smaller of the two angles.",
    "钟面上，分针每分钟转 $6$ 度，时针每分钟只转半度。所以在两个整点之间，时针位于两个刻度之间的某处，忘记这一点是常见的差错。从 $12$ 开始分别量两针的角度，相减，如果结果大于 $180$ 度，就用 $360$ 减去它，得到两个角中较小的一个。",
  ),
  generate(rng) {
    const hour = rng.int(1, 12);
    const minute = 10 * rng.int(1, 5);
    const hourAngle = (hour % 12) * 30 + minute / 2;
    const minuteAngle = minute * 6;
    const gap = Math.abs(hourAngle - minuteAngle);
    const answer = Math.min(gap, 360 - gap);
    return numberProblem({
      prompt: t(
        `What is the smaller angle between the hands of a clock at $${hour}:${minute}$, in degrees?`,
        `$${hour}:${minute}$ 时，钟面上两针所成的较小的角是多少度？`,
      ),
      answer,
      form: "integer",
      wrong: [
        Math.min(Math.abs((hour % 12) * 30 - minuteAngle), 360 - Math.abs((hour % 12) * 30 - minuteAngle)),
        360 - answer,
        answer + 5,
        answer + 30,
        minuteAngle,
      ],
      solution: t(
        `From 12, the minute hand is at $${minute} \\times 6^\\circ = ${minuteAngle}^\\circ$, and the hour hand is at $${hourAngle}^\\circ$. They differ by $${gap}^\\circ$${gap > 180 ? `, and the smaller angle is $360^\\circ - ${gap}^\\circ = ${answer}^\\circ$` : ""}.`,
        `从 12 算起，分针在 $${minute} \\times 6^\\circ = ${minuteAngle}^\\circ$，时针在 $${hourAngle}^\\circ$。两者相差 $${gap}^\\circ$${gap > 180 ? `，较小的角是 $360^\\circ - ${gap}^\\circ = ${answer}^\\circ$` : ""}。`,
      ),
    });
  },
};

const midpointsOfParts: KnowledgePointDef = {
  id: "the-gap-between-two-midpoints",
  title: t("The gap between two midpoints", "两个中点之间的距离"),
  explanation: t(
    "Let a segment be split into two parts by a point, and mark the midpoint of each part. The distance between those midpoints is made of half of one part and half of the other. So it equals half of the whole segment, however the point divides it. The segment addition postulate gives this directly, and a labeled sketch with each half marked shows it clearly. No separate lengths are needed to find the result.",
    "一个点把线段分成两部分，再标出每部分的中点。这两个中点之间的距离，由一部分的一半和另一部分的一半组成。所以不管这个点怎样分，它都等于整条线段的一半。线段相加公理直接给出这个结果，画一个标出各半段的草图就看得很清楚。不需要各段的长度就能求出结果。",
  ),
  generate(rng) {
    const whole = 2 * rng.int(6, 60);
    const part = rng.int(2, whole - 2);
    const answer = whole / 2;
    return numberProblem({
      prompt: t(
        `Point $B$ lies on segment $AC$, with $AB = ${part}$ and $AC = ${whole}$. Point $M$ is the midpoint of $AB$, and $N$ is the midpoint of $BC$. What is $MN$?`,
        `点 $B$ 在线段 $AC$ 上，$AB = ${part}$，$AC = ${whole}$。点 $M$ 是 $AB$ 的中点，$N$ 是 $BC$ 的中点。$MN$ 是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [whole, Math.round(part / 2), whole - part, Math.round(Math.abs(whole - 2 * part) / 2), answer + 1],
      solution: t(
        `We have $MB = ${part / 2}$ and $BN = ${(whole - part) / 2}$. So $MN$ is half of $AB$ plus half of $BC$, which is half of $AC$: $${answer}$.`,
        `$MB = ${part / 2}$，$BN = ${(whole - part) / 2}$。所以 $MN$ 是 $AB$ 的一半加 $BC$ 的一半，也就是 $AC$ 的一半：$${answer}$。`,
      ),
    });
  },
};

const areaWithPercentSides: KnowledgePointDef = {
  id: "the-area-after-percent-changes-to-the-sides",
  figure: gradeDrawings4["area-of-rectangles-and-squares#the-area-after-percent-changes-to-the-sides"],
  title: t("The area after percent changes to the sides", "边按百分比变化后的面积"),
  explanation: t(
    "Area is a product of two lengths, and so changes in the sides combine by multiplying and not by adding. Raising the length by one percent and lowering the width by another does not change the area by the difference of the two. Write each change as a multiplier, multiply the two, and read the overall change. Choosing a simple rectangle, such as one with sides of $100$ and $100$, is a good way to confirm the answer.",
    "面积是两个长度的积，所以边的变化是相乘，不是相加。把长增加一个百分数、宽减少另一个百分数，面积的变化并不等于这两个百分数的差。把每个变化写成乘数，相乘，再读出总的变化。选一个简单的长方形，比如边长都是 $100$，可以用来确认答案。",
  ),
  generate(rng) {
    const up = 10 * rng.int(1, 6);
    const down = 10 * rng.int(1, 5);
    const factor = (100 + up) * (100 - down);
    const area = 100 * rng.int(2, 40);
    const answer = (area * factor) / 10000;
    return numberProblem({
      prompt: t(
        `A rectangle has an area of $${area}$ square centimeters. Its length is increased by $${up}\\%$ and its width is decreased by $${down}\\%$. What is the new area, in square centimeters?`,
        `一个长方形的面积是 $${area}$ 平方厘米。长增加 $${up}\\%$，宽减少 $${down}\\%$。新的面积是多少平方厘米？`,
      ),
      answer,
      wrong: [(area * (100 + up - down)) / 100, area, (area * (100 + up)) / 100, (area * (100 - down)) / 100, answer + 10],
      solution: t(
        `The area is multiplied by $${(100 + up) / 100} \\times ${(100 - down) / 100} = ${factor / 10000}$. So the new area is $${area} \\times ${factor / 10000} = ${answer}$.`,
        `面积乘以 $${(100 + up) / 100} \\times ${(100 - down) / 100} = ${factor / 10000}$。所以新的面积是 $${area} \\times ${factor / 10000} = ${answer}$。`,
      ),
    });
  },
};

const cubesInARow: KnowledgePointDef = {
  id: "the-surface-of-cubes-in-a-row",
  title: t("The surface of cubes in a row", "排成一行的立方体的表面积"),
  explanation: t(
    "When solids are glued together, the faces that touch are no longer on the outside. Each join removes two faces, one from each solid. So the surface area of a row of cubes is less than the sum of the separate surfaces. Count the faces that remain: 4 faces along the row for each cube, plus 2 faces at the ends. Multiply this count by the area of one face to get the total surface area.",
    "几个立体粘在一起时，相接触的面就不在外面了。每个接合处减少两个面，每个立体各一个。所以一排立方体的表面积小于各自表面积的和。数一数剩下的面：每个立方体沿着这排有 4 个面，两端再加 2 个面。用这个数乘以一个面的面积，就得到总表面积。",
  ),
  generate(rng) {
    const n = rng.int(2, 15);
    const s = rng.int(1, 9);
    const faces = 4 * n + 2;
    const answer = faces * s * s;
    return numberProblem({
      prompt: t(
        `${n} cubes with edges of ${s} cm are glued face to face in a straight row. What is the surface area of the solid, in square centimeters?`,
        `${n} 个棱长 ${s} 厘米的立方体面对面粘成一排。这个立体的表面积是多少平方厘米？`,
      ),
      answer,
      form: "integer",
      wrong: [6 * n * s * s, (6 * n - 2) * s * s, n * s * s * s, 4 * n * s * s, answer + s * s],
      solution: t(
        `${n} cubes have ${6 * n} faces, and the ${n - 1} ${n === 2 ? "join removes" : "joins remove"} ${2 * (n - 1)} of them, which leaves ${faces}. Each face is ${s * s} square cm, so the total is ${answer}.`,
        `${n} 个立方体有 ${6 * n} 个面，${n - 1} 个接合处减少 ${2 * (n - 1)} 个面，剩下 ${faces} 个。每个面 ${s * s} 平方厘米，总共 ${answer}。`,
      ),
    });
  },
};

const combinedMean: KnowledgePointDef = {
  id: "the-mean-of-two-groups-together",
  title: t("The mean of two groups together", "两组合并后的平均数"),
  explanation: t(
    "To combine two groups, the two means cannot simply be averaged, unless the groups have equal size. A mean times its count gives the total for that group. Add the two totals, and then divide by the total number of members. The combined mean always lies between the two group means and closer to that of the larger group. This also shows why a small group with an extreme mean does not move the overall mean very much.",
    "合并两组时，除非两组人数相同，否则不能简单地对两个平均数求平均。平均数乘以个数得到这组的总和。把两个总和相加，再除以总人数。合并后的平均数总在两组平均数之间，并且更接近人数较多的一组。这也说明了为什么平均数极端的小组不会使总平均数变动太多。",
  ),
  generate(rng) {
    const a = rng.int(5, 30);
    const b = rng.int(5, 30);
    const meanA = rng.int(50, 95);
    const meanB = rng.pick([...Array(46).keys()].map((i) => 50 + i).filter((v) => v !== meanA));
    const total = a * meanA + b * meanB;
    const answer = Q.of(total, a + b);
    return numberProblem({
      prompt: t(
        `A class of $${a}$ students has a mean score of $${meanA}$, and a class of $${b}$ students has a mean score of $${meanB}$. What is the mean score of all the students together? Give an exact value.`,
        `一个 $${a}$ 人的班平均分是 $${meanA}$，一个 $${b}$ 人的班平均分是 $${meanB}$。所有学生的平均分是多少？写出准确值。`,
      ),
      answer,
      wrong: [Q.of(meanA + meanB, 2), Q.of(total), Q.of(meanA + meanB), answer.add(Q.of(1)), Q.of(total, 2)],
      solution: t(
        `The totals are $${a} \\times ${meanA} = ${a * meanA}$ and $${b} \\times ${meanB} = ${b * meanB}$. Together, $${total} \\div ${a + b} = ${answer.toLatex()}$.`,
        `两个总和是 $${a} \\times ${meanA} = ${a * meanA}$ 和 $${b} \\times ${meanB} = ${b * meanB}$。合起来 $${total} \\div ${a + b} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const addToReachProbability: KnowledgePointDef = {
  id: "adding-items-to-reach-a-probability",
  title: t("Adding items to reach a probability", "加入物品以达到某个概率"),
  explanation: t(
    "A probability from a bag is the number of favorable items over the total, and adding favorable items changes both of these numbers. Write the new probability with an unknown in both the top and the bottom, set it equal to the target, and solve. A common slip is to leave the total as it was. The answer can be checked by forming the new fraction and simplifying it to see if the target appears.",
    "从袋子里摸的概率，是有利的物品数除以总数，加入有利的物品后，这两个数都会变。把新的概率写成分子分母都含未知数的形式，令它等于目标，再求解。常见的差错是总数没有变。把新的分数写出来再化简，看是否得到目标，就能检验答案。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 5],
      [2, 5],
      [4, 5],
      [1, 3],
      [5, 6],
    ]) as [number, number];
    const others = (q - p) * rng.int(2, 9);
    const finalRed = (others * p) / (q - p);
    const answer = rng.int(1, Math.max(1, finalRed - 1));
    const red = finalRed - answer;
    return numberProblem({
      prompt: t(
        `A bag has ${red} red ${red === 1 ? "ball" : "balls"} and ${others} blue balls. How many red balls must be added so that the probability of drawing a red ball is $\\frac{${p}}{${q}}$?`,
        `袋子里有 ${red} 个红球和 ${others} 个蓝球。要加入多少个红球，摸到红球的概率才是 $\\frac{${p}}{${q}}$？`,
      ),
      answer,
      form: "integer",
      wrong: [finalRed, Math.max(1, Math.round(((red + others) * p) / q - red)), answer + 1, answer + others, answer + 2, answer + 3],
      solution: t(
        `The blue balls stay at ${others}, and they must be $\\frac{${q - p}}{${q}}$ of the total. So the total is ${others + finalRed}, with ${finalRed} red balls, which means adding ${answer}.`,
        `蓝球还是 ${others} 个，它们必须占总数的 $\\frac{${q - p}}{${q}}$。所以总数是 ${others + finalRed}，红球 ${finalRed} 个，要加 ${answer} 个。`,
      ),
    });
  },
};

/** deeperGrade7Points maps topics of 7th Grade Math to further knowledge points. */
export const deeperGrade7Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "applying-percentages-in-succession": [upThenDownSame],
  "interpreting-percentage-change": [returningPercent],
  "finding-original-values-from-percentage-decreases": [originalFromTwoChanges],
  "working-with-unit-prices": [averagePrice],
  "solving-unit-rate-problems-using-ratios-of-fractions": [wholeJobTime],
  "additive-inverses-of-numbers": [sumOfIntegerRange],
  "exponents-with-rational-bases": [alternatingPowers],
  "solving-problems-using-the-four-operations-on-rational-numbers": [missingSignedValue],
  "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted": [whatMustBeAdded],
  "two-step-equations": [consecutiveIntegers],
  "equations-with-variables-on-both-sides": [agesEquation],
  "solving-linear-equations-using-cross-multiplication": [addToBothForRatio],
  "solving-systems-by-substitution": [ticketsSystem],
  "compound-inequalities": [compoundCount],
  "angles-of-a-triangle": [anglesInRatio],
  "angle-bisectors": [bisectorsOfNeighbors],
  "solving-problems-with-angles": [clockAtAnyTime],
  "the-segment-addition-postulate": [midpointsOfParts],
  "area-of-rectangles-and-squares": [areaWithPercentSides],
  "surface-areas-of-combined-rectangular-prisms": [cubesInARow],
  "comparing-means": [combinedMean],
  "the-likelihood-of-an-event": [addToReachProbability],
};
