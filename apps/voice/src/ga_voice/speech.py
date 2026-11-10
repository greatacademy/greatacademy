"""The speech services a session needs, behind one interface.

No provider or model is chosen in code: administrators configure them, and
adapters to real providers implement SpeechServices. Until one exists the
service refuses sessions with ``speech_unavailable``, unless the fake services
are switched on for local development.
"""

import asyncio
import math
import struct
from typing import Protocol, override

from pipecat.audio.vad.vad_analyzer import VADAnalyzer, VADParams
from pipecat.frames.frames import (
    BotStartedSpeakingFrame,
    BotStoppedSpeakingFrame,
    Frame,
    InputAudioRawFrame,
    InterruptionFrame,
    TranscriptionFrame,
    TTSAudioRawFrame,
    TTSSpeakFrame,
    TTSStartedFrame,
    TTSStoppedFrame,
    VADUserStoppedSpeakingFrame,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor

from ga_voice.messages import SAMPLE_RATE


class SpeechServices(Protocol):
    """SpeechServices makes the speech stages of one session's pipeline; each session gets new ones."""

    def vad_params(self) -> VADParams:
        """vad_params returns the voice activity settings; ``stop_secs`` counts toward the longest pause."""
        ...

    def vad(self) -> VADAnalyzer:
        """vad returns the voice activity analyzer."""
        ...

    def stt(self) -> FrameProcessor:
        """stt returns speech-to-text: it takes learner audio and pushes TranscriptionFrame."""
        ...

    def tts(self) -> FrameProcessor:
        """tts returns text-to-speech: it takes TTSSpeakFrame and pushes TTSAudioRawFrame."""
        ...


class SpeechUnavailableError(Exception):
    """SpeechUnavailableError is raised when no speech services are configured."""


class UnconfiguredSpeechServices:
    """UnconfiguredSpeechServices stands in until an administrator configures a provider."""

    def vad_params(self) -> VADParams:
        """vad_params refuses: there is nothing to configure."""
        raise SpeechUnavailableError

    def vad(self) -> VADAnalyzer:
        """vad refuses: no analyzer is configured."""
        raise SpeechUnavailableError

    def stt(self) -> FrameProcessor:
        """stt refuses: no speech-to-text is configured."""
        raise SpeechUnavailableError

    def tts(self) -> FrameProcessor:
        """tts refuses: no text-to-speech is configured."""
        raise SpeechUnavailableError


FAKE_VAD_PARAMS = VADParams(confidence=0.5, start_secs=0.04, stop_secs=0.1, min_volume=0.0)
"""FAKE_VAD_PARAMS are short so that tests run quickly."""


def rms(pcm: bytes) -> float:
    """rms returns the root mean square of 16-bit PCM, from 0 to 1."""
    count = len(pcm) // 2
    if count == 0:
        return 0.0
    samples = struct.unpack(f"<{count}h", pcm[: count * 2])
    return math.sqrt(sum(s * s for s in samples) / count) / 32768.0


def tone(secs: float, amplitude: float = 0.3, hz: float = 220.0, sample_rate: int = SAMPLE_RATE) -> bytes:
    """tone returns a sine wave as 16-bit PCM; fake speech in tests."""
    count = round(secs * sample_rate)
    peak = amplitude * 32767
    return struct.pack(
        f"<{count}h", *(round(peak * math.sin(2 * math.pi * hz * i / sample_rate)) for i in range(count))
    )


def silence(secs: float, sample_rate: int = SAMPLE_RATE) -> bytes:
    """silence returns silent 16-bit PCM."""
    return b"\x00\x00" * round(secs * sample_rate)


class FakeVADAnalyzer(VADAnalyzer):
    """FakeVADAnalyzer hears speech wherever audio is louder than a threshold."""

    def __init__(self, params: VADParams = FAKE_VAD_PARAMS, threshold: float = 0.05) -> None:
        super().__init__(sample_rate=SAMPLE_RATE, params=params)
        self._threshold = threshold

    @override
    def num_frames_required(self) -> int:
        """num_frames_required analyzes 20 ms at a time."""
        return self.sample_rate // 50

    @override
    def voice_confidence(self, buffer: bytes) -> float:
        """voice_confidence is 1 for loud audio and 0 for quiet."""
        return 1.0 if rms(buffer) >= self._threshold else 0.0


class FakeSpeechToText(FrameProcessor):
    """FakeSpeechToText 'recognizes' the next scripted line each time the learner stops speaking."""

    def __init__(self, lines: list[str]) -> None:
        super().__init__()
        self._lines = list(lines)

    @override
    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        """process_frame drops learner audio and pushes a transcription after each stretch of speech."""
        await super().process_frame(frame, direction)
        if isinstance(frame, InputAudioRawFrame):
            return
        await self.push_frame(frame, direction)
        if isinstance(frame, VADUserStoppedSpeakingFrame) and self._lines:
            await self.push_frame(TranscriptionFrame(text=self._lines.pop(0), user_id="learner", timestamp=""))


class FakeTextToSpeech(FrameProcessor):
    """FakeTextToSpeech speaks a tone for each text, ``secs_per_char`` long per character, in 20 ms chunks."""

    def __init__(self, secs_per_char: float = 0.01, chunk_secs: float = 0.02) -> None:
        super().__init__()
        self._secs_per_char = secs_per_char
        self._chunk_secs = chunk_secs

    @override
    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        """process_frame turns TTSSpeakFrame into paced audio; an interruption cancels it midway."""
        await super().process_frame(frame, direction)
        if not isinstance(frame, TTSSpeakFrame):
            await self.push_frame(frame, direction)
            return
        chunks = max(1, round(len(frame.text) * self._secs_per_char / self._chunk_secs))
        audio = tone(self._chunk_secs)
        await self.push_frame(TTSStartedFrame())
        for _ in range(chunks):
            await self.push_frame(TTSAudioRawFrame(audio=audio, sample_rate=SAMPLE_RATE, num_channels=1))
            await asyncio.sleep(self._chunk_secs)
        await self.push_frame(TTSStoppedFrame())


class FakeAudioOutput(FrameProcessor):
    """FakeAudioOutput stands in for the output transport in tests: it reports when the tutor speaks."""

    def __init__(self) -> None:
        super().__init__()
        self._speaking = False

    @override
    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        """process_frame pushes BotStartedSpeakingFrame and BotStoppedSpeakingFrame upstream."""
        await super().process_frame(frame, direction)
        if isinstance(frame, TTSAudioRawFrame) and not self._speaking:
            self._speaking = True
            await self.push_frame(BotStartedSpeakingFrame(), FrameDirection.UPSTREAM)
        await self.push_frame(frame, direction)
        if isinstance(frame, (TTSStoppedFrame, InterruptionFrame)) and self._speaking:
            self._speaking = False
            await self.push_frame(BotStoppedSpeakingFrame(), FrameDirection.UPSTREAM)


class FakeSpeechServices:
    """FakeSpeechServices makes fake stages: for tests, and for local development when switched on."""

    def __init__(self, lines: list[str] | None = None) -> None:
        self._lines = lines if lines is not None else ["Hello.", "I am fine, thank you.", "Goodbye."]

    def vad_params(self) -> VADParams:
        """vad_params returns FAKE_VAD_PARAMS."""
        return FAKE_VAD_PARAMS

    def vad(self) -> VADAnalyzer:
        """vad returns a FakeVADAnalyzer."""
        return FakeVADAnalyzer(self.vad_params())

    def stt(self) -> FrameProcessor:
        """stt returns a FakeSpeechToText with the scripted lines."""
        return FakeSpeechToText(self._lines)

    def tts(self) -> FrameProcessor:
        """tts returns a FakeTextToSpeech."""
        return FakeTextToSpeech()
