import type { GetDashboardResponse } from "@ga/proto/learning/v1/learning_pb";
import { signal, Text, View } from "nsh";
import { AlertDialog } from "nsh/base";
import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { markChanged } from "../lib/query.ts";
import { learning } from "../lib/rpc.ts";
import { courseTitle, type Place, tint, usePlace } from "../lib/subject.tsx";
import { Action, Card, colors, ErrorNote, Loaded, Muted, PullScroll, Quiet, Row, Section, Skeleton } from "../lib/ui.tsx";
import { Bar, useDashboard } from "./SubjectCards.tsx";

/**
 * SubjectStart is a subject the learner has no course in yet: the way to choose one, or, for the learner of a
 * guardian, that the guardian chooses it.
 */
export function SubjectStart(props: { place: Place; onRefresh: () => void; refreshing: boolean }) {
  const subject = () => tx(props.place.subject?.title);
  return (
    <PullScroll onRefresh={props.onRefresh} refreshing={props.refreshing} underBar>
      <Card>
        <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{m().chooseIn(subject())}</Text>
        <Muted>{props.place.canDecide ? m().chooseBody : m().guardianChoosesWait}</Muted>
        <If when={props.place.canDecide}>
          <Action label={m().chooseCourse} onPress={() => nav.push({ name: "choose", subjectId: props.place.subject?.id ?? "" })} />
        </If>
      </Card>
    </PullScroll>
  );
}

/** CurrentCourse is the course the learner is on in the subject, with how far they are and its outline. */
function CurrentCourse(props: { place: Place; courseId: string }) {
  const course = () => props.place.data.list.courses.find((c) => c.id === props.courseId);
  const stats = () => props.place.enrollment?.stats;
  return (
    <Card>
      <Muted>{m().currentCourse}</Muted>
      <Text style={{ color: colors().ink, fontSize: 20, fontWeight: "700" }}>{courseTitle(props.place.data.list, props.courseId)}</Text>
      <If when={tx(course()?.description)}>
        <Text style={{ color: colors().ink, fontSize: 15, lineHeight: 21 }}>{tx(course()?.description)}</Text>
      </If>
      <Bar share={(stats()?.learned ?? 0) / Math.max(1, stats()?.total ?? 0)} color={tint(props.place.subject).strong} />
      <Muted>{m().topicsLearned(stats()?.learned ?? 0, stats()?.total ?? 0)}</Muted>
      <Quiet label={m().courseOutline} onPress={() => nav.push({ name: "course", courseId: props.courseId })} />
    </Card>
  );
}

/**
 * StartOver lets whoever decides for the learner start the subject over (docs/experience.md §3): retake the course's
 * diagnostic, or reset the subject's knowledge profile. Each asks first; XP and history stay.
 */
function StartOver(props: { dash: GetDashboardResponse; onDone: () => void }) {
  const busy = signal(false);
  const error = signal("");
  const run = async (what: "retake" | "reset") => {
    const { action } = await AlertDialog.show({
      title: what === "retake" ? m().retakeConfirmTitle : m().resetConfirmTitle,
      description: what === "retake" ? m().retakeConfirmBody : m().resetConfirmBody,
      actions: [
        { id: "cancel", label: m().cancel, role: "cancel" },
        { id: "go", label: what === "retake" ? m().retakeDiagnostic : m().resetKnowledge },
      ],
    });
    if (action !== "go") return;
    busy.set(true);
    error.set("");
    try {
      if (what === "retake") await learning.retakeDiagnostic({ courseId: props.dash.courseId, learnerId: "" });
      else await learning.resetKnowledge({ subjectId: props.dash.subjectId, learnerId: "" });
      props.onDone();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <Section title={m().startOver}>
      <If when={error()}>
        <ErrorNote message={error()} />
      </If>
      <If when={props.dash.diagnosed}>
        <Row title={m().retakeDiagnostic} detail={m().retakeBody} onPress={() => !busy() && void run("retake")} />
      </If>
      <Row title={m().resetKnowledge} detail={m().resetBody} onPress={() => !busy() && void run("reset")} />
    </Section>
  );
}

/**
 * CourseTab is the Course page of the subject shown (docs/experience.md §3): the current course and the decisions to
 * change it or start the subject over, which only whoever decides for the learner makes.
 */
export function CourseTab(props: { visible: () => boolean }) {
  const { rpc, place } = usePlace(props.visible);
  const dash = useDashboard(props.visible, place);
  const startedOver = () => {
    markChanged();
    rpc.refetch();
    dash.refetch();
  };
  return (
    <View style={{ backgroundColor: colors().page, flex: 1 }}>
      <Loaded rpc={rpc} skeleton={<Skeleton rows={2} />}>
        {() => (
          <If when={place()}>
            {(here) => (
              <If
                when={here().enrollment}
                else={<SubjectStart place={here()} onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"} />}
              >
                {(enrollment) => (
                  <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"} underBar>
                    <View style={{ gap: 16 }}>
                      <CurrentCourse place={here()} courseId={enrollment().courseId} />
                      <Section title={m().changeCourse}>
                        <Muted>{m().changeCourseWhen}</Muted>
                        <If when={here().canDecide} else={<Muted>{m().guardianDecides}</Muted>}>
                          <Row
                            title={m().changeCourse}
                            onPress={() =>
                              nav.push({ name: "choose", subjectId: here().subject?.id ?? "", current: enrollment().courseId })
                            }
                          />
                        </If>
                      </Section>
                      <If when={here().canDecide}>
                        <If when={dash()}>{(d) => <StartOver dash={d()} onDone={startedOver} />}</If>
                      </If>
                    </View>
                  </PullScroll>
                )}
              </If>
            )}
          </If>
        )}
      </Loaded>
    </View>
  );
}
