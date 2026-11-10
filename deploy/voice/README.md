# Voice Service Deployment

> English | [简体中文](README.zh-CN.md)

Manifests for the voice service of English (`apps/voice`, [English curriculum §13.3](../../docs/english-curriculum.md#133-the-voice-service)) on the Talos cluster in Hetzner Cloud's Hillsboro region. They are a Kustomize base and two overlays, `test` (namespace `voice-test`) and `production` (namespace `voice`).

| File | Contents |
| :--- | :--- |
| `base/voice.yaml` | The Deployment and its Service: probes on `/readyz` and `/healthz`, a 25-minute grace period for draining, a read-only filesystem as user 10001 |
| `base/scaling.yaml` | A PodMonitor on `/metrics`, a KEDA ScaledObject on the sum of `voice_sessions_active`, and a PodDisruptionBudget |
| `base/network.yaml` | NetworkPolicies: only `cloudflared` reaches the pods and only Prometheus their metrics; egress is DNS and public HTTPS |
| `base/cloudflared.yaml` | Two `cloudflared` pods running the Tunnel, which needs no inbound port |
| `overlays/*/config.env` | The web Worker's URL and the tickets' public key, filled in before the first deploy |
| `push.sh`, `check.sh` | Run by `mise run voice:push` and `mise run voice:check` |

## Checking

```bash
mise run voice:check
```

Renders each overlay and validates it with kubeconform against the Kubernetes schemas and the CRD catalog. It fetches schemas but touches no cluster.

## The Cluster

The cluster runs Kubernetes 1.33 on Talos in `hil`, set up with Terraform, and has these installed before the first deploy:

- KEDA 2.20, in the namespace `keda`. KEDA 2.21 needs Kubernetes 1.34 or later.
- kube-prometheus-stack, released as `kube-prometheus-stack` in the namespace `monitoring`, so that Prometheus is at `kube-prometheus-stack-prometheus.monitoring.svc:9090`. Its Prometheus selects PodMonitors labeled `release: kube-prometheus-stack` in every namespace, which the voice PodMonitor carries.
- Cilium, which enforces NetworkPolicies.

## Pushing an Image

Sign in to GHCR once with a personal access token that may write packages:

```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
```

Then, with `apps/voice` committed:

```bash
mise run voice:push test
```

It builds for `linux/amd64`, pushes `ghcr.io/greatacademy/voice:<commit>`, and pins `overlays/test` to the pushed digest. Commit the overlay. Set `VOICE_IMAGE` to push elsewhere.

## Secrets

Secrets are created by hand and never committed. For each namespace:

```bash
kubectl -n voice-test create secret generic voice-secrets --from-literal=VOICE_WORKER_CREDENTIAL=<credential>
kubectl -n voice-test create secret generic cloudflared-token --from-literal=token=<tunnel token>
kubectl -n voice-test create secret docker-registry ghcr --docker-server=ghcr.io --docker-username=<github-user> --docker-password=<token that may read packages>
```

The credential is the one the web Worker accepts from the voice service. Each namespace has its own remotely managed Tunnel, apart from the cluster's other Tunnel: `greatacademy-voice-test` routes `voice-test.greatacademy.dev` to `http://voice:8080`, through a proxied CNAME to the Tunnel. It was made with `cf tunnels create --config-src cloudflare`, `cf tunnels config update` and `cf dns records create`, and its token piped from `cf tunnels token get` into the Secret, never printed. Production gets `greatacademy-voice` and `voice.greatacademy.dev` the same way. The GHCR package is private, so pods pull it with the `ghcr` Secret. The voice hostname also gets WAF and rate limiting rules.

## Deploying

```bash
kubectl apply -k deploy/voice/overlays/test
```

The ConfigMap's name carries a hash of its contents, so changing `config.env` rolls the pods. Each rollout or scale-down drains: a pod stops taking sessions and waits for its running ones, for up to 25 minutes.
