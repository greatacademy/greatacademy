import { encryptSecret } from "@ga/api";
import { calibrationPassed, createProvider, type Db, schema, setPrice } from "@ga/db";
import { createTestDb } from "@ga/db/testing";
import { fakeSpeech, writeWav } from "@ga/judge";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { parseSpeechSet, renderSpeechReport, runSpeechCalibration, type SpeechClip, wordErrors } from "./speech.ts";

const SECRET = "test-secret-for-keys-0123456789";
const AT = new Date(Date.UTC(2026, 10, 1));
const second = writeWav(new Uint8Array(32_000));

let db: Db & { close(): Promise<void> };
let providerId: string;

beforeEach(async () => {
  db = await createTestDb();
  providerId = await createProvider(db, {
    name: "Speech",
    api: "",
    baseUrl: "https://eastus.api.cognitive.microsoft.com",
    keyCipher: await encryptSecret(SECRET, "key"),
    enabled: true,
    createdAt: AT,
    updatedAt: AT,
  });
  await setPrice(db, { providerId, model: "default", inputPerMillion: 277.78, outputPerMillion: 0, updatedAt: AT });
});
afterEach(() => db.close());

const clip = (i: number, extra: Partial<SpeechClip> = {}): SpeechClip => ({
  id: `c${i}`,
  audio: `${i}.wav`,
  said: "She go to school every day.",
  reference: "She goes to school every day.",
  source: "synthetic",
  ...extra,
});

describe("speech sets", () => {
  it("read clips and refuse bad lines", () => {
    const line = JSON.stringify({ id: "a", audio: "a.wav", said: "I has a cat.", source: "person", ratings: [true, false] });
    expect(parseSpeechSet(`${line}\n`)).toEqual([
      { id: "a", audio: "a.wav", said: "I has a cat.", source: "person", ratings: [true, false] },
    ]);
    expect(() => parseSpeechSet(`${line}\n${line}`)).toThrow(/line 2: id a repeats/);
    expect(() => parseSpeechSet(JSON.stringify({ id: "b", audio: "b.wav", said: "Hi." }))).toThrow(/source/);
  });

  it("count word errors as edits", () => {
    expect(wordErrors(["she", "go", "home"], ["she", "goes", "home"])).toBe(1);
    expect(wordErrors(["a", "b"], ["a", "b", "c"])).toBe(1);
    expect(wordErrors(["a", "b"], [])).toBe(2);
  });
});

describe("runSpeechCalibration", () => {
  const stt = (clips: SpeechClip[], text: (said: string) => string) =>
    runSpeechCalibration(
      db,
      {
        use: "stt",
        language: "en-US",
        providerId,
        model: "default",
        clips,
        aiKeysSecret: SECRET,
        read: (path) => {
          expect(path).toMatch(/\.wav$/);
          return second;
        },
        minClips: 10,
        concurrency: 1,
        hear: (config) => {
          expect(config.apiKey).toBe("key");
          let i = 0;
          return fakeSpeech(() => ({ text: text(clips[i++]!.said), confidence: 0.9, seconds: 1 }));
        },
      },
      AT,
    );
  const right = (i: number): SpeechClip => ({
    id: `r${i}`,
    audio: `r${i}.wav`,
    said: "She goes to school every day.",
    source: "synthetic",
  });
  const correct = (said: string) => said.replace(" go ", " goes ");
  const passed = (criterion: string) => calibrationPassed(db, { criterion, providerId, model: "default", promptVersion: "" });

  it("passes speech-to-text that keeps errors on both criteria, and records the calibrations and their calls", async () => {
    const clips = [...Array.from({ length: 10 }, (_, i) => clip(i)), ...Array.from({ length: 10 }, (_, i) => right(i))];
    const reports = await stt(clips, (said) => said);
    expect(reports.map((r) => r.criterion)).toEqual(["stt:en-US", "stt-verbatim:en-US"]);
    expect(reports[0]).toMatchObject({ clips: 10, wordErrorRate: 0, passed: true });
    expect(reports[1]).toMatchObject({ clips: 10, verbatim: 1, passed: true, corrected: [] });
    expect(await passed("stt:en-US")).toBe(true);
    expect(await passed("stt-verbatim:en-US")).toBe(true);
    const calls = await db.select().from(schema.aiCall);
    expect(calls).toHaveLength(20);
    expect(calls[0]).toMatchObject({ use: "calibration", inputTokens: 1, ok: true });
    expect(renderSpeechReport(reports[1]!, { providerName: "Speech", model: "default" })).toContain("10 clips are synthetic");
  });

  it("passes for repeating and reading, not for answering, speech-to-text that corrects errors", async () => {
    const clips = [...Array.from({ length: 10 }, (_, i) => clip(i)), ...Array.from({ length: 10 }, (_, i) => right(i))];
    const [plain, verbatim] = await stt(clips, correct);
    expect(plain).toMatchObject({ passed: true, wordErrorRate: 0 });
    expect(verbatim!.passed).toBe(false);
    expect(verbatim!.corrected).toHaveLength(10);
    expect(verbatim!.wordErrorRate).toBeCloseTo(1 / 6);
    expect(await passed("stt:en-US")).toBe(true);
    expect(await passed("stt-verbatim:en-US")).toBe(false);
  });

  it("fails speech-to-text that mishears correct sentences", async () => {
    const [plain] = await stt(
      Array.from({ length: 10 }, (_, i) => right(i)),
      () => "She goes to cool every day.",
    );
    expect(plain).toMatchObject({ criterion: "stt:en-US", passed: false });
    expect(plain!.wordErrorRate).toBeCloseTo(1 / 6);
  });

  it("compares pronunciation verdicts with people's ratings", async () => {
    const clips = Array.from({ length: 10 }, (_, i) =>
      clip(i, { said: "sheep", reference: "sheep", ratings: i < 5 ? [true, true] : [false, false], source: "person" }),
    );
    const accuracy = new Map(clips.map((c, i) => [c.id, i < 5 ? 90 : 30]));
    let at = 0;
    const r = await runSpeechCalibration(
      db,
      {
        use: "pronunciation",
        language: "en-US",
        providerId,
        model: "default",
        clips,
        aiKeysSecret: SECRET,
        read: () => second,
        minClips: 10,
        concurrency: 1,
        hear: () =>
          fakeSpeech((req) => {
            expect(req.reference).toBe("sheep");
            return { text: "sheep", confidence: 0.9, seconds: 1, accuracy: accuracy.get(`c${at++}`)! };
          }),
      },
      AT,
    );
    expect(r).toHaveLength(1);
    expect(r[0]!.agreement?.kappa).toBe(1);
    expect(r[0]!.passed).toBe(true);
  });
});
