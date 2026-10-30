import { figureIssue, same } from "@ga/content";
import { describe, expect, it } from "vitest";

import { boxPlot, dotPlot } from "./figures.ts";

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
});
