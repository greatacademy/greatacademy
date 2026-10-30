import { CompileError, formatIssue } from "@ga/content";
import { describe, expect, it } from "vitest";

import { compileMath } from "./index.ts";

describe("math content", () => {
  it("compiles without warnings", () => {
    try {
      expect(compileMath().warnings.map(formatIssue)).toEqual([]);
    } catch (e) {
      if (e instanceof CompileError) throw new Error(e.issues.map(formatIssue).join("\n"));
      throw e;
    }
  });
});
