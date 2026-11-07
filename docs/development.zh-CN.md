# 开发

> [English](development.md) | 简体中文

本文说明如何准备仓库、运行检查和在本地运行应用。代码、内容、测试和提交的约定见 [AGENTS.zh-CN.md](../AGENTS.zh-CN.md)。

---

## 1. 工具链

工具版本由 `mise.toml` 固定（Node.js、pnpm、buf）。安装 [mise](https://mise.jdx.dev) 后执行：

```bash
mise install
pnpm install
```

`pnpm nx …` 通过 `mise exec` 运行 Nx，因此即使 shell 没有激活 mise，也会使用固定的版本。

## 2. 检查

```bash
pnpm nx run-many -t typecheck test lint    # 所有项目
pnpm nx affected -t typecheck test lint    # 受工作区改动影响的项目
pnpm nx run content:test                   # 单个项目的单个目标
pnpm format                                # Biome：格式化并应用安全修复
```

| 目标 | 工具 | 说明 |
| :--- | :--- | :--- |
| `typecheck` | `tsc`（TypeScript 7） | 不产出文件；库以源码形式被使用 |
| `test` | Vitest | 测试以 `*.test.ts` 放在代码旁边 |
| `lint` | Biome | 只在 `biome.json` 中配置一次 |

Nx 把这些目标的结果缓存在 `.nx/`（被 git 忽略）中；只有输入改变时目标才会重新运行。

## 3. 项目

| 项目 | 路径 | 用途 |
| :--- | :--- | :--- |
| `content` | `libs/content` | 内容模型、编译器、题目运行时、核心判定器（[内容](content.zh-CN.md)） |
| `subject-math` | `libs/subject-math` | 数学判定器：LaTeX 解析、精确有理数、多项式形式（[内容 §10](content.zh-CN.md#10-数学)） |
| `content-math` | `content/math` | 数学知识点与课程 |
| `subject-english` | `libs/subject-english` | 英语判定器和题库工具（[内容 §11](content.zh-CN.md#11-英语)） |
| `content-english` | `content/english` | 英语知识点与课程 |
| `engine` | `libs/engine` | 学习引擎：前沿、FIRe、任务选择、课程、复习、测验、诊断（[学习引擎](learning-engine.zh-CN.md)） |
| `proto` | `libs/proto` | 契约；修改 `.proto` 文件后执行 `pnpm nx run proto:generate` |
| `db` | `libs/db` | Drizzle schema、迁移、数据访问；修改 schema 后执行 `pnpm nx run db:generate -- --name <change>` |
| `api` | `libs/api` | Connect 服务与会话执行器，在 PGlite 上端到端测试 |
| `web` | `apps/web` | Web 应用：Workers 上的 TanStack Start、better-auth，以及挂在 `/api` 下的 Connect 服务（§5） |
| `subject-worker` | `libs/subject-worker` | 任何学科的网关和分片所用的 Worker 入口 |
| `math-workers` | `apps/math-workers` | 数学的网关和分片 Worker（[架构](architecture.zh-CN.md) §6.1）；`pnpm nx run math-workers:generate` 把 manifest 写入 `gen/`，需要它的 target 会先运行这一步 |
| `english-workers` | `apps/english-workers` | 英语的网关和分片 Worker，构建方式相同 |
| `nsh` | `apps/nsh` | Native Shell 应用，开发中：课程列表和课程大纲、登录、注册和年龄问题、学习主页和任务播放器，连接 Web 应用的 API（§6） |
| `simulate` | `tools/simulate` | 用于调校引擎的模拟学生：`pnpm nx run simulate:simulate`（[学习引擎 §8](learning-engine.zh-CN.md#8-参数)） |
| `audit` | `tools/audit` | 内容审计：课程相对大纲缺少的知识点，以及启发式检查（讲解过短、解答过简、缺少 `wrong`、缺少图形等）。`pnpm nx run audit:audit -- <绝对路径>` 生成 Markdown 报告；结果是待复核的线索，不一定是错误 |
| `pilot` | `tools/pilot` | 根据数据库生成某门课程的试点报告：`DATABASE_URL=… pnpm nx run pilot:report -- --course algebra-i`（[路线图 §3](roadmap.zh-CN.md#3-试点)） |

此表随仓库增长；[架构 §3](architecture.zh-CN.md#3-仓库结构) 给出目标结构。

## 4. 添加一个包

1. 在 `apps/`、`libs/`、`content/` 或 `tools/` 下创建目录。
2. 添加 `package.json`：包名为 `@ga/<name>`，`"type": "module"`，`"private": true`，依赖版本精确固定，包含 `typecheck`、`test`、`lint` 脚本，以及 `"nx": { "name": "<name>" }`。
3. 添加继承 `../../tsconfig.base.json` 的 `tsconfig.json`。
4. 库导出源码：`"exports": { ".": "./src/index.ts" }`。
5. 执行 `pnpm install`，然后运行检查。

## 5. 运行 Web 应用

Web 应用通过 Vite 在 workerd 中运行（`cf dev`），连接容器中的 PostgreSQL。在 macOS 上用 [OrbStack](https://orbstack.dev) 提供 `docker`。

```bash
docker compose up -d                  # PostgreSQL 17，localhost:54329（compose.yaml）
pnpm nx run db:migrate                # 执行 libs/db/drizzle 中的迁移
cp apps/web/.dev.vars.example apps/web/.dev.vars
pnpm nx run web:dev                   # http://localhost:5173
```

- `apps/web/cloudflare.config.ts` 声明 Worker：Hyperdrive 绑定 `HYPERDRIVE`，其 `dev.connectionString` 指向容器；密钥 `BETTER_AUTH_SECRET`、`RESEND_API_KEY`、`EMAIL_FROM` 和 `AI_KEYS_SECRET`，本地从 `.dev.vars` 读取（已被 git 忽略）；R2 存储桶 `GUARDIAN_FORMS`，开发时在本地；以及每日 Cron Trigger。`RESEND_API_KEY` 留空时，密码重置和验证邮件不会发出，而是写到控制台，可以从服务器输出里打开其中的链接。
- `pnpm nx run web:typecheck` 会先运行 `cf workers types`，把 `Env` 类型声明写入 `.cloudflare/types`。
- `apps/web/vite.config.ts` 在开发时让学科 Worker 与 Web Worker 一起运行，所以 `web:dev` 不需要额外步骤。请通过 Nx 运行，它会先生成 manifest。
- `pnpm nx run web:build` 把 Worker 构建到 `.cloudflare/output`；`cf deploy` 负责部署。Worker 对外提供 `greatacademy.dev`，同样声明在这个文件里。部署前需把该域名作为 zone 加入 Cloudflare 账号，创建 Hyperdrive 配置、把它的 id 填进 `cloudflare.config.ts`，创建 R2 存储桶 `ga-guardian-forms`，并设置密钥，其中 `EMAIL_FROM` 用该域名下已通过 Resend 验证的地址。
- 先部署学科：`pnpm nx run math-workers:deploy` 构建数学的 Worker，先部署分片，再部署网关；`pnpm nx run english-workers:deploy` 对英语做同样的事。之后再部署 Web Worker。

管理后台位于 `/admin`。先在账号上以成年人身份回答年龄问题，再用 `pnpm nx run db:grant-admin -- <email>` 授予角色。每个市场一开始都不向未成年人开放，所以试用儿童账号之前要先在后台开放一个市场。在 `web:dev` 运行时，可以这样运行一次保存期限规则：

```bash
curl -X POST -H 'content-type: application/json' -d '{"cron":"0 3 * * *"}' 'http://localhost:5173/cdn-cgi/local/explorer/api/local/scheduled?worker=ga-web'
```

试用方法：注册账号，回答年龄问题，选择“我自己学”，打开「代数基础」，选修，然后参加诊断或跳过。首页给出接下来的任务；进度图显示每个知识点的状态和估计的记忆程度。

## 6. 运行原生应用

Native Shell 应用调用与 Web 应用相同的 Connect 服务，因此先启动 Web 应用（§5）。`mise install` 会提供 `nsh`。

```bash
pnpm nx run nsh:dev                   # 在本机打开窗口
```

```bash
pnpm nx run nsh:ios                   # iOS 模拟器；需要 Xcode
```

```bash
pnpm nx run nsh:android               # 模拟器或真机；需要 Android SDK 和 JDK
```

- `apps/nsh/lib/rpc.ts` 中的 `API_URL` 在 `nsh run` 下是 `http://localhost:5173`，桌面端和 iOS 模拟器可以直接访问。Android 需要先运行 `adb reverse tcp:5173 tcp:5173`。如果要给手机打包，用 `DEV_HOST=0.0.0.0` 启动 Web 应用，并传入 `--api-url http://<本机地址>:5173`。
- 页面位于 `apps/nsh/screens`。`nsh:test` 以无头方式运行应用，不需要模拟器；`nsh:typecheck` 运行 `nsh check`，它也会生成 `.nsh/types`。
- 应用用 bearer token 登录，并把它保存在 `Storage` 中。同意、监护人工具、进度地图和历史记录还不在应用里。
- 含公式和配图的文本显示在 Web 视图中，它们从 Web 应用的 `/embed` 加载 KaTeX 和 MathLive。`apps/web/vite.config.ts` 把它们复制到 `public/embed`，该目录被 git 忽略。纯文本使用原生视图。
- `nsh test` 不运行 Web 视图，所以作图题和数学输入框没有无头测试。
- Web 视图中的页面如果加载不到 KaTeX 样式表，就改为显示每个公式的 MathML。在 `--target web` 下，页面是没有来源的沙箱框架，所以 `/embed` 允许任意来源。有些内嵌浏览器（例如 Claude 桌面应用的浏览器面板）会拒绝沙箱框架的所有请求，所以要在普通浏览器或原生目标上检查公式。
- 桌面窗口不会一直小于 420×600 点（`lib/window.ts`）：Native Shell 没有为 TSX 应用提供最小窗口尺寸，所以拖动超过下限后窗口会弹回。
- `pnpm nx run nsh:package -- --target <target>` 构建安装包，应用标识符是 `dev.greatacademy.app`，图标来自 `assets/`。它默认使用 `https://greatacademy.dev`，可用 `--api-url` 指定其他服务器；其他参数（如 `--sign` 和 `--profile`）会传给 `nsh package`。