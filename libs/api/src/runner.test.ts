import { createRng } from "@ga/content";
import { defaultParams } from "@ga/engine";
import { describe, expect, it } from "vitest";

import type { CourseEntry } from "./registry.ts";
import { answerRun, type RunState, startRun } from "./runner.ts";

const course = {
  ctx: { params: defaultParams, graph: { graph: { topics: new Map([["t", { knowledgePoints: [{}, {}] }]]) } } },
  subject: { topics: new Map() },
  source: { judge: async () => ({ problem: {}, verdict: { correct: true } }) },
} as unknown as CourseEntry;

const state = { topics: {} } as never;
const lesson = { kind: "lesson", topic: "t" } as never;

describe("the seeds of a run", () => {
  it("follow the worked example, within a knowledge point and from one to the next", async () => {
    const rng = createRng(1);
    let run: RunState = startRun(course, lesson, state, 0, rng);
    if (run.kind !== "lesson") throw new Error("not a lesson");
    expect(run.current?.seed).toBe(run.example + 1);

    let kp = 0;
    for (let answers = 0; answers < 20 && kp === 0; answers++) {
      const before: RunState = run;
      if (before.kind !== "lesson") throw new Error("not a lesson");
      run = (await answerRun(course, before, state, "", false, 0, rng)).run;
      if (run.kind !== "lesson" || !run.current) throw new Error("the lesson ended early");
      kp = run.current.kp;
      if (kp === 0) {
        expect(run.example).toBe(before.example);
        expect(run.current.seed).toBe((before.current?.seed ?? 0) + 1);
      } else {
        expect(run.example).not.toBe(before.example);
        expect(run.current.seed).toBe(run.example + 1);
      }
    }
    expect(kp).toBe(1);
  });
});
