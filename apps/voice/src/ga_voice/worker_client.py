"""The service's calls to the web Worker.

Pipecat here has no LLM service: every model call is made by the Worker
through pi-ai. The service asks the Worker which speech services a session
uses, then for the tutor's next turn, and writes the session's result,
idempotently by session id. It authenticates with its own credential, not the
learner's ticket.
"""

import asyncio
import re
from dataclasses import asdict, dataclass, field
from typing import Protocol, cast

import httpx

from ga_voice.messages import EndReason, Line

_RECORDING = re.compile(r"audio/[a-z][a-z0-9-]*/[0-9a-f]{16}\.wav")
"""_RECORDING is the path of a recording a turn may name: a WAV file under audio/<subject>/."""


@dataclass(frozen=True, slots=True)
class SessionRef:
    """SessionRef names a session to the Worker: the session, its learner and course, as the ticket says."""

    session: str
    learner: str
    course: str


@dataclass(frozen=True, slots=True)
class SpeechService:
    """SpeechService is one speech service the Worker chose for a session, as an administrator configured it.

    ``vendor`` names the protocol (only ``azure`` so far), ``region`` and ``key`` reach it, ``language`` is the language
    heard or spoken and ``voice`` the voice text-to-speech speaks in. The key is held for the session only and never
    shown.
    """

    vendor: str
    region: str
    key: str = field(repr=False)
    language: str
    voice: str = ""


@dataclass(frozen=True, slots=True)
class SessionSpeech:
    """SessionSpeech is the speech-to-text and text-to-speech of one session."""

    stt: SpeechService
    tts: SpeechService


@dataclass(frozen=True, slots=True)
class TurnRequest:
    """TurnRequest asks for the tutor's next turn given the conversation so far."""

    session: str
    learner: str
    course: str
    lines: tuple[Line, ...]


@dataclass(frozen=True, slots=True)
class TutorTurn:
    """TutorTurn is what the tutor says next; ``end`` closes the conversation after it is spoken.

    ``audio`` is the path of a recording of the line, when there is one, which is played instead of speaking it.
    """

    text: str
    end: bool = False
    audio: str | None = None


@dataclass(frozen=True, slots=True)
class SessionResult:
    """SessionResult is written to the Worker once per session, at its end."""

    session: str
    learner: str
    course: str
    lines: tuple[Line, ...]
    reason: EndReason
    duration_secs: float


class WorkerClient(Protocol):
    """WorkerClient is the web Worker as the service sees it."""

    async def speech(self, ref: SessionRef) -> SessionSpeech | None:
        """speech returns the session's speech services, or None when no route may serve its learner."""
        ...

    async def next_turn(self, request: TurnRequest) -> TutorTurn:
        """next_turn returns the tutor's next turn."""
        ...

    async def write_result(self, result: SessionResult) -> None:
        """write_result stores the session's result; writing the same session twice stores it once."""
        ...

    async def recording(self, path: str) -> bytes:
        """recording returns the file of a recording a turn names."""
        ...


class WorkerError(Exception):
    """WorkerError is raised when the Worker does not answer as expected."""


_REGION = re.compile(r"[a-z0-9]+")
"""_REGION is an Azure region's name, such as eastus."""


def _service(raw: object) -> SpeechService:
    """_service reads one SpeechService of the Worker's answer."""
    if not isinstance(raw, dict):
        raise WorkerError("speech: bad shape")
    data = cast("dict[str, object]", raw)
    fields = {name: data.get(name, "") for name in ("vendor", "region", "key", "language", "voice")}
    if not all(isinstance(v, str) for v in fields.values()):
        raise WorkerError("speech: bad shape")
    values = cast("dict[str, str]", fields)
    if not values["key"] or not values["language"] or not _REGION.fullmatch(values["region"]):
        raise WorkerError("speech: bad shape")
    return SpeechService(**values)


