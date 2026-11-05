import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { mc, sketchFigure, spec, spr, words } from "../exam.ts";
import { altitudeFigure, anglePts, polyFigure, rightPts, twoTrianglesFigure } from "../exam-figures.ts";

// SAT Math Prep, Geometry and Trigonometry: surface area and volume, congruence and similarity, and trigonometry.

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
] as const;

const trigFig = (a: string, b: string, c: string) =>
  sketchFigure(
    {
      segs: [
        [60, 40, 60, 200],
        [60, 200, 270, 200],
        [270, 200, 60, 40],
        [60, 186, 74, 186],
        [74, 186, 74, 200],
      ],
      labels: [
        [60, 30, "A"],
        [48, 214, "C"],
        [282, 214, "B"],
        [40, 124, a],
        [165, 222, b],
        [178, 108, c],
      ],
    },
    t(
      `A right triangle ABC with the right angle at C, where BC is ${a}, AC is ${b} and AB is ${c}.`,
      `直角三角形 ABC，直角在 C，BC 为 ${a}，AC 为 ${b}，AB 为 ${c}。`,
    ),
  );

/** satExamGeometry2 are the exam-style questions on surface area and volume, congruence and similarity, and trigonometry. */
export const satExamGeometry2: ExamSpec[] = [
  spec("Volumes of Right Rectangular Prisms", "长方体的体积", ["volumes-of-right-rectangular-prisms"], (rng, hard) => {
    const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 10)];
    if (!hard)
      return mc(
        rng,
        t(
          `A right rectangular prism has dimensions $${l}$, $${w}$ and $${h}$. What is its volume?`,
          `长方体的长、宽、高为 $${l}$、$${w}$、$${h}$。它的体积是多少？`,
        ),
        l * w * h,
        [2 * (l * w + l * h + w * h), l + w + h, l * w + h],
        t(`Multiply the three dimensions: $${l * w * h}$.`, `三个尺寸相乘：$${l * w * h}$。`),
      );
    return spr(
      t(
        `A right rectangular prism has volume $${l * w * h}$, length $${l}$ and width $${w}$. What is its height?`,
        `长方体的体积为 $${l * w * h}$，长 $${l}$，宽 $${w}$。它的高是多少？`,
      ),
      h,
      [l * w, l * h, h + 1],
      t(`Divide the volume by the base area $${l * w}$: $${h}$.`, `体积除以底面积 $${l * w}$：$${h}$。`),
    );
  }),
  spec("Surface Areas of Right Rectangular Prisms", "长方体的表面积", ["surface-areas-of-rectangular-solids"], (rng, hard) => {
    const [l, w, h] = [rng.int(2, 15), rng.int(2, 12), rng.int(2, 10)];
    const sa = 2 * (l * w + l * h + w * h);
    if (!hard)
      return mc(
        rng,
        t(
          `A right rectangular prism has dimensions $${l}$, $${w}$ and $${h}$. What is its surface area?`,
          `长方体的长、宽、高为 $${l}$、$${w}$、$${h}$。它的表面积是多少？`,
        ),
        sa,
        [l * w * h, sa / 2, sa + 2 * l * w],
        t(
          `There are three pairs of faces: $2(${l * w} + ${l * h} + ${w * h}) = ${sa}$.`,
          `有三对面：$2(${l * w} + ${l * h} + ${w * h}) = ${sa}$。`,
        ),
      );
    return spr(
      t(
        `A right rectangular prism has surface area $${sa}$, length $${l}$ and width $${w}$. What is its height?`,
        `长方体的表面积为 $${sa}$，长 $${l}$，宽 $${w}$。它的高是多少？`,
      ),
      h,
      [l + w, h + 1, sa - l * w],
      t(
        `$2(${l * w}) + 2(${l + w})h = ${sa}$, so $${2 * (l + w)}h = ${sa - 2 * l * w}$ and $h = ${h}$.`,
        `$2(${l * w}) + 2(${l + w})h = ${sa}$，所以 $${2 * (l + w)}h = ${sa - 2 * l * w}$，$h = ${h}$。`,
      ),
    );
  }),
  spec("Volumes and Surface Areas of Cubes", "正方体的体积和表面积", ["surface-areas-of-cubes"], (rng, hard) => {
    const s = rng.int(2, 30);
    if (!hard)
      return mc(
        rng,
        t(`A cube has edge length $${s}$. What is its surface area?`, `正方体的棱长为 $${s}$。它的表面积是多少？`),
        6 * s * s,
        [s ** 3, 4 * s * s, 12 * s],
        t(`Six square faces: $6(${s * s}) = ${6 * s * s}$.`, `六个正方形面：$6(${s * s}) = ${6 * s * s}$。`),
      );
    return spr(
      t(`A cube has surface area $${6 * s * s}$. What is its volume?`, `正方体的表面积为 $${6 * s * s}$。它的体积是多少？`),
      s ** 3,
      [s * s, 6 * s, s ** 3 + s],
      t(
        `Each face has area $${s * s}$, so the edge is $${s}$ and the volume is $${s ** 3}$.`,
        `每个面的面积为 $${s * s}$，所以棱长为 $${s}$，体积为 $${s ** 3}$。`,
      ),
    );
  }),
  spec("Volumes of Cylinders", "圆柱的体积", ["volumes-of-cylinders"], (rng, hard) => {
    const [r, h] = [rng.int(2, 12), rng.int(2, 15)];
    if (!hard)
      return mc(
        rng,
        t(
          `A right circular cylinder has radius $${r}$ and height $${h}$. What is its volume?`,
          `圆柱的半径为 $${r}$，高为 $${h}$。它的体积是多少？`,
        ),
        `${r * r * h}\\pi`,
        [`${2 * r * h}\\pi`, `${r * h}\\pi`, `${4 * r * r * h}\\pi`, `${r * r * h + 1}\\pi`],
        t(`$V = \\pi r^2h = ${r * r * h}\\pi$.`, `$V = \\pi r^2h = ${r * r * h}\\pi$。`),
      );
    return spr(
      t(
        `A right circular cylinder has volume $${r * r * h}\\pi$ and height $${h}$. What is its radius?`,
        `圆柱的体积为 $${r * r * h}\\pi$，高为 $${h}$。它的半径是多少？`,
      ),
      r,
      [r * r, 2 * r, r * h],
      t(
        `$r^2 = \\frac{${r * r * h}}{${h}} = ${r * r}$, so $r = ${r}$.`,
        `$r^2 = \\frac{${r * r * h}}{${h}} = ${r * r}$，所以 $r = ${r}$。`,
      ),
    );
  }),
  spec(
    "Volumes of Cylinders: Word Problems",
    "圆柱体积应用题",
    ["solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres"],
    (rng, hard) => {
      const [r, h, c] = [rng.int(2, 10), rng.int(3, 12), rng.int(2, 9)];
      if (!hard)
        return mc(
          rng,
          t(
            `A cylindrical can has diameter $${2 * r}$ inches and height $${h}$ inches. What is its volume, in cubic inches?`,
            `一个圆柱形罐子直径 $${2 * r}$ 英寸，高 $${h}$ 英寸。它的体积是多少立方英寸？`,
          ),
          `${r * r * h}\\pi`,
          [`${4 * r * r * h}\\pi`, `${2 * r * h}\\pi`, `${r * h}\\pi`, `${2 * r * r * h}\\pi`],
          t(
            `The radius is half the diameter, $${r}$, so $V = ${r * r * h}\\pi$.`,
            `半径是直径的一半，为 $${r}$，所以 $V = ${r * r * h}\\pi$。`,
          ),
        );
      return spr(
        t(
          `A cylindrical tank of radius $${r}$ feet holds water to a depth of $${h}$ feet. After $${c * r * r}\\pi$ cubic feet more water is added, what is the depth of the water, in feet?`,
          `半径 $${r}$ 英尺的圆柱形水箱中水深 $${h}$ 英尺。再加入 $${c * r * r}\\pi$ 立方英尺水后，水深是多少英尺？`,
        ),
        h + c,
        [c, h, h + c * r],
        t(
          `The added water raises the depth by $\\frac{${c * r * r}\\pi}{${r * r}\\pi} = ${c}$, so the depth is $${h + c}$.`,
          `加入的水使水深增加 $\\frac{${c * r * r}\\pi}{${r * r}\\pi} = ${c}$，所以水深为 $${h + c}$。`,
        ),
      );
    },
  ),
  spec("Volumes of Spheres", "球的体积", ["volumes-of-spheres"], (rng, hard) => {
    const r = rng.int(2, 30);
    const v = Q.of(4 * r ** 3, 3).toLatex();
    if (!hard)
      return mc(
        rng,
        t(`A sphere has radius $${r}$. What is its volume?`, `球的半径为 $${r}$。它的体积是多少？`),
        `${v}\\pi`,
        [`${4 * r * r}\\pi`, `${r ** 3}\\pi`, `${Q.of(4 * r * r, 3).toLatex()}\\pi`, `${2 * r ** 3}\\pi`],
        t(`$V = \\frac{4}{3}\\pi r^3 = ${v}\\pi$.`, `$V = \\frac{4}{3}\\pi r^3 = ${v}\\pi$。`),
      );
    return spr(
      t(`A sphere has volume $${v}\\pi$. What is its radius?`, `球的体积为 $${v}\\pi$。它的半径是多少？`),
      r,
      [r * r, 2 * r, r + 3],
      t(
        `$\\frac{4}{3}r^3 = ${v}$ gives $r^3 = ${r ** 3}$, so $r = ${r}$.`,
        `$\\frac{4}{3}r^3 = ${v}$ 得 $r^3 = ${r ** 3}$，所以 $r = ${r}$。`,
      ),
    );
  }),
  spec("Volumes of Cones", "圆锥的体积", ["volumes-of-right-cones"], (rng, hard) => {
    const [r, h] = [rng.int(2, 12), rng.int(1, 8) * 3];
    if (!hard)
      return mc(
        rng,
        t(
          `A right circular cone has radius $${r}$ and height $${h}$. What is its volume?`,
          `圆锥的半径为 $${r}$，高为 $${h}$。它的体积是多少？`,
        ),
        `${(r * r * h) / 3}\\pi`,
        [`${r * r * h}\\pi`, `${2 * r * h}\\pi`, `${(r * h) / 3}\\pi`, `${(r * r * h) / 3 + 1}\\pi`],
        t(`$V = \\frac{1}{3}\\pi r^2h = ${(r * r * h) / 3}\\pi$.`, `$V = \\frac{1}{3}\\pi r^2h = ${(r * r * h) / 3}\\pi$。`),
      );
    return spr(
      t(
        `A right circular cone has volume $${(r * r * h) / 3}\\pi$ and radius $${r}$. What is its height?`,
        `圆锥的体积为 $${(r * r * h) / 3}\\pi$，半径为 $${r}$。它的高是多少？`,
      ),
      h,
      [h / 3, 3 * h, r * h],
      t(
        `$\\frac{1}{3}(${r * r})h = ${(r * r * h) / 3}$, so $h = ${h}$.`,
        `$\\frac{1}{3}(${r * r})h = ${(r * r * h) / 3}$，所以 $h = ${h}$。`,
      ),
    );
  }),
  spec("Volumes of Composite Solids", "组合体的体积", ["volumes-of-right-cones"], (rng, hard) => {
    const [r, h, k] = [rng.int(2, 9), rng.int(2, 12), rng.int(1, 5) * 3];
    if (!hard)
      return mc(
        rng,
        t(
          `A solid is made of a cylinder of radius $${r}$ and height $${h}$ with a cone of the same radius and height $${k}$ on top. What is the total volume?`,
          `一个立体由半径 $${r}$、高 $${h}$ 的圆柱和其上半径相同、高 $${k}$ 的圆锥组成。总体积是多少？`,
        ),
        `${r * r * (h + k / 3)}\\pi`,
        [`${r * r * (h + k)}\\pi`, `${r * r * h}\\pi`, `${(r * r * k) / 3}\\pi`, `${r * r * (h + k / 3) + r}\\pi`],
        t(
          `Add $${r * r * h}\\pi$ for the cylinder and $${(r * r * k) / 3}\\pi$ for the cone.`,
          `圆柱 $${r * r * h}\\pi$ 加圆锥 $${(r * r * k) / 3}\\pi$。`,
        ),
      );
    const [a, b] = [rng.int(3, 15), rng.int(1, 2)];
    return spr(
      t(
        `A cube of edge $${a + b + 1}$ has a smaller cube of edge $${a}$ removed from one corner. What is the volume of the remaining solid?`,
        `棱长 $${a + b + 1}$ 的正方体从一角切去棱长 $${a}$ 的小正方体。剩余立体的体积是多少？`,
      ),
      (a + b + 1) ** 3 - a ** 3,
      [(a + b + 1) ** 3, (b + 1) ** 3, (a + b + 1) ** 3 + a ** 3],
      t(
        `Subtract: $${(a + b + 1) ** 3} - ${a ** 3} = ${(a + b + 1) ** 3 - a ** 3}$.`,
        `相减：$${(a + b + 1) ** 3} - ${a ** 3} = ${(a + b + 1) ** 3 - a ** 3}$。`,
      ),
    );
  }),
  spec(
    "Constructing Functions Representing Surface Area and Volume",
    "构造表示表面积和体积的函数",
    ["constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids"],
    (rng, hard) => {
      const [d, k] = [rng.int(2, 30), rng.int(2, 30)];
      if (!hard)
        return mc(
          rng,
          t(
            `A cylinder has radius $x$ and height $${d}$ more than its radius. Which function gives its volume?`,
            `圆柱半径为 $x$，高比半径多 $${d}$。哪个函数给出它的体积？`,
          ),
          `V(x) = \\pi x^2(x + ${d})`,
          [`V(x) = \\pi x(x + ${d})`, `V(x) = 2\\pi x(x + ${d})`, `V(x) = \\pi x^2 + ${d}`, `V(x) = \\frac{1}{3}\\pi x^2(x + ${d})`],
          t(`Base area $\\pi x^2$ times height $x + ${d}$.`, `底面积 $\\pi x^2$ 乘高 $x + ${d}$。`),
        );
      return mc(
        rng,
        t(
          `A box has a square base of side $x$ and height $${k}$, and no top. Which function gives its outside surface area?`,
          `一个无盖盒子底面是边长 $x$ 的正方形，高 $${k}$。哪个函数给出它的外表面积？`,
        ),
        `S(x) = x^2 + ${4 * k}x`,
        [`S(x) = 2x^2 + ${4 * k}x`, `S(x) = ${k}x^2`, `S(x) = x^2 + ${k}x`, `S(x) = 6x^2`],
        t(`One base plus four sides, each of area $${k}x$.`, `一个底面加四个侧面，每个侧面面积为 $${k}x$。`),
      );
    },
  ),
  spec(
    "Surface Areas of Combined Rectangular Prisms",
    "组合长方体的表面积",
    ["surface-areas-of-combined-rectangular-prisms"],
    (rng, hard) => {
      const s = rng.int(2, 30);
      const n = rng.int(3, 6);
      if (!hard)
        return mc(
          rng,
          t(
            `Two cubes of edge $${s}$ are glued face to face. What is the surface area of the resulting solid?`,
            `两个棱长 $${s}$ 的正方体面对面粘在一起。所得立体的表面积是多少？`,
          ),
          10 * s * s,
          [12 * s * s, 8 * s * s, 6 * s * s],
          t(
            `The two glued faces disappear, so $10$ faces of area $${s * s}$ remain.`,
            `粘合的两个面消失，所以剩下 $10$ 个面积为 $${s * s}$ 的面。`,
          ),
        );
      return spr(
        t(
          `$${n}$ cubes of edge $${s}$ are glued in a row, face to face. What is the surface area of the resulting solid?`,
          `$${n}$ 个棱长 $${s}$ 的正方体面对面粘成一排。所得立体的表面积是多少？`,
        ),
        (4 * n + 2) * s * s,
        [6 * n * s * s, 4 * n * s * s, (4 * n + 2) * s],
        t(
          `The row has $${4 * n}$ side faces and $2$ end faces, for $${4 * n + 2}$ faces of area $${s * s}$.`,
          `这一排有 $${4 * n}$ 个侧面和 $2$ 个端面，共 $${4 * n + 2}$ 个面积为 $${s * s}$ 的面。`,
        ),
      );
    },
  ),
  spec("Congruent Triangles", "全等三角形", ["solving-problems-describing-congruent-triangles"], (rng, hard) => {
    const [a, b, x, c] = [rng.int(25, 70), rng.int(30, 75), rng.int(4, 20), rng.int(1, 9)];
    if (!hard)
      return mc(
        rng,
        t(
          `Triangle $ABC$ is congruent to triangle $DEF$, with angle $A$ corresponding to angle $D$ and angle $B$ to angle $E$. If angle $A$ is $${a}^\\circ$ and angle $E$ is $${b}^\\circ$, what is the measure of angle $F$, in degrees?`,
          `三角形 $ABC$ 与三角形 $DEF$ 全等，$\\angle A$ 对应 $\\angle D$，$\\angle B$ 对应 $\\angle E$。若 $\\angle A = ${a}^\\circ$，$\\angle E = ${b}^\\circ$，则 $\\angle F$ 是多少度？`,
        ),
        180 - a - b,
        [a, b, a + b],
        t(
          `Angle $D$ matches $A$, so it is $${a}^\\circ$. Then $F = 180 - ${a} - ${b} = ${180 - a - b}$.`,
          `$\\angle D$ 对应 $\\angle A$，为 $${a}^\\circ$。于是 $\\angle F = 180 - ${a} - ${b} = ${180 - a - b}$。`,
        ),
        twoTrianglesFigure(
          anglePts(a, b),
          { v: ["A", "B", "C"], a: [`${a}°`, null, null] },
          { v: ["D", "E", "F"], a: [null, `${b}°`, "?"] },
        ),
      );
    return spr(
      t(
        `Triangle $ABC$ is congruent to triangle $DEF$, with $A$, $B$, $C$ corresponding to $D$, $E$, $F$. If $AB = 2x + ${c}$ and $DE = ${2 * x + c}$, what is the value of $x$?`,
        `三角形 $ABC$ 与三角形 $DEF$ 全等，$A$、$B$、$C$ 对应 $D$、$E$、$F$。若 $AB = 2x + ${c}$，$DE = ${2 * x + c}$，则 $x$ 的值是多少？`,
      ),
      x,
      [2 * x + c, 2 * x, x + c],
      t(
        `Corresponding sides are equal: $2x + ${c} = ${2 * x + c}$, so $x = ${x}$.`,
        `对应边相等：$2x + ${c} = ${2 * x + c}$，所以 $x = ${x}$。`,
      ),
      twoTrianglesFigure(
        anglePts(55, 65),
        { v: ["A", "B", "C"], s: [`2x + ${c}`, null, null] },
        { v: ["D", "E", "F"], s: [`${2 * x + c}`, null, null] },
      ),
    );
  }),
  spec(
    "Finding Corresponding Angles in Similar Shapes",
    "求相似图形的对应角",
    ["side-lengths-and-angle-measures-of-similar-polygons"],
    (rng, hard) => {
      const [a, b, k] = [rng.int(25, 75), rng.int(30, 70), rng.int(2, 6)];
      if (!hard)
        return mc(
          rng,
          t(
            `Triangle $ABC$ is similar to triangle $XYZ$, with $A$ corresponding to $X$ and $B$ to $Y$. If angle $A$ is $${a}^\\circ$ and angle $Y$ is $${b}^\\circ$, what is angle $C$, in degrees?`,
            `三角形 $ABC$ 与三角形 $XYZ$ 相似，$A$ 对应 $X$，$B$ 对应 $Y$。若 $\\angle A = ${a}^\\circ$，$\\angle Y = ${b}^\\circ$，则 $\\angle C$ 是多少度？`,
          ),
          180 - a - b,
          [a, b, a + b],
          t(
            `Angle $B$ equals angle $Y$, so $C = 180 - ${a} - ${b} = ${180 - a - b}$.`,
            `$\\angle B = \\angle Y$，所以 $\\angle C = 180 - ${a} - ${b} = ${180 - a - b}$。`,
          ),
        );
      return spr(
        t(
          `Triangle $ABC$ is similar to triangle $XYZ$, with $A$ corresponding to $X$. The side lengths of $XYZ$ are $${k}$ times those of $ABC$. If angle $A$ is $${a}^\\circ$, what is angle $X$, in degrees?`,
          `三角形 $ABC$ 与三角形 $XYZ$ 相似，$A$ 对应 $X$。$XYZ$ 的边长是 $ABC$ 的 $${k}$ 倍。若 $\\angle A = ${a}^\\circ$，则 $\\angle X$ 是多少度？`,
        ),
        a,
        [k * a, a + k, 180 - a],
        t(`Scaling lengths does not change angles, so angle $X$ is $${a}^\\circ$.`, `缩放长度不改变角度，所以 $\\angle X = ${a}^\\circ$。`),
      );
    },
  ),
  spec(
    "Finding Corresponding Lengths in Similar Shapes",
    "求相似图形的对应长度",
    ["side-lengths-and-angle-measures-of-similar-polygons"],
    (rng, hard) => {
      const [a, b, k] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 6)];
      if (!hard)
        return mc(
          rng,
          t(
            `Rectangle $P$ is similar to rectangle $Q$. Rectangle $P$ measures $${a}$ by $${b}$, and the side of $Q$ that corresponds to the side of length $${a}$ is $${k * a}$. What is the other side of $Q$?`,
            `矩形 $P$ 与矩形 $Q$ 相似。$P$ 为 $${a}$ 乘 $${b}$，$Q$ 中与长为 $${a}$ 的边对应的边长为 $${k * a}$。$Q$ 的另一条边是多少？`,
          ),
          k * b,
          [b, k * a + b, b + k * a - a],
          t(
            `The scale factor is $${k}$, so the other side is $${k}(${b}) = ${k * b}$.`,
            `比例因子是 $${k}$，所以另一条边为 $${k}(${b}) = ${k * b}$。`,
          ),
          twoTrianglesFigure(
            [
              [0, 0],
              [a / b, 0],
              [a / b, 1],
              [0, 1],
            ],
            { s: [`${a}`, `${b}`, null, null] },
            { s: [`${k * a}`, "?", null, null] },
            1.5,
          ),
        );
      return spr(
        t(
          `Triangles $T$ and $U$ are similar. Two corresponding sides measure $${a}$ and $${k * a}$. The perimeter of $T$ is $${3 * a + b}$. What is the perimeter of $U$?`,
          `三角形 $T$ 和 $U$ 相似。两条对应边为 $${a}$ 和 $${k * a}$。$T$ 的周长为 $${3 * a + b}$。$U$ 的周长是多少？`,
        ),
        k * (3 * a + b),
        [3 * a + b + k, k * k * (3 * a + b), 3 * a + b],
        t(`Perimeters scale by the same factor as lengths, $${k}$.`, `周长与长度按相同的比例缩放，为 $${k}$。`),
      );
    },
  ),
  spec("Solving Problems With Similar Triangles", "用相似三角形解题", ["reasoning-about-similar-triangles"], (rng, hard) => {
    const [a, b, k] = [rng.int(2, 10), rng.int(2, 10), rng.int(2, 5)];
    const fig = sketchFigure(
      {
        segs: [
          [160, 30, 40, 210],
          [160, 30, 280, 210],
          [40, 210, 280, 210],
          [120, 90, 200, 90],
        ],
        labels: [
          [160, 22, "A"],
          [108, 90, "D"],
          [212, 90, "E"],
          [28, 222, "B"],
          [292, 222, "C"],
        ],
      },
      t("Triangle ABC with segment DE parallel to BC, D on AB and E on AC.", "三角形 ABC，线段 DE 平行于 BC，D 在 AB 上，E 在 AC 上。"),
    );
    if (!hard)
      return mc(
        rng,
        t(
          `In the figure, $\\overline{DE}$ is parallel to $\\overline{BC}$. If $AD = ${a}$, $AB = ${k * a}$ and $DE = ${b}$, what is $BC$?`,
          `图中 $\\overline{DE}$ 平行于 $\\overline{BC}$。若 $AD = ${a}$，$AB = ${k * a}$，$DE = ${b}$，则 $BC$ 是多少？`,
        ),
        k * b,
        [b + (k - 1) * a, k * a + b, b],
        t(
          `Triangles $ADE$ and $ABC$ are similar with factor $${k}$, so $BC = ${k * b}$.`,
          `三角形 $ADE$ 与 $ABC$ 相似，比例因子为 $${k}$，所以 $BC = ${k * b}$。`,
        ),
        fig,
      );
    return spr(
      t(
        `In the figure, $\\overline{DE}$ is parallel to $\\overline{BC}$. If $AD = ${a}$, $DB = ${(k - 1) * a}$ and $BC = ${k * b}$, what is $DE$?`,
        `图中 $\\overline{DE}$ 平行于 $\\overline{BC}$。若 $AD = ${a}$，$DB = ${(k - 1) * a}$，$BC = ${k * b}$，则 $DE$ 是多少？`,
      ),
      b,
      [k * b, (k - 1) * b, k * k * b],
      t(
        `$AB = ${k * a}$, so the factor is $${k}$ and $DE = \\frac{${k * b}}{${k}} = ${b}$.`,
        `$AB = ${k * a}$，比例因子为 $${k}$，所以 $DE = \\frac{${k * b}}{${k}} = ${b}$。`,
      ),
      fig,
    );
  }),
  spec(
    "Further Problem-Solving With Embedded Right Triangles",
    "进一步解嵌入直角三角形问题",
    ["the-aa-similarity-criterion"],
    (rng, hard) => {
      const [p, q] = rng.pick([
        [1, 4],
        [1, 9],
        [4, 9],
        [2, 8],
        [3, 12],
        [1, 16],
        [4, 16],
        [9, 16],
        [3, 27],
        [2, 18],
        [5, 20],
        [2, 32],
        [4, 25],
        [9, 25],
        [16, 25],
        [1, 25],
        [6, 24],
        [8, 18],
        [6, 6],
        [7, 7],
        [3, 3],
        [5, 5],
        [1, 36],
        [4, 36],
        [9, 36],
      ] as const);
      const alt = Math.round(Math.sqrt(p * q));
      if (!hard)
        return spr(
          t(
            `In right triangle $ABC$, the altitude from the right angle at $C$ meets the hypotenuse at $D$, with $AD = ${p}$ and $DB = ${q}$. What is $CD$?`,
            `在直角三角形 $ABC$ 中，从直角顶点 $C$ 作的高交斜边于 $D$，$AD = ${p}$，$DB = ${q}$。$CD$ 是多少？`,
          ),
          alt,
          [p + q, Math.abs(q - p), alt + 1],
          t(
            `The altitude forms similar triangles, so $\\frac{${p}}{CD} = \\frac{CD}{${q}}$ and $CD = \\sqrt{${p * q}} = ${alt}$.`,
            `高构成相似三角形，所以 $\\frac{${p}}{CD} = \\frac{CD}{${q}}$，$CD = \\sqrt{${p * q}} = ${alt}$。`,
          ),
          altitudeFigure(p, q, "?"),
        );
      return spr(
        t(
          `In right triangle $ABC$, the altitude from the right angle at $C$ meets the hypotenuse at $D$, with $AD = ${p}$ and $DB = ${q}$. What is the area of triangle $ABC$?`,
          `在直角三角形 $ABC$ 中，从直角顶点 $C$ 作的高交斜边于 $D$，$AD = ${p}$，$DB = ${q}$。三角形 $ABC$ 的面积是多少？`,
        ),
        Q.of((p + q) * alt, 2),
        [(p + q) * alt, alt * alt, p * q + alt],
        t(
          `The altitude is $\\sqrt{${p * q}} = ${alt}$ and the hypotenuse is $${p + q}$, so the area is half their product.`,
          `高是 $\\sqrt{${p * q}} = ${alt}$，斜边是 $${p + q}$，所以面积是两者之积的一半。`,
        ),
        altitudeFigure(p, q, null),
      );
    },
  ),
  spec("Identifying Information Needed to Determine Similarity", "判断确定相似所需的信息", ["the-aa-similarity-criterion"], (rng, hard) => {
    const [a, b, c] = [rng.int(25, 75), rng.int(30, 70), rng.int(1, 9)];
    if (!hard)
      return words(
        rng,
        t(
          `In triangles $ABC$ and $DEF$, angle $A$ and angle $D$ both measure $${a}^\\circ$. Which additional fact is enough to conclude that the triangles are similar?`,
          `在三角形 $ABC$ 和 $DEF$ 中，$\\angle A$ 和 $\\angle D$ 都是 $${a}^\\circ$。再知道哪个事实就足以断定两个三角形相似？`,
        ),
        t(`Angle $B$ and angle $E$ both measure $${b}^\\circ$.`, `$\\angle B$ 和 $\\angle E$ 都是 $${b}^\\circ$。`),
        [
          t(`$AB = ${c + 2}$ and $DE = ${c + 3}$`, `$AB = ${c + 2}$，$DE = ${c + 3}$`),
          t(`$BC = EF$`, `$BC = EF$`),
          t(`$AC = DF$`, `$AC = DF$`),
        ],
        t(
          `Two pairs of equal corresponding angles establish similarity, so the angle fact is enough.`,
          `两组对应角相等即可确定相似，所以这个角的事实就足够了。`,
        ),
      );
    return words(
      rng,
      t(
        `In triangles $ABC$ and $DEF$, $\\frac{AB}{DE} = \\frac{AC}{DF} = \\frac{${c + 1}}{${b}}$. Which additional fact is enough to conclude that the triangles are similar?`,
        `在三角形 $ABC$ 和 $DEF$ 中，$\\frac{AB}{DE} = \\frac{AC}{DF} = \\frac{${c + 1}}{${b}}$。再知道哪个事实就足以断定两个三角形相似？`,
      ),
      t(`Angle $A$ and angle $D$ both measure $${a}^\\circ$.`, `$\\angle A$ 和 $\\angle D$ 都是 $${a}^\\circ$。`),
      [
        t(`Angle $B$ and angle $F$ both measure $${a}^\\circ$.`, `$\\angle B$ 和 $\\angle F$ 都是 $${a}^\\circ$。`),
        t(`$BC = ${c + 4}$`, `$BC = ${c + 4}$`),
        t(`$AB = ${c + 2}$`, `$AB = ${c + 2}$`),
      ],
      t(
        `Two proportional sides need the included angles to be equal, which is angle $A$ and angle $D$.`,
        `两组成比例的边需要夹角相等，也就是 $\\angle A$ 和 $\\angle D$。`,
      ),
    );
  }),
  spec("Relating Length and Area in Similar Shapes", "相似图形的长度与面积", ["areas-of-similar-polygons"], (rng, hard) => {
    const [a, k] = [rng.int(2, 30), rng.int(2, 6)];
    if (!hard)
      return mc(
        rng,
        t(
          `Two similar polygons have corresponding sides in a ratio of $1$ to $${k}$. The smaller has area $${a}$. What is the area of the larger?`,
          `两个相似多边形的对应边之比为 $1$ 比 $${k}$。较小者面积为 $${a}$。较大者面积是多少？`,
        ),
        k * k * a,
        [k * a, k ** 3 * a, a + k],
        t(
          `Area scales by the square of the length factor: $${k * k}(${a}) = ${k * k * a}$.`,
          `面积按长度比例的平方缩放：$${k * k}(${a}) = ${k * k * a}$。`,
        ),
      );
    return spr(
      t(
        `Two similar triangles have areas $${a}$ and $${k * k * a}$. The shortest side of the smaller is $${a + 1}$. What is the shortest side of the larger?`,
        `两个相似三角形的面积为 $${a}$ 和 $${k * k * a}$。较小者的最短边为 $${a + 1}$。较大者的最短边是多少？`,
      ),
      k * (a + 1),
      [k * k * (a + 1), a + 1 + k, (k + 1) * (a + 1)],
      t(
        `The area ratio is $${k * k}$, so the length factor is $${k}$ and the side is $${k * (a + 1)}$.`,
        `面积比是 $${k * k}$，所以长度比例是 $${k}$，边长为 $${k * (a + 1)}$。`,
      ),
      twoTrianglesFigure(anglePts(50, 70), { s: [null, `${a + 1}`, null] }, { s: [null, "?", null] }, 1.6),
    );
  }),
  spec(
    "Length, Surface Area, and Volume in Similar Solids",
    "相似立体的长度、表面积和体积",
    ["surface-areas-and-volumes-of-similar-solids"],
    (rng, hard) => {
      const [v, k] = [rng.int(2, 30), rng.int(2, 5)];
      if (!hard)
        return mc(
          rng,
          t(
            `Two similar solids have corresponding edges in a ratio of $1$ to $${k}$. The smaller has volume $${v}$. What is the volume of the larger?`,
            `两个相似立体的对应棱之比为 $1$ 比 $${k}$。较小者体积为 $${v}$。较大者体积是多少？`,
          ),
          k ** 3 * v,
          [k * k * v, k * v, 3 * k * v],
          t(
            `Volume scales by the cube of the length factor: $${k ** 3}(${v}) = ${k ** 3 * v}$.`,
            `体积按长度比例的立方缩放：$${k ** 3}(${v}) = ${k ** 3 * v}$。`,
          ),
        );
      return spr(
        t(
          `Two similar solids have volumes $${v}$ and $${k ** 3 * v}$. The smaller has surface area $${v + 2}$. What is the surface area of the larger?`,
          `两个相似立体的体积为 $${v}$ 和 $${k ** 3 * v}$。较小者表面积为 $${v + 2}$。较大者表面积是多少？`,
        ),
        k * k * (v + 2),
        [k ** 3 * (v + 2), k * (v + 2), v + 2 + k],
        t(`The length factor is $${k}$, so surface area scales by $${k * k}$.`, `长度比例是 $${k}$，所以表面积按 $${k * k}$ 缩放。`),
      );
    },
  ),
  spec("Trigonometric Ratios in Right Triangles", "直角三角形中的三角比", ["the-trigonometric-ratios"], (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const s = rng.int(1, 6);
    const fig = trigFig(`${p * s}`, `${q * s}`, `${c * s}`);
    const fr = (a: number, b: number) => `\\frac{${a}}{${b}}`;
    if (!hard)
      return mc(
        rng,
        t(`In right triangle $ABC$ shown, what is the value of $\\sin A$?`, `在图示直角三角形 $ABC$ 中，$\\sin A$ 的值是多少？`),
        fr(p, c),
        [fr(q, c), fr(p, q), fr(q, p), fr(c, p)],
        t(
          `The side opposite $A$ is $${p * s}$ and the hypotenuse is $${c * s}$, which reduces to $${fr(p, c)}$.`,
          `$A$ 的对边是 $${p * s}$，斜边是 $${c * s}$，约分得 $${fr(p, c)}$。`,
        ),
        fig,
      );
    return mc(
      rng,
      t(`In right triangle $ABC$ shown, what is the value of $\\tan B$?`, `在图示直角三角形 $ABC$ 中，$\\tan B$ 的值是多少？`),
      fr(q, p),
      [fr(p, q), fr(q, c), fr(p, c), fr(c, q)],
      t(
        `From $B$, the opposite side is $${q * s}$ and the adjacent side is $${p * s}$, which reduces to $${fr(q, p)}$.`,
        `从 $B$ 看，对边是 $${q * s}$，邻边是 $${p * s}$，约分得 $${fr(q, p)}$。`,
      ),
      fig,
    );
  }),
  spec(
    "Calculating Lengths and Areas Using Trigonometry",
    "用三角函数计算长度和面积",
    ["calculating-side-lengths-of-right-triangles-using-trigonometry"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const s = rng.int(1, 6);
      if (!hard)
        return mc(
          rng,
          t(
            `In a right triangle, the hypotenuse has length $${c * s}$ and $\\sin A = \\frac{${p}}{${c}}$. What is the length of the side opposite angle $A$?`,
            `直角三角形的斜边长 $${c * s}$，$\\sin A = \\frac{${p}}{${c}}$。$\\angle A$ 的对边长是多少？`,
          ),
          p * s,
          [q * s, (c - p) * s, p * s + 1],
          t(
            `Opposite equals hypotenuse times sine: $${c * s} \\cdot \\frac{${p}}{${c}} = ${p * s}$.`,
            `对边等于斜边乘正弦：$${c * s} \\cdot \\frac{${p}}{${c}} = ${p * s}$。`,
          ),
        );
      return spr(
        t(
          `In a right triangle, the leg adjacent to angle $A$ has length $${q * s}$ and $\\tan A = \\frac{${p}}{${q}}$. What is the area of the triangle?`,
          `直角三角形中，$\\angle A$ 的邻边长 $${q * s}$，$\\tan A = \\frac{${p}}{${q}}$。三角形的面积是多少？`,
        ),
        (p * q * s * s) / 2,
        [p * q * s * s, (p + q) * s, c * q * s * s],
        t(
          `The opposite leg is $${q * s} \\cdot \\frac{${p}}{${q}} = ${p * s}$, so the area is $\\frac{1}{2}(${p * s})(${q * s})$.`,
          `对边是 $${q * s} \\cdot \\frac{${p}}{${q}} = ${p * s}$，所以面积为 $\\frac{1}{2}(${p * s})(${q * s})$。`,
        ),
      );
    },
  ),
  spec(
    "Calculating Trigonometric Ratios Using the Pythagorean Theorem",
    "用勾股定理计算三角比",
    ["calculating-trigonometric-ratios-from-descriptions"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const s = rng.int(2, 7);
      if (!hard)
        return mc(
          rng,
          t(
            `In right triangle $ABC$ with right angle at $C$, $AC = ${q * s}$ and $BC = ${p * s}$. What is $\\cos A$?`,
            `在直角三角形 $ABC$ 中，$C$ 是直角，$AC = ${q * s}$，$BC = ${p * s}$。$\\cos A$ 是多少？`,
          ),
          `\\frac{${q}}{${c}}`,
          [`\\frac{${p}}{${c}}`, `\\frac{${p}}{${q}}`, `\\frac{${c}}{${q}}`, `\\frac{${q}}{${p}}`],
          t(`The hypotenuse is $${c * s}$, and the side adjacent to $A$ is $${q * s}$.`, `斜边是 $${c * s}$，$A$ 的邻边是 $${q * s}$。`),
        );
      return spr(
        t(
          `In a right triangle, $\\sin A = \\frac{${p * s}}{${c * s}}$ for an acute angle $A$. What is the value of $\\cos A$?`,
          `在直角三角形中，锐角 $A$ 满足 $\\sin A = \\frac{${p * s}}{${c * s}}$。$\\cos A$ 的值是多少？`,
        ),
        Q.of(q, c),
        [Q.of(p, c), Q.of(p, q), Q.of(q, p)],
        t(
          `The sine reduces to $\\frac{${p}}{${c}}$, so take a triangle with opposite side $${p}$ and hypotenuse $${c}$. The adjacent side is $${q}$, so $\\cos A = \\frac{${q}}{${c}}$.`,
          `取对边 $${p}$、斜边 $${c}$ 的三角形。邻边是 $${q}$，所以 $\\cos A = \\frac{${q}}{${c}}$。`,
        ),
      );
    },
  ),
  spec(
    "Cofunction Relationships and Identities",
    "余函数关系和恒等式",
    ["trigonometric-functions-of-complementary-angles"],
    (rng, hard) => {
      const a0 = rng.int(10, 80);
      // At 45 degrees the sine and cosine coincide, so two options would be correct.
      const a = a0 === 45 ? 40 : a0;
      const x = rng.int(3, 29);
      if (!hard)
        return mc(
          rng,
          t(`If $\\sin ${a}^\\circ = k$, which expression also equals $k$?`, `若 $\\sin ${a}^\\circ = k$，哪个式子也等于 $k$？`),
          `\\cos ${90 - a}^\\circ`,
          [`\\cos ${a}^\\circ`, `\\sin ${90 - a}^\\circ`, `\\tan ${a}^\\circ`, `\\cos ${180 - a}^\\circ`],
          t(`Complementary angles swap sine and cosine: $${a} + ${90 - a} = 90$.`, `互余的角交换正弦和余弦：$${a} + ${90 - a} = 90$。`),
        );
      const c = 90 - 3 * x;
      const X = x;
      return spr(
        t(
          `If $\\sin(2x + ${c})^\\circ = \\cos(x)^\\circ$ and the angles are acute, what is the value of $x$?`,
          `若 $\\sin(2x + ${c})^\\circ = \\cos(x)^\\circ$，且这些角都是锐角，则 $x$ 的值是多少？`,
        ),
        X,
        [c, 90 - X, 2 * X + c],
        t(`The angles are complementary: $2x + ${c} + x = 90$, so $x = ${X}$.`, `这两个角互余：$2x + ${c} + x = 90$，所以 $x = ${X}$。`),
      );
    },
  ),
  spec(
    "Relations Between Trigonometric Ratios in Similar Right Triangles",
    "相似直角三角形中三角比的关系",
    ["trigonometric-ratios-in-similar-right-triangles"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(2, 7);
      if (!hard)
        return mc(
          rng,
          t(
            `Right triangles $ABC$ and $DEF$ are similar, with $A$ corresponding to $D$, and $\\sin A = \\frac{${p}}{${c}}$. The sides of $DEF$ are $${k}$ times as long. What is $\\sin D$?`,
            `直角三角形 $ABC$ 与 $DEF$ 相似，$A$ 对应 $D$，$\\sin A = \\frac{${p}}{${c}}$。$DEF$ 的边长是原来的 $${k}$ 倍。$\\sin D$ 是多少？`,
          ),
          `\\frac{${p}}{${c}}`,
          [`\\frac{${k * p}}{${c}}`, `\\frac{${p}}{${k * c}}`, `\\frac{${q}}{${c}}`, `\\frac{${p}}{${q}}`],
          t(`Scaling does not change a ratio of sides, so the sine is unchanged.`, `缩放不改变边的比值，所以正弦不变。`),
        );
      return spr(
        t(
          `Right triangles $ABC$ and $DEF$ are similar, with $A$ corresponding to $D$ and right angles at $C$ and $F$. If $\\tan A = \\frac{${p}}{${q}}$ and $EF = ${k * p}$, what is $DF$?`,
          `直角三角形 $ABC$ 与 $DEF$ 相似，$A$ 对应 $D$，直角在 $C$ 和 $F$。若 $\\tan A = \\frac{${p}}{${q}}$，$EF = ${k * p}$，则 $DF$ 是多少？`,
        ),
        k * q,
        [k * p, k * c, q],
        t(
          `$\\tan D = \\frac{EF}{DF} = \\frac{${p}}{${q}}$, so $DF = ${k * q}$.`,
          `$\\tan D = \\frac{EF}{DF} = \\frac{${p}}{${q}}$，所以 $DF = ${k * q}$。`,
        ),
        twoTrianglesFigure(
          rightPts(q, p),
          { v: ["B", "C", "A"], right: 1 },
          { v: ["E", "F", "D"], s: [`${k * p}`, "?", null], right: 1 },
          1.4,
        ),
      );
    },
  ),
  spec(
    "Problem-Solving Using Trigonometric Ratios in Similar Right Triangles",
    "用相似直角三角形的三角比解题",
    ["trigonometric-ratios-in-similar-right-triangles"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(2, 7);
      if (!hard)
        return spr(
          t(
            `A pole casts a shadow $${q * k}$ feet long, and the sun's rays make an angle $A$ with the ground, where $\\tan A = \\frac{${p}}{${q}}$. How tall is the pole, in feet?`,
            `一根杆子的影子长 $${q * k}$ 英尺，阳光与地面成 $A$ 角，$\\tan A = \\frac{${p}}{${q}}$。杆子多高（英尺）？`,
          ),
          p * k,
          [q * k, c * k, p + k],
          t(
            `Height over shadow equals the tangent: $${q * k} \\cdot \\frac{${p}}{${q}} = ${p * k}$.`,
            `高与影长之比等于正切：$${q * k} \\cdot \\frac{${p}}{${q}} = ${p * k}$。`,
          ),
          polyFigure(rightPts(q, p), { a: [null, null, "A"], s: ["?", `${q * k}`, null], right: 1 }),
        );
      return spr(
        t(
          `In triangles $ABC$ and $DEF$, angles $C$ and $F$ are right angles and angle $A$ equals angle $D$. If $\\cos A = \\frac{${q}}{${c}}$ and $DE = ${k * c}$, what is $EF$?`,
          `在三角形 $ABC$ 和 $DEF$ 中，$\\angle C$、$\\angle F$ 是直角，$\\angle A = \\angle D$。若 $\\cos A = \\frac{${q}}{${c}}$，$DE = ${k * c}$，则 $EF$ 是多少？`,
        ),
        k * p,
        [k * q, k * c, p],
        t(
          `$DF = ${k * q}$ from the cosine, and the Pythagorean theorem gives $EF = ${k * p}$.`,
          `由余弦得 $DF = ${k * q}$，再由勾股定理得 $EF = ${k * p}$。`,
        ),
        polyFigure(rightPts(q, p), { v: ["E", "F", "D"], s: ["?", null, `${k * c}`], right: 1 }),
      );
    },
  ),
  spec(
    "Trigonometric Ratios of Large Special Angles",
    "大特殊角的三角比",
    ["extending-the-trigonometric-ratios-to-large-angles"],
    (rng, hard) => {
      const items = [
        [120, "\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}"],
        [135, "\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{2}}{2}"],
        [150, "\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}"],
        [210, "-\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}"],
        [225, "-\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{2}}{2}"],
        [240, "-\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}"],
        [300, "-\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"],
        [315, "-\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"],
        [330, "-\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"],
      ] as const;
      const [d, sin, cos] = rng.pick(items);
      const k = rng.int(0, 2);
      const shown = d + 360 * k;
      const rest = [
        "\\frac{1}{2}",
        "-\\frac{1}{2}",
        "\\frac{\\sqrt{2}}{2}",
        "-\\frac{\\sqrt{2}}{2}",
        "\\frac{\\sqrt{3}}{2}",
        "-\\frac{\\sqrt{3}}{2}",
      ];
      if (!hard)
        return mc(
          rng,
          t(`What is the value of $\\sin ${shown}^\\circ$?`, `$\\sin ${shown}^\\circ$ 的值是多少？`),
          sin,
          rest.filter((v) => v !== sin),
          t(
            `Find the reference angle and the quadrant of $${d}^\\circ$. Sine is the $y$-coordinate on the unit circle, so the value is $${sin}$.`,
            `找出 $${d}^\\circ$ 的参考角和象限。正弦是单位圆上的纵坐标，所以值为 $${sin}$。`,
          ),
        );
      return mc(
        rng,
        t(`What is the value of $\\cos ${shown}^\\circ$?`, `$\\cos ${shown}^\\circ$ 的值是多少？`),
        cos,
        rest.filter((v) => v !== cos),
        t(
          `Find the reference angle and the quadrant of $${d}^\\circ$. Cosine is the $x$-coordinate on the unit circle, so the value is $${cos}$.`,
          `找出 $${d}^\\circ$ 的参考角和象限。余弦是单位圆上的横坐标，所以值为 $${cos}$。`,
        ),
      );
    },
  ),
];
