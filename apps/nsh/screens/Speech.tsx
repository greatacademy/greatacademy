import type { Feedback, Question, Session, SpeechInput } from "@ga/proto/learning/v1/learning_pb";
import { cleanup, signal, Text, View } from "nsh";

import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { markChanged, query } from "../lib/query.ts";
import { learning, timeZone } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, Muted, Quiet, Skeleton, Toggle } from "../lib/ui.tsx";
import { isDenied, pcmOf, VoiceSession, voiceAvailable, wavOf } from "../lib/voice.ts";
import { Bar } from "./SubjectCards.tsx";

/** heardText is what a speech service heard, from a spoken answer's response; any other response is shown as it is. */
export function heardText(response: string): string {
  try {
    const v = JSON.parse(response) as { text?: unknown };
    return typeof v.text === "string" ? v.text : response;
  } catch {
    return response;
  }
}

/** FRAME_SECONDS is the length of one frame of the microphone. */
const FRAME_SECONDS = 0.02;

/** NO_FRAMES_MS is how long a recording waits for the microphone's first frame before it counts the microphone as stopped. */
const NO_FRAMES_MS = 1500;

type Phase = { kind: "idle" } | { kind: "recording"; started: number } | { kind: "recorded"; pcm: Uint8Array };

/**
 * SpeechFlow answers a spoken question, as on the web: the learner records,
 * may play the recording back, and sends it; the server has it heard and checks
 * what was heard. Recording stops by itself at the question's limit. The
 * recording stays on the device until it is sent, and is never stored; "Can't
 * speak now" turns speaking off for the day and leaves the lesson.
 */
