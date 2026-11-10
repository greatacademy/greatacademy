import json
from dataclasses import replace

import httpx
import pytest

from ga_voice.messages import Line
from ga_voice.worker_client import (
    FakeWorkerClient,
    HttpWorkerClient,
    SessionResult,
    TurnRequest,
    TutorTurn,
    WorkerError,
)

RESULT = SessionResult(
    session="s-1", learner="l-1", course="c-1", lines=(Line("tutor", "Hi"),), reason="tutor_ended", duration_secs=3.0
)


def client(handler: httpx.MockTransport) -> HttpWorkerClient:
    return HttpWorkerClient("http://worker.test/", "secret", httpx.AsyncClient(transport=handler))


async def test_next_turn() -> None:
    seen: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(200, json={"text": "How was school?", "end": False})

    turn = await client(httpx.MockTransport(handle)).next_turn(
        TurnRequest(session="s-1", learner="l-1", course="c-1", lines=(Line("learner", "Hello"),))
    )
    assert turn == TutorTurn("How was school?")
    assert str(seen[0].url) == "http://worker.test/voice/v1/turn"
    assert seen[0].headers["authorization"] == "Bearer secret"
    assert json.loads(seen[0].content)["lines"] == [{"speaker": "learner", "text": "Hello", "interrupted": False}]


async def test_next_turn_errors() -> None:
    with pytest.raises(WorkerError):
        await client(httpx.MockTransport(lambda _r: httpx.Response(500))).next_turn(
            TurnRequest(session="s", learner="l", course="c", lines=())
        )
    with pytest.raises(WorkerError):
        await client(httpx.MockTransport(lambda _r: httpx.Response(200, json={"text": 3}))).next_turn(
            TurnRequest(session="s", learner="l", course="c", lines=())
        )


async def test_write_result_is_idempotent_by_session() -> None:
    seen: list[httpx.Request] = []

    def handle(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        return httpx.Response(204)

    worker = client(httpx.MockTransport(handle))
    await worker.write_result(RESULT)
    await worker.write_result(RESULT)
    assert all(r.method == "PUT" for r in seen)
    assert {str(r.url) for r in seen} == {"http://worker.test/voice/v1/sessions/s-1/result"}
    assert {r.headers["idempotency-key"] for r in seen} == {"s-1"}


async def test_fake_keeps_the_first_result() -> None:
    fake = FakeWorkerClient([])
    await fake.write_result(RESULT)
    await fake.write_result(replace(RESULT, reason="error"))
    assert fake.result_writes == 2
    assert fake.results == {"s-1": RESULT}
