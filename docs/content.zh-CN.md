# 内容

> [English](content.md) | 简体中文

本文规定 Great Academy 的内容模型，以及内容如何编写、校验和提供给学习者。内容模型位于 `libs/content`，不了解任何具体学科；一个学科以 `SubjectDef` 的形式提供它的知识点、课程和答案判定器。

教学法背景见 [The Math Academy Way](the-math-academy-way.zh-CN.md)；引擎如何使用知识图谱见[学习引擎](learning-engine.zh-CN.md)。

---

## 1. 概念

| 概念 | 类型 | 含义 |
| :--- | :--- | :--- |
| 学科 | `SubjectDef` | 例如数学：一张知识图谱、它的课程、它的判定器 |
| 知识点（topic） | `TopicDef` | 一个可教授的概念；知识图谱中的一个节点，也是一节课 |
| 知识步骤（knowledge point） | `KnowledgePointDef` | 知识点中的一步：讲解、例题、练习题 |
| 先修边 | `TopicDef.prerequisites` | 必须先学会这些知识点 |
| 包含边 | `EncompassingDef` | 练习该知识点会隐式地练习一个更简单的知识点的一部分（`weight`） |
| 关键先修 | `KnowledgePointDef.keyPrerequisites` | 这一步最直接依赖的先前知识点，用于补救 |
| 课程 | `CourseDef` | 按单元和模块排列的一组有序知识点，以及掌握下限 |
| 题目 | `Problem` | 一次生成的实例：题面、答案规格、解答、标准答案和错误答案 |
| 判定器 | `Checker` | 根据题目的期望数据判断作答 |

## 2. 文字与语言

每段用户可见的字符串都是 `Text`：每种语言一段 Markdown。语言为 `en` 和 `zh-CN`；数学用 TeX 写在 `$…$`（行内）或 `$$…$$`（独立显示）之间。

```ts
import { t, same } from "@ga/content";

t("Add the numbers.", "把这两个数相加。");
same("$3 + 4$");   // 各语言相同
```

编译器和生成器抽样都会拒绝在任一语言中为空的文字。

## 3. 知识点

```ts
const addingIntegers: TopicDef = {
  id: "adding-integers",
  title: t("Adding Integers", "整数加法"),
  summary: t("Add positive and negative integers.", "正负整数相加。"),
  prerequisites: ["integers-on-the-number-line"],
  encompasses: [{ topic: "integers-on-the-number-line", weight: 0.5 }],
  xp: 12,
  knowledgePoints: [sameSign, differentSigns],
  standards: ["CCSS.7.NS.A.1"],
};
```

规则：

- **Id** 使用 kebab case，在学科内唯一，一经发布不得更改，因为学习者状态引用它们。knowledge point 的 id 在所属知识点内唯一。
- **粒度。** 知识点是值得单独上一节课的最小概念：两到五个 knowledge point，`xp`（认真学习者预计花费的分钟数）通常在 8 到 25 之间。
- **先修**只列直接先修。被另一个先修蕴含的先修是多余的，会产生警告。
- **包含边**指向祖先（直接或间接先修）。不是祖先的等价知识点只有标记 `nonAncestor: true` 才能被包含。`weight` 在 (0, 1] 内：1 表示完整练习了那个更简单的知识点，0.5 表示练习了一半。
- **诊断 knowledge point。** 诊断对每个知识点只出一道题，取自 `diagnostic` 指定的 knowledge point，默认取最后一个，因为它最完整。

## 4. Knowledge Point 与生成器

knowledge point 是课程流程中的一步：学习者阅读 `explanation`，研究一道例题，然后回答同一生成器产生的练习题，直到通过（见[学习引擎](learning-engine.zh-CN.md)）。

```ts
const sameSign: KnowledgePointDef = {
  id: "same-sign",
  title: t("Same signs", "同号相加"),
  explanation: t("To add two integers with the same sign, …", "两个同号整数相加，…"),
  keyPrerequisites: ["integers-on-the-number-line"],
  generate(rng) {
    const s = rng.sign();
    const a = s * rng.int(2, 30);
    const b = s * rng.int(2, 30);
    return {
      prompt: t(`Evaluate $${a} + (${b})$.`, `计算 $${a} + (${b})$。`),
      answer: { checker: "number", expected: a + b, input: { kind: "math" } },
      solution: t(…, …),
      canonical: String(a + b),
      wrong: [String(Math.abs(a) + Math.abs(b) * -s), String(a - b)],
    };
  },
};
```

生成器是从带种子的 `Rng` 到 `Problem` 的函数：

