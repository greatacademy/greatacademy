# AGENTS.md

> [English](AGENTS.md) | 简体中文

本文是 AI 编码代理和贡献者的工作指南，只概括规则，细节见下列文档。本文与这些文档冲突时，以文档为准，并应修正本文。

| 文档 | 内容 |
| :--- | :--- |
| [docs/architecture.zh-CN.md](docs/architecture.zh-CN.md) | 技术选型、仓库结构、依赖方向、领域模型、请求流程、部署 |
| [docs/content.zh-CN.md](docs/content.zh-CN.md) | 内容模型与编写：知识点、knowledge point、生成器、判定器、课程、编译器 |
| [docs/learning-engine.zh-CN.md](docs/learning-engine.zh-CN.md) | 引擎的算法与参数：知识前沿、FIRe、任务选择、课程、复习、测验、诊断、XP |
| [docs/development.zh-CN.md](docs/development.zh-CN.md) | 工具链、命令、本地数据库、运行应用 |
| [docs/roadmap.zh-CN.md](docs/roadmap.zh-CN.md) | 阶段、完成标准、状态、风险 |
| [docs/math-curriculum.zh-CN.md](docs/math-curriculum.zh-CN.md) | 完整数学课程体系的参考目录（37 门课），即内容规划依据 |
| [docs/the-math-academy-way.zh-CN.md](docs/the-math-academy-way.zh-CN.md)、[docs/math-academy-website.zh-CN.md](docs/math-academy-website.zh-CN.md) | 设计所依据的研究笔记 |

## 项目概述

Great Academy 是面向多学科的自适应学习平台，从数学开始。全部代码使用 TypeScript：运行在 Cloudflare Workers 上的 Web 应用、Expo 移动应用，以及内容和学习引擎的纯函数库。

## 目录结构

```text
apps/web/            TanStack Start on Cloudflare Workers：页面、Connect API、better-auth
apps/mobile/         Expo 应用
libs/content/        内容模型、编译器、题目运行时、判定器（与学科无关）
libs/engine/         学习引擎（纯函数，与学科无关）
libs/subject-math/   数学判定器和生成器辅助函数
libs/proto/          Protobuf 契约与生成的 TypeScript
libs/db/             Drizzle schema、迁移、仓储
libs/design/         设计 token 与文案
libs/math-ui/        数学渲染与输入组件
content/math/        数学内容
tools/simulate/      模拟学生
tools/catalog/       参考课程目录
```

## 命令

工具版本由 `mise.toml` 固定；`pnpm nx` 在 `mise exec` 下运行 Nx。

```bash
mise install
pnpm install
pnpm nx run-many -t typecheck test lint    # 检查全部
pnpm nx affected -t typecheck test lint    # 只检查受影响的项目
pnpm format                                # 用 Biome 格式化并修复
```

每个包都在 `package.json` 的 scripts 中声明目标（`typecheck`、`test`、`lint`，需要时还有 `build`、`generate`、`dev`），由 Nx 推断。

## TypeScript 约定

- 只用 ESM，开启 `strict`、`noUncheckedIndexedAccess`、`verbatimModuleSyntax`、`erasableSyntaxOnly`（不用 enum、namespace 和参数属性，使 Node 能直接运行源码）；导入本地文件时带 `.ts` 扩展名。
- 库直接导出源码（`"exports": { ".": "./src/index.ts" }`），库没有构建步骤。
- 依赖版本精确固定（`savePrefix: ''`）。
- 每个导出的标识符都有以其名称开头的文档注释。
- `libs/content`、`libs/engine`、`libs/subject-math` 是纯的：不做 I/O，不调用 `Date.now()`，不调用 `Math.random()`。时间和种子都作为参数传入。
- 核心代码从不提及具体学科。学科专属逻辑放在 `libs/subject-<id>` 和 `content/<id>` 中。
- 用 Biome（`biome.json`）格式化和 lint，不要引入 Prettier 或 ESLint。
- 不要把函数命名为 `fit`、`fdescribe` 之类：Biome 的 `noFocusedTests` 会把对它的调用当作聚焦测试报错。

## 内容约定

- 每段用户可见的文字都有英文和简体中文（`t(en, zh)`），编译器会拒绝缺少语言的文字。
- 知识点、knowledge point 和课程的 id 使用 kebab case，一经发布不得更改，因为学习者状态引用它们。
- 每个生成器都是确定性的，在 `wrong` 中列出常见错误答案，并通过 `sampleGenerators` 检查（由各内容包的测试运行）。
- 绝不降低标准：不给泄露答案的提示；需要的铺垫放进讲解、例题和额外的 knowledge point。

## 测试约定

- 全部使用 Vitest，测试文件以 `*.test.ts` 放在代码旁边。
- 引擎规则用显式的时间和种子测试，没有测试依赖真实时钟。
- 数据库测试运行在 PGlite 上，不需要启动任何服务器。

## 文档

- 每篇文档都有英文版（`<name>.md`）和简体中文版（`<name>.zh-CN.md`），逐节对应，并在开头互相链接。两种语言在同一个提交中修改。
- 文档只描述已采用的设计。
- 修改架构、技术选型或依赖方向时，更新 [docs/architecture.zh-CN.md](docs/architecture.zh-CN.md) 和本文；修改引擎行为或参数时，更新 [docs/learning-engine.zh-CN.md](docs/learning-engine.zh-CN.md)；修改内容模型时，更新 [docs/content.zh-CN.md](docs/content.zh-CN.md)；完成一个阶段时，更新 [docs/roadmap.zh-CN.md](docs/roadmap.zh-CN.md)。

## 提交

- 直接在 `main` 上提交，不加 Co-Authored-By 行。
- 使用 Conventional Commits，以 Nx 项目名作为 scope：`feat(engine): …`、`build: …`、`docs: …`。
- 每个提交只做一件事；提交前 `pnpm nx affected -t typecheck test lint` 必须通过。
