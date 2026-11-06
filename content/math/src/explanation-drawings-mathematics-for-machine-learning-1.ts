// Drawings of the explanations of Mathematics for Machine Learning: minimizers on integers and read from graphs.

import type { Figure } from "@ga/content";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { drawing } from "./explanation-drawings-kit.ts";

/** machineLearningDrawings1 draws the explanations of Mathematics for Machine Learning, by knowledge point. */
export const machineLearningDrawings1: Readonly<Record<string, Figure>> = {
  "argmax-and-argmin-notation#argmin-over-the-integers": drawing(
    pane(0, [0, 4, 1], [0, 8, 2], 6, 5, "x", "g")
      .f((x) => (3 * x - 7) * (3 * x - 7), 1.4, 3.3, "result")
      .open(7 / 3, 0, "7/3", "s")
      .dot(2, 1, "(2, 1)", "w", "action")
      .dot(3, 4, "(3, 4)", "e", "action")
      .marks(),
    "The graph of g(x) = (3x − 7)², with its real minimizer at the hollow point x = 7/3. Over the integers, only the marked points count. Since g(2) = 1 is below g(3) = 4, the integer minimizer is 2, the integer nearest the vertex.",
    "g(x) = (3x − 7)² 的图像，实数最小值点在空心点 x = 7/3。在整数上，只有标出的点才算。因为 g(2) = 1 小于 g(3) = 4，整数最小值点是 2，即最接近顶点的整数。",
  ),
  "finding-argmax-and-argmin-from-tables-and-graphs#reading-argmax-argmin-from-graphs": drawing(
    pane(0, [0, 4, 1], [0, 6, 1], 6, 5, "x", "L")
      .f((x) => x * x * x - 6 * x * x + 9 * x + 1, 0.5, 3.5, "result")
      .path(
        [
          [1, 5],
          [1, 0],
        ],
        "action",
        true,
      )
      .path(
        [
          [3, 1],
          [3, 0],
        ],
        "action",
        true,
      )
      .dot(1, 5, "(1, 5)", "n", "action")
      .dot(3, 1, "(3, 1)", "se", "action")
      .marks(),
    "For example, L(x) = x³ − 6x² + 9x + 1 on [0.5, 3.5]. The highest point is (1, 5) and the lowest is (3, 1). Following the dashed lines down to the horizontal axis reads argmax L = 1 and argmin L = 3, while the heights 5 and 1 are the maximum and the minimum values.",
    "例如，[0.5, 3.5] 上的 L(x) = x³ − 6x² + 9x + 1。最高点是 (1, 5)，最低点是 (3, 1)。沿虚线向下到横轴，读出 argmax L = 1 和 argmin L = 3，而高度 5 和 1 是最大值和最小值。",
  ),
};
