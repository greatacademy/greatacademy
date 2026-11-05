// Further knowledge points for topics of 6th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade6Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { mixedLatex, numberProblem } from "../problems.ts";

/** gcd6 is the greatest common factor of two positive integers. */
const gcd6 = (a: number, b: number): number => (b === 0 ? a : gcd6(b, a % b));

const ratioAfterAdding: KnowledgePointDef = {
  id: "how-much-to-add-for-a-new-ratio",
  title: t("How much to add for a new ratio", "加多少才得到新的比"),
  explanation: t(
    "When only one quantity changes, the other quantity is fixed, and it sets the scale. First find how many groups the ratio has, using the quantity that stays the same. Then use the new ratio with that same number of groups to find what the changing quantity must become. The amount to add is the difference. Adding the same amount to both quantities would not keep or reach a ratio in general, so that shortcut is wrong.",
    "当只有一个量变化时，另一个量不变，它决定了比例尺。先用不变的量算出比中有多少组。再用新的比和同样的组数，算出变化的量应该变成多少。要加的量就是两者的差。一般来说，给两个量加同样多并不能保持或得到某个比，所以那种捷径是错的。",
  ),
  generate(rng) {
    const p = rng.int(2, 7);
    const q = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => gcd6(v, p) === 1));
    const r = rng.pick([...Array(8).keys()].map((i) => q + 1 + i).filter((v) => gcd6(v, p) === 1));
    const k = rng.int(2, 12);
    const answer = (r - q) * k;
    return numberProblem({
      prompt: t(
        `A bag has $${p * k}$ red beads and $${q * k}$ blue beads. How many blue beads must be added so that the ratio of red to blue becomes $${p}:${r}$?`,
        `袋子里有 $${p * k}$ 颗红珠子和 $${q * k}$ 颗蓝珠子。要加多少颗蓝珠子，才能使红珠子与蓝珠子的比变成 $${p}:${r}$？`,
      ),
      answer,
      form: "integer",
      wrong: [r - q, r * k, r, answer + k, p * k - q * k, answer + 2, answer + 1],
      solution: t(
        `The red beads stay at $${p * k}$, which is $${k}$ groups of $${p}$. So the blue beads must become $${r} \\times ${k} = ${r * k}$, which means adding $${r * k} - ${q * k} = ${answer}$.`,
        `红珠子还是 $${p * k}$ 颗，也就是 $${k}$ 组 $${p}$。所以蓝珠子要变成 $${r} \\times ${k} = ${r * k}$ 颗，要加 $${r * k} - ${q * k} = ${answer}$ 颗。`,
      ),
    });
  },
};

const closingSpeeds: KnowledgePointDef = {
  id: "how-long-until-two-movers-meet",
  title: t("How long until two movers meet", "两个运动者多久相遇"),
  explanation: t(
    "When two objects move towards each other, the gap between them shrinks by both speeds together, so the rate that matters is the sum of the speeds. When one chases the other in the same direction, the gap shrinks only by the difference of the speeds. In each case, divide the starting gap by this rate of closing to get the time. The speeds themselves do not need to be applied separately.",
    "两个物体相向而行时，它们之间的距离按两个速度之和缩小，所以起作用的是速度之和。一个在同一方向追另一个时，距离只按速度之差缩小。无论哪种情况，都用起始距离除以这个缩小的速率，就得到时间。不需要分别计算两个速度。",
  ),
  generate(rng) {
    const fast = rng.int(40, 90);
    const slow = rng.int(10, fast - 5);
    const hours = rng.int(2, 9);
    const towards = rng.bool();
    const rate = towards ? fast + slow : fast - slow;
    const gap = rate * hours;
    return numberProblem({
      prompt: t(
        towards
          ? `Two cars start ${gap} km apart and drive towards each other at ${fast} km/h and ${slow} km/h. After how many hours do they meet?`
          : `A car driving at ${slow} km/h is ${gap} km ahead of a car driving at ${fast} km/h in the same direction. After how many hours does the faster car catch up?`,
        towards
          ? `两辆车相距 ${gap} 千米，分别以每小时 ${fast} 千米和 ${slow} 千米相向而行。多少小时后相遇？`
          : `一辆时速 ${slow} 千米的车在一辆时速 ${fast} 千米的车前方 ${gap} 千米，同向行驶。多少小时后快车追上慢车？`,
      ),
      answer: hours,
      form: "integer",
      wrong: [
        hours + 1,
        hours * 2,
        towards ? Math.round(gap / Math.max(fast - slow, 1)) : Math.round(gap / (fast + slow)),
        Math.round(gap / fast),
        Math.round(gap / slow),
      ],
      solution: t(
        `The gap closes at $${towards ? `${fast} + ${slow}` : `${fast} - ${slow}`} = ${rate}$ km/h, so the time is $${gap} \\div ${rate} = ${hours}$ hours.`,
        `距离以每小时 $${towards ? `${fast} + ${slow}` : `${fast} - ${slow}`} = ${rate}$ 千米缩小，所以时间是 $${gap} \\div ${rate} = ${hours}$ 小时。`,
      ),
    });
  },
};

const givingToEqualize: KnowledgePointDef = {
  id: "giving-away-to-make-two-amounts-equal",
  title: t("Giving away to make two amounts equal", "给出多少使两个量相等"),
  explanation: t(
    "A tape diagram shows why moving an amount from one person to another changes the gap by twice as much. The giver loses that amount, and the receiver gains it. So to make two amounts equal, only half of the difference needs to be moved. First use the total and the ratio to find both amounts, and then halve their difference. Moving the whole difference would simply swap the two amounts around.",
    "线段图能说明，为什么从一个人转给另一个人一个量，差距的变化是这个量的两倍。给出的人少了这个量，收到的人多了这个量。所以要使两个量相等，只需转移差的一半。先用总数和比算出两个量，再把它们的差减半。转移整个差，只会把两个量对调。",
  ),
  generate(rng) {
    const q = rng.int(1, 6);
    const p = rng.pick([1, 2, 3, 4, 5].map((i) => q + i).filter((v) => gcd6(v, q) === 1));
    const unit = 2 * rng.int(2, 12);
    const total = (p + q) * unit;
    const answer = ((p - q) * unit) / 2;
    return numberProblem({
      prompt: t(
        `Sam and Kim have ${total} marbles in all, in the ratio ${p}:${q}. How many marbles must Sam give to Kim so that they have the same number?`,
        `萨姆和基姆一共有 ${total} 颗弹珠，比是 ${p}:${q}。萨姆要给基姆多少颗，两人才一样多？`,
      ),
      answer,
      form: "integer",
      wrong: [(p - q) * unit, total / 2, p * unit, q * unit, p - q],
      solution: t(
        `One part is $${total} \\div ${p + q} = ${unit}$, so they have ${p * unit} and ${q * unit}. The difference is ${(p - q) * unit}, and half of it is ${answer}.`,
        `一份是 $${total} \\div ${p + q} = ${unit}$，所以两人有 ${p * unit} 和 ${q * unit} 颗。差是 ${(p - q) * unit}，它的一半是 ${answer}。`,
      ),
    });
  },
};

