import { computed, resource, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { colors, headerStyle, Loaded, Muted, PullScroll } from "../lib/ui.tsx";
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

/** CourseList lists the courses, the learner's own first; `visible` says when the page shows, to read the learner's courses again. */
export function CourseList(props: { visible: () => boolean }) {
  const rpc = resource(({ signal }) => catalog.listCourses({}, { signal }));
  const visible = computed(() => props.visible() && token());
  const profile = resource(visible, (_, { signal }) => learning.getProfile({ timeZone: timeZone() }, { signal }));
  const mine = computed(() => profile()?.enrollments ?? []);
  return (
    <View style={{ flex: 1, backgroundColor: colors().page }}>
      <Loaded rpc={rpc}>
        {(data) => (
          <PullScroll onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"}>
            <View style={{ gap: 12 }}>
              <If when={token() && mine().length > 0}>
                <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().myCourses}</Text>
                <Each of={mine()} key={(enrollment) => enrollment.courseId}>
                  {(enrollment) => (
                    <View
                      role="button"
                      onPress={() => nav.push({ name: "learn", courseId: enrollment().courseId })}
                      style={{
                        backgroundColor: colors().surface,
                        borderColor: colors().accent,
                        borderRadius: 12,
                        borderWidth: 1,
                        gap: 4,
                        padding: 16,
                      }}
                    >
                      <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>
                        {tx(data().courses.find((course) => course.id === enrollment().courseId)?.title) || enrollment().courseId}
                      </Text>
                      <Muted>{m().topicsLearned(enrollment().stats?.learned ?? 0, enrollment().stats?.total ?? 0)}</Muted>
                    </View>
                  )}
                </Each>
              </If>
              <Each of={data().courses} key={(course) => course.id}>
                {(course) => (
                  <View
                    role="button"
                    onPress={() => nav.push({ name: "course", courseId: course().id })}
                    style={{
                      backgroundColor: colors().surface,
                      borderColor: colors().line,
                      borderWidth: 1,
                      borderRadius: 12,
                      padding: 16,
                      gap: 6,
                    }}
                  >
                    <Muted>{tx(course().subjectTitle)}</Muted>
                    <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{tx(course().title)}</Text>
                    <Text style={{ color: colors().ink, fontSize: 15 }}>{tx(course().description)}</Text>
                    <Muted>{m().topics(course().topicCount)}</Muted>
                  </View>
                )}
              </Each>
            </View>
          </PullScroll>
        )}
      </Loaded>
    </View>
  );
}
