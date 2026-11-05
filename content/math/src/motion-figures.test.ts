import { createRng, figureIssue, viewOf } from "@ga/content";
import { describe, expect, it } from "vitest";

import { compileMath } from "./index.ts";
import { movedPoint, movedPolygon, viewAround } from "./motion-figures.ts";

describe("motion figures", () => {
  it("keeps every point in view", () => {
    expect(viewAround([[1, 2]]).xMax).toBe(8);
    expect(viewAround([[-11, 2]]).xMin).toBe(-12);
  });

  it("draws the subject, the motion and the result", () => {
    const f = movedPoint("P", [1, 2], [-2, 1], { kind: "turn", degrees: 90 });
    expect(figureIssue(f)).toBeUndefined();
    for (const role of ["accent", "action", "result"]) expect(f.svg).toContain(`class="${role}"`);
    const flip = movedPolygon(
      ["A", "B", "C"],
      [
        [1, 1],
        [3, 1],
        [1, 4],
      ],
      [
        [-1, 1],
        [-3, 1],
        [-1, 4],
      ],
      { kind: "flip", a: [0, 0], b: [0, 1] },
    );
    expect(figureIssue(flip)).toBeUndefined();
    expect(flip.alt.en).toContain("A′B′C′");
  });

  it("draws the rigid motions in their solutions", () => {
    const { knowledgePoints } = compileMath().topics.get("rotations-of-geometric-figures")!;
    for (const kp of knowledgePoints) {
      const problem = kp.generate(createRng(5));
      expect(problem.solutionFigure, kp.id).toBeDefined();
      expect(viewOf(problem)).not.toHaveProperty("solutionFigure");
    }
  });
});
