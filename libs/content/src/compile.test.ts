import { describe, expect, it } from "vitest";

import { CompileError, compileSubject } from "./compile.ts";
import { explanationParts, type Figure, figureIssue, plottedPoints } from "./figure.ts";
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
  return { id: "test", title: t("Test", "测试"), mark: "T", hue: 200, topics, courses, checkers: [] };
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
  it("needs a mark of one or two characters and a hue below 360", () => {
    expect(errors({ ...subject([topic("a")]), mark: "Abc", hue: 360 })).toEqual([
      "subject test › mark: mark must be one or two characters",
      "subject test › hue: hue must be at least 0 and below 360",
    ]);
    expect(errors({ ...subject([topic("a")]), mark: "∑", hue: 0 })).toEqual([]);
  });
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
    ["courses built on unknown courses", subject([topic("a")], [course(["a"], { buildsOn: ["z"] })]), "builds on unknown course z"],
    ["courses built on themselves", subject([topic("a")], [course(["a"], { buildsOn: ["c"] })]), "cannot build on itself"],
    [
      "courses built on each other",
      subject([topic("a")], [course(["a"], { buildsOn: ["d"] }), course(["a"], { id: "d", buildsOn: ["c"] })]),
      "courses build on each other",
    ],
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
    [
      "unsafe solution figures",
      () => ({ ...problem(1), solutionFigure: { svg: '<svg viewBox="0 0 1 1"><script/></svg>', alt: same("x") } }),
      "<script>",
    ],
  ] as const)("reports %s", (_, generate, message) => {
    const issues = sampleGenerators(withGenerator(generate as TopicDef["knowledgePoints"][number]["generate"]), { samples: 5 });
    expect(issues.map((i) => i.message).join("\n")).toContain(message);
  });

  it("samples only the topics of a shard", () => {
    const s = compileSubject(
      subject([
        topic("a"),
        topic("b", { knowledgePoints: [{ id: "kp", title: t("S", "S"), explanation: t("E", "E"), generate: () => problem(1) }] }),
      ]),
    );
    expect(sampleGenerators(s, { samples: 5, shard: { index: 0, count: 2 } })).toEqual([]);
    expect(sampleGenerators(s, { samples: 5, shard: { index: 1, count: 2 } }).map((i) => i.path)).toEqual(["topic b › kp kp"]);
  });

  it("reports texts that break the subject's writing rules", () => {
    const issues = sampleGenerators(
      withGenerator(() => problem(1)),
      {
        samples: 5,
        textIssue: (text, locale) => (locale === "en" && text.includes("1") ? "no ones" : undefined),
      },
    );
    expect(issues.map((i) => i.message)[0]).toMatch(/^no ones: /);
  });

  it("reports choice answers that keep to one position", () => {
    const choice = (expected: number): Problem => ({
      ...problem(1),
      answer: { checker: "choice", expected, input: { kind: "choice", options: [same("a"), same("b")] } },
      canonical: String(expected),
      wrong: [String(1 - expected)],
    });
    const fixed = withGenerator(() => choice(0));
    expect(sampleGenerators(fixed, { samples: 10, maxPositionShare: 0.8 }).map((i) => i.message)).toContain(
      "the answer sits at one option position in 10 of 10 samples",
    );
    const varied = withGenerator((rng) => choice(rng.int(0, 1)));
    expect(sampleGenerators(varied, { samples: 40, maxPositionShare: 0.8 }).filter((i) => i.severity === "error")).toEqual([]);
  });

  it("checks the figures of a choice", () => {
    const drawn = (svg: string): Figure => ({ svg, alt: same("a drawing") });
    const good = '<svg viewBox="0 0 1 1"><line/></svg>';
    const choice = (figures: readonly Figure[]): Problem => ({
      ...problem(1),
      answer: { checker: "choice", expected: 0, input: { kind: "choice", options: [same("a"), same("b")], figures } },
      canonical: "0",
      wrong: ["1"],
    });
    const errors = (figures: readonly Figure[]) =>
      sampleGenerators(
        withGenerator(() => choice(figures)),
        { samples: 1 },
      ).map((i) => i.message);
    expect(errors([drawn(good)])[0]).toMatch(/one figure for each option/);
    expect(errors([drawn(good), drawn(good)])[0]).toMatch(/must be distinct/);
    expect(errors([drawn(good), drawn('<svg viewBox="0 0 1 1"><script/></svg>')])[0]).toMatch(/script/);
    expect(errors([drawn(good), drawn('<svg viewBox="0 0 2 2"><line/></svg>')])).toEqual([]);
  });

  it("checks that the answer to a plot can be marked", () => {
    const grid = { xMin: -2, xMax: 2, yMin: -2, yMax: 2, step: 1, left: 0, top: 0, scale: 10 };
    const plot = (canonical: string, points = 1, figure?: Figure): Problem => ({
      ...problem(1),
      ...(figure && { figure }),
      answer: { checker: "choice", expected: 0, input: { kind: "plot", grid, points } },
      canonical,
      wrong: [],
    });
    const drawn: Figure = { svg: '<svg viewBox="0 0 1 1"><line/></svg>', alt: same("a grid") };
    const errors = (p: Problem) =>
      sampleGenerators(
        withGenerator(() => p),
        { samples: 1 },
      ).map((i) => i.message);
    expect(errors(plot("(1, 1)"))[0]).toMatch(/needs a figure/);
    expect(errors(plot("(1, 1)", 2, drawn))[0]).toMatch(/does not list 2 points/);
    expect(errors(plot("(3, 1)", 1, drawn))[0]).toMatch(/outside the grid/);
    expect(errors(plot("(0.5, 1)", 1, drawn))[0]).toMatch(/not a point of the grid/);
  });

  it("warns about generators without variety", () => {
    const issues = sampleGenerators(
      withGenerator(() => problem(1)),
      { samples: 20 },
    );
    expect(issues).toEqual([{ severity: "warning", path: "topic a › kp kp", message: "only 1 distinct prompts in 20 samples" }]);
  });
});

