# 中文写作的校准种子集

> [English](README.md) | 简体中文

一条模型路线要评判某条中文写作标准，必须先在至少 100 篇打过分的文本上与两位教师一致（[docs/development.zh-CN.md](../../../docs/development.zh-CN.md)，`tools/calibrate`）。这些文件是教师首先打分的种子集：每个 AI 评判的主题一个文件，每行是针对该主题某个任务的一篇学习者文本。

这些文本由模型为本内容包撰写，模仿学习者的写法：母语课程和高考模仿相应年级的中国学生，各级和 HSK 模仿相应水平的外国学习者。没有一篇是真实学习者的文本，也没有一篇抄自教材、试题或已发表的作品。每篇文本都有意满足或不满足它的每条标准：约三分之一好、三分之一中等、三分之一差，其中有难判的情况，比如流畅的文本恰好差一条标准，笨拙的文本仍满足某条标准。

每行包含 `tools/calibrate` 读取的字段 `id`、`task`、`text` 和 `scores`，另有三个它忽略的字段：

- `quality`：好、中等或差（good、middling、poor）。
- `intended`：对每条标准 `id@version`，写作时是否有意满足它。
- `ai`：另一个模型只根据任务和标准的问题盲评得出的答案。
- `note`：这篇文本做了什么，以及每条未满足的标准为何未满足。

`scores` 为空：两位教师各对每条标准给出是或否，写成 `{"<id@version>": [第一位, 第二位]}`。`intended` 和 `ai` 是 AI 给出的标签，不是分数：它们提示教师该看哪里，从不代替教师。

## 规模与初步一致率

47 个文件共 432 篇文本，在 126 条标准上有 1008 个标签。盲评模型与预期标签一致的有 974 个（96.6%）。分歧最大的标准如下，附该标准标签上的 Cohen's kappa，应最先检查其问题是否清楚：

| 标准 | 标签数 | 一致 | Kappa |
| :--- | ---: | ---: | ---: |
| `zh10-comment-event@1` | 3 | 2 | 0.40 |
| `zh6-argue-evidence@1` | 3 | 2 | 0.40 |
| `zh9-story-thread@1` | 3 | 2 | 0.40 |
| `zhl3-opinion-language@1` | 18 | 14 | 0.48 |
| `zhl2-day-language@1` | 12 | 9 | 0.50 |
| `zhl7-review-work@1` | 5 | 4 | 0.62 |
| `zhl4-explain-language@1` | 18 | 15 | 0.62 |
| `zh10-comment-view@1`、`zh8-explain-feature@1`、`zhl2-day-details@1` | 各 6 | 各 5 | 0.67 |
| `zhgk-info-points@1` | 12 | 10 | 0.68 |

低级别的语言标准（"常用了"、"把地点放在动词后"）没有写明标准线。把两项检查合在一个问题里的标准很难只差其中一项：`zhl4-trip-order@1`、`zhl5-letter-language@1`、`zhl7-review-work@1` 和 `zhl8-problem-proposals@1`。`hsk-word-use@1` 与 `hsk-word-grammar@1` 重叠，`zhgk-fill-content@1` 与 `zhgk-fill-fit@1` 重叠。这样的问题在校准路线之前可能需要改写，作为新版本。

## 还要做的

- 两位教师给每一行打分：母语和高考主题由语文教师打分，各级和 HSK 由国际中文教师打分。
- 增加文本，最好是经同意收集的真实学习者文本（[docs/minors-data.zh-CN.md](../../../docs/minors-data.zh-CN.md)），直到每条标准有 100 篇。长主题这里只有六篇，有些标准不足十个标签。
- `hsk-7-9-writing` 每条标准只有两个任务，因此每条标准只满足一次、未满足一次。
- HSK 7–9 的图表写作、议论文和翻译的九条标准还没有种子集。
