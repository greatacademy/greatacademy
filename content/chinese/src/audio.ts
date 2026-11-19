// The recordings of Chinese, read aloud by a synthetic voice and made by tools/audio: syllables with their tones,
// words and sentences that listening problems play. A recording is named by a hash of the SSML it was made from, so
// that a text whose reading, voice or speed changes has no recording until it is made again. The web app serves them
// at audio/chinese/; in development, from content/chinese/audio/files.

import { recordings } from "./recordings.ts";

export { recordings };

/** Voice is a voice that reads aloud, its language, and how much slower than its usual speed it reads. */
export interface Voice {
  readonly name: string;
  readonly lang: string;
  readonly rate: string;
}

/** voice reads syllables, words and sentences aloud in standard Mandarin. */
export const voice: Voice = { name: "zh-CN-XiaoxiaoNeural", lang: "zh-CN", rate: "-10%" };

const escapeXml = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** speak wraps the inside of an SSML document in the voice and its speed. */
const speak = (inner: string) =>
  `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${voice.lang}">` +
  `<voice name="${voice.name}"><prosody rate="${voice.rate}">${inner}</prosody></voice></speak>`;

/**
 * READ_AS are the words the voice reads in the wrong one of their readings, found by assessing the recordings of the
 * words with characters of several readings against homophones of each: the reading to say, in the SAPI phone set, and
 * whether it holds in any sentence or only when the word is said alone, since 同行 and 有空 read otherwise in some.
 */
const READ_AS: ReadonlyMap<string, { readonly ph: string; readonly anywhere: boolean }> = new Map([
  ["查重", { ph: "cha 2 chong 2", anywhere: true }],
  ["倒时差", { ph: "dao 3 shi 2 cha 1", anywhere: true }],
  ["口角", { ph: "kou 3 jue 2", anywhere: true }],
  ["丑角", { ph: "chou 3 jue 2", anywhere: true }],
  ["好面子", { ph: "hao 4 mian 4 zi 5", anywhere: true }],
  ["数不清", { ph: "shu 3 bu 4 qing 1", anywhere: true }],
  ["同行", { ph: "tong 2 hang 2", anywhere: false }],
  ["有空", { ph: "you 3 kong 4", anywhere: false }],
  ["血", { ph: "xue 4", anywhere: false }],
  ["藏", { ph: "cang 2", anywhere: false }],
  ["差", { ph: "cha 4", anywhere: false }],
  ["了", { ph: "le 5", anywhere: false }],
  ["着", { ph: "zhe 5", anywhere: false }],
  ["抽血", { ph: "chou 1 xue 4", anywhere: true }],
  ["排长队", { ph: "pai 2 chang 2 dui 4", anywhere: true }],
  ["粘合", { ph: "zhan 1 he 2", anywhere: true }],
  ["强词夺理", { ph: "qiang 3 ci 2 duo 2 li 3", anywhere: true }],
]);

/** readAs marks the words of a line the voice would misread with the reading to say. */
function readAs(line: string): string {
  const alone = READ_AS.get(line);
  if (alone) return `<phoneme alphabet="sapi" ph="${alone.ph}">${escapeXml(line)}</phoneme>`;
  let out = escapeXml(line);
  for (const [word, { ph, anywhere }] of READ_AS)
    if (anywhere) out = out.replaceAll(word, `<phoneme alphabet="sapi" ph="${ph}">${word}</phoneme>`);
  return out;
}

/** textSsml is the SSML that reads one line aloud, a word or a sentence. */
export function textSsml(text: string): string {
  return speak(readAs(text.replace(/\s+/gu, " ").trim()));
}

/**
 * syllableSsml is the SSML that says one syllable in a tone, written in the SAPI phone set of Azure AI Speech, where ü
 * is v: a character with that reading carries it, and the phoneme makes sure of the reading of one with several.
 */
export function syllableSsml(char: string, plain: string, tone: number): string {
  return speak(`<phoneme alphabet="sapi" ph="${plain.replaceAll("ü", "v")} ${tone}">${escapeXml(char)}</phoneme>`);
}

/** recordingName names the recording made from some SSML: 16 hex digits of its 64-bit FNV-1a hash. */
export function recordingName(ssml: string): string {
  let h = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(ssml)) h = BigInt.asUintN(64, (h ^ BigInt(byte)) * 0x100000001b3n);
  return h.toString(16).padStart(16, "0");
}

/** Format is how a recording is encoded: Azure AI Speech's name for it and the file's extension. */
export interface Format {
  readonly azure: string;
  readonly ext: "mp3" | "wav";
}

/** MP3 is 24 kHz mono MP3 at 48 kbit/s, ample for speech, which both apps play. */
export const MP3: Format = { azure: "audio-24khz-48kbitrate-mono-mp3", ext: "mp3" };

/** RecordingKind is what a recording reads: a syllable, a word or a sentence. */
export type RecordingKind = "syllable" | "word" | "sentence";

/** Wanted is a recording the content asks for: what it reads, and the SSML and format it is made in. */
export interface Wanted {
  readonly kind: RecordingKind;
  readonly ssml: string;
  readonly format: Format;
}

/** fileName is the file of the recording of some SSML in a format: its name and the format's extension. */
export const fileName = (ssml: string, format: Format): string => `${recordingName(ssml)}.${format.ext}`;

/** wanted maps the file of each recording the content asks for to how it is made; it fills as the content modules build. */
const wanted = new Map<string, Wanted>();

/** wantedRecordings are the recordings the content asks for, made or not, by file name. */
export const wantedRecordings = (): ReadonlyMap<string, Wanted> => wanted;

/** want asks for a recording and gives its path, made or not. */
function want(kind: RecordingKind, ssml: string): string {
  const file = fileName(ssml, MP3);
  if (!wanted.has(file)) wanted.set(file, { kind, ssml, format: MP3 });
  return `audio/chinese/${recordingName(ssml)}`;
}

/**
 * heard asks for the recording of a word or sentence that a listening problem plays, and gives its path whether it is
 * made or not: a test fails while one is missing, since the problem cannot be answered without it.
 */
export const heard = (text: string): string => want([...text.trim()].length > 4 ? "sentence" : "word", textSsml(text));

/** heardSyllable asks for the recording of a syllable in a tone, carried by a character with that reading, and gives its path. */
export const heardSyllable = (char: string, plain: string, tone: number): string => want("syllable", syllableSsml(char, plain, tone));