class HttpWorkerClient:
    """HttpWorkerClient calls the Worker's voice endpoints over HTTP with a bearer credential.

    ``POST /voice/v1/speech`` takes a SessionRef and returns ``{"stt", "tts"}``, each a SpeechService, or 503 when
    no route serves the learner; ``POST /voice/v1/turn`` takes a TurnRequest and returns ``{"text", "end"}`` and
    perhaps ``"audio"``, the path of a recording served at ``GET /{audio}``;
    ``PUT /voice/v1/sessions/{session}/result`` stores a SessionResult and is
    idempotent by session id, which is also sent as the ``Idempotency-Key``.
    """

    def __init__(self, base_url: str, credential: str, client: httpx.AsyncClient | None = None) -> None:
        self._client = client or httpx.AsyncClient(timeout=httpx.Timeout(10.0))
        self._base_url = base_url.rstrip("/")
        self._headers = {"Authorization": f"Bearer {credential}"}

    async def speech(self, ref: SessionRef) -> SessionSpeech | None:
        """speech asks the Worker for the session's speech services."""
        response = await self._client.post(f"{self._base_url}/voice/v1/speech", json=asdict(ref), headers=self._headers)
        if response.status_code == 503:
            return None
        if response.status_code != 200:
            raise WorkerError(f"speech: HTTP {response.status_code}")
        body: object = response.json()
        if not isinstance(body, dict):
            raise WorkerError("speech: not an object")
        data = cast("dict[str, object]", body)
        return SessionSpeech(stt=_service(data.get("stt")), tts=_service(data.get("tts")))

    async def next_turn(self, request: TurnRequest) -> TutorTurn:
        """next_turn asks the Worker for the tutor's next turn."""
        response = await self._client.post(
            f"{self._base_url}/voice/v1/turn", json=asdict(request), headers=self._headers
        )
        if response.status_code != 200:
            raise WorkerError(f"turn: HTTP {response.status_code}")
        body: object = response.json()
        if not isinstance(body, dict):
            raise WorkerError("turn: not an object")
        data = cast("dict[str, object]", body)
        text = data.get("text")
        end = data.get("end", False)
        audio = data.get("audio")
        if not isinstance(text, str) or not isinstance(end, bool) or not (audio is None or isinstance(audio, str)):
            raise WorkerError("turn: bad shape")
        if audio is not None and not _RECORDING.fullmatch(audio):
            raise WorkerError("turn: bad audio")
        return TutorTurn(text=text, end=end, audio=audio)

    async def recording(self, path: str) -> bytes:
        """recording fetches a recording from the Worker, which serves recordings without a credential."""
        if not _RECORDING.fullmatch(path):
            raise WorkerError("recording: bad path")
        response = await self._client.get(f"{self._base_url}/{path}")
        if response.status_code != 200:
            raise WorkerError(f"recording: HTTP {response.status_code}")
        return response.content

    async def write_result(self, result: SessionResult) -> None:
        """write_result stores the result; the Worker ignores a second write for the same session."""
        response = await self._client.put(
            f"{self._base_url}/voice/v1/sessions/{result.session}/result",
            json=asdict(result),
            headers={**self._headers, "Idempotency-Key": result.session},
        )
        if response.status_code not in (200, 201, 204):
            raise WorkerError(f"result: HTTP {response.status_code}")

    async def aclose(self) -> None:
        """aclose closes the HTTP client."""
        await self._client.aclose()


class FakeWorkerClient:
    """FakeWorkerClient answers with scripted tutor turns and keeps results by session id, for tests."""

    def __init__(
        self,
        turns: list[TutorTurn],
        delay_secs: float = 0.0,
        recordings: dict[str, bytes] | None = None,
        speech: SessionSpeech | None = None,
    ) -> None:
        self._turns = list(turns)
        self._speech = speech
        self.speech_asked: list[SessionRef] = []
        self._recordings = dict(recordings or {})
        self._delay_secs = delay_secs
        self.requests: list[TurnRequest] = []
        self.results: dict[str, SessionResult] = {}
        self.result_writes = 0

    async def speech(self, ref: SessionRef) -> SessionSpeech | None:
        """speech returns the speech services given to the fake, or None."""
        self.speech_asked.append(ref)
        return self._speech

    async def next_turn(self, request: TurnRequest) -> TutorTurn:
        """next_turn returns the next scripted turn, or ends the conversation when the script runs out."""
        self.requests.append(request)
        if self._delay_secs:
            await asyncio.sleep(self._delay_secs)
        if not self._turns:
            return TutorTurn(text="Goodbye.", end=True)
        return self._turns.pop(0)

    async def write_result(self, result: SessionResult) -> None:
        """write_result keeps the first result written for a session, as the Worker does."""
        self.result_writes += 1
        self.results.setdefault(result.session, result)

    async def recording(self, path: str) -> bytes:
        """recording returns a recording given to the fake, or fails as a missing file does."""
        if path not in self._recordings:
            raise WorkerError("recording: HTTP 404")
        return self._recordings[path]
