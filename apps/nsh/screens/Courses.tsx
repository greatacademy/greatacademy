import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { computed, List, signal, Text, View } from "nsh";
import { AlertDialog, NavPage } from "nsh/base";
import { errorText, m, tx } from "../lib/i18n.ts";
import { nav, openTab } from "../lib/nav.ts";
import { chooseSubject, subjectChoice } from "../lib/prefs.ts";
import { query } from "../lib/query.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { subjectsOf, tint } from "../lib/subject.tsx";
import { Action, cellStyle, colors, ErrorNote, Grid, headerStyle, Loaded, Muted, PullScroll, Segmented } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

function SignInButton() {
  return (
    <Text role="button" onPress={() => nav.push({ name: "sign-in" })} style={{ color: colors().accent, fontSize: 15 }}>
      {m().signIn}
    </Text>
  );
}

/** Courses is every course, one subject at a time: opened from the welcome page, or from the subject switcher. */
export function Courses() {
  return (
    <NavPage
      headerStyle={headerStyle()}
      title={m().courses}
      header={<Header title={m().courses} right={token() ? undefined : <SignInButton />} />}
      headerRight={token() ? undefined : <SignInButton />}
    >
      <CourseList visible={() => nav.routes().at(-1)?.name === "courses"} />
    </NavPage>
  );
}

/** shelves groups courses by their `group`, in the order the catalog lists them; courses with none go last. */
function shelves(courses: readonly Course[]): { title: string; courses: Course[] }[] {
  const found = new Map<string, Course[]>();
  for (const course of courses) {
    const title = tx(course.group);
    found.set(title, [...(found.get(title) ?? []), course]);
  }
  const named = [...found].filter(([title]) => title).map(([title, list]) => ({ title, courses: list }));
  const rest = found.get("") ?? [];
  return rest.length > 0 ? [...named, { title: named.length > 0 ? m().otherCourses : "", courses: rest }] : named;
}

/** ShelfRow is one row of the course list: a shelf's title, or up to two of its courses, side by side in a wide window. */
type ShelfRow = { title: string } | { courses: Course[] };

/** shelfRows lays the shelves out as rows, so a list binds only the rows that show. */
function shelfRows(courses: readonly Course[]): ShelfRow[] {
  return shelves(courses).flatMap(({ title, courses: list }) => [
    ...(title ? [{ title }] : []),
    ...Array.from({ length: Math.ceil(list.length / 2) }, (_, at) => ({ courses: list.slice(at * 2, at * 2 + 2) })),
  ]);
}

const cardStyle = () => ({
  backgroundColor: colors().surface,
  borderColor: colors().line,
  borderRadius: 12,
  borderWidth: 1,
  gap: 6,
  padding: 16,
});

/** Choosing is what a course list chooses for: the caller's course, or that of a learner they are a guardian of. */
export interface Choosing {
  readonly learnerId?: string;
  /** current is the course now current, which is marked instead of offered; choosing another asks first. */
  readonly current?: string;
  readonly onChosen: (courseId: string, subjectId: string) => void;
}

/**
 * CourseList lists the courses of one subject: the learner's own first with how far they are, then the rest by
 * shelf. Given `subject` it lists that subject's; without, tabs at its top pick the subject. `visible` says when the
 * page shows, to read the learner's courses again. Given `choose`, it is the list a course is chosen from.
 */
