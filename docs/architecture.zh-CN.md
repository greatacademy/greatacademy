# Great Academy 架构

> [English](architecture.md) | 简体中文

Great Academy 是一个自适应学习平台，基于 [The Math Academy Way](the-math-academy-way.zh-CN.md) 所描述的机制：
- 由细粒度知识点构成的知识图谱；
- 掌握学习；
- 层级间隔重复系统（FIRe）；
- 自适应诊断；
- XP 激励机制。

平台为多学科设计，第一个实现的学科是数学。

本文描述已实现的系统：技术选型、仓库结构、依赖方向，以及各部分如何协作。算法规格见[学习引擎](learning-engine.zh-CN.md)，内容格式见[内容](content.zh-CN.md)。

---

## 1. 原则

1. **每个学科一张知识图谱，课程只是视图。**
   - 知识点（topic）、边和 knowledge point 只编写一次。
   - 课程是知识点的有序选取，按单元、模块分组展示，并附带掌握下限（mastery floor）。
   - 引擎只在图谱上运行，从不在课程上运行（[数学课程体系 §4](math-curriculum.zh-CN.md#4-结构与复用分析)）。
2. **核心与学科无关。** 引擎、存储和 API 中没有任何数学专属逻辑。
   - 一个学科提供三样东西：内容（知识点、课程）、答案判定器和渲染器。
   - 数学是第一个学科包。
3. **绝不降低标准。** 以下是书中的教学法规则，由引擎强制执行，而不是交给界面决定：
   - knowledge point 只能通过实际表现来通过；
   - 学生不能编辑自己的知识画像；
   - 诊断之外没有"我不会"按钮。
4. **事件日志优先。** 每次作答、每个任务、每次诊断应答，都追加写入不可变的事件日志。
   - 学生模型（重复状态、能力、XP）是派生状态，可以用引擎重放日志来重建。
   - 因此修改引擎参数只需重放，不需要数据迁移。
5. **一种语言，处处共享。**
   - 全部代码使用 TypeScript。
   - 引擎和内容运行时都是没有 I/O 的纯函数，同一份代码运行在 Worker、浏览器、移动端、测试和离线模拟中。
6. **内容即代码。**
   - 知识点、knowledge point 和题目生成器都是 TypeScript 模块，通过 git 评审。
   - 发布前由编译器校验图谱。

## 2. 技术选型

| 领域 | 选型 | 说明 |
| :--- | :--- | :--- |
| 语言 | **TypeScript 7**（原生 `tsc`）、ES2024、仅 ESM | 全部开启严格模式 |
| Monorepo | **pnpm workspaces + Nx**（推断目标、本地缓存） | 工具版本由 **mise** 固定 |
| Lint / 格式化 | **Biome** | 一个工具，根目录一份配置 |
| 测试 | **Vitest** | 每个库都有单元测试；集成测试使用 PGlite |
| 契约 / RPC | **Protobuf + buf + Connect**（`protobuf-es` v2、`connect-es` v2）、`protovalidate` | Web 与移动端共用一份契约；移动端走 JSON 传输 |
| Web 应用 | **TanStack Start**（Router、Query、Form），运行于 **Cloudflare Workers**；**React 19** | 用 Cloudflare 的 **`cf`** 命令行构建、运行和部署，不用 wrangler |
| UI | **Base UI**、**Tailwind CSS v4**、Phosphor 图标 | 设计 token 来自 `libs/design` |
| 数学渲染 / 输入 | **KaTeX**（渲染）、**MathLive**（输入）、**Compute Engine**（解析学生答案） | 封装在 `libs/math-ui`；移动端通过 Expo DOM components 复用 |
| 账户 | **better-auth**（邮箱 + 密码，之后加 passkey），运行在 Worker 中 | Web 与移动端共享会话（bearer token） |
| 数据库 | **PostgreSQL 17**，Worker 通过 **Hyperdrive** 访问；**Drizzle ORM** + drizzle-kit 迁移 | 测试中用 **PGlite**；开发时用 OrbStack 中的 `postgres:17-alpine` 容器 |
| 移动端 | **Expo**（最新 SDK）、Expo Router、TanStack Query、**Uniwind**（React Native 版 Tailwind v4） | 与 Web 共用契约和 token |
| 对象存储 | **R2** | 内容中的图片；生成的图形是内嵌 SVG（[内容 §4](content.zh-CN.md#4-knowledge-point-与生成器)） |

## 3. 仓库结构

```text
apps/web/             TanStack Start on Workers：页面、better-auth，并把 libs/api 挂载在 /api 下
apps/mobile/          Expo 应用（iOS、Android）
libs/proto/           契约：proto/ga/<domain>/v1/*.proto、buf 配置、gen/（生成代码，提交入库）
libs/api/             Connect 服务实现与会话执行器；与传输方式和宿主无关
libs/engine/          学习引擎：图谱、知识前沿、FIRe、任务选择、诊断、XP、测验（纯函数）
libs/content/         内容模型：知识点/课程定义、编译器与校验器、题目运行时、答案判定
libs/subject-math/    数学学科：数学答案判定器、数学题目生成器的辅助函数
libs/db/              Drizzle schema、迁移和仓储（PostgreSQL）
libs/design/          设计 token、文案（en、zh-CN），以及为 Web 和移动端生成的形式
libs/math-ui/         React 组件：数学渲染与数学输入
content/math/         编写的数学内容：知识点、课程
tools/simulate/       模拟学生，用于调参和检验引擎
tools/catalog/        参考目录（Math Academy 课程骨架），用于规划内容
docs/                 文档（英文 + 简体中文）
```

### 3.1 依赖方向

```text
apps/web ──► libs/api ──► libs/db ──► libs/engine ──► libs/content
   │            │                                       ▲
   │            └──► libs/proto                         │
   ├──► libs/math-ui ──► libs/design             libs/subject-math ◄── content/math
   └──► content/math
apps/mobile ──► libs/proto, libs/design, libs/math-ui
tools/simulate ──► libs/engine, content/math
```

- `libs/content` 不依赖仓库内任何库，它定义所有学科都要实现的类型。
- `libs/engine` 只依赖 `libs/content` 的类型。它没有 I/O、没有时钟（时间作为参数传入），也没有随机性（种子作为参数传入）。
- `libs/subject-math` 只依赖 `libs/content`。
- `content/<subject>` 依赖 `libs/content` 和对应的学科库。
- `libs/api` 基于 `libs/db` 和引擎实现服务，但不知道宿主：请求的用户和数据库客户端以 Connect context value 传入，时钟和种子通过注入提供。它的测试在 PGlite 上端到端地运行服务。
- 只有 `apps/*` 负责把存储、传输、认证和内容装配到一起。

## 4. 领域模型

| 实体 | 含义 |
| :--- | :--- |
| Subject（学科） | 拥有自己知识图谱的一个学习领域：先是 `math`，之后扩展其他学科 |
| Topic（知识点） | 一个可教的概念，一节约 10–30 分钟的课；图谱中的节点 |
| Knowledge point（KP） | 知识点中的一步：讲解、例题、题目生成器；每个知识点 2–4 个 |
| 先修边 | 知识点 → 它所需要的知识点；决定知识前沿 |
| 关键先修 | KP → 知识点：该 KP 最直接依赖的早期技能；驱动补救 |
| 包含边 | 知识点 → 更简单的知识点，权重 0–1：高级知识点隐式练习了多少简单知识点；驱动 FIRe |
| Course（课程） | 按单元和模块分组的有序知识点，附带掌握下限 |
| Learner（学习者） | 学习的人（一个用户账户，之后也包括家长管理的孩子档案） |
| Enrollment（选课） | 某学习者在某课程中 |
| Topic state（知识点状态） | 学习者在某知识点上的重复状态（派生数据） |
| Task（任务） | 学习者任务面板上的课程、复习、测验或诊断 |
| Event（事件） | 不可变记录：任务开始、提交答案、任务完成、诊断作答 |

内容的完整模型见[内容](content.zh-CN.md)，派生的学习者状态定义见[学习引擎](learning-engine.zh-CN.md)。

## 5. 请求流程

1. 客户端调用 `/api/rpc/ga.<domain>.v1.*` 下的 Connect 服务。Web 端携带会话 cookie，移动端携带 bearer token。better-auth 本身位于 `/api/auth/*`。
2. Worker 用 better-auth 完成认证，再通过 Hyperdrive 从 PostgreSQL 读取学习者状态。每个请求使用独立的数据库客户端。
3. 服务调用引擎，传入：
   - 学科图谱（编译后的内容打包进 Worker，并按 isolate 缓存）；
   - 学习者状态；
   - 当前时间。
4. 引擎返回新状态和需要记录的事件。服务在同一个事务中写入两者，然后返回响应。

任务以**会话**的方式进行，每个请求一道题（先 `StartTask`，再反复 `SubmitAnswer` 直到得出结果）。会话执行器（`libs/api/src/runner.ts`）是建立在引擎的课程、复习、测验和诊断规则之上的纯状态机。它的状态只保存题目引用（知识点、学习点、种子），从不保存题目本身。

题目实例在服务端由种子生成，也在服务端判分。答案在提交之前绝不发送给客户端。

Web 应用（`apps/web`）只有一个兜底的服务端路由 `/api/$`，把请求交给 `src/server/handler.ts`。页面在服务端渲染时不含学习者数据，在浏览器中通过 Connect 客户端和 TanStack Query 获取，因此页面在服务端从不需要会话。页面语言在服务端决定（`ga-locale` cookie，否则看 `Accept-Language`），所以首屏即为该语言。

## 6. 部署

- **生产：**
  - 一个 Worker（`apps/web`），用 `cf deploy` 部署，通过 Hyperdrive 绑定托管 PostgreSQL，通过 R2 绑定存放媒体。
  - 部署前用 drizzle-kit 执行迁移。
- **开发：**
  - `cf dev` 通过 Vite 在 workerd 中运行 Worker。
  - 它连接 OrbStack 中 `postgres:17-alpine` 容器里的 PostgreSQL，详见[开发指南](development.zh-CN.md)。
- **移动端：** 用 Expo 构建（EAS），调用同一套 API。

## 7. 存储

| 表 | 内容 |
| :--- | :--- |
| `user`、`session`、`account`、`verification` | better-auth 的核心 schema |
| `learner` | 学习的人；目前每个用户一个 |
| `enrollment` | 学习者选修某课程 |
| `event` | 每位学习者每个学科的引擎事件日志，用 `seq` 连续编号；保留 `xp` 用于报表 |
| `learner_state` | 日志折叠到 `seq` 为止的快照；可通过重放重建 |
| `task_session` | 会话及其执行器状态；每位学习者每门课程最多一个进行中 |
| `answer` | 每个判定过的作答：题目引用、作答、判定 |

**一致性。**
- 完成一个会话时，追加事件、替换快照、关闭会话在同一个事务中完成。
- 为写入而读取快照行和会话行时会加锁（`SELECT … FOR UPDATE`）；`(learner, subject, seq)` 唯一索引拒绝任何漏网的写入者。
- `SubmitAnswer` 携带所回答题目的序号，重复的请求会被拒绝，而不是被判两次。

**迁移**由 drizzle-kit 从 `libs/db/src/schema` 生成到 `libs/db/drizzle` 并提交入库。测试把迁移应用到 PGlite；部署时用 `pnpm nx run db:migrate` 应用。
