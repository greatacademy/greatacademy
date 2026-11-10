"""The server end to end, in process: real WebSockets, Pipecat's FastAPI transport, fake speech and Worker."""

import asyncio
import json
import os
import signal
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager, suppress
from dataclasses import dataclass, field

import httpx
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from websockets.asyncio.client import ClientConnection, connect
from websockets.exceptions import ConnectionClosed

from ga_voice.drain import Admission
from ga_voice.server import CONVERSATION_PATH, DrainingServer, VoiceApp, make_server
from ga_voice.session import SessionSettings
from ga_voice.speech import FakeSpeechServices, SpeechServices, UnconfiguredSpeechServices, silence, tone
from ga_voice.tickets import TicketVerifier
from ga_voice.worker_client import FakeWorkerClient, TutorTurn
from tests.harness import signed

KEY = Ed25519PrivateKey.from_private_bytes(bytes(range(32)))
CHUNK = 0.02


@dataclass
class Running:
    server: DrainingServer
    voice: VoiceApp
    worker: FakeWorkerClient
    task: asyncio.Task[None]
    port: int

    @property
    def url(self) -> str:
        return f"ws://127.0.0.1:{self.port}{CONVERSATION_PATH}"


@asynccontextmanager
async def running(
    turns: list[TutorTurn], *, services: SpeechServices | None = None, capacity: int = 4
) -> AsyncGenerator[Running]:
    worker = FakeWorkerClient(turns)
    voice = VoiceApp(
        admission=Admission(capacity),
        verifier=TicketVerifier(KEY.public_key(), clock=lambda: 1_010),
        services=services or FakeSpeechServices(["I am fine."]),
        worker=worker,
        settings=SessionSettings(limit_secs=30, closing_grace_secs=2, result_retry_secs=0.01),
    )
    server = make_server(voice, host="127.0.0.1", port=0, drain_timeout_secs=10)
    task = asyncio.create_task(server.serve())
    while not server.started:
        await asyncio.sleep(0.01)
    port = server.servers[0].sockets[0].getsockname()[1]
    try:
        yield Running(server=server, voice=voice, worker=worker, task=task, port=port)
    finally:
        if not task.done():
            server.should_exit = True
            await asyncio.wait_for(task, 5)


@dataclass
class Client:
    connection: ClientConnection
    texts: list[dict[str, object]] = field(default_factory=list[dict[str, object]])
    audio_bytes: int = 0
    closed: asyncio.Event = field(default_factory=asyncio.Event)
    close_code: int | None = None

    async def pump(self) -> None:
        try:
            async for message in self.connection:
                if isinstance(message, bytes):
                    self.audio_bytes += len(message)
                else:
                    self.texts.append(json.loads(message))
        except ConnectionClosed:
            pass
        self.close_code = self.connection.close_code
        self.closed.set()

    def of(self, kind: str) -> list[dict[str, object]]:
        return [m for m in self.texts if m.get("type") == kind]

    async def wait_for(self, predicate: object, timeout: float = 5.0) -> None:
        assert callable(predicate)
        deadline = asyncio.get_running_loop().time() + timeout
        while not predicate():
            if asyncio.get_running_loop().time() > deadline:
                raise AssertionError(f"not met in time; received {self.texts}")
            await asyncio.sleep(0.01)


@asynccontextmanager
async def session(url: str, ticket: str) -> AsyncGenerator[Client]:
    async with connect(url) as connection:
        client = Client(connection)
        with suppress(ConnectionClosed):  # a pod that refuses at once may close before the ticket is sent
            await connection.send(json.dumps({"type": "start", "ticket": ticket}))
        pump = asyncio.create_task(client.pump())
        try:
            yield client
        finally:
            await connection.close()
            await pump


async def speak(client: Client, secs: float) -> None:
    """Sends speech then silence, in 20 ms chunks at about real time."""
    for _ in range(round(secs / CHUNK)):
        await client.connection.send(tone(CHUNK))
        await asyncio.sleep(CHUNK / 2)
    for _ in range(round(0.3 / CHUNK)):
        await client.connection.send(silence(CHUNK))
        await asyncio.sleep(CHUNK / 2)


