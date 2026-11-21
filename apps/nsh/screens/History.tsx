import type { FinishedSession } from "@ga/proto/learning/v1/learning_pb";
import { Text, View } from "nsh";
import { NavPage } from "nsh/base";
import { m } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { learning } from "../lib/rpc.ts";
import { Card, colors, headerStyle, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";
import { describeTask } from "./TaskCard.tsx";

const pad = (n: number) => String(n).padStart(2, "0");

/** dateOf is a finished session's day on this device, as YYYY-MM-DD in both languages. */
function dateOf(at: bigint): string {
  const date = new Date(Number(at));
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** timeOf is a finished session's time of day on this device, as HH:MM. */
function timeOf(at: bigint): string {
  const date = new Date(Number(at));
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** byDay groups finished sessions, newest first, by the day they were finished, each day with the XP it earned. */
function byDay(sessions: readonly FinishedSession[]): { day: string; sessions: FinishedSession[]; xp: number }[] {
  const days: { day: string; sessions: FinishedSession[]; xp: number }[] = [];
  for (const s of sessions) {
    const day = dateOf(s.completedAt);
    const last = days[days.length - 1];
    if (last?.day === day) {
      last.sessions.push(s);
      last.xp += s.xp;
    } else days.push({ day, sessions: [s], xp: s.xp });
  }
  return days;
}

/** HistoryLine is one finished task: what it was, when (only the time under its day), its XP against the full XP and its score; it opens the task's result. */
export function HistoryLine(props: { session: FinishedSession; timeOnly?: boolean }) {
  const about = () => (props.session.task ? describeTask(props.session.task) : undefined);
  const tone = () => (props.session.blownOff ? colors().warn : props.session.passed ? colors().good : colors().bad);
  return (
    <View
      role="button"
      onPress={() => nav.push({ name: "session", sessionId: props.session.id })}
      style={{ alignItems: "center", borderColor: colors().line, borderTopWidth: 1, flexDirection: "row", gap: 12, paddingVertical: 10 }}
    >
      <View style={{ backgroundColor: tone(), borderRadius: 4, height: 32, width: 4 }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors().ink, fontSize: 15 }}>{about()?.title ?? ""}</Text>
        <Muted>
          {[
            about()?.label ?? "",
            props.timeOnly
              ? timeOf(props.session.completedAt)
              : `${dateOf(props.session.completedAt)} ${timeOf(props.session.completedAt)}`,
            props.session.blownOff ? m().rushed : "",
          ]
            .filter(Boolean)
            .join(" · ")}
        </Muted>
      </View>
      <View style={{ alignItems: "flex-end", gap: 2 }}>
        <Text style={{ color: props.session.xp < 0 ? colors().bad : colors().ink, fontSize: 15, fontWeight: "600" }}>
          {props.session.asked > 0 ? m().earnedOf(props.session.xp, props.session.fullXp) : m().earned(props.session.xp)}
        </Text>
        <If when={props.session.asked > 0}>
          <Muted>{m().score(props.session.correct, props.session.asked)}</Muted>
        </If>
      </View>
    </View>
  );
}

/** History lists the tasks a learner finished in a course, newest first; each opens its result. */
export function History(props: { courseId: string }) {
  const rpc = query(["sessions", props.courseId], ({ signal }) => learning.listSessions({ courseId: props.courseId }, { signal }));
  return (
    <NavPage headerStyle={headerStyle()} title={m().history} header={<Header title={m().history} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={rpc} skeleton={<Skeleton rows={5} />}>
          {(data) => (
            <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"}>
              <If
                when={data().sessions.length > 0}
                else={
                  <Card>
                    <Muted>{m().noHistory}</Muted>
                  </Card>
                }
              >
                <View style={{ gap: 12 }}>
                  <Each of={byDay(data().sessions)} key={(d) => d.day}>
                    {(d) => (
                      <Card>
                        <View style={{ alignItems: "baseline", flexDirection: "row", justifyContent: "space-between" }}>
                          <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{d().day}</Text>
                          <Text style={{ color: d().xp < 0 ? colors().bad : colors().muted, fontSize: 13 }}>{`${d().xp} XP`}</Text>
                        </View>
                        <Each of={d().sessions} key={(session) => session.id}>
                          {(session) => <HistoryLine session={session()} timeOnly />}
                        </Each>
                      </Card>
                    )}
                  </Each>
                </View>
              </If>
            </PullScroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
