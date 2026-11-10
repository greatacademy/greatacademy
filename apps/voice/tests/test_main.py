import sys

import pytest
from loguru import logger

from ga_voice.main import ConfigError, configure_logging, load_config

ENV = {
    "VOICE_TICKET_PUBLIC_KEY": "a2V5",
    "VOICE_WORKER_URL": "http://host.docker.internal:8787",
    "VOICE_WORKER_CREDENTIAL": "c",
}


def test_load_config_defaults() -> None:
    config = load_config(ENV)
    assert config.port == 8080
    assert config.capacity == 4
    assert config.session_limit_secs == 1200
    assert config.speech == "unconfigured"


def test_load_config_errors() -> None:
    with pytest.raises(ConfigError):
        load_config({})
    with pytest.raises(ConfigError):
        load_config({**ENV, "VOICE_SPEECH": "some-provider"})
    with pytest.raises(ConfigError):
        load_config({**ENV, "VOICE_CAPACITY": "many"})


def test_logging_drops_pipecat_debug_even_when_debug_is_asked(capsys: pytest.CaptureFixture[str]) -> None:
    configure_logging("DEBUG")
    logger.patch(lambda r: r.update(name="pipecat.services.stt")).debug("Transcription: my secret")
    logger.patch(lambda r: r.update(name="pipecat.services.stt")).warning("stt reconnecting")
    logger.debug("voice: debug line")
    logger.info("voice: info line")
    err = capsys.readouterr().err
    assert "my secret" not in err
    assert "debug line" not in err
    assert "stt reconnecting" in err
    assert "info line" in err
    logger.remove()
    logger.add(sys.stderr)
