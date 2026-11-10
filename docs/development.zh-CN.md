# 开发

> [English](development.md) | 简体中文

本文说明如何准备仓库、运行检查和在本地运行应用。代码、内容、测试和提交的约定见 [AGENTS.zh-CN.md](../AGENTS.zh-CN.md)。

---

## 1. 工具链

工具版本由 `mise.toml` 固定（Node.js、pnpm、buf，以及语音服务用的 Python 和 uv）。安装 [mise](https://mise.jdx.dev) 后执行下面的命令。原生应用需要 Native Shell 的 main 分支，mise 不提供它（§6）。

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

语音服务（`apps/voice`）是唯一的 Python 项目：它的 `typecheck`、`test` 和 `lint` 脚本通过 `uv run` 运行 pyright、pytest，以及 `ruff check` 和 `ruff format --check`，配置在它的 `pyproject.toml` 中（§7）。

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
| `nsh` | `apps/nsh` | Native Shell 应用：欢迎页、登录、注册和年龄问题；学习、进度、课程、我的四个标签页；账号设置（个人资料、每周目标、联赛、密码、监护人）；课程大纲、进度地图、历史记录和任务播放器；隐私、同意和监护人页面；连接 Web 应用的 API（§6） |
| `simulate` | `tools/simulate` | 用于调校引擎的模拟学生：`pnpm nx run simulate:simulate`（[学习引擎 §8](learning-engine.zh-CN.md#8-参数)） |
| `audit` | `tools/audit` | 内容审计：课程相对大纲缺少的知识点，以及启发式检查（讲解过短、解答过简、缺少 `wrong`、缺少图形等）。`pnpm nx run audit:audit -- <绝对路径>` 生成 Markdown 报告；结果是待复核的线索，不一定是错误 |
| `voice` | `apps/voice` | 英语实时对话的语音服务，用 Python 基于 Pipecat 编写；用模拟的语音服务和模拟的 Web Worker 测试（§7） |
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

- `apps/web/cloudflare.config.ts` 声明 Worker：Hyperdrive 绑定 `HYPERDRIVE`，其 `dev.connectionString` 指向容器；密钥 `BETTER_AUTH_SECRET`、`RESEND_API_KEY`、`EMAIL_FROM` 和 `AI_KEYS_SECRET`，本地从 `.dev.vars` 读取（已被 git 忽略）；R2 存储桶 `GUARDIAN_FORMS`，开发时在本地；以及每日 Cron Trigger。没有 `STRIPE_SECRET_KEY` 时计费关闭，所有人都可以学习；要试用计费，把 Stripe 测试账户的密钥放进 `.dev.vars`，并用 `stripe listen --forward-to localhost:5173/api/stripe` 转发事件，它给出的签名密钥就是 `STRIPE_WEBHOOK_SECRET`（[计费](billing.zh-CN.md) §10）。`RESEND_API_KEY` 留空时，密码重置和验证邮件不会发出，而是写到控制台，可以从服务器输出里打开其中的链接。
- `pnpm nx run web:typecheck` 会先运行 `cf workers types`，把 `Env` 类型声明写入 `.cloudflare/types`。
- `apps/web/vite.config.ts` 在开发时让学科 Worker 与 Web Worker 一起运行，所以 `web:dev` 不需要额外步骤。请通过 Nx 运行，它会先生成 manifest。
- `pnpm nx run web:build` 把 Worker 构建到 `.cloudflare/output`；`cf deploy` 负责部署。Worker 对外提供 `greatacademy.dev`，同样声明在这个文件里。部署前需把该域名作为 zone 加入 Cloudflare 账号，创建 Hyperdrive 配置、把它的 id 填进 `cloudflare.config.ts`，创建 R2 存储桶 `ga-guardian-forms`，并设置密钥，其中 `EMAIL_FROM` 用该域名下已通过 Resend 验证的地址。
- 先部署学科：`pnpm nx run math-workers:deploy` 构建数学的 Worker，先部署分片，再部署网关；`pnpm nx run english-workers:deploy` 对英语做同样的事。之后再部署 Web Worker。

管理后台位于 `/admin`。先在账号上以成年人身份回答年龄问题，再用 `pnpm nx run db:grant-admin -- <email>` 授予角色。每个市场一开始都不向未成年人开放，所以试用儿童账号之前要先在后台开放一个市场。在 `web:dev` 运行时，可以这样运行一次保存期限规则：

```bash
curl -X POST -H 'content-type: application/json' -d '{"cron":"0 3 * * *"}' 'http://localhost:5173/cdn-cgi/local/explorer/api/local/scheduled?worker=ga-web'
```

试用方法：注册账号，回答年龄问题，选择“我自己学”，选择「代数基础」，然后参加诊断或跳过；问过题的诊断最后会给出报告，可以保留这门课或换到推荐的课。首页给出接下来的任务；进度图显示每个知识点的状态和估计的记忆程度。

## 6. 运行原生应用

Native Shell 应用调用与 Web 应用相同的 Connect 服务，因此先启动 Web 应用（§5）。它使用项目 fork [greatacademy/nsh](https://github.com/greatacademy/nsh) 的 `greatacademy` 分支上的 Native Shell：上游的 main 加上应用自己的修复。应用的 Rust crate `apps/nsh/native/store`（内购用的 StoreKit，以 `ga/store` 导入）固定了这个分支的一个提交，`nsh` 用它构建各平台的宿主，需要 Git、Rust 和 Xcode。用同一个提交构建 `nsh` 命令：

```bash
git clone --branch greatacademy https://github.com/greatacademy/nsh.git ~/.nsh/source
```

```bash
cd ~/.nsh/source && cargo build --release --locked -p nsh-cli && mkdir -p ~/.nsh/bin ~/.local/bin && ln -sf ~/.nsh/source/target/release/nsh ~/.nsh/bin/nsh && ln -sf ~/.nsh/bin/nsh ~/.local/bin/nsh
```

更新时在那里拉取分支、重新构建，并把 `apps/nsh/native/store/Cargo.toml` 中的 `rev` 改为同一个提交。每个平台第一次运行或打包时都要连同应用的 crate 编译宿主，需要几分钟；之后会复用。一次只构建一个平台，因为这些构建共用一个目录，会互相等待。

```bash
pnpm nx run nsh:dev                   # 在本机打开窗口
```

```bash
pnpm nx run nsh:ios                   # iOS 模拟器；需要 Xcode
```

```bash
pnpm nx run nsh:android               # 模拟器或真机；需要 Android SDK 和 JDK
```

- `apps/nsh/lib/rpc.ts` 中的 `API_URL` 在 `nsh run` 下是 `http://localhost:5173`，桌面端和 iOS 模拟器可以直接访问。Android 需要先运行 `adb reverse tcp:5173 tcp:5173`。如果要给 iPhone 打包，用 `DEV_HOST=0.0.0.0` 启动 Web 应用，并传入 `--api-url http://<本机地址>:5173`。Android 也一样：Native Shell 只在开发构建中允许明文 HTTP，所以当 `--api-url` 以 `http://` 开头时，打包脚本会允许它。
- 页面位于 `apps/nsh/screens`。`nsh:test` 以无头方式运行应用，不需要模拟器；`nsh:typecheck` 运行 `nsh check`，它也会生成 `.nsh/types`。
- 应用用 bearer token 登录，并把它保存在 `Storage` 中。
- 应用启动时显示标志（`screens/Launch.tsx`），直到第一页能完整画出（已登录时是「学习」标签页的第一次应答），最多两秒，然后标志放大并淡出到页面；系统标签栏在它离开时出现。
- 登录后的账号看到四个标签页：学习、进度、课程和我的（`screens/Home.tsx`）。「学习」像网页的学习页一样显示每周目标，窗口宽 1024 点及以上时放在任务旁边的一栏；「我的」打开账号自己的页面（`screens/Account.tsx`：个人资料和邮箱验证、每周目标、联赛用户名和是否参加、修改密码），列出监护人并可移除，也能删除账号，不需要网页。手机上它们在标签栏里，标签栏只在标签页显示时出现：iOS 上是系统标签栏（iOS 26 及以后是 Liquid Glass），Android 上是应用自己绘制的玻璃胶囊（`screens/Home.tsx` 的 `GlassTabs`）；桌面上它们在侧边栏里：学习、进度和课程带图标，用 ⌘1 到 ⌘3（其他系统用 Ctrl）切换，鼠标悬停时显示快捷键，按住 ⌘ 时只显示数字；有一个把侧边栏收起成图标的按钮，收起和展开时宽度带动画，应用会记住收起状态；底部是登录的名字和设置按钮，收起后只有设置按钮，它把「我的」作为「设置」打开，⌘, 也一样。macOS 上窗口没有系统标题栏（`lib/window.ts`）：侧边栏的顶行和各页面的页头代替它，可以拖动窗口；左上角是红黄绿按钮，收起按钮在侧边栏右端，收起后紧挨红黄绿按钮右侧，后面是页面标题（`lib/chrome.ts`）；内容区域挨着侧边栏的左上角是圆角，做题页面的顶栏也在这一行，进度在红黄绿按钮右侧，关闭按钮在最右端（手机上在左侧）。做任务时，1 到 9 或 a 到 i 选择选项，Enter 提交，Escape 离开。
- 设备上选择的配色也会成为 nsh 的 `primary`（`lib/ui.tsx` 的 `followPalette`，通过 `setTheme`），因此系统自带的控件，即 iOS 的标签栏和 Android 对话框的按钮，也会用它的强调色。
- 在手机上，页面向下滚动时标签栏滑出屏幕，向上滚动、回到顶部或打开新页面时重新出现（`lib/ui.tsx` 的 `followScroll` 和 `barStyle`）。
- 在手机上，标签页没有系统标题栏，而是用自己的顶栏（`lib/ui.tsx` 的 `TopBar`），带标志和标签页名称，向上延伸到状态栏下方；页面从它下面滚过，透过一层玻璃（`glass`）：iOS 上是系统的 Liquid Glass，与标签栏一样；Android 上是轻微模糊加一层淡淡的页面底色，顶栏下方有一条细线。Android 的标签栏也是同样的玻璃，不带阴影，因为 Android 会把阴影透过玻璃画出来。顶栏下方底色渐隐，与 iOS 26 的滚动边缘效果一样。从标签页打开的页面保留系统标题栏。
- 从页面顶部下拉会重新读取（`PullScroll`）：一个配色强调色的指示器随下拉出现，转动到读取结束，至少 0.6 秒，这样系统总能收到刷新的开始和结束。只有页面静止在顶部时开始的拖动才算下拉：越过顶部的滚动或快速滑动，以及在它回弹途中接着的一划，回弹时都不显示指示器。
- 页面通过 `query`（`lib/query.ts`）读取服务器，它像网页版一样把回答保存在 TanStack Query 的 `query-core` 里：再次打开的页面立即显示之前读到的内容，超过 30 秒后在后台重新读取。改变数据的调用会把所有回答标为过期，学习者离开任务后，栈上的页面会重新读取；登录或退出时全部清空。长页面（课程列表、课程大纲和进度图）把各行放在滚动视图里的 `List`（`viewport="parent"`）中，它只绑定可见的行，其余的在随后几帧绑定，因此在 Android 上打开页面不会卡顿。
- 桌面上应用会在系统托盘放一个图标（`lib/tray.ts`、`assets/tray.svg`），它的菜单可以打开窗口或某个标签页，也可以退出。
- `nsh test` 在无界面模式下按 iOS 运行，系统标签栏在那里不接受点按，所以切换标签页的测试用 `platform: "macos"` 打开应用，并使用侧边栏。
- 含公式和配图的文本显示在 Web 视图中，它们从 Web 应用的 `/embed` 加载 KaTeX 和 MathLive。`apps/web/vite.config.ts` 把它们复制到 `public/embed`，该目录被 git 忽略。纯文本使用原生视图。
- `nsh test` 不运行 Web 视图，所以作图题和数学输入框没有无头测试。
- Web 视图中的页面如果加载不到 KaTeX 样式表，就改为显示每个公式的 MathML。在 `--target web` 下，页面是没有来源的沙箱框架，所以 `/embed` 允许任意来源。有些内嵌浏览器（例如 Claude 桌面应用的浏览器面板）会拒绝沙箱框架的所有请求，所以要在普通浏览器或原生目标上检查公式。
- 桌面窗口不能缩小到 420×600 点以下（`lib/window.ts`）。
- `pnpm nx run nsh:package -- --target <target>` 构建安装包，应用标识符是 `dev.greatacademy.app`，图标来自 `assets/`。它默认使用 `https://greatacademy.dev`，可用 `--api-url` 指定其他服务器；其他参数（如 `--sign` 和 `--profile`）会传给 `nsh package`。Nx 通过 shell 传递参数，所以当参数值含有括号时（签名身份就是这样），请在 `apps/nsh` 下通过 `mise exec` 用同样的参数运行 `node scripts/package.ts`。
- 图标跟随系统的浅色或深色外观：背景是白色或深色的 surface 令牌。`nsh package` 只接受一个图标，所以脚本随后用 `actool` 为 iOS 和 macOS 编译 `assets/AppIcon.icon`（macOS 保留 `.icns` 给旧系统），把 `assets/icon-dark.png` 作为 Android 夜间模式的启动器图标，然后重新签名。Windows 和 Linux 仍用浅色图标。如果 iOS 宿主链接的 SDK 早于 iOS 26（Native Shell 0.4.0 发布版就是这样），脚本会在签名前让它报告 iOS 26，因为 UIKit 只给这样的应用绘制 Liquid Glass。

## 7. 运行语音服务

语音服务（`apps/voice`，[英语课程 §13.3](english-curriculum.zh-CN.md#133-语音服务)）是由 uv 管理的 Python 项目；`mise install` 会安装两者。`uv run` 第一次使用时按 `uv.lock` 创建 `apps/voice/.venv`，Nx 目标也是如此。

```bash
pnpm nx run-many -t typecheck test lint -p voice   # pyright、pytest、ruff
cd apps/voice && uv run python -m ga_voice.devkeys # 生成用于票据的开发密钥对
```

- 测试不需要网络：语音服务、语音活动检测和 Web Worker 都是模拟的；一个端到端测试在进程内用真实的 WebSocket 运行服务器，包括会话进行中的 `SIGTERM`。
- 服务读取 `VOICE_*` 变量：`VOICE_TICKET_PUBLIC_KEY`（Worker 签发票据所用密钥的公钥）、`VOICE_WORKER_URL` 和 `VOICE_WORKER_CREDENTIAL` 是必需的；`VOICE_SPEECH` 为 `unconfigured`（以 `speech_unavailable` 拒绝会话）或 `fake`（脚本化的语音，仅用于本地开发）。代码中不选定任何语音服务商。
- 像生产环境一样在容器中运行：把 `apps/voice/.env.example` 复制为 `apps/voice/.env.local`（被 git 忽略）并填入公钥，然后：

```bash
docker compose build voice
docker compose up -d voice          # ws://localhost:8089/v1/conversation；/healthz 和 /readyz
docker compose stop voice           # SIGTERM：拒绝新会话，等待进行中的会话结束（最长 25 分钟）
```

- `voice` 服务属于 `voice` profile，所以普通的 `docker compose up -d` 仍然只启动 PostgreSQL。它通过 `http://host.docker.internal:5173` 访问主机上的 `cf dev`；要指向别处，设置 `VOICE_WORKER_URL`。如果容器访问不到 Web 应用，用 `DEV_HOST=0.0.0.0` 启动 Web 应用。
- 容器没有卷，文件系统只读，`/tmp` 在内存中。日志中没有音频或转写文本：Pipecat 自己的日志只保留警告及以上级别，调试输出从不打开。
