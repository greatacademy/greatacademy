import { computed, List, Scroll, Text, View } from "nsh";
import { NavPage } from "nsh/base";
import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { catalog } from "../lib/rpc.ts";
import { token } from "../lib/session.ts";
import { Action, colors, followScroll, headerStyle, Loaded } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** CourseOutline introduces a course. A course is chosen at sign-up and changed in settings, not here. */
export function CourseOutline(props: { courseId: string }) {
  const rpc = query(["course", props.courseId], ({ signal }) => catalog.getCourse({ courseId: props.courseId }, { signal }));
  const title = computed(() => tx(rpc()?.course?.title));

  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={rpc}>
          {(data) => (
            <Scroll style={{ flex: 1 }} onScroll={followScroll()} scrollEventThrottle={16}>
              <View style={{ padding: 16, gap: 12 }}>
                <If when={!token()}>
                  <Action label={m().signIn} onPress={() => nav.push({ name: "sign-in" })} />
                </If>
                <Text style={{ color: colors().ink, fontSize: 15, lineHeight: 22 }}>{tx(data().course?.description)}</Text>
                {/* A list binds the units that show and the rest over the next frames, so the page opens without a pause. */}
                <List viewport="parent" each={data().course?.units ?? []} estimatedItemSize={360} contentStyle={{ gap: 12 }}>
                  {(unit) => (
                    <View
                      style={{
                        backgroundColor: colors().surface,
                        borderColor: colors().line,
                        borderWidth: 1,
                        borderRadius: 12,
                        padding: 16,
                        gap: 6,
                      }}
                    >
                      <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{tx(unit().title)}</Text>
                      <Each of={unit().modules}>
                        {(module) => (
                          <View style={{ gap: 4, marginTop: 8 }}>
                            <Text style={{ color: colors().ink, fontSize: 15, fontWeight: "600" }}>{tx(module().title)}</Text>
                            <Each of={module().topics} key={(topic) => topic.id}>
                              {(topic) => <Text style={{ color: colors().ink, fontSize: 15 }}>· {tx(topic().title)}</Text>}
                            </Each>
                          </View>
                        )}
                      </Each>
                    </View>
                  )}
                </List>
              </View>
            </Scroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
