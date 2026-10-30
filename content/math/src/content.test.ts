import { CompileError, formatIssue, sampleGenerators } from "@ga/content";
import { describe, expect, it } from "vitest";

import { compileMath } from "./index.ts";

function compile() {
  try {
    return compileMath();
  } catch (e) {
    if (e instanceof CompileError) throw new Error(e.issues.map(formatIssue).join("\n"));
    throw e;
  }
}

describe("math content", () => {
  it("compiles without warnings", () => {
    expect(compile().warnings.map(formatIssue)).toEqual([]);
  });

  it("has sound generators", () => {
    expect(sampleGenerators(compile(), { samples: 300, minDistinct: 25 }).map(formatIssue)).toEqual([]);
  }, 60_000);
});
