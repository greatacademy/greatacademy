import type { Conversation, GetConversationResponse } from "@ga/proto/conversation/v1/conversation_pb";
import { cleanup, Scroll, type ScrollRef, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";
import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { markChanged, query } from "../lib/query.ts";
import { conversation } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, headerStyle, Loaded, Muted, Quiet, Skeleton } from "../lib/ui.tsx";
import { isDenied, VoiceSession, voiceAvailable } from "../lib/voice.ts";
import { Header } from "./Header.tsx";
import { Bar } from "./SubjectCards.tsx";

type Phase = "check" | "connecting" | "live" | "over";

interface Caption {
  readonly speaker: "learner" | "tutor";
  readonly text: string;
}

/** conversationsQuery reads the conversations of a course, which the Learn tab and the Talk page share. */
export function conversationsQuery(courseId: () => string | undefined) {
  return query(
    courseId,
    (id) => ["conversations", id],
    (id, { signal: abort }) => conversation.listConversations({ courseId: id }, { signal: abort }),
  );
}

/** Conversations lists the spoken conversations of the current course on the Learn tab, as the web does, when it offers any. */
export function Conversations(props: { courseId: string; visible: () => boolean }) {
  const rpc = conversationsQuery(() => (props.visible() && props.courseId) || undefined);
  const note = () => {
    const u = rpc()?.unavailable;
    return u === "voice-off" ? m().conversationsOff : u === "daily-limit" ? m().conversationsDailyLimit : "";
  };
  return (
    <If when={(rpc()?.conversations.length ?? 0) > 0}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600", marginTop: 4 }}>{m().conversations}</Text>
        <Muted>{note() || m().conversationsHint}</Muted>
        <Each of={rpc()?.conversations ?? []} key={(c) => c.id}>
          {(c) => (
            <Card>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "500" }}>{tx(c().title)}</Text>
                  <Muted>{c().available || note() ? m().aboutMinutes(c().minutes) : m().conversationNotOffered}</Muted>
                </View>
                <If when={c().available}>
                  <Quiet label={m().talk} onPress={() => nav.push({ name: "talk", courseId: props.courseId, conversationId: c().id })} />
                </If>
              </View>
            </Card>
          )}
        </Each>
      </View>
    </If>
  );
}

