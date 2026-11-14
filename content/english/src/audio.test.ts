import { topicSource } from "@ga/content";
import { describe, expect, it } from "vitest";
import { passageSsml, recordingName } from "./audio.ts";
import { english } from "./index.ts";
import { recordings } from "./recordings.ts";

describe("recordings", () => {
  it("are named by their SSML, which escapes the text and pauses between paragraphs", () => {
    const ssml = passageSsml("Tom & Ann ran.\n\nThey <stopped>.");
    expect(ssml).toContain("Tom &amp; Ann ran.<break");
    expect(ssml).toContain("They &lt;stopped&gt;.");
    expect(recordingName(ssml)).toMatch(/^[0-9a-f]{16}$/u);
    expect(recordingName(ssml)).not.toBe(recordingName(passageSsml("Tom & Ann ran.")));
  });

  it("each belong to a passage as it is now, so none is stale", () => {
    const given = new Set((english.reading ?? []).flatMap((u) => u.passages).flatMap((p) => (p.audio ? [p.audio] : [])));
    expect(recordings.filter((name) => !given.has(name))).toEqual([]);
  });

  it("reach a reader through the subject's source", async () => {
    const recorded = (english.reading ?? []).flatMap((u) => u.passages).find((p) => p.audio);
    if (!recorded) return;
    const source = topicSource(english.topics, english.checkers, english.reading);
    expect((await source.passage(recorded.id)).audio).toBe(recorded.audio);
  });
});
