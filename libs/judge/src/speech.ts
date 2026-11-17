import type { Heard, HeardWord } from "@ga/content";

import { iflytekSpeech, isIflytek } from "./iflytek.ts";

/** SPEECH_RATE is the sample rate a recording must have: 16 kHz, what speech services expect. */
export const SPEECH_RATE = 16_000;

/** WavInfo is what a recording's header says. */
export interface WavInfo {
  /** seconds is how long the recording lasts. */
  readonly seconds: number;
  /** pcm are the samples, mono 16-bit little-endian. */
  readonly pcm: Uint8Array;
}

/** WavRejected tells why a recording was not taken. */
export class WavRejected extends Error {}

const ascii = (b: Uint8Array, at: number, n: number) => String.fromCharCode(...b.subarray(at, at + n));

/**
 * readWav checks that a recording is a WAV of 16 kHz mono 16-bit PCM no longer
 * than maxSeconds (with half a second to spare), and returns its length and samples.
 */
export function readWav(bytes: Uint8Array, maxSeconds: number): WavInfo {
  if (bytes.length < 44 || ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WAVE") throw new WavRejected("not-wav");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let at = 12;
  let format = false;
  while (at + 8 <= bytes.length) {
    const id = ascii(bytes, at, 4);
    const size = view.getUint32(at + 4, true);
    const body = at + 8;
    if (id === "fmt ") {
      if (size < 16 || body + 16 > bytes.length) throw new WavRejected("bad-format");
      const pcm = view.getUint16(body, true) === 1;
      const channels = view.getUint16(body + 2, true);
      const rate = view.getUint32(body + 4, true);
      const bits = view.getUint16(body + 14, true);
      if (!pcm || channels !== 1 || rate !== SPEECH_RATE || bits !== 16) throw new WavRejected("bad-format");
      format = true;
    } else if (id === "data") {
      if (!format) throw new WavRejected("bad-format");
      const end = Math.min(bytes.length, body + size);
      const pcm = bytes.subarray(body, end - ((end - body) % 2));
      const seconds = pcm.length / (2 * SPEECH_RATE);
      if (seconds > maxSeconds + 0.5) throw new WavRejected("too-long");
      if (seconds < 0.2) throw new WavRejected("too-short");
      return { seconds, pcm };
    }
    at = body + size + (size % 2);
  }
  throw new WavRejected("no-data");
}

/** writeWav wraps mono 16-bit samples at 16 kHz in a WAV header. */
export function writeWav(pcm: Uint8Array): Uint8Array {
  const out = new Uint8Array(44 + pcm.length);
  const view = new DataView(out.buffer);
  const put = (at: number, s: string) => {
    for (let i = 0; i < s.length; i++) out[at + i] = s.charCodeAt(i);
  };
  put(0, "RIFF");
  view.setUint32(4, 36 + pcm.length, true);
  put(8, "WAVE");
  put(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SPEECH_RATE, true);
  view.setUint32(28, SPEECH_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  put(36, "data");
  view.setUint32(40, pcm.length, true);
  out.set(pcm, 44);
  return out;
}

/** SpeechConfig is a speech vendor as an administrator configured it, with its key decrypted on the server. */
export interface SpeechConfig {
  readonly baseUrl: string;
  readonly apiKey: string;
}

/** HearRequest is one recording to hear, and the text it should say when pronunciation is to be assessed against it. */
export interface HearRequest {
  readonly wav: Uint8Array;
  readonly language: string;
  readonly seconds: number;
  /** reference is the text to assess pronunciation against; without it the recording is only transcribed. */
  readonly reference?: string;
}

/** SpeechProvider hears a recording: a speech service, or a fake in tests. */
export interface SpeechProvider {
  hear(request: HearRequest): Promise<Heard>;
}

/** SpeechFailed tells that a speech service could not hear a recording; only a reason is kept, never the service's message. */
export class SpeechFailed extends Error {
  readonly reason: string;
  constructor(reason: string) {
    super(reason);
    this.reason = reason;
  }
}

/** SpeechProtocol is the protocol a speech vendor speaks, told by its base URL: Azure's, or iFlytek's assessment. */
export type SpeechProtocol = "azure" | "iflytek";

/** speechProtocol tells which protocol a speech vendor's base URL speaks, or undefined when none is supported. */
export function speechProtocol(baseUrl: string): SpeechProtocol | undefined {
  try {
    const host = new URL(baseUrl).hostname;
    if (/\.(stt|tts)\.speech\.microsoft\.com$|\.api\.cognitive\.microsoft\.com$/.test(host)) return "azure";
    return isIflytek(host) ? "iflytek" : undefined;
  } catch {
    return undefined;
  }
}

/** azureRegion is the region of an Azure speech base URL: the first label of its host. */
export function azureRegion(baseUrl: string): string {
  return new URL(baseUrl).hostname.split(".")[0]!;
}

/** AzureWord is a word of Azure's detailed result, in the older flat form or the newer nested one. */
interface AzureWord {
  readonly Word?: string;
  readonly AccuracyScore?: number;
  readonly ErrorType?: string;
  readonly PronunciationAssessment?: { readonly AccuracyScore?: number; readonly ErrorType?: string };
}

interface AzureBest {
  readonly Confidence?: number;
  readonly Lexical?: string;
  readonly Display?: string;
  readonly AccuracyScore?: number;
  readonly FluencyScore?: number;
  readonly CompletenessScore?: number;
  readonly PronunciationAssessment?: {
    readonly AccuracyScore?: number;
    readonly FluencyScore?: number;
    readonly CompletenessScore?: number;
  };
  readonly Words?: readonly AzureWord[];
}

/** AzureResult is the part of Azure's short-audio answer that is read. */
export interface AzureResult {
  readonly RecognitionStatus?: string;
  readonly Duration?: number;
  readonly DisplayText?: string;
  readonly NBest?: readonly AzureBest[];
}

const ERRORS: Readonly<Record<string, HeardWord["error"]>> = {
  Omission: "omission",
  Insertion: "insertion",
  Mispronunciation: "mispronunciation",
};

/** heardFromAzure turns Azure's detailed answer into what was heard; nothing recognized is heard with no confidence. */
export function heardFromAzure(r: AzureResult, seconds: number): Heard {
  const best = r.NBest?.[0];
  if (r.RecognitionStatus !== "Success" || !best) return { text: "", confidence: 0, seconds };
  const pa = best.PronunciationAssessment;
  const accuracy = pa?.AccuracyScore ?? best.AccuracyScore;
  const fluency = pa?.FluencyScore ?? best.FluencyScore;
  const completeness = pa?.CompletenessScore ?? best.CompletenessScore;
  const words = best.Words?.flatMap((w): HeardWord[] => {
    if (!w.Word) return [];
    const a = w.PronunciationAssessment?.AccuracyScore ?? w.AccuracyScore;
    const e = ERRORS[w.PronunciationAssessment?.ErrorType ?? w.ErrorType ?? ""];
    return [{ word: w.Word, ...(a !== undefined && { accuracy: a }), ...(e && { error: e }) }];
  });
  return {
    text: best.Display ?? r.DisplayText ?? best.Lexical ?? "",
    ...(best.Lexical && { lexical: best.Lexical }),
    confidence: best.Confidence ?? 0,
    seconds: r.Duration ? Math.min(seconds, r.Duration / 1e7) : seconds,
    ...(accuracy !== undefined && { accuracy }),
    ...(fluency !== undefined && { fluency }),
    ...(completeness !== undefined && { completeness }),
    ...(words && words.length > 0 && { words }),
  };
}

/** SPEECH_TIMEOUT_MS is how long a speech service has to answer. */
export const SPEECH_TIMEOUT_MS = 15_000;

const base64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));

