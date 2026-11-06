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
| 邮件 | **Resend**，Worker 通过 HTTP 调用，使用密钥 `RESEND_API_KEY` 和 `EMAIL_FROM` | 密码重置和邮箱验证，含两种语言；Worker 不需要 SMTP 客户端 |
| 数据库 | **PostgreSQL 17**，Worker 通过 **Hyperdrive** 访问；**Drizzle ORM** + drizzle-kit 迁移 | 测试中用 **PGlite**；开发时用 OrbStack 中的 `postgres:17-alpine` 容器 |
| 移动端 | **Expo**（最新 SDK）、Expo Router、TanStack Query、**Uniwind**（React Native 版 Tailwind v4） | 与 Web 共用契约和 token |
| 对象存储 | **R2** | 内容中的图片；生成的图形是内嵌 SVG（[内容 §4](content.zh-CN.md#4-knowledge-point-与生成器)） |

## 3. 仓库结构

```text
apps/web/             TanStack Start on Workers：页面、better-auth，并把 libs/api 挂载在 /api 下
apps/math-workers/    提供数学内容的 Worker：一个网关和它的分片（§6.1）
apps/mobile/          Expo 应用（iOS、Android）
libs/proto/           契约：proto/ga/<domain>/v1/*.proto、buf 配置、gen/（生成代码，提交入库）
libs/api/             Connect 服务实现与会话执行器；与传输方式和宿主无关
libs/engine/          学习引擎：图谱、知识前沿、FIRe、任务选择、诊断、XP、测验（纯函数）
libs/content/         内容模型：知识点/课程定义、编译器与校验器、题目运行时、答案判定
libs/subject-math/    数学学科：数学答案判定器、数学题目生成器的辅助函数
libs/subject-worker/  任何学科的网关和分片都由它的 Worker 入口构成
libs/db/              Drizzle schema、迁移和仓储（PostgreSQL）
libs/design/          颜色 token、配色和外观模型（§8），以及为 Web 和移动端生成的形式
libs/math-ui/         React 组件：数学渲染与数学输入
content/math/         编写的数学内容：知识点、课程
tools/simulate/       模拟学生，用于调参和检验引擎
tools/audit/          内容审计：大纲覆盖和启发式质量检查
tools/pilot/          试点报告：根据作答和事件日志，找出真实学习者卡住的地方
tools/catalog/        参考目录（Math Academy 课程骨架），用于规划内容
docs/                 文档（英文 + 简体中文）
```

### 3.1 依赖方向

```text
apps/web ──► libs/api ──► libs/db ──► libs/engine ──► libs/content
   │            │                                       ▲
   │            └──► libs/proto                         │
   ├──► libs/design
   ├──► libs/math-ui ──► libs/design             libs/subject-math ◄── content/math
   └╌╌► apps/math-workers（仅开发时，用来一起运行）
apps/math-workers ──► libs/subject-worker ──► libs/content
   └──► content/math, libs/subject-math
apps/mobile ──► libs/proto, libs/design, libs/math-ui
tools/simulate ──► libs/engine, content/math
tools/audit ──► libs/content, content/math
tools/pilot ──► libs/db, libs/engine, content/math
```

- `libs/content` 不依赖仓库内任何库，它定义所有学科都要实现的类型。
- `libs/engine` 只依赖 `libs/content` 的类型。它没有 I/O、没有时钟（时间作为参数传入），也没有随机性（种子作为参数传入）。
- `libs/subject-math` 只依赖 `libs/content`。
- `libs/design` 不依赖仓库内任何库，也没有 I/O，因此 Web 和移动端可以共用。
- `content/<subject>` 依赖 `libs/content` 和对应的学科库。
- `libs/api` 基于 `libs/db` 和引擎实现服务，但不知道宿主：请求的用户和数据库客户端以 Connect context value 传入，时钟和种子通过注入提供。它的测试在 PGlite 上端到端地运行服务。
- `libs/subject-worker` 是唯一引入 Workers 运行时的库，它不知道任何具体学科。
- 只有 `apps/*` 负责把存储、传输、认证和内容装配到一起。Web Worker 不引入内容，而是通过服务绑定访问学科。

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
| Learner（学习者） | 学习的人，有一个用户账户 |
| Guardian（监护人） | 受学习者邀请、能查看其情况并设定其目标的用户 |
| League group（联赛小组） | 同一段位中一周内竞争的最多 30 名学习者 |
| Enrollment（选课） | 某学习者在某课程中 |
| Topic state（知识点状态） | 学习者在某知识点上的重复状态（派生数据） |
| Task（任务） | 学习者任务面板上的课程、复习、测验或诊断 |
| Event（事件） | 不可变记录：任务开始、提交答案、任务完成、诊断作答 |

内容的完整模型见[内容](content.zh-CN.md)，派生的学习者状态定义见[学习引擎](learning-engine.zh-CN.md)。

## 5. 请求流程

1. 客户端调用 `/api/rpc/ga.<domain>.v1.*` 下的 Connect 服务。Web 端携带会话 cookie，移动端携带 bearer token。better-auth 本身位于 `/api/auth/*`。
2. Worker 用 better-auth 完成认证，再通过 Hyperdrive 从 PostgreSQL 读取学习者状态。每个请求使用独立的数据库客户端。
3. 服务调用引擎，传入：
   - 学科图谱（从学科的 manifest 读取，并按 isolate 缓存）；
   - 学习者状态；
   - 当前时间。
4. 引擎返回新状态和需要记录的事件。服务在同一个事务中写入两者，然后返回响应。

任务以**会话**的方式进行，每个请求一道题（先 `StartTask`，再反复 `SubmitAnswer` 直到得出结果）。会话执行器（`libs/api/src/runner.ts`）是建立在引擎的课程、复习、测验和诊断规则之上的纯状态机。它的状态只保存题目引用（知识点、学习点、种子），从不保存题目本身。 已结束的会话仍可阅读：`ListSessions` 列出学习者在一门课程中已结束的会话，`GetSession` 重新打开其中一个，显示题目、作答和解答。`GetTopic` 返回课程中任一主题的课文、由种子生成的新例题，以及它依赖和通向的主题，学习者可以随时重读课文；阅读不改变学习者状态。

题目实例在服务端由种子生成，也在服务端判分，都在学科的分片 Worker 中进行（§6.1）。答案在提交之前绝不发送给客户端。

Web 应用（`apps/web`）只有一个兜底的服务端路由 `/api/$`，把请求交给 `src/server/handler.ts`。页面在服务端渲染时不含学习者数据，在浏览器中通过 Connect 客户端和 TanStack Query 获取，因此页面在服务端从不需要会话。页面语言在服务端决定（`ga-locale` cookie，否则看 `Accept-Language`），所以首屏即为该语言。

`/` 取决于访问者。未登录时是落地页，落地页也可通过 `/landing` 供所有人访问，并在服务端渲染。登录后，打开最近学习的课程的下一个任务；没有课程但有监护学习者的账号转到 `/guardian`，其他没有课程的账号会被问到谁来学习。服务端只凭会话 cookie 就能在两者之间选择，所以已登录的学习者不会看到落地页闪现。课程目录是单独的公开页面 `/courses`。

监护人读取学习者数据时，使用与学习者相同的只读调用：`GetDashboard`、`GetCourseProgress` 和 `ListSessions` 接受可选的 `learner_id`，只有调用者关注了该学习者才生效。会改变数据的调用不接受 `learner_id`，监护人也不能打开会话，所以学习者的答案只属于学习者自己。

## 6. 部署

- **生产：**
  - Web Worker（`apps/web`），用 `cf deploy` 部署，通过 Hyperdrive 绑定托管 PostgreSQL，通过 R2 绑定存放媒体，并通过服务绑定连接每个学科的网关 Worker。
  - 每个学科的 Worker（§6.1）先于 Web Worker 部署，分片先于网关，因为服务绑定指向的 Worker 必须已经存在。
  - 部署前用 drizzle-kit 执行迁移。
- **开发：**
  - `cf dev` 通过 Vite 在 workerd 中运行 Worker。
  - 它连接 OrbStack 中 `postgres:17-alpine` 容器里的 PostgreSQL，详见[开发指南](development.zh-CN.md)。
- **移动端：** 用 Expo 构建（EAS），调用同一套 API。

### 6.1 学科作为 Worker

生成器是代码，所以内容不能当作数据加载。Worker 在两种计划下都有限制：未压缩体积 64 MiB，全局作用域须在 1 秒内执行完，每个 isolate 内存 128 MB。全部数学未压缩约 29 MB，各分片在 Node 下的加载时间相加约 460 毫秒，后续还要增加更多学科，放在一个 Worker 里会触及这些限制。因此学科运行在各自的 Worker 中：

```text
Web Worker ──服务绑定──► 学科网关 ──服务绑定──► 学科分片
 Registry                manifest、路由          生成器、判定器
```

- **Web Worker** 不含内容。它为每个学科绑定一个网关（`SUBJECT_MATH`），绑定列表在 `apps/web/src/server/handler.ts` 中。新增学科只需部署它的 Worker 并增加一个绑定。
- **网关**实现 `libs/content` 的 `SubjectGateway`：`listing`（课程列表，很小）、`manifest`（不含代码的学科，构建时由 `subjectManifest` 生成），以及 `SubjectSource` 的 `problems`、`lesson`、`judge`，由 `routeSource` 转给持有该 topic 的分片。
- **分片**持有学科中一部分 topic 的定义，用 `topicSource` 实现 `SubjectSource`。这些定义在第一次调用时才构建，不在启动时构建。
- **`Registry`**（`libs/api`）每个 isolate 读取一次课程列表，这足以列出课程；某门课程第一次被使用时才加载该学科的 manifest。它只保留最近使用的两个学科，因为数学建好索引后约占 45 MB 内存，而一个 isolate 只有 128 MB。课程的 scope 在第一次使用时才计算。

数学有五个分片，各对应课程体系的一段（`content/math/src/shards/`）。`apps/math-workers/gen/` 存放生成的 manifest 和每个分片的 topic 列表，不提交到仓库。

| Worker | 未压缩体积 | Node 下的模块加载时间 |
| :--- | :--- | :--- |
| `ga-web` | 6.8 MB | |
| `ga-math`（网关） | 5.9 MB | 51 毫秒 |
| `ga-math-school` | 4.7 MB | 62 毫秒 |
| `ga-math-algebra` | 5.8 MB | 108 毫秒 |
| `ga-math-calculus` | 8.7 MB | 133 毫秒 |
| `ga-math-college` | 6.8 MB | 112 毫秒 |
| `ga-math-exam` | 2.6 MB | 49 毫秒 |

当分片的启动时间或内存接近上限时（部署输出中的 `startup_time_ms` 和线上指标可以反映）就一分为二：把 topic 移到 `shards/` 下的新文件，在 `apps/math-workers/src/shards/` 下新增入口，并增加一个绑定。学习者状态不记录 topic 属于哪个分片，所以随时都可以这样做。

服务绑定调用不另收请求费，也不按时长收费；调用链上每个 Worker 的 CPU 时间都计费，多出的跳转开销很小。每个 Worker 各写各的日志，一次请求可能写三条日志事件。因此网关和分片只记录 1% 的调用（`headSamplingRate`）。Web Worker 记录每个请求，网关和分片的错误通过 RPC 传到它那里。

## 7. 存储

| 表 | 内容 |
| :--- | :--- |
| `user`、`session`、`account`、`verification` | better-auth 的核心 schema |
| `learner` | 学习的人，每个用户一个：公开用户名、是否参加联赛、每周各天的目标 |
| `enrollment` | 学习者选修某课程 |
| `event` | 每位学习者每个学科的引擎事件日志，用 `seq` 连续编号；保留 `xp` 用于报表 |
| `learner_state` | 日志折叠到 `seq` 为止的快照；可通过重放重建 |
| `task_session` | 会话及其执行器状态；每位学习者每门课程最多一个进行中 |
| `answer` | 每个判定过的作答：题目引用、作答、判定 |
| `league_group`、`league_member` | 一周内按段位划分的小组及其成员；每周 XP 和结果都由 `event` 计算 |
| `guardian`、`guardian_invite` | 谁在关注哪位学习者；一次性且 7 天后过期的邀请码 |

**一致性。**
- 完成一个会话时，追加事件、替换快照、关闭会话在同一个事务中完成。
- 为写入而读取快照行和会话行时会加锁（`SELECT … FOR UPDATE`）；`(learner, subject, seq)` 唯一索引拒绝任何漏网的写入者。
- `SubmitAnswer` 携带所回答题目的序号，重复的请求会被拒绝，而不是被判两次。

**迁移**由 drizzle-kit 从 `libs/db/src/schema` 生成到 `libs/db/drizzle` 并提交入库。测试把迁移应用到 PGlite；部署时用 `pnpm nx run db:migrate` 应用。

## 8. 外观

外观属于客户端而不是账户：每个浏览器或设备各存各的设置，不会发送到服务器，未登录时也能用。`libs/design` 存放所有客户端共用的部分，并且是纯代码，移动端可以直接使用。

| 设置 | 可选值 | 默认值 |
| :--- | :--- | :--- |
| `theme` | `system`、`light`、`dark` | `system` |
| `light` | 浅色下的配色：`academy`、`iris`、`plum`、`rose`、`linen`、`terracotta`、`walnut`、`honey`、`olive`、`paper`、`sepia`、`pine`、`lake`、`sky`、`midnight`、`slate` 或 `custom` | `academy` |
| `dark` | 深色下的配色，可选值相同 | `academy` |
| `contrast` | `standard`、`high` | `standard` |
| `text` | `small`、`default`、`large` | `default` |
| `motion` | `system`、`reduced`、`full` | `system` |

**颜色。** `colorTokens(palette, scheme, contrast)` 是内置颜色的唯一来源，按角色划分（`ink`、`surface`、`accent` 等）。配色改变中性色和强调色；`good`、`bad`、`warn` 在所有配色中都相同，因为对错的含义不能随配色变化。内置配色一半偏暖、一半偏冷。测试要求每种配色、每种明暗下的所有文字组合达到对比度等级的目标：`standard` 为 4.5:1，`high` 为 7:1（`high` 还会加强 `line`）；并要求饱和的强调色与对错颜色的色相至少相差 20 度。新的颜色角色或配色都加在这里，不加在客户端。

**自定义配色。** 自定义配色由三种颜色（`accent`、`page`、`ink`）构成，浅色和深色各有一组；其余颜色由 `customTokens` 推导。背景保持其明暗方案要求的亮度范围，文字按需调整亮度，所以测试要求任意三种颜色都达到相同的对比度目标。开始自定义时取当前配色的颜色；选择其他配色后，自定义配色仍会保留。

**分享。** `sharePalette` 把自定义或内置配色写成文本 `great-academy-palette-v1:{"scheme","accent","page","ink"}`，`parseSharedPalette` 严格读取。配色只能导入到它所属的明暗方案，因为它的颜色只适用于该方案。

**存储。** `serializeAppearance` 和 `parseAppearance` 定义统一的格式，例如 `theme=dark&light=paper&custom-dark=rrggbb.rrggbb.rrggbb`，保存在 `APPEARANCE_STORAGE_KEY` 下。默认值不写入，缺失或无效的内容都按默认值读取。

**Web。**
- `libs/design/theme.css` 用 `pnpm nx run design:generate` 从 token 生成并提交入库；文件过期时测试会失败。`apps/web` 导入它，组件只使用 `bg-surface` 这样的 Tailwind 类名。
- 设置保存在 `localStorage` 中，并体现为 `<html>` 的属性：`data-theme`、`data-light`、`data-dark`、`data-contrast`、`data-text`、`data-motion`。默认值没有对应属性。
- 两种明暗方案的规则放在有序的级联层 `ga-light` 和 `ga-dark` 中，所以无论特异性如何，深色规则总是优先于浅色规则。
- 自定义配色无法放进静态文件：`customPaletteCss` 生成它们的样式表，保存在 `CUSTOM_PALETTE_CSS_KEY` 下，并通过 `CUSTOM_PALETTE_STYLE_ID` 元素加入 `<head>`。
- 没有 `data-theme` 时，CSS 通过 `prefers-color-scheme` 跟随设备，不需要脚本。
- 服务器不知道这些设置，所以 `<head>` 中有一段由 `appearanceScript()` 生成的短脚本，在首次绘制前设置属性并加入已保存的样式表。测试会检查它与 `parseAppearance` 一致。
- 这些属性可用于任何元素，设置页的缩略图和预览就是这样绘制的。

**移动端。** 移动端将把同样的格式存到本地存储，用 `resolveColors(appearance, device)` 取十六进制颜色（React Native 无法解析 oklch），按 `TEXT_SCALE` 缩放文字，并用 `resolveColorScheme` 和 `resolveReducedMotion` 根据设备解析 `system`。目前它只使用默认的浅色配色。