/** Line is one caption: the tutor's on the left, the learner's on the right. */
function Line(props: { caption: Caption }) {
  const tutor = () => props.caption.speaker === "tutor";
  return (
    <View
      style={{ alignItems: tutor() ? "flex-start" : "flex-end", gap: 2, paddingLeft: tutor() ? 0 : 32, paddingRight: tutor() ? 32 : 0 }}
    >
      <Muted>{tutor() ? m().tutor : m().you}</Muted>
      <View
        style={{
          backgroundColor: tutor() ? colors()["accent-soft"] : colors().line,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Text style={{ color: colors().ink, fontSize: 15 }}>{props.caption.text}</Text>
      </View>
    </View>
  );
}

/** Live is a conversation in progress or over: the levels, the captions and what to do next. */
function Live(props: { conv: Conversation; courseId: string }) {
  const phase = signal<Phase>("check");
  const voice = signal<VoiceSession | undefined>(undefined);
  const problem = signal("");
  const captions = signal<readonly Caption[]>([]);
  const reason = signal("");
  const result = signal<GetConversationResponse | undefined>(undefined);
  const level = signal(0);
  const tutorLevel = signal(0);
  let scroll: ScrollRef | undefined;
  let gone = false;

  const levels = setInterval(() => {
    const v = voice();
    if (!v || phase() === "over") return;
    level.set(v.inputLevel());
    tutorLevel.set(v.outputLevel());
  }, 50);
  cleanup(() => {
    gone = true;
    clearInterval(levels);
    voice()?.close();
  });

  const allow = async () => {
    problem.set("");
    if (!voiceAvailable()) {
      problem.set(m().micUnsupported);
      return;
    }
    try {
      const v = await VoiceSession.capture({ message() {}, closed() {}, silent: (device) => problem.set(m().micSilent(device)) });
      if (gone) v.close();
      else voice.set(v);
    } catch (err) {
      problem.set(isDenied(err) ? m().micBlocked : m().micFailed);
    }
  };

  // The voice service writes the result just after the socket closes, so it is read again a few times.
  const summarize = async (sessionId: string) => {
    for (let i = 0; i < 10 && !gone; i++) {
      try {
        const r = await conversation.getConversation({ sessionId });
        result.set(r);
        if (r.session?.status !== "active") return;
      } catch {
        return;
      }
      await new Promise((done) => setTimeout(done, 1000));
    }
  };

  const begin = async () => {
    const v = voice();
    if (!v) return;
    problem.set("");
    phase.set("connecting");
    let started: Awaited<ReturnType<typeof conversation.startConversation>>;
    try {
      started = await conversation.startConversation({ courseId: props.courseId, conversationId: props.conv.id });
    } catch {
      problem.set(m().conversationRefused(""));
      phase.set("check");
      return;
    }
    let refused = "";
    v.handle({
      message(msg) {
        if (msg.type === "ready") phase.set("live");
        else if (msg.type === "caption") {
          captions.set([...captions(), { speaker: msg.speaker, text: msg.text }]);
          setTimeout(() => scroll?.scrollTo({ y: 100_000, animated: true }), 50);
        } else if (msg.type === "ended") reason.set(msg.reason);
        else if (msg.type === "error") refused = msg.code;
      },
      closed(failed) {
        if (failed || refused) problem.set(m().conversationRefused(refused));
        phase.set("over");
        markChanged();
        void summarize(started.sessionId);
      },
      silent: (device) => problem.set(m().micSilent(device)),
    });
    v.connect(started.url, started.ticket);
  };

  const again = () => {
    voice.set(undefined);
    captions.set([]);
    reason.set("");
    result.set(undefined);
    problem.set("");
    phase.set("check");
  };

  const session = () => result()?.session;
  const shown = (): readonly Caption[] => {
    const lines = result()?.lines ?? [];
    return lines.length > 0 ? lines.map((l) => ({ speaker: l.speaker === "tutor" ? "tutor" : "learner", text: l.text })) : captions();
  };
  const ended = () => (session()?.status === "ended" ? (session()?.reason ?? "") : reason());

  return (
    <Scroll ref={(r) => (scroll = r)} style={{ flex: 1 }}>
      <View style={{ alignSelf: "center", gap: 16, maxWidth: 720, padding: 16, paddingBottom: 32, width: "100%" }}>
        <Text style={{ color: colors().ink, fontSize: 24, fontWeight: "700" }}>{tx(props.conv.title)}</Text>
        <Card>
          <Muted>{m().yourTask}</Muted>
          <Text style={{ color: colors().ink, fontSize: 15 }}>{tx(props.conv.task)}</Text>
          <Muted>{m().aboutMinutes(props.conv.minutes)}</Muted>
        </Card>
        <If when={problem()}>
          <ErrorNote message={problem()} />
        </If>

        <If when={phase() === "check"}>
          <Card>
            <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().micCheck}</Text>
            <Muted>{m().micCheckBody}</Muted>
            <If when={voice()} else={<Action label={m().micAllow} onPress={() => void allow()} />}>
              <Bar share={level()} color={colors().good} />
              <Action label={m().beginConversation} disabled={!props.conv.available} onPress={() => void begin()} />
            </If>
          </Card>
        </If>

        <If when={phase() === "connecting"}>
          <Muted>{m().connecting}</Muted>
        </If>

        <If when={phase() === "live" || phase() === "over"}>
          <Card>
            <If when={phase() === "live"}>
              <Muted>{m().yourTurn}</Muted>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
                <View style={{ width: 48 }}>
                  <Muted>{m().tutor}</Muted>
                </View>
                <View style={{ flex: 1 }}>
                  <Bar share={tutorLevel()} color={colors().accent} />
                </View>
              </View>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
                <View style={{ width: 48 }}>
                  <Muted>{m().you}</Muted>
                </View>
                <View style={{ flex: 1 }}>
                  <Bar share={level()} color={colors().good} />
                </View>
              </View>
            </If>
            <If when={phase() === "over"}>
              <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().conversationOver}</Text>
              <If when={ended()}>
                <Muted>{m().endReasons[ended()] ?? ""}</Muted>
              </If>
              <If when={session()?.status === "ended"}>
                <Muted>{`${m().youSaid(session()?.learnerLines ?? 0)} · ${m().minutes(Math.max(1, Math.round((session()?.durationSecs ?? 0) / 60)))}`}</Muted>
              </If>
              <If when={session()?.status === "ended" && (result()?.lines.length ?? 0) === 0 && captions().length > 0}>
                <Muted>{m().transcriptNotKept}</Muted>
              </If>
            </If>
            <View style={{ gap: 10 }}>
              <Each of={shown()}>{(c) => <Line caption={c()} />}</Each>
            </View>
            <If
              when={phase() === "live"}
              else={
                <View style={{ gap: 8 }}>
                  <If when={props.conv.available}>
                    <Quiet label={m().talkAgain} onPress={again} />
                  </If>
                  <Quiet label={m().backToLearn} onPress={() => nav.pop()} />
                </View>
              }
            >
              <Quiet label={m().endConversation} onPress={() => voice()?.finish()} />
            </If>
          </Card>
        </If>
      </View>
    </Scroll>
  );
}

/** Talk is one spoken conversation with the AI tutor (S6): a microphone check, live captions, and how it went. */
export function Talk(props: { courseId: string; conversationId: string }) {
  const rpc = conversationsQuery(() => props.courseId);
  return (
    <NavPage headerStyle={headerStyle()} title={m().conversations} header={<Header title={m().conversations} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={rpc} skeleton={<Skeleton rows={3} />}>
          {(data) => (
            <If
              when={data().conversations.find((c) => c.id === props.conversationId)}
              else={
                <View style={{ padding: 16 }}>
                  <Muted>{m().conversationNotOffered}</Muted>
                </View>
              }
            >
              {(conv) => <Live conv={conv()} courseId={props.courseId} />}
            </If>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
