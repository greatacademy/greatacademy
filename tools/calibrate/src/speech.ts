import { decryptSecret } from "@ga/api";
import { heardInOrder, heardResponse, MIN_ACCURACY, speechChecker, spokenWords } from "@ga/content";
import { type Db, type NewCall, prices, providers, recordCalibration, recordCalls } from "@ga/db";
import { callCost, readWav, type SpeechConfig, SpeechFailed, type SpeechProvider, speechProvider } from "@ga/judge";

import { type Agreement, agreement } from "./agreement.ts";

/** MIN_CLIPS is how many recordings a speech route needs to be tested on before it can pass (*starting*). */
export const MIN_CLIPS = 200;

/** MIN_VERBATIM is the share of recordings a speech-to-text route must hear word for word, errors kept (*starting*). */
export const MIN_VERBATIM = 0.9;

/** MAX_WER is the share of words a speech-to-text route may get wrong in recordings said correctly (*starting*). */
export const MAX_WER = 0.05;

/** TRIES is how many times a clip is sent while the service says it is busy (429), waiting longer each time. */
export const TRIES = 6;

/** MAX_CLIP_SECONDS is the longest recording a set may hold, as long as the longest a learner may send. */
const MAX_CLIP_SECONDS = 60;

/**
 * SpeechClip is one recording of a speech set: what was said in it, word for
 * word with its errors, and for pronunciation, the text the speaker meant to
 * say and two people's judgment of whether they said it well enough.
 */
export interface SpeechClip {
  readonly id: string;
  /** audio is the path of a WAV of 16 kHz mono 16-bit PCM. */
  readonly audio: string;
  readonly said: string;
  /** source says who speaks: "person" or "synthetic"; a report counts each. */
  readonly source: "person" | "synthetic";
  readonly reference?: string;
  readonly ratings?: readonly [boolean, boolean];
}

/** parseSpeechSet reads a speech set in JSON Lines, one SpeechClip per line, and throws naming the first bad line. */
export function parseSpeechSet(jsonl: string): SpeechClip[] {
  const out: SpeechClip[] = [];
  const seen = new Set<string>();
  jsonl.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    const bad = (why: string) => new Error(`line ${i + 1}: ${why}`);
    let v: Record<string, unknown>;
    try {
      v = JSON.parse(line) as Record<string, unknown>;
    } catch {
      throw bad("not JSON");
    }
    if (typeof v.id !== "string" || !v.id) throw bad("no id");
    if (seen.has(v.id)) throw bad(`id ${v.id} repeats`);
    if (typeof v.audio !== "string" || !v.audio) throw bad("no audio");
    if (typeof v.said !== "string" || spokenWords(v.said).length === 0) throw bad("no said");
    if (v.source !== "person" && v.source !== "synthetic") throw bad('source is "person" or "synthetic"');
    if (v.reference !== undefined && typeof v.reference !== "string") throw bad("reference is a text");
    const r = v.ratings;
    if (r !== undefined && (!Array.isArray(r) || r.length !== 2 || r.some((x) => typeof x !== "boolean")))
      throw bad("ratings are two booleans");
    seen.add(v.id);
    out.push({
      id: v.id,
      audio: v.audio,
      said: v.said,
      source: v.source,
      ...(typeof v.reference === "string" && { reference: v.reference }),
      ...(r !== undefined && { ratings: r as [boolean, boolean] }),
    });
  });
  return out;
}

/** wordErrors is how many words must change, be added or dropped to turn one list into another. */
export function wordErrors(said: readonly string[], heard: readonly string[]): number {
  let row = Array.from({ length: heard.length + 1 }, (_, j) => j);
  for (let i = 1; i <= said.length; i++) {
    const next = [i];
    for (let j = 1; j <= heard.length; j++)
      next.push(Math.min(row[j]! + 1, next[j - 1]! + 1, row[j - 1]! + (said[i - 1] === heard[j - 1] ? 0 : 1)));
    row = next;
  }
  return row[heard.length]!;
}

/** SpeechRun names the speech route to test, the language and the set. */
export interface SpeechRun {
  readonly use: "stt" | "pronunciation";
  readonly language: string;
  readonly providerId: string;
  readonly model: string;
  readonly clips: readonly SpeechClip[];
  readonly aiKeysSecret: string;
  /** read reads a clip's audio. */
  readonly read: (path: string) => Uint8Array;
  readonly concurrency?: number;
  readonly minClips?: number;
  /** hear builds the speech provider; tests pass a fake. */
  readonly hear?: (config: SpeechConfig) => SpeechProvider;
  /** wait waits a number of milliseconds before a clip is sent again; tests pass one that does not. */
  readonly wait?: (ms: number) => Promise<void>;
}

