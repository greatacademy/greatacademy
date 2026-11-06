// Drawings of the remaining explanations in the exam shard: circle graphs, sides opposite angles, and altitudes.

import type { Figure } from "@ga/content";
import { pie, tri } from "./explanation-drawings-exam-kit.ts";
import { drawing, fromAngles, note, seg, square } from "./explanation-drawings-kit.ts";

/** remainingDrawings1 draws the explanations of the exam shard that the SAT and ACT tables leave out: circle graphs, sides opposite angles, and altitudes. */
export const remainingDrawings1: Readonly<Record<string, Figure>> = {
  "circle-graphs#amounts-from-a-circle-graph": drawing(
    pie([40, 35, 25], 0, ["40%", "35%", "25%"]),
    "For example, a circle graph with the colored sector at 40%. If the whole stands for 250 people, the sector stands for 0.4 · 250 = 100 people.",
    "例如，一个圆形统计图，标色的扇形占 40%。如果全部代表 250 人，这个扇形就代表 0.4 · 250 = 100 人。",
  ),
  "circle-graphs#central-angles-of-sectors": drawing(
    pie([25, 15, 60], 0, ["90°", "54°", "216°"]),
    "Sectors of 25%, 15% and 60%, labeled with their central angles. The colored sector of 25% has central angle 90°, and the sector of 15% has 54°.",
    "占 25%、15% 和 60% 的扇形，标出各自的圆心角。标色的 25% 扇形圆心角是 90°，15% 的扇形是 54°。",
  ),
  "side-angle-relationships-in-triangles#ordering-sides-from-angles": drawing(
    tri(fromAngles(70, 60, 5), {
      names: ["A", "B", "C"],
      angles: ["70°", "60°", "50°"],
      angleStyles: ["result", undefined, "action"],
      sideStyles: ["action", "result"],
    }),
    "For example, angles of 70°, 60° and 50°. The side BC opposite the largest angle, A, is the longest, and the side AB opposite the smallest angle, C, is the shortest. Each pair has one color.",
    "例如，角为 70°、60° 和 50°。最大角 A 所对的边 BC 最长，最小角 C 所对的边 AB 最短。每对用一种颜色。",
  ),
  "finding-altitudes-using-the-pythagorean-theorem#the-altitude-of-an-isosceles-triangle": drawing(
    [
      ...tri(
        [
          [0, 0],
          [6, 0],
          [3, 4],
        ],
        {
          sides: [undefined, "5", "5"],
          ticks: [
            [1, 1],
            [2, 1],
          ],
        },
      ),
      seg([3, 0], [3, 4], "result"),
      square([3, 0], [6, 0], [3, 4]),
      note([1.5, 0], "3", "s"),
      note([4.5, 0], "3", "s"),
      note([3, 2], "4", "e"),
    ],
    "For example, legs of 5 and a base of 6. The altitude meets the base at its midpoint, so each half is 3 and the colored altitude is √(25 − 9) = 4.",
    "例如，腰长 5，底边 6。高与底边交于中点，所以每半是 3，标色的高是 √(25 − 9) = 4。",
  ),
  "finding-altitudes-using-the-pythagorean-theorem#the-altitude-of-an-equilateral-triangle": drawing(
    [
      ...tri(
        [
          [0, 0],
          [6, 0],
          [3, 3 * Math.sqrt(3)],
        ],
        {
          sides: [undefined, "s", "s"],
          ticks: [
            [1, 1],
            [2, 1],
          ],
        },
      ),
      seg([3, 0], [3, 3 * Math.sqrt(3)], "result"),
      square([3, 0], [6, 0], [3, 3]),
      note([1.5, 0], "s/2", "s"),
      note([4.5, 0], "s/2", "s"),
      note([3, 1.2], "s√3/2", "e"),
    ],
    "The altitude splits the equilateral triangle into two right triangles, with hypotenuse s and leg s/2. The colored altitude is s√3/2.",
    "高把等边三角形分成两个直角三角形，斜边是 s，一条直角边是 s/2。标色的高是 s√3/2。",
  ),
};