export function CourseList(props: { visible: () => boolean; choose?: Choosing; intro?: string; subject?: string }) {
  const rpc = query(["courses"], ({ signal }) => catalog.listCourses({}, { signal }));
  const visible = computed(() => props.visible() && token());
  const profile = query(
    visible,
    () => ["profile"],
    (_, { signal }) => learning.getProfile({ timeZone: timeZone() }, { signal }),
  );
  const picked = signal(props.subject ?? subjectChoice());
  const subjects = computed(() => {
    const list = rpc();
    return list ? subjectsOf(list) : [];
  });
  // The subject listed: the one asked for, else the one picked in the tabs while the catalog has it, else the first.
  const shown = computed(() => props.subject ?? subjects().find((s) => s.id === picked())?.id ?? subjects()[0]?.id ?? "");
  const mine = computed(() =>
    token() && !props.choose ? (profile()?.enrollments ?? []).filter((enrollment) => enrollment.subjectId === shown()) : [],
  );
  const enrolled = computed(() => new Set(mine().map((enrollment) => enrollment.courseId)));
  const busy = signal(false);
  const error = signal("");
  const choose = async (choosing: Choosing, courseId: string, subjectId: string) => {
    if (choosing.current) {
      const title = (id: string) => tx(rpc()?.courses.find((course) => course.id === id)?.title) || id;
      const { action } = await AlertDialog.show({
        title: m().switchConfirmTitle(title(courseId)),
        description: m().switchConfirmBody(title(choosing.current)),
        actions: [
          { id: "cancel", label: m().cancel, role: "cancel" },
          { id: "switch", label: m().switchConfirm },
        ],
      });
      if (action !== "switch") return;
    }
    busy.set(true);
    error.set("");
    try {
      await learning.chooseCourse({ courseId, learnerId: choosing.learnerId ?? "" });
      choosing.onChosen(courseId, subjectId);
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors().page }}>
      <Loaded rpc={rpc}>
        {(data) => (
          <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"} underBar>
            <View style={{ gap: 12 }}>
              <If when={props.intro}>
                <Text style={{ color: colors().ink, fontSize: 15, lineHeight: 22 }}>{props.intro}</Text>
              </If>
              <If when={!props.subject && subjects().length > 1}>
                <Segmented
                  label={m().subjects}
                  items={subjects().map((s) => ({ value: s.id, title: tx(s.title) }))}
                  value={shown()}
                  onChange={(id) => picked.set(id)}
                />
              </If>
              <If when={error()}>
                <ErrorNote message={error()} />
              </If>
              <If when={mine().length > 0}>
                <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().myCourses}</Text>
                <Grid>
                  <Each of={mine()} key={(enrollment) => enrollment.courseId}>
                    {(enrollment) => {
                      const stats = () => enrollment().stats;
                      const share = () => ((stats()?.learned ?? 0) / Math.max(1, stats()?.total ?? 0)) * 100;
                      return (
                        <View
                          role="button"
                          onPress={() => {
                            chooseSubject(enrollment().subjectId);
                            openTab("learn");
                          }}
                          style={{ ...cardStyle(), ...cellStyle, borderColor: colors().accent }}
                        >
                          <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>
                            {tx(data().courses.find((course) => course.id === enrollment().courseId)?.title) || enrollment().courseId}
                          </Text>
                          <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 6, overflow: "hidden" }}>
                            <View
                              style={{
                                backgroundColor: tint(subjects().find((s) => s.id === enrollment().subjectId)).strong,
                                height: 6,
                                width: `${share()}%`,
                              }}
                            />
                          </View>
                          <Muted>{m().topicsLearned(stats()?.learned ?? 0, stats()?.total ?? 0)}</Muted>
                        </View>
                      );
                    }}
                  </Each>
                </Grid>
              </If>
              <List
                viewport="parent"
                each={shelfRows(data().courses.filter((course) => course.subjectId === shown() && !enrolled().has(course.id)))}
                keyExtractor={(row) => ("title" in row ? `shelf:${row.title}` : row.courses.map((course) => course.id).join(","))}
                estimatedItemSize={170}
                contentStyle={{ gap: 12 }}
              >
                {(row) => (
                  <If
                    when={"title" in row() ? (row() as { title: string }).title : ""}
                    else={
                      <Grid>
                        <Each of={"courses" in row() ? (row() as { courses: Course[] }).courses : []} key={(course) => course.id}>
                          {(course) => (
                            <View
                              role="button"
                              onPress={() => nav.push({ name: "course", courseId: course().id })}
                              style={{ ...cardStyle(), ...cellStyle }}
                            >
                              <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{tx(course().title)}</Text>
                              <Text style={{ color: colors().ink, fontSize: 15 }}>{tx(course().description)}</Text>
                              <Muted>{m().topics(course().topicCount)}</Muted>
                              <If when={props.choose}>
                                {(choosing) => (
                                  <If
                                    when={choosing().current !== course().id}
                                    else={
                                      <Text style={{ color: colors().accent, fontSize: 15, fontWeight: "600" }}>{m().currentCourse}</Text>
                                    }
                                  >
                                    <Action
                                      label={m().chooseThis}
                                      disabled={busy()}
                                      onPress={() => void choose(choosing(), course().id, course().subjectId)}
                                    />
                                  </If>
                                )}
                              </If>
                            </View>
                          )}
                        </Each>
                      </Grid>
                    }
                  >
                    {(title) => <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600", marginTop: 8 }}>{title()}</Text>}
                  </If>
                )}
              </List>
            </View>
          </PullScroll>
        )}
      </Loaded>
    </View>
  );
}
