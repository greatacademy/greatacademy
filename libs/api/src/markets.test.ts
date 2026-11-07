import { describe, expect, it } from "vitest";

import { ageBand, bandAt, birthAnchor, marketOf, missingLanguages, movedBand, nextBand } from "./markets.ts";

const NOW = Date.UTC(2026, 10, 6);

describe("the age question", () => {
  it("counts a birthday from the month after, so nobody comes out older", () => {
    // Born in November 2013: turns 13 for sure on 1 December 2026.
    expect(ageBand("US", 2013, 11, NOW)?.band).toBe("child");
    expect(ageBand("US", 2013, 10, NOW)?.band).toBe("teen");
    expect(ageBand("US", 2008, 11, NOW)?.band).toBe("teen");
    expect(ageBand("US", 2008, 10, NOW)?.band).toBe("adult");
  });

  it("follows each market's line", () => {
    expect(ageBand("US", 2012, 1, NOW)?.band).toBe("teen");
    expect(ageBand("JP", 2012, 1, NOW)?.band).toBe("child");
    expect(ageBand("TW", 2009, 1, NOW)?.band).toBe("child");
    expect(ageBand("other", 2009, 1, NOW)?.band).toBe("child");
  });

  it("refuses dates that cannot be real", () => {
    for (const [y, m] of [
      [2013, 0],
      [2013, 13],
      [1800, 1],
      [2030, 1],
    ] as const)
      expect(ageBand("US", y, m, NOW)).toBeUndefined();
  });
});

describe("bands over time", () => {
  it("offers the next band only after this one ends, and computes it from the stored end", () => {
    const b = ageBand("US", 2015, 3, NOW)!;
    expect(b.band).toBe("child");
    expect(nextBand(b.band, b.endsAt, "US", NOW)).toBeUndefined();
    const later = nextBand(b.band, b.endsAt, "US", b.endsAt!)!;
    expect(later.band).toBe("teen");
    expect(later.endsAt).toBe(Date.UTC(2033, 3, 1));
    expect(nextBand("teen", later.endsAt, "US", later.endsAt!)?.band).toBe("adult");
  });

  it("takes the stricter row when moving, and never an older band", () => {
    const teen = bandAt(birthAnchor(2012, 1), 13, NOW);
    expect(teen.band).toBe("teen");
    expect(movedBand("teen", teen.endsAt!, "US", "JP", NOW).band).toBe("child");
    const child = bandAt(birthAnchor(2012, 1), 16, NOW);
    expect(movedBand("child", child.endsAt!, "JP", "US", NOW)).toEqual({ band: "child", endsAt: child.endsAt });
  });
});

describe("the table", () => {
  it("keeps mainland China closed and names missing languages", () => {
    expect(marketOf("CN")?.status).toBe("closed");
    expect(marketOf("HK")?.status).toBe("open-no-ai");
    expect(marketOf("FR")).toBeUndefined();
    expect(missingLanguages(marketOf("JP")!)).toEqual(["ja"]);
    expect(missingLanguages(marketOf("US")!)).toEqual([]);
  });
});
