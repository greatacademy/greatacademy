import json
from dataclasses import replace

import httpx
import pytest

from ga_voice.api_client import (
    ApiError,
    FakeApiClient,
    HttpApiClient,
    SessionRef,
    SessionResult,
    SessionSpeech,
    SpeechService,
    TurnRequest,
    TutorTurn,
)
from ga_voice.messages import Line

RESULT = SessionResult(
    session="s-1", learner="l-1", course="c-1", lines=(Line("tutor", "Hi"),), reason="tutor_ended", duration_secs=3.0
)


def client(handler: httpx.MockTransport) -> HttpApiClient:
    return HttpApiClient("http://api.test/", "secret", "https://site.test/", httpx.AsyncClient(transport=handler))


async def test_next_turn() -> None:
    seen: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json={"text": "How was school?", "end": False})

    turn = await client(httpx.MockTransport(handle)).next_turn(
        TurnRequest(session="s-1", learner="l-1", course="c-1", lines=(Line("learner", "Hello"),))
    )
    assert turn == TutorTurn("How was school?")
    assert str(seen[0].url) == "http://api.test/voice/v1/turn"
    assert seen[0].headers["authorization"] == "Bearer secret"
    assert json.loads(seen[0].content)["lines"] == [{"speaker": "learner", "text": "Hello", "interrupted": False}]


async def test_next_turn_errors() -> None:
    with pytest.raises(ApiError):
        await client(httpx.MockTransport(lambda _r: httpx.Response(500))).next_turn(
            TurnRequest(session="s", learner="l", course="c", lines=())
        )
    with pytest.raises(ApiError):
        await client(httpx.MockTransport(lambda _r: httpx.Response(200, json={"text": 3}))).next_turn(
            TurnRequest(session="s", learner="l", course="c", lines=())
        )


async def test_write_result_is_idempotent_by_session() -> None:
    seen: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(204)

    api = client(httpx.MockTransport(handle))
    await api.write_result(RESULT)
    await api.write_result(RESULT)
    assert all(r.method == "PUT" for r in seen)
    assert {str(r.url) for r in seen} == {"http://api.test/voice/v1/sessions/s-1/result"}
    assert {r.headers["idempotency-key"] for r in seen} == {"s-1"}


async def test_fake_keeps_the_first_result() -> None:
    fake = FakeApiClient([])
    await fake.write_result(RESULT)
    await fake.write_result(replace(RESULT, reason="error"))
    assert fake.result_writes == 2
    assert fake.results == {"s-1": RESULT}


async def test_a_turn_may_name_a_recording_fetched_without_the_credential() -> None:
    path = "audio/english/0123456789abcdef.wav"
    seen: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        if request.url.path == "/voice/v1/turn":
            return httpx.Response(200, json={"text": "Hi!", "end": False, "audio": path})
        return httpx.Response(200, content=b"RIFF")

    api = client(httpx.MockTransport(handle))
    turn = await api.next_turn(TurnRequest(session="s", learner="l", course="c", lines=()))
    assert turn == TutorTurn("Hi!", audio=path)
    assert await api.recording(path) == b"RIFF"
    assert str(seen[1].url) == f"https://site.test/{path}"
    assert "authorization" not in seen[1].headers


async def test_a_recording_outside_audio_is_refused() -> None:
    api = client(httpx.MockTransport(lambda _r: httpx.Response(200, json={"text": "Hi", "audio": "../secret"})))
    with pytest.raises(ApiError):
        await api.next_turn(TurnRequest(session="s", learner="l", course="c", lines=()))
    with pytest.raises(ApiError):
        await api.recording("voice/v1/turn")


SPEECH = {
    "stt": {"vendor": "azure", "region": "eastus", "key": "k1", "language": "en-US", "voice": ""},
    "tts": {"vendor": "azure", "region": "eastus", "key": "k2", "language": "en-US", "voice": "en-US-AvaNeural"},
}


async def test_speech() -> None:
    seen: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json=SPEECH)

    speech = await client(httpx.MockTransport(handle)).speech(SessionRef(session="s-1", learner="l-1", course="c-1"))
    assert speech == SessionSpeech(
        stt=SpeechService("azure", "eastus", "k1", "en-US"),
        tts=SpeechService("azure", "eastus", "k2", "en-US", "en-US-AvaNeural"),
    )
    assert str(seen[0].url) == "http://api.test/voice/v1/speech"
    assert json.loads(seen[0].content) == {"session": "s-1", "learner": "l-1", "course": "c-1"}
    assert "k1" not in repr(speech)


async def test_speech_without_a_route_and_bad_answers() -> None:
    ref = SessionRef(session="s", learner="l", course="c")
    assert await client(httpx.MockTransport(lambda _r: httpx.Response(503))).speech(ref) is None
    bad = {**SPEECH, "stt": {**SPEECH["stt"], "region": "east us/../x"}}
    for response in (httpx.Response(500), httpx.Response(200, json=bad), httpx.Response(200, json=[1])):
        with pytest.raises(ApiError):
            await client(httpx.MockTransport(lambda _r, r=response: r)).speech(ref)
