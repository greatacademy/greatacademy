import type { ReadingUnitDef } from "@ga/content";
import { passageRecording, passageSsml } from "@ga/content-english/audio";

/** Job is one recording to make: the passage it reads, its name and the SSML it is made from. */
export interface Job {
  readonly passage: string;
  readonly name: string;
  readonly ssml: string;
}

/**
 * plan lists the recordings to make for the reading units chosen, by unit id or all of them, that are not made
 * yet; at most limit of them. Two passages with the same body share one recording.
 */
export function plan(
  units: readonly ReadingUnitDef[],
  chosen: ReadonlySet<string> | "all",
  made: ReadonlySet<string>,
  limit = Infinity,
): Job[] {
  const jobs: Job[] = [];
  const seen = new Set(made);
  for (const unit of units) {
    if (chosen !== "all" && !chosen.has(unit.id)) continue;
    for (const p of unit.passages) {
      const name = passageRecording(p);
      if (seen.has(name)) continue;
      seen.add(name);
      if (jobs.length >= limit) return jobs;
      jobs.push({ passage: p.id, name, ssml: passageSsml(p.body) });
    }
  }
  return jobs;
}

/** current lists, sorted, the recordings made that belong to a passage as it is now. */
export function current(units: readonly ReadingUnitDef[], made: ReadonlySet<string>): string[] {
  const names = new Set(units.flatMap((u) => u.passages.map(passageRecording)));
  return [...made].filter((name) => names.has(name)).sort();
}

/** recordingsModule is the source of content/english/src/recordings.ts listing the recordings given. */
export function recordingsModule(names: readonly string[]): string {
  const list = names.length === 0 ? "[]" : `[\n${names.map((n) => `  "${n}",`).join("\n")}\n]`;
  return `// Written by tools/audio; do not edit.

/** recordings are the names of the recordings made into content/english/audio/files. */
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
