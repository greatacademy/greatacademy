import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { ask, mod, words } from "../exam.ts";
import { heightFigure, nestedSquaresFigure, numberLineFigure, polyFigure, rightPts, stripFigure } from "../exam-figures.ts";

// ACT Math Prep, Foundations: arithmetic, fractions, ratios and rates, word problems, and basic data and geometry.

const arithTips = mod(
  t(
    "Work inside parentheses and absolute value bars first, then powers, then multiplication and division from left to right, and finally addition and subtraction from left to right.",
    "先算括号和绝对值符号内的部分，再算乘方，然后从左到右算乘除，最后从左到右算加减。",
  ),
  t(
    "Keep track of signs at every step: subtracting a negative adds, and the product of two negatives is positive. A factorial multiplies all the whole numbers down to $1$, so cancel before multiplying.",
    "每一步都注意符号：减去负数等于加，两个负数之积为正。阶乘是一直乘到 $1$ 的连乘，所以先约分再相乘。",
  ),
);
const fracTips = mod(
  t(
    "To add or subtract fractions, rewrite them over a common denominator. To multiply, multiply the tops and the bottoms. To divide, multiply by the reciprocal of the divisor.",
    "分数加减要先通分。分数相乘时分子乘分子、分母乘分母。除以一个数等于乘它的倒数。",
  ),
  t(
    "Simplify before you choose an answer. The number halfway between two fractions is their average, and a mixed number is easiest to work with as an improper fraction.",
    "选答案之前先化简。两个分数正中间的数是它们的平均数，带分数写成假分数后最容易计算。",
  ),
);
const orderTips = mod(
  t(
    "Compare numbers by writing them in the same form, as decimals or over a common denominator. On a number line, values increase from left to right, including negatives.",
    "比较数时要写成相同形式，都化成小数或通分。数轴上的值从左到右递增，负数也一样。",
  ),
  t(
    "To estimate a square root, find the two perfect squares around the number. Its root lies between their roots, and closer to the root of the nearer perfect square.",
    "估计平方根时，找出这个数两侧的完全平方数。它的根介于两者的根之间，并且更接近较近的那个完全平方数的根。",
  ),
);
const ratioTips = mod(
  t(
    "A ratio $a : b$ splits a whole into $a + b$ equal parts. Find the size of one part from what you know, and then multiply to find the quantity the question asks for.",
    "比 $a : b$ 把整体分成 $a + b$ 等份。由已知条件求出一份的大小，再相乘求题目要的量。",
  ),
  t(
    "To compare ratios, rewrite them with a common term or as decimals. Fuel mileage is distance divided by fuel, so the fuel needed is the distance divided by the mileage.",
    "比较比时，把它们写成有公共项的形式或小数。油耗里程是距离除以油量，所以所需油量是距离除以每单位油量的里程。",
  ),
);
const rateTips = mod(
  t(
    "Distance is rate times time. Keep the units consistent, and turn minutes into hours before you use a speed in miles per hour. A rate of change is the change in amount per unit.",
    "距离等于速度乘时间。单位要一致，用每小时英里的速度之前，要把分钟换成小时。变化率是每单位的变化量。",
  ),
  t(
    "Average speed is the total distance divided by the total time, not the mean of the speeds. Rates of workers add, so their combined time is one divided by the sum of their rates.",
    "平均速度是总距离除以总时间，而不是速度的平均数。工人的效率可以相加，所以合作时间等于 $1$ 除以效率之和。",
  ),
);
const moneyTips = mod(
  t(
    "Multiply each unit price by the number of units, then add. Read carefully to see whether the question wants a total, an amount remaining, a difference or a price per unit.",
    "每个单价乘数量后相加。仔细读题，看题目要的是总数、剩余量、差额还是单价。",
  ),
  t(
    "With several steps, write down each intermediate amount. Overtime hours are paid at the higher rate, and net profit is the income minus every cost.",
    "步骤多时，写下每个中间量。加班小时按更高的工资计算，净利润是收入减去所有成本。",
  ),
);
const partTips = mod(
  t(
    "A fraction of a whole is the fraction times the whole. The word of means multiply, so a fraction of what remains is computed from the remainder and not from the original amount.",
    "整体的几分之几等于分数乘整体。“的”表示相乘，所以剩余部分的几分之几要用剩余量计算，而不是原来的量。",
  ),
  t(
    "When items pack into whole groups, divide and then decide whether to round. Round up if everything must fit, and round down when only complete groups count.",
    "把物品装成整组时，先做除法，再决定如何取整。全部都要装下就向上取整，只算完整的组就向下取整。",
  ),
);
const statTips = mod(
  t(
    "A mean is the total divided by the count, so the total equals the mean times the count. The median is the middle value once the data are sorted.",
    "平均数等于总和除以个数，所以总和等于平均数乘个数。中位数是排序后位于中间的值。",
  ),
  t(
    "To find a missing value from a mean, subtract the known values from the required total. A mean and a median can differ when one value is far from the others.",
    "由平均数求缺失值时，用要求的总和减去已知值。当有一个值远离其他值时，平均数和中位数可能不同。",
  ),
);
const shapeTips = mod(
  t(
    "The perimeter of a rectangle is $2(l + w)$ and its area is $lw$. A square has four equal sides, and a triangle has area $\\frac{1}{2}bh$. A box has volume $lwh$.",
    "长方形周长是 $2(l + w)$，面积是 $lw$。正方形四边相等，三角形面积是 $\\frac{1}{2}bh$。长方体体积是 $lwh$。",
  ),
  t(
    "When a shape is scaled by a factor, lengths scale by it, areas by its square and volumes by its cube. When two figures have equal areas, set their area formulas equal and solve.",
    "图形按比例缩放时，长度乘比例因子，面积乘它的平方，体积乘它的立方。两个图形面积相等时，令面积公式相等再求解。",
  ),
);

const facts = [1, 1, 2, 6, 24, 120, 720, 5040, 40320] as const;

function sortedOf(xs: readonly number[]) {
  return [...xs].sort((a, b) => a - b);
}

