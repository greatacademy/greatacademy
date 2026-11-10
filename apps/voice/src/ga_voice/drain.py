"""Admission of sessions, capacity and graceful drain.

On ``SIGTERM`` the service stops admitting sessions and reports not ready, and
the running sessions finish; the process exits when none is left or the grace
period ends. A pod also reports not ready while it is full.
"""

import asyncio


class Admission:
    """Admission counts running sessions against a capacity and refuses new ones while draining."""

    def __init__(self, capacity: int) -> None:
        self._capacity = capacity
        self._active = 0
        self._draining = False
        self._idle = asyncio.Event()
        self._idle.set()

    @property
    def capacity(self) -> int:
        """capacity is the number of sessions the pod runs at once."""
        return self._capacity

    @property
    def active(self) -> int:
        """active is the number of running sessions."""
        return self._active

    @property
    def draining(self) -> bool:
        """draining tells whether a drain has begun."""
        return self._draining

    @property
    def ready(self) -> bool:
        """ready tells whether a new session would be admitted; it backs the readiness probe."""
        return not self._draining and self._active < self._capacity

    def refusal(self) -> str | None:
        """refusal returns why a new session would be refused, or None if it would be admitted."""
        if self._draining:
            return "draining"
        if self._active >= self._capacity:
            return "full"
        return None

    def admit(self) -> bool:
        """admit takes a place for a new session; it returns False when refused."""
        if self.refusal() is not None:
            return False
        self._active += 1
        self._idle.clear()
        return True

    def release(self) -> None:
        """release gives back a session's place."""
        self._active = max(0, self._active - 1)
        if self._active == 0:
            self._idle.set()

    def begin_drain(self) -> None:
        """begin_drain refuses every later session; running ones continue."""
        self._draining = True

    async def wait_idle(self, within_secs: float | None = None) -> bool:
        """wait_idle waits until no session runs; it returns False if ``within_secs`` passed first."""
        try:
            await asyncio.wait_for(self._idle.wait(), within_secs)
        except TimeoutError:
            return False
        return True