/**
 * azureSpeech hears recordings with Azure AI Speech's short-audio REST API,
 * which takes up to 60 s of audio and keeps none of it. With a reference it
 * also assesses pronunciation, word by word, on a scale of 100.
 */
export function azureSpeech(config: SpeechConfig, fetcher: typeof fetch = fetch): SpeechProvider {
  const region = azureRegion(config.baseUrl);
  return {
    async hear(request) {
      const url = new URL(`https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`);
      url.searchParams.set("language", request.language);
      url.searchParams.set("format", "detailed");
      const headers: Record<string, string> = {
        "Ocp-Apim-Subscription-Key": config.apiKey,
        "Content-Type": `audio/wav; codecs=audio/pcm; samplerate=${SPEECH_RATE}`,
        Accept: "application/json",
      };
      if (request.reference) {
        headers["Pronunciation-Assessment"] = base64(
          JSON.stringify({
            ReferenceText: request.reference,
            GradingSystem: "HundredMark",
            Granularity: "Word",
            Dimension: "Comprehensive",
            EnableMiscue: true,
          }),
        );
      }
      let res: Response;
      try {
        res = await fetcher(url, {
          method: "POST",
          headers,
          body: new Uint8Array(request.wav),
          signal: AbortSignal.timeout(SPEECH_TIMEOUT_MS),
        });
      } catch {
        throw new SpeechFailed("unreachable");
      }
      if (!res.ok) throw new SpeechFailed(`status-${res.status}`);
      let body: AzureResult;
      try {
        body = (await res.json()) as AzureResult;
      } catch {
        throw new SpeechFailed("bad-answer");
      }
      return heardFromAzure(body, request.seconds);
    },
  };
}

/** speechProvider builds the provider of a speech vendor from its configuration. */
export function speechProvider(config: SpeechConfig, fetcher?: typeof fetch): SpeechProvider {
  const protocol = speechProtocol(config.baseUrl);
  if (protocol === "azure") return azureSpeech(config, fetcher);
  if (protocol === "iflytek") return iflytekSpeech(config);
  throw new SpeechFailed("unsupported-vendor");
}

/** fakeSpeech hears every recording as the text it is given, for tests and local runs without a vendor. */
export function fakeSpeech(hear: (request: HearRequest) => Heard): SpeechProvider {
  return { hear: async (request) => hear(request) };
}
