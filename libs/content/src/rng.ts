/**
 * Rng is a deterministic pseudo-random generator. Problem generators receive
 * one seeded per problem instance, so that the same seed always yields the
 * same problem on every platform.
 */
export interface Rng {
  /** next returns a float in [0, 1). */
  next(): number;
  /** int returns an integer in [min, max], both inclusive. */
  int(min: number, max: number): number;
  /** nonZero returns an integer in [min, max] other than 0. */
  nonZero(min: number, max: number): number;
  /** sign returns 1 or -1 with equal probability. */
  sign(): 1 | -1;
  /** bool returns true with probability p. */
  bool(p?: number): boolean;
  /** pick returns one element of items. */
  pick<T>(items: readonly T[]): T;
  /** shuffle returns a shuffled copy of items. */
  shuffle<T>(items: readonly T[]): T[];
  /** sample returns n distinct elements of items in random order. */
  sample<T>(items: readonly T[], n: number): T[];
}

/** hashSeed turns any string into a 32-bit seed (FNV-1a). */
export function hashSeed(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** createRng returns an Rng (sfc32 seeded by splitmix32) for a numeric or string seed. */
export function createRng(seed: number | string): Rng {
  let s = typeof seed === "string" ? hashSeed(seed) : seed >>> 0;
  const splitmix = () => {
    s = (s + 0x9e3779b9) >>> 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    return (z ^ (z >>> 16)) >>> 0;
  };
  let a = splitmix();
  let b = splitmix();
  let c = splitmix();
  let d = splitmix();
  const next = () => {
    const r = (a + b + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + r) | 0;
    return (r >>> 0) / 4294967296;
  };
  for (let i = 0; i < 12; i++) next();

  const int = (min: number, max: number) => {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) throw new RangeError(`bad range [${min}, ${max}]`);
    return min + Math.floor(next() * (max - min + 1));
  };
  const rng: Rng = {
    next,
    int,
    nonZero(min, max) {
      if (min === 0 && max === 0) throw new RangeError("no non-zero integer in [0, 0]");
      for (;;) {
        const v = int(min, max);
        if (v !== 0) return v;
      }
    },
    sign: () => (next() < 0.5 ? 1 : -1),
    bool: (p = 0.5) => next() < p,
    pick(items) {
      if (items.length === 0) throw new RangeError("pick from an empty list");
      return items[int(0, items.length - 1)]!;
    },
    shuffle(items) {
      const out = [...items];
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(0, i);
        [out[i], out[j]] = [out[j]!, out[i]!];
      }
      return out;
    },
    sample(items, n) {
      if (n > items.length) throw new RangeError(`sample ${n} of ${items.length}`);
      return rng.shuffle(items).slice(0, n);
    },
  };
  return rng;
}
