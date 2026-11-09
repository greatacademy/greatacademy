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

/** dayOf is a finished session's day and time on this device, as YYYY-MM-DD HH:MM in both languages. */
function dayOf(at: bigint): string {
  const date = new Date(Number(at));
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** HistoryLine is one finished task: what it was, when, its XP and score; it opens the task's result. */
export function HistoryLine(props: { session: FinishedSession }) {
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
          {[about()?.label ?? "", dayOf(props.session.completedAt), props.session.blownOff ? m().rushed : ""].filter(Boolean).join(" · ")}
        </Muted>
      </View>
      <View style={{ alignItems: "flex-end", gap: 2 }}>
        <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{m().earned(props.session.xp)}</Text>
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
              <Card>
                <If when={data().sessions.length > 0} else={<Muted>{m().noHistory}</Muted>}>
                  <Each of={data().sessions} key={(session) => session.id}>
                    {(session) => <HistoryLine session={session()} />}
                  </Each>
                </If>
              </Card>
            </PullScroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
