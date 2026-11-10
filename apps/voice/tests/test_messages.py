import pytest
from pipecat.frames.frames import (
    InputAudioRawFrame,
    InterruptionFrame,
    OutputAudioRawFrame,
    OutputTransportMessageUrgentFrame,
    TranscriptionFrame,
)

from ga_voice.conversation import LearnerEndedFrame
from ga_voice.messages import (
    CaptionMessage,
    EndMessage,
    MessageError,
    StartMessage,
    Transcript,
    decode_client,
    encode,
    to_dict,
)
from ga_voice.serializer import VoiceSerializer


def test_client_messages() -> None:
    assert decode_client('{"type":"start","ticket":"t"}') == StartMessage(ticket="t")
    assert decode_client('{"type":"end"}') == EndMessage()
    for bad in ["", "[]", '{"type":"start"}', '{"type":"other"}']:
        with pytest.raises(MessageError):
            decode_client(bad)


def test_encode_keeps_unicode() -> None:
    assert encode(CaptionMessage(speaker="tutor", text="你好")) == '{"speaker":"tutor","text":"你好","type":"caption"}'


def test_transcript_repr_hides_text() -> None:
    transcript = Transcript()
    transcript.add("learner", "my secret")
    assert "secret" not in repr(transcript)


async def test_serializer() -> None:
    serializer = VoiceSerializer()
    audio = await serializer.deserialize(b"\x01\x00\x02\x00")
    assert isinstance(audio, InputAudioRawFrame)
    assert audio.sample_rate == 16000
    assert await serializer.deserialize(b"\x01") is None
    assert isinstance(await serializer.deserialize('{"type":"end"}'), LearnerEndedFrame)
    assert await serializer.deserialize("nonsense") is None
    assert (
        await serializer.serialize(OutputAudioRawFrame(audio=b"\x00\x00", sample_rate=16000, num_channels=1))
        == b"\x00\x00"
    )
    caption = OutputTransportMessageUrgentFrame(message=to_dict(CaptionMessage(speaker="learner", text="hi")))
    assert await serializer.serialize(caption) == '{"speaker":"learner","text":"hi","type":"caption"}'
    assert await serializer.serialize(InterruptionFrame()) == '{"type":"interrupted"}'
    assert await serializer.serialize(TranscriptionFrame(text="x", user_id="u", timestamp="")) is None
