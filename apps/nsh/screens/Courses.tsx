import { computed, resource, Scroll, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { colors, headerStyle, Loaded, Muted } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

function AccountButton() {
  return (
    <Text
      role="button"
      onPress={() => nav.push({ name: token() ? "account" : "sign-in" })}
      style={{ color: colors().accent, fontSize: 15 }}
    >
      {token() ? m().account : m().signIn}
    </Text>
  );
}

/** Courses is the course list: the first screen, reachable without an account. */
export function Courses() {
  const rpc = resource(({ signal }) => catalog.listCourses({}, { signal }));
  // Read again whenever the learner comes back to this page.
  const visible = computed(() => nav.routes().at(-1)?.name === "courses" && token());
  const profile = resource(visible, (_, { signal }) => learning.getProfile({ timeZone: timeZone() }, { signal }));
  const mine = computed(() => profile()?.enrollments ?? []);
  return (
    <NavPage
      headerStyle={headerStyle()}
      title={m().courses}
      header={<Header title={m().courses} right={<AccountButton />} />}
      headerRight={<AccountButton />}
    >
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={rpc}>
          {(data) => (
            <Scroll style={{ flex: 1 }}>
              <View style={{ padding: 16, gap: 12 }}>
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
            </Scroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
