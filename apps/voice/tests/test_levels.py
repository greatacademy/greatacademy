import pytest

from ga_voice.levels import CEFR_PAUSE_SECS, DEFAULT_PAUSE_SECS, LearnerLevel, longest_pause


@pytest.mark.parametrize(
    ("level", "expected"),
    [
        (LearnerLevel(cefr="a1"), 2.2),
        (LearnerLevel(cefr="B2"), 1.2),
        (LearnerLevel(cefr="c2"), 0.9),
        (LearnerLevel(cefr="x9"), DEFAULT_PAUSE_SECS),
        (LearnerLevel(grade=0), 1.8),
        (LearnerLevel(grade=4), 1.4),
        (LearnerLevel(grade=8), 1.1),
        (LearnerLevel(grade=11), 0.9),
        (LearnerLevel(grade=14), 0.9),
        (LearnerLevel(), DEFAULT_PAUSE_SECS),
        (LearnerLevel(cefr="a2", grade=11), 1.8),
    ],
)
def test_longest_pause(level: LearnerLevel, expected: float) -> None:
    assert longest_pause(level) == expected


def test_lower_levels_pause_longer() -> None:
    order = ["pre-a1", "a1", "a2", "b1", "b2", "c1", "c2"]
    pauses = [CEFR_PAUSE_SECS[level] for level in order]
    assert pauses == sorted(pauses, reverse=True)
