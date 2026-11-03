import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type Mark, type Point, Q, radical, sketch } from "@ga/subject-math";

import { expressionProblem, numberProblem, radicalProblem, steps } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// SAT Math Fundamentals, geometry: problems given as descriptions of congruent and similar figures, borders, functions
// for areas and volumes, inscribed shapes, composite solids, circles and trigonometric ratios.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem, figure?: Figure): KnowledgePointDef {
  return figure ? { id, title, explanation, figure, generate } : { id, title, explanation, generate };
}

/** triples are Pythagorean triples with the hypotenuse last. */
const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
  [20, 21, 29],
  [12, 16, 20],
] as const;

/** letters are triangle names for descriptions. */
const triangleNames = [
  ["A", "B", "C", "D", "E", "F"],
  ["P", "Q", "R", "S", "T", "U"],
  ["J", "K", "L", "M", "N", "O"],
  ["A", "B", "C", "X", "Y", "Z"],
] as const;

/** squareFreePart splits n into k²m with m square-free. */
function squareFreePart(n: number): [number, number] {
  let k = 1;
  let m = n;
  for (let f = 2; f * f <= m; f++) {
    while (m % (f * f) === 0) {
      m /= f * f;
      k *= f;
    }
  }
  return [k, m];
}

// ---------------------------------------------------------------------------
// Right triangles with radicals

