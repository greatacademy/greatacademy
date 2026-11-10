import base64
import json

import pytest
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

from ga_voice.levels import LearnerLevel
from ga_voice.tickets import (
    ExpiredTicketError,
    ForgedTicketError,
    MalformedTicketError,
    ReusedTicketError,
    TicketVerifier,
    encode_public_key,
    load_public_key,
)
from tests.harness import signed

KEY = Ed25519PrivateKey.from_private_bytes(bytes(range(32)))


class Clock:
    def __init__(self, now: float) -> None:
        self.now = now

    def __call__(self) -> float:
        return self.now


def verifier(now: float = 1_010) -> tuple[TicketVerifier, Clock]:
    clock = Clock(now)
    return TicketVerifier(load_public_key(encode_public_key(KEY.public_key())), clock), clock


def test_genuine_ticket() -> None:
    check, _ = verifier()
    ticket = check.verify(signed(KEY))
    assert ticket.learner == "learner-1"
    assert ticket.course == "english-conversation-a2"
    assert ticket.session == "session-1"
    assert ticket.level == LearnerLevel(cefr="a2")


def test_grade_level() -> None:
    check, _ = verifier()
    assert check.verify(signed(KEY, level={"grade": 4})).level == LearnerLevel(grade=4)


@pytest.mark.parametrize("now", [1_066, 5_000, 990])
def test_expired_or_not_yet_valid(now: float) -> None:
    check, _ = verifier(now)
    with pytest.raises(ExpiredTicketError):
        check.verify(signed(KEY))


def test_leeway_for_clock_skew() -> None:
    check, _ = verifier(1_063)
    check.verify(signed(KEY))


def test_lifetime_too_long() -> None:
    check, _ = verifier()
    with pytest.raises(ExpiredTicketError):
        check.verify(signed(KEY, exp=1_000 + 3600))


def test_forged_with_another_key() -> None:
    check, _ = verifier()
    other = Ed25519PrivateKey.from_private_bytes(bytes(range(1, 33)))
    with pytest.raises(ForgedTicketError):
        check.verify(signed(other))


def test_tampered_payload() -> None:
    check, _ = verifier()
    _payload, signature = signed(KEY).split(".")
    changed = {
        "v": 1,
        "id": "ticket-1",
        "learner": "someone-else",
        "course": "c",
        "session": "s",
        "iat": 1000,
        "exp": 1060,
    }
    payload = base64.urlsafe_b64encode(json.dumps(changed).encode()).decode().rstrip("=")
    with pytest.raises(ForgedTicketError):
        check.verify(f"{payload}.{signature}")


def test_reused_ticket() -> None:
    check, _ = verifier()
    token = signed(KEY)
    check.verify(token)
    with pytest.raises(ReusedTicketError):
        check.verify(token)


def test_other_tickets_still_pass_and_used_ids_are_forgotten_after_expiry() -> None:
    check, clock = verifier()
    check.verify(signed(KEY))
    check.verify(signed(KEY, id="ticket-2"))
    clock.now = 2_000
    check.verify(signed(KEY, id="ticket-3", iat=1_990, exp=2_050))
    assert list(check._used) == ["ticket-3"]  # pyright: ignore[reportPrivateUsage]


@pytest.mark.parametrize("token", ["", "abc", "a.b.c", "!!!.???", "eyJ2IjoxfQ.AAAA"])
def test_malformed(token: str) -> None:
    check, _ = verifier()
    with pytest.raises((MalformedTicketError, ForgedTicketError)):
        check.verify(token)


def test_signed_but_incomplete() -> None:
    check, _ = verifier()
    with pytest.raises(MalformedTicketError):
        check.verify(signed(KEY, learner=""))
    with pytest.raises(MalformedTicketError):
        check.verify(signed(KEY, v=2))
