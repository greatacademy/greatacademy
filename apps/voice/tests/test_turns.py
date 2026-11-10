from ga_voice.turns import SESSION_LIMIT_SECS, SessionClock, TurnState, should_barge_in


def test_turn_ends_after_the_longest_pause_counting_vad_delay() -> None:
    state = TurnState(longest_pause=1.5, vad_stop_secs=0.2)
    state.speech_started()
    state.transcript("I went")
    # The detector reports silence 0.2 s after it began, at t = 10.2.
    assert state.speech_stopped(10.2) == 1.3
    assert not state.due(11.4)
    assert state.due(11.5)
    assert state.take() == "I went"
    assert not state.due(20.0)


def test_resumed_speech_continues_the_turn() -> None:
    state = TurnState(longest_pause=1.0)
    state.speech_started()
    state.transcript("I went")
    state.speech_stopped(5.0)
    state.speech_started()
    assert not state.due(7.0)
    state.transcript(" to the park ")
    state.speech_stopped(8.0)
    assert state.due(9.0)
    assert state.take() == "I went to the park"


def test_no_words_no_turn() -> None:
    state = TurnState(longest_pause=1.0)
    state.speech_started()
    state.speech_stopped(1.0)
    state.transcript("   ")
    assert not state.due(5.0)


def test_barge_in() -> None:
    assert should_barge_in(tutor_speaking=True, reply_pending=False)
    assert should_barge_in(tutor_speaking=False, reply_pending=True)
    assert not should_barge_in(tutor_speaking=False, reply_pending=False)


def test_session_clock() -> None:
    clock = SessionClock(started_at=100.0)
    assert SESSION_LIMIT_SECS == 1200
    assert clock.remaining(100.0) == 1200
    assert not clock.expired(1299.0)
    assert clock.expired(1300.0)
    assert clock.remaining(2000.0) == 0.0
    assert clock.elapsed(160.0) == 60.0
