"""The conversation processor: turn taking, barge-in and the session limit, in a Pipecat pipeline.

It sits between speech-to-text and text-to-speech. It never logs what anyone
said: the transcript lives in memory and goes only to the web Worker.
"""

import asyncio
import time
from collections.abc import Callable
from dataclasses import dataclass
from typing import override

from loguru import logger
from pipecat.frames.frames import (
    BotStartedSpeakingFrame,
    BotStoppedSpeakingFrame,
    CancelFrame,
    EndFrame,
    EndWorkerFrame,
    Frame,
    OutputTransportMessageFrame,
    OutputTransportMessageUrgentFrame,
    StartFrame,
    SystemFrame,
    TranscriptionFrame,
    TTSSpeakFrame,
    VADUserStartedSpeakingFrame,
    VADUserStoppedSpeakingFrame,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor

from ga_voice.messages import (
    CaptionMessage,
    EndedMessage,
    EndReason,
    ReadyMessage,
    ServerMessage,
    Transcript,
    to_dict,
)
from ga_voice.tickets import Ticket
from ga_voice.turns import SessionClock, TurnState, should_barge_in
from ga_voice.worker_client import SessionResult, TurnRequest, WorkerClient


@dataclass
class LearnerEndedFrame(SystemFrame):
    """LearnerEndedFrame is pushed when the client says the learner ended the conversation."""


class Conversation(FrameProcessor):
    """Conversation takes turns with the learner, asking the web Worker what the tutor says.

    - The tutor speaks first.
    - The learner's turn ends after ``longest_pause`` seconds of silence (see ``levels.py``).
    - When the learner starts speaking while the tutor speaks, or while a reply is
      being prepared, the tutor stops and the reply is dropped (barge-in).
    - At ``limit_secs`` the conversation ends after the tutor's current words.
    """

    def __init__(
        self,
        *,
        ticket: Ticket,
        worker: WorkerClient,
        longest_pause: float,
        vad_stop_secs: float,
        limit_secs: float,
        clock: Callable[[], float] = time.monotonic,
    ) -> None:
        super().__init__()
        self._ticket = ticket
        self._worker = worker
        self._clock_fn = clock
        self._turns = TurnState(longest_pause=longest_pause, vad_stop_secs=vad_stop_secs)
        self._limit_secs = limit_secs
        self._session_clock: SessionClock | None = None
        self.transcript = Transcript()
        self._tutor_speaking = False
        self._reply_task: asyncio.Task[None] | None = None
        self._pause_task: asyncio.Task[None] | None = None
        self._limit_task: asyncio.Task[None] | None = None
        self._ended_at: float | None = None
        self.reason: EndReason | None = None

    @property
    def ending(self) -> bool:
        """ending tells whether the conversation has been told to end."""
        return self.reason is not None

    def result(self, fallback: EndReason) -> SessionResult:
        """result returns what is written to the Worker; ``fallback`` is the reason if none was recorded."""
        now = self._ended_at if self._ended_at is not None else self._clock_fn()
        elapsed = self._session_clock.elapsed(now) if self._session_clock else 0.0
        return SessionResult(
            session=self._ticket.session,
            learner=self._ticket.learner,
            course=self._ticket.course,
            lines=tuple(self.transcript.lines),
            reason=self.reason or fallback,
            duration_secs=round(elapsed, 3),
        )

    @override
    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        """process_frame follows speech and transcripts and decides who speaks."""
        await super().process_frame(frame, direction)
        if isinstance(frame, StartFrame):
            await self.push_frame(frame, direction)
            await self._start()
        elif isinstance(frame, VADUserStartedSpeakingFrame):
            await self.push_frame(frame, direction)
            await self._learner_started()
        elif isinstance(frame, VADUserStoppedSpeakingFrame):
            await self.push_frame(frame, direction)
            self._learner_stopped()
        elif isinstance(frame, TranscriptionFrame):
            # Transcripts stop here: they reach the client as captions and the Worker as lines.
            await self._heard(frame.text)
        elif isinstance(frame, BotStartedSpeakingFrame):
            self._tutor_speaking = True
            await self.push_frame(frame, direction)
        elif isinstance(frame, BotStoppedSpeakingFrame):
            self._tutor_speaking = False
            await self.push_frame(frame, direction)
        elif isinstance(frame, LearnerEndedFrame):
            await self._end("learner_ended")
        elif isinstance(frame, (EndFrame, CancelFrame)):
            self._stop_tasks()
            if self._ended_at is None:
                self._ended_at = self._clock_fn()
            await self.push_frame(frame, direction)
        else:
            await self.push_frame(frame, direction)

    async def _start(self) -> None:
        now = self._clock_fn()
        self._session_clock = SessionClock(started_at=now, limit_secs=self._limit_secs)
        await self._send(ReadyMessage(session=self._ticket.session, limit_secs=round(self._limit_secs)), urgent=True)
        self._limit_task = self.create_task(self._watch_limit(), "limit")
        self._reply_task = self.create_task(self._reply(), "reply")

    async def _learner_started(self) -> None:
        if self.ending:
            return
        self._turns.speech_started()
        self._cancel_pause()
        reply_pending = self._reply_task is not None and not self._reply_task.done()
        if should_barge_in(self._tutor_speaking, reply_pending):
            if self._reply_task is not None and reply_pending:
                await self.cancel_task(self._reply_task)
            self._reply_task = None
            if self._tutor_speaking:
                self.transcript.mark_last_interrupted()
            self._tutor_speaking = False
            await self.broadcast_interruption()

    def _learner_stopped(self) -> None:
        if self.ending:
            return
        delay = self._turns.speech_stopped(self._clock_fn())
        self._cancel_pause()
        self._pause_task = self.create_task(self._after_pause(delay), "pause")

    async def _heard(self, text: str) -> None:
        if self.ending or not text.strip():
            return
        self._turns.transcript(text)
        await self._send(CaptionMessage(speaker="learner", text=text.strip()), urgent=True)
        self._maybe_end_turn()

    async def _after_pause(self, delay: float) -> None:
        await asyncio.sleep(delay)
        self._maybe_end_turn()

    def _maybe_end_turn(self) -> None:
        if self.ending or not self._turns.due(self._clock_fn()):
            return
        if self._reply_task is not None and not self._reply_task.done():
            return
        self.transcript.add("learner", self._turns.take())
        self._reply_task = self.create_task(self._reply(), "reply")

    async def _reply(self) -> None:
        request = TurnRequest(
            session=self._ticket.session,
            learner=self._ticket.learner,
            course=self._ticket.course,
            lines=tuple(self.transcript.lines),
        )
        try:
            turn = await self._worker.next_turn(request)
        except asyncio.CancelledError:
            raise
        except Exception as error:  # noqa: BLE001 - any failure of the Worker ends the session
            logger.warning("voice: tutor turn failed: {}", type(error).__name__)
            await self._end("error")
            return
        if self.ending:
            return
        self.transcript.add("tutor", turn.text)
        self._tutor_speaking = True
        await self._send(CaptionMessage(speaker="tutor", text=turn.text), urgent=False)
        await self.push_frame(TTSSpeakFrame(text=turn.text))
        if turn.end:
            await self._end("tutor_ended")

    async def _watch_limit(self) -> None:
        clock = self._session_clock
        if clock is None:
            return
        await asyncio.sleep(clock.remaining(self._clock_fn()))
        await self._end("time_limit")

    async def _end(self, reason: EndReason) -> None:
        if self.ending:
            return
        self.reason = reason
        self._ended_at = self._clock_fn()
        self._cancel_pause()
        reply = self._reply_task
        # A reply still being prepared is dropped; words already queued are spoken.
        if reason != "tutor_ended" and reply is not None and not reply.done() and asyncio.current_task() is not reply:
            await self.cancel_task(reply)
        await self._send(EndedMessage(reason=reason), urgent=False)
        # Downstream, so the tutor's queued words are spoken before the pipeline ends.
        await self.push_frame(EndWorkerFrame(reason=reason))

    async def _send(self, message: ServerMessage, *, urgent: bool) -> None:
        frame = (
            OutputTransportMessageUrgentFrame(message=to_dict(message))
            if urgent
            else OutputTransportMessageFrame(message=to_dict(message))
        )
        await self.push_frame(frame)

    def _cancel_pause(self) -> None:
        if self._pause_task is not None and not self._pause_task.done():
            self._pause_task.cancel()
        self._pause_task = None

    def _stop_tasks(self) -> None:
        self._cancel_pause()
        for task in (self._limit_task, self._reply_task):
            if task is not None and not task.done() and task is not asyncio.current_task():
                task.cancel()
