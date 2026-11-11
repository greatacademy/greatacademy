import { compileSubject, type PassageDef, t } from "@ga/content";
import { compileEnglish, english } from "@ga/content-english";
import { compileMath } from "@ga/content-math";
import { describe, expect, it } from "vitest";

import { simulate } from "./simulate.ts";

const subject = compileMath();
const runs = (ability: number, xpPerDay: number) =>
  Array.from({ length: 10 }, (_, i) => simulate(subject, "algebra-foundations", { ability, xpPerDay }, i + 1));
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

describe("simulated students of English", () => {
  const english = compileEnglish();
  const course = (ability: number, xpPerDay: number) =>
    Array.from({ length: 5 }, (_, i) => simulate(english, "english-grammar-writing", { ability, xpPerDay }, i + 1));

  it("finish the broad course with fewer explicit reviews than a math course of its breadth", { timeout: 120_000 }, () => {
    const typical = course(0.85, 30);
    expect(typical.every((r) => r.finished)).toBe(true);
    expect(mean(typical.map((r) => r.reviewsPerTopic))).toBeLessThan(3);
  });

  it("let struggling students finish", { timeout: 120_000 }, () => {
    expect(course(0.7, 20).every((r) => r.finished)).toBe(true);
  });
});

describe("simulated students with passages to read", () => {
  const courseId = "english-grammar-writing";
  const passage = (i: number): PassageDef => ({
    id: `story-${i}`,
    title: t(`Story ${i}`, `故事 ${i}`),
    body: "The dog ran to the park and the cat sat on the wall.",
    topics: [],
    xp: 5,
    questions: [
      {
        prompt: t("Who ran?", "谁跑了？"),
        right: t("The dog", "狗"),
        wrong: [t("The cat", "猫")],
        solution: t("The dog ran.", "狗跑了。"),
      },
    ],
  });
  const reading = compileSubject({
    ...english,
    lexicon: ["the", "dog", "ran", "to", "park", "and", "cat", "sat", "on", "wall"].map((word) => ({ word })),
    reading: [{ id: "stories", title: t("Stories", "故事"), passages: Array.from({ length: 200 }, (_, i) => passage(i)) }],
    courses: english.courses.map((c) => ({
      ...c,
      reading: c.id === courseId ? ["stories"] : [],
      // The units' own reading units are replaced by the stories too.
      units: c.units.map(({ reading: _, ...unit }) => unit),
    })),
  });
  const run = (seed: number) => simulate(reading, courseId, { ability: 0.85, xpPerDay: 30 }, seed);

  it("give reading about its share of the XP and still finish the course", { timeout: 120_000 }, () => {
    const r = run(1);
    expect(r.finished).toBe(true);
    expect(r.passages).toBeGreaterThan(0);
    expect(r.readingXp / r.xp).toBeGreaterThan(0.1);
    expect(r.readingXp / r.xp).toBeLessThan(0.25);
  });

  it("are deterministic for a seed", { timeout: 120_000 }, () => {
    expect(run(2)).toEqual(run(2));
  });
});

describe("simulated students", () => {
  it("are deterministic for a seed", () => {
    expect(simulate(subject, "algebra-foundations", { ability: 0.85, xpPerDay: 30 }, 7)).toEqual(
      simulate(subject, "algebra-foundations", { ability: 0.85, xpPerDay: 30 }, 7),
    );
  });

  it("finish the course with about one explicit review per topic or fewer", () => {
    const typical = runs(0.85, 30);
    expect(typical.every((r) => r.finished)).toBe(true);
    expect(mean(typical.map((r) => r.reviewsPerTopic))).toBeLessThanOrEqual(1);
  });

  it("let struggling students finish, with more practice", () => {
    const struggling = runs(0.7, 20);
    expect(struggling.every((r) => r.finished)).toBe(true);
    expect(mean(struggling.map((r) => r.reviewsPerTopic))).toBeGreaterThan(mean(runs(0.85, 30).map((r) => r.reviewsPerTopic)));
  });

  it("let struggling students finish a broad course, without being held in reviews", { timeout: 180_000 }, () => {
    // The students are placed: they know what the course builds on, as after the diagnostic.
    const knows = [...(subject.courses.get("prealgebra")?.foundations ?? [])];
    const prealgebra = Array.from({ length: 3 }, (_, i) => simulate(subject, "prealgebra", { ability: 0.7, xpPerDay: 20, knows }, i + 1));
    expect(prealgebra.every((r) => r.finished)).toBe(true);
    expect(Math.max(...prealgebra.map((r) => r.reviewsPerTopic))).toBeLessThan(7);
  });

  it("skip what the diagnostic finds the student knows", () => {
    const knows = ["integers-and-opposites", "absolute-value", "adding-integers", "subtracting-integers"];
    const placed = mean(
      Array.from({ length: 10 }, (_, i) => simulate(subject, "algebra-foundations", { ability: 0.85, xpPerDay: 30, knows }, i + 1).lessons),
    );
    expect(placed).toBeLessThan(mean(runs(0.85, 30).map((r) => r.lessons)));
  });
});
