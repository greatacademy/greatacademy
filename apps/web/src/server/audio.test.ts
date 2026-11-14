import { describe, expect, it } from "vitest";

import { type AudioObject, serveAudio } from "./audio.ts";

const bytes = new Uint8Array(100);
const store = (seen: string[]) => ({
  async get(key: string, { range }: { range: Headers }): Promise<AudioObject | null> {
    seen.push(key);
    if (key !== "audio/english/0123456789abcdef.mp3") return null;
    const asked = range.get("Range");
    return {
      body: new Blob([bytes]).stream(),
      size: 100,
      httpEtag: '"e"',
      ...(asked === "bytes=10-19" && { range: { offset: 10, length: 10 } }),
      ...(asked === "bytes=-5" && { range: { suffix: 5 } }),
    };
  },
});
const get = (path: string, headers: Record<string, string> = {}) => new Request(`https://example.com${path}`, { headers });

describe("serveAudio", () => {
  it("serves a recording whole, cached for good", async () => {
    const res = await serveAudio(store([]), get("/audio/english/0123456789abcdef.mp3"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("audio/mpeg");
    expect(res.headers.get("Content-Length")).toBe("100");
    expect(res.headers.get("Cache-Control")).toContain("immutable");
  });

  it("serves the range asked for", async () => {
    const res = await serveAudio(store([]), get("/audio/english/0123456789abcdef.mp3", { Range: "bytes=10-19" }));
    expect(res.status).toBe(206);
    expect(res.headers.get("Content-Range")).toBe("bytes 10-19/100");
    const tail = await serveAudio(store([]), get("/audio/english/0123456789abcdef.mp3", { Range: "bytes=-5" }));
    expect(tail.headers.get("Content-Range")).toBe("bytes 95-99/100");
  });

  it("reads no key for a path that names no recording", async () => {
    const seen: string[] = [];
    for (const path of ["/audio/english/../secret.mp3", "/audio/english/abc.mp3", "/audio/0123456789abcdef.mp3"])
      expect((await serveAudio(store(seen), get(path))).status).toBe(404);
    expect(seen).toEqual([]);
    expect((await serveAudio(store([]), get("/audio/english/ffffffffffffffff.mp3"))).status).toBe(404);
  });
});
