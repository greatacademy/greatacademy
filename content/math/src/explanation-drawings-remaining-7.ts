// Drawings of the remaining explanations in the calculus shard: vectors in the plane and in space, conics, matrices as motions, parametric and polar curves, and complex numbers.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { go } from "./explanation-drawings-algebra-kit.ts";
import { tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { cornerMark, dash, fill } from "./explanation-drawings-exam-kit.ts";
import { pt, shift } from "./explanation-drawings-geometry-2.ts";
import { angle, drawing, ellipse, graphed, note, on, ring, seg, square } from "./explanation-drawings-kit.ts";
import { box3, curveMarks, deg3, dot, outline, outlineOn } from "./explanation-drawings-remaining-kit.ts";

const add = (...ps: Point[]): Point => [ps.reduce((a, p) => a + p[0], 0), ps.reduce((a, p) => a + p[1], 0)];
const o: Point = [0, 0];

/** arrows draws the vectors from the origin with a note at each tip. */
const arrows = (
  ...tips: readonly (readonly [Point, string, "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw", ("action" | "result")?])[]
): Mark[] => tips.flatMap(([p, text, dir, s]): Mark[] => [...go(o, p, s), note(p, text, dir)]);

/** hyperbolaArms draws the two arms of a hyperbola with semi-axes a across and b up, or standing upright. */
const hyperbolaArms = (a: number, b: number, upright: boolean): Mark[] => {
  const arm = (sign: number): Point[] =>
    Array.from({ length: 41 }, (_, i) => {
      const t = -1.4 + (2.8 * i) / 40;
      const p: Point = [sign * a * Math.cosh(t), b * Math.sinh(t)];
      return upright ? [p[1], p[0]] : p;
    });
  return [...curveMarks(arm(1)), ...curveMarks(arm(-1))];
};

const u3 = deg3(4, 0, 0);
const v3 = deg3(0, 3.2, 0);
const w3 = deg3(0.6, 0, 3);
const flatU = deg3(4, 0, 0);
const flatV = deg3(1, 3.5, 0);
const up: Point = [0, 3];

/** remainingDrawings7 draws the explanations of the calculus shard about vectors in the plane and in space, conics, matrices as motions, parametric and polar curves, and complex numbers. */
export const remainingDrawings7: Readonly<Record<string, Figure>> = {
  "calculating-the-dot-product-using-angle-and-magnitude#the-angle-from-the-dot-product": drawing(
    [...arrows([[4, 0], "4", "e"], [on(60, 2), "2", "ne"]), angle(o, [1, 0], on(60, 1), "result", "60°")],
    "For example, lengths 4 and 2 with a dot product of 4. Dividing gives cos θ = 4/8 = 1/2, so the colored angle is 60°.",
    "例如，长度为 4 和 2，点积为 4。相除得 cos θ = 4/8 = 1/2，所以标色的角是 60°。",
  ),
  "calculating-the-dot-product-using-components#testing-orthogonality-using-the-dot-product": graphed(
    wide(-3, 5, -1, 5, 99),
    [toward(o, [3, 1]), toward(o, [-1, 3]), cornerMark(o, [3, 1], [-1, 3]), tag([3, 1], "(3, 1)", "e"), tag([-1, 3], "(−1, 3)", "n")],
    "For example, (3, 1) and (−1, 3). The dot product is 3(−1) + 1(3) = 0, and the vectors meet at a right angle.",
    "例如，(3, 1) 和 (−1, 3)。点积是 3(−1) + 1(3) = 0，这两个向量成直角。",
  ),
  "the-angle-between-two-vectors#cosine-formula-for-angle-between-vectors": drawing(
    [...arrows([[4, 0], "(4, 0)", "e"], [[3, 3], "(3, 3)", "ne"]), angle(o, [1, 0], [1, 1], "result", "θ")],
    "For example, (4, 0) and (3, 3). The dot product is 12 and the lengths are 4 and 3√2, so cos θ = 12/(12√2) = √2/2, and the colored angle is 45°.",
    "例如，(4, 0) 和 (3, 3)。点积是 12，长度是 4 和 3√2，所以 cos θ = 12/(12√2) = √2/2，标色的角是 45°。",
  ),
  "the-cross-product-of-two-vectors#geometric-definition-and-magnitude-of-cross-product": drawing(
    [
      ...outline([o, [5, 0], [7, 3], [2, 3]]),
      seg([2, 0], [2, 3], "result", true),
      square([2, 0], [5, 0], [2, 3]),
      angle(o, [1, 0], [2, 3], undefined, "θ"),
      note([2.5, 0], "|u|", "s"),
      note([1, 1.5], "|v|", "nw"),
      note([2, 1.8], "|v| sin θ", "e"),
    ],
    "The parallelogram of u and v, with the angle θ between them. Its colored height is |v| sin θ, so |u| |v| sin θ, the length of u × v, is its base times its height.",
    "u 和 v 构成的平行四边形，它们的夹角是 θ。标色的高是 |v| sin θ，所以 u × v 的长度 |u| |v| sin θ 就是底乘以高。",
  ),
  "the-cross-product-of-two-vectors#direction-of-cross-product-and-orthogonality": drawing(
    arrows([deg3(3, 0, 0), "i", "e"], [deg3(0, 3, 0), "j", "ne"], [deg3(0, 0, 3), "k", "n", "result"]),
    "The basis vectors. i × j is the colored k, perpendicular to both. Going around in the same order, j × k = i and k × i = j.",
    "基向量。i × j 是标色的 k，与两者都垂直。按同样的顺序循环，j × k = i，k × i = j。",
  ),
  "properties-of-the-cross-product#anti-commutativity-and-parallel-vectors": drawing(
    [
      ...arrows([u3, "u", "e"], [v3, "v", "ne"], [up, "u × v", "n", "result"]),
      ...shift(arrows([u3, "u", "e"], [v3, "v", "ne"], [[0, -3], "v × u", "s", "action"]), 7),
    ],
    "Left: u × v, in color, points to one side of the plane of u and v. Right: v × u, in the other color, has the same length and points the opposite way.",
    "左图：标色的 u × v 指向 u 和 v 所在平面的一侧。右图：另一种颜色的 v × u 长度相同，方向相反。",
  ),
  "calculating-the-cross-product-using-determinants#finding-a-vector-orthogonal-to-two-vectors": drawing(
    [
      ...outline([o, flatU, add(flatU, flatV), flatV]),
      ...arrows([flatU, "u", "se"], [flatV, "v", "nw"], [up, "u × v", "n", "result"]),
      square(o, flatU, up),
    ],
    "The colored vector u × v stands perpendicular to the plane of u and v, so it is orthogonal to both of them.",
    "标色的向量 u × v 垂直于 u 和 v 所在的平面，所以与它们都正交。",
  ),
  "calculating-the-cross-product-using-determinants#parallel-vectors-have-zero-cross-product": drawing(
    [
      fill([o, [4, 0], [5.5, 2.5], [1.5, 2.5]], "result"),
      ...arrows([[4, 0], "u", "se"], [[1.5, 2.5], "v", "nw"]),
      ...shift(arrows([[2, 0.75], "u", "n"], [[4, 1.5], "2u", "n", "action"]), 8),
    ],
    "Left: vectors in different directions span a colored area, so the cross product is not zero. Right: when one vector is a multiple of the other, the area vanishes and the cross product is the zero vector.",
    "左图：方向不同的向量张成标色的面积，所以叉积不为零。右图：一个向量是另一个的倍数时，面积为零，叉积是零向量。",
  ),
  "finding-areas-using-the-cross-product#area-of-a-parallelogram-in-3d": drawing(
    [
      fill([o, flatU, add(flatU, flatV), flatV], "result"),
      ...arrows([flatU, "u", "se"], [flatV, "v", "nw"]),
      ...outline([o, flatU, add(flatU, flatV), flatV]),
    ],
    "The parallelogram with adjacent sides u and v, wherever it lies in space. Its colored area equals the length of u × v.",
    "以 u 和 v 为邻边的平行四边形，无论它在空间中的位置如何。标色的面积等于 u × v 的长度。",
  ),
  "finding-areas-using-the-cross-product#area-of-a-triangle-in-3d": drawing(
    [
      fill([o, flatU, flatV], "result"),
      ...outline([o, flatU, flatV]),
      seg(flatU, add(flatU, flatV), undefined, true),
      seg(flatV, add(flatU, flatV), undefined, true),
      note(o, "A", "sw"),
      note(flatU, "B", "se"),
      note(flatV, "C", "nw"),
    ],
    "The triangle ABC in color is half of the parallelogram, completed by the dashed sides, that the vectors from A to B and from A to C form.",
    "标色的三角形 ABC 是平行四边形的一半，这个平行四边形由从 A 到 B、从 A 到 C 的向量构成，用虚线补全。",
  ),
  "finding-areas-using-the-cross-product#the-area-of-a-triangle-in-the-plane": graphed(
    wide(-1, 7, -1, 6, 99),
    [
      ...outlineOn(
        [
          [0, 0],
          [4, 1],
          [1, 3],
        ],
        "result",
      ),
      dash([4, 1], [5, 4]),
      dash([1, 3], [5, 4]),
      pt([4, 1], "(4, 1)", "e"),
      pt([1, 3], "(1, 3)", "nw"),
    ],
    "For example, (4, 1) and (1, 3). Then ad − bc = 4 · 3 − 1 · 1 = 11, and the colored triangle has half of that, 11/2. The dashed sides complete the parallelogram with area 11.",
    "例如，(4, 1) 和 (1, 3)。则 ad − bc = 4 · 3 − 1 · 1 = 11，标色的三角形面积是它的一半，11/2。虚线补全面积为 11 的平行四边形。",
  ),
  "volumes-of-parallelepipeds#volume-of-a-parallelepiped-from-coterminous-vectors": drawing(
    [...box3(u3, v3, w3), ...arrows([u3, "u", "s", "result"], [v3, "v", "nw", "result"], [w3, "w", "nw", "result"])],
    "The box spanned by the three colored vectors u, v and w from one corner. Its volume is the absolute value of their triple product.",
    "由同一顶点出发的三个标色向量 u、v、w 张成的立体。它的体积是三者混合积的绝对值。",
  ),
  "volumes-of-parallelepipeds#volume-of-a-parallelepiped-from-vertices": drawing(
    [...box3(u3, v3, w3), ...arrows([u3, "B", "s", "result"], [v3, "C", "nw", "result"], [w3, "D", "nw", "result"]), note(o, "A", "sw")],
    "The shared vertex A and its neighbors B, C and D. The colored edges are the vectors found by subtracting the coordinates of A.",
    "公共顶点 A 及其相邻顶点 B、C、D。标色的棱是减去 A 的坐标后得到的向量。",
  ),
  "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products#volume-of-a-tetrahedron": drawing(
    [
      ...box3(u3, v3, w3),
      ...arrows([u3, "u", "s", "result"], [v3, "v", "nw", "result"], [w3, "w", "nw", "result"]),
      seg(u3, v3, "result"),
      seg(v3, w3, "result"),
      seg(w3, u3, "result"),
    ],
    "The colored tetrahedron and the parallelepiped spanned by the same three vectors. The tetrahedron has 1/6 of the volume of that box.",
    "标色的四面体，以及由相同三个向量张成的平行六面体。四面体的体积是这个立体的 1/6。",
  ),
  "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products#volume-of-a-pyramid-with-parallelogram-base": drawing(
    [
      seg(o, u3),
      seg(u3, add(u3, v3)),
      seg(add(u3, v3), v3, undefined, true),
      seg(v3, o, undefined, true),
      seg(u3, w3),
      seg(add(u3, v3), w3),
      seg(v3, w3, undefined, true),
      ...arrows([u3, "u", "s"], [v3, "v", "nw"], [w3, "w", "n", "result"]),
    ],
    "A pyramid on the parallelogram of u and v. The colored vector w, from the same corner, locates the apex. Its volume is 1/3 of the base area times the height.",
    "以 u 和 v 的平行四边形为底的棱锥。从同一顶点出发的标色向量 w 确定顶点的位置。它的体积是底面积乘以高的 1/3。",
  ),
  "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products#the-volume-of-a-parallelepiped": drawing(
    [
      ...box3(u3, v3, w3),
      ...arrows([u3, "u", "s"], [v3, "v", "nw"], [w3, "w", "nw", "result"]),
      ...shift(
        [
          ...outline([o, [4, 0], [5.5, 2], [1.5, 2]]),
          ...arrows([[4, 0], "u", "se"], [[1.5, 2], "v", "nw"], [[2.9, 1.2], "w", "e", "action"]),
        ],
        8,
      ),
    ],
    "Left: three vectors span a box with volume. Right: when the vector w, in the other color, lies in the plane of u and v, the box is flat, and the triple product is zero.",
    "左图：三个向量张成有体积的立体。右图：当另一种颜色的向量 w 在 u 和 v 的平面内时，立体是扁平的，混合积为零。",
  ),
  "the-area-of-an-ellipse#scaling-relation-and-missing-semi-axis": drawing(
    [
      ring(1),
      seg(o, [1, 0]),
      note([0.5, 0], "1", "s"),
      ...go([1.8, 0], [3.2, 0], "action"),
      ...shift(
        [...ellipse(o, 3, 2), seg(o, [3, 0], "result"), seg(o, [0, 2], "result"), note([1.5, 0], "3", "s"), note([0, 1], "2", "w")],
        7,
      ),
    ],
    "For example, a = 3 and b = 2. Scaling the unit circle by 3 across and by 2 up gives the ellipse with the colored semi-axes. Its area is π · 3 · 2 = 6π.",
    "例如，a = 3，b = 2。把单位圆横向放大 3 倍、纵向放大 2 倍，得到半轴标色的椭圆。它的面积是 π · 3 · 2 = 6π。",
  ),
  "eccentricity-and-vertices-of-hyperbolas#the-eccentricity-of-a-hyperbola-from-its-asymptotes": drawing(
    [
      seg([-8, -6], [8, 6], undefined, true),
      seg([-8, 6], [8, -6], undefined, true),
      seg([-8, 0], [8, 0]),
      seg([0, -6], [0, 6]),
      ...hyperbolaArms(4, 3, false).slice(0),
      dot([4, 0], "result"),
      dot([-4, 0], "result"),
      note([4, 0], "4", "se"),
      ...shift(
        [
          seg([-8, -6], [8, 6], undefined, true),
          seg([-8, 6], [8, -6], undefined, true),
          seg([-8, 0], [8, 0]),
          seg([0, -6], [0, 6]),
          ...hyperbolaArms(3, 4, true),
          dot([0, 3], "result"),
          dot([0, -3], "result"),
          note([0, 3], "3", "nw"),
        ],
        19,
      ),
    ],
    "For example, the asymptotes y = ±(3/4)x, dashed, with c = 5 in both panels. Left: a horizontal axis with transverse semi-axis 4, so e = 5/4. Right: a vertical axis with transverse semi-axis 3, so e = 5/3.",
    "例如，虚线渐近线 y = ±(3/4)x，两图中都有 c = 5。左图：横轴，实半轴为 4，所以 e = 5/4。右图：纵轴，实半轴为 3，所以 e = 5/3。",
  ),
};
