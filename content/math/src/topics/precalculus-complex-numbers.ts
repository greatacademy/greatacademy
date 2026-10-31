import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { choiceProblem } from "../problems.ts";

// Precalculus Unit 10: Complex Numbers
// Part 1: Modules 10.30 (The Complex Plane), 10.31 (Further Complex Numbers),
// and 10.32 (Complex Numbers in Polar Form).

function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

/** cx formats the complex number a + bi in standard mathematical notation. */
function cx(a: number, b: number): string {
  if (a === 0 && b === 0) return "0";
  if (b === 0) return `${a}`;
  const bStr = b === 1 ? "i" : b === -1 ? "-i" : `${b}i`;
  if (a === 0) return bStr;
  return b > 0 ? `${a} + ${b === 1 ? "i" : `${b}i`}` : `${a} - ${b === -1 ? "i" : `${-b}i`}`;
}

/** cxPar wraps a complex number in parentheses when appropriate. */
function cxPar(a: number, b: number): string {
  const s = cx(a, b);
  return (a !== 0 && b !== 0) || s.startsWith("-") ? `(${s})` : s;
}

/** gcd computes the greatest common divisor of two integers. */
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

/** formatFraction formats num / den as reduced LaTeX fraction. */
function formatFraction(num: number, den: number): string {
  if (num === 0) return "0";
  const sign = (num < 0 ? -1 : 1) * (den < 0 ? -1 : 1);
  const n = Math.abs(num);
  const d = Math.abs(den);
  const g = gcd(n, d);
  const sn = (n / g) * sign;
  const sd = d / g;
  if (sd === 1) return `${sn}`;
  return sn < 0 ? `-\\frac{${-sn}}{${sd}}` : `\\frac{${sn}}{${sd}}`;
}

/** cxFrac formats (numA / den) + (numB / den)i in reduced form. */
function cxFrac(numA: number, numB: number, den: number): string {
  const re = formatFraction(numA, den);
  const im = formatFraction(numB, den);
  if (numB === 0) return re;
  if (numA === 0) {
    if (im === "1") return "i";
    if (im === "-1") return "-i";
    return `${im}i`;
  }
  if (numB > 0) {
    const imStr = im === "1" ? "i" : `${im}i`;
    return `${re} + ${imStr}`;
  }
  const posIm = formatFraction(-numB, den);
  const imStr = posIm === "1" ? "i" : `${posIm}i`;
  return `${re} - ${imStr}`;
}

interface PolarItem {
  readonly r: number;
  readonly theta: string;
  readonly rect: string;
  readonly wrongThetas: readonly string[];
  readonly wrongRects: readonly string[];
}

