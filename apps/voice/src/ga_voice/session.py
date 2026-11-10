"""One conversation: the Pipecat pipeline from the learner's audio to the tutor's, and its result."""

import asyncio
import time
from collections.abc import Callable
from dataclasses import dataclass

from loguru import logger
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineParams, PipelineWorker
from pipecat.processors.audio.vad_processor import VADProcessor
from pipecat.processors.frame_processor import FrameProcessor
from pipecat.workers.runner import WorkerRunner

from ga_voice.conversation import Conversation
from ga_voice.levels import longest_pause
from ga_voice.messages import SAMPLE_RATE, EndReason
from ga_voice.speech import SpeechServices
from ga_voice.tickets import Ticket
from ga_voice.turns import CLOSING_GRACE_SECS, SESSION_LIMIT_SECS
from ga_voice.worker_client import SessionResult, WorkerClient

RESULT_ATTEMPTS = 3
"""RESULT_ATTEMPTS is how many times a result write is tried; the write is idempotent, so retrying is safe."""


@dataclass(frozen=True, slots=True)
class SessionSettings:
    """SessionSettings are the limits of a session; tests shorten them."""

    limit_secs: float = SESSION_LIMIT_SECS
    closing_grace_secs: float = CLOSING_GRACE_SECS
    result_retry_secs: float = 1.0


def build_pipeline(
    *,
    ticket: Ticket,
    services: SpeechServices,
    worker: WorkerClient,
    settings: SessionSettings,
    source: FrameProcessor | None,
    sink: FrameProcessor | None,
    clock: Callable[[], float] = time.monotonic,
) -> tuple[Pipeline, Conversation]:
    """build_pipeline assembles source, voice activity, speech-to-text, the conversation, text-to-speech and sink.

    ``source`` and ``sink`` are the transport's input and output, or None in tests.
    """
    conversation = Conversation(
        ticket=ticket,
        worker=worker,
        longest_pause=longest_pause(ticket.level),
        vad_stop_secs=services.vad_params().stop_secs,
        limit_secs=settings.limit_secs,
        clock=clock,
    )
    stages: list[FrameProcessor] = [
        VADProcessor(vad_analyzer=services.vad()),
        services.stt(),
        conversation,
        services.tts(),
    ]
    if source is not None:
        stages.insert(0, source)
    if sink is not None:
        stages.append(sink)
    return Pipeline(stages), conversation


async def run_session(
    *,
    ticket: Ticket,
    services: SpeechServices,
    worker: WorkerClient,
    settings: SessionSettings,
    source: FrameProcessor,
    sink: FrameProcessor,
    on_worker: Callable[[PipelineWorker], None] | None = None,
) -> SessionResult:
    """run_session runs one conversation to its end and writes its result to the web Worker.

    The session ends when the tutor or learner ends it, at the limit, or when
    the client disconnects (``on_worker`` lets the caller cancel the worker then).
    Past the limit plus a grace period it is cancelled whatever it is doing.
    """
    pipeline, conversation = build_pipeline(
        ticket=ticket, services=services, worker=worker, settings=settings, source=source, sink=sink
    )
    pipeline_worker = PipelineWorker(
        pipeline,
        params=PipelineParams(audio_in_sample_rate=SAMPLE_RATE, audio_out_sample_rate=SAMPLE_RATE),
        idle_timeout_secs=None,
        enable_rtvi=False,
        enable_turn_tracking=False,
    )
    if on_worker is not None:
        on_worker(pipeline_worker)
    runner = WorkerRunner(handle_sigint=False, handle_sigterm=False)
    await runner.add_workers(pipeline_worker)
    fallback: EndReason = "disconnected"
    try:
        await asyncio.wait_for(runner.run(), timeout=settings.limit_secs + settings.closing_grace_secs)
    except TimeoutError:
        fallback = "time_limit"
        await pipeline_worker.cancel()
    except Exception as error:  # noqa: BLE001 - the result is still written
        fallback = "error"
        logger.warning("voice: session failed: {}", type(error).__name__)
    result = conversation.result(fallback)
    await write_result(worker, result, settings)
    return result


async def write_result(worker: WorkerClient, result: SessionResult, settings: SessionSettings) -> None:
    """write_result writes a session's result, retrying a few times; a lost result is logged without content."""
    for attempt in range(1, RESULT_ATTEMPTS + 1):
        try:
            await worker.write_result(result)
        except Exception as error:  # noqa: BLE001 - retried, then reported
            logger.warning("voice: result write {} failed: {}", attempt, type(error).__name__)
            if attempt < RESULT_ATTEMPTS:
                await asyncio.sleep(settings.result_retry_secs)
        else:
            return
    logger.error("voice: result of session {} was not written", result.session)
