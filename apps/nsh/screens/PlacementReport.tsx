import type { GetDashboardResponse } from "@ga/proto/learning/v1/learning_pb";
import { signal, Text, View } from "nsh";
import { dayText } from "../lib/dates.ts";
import { errorText, language, m, tx } from "../lib/i18n.ts";
import { markChanged, query } from "../lib/query.ts";
import { catalog, learning } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, Muted, Quiet } from "../lib/ui.tsx";

const DAY = 86_400_000;

/** PACES are the XP per day the report gives finish dates at, from gentle to intense. */
const PACES = [15, 30, 50, 70, 100];

/** useCourseChoice chooses or keeps a course for the learner, or for a learner the caller is a guardian of, then reads the pages again. */
function useCourseChoice(learnerId: string | undefined, after: () => void) {
  const busy = signal(false);
  const error = signal("");
  const run = async (call: () => Promise<unknown>) => {
    busy.set(true);
    error.set("");
    try {
      await call();
      markChanged();
      after();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return {
    busy,
    error,
    choose: (courseId: string) => run(() => learning.chooseCourse({ courseId, learnerId: learnerId ?? "" })),
    keep: (courseId: string) => run(() => learning.keepCourse({ courseId, learnerId: learnerId ?? "" })),
  };
}

/** courseTitle names a course by id from the catalog. */
function useCourseTitle() {
  const list = query(["courses"], ({ signal: abort }) => catalog.listCourses({}, { signal: abort }));
  return (id: string) => tx(list()?.courses.find((course) => course.id === id)?.title) || id;
}

/**
 * PlacementReport sums up a course's diagnostic: how much is known, the foundations
 * to fill in, when the course may be finished, and the course recommended. Whoever
 * chooses the course keeps it or takes the recommended one.
 */
export function PlacementReport(props: { dash: GetDashboardResponse; learnerId?: string; onAnswered: () => void }) {
  const title = useCourseTitle();
  const choice = useCourseChoice(props.learnerId, props.onAnswered);
  const date = (xpPerDay: number) => dayText(new Date(Date.now() + Math.ceil(props.dash.remainingXp / xpPerDay) * DAY), language());
  return (
    <If when={props.dash.report}>
      {(r) => (
        <Card>
          <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{m().reportTitle}</Text>
          <Text style={{ color: colors().ink, fontSize: 15 }}>{m().reportPlaced(r().placed, r().total)}</Text>
          <If when={r().foundations > 0}>
            <Muted>{m().reportFoundations(r().foundations)}</Muted>
          </If>
          <If when={props.dash.remainingXp > 0}>
            <View style={{ gap: 2 }}>
              <Each of={PACES}>{(pace) => <Muted>{m().reportFinish(pace(), date(pace()))}</Muted>}</Each>
            </View>
          </If>
          <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>
            {r().recommended ? (r().earlier ? m().reportEarlier : m().reportLater)(title(r().recommended)) : m().reportStay}
          </Text>
          <If when={choice.error()}>
            <ErrorNote message={choice.error()} />
          </If>
          <If when={props.dash.canDecide} else={<Muted>{m().reportAskGuardian}</Muted>}>
            <If when={r().recommended}>
              <Action
                label={m().reportSwitch(title(r().recommended))}
                disabled={choice.busy()}
                onPress={() => void choice.choose(r().recommended)}
              />
            </If>
            <If
              when={r().recommended}
              else={<Action label={m().reportOk} disabled={choice.busy()} onPress={() => void choice.keep(props.dash.courseId)} />}
            >
              <Quiet label={m().reportKeep} disabled={choice.busy()} onPress={() => void choice.keep(props.dash.courseId)} />
            </If>
          </If>
        </Card>
      )}
    </If>
  );
}

/**
 * StartEarlier offers, while a course's diagnostic is due and the course needs more topics of earlier courses than its
 * own, to start with the course it builds on instead, as on the web.
 */
export function StartEarlier(props: { dash: GetDashboardResponse; learnerId?: string; onChosen: () => void }) {
  const title = useCourseTitle();
  const choice = useCourseChoice(props.learnerId, props.onChosen);
  return (
    <If when={props.dash.startEarlier && !props.dash.active}>
      <Card>
        <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{m().earlierTitle}</Text>
        <Text style={{ color: colors().ink, fontSize: 15 }}>{m().earlierBody(props.dash.foundations, title(props.dash.startEarlier))}</Text>
        <If when={choice.error()}>
          <ErrorNote message={choice.error()} />
        </If>
        <If when={props.dash.canDecide} else={<Muted>{m().earlierAskGuardian}</Muted>}>
          <Quiet
            label={m().earlierSwitch(title(props.dash.startEarlier))}
            disabled={choice.busy()}
            onPress={() => void choice.choose(props.dash.startEarlier)}
          />
        </If>
      </Card>
    </If>
  );
}

/** CourseDone congratulates on a finished course and offers the courses that follow it. */
export function CourseDone(props: { dash: GetDashboardResponse; learnerId?: string; onChosen: () => void }) {
  const title = useCourseTitle();
  const choice = useCourseChoice(props.learnerId, props.onChosen);
  return (
    <If when={props.dash.finished}>
      <Card>
        <Text style={{ color: colors().good, fontSize: 17, fontWeight: "600" }}>{m().courseDone}</Text>
        <If when={props.dash.nextCourses.length > 0}>
          <Muted>{m().courseDoneBody}</Muted>
          <If when={choice.error()}>
            <ErrorNote message={choice.error()} />
          </If>
          <If when={props.dash.canDecide} else={<Muted>{m().courseDoneAsk}</Muted>}>
            <Each of={props.dash.nextCourses}>
              {(id) => <Action label={title(id())} disabled={choice.busy()} onPress={() => void choice.choose(id())} />}
            </Each>
          </If>
        </If>
      </Card>
    </If>
  );
}