/** SpeechReport is what a speech run measured and stored for one criterion. */
export interface SpeechReport {
  readonly criterion: string;
  readonly clips: number;
  readonly people: number;
  /** verbatim is the share of clips heard word for word; wordErrorRate the words wrong over the words said. */
  readonly verbatim: number;
  readonly wordErrorRate: number;
  /** corrected are the ids of clips whose errors were heard as correct words: the silent correction E4.5 looks for. */
  readonly corrected: readonly string[];
  /** agreement compares, for pronunciation, the checker's verdicts on what was heard with the people's ratings. */
  readonly agreement?: Agreement;
  readonly failed: readonly { readonly id: string; readonly reason: string }[];
  readonly seconds: number;
  readonly cost: number;
  readonly passed: boolean;
}

/** hasError tells whether a clip says something other than what its speaker meant: a sentence with an error in it. */
const hasError = (c: SpeechClip) => !!c.reference && spokenWords(c.reference).join(" ") !== spokenWords(c.said).join(" ");

/**
 * runSpeechCalibration has a speech route hear every clip of a set and records
 * the calibrations it measures, passed or not, which the console needs before
 * it sets a speech route live. Speech-to-text is measured twice. On the clips
 * said correctly it records `stt:<language>`, passed when at least MIN_CLIPS
 * were heard with a word error rate of at most MAX_WER: enough for repeating
 * and reading aloud, where the text is known. On the clips with an error in
 * them it records `stt-verbatim:<language>`, passed when at least MIN_CLIPS
 * were heard and MIN_VERBATIM of them word for word, errors kept: what
 * answering aloud needs, since a service that hears "She go" as "She goes"
 * would pass a wrong answer. Pronunciation (`pronunciation:<language>`) needs
 * two people's ratings of each clip and passes when the speech checker's
 * verdicts agree with them as the people agree with each other. A clip the
 * route could not hear counts against it. Every call is recorded as a
 * calibration call with its cost.
 */
export async function runSpeechCalibration(db: Db, run: SpeechRun, at: Date): Promise<SpeechReport[]> {
  const clips = run.use === "pronunciation" ? run.clips.filter((c) => c.reference && c.ratings) : run.clips;
  if (clips.length === 0) throw new Error(`no clip of the set serves ${run.use}:${run.language}`);
  const p = (await providers(db)).find((x) => x.id === run.providerId);
  if (!p) throw new Error(`no provider ${run.providerId}`);
  if (!p.keyCipher) throw new Error(`provider ${p.name} has no key`);
  const provider = (run.hear ?? speechProvider)({ baseUrl: p.baseUrl, apiKey: await decryptSecret(run.aiKeysSecret, p.keyCipher) });
  const price = (await prices(db)).find((x) => x.providerId === p.id && x.model === run.model);
  const calls: NewCall[] = [];
  const heardWords: (string[] | undefined)[] = new Array(clips.length);
  const verdicts: (boolean | undefined)[] = new Array(clips.length);
  const failed: { id: string; reason: string }[] = [];
  let seconds = 0;
  let next = 0;
  const worker = async () => {
    while (next < clips.length) {
      const i = next++;
      const clip = clips[i]!;
      let wav: { seconds: number };
      const bytes = run.read(clip.audio);
      try {
        wav = readWav(bytes, MAX_CLIP_SECONDS);
      } catch (e) {
        failed.push({ id: clip.id, reason: e instanceof Error ? e.message : "not-wav" });
        continue;
      }
      seconds += wav.seconds;
      const cost = price ? callCost({ input: wav.seconds, output: 0 }, price) : 0;
      const call = (ok: boolean): NewCall => ({
        providerId: p.id,
        model: run.model,
        use: "calibration",
        learnerId: null,
        inputTokens: Math.ceil(wav.seconds),
        outputTokens: 0,
        cost,
        ok,
        at,
      });
      const wait = run.wait ?? ((ms: number) => new Promise<void>((done) => setTimeout(done, ms)));
      const hear = async () => {
        for (let k = 1; ; k++) {
          try {
            return await provider.hear({
              wav: bytes,
              language: run.language,
              seconds: wav.seconds,
              ...(run.use === "pronunciation" && clip.reference && { reference: clip.reference }),
            });
          } catch (e) {
            if (!(e instanceof SpeechFailed && e.reason === "status-429") || k === TRIES) throw e;
            await wait(1000 * 2 ** k);
          }
        }
      };
      try {
        const heard = await hear();
        calls.push(call(true));
        heardWords[i] = spokenWords(heard.lexical ?? heard.text);
        if (clip.reference) {
          const expected = { mode: "read", reference: clip.reference, minAccuracy: MIN_ACCURACY };
          verdicts[i] = speechChecker.check(expected, heardResponse(heard)).correct;
        }
      } catch (e) {
        calls.push(call(false));
        failed.push({ id: clip.id, reason: e instanceof SpeechFailed ? e.reason : "error" });
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, run.concurrency ?? 4) }, worker));
  await recordCalls(db, calls);

  const minClips = run.minClips ?? MIN_CLIPS;
  const cost = calls.reduce((n, c) => n + c.cost, 0);
  const index = new Map(clips.map((c, i) => [c.id, i]));
  const measure = async (criterion: string, part: readonly SpeechClip[]): Promise<SpeechReport> => {
    let errors = 0;
    let words = 0;
    let verbatim = 0;
    const corrected: string[] = [];
    for (const clip of part) {
      const said = spokenWords(clip.said);
      const heard = heardWords[index.get(clip.id)!];
      words += said.length;
      errors += heard ? wordErrors(said, heard) : said.length;
      if (heard && heard.join(" ") === said.join(" ")) verbatim++;
      // An error heard as the correct word: what was heard holds the reference the error departs from.
      const reference = hasError(clip) && spokenWords(clip.reference!);
      if (heard && reference && heardInOrder(reference, heard) === reference.length) corrected.push(clip.id);
    }
    const share = verbatim / part.length;
    const wer = words ? errors / words : 0;
    const agreed =
      run.use === "pronunciation"
        ? agreement(
            part.map((c) => c.id),
            part.map((c) => c.ratings!),
            part.map((c) => verdicts[index.get(c.id)!]),
            minClips,
          )
        : undefined;
    const kept = criterion.startsWith("stt-verbatim:");
    const passed = agreed ? agreed.passed : part.length >= minClips && (kept ? share >= MIN_VERBATIM : wer <= MAX_WER);
    // A speech calibration stores, as kappa, what it measured on a scale where more is better (the checker's agreement
    // with people, the share heard word for word, or one less the word error rate), and as humanKappa the bar.
    await recordCalibration(db, {
      criterion,
      providerId: p.id,
      model: run.model,
      promptVersion: "",
      kappa: agreed ? agreed.kappa : kept ? share : 1 - wer,
      humanKappa: agreed ? agreed.humanKappa : kept ? MIN_VERBATIM : 1 - MAX_WER,
      passed,
      at,
    });
    return {
      criterion,
      clips: part.length,
      people: part.filter((c) => c.source === "person").length,
      verbatim: share,
      wordErrorRate: wer,
      corrected,
      ...(agreed && { agreement: agreed }),
      failed: failed.filter((f) => part.some((c) => c.id === f.id)),
      seconds,
      cost,
      passed,
    };
  };
  if (run.use === "pronunciation") return [await measure(`pronunciation:${run.language}`, clips)];
  const right = clips.filter((c) => !hasError(c));
  const wrong = clips.filter(hasError);
  const out: SpeechReport[] = [];
  if (right.length) out.push(await measure(`stt:${run.language}`, right));
  if (wrong.length) out.push(await measure(`stt-verbatim:${run.language}`, wrong));
  return out;
}

