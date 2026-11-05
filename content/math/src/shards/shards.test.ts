import { createRng, readManifest, subjectManifest, type TopicDef } from "@ga/content";
import { describe, expect, it } from "vitest";

import { compileMath } from "../index.ts";
import { algebraShardTopics } from "./algebra.ts";
import { calculusShardTopics } from "./calculus.ts";
import { collegeShardTopics } from "./college.ts";
import { examShardTopics } from "./exam.ts";
import { schoolShardTopics } from "./school.ts";

// Content packages compile without runtime types.
declare const structuredClone: <T>(value: T) => T;

const shards: readonly (readonly TopicDef[])[] = [
  schoolShardTopics,
  algebraShardTopics,
  calculusShardTopics,
  collegeShardTopics,
  examShardTopics,
];
const compiled = compileMath();

describe("the shards of mathematics", () => {
  it("hold every topic of the subject exactly once", () => {
    const held = shards.flatMap((topics) => topics.map((t) => t.id));
    expect(new Set(held).size).toBe(held.length);
    expect(held.toSorted()).toEqual([...compiled.topics.keys()].toSorted());
  });

  it("hold the same knowledge points as the compiled subject", () => {
    for (const topic of shards.flat()) {
      const titles = (t: TopicDef) => t.knowledgePoints.map((k) => k.id);
      expect(titles(topic), topic.id).toEqual(titles(compiled.topics.get(topic.id)!));
    }
  });

  it("generate problems that survive a Worker call unchanged", () => {
    for (const topic of shards.flat()) {
      for (const kp of topic.knowledgePoints) {
        const problem = kp.generate(createRng(11));
        // A Worker RPC passes values by structured clone: functions would throw and class instances would lose their methods.
        expect(structuredClone(problem), `${topic.id}/${kp.id}`).toEqual(problem);
      }
    }
  });
});

describe("the manifest of mathematics", () => {
  it("rebuilds the graph and the courses from plain JSON", () => {
    const catalog = readManifest(JSON.parse(JSON.stringify(subjectManifest(compiled))));
    expect(catalog.graph.order).toEqual(compiled.graph.order);
    for (const id of compiled.graph.order) {
      expect(catalog.graph.topics.get(id)).toMatchObject(compiled.graph.topics.get(id)!);
      expect(catalog.graph.dependents.get(id)!.toSorted()).toEqual([...compiled.graph.dependents.get(id)!].toSorted());
      expect(
        catalog.graph.encompassedBy
          .get(id)!
          .map((e) => e.topic)
          .toSorted(),
      ).toEqual(
        compiled.graph.encompassedBy
          .get(id)!
          .map((e) => e.topic)
          .toSorted(),
      );
      expect(catalog.graph.ancestors.get(id)).toEqual(compiled.graph.ancestors.get(id));
    }
    expect([...catalog.courses.keys()]).toEqual([...compiled.courses.keys()]);
    for (const [id, course] of compiled.courses) expect(catalog.courses.get(id)).toEqual(course);
  });
});
