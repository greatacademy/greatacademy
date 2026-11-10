"""The entry point: configuration from the environment, logging, and the server."""

import asyncio
import os
import sys
import time
from collections.abc import Mapping
from dataclasses import dataclass

from loguru import logger

from ga_voice.drain import Admission
from ga_voice.server import VoiceApp, make_server
from ga_voice.session import SessionSettings
from ga_voice.speech import FakeSpeechServices, SpeechServices, UnconfiguredSpeechServices
from ga_voice.tickets import TicketVerifier, load_public_key
from ga_voice.turns import SESSION_LIMIT_SECS
from ga_voice.worker_client import HttpWorkerClient


@dataclass(frozen=True, slots=True)
class Config:
    """Config is the service's configuration, read from ``VOICE_*`` environment variables."""

    ticket_public_key: str
    worker_url: str
    worker_credential: str
    host: str = "0.0.0.0"  # noqa: S104 - the container listens on all interfaces
    port: int = 8080
    capacity: int = 4
    session_limit_secs: float = SESSION_LIMIT_SECS
    drain_timeout_secs: float = 24 * 60
    speech: str = "unconfigured"
    log_level: str = "INFO"


class ConfigError(Exception):
    """ConfigError is raised for a missing or bad environment variable."""


def load_config(env: Mapping[str, str]) -> Config:
    """load_config reads the configuration; the key, Worker URL and credential are required."""

    def required(name: str) -> str:
        value = env.get(name, "").strip()
        if not value:
            raise ConfigError(f"{name} is not set")
        return value

    speech = env.get("VOICE_SPEECH", "unconfigured")
    if speech not in ("unconfigured", "fake"):
        raise ConfigError("VOICE_SPEECH must be 'unconfigured' or 'fake'")
    try:
        return Config(
            ticket_public_key=required("VOICE_TICKET_PUBLIC_KEY"),
            worker_url=required("VOICE_WORKER_URL"),
            worker_credential=required("VOICE_WORKER_CREDENTIAL"),
            host=env.get("VOICE_HOST", "0.0.0.0"),  # noqa: S104
            port=int(env.get("VOICE_PORT", "8080")),
            capacity=int(env.get("VOICE_CAPACITY", "4")),
            session_limit_secs=float(env.get("VOICE_SESSION_LIMIT_SECS", str(SESSION_LIMIT_SECS))),
            drain_timeout_secs=float(env.get("VOICE_DRAIN_TIMEOUT_SECS", str(24 * 60))),
            speech=speech,
            log_level=env.get("VOICE_LOG_LEVEL", "INFO").upper(),
        )
    except ValueError as error:
        raise ConfigError(f"bad number: {error}") from error


def configure_logging(level: str) -> None:
    """configure_logging keeps logs free of what learners say.

    Pipecat's own records may describe frames, which can hold transcripts, so
    only its warnings and errors are kept, and debug output is never enabled.
    """
    effective = "INFO" if level in ("DEBUG", "TRACE") else level

    def keep(record: Mapping[str, object]) -> bool:
        name = str(record.get("name") or "")
        if name.startswith("pipecat"):
            level_info = record.get("level")
            number = getattr(level_info, "no", 0)
            return isinstance(number, int) and number >= logger.level("WARNING").no
        return True

    logger.remove()
    logger.add(sys.stderr, level=effective, filter=keep, backtrace=False, diagnose=False)


def speech_services(kind: str) -> SpeechServices:
    """speech_services returns the configured services; real providers come from the admin console later."""
    if kind == "fake":
        logger.warning("voice: fake speech services are on; for local development only")
        return FakeSpeechServices()
    return UnconfiguredSpeechServices()


async def serve(config: Config) -> None:
    """serve runs the server until it has drained."""
    worker = HttpWorkerClient(config.worker_url, config.worker_credential)
    voice = VoiceApp(
        admission=Admission(config.capacity),
        verifier=TicketVerifier(load_public_key(config.ticket_public_key), clock=time.time),
        services=speech_services(config.speech),
        worker=worker,
        settings=SessionSettings(limit_secs=config.session_limit_secs),
    )
    server = make_server(voice, host=config.host, port=config.port, drain_timeout_secs=config.drain_timeout_secs)
    logger.info("voice: listening on {}:{}", config.host, config.port)
    try:
        await server.serve()
    finally:
        await worker.aclose()


def main() -> None:
    """main is the ``ga-voice`` command."""
    try:
        config = load_config(os.environ)
    except ConfigError as error:
        print(f"ga-voice: {error}", file=sys.stderr)  # noqa: T201 - before logging is set up
        raise SystemExit(2) from error
    configure_logging(config.log_level)
    asyncio.run(serve(config))


if __name__ == "__main__":
    main()
