from pipecat.frames.frames import BotStartedSpeakingFrame, TranscriptionFrame, VADUserStoppedSpeakingFrame

from ga_voice.speech import FakeSpeechToText

from .harness import Harness


async def lines_heard(stt: FakeSpeechToText, *turns: int) -> list[str]:
    """lines_heard runs turns of the learner's, each that many stretches of speech, with the tutor speaking between."""
    harness = Harness([stt])
    await harness.start()
    try:
        for stretches in turns:
            await harness.send(*[VADUserStoppedSpeakingFrame() for _ in range(stretches)], BotStartedSpeakingFrame())
        await harness.wait_for(lambda: len(harness.collector.of(BotStartedSpeakingFrame)) == len(turns))
        return [f.text for f in harness.collector.of(TranscriptionFrame) if isinstance(f, TranscriptionFrame)]
    finally:
        await harness.stop()


async def test_fake_stt_says_one_line_a_turn_however_often_the_learner_pauses() -> None:
    assert await lines_heard(FakeSpeechToText(["a", "b", "c"]), 3, 1) == ["a", "b"]


async def test_fake_stt_runs_out_unless_it_cycles() -> None:
    assert await lines_heard(FakeSpeechToText(["a", "b"]), 1, 1, 1) == ["a", "b"]
    assert await lines_heard(FakeSpeechToText(["a", "b"], cycle=True), 1, 1, 1) == ["a", "b", "a"]
