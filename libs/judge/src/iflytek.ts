// iFlytek's streaming pronunciation assessment (ISE) for Mandarin: a WebSocket signed with HMAC-SHA256, the reference
// text sent first, then the audio in frames, and an XML answer that scores each syllable and says whether its initial,
// its final or its tone was wrong. It assesses only: it never transcribes a recording freely.

import type { Heard, HeardWord, SyllablePart } from "@ga/content";

import { readWav, SPEECH_TIMEOUT_MS, type SpeechConfig, SpeechFailed, type SpeechProvider } from "./speech.ts";

/** IflytekKey is the three parts of an iFlytek key, which an administrator enters as `appId:apiKey:apiSecret`. */
export interface IflytekKey {
  readonly appId: string;
  readonly apiKey: string;
  readonly apiSecret: string;
}

/** iflytekKey splits an iFlytek key into its parts, or throws when it does not have three. */
export function iflytekKey(key: string): IflytekKey {
  const [appId, apiKey, apiSecret, ...rest] = key.split(":");
  if (!appId || !apiKey || !apiSecret || rest.length > 0) throw new SpeechFailed("bad-key");
  return { appId, apiKey, apiSecret };
}

/** isIflytek tells whether a host is one of iFlytek's assessment hosts, in China or abroad. */
export const isIflytek = (host: string): boolean => /^ise-api[\w-]*\.(xfyun\.cn|xf-yun\.com)$/.test(host);

const encoder = new TextEncoder();

const toBase64 = (bytes: Uint8Array): string => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};

/** iflytekUrl signs the WebSocket URL of a base URL at a time, as iFlytek's HMAC-SHA256 scheme asks. */
export async function iflytekUrl(baseUrl: string, key: IflytekKey, at: Date): Promise<string> {
  const url = new URL(baseUrl);
  const date = at.toUTCString();
  const path = url.pathname === "/" ? "/v2/open-ise" : url.pathname;
  const origin = `host: ${url.host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
  const hmac = await crypto.subtle.importKey("raw", encoder.encode(key.apiSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = toBase64(new Uint8Array(await crypto.subtle.sign("HMAC", hmac, encoder.encode(origin))));
  const authorization = btoa(
    `api_key="${key.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`,
  );
  const signed = new URL(`wss://${url.host}${path}`);
  signed.searchParams.set("authorization", authorization);
  signed.searchParams.set("date", date);
  signed.searchParams.set("host", url.host);
  return signed.toString();
}

/** Socket is the part of a WebSocket the provider uses, so that tests can stand in for one. */
export interface Socket {
  send(data: string): void;
  close(code?: number): void;
  onopen: (() => void) | null;
  onmessage: ((event: { readonly data: unknown }) => void) | null;
  onerror: (() => void) | null;
  onclose: (() => void) | null;
}

/** IflytekDeps are how the provider opens a socket, reads the time and waits between frames; tests replace them. */
export interface IflytekDeps {
  readonly connect: (url: string) => Socket;
  readonly now: () => Date;
  readonly pause: () => Promise<void>;
}

const defaultDeps: IflytekDeps = {
  connect: (url) => new WebSocket(url) as unknown as Socket,
  now: () => new Date(),
  pause: () => new Promise((resolve) => setTimeout(resolve, 10)),
};

/** FRAME is how many bytes of audio go in a frame: 40 ms of 16 kHz 16-bit mono. */
const FRAME = 1280;

/** category is what iFlytek assesses a reference as: a word of up to two characters, or a sentence. */
const category = (reference: string): "read_word" | "read_sentence" =>
  [...reference.replace(/[^\p{Script=Han}]/gu, "")].length <= 2 ? "read_word" : "read_sentence";

const attr = (s: string, name: string): string | undefined => new RegExp(`\\b${name}="([^"]*)"`).exec(s)?.[1];

/** DP are what iFlytek's dp_message says of a syllable, when it says anything. */
const DP: Readonly<Record<string, HeardWord["error"]>> = { "16": "omission", "32": "insertion", "128": "mispronunciation" };

/**
 * heardFromIflytek reads iFlytek's XML answer: the scores out of 100, and each syllable of the reference with its
 * score, what was wrong with it and the pinyin it should have. A recording iFlytek rejects as not the reference is heard
 * as nothing.
 */
