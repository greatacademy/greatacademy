import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q } from "@ga/subject-math";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { choiceProblem, numberProblem, steps, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

/** whyIf gives the reason for a wrong value when the value is defined, and nothing otherwise. */
const whyIf = (v: Q | undefined, en: string, zh: string) => (v === undefined ? [] : [why(v, en, zh)]);

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

/** methodNeeds says what each sampling method would require, in the order of the methods. */
const methodNeeds: readonly Text[] = [
  t(
    "Simple random sampling would draw the members themselves at random, with no groups and no fixed interval.",
    "简单随机抽样会直接随机抽取成员本身，既不分组，也不按固定间隔。",
  ),
  t("Systematic sampling would take members at a fixed interval along a list.", "系统抽样会沿名单按固定间隔选取成员。"),
  t("Stratified sampling would draw some members at random from every group.", "分层抽样会从每一组中随机抽取一部分成员。"),
  t("Cluster sampling would choose a few groups at random and take everyone in them.", "整群抽样会随机选出几个组，并取这些组的全部成员。"),
  t(
    "Convenience sampling would take whoever is easiest to reach, with no chance involved.",
    "方便抽样会选取最容易接触到的人，不涉及随机。",
  ),
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
  intro: t(
    "A school has $900$ students, and the principal wants to know how many walk to school. Asking all $900$ takes too long, so she asks $60$ students chosen at random. If $18$ of them walk, then about $\\frac{18}{60} = 0.3$ of the school does, which is about $0.3 \\times 900 = 270$ students.\n\nCheck: $270$ out of $900$ is $\\frac{270}{900} = 0.3$, the same proportion as $18$ out of $60$.\n\nIn this lesson we tell the population from the sample, name the way a sample was chosen, and use a random sample to estimate a count in the whole population.",
    "一所学校有 $900$ 名学生，校长想知道有多少人步行上学。逐一询问 $900$ 人太费时，所以她随机选了 $60$ 名学生来问。如果其中 $18$ 人步行，那么全校约有 $\\frac{18}{60} = 0.3$ 的人步行，即约 $0.3 \\times 900 = 270$ 人。\n\n检验：$900$ 人中的 $270$ 人占 $\\frac{270}{900} = 0.3$，与 $60$ 人中的 $18$ 人比例相同。\n\n本课我们区分总体与样本，判断样本是怎样抽取的，并用随机样本估计整个总体中的数量。",
  ),
  knowledgePoints: [
    {
      id: "populations-and-samples",
      title: t("Populations and samples", "总体与样本"),
      explanation: t(
        "The **population** of a study is the whole group it wants to learn about. Collecting data from every member is a **census**; usually that costs too much, so the data come from a **sample**, a part of the population.\n\nA principal who surveys $60$ of the $900$ students at her school about lunch has the $900$ students as the population and the $60$ surveyed students as the sample.\n\nCheck: the sample is part of the population, since each of the $60$ surveyed students is one of the $900$.\n\n> **Watch out.** The population is exactly the group the question is about: not a wider group, such as all students in the country, and not just the members with the answer being counted.",
        "研究中想要了解的整个群体称为**总体**。从总体的每个成员收集数据叫作**普查**；普查往往代价太高，所以通常从**样本**（总体的一部分）收集数据。\n\n一位校长就午餐问题调查了本校 $900$ 名学生中的 $60$ 名，那么总体是这 $900$ 名学生，样本是被调查的 $60$ 名学生。\n\n检验：样本是总体的一部分，因为被调查的 $60$ 名学生每一个都是这 $900$ 人中的一员。\n\n> **注意。** 总体恰好是问题所关心的那个群体：不是更大的群体（例如全国所有学生），也不只是具有所统计特征的那些成员。",
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
        const steps2 = t(
          `**Step 1: Find the group the study is about.** The researcher wants to learn about all ${N} ${s.members[0]} ${s.where[0]}, so they are the population.\n\n**Step 2: Find who gave the data.** Only the ${n} ${s.members[0]} who were asked gave answers, so they are the sample.\n\n`,
          `**第一步：找出研究所关心的群体。**研究员想了解的是${s.where[1]}全部 ${N} ${s.members[1]}，所以他们是总体。\n\n**第二步：找出提供数据的人。**只有被询问的 ${n} ${s.members[1]}给出了回答，所以他们是样本。\n\n`,
        );
        const check = t(
          `**Check.** The sample is part of the population: the ${n} who were asked are among the ${N}, and $${n} < ${N}$.`,
          `**检验。**样本是总体的一部分：被询问的 ${n} 人都在这 ${N} 人之中，且 $${n} < ${N}$。`,
        );
        return reasoned(
          oneOf(
            rng,
            prompt,
            askPopulation ? pop : smp,
            askPopulation ? [smp, wider, yes] : [pop, yes, wider],
            t(
              `${steps2.en}So the ${askPopulation ? "population" : "sample"} is ${askPopulation ? `all ${N} ${s.members[0]} ${s.where[0]}` : `the ${n} ${s.members[0]} who were asked`}.\n\n${check.en}`,
              `${steps2["zh-CN"]}所以${askPopulation ? "总体" : "样本"}是${askPopulation ? `${s.where[1]}全部 ${N} ${s.members[1]}` : `被询问的 ${n} ${s.members[1]}`}。\n\n${check["zh-CN"]}`,
            ),
          ),
          [
            [smp.en, `These are only the ${n} who were asked, the sample.`, `这只是被询问的 ${n} 人，即样本。`],
            [
              pop.en,
              `This is the whole group the study is about, the population; only ${n} of them were asked.`,
              `这是研究所关心的整个群体，即总体；其中只有 ${n} 人被询问。`,
            ],
            [
              wider.en,
              `This group is wider than the one the study is about; the question concerns only the ${N} ${s.members[0]} ${s.where[0]}.`,
              `这个群体比研究所关心的更大；问题只涉及${s.where[1]} ${N} ${s.members[1]}。`,
            ],
            [
              yes.en,
              "These are only the surveyed members with the trait; the sample is everyone who was asked, whatever they answered.",
              "这只是被调查者中具有该特征的人；样本是所有被询问的人，不论他们怎样回答。",
            ],
          ],
        );
      },
    },
    {
      id: "sampling-methods",
      title: t("Sampling methods", "抽样方法"),
      explanation: t(
        "Common ways to choose a sample of size $n$:\n\n- **Simple random sampling**: every group of $n$ members is equally likely to be chosen, for example by numbering the members and drawing $n$ random numbers.\n- **Systematic sampling**: list the members, start at a random place among the first $k$, and take every $k$th member.\n- **Stratified sampling**: split the population into groups (strata) that differ in a relevant way, and draw a random sample from **each** group.\n- **Cluster sampling**: split the population into groups (clusters), choose some clusters at random, and include **every** member of the chosen clusters.\n- **Convenience sampling**: take the members who are easiest to reach. It is quick, but usually biased.\n\nThe difference between stratified and cluster sampling: stratified samples a few members from every group; cluster sampling takes all members of a few groups.\n\nA school that picks $5$ of its $40$ classes at random and surveys every student in them uses cluster sampling.\n\nCheck: only $5$ classes appear in the sample, each in full; stratified sampling would take a few students from all $40$ classes.\n\n> **Watch out.** Ask two questions: are groups formed, and are some members taken from **every** group or **all** members from **some** groups? Mixing these up confuses stratified and cluster sampling.",
        "抽取容量为 $n$ 的样本的常用方法：\n\n- **简单随机抽样**：任意 $n$ 个成员组成的组被抽中的可能性都相同，例如给成员编号后随机抽取 $n$ 个号码。\n- **系统抽样**：把成员排成一列，在前 $k$ 个中随机选一个起点，然后每隔 $k$ 个取一个。\n- **分层抽样**：按某个相关特征把总体分成若干层，从**每一层**中随机抽取样本。\n- **整群抽样**：把总体分成若干群，随机选出几个群，并纳入所选群中的**全部**成员。\n- **方便抽样**：选取最容易接触到的成员。这种方法快捷，但通常有偏差。\n\n分层抽样与整群抽样的区别：分层抽样从每一组中抽取一部分成员；整群抽样则取几个组的全部成员。\n\n一所学校从 $40$ 个班中随机选出 $5$ 个班，并调查这些班的每一名学生，用的是整群抽样。\n\n检验：样本中只出现 $5$ 个班，且每个班是整班入选；分层抽样则会从全部 $40$ 个班中各取几名学生。\n\n> **注意。** 问两个问题：是否分了组？是从**每一组**中取一部分成员，还是取**某几组**的**全部**成员？把这两点弄混，就会混淆分层抽样与整群抽样。",
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
        const check: Text = [
          t(
            "No groups are formed and no interval is used, so it is neither stratified, cluster nor systematic sampling.",
            "既没有分组，也没有用固定间隔，所以不是分层、整群或系统抽样。",
          ),
          t(
            `Once the start is drawn, every later choice is fixed by the interval of ${k}, so the members are not drawn one by one at random.`,
            `起点一旦抽定，之后每一个都由间隔 ${k} 决定，所以成员并不是逐个随机抽取的。`,
          ),
          t(
            `All ${g} groups appear in the sample, each with only ${per} members; cluster sampling would take a few groups in full.`,
            `全部 ${g} 组都出现在样本中，每组只有 ${per} 个成员；整群抽样则会整组选取其中几组。`,
          ),
          t(
            `Only ${p} of the ${c} groups appear, each in full; stratified sampling would take some members from every group.`,
            `${c} 组中只出现了 ${p} 组，且每组全部入选；分层抽样则会从每一组中取一部分成员。`,
          ),
          t(
            "Chance plays no part in who is asked, so it is none of the random methods.",
            "谁被询问与随机无关，所以不是任何一种随机抽样方法。",
          ),
        ][method]!;
        const wrong = methodNames.filter((_, i) => i !== method);
        const lower = `${why.en[0]!.toLowerCase()}${why.en.slice(1)}`;
        return reasoned(
          oneOf(
            rng,
            t(
              `To survey the ${mem} ${s.where[0]}, a researcher ${how.en}. Which sampling method is this?`,
              `为调查${s.where[1]}${memZ}，一位研究员${how["zh-CN"]}。这是哪种抽样方法？`,
            ),
            methodNames[method]!,
            rng.shuffle(wrong),
            t(
              `**Step 1: Describe how the members are chosen.** ${why.en}\n\n**Step 2: Name the method.** This is ${methodNames[method]!.en.toLowerCase()}.\n\n**Check.** ${check.en}`,
              `**第一步：说明成员是怎样选出的。**${why["zh-CN"]}\n\n**第二步：说出方法的名称。**这是${methodNames[method]!["zh-CN"]}。\n\n**检验。**${check["zh-CN"]}`,
            ),
          ),
          methodNames.flatMap((name, i) =>
            i === method
              ? []
              : [[name.en, `${methodNeeds[i]!.en} Here, ${lower}`, `${methodNeeds[i]!["zh-CN"]}而这里的做法是：${why["zh-CN"]}`] as const],
          ),
        );
      },
    },
    {
      id: "estimating-from-a-random-sample",
      title: t("Estimating from a random sample", "用随机样本作估计"),
      explanation: t(
        "A random sample is likely to look like the population, so the proportion found in the sample estimates the proportion in the whole population:\n\n$$\\text{estimate} = \\frac{\\text{count in sample}}{\\text{sample size}} \\times \\text{population size}.$$\n\nIf $18$ of a random sample of $60$ students walk to school, about $\\frac{18}{60} = 0.3$ of all $900$ students do, which is $0.3 \\times 900 = 270$ students.\n\nCheck: each sampled student stands for $\\frac{900}{60} = 15$ students, and $18 \\times 15 = 270$.\n\n> **Watch out.** The estimate is for the whole population, not the count in the sample ($18$), and it counts those **with** the trait, not the $900 - 270 = 630$ without it.",
        "随机样本往往与总体相似，所以样本中的比例可以估计整个总体中的比例：\n\n$$\\text{估计值} = \\frac{\\text{样本中的数量}}{\\text{样本容量}} \\times \\text{总体容量}.$$\n\n如果在随机抽取的 $60$ 名学生中有 $18$ 人步行上学，那么全部 $900$ 名学生中约有 $\\frac{18}{60} = 0.3$ 的人步行上学，即 $0.3 \\times 900 = 270$ 人。\n\n检验：每名被抽到的学生代表 $\\frac{900}{60} = 15$ 名学生，而 $18 \\times 15 = 270$。\n\n> **注意。** 估计的是整个总体中的数量，不是样本中的数量（$18$）；而且数的是**具有**该特征的人，不是不具有的 $900 - 270 = 630$ 人。",
      ),
      generate(rng) {
        const s = rng.pick(sampleScenes);
        const n = rng.pick([20, 25, 40, 50, 80, 100, 200]);
        const N = n * rng.int(5, 40);
        const k = rng.int(2, n - 2);
        const ans = Q.of(k * (N / n));
        const memZ = s.members[1].replace(/^[名位]/, "");
        const share = Q.of(k, n);
        return numberProblem({
          prompt: t(
            `In a random sample of ${n} of the ${N} ${s.members[0]} ${s.where[0]}, ${k} ${s.trait[0]}. Estimate how many of all ${N} ${s.members[0]} ${s.trait[0]}.`,
            `从${s.where[1]} ${N} ${s.members[1]}中随机抽取 ${n} 个，其中 ${k} 个${s.trait[1]}。估计全部 ${N} 个${memZ}中有多少个${s.trait[1]}。`,
          ),
          answer: ans,
          mistakes: [
            why(Q.of(k), "This is the count in the sample, not in the whole population.", "这是样本中的数量，不是整个总体中的数量。"),
            why(
              Q.of(N - ans.toNumber()),
              `This counts the ${s.members[0]} who do not ${s.trait[0]}.`,
              `这数的是不${s.trait[1]}的${memZ}。`,
            ),
            why(
              Q.of(Math.round((k * N) / 100)),
              `This takes $${k}\\%$ of $${N}$, as if $${k}$ were a percentage; the proportion is $\\frac{${k}}{${n}}$.`,
              `这取的是 $${N}$ 的 $${k}\\%$，把 $${k}$ 当成了百分数；比例应是 $\\frac{${k}}{${n}}$。`,
            ),
          ],
          solution: t(
            `**Step 1: Find the proportion in the sample.**${steps(`\\frac{${k}}{${n}} = ${show(share)}`)}**Step 2: Apply it to the population.**${steps(`${show(share)} \\times ${N} = ${ans.toLatex()}`)}**Check.** Each sampled ${s.members[0].replace(/s$/, "")} stands for $\\frac{${N}}{${n}} = ${N / n}$ ${s.members[0]}, and${steps(`${k} \\times ${N / n} = ${ans.toLatex()}`)}`,
            `**第一步：求样本中的比例。**${steps(`\\frac{${k}}{${n}} = ${show(share)}`)}**第二步：把比例用到总体上。**${steps(`${show(share)} \\times ${N} = ${ans.toLatex()}`)}**检验。**每个被抽到的${memZ}代表 $\\frac{${N}}{${n}} = ${N / n}$ 个${memZ}，而${steps(`${k} \\times ${N / n} = ${ans.toLatex()}`)}`,
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
  intro: t(
    "The data sets $4, 5, 6$ and $1, 5, 9$ both have mean $5$, but the second is far more spread out. Squaring the deviations from the mean and averaging them measures this: for $4, 5, 6$ the result is $\\frac{1 + 0 + 1}{3} = \\frac{2}{3}$, and for $1, 5, 9$ it is $\\frac{16 + 0 + 16}{3} = \\frac{32}{3}$.\n\nCheck: every deviation in the second set, $-4, 0, 4$, is four times the matching one in the first, $-1, 0, 1$, so the squares are $16$ times as large, and $16 \\cdot \\frac{2}{3} = \\frac{32}{3}$.\n\nIn this lesson we compute this measure, the variance, and its square root, the standard deviation, for a population and for a sample.",
    "数据 $4, 5, 6$ 与 $1, 5, 9$ 的均值都是 $5$，但第二组分散得多。把离均差平方后取平均就能衡量这一点：$4, 5, 6$ 的结果是 $\\frac{1 + 0 + 1}{3} = \\frac{2}{3}$，$1, 5, 9$ 的结果是 $\\frac{16 + 0 + 16}{3} = \\frac{32}{3}$。\n\n检验：第二组的每个偏差 $-4, 0, 4$ 都是第一组对应偏差 $-1, 0, 1$ 的四倍，所以平方是 $16$ 倍，而 $16 \\cdot \\frac{2}{3} = \\frac{32}{3}$。\n\n本课我们对总体和样本分别计算这个量（方差）及其平方根（标准差）。",
  ),
  knowledgePoints: [
    {
      id: "population-variance",
      title: t("The variance", "方差"),
      explanation: t(
        "The **variance** of a population of $n$ values with mean $\\mu$ is the mean of the squared deviations from the mean:\n\n$$\\sigma^2 = \\frac{\\sum (x - \\mu)^2}{n}.$$\n\nSquaring makes every deviation count positively and gives large deviations more weight than the mean absolute deviation does.\n\nFor $2, 4, 6, 8$: $\\mu = 5$, the squared deviations are $9, 1, 1, 9$, and $\\sigma^2 = \\frac{20}{4} = 5$.\n\nCheck: the mean of the squares is $\\frac{4 + 16 + 36 + 64}{4} = 30$, and $30 - 5^2 = 5$.\n\n> **Watch out.** For a population, divide by $n$, not $n - 1$. Square the deviations: averaging their absolute values gives the mean absolute deviation, $\\frac{3 + 1 + 1 + 3}{4} = 2$, not the variance.",
        "由 $n$ 个值组成、均值为 $\\mu$ 的总体，其**方差**是离均差平方的平均数：\n\n$$\\sigma^2 = \\frac{\\sum (x - \\mu)^2}{n}.$$\n\n平方使每个偏差都按正数计入，并且比平均绝对偏差更看重大的偏差。\n\n对 $2, 4, 6, 8$：$\\mu = 5$，离均差的平方是 $9, 1, 1, 9$，所以 $\\sigma^2 = \\frac{20}{4} = 5$。\n\n检验：平方的均值是 $\\frac{4 + 16 + 36 + 64}{4} = 30$，而 $30 - 5^2 = 5$。\n\n> **注意。** 总体方差除以 $n$，不是 $n - 1$。偏差要平方：对偏差的绝对值取平均得到的是平均绝对偏差 $\\frac{3 + 1 + 1 + 3}{4} = 2$，不是方差。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5]);
        const xs = dataWithMean(rng, n, 1, 20);
        const mu = sum(xs) / n;
        const ss = squaredDeviations(xs, mu);
        const ans = Q.of(ss, n);
        const mad = Q.of(sum(xs.map((x) => Math.abs(x - mu))), n);
        const sx2 = sum(xs.map((x) => x * x));
        return numberProblem({
          prompt: t(`Find the variance $\\sigma^2$ of the population $${dataList(xs)}$.`, `求总体 $${dataList(xs)}$ 的方差 $\\sigma^2$。`),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              Q.of(ss, n - 1),
              `This divides by $n - 1 = ${n - 1}$, as for a sample; a population divides by $n = ${n}$.`,
              `这除以了 $n - 1 = ${n - 1}$，那是样本的做法；总体要除以 $n = ${n}$。`,
            ),
            why(
              Q.of(ss),
              `This is the sum of the squared deviations; divide it by $n = ${n}$.`,
              `这是离均差平方之和；还要除以 $n = ${n}$。`,
            ),
            why(mad, "This is the mean absolute deviation; the variance squares the deviations.", "这是平均绝对偏差；方差要把偏差平方。"),
          ],
          solution: t(
            `**Step 1: Find the mean.**${steps(`\\mu = \\frac{${sum(xs)}}{${n}} = ${mu}`)}**Step 2: Average the squared deviations.**${steps(`\\sigma^2 = \\frac{${devLine(xs, mu)}}{${n}}`, `= \\frac{${sqLine(xs, mu)}}{${n}} = \\frac{${ss}}{${n}} = ${show(ans)}`)}**Check.** The mean of the squares minus the square of the mean:${steps(`\\frac{${sx2}}{${n}} - ${mu}^2 = ${show(Q.of(sx2, n))} - ${mu * mu} = ${show(ans)}`)}`,
            `**第一步：求均值。**${steps(`\\mu = \\frac{${sum(xs)}}{${n}} = ${mu}`)}**第二步：求离均差平方的平均数。**${steps(`\\sigma^2 = \\frac{${devLine(xs, mu)}}{${n}}`, `= \\frac{${sqLine(xs, mu)}}{${n}} = \\frac{${ss}}{${n}} = ${show(ans)}`)}**检验。**用平方的均值减去均值的平方：${steps(`\\frac{${sx2}}{${n}} - ${mu}^2 = ${show(Q.of(sx2, n))} - ${mu * mu} = ${show(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "standard-deviation",
      title: t("The standard deviation", "标准差"),
      explanation: t(
        "The **standard deviation** is the square root of the variance:\n\n$$\\sigma = \\sqrt{\\frac{\\sum (x - \\mu)^2}{n}}.$$\n\nIt is measured in the same units as the data, so it describes a typical distance of a value from the mean.\n\nFor $2, 4, 6, 8$ the variance is $5$, so $\\sigma = \\sqrt{5} \\approx 2.24$.\n\nCheck: $2.24^2 = 5.0176$, which is close to $5$.\n\n> **Watch out.** The variance, $5$, is not the standard deviation: take its square root. Divide by $n$ before taking the root; $\\sqrt{20} \\approx 4.47$ forgets the division.",
        "**标准差**是方差的平方根：\n\n$$\\sigma = \\sqrt{\\frac{\\sum (x - \\mu)^2}{n}}.$$\n\n它与数据的单位相同，描述了数据值与均值的典型距离。\n\n对 $2, 4, 6, 8$，方差是 $5$，所以 $\\sigma = \\sqrt{5} \\approx 2.24$。\n\n检验：$2.24^2 = 5.0176$，与 $5$ 很接近。\n\n> **注意。** 方差 $5$ 不是标准差：还要开平方。开方之前先除以 $n$；$\\sqrt{20} \\approx 4.47$ 就是忘了除。",
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
            mistakes: [
              ...whyIf(rounded(ss / n, 2), "This is the variance; take its square root.", "这是方差；还要开平方。"),
              ...whyIf(
                rounded(Math.sqrt(ss / (n - 1)), 2),
                `This divides by $n - 1 = ${n - 1}$, as for a sample; a population divides by $n = ${n}$.`,
                `这除以了 $n - 1 = ${n - 1}$，那是样本的做法；总体要除以 $n = ${n}$。`,
              ),
              ...whyIf(
                rounded(Math.sqrt(ss), 2),
                `This is the square root of the sum of the squared deviations; divide by $n = ${n}$ first.`,
                `这是离均差平方之和的平方根；要先除以 $n = ${n}$。`,
              ),
            ],
            solution: t(
              `**Step 1: Find the mean and the squared deviations.** The mean is $\\mu = \\frac{${sum(xs)}}{${n}} = ${mu}$, and the squared deviations add up to $${sqLine(xs, mu)} = ${ss}$.\n\n**Step 2: Divide by $n$ and take the square root.**${steps(`\\sigma^2 = \\frac{${ss}}{${n}} = ${show(v)}`, `\\sigma = \\sqrt{${show(v)}} \\approx ${dec(ans)}`)}**Check.** Squaring the answer gives back about the variance:${steps(`${dec(ans)}^2 = ${dec(ans.mul(ans))} \\approx ${show(v)}`)}`,
              `**第一步：求均值和离均差的平方。**均值为 $\\mu = \\frac{${sum(xs)}}{${n}} = ${mu}$，离均差的平方之和为 $${sqLine(xs, mu)} = ${ss}$。\n\n**第二步：除以 $n$ 再开平方。**${steps(`\\sigma^2 = \\frac{${ss}}{${n}} = ${show(v)}`, `\\sigma = \\sqrt{${show(v)}} \\approx ${dec(ans)}`)}**检验。**把答案平方，约等于方差：${steps(`${dec(ans)}^2 = ${dec(ans.mul(ans))} \\approx ${show(v)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "sample-variance",
      title: t("The sample variance", "样本方差"),
      explanation: t(
        "When the data are a **sample** used to estimate the spread of a larger population, divide by $n - 1$ instead of $n$. The **sample variance** and **sample standard deviation** are\n\n$$s^2 = \\frac{\\sum (x - \\bar{x})^2}{n - 1}, \\qquad s = \\sqrt{s^2}.$$\n\nThe deviations from the sample mean $\\bar{x}$ tend to be a little smaller than those from the unknown population mean, and dividing by $n - 1$ makes up for that.\n\nFor the sample $3, 5, 7$: $\\bar{x} = 5$, the squared deviations add up to $4 + 0 + 4 = 8$, and $s^2 = \\frac{8}{2} = 4$.\n\nCheck: with the shortcut, $\\sum x^2 = 9 + 25 + 49 = 83$ and $\\frac{83 - 3 \\cdot 5^2}{2} = \\frac{8}{2} = 4$.\n\n> **Watch out.** Divide by $n - 1$ only when the data are a sample; dividing by $n = 3$ gives $\\frac{8}{3}$, the population variance, which is too small as an estimate.",
        "当数据是用来估计更大总体离散程度的**样本**时，要除以 $n - 1$ 而不是 $n$。**样本方差**和**样本标准差**为\n\n$$s^2 = \\frac{\\sum (x - \\bar{x})^2}{n - 1}, \\qquad s = \\sqrt{s^2}.$$\n\n数据相对样本均值 $\\bar{x}$ 的偏差往往比相对未知总体均值的偏差略小，除以 $n - 1$ 正好弥补这一点。\n\n对样本 $3, 5, 7$：$\\bar{x} = 5$，离均差平方之和为 $4 + 0 + 4 = 8$，所以 $s^2 = \\frac{8}{2} = 4$。\n\n检验：用简便公式，$\\sum x^2 = 9 + 25 + 49 = 83$，而 $\\frac{83 - 3 \\cdot 5^2}{2} = \\frac{8}{2} = 4$。\n\n> **注意。** 只有数据是样本时才除以 $n - 1$；除以 $n = 3$ 得到的是总体方差 $\\frac{8}{3}$，用作估计偏小。",
      ),
      generate(rng) {
        const n = rng.pick([3, 5, 6]);
        const xs = dataWithMean(rng, n, 1, 25);
        const mu = sum(xs) / n;
        const ss = squaredDeviations(xs, mu);
        const ans = Q.of(ss, n - 1);
        const sx2 = sum(xs.map((x) => x * x));
        return numberProblem({
          prompt: t(
            `The values $${dataList(xs)}$ are a sample from a large population. Find the sample variance $s^2$.`,
            `数据 $${dataList(xs)}$ 是来自某个大总体的样本。求样本方差 $s^2$。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          wrong: [Q.of(ss, n + 1)],
          mistakes: [
            why(
              Q.of(ss, n),
              `This divides by $n = ${n}$, the population variance; a sample divides by $n - 1 = ${n - 1}$.`,
              `这除以了 $n = ${n}$，是总体方差；样本要除以 $n - 1 = ${n - 1}$。`,
            ),
            why(
              Q.of(ss),
              `This is the sum of the squared deviations; divide it by $n - 1 = ${n - 1}$.`,
              `这是离均差平方之和；还要除以 $n - 1 = ${n - 1}$。`,
            ),
          ],
          solution: t(
            `**Step 1: Find the sample mean.**${steps(`\\bar{x} = \\frac{${sum(xs)}}{${n}} = ${mu}`)}**Step 2: Divide the sum of the squared deviations by $n - 1 = ${n - 1}$.**${steps(`s^2 = \\frac{${sqLine(xs, mu)}}{${n - 1}} = \\frac{${ss}}{${n - 1}} = ${show(ans)}`)}**Check.** With the shortcut, $\\sum x^2 = ${sx2}$:${steps(`\\frac{${sx2} - ${n} \\cdot ${mu}^2}{${n - 1}} = \\frac{${sx2 - n * mu * mu}}{${n - 1}} = ${show(ans)}`)}`,
            `**第一步：求样本均值。**${steps(`\\bar{x} = \\frac{${sum(xs)}}{${n}} = ${mu}`)}**第二步：把离均差平方之和除以 $n - 1 = ${n - 1}$。**${steps(`s^2 = \\frac{${sqLine(xs, mu)}}{${n - 1}} = \\frac{${ss}}{${n - 1}} = ${show(ans)}`)}**检验。**用简便公式，$\\sum x^2 = ${sx2}$：${steps(`\\frac{${sx2} - ${n} \\cdot ${mu}^2}{${n - 1}} = \\frac{${sx2 - n * mu * mu}}{${n - 1}} = ${show(ans)}`)}`,
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
  intro: t(
    "Ten students counted their pets: two have $1$, five have $2$ and three have $3$. Instead of listing ten numbers, a frequency table records each value once with how often it occurs, and the total is $1 \\cdot 2 + 2 \\cdot 5 + 3 \\cdot 3 = 21$ pets, a mean of $\\frac{21}{10} = 2.1$.\n\nCheck: listing the values, $1 + 1 + 2 + 2 + 2 + 2 + 2 + 3 + 3 + 3 = 21$.\n\nIn this lesson we find the mean of a frequency table, and estimate the mean and variance of data grouped into classes, where the exact values are lost.",
    "十名学生统计了自己养的宠物：两人各有 $1$ 只，五人各有 $2$ 只，三人各有 $3$ 只。频数表不必列出十个数，只把每个值记一次并注明出现的次数，总数是 $1 \\cdot 2 + 2 \\cdot 5 + 3 \\cdot 3 = 21$ 只，均值为 $\\frac{21}{10} = 2.1$。\n\n检验：逐个列出，$1 + 1 + 2 + 2 + 2 + 2 + 2 + 3 + 3 + 3 = 21$。\n\n本课我们求频数表的均值，并在数据分组、确切值丢失时估计均值和方差。",
  ),
  knowledgePoints: [
    {
      id: "mean-of-a-frequency-table",
      title: t("The mean of a frequency table", "频数表的均值"),
      explanation: t(
        "In a frequency table, the value $x$ occurs $f$ times. The sum of all the data is $\\sum fx$ and the number of data is $\\sum f$, so\n\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f}.$$\n\nIf $x = 1, 2, 3$ occur $2, 5, 3$ times, then $\\bar{x} = \\frac{1 \\cdot 2 + 2 \\cdot 5 + 3 \\cdot 3}{10} = \\frac{21}{10} = 2.1$.\n\nCheck: measured from $1$, the values are $0, 1, 2$, so $\\bar{x} = 1 + \\frac{0 \\cdot 2 + 1 \\cdot 5 + 2 \\cdot 3}{10} = 1 + 1.1 = 2.1$.\n\n> **Watch out.** Divide by the number of data, $\\sum f = 10$, not by the number of different values, $3$. Averaging the values alone, $\\frac{1 + 2 + 3}{3} = 2$, ignores how often each occurs.",
        "在频数表中，值 $x$ 出现 $f$ 次。全部数据之和是 $\\sum fx$，数据个数是 $\\sum f$，所以\n\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f}.$$\n\n若 $x = 1, 2, 3$ 分别出现 $2, 5, 3$ 次，则 $\\bar{x} = \\frac{1 \\cdot 2 + 2 \\cdot 5 + 3 \\cdot 3}{10} = \\frac{21}{10} = 2.1$。\n\n检验：以 $1$ 为基准，各值依次为 $0, 1, 2$，所以 $\\bar{x} = 1 + \\frac{0 \\cdot 2 + 1 \\cdot 5 + 2 \\cdot 3}{10} = 1 + 1.1 = 2.1$。\n\n> **注意。** 要除以数据个数 $\\sum f = 10$，不是不同值的个数 $3$。只对各值取平均，$\\frac{1 + 2 + 3}{3} = 2$，忽略了每个值出现的次数。",
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
        const shift = sum(fs.map((f, i) => f * i));
        return numberProblem({
          prompt: t(
            `The table shows the ${what[0]}, $x$, with frequencies $f$.\n\n${tab}\n\nFind the mean of $x$.`,
            `下表给出${what[1]} $x$ 及其频数 $f$。\n\n${tab}\n\n求 $x$ 的均值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(Q.of(sum(xs), k), "This averages the values without their frequencies.", "这只对各值取平均，没有考虑频数。"),
            why(
              Q.of(sfx, k),
              `This divides by the number of different values, $${k}$; divide by the number of data, $\\sum f = ${total}$.`,
              `这除以了不同值的个数 $${k}$；应除以数据个数 $\\sum f = ${total}$。`,
            ),
            why(Q.of(total, k), "This is the mean of the frequencies, not of the values.", "这是频数的平均数，不是数据值的平均数。"),
          ],
          solution: t(
            `**Step 1: Count the data.** There are $\\sum f = ${fs.join(" + ")} = ${total}$ data.\n\n**Step 2: Add them up.**${steps(`\\sum fx = ${xs.map((x, i) => `${x} \\cdot ${fs[i]}`).join(" + ")} = ${sfx}`)}**Step 3: Divide.** $\\bar{x} = \\frac{${sfx}}{${total}} = ${dec(ans)}$.\n\n**Check.** Measured from $${start}$, the values are $${xs.map((_, i) => i).join(", ")}$:${steps(`\\bar{x} = ${start} + \\frac{${fs.map((f, i) => `${i} \\cdot ${f}`).join(" + ")}}{${total}} = ${start} + ${dec(Q.of(shift, total))} = ${dec(ans)}`)}`,
            `**第一步：数出数据个数。**共有 $\\sum f = ${fs.join(" + ")} = ${total}$ 个数据。\n\n**第二步：求数据之和。**${steps(`\\sum fx = ${xs.map((x, i) => `${x} \\cdot ${fs[i]}`).join(" + ")} = ${sfx}`)}**第三步：相除。**$\\bar{x} = \\frac{${sfx}}{${total}} = ${dec(ans)}$。\n\n**检验。**以 $${start}$ 为基准，各值依次为 $${xs.map((_, i) => i).join(", ")}$：${steps(`\\bar{x} = ${start} + \\frac{${fs.map((f, i) => `${i} \\cdot ${f}`).join(" + ")}}{${total}} = ${start} + ${dec(Q.of(shift, total))} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "estimating-the-mean-of-grouped-data",
      title: t("Estimating the mean of grouped data", "估计分组数据的均值"),
      explanation: t(
        "When data are grouped into classes, the exact values are lost. Assume every value in a class lies at the class **midpoint** $m$, and use the frequency-table formula:\n\n$$\\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\nFor the classes $0 \\le x < 10$ and $10 \\le x < 20$ with frequencies $3$ and $7$, the midpoints are $5$ and $15$, so $\\bar{x} \\approx \\frac{3 \\cdot 5 + 7 \\cdot 15}{10} = 12$.\n\nCheck: with the lower ends $0$ and $10$ the formula gives $\\frac{3 \\cdot 0 + 7 \\cdot 10}{10} = 7$, and every midpoint is $5$ above its lower end, so the estimate is $7 + 5 = 12$.\n\n> **Watch out.** Use the midpoints, not the ends of the classes: the lower ends give $7$, which is too small. Weight each midpoint by its frequency; $\\frac{5 + 15}{2} = 10$ ignores them.",
        "数据分组后，确切的值就丢失了。假设每一组中的值都位于该组的**组中值** $m$，再用频数表的公式：\n\n$$\\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\n对于组 $0 \\le x < 10$ 和 $10 \\le x < 20$，频数分别为 $3$ 和 $7$，组中值是 $5$ 和 $15$，所以 $\\bar{x} \\approx \\frac{3 \\cdot 5 + 7 \\cdot 15}{10} = 12$。\n\n检验：用下端点 $0$ 和 $10$，公式给出 $\\frac{3 \\cdot 0 + 7 \\cdot 10}{10} = 7$；每个组中值都比下端点大 $5$，所以估计值为 $7 + 5 = 12$。\n\n> **注意。** 要用组中值，不是各组的端点：用下端点得到 $7$，偏小。每个组中值都要乘它的频数；$\\frac{5 + 15}{2} = 10$ 忽略了频数。",
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
        const half = Q.of(w, 2);
        return numberProblem({
          prompt: t(
            `The table shows the ${what[0]}, $x$, in classes.\n\n${tab}\n\nEstimate the mean of $x$.`,
            `下表按组给出${what[1]} $x$。\n\n${tabZ}\n\n估计 $x$ 的均值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(low, "This uses the lower ends of the classes instead of their midpoints.", "这用的是各组的下端点，而不是组中值。"),
            why(
              low.add(Q.of(w)),
              "This uses the upper ends of the classes instead of their midpoints.",
              "这用的是各组的上端点，而不是组中值。",
            ),
            why(qsum(mids).div(Q.of(k)), "This averages the midpoints without their frequencies.", "这只对组中值取平均，没有考虑频数。"),
          ],
          solution: t(
            `**Step 1: Find the midpoints.** Each class has width $${w}$, so the midpoints are $${mids.map(dec).join(", ")}$.\n\n**Step 2: Weight them by the frequencies.**${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${dec(md)}`).join(" + ")}}{${total}} = \\frac{${dec(sfm)}}{${total}} = ${dec(ans)}`)}**Check.** With the lower ends the formula gives $${dec(low)}$, and every midpoint is $${dec(half)}$ above its lower end:${steps(`${dec(low)} + ${dec(half)} = ${dec(ans)}`)}`,
            `**第一步：求组中值。**每组组距为 $${w}$，所以组中值为 $${mids.map(dec).join(", ")}$。\n\n**第二步：按频数加权。**${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${dec(md)}`).join(" + ")}}{${total}} = \\frac{${dec(sfm)}}{${total}} = ${dec(ans)}`)}**检验。**用下端点，公式给出 $${dec(low)}$；每个组中值都比下端点大 $${dec(half)}$：${steps(`${dec(low)} + ${dec(half)} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "estimating-the-variance-of-grouped-data",
      title: t("Estimating the variance of grouped data", "估计分组数据的方差"),
      explanation: t(
        "Expanding the square in the definition of the variance gives a shortcut: the variance is the mean of the squares minus the square of the mean,\n\n$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\mu^2.$$\n\nFor grouped data, use the midpoints again:\n\n$$\\sigma^2 \\approx \\frac{\\sum fm^2}{\\sum f} - \\bar{x}^2, \\quad \\text{where } \\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\nWith midpoints $5$ and $15$ and frequencies $3$ and $7$: $\\bar{x} \\approx 12$, $\\frac{\\sum fm^2}{\\sum f} = \\frac{3 \\cdot 25 + 7 \\cdot 225}{10} = 165$, so $\\sigma^2 \\approx 165 - 144 = 21$.\n\nCheck: from the definition, the midpoints deviate from $12$ by $-7$ and $3$, and $\\frac{3 \\cdot 49 + 7 \\cdot 9}{10} = \\frac{210}{10} = 21$.\n\n> **Watch out.** Subtract the **square** of the mean, $144$, not the mean, $12$. The mean of the squares, $165$, is not the variance until it is subtracted.",
        "把方差定义中的平方展开，可以得到一个简便公式：方差等于平方的均值减去均值的平方，\n\n$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\mu^2.$$\n\n对分组数据，同样使用组中值：\n\n$$\\sigma^2 \\approx \\frac{\\sum fm^2}{\\sum f} - \\bar{x}^2, \\quad \\text{其中 } \\bar{x} \\approx \\frac{\\sum fm}{\\sum f}.$$\n\n组中值为 $5$ 和 $15$、频数为 $3$ 和 $7$ 时：$\\bar{x} \\approx 12$，$\\frac{\\sum fm^2}{\\sum f} = \\frac{3 \\cdot 25 + 7 \\cdot 225}{10} = 165$，所以 $\\sigma^2 \\approx 165 - 144 = 21$。\n\n检验：按定义，两个组中值与 $12$ 的偏差为 $-7$ 和 $3$，而 $\\frac{3 \\cdot 49 + 7 \\cdot 9}{10} = \\frac{210}{10} = 21$。\n\n> **注意。** 要减去均值的**平方** $144$，不是均值 $12$。平方的均值 $165$ 还没减去均值的平方，不是方差。",
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
        const devs = mids.map((md, i) => `${fs[i]}(${md} - ${dec(mean)})^2`).join(" + ");
        return numberProblem({
          prompt: t(
            `The table shows grouped data.\n\n${tab}\n\nEstimate the variance of $x$ using the midpoints of the classes.`,
            `下表给出分组数据。\n\n${tabZ}\n\n用各组组中值估计 $x$ 的方差。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(sq, "This is the mean of the squares; subtract the square of the mean.", "这是平方的均值；还要减去均值的平方。"),
            why(sq.sub(mean), "This subtracts the mean itself instead of its square.", "这减去的是均值本身，而不是均值的平方。"),
            why(
              ans.mul(Q.of(total, total - 1)),
              `This divides by $\\sum f - 1 = ${total - 1}$, as for a sample variance; here divide by $\\sum f = ${total}$.`,
              `这除以了 $\\sum f - 1 = ${total - 1}$，那是样本方差的做法；这里要除以 $\\sum f = ${total}$。`,
            ),
          ],
          solution: t(
            `**Step 1: Find the midpoints and the mean.** The midpoints are $${mids.join(", ")}$, so${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}`).join(" + ")}}{${total}} = ${dec(mean)}`)}**Step 2: Find the mean of the squares.**${steps(`\\frac{\\sum fm^2}{\\sum f} = \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}^2`).join(" + ")}}{${total}} = ${dec(sq)}`)}**Step 3: Subtract the square of the mean.**${steps(`\\sigma^2 \\approx ${dec(sq)} - ${dec(mean)}^2 = ${dec(ans)}`)}**Check.** From the definition, with the deviations of the midpoints from $${dec(mean)}$:${steps(`\\frac{${devs}}{${total}} = ${dec(ans)}`)}`,
            `**第一步：求组中值和均值。**组中值为 $${mids.join(", ")}$，所以${steps(`\\bar{x} \\approx \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}`).join(" + ")}}{${total}} = ${dec(mean)}`)}**第二步：求平方的均值。**${steps(`\\frac{\\sum fm^2}{\\sum f} = \\frac{${mids.map((md, i) => `${fs[i]} \\cdot ${md}^2`).join(" + ")}}{${total}} = ${dec(sq)}`)}**第三步：减去均值的平方。**${steps(`\\sigma^2 \\approx ${dec(sq)} - ${dec(mean)}^2 = ${dec(ans)}`)}**检验。**按定义，用各组中值与 $${dec(mean)}$ 的偏差：${steps(`\\frac{${devs}}{${total}} = ${dec(ans)}`)}`,
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
  intro: t(
    "The pairs $(1, 1), (2, 3), (3, 5)$ rise together: when $x$ is above its mean $2$, $y$ is above its mean $3$ too. Multiplying the deviations of each pair, $(-1)(-2) = 2$, $0 \\cdot 0 = 0$ and $1 \\cdot 2 = 2$, and averaging gives $\\frac{4}{3}$, a positive number that records this.\n\nCheck: $\\frac{\\sum xy}{n} - \\bar{x}\\,\\bar{y} = \\frac{1 + 6 + 15}{3} - 2 \\cdot 3 = \\frac{22}{3} - 6 = \\frac{4}{3}$.\n\nIn this lesson we compute this number, the covariance, from data and from summary statistics, and read its sign from a scatter plot.",
    "数对 $(1, 1), (2, 3), (3, 5)$ 一起上升：$x$ 高于其均值 $2$ 时，$y$ 也高于其均值 $3$。把每对数据的偏差相乘，$(-1)(-2) = 2$，$0 \\cdot 0 = 0$，$1 \\cdot 2 = 2$，再取平均得 $\\frac{4}{3}$，这个正数正记录了这一点。\n\n检验：$\\frac{\\sum xy}{n} - \\bar{x}\\,\\bar{y} = \\frac{1 + 6 + 15}{3} - 2 \\cdot 3 = \\frac{22}{3} - 6 = \\frac{4}{3}$。\n\n本课我们由数据和汇总统计量计算这个数（协方差），并从散点图判断它的符号。",
  ),
  knowledgePoints: [
    {
      id: "covariance-from-data",
      title: t("Covariance from data", "由数据求协方差"),
      explanation: t(
        "The **covariance** of $n$ data pairs $(x, y)$ measures how $x$ and $y$ vary together:\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{n}.$$\n\nA pair with both values above their means, or both below, adds a positive product; a pair with one above and one below adds a negative product.\n\nFor $(1, 2), (2, 6), (3, 4)$: $\\bar{x} = 2$, $\\bar{y} = 4$, and $\\operatorname{cov}(x, y) = \\frac{(-1)(-2) + 0 \\cdot 2 + 1 \\cdot 0}{3} = \\frac{2}{3}$.\n\nCheck: $\\sum xy = 2 + 12 + 12 = 26$, and $\\frac{26}{3} - 2 \\cdot 4 = \\frac{2}{3}$.\n\n> **Watch out.** Keep the signs of the deviations: $(-1)(-2)$ is $+2$. Divide by $n$, the number of pairs, not by $n - 1$.",
        "$n$ 对数据 $(x, y)$ 的**协方差**衡量 $x$ 与 $y$ 共同变化的程度：\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{n}.$$\n\n两个值都高于各自的均值或都低于均值的数对，贡献一个正的乘积；一个高于、一个低于的数对，贡献一个负的乘积。\n\n对 $(1, 2), (2, 6), (3, 4)$：$\\bar{x} = 2$，$\\bar{y} = 4$，$\\operatorname{cov}(x, y) = \\frac{(-1)(-2) + 0 \\cdot 2 + 1 \\cdot 0}{3} = \\frac{2}{3}$。\n\n检验：$\\sum xy = 2 + 12 + 12 = 26$，而 $\\frac{26}{3} - 2 \\cdot 4 = \\frac{2}{3}$。\n\n> **注意。** 保留偏差的符号：$(-1)(-2)$ 等于 $+2$。要除以数对的个数 $n$，不是 $n - 1$。",
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
        const raw = sum(xs.map((x, i) => x * ys[i]!));
        return numberProblem({
          prompt: t(`Find the covariance of the data pairs $${pointList(xs, ys)}$.`, `求数对 $${pointList(xs, ys)}$ 的协方差。`),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              Q.of(sxy, n - 1),
              `This divides by $n - 1 = ${n - 1}$; the covariance divides by the number of pairs, $${n}$.`,
              `这除以了 $n - 1 = ${n - 1}$；协方差要除以数对的个数 $${n}$。`,
            ),
            why(Q.of(sxy), `This is the sum of the products, $S_{xy}$; divide it by $${n}$.`, `这是乘积之和 $S_{xy}$；还要除以 $${n}$。`),
            why(
              ans.neg(),
              "This has the wrong sign: a product of two deviations with the same sign is positive.",
              "符号错了：两个同号偏差的乘积是正的。",
            ),
          ],
          solution: t(
            `**Step 1: Find the means.** $\\bar{x} = \\frac{${sum(xs)}}{${n}} = ${mx}$ and $\\bar{y} = \\frac{${sum(ys)}}{${n}} = ${my}$.\n\n**Step 2: Multiply the deviations of each pair and average.**${steps(`\\operatorname{cov}(x, y) = \\frac{${line}}{${n}}`, `= \\frac{${sxy}}{${n}} = ${show(ans)}`)}**Check.** With the shortcut, $\\sum xy = ${raw}$:${steps(`\\frac{${raw}}{${n}} - ${mx} \\cdot ${my} = ${show(Q.of(raw, n))} - ${mx * my} = ${show(ans)}`)}`,
            `**第一步：求均值。**$\\bar{x} = \\frac{${sum(xs)}}{${n}} = ${mx}$，$\\bar{y} = \\frac{${sum(ys)}}{${n}} = ${my}$。\n\n**第二步：把每对数据的偏差相乘再求平均。**${steps(`\\operatorname{cov}(x, y) = \\frac{${line}}{${n}}`, `= \\frac{${sxy}}{${n}} = ${show(ans)}`)}**检验。**用简便公式，$\\sum xy = ${raw}$：${steps(`\\frac{${raw}}{${n}} - ${mx} \\cdot ${my} = ${show(Q.of(raw, n))} - ${mx * my} = ${show(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "covariance-from-summary-statistics",
      title: t("Covariance from summary statistics", "由汇总统计量求协方差"),
      explanation: t(
        "Expanding the product in the definition gives a shortcut that needs only sums:\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum xy}{n} - \\bar{x}\\,\\bar{y}.$$\n\nIf $n = 10$, $\\sum x = 50$, $\\sum y = 80$ and $\\sum xy = 430$, then $\\bar{x} = 5$, $\\bar{y} = 8$ and $\\operatorname{cov}(x, y) = 43 - 40 = 3$.\n\nCheck: the sum of products is $S_{xy} = 430 - \\frac{50 \\cdot 80}{10} = 30$, and $\\frac{30}{10} = 3$.\n\n> **Watch out.** Subtract the product of the means, $\\bar{x}\\,\\bar{y} = 40$: not $\\sum x \\sum y$, and not the sum of the means $\\bar{x} + \\bar{y}$.",
        "把定义中的乘积展开，可以得到只需要各种和的简便公式：\n\n$$\\operatorname{cov}(x, y) = \\frac{\\sum xy}{n} - \\bar{x}\\,\\bar{y}.$$\n\n若 $n = 10$，$\\sum x = 50$，$\\sum y = 80$，$\\sum xy = 430$，则 $\\bar{x} = 5$，$\\bar{y} = 8$，$\\operatorname{cov}(x, y) = 43 - 40 = 3$。\n\n检验：乘积和 $S_{xy} = 430 - \\frac{50 \\cdot 80}{10} = 30$，而 $\\frac{30}{10} = 3$。\n\n> **注意。** 要减去均值之积 $\\bar{x}\\,\\bar{y} = 40$：不是 $\\sum x \\sum y$，也不是均值之和 $\\bar{x} + \\bar{y}$。",
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
        const S = Q.of(sxy).sub(Q.of(sx * sy, n));
        return numberProblem({
          prompt: t(
            `For a set of data pairs, $${given}$. Find the covariance of $x$ and $y$.`,
            `一组数对满足 $${given}$。求 $x$ 与 $y$ 的协方差。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(mxy, "This is the mean of the products; subtract the product of the means.", "这是乘积的均值；还要减去均值之积。"),
            why(
              Q.of(sxy - sx * sy, n),
              "This subtracts $\\sum x \\sum y$ before dividing; the product of the sums must be divided by $n$ too.",
              "这在相除之前减去了 $\\sum x \\sum y$；和的乘积也要除以 $n$。",
            ),
            why(
              mxy.sub(mx.add(my)),
              "This subtracts the sum of the means instead of their product.",
              "这减去的是均值之和，而不是均值之积。",
            ),
          ],
          solution: t(
            `**Step 1: Find the means.** $\\bar{x} = \\frac{${sx}}{${n}} = ${dec(mx)}$ and $\\bar{y} = \\frac{${sy}}{${n}} = ${dec(my)}$.\n\n**Step 2: Subtract the product of the means from the mean of the products.**${steps(`\\operatorname{cov}(x, y) = \\frac{${sxy}}{${n}} - ${dec(mx)} \\cdot ${dec(my)} = ${dec(mxy)} - ${dec(mx.mul(my))} = ${dec(ans)}`)}**Check.** Through the sum of products:${steps(`S_{xy} = ${sxy} - \\frac{${sx} \\cdot ${sy}}{${n}} = ${dec(S)}`, `\\frac{S_{xy}}{n} = \\frac{${dec(S)}}{${n}} = ${dec(ans)}`)}`,
            `**第一步：求均值。**$\\bar{x} = \\frac{${sx}}{${n}} = ${dec(mx)}$，$\\bar{y} = \\frac{${sy}}{${n}} = ${dec(my)}$。\n\n**第二步：用乘积的均值减去均值之积。**${steps(`\\operatorname{cov}(x, y) = \\frac{${sxy}}{${n}} - ${dec(mx)} \\cdot ${dec(my)} = ${dec(mxy)} - ${dec(mx.mul(my))} = ${dec(ans)}`)}**检验。**通过乘积和计算：${steps(`S_{xy} = ${sxy} - \\frac{${sx} \\cdot ${sy}}{${n}} = ${dec(S)}`, `\\frac{S_{xy}}{n} = \\frac{${dec(S)}}{${n}} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-sign-of-the-covariance",
      title: t("The sign of the covariance", "协方差的符号"),
      explanation: t(
        "The sign of the covariance tells the direction of the relationship:\n\n- **positive**: $y$ tends to increase as $x$ increases (points rise from left to right);\n- **negative**: $y$ tends to decrease as $x$ increases (points fall from left to right);\n- **near zero**: no linear trend.\n\nIts size depends on the units of $x$ and $y$, so the covariance alone does not say how strong the relationship is.\n\nThe points $(1, 6), (2, 4), (3, 2)$ fall from left to right, so their covariance is negative.\n\nCheck: with $\\bar{x} = 2$ and $\\bar{y} = 4$, the products of the deviations are $(-1)(2) + 0 \\cdot 0 + 1 \\cdot (-2) = -4$, which is negative.\n\n> **Watch out.** The sign gives only the direction. A steep line or a large covariance does not mean a strong relationship, and a falling trend is negative however steep it is.",
        "协方差的符号说明关系的方向：\n\n- **正**：$y$ 随 $x$ 增大而趋于增大（点从左到右上升）；\n- **负**：$y$ 随 $x$ 增大而趋于减小（点从左到右下降）；\n- **接近零**：没有线性趋势。\n\n协方差的大小取决于 $x$ 与 $y$ 的单位，所以单凭协方差不能说明关系有多强。\n\n点 $(1, 6), (2, 4), (3, 2)$ 从左到右下降，所以它们的协方差为负。\n\n检验：$\\bar{x} = 2$，$\\bar{y} = 4$，偏差的乘积之和为 $(-1)(2) + 0 \\cdot 0 + 1 \\cdot (-2) = -4$，是负的。\n\n> **注意。** 符号只说明方向。直线陡或协方差大，并不代表关系强；下降的趋势不论多陡，协方差都是负的。",
      ),
      generate(rng) {
        const sign = rng.sign();
        const n = rng.int(5, 7);
        const [xs, ys] = trendData(rng, n, sign);
        const opts = [t("Positive", "正"), t("Negative", "负"), t("Zero", "零")];
        const mx = sum(xs) / n;
        const my = sum(ys) / n;
        const sxy = sum(xs.map((x, i) => (x - mx) * (ys[i]! - my)));
        const dir = sign > 0 ? t("rise", "上升") : t("fall", "下降");
        const problem = choiceProblem({
          prompt: t(
            "The scatter plot shows a set of data pairs. What is the sign of the covariance of $x$ and $y$?",
            "散点图表示一组数对。$x$ 与 $y$ 的协方差的符号是什么？",
          ),
          options: opts,
          correct: sign > 0 ? 0 : 1,
          solution: t(
            `**Step 1: Read the trend.** The points tend to ${dir.en} from left to right.\n\n**Step 2: Find the sign of the products.** ${
              sign > 0
                ? "Pairs are mostly both above or both below their means, so the products of the deviations are mostly positive and the covariance is positive."
                : "In most pairs one value is above its mean and the other below, so the products of the deviations are mostly negative and the covariance is negative."
            }\n\n**Check.** The points are $${pointList(xs, ys)}$, with $\\bar{x} = ${mx}$ and $\\bar{y} = ${my}$. The products of the deviations add up to $S_{xy} = ${sxy}$, which is ${sign > 0 ? "positive" : "negative"}.`,
            `**第一步：看趋势。**点从左到右大体${dir["zh-CN"]}。\n\n**第二步：判断乘积的符号。**${
              sign > 0
                ? "多数数对的两个值同时高于或同时低于各自的均值，偏差的乘积多为正，所以协方差为正。"
                : "多数数对中一个值高于均值、另一个低于均值，偏差的乘积多为负，所以协方差为负。"
            }\n\n**检验。**各点为 $${pointList(xs, ys)}$，$\\bar{x} = ${mx}$，$\\bar{y} = ${my}$。偏差的乘积之和为 $S_{xy} = ${sxy}$，是${sign > 0 ? "正" : "负"}的。`,
          ),
        });
        return {
          ...reasoned(problem, [
            [
              sign > 0 ? "Negative" : "Positive",
              `The points ${dir.en} from left to right, so the covariance is ${sign > 0 ? "positive" : "negative"}.`,
              `点从左到右${dir["zh-CN"]}，所以协方差为${sign > 0 ? "正" : "负"}。`,
            ],
            [
              "Zero",
              `A covariance near zero means no linear trend, but these points clearly ${dir.en}.`,
              `协方差接近零表示没有线性趋势，而这些点明显${dir["zh-CN"]}。`,
            ],
          ]),
          figure: scatter(xs, ys),
        };
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
  intro: t(
    "The variance divides the squared deviations by $n$ at the end. Keeping the total before that division gives the **sum of squares**: for $1, 4, 7$ the mean is $4$, the squared deviations are $9, 0, 9$, and their sum is $S_{xx} = 18$, so the variance is $\\frac{18}{3} = 6$.\n\nCheck: $\\sum x^2 - \\frac{(\\sum x)^2}{n} = 66 - \\frac{144}{3} = 18$.\n\nIn this lesson we compute $S_{xx}$, $S_{yy}$ and the sum of products $S_{xy}$ from data and from summary statistics; they are the building blocks of correlation and regression.",
    "方差最后要把离均差平方之和除以 $n$。保留除以 $n$ 之前的总和，就是**平方和**：对 $1, 4, 7$，均值是 $4$，离均差平方为 $9, 0, 9$，其和为 $S_{xx} = 18$，所以方差是 $\\frac{18}{3} = 6$。\n\n检验：$\\sum x^2 - \\frac{(\\sum x)^2}{n} = 66 - \\frac{144}{3} = 18$。\n\n本课我们由数据和汇总统计量计算 $S_{xx}$、$S_{yy}$ 与乘积和 $S_{xy}$；它们是相关与回归的基础。",
  ),
  knowledgePoints: [
    {
      id: "sums-of-squares-from-data",
      title: t("Sums of squares from data", "由数据求平方和"),
      explanation: t(
        "The **sum of squares** of $x$ is the sum of the squared deviations from the mean:\n\n$$S_{xx} = \\sum (x - \\bar{x})^2.$$\n\nDividing it by $n$ gives the variance: $\\sigma^2 = \\frac{S_{xx}}{n}$. Likewise $S_{yy} = \\sum (y - \\bar{y})^2$.\n\nFor $x = 1, 4, 7$: $\\bar{x} = 4$ and $S_{xx} = 9 + 0 + 9 = 18$.\n\nCheck: $\\sum x^2 = 1 + 16 + 49 = 66$, and $66 - \\frac{12^2}{3} = 66 - 48 = 18$.\n\n> **Watch out.** $S_{xx}$ is not divided by $n$; that gives the variance, $6$. It squares the deviations, not the values: $\\sum x^2 = 66$ is not $S_{xx}$.",
        "$x$ 的**平方和**是离均差的平方之和：\n\n$$S_{xx} = \\sum (x - \\bar{x})^2.$$\n\n把它除以 $n$ 就得到方差：$\\sigma^2 = \\frac{S_{xx}}{n}$。同样地，$S_{yy} = \\sum (y - \\bar{y})^2$。\n\n对 $x = 1, 4, 7$：$\\bar{x} = 4$，$S_{xx} = 9 + 0 + 9 = 18$。\n\n检验：$\\sum x^2 = 1 + 16 + 49 = 66$，而 $66 - \\frac{12^2}{3} = 66 - 48 = 18$。\n\n> **注意。** $S_{xx}$ 不除以 $n$；除以 $n$ 得到的是方差 $6$。它平方的是偏差，不是数据值：$\\sum x^2 = 66$ 不是 $S_{xx}$。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const xs = dataWithMean(rng, n, 1, 20);
        const mu = sum(xs) / n;
        const ss = squaredDeviations(xs, mu);
        const name = rng.pick(["x", "y"]);
        const S = `S_{${name}${name}}`;
        const sx2 = sum(xs.map((x) => x * x));
        const total = sum(xs);
        const bar = name === "x" ? "\\bar{x}" : "\\bar{y}";
        return numberProblem({
          prompt: t(`Find $${S}$ for the data $${name} = ${dataList(xs)}$.`, `求数据 $${name} = ${dataList(xs)}$ 的 $${S}$。`),
          answer: Q.of(ss),
          mistakes: [
            why(
              Q.of(ss, n),
              `This divides by $n = ${n}$, which gives the variance; $${S}$ is the sum itself.`,
              `这除以了 $n = ${n}$，得到的是方差；$${S}$ 就是和本身。`,
            ),
            why(
              Q.of(sx2),
              `This is $\\sum ${name}^2$, the sum of the squared values, not of the squared deviations.`,
              `这是 $\\sum ${name}^2$，即数据值的平方和，不是离均差的平方和。`,
            ),
            why(
              Q.of(sum(xs.map((x) => Math.abs(x - mu)))),
              "This adds the absolute deviations without squaring them.",
              "这把偏差的绝对值相加了，没有平方。",
            ),
          ],
          solution: t(
            `**Step 1: Find the mean.**${steps(`${bar} = \\frac{${total}}{${n}} = ${mu}`)}**Step 2: Add the squared deviations.**${steps(`${S} = ${devLine(xs, mu)}`, `= ${sqLine(xs, mu)} = ${ss}`)}**Check.** With the shortcut, $\\sum ${name}^2 = ${sx2}$:${steps(`${sx2} - \\frac{${total}^2}{${n}} = ${sx2} - ${(total * total) / n} = ${ss}`)}`,
            `**第一步：求均值。**${steps(`${bar} = \\frac{${total}}{${n}} = ${mu}`)}**第二步：把离均差的平方相加。**${steps(`${S} = ${devLine(xs, mu)}`, `= ${sqLine(xs, mu)} = ${ss}`)}**检验。**用简便公式，$\\sum ${name}^2 = ${sx2}$：${steps(`${sx2} - \\frac{${total}^2}{${n}} = ${sx2} - ${(total * total) / n} = ${ss}`)}`,
          ),
        });
      },
    },
    {
      id: "sums-of-squares-from-summary-statistics",
      title: t("Sums of squares from summary statistics", "由汇总统计量求平方和"),
      explanation: t(
        "Expanding the square gives a formula that uses only the sums of the data and of their squares:\n\n$$S_{xx} = \\sum x^2 - \\frac{\\left(\\sum x\\right)^2}{n}.$$\n\nIf $n = 5$, $\\sum x = 20$ and $\\sum x^2 = 96$, then $S_{xx} = 96 - \\frac{400}{5} = 16$.\n\nCheck: through the variance, $\\frac{96}{5} - 4^2 = 19.2 - 16 = 3.2$, and $5 \\cdot 3.2 = 16$.\n\n> **Watch out.** Divide $(\\sum x)^2$ by $n$ before subtracting: $96 - 400$ is negative, which a sum of squares can never be.",
        "把平方展开，得到只用数据之和与平方之和的公式：\n\n$$S_{xx} = \\sum x^2 - \\frac{\\left(\\sum x\\right)^2}{n}.$$\n\n若 $n = 5$，$\\sum x = 20$，$\\sum x^2 = 96$，则 $S_{xx} = 96 - \\frac{400}{5} = 16$。\n\n检验：通过方差，$\\frac{96}{5} - 4^2 = 19.2 - 16 = 3.2$，而 $5 \\cdot 3.2 = 16$。\n\n> **注意。** 相减之前要把 $(\\sum x)^2$ 除以 $n$：$96 - 400$ 是负数，而平方和不可能为负。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5, 8, 10, 20]);
        const d = summaryData(rng, n);
        const useY = rng.bool();
        const [s, s2, v] = useY ? [d.sy, d.syy, "y"] : [d.sx, d.sxx, "x"];
        const ans = Q.of(s2).sub(Q.of(s * s, n));
        const given = `n = ${n}, \\quad \\sum ${v} = ${s}, \\quad \\sum ${v}^2 = ${s2}`;
        const mean = Q.of(s, n);
        const meanSq = Q.of(s2, n);
        return numberProblem({
          prompt: t(`For a data set, $${given}$. Find $S_{${v}${v}}$.`, `某组数据满足 $${given}$。求 $S_{${v}${v}}$。`),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              Q.of(s2 - s * s),
              `This subtracts $(\\sum ${v})^2$ without dividing it by $n = ${n}$.`,
              `这减去了 $(\\sum ${v})^2$，但没有先除以 $n = ${n}$。`,
            ),
            why(
              ans.div(Q.of(n)),
              `This divides by $n$, which gives the variance; $S_{${v}${v}}$ is not divided.`,
              `这除以了 $n$，得到的是方差；$S_{${v}${v}}$ 不除以 $n$。`,
            ),
            why(
              Q.of(s2).sub(Q.of(s, n)),
              `This subtracts $\\frac{\\sum ${v}}{n}$; the sum must be squared first.`,
              `这减去的是 $\\frac{\\sum ${v}}{n}$；和要先平方。`,
            ),
          ],
          solution: t(
            `**Step 1: Square the sum and divide by $n$.**${steps(`\\frac{(\\sum ${v})^2}{n} = \\frac{${s}^2}{${n}} = ${dec(Q.of(s * s, n))}`)}**Step 2: Subtract it from the sum of the squares.**${steps(`S_{${v}${v}} = ${s2} - ${dec(Q.of(s * s, n))} = ${dec(ans)}`)}**Check.** Through the variance, the mean of the squares minus the square of the mean, times $n$:${steps(`${n}\\left(${dec(meanSq)} - ${dec(mean)}^2\\right) = ${n} \\cdot ${dec(meanSq.sub(mean.mul(mean)))} = ${dec(ans)}`)}`,
            `**第一步：把和平方再除以 $n$。**${steps(`\\frac{(\\sum ${v})^2}{n} = \\frac{${s}^2}{${n}} = ${dec(Q.of(s * s, n))}`)}**第二步：用平方和减去它。**${steps(`S_{${v}${v}} = ${s2} - ${dec(Q.of(s * s, n))} = ${dec(ans)}`)}**检验。**通过方差：平方的均值减去均值的平方，再乘以 $n$：${steps(`${n}\\left(${dec(meanSq)} - ${dec(mean)}^2\\right) = ${n} \\cdot ${dec(meanSq.sub(mean.mul(mean)))} = ${dec(ans)}`)}`,
          ),
        });
      },
    },
    {
      id: "the-sum-of-products",
      title: t("The sum of products", "乘积和"),
      explanation: t(
        "For paired data, the **sum of products** is\n\n$$S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y}) = \\sum xy - \\frac{\\sum x \\sum y}{n}.$$\n\nDividing it by $n$ gives the covariance: $\\operatorname{cov}(x, y) = \\frac{S_{xy}}{n}$.\n\nIf $n = 4$, $\\sum x = 10$, $\\sum y = 20$ and $\\sum xy = 62$, then $S_{xy} = 62 - \\frac{200}{4} = 12$.\n\nCheck: with the means $\\bar{x} = 2.5$ and $\\bar{y} = 5$, $\\sum xy - n\\bar{x}\\,\\bar{y} = 62 - 4 \\cdot 2.5 \\cdot 5 = 12$.\n\n> **Watch out.** Divide the product $\\sum x \\sum y$ by $n$, but do not divide $S_{xy}$ itself: $\\frac{12}{4} = 3$ is the covariance.",
        "对成对数据，**乘积和**为\n\n$$S_{xy} = \\sum (x - \\bar{x})(y - \\bar{y}) = \\sum xy - \\frac{\\sum x \\sum y}{n}.$$\n\n把它除以 $n$ 就得到协方差：$\\operatorname{cov}(x, y) = \\frac{S_{xy}}{n}$。\n\n若 $n = 4$，$\\sum x = 10$，$\\sum y = 20$，$\\sum xy = 62$，则 $S_{xy} = 62 - \\frac{200}{4} = 12$。\n\n检验：均值为 $\\bar{x} = 2.5$，$\\bar{y} = 5$，而 $\\sum xy - n\\bar{x}\\,\\bar{y} = 62 - 4 \\cdot 2.5 \\cdot 5 = 12$。\n\n> **注意。** 要把乘积 $\\sum x \\sum y$ 除以 $n$，但 $S_{xy}$ 本身不除以 $n$：$\\frac{12}{4} = 3$ 是协方差。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5, 8, 10, 20]);
        const d = summaryData(rng, n);
        const ans = Q.of(d.sxy).sub(Q.of(d.sx * d.sy, n));
        const given = `n = ${n}, \\quad \\sum x = ${d.sx}, \\quad \\sum y = ${d.sy}, \\quad \\sum xy = ${d.sxy}`;
        const mx = Q.of(d.sx, n);
        const my = Q.of(d.sy, n);
        return numberProblem({
          prompt: t(`For a set of data pairs, $${given}$. Find $S_{xy}$.`, `一组数对满足 $${given}$。求 $S_{xy}$。`),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              Q.of(d.sxy - d.sx * d.sy),
              `This subtracts $\\sum x \\sum y$ without dividing it by $n = ${n}$.`,
              `这减去了 $\\sum x \\sum y$，但没有先除以 $n = ${n}$。`,
            ),
            why(
              ans.div(Q.of(n)),
              "This divides by $n$, which gives the covariance; $S_{xy}$ is not divided.",
              "这除以了 $n$，得到的是协方差；$S_{xy}$ 不除以 $n$。",
            ),
            why(
              Q.of(d.sxy).sub(Q.of(d.sx + d.sy, n)),
              "This adds $\\sum x$ and $\\sum y$ instead of multiplying them.",
              "这把 $\\sum x$ 与 $\\sum y$ 相加了，而不是相乘。",
            ),
          ],
          solution: t(
            `**Step 1: Multiply the sums and divide by $n$.**${steps(`\\frac{\\sum x \\sum y}{n} = \\frac{${d.sx} \\cdot ${d.sy}}{${n}} = ${dec(Q.of(d.sx * d.sy, n))}`)}**Step 2: Subtract it from $\\sum xy$.**${steps(`S_{xy} = ${d.sxy} - ${dec(Q.of(d.sx * d.sy, n))} = ${dec(ans)}`)}**Check.** With the means $\\bar{x} = ${dec(mx)}$ and $\\bar{y} = ${dec(my)}$:${steps(`\\sum xy - n\\bar{x}\\,\\bar{y} = ${d.sxy} - ${n} \\cdot ${dec(mx)} \\cdot ${dec(my)} = ${dec(ans)}`)}`,
            `**第一步：把两个和相乘再除以 $n$。**${steps(`\\frac{\\sum x \\sum y}{n} = \\frac{${d.sx} \\cdot ${d.sy}}{${n}} = ${dec(Q.of(d.sx * d.sy, n))}`)}**第二步：用 $\\sum xy$ 减去它。**${steps(`S_{xy} = ${d.sxy} - ${dec(Q.of(d.sx * d.sy, n))} = ${dec(ans)}`)}**检验。**用均值 $\\bar{x} = ${dec(mx)}$，$\\bar{y} = ${dec(my)}$：${steps(`\\sum xy - n\\bar{x}\\,\\bar{y} = ${d.sxy} - ${n} \\cdot ${dec(mx)} \\cdot ${dec(my)} = ${dec(ans)}`)}`,
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
  intro: t(
    "On a test with mean $60$ and standard deviation $10$, a score of $75$ is $15$ points above the mean, which is $\\frac{15}{10} = 1.5$ standard deviations. That number, $1.5$, is the score's **z-score**.\n\nCheck: going back, $60 + 1.5 \\cdot 10 = 75$.\n\nIn this lesson we compute z-scores, find a value from its z-score, and use z-scores to compare values from different distributions.",
    "在均值为 $60$、标准差为 $10$ 的测验中，$75$ 分比均值高 $15$ 分，即高 $\\frac{15}{10} = 1.5$ 个标准差。这个数 $1.5$ 就是该成绩的 **z 分数**。\n\n检验：反过来，$60 + 1.5 \\cdot 10 = 75$。\n\n本课我们计算 z 分数，由 z 分数求数值，并用 z 分数比较来自不同分布的数值。",
  ),
  knowledgePoints: [
    {
      id: "computing-a-z-score",
      title: t("Computing a z-score", "计算 z 分数"),
      explanation: t(
        "The **z-score** of a value $x$ says how many standard deviations it lies above or below the mean:\n\n$$z = \\frac{x - \\mu}{\\sigma}.$$\n\nA positive $z$ is above the mean, a negative $z$ below it.\n\nIf the mean is $70$ and the standard deviation is $8$, a score of $82$ has $z = \\frac{82 - 70}{8} = 1.5$.\n\nCheck: $70 + 1.5 \\cdot 8 = 70 + 12 = 82$.\n\n> **Watch out.** Subtract the mean from the value, $x - \\mu$, not the other way round: a value below the mean has a negative z-score. Divide by the standard deviation, not the variance.",
        "数值 $x$ 的 **z 分数**表示它比均值高或低多少个标准差：\n\n$$z = \\frac{x - \\mu}{\\sigma}.$$\n\n$z$ 为正表示高于均值，为负表示低于均值。\n\n若均值为 $70$，标准差为 $8$，则 $82$ 分的 $z = \\frac{82 - 70}{8} = 1.5$。\n\n检验：$70 + 1.5 \\cdot 8 = 70 + 12 = 82$。\n\n> **注意。** 要用数值减去均值，即 $x - \\mu$，不能反过来：低于均值的数值，z 分数为负。要除以标准差，不是方差。",
      ),
      generate(rng) {
        const { sc, mu, sd } = zSetting(rng);
        const z = zValue(rng, sd);
        const x = Q.of(mu).add(z.mul(Q.of(sd)));
        const d = x.sub(Q.of(mu));
        const side = z.sign() > 0 ? t("above", "高于") : t("below", "低于");
        return numberProblem({
          prompt: t(
            `The ${sc[0]} in a study have mean $${mu}$ and standard deviation $${sd}$ (in ${sc[2]}). Find the z-score of the value $${x.toLatex()}$.`,
            `某研究中${sc[1]}的均值为 $${mu}$，标准差为 $${sd}$（单位：${sc[3]}）。求数值 $${x.toLatex()}$ 的 z 分数。`,
          ),
          answer: z,
          ...decimalForm(z),
          mistakes: [
            why(
              z.neg(),
              "This subtracts the value from the mean; the z-score uses $x - \\mu$.",
              "这用均值减去了数值；z 分数用的是 $x - \\mu$。",
            ),
            why(
              z.div(Q.of(sd)),
              `This divides by $${sd}$ twice, that is by the variance $${sd * sd}$.`,
              `这除了两次 $${sd}$，相当于除以方差 $${sd * sd}$。`,
            ),
            why(
              d,
              `This is the distance from the mean in ${sc[2]}; divide it by the standard deviation $${sd}$.`,
              `这是与均值之差（单位：${sc[3]}）；还要除以标准差 $${sd}$。`,
            ),
          ],
          solution: t(
            `**Step 1: Subtract the mean.** $${x.toLatex()} - ${mu} = ${d.toLatex()}$, so the value is $${d.abs().toLatex()}$ ${sc[2]} ${side.en} the mean.\n\n**Step 2: Divide by the standard deviation.**${steps(`z = \\frac{${d.toLatex()}}{${sd}} = ${dec(z)}`)}**Check.** Going back from the z-score:${steps(`\\mu + z\\sigma = ${mu} + ${paren(dec(z))} \\cdot ${sd} = ${x.toLatex()}`)}`,
            `**第一步：减去均值。**$${x.toLatex()} - ${mu} = ${d.toLatex()}$，所以该数值${side["zh-CN"]}均值 $${d.abs().toLatex()}$ ${sc[3]}。\n\n**第二步：除以标准差。**${steps(`z = \\frac{${d.toLatex()}}{${sd}} = ${dec(z)}`)}**检验。**由 z 分数反推：${steps(`\\mu + z\\sigma = ${mu} + ${paren(dec(z))} \\cdot ${sd} = ${x.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "a-value-from-its-z-score",
      title: t("A value from its z-score", "由 z 分数求数值"),
      explanation: t(
        "A z-score tells how many standard deviations a value lies above or below the mean, so the value is the mean plus that many standard deviations. Solving $z = \\frac{x - \\mu}{\\sigma}$ for $x$ gives\n\n$$x = \\mu + z\\sigma.$$\n\nWith mean $50$ and standard deviation $6$, the value with $z = -1.5$ is $50 + (-1.5)(6) = 41$.\n\nCheck: $\\frac{41 - 50}{6} = \\frac{-9}{6} = -1.5$.\n\n> **Watch out.** Multiply $z$ by the standard deviation before adding it to the mean, and keep its sign: a negative $z$ gives a value below the mean.",
        "z 分数表示一个值比平均数高或低多少个标准差，所以这个值等于平均数加上这么多个标准差。由 $z = \\frac{x - \\mu}{\\sigma}$ 解出 $x$，得\n\n$$x = \\mu + z\\sigma.$$\n\n均值为 $50$、标准差为 $6$ 时，$z = -1.5$ 对应的数值是 $50 + (-1.5)(6) = 41$。\n\n检验：$\\frac{41 - 50}{6} = \\frac{-9}{6} = -1.5$。\n\n> **注意。** 先把 $z$ 乘以标准差，再加到均值上，并保留 $z$ 的符号：$z$ 为负时，数值低于均值。",
      ),
      generate(rng) {
        const { sc, mu, sd } = zSetting(rng);
        const z = zValue(rng, sd);
        const zs = z.mul(Q.of(sd));
        const x = Q.of(mu).add(zs);
        return numberProblem({
          prompt: t(
            `The ${sc[0]} in a study have mean $${mu}$ and standard deviation $${sd}$ (in ${sc[2]}). Which value has a z-score of $${dec(z)}$?`,
            `某研究中${sc[1]}的均值为 $${mu}$，标准差为 $${sd}$（单位：${sc[3]}）。z 分数为 $${dec(z)}$ 的数值是多少？`,
          ),
          answer: x,
          mistakes: [
            why(Q.of(mu).sub(zs), "This has the wrong sign: add $z\\sigma$ to the mean.", "符号错了：要把 $z\\sigma$ 加到均值上。"),
            why(
              Q.of(mu).add(z),
              `This adds $z$ itself; first multiply it by the standard deviation $${sd}$.`,
              `这直接加上了 $z$；要先乘以标准差 $${sd}$。`,
            ),
            why(
              zs,
              `This is only $z\\sigma$, the distance from the mean; add the mean $${mu}$.`,
              `这只是 $z\\sigma$，即与均值的距离；还要加上均值 $${mu}$。`,
            ),
          ],
          solution: t(
            `**Step 1: Find how far the value is from the mean.**${steps(`z\\sigma = ${paren(dec(z))} \\cdot ${sd} = ${zs.toLatex()}`)}**Step 2: Add it to the mean.**${steps(`x = ${mu} + ${paren(zs.toLatex())} = ${x.toLatex()}`)}**Check.** The z-score of $${x.toLatex()}$:${steps(`\\frac{${x.toLatex()} - ${mu}}{${sd}} = \\frac{${zs.toLatex()}}{${sd}} = ${dec(z)}`)}`,
            `**第一步：求该数值与均值的距离。**${steps(`z\\sigma = ${paren(dec(z))} \\cdot ${sd} = ${zs.toLatex()}`)}**第二步：加到均值上。**${steps(`x = ${mu} + ${paren(zs.toLatex())} = ${x.toLatex()}`)}**检验。**$${x.toLatex()}$ 的 z 分数：${steps(`\\frac{${x.toLatex()} - ${mu}}{${sd}} = \\frac{${zs.toLatex()}}{${sd}} = ${dec(z)}`)}`,
          ),
        });
      },
    },
    {
      id: "comparing-values-with-z-scores",
      title: t("Comparing values with z-scores", "用 z 分数比较数值"),
      explanation: t(
        "Values from different distributions cannot be compared directly, but their z-scores can: the larger z-score lies further above its own mean, measured in standard deviations.\n\nA score of $80$ on a test with mean $70$ and standard deviation $5$ has $z = 2$; a score of $90$ on a test with mean $75$ and standard deviation $10$ has $z = 1.5$. Relative to the other students, the $80$ is the better result.\n\nCheck: the $80$ is $10$ points, two standard deviations of $5$, above its mean; the $90$ is $15$ points, only one and a half standard deviations of $10$, above its mean.\n\n> **Watch out.** Do not compare the raw scores, or the points above the mean: the $90$ is higher and $15$ points above its mean, yet it is the weaker result.",
        "来自不同分布的数值不能直接比较，但可以比较它们的 z 分数：z 分数越大，以标准差为单位衡量，它高出自己所在分布均值的幅度就越大。\n\n均值 $70$、标准差 $5$ 的测验中得 $80$ 分，$z = 2$；均值 $75$、标准差 $10$ 的测验中得 $90$ 分，$z = 1.5$。与其他学生相比，$80$ 分是更好的成绩。\n\n检验：$80$ 分比均值高 $10$ 分，即两个标准差（每个 $5$ 分）；$90$ 分比均值高 $15$ 分，只有一个半标准差（每个 $10$ 分）。\n\n> **注意。** 不要比较原始分数，也不要比较高出均值的分数：$90$ 分更高，且高出均值 $15$ 分，却是较弱的成绩。",
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
          const other = 1 - best;
          const opts = subjects.map((s) => t(`The ${s[0]} test`, `${s[1]}测验`));
          const line = (i: number) =>
            `z_{\\text{${subjects[i]![0]}}} = \\frac{${xs[i]!.toLatex()} - ${mus[i]}}{${sds[i]}} = ${dec(zs[i]!)}`;
          const lineZ = (i: number) =>
            `z_{\\text{${subjects[i]![1]}}} = \\frac{${xs[i]!.toLatex()} - ${mus[i]}}{${sds[i]}} = ${dec(zs[i]!)}`;
          const back = (i: number) => `${mus[i]} + ${paren(dec(zs[i]!))} \\cdot ${sds[i]} = ${xs[i]!.toLatex()}`;
          const desc = (i: number) =>
            `$${xs[i]!.toLatex()}$ on the ${subjects[i]![0]} test (mean $${mus[i]}$, standard deviation $${sds[i]}$)`;
          const descZ = (i: number) => `${subjects[i]![1]}测验得 $${xs[i]!.toLatex()}$ 分（均值 $${mus[i]}$，标准差 $${sds[i]}$）`;
          const problem = choiceProblem({
            prompt: t(
              `A student scored ${desc(0)} and ${desc(1)}. On which test did the student do better relative to the other students?`,
              `一名学生${descZ(0)}，${descZ(1)}。与其他学生相比，该学生哪门测验考得更好？`,
            ),
            options: opts,
            correct: best,
            solution: t(
              `**Step 1: Find the z-score of each score.**${steps(line(0), line(1))}**Step 2: Compare them.** $${dec(zs[best]!)} > ${dec(zs[other]!)}$, so the ${subjects[best]![0]} score has the larger z-score: measured in standard deviations, it stands higher against its own mean, which makes it the better result.\n\n**Check.** Each z-score gives back its score, $\\mu + z\\sigma$:${steps(back(0), back(1))}`,
              `**第一步：求每个成绩的 z 分数。**${steps(lineZ(0), lineZ(1))}**第二步：比较。**$${dec(zs[best]!)} > ${dec(zs[other]!)}$，所以${subjects[best]![1]}成绩的 z 分数更大：以标准差为单位衡量，它相对自身均值的位置更高，是更好的成绩。\n\n**检验。**由每个 z 分数反推出成绩，$\\mu + z\\sigma$：${steps(back(0), back(1))}`,
            ),
          });
          return reasoned(problem, [
            [
              opts[other]!.en,
              `The ${subjects[other]![0]} score has z-score $${dec(zs[other]!)}$, smaller than $${dec(zs[best]!)}$; compare z-scores, not raw scores.`,
              `${subjects[other]![1]}成绩的 z 分数为 $${dec(zs[other]!)}$，小于 $${dec(zs[best]!)}$；要比较 z 分数，而不是原始分数。`,
            ],
          ]);
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
  intro: t(
    "A line of fit $\\hat{y} = 2x + 1$ predicts $\\hat{y} = 7$ at $x = 3$, but the data point there is $(3, 8)$. The line missed by $8 - 7 = 1$: this difference is the point's **residual**.\n\nCheck: adding the residual to the prediction gives back the data value, $7 + 1 = 8$.\n\nIn this lesson we compute residuals, recover a data value from its residual, and read a residual plot to judge whether a line is a good model.",
    "拟合直线 $\\hat{y} = 2x + 1$ 在 $x = 3$ 处预测 $\\hat{y} = 7$，而那里的数据点是 $(3, 8)$。直线偏差了 $8 - 7 = 1$：这个差就是该点的**残差**。\n\n检验：预测值加上残差就得回数据值，$7 + 1 = 8$。\n\n本课我们计算残差，由残差还原数据值，并阅读残差图，判断直线是不是好的模型。",
  ),
  knowledgePoints: [
    {
      id: "residuals-of-several-points",
      title: t("Residuals of data points", "数据点的残差"),
      explanation: t(
        "For a line of fit $\\hat{y} = mx + b$, the **residual** of a data point $(x, y)$ is\n\n$$e = y - \\hat{y},$$\n\nthe actual value minus the predicted value. Points above the line have positive residuals, points below it negative ones. For the least-squares line the residuals add up to $0$.\n\nWith $\\hat{y} = 1.5x + 2$, the point $(4, 9)$ has $\\hat{y} = 8$ and residual $9 - 8 = 1$.\n\nCheck: the point is above the line, since $9 > 8$, so its residual is positive.\n\n> **Watch out.** The residual is actual minus predicted, $y - \\hat{y}$, not $\\hat{y} - y$: reversing it flips the sign.",
        "对拟合直线 $\\hat{y} = mx + b$，数据点 $(x, y)$ 的**残差**是\n\n$$e = y - \\hat{y},$$\n\n即实际值减去预测值。直线上方的点残差为正，下方的点残差为负。最小二乘直线的残差之和为 $0$。\n\n对 $\\hat{y} = 1.5x + 2$，点 $(4, 9)$ 的预测值 $\\hat{y} = 8$，残差为 $9 - 8 = 1$。\n\n检验：因为 $9 > 8$，该点在直线上方，所以残差为正。\n\n> **注意。** 残差是实际值减去预测值，即 $y - \\hat{y}$，不是 $\\hat{y} - y$：顺序反了，符号也就反了。",
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
        const above = ans.sign() > 0;
        return numberProblem({
          prompt: t(
            `A line of fit for the data below is $${lineLatex(mm, b)}$.\n\n${tab}\n\nFind the residual of the data point with $x = ${xs[j]}$.`,
            `下表数据的一条拟合直线是 $${lineLatex(mm, b)}$。\n\n${tab}\n\n求 $x = ${xs[j]}$ 的数据点的残差。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              ans.neg(),
              "This is $\\hat{y} - y$; the residual is the actual value minus the predicted one.",
              "这是 $\\hat{y} - y$；残差是实际值减去预测值。",
            ),
            why(
              pred,
              "This is the predicted value $\\hat{y}$; subtract it from the actual value.",
              "这是预测值 $\\hat{y}$；还要用实际值减去它。",
            ),
            why(
              ys[j]!.add(pred),
              "This adds the prediction to the actual value instead of subtracting it.",
              "这把预测值加到了实际值上，而不是相减。",
            ),
          ],
          solution: t(
            `**Step 1: Predict at $x = ${xs[j]}$.**${steps(`\\hat{y} = ${dec(mm)} \\cdot ${xs[j]} ${signed(b)} = ${dec(pred)}`)}**Step 2: Subtract the prediction from the actual value.**${steps(`e = y - \\hat{y} = ${dec(ys[j]!)} - ${paren(dec(pred))} = ${dec(ans)}`)}**Check.** Adding the residual to the prediction gives back the data value: $${dec(pred)} + ${paren(dec(ans))} = ${dec(ys[j]!)}$. The point lies ${above ? "above" : "below"} the line, so the residual is ${above ? "positive" : "negative"}.`,
            `**第一步：求 $x = ${xs[j]}$ 处的预测值。**${steps(`\\hat{y} = ${dec(mm)} \\cdot ${xs[j]} ${signed(b)} = ${dec(pred)}`)}**第二步：用实际值减去预测值。**${steps(`e = y - \\hat{y} = ${dec(ys[j]!)} - ${paren(dec(pred))} = ${dec(ans)}`)}**检验。**预测值加上残差得回数据值：$${dec(pred)} + ${paren(dec(ans))} = ${dec(ys[j]!)}$。该点在直线${above ? "上方" : "下方"}，所以残差为${above ? "正" : "负"}。`,
          ),
        });
      },
    },
    {
      id: "a-data-value-from-its-residual",
      title: t("A data value from its residual", "由残差求数据值"),
      explanation: t(
        "Since $e = y - \\hat{y}$, the actual value is the prediction plus the residual:\n\n$$y = \\hat{y} + e.$$\n\nWith $\\hat{y} = 2x + 5$, a point at $x = 3$ with residual $-1.5$ has $y = 11 + (-1.5) = 9.5$.\n\nCheck: the residual of $(3, 9.5)$ is $9.5 - 11 = -1.5$.\n\n> **Watch out.** Add the residual to the prediction, keeping its sign: a negative residual puts the point below the line, so $y$ is less than $\\hat{y}$.",
        "由 $e = y - \\hat{y}$，实际值等于预测值加上残差：\n\n$$y = \\hat{y} + e.$$\n\n对 $\\hat{y} = 2x + 5$，在 $x = 3$ 处残差为 $-1.5$ 的点，其 $y = 11 + (-1.5) = 9.5$。\n\n检验：点 $(3, 9.5)$ 的残差为 $9.5 - 11 = -1.5$。\n\n> **注意。** 要把残差连同符号加到预测值上：残差为负，点就在直线下方，所以 $y$ 小于 $\\hat{y}$。",
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
          mistakes: [
            why(
              pred.sub(e),
              "This subtracts the residual; since $e = y - \\hat{y}$, the value is $\\hat{y} + e$.",
              "这减去了残差；由 $e = y - \\hat{y}$，数值是 $\\hat{y} + e$。",
            ),
            why(pred, "This is the prediction alone; add the residual to it.", "这只是预测值；还要加上残差。"),
            why(e, "This is the residual alone; add it to the prediction.", "这只是残差；还要把它加到预测值上。"),
          ],
          solution: t(
            `**Step 1: Predict at $x = ${x}$.**${steps(`\\hat{y} = ${dec(mm)} \\cdot ${x} ${signed(b)} = ${dec(pred)}`)}**Step 2: Add the residual.**${steps(`y = \\hat{y} + e = ${dec(pred)} + ${paren(dec(e))} = ${dec(ans)}`)}**Check.** The residual of this value is $${dec(ans)} - ${paren(dec(pred))} = ${dec(e)}$, as given.`,
            `**第一步：求 $x = ${x}$ 处的预测值。**${steps(`\\hat{y} = ${dec(mm)} \\cdot ${x} ${signed(b)} = ${dec(pred)}`)}**第二步：加上残差。**${steps(`y = \\hat{y} + e = ${dec(pred)} + ${paren(dec(e))} = ${dec(ans)}`)}**检验。**这个值的残差为 $${dec(ans)} - ${paren(dec(pred))} = ${dec(e)}$，与已知相符。`,
          ),
        });
      },
    },
    {
      id: "reading-residual-plots",
      figure: precalculusDrawings4["residuals-and-residual-plots#reading-residual-plots"],
      title: t("Reading residual plots", "阅读残差图"),
      explanation: t(
        "A **residual plot** shows the residual $e$ of each data point against $x$.\n\n- If the residuals are scattered randomly above and below $0$ with no pattern, a linear model is appropriate.\n- If they form a curve, for example positive at both ends and negative in the middle, the relationship is not linear and another model (such as a quadratic or exponential one) fits better.\n\nFor example, residuals with signs $+, +, -, -, -, -, +, +$ from left to right form a U shape, so a line is the wrong model; signs such as $+, -, -, +, -, +, +, -$ with no shape support it.\n\nCheck: data on the parabola $y = x^2$ at $x = 0, 1, 2, 3, 4$, fitted by the line $\\hat{y} = 4x - 2$, have residuals $2, -1, -2, -1, 2$: positive at the ends and negative in the middle.\n\n> **Watch out.** The residuals of real data are never all $0$, so nonzero residuals do not rule a line out. What matters is whether they show a pattern.",
        "**残差图**画出每个数据点的残差 $e$ 关于 $x$ 的图。\n\n- 如果残差在 $0$ 的上下随机分布、没有规律，线性模型是合适的。\n- 如果残差呈曲线形状，例如两端为正、中间为负，说明关系不是线性的，另一种模型（如二次或指数模型）拟合得更好。\n\n例如，从左到右符号为 $+, +, -, -, -, -, +, +$ 的残差呈 U 形，所以直线是错误的模型；而符号如 $+, -, -, +, -, +, +, -$、没有形状的残差则支持直线。\n\n检验：抛物线 $y = x^2$ 上 $x = 0, 1, 2, 3, 4$ 处的数据，用直线 $\\hat{y} = 4x - 2$ 拟合，残差为 $2, -1, -2, -1, 2$：两端为正，中间为负。\n\n> **注意。** 真实数据的残差不可能全为 $0$，所以残差不为零并不排除直线。关键是残差有没有规律。",
      ),
      generate(rng) {
        const curved = rng.bool();
        const xs = range(1, 11);
        let es: number[];
        const runsOf = (v: readonly number[]) => {
          const signs = v.filter((e) => e !== 0).map(Math.sign);
          return signs.filter((s, i) => i === 0 || s !== signs[i - 1]).length;
        };
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
            if (runsOf(es) < 5) continue;
          } else if (runsOf(es) > 3) continue;
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
          "A linear model is appropriate: the residuals are scattered randomly about $0$",
          "线性模型合适：残差在 $0$ 附近随机分布",
        );
        const curve = t("A linear model is not appropriate: the residuals follow a curved pattern", "线性模型不合适：残差呈曲线规律");
        const allPos = t("A linear model is not appropriate: most residuals are not equal to $0$", "线性模型不合适：大多数残差不等于 $0$");
        const wrongSign = t("A linear model is appropriate: the residuals follow a curved pattern", "线性模型合适：残差呈曲线规律");
        const options = [fits, curve, allPos, wrongSign];
        const signList = es
          .filter((e) => e !== 0)
          .map((e) => (e > 0 ? "+" : "-"))
          .join(", ");
        const runs = runsOf(es);
        const problem = choiceProblem({
          prompt: t(
            "A line was fitted to a data set. The residual plot is shown. What does it say about the linear model?",
            "对一组数据拟合了一条直线，其残差图如下。关于线性模型，残差图说明了什么？",
          ),
          options,
          correct: curved ? 1 : 0,
          solution: curved
            ? t(
                `**Step 1: Look for a pattern.** The residuals are on one side of $0$ at both ends and on the other side in the middle: a curved pattern.\n\n**Step 2: Judge the model.** The data follow a curve, so a linear model is not appropriate.\n\n**Check.** Reading the nonzero residuals from left to right, the signs are $${signList}$: only ${runs} runs of one sign, the long stretches a curve gives, not a random mix.`,
                `**第一步：找规律。**残差在两端位于 $0$ 的一侧，在中间位于另一侧，呈曲线规律。\n\n**第二步：判断模型。**数据沿曲线分布，所以线性模型不合适。\n\n**检验。**从左到右读非零残差，符号为 $${signList}$：只有 ${runs} 段同号，这是曲线造成的长段，不是随机的混合。`,
              )
            : t(
                `**Step 1: Look for a pattern.** The residuals are scattered above and below $0$ with no curve or other shape.\n\n**Step 2: Judge the model.** With no pattern left over, a linear model is appropriate. Residuals are never all $0$ for real data.\n\n**Check.** Reading the nonzero residuals from left to right, the signs are $${signList}$: they switch sides ${runs - 1} times, a random mix rather than long stretches on one side.`,
                `**第一步：找规律。**残差在 $0$ 的上下分布，没有曲线或其他形状。\n\n**第二步：判断模型。**没有剩下的规律，所以线性模型合适。真实数据的残差不可能全为 $0$。\n\n**检验。**从左到右读非零残差，符号为 $${signList}$：正负交换了 ${runs - 1} 次，是随机的混合，而不是在一侧的长段。`,
              ),
        });
        const reasons: Reason[] = [
          [
            allPos.en,
            "Residuals of real data are never all $0$; what matters is whether they show a pattern.",
            "真实数据的残差不可能全为 $0$；关键是它们有没有规律。",
          ],
          [
            wrongSign.en,
            "A curved pattern in the residuals means that a linear model is not appropriate.",
            "残差呈曲线规律，说明线性模型不合适。",
          ],
          curved
            ? [fits.en, "These residuals are not random: they follow a curve.", "这些残差不是随机的：它们呈曲线。"]
            : [
                curve.en,
                "These residuals show no curve: they are scattered randomly about $0$.",
                "这些残差没有呈曲线：它们在 $0$ 附近随机分布。",
              ],
        ];
        return { ...reasoned(problem, reasons), figure };
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
  intro: t(
    "The covariance depends on units: measure $x$ in centimeters instead of meters and it grows a hundred times. Dividing by the spreads of both variables removes the units. For data with $S_{xx} = 4$, $S_{yy} = 25$ and $S_{xy} = 9$, the correlation coefficient is $r = \\frac{9}{\\sqrt{4 \\cdot 25}} = \\frac{9}{10} = 0.9$, a strong positive linear relationship.\n\nCheck: $r$ lies between $-1$ and $1$, and it has the sign of $S_{xy} = 9$.\n\nIn this lesson we compute $r$ from sums of squares and from the covariance, and see how it changes when the data are rescaled.",
    "协方差与单位有关：把 $x$ 的单位从米换成厘米，协方差就变成一百倍。除以两个变量的分散程度就消去了单位。对 $S_{xx} = 4$，$S_{yy} = 25$，$S_{xy} = 9$ 的数据，相关系数为 $r = \\frac{9}{\\sqrt{4 \\cdot 25}} = \\frac{9}{10} = 0.9$，表示很强的正线性关系。\n\n检验：$r$ 在 $-1$ 与 $1$ 之间，并且与 $S_{xy} = 9$ 同号。\n\n本课我们由平方和与协方差计算 $r$，并了解数据作线性变换时 $r$ 如何变化。",
  ),
  knowledgePoints: [
    {
      id: "r-from-sums-of-squares",
      title: t("r from sums of squares", "由平方和求 r"),
      explanation: t(
        "The **(Pearson) correlation coefficient** is\n\n$$r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}.$$\n\nIt has no units and always satisfies $-1 \\le r \\le 1$: values near $\\pm 1$ mean a strong linear relationship, values near $0$ a weak one, and its sign is the sign of $S_{xy}$.\n\nIf $S_{xx} = 40$, $S_{yy} = 90$ and $S_{xy} = -48$, then $r = \\frac{-48}{\\sqrt{3600}} = \\frac{-48}{60} = -0.8$.\n\nCheck: $r^2 = 0.64$, and $\\frac{S_{xy}^2}{S_{xx} S_{yy}} = \\frac{2304}{3600} = 0.64$.\n\n> **Watch out.** Take the square root of the product $S_{xx} S_{yy}$; without it, or with the sum $S_{xx} + S_{yy}$ under the root, the result is not $r$. An answer outside $[-1, 1]$ is always a mistake.",
        "**（皮尔逊）相关系数**为\n\n$$r = \\frac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}.$$\n\n它没有单位，并且总有 $-1 \\le r \\le 1$：接近 $\\pm 1$ 表示线性关系强，接近 $0$ 表示线性关系弱，它的符号与 $S_{xy}$ 的符号相同。\n\n若 $S_{xx} = 40$，$S_{yy} = 90$，$S_{xy} = -48$，则 $r = \\frac{-48}{\\sqrt{3600}} = \\frac{-48}{60} = -0.8$。\n\n检验：$r^2 = 0.64$，而 $\\frac{S_{xy}^2}{S_{xx} S_{yy}} = \\frac{2304}{3600} = 0.64$。\n\n> **注意。** 要对乘积 $S_{xx} S_{yy}$ 开平方；不开方，或在根号下用和 $S_{xx} + S_{yy}$，得到的都不是 $r$。结果不在 $[-1, 1]$ 内，一定是算错了。",
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
          const rootText = (Math.round(root * 100) / 100).toFixed(2);
          const back = (Math.round(ans.toNumber() * root * 10) / 10).toFixed(1);
          return numberProblem({
            prompt: t(
              `For a set of data pairs, $${given}$. Find the correlation coefficient $r$, rounded to two decimal places.`,
              `一组数对满足 $${given}$。求相关系数 $r$，结果保留两位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: [
              ...whyIf(
                rounded(sxy / (sxx * syy), 4),
                "This divides by $S_{xx} S_{yy}$ without taking its square root.",
                "这除以了 $S_{xx} S_{yy}$，但没有开平方。",
              ),
              ...whyIf(
                rounded(sxy / Math.sqrt(sxx + syy), 2),
                "This puts the sum $S_{xx} + S_{yy}$ under the root; it must be the product.",
                "这在根号下用了和 $S_{xx} + S_{yy}$；应该是乘积。",
              ),
              why(ans.neg(), "This has the wrong sign: $r$ has the sign of $S_{xy}$.", "符号错了：$r$ 与 $S_{xy}$ 同号。"),
            ],
            solution: t(
              `**Step 1: Multiply the sums of squares and take the square root.**${steps(`\\sqrt{${sxx} \\cdot ${syy}} = \\sqrt{${sxx * syy}} \\approx ${rootText}`)}**Step 2: Divide $S_{xy}$ by it.**${steps(`r = \\frac{${sxy}}{${rootText}} \\approx ${dec(ans)}`)}**Check.** The value lies between $-1$ and $1$ and has the sign of $S_{xy}$. Going back, $${dec(ans)} \\cdot ${rootText} \\approx ${back}$, close to $S_{xy} = ${sxy}$; the small gap comes from rounding $r$.`,
              `**第一步：把两个平方和相乘再开平方。**${steps(`\\sqrt{${sxx} \\cdot ${syy}} = \\sqrt{${sxx * syy}} \\approx ${rootText}`)}**第二步：用 $S_{xy}$ 除以它。**${steps(`r = \\frac{${sxy}}{${rootText}} \\approx ${dec(ans)}`)}**检验。**结果在 $-1$ 与 $1$ 之间，且与 $S_{xy}$ 同号。反过来，$${dec(ans)} \\cdot ${rootText} \\approx ${back}$，接近 $S_{xy} = ${sxy}$；微小的差别来自 $r$ 的四舍五入。`,
            ),
          });
        }
      },
    },
    {
      id: "r-from-the-covariance",
      title: t("r from the covariance", "由协方差求 r"),
      explanation: t(
        "Dividing $S_{xy}$, $S_{xx}$ and $S_{yy}$ by $n$ turns them into the covariance and the variances, so\n\n$$r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y}.$$\n\nIf $\\operatorname{cov}(x, y) = 9$, $\\sigma_x = 3$ and $\\sigma_y = 5$, then $r = \\frac{9}{15} = 0.6$.\n\nCheck: $r \\sigma_x \\sigma_y = 0.6 \\cdot 3 \\cdot 5 = 9$, the covariance.\n\n> **Watch out.** Divide by the product of the standard deviations, $15$, not by the product of the variances, $9 \\cdot 25$, and not by their sum.",
        "把 $S_{xy}$、$S_{xx}$、$S_{yy}$ 都除以 $n$，就得到协方差和方差，所以\n\n$$r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y}.$$\n\n若 $\\operatorname{cov}(x, y) = 9$，$\\sigma_x = 3$，$\\sigma_y = 5$，则 $r = \\frac{9}{15} = 0.6$。\n\n检验：$r \\sigma_x \\sigma_y = 0.6 \\cdot 3 \\cdot 5 = 9$，正是协方差。\n\n> **注意。** 要除以两个标准差的乘积 $15$，不是两个方差的乘积 $9 \\cdot 25$，也不是标准差之和。",
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
          mistakes: [
            why(
              cov.div(Q.of(sx * sx * sy * sy)),
              "This divides by the product of the variances; divide by the product of the standard deviations.",
              "这除以了方差之积；应除以标准差之积。",
            ),
            why(
              cov.div(Q.of(sx + sy)),
              "This divides by the sum of the standard deviations instead of their product.",
              "这除以了标准差之和，而不是标准差之积。",
            ),
            why(r.neg(), "This has the wrong sign: $r$ has the sign of the covariance.", "符号错了：$r$ 与协方差同号。"),
          ],
          solution: t(
            `**Step 1: Multiply the standard deviations.** $\\sigma_x \\sigma_y = ${sx} \\cdot ${sy} = ${sx * sy}$.\n\n**Step 2: Divide the covariance by this product.**${steps(`r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y} = \\frac{${dec(cov)}}{${sx * sy}} = ${dec(r)}`)}**Check.** Multiplying back, $${dec(r)} \\cdot ${sx} \\cdot ${sy} = ${dec(cov)}$, the covariance; and $r$ lies between $-1$ and $1$.`,
            `**第一步：把两个标准差相乘。**$\\sigma_x \\sigma_y = ${sx} \\cdot ${sy} = ${sx * sy}$。\n\n**第二步：用协方差除以这个乘积。**${steps(`r = \\frac{\\operatorname{cov}(x, y)}{\\sigma_x \\sigma_y} = \\frac{${dec(cov)}}{${sx * sy}} = ${dec(r)}`)}**检验。**乘回去，$${dec(r)} \\cdot ${sx} \\cdot ${sy} = ${dec(cov)}$，正是协方差；而且 $r$ 在 $-1$ 与 $1$ 之间。`,
          ),
        });
      },
    },
    {
      id: "r-after-a-change-of-units",
      title: t("r after a change of units", "单位变换后的 r"),
      explanation: t(
        "If every $x$ is replaced by $ax + b$ and every $y$ by $cy + d$, each deviation is multiplied by $a$ or $c$, and the shifts $b$ and $d$ cancel out. In the formula for $r$ the sizes of $a$ and $c$ cancel too, leaving only their signs:\n\n$$r_{\\text{new}} = \\begin{cases} r & \\text{if } ac > 0, \\\\ -r & \\text{if } ac < 0. \\end{cases}$$\n\nConverting temperatures from Celsius to Fahrenheit ($F = 1.8C + 32$) does not change $r$; replacing $x$ by $-2x$ changes its sign.\n\nCheck: with $X = -2x$, the covariance is multiplied by $-2$ and $\\sigma_X = 2\\sigma_x$, so $r_{\\text{new}} = \\frac{-2\\operatorname{cov}(x, y)}{2\\sigma_x \\sigma_y} = -r$.\n\n> **Watch out.** Do not multiply $r$ by the scale factors: $r$ has no units, and it stays between $-1$ and $1$. Only the signs of $a$ and $c$ matter.",
        "若把每个 $x$ 换成 $ax + b$，每个 $y$ 换成 $cy + d$，那么每个偏差都乘以 $a$ 或 $c$，平移量 $b$ 和 $d$ 被抵消。在 $r$ 的公式中，$a$ 与 $c$ 的大小也会约去，只剩下它们的符号：\n\n$$r_{\\text{新}} = \\begin{cases} r & \\text{若 } ac > 0, \\\\ -r & \\text{若 } ac < 0. \\end{cases}$$\n\n把温度从摄氏度换成华氏度（$F = 1.8C + 32$）不改变 $r$；把 $x$ 换成 $-2x$ 会改变 $r$ 的符号。\n\n检验：取 $X = -2x$，协方差乘以 $-2$，而 $\\sigma_X = 2\\sigma_x$，所以 $r_{\\text{新}} = \\frac{-2\\operatorname{cov}(x, y)}{2\\sigma_x \\sigma_y} = -r$。\n\n> **注意。** 不要把 $r$ 乘以伸缩因子：$r$ 没有单位，并且始终在 $-1$ 与 $1$ 之间。只有 $a$ 与 $c$ 的符号有影响。",
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
        const acq = aq.mul(cq);
        const form = (k: Q, s: number, v: string) =>
          `${k.eq(Q.of(-1)) ? "-" : dec(k)}${v}${s === 0 ? "" : ` ${s < 0 ? "-" : "+"} ${Math.abs(s)}`}`;
        return numberProblem({
          prompt: t(
            `Paired data $(x, y)$ have correlation coefficient $r = ${dec(r)}$. New variables are defined by $X = ${form(aq, b, "x")}$ and $Y = ${form(cq, d, "y")}$. Find the correlation coefficient of $X$ and $Y$.`,
            `成对数据 $(x, y)$ 的相关系数为 $r = ${dec(r)}$。定义新变量 $X = ${form(aq, b, "x")}$，$Y = ${form(cq, d, "y")}$。求 $X$ 与 $Y$ 的相关系数。`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: [
            why(
              ans.neg(),
              ac > 0
                ? "This changes the sign, but the product of the scale factors is positive."
                : "This keeps the sign, but the product of the scale factors is negative.",
              ac > 0 ? "这改变了符号，但伸缩因子之积是正的。" : "这保留了符号，但伸缩因子之积是负的。",
            ),
            ...whyIf(
              rounded(r.toNumber() * ac, 4),
              "This multiplies $r$ by the scale factors; their sizes cancel and only their signs matter.",
              "这把 $r$ 乘以了伸缩因子；因子的大小会约去，只有符号有影响。",
            ),
          ],
          solution: t(
            `**Step 1: Drop the shifts.** The added constants move every value and its mean together, so the deviations, and $r$, do not change.\n\n**Step 2: Look at the signs of the scale factors.** $${dec(aq)} \\cdot ${paren(dec(cq))} = ${dec(acq)}$ is ${ac > 0 ? "positive, so $r$ is unchanged" : "negative, so $r$ changes sign"}: the new correlation coefficient is $${dec(ans)}$.\n\n**Check.** The covariance is multiplied by $${dec(acq)}$ and the standard deviations by $${dec(aq.abs())}$ and $${dec(cq.abs())}$:${steps(`r_{\\text{new}} = \\frac{${dec(acq)}}{${dec(aq.abs())} \\cdot ${dec(cq.abs())}} \\cdot ${paren(dec(r))} = ${ac > 0 ? "" : "-"}${paren(dec(r))} = ${dec(ans)}`)}`,
            `**第一步：去掉平移。**加上的常数让每个值和均值一起移动，所以偏差不变，$r$ 也不变。\n\n**第二步：看伸缩因子的符号。**$${dec(aq)} \\cdot ${paren(dec(cq))} = ${dec(acq)}$ 为${ac > 0 ? "正，所以 $r$ 不变" : "负，所以 $r$ 变号"}：新的相关系数是 $${dec(ans)}$。\n\n**检验。**协方差乘以 $${dec(acq)}$，两个标准差分别乘以 $${dec(aq.abs())}$ 和 $${dec(cq.abs())}$：${steps(`r_{\\text{新}} = \\frac{${dec(acq)}}{${dec(aq.abs())} \\cdot ${dec(cq.abs())}} \\cdot ${paren(dec(r))} = ${ac > 0 ? "" : "-"}${paren(dec(r))} = ${dec(ans)}`)}`,
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
  intro: t(
    "Among all lines through a scatter plot, one makes the squared residuals as small as possible: the least-squares regression line. For data with $\\bar{x} = 4$, $\\bar{y} = 10$, $S_{xx} = 20$ and $S_{xy} = 30$, its slope is $b = \\frac{30}{20} = 1.5$ and its intercept is $a = 10 - 1.5 \\cdot 4 = 4$, so $\\hat{y} = 4 + 1.5x$.\n\nCheck: the line passes through the point of means, since $4 + 1.5 \\cdot 4 = 10$.\n\nIn this lesson we find the slope and the intercept of this line from summary statistics, and use it to predict.",
    "在穿过散点图的所有直线中，有一条使残差平方和最小：最小二乘回归直线。对 $\\bar{x} = 4$，$\\bar{y} = 10$，$S_{xx} = 20$，$S_{xy} = 30$ 的数据，它的斜率为 $b = \\frac{30}{20} = 1.5$，截距为 $a = 10 - 1.5 \\cdot 4 = 4$，所以 $\\hat{y} = 4 + 1.5x$。\n\n检验：直线经过均值点，因为 $4 + 1.5 \\cdot 4 = 10$。\n\n本课我们由汇总统计量求这条直线的斜率和截距，并用它作预测。",
  ),
  knowledgePoints: [
    {
      id: "the-slope-of-the-regression-line",
      title: t("The slope of the regression line", "回归直线的斜率"),
      explanation: t(
        "The **least-squares regression line** $\\hat{y} = a + bx$ is the line that makes the sum of the squared residuals as small as possible. Its slope is\n\n$$b = \\frac{S_{xy}}{S_{xx}}.$$\n\nIf $S_{xy} = 36$ and $S_{xx} = 48$, then $b = \\frac{36}{48} = 0.75$: each extra unit of $x$ adds $0.75$ to the predicted $y$.\n\nCheck: $b \\cdot S_{xx} = 0.75 \\cdot 48 = 36 = S_{xy}$.\n\n> **Watch out.** Divide by $S_{xx}$, the sum of squares of $x$, not by $S_{yy}$, and keep $S_{xy}$ on top: the slope has the sign of $S_{xy}$.",
        "**最小二乘回归直线** $\\hat{y} = a + bx$ 是使残差平方和最小的直线。它的斜率为\n\n$$b = \\frac{S_{xy}}{S_{xx}}.$$\n\n若 $S_{xy} = 36$，$S_{xx} = 48$，则 $b = \\frac{36}{48} = 0.75$：$x$ 每增加一个单位，$y$ 的预测值增加 $0.75$。\n\n检验：$b \\cdot S_{xx} = 0.75 \\cdot 48 = 36 = S_{xy}$。\n\n> **注意。** 要除以 $x$ 的平方和 $S_{xx}$，不是 $S_{yy}$；$S_{xy}$ 在分子上：斜率与 $S_{xy}$ 同号。",
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
            mistakes: [
              why(
                sxy.div(Q.of(syy)),
                "This divides by $S_{yy}$; the slope of $y$ on $x$ divides by $S_{xx}$.",
                "这除以了 $S_{yy}$；$y$ 关于 $x$ 的斜率要除以 $S_{xx}$。",
              ),
              why(
                Q.of(sxx).div(sxy),
                "This is $\\frac{S_{xx}}{S_{xy}}$, the fraction upside down.",
                "这是 $\\frac{S_{xx}}{S_{xy}}$，分子分母颠倒了。",
              ),
              why(b.neg(), "This has the wrong sign: the slope has the sign of $S_{xy}$.", "符号错了：斜率与 $S_{xy}$ 同号。"),
            ],
            solution: t(
              `**Step 1: Pick the sums the slope needs.** The slope of $y$ on $x$ uses $S_{xy} = ${dec(sxy)}$ and $S_{xx} = ${sxx}$; $S_{yy}$ is not needed.\n\n**Step 2: Divide.**${steps(`b = \\frac{S_{xy}}{S_{xx}} = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}`)}**Check.** Multiplying back, $${paren(dec(b))} \\cdot ${sxx} = ${dec(sxy)} = S_{xy}$, and the slope has the sign of $S_{xy}$.`,
              `**第一步：选出斜率要用的和。**$y$ 关于 $x$ 的斜率用 $S_{xy} = ${dec(sxy)}$ 和 $S_{xx} = ${sxx}$；不需要 $S_{yy}$。\n\n**第二步：相除。**${steps(`b = \\frac{S_{xy}}{S_{xx}} = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}`)}**检验。**乘回去，$${paren(dec(b))} \\cdot ${sxx} = ${dec(sxy)} = S_{xy}$，并且斜率与 $S_{xy}$ 同号。`,
            ),
          });
        }
      },
    },
    {
      id: "the-intercept-of-the-regression-line",
      title: t("The intercept of the regression line", "回归直线的截距"),
      explanation: t(
        "The regression line always passes through the point of means $(\\bar{x}, \\bar{y})$. So $\\bar{y} = a + b\\bar{x}$, and the intercept is\n\n$$a = \\bar{y} - b\\bar{x}.$$\n\nIf $\\bar{x} = 6$, $\\bar{y} = 20$ and $b = 1.5$, then $a = 20 - 1.5 \\cdot 6 = 11$ and the line is $\\hat{y} = 11 + 1.5x$.\n\nCheck: at $x = 6$ the line gives $11 + 1.5 \\cdot 6 = 20 = \\bar{y}$.\n\n> **Watch out.** Subtract $b\\bar{x}$ from $\\bar{y}$, not the other way round, and multiply $b$ by $\\bar{x}$ before subtracting: $20 - 1.5$ is not the intercept.",
        "回归直线总是经过均值点 $(\\bar{x}, \\bar{y})$。所以 $\\bar{y} = a + b\\bar{x}$，截距为\n\n$$a = \\bar{y} - b\\bar{x}.$$\n\n若 $\\bar{x} = 6$，$\\bar{y} = 20$，$b = 1.5$，则 $a = 20 - 1.5 \\cdot 6 = 11$，回归直线为 $\\hat{y} = 11 + 1.5x$。\n\n检验：$x = 6$ 时直线给出 $11 + 1.5 \\cdot 6 = 20 = \\bar{y}$。\n\n> **注意。** 要用 $\\bar{y}$ 减去 $b\\bar{x}$，不能反过来；相减之前要先把 $b$ 乘以 $\\bar{x}$：$20 - 1.5$ 不是截距。",
      ),
      generate(rng) {
        const mx = Q.of(rng.int(10, 150), 10);
        const my = Q.of(rng.int(50, 900), 10);
        const b = Q.of(rng.nonZero(-50, 50), 10);
        const bx = b.mul(mx);
        const ans = my.sub(bx);
        return numberProblem({
          prompt: t(
            `The least-squares regression line of $y$ on $x$ has slope $b = ${dec(b)}$, and the data have means $\\bar{x} = ${dec(mx)}$ and $\\bar{y} = ${dec(my)}$. Find the intercept $a$ of the line $\\hat{y} = a + bx$.`,
            `$y$ 关于 $x$ 的最小二乘回归直线的斜率为 $b = ${dec(b)}$，数据的均值为 $\\bar{x} = ${dec(mx)}$，$\\bar{y} = ${dec(my)}$。求直线 $\\hat{y} = a + bx$ 的截距 $a$。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              my.add(bx),
              "This adds $b\\bar{x}$; since $\\bar{y} = a + b\\bar{x}$, the intercept is $\\bar{y} - b\\bar{x}$.",
              "这加上了 $b\\bar{x}$；由 $\\bar{y} = a + b\\bar{x}$，截距是 $\\bar{y} - b\\bar{x}$。",
            ),
            why(mx.sub(b.mul(my)), "This swaps $\\bar{x}$ and $\\bar{y}$.", "这把 $\\bar{x}$ 与 $\\bar{y}$ 弄反了。"),
            why(my.sub(b), "This subtracts the slope itself; multiply it by $\\bar{x}$ first.", "这直接减去了斜率；要先乘以 $\\bar{x}$。"),
          ],
          solution: t(
            `**Step 1: Use the point of means.** The line passes through $(\\bar{x}, \\bar{y})$, so $\\bar{y} = a + b\\bar{x}$ and $a = \\bar{y} - b\\bar{x}$.\n\n**Step 2: Substitute.**${steps(`b\\bar{x} = ${paren(dec(b))} \\cdot ${dec(mx)} = ${dec(bx)}`, `a = ${dec(my)} - ${paren(dec(bx))} = ${dec(ans)}`)}**Check.** At $x = \\bar{x}$ the line gives back $\\bar{y}$:${steps(`${dec(ans)} + ${paren(dec(b))} \\cdot ${dec(mx)} = ${dec(my)}`)}`,
            `**第一步：利用均值点。**直线经过 $(\\bar{x}, \\bar{y})$，所以 $\\bar{y} = a + b\\bar{x}$，$a = \\bar{y} - b\\bar{x}$。\n\n**第二步：代入。**${steps(`b\\bar{x} = ${paren(dec(b))} \\cdot ${dec(mx)} = ${dec(bx)}`, `a = ${dec(my)} - ${paren(dec(bx))} = ${dec(ans)}`)}**检验。**在 $x = \\bar{x}$ 处直线给出 $\\bar{y}$：${steps(`${dec(ans)} + ${paren(dec(b))} \\cdot ${dec(mx)} = ${dec(my)}`)}`,
          ),
        });
      },
    },
    {
      id: "predicting-with-the-regression-line",
      title: t("Predicting with the regression line", "用回归直线作预测"),
      explanation: t(
        "To predict from summary statistics, find the slope $b = \\frac{S_{xy}}{S_{xx}}$, then the intercept $a = \\bar{y} - b\\bar{x}$, and substitute the value of $x$ into $\\hat{y} = a + bx$.\n\nWith $n = 5$, $\\sum x = 30$, $\\sum y = 60$, $S_{xx} = 20$ and $S_{xy} = 50$: $b = 2.5$, $\\bar{x} = 6$, $\\bar{y} = 12$, $a = 12 - 15 = -3$, and at $x = 8$ the prediction is $\\hat{y} = -3 + 2.5 \\cdot 8 = 17$.\n\nCheck: $x = 8$ is $2$ above $\\bar{x}$, so the prediction is $2.5 \\cdot 2 = 5$ above $\\bar{y}$: $12 + 5 = 17$.\n\n> **Watch out.** The intercept is $a$, not $\\bar{y}$: $12 + 2.5 \\cdot 8$ is wrong. And remember the intercept: $2.5 \\cdot 8 = 20$ alone is not the prediction.",
        "要由汇总统计量作预测，先求斜率 $b = \\frac{S_{xy}}{S_{xx}}$，再求截距 $a = \\bar{y} - b\\bar{x}$，然后把 $x$ 的值代入 $\\hat{y} = a + bx$。\n\n若 $n = 5$，$\\sum x = 30$，$\\sum y = 60$，$S_{xx} = 20$，$S_{xy} = 50$：$b = 2.5$，$\\bar{x} = 6$，$\\bar{y} = 12$，$a = 12 - 15 = -3$，在 $x = 8$ 处的预测值为 $\\hat{y} = -3 + 2.5 \\cdot 8 = 17$。\n\n检验：$x = 8$ 比 $\\bar{x}$ 大 $2$，所以预测值比 $\\bar{y}$ 大 $2.5 \\cdot 2 = 5$：$12 + 5 = 17$。\n\n> **注意。** 截距是 $a$，不是 $\\bar{y}$：$12 + 2.5 \\cdot 8$ 是错的。也别漏掉截距：单独的 $2.5 \\cdot 8 = 20$ 不是预测值。",
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
        const shift = b.mul(Q.of(x0 - mx));
        const given = `n = ${n}, \\quad \\sum x = ${n * mx}, \\quad \\sum y = ${n * my}, \\quad S_{xx} = ${sxx}, \\quad S_{xy} = ${dec(sxy)}`;
        return numberProblem({
          prompt: t(
            `For a set of data pairs, $${given}$. Use the least-squares regression line of $y$ on $x$ to predict $y$ when $x = ${x0}$.`,
            `一组数对满足 $${given}$。用 $y$ 关于 $x$ 的最小二乘回归直线预测 $x = ${x0}$ 时 $y$ 的值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(b.mul(Q.of(x0)), "This is only $bx$; add the intercept $a$.", "这只是 $bx$；还要加上截距 $a$。"),
            why(
              Q.of(my).add(b.mul(Q.of(x0))),
              "This uses $\\bar{y}$ as the intercept; the intercept is $a = \\bar{y} - b\\bar{x}$.",
              "这把 $\\bar{y}$ 当成了截距；截距是 $a = \\bar{y} - b\\bar{x}$。",
            ),
            why(a.add(Q.of(x0)), "This adds $x$ without multiplying it by the slope.", "这直接加上了 $x$，没有乘以斜率。"),
          ],
          solution: t(
            `**Step 1: Find the slope and the means.**${steps(`b = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}, \\quad \\bar{x} = \\frac{${n * mx}}{${n}} = ${mx}, \\quad \\bar{y} = \\frac{${n * my}}{${n}} = ${my}`)}**Step 2: Find the intercept.**${steps(`a = ${my} - ${paren(dec(b))} \\cdot ${mx} = ${dec(a)}`)}**Step 3: Substitute $x = ${x0}$.**${steps(`\\hat{y} = ${dec(a)} + ${paren(dec(b))} \\cdot ${x0} = ${dec(ans)}`)}**Check.** Measure from the point of means: $x = ${x0}$ is $${x0 - mx}$ from $\\bar{x}$, so${steps(`\\hat{y} = \\bar{y} + b(x - \\bar{x}) = ${my} + ${paren(dec(b))} \\cdot ${paren(String(x0 - mx))} = ${my} + ${paren(dec(shift))} = ${dec(ans)}`)}`,
            `**第一步：求斜率和均值。**${steps(`b = \\frac{${dec(sxy)}}{${sxx}} = ${dec(b)}, \\quad \\bar{x} = \\frac{${n * mx}}{${n}} = ${mx}, \\quad \\bar{y} = \\frac{${n * my}}{${n}} = ${my}`)}**第二步：求截距。**${steps(`a = ${my} - ${paren(dec(b))} \\cdot ${mx} = ${dec(a)}`)}**第三步：代入 $x = ${x0}$。**${steps(`\\hat{y} = ${dec(a)} + ${paren(dec(b))} \\cdot ${x0} = ${dec(ans)}`)}**检验。**从均值点出发：$x = ${x0}$ 与 $\\bar{x}$ 相差 $${x0 - mx}$，所以${steps(`\\hat{y} = \\bar{y} + b(x - \\bar{x}) = ${my} + ${paren(dec(b))} \\cdot ${paren(String(x0 - mx))} = ${my} + ${paren(dec(shift))} = ${dec(ans)}`)}`,
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
  intro: t(
    "The height of a thrown ball rises and then falls, so no line fits it well. A quadratic regression might give $\\hat{y} = -5x^2 + 20x + 2$ for the height in meters after $x$ seconds; at $x = 1$ it predicts $-5 + 20 + 2 = 17$ meters.\n\nCheck: written as $x(-5x + 20) + 2$, at $x = 1$ this is $1 \\cdot 15 + 2 = 17$.\n\nIn this lesson we predict with quadratic models, compute their residuals, and find the maximum or minimum they predict.",
    "抛出的球先上升后下降，所以没有直线能很好地拟合它的高度。二次回归可能给出 $\\hat{y} = -5x^2 + 20x + 2$，表示 $x$ 秒后的高度（米）；在 $x = 1$ 处它预测 $-5 + 20 + 2 = 17$ 米。\n\n检验：写成 $x(-5x + 20) + 2$，在 $x = 1$ 处为 $1 \\cdot 15 + 2 = 17$。\n\n本课我们用二次模型作预测，计算它的残差，并求它预测的最大值或最小值。",
  ),
  knowledgePoints: [
    {
      id: "predicting-with-a-quadratic-model",
      figure: precalculusDrawings4["quadratic-regression#predicting-with-a-quadratic-model"],
      title: t("Predicting with a quadratic model", "用二次模型作预测"),
      explanation: t(
        "When a scatter plot rises and then falls (or falls and then rises), a **quadratic regression** fits a model $\\hat{y} = ax^2 + bx + c$ by least squares; technology finds the coefficients. To predict, substitute the value of $x$.\n\nWith $\\hat{y} = -0.5x^2 + 4x + 1$, at $x = 3$ the prediction is $-4.5 + 12 + 1 = 8.5$.\n\nCheck: written as $x(-0.5x + 4) + 1$, at $x = 3$ this is $3 \\cdot 2.5 + 1 = 8.5$.\n\n> **Watch out.** Square $x$ before multiplying by $a$: $-0.5 \\cdot 3^2 = -4.5$, not $-0.5 \\cdot 6$ or $-0.5 \\cdot 3$.",
        "当散点图先升后降（或先降后升）时，**二次回归**用最小二乘法拟合模型 $\\hat{y} = ax^2 + bx + c$，系数由计算工具求出。作预测时，把 $x$ 的值代入即可。\n\n对 $\\hat{y} = -0.5x^2 + 4x + 1$，在 $x = 3$ 处的预测值为 $-4.5 + 12 + 1 = 8.5$。\n\n检验：写成 $x(-0.5x + 4) + 1$，在 $x = 3$ 处为 $3 \\cdot 2.5 + 1 = 8.5$。\n\n> **注意。** 要先把 $x$ 平方再乘以 $a$：$-0.5 \\cdot 3^2 = -4.5$，不是 $-0.5 \\cdot 6$，也不是 $-0.5 \\cdot 3$。",
      ),
      generate(rng) {
        const sc = rng.pick(quadScenes);
        for (;;) {
          // A thrown ball follows a parabola that opens downward, and every scene predicts a positive value.
          const a = sc === quadScenes[0] ? Q.of(-rng.int(1, 20), 10) : Q.of(rng.nonZero(-20, 20), 10);
          const b = Q.of(rng.nonZero(-60, 60), 10);
          const c = Q.of(rng.int(0, 300), 10);
          const x = rng.int(2, 9);
          const X = Q.of(x);
          const ax2 = a.mul(X.mul(X));
          const bx = b.mul(X);
          const ans = ax2.add(bx).add(c);
          if (ans.sign() <= 0) continue;
          const inner = a.mul(X).add(b);
          return numberProblem({
            prompt: t(
              `A quadratic regression for ${sc[0]} ${sc[1]} gives $${quadLatex(a, b, c)}$. Predict $y$ when $x = ${x}$.`,
              `对${sc[3]}${sc[2]}作二次回归，得到 $${quadLatex(a, b, c)}$。预测 $x = ${x}$ 时 $y$ 的值。`,
            ),
            answer: ans,
            ...decimalForm(ans),
            mistakes: [
              why(
                a.mul(X).add(bx).add(c),
                `This multiplies $a$ by $x$ instead of by $x^2 = ${x * x}$.`,
                `这用 $a$ 乘以 $x$，而不是乘以 $x^2 = ${x * x}$。`,
              ),
              why(
                a
                  .mul(Q.of(2 * x))
                  .add(bx)
                  .add(c),
                `This takes $x^2$ as $2x = ${2 * x}$; it is $${x * x}$.`,
                `这把 $x^2$ 当成了 $2x = ${2 * x}$；它等于 $${x * x}$。`,
              ),
              why(ax2.sub(bx).add(c), "This has the wrong sign on the term $bx$.", "$bx$ 这一项的符号错了。"),
            ],
            solution: t(
              `**Step 1: Compute each term at $x = ${x}$.**${steps(`${dec(a)} \\cdot ${x}^2 = ${dec(ax2)}, \\quad ${paren(dec(b))} \\cdot ${x} = ${dec(bx)}`)}**Step 2: Add the terms and the constant.**${steps(`\\hat{y} = ${dec(ax2)} ${signed(bx)} ${signed(c)} = ${dec(ans)}`)}**Check.** Factoring out $x$:${steps(`${x}\\left(${dec(a)} \\cdot ${x} ${signed(b)}\\right) ${signed(c)} = ${x} \\cdot ${paren(dec(inner))} ${signed(c)} = ${dec(ans)}`)}`,
              `**第一步：求 $x = ${x}$ 时的每一项。**${steps(`${dec(a)} \\cdot ${x}^2 = ${dec(ax2)}, \\quad ${paren(dec(b))} \\cdot ${x} = ${dec(bx)}`)}**第二步：把各项与常数相加。**${steps(`\\hat{y} = ${dec(ax2)} ${signed(bx)} ${signed(c)} = ${dec(ans)}`)}**检验。**提出 $x$：${steps(`${x}\\left(${dec(a)} \\cdot ${x} ${signed(b)}\\right) ${signed(c)} = ${x} \\cdot ${paren(dec(inner))} ${signed(c)} = ${dec(ans)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "residuals-of-a-quadratic-model",
      title: t("Residuals of a quadratic model", "二次模型的残差"),
      explanation: t(
        "Residuals work the same way for any model: the residual of a data point is its actual value minus the value the model predicts, $e = y - \\hat{y}$.\n\nWith $\\hat{y} = 0.5x^2 - 2x + 6$, the data point $(4, 7.2)$ has $\\hat{y} = 8 - 8 + 6 = 6$ and residual $7.2 - 6 = 1.2$.\n\nCheck: adding the residual to the prediction gives back the data value, $6 + 1.2 = 7.2$.\n\n> **Watch out.** Subtract in the order actual minus predicted; a point above the curve has a positive residual.",
        "对任何模型，残差的算法都相同：数据点的残差等于实际值减去模型的预测值，$e = y - \\hat{y}$。\n\n对 $\\hat{y} = 0.5x^2 - 2x + 6$，数据点 $(4, 7.2)$ 的 $\\hat{y} = 8 - 8 + 6 = 6$，残差为 $7.2 - 6 = 1.2$。\n\n检验：预测值加上残差得回数据值，$6 + 1.2 = 7.2$。\n\n> **注意。** 相减的顺序是实际值减去预测值；在曲线上方的点残差为正。",
      ),
      generate(rng) {
        const a = Q.of(rng.nonZero(-10, 10), 10);
        const b = Q.of(rng.nonZero(-40, 40), 10);
        const c = Q.of(rng.int(20, 300), 10);
        const x = rng.int(1, 8);
        const X = Q.of(x);
        const ax2 = a.mul(X.mul(X));
        const bx = b.mul(X);
        const pred = ax2.add(bx).add(c);
        const e = Q.of(rng.nonZero(-30, 30), 10);
        const y = pred.add(e);
        return numberProblem({
          prompt: t(
            `A quadratic regression model for a data set is $${quadLatex(a, b, c)}$. Find the residual of the data point $(${x}, ${dec(y)})$.`,
            `某组数据的二次回归模型为 $${quadLatex(a, b, c)}$。求数据点 $(${x}, ${dec(y)})$ 的残差。`,
          ),
          answer: e,
          form: "decimal",
          mistakes: [
            why(
              e.neg(),
              "This is $\\hat{y} - y$; the residual is the actual value minus the predicted one.",
              "这是 $\\hat{y} - y$；残差是实际值减去预测值。",
            ),
            why(
              pred,
              "This is the predicted value $\\hat{y}$; subtract it from the actual value.",
              "这是预测值 $\\hat{y}$；还要用实际值减去它。",
            ),
            why(y, "This is the actual value $y$; subtract the prediction from it.", "这是实际值 $y$；还要减去预测值。"),
          ],
          solution: t(
            `**Step 1: Predict at $x = ${x}$.**${steps(`\\hat{y} = ${dec(a)} \\cdot ${x}^2 ${signed(b)} \\cdot ${x} ${signed(c)} = ${dec(ax2)} ${signed(bx)} ${signed(c)} = ${dec(pred)}`)}**Step 2: Subtract the prediction from the actual value.**${steps(`e = ${dec(y)} - ${paren(dec(pred))} = ${dec(e)}`)}**Check.** Adding the residual to the prediction gives back the data value: $${dec(pred)} + ${paren(dec(e))} = ${dec(y)}$.`,
            `**第一步：求 $x = ${x}$ 处的预测值。**${steps(`\\hat{y} = ${dec(a)} \\cdot ${x}^2 ${signed(b)} \\cdot ${x} ${signed(c)} = ${dec(ax2)} ${signed(bx)} ${signed(c)} = ${dec(pred)}`)}**第二步：用实际值减去预测值。**${steps(`e = ${dec(y)} - ${paren(dec(pred))} = ${dec(e)}`)}**检验。**预测值加上残差得回数据值：$${dec(pred)} + ${paren(dec(e))} = ${dec(y)}$。`,
          ),
        });
      },
    },
    {
      id: "the-extreme-value-of-a-quadratic-model",
      figure: precalculusDrawings4["quadratic-regression#the-extreme-value-of-a-quadratic-model"],
      title: t("The extreme value of a quadratic model", "二次模型的最值"),
      explanation: t(
        "The model $\\hat{y} = ax^2 + bx + c$ has its vertex at\n\n$$x = -\\frac{b}{2a}.$$\n\nIf $a < 0$ it predicts a maximum there, and if $a > 0$ a minimum. Substitute this $x$ to find the predicted extreme value.\n\nFor $\\hat{y} = -0.2x^2 + 2.4x + 3$: $x = -\\frac{2.4}{-0.4} = 6$ and the maximum is $-7.2 + 14.4 + 3 = 10.2$.\n\nCheck: the parabola is symmetric about its vertex, and indeed $x = 5$ and $x = 7$ give the same value, $-5 + 12 + 3 = 10$ and $-9.8 + 16.8 + 3 = 10$, both below $10.2$.\n\n> **Watch out.** Keep the minus sign and the $2$ in $-\\frac{b}{2a}$. The $x$ of the vertex is not the extreme value: substitute it to find $y$.",
        "模型 $\\hat{y} = ax^2 + bx + c$ 的顶点在\n\n$$x = -\\frac{b}{2a}.$$\n\n若 $a < 0$，模型在该处预测最大值；若 $a > 0$，则预测最小值。代入这个 $x$ 即可求出预测的最值。\n\n对 $\\hat{y} = -0.2x^2 + 2.4x + 3$：$x = -\\frac{2.4}{-0.4} = 6$，最大值为 $-7.2 + 14.4 + 3 = 10.2$。\n\n检验：抛物线关于顶点对称，$x = 5$ 与 $x = 7$ 确实给出相同的值，$-5 + 12 + 3 = 10$ 与 $-9.8 + 16.8 + 3 = 10$，都小于 $10.2$。\n\n> **注意。** $-\\frac{b}{2a}$ 中的负号和 $2$ 都不能丢。顶点的 $x$ 不是最值：要把它代入求 $y$。",
      ),
      generate(rng) {
        const sc = rng.pick(quadScenes);
        const max = sc !== quadScenes[3] || rng.bool();
        for (;;) {
          const a = Q.of((max ? -1 : 1) * rng.int(1, 9), 10);
          const h = rng.int(2, 12);
          const b = a.mul(Q.of(-2 * h));
          const c = Q.of(rng.int(0, 200), 10);
          const H = Q.of(h);
          const top = a.mul(H.mul(H)).add(b.mul(H)).add(c);
          // A predicted minimum of fuel economy must still be positive.
          if (top.sign() <= 0) continue;
          const askX = rng.bool();
          const word = max ? ["maximum", "最大值"] : ["minimum", "最小值"];
          const near = top.add(a);
          const nearLine = (k: number) => `\\hat{y}(${k}) = ${dec(a)} \\cdot ${k}^2 ${signed(b)} \\cdot ${k} ${signed(c)} = ${dec(near)}`;
          const vertexLine = steps(`x = -\\frac{${dec(b)}}{2 \\cdot ${paren(dec(a))}} = -\\frac{${dec(b)}}{${dec(a.mul(Q.of(2)))}} = ${h}`);
          const topLine = steps(`\\hat{y} = ${dec(a)} \\cdot ${h}^2 ${signed(b)} \\cdot ${h} ${signed(c)} = ${dec(top)}`);
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
            mistakes: askX
              ? [
                  why(H.neg(), "This drops the minus sign in $-\\frac{b}{2a}$.", "这丢掉了 $-\\frac{b}{2a}$ 中的负号。"),
                  why(Q.of(2 * h), "This divides by $a$ instead of $2a$.", "这除以的是 $a$，而不是 $2a$。"),
                  why(
                    b.div(a),
                    "This is $\\frac{b}{a}$: both the minus sign and the $2$ are missing.",
                    "这是 $\\frac{b}{a}$：负号和 $2$ 都丢了。",
                  ),
                ]
              : [
                  why(
                    H,
                    `This is the $x$ of the vertex; substitute it into the model to find the ${word[0]} of $y$.`,
                    `这是顶点的 $x$；要把它代入模型求 $y$ 的${word[1]}。`,
                  ),
                  why(
                    c,
                    "This is the value at $x = 0$, the constant term, not at the vertex.",
                    "这是 $x = 0$ 处的值，即常数项，不是顶点处的值。",
                  ),
                  why(c.add(a.mul(H.mul(H))), "This leaves out the term $bx$.", "这漏掉了 $bx$ 这一项。"),
                ],
            solution: askX
              ? t(
                  `**Step 1: Read the coefficients.** $a = ${dec(a)}$ and $b = ${dec(b)}$; since $a ${max ? "<" : ">"} 0$, the vertex is a ${word[0]}.\n\n**Step 2: Find the $x$ of the vertex.**${vertexLine}**Check.** By symmetry, points one unit on either side of the vertex give the same value:${steps(nearLine(h - 1), nearLine(h + 1))}`,
                  `**第一步：读出系数。**$a = ${dec(a)}$，$b = ${dec(b)}$；因为 $a ${max ? "<" : ">"} 0$，顶点处是${word[1]}。\n\n**第二步：求顶点的 $x$。**${vertexLine}**检验。**由对称性，顶点两侧各一个单位的点给出相同的值：${steps(nearLine(h - 1), nearLine(h + 1))}`,
                )
              : t(
                  `**Step 1: Find the vertex.** Since $a = ${dec(a)} ${max ? "<" : ">"} 0$, the vertex is a ${word[0]}, at${vertexLine}**Step 2: Substitute it into the model.**${topLine}**Check.** One unit on either side of the vertex the model gives $${dec(near)}$ at both $x = ${h - 1}$ and $x = ${h + 1}$, ${max ? "less" : "more"} than $${dec(top)}$, as a ${word[0]} requires.`,
                  `**第一步：求顶点。**因为 $a = ${dec(a)} ${max ? "<" : ">"} 0$，顶点处是${word[1]}，位于${vertexLine}**第二步：代入模型。**${topLine}**检验。**在顶点两侧各一个单位处，即 $x = ${h - 1}$ 与 $x = ${h + 1}$，模型都给出 $${dec(near)}$，${max ? "小于" : "大于"} $${dec(top)}$，符合${word[1]}的要求。`,
                ),
          });
        }
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
  intro: t(
    "The values $y = 10, 100, 1000, 10000$ at $x = 0, 1, 2, 3$ shoot upward on an ordinary plot. Their logarithms, $\\log y = 1, 2, 3, 4$, go up by $1$ at each step, so plotting $\\log y$ against $x$ puts the points on a straight line.\n\nCheck: each $y$ is $10$ times the one before, and $\\log 10 = 1$ is the constant step.\n\nIn this lesson we transform data points to a semi-log plot, read an exponential model from a straight semi-log line, and recognize which data straighten.",
    "$x = 0, 1, 2, 3$ 处的数据 $y = 10, 100, 1000, 10000$ 在普通的图上急剧上升。它们的对数 $\\log y = 1, 2, 3, 4$ 每一步都增加 $1$，所以画 $\\log y$ 关于 $x$ 的图，各点就在一条直线上。\n\n检验：每个 $y$ 都是前一个的 $10$ 倍，而 $\\log 10 = 1$ 正是这个固定的步长。\n\n本课我们把数据点变换到半对数图上，由半对数直线读出指数模型，并识别哪些数据会变成直线。",
  ),
  knowledgePoints: [
    {
      id: "transforming-data-points",
      figure: precalculusDrawings4["semi-log-scatter-plots#transforming-data-points"],
      title: t("Transforming data points", "变换数据点"),
      explanation: t(
        "A **semi-log scatter plot** keeps $x$ but plots $\\log y$ (the common logarithm) on the vertical axis: the data point $(x, y)$ becomes $(x, \\log y)$.\n\nWith the product rule, $\\log(d \\times 10^k) = \\log d + k$. Using $\\log 3 \\approx 0.477$, the point $(2, 3000)$ becomes $(2, \\log 3000) \\approx (2, 3.477)$.\n\nCheck: $10^{3.477} = 10^{0.477} \\cdot 10^3 \\approx 3 \\cdot 1000 = 3000$.\n\n> **Watch out.** Add the power of ten to $\\log d$; do not multiply. For a small value such as $0.03 = 3 \\times 10^{-2}$ the power is negative: $\\log 0.03 \\approx 0.477 - 2 = -1.523$.",
        "**半对数散点图**保留 $x$，而在纵轴上画 $\\log y$（常用对数）：数据点 $(x, y)$ 变为 $(x, \\log y)$。\n\n由积的对数法则，$\\log(d \\times 10^k) = \\log d + k$。利用 $\\log 3 \\approx 0.477$，点 $(2, 3000)$ 变为 $(2, \\log 3000) \\approx (2, 3.477)$。\n\n检验：$10^{3.477} = 10^{0.477} \\cdot 10^3 \\approx 3 \\cdot 1000 = 3000$。\n\n> **注意。** 要把十的幂次加到 $\\log d$ 上，不是相乘。对 $0.03 = 3 \\times 10^{-2}$ 这样的小数，幂次是负的：$\\log 0.03 \\approx 0.477 - 2 = -1.523$。",
      ),
      generate(rng) {
        const d = rng.int(1, 9);
        const k = rng.int(-2, 5);
        const x = rng.int(0, 12);
        const y = d === 1 ? pow10(k) : dec(Q.of(d).mul(k >= 0 ? Q.of(10 ** k) : Q.of(1, 10 ** -k)));
        const ld = d === 1 ? 0 : LOG_DIGITS[d]!;
        const ans = Q.of(ld + 1000 * k, 1000);
        const lq = dec(Q.of(ld, 1000));
        const hint = d === 1 ? "" : ` Use $\\log ${d} \\approx ${lq}$.`;
        const hintZ = d === 1 ? "" : `利用 $\\log ${d} \\approx ${lq}$。`;
        return numberProblem({
          prompt: t(
            `On a semi-log scatter plot of $\\log y$ against $x$, the data point $(${x}, ${y})$ is plotted at $(${x}, Y)$. Find $Y$.${hint}`,
            `在 $\\log y$ 关于 $x$ 的半对数散点图上，数据点 $(${x}, ${y})$ 画在 $(${x}, Y)$ 处。求 $Y$。${hintZ}`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              Q.of(ld * k, 1000),
              d === 1
                ? `This multiplies $\\log 1 = 0$ by $${k}$; $\\log 10^{${k}}$ is $${k}$ itself.`
                : `This multiplies $\\log ${d}$ by $${k}$; the log of a product is a sum, $\\log ${d} + ${paren(String(k))}$.`,
              d === 1
                ? `这用 $\\log 1 = 0$ 乘以了 $${k}$；$\\log 10^{${k}}$ 就是 $${k}$。`
                : `这用 $\\log ${d}$ 乘以了 $${k}$；积的对数是和，即 $\\log ${d} + ${paren(String(k))}$。`,
            ),
            why(
              Q.of(ld + 1000 * (k + 1), 1000),
              `This uses the power $10^{${k + 1}}$; $${y}$ is ${d === 1 ? "" : `$${d}$ times `}$10^{${k}}$.`,
              `这用了幂次 $10^{${k + 1}}$；$${y}$ 等于 ${d === 1 ? "" : `$${d}$ 乘以 `}$10^{${k}}$。`,
            ),
            why(Q.of(ld - 1000 * k, 1000), `This subtracts the power $${k}$ instead of adding it.`, `这减去了幂次 $${k}$，而不是加上。`),
          ],
          solution:
            d === 1
              ? t(
                  `**Step 1: Write $y$ as a power of ten.** $${y} = 10^{${k}}$.\n\n**Step 2: Take the logarithm.** A semi-log plot keeps $x$ and replaces $y$ by $\\log y$, so $Y = \\log 10^{${k}} = ${k}$.\n\n**Check.** Going back, $10^{Y} = 10^{${k}} = ${y}$.`,
                  `**第一步：把 $y$ 写成十的幂。**$${y} = 10^{${k}}$。\n\n**第二步：取对数。**半对数图保持 $x$ 不变，把 $y$ 换成 $\\log y$，所以 $Y = \\log 10^{${k}} = ${k}$。\n\n**检验。**反过来，$10^{Y} = 10^{${k}} = ${y}$。`,
                )
              : t(
                  `**Step 1: Write $y$ as a digit times a power of ten.** $${y} = ${d} \\cdot 10^{${k}}$.\n\n**Step 2: Take the logarithm.** A semi-log plot keeps $x$ and replaces $y$ by $\\log y$; the log of a product is the sum of the logs:${steps(`Y = \\log ${d} + ${paren(String(k))} \\approx ${lq} + ${paren(String(k))} = ${dec(ans)}`)}**Check.** Going back, $10^{${dec(ans)}} = 10^{${lq}} \\cdot 10^{${k}} \\approx ${d} \\cdot 10^{${k}} = ${y}$.`,
                  `**第一步：把 $y$ 写成一位数乘以十的幂。**$${y} = ${d} \\cdot 10^{${k}}$。\n\n**第二步：取对数。**半对数图保持 $x$ 不变，把 $y$ 换成 $\\log y$；积的对数等于对数之和：${steps(`Y = \\log ${d} + ${paren(String(k))} \\approx ${lq} + ${paren(String(k))} = ${dec(ans)}`)}**检验。**反过来，$10^{${dec(ans)}} = 10^{${lq}} \\cdot 10^{${k}} \\approx ${d} \\cdot 10^{${k}} = ${y}$。`,
                ),
        });
      },
    },
    {
      id: "exponential-models-from-semi-log-lines",
      title: t("Exponential models from semi-log lines", "由半对数直线得指数模型"),
      explanation: t(
        "If $y = a \\cdot b^x$, then $\\log y = \\log a + x \\log b$: on a semi-log plot the points lie on a straight line with intercept $\\log a$ and slope $\\log b$. Conversely, if $\\log y = c + mx$, then\n\n$$y = 10^{c} \\cdot \\left(10^{m}\\right)^{x},$$\n\nso $a = 10^c$ and $y$ is multiplied by $10^{m}$ each time $x$ increases by $1$.\n\nIf $\\log y = 2 + 0.5x$, then $a = 10^2 = 100$, and when $x$ increases by $4$, $y$ is multiplied by $10^{0.5 \\cdot 4} = 100$.\n\nCheck: at $x = 0$, $y = 10^2 = 100$, and at $x = 4$, $y = 10^{2 + 2} = 10000$, which is $100$ times as much.\n\n> **Watch out.** The intercept and the slope of the line are logarithms: $a$ is $10^2 = 100$, not $2$, and the factor is $10^{2} = 100$, not the increase $2$ in $\\log y$.",
        "若 $y = a \\cdot b^x$，则 $\\log y = \\log a + x \\log b$：在半对数图上，各点位于一条截距为 $\\log a$、斜率为 $\\log b$ 的直线上。反过来，若 $\\log y = c + mx$，则\n\n$$y = 10^{c} \\cdot \\left(10^{m}\\right)^{x},$$\n\n所以 $a = 10^c$，并且 $x$ 每增加 $1$，$y$ 就乘以 $10^{m}$。\n\n若 $\\log y = 2 + 0.5x$，则 $a = 10^2 = 100$；当 $x$ 增加 $4$ 时，$y$ 乘以 $10^{0.5 \\cdot 4} = 100$。\n\n检验：$x = 0$ 时 $y = 10^2 = 100$，$x = 4$ 时 $y = 10^{2 + 2} = 10000$，正好是 $100$ 倍。\n\n> **注意。** 直线的截距和斜率都是对数：$a$ 是 $10^2 = 100$，不是 $2$；因子是 $10^{2} = 100$，不是 $\\log y$ 的增量 $2$。",
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
            mistakes: [
              why(Q.of(c), `This is $\\log a$, the intercept; $a = 10^{${c}}$.`, `这是截距 $\\log a$；$a = 10^{${c}}$。`),
              why(
                Q.parse(pow10(c + 1)),
                `This is $10^{${c + 1}}$; the exponent is the intercept, $${c}$.`,
                `这是 $10^{${c + 1}}$；指数应是截距 $${c}$。`,
              ),
              why(
                Q.of(c * 10),
                `This multiplies $10$ by $${c}$ instead of raising $10$ to the power $${c}$.`,
                `这用 $10$ 乘以 $${c}$，而不是求 $10$ 的 $${c}$ 次幂。`,
              ),
            ],
            solution: t(
              `**Step 1: Match the line with $\\log y = \\log a + x \\log b$.** The intercept is $\\log a = ${c}$.\n\n**Step 2: Undo the logarithm.** $a = 10^{${c}} = ${a}$.\n\n**Check.** At $x = 0$ the model gives $y = a \\cdot b^0 = a$, and the line gives $\\log y = ${c}$, so $y = 10^{${c}} = ${a}$ there.`,
              `**第一步：把直线与 $\\log y = \\log a + x \\log b$ 对照。**截距为 $\\log a = ${c}$。\n\n**第二步：去掉对数。**$a = 10^{${c}} = ${a}$。\n\n**检验。**$x = 0$ 时模型给出 $y = a \\cdot b^0 = a$，而直线给出 $\\log y = ${c}$，所以那里 $y = 10^{${c}} = ${a}$。`,
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
          mistakes: [
            why(Q.of(e), `This is the change in $\\log y$; the factor is $10^{${e}}$.`, `这是 $\\log y$ 的变化量；因子是 $10^{${e}}$。`),
            why(
              mq.mul(Q.of(step)).add(Q.of(c)),
              `This is $\\log y$ at $x = ${step}$, not the factor by which $y$ changes.`,
              `这是 $x = ${step}$ 处的 $\\log y$，不是 $y$ 变化的倍数。`,
            ),
            why(
              Q.parse(pow10(e + c)),
              `This is $y$ itself at $x = ${step}$; the factor leaves out the intercept $${c}$.`,
              `这是 $x = ${step}$ 处的 $y$ 本身；倍数不包括截距 $${c}$。`,
            ),
          ],
          solution: t(
            `**Step 1: Find the change in $\\log y$.** The slope is $${dec(mq)}$, so when $x$ increases by $${step}$, $\\log y$ changes by $${dec(mq)} \\cdot ${step} = ${e}$.\n\n**Step 2: Undo the logarithm.** Adding $${e}$ to $\\log y$ multiplies $y$ by $10^{${e}} = ${dec(ans)}$.\n\n**Check.** Compare two values: at $x = 0$, $y = 10^{${c}} = ${pow10(c)}$, and at $x = ${step}$, $y = 10^{${c + e}} = ${pow10(c + e)}$. Their ratio is $${dec(ans)}$.`,
            `**第一步：求 $\\log y$ 的变化量。**斜率为 $${dec(mq)}$，所以 $x$ 增加 $${step}$ 时，$\\log y$ 变化 $${dec(mq)} \\cdot ${step} = ${e}$。\n\n**第二步：去掉对数。**$\\log y$ 加上 $${e}$，$y$ 就乘以 $10^{${e}} = ${dec(ans)}$。\n\n**检验。**比较两个值：$x = 0$ 时 $y = 10^{${c}} = ${pow10(c)}$，$x = ${step}$ 时 $y = 10^{${c + e}} = ${pow10(c + e)}$。两者之比为 $${dec(ans)}$。`,
          ),
        });
      },
    },
    {
      id: "data-that-straighten-on-a-semi-log-plot",
      title: t("Data that straighten on a semi-log plot", "在半对数图上成直线的数据"),
      explanation: t(
        "On a semi-log plot equal steps in $x$ give equal steps in $\\log y$ exactly when $y$ is multiplied by the same factor at each step. So exponential data, with a constant ratio between consecutive $y$-values, lie on a straight line; linear data (constant differences) and quadratic data do not.\n\nFor $x = 0, 1, 2, 3$, the values $y = 5, 15, 45, 135$ (ratio $3$) give a straight semi-log plot; $y = 5, 15, 25, 35$ do not.\n\nCheck: $\\log 5 \\approx 0.699$, $\\log 15 \\approx 1.176$, $\\log 45 \\approx 1.653$ and $\\log 135 \\approx 2.130$ go up by $0.477 \\approx \\log 3$ each time; for $5, 15, 25, 35$ the steps are $0.477$, $0.222$ and $0.146$.\n\n> **Watch out.** Look at ratios, not differences: data that go up by the same amount each step lie on a line on an ordinary plot, but bend on a semi-log plot.",
        "在半对数图上，当且仅当每一步 $y$ 都乘以同一个因子时，$x$ 的等步长才对应 $\\log y$ 的等步长。所以指数型数据（相邻 $y$ 值之比为常数）位于一条直线上；线性数据（差为常数）和二次数据则不然。\n\n对 $x = 0, 1, 2, 3$，数据 $y = 5, 15, 45, 135$（比为 $3$）的半对数图是直线；$y = 5, 15, 25, 35$ 则不是。\n\n检验：$\\log 5 \\approx 0.699$，$\\log 15 \\approx 1.176$，$\\log 45 \\approx 1.653$，$\\log 135 \\approx 2.130$，每次增加 $0.477 \\approx \\log 3$；而 $5, 15, 25, 35$ 的步长为 $0.477$、$0.222$ 和 $0.146$。\n\n> **注意。** 要看比，而不是差：每一步增加相同数量的数据，在普通图上成直线，在半对数图上却是弯的。",
      ),
      figure: semiLogFigure,
      generate(rng) {
        const a = rng.int(1, 6);
        const r = rng.pick([2, 3, 4, 5]);
        const expo = range(0, 3).map((x) => a * r ** x);
        let d = rng.int(2, 9);
        // With a + d = a·r the mixed set would repeat the linear one.
        while (a + d === a * r) d = rng.int(2, 9);
        const lin = range(0, 3).map((x) => a + d * x);
        const q = rng.int(1, 4);
        const quad = range(0, 3).map((x) => a + q * x * x);
        const mixed = [a, a * r, a * r + d, a * r + 2 * d];
        const sets = rng.shuffle([expo, lin, quad, mixed]);
        const labels = ["A", "B", "C", "D"];
        const right = sets.indexOf(expo);
        const tab = table(["$x$", "$0$", "$1$", "$2$", "$3$"], ...sets.map((s, i) => [`$y_{${labels[i]}}$`, ...m(s)]));
        const name = (s: readonly number[]) => `$y_{${labels[sets.indexOf(s as number[])]}}$`;
        const ratios = (s: readonly number[]) => `\\frac{${s[1]}}{${s[0]}}, \\frac{${s[2]}}{${s[1]}}, \\frac{${s[3]}}{${s[2]}}`;
        const problem = choiceProblem({
          prompt: t(
            `Which data set lies on a straight line on a semi-log plot of $\\log y$ against $x$?\n\n${tab}`,
            `在 $\\log y$ 关于 $x$ 的半对数图上，哪一组数据位于一条直线上？\n\n${tab}`,
          ),
          options: labels.map((l) => t(`$y_{${l}}$`, `$y_{${l}}$`)),
          correct: right,
          solution: t(
            `**Step 1: Compare consecutive ratios.** A straight semi-log plot needs the same ratio at every step. In ${name(expo)} the ratios are $${ratios(expo)}$, all equal to $${r}$.\n\n**Step 2: Rule out the others.** ${name(lin)} goes up by the same amount, $${d}$, each step, ${name(quad)} goes up by more each step, and ${name(mixed)} first multiplies by $${r}$ and then adds $${d}$; none has a constant ratio.\n\n**Check.** For ${name(expo)}, $\\log y = \\log ${a} + x \\log ${r}$, which goes up by $\\log ${r}$ for each unit of $x$: a straight line.`,
            `**第一步：比较相邻值之比。**半对数图是直线，要求每一步的比都相同。${name(expo)} 的比为 $${ratios(expo)}$，都等于 $${r}$。\n\n**第二步：排除其他各组。**${name(lin)} 每一步增加同样的 $${d}$，${name(quad)} 每一步增加得越来越多，${name(mixed)} 先乘以 $${r}$ 再加 $${d}$；它们的比都不是常数。\n\n**检验。**对 ${name(expo)}，$\\log y = \\log ${a} + x \\log ${r}$，$x$ 每增加一个单位就增加 $\\log ${r}$：是一条直线。`,
          ),
        });
        return reasoned(problem, [
          [
            name(lin),
            `These values go up by $${d}$ each step: constant differences, which bend on a semi-log plot.`,
            `这组值每一步增加 $${d}$：差为常数，在半对数图上是弯的。`,
          ],
          [
            name(quad),
            `These values go up by $${q}$, $${3 * q}$, $${5 * q}$: a quadratic pattern, with ratios $${ratios(quad)}$ that are not equal.`,
            `这组值依次增加 $${q}$、$${3 * q}$、$${5 * q}$：是二次规律，比 $${ratios(quad)}$ 不相等。`,
          ],
          [
            name(mixed),
            `These values are multiplied by $${r}$ once, then go up by $${d}$ each step, so the ratio does not stay the same.`,
            `这组值先乘以 $${r}$，之后每一步增加 $${d}$，所以比不是常数。`,
          ],
        ]);
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
  intro: t(
    "A town of $2000$ people that grows by about $10\\%$ a year is modeled by $\\hat{y} = 2000 \\cdot 1.1^x$ after $x$ years. After $2$ years the model predicts $2000 \\cdot 1.21 = 2420$ people.\n\nCheck: growing by $10\\%$ twice, $2000 \\to 2200 \\to 2420$.\n\nIn this lesson we predict with exponential models, read their percent rate of change, and turn a straight-line fit of $\\ln y$ into an exponential model.",
    "一个 $2000$ 人的城镇每年大约增长 $10\\%$，$x$ 年后的人口可用 $\\hat{y} = 2000 \\cdot 1.1^x$ 来建模。$2$ 年后模型预测人口为 $2000 \\cdot 1.21 = 2420$。\n\n检验：连续两次增长 $10\\%$，$2000 \\to 2200 \\to 2420$。\n\n本课我们用指数模型作预测，读出它的百分变化率，并把 $\\ln y$ 的直线拟合化为指数模型。",
  ),
  knowledgePoints: [
    {
      id: "predicting-with-an-exponential-model",
      title: t("Predicting with an exponential model", "用指数模型作预测"),
      explanation: t(
        "An **exponential regression** fits $\\hat{y} = a \\cdot b^x$ to data that grow or decay by a roughly constant factor; technology does it by fitting a line to $(x, \\log y)$. To predict, substitute $x$.\n\nWith $\\hat{y} = 40 \\cdot 1.5^x$, at $x = 2$ the prediction is $40 \\cdot 2.25 = 90$.\n\nCheck: multiplying by $1.5$ twice, $40 \\to 60 \\to 90$.\n\n> **Watch out.** Only $b$ is raised to the power $x$: $40 \\cdot 1.5^2$ is not $(40 \\cdot 1.5)^2 = 3600$, and it is not $40 \\cdot 1.5 \\cdot 2 = 120$.",
        "**指数回归**对大致按固定倍数增长或衰减的数据拟合 $\\hat{y} = a \\cdot b^x$；计算工具的做法是对 $(x, \\log y)$ 拟合直线。作预测时代入 $x$ 即可。\n\n对 $\\hat{y} = 40 \\cdot 1.5^x$，在 $x = 2$ 处的预测值为 $40 \\cdot 2.25 = 90$。\n\n检验：连续两次乘以 $1.5$，$40 \\to 60 \\to 90$。\n\n> **注意。** 只有 $b$ 取 $x$ 次幂：$40 \\cdot 1.5^2$ 不是 $(40 \\cdot 1.5)^2 = 3600$，也不是 $40 \\cdot 1.5 \\cdot 2 = 120$。",
      ),
      generate(rng) {
        const a = rng.int(2, 60) * 5;
        const b = Q.of(rng.pick(GROWTH_FACTORS), 100);
        const x = rng.int(1, 3);
        const ans = Q.of(a).mul(b.pow(x));
        const chain = Array.from({ length: x + 1 }, (_, i) => dec(Q.of(a).mul(b.pow(i)))).join(" \\to ");
        return numberProblem({
          prompt: t(
            `An exponential regression for a data set gives $\\hat{y} = ${a} \\cdot ${dec(b)}^x$. Predict $y$ when $x = ${x}$.`,
            `对某组数据作指数回归，得到 $\\hat{y} = ${a} \\cdot ${dec(b)}^x$。预测 $x = ${x}$ 时 $y$ 的值。`,
          ),
          answer: ans,
          ...decimalForm(ans),
          mistakes: [
            why(
              Q.of(a).mul(b).mul(Q.of(x)),
              `This multiplies by $${dec(b)}$ and by $${x}$; the exponent means multiplying by $${dec(b)}$ ${x} times.`,
              `这乘以了 $${dec(b)}$ 和 $${x}$；指数表示乘以 $${dec(b)}$ 共 ${x} 次。`,
            ),
            why(
              Q.of(a).mul(b).pow(x),
              `This raises $${a} \\cdot ${dec(b)}$ to the power; only $${dec(b)}$ is raised to the power $x$.`,
              `这把 $${a} \\cdot ${dec(b)}$ 整个取了幂；只有 $${dec(b)}$ 取 $x$ 次幂。`,
            ),
            why(
              Q.of(a).add(b.pow(x)),
              `This adds $${dec(b)}^{${x}}$ to $${a}$ instead of multiplying.`,
              `这把 $${dec(b)}^{${x}}$ 加到了 $${a}$ 上，而不是相乘。`,
            ),
          ],
          solution: t(
            `**Step 1: Raise the factor to the power.** $${dec(b)}^{${x}} = ${dec(b.pow(x))}$.\n\n**Step 2: Multiply by the initial value.**${steps(`\\hat{y} = ${a} \\cdot ${dec(b.pow(x))} = ${dec(ans)}`)}**Check.** Multiplying by $${dec(b)}$ once for each unit of $x$: $${chain}$.`,
            `**第一步：求因子的幂。**$${dec(b)}^{${x}} = ${dec(b.pow(x))}$。\n\n**第二步：乘以初始值。**${steps(`\\hat{y} = ${a} \\cdot ${dec(b.pow(x))} = ${dec(ans)}`)}**检验。**$x$ 每增加一个单位乘一次 $${dec(b)}$：$${chain}$。`,
          ),
        });
      },
    },
    {
      id: "the-percent-rate-of-an-exponential-model",
      title: t("The percent rate of change", "百分变化率"),
      explanation: t(
        "In $\\hat{y} = a \\cdot b^x$, the value is multiplied by $b$ each time $x$ increases by $1$. If $b > 1$ it grows by $(b - 1) \\times 100\\%$; if $b < 1$ it decays by $(1 - b) \\times 100\\%$. The value $a$ is the prediction at $x = 0$.\n\nWith $\\hat{y} = 250 \\cdot 0.92^x$, the predicted value starts at $250$ and decreases by $8\\%$ per unit of $x$.\n\nCheck: one unit later the prediction is $250 \\cdot 0.92 = 230$, a drop of $20$, and $\\frac{20}{250} = 8\\%$.\n\n> **Watch out.** The rate is the distance of $b$ from $1$: $b = 0.92$ is a decrease of $8\\%$, not of $92\\%$.",
        "在 $\\hat{y} = a \\cdot b^x$ 中，$x$ 每增加 $1$，值就乘以 $b$。若 $b > 1$，则增长 $(b - 1) \\times 100\\%$；若 $b < 1$，则衰减 $(1 - b) \\times 100\\%$。$a$ 是 $x = 0$ 时的预测值。\n\n对 $\\hat{y} = 250 \\cdot 0.92^x$，预测值从 $250$ 开始，$x$ 每增加一个单位就减少 $8\\%$。\n\n检验：一个单位之后的预测值为 $250 \\cdot 0.92 = 230$，减少了 $20$，而 $\\frac{20}{250} = 8\\%$。\n\n> **注意。** 变化率是 $b$ 与 $1$ 的差：$b = 0.92$ 表示减少 $8\\%$，不是减少 $92\\%$。",
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
        const unit = what[1].replace(/s$/, "");
        const next = Q.of(a).mul(b);
        const change = next.sub(Q.of(a)).abs();
        return numberProblem({
          prompt: t(
            `An exponential regression models ${what[0]} after $x$ ${what[1]} by $\\hat{y} = ${a} \\cdot ${dec(b)}^x$. By what percent does the model say the value ${grow ? "increases" : "decreases"} each ${unit}?`,
            `对 $x$ ${what[3]}后${what[2]}作指数回归，得到 $\\hat{y} = ${a} \\cdot ${dec(b)}^x$。按照模型，这个值每${what[3]}${grow ? "增加" : "减少"}百分之几？`,
          ),
          answer: ans,
          percent: true,
          mistakes: [
            why(
              Q.of(bh),
              `This is $b$ written as a percent: each ${unit} the value becomes $${bh}\\%$ of itself, a change of $${ans.toLatex()}\\%$.`,
              `这是把 $b$ 写成了百分数：每${what[3]}这个值变为自身的 $${bh}\\%$，变化了 $${ans.toLatex()}\\%$。`,
            ),
            ...(grow
              ? [
                  why(
                    Q.of(100 - Math.abs(bh - 100)),
                    `This is $100\\%$ minus the rate; the increase is $${dec(b)} - 1$.`,
                    `这是 $100\\%$ 减去变化率；增长率是 $${dec(b)} - 1$。`,
                  ),
                ]
              : []),
          ],
          solution: t(
            `**Step 1: Read the factor.** Each ${unit} the value is multiplied by $b = ${dec(b)}$, which is ${grow ? "more" : "less"} than $1$, so it ${grow ? "increases" : "decreases"}.\n\n**Step 2: Find the distance from $1$.** ${grow ? `$${dec(b)} - 1 = ${dec(b.sub(Q.one))}$` : `$1 - ${dec(b)} = ${dec(Q.one.sub(b))}$`}, which is $${ans.toLatex()}\\%$.\n\n**Check.** From $x = 0$ to $x = 1$ the prediction goes from $${a}$ to $${a} \\cdot ${dec(b)} = ${dec(next)}$, a change of $${dec(change)}$, and $\\frac{${dec(change)}}{${a}} = ${ans.toLatex()}\\%$.`,
            `**第一步：读出因子。**每${what[3]}这个值乘以 $b = ${dec(b)}$，它${grow ? "大于" : "小于"} $1$，所以值在${grow ? "增加" : "减少"}。\n\n**第二步：求与 $1$ 的差。**${grow ? `$${dec(b)} - 1 = ${dec(b.sub(Q.one))}$` : `$1 - ${dec(b)} = ${dec(Q.one.sub(b))}$`}，即 $${ans.toLatex()}\\%$。\n\n**检验。**从 $x = 0$ 到 $x = 1$，预测值从 $${a}$ 变为 $${a} \\cdot ${dec(b)} = ${dec(next)}$，变化了 $${dec(change)}$，而 $\\frac{${dec(change)}}{${a}} = ${ans.toLatex()}\\%$。`,
          ),
        });
      },
    },
    {
      id: "exponential-models-from-a-fit-of-ln-y",
      title: t("Exponential models from a fit of ln y", "由 ln y 的拟合得指数模型"),
      explanation: t(
        "Regression can also be done on the natural logarithm. If the least-squares line for $(x, \\ln y)$ is $\\ln \\hat{y} = c + kx$, exponentiate both sides:\n\n$$\\hat{y} = e^{c + kx} = e^{c} \\cdot e^{kx}.$$\n\nSo $\\ln \\hat{y} = 1.2 + 0.3x$ gives $\\hat{y} = e^{1.2} e^{0.3x} \\approx 3.32\\,e^{0.3x}$.\n\nCheck: taking the natural logarithm of $e^{1.2} e^{0.3x}$ gives $1.2 + 0.3x$ back.\n\n> **Watch out.** The intercept $c$ becomes the factor $e^{c}$, not $c$ itself, and exponentiating turns the sum $c + kx$ into a product, not a sum.",
        "回归也可以对自然对数进行。若 $(x, \\ln y)$ 的最小二乘直线为 $\\ln \\hat{y} = c + kx$，对两边取指数：\n\n$$\\hat{y} = e^{c + kx} = e^{c} \\cdot e^{kx}.$$\n\n所以由 $\\ln \\hat{y} = 1.2 + 0.3x$ 得 $\\hat{y} = e^{1.2} e^{0.3x} \\approx 3.32\\,e^{0.3x}$。\n\n检验：对 $e^{1.2} e^{0.3x}$ 取自然对数，得回 $1.2 + 0.3x$。\n\n> **注意。** 截距 $c$ 变成因子 $e^{c}$，而不是 $c$ 本身；取指数把和 $c + kx$ 变成积，而不是和。",
      ),
      generate(rng) {
        const c = Q.of(rng.nonZero(-30, 50), 10);
        const k = Q.of(rng.nonZero(-20, 20), 20);
        const C = dec(c);
        const K = coef(k);
        const line = `\\ln \\hat{y} = ${C} ${signedTerm(k, "x")}`;
        const opt = (s: string) => t(`$\\hat{y} = ${s}$`, `$\\hat{y} = ${s}$`);
        const kx = `e^{${K}x}`;
        const asCoef = opt(`${C} \\cdot ${kx}`);
        const swapped = opt(`e^{${K}} \\cdot e^{${coef(c)}x}`);
        const asSum = opt(`${C} + ${kx}`);
        const problem = oneOf(
          rng,
          t(
            `A least-squares line fitted to the points $(x, \\ln y)$ is $${line}$. Which exponential model does it give?`,
            `对点 $(x, \\ln y)$ 拟合的最小二乘直线为 $${line}$。它对应哪个指数模型？`,
          ),
          opt(`e^{${C}} \\cdot ${kx}`),
          [asCoef, swapped, asSum],
          t(
            `**Step 1: Exponentiate both sides.** $\\hat{y} = e^{\\ln \\hat{y}} = e^{${C} ${signedTerm(k, "x")}}$.\n\n**Step 2: Split the exponent.** Since $e^{u + v} = e^{u} e^{v}$, $\\hat{y} = e^{${C}} \\cdot ${kx}$.\n\n**Check.** Taking the natural logarithm of the model gives back the line: $\\ln\\left(e^{${C}} \\cdot ${kx}\\right) = ${C} ${signedTerm(k, "x")}$.`,
            `**第一步：两边取指数。**$\\hat{y} = e^{\\ln \\hat{y}} = e^{${C} ${signedTerm(k, "x")}}$。\n\n**第二步：拆开指数。**由 $e^{u + v} = e^{u} e^{v}$，得 $\\hat{y} = e^{${C}} \\cdot ${kx}$。\n\n**检验。**对模型取自然对数得回这条直线：$\\ln\\left(e^{${C}} \\cdot ${kx}\\right) = ${C} ${signedTerm(k, "x")}$。`,
          ),
        );
        return reasoned(problem, [
          [
            asCoef.en,
            `This uses the intercept $${C}$ itself as the factor; the factor is $e^{${C}}$.`,
            `这直接把截距 $${C}$ 当作因子；因子应是 $e^{${C}}$。`,
          ],
          [swapped.en, "This swaps the intercept and the slope of the line.", "这把直线的截距和斜率弄反了。"],
          [
            asSum.en,
            `This keeps a sum; exponentiating turns $${C} ${signedTerm(k, "x")}$ into the product $e^{${C}} \\cdot ${kx}$.`,
            `这保留了和的形式；取指数把 $${C} ${signedTerm(k, "x")}$ 变成积 $e^{${C}} \\cdot ${kx}$。`,
          ],
        ]);
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
