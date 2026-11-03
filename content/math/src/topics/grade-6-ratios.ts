import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q, svgDocument } from "@ga/subject-math";

import { choiceProblem, mixedLatex, numberProblem, yesNo } from "../problems.ts";
import { compareProblem, fr, mathText, pickChoice } from "./grade-4-fractions.ts";

// 6th Grade Math: ratios, ratio tables and tape diagrams, unit rates, percentages, and unit conversions by long division.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** gcd is the greatest common divisor of two positive whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** coprimePair draws two different whole numbers in [lo, hi] with no common factor. */
function coprimePair(rng: Rng, lo: number, hi: number): [number, number] {
  for (;;) {
    const a = rng.int(lo, hi);
    const b = rng.int(lo, hi);
    if (a !== b && gcd(a, b) === 1) return [a, b];
  }
}

/** ratio writes a ratio in LaTeX: "3 : 4". */
const ratio = (...terms: readonly (number | string)[]) => terms.join(" : ");

/** Things is a pair of kinds of things counted in a ratio, in both languages. */
interface Things {
  readonly a: Text;
  readonly b: Text;
}

const things: readonly Things[] = [
  { a: t("red marbles", "红色弹珠"), b: t("blue marbles", "蓝色弹珠") },
  { a: t("green marbles", "绿色弹珠"), b: t("yellow marbles", "黄色弹珠") },
  { a: t("stickers", "贴纸"), b: t("stamps", "邮票") },
  { a: t("apples", "苹果"), b: t("oranges", "橙子") },
  { a: t("pencils", "铅笔"), b: t("pens", "钢笔") },
  { a: t("roses", "玫瑰"), b: t("tulips", "郁金香") },
];

/** Mix is a recipe of two ingredients mixed in a ratio. */
interface Mix {
  readonly a: Text;
  readonly b: Text;
  readonly unit: Text;
}

const mixes: readonly Mix[] = [
  { a: t("juice", "果汁"), b: t("water", "水"), unit: t("cups", "杯") },
  { a: t("red paint", "红色颜料"), b: t("white paint", "白色颜料"), unit: t("cans", "罐") },
  { a: t("flour", "面粉"), b: t("sugar", "糖"), unit: t("cups", "杯") },
  { a: t("cement", "水泥"), b: t("sand", "沙子"), unit: t("buckets", "桶") },
];

/** tableLatex writes a two-row table with a label in front of each row. */
function tableLatex(labels: readonly [string, string], top: readonly string[], bottom: readonly string[]): string {
  const cols = "c".repeat(top.length);
  return `\\begin{array}{|l|${cols.split("").join("|")}|}\\hline \\text{${labels[0]}} & ${top.join(" & ")} \\\\ \\hline \\text{${labels[1]}} & ${bottom.join(" & ")} \\\\ \\hline\\end{array}`;
}

// ---------------------------------------------------------------------------
// Ratios

