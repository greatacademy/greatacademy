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
   - 全部代码使用 TypeScript。唯一的例外是英语的 Python 语音服务 `apps/voice`（[英语课程体系 §13.3](english-curriculum.zh-CN.md#133-语音服务)）。
   - 引擎和内容运行时都是没有 I/O 的纯函数，同一份代码运行在 Worker、浏览器、原生应用、测试和离线模拟中。
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
| 契约 / RPC | **Protobuf + buf + Connect**（`protobuf-es` v2、`connect-es` v2）、`protovalidate` | Web 与原生应用共用一份契约；原生应用走 JSON 传输 |
| Web 应用 | **TanStack Start**（Router、Query、Form），运行于 **Cloudflare Workers**；**React 19** | 用 Cloudflare 的 **`cf`** 命令行构建、运行和部署，不用 wrangler |
| UI | **Base UI**、**Tailwind CSS v4**、Phosphor 图标 | 设计 token 来自 `libs/design` |
| 数学渲染 / 输入 | **KaTeX**（渲染）、**MathLive**（输入）、**Compute Engine**（解析学生答案） | 组件在 `apps/web`；原生应用由应用自身渲染，再显示在 Native Shell 的 `WebView` 中，样式表、字体和 MathLive 从 Worker 的 `/embed` 加载 |
| 账户 | **better-auth**（邮箱 + 密码，之后加 passkey），运行在 Worker 中 | Web 与原生应用共享会话（bearer token） |
| 邮件 | **Cloudflare Email Service**，通过 Worker 的 `send_email` 绑定 `EMAIL`；或 **Resend**，通过 HTTP 调用，使用 `RESEND_API_KEY`。密钥 `EMAIL_PROVIDER` 按顺序列出要用的服务，`EMAIL_FROM` 是发件人 | 密码重置、邮箱验证、通知、提醒和告警，每封都有 HTML 和纯文本两部分，且只用一种语言：本人请求的邮件使用请求的语言（网页的 `ga-locale` cookie，否则为 `Accept-Language`，原生应用会把它设为应用自己的语言），定时发送的邮件使用 `user.locale`，即此人最近使用的语言，每次 API 请求都会更新它；都不知道时用英语（`apps/web/src/server/templates.ts`）。Worker 不需要 SMTP 客户端。两者都列出时，只有第一个因暂时性原因（限流、每日上限、投递失败或故障）失败时才由第二个发送，配置或邮件本身有误时不切换（`apps/web/src/server/email.ts`） |
| 支付 | **Stripe**，美国公司的一个账户，在 Worker 中使用 `stripe`（其 fetch 客户端和 Web Crypto） | 自动续费的银行卡方案，以及不续费的支付宝和微信支付方案（[计费](billing.zh-CN.md)）；Checkout 和客户门户都是 Stripe 的页面，银行卡信息不会经过我们 |
| 数据库 | **PostgreSQL 17**，Worker 通过 **Hyperdrive** 访问；**Drizzle ORM** + drizzle-kit 迁移 | 测试中用 **PGlite**；开发时用 OrbStack 中的 `postgres:17-alpine` 容器 |
| 移动端和桌面端 | **[Native Shell](https://nsh.dev)**（`nsh`，来自项目 fork 的 `greatacademy` 分支），内购用的 StoreKit 在应用自己的 Rust crate 中，应用用 TSX 编写，运行在它的 QuickJS 运行时上 | 一个应用，在 iOS、Android、macOS、Windows 和 Linux 上使用各平台自己的视图；与 Web 共用契约和 token |
| 语音服务 | 由 **uv** 管理的 **Python 3.14**，**Pipecat** 1.15.0 及其 FastAPI WebSocket 传输，运行在 **uvicorn** 上；**pytest**、**ruff**、**pyright** | 英语实时对话，是 Worker 无法运行的长驻进程；内部没有 LLM 服务，导师的回合由 Web Worker 通过 HTTP 给出；票据用 Ed25519 校验（`cryptography`） |
| 对象存储 | **R2** | 内容中的图片，生成的图形是内嵌 SVG（[内容 §4](content.zh-CN.md#4-knowledge-point-与生成器)）；监护人的签字表格，存放在单独的存储桶中，决定后删除（[未成年人数据 §6](minors-data.zh-CN.md#6-账号与同意)） |

## 3. 仓库结构

```text
apps/web/             TanStack Start on Workers：页面、better-auth，并把 libs/api 挂载在 /api 下
apps/math-workers/    提供数学内容的 Worker：一个网关和它的分片（§6.1）
apps/english-workers/ 提供英语内容的 Worker：一个网关和它的分片
apps/nsh/             Native Shell 的 TSX 应用（iOS、Android、macOS、Windows、Linux）
apps/voice/           英语的语音服务，用 Python 基于 Pipecat 编写：轮流说话、打断、票据、排空
libs/proto/           契约：proto/ga/<domain>/v1/*.proto、buf 配置、gen/（生成代码，提交入库）
libs/api/             Connect 服务实现与会话执行器；与传输方式和宿主无关
libs/engine/          学习引擎：图谱、知识前沿、FIRe、任务选择、诊断、XP、测验（纯函数）
libs/content/         内容模型：知识点/课程定义、编译器与校验器、题目运行时、答案判定
libs/subject-math/    数学学科：数学答案判定器、数学题目生成器的辅助函数
libs/subject-english/ 英语学科：句子和单词判定器、题库工具
libs/judge/           写作的 AI 判定：提示词、respond 工具、引用经过原文核对的判定结果、经 pi-ai 连接的供应商
libs/subject-worker/  任何学科的网关和分片都由它的 Worker 入口构成
libs/db/              Drizzle schema、迁移和仓储（PostgreSQL）
libs/design/          颜色 token、配色和外观模型（§8），以及为 Web 和原生应用生成的形式
content/math/         编写的数学内容：知识点、课程
content/english/      编写的英语内容：知识点、课程
tools/simulate/       模拟学生，用于调参和检验引擎
tools/audit/          内容审计：大纲覆盖和启发式质量检查
tools/pilot/          试点报告：根据作答和事件日志，找出真实学习者卡住的地方
tools/calibrate/      校准：在两人评分的文本上运行一条路由，并记录它的一致性
docs/                 文档（英文 + 简体中文）
```

### 3.1 依赖方向

```text
apps/web ──► libs/api ──► libs/db ──► libs/engine ──► libs/content
   │            │                                       ▲
   │            ├──► libs/judge ──► libs/content         │
   │            └──► libs/proto                         │
   ├──► libs/design
   │                                             libs/subject-math ◄── content/math
   └╌╌► apps/math-workers, apps/english-workers（仅开发时，用来一起运行）
apps/math-workers ──► libs/subject-worker ──► libs/content
   └──► content/math, libs/subject-math
apps/english-workers ──► libs/subject-worker ──► libs/content
   └──► content/english, libs/subject-english
apps/nsh ──► libs/proto, libs/design
tools/simulate ──► libs/engine, content/math, content/english
tools/audit ──► libs/content, content/math, content/english
tools/pilot ──► libs/db, libs/engine, content/math, content/english
tools/calibrate ──► libs/judge, libs/db, libs/api, libs/subject-english
apps/voice ╌╌► apps/web，经 HTTP（没有包依赖）
```

- `libs/content` 不依赖仓库内任何库，它定义所有学科都要实现的类型。
- `libs/engine` 只依赖 `libs/content` 的类型。它没有 I/O、没有时钟（时间作为参数传入），也没有随机性（种子作为参数传入）。
- `libs/subject-math` 和 `libs/subject-english` 只依赖 `libs/content`。
- `libs/design` 不依赖仓库内任何库，也没有 I/O，因此 Web 和原生应用可以共用。
- `content/<subject>` 依赖 `libs/content` 和对应的学科库。
- `libs/api` 基于 `libs/db` 和引擎实现服务，但不知道宿主：请求的用户和数据库客户端以 Connect context value 传入，时钟和种子通过注入提供。它的测试在 PGlite 上端到端地运行服务。
- `libs/judge` 依赖 `libs/content` 的类型和 pi-ai。它不知道任何学科，也不接触数据库：`libs/api` 把标准、文本和模型客户端交给它，再保存它返回的结果。
- `libs/subject-worker` 是唯一引入 Workers 运行时的库，它不知道任何具体学科。
- `apps/voice` 用 Python 编写，不引入仓库内任何代码。它用自己的凭据经 HTTP 访问 Web Worker，获取导师的回合并写入结果；它与客户端共用的 WebSocket 消息以后在 `libs/proto` 中改为 Protobuf。
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
| Guardian（监护人） | 受学习者邀请关注学习者的用户，监督未成年人：为其选择课程、设定目标 |
| League group（联赛小组） | 同一段位中一周内竞争的最多 30 名学习者 |
| Enrollment（选课） | 学习者在某学科的课程：一门当前，其余为历史 |
| Topic state（知识点状态） | 学习者在某知识点上的重复状态（派生数据） |
| Task（任务） | 学习者任务面板上的课程、复习、阅读、测验或诊断 |
| Event（事件） | 不可变记录：任务开始、提交答案、任务完成、诊断作答 |

内容的完整模型见[内容](content.zh-CN.md)，派生的学习者状态定义见[学习引擎](learning-engine.zh-CN.md)。

## 5. 请求流程

1. 客户端调用 `/api/rpc/ga.<domain>.v1.*` 下的 Connect 服务。Web 端携带会话 cookie，原生应用携带签名的 bearer token，由 better-auth 的 `bearer` 插件在登录时通过 `set-auth-token` 响应头签发。better-auth 本身位于 `/api/auth/*`。
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

`src/server.ts` 是 Worker 的入口：TanStack Start 处理请求，每日的 Cron Trigger 运行 `libs/api/src/retention.ts` 中的保存期限规则，另一个每 15 分钟运行一次 `libs/api/src/costs.ts` 中的费用检查，并把告警用电子邮件发给管理员。`PrivacyService` 负责年龄问题、同意、验证和删除（[未成年人数据](minors-data.zh-CN.md)），`libs/api/src/capabilities.ts` 中的 `requireStudy` 是 `StartTask` 之前的关口。`AdminService` 为 `/admin` 的后台提供服务（[管理后台](admin.zh-CN.md)），并拒绝没有该角色的人。`BillingService` 出售并管理方案（[计费](billing.zh-CN.md)）；计费开启时，`libs/api/src/billing.ts` 中的 `requirePlan` 拒绝在没有方案覆盖的学科中选择课程或开始学习。Stripe 的事件到达 `/api/stripe`；处理程序校验每个签名，把事件读成 `BillingEvent`（`apps/web/src/server/stripe.ts`），再由 `applyBillingEvent` 记录，重复或迟到的事件不会造成改变。

监护人读取学习者数据时，使用与学习者相同的只读调用：`GetDashboard`、`GetCourseProgress` 和 `ListSessions` 接受可选的 `learner_id`，只有调用者关注了该学习者才生效。监督人的决定 `ChooseCourse`、`KeepCourse`、`SetGoals` 和 `SetEndDate` 也接受它；由监护人监督的学习者自己调用这些会被拒绝（[体验 §5](experience.zh-CN.md#5-监督)）。其他会改变数据的调用不接受 `learner_id`，监护人也不能打开会话，所以学习者的答案只属于学习者自己。

## 6. 部署

- **生产：**
  - Web Worker（`apps/web`），对外地址为 `greatacademy.dev`，用 `cf deploy` 部署，通过 Hyperdrive 绑定 PostgreSQL，通过 R2 绑定存放媒体和签字表格（`GUARDIAN_FORMS`），通过服务绑定连接每个学科的网关 Worker，并配有每日和每 15 分钟的 Cron Trigger、加密 AI 供应商 API 密钥的 secret `AI_KEYS_SECRET`，以及[计费](billing.zh-CN.md) §10 中的 Stripe 密钥。
  - 每个学科的 Worker（§6.1）先于 Web Worker 部署，分片先于网关，因为服务绑定指向的 Worker 必须已经存在。
  - 部署前用 drizzle-kit 执行迁移。
- **区域。** 无论学习者在哪个市场，数据都留在美国西部：
  - PostgreSQL 和语音服务的 Kubernetes 集群运行在 Hetzner Cloud 位于俄勒冈州 Hillsboro 的机房（`hil`），备份也留在美国。
  - Hyperdrive 经 Cloudflare Tunnel 连接 PostgreSQL，数据库没有公网端口。
  - Web Worker 放在靠近数据库的地方运行，因为一个请求要查询数据库多次，否则每次查询都要跨洋。学科的 Worker 不查数据库，在边缘运行。
  - R2 存储桶在首次部署前手动创建，位置提示设为 `wnam`，因为存储桶的位置之后不能更改。
  - 数据只存放在一个国家，对其他每个市场都构成跨境传输，所以 `/legal/privacy` 的隐私声明写明数据存放在美国（[未成年人数据 §12](minors-data.zh-CN.md#12-供应商)）。
- **开发：**
  - `cf dev` 通过 Vite 在 workerd 中运行 Worker。
  - 它连接 OrbStack 中 `postgres:17-alpine` 容器里的 PostgreSQL，详见[开发指南](development.zh-CN.md)。
  - 语音服务用它的生产镜像在 PostgreSQL 旁边的容器中运行，访问主机上的 `cf dev`（[开发指南](development.zh-CN.md) §7）。
- **移动端和桌面端：** 用 `nsh package` 构建各平台的安装包，调用同一套 API。
- **为英语计划：** 更多 Cloudflare 服务、通过 pi-ai 使用由平台管理员配置供应商的 AI 模型，以及与 PostgreSQL 同处一地、运行在 Kubernetes 上的语音服务（[英语课程体系 §13](english-curriculum.zh-CN.md#13-技术与部署)）。

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

数学有五个分片，各对应课程体系的一段（`content/math/src/shards/`）。`apps/math-workers/gen/` 存放生成的 manifest 和每个分片的 topic 列表，不提交到仓库。英语目前只有一个分片 `core`，`apps/english-workers` 下的结构相同。

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
| `user`、`session`、`account`、`verification` | better-auth 的核心 schema；`user` 保存名字（只有本人及其监护人能看到）和用户名（用于登录，也是学习者在联赛中的名称） |
| `learner` | 学习的人，每个用户一个：是否参加联赛、年龄段及其结束日期、国家或地区、账号是否由监护人管理、每日上限 |
| `learner_subject` | 学习者对某个学科除课程之外的决定：每周各天的目标、是否暂停，以及当前课程的截止日期 |
| `enrollment` | 学习者的课程：每个学科至多一门当前课程（`ended_at` 为空）、选定时间，以及诊断报告得到回应的时间 |
| `event` | 每位学习者每个学科的引擎事件日志，用 `seq` 连续编号；保留 `xp` 用于报表 |
| `learner_state` | 日志折叠到 `seq` 为止的快照；可通过重放重建 |
| `task_session` | 会话及其执行器状态；每位学习者每门课程最多一个进行中 |
| `answer` | 每个判定过的作答：题目引用、作答、判定 |
| `league_group`、`league_member` | 一周内按段位划分的小组及其成员；每周 XP 和结果都由 `event` 计算 |
| `guardian`、`guardian_invite` | 谁在关注哪位学习者；一次性且 7 天后过期的邀请码 |
| `consent`、`guardian_verification` | 按学习者和范围只追加的同意记录；谁证明了自己是监护人，表格的键只在等待决定时保留 |
| `platform_admin`、`market_launch`、`admin_log` | 后台角色、各市场的开关及签字人、只追加的修改日志 |
| `judgment` | 每篇交给模型的文本：按键（`id@version`）列出的标准、状态、带引用的判定结果、分数、模型、提示词版本、token、成本、尝试次数和最近一次失败的原因，从不保存供应商的报错内容 |
| `ai_provider`、`ai_route`、`calibration`、`vendor_check`、`notice` | 带加密密钥和预算的 AI 供应商、按用途和对象的路由、通过的校准、供应商登记表和通知版本 |
| `ai_price`、`ai_call` | 每个模型每百万 token 的价格，以及对模型的每次调用及其 token、费用和学习者 |
| `verdict_check` | 抽样供人工检查的线上判定标准：路由、它的判定和人工的判定；文本仍留在 `judgment` 中 |

**一致性。**
- 完成一个会话时，追加事件、替换快照、关闭会话在同一个事务中完成。
- 为写入而读取快照行和会话行时会加锁（`SELECT … FOR UPDATE`）；`(learner, subject, seq)` 唯一索引拒绝任何漏网的写入者。
- `SubmitAnswer` 携带所回答题目的序号，重复的请求会被拒绝，而不是被判两次。
- **由模型判定的作答。** `SubmitAnswer` 只检查长度，保存一条待判定的 `judgment`，把它记在执行器状态里，并返回 `pending`。客户端轮询 `GetJudgment`，它在请求内运行到期的判定，因为 Worker 的数据库连接随响应关闭。同一时间只有一个调用方通过 30 秒的租约持有一次判定；一次失败的尝试等待 10 秒，每次加倍，最多 2 分钟，尝试两次后改用备用路由，10 分钟后彻底失败，这时学习者可以跳过这道题，会话结束且不追加事件。达到标准的比例至少为 0.75 时算答对；低于此值时文本退回一次让学习者重写，不显示范文，第二次的结果无论如何都计入。只有这时才追加事件，因此回放不会调用模型。
- **由模型判定的主题需要路由。** 对每位学习者，课程会去掉这样的主题：它由模型判定，而它的标准并非都有可以接收该学习者文本的线上路由（[管理后台 §5](admin.zh-CN.md#5-ai-服务)）；编译器不允许由规则判定的主题依赖或包含这样的主题。

**迁移**由 drizzle-kit 从 `libs/db/src/schema` 生成到 `libs/db/drizzle` 并提交入库。测试把迁移应用到 PGlite；部署时用 `pnpm nx run db:migrate` 应用。

## 8. 外观

外观属于客户端而不是账户：每个浏览器或设备各存各的设置，不会发送到服务器，未登录时也能用。`libs/design` 存放所有客户端共用的部分，并且是纯代码，原生应用可以直接使用。

| 设置 | 可选值 | 默认值 |
| :--- | :--- | :--- |
| `theme` | `system`、`light`、`dark` | `system` |
| `light` | 浅色下的配色：`academy`、`iris`、`plum`、`rose`、`linen`、`terracotta`、`walnut`、`honey`、`olive`、`paper`、`sepia`、`pine`、`lake`、`sky`、`midnight`、`slate` 或某套自定义配色 | `academy` |
| `dark` | 深色下的配色，可选值相同 | `academy` |
| `contrast` | `standard`、`high` | `standard` |
| `text` | `small`、`default`、`large` | `default` |
| `motion` | `system`、`reduced`、`full` | `system` |

**颜色。** `colorTokens(palette, scheme, contrast)` 是内置颜色的唯一来源，按角色划分（`ink`、`surface`、`accent` 等）。配色改变中性色和强调色；`good`、`bad`、`warn` 在所有配色中都相同，因为对错的含义不能随配色变化。内置配色一半偏暖、一半偏冷。测试要求每种配色、每种明暗下的所有文字组合达到对比度等级的目标：`standard` 为 4.5:1，`high` 为 7:1（`high` 还会加强 `line`）；并要求饱和的强调色与对错颜色的色相至少相差 20 度。新的颜色角色或配色都加在这里，不加在客户端。

**Logo。** `LOGO` 保存标志：沿酒红色盾牌轮廓走笔的白色 G。它的颜色固定，不跟随配色变化，应用图标则放在固定的浅色底上。

**学科。** `subjectColors(hue, scheme, contrast)` 根据学科声明的色相给出标识学科的颜色（[体验 §2](experience.zh-CN.md#2-学科)）：`strong` 及其上的 `onStrong`，以及 `soft` 及其上的 `onSoft`，后者在页面和卡片上也清晰可读。`awayFromVerdicts` 先把色相移到与判定色相距至少 20 度。测试在每个色相、两种配色方案和两种对比度级别下，都要求这两组颜色达到对比度目标。

**自定义配色。** 每种明暗方案各有一个列表，最多保存 `MAX_CUSTOM_PALETTES` 套带名称的配色，id 形如 `custom-3`。自定义配色由三种颜色（`accent`、`page`、`ink`）构成，其余颜色由 `customTokens` 推导。背景保持其明暗方案要求的亮度范围，文字按需调整亮度，所以测试要求任意三种颜色都达到相同的对比度目标。新建配色时取当前配色的颜色。内置配色本身不会改变：修改它只产生一份草稿，仅在预览中显示，可以保存为新的自定义配色。删除正在显示的配色后，该方案回到默认配色。

**分享。** `sharePalette` 把自定义或内置配色写成文本 `great-academy-palette-v1:{"scheme","name","accent","page","ink"}`，`parseSharedPalette` 严格读取。导入会新增一套自定义配色，且只能导入到它所属的明暗方案，因为它的颜色只适用于该方案。

**存储。** `serializeAppearance` 和 `parseAppearance` 定义统一的格式，例如 `theme=dark&dark=custom-1&custom-dark=1.rrggbb.rrggbb.rrggbb.name`，每套配色一条 `custom-light` 或 `custom-dark`，名称经过百分号编码，保存在 `APPEARANCE_STORAGE_KEY` 下。默认值不写入，缺失或无效的内容都按默认值读取。

**Web。**
- `libs/design/theme.css` 用 `pnpm nx run design:generate` 从 token 生成并提交入库；文件过期时测试会失败。`apps/web` 导入它，组件只使用 `bg-surface` 这样的 Tailwind 类名。
- 设置保存在 `localStorage` 中，并体现为 `<html>` 的属性：`data-theme`、`data-light`、`data-dark`、`data-contrast`、`data-text`、`data-motion`。默认值没有对应属性。
- 两种明暗方案的规则放在有序的级联层 `ga-light` 和 `ga-dark` 中，所以无论特异性如何，深色规则总是优先于浅色规则。
- 自定义配色无法放进静态文件：`customPaletteCss` 生成它们的样式表，保存在 `CUSTOM_PALETTE_CSS_KEY` 下，并通过 `CUSTOM_PALETTE_STYLE_ID` 元素加入 `<head>`。
- 没有 `data-theme` 时，CSS 通过 `prefers-color-scheme` 跟随设备，不需要脚本。
- 服务器不知道这些设置，所以 `<head>` 中有一段由 `appearanceScript()` 生成的短脚本，在首次绘制前设置属性并加入已保存的样式表。测试会检查它与 `parseAppearance` 一致。
- 这些属性可用于任何元素，设置页的缩略图和预览就是这样绘制的。

**原生应用。** 原生应用用 `resolveColors(appearance, device)` 取十六进制颜色。之后会把同样的格式存到 `Storage`，按 `TEXT_SCALE` 缩放文字，并用 `resolveColorScheme` 和 `resolveReducedMotion` 解析 `system`。目前它们使用默认外观，并跟随设备的配色方案。
