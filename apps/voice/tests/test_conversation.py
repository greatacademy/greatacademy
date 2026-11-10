import asyncio
import time

from pipecat.frames.frames import (
    EndFrame,
    InterruptionFrame,
    OutputTransportMessageFrame,
    OutputTransportMessageUrgentFrame,
    TranscriptionFrame,
    TTSAudioRawFrame,
    VADUserStartedSpeakingFrame,
    VADUserStoppedSpeakingFrame,
)

from ga_voice.conversation import Conversation, LearnerEndedFrame
from ga_voice.speech import FakeAudioOutput, FakeTextToSpeech
from ga_voice.worker_client import FakeWorkerClient, TutorTurn
from tests.harness import Harness, make_ticket

PAUSE = 0.4
VAD_STOP = 0.1


def said(text: str) -> TranscriptionFrame:
    return TranscriptionFrame(text=text, user_id="learner", timestamp="")


def build(
    turns: list[TutorTurn], *, limit: float = 60.0, secs_per_char: float = 0.005, delay: float = 0.0
) -> tuple[Harness, Conversation, FakeWorkerClient]:
    worker = FakeWorkerClient(turns, delay_secs=delay)
    conversation = Conversation(
        ticket=make_ticket(),
        worker=worker,
        longest_pause=PAUSE,
        vad_stop_secs=VAD_STOP,
        limit_secs=limit,
    )
    harness = Harness([conversation, FakeTextToSpeech(secs_per_char=secs_per_char), FakeAudioOutput()])
    return harness, conversation, worker


def messages(harness: Harness) -> list[dict[str, object]]:
    found: list[dict[str, object]] = []
    for _, frame in harness.collector.frames:
        if isinstance(frame, (OutputTransportMessageFrame, OutputTransportMessageUrgentFrame)):
            found.append(frame.message)
    return found


async def test_tutor_speaks_first_and_ready_is_sent() -> None:
    harness, conversation, worker = build([TutorTurn("Hello! How are you?")])
    await harness.start()
    await harness.wait_for(lambda: bool(harness.collector.of(TTSAudioRawFrame)))
    await harness.stop()
    assert worker.requests[0].lines == ()
    assert messages(harness)[0] == {"session": "session-1", "limit_secs": 60, "type": "ready"}
    assert [line.text for line in conversation.transcript.lines] == ["Hello! How are you?"]


async def test_turn_ends_only_after_the_longest_pause() -> None:
    harness, conversation, worker = build([TutorTurn("Hi."), TutorTurn("Nice.")])
    await harness.start()
    await harness.wait_for(lambda: len(worker.requests) == 1 and not conversation.transcript.lines[-1].interrupted)
    await asyncio.sleep(0.1)
    await harness.send(VADUserStartedSpeakingFrame(), said("I like"), VADUserStoppedSpeakingFrame())
    stopped_at = time.monotonic()
    # A pause shorter than the longest one: the learner goes on, in the same turn.
    await asyncio.sleep((PAUSE - VAD_STOP) * 0.6)
    assert len(worker.requests) == 1
    await harness.send(VADUserStartedSpeakingFrame(), said("green tea"), VADUserStoppedSpeakingFrame())
    stopped_at = time.monotonic()
    await harness.wait_for(lambda: len(worker.requests) == 2)
    waited = time.monotonic() - stopped_at
    await harness.stop()
    assert waited >= PAUSE - VAD_STOP - 0.02
    learner_lines = [line.text for line in worker.requests[1].lines if line.speaker == "learner"]
    assert learner_lines == ["I like green tea"]


async def test_late_transcript_still_ends_the_turn() -> None:
    harness, _conversation, worker = build([TutorTurn("Hi."), TutorTurn("Nice.")])
    await harness.start()
    await harness.wait_for(lambda: len(worker.requests) == 1)
    await asyncio.sleep(0.1)
    await harness.send(VADUserStartedSpeakingFrame(), VADUserStoppedSpeakingFrame())
    await asyncio.sleep(PAUSE + 0.1)
    assert len(worker.requests) == 1  # nothing heard yet, so the turn has not ended
    await harness.send(said("Yes"))
    await harness.wait_for(lambda: len(worker.requests) == 2)
    await harness.stop()
    assert worker.requests[1].lines[-1].text == "Yes"