export function heardFromIflytek(xml: string, reference: string, seconds: number): Heard {
  const top = /<(read_word|read_sentence)\b[^>]*total_score="[^"]*"[^>]*>/.exec(xml)?.[0] ?? "";
  if (!top || /is_rejected="true"/.test(top)) return { text: "", confidence: 0, seconds };
  const score = (name: string): number | undefined => {
    const v = Number(attr(top, name));
    return Number.isFinite(v) ? Math.round(v * 10) / 10 : undefined;
  };
  const words: HeardWord[] = [];
  for (const [, a = "", body = ""] of xml.matchAll(/<syll\b([^>]*)>([\s\S]*?)<\/syll>/g)) {
    if (attr(a, "rec_node_type") !== "paper") continue;
    const content = attr(a, "content");
    if (!content) continue;
    const phones = [...body.matchAll(/<phone\b([^>]*)\/?>/g)].map(([, p = ""]) => ({ yun: attr(p, "is_yun"), perr: attr(p, "perr_msg") }));
    const initial = phones.find((p) => p.yun === "0");
    const final = phones.find((p) => p.yun === "1");
    const wrong: SyllablePart[] = [];
    if (initial?.perr === "1") wrong.push("initial");
    if (final?.perr === "1" || final?.perr === "3") wrong.push("final");
    if (final?.perr === "2" || final?.perr === "3") wrong.push("tone");
    const error = DP[attr(a, "dp_message") ?? "0"] ?? (wrong.length > 0 ? "mispronunciation" : undefined);
    const syllableScore = Number(attr(a, "syll_score"));
    const symbol = attr(a, "symbol");
    words.push({
      word: content,
      ...(Number.isFinite(syllableScore) && { accuracy: Math.round(syllableScore * 10) / 10 }),
      ...(error && { error }),
      ...(symbol && { pinyin: symbol }),
      ...(wrong.length > 0 && { wrong }),
    });
  }
  const accuracy = score("total_score");
  const fluency = score("fluency_score");
  const completeness = score("integrity_score");
  return {
    text: reference,
    confidence: 1,
    seconds,
    ...(accuracy !== undefined && { accuracy }),
    ...(fluency !== undefined && { fluency }),
    ...(completeness !== undefined && { completeness }),
    ...(words.length > 0 && { words }),
  };
}

/** IflytekAnswer is a message of iFlytek's socket: a code, and with the last one the base64 of the XML. */
interface IflytekAnswer {
  readonly code?: number;
  readonly data?: { readonly status?: number; readonly data?: string };
}

/**
 * iflytekSpeech assesses Mandarin recordings against a reference with iFlytek's ISE. The base URL names the host, as
 * https://ise-api-sg.xf-yun.com/v2/ise abroad or https://ise-api.xfyun.cn/v2/open-ise in China, and its `group` query
 * the learners scored, as `?group=pupil` for children; the key is `appId:apiKey:apiSecret`. Without a reference, or in
 * another language, it cannot hear a recording.
 */
export function iflytekSpeech(config: SpeechConfig, deps: IflytekDeps = defaultDeps): SpeechProvider {
  return {
    async hear(request) {
      if (!request.reference) throw new SpeechFailed("no-reference");
      if (!/^zh(-|$)/.test(request.language)) throw new SpeechFailed("unsupported-language");
      const reference = request.reference;
      const key = iflytekKey(config.apiKey);
      const group = new URL(config.baseUrl).searchParams.get("group");
      const audio = readWav(request.wav, Number.POSITIVE_INFINITY).pcm;
      const url = await iflytekUrl(config.baseUrl, key, deps.now());
      const xml = await new Promise<string>((resolve, reject) => {
        let socket: Socket;
        try {
          socket = deps.connect(url);
        } catch {
          reject(new SpeechFailed("unreachable"));
          return;
        }
        let settled = false;
        const finish = (fail: SpeechFailed | undefined, text = "") => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          try {
            socket.close(1000);
          } catch {
            // The socket is already closed.
          }
          if (fail) reject(fail);
          else resolve(text);
        };
        const timer = setTimeout(() => finish(new SpeechFailed("timeout")), SPEECH_TIMEOUT_MS);
        socket.onerror = () => finish(new SpeechFailed("unreachable"));
        socket.onclose = () => finish(new SpeechFailed("closed"));
        socket.onmessage = (event) => {
          let answer: IflytekAnswer;
          try {
            answer = JSON.parse(String(event.data)) as IflytekAnswer;
          } catch {
            finish(new SpeechFailed("bad-answer"));
            return;
          }
          if (answer.code !== 0) finish(new SpeechFailed(`code-${answer.code ?? "none"}`));
          else if (answer.data?.status === 2) {
            try {
              const bytes = Uint8Array.from(atob(answer.data.data ?? ""), (c) => c.charCodeAt(0));
              finish(undefined, new TextDecoder().decode(bytes));
            } catch {
              finish(new SpeechFailed("bad-answer"));
            }
          }
        };
        socket.onopen = () => {
          void (async () => {
            socket.send(
              JSON.stringify({
                common: { app_id: key.appId },
                business: {
                  sub: "ise",
                  ent: "cn_vip",
                  category: category(reference),
                  cmd: "ssb",
                  text: `﻿${reference}`,
                  tte: "utf-8",
                  ttp_skip: true,
                  aue: "raw",
                  auf: "audio/L16;rate=16000",
                  rstcd: "utf8",
                  rst: "entirety",
                  ise_unite: "1",
                  plev: "0",
                  extra_ability: "multi_dimension;syll_phone_err_msg",
                  ...(group && { group }),
                },
                data: { status: 0 },
              }),
            );
            for (let at = 0; at < audio.length && !settled; at += FRAME) {
              const last = at + FRAME >= audio.length;
              socket.send(
                JSON.stringify({
                  business: { cmd: "auw", aus: at === 0 ? 1 : last ? 4 : 2 },
                  data: { status: last ? 2 : 1, data: toBase64(audio.subarray(at, at + FRAME)) },
                }),
              );
              if (!last) await deps.pause();
            }
          })();
        };
      });
      return heardFromIflytek(xml, reference, request.seconds);
    },
  };
}
