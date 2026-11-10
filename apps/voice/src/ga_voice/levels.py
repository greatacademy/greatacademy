"""The longest pause a learner may take inside a turn, by level.

Learners pause longer than native speakers, and younger learners longer than
older ones, so the end of a turn waits longer for them. The values are
starting points: they are tuned on recorded conversations (E5.11, E5.12).
"""

from dataclasses import dataclass

CEFR_PAUSE_SECS: dict[str, float] = {
    "pre-a1": 2.5,
    "a1": 2.2,
    "a2": 1.8,
    "b1": 1.5,
    "b2": 1.2,
    "c1": 1.0,
    "c2": 0.9,
}
"""CEFR_PAUSE_SECS is the longest pause in seconds for foreign-language learners, by CEFR level."""

GRADE_PAUSE_SECS: tuple[tuple[int, float], ...] = (
    (2, 1.8),
    (5, 1.4),
    (8, 1.1),
    (12, 0.9),
)
"""GRADE_PAUSE_SECS is the longest pause for native speakers: (highest grade of the band, seconds).

Kindergarten is grade 0. Grades above the last band, such as college, use its value.
"""

DEFAULT_PAUSE_SECS = 1.5
"""DEFAULT_PAUSE_SECS is used when a level is not known: the B1 value, long enough for most learners."""


@dataclass(frozen=True, slots=True)
class LearnerLevel:
    """LearnerLevel names a learner's level: a CEFR level for foreign-language courses, or a grade for native ones."""

    cefr: str | None = None
    grade: int | None = None


def longest_pause(level: LearnerLevel) -> float:
    """longest_pause returns the seconds of silence after which a learner's turn ends.

    A CEFR level wins over a grade; an unknown level gets DEFAULT_PAUSE_SECS.
    """
    if level.cefr is not None:
        return CEFR_PAUSE_SECS.get(level.cefr.lower(), DEFAULT_PAUSE_SECS)
    if level.grade is not None:
        for highest, secs in GRADE_PAUSE_SECS:
            if level.grade <= highest:
                return secs
        return GRADE_PAUSE_SECS[-1][1]
    return DEFAULT_PAUSE_SECS