async def test_barge_in_stops_the_tutor() -> None:
    long_text = "Let me tell you a long story about a cat who lived by the sea. " * 3
    harness, conversation, worker = build([TutorTurn(long_text), TutorTurn("Sorry, go on.")], secs_per_char=0.01)
    await harness.start()
    await harness.wait_for(lambda: bool(harness.collector.of(TTSAudioRawFrame)))
    await asyncio.sleep(0.15)
    await harness.send(VADUserStartedSpeakingFrame())
    await harness.wait_for(lambda: bool(harness.collector.of(InterruptionFrame)))
    spoken_at_interruption = len(harness.collector.of(TTSAudioRawFrame))
    await asyncio.sleep(0.2)
    spoken_after = len(harness.collector.of(TTSAudioRawFrame))
    await harness.send(said("Wait"), VADUserStoppedSpeakingFrame())
    await harness.wait_for(lambda: len(worker.requests) == 2)
    await harness.stop()
    full = round(len(long_text) * 0.01 / 0.02)
    assert spoken_at_interruption < full
    assert spoken_after == spoken_at_interruption
    assert conversation.transcript.lines[0].interrupted
    assert {"type": "interrupted"} not in messages(harness)  # the serializer sends that, from InterruptionFrame


async def test_learner_speaking_drops_a_pending_reply() -> None:
    harness, conversation, worker = build([TutorTurn("Hi."), TutorTurn("Stale."), TutorTurn("Fresh.")], delay=0.3)
    await harness.start()
    await harness.wait_for(lambda: len(conversation.transcript.lines) == 1)
    await asyncio.sleep(0.1)
    await harness.send(VADUserStartedSpeakingFrame(), said("I"), VADUserStoppedSpeakingFrame())
    await harness.wait_for(lambda: len(worker.requests) == 2)
    await harness.send(VADUserStartedSpeakingFrame(), said("mean"), VADUserStoppedSpeakingFrame())
    await harness.wait_for(lambda: len(worker.requests) == 3)
    await harness.wait_for(lambda: conversation.transcript.lines[-1].speaker == "tutor")
    await harness.stop()
    assert [line.text for line in conversation.transcript.lines] == ["Hi.", "I", "mean", "Stale."]


async def test_tutor_ends_the_conversation() -> None:
    harness, conversation, worker = build([TutorTurn("Hi."), TutorTurn("Bye!", end=True)])
    await harness.start()
    await harness.wait_for(lambda: len(worker.requests) == 1)
    await asyncio.sleep(0.05)
    await harness.send(VADUserStartedSpeakingFrame(), said("Bye"), VADUserStoppedSpeakingFrame())
    await harness.finished()
    assert conversation.reason == "tutor_ended"
    assert harness.collector.of(EndFrame)
    assert {"reason": "tutor_ended", "type": "ended"} in messages(harness)
    result = conversation.result("disconnected")
    assert [line.text for line in result.lines] == ["Hi.", "Bye", "Bye!"]


async def test_learner_ends_the_conversation() -> None:
    harness, conversation, _worker = build([TutorTurn("Hi.")])
    await harness.start()
    await harness.wait_for(lambda: len(conversation.transcript.lines) == 1)
    await harness.send(LearnerEndedFrame())
    await harness.finished()
    assert conversation.reason == "learner_ended"


async def test_session_limit_ends_the_conversation() -> None:
    harness, conversation, _worker = build([TutorTurn("Hi.")], limit=0.5)
    started = time.monotonic()
    await harness.start()
    await harness.finished()
    assert conversation.reason == "time_limit"
    assert 0.45 <= time.monotonic() - started < 2.0
    assert 0.45 <= conversation.result("disconnected").duration_secs < 1.0
