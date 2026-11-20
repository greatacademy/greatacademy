/// <reference types="node" />

import { existsSync, readdirSync } from "node:fs";
import { createRng, t } from "@ga/content";
import { writingGenerator } from "@ga/subject-chinese";
import { describe, expect, it } from "vitest";
import { sceneStories } from "./hsk/paper-data.ts";
import { illustrations, storyPicture, withPictures } from "./illustrations.ts";

const folder = new URL("../illustrations/", import.meta.url);

describe("illustrations", () => {
  it("lists every illustration whose web file exists, and no other", () => {
    const files = existsSync(folder) ? readdirSync(folder).filter((f) => f.endsWith(".webp")) : [];
    expect(files.map((f) => f.replace(/\.webp$/u, "")).sort()).toEqual([...illustrations].sort());
  });

  it("names only pictures of the HSK 5 stories that exist", () => {
    const names = new Set(sceneStories.map((_, i) => storyPicture(i)));
    for (const name of illustrations) expect(names).toContain(name);
  });

  it("gives a story its picture by its place, and the problem shows it", () => {
    const stories = withPictures(sceneStories, [storyPicture(1)]);
    expect(stories[0]?.picture).toBeUndefined();
    expect(stories[1]?.picture).toBe("illustrations/chinese/hsk-5-story-02");
    const generate = writingGenerator(t("Write.", "写。"), [stories[1]!], ["c"], { minWords: 1, maxChars: 9 }, () => t("", ""));
    expect(generate(createRng(1)).picture).toBe("illustrations/chinese/hsk-5-story-02");
  });
});
