"""A small harness that runs pipeline stages with Pipecat's real worker and lets a test drive them."""

import asyncio
import time
from collections.abc import Callable, Sequence

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from pipecat.frames.frames import EndFrame, Frame, StartFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineParams, PipelineWorker
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.workers.runner import WorkerRunner

from ga_voice.levels import LearnerLevel
from ga_voice.tickets import Ticket, sign_ticket


class Collector(FrameProcessor):
    """Keeps every frame that reaches the end of the pipeline, with the time it arrived."""

    def __init__(self) -> None:
        super().__init__()
        self.frames: list[tuple[float, Frame]] = []

    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        await super().process_frame(frame, direction)
        if direction == FrameDirection.DOWNSTREAM and not isinstance(frame, StartFrame):
            self.frames.append((time.monotonic(), frame))
        await self.push_frame(frame, direction)

    def of(self, kind: type[Frame]) -> list[Frame]:
        return [frame for _, frame in self.frames if isinstance(frame, kind)]


class Harness:
    def __init__(self, stages: Sequence[FrameProcessor]) -> None:
        self.collector = Collector()
        self.worker = PipelineWorker(
            Pipeline([*stages, self.collector]),
            params=PipelineParams(audio_in_sample_rate=16000, audio_out_sample_rate=16000),
            idle_timeout_secs=None,
            enable_rtvi=False,
            enable_turn_tracking=False,
        )
        self._started = asyncio.Event()
        self._task: asyncio.Task[None] | None = None

        @self.worker.event_handler("on_pipeline_started")
        async def _started(_worker: PipelineWorker, _frame: Frame) -> None:
            self._started.set()

    async def start(self) -> None:
        runner = WorkerRunner(handle_sigint=False)
        await runner.add_workers(self.worker)
        self._task = asyncio.create_task(runner.run())
        await asyncio.wait_for(self._started.wait(), 2.0)

    async def send(self, *frames: Frame) -> None:
        for frame in frames:
            await self.worker.queue_frame(frame)

    async def wait_for(self, predicate: Callable[[], bool], timeout: float = 3.0) -> None:
        deadline = time.monotonic() + timeout
        while not predicate():
            if time.monotonic() > deadline:
                raise AssertionError("condition not met in time")
            await asyncio.sleep(0.01)

    async def finished(self, timeout: float = 5.0) -> None:
        assert self._task is not None
        await asyncio.wait_for(self._task, timeout)

    async def stop(self) -> None:
        if self._task is not None and not self._task.done():
            await self.worker.queue_frame(EndFrame())
            await self.finished()


def make_ticket(level: LearnerLevel | None = None, session: str = "session-1") -> Ticket:
    return Ticket(
        id=f"ticket-{session}",
        learner="learner-1",
        course="english-conversation-a2",
        session=session,
        level=level or LearnerLevel(cefr="a2"),
        issued_at=1_000,
        expires_at=1_060,
    )


def signed(key: Ed25519PrivateKey, **overrides: object) -> str:
    payload: dict[str, object] = {
        "v": 1,
        "id": "ticket-1",
        "learner": "learner-1",
        "course": "english-conversation-a2",
        "session": "session-1",
        "level": {"cefr": "a2"},
        "iat": 1_000,
        "exp": 1_060,
    }
    payload.update(overrides)
    return sign_ticket(key, payload)
