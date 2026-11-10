#!/usr/bin/env bash
# push.sh builds the voice image from the committed apps/voice for linux/amd64, pushes it to GHCR tagged with the
# commit, and pins an overlay to the pushed digest. Usage: mise run voice:push <test|production>
# It needs `docker login ghcr.io` first, with a token that may write packages.
set -euo pipefail

overlay="${1:?usage: mise run voice:push <test|production>}"
root="$(git rev-parse --show-toplevel)"
dir="$root/deploy/voice/overlays/$overlay"
[ -d "$dir" ] || { echo "no overlay named $overlay" >&2; exit 1; }
if [ -n "$(git -C "$root" status --porcelain -- apps/voice)" ]; then
  echo "apps/voice has uncommitted changes; commit them so the image matches a commit" >&2
  exit 1
fi

repository="${VOICE_IMAGE:-ghcr.io/greatacademy/voice}"
tag="$(git -C "$root" rev-parse --short=12 HEAD)"
metadata="$(mktemp)"
trap 'rm -f "$metadata"' EXIT

# Hetzner's cloud servers in Hillsboro are x86. No provenance attestation, so the digest is the image's own.
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --tag "$repository:$tag" \
  --metadata-file "$metadata" \
  --push \
  "$root/apps/voice"

digest="$(sed -n 's/.*"containerimage.digest": *"\(sha256:[0-9a-f]*\)".*/\1/p' "$metadata")"
[ -n "$digest" ] || { echo "the build reported no digest" >&2; exit 1; }
(cd "$dir" && kustomize edit set image "ga-voice=$repository@$digest")
echo "$repository:$tag is $repository@$digest, pinned in deploy/voice/overlays/$overlay"
