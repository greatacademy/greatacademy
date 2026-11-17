// Makes the recordings a subject's content asks for with Azure AI Speech and lists them in
// content/<subject>/src/recordings.ts. For English: passages, words, sentences, the sounds of words, conversations'
// openings, and the dialogues of listening problems; for Chinese (--subject chinese): syllables, words and sentences.
//
//   pnpm nx run audio:make -- --unit water-on-earth          # the passages of one or more reading units
//   pnpm nx run audio:make -- --kind word --kind sounds      # the recordings of some kinds
//   pnpm nx run audio:make -- --all --limit 50               # any not yet recorded, at most 50
//   pnpm nx run audio:make -- --subject chinese --all        # the recordings of Chinese
//
// The key and region come from AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local at the repository's root,
// which git ignores; the key is never printed.

import { mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { chinese } from "@ga/content-chinese";
import { wantedRecordings as chineseRecordings } from "@ga/content-chinese/audio";
import { english } from "@ga/content-english";
import { wantedRecordings as englishRecordings } from "@ga/content-english/audio";

import { current, type Job, plan, readEnv, recordingsModule } from "./plan.ts";

const root = new URL("../../../", import.meta.url);
/** SUBJECTS are, for each subject with recordings, the kinds of recording --kind may name, its content and what it asks for. */
const SUBJECTS = {
  english: { kinds: ["passage", "word", "sentence", "sounds", "opening", "dialogue"], subject: english, wanted: englishRecordings },
  chinese: { kinds: ["syllable", "word", "sentence"], subject: chinese, wanted: chineseRecordings },
} as const;
/** WORKERS is how many recordings are made at once unless --workers says otherwise. */
const WORKERS = 3;
/** TRIES is how often a recording is tried before the run gives up on it. */
const TRIES = 5;

const { values } = parseArgs({
  options: {
    unit: { type: "string", multiple: true },
    kind: { type: "string", multiple: true },
    all: { type: "boolean" },
    limit: { type: "string" },
    workers: { type: "string" },
    subject: { type: "string", default: "english" },
  },
});
const name = values.subject as keyof typeof SUBJECTS;
const chosen = SUBJECTS[name];
if (!chosen) throw new Error(`unknown subject ${values.subject}`);
const folder = new URL(`content/${name}/audio/files/`, root);
const listFile = new URL(`content/${name}/src/recordings.ts`, root);
if (!values.all && !values.unit?.length && !values.kind?.length) throw new Error("name --unit <id>, --kind <kind> or --all");
for (const k of values.kind ?? []) if (!(chosen.kinds as readonly string[]).includes(k)) throw new Error(`unknown kind ${k}`);

const env = readEnv(readFileSync(new URL(".env.local", root), "utf8"));
const key = env.AZURE_SPEECH_KEY;
const region = env.AZURE_SPEECH_REGION;
if (!key || !region) throw new Error("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION are missing from .env.local");

mkdirSync(folder, { recursive: true });
const madeNow = () => new Set(readdirSync(folder).filter((f) => /\.(mp3|wav)$/u.test(f)));
const known = new Set((chosen.subject.reading ?? []).map((u) => u.id));
for (const id of values.unit ?? []) if (!known.has(id)) throw new Error(`unknown reading unit ${id}`);
const wanted = chosen.wanted();
const choice = values.all ? {} : { units: new Set(values.unit), kinds: new Set(values.kind) };
const jobs = plan(wanted, choice, madeNow(), values.limit ? Number(values.limit) : Infinity);
console.log(`${jobs.length} recordings to make`);

/** Stop is an error after which no further recording is tried. */
class Stop extends Error {}

/** list writes the recordings made so far to recordings.ts, so that a run cut short keeps what it made. */
const list = () => {
  const listed = current(wanted, madeNow());
  writeFileSync(listFile, recordingsModule(listed, name));
  return listed;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function make(job: Job): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key!,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": job.format.azure,
        "User-Agent": "ga-audio",
      },
      body: job.ssml,
    });
    if (res.ok) {
      const audio = Buffer.from(await res.arrayBuffer());
      if (audio.length === 0) throw new Error(`${job.file}: an empty recording`);
      const part = new URL(`${job.file}.part`, folder);
      writeFileSync(part, audio);
      renameSync(part, new URL(job.file, folder));
      return;
    }
    const retry = res.status === 429 || res.status >= 500;
    const message = `${job.file}: ${res.status} ${(await res.text()).slice(0, 200)}`;
    // A rejected key or a used-up quota fails every recording alike, so the run stops instead of trying the rest.
    if (res.status === 401 || res.status === 403) throw new Stop(message);
    if (!retry || attempt >= TRIES) throw new Error(message);
    await wait(Number(res.headers.get("retry-after") ?? 0) * 1000 || 2 ** attempt * 1000);
  }
}

let next = 0;
let done = 0;
const failures: string[] = [];
await Promise.all(
  Array.from({ length: values.workers ? Number(values.workers) : WORKERS }, async () => {
    while (next < jobs.length) {
      const job = jobs[next++]!;
      try {
        await make(job);
        done++;
        if (done % 25 === 0 || done === jobs.length) {
          list();
          console.log(`${done}/${jobs.length}`);
        }
      } catch (e) {
        failures.push(String(e instanceof Error ? e.message : e));
        if (e instanceof Stop) next = jobs.length;
      }
    }
  }),
);

const listed = list();
console.log(`${listed.length} recordings listed in content/${name}/src/recordings.ts`);
if (failures.length > 0) {
  for (const f of failures) console.error(f);
  process.exitCode = 1;
}
