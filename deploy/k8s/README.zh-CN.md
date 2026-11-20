# 集群部署

> [English](README.md) | 简体中文

Great Academy 在 Hetzner Cloud 希尔斯伯勒区域 Talos 集群上运行的全部内容的清单，都在一个命名空间 `greatacademy` 里：API 服务器（`apps/server`），在进程内提供 Connect API、better-auth 和所有学科；它的迁移和定时任务；以及英语的语音服务（`apps/voice`，[英语课程 §13.3](../../docs/english-curriculum.zh-CN.md#133-语音服务)）。站点本身仍是 Cloudflare Worker（`apps/web`），渲染页面并调用 `https://api.greatacademy.dev` 上的 API（[架构 §6](../../docs/architecture.zh-CN.md)）。

| 文件 | 内容 |
| :--- | :--- |
| `namespace.yaml` | 命名空间，采用 restricted Pod 安全标准 |
| `api.yaml` | API 服务器的 Deployment、Service 和 PodDisruptionBudget：迁移作为 init 容器运行，`/healthz` 探针，以用户 10001 运行的只读文件系统 |
| `jobs.yaml` | 运行 API 镜像的 CronJob：引擎定时工作 `daily` 和 `quarter` |
| `voice.yaml` | 语音服务的 Deployment 和 Service：`/readyz` 与 `/healthz` 探针，排空用的 25 分钟宽限期 |
| `scaling.yaml` | 语音服务 `/metrics` 上的 PodMonitor、按 `voice_sessions_active` 之和伸缩的 KEDA ScaledObject、它的 PodDisruptionBudget，以及 API 按 CPU 在二到六个 Pod 之间伸缩的 HorizontalPodAutoscaler |
| `ingress.yaml` | 经 ingress-nginx 的 `api.greatacademy.dev/api/` 和 `voice.greatacademy.dev/v1/conversation`，证书来自 cert-manager |
| `network.yaml` | NetworkPolicy：ingress-nginx 可达 API 和语音服务，语音服务可达 API，Prometheus 可达指标；出站只有 DNS、PostgreSQL 和公网 HTTPS |
| `api.env`、`voice.env` | 非机密的设置，生成为 ConfigMap |
| `keys.py` | 生成 Secret `api`、`voice` 和 `ghcr`，不打印任何值 |
| `push.sh`、`check.sh` | 由 `mise run k8s:push` 和 `mise run k8s:check` 运行 |

## 检查

```bash
mise run k8s:check
```

渲染整个命名空间，用 kubeconform 按 Kubernetes 模式和 CRD 目录校验。它会下载模式，但不接触集群。

## 集群

集群在 `hil` 的 Talos 上运行 Kubernetes 1.33，从工作站的集群目录管理。它自带：

- ingress-nginx，类 `nginx`，位于 Hetzner 负载均衡器之后。两个主机名都经 Cloudflare 代理，API 从 `CF-Connecting-IP` 取得客户端地址。nginx 看到的每个请求都来自 127.0.0.1，所以 Ingress 无法按来源地址放行，改为凭 Cloudflare 的客户端证书放行（见下节）。
- cert-manager 及在 Cloudflare 中完成 DNS-01 的 ClusterIssuer `letsencrypt-prod-issuer`，以及为每个 Ingress 主机写入代理记录的 external-dns。两者的区域都包含 `greatacademy.dev`。
- `cnpg-system` 中 CloudNativePG 的 PostgreSQL 集群 `pg-cluster`，数据库 `greatacademy` 的角色在 Secret `pg-cluster-greatacademy` 里。
- `keda` 中的 KEDA 2.20、`monitoring` 中的 kube-prometheus-stack（其 Prometheus 选择带 `release: kube-prometheus-stack` 标签的 PodMonitor），以及执行 NetworkPolicy 的 Cilium。

## 回源认证

Cloudflare 连接 `api.greatacademy.dev` 和 `voice.greatacademy.dev` 时出示我们自己的客户端证书（按主机名的回源认证，authenticated origin pulls），两个 Ingress 只接受出示了由 `origin-pull-ca.crt` 签发的证书的连接。绕过 Cloudflare 直连负载均衡器的请求得到 400，所以 `CF-Connecting-IP` 一定来自 Cloudflare。区域的 SSL 模式为 Full (strict)：Cloudflare 会校验源站由 cert-manager 签发的证书。

`origin-pull-ca.crt` 是公开的，已提交；kustomize 用它生成 Secret `origin-pull-ca`。CA 的私钥在签发后已丢弃，客户端证书的私钥只存在于 Cloudflare。两张证书都在 2036 年 11 月到期。更换时，用 openssl 生成新的 CA 和客户端证书，用 `cf origin-tls-client-auth hostname-certificates create` 上传客户端证书和私钥，用 `cf origin-tls-client-auth hostnames update` 让两个主机名改用它，待其状态为 `active` 后提交新的 `origin-pull-ca.crt` 并应用。去掉三条 `auth-tls-*` 注解即关闭校验。

## 机密

```bash
python3 deploy/k8s/keys.py --ghcr-from <含 Secret ghcr 的命名空间>
```

在 `KUBECONFIG` 指向集群时，它创建命名空间并写入：

- `api`：由数据库角色拼出的 `DATABASE_URL`；生成的 `BETTER_AUTH_SECRET`、`AI_KEYS_SECRET`、签发语音票据的 Ed25519 密钥（`VOICE_TICKET_PRIVATE_KEY`）和语音服务的凭据（`VOICE_SERVICE_CREDENTIAL`）；以及 git 忽略的 `secrets.local.env` 中的供应商密钥。
- `voice`：同一凭据，名为 `VOICE_API_CREDENTIAL`。
- `ghcr`：拉取私有镜像的令牌，缺少时从另一个命名空间复制。

已有的生成值会被保留；`--rotate` 生成新值，这会让所有人退出登录，AI 供应商的密钥也无法再解密，需管理员重新录入。它把票据公钥写入 `voice.env`，请提交该文件。

供应商密钥放在从 `secrets.local.env.example` 复制出的 `deploy/k8s/secrets.local.env`。两个 Cloudflare 令牌都归账号所有而非个人：

- 签署的表单：一个只对存储桶 `ga-guardian-forms` 授予 Workers R2 Storage Bucket Item 读和写的账号令牌，在 `cf auth login` 授予 `account_api_tokens:create` 范围后用 `cf accounts tokens create` 创建。按 R2 的 S3 API 要求，令牌 id 是 `R2_ACCESS_KEY_ID`，其值的 SHA-256 十六进制是 `R2_SECRET_ACCESS_KEY`。缺少它们时 API 把表单留在内存里，重启即丢失，且分散在各副本之间。
- 邮件：CLI 的 OAuth 客户端不能授予 Email Sending，所以由账号管理员在控制台创建：管理账户 → 账户 API 令牌 → 创建令牌，只给一项权限 Email Sending → 编辑，填为 `CLOUDFLARE_EMAIL_TOKEN`。在此之前邮件只记录到日志，不发送。

Stripe 的 webhook 是 `https://api.greatacademy.dev/api/stripe`，App Store 服务器通知发往 `https://api.greatacademy.dev/api/apple`（[计费](../../docs/billing.zh-CN.md)）。

## 推送镜像

先用可写软件包的个人访问令牌登录 GHCR 一次：

```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
```

然后在源码已提交时：

```bash
mise run k8s:push
```

它打包服务器（`pnpm nx run server:build`），为 `linux/amd64` 构建两个镜像，推送 `ghcr.io/greatacademy/<image>:<commit>`，并把 `kustomization.yaml` 固定到推送的摘要；`mise run k8s:push api` 只推一个。请提交这些固定值。

## 部署

```bash
kubectl apply -k deploy/k8s
kubectl -n greatacademy rollout status deploy/api deploy/voice
```

每个 API Pod 在服务器启动前于 init 容器中运行迁移，并持有 PostgreSQL 咨询锁，使同时启动的 Pod 依次迁移；新镜像的 schema 在它的任何 Pod 提供服务之前就已就位。迁移在滚动更新结束前必须仍适用于上一个镜像的 Pod：先增加，下一个版本再删除。ConfigMap 的名字带有内容的哈希，所以修改 `api.env` 或 `voice.env` 会滚动更新 Pod。语音 Pod 会排空最多 25 分钟，让进行中的会话结束。

把成年人的账号设为管理员：

```bash
kubectl -n greatacademy exec deploy/api -- node server.mjs grant-admin <email>
```
