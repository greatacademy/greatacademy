import { describe, expect, it } from "vitest";

import { azureSpeech, heardFromAzure, readWav, SpeechFailed, speechProtocol, WavRejected, writeWav } from "./speech.ts";

const second = new Uint8Array(32_000);

describe("readWav", () => {
  it("takes 16 kHz mono 16-bit PCM and measures it", () => {
    expect(readWav(writeWav(second), 5).seconds).toBe(1);
  });

  it("rejects what is too long, too short or not a WAV", () => {
    expect(() => readWav(writeWav(new Uint8Array(32_000 * 7)), 5)).toThrow(WavRejected);
    expect(() => readWav(writeWav(new Uint8Array(100)), 5)).toThrow(/too-short/);
    expect(() => readWav(new Uint8Array(100), 5)).toThrow(/not-wav/);
    const stereo = writeWav(second);
    new DataView(stereo.buffer).setUint16(22, 2, true);
    expect(() => readWav(stereo, 5)).toThrow(/bad-format/);
  });
});

describe("Azure", () => {
  it("is told by its host", () => {
    expect(speechProtocol("https://eastus.api.cognitive.microsoft.com")).toBe("azure");
    expect(speechProtocol("https://westeurope.stt.speech.microsoft.com")).toBe("azure");
    expect(speechProtocol("https://api.openai.com/v1")).toBeUndefined();
  });

  it("reads the detailed answer with its pronunciation scores", () => {
    const heard = heardFromAzure(
      {
        RecognitionStatus: "Success",
        Duration: 9_000_000,
        NBest: [
          {
            Confidence: 0.93,
            Display: "Sheep.",
            PronunciationAssessment: { AccuracyScore: 72, FluencyScore: 90, CompletenessScore: 100 },
            Words: [{ Word: "sheep", PronunciationAssessment: { AccuracyScore: 72, ErrorType: "None" } }],
          },
        ],
      },
      1,
    );
    expect(heard).toEqual({
      text: "Sheep.",
      confidence: 0.93,
      seconds: 0.9,
      accuracy: 72,
      fluency: 90,
      completeness: 100,
      words: [{ word: "sheep", accuracy: 72 }],
    });
    expect(heardFromAzure({ RecognitionStatus: "NoMatch" }, 2)).toEqual({ text: "", confidence: 0, seconds: 2 });
  });

  it("sends the reference for assessment, and keeps only a reason when it fails", async () => {
    let sent: Request | undefined;
    const ok = azureSpeech({ baseUrl: "https://eastus.api.cognitive.microsoft.com", apiKey: "k" }, async (url, init) => {
      sent = new Request(url, init);
      return Response.json({ RecognitionStatus: "Success", NBest: [{ Confidence: 0.8, Display: "Hi." }] });
    });
    const heard = await ok.hear({ wav: writeWav(second), language: "en-US", seconds: 1, reference: "Hi." });
    expect(heard.text).toBe("Hi.");
    expect(sent?.url).toContain("eastus.stt.speech.microsoft.com");
    expect(sent?.url).toContain("language=en-US");
    expect(JSON.parse(atob(sent!.headers.get("Pronunciation-Assessment")!)).ReferenceText).toBe("Hi.");
    const down = azureSpeech(
      { baseUrl: "https://eastus.api.cognitive.microsoft.com", apiKey: "k" },
      async () => new Response("secret", { status: 401 }),
    );
    await expect(down.hear({ wav: writeWav(second), language: "en-US", seconds: 1 })).rejects.toEqual(new SpeechFailed("status-401"));
  });
});
