import type { PassageDef, ReadingUnitDef } from "@ga/content";
import { same } from "@ga/content";
import { passageRecording } from "@ga/content-english/audio";
import { describe, expect, it } from "vitest";

import { current, plan, readEnv, recordingsModule } from "./plan.ts";

const passage = (id: string, body: string): PassageDef => ({ id, title: same(id), body, topics: [], xp: 5, questions: [] });
const units: ReadingUnitDef[] = [
  { id: "u1", title: same("U1"), passages: [passage("a", "One."), passage("b", "Two."), passage("c", "One.")] },
  { id: "u2", title: same("U2"), passages: [passage("d", "Four.")] },
];
const name = (body: string) => passageRecording(passage("x", body));

describe("plan", () => {
  it("lists the recordings of the units chosen that are not made, once for each body", () => {
    expect(plan(units, new Set(["u1"]), new Set()).map((j) => j.passage)).toEqual(["a", "b"]);
    expect(plan(units, "all", new Set([name("Two.")])).map((j) => j.passage)).toEqual(["a", "d"]);
    expect(plan(units, "all", new Set(), 1)).toHaveLength(1);
    expect(plan(units, "all", new Set())[0]!.ssml).toContain("One.");
  });

  it("keeps only the recordings of passages as they are now", () => {
    expect(current(units, new Set([name("Four."), name("Old text.")]))).toEqual([name("Four.")]);
  });
});

describe("recordingsModule", () => {
  it("writes a sorted list as a module", () => {
    expect(recordingsModule([])).toContain("= [];");
    expect(recordingsModule(["ab", "cd"])).toContain('[\n  "ab",\n  "cd",\n]');
  });
});

describe("readEnv", () => {
  it("reads KEY=value lines and skips comments", () => {
    expect(readEnv("# note\nA=1\n\nB = two=2\n")).toEqual({ A: "1", B: "two=2" });
  });
});
