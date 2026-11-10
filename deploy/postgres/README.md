# PostgreSQL Tunnel

> English | [简体中文](README.zh-CN.md)

The database is `greatacademy` on the shared CloudNativePG cluster `pg-cluster` (namespace `cnpg-system`), which this repository does not deploy. These manifests are the path to it: two `cloudflared` pods in the namespace `ga-postgres` run the remotely managed Tunnel `greatacademy-postgres`, whose public hostname `db.greatacademy.dev` routes to `tcp://pg-cluster-rw.cnpg-system.svc.cluster.local:5432` ([Architecture §6](../../docs/architecture.md#6-deployment)).

| File | Contents |
| :--- | :--- |
| `namespace.yaml` | The namespace, under the restricted Pod Security Standard |
| `cloudflared.yaml` | The Tunnel's two pods, which need no inbound port |
| `network.yaml` | A NetworkPolicy: egress is DNS, Cloudflare's edge and port 5432 of `pg-cluster`'s pods |

## How It Was Made

- The Tunnel, with `cf tunnels create --config-src cloudflare`, `cf tunnels config update` for its ingress and `cf dns records create` for a proxied CNAME to it. Its token was piped from `cf tunnels token get` into the Secret `cloudflared-token`, never printed.
- The Access application `greatacademy-db` on `db.greatacademy.dev`, whose only policy admits the service token `greatacademy-hyperdrive`, so nothing else reaches the database through the hostname.
- The Hyperdrive configuration `greatacademy`, with the database's owner `greatacademy` (password in the Secret `pg-cluster-greatacademy` of `cnpg-system`) and the service token. Its query cache is off and it opens at most 20 connections.

## Deploying

```bash
kubectl apply -k deploy/postgres
```

## Migrations

Migrations run from a workstation through a port forward to the primary:

```bash
kubectl -n cnpg-system port-forward svc/pg-cluster-rw 54330:5432
DATABASE_URL="postgres://greatacademy:<password>@127.0.0.1:54330/greatacademy?sslmode=require" pnpm nx run db:migrate
```