const totalFromTheRest: KnowledgePointDef = {
  id: "the-total-from-the-rest-of-a-group",
  title: t("The total from the rest of a group", "由其余部分求总数"),
  explanation: t(
    "Percents of a group add up to $100$. If a problem gives a percent for one part but a count for the other part, the given percent and the given count do not match. So first subtract from $100$ to find what percent the count stands for. Then find the total from that part and its percent. Using the given percent with the given count is the mistake this problem is designed to bring to light.",
    "一个群体的各部分百分比加起来是 $100$。如果题目给了一部分的百分比，却给了另一部分的数量，那么这个百分比和这个数量并不对应。所以先用 $100$ 减，求出这个数量对应的百分比。再由这部分和它的百分比求总数。把给出的百分比和给出的数量配在一起，正是这类题要暴露的错误。",
  ),
  generate(rng) {
    const pct = rng.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90]);
    const total = 20 * rng.int(2, 40);
    const rest = (total * (100 - pct)) / 100;
    return numberProblem({
      prompt: t(
        `In a school, $${pct}\\%$ of the students walk to school. The other $${rest}$ students ride. How many students are in the school?`,
        `一所学校有 $${pct}\\%$ 的学生步行上学，其余 $${rest}$ 名学生乘车。这所学校有多少名学生？`,
      ),
      answer: total,
      form: "integer",
      wrong: [total + rest, Math.round((rest * pct) / 100), rest + pct, Math.round((rest * 100) / pct), total - 20],
      solution: t(
        `The $${rest}$ students are $100\\% - ${pct}\\% = ${100 - pct}\\%$ of the school. So the total is $${rest} \\div ${(100 - pct) / 100} = ${total}$.`,
        `这 $${rest}$ 名学生占全校的 $100\\% - ${pct}\\% = ${100 - pct}\\%$。所以总数是 $${rest} \\div ${(100 - pct) / 100} = ${total}$。`,
      ),
    });
  },
};

const swappingPercent: KnowledgePointDef = {
  id: "swapping-a-percent-and-its-number",
  title: t("Swapping a percent and its number", "交换百分数和它的数"),
  explanation: t(
    "A percent is a multiplication by a number over $100$, and multiplication can be done in either order. So $a\\%$ of $b$ always equals $b\\%$ of $a$, as each is $a \\times b \\div 100$. This turns some awkward problems into easy ones. For instance, $36\\%$ of $25$ is the same as $25\\%$ of $36$, and a quarter of $36$ can be found at once. Look for a friendly percent hidden in the number.",
    "百分数就是乘一个除以 $100$ 的数，而乘法可以交换顺序。所以 $a\\%$ 的 $b$ 总是等于 $b\\%$ 的 $a$，它们都是 $a \\times b \\div 100$。这能把一些难算的题变容易。例如，$25$ 的 $36\\%$ 等于 $36$ 的 $25\\%$，而 $36$ 的四分之一马上就能算出。要留意藏在数里的好算的百分数。",
  ),
  generate(rng) {
    const a = rng.int(2, 99);
    const answer = rng.pick([...Array(98).keys()].map((i) => i + 2).filter((v) => v !== a));
    return numberProblem({
      prompt: t(
        `Find the missing number: $${a}\\%$ of $${answer}$ equals $\\square\\%$ of $${a}$.`,
        `求缺失的数：$${answer}$ 的 $${a}\\%$ 等于 $${a}$ 的 $\\square\\%$。`,
      ),
      answer,
      form: "integer",
      wrong: [a, 100 - answer, a + answer, Math.abs(a - answer), answer + 1],
      solution: t(
        `Each side is $${a} \\times ${answer} \\div 100$, so the missing number is $${answer}$.`,
        `两边都是 $${a} \\times ${answer} \\div 100$，所以缺失的数是 $${answer}$。`,
      ),
    });
  },
};

const sumAcrossForms: KnowledgePointDef = {
  id: "adding-a-fraction-a-percent-and-a-decimal",
  title: t("Adding a fraction, a percent and a decimal", "分数、百分数和小数相加"),
  explanation: t(
    "A fraction, a percent and a decimal can name parts of the same whole, and so they can be added once they are in the same form. Percents are usually the easiest common form for simple fractions and decimals, because they avoid common denominators. Multiply a decimal by 100 to get a percent, and rewrite a fraction with a denominator of 100. Then the parts add as ordinary numbers, and they can be compared with 100%.",
    "分数、百分数和小数可以表示同一整体的部分，所以化成同一种形式后就能相加。对简单的分数和小数来说，百分数通常是最容易的共同形式，因为不用通分。把小数乘以 100 得到百分数，把分数改写成分母是 100 的分数。然后各部分像普通的数一样相加，还可以和 100% 比较。",
  ),
  generate(rng) {
    const [n, d] = rng.pick([
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [1, 2],
      [1, 10],
      [3, 10],
      [7, 10],
      [1, 20],
    ]) as [number, number];
    const fracPct = (n * 100) / d;
    const pct = 5 * rng.int(1, 12);
    const decTenths = rng.int(1, 9);
    const hundredths = rng.bool() ? 0 : rng.pick([2, 4, 5, 6, 8]);
    const decPct = decTenths * 10 + hundredths;
    const answer = fracPct + pct + decPct;
    const decText = `0.${decTenths}${hundredths === 0 ? "" : hundredths}`;
    return numberProblem({
      prompt: t(
        `Write $\\frac{${n}}{${d}} + ${pct}\\% + ${decText}$ as a percent.`,
        `把 $\\frac{${n}}{${d}} + ${pct}\\% + ${decText}$ 写成百分数。`,
      ),
      answer,
      form: "integer",
      percent: true,
      wrong: [n + d + pct, pct + decPct, fracPct + pct, answer + 10, fracPct + decPct, Math.round(pct + n / d + decPct / 100)],
      solution: t(
        `As percents, the parts are $${fracPct}\\%$, $${pct}\\%$ and $${decPct}\\%$, which add up to $${answer}\\%$.`,
        `写成百分数，各部分是 $${fracPct}\\%$、$${pct}\\%$ 和 $${decPct}\\%$，加起来是 $${answer}\\%$。`,
      ),
    });
  },
};

