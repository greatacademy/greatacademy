"""Recordings made ahead of time, played by the tutor instead of speaking a line.

The English content records each conversation's opening as 16 kHz 16-bit mono
PCM in a WAV file (tools/audio), the audio this service sends, so it plays as
it is with no decoding.
"""

import io
import wave

from ga_voice.messages import SAMPLE_RATE

CHUNK_SECS = 0.02
"""CHUNK_SECS is how much audio each frame of a recording carries: 20 ms."""


class RecordingError(Exception):
    """RecordingError is raised for a file that is not 16 kHz 16-bit mono WAV."""


def pcm_of_wav(data: bytes) -> bytes:
    """pcm_of_wav returns the samples of a WAV file of 16 kHz 16-bit mono PCM."""
    try:
        with wave.open(io.BytesIO(data), "rb") as w:
            if w.getframerate() != SAMPLE_RATE or w.getnchannels() != 1 or w.getsampwidth() != 2:
                raise RecordingError("not 16 kHz 16-bit mono")
            pcm = w.readframes(w.getnframes())
    except (wave.Error, EOFError) as error:
        raise RecordingError("not a WAV file") from error
    if not pcm:
        raise RecordingError("empty")
    return pcm


def chunks(pcm: bytes) -> list[bytes]:
    """chunks splits samples into frames of CHUNK_SECS each, the last one shorter."""
    size = int(SAMPLE_RATE * CHUNK_SECS) * 2
    return [pcm[i : i + size] for i in range(0, len(pcm), size)]
