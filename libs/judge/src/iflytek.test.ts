import { describe, expect, it } from "vitest";

import { heardFromIflytek, iflytekKey, iflytekSpeech, iflytekUrl, type Socket } from "./iflytek.ts";
import { SpeechFailed, speechProtocol, writeWav } from "./speech.ts";

const second = new Uint8Array(32_000);

const XML = `<?xml version="1.0" encoding="utf-8"?><xml_result><read_sentence lan="cn" type="study" version="7,0,0,1024">
<rec_paper><read_sentence content="你好" total_score="72.5" fluency_score="80" integrity_score="100" is_rejected="false">
<sentence content="你好"><word content="你好">
<syll content="你" symbol="ni3" dp_message="0" rec_node_type="paper" syll_score="90"><phone content="n" is_yun="0" perr_msg="0"/><phone content="i" is_yun="1" perr_msg="0" mono_tone="TONE3"/></syll>
<syll content="好" symbol="hao3" dp_message="0" rec_node_type="paper" syll_score="55"><phone content="h" is_yun="0" perr_msg="1"/><phone content="ao" is_yun="1" perr_msg="2" mono_tone="TONE4"/></syll>
<syll content="sil" dp_message="0" rec_node_type="sil"></syll>
</word></sentence></read_sentence></rec_paper></read_sentence></xml_result>`;

/** fakeSocket answers like iFlytek once the last frame is sent, and keeps what was sent. */
function fakeSocket(answer: (sent: readonly unknown[]) => string): { connect: (url: string) => Socket; sent: unknown[]; urls: string[] } {
  const sent: unknown[] = [];
  const urls: string[] = [];
  const connect = (url: string): Socket => {
    urls.push(url);
    const socket: Socket = {
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      send(data) {
        const message = JSON.parse(data) as { data?: { status?: number } };
        sent.push(message);
        if (message.data?.status === 2) queueMicrotask(() => socket.onmessage?.({ data: answer(sent) }));
      },
      close() {},
    };
    queueMicrotask(() => socket.onopen?.());
    return socket;
  };
  return { connect, sent, urls };
}

const deps = (connect: (url: string) => Socket) => ({ connect, now: () => new Date(Date.UTC(2026, 10, 17)), pause: async () => {} });

describe("iflytek", () => {
  it("is told by its host", () => {
    expect(speechProtocol("https://ise-api-sg.xf-yun.com/v2/ise?group=pupil")).toBe("iflytek");
    expect(speechProtocol("https://ise-api.xfyun.cn/v2/open-ise")).toBe("iflytek");
    expect(speechProtocol("https://example.xfyun.cn")).toBeUndefined();
  });

  it("takes a key of three parts", () => {
    expect(iflytekKey("app:key:secret")).toEqual({ appId: "app", apiKey: "key", apiSecret: "secret" });
    expect(() => iflytekKey("key")).toThrow(SpeechFailed);
  });

  it("signs the socket's URL", async () => {
    const url = new URL(await iflytekUrl("https://ise-api-sg.xf-yun.com/v2/ise", iflytekKey("a:k:s"), new Date(Date.UTC(2026, 10, 17))));
    expect(url.protocol).toBe("wss:");
    expect(url.pathname).toBe("/v2/ise");
    expect(url.searchParams.get("date")).toBe("Tue, 17 Nov 2026 00:00:00 GMT");
    expect(atob(url.searchParams.get("authorization")!)).toMatch(
      /^api_key="k", algorithm="hmac-sha256", headers="host date request-line", signature="[A-Za-z0-9+/=]+"$/,
    );
  });

  it("reads each syllable's score and what was wrong with it", () => {
    expect(heardFromIflytek(XML, "你好", 1)).toEqual({
      text: "你好",
      confidence: 1,
      seconds: 1,
      accuracy: 72.5,
      fluency: 80,
      completeness: 100,
      words: [
        { word: "你", accuracy: 90, pinyin: "ni3" },
        { word: "好", accuracy: 55, error: "mispronunciation", pinyin: "hao3", wrong: ["initial", "tone"] },
      ],
    });
    expect(heardFromIflytek(XML.replace('is_rejected="false"', 'is_rejected="true"'), "你好", 1)).toEqual({
      text: "",
      confidence: 0,
      seconds: 1,
    });
  });

  it("sends the reference and the audio in frames, and keeps only a reason when it fails", async () => {
    const ok = fakeSocket(() =>
      JSON.stringify({ code: 0, data: { status: 2, data: btoa(String.fromCharCode(...new TextEncoder().encode(XML))) } }),
    );
    const provider = iflytekSpeech({ baseUrl: "https://ise-api-sg.xf-yun.com/v2/ise?group=pupil", apiKey: "a:k:s" }, deps(ok.connect));
    const heard = await provider.hear({ wav: writeWav(second), language: "zh-CN", seconds: 1, reference: "你好" });
    expect(heard.accuracy).toBe(72.5);
    const [first, ...frames] = ok.sent as { business: Record<string, unknown>; data: { status: number } }[];
    expect(first!.business).toMatchObject({ category: "read_word", group: "pupil", text: "﻿你好" });
    expect(frames).toHaveLength(25);
    expect(frames.at(-1)!.data.status).toBe(2);

    const refused = fakeSocket(() => JSON.stringify({ code: 10163, message: "secret detail" }));
    await expect(
      iflytekSpeech({ baseUrl: "https://ise-api-sg.xf-yun.com/v2/ise", apiKey: "a:k:s" }, deps(refused.connect)).hear({
        wav: writeWav(second),
        language: "zh-CN",
        seconds: 1,
        reference: "你好",
      }),
    ).rejects.toEqual(new SpeechFailed("code-10163"));
    await expect(provider.hear({ wav: writeWav(second), language: "zh-CN", seconds: 1 })).rejects.toEqual(new SpeechFailed("no-reference"));
    await expect(provider.hear({ wav: writeWav(second), language: "en-US", seconds: 1, reference: "hi" })).rejects.toEqual(
      new SpeechFailed("unsupported-language"),
    );
  });
});
