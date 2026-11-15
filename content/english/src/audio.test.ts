import { topicSource } from "@ga/content";
import { describe, expect, it } from "vitest";
import { passageSsml, recordingName, soundsSsml, soundVoice, textSsml, voice, wantedRecordings } from "./audio.ts";
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

  it("each are asked for by the content as it is now, so none is stale", () => {
    const wanted = wantedRecordings();
    expect(english.topics.length).toBeGreaterThan(0);
    expect(recordings.filter((file) => !wanted.has(file))).toEqual([]);
  });

  it("read a line in the HD voice and the sounds of a word in the voice that follows IPA, skipping silent letters", () => {
    expect(textSsml(" a  big\ndog ")).toContain(`<voice name="${voice.name}"><prosody rate="${voice.rate}">a big dog</prosody>`);
    const ssml = soundsSsml(
      [
        { letters: "c", ipa: "k" },
        { letters: "a", ipa: "eɪ" },
        { letters: "k", ipa: "k" },
        { letters: "e", ipa: "" },
      ],
      "cake",
    );
    expect(ssml).toContain(`<voice name="${soundVoice.name}">`);
    expect(ssml.match(/<phoneme /gu)).toHaveLength(3);
    expect(ssml).toContain('<phoneme alphabet="ipa" ph="eɪ">a</phoneme><break time="400ms"/>');
    expect(ssml).toContain('<break time="400ms"/>cake</prosody>');
  });

  it("ask for conversations' openings as WAV, for the voice service", () => {
    const openings = [...wantedRecordings()].filter(([, w]) => w.kind === "opening");
    expect(openings.length).toBe(english.conversations?.length);
    for (const [file, w] of openings) {
      expect(file.endsWith(".wav")).toBe(true);
      expect(w.format.azure).toBe("riff-16khz-16bit-mono-pcm");
    }
  });

  it("reach a reader through the subject's source", async () => {
    const recorded = (english.reading ?? []).flatMap((u) => u.passages).find((p) => p.audio);
    if (!recorded) return;
    const source = topicSource(english.topics, english.checkers, english.reading);
    expect((await source.passage(recorded.id)).audio).toBe(recorded.audio);
  });
});
