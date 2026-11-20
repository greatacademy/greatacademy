import { describe, expect, it } from "vitest";

import { createRng } from "./rng.ts";
import { KEPT, slimmed, slimTopics } from "./slim.ts";
import { t } from "./text.ts";
import type { TopicDef } from "./types.ts";

/** counted makes a builder of a topic of one knowledge point whose problem shows a seeded number from a bank of n, counting builds. */
function counted(n: number) {
  let builds = 0;
  const build = (id: string): TopicDef => {
    builds++;
    const bank = Array.from({ length: n }, (_, i) => i);
    return {
      id,
      title: t(id, id),
      summary: t(id, id),
      prerequisites: [],
      encompasses: [],
      xp: 1,
      knowledgePoints: [
        {
          id: `${id}-kp`,
          title: t("kp", "kp"),
          explanation: t("x", "x"),
          generate: (rng) => {
            const v = rng.pick(bank);
            return {
              prompt: t(String(v), String(v)),
              answer: { checker: "number", expected: v, input: { kind: "math" } },
              solution: t("", ""),
              canonical: String(v),
              wrong: [],
            };
          },
        },
      ],
    };
  };
  return { build, builds: () => builds };
}

describe("slimTopics", () => {
  it("keeps the topics as built and generates the same problems by rebuilding them on first use", () => {
    const { build, builds } = counted(50);
    const full = build("a");
    const slim = slimTopics(() => [build("a")]);
    expect(builds()).toBe(2);
    expect(slim[0]!.id).toBe("a");
    expect(slim[0]!.knowledgePoints.map((k) => k.id)).toEqual(["a-kp"]);
    for (let seed = 0; seed < 5; seed++) {
      expect(slim[0]!.knowledgePoints[0]!.generate(createRng(seed))).toEqual(full.knowledgePoints[0]!.generate(createRng(seed)));
    }
    expect(builds()).toBe(3);
  });

  it("keeps the builds used last instead of rebuilding them, and lets go of older ones", () => {
    const groups = Array.from({ length: KEPT + 1 }, (_, i) => {
      const { build, builds } = counted(10);
      return { slim: slimTopics(() => [build(`g${i}`)]), builds };
    });
    const ask = (i: number) => groups[i]!.slim[0]!.knowledgePoints[0]!.generate(createRng(1));
    for (let i = 0; i < KEPT; i++) ask(i);
    for (let round = 0; round < 3; round++) for (let i = 0; i < KEPT; i++) ask(i);
    // Built once to be kept and once on first use, whatever memory does: held strongly while among the latest.
    for (let i = 0; i < KEPT; i++) expect(groups[i]!.builds()).toBe(2);
    ask(KEPT);
    expect(groups[KEPT]!.builds()).toBe(2);
  });

  it("refuses a build that changes", () => {
    let k = 0;
    const slim = slimTopics(() => [
      { ...counted(1).build("a"), knowledgePoints: [{ ...counted(1).build("a").knowledgePoints[0]!, id: `kp-${k++}` }] },
    ]);
    expect(() => slim[0]!.knowledgePoints[0]!.generate(createRng(1))).toThrow(/built differently/u);
  });
});

describe("slimmed", () => {
  it("makes a builder of one topic build slim topics", () => {
    const { build } = counted(3);
    const topic = slimmed(build)("b");
    expect(topic.id).toBe("b");
    expect(topic.knowledgePoints[0]!.generate(createRng(2)).canonical).toBe(
      build("b").knowledgePoints[0]!.generate(createRng(2)).canonical,
    );
  });
});
