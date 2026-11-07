import { resource, Scroll, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { catalog } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { colors, Loaded, Muted } from "../lib/ui.tsx";
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
  return (
    <NavPage title={m().courses} header={<Header title={m().courses} right={<AccountButton />} />} headerRight={<AccountButton />}>
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={rpc}>
          {(data) => (
            <Scroll style={{ flex: 1 }}>
              <View style={{ padding: 16, gap: 12 }}>
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
