/** RoadmapCourse is a course as the roadmap needs it: its id and the courses it builds on. */
export interface RoadmapCourse {
  readonly id: string;
  readonly buildsOn: readonly string[];
}

/** RoadmapBox is a course placed on the roadmap: its box's left and top edges. */
export interface RoadmapBox {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

/** RoadmapEdge is the line from a course up to a course that builds on it, as an SVG path. */
export interface RoadmapEdge {
  readonly from: string;
  readonly to: string;
  readonly path: string;
}

/** Roadmap is a subject's courses laid out with the first courses at the bottom, each above what it builds on. */
export interface Roadmap {
  readonly width: number;
  readonly height: number;
  readonly boxes: readonly RoadmapBox[];
  readonly edges: readonly RoadmapEdge[];
}

/** RoadmapSize is the size of a course's box and the space between boxes and rows. */
export interface RoadmapSize {
  readonly boxWidth: number;
  readonly boxHeight: number;
  readonly gap: number;
  readonly rowGap: number;
}

/** ROADMAP_SIZE is the size the web draws the roadmap at. */
export const ROADMAP_SIZE: RoadmapSize = { boxWidth: 120, boxHeight: 40, gap: 16, rowGap: 40 };

/** A slot in a row: a course's box, or a point a line passes through on its way to a row further up. */
interface Slot {
  readonly id?: string;
  readonly row: number;
  /** below and above are the slots of the rows below and above joined to this one. */
  readonly below: Slot[];
  readonly above: Slot[];
  order: number;
  x: number;
}

const SWEEPS = 24;
// An odd number, so the last pass goes up and stands every course over what it builds on.
const ROUNDS = 7;

/**
 * layoutRoadmap places courses in rows, each one row above the highest course it builds on and pulled up beside the
 * courses that follow it, then orders each row to cross few lines and sets each box over the middle of its neighbors.
 * A course reached from another through a third is joined to it only through the third. It is deterministic: the same
 * courses in the same order give the same roadmap. Courses it builds on outside `courses` are left out.
 */
export function layoutRoadmap(courses: readonly RoadmapCourse[], size: RoadmapSize = ROADMAP_SIZE): Roadmap {
  const ids = courses.map((c) => c.id);
  const known = new Set(ids);
  const direct = new Map(courses.map((c) => [c.id, [...new Set(c.buildsOn)].filter((id) => id !== c.id && known.has(id))]));
  const before = reduce(ids, direct);
  const after = new Map(ids.map((id) => [id, [] as string[]]));
  for (const id of ids) for (const b of before.get(id) ?? []) after.get(b)?.push(id);

  const rank = rows(ids, before, after);
  const top = Math.max(0, ...rank.values());

  // Slots, met depth first from the first courses so that a course and what follows it start side by side.
  const grid: Slot[][] = Array.from({ length: top + 1 }, () => []);
  const box = new Map<string, Slot>();
  const lines: { from: string; to: string; slots: Slot[] }[] = [];
  const place = (id: string | undefined, row: number): Slot => {
    const slot: Slot = { id, row, below: [], above: [], order: 0, x: 0 };
    grid[row]?.push(slot);
    return slot;
  };
  const visit = (id: string) => {
    if (box.has(id)) return;
    box.set(id, place(id, rank.get(id) ?? 0));
    for (const b of before.get(id) ?? []) visit(b);
    for (const next of after.get(id) ?? []) visit(next);
  };
  for (const id of ids) if ((before.get(id) ?? []).length === 0) visit(id);
  for (const id of ids) visit(id);
  for (const to of ids) {
    for (const from of before.get(to) ?? []) {
      const slots = [box.get(from) as Slot];
      for (let r = (rank.get(from) ?? 0) + 1; r < (rank.get(to) ?? 0); r++) slots.push(place(undefined, r));
      slots.push(box.get(to) as Slot);
      for (let k = 1; k < slots.length; k++) {
        slots[k - 1]?.above.push(slots[k] as Slot);
        slots[k]?.below.push(slots[k - 1] as Slot);
      }
      lines.push({ from, to, slots });
    }
  }
  for (const row of grid) number(row);
  order(grid);
  spread(grid, size);

  const all = grid.flat();
  const half = (s: Slot) => (s.id ? size.boxWidth / 2 : 0);
  const leftmost = Math.min(...all.map((s) => s.x - half(s)));
  const rightmost = Math.max(...all.map((s) => s.x + half(s)));
  const step = size.boxHeight + size.rowGap;
  const yOf = (s: Slot) => (top - s.row) * step;
  const xOf = (s: Slot) => round(s.x - leftmost);
  const boxes = ids.flatMap((id) => {
    const s = box.get(id);
    return s ? [{ id, x: round(s.x - leftmost - size.boxWidth / 2), y: yOf(s) }] : [];
  });
  const edges = lines.map(({ from, to, slots }) => {
    let path = `M${xOf(slots[0] as Slot)} ${yOf(slots[0] as Slot)}`;
    for (let k = 1; k < slots.length; k++) {
      const prev = slots[k - 1] as Slot;
      const s = slots[k] as Slot;
      const bottom = yOf(s) + size.boxHeight;
      const mid = round((yOf(prev) + bottom) / 2);
      path += ` C${xOf(prev)} ${mid} ${xOf(s)} ${mid} ${xOf(s)} ${bottom}`;
      if (!s.id) path += ` L${xOf(s)} ${yOf(s)}`;
    }
    return { from, to, path };
  });
  return {
    width: all.length ? round(rightmost - leftmost) : 0,
    height: top * step + size.boxHeight,
    boxes,
    edges,
  };
}

/** reduce drops a course's link to one it also reaches through another course it builds on. */
function reduce(ids: readonly string[], direct: ReadonlyMap<string, readonly string[]>): Map<string, string[]> {
  const below = new Map<string, Set<string>>();
  const reach = (id: string, seen: Set<string>): Set<string> => {
    const found = below.get(id);
    if (found) return found;
    const all = new Set<string>();
    if (seen.has(id)) return all;
    seen.add(id);
    for (const b of direct.get(id) ?? []) {
      all.add(b);
      for (const r of reach(b, seen)) all.add(r);
    }
    below.set(id, all);
    return all;
  };
  return new Map(
    ids.map((id) => {
      const list = direct.get(id) ?? [];
      return [id, list.filter((b) => !list.some((other) => other !== b && reach(other, new Set()).has(b)))];
    }),
  );
}

/** rows ranks courses: one row above the highest course each builds on, then as high as the courses after it allow. */
function rows(
  ids: readonly string[],
  before: ReadonlyMap<string, readonly string[]>,
  after: ReadonlyMap<string, readonly string[]>,
): Map<string, number> {
  const rank = new Map<string, number>();
  const rankOf = (id: string, seen: Set<string>): number => {
    const found = rank.get(id);
    if (found !== undefined) return found;
    if (seen.has(id)) return 0;
    seen.add(id);
    const r = Math.max(-1, ...(before.get(id) ?? []).map((b) => rankOf(b, seen))) + 1;
    rank.set(id, r);
    return r;
  };
  for (const id of ids) rankOf(id, new Set());
  for (const id of [...ids].sort((a, b) => (rank.get(b) ?? 0) - (rank.get(a) ?? 0))) {
    const next = after.get(id) ?? [];
    if (next.length > 0) rank.set(id, Math.max(rank.get(id) ?? 0, Math.min(...next.map((n) => rank.get(n) ?? 0)) - 1));
  }
  return rank;
}

/** order sorts each row by the middle place of its neighbors, sweeping up and down, then swaps neighbors that cross less. */
function order(grid: Slot[][]) {
  const median = (slots: readonly Slot[], own: number) => {
    if (slots.length === 0) return own;
    const sorted = slots.map((s) => s.order).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? (sorted[mid] as number) : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
  };
  const sortBy = (row: Slot[], key: (s: Slot) => number) => {
    const keys = new Map(row.map((s) => [s, key(s)]));
    row.sort((a, b) => (keys.get(a) ?? 0) - (keys.get(b) ?? 0) || a.order - b.order);
    number(row);
  };
  let best = grid.map((row) => [...row]);
  let fewest = crossings(grid);
  for (let sweep = 0; sweep < SWEEPS && fewest > 0; sweep++) {
    if (sweep % 2 === 0) for (const row of grid.slice(1)) sortBy(row, (s) => median(s.below, s.order));
    else for (const row of grid.slice(0, -1).reverse()) sortBy(row, (s) => median(s.above, s.order));
    for (const row of grid) transpose(row);
    const now = crossings(grid);
    if (now < fewest) {
      fewest = now;
      best = grid.map((row) => [...row]);
    }
  }
  best.forEach((row, r) => {
    grid[r] = row;
    number(row);
  });
}

/** transpose swaps neighbors in a row while that crosses fewer lines to the rows above and below. */
function transpose(row: Slot[]) {
  const cross = (a: Slot, b: Slot) => {
    let n = 0;
    for (const side of ["below", "above"] as const) {
      for (const p of a[side]) for (const q of b[side]) if (p.order > q.order) n++;
    }
    return n;
  };
  for (let pass = 0, swapped = true; swapped && pass < row.length; pass++) {
    swapped = false;
    for (let i = 0; i + 1 < row.length; i++) {
      const a = row[i] as Slot;
      const b = row[i + 1] as Slot;
      if (cross(b, a) < cross(a, b)) {
        row[i] = b;
        row[i + 1] = a;
        number(row);
        swapped = true;
      }
    }
  }
}

/**
 * spread sets each slot over one of its neighbors as far as the space between boxes allows: once leaning left, giving
 * way to the right, and once the mirror of that, then halfway between the two, as Brandes and Köpf place theirs.
 */
function spread(grid: Slot[][], size: RoadmapSize) {
  const lean = (dir: 1 | -1) => {
    const x = new Map<Slot, number>();
    const width = (s: Slot) => (s.id ? size.boxWidth : 0);
    const space = (a: Slot, b: Slot) => (width(a) + width(b)) / 2 + (a.id && b.id ? size.gap : size.gap / 2);
    for (const row of grid) {
      let at = 0;
      row.forEach((s, i) => {
        if (i > 0) at += space(row[i - 1] as Slot, s);
        x.set(s, at);
      });
    }
    // Of an even number of neighbors, the one on the side it leans to; a box then stands straight over one neighbor.
    const pick = (near: readonly Slot[]) => {
      const xs = near.map((n) => x.get(n) ?? 0).sort((a, b) => (a - b) * dir);
      return xs[Math.floor((xs.length - 1) / 2)] as number;
    };
    for (let round = 0; round < ROUNDS; round++) {
      const up = round % 2 === 0;
      for (const row of up ? grid : [...grid].reverse()) {
        const line = dir === 1 ? row : [...row].reverse();
        let last: Slot | undefined;
        for (const s of line) {
          const near = up ? s.below : s.above;
          const any = near.length > 0 ? near : [...s.below, ...s.above];
          let want = any.length > 0 ? pick(any) : (x.get(s) ?? 0);
          if (last) {
            const edge = (x.get(last) ?? 0) + dir * space(last, s);
            want = dir === 1 ? Math.max(want, edge) : Math.min(want, edge);
          }
          x.set(s, want);
          last = s;
        }
      }
    }
    const min = Math.min(...[...x].map(([s, v]) => v - width(s) / 2));
    for (const [s, v] of x) x.set(s, v - min);
    return x;
  };
  const placed = lean(1);
  for (const s of grid.flat()) s.x = placed.get(s) ?? 0;
}

/** number sets each slot's order to its place in its row. */
function number(row: Slot[]) {
  row.forEach((s, i) => {
    s.order = i;
  });
}

/** crossings counts the pairs of lines between neighboring rows that cross. */
function crossings(grid: readonly (readonly Slot[])[]): number {
  let count = 0;
  for (const row of grid) {
    const joins = row.flatMap((s) => s.above.map((a) => [s.order, a.order] as const));
    for (let i = 0; i < joins.length; i++) {
      for (let j = i + 1; j < joins.length; j++) {
        const [a1, b1] = joins[i] as readonly [number, number];
        const [a2, b2] = joins[j] as readonly [number, number];
        if ((a1 - a2) * (b1 - b2) < 0) count++;
      }
    }
  }
  return count;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/** prerequisitesOf lists a course and every course it builds on, directly or through others. */
export function prerequisitesOf(courses: readonly RoadmapCourse[], id: string): Set<string> {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const found = new Set<string>();
  const visit = (at: string) => {
    if (found.has(at) || !byId.has(at)) return;
    found.add(at);
    for (const b of byId.get(at)?.buildsOn ?? []) visit(b);
  };
  visit(id);
  return found;
}
