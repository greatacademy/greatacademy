import { describe, expect, it } from "vitest";

import { english } from "../index.ts";
import { sentencesOf } from "./aural.ts";

describe("listening and reading aloud in the grades", () => {
  it("splits a passage into its sentences, running a poem's lines on", () => {
    expect(sentencesOf("The river rose. “Run!” she cried.\n\nIt was late.")).toEqual([
      "The river rose.",
      "“Run!” she cried.",
      "It was late.",
    ]);
    expect(sentencesOf("The wind blew\nacross the hill.")).toEqual(["The wind blew across the hill."]);
  });

  it("gives each unit of grades 3 to 12 that reads a reading unit a listening module and then reading aloud", () => {
    const topics = new Map(english.topics.map((topic) => [topic.id, topic]));
    for (let grade = 3; grade <= 12; grade++) {
      const course = english.courses.find((c) => c.id === `english-grade-${grade}`);
      const units = (course?.units ?? []).filter((u) => (u.reading ?? []).length > 0);
      expect(units.length, `grade ${grade}`).toBeGreaterThan(0);
      for (const unit of units) {
        const titles = unit.modules.map((m) => m.title.en);
        expect(titles.slice(-2), unit.title.en).toEqual(["Listening", "Speaking"]);
        const [listening, aloud] = unit.modules.slice(-2).map((m) => topics.get(m.topics[0] ?? ""));
        expect(listening?.strand).toBe("listening");
        expect(aloud?.spoken).toBe("en-US");
        expect(aloud?.prerequisites).toEqual([listening?.id]);
      }
    }
  });
});
