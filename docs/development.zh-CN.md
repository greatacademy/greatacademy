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
| `engine` | `libs/engine` | 学习引擎：前沿、FIRe、任务选择、课程、复习、测验、诊断（[学习引擎](learning-engine.zh-CN.md)） |
| `proto` | `libs/proto` | 契约；修改 `.proto` 文件后执行 `pnpm nx run proto:generate` |
| `db` | `libs/db` | Drizzle schema、迁移、数据访问；修改 schema 后执行 `pnpm nx run db:generate -- --name <change>` |
| `api` | `libs/api` | Connect 服务与会话执行器，在 PGlite 上端到端测试 |
| `web` | `apps/web` | Web 应用：Workers 上的 TanStack Start、better-auth，以及挂在 `/api` 下的 Connect 服务（§5） |
| `mobile` | `apps/mobile` | Expo 应用，目前是骨架：课程列表和课程大纲，数据来自 Web 应用的 API（§6） |
| `simulate` | `tools/simulate` | 用于调校引擎的模拟学生：`pnpm nx run simulate:simulate`（[学习引擎 §8](learning-engine.zh-CN.md#8-参数)） |

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

- `apps/web/cloudflare.config.ts` 声明 Worker：Hyperdrive 绑定 `HYPERDRIVE`，其 `dev.connectionString` 指向容器；密钥 `BETTER_AUTH_SECRET`，本地从 `.dev.vars` 读取（已被 git 忽略）。
- `pnpm nx run web:typecheck` 会先运行 `cf workers types`，把 `Env` 类型声明写入 `.cloudflare/types`。
- `pnpm nx run web:build` 把 Worker 构建到 `.cloudflare/output`；`cf deploy` 负责部署。部署前需创建 Hyperdrive 配置、把它的 id 填进 `cloudflare.config.ts`，并设置密钥。

试用方法：注册账号，打开「代数基础」，选修，然后参加诊断或跳过。学习主页给出接下来的任务；进度图显示每个知识点的状态和估计的记忆程度。

## 6. 运行移动应用

Expo 应用调用与 Web 应用相同的 Connect 服务，因此先启动 Web 应用（§5）。

```bash
pnpm nx run mobile:dev                # Metro；按 i 打开 iOS 模拟器
```

- API 地址默认为 `http://localhost:5173`，iOS 模拟器可以直接访问。在真机或 Android 模拟器上，把 `EXPO_PUBLIC_API_URL` 设为设备能访问的地址，例如 `http://192.168.1.10:5173`。
- 应用使用 Expo Router，页面位于 `apps/mobile/src/app`。在 `apps/mobile` 中运行 `npx expo export --platform ios` 可以不启动模拟器而打包应用，用来检查 Metro 能否解析工作区中的包。
- 应用目前是骨架（路线图 P6）：登录、学习主页和学习播放器暂时只在 Web 应用中提供。