/** solvingGeometryProblemsByManipulatingRadicals finds lengths and areas in exact radical form. */
export const solvingGeometryProblemsByManipulatingRadicals = topic(
  "solving-geometry-problems-by-manipulating-radicals",
  t("Solving Geometry Problems by Manipulating Radicals", "通过根式运算解几何问题"),
  t(
    "Find lengths with the Pythagorean theorem and give them in simplest radical form, and work back from radical lengths to areas.",
    "用勾股定理求长度并写成最简根式，再由根式表示的长度求面积。",
  ),
  ["diagonals-of-squares", "surds"],
  ["8.G.B.7", "HSN.RN.A.2"],
  [
    kp(
      "hypotenuse-in-radical-form",
      t("A hypotenuse in radical form", "用根式表示斜边"),
      t(
        "When the legs of a right triangle are not part of a Pythagorean triple, the hypotenuse $\\sqrt{a^2 + b^2}$ is irrational. Give it exactly by taking the square factors out of the root rather than rounding it.\n\n$$\\sqrt{4^2 + 6^2} = \\sqrt{52} = 2\\sqrt{13}$$",
        "当直角三角形的两条直角边不构成勾股数时，斜边 $\\sqrt{a^2 + b^2}$ 是无理数。不要取近似值，而是把根号里的平方因数提出来，给出精确值。\n\n$$\\sqrt{4^2 + 6^2} = \\sqrt{52} = 2\\sqrt{13}$$",
      ),
      (rng) => {
        let a = 0;
        let b = 0;
        let k = 1;
        let m = 1;
        do {
          a = rng.int(2, 12);
          b = rng.int(2, 12);
          [k, m] = squareFreePart(a * a + b * b);
        } while (m === 1 || k === 1);
        return radicalProblem({
          prompt: t(
            `A right triangle has legs of lengths $${a}$ and $${b}$. What is the length of its hypotenuse, in simplest radical form?`,
            `一个直角三角形两条直角边的长分别为 $${a}$ 和 $${b}$。它的斜边长是多少？用最简根式表示。`,
          ),
          answer: [k, m],
          wrong: [radical(1, a * a + b * b), String(a + b), radical(k, squareFreePart(Math.abs(a * a - b * b))[1])],
          solution: t(
            `By the Pythagorean theorem the hypotenuse is${steps(`\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = \\sqrt{${k * k} \\cdot ${m}} = ${radical(k, m)}`)}`,
            `由勾股定理，斜边长为${steps(`\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = \\sqrt{${k * k} \\cdot ${m}} = ${radical(k, m)}`)}`,
          ),
        });
      },
    ),
    kp(
      "areas-from-radical-lengths",
      t("Areas from radical lengths", "由根式长度求面积"),
      t(
        "Squaring a radical length clears the root, so areas found from radical lengths are often whole numbers. A square with diagonal $d$ has side $\\frac{d}{\\sqrt{2}}$, so its area is $\\frac{d^2}{2}$; with $d = 3\\sqrt{6}$ the area is $\\frac{54}{2} = 27$.",
        "把根式长度平方会消去根号，所以由根式长度求出的面积常常是整数。对角线为 $d$ 的正方形边长为 $\\frac{d}{\\sqrt{2}}$，面积为 $\\frac{d^2}{2}$；当 $d = 3\\sqrt{6}$ 时，面积为 $\\frac{54}{2} = 27$。",
      ),
      (rng) => {
        const k = rng.int(2, 9);
        const m = rng.pick([2, 3, 5, 6, 7, 10]);
        const kind = rng.pick(["diagonal", "side"] as const);
        const d2 = k * k * m;
        const area = kind === "diagonal" ? Q.of(d2, 2) : Q.of(d2);
        return numberProblem({
          prompt: t(
            kind === "diagonal"
              ? `The diagonal of a square has length $${radical(k, m)}$. What is the area of the square?`
              : `Each side of a square has length $${radical(k, m)}$. What is the area of the square?`,
            kind === "diagonal"
              ? `一个正方形的对角线长为 $${radical(k, m)}$。这个正方形的面积是多少？`
              : `一个正方形的边长为 $${radical(k, m)}$。这个正方形的面积是多少？`,
          ),
          answer: area,
          wrong: [Q.of(d2), Q.of(d2, 4), Q.of(k * m), Q.of(k * k)],
          solution: t(
            kind === "diagonal"
              ? `Two sides $s$ and the diagonal form an isosceles right triangle, so $2s^2 = (${radical(k, m)})^2 = ${d2}$ and the area is $s^2 = ${area.toLatex()}$.`
              : `The area is $(${radical(k, m)})^2 = ${k * k} \\cdot ${m} = ${d2}$.`,
            kind === "diagonal"
              ? `两条边 $s$ 与对角线构成等腰直角三角形，所以 $2s^2 = (${radical(k, m)})^2 = ${d2}$，面积为 $s^2 = ${area.toLatex()}$。`
              : `面积为 $(${radical(k, m)})^2 = ${k * k} \\cdot ${m} = ${d2}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Congruence

/** solvingProblemsDescribingCongruentTriangles uses corresponding parts of congruent triangles given in words. */
export const solvingProblemsDescribingCongruentTriangles = topic(
  "solving-problems-describing-congruent-triangles",
  t("Solving Problems Describing Congruent Triangles", "解描述全等三角形的问题"),
  t(
    "Use the order of the vertices in a congruence statement to match sides and angles, and solve for unknown lengths and angles.",
    "根据全等式中顶点的顺序找出对应边与对应角，求未知的长度和角度。",
  ),
  ["properties-of-congruence"],
  ["HSG.CO.B.7"],
  [
    kp(
      "corresponding-sides",
      t("Corresponding sides", "对应边"),
      t(
        "A congruence statement such as $\\triangle ABC \\cong \\triangle DEF$ lists matching vertices in the same order: $A$ with $D$, $B$ with $E$ and $C$ with $F$. So side $AB$ matches $DE$, and matching sides have equal lengths. Setting their expressions equal gives an equation to solve.",
        "像 $\\triangle ABC \\cong \\triangle DEF$ 这样的全等式按相同顺序列出对应顶点：$A$ 对 $D$，$B$ 对 $E$，$C$ 对 $F$。所以边 $AB$ 对应 $DE$，对应边长度相等。令它们的表达式相等，就得到一个可以求解的方程。",
      ),
      (rng) => {
        const [A, B, C, D, E, F] = rng.pick(triangleNames);
        const pair = rng.pick([
          [`${A}${B}`, `${D}${E}`],
          [`${B}${C}`, `${E}${F}`],
          [`${A}${C}`, `${D}${F}`],
        ] as const);
        const x = rng.int(2, 12);
        const p = rng.int(2, 6);
        const q = rng.int(1, p - 1);
        const r = rng.int(1, 9);
        const s = (p - q) * x + r;
        const ask = rng.bool();
        const len = q * x + s;
        return numberProblem({
          prompt: t(
            `$\\triangle ${A}${B}${C} \\cong \\triangle ${D}${E}${F}$, with $${pair[0]} = ${linear(p, r)}$ and $${pair[1]} = ${linear(q, s)}$. What is ${ask ? "the value of $x$" : `the length of $${pair[0]}$`}?`,
            `$\\triangle ${A}${B}${C} \\cong \\triangle ${D}${E}${F}$，且 $${pair[0]} = ${linear(p, r)}$，$${pair[1]} = ${linear(q, s)}$。${ask ? "$x$ 的值" : `$${pair[0]}$ 的长`}是多少？`,
          ),
          answer: ask ? x : len,
          wrong: ask ? [len, Q.of(s + r, p + q), x + 1] : [x, p * x, len + r],
          solution: t(
            `$${pair[0]}$ and $${pair[1]}$ are corresponding sides, so${steps(`${linear(p, r)} = ${linear(q, s)}`, `${p - q === 1 ? "" : p - q}x = ${s - r}`, `x = ${x}`)}${ask ? "" : `Then $${pair[0]} = ${p} \\cdot ${x} + ${r} = ${len}$.`}`,
            `$${pair[0]}$ 与 $${pair[1]}$ 是对应边，所以${steps(`${linear(p, r)} = ${linear(q, s)}`, `${p - q === 1 ? "" : p - q}x = ${s - r}`, `x = ${x}`)}${ask ? "" : `于是 $${pair[0]} = ${p} \\cdot ${x} + ${r} = ${len}$。`}`,
          ),
        });
      },
    ),
    kp(
      "corresponding-angles-of-congruent-triangles",
      t("Corresponding angles", "对应角"),
      t(
        "Corresponding angles of congruent triangles are equal, and the angles of each triangle add up to $180^\\circ$. Given two angles named in different triangles, match each to its partner through the congruence statement, then subtract from $180^\\circ$ to find the third.",
        "全等三角形的对应角相等，每个三角形的内角和为 $180^\\circ$。如果已知的两个角分别在不同的三角形里，先根据全等式把它们对应到同一个三角形，再用 $180^\\circ$ 减去它们求出第三个角。",
      ),
      (rng) => {
        const [A, B, C, D, E, F] = rng.pick(triangleNames);
        const b = rng.int(25, 85);
        const c = rng.int(25, 150 - b);
        const a = 180 - b - c;
        const ask = rng.pick([D, A] as const);
        return numberProblem({
          prompt: t(
            `$\\triangle ${A}${B}${C} \\cong \\triangle ${D}${E}${F}$. If $\\angle ${B} = ${b}^\\circ$ and $\\angle ${F} = ${c}^\\circ$, what is the measure of $\\angle ${ask}$?`,
            `$\\triangle ${A}${B}${C} \\cong \\triangle ${D}${E}${F}$。若 $\\angle ${B} = ${b}^\\circ$，$\\angle ${F} = ${c}^\\circ$，则 $\\angle ${ask}$ 的度数是多少？`,
          ),
          answer: a,
          unit: "°",
          wrong: [b, c, 180 - b, 180 - c, 90 - b],
          solution: t(
            `$\\angle ${F}$ corresponds to $\\angle ${C}$, and $\\angle ${E}$ to $\\angle ${B}$. So each triangle has angles $${b}^\\circ$ and $${c}^\\circ$, and $\\angle ${A} = \\angle ${D} = 180^\\circ - ${b}^\\circ - ${c}^\\circ = ${a}^\\circ$.`,
            `$\\angle ${F}$ 对应 $\\angle ${C}$，$\\angle ${E}$ 对应 $\\angle ${B}$。所以每个三角形都有 $${b}^\\circ$ 和 $${c}^\\circ$ 的角，$\\angle ${A} = \\angle ${D} = 180^\\circ - ${b}^\\circ - ${c}^\\circ = ${a}^\\circ$。`,
          ),
        });
      },
    ),
  ],
);

/** reasoningAboutCongruentTriangles decides which criterion shows two triangles congruent and what follows. */
export const reasoningAboutCongruentTriangles = topic(
  "reasoning-about-congruent-triangles",
  t("Reasoning About Congruent Triangles", "全等三角形的推理"),
  t(
    "Decide which congruence criterion applies to given information about two triangles, and which statements must then be true.",
    "根据两个三角形的已知条件判断适用哪条全等判定，以及由此必然成立的结论。",
  ),
  ["solving-problems-describing-congruent-triangles", "combining-congruence-criteria-for-triangles"],
  ["HSG.SRT.B.5"],
  [
    kp(
      "choosing-a-criterion",
      t("Choosing a criterion", "选择判定方法"),
      t(
        "Two triangles are congruent by SSS, SAS, ASA or AAS: three pairs of equal sides, two sides and the angle between them, two angles and the side between them, or two angles and a side not between them. Two sides and an angle that is not between them, or three angles alone, are not enough.",
        "两个三角形可由 SSS、SAS、ASA 或 AAS 判定全等：三组对应边相等；两边及其夹角相等；两角及其夹边相等；两角及其中一角的对边相等。两边及其中一边的对角相等，或者只有三个角相等，都不足以判定全等。",
      ),
      (rng) => {
        const [A, B, C, D, E, F] = rng.pick(triangleNames);
        const facts = {
          SSS: [`${A}${B} = ${D}${E}`, `${B}${C} = ${E}${F}`, `${A}${C} = ${D}${F}`],
          SAS: [`${A}${B} = ${D}${E}`, `\\angle ${B} = \\angle ${E}`, `${B}${C} = ${E}${F}`],
          ASA: [`\\angle ${A} = \\angle ${D}`, `${A}${B} = ${D}${E}`, `\\angle ${B} = \\angle ${E}`],
          AAS: [`\\angle ${A} = \\angle ${D}`, `\\angle ${B} = \\angle ${E}`, `${B}${C} = ${E}${F}`],
          none: rng.pick([
            [`${A}${B} = ${D}${E}`, `${B}${C} = ${E}${F}`, `\\angle ${A} = \\angle ${D}`],
            [`\\angle ${A} = \\angle ${D}`, `\\angle ${B} = \\angle ${E}`, `\\angle ${C} = \\angle ${F}`],
          ]),
        };
        const which = rng.pick(["SSS", "SAS", "ASA", "AAS", "none"] as const);
        const shown = rng.shuffle(facts[which]);
        const label = (k: keyof typeof facts) =>
          k === "none" ? t("They cannot be shown congruent from this information", "由这些条件不能判定全等") : t(k, k);
        const others = (["SSS", "SAS", "ASA", "AAS", "none"] as const).filter((k) => k !== which);
        return pickChoice(
          rng,
          t(
            `In $\\triangle ${A}${B}${C}$ and $\\triangle ${D}${E}${F}$, $${shown.join("$, $")}$. Which criterion shows that the triangles are congruent?`,
            `在 $\\triangle ${A}${B}${C}$ 与 $\\triangle ${D}${E}${F}$ 中，$${shown.join("$，$")}$。用哪条判定可以说明这两个三角形全等？`,
          ),
          label(which),
          rng.shuffle(others).map(label),
          t(
            which === "none"
              ? "These facts give either two sides and an angle that is not between them, or only angles. Neither fixes the triangle, so congruence does not follow."
              : `The facts give ${{ SSS: "three pairs of equal sides", SAS: "two pairs of sides and the angles between them", ASA: "two pairs of angles and the sides between them", AAS: "two pairs of angles and a pair of sides not between them" }[which]}, which is the ${which} criterion.`,
            which === "none"
              ? "这些条件要么是两边及其中一边的对角，要么只有角。两者都不能确定三角形，所以不能判定全等。"
              : `这些条件给出${{ SSS: "三组对应边相等", SAS: "两组对应边及其夹角相等", ASA: "两组对应角及其夹边相等", AAS: "两组对应角及一组非夹边相等" }[which]}，即 ${which} 判定。`,
          ),
        );
      },
    ),
    kp(
      "what-congruence-implies",
      t("What congruence implies", "全等的推论"),
      t(
        "Once two triangles are known to be congruent, every pair of corresponding parts is equal, not only the parts used to prove it. Read the correspondence from the order of the letters; a statement that pairs a side with a non-corresponding side need not be true.",
        "一旦知道两个三角形全等，所有对应部分都相等，而不只是用来证明全等的那些部分。根据字母顺序读出对应关系；把一条边与不对应的边配对的说法不一定成立。",
      ),
      (rng) => {
        const names = rng.pick(triangleNames);
        const first = rng.shuffle(names.slice(0, 3));
        const second = rng.shuffle(names.slice(3, 6));
        const side = (i: number, j: number, v: readonly string[]) => [v[i]!, v[j]!].sort().join("");
        const parts: [string, string][] = [
          [side(0, 1, first), side(0, 1, second)],
          [side(1, 2, first), side(1, 2, second)],
          [side(0, 2, first), side(0, 2, second)],
          ...[0, 1, 2].map((i): [string, string] => [`\\angle ${first[i]}`, `\\angle ${second[i]}`]),
        ];
        const bad: [string, string][] = [
          [side(0, 1, first), side(1, 2, second)],
          [side(1, 2, first), side(0, 2, second)],
          [side(0, 2, first), side(0, 1, second)],
          ...[0, 1, 2].map((i): [string, string] => [`\\angle ${first[i]}`, `\\angle ${second[(i + 1) % 3]}`]),
        ];
        const good = rng.pick(parts);
        const opt = ([x, y]: [string, string]) => t(`$${x} = ${y}$`, `$${x} = ${y}$`);
        const pairing = [0, 1, 2].map((i) => `$${first[i]}$ with $${second[i]}$`);
        const pairingZh = [0, 1, 2].map((i) => `$${first[i]}$ 与 $${second[i]}$`);
        return pickChoice(
          rng,
          t(
            `$\\triangle ${first.join("")} \\cong \\triangle ${second.join("")}$. Which statement must be true?`,
            `$\\triangle ${first.join("")} \\cong \\triangle ${second.join("")}$。下列哪个说法一定成立？`,
          ),
          opt(good),
          rng.sample(bad, 3).map(opt),
          t(
            `The order of the letters pairs ${pairing[0]}, ${pairing[1]} and ${pairing[2]}, so $${good[0]}$ corresponds to $${good[1]}$ and they are equal.`,
            `字母顺序把 ${pairingZh[0]}、${pairingZh[1]}、${pairingZh[2]} 对应起来，所以 $${good[0]}$ 与 $${good[1]}$ 对应，二者相等。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Similarity

/** workingWithDescriptionsOfSimilarShapes finds lengths, perimeters and areas of similar figures described in words. */
export const workingWithDescriptionsOfSimilarShapes = topic(
  "working-with-descriptions-of-similar-shapes",
  t("Working With Descriptions of Similar Shapes", "处理对相似图形的描述"),
  t(
    "Use the scale factor between similar figures described in words to find lengths, perimeters and areas.",
    "利用文字描述的相似图形之间的相似比，求长度、周长和面积。",
  ),
  ["areas-of-similar-polygons"],
  ["HSG.SRT.A.2", "7.G.A.1"],
  [
    kp(
      "lengths-of-similar-shapes",
      t("Lengths of similar shapes", "相似图形的长度"),
      t(
        "In similar figures every length is multiplied by the same scale factor $k$. Find $k$ by dividing a length of the new figure by the matching length of the original, then multiply any other length, and the perimeter too, by $k$.",
        "在相似图形中，每个长度都乘以同一个相似比 $k$。用新图形的一个长度除以原图形中对应的长度求出 $k$，再把其他任何长度（包括周长）乘以 $k$。",
      ),
      (rng) => {
        const w = rng.int(2, 12);
        const l = w + rng.int(1, 10);
        const k = rng.pick([Q.of(2), Q.of(3), Q.of(3, 2), Q.of(5, 2), Q.of(4), Q.of(1, 2)]);
        const W = Q.of(w).mul(k);
        if (!W.isInteger()) return workingWithDescriptionsOfSimilarShapes.knowledgePoints[0]!.generate(rng);
        const ask = rng.pick(["length", "perimeter"] as const);
        const L = Q.of(l).mul(k);
        const value = ask === "length" ? L : L.add(W).mul(Q.of(2));
        return numberProblem({
          prompt: t(
            `Rectangle $R$ is $${w}$ cm wide and $${l}$ cm long. Rectangle $S$ is similar to $R$, and its shorter side is $${W.toLatex()}$ cm. What is the ${ask === "length" ? "length of the longer side" : "perimeter"} of $S$, in centimeters?`,
            `长方形 $R$ 宽 $${w}$ cm、长 $${l}$ cm。长方形 $S$ 与 $R$ 相似，它的短边长 $${W.toLatex()}$ cm。$S$ 的${ask === "length" ? "长边" : "周长"}是多少厘米？`,
          ),
          answer: value,
          wrong:
            ask === "length"
              ? [Q.of(l).add(W).sub(Q.of(w)), Q.of(l).mul(k).mul(k), Q.of(l)]
              : [
                  Q.of(2 * (w + l)),
                  L.add(W),
                  Q.of(2 * (w + l))
                    .mul(k)
                    .mul(k),
                ],
          solution: t(
            `The scale factor is $\\frac{${W.toLatex()}}{${w}} = ${k.toLatex()}$, so the longer side is $${l} \\cdot ${k.toLatex()} = ${L.toLatex()}$ cm${ask === "length" ? "" : ` and the perimeter is $2(${W.toLatex()} + ${L.toLatex()}) = ${value.toLatex()}$ cm`}.`,
            `相似比为 $\\frac{${W.toLatex()}}{${w}} = ${k.toLatex()}$，所以长边为 $${l} \\cdot ${k.toLatex()} = ${L.toLatex()}$ cm${ask === "length" ? "" : `，周长为 $2(${W.toLatex()} + ${L.toLatex()}) = ${value.toLatex()}$ cm`}。`,
          ),
        });
      },
    ),
    kp(
      "areas-of-similar-shapes",
      t("Areas of similar shapes", "相似图形的面积"),
      t(
        "When lengths are multiplied by $k$, areas are multiplied by $k^2$, because area involves two lengths multiplied together. So doubling every side of a figure multiplies its area by $4$; conversely, an area ratio of $9$ means a length ratio of $3$.",
        "当长度乘以 $k$ 时，面积乘以 $k^2$，因为面积是两个长度相乘。所以把图形的每条边都扩大到 $2$ 倍，面积就扩大到 $4$ 倍；反过来，面积比为 $9$ 意味着长度比为 $3$。",
      ),
      (rng) => {
        const k = rng.int(2, 5);
        const a = rng.int(3, 20);
        const fromArea = rng.bool();
        const side = rng.int(2, 9);
        return numberProblem({
          prompt: fromArea
            ? t(
                `Two triangles are similar. The larger has $${k * k}$ times the area of the smaller. If a side of the smaller triangle is $${side}$ inches long, how long is the matching side of the larger triangle, in inches?`,
                `两个三角形相似，大三角形的面积是小三角形的 $${k * k}$ 倍。若小三角形的一条边长 $${side}$ 英寸，大三角形中对应边长多少英寸？`,
              )
            : t(
                `Two hexagons are similar, and each side of the larger is $${k}$ times as long as the matching side of the smaller. If the smaller hexagon has an area of $${a}$ square inches, what is the area of the larger, in square inches?`,
                `两个六边形相似，大六边形的每条边是小六边形对应边的 $${k}$ 倍。若小六边形的面积为 $${a}$ 平方英寸，大六边形的面积是多少平方英寸？`,
              ),
          answer: fromArea ? side * k : a * k * k,
          wrong: fromArea ? [side * k * k, side + k, side * 2 * k] : [a * k, a * 2 * k, a + k * k],
          solution: fromArea
            ? t(
                `The area ratio $${k * k}$ is the square of the length ratio, so lengths are multiplied by $\\sqrt{${k * k}} = ${k}$: $${side} \\cdot ${k} = ${side * k}$ inches.`,
                `面积比 $${k * k}$ 是长度比的平方，所以长度乘以 $\\sqrt{${k * k}} = ${k}$：$${side} \\cdot ${k} = ${side * k}$ 英寸。`,
              )
            : t(
                `Areas are multiplied by the square of the length ratio: $${a} \\cdot ${k}^2 = ${a * k * k}$ square inches.`,
                `面积乘以长度比的平方：$${a} \\cdot ${k}^2 = ${a * k * k}$ 平方英寸。`,
              ),
        });
      },
    ),
  ],
);

/** solvingAngleProblemsFromDescriptionsOfSimilarTriangles finds angles of similar triangles described in words. */
export const solvingAngleProblemsFromDescriptionsOfSimilarTriangles = topic(
  "solving-angle-problems-from-descriptions-of-similar-triangles",
  t("Solving Angle Problems From Descriptions of Similar Triangles", "由相似三角形的描述解角度问题"),
  t(
    "Match the angles of similar triangles from a similarity statement and use the angle sum of a triangle to find unknown angles.",
    "根据相似式找出相似三角形的对应角，再利用三角形内角和求未知角。",
  ),
  ["the-aa-similarity-criterion"],
  ["HSG.SRT.A.2"],
  [
    kp(
      "matching-angles",
      t("Matching angles of similar triangles", "相似三角形的对应角"),
      t(
        "Similar triangles have equal corresponding angles, even though their sides differ in size. In $\\triangle ABC \\sim \\triangle DEF$ the letters pair up in order, so $\\angle A = \\angle D$, $\\angle B = \\angle E$ and $\\angle C = \\angle F$. Combine this with the $180^\\circ$ angle sum to find any missing angle.",
        "相似三角形的对应角相等，尽管它们的边长不同。在 $\\triangle ABC \\sim \\triangle DEF$ 中字母按顺序对应，所以 $\\angle A = \\angle D$，$\\angle B = \\angle E$，$\\angle C = \\angle F$。再结合内角和 $180^\\circ$，就能求出任何缺失的角。",
      ),
      (rng) => {
        const [A, B, C, D, E, F] = rng.pick(triangleNames);
        const a = rng.int(20, 100);
        const b = rng.int(20, 160 - a);
        const c = 180 - a - b;
        return numberProblem({
          prompt: t(
            `$\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$, $\\angle ${A} = ${a}^\\circ$ and $\\angle ${E} = ${b}^\\circ$. What is the measure of $\\angle ${F}$?`,
            `$\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$，$\\angle ${A} = ${a}^\\circ$，$\\angle ${E} = ${b}^\\circ$。$\\angle ${F}$ 的度数是多少？`,
          ),
          answer: c,
          unit: "°",
          wrong: [a, b, 180 - a, 180 - b],
          solution: t(
            `$\\angle ${D} = \\angle ${A} = ${a}^\\circ$, so in $\\triangle ${D}${E}${F}$, $\\angle ${F} = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$.`,
            `$\\angle ${D} = \\angle ${A} = ${a}^\\circ$，所以在 $\\triangle ${D}${E}${F}$ 中，$\\angle ${F} = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$。`,
          ),
        });
      },
    ),
    kp(
      "angles-given-by-expressions",
      t("Angles given by expressions", "用表达式表示的角"),
      t(
        "When an angle is written as an expression such as $(3x + 10)^\\circ$, find its matching angle in the similar triangle and set the two equal. Solving gives $x$, and substituting back gives the angle; check that it is between $0^\\circ$ and $180^\\circ$.",
        "当角用 $(3x + 10)^\\circ$ 这样的表达式表示时，找出它在相似三角形中的对应角，令两者相等。解方程求出 $x$，再代回求出角的度数，并检查它在 $0^\\circ$ 到 $180^\\circ$ 之间。",
      ),
      (rng) => {
        const [A, B, C, D, E, F] = rng.pick(triangleNames);
        const x = rng.int(5, 25);
        const p = rng.int(2, 5);
        const angle = rng.int(30, 120);
        const r = angle - p * x;
        const which = rng.pick([
          [B, E],
          [C, F],
          [A, D],
        ] as const);
        const ask = rng.bool();
        return numberProblem({
          prompt: t(
            `$\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$, with $\\angle ${which[0]} = (${linear(p, r)})^\\circ$ and $\\angle ${which[1]} = ${angle}^\\circ$. What is ${ask ? "the value of $x$" : `the measure of $\\angle ${which[0]}$ plus $x$`}?`,
            `$\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$，$\\angle ${which[0]} = (${linear(p, r)})^\\circ$，$\\angle ${which[1]} = ${angle}^\\circ$。${ask ? "$x$ 的值" : `$\\angle ${which[0]}$ 的度数与 $x$ 之和`}是多少？`,
          ),
          answer: ask ? x : angle + x,
          wrong: ask ? [Q.of(angle + r, p), Q.of(180 - angle - r, p), angle] : [angle, x, 180 - angle + x],
          solution: t(
            `Corresponding angles are equal:${steps(`${linear(p, r)} = ${angle}`, `x = ${x}`)}${ask ? "" : `So $\\angle ${which[0]} = ${angle}^\\circ$ and the sum is $${angle} + ${x} = ${angle + x}$.`}`,
            `对应角相等：${steps(`${linear(p, r)} = ${angle}`, `x = ${x}`)}${ask ? "" : `所以 $\\angle ${which[0]} = ${angle}^\\circ$，二者之和为 $${angle} + ${x} = ${angle + x}$。`}`,
          ),
        });
      },
    ),
  ],
);

/** reasoningAboutSimilarTriangles uses proportional sides of similar triangles, including triangles cut by a parallel line. */
export const reasoningAboutSimilarTriangles = topic(
  "reasoning-about-similar-triangles",
  t("Reasoning About Similar Triangles", "相似三角形的推理"),
  t(
    "Find unknown sides of similar triangles, including a triangle cut by a line parallel to one side.",
    "求相似三角形的未知边，包括被平行于一边的直线所截的三角形。",
  ),
  ["the-triangle-proportionality-theorem"],
  ["HSG.SRT.B.5"],
  [
    kp(
      "proportional-sides",
      t("Proportional sides", "对应边成比例"),
      t(
        "In similar triangles the ratios of corresponding sides are all equal to the scale factor. If $\\triangle ABC \\sim \\triangle DEF$, then $\\frac{DE}{AB} = \\frac{EF}{BC} = \\frac{DF}{AC}$, so one known pair of sides gives the scale factor and every other side follows from it.",
        "在相似三角形中，对应边的比都等于相似比。若 $\\triangle ABC \\sim \\triangle DEF$，则 $\\frac{DE}{AB} = \\frac{EF}{BC} = \\frac{DF}{AC}$，所以一组已知的对应边给出相似比，其余各边都可以由它求出。",
      ),
      (rng) => {
        const [A, B, C, D, E, F] = rng.pick(triangleNames);
        const [p, q, r] = rng.pick(triples);
        const k = rng.pick([2, 3, 4]);
        const flip = rng.bool();
        const sides = [p, q, r];
        const big = sides.map((s) => s * k);
        const ask = rng.int(0, 2);
        const known = (ask + 1) % 3;
        const names = [`${A}${B}`, `${B}${C}`, `${A}${C}`];
        const names2 = [`${D}${E}`, `${E}${F}`, `${D}${F}`];
        const [small, large, sn, ln] = flip ? [big, sides, names2, names] : [sides, big, names, names2];
        const answer = large[ask]!;
        return numberProblem({
          prompt: t(
            `$\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$, with $${sn[0]} = ${small[0]}$, $${sn[1]} = ${small[1]}$, $${sn[2]} = ${small[2]}$ and $${ln[known]} = ${large[known]}$. What is $${ln[ask]}$?`,
            `$\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$，$${sn[0]} = ${small[0]}$，$${sn[1]} = ${small[1]}$，$${sn[2]} = ${small[2]}$，$${ln[known]} = ${large[known]}$。$${ln[ask]}$ 是多少？`,
          ),
          answer,
          wrong: [small[ask]! + large[known]! - small[known]!, small[ask]!, Q.of(small[ask]! * small[known]!, large[known]!)],
          solution: t(
            `The scale factor is $\\frac{${ln[known]}}{${sn[known]}} = \\frac{${large[known]}}{${small[known]}}$, so $${ln[ask]} = ${small[ask]} \\cdot \\frac{${large[known]}}{${small[known]}} = ${answer}$.`,
            `相似比为 $\\frac{${ln[known]}}{${sn[known]}} = \\frac{${large[known]}}{${small[known]}}$，所以 $${ln[ask]} = ${small[ask]} \\cdot \\frac{${large[known]}}{${small[known]}} = ${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "a-parallel-line-in-a-triangle",
      t("A line parallel to a side", "平行于一边的直线"),
      t(
        "A line through two sides of a triangle and parallel to the third cuts off a smaller triangle similar to the whole one, because the corresponding angles are equal. It also divides the two sides in the same ratio: if $DE \\parallel BC$ with $D$ on $AB$ and $E$ on $AC$, then $\\frac{AD}{DB} = \\frac{AE}{EC}$.",
        "一条与三角形一边平行、并与另外两边相交的直线，截出一个与原三角形相似的小三角形，因为对应角相等。它还把这两边分成相同的比：若 $DE \\parallel BC$，$D$ 在 $AB$ 上，$E$ 在 $AC$ 上，则 $\\frac{AD}{DB} = \\frac{AE}{EC}$。",
      ),
      (rng) => {
        const ad = rng.int(2, 9);
        const db = rng.int(2, 9);
        const m = rng.int(1, 4);
        const ae = ad * m;
        const ec = db * m;
        const bc = rng.int(2, 6) * (ad + db);
        const ask = rng.pick(["EC", "DE"] as const);
        const de = Q.of(bc * ad, ad + db);
        const value = ask === "EC" ? Q.of(ec) : de;
        return numberProblem({
          prompt: t(
            `In $\\triangle ABC$, point $D$ is on $AB$ and point $E$ is on $AC$, with $DE \\parallel BC$. If $AD = ${ad}$, $DB = ${db}$, $AE = ${ae}$ and $BC = ${bc}$, what is $${ask}$?`,
            `在 $\\triangle ABC$ 中，点 $D$ 在 $AB$ 上，点 $E$ 在 $AC$ 上，且 $DE \\parallel BC$。若 $AD = ${ad}$，$DB = ${db}$，$AE = ${ae}$，$BC = ${bc}$，则 $${ask}$ 是多少？`,
          ),
          answer: value,
          wrong:
            ask === "EC"
              ? [Q.of(ae * ad, db), Q.of(ae + db - ad), Q.of(ae * (ad + db), ad)]
              : [Q.of(bc * db, ad + db), Q.of(bc * ad, db), Q.of(bc - db)],
          solution: t(
            ask === "EC"
              ? `The parallel line divides the sides in the same ratio: $\\frac{AE}{EC} = \\frac{AD}{DB}$, so $EC = ${ae} \\cdot \\frac{${db}}{${ad}} = ${ec}$.`
              : `$\\triangle ADE \\sim \\triangle ABC$ with scale factor $\\frac{AD}{AB} = \\frac{${ad}}{${ad + db}}$, so $DE = ${bc} \\cdot \\frac{${ad}}{${ad + db}} = ${de.toLatex()}$.`,
            ask === "EC"
              ? `平行线把两边分成相同的比：$\\frac{AE}{EC} = \\frac{AD}{DB}$，所以 $EC = ${ae} \\cdot \\frac{${db}}{${ad}} = ${ec}$。`
              : `$\\triangle ADE \\sim \\triangle ABC$，相似比为 $\\frac{AD}{AB} = \\frac{${ad}}{${ad + db}}$，所以 $DE = ${bc} \\cdot \\frac{${ad}}{${ad + db}} = ${de.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** solvingParallelLineProblemsFromDescriptions solves for angles formed by parallel lines and a transversal described in words. */
export const solvingParallelLineProblemsFromDescriptions = topic(
  "solving-parallel-line-problems-from-descriptions",
  t("Solving Parallel Line Problems From Descriptions", "由描述解平行线问题"),
  t(
    "Use the angle pairs formed by a transversal of parallel lines, described in words, to set up and solve equations.",
    "利用文字描述的平行线被截线所截形成的角，列方程并求解。",
  ),
  ["parallel-lines-and-transversals"],
  ["8.G.A.5"],
  [
    kp(
      "equal-angle-pairs",
      t("Equal angle pairs", "相等的角对"),
      t(
        "When a transversal crosses two parallel lines, corresponding angles, alternate interior angles and alternate exterior angles are equal. If the two angles of such a pair are given as expressions, set them equal and solve for the variable.",
        "当一条截线与两条平行线相交时，同位角、内错角、外错角都相等。如果这样一对角用表达式给出，就令它们相等，解出变量。",
      ),
      (rng) => {
        const [pair, zh] = rng.pick([
          ["corresponding angles", "同位角"],
          ["alternate interior angles", "内错角"],
          ["alternate exterior angles", "外错角"],
        ] as const);
        const x = rng.int(5, 30);
        const p = rng.int(2, 6);
        const q = rng.int(1, p - 1);
        const angle = rng.int(30, 150);
        const r = angle - p * x;
        const s = angle - q * x;
        return numberProblem({
          prompt: t(
            `Two parallel lines are cut by a transversal. Two of the angles formed are ${pair}, with measures $(${linear(p, r)})^\\circ$ and $(${linear(q, s)})^\\circ$. What is the value of $x$?`,
            `两条平行线被一条截线所截，所成的两个角是${zh}，度数分别为 $(${linear(p, r)})^\\circ$ 和 $(${linear(q, s)})^\\circ$。$x$ 的值是多少？`,
          ),
          answer: x,
          wrong: [Q.of(180 - r - s, p + q), angle, Q.of(s + r, p - q)],
          solution: t(
            `${pair[0]!.toUpperCase()}${pair.slice(1)} are equal:${steps(`${linear(p, r)} = ${linear(q, s)}`, `${p - q === 1 ? "" : p - q}x = ${s - r}`, `x = ${x}`)}`,
            `${zh}相等：${steps(`${linear(p, r)} = ${linear(q, s)}`, `${p - q === 1 ? "" : p - q}x = ${s - r}`, `x = ${x}`)}`,
          ),
        });
      },
    ),
    kp(
      "supplementary-angle-pairs",
      t("Supplementary angle pairs", "互补的角对"),
      t(
        "Consecutive interior angles, on the same side of the transversal and between the parallel lines, are supplementary: they add up to $180^\\circ$. So their expressions are added and set equal to $180$, not set equal to each other.",
        "同旁内角位于截线同侧、两条平行线之间，它们互补：和为 $180^\\circ$。所以要把它们的表达式相加并令其等于 $180$，而不是令它们相等。",
      ),
      (rng) => {
        const x = rng.int(5, 30);
        const p = rng.int(1, 5);
        const q = rng.int(1, 5);
        const a1 = rng.int(40, 140);
        const r = a1 - p * x;
        const s = 180 - a1 - q * x;
        const ask = rng.bool();
        const other = 180 - a1;
        return numberProblem({
          prompt: t(
            `Two parallel lines are cut by a transversal. Two consecutive interior angles have measures $(${linear(p, r)})^\\circ$ and $(${linear(q, s)})^\\circ$. What is ${ask ? "the value of $x$" : "the measure of the second angle, in degrees"}?`,
            `两条平行线被一条截线所截，两个同旁内角的度数分别为 $(${linear(p, r)})^\\circ$ 和 $(${linear(q, s)})^\\circ$。${ask ? "$x$ 的值" : "第二个角的度数"}是多少？`,
          ),
          answer: ask ? x : other,
          wrong: ask ? [Q.of(s - r, p - q || 1), Q.of(180 - r - s, p), a1] : [a1, 90, Q.of(360 - other, 2)],
          solution: t(
            `Consecutive interior angles add up to $180^\\circ$:${steps(`${linear(p, r)} + ${linear(q, s)} = 180`, `${p + q}x = ${180 - r - s}`, `x = ${x}`)}${ask ? "" : `So the second angle is $${q} \\cdot ${x} + ${s < 0 ? `(${s})` : s} = ${other}^\\circ$.`}`,
            `同旁内角之和为 $180^\\circ$：${steps(`${linear(p, r)} + ${linear(q, s)} = 180`, `${p + q}x = ${180 - r - s}`, `x = ${x}`)}${ask ? "" : `所以第二个角为 $${q} \\cdot ${x} + ${s < 0 ? `(${s})` : s} = ${other}^\\circ$。`}`,
          ),
        });
      },
    ),
  ],
);

/** workingWithDescriptionsOfSimilarSolids scales surface areas and volumes of similar solids. */
export const workingWithDescriptionsOfSimilarSolids = topic(
  "working-with-descriptions-of-similar-solids",
  t("Working With Descriptions of Similar Solids", "处理对相似立体的描述"),
  t(
    "Use the scale factor of similar solids described in words: lengths scale by $k$, surface areas by $k^2$ and volumes by $k^3$.",
    "利用文字描述的相似立体的相似比：长度按 $k$、表面积按 $k^2$、体积按 $k^3$ 变化。",
  ),
  ["surface-areas-and-volumes-of-similar-solids"],
  ["HSG.GMD.A.3", "7.G.A.1"],
  [
    kp(
      "volumes-from-a-length-ratio",
      t("Volumes from a length ratio", "由长度比求体积"),
      t(
        "If two solids are similar with every length of the second $k$ times the matching length of the first, its surface area is $k^2$ times as large and its volume $k^3$ times as large, because volume multiplies three lengths. A cone twice as tall and twice as wide holds $8$ times as much.",
        "如果两个立体相似，第二个的每个长度是第一个对应长度的 $k$ 倍，那么它的表面积是 $k^2$ 倍，体积是 $k^3$ 倍，因为体积是三个长度相乘。一个高和宽都是原来 $2$ 倍的圆锥，容积是原来的 $8$ 倍。",
      ),
      (rng) => {
        const solid = rng.pick([
          ["cylinders", "圆柱"],
          ["cones", "圆锥"],
          ["rectangular boxes", "长方体盒子"],
          ["pyramids", "棱锥"],
        ] as const);
        const r1 = rng.int(2, 6);
        const k = rng.int(2, 4);
        const v = rng.int(5, 40);
        const kind = rng.pick(["volume", "area"] as const);
        const value = kind === "volume" ? v * k ** 3 : v * k * k;
        return numberProblem({
          prompt: t(
            `Two ${solid[0]} are similar. A height of the larger is $${r1 * k}$ cm and the matching height of the smaller is $${r1}$ cm. If the smaller has a ${kind === "volume" ? `volume of $${v}$ cubic` : `surface area of $${v}$ square`} centimeters, what is the ${kind === "volume" ? "volume" : "surface area"} of the larger?`,
            `两个${solid[1]}相似。大的一个高为 $${r1 * k}$ cm，小的对应的高为 $${r1}$ cm。若小的${kind === "volume" ? `体积为 $${v}$ 立方厘米` : `表面积为 $${v}$ 平方厘米`}，大的${kind === "volume" ? "体积" : "表面积"}是多少？`,
          ),
          answer: value,
          wrong: kind === "volume" ? [v * k, v * k * k, v * 3 * k] : [v * k, v * k ** 3, v * 2 * k],
          solution: t(
            `The scale factor is $\\frac{${r1 * k}}{${r1}} = ${k}$, so the ${kind === "volume" ? `volume is multiplied by $${k}^3 = ${k ** 3}$` : `surface area is multiplied by $${k}^2 = ${k * k}$`}: $${v} \\cdot ${kind === "volume" ? k ** 3 : k * k} = ${value}$.`,
            `相似比为 $\\frac{${r1 * k}}{${r1}} = ${k}$，所以${kind === "volume" ? `体积乘以 $${k}^3 = ${k ** 3}$` : `表面积乘以 $${k}^2 = ${k * k}$`}：$${v} \\cdot ${kind === "volume" ? k ** 3 : k * k} = ${value}$。`,
          ),
        });
      },
    ),
    kp(
      "volumes-from-an-area-ratio",
      t("Volumes from a surface area ratio", "由表面积比求体积"),
      t(
        "To go from a ratio of surface areas to a ratio of volumes, pass through the length ratio. Take the square root of the area ratio to get $k$, then cube $k$: surface areas in the ratio $4 : 9$ mean lengths in the ratio $2 : 3$ and volumes in the ratio $8 : 27$.",
        "要由表面积之比求体积之比，先求长度之比。对面积比开平方得到 $k$，再把 $k$ 立方：表面积之比为 $4 : 9$，意味着长度之比为 $2 : 3$，体积之比为 $8 : 27$。",
      ),
      (rng) => {
        const [p, q] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [1, 4],
          [4, 5],
        ] as const);
        const unit = rng.int(1, 6);
        const vSmall = p ** 3 * unit;
        const value = q ** 3 * unit;
        return numberProblem({
          prompt: t(
            `The surface areas of two similar solids are in the ratio $${p * p} : ${q * q}$. The smaller solid has a volume of $${vSmall}$ cubic meters. What is the volume of the larger solid, in cubic meters?`,
            `两个相似立体的表面积之比为 $${p * p} : ${q * q}$。较小立体的体积为 $${vSmall}$ 立方米。较大立体的体积是多少立方米？`,
          ),
          answer: value,
          wrong: [Q.of(vSmall * q * q, p * p), Q.of(vSmall * q, p), Q.of(vSmall * q ** 4, p ** 4)],
          solution: t(
            `The length ratio is $\\sqrt{${p * p}} : \\sqrt{${q * q}} = ${p} : ${q}$, so the volume ratio is $${p ** 3} : ${q ** 3}$ and the larger volume is $${vSmall} \\cdot \\frac{${q ** 3}}{${p ** 3}} = ${value}$ cubic meters.`,
            `长度之比为 $\\sqrt{${p * p}} : \\sqrt{${q * q}} = ${p} : ${q}$，所以体积之比为 $${p ** 3} : ${q ** 3}$，较大的体积为 $${vSmall} \\cdot \\frac{${q ** 3}}{${p ** 3}} = ${value}$ 立方米。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Areas and functions of shapes

/** borderProblems finds the area of a border around a rectangle and the width of a border from its area. */
export const borderProblems = topic(
  "border-problems",
  t("Border Problems", "边框问题"),
  t(
    "Find the area of a border of uniform width around a rectangle, and find the width of a border from a given area.",
    "求长方形周围等宽边框的面积，并由给定面积求边框的宽度。",
  ),
  ["finding-areas-between-shapes", "solving-quadratic-equations-by-factoring"],
  ["HSA.CED.A.1", "7.G.B.6"],
  [
    kp(
      "area-of-a-border",
      t("The area of a border", "边框的面积"),
      t(
        "A border of width $x$ around a $w$ by $l$ rectangle adds $x$ on every side, so the outer rectangle measures $(w + 2x)$ by $(l + 2x)$. The border's area is the outer area minus the inner area; a common mistake is to add $x$ only once to each dimension.",
        "宽为 $x$ 的边框围在 $w \\times l$ 的长方形四周，每一边都加上 $x$，所以外面的长方形尺寸是 $(w + 2x)$ 乘 $(l + 2x)$。边框面积等于外部面积减去内部面积；常见错误是每个方向只加一次 $x$。",
      ),
      (rng) => {
        const w = rng.int(3, 15);
        const l = w + rng.int(0, 10);
        const x = rng.int(1, 4);
        const value = (w + 2 * x) * (l + 2 * x) - w * l;
        return numberProblem({
          prompt: t(
            `A rectangular rug measuring $${w}$ ft by $${l}$ ft lies in the middle of a floor and is surrounded by a strip of floor $${x}$ ft wide on every side. What is the area of the strip, in square feet?`,
            `一块 $${w}$ ft 乘 $${l}$ ft 的长方形地毯铺在地板中央，四周各留出宽 $${x}$ ft 的一圈地板。这一圈的面积是多少平方英尺？`,
          ),
          answer: value,
          wrong: [(w + x) * (l + x) - w * l, (w + 2 * x) * (l + 2 * x), 2 * x * (w + l)],
          solution: t(
            `The outer rectangle is $${w + 2 * x}$ ft by $${l + 2 * x}$ ft, so the strip has area${steps(`${w + 2 * x} \\cdot ${l + 2 * x} - ${w} \\cdot ${l} = ${(w + 2 * x) * (l + 2 * x)} - ${w * l} = ${value}`)}`,
            `外面的长方形为 $${w + 2 * x}$ ft 乘 $${l + 2 * x}$ ft，所以这一圈的面积为${steps(`${w + 2 * x} \\cdot ${l + 2 * x} - ${w} \\cdot ${l} = ${(w + 2 * x) * (l + 2 * x)} - ${w * l} = ${value}`)}`,
          ),
        });
      },
    ),
    kp(
      "width-of-a-border",
      t("The width of a border", "边框的宽度"),
      t(
        "If the total area including a border of width $x$ is known, write $(w + 2x)(l + 2x)$ equal to that area and solve the quadratic. Only the positive solution makes sense as a width, so reject the negative root.",
        "如果已知包括宽为 $x$ 的边框在内的总面积，就令 $(w + 2x)(l + 2x)$ 等于这个面积，解这个二次方程。只有正根可以作为宽度，舍去负根。",
      ),
      (rng) => {
        const w = rng.int(4, 16);
        const l = w + rng.int(0, 8);
        const x = rng.int(1, 5);
        const total = (w + 2 * x) * (l + 2 * x);
        return numberProblem({
          prompt: t(
            `A photo measuring $${w}$ in by $${l}$ in is placed in a frame of uniform width $x$ inches. The photo and frame together cover $${total}$ square inches. What is $x$?`,
            `一张 $${w}$ in 乘 $${l}$ in 的照片装在宽度均匀为 $x$ 英寸的相框里。照片和相框合起来的面积为 $${total}$ 平方英寸。$x$ 是多少？`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [2 * x, Q.of(total - w * l, 2 * (w + l)), Q.of(-(2 * x + w + l), 2)],
          solution: t(
            `The outer dimensions are $${w} + 2x$ and $${l} + 2x$:${steps(`(${w} + 2x)(${l} + 2x) = ${total}`, `4x^2 + ${2 * (w + l)}x + ${w * l} = ${total}`, `4x^2 + ${2 * (w + l)}x - ${total - w * l} = 0`)}This factors as $(x - ${x})(4x + ${2 * (w + l) + 4 * x}) = 0$, and the positive solution is $x = ${x}$.`,
            `外部尺寸为 $${w} + 2x$ 和 $${l} + 2x$：${steps(`(${w} + 2x)(${l} + 2x) = ${total}`, `4x^2 + ${2 * (w + l)}x + ${w * l} = ${total}`, `4x^2 + ${2 * (w + l)}x - ${total - w * l} = 0`)}分解得 $(x - ${x})(4x + ${2 * (w + l) + 4 * x}) = 0$，正根为 $x = ${x}$。`,
          ),
        });
      },
    ),
  ],
);

/** constructingFunctionsRepresentingPropertiesOf2dShapes writes areas and perimeters of shapes as functions of a length. */
export const constructingFunctionsRepresentingPropertiesOf2dShapes = topic(
  "constructing-functions-representing-properties-of-2d-shapes",
  t("Constructing Functions Representing Properties of 2D Shapes", "构造表示平面图形性质的函数"),
  t(
    "Write the area or perimeter of a rectangle described in words as a function of one of its lengths.",
    "把文字描述的长方形的面积或周长写成其某一长度的函数。",
  ),
  ["constructing-algebraic-expressions", "area-of-rectangles-and-squares", "distributive-law-for-polynomials"],
  ["HSF.BF.A.1", "HSA.CED.A.2"],
  [
    kp(
      "area-as-a-function",
      t("Area as a function of a length", "面积作为长度的函数"),
      t(
        "To write an area as a function, express every length of the shape in terms of one variable first, using the description. Then multiply as the area formula says. A rectangle whose length is $3$ more than twice its width $w$ has area $A(w) = w(2w + 3)$.",
        "要把面积写成函数，先根据描述用一个变量表示图形的每个长度，再按面积公式相乘。长比宽 $w$ 的 $2$ 倍多 $3$ 的长方形，面积为 $A(w) = w(2w + 3)$。",
      ),
      (rng) => {
        const p = rng.int(2, 5);
        const q = rng.nonZero(-6, 8);
        const answer = `${p}w^2 ${q < 0 ? "-" : "+"} ${Math.abs(q)}w`;
        const [more, zh] = q > 0 ? [`${q} more than`, `多 ${q}`] : [`${-q} less than`, `少 ${-q}`];
        return expressionProblem({
          prompt: t(
            `The length of a rectangle is ${more} ${p} times its width $w$. Write the area $A(w)$ of the rectangle.`,
            `一个长方形的长比宽 $w$ 的 ${p} 倍${zh}。写出这个长方形的面积 $A(w)$。`,
          ),
          answer,
          prefix: "A(w) =",
          wrong: [
            linear(p + 1, q, "w"),
            `${p}w^2 ${q < 0 ? "+" : "-"} ${Math.abs(q)}w`,
            `2w + 2(${linear(p, q, "w")})`,
            `${p}w^2 ${q < 0 ? "-" : "+"} ${Math.abs(q)}`,
          ],
          solution: t(
            `The length is $${linear(p, q, "w")}$, so${steps(`A(w) = w(${linear(p, q, "w")}) = ${answer}`)}`,
            `长为 $${linear(p, q, "w")}$，所以${steps(`A(w) = w(${linear(p, q, "w")}) = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "area-from-a-fixed-perimeter",
      t("Area from a fixed perimeter", "周长一定时的面积"),
      t(
        "If a rectangle's perimeter $P$ is fixed and its width is $x$, the length is what remains of half the perimeter, $\\frac{P}{2} - x$. So the area is $A(x) = x\\left(\\frac{P}{2} - x\\right)$, a quadratic function whose value depends on the shape.",
        "如果长方形的周长 $P$ 一定、宽为 $x$，那么长等于半周长减去宽，即 $\\frac{P}{2} - x$。所以面积为 $A(x) = x\\left(\\frac{P}{2} - x\\right)$，这是一个二次函数，它的值随形状变化。",
      ),
      (rng) => {
        const half = rng.int(6, 40);
        const P = 2 * half;
        const x = rng.int(1, half - 1);
        const value = x * (half - x);
        return numberProblem({
          prompt: t(
            `A rectangle has a perimeter of $${P}$ meters and a width of $x$ meters, so its area is a function $A(x)$. What is $A(${x})$, in square meters?`,
            `一个长方形周长为 $${P}$ 米、宽为 $x$ 米，所以它的面积是函数 $A(x)$。$A(${x})$ 是多少平方米？`,
          ),
          answer: value,
          wrong: [x * (P - x), x * (P - 2 * x), half * x],
          solution: t(
            `Half the perimeter is $${half}$, so the length is $${half} - x$ and $A(x) = x(${half} - x)$. Then $A(${x}) = ${x}(${half} - ${x}) = ${value}$.`,
            `半周长为 $${half}$，所以长为 $${half} - x$，$A(x) = x(${half} - x)$。于是 $A(${x}) = ${x}(${half} - ${x}) = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Inscribed shapes

/** on is the point at distance r from the origin in direction d degrees. */
const on = (d: number, r: number): Point => [r * Math.cos((d * Math.PI) / 180), r * Math.sin((d * Math.PI) / 180)];

/** circleAt draws a circle of radius r about the origin. */
const circleAt = (r: number): Mark => ({ kind: "polygon", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, r)) });

/** equilateralInCircleFigure shows an equilateral triangle inscribed in a circle, with the radius to the top vertex and the height through the center. */
const equilateralInCircleFigure: Figure = (() => {
  const [a, b, c] = [on(90, 3), on(210, 3), on(330, 3)];
  const m: Point = [0, -1.5];
  return {
    svg: sketch([
      circleAt(3),
      { kind: "polygon", points: [a, b, c] },
      { kind: "segment", a: [0, 0], b: m, dashed: true },
      { kind: "segment", a: [0, 0], b: a, accent: true },
      { kind: "right", vertex: m, from: c, to: a },
      { kind: "dot", at: [0, 0] },
      { kind: "label", at: [0, 0], text: "O", dir: "e" },
      { kind: "label", at: [0, 1.5], text: "r", dir: "w", italic: true },
      { kind: "label", at: [0, -0.75], text: "r/2", dir: "w" },
      { kind: "side", a: c, b: a, text: "s" },
    ]),
    alt: t(
      "An equilateral triangle with side s inscribed in a circle with center O. The radius r runs from O to the top vertex, and the height from that vertex continues through O for another r/2 to the midpoint of the bottom side, so the height is 3r/2.",
      "一个边长为 s 的正三角形内接于圆心为 O 的圆。半径 r 从 O 连到顶端的顶点；从该顶点出发的高经过 O，再延伸 r/2 到底边中点，所以高为 3r/2。",
    ),
  };
})();

/** circleInEquilateralFigure shows the circle inscribed in an equilateral triangle, with its radius to the midpoint of the bottom side. */
const circleInEquilateralFigure: Figure = (() => {
  const [a, b, c] = [on(90, 3), on(210, 3), on(330, 3)];
  const m: Point = [0, -1.5];
  return {
    svg: sketch([
      { kind: "polygon", points: [a, b, c] },
      circleAt(1.5),
      { kind: "segment", a: [0, 0], b: m, accent: true },
      { kind: "segment", a: a, b: [0, 0], dashed: true },
      { kind: "right", vertex: m, from: c, to: a },
      { kind: "dot", at: [0, 0] },
      { kind: "label", at: [0, 0], text: "O", dir: "e" },
      { kind: "label", at: [0, -0.75], text: "r", dir: "w", italic: true },
      { kind: "side", a: b, b: c, text: "s" },
    ]),
    alt: t(
      "A circle inscribed in an equilateral triangle with side s, centered at O. The radius r runs from O straight down to the midpoint of the bottom side, meeting it at a right angle; the dashed rest of the height, from O up to the top vertex, is twice as long.",
      "一个圆内切于边长为 s 的正三角形，圆心为 O。半径 r 从 O 竖直向下连到底边中点，与底边垂直；高的其余部分（从 O 到顶端顶点，虚线）是它的两倍长。",
    ),
  };
})();

/** triangleOnDiameterFigure shows a triangle inscribed in a circle with side AB a diameter and the right angle at C. */
const triangleOnDiameterFigure: Figure = (() => {
  const [a, b, c] = [on(180, 3), on(0, 3), on(65, 3)];
  return {
    svg: sketch([
      circleAt(3),
      { kind: "polygon", points: [a, b, c] },
      { kind: "right", vertex: c, from: a, to: b },
      { kind: "segment", a: c, b: [c[0], 0], dashed: true },
      { kind: "dot", at: [0, 0] },
      { kind: "label", at: a, text: "A", dir: "w" },
      { kind: "label", at: b, text: "B", dir: "e" },
      { kind: "label", at: c, text: "C", dir: "n" },
      { kind: "label", at: [c[0], c[1] / 2], text: "h", dir: "e", italic: true },
    ]),
    alt: t(
      "Triangle ABC inscribed in a circle with AB a diameter through the center. The angle at C is a right angle, and a dashed height h drops from C to AB.",
      "△ABC 内接于圆，AB 是过圆心的直径。C 处的角是直角，从 C 到 AB 的虚线是高 h。",
    ),
  };
})();

/** equilateralTrianglesInscribedInCircles relates the side and area of an inscribed equilateral triangle to the radius. */
export const equilateralTrianglesInscribedInCircles = topic(
  "equilateral-triangles-inscribed-in-circles",
  t("Equilateral Triangles Inscribed in Circles", "圆的内接正三角形"),
  t(
    "Relate the side length and area of an equilateral triangle to the radius of the circle through its vertices.",
    "建立正三角形的边长、面积与其外接圆半径之间的关系。",
  ),
  ["squares-inscribed-in-circles", "area-of-equilateral-triangles", "medians-and-centroids"],
  ["HSG.C.A.3", "HSG.CO.D.13"],
  [
    kp(
      "side-from-the-radius",
      t("The side from the radius", "由半径求边长"),
      t(
        "The center of the circle is the centroid of the inscribed equilateral triangle, which lies two thirds of the way down each height. So the radius $r$ is two thirds of the height, the height is $\\frac{3r}{2}$, and the side is $s = r\\sqrt{3}$.",
        "圆心就是内接正三角形的重心，位于每条高从顶点往下三分之二处。所以半径 $r$ 是高的三分之二，高为 $\\frac{3r}{2}$，边长为 $s = r\\sqrt{3}$。",
      ),
      (rng) => {
        const r = rng.int(2, 24);
        const back = rng.bool();
        return back
          ? numberProblem({
              prompt: t(
                `An equilateral triangle with sides of length $${radical(r, 3)}$ is inscribed in a circle. What is the radius of the circle?`,
                `一个边长为 $${radical(r, 3)}$ 的正三角形内接于一个圆。这个圆的半径是多少？`,
              ),
              answer: r,
              wrong: [3 * r, Q.of(r, 2), 2 * r],
              solution: t(
                `The side of an inscribed equilateral triangle is $r\\sqrt{3}$, so $r\\sqrt{3} = ${radical(r, 3)}$ and $r = ${r}$.`,
                `内接正三角形的边长为 $r\\sqrt{3}$，所以 $r\\sqrt{3} = ${radical(r, 3)}$，$r = ${r}$。`,
              ),
            })
          : radicalProblem({
              prompt: t(
                `An equilateral triangle is inscribed in a circle of radius $${r}$. What is the side length of the triangle, in simplest radical form?`,
                `一个正三角形内接于半径为 $${r}$ 的圆。这个三角形的边长是多少？用最简根式表示。`,
              ),
              answer: [r, 3],
              wrong: [radical(r, 2), radical(2 * r, 3), radical(Q.of(r, 2), 3), String(2 * r)],
              solution: t(
                `The height is $\\frac{3}{2} \\cdot ${r} = ${Q.of(3 * r, 2).toLatex()}$, and in an equilateral triangle the height is $\\frac{\\sqrt{3}}{2}$ of the side, so the side is $${Q.of(3 * r, 2).toLatex()} \\cdot \\frac{2}{\\sqrt{3}} = ${radical(r, 3)}$.`,
                `高为 $\\frac{3}{2} \\cdot ${r} = ${Q.of(3 * r, 2).toLatex()}$，而正三角形的高是边长的 $\\frac{\\sqrt{3}}{2}$，所以边长为 $${Q.of(3 * r, 2).toLatex()} \\cdot \\frac{2}{\\sqrt{3}} = ${radical(r, 3)}$。`,
              ),
            });
      },
      equilateralInCircleFigure,
    ),
    kp(
      "area-from-the-radius",
      t("The area from the radius", "由半径求面积"),
      t(
        "With side $s = r\\sqrt{3}$, the area of the inscribed equilateral triangle is $\\frac{\\sqrt{3}}{4}s^2 = \\frac{\\sqrt{3}}{4} \\cdot 3r^2 = \\frac{3\\sqrt{3}}{4}r^2$. Equivalently, it is half the base times the height $\\frac{3r}{2}$.",
        "由边长 $s = r\\sqrt{3}$，内接正三角形的面积为 $\\frac{\\sqrt{3}}{4}s^2 = \\frac{\\sqrt{3}}{4} \\cdot 3r^2 = \\frac{3\\sqrt{3}}{4}r^2$。也可以用底乘高 $\\frac{3r}{2}$ 再除以 $2$ 求得。",
      ),
      (rng) => {
        const r = rng.int(2, 30);
        const c = Q.of(3 * r * r, 4);
        return radicalProblem({
          prompt: t(
            `An equilateral triangle is inscribed in a circle of radius $${r}$. What is the area of the triangle, in simplest radical form?`,
            `一个正三角形内接于半径为 $${r}$ 的圆。这个三角形的面积是多少？用最简根式表示。`,
          ),
          answer: [c, 3],
          wrong: [radical(Q.of(r * r, 4), 3), radical(Q.of(3 * r * r, 2), 3), radical(c, 2), String(3 * r * r)],
          solution: t(
            `The side is $${radical(r, 3)}$, so the area is${steps(`\\frac{\\sqrt{3}}{4}(${radical(r, 3)})^2 = \\frac{\\sqrt{3}}{4} \\cdot ${3 * r * r} = ${radical(c, 3)}`)}`,
            `边长为 $${radical(r, 3)}$，所以面积为${steps(`\\frac{\\sqrt{3}}{4}(${radical(r, 3)})^2 = \\frac{\\sqrt{3}}{4} \\cdot ${3 * r * r} = ${radical(c, 3)}`)}`,
          ),
        });
      },
    ),
  ],
);

/** circlesInscribedInEquilateralTriangles relates the radius of the inscribed circle to the side of an equilateral triangle. */
export const circlesInscribedInEquilateralTriangles = topic(
  "circles-inscribed-in-equilateral-triangles",
  t("Circles Inscribed in Equilateral Triangles", "正三角形的内切圆"),
  t(
    "Relate the radius and area of the circle inscribed in an equilateral triangle to the side of the triangle.",
    "建立正三角形内切圆的半径、面积与三角形边长之间的关系。",
  ),
  ["equilateral-triangles-inscribed-in-circles"],
  ["HSG.C.A.3"],
  [
    kp(
      "inradius-from-the-side",
      t("The radius from the side", "由边长求半径"),
      t(
        "The inscribed circle of an equilateral triangle has the same center as the circumscribed one, the centroid, but its radius reaches only from the center to the middle of a side: one third of the height. With side $s$ the height is $\\frac{\\sqrt{3}}{2}s$, so the radius is $\\frac{\\sqrt{3}}{6}s$, half the circumradius.",
        "正三角形的内切圆与外接圆圆心相同，都是重心，但内切圆半径只从圆心到边的中点，即高的三分之一。边长为 $s$ 时高为 $\\frac{\\sqrt{3}}{2}s$，所以内切圆半径为 $\\frac{\\sqrt{3}}{6}s$，是外接圆半径的一半。",
      ),
      (rng) => {
        const k = rng.int(1, 30);
        const s = 6 * k;
        return radicalProblem({
          prompt: t(
            `A circle is inscribed in an equilateral triangle with sides of length $${s}$. What is the radius of the circle, in simplest radical form?`,
            `一个圆内切于边长为 $${s}$ 的正三角形。这个圆的半径是多少？用最简根式表示。`,
          ),
          answer: [k, 3],
          wrong: [radical(2 * k, 3), radical(3 * k, 3), String(2 * k), radical(k, 2)],
          solution: t(
            `The height is $\\frac{\\sqrt{3}}{2} \\cdot ${s} = ${radical(3 * k, 3)}$, and the radius is one third of it: $${radical(k, 3)}$.`,
            `高为 $\\frac{\\sqrt{3}}{2} \\cdot ${s} = ${radical(3 * k, 3)}$，半径是它的三分之一：$${radical(k, 3)}$。`,
          ),
        });
      },
      circleInEquilateralFigure,
    ),
    kp(
      "area-of-the-inscribed-circle",
      t("The area of the inscribed circle", "内切圆的面积"),
      t(
        "Once the radius $r = \\frac{\\sqrt{3}}{6}s$ is known, the circle's area is $\\pi r^2 = \\pi \\cdot \\frac{3s^2}{36} = \\frac{\\pi s^2}{12}$. The root disappears when the radius is squared, so the area is a rational multiple of $\\pi$.",
        "求出半径 $r = \\frac{\\sqrt{3}}{6}s$ 后，圆的面积为 $\\pi r^2 = \\pi \\cdot \\frac{3s^2}{36} = \\frac{\\pi s^2}{12}$。半径平方后根号消失，所以面积是 $\\pi$ 的有理数倍。",
      ),
      (rng) => {
        const s = rng.int(2, 40);
        const c = Q.of(s * s, 12);
        return numberProblem({
          prompt: t(
            `A circle is inscribed in an equilateral triangle with sides of length $${s}$. The area of the circle is $k\\pi$. What is $k$?`,
            `一个圆内切于边长为 $${s}$ 的正三角形，圆的面积为 $k\\pi$。$k$ 是多少？`,
          ),
          answer: c,
          wrong: [Q.of(s * s, 3), Q.of(s * s, 6), Q.of(s * s, 36), Q.of(s * s, 4)],
          solution: t(
            `The radius is $\\frac{\\sqrt{3}}{6} \\cdot ${s}$, so $r^2 = \\frac{3 \\cdot ${s * s}}{36} = ${c.toLatex()}$ and the area is $${c.toLatex()}\\pi$.`,
            `半径为 $\\frac{\\sqrt{3}}{6} \\cdot ${s}$，所以 $r^2 = \\frac{3 \\cdot ${s * s}}{36} = ${c.toLatex()}$，面积为 $${c.toLatex()}\\pi$。`,
          ),
        });
      },
    ),
  ],
);

/** areasOfInscribedTriangles finds areas of triangles inscribed in circles with a side along a diameter. */
export const areasOfInscribedTriangles = topic(
  "areas-of-inscribed-triangles",
  t("Areas of Inscribed Triangles", "内接三角形的面积"),
  t(
    "Find areas of triangles inscribed in a circle, using the right angle opposite a diameter.",
    "利用直径所对的角是直角，求圆的内接三角形的面积。",
  ),
  ["angles-in-inscribed-right-triangles", "areas-of-triangles"],
  ["HSG.C.A.2"],
  [
    kp(
      "triangle-on-a-diameter",
      t("A triangle on a diameter", "以直径为边的三角形"),
      t(
        "If one side of an inscribed triangle is a diameter, the angle opposite it is a right angle. The diameter is then the hypotenuse, so the Pythagorean theorem gives the missing leg, and the area is half the product of the two legs.",
        "如果内接三角形的一边是直径，那么它所对的角是直角。直径就是斜边，于是可以用勾股定理求出另一条直角边，面积等于两条直角边乘积的一半。",
      ),
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const k = rng.int(1, 4);
        const [p, q] = rng.bool() ? [a * k, b * k] : [b * k, a * k];
        const d = c * k;
        const r = Q.of(d, 2);
        return numberProblem({
          prompt: t(
            `Triangle $ABC$ is inscribed in a circle of radius $${r.toLatex()}$, and $AB$ is a diameter. If $AC = ${p}$, what is the area of triangle $ABC$?`,
            `$\\triangle ABC$ 内接于半径为 $${r.toLatex()}$ 的圆，$AB$ 是直径。若 $AC = ${p}$，则 $\\triangle ABC$ 的面积是多少？`,
          ),
          answer: Q.of(p * q, 2),
          wrong: [Q.of(p * d, 2), Q.of(p * q), r.mul(Q.of(p))],
          solution: t(
            `The angle at $C$ is a right angle and $AB = ${d}$. Then $BC = \\sqrt{${d}^2 - ${p}^2} = ${q}$ and the area is $\\frac{1}{2} \\cdot ${p} \\cdot ${q} = ${Q.of(p * q, 2).toLatex()}$.`,
            `$C$ 处的角是直角，且 $AB = ${d}$。于是 $BC = \\sqrt{${d}^2 - ${p}^2} = ${q}$，面积为 $\\frac{1}{2} \\cdot ${p} \\cdot ${q} = ${Q.of(p * q, 2).toLatex()}$。`,
          ),
        });
      },
      triangleOnDiameterFigure,
    ),
    kp(
      "greatest-inscribed-triangle-on-a-diameter",
      t("The height above a diameter", "直径上方的高"),
      t(
        "A triangle with a diameter of length $2r$ as its base has area $\\frac{1}{2} \\cdot 2r \\cdot h = rh$, where $h$ is the distance of the third vertex from the diameter. That distance is at most $r$, reached when the third vertex is halfway around, so the largest such triangle has area $r^2$.",
        "以长为 $2r$ 的直径为底的三角形，面积为 $\\frac{1}{2} \\cdot 2r \\cdot h = rh$，其中 $h$ 是第三个顶点到直径的距离。这个距离最大为 $r$，此时第三个顶点在半圆的正中，所以这样的三角形面积最大为 $r^2$。",
      ),
      (rng) => {
        const r = rng.int(3, 15);
        const max = rng.bool();
        const h = rng.int(1, r - 1);
        return numberProblem({
          prompt: max
            ? t(
                `Triangle $PQR$ is inscribed in a circle of radius $${r}$, with $PQ$ a diameter. What is the greatest possible area of triangle $PQR$?`,
                `$\\triangle PQR$ 内接于半径为 $${r}$ 的圆，$PQ$ 是直径。$\\triangle PQR$ 的面积最大可能是多少？`,
              )
            : t(
                `Triangle $PQR$ is inscribed in a circle of radius $${r}$, with $PQ$ a diameter. Point $R$ is $${h}$ units from the line $PQ$. What is the area of triangle $PQR$?`,
                `$\\triangle PQR$ 内接于半径为 $${r}$ 的圆，$PQ$ 是直径。点 $R$ 到直线 $PQ$ 的距离为 $${h}$。$\\triangle PQR$ 的面积是多少？`,
              ),
          answer: max ? r * r : r * h,
          wrong: max ? [2 * r * r, Q.of(r * r, 2), 4 * r * r] : [2 * r * h, Q.of(r * h, 2), r * r],
          solution: max
            ? t(
                `The base $PQ = ${2 * r}$, and the height is at most the radius $${r}$, so the greatest area is $\\frac{1}{2} \\cdot ${2 * r} \\cdot ${r} = ${r * r}$.`,
                `底 $PQ = ${2 * r}$，高最大等于半径 $${r}$，所以最大面积为 $\\frac{1}{2} \\cdot ${2 * r} \\cdot ${r} = ${r * r}$。`,
              )
            : t(
                `The base is the diameter, $${2 * r}$, and the height is $${h}$, so the area is $\\frac{1}{2} \\cdot ${2 * r} \\cdot ${h} = ${r * h}$.`,
                `底是直径 $${2 * r}$，高是 $${h}$，所以面积为 $\\frac{1}{2} \\cdot ${2 * r} \\cdot ${h} = ${r * h}$。`,
              ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Solids

/** constructingFunctionsRepresentingPropertiesOfRectangularSolids writes volumes and surface areas of boxes as functions. */
export const constructingFunctionsRepresentingPropertiesOfRectangularSolids = topic(
  "constructing-functions-representing-properties-of-rectangular-solids",
  t("Constructing Functions Representing Properties of Rectangular Solids", "构造表示长方体性质的函数"),
  t(
    "Write the volume or surface area of a rectangular box described in words as a function of one length.",
    "把文字描述的长方体的体积或表面积写成某一长度的函数。",
  ),
  ["surface-areas-of-rectangular-solids", "constructing-functions-representing-properties-of-2d-shapes"],
  ["HSF.BF.A.1"],
  [
    kp(
      "volume-of-an-open-box",
      t("The volume of a folded box", "折叠盒子的体积"),
      t(
        "Cutting a square of side $x$ from each corner of an $a$ by $b$ sheet and folding up the sides makes an open box. Each cut takes $x$ off both ends of a side, so the base is $(a - 2x)$ by $(b - 2x)$ and the height is $x$: $V(x) = x(a - 2x)(b - 2x)$.",
        "从 $a \\times b$ 的纸板四个角各剪去边长为 $x$ 的正方形，再把四边折起，就做成一个无盖盒子。每条边的两端各被剪去 $x$，所以底面为 $(a - 2x)$ 乘 $(b - 2x)$，高为 $x$：$V(x) = x(a - 2x)(b - 2x)$。",
      ),
      (rng) => {
        const a = rng.int(8, 30);
        const b = rng.int(8, 30);
        const x = rng.int(1, Math.floor(Math.min(a, b) / 2) - 1);
        const value = x * (a - 2 * x) * (b - 2 * x);
        return numberProblem({
          prompt: t(
            `An open box is made from a $${a}$ cm by $${b}$ cm sheet of cardboard by cutting a square of side $x$ cm from each corner and folding up the sides. The volume of the box is $V(x)$ cubic centimeters. What is $V(${x})$?`,
            `用一张 $${a}$ cm 乘 $${b}$ cm 的纸板，从四个角各剪去边长 $x$ cm 的正方形，再把四边折起，做成一个无盖盒子。盒子的体积为 $V(x)$ 立方厘米。$V(${x})$ 是多少？`,
          ),
          answer: value,
          wrong: [x * (a - x) * (b - x), (a - 2 * x) * (b - 2 * x), x * a * b],
          solution: t(
            `The base is $(${a} - 2x)$ by $(${b} - 2x)$ and the height is $x$. So $V(${x}) = ${x} \\cdot ${a - 2 * x} \\cdot ${b - 2 * x} = ${value}$.`,
            `底面为 $(${a} - 2x)$ 乘 $(${b} - 2x)$，高为 $x$。所以 $V(${x}) = ${x} \\cdot ${a - 2 * x} \\cdot ${b - 2 * x} = ${value}$。`,
          ),
        });
      },
    ),
    kp(
      "surface-area-as-a-function",
      t("Surface area as a function", "表面积作为函数"),
      t(
        "A rectangular box with length $l$, width $w$ and height $h$ has surface area $2lw + 2lh + 2wh$, one pair of faces for each pair of dimensions. Write each dimension in terms of one variable from the description, then substitute and simplify.",
        "长、宽、高分别为 $l$、$w$、$h$ 的长方体，表面积为 $2lw + 2lh + 2wh$，每两个尺寸对应一对面。先根据描述用一个变量表示每个尺寸，再代入并化简。",
      ),
      (rng) => {
        const p = rng.int(2, 4);
        const h = rng.int(1, 9);
        // square base of side x? no: length p x, width x, height h
        const answer = `${2 * p}x^2 + ${2 * h * (p + 1)}x`;
        return expressionProblem({
          prompt: t(
            `A closed rectangular box has width $x$, length $${p}x$ and height $${h}$. Write its surface area $S(x)$.`,
            `一个有盖的长方体盒子宽为 $x$、长为 $${p}x$、高为 $${h}$。写出它的表面积 $S(x)$。`,
          ),
          answer,
          prefix: "S(x) =",
          wrong: [`${p}x^2 + ${h * (p + 1)}x`, `${p * h}x^2`, `${2 * p}x^2 + ${2 * h * p}x`, `${2 * p}x^2 + ${h * (p + 1)}x`],
          solution: t(
            `Add the areas of the three pairs of faces:${steps(`S(x) = 2(${p}x)(x) + 2(${p}x)(${h}) + 2(x)(${h}) = ${answer}`)}`,
            `把三对面的面积相加：${steps(`S(x) = 2(${p}x)(x) + 2(${p}x)(${h}) + 2(x)(${h}) = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** constructingFunctionsRepresentingVolumesOfCylindersConesAndPyramids writes volumes of round and pointed solids as functions. */
export const constructingFunctionsRepresentingVolumesOfCylindersConesAndPyramids = topic(
  "constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids",
  t("Constructing Functions Representing Volumes of Cylinders, Cones, and Pyramids", "构造表示圆柱、圆锥和棱锥体积的函数"),
  t(
    "Write the volume of a cylinder, cone or pyramid whose dimensions are related as a function of one length.",
    "当圆柱、圆锥或棱锥的尺寸相互关联时，把体积写成某一长度的函数。",
  ),
  ["volumes-of-right-cones"],
  ["HSG.GMD.A.3", "HSF.BF.A.1"],
  [
    kp(
      "volume-functions-with-pi",
      t("Volume functions of round solids", "圆形立体的体积函数"),
      t(
        "If a cylinder's or cone's height is a multiple of its radius, $h = cr$, substitute into the volume formula to get a function of $r$ alone: a cylinder gives $\\pi r^2 (cr) = c\\pi r^3$ and a cone gives $\\frac{1}{3}\\pi r^2 (cr) = \\frac{c}{3}\\pi r^3$.",
        "如果圆柱或圆锥的高是半径的倍数 $h = cr$，把它代入体积公式，就得到只含 $r$ 的函数：圆柱为 $\\pi r^2 (cr) = c\\pi r^3$，圆锥为 $\\frac{1}{3}\\pi r^2 (cr) = \\frac{c}{3}\\pi r^3$。",
      ),
      (rng) => {
        const c = rng.int(2, 12);
        const cone = rng.bool();
        const diameter = rng.bool();
        const hc = diameter ? 2 * c : c;
        const value = cone ? Q.of(hc, 3) : Q.of(hc);
        return numberProblem({
          prompt: t(
            `The height of a ${cone ? "cone" : "cylinder"} is $${c}$ times its ${diameter ? "diameter" : "radius"}, and its radius is $r$. Its volume can be written as $V(r) = k\\pi r^3$. What is $k$?`,
            `一个${cone ? "圆锥" : "圆柱"}的高是其${diameter ? "直径" : "半径"}的 $${c}$ 倍，半径为 $r$。它的体积可写成 $V(r) = k\\pi r^3$。$k$ 是多少？`,
          ),
          answer: value,
          wrong: [
            ...new Set(
              [cone ? Q.of(hc) : Q.of(hc, 3), Q.of(diameter ? c : 2 * c, cone ? 3 : 1), Q.of(hc * hc, cone ? 3 : 1), Q.of(hc, 2)].map((w) =>
                w.toString(),
              ),
            ),
          ]
            .map((w) => Q.parse(w))
            .filter((w) => !w.eq(value)),
          solution: t(
            `${diameter ? `The diameter is $2r$, so ` : ""}$h = ${hc}r$. Substitute:${steps(`V(r) = ${cone ? "\\frac{1}{3}" : ""}\\pi r^2 (${hc}r) = ${value.toLatex()}\\pi r^3`)}`,
            `${diameter ? "直径为 $2r$，所以" : ""}$h = ${hc}r$。代入：${steps(`V(r) = ${cone ? "\\frac{1}{3}" : ""}\\pi r^2 (${hc}r) = ${value.toLatex()}\\pi r^3`)}`,
          ),
        });
      },
    ),
    kp(
      "volume-function-of-a-pyramid",
      t("The volume function of a pyramid", "棱锥的体积函数"),
      t(
        "A pyramid has volume one third of base area times height. If a square pyramid has base side $x$ and a height related to $x$, such as $x + 3$, then $V(x) = \\frac{1}{3}x^2(x + 3)$, and evaluating the function gives the volume for any particular base.",
        "棱锥的体积等于底面积乘高的三分之一。如果正四棱锥底面边长为 $x$，高与 $x$ 有关，比如 $x + 3$，那么 $V(x) = \\frac{1}{3}x^2(x + 3)$，代入具体的值就得到相应的体积。",
      ),
      (rng) => {
        const d = rng.nonZero(-2, 9);
        const x = rng.int(3, 12);
        if (x + d <= 0 || ((x * x * (x + d)) % 3 !== 0 && rng.bool(0.6)))
          return constructingFunctionsRepresentingVolumesOfCylindersConesAndPyramids.knowledgePoints[1]!.generate(rng);
        const value = Q.of(x * x * (x + d), 3);
        return numberProblem({
          prompt: t(
            `A square pyramid has base side $x$ meters, and its height is $${Math.abs(d)}$ meters ${d > 0 ? "more" : "less"} than its base side. The volume is $V(x)$ cubic meters. What is $V(${x})$?`,
            `一个正四棱锥底面边长为 $x$ 米，高比底面边长${d > 0 ? "多" : "少"} $${Math.abs(d)}$ 米。体积为 $V(x)$ 立方米。$V(${x})$ 是多少？`,
          ),
          answer: value,
          wrong: [Q.of(x * x * (x + d)), Q.of(x * x * (x - d), 3), Q.of(x * (x + d), 3)],
          solution: t(
            `$V(x) = \\frac{1}{3}x^2(${linear(1, d)})$, so $V(${x}) = \\frac{1}{3} \\cdot ${x * x} \\cdot ${x + d} = ${value.toLatex()}$.`,
            `$V(x) = \\frac{1}{3}x^2(${linear(1, d)})$，所以 $V(${x}) = \\frac{1}{3} \\cdot ${x * x} \\cdot ${x + d} = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** compositeSolids finds volumes of solids made of simpler solids joined or removed. */
export const compositeSolids = topic(
  "composite-solids",
  t("Composite Solids", "组合体"),
  t(
    "Find the volume of a solid made by joining simpler solids or by removing one from another.",
    "求由简单立体拼接或挖去而成的组合体的体积。",
  ),
  ["volumes-of-spheres", "volumes-of-right-cones"],
  ["HSG.GMD.A.3", "7.G.B.6"],
  [
    kp(
      "joined-round-solids",
      t("Round solids joined together", "拼接的圆形立体"),
      t(
        "The volume of a solid made of pieces joined together is the sum of the volumes of the pieces. A cylinder topped by a hemisphere of the same radius has volume $\\pi r^2 h + \\frac{2}{3}\\pi r^3$; a cone on top adds $\\frac{1}{3}\\pi r^2 h$. Keep answers as multiples of $\\pi$.",
        "由几部分拼成的立体，体积等于各部分体积之和。顶部加一个同半径半球的圆柱，体积为 $\\pi r^2 h + \\frac{2}{3}\\pi r^3$；顶部加一个圆锥则加上 $\\frac{1}{3}\\pi r^2 h$。答案保留为 $\\pi$ 的倍数。",
      ),
      (rng) => {
        const r = rng.pick([3, 6, 9, 3, 6]);
        const h = rng.int(2, 12);
        const top = rng.pick(["hemisphere", "cone"] as const);
        const ht = rng.int(2, 12);
        const cyl = r * r * h;
        const extra = top === "hemisphere" ? Q.of(2 * r ** 3, 3) : Q.of(r * r * ht, 3);
        const value = extra.add(Q.of(cyl));
        return numberProblem({
          prompt: t(
            top === "hemisphere"
              ? `A silo is a cylinder of radius $${r}$ m and height $${h}$ m topped by a hemisphere of the same radius. Its volume is $k\\pi$ cubic meters. What is $k$?`
              : `A solid is a cylinder of radius $${r}$ cm and height $${h}$ cm with a cone of the same radius and height $${ht}$ cm on top. Its volume is $k\\pi$ cubic centimeters. What is $k$?`,
            top === "hemisphere"
              ? `一个筒仓由半径 $${r}$ m、高 $${h}$ m 的圆柱和顶部同半径的半球组成。它的体积为 $k\\pi$ 立方米。$k$ 是多少？`
              : `一个立体由半径 $${r}$ cm、高 $${h}$ cm 的圆柱和顶部同半径、高 $${ht}$ cm 的圆锥组成。它的体积为 $k\\pi$ 立方厘米。$k$ 是多少？`,
          ),
          answer: value,
          wrong:
            top === "hemisphere"
              ? [Q.of(cyl + (4 * r ** 3) / 3), Q.of(cyl), Q.of(cyl + r ** 3)]
              : [Q.of(cyl + r * r * ht), Q.of(cyl), Q.of(r * r * (h + ht), 3)],
          solution: t(
            `The cylinder has volume $\\pi \\cdot ${r}^2 \\cdot ${h} = ${cyl}\\pi$ and the ${top === "hemisphere" ? `hemisphere $\\frac{2}{3}\\pi \\cdot ${r}^3` : `cone $\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${ht}`} = ${extra.toLatex()}\\pi$, so $k = ${cyl} + ${extra.toLatex()} = ${value.toLatex()}$.`,
            `圆柱体积为 $\\pi \\cdot ${r}^2 \\cdot ${h} = ${cyl}\\pi$，${top === "hemisphere" ? `半球体积为 $\\frac{2}{3}\\pi \\cdot ${r}^3` : `圆锥体积为 $\\frac{1}{3}\\pi \\cdot ${r}^2 \\cdot ${ht}`} = ${extra.toLatex()}\\pi$，所以 $k = ${cyl} + ${extra.toLatex()} = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "solids-with-a-hole",
      t("Solids with a part removed", "挖去一部分的立体"),
      t(
        "When a hole is cut out of a solid, subtract the volume of the hole from the volume of the original solid. For a cube of side $s$ with a cylindrical hole of radius $r$ drilled straight through, the volume left is $s^3 - \\pi r^2 s$, because the hole is as long as the cube.",
        "从立体中挖去一个洞时，用原立体的体积减去洞的体积。一个棱长为 $s$ 的正方体被钻穿一个半径为 $r$ 的圆柱形孔，剩余体积为 $s^3 - \\pi r^2 s$，因为孔的长度与正方体的棱长相同。",
      ),
      (rng) => {
        const a = rng.int(4, 12);
        const b = rng.int(4, 12);
        const c = rng.int(4, 12);
        const s = rng.int(1, Math.min(a, b, c) - 1);
        const value = a * b * c - s ** 3;
        return numberProblem({
          prompt: t(
            `A wooden block is a rectangular prism measuring $${a}$ in by $${b}$ in by $${c}$ in. A cube with edges of $${s}$ in is cut out of one corner. What is the volume of the remaining wood, in cubic inches?`,
            `一块木块是 $${a}$ in 乘 $${b}$ in 乘 $${c}$ in 的长方体，从一角切去一个棱长 $${s}$ in 的正方体。剩下木块的体积是多少立方英寸？`,
          ),
          answer: value,
          wrong: [a * b * c - s * s, a * b * c, a * b * c - 3 * s, (a - s) * (b - s) * (c - s)],
          solution: t(
            `Subtract the cube from the prism: $${a} \\cdot ${b} \\cdot ${c} - ${s}^3 = ${a * b * c} - ${s ** 3} = ${value}$ cubic inches.`,
            `用长方体体积减去正方体体积：$${a} \\cdot ${b} \\cdot ${c} - ${s}^3 = ${a * b * c} - ${s ** 3} = ${value}$ 立方英寸。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Circles and trigonometry

/** radiusTriangleFigure shows two radii OA and OB with central angle θ and the chord AB, marking the equal radii and the equal base angles. */
const radiusTriangleFigure: Figure = (() => {
  const [a, b] = [on(200, 3), on(320, 3)];
  return {
    svg: sketch([
      circleAt(3),
      { kind: "polygon", points: [[0, 0], a, b] },
      { kind: "ticks", a: [0, 0], b: a, count: 1 },
      { kind: "ticks", a: [0, 0], b: b, count: 1 },
      { kind: "arc", vertex: [0, 0], from: a, to: b, label: "θ", accent: true },
      { kind: "arc", vertex: a, from: b, to: [0, 0] },
      { kind: "arc", vertex: b, from: [0, 0], to: a },
      { kind: "label", at: [0, 0], text: "O", dir: "n" },
      { kind: "label", at: a, text: "A", dir: "sw" },
      { kind: "label", at: b, text: "B", dir: "se" },
    ]),
    alt: t(
      "A circle with center O and points A and B on it. The radii OA and OB are marked equal and form a central angle θ; triangle OAB is isosceles, with equal base angles at A and B.",
      "以 O 为圆心的圆上有点 A、B。半径 OA 与 OB 标记为相等，夹圆心角 θ；△OAB 是等腰三角形，A、B 处的两个底角相等。",
    ),
  };
})();

/** chord120Figure shows a 120° central angle split by the perpendicular from the center into two 30-60-90 triangles. */
const chord120Figure: Figure = (() => {
  const [a, b] = [on(210, 3), on(330, 3)];
  const m: Point = [0, -1.5];
  return {
    svg: sketch([
      circleAt(3),
      { kind: "polygon", points: [[0, 0], a, b] },
      { kind: "segment", a: [0, 0], b: m, dashed: true },
      { kind: "right", vertex: m, from: b, to: [0, 0] },
      { kind: "arc", vertex: [0, 0], from: m, to: b, label: "60°", accent: true },
      { kind: "side", a: [0, 0], b: a, text: "r" },
      { kind: "label", at: [0, -0.75], text: "r/2", dir: "w" },
      { kind: "label", at: [1.3, -1.5], text: "r√3/2", dir: "s" },
      { kind: "label", at: [0, 0], text: "O", dir: "n" },
      { kind: "label", at: a, text: "A", dir: "sw" },
      { kind: "label", at: b, text: "B", dir: "se" },
    ]),
    alt: t(
      "A circle with center O and a chord AB whose central angle is 120°. The perpendicular from O to AB bisects the angle and the chord, making two 30-60-90 triangles with hypotenuse r, short leg r/2 and long leg r√3/2, so AB = r√3.",
      "以 O 为圆心的圆中，弦 AB 所对的圆心角为 120°。从 O 向 AB 作垂线，平分该角和弦，得到两个 30-60-90 三角形：斜边 r，短直角边 r/2，长直角边 r√3/2，所以 AB = r√3。",
    ),
  };
})();

/** isoscelesTrianglesInCircles uses the isosceles triangle formed by two radii and a chord. */
export const isoscelesTrianglesInCircles = topic(
  "isosceles-triangles-in-circles",
  t("Isosceles Triangles in Circles", "圆中的等腰三角形"),
  t(
    "Use the isosceles triangle formed by two radii and a chord to find angles and chord lengths.",
    "利用两条半径与一条弦构成的等腰三角形求角度和弦长。",
  ),
  ["central-angles-and-arcs", "thirty-sixty-ninety-triangles"],
  ["HSG.C.A.2"],
  [
    kp(
      "angles-of-a-radius-triangle",
      t("Angles of a triangle with two radii", "含两条半径的三角形的角"),
      t(
        "Two radii and the chord joining their ends form an isosceles triangle, because the radii are equal. Its base angles, at the chord, are equal, so each is $\\frac{180^\\circ - \\theta}{2}$, where $\\theta$ is the central angle between the radii.",
        "两条半径与连接其端点的弦构成等腰三角形，因为两条半径相等。它在弦上的两个底角相等，各为 $\\frac{180^\\circ - \\theta}{2}$，其中 $\\theta$ 是两条半径所夹的圆心角。",
      ),
      (rng) => {
        const theta = 2 * rng.int(10, 80);
        const back = rng.bool();
        const base = (180 - theta) / 2;
        return numberProblem({
          prompt: back
            ? t(
                `Points $A$ and $B$ lie on a circle with center $O$, and $\\angle OAB = ${base}^\\circ$. What is the measure of the central angle $\\angle AOB$?`,
                `点 $A$、$B$ 在以 $O$ 为圆心的圆上，$\\angle OAB = ${base}^\\circ$。圆心角 $\\angle AOB$ 的度数是多少？`,
              )
            : t(
                `Points $A$ and $B$ lie on a circle with center $O$, and the central angle $\\angle AOB = ${theta}^\\circ$. What is the measure of $\\angle OAB$?`,
                `点 $A$、$B$ 在以 $O$ 为圆心的圆上，圆心角 $\\angle AOB = ${theta}^\\circ$。$\\angle OAB$ 的度数是多少？`,
              ),
          answer: back ? theta : base,
          unit: "°",
          wrong: back ? [180 - base, 90 - base, 2 * base] : [180 - theta, theta / 2, 90 - theta],
          solution: t(
            `$OA = OB$ are radii, so $\\angle OAB = \\angle OBA$ and${back ? steps(`\\angle AOB = 180^\\circ - 2 \\cdot ${base}^\\circ = ${theta}^\\circ`) : steps(`\\angle OAB = \\frac{180^\\circ - ${theta}^\\circ}{2} = ${base}^\\circ`)}`,
            `$OA = OB$ 都是半径，所以 $\\angle OAB = \\angle OBA$，${back ? steps(`\\angle AOB = 180^\\circ - 2 \\cdot ${base}^\\circ = ${theta}^\\circ`) : steps(`\\angle OAB = \\frac{180^\\circ - ${theta}^\\circ}{2} = ${base}^\\circ`)}`,
          ),
        });
      },
      radiusTriangleFigure,
    ),
    kp(
      "chord-lengths-from-special-angles",
      t("Chord lengths from special central angles", "特殊圆心角所对的弦长"),
      t(
        "For special central angles the radius triangle has known shape. A $60^\\circ$ angle makes it equilateral, so the chord equals the radius; $90^\\circ$ makes an isosceles right triangle with chord $r\\sqrt{2}$; and $120^\\circ$ splits into two $30$-$60$-$90$ triangles, giving chord $r\\sqrt{3}$.",
        "对于特殊的圆心角，半径三角形的形状是已知的。$60^\\circ$ 时它是正三角形，弦长等于半径；$90^\\circ$ 时是等腰直角三角形，弦长为 $r\\sqrt{2}$；$120^\\circ$ 时可以分成两个 $30$-$60$-$90$ 三角形，弦长为 $r\\sqrt{3}$。",
      ),
      (rng) => {
        const r = rng.int(2, 15);
        const [theta, m] = rng.pick([
          [60, 1],
          [90, 2],
          [120, 3],
        ] as const);
        return radicalProblem({
          prompt: t(
            `A circle has radius $${r}$. Chord $AB$ subtends a central angle of $${theta}^\\circ$. What is the length of $AB$, in simplest radical form?`,
            `一个圆的半径为 $${r}$，弦 $AB$ 所对的圆心角为 $${theta}^\\circ$。$AB$ 的长是多少？用最简根式表示。`,
          ),
          answer: [r, m],
          wrong: [radical(r, m === 3 ? 2 : 3), String(2 * r), radical(r, m === 1 ? 2 : 1), radical(Q.of(r, 2), m === 1 ? 3 : m)],
          solution: t(
            theta === 60
              ? `The triangle with sides $${r}$, $${r}$ and $AB$ has all angles $60^\\circ$, so it is equilateral and $AB = ${r}$.`
              : theta === 90
                ? `The triangle is an isosceles right triangle with legs $${r}$, so $AB = ${radical(r, 2)}$.`
                : `The height from $O$ splits the triangle into two $30$-$60$-$90$ triangles with hypotenuse $${r}$, so half the chord is $\\frac{${r}\\sqrt{3}}{2}$ and $AB = ${radical(r, 3)}$.`,
            theta === 60
              ? `边长为 $${r}$、$${r}$ 和 $AB$ 的三角形三个角都是 $60^\\circ$，所以它是正三角形，$AB = ${r}$。`
              : theta === 90
                ? `这个三角形是直角边为 $${r}$ 的等腰直角三角形，所以 $AB = ${radical(r, 2)}$。`
                : `从 $O$ 作高，把三角形分成两个斜边为 $${r}$ 的 $30$-$60$-$90$ 三角形，所以弦长的一半为 $\\frac{${r}\\sqrt{3}}{2}$，$AB = ${radical(r, 3)}$。`,
          ),
        });
      },
      chord120Figure,
    ),
  ],
);

/** transformingCircles finds the equations of circles after translations and dilations. */
export const transformingCircles = topic(
  "transforming-circles",
  t("Transforming Circles", "圆的变换"),
  t(
    "Find the center and radius of a circle in the coordinate plane after it is translated or dilated.",
    "求坐标平面内的圆经过平移或伸缩后的圆心和半径。",
  ),
  ["equations-of-circles", "translations-of-geometric-figures"],
  ["HSG.GPE.A.1", "HSG.C.A.1"],
  [
    kp(
      "translating-a-circle",
      t("Translating a circle", "平移圆"),
      t(
        "Translating a circle moves its center and keeps its radius. The circle $(x - h)^2 + (y - k)^2 = r^2$ has center $(h, k)$; moving it $a$ units right and $b$ units up puts the center at $(h + a, k + b)$, so the new equation is $(x - h - a)^2 + (y - k - b)^2 = r^2$.",
        "平移圆会移动圆心而不改变半径。圆 $(x - h)^2 + (y - k)^2 = r^2$ 的圆心为 $(h, k)$；向右平移 $a$ 个单位、向上平移 $b$ 个单位后圆心为 $(h + a, k + b)$，新方程为 $(x - h - a)^2 + (y - k - b)^2 = r^2$。",
      ),
      (rng) => {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const r2 = rng.pick([4, 9, 16, 25, 5, 10, 13]);
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const ask = rng.pick(["x", "y"] as const);
        const value = ask === "x" ? h + a : k + b;
        const eq = `(${linear(1, -h)})^2 + (${linear(1, -k, "y")})^2 = ${r2}`;
        return numberProblem({
          prompt: t(
            `The circle $${eq}$ is moved $${Math.abs(a)}$ ${Math.abs(a) === 1 ? "unit" : "units"} ${a > 0 ? "right" : "left"} and $${Math.abs(b)}$ ${Math.abs(b) === 1 ? "unit" : "units"} ${b > 0 ? "up" : "down"}. What is the ${ask}-coordinate of the center of the new circle?`,
            `把圆 $${eq}$ 向${a > 0 ? "右" : "左"}平移 $${Math.abs(a)}$ 个单位、向${b > 0 ? "上" : "下"}平移 $${Math.abs(b)}$ 个单位。新圆圆心的 ${ask} 坐标是多少？`,
          ),
          answer: value,
          wrong: ask === "x" ? [h - a, -h + a, h + b] : [k - b, -k + b, k + a],
          solution: t(
            `The original center is $(${h}, ${k})$. The translation moves it to $(${h} + ${a < 0 ? `(${a})` : a}, ${k} + ${b < 0 ? `(${b})` : b}) = (${h + a}, ${k + b})$, so the ${ask}-coordinate is $${value}$.`,
            `原圆心为 $(${h}, ${k})$。平移后变为 $(${h} + ${a < 0 ? `(${a})` : a}, ${k} + ${b < 0 ? `(${b})` : b}) = (${h + a}, ${k + b})$，所以 ${ask} 坐标是 $${value}$。`,
          ),
        });
      },
    ),
    kp(
      "dilating-a-circle",
      t("Dilating a circle about its center", "以圆心为中心伸缩圆"),
      t(
        "A dilation about the center by a factor $k$ keeps the center and multiplies the radius by $k$. In the equation the right side is the radius squared, so it is multiplied by $k^2$: $(x - h)^2 + (y - k)^2 = r^2$ becomes $(x - h)^2 + (y - k)^2 = k^2 r^2$.",
        "以圆心为中心、比例为 $k$ 的伸缩保持圆心不变，把半径乘以 $k$。方程右边是半径的平方，所以要乘以 $k^2$：$(x - h)^2 + (y - k)^2 = r^2$ 变为 $(x - h)^2 + (y - k)^2 = k^2 r^2$。",
      ),
      (rng) => {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const r2 = rng.pick([1, 4, 9, 2, 3, 5, 7]);
        const f = rng.pick([2, 3, 4, 5]);
        const value = r2 * f * f;
        const lhs = `(${linear(1, -h)})^2 + (${linear(1, -k, "y")})^2`;
        return numberProblem({
          prompt: t(
            `The circle $${lhs} = ${r2}$ is dilated about its center by a scale factor of $${f}$. The new circle has equation $${lhs} = c$. What is $c$?`,
            `以圆心为中心，把圆 $${lhs} = ${r2}$ 按比例 $${f}$ 放大，新圆的方程为 $${lhs} = c$。$c$ 是多少？`,
          ),
          answer: value,
          wrong: [r2 * f, r2 + f, f * f],
          solution: t(
            `The radius $\\sqrt{${r2}}$ is multiplied by $${f}$, so its square is multiplied by $${f}^2 = ${f * f}$: $c = ${r2} \\cdot ${f * f} = ${value}$.`,
            `半径 $\\sqrt{${r2}}$ 乘以 $${f}$，所以它的平方乘以 $${f}^2 = ${f * f}$：$c = ${r2} \\cdot ${f * f} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** calculatingTrigonometricRatiosFromDescriptions finds trigonometric ratios in right triangles described in words. */
export const calculatingTrigonometricRatiosFromDescriptions = topic(
  "calculating-trigonometric-ratios-from-descriptions",
  t("Calculating Trigonometric Ratios From Descriptions", "由描述计算三角比"),
  t(
    "Find sines, cosines and tangents in right triangles described in words, including from the ratios of the complementary angle.",
    "在文字描述的直角三角形中求正弦、余弦、正切，包括利用余角的三角比。",
  ),
  ["trigonometric-functions-of-complementary-angles"],
  ["HSG.SRT.C.6", "HSG.SRT.C.7"],
  [
    kp(
      "ratios-from-named-sides",
      t("Ratios from named sides", "由指明的边求三角比"),
      t(
        "Without a picture, first decide which side is the hypotenuse: it is opposite the right angle, so in a triangle with the right angle at $C$ it is $AB$. Then for angle $A$, the opposite side is $BC$ and the adjacent side is $AC$; find any missing side with the Pythagorean theorem and form the ratio.",
        "没有图时，先确定哪条边是斜边：它是直角所对的边，所以直角在 $C$ 的三角形中斜边是 $AB$。对于角 $A$，对边是 $BC$，邻边是 $AC$；用勾股定理求出缺少的边，再写出比值。",
      ),
      (rng) => {
        const [p, q, r] = rng.pick(triples);
        const flip = rng.bool();
        const [bc, ac] = flip ? [p, q] : [q, p];
        const known = rng.pick(["BC", "AC"] as const);
        const fn = rng.pick(["\\sin", "\\cos", "\\tan"] as const);
        const value = fn === "\\sin" ? Q.of(bc, r) : fn === "\\cos" ? Q.of(ac, r) : Q.of(bc, ac);
        return numberProblem({
          prompt: t(
            `In triangle $ABC$, $\\angle C = 90^\\circ$, $AB = ${r}$ and $${known} = ${known === "BC" ? bc : ac}$. What is $${fn} A$?`,
            `在 $\\triangle ABC$ 中，$\\angle C = 90^\\circ$，$AB = ${r}$，$${known} = ${known === "BC" ? bc : ac}$。$${fn} A$ 是多少？`,
          ),
          answer: value,
          wrong:
            fn === "\\sin"
              ? [Q.of(ac, r), Q.of(r, bc), Q.of(bc, ac)]
              : fn === "\\cos"
                ? [Q.of(bc, r), Q.of(r, ac), Q.of(ac, bc)]
                : [Q.of(ac, bc), Q.of(bc, r), Q.of(ac, r)],
          solution: t(
            `$AB$ is the hypotenuse, and $${known === "BC" ? `AC = \\sqrt{${r}^2 - ${bc}^2} = ${ac}` : `BC = \\sqrt{${r}^2 - ${ac}^2} = ${bc}`}$. For angle $A$, the opposite side is $BC = ${bc}$ and the adjacent side is $AC = ${ac}$, so $${fn} A = ${value.toLatex()}$.`,
            `$AB$ 是斜边，且 $${known === "BC" ? `AC = \\sqrt{${r}^2 - ${bc}^2} = ${ac}` : `BC = \\sqrt{${r}^2 - ${ac}^2} = ${bc}`}$。对于角 $A$，对边为 $BC = ${bc}$，邻边为 $AC = ${ac}$，所以 $${fn} A = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "ratios-of-the-other-acute-angle",
      t("Ratios of the other acute angle", "另一个锐角的三角比"),
      t(
        "The two acute angles of a right triangle are complementary, and the side opposite one is adjacent to the other. So $\\sin A = \\cos B$ and $\\cos A = \\sin B$, while $\\tan B = \\frac{1}{\\tan A}$. A ratio given for one angle therefore gives the ratios of the other directly.",
        "直角三角形的两个锐角互余，一个角的对边就是另一个角的邻边。所以 $\\sin A = \\cos B$，$\\cos A = \\sin B$，而 $\\tan B = \\frac{1}{\\tan A}$。因此已知一个角的三角比，就能直接得到另一个角的三角比。",
      ),
      (rng) => {
        const [p, q, r] = rng.pick(triples);
        const flip = rng.bool();
        const [opp, adj] = flip ? [p, q] : [q, p];
        const given = rng.pick(["\\sin", "\\cos"] as const);
        const ask = rng.pick(["\\sin", "\\cos", "\\tan"] as const);
        const givenValue = given === "\\sin" ? Q.of(opp, r) : Q.of(adj, r);
        // B: opposite is adj, adjacent is opp
        const value = ask === "\\sin" ? Q.of(adj, r) : ask === "\\cos" ? Q.of(opp, r) : Q.of(adj, opp);
        return numberProblem({
          prompt: t(
            `In right triangle $ABC$ with $\\angle C = 90^\\circ$, $${given} A = ${givenValue.toLatex()}$. What is $${ask} B$?`,
            `在直角三角形 $ABC$ 中，$\\angle C = 90^\\circ$，$${given} A = ${givenValue.toLatex()}$。$${ask} B$ 是多少？`,
          ),
          answer: value,
          wrong: [
            ask === "\\sin" ? Q.of(opp, r) : ask === "\\cos" ? Q.of(adj, r) : Q.of(opp, adj),
            Q.of(r, adj),
            givenValue.eq(value) ? Q.of(adj, opp) : givenValue,
          ],
          solution: t(
            `Scale the triangle so that $AB = ${r}$, $BC = ${opp}$ and $AC = ${adj}$, which matches $${given} A = ${givenValue.toLatex()}$. For angle $B$, the opposite side is $AC = ${adj}$ and the adjacent side is $BC = ${opp}$, so $${ask} B = ${value.toLatex()}$.`,
            `取 $AB = ${r}$，$BC = ${opp}$，$AC = ${adj}$，这与 $${given} A = ${givenValue.toLatex()}$ 相符。对于角 $B$，对边为 $AC = ${adj}$，邻边为 $BC = ${opp}$，所以 $${ask} B = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** satFundamentalsGeometryTopics are the geometry topics written for SAT Math Fundamentals. */
export const satFundamentalsGeometryTopics: readonly TopicDef[] = [
  solvingGeometryProblemsByManipulatingRadicals,
  solvingProblemsDescribingCongruentTriangles,
  reasoningAboutCongruentTriangles,
  workingWithDescriptionsOfSimilarShapes,
  solvingAngleProblemsFromDescriptionsOfSimilarTriangles,
  reasoningAboutSimilarTriangles,
  solvingParallelLineProblemsFromDescriptions,
  workingWithDescriptionsOfSimilarSolids,
  borderProblems,
  constructingFunctionsRepresentingPropertiesOf2dShapes,
  equilateralTrianglesInscribedInCircles,
  circlesInscribedInEquilateralTriangles,
  areasOfInscribedTriangles,
  constructingFunctionsRepresentingPropertiesOfRectangularSolids,
  constructingFunctionsRepresentingVolumesOfCylindersConesAndPyramids,
  compositeSolids,
  isoscelesTrianglesInCircles,
  transformingCircles,
  calculatingTrigonometricRatiosFromDescriptions,
];
