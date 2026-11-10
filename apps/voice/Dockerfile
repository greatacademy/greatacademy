# The voice service. CPU only: the speech services are in the cloud.
# No volume is declared and nothing is written but /tmp; audio and transcripts stay in memory.
FROM ghcr.io/astral-sh/uv:0.13.5 AS uv

FROM python:3.14.8-slim-trixie AS build
COPY --from=uv /uv /usr/local/bin/uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_PYTHON_DOWNLOADS=never UV_NO_DEV=1
WORKDIR /app
COPY pyproject.toml uv.lock .python-version ./
RUN --mount=type=cache,target=/root/.cache/uv uv sync --locked --no-dev --no-install-project
COPY src ./src
RUN --mount=type=cache,target=/root/.cache/uv uv sync --locked --no-dev

FROM python:3.14.8-slim-trixie
RUN useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin gavoice
COPY --from=build /app /app
ENV PATH=/app/.venv/bin:$PATH PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
USER 10001
EXPOSE 8080
STOPSIGNAL SIGTERM
# Exec form, so the service is PID 1 and receives SIGTERM itself to drain.
CMD ["ga-voice"]
