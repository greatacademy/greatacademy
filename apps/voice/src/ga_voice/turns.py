"""Turn taking and the session limit, as plain state with explicit times.

The Pipecat processor in ``conversation.py`` feeds these with the clock and
acts on what they decide, so the rules are tested without a pipeline.
"""

from dataclasses import dataclass, field

SESSION_LIMIT_SECS = 20 * 60
"""SESSION_LIMIT_SECS is the product's limit on a conversation, starting at 20 minutes."""

CLOSING_GRACE_SECS = 15.0
"""CLOSING_GRACE_SECS is how long the tutor may finish speaking after the limit before the session ends anyway."""


@dataclass(slots=True)
class TurnState:
    """TurnState decides when the learner's turn ends.

    Voice activity detection reports speech after ``vad_stop_secs`` of
    silence; the turn ends once the silence reaches ``longest_pause`` and the
    learner has said something. Speech that resumes before then continues the
    same turn.
    """

    longest_pause: float
    vad_stop_secs: float = 0.0
    speaking: bool = False
    silence_since: float | None = None
    heard: list[str] = field(default_factory=list[str])

    def speech_started(self) -> None:
        """speech_started records that the learner is speaking; any pause so far is forgotten."""
        self.speaking = True
        self.silence_since = None

    def speech_stopped(self, now: float) -> float:
        """speech_stopped records silence detected at ``now`` and returns the seconds until the turn may end."""
        self.speaking = False
        self.silence_since = now - self.vad_stop_secs
        return max(0.0, self.longest_pause - self.vad_stop_secs)

    def transcript(self, text: str) -> None:
        """transcript adds recognized words to the current turn."""
        stripped = text.strip()
        if stripped:
            self.heard.append(stripped)

    def due(self, now: float) -> bool:
        """due tells whether the learner's turn has ended at ``now``."""
        if self.speaking or self.silence_since is None or not self.heard:
            return False
        return now - self.silence_since >= self.longest_pause - 1e-9

    def take(self) -> str:
        """take returns the words of the ended turn and starts a new one."""
        text = " ".join(self.heard)
        self.heard.clear()
        self.silence_since = None
        return text


def should_barge_in(tutor_speaking: bool, reply_pending: bool) -> bool:
    """should_barge_in tells whether the learner starting to speak must stop the tutor.

    The tutor stops when speaking, and a reply still being prepared is dropped,
    since it answers words the learner is now adding to.
    """
    return tutor_speaking or reply_pending


@dataclass(frozen=True, slots=True)
class SessionClock:
    """SessionClock measures a session against its limit."""

    started_at: float
    limit_secs: float = SESSION_LIMIT_SECS

    def remaining(self, now: float) -> float:
        """remaining returns the seconds left, never below zero."""
        return max(0.0, self.started_at + self.limit_secs - now)

    def expired(self, now: float) -> bool:
        """expired tells whether the limit has been reached."""
        return self.remaining(now) == 0.0

    def elapsed(self, now: float) -> float:
        """elapsed returns the seconds since the session started."""
        return max(0.0, now - self.started_at)