/** actExamFoundations are the exam-style questions of the ACT Foundations unit that have no SAT counterpart. */
export const actExamFoundations: ExamSpec[] = [
  arithTips("Evaluating Absolute-Value Expressions", "计算绝对值表达式", ["absolute-value"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 15), rng.int(16, 30), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the value of $|${a} - ${b}|$?`,
        `$|${a} - ${b}|$ 的值是多少？`,
        b - a,
        [a - b, a + b, -(a + b), b - a + 1],
        `$${a} - ${b} = ${a - b}$, and its absolute value is $${b - a}$.`,
        `$${a} - ${b} = ${a - b}$，其绝对值是 $${b - a}$。`,
      );
    return ask(
      rng,
      `What is the value of $${c}|${a} - ${b}| - |${-c}|$?`,
      `$${c}|${a} - ${b}| - |${-c}|$ 的值是多少？`,
      c * (b - a) - c,
      [c * (a - b) - c, c * (b - a) + c, c * (a + b) - c, c * (b - a)],
      `$${c}(${b - a}) - ${c}$.`,
      `$${c}(${b - a}) - ${c}$。`,
    );
  }),
  arithTips(
    "Evaluating Numeric Expressions",
    "计算数值表达式",
    ["evaluating-rational-number-expressions-without-exponents"],
    (rng, hard) => {
      const [a, b, c, d] = [rng.int(2, 15), rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
      if (!hard)
        return ask(
          rng,
          `What is the value of $${a} + ${b} \\times ${c}$?`,
          `$${a} + ${b} \\times ${c}$ 的值是多少？`,
          a + b * c,
          [(a + b) * c, a * b + c, a + b + c, a + b * c + 1],
          `Multiply before adding.`,
          `先乘后加。`,
        );
      return ask(
        rng,
        `What is the value of $${a} - ${b}(${c} - ${c + d})^2$?`,
        `$${a} - ${b}(${c} - ${c + d})^2$ 的值是多少？`,
        a - b * d * d,
        [(a - b) * d * d, a + b * d * d, a - b * d, a - b * d * d + 1],
        `The parentheses give $${-d}$, and its square is $${d * d}$.`,
        `括号内得 $${-d}$，平方是 $${d * d}$。`,
      );
    },
  ),
  arithTips("Evaluating Factorials and Quotients", "计算阶乘和商", ["factorials"], (rng, hard) => {
    const n = rng.int(3, 8);
    const k = rng.int(2, 9);
    const m = rng.int(6, 14);
    const r = rng.int(1, 3);
    if (!hard)
      return ask(
        rng,
        `What is the value of $${n}! + ${k}$?`,
        `$${n}! + ${k}$ 的值是多少？`,
        (facts[n] ?? 1) + k,
        [n * (n - 1) + k, n + k, (facts[n - 1] ?? 1) + k, (n + k) * 2 + 1],
        `$${n}! = ${facts[n] ?? 1}$.`,
        `$${n}! = ${facts[n] ?? 1}$。`,
      );
    const down = r === 1 ? m : r === 2 ? m * (m - 1) : m * (m - 1) * (m - 2);
    return ask(
      rng,
      `What is the value of $\\frac{${m}!}{${m - r}!}$?`,
      `$\\frac{${m}!}{${m - r}!}$ 的值是多少？`,
      down,
      [r === 1 ? m - 1 : m, down * (m - r), m * r, down + 1],
      `Cancel the shared factors of $${m - r}!$.`,
      `约去公因子 $${m - r}!$。`,
    );
  }),
  arithTips(
    "Comparing Signed Number Changes",
    "比较有符号数的变化",
    ["solving-problems-using-addition-and-subtraction-of-rational-numbers"],
    (rng, hard) => {
      const [a, b, c, d] = [rng.int(-20, -2), rng.int(2, 25), rng.int(-25, -2), rng.int(2, 25)];
      if (!hard)
        return ask(
          rng,
          `The temperature was $${a}^\\circ$ at dawn and $${b}^\\circ$ at noon. By how many degrees did it rise?`,
          `黎明时气温 $${a}^\\circ$，中午 $${b}^\\circ$。气温上升了多少度？`,
          b - a,
          [b + a === b - a ? b + 1 : b + a, -a, b, b - a + 1],
          `$${b} - (${a}) = ${b - a}$.`,
          `$${b} - (${a}) = ${b - a}$。`,
        );
      return ask(
        rng,
        `One city's temperature changed from $${a}^\\circ$ to $${b}^\\circ$, and another's changed from $${c}^\\circ$ to $${d}^\\circ$. What is the difference between the sizes of the two changes, in degrees?`,
        `一座城市气温从 $${a}^\\circ$ 变到 $${b}^\\circ$，另一座从 $${c}^\\circ$ 变到 $${d}^\\circ$。两次变化幅度相差多少度？`,
        Math.abs(b - a - (d - c)),
        [b - a + (d - c), Math.abs(b - d), Math.abs(a - c), Math.abs(b - a - (d - c)) + 1],
        `The changes are $${b - a}^\\circ$ and $${d - c}^\\circ$.`,
        `变化分别是 $${b - a}^\\circ$ 和 $${d - c}^\\circ$。`,
      );
    },
  ),
  arithTips(
    "Computing Integer Amounts in Context",
    "在情境中计算整数量",
    ["solving-problems-using-the-four-operations-on-rational-numbers"],
    (rng, hard) => {
      const [w, n, f] = [rng.int(10, 40), rng.int(2, 9), rng.int(2, 9)];
      const b = n * (w + f) + rng.int(20, 200);
      if (!hard)
        return ask(
          rng,
          `An account holds $\\$${b}$. The owner makes $${n}$ withdrawals of $\\$${w}$ each. What is the balance, in dollars?`,
          `账户有 $${b}$ 美元。户主取款 $${n}$ 次，每次 $${w}$ 美元。余额是多少美元？`,
          b - n * w,
          [b + n * w, b - w, b - n - w, b - n * w + w],
          `$${b} - ${n}(${w})$.`,
          `$${b} - ${n}(${w})$。`,
        );
      return ask(
        rng,
        `An account holds $\\$${b}$. The owner makes $${n}$ withdrawals of $\\$${w}$ each, is charged a fee of $\\$${f}$ on each withdrawal, and then deposits $\\$${2 * w}$. What is the balance, in dollars?`,
        `账户有 $${b}$ 美元。户主取款 $${n}$ 次，每次 $${w}$ 美元，每次收手续费 $${f}$ 美元，然后存入 $${2 * w}$ 美元。余额是多少美元？`,
        b - n * (w + f) + 2 * w,
        [b - n * w + 2 * w, b - n * (w + f), b - n * w - f + 2 * w, b - n * (w + f) - 2 * w],
        `Each withdrawal costs $${w + f}$ in all.`,
        `每次取款共花 $${w + f}$。`,
      );
    },
  ),
  arithTips("Identifying Place Value and Properties", "判断位值和运算性质", ["properties-of-real-number-operations"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 9), rng.int(0, 9), rng.int(1, 9), rng.int(1, 9)];
    const [x, y, z] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `What is the digit in the hundreds place of $${a}{,}${b}${c}${d}$ plus the digit in its ones place?`,
        `$${a}{,}${b}${c}${d}$ 的百位数字加个位数字等于多少？`,
        b + d,
        [a + d, c + d, a + b, b + c === b + d ? b + d + 1 : b + c],
        `The hundreds digit is $${b}$, and the ones digit is $${d}$.`,
        `百位数字是 $${b}$，个位数字是 $${d}$。`,
      );
    return words(
      rng,
      t(
        `Which property is shown by $${x}(${y} + ${z}) = ${x}(${y}) + ${x}(${z})$?`,
        `$${x}(${y} + ${z}) = ${x}(${y}) + ${x}(${z})$ 体现了哪个性质？`,
      ),
      t("distributive", "分配律"),
      [t("commutative", "交换律"), t("associative", "结合律"), t("identity", "单位元性质")],
      t("Multiplying across a sum is the distributive property.", "把乘法分配到和的每一项上就是分配律。"),
    );
  }),
  fracTips("Adding Fractions", "分数加法", ["adding-fractions-with-unlike-denominators"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 7), rng.int(2, 9), rng.int(1, 7), rng.int(2, 9)];
    const p = rng.int(1, 3);
    if (!hard)
      return ask(
        rng,
        `What is $\\frac{${a}}{${b}} + \\frac{${c}}{${d}}$?`,
        `$\\frac{${a}}{${b}} + \\frac{${c}}{${d}}$ 等于多少？`,
        Q.of(a * d + c * b, b * d),
        [Q.of(a + c, b + d), Q.of(a + c, b * d), Q.of(a * c, b * d), Q.of(a * d + c * b + 1, b * d)],
        `The common denominator is $${b * d}$.`,
        `公分母是 $${b * d}$。`,
      );
    return ask(
      rng,
      `What is $${p}\\frac{${a}}{${a + 1}} + \\frac{${c}}{${d}}$?`,
      `$${p}\\frac{${a}}{${a + 1}} + \\frac{${c}}{${d}}$ 等于多少？`,
      Q.of(p * (a + 1) + a, a + 1).add(Q.of(c, d)),
      [
        Q.of(p + a + c, a + 1 + d),
        Q.of(a, a + 1).add(Q.of(c, d)),
        Q.of(p * (a + 1) + a, a + 1)
          .add(Q.of(c, d))
          .add(Q.of(1)),
        Q.of(p * a + c, a + 1 + d),
      ],
      `Add the fractional parts, and keep the whole part $${p}$.`,
      `分数部分相加，保留整数部分 $${p}$。`,
    );
  }),
  fracTips("Subtracting Fractions", "分数减法", ["adding-and-subtracting-fractions"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(5, 12), rng.int(2, 6), rng.int(1, 4), rng.int(7, 11)];
    const p = rng.int(2, 6);
    if (!hard)
      return ask(
        rng,
        `What is $\\frac{${a}}{${b}} - \\frac{${c}}{${d}}$?`,
        `$\\frac{${a}}{${b}} - \\frac{${c}}{${d}}$ 等于多少？`,
        Q.of(a * d - c * b, b * d),
        [Q.of(a - c, b - d), Q.of(a - c, b * d), Q.of(a * d + c * b, b * d), Q.of(a * d - c * b + 1, b * d)],
        `The common denominator is $${b * d}$.`,
        `公分母是 $${b * d}$。`,
      );
    return ask(
      rng,
      `A rope is $${p}\\frac{1}{${b}}$ feet long, and a piece $\\frac{${c}}{${d}}$ feet long is cut off. How many feet are left?`,
      `绳子长 $${p}\\frac{1}{${b}}$ 英尺，剪掉 $\\frac{${c}}{${d}}$ 英尺。还剩多少英尺？`,
      Q.of(p * b + 1, b).sub(Q.of(c, d)),
      [
        Q.of(p * b + 1, b).add(Q.of(c, d)),
        Q.of(1, b).sub(Q.of(c, d)),
        Q.of(p * b + 1, b)
          .sub(Q.of(c, d))
          .add(Q.of(1)),
        Q.of(p * b + 1 - c, b + d),
      ],
      `Rewrite the length as $\\frac{${p * b + 1}}{${b}}$.`,
      `把长度写成 $\\frac{${p * b + 1}}{${b}}$。`,
    );
  }),
  fracTips("Multiplying Fractions", "分数乘法", ["fractions-of-fractions"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 8), rng.int(2, 9), rng.int(1, 8), rng.int(2, 9)];
    const k = rng.int(2, 9);
    if (!hard)
      return ask(
        rng,
        `What is $\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}}$?`,
        `$\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}}$ 等于多少？`,
        Q.of(a * c, b * d),
        [Q.of(a * d, b * c), Q.of(a + c, b + d), Q.of(a + c, b * d), Q.of(a * c + 1, b * d)],
        `Multiply the numerators and the denominators.`,
        `分子相乘，分母相乘。`,
      );
    return ask(
      rng,
      `What is $\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}} \\times ${k * b}$?`,
      `$\\frac{${a}}{${b}} \\times \\frac{${c}}{${d}} \\times ${k * b}$ 等于多少？`,
      Q.of(a * c * k, d),
      [Q.of(a * c, b * d), Q.of(a * c * k, b), Q.of(a * c * k + 1, d), Q.of(a * c * k * b, d)],
      `Cancel the $${b}$ in the denominator with $${k * b}$.`,
      `用 $${k * b}$ 约去分母中的 $${b}$。`,
    );
  }),
  fracTips("Dividing With Fractions", "分数除法", ["dividing-fractions"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 8), rng.int(2, 9), rng.int(1, 8), rng.int(2, 9)];
    const [n, k] = [rng.int(2, 9), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `What is $\\frac{${a}}{${b}} \\div \\frac{${c}}{${d}}$?`,
        `$\\frac{${a}}{${b}} \\div \\frac{${c}}{${d}}$ 等于多少？`,
        Q.of(a * d, b * c),
        [Q.of(a * c, b * d), Q.of(b * c, a * d), Q.of(a + d, b + c), Q.of(a * d + 1, b * c)],
        `Multiply by the reciprocal $\\frac{${d}}{${c}}$.`,
        `乘倒数 $\\frac{${d}}{${c}}$。`,
      );
    return ask(
      rng,
      `A ribbon $${n * a}$ feet long is cut into pieces each $\\frac{${a}}{${k}}$ feet long. How many pieces are there?`,
      `一条 $${n * a}$ 英尺长的丝带被剪成每段 $\\frac{${a}}{${k}}$ 英尺。共有多少段？`,
      n * k,
      [n, Q.of(n * a * a, k), n * a * k, n * k + 1],
      `$${n * a} \\div \\frac{${a}}{${k}} = ${n * a} \\cdot \\frac{${k}}{${a}}$.`,
      `$${n * a} \\div \\frac{${a}}{${k}} = ${n * a} \\cdot \\frac{${k}}{${a}}$。`,
    );
  }),
  fracTips("Finding a Midpoint Between Fractions", "求两个分数的中点", ["adding-and-subtracting-fractions"], (rng, hard) => {
    const [a, b, c, d] = [rng.int(1, 8), rng.int(2, 9), rng.int(1, 8), rng.int(2, 9)];
    const u = rng.int(1, 3);
    if (!hard)
      return ask(
        rng,
        `Which number is halfway between $\\frac{${a}}{${b}}$ and $\\frac{${a + 2 * u}}{${b}}$?`,
        `哪个数在 $\\frac{${a}}{${b}}$ 和 $\\frac{${a + 2 * u}}{${b}}$ 的正中间？`,
        Q.of(a + u, b),
        [Q.of(a + u, 2 * b), Q.of(2 * a + 2 * u, b), Q.of(a + u + 1, b), Q.of(u, b)],
        `Average the numerators over the same denominator.`,
        `同分母时取分子的平均数。`,
      );
    return ask(
      rng,
      `Which number is halfway between $\\frac{${a}}{${b}}$ and $\\frac{${c}}{${d}}$?`,
      `哪个数在 $\\frac{${a}}{${b}}$ 和 $\\frac{${c}}{${d}}$ 的正中间？`,
      Q.of(a * d + c * b, 2 * b * d),
      [
        Q.of(a + c, b + d).eq(Q.of(a * d + c * b, 2 * b * d)) ? Q.of(a + c + 1, b + d) : Q.of(a + c, b + d),
        Q.of(a * d + c * b, b * d),
        Q.of(a + c, 2 * b * d),
        Q.of(a * d + c * b + 1, 2 * b * d),
      ],
      `Add the fractions and divide by $2$.`,
      `两分数相加再除以 $2$。`,
    );
  }),
  orderTips("Locating Numbers on a Number Line", "在数轴上定位", ["identifying-rational-numbers-on-a-number-line"], (rng, hard) => {
    const [a, d, k, n] = [rng.int(-9, 9), rng.int(2, 8), rng.int(1, 3), rng.pick([4, 5])];
    const m = rng.int(1, n - 1);
    if (!hard)
      return ask(
        rng,
        `On a number line, point $P$ is $${d}$ units to the left of $${a}$. What number is at $P$?`,
        `数轴上点 $P$ 在 $${a}$ 左边 $${d}$ 个单位处。$P$ 表示什么数？`,
        a - d,
        [a + d, d - a === a - d ? a - d + 1 : d - a, a, a - d - 1],
        `Moving left subtracts.`,
        `向左移就是减。`,
      );
    return ask(
      rng,
      `On a number line, the distance from $${a}$ to $${a + k * n}$ is divided into $${n}$ equal parts. What number is $${m}$ parts to the right of $${a}$?`,
      `数轴上从 $${a}$ 到 $${a + k * n}$ 的距离被分成 $${n}$ 等份。$${a}$ 右边第 $${m}$ 份处是什么数？`,
      a + k * m,
      [a + m, a + k * n, k * m, a + k * m + 1],
      `Each part has length $${k}$.`,
      `每份长 $${k}$。`,
      numberLineFigure(a, a + k * n, n, m),
    );
  }),
  orderTips("Ordering Rational Numbers", "给有理数排序", ["comparing-rational-numbers"], (rng, hard) => {
    const [a, b, c] = [rng.int(1, 3), rng.int(5, 9), rng.int(1, 9)];
    const v1 = -c;
    const v2 = c * 10 + b;
    if (!hard)
      return words(
        rng,
        t(
          `Which number is greatest: $${v1}$, $\\frac{${a}}{${b}}$, $${c}$ or $${c}.${b}$?`,
          `哪个数最大：$${v1}$、$\\frac{${a}}{${b}}$、$${c}$，还是 $${c}.${b}$？`,
        ),
        t(`$${c}.${b}$`, `$${c}.${b}$`),
        [t(`$${v1}$`, `$${v1}$`), t(`$\\frac{${a}}{${b}}$`, `$\\frac{${a}}{${b}}$`), t(`$${c}$`, `$${c}$`)],
        t(
          `Since $${c}.${b} = \\frac{${v2}}{10}$ is above $${c}$, it is the largest of the four.`,
          `因为 $${c}.${b} = \\frac{${v2}}{10}$ 大于 $${c}$，所以它是四个数中最大的。`,
        ),
      );
    return words(
      rng,
      t(
        `Which list orders $-\\frac{${a}}{${b}}$, $0.${b}$, $-${c}$ and $\\frac{${b + 1}}{${b}}$ from least to greatest?`,
        `哪一列把 $-\\frac{${a}}{${b}}$、$0.${b}$、$-${c}$、$\\frac{${b + 1}}{${b}}$ 从小到大排列？`,
      ),
      t(`$-${c}, -\\frac{${a}}{${b}}, 0.${b}, \\frac{${b + 1}}{${b}}$`, `$-${c}, -\\frac{${a}}{${b}}, 0.${b}, \\frac{${b + 1}}{${b}}$`),
      [
        t(`$-\\frac{${a}}{${b}}, -${c}, 0.${b}, \\frac{${b + 1}}{${b}}$`, `$-\\frac{${a}}{${b}}, -${c}, 0.${b}, \\frac{${b + 1}}{${b}}$`),
        t(`$-${c}, -\\frac{${a}}{${b}}, \\frac{${b + 1}}{${b}}, 0.${b}$`, `$-${c}, -\\frac{${a}}{${b}}, \\frac{${b + 1}}{${b}}, 0.${b}$`),
        t(`$\\frac{${b + 1}}{${b}}, 0.${b}, -\\frac{${a}}{${b}}, -${c}$`, `$\\frac{${b + 1}}{${b}}, 0.${b}, -\\frac{${a}}{${b}}, -${c}$`),
      ],
      t(
        `The fraction $\\frac{${a}}{${b}}$ is less than $1$, so $-${c} \\le -1 < -\\frac{${a}}{${b}}$, and $\\frac{${b + 1}}{${b}}$ is greater than $1$.`,
        `分数 $\\frac{${a}}{${b}}$ 小于 $1$，所以 $-${c} \\le -1 < -\\frac{${a}}{${b}}$，而 $\\frac{${b + 1}}{${b}}$ 大于 $1$。`,
      ),
    );
  }),
  orderTips("Estimating Square Roots", "估计平方根", ["approximating-square-roots"], (rng, hard) => {
    const n = rng.int(3, 15);
    const add = rng.int(1, 2 * n);
    const v = n * n + add;
    if (!hard)
      return ask(
        rng,
        `The value of $\\sqrt{${v}}$ lies between which two consecutive whole numbers?`,
        `$\\sqrt{${v}}$ 的值在哪两个连续整数之间？`,
        `${n} \\text{ and } ${n + 1}`,
        [
          `${n - 1} \\text{ and } ${n}`,
          `${n + 1} \\text{ and } ${n + 2}`,
          `${n + 2} \\text{ and } ${n + 3}`,
          `${2 * n} \\text{ and } ${2 * n + 1}`,
        ],
        `$${n}^2 = ${n * n}$ and $${n + 1}^2 = ${(n + 1) ** 2}$.`,
        `$${n}^2 = ${n * n}$，$${n + 1}^2 = ${(n + 1) ** 2}$。`,
      );
    const near = add <= n ? n : n + 1;
    return ask(
      rng,
      `To the nearest whole number, what is $\\sqrt{${v}}$?`,
      `$\\sqrt{${v}}$ 四舍五入到整数是多少？`,
      near,
      [near === n ? n + 1 : n, near + 1 === n + 1 ? n + 2 : near + 1, Math.round(v / 2), near - 1 === n ? n - 1 : near - 1],
      `Compare $${v}$ with $${n}^2$ and $${n + 1}^2$; it is closer to the square of $${near}$.`,
      `比较 $${v}$ 与 $${n}^2$、$${n + 1}^2$；它更接近 $${near}$ 的平方。`,
    );
  }),
  ratioTips("Finding a Whole From a Ratio", "由比求整体", ["reasoning-with-equivalent-ratios"], (rng, hard) => {
    const [a, b, u, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 12), rng.int(1, 5)];
    if (!hard)
      return ask(
        rng,
        `The ratio of cats to dogs at a shelter is $${a} : ${b}$. If there are $${a * u}$ cats, how many cats and dogs are there in all?`,
        `收容所猫与狗的比是 $${a} : ${b}$。若有 $${a * u}$ 只猫，猫和狗共有多少只？`,
        (a + b) * u,
        [b * u, a * u + b, (a + b) * a * u, (a + b) * u + 1],
        `One part is $${u}$, and there are $${a + b}$ parts.`,
        `一份是 $${u}$，共 $${a + b}$ 份。`,
      );
    return ask(
      rng,
      `The ratio of red to blue to green beads is $${a + c} : ${b} : ${c}$. If there are $${(a + 2 * c + b) * u}$ beads in all, how many more red beads are there than green beads?`,
      `红、蓝、绿珠子的比是 $${a + c} : ${b} : ${c}$。若共有 $${(a + 2 * c + b) * u}$ 颗，红珠比绿珠多多少颗？`,
      a * u,
      [(a + c) * u, b * u, (a + 2 * c) * u, a * u + 1],
      `One part is $${u}$, and red has $${a}$ more parts than green.`,
      `一份是 $${u}$，红珠比绿珠多 $${a}$ 份。`,
    );
  }),
  ratioTips("Comparing Ratios", "比较比", ["further-reasoning-with-equivalent-ratios"], (rng, hard) => {
    const [a, b, c, k] = [rng.int(2, 9), rng.int(10, 15), rng.int(2, 9), rng.int(2, 5)];
    const d = rng.int(16, 20);
    const ac = a * d;
    const cb = c * b;
    if (!hard)
      return words(
        rng,
        t(
          `Mix $A$ uses $${a}$ cups of juice for every $${b}$ cups of water, and mix $B$ uses $${k * a}$ cups of juice for every $${k * b}$ cups of water. Which statement is true?`,
          `混合物 $A$ 每 $${b}$ 杯水用 $${a}$ 杯果汁，混合物 $B$ 每 $${k * b}$ 杯水用 $${k * a}$ 杯果汁。哪个说法正确？`,
        ),
        t("The two mixes have the same ratio.", "两种混合物的比相同。"),
        [
          t("Mix $A$ has more juice per cup of water.", "$A$ 每杯水含的果汁更多。"),
          t("Mix $B$ has more juice per cup of water.", "$B$ 每杯水含的果汁更多。"),
          t("The ratios cannot be compared.", "这两个比无法比较。"),
        ],
        t(`Dividing the terms of the second ratio by $${k}$ gives the first.`, `把第二个比的两项除以 $${k}$ 就得到第一个比。`),
      );
    const same = ac === cb;
    const c2 = same ? c + 1 : c;
    const greater = a * d > c2 * b;
    return words(
      rng,
      t(
        `Team $A$ won $${a}$ of $${b}$ games, and team $B$ won $${c2}$ of $${d}$ games. Which team has the higher ratio of wins to games?`,
        `$A$ 队 $${b}$ 场赢 $${a}$ 场，$B$ 队 $${d}$ 场赢 $${c2}$ 场。哪队胜率更高？`,
      ),
      greater ? t("Team $A$", "$A$ 队") : t("Team $B$", "$B$ 队"),
      [
        greater ? t("Team $B$", "$B$ 队") : t("Team $A$", "$A$ 队"),
        t("The ratios are equal.", "两者相等。"),
        t("The team with more games.", "比赛更多的队。"),
      ],
      t(
        `Compare the cross products $${a}(${d}) = ${a * d}$ and $${c2}(${b}) = ${c2 * b}$.`,
        `比较交叉乘积 $${a}(${d}) = ${a * d}$ 和 $${c2}(${b}) = ${c2 * b}$。`,
      ),
    );
  }),
  ratioTips("Solving Fuel Mileage Problems", "解决油耗问题", ["solving-problems-using-unit-rates"], (rng, hard) => {
    const [m, g, p, k] = [rng.int(15, 45), rng.int(2, 20), rng.int(2, 6), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A car travels $${m}$ miles per gallon. How many gallons does it need for a trip of $${m * g}$ miles?`,
        `一辆车每加仑行驶 $${m}$ 英里。行驶 $${m * g}$ 英里需要多少加仑？`,
        g,
        [m * m * g, m + g, g + 1, 2 * g],
        `Divide the distance by the mileage.`,
        `距离除以每加仑里程。`,
      );
    return ask(
      rng,
      `A car travels $${m}$ miles per gallon, and gas costs $\\$${p}$ per gallon. How much does the fuel cost for a trip of $${m * g * k}$ miles, in dollars?`,
      `一辆车每加仑行驶 $${m}$ 英里，油价每加仑 $${p}$ 美元。行驶 $${m * g * k}$ 英里的油费是多少美元？`,
      g * k * p,
      [g * k, m * p, m * g * k * p, g * k * p + p],
      `The trip uses $${g * k}$ gallons.`,
      `这次行程用 $${g * k}$ 加仑。`,
    );
  }),
  rateTips("Working With a Rate of Change", "变化率", ["rates-of-change-in-applied-contexts"], (rng, hard) => {
    const [s, r, h, k] = [rng.int(20, 200), rng.int(2, 15), rng.int(2, 12), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A tank holds $${s}$ gallons, and water is added at $${r}$ gallons per hour. How many gallons are in the tank after $${h}$ hours?`,
        `水箱有 $${s}$ 加仑水，每小时加入 $${r}$ 加仑。$${h}$ 小时后有多少加仑？`,
        s + r * h,
        [r * h, s - r * h, s + r, (s + r) * h],
        `$${s} + ${r}(${h})$.`,
        `$${s} + ${r}(${h})$。`,
      );
    return ask(
      rng,
      `A tank held $${s}$ gallons and held $${s + r * k}$ gallons $${k}$ hours later. If the rate stays the same, how many gallons will it hold $${h}$ hours after the start?`,
      `水箱原有 $${s}$ 加仑，$${k}$ 小时后有 $${s + r * k}$ 加仑。若速率不变，从开始算起 $${h}$ 小时后有多少加仑？`,
      s + r * h,
      [s + r * k + r, s + r * k * h, r * h, s + r * h + k],
      `The rate is $${r}$ gallons per hour.`,
      `速率是每小时 $${r}$ 加仑。`,
    );
  }),
  rateTips(
    "Finding Position or Travel Time",
    "求位置或行驶时间",
    ["speed-distance-time", "units-of-time-and-elapsed-time"],
    (rng, hard) => {
      const [v, h, st, m] = [rng.int(4, 14) * 5, rng.int(2, 8), rng.int(1, 9), rng.pick([15, 30, 45])];
      if (!hard)
        return ask(
          rng,
          `A train travels at $${v}$ miles per hour. How many hours does it take to go $${v * h}$ miles?`,
          `火车每小时行驶 $${v}$ 英里。走 $${v * h}$ 英里需要多少小时？`,
          h,
          [v * v * h, v + h, h + 1, 2 * h],
          `Time is distance divided by rate.`,
          `时间等于距离除以速度。`,
        );
      const end = st * 60 + h * 60 + m;
      const hh = Math.floor(end / 60);
      const mm = end % 60;
      const fmt = (a: number, b: number) => `${a}{:}${b === 0 ? "00" : b}`;
      return ask(
        rng,
        `A bus leaves at $${st}{:}00$, and the trip takes $${h}$ hours and $${m}$ minutes. Using a $24$-hour clock, at what time does it arrive?`,
        `公共汽车 $${st}{:}00$ 出发，行程 $${h}$ 小时 $${m}$ 分钟。按 $24$ 小时制，它几点到达？`,
        fmt(hh, mm),
        [fmt(hh + 1, mm), fmt(hh, (mm + 15) % 60), fmt(hh - 1, mm), fmt(st + h, (m + 30) % 60), fmt(hh + 2, mm)],
        `Add the hours, then the minutes.`,
        `先加小时，再加分钟。`,
      );
    },
  ),
  rateTips("Finding an Average Speed", "求平均速度", ["further-speed-distance-time"], (rng, hard) => {
    const [d, h, v1, v2, t1, t2] = [
      rng.int(4, 12) * 10,
      rng.int(2, 8),
      rng.int(6, 12) * 5,
      rng.int(2, 5) * 5,
      rng.int(1, 4),
      rng.int(1, 4),
    ];
    if (!hard)
      return ask(
        rng,
        `A cyclist rides $${d * h}$ miles in $${h}$ hours. What is the average speed, in miles per hour?`,
        `骑手 $${h}$ 小时骑了 $${d * h}$ 英里。平均速度是每小时多少英里？`,
        d,
        [d * h, d + h, Q.of(h, d), d + 10],
        `Divide the distance by the time.`,
        `距离除以时间。`,
      );
    return ask(
      rng,
      `A car travels at $${v1}$ miles per hour for $${t1}$ hours and at $${v2}$ miles per hour for $${t2}$ hours. What is its average speed for the whole trip, in miles per hour?`,
      `汽车以每小时 $${v1}$ 英里行驶 $${t1}$ 小时，再以每小时 $${v2}$ 英里行驶 $${t2}$ 小时。全程平均速度是每小时多少英里？`,
      Q.of(v1 * t1 + v2 * t2, t1 + t2),
      [
        Q.of(v1 + v2, 2).eq(Q.of(v1 * t1 + v2 * t2, t1 + t2)) ? Q.of(v1 + v2 + 5, 2) : Q.of(v1 + v2, 2),
        Q.of(v1 * t1 + v2 * t2, 2),
        v1 * t1 + v2 * t2,
        Q.of(v1 * t1 + v2 * t2 + 5, t1 + t2),
      ],
      `Divide the total distance $${v1 * t1 + v2 * t2}$ by the total time $${t1 + t2}$.`,
      `总距离 $${v1 * t1 + v2 * t2}$ 除以总时间 $${t1 + t2}$。`,
    );
  }),
  rateTips("Solving Multi-Leg Speed Problems", "解决多段速度问题", ["further-speed-distance-time"], (rng, hard) => {
    const [v, h, w, k] = [rng.int(6, 14) * 5, rng.int(1, 5), rng.int(4, 12) * 5, rng.int(1, 4)];
    if (!hard)
      return ask(
        rng,
        `A driver goes $${v}$ miles per hour for $${h}$ hours and then $${w}$ miles per hour for $${k}$ hours. How many miles does the driver go in all?`,
        `司机以每小时 $${v}$ 英里开 $${h}$ 小时，再以每小时 $${w}$ 英里开 $${k}$ 小时。共开了多少英里？`,
        v * h + w * k,
        [(v + w) * (h + k), v * h, w * k, v * k + w * h === v * h + w * k ? v * h + w * k + 5 : v * k + w * h],
        `Add the two distances.`,
        `把两段距离相加。`,
      );
    return ask(
      rng,
      `A trip of $${v * h + w * k}$ miles has two legs. The first takes $${h}$ hours at $${v}$ miles per hour. If the second leg is driven at $${w}$ miles per hour, how many hours does it take?`,
      `$${v * h + w * k}$ 英里的行程分两段。第一段以每小时 $${v}$ 英里走 $${h}$ 小时。第二段以每小时 $${w}$ 英里行驶，需要多少小时？`,
      k,
      [h, k + 1, h + k, Q.of(v * h + w * k, w)],
      `The second leg is $${w * k}$ miles.`,
      `第二段是 $${w * k}$ 英里。`,
    );
  }),
  rateTips("Combining Rates", "合并速率", ["work-problems"], (rng, hard) => {
    const [a, b, c, h] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 9), rng.int(2, 9)];
    const [p, q] = rng.pick([
      [3, 6],
      [4, 12],
      [6, 12],
      [10, 15],
      [12, 24],
      [6, 3],
      [12, 4],
      [20, 30],
      [8, 24],
      [5, 20],
    ] as const);
    if (!hard)
      return ask(
        rng,
        `One machine makes $${a}$ parts per minute and another makes $${b}$ parts per minute. Working together, how many parts do they make in $${c * h}$ minutes?`,
        `一台机器每分钟做 $${a}$ 个零件，另一台每分钟做 $${b}$ 个。一起工作 $${c * h}$ 分钟做多少个？`,
        (a + b) * c * h,
        [a * b * c * h, a * c * h, (a + b) * h, (a + b) * c * h + 1],
        `Their combined rate is $${a + b}$ parts per minute.`,
        `合起来每分钟 $${a + b}$ 个。`,
      );
    return ask(
      rng,
      `One pump fills a tank in $${p}$ hours, and another fills the same tank in $${q}$ hours. Working together, how many hours do they take to fill $${c}$ such tanks?`,
      `一台泵 $${p}$ 小时注满水箱，另一台 $${q}$ 小时注满同样的水箱。两台一起注满 $${c}$ 个这样的水箱要多少小时？`,
      Q.of(p * q * c, p + q),
      [Q.of((p + q) * c, 2), (p + q) * c, Q.of(c, p + q), Q.of(p * q * c + 1, p + q)],
      `The rates add: $\\frac{1}{${p}} + \\frac{1}{${q}} = \\frac{${p + q}}{${p * q}}$.`,
      `效率相加：$\\frac{1}{${p}} + \\frac{1}{${q}} = \\frac{${p + q}}{${p * q}}$。`,
    );
  }),
  partTips("Finding a Percent in a Mixture", "求混合物中的百分比", ["percent-of-a-number"], (rng, hard) => {
    const [a, b, u, p, q] = [rng.int(1, 9), rng.int(1, 9), rng.int(2, 6), rng.int(2, 8) * 5, rng.int(2, 8) * 5];
    if (!hard)
      return ask(
        rng,
        `A $${a + b}0$-ounce drink has $${a}0$ ounces of juice. What percent of the drink is juice?`,
        `$${a + b}0$ 盎司的饮料含 $${a}0$ 盎司果汁。果汁占百分之几？`,
        Q.of(100 * a, a + b),
        [a, Q.of(100 * b, a + b), Q.of(100 * a, b), Q.of(100 * a, a + b).add(Q.of(5))],
        `Divide the part by the whole, and then multiply by $100$.`,
        `部分除以整体，再乘 $100$。`,
      );
    const liters = u * 20;
    return ask(
      rng,
      `$${liters}$ liters of a $${p}\\%$ salt solution is mixed with $${liters}$ liters of a $${q}\\%$ salt solution. What is the percent of salt in the mixture?`,
      `$${liters}$ 升 $${p}\\%$ 的盐水与 $${liters}$ 升 $${q}\\%$ 的盐水混合。混合物中盐占百分之几？`,
      Q.of(p + q, 2),
      [p + q, Math.max(p, q) + 5, Math.min(p, q) - 5, Q.of(p + q, 2).add(Q.of(5))],
      `Equal amounts give the mean of the two percents.`,
      `等量混合时，浓度是两个百分比的平均数。`,
    );
  }),
  rateTips("Converting a Rate", "换算速率", ["unit-conversions-using-units-of-time"], (rng, hard) => {
    const [v, w, k] = [rng.int(1, 30) * 60, rng.int(1, 20) * 5, rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `A runner covers $${v}$ feet per minute. How many feet is that per second?`,
        `跑者每分钟跑 $${v}$ 英尺。每秒是多少英尺？`,
        v / 60,
        [v * 60, v, v / 60 + 1, v / 30],
        `Divide by $60$ seconds per minute.`,
        `除以每分钟 $60$ 秒。`,
      );
    return ask(
      rng,
      `A machine fills $${w}$ bottles per minute. How many bottles does it fill in $${k}$ hours?`,
      `机器每分钟装 $${w}$ 瓶。$${k}$ 小时装多少瓶？`,
      w * 60 * k,
      [w * k, w * 60, Q.of(w * k, 60), w * 3600 * k],
      `There are $${60 * k}$ minutes in $${k}$ hours.`,
      `$${k}$ 小时有 $${60 * k}$ 分钟。`,
    );
  }),
  moneyTips("Computing a Total From Unit Prices", "由单价计算总价", ["working-with-unit-prices"], (rng, hard) => {
    const [a, b, n, m] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 12), rng.int(2, 12)];
    const [c, l] = [rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Pens cost $\\$${a}$ each and notebooks cost $\\$${b}$ each. What is the total cost, in dollars, of $${n}$ pens and $${m}$ notebooks?`,
        `钢笔每支 $${a}$ 美元，笔记本每本 $${b}$ 美元。$${n}$ 支钢笔和 $${m}$ 本笔记本共多少美元？`,
        a * n + b * m,
        [(a + b) * (n + m), a * m + b * n === a * n + b * m ? a * n + b * m + 1 : a * m + b * n, a * n, a + b + n + m],
        `$${n}(${a}) + ${m}(${b})$.`,
        `$${n}(${a}) + ${m}(${b})$。`,
      );
    return ask(
      rng,
      `Pens cost $\\$${a}$ each, notebooks $\\$${b}$ each and folders $\\$${c}$ each. What is the total cost, in dollars, of $${n}$ pens, $${m}$ notebooks and $${l}$ folders?`,
      `钢笔每支 $${a}$ 美元，笔记本每本 $${b}$ 美元，文件夹每个 $${c}$ 美元。$${n}$ 支钢笔、$${m}$ 本笔记本和 $${l}$ 个文件夹共多少美元？`,
      a * n + b * m + c * l,
      [(a + b + c) * (n + m + l), a * n + b * m, a + b + c, a * n + b * m + c * l + c],
      `Add the three products.`,
      `把三个积相加。`,
    );
  }),
  moneyTips(
    "Finding a Total From Repeated Amounts",
    "由重复量求总量",
    ["solving-multistep-word-problems-using-number-operations"],
    (rng, hard) => {
      const [a, w, d, n] = [rng.int(3, 25), rng.int(2, 8), rng.int(2, 7), rng.int(5, 40)];
      if (!hard)
        return ask(
          rng,
          `A bakery sells $${a}$ loaves each day. How many loaves does it sell in $${w}$ weeks if it is open $7$ days a week?`,
          `面包店每天卖 $${a}$ 条面包。每周开 $7$ 天，$${w}$ 周卖多少条？`,
          7 * a * w,
          [a * w, 7 * a, 7 * w, 7 * a * w + a],
          `There are $${7 * w}$ days in all.`,
          `共 $${7 * w}$ 天。`,
        );
      return ask(
        rng,
        `A student reads $${a}$ pages a day for $${d}$ days each week, plus $${n}$ extra pages each weekend. How many pages does the student read in $${w}$ weeks?`,
        `学生每周读 $${d}$ 天，每天 $${a}$ 页，每个周末再多读 $${n}$ 页。$${w}$ 周读多少页？`,
        (a * d + n) * w,
        [a * d * w + n, a * d * w, (a + n) * d * w, (a * d + n) * w + a],
        `Each week has $${a * d + n}$ pages.`,
        `每周 $${a * d + n}$ 页。`,
      );
    },
  ),
  moneyTips("Computing a Cost From a Unit Rate", "由单位率计算费用", ["solving-multi-step-unit-price-problems"], (rng, hard) => {
    const [n, k, u, f] = [rng.int(2, 9), rng.int(2, 12), rng.int(2, 9), rng.int(5, 40)];
    if (!hard)
      return ask(
        rng,
        `$${n}$ pounds of apples cost $\\$${n * u}$. At this rate, how much do $${k}$ pounds cost, in dollars?`,
        `$${n}$ 磅苹果 $${n * u}$ 美元。按这个价格，$${k}$ 磅多少美元？`,
        k * u,
        [n * k * u, k + u, u, k * u + n],
        `The price is $\\$${u}$ per pound.`,
        `每磅 $${u}$ 美元。`,
      );
    return ask(
      rng,
      `A plumber charges a flat fee of $\\$${f}$. A job taking $${n}$ hours costs $\\$${f + n * u * 5}$ in all. At the same hourly rate, how much does a job taking $${k}$ hours cost, in dollars?`,
      `水管工收固定费 $${f}$ 美元。$${n}$ 小时的工作共 $${f + n * u * 5}$ 美元。按相同的时薪，$${k}$ 小时的工作多少美元？`,
      f + k * u * 5,
      [k * u * 5, Q.of((f + n * u * 5) * k, n), f + k * u, f + k * u * 5 + f],
      `The hourly rate is $\\$${u * 5}$, and the fee is charged once.`,
      `时薪是 $${u * 5}$ 美元，固定费只收一次。`,
    );
  }),
  moneyTips(
    "Finding a Remaining Amount",
    "求剩余量",
    ["further-solving-multistep-word-problems-using-the-four-operations"],
    (rng, hard) => {
      const [t0, a, n, b, m] = [rng.int(200, 400), rng.int(3, 12), rng.int(2, 8), rng.int(2, 9), rng.int(2, 8)];
      if (!hard)
        return ask(
          rng,
          `A student has $\\$${t0}$ and buys $${n}$ shirts at $\\$${a}$ each. How much money is left, in dollars?`,
          `学生有 $${t0}$ 美元，买 $${n}$ 件衬衫，每件 $${a}$ 美元。还剩多少美元？`,
          t0 - n * a,
          [n * a, t0 - a, t0 + n * a, t0 - n * a - a],
          `Subtract the $${n * a}$ spent.`,
          `减去花掉的 $${n * a}$。`,
        );
      return ask(
        rng,
        `A student has $\\$${t0}$, buys $${n}$ shirts at $\\$${a}$ each and $${m}$ caps at $\\$${b}$ each. How much money is left, in dollars?`,
        `学生有 $${t0}$ 美元，买 $${n}$ 件衬衫每件 $${a}$ 美元，再买 $${m}$ 顶帽子每顶 $${b}$ 美元。还剩多少美元？`,
        t0 - n * a - m * b,
        [n * a + m * b, t0 - n * a, t0 - (n + m) * (a + b), t0 - n * a - m * b + b],
        `The student spends $${n * a + m * b}$ in all.`,
        `一共花 $${n * a + m * b}$。`,
      );
    },
  ),
  moneyTips("Comparing Two Totals", "比较两个总量", ["numerical-word-problems"], (rng, hard) => {
    const [a, b, n, f, g] = [rng.int(5, 15), rng.int(16, 25), rng.int(3, 12), rng.int(5, 30), rng.int(31, 70)];
    if (!hard)
      return ask(
        rng,
        `Plan $A$ costs $\\$${a}$ per month, and plan $B$ costs $\\$${b}$ per month. How much more does plan $B$ cost over $${n}$ months, in dollars?`,
        `方案 $A$ 每月 $${a}$ 美元，方案 $B$ 每月 $${b}$ 美元。$${n}$ 个月方案 $B$ 多花多少美元？`,
        (b - a) * n,
        [b * n, a * n, b - a, (b - a) * n + n],
        `The monthly difference is $\\$${b - a}$.`,
        `每月差 $${b - a}$ 美元。`,
      );
    return ask(
      rng,
      `Plan $A$ has a $\\$${g}$ start fee and costs $\\$${a}$ per month. Plan $B$ has a $\\$${f}$ start fee and costs $\\$${b}$ per month. Over $${n}$ months, what is the difference between the total costs, in dollars?`,
      `方案 $A$ 开通费 $${g}$ 美元，每月 $${a}$ 美元。方案 $B$ 开通费 $${f}$ 美元，每月 $${b}$ 美元。$${n}$ 个月两者总费用相差多少美元？`,
      Math.abs(g + a * n - f - b * n),
      [(b - a) * n, g - f, g + a * n + f + b * n, Math.abs(g + a * n - f - b * n) + n],
      `The totals are $${g + a * n}$ and $${f + b * n}$.`,
      `总费用是 $${g + a * n}$ 和 $${f + b * n}$。`,
    );
  }),
  moneyTips("Finding a Net Cost or Profit", "求净成本或利润", ["percentages-in-commerce-and-finance"], (rng, hard) => {
    const [c, p, n, f, d] = [rng.int(2, 9), rng.int(10, 25), rng.int(5, 40), rng.int(20, 90), rng.pick([10, 20, 25, 50])];
    if (!hard)
      return ask(
        rng,
        `A vendor buys $${n}$ items at $\\$${c}$ each and sells them all at $\\$${p}$ each. What is the profit, in dollars?`,
        `小贩以每件 $${c}$ 美元买入 $${n}$ 件，全部以每件 $${p}$ 美元卖出。利润是多少美元？`,
        n * (p - c),
        [n * p, n * c, n * (p + c), p - c],
        `The profit per item is $\\$${p - c}$.`,
        `每件利润 $${p - c}$ 美元。`,
      );
    return ask(
      rng,
      `A vendor buys $${n * 4}$ items at $\\$${c}$ each and pays a $\\$${f}$ table fee. The vendor sells all the items at a list price of $\\$${p * 20}$ each, less a discount of $${d}\\%$. What is the profit, in dollars?`,
      `小贩以每件 $${c}$ 美元买入 $${n * 4}$ 件，并付 $${f}$ 美元摊位费。全部按标价每件 $${p * 20}$ 美元减 $${d}\\%$ 折扣卖出。利润是多少美元？`,
      n * 4 * ((p * (100 - d)) / 5 - c) - f,
      [n * 4 * (p * 20 - c) - f, n * 4 * ((p * (100 - d)) / 5 - c), n * 4 * ((p * d) / 5 - c) - f, n * 4 * ((p * (100 - d)) / 5) - f],
      `Each item sells for $\\$${(p * (100 - d)) / 5}$ after the discount.`,
      `折后每件售价 $${(p * (100 - d)) / 5}$ 美元。`,
    );
  }),
  moneyTips("Computing Overtime Pay", "计算加班工资", ["multistep-numerical-word-problems"], (rng, hard) => {
    const [r, o, h] = [rng.int(5, 20) * 2, rng.int(2, 15), rng.int(30, 39)];
    if (!hard)
      return ask(
        rng,
        `A worker earns $\\$${r}$ per hour for the first $40$ hours and time-and-a-half after that. How much does the worker earn for $${40 + o}$ hours, in dollars?`,
        `工人前 $40$ 小时每小时 $${r}$ 美元，之后按 $1.5$ 倍计算。工作 $${40 + o}$ 小时赚多少美元？`,
        40 * r + (o * 3 * r) / 2,
        [(40 + o) * r, 40 * r + o * r * 2, ((40 + o) * 3 * r) / 2, 40 * r + o],
        `Overtime pays $\\$${(3 * r) / 2}$ per hour.`,
        `加班每小时 $${(3 * r) / 2}$ 美元。`,
      );
    return ask(
      rng,
      `A worker earns $\\$${r}$ per hour for the first $${h}$ hours and double that afterward. If the worker earned $\\$${h * r + 2 * o * r}$ one week, how many hours did the worker work?`,
      `工人前 $${h}$ 小时每小时 $${r}$ 美元，之后按双倍计算。某周赚 $${h * r + 2 * o * r}$ 美元，工作了多少小时？`,
      h + o,
      [h + 2 * o, o, h, h + o + 1],
      `Overtime pay of $\\$${2 * o * r}$ is $${o}$ hours at $\\$${2 * r}$.`,
      `加班费 $${2 * o * r}$ 美元相当于 $${o}$ 小时，每小时 $${2 * r}$ 美元。`,
    );
  }),
  moneyTips("Finding a Unit Amount", "求单位量", ["unit-prices-and-speed"], (rng, hard) => {
    const [u, n, k, f] = [rng.int(2, 20), rng.int(3, 20), rng.int(2, 9), rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `$${n}$ identical tickets cost $\\$${u * n}$ in all. What is the price of one ticket, in dollars?`,
        `$${n}$ 张相同的票共 $${u * n}$ 美元。一张票多少美元？`,
        u,
        [u * n - n, u + n, u + 1, 2 * u],
        `Divide the cost by $${n}$.`,
        `总价除以 $${n}$。`,
      );
    return ask(
      rng,
      `$${n}$ identical tickets and a $\\$${f}$ handling fee cost $\\$${u * n + f}$ in all. What is the price of $${k}$ tickets, in dollars?`,
      `$${n}$ 张相同的票加 $${f}$ 美元手续费共 $${u * n + f}$ 美元。$${k}$ 张票多少美元？`,
      u * k,
      [u * k + f, Q.of((u * n + f) * k, n), u, u * k + k],
      `Remove the fee first, and then each ticket costs $\\$${u}$.`,
      `先去掉手续费，每张票 $${u}$ 美元。`,
    );
  }),
  partTips("Finding a Fractional Part of a Whole", "求整体的几分之几", ["fractions-of-fractions"], (rng, hard) => {
    const [a, b, u, k] = [rng.int(1, 8), rng.int(2, 9), rng.int(2, 20), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `What is $\\frac{${a}}{${b}}$ of $${b * u}$?`,
        `$${b * u}$ 的 $\\frac{${a}}{${b}}$ 是多少？`,
        a * u,
        [u, b * u - a, a * b * u, a * u + 1],
        `One $${b}$th of $${b * u}$ is $${u}$.`,
        `$${b * u}$ 的 $${b}$ 分之一是 $${u}$。`,
      );
    return ask(
      rng,
      `$\\frac{${a}}{${b}}$ of a number is $${a * u * k}$. What is the number?`,
      `一个数的 $\\frac{${a}}{${b}}$ 是 $${a * u * k}$。这个数是多少？`,
      b * u * k,
      [Q.of(a * a * u * k, b), a * u * k, u * k, b * u * k + 1],
      `One part is $${u * k}$, and there are $${b}$ parts.`,
      `一份是 $${u * k}$，共 $${b}$ 份。`,
    );
  }),
  partTips("Applying Successive Fractions", "连续应用分数", ["fractions-of-fractions-with-algebraic-expressions"], (rng, hard) => {
    const [a, b, u, k] = [rng.int(1, 3), rng.int(4, 6), rng.int(2, 9), rng.int(2, 5)];
    const whole = b * k * u;
    if (!hard)
      return ask(
        rng,
        `A class has $${whole}$ students. $\\frac{1}{${b}}$ of them walk to school, and $\\frac{1}{${k}}$ of the walkers walk with a friend. How many walk with a friend?`,
        `班里有 $${whole}$ 名学生。$\\frac{1}{${b}}$ 走路上学，走路的学生中 $\\frac{1}{${k}}$ 与朋友同行。多少人与朋友同行？`,
        u,
        [k * u, b * u, whole - u, u + 1],
        `$\\frac{1}{${k}} \\cdot \\frac{1}{${b}} \\cdot ${whole}$.`,
        `$\\frac{1}{${k}} \\cdot \\frac{1}{${b}} \\cdot ${whole}$。`,
      );
    const spent = a * k * u;
    const left = whole - spent;
    return ask(
      rng,
      `A student has $\\$${whole * k}$, spends $\\frac{${a}}{${b}}$ of it, and then spends $\\frac{1}{${k}}$ of what remains. How much is left, in dollars?`,
      `学生有 $${whole * k}$ 美元，花掉 $\\frac{${a}}{${b}}$，再花掉剩余部分的 $\\frac{1}{${k}}$。还剩多少美元？`,
      left * k - left,
      [left * k, whole * k - left, left, left * k - left + k],
      `After the first purchase, $\\$${left * k}$ remains, and $\\frac{1}{${k}}$ of that is $\\$${left}$.`,
      `第一次之后剩 $${left * k}$ 美元，它的 $\\frac{1}{${k}}$ 是 $${left}$ 美元。`,
    );
  }),
  partTips("Packing Into Whole Groups", "装成整组", ["division-of-whole-numbers-with-decimal-quotients-and-rounding"], (rng, hard) => {
    const [g, q, r] = [rng.int(4, 15), rng.int(3, 15), rng.int(1, 3)];
    const n = g * q + r;
    if (!hard)
      return ask(
        rng,
        `A van holds $${g}$ people. What is the fewest vans needed to carry $${n}$ people?`,
        `一辆面包车可坐 $${g}$ 人。运 $${n}$ 人至少要多少辆？`,
        q + 1,
        [q, q + 2, n - g, r],
        `$${q}$ vans carry $${g * q}$, so $${r}$ more people need another van.`,
        `$${q}$ 辆运 $${g * q}$ 人，还有 $${r}$ 人需要再一辆。`,
      );
    return ask(
      rng,
      `Cookies are packed in full boxes of $${g}$, and leftover cookies are not boxed. If a bakery has $${n}$ cookies, how many complete boxes can it fill, and how many cookies are left?`,
      `饼干按每盒 $${g}$ 块装满，不足一盒的不装。面包店有 $${n}$ 块饼干，能装满多少盒，剩多少块？`,
      `${q} \\text{ boxes}, ${r} \\text{ left}`,
      [
        `${q + 1} \\text{ boxes}, ${r} \\text{ left}`,
        `${q} \\text{ boxes}, ${r + 1} \\text{ left}`,
        `${q + 1} \\text{ boxes}, 0 \\text{ left}`,
        `${q - 1} \\text{ boxes}, ${r} \\text{ left}`,
      ],
      `$${n} = ${g}(${q}) + ${r}$.`,
      `$${n} = ${g}(${q}) + ${r}$。`,
    );
  }),
  partTips("Finding Counts From Waste and Limits", "由损耗和限制求数量", ["multistep-numerical-word-problems"], (rng, hard) => {
    const [L, c, w, b, cap] = [rng.int(5, 20), rng.int(2, 6), rng.int(1, 4) * 10, rng.int(2, 9), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `A board is $${L * c}$ feet long. How many $${c}$-foot pieces can be cut from $${b}$ such boards?`,
        `一块木板长 $${L * c}$ 英尺。$${b}$ 块这样的木板能切出多少段 $${c}$ 英尺的木料？`,
        L * b,
        [L, L * c * b, L + b, L * b + 1],
        `Each board gives $${L}$ pieces.`,
        `每块木板出 $${L}$ 段。`,
      );
    const start = L * 10 * 10;
    const kept = (start * (100 - w)) / 100;
    const count = Math.floor(kept / cap);
    return ask(
      rng,
      `A factory makes $${start}$ parts, and $${w}\\%$ are rejected as waste. The good parts are shipped in full crates of $${cap}$. How many full crates are shipped?`,
      `工厂生产 $${start}$ 个零件，$${w}\\%$ 作为废品被剔除。合格品按每箱 $${cap}$ 个整箱发运。发运多少整箱？`,
      count,
      [Math.floor(start / cap), Math.floor((start * w) / 100 / cap), count + 1, kept],
      `$${kept}$ good parts remain, and then divide by $${cap}$ and drop any remainder.`,
      `剩下 $${kept}$ 个合格品，再除以 $${cap}$，舍去余数。`,
    );
  }),
  rateTips("Combining Segments of a Trip", "合并行程的各段", ["speed-distance-time"], (rng, hard) => {
    const [a, b, c, h] = [rng.int(5, 80), rng.int(5, 80), rng.int(5, 80), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A delivery route has legs of $${a}$, $${b}$ and $${c}$ miles. What is its total length, in miles?`,
        `送货路线分为 $${a}$、$${b}$、$${c}$ 英里三段。总长是多少英里？`,
        a + b + c,
        [a + b, b + c, a + b + c + 5, 2 * (a + b)],
        `Add the legs.`,
        `把各段相加。`,
      );
    return ask(
      rng,
      `A delivery route has legs of $${a * h}$, $${b * h}$ and $${c * h}$ miles, and the van averages $${h}$ miles every minute. How many minutes does the route take?`,
      `送货路线分为 $${a * h}$、$${b * h}$、$${c * h}$ 英里三段，货车平均每分钟 $${h}$ 英里。全程要多少分钟？`,
      a + b + c,
      [(a + b + c) * h, a + b, a + b + c + h, (a + b + c) * h * h],
      `The total is $${(a + b + c) * h}$ miles, and then divide by $${h}$.`,
      `总长 $${(a + b + c) * h}$ 英里，再除以 $${h}$。`,
    );
  }),
  partTips("Identifying a Necessary Conclusion", "判断必然结论", ["necessary-and-sufficient-conditions"], (rng, hard) => {
    const [n, k] = [rng.int(10, 60), rng.int(2, 9)];
    const [subject, zhSubject] = rng.pick([
      ["club", "俱乐部"],
      ["team", "球队"],
      ["band", "乐队"],
    ] as const);
    if (!hard)
      return words(
        rng,
        t(
          `Every member of a ${subject} of $${n}$ people plays chess. Pat is a member. Which statement must be true?`,
          `有 $${n}$ 人的${zhSubject}中每个成员都下棋。Pat 是成员。哪个说法一定正确？`,
        ),
        t("Pat plays chess.", "Pat 下棋。"),
        [
          t("Everyone who plays chess is a member.", "每个下棋的人都是成员。"),
          t("Pat plays chess better than most.", "Pat 比大多数人下得好。"),
          t("Only members play chess.", "只有成员才下棋。"),
        ],
        t(
          "The statement applies to every member, and it says nothing about people outside the group.",
          "这句话适用于每个成员，但没有说明群体以外的人。",
        ),
      );
    return words(
      rng,
      t(
        `If a whole number greater than $${n}$ is divisible by $${2 * k}$, which statement about that number must be true?`,
        `如果一个大于 $${n}$ 的整数能被 $${2 * k}$ 整除，关于这个数哪个说法一定正确？`,
      ),
      t(`It is divisible by $${k}$.`, `它能被 $${k}$ 整除。`),
      [
        t(`It is divisible by $${4 * k}$.`, `它能被 $${4 * k}$ 整除。`),
        t(`It is divisible by $${k + 1 === 2 ? k + 2 : 2 * k + 1}$.`, `它能被 $${k + 1 === 2 ? k + 2 : 2 * k + 1}$ 整除。`),
        t(`It is odd.`, `它是奇数。`),
      ],
      t(
        `A multiple of $${2 * k}$ is also a multiple of each factor of $${2 * k}$, and $${k}$ is one of those factors.`,
        `$${2 * k}$ 的倍数也是 $${2 * k}$ 每个因数的倍数，而 $${k}$ 是其中之一。`,
      ),
    );
  }),
  statTips("Finding a Value From a Mean", "由平均数求值", ["mean-of-a-data-set"], (rng, hard) => {
    const [i, j, l, m] = [rng.int(-8, 8), rng.int(-8, 8), rng.int(-8, 8), rng.int(70, 75)];
    const [a, b, c] = [m + i, m + j, m + l];
    const e = rng.int(2, 6);
    if (!hard)
      return ask(
        rng,
        `A student's three scores are $${a}$, $${b}$ and $${c}$, and the student's mean after a fourth test is $${m}$. What is the fourth score?`,
        `学生三次成绩是 $${a}$、$${b}$、$${c}$，第四次考试后平均分是 $${m}$。第四次成绩是多少？`,
        4 * m - a - b - c,
        [m, 3 * m - a - b - c, 4 * m, 4 * m - a - b - c + 1],
        `The four scores must total $${4 * m}$.`,
        `四次成绩总和必须是 $${4 * m}$。`,
      );
    return ask(
      rng,
      `A group of $${e + 3}$ numbers has a mean of $${m}$. When one number is removed, the mean of the rest is $${m - e}$. What number was removed?`,
      `$${e + 3}$ 个数的平均数是 $${m}$。去掉一个数后，其余数的平均数是 $${m - e}$。去掉的数是多少？`,
      (e + 3) * m - (e + 2) * (m - e),
      [m, e, (e + 3) * m, (e + 3) * m - (e + 2) * (m - e) + 1],
      `The total falls from $${(e + 3) * m}$ to $${(e + 2) * (m - e)}$.`,
      `总和从 $${(e + 3) * m}$ 降到 $${(e + 2) * (m - e)}$。`,
    );
  }),
  statTips("Finding a Difference of Center Measures", "求集中量数之差", ["comparing-medians"], (rng, hard) => {
    const base = rng.int(2, 10);
    const steps = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)] as const;
    const xs = [
      base,
      base + steps[0],
      base + steps[0] + steps[1],
      base + steps[0] + steps[1] + steps[2],
      base + steps[0] + steps[1] + steps[2] + steps[3],
    ];
    const sum = xs.reduce((p, c) => p + c, 0);
    const med = sortedOf(xs)[2] ?? 0;
    const shown = rng.shuffle(xs).join(", ");
    const extra = rng.int(10, 30);
    if (!hard)
      return ask(
        rng,
        `What is the median of $${shown}$?`,
        `$${shown}$ 的中位数是多少？`,
        med,
        [Q.of(sum, 5).eq(Q.of(med)) ? med + 1 : Q.of(sum, 5), xs[1] ?? 0, xs[3] ?? 0, med + 2],
        `Sort the numbers and take the middle one.`,
        `排序后取中间的数。`,
      );
    const big = (xs[4] ?? 0) + extra;
    return ask(
      rng,
      `The largest value of the data set $${shown}$ is increased by $${extra}$. By how much does the mean increase?`,
      `数据集 $${shown}$ 的最大值增加 $${extra}$。平均数增加多少？`,
      Q.of(extra, 5),
      [extra, 0, Q.of(extra, 4), Q.of(big, 5)],
      `The total rises by $${extra}$, shared among $5$ values, while the median stays at $${med}$.`,
      `总和增加 $${extra}$，由 $5$ 个值分摊，而中位数仍是 $${med}$。`,
    );
  }),
  shapeTips("Finding the Area of a Square", "求正方形的面积", ["area-of-rectangles-and-squares"], (rng, hard) => {
    const s = rng.int(2, 30);
    const k = rng.int(2, 6);
    if (!hard)
      return ask(
        rng,
        `What is the area of a square with side length $${s}$?`,
        `边长 $${s}$ 的正方形面积是多少？`,
        s * s,
        [4 * s, 2 * s, s * s + s, s],
        `Multiply the side by itself.`,
        `边长乘边长。`,
      );
    return ask(
      rng,
      `A square has a perimeter of $${4 * s * k}$. What is its area?`,
      `正方形周长 $${4 * s * k}$。面积是多少？`,
      s * s * k * k,
      [4 * s * k, s * k, 16 * s * s * k * k, s * s * k * k + s],
      `Each side is $${s * k}$.`,
      `每边长 $${s * k}$。`,
    );
  }),
  shapeTips("Finding the Area of a Triangle", "求三角形的面积", ["areas-of-triangles"], (rng, hard) => {
    const [b, h, k] = [rng.int(1, 15) * 2, rng.int(2, 20), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the area of a triangle with base $${b}$ and height $${h}$?`,
        `底 $${b}$、高 $${h}$ 的三角形面积是多少？`,
        (b * h) / 2,
        [b * h, b + h, 2 * (b + h), (b * h) / 2 + 2],
        `$\\frac{1}{2}(${b})(${h})$.`,
        `$\\frac{1}{2}(${b})(${h})$。`,
        heightFigure(`${b}`, `${h}`),
      );
    return ask(
      rng,
      `A right triangle has legs of length $${b}$ and $${k * h}$. What is its area?`,
      `直角三角形两直角边长为 $${b}$ 和 $${k * h}$。面积是多少？`,
      (b * k * h) / 2,
      [b * k * h, b + k * h, (b * h) / 2, (b * k * h) / 2 + k],
      `The legs serve as base and height.`,
      `两条直角边就是底和高。`,
      polyFigure(rightPts(b, k * h), { s: [`${k * h}`, `${b}`, null], right: 1 }),
    );
  }),
  shapeTips(
    "Finding a Side From Equal Areas",
    "由相等面积求边",
    ["finding-side-lengths-of-squares-and-cubes-from-area-or-volume"],
    (rng, hard) => {
      const [a, u, s] = [rng.int(2, 6), rng.int(2, 8), rng.int(2, 20)];
      if (!hard)
        return ask(
          rng,
          `A rectangle measuring $${a * a * s}$ by $${s}$ has the same area as a square with side $x$. What is $x$?`,
          `长 $${a * a * s}$、宽 $${s}$ 的长方形与边长为 $x$ 的正方形面积相等。$x$ 是多少？`,
          a * s,
          [a * a * s, s, a * s + 1, a * a * s * s],
          `The area is $${a * a * s * s}$, so $x = ${a * s}$.`,
          `面积是 $${a * a * s * s}$，所以 $x = ${a * s}$。`,
        );
      return ask(
        rng,
        `A triangle with base $${2 * a * u}$ and height $${s * u}$ has the same area as a rectangle of width $${u}$. What is the rectangle's length?`,
        `底 $${2 * a * u}$、高 $${s * u}$ 的三角形与宽 $${u}$ 的长方形面积相等。长方形的长是多少？`,
        a * s * u,
        [2 * a * s * u, a * s, a * s * u * u, a * s * u + 1],
        `The area is $${a * s * u * u}$, and divide by the width $${u}$.`,
        `面积是 $${a * s * u * u}$，再除以宽 $${u}$。`,
      );
    },
  ),
  shapeTips("Combining Rectangle Areas", "合并长方形面积", ["composite-shapes"], (rng, hard) => {
    const [a, b, c, d, e, f] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 15), rng.int(2, 15), rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A floor consists of a $${a}$ by $${b}$ room and a $${c}$ by $${d}$ room. What is the total floor area?`,
        `地面由 $${a}$ 乘 $${b}$ 和 $${c}$ 乘 $${d}$ 两个房间组成。总面积是多少？`,
        a * b + c * d,
        [(a + c) * (b + d), a + b + c + d, a * b, c * d],
        `Add the two areas.`,
        `把两个面积相加。`,
      );
    return ask(
      rng,
      `A floor consists of a $${a + e}$ by $${b + f}$ room and a $${c}$ by $${d}$ room. A $${e}$ by $${f}$ closet inside the first room is not carpeted. What area is carpeted?`,
      `地面由 $${a + e}$ 乘 $${b + f}$ 和 $${c}$ 乘 $${d}$ 两个房间组成。第一个房间内 $${e}$ 乘 $${f}$ 的壁橱不铺地毯。铺地毯的面积是多少？`,
      (a + e) * (b + f) + c * d - e * f,
      [(a + e) * (b + f) + c * d, (a + e) * (b + f) - e * f, a * b + c * d, (a + e) * (b + f) + c * d - 2 * e * f],
      `Add the two rooms and subtract the closet.`,
      `两个房间相加，再减去壁橱。`,
    );
  }),
  shapeTips("Finding a Shaded Fractional Area", "求阴影部分占的比例", ["finding-areas-between-shapes"], (rng, hard) => {
    const [n, m, k] = [rng.int(6, 16), rng.int(2, 12), rng.int(2, 4)];
    const cells = rng.int(1, n - 1);
    if (!hard)
      return ask(
        rng,
        `A rectangle is divided into $${n}$ equal parts, and $${cells}$ of them are shaded. What fraction of the rectangle is not shaded?`,
        `长方形被分成 $${n}$ 等份，其中 $${cells}$ 份涂色。没有涂色的部分占多少？`,
        Q.of(n - cells, n),
        [
          Q.of(cells === n - cells ? cells + 1 : cells, n),
          Q.of(1, n),
          Q.of(cells, n - cells === cells ? n + 1 : n - cells),
          Q.of(n - cells + 1, n + 1),
        ],
        `$${n - cells}$ of the $${n}$ parts are not shaded.`,
        `$${n}$ 份中有 $${n - cells}$ 份没有涂色。`,
        stripFigure(n, cells),
      );
    return ask(
      rng,
      `A square of side $${m * k}$ has a shaded square of side $${m}$ inside it. What fraction of the large square is shaded?`,
      `边长 $${m * k}$ 的正方形内有一个边长 $${m}$ 的阴影正方形。阴影占大正方形的多少？`,
      Q.of(1, k * k),
      [Q.of(1, k), Q.of(k * k - 1, k * k), Q.of(1, 2 * k), Q.of(2, k * k + 1)],
      `The side ratio is $\\frac{1}{${k}}$, so the area ratio is its square.`,
      `边长比是 $\\frac{1}{${k}}$，所以面积比是它的平方。`,
      nestedSquaresFigure(`${m * k}`, `${m}`, k),
    );
  }),
  shapeTips("Finding the Perimeter of a Rectangle", "求长方形的周长", ["perimeter"], (rng, hard) => {
    const [l, w, k] = [rng.int(3, 25), rng.int(2, 15), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the perimeter of a rectangle measuring $${l}$ by $${w}$?`,
        `长 $${l}$、宽 $${w}$ 的长方形周长是多少？`,
        2 * (l + w),
        [l + w, l * w, 2 * l + w, 4 * l],
        `$2(${l} + ${w})$.`,
        `$2(${l} + ${w})$。`,
      );
    return ask(
      rng,
      `A rectangle has an area of $${k * w * w}$ and a width of $${w}$. What is its perimeter?`,
      `长方形面积 $${k * w * w}$，宽 $${w}$。周长是多少？`,
      2 * (k + 1) * w,
      [(k + 1) * w, k * w * w, 2 * k * w, 2 * (k + 1) * w + 2],
      `The length is $${k * w}$.`,
      `长是 $${k * w}$。`,
    );
  }),
  shapeTips("Finding the Perimeter of a Square", "求正方形的周长", ["perimeter"], (rng, hard) => {
    const [s, k] = [rng.int(3, 40), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the perimeter of a square with side length $${s}$?`,
        `边长 $${s}$ 的正方形周长是多少？`,
        4 * s,
        [2 * s, s * s === 4 * s ? 5 * s : s * s, s, 4 * s + 4],
        `A square has four equal sides.`,
        `正方形四边相等。`,
      );
    return ask(
      rng,
      `A square has an area of $${(s * k) ** 2}$. What is its perimeter?`,
      `正方形面积 $${(s * k) ** 2}$。周长是多少？`,
      4 * s * k,
      [s * k, 2 * s * k, (s * k) ** 2, 4 * s * k + 4],
      `The side is $${s * k}$.`,
      `边长是 $${s * k}$。`,
    );
  }),
  shapeTips(
    "Scaling a Rectangular Prism Volume",
    "按比例缩放长方体体积",
    ["volumes-of-right-rectangular-prisms-word-problems"],
    (rng, hard) => {
      const [l, w, h, k] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 4)];
      if (!hard)
        return ask(
          rng,
          `A box measures $${l}$ by $${w}$ by $${h}$. If its height is multiplied by $${k}$, what is the new volume?`,
          `盒子长宽高为 $${l}$、$${w}$、$${h}$。若高乘 $${k}$，新体积是多少？`,
          l * w * h * k,
          [l * w * h, l * w * h + k, k ** 3 * l * w * h, k * k * l * w * h],
          `Volume is proportional to height.`,
          `体积与高成正比。`,
        );
      return ask(
        rng,
        `A box measures $${l}$ by $${w}$ by $${h}$. If each dimension is multiplied by $${k}$, what is the new volume?`,
        `盒子长宽高为 $${l}$、$${w}$、$${h}$。若每个尺寸都乘 $${k}$，新体积是多少？`,
        k ** 3 * l * w * h,
        [k * l * w * h, k * k * l * w * h, 3 * k * l * w * h, k ** 3 * l * w * h + k],
        `Volume scales by $${k}^3$.`,
        `体积乘 $${k}^3$。`,
      );
    },
  ),
  shapeTips("Counting Packed Rectangular Units", "计算装入的长方体单位数", ["packing-rectangular-boxes"], (rng, hard) => {
    const [a, b, c, u] = [rng.int(2, 8), rng.int(2, 8), rng.int(2, 8), rng.int(2, 4)];
    if (!hard)
      return ask(
        rng,
        `How many $1$-inch cubes fill a box measuring $${a}$ by $${b}$ by $${c}$ inches?`,
        `长宽高为 $${a}$、$${b}$、$${c}$ 英寸的盒子能装多少个 $1$ 英寸的立方体？`,
        a * b * c,
        [a + b + c, 2 * (a * b + a * c + b * c), a * b, a * b * c + 1],
        `Multiply the three dimensions.`,
        `三个尺寸相乘。`,
      );
    return ask(
      rng,
      `How many blocks measuring $${u}$ by $${2 * u}$ by $${3 * u}$ inches fill a box measuring $${a * u}$ by $${b * 2 * u}$ by $${c * 3 * u}$ inches, with all blocks facing the same way?`,
      `尺寸为 $${u}$、$${2 * u}$、$${3 * u}$ 英寸的积木朝向相同，填满长宽高为 $${a * u}$、$${b * 2 * u}$、$${c * 3 * u}$ 英寸的盒子需要多少块？`,
      a * b * c,
      [a * b * c * u, a + b + c, a * b * c * 2, a * b * c + 1],
      `There are $${a}$, $${b}$ and $${c}$ blocks along the three edges.`,
      `三条棱上分别有 $${a}$、$${b}$、$${c}$ 块。`,
    );
  }),
];
