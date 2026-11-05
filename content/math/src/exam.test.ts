import { describe, expect, it } from "vitest";

import { unpracticedBases } from "./exam.ts";
import { compileMath } from "./index.ts";

describe("unpracticedBases", () => {
  it("removes real edges and keeps the prerequisites", () => {
    const { topics } = compileMath();
    for (const [id, bases] of Object.entries(unpracticedBases)) {
      const topic = topics.get(id);
      expect(topic, id).toBeDefined();
      for (const base of bases) {
        expect(topic?.prerequisites, `${id} ${base}`).toContain(base);
        expect(
          topic?.encompasses.map((edge) => edge.topic),
          `${id} ${base}`,
        ).not.toContain(base);
      }
    }
  });
});
