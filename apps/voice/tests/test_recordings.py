import io
import wave

import pytest

from ga_voice.recordings import RecordingError, chunks, pcm_of_wav


def wav(rate: int = 16000, channels: int = 1, frames: int = 800) -> bytes:
    out = io.BytesIO()
    with wave.open(out, "wb") as w:
        w.setnchannels(channels)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(b"\x01\x00" * frames * channels)
    return out.getvalue()


def test_samples_of_16_khz_mono_wav() -> None:
    pcm = pcm_of_wav(wav())
    assert len(pcm) == 1600
    assert [len(c) for c in chunks(pcm)] == [640, 640, 320]


def test_other_audio_is_refused() -> None:
    for data in (wav(rate=24000), wav(channels=2), wav(frames=0), b"not a wav"):
        with pytest.raises(RecordingError):
            pcm_of_wav(data)
