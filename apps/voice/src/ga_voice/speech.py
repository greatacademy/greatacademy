"""The speech services a session needs, behind one interface.

No provider or model is chosen in code: administrators configure routes, and
for each session the Worker names the services that may serve its learner,
which an adapter implements (Azure AI Speech so far). Without them the service
refuses the session with ``speech_unavailable``; fake services can be switched
on for local development.
"""

import asyncio
import math
import struct
from typing import Protocol, override

from pipecat.audio.vad.silero import SileroVADAnalyzer
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
from pipecat.services.azure.stt import AzureSTTService
from pipecat.services.azure.tts import AzureTTSService
from pipecat.transcriptions.language import Language

from ga_voice.messages import SAMPLE_RATE
from ga_voice.tickets import Ticket
from ga_voice.worker_client import SessionRef, SessionSpeech, WorkerClient, WorkerError


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
    """FakeSpeechToText 'recognizes' the next scripted line in each turn of the learner's.

    Only the first stretch of speech before the tutor speaks again gets a line, so a learner who
    pauses mid-sentence still says one line a turn. With ``cycle`` the lines start over when they
    run out, as a person trying the app locally keeps talking.
    """

    def __init__(self, lines: list[str], cycle: bool = False) -> None:
        super().__init__()
        self._lines = list(lines)
        self._script = list(lines)
        self._cycle = cycle
        self._heard = False

    @override
    async def process_frame(self, frame: Frame, direction: FrameDirection) -> None:
        """process_frame drops learner audio and pushes a transcription after the turn's first stretch of speech."""
        await super().process_frame(frame, direction)
        if isinstance(frame, InputAudioRawFrame):
            return
        await self.push_frame(frame, direction)
        if isinstance(frame, BotStartedSpeakingFrame):
            self._heard = False
        elif isinstance(frame, VADUserStoppedSpeakingFrame) and not self._heard:
            if not self._lines and self._cycle:
                self._lines = list(self._script)
            if self._lines:
                self._heard = True
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

    def __init__(self, lines: list[str] | None = None, cycle: bool = False) -> None:
        self._lines = lines if lines is not None else ["Hello.", "I am fine, thank you.", "Goodbye."]
        self._cycle = cycle

    def vad_params(self) -> VADParams:
        """vad_params returns FAKE_VAD_PARAMS."""
        return FAKE_VAD_PARAMS

    def vad(self) -> VADAnalyzer:
        """vad returns a FakeVADAnalyzer."""
        return FakeVADAnalyzer(self.vad_params())

    def stt(self) -> FrameProcessor:
        """stt returns a FakeSpeechToText with the scripted lines."""
        return FakeSpeechToText(self._lines, cycle=self._cycle)

    def tts(self) -> FrameProcessor:
        """tts returns a FakeTextToSpeech."""
        return FakeTextToSpeech()


AZURE_VAD_PARAMS = VADParams(confidence=0.7, start_secs=0.2, stop_secs=0.8, min_volume=0.6)
"""AZURE_VAD_PARAMS are the voice activity settings with a real recognizer: a learner may pause briefly mid-sentence."""


class AzureSpeechServices:
    """AzureSpeechServices hears the learner with Azure AI Speech and speaks the tutor's lines with it.

    Silero tells speech from silence on the server, Azure's real-time recognition turns the learner's audio into
    text and its streaming synthesis speaks in the route's voice. Real-time recognition and synthesis keep no audio.
    """

    def __init__(self, speech: SessionSpeech) -> None:
        if speech.stt.vendor != "azure" or speech.tts.vendor != "azure" or not speech.tts.voice:
            raise SpeechUnavailableError
        self._speech = speech

    def vad_params(self) -> VADParams:
        """vad_params returns AZURE_VAD_PARAMS."""
        return AZURE_VAD_PARAMS

    def vad(self) -> VADAnalyzer:
        """vad returns a Silero analyzer."""
        return SileroVADAnalyzer(sample_rate=SAMPLE_RATE, params=self.vad_params())

    def stt(self) -> FrameProcessor:
        """stt returns Azure's real-time recognition in the session's language."""
        stt = self._speech.stt
        return AzureSTTService(
            api_key=stt.key,
            region=stt.region,
            sample_rate=SAMPLE_RATE,
            settings=AzureSTTService.Settings(language=Language(stt.language)),
        )

    def tts(self) -> FrameProcessor:
        """tts returns Azure's streaming synthesis in the route's voice."""
        tts = self._speech.tts
        return AzureTTSService(
            api_key=tts.key,
            region=tts.region,
            sample_rate=SAMPLE_RATE,
            settings=AzureTTSService.Settings(voice=tts.voice),
        )


class SpeechSource(Protocol):
    """SpeechSource gives each session its speech services."""

    async def for_session(self, ticket: Ticket) -> SpeechServices:
        """for_session returns the session's services, or raises SpeechUnavailableError."""
        ...


class FixedSpeech:
    """FixedSpeech gives every session the same kind of services: fake ones locally, or none."""

    def __init__(self, services: SpeechServices) -> None:
        self._services = services

    async def for_session(self, ticket: Ticket) -> SpeechServices:
        """for_session returns the services, raising SpeechUnavailableError when they are not configured."""
        del ticket
        self._services.vad_params()
        return self._services


class WorkerSpeech:
    """WorkerSpeech asks the Worker which speech services may serve a session's learner, as administrators set them."""

    def __init__(self, worker: WorkerClient) -> None:
        self._worker = worker

    async def for_session(self, ticket: Ticket) -> SpeechServices:
        """for_session builds the session's services, or raises SpeechUnavailableError when no route serves it."""
        try:
            speech = await self._worker.speech(
                SessionRef(session=ticket.session, learner=ticket.learner, course=ticket.course)
            )
        except WorkerError as error:
            raise SpeechUnavailableError from error
        if speech is None:
            raise SpeechUnavailableError
        return AzureSpeechServices(speech)
