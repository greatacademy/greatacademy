// Uploads the recordings listed in content/english/src/recordings.ts that the R2 bucket greatacademy does not hold
// yet, under audio/english/, from which the web Worker serves them (docs/content.md):
//
//   pnpm nx run audio:upload
//
// It runs the Cloudflare CLI, signed in with `cf auth login`; recordings never change, so one held is never sent again.

import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { recordings } from "@ga/content-english/audio";

import { toUpload } from "./plan.ts";

const run = promisify(execFile);
const cf = fileURLToPath(new URL("../node_modules/.bin/cf", import.meta.url));
const folder = new URL("../../../content/english/audio/files/", import.meta.url);
/** BUCKET is the bucket of the site's public files. */
const BUCKET = "greatacademy";
/** PREFIX is where the recordings of English are in the bucket. */
const PREFIX = "audio/english/";
/** PAGE is how many keys a listing asks for at once. */
const PAGE = 1000;
/** WORKERS is how many recordings are uploaded at once. */
const WORKERS = 4;

/** stored lists the names of the recordings the bucket holds, a page at a time. */
async function stored(): Promise<Set<string>> {
  const names = new Set<string>();
  for (let after = ""; ; ) {
    const args = ["r2", "objects", "list", "--bucket-name", BUCKET, "--prefix", PREFIX, "--per-page", String(PAGE), "-q"];
    if (after) args.push("--start-after", after);
    const { stdout } = await run(cf, args, { maxBuffer: 64 << 20 });
    const page = JSON.parse(stdout) as { key: string }[];
    for (const { key } of page) names.add(key.slice(PREFIX.length).replace(/\.mp3$/u, ""));
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
      const file = fileURLToPath(new URL(`${name}.mp3`, folder));
      const key = `${PREFIX}${name}.mp3`;
      await run(cf, ["r2", "objects", "put", key, "--bucket-name", BUCKET, "--file", file, "--content-type", "audio/mpeg", "-q"]);
      done++;
      if (done % 25 === 0 || done === names.length) console.log(`${done}/${names.length}`);
    }
  }),
);
