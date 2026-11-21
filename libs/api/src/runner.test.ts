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

describe("a quiz run", () => {
  const quiz = (deadline: number): RunState => ({
    kind: "quiz",
    topics: ["t", "t", "t"],
    deadline,
    asked: [],
    servedAt: 0,
    current: { topic: "t", kp: 0, seed: 1 },
  });

  it("judges answers until the time is up, then ends with the questions left counted wrong", async () => {
    const rng = createRng(1);
    const first = await answerRun(course, quiz(60_000), state, "1", false, 30_000, rng);
    expect(first.event).toBeUndefined();
    const second = await answerRun(course, first.run, state, "1", false, 61_000, rng);
    expect(second.event).toMatchObject({
      type: "quiz",
      results: [
        { topic: "t", correct: true },
        { topic: "t", correct: true },
        { topic: "t", correct: false, late: true },
      ],
    });
  });

  it("counts an answer that arrives well after the time limit wrong", async () => {
    const rng = createRng(1);
    const { run, event } = await answerRun(course, quiz(60_000), state, "1", false, 90_000, rng);
    expect(run.asked[0]).toMatchObject({ correct: false, late: true });
    expect(event?.type === "quiz" && event.results.filter((r) => r.late)).toHaveLength(3);
  });
});

describe("a multistep problem", () => {
  const parted = {
    ...course,
    source: {
      judge: async (ref: { part?: number }, response: string) => ({
        problem: { part: { index: ref.part ?? 0, count: 2 } },
        verdict: { correct: response === "right" },
      }),
    },
  } as unknown as CourseEntry;
  const quiz: RunState = {
    kind: "quiz",
    topics: ["t", "t"],
    deadline: 600_000,
    asked: [],
    servedAt: 0,
    current: { topic: "t", kp: 0, seed: 1 },
  };

  it("asks its parts in turn and counts as one question, right only when every part is", async () => {
    const rng = createRng(1);
    const first = await answerRun(parted, quiz, state, "right", false, 10_000, rng);
    expect(first.run.asked).toHaveLength(0);
    expect(first.run.current).toMatchObject({ topic: "t", kp: 0, seed: 1, part: 1 });
    const second = await answerRun(parted, first.run, state, "wrong", false, 25_000, rng);
    expect(second.run.asked).toHaveLength(1);
    expect(second.run.asked[0]).toMatchObject({
      correct: false,
      elapsedMs: 25_000,
      parts: [
        { response: "right", correct: true },
        { response: "wrong", correct: false },
      ],
    });
    expect(second.run.asked[0]).not.toHaveProperty("part");
    expect(second.run.partial).toBeUndefined();
    expect(second.run.current?.part).toBeUndefined();
  });
});

describe("a review run", () => {
  const review: RunState = {
    kind: "review",
    topic: "t",
    covers: [],
    plan: [0, 1, 0, 1, 0],
    asked: [],
    servedAt: 0,
    current: { topic: "t", kp: 0, seed: 1 },
  };
  const reviewing = {
    ...course,
    ctx: { ...course.ctx, graph: { graph: { topics: new Map([["t", { knowledgePoints: [{}, {}], xp: 10 }]]), passages: new Map() } } },
  } as unknown as CourseEntry;

  it("marks an answer given after the reference and counts it in the review's event", async () => {
    const rng = createRng(1);
    const first = await answerRun(reviewing, { ...review, referenced: true }, state, "1", false, 10_000, rng);
    expect(first.run.asked[0]).toMatchObject({ correct: true, referenced: true });
    expect(first.run.referenced).toBeUndefined();
    const second = await answerRun(reviewing, first.run, state, "1", false, 20_000, rng);
    const third = await answerRun(reviewing, second.run, state, "1", false, 30_000, rng);
    expect(second.run.asked[1]).not.toHaveProperty("referenced");
    expect(third.event).toMatchObject({ type: "review", correct: 3, total: 3, referenced: 1 });
  });
});