/** renderSpeechReport writes a speech report in Markdown, naming clips by id only. */
export function renderSpeechReport(r: SpeechReport, route: { providerName: string; model: string }): string {
  const lines = [
    `# Calibration of ${r.criterion}`,
    "",
    `Route: ${route.providerName}, ${route.model}`,
    "",
    r.criterion.startsWith("stt-verbatim:")
      ? `Clips with an error in them, passed when at least ${(MIN_VERBATIM * 100).toFixed(0)}% are heard word for word.`
      : r.criterion.startsWith("stt:")
        ? `Clips said correctly, passed when at most ${(MAX_WER * 100).toFixed(0)}% of the words are heard wrong.`
        : "Clips rated by two people, passed when the checker agrees with them as they agree with each other.",
    "",
    "| Clips | By people | Word for word | Word error rate | Passed |",
    "| ---: | ---: | ---: | ---: | :--- |",
    `| ${r.clips} | ${r.people} | ${(r.verbatim * 100).toFixed(1)}% | ${(r.wordErrorRate * 100).toFixed(1)}% | ${r.passed ? "yes" : "no"} |`,
    "",
    `${r.seconds.toFixed(0)} s of audio in the run, cost ${r.cost.toFixed(4)}.`,
  ];
  if (r.people < r.clips)
    lines.push("", `${r.clips - r.people} clips are synthetic: a test of the route, not of learners' voices; people's recordings remain.`);
  if (r.agreement)
    lines.push("", `Checker κ with people ${r.agreement.kappa.toFixed(3)}, people's κ ${r.agreement.humanKappa.toFixed(3)}.`);
  if (r.corrected.length) lines.push("", `Errors heard as correct words (${r.corrected.length}): ${r.corrected.join(", ")}`);
  if (r.failed.length) lines.push("", `Not heard (${r.failed.length}): ${r.failed.map((f) => `${f.id} (${f.reason})`).join(", ")}`);
  return `${lines.join("\n")}\n`;
}