describe("plottedPoints", () => {
  it("reads points joined by semicolons", () => {
    expect(plottedPoints("(1, -2)")).toEqual([[1, -2]]);
    expect(plottedPoints("(1.5, 0); (-3,4)")).toEqual([
      [1.5, 0],
      [-3, 4],
    ]);
  });

  it("refuses anything else", () => {
    expect(plottedPoints("1, 2")).toBeUndefined();
    expect(plottedPoints("(1, 2);")).toBeUndefined();
    expect(plottedPoints("(1, 2, 3)")).toBeUndefined();
  });
});

describe("explanationParts", () => {
  it("splits an explanation at the figures it places", () => {
    expect(explanationParts("Draw it.\n\n{{figure 0}}\n\nThen this.\n\n{{figure 1}}")).toEqual(["Draw it.", 0, "Then this.", 1]);
    expect(explanationParts("No figure.")).toEqual(["No figure."]);
  });
});

describe("figures in an explanation", () => {
  const drawn = { svg: '<svg viewBox="0 0 1 1"><line/></svg>', alt: same("x") };
  const withPoint = (explanation: { en: string; "zh-CN": string }, figures: readonly (typeof drawn)[]) =>
    subject([topic("a", { knowledgePoints: [{ id: "kp", title: same("S"), explanation, figures, generate: () => problem(1) }] })]);

  it("accepts figures placed once in every locale", () => {
    expect(() => compileSubject(withPoint(same("See\n\n{{figure 0}}"), [drawn]))).not.toThrow();
  });

  it.each([
    ["missing in one locale", { en: "See\n\n{{figure 0}}", "zh-CN": "看" }],
    ["placed twice", same("{{figure 0}} and {{figure 0}}")],
    ["out of range", same("{{figure 1}}")],
  ])("rejects a figure %s", (_, explanation) => {
    expect(() => compileSubject(withPoint(explanation, [drawn]))).toThrow("must place each");
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

describe("passages", () => {
  const question = {
    prompt: t("Who?", "谁？"),
    right: t("Bees", "蜜蜂"),
    wrong: [t("Ants", "蚂蚁")],
    solution: t("It says bees.", "文中说蜜蜂。"),
  };
  const passage = {
    id: "bees",
    title: t("Bees", "蜜蜂"),
    body: "Bees make honey. Ana's bees make honey.",
    topics: [{ topic: "a", weight: 0.5 }],
    names: ["Ana's"],
    xp: 3,
    questions: [question],
  };
  const subject = (extra: Partial<SubjectDef> = {}): SubjectDef => ({
    id: "s",
    title: t("S", "学科"),
    topics: [topic("a"), topic("b")],
    courses: [course(["a", "b"], { reading: ["u"] })],
    mark: "T",
    hue: 200,
    checkers: [],
    reading: [{ id: "u", title: t("U", "单元"), passages: [passage, { ...passage, id: "bees-2" }] }],
    lexicon: [{ word: "bee", forms: ["bees"] }, { word: "make", forms: ["makes"], topic: "b" }, { word: "honey" }],
    ...extra,
  });
  const errors = (def: SubjectDef) => {
    try {
      compileSubject(def);
      return [];
    } catch (e) {
      return (e as CompileError).issues.map((i) => i.message);
    }
  };

  it("counts running words by the topic that teaches them, and links a unit in order", () => {
    const { graph } = compileSubject(subject());
    expect(graph.passages.get("bees")).toMatchObject({ unit: "u", words: 7, wordsByTopic: { b: 2 }, questions: 1, xp: 3 });
    expect(graph.passages.get("bees")?.previous).toBeUndefined();
    expect(graph.passages.get("bees-2")?.previous).toBe("bees");
  });

  it("rejects a word outside the lexicon unless it is a name or glossed", () => {
    expect(errors(subject({ lexicon: [{ word: "bee", forms: ["bees"] }, { word: "make" }] }))).toEqual(
      expect.arrayContaining([expect.stringContaining("outside the lexicon: honey")]),
    );
  });

  it("rejects ids that collide, missing references and questions without wrong options", () => {
    const unit = (p: object) => [{ id: "u", title: t("U", "单元"), passages: [{ ...passage, ...p }] }];
    expect(errors(subject({ reading: unit({ id: "a" }) })).join()).toContain("already used");
    expect(errors(subject({ reading: unit({ topics: [{ topic: "x", weight: 1 }] }) })).join()).toContain("topic x does not exist");
    expect(errors(subject({ reading: unit({ questions: [{ ...question, wrong: [] }] }) })).join()).toContain("wrong option");
    expect(errors(subject({ courses: [course(["a", "b"], { reading: ["none"] })] })).join()).toContain("reading unit none");
    expect(errors(subject({ lexicon: [{ word: "bee" }, { word: "bee" }] })).join()).toContain("appears twice");
  });
});

describe("judged topics", () => {
  const criterion = { id: "states-point", version: "1", question: "Does the text state its point?", quoteWhenMet: true };
  const writing = (n: number, criteria: readonly string[] = ["states-point"]): Problem => ({
    prompt: t(`Write ${n} words about pets.`, `用英语写 ${n} 个词谈宠物。`),
    answer: {
      checker: "writing",
      expected: { minWords: n, maxChars: 600 },
      input: { kind: "writing", minWords: n, maxChars: 600 },
      judged: { criteria },
    },
    solution: same("Dogs make good pets because they are loyal."),
    canonical: "Dogs make good pets because they are loyal and kind.",
    wrong: ["Dogs."],
  });
  const judgedTopic = (id: string, criteria: readonly string[] = ["states-point"], extra: Partial<TopicDef> = {}) =>
    topic(id, {
      criteria: [criterion],
      knowledgePoints: [
        { id: "kp", title: t("Write", "写"), explanation: t("Explain", "讲解"), generate: (rng) => writing(rng.int(3, 6), criteria) },
      ],
      ...extra,
    });

  it("lets a judged topic depend on any topic, but no other topic depend on it", () => {
    expect(errors(subject([topic("a"), judgedTopic("w", undefined, { prerequisites: ["a"] })]))).toEqual([]);
    expect(errors(subject([judgedTopic("w"), topic("b", { prerequisites: ["w"] })]))).toEqual([
      "topic b: prerequisite w is judged by a model, so a topic that is not cannot depend on it",
    ]);
    expect(errors(subject([judgedTopic("w"), topic("b", { encompasses: [{ topic: "w", weight: 0.5, nonAncestor: true }] })]))).toEqual([
      "topic b: encompassed topic w is judged by a model, so a topic that is not cannot encompass it",
    ]);
  });

  it("checks criteria, and that a criterion shared by topics is the same", () => {
    const bad = { ...criterion, id: "Bad", question: "State the point." };
    expect(errors(subject([topic("a", { criteria: [bad, bad] })]))).toEqual([
      "topic a › criterion Bad: id must be kebab case",
      "topic a › criterion Bad: the question must be a yes-or-no question",
      "topic a › criterion Bad: id must be kebab case",
      "topic a › criterion Bad: duplicate criterion",
      "topic a › criterion Bad: the question must be a yes-or-no question",
    ]);
    const other = { ...criterion, question: "Is the point clear?" };
    expect(errors(subject([judgedTopic("w"), topic("v", { criteria: [other] })]))).toEqual([
      "topic v › criterion states-point: a criterion shared by topics must be the same in each; change its id or version",
    ]);
  });

  it("samples judged problems, checking their criteria and limits", () => {
    expect(sampleGenerators(compileSubject(subject([judgedTopic("w")])), { samples: 20, minDistinct: 1 })).toEqual([]);
    const unknown = sampleGenerators(compileSubject(subject([judgedTopic("w", ["other"])])), { samples: 5, minDistinct: 1 });
    expect(unknown[0]?.message).toBe("criterion other is not one of the topic's");
    const loose = topic("x", {
      knowledgePoints: [{ id: "kp", title: t("W", "写"), explanation: t("E", "讲"), generate: () => writing(3) }],
    });
    expect(sampleGenerators(compileSubject(subject([loose])), { samples: 5, minDistinct: 1 })[0]?.message).toBe(
      "a judged problem must be in a topic with criteria",
    );
  });
});
