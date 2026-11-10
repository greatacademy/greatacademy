#!/usr/bin/env bash
# check.sh renders each overlay and validates it against the Kubernetes schemas, and against the CRD catalog for
# KEDA's ScaledObject and the Prometheus Operator's PodMonitor. It touches no cluster but fetches schemas.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
for overlay in "$root"/deploy/voice/overlays/*/; do
  name="$(basename "$overlay")"
  echo "== $name"
  kustomize build "$overlay" | kubeconform \
    -strict \
    -summary \
    -kubernetes-version 1.33.0 \
    -schema-location default \
    -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
done
