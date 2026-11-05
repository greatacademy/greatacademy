import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

// Precalculus unit 12: Statistics, modules 12.41 (Analyzing Data), 12.42
// (Correlation) and 12.43 (Regression). The topics of these modules that
// Algebra I already teaches (the mean, scatter plots, trend lines and their
// predictions and coefficients, linear correlation, correlation and
// causation, and selecting a regression model) are shared with that course.

/** sum adds numbers. */
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/** qsum adds rational numbers. */
const qsum = (xs: readonly Q[]) => xs.reduce((a, b) => a.add(b), Q.zero);

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** rounded rounds a value to the given number of decimal places, or is undefined when it lies too close to a rounding boundary. */
function rounded(value: number, places: number): Q | undefined {
  const scaled = Math.abs(value) * 10 ** places;
  if (!Number.isFinite(scaled) || Math.abs(scaled - Math.floor(scaled) - 0.5) < 0.02) return undefined;
  return Q.of(Math.round(value * 10 ** places), 10 ** places);
}

/** defined keeps the values that are defined. */
const defined = (...vs: readonly (Q | undefined)[]): Q[] => vs.filter((v): v is Q => v !== undefined);

/** terminating says whether a rational number has a terminating decimal expansion. */
function terminating(v: Q): boolean {
  let d = v.d;
  for (const p of [2n, 5n]) while (d % p === 0n) d /= p;
  return d === 1n;
}

/** show writes a number as a decimal when it terminates, otherwise as a fraction. */
const show = (v: Q) => (terminating(v) ? dec(v) : v.toLatex());

/** decimalForm asks for a decimal answer when the answer is not an integer. */
const decimalForm = (v: Q) => (v.isInteger() ? {} : { form: "decimal" as const });

/** paren wraps a negative number in parentheses. */
const paren = (s: string) => (s.startsWith("-") ? `(${s})` : s);

/** signed writes "+ v" or "- |v|" for a term after the first. */
const signed = (v: Q) => (v.sign() < 0 ? `- ${dec(v.abs())}` : `+ ${dec(v)}`);

/** coef writes a decimal coefficient in front of a variable, dropping a 1. */
const coef = (v: Q) => (v.eq(Q.one) ? "" : v.eq(Q.one.neg()) ? "-" : dec(v));

/** signedTerm writes "+ vx" or "- |v|x" for a term after the first, dropping a unit coefficient. */
const signedTerm = (v: Q, x: string) => `${v.sign() < 0 ? "-" : "+"} ${coef(v.abs())}${x}`;

/** oneOf builds a multiple-choice problem from a right option and up to three distinct wrong ones. */
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

/** table writes a table with a header row and further rows; each row starts with its label. */
function table(head: readonly string[], ...rows: readonly (readonly string[])[]): string {
  const line = (r: readonly string[]) => `| ${r.join(" | ")} |`;
  return [line(head), `|${head.map(() => " :---: |").join("")}`, ...rows.map(line)].join("\n");
}

/** math wraps each entry in inline math. */
const m = (xs: readonly (number | string)[]) => xs.map((x) => `$${x}$`);

/** dataWithMean draws n integers from lo to hi whose mean is an integer. */
function dataWithMean(rng: Rng, n: number, lo: number, hi: number): number[] {
  for (;;) {
    const xs = Array.from({ length: n - 1 }, () => rng.int(lo, hi));
    const mean = rng.int(Math.ceil((sum(xs) + lo) / n), Math.floor((sum(xs) + hi) / n));
    const last = n * mean - sum(xs);
    if (last < lo || last > hi) continue;
    const all = [...xs, last];
    if (new Set(all).size < 3) continue;
    return all;
  }
}

/** squaredDeviations is the sum of the squared deviations of integer data from their integer mean. */
const squaredDeviations = (xs: readonly number[], mean: number) => sum(xs.map((x) => (x - mean) ** 2));

/** devLine writes (x1 - mean)^2 + (x2 - mean)^2 + … */
const devLine = (xs: readonly number[], mean: number) => xs.map((x) => `(${x} - ${paren(String(mean))})^2`).join(" + ");

/** sqLine writes the squared deviations as numbers: 4 + 1 + 0 + … */
const sqLine = (xs: readonly number[], mean: number) => xs.map((x) => (x - mean) ** 2).join(" + ");

// ─── Module 12.41: Analyzing Data ───────────────────────────────────────────

/** SampleScene is a setting for questions about populations and samples. */
interface SampleScene {
  /** members counts the members: "students" / "名学生". */
  readonly members: readonly [string, string];
  /** where says where the population lives: "at a high school" / "某高中的". */
  readonly where: readonly [string, string];
  /** strata are the groups used for stratified samples: "grades" / "年级". */
  readonly strata: readonly [string, string];
  /** clusters are the groups used for cluster samples: "classes" / "班级". */
  readonly clusters: readonly [string, string];
  /** easy is how a convenience sample is reached: "arrive at school first" / "最早到校". */
  readonly easy: readonly [string, string];
  /** trait is what is counted: "walk to school" / "步行上学". */
  readonly trait: readonly [string, string];
  /** wider is a group larger than the population: "all students in the country" / "全国所有学生". */
  readonly wider: readonly [string, string];
}

const sampleScenes: readonly SampleScene[] = [
  {
    members: ["students", "名学生"],
    where: ["at a high school", "某高中的"],
    strata: ["grades", "年级"],
    clusters: ["homerooms", "班级"],
    easy: ["arrive at school first", "最早到校"],
    trait: ["walk to school", "步行上学"],
    wider: ["all high school students in the country", "全国所有高中生"],
  },
  {
    members: ["employees", "名员工"],
    where: ["at a company", "某公司的"],
    strata: ["departments", "部门"],
    clusters: ["office floors", "办公楼层"],
    easy: ["sit nearest the researcher's desk", "坐得离研究员最近"],
    trait: ["work from home at least once a week", "每周至少在家办公一次"],
    wider: ["all workers in the city", "全市所有在职人员"],
  },
  {
    members: ["residents", "位居民"],
    where: ["in a town", "某镇的"],
    strata: ["age groups", "年龄段"],
    clusters: ["streets", "街道"],
    easy: ["visit the library on Monday", "周一去图书馆"],
    trait: ["support a new park", "支持新建公园"],
    wider: ["all residents of the state", "全州所有居民"],
  },
  {
    members: ["members", "名会员"],
    where: ["of a sports club", "某体育俱乐部的"],
    strata: ["membership levels", "会员等级"],
    clusters: ["training groups", "训练小组"],
    easy: ["answer the club's online post", "回复俱乐部网上帖子"],
    trait: ["train more than three times a week", "每周训练超过三次"],
    wider: ["all people who play sports", "所有参加运动的人"],
  },
  {
    members: ["customers", "位顾客"],
    where: ["of a bookstore this month", "本月某书店的"],
    strata: ["loyalty-card tiers", "会员卡等级"],
    clusters: ["shopping days", "营业日"],
    easy: ["pass the front door at noon", "中午经过店门口"],
    trait: ["buy a magazine", "购买杂志"],
    wider: ["all book buyers in the country", "全国所有购书者"],
  },
  {
    members: ["patients", "名病人"],
    where: ["registered at a clinic", "在某诊所登记的"],
    strata: ["age groups", "年龄段"],
    clusters: ["family doctors' lists", "家庭医生名单"],
    easy: ["are in the waiting room on Friday", "周五在候诊室"],
    trait: ["had a flu shot", "接种了流感疫苗"],
    wider: ["all patients in the country", "全国所有病人"],
  },
];

/** methodNames are the names of the sampling methods, in the order of the methods. */
const methodNames: readonly Text[] = [
  t("Simple random sampling", "简单随机抽样"),
  t("Systematic sampling", "系统抽样"),
  t("Stratified sampling", "分层抽样"),
  t("Cluster sampling", "整群抽样"),
  t("Convenience sampling", "方便抽样"),
];

