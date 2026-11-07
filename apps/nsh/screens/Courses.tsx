import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { computed, List, Text, View } from "nsh";
import { NavPage } from "nsh/base";
import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { cellStyle, colors, Grid, headerStyle, Loaded, Muted, PullScroll } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

function SignInButton() {
  return (
    <Text role="button" onPress={() => nav.push({ name: "sign-in" })} style={{ color: colors().accent, fontSize: 15 }}>
      {m().signIn}
    </Text>
  );
}

/** Courses is the course list of someone signed out, opened from the welcome page. */
export function Courses() {
  return (
    <NavPage
      headerStyle={headerStyle()}
      title={m().courses}
      header={<Header title={m().courses} right={<SignInButton />} />}
      headerRight={<SignInButton />}
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

/** CourseList lists the courses: the learner's own first with how far they are, then the rest by shelf. `visible` says when the page shows, to read the learner's courses again. */
export function CourseList(props: { visible: () => boolean }) {
  const rpc = query(["courses"], ({ signal }) => catalog.listCourses({}, { signal }));
  const visible = computed(() => props.visible() && token());
  const profile = query(
    visible,
    () => ["profile"],
    (_, { signal }) => learning.getProfile({ timeZone: timeZone() }, { signal }),
  );
  const mine = computed(() => (token() ? (profile()?.enrollments ?? []) : []));
  const enrolled = computed(() => new Set(mine().map((enrollment) => enrollment.courseId)));
  return (
    <View style={{ flex: 1, backgroundColor: colors().page }}>
      <Loaded rpc={rpc}>
        {(data) => (
          <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"}>
            <View style={{ gap: 12 }}>
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
                          onPress={() => nav.push({ name: "learn", courseId: enrollment().courseId })}
                          style={{ ...cardStyle(), ...cellStyle, borderColor: colors().accent }}
                        >
                          <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>
                            {tx(data().courses.find((course) => course.id === enrollment().courseId)?.title) || enrollment().courseId}
                          </Text>
                          <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 6, overflow: "hidden" }}>
                            <View style={{ backgroundColor: colors().good, height: 6, width: `${share()}%` }} />
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
                each={shelfRows(data().courses.filter((course) => !enrolled().has(course.id)))}
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
                              <Muted>{tx(course().subjectTitle)}</Muted>
                              <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{tx(course().title)}</Text>
                              <Text style={{ color: colors().ink, fontSize: 15 }}>{tx(course().description)}</Text>
                              <Muted>{m().topics(course().topicCount)}</Muted>
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
