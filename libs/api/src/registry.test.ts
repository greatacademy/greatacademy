import type { SubjectGateway, SubjectManifest } from "@ga/content";
import { t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { Registry } from "./registry.ts";

/** subject is an empty subject with one course, counting how often its manifest is read. */
function subject(id: string, loads: string[]): SubjectGateway {
  const manifest: SubjectManifest = {
    id,
    title: t(id, id),
    mark: "T",
    hue: 200,
    topics: [],
    passages: [],
    courses: [
      {
        def: { id: `${id}-course`, subject: id, title: t(id, id), description: t(id, id), units: [], prerequisites: [] } as never,
        topics: [],
        masteryFloor: [],
        foundations: [],
      },
    ],
  };
  const none = async () => {
    throw new Error("not used");
  };
  return {
    problems: none,
    lesson: none,
    judge: none,
    passage: none,
    manifest: async () => {
      loads.push(id);
      return manifest;
    },
  };
}

describe("Registry", () => {
  it("serves a course that teaches in one language in that language", async () => {
    const gateway = subject("a", []);
    const manifest = await gateway.manifest();
    const course = manifest.courses[0]!;
    const taught = { ...course, def: { ...course.def, explanationLocale: "en" } } as never;
    const registry = await Registry.open([
      {
        ...gateway,
        manifest: async () => ({ ...manifest, courses: [taught] }),
        lesson: async () => ({ title: t("A", "甲"), explanation: t("B", "乙") }) as never,
      },
    ]);
    await expect((await registry.course("a-course"))?.source.lesson("x", 0)).resolves.toEqual({
      title: t("A", "A"),
      explanation: t("B", "B"),
    });
  });

  it("indexes every subject once, when opened", async () => {
    const loads: string[] = [];
    const registry = await Registry.open([subject("a", loads), subject("b", loads)]);
    expect(registry.listings.flatMap((s) => s.courses.map((c) => c.id))).toEqual(["a-course", "b-course"]);
    expect(loads).toEqual(["a", "b"]);
    expect((await registry.course("a-course"))?.id).toBe("a-course");
    expect((await registry.course("b-course"))?.id).toBe("b-course");
    expect(await registry.course("nope")).toBeUndefined();
    expect(loads).toEqual(["a", "b"]);
  });

  it("rejects duplicate subjects and courses", async () => {
    await expect(Registry.open([subject("a", []), subject("a", [])])).rejects.toThrow("duplicate subject a");
  });
});