export function SpeechFlow(props: {
  session: Session;
  question: Question;
  input: SpeechInput;
  onAnswered: (feedback: Feedback | undefined, next: Session, response: string) => void;
}) {
  const max = props.input.maxSeconds;
  const phase = signal<Phase>({ kind: "idle" });
  const problem = signal("");
  const again = signal("");
  const error = signal("");
  const busy = signal(false);
  const level = signal(0);
  const now = signal(0);
  let voice: VoiceSession | undefined;
  let frames: Uint8Array[] = [];
  let recording = false;
  let gone = false;
  // A microphone that went silent or stopped giving frames, as when another device took it or a call interrupted it,
  // is opened afresh for the next recording instead of being kept.
  let stale = false;

  const drop = () => {
    voice?.close();
    voice = undefined;
    stale = false;
  };

  const stop = () => {
    recording = false;
    const pcm = pcmOf(frames);
    frames = [];
    if (pcm.byteLength > 0) return phase.set({ kind: "recorded", pcm });
    drop();
    phase.set({ kind: "idle" });
    if (!problem()) problem.set(m().micFailed);
  };

  const timer = setInterval(() => {
    if (!recording) return;
    level.set(voice?.inputLevel() ?? 0);
    now.set(Date.now());
    const p = phase();
    if (frames.length * FRAME_SECONDS >= max) stop();
    else if (frames.length === 0 && p.kind === "recording" && Date.now() - p.started > NO_FRAMES_MS) stop();
  }, 50);
  // Leaving the screen closes the microphone and drops the recording.
  cleanup(() => {
    gone = true;
    clearInterval(timer);
    voice?.close();
  });

  const start = async () => {
    problem.set("");
    again.set("");
    error.set("");
    if (!voiceAvailable()) return problem.set(m().micUnsupported);
    if (stale) drop();
    try {
      // The microphone stays open while the question is shown, so a recording can be played back through it.
      voice ??= await VoiceSession.capture({
        message() {},
        closed() {},
        frame(pcm) {
          if (recording) frames.push(pcm);
        },
        silent: (device) => {
          stale = true;
          problem.set(m().micSilent(device));
        },
      });
      if (gone) return voice.close();
      frames = [];
      recording = true;
      phase.set({ kind: "recording", started: Date.now() });
    } catch (err) {
      problem.set(isDenied(err) ? m().micDenied : m().micFailed);
    }
  };

  const send = async (pcm: Uint8Array) => {
    if (busy()) return;
    busy.set(true);
    error.set("");
    try {
      const res = await learning.submitAnswer({ sessionId: props.session.id, index: props.question.index, audio: wavOf(pcm) });
      if (res.recordAgain) {
        again.set(tx(res.recordAgain));
        phase.set({ kind: "idle" });
        return;
      }
      if (!res.session) return;
      voice?.close();
      voice = undefined;
      props.onAnswered(res.feedback, res.session, res.feedback?.heard ?? "");
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };

  const cantSpeak = async () => {
    busy.set(true);
    try {
      await learning.setSpeaking({ on: false, todayOnly: true, timeZone: timeZone() });
      markChanged();
      nav.pop();
    } catch (e) {
      error.set(errorText(e));
      busy.set(false);
    }
  };

  const current = () => phase();
  const recorded = () => {
    const p = phase();
    return p.kind === "recorded" ? p : undefined;
  };
  const seconds = () => {
    const p = current();
    return p.kind === "recording" ? Math.min(max, Math.floor((now() - p.started) / 1000)) : 0;
  };
  return (
    <View style={{ gap: 16 }}>
      <If when={props.input.text}>
        {(text) => (
          <Card>
            <Muted>{props.input.mode === "read" ? m().readAloudThis : m().repeatThis}</Muted>
            <Text style={{ color: colors().ink, fontSize: 22, lineHeight: 32 }}>{text()}</Text>
          </Card>
        )}
      </If>
      <Muted>{m().sayLimit(max)}</Muted>
      <If
        when={current().kind === "recording"}
        else={
          <View style={{ gap: 10 }}>
            <Action label={current().kind === "recorded" ? m().recordAgain : m().record} disabled={busy()} onPress={() => void start()} />
            <If when={recorded()}>
              {(recorded) => (
                <View style={{ gap: 10 }}>
                  <Quiet label={m().playBack} onPress={() => voice?.play(recorded().pcm)} />
                  <Action label={m().submit} disabled={busy()} onPress={() => void send(recorded().pcm)} />
                </View>
              )}
            </If>
          </View>
        }
      >
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors().bad, fontSize: 15 }}>{m().recordingNow(seconds(), max)}</Text>
          <Bar share={level()} color={colors().accent} />
          <Action label={m().stopRecording} onPress={stop} />
        </View>
      </If>
      <If when={again()}>
        <Text style={{ color: colors().bad, fontSize: 15 }}>{again()}</Text>
      </If>
      <If when={problem()}>
        <Text style={{ color: colors().bad, fontSize: 15 }}>{problem()}</Text>
      </If>
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
      <View style={{ borderColor: colors().line, borderTopWidth: 1, gap: 4, paddingTop: 12 }}>
        <Quiet label={m().cantSpeak} disabled={busy() || current().kind === "recording"} onPress={() => void cantSpeak()} />
        <Muted>{m().cantSpeakNote}</Muted>
      </View>
    </View>
  );
}

/** SpeakingSettings turns speaking questions on or off, as the web's settings do; it says when no speech service serves the account. */
export function SpeakingSettings() {
  const profile = query(
    () => "profile",
    () => ["profile", "speaking"],
    (_, { signal: abort }) => learning.getProfile({ timeZone: timeZone() }, { signal: abort }),
  );
  const busy = signal(false);
  const error = signal("");
  const set = async (on: boolean) => {
    busy.set(true);
    error.set("");
    try {
      await learning.setSpeaking({ on, todayOnly: false, timeZone: timeZone() });
      profile.refetch();
      markChanged();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <View style={{ gap: 12 }}>
      <If when={profile()} else={<Skeleton rows={1} />}>
        {(p) => (
          <If when={p().speakingAvailable} else={<Muted>{m().speakingUnavailable}</Muted>}>
            <Toggle label={m().speakingSetting} checked={p().speaking} disabled={busy()} onChange={(on) => void set(on)} />
            <Muted>{p().speaking ? m().speakingOn : p().speakingBackTomorrow ? m().speakingOffToday : m().speakingOffNote}</Muted>
          </If>
        )}
      </If>
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
    </View>
  );
}
