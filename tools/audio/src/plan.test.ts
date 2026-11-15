import { MP3, WAV, type Wanted } from "@ga/content-english/audio";
import { describe, expect, it } from "vitest";

import { current, plan, readEnv, recordingsModule, toUpload } from "./plan.ts";

const wanted = new Map<string, Wanted>([
  ["a.mp3", { kind: "passage", ssml: "<a/>", format: MP3, unit: "u1" }],
  ["b.mp3", { kind: "passage", ssml: "<b/>", format: MP3, unit: "u2" }],
  ["c.mp3", { kind: "word", ssml: "<c/>", format: MP3 }],
  ["d.wav", { kind: "opening", ssml: "<d/>", format: WAV }],
]);
const files = (jobs: readonly { file: string }[]) => jobs.map((j) => j.file);

describe("plan", () => {
  it("lists the recordings chosen that are not made, in the order asked for", () => {
    expect(files(plan(wanted, {}, new Set(["b.mp3"])))).toEqual(["a.mp3", "c.mp3", "d.wav"]);
    expect(files(plan(wanted, { units: new Set(["u2"]) }, new Set()))).toEqual(["b.mp3"]);
    expect(files(plan(wanted, { kinds: new Set(["word", "opening"]) }, new Set()))).toEqual(["c.mp3", "d.wav"]);
    expect(plan(wanted, {}, new Set(), 1)).toHaveLength(1);
    expect(plan(wanted, {}, new Set())[3]!.format).toBe(WAV);
  });

  it("keeps only the recordings the content asks for now", () => {
    expect(current(wanted, new Set(["c.mp3", "old.mp3"]))).toEqual(["c.mp3"]);
  });
});

describe("recordingsModule", () => {
  it("writes a sorted list as a module", () => {
    expect(recordingsModule([])).toContain("= [];");
    expect(recordingsModule(["ab", "cd"])).toContain('[\n  "ab",\n  "cd",\n]');
  });
});

describe("toUpload", () => {
  it("lists the recordings listed that the bucket does not hold", () => {
    expect(toUpload(["cd", "ab", "ef", "ab"], new Set(["ef"]))).toEqual(["ab", "cd"]);
    expect(toUpload(["ab"], new Set(["ab", "zz"]))).toEqual([]);
  });
});

describe("readEnv", () => {
  it("reads KEY=value lines and skips comments", () => {
    expect(readEnv("# note\nA=1\n\nB = two=2\n")).toEqual({ A: "1", B: "two=2" });
  });
});
