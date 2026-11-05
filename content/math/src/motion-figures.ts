import type { Figure } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, type PlaneMark, type PlaneView, type Point, plane } from "@ga/subject-math";

/** Motion is how a point or a polygon moves in a solution figure. */
export type Motion =
  /** slide moves it straight, as a translation does. */
  | { readonly kind: "slide" }
  /** turn rotates it by degrees about center, counterclockwise when degrees is positive. */
  | { readonly kind: "turn"; readonly degrees: number; readonly center?: Point; readonly centerName?: string }
  /** flip reflects it across the line through a and b. */
  | { readonly kind: "flip"; readonly a: Point; readonly b: Point }
  /** scale dilates it from center, along the rays from the center. */
  | { readonly kind: "scale"; readonly center?: Point; readonly centerName?: string };

/** viewAround is the smallest window centered on the origin, at least -8 to 8, that shows points with a margin. */
export function viewAround(points: readonly Point[]): PlaneView {
  const reach = Math.max(8, ...points.flatMap((p) => [Math.ceil(Math.abs(p[0])) + 1, Math.ceil(Math.abs(p[1])) + 1]));
  const even = reach + (reach % 2);
  return { xMin: -even, xMax: even, yMin: -even, yMax: even, labelEvery: even > 10 ? 4 : 2, step: even > 16 ? 2 : 1 };
}

/** labelSide chooses a label's direction away from the segment it would otherwise sit on. */
const labelSide = (from: Point, to: Point): Compass => {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "e" : "w";
  return dy >= 0 ? "n" : "s";
};

/** motionMarks draws what carries a point from from to to. */
function motionMarks(from: Point, to: Point, motion: Motion): PlaneMark[] {
  switch (motion.kind) {
    case "slide": {
      const corner: Point = [to[0], from[1]];
      if (from[0] === to[0] || from[1] === to[1]) return [{ kind: "arrow", from, to, tone: "action" }];
      return [
        { kind: "arrow", from, to: corner, tone: "action", thin: true },
        { kind: "arrow", from: corner, to, tone: "action", thin: true },
      ];
    }
    case "turn": {
      const center = motion.center ?? [0, 0];
      return [
        { kind: "segment", a: center, b: from, dashed: true },
        { kind: "segment", a: center, b: to, dashed: true },
        { kind: "turn", center, from, degrees: motion.degrees, tone: "action" },
      ];
    }
    case "flip":
      return [{ kind: "segment", a: from, b: to, dashed: true }];
    case "scale": {
      const center = motion.center ?? [0, 0];
      return [
        {
          kind: "segment",
          a: center,
          b: Math.hypot(to[0] - center[0], to[1] - center[1]) >= Math.hypot(from[0] - center[0], from[1] - center[1]) ? to : from,
          dashed: true,
        },
      ];
    }
  }
}

/** frameMarks draws what the motion has in common for all its points: the mirror line or the center. */
function frameMarks(motion: Motion): PlaneMark[] {
  if (motion.kind === "flip") return [{ kind: "line", a: motion.a, b: motion.b, tone: "action" }];
  if ((motion.kind === "turn" || motion.kind === "scale") && motion.center && motion.centerName)
    return [{ kind: "point", at: motion.center, label: motion.centerName, dir: "sw" }];
  return [];
}

/** centerPoints lists the points of a motion that have to stay in view. */
const centerPoints = (motion: Motion): Point[] =>
  motion.kind !== "slide" && motion.kind !== "flip" && motion.center ? [motion.center] : [];

/** coordinates writes a point for alt text. */
const coordinates = (p: Point) => `(${Math.round(p[0] * 100) / 100}, ${Math.round(p[1] * 100) / 100})`;

/** movedPoint draws a point, its image in the result color, named imageName, and the motion between them, for a solution. */
export function movedPoint(name: string, from: Point, to: Point, motion: Motion, imageName = `${name}′`): Figure {
  const away = labelSide(to, from);
  const marks: PlaneMark[] = [
    ...frameMarks(motion),
    ...motionMarks(from, to, motion),
    { kind: "point", at: from, label: name, dir: away, accent: true },
    { kind: "point", at: to, label: imageName, dir: labelSide(from, to), tone: "result" },
  ];
  return {
    svg: plane(viewAround([from, to, ...centerPoints(motion)]), marks),
    alt: t(
      `${name} ${coordinates(from)} moves to its image ${imageName} ${coordinates(to)}.`,
      `${name} ${coordinates(from)} 移到它的像 ${imageName} ${coordinates(to)}。`,
    ),
  };
}

/** movedPolygon draws a polygon, its image in the result color, and the motion of one vertex, for a solution. */
export function movedPolygon(names: readonly string[], from: readonly Point[], to: readonly Point[], motion: Motion, vertex = 0): Figure {
  const closed = (points: readonly Point[]) => [...points, points[0]!];
  const marks: PlaneMark[] = [
    ...frameMarks(motion),
    { kind: "path", points: closed(from), accent: true },
    { kind: "path", points: closed(to), tone: "result" },
    ...motionMarks(from[vertex]!, to[vertex]!, motion),
    ...from.map((at, i): PlaneMark => ({ kind: "point", at, label: names[i]!, dir: labelSide(to[i]!, at), accent: true })),
    ...to.map((at, i): PlaneMark => ({ kind: "point", at, label: `${names[i]}′`, dir: labelSide(from[i]!, at), tone: "result" })),
  ];
  const label = names.join("");
  return {
    svg: plane(viewAround([...from, ...to, ...centerPoints(motion)]), marks),
    alt: t(
      `Polygon ${label} and its image ${names.map((n) => `${n}′`).join("")}, with vertices ${to.map(coordinates).join(", ")}.`,
      `多边形 ${label} 和它的像 ${names.map((n) => `${n}′`).join("")}，顶点为 ${to.map(coordinates).join("、")}。`,
    ),
  };
}
