import { Microphone } from "ga/voice";

/**
 * The app's client of the voice service's conversation WebSocket (apps/voice/src/ga_voice/messages.py), as the web
 * app's `lib/voice.ts`: audio travels as binary messages of 16-bit little-endian mono PCM at 16 kHz both ways, and
 * everything else as JSON text messages with a type. The device's microphone and speaker are `ga/voice`'s, which
 * capture with the system's echo cancellation and play through the same audio engine (native/voice); this side takes
 * what was captured every TICK_MS, holds it until the socket is open, and plays what the service sends.
 */

/** ServerMessage is a text message from the voice service. */
export type ServerMessage =
  | { type: "ready"; session: string; limit_secs: number }
  | { type: "caption"; speaker: "learner" | "tutor"; text: string }
  | { type: "interrupted" }
  | { type: "ended"; reason: string }
  | { type: "error"; code: string };

/** VoiceHandlers are what a voice session tells the page. */
export interface VoiceHandlers {
  /** message is every text message of the service. */
  message(m: ServerMessage): void;
  /** closed tells the session is over; failed is set when the service could not be reached. */
  closed(failed: boolean): void;
  /** silent tells the microphone gave nothing but digital silence for two seconds; device names it. */
  silent?(device: string): void;
  /** frame is every 20 ms frame of the microphone, as 16 kHz 16-bit PCM, sent or not: a recorder keeps them. */
  frame?(pcm: Uint8Array): void;
}

/** TICK_MS is how often the captured audio is taken, in milliseconds. */
const TICK_MS = 40;

/** FRAME_BYTES is one 20 ms frame of 16 kHz 16-bit audio. */
const FRAME_BYTES = 640;

/** SILENT_FRAMES is how many 20 ms frames of digital silence tell a microphone is silent. */
const SILENT_FRAMES = 100;

/** opened counts the microphone's openings, so that one session's late close leaves the next one's open. */
let opened = 0;

/** voiceAvailable tells whether this device can hold a conversation in the app. */
export function voiceAvailable(): boolean {
  return Microphone.available();
}

/** isDenied tells whether an error opening the microphone is its refusal. */
export function isDenied(err: unknown): boolean {
  return err instanceof Error && err.message === "denied";
}

/**
 * VoiceSession is one conversation from the app's side: capture opens the microphone, which the page can show the
 * level of before it connects; connect opens the WebSocket with a ticket and sends the microphone once it is open.
 */
export class VoiceSession {
  private ws?: WebSocket;
  private connecting = false;
  private pending: ArrayBuffer[] = [];
  private ended = false;
  private ready = false;
  private zeros = 0;
  private readonly timer: ReturnType<typeof setInterval>;
  private readonly opening: number;
  private h: VoiceHandlers;

  private constructor(h: VoiceHandlers) {
    this.h = h;
    this.opening = opened;
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  /** capture asks for the microphone and opens it; it fails with "denied" when it is refused. */
  static async capture(h: VoiceHandlers): Promise<VoiceSession> {
    opened++;
    await Microphone.open();
    return new VoiceSession(h);
  }

  /** handle replaces what the session tells. */
  handle(h: VoiceHandlers) {
    this.h = h;
  }

  /** inputLevel is how loud the microphone is now, from 0 to about 1. */
  inputLevel(): number {
    return this.ended ? 0 : Microphone.inputLevel();
  }

  /** outputLevel is how loud the tutor is now, from 0 to about 1. */
  outputLevel(): number {
    return this.ended ? 0 : Microphone.outputLevel();
  }

  /** play plays 16 kHz 16-bit PCM through the speaker, as a recorder plays a recording back. */
  play(pcm: Uint8Array) {
    if (this.ended) return;
    Microphone.stopPlaying();
    Microphone.play(pcm);
  }

  /** connect opens the WebSocket at url and sends the ticket first; what the learner says meanwhile is held. */
  connect(url: string, ticket: string) {
    if (this.ended || this.connecting) return;
    this.connecting = true;
    const ws = new WebSocket(url);
    this.ws = ws;
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "start", ticket }));
      for (const b of this.pending.splice(0)) ws.send(b);
    };
    ws.onmessage = (e) => this.message(e.data as ArrayBuffer | string);
    ws.onclose = () => this.end();
  }

  /** finish asks the service to end the conversation; it answers ended and closes. */
  finish() {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({ type: "end" }));
    else this.end();
  }

  /** close drops everything at once, as leaving the page does. */
  close() {
    this.end();
  }

  private tick() {
    if (this.ended) return;
    const pcm = Microphone.take();
    for (let at = 0; at + FRAME_BYTES <= pcm.byteLength; at += FRAME_BYTES) this.audio(pcm.slice(at, at + FRAME_BYTES));
  }

  private audio(frame: Uint8Array) {
    this.h.frame?.(frame);
    if (this.zeros >= 0) {
      const heard = frame.some((b) => b !== 0);
      this.zeros = heard ? -1 : this.zeros + 1;
      // A real microphone's noise is never all zeros for 2 s.
      if (this.zeros === SILENT_FRAMES) {
        this.zeros = -1;
        this.h.silent?.(Microphone.device());
      }
    }
    if (!this.connecting) return;
    const buffer = frame.buffer as ArrayBuffer;
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(buffer);
    else if (this.ws?.readyState === WebSocket.CONNECTING) this.pending.push(buffer);
  }

  private message(data: ArrayBuffer | string) {
    if (typeof data !== "string") {
      Microphone.play(new Uint8Array(data));
      return;
    }
    let m: ServerMessage;
    try {
      m = JSON.parse(data) as ServerMessage;
    } catch {
      return;
    }
    if (m.type === "ready") this.ready = true;
    if (m.type === "interrupted") Microphone.stopPlaying();
    this.h.message(m);
  }

  private end() {
    if (this.ended) return;
    this.ended = true;
    clearInterval(this.timer);
    this.ws?.close();
    // The tutor's last words finish before the audio stops.
    setTimeout(
      () => {
        if (opened === this.opening) Microphone.close();
      },
      Microphone.left() * 1000 + 200,
    );
    this.h.closed(this.connecting && !this.ready);
  }
}

/** SAMPLE_RATE is the rate of the audio both ways, in hertz. */
const SAMPLE_RATE = 16_000;

/** pcmOf joins 16-bit PCM frames into one. */
export function pcmOf(frames: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(frames.reduce((n, f) => n + f.byteLength, 0));
  let at = 0;
  for (const f of frames) {
    out.set(f, at);
    at += f.byteLength;
  }
  return out;
}

/** wavOf wraps 16-bit PCM at SAMPLE_RATE in a WAV header, the recording a spoken answer sends, as the web does. */
export function wavOf(pcm: Uint8Array): Uint8Array {
  const out = new Uint8Array(44 + pcm.byteLength);
  const view = new DataView(out.buffer);
  const put = (at: number, s: string) => {
    for (let i = 0; i < s.length; i++) out[at + i] = s.charCodeAt(i);
  };
  put(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  put(8, "WAVE");
  put(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  put(36, "data");
  view.setUint32(40, pcm.byteLength, true);
  out.set(pcm, 44);
  return out;
}
