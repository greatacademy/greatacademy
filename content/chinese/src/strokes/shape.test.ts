import { describe, expect, it } from "vitest";

import { firstShape, firstStroke } from "./hand.ts";

describe("shapeOf", () => {
  it("names straight first strokes by the way they go", () => {
    const named: Record<string, string> = {
      一: "横",
      十: "横",
      王: "横",
      人: "撇",
      月: "撇",
      你: "撇",
      口: "竖",
      是: "竖",
      这: "点",
      头: "点",
    };
    for (const [char, shape] of Object.entries(named)) expect(firstShape(char), char).toBe(shape);
  });

  it("says only that a turning first stroke turns, never which way its ends lie", () => {
    for (const char of "孤也女力子又阳绿") expect(firstShape(char), char).toBe("turning");
    expect(firstStroke("孤")["zh-CN"]).toBe("第一笔从左上方起笔，中途转折，写到转折处不要提笔");
  });
});
