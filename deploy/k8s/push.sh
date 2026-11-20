#!/usr/bin/env bash
# push.sh builds the images of deploy/k8s for linux/amd64 from the committed sources, pushes them to GHCR tagged with
# the commit, and pins kustomization.yaml to their digests. Usage: mise run k8s:push [api] [voice] (both by default).
# It needs `docker login ghcr.io` first, with a token that may write packages.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"
images=("$@")
[ ${#images[@]} -gt 0 ] || images=(api voice)
if [ -n "$(git status --porcelain -- apps libs content)" ]; then
  echo "apps, libs or content have uncommitted changes; commit them so the images match a commit" >&2
  exit 1
fi
tag="$(git rev-parse --short=12 HEAD)"
metadata="$(mktemp)"
trap 'rm -f "$metadata"' EXIT

for image in "${images[@]}"; do
  case "$image" in
    api)
      # The server is bundled into one file with the migrations beside it (apps/server/Dockerfile).
      pnpm nx run server:build --skip-nx-cache
      context="$root/apps/server"
      ;;
    voice) context="$root/apps/voice" ;;
    *) echo "no image named $image" >&2; exit 1 ;;
  esac
  repository="ghcr.io/greatacademy/$image"
  # Hetzner's cloud servers are x86. No provenance attestation, so the digest is the image's own.
  docker buildx build \
    --platform linux/amd64 \
    --provenance=false \
    --tag "$repository:$tag" \
    --metadata-file "$metadata" \
    --push \
    "$context"
  digest="$(sed -n 's/.*"containerimage.digest": *"\(sha256:[0-9a-f]*\)".*/\1/p' "$metadata")"
  [ -n "$digest" ] || { echo "the build of $image reported no digest" >&2; exit 1; }
  (cd deploy/k8s && kustomize edit set image "$image=$repository@$digest")
  echo "$repository:$tag is $repository@$digest, pinned in deploy/k8s/kustomization.yaml"
done
