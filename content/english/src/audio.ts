// The recordings of English: passages read aloud by a synthetic voice, made by tools/audio. A recording is named by a
// hash of the SSML it was made from, so that a passage whose text, voice or speed changes has no recording until it
// is made again. The web app serves the files of content/english/audio/files at /audio/english/.

import type { PassageDef, ReadingUnitDef } from "@ga/content";

import { recordings } from "./recordings.ts";

/** voice is the voice that reads passages aloud, its language, and how much slower than its usual speed it reads. */
export const voice = { name: "en-US-Ava:DragonHDLatestNeural", lang: "en-US", rate: "-10%" } as const;

/** PARAGRAPH_BREAK is the pause between two paragraphs of a passage. */
const PARAGRAPH_BREAK = "700ms";

const escapeXml = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** passageSsml is the SSML that reads a passage's body aloud: its paragraphs in order, with a pause between them. */
export function passageSsml(body: string): string {
  const paragraphs = body
    .split(/\n\s*\n/u)
    .map((p) => escapeXml(p.replace(/\s+/gu, " ").trim()))
    .filter((p) => p !== "");
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voice.lang}">` +
    `<voice name="${voice.name}"><prosody rate="${voice.rate}">` +
    paragraphs.join(`<break time="${PARAGRAPH_BREAK}"/>`) +
    "</prosody></voice></speak>"
  );
}

/** recordingName names the recording made from some SSML: 16 hex digits of its 64-bit FNV-1a hash. */
export function recordingName(ssml: string): string {
  let h = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(ssml)) h = BigInt.asUintN(64, (h ^ BigInt(byte)) * 0x100000001b3n);
  return h.toString(16).padStart(16, "0");
}

/** passageRecording names the recording of a passage's body, made or not. */
export const passageRecording = (passage: PassageDef): string => recordingName(passageSsml(passage.body));

const made = new Set(recordings);

/** withRecordings gives each passage whose recording has been made its audio. */
export const withRecordings = (units: readonly ReadingUnitDef[]): ReadingUnitDef[] =>
  units.map((u) => ({
    ...u,
    passages: u.passages.map((p) => {
      const name = passageRecording(p);
      return made.has(name) ? { ...p, audio: name } : p;
    }),
  }));
