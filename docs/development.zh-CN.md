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

此表随仓库增长；[架构 §3](architecture.zh-CN.md#3-仓库结构) 给出目标结构。

## 4. 添加一个包

1. 在 `apps/`、`libs/`、`content/` 或 `tools/` 下创建目录。
2. 添加 `package.json`：包名为 `@ga/<name>`，`"type": "module"`，`"private": true`，依赖版本精确固定，包含 `typecheck`、`test`、`lint` 脚本，以及 `"nx": { "name": "<name>" }`。
3. 添加继承 `../../tsconfig.base.json` 的 `tsconfig.json`。
4. 库导出源码：`"exports": { ".": "./src/index.ts" }`。
5. 执行 `pnpm install`，然后运行检查。
