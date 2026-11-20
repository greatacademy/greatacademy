// Uploads the recordings listed in content/<subject>/src/recordings.ts that the R2 bucket greatacademy does not hold
// yet, under audio/<subject>/, from which the web Worker serves them (docs/content.md):
//
//   pnpm nx run audio:upload                                  # English
//   pnpm nx run audio:upload -- --subject chinese --workers 16
//
// It runs the Cloudflare CLI, signed in with `cf auth login`; recordings never change, so one held is never sent again.

import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs, promisify } from "node:util";
import { recordings as chineseRecordings } from "@ga/content-chinese/audio";
import { recordings as englishRecordings } from "@ga/content-english/audio";

import { toUpload } from "./plan.ts";

const run = promisify(execFile);
const cf = fileURLToPath(new URL("../node_modules/.bin/cf", import.meta.url));
/** SUBJECTS are the recordings of each subject that has them. */
const SUBJECTS: Record<string, readonly string[]> = { english: englishRecordings, chinese: chineseRecordings };
const { values } = parseArgs({
  options: { subject: { type: "string", default: "english" }, workers: { type: "string", default: "4" } },
});
const subject = values.subject;
const recordings = SUBJECTS[subject];
if (!recordings) throw new Error(`unknown subject ${subject}`);
const folder = new URL(`../../../content/${subject}/audio/files/`, import.meta.url);
/** BUCKET is the bucket of the site's public files. */
const BUCKET = "greatacademy";
/** PREFIX is where the subject's recordings are in the bucket. */
const PREFIX = `audio/${subject}/`;
/** PAGE is how many keys a listing asks for at once. */
const PAGE = 1000;
/** WORKERS is how many recordings are uploaded at once. */
const WORKERS = Number(values.workers);
if (!Number.isInteger(WORKERS) || WORKERS < 1) throw new Error("--workers is a positive whole number");

/** stored lists the names of the recordings the bucket holds, a page at a time. */
async function stored(): Promise<Set<string>> {
  const names = new Set<string>();
  for (let after = ""; ; ) {
    const args = ["r2", "objects", "list", "--bucket-name", BUCKET, "--prefix", PREFIX, "--per-page", String(PAGE), "-q"];
    if (after) args.push("--start-after", after);
    const { stdout } = await run(cf, args, { maxBuffer: 64 << 20 });
    const page = JSON.parse(stdout) as { key: string }[];
    for (const { key } of page) names.add(key.slice(PREFIX.length));
    if (page.length < PAGE) return names;
    after = page.at(-1)!.key;
  }
}

const names = toUpload(recordings, await stored());
console.log(`${names.length} recordings to upload`);
let next = 0;
let done = 0;
await Promise.all(
  Array.from({ length: WORKERS }, async () => {
    while (next < names.length) {
      const name = names[next++]!;
      const file = fileURLToPath(new URL(name, folder));
      const type = name.endsWith(".wav") ? "audio/wav" : "audio/mpeg";
      await run(cf, ["r2", "objects", "put", `${PREFIX}${name}`, "--bucket-name", BUCKET, "--file", file, "--content-type", type, "-q"]);
      done++;
      if (done % 25 === 0 || done === names.length) console.log(`${done}/${names.length}`);
    }
  }),
);
