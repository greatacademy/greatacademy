import { Code, ConnectError } from "@connectrpc/connect";
import {
  type Heard,
  heardResponse,
  MIN_CONFIDENCE,
  type Problem,
  type SpeechExpected,
  speechChecker,
  spokenWords,
  type Text,
  t,
} from "@ga/content";
import { callsSince, type Db, type NewCall, providers, recordCalls, setSpeakingOffUntil, speakingOffUntil } from "@ga/db";
import { callCost, readWav, type SpeechConfig, SpeechFailed, type SpeechProvider, speechProvider, WavRejected } from "@ga/judge";

import { SPEECH_LANGUAGES } from "./admin.ts";
import { type QualifiedRoute, speechRoute, startOfDay } from "./capabilities.ts";
import type { CourseEntry } from "./registry.ts";
import { decryptSecret } from "./secrets.ts";

/** RECORDINGS_PER_MINUTE is how many recordings a learner may send in one minute, against scripts (*starting*). */
export const RECORDINGS_PER_MINUTE = 12;

/** DAILY_RECORDINGS is how many recordings a learner may send in 24 hours (*starting*): far more than a day of study asks. */
export const DAILY_RECORDINGS = 300;

/** SPEAKING_OFF_FOREVER is when speaking that a learner turned off comes back by itself: never. */
export const SPEAKING_OFF_FOREVER = new Date(Date.UTC(3000, 0, 1));

/** SpeechDeps are what hearing a recording needs from the deployment. */
export interface SpeechDeps {
  readonly aiKeysSecret: string;
  /** hear builds a speech provider; tests pass a fake. */
  readonly hear?: (config: SpeechConfig) => SpeechProvider;
}

/** Hearing is a recording heard: the response to check, and what was heard; or a request to record again, saying why. */
export type Hearing = { readonly response: string; readonly heard: Heard } | { readonly again: Text };

const DAY = 24 * 3600_000;

const RECORD_SHORT = t("We could not hear you. Press record, speak, then press stop.", "我们没有听到声音。请按下录音，说完后再按停止。");
const RECORD_UNCLEAR = t(
  "We could not make out the words. Find a quiet place, hold the device close, and try again.",
  "我们没听清。请到安静的地方，把设备靠近一些，再试一次。",
);
const RECORD_FAILED = t("We could not hear that just now. Please try again.", "刚才没能听取录音，请再试一次。");

/**
 * hearRecording has a speech service hear a learner's recording of a spoken
 * problem, and returns what was heard as the response to check. The recording
 * goes to the route allowed to hear this learner (one that assesses
 * pronunciation when there is a text to repeat or read and such a route
 * qualifies, and one that hears errors as said when the topic is verbatim) and is kept nowhere; the call is recorded with its seconds and
 * cost. A recording too short, not understood, or not heard by the service asks
 * for another and counts nothing, as does one heard with low confidence that would be wrong.
 */
