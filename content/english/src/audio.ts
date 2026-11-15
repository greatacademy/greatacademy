// The recordings of English, read aloud by a synthetic voice and made by tools/audio: passages, and the words,
// sentences and sounds of words that problems play with their solutions. A recording is named by a hash of the SSML it
// was made from, so that a text whose words, voice or speed change has no recording until it is made again. tools/audio
// uploads them to the R2 bucket greatacademy under audio/english/, and the web app serves them at the same path; in
// development, from content/english/audio/files.

import type { ConversationDef, PassageDef, ReadingUnitDef, Sound } from "@ga/content";

import { recordings } from "./recordings.ts";

export { recordings };

/** Voice is a voice that reads aloud, its language, and how much slower than its usual speed it reads. */
export interface Voice {
  readonly name: string;
  readonly lang: string;
  readonly rate: string;
}

/** voice reads passages, words and sentences aloud. */
export const voice: Voice = { name: "en-US-Ava:DragonHDLatestNeural", lang: "en-US", rate: "-10%" };

/**
 * soundVoice says the sounds of words, one phoneme at a time: the same speaker without HD, since the HD voice does not
 * follow phonemes written in IPA and turns a lone /t/ into a syllable.
 */
export const soundVoice: Voice = { name: "en-US-AvaNeural", lang: "en-US", rate: "-10%" };

/** speak wraps the inside of an SSML document in a voice and its speed. */
const speak = (v: Voice, inner: string) =>
  `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${v.lang}">` +
  `<voice name="${v.name}"><prosody rate="${v.rate}">${inner}</prosody></voice></speak>`;

/** PARAGRAPH_BREAK is the pause between two paragraphs of a passage. */
const PARAGRAPH_BREAK = "700ms";

const escapeXml = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** passageSsml is the SSML that reads a passage's body aloud: its paragraphs in order, with a pause between them. */
export function passageSsml(body: string): string {
  const paragraphs = body
    .split(/\n\s*\n/u)
    .map((p) => escapeXml(p.replace(/\s+/gu, " ").trim()))
    .filter((p) => p !== "");
  return speak(voice, paragraphs.join(`<break time="${PARAGRAPH_BREAK}"/>`));
}

/** textSsml is the SSML that reads one line aloud, a word or a sentence. */
export function textSsml(text: string): string {
  return speak(voice, escapeXml(text.replace(/\s+/gu, " ").trim()));
}

/** SOUND_BREAK is the pause between two sounds of a word, and before the whole word. */
const SOUND_BREAK = "400ms";

/** Phoneme is one sound of a word: the letters that spell it and the sound in IPA, "" for a silent letter. */
export interface Phoneme {
  readonly letters: string;
  readonly ipa: string;
}

/** soundsSsml is the SSML that says the sounds of a word one at a time and then the whole word: "k, æ, t, cat". */
export function soundsSsml(sounds: readonly Phoneme[], word: string): string {
  const each = sounds
    .filter((p) => p.ipa !== "")
    .map((p) => `<phoneme alphabet="ipa" ph="${escapeXml(p.ipa)}">${escapeXml(p.letters)}</phoneme>`);
  return speak(soundVoice, [...each, escapeXml(word)].join(`<break time="${SOUND_BREAK}"/>`));
}

/** recordingName names the recording made from some SSML: 16 hex digits of its 64-bit FNV-1a hash. */
export function recordingName(ssml: string): string {
  let h = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(ssml)) h = BigInt.asUintN(64, (h ^ BigInt(byte)) * 0x100000001b3n);
  return h.toString(16).padStart(16, "0");
}

/** passageRecording names the recording of a passage's body, made or not. */
export const passageRecording = (passage: PassageDef): string => recordingName(passageSsml(passage.body));

/** Format is how a recording is encoded: Azure AI Speech's name for it and the file's extension. */
export interface Format {
  readonly azure: string;
  readonly ext: "mp3" | "wav";
}

/** MP3 is 24 kHz mono MP3 at 48 kbit/s, ample for speech, which both apps play. */
export const MP3: Format = { azure: "audio-24khz-48kbitrate-mono-mp3", ext: "mp3" };

/** WAV is 16 kHz 16-bit mono PCM, the audio of the voice service, which plays it as it is. */
export const WAV: Format = { azure: "riff-16khz-16bit-mono-pcm", ext: "wav" };

/** RecordingKind is what a recording reads: a passage, a word, a sentence, the sounds of a word, or a conversation's opening. */
export type RecordingKind = "passage" | "word" | "sentence" | "sounds" | "opening";

/** Wanted is a recording the content asks for: what it reads, the SSML and format it is made in, and, for a passage, its unit. */
export interface Wanted {
  readonly kind: RecordingKind;
  readonly ssml: string;
  readonly format: Format;
  readonly unit?: string;
}

/** fileName is the file of the recording of some SSML in a format: its name and the format's extension. */
export const fileName = (ssml: string, format: Format): string => `${recordingName(ssml)}.${format.ext}`;

const made = new Set(recordings);

/** wanted maps the file of each recording the content asks for to how it is made; it fills as the content modules build. */
const wanted = new Map<string, Wanted>();

/** wantedRecordings are the recordings the content asks for, made or not, by file name. */
export const wantedRecordings = (): ReadonlyMap<string, Wanted> => wanted;

/** want asks for a recording and tells whether it is made, giving its name without the extension. */
function want(w: Wanted): string | undefined {
  const file = fileName(w.ssml, w.format);
  if (!wanted.has(file)) wanted.set(file, w);
  return made.has(file) ? file.slice(0, -(w.format.ext.length + 1)) : undefined;
}

/** recorded asks for the recording of a text and gives its Sound, with that text on its button, once it is made. */
function recorded(kind: RecordingKind, ssml: string, text: string): Sound | undefined {
  const name = want({ kind, ssml, format: MP3 });
  return name ? { text, audio: `audio/english/${name}` } : undefined;
}

/** spoken is the Sound of a word read aloud, or of a sentence when the text has a space, once it is recorded. */
export const spoken = (text: string): Sound | undefined => recorded(/\s/u.test(text.trim()) ? "sentence" : "word", textSsml(text), text);

/** sounded is the Sound of a word said one sound at a time and then whole, once it is recorded; its button shows the letters of each sound, "c-a-t". */
export const sounded = (word: string, sounds: readonly Phoneme[]): Sound | undefined =>
  recorded("sounds", soundsSsml(sounds, word), sounds.map((p) => p.letters).join("-"));

/** withSounds gives a problem the sounds that are recorded among those given, when there are any. */
export const withSounds = (...sounds: readonly (Sound | undefined)[]): { solutionSounds?: readonly Sound[] } => {
  const given = sounds.filter((s): s is Sound => s !== undefined);
  return given.length > 0 ? { solutionSounds: given } : {};
};

/** withRecordings gives each passage whose recording has been made its audio. */
export const withRecordings = (units: readonly ReadingUnitDef[]): ReadingUnitDef[] =>
  units.map((u) => ({
    ...u,
    passages: u.passages.map((p) => {
      const name = want({ kind: "passage", ssml: passageSsml(p.body), format: MP3, unit: u.id });
      return name ? { ...p, audio: name } : p;
    }),
  }));

/** withOpenings gives each conversation whose opening has been recorded, for the voice service to play, its openingAudio. */
export const withOpenings = (conversations: readonly ConversationDef[]): ConversationDef[] =>
  conversations.map((c) => {
    const name = want({ kind: "opening", ssml: textSsml(c.opening), format: WAV });
    return name ? { ...c, openingAudio: name } : c;
  });
