import { Text, View } from "nsh";
import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { courseTitle, type Place, tint, usePlace } from "../lib/subject.tsx";
import { Action, Card, colors, Loaded, Muted, PullScroll, Quiet, Row, Section, Skeleton } from "../lib/ui.tsx";
import { Bar } from "./LearnTab.tsx";

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
 * CourseTab is the Course page of the subject shown (docs/experience.md §3): the current course and the decision to
 * change it, which only whoever decides for the learner makes.
 */
export function CourseTab(props: { visible: () => boolean }) {
  const { rpc, place } = usePlace(props.visible);
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
