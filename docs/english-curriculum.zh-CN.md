# 英语课程体系

> [English](english-curriculum.md) | 简体中文

本文规定英语学科的设计：知识图谱，面向外语和母语学习者、按级别划分的课程（听说读写在以主题组织的单元中同时学习），以及如何教授和评判每项技能。它运用 [The Math Academy Way](the-math-academy-way.zh-CN.md) 的方法，运行在[内容](content.zh-CN.md)和[学习引擎](learning-engine.zh-CN.md)所述的核心之上。§11 的第一部分已经实现，工作顺序见 §12，[英语开发计划](english-development-plan.zh-CN.md)把它拆分为里程碑。

---

## 1. 原则

1. **一个学科，一张图谱。** 母语和外语学习者共用一张知识图谱，区别在课程：每门课程是图谱上的一个视图，有自己的基础内容和掌握下限（[内容 §6](content.zh-CN.md#6-课程)）。
2. **课程按级别划分，不按技能划分。** 一门课程是一个级别，例如 A1 或三至五年级，同时教这个级别的所有技能，就像数学课程在同一段时间里既教代数也教几何。课程的单元是主题，顺序来自图谱（§6）。
3. **覆盖两类学习者，外语学习者优先。** 设计完整覆盖两类学习者。外语课程在工作顺序上优先，因为首批学习者中很多人说中文；母语的语言艺术课程决定课程体系的顶端，外语课程在 C1 与母语课程汇合。
4. **先拆解，再评判。** 写文章这样的大技能，只有整体评判时才难。大部分练习放在能可靠评判的小技能上。
5. **尽量使用确定性判定。** 规则能判定的交给规则。规则判定不了的才交给 AI，而且要先与人工校准（§8.3）。
6. **阅读量是课程的一部分。** 语言能力和阅读理解还依赖大量阅读、听力和知识，主题掌握不能替代它们（§5）。
7. **绝不降低标准。** 反馈指出问题，但不替学习者改正。口语以能否听懂为标准，绝不以口音为标准。
8. **遵循学校的课程标准。** 学习者随时可能转去学校，所以每门课程教官方标准对这一级的要求，放在标准规定的年级，不自创内容。母语课程遵循美国《共同核心州立标准·英语语言艺术》（CCSS ELA）；外语课程的级别取自 CEFR，词汇、语法、主题、语篇类型和阅读量取自中国教育部的英语课程标准，即《义务教育英语课程标准（2022年版）》和《普通高中英语课程标准（2017年版2020年修订）》，因为许多学习者讲中文。§16 逐条对照这两套标准。

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
- **来源。** 文章为原创或公版文本。标准点名的作品，例如莎士比亚的剧本或美国的建国文献，学习者读公版原文；整部作品作为一组按顺序阅读的篇章来读（§16.4）。绝不复制已出版课程和考试的文本、题目和词表。
- **难度。** 每篇文章带一个按公开公式由词和句子算出的可读性指标，每个年级和级别为它设一个区间，并设篇幅；区间是待校准的参数，起初按标准的要求设定（§16.4）。
- **阅读量。** 每门课程规定学习者在其中读到的词数，至少达到它的标准的要求：各级别按教育部课标的累计课外阅读量（§16.5）。
- **积分。** 阅读按所用时间获得 XP，并给它依赖的主题部分积分。

理解检查需要大量文章，因为读过的文章不能再检验理解。

## 6. 课程

一门课程是一个级别。每门课程同时教词汇、语法、听力、口语、阅读和写作，因为学习者本来就是一起用它们的：故事里听到的词，同一周里也会读到、说出、写下。按技能拆分课程，会让学习者先学完语法再开始阅读，而没有人是这样学语言的。数学也是如此：一个年级的课程同时教数、代数和几何。

### 6.1 单元就是主题

课程的单元是主题：初学者的图书馆、动物、天气，年龄较大的母语学习者的古埃及、水循环等知识单元（§5）。一个单元包含：

| 部分 | 以图书馆单元为例 | 判定方式 |
| :--- | :--- | :--- |
| 词汇 | 一批 8 到 12 个词：borrow、return、shelf、card、due（§4） | 规则 |
| 语法 | 主题用到的一两个语法点：用 can 提问、一般过去时 | 规则 |
| 阅读 | 这个主题的分级文章（§5） | 规则 |
| 听力 | 这个主题的简短对话和广播，配选择题（S1） | 规则 |
| 写作 | 围绕主题从句子写到段落（§8） | 规则，然后 AI |
| 口语 | 说出单元的词和句子（S2 到 S4） | 语音服务 |
| 对话 | 用到单元词汇和句型的口语场景，例如 `library-help-desk`（§6.5） | AI 按评分标准 |

主题是内容的包装，不决定学习顺序。每个部分都是图谱中有自己先修关系的主题或任务，引擎像数学一样从前沿中选择，所以学习者通常同时在两三个单元里学习，各条线交替出现：一节语法课，复习上周的词，读一篇文章，写一个句子。一个主题在图谱中只有一个位置，不论有多少门课程展示它；单元只负责为展示分组，并决定它的例子和文章用哪个主题。

### 6.2 外语课程

级别采用 CEFR，考试和教材广泛使用它的级别。每一级教什么，遵循中国教育部的英语课程标准：每一级学完学校一个阶段的词汇表、语法项目、主题和语篇类型，学习者因而可以进入那个阶段（§16.5）。这些课程在工作顺序上优先（§12）。

| 课程 | 重点 | 对应教育部课标中学完的阶段 |
| :--- | :--- | :--- |
| Pre-A1 | 字母与发音、最初一百个词、课堂用语、大量听力 | 一级，3、4 年级 |
| A1 | 家庭、学校、食物、图书馆等日常主题；现在时、疑问句、简单句和简短留言 | 二级，5、6 年级：约 500 词 |
| A2 | 过去和将来、比较、短故事和书信、描述和解释 | 三级，7 至 9 年级：约 1,600 词 |
| B1 | 真实文本、复杂句、段落、表达观点、较长的对话 | 高中必修：2,000 至 2,100 词 |
| B2 | 论证与讨论、文章、流畅阅读一般文本 | 高中选择性必修，即高考的水平：3,000 至 3,200 词 |
| C1 至 C2 | **与母语的中学和大学课程汇合** | 高中选修（提高类）：4,000 至 4,200 词 |
| 考试课程 | IELTS、TOEFL、剑桥、高考：基于图谱已有主题的纯练习课程；每门课程的大纲给出考试官方与 CEFR 的对应（IELTS 5.5 到 6.5、TOEFL 4 到 4.5 为 B2） | 高考练习高中选择性必修 |

第三栏把教育部课标的阶段放到我们的级别上，并不是两套量表之间的官方对应。

这些课程的练习遵循 Nation 的四条线，时间大致相等：意义输入、意义输出、语言知识学习和流畅度训练。没有这种平衡，课程就会变成语法和词表（§6.4）。

### 6.3 母语课程

母语课程逐年级遵循 CCSS ELA：每门课教本年级在文学阅读、信息类文本阅读、基础读写技能（到 5 年级）、写作、听说和语言各部分的标准，一个 topic 放在 CCSS 最早要求它的年级（§16）。

| 课程 | 重点 |
| :--- | :--- |
| 幼儿园至 2 年级 | 文字概念、语音意识、自然拼读、朗读流畅度、听力理解、造句，最初的观点、事实和故事 |
| 3、4、5 年级 | 语法、词根、段落、知识型阅读 |
| 6、7、8 年级 | 文章结构、论证、文学分析 |
| 9、10、11、12 年级 | 修辞、文学、学术写作、大学入学和进阶先修考试 |
| 大学及以上 | 研究写作、批判性阅读、专业写作、文体 |

母语课程用同样的方式构建：一个年级的单元是知识单元和文体，每个单元围绕主题阅读、讨论和写作。重点一栏说明这几个年级最看重什么，而不是只教什么。

从 3 年级起每个年级一门课，和数学一样，因为一学年需要一学年的学习量：一个年级约有十个主题单元、100 到 130 个 topic、1,500 到 2,000 XP 的课时，以及八到十个阅读单元，接近数学 4 到 8 年级的一门课。一个年级按 CCSS 的要求（L.4 至 L.6）教它的阅读所需的学术词汇和学科词汇，以及这一年的语法、阅读技能和写作，各技能大致按词汇 40%、语法和书写规范 20%、阅读 20%、规则判定的写作 12%、模型判定的写作 8% 分配。给外语学习者的日常词汇属于各级别，不属于各年级。一个年级段（3 到 5、6 到 8、9 到 12 年级）共用的 topic 放在教它们的那个年级。C1 和 C2 仍然并入 9 到 12 年级和大学课程（§6.2）：它们的学术词汇、搭配和文体放进这些课程。

幼儿园和 1、2 年级也各有一门课，规模较小，因为年幼的孩子学习时间短，需要大人在旁陪伴：六个主题单元，教自然拼读、造句、短故事和讲事实的短文，每个单元最后听本单元篇章的录音并朗读其中的句子，录音事先做好。它们没有对话；它们的写作是 CCSS 要求的简短观点、说明和事件叙述（W.1 至 W.3），一句或几句，由模型评判，幼儿园的孩子可以口述。`english-phonics` 课程仍单独教声音与文字这条线。母语课程从幼儿园和自然拼读起，经 1 至 12 年级一门接一门；大学写作建立在 12 年级和英语 B2 之上，因为它的许多学生是把英语当外语学的，而 B2 是进入英语国家大学的常见门槛。

### 6.4 各条线的平衡

前沿决定可以学什么；在前沿之内，引擎优先选择解锁最多的内容，并安排到期的复习。仅靠这些，选择可能偏向主题最多的线，通常是语法和词汇。因此课程可以为若干组主题声明目标时间占比，例如 Nation 的四条线，引擎会偏向离目标占比最远的那一组。这个参数不涉及具体学科：它指的是主题分组，而不是技能。是否需要它、偏向多强，都先用模拟学生决定，再决定是否采用（[学习引擎](learning-engine.zh-CN.md)）。

### 6.5 对话为单元收尾

单元的最后一个任务是与 AI 导师的对话，需要用到单元的词汇和句型，例如图书馆单元最后的 `library-help-desk`。它的先修是单元的主题，所以这些主题学会后，它像其他任务一样出现在"接下来"里，而不是单独推荐。学习者达到评分标准即算完成（S6，§9.1），并按用时获得 XP。评分标准通过校准之前，它不进入引擎，由学习者自行选择。没有麦克风、或者没有可用路线的学习者跳过它，在图谱中没有任何损失。

### 6.6 两类学习者的差别

| | 母语学习者 | 外语学习者 |
| :--- | :--- | :--- |
| 已有基础 | 口语、语感、大量听力词汇 | 成人往往已有读写能力和常识 |
| 主要缺口 | 文字、学术语言、写作 | 听力、口语、语感、词汇量 |
| 语法 | 把已会的讲明白，用于改善写作 | 从零建立，并需要大量输入 |
| 专属主题 | 方言与标准书面英语之间的转换 | 面向中文母语者的冠词、时态、复数以及 th、r/l 等发音 |

## 7. 内容模型

核心仍然不涉及具体学科。`libs/subject-english` 存放判定器，`content/english` 存放内容，与数学一起编译进 API 服务器。英语需要增加：

- **讲解语言。** 由课程选择。母语课程不论界面语言都用英语讲解，外语课程可以用中文讲解。每段讲解仍然具备两种语言，正在学习的英语用 `same` 书写。
- **面向人群。** 一个 knowledge point 可以为不同人群准备不同的例子，成人初学者不必读写给八岁孩子的句子。
- **题库。** 英语不能像数学那样用随机数生成。生成器按种子从人工编写的题目中选择，也可以用模板变化。它仍然是确定性的，列出错误回答，并通过 `sampleGenerators`。
- **音频。** 题目可以播放音频，回答可以是录音。
- **主题单元。** 课程的单元带有主题，并列出使用这个主题的文章、听力和对话（§6.1）。
- **线。** 每个主题注明所属的线，以便审核课程并在各条线之间平衡（§6.4）。
- **整部作品、难度和长篇写作。** 一个阅读单元可以是按顺序阅读的一整部作品；每篇文章带它的可读性指标；一篇评判的作文可以跨几次学习完成（§16.4）。

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

篇幅和时间遵循标准。一个年级的作文按 CCSS 对它的要求定长度，例如 4 年级一次写完一页打字稿，5 年级两页，6 年级三页（W.4.6 至 W.6.6）；从 3 年级起，每个年级都有研究项目，以及分几次完成的作文：构思、起草、修改、发布，这是 W.5 至 W.7 和 W.10 的要求；每次的成果都随作文保存，直到交稿（§16.4）。

### 8.2 评判规则

- **只评教过的内容。** 练习论据的段落只看论据，反馈最多两点。
- **AI 不打总分。** 评分标准拆成是非题，AI 对每一项都必须引用学习者的原文，这样它的判断可以检查。
- **靠修改通过。** 反馈说明问题和位置，学习者重写，通过的是修改后的版本。
- **复习要短。** 主题通过受限的小任务复习，而不是再写一篇文章。文章给它用到的技能隐式积分。

### 8.3 AI 判定

- **先校准。** 用人工评分的文本作为测试集。只有 AI 与人工的一致性接近两位评分者之间的一致性，这项标准才能上线。
- **与引擎结合。** 满足标准的比例就是这次复习在 [0, 1] 内的结果。判定和模型版本存入事件，重放时不再调用 AI。
- **放在纯函数库之外。** AI 判定是异步服务（§13.1）。`libs/content`、`libs/engine` 和 `libs/subject-english` 中的判定器保持纯净。
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
- **隐私。** 学习者包括未成年人。默认只保存转写和分数，不保存录音。上线前需要法务审查；机制见[未成年人数据](minors-data.zh-CN.md)。
- **AI 对话用于应用，不用于教学。** 它用单元所教的内容为单元收尾（§6.5）。对话中的进步难以衡量，所以不能替代 S1 到 S5。

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

此后首个切片又增加了八个用规则判分的主题，共 49 个：`comparatives-and-superlatives`（`adjectives-and-adverbs`）、`apostrophes-and-possessives` 和 `commonly-confused-words`（`nouns-and-pronouns`）、`verb-tense-consistency`（`simple-verb-tenses`）、`commas-after-introductions`（`capitals-and-end-punctuation`、`prepositional-phrases`）、`punctuating-dialogue`（`capitals-and-end-punctuation`），以及 `academic-words-2` 和 `academic-words-3`，各自排在前一批之后。另有五个主题由模型判定（§13.1）：段落主题之后的 `writing-a-paragraph`、`writing-an-opinion-paragraph` 和 `writing-a-how-to-paragraph`，以及合并句子主题之后的 `expanding-ideas-in-your-own-words` 和 `combining-sentences-in-your-own-words`，后两者在规则检查形式之处检查意思。没有路由能服务的学习者学课程时会跳过它们。

§3 的阅读分支最初有 15 个规则判分的主题，每道题是一段原创短文加选择：主旨、概括和文本特征；顺序、因果、比较与对比以及文本结构；推断、事实与观点以及作者的目的；叙述视角、人物和故事的寓意；明喻、暗喻和习语。只有 `point-of-view` 通过 `nouns-and-pronouns` 依赖首个切片。六至八年级的文学与论证在它们之上，用 9 个同样的主题讲授：拟人和夸张、声音修辞和韵式、情节与冲突、主题、语气与氛围；然后是论点、论据、推理、反方观点与反驳。另有五个细读主题：叙述者及其所知、象征、反讽、伏笔与倒叙，以及引用文本证据。随后是七个由模型判定的主题，每个主题对应文章的一个步骤（§8.3）：论点句、提纲、引用来源论据的主体段落、反方观点段落、开头与结尾、修改草稿，以及文学评析段落。随后是一篇完整的议论文 `writing-an-argument-essay`：一次交上，在课时结束后判定。九至十二年级的修辞在这些之上，有 8 个规则判分的主题：修辞情境、人格、情感与理性诉求、修辞手法、逻辑谬误和评估来源；人物塑造、典故以及悖论与矛盾修饰。最后是两个由模型判定的主题：修辞分析和两个来源的综合。

**这些主题在哪里讲授。** 这些主题按技能编写，但没有一门课程按技能构建（§6）。它们保留 id 和在图谱中的位置，在级别课程和年级课程中讲授：语法、词汇和句子写作在 A1 到 B1 以及三至五年级，阅读主题在三至五年级和 B1，文学、论证和修辞在六至十二年级和 B2。

## 12. 工作顺序

1. **首个切片**（§11）。
2. **阅读与知识：** 分级阅读和知识单元，然后是 AI 判定的段落和文章。
3. **按主题构建 A1 和 A2：** 以日常主题为单元，重新编排已经建好的主题，并为每个主题补充词汇、语法、文章和写作。目前还没有听力和口语内容，所以最初的版本以阅读、写作、词汇和语法为主；音频和录音到位后，每个单元加入听力（S1）和口语（S2 到 S4），评分标准通过校准后加入对话。
4. **B1、B2 和母语各年级段，** 用同样的方式构建。
5. **对话与两端：** 语音服务上的 S5 和 S6；向下是自然拼读，向上是大学写作和考试课程。
6. **按年级的母语课程：** 1 到 12 年级每个年级一门课（§6.3），先 3 到 5 年级，再 6 到 8 年级，再 9 到 12 年级，然后是 1、2 年级。
7. **逐条对照课程标准**（§16）：每门课程按教学标准重写；母语课程对齐 CCSS，先幼儿园到 2 年级，再 6 到 12 年级，再 3 到 5 年级；各级别对齐教育部课标的词汇表、语法项目、主题和阅读量，先 A1 和 A2。

| 改动 | 范围 |
| :--- | :--- |
| 内容模型 | 讲解语言、面向人群、音频、阅读任务、主题单元、每个主题所属的线 |
| AI 判定 | 异步服务；判定存入事件（§13.1） |
| 语音 | 客户端录音；服务端语音服务（§13.2）；Kubernetes 上用于对话的语音服务（§13.3） |
| 引擎 | 校准过的对话成为"接下来"中的任务；只有模拟显示需要时才加入各条线的平衡（§6.4）；前沿、隐式复习、复习、XP 和测验都不改动 |

## 13. 技术与部署

本节规划数学所没有的部分。每一部分在 §12 的对应阶段开始时才构建，所以首个切片都不需要。

### 13.1 AI 模型

所有模型调用都通过 **pi-ai**（`@earendil-works/pi-ai`），用 `@earendil-works/pi-schema` 定义回答结构，用 `@earendil-works/pi-telemetry` 记录每次调用的耗时和成本。版本像其他依赖一样精确固定，当前为 1.5.0。这部分代码在纯函数库之外，测试使用 pi-ai 的 `faux` provider，因此不需要网络。

模型通过调用 `respond` 工具作答，工具的结构包含各项标准和原文引用。

**设计和代码都不固定供应商或模型。** 由平台管理员在管理后台配置。pi-ai 支持自定义 provider 和显式传入密钥，所以除非 API 是全新的，新增供应商不需要改代码。每种用途的要求不同：

| 用途 | 对模型的要求 |
| :--- | :--- |
| W2 的句意检查，量大且简单 | 成本低 |
| W4 段落的是非标准 | 兼顾成本和准确性 |
| W5 和 W6 的文章与长篇，以及校准基线 | 准确性最高 |
| S6 的对话 | 低延迟，通过测量选定 |
| 离线起草和审核内容 | 准确性高；绝不接收学习者数据 |

**管理员设置的内容：**

- **供应商：** pi-ai 目录中的具名供应商，或手动填写的 API 和基础 URL，以及 API 密钥。密钥用保存在 API 服务器 Secret 中的密钥（`AI_KEYS_SECRET`）加密，可以替换，但不能读回。
- **路由：** 为每项用途设置模型和备用路由：写作批改按标准、S6 按对话，并带提示词版本；语音转文字、文字转语音和发音评分按语言。
- **[未成年人数据](minors-data.zh-CN.md#12-供应商)的供应商登记表：** 每家供应商服务的市场、关于未成年人的条款、保留期限和核查日期。

只有平台管理员能进入后台，每次修改都记录修改人和时间。

**管理员不能绕过的内容。** 服务端在保存路由和使用路由时都会检查：

- 只有这组标准、模型和提示词版本已通过校准，路由才能上线。
- 未成年人的数据只有符合[未成年人数据](minors-data.zh-CN.md#12-供应商)的条件才能发给供应商。没有合格的路由时，该学习者的这项功能关闭，课程继续。

**换模型就是换评分者。** 每个“标准、模型、提示词版本”的组合都单独校准（§8.3），并记录到事件中。供应商故障时，判定稍后重试，或换到已为该标准校准过的备用模型，绝不换到其他模型。

### 13.2 录音口语

S2 到 S5 录音后用普通请求提交：录音最长 30 秒，为 16 kHz 单声道 WAV，在请求之内听取，不在任何地方保存；只有听到的文字随答案保存 30 天。过短、未能听取或置信度低且听到的内容不对的录音会请学习者重录，不计任何结果。只有 S6 需要实时连接（§13.3）。音频经服务端的统一接口送到语音转文字和发音服务，以便更换供应商。

**发音评测尚未选定供应商。** 只有外语课程需要它，所以到第 3 阶段再选。届时用人工评分的录音比较 Azure AI Speech、SpeechSuper、Speechace 和 Language Confidence，录音包括中文母语学习者、其他口音和儿童。比较的指标是与人工的一致性，最重要的是口音重但听得懂的语音被拒绝的频率。同时测试更便宜的可懂度指标：语音转文字能否认出目标词。

语音转文字可能悄悄改掉学习者的语法错误，从而掩盖 S4 和 S6 要判定的错误。每个识别器使用前都要在带有学习者错误的句子及其改正后的句子上测试这一点，每句都按听到的内容像判口语答案一样判题（`stt-verbatim`）：关键是错句仍被判错，所以错误被听成另一种错误（把 “She go” 听成 “She went”）也算保留。S4 和 S6 只通过测试合格的识别器提供，而句子已经给定的 S2 和 S3 只需要 `stt`。在 200 个带有错误的合成句子及其改正句上，Azure AI Speech 保留了 98.5% 的错误，其中 79% 逐字听对，有两句被听成了正确的句子；正确的句子 98.5% 被判对，因此它通过了测试。

### 13.3 语音服务

S6 的对话运行在 `apps/voice` 的 **Pipecat** 上。它是平台中唯一不用 TypeScript 的部分：这是长期运行的 Python 进程，与 API 服务器一起运行在集群上。它参照 Mavio 项目的语音插件。

```text
客户端 ──wss + 短期票据──► Cloudflare ──ingress-nginx──► Kubernetes 上的 apps/voice
   │                                                       │
   └──向 API 服务器申请票据                                ├─► 语音转文字、语音合成
                                                          └─► API 服务器：模型回答、结果
```

- **流水线。** Pipecat 负责语音活动检测（Silero）、判断一轮结束、打断和语音服务。语音服务不在服务里配置：每个会话开始时，它向 API 服务器询问路由所指定的语音识别与语音合成及其密钥，没有符合条件的服务时拒绝会话（`VOICE_SPEECH=api`）；目前它只对接 Azure AI Speech。它不用 LLM 服务：回答由 API 服务器通过 pi-ai 生成，让所有模型调用都在一处。学习者的停顿比母语者长，所以一轮中最长的停顿按级别设置。
- **项目。** Python 和 uv 在 `mise.toml` 中固定，使用 pytest、ruff 和 pyright。Pipecat 精确固定版本（当前为 1.15.0）。镜像包含模型权重，首次会话无需下载。
- **票据。** API 服务器签发有效期约 60 秒的票据，写明学习者、课程和会话；服务用公钥验证。服务在集群内（`VOICE_API_URL`）用自己的凭据调用 API 服务器，写入结果时按会话 ID 保证幂等。
- **回合。** 服务把到目前为止的对话发给 API 服务器，得到导师的下一句以及是否结束；第一句是对话的开场白，不调用模型；服务播放提前录好、从网站（`VOICE_AUDIO_URL`）取得的开场白（[内容 §11](content.zh-CN.md#11-英语)），只在取不到录音时才朗读。API 服务器通过用途为 `conversation` 的路由（先主路由，再备用路由）扮演对话的情景，并在 40 个回合后或对话时长用完时结束。每位学习者每天最多 10 次对话。
- **传输。** WebSocket，Pod 不需要 UDP：双向以二进制消息传输 16 kHz 单声道 16 位 PCM，其余为 JSON 文本消息（`apps/voice/src/ga_voice/messages.py`）。如果在各地区真实移动网络上的测量不达标，就改用经 Cloudflare TURN 的 WebRTC；流水线不依赖传输方式。
- **隐私。** Pod 没有持久卷，不保存音频，日志不含转写内容。API 服务器保存会话转写 30 天，从不保存儿童的。
- **客户端。** Web 客户端沿用 Mavio 的做法：在学习者点击时按设备采样率创建 AudioContext；worklet 以平均的方式降采样到 16 kHz，每帧 20 ms；导师的声音经同一个上下文播放，让浏览器的回声消除能去掉它；没有声音的麦克风会被换成另一个；套接字打开前说的话先保存，打开后再发送。应用从自己的 crate `apps/nsh/native/voice` 取 16 kHz PCM，JavaScript 每 40 ms 取一次：iOS 上是语音聊天会话中开启语音处理的 AVAudioEngine，输入以平均的方式降到 16 kHz，导师的声音由同一引擎上的播放节点播放；Android 上是来自语音通话音源的 AudioRecord，开启设备的回声消除和降噪，以及在同一会话上用于语音通话的 AudioTrack，未戴耳机时声音走扬声器。打断会丢掉排队的声音，麦克风要等导师最后的话播完才关闭。

生产环境运行在 Hetzner Cloud 位于 Hillsboro 的 Kubernetes 集群上，与 PostgreSQL 同处一地（[架构 §6](architecture.zh-CN.md#6-部署)），配置与 API 服务器的一起放在 `deploy/k8s`，位于命名空间 `greatacademy`（[deploy/k8s](../deploy/k8s/README.zh-CN.md)）。域名 `voice.greatacademy.dev` 由 Cloudflare 代理，经 ingress-nginx 到达 pod；ingress-nginx 只放行 `/v1/conversation`：

| 问题 | 设计 |
| :--- | :--- |
| 工作负载 | 无状态的 Deployment |
| 容量 | 每个 Pod 在预启动的子进程中运行固定数量的会话，满时报告未就绪；数量由压测得出 |
| 扩缩容 | KEDA 按活跃会话数扩缩，不按 CPU：每个 pod 在 `/metrics` 报告 `voice_sessions_active`，由 Prometheus 求和 |
| 会话时长 | 由产品限制，初始为 20 分钟 |
| 发布与缩容 | 收到 `SIGTERM` 后，pod 拒绝新会话并等待运行中的会话；在此之前 `preStop` 短暂停顿，让流量先移走；`terminationGracePeriodSeconds` 为 25 分钟 |
| 安全 | PodDisruptionBudget、只允许 ingress-nginx 和 Prometheus 进入、并把出站限制为 DNS、API 服务器和公网 HTTPS 的 NetworkPolicy、密钥放在 Secret、以无特权用户运行在只读文件系统上 |
| 资源 | 只用 CPU，因为语音服务在云端 |

### 13.4 Cloudflare 服务

| 阶段 | 服务 | 用途 |
| :--- | :--- | :--- |
| 首个切片 | Workers | 网站的页面；英语本身由 API 服务器提供，不增加新产品 |
| 写作 | 无 | 学习者等待时在 API 服务器中判定，重试、租约和进度都保存在 `judgment` 表中，因此不需要 Workflow |
| 写作 | AI Gateway | 模型调用的日志、成本和限制；判定不缓存，未成年人的文本不写入日志 |
| 写作 | Rate Limiting | 限制滥用和成本 |
| 语音 | R2 | 题目音频，以及短期保存、由生命周期规则删除的录音 |
| 语音 | Workers AI | 语音转文字，前提是效果不差于供应商自己的 API |
| 对话 | 代理的 DNS | `voice.greatacademy.dev` 只经 Cloudflare 到达集群 |
| 对话 | WAF 和限流规则 | 保护语音域名 |
| 对话 | Realtime TURN | 仅在传输改为 WebRTC 时使用 |

### 13.5 本地开发

本地测试**只用容器，不用 Kubernetes**。

- `compose.yaml` 在 PostgreSQL 旁增加 `voice` 服务，由生产镜像构建，并连接宿主机上的 API 服务器（`pnpm nx run server:dev`）和网站。
- 测试用伪造的语音服务运行流水线；真实服务使用被忽略文件中的开发密钥。
- 排空的测试方式是在会话进行时停止容器：`SIGTERM` 必须拒绝新会话，并让运行中的会话结束。
- 配置在本地只渲染和校验（`mise run k8s:check`），首次运行在集群上。

### 13.6 构建前要确认

- `cf` 命令行能否声明 R2 生命周期规则和 AI 绑定。
- pi-ai 能否在 API 服务器中对接真实供应商。目前它只通过了模拟响应的测试，包括 Anthropic、OpenAI 和 Google 的流式工具调用。
- WebSocket 经 Cloudflare 代理和 ingress-nginx 能否在整个会话期间保持稳定。
- 距离希尔斯伯勒（集群唯一的区域）较远的学习者的延迟，上述测量必须覆盖这种情况。

## 14. 风险

- **方法在这里验证较少。** 尤其是理解可能无法从练习迁移。由外部测试决定。
- **内容成本。** 文章和题库需要人工审核，这是最大的成本。总量尚未估算。
- **AI 判定。** 准确性、成本和对供应商的依赖都是风险；§8 和 §9 的分层把 AI 用量控制在较小范围。
- **儿童数据。** 未成年人的录音和写作需要在每个市场做法务审查，以[未成年人数据](minors-data.zh-CN.md)为起点。

## 15. 参考文献

- Beck, I. L., McKeown, M. G., & Kucan, L. *Bringing Words to Life*.
- Council of Europe (2020). *Common European Framework of Reference for Languages: Learning, Teaching, Assessment. Companion Volume*.
- Gough, P. B., & Tunmer, W. E. (1986). Decoding, reading, and reading disability. *Remedial and Special Education*.
- Graham, S., & Perin, D. (2007). A meta-analysis of writing instruction for adolescent students. *Journal of Educational Psychology*, 99, 445–476.
- Hochman, J. C., & Wexler, N. *The Writing Revolution*.
- Hu, M., & Nation, P. (2000). Unknown vocabulary density and reading comprehension. *Reading in a Foreign Language*.
- Levis, J. M. (2005). Changing contexts and shifting paradigms in pronunciation teaching. *TESOL Quarterly*.
- Ministry of Education of the People's Republic of China (2020). *普通高中英语课程标准（2017年版2020年修订）*.
- Ministry of Education of the People's Republic of China (2022). *义务教育英语课程标准（2022年版）*.
- Nation, P. The four strands. *Innovation in Language Learning and Teaching*.
- National Governors Association Center for Best Practices & Council of Chief State School Officers (2010). *Common Core State Standards for English Language Arts & Literacy in History/Social Studies, Science, and Technical Subjects*.
- Recht, D. R., & Leslie, L. (1988). Effect of prior knowledge on good and poor readers' memory of text. *Journal of Educational Psychology*.
- Scarborough, H. S. (2001). Connecting early language and literacy to later reading (dis)abilities. In *Handbook of Early Literacy Research*.
- Schmitt, N., Jiang, X., & Grabe, W. (2011). The percentage of words known in a text and reading comprehension. *The Modern Language Journal*.

## 16. 逐条对照课程标准

学习者随时可能转去学校，所以每门课程教它的标准对本年级或本级别的要求，放在标准规定的位置，标准不要求的不教（§1）。本节把 CCSS ELA 从幼儿园到 12 年级的分年级标准与母语课程对照，把教育部两份英语课程标准的词汇表、语法项目、主题、语篇类型和阅读量与各级别对照，并列出补齐缺口的 topic 和改动。对标准只作概括，不作引用。

### 16.1 怎样读这张对照图

一条标准，topic 按它的要求练习了，算**覆盖**；只练了一部分，或者标准要求学习者产出（写、说、展示、研究）而我们只用选择题考识别，算**部分覆盖**；什么都没有练，算**缺口**。书写（L.K.1a、L.1.1a）无法在应用里检查，交给旁边的大人。小组讨论（SL.1）只能通过与 AI 导师的对话来接近。

本节之前英语共有 1,969 个 topic，没有一个按教学标准写成：没有 topic 有引入，讲解几乎都不以“注意”结尾。没有一门课程对照过学校的课程标准。

### 16.2 母语课程对照 CCSS

| 年级 | 标准条数 | 覆盖 | 部分覆盖 | 缺口 |
| :--- | ---: | ---: | ---: | ---: |
| 幼儿园 | 41 | 1 | 8 | 32 |
| 1 | 41 | 5 | 13 | 23 |
| 2 | 40 | 5 | 18 | 17 |
| 3 | 42 | 22 | 16 | 4 |
| 4 | 43 | 23 | 17 | 3 |
| 5 | 43 | 24 | 16 | 3 |
| 6 | 41 | 16 | 19 | 6 |
| 7 | 41 | 19 | 17 | 5 |
| 8 | 41 | 20 | 16 | 5 |
| 9、10 | 41 | 20 | 15 | 6 |
| 11、12 | 41 | 8 | 25 | 8 |
| **合计** | **455** | **163（36%）** | **180（40%）** | **112（25%）** |

语言和信息类文本阅读两部分最好。每个年级的缺口都集中在同几条标准：把文本和它的音频、影视或舞台版本比较（RL.7、RI.7），所读文本的范围和难度（第 10 条），发布与研究（W.6、W.7），以及展示（SL.4、SL.5）。

- **幼儿园**没有课程：听读文本的理解、文字概念、口头的语音意识，以及画、口述或写出一个观点、一些事实和一件事，全都缺。
- **1、2 年级**缺评判的写作（W.1 至 W.3）、口头合成和切分音素、五个元音组合以外的拼读（r 控元音、其余元音组合、软音 c 和 g、词尾、双音节词）、有语速和语调要求的计时朗读，以及大部分信息类文本阅读；许多语言条目晚了一年。
- **3 至 5 年级**基本齐全；缺研究项目、口头报告，4 年级的主题和关系代词（放在了 6 年级），以及多音节词的解码。
- **6 至 8 年级**的引证和客观概括晚了一年，戏剧和诗歌的形式晚了两年，还缺研究、展示和不同媒介的版本。
- **9 至 12 年级**没有读过一整部作品，也没有读过点名的文献；年级课程里没有长期研究论文和展示，MLA 格式放在 12 年级而不是 9、10 年级，43% 到 60% 的 topic 是词汇批次，其中有属于各级别的日常词汇和短语动词。

### 16.3 我们教了而 CCSS 并不要求的内容

- **晚了：** 关系代词和主题（CCSS 在 4 年级，我们在 6 年级），神话典故和文本结构（4 年级，我们在 5、6 年级），引证和客观概括（6 年级，我们在 7 年级），并列复合句（7 年级，我们在 8 年级），典故（7 年级，我们在 9 年级），戏剧和诗歌的形式（7 年级，我们在 9、10 年级），抄袭（7 年级，我们在 9 年级），MLA 格式（9、10 年级，我们在 12 年级），独立主格结构（9、10 年级，我们在 11 年级），以及幼儿园到 2 年级的几处语言和信息类阅读条目，都晚了一年。它们移到 CCSS 规定的年级。
- **早了：** 主动和被动语态与语气、并列形容词、错位修饰语、有争议的用法和连字符。它们保留，因为并无损失；CCSS 规定的那个年级另加一个复习它们的 topic。
- **不要求的：** `the-heros-journey` 和 `archetypes-in-stories` 删去；书信和职场文体、略读和扫读、体育专栏和新闻标题只作为 W.1 至 W.3 或 RI 的实例保留；9 年级的日常词汇和短语动词单元移到 B1 和 B2；10 至 12 年级背后没有阅读的词汇批次，换成本年级阅读所需的学术词汇和学科词汇。

### 16.4 跨年级的改动

- **幼儿园。** 新课程 `english-kindergarten`：文字概念、押韵和音节、首音与韵、分离和替换音素、听读故事和讲事实的文本、书的各部分、疑问词和介词、给词分类，以及画出并讲出一个观点、一些事实和一件事。
- **到 5 年级为止的基础读写技能。** `english-phonics` 增加口头合成和切分音素、听辨长短元音、词尾、r 控元音、其余元音组合、软音 c 和 g、双音节词和后缀；3 至 5 年级增加多音节词的解码；1 至 5 年级每个年级都计时朗读一篇本年级的文章，以每分钟读对的词数为目标。
- **难度和整部作品。** 每篇文章带一个按公开公式算出的可读性指标，每个年级一个区间，起初按 CCSS 的要求设定，之后校准；文章逐步加长到一章的篇幅；一个阅读单元可以是按顺序阅读的一整部作品。CCSS 点名作品的地方，读公版原文：8 年级读神话和圣经故事，9、10 年级读一整部莎士比亚剧本和美国的重要演讲，11、12 年级读美国建国文献、美国奠基时期的文学、《联邦党人文集》第 10 篇和一份 1929 年以前的最高法院判决书。
- **写作。** 1、2 年级增加三类简短的评判写作；从 3 年级起，每个年级都有分几次完成的研究项目，以及经过构思、起草、修改、发布的作文；篇幅从 W.4.6 至 W.6.6 起逐年增加。
- **听和说。** 每个年级增加口头报告或展示，从 6 年级起增加评价录音中的演讲者；这些要等语音评判（§9.1，S5 和 S6）。
- **幼儿园到 3 年级的插图。** 一部分插图承载内容，以便教插图补充了什么（RL.7、RI.7）。

### 16.5 各级别对照教育部课标

| 学段 | 累计词汇 | 累计课外阅读量 | 我们的级别 | 我们到该级别教了它的词表的多少 |
| :--- | ---: | ---: | :--- | ---: |
| 一级，3、4 年级 | — | 1,500 至 2,000 词 | Pre-A1 | — |
| 二级，5、6 年级 | 约 500 | 4,000 至 5,000 词 | A1 | 80% |
| 三级，7 至 9 年级 | 约 1,600 | 到 9 年级 15 万词 | A2 | 二级以外的词的 55% |
| 高中必修 | 2,000 至 2,100 | 本阶段 4.5 万词 | B1 | 到 B1 为其新词的 51% |
| 高中选择性必修 | 3,000 至 3,200 | 本阶段 10 万词 | B2 | 到 B2 为其新词的 54% |
| 高中选修（提高类） | 4,000 至 4,200 | — | C1，已汇合 | — |

这些比例是把两份课标的词表与我们的词汇 topic 所教的词相比得出的。学完 B2 以后，义务教育词表中仍有 296 个词没教，其中许多是基础词（activity、autumn、diary）或国家和民族的名称。词表用英式拼写，旁注美式拼写，两种都接受。

- **词汇。** A1 至 B2 每一级都学完本阶段的词表，按本阶段的主题分批；教育部词表不列词组，所以词组来自主题和文本。
- **语法。** 每个阶段的语法项目放在对应的级别；增加过去将来时（高中必修）、按短语成分分析长难句（高中选择性必修），以及给讲中文的学习者讲英语语法与汉语语法的不同。
- **主题和语篇类型。** 每一级的单元覆盖本阶段在课标三大主题语境下的主题，即人与自我、人与社会、人与自然，它的文章覆盖本阶段列出的语篇类型。
- **阅读量。** 每一级提供的阅读至少达到本阶段的要求（§5）。

### 16.6 新增的 topic

每个新 topic 从一开始就按教学标准写成：带自己实例的引入，用实例来讲、以“注意”结尾的讲解，分步骤、以检验结尾的解答，以及说明其他每个选项为什么错的选择题解答。**[J]** 表示由模型评判，**[S]** 表示需要语音评判。

- **幼儿园：** `concepts-of-print`、`rhyming-and-syllables-aloud` [S]、`onset-and-rime` [S]、`isolating-sounds-in-words` [S]、`changing-a-sound-to-make-a-word` [S]、`kindergarten-listening-<unit>`、`parts-of-a-book`、`storybook-or-poem`、`question-words`、`common-prepositions`、`sorting-words-into-groups`、`drawing-and-telling-an-opinion` [J]、`drawing-and-telling-facts` [J]、`drawing-and-telling-what-happened` [J]。
- **自然拼读：** `blending-and-segmenting-sounds` [S]、`long-or-short-vowel`、`reading-words-with-endings`、`spelling-words-with-endings`、`reading-r-controlled-vowels`、`spelling-r-controlled-vowels`、`reading-more-vowel-teams`、`spelling-more-vowel-teams`、`soft-c-and-g`、`reading-two-syllable-words`、`reading-words-with-suffixes`；1 至 5 年级各有 `reading-a-passage-fluently-grade-<n>` [S]，3 至 5 年级有 `reading-multisyllable-words`。
- **1 年级：** `central-message-of-a-story`、`words-for-feelings-and-senses`、`who-is-telling-the-story`、`comparing-two-characters-experiences`、`how-two-things-are-connected`、`headings-and-table-of-contents`、`pictures-or-words`、`reasons-an-author-gives`、`two-texts-same-or-different`、`writing-an-opinion-sentence` [J]、`writing-facts-about-a-topic` [J]、`writing-what-happened` [J]、`verbs-that-match-the-naming-word`、`joining-with-but-or-so-because`、`words-that-tell-where-and-when`、`commands-and-exclamations`、`commas-in-dates-and-lists`、`using-the-sentence-to-find-meaning`、`endings-that-change-a-word`、`sorting-and-defining-words`、`look-peek-and-stare`、`describing-with-details` [S]；下移到本年级的：虚构与非虚构、主要话题、所有格、加 -ed 的过去时、this 和 that。
- **2 年级：** `sound-and-rhythm-in-poems`、`characters-see-it-differently`、`the-focus-of-each-paragraph`、`why-the-author-wrote-it`、`reading-a-diagram`、`reasons-that-support-a-point`、`writing-an-opinion-with-reasons` [J]、`writing-a-how-to-or-report` [J]、`writing-a-story-with-an-ending` [J]、`fixing-my-sentences`、`capitals-for-holidays-and-places`、`rearranging-a-sentence`、`telling-about-an-experience` [S]；下移到本年级的：故事的道理、一个故事的两个版本、操作步骤、文本特征、同一话题的两篇文本、集合名词、反身代词、形容词和副词、复合词、上下文线索、词典和词汇表、正式和非正式英语。
- **3 年级：** `my-view-and-the-narrators`、`my-view-and-the-authors`、`stories-in-a-series`、`what-the-pictures-add`、`spoken-and-written-english`、`a-short-research-project-grade-3` [J]、`giving-a-short-report` [S]。
- **4 年级：** `relative-pronouns-and-adverbs`、`writing-a-one-page-report` [J]、`a-short-research-project-grade-4` [J]、`presenting-a-report-grade-4` [S]；下移到本年级的：主题、源自人名和神话的词、文本结构。
- **5 年级：** `theme-of-a-story-or-poem`、`figurative-language-in-context`、`how-the-narrator-shapes-events`、`pictures-and-media-in-a-story`、`dialects-and-registers-in-stories`、`a-research-project-from-several-sources` [J]、`presenting-an-opinion` [S]。
- **6 年级：** `citing-several-pieces-of-evidence`（7 年级的加深版）、`reading-and-hearing-a-story`、`information-in-several-media`、`how-a-scene-or-stanza-fits`、`nonstandard-and-standard-english`、`checking-a-word-in-a-dictionary`、`word-relationships`、`a-short-research-project-grade-6` [J]、`following-a-speakers-argument`、`presenting-claims-and-findings` [S]；下移到本年级的：引用文本证据、客观概括。
- **7 年级：** `how-a-sonnet-or-soliloquy-works`、`a-story-and-its-film`、`a-basic-citation`、`a-research-project-with-follow-up-questions` [J]、`delivering-a-persuasive-speech` [S]；下移到本年级的：句子种类（加上并列复合句）、典故、同一话题的文本比较、避免抄袭。
- **8 年级：** `comparing-the-structure-of-two-texts`、`theme-in-plot-and-character`、`analogies-and-allusions-in-word-choice`、`print-or-video-or-audio`、`connotation-and-denotation`、`a-research-project-grade-8` [J]、`evaluating-a-speakers-argument`、`presenting-an-argument` [S]；RL.8.9 的神话和圣经故事读公版文本。
- **9、10 年级：** `reading-a-seminal-us-speech`、`a-text-in-two-mediums`、`how-an-author-transforms-a-source`、`reading-a-whole-play`、`a-sustained-research-paper-grade-10` [J]、`evaluating-a-recorded-speech`、`presenting-findings-grade-10` [S]；下移到本年级的：说明文、MLA 和 APA 引用格式、独立主格结构；移到各级别的：9 年级的日常词汇和短语动词单元。
- **11、12 年级：** `reading-a-founding-document-in-full`、`reading-the-federalist`、`reasoning-in-a-supreme-court-opinion`、`foundational-american-literature`、`writing-about-american-literature` [J]、`two-productions-of-a-play`、`how-an-ending-shapes-a-work`、`themes-that-interact`、`understatement-and-sarcasm`、`figures-of-speech-and-their-role`、`hyphenation-conventions`、`a-sustained-research-paper-grade-12` [J]、`presenting-a-perspective` [S]、`presenting-with-digital-media` [S]；上移到本年级的：有争议的用法。
- **各级别：** 学完各阶段词表的词汇批次；`the-future-in-the-past`、`analyzing-long-sentences`、`english-and-chinese-grammar-compared`。

比较一部剧的不同演出，或把文本和它的电影比较，需要我们有权使用的录像；在有录像之前，这些 topic 把文本和一份演出的文字描述相比较。
