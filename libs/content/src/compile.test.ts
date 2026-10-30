import { describe, expect, it } from "vitest";

import { CompileError, compileSubject } from "./compile.ts";
import { figureIssue } from "./figure.ts";
import { sampleGenerators } from "./problems.ts";
import { same, t } from "./text.ts";
import type { CourseDef, Problem, SubjectDef, TopicDef } from "./types.ts";

const problem = (n: number): Problem => ({
  prompt: same(`What is $${n}$?`),
  answer: { checker: "text", expected: [String(n)], input: { kind: "text" } },
  solution: same(`It is $${n}$.`),
  canonical: String(n),
  wrong: [String(n + 1)],
});

function topic(id: string, extra: Partial<TopicDef> = {}): TopicDef {
  return {
    id,
    title: t(id, id),
    summary: t(`About ${id}`, `关于 ${id}`),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      { id: "kp", title: t("Step", "步骤"), explanation: t("Explain", "讲解"), generate: (rng) => problem(rng.int(1, 100)) },
    ],
    ...extra,
  };
}

function course(topics: string[], extra: Partial<CourseDef> = {}): CourseDef {
  return {
    id: "c",
    title: t("Course", "课程"),
    description: t("A course", "一门课"),
    units: [{ title: t("Unit", "单元"), modules: [{ title: t("Module", "模块"), topics }] }],
    ...extra,
  };
}

function subject(topics: TopicDef[], courses: CourseDef[] = []): SubjectDef {
  return { id: "test", title: t("Test", "测试"), topics, courses, checkers: [] };
}

function errors(def: SubjectDef): string[] {
  try {
    compileSubject(def);
    return [];
  } catch (e) {
    if (!(e instanceof CompileError)) throw e;
    return e.issues.filter((i) => i.severity === "error").map((i) => `${i.path}: ${i.message}`);
  }
}

describe("compileSubject", () => {
  it("builds the graph of a valid subject", () => {
    const s = compileSubject(
      subject(
        [
          topic("c", {
            prerequisites: ["b"],
            encompasses: [
              { topic: "b", weight: 1 },
              { topic: "a", weight: 0.5 },
            ],
          }),
          topic("a"),
          topic("b", { prerequisites: ["a"] }),
        ],
        [course(["a", "b", "c"])],
      ),
    );
    expect(s.graph.order).toEqual(["a", "b", "c"]);
    expect(s.graph.dependents.get("a")).toEqual(["b"]);
    expect([...s.graph.ancestors.get("c")!]).toEqual(["b", "a"]);
    expect(s.graph.encompassedBy.get("a")).toEqual([{ topic: "c", weight: 0.5 }]);
    expect(s.graph.topics.get("c")!.diagnosticKp).toBe(0);
    expect(s.courses.get("c")!.topics).toEqual(["a", "b", "c"]);
  });

  it.each([
    ["duplicate ids", subject([topic("a"), topic("a")]), "duplicate topic id"],
    ["bad ids", subject([topic("A b")]), "kebab case"],
    ["empty texts", subject([topic("a", { title: t("", "x") })]), "non-empty"],
    ["non-positive xp", subject([topic("a", { xp: 0 })]), "xp must be positive"],
    ["no knowledge points", subject([topic("a", { knowledgePoints: [] })]), "at least one knowledge point"],
    ["missing diagnostic kp", subject([topic("a", { diagnostic: "nope" })]), "diagnostic knowledge point nope"],
    ["self prerequisites", subject([topic("a", { prerequisites: ["a"] })]), "its own prerequisite"],
    ["dangling prerequisites", subject([topic("a", { prerequisites: ["x"] })]), "prerequisite x does not exist"],
    ["prerequisite cycles", subject([topic("a", { prerequisites: ["b"] }), topic("b", { prerequisites: ["a"] })]), "prerequisite cycle"],
    [
      "weights out of range",
      subject([topic("a"), topic("b", { prerequisites: ["a"], encompasses: [{ topic: "a", weight: 1.5 }] })]),
      "must be in (0, 1]",
    ],
    [
      "zero weights",
      subject([topic("a"), topic("b", { prerequisites: ["a"], encompasses: [{ topic: "a", weight: 0 }] })]),
      "must be in (0, 1]",
    ],
    ["non-ancestor encompassings", subject([topic("a"), topic("b", { encompasses: [{ topic: "a", weight: 1 }] })]), "is not an ancestor"],
    [
      "key prerequisites outside the ancestors",
      subject([topic("a"), topic("b", { knowledgePoints: [{ ...topic("x").knowledgePoints[0]!, keyPrerequisites: ["a"] }] })]),
      "key prerequisite a is not an ancestor",
    ],
    ["unknown course topics", subject([topic("a")], [course(["a", "z"])]), "topic z does not exist"],
    ["repeated course topics", subject([topic("a")], [course(["a", "a"])]), "appears twice"],
    [
      "course order against prerequisites",
      subject([topic("a"), topic("b", { prerequisites: ["a"] })], [course(["b", "a"])]),
      "comes before its prerequisite a",
    ],
    ["floor topics inside the course", subject([topic("a")], [course(["a"], { masteryFloor: ["a"] })]), "is in the course"],
  ])("rejects %s", (_, def, message) => {
    expect(errors(def).join("\n")).toContain(message);
  });

  it("accepts marked non-ancestor encompassings", () => {
    expect(errors(subject([topic("a"), topic("b", { encompasses: [{ topic: "a", weight: 1, nonAncestor: true }] })]))).toEqual([]);
  });

  it("warns about implied prerequisites", () => {
    const s = compileSubject(subject([topic("a"), topic("b", { prerequisites: ["a"] }), topic("c", { prerequisites: ["a", "b"] })]));
    expect(s.warnings.map((w) => w.message)).toEqual(["prerequisite a is implied by another prerequisite"]);
  });

  it("finds a course's foundations below its floor", () => {
    const s = compileSubject(
      subject(
        [topic("a"), topic("b", { prerequisites: ["a"] }), topic("c", { prerequisites: ["b"] }), topic("d", { prerequisites: ["c"] })],
        [course(["d"], { masteryFloor: ["b"] })],
      ),
    );
    expect(s.courses.get("c")!.foundations).toEqual(["c"]);
  });
});

