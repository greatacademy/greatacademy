/// <reference types="node" />

import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { illustrations } from "./illustrations.ts";
import { english } from "./index.ts";

const folder = new URL("../illustrations/", import.meta.url);

describe("illustrations", () => {
  it("lists every illustration whose two web files exist, and no other", () => {
    const files = readdirSync(folder).filter((f) => f.endsWith(".webp"));
    const full = files.filter((f) => !f.endsWith(".thumb.webp")).map((f) => f.replace(/\.webp$/u, ""));
    const thumbs = files.filter((f) => f.endsWith(".thumb.webp")).map((f) => f.replace(/\.thumb\.webp$/u, ""));
    const pictures = full.filter((n) => n !== "characters");
    expect([...pictures].sort()).toEqual([...illustrations].sort());
    expect([...thumbs].sort()).toEqual([...full].sort());
  });

  it("matches each illustration to a reading unit or a conversation", () => {
    const used = [
      ...(english.reading ?? []).flatMap((u) => (u.illustration ? [u.illustration] : [])),
      ...(english.conversations ?? []).flatMap((c) => (c.illustration ? [c.illustration] : [])),
    ];
    expect(new Set(used)).toEqual(new Set(illustrations));
  });
});
