"""The messages on the conversation WebSocket.

Audio travels as binary WebSocket messages: 16-bit little-endian mono PCM at
SAMPLE_RATE, from the learner and from the tutor. Everything else is a text
message holding one JSON object with a ``type``. These shapes become Protobuf
messages in ``libs/proto`` later; the fields stay the same.
"""

import json
from dataclasses import asdict, dataclass, field
from typing import Literal, cast

SAMPLE_RATE = 16000
"""SAMPLE_RATE is the rate of audio in both directions, in hertz."""

Speaker = Literal["learner", "tutor"]
"""Speaker names who said a line of the conversation."""

EndReason = Literal["tutor_ended", "learner_ended", "time_limit", "disconnected", "error"]
"""EndReason says why a session ended."""


@dataclass(frozen=True, slots=True)
class StartMessage:
    """StartMessage is the client's first message: the ticket from the web Worker."""

    ticket: str
    type: Literal["start"] = "start"


@dataclass(frozen=True, slots=True)
class EndMessage:
    """EndMessage is sent by the client when the learner ends the conversation."""

    type: Literal["end"] = "end"


ClientMessage = StartMessage | EndMessage
"""ClientMessage is any text message from the client."""


@dataclass(frozen=True, slots=True)
class ReadyMessage:
    """ReadyMessage tells the client the session has started and how long it may last."""

    session: str
    limit_secs: int
    type: Literal["ready"] = "ready"


@dataclass(frozen=True, slots=True)
class CaptionMessage:
    """CaptionMessage carries a line of the conversation for captions on the client."""

    speaker: Speaker
    text: str
    type: Literal["caption"] = "caption"


@dataclass(frozen=True, slots=True)
class InterruptedMessage:
    """InterruptedMessage tells the client to drop tutor audio it has not yet played."""

    type: Literal["interrupted"] = "interrupted"


@dataclass(frozen=True, slots=True)
class EndedMessage:
    """EndedMessage is the last message of a session."""

    reason: EndReason
    type: Literal["ended"] = "ended"


@dataclass(frozen=True, slots=True)
class ErrorMessage:
    """ErrorMessage refuses or ends a session; ``code`` is a stable identifier, never a transcript."""

    code: str
    type: Literal["error"] = "error"


ServerMessage = ReadyMessage | CaptionMessage | InterruptedMessage | EndedMessage | ErrorMessage
"""ServerMessage is any text message from the service."""


class MessageError(ValueError):
    """MessageError is raised for a text message that is not a known client message."""


def encode(message: ServerMessage | ClientMessage) -> str:
    """encode writes a message as the JSON text sent on the WebSocket."""
    return json.dumps(asdict(message), separators=(",", ":"), ensure_ascii=False)


def to_dict(message: ServerMessage) -> dict[str, object]:
    """to_dict returns a server message as a plain dict, as carried in Pipecat transport frames."""
    return asdict(message)


def decode_client(text: str) -> ClientMessage:
    """decode_client reads a client text message; raises MessageError if it is not one."""
    try:
        raw: object = json.loads(text)
    except ValueError as error:
        raise MessageError("not JSON") from error
    if not isinstance(raw, dict):
        raise MessageError("not an object")
    data = cast("dict[str, object]", raw)
    match data.get("type"):
        case "start":
            ticket = data.get("ticket")
            if not isinstance(ticket, str):
                raise MessageError("start without ticket")
            return StartMessage(ticket=ticket)
        case "end":
            return EndMessage()
        case _:
            raise MessageError("unknown type")


@dataclass(frozen=True, slots=True)
class Line:
    """Line is one turn of the conversation as sent to the web Worker."""

    speaker: Speaker
    text: str
    interrupted: bool = False


@dataclass(slots=True)
class Transcript:
    """Transcript is the conversation so far; it lives in memory only and is never logged."""

    lines: list[Line] = field(default_factory=list[Line])

    def add(self, speaker: Speaker, text: str) -> None:
        """add appends a line."""
        self.lines.append(Line(speaker=speaker, text=text))

    def mark_last_interrupted(self) -> None:
        """mark_last_interrupted records that the tutor's last line was cut off by the learner."""
        if self.lines and self.lines[-1].speaker == "tutor":
            last = self.lines[-1]
            self.lines[-1] = Line(speaker=last.speaker, text=last.text, interrupted=True)

    def __repr__(self) -> str:
        return f"Transcript(lines={len(self.lines)})"
