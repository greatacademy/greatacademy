# Voice Service

> English | [简体中文](README.zh-CN.md)

Live conversation (S6) for English, on [Pipecat](https://github.com/pipecat-ai/pipecat) 1.15.0. The design is in [English Curriculum §13.3](../../docs/english-curriculum.md#133-the-voice-service); running it is in [Development §7](../../docs/development.md#7-running-the-voice-service).

## Modules

| Module | Purpose |
| :--- | :--- |
| `levels.py` | The longest pause in a learner's turn, by CEFR level or grade |
| `turns.py` | End of turn, barge-in and the session limit (20 minutes), as plain state with explicit times |
| `conversation.py` | The Pipecat processor that takes turns, asks the web Worker for the tutor's words, and ends the session |
| `session.py` | The pipeline (transport, voice activity, speech-to-text, conversation, text-to-speech) and the result write |
| `speech.py` | The `SpeechServices` interface, and fakes for tests and local development; no provider is chosen in code |
| `worker_client.py` | The `WorkerClient` interface: the tutor's next turn, and the result written idempotently by session id |
| `tickets.py` | Ed25519 tickets from the web Worker: about 60 seconds, used once |
| `messages.py`, `serializer.py` | The WebSocket messages and their Pipecat serializer |
| `drain.py`, `server.py`, `main.py` | Capacity, readiness, `SIGTERM` drain, the FastAPI server and its configuration |

## Longest Pause

Starting values, tuned later on recorded conversations. Voice activity reports silence after `stop_secs`; the turn ends when the silence reaches the value below and the learner has said something.

| CEFR | Pre-A1 | A1 | A2 | B1 | B2 | C1 | C2 |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Seconds | 2.5 | 2.2 | 1.8 | 1.5 | 1.2 | 1.0 | 0.9 |

| Grade (native courses) | K–2 | 3–5 | 6–8 | 9 and up |
| :--- | ---: | ---: | ---: | ---: |
| Seconds | 1.8 | 1.4 | 1.1 | 0.9 |

A ticket without a level gets 1.5 seconds.

## WebSocket

`/v1/conversation`. The client sends `{"type":"start","ticket":"…"}` first; the service answers `ready`, or `error` with a code and closes (1013 for a pod that is draining or full, so the client tries another with the same ticket; 1008 for a refused ticket). Then audio flows both ways as binary messages of 16-bit mono PCM at 16 kHz, and the service sends `caption`, `interrupted` (drop unplayed tutor audio) and finally `ended`. The client may send `{"type":"end"}`.

These messages are dataclasses in `messages.py` and JSON on the wire for now; they become Protobuf messages in `libs/proto`, with the same fields.

## Privacy

Audio and transcripts stay in memory and go only to the speech services and the web Worker. Logs hold neither: the service logs only event names and error types, and Pipecat's records are kept from warnings up.
