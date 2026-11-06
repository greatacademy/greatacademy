# 英语课程体系

> [English](english-curriculum.md) | 简体中文

本文规定英语学科的设计：知识图谱，面向母语和外语学习者的课程，以及如何教授和评判阅读、写作和口语。它运用 [The Math Academy Way](the-math-academy-way.zh-CN.md) 的方法，运行在[内容](content.zh-CN.md)和[学习引擎](learning-engine.zh-CN.md)所述的核心之上。这里的内容尚未实现，工作顺序见 §12。

---

## 1. 原则

1. **一个学科，一张图谱。** 母语和外语学习者共用一张知识图谱，区别在课程：每门课程是图谱上的一个视图，有自己的基础内容和掌握下限（[内容 §6](content.zh-CN.md#6-课程)）。
2. **母语学习者优先。** 设计完整覆盖两类学习者，由母语的语言艺术课程决定工作优先级和课程体系的顶端。外语课程在高阶与母语课程汇合。
3. **先拆解，再评判。** 写文章这样的大技能，只有整体评判时才难。大部分练习放在能可靠评判的小技能上。
4. **尽量使用确定性判定。** 规则能判定的交给规则。规则判定不了的才交给 AI，而且要先与人工校准（§8.3）。
5. **阅读量是课程的一部分。** 语言能力和阅读理解还依赖大量阅读、听力和知识，主题掌握不能替代它们（§5）。
6. **绝不降低标准。** 反馈指出问题，但不替学习者改正。口语以能否听懂为标准，绝不以口音为标准。

## 2. 哪些可以沿用数学的做法

| 思想 | 在英语上 | 能否沿用 |
| :--- | :--- | :--- |
| 知识图谱与前沿 | 解码、语法和句子写作的先后关系清楚，阅读理解的较弱 | 部分可以 |
| 掌握后才前进 | 可拆解的技能：从句、词根、段落结构 | 可以 |
| 间隔复习 | 词汇、语法和拼写 | 可以；词汇需要单独设计（§4） |
| 分数式隐式复习 | 写一个复合句，同时练到语法和标点 | 可以；权重重新校准 |
| 自动化 | 解码和朗读要做到不费力，才能把注意力留给意义 | 可以；增加限时朗读 |
| 阅读量与知识积累 | 数学中没有对应部分 | **新增**（§5） |

阅读简单观点认为，理解是解码与语言理解的乘积（Gough & Tunmer, 1986）；Scarborough 的阅读绳模型把两者拆成多条细线。两者给出了图谱前期的结构。Recht 和 Leslie（1988）发现，对主题的已有知识与阅读能力对理解的影响一样大，所以知识单独成为一条主线。

## 3. 知识图谱

学科有七条主线，主线之间由边相连。

| 主线 | 内容 |
| :--- | :--- |
| 声音与文字 | 音素意识、自然拼读、拼写规律 |
| 词汇 | 词根词缀、学术词汇、一词多义、搭配 |
| 语法与句子 | 从词类和句子成分，到复杂句和文体 |
| 阅读 | 解码流畅度、文本结构、推理、论证分析 |
| 写作 | 从句子、段落、文章到研究写作 |
| 听与说 | 听辨、发音、朗读、复述、演讲、讨论 |
| 文学与知识 | 文学体裁、修辞、重要作品，以及历史和科学等知识单元 |

典型的路径会跨越主线：

```text
语法：从属连词 → 写作：用 because 和 although 合并句子 → 写作：论证段落
```

后面的主题包含前面的主题，所以隐式复习可以跨主线发挥作用。主题 id 遵守通常的规则：使用 kebab case，发布后不再改变。

## 4. 词汇

每个单词一个主题会让图谱增加数万个节点，所以：

- 一个主题是 **8 到 12 个按词根或语义相关的单词**，符合现有的粒度规则。
- 复习时从这一组中抽取单词，引擎不需要改动。
- 教学集中于跨学科都有用的词，即 Beck、McKeown 和 Kucan 三层词汇中的第二层。专业术语放在需要它们的知识单元里讲。
- 如果试点发现同一组单词的遗忘速度差别很大，再给引擎增加单词级的记忆状态。这是之后根据数据做的决定。

## 5. 阅读量与知识

新增**阅读任务**：一篇分级文章，加简短的理解检查。

- **用图谱分级。** 每篇文章声明它依赖的主题和单词，只推荐给掌握足够内容的学习者。已知词的目标比例从 98% 开始，这个数字来自 Hu 和 Nation（2000）。它存在争议：Schmitt 等人（2011）发现已知词比例与理解大致呈线性关系，后来的一项复制研究也没有完全复现原结果。所以它是需要校准的参数，不是规则。
- **知识单元。** 文章按同一领域组成序列，每读一篇，下一篇就更容易读。
- **来源。** 文章为原创或公版文本。绝不复制已出版课程和考试的文本、题目和词表。
- **积分。** 阅读按所用时间获得 XP，并给它依赖的主题部分积分。

理解检查需要大量文章，因为读过的文章不能再检验理解。

## 6. 课程

### 6.1 母语课程

| 课程 | 重点 |
| :--- | :--- |
| 幼儿园至 2 年级 | 自然拼读、朗读流畅度、听力理解、造句 |
| 3 至 5 年级 | 语法、词根、段落、知识型阅读 |
| 6 至 8 年级 | 文章结构、论证、文学分析 |
| 9 至 12 年级 | 修辞、文学、学术写作、大学入学和进阶先修考试 |
| 大学及以上 | 研究写作、批判性阅读、专业写作、文体 |

### 6.2 外语课程

级别采用 CEFR，考试和教材广泛使用它的级别。

| 课程 | 重点 |
| :--- | :--- |
| Pre-A1 至 A2 | 字母与发音、高频词、基础语法、大量听力 |
| B1 至 B2 | 真实文本、复杂句、段落写作、讨论 |
| C1 至 C2 | **与母语的中学和大学课程汇合** |
| 考试课程 | IELTS、TOEFL、剑桥、高考：基于图谱已有主题的纯练习课程 |

这些课程的练习遵循 Nation 的四条线，时间大致相等：意义输入、意义输出、语言知识学习和流畅度训练。没有这种平衡，课程就会变成语法和词表。

### 6.3 两类学习者的差别

| | 母语学习者 | 外语学习者 |
| :--- | :--- | :--- |
| 已有基础 | 口语、语感、大量听力词汇 | 成人往往已有读写能力和常识 |
| 主要缺口 | 文字、学术语言、写作 | 听力、口语、语感、词汇量 |
| 语法 | 把已会的讲明白，用于改善写作 | 从零建立，并需要大量输入 |
| 专属主题 | 方言与标准书面英语之间的转换 | 面向中文母语者的冠词、时态、复数以及 th、r/l 等发音 |

## 7. 内容模型

核心仍然不涉及具体学科。`libs/subject-english` 存放判定器，`content/english` 存放内容，并像数学一样有自己的 Worker。英语需要增加：

- **讲解语言。** 由课程选择。母语课程不论界面语言都用英语讲解，外语课程可以用中文讲解。每段讲解仍然具备两种语言，正在学习的英语用 `same` 书写。
- **面向人群。** 一个 knowledge point 可以为不同人群准备不同的例子，成人初学者不必读写给八岁孩子的句子。
- **题库。** 英语不能像数学那样用随机数生成。生成器按种子从人工编写的题目中选择，也可以用模板变化。它仍然是确定性的，列出错误回答，并通过 `sampleGenerators`。
- **音频。** 题目可以播放音频，回答可以是录音。

## 8. 写作

### 8.1 层级

| 层级 | 练习 | 判定方式 |
| :--- | :--- | :--- |
| W1 书写规范 | 标点、大小写、拼写 | 规则 |
| W2 句子 | 合并句子、用 because、but、so 扩句、改写成指定形式 | 规则查结构，AI 查意思 |
| W3 修改与判断 | 改错、给句子排序、选最好的主题句、找出无依据的论断 | 大多用规则 |
| W4 段落 | 每次一个动作：主题句、论据、结论 | AI，按少量是非标准 |
| W5 文章 | 提纲、初稿、修改 | AI，按评分标准，并抽样人工复核 |
| W6 长篇 | 研究论文、专业写作 | AI 反馈，可选人工审阅 |

大部分练习放在 W1 到 W3，那里的判定便宜又可靠。Graham 和 Perin（2007）发现，教授计划、修改和编辑策略效果很强，也支持摘要写作和句子合并。*The Writing Revolution*（Hochman & Wexler）是从明确的句子教学逐步走向完整作文的范例。

### 8.2 评判规则

- **只评教过的内容。** 练习论据的段落只看论据，反馈最多两点。
- **AI 不打总分。** 评分标准拆成是非题，AI 对每一项都必须引用学习者的原文，这样它的判断可以检查。
- **靠修改通过。** 反馈说明问题和位置，学习者重写，通过的是修改后的版本。
- **复习要短。** 主题通过受限的小任务复习，而不是再写一篇文章。文章给它用到的技能隐式积分。

### 8.3 AI 判定

- **先校准。** 用人工评分的文本作为测试集。只有 AI 与人工的一致性接近两位评分者之间的一致性，这项标准才能上线。
- **与引擎结合。** 满足标准的比例就是这次复习在 [0, 1] 内的结果。判定和模型版本存入事件，重放时不再调用 AI。
- **放在纯函数库之外。** AI 判定是异步服务。`libs/content`、`libs/engine` 和 `libs/subject-english` 中的判定器保持纯净。
- **学习者文本只是数据。** 文章中的文字绝不会被当作给评判者的指令。
- **诚信。** 不做 AI 写作检测，因为检测不可靠，还会冤枉人。小测验在应用内限时完成，所以代写帮不了学习者通过测验。

## 9. 口语

### 9.1 层级

话语越开放，判定越不可靠，所以练习从受限走向开放。

| 层级 | 练习 | 判定方式 |
| :--- | :--- | :--- |
| S1 听辨 | 区分 ship 和 sheep 这样的音 | 选择题，不需要麦克风 |
| S2 发音 | 跟读音素、单词和重音 | 语音评测 |
| S3 朗读与跟读 | 限时朗读，跟读节奏和语调 | 语音对齐，每分钟正确词数 |
| S4 受限表达 | 把句子改成过去式说出来，用指定句型描述图片 | 语音转文字，再用规则 |
| S5 半开放表达 | 复述文章，口头摘要 | AI 查要点覆盖 |
| S6 开放表达 | 演讲、辩论、与 AI 对话 | 流利度指标，以及 AI 按评分标准 |

外语课程及早开始，集中于 S1 到 S4，这些层级建立口语的自动化。母语课程集中于 S3、S5 和 S6：流畅朗读、表达结构和演讲，不练发音。

### 9.2 评判规则

- **以听懂为标准，不以口音为标准。** 方言和外国口音都不扣分。按发音对理解的影响程度依次纠正，遵循可懂度原则（Levis, 2005）。
- **置信度低绝不算失败。** 语音系统对儿童和不常见的口音可能不准。置信度低时请学习者重录，不计失败。
- **技术问题绝不阻碍学习。** 没有麦克风或环境嘈杂时可以跳过口语。阅读和写作主题不以口语为先修。
- **隐私。** 学习者包括未成年人。默认只保存转写和分数，不保存录音。上线前需要法务审查。
- **AI 对话是应用，不是教学。** 它能激发动力，但进步难以衡量，所以不能替代 S1 到 S5。

## 10. 诊断与试点

诊断像数学一样把学习者放到图谱上，使用能可靠判定的主题，不依赖语音或 AI 判定。[试点](roadmap.zh-CN.md#3-试点)用平台之外的测试衡量学习效果，不用平台自己的题目。这对英语尤其重要，因为高度结构化的方法在这里验证较少，理解练习的迁移也可能较弱。

## 11. 首个切片

首个切片是 3 至 8 年级的语法、句子写作和词汇。它几乎都能用规则判定，不需要语音和 AI，可以检验掌握学习和隐式复习在英语上是否有效。自然拼读虽然在图谱底部，但放在后面：低龄孩子很少自主学习，而且它依赖音频和语音。

以下主题是初稿，括号内是直接先修。

**语法与句子**

- `subjects-and-predicates`
- `nouns-and-pronouns`
- `complete-sentences-and-fragments`（`subjects-and-predicates`）
- `simple-verb-tenses`（`subjects-and-predicates`）
- `subject-verb-agreement`（`simple-verb-tenses`）
- `pronoun-antecedent-agreement`（`nouns-and-pronouns`）
- `adjectives-and-adverbs`（`nouns-and-pronouns`）
- `prepositional-phrases`（`adjectives-and-adverbs`）
- `coordinating-conjunctions`（`complete-sentences-and-fragments`）
- `run-ons-and-comma-splices`（`coordinating-conjunctions`）
- `subordinating-conjunctions`（`coordinating-conjunctions`）
- `relative-clauses`（`subordinating-conjunctions`、`pronoun-antecedent-agreement`）
- `appositives`（`relative-clauses`）
- `participial-phrases`（`relative-clauses`、`simple-verb-tenses`）
- `misplaced-modifiers`（`participial-phrases`）
- `active-and-passive-voice`（`subject-verb-agreement`）
- `parallel-structure`（`coordinating-conjunctions`）

**写作**

- `capitals-and-end-punctuation`（`complete-sentences-and-fragments`）
- `commas-in-a-series`（`coordinating-conjunctions`）
- `expanding-with-because-but-so`（`coordinating-conjunctions`）
- `combining-with-conjunctions`（`subordinating-conjunctions`、`expanding-with-because-but-so`）
- `fixing-run-ons`（`run-ons-and-comma-splices`）
- `combining-with-relative-clauses`（`relative-clauses`、`combining-with-conjunctions`）
- `combining-with-appositives`（`appositives`、`combining-with-relative-clauses`）
- `varying-sentence-openings`（`prepositional-phrases`、`participial-phrases`）
- `cutting-wordiness`（`active-and-passive-voice`）
- `identifying-topic-sentences`（`combining-with-conjunctions`）
- `ordering-sentences-in-a-paragraph`（`identifying-topic-sentences`）
- `choosing-transitions`（`ordering-sentences-in-a-paragraph`）
- `removing-off-topic-sentences`（`identifying-topic-sentences`）

**词汇**

- `base-words-and-affixes`
- `common-prefixes`（`base-words-and-affixes`）
- `common-suffixes`（`base-words-and-affixes`）
- `suffixes-that-change-word-class`（`common-suffixes`）
- `prefixes-of-number-and-position`（`common-prefixes`）
- `latin-roots-1`（`common-prefixes`、`common-suffixes`）
- `latin-roots-2`（`latin-roots-1`）
- `greek-roots-1`（`common-prefixes`、`common-suffixes`）
- `context-clues`
- `academic-words-1`（`context-clues`）
- `connotation-and-precise-words`（`academic-words-1`）

包含边的例子，权重是待校准的初始值：`combining-with-relative-clauses` 包含 `relative-clauses`（0.5）；`fixing-run-ons` 包含 `run-ons-and-comma-splices`（0.5）；`latin-roots-2` 包含 `latin-roots-1`（0.2）。

完成标准：切片能够编译，所有生成器通过采样，模拟学生能够完成，真实学习者在不使用平台题目的外部测试上有进步。

## 12. 工作顺序

1. **首个切片**（§11）。
2. **阅读与知识：** 分级阅读和知识单元，然后是 AI 判定的段落和文章。
3. **外语课程：** A1 到 B1，以及听力和 S1 到 S4。
4. **向两端扩展：** 向下是自然拼读，向上是大学写作和考试课程。

| 改动 | 范围 |
| :--- | :--- |
| 内容模型 | 讲解语言、面向人群、音频、阅读任务 |
| AI 判定 | 异步服务；判定存入事件 |
| 语音 | 客户端录音；服务端语音服务 |
| 引擎 | 前沿、隐式复习、复习、XP 和测验都不改动 |

## 13. 风险

- **方法在这里验证较少。** 尤其是理解可能无法从练习迁移。由外部测试决定。
- **内容成本。** 文章和题库需要人工审核，这是最大的成本。总量尚未估算。
- **AI 判定。** 准确性、成本和对供应商的依赖都是风险；§8 和 §9 的分层把 AI 用量控制在较小范围。
- **儿童数据。** 未成年人的录音和写作需要在每个市场做法务审查。

## 14. 参考文献

- Beck, I. L., McKeown, M. G., & Kucan, L. *Bringing Words to Life*.
- Gough, P. B., & Tunmer, W. E. (1986). Decoding, reading, and reading disability. *Remedial and Special Education*.
- Graham, S., & Perin, D. (2007). A meta-analysis of writing instruction for adolescent students. *Journal of Educational Psychology*, 99, 445–476.
- Hochman, J. C., & Wexler, N. *The Writing Revolution*.
- Hu, M., & Nation, P. (2000). Unknown vocabulary density and reading comprehension. *Reading in a Foreign Language*.
- Levis, J. M. (2005). Changing contexts and shifting paradigms in pronunciation teaching. *TESOL Quarterly*.
- Nation, P. The four strands. *Innovation in Language Learning and Teaching*.
- Recht, D. R., & Leslie, L. (1988). Effect of prior knowledge on good and poor readers' memory of text. *Journal of Educational Psychology*.
- Scarborough, H. S. (2001). Connecting early language and literacy to later reading (dis)abilities. In *Handbook of Early Literacy Research*.
- Schmitt, N., Jiang, X., & Grabe, W. (2011). The percentage of words known in a text and reading comprehension. *The Modern Language Journal*.