async def test_a_whole_conversation() -> None:
    turns = [TutorTurn("Hello, how are you?"), TutorTurn("Great. Goodbye!", end=True)]
    async with running(turns) as run, session(run.url, signed(KEY, level={"grade": 12})) as client:
        await client.wait_for(lambda: bool(client.of("ready")))
        await client.wait_for(lambda: len(client.of("caption")) == 1 and client.audio_bytes > 0)
        await asyncio.sleep(0.4)
        await speak(client, 0.3)
        await client.wait_for(lambda: bool(client.of("ended")))
        await asyncio.wait_for(client.closed.wait(), 5)
        await client.wait_for(lambda: "session-1" in run.worker.results)
    captions = [(m["speaker"], m["text"]) for m in client.of("caption")]
    assert captions == [("tutor", "Hello, how are you?"), ("learner", "I am fine."), ("tutor", "Great. Goodbye!")]
    assert client.of("ended") == [{"reason": "tutor_ended", "type": "ended"}]
    result = run.worker.results["session-1"]
    assert result.reason == "tutor_ended"
    assert [line.text for line in result.lines] == ["Hello, how are you?", "I am fine.", "Great. Goodbye!"]


async def test_refusals() -> None:
    other = Ed25519PrivateKey.from_private_bytes(bytes(range(1, 33)))
    async with running([TutorTurn("Hi.")]) as run:
        for ticket, code in [(signed(other), "ticket_forged"), (signed(KEY, iat=100, exp=160), "ticket_expired")]:
            async with session(run.url, ticket) as client:
                await asyncio.wait_for(client.closed.wait(), 5)
            assert client.of("error") == [{"code": code, "type": "error"}]
            assert client.close_code == 1008
        async with session(run.url, signed(KEY)) as first:
            await first.wait_for(lambda: bool(first.of("ready")))
            async with session(run.url, signed(KEY)) as reused:
                await asyncio.wait_for(reused.closed.wait(), 5)
            assert reused.of("error") == [{"code": "ticket_reused", "type": "error"}]


async def test_full_pod_refuses_and_reports_not_ready() -> None:
    async with (
        running([TutorTurn("Hi.")], capacity=1) as run,
        session(run.url, signed(KEY, id="a", session="a")) as first,
    ):
        await first.wait_for(lambda: bool(first.of("ready")))
        async with httpx.AsyncClient() as http:
            ready = await http.get(f"http://127.0.0.1:{run.port}/readyz")
        assert ready.status_code == 503
        async with session(run.url, signed(KEY, id="b", session="b")) as second:
            await asyncio.wait_for(second.closed.wait(), 5)
        assert second.of("error") == [{"code": "full", "type": "error"}]
        assert second.close_code == 1013


async def test_no_speech_services_configured() -> None:
    async with running([TutorTurn("Hi.")], services=UnconfiguredSpeechServices()) as run:
        async with session(run.url, signed(KEY)) as client:
            await asyncio.wait_for(client.closed.wait(), 5)
        assert client.of("error") == [{"code": "speech_unavailable", "type": "error"}]


async def test_disconnect_writes_the_result() -> None:
    async with running([TutorTurn("Hi there.")]) as run:
        async with session(run.url, signed(KEY)) as client:
            await client.wait_for(lambda: len(client.of("caption")) == 1)
        await client.wait_for(lambda: "session-1" in run.worker.results)
        assert run.worker.results["session-1"].reason == "disconnected"
        assert run.voice.admission.active == 0


async def test_sigterm_refuses_new_sessions_and_lets_the_running_one_finish() -> None:
    turns = [TutorTurn("Hello, how are you?"), TutorTurn("Goodbye!", end=True)]
    async with running(turns) as run:
        await asyncio.wait_for(run.server.signals_installed.wait(), 2)
        async with session(run.url, signed(KEY, level={"grade": 12})) as running_session:
            await running_session.wait_for(lambda: len(running_session.of("caption")) == 1)

            os.kill(os.getpid(), signal.SIGTERM)
            await asyncio.sleep(0.1)
            assert run.voice.admission.draining

            async with httpx.AsyncClient() as http:
                ready = await http.get(f"http://127.0.0.1:{run.port}/readyz")
            assert ready.status_code == 503
            async with session(run.url, signed(KEY, id="late", session="late")) as late:
                await asyncio.wait_for(late.closed.wait(), 5)
            assert late.of("error") == [{"code": "draining", "type": "error"}]
            assert late.close_code == 1013
            assert not run.task.done()

            await asyncio.sleep(0.3)
            await speak(running_session, 0.3)
            await running_session.wait_for(lambda: bool(running_session.of("ended")))
            await asyncio.wait_for(running_session.closed.wait(), 5)

        await asyncio.wait_for(run.task, 5)
    assert run.worker.results["session-1"].reason == "tutor_ended"
    assert "late" not in run.worker.results
