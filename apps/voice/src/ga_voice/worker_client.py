"""The service's calls to the web Worker.

Pipecat here has no LLM service: every model call is made by the Worker
through pi-ai. The service asks the Worker for the tutor's next turn and
writes the session's result, idempotently by session id. It authenticates
with its own credential, not the learner's ticket.
"""

import asyncio
from dataclasses import asdict, dataclass
from typing import Protocol, cast

import httpx

from ga_voice.messages import EndReason, Line


@dataclass(frozen=True, slots=True)
class TurnRequest:
    """TurnRequest asks for the tutor's next turn given the conversation so far."""

    session: str
    learner: str
    course: str
    lines: tuple[Line, ...]


@dataclass(frozen=True, slots=True)
class TutorTurn:
    """TutorTurn is what the tutor says next; ``end`` closes the conversation after it is spoken."""

    text: str
    end: bool = False


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

    async def next_turn(self, request: TurnRequest) -> TutorTurn:
        """next_turn returns the tutor's next turn."""
        ...

    async def write_result(self, result: SessionResult) -> None:
        """write_result stores the session's result; writing the same session twice stores it once."""
        ...


class WorkerError(Exception):
    """WorkerError is raised when the Worker does not answer as expected."""


class HttpWorkerClient:
    """HttpWorkerClient calls the Worker's voice endpoints over HTTP with a bearer credential.

    ``POST /voice/v1/turn`` takes a TurnRequest and returns ``{"text", "end"}``;
    ``PUT /voice/v1/sessions/{session}/result`` stores a SessionResult and is
    idempotent by session id, which is also sent as the ``Idempotency-Key``.
    """

    def __init__(self, base_url: str, credential: str, client: httpx.AsyncClient | None = None) -> None:
        self._client = client or httpx.AsyncClient(timeout=httpx.Timeout(10.0))
        self._base_url = base_url.rstrip("/")
        self._headers = {"Authorization": f"Bearer {credential}"}

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
        if not isinstance(text, str) or not isinstance(end, bool):
            raise WorkerError("turn: bad shape")
        return TutorTurn(text=text, end=end)

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

    def __init__(self, turns: list[TutorTurn], delay_secs: float = 0.0) -> None:
        self._turns = list(turns)
        self._delay_secs = delay_secs
        self.requests: list[TurnRequest] = []
        self.results: dict[str, SessionResult] = {}
        self.result_writes = 0

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
