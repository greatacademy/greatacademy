/**
 * The client of the voice service's conversation WebSocket (apps/voice/src/ga_voice/messages.py).
 * Audio travels as binary messages of 16-bit little-endian mono PCM at SAMPLE_RATE in both
 * directions, and everything else as JSON text messages with a type.
 *
 * It follows what the voice client of the Mavio project learned:
 * - The AudioContext runs at the device's own rate, made in the press that opens the microphone so
 *   that it may play: a context forced to 16 kHz cannot take a microphone at another rate in
 *   Firefox. An AudioWorklet resamples to 16 kHz, averaging over each output sample's span so that
 *   what is above 8 kHz does not fold into speech, and posts 20 ms frames.
 * - The tutor's audio plays through the same context, whose output is what the browser's echo
 *   cancellation removes, so that the tutor does not hear itself.
 * - A microphone that gives nothing but digital silence for two seconds, as a muted or virtual input
 *   such as a loopback device does, is replaced by another, the system's default first; the one then
 *   heard is asked for exactly next time, since a browser ranks its own choice above an ideal one.
 * - Audio said before the socket is ready is held and sent once it is.
 */

/** SAMPLE_RATE is the rate of audio in both directions, in hertz. */
export const SAMPLE_RATE = 16_000;

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
  /** capturing tells the microphone's first audio other than digital silence came: what is said from now on is heard. */
  capturing?(): void;
  /** silent tells every microphone gave nothing but digital silence; device names the first. */
  silent?(device: string): void;
}

/** microphoneAllowed tells whether the page may open the microphone: browsers give it only to secure pages. */
export function microphoneAllowed(): boolean {
  return typeof window !== "undefined" && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia;
}

/** isDenied tells whether an error opening the microphone is its refusal, or its absence. */
export function isDenied(err: unknown): boolean {
  return err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "NotFoundError");
}

const worklet = `
class Capture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ratio = sampleRate / ${SAMPLE_RATE};
    this.acc = 0; this.sum = 0; this.count = 0;
    this.out = new Int16Array(${SAMPLE_RATE / 50}); this.n = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      this.sum += ch[i]; this.count++; this.acc += 1;
      if (this.acc < this.ratio) continue;
      this.acc -= this.ratio;
      const s = Math.max(-1, Math.min(1, this.sum / this.count));
      this.sum = 0; this.count = 0;
      this.out[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.n === this.out.length) {
        this.port.postMessage(this.out.buffer, [this.out.buffer]);
        this.out = new Int16Array(${SAMPLE_RATE / 50}); this.n = 0;
      }
    }
    return true;
  }
}
registerProcessor("ga-capture", Capture);
`;

/** SILENT_FRAMES is how many 20 ms frames of digital silence tell a microphone is silent. */
const SILENT_FRAMES = 100;

const microphoneKey = "ga.voice.microphone";

function constraints(deviceId?: ConstrainDOMString): MediaTrackConstraints {
  return { deviceId, channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true };
}

function storedMicrophone(): string | undefined {
  try {
    return localStorage.getItem(microphoneKey) ?? undefined;
  } catch {
    return undefined;
  }
}

/** openMicrophone opens the microphone heard before, asked for exactly, else the browser's choice. */
async function openMicrophone(): Promise<MediaStream> {
  const stored = storedMicrophone();
  if (stored) {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: constraints({ exact: stored }) });
    } catch (err) {
      // A refusal is the browser's choice's too; a microphone gone is not.
      if (err instanceof DOMException && err.name === "NotAllowedError") throw err;
    }
  }
  return navigator.mediaDevices.getUserMedia({ audio: constraints() });
}

/** loudness is how loud an analyser's signal is now, from 0 to about 1. */
function loudness(a: AnalyserNode, buf: Float32Array<ArrayBuffer>): number {
  a.getFloatTimeDomainData(buf);
  let sum = 0;
  for (const v of buf) sum += v * v;
  // Speech's RMS spans roughly 0.01 to 0.3: its square root spreads it out.
  return Math.min(1, Math.sqrt(Math.sqrt(sum / buf.length)) * 1.5);
}