/** sampling teaches populations, samples, sampling methods and estimates from samples. */
const sampling: TopicDef = {
  id: "sampling",
  title: t("Sampling", "抽样"),
  summary: t(
    "Tell a population from a sample, name the method used to choose a sample, and use a random sample to estimate a count in the population.",
    "区分总体与样本，判断抽取样本所用的方法，并用随机样本估计总体中的数量。",
  ),
  prerequisites: ["proportions"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSS.IC.A.1", "CCSS.HSS.IC.B.3"],
  knowledgePoints: [
    {
      id: "populations-and-samples",
      title: t("Populations and samples", "总体与样本"),
      explanation: t(
        "The **population** of a study is the whole group it wants to learn about. Collecting data from every member is a **census**; usually that costs too much, so the data come from a **sample**, a part of the population.\n\nA principal who surveys $60$ of the $900$ students at her school about lunch has the $900$ students as the population and the $60$ surveyed students as the sample.",
        "研究中想要了解的整个群体称为**总体**。从总体的每个成员收集数据叫作**普查**；普查往往代价太高，所以通常从**样本**（总体的一部分）收集数据。\n\n一位校长就午餐问题调查了本校 $900$ 名学生中的 $60$ 名，那么总体是这 $900$ 名学生，样本是被调查的 $60$ 名学生。",
      ),
      generate(rng) {
        const s = rng.pick(sampleScenes);
        const N = rng.int(4, 40) * 50;
        const n = rng.pick([20, 25, 30, 40, 50, 60, 80, 100]);
        const askPopulation = rng.bool();
        const pop = t(`All ${N} ${s.members[0]} ${s.where[0]}`, `${s.where[1]}全部 ${N} ${s.members[1]}`);
        const smp = t(`The ${n} ${s.members[0]} who were surveyed`, `被调查的 ${n} ${s.members[1]}`);
        const wider = t(`${s.wider[0][0]!.toUpperCase()}${s.wider[0].slice(1)}`, s.wider[1]);
        const yes = t(`The surveyed ${s.members[0]} who ${s.trait[0]}`, `被调查者中${s.trait[1]}的${s.members[1].replace(/^[名位]/, "")}`);
        const prompt = t(
          `A researcher wants to know how many of the ${N} ${s.members[0]} ${s.where[0]} ${s.trait[0]}. She asks ${n} of them. What is the ${askPopulation ? "population" : "sample"}?`,
          `一位研究员想知道${s.where[1]} ${N} ${s.members[1]}中有多少人${s.trait[1]}。她询问了其中 ${n} 人。${askPopulation ? "总体" : "样本"}是什么？`,
        );
        return oneOf(
          rng,
          prompt,
          askPopulation ? pop : smp,
          askPopulation ? [smp, wider, yes] : [pop, yes, wider],
          askPopulation
            ? t(
                `The population is the whole group the study is about: all ${N} ${s.members[0]} ${s.where[0]}. The ${n} who were asked are the sample.`,
                `总体是研究所关心的整个群体：${s.where[1]}全部 ${N} ${s.members[1]}。被询问的 ${n} 人是样本。`,
              )
            : t(
                `The sample is the part of the population from which data are collected: the ${n} ${s.members[0]} who were asked.`,
                `样本是实际收集数据的那部分总体：被询问的 ${n} ${s.members[1]}。`,
              ),
        );
      },
    },
    {
      id: "sampling-methods",
      title: t("Sampling methods", "抽样方法"),
      explanation: t(
        "Common ways to choose a sample of size $n$:\n\n- **Simple random sampling**: every group of $n$ members is equally likely to be chosen, for example by numbering the members and drawing $n$ random numbers.\n- **Systematic sampling**: list the members, start at a random place among the first $k$, and take every $k$th member.\n- **Stratified sampling**: split the population into groups (strata) that differ in a relevant way, and draw a random sample from **each** group.\n- **Cluster sampling**: split the population into groups (clusters), choose some clusters at random, and include **every** member of the chosen clusters.\n- **Convenience sampling**: take the members who are easiest to reach. It is quick, but usually biased.\n\nThe difference between stratified and cluster sampling: stratified samples a few members from every group; cluster sampling takes all members of a few groups.",
        "抽取容量为 $n$ 的样本的常用方法：\n\n- **简单随机抽样**：任意 $n$ 个成员组成的组被抽中的可能性都相同，例如给成员编号后随机抽取 $n$ 个号码。\n- **系统抽样**：把成员排成一列，在前 $k$ 个中随机选一个起点，然后每隔 $k$ 个取一个。\n- **分层抽样**：按某个相关特征把总体分成若干层，从**每一层**中随机抽取样本。\n- **整群抽样**：把总体分成若干群，随机选出几个群，并纳入所选群中的**全部**成员。\n- **方便抽样**：选取最容易接触到的成员。这种方法快捷，但通常有偏差。\n\n分层抽样与整群抽样的区别：分层抽样从每一组中抽取一部分成员；整群抽样则取几个组的全部成员。",
      ),
      generate(rng) {
        const s = rng.pick(sampleScenes);
        const method = rng.int(0, 4);
        const N = rng.int(8, 40) * 50;
        const k = rng.pick([5, 8, 10, 12, 15, 20, 25]);
        const g = rng.int(3, 6);
        const per = rng.int(5, 20);
        const c = rng.int(12, 30);
        const p = rng.int(2, 5);
        const n = rng.pick([30, 40, 50, 60, 75, 100]);
        const [mem, memZ] = [s.members[0], s.members[1].replace(/^[名位]/, "")];
        const how: Text = [
          t(
            `numbers all ${N} ${mem} and uses a random number generator to choose ${n} of them`,
            `把全部 ${N} 个${memZ}编号，并用随机数生成器从中选出 ${n} 个`,
          ),
          t(
            `lists all ${N} ${mem} alphabetically, picks one of the first ${k} at random and then takes every ${k}th ${mem.replace(/s$/, "")} on the list`,
            `把全部 ${N} 个${memZ}按字母顺序排列，从前 ${k} 个中随机选一个，然后在名单上每隔 ${k} 个取一个`,
          ),
          t(
            `splits the ${mem} by ${s.strata[0]} into ${g} groups and randomly chooses ${per} ${mem} from each group`,
            `按${s.strata[1]}把${memZ}分成 ${g} 组，并从每组中随机选出 ${per} 个${memZ}`,
          ),
          t(
            `splits the ${mem} by ${s.clusters[0]} into ${c} groups, randomly chooses ${p} of the groups and asks every ${mem.replace(/s$/, "")} in them`,
            `按${s.clusters[1]}把${memZ}分成 ${c} 组，随机选出其中 ${p} 组，并询问这几组中的每一个${memZ}`,
          ),
          t(`asks the first ${n} ${mem} who ${s.easy[0]}`, `询问最先${s.easy[1]}的 ${n} 个${memZ}`),
        ][method]!;
        const why: Text = [
          t("Every group of members is equally likely to be chosen.", "任意一组成员被选中的可能性都相同。"),
          t("Members are taken at a fixed interval from a random start.", "从随机起点开始，按固定间隔选取成员。"),
          t("A random sample is drawn from every group.", "从每一组中都随机抽取样本。"),
          t("A few groups are chosen at random and every member of them is included.", "随机选出几个组，并纳入这些组的全部成员。"),
          t("The members are simply the easiest ones to reach.", "选取的只是最容易接触到的成员。"),
        ][method]!;
        const wrong = methodNames.filter((_, i) => i !== method);
        return oneOf(
          rng,
          t(
            `To survey the ${mem} ${s.where[0]}, a researcher ${how.en}. Which sampling method is this?`,
            `为调查${s.where[1]}${memZ}，一位研究员${how["zh-CN"]}。这是哪种抽样方法？`,
          ),
          methodNames[method]!,
          rng.shuffle(wrong),
          t(`${why.en} This is ${methodNames[method]!.en.toLowerCase()}.`, `${why["zh-CN"]}这是${methodNames[method]!["zh-CN"]}。`),
        );
      },
    },
    {
      id: "estimating-from-a-random-sample",
      title: t("Estimating from a random sample", "用随机样本作估计"),
      explanation: t(
        "A random sample is likely to look like the population, so the proportion found in the sample estimates the proportion in the whole population:\n\n$$\\text{estimate} = \\frac{\\text{count in sample}}{\\text{sample size}} \\times \\text{population size}.$$\n\nIf $18$ of a random sample of $60$ students walk to school, about $\\frac{18}{60} = 0.3$ of all $900$ students do, which is $0.3 \\times 900 = 270$ students.",
        "随机样本往往与总体相似，所以样本中的比例可以估计整个总体中的比例：\n\n$$\\text{估计值} = \\frac{\\text{样本中的数量}}{\\text{样本容量}} \\times \\text{总体容量}.$$\n\n如果在随机抽取的 $60$ 名学生中有 $18$ 人步行上学，那么全部 $900$ 名学生中约有 $\\frac{18}{60} = 0.3$ 的人步行上学，即 $0.3 \\times 900 = 270$ 人。",
      ),
      generate(rng) {
        const s = rng.pick(sampleScenes);
        const n = rng.pick([20, 25, 40, 50, 80, 100, 200]);
        const N = n * rng.int(5, 40);
        const k = rng.int(2, n - 2);
        const ans = Q.of(k * (N / n));
        const memZ = s.members[1].replace(/^[名位]/, "");
        return numberProblem({
          prompt: t(
            `In a random sample of ${n} of the ${N} ${s.members[0]} ${s.where[0]}, ${k} ${s.trait[0]}. Estimate how many of all ${N} ${s.members[0]} ${s.trait[0]}.`,
            `从${s.where[1]} ${N} ${s.members[1]}中随机抽取 ${n} 个，其中 ${k} 个${s.trait[1]}。估计全部 ${N} 个${memZ}中有多少个${s.trait[1]}。`,
          ),
          answer: ans,
          wrong: [Q.of(k), Q.of(N - ans.toNumber()), Q.of(Math.round((k * N) / 100))],
          solution: t(
            `The proportion in the sample is $\\frac{${k}}{${n}}$, so the estimate is${steps(`\\frac{${k}}{${n}} \\times ${N} = ${ans.toLatex()}`)}`,
            `样本中的比例是 $\\frac{${k}}{${n}}$，所以估计值为${steps(`\\frac{${k}}{${n}} \\times ${N} = ${ans.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
};

/** dataList writes data values separated by commas. */
const dataList = (xs: readonly number[]) => xs.join(", ");

/** varianceAndStandardDeviation teaches the population and sample variance and standard deviation. */
const varianceAndStandardDeviation: TopicDef = {
  id: "variance-and-standard-deviation",
  title: t("Variance and Standard Deviation", "方差与标准差"),
  summary: t(
    "Measure the spread of a data set by the mean of the squared deviations from the mean (the variance) and its square root (the standard deviation), for a population and for a sample.",
    "用离均差平方的平均数（方差）及其平方根（标准差）度量数据的离散程度，分别针对总体和样本。",
  ),
  prerequisites: ["mean-absolute-deviation"],
  encompasses: [{ topic: "mean-of-a-data-set", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.A.2"],
  knowledgePoints: [
    {
      id: "population-variance",
      title: t("The variance", "方差"),
      explanation: t(
        "The **variance** of a population of $n$ values with mean $\\mu$ is the mean of the squared deviations from the mean:\n\n$$\\sigma^2 = \\frac{\\sum (x - \\mu)^2}{n}.$$\n\nSquaring makes every deviation count positively and gives large deviations more weight than the mean absolute deviation does.\n\nFor $2, 4, 6, 8$: $\\mu = 5$, the squared deviations are $9, 1, 1, 9$, and $\\sigma^2 = \\frac{20}{4} = 5$.",
        "由 $n$ 个值组成、均值为 $\\mu$ 的总体，其**方差**是离均差平方的平均数：\n\n$$\\sigma^2 = \\frac{\\sum (x - \\mu)^2}{n}.$$\n\n平方使每个偏差都按正数计入，并且比平均绝对偏差更看重大的偏差。\n\n对 $2, 4, 6, 8$：$\\mu = 5$，离均差的平方是 $9, 1, 1, 9$，所以 $\\sigma^2 = \\frac{20}{4} = 5$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5]);
        const xs = dataWithMean(rng, n, 1, 20);
        const mu = sum(xs) / n;
        const ss = squaredDeviations(xs, mu);
        const ans = Q.of(ss, n);
        const mad = Q.of(sum(xs.map((x) => Math.abs(x - mu))), n);
        return numberProblem({
          prompt: t(`Find the variance $\\sigma^2$ of the population $${dataList(xs)}$.`, `求总体 $${dataList(xs)}$ 的方差 $\\sigma^2$。`),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(ss, n - 1), Q.of(ss), mad],
          solution: t(
            `The mean is $\\mu = \\frac{${sum(xs)}}{${n}} = ${mu}$. Then${steps(`\\sigma^2 = \\frac{${devLine(xs, mu)}}{${n}}`, `= \\frac{${sqLine(xs, mu)}}{${n}} = \\frac{${ss}}{${n}} = ${show(ans)}`)}`,
            `均值为 $\\mu = \\frac{${sum(xs)}}{${n}} = ${mu}$。于是${steps(`\\sigma^2 = \\frac{${devLine(xs, mu)}}{${n}}`, `= \\frac{${sqLine(xs, mu)}}{${n}} = \\frac{${ss}}{${n}} = ${show(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "standard-deviation",
      title: t("The standard deviation", "标准差"),
      explanation: t(
        "The **standard deviation** is the square root of the variance:\n\n$$\\sigma = \\sqrt{\\frac{\\sum (x - \\mu)^2}{n}}.$$\n\nIt is measured in the same units as the data, so it describes a typical distance of a value from the mean.\n\nFor $2, 4, 6, 8$ the variance is $5$, so $\\sigma = \\sqrt{5} \\approx 2.24$.",
        "**标准差**是方差的平方根：\n\n$$\\sigma = \\sqrt{\\frac{\\sum (x - \\mu)^2}{n}}.$$\n\n它与数据的单位相同，描述了数据值与均值的典型距离。\n\n对 $2, 4, 6, 8$，方差是 $5$，所以 $\\sigma = \\sqrt{5} \\approx 2.24$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([4, 5]);
          const xs = dataWithMean(rng, n, 1, 20);
          const mu = sum(xs) / n;
          const ss = squaredDeviations(xs, mu);
          const ans = rounded(Math.sqrt(ss / n), 2);
          if (!ans) continue;
          const v = Q.of(ss, n);
          return numberProblem({
            prompt: t(
              `Find the standard deviation $\\sigma$ of the population $${dataList(xs)}$. Round to two decimal places.`,
              `求总体 $${dataList(xs)}$ 的标准差 $\\sigma$，结果保留两位小数。`,
            ),
            answer: ans,
            ...decimalForm(ans),
            wrong: defined(rounded(ss / n, 2), rounded(Math.sqrt(ss / (n - 1)), 2), rounded(Math.sqrt(ss), 2)),
            solution: t(
              `The mean is $\\mu = ${mu}$, and the squared deviations add up to $${sqLine(xs, mu)} = ${ss}$. So${steps(`\\sigma^2 = \\frac{${ss}}{${n}} = ${show(v)}`, `\\sigma = \\sqrt{${show(v)}} \\approx ${dec(ans)}`)}`,
              `均值为 $\\mu = ${mu}$，离均差的平方之和为 $${sqLine(xs, mu)} = ${ss}$。所以${steps(`\\sigma^2 = \\frac{${ss}}{${n}} = ${show(v)}`, `\\sigma = \\sqrt{${show(v)}} \\approx ${dec(ans)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "sample-variance",
      title: t("The sample variance", "样本方差"),
      explanation: t(
        "When the data are a **sample** used to estimate the spread of a larger population, divide by $n - 1$ instead of $n$. The **sample variance** and **sample standard deviation** are\n\n$$s^2 = \\frac{\\sum (x - \\bar{x})^2}{n - 1}, \\qquad s = \\sqrt{s^2}.$$\n\nThe deviations from the sample mean $\\bar{x}$ tend to be a little smaller than those from the unknown population mean, and dividing by $n - 1$ makes up for that.\n\nFor the sample $3, 5, 7$: $\\bar{x} = 5$, the squared deviations add up to $4 + 0 + 4 = 8$, and $s^2 = \\frac{8}{2} = 4$.",
        "当数据是用来估计更大总体离散程度的**样本**时，要除以 $n - 1$ 而不是 $n$。**样本方差**和**样本标准差**为\n\n$$s^2 = \\frac{\\sum (x - \\bar{x})^2}{n - 1}, \\qquad s = \\sqrt{s^2}.$$\n\n数据相对样本均值 $\\bar{x}$ 的偏差往往比相对未知总体均值的偏差略小，除以 $n - 1$ 正好弥补这一点。\n\n对样本 $3, 5, 7$：$\\bar{x} = 5$，离均差平方之和为 $4 + 0 + 4 = 8$，所以 $s^2 = \\frac{8}{2} = 4$。",
      ),
      generate(rng) {
        const n = rng.pick([3, 5, 6]);
        const xs = dataWithMean(rng, n, 1, 25);
        const mu = sum(xs) / n;
        const ss = squaredDeviations(xs, mu);
        const ans = Q.of(ss, n - 1);
        return numberProblem({
          prompt: t(
            `The values $${dataList(xs)}$ are a sample from a large population. Find the sample variance $s^2$.`,
            `数据 $${dataList(xs)}$ 是来自某个大总体的样本。求样本方差 $s^2$。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(ss, n), Q.of(ss), Q.of(ss, n + 1)],
          solution: t(
            `The sample mean is $\\bar{x} = \\frac{${sum(xs)}}{${n}} = ${mu}$. Divide the sum of the squared deviations by $n - 1 = ${n - 1}$:${steps(`s^2 = \\frac{${sqLine(xs, mu)}}{${n - 1}} = \\frac{${ss}}{${n - 1}} = ${show(ans)}`)}`,
            `样本均值为 $\\bar{x} = \\frac{${sum(xs)}}{${n}} = ${mu}$。把离均差平方之和除以 $n - 1 = ${n - 1}$：${steps(`s^2 = \\frac{${sqLine(xs, mu)}}{${n - 1}} = \\frac{${ss}}{${n - 1}} = ${show(ans)}`)}`,
          ),
        });
      },
    },
  ],
};

/** TOTALS are frequency totals whose reciprocals terminate, so means come out as decimals. */
const TOTALS = [10, 20, 25, 40, 50] as const;

/** frequencies splits total into k positive frequencies. */
function frequencies(rng: Rng, total: number, k: number): number[] {
  const cuts = rng.sample(range(1, total - 1), k - 1).sort((a, b) => a - b);
  return [...cuts, total].map((c, i) => c - (i === 0 ? 0 : cuts[i - 1]!));
}

/** estimatingGroupedData teaches the mean of a frequency table and estimates of the mean and variance of grouped data. */
const estimatingGroupedData: TopicDef = {
  id: "estimating-means-and-variances-for-grouped-data",
  title: t("Estimating Means and Variances for Grouped Data", "估计分组数据的均值与方差"),
  summary: t(
    "Find the mean of data given in a frequency table, and estimate the mean and variance of grouped data using the midpoints of the classes.",
    "求频数表给出的数据的均值，并用组中值估计分组数据的均值与方差。",
  ),
  prerequisites: ["variance-and-standard-deviation"],
  encompasses: [{ topic: "variance-and-standard-deviation", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.A.2"],
  knowledgePoints: [
    {
      id: "mean-of-a-frequency-table",
      title: t("The mean of a frequency table", "频数表的均值"),
      explanation: t(
        "In a frequency table, the value $x$ occurs $f$ times. The sum of all the data is $\\sum fx$ and the number of data is $\\sum f$, so\n\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f}.$$\n\nIf $x = 1, 2, 3$ occur $2, 5, 3$ times, then $\\bar{x} = \\frac{1 \\cdot 2 + 2 \\cdot 5 + 3 \\cdot 3}{10} = \\frac{21}{10} = 2.1$.",
        "在频数表中，值 $x$ 出现 $f$ 次。全部数据之和是 $\\sum fx$，数据个数是 $\\sum f$，所以\n\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f}.$$\n\n若 $x = 1, 2, 3$ 分别出现 $2, 5, 3$ 次，则 $\\bar{x} = \\frac{1 \\cdot 2 + 2 \\cdot 5 + 3 \\cdot 3}{10} = \\frac{21}{10} = 2.1$。",
      ),
      generate(rng) {
        const k = rng.int(4, 5);
        const start = rng.int(0, 3);
        const xs = range(start, start + k - 1);
        const total = rng.pick(TOTALS);
        const fs = frequencies(rng, total, k);
        const sfx = sum(xs.map((x, i) => x * fs[i]!));
        const ans = Q.of(sfx, total);
        const what = rng.pick([
          ["number of goals scored in a match", "每场比赛的进球数"],
          ["number of books read last month", "上个月读书的本数"],
          ["number of pets in a household", "每户家庭的宠物数"],
          ["number of siblings", "兄弟姐妹的人数"],
        ] as const);
        const tab = table([`$x$`, ...m(xs)], ["$f$", ...m(fs)]);
        return numberProblem({
          prompt: t(
            `The table shows the ${what[0]}, $x$, with frequencies $f$.\n\n${tab}\n\nFind the mean of $x$.`,
            `下表给出${what[1]} $x$ 及其频数 $f$。\n\n${tab}\n\n求 $x$ 的均值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(sum(xs), k), Q.of(sfx, k), Q.of(total, k)],
          solution: t(
            `There are $\\sum f = ${total}$ data, with sum${steps(`\\sum fx = ${xs.map((x, i) => `${x} \\cdot ${fs[i]}`).join(" + ")} = ${sfx}`)}So $\\bar{x} = \\frac{${sfx}}{${total}} = ${dec(ans)}$.`,
            `共有 $\\sum f = ${total}$ 个数据，其和为${steps(`\\sum fx = ${xs.map((x, i) => `${x} \\cdot ${fs[i]}`).join(" + ")} = ${sfx}`)}所以 $\\bar{x} = \\frac{${sfx}}{${total}} = ${dec(ans)}$。`,
          ),
        });
      },
    },
    {
      id: "estimating-the-mean-of-grouped-data",
      title: t("Estimating the mean of grouped data", "估计分组数据的均值"),
      explanation: t(
        "When data are grouped into classes, the exact values are lost. Assume every value in a class lies at the class **midpoint** $m$, and use the frequency-table formula:\n\n$$\\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\nFor the classes $0 \\le x < 10$ and $10 \\le x < 20$ with frequencies $3$ and $7$, the midpoints are $5$ and $15$, so $\\bar{x} \\approx \\frac{3 \\cdot 5 + 7 \\cdot 15}{10} = 12$.",
        "数据分组后，确切的值就丢失了。假设每一组中的值都位于该组的**组中值** $m$，再用频数表的公式：\n\n$$\\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\n对于组 $0 \\le x < 10$ 和 $10 \\le x < 20$，频数分别为 $3$ 和 $7$，组中值是 $5$ 和 $15$，所以 $\\bar{x} \\approx \\frac{3 \\cdot 5 + 7 \\cdot 15}{10} = 12$。",
      ),
      generate(rng) {
        const w = rng.pick([4, 5, 10, 20]);
        const k = rng.int(4, 5);
        const start = w * rng.int(0, 4);
        const lows = range(0, k - 1).map((i) => start + i * w);
        const mids = lows.map((l) => Q.of(2 * l + w, 2));
        const total = rng.pick(TOTALS);
        const fs = frequencies(rng, total, k);
        const sfm = qsum(mids.map((md, i) => md.mul(Q.of(fs[i]!))));
        const ans = sfm.div(Q.of(total));
        const low = Q.of(sum(lows.map((l, i) => l * fs[i]!)), total);
        const what = rng.pick([
          ["times, in minutes, that customers waited", "顾客等待的时间（分钟）"],
          ["masses, in grams, of apples", "苹果的质量（克）"],
          ["scores of students on a test", "学生的测验成绩"],
          ["heights, in centimeters, of seedlings", "幼苗的高度（厘米）"],
        ] as const);
        const classes = lows.map((l) => `$${l} \\le x < ${l + w}$`);
        const tab = table(["Class", ...classes], ["$f$", ...m(fs)]);
        const tabZ = table(["组", ...classes], ["$f$", ...m(fs)]);
        return numberProblem({
          prompt: t(
            `The table shows the ${what[0]}, $x$, in classes.\n\n${tab}\n\nEstimate the mean of $x$.`,
            `下表按组给出${what[1]} $x$。\n\n${tabZ}\n\n估计 $x$ 的均值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [low, low.add(Q.of(w)), qsum(mids).div(Q.of(k))],
          solution: t(
            `The midpoints are $${mids.map(dec).join(", ")}$. Then${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${dec(md)}`).join(" + ")}}{${total}} = \\frac{${dec(sfm)}}{${total}} = ${dec(ans)}`)}`,
            `各组组中值为 $${mids.map(dec).join(", ")}$。于是${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${dec(md)}`).join(" + ")}}{${total}} = \\frac{${dec(sfm)}}{${total}} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "estimating-the-variance-of-grouped-data",
      title: t("Estimating the variance of grouped data", "估计分组数据的方差"),
      explanation: t(
        "Expanding the square in the definition of the variance gives a shortcut: the variance is the mean of the squares minus the square of the mean,\n\n$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\mu^2.$$\n\nFor grouped data, use the midpoints again:\n\n$$\\sigma^2 \\approx \\frac{\\sum fm^2}{\\sum f} - \\bar{x}^2, \\quad \\text{where } \\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\nWith midpoints $5$ and $15$ and frequencies $3$ and $7$: $\\bar{x} \\approx 12$, $\\frac{\\sum fm^2}{\\sum f} = \\frac{3 \\cdot 25 + 7 \\cdot 225}{10} = 165$, so $\\sigma^2 \\approx 165 - 144 = 21$.",
        "把方差定义中的平方展开，可以得到一个简便公式：方差等于平方的均值减去均值的平方，\n\n$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\mu^2.$$\n\n对分组数据，同样使用组中值：\n\n$$\\sigma^2 \\approx \\frac{\\sum fm^2}{\\sum f} - \\bar{x}^2, \\quad \\text{其中 } \\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\n组中值为 $5$ 和 $15$、频数为 $3$ 和 $7$ 时：$\\bar{x} \\approx 12$，$\\frac{\\sum fm^2}{\\sum f} = \\frac{3 \\cdot 25 + 7 \\cdot 225}{10} = 165$，所以 $\\sigma^2 \\approx 165 - 144 = 21$。",
      ),
      generate(rng) {
        const w = rng.pick([2, 4, 10]);
        const k = rng.int(3, 4);
        const start = w * rng.int(0, 3);
        const lows = range(0, k - 1).map((i) => start + i * w);
        const mids = lows.map((l) => l + w / 2);
        const total = rng.pick([10, 20]);
        const fs = frequencies(rng, total, k);
        const mean = Q.of(sum(mids.map((md, i) => md * fs[i]!)), total);
        const sq = Q.of(sum(mids.map((md, i) => md * md * fs[i]!)), total);
        const ans = sq.sub(mean.mul(mean));
        const classes = lows.map((l) => `$${l} \\le x < ${l + w}$`);
        const tab = table(["Class", ...classes], ["$f$", ...m(fs)]);
        const tabZ = table(["组", ...classes], ["$f$", ...m(fs)]);
        return numberProblem({
          prompt: t(
            `The table shows grouped data.\n\n${tab}\n\nEstimate the variance of $x$ using the midpoints of the classes.`,
            `下表给出分组数据。\n\n${tabZ}\n\n用各组组中值估计 $x$ 的方差。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [sq, sq.sub(mean), ans.mul(Q.of(total, total - 1))],
          solution: t(
            `The midpoints are $${mids.join(", ")}$, so${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}`).join(" + ")}}{${total}} = ${dec(mean)}`, `\\frac{\\sum fm^2}{\\sum f} = \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}^2`).join(" + ")}}{${total}} = ${dec(sq)}`, `\\sigma^2 \\approx ${dec(sq)} - ${dec(mean)}^2 = ${dec(ans)}`)}`,
            `组中值为 $${mids.join(", ")}$，所以${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}`).join(" + ")}}{${total}} = ${dec(mean)}`, `\\frac{\\sum fm^2}{\\sum f} = \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}^2`).join(" + ")}}{${total}} = ${dec(sq)}`, `\\sigma^2 \\approx ${dec(sq)} - ${dec(mean)}^2 = ${dec(ans)}`)}`,
          ),
        });
      },
    },
  ],
};

/** pairsWithMeans draws n points with distinct integer x, integer coordinates and integer means. */
function pairsWithMeans(rng: Rng, n: number, lo: number, hi: number): [number[], number[]] {
  for (;;) {
    const xs = dataWithMean(rng, n, lo, hi);
    if (new Set(xs).size < n) continue;
    const ys = dataWithMean(rng, n, lo, hi);
    return [xs, ys];
  }
}

/** pointList writes points (x1, y1), (x2, y2), … */
const pointList = (xs: readonly number[], ys: readonly number[]) => xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");

/** trendData draws n points with integer means whose covariance has the given sign and is clearly away from 0. */
function trendData(rng: Rng, n: number, sign: 1 | -1): [number[], number[]] {
  for (;;) {
    const [xs, ys] = pairsWithMeans(rng, n, 1, 12);
    const mx = sum(xs) / n;
    const my = sum(ys) / n;
    const sxy = sum(xs.map((x, i) => (x - mx) * (ys[i]! - my)));
    const sxx = squaredDeviations(xs, mx);
    const syy = squaredDeviations(ys, my);
    if (sxy * sign > 0 && Math.abs(sxy) >= 0.5 * Math.sqrt(sxx * syy)) return [xs, ys];
  }
}

/** scatter draws points on a first-quadrant grid up to 12. */
function scatter(xs: readonly number[], ys: readonly number[]): Figure {
  const marks = xs.map((x, i): PlaneMark => ({ kind: "point", at: [x, ys[i]!] }));
  const list = pointList(xs, ys);
  return {
    svg: plane({ xMin: 0, xMax: 13, yMin: 0, yMax: 13, labelEvery: 2 }, marks),
    alt: t(`Scatter plot of the points ${list}.`, `散点图，各点为 ${list}。`),
  };
}

/** covariance teaches the covariance of paired data. */
const covariance: TopicDef = {
  id: "covariance",
  title: t("Covariance", "协方差"),
  summary: t(
    "Compute the covariance of paired data from its definition and from summary statistics, and read its sign from a scatter plot.",
    "由定义和汇总统计量计算成对数据的协方差，并从散点图判断其符号。",
  ),
  prerequisites: ["variance-and-standard-deviation", "scatter-plots"],
  encompasses: [{ topic: "scatter-plots", weight: 0.1 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.B.6"],
  knowledgePoints: [
    {
      id: "covariance-from-data",
      title: t("Covariance from data", "由数据求协方差"),
      explanation: t(
        "The **covariance** of $n$ data pairs $(x, y)$ measures how $x$ and $y$ vary together:\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{n}.$$\n\nA pair with both values above their means, or both below, adds a positive product; a pair with one above and one below adds a negative product.\n\nFor $(1, 2), (2, 6), (3, 4)$: $\\bar{x} = 2$, $\\bar{y} = 4$, and $\\operatorname{cov}(x, y) = \\frac{(-1)(-2) + 0 \\cdot 2 + 1 \\cdot 0}{3} = \\frac{2}{3}$.",
        "$n$ 对数据 $(x, y)$ 的**协方差**衡量 $x$ 与 $y$ 共同变化的程度：\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{n}.$$\n\n两个值都高于各自的均值或都低于均值的数对，贡献一个正的乘积；一个高于、一个低于的数对，贡献一个负的乘积。\n\n对 $(1, 2), (2, 6), (3, 4)$：$\\bar{x} = 2$，$\\bar{y} = 4$，$\\operatorname{cov}(x, y) = \\frac{(-1)(-2) + 0 \\cdot 2 + 1 \\cdot 0}{3} = \\frac{2}{3}$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5]);
        let [xs, ys] = pairsWithMeans(rng, n, 1, 12);
        const covSum = (u: readonly number[], v: readonly number[]) => sum(u.map((x, i) => (x - sum(u) / n) * (v[i]! - sum(v) / n)));
        for (let tries = 0; tries < 100 && covSum(xs, ys) === 0; tries++) {
          [xs, ys] = pairsWithMeans(rng, n, 1, 12);
        }
        const mx = sum(xs) / n;
        const my = sum(ys) / n;
        const sxy = covSum(xs, ys);
        const ans = Q.of(sxy, n);
        const line = xs.map((x, i) => `(${x - mx})(${ys[i]! - my})`).join(" + ");
        return numberProblem({
          prompt: t(`Find the covariance of the data pairs $${pointList(xs, ys)}$.`, `求数对 $${pointList(xs, ys)}$ 的协方差。`),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(sxy, n - 1), Q.of(sxy), ans.neg()],
          solution: t(
            `The means are $\\bar{x} = ${mx}$ and $\\bar{y} = ${my}$. Multiply the deviations of each pair and average:${steps(`\\operatorname{cov}(x, y) = \\frac{${line}}{${n}}`, `= \\frac{${sxy}}{${n}} = ${show(ans)}`)}`,
            `均值为 $\\bar{x} = ${mx}$，$\\bar{y} = ${my}$。把每对数据的偏差相乘再求平均：${steps(`\\operatorname{cov}(x, y) = \\frac{${line}}{${n}}`, `= \\frac{${sxy}}{${n}} = ${show(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "covariance-from-summary-statistics",
      title: t("Covariance from summary statistics", "由汇总统计量求协方差"),
      explanation: t(
        "Expanding the product in the definition gives a shortcut that needs only sums:\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum xy}{n} - \\bar{x}\\,\\bar{y}.$$\n\nIf $n = 10$, $\\sum x = 50$, $\\sum y = 80$ and $\\sum xy = 430$, then $\\bar{x} = 5$, $\\bar{y} = 8$ and $\\operatorname{cov}(x, y) = 43 - 40 = 3$.",
        "把定义中的乘积展开，可以得到只需要各种和的简便公式：\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum xy}{n} - \\bar{x}\\,\\bar{y}.$$\n\n若 $n = 10$，$\\sum x = 50$，$\\sum y = 80$，$\\sum xy = 430$，则 $\\bar{x} = 5$，$\\bar{y} = 8$，$\\operatorname{cov}(x, y) = 43 - 40 = 3$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5, 8, 10, 20]);
        const xs = Array.from({ length: n }, () => rng.int(1, 30));
        const ys = Array.from({ length: n }, () => rng.int(1, 30));
        const sx = sum(xs);
        const sy = sum(ys);
        const sxy = sum(xs.map((x, i) => x * ys[i]!));
        const mx = Q.of(sx, n);
        const my = Q.of(sy, n);
        const mxy = Q.of(sxy, n);
        const ans = mxy.sub(mx.mul(my));
        const given = `n = ${n}, \\quad \\sum x = ${sx}, \\quad \\sum y = ${sy}, \\quad \\sum xy = ${sxy}`;
        return numberProblem({
          prompt: t(
            `For a set of data pairs, $${given}$. Find the covariance of $x$ and $y$.`,
            `一组数对满足 $${given}$。求 $x$ 与 $y$ 的协方差。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [mxy, Q.of(sxy - sx * sy, n), mxy.sub(mx.add(my))],
          solution: t(
            `The means are $\\bar{x} = \\frac{${sx}}{${n}} = ${dec(mx)}$ and $\\bar{y} = \\frac{${sy}}{${n}} = ${dec(my)}$, so${steps(`\\operatorname{cov}(x, y) = \\frac{${sxy}}{${n}} - ${dec(mx)} \\cdot ${dec(my)} = ${dec(mxy)} - ${dec(mx.mul(my))} = ${dec(ans)}`)}`,
            `均值为 $\\bar{x} = \\frac{${sx}}{${n}} = ${dec(mx)}$，$\\bar{y} = \\frac{${sy}}{${n}} = ${dec(my)}$，所以${steps(`\\operatorname{cov}(x, y) = \\frac{${sxy}}{${n}} - ${dec(mx)} \\cdot ${dec(my)} = ${dec(mxy)} - ${dec(mx.mul(my))} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-sign-of-the-covariance",
      title: t("The sign of the covariance", "协方差的符号"),
      explanation: t(
        "The sign of the covariance tells the direction of the relationship:\n\n- **positive**: $y$ tends to increase as $x$ increases (points rise from left to right);\n- **negative**: $y$ tends to decrease as $x$ increases (points fall from left to right);\n- **near zero**: no linear trend.\n\nIts size depends on the units of $x$ and $y$, so the covariance alone does not say how strong the relationship is.",
        "协方差的符号说明关系的方向：\n\n- **正**：$y$ 随 $x$ 增大而趋于增大（点从左到右上升）；\n- **负**：$y$ 随 $x$ 增大而趋于减小（点从左到右下降）；\n- **接近零**：没有线性趋势。\n\n协方差的大小取决于 $x$ 与 $y$ 的单位，所以单凭协方差不能说明关系有多强。",
      ),
      generate(rng) {
        const sign = rng.sign();
        const n = rng.int(5, 7);
        const [xs, ys] = trendData(rng, n, sign);
        const opts = [t("Positive", "正"), t("Negative", "负"), t("Zero", "零")];
        const problem = choiceProblem({
          prompt: t(
            "The scatter plot shows a set of data pairs. What is the sign of the covariance of $x$ and $y$?",
            "散点图表示一组数对。$x$ 与 $y$ 的协方差的符号是什么？",
          ),
          options: opts,
          correct: sign > 0 ? 0 : 1,
          solution:
            sign > 0
              ? t(
                  "The points tend to rise from left to right: pairs are mostly both above or both below their means, so the products of the deviations are mostly positive and the covariance is positive.",
                  "点从左到右大体上升：多数数对的两个值同时高于或同时低于各自的均值，偏差的乘积多为正，所以协方差为正。",
                )
              : t(
                  "The points tend to fall from left to right: in most pairs one value is above its mean and the other below, so the products of the deviations are mostly negative and the covariance is negative.",
                  "点从左到右大体下降：多数数对中一个值高于均值、另一个低于均值，偏差的乘积多为负，所以协方差为负。",
                ),
        });
        return { ...problem, figure: scatter(xs, ys) };
      },
    },
  ],
};

/** summaryData draws n random integer pairs and their sums. */
function summaryData(rng: Rng, n: number) {
  const xs = Array.from({ length: n }, () => rng.int(1, 30));
  const ys = Array.from({ length: n }, () => rng.int(1, 30));
  return {
    sx: sum(xs),
    sy: sum(ys),
    sxx: sum(xs.map((x) => x * x)),
    syy: sum(ys.map((y) => y * y)),
    sxy: sum(xs.map((x, i) => x * ys[i]!)),
  };
}

/** sumsOfSquares teaches S_xx, S_yy and S_xy. */
const sumsOfSquares: TopicDef = {
  id: "sums-of-squares",
  title: t("Sums of Squares", "平方和"),
  summary: t(
    "Compute the sums of squares $S_{xx}$, $S_{yy}$ and the sum of products $S_{xy}$ from data and from summary statistics, and relate them to the variance and covariance.",
    "由数据和汇总统计量计算平方和 $S_{xx}$、$S_{yy}$ 与乘积和 $S_{xy}$，并把它们与方差和协方差联系起来。",
  ),
  prerequisites: ["covariance"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSS.ID.B.6"],
  knowledgePoints: [
    {
      id: "sums-of-squares-from-data",
      title: t("Sums of squares from data", "由数据求平方和"),
      explanation: t(
        "The **sum of squares** of $x$ is the sum of the squared deviations from the mean:\n\n$$S_{xx} = \\sum (x - \\bar{x})^2.$$\n\nDividing it by $n$ gives the variance: $\\sigma^2 = \\frac{S_{xx}}{n}$. Likewise $S_{yy} = \\sum (y - \\bar{y})^2$.\n\nFor $x = 1, 4, 7$: $\\bar{x} = 4$ and $S_{xx} = 9 + 0 + 9 = 18$.",
        "$x$ 的**平方和**是离均差的平方之和：\n\n$$S_{xx} = \\sum (x - \\bar{x})^2.$$\n\n把它除以 $n$ 就得到方差：$\\sigma^2 = \\frac{S_{xx}}{n}$。同样地，$S_{yy} = \\sum (y - \\bar{y})^2$。\n\n对 $x = 1, 4, 7$：$\\bar{x} = 4$，$S_{xx} = 9 + 0 + 9 = 18$。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const xs = dataWithMean(rng, n, 1, 20);
        const mu = sum(xs) / n;
        const ss = squaredDeviations(xs, mu);
        const name = rng.pick(["x", "y"]);
        const S = `S_{${name}${name}}`;
        return numberProblem({
          prompt: t(`Find $${S}$ for the data $${name} = ${dataList(xs)}$.`, `求数据 $${name} = ${dataList(xs)}$ 的 $${S}$。`),
          answer: Q.of(ss),
          wrong: [Q.of(ss, n), Q.of(sum(xs.map((x) => x * x))), Q.of(sum(xs.map((x) => Math.abs(x - mu))))],
          solution: t(
            `The mean is $${name === "x" ? "\\bar{x}" : "\\bar{y}"} = \\frac{${sum(xs)}}{${n}} = ${mu}$, so${steps(`${S} = ${devLine(xs, mu)}`, `= ${sqLine(xs, mu)} = ${ss}`)}`,
            `均值为 $${name === "x" ? "\\bar{x}" : "\\bar{y}"} = \\frac{${sum(xs)}}{${n}} = ${mu}$，所以${steps(`${S} = ${devLine(xs, mu)}`, `= ${sqLine(xs, mu)} = ${ss}`)}`,
          ),
        });
      },
    },
    {
      id: "sums-of-squares-from-summary-statistics",
      title: t("Sums of squares from summary statistics", "由汇总统计量求平方和"),
      explanation: t(
        "Expanding the square gives a formula that uses only the sums of the data and of their squares:\n\n$$S_{xx} = \\sum x^2 - \\frac{\\left(\\sum x\\right)^2}{n}.$$\n\nIf $n = 5$, $\\sum x = 20$ and $\\sum x^2 = 96$, then $S_{xx} = 96 - \\frac{400}{5} = 16$.",
        "把平方展开，得到只用数据之和与平方之和的公式：\n\n$$S_{xx} = \\sum x^2 - \\frac{\\left(\\sum x\\right)^2}{n}.$$\n\n若 $n = 5$，$\\sum x = 20$，$\\sum x^2 = 96$，则 $S_{xx} = 96 - \\frac{400}{5} = 16$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5, 8, 10, 20]);
        const d = summaryData(rng, n);
        const useY = rng.bool();
        const [s, s2, v] = useY ? [d.sy, d.syy, "y"] : [d.sx, d.sxx, "x"];
        const ans = Q.of(s2).sub(Q.of(s * s, n));
        const given = `n = ${n}, \\quad \\sum ${v} = ${s}, \\quad \\sum ${v}^2 = ${s2}`;
        return numberProblem({
          prompt: t(`For a data set, $${given}$. Find $S_{${v}${v}}$.`, `某组数据满足 $${given}$。求 $S_{${v}${v}}$。`),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(s2 - s * s), ans.div(Q.of(n)), Q.of(s2).sub(Q.of(s, n))],
          solution: t(
            `Use $S_{${v}${v}} = \\sum ${v}^2 - \\frac{(\\sum ${v})^2}{n}$:${steps(`S_{${v}${v}} = ${s2} - \\frac{${s}^2}{${n}} = ${s2} - ${dec(Q.of(s * s, n))} = ${dec(ans)}`)}`,
            `利用 $S_{${v}${v}} = \\sum ${v}^2 - \\frac{(\\sum ${v})^2}{n}$：${steps(`S_{${v}${v}} = ${s2} - \\frac{${s}^2}{${n}} = ${s2} - ${dec(Q.of(s * s, n))} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-sum-of-products",
      title: t("The sum of products", "乘积和"),
      explanation: t(
        "For paired data, the **sum of products** is\n\n$$S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y}) = \\sum xy - \\frac{\\sum x \\sum y}{n}.$$\n\nDividing it by $n$ gives the covariance: $\\operatorname{cov}(x, y) = \\frac{S_{xy}}{n}$.\n\nIf $n = 4$, $\\sum x = 10$, $\\sum y = 20$ and $\\sum xy = 62$, then $S_{xy} = 62 - \\frac{200}{4} = 12$.",
        "对成对数据，**乘积和**为\n\n$$S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y}) = \\sum xy - \\frac{\\sum x \\sum y}{n}.$$\n\n把它除以 $n$ 就得到协方差：$\\operatorname{cov}(x, y) = \\frac{S_{xy}}{n}$。\n\n若 $n = 4$，$\\sum x = 10$，$\\sum y = 20$，$\\sum xy = 62$，则 $S_{xy} = 62 - \\frac{200}{4} = 12$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5, 8, 10, 20]);
        const d = summaryData(rng, n);
        const ans = Q.of(d.sxy).sub(Q.of(d.sx * d.sy, n));
        const given = `n = ${n}, \\quad \\sum x = ${d.sx}, \\quad \\sum y = ${d.sy}, \\quad \\sum xy = ${d.sxy}`;
        return numberProblem({
          prompt: t(`For a set of data pairs, $${given}$. Find $S_{xy}$.`, `一组数对满足 $${given}$。求 $S_{xy}$。`),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(d.sxy - d.sx * d.sy), ans.div(Q.of(n)), Q.of(d.sxy).sub(Q.of(d.sx + d.sy, n))],
          solution: t(
            `Use $S_{xy} = \\sum xy - \\frac{\\sum x \\sum y}{n}$:${steps(`S_{xy} = ${d.sxy} - \\frac{${d.sx} \\cdot ${d.sy}}{${n}} = ${d.sxy} - ${dec(Q.of(d.sx * d.sy, n))} = ${dec(ans)}`)}`,
            `利用 $S_{xy} = \\sum xy - \\frac{\\sum x \\sum y}{n}$：${steps(`S_{xy} = ${d.sxy} - \\frac{${d.sx} \\cdot ${d.sy}}{${n}} = ${d.sxy} - ${dec(Q.of(d.sx * d.sy, n))} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
  ],
};

/** zScenes are measurements with the range of their means, in multiples of 5: name, unit, lowest and highest mean. */
const zScenes = [
  ["test scores", "测验成绩", "points", "分", 10, 18],
  ["heights of adults", "成年人的身高", "cm", "厘米", 30, 37],
  ["masses of packages", "包裹的质量", "kg", "千克", 2, 8],
  ["daily temperatures", "每日气温", "°F", "华氏度", 8, 18],
  ["commute times", "通勤时间", "minutes", "分钟", 4, 12],
] as const;

/** zSetting draws a scene, a mean and a standard deviation small enough that values within three standard deviations stay positive. */
function zSetting(rng: Rng) {
  const sc = rng.pick(zScenes);
  const mu = rng.int(sc[4], sc[5]) * 5;
  const sd = rng.pick(Z_SDS.filter((v) => 4 * v <= mu));
  return { sc, mu, sd };
}

/** Z_SDS are standard deviations used with z-scores. */
const Z_SDS = [2, 4, 5, 6, 8, 10, 12, 15, 20] as const;

/** zValue draws a nonzero z-score in quarters with z·σ an integer. */
function zValue(rng: Rng, sd: number): Q {
  for (;;) {
    const z = Q.of(rng.nonZero(-12, 12), 4);
    if (z.mul(Q.of(sd)).isInteger()) return z;
  }
}

/** theZScore teaches standardizing a value. */
const theZScore: TopicDef = {
  id: "the-z-score",
  title: t("The Z-Score", "Z 分数"),
  summary: t(
    "Standardize a value by its z-score, find a value from its z-score, and compare values from different distributions.",
    "用 z 分数把数值标准化，由 z 分数求数值，并比较来自不同分布的数值。",
  ),
  prerequisites: ["variance-and-standard-deviation"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSS.ID.A.4"],
  knowledgePoints: [
    {
      id: "computing-a-z-score",
      title: t("Computing a z-score", "计算 z 分数"),
      explanation: t(
        "The **z-score** of a value $x$ says how many standard deviations it lies above or below the mean:\n\n$$z = \\frac{x - \\mu}{\\sigma}.$$\n\nA positive $z$ is above the mean, a negative $z$ below it.\n\nIf the mean is $70$ and the standard deviation is $8$, a score of $82$ has $z = \\frac{82 - 70}{8} = 1.5$.",
        "数值 $x$ 的 **z 分数**表示它比均值高或低多少个标准差：\n\n$$z = \\frac{x - \\mu}{\\sigma}.$$\n\n$z$ 为正表示高于均值，为负表示低于均值。\n\n若均值为 $70$，标准差为 $8$，则 $82$ 分的 $z = \\frac{82 - 70}{8} = 1.5$。",
      ),
      generate(rng) {
        const { sc, mu, sd } = zSetting(rng);
        const z = zValue(rng, sd);
        const x = Q.of(mu).add(z.mul(Q.of(sd)));
        return numberProblem({
          prompt: t(
            `The ${sc[0]} in a study have mean $${mu}$ and standard deviation $${sd}$ (in ${sc[2]}). Find the z-score of the value $${x.toLatex()}$.`,
            `某研究中${sc[1]}的均值为 $${mu}$，标准差为 $${sd}$（单位：${sc[3]}）。求数值 $${x.toLatex()}$ 的 z 分数。`,
          ),
          answer: z,
          ...decimalForm(z),
          wrong: [z.neg(), z.div(Q.of(sd)), x.sub(Q.of(mu))],
          solution: t(
            `$$z = \\frac{${x.toLatex()} - ${mu}}{${sd}} = \\frac{${x.sub(Q.of(mu)).toLatex()}}{${sd}} = ${dec(z)}$$`,
            `$$z = \\frac{${x.toLatex()} - ${mu}}{${sd}} = \\frac{${x.sub(Q.of(mu)).toLatex()}}{${sd}} = ${dec(z)}$$`,
          ),
        });
      },
    },
    {
      id: "a-value-from-its-z-score",
      title: t("A value from its z-score", "由 z 分数求数值"),
      explanation: t(
        "A z-score tells how many standard deviations a value lies above or below the mean, so the value is the mean plus that many standard deviations. Solving $z = \\frac{x - \\mu}{\\sigma}$ for $x$ gives\n\n$$x = \\mu + z\\sigma.$$\n\nWith mean $50$ and standard deviation $6$, the value with $z = -1.5$ is $50 + (-1.5)(6) = 41$.",
        "z 分数表示一个值比平均数高或低多少个标准差，所以这个值等于平均数加上这么多个标准差。由 $z = \\frac{x - \\mu}{\\sigma}$ 解出 $x$，得\n\n$$x = \\mu + z\\sigma.$$\n\n均值为 $50$、标准差为 $6$ 时，$z = -1.5$ 对应的数值是 $50 + (-1.5)(6) = 41$。",
      ),
      generate(rng) {
        const { sc, mu, sd } = zSetting(rng);
        const z = zValue(rng, sd);
        const x = Q.of(mu).add(z.mul(Q.of(sd)));
        return numberProblem({
          prompt: t(
            `The ${sc[0]} in a study have mean $${mu}$ and standard deviation $${sd}$ (in ${sc[2]}). Which value has a z-score of $${dec(z)}$?`,
            `某研究中${sc[1]}的均值为 $${mu}$，标准差为 $${sd}$（单位：${sc[3]}）。z 分数为 $${dec(z)}$ 的数值是多少？`,
          ),
          answer: x,
          wrong: [Q.of(mu).sub(z.mul(Q.of(sd))), Q.of(mu).add(z), z.mul(Q.of(sd))],
          solution: t(
            `$$x = \\mu + z\\sigma = ${mu} + ${paren(dec(z))} \\cdot ${sd} = ${x.toLatex()}$$`,
            `$$x = \\mu + z\\sigma = ${mu} + ${paren(dec(z))} \\cdot ${sd} = ${x.toLatex()}$$`,
          ),
        });
      },
    },
    {
      id: "comparing-values-with-z-scores",
      title: t("Comparing values with z-scores", "用 z 分数比较数值"),
      explanation: t(
        "Values from different distributions cannot be compared directly, but their z-scores can: the larger z-score lies further above its own mean, measured in standard deviations.\n\nA score of $80$ on a test with mean $70$ and standard deviation $5$ has $z = 2$; a score of $90$ on a test with mean $75$ and standard deviation $10$ has $z = 1.5$. Relative to the other students, the $80$ is the better result.",
        "来自不同分布的数值不能直接比较，但可以比较它们的 z 分数：z 分数越大，以标准差为单位衡量，它高出自己所在分布均值的幅度就越大。\n\n均值 $70$、标准差 $5$ 的测验中得 $80$ 分，$z = 2$；均值 $75$、标准差 $10$ 的测验中得 $90$ 分，$z = 1.5$。与其他学生相比，$80$ 分是更好的成绩。",
      ),
      generate(rng) {
        const subjects = rng.sample(
          [
            ["math", "数学"],
            ["history", "历史"],
            ["biology", "生物"],
            ["English", "英语"],
            ["physics", "物理"],
          ] as const,
          2,
        );
        for (;;) {
          const sds = [rng.pick(Z_SDS), rng.pick(Z_SDS)];
          const mus = [rng.int(10, 16) * 5, rng.int(10, 16) * 5];
          const zs = sds.map((sd) => zValue(rng, sd));
          if (zs[0]!.eq(zs[1]!)) continue;
          const xs = zs.map((z, i) => Q.of(mus[i]!).add(z.mul(Q.of(sds[i]!))));
          const best = zs[0]!.cmp(zs[1]!) > 0 ? 0 : 1;
          const opts = subjects.map((s) => t(`The ${s[0]} test`, `${s[1]}测验`));
          const line = (i: number) =>
            `z_{\\text{${subjects[i]![0]}}} = \\frac{${xs[i]!.toLatex()} - ${mus[i]}}{${sds[i]}} = ${dec(zs[i]!)}`;
          const lineZ = (i: number) =>
            `z_{\\text{${subjects[i]![1]}}} = \\frac{${xs[i]!.toLatex()} - ${mus[i]}}{${sds[i]}} = ${dec(zs[i]!)}`;
          const desc = (i: number) =>
            `$${xs[i]!.toLatex()}$ on the ${subjects[i]![0]} test (mean $${mus[i]}$, standard deviation $${sds[i]}$)`;
          const descZ = (i: number) => `${subjects[i]![1]}测验得 $${xs[i]!.toLatex()}$ 分（均值 $${mus[i]}$，标准差 $${sds[i]}$）`;
          return choiceProblem({
            prompt: t(
              `A student scored ${desc(0)} and ${desc(1)}. On which test did the student do better relative to the other students?`,
              `一名学生${descZ(0)}，${descZ(1)}。与其他学生相比，该学生哪门测验考得更好？`,
            ),
            options: opts,
            correct: best,
            solution: t(
              `Compare the z-scores:${steps(line(0), line(1))}The ${subjects[best]![0]} score has the larger z-score.`,
              `比较 z 分数：${steps(lineZ(0), lineZ(1))}${subjects[best]![1]}成绩的 z 分数更大。`,
            ),
          });
        }
      },
    },
  ],
};

// ─── Module 12.42: Correlation ──────────────────────────────────────────────

/** lineLatex writes y = mx + b with decimal coefficients. */
const lineLatex = (mm: Q, b: Q, y = "\\hat{y}") => `${y} = ${coef(mm)}x ${signed(b)}`;

/** residualsAndResidualPlots teaches residuals and how to read residual plots. */
const residualsAndResidualPlots: TopicDef = {
  id: "residuals-and-residual-plots",
  title: t("Residuals and Residual Plots", "残差与残差图"),
  summary: t(
    "Compute residuals from a fitted line, recover a data value from its residual, and judge from a residual plot whether a linear model fits.",
    "由拟合直线计算残差，由残差还原数据值，并从残差图判断线性模型是否合适。",
  ),
  prerequisites: ["predictions-with-trend-lines"],
  encompasses: [{ topic: "predictions-with-trend-lines", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSS.ID.B.6.B"],
  knowledgePoints: [
    {
      id: "residuals-of-several-points",
      title: t("Residuals of data points", "数据点的残差"),
      explanation: t(
        "For a line of fit $\\hat{y} = mx + b$, the **residual** of a data point $(x, y)$ is\n\n$$e = y - \\hat{y},$$\n\nthe actual value minus the predicted value. Points above the line have positive residuals, points below it negative ones. For the least-squares line the residuals add up to $0$.\n\nWith $\\hat{y} = 1.5x + 2$, the point $(4, 9)$ has $\\hat{y} = 8$ and residual $9 - 8 = 1$.",
        "对拟合直线 $\\hat{y} = mx + b$，数据点 $(x, y)$ 的**残差**是\n\n$$e = y - \\hat{y},$$\n\n即实际值减去预测值。直线上方的点残差为正，下方的点残差为负。最小二乘直线的残差之和为 $0$。\n\n对 $\\hat{y} = 1.5x + 2$，点 $(4, 9)$ 的预测值 $\\hat{y} = 8$，残差为 $9 - 8 = 1$。",
      ),
      generate(rng) {
        const mm = Q.of(rng.nonZero(-30, 30), 10);
        const b = Q.of(rng.int(10, 400), 10);
        const xs = rng.sample(range(1, 12), 4).sort((a, c) => a - c);
        const ys = xs.map((x) =>
          mm
            .mul(Q.of(x))
            .add(b)
            .add(Q.of(rng.nonZero(-25, 25), 10)),
        );
        const j = rng.int(0, 3);
        const pred = mm.mul(Q.of(xs[j]!)).add(b);
        const ans = ys[j]!.sub(pred);
        const tab = table(["$x$", ...m(xs)], ["$y$", ...m(ys.map(dec))]);
        return numberProblem({
          prompt: t(
            `A line of fit for the data below is $${lineLatex(mm, b)}$.\n\n${tab}\n\nFind the residual of the data point with $x = ${xs[j]}$.`,
            `下表数据的一条拟合直线是 $${lineLatex(mm, b)}$。\n\n${tab}\n\n求 $x = ${xs[j]}$ 的数据点的残差。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [ans.neg(), pred, ys[j]!.add(pred)],
          solution: t(
            `The predicted value is $\\hat{y} = ${dec(mm)} \\cdot ${xs[j]} ${signed(b)} = ${dec(pred)}$, so the residual is${steps(`e = y - \\hat{y} = ${dec(ys[j]!)} - ${paren(dec(pred))} = ${dec(ans)}`)}`,
            `预测值为 $\\hat{y} = ${dec(mm)} \\cdot ${xs[j]} ${signed(b)} = ${dec(pred)}$，所以残差为${steps(`e = y - \\hat{y} = ${dec(ys[j]!)} - ${paren(dec(pred))} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "a-data-value-from-its-residual",
      title: t("A data value from its residual", "由残差求数据值"),
      explanation: t(
        "Since $e = y - \\hat{y}$, the actual value is the prediction plus the residual:\n\n$$y = \\hat{y} + e.$$\n\nWith $\\hat{y} = 2x + 5$, a point at $x = 3$ with residual $-1.5$ has $y = 11 + (-1.5) = 9.5$.",
        "由 $e = y - \\hat{y}$，实际值等于预测值加上残差：\n\n$$y = \\hat{y} + e.$$\n\n对 $\\hat{y} = 2x + 5$，在 $x = 3$ 处残差为 $-1.5$ 的点，其 $y = 11 + (-1.5) = 9.5$。",
      ),
      generate(rng) {
        const mm = Q.of(rng.nonZero(-40, 40), 10);
        const b = Q.of(rng.int(10, 500), 10);
        const x = rng.int(1, 15);
        const e = Q.of(rng.nonZero(-40, 40), 10);
        const pred = mm.mul(Q.of(x)).add(b);
        const ans = pred.add(e);
        return numberProblem({
          prompt: t(
            `The least-squares line for a data set is $${lineLatex(mm, b)}$. The data point with $x = ${x}$ has residual $${dec(e)}$. Find its $y$-value.`,
            `某组数据的最小二乘直线是 $${lineLatex(mm, b)}$。$x = ${x}$ 的数据点残差为 $${dec(e)}$。求它的 $y$ 值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [pred.sub(e), pred, e],
          solution: t(
            `The prediction at $x = ${x}$ is $\\hat{y} = ${dec(mm)} \\cdot ${x} ${signed(b)} = ${dec(pred)}$. So${steps(`y = \\hat{y} + e = ${dec(pred)} + ${paren(dec(e))} = ${dec(ans)}`)}`,
            `$x = ${x}$ 处的预测值为 $\\hat{y} = ${dec(mm)} \\cdot ${x} ${signed(b)} = ${dec(pred)}$。所以${steps(`y = \\hat{y} + e = ${dec(pred)} + ${paren(dec(e))} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "reading-residual-plots",
      title: t("Reading residual plots", "阅读残差图"),
      explanation: t(
        "A **residual plot** shows the residual $e$ of each data point against $x$.\n\n- If the residuals are scattered randomly above and below $0$ with no pattern, a linear model is appropriate.\n- If they form a curve, for example positive at both ends and negative in the middle, the relationship is not linear and another model (such as a quadratic or exponential one) fits better.",
        "**残差图**画出每个数据点的残差 $e$ 关于 $x$ 的图。\n\n- 如果残差在 $0$ 的上下随机分布、没有规律，线性模型是合适的。\n- 如果残差呈曲线形状，例如两端为正、中间为负，说明关系不是线性的，另一种模型（如二次或指数模型）拟合得更好。",
      ),
      generate(rng) {
        const curved = rng.bool();
        const xs = range(1, 11);
        let es: number[];
        for (;;) {
          if (curved) {
            const a = rng.sign() * rng.pick([0.15, 0.2, 0.25]);
            const c = rng.int(4, 7);
            const shift = sum(xs.map((x) => a * (x - c) ** 2)) / xs.length;
            es = xs.map((x) => Math.round((a * (x - c) ** 2 - shift) * 2) / 2 + rng.pick([-0.5, 0, 0, 0.5]));
          } else {
            es = xs.map(() => rng.int(-6, 6) / 2);
          }
          const pos = es.filter((e) => e > 0).length;
          const neg = es.filter((e) => e < 0).length;
          if (pos < 3 || neg < 3 || es.some((e) => Math.abs(e) > 4.5)) continue;
          if (!curved) {
            // A random plot must not look like a parabola: its ends must not share a sign against the middle.
            const ends = es[0]! + es[1]! + es[9]! + es[10]!;
            const mid = es[4]! + es[5]! + es[6]!;
            if (Math.sign(ends) !== 0 && Math.sign(ends) === -Math.sign(mid) && Math.abs(ends - mid) > 4) continue;
          }
          break;
        }
        const marks: PlaneMark[] = [
          { kind: "line", a: [0, 0], b: [1, 0], accent: true, dashed: true },
          ...xs.map((x, i): PlaneMark => ({ kind: "point", at: [x, es[i]!] })),
        ];
        const list = xs.map((x, i) => `(${x}, ${es[i]})`).join(", ");
        const figure: Figure = {
          svg: plane({ xMin: 0, xMax: 12, yMin: -5, yMax: 5, labelEvery: 2 }, marks),
          alt: t(`Residual plot with points ${list}.`, `残差图，各点为 ${list}。`),
        };
        const fits = t(
          "A linear model is appropriate: the residuals are scattered randomly about $0$.",
          "线性模型合适：残差在 $0$ 附近随机分布。",
        );
        const curve = t("A linear model is not appropriate: the residuals follow a curved pattern.", "线性模型不合适：残差呈曲线规律。");
        const allPos = t(
          "A linear model is not appropriate: most residuals are not equal to $0$.",
          "线性模型不合适：大多数残差不等于 $0$。",
        );
        const wrongSign = t("A linear model is appropriate: the residuals follow a curved pattern.", "线性模型合适：残差呈曲线规律。");
        const options = [fits, curve, allPos, wrongSign];
        const problem = choiceProblem({
          prompt: t(
            "A line was fitted to a data set. The residual plot is shown. What does it say about the linear model?",
            "对一组数据拟合了一条直线，其残差图如下。关于线性模型，残差图说明了什么？",
          ),
          options,
          correct: curved ? 1 : 0,
          solution: curved
            ? t(
                "The residuals are on one side of $0$ at both ends and on the other side in the middle: a curved pattern. The data follow a curve, so a linear model is not appropriate.",
                "残差在两端位于 $0$ 的一侧，在中间位于另一侧，呈曲线规律。数据沿曲线分布，所以线性模型不合适。",
              )
            : t(
                "The residuals are scattered above and below $0$ with no pattern, so a linear model is appropriate. Residuals are never all $0$ for real data.",
                "残差在 $0$ 的上下分布且没有规律，所以线性模型合适。真实数据的残差不可能全为 $0$。",
              ),
        });
        return { ...problem, figure };
      },
    },
  ],
};

/** theLinearCorrelationCoefficient teaches computing r and how it behaves under changes of units. */
const theLinearCorrelationCoefficient: TopicDef = {
  id: "the-linear-correlation-coefficient",
  title: t("The Linear Correlation Coefficient", "线性相关系数"),
  summary: t(
    "Compute the correlation coefficient $r$ from sums of squares and from the covariance and standard deviations, and see how it changes when the data are rescaled.",
    "由平方和、以及由协方差和标准差计算相关系数 $r$，并了解数据作线性变换时 $r$ 如何变化。",
  ),
  prerequisites: ["sums-of-squares", "linear-correlation"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSS.ID.C.8"],
  knowledgePoints: [
    {
      id: "r-from-sums-of-squares",
      title: t("r from sums of squares", "由平方和求 r"),
      explanation: t(
        "The **(Pearson) correlation coefficient** is\n\n$$r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}.$$\n\nIt has no units and always satisfies $-1 \\le r \\le 1$: values near $\\pm 1$ mean a strong linear relationship, values near $0$ a weak one, and its sign is the sign of $S_{xy}$.\n\nIf $S_{xx} = 40$, $S_{yy} = 90$ and $S_{xy} = -48$, then $r = \\frac{-48}{\\sqrt{3600}} = \\frac{-48}{60} = -0.8$.",
        "**（皮尔逊）相关系数**为\n\n$$r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}.$$\n\n它没有单位，并且总有 $-1 \\le r \\le 1$：接近 $\\pm 1$ 表示线性关系强，接近 $0$ 表示线性关系弱，它的符号与 $S_{xy}$ 的符号相同。\n\n若 $S_{xx} = 40$，$S_{yy} = 90$，$S_{xy} = -48$，则 $r = \\frac{-48}{\\sqrt{3600}} = \\frac{-48}{60} = -0.8$。",
      ),
      generate(rng) {
        for (;;) {
          const sxx = rng.int(20, 200);
          const syy = rng.int(20, 400);
          const root = Math.sqrt(sxx * syy);
          const sxy = rng.sign() * rng.int(Math.ceil(root * 0.2), Math.floor(root * 0.98));
          const ans = rounded(sxy / root, 2);
          if (!ans || ans.isZero()) continue;
          const given = `S_{xx} = ${sxx}, \\quad S_{yy} = ${syy}, \\quad S_{xy} = ${sxy}`;
          return numberProblem({
            prompt: t(
              `For a set of data pairs, $${given}$. Find the correlation coefficient $r$, rounded to two decimal places.`,
              `一组数对满足 $${given}$。求相关系数 $r$，结果保留两位小数。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: defined(rounded(sxy / (sxx * syy), 4), rounded(sxy / Math.sqrt(sxx + syy), 2), ans.neg()),
            solution: t(
              `$$r = \\frac{${sxy}}{\\sqrt{${sxx} \\cdot ${syy}}} = \\frac{${sxy}}{\\sqrt{${sxx * syy}}} \\approx ${dec(ans)}$$`,
              `$$r = \\frac{${sxy}}{\\sqrt{${sxx} \\cdot ${syy}}} = \\frac{${sxy}}{\\sqrt{${sxx * syy}}} \\approx ${dec(ans)}$$`,
            ),
          });
        }
      },
    },
    {
      id: "r-from-the-covariance",
      title: t("r from the covariance", "由协方差求 r"),
      explanation: t(
        "Dividing $S_{xy}$, $S_{xx}$ and $S_{yy}$ by $n$ turns them into the covariance and the variances, so\n\n$$r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y}.$$\n\nIf $\\operatorname{cov}(x, y) = 9$, $\\sigma_x = 3$ and $\\sigma_y = 5$, then $r = \\frac{9}{15} = 0.6$.",
        "把 $S_{xy}$、$S_{xx}$、$S_{yy}$ 都除以 $n$，就得到协方差和方差，所以\n\n$$r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y}.$$\n\n若 $\\operatorname{cov}(x, y) = 9$，$\\sigma_x = 3$，$\\sigma_y = 5$，则 $r = \\frac{9}{15} = 0.6$。",
      ),
      generate(rng) {
        const sx = rng.int(2, 12);
        const sy = rng.int(2, 20);
        const r = Q.of(rng.sign() * rng.int(10, 98), 100);
        const cov = r.mul(Q.of(sx * sy));
        return numberProblem({
          prompt: t(
            `Paired data have covariance $${dec(cov)}$, and the standard deviations of $x$ and $y$ are $\\sigma_x = ${sx}$ and $\\sigma_y = ${sy}$. Find the correlation coefficient $r$.`,
            `成对数据的协方差为 $${dec(cov)}$，$x$ 与 $y$ 的标准差分别为 $\\sigma_x = ${sx}$，$\\sigma_y = ${sy}$。求相关系数 $r$。`,
          ),
          answer: r,
          form: "decimal",
          wrong: [cov.div(Q.of(sx * sx * sy * sy)), cov.div(Q.of(sx + sy)), r.neg()],
          solution: t(
            `$$r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y} = \\frac{${dec(cov)}}{${sx} \\cdot ${sy}} = ${dec(r)}$$`,
            `$$r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y} = \\frac{${dec(cov)}}{${sx} \\cdot ${sy}} = ${dec(r)}$$`,
          ),
        });
      },
    },
    {
      id: "r-after-a-change-of-units",
      title: t("r after a change of units", "单位变换后的 r"),
      explanation: t(
        "If every $x$ is replaced by $ax + b$ and every $y$ by $cy + d$, each deviation is multiplied by $a$ or $c$, and the shifts $b$ and $d$ cancel out. In the formula for $r$ the sizes of $a$ and $c$ cancel too, leaving only their signs:\n\n$$r_{\\text{new}} = \\begin{cases} r & \\text{if } ac > 0, \\\\ -r & \\text{if } ac < 0. \\end{cases}$$\n\nConverting temperatures from Celsius to Fahrenheit ($F = 1.8C + 32$) does not change $r$; replacing $x$ by $-2x$ changes its sign.",
        "若把每个 $x$ 换成 $ax + b$，每个 $y$ 换成 $cy + d$，那么每个偏差都乘以 $a$ 或 $c$，平移量 $b$ 和 $d$ 被抵消。在 $r$ 的公式中，$a$ 与 $c$ 的大小也会约去，只剩下它们的符号：\n\n$$r_{\\text{新}} = \\begin{cases} r & \\text{若 } ac > 0, \\\\ -r & \\text{若 } ac < 0. \\end{cases}$$\n\n把温度从摄氏度换成华氏度（$F = 1.8C + 32$）不改变 $r$；把 $x$ 换成 $-2x$ 会改变 $r$ 的符号。",
      ),
      generate(rng) {
        const r = Q.of(rng.sign() * rng.int(10, 98), 100);
        const a = rng.pick([2, 3, 5, 10, -1, -2, -4, 0.5, 1.8]);
        const b = rng.int(-20, 20);
        const c = rng.pick([2, 4, 10, 100, -1, -3, 0.1, 2.54]);
        const d = rng.int(-30, 30);
        const ac = a * c;
        const ans = ac > 0 ? r : r.neg();
        const aq = Q.parse(String(a));
        const cq = Q.parse(String(c));
        const form = (k: Q, s: number, v: string) =>
          `${k.eq(Q.of(-1)) ? "-" : dec(k)}${v}${s === 0 ? "" : ` ${s < 0 ? "-" : "+"} ${Math.abs(s)}`}`;
        return numberProblem({
          prompt: t(
            `Paired data $(x, y)$ have correlation coefficient $r = ${dec(r)}$. New variables are defined by $X = ${form(aq, b, "x")}$ and $Y = ${form(cq, d, "y")}$. Find the correlation coefficient of $X$ and $Y$.`,
            `成对数据 $(x, y)$ 的相关系数为 $r = ${dec(r)}$。定义新变量 $X = ${form(aq, b, "x")}$，$Y = ${form(cq, d, "y")}$。求 $X$ 与 $Y$ 的相关系数。`,
          ),
          answer: ans,
          form: "decimal",
          wrong: [ans.neg(), ...defined(rounded(r.toNumber() * ac, 4))],
          solution: t(
            `Shifts do not change $r$, and the scale factors $${dec(aq)}$ and $${dec(cq)}$ affect only its sign. Their product is ${ac > 0 ? "positive, so $r$ is unchanged" : "negative, so $r$ changes sign"}: the new correlation coefficient is $${dec(ans)}$.`,
            `平移不改变 $r$，伸缩因子 $${dec(aq)}$ 和 $${dec(cq)}$ 只影响它的符号。两者之积为${ac > 0 ? "正，所以 $r$ 不变" : "负，所以 $r$ 变号"}：新的相关系数是 $${dec(ans)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Module 12.43: Regression ───────────────────────────────────────────────

/** linearRegression teaches the least-squares regression line. */
const linearRegression: TopicDef = {
  id: "linear-regression",
  title: t("Linear Regression", "线性回归"),
  summary: t(
    "Find the slope and intercept of the least-squares regression line of $y$ on $x$ from summary statistics, and use the line to predict.",
    "由汇总统计量求 $y$ 关于 $x$ 的最小二乘回归直线的斜率和截距，并用它作预测。",
  ),
  prerequisites: ["sums-of-squares", "predictions-with-trend-lines"],
  encompasses: [{ topic: "predictions-with-trend-lines", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSS.ID.B.6.A", "CCSS.HSS.ID.C.7"],
  knowledgePoints: [
    {
      id: "the-slope-of-the-regression-line",
      title: t("The slope of the regression line", "回归直线的斜率"),
      explanation: t(
        "The **least-squares regression line** $\\hat{y} = a + bx$ is the line that makes the sum of the squared residuals as small as possible. Its slope is\n\n$$b = \\frac{S_{xy}}{S_{xx}}.$$\n\nIf $S_{xy} = 36$ and $S_{xx} = 48$, then $b = \\frac{36}{48} = 0.75$: each extra unit of $x$ adds $0.75$ to the predicted $y$.",
        "**最小二乘回归直线** $\\hat{y} = a + bx$ 是使残差平方和最小的直线。它的斜率为\n\n$$b = \\frac{S_{xy}}{S_{xx}}.$$\n\n若 $S_{xy} = 36$，$S_{xx} = 48$，则 $b = \\frac{36}{48} = 0.75$：$x$ 每增加一个单位，$y$ 的预测值增加 $0.75$。",
      ),
      generate(rng) {
        const sxx = rng.pick([8, 10, 16, 20, 25, 32, 40, 50, 64, 80]) * rng.int(1, 3);
        const syy = rng.int(30, 500);
        for (;;) {
          const b = Q.of(rng.nonZero(-40, 40), 4);
          const sxy = b.mul(Q.of(sxx));
          if (!terminating(sxy) || sxy.abs().toNumber() > Math.sqrt(sxx * syy)) continue;
          const given = `S_{xx} = ${sxx}, \\quad S_{yy} = ${syy}, \\quad S_{xy} = ${dec(sxy)}`;
          return numberProblem({
            prompt: t(
              `For a set of data pairs, $${given}$. Find the slope $b$ of the least-squares regression line of $y$ on $x$.`,
              `一组数对满足 $${given}$。求 $y$ 关于 $x$ 的最小二乘回归直线的斜率 $b$。`,
            ),
            answer: b,
            ...decimalForm(b),
            wrong: [sxy.div(Q.of(syy)), Q.of(sxx).div(sxy), b.neg()],
            solution: t(
              `$$b = \\frac{S_{xy}}{S_{xx}} = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}$$`,
              `$$b = \\frac{S_{xy}}{S_{xx}} = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}$$`,
            ),
          });
        }
      },
    },
    {
      id: "the-intercept-of-the-regression-line",
      title: t("The intercept of the regression line", "回归直线的截距"),
      explanation: t(
        "The regression line always passes through the point of means $(\\bar{x}, \\bar{y})$. So $\\bar{y} = a + b\\bar{x}$, and the intercept is\n\n$$a = \\bar{y} - b\\bar{x}.$$\n\nIf $\\bar{x} = 6$, $\\bar{y} = 20$ and $b = 1.5$, then $a = 20 - 1.5 \\cdot 6 = 11$ and the line is $\\hat{y} = 11 + 1.5x$.",
        "回归直线总是经过均值点 $(\\bar{x}, \\bar{y})$。所以 $\\bar{y} = a + b\\bar{x}$，截距为\n\n$$a = \\bar{y} - b\\bar{x}.$$\n\n若 $\\bar{x} = 6$，$\\bar{y} = 20$，$b = 1.5$，则 $a = 20 - 1.5 \\cdot 6 = 11$，回归直线为 $\\hat{y} = 11 + 1.5x$。",
      ),
      generate(rng) {
        const mx = Q.of(rng.int(10, 150), 10);
        const my = Q.of(rng.int(50, 900), 10);
        const b = Q.of(rng.nonZero(-50, 50), 10);
        const ans = my.sub(b.mul(mx));
        return numberProblem({
          prompt: t(
            `The least-squares regression line of $y$ on $x$ has slope $b = ${dec(b)}$, and the data have means $\\bar{x} = ${dec(mx)}$ and $\\bar{y} = ${dec(my)}$. Find the intercept $a$ of the line $\\hat{y} = a + bx$.`,
            `$y$ 关于 $x$ 的最小二乘回归直线的斜率为 $b = ${dec(b)}$，数据的均值为 $\\bar{x} = ${dec(mx)}$，$\\bar{y} = ${dec(my)}$。求直线 $\\hat{y} = a + bx$ 的截距 $a$。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [my.add(b.mul(mx)), mx.sub(b.mul(my)), my.sub(b)],
          solution: t(
            `The line passes through $(\\bar{x}, \\bar{y})$:${steps(`a = \\bar{y} - b\\bar{x} = ${dec(my)} - ${paren(dec(b))} \\cdot ${dec(mx)} = ${dec(ans)}`)}`,
            `直线经过 $(\\bar{x}, \\bar{y})$：${steps(`a = \\bar{y} - b\\bar{x} = ${dec(my)} - ${paren(dec(b))} \\cdot ${dec(mx)} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "predicting-with-the-regression-line",
      title: t("Predicting with the regression line", "用回归直线作预测"),
      explanation: t(
        "To predict from summary statistics, find the slope $b = \\frac{S_{xy}}{S_{xx}}$, then the intercept $a = \\bar{y} - b\\bar{x}$, and substitute the value of $x$ into $\\hat{y} = a + bx$.\n\nWith $n = 5$, $\\sum x = 30$, $\\sum y = 60$, $S_{xx} = 20$ and $S_{xy} = 50$: $b = 2.5$, $\\bar{x} = 6$, $\\bar{y} = 12$, $a = 12 - 15 = -3$, and at $x = 8$ the prediction is $\\hat{y} = -3 + 2.5 \\cdot 8 = 17$.",
        "要由汇总统计量作预测，先求斜率 $b = \\frac{S_{xy}}{S_{xx}}$，再求截距 $a = \\bar{y} - b\\bar{x}$，然后把 $x$ 的值代入 $\\hat{y} = a + bx$。\n\n若 $n = 5$，$\\sum x = 30$，$\\sum y = 60$，$S_{xx} = 20$，$S_{xy} = 50$：$b = 2.5$，$\\bar{x} = 6$，$\\bar{y} = 12$，$a = 12 - 15 = -3$，在 $x = 8$ 处的预测值为 $\\hat{y} = -3 + 2.5 \\cdot 8 = 17$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5, 8, 10]);
        const mx = rng.int(3, 15);
        const my = rng.int(10, 60);
        const sxx = rng.pick([10, 20, 40, 50, 80]);
        const b = Q.of(rng.nonZero(-12, 12), 4);
        const sxy = b.mul(Q.of(sxx));
        const x0 = mx + rng.nonZero(-3, 3);
        const a = Q.of(my).sub(b.mul(Q.of(mx)));
        const ans = a.add(b.mul(Q.of(x0)));
        const given = `n = ${n}, \\quad \\sum x = ${n * mx}, \\quad \\sum y = ${n * my}, \\quad S_{xx} = ${sxx}, \\quad S_{xy} = ${dec(sxy)}`;
        return numberProblem({
          prompt: t(
            `For a set of data pairs, $${given}$. Use the least-squares regression line of $y$ on $x$ to predict $y$ when $x = ${x0}$.`,
            `一组数对满足 $${given}$。用 $y$ 关于 $x$ 的最小二乘回归直线预测 $x = ${x0}$ 时 $y$ 的值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [b.mul(Q.of(x0)), Q.of(my).add(b.mul(Q.of(x0))), a.add(Q.of(x0))],
          solution: t(
            `Find the line, then substitute:${steps(`b = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}, \\quad \\bar{x} = ${mx}, \\quad \\bar{y} = ${my}`, `a = ${my} - ${paren(dec(b))} \\cdot ${mx} = ${dec(a)}`, `\\hat{y} = ${dec(a)} + ${paren(dec(b))} \\cdot ${x0} = ${dec(ans)}`)}`,
            `先求回归直线，再代入：${steps(`b = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}, \\quad \\bar{x} = ${mx}, \\quad \\bar{y} = ${my}`, `a = ${my} - ${paren(dec(b))} \\cdot ${mx} = ${dec(a)}`, `\\hat{y} = ${dec(a)} + ${paren(dec(b))} \\cdot ${x0} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
  ],
};

/** quadScenes are settings for quadratic models: x and y with their units. */
const quadScenes = [
  ["the height $y$, in meters, of a ball", "$x$ seconds after it is thrown", "球的高度 $y$（米）", "抛出 $x$ 秒后"],
  [
    "the weekly profit $y$, in hundreds of dollars, of a shop",
    "when an item is priced at $x$ dollars",
    "某商店每周的利润 $y$（百美元）",
    "商品定价为 $x$ 美元时",
  ],
  ["the yield $y$, in kilograms, of a plot", "when $x$ grams of fertilizer are used", "一块地的产量 $y$（千克）", "使用 $x$ 克肥料时"],
  [
    "the fuel economy $y$, in miles per gallon, of a car",
    "at a speed of $x$ tens of miles per hour",
    "汽车的燃油经济性 $y$（英里/加仑）",
    "车速为 $x$ 个十英里/小时时",
  ],
] as const;

/** quadLatex writes y = ax^2 + bx + c with decimal coefficients. */
const quadLatex = (a: Q, b: Q, c: Q) => `\\hat{y} = ${coef(a)}x^2 ${signedTerm(b, "x")} ${signed(c)}`;

/** quadraticRegression teaches using quadratic regression models. */
const quadraticRegression: TopicDef = {
  id: "quadratic-regression",
  title: t("Quadratic Regression", "二次回归"),
  summary: t(
    "Use a quadratic regression model to make predictions, compute residuals, and find the maximum or minimum it predicts.",
    "用二次回归模型作预测、计算残差，并求模型预测的最大值或最小值。",
  ),
  prerequisites: ["linear-regression", "selecting-a-regression-model", "the-vertex-of-a-parabola"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSS.ID.B.6.A"],
  knowledgePoints: [
    {
      id: "predicting-with-a-quadratic-model",
      title: t("Predicting with a quadratic model", "用二次模型作预测"),
      explanation: t(
        "When a scatter plot rises and then falls (or falls and then rises), a **quadratic regression** fits a model $\\hat{y} = ax^2 + bx + c$ by least squares; technology finds the coefficients. To predict, substitute the value of $x$.\n\nWith $\\hat{y} = -0.5x^2 + 4x + 1$, at $x = 3$ the prediction is $-4.5 + 12 + 1 = 8.5$.",
        "当散点图先升后降（或先降后升）时，**二次回归**用最小二乘法拟合模型 $\\hat{y} = ax^2 + bx + c$，系数由计算工具求出。作预测时，把 $x$ 的值代入即可。\n\n对 $\\hat{y} = -0.5x^2 + 4x + 1$，在 $x = 3$ 处的预测值为 $-4.5 + 12 + 1 = 8.5$。",
      ),
      generate(rng) {
        const sc = rng.pick(quadScenes);
        const a = Q.of(rng.nonZero(-20, 20), 10);
        const b = Q.of(rng.nonZero(-60, 60), 10);
        const c = Q.of(rng.int(0, 300), 10);
        const x = rng.int(2, 9);
        const X = Q.of(x);
        const ans = a.mul(X.mul(X)).add(b.mul(X)).add(c);
        return numberProblem({
          prompt: t(
            `A quadratic regression for ${sc[0]} ${sc[1]} gives $${quadLatex(a, b, c)}$. Predict $y$ when $x = ${x}$.`,
            `对${sc[3]}${sc[2]}作二次回归，得到 $${quadLatex(a, b, c)}$。预测 $x = ${x}$ 时 $y$ 的值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [
            a.mul(X).add(b.mul(X)).add(c),
            a
              .mul(Q.of(2 * x))
              .add(b.mul(X))
              .add(c),
            a.mul(X.mul(X)).sub(b.mul(X)).add(c),
          ],
          solution: t(
            `$$\\hat{y} = ${dec(a)} \\cdot ${x}^2 ${signed(b)} \\cdot ${x} ${signed(c)} = ${dec(a.mul(X.mul(X)))} ${signed(b.mul(X))} ${signed(c)} = ${dec(ans)}$$`,
            `$$\\hat{y} = ${dec(a)} \\cdot ${x}^2 ${signed(b)} \\cdot ${x} ${signed(c)} = ${dec(a.mul(X.mul(X)))} ${signed(b.mul(X))} ${signed(c)} = ${dec(ans)}$$`,
          ),
        });
      },
    },
    {
      id: "residuals-of-a-quadratic-model",
      title: t("Residuals of a quadratic model", "二次模型的残差"),
      explanation: t(
        "Residuals work the same way for any model: the residual of a data point is its actual value minus the value the model predicts, $e = y - \\hat{y}$.\n\nWith $\\hat{y} = 0.5x^2 - 2x + 6$, the data point $(4, 7.2)$ has $\\hat{y} = 8 - 8 + 6 = 6$ and residual $7.2 - 6 = 1.2$.",
        "对任何模型，残差的算法都相同：数据点的残差等于实际值减去模型的预测值，$e = y - \\hat{y}$。\n\n对 $\\hat{y} = 0.5x^2 - 2x + 6$，数据点 $(4, 7.2)$ 的 $\\hat{y} = 8 - 8 + 6 = 6$，残差为 $7.2 - 6 = 1.2$。",
      ),
      generate(rng) {
        const a = Q.of(rng.nonZero(-10, 10), 10);
        const b = Q.of(rng.nonZero(-40, 40), 10);
        const c = Q.of(rng.int(20, 300), 10);
        const x = rng.int(1, 8);
        const X = Q.of(x);
        const pred = a.mul(X.mul(X)).add(b.mul(X)).add(c);
        const e = Q.of(rng.nonZero(-30, 30), 10);
        const y = pred.add(e);
        return numberProblem({
          prompt: t(
            `A quadratic regression model for a data set is $${quadLatex(a, b, c)}$. Find the residual of the data point $(${x}, ${dec(y)})$.`,
            `某组数据的二次回归模型为 $${quadLatex(a, b, c)}$。求数据点 $(${x}, ${dec(y)})$ 的残差。`,
          ),
          answer: e,
          form: "decimal",
          wrong: [e.neg(), pred, y],
          solution: t(
            `The model predicts $\\hat{y} = ${dec(a)} \\cdot ${x}^2 ${signed(b)} \\cdot ${x} ${signed(c)} = ${dec(pred)}$, so${steps(`e = ${dec(y)} - ${paren(dec(pred))} = ${dec(e)}`)}`,
            `模型的预测值为 $\\hat{y} = ${dec(a)} \\cdot ${x}^2 ${signed(b)} \\cdot ${x} ${signed(c)} = ${dec(pred)}$，所以${steps(`e = ${dec(y)} - ${paren(dec(pred))} = ${dec(e)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-extreme-value-of-a-quadratic-model",
      title: t("The extreme value of a quadratic model", "二次模型的最值"),
      explanation: t(
        "The model $\\hat{y} = ax^2 + bx + c$ has its vertex at\n\n$$x = -\\frac{b}{2a}.$$\n\nIf $a < 0$ it predicts a maximum there, and if $a > 0$ a minimum. Substitute this $x$ to find the predicted extreme value.\n\nFor $\\hat{y} = -0.2x^2 + 2.4x + 3$: $x = -\\frac{2.4}{-0.4} = 6$ and the maximum is $-7.2 + 14.4 + 3 = 10.2$.",
        "模型 $\\hat{y} = ax^2 + bx + c$ 的顶点在\n\n$$x = -\\frac{b}{2a}.$$\n\n若 $a < 0$，模型在该处预测最大值；若 $a > 0$，则预测最小值。代入这个 $x$ 即可求出预测的最值。\n\n对 $\\hat{y} = -0.2x^2 + 2.4x + 3$：$x = -\\frac{2.4}{-0.4} = 6$，最大值为 $-7.2 + 14.4 + 3 = 10.2$。",
      ),
      generate(rng) {
        const sc = rng.pick(quadScenes);
        const max = sc !== quadScenes[3] || rng.bool();
        const a = Q.of((max ? -1 : 1) * rng.int(1, 9), 10);
        const h = rng.int(2, 12);
        const b = a.mul(Q.of(-2 * h));
        const c = Q.of(rng.int(0, 200), 10);
        const H = Q.of(h);
        const top = a.mul(H.mul(H)).add(b.mul(H)).add(c);
        const askX = rng.bool();
        const word = max ? ["maximum", "最大值"] : ["minimum", "最小值"];
        return numberProblem({
          prompt: t(
            askX
              ? `A quadratic regression for ${sc[0]} ${sc[1]} gives $${quadLatex(a, b, c)}$. For which $x$ does the model predict the ${word[0]} of $y$?`
              : `A quadratic regression for ${sc[0]} ${sc[1]} gives $${quadLatex(a, b, c)}$. What ${word[0]} value of $y$ does the model predict?`,
            askX
              ? `对${sc[3]}${sc[2]}作二次回归，得到 $${quadLatex(a, b, c)}$。模型预测 $x$ 为多少时 $y$ 取${word[1]}？`
              : `对${sc[3]}${sc[2]}作二次回归，得到 $${quadLatex(a, b, c)}$。模型预测 $y$ 的${word[1]}是多少？`,
          ),
          answer: askX ? H : top,
          ...decimalForm(askX ? H : top),
          wrong: askX ? [H.neg(), Q.of(2 * h), b.div(a)] : [H, c, top.sub(c).neg().add(c)],
          solution: t(
            `The vertex is at${steps(`x = -\\frac{${dec(b)}}{2 \\cdot ${paren(dec(a))}} = ${h}`)}${askX ? "" : `and the predicted ${word[0]} is${steps(`\\hat{y} = ${dec(a)} \\cdot ${h}^2 ${signed(b)} \\cdot ${h} ${signed(c)} = ${dec(top)}`)}`}`,
            `顶点位于${steps(`x = -\\frac{${dec(b)}}{2 \\cdot ${paren(dec(a))}} = ${h}`)}${askX ? "" : `预测的${word[1]}为${steps(`\\hat{y} = ${dec(a)} \\cdot ${h}^2 ${signed(b)} \\cdot ${h} ${signed(c)} = ${dec(top)}`)}`}`,
          ),
        });
      },
    },
  ],
};

/** LOG_DIGITS are approximate common logarithms of 2 to 9, in thousandths. */
const LOG_DIGITS: Record<number, number> = { 2: 301, 3: 477, 4: 602, 5: 699, 6: 778, 7: 845, 8: 903, 9: 954 };

/** pow10 writes 10^k as a decimal. */
const pow10 = (k: number) => dec(k >= 0 ? Q.of(10 ** k) : Q.of(1, 10 ** -k));

/** semiLogFigure plots log y against x for y = 5, 15, 45, 135 (on a line) and y = 5, 15, 25, 35 (bending down). */
const semiLogFigure: Figure = {
  svg: plane({ xMin: 0, xMax: 4, yMin: 0, yMax: 2.5, step: 0.5, labelEvery: 2 }, [
    { kind: "line", a: [0, Math.log10(5)], b: [1, Math.log10(15)], accent: true, dashed: true },
    ...[5, 15, 45, 135].map((y, x): PlaneMark => ({ kind: "point", at: [x, Math.log10(y)], accent: true })),
    ...[25, 35].map((y, i): PlaneMark => ({ kind: "point", at: [i + 2, Math.log10(y)], open: true })),
    { kind: "label", at: [3, Math.log10(135)], text: "5, 15, 45, 135", dir: "w" },
    { kind: "label", at: [3, Math.log10(35)], text: "5, 15, 25, 35", dir: "se" },
    { kind: "label", at: [0, 2.4], text: "log y", dir: "e" },
  ]),
  alt: t(
    "A semi-log plot of log y against x for x = 0, 1, 2, 3. The values 5, 15, 45, 135 (filled points) lie on one dashed straight line; the values 5, 15, 25, 35 share the first two points, but their last two (open points) fall below the line, bending down.",
    "x = 0, 1, 2, 3 时 log y 关于 x 的半对数图。数据 5, 15, 45, 135（实心点）位于一条虚直线上；数据 5, 15, 25, 35 与它共用前两个点，但后两个点（空心点）落在直线下方，向下弯曲。",
  ),
};

/** semiLogScatterPlots teaches straightening exponential data with a logarithmic axis. */
const semiLogScatterPlots: TopicDef = {
  id: "semi-log-scatter-plots",
  title: t("Semi-Log Scatter Plots", "半对数散点图"),
  summary: t(
    "Plot $\\log y$ against $x$ to turn exponential data into a straight line, transform data points, and read an exponential model from the line.",
    "画 $\\log y$ 关于 $x$ 的图，把指数型数据变成直线；变换数据点，并由直线读出指数模型。",
  ),
  prerequisites: ["product-rule-for-logarithms", "linear-vs-exponential-models"],
  encompasses: [
    { topic: "common-logarithm", weight: 0.2 },
    { topic: "linear-vs-exponential-models", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "transforming-data-points",
      title: t("Transforming data points", "变换数据点"),
      explanation: t(
        "A **semi-log scatter plot** keeps $x$ but plots $\\log y$ (the common logarithm) on the vertical axis: the data point $(x, y)$ becomes $(x, \\log y)$.\n\nWith the product rule, $\\log(d \\times 10^k) = \\log d + k$. Using $\\log 3 \\approx 0.477$, the point $(2, 3000)$ becomes $(2, \\log 3000) \\approx (2, 3.477)$.",
        "**半对数散点图**保留 $x$，而在纵轴上画 $\\log y$（常用对数）：数据点 $(x, y)$ 变为 $(x, \\log y)$。\n\n由积的对数法则，$\\log(d \\times 10^k) = \\log d + k$。利用 $\\log 3 \\approx 0.477$，点 $(2, 3000)$ 变为 $(2, \\log 3000) \\approx (2, 3.477)$。",
      ),
      generate(rng) {
        const d = rng.int(1, 9);
        const k = rng.int(-2, 5);
        const x = rng.int(0, 12);
        const y = d === 1 ? pow10(k) : dec(Q.of(d).mul(k >= 0 ? Q.of(10 ** k) : Q.of(1, 10 ** -k)));
        const ld = d === 1 ? 0 : LOG_DIGITS[d]!;
        const ans = Q.of(ld + 1000 * k, 1000);
        const hint = d === 1 ? "" : ` Use $\\log ${d} \\approx ${dec(Q.of(ld, 1000))}$.`;
        const hintZ = d === 1 ? "" : `利用 $\\log ${d} \\approx ${dec(Q.of(ld, 1000))}$。`;
        return numberProblem({
          prompt: t(
            `On a semi-log scatter plot of $\\log y$ against $x$, the data point $(${x}, ${y})$ is plotted at $(${x}, Y)$. Find $Y$.${hint}`,
            `在 $\\log y$ 关于 $x$ 的半对数散点图上，数据点 $(${x}, ${y})$ 画在 $(${x}, Y)$ 处。求 $Y$。${hintZ}`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(ld * k, 1000), Q.of(ld + 1000 * (k + 1), 1000), Q.of(ld - 1000 * k, 1000)],
          solution: t(
            `A semi-log plot keeps $x$ and replaces $y$ by $\\log y$, so $Y = \\log ${y}$.${d === 1 ? ` Since $${y} = 10^{${k}}$, $Y = ${k}$.` : ` Write $${y} = ${d} \\cdot 10^{${k}}$; the log of a product is the sum of the logs: $$Y = \\log ${d} + ${paren(String(k))} \\approx ${dec(ans)}$$`}`,
            `半对数图保持 $x$ 不变，把 $y$ 换成 $\\log y$，所以 $Y = \\log ${y}$。${d === 1 ? `由于 $${y} = 10^{${k}}$，$Y = ${k}$。` : `把 $${y}$ 写成 $${d} \\cdot 10^{${k}}$；积的对数等于对数之和：$$Y = \\log ${d} + ${paren(String(k))} \\approx ${dec(ans)}$$`}`,
          ),
        });
      },
    },
    {
      id: "exponential-models-from-semi-log-lines",
      title: t("Exponential models from semi-log lines", "由半对数直线得指数模型"),
      explanation: t(
        "If $y = a \\cdot b^x$, then $\\log y = \\log a + x \\log b$: on a semi-log plot the points lie on a straight line with intercept $\\log a$ and slope $\\log b$. Conversely, if $\\log y = c + mx$, then\n\n$$y = 10^{c} \\cdot \\left(10^{m}\\right)^{x},$$\n\nso $a = 10^c$ and $y$ is multiplied by $10^{m}$ each time $x$ increases by $1$.\n\nIf $\\log y = 2 + 0.5x$, then $a = 10^2 = 100$, and when $x$ increases by $4$, $y$ is multiplied by $10^{0.5 \\cdot 4} = 100$.",
        "若 $y = a \\cdot b^x$，则 $\\log y = \\log a + x \\log b$：在半对数图上，各点位于一条截距为 $\\log a$、斜率为 $\\log b$ 的直线上。反过来，若 $\\log y = c + mx$，则\n\n$$y = 10^{c} \\cdot \\left(10^{m}\\right)^{x},$$\n\n所以 $a = 10^c$，并且 $x$ 每增加 $1$，$y$ 就乘以 $10^{m}$。\n\n若 $\\log y = 2 + 0.5x$，则 $a = 10^2 = 100$；当 $x$ 增加 $4$ 时，$y$ 乘以 $10^{0.5 \\cdot 4} = 100$。",
      ),
      generate(rng) {
        const c = rng.int(-2, 4);
        const mk = rng.pick([
          [1, 2],
          [1, 4],
          [1, 5],
          [1, 10],
          [3, 10],
          [2, 5],
          [-1, 2],
          [-1, 4],
          [-1, 5],
          [-1, 10],
        ] as const);
        const mq = Q.of(mk[0], mk[1]);
        const line = `\\log y = ${c} ${signed(mq)}x`;
        if (rng.bool(0.4)) {
          const a = pow10(c);
          return numberProblem({
            prompt: t(
              `On a semi-log plot, data lie on the line $${line}$. The data follow a model $y = a \\cdot b^x$. Find $a$.`,
              `在半对数图上，数据位于直线 $${line}$ 上，数据符合模型 $y = a \\cdot b^x$。求 $a$。`,
            ),
            answer: Q.parse(a),
            ...decimalForm(Q.parse(a)),
            wrong: [Q.of(c), Q.parse(pow10(c + 1)), Q.of(c * 10)],
            solution: t(
              `The intercept of the line is $\\log a = ${c}$, so $a = 10^{${c}} = ${a}$.`,
              `直线的截距为 $\\log a = ${c}$，所以 $a = 10^{${c}} = ${a}$。`,
            ),
          });
        }
        const step = mk[1] * rng.int(1, 3);
        const e = (mk[0] * step) / mk[1];
        const ans = Q.parse(pow10(e));
        return numberProblem({
          prompt: t(
            `On a semi-log plot, data lie on the line $${line}$. By what factor is $y$ multiplied when $x$ increases by $${step}$?`,
            `在半对数图上，数据位于直线 $${line}$ 上。当 $x$ 增加 $${step}$ 时，$y$ 乘以多少？`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(e), mq.mul(Q.of(step)).add(Q.of(c)), Q.parse(pow10(e + c))],
          solution: t(
            `When $x$ increases by $${step}$, $\\log y$ increases by $${dec(mq)} \\cdot ${step} = ${e}$, so $y$ is multiplied by $10^{${e}} = ${dec(ans)}$.`,
            `$x$ 增加 $${step}$ 时，$\\log y$ 增加 $${dec(mq)} \\cdot ${step} = ${e}$，所以 $y$ 乘以 $10^{${e}} = ${dec(ans)}$。`,
          ),
        });
      },
    },
    {
      id: "data-that-straighten-on-a-semi-log-plot",
      title: t("Data that straighten on a semi-log plot", "在半对数图上成直线的数据"),
      explanation: t(
        "On a semi-log plot equal steps in $x$ give equal steps in $\\log y$ exactly when $y$ is multiplied by the same factor at each step. So exponential data, with a constant ratio between consecutive $y$-values, lie on a straight line; linear data (constant differences) and quadratic data do not.\n\nFor $x = 0, 1, 2, 3$, the values $y = 5, 15, 45, 135$ (ratio $3$) give a straight semi-log plot; $y = 5, 15, 25, 35$ do not.",
        "在半对数图上，当且仅当每一步 $y$ 都乘以同一个因子时，$x$ 的等步长才对应 $\\log y$ 的等步长。所以指数型数据（相邻 $y$ 值之比为常数）位于一条直线上；线性数据（差为常数）和二次数据则不然。\n\n对 $x = 0, 1, 2, 3$，数据 $y = 5, 15, 45, 135$（比为 $3$）的半对数图是直线；$y = 5, 15, 25, 35$ 则不是。",
      ),
      figure: semiLogFigure,
      generate(rng) {
        const a = rng.int(1, 6);
        const r = rng.pick([2, 3, 4, 5]);
        const expo = range(0, 3).map((x) => a * r ** x);
        const d = rng.int(2, 9);
        const lin = range(0, 3).map((x) => a + d * x);
        const q = rng.int(1, 4);
        const quad = range(0, 3).map((x) => a + q * x * x);
        const mixed = [a, a * r, a * r + d, a * r + 2 * d];
        const sets = rng.shuffle([expo, lin, quad, mixed]);
        const labels = ["A", "B", "C", "D"];
        const right = sets.indexOf(expo);
        const tab = table(["$x$", "$0$", "$1$", "$2$", "$3$"], ...sets.map((s, i) => [`$y_{${labels[i]}}$`, ...m(s)]));
        return choiceProblem({
          prompt: t(
            `Which data set lies on a straight line on a semi-log plot of $\\log y$ against $x$?\n\n${tab}`,
            `在 $\\log y$ 关于 $x$ 的半对数图上，哪一组数据位于一条直线上？\n\n${tab}`,
          ),
          options: labels.map((l) => t(`$y_{${l}}$`, `$y_{${l}}$`)),
          correct: right,
          solution: t(
            `In $y_{${labels[right]}}$ each value is $${r}$ times the one before, so $\\log y$ increases by $\\log ${r}$ at every step: the semi-log plot is a straight line. The other data sets do not have a constant ratio.`,
            `$y_{${labels[right]}}$ 中每个值都是前一个的 $${r}$ 倍，所以 $\\log y$ 每一步都增加 $\\log ${r}$：半对数图是一条直线。其他数据组相邻值之比都不是常数。`,
          ),
        });
      },
    },
  ],
};

/** GROWTH_FACTORS are growth or decay factors of exponential models, in hundredths. */
const GROWTH_FACTORS = [50, 60, 75, 80, 85, 90, 95, 105, 110, 112, 115, 120, 125, 150, 200] as const;

/** exponentialRegression teaches using exponential regression models. */
const exponentialRegression: TopicDef = {
  id: "exponential-regression",
  title: t("Exponential Regression", "指数回归"),
  summary: t(
    "Use an exponential regression model to predict, read its percent rate of change, and turn a linear fit of $\\ln y$ into an exponential model.",
    "用指数回归模型作预测，读出其百分变化率，并把 $\\ln y$ 的线性拟合化为指数模型。",
  ),
  prerequisites: ["semi-log-scatter-plots", "linear-regression"],
  encompasses: [{ topic: "semi-log-scatter-plots", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSS.ID.B.6.A", "CCSS.HSF.LE.B.5"],
  knowledgePoints: [
    {
      id: "predicting-with-an-exponential-model",
      title: t("Predicting with an exponential model", "用指数模型作预测"),
      explanation: t(
        "An **exponential regression** fits $\\hat{y} = a \\cdot b^x$ to data that grow or decay by a roughly constant factor; technology does it by fitting a line to $(x, \\log y)$. To predict, substitute $x$.\n\nWith $\\hat{y} = 40 \\cdot 1.5^x$, at $x = 2$ the prediction is $40 \\cdot 2.25 = 90$.",
        "**指数回归**对大致按固定倍数增长或衰减的数据拟合 $\\hat{y} = a \\cdot b^x$；计算工具的做法是对 $(x, \\log y)$ 拟合直线。作预测时代入 $x$ 即可。\n\n对 $\\hat{y} = 40 \\cdot 1.5^x$，在 $x = 2$ 处的预测值为 $40 \\cdot 2.25 = 90$。",
      ),
      generate(rng) {
        const a = rng.int(2, 60) * 5;
        const b = Q.of(rng.pick(GROWTH_FACTORS), 100);
        const x = rng.int(1, 3);
        const ans = Q.of(a).mul(b.pow(x));
        return numberProblem({
          prompt: t(
            `An exponential regression for a data set gives $\\hat{y} = ${a} \\cdot ${dec(b)}^x$. Predict $y$ when $x = ${x}$.`,
            `对某组数据作指数回归，得到 $\\hat{y} = ${a} \\cdot ${dec(b)}^x$。预测 $x = ${x}$ 时 $y$ 的值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(a).mul(b).mul(Q.of(x)), Q.of(a).mul(b).pow(x), Q.of(a).add(b.pow(x))],
          solution: t(
            `$$\\hat{y} = ${a} \\cdot ${dec(b)}^{${x}} = ${a} \\cdot ${dec(b.pow(x))} = ${dec(ans)}$$`,
            `$$\\hat{y} = ${a} \\cdot ${dec(b)}^{${x}} = ${a} \\cdot ${dec(b.pow(x))} = ${dec(ans)}$$`,
          ),
        });
      },
    },
    {
      id: "the-percent-rate-of-an-exponential-model",
      title: t("The percent rate of change", "百分变化率"),
      explanation: t(
        "In $\\hat{y} = a \\cdot b^x$, the value is multiplied by $b$ each time $x$ increases by $1$. If $b > 1$ it grows by $(b - 1) \\times 100\\%$; if $b < 1$ it decays by $(1 - b) \\times 100\\%$. The value $a$ is the prediction at $x = 0$.\n\nWith $\\hat{y} = 250 \\cdot 0.92^x$, the predicted value starts at $250$ and decreases by $8\\%$ per unit of $x$.",
        "在 $\\hat{y} = a \\cdot b^x$ 中，$x$ 每增加 $1$，值就乘以 $b$。若 $b > 1$，则增长 $(b - 1) \\times 100\\%$；若 $b < 1$，则衰减 $(1 - b) \\times 100\\%$。$a$ 是 $x = 0$ 时的预测值。\n\n对 $\\hat{y} = 250 \\cdot 0.92^x$，预测值从 $250$ 开始，$x$ 每增加一个单位就减少 $8\\%$。",
      ),
      generate(rng) {
        const a = rng.int(2, 200) * 5;
        const bh = rng.pick([...range(60, 98), ...range(102, 150)]);
        const b = Q.of(bh, 100);
        const grow = bh > 100;
        const ans = Q.of(Math.abs(bh - 100));
        const contexts = [
          ["the number of users of an app", "weeks", "某应用的用户数", "周", true],
          ["the value of a car (in dollars)", "years", "一辆汽车的价值（美元）", "年", false],
          ["the number of bacteria in a culture", "hours", "培养皿中的细菌数", "小时", true],
          ["the mass of a drug in the blood (in milligrams)", "hours", "血液中药物的质量（毫克）", "小时", false],
        ] as const;
        const what = rng.pick(contexts.filter((c) => c[4] === grow));
        return numberProblem({
          prompt: t(
            `An exponential regression models ${what[0]} after $x$ ${what[1]} by $\\hat{y} = ${a} \\cdot ${dec(b)}^x$. By what percent does the model say the value ${grow ? "increases" : "decreases"} each ${what[1].replace(/s$/, "")}?`,
            `对 $x$ ${what[3]}后${what[2]}作指数回归，得到 $\\hat{y} = ${a} \\cdot ${dec(b)}^x$。按照模型，这个值每${what[3]}${grow ? "增加" : "减少"}百分之几？`,
          ),
          answer: ans,
          percent: true,
          wrong: [Q.of(bh), Q.of(100 - Math.abs(bh - 100))],
          solution: t(
            `Each ${what[1].replace(/s$/, "")} the value is multiplied by $${dec(b)}$, so it ${grow ? `increases by $${dec(b)} - 1 = ${dec(b.sub(Q.one))}$` : `decreases by $1 - ${dec(b)} = ${dec(Q.one.sub(b))}$`}, which is $${ans.toLatex()}\\%$.`,
            `每${what[3]}这个值乘以 $${dec(b)}$，所以${grow ? `增加 $${dec(b)} - 1 = ${dec(b.sub(Q.one))}$` : `减少 $1 - ${dec(b)} = ${dec(Q.one.sub(b))}$`}，即 $${ans.toLatex()}\\%$。`,
          ),
        });
      },
    },
    {
      id: "exponential-models-from-a-fit-of-ln-y",
      title: t("Exponential models from a fit of ln y", "由 ln y 的拟合得指数模型"),
      explanation: t(
        "Regression can also be done on the natural logarithm. If the least-squares line for $(x, \\ln y)$ is $\\ln \\hat{y} = c + kx$, exponentiate both sides:\n\n$$\\hat{y} = e^{c + kx} = e^{c} \\cdot e^{kx}.$$\n\nSo $\\ln \\hat{y} = 1.2 + 0.3x$ gives $\\hat{y} = e^{1.2} e^{0.3x} \\approx 3.32\\,e^{0.3x}$.",
        "回归也可以对自然对数进行。若 $(x, \\ln y)$ 的最小二乘直线为 $\\ln \\hat{y} = c + kx$，对两边取指数：\n\n$$\\hat{y} = e^{c + kx} = e^{c} \\cdot e^{kx}.$$\n\n所以由 $\\ln \\hat{y} = 1.2 + 0.3x$ 得 $\\hat{y} = e^{1.2} e^{0.3x} \\approx 3.32\\,e^{0.3x}$。",
      ),
      generate(rng) {
        const c = Q.of(rng.nonZero(-30, 50), 10);
        const k = Q.of(rng.nonZero(-20, 20), 20);
        const C = dec(c);
        const K = coef(k);
        const line = `\\ln \\hat{y} = ${C} ${signedTerm(k, "x")}`;
        const opt = (s: string) => t(`$\\hat{y} = ${s}$`, `$\\hat{y} = ${s}$`);
        const kx = `e^{${K}x}`;
        return oneOf(
          rng,
          t(
            `A least-squares line fitted to the points $(x, \\ln y)$ is $${line}$. Which exponential model does it give?`,
            `对点 $(x, \\ln y)$ 拟合的最小二乘直线为 $${line}$。它对应哪个指数模型？`,
          ),
          opt(`e^{${C}} \\cdot ${kx}`),
          [opt(`${C} \\cdot ${kx}`), opt(`e^{${K}} \\cdot e^{${coef(c)}x}`), opt(`${C} + ${kx}`)],
          t(
            `Exponentiate both sides: $\\hat{y} = e^{${C} ${signedTerm(k, "x")}} = e^{${C}} \\cdot ${kx}$.`,
            `两边取指数：$\\hat{y} = e^{${C} ${signedTerm(k, "x")}} = e^{${C}} \\cdot ${kx}$。`,
          ),
        );
      },
    },
  ],
};

/** precalculusStatisticsTopics are the Precalculus statistics topics not shared with Algebra I. */
export const precalculusStatisticsTopics: readonly TopicDef[] = [
  sampling,
  varianceAndStandardDeviation,
  estimatingGroupedData,
  covariance,
  sumsOfSquares,
  theZScore,
  residualsAndResidualPlots,
  theLinearCorrelationCoefficient,
  linearRegression,
  quadraticRegression,
  semiLogScatterPlots,
  exponentialRegression,
];
