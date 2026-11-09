import { compileSubject, type PassageDef, type TopicDef, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { applyEvent, type EngineEvent, replay } from "./events.ts";
import { courseScope, engineGraph } from "./graph.ts";
import { DAY, defaultParams as p } from "./params.ts";
import { initialState, type LearnerState, memory, newTopicState } from "./state.ts";
import { knownWordShare, nextPassage, nextTasks, type Planner, readingDue } from "./tasks.ts";
import { eventXp, isReadingBlownOff } from "./xp.ts";

const topic = (id: string): TopicDef => ({
  id,
  title: t(id, id),
  summary: t(id, id),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "kp",
      title: t("k", "k"),
      explanation: t("e", "e"),
      generate: () => ({
        prompt: t("p", "p"),
        answer: { checker: "text", expected: ["1"], input: { kind: "text" } },
        solution: t("s", "s"),
        canonical: "1",
      }),
    },
  ],
});

const question = { prompt: t("q", "q"), right: t("r", "r"), wrong: [t("w", "w")], solution: t("s", "s") };
const passage = (id: string, body: string, topics: PassageDef["topics"] = []): PassageDef => ({
  id,
  title: t(id, id),
  body,
  topics,
  xp: 5,
  questions: [question, question],
});
const common = "one two three four five six seven eight nine".split(" ");

const subject = compileSubject({
  id: "s",
  title: t("S", "S"),
  topics: [topic("grammar"), topic("words")],
  courses: [
    {
      id: "c",
      title: t("C", "C"),
      description: t("D", "D"),
      units: [{ title: t("U", "U"), modules: [{ title: t("M", "M"), topics: ["grammar", "words"] }] }],
      reading: ["unit"],
    },
  ],
  mark: "T",
  hue: 200,
  checkers: [],
  reading: [
    {
      id: "unit",
      title: t("U", "U"),
      passages: [passage("first", `${common.join(" ")} rare`, [{ topic: "grammar", weight: 1 }]), passage("second", common.join(" "))],
    },
  ],
  lexicon: [...common.map((word) => ({ word })), { word: "rare", topic: "words" }],
});
const graph = engineGraph(subject.graph);
const ctx = { params: p, graph };
const planner: Planner = { params: p, graph, scope: courseScope(graph, subject.courses.get("c")!) };
const T0 = Date.UTC(2026, 0, 1);
const taught = (...ids: string[]): LearnerState => ({
  ...initialState,
  diagnosed: ["c"],
  xp: 100,
  topics: Object.fromEntries(ids.map((id) => [id, newTopicState(T0, 0, 1, false)])),
});
const reading = (extra: Partial<Extract<EngineEvent, { type: "reading" }>> = {}): EngineEvent => ({
  type: "reading",
  at: T0 + 3 * DAY,
  passage: "first",
  correct: 2,
  total: 2,
  ...extra,
});

describe("known words", () => {
  const first = subject.graph.passages.get("first")!;

  it("counts all the words but those of topics not yet known", () => {
    expect(knownWordShare(planner, taught(), first)).toBeCloseTo(0.9);
    expect(knownWordShare(planner, taught("words"), first)).toBe(1);
  });

  it("offers a passage only above the known share and with its topics known", () => {
    expect(nextPassage(planner, taught())).toBeUndefined();
    expect(nextPassage(planner, taught("words"))).toBeUndefined();
    expect(nextPassage(planner, taught("grammar"))).toBeUndefined();
    expect(nextPassage(planner, taught("grammar", "words"))).toBe("first");
    const lenient = { ...planner, params: { ...p, readingKnownShare: 0.9 } };
    expect(nextPassage(lenient, taught("grammar"))).toBe("first");
  });
});

describe("the reading task", () => {
  it("is offered first while reading is below its share of the XP, and then not", () => {
    const state = taught("grammar", "words");
    expect(readingDue(planner, state)).toBe(true);
    expect(nextTasks(planner, state, T0)[0]).toEqual({ kind: "reading", passage: "first" });
    const full = { ...state, readingXp: 20 };
    expect(readingDue(planner, full)).toBe(false);
    expect(nextTasks(planner, full, T0).some((task) => task.kind === "reading")).toBe(false);
  });

  it("follows the unit's order and never offers a passage again, passed or not", () => {
    const after = applyEvent(ctx, taught("grammar", "words"), reading({ correct: 0 }));
    expect(after.read).toEqual(["first"]);
    expect(nextPassage(planner, after)).toBe("second");
    const done = applyEvent(ctx, after, reading({ passage: "second" }));
    expect(nextPassage(planner, done)).toBeUndefined();
  });

  it("offers nothing new to a course with no reading units", () => {
    const none = { ...planner, scope: { ...planner.scope, passages: [] } };
    expect(nextTasks(none, taught("grammar", "words"), T0).some((task) => task.kind === "reading")).toBe(false);
  });
});

describe("the reading event", () => {
  const state = taught("grammar", "words");
  const remembered = (s: LearnerState, id: string) => memory(p, s.topics[id]!, T0 + 3 * DAY);

  it("earns XP for the time, less when the check fails, and counts it as reading", () => {
    expect(eventXp(ctx, state, reading())).toBe(5);
    expect(eventXp(ctx, state, reading({ correct: 0 }))).toBe(3);
    const after = applyEvent(ctx, state, reading());
    expect(after).toMatchObject({ xp: 105, readingXp: 5 });
  });

  it("credits the topics it depends on in part, and no others", () => {
    const after = applyEvent(ctx, state, reading());
    expect(remembered(after, "grammar")).toBeGreaterThan(remembered(state, "grammar"));
    expect(after.topics.words).toEqual(state.topics.words);
    expect(remembered(after, "grammar")).toBeLessThan(1);
  });

  it("neither credits nor penalizes when the check fails", () => {
    expect(applyEvent(ctx, state, reading({ correct: 0 })).topics).toEqual(state.topics);
  });

  it("calls a failed check blown off only when the reading was too fast", () => {
    expect(isReadingBlownOff(p, false, 600, 30_000)).toBe(true);
    expect(isReadingBlownOff(p, false, 600, 90_000)).toBe(false);
    expect(isReadingBlownOff(p, true, 600, 30_000)).toBe(false);
  });

  it("replays to the same state", () => {
    const log: EngineEvent[] = [reading({ correct: 1 }), reading({ passage: "second", at: T0 + 5 * DAY })];
    const once = replay(ctx, log, state);
    expect(replay(ctx, log, state)).toEqual(once);
    expect(once.read).toEqual(["first", "second"]);
    expect(once.xp).toBe(state.xp + 10);
  });

  it("leaves a state with no reading as it was", () => {
    const stored: LearnerState = taught("grammar");
    expect("read" in stored).toBe(false);
    expect(nextPassage(planner, stored)).toBeUndefined();
  });
});