const perimeterFromFractionalArea: KnowledgePointDef = {
  id: "the-perimeter-from-a-fractional-area",
  title: t("The perimeter from a fractional area", "由分数面积求周长"),
  explanation: t(
    "A rectangle's area and one side give the other side by division, even when the numbers are fractions. Once both sides are known, the perimeter follows by adding and doubling. So this problem chains a division with an addition of unlike fractions. Keep the two results apart: the area is in square units and the perimeter is in plain units. A rough check with nearby whole numbers shows if the size of the answer is sensible.",
    "长方形的面积和一条边，用除法就能求出另一条边，分数也一样。两条边都知道后，相加再乘 2 就得到周长。所以这道题把除法和异分母加法连在一起。要分清两个结果：面积用平方单位，周长用普通单位。用相近的整数粗略检验，可以看出答案大小是否合理。",
  ),
  generate(rng) {
    const u = Q.of(rng.int(1, 5), rng.pick([2, 3, 4, 5]));
    const v = Q.of(rng.int(1, 7), rng.pick([2, 3, 4, 6]));
    const area = u.mul(v);
    const answer = u.add(v).mul(Q.of(2));
    return numberProblem({
      prompt: t(
        `A rectangle has an area of $${area.toLatex()}$ square meters, and one side measures $${u.toLatex()}$ m. What is its perimeter, in meters?`,
        `一个长方形的面积是 $${area.toLatex()}$ 平方米，一条边长 $${u.toLatex()}$ 米。它的周长是多少米？`,
      ),
      answer,
      wrong: [u.add(v), v, area.mul(Q.of(2)), answer.add(Q.of(1)), area.add(u).mul(Q.of(2))],
      solution: t(
        `The other side is $${area.toLatex()} \\div ${u.toLatex()} = ${v.toLatex()}$. The perimeter is $2 \\times (${u.toLatex()} + ${v.toLatex()}) = ${answer.toLatex()}$.`,
        `另一条边是 $${area.toLatex()} \\div ${u.toLatex()} = ${v.toLatex()}$。周长是 $2 \\times (${u.toLatex()} + ${v.toLatex()}) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const leftoverAfterFilling: KnowledgePointDef = {
  id: "what-is-left-after-filling-containers",
  title: t("What is left after filling containers", "装满容器后还剩多少"),
  explanation: t(
    "Dividing a mixed number by a mixed number may leave a part of a container that cannot be filled. The fractional part of the quotient does not directly give the amount left over. It is a fraction of one container. So find how many containers can be filled, multiply that count by the size of one container, and subtract from the total. This also gives an easy way to check the work at the end.",
    "带分数除以带分数，可能剩下一部分装不满一个容器。商的分数部分并不直接等于剩下的量，它是一个容器的几分之几。所以要先求能装满多少个容器，用这个数乘以一个容器的大小，再从总量中减去。最后这也是一种容易的检验办法。",
  ),
  generate(rng) {
    const d = rng.pick([2, 3, 4, 5, 6, 8]);
    const size = Q.of(d + rng.pick([...Array(d - 1).keys()].map((i) => i + 1).filter((v) => gcd6(v, d) === 1)), d);
    const count = rng.int(3, 9);
    const sizeNum = Number(size.n);
    const sizeDen = Number(size.d);
    const answer = Q.of(rng.int(1, sizeNum - 1), sizeDen);
    const total = size.mul(Q.of(count)).add(answer);
    return numberProblem({
      prompt: t(
        `A tank holds $${mixedLatex(total)}$ liters of juice. As many bottles as possible are filled, each holding $${mixedLatex(size)}$ liters. How many liters are left over?`,
        `一个罐子里有 $${mixedLatex(total)}$ 升果汁。尽量装满每瓶 $${mixedLatex(size)}$ 升的瓶子。还剩多少升？`,
      ),
      answer,
      wrong: [Q.of(count), size.sub(answer), answer.div(size), answer.add(Q.of(1)), total.sub(size)],
      solution: t(
        `The bottles fill ${count} times, since $${count} \\times ${mixedLatex(size)} = ${mixedLatex(size.mul(Q.of(count)))}$ fits but one more does not. The rest is $${mixedLatex(total)} - ${mixedLatex(size.mul(Q.of(count)))} = ${mixedLatex(answer)}$.`,
        `能装满 ${count} 瓶，因为 $${count} \\times ${mixedLatex(size)} = ${mixedLatex(size.mul(Q.of(count)))}$ 够装，再多一瓶就不够。剩下 $${mixedLatex(total)} - ${mixedLatex(size.mul(Q.of(count)))} = ${mixedLatex(answer)}$。`,
      ),
    });
  },
};

const numbersAtADistance: KnowledgePointDef = {
  id: "numbers-at-a-given-distance",
  title: t("Numbers at a given distance", "距离一定的数"),
  explanation: t(
    "Absolute value measures distance, and distance works from any starting number, not only from zero. On a number line, two numbers lie at a given distance from a starting point, one on each side. Moving right adds the distance, and moving left subtracts it. When the starting number is negative, these moves can cross zero or go further below it, so sketching a quick number line helps to keep the signs straight.",
    "绝对值度量距离，距离可以从任何起点算起，不只是从零。在数轴上，与一个起点距离一定的数有两个，两侧各一个。向右移动加上距离，向左移动减去距离。起点是负数时，这样的移动可能跨过零或走得更低，所以画一条简单的数轴有助于看清符号。",
  ),
  generate(rng) {
    const start = rng.pick([...Array(40).keys()].map((i) => i - 20).filter((v) => v !== 0));
    const distance = rng.int(2, 30);
    const larger = rng.bool();
    const answer = larger ? start + distance : start - distance;
    return numberProblem({
      prompt: t(
        `Two numbers are each ${distance} units from $${start}$ on the number line. What is the ${larger ? "larger" : "smaller"} of the two?`,
        `数轴上有两个数，它们与 $${start}$ 的距离都是 ${distance}。其中${larger ? "较大" : "较小"}的数是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [larger ? start - distance : start + distance, distance, -answer, distance - start, Math.abs(start) + distance + 1],
      solution: t(
        `${larger ? "Moving right" : "Moving left"} from $${start}$ by ${distance} gives $${start} ${larger ? "+" : "-"} ${distance} = ${answer}$.`,
        `从 $${start}$ ${larger ? "向右" : "向左"}移动 ${distance}，得 $${start} ${larger ? "+" : "-"} ${distance} = ${answer}$。`,
      ),
    });
  },
};

const halfwayPoint: KnowledgePointDef = {
  id: "the-number-halfway-between-two-rationals",
  title: t("The number halfway between two rationals", "两个有理数正中间的数"),
  explanation: t(
    "The number halfway between two numbers is their mean: add them and divide by 2. This is true even when one is negative, and the sum then partly cancels. Thinking of a number line shows why. Starting from the smaller number, go half of the distance towards the larger one. Both ways give the same result, and using one to check the other catches any slip with the signs or the fractions.",
    "两个数正中间的数就是它们的平均数：相加后除以 2。即使其中一个是负数也成立，这时和会部分抵消。想一想数轴就明白了：从较小的数出发，朝较大的数走距离的一半。两种办法结果相同，用一种检验另一种，能发现符号或分数上的差错。",
  ),
  generate(rng) {
    const d = rng.pick([2, 3, 4, 5, 6]);
    const low = Q.of(-rng.int(1, 12), d);
    const high = Q.of(rng.int(1, 12), d);
    const answer = low.add(high).div(Q.of(2));
    const gap = high.sub(low);
    return numberProblem({
      prompt: t(
        `What number is halfway between $${low.toLatex()}$ and $${high.toLatex()}$?`,
        `$${low.toLatex()}$ 和 $${high.toLatex()}$ 正中间的数是多少？`,
      ),
      answer,
      wrong: [gap.div(Q.of(2)), low.add(high), gap, answer.neg().add(Q.of(1)), high, answer.add(Q.of(1)), answer.sub(Q.of(1))],
      solution: t(
        `Add and divide by 2: $(${low.toLatex()} + ${high.toLatex()}) \\div 2 = ${answer.toLatex()}$.`,
        `相加后除以 2：$(${low.toLatex()} + ${high.toLatex()}) \\div 2 = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const distanceToReflection: KnowledgePointDef = {
  id: "the-distance-from-a-point-to-its-reflection",
  title: t("The distance from a point to its reflection", "点与它的对称点的距离"),
  explanation: t(
    "Reflecting a point in an axis keeps its distance from that axis and moves it to the other side. So the point and its image are twice as far apart as the point is from the axis. Reflecting across the $x$-axis changes the sign of the $y$-coordinate, and so the distance depends on $y$ alone. Reflecting across the $y$-axis depends on $x$ alone. Only the size of the coordinate matters here, not its sign.",
    "把一个点沿坐标轴对称，它到这条轴的距离不变，只是到了另一侧。所以点和它的像之间的距离，是点到轴的距离的两倍。沿 $x$ 轴对称改变 $y$ 坐标的符号，所以距离只取决于 $y$。沿 $y$ 轴对称只取决于 $x$。这里只有坐标的大小起作用，与符号无关。",
  ),
  generate(rng) {
    const nonzero = [...Array(30).keys()].map((i) => i - 15).filter((v) => v !== 0);
    const x = rng.pick(nonzero);
    const y = rng.pick(nonzero.filter((v) => Math.abs(v) !== Math.abs(x)));
    const overX = rng.bool();
    const answer = 2 * Math.abs(overX ? y : x);
    return numberProblem({
      prompt: t(
        `The point $(${x}, ${y})$ is reflected across the $${overX ? "x" : "y"}$-axis. How far is the point from its image?`,
        `点 $(${x}, ${y})$ 沿 $${overX ? "x" : "y"}$ 轴对称。这个点与它的像相距多远？`,
      ),
      answer,
      form: "integer",
      wrong: [2 * Math.abs(overX ? x : y), Math.abs(overX ? y : x), Math.abs(x) + Math.abs(y), 2 * (Math.abs(x) + Math.abs(y)), answer + 2],
      solution: t(
        `The image has the same $${overX ? "x" : "y"}$-coordinate, and the point is ${Math.abs(overX ? y : x)} from the axis. So the distance is $2 \\times ${Math.abs(overX ? y : x)} = ${answer}$.`,
        `像的 $${overX ? "x" : "y"}$ 坐标相同，点到轴的距离是 ${Math.abs(overX ? y : x)}。所以距离是 $2 \\times ${Math.abs(overX ? y : x)} = ${answer}$。`,
      ),
    });
  },
};

const cornerFromArea: KnowledgePointDef = {
  id: "a-missing-corner-from-the-area",
  title: t("A missing corner from the area", "由面积求缺失的顶点"),
  explanation: t(
    "Coordinates and area can work together in reverse. Two corners on a horizontal line give the width of a rectangle. Dividing the area by this width gives the height, and the height tells how far up the other corners lie. So the missing coordinate is the known coordinate plus the height. When the rectangle lies below that line, subtract instead. A small sketch shows at once which of the two cases applies.",
    "坐标和面积可以反过来一起用。水平线上的两个顶点给出长方形的宽。用面积除以宽得到高，高说明另外两个顶点在上方多远。所以缺失的坐标是已知坐标加上高。如果长方形在这条线下方，就要减去。画一个小草图，马上就能看出是哪种情况。",
  ),
  generate(rng) {
    const x = rng.int(-9, 5);
    const y = rng.int(-9, 9);
    const w = rng.int(2, 12);
    const h = rng.int(2, 12);
    const above = rng.bool();
    const answer = above ? y + h : y - h;
    return numberProblem({
      prompt: t(
        `A rectangle has corners at $(${x}, ${y})$ and $(${x + w}, ${y})$, and its area is ${w * h}. The other two corners lie ${above ? "above" : "below"} these. What is their $y$-coordinate?`,
        `一个长方形有顶点 $(${x}, ${y})$ 和 $(${x + w}, ${y})$，面积是 ${w * h}。另外两个顶点在它们${above ? "上方" : "下方"}。它们的 $y$ 坐标是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [above ? y - h : y + h, h, y + w * h, answer + 1, y + w, answer + 2],
      solution: t(
        `The two corners are ${w} apart, so the height is $${w * h} \\div ${w} = ${h}$. Moving ${above ? "up" : "down"} from $y = ${y}$ gives ${answer < 0 ? `$${answer}$` : answer}.`,
        `这两个顶点相距 ${w}，所以高是 $${w * h} \\div ${w} = ${h}$。从 $y = ${y}$ 向${above ? "上" : "下"}移动，得 ${answer < 0 ? `$${answer}$` : answer}。`,
      ),
    });
  },
};

const firstPowerAbove: KnowledgePointDef = {
  id: "the-first-power-above-a-number",
  title: t("The first power above a number", "第一个超过某数的幂"),
  explanation: t(
    "Powers of a whole number greater than 1 grow quickly, and each one is the previous one times the base. To find the first power beyond a given number, list the powers in order until one passes it. Exponents and values are easy to mix up here: the question asks for the exponent, not the value of the power. The answer is usually small, even for a large target, because of how fast powers grow.",
    "大于 1 的整数的幂增长很快，每一个都是前一个乘以底数。要找第一个超过给定数的幂，就按顺序列出各个幂，直到超过为止。这里容易把指数和值弄混：问题问的是指数，不是幂的值。由于幂增长得很快，即使目标很大，答案通常也很小。",
  ),
  generate(rng) {
    const base = rng.pick([2, 3, 4, 5, 6, 7]);
    const k = rng.int(2, base === 2 ? 12 : base === 3 ? 8 : 5);
    const low = base ** k;
    const high = base ** (k + 1);
    const n = rng.int(low, high - 1);
    const answer = k + 1;
    return numberProblem({
      prompt: t(`What is the smallest whole number $n$ for which $${base}^n > ${n}$?`, `使 $${base}^n > ${n}$ 成立的最小整数 $n$ 是多少？`),
      answer,
      form: "integer",
      wrong: [k, k + 2, high, Math.floor(n / base), k + 3],
      solution: t(
        `We have $${base}^{${k}} = ${low}$, which is not greater than ${n}, and $${base}^{${k + 1}} = ${high}$, which is. So $n = ${answer}$.`,
        `$${base}^{${k}} = ${low}$ 不大于 ${n}，而 $${base}^{${k + 1}} = ${high}$ 大于它。所以 $n = ${answer}$。`,
      ),
    });
  },
};

const fractionalBaseExponent: KnowledgePointDef = {
  id: "the-missing-exponent-of-a-fraction",
  title: t("The missing exponent of a fraction", "分数底数缺失的指数"),
  explanation: t(
    "A power of a fraction raises the numerator and the denominator separately. So when the value is known, an unknown exponent can be found from the top or the bottom on its own, by counting how many factors make it. Both must give the same count, so the second is a check on the first. When the fraction is less than 1, higher exponents give smaller values, which is the opposite of what happens for whole numbers.",
    "分数的幂是把分子和分母分别乘方。所以知道值后，只看分子或只看分母，数一数由多少个因数组成，就能求出未知的指数。两者必须得到相同的个数，所以第二个可以检验第一个。分数小于 1 时，指数越大值越小，这与整数的情况相反。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 2],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [5, 2],
      [4, 3],
    ]) as [number, number];
    const answer = rng.int(2, 6);
    const top = p ** answer;
    const bottom = q ** answer;
    return numberProblem({
      prompt: t(
        `Find the missing exponent: $$\\left(\\frac{${p}}{${q}}\\right)^{\\square} = \\frac{${top}}{${bottom}}$$`,
        `求缺失的指数：$$\\left(\\frac{${p}}{${q}}\\right)^{\\square} = \\frac{${top}}{${bottom}}$$`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, answer * 2, answer + 2, Math.floor(bottom / q), answer + 3],
      solution: t(
        `Multiplying ${q} by itself to reach ${bottom} takes ${answer} factors, so the exponent is ${answer}.`,
        `${q} 连乘到 ${bottom} 要用 ${answer} 个因数，所以指数是 ${answer}。`,
      ),
    });
  },
};

