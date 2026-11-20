# Cluster Deployment

> English | [简体中文](README.zh-CN.md)

The manifests of everything Great Academy runs on the Talos cluster in Hetzner Cloud's Hillsboro region, in one namespace, `greatacademy`: the API server (`apps/server`), which serves the Connect API, better-auth and every subject in-process, its scheduled jobs and migrations, and the voice service of English (`apps/voice`, [English curriculum §13.3](../../docs/english-curriculum.md#133-the-voice-service)). The site itself stays a Cloudflare Worker (`apps/web`), which renders pages and calls the API at `https://api.greatacademy.dev` ([architecture §6](../../docs/architecture.md)).

| File | Contents |
| :--- | :--- |
| `namespace.yaml` | The namespace, under the restricted Pod Security Standard |
| `api.yaml` | The API server's Deployment, Service and PodDisruptionBudget: two replicas, probes on `/healthz`, a read-only filesystem as user 10001 |
| `jobs.yaml` | CronJobs running the API's image: `daily` and `quarter`, the engine's scheduled work, and `migrate`, suspended, run by hand |
| `voice.yaml` | The voice service's Deployment and Service: probes on `/readyz` and `/healthz`, a 25-minute grace period for draining |
| `scaling.yaml` | A PodMonitor on the voice service's `/metrics`, a KEDA ScaledObject on the sum of `voice_sessions_active`, and its PodDisruptionBudget |
| `ingress.yaml` | `api.greatacademy.dev/api/` and `voice.greatacademy.dev/v1/conversation` through ingress-nginx, with certificates from cert-manager |
| `network.yaml` | NetworkPolicies: ingress-nginx reaches the API and the voice service, the voice service the API, Prometheus the metrics; egress is DNS, PostgreSQL and public HTTPS |
| `api.env`, `voice.env` | The settings that are not secret, made into ConfigMaps |
| `keys.py` | Makes the Secrets `api`, `voice` and `ghcr`, printing no value |
| `push.sh`, `check.sh` | Run by `mise run k8s:push` and `mise run k8s:check` |

## Checking

```bash
mise run k8s:check
```

Renders the namespace and validates it with kubeconform against the Kubernetes schemas and the CRD catalog. It fetches schemas but touches no cluster.

## The Cluster

The cluster runs Kubernetes 1.33 on Talos in `hil` and is managed from the workstation's cluster folder. These come with it:

- ingress-nginx, class `nginx`, behind a Hetzner load balancer. Both hostnames are proxied by Cloudflare, and the API takes the client's address from `CF-Connecting-IP`. nginx sees every request as coming from 127.0.0.1, so an Ingress cannot allow addresses by source; it admits Cloudflare by its client certificate instead (below).
- cert-manager with the ClusterIssuer `letsencrypt-prod-issuer`, which solves DNS-01 in Cloudflare, and external-dns, which writes a proxied record for each Ingress host. Both list `greatacademy.dev` among their zones.
- The PostgreSQL cluster `pg-cluster` of CloudNativePG in `cnpg-system`, with the database `greatacademy` and its role in the Secret `pg-cluster-greatacademy`.
- KEDA 2.20 in `keda`, kube-prometheus-stack in `monitoring` (its Prometheus selects PodMonitors labeled `release: kube-prometheus-stack`), and Cilium, which enforces NetworkPolicies.

## Authenticated Origin Pulls

Cloudflare presents a client certificate of our own when it connects to `api.greatacademy.dev` and `voice.greatacademy.dev` (per-hostname authenticated origin pulls), and both Ingresses accept only a connection that presents a certificate signed by `origin-pull-ca.crt`. A request that goes around Cloudflare to the load balancer gets 400, so `CF-Connecting-IP` always comes from Cloudflare. The zone's SSL mode is Full (strict): Cloudflare checks the origins' certificates from cert-manager.

`origin-pull-ca.crt` is public and committed; kustomize makes the Secret `origin-pull-ca` from it. The CA's key was discarded after signing, and the client certificate's key lives only in Cloudflare. Both certificates expire in November 2036. To replace them, make a new CA and client certificate with openssl, upload the client certificate and key with `cf origin-tls-client-auth hostname-certificates create`, point both hostnames at it with `cf origin-tls-client-auth hostnames update`, and once their status is `active`, commit the new `origin-pull-ca.crt` and apply. Removing the three `auth-tls-*` annotations turns the check off.

## Secrets

```bash
python3 deploy/k8s/keys.py --ghcr-from <namespace with a Secret ghcr>
```

With `KUBECONFIG` naming the cluster, it creates the namespace and writes:

- `api`: `DATABASE_URL`, built from the database's role; `BETTER_AUTH_SECRET`, `AI_KEYS_SECRET`, the Ed25519 key that signs voice tickets (`VOICE_TICKET_PRIVATE_KEY`) and the voice service's credential (`VOICE_SERVICE_CREDENTIAL`), generated; and the vendors' keys from `secrets.local.env`, which git ignores.
- `voice`: the same credential, as `VOICE_API_CREDENTIAL`.
- `ghcr`: the token that pulls the private images, copied from another namespace when missing.

It keeps generated values already there; `--rotate` makes new ones, which signs everyone out and leaves the AI vendors' keys unreadable until administrators enter them again. It writes the tickets' public key into `voice.env`; commit that.

The vendors' keys go in `deploy/k8s/secrets.local.env`, copied from `secrets.local.env.example`. Both Cloudflare tokens are owned by the account rather than a user:

- Signed forms: an account token with Workers R2 Storage Bucket Item Read and Write on the bucket `ga-guardian-forms` alone, made with `cf accounts tokens create` after `cf auth login` grants the scope `account_api_tokens:create`. Its id is `R2_ACCESS_KEY_ID` and the SHA-256 of its value, in hex, `R2_SECRET_ACCESS_KEY`, as R2's S3 API expects. Without them the API keeps forms in memory, which loses them on a restart and splits them between replicas.
- Email: the CLI's OAuth client may not grant Email Sending, so an account administrator makes it in the dashboard: Manage Account → Account API Tokens → Create Token, with the one permission Email Sending → Edit, as `CLOUDFLARE_EMAIL_TOKEN`. Until then emails are logged, not sent.

Stripe's webhook is `https://api.greatacademy.dev/api/stripe` and App Store Server Notifications go to `https://api.greatacademy.dev/api/apple` ([billing](../../docs/billing.md)).

## Pushing Images

Sign in to GHCR once with a personal access token that may write packages:

```bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
```

Then, with the sources committed:

```bash
mise run k8s:push
```

It bundles the server (`pnpm nx run server:build`), builds both images for `linux/amd64`, pushes `ghcr.io/greatacademy/<image>:<commit>`, and pins `kustomization.yaml` to the pushed digests; `mise run k8s:push api` pushes one. Commit the pins.

## Deploying

```bash
kubectl apply -k deploy/k8s
kubectl -n greatacademy create job --from=cronjob/migrate migrate-$(date +%s)
kubectl -n greatacademy rollout status deploy/api deploy/voice
```

Apply first, so that a new image's migrations run from that image, then migrate before the API needs the new schema. The ConfigMaps' names carry a hash of their contents, so changing `api.env` or `voice.env` rolls the pods. A voice pod drains for up to 25 minutes, finishing its running sessions.

An adult's account becomes an administrator with:

```bash
kubectl -n greatacademy exec deploy/api -- node server.mjs grant-admin <email>
```
