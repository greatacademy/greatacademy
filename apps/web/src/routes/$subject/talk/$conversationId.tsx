import { ArrowLeft, Microphone, PhoneDisconnect } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { conversationsQuery } from "../../../components/Conversations.tsx";
import { LoadError } from "../../../components/LoadError.tsx";
import { Bar, Button, buttonClass, Card, ErrorNote, Spinner } from "../../../components/ui.tsx";
import { useI18n } from "../../../lib/i18n.tsx";
import { conversation } from "../../../lib/rpc.ts";
import { useSubjectPlace } from "../../../lib/subject.tsx";
import { isDenied, microphoneAllowed, VoiceSession } from "../../../lib/voice.ts";

export const Route = createFileRoute("/$subject/talk/$conversationId")({ component: Talk });

type Phase = "check" | "connecting" | "live" | "over";

interface Caption {
  /** n is the caption's place in the conversation, which keys it. */
  readonly n: number;
  readonly speaker: "learner" | "tutor";
  readonly text: string;
}

/** Talk is one spoken conversation with the AI tutor: a microphone check, live captions, and how it went. */
function Talk() {
  const { subject, conversationId } = Route.useParams();
  const courseId = useSubjectPlace()?.enrollment?.courseId ?? "";
  const { m, tx } = useI18n();
  const list = useQuery({ ...conversationsQuery(courseId), enabled: !!courseId });
  const [phase, setPhase] = useState<Phase>("check");
  const [voice, setVoice] = useState<VoiceSession>();
  const [problem, setProblem] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [reason, setReason] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [level, setLevel] = useState(0);
  const [tutorLevel, setTutorLevel] = useState(0);
  const end = useRef<HTMLDivElement>(null);

  // The microphone and the socket close when the page is left.
  useEffect(() => () => voice?.close(), [voice]);

  useEffect(() => {
    if (!voice || phase === "over") return;
    let frame = 0;
    const tick = () => {
      setLevel(voice.inputLevel());
      setTutorLevel(voice.outputLevel());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [voice, phase]);

  const count = captions.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new caption scrolls the list.
  useEffect(() => {
    // Recent browsers' scrollIntoView returns a promise, which an effect must not.
    void end.current?.scrollIntoView({ block: "nearest" });
  }, [count]);

  const result = useQuery({
    queryKey: ["conversation", sessionId],
    queryFn: () => conversation.getConversation({ sessionId }),
    enabled: phase === "over" && !!sessionId,
    // The voice service writes the result just after the socket closes.
    refetchInterval: (q) => (q.state.data?.session?.status === "active" && q.state.dataUpdateCount < 10 ? 1000 : false),
  });

  if (list.isPending) return <Spinner label={m.loading} />;
  if (list.isError) return <LoadError error={list.error} onRetry={() => list.refetch()} />;
  const conv = list.data.conversations.find((c) => c.id === conversationId);
  const back = (
    <Link to="/$subject" params={{ subject }} className={buttonClass("ghost", "-ml-4")}>
      <ArrowLeft size={16} /> {m.backToLearn}
    </Link>
  );
  if (!conv)
    return (
      <div className="space-y-4">
        {back}
        <p className="text-muted">{m.conversationNotOffered}</p>
      </div>
    );

  async function allow() {
    setProblem("");
    if (!microphoneAllowed()) {
      setProblem(m.micUnsupported);
      return;
    }
    try {
      const v = await VoiceSession.capture({
        message() {},
        closed() {},
        silent: (device) => setProblem(m.micSilent(device)),
      });
      setVoice(v);
    } catch (err) {
      setProblem(isDenied(err) ? m.micBlocked : m.conversationRefused(""));
    }
  }

  async function begin() {
    if (!voice) return;
    setProblem("");
    setPhase("connecting");
    let started: Awaited<ReturnType<typeof conversation.startConversation>>;
    try {
      started = await conversation.startConversation({ courseId, conversationId });
    } catch {
      setProblem(m.conversationRefused(""));
      setPhase("check");
      void list.refetch();
      return;
    }
    setSessionId(started.sessionId);
    let refused = "";
    voice.handle({
      message(msg) {
        if (msg.type === "ready") setPhase("live");
        else if (msg.type === "caption") setCaptions((c) => [...c, { n: c.length, speaker: msg.speaker, text: msg.text }]);
        else if (msg.type === "ended") setReason(msg.reason);
        else if (msg.type === "error") refused = msg.code;
      },
      closed(failed) {
        if (failed || refused) setProblem(m.conversationRefused(refused));
        setPhase("over");
        void list.refetch();
      },
      silent: (device) => setProblem(m.micSilent(device)),
    });
    voice.connect(started.url, started.ticket);
  }

  const session = result.data?.session;
  const lines = result.data?.lines ?? [];
  const shown: readonly Caption[] =
    lines.length > 0 ? lines.map((l, n) => ({ n, speaker: l.speaker === "tutor" ? "tutor" : "learner", text: l.text })) : captions;
  const ended = session?.status === "ended" ? session.reason : reason;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        {back}
        <h1 className="text-2xl font-semibold tracking-tight">{tx(conv.title)}</h1>
      </div>
      <Card className="space-y-1 p-4">
        <div className="text-sm font-medium text-muted">{m.yourTask}</div>
        <p>{tx(conv.task)}</p>
        <p className="text-sm text-muted">{m.aboutMinutes(conv.minutes)}</p>
      </Card>
      {problem && <ErrorNote message={problem} />}

      {phase === "check" && (
        <Card className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Microphone size={20} /> {m.micCheck}
          </h2>
          <p className="text-sm text-muted">{m.micCheckBody}</p>
          {voice ? (
            <>
              <Bar value={level} className="bg-good" />
              <Button onClick={() => void begin()} disabled={!conv.available}>
                {m.beginConversation}
              </Button>
              {!conv.available && (
                <p className="text-sm text-muted">
                  {list.data.unavailable === "daily-limit" ? m.conversationsDailyLimit : m.conversationNotOffered}
                </p>
              )}
            </>
          ) : (
            <Button onClick={() => void allow()}>{m.micAllow}</Button>
          )}
        </Card>
      )}

      {phase === "connecting" && <Spinner label={m.connecting} />}

      {(phase === "live" || phase === "over") && (
        <Card className="space-y-4">
          {phase === "live" && (
            <div className="space-y-3">
              <p className="text-sm text-muted">{m.yourTurn}</p>
              <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-sm">
                <span className="text-muted">{m.tutor}</span>
                <Bar value={tutorLevel} />
                <span className="text-muted">{m.you}</span>
                <Bar value={level} className="bg-good" />
              </div>
            </div>
          )}
          {phase === "over" && (
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{m.conversationOver}</h2>
              {ended && <p className="text-sm text-muted">{m.endReasons[ended] ?? ""}</p>}
              {session && session.status === "ended" && (
                <p className="text-sm text-muted">
                  {m.youSaid(session.learnerLines)} · {m.minutes(Math.max(1, Math.round(session.durationSecs / 60)))}
                </p>
              )}
              {session?.status === "ended" && lines.length === 0 && captions.length > 0 && (
                <p className="text-sm text-muted">{m.transcriptNotKept}</p>
              )}
            </div>
          )}
          <div className="max-h-[50vh] space-y-2 overflow-y-auto" aria-live="polite">
            {shown.map((c) => (
              <div key={c.n} className={c.speaker === "tutor" ? "pr-8" : "pl-8 text-right"}>
                <div className="text-xs text-muted">{c.speaker === "tutor" ? m.tutor : m.you}</div>
                <div className={`inline-block rounded-xl px-3 py-2 ${c.speaker === "tutor" ? "bg-accent-soft" : "bg-line/50"}`}>
                  {c.text}
                </div>
              </div>
            ))}
            <div ref={end} />
          </div>
          {phase === "live" ? (
            <Button variant="secondary" onClick={() => voice?.finish()}>
              <PhoneDisconnect size={16} /> {m.endConversation}
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {conv.available && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setVoice(undefined);
                    setCaptions([]);
                    setReason("");
                    setSessionId("");
                    setProblem("");
                    setPhase("check");
                  }}
                >
                  {m.talkAgain}
                </Button>
              )}
              <Link to="/$subject" params={{ subject }} className={buttonClass("ghost")}>
                {m.backToLearn}
              </Link>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