const changeInLinearExpression: KnowledgePointDef = {
  id: "how-much-an-expression-grows",
  title: t("How much an expression grows", "算式增加多少"),
  explanation: t(
    "A linear expression is easy to reason about without working out its value twice. The constant term stays the same whatever the variable does, so it never contributes to a change. Each step up in the variable adds the coefficient. So if the variable goes up by some amount, the expression goes up by the coefficient times that amount. The starting value of the variable does not matter at all, which often surprises people.",
    "线性算式不用算两次值就能分析。不管变量怎样变化，常数项都不变，所以它对变化没有贡献。变量每增加 $1$，算式就增加一个系数。所以变量增加多少，算式就增加系数乘以这个量。变量的起始值完全不起作用，这一点常常出人意料。",
  ),
  generate(rng) {
    const a = rng.int(2, 15);
    const b = rng.int(1, 40);
    const change = rng.int(2, 20);
    const answer = a * change;
    return numberProblem({
      prompt: t(
        `The value of $x$ goes up by $${change}$. By how much does $${a}x + ${b}$ go up?`,
        `$x$ 的值增加了 $${change}$。$${a}x + ${b}$ 增加了多少？`,
      ),
      answer,
      form: "integer",
      wrong: [a + change, answer + b, change, a * change + a, a + b + change],
      solution: t(
        `The $${b}$ does not change, and each $1$ added to $x$ adds $${a}$. So the change is $${a} \\times ${change} = ${answer}$.`,
        `$${b}$ 不变，$x$ 每增加 $1$ 就增加 $${a}$。所以变化是 $${a} \\times ${change} = ${answer}$。`,
      ),
    });
  },
};

