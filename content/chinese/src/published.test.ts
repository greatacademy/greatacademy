/// <reference types="node" />

import { readFileSync } from "node:fs";

import { missingIds, parseIds, subjectIds } from "@ga/content";
import { describe, expect, it } from "vitest";

import { chinese } from "./index.ts";

// Learner state names these ids, so a published one is never removed or renamed (Content §2).
describe("published ids", () => {
  const published = parseIds(readFileSync(new URL("../published-ids.txt", import.meta.url), "utf8"));
  const defined = subjectIds(chinese);

  it("are all still defined", () => {
    expect(missingIds(published, defined), "a published id is never removed or renamed").toEqual([]);
  });

  it("include every id defined", () => {
    expect(missingIds(defined, published), "run pnpm nx run audit:ids to record new ids").toEqual([]);
  });
});
