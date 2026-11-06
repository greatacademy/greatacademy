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

describe("a reading run", () => {
  const reading = {
    ctx: {
      params: defaultParams,
      graph: {
        graph: {
          passages: new Map([["p", { id: "p", words: 600, xp: 5, questions: 2, topics: [], wordsByTopic: {}, unit: "u" }]]),
          topics: new Map(),
        },
      },
    },
    subject: { topics: new Map() },
    source: { judge: async (_: unknown, response: string) => ({ problem: {}, verdict: { correct: response === "right" } }) },
  } as unknown as CourseEntry;
  const task = { kind: "reading", passage: "p" } as const;

  const run = async (responses: readonly string[], eachMs: number) => {
    const rng = createRng(1);
    let now = 0;
    let current: RunState = startRun(reading, task, state, now, rng);
    let event: unknown;
    for (const response of responses) {
      now += eachMs;
      const answered = await answerRun(reading, current, state, response, false, now, rng);
      current = answered.run;
      event = answered.event;
    }
    return { current, event };
  };

  it("asks each question of the passage in order, then ends with a reading event", async () => {
    const rng = createRng(1);
    const started = startRun(reading, task, state, 0, rng);
    expect(started.current).toMatchObject({ topic: "p", kp: 0 });
    const second = await answerRun(reading, started, state, "right", false, 60_000, rng);
    expect(second.event).toBeUndefined();
    expect(second.run.current).toMatchObject({ topic: "p", kp: 1, seed: started.current!.seed + 1 });
    const { event } = await run(["right", "wrong"], 120_000);
    expect(event).toEqual({ type: "reading", at: 240_000, passage: "p", correct: 1, total: 2 });
  });

  it("marks a failed check blown off when the reading was too fast, and not otherwise", async () => {
    expect((await run(["wrong", "wrong"], 5_000)).event).toMatchObject({ blownOff: true });
    expect((await run(["wrong", "wrong"], 60_000)).event).not.toHaveProperty("blownOff");
    expect((await run(["right", "right"], 5_000)).event).not.toHaveProperty("blownOff");
  });
});