const perimeterExpression: KnowledgePointDef = {
  id: "a-perimeter-as-an-expression",
  title: t("A perimeter as an expression", "用算式表示周长"),
  explanation: t(
    "When the sides of a rectangle are written with a variable, the perimeter is an expression too. Add the length and the width, and then double the result, or else add all four sides. Either way, gather the terms with the variable and gather the constants. Forgetting to double only part of the sum is a common slip. Trying a small value of the variable checks that the simplified form is right.",
    "长方形的边用变量表示时，周长也是一个算式。把长和宽相加再乘 2，或者把四条边都加起来。无论哪种方法，都要合并含变量的项，合并常数项。只把和的一部分乘 2 是常见的差错。代入一个小的值，可以检验化简后的形式是否正确。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(1, 15);
    const c = rng.int(2, 9);
    const d = rng.int(1, 15);
    const coefficient = rng.bool();
    const answer = 2 * (coefficient ? a + c : b + d);
    return numberProblem({
      prompt: t(
        `A rectangle has a length of $${a}x + ${b}$ and a width of $${c}x + ${d}$. Write its perimeter in simplest form. What is the ${coefficient ? "coefficient of $x$" : "constant term"}?`,
        `一个长方形的长是 $${a}x + ${b}$，宽是 $${c}x + ${d}$。把它的周长写成最简形式。${coefficient ? "$x$ 的系数" : "常数项"}是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [
        answer / 2,
        coefficient ? 2 * (b + d) : 2 * (a + c),
        coefficient ? 2 * a + c : 2 * b + d,
        answer + 2,
        coefficient ? a + 2 * c : b + 2 * d,
      ],
      solution: t(
        `The perimeter is $2((${a} + ${c})x + ${b} + ${d}) = ${2 * (a + c)}x + ${2 * (b + d)}$. So the ${coefficient ? "coefficient" : "constant"} is ${answer}.`,
        `周长是 $2((${a} + ${c})x + ${b} + ${d}) = ${2 * (a + c)}x + ${2 * (b + d)}$。所以${coefficient ? "系数" : "常数项"}是 ${answer}。`,
      ),
    });
  },
};

const anotherMultiple: KnowledgePointDef = {
  id: "another-multiple-of-the-unknown",
  title: t("Another multiple of the unknown", "未知数的另一个倍数"),
  explanation: t(
    "Sometimes an equation asks for a multiple of the unknown instead of the unknown itself. The value can be found by solving and substituting, but it can often be read off more directly. Both sides of the equation can be multiplied or divided by the same number, and so the wanted multiple appears without finding $x$ first. Both routes must agree, and looking for the direct one is a good habit in algebra.",
    "有时方程求的不是未知数本身，而是它的某个倍数。可以解方程再代入，但往往能更直接地求出来。方程两边可以乘或除以同一个数，所以不用先求 $x$，所要的倍数就出现了。两条路结果必须一致，寻找直接的路是学代数的好习惯。",
  ),
  generate(rng) {
    const x = rng.int(2, 30);
    const half = rng.int(2, 9);
    const k = 2 * half;
    const asksHalf = rng.bool();
    const wanted = asksHalf ? half : k * rng.int(2, 3);
    const answer = wanted * x;
    return numberProblem({
      prompt: t(`Given that $${k}x = ${k * x}$, find the value of $${wanted}x$.`, `已知 $${k}x = ${k * x}$，求 $${wanted}x$ 的值。`),
      answer,
      form: "integer",
      wrong: [x, k * x, k * x + wanted, wanted, answer + x],
      solution: t(
        `Since $x = ${k * x} \\div ${k} = ${x}$, we get $${wanted}x = ${wanted} \\times ${x} = ${answer}$.`,
        `由 $x = ${k * x} \\div ${k} = ${x}$，得 $${wanted}x = ${wanted} \\times ${x} = ${answer}$。`,
      ),
    });
  },
};

const countingInequalitySolutions: KnowledgePointDef = {
  id: "counting-positive-whole-solutions",
  title: t("Counting whole-number solutions", "数整数解的个数"),
  explanation: t(
    "An inequality has many solutions, and in a real setting only whole numbers may make sense. Divide to find the boundary. If the boundary is not a whole number, the solutions stop at the last whole number below it. If it is a whole number, the sign decides whether it counts: less than leaves it out, and at most keeps it in. Counting from 1 up to the last solution then gives the total.",
    "不等式有很多解，在实际情境中可能只有整数才有意义。做除法求出边界。如果边界不是整数，解就到它下面最后一个整数为止。如果是整数，由符号决定算不算：小于不包括它，不超过包括它。从 1 数到最后一个解，就得到总数。",
  ),
  generate(rng) {
    const k = rng.int(2, 12);
    const quotient = rng.int(3, 40);
    const exact = rng.bool();
    const m = exact ? k * quotient : k * quotient + rng.int(1, k - 1);
    const strict = rng.bool();
    const answer = exact && strict ? quotient - 1 : quotient;
    return numberProblem({
      prompt: t(
        `How many positive whole numbers $x$ satisfy $${k}x ${strict ? "<" : "\\le"} ${m}$?`,
        `有多少个正整数 $x$ 满足 $${k}x ${strict ? "<" : "\\le"} ${m}$？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer - 1, m, m - k, answer + 2],
      solution: t(
        `Dividing by ${k} gives $x ${strict ? "<" : "\\le"} ${Q.of(m, k).toLatex()}$. The largest whole number that works is ${answer}, so there are ${answer} solutions.`,
        `除以 ${k}，得 $x ${strict ? "<" : "\\le"} ${Q.of(m, k).toLatex()}$。满足条件的最大整数是 ${answer}，所以有 ${answer} 个解。`,
      ),
    });
  },
};

