import asyncio

from ga_voice.drain import Admission


def test_capacity() -> None:
    admission = Admission(capacity=2)
    assert admission.capacity == 2
    assert admission.admit()
    assert admission.admit()
    assert not admission.ready
    assert admission.refusal() == "full"
    assert not admission.admit()
    admission.release()
    assert admission.ready


async def test_drain_refuses_new_sessions_and_waits_for_running_ones() -> None:
    admission = Admission(capacity=4)
    assert admission.admit()
    admission.begin_drain()
    assert admission.refusal() == "draining"
    assert not admission.admit()
    assert not admission.ready
    assert not await admission.wait_idle(0.05)
    asyncio.get_running_loop().call_later(0.05, admission.release)
    assert await admission.wait_idle(1.0)
    assert admission.active == 0
