"""Development keys: ``uv run python -m ga_voice.devkeys`` prints a new ticket key pair.

The private key goes to the web Worker's ``.dev.vars``, which signs tickets;
the public key goes to ``apps/voice/.env.local``. Never use these in production.
"""

import base64

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, NoEncryption, PrivateFormat

from ga_voice.tickets import encode_public_key


def new_key_pair() -> tuple[str, str]:
    """new_key_pair returns a raw Ed25519 private key and its public key, both base64url without padding."""
    private_key = Ed25519PrivateKey.generate()
    raw = private_key.private_bytes(Encoding.Raw, PrivateFormat.Raw, NoEncryption())
    private = base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")
    return private, encode_public_key(private_key.public_key())


if __name__ == "__main__":
    private, public = new_key_pair()
    print(f"VOICE_TICKET_PRIVATE_KEY={private}")  # noqa: T201
    print(f"VOICE_TICKET_PUBLIC_KEY={public}")  # noqa: T201
