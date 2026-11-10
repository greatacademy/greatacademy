"""The WebSocket server: admission, tickets, sessions, health and graceful drain."""

import asyncio
import contextlib
import signal
from collections.abc import Callable, Generator
from dataclasses import dataclass, field
from typing import override

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from loguru import logger
from pipecat.pipeline.worker import PipelineWorker
from pipecat.transports.websocket.fastapi import FastAPIWebsocketParams, FastAPIWebsocketTransport

from ga_voice.drain import Admission
from ga_voice.messages import SAMPLE_RATE, ErrorMessage, MessageError, StartMessage, decode_client, encode
from ga_voice.serializer import VoiceSerializer
from ga_voice.session import SessionSettings, run_session
from ga_voice.speech import SpeechServices, SpeechUnavailableError
from ga_voice.tickets import TicketError, TicketVerifier
from ga_voice.worker_client import WorkerClient

CONVERSATION_PATH = "/v1/conversation"
"""CONVERSATION_PATH is the WebSocket path of a conversation."""

START_TIMEOUT_SECS = 10.0
"""START_TIMEOUT_SECS is how long the client has to send its ticket after connecting."""

CLOSE_TRY_AGAIN = 1013
"""CLOSE_TRY_AGAIN is the WebSocket close code for a pod that is draining or full: try another."""

CLOSE_POLICY = 1008
"""CLOSE_POLICY is the WebSocket close code for a refused ticket."""


@dataclass(slots=True)
class VoiceApp:
    """VoiceApp holds what the server's endpoints share."""

    admission: Admission
    verifier: TicketVerifier
    services: SpeechServices
    worker: WorkerClient
    settings: SessionSettings = field(default_factory=SessionSettings)


async def _refuse(websocket: WebSocket, code: str, close_code: int) -> None:
    with contextlib.suppress(WebSocketDisconnect, RuntimeError):
        await websocket.send_text(encode(ErrorMessage(code=code)))
        await websocket.close(code=close_code)


async def _start_message(websocket: WebSocket) -> StartMessage | None:
    try:
        text = await asyncio.wait_for(websocket.receive_text(), START_TIMEOUT_SECS)
        message = decode_client(text)
    except TimeoutError, MessageError, KeyError:
        return None
    return message if isinstance(message, StartMessage) else None


async def handle_conversation(app: VoiceApp, websocket: WebSocket) -> None:
    """handle_conversation runs one WebSocket connection: refuse, or verify the ticket and run a session.

    The pod is checked before the ticket, so a client refused by a draining or
    full pod can use the same ticket on another.
    """
    await websocket.accept()
    refusal = app.admission.refusal()
    if refusal is not None:
        await _refuse(websocket, refusal, CLOSE_TRY_AGAIN)
        return
    start = await _start_message(websocket)
    if start is None:
        await _refuse(websocket, "expected_start", CLOSE_POLICY)
        return
    try:
        ticket = app.verifier.verify(start.ticket)
    except TicketError as error:
        await _refuse(websocket, error.code, CLOSE_POLICY)
        return
    try:
        app.services.vad_params()
    except SpeechUnavailableError:
        await _refuse(websocket, "speech_unavailable", CLOSE_TRY_AGAIN)
        return
    if not app.admission.admit():
        await _refuse(websocket, app.admission.refusal() or "full", CLOSE_TRY_AGAIN)
        return
    try:
        transport = FastAPIWebsocketTransport(
            websocket=websocket,
            params=FastAPIWebsocketParams(
                audio_in_enabled=True,
                audio_in_sample_rate=SAMPLE_RATE,
                audio_out_enabled=True,
                audio_out_sample_rate=SAMPLE_RATE,
                serializer=VoiceSerializer(),
            ),
        )
        workers: list[PipelineWorker] = []

        @transport.event_handler("on_client_disconnected")
        async def _on_disconnected(_transport: FastAPIWebsocketTransport, _ws: WebSocket) -> None:  # pyright: ignore[reportUnusedFunction]
            for pipeline_worker in workers:
                await pipeline_worker.cancel()

        await run_session(
            ticket=ticket,
            services=app.services,
            worker=app.worker,
            settings=app.settings,
            source=transport.input(),
            sink=transport.output(),
            on_worker=workers.append,
        )
    except Exception as error:  # noqa: BLE001 - one failed session must not stop the server
        logger.warning("voice: session ended by {}", type(error).__name__)
    finally:
        app.admission.release()


def create_app(voice: VoiceApp) -> FastAPI:
    """create_app returns the FastAPI application: the conversation WebSocket and the probes."""
    api = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

    @api.get("/healthz")
    async def _healthz() -> JSONResponse:  # pyright: ignore[reportUnusedFunction]
        return JSONResponse({"ok": True})

    @api.get("/readyz")
    async def _readyz() -> JSONResponse:  # pyright: ignore[reportUnusedFunction]
        admission = voice.admission
        body = {"ready": admission.ready, "active": admission.active, "draining": admission.draining}
        return JSONResponse(body, status_code=200 if admission.ready else 503)

    @api.websocket(CONVERSATION_PATH)
    async def _conversation(websocket: WebSocket) -> None:  # pyright: ignore[reportUnusedFunction]
        await handle_conversation(voice, websocket)

    return api


class DrainingServer(uvicorn.Server):
    """DrainingServer is uvicorn whose SIGTERM and SIGINT drain instead of stopping.

    The first signal refuses new sessions; the server exits once the running
    sessions have finished or ``drain_timeout_secs`` has passed. A second
    SIGINT exits at once.
    """

    def __init__(self, config: uvicorn.Config, admission: Admission, drain_timeout_secs: float) -> None:
        super().__init__(config)
        self._admission = admission
        self._drain_timeout_secs = drain_timeout_secs
        self._drain_task: asyncio.Task[None] | None = None
        self.signals_installed = asyncio.Event()

    @override
    @contextlib.contextmanager
    def capture_signals(self) -> Generator[None]:
        """capture_signals routes SIGTERM and SIGINT to begin_drain while the server runs."""
        loop = asyncio.get_running_loop()
        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, self.begin_drain, sig)
        self.signals_installed.set()
        try:
            yield
        finally:
            for sig in (signal.SIGTERM, signal.SIGINT):
                loop.remove_signal_handler(sig)

    def begin_drain(self, sig: int = signal.SIGTERM) -> None:
        """begin_drain stops admitting sessions and exits when the running ones are done."""
        if self._admission.draining:
            if sig == signal.SIGINT:
                self.force_exit = True
                self.should_exit = True
            return
        logger.info("voice: draining, {} session(s) running", self._admission.active)
        self._admission.begin_drain()
        self._drain_task = asyncio.get_running_loop().create_task(self._drain())

    async def _drain(self) -> None:
        finished = await self._admission.wait_idle(self._drain_timeout_secs)
        if not finished:
            logger.warning("voice: drain timed out with {} session(s)", self._admission.active)
        self.should_exit = True


def make_server(
    voice: VoiceApp,
    *,
    host: str,
    port: int,
    drain_timeout_secs: float,
    configure: Callable[[uvicorn.Config], None] | None = None,
) -> DrainingServer:
    """make_server builds the uvicorn server; access logs are off, so no request is logged."""
    config = uvicorn.Config(
        create_app(voice),
        host=host,
        port=port,
        access_log=False,
        log_level="warning",
        lifespan="off",
        ws_ping_interval=20.0,
        ws_ping_timeout=20.0,
    )
    if configure is not None:
        configure(config)
    return DrainingServer(config, voice.admission, drain_timeout_secs)