- **确定性。** 相同的种子总是产生相同的题目。题目以引用 `{ topic, kp, seed }` 的形式存储，需要时在服务器上重新生成。因此题目本身无需存储，答案在学习者作答之前也无需离开服务器。
- **不使用外部随机数或时间。** 只用传入的 `Rng`（`int`、`nonZero`、`sign`、`bool`、`pick`、`shuffle`、`sample`）。`createRng` 是经 splitmix32 播种的 sfc32；`hashSeed` 把字符串转为种子。
- **标准答案。** `canonical` 是判定器必须接受的作答，写成学习者会输入的样子。答错后也会展示它。
- **错误答案。** `wrong` 列出典型错误产生的作答（符号错误、该减却加、要求化简时给出未化简形式），判定器必须拒绝每一个。它们记录了这一步针对的误解，也防止判定器过于宽松。
- **多样性。** 生成器必须产生足够多不同的题目，使同一学习者的练习和复习很少重复。
- **不泄露答案。** 题面绝不包含答案；铺垫应放在讲解、例题和额外的 knowledge point 中。

## 5. 答案与判定器

`AnswerSpec` 告诉服务器如何判定，告诉客户端显示什么：

| `input.kind` | 客户端显示 | 作答内容 |
| :--- | :--- | :--- |
| `choice` | 按顺序显示 `options` | 所选选项的下标 |
| `math` | 数学输入框，可带 `prefix` 和 `suffix`（例如 `x =` 或 `\text{cm}`） | 学习者输入的 LaTeX |
| `text` | 普通文本框 | 文本 |

`checker` 指定一个已注册的判定器，`expected` 是该判定器的数据。核心注册两个判定器，学科注册自己的判定器（数学有数、分数、表达式、方程等）。

| 判定器 | `expected` | 接受 |
| :--- | :--- | :--- |
| `choice` | 正确选项的下标 | 正好是该下标 |
| `text` | 可接受字符串的数组 | 其中任意一个，忽略大小写、Unicode 全半角和空白 |

判定器返回 `Verdict`：`correct`，以及在拒绝需要解释时可选的 `feedback`（例如"请化简分数"）。`CheckerRegistry`：

- 拒绝 id 重复的判定器；
- 拒绝超过 2,000 个字符的作答；
- 判定器抛出异常时视为答错。

判定器对**值**必须严格，对**形式**必须明确：当一个知识点教的是化简时，`expected` 写明要求化简形式，判定器拒绝相等但未化简的答案并给出反馈。

## 6. 课程

```ts
const prealgebra: CourseDef = {
  id: "prealgebra",
  title: t("Prealgebra", "代数预备"),
  description: t(…, …),
  masteryFloor: ["counting"],
  units: [
    { title: t("Integers", "整数"), modules: [{ title: t("Adding and Subtracting", "加法与减法"), topics: ["adding-integers", …] }] },
  ],
};
```

- 课程按教学顺序列出知识点，单元和模块只用于展示分组。
- 每个知识点只出现一次，并且排在它在本课程中的所有先修之后。
- **掌握下限。** 假定该课程的每个学习者都已掌握的知识点。它们及其祖先永远不会被本课程讲授或复习。下限中的知识点不能出现在课程中。
- **基础**（计算得出）。课程知识点的祖先中，既不在课程中、也不在下限之下的那些。诊断会测定学习者对它们的掌握情况，缺少这些基础的学习者会先学习它们。

## 7. 编译器

`compileSubject(def)` 校验 `SubjectDef` 并构建引擎使用的索引。任何错误都会抛出 `CompileError`，列出全部问题，每个问题带有路径，例如 `topic adding-integers › kp same-sign`；警告通过 `CompiledSubject.warnings` 返回。

| 检查 | 级别 |
| :--- | :--- |
| Id 为 kebab case 且唯一；文字在每种语言中非空；`xp > 0`；至少一个 knowledge point；诊断 knowledge point 存在 | 错误 |
| 先修存在、不是自身、不重复、不成环 | 错误 |
| 先修被另一个先修蕴含 | 警告 |
| 被包含的知识点存在、除非标记 `nonAncestor` 否则必须是祖先、权重在 (0, 1] 内、不成环 | 错误 |
| 关键先修是所属知识点的祖先 | 错误 |
| 课程中的知识点存在、不重复、排在本课程内先修之后；下限中的知识点不在课程中 | 错误 |

编译后的图谱提供：

- `order`：知识点的拓扑序，在定义顺序上保持稳定；
- `dependents`：先修边的反向；
- `encompassedBy`：包含边的反向，带权重；
- `ancestors`：每个知识点的传递先修，近者在前。

## 8. 生成器抽样

`sampleGenerators(subject, { samples, minDistinct })` 用许多种子（默认 200 个）运行每个生成器。生成器出现以下情况时报告错误：

- 抛出异常，或不确定；
- 生成的文字在某种语言中为空，或含有 `NaN`、`undefined`、`Infinity`、`[object Object]`；
- 指定了未知判定器；
- 选择题：选项少于两个、选项重复，或期望下标越界；
- 标准答案被判定器拒绝，或某个错误答案被判定器接受。

不同题面少于 `minDistinct` 个时发出警告。每个内容包都在测试中运行 `compileSubject` 和 `sampleGenerators`，因此运行时会拒绝的内容无法合入。

## 9. 提供题目

