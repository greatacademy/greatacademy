import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { choiceProblem, numberProblem } from "../problems.ts";

/** ratioTablesAndTapeDiagrams uses tables and tape diagrams to solve equivalent ratio problems. */
export const ratioTablesAndTapeDiagrams: TopicDef = {
  id: "ratio-tables-and-tape-diagrams",
  title: t("Ratio Tables and Tape Diagrams", "比例表与条形图"),
  summary: t(
    "Use ratio tables and tape diagrams to model and solve equivalent ratio problems.",
    "使用比例表与条形图对等比问题进行建模与求解。",
  ),
  prerequisites: ["ratios"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.6.RP.A.3a"],
  knowledgePoints: [
    {
      id: "ratio-tables",
      title: t("Completing Ratio Tables", "填补比例表"),
      explanation: t(
        "A **ratio table** displays pairs of numbers in equivalent ratios. Multiplying or dividing both quantities by the same non-zero number produces an equivalent ratio.\n\nFor example, if the ratio of flour to sugar is $3 : 2$, then multiplying both terms by $4$ gives $12 : 8$.",
        "**比例表**显示具有等比关系的一对对数值。给两项同时乘或除以相同的非零数，即可得到等比。\n\n例如，如果面粉与糖的比为 $3 : 2$，两项同乘 $4$ 得到 $12 : 8$。",
      ),
      generate(rng) {
        const a = rng.int(2, 7);
        let b = rng.int(2, 9);
        while (b === a) b = rng.int(2, 9);
        const m = rng.int(3, 12);
        const targetA = a * m;
        const answer = b * m;
        const wrong1 = answer + b;
        const wrong2 = answer - b;
        const wrong3 = a * (m + 1);

        const prompt = t(
          `In a recipe, the ratio of cups of ingredient $A$ to cups of ingredient $B$ is $${a} : ${b}$. If a baker uses $${targetA}$ cups of ingredient $A$, how many cups of ingredient $B$ are needed?`,
          `在一个配方中，原料 $A$ 与原料 $B$ 的杯数比为 $${a} : ${b}$。如果面包师使用了 $${targetA}$ 杯原料 $A$，需要多少杯原料 $B$？`,
        );
        const solution = t(
          `The ratio of ingredient $A$ to ingredient $B$ is $\\frac{${a}}{${b}}$. Since ingredient $A$ is scaled by $\\frac{${targetA}}{${a}} = ${m}$, multiply ingredient $B$ by $${m}$ as well: $${b} \\times ${m} = ${answer}$.`,
          `原料 $A$ 与原料 $B$ 的比为 $\\frac{${a}}{${b}}$。因为原料 $A$ 放大了 $\\frac{${targetA}}{${a}} = ${m}$ 倍，所以原料 $B$ 也要乘 $${m}$：$${b} \\times ${m} = ${answer}$。`,
        );

        return numberProblem({
          prompt,
          answer,
          form: "integer",
          wrong: [wrong1, wrong2, wrong3],
          solution,
        });
      },
    },
    {
      id: "tape-diagrams",
      title: t("Solving Ratio Problems with Tape Diagrams", "使用条形图求解比例问题"),
      explanation: t(
        "A **tape diagram** (or strip diagram) represents parts of a ratio as equal rectangular units. The total number of units equals the sum of the ratio parts.\n\nIf blue and red paint are mixed in the ratio $3 : 5$ and the total volume is $40\\text{ mL}$, each unit is $40 \\div (3 + 5) = 5\\text{ mL}$, so the blue paint is $3 \\times 5 = 15\\text{ mL}$.",
        "**条形图**将比例中的各个部分表示为相同大小的矩形单元。总单元数等于比例各部分之和。\n\n如果蓝漆与红漆按 $3 : 5$ 混合，总体积为 $40\\text{ mL}$，则每个单元代表 $40 \\div (3 + 5) = 5\\text{ mL}$，因此蓝漆为 $3 \\times 5 = 15\\text{ mL}$。",
      ),
      generate(rng) {
        const p1 = rng.int(2, 6);
        let p2 = rng.int(2, 7);
        while (p2 === p1) p2 = rng.int(2, 7);
        const unitVal = rng.int(3, 15);
        const total = (p1 + p2) * unitVal;
        const answer = p1 * unitVal;
        const other = p2 * unitVal;

        const prompt = t(
          `In a school club, the ratio of boys to girls is $${p1} : ${p2}$. If there are $${total}$ students in total, how many boys are in the club?`,
          `某学校社团中，男生与女生的比例是 $${p1} : ${p2}$。如果学生总共有 $${total}$ 人，社团中有多少名男生？`,
        );
        const solution = t(
          `The total number of equal units in the tape diagram is $${p1} + ${p2} = ${p1 + p2}$. Each unit represents $${total} \\div ${p1 + p2} = ${unitVal}$ students. Therefore, the number of boys is $${p1} \\times ${unitVal} = ${answer}$.`,
          `条形图中代表总数的等分单元数为 $${p1} + ${p2} = ${p1 + p2}$。每个单元代表 $${total} \\div ${p1 + p2} = ${unitVal}$ 名学生。因此男生人数为 $${p1} \\times ${unitVal} = ${answer}$。`,
        );

        return numberProblem({
          prompt,
          answer,
          form: "integer",
          wrong: [other, answer + unitVal, answer - unitVal],
          solution,
        });
      },
    },
  ],
};

/** unitPricesAndSpeed computes unit rates, prices per unit, and constant speed. */
export const unitPricesAndSpeed: TopicDef = {
  id: "unit-prices-and-speed",
  title: t("Unit Prices and Speed", "单价与速度"),
  summary: t("Calculate and compare unit rates including price per unit and speed.", "计算并比较单位费率，包括单价与速度。"),
  prerequisites: ["unit-rates"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.6.RP.A.2", "CCSS.7.RP.A.1"],
  knowledgePoints: [
    {
      id: "unit-price-calculation",
      title: t("Calculating Unit Price", "计算单价"),
      explanation: t(
        "A **unit price** is the cost per single unit of an item: $\\text{Unit Price} = \\frac{\\text{Total Cost}}{\\text{Quantity}}$.",
        "**单价**指物品每单件的价格：$\\text{单价} = \\frac{\\text{总价}}{\\text{数量}}$。",
      ),
      generate(rng) {
        const qty = rng.pick([3, 4, 5, 6, 8, 10]);
        const pricePerUnit = rng.int(2, 18);
        const totalCost = qty * pricePerUnit;

        const prompt = t(
          `A store sells a pack of $${qty}$ notebooks for a total of $\\$${totalCost}$. What is the unit price per notebook in dollars?`,
          `商店里一包 $${qty}$ 本笔记本总价为 $${totalCost}$ 美元。每本笔记本的单价是多少美元？`,
        );
        const solution = t(
          `Divide the total cost by the number of notebooks: $\\frac{\\$${totalCost}}{${qty}} = \\$${pricePerUnit}$ per notebook.`,
          `用总价除以笔记本数量：$\\frac{\\$${totalCost}}{${qty}} = \\$${pricePerUnit}$/本。`,
        );

        return numberProblem({
          prompt,
          answer: pricePerUnit,
          form: "integer",
          unit: "$",
          wrong: [pricePerUnit + 1, pricePerUnit - 1, qty],
          solution,
        });
      },
    },
    {
      id: "constant-speed-calculation",
      title: t("Calculating Speed as a Unit Rate", "计算恒定速度"),
      explanation: t(
        "Speed is a unit rate representing distance traveled per unit of time: $\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}$.",
        "速度是表示单位时间内行进距离的单位率：$\\text{速度} = \\frac{\\text{距离}}{\\text{时间}}$。",
      ),
      generate(rng) {
        const speed = rng.int(35, 75);
        const hours = rng.int(2, 6);
        const distance = speed * hours;

        const prompt = t(
          `A train travels $${distance}$ miles in $${hours}$ hours at a constant speed. What is the train's speed in miles per hour?`,
          `一列火车以恒定速度在 $${hours}$ 小时内行驶了 $${distance}$ 英里。这列火车的时速是多少英里？`,
        );
        const solution = t(
          `Divide the total distance by the time: $\\frac{${distance}\\text{ miles}}{${hours}\\text{ hours}} = ${speed}\\text{ miles per hour}$.`,
          `用总距离除以时间：$\\frac{${distance}\\text{ 英里}}{${hours}\\text{ 小时}} = ${speed}\\text{ 英里/小时}$。`,
        );

        return numberProblem({
          prompt,
          answer: speed,
          form: "integer",
          unit: "mph",
          wrong: [speed + 5, speed - 5, speed + hours],
          solution,
        });
      },
    },
  ],
};

/** percentApplicationsInterestAndDiscounts computes simple interest, taxes, and discounts. */
export const percentApplicationsInterestAndDiscounts: TopicDef = {
  id: "percent-applications-interest-and-discounts",
  title: t("Percent Applications: Interest and Discounts", "百分数应用：利息与折扣"),
  summary: t(
    "Solve real-world problems involving simple interest, sales tax, markups, and discounts.",
    "求解涉及单利、销售税、加价与折扣的实际问题。",
  ),
  prerequisites: ["percent-of-a-number"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.7.RP.A.3"],
  knowledgePoints: [
    {
      id: "simple-interest",
      title: t("Simple Interest Formula", "单利计算公式"),
      explanation: t(
        "**Simple interest** is calculated using the formula $I = P \\cdot r \\cdot t$, where $P$ is the principal, $r$ is the annual interest rate (as a decimal), and $t$ is the time in years.",
        "**单利**使用公式 $I = P \\cdot r \\cdot t$ 计算，其中 $P$ 是本金，$r$ 是年利率（化为小数），$t$ 是以年为单位的时间。",
      ),
      generate(rng) {
        const principal = rng.int(2, 20) * 100;
        const ratePercent = rng.int(2, 8);
        const years = rng.int(1, 5);
        const interest = Math.round((principal * ratePercent * years) / 100);

        const prompt = t(
          `Elena deposits $\\$${principal}$ into a savings account that earns $${ratePercent}\\%$ simple annual interest. How much interest in dollars will she earn after $${years}$ ${years === 1 ? "year" : "years"}?`,
          `埃琳娜将 $\\$${principal}$ 存入一个年单利率为 $${ratePercent}\\%$ 的储蓄账户。$${years}$ 年后她将获得多少美元利息？`,
        );
        const solution = t(
          `Use the simple interest formula $I = P \\cdot r \\cdot t$:\n$$I = ${principal} \\times \\frac{${ratePercent}}{100} \\times ${years} = ${principal} \\times ${(ratePercent / 100).toFixed(2)} \\times ${years} = \\$${interest}$$`,
          `利用单利公式 $I = P \\cdot r \\cdot t$：\n$$I = ${principal} \\times \\frac{${ratePercent}}{100} \\times ${years} = ${principal} \\times ${(ratePercent / 100).toFixed(2)} \\times ${years} = \\$${interest}$$`,
        );

        return numberProblem({
          prompt,
          answer: interest,
          form: "integer",
          unit: "$",
          wrong: [interest + 20, interest - 10, Math.round(principal * (ratePercent / 100))],
          solution,
        });
      },
    },
    {
      id: "discounts-and-sales",
      title: t("Discounts and Sale Prices", "折扣与折后售价"),
      explanation: t(
        "A **discount** is an amount deducted from the regular price. If the regular price is $P$ and the discount is $d\\%$, the discount amount is $P \\times \\frac{d}{100}$ and the sale price is $P - \\text{discount}$.",
        "**折扣**是从原价中扣除的金额。如果原价为 $P$，折扣率为 $d\\%$，则折扣金额为 $P \\times \\frac{d}{100}$，折后售价为 $P - \\text{折扣金额}$。",
      ),
      generate(rng) {
        const originalPrice = rng.int(4, 25) * 20;
        const discountPct = rng.pick([10, 20, 30, 40, 50]);
        const discountAmount = Math.round((originalPrice * discountPct) / 100);
        const salePrice = originalPrice - discountAmount;

        const prompt = t(
          `A jacket has an original price of $\\$${originalPrice}$. During a holiday sale, it is discounted by $${discountPct}\\%$. What is the sale price of the jacket in dollars?`,
          `一件夹克原价为 $\\$${originalPrice}$。在节日促销期间，它按 $${discountPct}\\%$ 折扣出售。这件夹克的折后售价是多少美元？`,
        );
        const solution = t(
          `The discount amount is $${originalPrice} \\times \\frac{${discountPct}}{100} = \\$${discountAmount}$. Subtract the discount from the original price: $\\$${originalPrice} - \\$${discountAmount} = \\$${salePrice}$.`,
          `折扣金额为 $${originalPrice} \\times \\frac{${discountPct}}{100} = \\$${discountAmount}$。从原价中减去折扣金额：$\\$${originalPrice} - \\$${discountAmount} = \\$${salePrice}$。`,
        );

        return numberProblem({
          prompt,
          answer: salePrice,
          form: "integer",
          unit: "$",
          wrong: [discountAmount, originalPrice + discountAmount, salePrice + 10],
          solution,
        });
      },
    },
  ],
};

/** scaleDrawingsAndScaleFactor computes actual lengths and dimensions using scale factors. */
export const scaleDrawingsAndScaleFactor: TopicDef = {
  id: "scale-drawings-and-scale-factor",
  title: t("Scale Drawings and Scale Factor", "比例图与比例系数"),
  summary: t(
    "Use scale factors to compute actual dimensions and distances from scale drawings.",
    "利用比例系数根据比例图计算实际尺寸与距离。",
  ),
  prerequisites: ["proportions"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.7.G.A.1"],
  knowledgePoints: [
    {
      id: "scale-factor-actual-length",
      title: t("Finding Actual Dimensions from a Scale Drawing", "根据比例图计算实际尺寸"),
      explanation: t(
        "A **scale drawing** represents an object with dimensions proportional to the actual object. The **scale** tells the relationship between the drawing measurements and the actual measurements.\n\nIf the scale is $1\\text{ cm} = 5\\text{ m}$, then a length of $4\\text{ cm}$ on the drawing corresponds to $4 \\times 5 = 20\\text{ m}$ in real life.",
        "**比例图**按与实际物体成比例的尺寸表示物体。**比例尺**表示图纸度量与实际度量之间的对应关系。\n\n如果比例尺为 $1\\text{ cm} = 5\\text{ m}$，图纸上 $4\\text{ cm}$ 的长度对应实际的 $4 \\times 5 = 20\\text{ m}$。",
      ),
      generate(rng) {
        const scaleMeters = rng.int(3, 12);
        const drawingCm = rng.int(4, 15);
        const actualMeters = drawingCm * scaleMeters;

        const prompt = t(
          `On a floor plan, the scale is $1\\text{ cm} = ${scaleMeters}\\text{ m}$. A living room is represented by a segment measuring $${drawingCm}\\text{ cm}$. What is the actual length of the room in meters?`,
          `在一张平面设计图上，比例尺为 $1\\text{ cm} = ${scaleMeters}\\text{ m}$。客厅在图上由一条长 $${drawingCm}\\text{ cm}$ 的线段表示。客厅的实际长度是多少米？`,
        );
        const solution = t(
          `Multiply the drawing measurement by the scale factor: $${drawingCm} \\times ${scaleMeters} = ${actualMeters}\\text{ meters}$.`,
          `将图纸尺寸乘比例系数：$${drawingCm} \\times ${scaleMeters} = ${actualMeters}\\text{ 米}$。`,
        );

        return numberProblem({
          prompt,
          answer: actualMeters,
          form: "integer",
          unit: "m",
          wrong: [actualMeters + scaleMeters, actualMeters - scaleMeters, drawingCm + scaleMeters],
          solution,
        });
      },
    },
  ],
};

/** classifyingRationalAndIrrationalNumbers distinguishes rational numbers from irrational numbers. */
export const classifyingRationalAndIrrationalNumbers: TopicDef = {
  id: "classifying-rational-and-irrational-numbers",
  title: t("Classifying Rational and Irrational Numbers", "区分有理数与无理数"),
  summary: t(
    "Identify and classify numbers, square roots, and cube roots as rational or irrational.",
    "识别并将数、平方根与立方根分类为有理数或无理数。",
  ),
  prerequisites: ["square-roots-and-cube-roots"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.8.NS.A.1"],
  knowledgePoints: [
    {
      id: "rational-vs-irrational",
      title: t("Rational and Irrational Numbers", "有理数与无理数"),
      explanation: t(
        "A **rational number** can be written as a ratio of two integers $\\frac{a}{b}$ (where $b \\neq 0$). Its decimal form either terminates or repeats.\n\nAn **irrational number** cannot be written as a fraction of integers. Its decimal expansion goes on forever without repeating. Examples include $\\pi$, $\\sqrt{2}$, $\\sqrt{3}$, and $\\sqrt{5}$. The square root of any non-perfect square is irrational.",
        "**有理数**可以写成两个整数的比 $\\frac{a}{b}$（其中 $b \\neq 0$）。其小数形式要么有限，要么无限循环。\n\n**无理数**不能写成整数分数形式，其小数展开是无限不循环的。例如 $\\pi$、$\\sqrt{2}$、$\\sqrt{3}$ 与 $\\sqrt{5}$。任何非完全平方数的算术平方根都是无理数。",
      ),
      generate(rng) {
        const nonSquare = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]);
        const perfectSquare = rng.pick([4, 9, 16, 25, 36, 49, 64, 81, 100]);
        const fracNum = rng.int(1, 9);
        const fracDen = rng.int(2, 10);
        const decVal = `0.${rng.int(12, 98)}`;

        const options = [
          t(`$\\sqrt{${nonSquare}}$`, `$\\sqrt{${nonSquare}}$`),
          t(`$\\sqrt{${perfectSquare}}$`, `$\\sqrt{${perfectSquare}}$`),
          t(`$\\frac{${fracNum}}{${fracDen}}$`, `$\\frac{${fracNum}}{${fracDen}}$`),
          t(`$${decVal}$`, `$${decVal}$`),
        ];

        const prompt = t(
          `Which of the following numbers is irrational: $\\sqrt{${nonSquare}}$, $\\sqrt{${perfectSquare}}$, $\\frac{${fracNum}}{${fracDen}}$, or $${decVal}$?`,
          `下列哪个数是无理数：$\\sqrt{${nonSquare}}$、$\\sqrt{${perfectSquare}}$、$\\frac{${fracNum}}{${fracDen}}$ 还是 $${decVal}$？`,
        );
        const solution = t(
          `$\\sqrt{${nonSquare}}$ is irrational because $${nonSquare}$ is not a perfect square. The other options are rational: $\\sqrt{${perfectSquare}} = ${Math.round(Math.sqrt(perfectSquare))}$, $\\frac{${fracNum}}{${fracDen}}$ is a ratio of integers, and terminating decimals are rational.`,
          `$\\sqrt{${nonSquare}}$ 是无理数，因为 $${nonSquare}$ 不是完全平方数。其他选项都是有理数：$\\sqrt{${perfectSquare}} = ${Math.round(Math.sqrt(perfectSquare))}$，$\\frac{${fracNum}}{${fracDen}}$ 是整数比，有限小数也是有理数。`,
        );

        return choiceProblem({
          prompt,
          options,
          correct: 0,
          solution,
        });
      },
    },
  ],
};

/** approximatingSquareRoots estimates values of non-perfect square roots between integers. */
export const approximatingSquareRoots: TopicDef = {
  id: "approximating-square-roots",
  title: t("Approximating Square Roots", "近似平方根"),
  summary: t("Estimate square roots of non-perfect squares between consecutive integers.", "在两个连续整数之间估算非完全平方数的平方根。"),
  prerequisites: ["square-roots-and-cube-roots"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.8.NS.A.2"],
  knowledgePoints: [
    {
      id: "consecutive-integer-bounds",
      title: t("Consecutive Integer Bounds for Square Roots", "平方根的连续整数界限"),
      explanation: t(
        "To estimate a square root $\\sqrt{N}$ where $N$ is not a perfect square, find the two consecutive perfect squares that bracket $N$.\n\nFor example, $49 < 54 < 64$, so $7 < \\sqrt{54} < 8$.",
        "要估算非完全平方数 $N$ 的平方根 $\\sqrt{N}$，找出夹住 $N$ 的两个连续完全平方数。\n\n例如，因为 $49 < 54 < 64$，所以 $7 < \\sqrt{54} < 8$。",
      ),
      generate(rng) {
        const k = rng.int(3, 11);
        const lowerSq = k * k;
        const upperSq = (k + 1) * (k + 1);
        const n = rng.int(lowerSq + 1, upperSq - 1);

        const prompt = t(
          `The value of $\\sqrt{${n}}$ lies between two consecutive integers $k$ and $k + 1$. What is the value of $k$?`,
          `$\\sqrt{${n}}$ 的值介于两个连续整数 $k$ 与 $k + 1$ 之间。$k$ 的值是多少？`,
        );
        const solution = t(
          `Identify the nearest perfect squares: $${lowerSq} < ${n} < ${upperSq}$. Taking square roots gives $\\sqrt{${lowerSq}} < \\sqrt{${n}} < \\sqrt{${upperSq}}$, so $${k} < \\sqrt{${n}} < ${k + 1}$. Therefore $k = ${k}$.`,
          `找出最接近的完全平方数：$${lowerSq} < ${n} < ${upperSq}$。开平方可得 $\\sqrt{${lowerSq}} < \\sqrt{${n}} < \\sqrt{${upperSq}}$，即 $${k} < \\sqrt{${n}} < ${k + 1}$。因此 $k = ${k}$。`,
        );

        return numberProblem({
          prompt,
          answer: k,
          form: "integer",
          wrong: [k - 1, k + 1, k + 2],
          solution,
        });
      },
    },
  ],
};

/** twoWayFrequencyTables reads and interprets bivariate categorical data tables. */
export const twoWayFrequencyTables: TopicDef = {
  id: "two-way-frequency-tables",
  title: t("Two-Way Frequency Tables", "双向频数表"),
  summary: t(
    "Construct, read, and complete two-way frequency tables for bivariate categorical data.",
    "构建、识读并填补二元分类数据的双向频数表。",
  ),
  prerequisites: ["dot-plots"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.8.SP.A.4"],
  knowledgePoints: [
    {
      id: "completing-two-way-tables",
      title: t("Completing Two-Way Frequency Tables", "填补双向频数表"),
      explanation: t(
        "A **two-way frequency table** shows counts for two categorical variables. The row totals and column totals must each sum to the overall total in the bottom-right cell.",
        "**双向频数表**显示两个分类变量的频数统计。行合计与列合计加总后必须等于右下角单元格的总计数。",
      ),
      generate(rng) {
        const a1 = rng.int(10, 35);
        const a2 = rng.int(12, 35);
        const b1 = rng.int(15, 40);
        const b2 = rng.int(10, 35);

        const row1Total = a1 + a2;
        const row2Total = b1 + b2;
        const col1Total = a1 + b1;
        const grandTotal = row1Total + row2Total;

        const prompt = t(
          `In a survey of $${grandTotal}$ students, $${row1Total}$ students play a sport and $${row2Total}$ do not. Of those who play a sport, $${a1}$ play an instrument. If $${col1Total}$ students in total play an instrument, how many students play a sport but do NOT play an instrument?`,
          `在一项对 $${grandTotal}$ 名学生的调查中，$${row1Total}$ 名学生参加体育运动，$${row2Total}$ 名不参加。在参加体育运动的学生中，$${a1}$ 名学生演奏乐器。如果总共有 $${col1Total}$ 名学生演奏乐器，有多少名学生参加体育运动但不演奏乐器？`,
        );
        const solution = t(
          `Among students who play a sport, the total is $${row1Total}$. Since $${a1}$ play an instrument, subtract to find those who do not: $${row1Total} - ${a1} = ${a2}$.`,
          `在参加体育运动的学生中，总数为 $${row1Total}$ 人。因为其中 $${a1}$ 人演奏乐器，相减即可得出不演奏乐器的人数：$${row1Total} - ${a1} = ${a2}$。`,
        );

        return numberProblem({
          prompt,
          answer: a2,
          form: "integer",
          wrong: [a1, b2, grandTotal - a1],
          solution,
        });
      },
    },
  ],
};

/** relativeFrequencyTables computes marginal and conditional relative frequencies. */
export const relativeFrequencyTables: TopicDef = {
  id: "relative-frequency-tables",
  title: t("Relative Frequency Tables", "相对频数表"),
  summary: t(
    "Compute marginal and conditional relative frequencies to analyze patterns of association.",
    "计算边缘相对频数与条件相对频数，分析关联特征。",
  ),
  prerequisites: ["two-way-frequency-tables"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.8.SP.A.4"],
  knowledgePoints: [
    {
      id: "conditional-relative-frequency",
      title: t("Calculating Conditional Relative Frequency", "计算条件相对频数"),
      explanation: t(
        "A **conditional relative frequency** compares a frequency count to a specific row total or column total: $\\text{Conditional Relative Frequency} = \\frac{\\text{Cell Count}}{\\text{Subgroup Total}} \\times 100\\%$.",
        "**条件相对频数**将某单元格频数与特定行合计或列合计进行比较：$\\text{条件相对频数} = \\frac{\\text{单元格频数}}{\\text{子群合计}} \\times 100\\%$。",
      ),
      generate(rng) {
        const mult = rng.pick([2, 4, 5, 10]);
        const totalSubgroup = 100 / mult;
        const cellCount = rng.int(2, totalSubgroup - 1);
        const percent = cellCount * mult;

        const prompt = t(
          `In a group of $${totalSubgroup}$ dog owners, $${cellCount}$ feed their dogs raw food. What percentage of these dog owners feed their dogs raw food?`,
          `在 $${totalSubgroup}$ 名养狗人中，有 $${cellCount}$ 名给宠物喂食生骨肉。这部分养狗人占养狗总人数的百分之几？`,
        );
        const solution = t(
          `Calculate the conditional percentage: $\\frac{${cellCount}}{${totalSubgroup}} \\times 100\\% = ${percent}\\%$.`,
          `计算条件百分比：$\\frac{${cellCount}}{${totalSubgroup}} \\times 100\\% = ${percent}\\%$。`,
        );

        return numberProblem({
          prompt,
          answer: percent,
          form: "integer",
          unit: "%",
          wrong: [percent + 5, percent - 5, 100 - percent],
          solution,
        });
      },
    },
  ],
};

/** histograms reads and interprets frequency distributions in histograms. */
export const histograms: TopicDef = {
  id: "histograms",
  title: t("Histograms", "直方图"),
  summary: t(
    "Interpret frequency distributions and count data displayed across intervals in histograms.",
    "解读直方图中按区间展示的频数分布并统计数据。",
  ),
  prerequisites: ["dot-plots"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.6.SP.B.4"],
  knowledgePoints: [
    {
      id: "reading-histograms",
      title: t("Reading Frequencies from Histograms", "识读直方图的频数"),
      explanation: t(
        "A **histogram** groups continuous or numerical data into contiguous intervals (bins). The height of each bar represents the frequency (count) of data points falling in that bin.",
        "**直方图**将连续或离散数值数据划分为连续的区间（组）。每根柱子的高度表示落在该区间内的数据点频数（计数）。",
      ),
      generate(rng) {
        const c1 = rng.int(3, 10);
        const c2 = rng.int(4, 15);
        const c3 = rng.int(6, 20);
        const c4 = rng.int(3, 12);
        const c5 = rng.int(1, 8);

        const answer = c3 + c4 + c5;
        const prompt = t(
          `A histogram displays the scores of a math contest across five bins: $0$–$19$ ($${c1}$ students), $20$–$39$ ($${c2}$ students), $40$–$59$ ($${c3}$ students), $60$–$79$ ($${c4}$ students), and $80$–$99$ ($${c5}$ students). How many students scored $40$ or higher?`,
          `一张直方图显示了一次数学竞赛的成绩分布，分为五个区间：$0$–$19$（$${c1}$ 名学生）、$20$–$39$（$${c2}$ 名学生）、$40$–$59$（$${c3}$ 名学生）、$60$–$79$（$${c4}$ 名学生）与 $80$–$99$（$${c5}$ 名学生）。有多少名学生的成绩在 $40$ 分及以上？`,
        );
        const solution = t(
          `Add the frequencies of the bins for scores of $40$ and above: $${c3} + ${c4} + ${c5} = ${answer}$ students.`,
          `将 $40$ 分及以上各个区间的频数相加：$${c3} + ${c4} + ${c5} = ${answer}$ 名学生。`,
        );

        return numberProblem({
          prompt,
          answer,
          form: "integer",
          wrong: [answer - c5, c1 + c2, c3 + c4],
          solution,
        });
      },
    },
  ],
};

/** linearVsNonlinearFunctions identifies linear and nonlinear relationships. */
export const linearVsNonlinearFunctions: TopicDef = {
  id: "linear-vs-nonlinear-functions",
  title: t("Linear and Nonlinear Functions", "一次函数与非线性函数"),
  summary: t(
    "Distinguish between linear functions with constant rates of change and nonlinear functions.",
    "区分具有恒定变化率的一次函数与非线性函数。",
  ),
  prerequisites: ["graphs-of-functions"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.8.F.A.3"],
  knowledgePoints: [
    {
      id: "identifying-linear-functions",
      title: t("Linear vs. Nonlinear Functions", "一次函数与非线性函数判断"),
      explanation: t(
        "A **linear function** has a constant rate of change and can be written in the form $y = mx + b$. Its graph is a straight line.\n\nA **nonlinear function** does not have a constant rate of change; its equation involves powers other than $1$ (such as $x^2$), variables in denominators (such as $\\frac{1}{x}$), or variables in exponents (such as $2^x$).",
        "**一次函数**具有恒定的变化率，可以写为 $y = mx + b$ 的形式。其图象是一条直线。\n\n**非线性函数**的变化率不是常数；其方程包含除 $1$ 以外的幂（例如 $x^2$）、分母中的变量（例如 $\\frac{1}{x}$）或指数中的变量（例如 $2^x$）。",
      ),
      generate(rng) {
        const m = rng.int(2, 7);
        const b = rng.int(1, 9);
        const linearEq = `y = ${m}x + ${b}`;
        const nonlinear1 = `y = ${m}x^2 + ${b}`;
        const nonlinear2 = `y = \\frac{${b}}{x}`;
        const nonlinear3 = `y = ${m}^x`;

        const options = [
          t(`$${linearEq}$`, `$${linearEq}$`),
          t(`$${nonlinear1}$`, `$${nonlinear1}$`),
          t(`$${nonlinear2}$`, `$${nonlinear2}$`),
          t(`$${nonlinear3}$`, `$${nonlinear3}$`),
        ];

        const prompt = t(
          `Which of the following equations represents a linear function: $${linearEq}$, $${nonlinear1}$, $${nonlinear2}$, or $${nonlinear3}$?`,
          `下列哪个方程表示一次函数：$${linearEq}$、$${nonlinear1}$、$${nonlinear2}$ 还是 $${nonlinear3}$？`,
        );
        const solution = t(
          `$${linearEq}$ is in the slope-intercept form $y = mx + b$ with constant slope $m = ${m}$, so it is a linear function. The others are nonlinear because they contain $x^2$, $\\frac{1}{x}$, or $x$ in the exponent.`,
          `$${linearEq}$ 符合斜截式 $y = mx + b$ 的形式，斜率 $m = ${m}$ 为常数，因此是一次函数。其他选项由于包含 $x^2$、$\\frac{1}{x}$ 或变量在指数上，均为非线性函数。`,
        );

        return choiceProblem({
          prompt,
          options,
          correct: 0,
          solution,
        });
      },
    },
  ],
};

/** grade6to8FoundationTopics are the foundational topics bridging Middle School mathematics. */
export const grade6to8FoundationTopics: readonly TopicDef[] = [
  ratioTablesAndTapeDiagrams,
  unitPricesAndSpeed,
  percentApplicationsInterestAndDiscounts,
  scaleDrawingsAndScaleFactor,
  classifyingRationalAndIrrationalNumbers,
  approximatingSquareRoots,
  twoWayFrequencyTables,
  relativeFrequencyTables,
  histograms,
  linearVsNonlinearFunctions,
];