describe("sampleGenerators", () => {
  it("accepts sound generators", () => {
    expect(sampleGenerators(compileSubject(subject([topic("a")])), { samples: 50 })).toEqual([]);
  });

  const withGenerator = (generate: TopicDef["knowledgePoints"][number]["generate"]) =>
    compileSubject(subject([topic("a", { knowledgePoints: [{ id: "kp", title: t("S", "S"), explanation: t("E", "E"), generate }] })]));

  it.each([
    [
      "throwing generators",
      () => {
        throw new Error("boom");
      },
      "generator threw: boom",
    ],
    ["non-deterministic generators", () => problem(Math.random()), "not deterministic"],
    ["rejected canonical responses", () => ({ ...problem(1), canonical: "2" }), "canonical response"],
    ["accepted wrong responses", () => ({ ...problem(1), wrong: ["1"] }), "wrong response"],
    ["NaN in texts", () => problem(Number.NaN), "contains NaN"],
    ["unknown checkers", () => ({ ...problem(1), answer: { ...problem(1).answer, checker: "nope" } }), "unknown checker"],
    ["unsafe figures", () => ({ ...problem(1), figure: { svg: '<svg viewBox="0 0 1 1"><script/></svg>', alt: same("x") } }), "<script>"],
  ] as const)("reports %s", (_, generate, message) => {
    const issues = sampleGenerators(withGenerator(generate as TopicDef["knowledgePoints"][number]["generate"]), { samples: 5 });
    expect(issues.map((i) => i.message).join("\n")).toContain(message);
  });

  it("warns about generators without variety", () => {
    const issues = sampleGenerators(
      withGenerator(() => problem(1)),
      { samples: 20 },
    );
    expect(issues).toEqual([{ severity: "warning", path: "topic a › kp kp", message: "only 1 distinct prompts in 20 samples" }]);
  });
});

describe("figureIssue", () => {
  const alt = t("A triangle", "一个三角形");
  it("accepts drawings in currentColor", () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><polygon points="10,70 90,70 50,10" fill="none" stroke="currentColor"/><text x="50" y="78" class="accent">8 cm</text></svg>';
    expect(figureIssue({ svg, alt })).toBeUndefined();
  });
  it.each([
    ['<svg viewBox="0 0 1 1"><foreignObject/></svg>', "<foreignObject>"],
    ['<svg viewBox="0 0 1 1"><rect onclick="x()"/></svg>', "onclick"],
    ['<svg viewBox="0 0 1 1"><path style="fill:red"/></svg>', "style"],
    ['<svg viewBox="0 0 1 1"><g href="https://example.com"/></svg>', "href"],
    ['<svg viewBox="0 0 1 1"><rect fill="url(#p)"/></svg>', "url()"],
    ["<svg><rect/></svg>", "viewBox"],
  ])("rejects %s", (svg, message) => {
    expect(figureIssue({ svg, alt })).toContain(message);
  });
  it("requires alt text in every locale", () => {
    expect(figureIssue({ svg: '<svg viewBox="0 0 1 1"></svg>', alt: { en: "x", "zh-CN": "" } })).toContain("alt");
  });
});