/** getSpecialPolarItems returns standard special angle items with multiple radii for high generator variety. */
function getSpecialPolarItems(): readonly PolarItem[] {
  const items: PolarItem[] = [];
  const ks = [1, 2, 3, 4];
  for (const k of ks) {
    const r = 2 * k;
    const kStr = k === 1 ? "" : `${k}`;
    items.push({
      r,
      theta: "\\frac{\\pi}{6}",
      rect: `${kStr}\\sqrt{3} + ${kStr}i`,
      wrongThetas: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{11\\pi}{6}"],
      wrongRects: [`${kStr} + ${kStr}\\sqrt{3}i`, `-${kStr}\\sqrt{3} + ${kStr}i`, `${kStr}\\sqrt{3} - ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{\\pi}{3}",
      rect: `${kStr} + ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{4\\pi}{3}"],
      wrongRects: [`${kStr}\\sqrt{3} + ${kStr}i`, `-${kStr} + ${kStr}\\sqrt{3}i`, `${kStr} - ${kStr}\\sqrt{3}i`],
    });
    items.push({
      r,
      theta: "\\frac{2\\pi}{3}",
      rect: `-${kStr} + ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}"],
      wrongRects: [`${kStr} + ${kStr}\\sqrt{3}i`, `-${kStr} - ${kStr}\\sqrt{3}i`, `-${kStr}\\sqrt{3} + ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{5\\pi}{6}",
      rect: `-${kStr}\\sqrt{3} + ${kStr}i`,
      wrongThetas: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{7\\pi}{6}"],
      wrongRects: [`${kStr}\\sqrt{3} + ${kStr}i`, `-${kStr}\\sqrt{3} - ${kStr}i`, `-${kStr} + ${kStr}\\sqrt{3}i`],
    });
    items.push({
      r,
      theta: "\\frac{7\\pi}{6}",
      rect: `-${kStr}\\sqrt{3} - ${kStr}i`,
      wrongThetas: ["\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}", "\\frac{11\\pi}{6}"],
      wrongRects: [`-${kStr}\\sqrt{3} + ${kStr}i`, `${kStr}\\sqrt{3} - ${kStr}i`, `-${kStr} - ${kStr}\\sqrt{3}i`],
    });
    items.push({
      r,
      theta: "\\frac{4\\pi}{3}",
      rect: `-${kStr} - ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{2\\pi}{3}", "\\frac{5\\pi}{3}", "\\frac{7\\pi}{6}"],
      wrongRects: [`-${kStr} + ${kStr}\\sqrt{3}i`, `${kStr} - ${kStr}\\sqrt{3}i`, `-${kStr}\\sqrt{3} - ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{5\\pi}{3}",
      rect: `${kStr} - ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{4\\pi}{3}", "\\frac{\\pi}{3}", "\\frac{11\\pi}{6}"],
      wrongRects: [`${kStr} + ${kStr}\\sqrt{3}i`, `-${kStr} - ${kStr}\\sqrt{3}i`, `${kStr}\\sqrt{3} - ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{11\\pi}{6}",
      rect: `${kStr}\\sqrt{3} - ${kStr}i`,
      wrongThetas: ["\\frac{7\\pi}{6}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{6}"],
      wrongRects: [`${kStr}\\sqrt{3} + ${kStr}i`, `-${kStr}\\sqrt{3} - ${kStr}i`, `${kStr} - ${kStr}\\sqrt{3}i`],
    });
  }
  for (const r of [2, 3, 4, 5, 6]) {
    items.push({
      r,
      theta: "0",
      rect: `${r}`,
      wrongThetas: ["\\pi", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"],
      wrongRects: [`-${r}`, `${r}i`, `-${r}i`],
    });
    items.push({
      r,
      theta: "\\frac{\\pi}{2}",
      rect: `${r}i`,
      wrongThetas: ["\\pi", "\\frac{3\\pi}{2}", "0"],
      wrongRects: [`-${r}i`, `${r}`, `-${r}`],
    });
    items.push({
      r,
      theta: "\\pi",
      rect: `-${r}`,
      wrongThetas: ["0", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"],
      wrongRects: [`${r}`, `-${r}i`, `${r}i`],
    });
    items.push({
      r,
      theta: "\\frac{3\\pi}{2}",
      rect: `-${r}i`,
      wrongThetas: ["\\frac{\\pi}{2}", "\\pi", "0"],
      wrongRects: [`${r}i`, `-${r}`, `${r}`],
    });
  }
  return items;
}

// ─── Module 10.30: The Complex Plane ─────────────────────────────────────────

/** theComplexPlane covers representing complex numbers geometrically as points in the complex plane. */
export const theComplexPlane: TopicDef = {
  id: "the-complex-plane",
  title: t("The Complex Plane", "复平面与复数的几何表示"),
  summary: t(
    "Represent complex numbers z = a + bi geometrically as coordinates (a, b) in the complex plane, identify the real and imaginary axes, and determine the quadrant containing a given complex number.",
    "在复平面（阿尔冈图）中将复数 z = a + bi 几何表示为坐标 (a, b)，识别实轴与虚轴，并确定给定复数所在的象限。",
  ),
  prerequisites: ["two-dimensional-vectors-expressed-in-component-form"],
  encompasses: [{ topic: "two-dimensional-vectors-expressed-in-component-form", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "plot-complex-numbers-in-the-complex-plane",
      title: t("Plot complex numbers as coordinates in the complex plane", "在复平面中将复数表示为坐标点"),
      explanation: t(
        "Every complex number $z = a + bi$ corresponds to a unique point $(a, b)$ in the **complex plane** (or Argand plane).\n\n- The horizontal axis is the **real axis** ($\text{Re}$), representing the real part $a$.\n- The vertical axis is the **imaginary axis** ($\text{Im}$), representing the imaginary part $b$.\n\nFor example, $z = 3 - 4i$ is represented by the point $(3, -4)$.",
        "每一个复数 $z = a + bi$ 都在**复平面**（阿尔冈平面）中对应唯一的点 $(a, b)$。\n\n- 水平轴为**实轴**（$\text{Re}$），表示实部 $a$。\n- 垂直轴为**虚轴**（$\text{Im}$），表示虚部 $b$。\n\n例如，复数 $z = 3 - 4i$ 对应的点坐标为 $(3, -4)$。",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const prompt = t(
          `Which point in the complex plane represents the complex number $z = ${cx(a, b)}$?`,
          `在复平面中，哪个点表示复数 $z = ${cx(a, b)}$？`,
        );
        const right = t(`$(${a}, ${b})$`, `$(${a}, ${b})$`);
        const wrong = [
          t(`$(${b}, ${a})$`, `$(${b}, ${a})$`),
          t(`$(${-a}, ${b})$`, `$(${-a}, ${b})$`),
          t(`$(${a}, ${-b})$`, `$(${a}, ${-b})$`),
          t(`$(${-b}, ${-a})$`, `$(${-b}, ${-a})$`),
          t(`$(${-a}, ${-b})$`, `$(${-a}, ${-b})$`),
        ];
        const solution = t(
          `For $z = a + bi$, the real part $a$ is the $x$-coordinate and the imaginary part $b$ is the $y$-coordinate. Here $a = ${a}$ and $b = ${b}$, so the point is $(${a}, ${b})$.`,
          `对于复数 $z = a + bi$，实部 $a$ 是横坐标，虚部 $b$ 是纵坐标。本题中 $a = ${a}$，$b = ${b}$，因此对应的点是 $(${a}, ${b})$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "real-and-imaginary-axes",
      title: t("Identify points on the real and imaginary axes", "识别实轴与虚轴上的点"),
      explanation: t(
        "In the complex plane:\n\n- A **purely real number** $z = a$ (where $b = 0$) lies on the **real axis** at coordinate $(a, 0)$.\n- A **purely imaginary number** $z = bi$ with $b \neq 0$ (where $a = 0$) lies on the **imaginary axis** at coordinate $(0, b)$.\n- The origin $(0, 0)$ represents $z = 0$.",
        "在复平面中：\n\n- **纯实数** $z = a$（虚部 $b = 0$）位于**实轴**上，坐标为 $(a, 0)$。\n- **纯虚数** $z = bi$（$b \neq 0$，实部 $a = 0$）位于**虚轴**上，坐标为 $(0, b)$。\n- 原点 $(0, 0)$ 表示复数 $0$。",
      ),
      generate(rng) {
        const val = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const isReal = rng.bool();
        if (isReal) {
          const prompt = t(
            `On which axis does the complex number $z = ${val}$ lie, and what are its coordinates in the complex plane?`,
            `复数 $z = ${val}$ 位于复平面的哪条坐标轴上，其对应的坐标是什么？`,
          );
          const right = t(`Real axis, at $(${val}, 0)$`, `实轴，位于 $(${val}, 0)$`);
          const wrong = [
            t(`Imaginary axis, at $(0, ${val})$`, `虚轴，位于 $(0, ${val})$`),
            t(`Real axis, at $(0, ${val})$`, `实轴，位于 $(0, ${val})$`),
            t(`Imaginary axis, at $(${val}, 0)$`, `虚轴，位于 $(${val}, 0)$`),
            t(`Quadrant I, at $(${val}, ${val})$`, `第一象限，位于 $(${val}, ${val})$`),
          ];
          const solution = t(
            `Since $z = ${val} = ${val} + 0i$, its real part is $${val}$ and imaginary part is $0$. It lies on the real axis at $(${val}, 0)$.`,
            `因为 $z = ${val} = ${val} + 0i$，其实部为 $${val}$，虚部为 $0$。它位于实轴上的点 $(${val}, 0)$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const prompt = t(
          `On which axis does the complex number $z = ${cx(0, val)}$ lie, and what are its coordinates in the complex plane?`,
          `复数 $z = ${cx(0, val)}$ 位于复平面的哪条坐标轴上，其对应的坐标是什么？`,
        );
        const right = t(`Imaginary axis, at $(0, ${val})$`, `虚轴，位于 $(0, ${val})$`);
        const wrong = [
          t(`Real axis, at $(${val}, 0)$`, `实轴，位于 $(${val}, 0)$`),
          t(`Imaginary axis, at $(${val}, 0)$`, `虚轴，位于 $(${val}, 0)$`),
          t(`Real axis, at $(0, ${val})$`, `实轴，位于 $(0, ${val})$`),
          t(`Quadrant II, at $(${val}, ${val})$`, `第二象限，位于 $(${val}, ${val})$`),
        ];
        const solution = t(
          `Since $z = ${cx(0, val)} = 0 + ${val}i$, its real part is $0$ and imaginary part is $${val}$. It lies on the imaginary axis at $(0, ${val})$.`,
          `因为 $z = ${cx(0, val)} = 0 + ${val}i$，其实部为 $0$，虚部为 $${val}$。它位于虚轴上的点 $(0, ${val})$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "quadrants-in-the-complex-plane",
      title: t("Determine the quadrant of a complex number", "确定复数所在的象限"),
      explanation: t(
        "The signs of the real part $a$ and imaginary part $b$ determine the quadrant of $z = a + bi$:\n\n- **Quadrant I**: $a > 0$ and $b > 0$\n- **Quadrant II**: $a < 0$ and $b > 0$\n- **Quadrant III**: $a < 0$ and $b < 0$\n- **Quadrant IV**: $a > 0$ and $b < 0$",
        "复数 $z = a + bi$ 的实部 $a$ 和虚部 $b$ 的符号决定了其所在的象限：\n\n- **第一象限**：$a > 0$ 且 $b > 0$\n- **第二象限**：$a < 0$ 且 $b > 0$\n- **第三象限**：$a < 0$ 且 $b < 0$\n- **第四象限**：$a > 0$ 且 $b < 0$",
      ),
      generate(rng) {
        const a = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const b = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const quad = a > 0 ? (b > 0 ? "I" : "IV") : b > 0 ? "II" : "III";
        const prompt = t(
          `In which quadrant of the complex plane does $z = ${cx(a, b)}$ lie?`,
          `复数 $z = ${cx(a, b)}$ 位于复平面的第几象限？`,
        );
        const right = t(`Quadrant ${quad}`, `第 ${quad} 象限`);
        const allQuads = ["I", "II", "III", "IV"];
        const wrong = allQuads.filter((q) => q !== quad).map((q) => t(`Quadrant ${q}`, `第 ${q} 象限`));
        const solution = t(
          `The real part is $a = ${a}$ (${a > 0 ? "positive" : "negative"}) and the imaginary part is $b = ${b}$ (${b > 0 ? "positive" : "negative"}). Therefore, the point $(${a}, ${b})$ lies in Quadrant ${quad}.`,
          `实部 $a = ${a}$（${a > 0 ? "正数" : "负数"}），虚部 $b = ${b}$（${b > 0 ? "正数" : "负数"}）。因此，点 $(${a}, ${b})$ 位于第 ${quad} 象限。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.30.2: The Magnitude of a Complex Number ───────────────────────

/** theMagnitudeOfAComplexNumber covers the modulus of a complex number and distance between two numbers. */
export const theMagnitudeOfAComplexNumber: TopicDef = {
  id: "the-magnitude-of-a-complex-number",
  title: t("The Magnitude of a Complex Number", "复数的模长"),
  summary: t(
    "Calculate the magnitude (modulus) |z| = √(a² + b²) of a complex number as its Euclidean distance from the origin, and determine the distance |z1 - z2| between two complex numbers in the complex plane.",
    "计算复数的模长（绝对值）|z| = √(a² + b²)（即到原点的欧氏距离），并求复平面上两个复数之间的距离 |z1 - z2|。",
  ),
  prerequisites: ["the-complex-plane"],
  encompasses: [{ topic: "the-complex-plane", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4", "CCSS.HSN.CN.B.6"],
  knowledgePoints: [
    {
      id: "modulus-of-a-complex-number",
      title: t("Calculate the modulus of a complex number", "计算复数的模长"),
      explanation: t(
        "The **magnitude** (or **modulus**) of a complex number $z = a + bi$, denoted $|z|$, represents the Euclidean distance from the origin $(0, 0)$ to $(a, b)$ in the complex plane:\n\n$$|z| = \\sqrt{a^2 + b^2}$$\n\nNotice that $|z| \\ge 0$, and $|z| = 0$ if and only if $z = 0$.",
        "复数 $z = a + bi$ 的**模长**（或**绝对值**）记作 $|z|$，表示复平面中原点 $(0, 0)$ 到点 $(a, b)$ 的欧氏距离：\n\n$$|z| = \\sqrt{a^2 + b^2}$$\n\n显然 $|z| \\ge 0$，且 $|z| = 0$ 当且仅当 $z = 0$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { a: 3, b: 4, ans: "5", wrong: ["7", "25", "1", "\\sqrt{7}"] },
          { a: 5, b: 12, ans: "13", wrong: ["17", "169", "7", "\\sqrt{119}"] },
          { a: 8, b: 6, ans: "10", wrong: ["14", "100", "2", "\\sqrt{28}"] },
          { a: 7, b: 24, ans: "25", wrong: ["31", "625", "17", "\\sqrt{527}"] },
          { a: 8, b: 15, ans: "17", wrong: ["23", "289", "7", "\\sqrt{161}"] },
          { a: 9, b: 12, ans: "15", wrong: ["21", "225", "3", "\\sqrt{63}"] },
          { a: 1, b: 1, ans: "\\sqrt{2}", wrong: ["2", "1", "\\sqrt{3}", "4"] },
          { a: 1, b: 2, ans: "\\sqrt{5}", wrong: ["3", "5", "\\sqrt{3}", "1"] },
          { a: 2, b: 3, ans: "\\sqrt{13}", wrong: ["5", "13", "\\sqrt{5}", "1"] },
          { a: 1, b: 3, ans: "\\sqrt{10}", wrong: ["4", "10", "\\sqrt{8}", "2"] },
          { a: 3, b: 3, ans: "3\\sqrt{2}", wrong: ["6", "18", "\\sqrt{6}", "3"] },
          { a: 2, b: 4, ans: "2\\sqrt{5}", wrong: ["6", "20", "\\sqrt{12}", "2"] },
          { a: 1, b: 4, ans: "\\sqrt{17}", wrong: ["5", "17", "\\sqrt{15}", "3"] },
          { a: 2, b: 5, ans: "\\sqrt{29}", wrong: ["7", "29", "\\sqrt{21}", "3"] },
          { a: 4, b: 4, ans: "4\\sqrt{2}", wrong: ["8", "32", "16", "4"] },
          { a: 3, b: 5, ans: "\\sqrt{34}", wrong: ["8", "34", "\\sqrt{16}", "4"] },
        ]);
        const s1 = rng.pick([-1, 1]);
        const s2 = rng.pick([-1, 1]);
        const a = s1 * item.a;
        const b = s2 * item.b;
        const prompt = t(`Find the magnitude (modulus) $|z|$ of $z = ${cx(a, b)}$.`, `求复数 $z = ${cx(a, b)}$ 的模长 $|z|$。`);
        const right = t(`$${item.ans}$`, `$${item.ans}$`);
        const wrong = item.wrong.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = t(
          `$$|z| = \\sqrt{(${a})^2 + (${b})^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${a * a + b * b}} = ${item.ans}$$`,
          `$$|z| = \\sqrt{(${a})^2 + (${b})^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${a * a + b * b}} = ${item.ans}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "distance-between-two-complex-numbers",
      title: t("Find the distance between two complex numbers", "求两个复数之间的距离"),
      explanation: t(
        "In the complex plane, the distance between two complex numbers $z_1 = a_1 + b_1 i$ and $z_2 = a_2 + b_2 i$ is given by the modulus of their difference:\n\n$$|z_1 - z_2| = \\sqrt{(a_1 - a_2)^2 + (b_1 - b_2)^2}$$\n\nThis is identical to the Euclidean distance formula between points $(a_1, b_1)$ and $(a_2, b_2)$.",
        "在复平面中，两个复数 $z_1 = a_1 + b_1 i$ 和 $z_2 = a_2 + b_2 i$ 之间的距离等于它们差的模长：\n\n$$|z_1 - z_2| = \\sqrt{(a_1 - a_2)^2 + (b_1 - b_2)^2}$$\n\n这与平面上两点 $(a_1, b_1)$ 与 $(a_2, b_2)$ 之间的欧氏距离公式完全一致。",
      ),
      generate(rng) {
        const item = rng.pick([
          { da: 3, db: 4, dist: "5", wrong: ["7", "25", "1", "\\sqrt{7}"] },
          { da: 4, db: 3, dist: "5", wrong: ["7", "25", "1", "\\sqrt{7}"] },
          { da: 6, db: 8, dist: "10", wrong: ["14", "100", "2", "\\sqrt{28}"] },
          { da: 5, db: 12, dist: "13", wrong: ["17", "169", "7", "\\sqrt{119}"] },
          { da: 1, db: 1, dist: "\\sqrt{2}", wrong: ["2", "1", "\\sqrt{3}", "4"] },
          { da: 1, db: 2, dist: "\\sqrt{5}", wrong: ["3", "5", "\\sqrt{3}", "1"] },
          { da: 2, db: 3, dist: "\\sqrt{13}", wrong: ["5", "13", "\\sqrt{5}", "1"] },
          { da: 1, db: 3, dist: "\\sqrt{10}", wrong: ["4", "10", "\\sqrt{8}", "2"] },
          { da: 2, db: 2, dist: "2\\sqrt{2}", wrong: ["4", "8", "\\sqrt{4}", "2"] },
        ]);
        const sa = rng.pick([-1, 1]);
        const sb = rng.pick([-1, 1]);
        const da = sa * item.da;
        const db = sb * item.db;
        const x2 = rng.int(-5, 5);
        const y2 = rng.int(-5, 5);
        const x1 = x2 + da;
        const y1 = y2 + db;
        const prompt = t(
          `Find the distance $|z_1 - z_2|$ between $z_1 = ${cx(x1, y1)}$ and $z_2 = ${cx(x2, y2)}$ in the complex plane.`,
          `求复平面上 $z_1 = ${cx(x1, y1)}$ 与 $z_2 = ${cx(x2, y2)}$ 之间的距离 $|z_1 - z_2|$。`,
        );
        const right = t(`$${item.dist}$`, `$${item.dist}$`);
        const wrong = item.wrong.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = t(
          `$$z_1 - z_2 = (${cx(x1, y1)}) - (${cx(x2, y2)}) = ${cx(da, db)}$$\n\n$$|z_1 - z_2| = \\sqrt{(${da})^2 + (${db})^2} = \\sqrt{${da * da + db * db}} = ${item.dist}$$`,
          `$$z_1 - z_2 = (${cx(x1, y1)}) - (${cx(x2, y2)}) = ${cx(da, db)}$$\n\n$$|z_1 - z_2| = \\sqrt{(${da})^2 + (${db})^2} = \\sqrt{${da * da + db * db}} = ${item.dist}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.30.3: The Argument of a Complex Number ─────────────────────────

/** theArgumentOfAComplexNumber covers the principal argument in [0, 2π) or (-π, π]. */
export const theArgumentOfAComplexNumber: TopicDef = {
  id: "the-argument-of-a-complex-number",
  title: t("The Argument of a Complex Number", "复数的辐角与主辐角"),
  summary: t(
    "Determine the principal argument arg(z) of a complex number z = a + bi in [0, 2π) or (-π, π] using reference angles and quadrant rules.",
    "利用参考角与象限法则，确定复数 z = a + bi 在 [0, 2π) 或 (-π, π] 内的辐角与主辐角 arg(z)。",
  ),
  prerequisites: ["the-magnitude-of-a-complex-number"],
  encompasses: [{ topic: "the-magnitude-of-a-complex-number", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "argument-of-special-complex-numbers",
      title: t("Find the principal argument of special complex numbers", "求特殊复数的主辐角"),
      explanation: t(
        "The **argument** $\\theta = \\arg(z)$ of a nonzero complex number $z = a + bi$ is the angle made by the position vector of $z$ with the positive real axis.\n\nThe **principal argument** is conventionally chosen in $[0, 2\\pi)$ (or $(-\\pi, \\pi]$).\n\nFor standard angles:\n- $z = 1 + i \\implies \\theta = \\frac{\\pi}{4}$\n- $z = -1 + i \\implies \\theta = \\frac{3\\pi}{4}$\n- $z = -1 - i \\implies \\theta = \\frac{5\\pi}{4}$\n- $z = 1 - i \\implies \\theta = \\frac{7\\pi}{4}$\n- $z = \\sqrt{3} + i \\implies \\theta = \\frac{\\pi}{6}$\n- $z = 1 + \\sqrt{3}i \\implies \\theta = \\frac{\\pi}{3}$",
        "非零复数 $z = a + bi$ 的**辐角** $\\theta = \\arg(z)$ 是其位置向量与正实轴之间的夹角。\n\n**主辐角**通常取值在 $[0, 2\\pi)$（或 $(-\\pi, \\pi]$）内。\n\n常见特殊角的辐角：\n- $z = 1 + i \\implies \\theta = \\frac{\\pi}{4}$\n- $z = -1 + i \\implies \\theta = \\frac{3\\pi}{4}$\n- $z = -1 - i \\implies \\theta = \\frac{5\\pi}{4}$\n- $z = 1 - i \\implies \\theta = \\frac{7\\pi}{4}$\n- $z = \\sqrt{3} + i \\implies \\theta = \\frac{\\pi}{6}$\n- $z = 1 + \\sqrt{3}i \\implies \\theta = \\frac{\\pi}{3}$",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          { expr: `${k}`, ans: "0", wrong: ["\\pi", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"] },
          { expr: `${kStr}i`, ans: "\\frac{\\pi}{2}", wrong: ["\\pi", "\\frac{3\\pi}{2}", "0"] },
          { expr: `-${k}`, ans: "\\pi", wrong: ["0", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"] },
          { expr: `-${kStr}i`, ans: "\\frac{3\\pi}{2}", wrong: ["\\frac{\\pi}{2}", "\\pi", "0"] },
          { expr: `${k} + ${kStr}i`, ans: "\\frac{\\pi}{4}", wrong: ["\\frac{3\\pi}{4}", "\\frac{7\\pi}{4}", "\\frac{\\pi}{3}"] },
          { expr: `-${k} + ${kStr}i`, ans: "\\frac{3\\pi}{4}", wrong: ["\\frac{\\pi}{4}", "\\frac{5\\pi}{4}", "\\frac{2\\pi}{3}"] },
          { expr: `-${k} - ${kStr}i`, ans: "\\frac{5\\pi}{4}", wrong: ["\\frac{3\\pi}{4}", "\\frac{7\\pi}{4}", "\\frac{\\pi}{4}"] },
          { expr: `${k} - ${kStr}i`, ans: "\\frac{7\\pi}{4}", wrong: ["\\frac{\\pi}{4}", "\\frac{5\\pi}{4}", "\\frac{3\\pi}{4}"] },
          {
            expr: `${k === 1 ? "" : k}\\sqrt{3} + ${kStr}i`,
            ans: "\\frac{\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{11\\pi}{6}"],
          },
          {
            expr: `${k} + ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{4\\pi}{3}"],
          },
          {
            expr: `-${k} + ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}"],
          },
          {
            expr: `-${k === 1 ? "" : k}\\sqrt{3} + ${kStr}i`,
            ans: "\\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{7\\pi}{6}"],
          },
          {
            expr: `-${k === 1 ? "" : k}\\sqrt{3} - ${kStr}i`,
            ans: "\\frac{7\\pi}{6}",
            wrong: ["\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}", "\\frac{11\\pi}{6}"],
          },
          {
            expr: `-${k} - ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{4\\pi}{3}",
            wrong: ["\\frac{2\\pi}{3}", "\\frac{5\\pi}{3}", "\\frac{7\\pi}{6}"],
          },
          {
            expr: `${k} - ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{5\\pi}{3}",
            wrong: ["\\frac{4\\pi}{3}", "\\frac{\\pi}{3}", "\\frac{11\\pi}{6}"],
          },
          {
            expr: `${k === 1 ? "" : k}\\sqrt{3} - ${kStr}i`,
            ans: "\\frac{11\\pi}{6}",
            wrong: ["\\frac{7\\pi}{6}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{6}"],
          },
        ]);
        const prompt = t(
          `Find the principal argument $\\theta = \\arg(z) \\in [0, 2\\pi)$ of $z = ${item.expr}$.`,
          `求复数 $z = ${item.expr}$ 在 $[0, 2\\pi)$ 内的主辐角 $\\theta = \\arg(z)$。`,
        );
        const right = t(`$\\theta = ${item.ans}$`, `$\\theta = ${item.ans}$`);
        const wrong = item.wrong.map((w) => t(`$\\theta = ${w}$`, `$\\theta = ${w}$`));
        const solution = t(
          `Determine the position of $z = ${item.expr}$ in the complex plane. Its angle with the positive real axis in $[0, 2\\pi)$ is $\\theta = ${item.ans}$.`,
          `观察 $z = ${item.expr}$ 在复平面中的位置。其与正实轴构成的在 $[0, 2\\pi)$ 内的角为 $\\theta = ${item.ans}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "argument-quadrant-rules",
      title: t("Quadrant adjustment rules for argument", "辐角的象限转换法则"),
      explanation: t(
        "To find the argument $\\theta \\in [0^\\circ, 360^\\circ)$ of $z = a + bi$, first compute the acute reference angle $\\alpha = \\arctan\\left(\\left|\\frac{b}{a}\\right|\\right)$:\n\n- **Quadrant I** ($a > 0, b > 0$): $\\theta = \\alpha$\n- **Quadrant II** ($a < 0, b > 0$): $\\theta = 180^\\circ - \\alpha$\n- **Quadrant III** ($a < 0, b < 0$): $\\theta = 180^\\circ + \\alpha$\n- **Quadrant IV** ($a > 0, b < 0$): $\\theta = 360^\\circ - \\alpha$",
        "求 $z = a + bi$ 在 $[0^\\circ, 360^\\circ)$ 内的辐角 $\\theta$ 时，先求锐角参考角 $\\alpha = \\arctan\\left(\\left|\\frac{b}{a}\\right|\\right)$：\n\n- **第一象限**（$a > 0, b > 0$）：$\\theta = \\alpha$\n- **第二象限**（$a < 0, b > 0$）：$\\theta = 180^\\circ - \\alpha$\n- **第三象限**（$a < 0, b < 0$）：$\\theta = 180^\\circ + \\alpha$\n- **第四象限**（$a > 0, b < 0$）：$\\theta = 360^\\circ - \\alpha$",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const quad = a > 0 ? (b > 0 ? "I" : "IV") : b > 0 ? "II" : "III";
        const prompt = t(
          `For the complex number $z = ${cx(a, b)}$, which formula correctly expresses its argument $\\theta \\in [0^\\circ, 360^\\circ)$ in terms of the reference angle $\\alpha = \\arctan\\left(\\frac{|b|}{|a|}\\right)$?`,
          `对于复数 $z = ${cx(a, b)}$，哪一个公式正确地利用参考角 $\\alpha = \\arctan\\left(\\frac{|b|}{|a|}\\right)$ 表示其辐角 $\\theta \\in [0^\\circ, 360^\\circ)$？`,
        );
        const map: Record<string, string> = {
          I: "\\theta = \\alpha",
          II: "\\theta = 180^\\circ - \\alpha",
          III: "\\theta = 180^\\circ + \\alpha",
          IV: "\\theta = 360^\\circ - \\alpha",
        };
        const right = t(`$${map[quad]}$`, `$${map[quad]}$`);
        const wrongQuads = ["I", "II", "III", "IV"].filter((q) => q !== quad);
        const wrong = wrongQuads.map((q) => t(`$${map[q]}$`, `$${map[q]}$`));
        const solution = t(
          `Since $a = ${a}$ and $b = ${b}$, $z$ lies in Quadrant ${quad}. Therefore, $\\theta = ${map[quad]}$.`,
          `因为 $a = ${a}$ 且 $b = ${b}$，复数 $z$ 位于第 ${quad} 象限。因此，$\\theta = ${map[quad]}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.30.4: Arithmetic in the Complex Plane ─────────────────────────

/** arithmeticInTheComplexPlane covers vector addition and subtraction in the complex plane. */
export const arithmeticInTheComplexPlane: TopicDef = {
  id: "arithmetic-in-the-complex-plane",
  title: t("Arithmetic in the Complex Plane", "复平面中的复数加减与几何对应"),
  summary: t(
    "Interpret complex addition and subtraction geometrically as vector addition (parallelogram rule) and displacement vectors in the complex plane.",
    "在复平面中将复数的加减法解释为向量加法（平行四边形法则）和位移向量。",
  ),
  prerequisites: ["the-argument-of-a-complex-number"],
  encompasses: [{ topic: "the-argument-of-a-complex-number", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5"],
  knowledgePoints: [
    {
      id: "parallelogram-rule-for-complex-addition",
      title: t("Parallelogram rule for complex addition", "复数加法的平行四边形法则"),
      explanation: t(
        "Adding two complex numbers $z_1 = a_1 + b_1 i$ and $z_2 = a_2 + b_2 i$ corresponds to vector addition in $\\mathbb{R}^2$:\n\n$$z_1 + z_2 = (a_1 + a_2) + (b_1 + b_2)i$$\n\nGeometrically, the origin $0$, $z_1$, $z_2$, and the sum $z_1 + z_2$ form the four vertices of a **parallelogram** in the complex plane.",
        "两个复数 $z_1 = a_1 + b_1 i$ 与 $z_2 = a_2 + b_2 i$ 的加法对应于 $\\mathbb{R}^2$ 中的向量加法：\n\n$$z_1 + z_2 = (a_1 + a_2) + (b_1 + b_2)i$$\n\n在几何上，原点 $0$、$z_1$、$z_2$ 以及和 $z_1 + z_2$ 构成了复平面上一个**平行四边形**的四个顶点。",
      ),
      generate(rng) {
        const a1 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const b1 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const a2 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const b2 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const sumA = a1 + a2;
        const sumB = b1 + b2;
        const prompt = t(
          `In the complex plane, the origin $0$, $z_1 = ${cx(a1, b1)}$, and $z_2 = ${cx(a2, b2)}$ form three vertices of a parallelogram. What complex number represents the fourth vertex (opposite the origin)?`,
          `在复平面中，原点 $0$、$z_1 = ${cx(a1, b1)}$ 和 $z_2 = ${cx(a2, b2)}$ 是一个平行四边形的三个顶点。与原点相对的第四个顶点对应的复数是什么？`,
        );
        const right = t(`$${cx(sumA, sumB)}$`, `$${cx(sumA, sumB)}$`);
        const wrong = [
          t(`$${cx(a1 - a2, b1 - b2)}$`, `$${cx(a1 - a2, b1 - b2)}$`),
          t(`$${cx(a2 - a1, b2 - b1)}$`, `$${cx(a2 - a1, b2 - b1)}$`),
          t(`$${cx(sumA, -sumB)}$`, `$${cx(sumA, -sumB)}$`),
          t(`$${cx(-sumA, sumB)}$`, `$${cx(-sumA, sumB)}$`),
        ];
        const solution = t(
          `By the parallelogram rule for vector addition, the fourth vertex opposite the origin is $z_1 + z_2 = (${cx(a1, b1)}) + (${cx(a2, b2)}) = ${cx(sumA, sumB)}$.`,
          `根据向量加法的平行四边形法则，与原点相对的第四个顶点为 $z_1 + z_2 = (${cx(a1, b1)}) + (${cx(a2, b2)}) = ${cx(sumA, sumB)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "complex-subtraction-as-displacement-and-midpoint",
      title: t("Subtraction as displacement and midpoint formula", "减法位移向量与中点公式"),
      explanation: t(
        "For complex numbers $z_1$ and $z_2$:\n\n- The difference $z_2 - z_1$ represents the **displacement vector** from $z_1$ to $z_2$.\n- The **midpoint** of the segment joining $z_1$ and $z_2$ is given by the average:\n\n$$M = \\frac{z_1 + z_2}{2}$$",
        "对于复数 $z_1$ 和 $z_2$：\n\n- 差 $z_2 - z_1$ 表示从 $z_1$ 指向 $z_2$ 的**位移向量**。\n- 连接 $z_1$ 与 $z_2$ 的线段**中点**由平均数给出：\n\n$$M = \\frac{z_1 + z_2}{2}$$",
      ),
      generate(rng) {
        const isMidpoint = rng.bool();
        if (isMidpoint) {
          const mx = rng.int(-6, 6);
          const my = rng.int(-6, 6);
          const dx = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          const dy = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          const a1 = mx - dx;
          const b1 = my - dy;
          const a2 = mx + dx;
          const b2 = my + dy;
          const prompt = t(
            `Find the midpoint of the line segment joining $z_1 = ${cx(a1, b1)}$ and $z_2 = ${cx(a2, b2)}$ in the complex plane.`,
            `求复平面中连接 $z_1 = ${cx(a1, b1)}$ 与 $z_2 = ${cx(a2, b2)}$ 的线段中点对应的复数。`,
          );
          const right = t(`$${cx(mx, my)}$`, `$${cx(mx, my)}$`);
          const wrong = [
            t(`$${cx(mx, -my)}$`, `$${cx(mx, -my)}$`),
            t(`$${cx(2 * dx, 2 * dy)}$`, `$${cx(2 * dx, 2 * dy)}$`),
            t(`$${cx(-mx, my)}$`, `$${cx(-mx, my)}$`),
            t(`$${cx(my, mx)}$`, `$${cx(my, mx)}$`),
          ];
          const solution = t(
            `$$M = \\frac{z_1 + z_2}{2} = \\frac{(${cx(a1, b1)}) + (${cx(a2, b2)})}{2} = \\frac{${2 * mx} + ${2 * my}i}{2} = ${cx(mx, my)}$$`,
            `$$M = \\frac{z_1 + z_2}{2} = \\frac{(${cx(a1, b1)}) + (${cx(a2, b2)})}{2} = \\frac{${2 * mx} + ${2 * my}i}{2} = ${cx(mx, my)}$$`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const a1 = rng.int(-5, 5);
        const b1 = rng.int(-5, 5);
        const a2 = rng.int(-5, 5);
        const b2 = rng.int(-5, 5);
        const diffA = a2 - a1;
        const diffB = b2 - b1;
        const prompt = t(
          `Which complex number represents the displacement vector from $z_1 = ${cx(a1, b1)}$ to $z_2 = ${cx(a2, b2)}$?`,
          `哪一个复数表示从 $z_1 = ${cx(a1, b1)}$ 指向 $z_2 = ${cx(a2, b2)}$ 的位移向量？`,
        );
        const right = t(`$${cx(diffA, diffB)}$`, `$${cx(diffA, diffB)}$`);
        const wrong = [
          t(`$${cx(-diffA, -diffB)}$`, `$${cx(-diffA, -diffB)}$`),
          t(`$${cx(a1 + a2, b1 + b2)}$`, `$${cx(a1 + a2, b1 + b2)}$`),
          t(`$${cx(diffA, -diffB)}$`, `$${cx(diffA, -diffB)}$`),
          t(`$${cx(-diffA, diffB)}$`, `$${cx(-diffA, diffB)}$`),
        ];
        const solution = t(
          `The displacement vector from $z_1$ to $z_2$ is $z_2 - z_1 = (${cx(a2, b2)}) - (${cx(a1, b1)}) = ${cx(diffA, diffB)}$.`,
          `从 $z_1$ 指向 $z_2$ 的位移向量为 $z_2 - z_1 = (${cx(a2, b2)}) - (${cx(a1, b1)}) = ${cx(diffA, diffB)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.30.5: Geometry in the Complex Plane ───────────────────────────

/** geometryInTheComplexPlane covers circles and perpendicular bisectors as loci in the complex plane. */
export const geometryInTheComplexPlane: TopicDef = {
  id: "geometry-in-the-complex-plane",
  title: t("Geometry in the Complex Plane", "复平面上的几何轨迹与图形"),
  summary: t(
    "Identify and describe loci of equations and inequalities in the complex plane, including circles |z - z0| = r and perpendicular bisectors |z - z1| = |z - z2|.",
    "识别并描述复平面中方程与不等式的几何轨迹，包括圆 |z - z0| = r 和垂直平分线 |z - z1| = |z - z2|。",
  ),
  prerequisites: ["arithmetic-in-the-complex-plane"],
  encompasses: [{ topic: "arithmetic-in-the-complex-plane", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5", "CCSS.HSG.GPE.A.1"],
  knowledgePoints: [
    {
      id: "circle-locus-in-the-complex-plane",
      title: t("Circles in the complex plane", "复平面中的圆轨迹"),
      explanation: t(
        "The equation $|z - z_0| = r$ (with $r > 0$) represents the set of all points $z$ whose distance from $z_0 = h + ki$ is equal to $r$.\n\nIn Cartesian coordinates, this is a **circle** with center $(h, k)$ and radius $r$:\n\n$$(x - h)^2 + (y - k)^2 = r^2$$",
        "方程 $|z - z_0| = r$（其中 $r > 0$）表示到定点 $z_0 = h + ki$ 的距离等于 $r$ 的所有点 $z$ 的集合。\n\n在笛卡尔坐标系中，这是一个以 $(h, k)$ 为圆心、以 $r$ 为半径的**圆**：\n\n$$(x - h)^2 + (y - k)^2 = r^2$$",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const r = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
        const z0Str = cxPar(h, k);
        const prompt = t(
          `What geometric figure in the complex plane is represented by the equation $|z - ${z0Str}| = ${r}$?`,
          `方程 $|z - ${z0Str}| = ${r}$ 在复平面中表示什么几何图形？`,
        );
        const right = t(`Circle centered at $(${h}, ${k})$ with radius $${r}$`, `以 $(${h}, ${k})$ 为圆心、半径为 $${r}$ 的圆`);
        const wrong = [
          t(`Circle centered at $(${-h}, ${-k})$ with radius $${r}$`, `以 $(${-h}, ${-k})$ 为圆心、半径为 $${r}$ 的圆`),
          t(`Circle centered at $(${h}, ${k})$ with radius $${r * r}$`, `以 $(${h}, ${k})$ 为圆心、半径为 $${r * r}$ 的圆`),
          t(`Circle centered at $(${k}, ${h})$ with radius $${r}$`, `以 $(${k}, ${h})$ 为圆心、半径为 $${r}$ 的圆`),
          t(`Line passing through $(${h}, ${k})$ with slope $${r}$`, `过点 $(${h}, ${k})$ 且斜率为 $${r}$ 的直线`),
        ];
        const solution = t(
          `$|z - (${cx(h, k)})| = ${r}$ means the distance from $z = x + yi$ to $z_0 = ${cx(h, k)}$ is constantly $${r}$. This is a circle with center $(${h}, ${k})$ and radius $r = ${r}$.`,
          `$|z - (${cx(h, k)})| = ${r}$ 表示点 $z = x + yi$ 到定点 $z_0 = ${cx(h, k)}$ 的距离恒等于 $${r}$。这是一个圆心为 $(${h}, ${k})$、半径为 $r = ${r}$ 的圆。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "perpendicular-bisector-locus-in-the-complex-plane",
      title: t("Perpendicular bisectors as complex loci", "垂直平分线的复数轨迹"),
      explanation: t(
        "The equation $|z - z_1| = |z - z_2|$ states that point $z$ is equidistant from $z_1$ and $z_2$.\n\nGeometrically, this represents the **perpendicular bisector** of the segment joining $z_1$ and $z_2$.",
        "方程 $|z - z_1| = |z - z_2|$ 表示点 $z$ 到两定点 $z_1$ 与 $z_2$ 的距离相等。\n\n在几何上，这表示连接 $z_1$ 和 $z_2$ 的线段的**垂直平分线**（中垂线）。",
      ),
      generate(rng) {
        const isHorizontal = rng.bool();
        if (isHorizontal) {
          const c = rng.int(-5, 5);
          const y1 = rng.pick([-6, -4, -2, 2, 4, 6]);
          const dy = rng.pick([2, 4, 6, 8]);
          const y2 = y1 + dy;
          const midY = (y1 + y2) / 2;
          const z1 = cx(c, y1);
          const z2 = cx(c, y2);
          const prompt = t(
            `What is the Cartesian equation of the locus $|z - (${z1})| = |z - (${z2})|$ in the complex plane?`,
            `复平面中轨迹方程 $|z - (${z1})| = |z - (${z2})|$ 对应的笛卡尔直角坐标方程是什么？`,
          );
          const right = t(`$y = ${midY}$`, `$y = ${midY}$`);
          const wrong = [
            t(`$x = ${midY}$`, `$x = ${midY}$`),
            t(`$y = ${-midY}$`, `$y = ${-midY}$`),
            t(`$x = ${c}$`, `$x = ${c}$`),
            t(`$y = ${y2 - y1}$`, `$y = ${y2 - y1}$`),
          ];
          const solution = t(
            `Points $z_1 = (${c}, ${y1})$ and $z_2 = (${c}, ${y2})$ have the same $x$-coordinate. The perpendicular bisector of the vertical segment connecting them is the horizontal line $y = \\frac{${y1} + ${y2}}{2} = ${midY}$.`,
            `两点 $z_1 = (${c}, ${y1})$ 与 $z_2 = (${c}, ${y2})$ 的横坐标相同。连接它们的垂直线段的中垂线是水平直线 $y = \\frac{${y1} + ${y2}}{2} = ${midY}$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const c = rng.int(-5, 5);
        const x1 = rng.pick([-6, -4, -2, 2, 4, 6]);
        const dx = rng.pick([2, 4, 6, 8]);
        const x2 = x1 + dx;
        const midX = (x1 + x2) / 2;
        const z1 = cx(x1, c);
        const z2 = cx(x2, c);
        const prompt = t(
          `What is the Cartesian equation of the locus $|z - (${z1})| = |z - (${z2})|$ in the complex plane?`,
          `复平面中轨迹方程 $|z - (${z1})| = |z - (${z2})|$ 对应的笛卡尔直角坐标方程是什么？`,
        );
        const right = t(`$x = ${midX}$`, `$x = ${midX}$`);
        const wrong = [
          t(`$y = ${midX}$`, `$y = ${midX}$`),
          t(`$x = ${-midX}$`, `$x = ${-midX}$`),
          t(`$y = ${c}$`, `$y = ${c}$`),
          t(`$x = ${x2 - x1}$`, `$x = ${x2 - x1}$`),
        ];
        const solution = t(
          `Points $z_1 = (${x1}, ${c})$ and $z_2 = (${x2}, ${c})$ have the same $y$-coordinate. The perpendicular bisector of the horizontal segment connecting them is the vertical line $x = \\frac{${x1} + ${x2}}{2} = ${midX}$.`,
          `两点 $z_1 = (${x1}, ${c})$ 与 $z_2 = (${x2}, ${c})$ 的纵坐标相同。连接它们的水平线段的中垂线是垂直直线 $x = \\frac{${x1} + ${x2}}{2} = ${midX}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.31: Further Complex Numbers ───────────────────────────────────

/** theComplexConjugate covers the definition, geometric reflection, and modulus-squared property. */
export const theComplexConjugate: TopicDef = {
  id: "the-complex-conjugate",
  title: t("The Complex Conjugate", "共轭复数"),
  summary: t(
    "Define the complex conjugate z̄ = a - bi of z = a + bi, interpret it geometrically as reflection across the real axis, and use the identity z·z̄ = |z|² = a² + b².",
    "定义复数 z = a + bi 的共轭复数 z̄ = a - bi，在几何上将其解释为关于实轴的对称反射，并运用恒等式 z·z̄ = |z|² = a² + b²。",
  ),
  prerequisites: ["the-complex-plane"],
  encompasses: [{ topic: "the-complex-plane", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.3"],
  knowledgePoints: [
    {
      id: "definition-and-reflection-of-conjugates",
      title: t("Definition and geometric reflection of the complex conjugate", "共轭复数的定义与几何反射"),
      explanation: t(
        "For any complex number $z = a + bi$, its **complex conjugate** is denoted $\\bar{z}$ (or $z^*$):\n\n$$\\bar{z} = a - bi$$\n\nGeometrically, taking the conjugate reflects the point $(a, b)$ across the **real axis** (the horizontal axis) to $(a, -b)$.",
        "对于任意复数 $z = a + bi$，其**共轭复数**记作 $\\bar{z}$：\n\n$$\\bar{z} = a - bi$$\n\n在几何上，取共轭相当于将点 $(a, b)$ 关于**实轴**（横轴）进行对称反射，得到点 $(a, -b)$。",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const prompt = t(
          `What is the complex conjugate $\\bar{z}$ of $z = ${cx(a, b)}$, and what geometric transformation maps $z$ to $\\bar{z}$ in the complex plane?`,
          `复数 $z = ${cx(a, b)}$ 的共轭复数 $\\bar{z}$ 是什么？在复平面中通过何种几何变换将 $z$ 映射为 $\\bar{z}$？`,
        );
        const right = t(`$\\bar{z} = ${cx(a, -b)}$, reflection across the real axis`, `$\\bar{z} = ${cx(a, -b)}$，关于实轴的对称反射`);
        const wrong = [
          t(`$\\bar{z} = ${cx(-a, b)}$, reflection across the imaginary axis`, `$\\bar{z} = ${cx(-a, b)}$，关于虚轴的对称反射`),
          t(`$\\bar{z} = ${cx(-a, -b)}$, reflection through the origin`, `$\\bar{z} = ${cx(-a, -b)}$，关于原点的中心对称`),
          t(`$\\bar{z} = ${cx(b, a)}$, reflection across $y = x$`, `$\\bar{z} = ${cx(b, a)}$，关于直线 $y = x$ 的对称`),
        ];
        const solution = t(
          `To find $\\bar{z}$, negate the imaginary part: $\\overline{${cx(a, b)}} = ${cx(a, -b)}$. Changing $(a, b)$ to $(a, -b)$ is a reflection across the real axis.`,
          `求共轭复数只需将虚部取反：$\\overline{${cx(a, b)}} = ${cx(a, -b)}$。将点 $(a, b)$ 变为 $(a, -b)$ 是关于实轴的对称反射。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "modulus-squared-identity",
      title: t("Product of conjugate pairs and modulus squared", "共轭复数乘积与模长平方恒等式"),
      explanation: t(
        "Multiplying a complex number by its conjugate always yields a non-negative real number equal to the square of its modulus:\n\n$$z \\bar{z} = (a + bi)(a - bi) = a^2 - (bi)^2 = a^2 - b^2 i^2 = a^2 + b^2 = |z|^2$$",
        "一个复数乘以其共轭复数的结果恒为一个非负实数，且等于其模长的平方：\n\n$$z \\bar{z} = (a + bi)(a - bi) = a^2 - (bi)^2 = a^2 - b^2 i^2 = a^2 + b^2 = |z|^2$$",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const prod = a * a + b * b;
        const prompt = t(
          `Evaluate the product $z \\bar{z}$ for $z = ${cx(a, b)}$.`,
          `计算复数 $z = ${cx(a, b)}$ 与其共轭的乘积 $z \\bar{z}$。`,
        );
        const right = t(`$${prod}$`, `$${prod}$`);
        const wrong = [
          t(`$${a * a - b * b}$`, `$${a * a - b * b}$`),
          t(`$${prod}i$`, `$${prod}i$`),
          t(`$${2 * a}$`, `$${2 * a}$`),
          t(`$${a * a - b * b}i$`, `$${a * a - b * b}i$`),
        ];
        const solution = t(
          `$$z \\bar{z} = (${cx(a, b)})(${cx(a, -b)}) = (${a})^2 + (${b})^2 = ${a * a} + ${b * b} = ${prod}$$`,
          `$$z \\bar{z} = (${cx(a, b)})(${cx(a, -b)}) = (${a})^2 + (${b})^2 = ${a * a} + ${b * b} = ${prod}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.31.2: Special Properties of the Complex Conjugate ─────────────

/** specialPropertiesOfTheComplexConjugate covers sum, product, and real/imaginary criteria. */
export const specialPropertiesOfTheComplexConjugate: TopicDef = {
  id: "special-properties-of-the-complex-conjugate",
  title: t("Special Properties of the Complex Conjugate", "共轭复数的特殊代数性质"),
  summary: t(
    "Apply algebraic properties of the conjugate: conj(z1 ± z2) = conj(z1) ± conj(z2), conj(z1 z2) = conj(z1) conj(z2), and recognize that z is real iff z = z̄ and purely imaginary iff z = -z̄.",
    "应用共轭复数的加、减、乘代数性质，并掌握 z 为实数当且仅当 z = z̄、为纯虚数当且仅当 z = -z̄。",
  ),
  prerequisites: ["the-complex-conjugate"],
  encompasses: [{ topic: "the-complex-conjugate", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.3"],
  knowledgePoints: [
    {
      id: "conjugate-of-arithmetic-operations",
      title: t("Conjugate of sum and product", "复数和与积的共轭性质"),
      explanation: t(
        "The complex conjugate distributes across addition, subtraction, multiplication, and division:\n\n1. $\\overline{z_1 + z_2} = \\bar{z}_1 + \\bar{z}_2$\n2. $\\overline{z_1 - z_2} = \\bar{z}_1 - \\bar{z}_2$\n3. $\\overline{z_1 z_2} = \\bar{z}_1 \\bar{z}_2$\n4. $\\overline{\\left(\\frac{z_1}{z_2}\\right)} = \\frac{\\bar{z}_1}{\\bar{z}_2}$\n5. $\\overline{z^n} = (\\bar{z})^n$",
        "共轭运算对加法、减法、乘法和除法均满足分配律：\n\n1. $\\overline{z_1 + z_2} = \\bar{z}_1 + \\bar{z}_2$\n2. $\\overline{z_1 - z_2} = \\bar{z}_1 - \\bar{z}_2$\n3. $\\overline{z_1 z_2} = \\bar{z}_1 \\bar{z}_2$\n4. $\\overline{\\left(\\frac{z_1}{z_2}\\right)} = \\frac{\\bar{z}_1}{\\bar{z}_2}$\n5. $\\overline{z^n} = (\\bar{z})^n$",
      ),
      generate(rng) {
        const a1 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const b1 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        // Pick a2, b2 ensuring z1 + z2 != 0 and z1 - z2 != 0
        let a2 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        while (a1 + a2 === 0) a2 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        let b2 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        while (b1 + b2 === 0) b2 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);

        const isSum = rng.bool();
        if (isSum) {
          const resA = a1 + a2;
          const resB = -(b1 + b2);
          const prompt = t(
            `If $z_1 = ${cx(a1, b1)}$ and $z_2 = ${cx(a2, b2)}$, evaluate $\\overline{z_1 + z_2}$.`,
            `已知 $z_1 = ${cx(a1, b1)}$ 且 $z_2 = ${cx(a2, b2)}$，求 $\\overline{z_1 + z_2}$。`,
          );
          const right = t(`$${cx(resA, resB)}$`, `$${cx(resA, resB)}$`);
          const wrong = [
            t(`$${cx(resA, -resB)}$`, `$${cx(resA, -resB)}$`),
            t(`$${cx(-resA, resB)}$`, `$${cx(-resA, resB)}$`),
            t(`$${cx(-resA, -resB)}$`, `$${cx(-resA, -resB)}$`),
            t(`$${cx(resB, resA)}$`, `$${cx(resB, resA)}$`),
            t(`$${cx(resA + 1, resB)}$`, `$${cx(resA + 1, resB)}$`),
          ];
          const solution = t(
            `$$\\overline{z_1 + z_2} = \\bar{z}_1 + \\bar{z}_2 = (${cx(a1, -b1)}) + (${cx(a2, -b2)}) = ${cx(resA, resB)}$$`,
            `$$\\overline{z_1 + z_2} = \\bar{z}_1 + \\bar{z}_2 = (${cx(a1, -b1)}) + (${cx(a2, -b2)}) = ${cx(resA, resB)}$$`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        // Product
        const pRe = a1 * a2 - b1 * b2;
        const pIm = a1 * b2 + a2 * b1;
        const ansRe = pRe;
        const ansIm = -pIm;
        const prompt = t(
          `If $z_1 = ${cx(a1, b1)}$ and $z_2 = ${cx(a2, b2)}$, evaluate $\\overline{z_1 z_2}$.`,
          `已知 $z_1 = ${cx(a1, b1)}$ 且 $z_2 = ${cx(a2, b2)}$，求 $\\overline{z_1 z_2}$。`,
        );
        const right = t(`$${cx(ansRe, ansIm)}$`, `$${cx(ansRe, ansIm)}$`);
        const wrong = [
          t(`$${cx(pRe, pIm)}$`, `$${cx(pRe, pIm)}$`),
          t(`$${cx(-ansRe, ansIm)}$`, `$${cx(-ansRe, ansIm)}$`),
          t(`$${cx(-ansRe, -ansIm)}$`, `$${cx(-ansRe, -ansIm)}$`),
          t(`$${cx(ansIm, ansRe)}$`, `$${cx(ansIm, ansRe)}$`),
          t(`$${cx(ansRe + 2, ansIm)}$`, `$${cx(ansRe + 2, ansIm)}$`),
        ];
        const solution = t(
          `$$z_1 z_2 = (${cx(a1, b1)})(${cx(a2, b2)}) = ${cx(pRe, pIm)}$$\n\n$$\\overline{z_1 z_2} = ${cx(ansRe, ansIm)}$$`,
          `$$z_1 z_2 = (${cx(a1, b1)})(${cx(a2, b2)}) = ${cx(pRe, pIm)}$$\n\n$$\\overline{z_1 z_2} = ${cx(ansRe, ansIm)}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "real-and-purely-imaginary-conjugate-criteria",
      title: t("Conjugate criteria for real and purely imaginary numbers", "实数与纯虚数的共轭判定准则"),
      explanation: t(
        "For any complex number $z = a + bi$:\n\n- $\\operatorname{Re}(z) = \\frac{z + \\bar{z}}{2} = a$\n- $\\operatorname{Im}(z) = \\frac{z - \\bar{z}}{2i} = b$\n\nImportant criteria:\n- $z$ is purely real $\\iff z = \\bar{z}$\n- $z$ is purely imaginary $\\iff z = -\\bar{z}$ (with $z \\neq 0$)",
        "对任意复数 $z = a + bi$：\n\n- $\\operatorname{Re}(z) = \\frac{z + \\bar{z}}{2} = a$\n- $\\operatorname{Im}(z) = \\frac{z - \\bar{z}}{2i} = b$\n\n重要判定法则：\n- $z$ 为实数 $\\iff z = \\bar{z}$\n- $z$ 为纯虚数 $\\iff z = -\\bar{z}$（且 $z \\neq 0$）",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const askReal = rng.bool();
        if (askReal) {
          const prompt = t(
            `For $z = ${cx(a, b)}$, find the value of $\\frac{z + \\bar{z}}{2}$.`,
            `对于复数 $z = ${cx(a, b)}$，求 $\\frac{z + \\bar{z}}{2}$ 的值。`,
          );
          const right = t(`$${a}$`, `$${a}$`);
          const wrong = [t(`$${b}$`, `$${b}$`), t(`$${-a}$`, `$${-a}$`), t(`$${a}i$`, `$${a}i$`), t(`$${b}i$`, `$${b}i$`)];
          const solution = t(
            `$$\\frac{z + \\bar{z}}{2} = \\frac{(${cx(a, b)}) + (${cx(a, -b)})}{2} = \\frac{${2 * a}}{2} = ${a}$$`,
            `$$\\frac{z + \\bar{z}}{2} = \\frac{(${cx(a, b)}) + (${cx(a, -b)})}{2} = \\frac{${2 * a}}{2} = ${a}$$`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const prompt = t(
          `For $z = ${cx(a, b)}$, find the value of $\\frac{z - \\bar{z}}{2i}$.`,
          `对于复数 $z = ${cx(a, b)}$，求 $\\frac{z - \\bar{z}}{2i}$ 的值。`,
        );
        const right = t(`$${b}$`, `$${b}$`);
        const wrong = [t(`$${a}$`, `$${a}$`), t(`$${-b}$`, `$${-b}$`), t(`$${b}i$`, `$${b}i$`), t(`$${a}i$`, `$${a}i$`)];
        const solution = t(
          `$$\\frac{z - \\bar{z}}{2i} = \\frac{(${cx(a, b)}) - (${cx(a, -b)})}{2i} = \\frac{${2 * b}i}{2i} = ${b}$$`,
          `$$\\frac{z - \\bar{z}}{2i} = \\frac{(${cx(a, b)}) - (${cx(a, -b)})}{2i} = \\frac{${2 * b}i}{2i} = ${b}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.31.3: Complex Conjugates and Roots of Quadratics ──────────────

/** theComplexConjugateAndTheRootsOfAQuadraticEquation covers the conjugate root theorem and reconstruction. */
export const theComplexConjugateAndTheRootsOfAQuadraticEquation: TopicDef = {
  id: "the-complex-conjugate-and-the-roots-of-a-quadratic-equation",
  title: t("The Complex Conjugate and the Roots of a Quadratic Equation", "共轭复数与一元二次方程的虚根"),
  summary: t(
    "Apply the Complex Conjugate Root Theorem to quadratic equations with real coefficients, recognizing that non-real roots occur in conjugate pairs p ± qi, and reconstruct equations from their roots.",
    "将共轭虚根定理应用于实系数一元二次方程，明确虚根成对出现 p ± qi，并根据根还原二次方程。",
  ),
  prerequisites: ["special-properties-of-the-complex-conjugate"],
  encompasses: [{ topic: "special-properties-of-the-complex-conjugate", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.C.7", "CCSS.HSN.CN.C.8"],
  knowledgePoints: [
    {
      id: "complex-conjugate-root-theorem",
      title: t("Complex Conjugate Root Theorem", "共轭虚根定理"),
      explanation: t(
        "**Complex Conjugate Root Theorem**:\nIf a polynomial with **real coefficients** has a complex root $z_1 = p + qi$ (where $q \\neq 0$), then its complex conjugate $z_2 = p - qi$ is also a root.\n\nFor a quadratic equation $ax^2 + bx + c = 0$ ($a, b, c \\in \\mathbb{R}$) with negative discriminant $\\Delta < 0$, the two roots are always a conjugate pair $p \\pm qi$.",
        "**共轭虚根定理**：\n若一个**实系数多项式**有一个复数根 $z_1 = p + qi$（$q \\neq 0$），则其共轭复数 $z_2 = p - qi$ 也必然是该多项式的一个根。\n\n对于判别式 $\\Delta < 0$ 的实系数一元二次方程 $ax^2 + bx + c = 0$，其两个解必为一对共轭虚根 $p \\pm qi$。",
      ),
      generate(rng) {
        const p = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const q = rng.pick([1, 2, 3, 4, 5, 6, 7, 8]);
        const prompt = t(
          `A quadratic equation with real coefficients has a root $x = ${cx(p, q)}$. What must be the other root of the equation?`,
          `一个实系数一元二次方程的一个根为 $x = ${cx(p, q)}$。该方程的另一个根必然是什么？`,
        );
        const right = t(`$x = ${cx(p, -q)}$`, `$x = ${cx(p, -q)}$`);
        const wrong = [
          t(`$x = ${cx(-p, q)}$`, `$x = ${cx(-p, q)}$`),
          t(`$x = ${cx(-p, -q)}$`, `$x = ${cx(-p, -q)}$`),
          t(`$x = ${cx(q, p)}$`, `$x = ${cx(q, p)}$`),
          t(`$x = ${cx(-q, -p)}$`, `$x = ${cx(-q, -p)}$`),
        ];
        const solution = t(
          `By the Complex Conjugate Root Theorem, because all coefficients are real, non-real roots occur in conjugate pairs. Thus, the other root is the conjugate $\\overline{${cx(p, q)}} = ${cx(p, -q)}$.`,
          `根据共轭虚根定理，实系数多项式的虚根必成对出现。因此，另一个根是该根的共轭复数 $\\overline{${cx(p, q)}} = ${cx(p, -q)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "reconstruct-quadratic-from-conjugate-roots",
      title: t("Reconstruct quadratic equations from complex conjugate roots", "由共轭复数根还原一元二次方程"),
      explanation: t(
        "A monic quadratic equation with roots $x = p \\pm qi$ can be reconstructed using Vieta's formulas:\n\n- $\\text{Sum of roots} = (p + qi) + (p - qi) = 2p$\n- $\\text{Product of roots} = (p + qi)(p - qi) = p^2 + q^2$\n\nThe equation is:\n$$x^2 - (2p)x + (p^2 + q^2) = 0$$",
        "以 $x = p \\pm qi$ 为根的一元二次方程可通过韦达定理写出：\n\n- 两根之和 $= (p + qi) + (p - qi) = 2p$\n- 两根之积 $= (p + qi)(p - qi) = p^2 + q^2$\n\n对应的首一二次方程为：\n$$x^2 - (2p)x + (p^2 + q^2) = 0$$",
      ),
      generate(rng) {
        const p = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const q = rng.pick([1, 2, 3, 4, 5]);
        const sum = 2 * p;
        const prod = p * p + q * q;
        const linTerm = sum === 0 ? "" : sum > 0 ? `- ${sum}x` : `+ ${-sum}x`;
        const eqStr = `x^2 ${linTerm} + ${prod} = 0`;
        const prompt = t(
          `Find the monic quadratic equation with real coefficients whose roots are $x = ${cx(p, q)}$ and $x = ${cx(p, -q)}$.`,
          `求以 $x = ${cx(p, q)}$ 和 $x = ${cx(p, -q)}$ 为两根且最高次项系数为 $1$ 的实系数一元二次方程。`,
        );
        const right = t(`$${eqStr}$`, `$${eqStr}$`);
        const wrongLin = sum === 0 ? "" : sum > 0 ? `+ ${sum}x` : `- ${-sum}x`;
        const wrongProdSub = p * p - q * q;
        const wrong = [
          t(`$x^2 ${wrongLin} + ${prod} = 0$`, `$x^2 ${wrongLin} + ${prod} = 0$`),
          t(`$x^2 ${linTerm} + ${wrongProdSub} = 0$`, `$x^2 ${linTerm} + ${wrongProdSub} = 0$`),
          t(`$x^2 ${linTerm} - ${prod} = 0$`, `$x^2 ${linTerm} - ${prod} = 0$`),
        ];
        const solution = t(
          `Sum of roots $= (${cx(p, q)}) + (${cx(p, -q)}) = ${sum}$.\nProduct of roots $= (${cx(p, q)})(${cx(p, -q)}) = ${p}^2 + ${q}^2 = ${prod}$.\n\nThe equation is $x^2 - (${sum})x + ${prod} = 0$, which is $${eqStr}$.`,
          `两根之和 $= (${cx(p, q)}) + (${cx(p, -q)}) = ${sum}$。\n两根之积 $= (${cx(p, q)})(${cx(p, -q)}) = ${p}^2 + ${q}^2 = ${prod}$。\n\n方程为 $x^2 - (${sum})x + ${prod} = 0$，即 $${eqStr}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.31.4: Dividing Complex Numbers ─────────────────────────────────

/** dividingComplexNumbers covers division by multiplying numerator and denominator by conjugate. */
export const dividingComplexNumbers: TopicDef = {
  id: "dividing-complex-numbers",
  title: t("Dividing Complex Numbers", "复数的除法运算"),
  summary: t(
    "Divide complex numbers in rectangular form by multiplying numerator and denominator by the complex conjugate of the denominator: z1 / z2 = (z1 conj(z2)) / |z2|².",
    "通过将分子与分母同乘分母的共轭复数来计算复数的除法：z1 / z2 = (z1 conj(z2)) / |z2|²。",
  ),
  prerequisites: ["the-complex-conjugate"],
  encompasses: [{ topic: "the-complex-conjugate", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.3"],
  knowledgePoints: [
    {
      id: "reciprocal-of-a-complex-number",
      title: t("Reciprocal of a complex number", "复数的倒数运算"),
      explanation: t(
        "To find the reciprocal $\\frac{1}{z} = \\frac{1}{a + bi}$, multiply the numerator and denominator by the conjugate $\\bar{z} = a - bi$:\n\n$$\\frac{1}{a + bi} = \\frac{a - bi}{(a + bi)(a - bi)} = \\frac{a - bi}{a^2 + b^2} = \\frac{a}{a^2 + b^2} - \\frac{b}{a^2 + b^2}i$$",
        "求复数的倒数 $\\frac{1}{z} = \\frac{1}{a + bi}$ 时，将分子分母同乘共轭复数 $\\bar{z} = a - bi$：\n\n$$\\frac{1}{a + bi} = \\frac{a - bi}{(a + bi)(a - bi)} = \\frac{a - bi}{a^2 + b^2} = \\frac{a}{a^2 + b^2} - \\frac{b}{a^2 + b^2}i$$",
      ),
      generate(rng) {
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const den = a * a + b * b;
        const ansStr = cxFrac(a, -b, den);
        const prompt = t(
          `Express the reciprocal $\\frac{1}{${cx(a, b)}}$ in standard form $a + bi$.`,
          `将倒数 $\\frac{1}{${cx(a, b)}}$ 写成代数标准形式 $a + bi$。`,
        );
        const right = t(`$${ansStr}$`, `$${ansStr}$`);
        const wrong = [
          t(`$${cxFrac(a, b, den)}$`, `$${cxFrac(a, b, den)}$`),
          t(`$${cxFrac(-a, -b, den)}$`, `$${cxFrac(-a, -b, den)}$`),
          t(`$${cxFrac(b, -a, den)}$`, `$${cxFrac(b, -a, den)}$`),
          t(`$${cx(a, -b)}$`, `$${cx(a, -b)}$`),
        ];
        const solution = t(
          `$$\\frac{1}{${cx(a, b)}} = \\frac{${cx(a, -b)}}{(${cx(a, b)})(${cx(a, -b)})} = \\frac{${cx(a, -b)}}{${den}} = ${ansStr}$$`,
          `$$\\frac{1}{${cx(a, b)}} = \\frac{${cx(a, -b)}}{(${cx(a, b)})(${cx(a, -b)})} = \\frac{${cx(a, -b)}}{${den}} = ${ansStr}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "quotient-of-two-complex-numbers",
      title: t("Quotient of two complex numbers", "两复数相除"),
      explanation: t(
        "To divide two complex numbers $\\frac{z_1}{z_2} = \\frac{a + bi}{c + di}$, multiply the numerator and denominator by $\\bar{z}_2 = c - di$:\n\n$$\\frac{a + bi}{c + di} = \\frac{(a + bi)(c - di)}{c^2 + d^2} = \\frac{(ac + bd) + (bc - ad)i}{c^2 + d^2}$$",
        "计算两个复数的商 $\\frac{z_1}{z_2} = \\frac{a + bi}{c + di}$ 时，分子分母同乘分母的共轭复数 $\\bar{z}_2 = c - di$：\n\n$$\\frac{a + bi}{c + di} = \\frac{(a + bi)(c - di)}{c^2 + d^2} = \\frac{(ac + bd) + (bc - ad)i}{c^2 + d^2}$$",
      ),
      generate(rng) {
        const z2 = rng.pick([
          { c: 1, d: 1 },
          { c: 1, d: -1 },
          { c: 2, d: 1 },
          { c: 2, d: -1 },
          { c: 1, d: 2 },
          { c: 3, d: 1 },
        ]);
        const u = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const v = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const numA = z2.c * u - z2.d * v;
        const numB = z2.c * v + z2.d * u;
        const prompt = t(
          `Evaluate the quotient $\\frac{${cx(numA, numB)}}{${cx(z2.c, z2.d)}}$ and write in standard form $a + bi$.`,
          `计算商 $\\frac{${cx(numA, numB)}}{${cx(z2.c, z2.d)}}$ 并写成标准形式 $a + bi$。`,
        );
        const right = t(`$${cx(u, v)}$`, `$${cx(u, v)}$`);
        const wrong = [
          t(`$${cx(u, -v)}$`, `$${cx(u, -v)}$`),
          t(`$${cx(-u, v)}$`, `$${cx(-u, v)}$`),
          t(`$${cx(v, u)}$`, `$${cx(v, u)}$`),
          t(`$${cx(-u, -v)}$`, `$${cx(-u, -v)}$`),
        ];
        const denom = z2.c * z2.c + z2.d * z2.d;
        const solution = t(
          `Multiply numerator and denominator by the conjugate of the denominator, ${cx(z2.c, -z2.d)}:\n\n$$\\frac{(${cx(numA, numB)})(${cx(z2.c, -z2.d)})}{${denom}} = \\frac{${u * denom} + ${v * denom}i}{${denom}} = ${cx(u, v)}$$`,
          `分子分母同乘分母的共轭复数 ${cx(z2.c, -z2.d)}：\n\n$$\\frac{(${cx(numA, numB)})(${cx(z2.c, -z2.d)})}{${denom}} = \\frac{${u * denom} + ${v * denom}i}{${denom}} = ${cx(u, v)}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.31.5: Equating Real and Imaginary Parts ───────────────────────

/** solvingEquationsByEquatingRealAndImaginaryParts covers solving complex equations by equating parts. */
export const solvingEquationsByEquatingRealAndImaginaryParts: TopicDef = {
  id: "solving-equations-by-equating-real-and-imaginary-parts",
  title: t("Solving Equations by Equating Real and Imaginary Parts", "比较实部与虚部解复数方程"),
  summary: t(
    "Solve complex equations for unknown real numbers x and y by equating real parts and imaginary parts on both sides of the equation.",
    "通过使方程两边的实部与虚部分别相等，求解关于未知实数 x 与 y 的复数方程。",
  ),
  prerequisites: ["dividing-complex-numbers"],
  encompasses: [{ topic: "dividing-complex-numbers", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.1", "CCSS.HSN.CN.A.2"],
  knowledgePoints: [
    {
      id: "equating-real-and-imaginary-parts-linear",
      title: t("Equate real and imaginary parts to solve for variables", "比较实部与虚部求解实变量"),
      explanation: t(
        "Two complex numbers are equal if and only if both their real parts and their imaginary parts are equal:\n\n$$A + Bi = C + Di \\iff A = C \\text{ and } B = D$$\n\nThis fundamental principle turns a single complex equation into a system of two real equations.",
        "两个复数相等当且仅当它们的实部与虚部分别对应相等：\n\n$$A + Bi = C + Di \\iff A = C \\text{ 且 } B = D$$\n\n这一基本原理将一个复数方程转化为关于实变量的两个独立实方程。",
      ),
      generate(rng) {
        const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const a = rng.pick([2, 3, 4, 5]);
        const c = rng.pick([2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const d = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const p = a * x + b;
        const q = c * y + d;
        const leftReal = `${a}x ${b >= 0 ? `+ ${b}` : `- ${-b}`}`;
        const leftImag = `${c}y ${d >= 0 ? `+ ${d}` : `- ${-d}`}`;
        const prompt = t(
          `Find the real numbers $x$ and $y$ that satisfy $(${leftReal}) + (${leftImag})i = ${cx(p, q)}$.`,
          `求满足方程 $(${leftReal}) + (${leftImag})i = ${cx(p, q)}$ 的实数 $x$ 和 $y$。`,
        );
        const right = t(`$x = ${x}, \\; y = ${y}$`, `$x = ${x}, \\; y = ${y}$`);
        const wrong = [
          t(`$x = ${y}, \\; y = ${x}$`, `$x = ${y}, \\; y = ${x}$`),
          t(`$x = ${-x}, \\; y = ${y}$`, `$x = ${-x}, \\; y = ${y}$`),
          t(`$x = ${x}, \\; y = ${-y}$`, `$x = ${x}, \\; y = ${-y}$`),
          t(`$x = ${-x}, \\; y = ${-y}$`, `$x = ${-x}, \\; y = ${-y}$`),
        ];
        const solution = t(
          `Equate real parts: $${a}x ${b >= 0 ? `+ ${b}` : `- ${-b}`} = ${p} \\implies ${a}x = ${p - b} \\implies x = ${x}$.\nEquate imaginary parts: $${c}y ${d >= 0 ? `+ ${d}` : `- ${-d}`} = ${q} \\implies ${c}y = ${q - d} \\implies y = ${y}$.`,
          `令实部相等：$${a}x ${b >= 0 ? `+ ${b}` : `- ${-b}`} = ${p} \\implies ${a}x = ${p - b} \\implies x = ${x}$。\n令虚部相等：$${c}y ${d >= 0 ? `+ ${d}` : `- ${-d}`} = ${q} \\implies ${c}y = ${q - d} \\implies y = ${y}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "equations-with-complex-conjugates",
      title: t("Equations involving conjugates", "含共轭复数的方程求解"),
      explanation: t(
        "To solve an equation containing both $z$ and its conjugate $\\bar{z}$, substitute $z = x + yi$ and $\\bar{z} = x - yi$ (with $x, y \\in \\mathbb{R}$), expand, and equate real and imaginary parts.",
        "求解同时含有未知数 $z$ 及其共轭 $\\bar{z}$ 的方程时，设 $z = x + yi$ 且 $\\bar{z} = x - yi$（其中 $x, y \\in \\mathbb{R}$），展开后分别令两边的实部与虚部相等即可求解。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3]);
        const m = 1;
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const bigA = (k + m) * x;
        const bigB = (k - m) * y;
        const prompt = t(
          `Find the complex number $z = x + yi$ ($x, y \\in \\mathbb{R}$) that satisfies $${k}z + \\bar{z} = ${cx(bigA, bigB)}$.`,
          `设 $x, y \\in \\mathbb{R}$，求满足方程 $${k}z + \\bar{z} = ${cx(bigA, bigB)}$ 的复数 $z = x + yi$。`,
        );
        const right = t(`$z = ${cx(x, y)}$`, `$z = ${cx(x, y)}$`);
        const wrong = [
          t(`$z = ${cx(x, -y)}$`, `$z = ${cx(x, -y)}$`),
          t(`$z = ${cx(-x, y)}$`, `$z = ${cx(-x, y)}$`),
          t(`$z = ${cx(y, x)}$`, `$z = ${cx(y, x)}$`),
          t(`$z = ${cx(-x, -y)}$`, `$z = ${cx(-x, -y)}$`),
        ];
        const solution = t(
          `Substitute $z = x + yi$ and $\\bar{z} = x - yi$:\n$$${k}(x + yi) + (x - yi) = (${k + m})x + (${k - m})yi = ${cx(bigA, bigB)}$$\nEquating real parts: $${k + m}x = ${bigA} \\implies x = ${x}$.\nEquating imaginary parts: $${k - m}y = ${bigB} \\implies y = ${y}$.\nThus, $z = ${cx(x, y)}$.`,
          `代入 $z = x + yi$ 与 $\\bar{z} = x - yi$：\n$$${k}(x + yi) + (x - yi) = (${k + m})x + (${k - m})yi = ${cx(bigA, bigB)}$$\n实部相等：$${k + m}x = ${bigA} \\implies x = ${x}$。\n虚部相等：$${k - m}y = ${bigB} \\implies y = ${y}$。\n因此，$z = ${cx(x, y)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.31.6: Extending Polynomial Identities ─────────────────────────

/** extendingPolynomialIdentitiesToTheComplexNumbers covers sum of squares and factoring over C. */
export const extendingPolynomialIdentitiesToTheComplexNumbers: TopicDef = {
  id: "extending-polynomial-identities-to-the-complex-numbers",
  title: t("Extending Polynomial Identities to the Complex Numbers", "复数范围内的多项式恒等式与因式分解"),
  summary: t(
    "Extend algebraic identities such as the sum of squares a² + b² = (a + bi)(a - bi) to the complex numbers, and factor quadratic expressions completely over C.",
    "将平方和公式 a² + b² = (a + bi)(a - bi) 推广到复数域，并在复数范围内彻底因式分解二次多项式。",
  ),
  prerequisites: ["the-complex-conjugate-and-the-roots-of-a-quadratic-equation"],
  encompasses: [{ topic: "the-complex-conjugate-and-the-roots-of-a-quadratic-equation", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSA.SSE.A.2", "CCSS.HSN.CN.C.8"],
  knowledgePoints: [
    {
      id: "factoring-sum-of-squares",
      title: t("Factoring sum of squares over complex numbers", "在复数范围内分解平方和"),
      explanation: t(
        "Over the real numbers, a sum of squares $a^2 + b^2$ cannot be factored into linear real factors. Over the complex numbers, since $i^2 = -1$, we can write $b^2 = -(bi)^2$, giving the difference of squares:\n\n$$a^2 + b^2 = a^2 - (bi)^2 = (a + bi)(a - bi)$$\n\nFor example: $x^2 + 9 = (x + 3i)(x - 3i)$ and $4x^2 + 25 = (2x + 5i)(2x - 5i)$.",
        "在实数范围内，平方和 $a^2 + b^2$ 无法分解为一次实因式。但在复数范围内，利用 $i^2 = -1$，可将 $b^2$ 改写为 $-(bi)^2$，从而利用平方差公式进行因式分解：\n\n$$a^2 + b^2 = a^2 - (bi)^2 = (a + bi)(a - bi)$$\n\n例如：$x^2 + 9 = (x + 3i)(x - 3i)$，以及 $4x^2 + 25 = (2x + 5i)(2x - 5i)$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 5]);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const aSq = a * a;
        const bSq = b * b;
        const exprStr = a === 1 ? `x^2 + ${bSq}` : `${aSq}x^2 + ${bSq}`;
        const axStr = a === 1 ? "x" : `${a}x`;
        const prompt = t(
          `Factor the expression $${exprStr}$ completely over the complex numbers.`,
          `在复数范围内彻底因式分解式子 $${exprStr}$。`,
        );
        const right = t(`$(${axStr} + ${b}i)(${axStr} - ${b}i)$`, `$(${axStr} + ${b}i)(${axStr} - ${b}i)$`);
        const wrong = [
          t(`$(${axStr} + ${b})(${axStr} - ${b})$`, `$(${axStr} + ${b})(${axStr} - ${b})$`),
          t(`$(${axStr} + ${b}i)^2$`, `$(${axStr} + ${b}i)^2$`),
          t(`$(${axStr} - ${b}i)^2$`, `$(${axStr} - ${b}i)^2$`),
          t(`$(${axStr} + ${bSq}i)(${axStr} - ${bSq}i)$`, `$(${axStr} + ${bSq}i)(${axStr} - ${bSq}i)$`),
        ];
        const solution = t(
          `Rewrite as a difference of squares: $${exprStr} = (${axStr})^2 - (${b}i)^2 = (${axStr} + ${b}i)(${axStr} - ${b}i)$.`,
          `写成平方差形式：$${exprStr} = (${axStr})^2 - (${b}i)^2 = (${axStr} + ${b}i)(${axStr} - ${b}i)$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "factoring-quadratics-over-complex-numbers",
      title: t("Factoring general quadratics over the complex numbers", "在复数范围内分解二次多项式"),
      explanation: t(
        "Every quadratic $x^2 - 2px + (p^2 + q^2)$ with complex roots $p \\pm qi$ factors completely over $\\mathbb{C}$ as:\n\n$$[x - (p + qi)][x - (p - qi)]$$\n\nFor instance, $x^2 - 6x + 13 = (x - 3)^2 + 4 = [x - (3 + 2i)][x - (3 - 2i)]$.",
        "每一个具有共轭虚根 $p \\pm qi$ 的二次多项式 $x^2 - 2px + (p^2 + q^2)$ 在复数域 $\\mathbb{C}$ 上都可分解为：\n\n$$[x - (p + qi)][x - (p - qi)]$$\n\n例如，$x^2 - 6x + 13 = (x - 3)^2 + 4 = [x - (3 + 2i)][x - (3 - 2i)]$。",
      ),
      generate(rng) {
        const p = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const q = rng.pick([1, 2, 3, 4, 5]);
        const lin = -2 * p;
        const constTerm = p * p + q * q;
        const polyStr = `x^2 ${lin > 0 ? `+ ${lin}x` : `- ${-lin}x`} + ${constTerm}`;
        const z1Str = cx(p, q);
        const z2Str = cx(p, -q);
        const prompt = t(
          `Factor the polynomial $P(x) = ${polyStr}$ completely into linear factors over $\\mathbb{C}$.`,
          `在复数域 $\\mathbb{C}$ 上将多项式 $P(x) = ${polyStr}$ 彻底分解为一次因式。`,
        );
        const right = t(`$[x - (${z1Str})][x - (${z2Str})]$`, `$[x - (${z1Str})][x - (${z2Str})]$`);
        const wrong = [
          t(`$[x + (${z1Str})][x + (${z2Str})]$`, `$[x + (${z1Str})][x + (${z2Str})]$`),
          t(`$[x - (${z1Str})]^2$`, `$[x - (${z1Str})]^2$`),
          t(`$(x - ${p} - ${q})(x - ${p} + ${q})$`, `$(x - ${p} - ${q})(x - ${p} + ${q})$`),
        ];
        const solution = t(
          `Completing the square gives $(x - ${p})^2 + ${q * q} = (x - ${p})^2 - (${q}i)^2 = [x - (${z1Str})][x - (${z2Str})]$.`,
          `配方可得 $(x - ${p})^2 + ${q * q} = (x - ${p})^2 - (${q}i)^2 = [x - (${z1Str})][x - (${z2Str})]$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.32: Complex Numbers in Polar Form ─────────────────────────────

/** thePolarFormOfAComplexNumber covers conversion between rectangular and polar form. */
export const thePolarFormOfAComplexNumber: TopicDef = {
  id: "the-polar-form-of-a-complex-number",
  title: t("The Polar Form of a Complex Number", "复数的三角形式（极坐标形式）"),
  summary: t(
    "Convert complex numbers between rectangular form a + bi and polar (trigonometric) form r(cos θ + i sin θ), where r = |z| ≥ 0 is the modulus and θ = arg(z) is the argument.",
    "实现复数在代数形式 a + bi 与三角形式（极坐标形式）r(cos θ + i sin θ) 之间的相互转换，其中 r = |z| ≥ 0 为模长，θ = arg(z) 为辐角。",
  ),
  prerequisites: ["the-argument-of-a-complex-number"],
  encompasses: [{ topic: "the-argument-of-a-complex-number", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  knowledgePoints: [
    {
      id: "convert-rectangular-to-polar-form",
      title: t("Convert rectangular form to polar form", "将代数形式转换为三角形式"),
      explanation: t(
        "The **polar form** (or trigonometric form) of $z = a + bi$ is:\n\n$$z = r(\\cos\\theta + i\\sin\\theta)$$\n\nwhere:\n- $r = |z| = \\sqrt{a^2 + b^2} \\ge 0$ is the **modulus**\n- $\\theta = \\arg(z)$ is the **argument** with $a = r\\cos\\theta$ and $b = r\\sin\\theta$",
        "复数 $z = a + bi$ 的**三角形式**（或极坐标形式）为：\n\n$$z = r(\\cos\\theta + i\\sin\\theta)$$\n\n其中：\n- $r = |z| = \\sqrt{a^2 + b^2} \\ge 0$ 为**模长**\n- $\\theta = \\arg(z)$ 为**辐角**，满足 $a = r\\cos\\theta$ 且 $b = r\\sin\\theta$",
      ),
      generate(rng) {
        const items = getSpecialPolarItems();
        const item = rng.pick(items);
        const prompt = t(
          `Convert $z = ${item.rect}$ into polar form $r(\\cos\\theta + i\\sin\\theta)$ with $r > 0$ and $0 \\le \\theta < 2\\pi$.`,
          `将 $z = ${item.rect}$ 转换为三角形式 $r(\\cos\\theta + i\\sin\\theta)$，其中 $r > 0$ 且 $0 \\le \\theta < 2\\pi$。`,
        );
        const right = t(
          `$${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$`,
          `$${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$`,
        );
        const wrong = [
          ...item.wrongThetas.map((w) =>
            t(
              `$${item.r}\\left(\\cos\\left(${w}\\right) + i\\sin\\left(${w}\\right)\\right)$`,
              `$${item.r}\\left(\\cos\\left(${w}\\right) + i\\sin\\left(${w}\\right)\\right)$`,
            ),
          ),
          t(
            `$${item.r * 2}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$`,
            `$${item.r * 2}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$`,
          ),
        ];
        const solution = t(
          `Modulus $r = |z| = ${item.r}$.\nArgument $\\theta = ${item.theta}$.\nThus, $z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$.`,
          `模长 $r = |z| = ${item.r}$。\n辐角 $\\theta = ${item.theta}$。\n因此，$z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "convert-polar-to-rectangular-form",
      title: t("Convert polar form to rectangular form", "将三角形式转换为代数形式"),
      explanation: t(
        "To convert $z = r(\\cos\\theta + i\\sin\\theta)$ to rectangular form $a + bi$, evaluate $\\cos\\theta$ and $\\sin\\theta$, then distribute $r$:\n\n$$a = r\\cos\\theta, \\quad b = r\\sin\\theta$$\n\n$$z = (r\\cos\\theta) + (r\\sin\\theta)i$$",
        "将三角形式 $z = r(\\cos\\theta + i\\sin\\theta)$ 转换为代数形式 $a + bi$ 时，先求出 $\\cos\\theta$ 与 $\\sin\\theta$ 的精确值，再乘以模长 $r$：\n\n$$a = r\\cos\\theta, \\quad b = r\\sin\\theta$$\n\n$$z = (r\\cos\\theta) + (r\\sin\\theta)i$$",
      ),
      generate(rng) {
        const items = getSpecialPolarItems();
        const item = rng.pick(items);
        const prompt = t(
          `Convert $z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$ into rectangular form $a + bi$.`,
          `将 $z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$ 转换为代数形式 $a + bi$。`,
        );
        const right = t(`$${item.rect}$`, `$${item.rect}$`);
        const wrong = item.wrongRects.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = t(
          `Evaluate the trigonometric values at $\\theta = ${item.theta}$ and multiply by $r = ${item.r}$:\n$$z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right) = ${item.rect}$$`,
          `求出 $\\theta = ${item.theta}$ 处的三角函数值并乘以模长 $r = ${item.r}$：\n$$z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right) = ${item.rect}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.32.2: Products of Complex Numbers in Polar Form ───────────────

/** productsOfComplexNumbersExpressedInPolarForm covers multiplying moduli and adding arguments. */
export const productsOfComplexNumbersExpressedInPolarForm: TopicDef = {
  id: "products-of-complex-numbers-expressed-in-polar-form",
  title: t("Products of Complex Numbers Expressed in Polar Form", "复数三角形式的乘法法则"),
  summary: t(
    "Multiply complex numbers in polar form using the rule z1 z2 = r1 r2 [cos(θ1 + θ2) + i sin(θ1 + θ2)], multiplying moduli and adding arguments, and interpret geometrically as rotation and dilation.",
    "使用模长相乘、辐角相加的运算法则计算复数三角形式的乘积：z1 z2 = r1 r2 [cos(θ1 + θ2) + i sin(θ1 + θ2)]，并在几何上解释为旋转与伸缩变换。",
  ),
  prerequisites: ["the-polar-form-of-a-complex-number"],
  encompasses: [{ topic: "the-polar-form-of-a-complex-number", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5"],
  knowledgePoints: [
    {
      id: "multiplication-rule-in-polar-form",
      title: t("Multiplication rule in polar form", "三角形式的乘法法则"),
      explanation: t(
        "To multiply two complex numbers in polar form, **multiply their moduli** and **add their arguments**:\n\n$$z_1 z_2 = r_1 r_2 \\left[\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\right]$$\n\nIf the resulting angle exceeds $360^\\circ$ (or $2\\pi$), subtract full turns to express it in $[0, 360^\\circ)$ or $[0, 2\\pi)$.",
        "计算三角形式复数的乘积时，法则为**模长相乘、辐角相加**：\n\n$$z_1 z_2 = r_1 r_2 \\left[\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\right]$$\n\n若所得角度超过 $360^\\circ$（或 $2\\pi$），则减去 $360^\\circ$ 的整数倍化简至 $[0, 360^\\circ)$ 或 $[0, 2\\pi)$ 内。",
      ),
      generate(rng) {
        const r1 = rng.pick([2, 3, 4, 5]);
        const r2 = rng.pick([2, 3, 4, 5]);
        const a1 = rng.pick([20, 30, 40, 45, 50, 60, 70, 80, 90]);
        const a2 = rng.pick([15, 25, 30, 45, 60, 75, 90, 120]);
        const rProd = r1 * r2;
        const sumAngle = (a1 + a2) % 360;
        const prompt = t(
          `Multiply $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ and $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$.`,
          `计算 $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ 与 $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$ 的乘积。`,
        );
        const right = t(
          `$${rProd}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$`,
          `$${rProd}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$`,
        );
        const diffAngle = Math.abs(a1 - a2);
        const wrong = [
          t(
            `$${r1 + r2}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$`,
            `$${r1 + r2}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$`,
          ),
          t(
            `$${rProd}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
            `$${rProd}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
          ),
          t(
            `$${rProd}(\\cos ${(a1 * a2) % 360}^\\circ + i\\sin ${(a1 * a2) % 360}^\\circ)$`,
            `$${rProd}(\\cos ${(a1 * a2) % 360}^\\circ + i\\sin ${(a1 * a2) % 360}^\\circ)$`,
          ),
        ];
        const solution = t(
          `Moduli multiply: $r = ${r1} \\times ${r2} = ${rProd}$.\nArguments add: $\\theta = ${a1}^\\circ + ${a2}^\\circ = ${sumAngle}^\\circ$.\nProduct: $${rProd}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$.`,
          `模长相乘：$r = ${r1} \\times ${r2} = ${rProd}$。\n辐角相加：$\\theta = ${a1}^\\circ + ${a2}^\\circ = ${sumAngle}^\\circ$。\n乘积为：$${rProd}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "geometric-rotation-and-scaling",
      title: t("Geometric interpretation of multiplication as rotation and dilation", "复数乘法的旋转与伸缩几何意义"),
      explanation: t(
        "Multiplying any complex number $z$ by $w = r(\\cos\\theta + i\\sin\\theta)$:\n\n1. **Scales** the distance from the origin by a factor of $r = |w|$\n2. **Rotates** the point counterclockwise by an angle of $\\theta = \\arg(w)$\n\nIn particular, multiplying by $i = 1(\\cos 90^\\circ + i\\sin 90^\\circ)$ rotates $z = a + bi$ counterclockwise by $90^\\circ$ ($\frac{\\pi}{2}$ radians), producing $i(a + bi) = -b + ai$.",
        "复数 $z$ 乘以 $w = r(\\cos\\theta + i\\sin\\theta)$ 的几何意义为：\n\n1. 到原点的距离**伸缩** $r = |w|$ 倍\n2. 绕原点逆时针**旋转**角度 $\\theta = \\arg(w)$\n\n特别地，乘以 $i = 1(\\cos 90^\\circ + i\\sin 90^\\circ)$ 相当于将复数 $z = a + bi$ 绕原点逆时针旋转 $90^\\circ$（$\\frac{\\pi}{2}$ 弧度），结果为 $i(a + bi) = -b + ai$。",
      ),
      generate(rng) {
        const a = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const b = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const prompt = t(
          `If the complex number $z = ${cx(a, b)}$ is rotated counterclockwise by $90^\\circ$ around the origin, which complex number represents the resulting point?`,
          `若将复数 $z = ${cx(a, b)}$ 绕原点逆时针旋转 $90^\\circ$，所得新点表示的复数是什么？`,
        );
        const rotA = -b;
        const rotB = a;
        const right = t(`$${cx(rotA, rotB)}$`, `$${cx(rotA, rotB)}$`);
        const wrong = [
          t(`$${cx(-rotA, -rotB)}$`, `$${cx(-rotA, -rotB)}$`),
          t(`$${cx(rotB, rotA)}$`, `$${cx(rotB, rotA)}$`),
          t(`$${cx(a, -b)}$`, `$${cx(a, -b)}$`),
          t(`$${cx(-a, b)}$`, `$${cx(-a, b)}$`),
        ];
        const solution = t(
          `Rotating counterclockwise by $90^\\circ$ corresponds to multiplying by $i$:\n$$i(${cx(a, b)}) = ${a}i + (${b})i^2 = -(${b}) + ${a}i = ${cx(rotA, rotB)}$$`,
          `绕原点逆时针旋转 $90^\\circ$ 等价于乘以虚数单位 $i$：\n$$i(${cx(a, b)}) = ${a}i + (${b})i^2 = -(${b}) + ${a}i = ${cx(rotA, rotB)}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.32.3: Quotients of Complex Numbers in Polar Form ───────────────

/** quotientsOfComplexNumbersExpressedInPolarForm covers dividing moduli and subtracting arguments. */
export const quotientsOfComplexNumbersExpressedInPolarForm: TopicDef = {
  id: "quotients-of-complex-numbers-expressed-in-polar-form",
  title: t("Quotients of Complex Numbers Expressed in Polar Form", "复数三角形式的除法法则"),
  summary: t(
    "Divide complex numbers in polar form using the rule z1 / z2 = (r1 / r2) [cos(θ1 - θ2) + i sin(θ1 - θ2)], dividing moduli and subtracting arguments.",
    "使用模长相除、辐角相减的运算法则计算复数三角形式的除法：z1 / z2 = (r1 / r2) [cos(θ1 - θ2) + i sin(θ1 - θ2)]。",
  ),
  prerequisites: ["products-of-complex-numbers-expressed-in-polar-form"],
  encompasses: [{ topic: "products-of-complex-numbers-expressed-in-polar-form", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5"],
  knowledgePoints: [
    {
      id: "division-rule-in-polar-form",
      title: t("Division rule in polar form", "三角形式的除法法则"),
      explanation: t(
        "To divide two complex numbers in polar form, **divide their moduli** and **subtract their arguments**:\n\n$$\\frac{z_1}{z_2} = \\frac{r_1}{r_2}\\left[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)\\right]$$\n\nIf the resulting angle is negative, add $360^\\circ$ (or $2\\pi$) to bring it into $[0, 360^\\circ)$ or $[0, 2\\pi)$.",
        "计算三角形式复数的商时，法则为**模长相除、辐角相减**：\n\n$$\\frac{z_1}{z_2} = \\frac{r_1}{r_2}\\left[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)\\right]$$\n\n若所得角度为负，加上 $360^\\circ$（或 $2\\pi$）将其化至 $[0, 360^\\circ)$ 或 $[0, 2\\pi)$ 内。",
      ),
      generate(rng) {
        const r2 = rng.pick([2, 3, 4]);
        const k = rng.pick([2, 3, 4, 5]);
        const r1 = k * r2;
        const a1 = rng.pick([120, 135, 150, 180, 210, 240, 270, 300, 315, 330]);
        const a2 = rng.pick([15, 30, 45, 60, 75, 90]);
        const rQuot = k;
        const diffAngle = (a1 - a2 + 360) % 360;
        const prompt = t(
          `Divide $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ by $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$.`,
          `计算 $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ 除以 $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$ 的商。`,
        );
        const right = t(
          `$${rQuot}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
          `$${rQuot}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
        );
        const sumAngle = (a1 + a2) % 360;
        const wrong = [
          t(
            `$${rQuot}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$`,
            `$${rQuot}(\\cos ${sumAngle}^\\circ + i\\sin ${sumAngle}^\\circ)$`,
          ),
          t(
            `$${r1 - r2}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
            `$${r1 - r2}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
          ),
          t(
            `$${rQuot * 2}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
            `$${rQuot * 2}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$`,
          ),
        ];
        const solution = t(
          `Moduli divide: $r = \\frac{${r1}}{${r2}} = ${rQuot}$.\nArguments subtract: $\\theta = ${a1}^\\circ - ${a2}^\\circ = ${diffAngle}^\\circ$.\nQuotient: $${rQuot}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$.`,
          `模长相除：$r = \\frac{${r1}}{${r2}} = ${rQuot}$。\n辐角相减：$\\theta = ${a1}^\\circ - ${a2}^\\circ = ${diffAngle}^\\circ$。\n商为：$${rQuot}(\\cos ${diffAngle}^\\circ + i\\sin ${diffAngle}^\\circ)$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "polar-quotients-converted-to-rectangular",
      title: t("Evaluate polar quotients in rectangular form", "将极坐标商转换为代数形式"),
      explanation: t(
        "After calculating $\\frac{z_1}{z_2} = \\frac{r_1}{r_2}[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)]$, evaluate the cosine and sine values to obtain the standard rectangular form $a + bi$.",
        "计算完三角形式的商 $\\frac{z_1}{z_2} = \\frac{r_1}{r_2}[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)]$ 后，求出正弦和余弦的精确值，即可化为标准代数形式 $a + bi$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { r: 2, thetaDiff: 60, rect: "1 + \\sqrt{3}i", wrong: ["\\sqrt{3} + i", "1 - \\sqrt{3}i", "-1 + \\sqrt{3}i"] },
          { r: 2, thetaDiff: 30, rect: "\\sqrt{3} + i", wrong: ["1 + \\sqrt{3}i", "\\sqrt{3} - i", "-\\sqrt{3} + i"] },
          { r: 2, thetaDiff: 90, rect: "2i", wrong: ["-2i", "2", "-2"] },
          { r: 2, thetaDiff: 180, rect: "-2", wrong: ["2", "-2i", "2i"] },
          { r: 4, thetaDiff: 60, rect: "2 + 2\\sqrt{3}i", wrong: ["2\\sqrt{3} + 2i", "2 - 2\\sqrt{3}i", "-2 + 2\\sqrt{3}i"] },
          { r: 4, thetaDiff: 120, rect: "-2 + 2\\sqrt{3}i", wrong: ["2 + 2\\sqrt{3}i", "-2 - 2\\sqrt{3}i", "-2\\sqrt{3} + 2i"] },
          { r: 4, thetaDiff: 90, rect: "4i", wrong: ["-4i", "4", "-4"] },
        ]);
        const a2 = rng.pick([15, 20, 25, 30, 45, 60]);
        const a1 = a2 + item.thetaDiff;
        const r2 = rng.pick([2, 3]);
        const r1 = item.r * r2;
        const prompt = t(
          `Evaluate the quotient $\\frac{${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)}{${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)}$ and express the answer in standard rectangular form $a + bi$.`,
          `计算商 $\\frac{${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)}{${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)}$ 并将结果表示为代数标准形式 $a + bi$。`,
        );
        const right = t(`$${item.rect}$`, `$${item.rect}$`);
        const wrong = item.wrong.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = t(
          `Modulus $r = \\frac{${r1}}{${r2}} = ${item.r}$.\nAngle $\\theta = ${a1}^\\circ - ${a2}^\\circ = ${item.thetaDiff}^\\circ$.\nIn rectangular form: $${item.r}(\\cos ${item.thetaDiff}^\\circ + i\\sin ${item.thetaDiff}^\\circ) = ${item.rect}$.`,
          `模长 $r = \\frac{${r1}}{${r2}} = ${item.r}$。\n角度 $\\theta = ${a1}^\\circ - ${a2}^\\circ = ${item.thetaDiff}^\\circ$。\n代数形式为：$${item.r}(\\cos ${item.thetaDiff}^\\circ + i\\sin ${item.thetaDiff}^\\circ) = ${item.rect}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module 10.32.4: The CIS Notation ─────────────────────────────────────────

/** theCisNotation covers the compact cis(θ) = cos(θ) + i sin(θ) notation. */
export const theCisNotation: TopicDef = {
  id: "the-cis-notation",
  title: t("The CIS Notation", "复数的 cis 简记符号"),
  summary: t(
    "Use the compact cis notation cis(θ) = cos θ + i sin θ to write complex numbers r cis(θ) and perform products and quotients efficiently.",
    "使用紧凑记号 cis(θ) = cos θ + i sin θ 表示复数 r cis(θ)，并高效进行乘法与除法运算。",
  ),
  prerequisites: ["the-polar-form-of-a-complex-number"],
  encompasses: [{ topic: "the-polar-form-of-a-complex-number", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4", "CCSS.HSN.CN.B.5"],
  knowledgePoints: [
    {
      id: "cis-definition-and-evaluation",
      title: t("Definition and evaluation of cis notation", "cis 记号的定义与求值"),
      explanation: t(
        "The notation **$\\text{cis}(\\theta)$** is an abbreviation for:\n\n$$\\text{cis}(\\theta) = \\cos\\theta + i\\sin\\theta$$\n\nThus, $r\\,\\text{cis}(\\theta) = r(\\cos\\theta + i\\sin\\theta)$.\n\nFor example:\n- $\\text{cis}(0) = 1$\n- $\\text{cis}\\left(\\frac{\\pi}{2}\\right) = i$\n- $\\text{cis}(\\pi) = -1$\n- $\\text{cis}\\left(\\frac{3\\pi}{2}\\right) = -i$",
        "简记符号 **$\\text{cis}(\\theta)$** 代表：\n\n$$\\text{cis}(\\theta) = \\cos\\theta + i\\sin\\theta$$\n\n因此，$r\\,\\text{cis}(\\theta) = r(\\cos\\theta + i\\sin\\theta)$。\n\n常见特殊值：\n- $\\text{cis}(0) = 1$\n- $\\text{cis}\\left(\\frac{\\pi}{2}\\right) = i$\n- $\\text{cis}(\\pi) = -1$\n- $\\text{cis}\\left(\\frac{3\\pi}{2}\\right) = -i$",
      ),
      generate(rng) {
        const items = getSpecialPolarItems();
        const item = rng.pick(items);
        const prompt = t(
          `Evaluate $z = ${item.r}\\,\\text{cis}\\left(${item.theta}\\right)$ in standard rectangular form $a + bi$.`,
          `计算 $z = ${item.r}\\,\\text{cis}\\left(${item.theta}\\right)$ 的标准代数形式 $a + bi$。`,
        );
        const right = t(`$${item.rect}$`, `$${item.rect}$`);
        const wrong = item.wrongRects.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = t(
          `$$\\text{cis}\\left(${item.theta}\\right) = \\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)$$\n\n$$${item.r}\\,\\text{cis}\\left(${item.theta}\\right) = ${item.rect}$$`,
          `$$\\text{cis}\\left(${item.theta}\\right) = \\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)$$\n\n$$${item.r}\\,\\text{cis}\\left(${item.theta}\\right) = ${item.rect}$$`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "products-and-quotients-in-cis-notation",
      title: t("Multiplication and division in cis notation", "cis 记号下的乘法与除法运算"),
      explanation: t(
        "Using $\\text{cis}$ notation, the product and quotient rules are written compactly:\n\n- **Product**: $r_1\\,\\text{cis}(\\alpha) \\cdot r_2\\,\\text{cis}(\\beta) = (r_1 r_2)\\,\\text{cis}(\\alpha + \\beta)$\n- **Quotient**: $\\frac{r_1\\,\\text{cis}(\\alpha)}{r_2\\,\\text{cis}(\\beta)} = \\left(\\frac{r_1}{r_2}\\right)\\,\\text{cis}(\\alpha - \\beta)$",
        "使用 $\\text{cis}$ 记号，复数的乘法和除法法则表示更为简洁：\n\n- **乘积**：$r_1\\,\\text{cis}(\\alpha) \\cdot r_2\\,\\text{cis}(\\beta) = (r_1 r_2)\\,\\text{cis}(\\alpha + \\beta)$\n- **商**：$\\frac{r_1\\,\\text{cis}(\\alpha)}{r_2\\,\\text{cis}(\\beta)} = \\left(\\frac{r_1}{r_2}\\right)\\,\\text{cis}(\\alpha - \\beta)$",
      ),
      generate(rng) {
        const isProduct = rng.bool();
        if (isProduct) {
          const r1 = rng.pick([2, 3, 4, 5]);
          const r2 = rng.pick([2, 3, 4, 5]);
          const a1 = rng.pick([15, 25, 35, 45, 55, 65, 75, 85, 105]);
          const a2 = rng.pick([15, 20, 30, 40, 50, 60, 70, 80]);
          const prodR = r1 * r2;
          const sumA = (a1 + a2) % 360;
          const prompt = t(
            `Simplify $\\left(${r1}\\,\\text{cis}(${a1}^\\circ)\\right) \\cdot \\left(${r2}\\,\\text{cis}(${a2}^\\circ)\\right)$.`,
            `化简 $\\left(${r1}\\,\\text{cis}(${a1}^\\circ)\\right) \\cdot \\left(${r2}\\,\\text{cis}(${a2}^\\circ)\\right)$。`,
          );
          const right = t(`$${prodR}\\,\\text{cis}(${sumA}^\\circ)$`, `$${prodR}\\,\\text{cis}(${sumA}^\\circ)$`);
          const diffA = Math.abs(a1 - a2);
          const wrong = [
            t(`$${prodR}\\,\\text{cis}(${diffA}^\\circ)$`, `$${prodR}\\,\\text{cis}(${diffA}^\\circ)$`),
            t(`$${r1 + r2}\\,\\text{cis}(${sumA}^\\circ)$`, `$${r1 + r2}\\,\\text{cis}(${sumA}^\\circ)$`),
            t(`$${prodR}\\,\\text{cis}(${(a1 * a2) % 360}^\\circ)$`, `$${prodR}\\,\\text{cis}(${(a1 * a2) % 360}^\\circ)$`),
          ];
          const solution = t(
            `Multiply moduli: $${r1} \\times ${r2} = ${prodR}$.\nAdd angles: ${a1}^\\circ + ${a2}^\\circ = ${sumA}^\\circ$.\nResult: $${prodR}\\,\\text{cis}(${sumA}^\\circ)$.`,
            `模长相乘：$${r1} \\times ${r2} = ${prodR}$。\n辐角相加：${a1}^\\circ + ${a2}^\\circ = ${sumA}^\\circ$。\n结果为：$${prodR}\\,\\text{cis}(${sumA}^\\circ)$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const r2 = rng.pick([2, 3, 4]);
        const k = rng.pick([2, 3, 4, 5]);
        const r1 = k * r2;
        const a1 = rng.pick([100, 115, 130, 145, 160, 180, 210, 240]);
        const a2 = rng.pick([15, 25, 35, 45, 55, 65, 75]);
        const quotR = k;
        const diffA = (a1 - a2 + 360) % 360;
        const prompt = t(
          `Simplify $\\frac{${r1}\\,\\text{cis}(${a1}^\\circ)}{${r2}\\,\\text{cis}(${a2}^\\circ)}$.`,
          `化简 $\\frac{${r1}\\,\\text{cis}(${a1}^\\circ)}{${r2}\\,\\text{cis}(${a2}^\\circ)}$。`,
        );
        const right = t(`$${quotR}\\,\\text{cis}(${diffA}^\\circ)$`, `$${quotR}\\,\\text{cis}(${diffA}^\\circ)$`);
        const sumA = (a1 + a2) % 360;
        const wrong = [
          t(`$${quotR}\\,\\text{cis}(${sumA}^\\circ)$`, `$${quotR}\\,\\text{cis}(${sumA}^\\circ)$`),
          t(`$${r1 - r2}\\,\\text{cis}(${diffA}^\\circ)$`, `$${r1 - r2}\\,\\text{cis}(${diffA}^\\circ)$`),
          t(`$${quotR * 2}\\,\\text{cis}(${diffA}^\\circ)$`, `$${quotR * 2}\\,\\text{cis}(${diffA}^\\circ)$`),
        ];
        const solution = t(
          `Divide moduli: $\\frac{${r1}}{${r2}} = ${quotR}$.\nSubtract angles: ${a1}^\\circ - ${a2}^\\circ = ${diffA}^\\circ$.\nResult: $${quotR}\\,\\text{cis}(${diffA}^\\circ)$.`,
          `模长相除：$\\frac{${r1}}{${r2}} = ${quotR}$。\n辐角相减：${a1}^\\circ - ${a2}^\\circ = ${diffA}^\\circ$。\n结果为：$${quotR}\\,\\text{cis}(${diffA}^\\circ)$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
  ],
};

// ─── Module Export ────────────────────────────────────────────────────────────

/** precalculusComplexNumberTopics contains all 15 topics for Precalculus Unit 10 Part 1. */
export const precalculusComplexNumberTopics: readonly TopicDef[] = [
  theComplexPlane,
  theMagnitudeOfAComplexNumber,
  theArgumentOfAComplexNumber,
  arithmeticInTheComplexPlane,
  geometryInTheComplexPlane,
  theComplexConjugate,
  specialPropertiesOfTheComplexConjugate,
  theComplexConjugateAndTheRootsOfAQuadraticEquation,
  dividingComplexNumbers,
  solvingEquationsByEquatingRealAndImaginaryParts,
  extendingPolynomialIdentitiesToTheComplexNumbers,
  thePolarFormOfAComplexNumber,
  productsOfComplexNumbersExpressedInPolarForm,
  quotientsOfComplexNumbersExpressedInPolarForm,
  theCisNotation,
];
