/**
 * taughtCourses lists the courses written to the teaching standard (docs/content.md §4, "Teaching, not stating"):
 * every topic has an introduction, every explanation ends with a callout on its typical mistake, and solutions are
 * worked step by step and check their answer. Its test holds every topic of these courses to it.
 */
export const taughtCourses: readonly string[] = ["algebra-i"];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "identifying-three-dimensional-shapes",
  "faces-vertices-and-edges-of-polyhedrons",
  "nets-of-polyhedrons",
  "finding-surface-areas-using-nets",
  "eulers-formula-for-polyhedra",
  "the-five-platonic-solids",
  "volumes-of-cubes",
  "surface-areas-of-cubes",
  "face-diagonals-of-cubes",
  "diagonals-of-cubes",
  "volumes-of-rectangular-solids",
  "surface-areas-of-rectangular-solids",
  "diagonals-of-rectangular-solids",
  "the-distance-formula-in-three-dimensions",
  "volumes-of-pyramids",
  "surface-areas-of-pyramids",
  "surface-areas-and-volumes-of-similar-solids",
  "volumes-of-cylinders",
  "surface-areas-of-cylinders",
  "volumes-of-right-cones",
  "slant-heights-of-right-cones",
  "surface-areas-of-right-cones",
  "volumes-of-spheres",
  "surface-areas-of-spheres",
  "conical-frustums",
  "volumes-of-revolution",
];