`generateProblem(subject, ref)` 根据 `ProblemRef`（`{ topic, kp, seed }`，`kp` 是 knowledge point 的下标）重新生成题目。服务器只向客户端发送 `viewOf(problem)`：题面和输入规格。答案、标准答案和解答只在学习者作答之后才公开，作答在服务器上判定。

## 10. 数学

`libs/subject-math` 在精确计算的基础上实现数学判定器：解析数学输入框产生的 LaTeX 子集（数、变量、`+ - \cdot \times \div /`、省略乘号、`\frac`、`^`、`\sqrt`、括号、`= < > \le \ge`），基于 `bigint` 的有理数运算（`Q`），以及多项式标准形式。判定答案的过程不涉及浮点数。解析器保留作答的书写形式（括号、`\frac` 与 `/`、小数），因此判定器既能判断值，也能判断形式。

| 判定器 | `expected` | 接受 |
| :--- | :--- | :--- |
| `number` | `{ value, form?, var?, percent? }`：`value` 是有理数，例如 `"-3"`、`"3/4"`、`"2.5"` | 等于 `value` 的单个数。`form` 为 `"number"`（默认）：整数、小数、最简分数或带分数；`"integer"`；`"fraction"`（不接受小数）；`"decimal"`；`"mixed"`（整数、带分数或真分数）。`3+4` 这样的算式会被拒绝并给出反馈。有 `var` 时也接受 `x = 3` 和 `3 = x`。有 `percent` 时输入框后显示 `%`，学习者自己输入的 `%` 会被忽略 |
| `expression` | `{ expr, form? }`：`expr` 是 LaTeX | 与 `expr` 等价的式子：多项式精确比较；其他式子在若干有理点上精确比较。`form: "simplified"` 时，作答还必须是最简形式的单项式之和：没有同类项、没有括号、没有系数 1、没有连续的符号 |
| `inequality` | `{ var, op, value }`：`op` 为 `<`、`<=`、`>` 或 `>=` | `x < 3` 或等价的 `3 > x`，其中的数按 `number` 的规则书写 |
| `factorization` | `{ value }`：不小于 2 的整数 | 乘积等于 `value` 的质数及质数幂之积，顺序不限：`2^{3} \cdot 3` 或 `2 \cdot 2 \cdot 2 \cdot 3`。含合数因数的乘积，或 `value` 为合数时直接写 `value`，会被拒绝并给出反馈 |
| `scientific` | `{ value }`：有理数 | 用科学记数法表示的 `value`：`a \times 10^{n}`（或 `\cdot`），其中 `1 ≤ \|a\| < 10` 写成整数或小数，或单独的 `10^{n}`。其他形式的相同值会被拒绝并给出反馈 |
| `radical` | `{ coef, radicand }`：有理数与不小于 1 的无平方因数整数 | 最简根式形式的 `coef·√radicand`：`6\sqrt{2}`、`-\sqrt{5}`、`\frac{2\sqrt{3}}{3}` 或 `\frac{2}{3}\sqrt{3}`；radicand 为 1 时是有理数。值相同但根号内含平方因数、分母含根式或分数未约分的答案会被拒绝并给出反馈 |

`content/math` 用 `numberProblem`、`expressionProblem`、`inequalityProblem`、`factorizationProblem`、`scientificProblem`、`radicalProblem` 和 `choiceProblem` 构建题目。它们填写答案规格、标准答案和输入方式，并去掉在某个种子下恰好等于正确答案的错误答案。题面和解答中的 LaTeX 用 `num`、`paren`、`poly`、`linear` 书写，它们不会产生 `+ -`、`1x` 或 `-1x`；小数用 `dec`、科学记数法用 `sci`、最简根式用 `radical` 书写。要求小数或带分数的答案，标准答案也写成那种形式。

第一门课程**代数基础**（`algebra-foundations`）有 20 个知识点，分为四个单元：整数（相反数与比较大小、绝对值、四则运算、乘方、混合运算），代数式（求值、合并同类项、乘法分配律、化简），一元一次方程（一步、两步、两边都有变量（含无解与无穷多解）、含括号），一元一次不等式（检验与写出解、一步（含改变不等号方向）、多步）。

**代数预备**（`prealgebra`）有 55 个知识点，分为九个单元。它在代数基础的知识点之外新增 35 个：数论初步（整除的判定、质数与合数、分解质因数、最大公因数、最小公倍数），分数（等值分数、加减、带分数、乘法、除法），小数与百分数（分数与小数互化、小数运算、百分数、求一个数的百分之几、百分比变化），负分数的运算，指数（有理数的乘方、零指数与负指数、指数法则、科学记数法及其运算），根式（平方根与立方根、化简平方根、根式的加减、分母有理化），比与比例（比、单位率、比例），以及统计（平均数、中位数与众数、极差与四分位距、平均绝对偏差、比较数据集、离群值）。两门课程共享相同的知识点：学习者在某个知识点上的进度在两门课程中都有效，第二门课程的诊断只问尚未学会的知识点（[学习引擎 §9](learning-engine.zh-CN.md#9-诊断)）。
