#!/usr/bin/env bash
# check.sh renders deploy/k8s and validates it against the Kubernetes schemas, and against the CRD catalog for
# KEDA's ScaledObject and the Prometheus Operator's PodMonitor. It touches no cluster but fetches schemas.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
kustomize build "$root/deploy/k8s" | kubeconform \
  -strict \
  -summary \
  -kubernetes-version 1.33.0 \
  -schema-location default \
  -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
