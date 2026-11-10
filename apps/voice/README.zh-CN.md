# 语音服务

> [English](README.md) | 简体中文

英语的实时对话（S6），基于 [Pipecat](https://github.com/pipecat-ai/pipecat) 1.15.0。设计见[英语课程体系 §13.3](../../docs/english-curriculum.zh-CN.md#133-语音服务)，运行方法见[开发指南 §7](../../docs/development.zh-CN.md#7-运行语音服务)。

## 模块

| 模块 | 用途 |
| :--- | :--- |
| `levels.py` | 按 CEFR 等级或年级确定学习者回合内最长的停顿 |
| `turns.py` | 回合结束、打断和会话时长上限（20 分钟），是带显式时间的普通状态 |
| `conversation.py` | Pipecat 处理器：轮流说话，向 Web Worker 询问导师要说的话，并结束会话 |
| `session.py` | 管道（传输、语音活动检测、语音转文字、对话、文字转语音）和结果写入 |
| `speech.py` | `SpeechServices` 接口，以及用于测试和本地开发的模拟实现；代码中不选定服务商 |
| `worker_client.py` | `WorkerClient` 接口：导师的下一回合，以及按会话 id 幂等写入的结果 |
| `tickets.py` | Web Worker 签发的 Ed25519 票据：约 60 秒有效，只能使用一次 |
| `messages.py`、`serializer.py` | WebSocket 消息及其 Pipecat 序列化器 |
| `drain.py`、`server.py`、`main.py` | 容量、就绪状态、`SIGTERM` 排空、FastAPI 服务器及其配置 |

## 最长停顿

以下是初始值，以后根据录制的对话调整。语音活动检测在 `stop_secs` 之后报告静音；静音达到下表的值且学习者已经说过话时，回合结束。

| CEFR | Pre-A1 | A1 | A2 | B1 | B2 | C1 | C2 |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 秒 | 2.5 | 2.2 | 1.8 | 1.5 | 1.2 | 1.0 | 0.9 |

| 年级（母语课程） | K–2 | 3–5 | 6–8 | 9 及以上 |
| :--- | ---: | ---: | ---: | ---: |
| 秒 | 1.8 | 1.4 | 1.1 | 0.9 |

票据没有等级时用 1.5 秒。

## WebSocket

`/v1/conversation`。客户端先发送 `{"type":"start","ticket":"…"}`；服务回复 `ready`，或回复带代码的 `error` 后关闭（正在排空或已满的 pod 用 1013，客户端可以用同一张票据换一个 pod；票据被拒用 1008）。之后音频以二进制消息双向传输，格式为 16 kHz、16 位单声道 PCM，服务还会发送 `caption`、`interrupted`（丢弃尚未播放的导师音频），最后发送 `ended`。客户端可以发送 `{"type":"end"}`。

这些消息目前是 `messages.py` 中的 dataclass，线上用 JSON；以后改为 `libs/proto` 中字段相同的 Protobuf 消息。

## 隐私

音频和转写文本只保存在内存中，只发给语音服务和 Web Worker。日志中两者都没有：服务只记录事件名和错误类型，Pipecat 的日志只保留警告及以上级别。