/** Playback plays the tutor's speech as it arrives, which an interruption drops. */
class Playback {
  private next = 0;
  private sources: AudioBufferSourceNode[] = [];
  readonly analyser: AnalyserNode;
  private readonly out: GainNode;
  private readonly ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.out = ctx.createGain();
    this.out.connect(ctx.destination);
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.out.connect(this.analyser);
  }

  /** push plays 16-bit PCM after what was queued. */
  push(pcm: ArrayBuffer) {
    const samples = new Int16Array(pcm, 0, Math.floor(pcm.byteLength / 2));
    if (samples.length === 0) return;
    const buffer = this.ctx.createBuffer(1, samples.length, SAMPLE_RATE);
    const ch = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) ch[i] = samples[i]! / 0x8000;
    const node = this.ctx.createBufferSource();
    node.buffer = buffer;
    node.connect(this.out);
    const start = Math.max(this.next, this.ctx.currentTime);
    node.start(start);
    this.next = start + buffer.duration;
    this.sources.push(node);
    node.onended = () => {
      this.sources = this.sources.filter((s) => s !== node);
    };
  }

  /** left is how long the speech queued still plays, in seconds. */
  left(): number {
    return Math.max(0, this.next - this.ctx.currentTime);
  }

  /** drop stops what was not yet played. */
  drop() {
    for (const s of this.sources) {
      try {
        s.stop();
      } catch {
        // Not started yet.
      }
    }
    this.sources = [];
    this.next = 0;
  }
}

/**
 * VoiceSession is one conversation from the client's side: capture opens
 * the microphone, which the page can show the level of before it connects;
 * connect opens the WebSocket with a ticket and sends the microphone once it is open.
 */
export class VoiceSession {
  private ws?: WebSocket;
  private connecting = false;
  private pending: ArrayBuffer[] = [];
  private ended = false;
  private captured = false;
  private zeros = 0;
  private readonly tried = new Set<string>();
  private switching = false;
  private switched?: string;
  private node?: AudioWorkletNode;
  private source?: MediaStreamAudioSourceNode;
  private ready = false;
  private readonly playback: Playback;
  private input?: AnalyserNode;
  private readonly buf = new Float32Array(512);
  private h: VoiceHandlers;
  private media: MediaStream;
  private readonly ctx: AudioContext;

  private constructor(media: MediaStream, ctx: AudioContext, h: VoiceHandlers) {
    this.media = media;
    this.ctx = ctx;
    this.h = h;
    this.playback = new Playback(ctx);
  }

  /** capture opens the microphone; call it in the press that asks for it. It fails when the microphone is refused or missing. */
  static async capture(h: VoiceHandlers): Promise<VoiceSession> {
    const ctx = new AudioContext();
    const url = URL.createObjectURL(new Blob([worklet], { type: "text/javascript" }));
    const loaded = ctx.audioWorklet.addModule(url);
    let media: MediaStream;
    try {
      [media] = await Promise.all([openMicrophone(), loaded]);
    } catch (err) {
      void ctx.close().catch(() => {});
      throw err;
    } finally {
      URL.revokeObjectURL(url);
    }
    const v = new VoiceSession(media, ctx, h);
    try {
      v.node = new AudioWorkletNode(ctx, "ga-capture");
      v.node.port.onmessage = (e: MessageEvent<ArrayBuffer>) => v.audio(e.data);
      v.input = ctx.createAnalyser();
      v.input.fftSize = 512;
      v.listen(media);
    } catch (err) {
      v.release();
      throw err;
    }
    return v;
  }

  /** handle replaces what the session tells. */
  handle(h: VoiceHandlers) {
    this.h = h;
  }

  /** inputLevel is how loud the microphone is now, from 0 to about 1. */
  inputLevel(): number {
    return this.input && !this.ended ? loudness(this.input, this.buf) : 0;
  }

