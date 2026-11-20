#!/usr/bin/env python3
"""keys.py makes the Secrets of the namespace greatacademy, printing none of their values.

Usage, with KUBECONFIG naming the cluster: python3 deploy/k8s/keys.py [--rotate]

- api: what the API server reads. It generates BETTER_AUTH_SECRET, AI_KEYS_SECRET, the Ed25519 key that signs voice
  tickets and the credential the voice service presents; it builds DATABASE_URL from the role of the database
  greatacademy in pg-cluster (the Secret pg-cluster-greatacademy of cnpg-system); and it takes the vendors' keys from
  deploy/k8s/secrets.local.env, which git ignores (secrets.local.env.example lists them).
- voice: the voice service's credential, the same as the API's VOICE_SERVICE_CREDENTIAL.
- ghcr: the token that pulls the images, copied from --ghcr-from (a namespace's Secret ghcr) when it is missing.

Generated values are kept from the Secret already there unless --rotate is given, which signs everyone out and
makes the AI vendors' keys unreadable, so that they must be entered again. The public half of the ticket key is
written to voice.env, which is not secret and is committed.
"""

from __future__ import annotations

import argparse
import base64
import json
import secrets
import subprocess
import sys
import urllib.parse
from pathlib import Path

HERE = Path(__file__).resolve().parent
NAMESPACE = "greatacademy"
DATABASE = "greatacademy"
DATABASE_HOST = "pg-cluster-rw.cnpg-system.svc.cluster.local:5432"
GENERATED = ("BETTER_AUTH_SECRET", "AI_KEYS_SECRET", "VOICE_TICKET_PRIVATE_KEY", "VOICE_SERVICE_CREDENTIAL")
VENDORS = (
    "CLOUDFLARE_EMAIL_TOKEN",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "RESEND_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_WALLET",
    "STRIPE_TAX",
    "APPLE_IAP_KEY_ID",
    "APPLE_IAP_ISSUER_ID",
    "APPLE_IAP_KEY",
)


def kubectl(*args: str, stdin: bytes | None = None) -> bytes:
    """kubectl runs kubectl, returning its output; a failure stops the script without showing what was sent."""
    done = subprocess.run(["kubectl", *args], input=stdin, capture_output=True, check=False)
    if done.returncode != 0:
        sys.exit(f"kubectl {args[0]} failed: {done.stderr.decode(errors='replace').strip()}")
    return done.stdout


def secret_data(namespace: str, name: str) -> dict[str, str] | None:
    """secret_data reads a Secret's values, or None when there is none."""
    done = subprocess.run(
        ["kubectl", "-n", namespace, "get", "secret", name, "-o", "json"], capture_output=True, check=False
    )
    if done.returncode != 0:
        return None
    data = json.loads(done.stdout).get("data") or {}
    return {k: base64.b64decode(v).decode() for k, v in data.items()}


def b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def ticket_keys() -> tuple[str, str]:
    """ticket_keys makes an Ed25519 key: its PKCS #8 DER and its raw public half, both in base64url."""
    der = subprocess.run(
        ["openssl", "genpkey", "-algorithm", "ed25519", "-outform", "DER"], capture_output=True, check=True
    ).stdout
    public = subprocess.run(
        ["openssl", "pkey", "-inform", "DER", "-pubout", "-outform", "DER"], input=der, capture_output=True, check=True
    ).stdout
    return b64url(der), b64url(public[-32:])


def public_of(private: str) -> str:
    """public_of gives the raw public half of a PKCS #8 Ed25519 key in base64url."""
    der = base64.urlsafe_b64decode(private + "=" * (-len(private) % 4))
    public = subprocess.run(
        ["openssl", "pkey", "-inform", "DER", "-pubout", "-outform", "DER"], input=der, capture_output=True, check=True
    ).stdout
    return b64url(public[-32:])


def read_env(path: Path) -> dict[str, str]:
    """read_env reads KEY=value lines, skipping comments and blank lines; a value may span lines inside double quotes."""
    if not path.exists():
        return {}
    out: dict[str, str] = {}
    lines = path.read_text().splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        if value.startswith('"') and not (len(value) > 1 and value.endswith('"')):
            parts = [value[1:]]
            while i < len(lines) and not lines[i].endswith('"'):
                parts.append(lines[i])
                i += 1
            if i < len(lines):
                parts.append(lines[i][:-1])
                i += 1
            value = "\n".join(parts)
        elif value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        out[key.strip()] = value
    return out


def apply_secret(name: str, values: dict[str, str], kind: str = "Opaque") -> None:
    secret = {
        "apiVersion": "v1",
        "kind": "Secret",
        "type": kind,
        "metadata": {"name": name, "namespace": NAMESPACE, "labels": {"app.kubernetes.io/part-of": "greatacademy"}},
        "stringData": values,
    }
    kubectl("apply", "-f", "-", stdin=json.dumps(secret).encode())
    print(f"secret {name}: {', '.join(sorted(values))}")


def set_public_key(public: str) -> None:
    path = HERE / "voice.env"
    lines = [
        f"VOICE_TICKET_PUBLIC_KEY={public}" if line.startswith("VOICE_TICKET_PUBLIC_KEY=") else line
        for line in path.read_text().splitlines()
    ]
    path.write_text("\n".join(lines) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--rotate", action="store_true", help="generate new values for the generated keys")
    parser.add_argument("--ghcr-from", help="a namespace whose Secret ghcr to copy when greatacademy has none")
    args = parser.parse_args()

    kubectl("apply", "-f", str(HERE / "namespace.yaml"))
    old = secret_data(NAMESPACE, "api") or {}
    values: dict[str, str] = {}

    role = secret_data("cnpg-system", f"pg-cluster-{DATABASE}")
    if not role:
        sys.exit(f"no Secret pg-cluster-{DATABASE} in cnpg-system")
    user = urllib.parse.quote(role["username"], safe="")
    password = urllib.parse.quote(role["password"], safe="")
    values["DATABASE_URL"] = f"postgres://{user}:{password}@{DATABASE_HOST}/{DATABASE}?sslmode=require"

    for key in GENERATED:
        if key in old and not args.rotate:
            values[key] = old[key]
    values.setdefault("BETTER_AUTH_SECRET", secrets.token_urlsafe(48))
    values.setdefault("AI_KEYS_SECRET", secrets.token_urlsafe(48))
    values.setdefault("VOICE_SERVICE_CREDENTIAL", secrets.token_urlsafe(32))
    if "VOICE_TICKET_PRIVATE_KEY" in values:
        public = public_of(values["VOICE_TICKET_PRIVATE_KEY"])
    else:
        values["VOICE_TICKET_PRIVATE_KEY"], public = ticket_keys()
    set_public_key(public)

    local = read_env(HERE / "secrets.local.env")
    for key in VENDORS:
        value = local.get(key) or old.get(key)
        if value:
            values[key] = value

    apply_secret("api", values)
    apply_secret("voice", {"VOICE_API_CREDENTIAL": values["VOICE_SERVICE_CREDENTIAL"]})

    if secret_data(NAMESPACE, "ghcr") is None:
        if not args.ghcr_from:
            sys.exit("no Secret ghcr in greatacademy; pass --ghcr-from <namespace> to copy one")
        pull = secret_data(args.ghcr_from, "ghcr")
        if not pull:
            sys.exit(f"no Secret ghcr in {args.ghcr_from}")
        apply_secret("ghcr", pull, "kubernetes.io/dockerconfigjson")


if __name__ == "__main__":
    main()