export const equivalentRatios = topic(
  "equivalent-ratios",
  t("Equivalent Ratios", "等比"),
  t(
    "Two ratios are equivalent when one is found by multiplying or dividing both terms of the other by the same nonzero number. 2 : 3, 4 : 6 and 10 : 15 are all equivalent.",
    "把一个比的前项和后项同时乘或除以同一个不为 0 的数，得到的比与原来的比相等（等比）。2 : 3、4 : 6 与 10 : 15 都相等。",
  ),
  ["ratios"],
  ["6.RP.A.1", "6.RP.A.3"],
  [
    {
      id: "scaling-a-ratio",
      title: t("Finding a missing term", "求缺少的项"),
      explanation: t(
        "Equivalent ratios are made by multiplying or dividing both terms by the same number. To find a missing term, see what one term was multiplied by, and do the same to the other. Adding the same number to both terms does not give an equivalent ratio.\n\nIn $2 : 3 = 8 : \\square$, the first term was multiplied by $4$, so the second must be too: $3 \\times 4 = 12$.",
        "比的前项和后项同时乘或除以同一个数，得到的比与原来相等。求未知项时，先看已知的一项乘了几，另一项也乘几。前后项同时加上同一个数，得到的比并不相等。\n\n在 $2 : 3 = 8 : \\square$ 中，前项乘了 $4$，后项也要乘 $4$：$3 \\times 4 = 12$。",
      ),
      generate(rng) {
        const [a, b] = coprimePair(rng, 1, 9);
        const k = rng.int(2, 9);
        const askSecond = rng.bool();
        const shown = askSecond ? ratio(a * k, "\\square") : ratio("\\square", b * k);
        const answer = askSecond ? b * k : a * k;
        return numberProblem({
          prompt: t(
            `Find the missing number that makes the ratios equivalent. $$${ratio(a, b)} = ${shown}$$`,
            `求使两个比相等的缺少的数。$$${ratio(a, b)} = ${shown}$$`,
          ),
          answer,
          form: "integer",
          wrong: askSecond ? [b + (a * k - a), a * k, b * (k + 1)] : [a + (b * k - b), b * k, a * (k + 1)],
          solution: t(
            `The ${askSecond ? "first" : "second"} term was multiplied by $${k}$, so multiply the other term by $${k}$ too: $${askSecond ? b : a} \\times ${k} = ${answer}$.`,
            `${askSecond ? "前" : "后"}项乘了 $${k}$，所以另一项也乘 $${k}$：$${askSecond ? b : a} \\times ${k} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "checking-equivalent-ratios",
      title: t("Checking whether ratios are equivalent", "判断两个比是否相等"),
      explanation: t(
        "$3 : 5$ and $12 : 20$ are equivalent because both terms were multiplied by $4$. $3 : 5$ and $5 : 7$ are not: adding the same number to both terms does not keep a ratio.",
        "$3 : 5$ 与 $12 : 20$ 相等，因为两项都乘了 $4$。$3 : 5$ 与 $5 : 7$ 不相等：两项加上同一个数，比会改变。",
      ),
      generate(rng) {
        const [a, b] = coprimePair(rng, 1, 9);
        const k = rng.int(2, 8);
        const kind = rng.int(0, 2);
        const [c, d] = kind === 0 ? [a * k, b * k] : kind === 1 ? [a + k, b + k] : [a * k, b * k + rng.pick([-1, 1])];
        const equal = kind === 0;
        return choiceProblem({
          prompt: t(
            `Are the ratios $${ratio(a, b)}$ and $${ratio(c, d)}$ equivalent?`,
            `$${ratio(a, b)}$ 与 $${ratio(c, d)}$ 这两个比相等吗？`,
          ),
          options: yesNo,
          correct: equal ? 0 : 1,
          solution: equal
            ? t(
                `Both terms were multiplied by $${k}$: $${a} \\times ${k} = ${c}$ and $${b} \\times ${k} = ${d}$. So they are equivalent.`,
                `两项都乘了 $${k}$：$${a} \\times ${k} = ${c}$，$${b} \\times ${k} = ${d}$。所以它们相等。`,
              )
            : t(
                `$${c} \\div ${a} = ${mixedLatex(Q.of(c, a))}$ but $${d} \\div ${b} = ${mixedLatex(Q.of(d, b))}$. The terms were not multiplied by the same number, so the ratios are not equivalent.`,
                `$${c} \\div ${a} = ${mixedLatex(Q.of(c, a))}$，而 $${d} \\div ${b} = ${mixedLatex(Q.of(d, b))}$。两项乘的不是同一个数，所以两个比不相等。`,
              ),
        });
      },
    },
  ],
);

export const writingRatiosUsingFractions = topic(
  "writing-ratios-using-fractions",
  t("Writing Ratios Using Fractions", "用分数表示比"),
  t(
    "The ratio a : b can be written as the fraction a/b and simplified like any fraction: 6 : 8 = 6/8 = 3/4. A part-to-whole ratio compares one part with the total.",
    "比 a : b 可以写成分数 a/b，并像分数一样化简：6 : 8 = 6/8 = 3/4。部分与整体的比是把一部分与总数相比。",
  ),
  ["equivalent-ratios", "writing-fractions-in-lowest-terms"],
  ["6.RP.A.1"],
  [
    {
      id: "part-to-part-as-a-fraction",
      title: t("Part to part", "部分与部分"),
      explanation: t(
        "A ratio $a : b$ can be written as the fraction $\\frac{a}{b}$, with the first quantity named on top. Then simplify it like any fraction. The order matters: the ratio of cats to dogs puts cats on top.\n\nWith $6$ cats and $9$ dogs, the ratio of cats to dogs is $6 : 9 = \\frac{6}{9} = \\frac{2}{3}$.",
        "比 $a : b$ 可以写成分数 $\\frac{a}{b}$，先说到的量作分子，然后像分数一样约分。顺序很重要：猫与狗的比，猫的数量作分子。\n\n有 $6$ 只猫和 $9$ 只狗，猫与狗的比是 $6 : 9 = \\frac{6}{9} = \\frac{2}{3}$。",
      ),
      generate(rng) {
        const th = rng.pick(things);
        const [p, q] = coprimePair(rng, 1, 9);
        const k = rng.int(2, 6);
        const [a, b] = [p * k, q * k];
        return numberProblem({
          prompt: t(
            `A box has ${a} ${th.a.en} and ${b} ${th.b.en}. Write the ratio of ${th.a.en} to ${th.b.en} as a fraction in simplest form.`,
            `盒子里有 ${a} 个${th.a["zh-CN"]}和 ${b} 个${th.b["zh-CN"]}。把${th.a["zh-CN"]}与${th.b["zh-CN"]}的比写成最简分数。`,
          ),
          answer: Q.of(p, q),
          form: "fraction",
          wrong: [Q.of(q, p), Q.of(p, p + q), Q.of(a, a + b)],
          solution: t(
            `$${ratio(a, b)} = ${fr(a, b)} = ${fr(p, q)}$, dividing both terms by $${k}$.`,
            `$${ratio(a, b)} = ${fr(a, b)} = ${fr(p, q)}$（两项都除以 $${k}$）。`,
          ),
        });
      },
    },
    {
      id: "part-to-whole-as-a-fraction",
      title: t("Part to whole", "部分与整体"),
      explanation: t(
        "With $6$ cats and $9$ dogs there are $15$ animals, so the ratio of cats to all the animals is $\\frac{6}{15} = \\frac{2}{5}$.",
        "有 $6$ 只猫和 $9$ 只狗，共 $15$ 只动物，所以猫与动物总数的比是 $\\frac{6}{15} = \\frac{2}{5}$。",
      ),
      generate(rng) {
        const th = rng.pick(things);
        const [p, q] = coprimePair(rng, 1, 8);
        const k = rng.int(2, 5);
        const [a, b] = [p * k, q * k];
        const total = a + b;
        const g = gcd(a, total);
        return numberProblem({
          prompt: t(
            `A box has ${a} ${th.a.en} and ${b} ${th.b.en}. Write the ratio of ${th.a.en} to all the items in the box as a fraction in simplest form.`,
            `盒子里有 ${a} 个${th.a["zh-CN"]}和 ${b} 个${th.b["zh-CN"]}。把${th.a["zh-CN"]}与盒子里物品总数的比写成最简分数。`,
          ),
          answer: Q.of(a, total),
          form: "fraction",
          wrong: [Q.of(a, b), Q.of(b, total), Q.of(total, a)],
          solution: t(
            `There are $${a} + ${b} = ${total}$ items, so the ratio is $${fr(a, total)} = ${fr(a / g, total / g)}$.`,
            `共有 $${a} + ${b} = ${total}$ 个物品，所以比是 $${fr(a, total)} = ${fr(a / g, total / g)}$。`,
          ),
        });
      },
    },
  ],
);

export const comparingRatios = topic(
  "comparing-ratios",
  t("Comparing Ratios", "比较比的大小"),
  t(
    "To compare a : b with c : d, compare the fractions a/b and c/d, for example by rewriting them with a common denominator. A juice mix of 2 : 3 is stronger than 3 : 5 because 2/3 = 10/15 > 9/15 = 3/5.",
    "比较 a : b 与 c : d，就是比较分数 a/b 与 c/d，例如先通分。果汁与水按 2 : 3 调的比按 3 : 5 调的更浓，因为 2/3 = 10/15 > 9/15 = 3/5。",
  ),
  ["writing-ratios-using-fractions", "comparing-fractions"],
  ["6.RP.A.3"],
  [
    {
      id: "comparing-ratios-as-fractions",
      title: t("Comparing as fractions", "化成分数比较"),
      explanation: t(
        "To compare two ratios, write each as a fraction and compare the fractions, for example by giving them a common denominator.\n\n$3 : 4$ and $5 : 7$: $\\frac{3}{4} = \\frac{21}{28}$ and $\\frac{5}{7} = \\frac{20}{28}$. Since $21 > 20$, $3 : 4 > 5 : 7$.",
        "比较两个比的大小时，把它们都写成分数，再比较分数，比如先通分。\n\n$3 : 4$ 与 $5 : 7$：$\\frac{3}{4} = \\frac{21}{28}$，$\\frac{5}{7} = \\frac{20}{28}$。因为 $21 > 20$，所以 $3 : 4 > 5 : 7$。",
      ),
      generate(rng) {
        let a: number, b: number, c: number, d: number;
        do {
          [a, b] = coprimePair(rng, 1, 9);
          [c, d] = coprimePair(rng, 1, 9);
        } while (a * d === b * c || b === d || b === 1 || d === 1);
        const rel = Math.sign(a * d - b * c) + 1;
        const sym = ["<", "=", ">"][rel]!;
        return compareProblem(
          `${a} : ${b}`,
          `${c} : ${d}`,
          rel,
          t(
            `Write both as fractions with denominator $${b * d}$: $${fr(a, b)} = ${fr(a * d, b * d)}$ and $${fr(c, d)} = ${fr(c * b, b * d)}$. So $${ratio(a, b)} ${sym} ${ratio(c, d)}$.`,
            `化成分母为 $${b * d}$ 的分数：$${fr(a, b)} = ${fr(a * d, b * d)}$，$${fr(c, d)} = ${fr(c * b, b * d)}$。所以 $${ratio(a, b)} ${sym} ${ratio(c, d)}$。`,
          ),
        );
      },
    },
    {
      id: "comparing-mixtures",
      title: t("Which mixture is stronger?", "哪种混合更浓？"),
      explanation: t(
        "Mix A uses $2$ cups of juice for $3$ cups of water, mix B $3$ cups of juice for $5$ cups of water. Compare juice to water: $\\frac{2}{3} > \\frac{3}{5}$, so mix A tastes more of juice.",
        "A 种用 $2$ 杯果汁配 $3$ 杯水，B 种用 $3$ 杯果汁配 $5$ 杯水。比较果汁与水的比：$\\frac{2}{3} > \\frac{3}{5}$，所以 A 种果汁味更浓。",
      ),
      generate(rng) {
        const mix = rng.pick(mixes);
        let a: number, b: number, c: number, d: number;
        do {
          [a, b] = coprimePair(rng, 2, 9);
          [c, d] = coprimePair(rng, 2, 9);
        } while (b === d || a === c);
        const equal = a * d === b * c;
        const correct = equal ? 2 : a * d > b * c ? 0 : 1;
        const sym = equal ? "=" : a * d > b * c ? ">" : "<";
        return choiceProblem({
          prompt: t(
            `Mix A uses ${a} ${mix.unit.en} of ${mix.a.en} for every ${b} ${mix.unit.en} of ${mix.b.en}. Mix B uses ${c} ${mix.unit.en} of ${mix.a.en} for every ${d} ${mix.unit.en} of ${mix.b.en}. Which mix has the greater ratio of ${mix.a.en} to ${mix.b.en}?`,
            `A 种混合物每 ${b} ${mix.unit["zh-CN"]}${mix.b["zh-CN"]}配 ${a} ${mix.unit["zh-CN"]}${mix.a["zh-CN"]}，B 种每 ${d} ${mix.unit["zh-CN"]}${mix.b["zh-CN"]}配 ${c} ${mix.unit["zh-CN"]}${mix.a["zh-CN"]}。哪种混合物中${mix.a["zh-CN"]}与${mix.b["zh-CN"]}的比更大？`,
          ),
          options: [t("Mix A", "A 种"), t("Mix B", "B 种"), t("They are the same", "一样大")],
          correct,
          solution: t(
            `Compare $${fr(a, b)} = ${fr(a * d, b * d)}$ with $${fr(c, d)} = ${fr(c * b, b * d)}$: $${fr(a, b)} ${sym} ${fr(c, d)}$.`,
            `比较 $${fr(a, b)} = ${fr(a * d, b * d)}$ 与 $${fr(c, d)} = ${fr(c * b, b * d)}$：$${fr(a, b)} ${sym} ${fr(c, d)}$。`,
          ),
        });
      },
    },
  ],
);

export const approximatingRatios = topic(
  "approximating-ratios",
  t("Approximating Ratios", "估计比"),
  t(
    "When the numbers in a ratio are awkward, round them to nearby numbers that share a factor. 31 : 46 is close to 30 : 45 = 2 : 3.",
    "当比中的数不好算时，把它们取成相近的、有公因数的数。31 : 46 接近 30 : 45 = 2 : 3。",
  ),
  ["equivalent-ratios", "rounding-up-whole-numbers"],
  ["6.RP.A.3"],
  [
    {
      id: "nearest-simple-ratio",
      title: t("The nearest simple ratio", "最接近的简单比"),
      explanation: t(
        "To approximate a ratio, round both terms to nearby numbers that share a large common factor, then simplify. The rounded ratio should be close in value to the original.\n\n$41 : 59$ is close to $40 : 60$, and dividing both by $20$ gives $2 : 3$.",
        "求一个比的近似比时，把前后项都取成相近的、有较大公因数的数，再化简。近似的比应该和原来的比大小接近。\n\n$41 : 59$ 接近 $40 : 60$，前后项都除以 $20$，得 $2 : 3$。",
      ),
      generate(rng) {
        const [p, q] = coprimePair(rng, 1, 5);
        const k = rng.pick([10, 20, 25, 50]);
        const [a, b] = [p * k + rng.pick([-2, -1, 1, 2]), q * k + rng.pick([-2, -1, 1, 2])];
        const wrong: Text[] = [mathText(ratio(q, p)), mathText(ratio(p + 1, q)), mathText(ratio(p, q + 1)), mathText(ratio(p + 1, q + 1))];
        return pickChoice(
          rng,
          t(`Which simple ratio is closest to $${ratio(a, b)}$?`, `哪个简单的比最接近 $${ratio(a, b)}$？`),
          mathText(ratio(p, q)),
          wrong.filter((w) => {
            const m = w.en.match(/(\d+) : (\d+)/);
            return m && Number(m[1]) * q !== Number(m[2]) * p;
          }),
          t(
            `Round to $${ratio(p * k, q * k)}$, and divide both terms by $${k}$: $${ratio(p, q)}$.`,
            `取近似值 $${ratio(p * k, q * k)}$，两项都除以 $${k}$：$${ratio(p, q)}$。`,
          ),
        );
      },
    },
    {
      id: "estimating-with-an-approximate-ratio",
      title: t("Estimating with an approximate ratio", "用近似的比估算"),
      explanation: t(
        "In a town, $198$ of $602$ people ride bikes: about $200 : 600 = 1 : 3$. So in a group of $90$ people, about $30$ would ride bikes.",
        "某镇 $602$ 人中有 $198$ 人骑车：约为 $200 : 600 = 1 : 3$。所以 $90$ 人中大约有 $30$ 人骑车。",
      ),
      generate(rng) {
        const [p, q] = coprimePair(rng, 1, 5);
        const [pp, qq] = p < q ? [p, q] : [q, p];
        const k = rng.pick([100, 200]);
        const a = pp * k + rng.int(-4, 4);
        const total = qq * k + rng.int(-4, 4);
        const group = qq * rng.int(30, 150);
        const answer = (group / qq) * pp;
        return numberProblem({
          prompt: t(
            `In a survey, ${a} of ${total} students said they like chess. About how many students in a school of ${group} would you expect to like chess?`,
            `一项调查中，${total} 名学生里有 ${a} 名说喜欢国际象棋。在一所有 ${group} 名学生的学校里，估计大约有多少名学生喜欢国际象棋？`,
          ),
          answer,
          form: "integer",
          wrong: [group - answer, answer + qq, answer * 2],
          solution: t(
            `$${a} : ${total}$ is about $${ratio(pp * k, qq * k)} = ${ratio(pp, qq)}$. Then $${group} \\div ${qq} = ${group / qq}$ and $${group / qq} \\times ${pp} = ${answer}$.`,
            `$${a} : ${total}$ 约为 $${ratio(pp * k, qq * k)} = ${ratio(pp, qq)}$。$${group} \\div ${qq} = ${group / qq}$，$${group / qq} \\times ${pp} = ${answer}$。`,
          ),
        });
      },
    },
  ],
);

export const reasoningWithEquivalentRatios = topic(
  "reasoning-with-equivalent-ratios",
  t("Reasoning With Equivalent Ratios", "用等比推理"),
  t(
    "If boys and girls are in the ratio 3 : 4 and there are 12 boys, the ratio was scaled by 4, so there are 16 girls. If instead there are 28 students in all, each of the 7 equal parts is 4 students.",
    "如果男生与女生的比是 3 : 4，有 12 名男生，那么比扩大了 4 倍，女生有 16 名。如果一共有 28 名学生，那么 7 份中的每一份是 4 名学生。",
  ),
  ["equivalent-ratios"],
  ["6.RP.A.3"],
  [
    {
      id: "scaling-from-one-quantity",
      title: t("Finding one quantity from the other", "由一个量求另一个量"),
      explanation: t(
        "When one quantity is known, find what its ratio term was multiplied by, then multiply the other term by the same number.\n\nThe ratio of boys to girls is $3 : 4$ and there are $12$ boys. Since $12 = 3 \\times 4$, the ratio was scaled by $4$, so there are $4 \\times 4 = 16$ girls.",
        "已知其中一个量时，先求出它对应的比的项乘了几，再把另一项也乘这个数。\n\n男生与女生的比是 $3 : 4$，男生有 $12$ 名。因为 $12 = 3 \\times 4$，比扩大了 $4$ 倍，所以女生有 $4 \\times 4 = 16$ 名。",
      ),
      generate(rng) {
        const th = rng.pick(things);
        const [a, b] = coprimePair(rng, 1, 9);
        const k = rng.int(2, 12);
        return numberProblem({
          prompt: t(
            `The ratio of ${th.a.en} to ${th.b.en} in a collection is $${ratio(a, b)}$. There are ${a * k} ${th.a.en}. How many ${th.b.en} are there?`,
            `一组物品中${th.a["zh-CN"]}与${th.b["zh-CN"]}的比是 $${ratio(a, b)}$。有 ${a * k} 个${th.a["zh-CN"]}，有多少个${th.b["zh-CN"]}？`,
          ),
          answer: b * k,
          form: "integer",
          wrong: [a * k + (b - a), a * k * b, b * (k + 1)],
          solution: t(
            `$${a * k} \\div ${a} = ${k}$, so the ratio was multiplied by $${k}$: $${b} \\times ${k} = ${b * k}$.`,
            `$${a * k} \\div ${a} = ${k}$，比扩大了 $${k}$ 倍：$${b} \\times ${k} = ${b * k}$。`,
          ),
        });
      },
    },
    {
      id: "scaling-from-the-total",
      title: t("Finding a part from the total", "由总数求部分"),
      explanation: t(
        "When the total is known, add the ratio terms to find how many equal parts the total is split into. Divide to find one part, then multiply by each term.\n\nRatio $3 : 4$, $28$ in all: there are $3 + 4 = 7$ equal parts, each $28 \\div 7 = 4$. So there are $3 \\times 4 = 12$ boys and $4 \\times 4 = 16$ girls. Dividing $28$ by $3$ or $4$ alone is a common mistake.",
        "已知总数时，先把比的各项相加，得到总数被平均分成几份。用除法求出一份，再分别乘各项。\n\n比为 $3 : 4$，共 $28$ 人：共 $3 + 4 = 7$ 份，每份 $28 \\div 7 = 4$ 人。所以男生 $3 \\times 4 = 12$ 名，女生 $4 \\times 4 = 16$ 名。直接用 $28$ 除以 $3$ 或 $4$ 是常见的错误。",
      ),
      generate(rng) {
        const th = rng.pick(things);
        const [a, b] = coprimePair(rng, 1, 9);
        const k = rng.int(2, 10);
        const total = (a + b) * k;
        const askA = rng.bool();
        const answer = (askA ? a : b) * k;
        const name = askA ? th.a : th.b;
        return numberProblem({
          prompt: t(
            `The ratio of ${th.a.en} to ${th.b.en} is $${ratio(a, b)}$, and there are ${total} of them altogether. How many ${name.en} are there?`,
            `${th.a["zh-CN"]}与${th.b["zh-CN"]}的比是 $${ratio(a, b)}$，一共有 ${total} 个。${name["zh-CN"]}有多少个？`,
          ),
          answer,
          form: "integer",
          wrong: [total - answer, k, (askA ? a : b) * (k + 1)],
          solution: t(
            `There are $${a} + ${b} = ${a + b}$ equal parts, each worth $${total} \\div ${a + b} = ${k}$. So there are $${askA ? a : b} \\times ${k} = ${answer}$ ${name.en}.`,
            `共 $${a} + ${b} = ${a + b}$ 份，每份 $${total} \\div ${a + b} = ${k}$。所以${name["zh-CN"]}有 $${askA ? a : b} \\times ${k} = ${answer}$ 个。`,
          ),
        });
      },
    },
  ],
);

export const furtherReasoningWithEquivalentRatios = topic(
  "further-reasoning-with-equivalent-ratios",
  t("Further Reasoning With Equivalent Ratios", "用等比推理（进阶）"),
  t(
    "The difference between the terms also scales. With a ratio of 2 : 5 and 21 more of the second kind, the difference 3 parts is 21, so one part is 7. A ratio of three quantities a : b : c works the same way, with a + b + c parts in all.",
    "两项之差也按同样倍数变化。比是 2 : 5，第二种多 21 个，相差的 3 份是 21，所以每份是 7。三个量的连比 a : b : c 也一样，总共有 a + b + c 份。",
  ),
  ["reasoning-with-equivalent-ratios"],
  ["6.RP.A.3"],
  [
    {
      id: "scaling-from-the-difference",
      title: t("Finding a part from the difference", "由差求部分"),
      explanation: t(
        "Ratio $2 : 5$ with $21$ more tulips than roses: $5 - 2 = 3$ parts are $21$, one part is $7$, so there are $2 \\times 7 = 14$ roses.",
        "比为 $2 : 5$，郁金香比玫瑰多 $21$ 枝：$5 - 2 = 3$ 份是 $21$，每份 $7$，所以玫瑰有 $2 \\times 7 = 14$ 枝。",
      ),
      generate(rng) {
        const th = rng.pick(things);
        let a: number, b: number;
        do [a, b] = coprimePair(rng, 1, 9);
        while (a >= b);
        const k = rng.int(2, 12);
        const diff = (b - a) * k;
        const askA = rng.bool();
        const answer = (askA ? a : b) * k;
        const name = askA ? th.a : th.b;
        return numberProblem({
          prompt: t(
            `The ratio of ${th.a.en} to ${th.b.en} is $${ratio(a, b)}$. There are ${diff} more ${th.b.en} than ${th.a.en}. How many ${name.en} are there?`,
            `${th.a["zh-CN"]}与${th.b["zh-CN"]}的比是 $${ratio(a, b)}$。${th.b["zh-CN"]}比${th.a["zh-CN"]}多 ${diff} 个。${name["zh-CN"]}有多少个？`,
          ),
          answer,
          form: "integer",
          wrong: [diff * (askA ? a : b), (a + b) * k, (askA ? b : a) * k],
          solution: t(
            `The difference is $${b} - ${a} = ${b - a}$ parts, so one part is $${diff} \\div ${b - a} = ${k}$. There are $${askA ? a : b} \\times ${k} = ${answer}$ ${name.en}.`,
            `相差 $${b} - ${a} = ${b - a}$ 份，所以每份是 $${diff} \\div ${b - a} = ${k}$。${name["zh-CN"]}有 $${askA ? a : b} \\times ${k} = ${answer}$ 个。`,
          ),
        });
      },
    },
    {
      id: "three-part-ratios",
      title: t("Ratios of three quantities", "三个量的连比"),
      explanation: t(
        "Red, green and blue beads in the ratio $1 : 2 : 3$, $48$ beads in all: $6$ parts, each $8$. So there are $8$ red, $16$ green and $24$ blue.",
        "红、绿、蓝珠子的比是 $1 : 2 : 3$，共 $48$ 颗：共 $6$ 份，每份 $8$ 颗。所以红珠 $8$ 颗、绿珠 $16$ 颗、蓝珠 $24$ 颗。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(1, 6);
        const c = rng.int(2, 7);
        const k = rng.int(2, 9);
        const total = (a + b + c) * k;
        const which = rng.int(0, 2);
        const colors = [t("red", "红"), t("green", "绿"), t("blue", "蓝")] as const;
        const parts = [a, b, c] as const;
        const answer = parts[which]! * k;
        return numberProblem({
          prompt: t(
            `A bag holds red, green and blue beads in the ratio $${ratio(a, b, c)}$. There are ${total} beads. How many ${colors[which]!.en} beads are there?`,
            `袋子里红、绿、蓝珠子的比是 $${ratio(a, b, c)}$，共 ${total} 颗。${colors[which]!["zh-CN"]}珠子有多少颗？`,
          ),
          answer,
          form: "integer",
          wrong: [k, total - answer, parts[which]! * (k + 1)],
          solution: t(
            `There are $${a} + ${b} + ${c} = ${a + b + c}$ parts, each $${total} \\div ${a + b + c} = ${k}$ beads. So there are $${parts[which]} \\times ${k} = ${answer}$ ${colors[which]!.en} beads.`,
            `共 $${a} + ${b} + ${c} = ${a + b + c}$ 份，每份 $${total} \\div ${a + b + c} = ${k}$ 颗。所以${colors[which]!["zh-CN"]}珠子有 $${parts[which]} \\times ${k} = ${answer}$ 颗。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Representing ratios

export const ratioTables = topic(
  "ratio-tables",
  t("Ratio Tables", "比例表"),
  t(
    "A ratio table lists equivalent ratios in columns. Each column is found from another by multiplying or dividing both entries by the same number, or by adding two columns.",
    "比例表把相等的比按列排出。每一列可以由另一列的两个数同乘或同除以一个数得到，也可以把两列相加得到。",
  ),
  ["equivalent-ratios"],
  ["6.RP.A.3a"],
  [
    {
      id: "completing-a-ratio-table",
      title: t("Completing a ratio table", "补全比例表"),
      explanation: t(
        "In a ratio table every column shows an equivalent ratio, so the bottom row is always the same multiple of the top row. Find that multiple from a complete column, then use it for the missing entry.\n\nWith $2, 4, 6$ on top and $5, 10, \\square$ below, the bottom row is $\\frac{5}{2}$ times the top, so $\\square = 6 \\times \\frac{5}{2} = 15$.",
        "比例表中每一列都是相等的比，所以下行总是上行的同一个倍数。先用一列完整的数求出这个倍数，再用它求出空缺的数。\n\n上行为 $2, 4, 6$，下行为 $5, 10, \\square$，下行是上行的 $\\frac{5}{2}$ 倍，所以 $\\square = 6 \\times \\frac{5}{2} = 15$。",
      ),
      generate(rng) {
        const mix = rng.pick(mixes);
        const [a, b] = coprimePair(rng, 1, 9);
        const ks = rng.sample([1, 2, 3, 4, 5, 6, 8, 10], 4).sort((x, y) => x - y);
        const hole = rng.int(1, 3);
        const top = ks.map((k) => String(a * k));
        const bottom = ks.map((k, i) => (i === hole ? "\\square" : String(b * k)));
        const k = ks[hole]!;
        return numberProblem({
          prompt: t(
            `The table shows amounts of ${mix.a.en} and ${mix.b.en} (in ${mix.unit.en}) mixed in the same ratio. Find the missing number. $$${tableLatex([mix.a.en, mix.b.en], top, bottom)}$$`,
            `下表是按相同比例混合的${mix.a["zh-CN"]}和${mix.b["zh-CN"]}的量（单位：${mix.unit["zh-CN"]}）。求缺少的数。$$${tableLatex([mix.a["zh-CN"], mix.b["zh-CN"]], top, bottom)}$$`,
          ),
          answer: b * k,
          form: "integer",
          wrong: [a * k + (b - a), b * (k + 1), b * ks[hole - 1]! + b],
          solution: t(
            `The first column is $${ratio(a * ks[0]!, b * ks[0]!)}$, which simplifies to $${ratio(a, b)}$. The top entry $${a * k}$ is $${a} \\times ${k}$, so the bottom entry is $${b} \\times ${k} = ${b * k}$.`,
            `第一列是 $${ratio(a * ks[0]!, b * ks[0]!)}$，化简为 $${ratio(a, b)}$。上面的数 $${a * k} = ${a} \\times ${k}$，所以下面的数是 $${b} \\times ${k} = ${b * k}$。`,
          ),
        });
      },
    },
    {
      id: "ratio-tables-through-the-unit-rate",
      title: t("Going through one unit", "先求一份"),
      explanation: t(
        "$4$ cups of flour make $6$ muffins. To find how many muffins $10$ cups make, $10$ is not a whole-number multiple of $4$, so first divide both entries by $2$: $2$ cups make $3$ muffins. Then multiply by $5$: $10$ cups make $15$ muffins.",
        "$4$ 杯面粉做 $6$ 个松饼。求 $10$ 杯能做多少个：$10$ 不是 $4$ 的整数倍，所以先把两项都除以 $2$：$2$ 杯做 $3$ 个。再乘 $5$：$10$ 杯做 $15$ 个。",
      ),
      generate(rng) {
        const [p, q] = coprimePair(rng, 1, 7);
        const g = rng.int(2, 4);
        let m: number;
        do m = rng.int(2, 12);
        while (m % g === 0);
        const [a, b] = [p * g, q * g];
        const x = p * m;
        return numberProblem({
          prompt: t(
            `A recipe uses ${a} cups of flour for every ${b} muffins. Complete the ratio table: how many muffins can be made with ${x} cups of flour? $$${tableLatex(["flour (cups)", "muffins"], [String(a), String(x)], [String(b), "\\square"])}$$`,
            `一份食谱每 ${b} 个松饼用 ${a} 杯面粉。补全比例表：用 ${x} 杯面粉可以做多少个松饼？$$${tableLatex(["面粉（杯）", "松饼（个）"], [String(a), String(x)], [String(b), "\\square"])}$$`,
          ),
          answer: q * m,
          form: "integer",
          wrong: [x + (b - a), b * m, q * (m + 1)],
          solution: t(
            `Divide both entries by $${g}$: $${ratio(a, b)} = ${ratio(p, q)}$. Then multiply by $${m}$: $${ratio(p * m, q * m)}$. So ${x} cups make $${q * m}$ muffins.`,
            `两项都除以 $${g}$：$${ratio(a, b)} = ${ratio(p, q)}$。再乘 $${m}$：$${ratio(p * m, q * m)}$。所以 ${x} 杯可以做 $${q * m}$ 个松饼。`,
          ),
        });
      },
    },
  ],
);

/** ratioGraph draws the points (ka, kb) of a ratio a : b for k = 1, 2, 3. */
function ratioGraph(a: number, b: number, view: number): Figure {
  const marks: PlaneMark[] = [1, 2, 3].map((k) => ({ kind: "point", at: [k * a, k * b], accent: true }));
  const step = view <= 12 ? 1 : 2;
  return {
    svg: plane({ xMin: 0, xMax: view, yMin: 0, yMax: view, step, labelEvery: view <= 12 ? 2 : 1 }, marks),
    alt: t(
      `Points (${a}, ${b}), (${2 * a}, ${2 * b}) and (${3 * a}, ${3 * b}) in the first quadrant.`,
      `第一象限中的点 (${a}, ${b})、(${2 * a}, ${2 * b}) 和 (${3 * a}, ${3 * b})。`,
    ),
  };
}

export const graphingRatios = topic(
  "graphing-ratios",
  t("Graphing Ratios", "比的图像"),
  t(
    "Each pair in a ratio table can be plotted as a point (x, y). The points of equivalent ratios lie on a straight line through the origin, so the graph can be extended to find new pairs.",
    "比例表中的每一对数都可以画成点 (x, y)。相等的比所对应的点在一条过原点的直线上，所以延长图像就能找到新的数对。",
  ),
  ["ratio-tables", "describing-the-coordinate-plane"],
  ["6.RP.A.3a"],
  [
    {
      id: "reading-a-ratio-graph",
      title: t("Reading a ratio graph", "读比的图像"),
      explanation: t(
        "If the points $(2, 3)$, $(4, 6)$ and $(6, 9)$ show the ratio of $x$ to $y$, then the ratio is $2 : 3$, and when $x = 10$, $y = 15$.",
        "如果点 $(2, 3)$、$(4, 6)$、$(6, 9)$ 表示 $x$ 与 $y$ 的比，那么这个比是 $2 : 3$；当 $x = 10$ 时，$y = 15$。",
      ),
      generate(rng) {
        const [a, b] = coprimePair(rng, 1, 4);
        const k = rng.int(4, 7);
        const view = Math.max(3 * a, 3 * b) + 1;
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows equivalent ratios of $x$ to $y$. What is $y$ when $x = ${a * k}$?`,
              `图中的点表示相等的 $x$ 与 $y$ 的比。当 $x = ${a * k}$ 时，$y$ 是多少？`,
            ),
            answer: b * k,
            form: "integer",
            wrong: [a * k + (b - a), a * k, b * (k + 1)],
            solution: t(
              `The point $(${a}, ${b})$ shows the ratio $${ratio(a, b)}$. $${a * k} = ${a} \\times ${k}$, so $y = ${b} \\times ${k} = ${b * k}$.`,
              `点 $(${a}, ${b})$ 表示比 $${ratio(a, b)}$。$${a * k} = ${a} \\times ${k}$，所以 $y = ${b} \\times ${k} = ${b * k}$。`,
            ),
          }),
          figure: ratioGraph(a, b, view),
        };
      },
    },
    {
      id: "points-on-a-ratio-graph",
      title: t("Which point belongs on the graph?", "哪个点在图像上？"),
      explanation: t(
        "The points on a ratio graph are pairs $(x, y)$ in the same ratio, so they all lie on one straight line through $(0, 0)$. To test a point, check that its coordinates form an equivalent ratio.\n\nFor the ratio $2 : 3$, the point $(8, 12)$ belongs on the graph because $8 : 12 = 2 : 3$; the point $(8, 9)$ does not.",
        "比的图像上的点 $(x, y)$ 都是相等的比，所以它们都在一条经过 $(0, 0)$ 的直线上。判断一个点是否在图像上，就看它的两个坐标组成的比是否与原来的比相等。\n\n对于比 $2 : 3$，点 $(8, 12)$ 在图像上，因为 $8 : 12 = 2 : 3$；点 $(8, 9)$ 不在。",
      ),
      generate(rng) {
        const [a, b] = coprimePair(rng, 1, 7);
        const k = rng.int(3, 12);
        const correct = mathText(`(${a * k}, ${b * k})`);
        const wrong = [
          mathText(`(${b * k}, ${a * k})`),
          mathText(`(${a * k}, ${b * k + 1})`),
          mathText(`(${a + k}, ${b + k})`),
          mathText(`(${a * k}, ${b * (k - 1)})`),
        ];
        return pickChoice(
          rng,
          t(
            `The points of a graph show equivalent ratios of $x$ to $y$, starting with $(${a}, ${b})$. Which point also belongs on the graph?`,
            `一个图像上的点表示相等的 $x$ 与 $y$ 的比，第一个点是 $(${a}, ${b})$。下面哪个点也在这个图像上？`,
          ),
          correct,
          wrong,
          t(
            `$(${a * k}, ${b * k})$ is $(${a}, ${b})$ with both coordinates multiplied by $${k}$, so $${ratio(a * k, b * k)} = ${ratio(a, b)}$.`,
            `$(${a * k}, ${b * k})$ 是把 $(${a}, ${b})$ 的两个坐标都乘 $${k}$ 得到的，所以 $${ratio(a * k, b * k)} = ${ratio(a, b)}$。`,
          ),
        );
      },
    },
  ],
);

/** tapeFigure draws two tapes of a and b equal boxes, one above the other. */
function tapeFigure(a: number, b: number, labels: readonly [string, string]): Figure {
  const box = 24;
  let body = "";
  [a, b].forEach((n, row) => {
    const y = 12 + row * 40;
    body += `<text x="30" y="${y + 17}">${labels[row]}</text>`;
    for (let i = 0; i < n; i++) body += `<rect class="accent" x="${60 + i * box}" y="${y}" width="${box}" height="${box}"/>`;
  });
  return {
    svg: svgDocument(92, body),
    alt: t(
      `A tape diagram: ${labels[0]} has ${a} equal boxes and ${labels[1]} has ${b}.`,
      `线段图：${labels[0]} 有 ${a} 个相等的格子，${labels[1]} 有 ${b} 个。`,
    ),
  };
}

export const tapeDiagrams = topic(
  "tape-diagrams",
  t("Tape Diagrams", "线段图（条形图）"),
  t(
    "A tape diagram shows a ratio as rows of equal boxes: 3 : 5 is a row of 3 boxes and a row of 5 boxes of the same size. If the 8 boxes hold 40 in all, each box holds 5.",
    "线段图用一排排大小相同的格子表示比：3 : 5 就是一排 3 格、一排 5 格。如果 8 格一共是 40，那么每格是 5。",
  ),
  ["reasoning-with-equivalent-ratios"],
  ["6.RP.A.3"],
  [
    {
      id: "tape-diagrams-with-a-total",
      title: t("Tape diagrams with a total", "已知总数的线段图"),
      explanation: t(
        "In a tape diagram each box is the same size. When the total is given, count all the boxes, divide the total by that count to get one box, then multiply by the boxes asked for.\n\nA has $3$ boxes, B has $5$ boxes, and the total is $40$. The $8$ boxes make $40$, so one box is $5$ and B is $5 \\times 5 = 25$.",
        "线段图中每一格大小相同。已知总数时，先数出一共有几格，用总数除以格数得到一格，再乘所求的格数。\n\nA 有 $3$ 格，B 有 $5$ 格，共 $40$。$8$ 格是 $40$，每格是 $5$，所以 B 是 $5 \\times 5 = 25$。",
      ),
      generate(rng) {
        const [a, b] = coprimePair(rng, 1, 7);
        const k = rng.int(3, 15);
        const total = (a + b) * k;
        const askA = rng.bool();
        const answer = (askA ? a : b) * k;
        return {
          ...numberProblem({
            prompt: t(
              `The tape diagram shows the ratio of A to B. Together A and B are ${total}. What is ${askA ? "A" : "B"}?`,
              `线段图表示 A 与 B 的比。A 与 B 的和是 ${total}。${askA ? "A" : "B"} 是多少？`,
            ),
            answer,
            form: "integer",
            wrong: [k, total - answer, (askA ? a : b) * (k + 1)],
            solution: t(
              `There are $${a} + ${b} = ${a + b}$ boxes, each worth $${total} \\div ${a + b} = ${k}$. ${askA ? "A" : "B"} has $${askA ? a : b}$ boxes: $${askA ? a : b} \\times ${k} = ${answer}$.`,
              `共 $${a} + ${b} = ${a + b}$ 格，每格 $${total} \\div ${a + b} = ${k}$。${askA ? "A" : "B"} 有 $${askA ? a : b}$ 格：$${askA ? a : b} \\times ${k} = ${answer}$。`,
            ),
          }),
          figure: tapeFigure(a, b, ["A", "B"]),
        };
      },
    },
    {
      id: "tape-diagrams-with-a-difference",
      title: t("Tape diagrams with a difference", "已知差的线段图"),
      explanation: t(
        "When the difference is given, count only the extra boxes: they are what makes one tape longer. Divide the difference by the extra boxes to get one box.\n\nA has $3$ boxes, B has $5$ boxes, and B is $12$ more than A. The $2$ extra boxes are $12$, so one box is $6$ and A is $3 \\times 6 = 18$.",
        "已知相差多少时，只看多出来的格子，正是它们让一段比另一段长。用差除以多出的格数，就得到一格。\n\nA 有 $3$ 格，B 有 $5$ 格，B 比 A 多 $12$。多出的 $2$ 格是 $12$，每格是 $6$，所以 A 是 $3 \\times 6 = 18$。",
      ),
      generate(rng) {
        let a: number, b: number;
        do [a, b] = coprimePair(rng, 1, 8);
        while (a >= b);
        const k = rng.int(3, 15);
        const diff = (b - a) * k;
        const askA = rng.bool();
        const answer = (askA ? a : b) * k;
        return {
          ...numberProblem({
            prompt: t(
              `The tape diagram shows the ratio of A to B. B is ${diff} more than A. What is ${askA ? "A" : "B"}?`,
              `线段图表示 A 与 B 的比。B 比 A 多 ${diff}。${askA ? "A" : "B"} 是多少？`,
            ),
            answer,
            form: "integer",
            wrong: [k, diff * (askA ? a : b), (a + b) * k],
            solution: t(
              `B has $${b} - ${a} = ${b - a}$ more box${b - a === 1 ? "" : "es"} than A, and they are worth $${diff}$, so one box is $${diff} \\div ${b - a} = ${k}$. ${askA ? "A" : "B"} $= ${askA ? a : b} \\times ${k} = ${answer}$.`,
              `B 比 A 多 $${b} - ${a} = ${b - a}$ 格，共 $${diff}$，所以每格是 $${diff} \\div ${b - a} = ${k}$。${askA ? "A" : "B"} $= ${askA ? a : b} \\times ${k} = ${answer}$。`,
            ),
          }),
          figure: tapeFigure(a, b, ["A", "B"]),
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Unit rates

/** Item is something sold by the piece. */
interface Item {
  readonly one: Text;
  readonly many: Text;
}

const items: readonly Item[] = [
  { one: t("notebook", "本笔记本"), many: t("notebooks", "本笔记本") },
  { one: t("ticket", "张票"), many: t("tickets", "张票") },
  { one: t("pen", "支笔"), many: t("pens", "支笔") },
  { one: t("bottle of water", "瓶水"), many: t("bottles of water", "瓶水") },
  { one: t("sandwich", "个三明治"), many: t("sandwiches", "个三明治") },
];

export const solvingProblemsUsingUnitRates = topic(
  "solving-problems-using-unit-rates",
  t("Solving Problems Using Unit Rates", "用单位率解决问题"),
  t(
    "Find the unit rate first, then multiply. If 5 notebooks cost \\$15, one costs \\$3, so 8 cost \\$24. To find the better buy, compare the price of one item at each store.",
    "先求单位率，再相乘。5 本笔记本 15 美元，那么每本 3 美元，8 本就是 24 美元。比较哪家更划算，就比较每家单价。",
  ),
  ["unit-rates", "ratio-tables"],
  ["6.RP.A.2", "6.RP.A.3b"],
  [
    {
      id: "scaling-with-the-unit-rate",
      title: t("Using the unit price", "用单价计算"),
      explanation: t(
        "A unit rate is the amount for one unit. Find it by dividing, then multiply it by the number of units you need.\n\n$5$ notebooks cost $\\$15$, so one costs $\\$15 \\div 5 = \\$3$, and $8$ notebooks cost $8 \\times \\$3 = \\$24$.",
        "单位量是每一个单位对应的量。先用除法求出单位量，再乘需要的单位数。\n\n$5$ 本笔记本 $\\$15$，每本 $\\$15 \\div 5 = \\$3$，所以 $8$ 本 $8 \\times \\$3 = \\$24$。",
      ),
      generate(rng) {
        const it = rng.pick(items);
        const unit = rng.int(2, 12);
        const n = rng.int(3, 9);
        let m: number;
        do m = rng.int(2, 15);
        while (m === n);
        return numberProblem({
          prompt: t(
            `${n} ${it.many.en} cost $\\$${n * unit}$. At the same price, how many dollars do ${m} ${m === 1 ? it.one.en : it.many.en} cost?`,
            `${n} ${it.many["zh-CN"]}共 $\\$${n * unit}$。按同样的价格，${m} ${it.many["zh-CN"]}要多少美元？`,
          ),
          answer: m * unit,
          form: "integer",
          wrong: [n * unit + (m - n), unit, m * (unit + 1)],
          solution: t(
            `One costs $\\$${n * unit} \\div ${n} = \\$${unit}$, so ${m} cost $${m} \\times \\$${unit} = \\$${m * unit}$.`,
            `单价是 $\\$${n * unit} \\div ${n} = \\$${unit}$，所以 ${m} ${it.many["zh-CN"]}要 $${m} \\times \\$${unit} = \\$${m * unit}$。`,
          ),
        });
      },
    },
    {
      id: "comparing-unit-prices",
      title: t("Finding the better buy", "哪家更划算"),
      explanation: t(
        "Store A sells $4$ pens for $\\$6$ ($\\$1.50$ each); store B sells $6$ pens for $\\$8.40$ ($\\$1.40$ each). Store B is the better buy.",
        "A 店 $4$ 支笔 $\\$6$（每支 $\\$1.50$）；B 店 $6$ 支笔 $\\$8.40$（每支 $\\$1.40$）。B 店更划算。",
      ),
      generate(rng) {
        const it = rng.pick(items);
        let pa: number, pb: number;
        do {
          pa = rng.int(11, 40) * 10;
          pb = rng.int(11, 40) * 10;
        } while (pa === pb);
        const na = rng.int(2, 8);
        let nb: number;
        do nb = rng.int(2, 8);
        while (nb === na);
        const cents = (c: number) => (c / 100).toFixed(2);
        const correct = pa < pb ? 0 : 1;
        return choiceProblem({
          prompt: t(
            `Store A sells ${na} ${it.many.en} for $\\$${cents(na * pa)}$. Store B sells ${nb} ${it.many.en} for $\\$${cents(nb * pb)}$. Which store has the lower price for one ${it.one.en}?`,
            `A 店 ${na} ${it.many["zh-CN"]}卖 $\\$${cents(na * pa)}$，B 店 ${nb} ${it.many["zh-CN"]}卖 $\\$${cents(nb * pb)}$。哪家店的单价更低？`,
          ),
          options: [t("Store A", "A 店"), t("Store B", "B 店")],
          correct,
          solution: t(
            `Store A: $\\$${cents(na * pa)} \\div ${na} = \\$${cents(pa)}$ each. Store B: $\\$${cents(nb * pb)} \\div ${nb} = \\$${cents(pb)}$ each. Store ${correct === 0 ? "A" : "B"} is cheaper.`,
            `A 店：$\\$${cents(na * pa)} \\div ${na} = \\$${cents(pa)}$。B 店：$\\$${cents(nb * pb)} \\div ${nb} = \\$${cents(pb)}$。${correct === 0 ? "A" : "B"} 店更便宜。`,
          ),
        });
      },
    },
  ],
);

export const speedAsAUnitRate = topic(
  "speed-as-a-unit-rate",
  t("Speed as a Unit Rate", "速度是单位率"),
  t(
    "Speed is the distance traveled per unit of time: speed = distance ÷ time. A car that goes 150 miles in 3 hours travels 50 miles per hour, so in 5 hours it goes 250 miles.",
    "速度是单位时间内走过的路程：速度 = 路程 ÷ 时间。汽车 3 小时行驶 150 英里，速度是每小时 50 英里，5 小时能行驶 250 英里。",
  ),
  ["solving-problems-using-unit-rates"],
  ["6.RP.A.2", "6.RP.A.3b"],
  [
    {
      id: "finding-a-speed",
      title: t("Finding a speed", "求速度"),
      explanation: t(
        "Speed is a unit rate: the distance traveled in one unit of time. Divide the distance by the time.\n\n$150$ miles in $3$ hours is $150 \\div 3 = 50$ miles per hour.",
        "速度是一种单位量：单位时间内所行的路程。用路程除以时间。\n\n$3$ 小时行驶 $150$ 英里，速度是 $150 \\div 3 = 50$ 英里/小时。",
      ),
      generate(rng) {
        const kind = rng.pick([
          {
            who: t("A car", "一辆汽车"),
            d: t("miles", "英里"),
            tu: t("hours", "小时"),
            per: t("miles per hour", "英里/小时"),
            lo: 30,
            hi: 70,
          },
          {
            who: t("A cyclist", "一名骑车人"),
            d: t("kilometers", "千米"),
            tu: t("hours", "小时"),
            per: t("kilometers per hour", "千米/小时"),
            lo: 12,
            hi: 25,
          },
          {
            who: t("A runner", "一名跑步者"),
            d: t("meters", "米"),
            tu: t("seconds", "秒"),
            per: t("meters per second", "米/秒"),
            lo: 4,
            hi: 9,
          },
        ]);
        const v = rng.int(kind.lo, kind.hi);
        const time = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `${kind.who.en} travels ${v * time} ${kind.d.en} in ${time} ${kind.tu.en} at a constant speed. What is its speed in ${kind.per.en}?`,
            `${kind.who["zh-CN"]}匀速行驶，${time} ${kind.tu["zh-CN"]}行驶了 ${v * time} ${kind.d["zh-CN"]}。速度是多少${kind.per["zh-CN"]}？`,
          ),
          answer: v,
          form: "integer",
          wrong: [v * time * time, v + time, v * time - time],
          solution: t(
            `Speed $=$ distance $\\div$ time $= ${v * time} \\div ${time} = ${v}$ ${kind.per.en}.`,
            `速度 $=$ 路程 $\\div$ 时间 $= ${v * time} \\div ${time} = ${v}$ ${kind.per["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "using-a-speed",
      title: t("Using a speed", "用速度求路程或时间"),
      explanation: t(
        "From a speed you can find a distance or a time. Distance is speed times time; time is distance divided by speed.\n\nAt $50$ miles per hour, $5$ hours cover $50 \\times 5 = 250$ miles, and $400$ miles take $400 \\div 50 = 8$ hours.",
        "知道速度，就能求路程或时间：路程 = 速度 × 时间，时间 = 路程 ÷ 速度。\n\n以 $50$ 英里/小时的速度，$5$ 小时行驶 $50 \\times 5 = 250$ 英里，$400$ 英里需要 $400 \\div 50 = 8$ 小时。",
      ),
      generate(rng) {
        const v = rng.int(4, 15) * 5;
        const time = rng.int(2, 9);
        const askDistance = rng.bool();
        if (askDistance)
          return numberProblem({
            prompt: t(
              `A train travels at a constant speed of ${v} miles per hour. How many miles does it travel in ${time} hours?`,
              `一列火车以 ${v} 英里/小时的速度匀速行驶。${time} 小时行驶多少英里？`,
            ),
            answer: v * time,
            form: "integer",
            wrong: [v + time, v * (time + 1), Math.round(v / time)],
            solution: t(
              `Distance $=$ speed $\\times$ time $= ${v} \\times ${time} = ${v * time}$ miles.`,
              `路程 $=$ 速度 $\\times$ 时间 $= ${v} \\times ${time} = ${v * time}$ 英里。`,
            ),
          });
        return numberProblem({
          prompt: t(
            `A train travels at a constant speed of ${v} miles per hour. How many hours does it take to travel ${v * time} miles?`,
            `一列火车以 ${v} 英里/小时的速度匀速行驶。行驶 ${v * time} 英里需要多少小时？`,
          ),
          answer: time,
          form: "integer",
          wrong: [time + 1, time * 2, v],
          solution: t(
            `Time $=$ distance $\\div$ speed $= ${v * time} \\div ${v} = ${time}$ hours.`,
            `时间 $=$ 路程 $\\div$ 速度 $= ${v * time} \\div ${v} = ${time}$ 小时。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Introduction to percentages

/** gridFigure draws a 10-by-10 grid with the first n squares shaded. */
function gridFigure(n: number): Figure {
  const s = 16;
  let body = "";
  for (let i = 0; i < 100; i++) {
    const [r, c] = [Math.floor(i / 10), i % 10];
    const fill = i < n ? ' class="accent" fill="currentColor" fill-opacity="0.35"' : "";
    body += `<rect x="${80 + c * s}" y="${8 + r * s}" width="${s}" height="${s}"${fill}/>`;
  }
  return {
    svg: svgDocument(176, body),
    alt: t(`A 10-by-10 grid of 100 squares with ${n} squares shaded.`, `一个 10 × 10 的方格图，共 100 格，其中 ${n} 格涂色。`),
  };
}

/** barFigure draws a bar split into d equal parts with the first k shaded. */
function percentBar(d: number, k: number): Figure {
  const w = 280 / d;
  let body = "";
  for (let i = 0; i < d; i++) {
    const fill = i < k ? ' class="accent" fill="currentColor" fill-opacity="0.35"' : "";
    body += `<rect x="${20 + i * w}" y="10" width="${Math.round(w * 100) / 100}" height="30"${fill}/>`;
  }
  return {
    svg: svgDocument(50, body),
    alt: t(`A bar split into ${d} equal parts with ${k} parts shaded.`, `一个长条平均分成 ${d} 份，其中 ${k} 份涂色。`),
  };
}

export const understandingPercentagesUsingModels = topic(
  "understanding-percentages-using-models",
  t("Understanding Percentages Using Models", "用模型理解百分数"),
  t(
    "Percent means “per hundred”: 37% is 37 out of 100. On a 10-by-10 grid, 37 shaded squares show 37%. A bar split into 4 equal parts with 1 part shaded shows 1/4 = 25/100 = 25%.",
    "百分数表示“每一百中的多少”：37% 就是 100 份中的 37 份。在 10 × 10 的方格图中，涂色 37 格表示 37%。一个长条平均分成 4 份，涂色 1 份，表示 1/4 = 25/100 = 25%。",
  ),
  ["equivalent-fractions", "decimal-fractions"],
  ["6.RP.A.3c"],
  [
    {
      id: "percent-from-a-hundred-grid",
      title: t("Percent on a hundred grid", "百格图中的百分数"),
      explanation: t(
        'Percent means "out of $100$". A hundred grid has $100$ equal squares, so the number of shaded squares is the percent.\n\n$42$ of $100$ squares shaded is $42\\%$.',
        '百分数表示"每一百份中占几份"。百格图有 $100$ 个相等的小方格，涂色的格数就是百分数。\n\n$100$ 格中涂色 $42$ 格，就是 $42\\%$。',
      ),
      generate(rng) {
        const n = rng.int(3, 97);
        return {
          ...numberProblem({
            prompt: t("What percent of the grid is shaded?", "方格图中涂色部分占百分之几？"),
            answer: n,
            percent: true,
            form: "integer",
            wrong: [100 - n, n + 10].filter((w) => w > 0 && w < 100),
            solution: t(
              `$${n}$ of the $100$ squares are shaded, so $${n}\\%$ is shaded.`,
              `$100$ 格中有 $${n}$ 格涂色，所以涂色部分占 $${n}\\%$。`,
            ),
          }),
          figure: gridFigure(n),
        };
      },
    },
    {
      id: "percent-from-a-bar-model",
      title: t("Percent on a bar model", "长条模型中的百分数"),
      explanation: t(
        "When a bar is not cut into $100$ parts, write the shaded part as a fraction, then rewrite it with denominator $100$. The numerator is the percent.\n\nA bar of $5$ equal parts with $2$ shaded shows $\\frac{2}{5} = \\frac{40}{100} = 40\\%$.",
        "长条没有分成 $100$ 份时，先把涂色部分写成分数，再化成分母是 $100$ 的分数，分子就是百分数。\n\n长条平均分成 $5$ 份，涂色 $2$ 份，表示 $\\frac{2}{5} = \\frac{40}{100} = 40\\%$。",
      ),
      generate(rng) {
        const d = rng.pick([2, 4, 5, 10, 20, 25]);
        const k = rng.int(1, d - 1);
        const pct = (k * 100) / d;
        return {
          ...numberProblem({
            prompt: t(
              "The bar is split into equal parts. What percent of the bar is shaded?",
              "长条被平均分成若干份。涂色部分占百分之几？",
            ),
            answer: pct,
            percent: true,
            form: "integer",
            wrong: [k, 100 - pct, k * 10],
            solution: t(
              `$${k}$ of $${d}$ equal parts: $${fr(k, d)} = ${fr(pct, 100)} = ${pct}\\%$.`,
              `$${d}$ 份中的 $${k}$ 份：$${fr(k, d)} = ${fr(pct, 100)} = ${pct}\\%$。`,
            ),
          }),
          figure: percentBar(d, k),
        };
      },
    },
  ],
);

/** nicePercent draws a fraction k/d whose percent is a whole number, with d one of the denominators that divide 100. */
function nicePercent(rng: Rng): { k: number; d: number; pct: number } {
  const d = rng.pick([2, 4, 5, 10, 20, 25, 50]);
  let k: number;
  do k = rng.int(1, d - 1);
  while (gcd(k, d) !== 1);
  return { k, d, pct: (k * 100) / d };
}

export const convertingBetweenPercentagesAndFractions = topic(
  "converting-between-percentages-and-fractions",
  t("Converting Between Percentages and Fractions", "百分数与分数互化"),
  t(
    "A percent is a fraction with denominator 100: 35% = 35/100 = 7/20. To write a fraction as a percent, find an equivalent fraction with denominator 100: 3/4 = 75/100 = 75%.",
    "百分数就是分母为 100 的分数：35% = 35/100 = 7/20。把分数化成百分数，先化成分母为 100 的分数：3/4 = 75/100 = 75%。",
  ),
  ["understanding-percentages-using-models", "writing-fractions-in-lowest-terms"],
  ["6.RP.A.3c"],
  [
    {
      id: "percent-to-fraction",
      title: t("Percent to fraction", "百分数化成分数"),
      explanation: t(
        "To write a percent as a fraction, put the number over $100$ and simplify by dividing the numerator and denominator by a common factor.\n\n$35\\% = \\frac{35}{100}$, and dividing both by $5$ gives $\\frac{7}{20}$.",
        "把百分数化成分数，就把百分号前的数写成分母是 $100$ 的分数，再用公因数约分。\n\n$35\\% = \\frac{35}{100}$，分子分母同时除以 $5$，得 $\\frac{7}{20}$。",
      ),
      generate(rng) {
        let p: number;
        do p = rng.int(1, 99);
        while (p % 10 === 0 && rng.bool(0.5));
        const g = gcd(p, 100);
        return numberProblem({
          prompt: t(`Write $${p}\\%$ as a fraction in simplest form.`, `把 $${p}\\%$ 写成最简分数。`),
          answer: Q.of(p, 100),
          form: "fraction",
          wrong: [Q.of(p, 10), Q.of(100, p), Q.of(1, p)],
          solution: t(
            `$${p}\\% = ${fr(p, 100)}${g > 1 ? ` = ${fr(p / g, 100 / g)}$, dividing both by $${g}$.` : "$, which is already in simplest form."}`,
            `$${p}\\% = ${fr(p, 100)}${g > 1 ? ` = ${fr(p / g, 100 / g)}$（分子分母同除以 $${g}$）。` : "$，已经是最简分数。"}`,
          ),
        });
      },
    },
    {
      id: "fraction-to-percent",
      title: t("Fraction to percent", "分数化成百分数"),
      explanation: t(
        "To write a fraction as a percent, make an equivalent fraction with denominator $100$; the numerator is the percent. Multiply the numerator and denominator by the same number.\n\n$\\frac{3}{4} = \\frac{75}{100} = 75\\%$, multiplying the numerator and denominator by $25$.",
        "把分数化成百分数，就把它化成分母是 $100$ 的分数，分子就是百分数。分子分母要乘同一个数。\n\n$\\frac{3}{4} = \\frac{75}{100} = 75\\%$（分子分母同乘 $25$）。",
      ),
      generate(rng) {
        const { k, d, pct } = nicePercent(rng);
        return numberProblem({
          prompt: t(`Write $${fr(k, d)}$ as a percent.`, `把 $${fr(k, d)}$ 写成百分数。`),
          answer: pct,
          percent: true,
          form: "integer",
          wrong: [k, k * d, Math.round((d * 100) / k)].filter((w) => w !== pct),
          solution: t(
            `Multiply the numerator and denominator by $${100 / d}$: $${fr(k, d)} = ${fr(pct, 100)} = ${pct}\\%$.`,
            `分子分母同乘 $${100 / d}$：$${fr(k, d)} = ${fr(pct, 100)} = ${pct}\\%$。`,
          ),
        });
      },
    },
  ],
);

export const convertingBetweenPercentagesAndDecimals = topic(
  "converting-between-percentages-and-decimals",
  t("Converting Between Percentages and Decimals", "百分数与小数互化"),
  t(
    "Since percent means hundredths, divide by 100 to go from a percent to a decimal (45% = 0.45, 7% = 0.07) and multiply by 100 to go back (0.6 = 60%, 1.25 = 125%).",
    "百分数表示百分之几，所以百分数化小数要除以 100（45% = 0.45，7% = 0.07），小数化百分数要乘 100（0.6 = 60%，1.25 = 125%）。",
  ),
  ["understanding-percentages-using-models", "multiplying-decimals-by-powers-of-ten-using-decimal-point-placement"],
  ["6.RP.A.3c"],
  [
    {
      id: "percent-to-decimal",
      title: t("Percent to decimal", "百分数化成小数"),
      explanation: t(
        "A percent is a number of hundredths, so to write it as a decimal divide by $100$: move the decimal point two places to the left, writing zeros if needed.\n\n$45\\% = 0.45$, $7\\% = 0.07$ and $130\\% = 1.3$. Writing $7\\%$ as $0.7$ is a common mistake.",
        "百分数表示百分之几，所以化成小数就除以 $100$：小数点向左移动两位，位数不够时补 $0$。\n\n$45\\% = 0.45$，$7\\% = 0.07$，$130\\% = 1.3$。把 $7\\%$ 写成 $0.7$ 是常见的错误。",
      ),
      generate(rng) {
        const tenths = rng.pick([rng.int(1, 9) * 10, rng.int(11, 99) * 10, rng.int(101, 250) * 10, rng.int(10, 999)]);
        const pq = Q.of(tenths, 10);
        const v = pq.div(Q.of(100));
        const ps = dec(pq);
        return numberProblem({
          prompt: t(`Write $${ps}\\%$ as a decimal.`, `把 $${ps}\\%$ 写成小数。`),
          answer: v,
          form: "decimal",
          wrong: [v.mul(Q.of(10)), v.div(Q.of(10)), pq],
          solution: t(
            `Divide by $100$: move the decimal point two places to the left. $${ps}\\% = ${dec(v)}$.`,
            `除以 $100$，小数点向左移动两位：$${ps}\\% = ${dec(v)}$。`,
          ),
        });
      },
    },
    {
      id: "decimal-to-percent",
      title: t("Decimal to percent", "小数化成百分数"),
      explanation: t(
        "To write a decimal as a percent, multiply by $100$: move the decimal point two places to the right and add the percent sign.\n\n$0.6 = 60\\%$, $0.035 = 3.5\\%$ and $1.25 = 125\\%$. A number greater than $1$ is more than $100\\%$.",
        "把小数化成百分数，就乘 $100$：小数点向右移动两位，再添上百分号。\n\n$0.6 = 60\\%$，$0.035 = 3.5\\%$，$1.25 = 125\\%$。大于 $1$ 的数化成百分数后大于 $100\\%$。",
      ),
      generate(rng) {
        const n = rng.pick([rng.int(1, 9) * 10, rng.int(1, 99), rng.int(101, 250), rng.int(1, 99) * 10 + rng.int(1, 9)]);
        const p = rng.bool(0.25) ? 3 : 2;
        const v = Q.of(n, 10 ** p);
        const pct = v.mul(Q.of(100));
        return numberProblem({
          prompt: t(`Write $${dec(v)}$ as a percent.`, `把 $${dec(v)}$ 写成百分数。`),
          answer: pct,
          percent: true,
          form: "decimal",
          wrong: [pct.div(Q.of(10)), pct.mul(Q.of(10)), v],
          solution: t(
            `Multiply by $100$: move the decimal point two places to the right. $${dec(v)} = ${dec(pct)}\\%$.`,
            `乘 $100$，小数点向右移动两位：$${dec(v)} = ${dec(pct)}\\%$。`,
          ),
        });
      },
    },
  ],
);

/** Rep is a number written as a fraction, a decimal or a percent. */
interface Rep {
  readonly v: Q;
  readonly latex: string;
}

/** asPercent writes a number in math mode followed by its value as a percent, unless it is already a percent. */
const asPercent = (r: Rep) => (r.latex.endsWith("\\%") ? `$${r.latex}$` : `$${r.latex} = ${dec(r.v.mul(Q.of(100)))}\\%$`);

/** randomRep writes a value with a whole-number percent as a fraction, decimal or percent. */
function randomRep(pct: number, form: number): Rep {
  const v = Q.of(pct, 100);
  if (form === 0) return { v, latex: `${pct}\\%` };
  if (form === 1) return { v, latex: dec(v) };
  return { v, latex: v.toLatex() };
}

export const comparingFractionsPercentsAndDecimals = topic(
  "comparing-fractions-percents-and-decimals",
  t("Comparing Fractions, Percents, and Decimals", "比较分数、百分数和小数"),
  t(
    "To compare numbers written in different forms, write them all in the same form, for example as percents: 3/5 = 60%, 0.58 = 58%, so 3/5 > 0.58 > 55%.",
    "比较不同形式的数，先把它们化成同一种形式，例如都化成百分数：3/5 = 60%，0.58 = 58%，所以 3/5 > 0.58 > 55%。",
  ),
  ["converting-between-percentages-and-fractions", "converting-between-percentages-and-decimals"],
  ["6.RP.A.3c"],
  [
    {
      id: "comparing-two-forms",
      title: t("Comparing two numbers", "比较两个数"),
      explanation: t(
        "To compare numbers written in different forms, first write them in the same form, such as both as percents or both as decimals, then compare.\n\n$\\frac{2}{5}$ or $38\\%$? $\\frac{2}{5} = \\frac{40}{100} = 40\\%$, and $40\\% > 38\\%$, so $\\frac{2}{5}$ is greater.",
        "比较不同形式的数时，先把它们化成同一种形式，比如都化成百分数或都化成小数，再比较。\n\n$\\frac{2}{5}$ 与 $38\\%$：$\\frac{2}{5} = \\frac{40}{100} = 40\\%$，$40\\% > 38\\%$，所以 $\\frac{2}{5}$ 大。",
      ),
      generate(rng) {
        const { pct } = nicePercent(rng);
        const other = pct + rng.pick([-6, -3, -1, 0, 1, 3, 6]);
        const [fa, fb] = rng.shuffle([0, 1, 2]) as [number, number];
        const a = randomRep(pct, fa === 0 && fb === 0 ? 2 : fa);
        const b = randomRep(Math.max(1, Math.min(99, other)), fb);
        const rel = a.v.cmp(b.v) + 1;
        const sym = ["<", "=", ">"][rel]!;
        return compareProblem(
          a.latex,
          b.latex,
          rel,
          t(
            `Compare them as percents: ${asPercent(a)} and ${asPercent(b)}. So $${a.latex} ${sym} ${b.latex}$.`,
            `都用百分数比较：${asPercent(a)}，${asPercent(b)}。所以 $${a.latex} ${sym} ${b.latex}$。`,
          ),
        );
      },
    },
    {
      id: "finding-the-greatest",
      title: t("Finding the greatest", "找出最大的数"),
      explanation: t(
        "To find the greatest of several numbers in different forms, write all of them in one form and compare.\n\nAmong $0.7$, $\\frac{3}{4}$ and $72\\%$: they are $70\\%$, $75\\%$ and $72\\%$, so $\\frac{3}{4}$ is the greatest.",
        "在几个不同形式的数中找最大的，先把它们都化成同一种形式，再比较。\n\n$0.7$、$\\frac{3}{4}$、$72\\%$ 分别是 $70\\%$、$75\\%$、$72\\%$，所以 $\\frac{3}{4}$ 最大。",
      ),
      generate(rng) {
        const { pct } = nicePercent(rng);
        const ps = [pct, ...rng.sample([-7, -5, -4, -2, -1, 1, 2, 4], 3).map((d) => pct + d)].map((p) => Math.max(1, Math.min(99, p)));
        if (new Set(ps).size < 4) return this.generate(rng);
        const reps = ps.map((p, i) => randomRep(p, i === 0 ? 2 : rng.int(0, 1)));
        const max = reps.reduce((m, r) => (r.v.cmp(m.v) > 0 ? r : m));
        const opts = rng.shuffle(reps);
        return choiceProblem({
          prompt: t(
            `Which number is the greatest: ${reps.map((r) => `$${r.latex}$`).join(", ")}?`,
            `${reps.map((r) => `$${r.latex}$`).join("、")}中哪个数最大？`,
          ),
          options: opts.map((r) => mathText(r.latex)),
          correct: opts.indexOf(max),
          solution: t(
            `As percents: ${opts.map(asPercent).join(", ")}. The greatest is $${max.latex}$.`,
            `化成百分数：${opts.map(asPercent).join("，")}。最大的是 $${max.latex}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Solving problems with percentages

/** percentWhole draws a whole number and a whole-number percent of it with a whole-number part. */
function percentWhole(rng: Rng, easy: boolean): { whole: number; pct: number; part: number } {
  for (;;) {
    const pct = easy ? rng.pick([10, 20, 25, 50, 75]) : rng.int(1, 19) * 5 + (rng.bool(0.3) ? rng.int(-2, 2) : 0);
    const whole = easy ? rng.int(1, 30) * 4 * 5 : rng.int(2, 60) * 10;
    const part = (pct * whole) / 100;
    if (Number.isInteger(part) && pct > 0 && pct < 100) return { whole, pct, part };
  }
}

export const findingAPercentageGivenTwoNumbers = topic(
  "finding-a-percentage-given-two-numbers",
  t("Finding a Percentage Given Two Numbers", "求一个数是另一个数的百分之几"),
  t(
    "To find what percent a part is of a whole, write the fraction part/whole and convert it to a percent: 12 out of 40 is 12/40 = 30/100 = 30%.",
    "求部分是整体的百分之几，先写出分数“部分/整体”，再化成百分数：40 中的 12 是 12/40 = 30/100 = 30%。",
  ),
  ["converting-between-percentages-and-fractions"],
  ["6.RP.A.3c"],
  [
    {
      id: "percent-of-a-small-whole",
      title: t("Wholes that divide 100", "整体能整除 100"),
      explanation: t(
        "To find what percent one number is of another, write the part over the whole as a fraction, then rewrite it with denominator $100$. The part goes on top.\n\n$7$ out of $20$: $\\frac{7}{20} = \\frac{35}{100} = 35\\%$, multiplying both by $5$.",
        "求一个数是另一个数的百分之几，先把部分比整体写成分数，再化成分母是 $100$ 的分数。部分作分子。\n\n$20$ 中的 $7$：$\\frac{7}{20} = \\frac{35}{100} = 35\\%$（分子分母同乘 $5$）。",
      ),
      generate(rng) {
        const whole = rng.pick([2, 4, 5, 10, 20, 25, 50]);
        const part = rng.int(1, whole - 1);
        const pct = (part * 100) / whole;
        return numberProblem({
          prompt: t(`What percent of $${whole}$ is $${part}$?`, `$${part}$ 是 $${whole}$ 的百分之几？`),
          answer: pct,
          percent: true,
          form: "integer",
          wrong: [part, (whole * 100) / part, 100 - pct].map((w) => Math.round(w)),
          solution: t(
            `$${fr(part, whole)} = ${fr(pct, 100)} = ${pct}\\%$, multiplying the numerator and denominator by $${100 / whole}$.`,
            `$${fr(part, whole)} = ${fr(pct, 100)} = ${pct}\\%$（分子分母同乘 $${100 / whole}$）。`,
          ),
        });
      },
    },
    {
      id: "percent-of-a-larger-whole",
      title: t("Larger wholes", "较大的整体"),
      explanation: t(
        "Write the part over the whole. If the denominator does not divide $100$, simplify the fraction first, then rewrite it out of $100$.\n\n$12$ out of $40$: $\\frac{12}{40} = \\frac{3}{10} = \\frac{30}{100} = 30\\%$.",
        "把部分比整体写成分数。如果分母不能整除 $100$，先约分，再化成分母是 $100$ 的分数。\n\n$40$ 中的 $12$：$\\frac{12}{40} = \\frac{3}{10} = \\frac{30}{100} = 30\\%$。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, false);
        if (100 % whole === 0) return this.generate(rng);
        const g = gcd(part, whole);
        return numberProblem({
          prompt: t(`What percent of $${whole}$ is $${part}$?`, `$${part}$ 是 $${whole}$ 的百分之几？`),
          answer: pct,
          percent: true,
          form: "integer",
          wrong: [part, 100 - pct, Math.round((whole * 100) / part)],
          solution: t(
            `$${fr(part, whole)} = ${fr(part / g, whole / g)} = ${fr(pct, 100)} = ${pct}\\%$.`,
            `$${fr(part, whole)} = ${fr(part / g, whole / g)} = ${fr(pct, 100)} = ${pct}\\%$。`,
          ),
        });
      },
    },
  ],
);

export const findingPartOfANumberGivenAWholeAndAPercentage = topic(
  "finding-part-of-a-number-given-a-whole-and-a-percentage",
  t("Finding Part of a Number Given a Whole and a Percentage", "求一个数的百分之几"),
  t(
    "To find p% of a number, multiply the number by p/100. 10% of a number is one tenth of it, 25% is one quarter and 50% is half: 30% of 80 is 3 × 8 = 24.",
    "求一个数的 p%，就用这个数乘 p/100。一个数的 10% 是它的十分之一，25% 是四分之一，50% 是一半：80 的 30% 是 3 × 8 = 24。",
  ),
  ["converting-between-percentages-and-fractions", "multiplying-fractions-by-whole-numbers"],
  ["6.RP.A.3c"],
  [
    {
      id: "benchmark-percents-of-a-number",
      title: t("Benchmark percents", "常用百分数"),
      explanation: t(
        "Some percents are simple fractions: $50\\%$ is $\\frac{1}{2}$, $25\\%$ is $\\frac{1}{4}$, $10\\%$ is $\\frac{1}{10}$. Use the fraction to find that percent of a number quickly.\n\n$25\\%$ of $80$ is $\\frac{1}{4}$ of $80$, which is $20$. $75\\%$ of $80$ is three times that: $60$.",
        "有些百分数就是简单的分数：$50\\%$ 是 $\\frac{1}{2}$，$25\\%$ 是 $\\frac{1}{4}$，$10\\%$ 是 $\\frac{1}{10}$。用这些分数可以很快求出一个数的百分之几。\n\n$80$ 的 $25\\%$ 是 $80$ 的 $\\frac{1}{4}$，即 $20$；$80$ 的 $75\\%$ 是它的 $3$ 倍：$60$。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, true);
        const g = gcd(pct, 100);
        return numberProblem({
          prompt: t(`What is $${pct}\\%$ of $${whole}$?`, `$${whole}$ 的 $${pct}\\%$ 是多少？`),
          answer: part,
          form: "integer",
          wrong: [whole - part, whole / pct, pct, whole * pct].filter((w) => Number.isInteger(w)),
          solution: t(
            `$${pct}\\% = ${fr(pct / g, 100 / g)}$, and $${fr(pct / g, 100 / g)} \\times ${whole} = ${part}$.`,
            `$${pct}\\% = ${fr(pct / g, 100 / g)}$，$${fr(pct / g, 100 / g)} \\times ${whole} = ${part}$。`,
          ),
        });
      },
    },
    {
      id: "any-percent-of-a-number",
      title: t("Any percent", "任意百分数"),
      explanation: t(
        "To find any percent of a number, multiply the number by the percent written as a fraction over $100$. You can also build it from $10\\%$ and $5\\%$.\n\n$35\\%$ of $60$: $10\\%$ of $60$ is $6$ and $5\\%$ is $3$, so $35\\%$ is $3 \\times 6 + 3 = 21$. Or $\\frac{35}{100} \\times 60 = 21$.",
        "求一个数的百分之几，用这个数乘写成分母为 $100$ 的分数。也可以用 $10\\%$ 和 $5\\%$ 来拼。\n\n$60$ 的 $35\\%$：$10\\%$ 是 $6$，$5\\%$ 是 $3$，所以 $35\\%$ 是 $3 \\times 6 + 3 = 21$。也可以算 $\\frac{35}{100} \\times 60 = 21$。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, false);
        return numberProblem({
          prompt: t(`What is $${pct}\\%$ of $${whole}$?`, `$${whole}$ 的 $${pct}\\%$ 是多少？`),
          answer: part,
          form: "integer",
          wrong: [whole - part, part * 10, Math.round(part / 10)],
          solution: t(
            `$${fr(pct, 100)} \\times ${whole} = \\frac{${pct * whole}}{100} = ${part}$.`,
            `$${fr(pct, 100)} \\times ${whole} = \\frac{${pct * whole}}{100} = ${part}$。`,
          ),
        });
      },
    },
  ],
);

export const findingATotalGivenAPartAndAPercentage = topic(
  "finding-a-total-given-a-part-and-a-percentage",
  t("Finding a Total Given a Part and a Percentage", "已知一个数的百分之几求这个数"),
  t(
    "If 12 is 25% of a number, then 1% of the number is 12 ÷ 25 and the whole 100% is 100 times that: 48. Equivalently, divide the part by the percent written as a fraction: 12 ÷ 1/4 = 48.",
    "如果 12 是某数的 25%，那么该数的 1% 是 12 ÷ 25，100% 是它的 100 倍：48。也可以用部分除以百分数对应的分数：12 ÷ 1/4 = 48。",
  ),
  ["finding-part-of-a-number-given-a-whole-and-a-percentage"],
  ["6.RP.A.3c"],
  [
    {
      id: "total-from-a-benchmark-percent",
      title: t("Benchmark percents", "常用百分数"),
      explanation: t(
        "When a part and its percent are known, work back to $100\\%$. If the percent is a simple fraction of the whole, multiply the part by the number of those fractions in a whole.\n\n$15$ is $25\\%$ of what? $25\\%$ is a quarter, and four quarters make the whole, so the whole is $4 \\times 15 = 60$.",
        "已知部分和它所占的百分数，要倒推出 $100\\%$。如果这个百分数是整体的一个简单分数，就用部分乘整体中含有这种分数的个数。\n\n$15$ 是多少的 $25\\%$？$25\\%$ 是四分之一，四个四分之一是整体，所以整体是 $4 \\times 15 = 60$。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, true);
        return numberProblem({
          prompt: t(`$${part}$ is $${pct}\\%$ of what number?`, `$${part}$ 是哪个数的 $${pct}\\%$？`),
          answer: whole,
          form: "integer",
          wrong: [(part * pct) / 100, part + pct, whole / 2].filter((w) => Number.isInteger(w)),
          solution: t(
            `$${pct}\\% = ${fr(pct / gcd(pct, 100), 100 / gcd(pct, 100))}$, so the number is $${part} \\div ${fr(pct / gcd(pct, 100), 100 / gcd(pct, 100))} = ${whole}$.`,
            `$${pct}\\% = ${fr(pct / gcd(pct, 100), 100 / gcd(pct, 100))}$，所以这个数是 $${part} \\div ${fr(pct / gcd(pct, 100), 100 / gcd(pct, 100))} = ${whole}$。`,
          ),
        });
      },
    },
    {
      id: "total-from-any-percent",
      title: t("Any percent", "任意百分数"),
      explanation: t(
        "Divide the part to find a small percent such as $1\\%$ or $5\\%$, then multiply up to $100\\%$. Multiplying the part by the percent instead gives a smaller number, which cannot be the whole.\n\n$21$ is $35\\%$ of what? $35\\%$ is $21$, so $5\\%$ is $21 \\div 7 = 3$ and $100\\%$ is $20 \\times 3 = 60$.",
        "先用部分除以合适的数，求出 $1\\%$ 或 $5\\%$ 这样的小百分数，再乘到 $100\\%$。如果用部分乘百分数，得数会更小，不可能是整体。\n\n$21$ 是多少的 $35\\%$？$35\\%$ 是 $21$，所以 $5\\%$ 是 $21 \\div 7 = 3$，$100\\%$ 是 $20 \\times 3 = 60$。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, false);
        const g = gcd(pct, 100);
        return numberProblem({
          prompt: t(`$${part}$ is $${pct}\\%$ of what number?`, `$${part}$ 是哪个数的 $${pct}\\%$？`),
          answer: whole,
          form: "integer",
          wrong: [Math.round((part * pct) / 100), part + pct, whole * 2],
          solution: t(
            pct / g === 1
              ? `$${pct}\\% = ${fr(1, 100 / g)}$, so $${part}$ is one of $${100 / g}$ equal parts of the number: $${100 / g} \\times ${part} = ${whole}$.`
              : `$${pct}\\% = ${fr(pct / g, 100 / g)}$: $${pct / g}$ of the $${100 / g}$ equal parts make $${part}$, so one part is $${part} \\div ${pct / g} = ${dec(Q.of(part, pct / g))}$ and the whole is $${100 / g} \\times ${dec(Q.of(part, pct / g))} = ${whole}$.`,
            pct / g === 1
              ? `$${pct}\\% = ${fr(1, 100 / g)}$，所以 $${part}$ 是这个数的 $${100 / g}$ 等份中的一份：$${100 / g} \\times ${part} = ${whole}$。`
              : `$${pct}\\% = ${fr(pct / g, 100 / g)}$：$${100 / g}$ 等份中的 $${pct / g}$ 份是 $${part}$，每份是 $${part} \\div ${pct / g} = ${dec(Q.of(part, pct / g))}$，整体是 $${100 / g} \\times ${dec(Q.of(part, pct / g))} = ${whole}$。`,
          ),
        });
      },
    },
  ],
);

export const findingAPercentageGivenTwoNumbersWordProblems = topic(
  "finding-a-percentage-given-two-numbers-word-problems",
  t("Finding a Percentage Given Two Numbers: Word Problems", "求百分之几的应用题"),
  t(
    "Identify the whole (what the part is “out of”) and the part, then convert part/whole to a percent. A student who answers 18 of 24 questions correctly scores 18/24 = 3/4 = 75%.",
    "先找出整体（“在多少之中”）和部分，再把“部分/整体”化成百分数。学生 24 道题答对 18 道，正确率是 18/24 = 3/4 = 75%。",
  ),
  ["finding-a-percentage-given-two-numbers"],
  ["6.RP.A.3c"],
  [
    {
      id: "test-score-percent",
      title: t("Scores and results", "得分与结果"),
      explanation: t(
        "A score as a percent is the number correct over the number possible, rewritten out of $100$. Simplify first if that helps.\n\n$18$ correct out of $24$: $\\frac{18}{24} = \\frac{3}{4} = \\frac{75}{100} = 75\\%$.",
        "把成绩写成百分数，就用答对的数比总数，再化成分母是 $100$ 的分数。能约分时先约分。\n\n$24$ 题中答对 $18$ 题：$\\frac{18}{24} = \\frac{3}{4} = \\frac{75}{100} = 75\\%$。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, rng.bool());
        if (whole > 200) return this.generate(rng);
        const g = gcd(part, whole);
        const name = rng.pick(["Maya", "Leo", "Nora", "Sam", "Iris"]);
        return numberProblem({
          prompt: t(
            `${name} made ${part} of ${whole} free throws. What percent of the free throws did ${name} make?`,
            `${name} 投了 ${whole} 次罚球，投中 ${part} 次。投中的次数占百分之几？`,
          ),
          answer: pct,
          percent: true,
          form: "integer",
          wrong: [100 - pct, part, Math.round((whole * 100) / part)],
          solution: t(
            `$${fr(part, whole)} = ${fr(part / g, whole / g)} = ${pct}\\%$.`,
            `$${fr(part, whole)} = ${fr(part / g, whole / g)} = ${pct}\\%$。`,
          ),
        });
      },
    },
    {
      id: "percent-of-the-rest",
      title: t("Finding the whole first", "先求整体"),
      explanation: t(
        "A class has $12$ boys and $13$ girls. The girls are $\\frac{13}{25} = 52\\%$ of the class: the whole is $12 + 13 = 25$, not $12$.",
        "一个班有男生 $12$ 名、女生 $13$ 名。女生占全班的 $\\frac{13}{25} = 52\\%$：整体是 $12 + 13 = 25$，不是 $12$。",
      ),
      generate(rng) {
        const whole = rng.pick([20, 25, 40, 50]);
        const a = rng.int(1, whole - 1);
        const b = whole - a;
        const pct = (b * 100) / whole;
        if (!Number.isInteger(pct)) return this.generate(rng);
        return numberProblem({
          prompt: t(
            `A club has ${a} members who play the piano and ${b} who play the guitar. Each member plays exactly one of them. What percent of the members play the guitar?`,
            `一个社团中有 ${a} 名成员弹钢琴，${b} 名成员弹吉他，每人只弹其中一种。弹吉他的成员占百分之几？`,
          ),
          answer: pct,
          percent: true,
          form: "integer",
          wrong: [100 - pct, Math.round((b * 100) / a), b],
          solution: t(
            `There are $${a} + ${b} = ${whole}$ members. $${fr(b, whole)} = ${fr(pct, 100)} = ${pct}\\%$.`,
            `共 $${a} + ${b} = ${whole}$ 名成员。$${fr(b, whole)} = ${fr(pct, 100)} = ${pct}\\%$。`,
          ),
        });
      },
    },
  ],
);

export const findingPartOfANumberGivenAWholeAndAPercentageWordProblems = topic(
  "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems",
  t("Finding Part of a Number Given a Whole and a Percentage: Word Problems", "求一个数的百分之几的应用题"),
  t(
    "In a word problem, find the whole and the percent, then multiply. If 40% of 30 students walk to school, 12 walk, and the other 60%, or 18 students, do not.",
    "应用题中先找出整体与百分数，再相乘。30 名学生中 40% 步行上学，就是 12 人；其余 60%，即 18 人，不步行上学。",
  ),
  ["finding-part-of-a-number-given-a-whole-and-a-percentage"],
  ["6.RP.A.3c"],
  [
    {
      id: "part-of-a-group",
      title: t("Part of a group", "一组中的一部分"),
      explanation: t(
        "To find how many in a group have some property, multiply the group size by the percent written over $100$.\n\n$40\\%$ of $30$ students walk: $\\frac{40}{100} \\times 30 = 12$ students.",
        "求一群中具有某种特点的有多少，就用总数乘写成分母为 $100$ 的百分数。\n\n$30$ 名学生中 $40\\%$ 步行：$\\frac{40}{100} \\times 30 = 12$ 名。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, rng.bool());
        return numberProblem({
          prompt: t(
            `A school has ${whole} students, and ${pct}% of them take the bus. How many students take the bus?`,
            `一所学校有 ${whole} 名学生，其中 ${pct}% 乘校车。乘校车的学生有多少名？`,
          ),
          answer: part,
          form: "integer",
          wrong: [whole - part, pct, Math.round(whole / pct)],
          solution: t(`$${fr(pct, 100)} \\times ${whole} = ${part}$ students.`, `$${fr(pct, 100)} \\times ${whole} = ${part}$ 名。`),
        });
      },
    },
    {
      id: "the-rest-of-a-group",
      title: t("The rest of a group", "其余部分"),
      explanation: t(
        "The whole group is $100\\%$. If a question asks about those who do not have the property, subtract the percent from $100\\%$ first, then take that percent of the group.\n\nIf $40\\%$ of $30$ students walk, the other $60\\%$ do not: $\\frac{60}{100} \\times 30 = 18$ students.",
        "整个群体是 $100\\%$。如果问的是不具有这个特点的有多少，就先用 $100\\%$ 减去这个百分数，再求总数的百分之几。\n\n$30$ 名学生中 $40\\%$ 步行，其余 $60\\%$ 不步行：$\\frac{60}{100} \\times 30 = 18$ 名。",
      ),
      generate(rng) {
        const { whole, pct, part } = percentWhole(rng, rng.bool());
        const rest = whole - part;
        return numberProblem({
          prompt: t(
            `A store has ${whole} shirts, and ${pct}% of them are on sale. How many shirts are not on sale?`,
            `一家商店有 ${whole} 件衬衫，其中 ${pct}% 在打折。不打折的衬衫有多少件？`,
          ),
          answer: rest,
          form: "integer",
          wrong: [part, 100 - pct, whole - pct],
          solution: t(
            `$100\\% - ${pct}\\% = ${100 - pct}\\%$ are not on sale: $${fr(100 - pct, 100)} \\times ${whole} = ${rest}$.`,
            `不打折的占 $100\\% - ${pct}\\% = ${100 - pct}\\%$：$${fr(100 - pct, 100)} \\times ${whole} = ${rest}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Unit conversions using long division

export const convertingUnitsOfLengthToLargerUnitsUsingLongDivision = topic(
  "converting-units-of-length-to-larger-units-using-long-division",
  t("Converting Units of Length to Larger Units Using Long Division", "用长除法把长度单位化成较大单位"),
  t(
    "To convert a large number of small units, divide by the conversion factor with long division. The quotient is the number of larger units and the remainder is what is left in smaller units: 1,000 inches ÷ 12 = 83 R 4, so 1,000 in = 83 ft 4 in = 83 1/3 ft.",
    "把较多的小单位化成大单位，用长除法除以进率。商是大单位的个数，余数是剩下的小单位：1000 ÷ 12 = 83 余 4，所以 1000 英寸 = 83 英尺 4 英寸 = 83 1/3 英尺。",
  ),
  ["converting-customary-units-of-length-to-larger-units", "multi-digit-by-two-digit-division-using-partial-quotients"],
  ["6.RP.A.3d"],
  [
    {
      id: "quotient-and-remainder-units",
      title: t("Larger and smaller units", "大单位与小单位"),
      explanation: t(
        "To change to a larger unit, divide by the conversion factor using long division. The quotient is the number of larger units and the remainder is what is left in the smaller unit.\n\n$1{,}000$ in: $1{,}000 \\div 12 = 83 \\text{ R } 4$, so it is $83$ ft $4$ in.",
        "换成较大的单位时，用竖式除以进率。商是大单位的个数，余数是剩下的小单位的个数。\n\n$1000$ 英寸：$1000 \\div 12 = 83\\cdots\\cdots 4$，所以是 $83$ 英尺 $4$ 英寸。",
      ),
      generate(rng) {
        const c = rng.pick([
          { big: t("feet", "英尺"), small: t("inches", "英寸"), f: 12 },
          { big: t("yards", "码"), small: t("feet", "英尺"), f: 3 },
          { big: t("yards", "码"), small: t("inches", "英寸"), f: 36 },
          { big: t("miles", "英里"), small: t("yards", "码"), f: 1760 },
        ]);
        const n = c.f >= 1000 ? rng.int(2000, 9999) : rng.int(200, 2999);
        if (n % c.f === 0) return this.generate(rng);
        const q = Math.floor(n / c.f);
        const r = n % c.f;
        const opt = (a: number, b: number) => t(`${a} ${c.big.en} ${b} ${c.small.en}`, `${a} ${c.big["zh-CN"]} ${b} ${c.small["zh-CN"]}`);
        return pickChoice(
          rng,
          t(
            `Write $${n.toLocaleString("en-US").replace(/,/g, "{,}")}$ ${c.small.en} in ${c.big.en} and ${c.small.en}.`,
            `把 $${n}$ ${c.small["zh-CN"]}写成几${c.big["zh-CN"]}几${c.small["zh-CN"]}。`,
          ),
          opt(q, r),
          [opt(q, r + 1), opt(q - 1, r), opt(q + 1, r), opt(q, c.f - r)],
          t(
            `There are $${c.f}$ ${c.small.en} in $1$ ${c.big.en.replace(/s$/, "").replace("feet", "foot")}. Long division: $${n} \\div ${c.f} = ${q}$ R $${r}$. So it is ${q} ${c.big.en} ${r} ${c.small.en}.`,
            `$1$ ${c.big["zh-CN"]} $= ${c.f}$ ${c.small["zh-CN"]}。长除法：$${n} \\div ${c.f} = ${q}$ 余 $${r}$。所以是 ${q} ${c.big["zh-CN"]} ${r} ${c.small["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "converting-to-a-mixed-number-of-larger-units",
      title: t("Writing the result as a mixed number", "把结果写成带分数"),
      explanation: t(
        "To write the result as a mixed number, keep the quotient as the whole part and write the remainder as a fraction of one larger unit: remainder over the conversion factor, simplified.\n\n$1{,}000$ in $= 83$ ft $4$ in, and $4$ in is $\\frac{4}{12} = \\frac{1}{3}$ ft, so $1{,}000$ in $= 83\\frac{1}{3}$ ft.",
        "把结果写成带分数时，商作整数部分，余数写成一个大单位的几分之几：余数比进率，再约分。\n\n$1000$ 英寸 $= 83$ 英尺 $4$ 英寸，$4$ 英寸是 $\\frac{4}{12} = \\frac{1}{3}$ 英尺，所以 $1000$ 英寸 $= 83\\frac{1}{3}$ 英尺。",
      ),
      generate(rng) {
        const c = rng.pick([
          { big: t("feet", "英尺"), small: t("inches", "英寸"), f: 12 },
          { big: t("yards", "码"), small: t("feet", "英尺"), f: 3 },
          { big: t("yards", "码"), small: t("inches", "英寸"), f: 36 },
        ]);
        const n = rng.int(200, 2999);
        if (n % c.f === 0) return this.generate(rng);
        const v = Q.of(n, c.f);
        const q = Math.floor(n / c.f);
        const r = n % c.f;
        return numberProblem({
          prompt: t(
            `Write $${n}$ ${c.small.en} in ${c.big.en}, as a mixed number.`,
            `把 $${n}$ ${c.small["zh-CN"]}写成以${c.big["zh-CN"]}为单位的带分数。`,
          ),
          answer: v,
          form: "mixed",
          wrong: [Q.of(q), Q.of(q).add(Q.of(r, 10)), Q.of(n * c.f)],
          solution: t(
            `$${n} \\div ${c.f} = ${q}$ R $${r}$, and $${r}$ ${c.small.en} is $${fr(r, c.f)}$ of one. So $${n}$ ${c.small.en} $= ${mixedLatex(v)}$ ${c.big.en}.`,
            `$${n} \\div ${c.f} = ${q}$ 余 $${r}$，$${r}$ ${c.small["zh-CN"]}是 $${fr(r, c.f)}$ ${c.big["zh-CN"]}。所以 $${n}$ ${c.small["zh-CN"]} $= ${mixedLatex(v)}$ ${c.big["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
);

/** grade6RatioTopics lists the 6th grade topics on ratios, rates, percentages and unit conversions. */
export const grade6RatioTopics: readonly TopicDef[] = [
  equivalentRatios,
  writingRatiosUsingFractions,
  comparingRatios,
  approximatingRatios,
  reasoningWithEquivalentRatios,
  furtherReasoningWithEquivalentRatios,
  ratioTables,
  graphingRatios,
  tapeDiagrams,
  solvingProblemsUsingUnitRates,
  speedAsAUnitRate,
  understandingPercentagesUsingModels,
  convertingBetweenPercentagesAndFractions,
  convertingBetweenPercentagesAndDecimals,
  comparingFractionsPercentsAndDecimals,
  findingAPercentageGivenTwoNumbers,
  findingPartOfANumberGivenAWholeAndAPercentage,
  findingATotalGivenAPartAndAPercentage,
  findingAPercentageGivenTwoNumbersWordProblems,
  findingPartOfANumberGivenAWholeAndAPercentageWordProblems,
  convertingUnitsOfLengthToLargerUnitsUsingLongDivision,
];
