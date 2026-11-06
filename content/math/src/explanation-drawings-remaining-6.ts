// Drawings of the remaining explanations in the calculus shard: trigonometric equations solved on their graphs.

import type { Figure } from "@ga/content";
import { drawing } from "./explanation-drawings-kit.ts";
import { solveMarks } from "./explanation-drawings-remaining-kit.ts";

const sin = (d: number): number => Math.sin((d * Math.PI) / 180);
const cos = (d: number): number => Math.cos((d * Math.PI) / 180);
const tan = (d: number): number => Math.tan((d * Math.PI) / 180);

/** remainingDrawings6 draws the explanations of the calculus shard about trigonometric equations solved on their graphs. */
export const remainingDrawings6: Readonly<Record<string, Figure>> = {
  "general-solutions-of-trigonometric-equations-with-transformed-functions#period-and-spacing-of-transformed-trig-solutions": drawing(
    solveMarks({
      fn: (x) => sin(2 * x),
      levels: [[0.5]],
      dots: [
        [15, 0.5],
        [75, 0.5],
        [195, 0.5],
        [255, 0.5],
      ],
      says: [
        [15, "s"],
        [75, "s"],
        [195, "s"],
        [255, "s"],
      ],
    }),
    "For example, sin 2x = 1/2 in degrees. The wave is squeezed by 2, so its period is 180. The colored solutions 15 and 75 come again 180 later, at 195 and 255.",
    "例如，以度为单位的 sin 2x = 1/2。波被压缩为原来的 1/2，周期是 180。标色的解 15 和 75 在 180 之后再次出现，即 195 和 255。",
  ),
  "general-solutions-of-trigonometric-equations-with-transformed-functions#counting-the-solutions-of-a-multiple-angle-equation": drawing(
    solveMarks({
      fn: (x) => sin(3 * x),
      levels: [[0.5]],
      dots: [10, 50, 130, 170, 250, 290].map((x) => [x, 0.5] as const),
    }),
    "For example, sin 3x = 1/2 from 0 to 360. The angle 3x runs through 3 full cycles, each with 2 solutions, which makes the 6 colored points.",
    "例如，0 到 360 上的 sin 3x = 1/2。角 3x 走过 3 个完整周期，每个周期有 2 个解，共 6 个标色的点。",
  ),
  "trigonometric-equations-containing-transformed-sine-functions#solve-transformed-sine-degrees": drawing(
    solveMarks({
      fn: (x) => sin(x - 30),
      levels: [[0.5]],
      dots: [
        [60, 0.5],
        [180, 0.5],
      ],
      says: [
        [60, "s"],
        [180, "s"],
      ],
    }),
    "For example, sin(x − 30) = 1/2. The angle x − 30 is 30 or 150, and adding the shift back gives the colored solutions 60 and 180.",
    "例如，sin(x − 30) = 1/2。角 x − 30 是 30 或 150，加回平移量得标色的解 60 和 180。",
  ),
  "trigonometric-equations-containing-transformed-sine-functions#counting-solutions-of-a-multiple-angle-sine": drawing(
    solveMarks({
      fn: (x) => sin(2 * x),
      levels: [[-0.5]],
      dots: [105, 165, 285, 345].map((x) => [x, -0.5] as const),
    }),
    "For example, sin 2x = −1/2 from 0 to 360. With k = 2, two full cycles fit into one turn. Each has 2 solutions, which makes the 4 colored points.",
    "例如，0 到 360 上的 sin 2x = −1/2。k = 2 时，一周内有两个完整周期。每个周期有 2 个解，共 4 个标色的点。",
  ),
  "trigonometric-equations-containing-transformed-cosine-functions#solve-transformed-cosine-degrees": drawing(
    solveMarks({
      fn: (x) => cos(x - 30),
      levels: [[0.5]],
      dots: [
        [90, 0.5],
        [330, 0.5],
      ],
      says: [
        [90, "s"],
        [330, "s"],
      ],
    }),
    "For example, cos(x − 30) = 1/2. The angle x − 30 is 60 or 300, and adding the shift back gives the colored solutions 90 and 330.",
    "例如，cos(x − 30) = 1/2。角 x − 30 是 60 或 300，加回平移量得标色的解 90 和 330。",
  ),
  "trigonometric-equations-containing-transformed-cosine-functions#counting-solutions-of-a-multiple-angle-cosine": drawing(
    solveMarks({
      fn: (x) => cos(2 * x),
      levels: [[0.5]],
      dots: [30, 150, 210, 330].map((x) => [x, 0.5] as const),
    }),
    "For example, cos 2x = 1/2 from 0 to 360. With k = 2, two full cycles fit into one turn. Each has 2 solutions, which makes the 4 colored points.",
    "例如，0 到 360 上的 cos 2x = 1/2。k = 2 时，一周内有两个完整周期。每个周期有 2 个解，共 4 个标色的点。",
  ),
  "trigonometric-equations-containing-transformed-tangent-functions#solve-transformed-tangent-degrees": drawing(
    solveMarks({
      fn: (x) => tan(x - 30),
      y: [-3, 3, 1],
      to: 180,
      walls: [120],
      levels: [[1]],
      dots: [[75, 1]],
      says: [[75, "s"]],
    }),
    "For example, tan(x − 30) = 1 from 0 to 180. The angle x − 30 is 45, and adding the shift back gives the single colored solution 75. The wave breaks at the dashed line x = 120.",
    "例如，0 到 180 上的 tan(x − 30) = 1。角 x − 30 是 45，加回平移量得唯一标色的解 75。曲线在虚线 x = 120 处断开。",
  ),
  "trigonometric-equations-containing-transformed-tangent-functions#counting-solutions-of-a-multiple-angle-tangent": drawing(
    solveMarks({
      fn: (x) => tan(2 * x),
      y: [-3, 3, 1],
      walls: [45, 135, 225, 315],
      levels: [[1]],
      dots: [22.5, 112.5, 202.5, 292.5].map((x) => [x, 1] as const),
    }),
    "For example, tan 2θ = 1 from 0 to 360. With k = 2 there are 2 solutions in every half turn, and so 2k = 4 colored solutions in one full turn.",
    "例如，0 到 360 上的 tan 2θ = 1。k = 2 时，每半周有 2 个解，所以一整周有 2k = 4 个标色的解。",
  ),
  "quadratic-trigonometric-equations-containing-sine-or-cosine#solve-quadratic-sin-cos-degrees": drawing(
    solveMarks({
      fn: sin,
      levels: [[1], [-0.5]],
      dots: [
        [90, 1],
        [210, -0.5],
        [330, -0.5],
      ],
      says: [
        [90, "s"],
        [210, "n"],
        [330, "n"],
      ],
    }),
    "For example, 2 sin² x − sin x − 1 = 0 factors into sin x = 1 or sin x = −1/2. The two dashed levels meet the wave at the colored solutions 90, 210 and 330.",
    "例如，2 sin² x − sin x − 1 = 0 分解后得 sin x = 1 或 sin x = −1/2。两条虚线高度与波相交于标色的解 90、210 和 330。",
  ),
  "quadratic-trigonometric-equations-containing-sine-or-cosine#a-quadratic-in-sine-or-cosine-with-a-root-that-cannot-occur": drawing(
    solveMarks({
      fn: sin,
      y: [-1, 2, 1],
      levels: [[0.5], [2, "action"]],
      dots: [
        [30, 0.5],
        [150, 0.5],
      ],
      says: [
        [30, "s"],
        [150, "s"],
      ],
    }),
    "For example, 2 sin² x − 5 sin x + 2 = 0 has roots sin x = 1/2 and sin x = 2. The level 1/2 meets the wave at the colored 30 and 150. The level 2, in the other color, is above the wave, so that root is dropped.",
    "例如，2 sin² x − 5 sin x + 2 = 0 的根是 sin x = 1/2 和 sin x = 2。高度 1/2 与波相交于标色的 30 和 150。另一种颜色的高度 2 在波的上方，所以舍去这个根。",
  ),
  "quadratic-trigonometric-equations-containing-tangent-or-cotangent#solve-quadratic-tangent-cotangent-degrees": drawing(
    solveMarks({
      fn: tan,
      y: [-3, 3, 1],
      walls: [90, 270],
      levels: [[1], [-1]],
      dots: [
        [45, 1],
        [135, -1],
        [225, 1],
        [315, -1],
      ],
      says: [
        [45, "s"],
        [135, "n"],
        [225, "s"],
        [315, "n"],
      ],
    }),
    "For example, tan² x = 1 gives tan x = 1 or tan x = −1. With a period of 180, the two levels meet the graph at the colored solutions 45, 135, 225 and 315.",
    "例如，tan² x = 1 得 tan x = 1 或 tan x = −1。周期是 180，两个高度与图象相交于标色的解 45、135、225 和 315。",
  ),
};
