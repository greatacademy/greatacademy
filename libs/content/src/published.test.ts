import { describe, expect, it } from "vitest";

import { formatIds, mergeIds, missingIds, parseIds, subjectIds } from "./published.ts";
import { t } from "./text.ts";
import type { SubjectDef } from "./types.ts";

const subject = (topics: Record<string, string[]>, courses: string[]): SubjectDef => ({
  id: "s",
  title: t("S", "甲"),
  mark: "S",
  hue: 0,
  checkers: [],
  courses: courses.map((id) => ({ id, title: t("C", "乙"), description: t("D", "丙"), units: [] })),
  topics: Object.entries(topics).map(([id, points]) => ({
    id,
    title: t("T", "丁"),
    summary: t("T", "戊"),
    prerequisites: [],
    encompasses: [],
    xp: 1,
    knowledgePoints: points.map((p) => ({ id: p, title: t("K", "己"), explanation: t("E", "庚"), generate: () => ({}) as never })),
  })),
});

describe("published ids", () => {
  it("are written sorted, a topic with its knowledge points, and read back", () => {
    const ids = subjectIds(subject({ b: ["y", "x"], a: ["z"] }, ["c"]));
    const text = formatIds(ids);
    expect(text).toBe("course c\ntopic a z\ntopic b x y\n");
    expect(formatIds(parseIds(text))).toBe(text);
  });

  it("report what a subject no longer defines, and record new ids without dropping old ones", () => {
    const published = subjectIds(subject({ a: ["x", "y"], b: ["z"] }, ["c"]));
    const now = subjectIds(subject({ a: ["x", "w"] }, ["c", "d"]));
    expect(missingIds(published, now)).toEqual(["point a#y", "topic b"]);
    expect(missingIds(now, published)).toEqual(["course d", "point a#w"]);
    expect(formatIds(mergeIds(published, now))).toBe("course c\ncourse d\ntopic a w x y\ntopic b z\n");
  });
});
