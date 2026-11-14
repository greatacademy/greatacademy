// Makes the recordings of English passages with Azure AI Speech and lists them in content/english/src/recordings.ts.
//
//   pnpm nx run audio:make -- --unit water-on-earth   # the passages of one or more reading units
//   pnpm nx run audio:make -- --all --limit 50        # any passages not yet recorded, at most 50
//
// The key and region come from AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local at the repository's root,
// which git ignores; the key is never printed.

import { mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { english } from "@ga/content-english";

import { current, type Job, plan, readEnv, recordingsModule } from "./plan.ts";

const root = new URL("../../../", import.meta.url);
const folder = new URL("content/english/audio/files/", root);
const listFile = new URL("content/english/src/recordings.ts", root);
/** FORMAT is 24 kHz mono MP3 at 48 kbit/s, ample for speech. */
const FORMAT = "audio-24khz-48kbitrate-mono-mp3";
/** WORKERS is how many recordings are made at once. */
const WORKERS = 3;
/** TRIES is how often a recording is tried before the run gives up on it. */
const TRIES = 5;

const { values } = parseArgs({
  options: { unit: { type: "string", multiple: true }, all: { type: "boolean" }, limit: { type: "string" } },
});
if (!values.all && !values.unit?.length) throw new Error("name --unit <id> or --all");

const env = readEnv(readFileSync(new URL(".env.local", root), "utf8"));
const key = env.AZURE_SPEECH_KEY;
const region = env.AZURE_SPEECH_REGION;
if (!key || !region) throw new Error("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION are missing from .env.local");

mkdirSync(folder, { recursive: true });
const madeNow = () => new Set(readdirSync(folder).flatMap((f) => (f.endsWith(".mp3") ? [f.slice(0, -4)] : [])));
const units = english.reading ?? [];
const known = new Set(units.map((u) => u.id));
for (const id of values.unit ?? []) if (!known.has(id)) throw new Error(`unknown reading unit ${id}`);
const jobs = plan(units, values.all ? "all" : new Set(values.unit), madeNow(), values.limit ? Number(values.limit) : Infinity);
console.log(`${jobs.length} recordings to make`);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function make(job: Job): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key!,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": FORMAT,
        "User-Agent": "ga-audio",
      },
      body: job.ssml,
    });
    if (res.ok) {
      const audio = Buffer.from(await res.arrayBuffer());
      if (audio.length === 0) throw new Error(`${job.passage}: an empty recording`);
      const part = new URL(`${job.name}.part`, folder);
      writeFileSync(part, audio);
      renameSync(part, new URL(`${job.name}.mp3`, folder));
      return;
    }
    const retry = res.status === 429 || res.status >= 500;
    if (!retry || attempt >= TRIES) throw new Error(`${job.passage}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    await wait(Number(res.headers.get("retry-after") ?? 0) * 1000 || 2 ** attempt * 1000);
  }
}

let next = 0;
let done = 0;
const failures: string[] = [];
await Promise.all(
  Array.from({ length: WORKERS }, async () => {
    while (next < jobs.length) {
      const job = jobs[next++]!;
      try {
        await make(job);
        done++;
        if (done % 25 === 0 || done === jobs.length) console.log(`${done}/${jobs.length}`);
      } catch (e) {
        failures.push(String(e instanceof Error ? e.message : e));
      }
    }
  }),
);

const listed = current(units, madeNow());
writeFileSync(listFile, recordingsModule(listed));
console.log(`${listed.length} recordings listed in content/english/src/recordings.ts`);
if (failures.length > 0) {
  for (const f of failures) console.error(f);
  process.exitCode = 1;
}
