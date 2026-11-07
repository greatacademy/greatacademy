import { computed, resource, Scroll, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { m, tx } from "../lib/i18n.ts";
import { catalog } from "../lib/rpc.ts";
import { colors, Loaded, Muted } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** CourseOutline is a course's outline. Enrolling and learning stay on the web app for now. */
export function CourseOutline(props: { courseId: string }) {
  const rpc = resource(({ signal }) => catalog.getCourse({ courseId: props.courseId }, { signal }));
  const title = computed(() => tx(rpc()?.course?.title));
  return (
    <NavPage title={title()} header={<Header title={title()} />}>
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={rpc}>
          {(data) => (
            <Scroll style={{ flex: 1 }}>
              <View style={{ padding: 16, gap: 12 }}>
                <Muted>{m().soon}</Muted>
                <Each of={data().course?.units ?? []}>
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
                </Each>
              </View>
            </Scroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
