// Drawings of the remaining explanations in the algebra shard: complementary and supplementary angles, and parallel lines cut by a transversal.

import type { Figure } from "@ga/content";
import type { Mark } from "@ga/subject-math";
import { parallelCut } from "./explanation-drawings-exam-kit.ts";
import { shift } from "./explanation-drawings-geometry-2.ts";
import { angle, drawing, note, on, seg } from "./explanation-drawings-kit.ts";

/** cutPair draws one named pair of angles at two lines and a transversal, without the arrows of parallel lines. */
const cutPair = (a: number, b: number, dx: number, dy: number): Mark[] =>
  shift(
    parallelCut(65, [
      [a, "result"],
      [b, "result"],
    ]).filter((m) => m.kind !== "arrows"),
    dx,
    dy,
  );

/** remainingDrawings10 draws the explanations of the algebra shard about complementary and supplementary angles, and parallel lines cut by a transversal. */
export const remainingDrawings10: Readonly<Record<string, Figure>> = {
  "complementary-and-supplementary-angles#complementary-angles": drawing(
    [
      seg([0, 0], on(0, 5)),
      seg([0, 0], on(35, 5)),
      seg([0, 0], on(90, 5)),
      angle([0, 0], on(0, 1), on(35, 1), undefined, "35°"),
      angle([0, 0], on(35, 1), on(90, 1), "result", "55°"),
    ],
    "Adjacent angles forming a right angle. With 35° in one part, the colored complement is 90° − 35° = 55°.",
    "相邻的两个角组成一个直角。一部分是 35°，标色的余角是 90° − 35° = 55°。",
  ),
  "complementary-and-supplementary-angles#supplementary-angles": drawing(
    [
      seg([-5, 0], [5, 0]),
      seg([0, 0], on(35, 5)),
      angle([0, 0], on(0, 1), on(35, 1), undefined, "35°"),
      angle([0, 0], on(35, 1), on(180, 1), "result", "145°"),
    ],
    "A linear pair on a straight line. With 35° on one side, the colored supplement is 180° − 35° = 145°.",
    "直线上的一对邻补角。一边是 35°，标色的补角是 180° − 35° = 145°。",
  ),
  "complementary-and-supplementary-angles#angles-in-a-given-ratio": drawing(
    [
      seg([0, 0], on(0, 5)),
      seg([0, 0], on(36, 5)),
      seg([0, 0], on(90, 5)),
      angle([0, 0], on(0, 1), on(36, 1), undefined, "36°"),
      angle([0, 0], on(36, 1), on(90, 1), "result", "54°"),
    ],
    "For example, a total of 90° in the ratio 2 : 3. Five parts share it, so each part is 18°, and the colored larger angle is 3 parts, 54°.",
    "例如，总和 90°，比为 2 : 3。五份平分，每份 18°，标色的较大角是 3 份，即 54°。",
  ),
  "parallel-lines-and-transversals#naming-angle-pairs": drawing(
    [...cutPair(2, 6, 0, 6.8), ...cutPair(3, 6, 8.4, 6.8), ...cutPair(1, 8, 0, 0), ...cutPair(4, 6, 8.4, 0)],
    "Four views of the same crossing, with a pair in color. Top left: corresponding. Top right: alternate interior. Bottom left: alternate exterior. Bottom right: consecutive interior.",
    "同一组相交线的四个视图，一对角标色。左上：同位角。右上：内错角。左下：外错角。右下：同旁内角。",
  ),
  "parallel-lines-and-transversals#angles-from-parallel-lines": drawing(
    parallelCut(
      65,
      [
        [1, undefined, "115°"],
        [2, "result", "65°"],
        [3, "result", "65°"],
        [4, undefined, "115°"],
        [5, undefined, "115°"],
        [6, "result", "65°"],
        [7, "result", "65°"],
        [8, undefined, "115°"],
      ],
      3.4,
      4,
    ),
    "With parallel lines, all eight angles take two values that add up to 180°. The colored angles are 65° and the others 115°.",
    "直线平行时，八个角只有两种大小，相加为 180°。标色的角是 65°，其余是 115°。",
  ),
  "parallel-lines-and-transversals#equations-from-parallel-lines": drawing(
    [
      ...parallelCut(
        85,
        [
          [4, "action"],
          [6, "result"],
        ],
        4,
      ),
      note([1.3, 3.1], "(3x − 10)°", "e"),
      note([0.9, 0.9], "(2x + 15)°", "e"),
    ],
    "Consecutive interior angles add up to 180°, so x = 35. The drawing is to scale for that value, with angles of 95° and 85°.",
    "同旁内角相加为 180°，所以 x = 35。图按这个值的比例画出，两个角是 95° 和 85°。",
  ),
};
