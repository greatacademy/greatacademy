import { figureIssue, same } from "@ga/content";
import { describe, expect, it } from "vitest";

import { boxPlot, dotPlot, sketch } from "./figures.ts";

const axis = { min: 0, max: 10, step: 1, labelEvery: 2 };
const alt = same("plot");

describe("figures", () => {
  it("stack equal values in a dot plot", () => {
    const svg = dotPlot([3, 3, 3, 7], axis);
    expect(svg.match(/<circle/g)).toHaveLength(4);
    expect(svg.match(/cx="104"/g)).toHaveLength(3);
    expect(svg.match(/<text/g)).toHaveLength(6);
    expect(figureIssue({ svg, alt })).toBeUndefined();
  });

  it("draw a box from the first to the third quartile", () => {
    const svg = boxPlot([1, 3, 5, 6, 10], axis);
    expect(svg).toContain('<rect x="104" y="10" width="84" height="40"/>');
    expect(figureIssue({ svg, alt })).toBeUndefined();
  });

  it("fit a sketch's view box to its labels", () => {
    const svg = sketch([
      { kind: "segment", a: [-5, 0], b: [5, 0] },
      { kind: "arc", vertex: [0, 0], from: [5, 0], to: [-5, 0], label: "180°" },
    ]);
    const [x, y, w, h] = svg
      .match(/viewBox="([^"]+)"/)![1]!
      .split(" ")
      .map(Number) as [number, number, number, number];
    const label = svg.match(/<text x="([\d.-]+)" y="([\d.-]+)"/)!;
    // The straight angle's label sits above the line, inside the view box.
    expect(Number(label[2])).toBeLessThan(0);
    expect(Number(label[2]) - 10).toBeGreaterThanOrEqual(y);
    expect(x).toBeLessThan(0);
    expect(x + w).toBeGreaterThan(280);
    expect(h).toBeGreaterThan(40);
    expect(figureIssue({ svg, alt })).toBeUndefined();
  });

  it("mark right angles, equal sides and parallel lines", () => {
    const svg = sketch([
      {
        kind: "polygon",
        points: [
          [0, 0],
          [4, 0],
          [4, 3],
          [0, 3],
        ],
      },
      { kind: "right", vertex: [0, 0], from: [4, 0], to: [0, 3] },
      { kind: "ticks", a: [0, 0], b: [4, 0], count: 2 },
      { kind: "arrows", a: [0, 3], b: [4, 3], count: 1 },
      { kind: "side", a: [0, 0], b: [4, 0], text: "4 cm" },
    ]);
    expect(svg.match(/<polyline/g)).toHaveLength(4);
    expect(svg).toContain(">4 cm</text>");
    expect(figureIssue({ svg, alt })).toBeUndefined();
  });
});