  /** outputLevel is how loud the tutor is now, from 0 to about 1. */
  outputLevel(): number {
    return this.ended ? 0 : loudness(this.playback.analyser, this.buf);
  }

  /** connect opens the WebSocket at url and sends the ticket first; what the learner says meanwhile is held. */
  connect(url: string, ticket: string) {
    if (this.ended || this.connecting) return;
    this.connecting = true;
    void this.ctx.resume();
    const ws = new WebSocket(url);
    this.ws = ws;
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "start", ticket }));
      for (const b of this.pending.splice(0)) ws.send(b);
    };
    ws.onmessage = (e: MessageEvent<ArrayBuffer | string>) => this.message(e.data);
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

  private audio(pcm: ArrayBuffer) {
    if (this.ended) return;
    const heard = new Int16Array(pcm).some((x) => x !== 0);
    if (!this.captured && heard) {
      this.captured = true;
      this.h.capturing?.();
    }
    if (this.zeros >= 0 && !this.switching) {
      this.zeros = heard ? -1 : this.zeros + 1;
      if (this.zeros < 0 && this.switched !== undefined) {
        try {
          localStorage.setItem(microphoneKey, this.switched);
        } catch {
          // Only the next session's choice is lost.
        }
      }
      // A real microphone's noise is never all zeros for 2 s: another is tried.
      if (this.zeros === SILENT_FRAMES) void this.another();
    }
    if (!this.connecting) return;
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(pcm);
    else if (this.ws?.readyState === WebSocket.CONNECTING) this.pending.push(pcm);
  }

  /** listen captures a microphone's stream, in place of the one before. */
  private listen(media: MediaStream) {
    this.source?.disconnect();
    if (media !== this.media) for (const t of this.media.getTracks()) t.stop();
    this.media = media;
    const group = media.getAudioTracks()[0]?.getSettings().groupId;
    if (group) this.tried.add(group);
    this.source = this.ctx.createMediaStreamSource(media);
    this.source.connect(this.node!);
    this.source.connect(this.input!);
  }

  /** another opens a microphone other than the silent ones, the system's own first, and tells when none is left. */
  private async another() {
    const first = this.media.getAudioTracks()[0]?.label ?? "";
    this.switching = true;
    try {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
        (d) => d.kind === "audioinput" && !this.tried.has(d.groupId),
      );
      devices.sort((a, b) => Number(b.deviceId === "default") - Number(a.deviceId === "default"));
      for (const d of devices) {
        if (this.ended) return;
        let media: MediaStream;
        try {
          media = await navigator.mediaDevices.getUserMedia({ audio: constraints({ exact: d.deviceId }) });
        } catch {
          this.tried.add(d.groupId);
          continue;
        }
        if (this.ended) {
          for (const t of media.getTracks()) t.stop();
          return;
        }
        this.tried.add(d.groupId);
        this.switched = d.deviceId;
        this.zeros = 0;
        this.listen(media);
        return;
      }
      this.zeros = -1;
      this.h.silent?.(this.tried.size > 1 ? "" : first);
    } finally {
      this.switching = false;
    }
  }

  private message(data: ArrayBuffer | string) {
    if (typeof data !== "string") {
      this.playback.push(data);
      return;
    }
    let m: ServerMessage;
    try {
      m = JSON.parse(data) as ServerMessage;
    } catch {
      return;
    }
    if (m.type === "ready") this.ready = true;
    if (m.type === "interrupted") this.playback.drop();
    this.h.message(m);
  }

  private release() {
    for (const t of this.media.getTracks()) t.stop();
    this.node?.disconnect();
    this.source?.disconnect();
    // The tutor's last words finish before the context closes.
    const left = this.playback.left();
    window.setTimeout(() => void this.ctx.close().catch(() => {}), left * 1000 + 200);
  }

  private end() {
    if (this.ended) return;
    this.ended = true;
    this.release();
    this.ws?.close();
    this.h.closed(this.connecting && !this.ready);
  }
}
