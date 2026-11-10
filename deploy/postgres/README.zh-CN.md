# PostgreSQL Tunnel

> [English](README.md) | 简体中文

数据库是共享的 CloudNativePG 集群 `pg-cluster`（命名空间 `cnpg-system`）中的 `greatacademy`，本仓库不部署它。这些清单是通往它的路径：命名空间 `ga-postgres` 中的两个 `cloudflared` pod 运行远程管理的 Tunnel `greatacademy-postgres`，它的公共主机名 `db.greatacademy.dev` 路由到 `tcp://pg-cluster-rw.cnpg-system.svc.cluster.local:5432`（[架构 §6](../../docs/architecture.zh-CN.md#6-部署)）。

| 文件 | 内容 |
| :--- | :--- |
| `namespace.yaml` | 命名空间，采用 restricted Pod 安全标准 |
| `cloudflared.yaml` | Tunnel 的两个 pod，不需要入站端口 |
| `network.yaml` | NetworkPolicy：出站只有 DNS、Cloudflare 边缘和 `pg-cluster` pod 的 5432 端口 |

## 创建方式

- Tunnel：用 `cf tunnels create --config-src cloudflare` 创建，`cf tunnels config update` 设置入口规则，`cf dns records create` 创建指向它的代理 CNAME。令牌从 `cf tunnels token get` 直接通过管道写入 Secret `cloudflared-token`，从未打印。
- `db.greatacademy.dev` 上的 Access 应用 `greatacademy-db`，唯一的策略只放行服务令牌 `greatacademy-hyperdrive`，因此其他任何东西都无法经这个主机名访问数据库。
- Hyperdrive 配置 `greatacademy`，使用数据库的所有者 `greatacademy`（密码在 `cnpg-system` 的 Secret `pg-cluster-greatacademy` 中）和该服务令牌。它的查询缓存关闭，最多打开 20 个连接。

## 部署

```bash
kubectl apply -k deploy/postgres
```

## 迁移

迁移在工作站上通过到主库的端口转发执行：

```bash
kubectl -n cnpg-system port-forward svc/pg-cluster-rw 54330:5432
DATABASE_URL="postgres://greatacademy:<password>@127.0.0.1:54330/greatacademy?sslmode=require" pnpm nx run db:migrate
```
