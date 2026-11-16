import type { Feedback, Question, Session, SpeechInput } from "@ga/proto/learning/v1/learning_pb";
import { Microphone, Play, Stop } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { errorText } from "../lib/privacy-text.ts";
import { learning, timeZone } from "../lib/rpc.ts";
import { isDenied, microphoneAllowed, VoiceSession, wavOf } from "../lib/voice.ts";
import { Button, ErrorNote } from "./ui.tsx";

/** heardText is what a speech service heard, from a spoken answer's response; any other response is shown as it is. */
export function heardText(response: string): string {
  try {
    const v = JSON.parse(response) as { text?: unknown };
    return typeof v.text === "string" ? v.text : response;
  } catch {
    return response;
  }
}

type Phase = { kind: "idle" } | { kind: "recording"; started: number } | { kind: "recorded"; wav: Uint8Array<ArrayBuffer>; url: string };

/**
 * SpeechFlow answers a spoken question: the learner records, may play the
 * recording back, and sends it; the server has it heard and checks what was
 * heard. Recording stops by itself at the question's limit. The recording stays
 * in the page and is never stored; "Can't speak now" turns speaking off for
 * the day and leaves the lesson.
 */
export function SpeechFlow({
  session,
  question,
  input,
  onAnswered,
}: {
  session: Session;
  question: Question;
  input: SpeechInput;
  onAnswered(feedback: Feedback | undefined, next: Session, response: string): void;
}) {
  const { m, tx, locale } = useI18n();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [problem, setProblem] = useState<string>();
  const [again, setAgain] = useState<string>();
  const [level, setLevel] = useState(0);
  const [now, setNow] = useState(0);
  const voice = useRef<VoiceSession>(undefined);
  const frames = useRef<ArrayBuffer[]>([]);
  const max = input.maxSeconds;

  const stop = () => {
    const v = voice.current;
    voice.current = undefined;
    v?.close();
    const pcm = frames.current;
    frames.current = [];
    if (pcm.length === 0) return setPhase({ kind: "idle" });
    const wav = wavOf(pcm);
    setPhase({ kind: "recorded", wav, url: URL.createObjectURL(new Blob([wav], { type: "audio/wav" })) });
  };

  const start = async () => {
    setProblem(undefined);
    setAgain(undefined);
    if (!microphoneAllowed()) return setProblem(m.micInsecure);
    frames.current = [];
    try {
      voice.current = await VoiceSession.capture({
        message() {},
        closed() {},
        frame(pcm) {
          frames.current.push(pcm);
        },
        silent(device) {
          setProblem(m.micSilent(device));
        },
      });
      setPhase({ kind: "recording", started: Date.now() });
    } catch (err) {
      setProblem(isDenied(err) ? m.micDenied : m.error);
    }
  };

  const stopping = useRef(stop);
  stopping.current = stop;

  // While recording, the level and the time show, and the limit stops it.
  useEffect(() => {
    if (phase.kind !== "recording") return;
    let frame = 0;
    const tick = () => {
      setLevel(voice.current?.inputLevel() ?? 0);
      setNow(Date.now());
      if (frames.current.length * 0.02 >= max) return stopping.current();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, max]);

  // Leaving the page closes the microphone and frees the recording.
  useEffect(() => () => voice.current?.close(), []);
  useEffect(() => () => (phase.kind === "recorded" ? URL.revokeObjectURL(phase.url) : undefined), [phase]);

  const send = useMutation({
    mutationFn: (wav: Uint8Array<ArrayBuffer>) => learning.submitAnswer({ sessionId: session.id, index: question.index, audio: wav }),
    onSuccess: (res) => {
      if (res.recordAgain) {
        setAgain(tx(res.recordAgain));
        setPhase({ kind: "idle" });
        return;
      }
      const next = res.session!;
      if (next.step.case === "result") {
        void qc.invalidateQueries({ queryKey: ["dashboard", session.courseId] });
        void qc.invalidateQueries({ queryKey: ["progress", session.courseId] });
      }
      onAnswered(res.feedback, next, res.feedback?.heard ?? "");
    },
  });

  const cantSpeak = useMutation({
    mutationFn: () => learning.setSpeaking({ on: false, todayOnly: true, timeZone: timeZone() }),
    onSuccess: () => {
      void qc.invalidateQueries();
      void navigate({ to: "/" });
    },
  });

  const seconds = phase.kind === "recording" ? Math.min(max, Math.floor((now - phase.started) / 1000)) : 0;
  return (
    <div className="space-y-4">
      {input.text && (
        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <div className="text-xs font-medium tracking-wide text-muted uppercase">
            {input.mode === "read" ? m.readAloudThis : m.repeatThis}
          </div>
          <p className="mt-1 text-xl leading-relaxed">{input.text}</p>
        </div>
      )}
      <p className="text-sm text-muted">{m.sayLimit(max)}</p>
      <div className="flex flex-wrap items-center gap-3">
        {phase.kind === "recording" ? (
          <Button onClick={stop} className="px-6" aria-label={m.stopRecording}>
            <Stop size={18} weight="fill" /> {m.stopRecording}
          </Button>
        ) : (
          <Button
            variant={phase.kind === "recorded" ? "secondary" : "primary"}
            onClick={() => void start()}
            disabled={send.isPending}
            className="px-6"
          >
            <Microphone size={18} weight="fill" /> {phase.kind === "recorded" ? m.recordAgain : m.record}
          </Button>
        )}
        {phase.kind === "recorded" && (
          <>
            <Button variant="secondary" onClick={() => void new Audio(phase.url).play()} disabled={send.isPending}>
              <Play size={18} /> {m.playBack}
            </Button>
            <Button onClick={() => send.mutate(phase.wav)} disabled={send.isPending} className="px-6">
              {m.submit}
            </Button>
          </>
        )}
      </div>
      {phase.kind === "recording" && (
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <span className="h-3 w-3 animate-pulse rounded-full bg-bad" aria-hidden />
          <span className="text-sm">{m.recordingNow(seconds, max)}</span>
          <span className="h-2 w-32 overflow-hidden rounded-full bg-line" aria-hidden>
            <span className="block h-full bg-accent transition-[width]" style={{ width: `${Math.round(level * 100)}%` }} />
          </span>
        </div>
      )}
      {again && <p className="text-sm text-bad">{again}</p>}
      {problem && <p className="text-sm text-bad">{problem}</p>}
      {send.isError && <ErrorNote message={errorText(send.error, locale, m.error)} />}
      <div className="border-t border-line pt-3">
        <Button variant="secondary" onClick={() => cantSpeak.mutate()} disabled={cantSpeak.isPending || phase.kind === "recording"}>
          {m.cantSpeak}
        </Button>
        <p className="mt-1 text-xs text-muted">{m.cantSpeakNote}</p>
      </div>
    </div>
  );
}
