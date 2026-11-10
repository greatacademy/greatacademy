# 语音服务部署

> [English](README.md) | 简体中文

英语语音服务（`apps/voice`，[英语课程 §13.3](../../docs/english-curriculum.zh-CN.md#133-语音服务)）在 Hetzner Cloud 希尔斯伯勒区域 Talos 集群上的清单。它们是一个 Kustomize base 和两个 overlay：`test`（命名空间 `voice-test`）和 `production`（命名空间 `voice`）。

| 文件 | 内容 |
| :--- | :--- |
| `base/voice.yaml` | Deployment 及其 Service：`/readyz` 和 `/healthz` 探针、用于排空的 25 分钟宽限期、以用户 10001 运行在只读文件系统上 |
| `base/scaling.yaml` | 抓取 `/metrics` 的 PodMonitor、按 `voice_sessions_active` 之和扩缩的 KEDA ScaledObject，以及 PodDisruptionBudget |
| `base/network.yaml` | NetworkPolicy：只有 `cloudflared` 能访问 pod，只有 Prometheus 能访问指标；出站只有 DNS 和公网 HTTPS |
| `base/cloudflared.yaml` | 运行 Tunnel 的两个 `cloudflared` pod，不需要入站端口 |
| `overlays/*/config.env` | Web Worker 的 URL 和票据的公钥，首次部署前填写 |
| `push.sh`、`check.sh` | 由 `mise run voice:push` 和 `mise run voice:check` 运行 |

## 校验

```bash
mise run voice:check
```

渲染每个 overlay，并用 kubeconform 按 Kubernetes 结构和 CRD 目录校验。它会下载结构定义，但不接触任何集群。

## 集群

集群在 `hil` 的 Talos 上运行 Kubernetes 1.33，用 Terraform 搭建，首次部署前已安装：

- KEDA 2.20，在命名空间 `keda`。KEDA 2.21 需要 Kubernetes 1.34 或更高版本。
- kube-prometheus-stack，以 `kube-prometheus-stack` 为发布名安装在命名空间 `monitoring`，因此 Prometheus 位于 `kube-prometheus-stack-prometheus.monitoring.svc:9090`。它的 Prometheus 选择所有命名空间中带 `release: kube-prometheus-stack` 标签的 PodMonitor，语音服务的 PodMonitor 带有这个标签。
- Cilium，它执行 NetworkPolicy。

## 推送镜像

用一个可以写入 packages 的个人访问令牌登录 GHCR 一次：

```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
```

然后，在 `apps/voice` 已提交的情况下：

```bash
mise run voice:push test
```

它为 `linux/amd64` 构建，推送 `ghcr.io/greatacademy/voice:<commit>`，并把 `overlays/test` 固定到推送得到的 digest。之后提交该 overlay。设置 `VOICE_IMAGE` 可推送到别处。

## 密钥

Secret 手动创建，从不提交。每个命名空间：

```bash
kubectl -n voice-test create secret generic voice-secrets --from-literal=VOICE_WORKER_CREDENTIAL=<credential>
kubectl -n voice-test create secret generic cloudflared-token --from-literal=token=<tunnel token>
kubectl -n voice-test create secret docker-registry ghcr --docker-server=ghcr.io --docker-username=<github-user> --docker-password=<可读取 packages 的令牌>
```

credential 是 Web Worker 接受的、来自语音服务的凭据。Tunnel 令牌来自在 Cloudflare 控制台（Zero Trust、Networks、Tunnels）创建的 Tunnel，其公共主机名路由到 `http://voice:8080`。GHCR 的 package 是私有的，所以 pod 用 `ghcr` Secret 拉取镜像。语音主机名还要配置 WAF 和限流规则。

## 部署

```bash
kubectl apply -k deploy/voice/overlays/test
```

ConfigMap 的名称带有内容的哈希，所以修改 `config.env` 会滚动更新 pod。每次滚动更新或缩容都会排空：pod 停止接收会话，并等待运行中的会话，最长 25 分钟。
