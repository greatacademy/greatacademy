import type { GetDashboardResponse } from "@ga/proto/learning/v1/learning_pb";
import { computed, signal, Text, View, windowSize } from "nsh";
import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { markChanged, query } from "../lib/query.ts";
import { courseTitle, type Place, usePlace } from "../lib/subject.tsx";
import { colors, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";
import { CourseSequence, loadMap, MapBody, useCourseSequence } from "./CourseMap.tsx";
import { SubjectStart } from "./CourseTab.tsx";
import { ForecastCard, useDashboard, WeeklyGoals } from "./SubjectCards.tsx";

/** ASIDE_FROM is the window width, in points, from which the goals and the forecast sit in a column beside the map. */
const ASIDE_FROM = 1024;
const ASIDE_WIDTH = 320;

/** Cards are the goals and the forecast, the same cards the Learn tab shows. */
function Cards(props: { place: Place; dash: GetDashboardResponse; onChanged: () => void }) {
  return (
    <>
      <WeeklyGoals dash={props.dash} place={props.place} />
      <ForecastCard place={props.place} dash={props.dash} onChanged={props.onChanged} />
    </>
  );
}

/**
 * Progress is the Progress page of the subject shown (docs/experience.md §3), laid out as the web's: the course with
 * the way to its history, the course sequence to look at the courses taken before and those that follow, the progress map, and beside it the weekly goals and when the course may be finished; a
 * narrow window shows the goals first.
 */
export function Progress(props: { visible: () => boolean }) {
  const { rpc, place } = usePlace(props.visible);
  const dash = useDashboard(props.visible, place);
  const course = computed(() => (props.visible() && place()?.enrollment?.courseId) || undefined);
  // The map shows the current course, or another of the course sequence the learner picks.
  const picked = signal<string | undefined>(undefined);
  const sequence = useCourseSequence(course);
  const viewed = computed(() => {
    const id = picked();
    return id && sequence()?.courses.some((c) => c.courseId === id) ? id : course();
  });
  const map = query(
    viewed,
    (courseId) => ["map", courseId],
    (courseId, { signal }) => loadMap(courseId, signal),
  );
  const wide = () => windowSize().width >= ASIDE_FROM;
  const changed = () => {
    markChanged();
    dash.refetch();
  };
  const refresh = () => {
    dash.refetch();
    sequence.refetch();
    map.refetch();
  };
  return (
    <View style={{ backgroundColor: colors().page, flex: 1 }}>
      <Loaded rpc={rpc} skeleton={<Skeleton rows={3} />}>
        {() => (
          <If when={place()}>
            {(here) => (
              <If
                when={here().enrollment}
                else={<SubjectStart place={here()} onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"} />}
              >
                <Loaded rpc={dash} skeleton={<Skeleton rows={3} />}>
                  {(d) => (
                    <PullScroll onRefresh={refresh} refreshing={dash.state() === "refreshing"} underBar>
                      <View style={{ gap: 16 }}>
                        <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
                          <Text style={{ color: colors().ink, flex: 1, fontSize: 24, fontWeight: "700" }}>
                            {courseTitle(here().data.list, viewed() ?? d().courseId)}
                          </Text>
                          <Text
                            role="button"
                            onPress={() => nav.push({ name: "history", courseId: d().courseId })}
                            style={{ color: colors().accent, fontSize: 15 }}
                          >
                            {m().history}
                          </Text>
                        </View>
                        <If when={!wide()}>
                          <Cards place={here()} dash={d()} onChanged={changed} />
                        </If>
                        <View style={{ alignItems: "flex-start", flexDirection: "row", gap: 24 }}>
                          <View style={{ flex: 1, gap: 12, minWidth: 0 }}>
                            <If when={(sequence()?.courses.length ?? 0) > 1}>
                              <View style={{ gap: 8 }}>
                                <Muted>{m().sequence.label}</Muted>
                                <CourseSequence
                                  courses={sequence()?.courses ?? []}
                                  currentId={d().courseId}
                                  selected={viewed() ?? d().courseId}
                                  onSelect={(id) => picked.set(id)}
                                />
                              </View>
                            </If>
                            <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().progressMap}</Text>
                            <Loaded rpc={map} skeleton={<Skeleton rows={4} />}>
                              {(loaded) => <MapBody map={loaded()} />}
                            </Loaded>
                          </View>
                          <If when={wide()}>
                            <View style={{ gap: 12, width: ASIDE_WIDTH }}>
                              <Cards place={here()} dash={d()} onChanged={changed} />
                            </View>
                          </If>
                        </View>
                      </View>
                    </PullScroll>
                  )}
                </Loaded>
              </If>
            )}
          </If>
        )}
      </Loaded>
    </View>
  );
}