const mostWithBudget: KnowledgePointDef = {
  id: "the-most-that-a-budget-allows",
  title: t("The most that a budget allows", "预算最多允许多少"),
  explanation: t(
    "A budget gives an inequality: the fixed fee plus the cost of the items must not pass the limit. Take the fee away first, because it must be paid however many items there are. Then divide what is left by the price of one item. As only whole items can be bought, round the quotient down, even when it is just below the next whole number. Rounding up would go over the budget, which is not allowed.",
    "预算给出一个不等式：固定费用加上物品的费用不能超过限额。先减去固定费用，因为不管买多少都要付。再用剩下的钱除以单价。由于只能买整数个，商要向下取整，即使它只差一点就到下一个整数。向上取整就超出预算了，这是不允许的。",
  ),
  generate(rng) {
    const fee = rng.int(3, 25);
    const price = rng.int(3, 14);
    const count = rng.int(4, 30);
    const budget = fee + price * count + rng.int(1, price - 1);
    return numberProblem({
      prompt: t(
        `A park charges a ${fee}-dollar entry fee plus ${price} dollars for each ride. Lee has ${budget} dollars. What is the greatest number of rides Lee can take?`,
        `一个公园收 ${fee} 美元门票，每玩一个项目再收 ${price} 美元。李有 ${budget} 美元。李最多能玩多少个项目？`,
      ),
      answer: count,
      form: "integer",
      wrong: [count + 1, Math.floor(budget / price), Math.floor((budget + fee) / price), count - 1, budget - fee],
      solution: t(
        `After the entry fee, Lee has $${budget} - ${fee} = ${budget - fee}$ dollars. Then $${budget - fee} \\div ${price}$ is ${count} with some left over, so the greatest number is ${count}.`,
        `付完门票，李还有 $${budget} - ${fee} = ${budget - fee}$ 美元。$${budget - fee} \\div ${price}$ 商 ${count} 还有余，所以最多是 ${count} 个。`,
      ),
    });
  },
};

const secondHeight: KnowledgePointDef = {
  id: "the-second-height-of-a-parallelogram",
  title: t("The second height of a parallelogram", "平行四边形的另一条高"),
  explanation: t(
    "A parallelogram has two pairs of sides, and each pair has its own height. The area is the same whichever pair is used, so one base and height can be used to find the other height. Each height goes with the side it is perpendicular to. Pairing a side with the wrong height is the usual mistake. A height can never be longer than the neighboring side, and that gives a quick way to check.",
    "平行四边形有两组边，每组有自己的高。无论用哪一组，面积都相同，所以可以用一组底和高求出另一条高。每条高对应与它垂直的那条边。把边和错误的高配对是常见的差错。高绝不会比相邻的边长，这可以用来快速检验。",
  ),
  generate(rng) {
    const x = rng.int(3, 9);
    const w = rng.int(2, x - 1);
    const y = rng.int(2, 7);
    const z = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== y));
    const baseA = x * y;
    const heightA = z * w;
    const baseB = x * z;
    const answer = y * w;
    const area = baseA * heightA;
    return numberProblem({
      prompt: t(
        `A parallelogram has sides of ${baseA} cm and ${baseB} cm. The height onto the ${baseA} cm side is ${heightA} cm. What is the height onto the ${baseB} cm side, in centimeters?`,
        `一个平行四边形的两条边长 ${baseA} 厘米和 ${baseB} 厘米，${baseA} 厘米边上的高是 ${heightA} 厘米。${baseB} 厘米边上的高是多少厘米？`,
      ),
      answer,
      form: "integer",
      wrong: [heightA, baseB * heightA, area, Math.round(area / (2 * baseB)), answer + 1],
      solution: t(
        `The area is $${baseA} \\times ${heightA} = ${area}$. Using the other side, the height is $${area} \\div ${baseB} = ${answer}$ cm.`,
        `面积是 $${baseA} \\times ${heightA} = ${area}$。用另一条边，高是 $${area} \\div ${baseB} = ${answer}$ 厘米。`,
      ),
    });
  },
};

