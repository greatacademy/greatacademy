"""The Pipecat serializer for the conversation WebSocket (see ``messages.py``)."""

import json
from typing import override

from pipecat.frames.frames import (
    Frame,
    InputAudioRawFrame,
    InterruptionFrame,
    OutputAudioRawFrame,
    OutputTransportMessageFrame,
    OutputTransportMessageUrgentFrame,
)
from pipecat.serializers.base_serializer import FrameSerializer

from ga_voice.conversation import LearnerEndedFrame
from ga_voice.messages import SAMPLE_RATE, EndMessage, InterruptedMessage, MessageError, decode_client, encode


class VoiceSerializer(FrameSerializer):
    """VoiceSerializer maps WebSocket messages to Pipecat frames and back.

    Binary messages are PCM audio; text messages are the JSON objects of
    ``messages.py``. Any other frame is not sent.
    """

    @override
    async def serialize(self, frame: Frame) -> str | bytes | None:
        """serialize turns tutor audio, transport messages and interruptions into WebSocket messages."""
        if isinstance(frame, OutputAudioRawFrame):
            return frame.audio
        if isinstance(frame, (OutputTransportMessageFrame, OutputTransportMessageUrgentFrame)):
            if self.should_ignore_frame(frame):
                return None
            return json.dumps(frame.message, separators=(",", ":"), ensure_ascii=False)
        if isinstance(frame, InterruptionFrame):
            return encode(InterruptedMessage())
        return None

    @override
    async def deserialize(self, data: str | bytes) -> Frame | None:
        """deserialize turns learner audio and the end message into frames; anything else is ignored."""
        if isinstance(data, bytes):
            if len(data) % 2:
                return None
            return InputAudioRawFrame(audio=data, sample_rate=SAMPLE_RATE, num_channels=1)
        try:
            message = decode_client(data)
        except MessageError:
            return None
        if isinstance(message, EndMessage):
            return LearnerEndedFrame()
        return None
