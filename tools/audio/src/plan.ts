import type { RecordingKind, Wanted } from "@ga/content-english/audio";

/** Job is one recording to make: its file and how it is made. */
export interface Job extends Wanted {
  readonly file: string;
}

/** Choice is which recordings a run makes: those of some kinds, of some reading units' passages, or all. */
export interface Choice {
  readonly kinds?: ReadonlySet<RecordingKind>;
  readonly units?: ReadonlySet<string>;
}

/**
 * plan lists the recordings to make, in the order the content asks for them, of those chosen that are not made yet;
 * at most limit of them. Choosing nothing chooses all.
 */
export function plan(wanted: ReadonlyMap<string, Wanted>, choice: Choice, made: ReadonlySet<string>, limit = Infinity): Job[] {
  const all = !choice.kinds?.size && !choice.units?.size;
  const jobs: Job[] = [];
  for (const [file, w] of wanted) {
    if (made.has(file)) continue;
    const chosen = all || choice.kinds?.has(w.kind) || (w.unit !== undefined && choice.units?.has(w.unit));
    if (!chosen) continue;
    if (jobs.length >= limit) break;
    jobs.push({ file, ...w });
  }
  return jobs;
}

/** current lists, sorted, the recordings made that the content asks for as it is now. */
export function current(wanted: ReadonlyMap<string, Wanted>, made: ReadonlySet<string>): string[] {
  return [...made].filter((file) => wanted.has(file)).sort();
}

/** recordingsModule is the source of content/english/src/recordings.ts listing the recordings given. */
export function recordingsModule(names: readonly string[]): string {
  const list = names.length === 0 ? "[]" : `[\n${names.map((n) => `  "${n}",`).join("\n")}\n]`;
  return `// Written by tools/audio; do not edit.

/** recordings are the files of the recordings made into content/english/audio/files. */
export const recordings: readonly string[] = ${list};
`;
}

/** readEnv reads KEY=value lines, ignoring blank lines and comments. */
export function readEnv(text: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const at = line.indexOf("=");
    if (at < 0 || line.trimStart().startsWith("#")) continue;
    env[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return env;
}

/**
 * toUpload lists the recordings to upload: those listed in recordings.ts that the bucket does not hold, sorted. A
 * recording made but not listed belongs to no passage now and stays out.
 */
export function toUpload(listed: readonly string[], stored: ReadonlySet<string>): string[] {
  return [...new Set(listed)].filter((name) => !stored.has(name)).sort();
}