const altitudeToHypotenuse: KnowledgePointDef = {
  id: "the-height-onto-the-longest-side",
  title: t("The height onto the longest side", "最长边上的高"),
  explanation: t(
    "A right triangle has an easy area, because its two shorter sides are a base and a height. That same area can be computed with the longest side as the base, using the height onto it. So setting the two expressions for the area equal gives this new height, with no need for a formula for it. The result is always shorter than either of the shorter sides, which gives a useful check.",
    "直角三角形的面积很容易求，因为两条较短的边就是底和高。同一个面积也可以用最长边作底、用它上面的高来计算。所以令两个面积表达式相等，就得到这条新的高，不需要专门的公式。结果总是比两条较短的边都短，这是一个有用的检验。",
  ),
  generate(rng) {
    const [a, b, c] = rng.pick([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
      [20, 21, 29],
      [9, 40, 41],
    ]) as [number, number, number];
    const k = rng.int(1, 5);
    const answer = Q.of(a * k * b * k, c * k);
    const area = (a * k * b * k) / 2;
    return numberProblem({
      prompt: t(
        `A right triangle has sides of ${a * k} cm, ${b * k} cm and ${c * k} cm. What is the height onto the ${c * k} cm side, in centimeters? Give an exact value.`,
        `一个直角三角形的三条边长 ${a * k} 厘米、${b * k} 厘米和 ${c * k} 厘米。${c * k} 厘米边上的高是多少厘米？写出准确值。`,
      ),
      answer,
      wrong: [answer.div(Q.of(2)), Q.of(a * k), Q.of(area), answer.add(Q.of(1)), Q.of(b * k)],
      solution: t(
        `The area is $\\frac{1}{2} \\times ${a * k} \\times ${b * k} = ${area}$. So $\\frac{1}{2} \\times ${c * k} \\times h = ${area}$, which gives $h = ${answer.toLatex()}$.`,
        `面积是 $\\frac{1}{2} \\times ${a * k} \\times ${b * k} = ${area}$。所以 $\\frac{1}{2} \\times ${c * k} \\times h = ${area}$，得 $h = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const pictureFrame: KnowledgePointDef = {
  id: "the-area-of-a-border",
  title: t("The area of a border", "边框的面积"),
  explanation: t(
    "Some shapes are found by taking one area away from another, rather than by adding pieces. The area of a border is the outer rectangle minus the inner one. A border of a given width makes each side of the inner rectangle shorter by twice that width, because the border lies on both ends. Subtracting the width only once is the typical slip, so a labeled sketch of the frame is worth drawing first.",
    "有些图形不是把几块加起来，而是用一个面积减去另一个面积得到的。边框的面积就是外面的长方形减去里面的长方形。一定宽度的边框使里面长方形的每条边少两倍的宽度，因为两端都有边框。只减一次宽度是典型的差错，所以值得先画一个标好尺寸的边框草图。",
  ),
  generate(rng) {
    const border = rng.int(1, 4);
    const innerW = rng.int(3, 20);
    const innerH = rng.int(3, 20);
    const w = innerW + 2 * border;
    const h = innerH + 2 * border;
    const answer = w * h - innerW * innerH;
    return numberProblem({
      prompt: t(
        `A framed picture measures ${w} cm by ${h} cm on the outside, and the frame is ${border} cm wide all round. What is the area of the frame, in square centimeters?`,
        `一幅带框的画外部尺寸是 ${w} 厘米乘 ${h} 厘米，画框四周宽 ${border} 厘米。画框的面积是多少平方厘米？`,
      ),
      answer,
      form: "integer",
      wrong: [w * h - (w - border) * (h - border), innerW * innerH, w * h, 2 * (w + h) * border + 1, 2 * (w + h) * border],
      solution: t(
        `The inner picture is ${innerW} cm by ${innerH} cm. So the frame is $${w} \\times ${h} - ${innerW} \\times ${innerH} = ${w * h} - ${innerW * innerH} = ${answer}$.`,
        `里面的画是 ${innerW} 厘米乘 ${innerH} 厘米。所以画框是 $${w} \\times ${h} - ${innerW} \\times ${innerH} = ${w * h} - ${innerW * innerH} = ${answer}$。`,
      ),
    });
  },
};

const madAfterChange: KnowledgePointDef = {
  id: "the-mad-after-changing-every-value",
  title: t("The MAD after changing every value", "所有值变化后的平均绝对偏差"),
  explanation: t(
    "The mean absolute deviation measures how far values lie from their mean. Adding the same number to every value slides the whole data set along the number line, and it moves the mean by the same amount, so no distance changes and the MAD stays the same. Multiplying every value by a number stretches all the distances by that number, and so the MAD is multiplied as well. No data values are needed to see this.",
    "平均绝对偏差度量各值离平均数有多远。给每个值加同一个数，整个数据集沿数轴平移，平均数也移动同样的量，所以距离都不变，平均绝对偏差不变。给每个值乘一个数，所有距离都按这个数拉伸，所以平均绝对偏差也乘以这个数。不需要具体的数据就能看出这一点。",
  ),
  generate(rng) {
    const mad = rng.int(2, 15);
    const add = rng.int(2, 20);
    const times = rng.int(2, 6);
    const kind = rng.int(0, 2);
    const answer = kind === 0 ? mad : times * mad;
    const change =
      kind === 0
        ? [`${add} is added to every value`, `每个值都加 ${add}`]
        : kind === 1
          ? [`every value is multiplied by ${times}`, `每个值都乘以 ${times}`]
          : [`every value is multiplied by ${times} and then ${add} is added`, `每个值都乘以 ${times} 再加 ${add}`];
    return numberProblem({
      prompt: t(
        `A data set has a mean absolute deviation of $${mad}$. Then ${change[0]}. What is the new mean absolute deviation?`,
        `一个数据集的平均绝对偏差是 $${mad}$。然后${change[1]}。新的平均绝对偏差是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [mad + add, times * mad + add, kind === 0 ? times * mad : mad, 0, answer + 1],
      solution: t(
        kind === 0
          ? `Adding a number moves all values and the mean together, so the distances do not change. The MAD stays ${mad}.`
          : `Multiplying stretches every distance by ${times}${kind === 2 ? ", while adding changes no distance" : ""}. So the MAD is $${times} \\times ${mad} = ${answer}$.`,
        kind === 0
          ? `加一个数使所有值和平均数一起移动，距离不变。平均绝对偏差还是 ${mad}。`
          : `乘法把每个距离拉伸到 ${times} 倍${kind === 2 ? "，而加法不改变距离" : ""}。所以平均绝对偏差是 $${times} \\times ${mad} = ${answer}$。`,
      ),
    });
  },
};

const meanWithoutOutlier: KnowledgePointDef = {
  id: "the-mean-after-removing-an-outlier",
  title: t("The mean after removing an outlier", "去掉离群值后的平均数"),
  explanation: t(
    "An outlier can pull the mean a long way, and it is possible to measure by how much without knowing the other values. The mean times the count gives the sum of all the values. Take the outlier away from this sum, and divide by one fewer value. A common slip is to keep the old count. The median is usually affected much less, which explains why it is preferred for data with outliers.",
    "离群值能把平均数拉得很远，而且不知道其他值也能算出拉了多少。平均数乘以个数得到所有值的和。从和中减去离群值，再除以少一个的个数。常见的差错是还用原来的个数。中位数受到的影响通常小得多，这就是有离群值的数据更适合用中位数的原因。",
  ),
  generate(rng) {
    const n = rng.int(5, 12);
    const answer = rng.int(10, 60);
    const extra = rng.int(3, 20);
    const outlier = answer + n * extra;
    const mean = answer + extra;
    const total = n * mean;
    return numberProblem({
      prompt: t(
        `A data set of $${n}$ values has a mean of $${mean}$. One value, $${outlier}$, is an outlier and is removed. What is the mean of the remaining values?`,
        `一个有 $${n}$ 个值的数据集，平均数是 $${mean}$。其中一个值 $${outlier}$ 是离群值，被去掉了。其余各值的平均数是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [mean, Math.floor((total - outlier) / n), mean - extra * 2, total - outlier, answer + 1],
      solution: t(
        `The sum of all the values is $${n} \\times ${mean} = ${total}$. Without the outlier, it is $${total} - ${outlier} = ${total - outlier}$, and $${total - outlier} \\div ${n - 1} = ${answer}$.`,
        `所有值的和是 $${n} \\times ${mean} = ${total}$。去掉离群值后是 $${total} - ${outlier} = ${total - outlier}$，$${total - outlier} \\div ${n - 1} = ${answer}$。`,
      ),
    });
  },
};

const copiesForMode: KnowledgePointDef = {
  id: "copies-needed-to-change-the-mode",
  title: t("Copies needed to change the mode", "要多少个才能改变众数"),
  explanation: t(
    "The mode is the value that appears most often, so a data set can be changed to have a new mode by adding copies of a value. To become the only mode, a value must appear strictly more often than the current mode does. Having the same count only produces two modes. So the number of copies needed is the difference between the two counts, plus one more to break the tie. Other values in the set play no part.",
    "众数是出现次数最多的值，所以加入某个值的副本可以使数据集有新的众数。要成为唯一的众数，这个值出现的次数必须严格多于当前众数。次数相同只会产生两个众数。所以需要的个数是两个次数的差，再多一个打破平局。集合中的其他值不起作用。",
  ),
  generate(rng) {
    const value = rng.int(2, 30);
    const other = rng.pick([...Array(29).keys()].map((i) => i + 2).filter((v) => v !== value));
    const low = rng.int(1, 12);
    const high = low + rng.int(1, 12);
    const answer = high - low + 1;
    return numberProblem({
      prompt: t(
        `In a data set, the value $${value}$ appears $${high}$ times and is the only mode. The value $${other}$ appears $${low}$ ${low === 1 ? "time" : "times"}. How many more copies of $${other}$ must be added for $${other}$ to become the only mode?`,
        `在一个数据集中，$${value}$ 出现 $${high}$ 次，是唯一的众数。$${other}$ 出现 $${low}$ 次。至少要再加入多少个 $${other}$，才能使 $${other}$ 成为唯一的众数？`,
      ),
      answer,
      form: "integer",
      wrong: [high - low, high, high + 1, answer + 1, high + low, answer + 2],
      solution: t(
        `$${other}$ must appear $${high + 1}$ times, one more than the $${high}$ times that $${value}$ appears. That takes $${high + 1} - ${low} = ${answer}$ more copies.`,
        `$${other}$ 必须出现 $${high + 1}$ 次，比 $${value}$ 出现的 $${high}$ 次多一次。所以要再加 $${high + 1} - ${low} = ${answer}$ 个。`,
      ),
    });
  },
};

/** deeperGrade6Points maps topics of 6th Grade Math to further knowledge points. */
export const deeperGrade6Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "reasoning-with-equivalent-ratios": [ratioAfterAdding],
  "speed-as-a-unit-rate": [closingSpeeds],
  "tape-diagrams": [givingToEqualize],
  "finding-a-total-given-a-part-and-a-percentage": [totalFromTheRest],
  "finding-part-of-a-number-given-a-whole-and-a-percentage": [swappingPercent],
  "comparing-fractions-percents-and-decimals": [sumAcrossForms],
  "finding-side-lengths-using-fraction-division": [perimeterFromFractionalArea],
  "dividing-mixed-numbers-word-problems": [leftoverAfterFilling],
  "interpreting-absolute-value": [numbersAtADistance],
  "identifying-rational-numbers-on-a-number-line": [halfwayPoint],
  "reflections-of-points-in-the-coordinate-plane": [distanceToReflection],
  "finding-areas-and-perimeters-in-the-coordinate-plane": [cornerFromArea],
  "comparing-exponents": [firstPowerAbove],
  "evaluating-exponents-with-fractional-bases": [fractionalBaseExponent],
  "evaluating-linear-expressions": [changeInLinearExpression],
  "simplifying-linear-expressions": [perimeterExpression],
  "one-step-multiplication-equations": [anotherMultiple],
  "identifying-solutions-to-linear-inequalities": [countingInequalitySolutions],
  "modeling-real-world-problems-using-inequalities": [mostWithBudget],
  "areas-and-perimeters-of-parallelograms": [secondHeight],
  "areas-of-right-triangles": [altitudeToHypotenuse],
  "finding-areas-of-polygons-using-decomposition": [pictureFrame],
  "mean-absolute-deviation": [madAfterChange],
  outliers: [meanWithoutOutlier],
  "the-mode-of-a-data-set": [copiesForMode],
};
