"""Session tickets: signed by the web Worker, verified here with its public key.

A ticket is ``<payload>.<signature>``, both base64url without padding. The
payload is UTF-8 JSON::

    {"v": 1, "id": "...", "learner": "...", "course": "...", "session": "...",
     "level": {"cefr": "a2"} | {"grade": 4} | {}, "iat": 1700000000, "exp": 1700000060}

The signature is Ed25519 over the payload bytes as sent (before decoding).
A ticket is valid for about 60 seconds and may be used once.
"""

import base64
import binascii
import json
from collections.abc import Callable
from dataclasses import dataclass
from typing import cast

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

from ga_voice.levels import LearnerLevel

TICKET_VERSION = 1
"""TICKET_VERSION is the payload version this service accepts."""

MAX_LIFETIME_SECS = 120
"""MAX_LIFETIME_SECS refuses tickets issued for longer than this, whatever their signature."""

CLOCK_LEEWAY_SECS = 5
"""CLOCK_LEEWAY_SECS allows for clock skew between the Worker and this service."""


class TicketError(Exception):
    """TicketError is raised when a ticket is refused; ``code`` is safe to send to the client."""

    code = "ticket_invalid"


class MalformedTicketError(TicketError):
    """MalformedTicketError is raised for a ticket that cannot be decoded."""

    code = "ticket_malformed"


class ForgedTicketError(TicketError):
    """ForgedTicketError is raised when the signature does not match the Worker's key."""

    code = "ticket_forged"


class ExpiredTicketError(TicketError):
    """ExpiredTicketError is raised for a ticket outside its validity window."""

    code = "ticket_expired"


class ReusedTicketError(TicketError):
    """ReusedTicketError is raised for a ticket that was already used in this process."""

    code = "ticket_reused"


@dataclass(frozen=True, slots=True)
class Ticket:
    """Ticket is a verified ticket: who is speaking, in which course and session."""

    id: str
    learner: str
    course: str
    session: str
    level: LearnerLevel
    issued_at: int
    expires_at: int


def _b64decode(text: str) -> bytes:
    padded = text + "=" * (-len(text) % 4)
    return base64.urlsafe_b64decode(padded.encode("ascii"))


def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def load_public_key(encoded: str) -> Ed25519PublicKey:
    """load_public_key reads a raw 32-byte Ed25519 public key in base64url, as set in the environment."""
    return Ed25519PublicKey.from_public_bytes(_b64decode(encoded.strip()))


def _str_field(payload: dict[str, object], name: str) -> str:
    value = payload.get(name)
    if not isinstance(value, str) or not value:
        raise MalformedTicketError(f"missing {name}")
    return value


def _int_field(payload: dict[str, object], name: str) -> int:
    value = payload.get(name)
    if not isinstance(value, int) or isinstance(value, bool):
        raise MalformedTicketError(f"missing {name}")
    return value


def _level(payload: dict[str, object]) -> LearnerLevel:
    raw = payload.get("level")
    if raw is None:
        return LearnerLevel()
    if not isinstance(raw, dict):
        raise MalformedTicketError("bad level")
    level = cast("dict[str, object]", raw)
    cefr = level.get("cefr")
    grade = level.get("grade")
    return LearnerLevel(
        cefr=cefr if isinstance(cefr, str) else None,
        grade=grade if isinstance(grade, int) and not isinstance(grade, bool) else None,
    )


class TicketVerifier:
    """TicketVerifier checks signature, validity window and single use of tickets.

    Used ticket ids are remembered in memory until they expire, so a ticket
    can be used once per process; a ticket lives about a minute, and the
    client connects to one pod with it.
    """

    def __init__(self, public_key: Ed25519PublicKey, clock: Callable[[], float]) -> None:
        self._public_key = public_key
        self._clock = clock
        self._used: dict[str, int] = {}

    def verify(self, token: str) -> Ticket:
        """verify returns the ticket if it is genuine, current and unused, and marks it used.

        Raises a TicketError subclass otherwise.
        """
        parts = token.split(".")
        if len(parts) != 2:
            raise MalformedTicketError("not two parts")
        payload_b64, signature_b64 = parts
        try:
            signature = _b64decode(signature_b64)
            payload_bytes = payload_b64.encode("ascii")
        except (binascii.Error, ValueError, UnicodeEncodeError) as error:
            raise MalformedTicketError("bad encoding") from error
        try:
            self._public_key.verify(signature, payload_bytes)
        except InvalidSignature as error:
            raise ForgedTicketError("bad signature") from error
        try:
            decoded: object = json.loads(_b64decode(payload_b64))
        except (binascii.Error, ValueError) as error:
            raise MalformedTicketError("bad payload") from error
        if not isinstance(decoded, dict):
            raise MalformedTicketError("payload is not an object")
        payload = cast("dict[str, object]", decoded)
        if payload.get("v") != TICKET_VERSION:
            raise MalformedTicketError("unknown version")
        ticket = Ticket(
            id=_str_field(payload, "id"),
            learner=_str_field(payload, "learner"),
            course=_str_field(payload, "course"),
            session=_str_field(payload, "session"),
            level=_level(payload),
            issued_at=_int_field(payload, "iat"),
            expires_at=_int_field(payload, "exp"),
        )
        now = self._clock()
        if ticket.expires_at - ticket.issued_at > MAX_LIFETIME_SECS:
            raise ExpiredTicketError("lifetime too long")
        if now + CLOCK_LEEWAY_SECS < ticket.issued_at or now - CLOCK_LEEWAY_SECS >= ticket.expires_at:
            raise ExpiredTicketError("outside validity window")
        self._forget_expired(now)
        if ticket.id in self._used:
            raise ReusedTicketError("already used")
        self._used[ticket.id] = ticket.expires_at
        return ticket

    def _forget_expired(self, now: float) -> None:
        stale = [ticket_id for ticket_id, expires in self._used.items() if now - CLOCK_LEEWAY_SECS >= expires]
        for ticket_id in stale:
            del self._used[ticket_id]


def sign_ticket(private_key: Ed25519PrivateKey, payload: dict[str, object]) -> str:
    """sign_ticket makes a ticket the way the web Worker does; used by tests and local development."""
    payload_b64 = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = private_key.sign(payload_b64.encode("ascii"))
    return f"{payload_b64}.{_b64encode(signature)}"


def encode_public_key(public_key: Ed25519PublicKey) -> str:
    """encode_public_key writes a public key in the form load_public_key reads."""
    return _b64encode(public_key.public_bytes(Encoding.Raw, PublicFormat.Raw))