export async function hearRecording(
  db: Db,
  deps: SpeechDeps,
  learnerId: string,
  problem: Problem,
  audio: Uint8Array,
  now: number,
  verbatim = false,
): Promise<Hearing> {
  const spec = problem.answer.input;
  if (spec.kind !== "speech") throw new ConnectError("this question is not answered by speaking", Code.InvalidArgument);
  const refuse = (message: string) => new ConnectError(message, Code.ResourceExhausted);
  if ((await callsSince(db, learnerId, "speech", new Date(now - 60_000))) >= RECORDINGS_PER_MINUTE)
    throw refuse("too many recordings in a minute; wait a moment");
  if ((await callsSince(db, learnerId, "speech", new Date(now - DAY))) >= DAILY_RECORDINGS)
    throw refuse("today's recordings are used up; come back tomorrow");
  let seconds: number;
  try {
    seconds = readWav(audio, spec.maxSeconds).seconds;
  } catch (e) {
    if (!(e instanceof WavRejected)) throw e;
    if (e.message === "too-short") return { again: RECORD_SHORT };
    if (e.message === "too-long") return { again: t(`Keep it under ${spec.maxSeconds} seconds.`, `请控制在 ${spec.maxSeconds} 秒以内。`) };
    throw new ConnectError("a recording is a WAV of 16 kHz mono 16-bit PCM", Code.InvalidArgument);
  }
  const expected = problem.answer.expected as unknown as SpeechExpected;
  const reference = expected.mode === "say" ? undefined : expected.reference;
  const assessing = reference ? await speechRoute(db, "pronunciation", spec.language, learnerId, now) : undefined;
  const route = assessing ?? (await speechRoute(db, "stt", spec.language, learnerId, now, verbatim));
  if (!route) throw new ConnectError("speaking is not available", Code.FailedPrecondition);
  const vendor = (await providers(db)).find((p) => p.id === route.providerId);
  if (!vendor?.keyCipher) throw new ConnectError("speaking is not available", Code.FailedPrecondition);
  const config = { baseUrl: vendor.baseUrl, apiKey: await decryptSecret(deps.aiKeysSecret, vendor.keyCipher) };
  const call = (route: QualifiedRoute, ok: boolean): NewCall => ({
    providerId: route.providerId,
    model: route.model,
    use: "speech",
    learnerId,
    inputTokens: Math.ceil(seconds),
    outputTokens: 0,
    cost: callCost({ input: seconds, output: 0 }, route.price),
    ok,
    at: new Date(now),
  });
  let heard: Heard;
  try {
    const provider = (deps.hear ?? speechProvider)(config);
    heard = await provider.hear({ wav: audio, language: spec.language, seconds, ...(assessing && reference && { reference }) });
  } catch (e) {
    if (!(e instanceof SpeechFailed)) throw e;
    await recordCalls(db, [call(route, false)]);
    return { again: RECORD_FAILED };
  }
  await recordCalls(db, [call(route, true)]);
  if (spokenWords(heard.text).length === 0) return { again: RECORD_UNCLEAR };
  const response = heardResponse(heard);
  // Low confidence only keeps a recording from counting against the learner: a service is often unsure of a single
  // word said clearly, so what it heard still counts when it is what was asked.
  if (heard.confidence < MIN_CONFIDENCE && !speechChecker.check(problem.answer.expected, response).correct)
    return { again: RECORD_UNCLEAR };
  return { response, heard };
}

/** speakingAvailable tells whether some speech route may hear a learner in any language spoken problems use. */
export async function speakingAvailable(db: Db, learnerId: string, now: number): Promise<boolean> {
  for (const language of SPEECH_LANGUAGES) if (await speechRoute(db, "stt", language, learnerId, now)) return true;
  return false;
}

/** speakingOff tells whether a learner has turned speaking off at a time. */
export async function speakingOff(db: Db, learnerId: string, now: number): Promise<boolean> {
  const until = await speakingOffUntil(db, learnerId);
  return until !== null && until.getTime() > now;
}

/** speakingUntil is when speaking turned off comes back: never, or the start of the learner's next day. */
export function speakingUntil(todayOnly: boolean, now: number, timeZone: string): Date {
  return todayOnly ? new Date(startOfDay(now + DAY, timeZone)) : SPEAKING_OFF_FOREVER;
}

/** setSpeaking turns a learner's speaking on, or off until a time. */
export function setSpeaking(db: Db, learnerId: string, until: Date | null): Promise<void> {
  return setSpeakingOffUntil(db, learnerId, until);
}

/** SpokenGroup is the spoken topics of a course that are heard in one language, and whether word for word. */
export interface SpokenGroup {
  readonly language: string;
  readonly verbatim: boolean;
  readonly ids: readonly string[];
}

/** spokenTopics are the spoken topics of a course in scope, grouped by the language they are spoken in and verbatim. */
export function spokenTopics(c: CourseEntry): SpokenGroup[] {
  const out = new Map<string, { language: string; verbatim: boolean; ids: string[] }>();
  for (const id of c.planner.scope.topics) {
    const topic = c.subject.topics.get(id);
    if (!topic?.spoken) continue;
    const verbatim = !!topic.verbatim;
    const key = `${topic.spoken}|${verbatim}`;
    const group = out.get(key) ?? { language: topic.spoken, verbatim, ids: [] };
    group.ids.push(id);
    out.set(key, group);
  }
  return [...out.values()];
}
