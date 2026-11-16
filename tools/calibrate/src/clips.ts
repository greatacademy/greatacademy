// Makes the synthetic speech set of E4.5: each sentence of errors.ts said by one of several voices with Azure AI
// Speech, once with its error and once corrected, as WAVs of 16 kHz mono 16-bit PCM, and clips.jsonl listing them for
// `calibrate --speech stt:<language>`: the corrected sentences test how well a route hears (stt), the sentences with
// errors whether it keeps them (stt-verbatim). Synthetic voices test the route; recordings of learners remain.
//
//   pnpm nx run calibrate:clips -- --out <folder>
//
// The key and region come from AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local at the repository's root; the
// key is never printed.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { errorSentences } from "./errors.ts";

/** VOICES are the voices the sentences are said in, in turn: American, British, Australian and Indian English. */
const VOICES = [
  ["en-US", "en-US-AvaNeural"],
  ["en-US", "en-US-AndrewNeural"],
  ["en-GB", "en-GB-SoniaNeural"],
  ["en-GB", "en-GB-RyanNeural"],
  ["en-AU", "en-AU-NatashaNeural"],
  ["en-IN", "en-IN-PrabhatNeural"],
] as const;

const { values } = parseArgs({ options: { out: { type: "string" } } });
if (!values.out) throw new Error("name --out <folder>");
const env = Object.fromEntries(
  readFileSync(new URL("../../../.env.local", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/))
    .filter((m) => m !== null)
    .map((m) => [m[1], m[2]]),
);
const key = env.AZURE_SPEECH_KEY;
const region = env.AZURE_SPEECH_REGION;
if (!key || !region) throw new Error("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION are missing from .env.local");

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
mkdirSync(values.out, { recursive: true });
const lines: string[] = [];
const say = async (id: string, text: string, n: number) => {
  const [lang, voice] = VOICES[n % VOICES.length]!;
  const file = `${id}.wav`;
  const path = join(values.out!, file);
  if (existsSync(path)) return file;
  const ssml = `<speak version="1.0" xml:lang="${lang}"><voice name="${voice}">${xml(text)}</voice></speak>`;
  for (let k = 1; ; k++) {
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "riff-16khz-16bit-mono-pcm",
        "User-Agent": "greatacademy-calibrate",
      },
      body: ssml,
    });
    if (res.status === 429 && k < 6) {
      await new Promise((done) => setTimeout(done, 1000 * 2 ** k));
      continue;
    }
    if (!res.ok) throw new Error(`${id}: ${res.status}`);
    writeFileSync(path, new Uint8Array(await res.arrayBuffer()));
    return file;
  }
};
const sentences = errorSentences();
for (const [i, s] of sentences.entries()) {
  const file = await say(s.id, s.said, i);
  lines.push(JSON.stringify({ id: s.id, audio: file, said: s.said, reference: s.correct, source: "synthetic" }));
  // The corrected sentence in the next voice, so that each voice says both kinds.
  const right = await say(`${s.id}--correct`, s.correct, i + 1);
  lines.push(JSON.stringify({ id: `${s.id}--correct`, audio: right, said: s.correct, source: "synthetic" }));
}
writeFileSync(join(values.out, "clips.jsonl"), `${lines.join("\n")}\n`);
console.log(`${lines.length} clips in ${values.out}`);
